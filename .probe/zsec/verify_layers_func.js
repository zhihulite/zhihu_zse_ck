// 六层还原件功能级验证套件（可复跑）
// 判定标准：能加载 + 行为可观测（不是只做 node --check）
const fs = require('fs');
const vm = require('vm');

const P = (m) => process.stdout.write(m + '\n');
const noop = () => 0;

function el() {
  return {
    style: {}, id: '', innerHTML: '', width: 0, height: 0, offsetWidth: 100, offsetHeight: 20,
    getAttribute: () => null, setAttribute: noop, appendChild: noop, removeChild: noop,
    getContext: (k) => k === '2d'
      ? { textBaseline: '', fillStyle: '', font: '', fillRect: noop, fillText: noop, beginPath: noop, arc: noop, closePath: noop, fill: noop }
      : { getExtension: () => ({ UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 }),
          getParameter: (p) => (p === 37445 ? 'Mozilla' : 'MockRenderer') },
    toDataURL: () => 'data:image/png;base64,AAAA',
  };
}

function sandbox() {
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
    module: { exports: {} }, exports: {},
    require: (m) => (m === 'crypto' ? require('crypto') : {}), Buffer,
  };
  s.window = s; s.self = s; s.globalThis = s;
  s.document = { createElement: el, getElementById: () => null, getElementsByTagName: () => [el()],
    querySelector: () => null, documentElement: el(), head: el(), body: el(), cookie: '', addEventListener: noop };
  s.navigator = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:152.0) Gecko/20100101 Firefox/152.0',
    hardwareConcurrency: 8, plugins: [{ name: 'PDF Viewer' }], mimeTypes: [], languages: ['zh-CN'] };
  s.location = { href: 'https://www.zhihu.com/', protocol: 'https:', reload: noop };
  return s;
}

const results = [];

// 1) 指纹层（jsvmp）：包裹后运行，产出 32-hex MD5
{
  const s = sandbox();
  vm.createContext(s);
  try {
    const src = fs.readFileSync('js/fingerprint.restored.js', 'utf8');
    vm.runInContext(src, s, { timeout: 20000 });
    const s2 = (s.module && s.module.exports && s.module.exports.fingerprint)
      ? s.module.exports.fingerprint() : undefined;
    const ok = /^[0-9a-f]{32}$/.test(String(s2));
    results.push(['fingerprint', ok, '产出 ' + s2]);
  } catch (e) { results.push(['fingerprint', false, String(e).slice(0, 90)]); }
}

// 2)-4) 编排 / 内层 / 载荷：加载并核对 ISA 原语
for (const lay of ['orchestrator', 'inner', 'payload', 'service']) {
  const jsf = lay === 'orchestrator' ? 'js/cvm.restored.js' : ('js/' + lay + '.restored.js');
  const s = sandbox();
  vm.createContext(s);
  try {
    vm.runInContext(fs.readFileSync(jsf, 'utf8'), s, { timeout: 15000 });
    const need = ['M_GET', 'M_SET', 'M_EVAL', 'SUBCALL', 'RUN'];
    const missing = need.filter(k => typeof s[k] !== 'function');
    results.push([lay, missing.length === 0,
      missing.length ? '缺 ' + missing.join(',') : 'ISA 原语齐备 ' + need.join('/')]);
  } catch (e) { results.push([lay, false, String(e).slice(0, 90)]); }
}

// 5) 位图汇编器：加载 + 能拼出 93 字符 record93
{
  const s = sandbox();
  vm.createContext(s);
  try {
    vm.runInContext(fs.readFileSync('js/bitmap_assembler.js', 'utf8'), s, { timeout: 15000 });
    const rec = s.buildRecord93({ tag4: '2b0d', payload16: '2000100080004000', inner8: '80008000',
      goSide12: '880080008000', cvm8: '80004000',
      fingerprint32: 'be544511d8accf5879de9179e434e829', crc8: '3efa0afb', tail4: '0434' });
    results.push(['bitmap', rec.length === 93, 'record93=' + rec.length + ' 字符']);
  } catch (e) { results.push(['bitmap', false, String(e).slice(0, 90)]); }
}

P('层                        功能验证  证据');
P('------------------------  --------  ------------------------------------------');
let pass = 0;
for (const [n, ok, ev] of results) {
  if (ok) pass++;
  P(n.padEnd(26) + (ok ? 'PASS' : 'FAIL').padEnd(8) + ev);
}
P('');
P('功能级验证: ' + pass + '/' + results.length + ' 通过');
process.exit(pass === results.length ? 0 : 1);
