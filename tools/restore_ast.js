// tools/restore_ast.js —— AST 还原：把 lifted 的 SSA 形式折回可读的原始检测 JS
//
// 用法: node tools/restore_ast.js <lifted.js> <out.js>
//
// 关键点：lifted 代码**复用** t0..t49，所以必须**按语句顺序做 copy-propagation**
// （每个 `tN = expr` 覆盖当前定义；读取时就地内联），而不是全局统计 def-use。
//
// 还原项：
//  1) copy-propagation：`tN = <expr>` ⇒ 后续对 tN 的读取替换为 <expr>（含括号保护）
//  2) 守卫还原：`tX = (a OP b); F = !!(tX); if (!(tX)) {} else {B}` ⇒ `if (a OP b) {B}`
//                `…; if (!(tX)) {B}`                              ⇒ `if (!(a OP b)) {B}`
//  3) 簿记剔除：TRACE(...) / S.push(...) / F = ... / A[0..3] = ...
'use strict';
const fs = require('fs');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const [inFile, outFile] = process.argv.slice(2);
if (!inFile) { console.error('usage: node tools/restore_ast.js <lifted.js> <out.js>'); process.exit(1); }
const src = fs.readFileSync(inFile, 'utf8');
const ast = parser.parse(src, { sourceType: 'script', allowReturnOutsideFunction: true });

const isTemp = (n) => /^t\d+$/.test(n) || /^v\d+$/.test(n);
const clone = (n) => t.cloneNode(n, true);

// ---------- 前置 pass：M_SET 建对象 ⇒ 对象字面量 ----------
// lifted 形态：`t15 = Object; t16 = new t15(); t23 = "get"; t24 = t16; M_SET(t24, t23, t22);`
// 折成：`t16 = { get: t22 }`，删掉 M_SET。之后 copy-propagation 会把字面量内联到读取处。
// 必须在 copy-propagation **之前**做，否则创建点会被内联成匿名 `new Object()` 而丢失身份。
let objFoldCount = 0;
const HOIST_NAMES = [];      // 折叠出的句柄名，最后统一在文件顶部 `let H1,H2,…;`
let hCount = 0;
const validKey = (k) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k);

function foldMSetObjects(body) {
  const stmts = body.type === 'BlockStatement' ? body.body : body;
  if (!Array.isArray(stmts)) return;
  const alias = new Map();     // tX -> tY（标识符别名链）
  const consts = new Map();    // tX -> 字面量节点（字符串/数字）
  const creations = new Map(); // 根名 -> {idx, node, props:[]}
  const root = (nm) => { const seen = new Set(); while (alias.has(nm) && !seen.has(nm)) { seen.add(nm); nm = alias.get(nm); } return nm; };

  for (let i = 0; i < stmts.length; i++) {
    const st = stmts[i];
    if (st.type !== 'ExpressionStatement') continue;
    const e = st.expression;
    if (e.type === 'AssignmentExpression' && e.operator === '=' && e.left.type === 'Identifier') {
      const L = e.left.name, R = e.right;
      if (R.type === 'Identifier') alias.set(L, R.name);
      else if (R.type === 'StringLiteral' || R.type === 'NumericLiteral') consts.set(L, R);
      else if (R.type === 'NewExpression' && R.arguments.length === 0 &&
               ((R.callee.type === 'Identifier' && root(R.callee.name) === 'Object') ||
                (R.callee.type === 'MemberExpression' && R.callee.object.type === 'Identifier' && R.callee.object.name === 'Object'))) {
        creations.set(L, { idx: i, node: st, props: [] });
      } else if (R.type === 'ObjectExpression' && R.properties.length === 0) {
        creations.set(L, { idx: i, node: st, props: [] });
      }
      continue;
    }
    if (e.type === 'CallExpression' && e.callee.type === 'Identifier' && e.callee.name === 'M_SET' && e.arguments.length === 3) {
      const [o, k, v] = e.arguments;
      if (o.type !== 'Identifier') continue;
      const c = creations.get(root(o.name));
      if (!c || i < c.idx) continue;
      let key = k;
      if (key.type === 'Identifier' && consts.has(key.name)) key = consts.get(key.name);
      if (key.type !== 'StringLiteral') continue;
      c.props.push({ key: key.value, val: v, node: st });
    }
  }

  // 折叠：`tN = new Object(); … M_SET(tN,"k",v) …` ⇒ `H = {}; tN = H; … H.k = v;`
  // 保留 M_SET 的**位置**（属性值临时量在那里才已定义），只在创建点前插 `H = {}`。
  const inserts = [];
  for (const [, c] of creations) {
    if (!c.props.length) continue;
    const H = 'H' + (++hCount);
    HOIST_NAMES.push(H);
    inserts.push([c.idx, t.expressionStatement(
      t.assignmentExpression('=', t.identifier(H), t.objectExpression([])))]);
    c.node.expression.right = t.identifier(H);            // tN = H
    for (const p of c.props) {
      p.node.expression = t.assignmentExpression('=',
        t.memberExpression(t.identifier(H),
          validKey(p.key) ? t.identifier(p.key) : t.stringLiteral(p.key), !validKey(p.key)),
        p.val);
    }
    objFoldCount++;
  }
  inserts.sort((a, b) => b[0] - a[0]);
  for (const [idx, st] of inserts) stmts.splice(idx, 0, st);
}
(function walkBodies(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(walkBodies); return; }
  if ((node.type === 'BlockStatement') || node.type === 'Program') foldMSetObjects(node);
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end') continue;
    walkBodies(node[k]);
  }
})(ast.program);

