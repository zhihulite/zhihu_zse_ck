// 逐层功能级加载测试：在 Node 沙箱里跑，观察定义/运行行为
const fs = require('fs');
const vm = require('vm');

const LAYERS = ['zse_ck_fingerprint', 'zse_ck_orchestrator', 'zse_ck_inner', 'zse_ck_payload', 'zse_ck_cvm'];
const P = (m) => process.stdout.write(m + '\n');

const noop = () => 0;
function makeSandbox() {
  const el = () => ({
    style: {}, id: '', innerHTML: '', width: 0, height: 0, offsetWidth: 100, offsetHeight: 20,
    getAttribute: () => null, setAttribute: noop, appendChild: noop, removeChild: noop,
    getContext: () => ({ getExtension: () => ({ UNMASKED_VENDOR_WEBGL: 1, UNMASKED_RENDERER_WEBGL: 2 }),
      getParameter: () => 'x', fillRect: noop, fillText: noop, beginPath: noop, arc: noop,
      closePath: noop, fill: noop }),
    toDataURL: () => 'data:image/png;base64,AAAA',
  });
  const s = {
    console: { log: noop, warn: noop, error: noop, info: noop, table: noop, trace: noop, exception: noop },
    setTimeout, clearTimeout, setInterval, clearInterval,
    Reflect, Math, JSON, Date, Promise, Error, BigInt, Number, String, Array, Object, Symbol,
    TextDecoder: global.TextDecoder, TextEncoder: global.TextEncoder,
    Uint8Array, Uint16Array, Uint32Array, Int8Array, Int16Array, Int32Array,
    Float32Array, Float64Array, ArrayBuffer, DataView, isNaN, parseInt, parseFloat,
    decodeURIComponent, encodeURIComponent, unescape, escape,
    performance: { now: () => Number(process.hrtime.bigint() / 1000n) / 1000 },
    crypto: require('crypto').webcrypto,
    atob: (x) => Buffer.from(x, 'base64').toString('binary'),
    btoa: (x) => Buffer.from(x, 'binary').toString('base64'),
    WebAssembly,
    Worker: function () { this.postMessage = noop; this.terminate = noop; },
    Blob: function () { }, URL: { createObjectURL: () => 'blob:x', revokeObjectURL: noop },
    __g: new Proxy({}, { get: (t, k) => (k in t ? t[k] : (() => {})) }),
  };
  s.window = s; s.self = s; s.globalThis = s;
  s.document = { createElement: el, getElementById: () => null, getElementsByTagName: () => [el()],
    querySelector: () => null, documentElement: el(), head: el(), body: el(), cookie: '', addEventListener: noop };
  s.navigator = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:152.0) Gecko/20100101 Firefox/152.0',
    hardwareConcurrency: 8, plugins: [], mimeTypes: [], languages: ['zh-CN'] };
  s.location = { href: 'https://www.zhihu.com/', protocol: 'https:', reload: noop };
  return s;
}

for (const lay of LAYERS) {
  const f = lay + '.restored.js';
  P('=== ' + f + ' ===');
  const src = fs.readFileSync(f, 'utf8');
  const sandbox = makeSandbox();
  vm.createContext(sandbox);
  try {
    vm.runInContext(src, sandbox, { timeout: 15000 });
    // 看定义了哪些新全局
    const keys = Object.keys(sandbox).filter(k => !['console', 'setTimeout', 'clearTimeout', 'setInterval',
      'clearInterval', 'Reflect', 'Math', 'JSON', 'Date', 'Promise', 'Error', 'BigInt', 'Number', 'String',
      'Array', 'Object', 'Symbol', 'TextDecoder', 'TextEncoder', 'Uint8Array', 'Uint16Array', 'Uint32Array',
      'Int8Array', 'Int16Array', 'Int32Array', 'Float32Array', 'Float64Array', 'ArrayBuffer', 'DataView',
      'isNaN', 'parseInt', 'parseFloat', 'decodeURIComponent', 'encodeURIComponent', 'unescape', 'escape',
      'performance', 'crypto', 'atob', 'btoa', 'WebAssembly', 'Worker', 'Blob', 'URL', '__g', 'window', 'self',
      'globalThis', 'document', 'navigator', 'location'].includes(k));
    P('  加载 OK；新全局: ' + JSON.stringify(keys));
    for (const k of keys) {
      const v = sandbox[k];
      P('    ' + k + ' : ' + (typeof v) + (typeof v === 'function' ? ' arity=' + v.length : ''));
    }
  } catch (e) {
    P('  加载失败: ' + String(e).slice(0, 200));
  }
  P('');
}
