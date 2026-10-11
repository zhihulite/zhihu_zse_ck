#!/usr/bin/env node
// 第二级 AST pass：把 VM 帧形态还原成真正的函数形态
//   A[3] = <expr>; return {A,l};  ⇒  return <expr>;        （A[3] = 返回值寄存器）
//   A[0]/A[1] = ...;              ⇒  删除（TRACE 专用，已剔 TRACE ⇒ 死代码）
//   A[3]                          ⇒  ret（帧内寄存器）
//   ret = CALL(...); v = ret;     ⇒  v = CALL(...);
// 用法: node tools/ast_frames.js js/<x>.restored.js js/<x>.final.js
const fs = require('fs');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const [inFile, outFile] = process.argv.slice(2);
const ast = parser.parse(fs.readFileSync(inFile, 'utf8'), { sourceType: 'script', allowReturnOutsideFunction: true });

let nRet = 0, nDrop = 0, nFold = 0;
const isA = (n, idx) => n && n.type === 'MemberExpression' &&
  n.object.type === 'Identifier' && n.object.name === 'A' &&
  n.property.type === 'NumericLiteral' && n.property.value === idx;
const isAssign = (st) => st && st.type === 'ExpressionStatement' && st.expression.type === 'AssignmentExpression' && st.expression.operator === '=';

// ---- 0) 找出「帧返回对象」的名字：{ A: A, l: l } 的字面量，以及它的别名 ----
const frameObjNames = new Set();
(function findFrameObj(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(findFrameObj); return; }
  if (node.type === 'ObjectExpression' && node.properties.length === 2 &&
      node.properties.every(p => p.type === 'ObjectProperty' && p.key.type === 'Identifier') &&
      node.properties.map(p => p.key.name).sort().join(',') === 'A,l' &&
      node.properties.every(p => p.value.type === 'Identifier' && p.value.name === p.key.name)) {
    node.__isFrameObj = true;
  }
  for (const k of Object.keys(node)) { if (k !== 'loc' && k !== 'start' && k !== 'end') findFrameObj(node[k]); }
})(ast.program);
(function aliasFrameObj(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(aliasFrameObj); return; }
  if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && node.init && node.init.__isFrameObj) frameObjNames.add(node.id.name);
  for (const k of Object.keys(node)) { if (k !== 'loc' && k !== 'start' && k !== 'end') aliasFrameObj(node[k]); }
})(ast.program);
const isFrameObjExpr = (n) => n && (n.__isFrameObj || (n.type === 'Identifier' && frameObjNames.has(n.name)));

// ---- 1) A[3] = <expr>; return <frameObj>;  ⇒  return <expr>; ----
//      以及裸 return <frameObj>;           ⇒  return ret;
function rewriteReturns(body) {
  if (!Array.isArray(body)) return;
  for (let i = 0; i < body.length; i++) {
    const st = body[i];
    if (isAssign(st) && isA(st.expression.left, 3)) {
      const nx = body[i + 1];
      if (nx && nx.type === 'ReturnStatement' && isFrameObjExpr(nx.argument)) {
        body[i] = t.returnStatement(st.expression.right);   // 该 A[3] 写入即返回值
        body.splice(i + 1, 1);
        nRet++;
        continue;
      }
    }
    if (st.type === 'ReturnStatement' && isFrameObjExpr(st.argument)) {
      st.argument = t.identifier('ret');                    // 兜底出口：返回 A[3] 当前值
      nRet++;
    }
  }
  // 递归
  for (const st of body) walkBlocks(st);
}
rewriteReturns(ast.program.body);

function walkBlocks(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(walkBlocks); return; }
  if (node.type === 'BlockStatement') { rewriteReturns(node.body); return; }
  if (node.type === 'IfStatement') { walkBlocks(node.consequent); walkBlocks(node.alternate); return; }
  if (node.type === 'ForStatement' || node.type === 'WhileStatement' || node.type === 'DoWhileStatement') { walkBlocks(node.body); return; }
  if (node.type === 'LabeledStatement') { walkBlocks(node.body); return; }
  if (node.type === 'TryStatement') { walkBlocks(node.block); walkBlocks(node.handler && node.handler.body); walkBlocks(node.finalizer); return; }
  if (node.type === 'SwitchStatement') { node.cases.forEach(c => walkBlocks({ type: 'BlockStatement', body: c.consequent })); return; }
  if (node.type === 'FunctionDeclaration') { walkBlocks(node.body); return; }
}

// ---- 2) 删 A[0]/A[1] 写入；---- 3) A[3] ⇒ ret ----
// 父子感知遍历：嵌套数组里的语句同样要处理
function sweep(node, parent, key) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (let i = node.length - 1; i >= 0; i--) {
      const st = node[i];
      if (isAssign(st) && (isA(st.expression.left, 0) || isA(st.expression.left, 1))) {
        const R = st.expression.right;
        if (R.type === 'CallExpression') node[i] = t.expressionStatement(R);   // 保住调用的副作用
        else node.splice(i, 1);
        nDrop++;
        continue;
      }
      sweep(st, node, i);
    }
    return;
  }
  if (isA(node, 3) && parent) { parent[key] = t.identifier('ret'); return; }
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end') continue;
    sweep(node[k], node, k);
  }
}
sweep(ast.program.body, null, null);

