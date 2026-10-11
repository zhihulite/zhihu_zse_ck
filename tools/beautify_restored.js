#!/usr/bin/env node
// 美化已还原的 JS：M_SET -> 对象字面量、SUB -> FR_<pc>、M_EVAL -> eval、TRACE 剔除
// 用法: node tools/beautify_restored.js <in.js> <out.js>
const fs = require('fs');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const inFile = process.argv[2], outFile = process.argv[3];
let src = fs.readFileSync(inFile, 'utf8');

const ast = parser.parse(src, { sourceType: 'script', allowReturnOutsideFunction: true });

let nObj = 0, nSub = 0, nSet = 0, nTrace = 0, nEval = 0;

function isStr(n) { return n && (n.type === 'StringLiteral' || (n.type === 'TemplateLiteral' && n.expressions.length === 0)); }
function strVal(n) { return n.type === 'StringLiteral' ? n.value : n.quasis[0].value.cooked; }
function validIdent(k) { return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k); }
// nm 在该子树里是否只以「裸标识符」出现（不作为成员访问的基对象、不作为被调函数/实参）
function onlyBareRef(node, nm) {
  let ok = true;
  (function scan(n, parent, key) {
    if (!ok || !n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(x => scan(x, parent, key)); return; }
    if (n.type === 'Identifier' && n.name === nm) {
      if (parent && ((parent.type === 'MemberExpression' && key === 'object') ||
                     (parent.type === 'CallExpression' && (key === 'callee' || key === 'arguments')))) ok = false;
      return;
    }
    for (const k of Object.keys(n)) { if (k !== 'loc' && k !== 'start' && k !== 'end') scan(n[k], n, k); }
  })(node, null, null);
  return ok;
}
function isTrace(n) {
  return n && n.type === 'IfStatement' && n.test && n.test.type === 'BinaryExpression' &&
    n.test.operator === '===' && n.test.left.type === 'UnaryExpression' && n.test.left.operator === 'typeof' &&
    n.test.left.argument.type === 'Identifier' && n.test.left.argument.name === 'TRACE' &&
    n.test.right.type === 'StringLiteral' && n.test.right.value === 'function';
}

// ---------- Pass 1: M_SET -> 对象字面量（在单函数作用域内按语句序） ----------
function collectScopes(node, out) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(n => collectScopes(n, out)); return; }
  if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression' || node.type === 'Program' ||
      node.type === 'BlockStatement') {
    if (node.body) out.push(node.body);
  }
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end') continue;
    collectScopes(node[k], out);
  }
}

function passObjLit(body) {
  const stmts = body.type === 'BlockStatement' ? body.body : body;
  if (!Array.isArray(stmts)) return;
  // 1) 收集属性写入 `H.k = v` / `H["k"] = v`
  const sets = [];
  for (let i = 0; i < stmts.length; i++) {
    const s = stmts[i];
    if (s.type !== 'ExpressionStatement') continue;
    const e = s.expression;
    if (e.type !== 'AssignmentExpression' || e.operator !== '=') continue;
    const L = e.left;
    if (L.type !== 'MemberExpression' || L.object.type !== 'Identifier') continue;
    let k = null;
    if (!L.computed && L.property.type === 'Identifier') k = L.property.name;
    else if (L.computed && L.property.type === 'StringLiteral') k = L.property.value;
    if (k !== null) sets.push({ idx: i, obj: L.object.name, key: k, val: e.right, node: s });
  }
  if (!sets.length) return;
  const byObj = new Map();
  for (const st of sets) { if (!byObj.has(st.obj)) byObj.set(st.obj, []); byObj.get(st.obj).push(st); }
  const kill = new Set();
  const isSet = (n) => sets.some(p => p.node === n);
  for (const [nm, list] of byObj) {
    let ci = -1;
    for (let i = 0; i < stmts.length; i++) {
      const s = stmts[i];
      if (s.type !== 'ExpressionStatement' || s.expression.type !== 'AssignmentExpression') continue;
      const e = s.expression;
      if (e.operator !== '=' || e.left.type !== 'Identifier' || e.left.name !== nm) continue;
      const emptyObj = (e.right.type === 'ObjectExpression' && e.right.properties.length === 0) ||
        (e.right.type === 'NewExpression' && e.right.callee.type === 'Identifier' && e.right.callee.name === 'Object' && e.right.arguments.length === 0);
      if (emptyObj) { ci = i; break; }
    }
    if (ci < 0 || !list.every(p => p.idx > ci)) continue;
    // 创建点与最后一次属性写入之间，H 只能被「裸引用」（如 vN = H 的寄存器拷贝）
    const last = Math.max(...list.map(p => p.idx));
    let ok = true;
    for (let i = ci + 1; i < last; i++) {
      if (isSet(stmts[i])) continue;
      if (!onlyBareRef(stmts[i], nm)) { ok = false; break; }
    }
    if (!ok) continue;
    stmts[ci].expression.right = t.objectExpression(list.map(p =>
      t.objectProperty(validIdent(p.key) ? t.identifier(p.key) : t.stringLiteral(p.key), p.val)));
    for (const p of list) kill.add(p.node);
    nObj++;
  }
  if (kill.size) {
    const kept = stmts.filter(s => !kill.has(s));
    if (body.type === 'BlockStatement') body.body = kept; else stmts.splice(0, stmts.length, ...kept);
  }
}

