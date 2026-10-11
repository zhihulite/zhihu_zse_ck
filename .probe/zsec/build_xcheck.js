const fs = require('fs');

// 捕获还原件（把末尾 return collectEnvParts(); 改成返回函数本体）
let cap = fs.readFileSync('env_detect.restored.js', 'utf8');
cap = cap.replace(/return collectEnvParts\(\);\s*$/, 'return collectEnvParts;');

// 我方参考实现：从 zse_ck_generator.js 抽 md5 核心 + collectParts
const gen = fs.readFileSync('../../js/zse_ck_generator.js', 'utf8');
const md5core = gen.slice(gen.indexOf('const decodeStr'),
                          gen.indexOf('// ---------------------------------------------------------------- 环境检测（浏览器）'));
const collect = gen.slice(gen.indexOf('function collectParts()'),
                          gen.indexOf('// ---------------------------------------------------------------- crc32'));

const body = `/* zse_ck 交叉验证：捕获原版 vs 我方还原 */
;(function () {
  // ---- A: 捕获原版（jsvmp 还原件） ----
  window.__CAP_FN = (function () {
${cap}
  })();

  // ---- B: 我方参考实现 ----
  ${md5core}
  ${collect}

  window.__RUN = function () {
    var out = { captured: null, reference: null, err: null };
    try {
      var origJoin = Array.prototype.join, grabbed = null;
      Array.prototype.join = function (sep) {
        var r = origJoin.apply(this, arguments);
        if (sep === '|' && this.length > 5 && grabbed === null) grabbed = { n: this.length, joined: String(r) };
        return r;
      };
      try { out.capturedMd5 = window.__CAP_FN(); } finally { Array.prototype.join = origJoin; }
      out.captured = grabbed;
    } catch (e) { out.err = 'captured: ' + e; }
    try {
      var p = collectParts();
      out.reference = { n: p.length, joined: p.join('|'), md5: fingerprintMd5(p) };
    } catch (e) { out.err = (out.err || '') + ' reference: ' + e; }
    if (out.captured && out.reference) {
      out.partsEqual = out.captured.joined === out.reference.joined;
      out.md5Equal = out.capturedMd5 === out.reference.md5;
      if (!out.partsEqual) {
        var a = out.captured.joined.split('|'), b = out.reference.joined.split('|');
        out.diff = [];
        for (var i = 0; i < Math.max(a.length, b.length); i++) {
          if (a[i] !== b[i]) out.diff.push({ i: i, captured: a[i], reference: b[i] });
        }
      }
    }
    return out;
  };
})();
`;
fs.writeFileSync('xcheck.js', body);
console.log('wrote xcheck.js', body.length);
