#!/usr/bin/env node
// 从还原件里抽出「守卫条件 → 位图位」映射
// 用法: node tools/extract_guards.js
const fs = require('fs');
const parser = require('@babel/parser');

// 各层累加器寄存器 -> 位图字（来自 zseck-forge-pipeline / 逐层实证）
const LAYERS = [
  { file: 'js/payload.restored.js', name: 'payload', words: { v3: 'w1', v4: 'w2', v5: 'w3', v6: 'w4' } },
  { file: 'js/inner.restored.js',   name: 'inner',   words: { v3: 'w5', v4: 'w6' } },
  { file: 'js/cvm.restored.js',     name: 'cvm',     words: { v7: 'w10', v8: 'w11' } },
];

const gen = require('@babel/generator').default;
const codeOf = (n) => { try { return gen(n, { comments: false }).code; } catch (e) { return '?'; } };

function bitOf(right) {           // 1 << K  /  1
  let n = right;
  while (n && n.type === 'ParenthesizedExpression') n = n.expression;
  if (!n) return null;
  if (n.type === 'NumericLiteral') return n.value === 1 ? 0 : null;
  if (n.type === 'BinaryExpression' && n.operator === '<<' &&
      n.left.type === 'NumericLiteral' && n.left.value === 1 && n.right.type === 'NumericLiteral') return n.right.value;
  return null;
}

const rows = [];
for (const L of LAYERS) {
  const ast = parser.parse(fs.readFileSync(L.file, 'utf8'), { sourceType: 'script', allowReturnOutsideFunction: true });
  (function walk(node, fnName) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(n => walk(n, fnName)); return; }
    if (node.type === 'FunctionDeclaration') fnName = node.id.name;
    if (node.type === 'IfStatement') {
      const cond = codeOf(node.test);
      const body = node.consequent && node.consequent.type === 'BlockStatement' ? node.consequent.body : [];
      for (const st of body) {
        const e = st.type === 'ExpressionStatement' ? st.expression : null;
        if (e && e.type === 'AssignmentExpression' && e.operator === '|=' && e.left.type === 'Identifier') {
          const w = L.words[e.left.name];
          const b = bitOf(e.right);
          if (w && b !== null) rows.push({ layer: L.name, fn: fnName, word: w, bit: b, cond });
        }
      }
    }
    for (const k of Object.keys(node)) {
      if (k === 'loc' || k === 'start' || k === 'end') continue;
      walk(node[k], fnName);
    }
  })(ast.program, null);
}

rows.sort((a, b) => (a.layer + a.word).localeCompare(b.layer + b.word) || a.bit - b.bit);
const seen = new Set();
const out = [];
for (const r of rows) {
  const key = r.word + ':' + r.bit;
  if (seen.has(key)) { out.push({ ...r, dup: true }); continue; }
  seen.add(key); out.push(r);
}
let md = '# 位图守卫映射（由 js/*.restored.js 抽出）\n\n';
md += `共 ${rows.length} 条置位点（去重后 ${seen.size} 位）。\n\n`;
md += '| 层 | 函数 | 位图字 | 位 | 置位条件 |\n|---|---|---|---|---|\n';
for (const r of out) md += `| ${r.layer} | ${r.fn} | ${r.word} | ${r.bit} | \`${r.cond.replace(/\|/g, '\\|')}\`${r.dup ? ' *(重复)*' : ''} |\n`;
fs.writeFileSync('js/bitmap_guards.md', md, 'utf8');
console.log('-> js/bitmap_guards.md  ' + rows.length + ' 条 / ' + seen.size + ' 个唯一位');
const byWord = {};
for (const r of out) { byWord[r.word] = byWord[r.word] || []; if (!r.dup) byWord[r.word].push(r.bit); }
for (const w of Object.keys(byWord).sort()) console.log('  ' + w + ': bits ' + byWord[w].sort((a, b) => a - b).join(','));