// 需要括号保护的二元运算（内联进更外层的表达式时）
const NEEDS_PAREN = new Set(['BinaryExpression', 'LogicalExpression', 'ConditionalExpression', 'SequenceExpression']);

// ---------- 否定化简：!(a !== b) ⇒ a === b，!(a === b) ⇒ a !== b ----------
const OPP = { '===': '!==', '!==': '===', '==': '!=', '!=': '==', '>': '<=', '<': '>=', '>=': '<', '<=': '>' };
function simplifyNeg(n) {
  if (!n || typeof n !== 'object') return n;
  if (Array.isArray(n)) return n.map(simplifyNeg);
  const out = {};
  for (const k of Object.keys(n)) {
    if (k === 'loc' || k === 'start' || k === 'end' || k === 'leadingComments' || k === 'trailingComments') continue;
    const v = n[k];
    out[k] = (v && typeof v === 'object') ? simplifyNeg(v) : v;
  }
  out.type = n.type;
  let core = out;
  while (core.type === 'ParenthesizedExpression') core = core.expression;
  if (core.type === 'UnaryExpression' && core.operator === '!') {
    let a = core.argument;
    while (a.type === 'ParenthesizedExpression') a = a.expression;
    if (a.type === 'BinaryExpression' && OPP[a.operator]) return t.binaryExpression(OPP[a.operator], a.left, a.right);
    if (a.type === 'UnaryExpression' && a.operator === '!') return a.argument;
    return t.unaryExpression('!', a);
  }
  return core;
}

function inlineReads(node, def, seen) {
  seen = seen || new Set();  if (!node || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map((n) => inlineReads(n, def));
  if ((node.type === 'NewExpression' || node.type === 'CallExpression') && node.callee &&
      node.callee.type === 'Identifier' && (node.callee.name === 'Object' || node.callee.name === 'Array') &&
      (!node.arguments || node.arguments.length === 0)) {
    const key = (node.type === 'NewExpression' ? 'new ' : '') + node.callee.name + '()';
    const d = def.get(key);
    if (d) return clone(d);
  }
  if (node.type === 'Identifier' && /^t\d+$/.test(node.name)) {
    const r = rootName(node.name);
    if (seen.has(r)) return node;      // 自引用保护
    const d = def.get(node.name) || UNIQ.get(node.name);   // UNIQ：整段函数体只赋值一次 ⇒ 前向引用安全
    if (d) {
      seen.add(node.name);
      const c = inlineReads(clone(d), def, seen);
      seen.delete(node.name);
      return NEEDS_PAREN.has(c.type) ? t.parenthesizedExpression(c) : c;
    }
    return node;
  }
  const out = {};
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end' || k === 'leadingComments' || k === 'trailingComments') continue;
    const v = node[k];
    // 赋值左侧 / 成员表达式的 object 位置不内联，否则会产出 `"" = 0` 这类非法左值
    if (node.type === 'AssignmentExpression' && k === 'left') {
      out[k] = v;
      continue;
    }
    out[k] = (v && typeof v === 'object') ? inlineReads(v, def, seen) : v;
  }
  out.type = node.type;
  if (node.leadingComments) out.leadingComments = node.leadingComments;
  return out;
}