// ---------- Pass 2: 其余替换 ----------
function passReplace(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(passReplace); return; }

  // if (typeof TRACE === "function") TRACE(...)  -> 移除
  if (isTrace(node)) {
    if (node.consequent && node.consequent.type === 'ExpressionStatement' &&
        node.consequent.expression.type === 'CallExpression' &&
        node.consequent.expression.callee.type === 'Identifier' &&
        node.consequent.expression.callee.name === 'TRACE') {
      nTrace++;
      node.__drop = true;
      return;
    }
  }
  // SUB(pc, 0, A, l, S) -> FR_pc(A, l, S)
  if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'SUB' &&
      node.arguments.length === 5 && node.arguments[0].type === 'NumericLiteral' &&
      node.arguments[2].type === 'Identifier' && node.arguments[2].name === 'A' &&
      node.arguments[3].type === 'Identifier' && node.arguments[3].name === 'l' &&
      node.arguments[4].type === 'Identifier' && node.arguments[4].name === 'S') {
    node.callee = t.identifier('FR_' + node.arguments[0].value);
    node.arguments = [node.arguments[2], node.arguments[3], node.arguments[4]];
    nSub++;
  }
  // M_EVAL(x) -> eval(x)
  if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'M_EVAL') {
    node.callee = t.identifier('eval'); nEval++;
  }
  // M_SET(x, "k", v) -> x.k = v   (其余未被对象字面量吸收的)
  if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'M_SET' &&
      node.arguments.length === 3 && isStr(node.arguments[1])) {
    const k = strVal(node.arguments[1]);
    const member = validIdent(k) ? t.memberExpression(node.arguments[0], t.identifier(k))
                                 : t.memberExpression(node.arguments[0], t.stringLiteral(k), true);
    nSet++;
    Object.assign(node, t.assignmentExpression('=', member, node.arguments[2]));
    delete node.callee; delete node.arguments;
    return passReplace(node);
  }
  // new Object() -> {}
  if (node.type === 'NewExpression' && node.callee.type === 'Identifier' && node.callee.name === 'Object' &&
      node.arguments.length === 0) {
    Object.assign(node, t.objectExpression([]));
    delete node.callee; delete node.arguments;
    return;
  }
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end' || k === '__drop') continue;
    passReplace(node[k]);
  }
}

// 顺序：先做对象字面量重建（需要看原始 M_SET 语句），再做替换
const scopes = [];
collectScopes(ast.program, scopes);
// 深层优先，避免外层删掉内层节点
for (const b of scopes) passObjLit(b);
passReplace(ast.program);

// 删除标记节点
(function sweep(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (let i = node.length - 1; i >= 0; i--) { sweep(node[i]); if (node[i] && node[i].__drop) node.splice(i, 1); }
    return;
  }
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end') continue;
    sweep(node[k]);
  }
})(ast.program);

// ---------- Pass 0: 重复对象字面量提升为命名常量 ----------
// copy-propagation 会把同一个 handler 字面量内联到每个使用点（一次 20+ 份），
// 这里把结构相同的字面量提成 `const LIT_n = {...}`，使用点换成标识符。
let nHoist = 0;
(function hoistLiterals() {
  const keyOf = (n) => { try { return generate(n, { comments: false }).code; } catch (e) { return null; } };
  const groups = new Map();   // code -> {nodes: [], node, scope: []}
  (function scan(node, scope) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(n => scan(n, scope)); return; }
    // 进入新函数作用域时，把该函数的语句数组作为提升目标
    let inner = scope;
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' ||
        node.type === 'ArrowFunctionExpression') {
      if (node.body && node.body.type === 'BlockStatement') inner = node.body.body;
    } else if (node.type === 'Program') {
      inner = node.body;
    }
    if (node.type === 'ObjectExpression' && node.properties.length >= 2) {
      const k = keyOf(node);
      if (k && k.length <= 4000) {
        if (!groups.has(k)) groups.set(k, { nodes: [], node, scope: inner });
        groups.get(k).nodes.push(node);
      }
    }
    for (const k of Object.keys(node)) {
      if (k === 'loc' || k === 'start' || k === 'end') continue;
      scan(node[k], inner);
    }
  })(ast.program, ast.program.body);

  const byScope = new Map();  // scope 数组 -> [decl]
  for (const [k, g] of groups) {
    if (g.nodes.length < 2 || !g.scope) continue;
    const name = 'LIT_' + (++nHoist);
    const decl = t.variableDeclaration('const', [t.variableDeclarator(t.identifier(name), t.cloneNode(g.node, true))]);
    if (!byScope.has(g.scope)) byScope.set(g.scope, []);
    byScope.get(g.scope).push(decl);
    for (const n of g.nodes) {
      Object.keys(n).forEach(key => { if (key !== 'loc' && key !== 'start' && key !== 'end') delete n[key]; });
      Object.assign(n, t.identifier(name));
    }
  }
  for (const [scope, decls] of byScope) scope.unshift(...decls);
})();

