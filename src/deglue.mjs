// Deobfuscate the wasm_exec glue (eval-8-11841.js): decode the string pool and
// substitute _0xNNNN(...) lookups + constant arithmetic, so the import
// implementations become readable.
import fs from 'node:fs';

const src = fs.readFileSync('.probe/eval-8-11841.js', 'utf8');

const poolMatch = src.match(/const _0x460ada=\[(.*?)\];/s);
if (!poolMatch) { console.error('pool not found'); process.exit(1); }
const items = poolMatch[1].match(/'((?:[^'\\]|\\.)*)'/g).map((s) => s.slice(1, -1));
const ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
function dec(s) {
  let out = '', bits = 0, acc = 0;
  for (const ch of s) {
    const v = ALPHA.indexOf(ch);
    if (v < 0) continue;
    acc = bits % 4 ? acc * 64 + v : v;
    if (bits++ % 4) out += String.fromCharCode(255 & (acc >> ((-2 * bits) & 6)));
  }
  try {
    return decodeURIComponent(out.split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  } catch { return out; }
}
const pool = items.map(dec);
fs.writeFileSync('.probe/map/glue-pool.json', JSON.stringify(pool, null, 1));
console.error('pool size', pool.length);

// index offset: _0x17a3 does _0x53ec96 = _0x53ec96 - 107
let out = src;
// replace alias calls _0xNAME(0xNN) where the alias is a local of _0x17a3
const aliasRe = /_0x[0-9a-f]{4,6}\((0x[0-9a-f]+)\)/g;
out = out.replace(aliasRe, (m, hex) => {
  const idx = parseInt(hex, 16) - 107;
  const s = pool[idx];
  if (s === undefined) return m;
  return JSON.stringify(s);
});
// fold simple +/- chains of hex ints (no parens), e.g. (-0x131a+0xe91+0x491)
const exprRe = /-?\b0x[0-9a-f]+(?:\s*[-+]\s*-?0x[0-9a-f]+)+\b/g;
out = out.replace(exprRe, (m) => {
  try {
    const v = Function(`"use strict";return (${m.replaceAll('0x', '0x')})`)();
    return String(v);
  } catch { return m; }
});
fs.writeFileSync('.probe/map/glue-readable.js', out);
console.error('wrote .probe/map/glue-readable.js');
