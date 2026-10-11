#!/usr/bin/env node
// Go VM 解释器 AST 美化：标识符重命名 + opcode 标签标注 + 字段图例
// 用法: node tools/beautify_govm.js
const fs = require('fs');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const IN = '.probe/zsec/vm_interp.decompiled.js';
const OUT = 'js/govm.interp.restored.js';

// opcode -> 标签（来自 vm_isa_arms.json 的 switch(p1)）
const tbl = JSON.parse(fs.readFileSync('.probe/zsec/vm_isa_arms.json', 'utf8'));
const body0 = tbl['0'].body;
const op2lab = {};
for (const m of body0.matchAll(/case (\d+): break \$B(\d+);/g)) op2lab[+m[1]] = +m[2];
const lab2op = {};
for (const [op, lab] of Object.entries(op2lab)) lab2op[lab] = +op;

const RENAME = { p0: 'vm', p1: 'acc', l2: 'fr' };
for (let i = 3; i <= 15; i++) RENAME['l' + i] = 'r' + i;

const src = fs.readFileSync(IN, 'utf8');
const ast = parser.parse(src, { sourceType: 'script', allowReturnOutsideFunction: true });

function newLabel(name) {
  const mB = /^\$B(\d+)$/.exec(name), mL = /^\$L(\d+)$/.exec(name);
  if (mB) { const lab = +mB[1]; return (lab2op[lab] !== undefined) ? ('op' + lab2op[lab]) : ('B' + lab); }
  if (mL) return 'loop' + mL[1];
  return name;
}

// 1) 标识符重命名（只改声明/引用名，不动属性名）
(function rename(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(rename); return; }
  if (node.type === 'Identifier' && RENAME[node.name]) node.name = RENAME[node.name];
  if (node.type === 'LabeledStatement' && node.label.type === 'Identifier') node.label.name = newLabel(node.label.name);
  if (node.type === 'BreakStatement' && node.label && node.label.type === 'Identifier') node.label.name = newLabel(node.label.name);
  if (node.type === 'ContinueStatement' && node.label && node.label.type === 'Identifier') node.label.name = newLabel(node.label.name);
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end') continue;
    rename(node[k]);
  }
})(ast.program);

// 2) 顶部图例
const legend = `// ${IN} 的 AST 美化版（tools/beautify_govm.js）
// 标识符：p0=vm（VM 实例）  p1=acc（当前值/累加器）  l2=fr（帧基址）  l3..l15=r3..r15
// 标签：op<N> = opcode N 的入口（由 $B<label> 经 vm_isa_arms.json 的 switch(p1) 映射）
//       L<N>  = 非 opcode 入口的普通块
//
// VM 结构体字段（vm + 偏移）：
//   +20  pc（每进入一次 handler 自增 1）      +276 压栈类型标签   +280 压栈值
//   +296 操作数栈                            +308/+312 program ptr/len（10565）
//   +320 字符串池（101）                     +376/+380 分派表 ptr/len（8 字节/项）
//   +408 上次运算结果槽
// 压栈类型标签：71680 对象指针 / 71696 整数 / 71712 / 71744 / 71764 / 71780 布尔 /
//              71796 / 71820 / 253228 字符串·切片 / 295153 分隔符
// opcode -> 语义见 docs/GO_VM.md（35 条；js.Value.* 家族 13 条即「H 通道」）
`;
ast.program.body.unshift({ type: 'EmptyStatement' });

let out = generate(ast, { comments: false, retainLines: true, compact: false }).code;
out = legend + out.replace(/^;/, '');

fs.writeFileSync(OUT, out, 'utf8');
console.log(`${IN} -> ${OUT}  ${out.length} B`);
console.log('opcode 标签数 = ' + Object.keys(op2lab).length);
