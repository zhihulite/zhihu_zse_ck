// tools/bitmap_ast.js — 静态 AST 提取「位图汇编器 + 每个累加字的所有置位点及其守卫」
//
// 用法: node tools/bitmap_ast.js <lifted.js> [--json out.json] [--md out.md]
//
// 输入是 .probe/lift/*.lifted.js（结构化 + SSA 变量化产物）。
// 输出:
//   assembler : 连续的 `tX = vN.toString(16)` 序列 —— 即该层拼 4-hex 的产出点
//   sites     : 每个累加字 vN 的置位点 {bit, op(assign|or), frame, line, guard, before}
//   stores    : M_SET / 属性写入，用于追踪 4-hex 串最终流向哪里
'use strict';
const fs = require('fs');
const parser = require('@babel/parser');

const file = process.argv[2];
if (!file) { console.error('usage: node tools/bitmap_ast.js <lifted.js>'); process.exit(1); }
const src = fs.readFileSync(file, 'utf8');
const ast = parser.parse(src, {
  sourceType: 'script', allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true,
  plugins: ['optionalChaining', 'nullishCoalescingOperator', 'classProperties'],
});

const line = (n) => src.slice(0, n.start).split('\n').length;
const txt = (n) => src.slice(n.start, n.end);
const short = (s, n = 120) => (s.length > n ? s.slice(0, n) + '…' : s);

// ---------- 符号表 ----------
// sym[temp] = {k:'num',v} | {k:'var',name} | {k:'shift',bit} | {k:'or',name,bit}
//           | {k:'sub',pc} | {k:'concat',parts:[...]} | {k:'str',v} | {k:'unknown'}
function mkEnv() { return Object.create(null); }

function resolveName(node, env, depth = 0) {
  // 把 tX / vN 解析成符号；vN 直接是 var 符号
  if (!node || depth > 6) return { k: 'unknown' };
  if (node.type === 'Identifier') {
    const n = node.name;
    if (/^v\d+$/.test(n)) return { k: 'var', name: n };
    const s = env[n];
    if (s && s.k === 'alias') return resolveName({ type: 'Identifier', name: s.name }, env, depth + 1);
    if (s) return s;
    return { k: 'unknown' };
  }
  return { k: 'unknown' };
}

function numLit(node, env, depth = 0) {
  if (!node || depth > 6) return null;
  if (node.type === 'NumericLiteral') return node.value;
  if (node.type === 'Identifier') {
    const s = env[node.name];
    if (s && s.k === 'num') return s.v;
  }
  return null;
}

function isToStringRadix(node, env) {
  // 匹配 tX.toString(N) / M_GET(...) 不算
  if (!node || node.type !== 'CallExpression') return null;
  const c = node.callee;
  if (!c || (c.type !== 'MemberExpression' && c.type !== 'OptionalMemberExpression')) return null;
  if (!c.property || c.property.name !== 'toString') return null;
  const radix = node.arguments.length ? numLit(node.arguments[0], env) : 10;
  return { obj: c.object, radix: radix === null ? 'dyn' : radix };
}

// ---------- 主遍历 ----------
const out = { file, assembler: [], sites: [], stores: [], subs: [], hexcat: [] };
let curFrame = '?';
let DEFS = Object.create(null);
let EXPR = Object.create(null);   // 名字 → 赋值时刻已完全内联的表达式文本（快照）

function expandWith(node, depth) {
  if (!node || depth > 6) return txt(node);
  switch (node.type) {
    case 'Identifier': {
      const e = EXPR[node.name];
      return (e && e !== node.name) ? e : node.name;
    }
    case 'NumericLiteral': case 'StringLiteral': return txt(node);
    case 'BinaryExpression': case 'LogicalExpression':
      return expandWith(node.left, depth + 1) + ' ' + node.operator + ' ' + expandWith(node.right, depth + 1);
    case 'UnaryExpression': {
      const a = expandWith(node.argument, depth + 1);
      return node.operator + (/^[a-z]+$/.test(node.operator) ? ('(' + a + ')') : a);
    }
    case 'MemberExpression': case 'OptionalMemberExpression':
      return expandWith(node.object, depth + 1) + (node.computed ? ('[' + expandWith(node.property, depth + 1) + ']') : ('.' + txt(node.property)));
    case 'CallExpression':
      return (node.callee.type === 'Identifier' ? node.callee.name : expandWith(node.callee, depth + 1)) +
             '(' + node.arguments.map(function (a) { return expandWith(a, depth + 1); }).join(', ') + ')';
    case 'NewExpression':
      return 'new ' + (node.callee.type === 'Identifier' ? node.callee.name : expandWith(node.callee, depth + 1)) +
             '(' + node.arguments.map(function (a) { return expandWith(a, depth + 1); }).join(', ') + ')';
    case 'ConditionalExpression':
      return expandWith(node.test, depth + 1) + ' ? ' + expandWith(node.consequent, depth + 1) + ' : ' + expandWith(node.alternate, depth + 1);
    default: return txt(node);
  }
}

