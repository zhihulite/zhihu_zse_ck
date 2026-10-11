// 决定性实验：在 Node 里跑真实挑战 JS，观测 __b.z(zh) 的行为
const fs = require('fs');
const vm = require('vm');

const log = [];
function L(...a) { const s = a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '); log.push(s); }

// ---- 最小浏览器环境 ----
const store = {};
const localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
};
const documentStub = {
  cookie: '',
  createElement: () => ({ style: {}, getContext: () => null, setAttribute() {}, appendChild() {} }),
  documentElement: { style: {} },
  getElementsByTagName: () => [],
  addEventListener() {},
};
const navigatorStub = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  platform: 'Win32', languages: ['zh-CN', 'zh'], hardwareConcurrency: 8, deviceMemory: 8,
  webdriver: false, plugins: { length: 5 }, mimeTypes: { length: 4 },
};
const screenStub = { width: 1920, height: 1080, colorDepth: 24, availWidth: 1920, availHeight: 1040, pixelDepth: 24 };
const locationStub = { href: 'https://www.zhihu.com/', hostname: 'www.zhihu.com', protocol: 'https:', origin: 'https://www.zhihu.com' };

const sandbox = {
  console: { log: (...a) => L('[page]', ...a), warn() {}, error: (...a) => L('[err]', ...a), debug() {}, info() {} },
  localStorage, sessionStorage: localStorage, document: documentStub,
  navigator: navigatorStub, screen: screenStub, location: locationStub,
  setTimeout, setInterval, clearTimeout, clearInterval, Date, Math, JSON, parseInt, parseFloat, isNaN,
  encodeURIComponent, decodeURIComponent, atob, btoa, TextEncoder, TextDecoder,
  performance: { now: () => Date.now() },
  crypto: require('crypto').webcrypto,
  addEventListener() {}, removeEventListener() {}, fetch: () => Promise.reject(new Error('no fetch')),
  XMLHttpRequest: function () { this.open = () => {}; this.send = () => {}; this.setRequestHeader = () => {}; },
  WebAssembly, Buffer, Uint8Array, Uint16Array, Int32Array, ArrayBuffer, DataView,
  Error, TypeError, RangeError, RegExp, String, Number, Boolean, Object, Array, Function, Proxy, Reflect, Symbol, Map, Set, WeakMap, WeakSet, Promise,
  self: null, top: null, parent: null, frames: [], history: { pushState() {}, replaceState() {} },
  chrome: { runtime: {} }, process: undefined,
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.top = sandbox;
sandbox.parent = sandbox;
sandbox.globalThis = sandbox;

const ctx = vm.createContext(sandbox);

// ---- 观测钩子 ----
const src = fs.readFileSync('.probe/eval-83-136041.js', 'utf8');

// 包一层：加载后把 __b 暴露出来，并给 zh 装 getter 记录读取
const wrapped = src + `
;try{ globalThis.__BVM_REF = (typeof __b!=='undefined')?__b:null; }catch(e){ globalThis.__BVM_REF=null; }
`;

let err = null;
try {
  vm.runInContext(wrapped, ctx, { filename: 'challenge.js', timeout: 60000 });
} catch (e) { err = e; }

L('=== load error:', err ? (err.name + ': ' + err.message) : 'none');
L('=== global keys sample:', Object.keys(ctx).filter(k => !['window','self','top','parent','globalThis'].includes(k)).slice(0, 60));

const b = ctx.__BVM_REF;
L('=== __b present:', !!b);
if (b) {
  L('=== __b own props:', Object.getOwnPropertyNames(b));
  L('=== typeof __b.z:', typeof b.z, ' typeof __b.t:', typeof b.t);
  L('=== __b.zh:', typeof b.zh, b.zh ? String(b.zh).slice(0, 80) : null);
  L('=== __b.word:', b.word, 'program len:', b.program && b.program.length);
  // 决定性测试：直接调 z(zh)
  try {
    const r = b.z(b.zh);
    L('=== b.z(b.zh) =>', typeof r, JSON.stringify(r));
  } catch (e) { L('=== b.z(b.zh) THREW:', e.name + ': ' + e.message); }
  try {
    const r2 = b.z(0);
    L('=== b.z(0) =>', typeof r2, JSON.stringify(r2));
  } catch (e) { L('=== b.z(0) THREW:', e.name + ': ' + e.message); }
}

fs.writeFileSync('.probe/zsec/run_bvm_node.out.txt', log.join('\n'), 'utf8');
console.log(log.join('\n'));
