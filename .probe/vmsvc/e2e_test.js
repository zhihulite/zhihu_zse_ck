const fs = require('fs'), path = require('path');
const gen = require(path.resolve(__dirname, '..', '..', 'js', 'zse_ck_generator.js'));
const samples = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'env_samples.json'), 'utf8'));
let ok = 0, fail = 0;
for (const s of samples) {
  // 1) 把已知 record93 拆成环境检测的三段输出
  const fontBitmapHex = s.rec93.slice(0, 48);
  const fingerprintMd5 = s.rec93.slice(48, 80);
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120';   // crc32 输入
  const tail4 = s.rec93.slice(89, 93);
  // 2) 用 crc32 重建 record93（MD5 直接用已知的——MD5 的输入 parts 无法从 record 反推）
  const crc = gen.crc32(ua).toString(16).padStart(8, '0');
  const rebuilt = [fontBitmapHex, fingerprintMd5, 'z', crc, tail4].join('');
  const recOk = rebuilt === s.rec93;
  // 3) 生成 token
  const profile = { rk: s.rk, iv_bytes: Array.from(s.iv, c => c.charCodeAt(0) & 255),
                    mask: s.mask, alphabet: s.alphabet, xreg: s.xreg };
  const token = gen.generateToken(gen.record93ToPt(Array.from(s.rec93, c => c.charCodeAt(0) & 255)), profile);
  const tokOk = token === s.token;
  if (recOk && tokOk) ok++; else { fail++; console.log('  FAIL ' + s.file + ' rec=' + recOk + ' tok=' + tokOk); }
}
console.log('end-to-end (record93 拆解→重组→token): ' + ok + '/' + samples.length);
process.exit(fail ? 1 : 0);