function guardText(stmts, idx) {
  // 取 if 之前的连续语句作为「守卫计算块」：回溯到上一个对 v 变量的赋值（累加器边界）为止
  const parts = [];
  for (let i = idx - 1; i >= 0 && parts.length < 16; i--) {
    const s = stmts[i];
    const t = txt(s);
    parts.unshift(t);
    if (/^\s*v\d+\s*=/.test(t) || /^\s*return\b/.test(t)) break;
  }
  return parts.join(' ');
}

function handleAssign(left, right, env, frame, stmts, idx, guardPath) {
  if (left.type !== 'Identifier') return;
  const L = left.name;
  try { DEFS[L] = txt(right); EXPR[L] = short(expandWith(right, 0), 220); } catch (e) {}

  // 1) tX = (tA << tB)
  if (right.type === 'BinaryExpression' && right.operator === '<<') {
    const b = numLit(right.right, env);
    const one = numLit(right.left, env);
    if (one === 1 && b !== null) env[L] = { k: 'shift', bit: b };
    else env[L] = { k: 'unknown' };
    return;
  }
  // 2) tX = (tA | tB)
  if (right.type === 'BinaryExpression' && right.operator === '|') {
    const a = resolveName(right.left, env), b = resolveName(right.right, env);
    let base = null, bit = null;
    if (a.k === 'var' && b.k === 'shift') { base = a.name; bit = b.bit; }
    else if (b.k === 'var' && a.k === 'shift') { base = b.name; bit = a.bit; }
    if (base !== null && bit !== null) {
      const s = { k: 'or', name: base, bit };
      if (/^v\d+$/.test(L)) {
        out.sites.push({ frame, line: line(left), var: L, bit, op: (base === L ? 'or' : 'or-from:' + base), guard: guardPath, before: guardText(stmts, idx) });
        env[L] = { k: 'var', name: L };
      } else env[L] = s;
    } else env[L] = { k: 'unknown' };
    return;
  }
  // 3) tX = <num>
  if (right.type === 'NumericLiteral') { env[L] = { k: 'num', v: right.value }; return; }
  // 4) tX = "str"
  if (right.type === 'StringLiteral') { env[L] = { k: 'str', v: right.value }; return; }
  // 5) tX = SUB(pc, argc, ...)
  if (right.type === 'CallExpression' && right.callee.type === 'Identifier' && right.callee.name === 'SUB') {
    const pc = numLit(right.arguments[0], env);
    out.subs.push({ frame, line: line(left), into: L, pc });
    env[L] = { k: 'sub', pc };
    return;
  }
  // 6) tX = M_SET(obj, "key", val)
  if (right.type === 'CallExpression' && right.callee.type === 'Identifier' && right.callee.name === 'M_SET') {
    const key = right.arguments[1] && right.arguments[1].type === 'StringLiteral' ? right.arguments[1].value : null;
    const val = resolveName(right.arguments[2], env);
    const obj = resolveName(right.arguments[0], env);
    out.stores.push({ frame, line: line(left), obj: obj.k === 'var' ? obj.name : txt(right.arguments[0]), key, val, src: short(txt(right), 140) });
    env[L] = { k: 'unknown' };
    return;
  }
  // 7) tX = <obj>.toString(N)
  const ts = isToStringRadix(right, env);
  if (ts) {
    const o = resolveName(ts.obj, env);
    out.assembler.push({ frame, line: line(left), into: L, from: o.k === 'var' ? o.name : txt(ts.obj), radix: ts.radix });
    env[L] = ts.radix === 16 ? { k: 'hex', from: o.k === 'var' ? o.name : short(txt(ts.obj), 40), into: L } : { k: 'unknown' };
    return;
  }
  // 8) tX = (a + b)
  if (right.type === 'BinaryExpression' && right.operator === '+') {
    const A2 = resolveName(right.left, env), B2 = resolveName(right.right, env);
    const hexish = (x) => x.k === 'hex' || x.k === 'hexcat';
    if (hexish(A2) && hexish(B2)) {
      const parts = (A2.k === 'hexcat' ? A2.parts : [A2.into]).concat(B2.k === 'hexcat' ? B2.parts : [B2.into]);
      out.hexcat.push({ frame, line: line(left), into: L, parts });
      env[L] = { k: 'hexcat', parts };
      return;
    }
    env[L] = { k: 'concat', parts: [A2, B2] };
    return;
  }
  // 9) tX = tY  (别名) —— 若目标是 vN 且源解析为 shift/or，这是一个置位点
  if (right.type === 'Identifier') {
    const r = resolveName(right, env);
    if (/^v\d+$/.test(L)) {
      if (r.k === 'shift') out.sites.push({ frame, line: line(left), var: L, bit: r.bit, op: 'assign', guard: guardPath, before: guardText(stmts, idx) });
      else if (r.k === 'or') out.sites.push({ frame, line: line(left), var: L, bit: r.bit, op: (r.name === L ? 'or' : 'or-from:' + r.name), guard: guardPath, before: guardText(stmts, idx) });
      else if (r.k === 'hex') out.sites.push({ frame, line: line(left), var: L, bit: null, op: 'hex:' + r.from, guard: guardPath, before: guardText(stmts, idx) });
    }
    env[L] = { k: 'alias', name: right.name }; return;
  }
  // 10) tX = obj.prop  (属性读取 → 记录，供守卫还原)
  if (right.type === 'MemberExpression' || right.type === 'OptionalMemberExpression') {
    const prop = right.property && right.property.name ? right.property.name : txt(right.property);
    const o = resolveName(right.object, env);
    env[L] = { k: 'member', obj: o.k === 'var' ? o.name : short(txt(right.object), 40), prop };
    return;
  }
  // 11) tX = fn(...)
  if (right.type === 'CallExpression') {
    const c = right.callee;
    const nm = c.type === 'Identifier' ? c.name : (c.property && c.property.name ? c.property.name : '?');
    env[L] = { k: 'call', name: nm, src: short(txt(right), 90) };
    return;
  }
  env[L] = { k: 'unknown' };
}

