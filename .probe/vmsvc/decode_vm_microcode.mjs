// Decode the VM class's range-ISA dispatch + built-in microcode T (272 words).
// Usage: node .probe/vmsvc/decode_vm_microcode.mjs
// Outputs: .probe/vmsvc/isa_table.txt (J -> handler), .probe/vmsvc/T_disasm.txt
import fs from 'node:fs';
import vm from 'node:vm';

const boot = fs.readFileSync('.probe/live-fns.bootstrap.js', 'utf8');
const folded = fs.readFileSync('.probe/live-VM.folded.js', 'utf8');

// execute the bootstrap to obtain the real string decoder _0x26f8 and the class
const ctx = vm.createContext({ console });
vm.runInContext(boot + '\n;globalThis.__dec = _0x26f8;', ctx, { timeout: 20000 });
const dec = (n) => vm.runInContext(`__dec(${n})`, ctx);

// pull the z dispatch function source from the folded VM source
const m = folded.match(/this\['H'\]=function\(_0x395f57\)\{([\s\S]*?);\}\};/) ||
          folded.match(/this\['H'\]=function\((\w+)\)\{([\s\S]*)$/);
let body = null, pcName = null;
if (m) { pcName = m[1]; body = m[2]; }
if (!body) {
  // fallback: locate loop start and take the rest of the function
  const i = folded.indexOf("this['J']=this['T'][");
  body = folded.slice(i);
  pcName = '_0x395f57';
}
// resolve string-table lookups _0x475b8d(0xNN) / _0x4c339a(0xNN)
const aliasRe = /_0x[0-9a-f]{4,6}\((0x[0-9a-f]+|\d+)\)/g;
body = body.replace(aliasRe, (mm, hex) => {
  try {
    const s = dec(parseInt(hex, 16));
    return JSON.stringify(s);
  } catch (e) { return mm; }
});
// fold arithmetic chains of ints
const exprRe = /-?\b0x[0-9a-f]+(?:\s*[-+]\s*-?0x[0-9a-f]+)+\b/g;
let prev = null;
while (prev !== body) {
  prev = body;
  body = body.replace(exprRe, (mm) => {
    try { return String(Function('"use strict";return (' + mm + ')')()); } catch (e) { return mm; }
  });
}
fs.writeFileSync('.probe/vmsvc/z_dispatch_readable.js', body);

// ---- walk the nested if-chain, assign each leaf its J value ----
// The dispatch tests `this['J']<=N` (or the folded var). We do a simple recursive
// scan: find top-level `if(this['J']<=N){A}else{B}` blocks; inside A the bound is N,
// inside B the bound is the enclosing bound.  Leaves = statements.
const out = [];
function walk(seg, lo, hi, depth) {
  if (depth > 200) return;
  // find first dispatch condition in seg
  const re = /this\['J'\]<=(-?\d+)\s*\)\s*\{/g;
  let m = re.exec(seg);
  if (!m) {
    if (seg.trim().length > 0 && /return|this\['|var |throw/.test(seg)) {
      out.push({ lo, hi, code: seg.trim() });
    }
    return;
  }
  const n = parseInt(m[1], 10);
  // find matching close brace for this if
  let i = m.index + m[0].length, d = 1;
  while (i < seg.length && d > 0) {
    if (seg[i] === '{') d++;
    else if (seg[i] === '}') d--;
    i++;
  }
  const thenPart = seg.slice(m.index + m[0].length, i - 1);
  let rest = seg.slice(i);
  // optional else
  const em = /^\s*else\s*\{/.exec(rest);
  let elsePart = '';
  if (em) {
    let j = em[0].length, d2 = 1;
    while (j < rest.length && d2 > 0) {
      if (rest[j] === '{') d2++;
      else if (rest[j] === '}') d2--;
      j++;
    }
    elsePart = rest.slice(em[0].length, j - 1);
    rest = rest.slice(j);
  }
  walk(thenPart, lo, n, depth + 1);
  walk(elsePart + rest, n + 1, hi, depth + 1);
}
// strip the loop preamble up to the first if
const start = body.indexOf("if(this['J']<0)return;");
walk(body.slice(start + "if(this['J']<0)return;".length), 0, 99999, 0);

const isa = out.filter(x => x.hi < 99999 || x.lo > 0 || x.code.length > 0);
isa.sort((a, b) => a.lo - b.lo);
let txt = '# VM range-ISA: J value -> handler (bounds lo..hi)\n';
for (const x of isa) {
  txt += `J=${x.lo}` + (x.hi !== x.lo ? `..${x.hi}` : '') + '  :  ' + x.code.replace(/\s+/g, ' ').slice(0, 220) + '\n';
}
fs.writeFileSync('.probe/vmsvc/isa_table.txt', txt);
console.log('leaves:', isa.length, '-> isa_table.txt');

// ---- decode T ----
const T = JSON.parse(fs.readFileSync('.probe/map/VM_builtin_T.json', 'utf8'));
let dtxt = '# VM built-in microcode T (272 words, old-build IDs)\n';
T.forEach((j, pc) => {
  const e = isa.find(x => j >= x.lo && j <= x.hi);
  dtxt += String(pc).padStart(3) + '  J=' + String(j).padStart(3) + '  ' +
    (e ? e.code.replace(/\s+/g, ' ').slice(0, 150) : '?? unmapped') + '\n';
});
fs.writeFileSync('.probe/vmsvc/T_disasm.txt', dtxt);
console.log('T decoded -> T_disasm.txt');
