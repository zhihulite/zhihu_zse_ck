// 在 handenv 里跑 zse_ck_generator.js 的 collectParts，输出 parts（供与真浏览器对比）
const vm = require('vm');
const fs = require('fs');
const { createEnv } = require('./handenv.js');

const sandbox = createEnv();
sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'fp' });
for (const k of ['Object', 'Array', 'String', 'Math', 'JSON', 'Date', 'Number', 'Boolean',
                 'parseInt', 'parseFloat', 'isNaN', 'encodeURIComponent', 'decodeURIComponent',
                 'Proxy', 'Reflect', 'Symbol', 'Map', 'Set', 'Uint8Array', 'ArrayBuffer']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch (e) {} }
}

const src = fs.readFileSync('js/zse_ck_generator.js', 'utf8');
const m = src.match(/function collectParts\(\)\s*\{[\s\S]*?\n\}/);
if (!m) { console.log('未找到 collectParts'); process.exit(1); }

const js = m[0] + `
  (function(){
    var parts = collectParts();
    return JSON.stringify({ parts: parts, ua: (window.navigator && window.navigator.userAgent) || '' });
  })()
`;
let out;
try { out = vm.runInContext(js, ctx); } catch (e) { console.log('跑 collectParts 失败:', e.message); process.exit(1); }
fs.writeFileSync('.probe/oracle/mine_parts.json', out);
const o = JSON.parse(out);
console.log('我的 parts 数:', o.parts.length);
console.log(JSON.stringify(o.parts, null, 1).slice(0, 2200));