const isTrace = (st) => st.type === 'ExpressionStatement' && st.expression.type === 'CallExpression' &&
  st.expression.callee.type === 'Identifier' && st.expression.callee.name === 'TRACE';
// `S.push(...)` 与 `A[i] = ...` 是**跨帧传值通道**，不是簿记：
//   S = 调用实参栈（SUB(entry, argc, A, l, S) 从 S 尾部取 argc 个）
//   A[0..3] = 比较寄存器组（A[3] 是结果，由被调帧写、调用帧读：`v13 = A[3]`）
const isPush = () => false;
const isBookkeeping = (st) => {
  if (st.type !== 'ExpressionStatement' || st.expression.type !== 'AssignmentExpression') return false;
  const L = st.expression.left;
  return L.type === 'Identifier' && L.name === 'F';   // 只丢 F（仅 TRACE 用）
};
const isEmptyBlock = (n) => !n || (n.type === 'BlockStatement' && n.body.every((s) => isTrace(s)));

// 把 `tX = (a OP b)` 这类比较结果取出，用于守卫还原
function rootOf(expr, def, depth) {
  depth = depth || 0;
  if (!expr || depth > 10) return null;
  if (expr.type === 'Identifier') {
    const d = def.get(expr.name);
    if (d) return rootOf(d, def, depth + 1);
    return expr.name;
  }
  return generate(expr).code;
}

function testOf(testNode, def) {
  let neg = false, n = testNode;
  if (n.type === 'UnaryExpression' && n.operator === '!') { neg = true; n = n.argument; }
  if (n.type === 'Identifier' && isTemp(n.name) && def.has(n.name)) {
    const e = inlineReads(clone(def.get(n.name)), def);
    return { expr: e, neg };
  }
  return null;
}

let inlineCount = 0, guardCount = 0, objCount = 0, msetSeen = 0;
// 整段函数体里「只被赋值一次」的临时量：顺序 copy-propagation 遇到前向引用时回退到这里。
// （对象字面量折叠会把创建点提到属性值临时量的定义之前，产生前向引用。）
let UNIQ = new Map();
function computeUniq(body) {
  const cnt = new Map(), val = new Map();
  (function scan(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(scan); return; }
    if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression' &&
        node.expression.operator === '=' && node.expression.left.type === 'Identifier' &&
        /^t\d+$/.test(node.expression.left.name)) {
      const n = node.expression.left.name;
      cnt.set(n, (cnt.get(n) || 0) + 1);
      val.set(n, node.expression.right);
    }
    for (const k of Object.keys(node)) { if (k !== 'loc' && k !== 'start' && k !== 'end') scan(node[k]); }
  })(body);
  const u = new Map();
  for (const [n, c] of cnt) if (c === 1) u.set(n, val.get(n));
  return u;
}
// ---------- 预扫描：别名表 + M_SET 建出的 handler 对象 ----------
const alias = new Map();      // tN -> tM（仅标识符到标识符，天然无环）
const handlers = new Map();   // 根名 -> {key: valueNode}
function rootName(nm) { const seen = new Set(); while (alias.has(nm) && !seen.has(nm)) { seen.add(nm); nm = alias.get(nm); } return nm; }
(function preScan(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(preScan); return; }
  if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression' &&
      node.expression.operator === '=' && node.expression.left.type === 'Identifier' &&
      node.expression.right.type === 'Identifier') {
    alias.set(node.expression.left.name, node.expression.right.name);
  }
  if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' &&
      node.expression.callee.type === 'Identifier' && node.expression.callee.name === 'M_SET') {
    const a = node.expression.arguments;
    if (a[0] && a[0].type === 'Identifier' && a[1] && a[1].type === 'StringLiteral') {
      const r = rootName(a[0].name);
      if (!handlers.has(r)) handlers.set(r, new Map());
      handlers.get(r).set(a[1].value, a[2]);
    }
  }
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end') continue;
    preScan(node[k]);
  }
})(ast.program);

