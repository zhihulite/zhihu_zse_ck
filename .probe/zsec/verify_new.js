const fs = require('fs');
const gen = require('../../js/zse_ck_generator.js');

const tok = fs.readFileSync('blobs/g_ck.txt', 'utf8').trim();
console.log('token', tok.slice(0, 30), 'len', tok.length);

const samples = JSON.parse(fs.readFileSync('../vmsvc/env_samples.json', 'utf8'));

// 去重 profile
const seen = new Map();
for (const s of samples) {
  const key = s.alphabet + '|' + s.mask + '|' + s.iv + '|' + s.xreg + '|' + s.rk.join(',');
  if (!seen.has(key)) seen.set(key, s);
}
console.log('distinct profiles:', seen.size);

for (const [key, s] of seen) {
  const profile = { rk: s.rk, iv_bytes: Array.from(s.iv, c => c.charCodeAt(0) & 255),
                    mask: s.mask, alphabet: s.alphabet, xreg: s.xreg };
  let res;
  try { res = gen.parseToken(tok, profile); } catch (e) { console.log('  ERR', e.message); continue; }
  const pad = res.pad.join(',');
  const rec = String.fromCharCode(...res.record93);
  const hexOk = /^[0-9a-f]{48}[0-9a-f]{32}.[0-9a-f]{8}[0-9a-f]{4}$/.test(rec);
  console.log('--- profile', key.slice(0, 40));
  console.log('   pad =', pad, ' hexOk =', hexOk);
  console.log('   rec =', rec);
}