function walk(stmts, env, frame, guardPath) {
  for (let i = 0; i < stmts.length; i++) {
    const st = stmts[i];
    if (st.type === 'ExpressionStatement' && st.expression.type === 'AssignmentExpression' && st.expression.operator === '=') {
      handleAssign(st.expression.left, st.expression.right, env, frame, stmts, i, guardPath);
    } else if (st.type === 'ExpressionStatement' && st.expression.type === 'CallExpression'
               && st.expression.callee.type === 'Identifier' && st.expression.callee.name === 'M_SET') {
      const c = st.expression;
      const key = c.arguments[1] && c.arguments[1].type === 'StringLiteral' ? c.arguments[1].value : null;
      const val = resolveName(c.arguments[2], env);
      const obj = resolveName(c.arguments[0], env);
      out.stores.push({ frame, line: line(st), obj: obj.k === 'var' ? obj.name : txt(c.arguments[0]), key, val, src: short(txt(st), 140) });
    } else if (st.type === 'IfStatement') {
      let gExpr = '';
      try { gExpr = short(expandWith(st.test, 0), 220); } catch (e) { gExpr = short(txt(st.test), 160); }
      let g = gExpr;
      const r = resolveName(st.test, env);
      if (r.k === 'member') g += `   /* ${r.obj}.${r.prop} */`;
      else if (r.k === 'sub') g += `   /* SUB(${r.pc}) */`;
      else if (r.k === 'call') g += `   /* ${r.src} */`;
      walk([].concat(st.consequent.body || st.consequent), env, frame, guardPath.concat([{ neg: false, g, at: line(st) }]));
      if (st.alternate) walk([].concat(st.alternate.body || st.alternate), env, frame, guardPath.concat([{ neg: true, g, at: line(st) }]));
    } else if (st.type === 'BlockStatement') {
      walk(st.body, env, frame, guardPath);
    } else if (st.type === 'ForStatement' || st.type === 'WhileStatement') {
      if (st.body) walk([].concat(st.body.body || st.body), env, frame, guardPath.concat([{ neg: false, g: 'LOOP', at: line(st) }]));
    } else if (st.type === 'LabeledStatement') {
      walk([st.body], env, frame, guardPath);
    } else if (st.type === 'ReturnStatement') {
      // 帧结束
    }
  }
}

