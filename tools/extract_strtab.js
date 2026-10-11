const fs = require('fs');
const s = fs.readFileSync('.probe/live-6d0ccece4cfc.js', 'utf8');
const BS = String.fromCharCode(92);

const re = /function (_0x[0-9a-f]+)\(\)\{var (_0x[0-9a-f]+)=\[/g;
let m, found = [];
while ((m = re.exec(s))) {
  const start = m.index + m[0].length - 1;
  let depth = 0, i = start, inStr = null, end = -1;
  for (; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (c === BS) { i++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === "'" || c === '"') { inStr = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  const txt = s.slice(start, end + 1);
  let arr;
  try { arr = eval(txt); } catch (e) { arr = null; }
  if (arr) found.push({ fn: m[1], idx: m.index, n: arr.length, arr, txtLen: txt.length });
}
found.sort((a, b) => b.n - a.n);
console.log('找到字符串表函数:', found.map(f => f.fn + '(' + f.n + ')').join(', '));

// 取最大的那个作为主表
const main = found[0];
console.log('主表 %s: %d 项, 字面量 %d 字节', main.fn, main.n, main.txtLen);
fs.writeFileSync('.probe/zsec/js_strtab.json', JSON.stringify(main.arr), 'utf8');

for (const idx of [0x10f, 0x10e, 0x110, 0x124, 0x127, 0x103, 0x115, 0x10e]) {
  const v = main.arr[idx];
  console.log('  [0x%s] %s', idx.toString(16), typeof v === 'string' ? JSON.stringify(v).slice(0, 220) : String(v));
}
const longs = main.arr.map((v, k) => [k, typeof v === 'string' ? v.length : -1]).filter(x => x[1] > 150).sort((a, b) => b[1] - a[1]);
console.log('长度 >150 的项 (index, len):', longs.slice(0, 15).map(x => '(' + x[0] + ',' + x[1] + ')').join(' '));