// SUB(pc, argc, A, l, S) ⇒ FR_<pc>(A, l, S)
// pc 在 lifted 里常是临时量（`t3 = 1905; t4 = SUB(t3, 0, A, l, S)`），需按块内常量表解析。
(function subRename(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(subRename); return; }
  if (node.type === 'BlockStatement' || node.type === 'Program') {
    const consts = new Map();
    for (const st of (node.body || [])) {
      if (st.type === 'ExpressionStatement' && st.expression.type === 'AssignmentExpression' &&
          st.expression.operator === '=' && st.expression.left.type === 'Identifier') {
        const R = st.expression.right;
        if (R.type === 'NumericLiteral') consts.set(st.expression.left.name, R.value);
        else if (R.type === 'Identifier' && consts.has(R.name)) consts.set(st.expression.left.name, consts.get(R.name));
      }
    }
    for (const st of (node.body || [])) {
      (function rw(n) {
        if (!n || typeof n !== 'object') return;
        if (Array.isArray(n)) { n.forEach(rw); return; }
        if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === 'SUB') {
          const a0 = n.arguments[0];
          let pc = null;
          if (a0 && a0.type === 'NumericLiteral') pc = a0.value;
          else if (a0 && a0.type === 'Identifier' && consts.has(a0.name)) pc = consts.get(a0.name);
          if (pc !== null && n.arguments.length >= 3) {
            const argc = n.arguments[1] && n.arguments[1].type === 'NumericLiteral' ? n.arguments[1].value : null;
            n.callee = t.identifier('FR_' + pc);
            n.arguments = n.arguments.slice(2);
            // 标出跨越帧边界的实参个数（SUB 从 S 尾部取 argc 个 ⇒ 被调帧的 l[0..argc-1]）
            if (argc) t.addComment(n, 'leading', 'argc=' + argc + ' ');
          }
        }
        for (const k of Object.keys(n)) {
          if (k === 'loc' || k === 'start' || k === 'end') continue;
          rw(n[k]);
        }
      })(st);
    }
  }
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end') continue;
    subRename(node[k]);
  }
})(ast.program);


