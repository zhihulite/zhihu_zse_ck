// 执行源码自带的旋转 IIFE 取到最终串表，再把 _0x258f(...) 全部替换成字面量
const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync('.probe/zsec/generated_js.js', 'utf8');

// 前缀 = IIFE + function _0x4a06(){...} + function _0x258f(...){...} 的定义结束
function endOfFuncDef(s, start) {
  const i = s.indexOf('{', start);
  let d = 0, k = i;
  while (k < s.length) {
    const c = s[k];
    if (c === '"' || c === "'") { const q = c; k++; while (k < s.length && s[k] !== q) { if (s[k] === '\\') k++; k++; } }
    else if (c === '{') d++;
    else if (c === '}') { d--; if (d === 0) return k + 1; }
    k++;
  }
  throw new Error('unbalanced');
}
const p258f = src.indexOf('function _0x258f(');
const cut = endOfFuncDef(src, p258f);
const prefix = src.slice(0, cut);
console.log('cut @', cut, '| prefix len', prefix.length);

const sandbox = { console: { log() {}, warn() {}, error() {}, info() {}, debug() {}, trace() {} } };
sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox);

let err = null;
try {
  vm.runInContext(prefix + '\n;globalThis.__D=_0x258f;globalThis.__TAB=_0x4a06();', ctx, { filename: 'prologue.js', timeout: 60000 });
} catch (e) { err = e; }

const D = sandbox.__D;
const TAB = sandbox.__TAB;
console.log('prologue err:', err ? err.message : null);
console.log('table len:', TAB ? TAB.length : -1);
console.log('旋转后 table:', TAB ? JSON.stringify(TAB) : null);

if (!D) process.exit(1);

// 建映射
const map = {};
const probe = [];
for (let n = 341; n < 341 + 400; n++) {
  let v;
  try { v = D(n); } catch (e) { v = undefined; }
  if (typeof v === 'string') { map[n] = v; }
}
console.log('可解 n 数量:', Object.keys(map).length);
console.log('样例:', JSON.stringify(Object.entries(map).slice(0, 12)));

// 替换：所有 <name>(<num>) 其中 num 在映射里
const names = new Set(['_0x258f']);
for (const m of src.matchAll(/([A-Za-z_$][\w$]*)\s*=\s*_0x258f\b/g)) names.add(m[1]);
for (const m of src.matchAll(/var\s+([A-Za-z_$][\w$]*)\s*=\s*_0x258f\b/g)) names.add(m[1]);
console.log('解码器别名:', [...names].join(', '));

let replaced = 0;
const nameRe = [...names].map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
const out = src.replace(new RegExp('(?:' + nameRe + ')\\((0x[0-9a-fA-F]+|\\d+)\\)', 'g'), (mm, a) => {
  const n = a.startsWith('0x') ? parseInt(a, 16) : parseInt(a, 10);
  if (map[n] !== undefined) { replaced++; return JSON.stringify(map[n]); }
  return mm;
});

fs.writeFileSync('.probe/zsec/generated_js.restored.js', out, 'utf8');
console.log('替换处数:', replaced, '| 产物长度:', out.length);
console.log('残留解码器调用:', (out.match(new RegExp('(?:' + nameRe + ')\\(', 'g')) || []).length);
console.log();
console.log('=== 还原后 head 700 ===');
console.log(out.slice(0, 700));
