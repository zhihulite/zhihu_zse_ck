const gen = require('../js/zse_ck_generator.js');
const fs = require('fs'), path = require('path');
const samples = JSON.parse(fs.readFileSync('.probe/vmsvc/env_samples.json', 'utf8'));
let ok = 0, fail = 0;
for (const s of samples) {
  const profile = { rk: s.rk, iv_bytes: Array.from(s.iv, c => c.charCodeAt(0) & 255),
                    mask: s.mask, alphabet: s.alphabet, xreg: s.xreg };
  const rec = Array.from(s.rec93, c => c.charCodeAt(0) & 255);
  let got;
  try { got = gen.generateToken(rec, profile); } catch (e) { got = 'ERR ' + e.message; }
  const hit = got === s.token;
  if (hit) ok++; else { fail++; console.log('  MISMATCH ' + s.file + '\n    got: ' + got.slice(0, 40) + '\n    exp: ' + s.token.slice(0, 40)); }
}
console.log('token generation: ' + ok + '/' + samples.length + ' char-for-char identical' + (fail ? ' (' + fail + ' fail)' : ''));
process.exit(fail ? 1 : 0);