function restoreStmts(body, def) {
  const out = [];
  for (let st of body) {
    if (isTrace(st) || isPush(st) || isBookkeeping(st)) continue;

    if (st.type === 'ExpressionStatement' && st.expression.type === 'AssignmentExpression' &&
        st.expression.operator === '=' && st.expression.left.type === 'Identifier') {
      const nm = st.expression.left.name;
      const rhs = inlineReads(st.expression.right, def);
      if (/^t\d+$/.test(nm)) {         // 纯临时量：只更新 def，不进产物
        def.set(nm, rhs);
        continue;
      }
      if (/^v\d+$/.test(nm)) {         // v 寄存器 = 真正的帧局部量：保留为语句
        out.push(t.expressionStatement(t.assignmentExpression('=', t.identifier(nm), rhs)));
        continue;
      }
      // 其余具名变量（如折叠出的句柄 H1）：保留为语句，且不参与内联
      out.push(t.expressionStatement(t.assignmentExpression('=', t.identifier(nm), rhs)));
      continue;
    }

    // （对象字面量重建暂缓：会与 copy-propagation 互相干扰，先保语法正确）
    if (false && st.type === 'ExpressionStatement' && st.expression.type === 'CallExpression' &&
        st.expression.callee.type === 'Identifier' && st.expression.callee.name === 'M_SET') {
      const key = inlineReads(st.expression.arguments[1], def);   // 键可能来自临时量
      if (key && key.type === 'StringLiteral') {
        msetSeen++;
        // 用 def 快照收集整段：否则第一组就会改 def，使后续组的 objSrc 变成字面量文本而断裂
        const defSnap = new Map(def);
        const root = rootOf(st.expression.arguments[0], defSnap);
        const objSrc = 'root:' + root;
        const props = [];
        let j = body.indexOf(st);
        while (j < body.length) {
          const q = body[j];
          if (!(q.type === 'ExpressionStatement' && q.expression.type === 'CallExpression' &&
                q.expression.callee.type === 'Identifier' && q.expression.callee.name === 'M_SET')) {
            // 允许跳过纯 SSA 赋值（它们由 def 跟踪消费），其余语句终止本段
            if (q.type === 'ExpressionStatement' && q.expression.type === 'AssignmentExpression' &&
                q.expression.operator === '=' && q.expression.left.type === 'Identifier') {
              def.set(q.expression.left.name, inlineReads(q.expression.right, def));
              body[j] = { type: 'EmptyStatement' };
              j++;
              continue;
            }
            break;
          }
          if (rootOf(q.expression.arguments[0], defSnap) !== root) break;
          const kk = inlineReads(q.expression.arguments[1], defSnap);
          if (!kk || kk.type !== 'StringLiteral') break;
          props.push(t.objectProperty(t.stringLiteral(kk.value), inlineReads(q.expression.arguments[2], defSnap)));
          body[j] = { type: 'EmptyStatement' };   // 标记已消费
          j++;
        }
        if (props.length) {
          objCount++;
          const name = 'obj' + objCount + '_' + objSrc.replace(/[^A-Za-z0-9]/g, '_');
          def.set(objSrc, t.objectExpression(props));   // 后续同名对象的读取就地内联为字面量
          out.push(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(name), t.objectExpression(props))]));
          continue;
        }
      }
    }
    if (st.type === 'EmptyStatement') continue;

    if (st.type === 'IfStatement') {
      const ti = testOf(st.test, def);
      if (ti && ti.expr) {
        const use = ti.neg ? t.unaryExpression('!', ti.expr) : ti.expr;
        if (isEmptyBlock(st.consequent) && st.alternate) {
          // if(!(tX)) {} else {B}  ⇒  B 在 tX 为真时执行 ⇒ if(tX) {B}
          guardCount++;
          out.push(t.ifStatement(simplifyNeg(clone(ti.expr)), restoreStmt(st.alternate, def)));
          continue;
        }
        if (isEmptyBlock(st.alternate)) {
          // if(!(tX)) {B}  ⇒  B 在 tX 为假时执行 ⇒ if(!tX) {B}
          guardCount++;
          out.push(t.ifStatement(simplifyNeg(use), restoreStmt(st.consequent, def)));
          continue;
        }
      }
      out.push(t.ifStatement(inlineReads(st.test, def),
        restoreStmt(st.consequent, def),
        st.alternate ? restoreStmt(st.alternate, def) : null));
      continue;
    }

    if (st.type === 'ReturnStatement') { out.push(st); continue; }
    if (st.type === 'VariableDeclaration') {
      // 只丢 `let t0,t1,…` 这类纯临时量声明；真实变量（args/cl/r/v…）保留
      if (st.declarations.every(d => d.id.type === 'Identifier' && /^t\d+$/.test(d.id.name))) continue;
      out.push(t.variableDeclaration(st.kind, st.declarations.map(d => {
        const nd = t.variableDeclarator(d.id, d.init ? inlineReads(d.init, def) : null);
        return nd;
      })));
      continue;
    }
    out.push(inlineReads(st, def));
  }
  return foldOrAssign(out);
}

