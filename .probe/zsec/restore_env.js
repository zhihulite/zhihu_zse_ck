const fs = require('fs');

let s = fs.readFileSync('jsvmp_deob.js', 'utf8');

// 1) 常量折叠：把只含数字/运算符的括号表达式求值
function foldConstants(src) {
  const re = /\(([-+*/0-9a-fx\s]+)\)/g;
  let prev;
  do {
    prev = src;
    src = src.replace(re, (m, inner) => {
      const t = inner.trim();
      if (!/^[-+*/0-9a-fx\s]+$/.test(t)) return m;
      if (!/[+\-*/]/.test(t)) return m;            // 纯数字不动
      if (/^0x[0-9a-f]+$/i.test(t) || /^\d+$/.test(t)) return m;
      try {
        // eslint-disable-next-line no-new-func
        const v = Function('"use strict";return (' + t + ')')();
        if (typeof v === 'number' && Number.isFinite(v)) return String(v);
      } catch (e) { }
      return m;
    });
  } while (src !== prev);
  return src;
}

// 2) 标识符改名
const REN = [
  ['_0x599f', '_stringTableInit'],
  ['_0x2f5e70', 'STRINGS'],
  ['_0x4848', 'decodeString'],
  ['_0x483804', 'md5Hex'],
  ['_0x408d39', 'binlMD5'],
  ['_0x340f6e', 'md5cmn'],
  ['_0x27e95f', 'md5ff'],
  ['_0x1fec22', 'md5gg'],
  ['_0x479bec', 'md5hh'],
  ['_0x29b6d0', 'md5ii'],
  ['_0x7a98', 'safeAdd'],
  ['_0x24eac6', 'parts'],
  ['_0x18eec0', 'once'],
  ['_0x93a7c4', 'd'],
  ['_0x55a077', 'getTable'],
  ['_0x3c6d8d', 'targetNum'],
  ['_0x4a65a1', 'd0'],
  ['_0x3e60c7', 'tbl'],
];
for (const [a, b] of REN) {
  s = s.replace(new RegExp(a.replace('$', '\\$'), 'g'), b);
}
// r() -> collectEnvParts()
s = s.replace(/\bfunction r\(\)/, 'function collectEnvParts()');
s = s.replace(/\breturn r\(\);/, 'return collectEnvParts();');

s = foldConstants(s);

// 3) 排版
let pretty = s
  .replace(/;/g, ';\n')
  .replace(/\{/g, '{\n')
  .replace(/\}/g, '\n}\n')
  .replace(/,/g, ',\n');
pretty = pretty.split('\n').map(l => l.trimEnd()).filter(l => l.trim() !== '').join('\n');

const header = `/**
 * zse_ck v4 —— 运行时捕获的「环境检测 jsvmp」还原件
 *
 * 来源：浏览器 hook window.Function，捕获 new Function(<src>) 的实参源码（27264 字符）
 * 还原：127 项字符串表全部解码 + 常量折叠 + 标识符改名
 *
 * collectEnvParts() 采集顺序（与 record93[48:80) 的指纹 MD5 对应）：
 *   1. navigator.hardwareConcurrency
 *   2. WebGL UNMASKED_VENDOR_WEBGL / UNMASKED_RENDERER_WEBGL（附反 hook：重建 console）
 *   3. canvas 2D 指纹：'WelCome ZhiHu!' / '8pt ZhiHu' / 弧线 / 颜色
 *   4. 66 项字体探测（GJLwwwwwwwwww @100px，与 monospace/sans-serif/serif 三基准比对）
 *   5. navigator.plugins 名称
 *   返回 md5Hex(parts.join('|'))   <-- record93[48:80)
 */

`;
fs.writeFileSync('env_detect.restored.js', header + pretty);
console.log('wrote env_detect.restored.js', (header + pretty).length);
console.log('--- 前 40 行 ---');
console.log(pretty.split('\n').slice(0, 40).join('\n'));