// ---- 4) ret = CALL(...); v = ret;  ⇒  v = CALL(...); ----
function foldRet(body) {
  if (!Array.isArray(body)) return;
  for (let i = 0; i < body.length - 1; i++) {
    const a = body[i], b = body[i + 1];
    if (!isAssign(a) || a.expression.left.type !== 'Identifier' || a.expression.left.name !== 'ret') continue;
    if (a.expression.right.type !== 'CallExpression') continue;
    if (!isAssign(b) || b.expression.left.type !== 'Identifier') continue;
    if (b.expression.right.type !== 'Identifier' || b.expression.right.name !== 'ret') continue;
    body[i] = t.expressionStatement(t.assignmentExpression('=', b.expression.left, a.expression.right));
    body.splice(i + 1, 1);
    nFold++;
  }
  for (const st of body) walkBlocksFold(st);
}
foldRet(ast.program.body);
function walkBlocksFold(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(walkBlocksFold); return; }
  if (node.type === 'BlockStatement') { foldRet(node.body); return; }
  if (node.type === 'IfStatement') { walkBlocksFold(node.consequent); walkBlocksFold(node.alternate); return; }
  if (node.type === 'FunctionDeclaration') { walkBlocksFold(node.body); return; }
  if (node.type === 'LabeledStatement') { walkBlocksFold(node.body); return; }
}

// ---- 4.5) 标注每帧的「传值位移」----
// SUB: `cl = [0].concat(l); for t<argc: cl[t]=args[t]; RUN(cl,...)`
//   ⇒ 被调帧的 l[0..argc-1] = 实参；l[t] (t>=argc) = 调用者 l[t-1]（**索引 +1 的位移**）
(function annotateShift() {
  const argcOf = new Map();
  (function scan(n, lead) {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(x => scan(x, lead)); return; }
    let cur = lead;
    if (n.leadingComments && n.leadingComments.length) {
      for (const c of n.leadingComments) { const m = /argc=(\d+)/.exec(c.value || ''); if (m) cur = +m[1]; }
    }
    if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && /^FR_\d+$/.test(n.callee.name)) {
      const k = n.callee.name;
      if (!argcOf.has(k) || (cur && cur > argcOf.get(k))) argcOf.set(k, cur || 0);
    }
    for (const k of Object.keys(n)) { if (k !== 'loc' && k !== 'start' && k !== 'end') scan(n[k], cur); }
  })(ast.program, 0);
  (function scan2(n) {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(scan2); return; }
    if (n.type === 'FunctionDeclaration' && n.id && /^FR_\d+$/.test(n.id.name) && n.body) {
      const argc = argcOf.get(n.id.name) || 0;
      const msg = argc
        ? ` 入参 ${argc} 个：l[0..${argc - 1}] = 实参（S 尾部）；l[t>=${argc}] = 调用者 l[t-1]`
        : ' 无入参：l[0] = 0；l[t>=1] = 调用者 l[t-1]（索引 +1 位移）';
      t.addComment(n, 'leading', msg + ' ');
    }
    for (const k of Object.keys(n)) { if (k !== 'loc' && k !== 'start' && k !== 'end') scan2(n[k]); }
  })(ast.program);
})();

// ---- 5) 每个函数顶部声明 let ret ----
(function declareRet(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(declareRet); return; }
  if (node.type === 'FunctionDeclaration' && node.body && node.body.type === 'BlockStatement') {
    let used = false;
    (function scan(n) {
      if (!n || typeof n !== 'object') return;
      if (Array.isArray(n)) { n.forEach(scan); return; }
      if (n.type === 'Identifier' && n.name === 'ret') { used = true; return; }
      for (const k of Object.keys(n)) { if (k !== 'loc' && k !== 'start' && k !== 'end') scan(n[k]); }
    })(node.body);
    if (used) node.body.body.unshift(t.variableDeclaration('let', [t.variableDeclarator(t.identifier('ret'))]));
  }
  for (const k of Object.keys(node)) { if (k !== 'loc' && k !== 'start' && k !== 'end') declareRet(node[k]); }
})(ast.program);

// 清掉遗留的占位属性
(function cleanup(n) {
  if (!n || typeof n !== 'object') return;
  if (Array.isArray(n)) { n.forEach(cleanup); return; }
  if (n.type === 'MemberExpression' && n.property && n.property.name === '__none__') {
    n.computed = false;
  }
  delete n.__isFrameObj;
  for (const k of Object.keys(n)) { if (k !== 'loc' && k !== 'start' && k !== 'end') cleanup(n[k]); }
})(ast.program);

const banner = `// ${inFile} 的帧还原版（tools/ast_frames.js）\n` +
  `// A[3] = 返回值寄存器 ⇒ return / ret；A[0],A[1] 死代码删除 ${nDrop} 条；\n` +
  `// return 改写 ${nRet} 处；ret = CALL; v = ret ⇒ v = CALL 折叠 ${nFold} 处。\n`;
const out = banner + generate(ast, { comments: true, jsescOption: { minimal: true } }).code + '\n';
fs.writeFileSync(outFile, out, 'utf8');
console.log(`${inFile} -> ${outFile}  ${out.length} B  [ret=${nRet} drop=${nDrop} fold=${nFold}]`);