// ---------- Pass 1.5: `S.push(a); S.push(b); x = FR_n(A, l, S)` ⇒ `x = FR_n(A, l, [a, b])` ----------
// S 是「实参栈」：SUB 从 S 尾部取 argc 个作为被调帧的 l[0..argc-1]。
// 折成数组字面量后，传值在调用点直接可见。（只处理同块内紧邻的情形，其余保留原样。）
let nArgFold = 0;
(function foldCallArgs() {
  const scopes = [];
  (function collect(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(collect); return; }
    if (node.type === 'BlockStatement' || node.type === 'Program') scopes.push(node);
    for (const k of Object.keys(node)) { if (k !== 'loc' && k !== 'start' && k !== 'end') collect(node[k]); }
  })(ast.program);

  const isPushStmt = (st) => st && st.type === 'ExpressionStatement' &&
    st.expression.type === 'CallExpression' && st.expression.callee.type === 'MemberExpression' &&
    !st.expression.callee.computed && st.expression.callee.object.type === 'Identifier' &&
    st.expression.callee.object.name === 'S' && st.expression.callee.property.name === 'push';
  const isFR = (callee) => callee && callee.type === 'Identifier' && /^FR_\d+$/.test(callee.name);
  // 在表达式树里把 `S` 实参换成数组字面量
  function substS(node, arr) {
    if (!node || typeof node !== 'object') return false;
    if (Array.isArray(node)) { node.forEach(n => substS(n, arr)); return false; }
    if (node.type === 'CallExpression' && isFR(node.callee) &&
        node.arguments.length === 3 && node.arguments[2].type === 'Identifier' && node.arguments[2].name === 'S') {
      node.arguments[2] = arr;
      return true;
    }
    let hit = false;
    for (const k of Object.keys(node)) {
      if (k === 'loc' || k === 'start' || k === 'end') continue;
      if (substS(node[k], arr)) hit = true;
    }
    return hit;
  }
  for (const sc of scopes) {
    const list = sc.body;
    if (!Array.isArray(list)) continue;
    for (let i = 0; i < list.length; i++) {
      if (!isPushStmt(list[i])) continue;
      let j = i, vals = [];
      while (j < list.length && isPushStmt(list[j])) { vals.push(list[j].expression.arguments[0]); j++; }
      if (j >= list.length) { i = j; continue; }
      const arr = t.arrayExpression(vals);
      if (substS(list[j], arr)) {
        nArgFold++;
        for (let k = i; k < j; k++) list[k] = { type: 'EmptyStatement' };
      }
      i = j;
    }
    sc.body = list.filter(s => s.type !== 'EmptyStatement');
  }
})();

let out = generate(ast, { comments: true, retainLines: false, jsescOption: { minimal: true } }).code;

// 兜底：仍可能因多行/标识符别名残留的 SUB
out = out.replace(/SUB\(\s*(\d+)\s*,\s*\d+\s*,\s*A\s*,\s*l\s*,\s*S\s*\)/g, 'FR_$1(A, l, S)');

const banner = `// ${inFile} 的美化版（tools/beautify_restored.js）
// 本文件由提升后的 SSA 形式还原：对象字面量重建 ${nObj} 处、SUB->FR_ ${nSub} 处、
// M_SET->赋值 ${nSet} 处、TRACE 剔除 ${nTrace} 处、M_EVAL->eval ${nEval} 处、实参折叠 ${nArgFold} 处。
`;
fs.writeFileSync(outFile, banner + out + '\n', 'utf8');
console.log(`${inFile} -> ${outFile}  ${(banner + out).length} B  [obj=${nObj} sub=${nSub} set=${nSet} trace=${nTrace} eval=${nEval}]`);
