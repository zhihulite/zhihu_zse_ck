// Decode v2: normalize guard expressions to if-form, then walk to singleton J->handler.
import fs from 'node:fs';
import vm from 'node:vm';

const boot = fs.readFileSync('.probe/live-fns.bootstrap.js', 'utf8');
const folded = fs.readFileSync('.probe/live-VM.folded.js', 'utf8');
const ctx = vm.createContext({ console });
vm.runInContext(boot + '\n;globalThis.__dec = _0x26f8;', ctx, { timeout: 20000 });
const dec = (n) => vm.runInContext(`__dec(${n})`, ctx);

let body = folded.slice(folded.indexOf("this['J']=this['T']["));
// resolve string aliases _0xNAME(0xNN)
body = body.replace(/_0x[0-9a-f]+\((0x[0-9a-f]+|\d+)\)/g, (mm, hex) => {
  try { return JSON.stringify(dec(parseInt(hex, 16))); } catch (e) { return mm; }
});
// fold arithmetic
let prev = null;
while (prev !== body) {
  prev = body;
  body = body.replace(/-?\b0x[0-9a-f]+(?:\s*[-+]\s*-?0x[0-9a-f]+)+\b/g, (mm) => {
    try { return String(Function('"use strict";return (' + mm + ')')()); } catch (e) { return mm; }
  });
}
// normalize `this['J']<=N&&(X)` -> if form (brace-matched)
function normGuards(s) {
  let out = s, guardRe = /this\['J'\]<=(-?\d+)&&\(/g, m, guard = 0;
  while ((m = guardRe.exec(out)) && guard < 5000) {
    const n = m[1];
    const openAt = m.index + m[0].length - 1;
    let d = 0, i = openAt, closeAt = -1;
    for (; i < out.length; i++) {
      if (out[i] === '(') d++;
      else if (out[i] === ')') { d--; if (d === 0) { closeAt = i; break; } }
    }
    if (closeAt < 0) break;
    out = out.slice(0, openAt) + '{' + out.slice(openAt + 1, closeAt) + '}' + out.slice(closeAt + 1);
    out = out.slice(0, m.index) + 'if(this[\'J\']<=' + n + ')' + out.slice(m.index + m[0].length - 1 - ('&&('.length) + 1);
    // recompute: simpler - rebuild by splicing
    guard++;
    guardRe.lastIndex = 0;
  }
  return out;
}
// simpler correct implementation of the guard rewrite
function normGuards2(s) {
  let out = '', i = 0, n = 0;
  const re = /this\['J'\]<=(-?\d+)&&\(/g;
  let m;
  while ((m = re.exec(s))) {
    const openAt = m.index + m[0].length - 1;
    let d = 0, j = openAt, closeAt = -1;
    for (; j < s.length; j++) {
      if (s[j] === '(') d++;
      else if (s[j] === ')') { d--; if (d === 0) { closeAt = j; break; } }
    }
    if (closeAt < 0) break;
    out += s.slice(i, m.index) + "if(this['J']<=" + m[1] + '){' + s.slice(openAt + 1, closeAt) + '}';
    i = closeAt + 1;
    re.lastIndex = i;
    n++;
  }
  out += s.slice(i);
  return [out, n];
}
let guards = 0;
[body, guards] = normGuards2(body);
// ternary on J: this['J']<=N?A:B;  (no nested colon within branches for these)
body = body.replace(/this\['J'\]<=(-?\d+)\?([^;{}]*):([^;{}]*);/g,
  "if(this['J']<=$1){$2}else{$3};");
fs.writeFileSync('.probe/vmsvc/z_norm.js', body);
console.log('guards normalized:', guards, 'len', body.length);

// walk
const out = [];
function walk(seg, lo, hi, depth) {
  if (depth > 300) { out.push({ lo, hi, code: 'DEEP ' + seg.trim().slice(0, 150) }); return; }
  const m = /this\['J'\]<=(-?\d+)\s*\)\s*\{/.exec(seg);
  if (!m) {
    const c = seg.trim();
    if (c && /return|this\['|var |throw|_0x/.test(c)) out.push({ lo, hi, code: c });
    return;
  }
  const n = parseInt(m[1], 10);
  const openAt = m.index + m[0].length - 1;
  let d = 0, i = openAt, closeAt = -1;
  for (; i < seg.length; i++) {
    if (seg[i] === '{') d++;
    else if (seg[i] === '}') { d--; if (d === 0) { closeAt = i; break; } }
  }
  if (closeAt < 0) { out.push({ lo, hi, code: 'UNBAL ' + seg.trim().slice(0, 120) }); return; }
  const thenPart = seg.slice(openAt + 1, closeAt);
  let rest = seg.slice(closeAt + 1);
  const em = /^\s*else\s*\{/.exec(rest);
  let elsePart = '';
  if (em) {
    let j = em[0].length, d2 = 1, close2 = -1;
    for (; j < rest.length; j++) {
      if (rest[j] === '{') d2++;
      else if (rest[j] === '}') { d2--; if (d2 === 0) { close2 = j; break; } }
    }
    if (close2 < 0) { out.push({ lo, hi, code: 'UNBAL-ELSE' }); return; }
    elsePart = rest.slice(em[0].length, close2);
    rest = rest.slice(close2 + 1);
  } else {
    const em2 = /^\s*else\s*(?!\{)/.exec(rest);
    if (em2) {
      rest = rest.slice(em2[0].length);
      const m2 = /^if\(/.exec(rest);
    }
  }
  walk(thenPart, lo, n, depth + 1);
  // tail after else-block belongs to the else branch as well (chained if-else if)
  if (!em && rest.trim()) walk(rest, n + 1, hi, depth + 1);
  else if (em) {
    if (rest.trim()) walk(elsePart + rest, n + 1, hi, depth + 1);
    else walk(elsePart, n + 1, hi, depth + 1);
  }
}
const st = body.indexOf("if(this['J']<0)return;");
walk(body.slice(st >= 0 ? st + 22 : 0), 0, 834, 0);
out.sort((a, b) => a.lo - b.lo);
let txt = '';
for (const x of out) txt += `J=${x.lo}${x.hi !== x.lo ? '..' + x.hi : ''}  :  ${x.code.replace(/\s+/g, ' ').slice(0, 240)}\n`;
fs.writeFileSync('.probe/vmsvc/isa2.txt', txt);
console.log('leaves:', out.length, ' singletons:', out.filter(x => x.lo === x.hi).length);

// decode T with best-match (prefer singleton, else narrowest range)
const T = JSON.parse(fs.readFileSync('.probe/map/VM_builtin_T.json', 'utf8'));
const pick = (j) => {
  let best = null;
  for (const x of out) if (j >= x.lo && j <= x.hi) {
    if (!best || (x.lo === x.hi) || (x.hi - x.lo) < (best.hi - best.lo)) best = x;
  }
  return best;
};
let dt = '';
T.forEach((j, pc) => {
  const e = pick(j);
  dt += String(pc).padStart(3) + ' J=' + String(j).padStart(3) + '  ' + (e ? e.code.replace(/\s+/g, ' ').slice(0, 170) : '??') + '\n';
});
fs.writeFileSync('.probe/vmsvc/T_disasm2.txt', dt);
console.log('T_disasm2 written');