// ---------- 位设置折叠：`vA = E; vB = vA | vB` ⇒ `vB |= E` ----------
// 位图/累加器的写入在 VM 里就是「先算常量再或进累加器」，折叠后即为原始 JS 的 `|=`。
function readsName(node, nm) {
  if (!node || typeof node !== 'object') return false;
  if (Array.isArray(node)) return node.some(n => readsName(n, nm));
  if (node.type === 'Identifier' && node.name === nm) return true;
  if (node.type === 'MemberExpression' && !node.computed && node.property.type === 'Identifier' &&
      node.property.name === nm) return false;    // obj.nm 不算读取 nm
  return Object.keys(node).some(k => k !== 'loc' && k !== 'start' && k !== 'end' && readsName(node[k], nm));
}
function foldOrAssign(stmts) {
  const out = [];
  const unwrapP = (n) => { while (n && n.type === 'ParenthesizedExpression') n = n.expression; return n; };
  const asgOf = (st) => (st && st.type === 'ExpressionStatement' && st.expression.type === 'AssignmentExpression') ? st.expression : null;
  const orParts = (node, self) => {                 // 返回「非 self 的那一侧」，否则 null
    const R = unwrapP(node);
    if (!R || R.type !== 'BinaryExpression' || R.operator !== '|') return null;
    const L = unwrapP(R.left), Rr = unwrapP(R.right);
    if (L && L.type === 'Identifier' && L.name === self) return Rr;
    if (Rr && Rr.type === 'Identifier' && Rr.name === self) return L;
    return null;
  };
  const codeOf = (n) => { try { return generate(n, { comments: false }).code; } catch (e) { return null; } };

  for (let i = 0; i < stmts.length; i++) {
    const st = stmts[i], asg = asgOf(st);
    // 规则 A：`vB = vB | X` ⇒ `vB |= X`
    if (asg && asg.operator === '=' && asg.left.type === 'Identifier') {
      const X = orParts(asg.right, asg.left.name);
      if (X) { out.push(assignOp(asg.left.name, X)); continue; }
    }
    // 规则 B：`vA = E; vB = vB | E` ⇒ `vB |= E`（vA 之后不再读时丢弃第一条）
    if (asg && asg.operator === '=' && asg.left.type === 'Identifier' && /^v\d+$/.test(asg.left.name)) {
      const A = asg.left.name, E = asg.right;
      const nxa = asgOf(stmts[i + 1]);
      if (nxa && nxa.operator === '=' && nxa.left.type === 'Identifier') {
        const other = orParts(nxa.right, nxa.left.name);
        if (other && codeOf(unwrapP(other)) === codeOf(unwrapP(E))) {
          let used = false;
          for (let j = i + 2; j < stmts.length; j++) if (readsName(stmts[j], A)) { used = true; break; }
          if (!used) { out.push(assignOp(nxa.left.name, E)); i++; continue; }
        }
      }
    }
    // 规则 C：`vA = E; vB |= E'`（E≡E' 且 vA 之后不再读）⇒ 丢弃 vA 赋值
    if (asg && asg.operator === '=' && asg.left.type === 'Identifier' && /^v\d+$/.test(asg.left.name)) {
      const A = asg.left.name, E = asg.right;
      const nx = stmts[i + 1];
      const nxa = asgOf(nx);
      if (nxa && nxa.operator === '|=' && codeOf(unwrapP(nxa.right)) === codeOf(unwrapP(E))) {
        let used = false;
        for (let j = i + 1; j < stmts.length; j++) if (readsName(stmts[j], A)) { used = true; break; }
        if (!used) continue;                       // 丢弃 st（nx 保留，下一轮输出）
      }
    }
    out.push(st);
  }
  return out;
}
function assignOp(name, val) {
  return t.expressionStatement(t.assignmentExpression('|=', t.identifier(name), val));
}

function restoreStmt(st, def) {
  if (st.type === 'BlockStatement') return t.blockStatement(restoreStmts(st.body, new Map(def)));
  if (st.type === 'IfStatement') {
    const b = restoreStmts([st], new Map(def));
    return b.length ? b[0] : t.emptyStatement();
  }
  return inlineReads(st, def);
}

function walk(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(walk); return; }
  if (node.type === 'FunctionDeclaration' && node.body && node.body.type === 'BlockStatement') {
    UNIQ = computeUniq(node.body.body);
    node.body.body = restoreStmts(node.body.body, new Map());
    return;
  }
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end') continue;
    const v = node[k];
    if (v && typeof v === 'object') walk(v);
  }
}
walk(ast.program);
if (HOIST_NAMES.length) {
  ast.program.body.unshift(t.variableDeclaration('let',
    HOIST_NAMES.map(n => t.variableDeclarator(t.identifier(n)))));
}

let out = generate(ast, { comments: true, retainLines: false }).code;
// 收尾：SUB(pc, argc, A, l, S) ⇒ FR_<pc>(A, l, S)
out = out.replace(/SUB\((\d+),\s*\d+,\s*A,\s*l,\s*S\)/g, 'FR_$1(A, l, S)');
if (outFile) fs.writeFileSync(outFile, out, 'utf8');
console.log('restored -> ' + (outFile || '(stdout)') + '  ' + out.length + ' bytes');
console.log('  守卫还原 ' + guardCount + ' 处；对象字面量折叠 ' + objFoldCount + ' 个');