for (const node of ast.program.body) {
  if (node.type === 'FunctionDeclaration') {
    curFrame = node.id.name;
    DEFS = Object.create(null);
    EXPR = Object.create(null);
    const env = mkEnv();
    // 参数 l[..] 初始化已知
    const body = node.body.body;
    const pre = body.filter(s => s.type === 'VariableDeclaration');
    walk(body, env, curFrame, []);
  }
}

// 组装守卫路径字符串
for (const s of out.sites) {
  s.guardPath = (s.guard || []).map(g => `[L${g.at}${g.neg ? ' else' : ''}] ${g.g}`);
  delete s.guard;
}

if (process.argv.includes('--md')) {
  const i = process.argv.indexOf('--md');
  let md = '# ' + file + ' — 位图汇编器 + 置位点（AST 静态提取）\n\n';
  md += '## 1. 汇编器（toString(16) 产出点，按出现顺序）\n\n| 行 | 目标 | 来源 | 帧 |\n|---|---|---|---|\n';
  out.assembler.filter(a => a.radix === 16).forEach(a => { md += '| L' + a.line + ' | `' + a.into + '` | `' + a.from + '` | ' + a.frame + ' |\n'; });
  md += '\n## 2. hex 串拼接链\n\n';
  out.hexcat.forEach(h => { md += '- L' + h.line + ' `' + h.into + '` = [' + h.parts.join(' + ') + ']\n'; });
  md += '\n## 3. 每个累加字的置位点（含守卫路径）\n\n';
  const byVar = {};
  out.sites.forEach(s => { (byVar[s.var] = byVar[s.var] || []).push(s); });
  Object.keys(byVar).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1))).forEach(v => {
    md += '### ' + v + '\n\n';
    byVar[v].forEach(s => {
      md += '- **L' + s.line + '** `' + s.op + ' bit' + s.bit + '`\n';
      (s.guardPath || []).forEach(g => { md += '  - 守卫 ' + String(g).replace(/\|/g, '\|') + '\n'; });
      if (s.before) md += '  - `' + String(s.before).replace(/\|/g, '\|').slice(0, 400) + '`\n';
    });
    md += '\n';
  });
  md += '## 4. 属性写入\n\n';
  out.stores.forEach(s => { md += '- L' + s.line + ' `' + s.obj + '.' + s.key + '` <- ' + s.val.k + (s.val.name ? ':' + s.val.name : '') + '\n'; });
  fs.writeFileSync(process.argv[i + 1], md, 'utf8');
  console.log('已写 ' + process.argv[i + 1]);
}
const json = JSON.stringify(out, null, 1);
if (process.argv.includes('--json')) {
  const i = process.argv.indexOf('--json');
  fs.writeFileSync(process.argv[i + 1], json, 'utf8');
}
console.log('== ' + file);
console.log('assembler (' + out.assembler.length + '):');
out.assembler.forEach(a => console.log(`   L${a.line} ${a.into} = ${a.from}.toString(${a.radix})   [${a.frame}]`));
const byVar = {};
out.sites.forEach(s => { (byVar[s.var] = byVar[s.var] || []).push(s); });
console.log('sites by var:');
Object.keys(byVar).sort().forEach(v => {
  console.log(`   ${v}: ${byVar[v].map(s => (s.op === 'assign' ? '=' : '|=') + s.bit).join(' ')}`);
});
console.log('hexcat (hex 串拼接链):');
out.hexcat.forEach(h => console.log(`   L${h.line} ${h.into} = [${h.parts.join(' + ')}]   [${h.frame}]`));
console.log('stores: ' + out.stores.length);
out.stores.forEach(s => console.log(`   L${s.line} ${s.obj}.${s.key} <- ${s.val.k}${s.val.name ? ':' + s.val.name : (s.val.pc !== undefined ? ' SUB(' + s.val.pc + ')' : '')}   ${s.src}`));
