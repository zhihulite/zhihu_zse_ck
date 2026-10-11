#!/usr/bin/env node
// 列出还原件里全部「环境检测」守卫（含不置位的），标注层/函数/置位
// 用法: node tools/list_env_checks.js
const fs = require('fs');
const parser = require('@babel/parser');
const gen = require('@babel/generator').default;
const codeOf = (n) => { try { return gen(n, { comments: false }).code; } catch (e) { return '?'; } };

const LAYERS = [
  { file: 'js/payload.restored.js', name: 'payload', words: { v3: 'w1', v4: 'w2', v5: 'w3', v6: 'w4' } },
  { file: 'js/inner.restored.js',   name: 'inner',   words: { v3: 'w5', v4: 'w6' } },
  { file: 'js/cvm.restored.js',     name: 'cvm',     words: { v7: 'w10', v8: 'w11' } },
  { file: 'js/service.restored.js', name: 'service', words: {} },
];

function bitOf(right) {
  let n = right;
  while (n && n.type === 'ParenthesizedExpression') n = n.expression;
  if (!n) return null;
  if (n.type === 'NumericLiteral') return n.value === 1 ? 0 : null;
  if (n.type === 'BinaryExpression' && n.operator === '<<' && n.left.type === 'NumericLiteral' &&
      n.left.value === 1 && n.right.type === 'NumericLiteral') return n.right.value;
  return null;
}

const rows = [];
for (const L of LAYERS) {
  if (!fs.existsSync(L.file)) continue;
  const ast = parser.parse(fs.readFileSync(L.file, 'utf8'), { sourceType: 'script', allowReturnOutsideFunction: true });
  (function walk(node, fn) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(n => walk(n, fn)); return; }
    if (node.type === 'FunctionDeclaration') fn = node.id.name;
    if (node.type === 'IfStatement') {
      const cond = codeOf(node.test);
      const sets = [];
      const scanBody = (b) => {
        if (!b || b.type !== 'BlockStatement') return;
        for (const st of b.body) {
          const e = st.type === 'ExpressionStatement' ? st.expression : null;
          if (e && e.type === 'AssignmentExpression' && e.operator === '|=' && e.left.type === 'Identifier') {
            const w = L.words[e.left.name]; const bit = bitOf(e.right);
            if (w && bit !== null) sets.push(w + '.' + bit);
          }
        }
      };
      scanBody(node.consequent);
      if (node.alternate && node.alternate.type === 'IfStatement') scanBody(node.alternate.consequent);
      rows.push({ layer: L.name, fn, cond, sets: sets.join(',') });
    }
    for (const k of Object.keys(node)) {
      if (k === 'loc' || k === 'start' || k === 'end') continue;
      walk(node[k], fn);
    }
  })(ast.program, null);
}

// 去重（同层同条件合并置位）
const seen = new Map();
for (const r of rows) {
  const key = r.layer + '|' + r.cond;
  if (seen.has(key)) { if (r.sets && !seen.get(key).sets.includes(r.sets)) seen.get(key).sets += (seen.get(key).sets ? ', ' : '') + r.sets; continue; }
  seen.set(key, { ...r });
}
const uniq = [...seen.values()];

let md = '# 环境检测清单（由 js/*.restored.js 抽出）\n\n';
md += `共 ${rows.length} 条守卫，去重后 **${uniq.length}** 条。\n`;
md += `"置位" 列给出该守卫为真时 OR 进位图的位（w1–w6、w10–w11）；空的表示不置位。\n\n`;
for (const L of LAYERS) {
  const list = uniq.filter(r => r.layer === L.name);
  if (!list.length) continue;
  md += `## ${L.name}（${list.length} 条）\n\n| 函数 | 检测条件 | 置位 |\n|---|---|---|\n`;
  for (const r of list) md += `| ${r.fn} | \`${r.cond.replace(/\|/g, '\\|')}\` | ${r.sets || '—'} |\n`;
  md += '\n';
}
fs.writeFileSync('js/env_checks.md', md, 'utf8');
console.log('-> js/env_checks.md  守卫 ' + rows.length + ' 条 / 去重 ' + uniq.length + ' 条');
for (const L of LAYERS) console.log('  ' + L.name + ': ' + uniq.filter(r => r.layer === L.name).length);
