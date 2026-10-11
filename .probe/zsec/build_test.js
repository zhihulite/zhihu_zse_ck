const fs = require('fs');

// 1) 捕获体（数组 + 旋转 + 解码器 + r()）
const deob = fs.readFileSync('jsvmp_deob.js', 'utf8');

// 2) 我方参考实现（取自 zse_ck_generator.js 的 collectParts + fingerprintMd5 + md5 核心）
const gen = fs.readFileSync('../../js/zse_ck_generator.js', 'utf8');

// 只取参考实现里的 md5 核心与 collectParts
const mStart = gen.indexOf('const decodeStr');
const mEnd = gen.indexOf('// ---------------------------------------------------------------- 环境检测（浏览器）');
const md5core = gen.slice(mStart, mEnd);
const cStart = gen.indexOf('function collectParts()');
const cEnd = gen.indexOf('// ---------------------------------------------------------------- crc32');
const collect = gen.slice(cStart, cEnd);

const body = `
;(function(){
  ${deob}
  // ---- 捕获体结果 ----
  window.__CAPTURED_PARTS = null;
  try { window.__R = r; } catch(e) { window.__R_ERR = String(e); }

  // ---- 参考实现 ----
  ${md5core}
  ${collect}
  window.__REF = function(){
    var parts = collectParts();
    return { parts: parts, md5: fingerprintMd5(parts) };
  };
})();
`;
fs.writeFileSync('env_detect_test.js', body);
console.log('wrote env_detect_test.js', body.length);
