// 把还原的浏览器 glue 搬进 Node，用它当 JS 桥驱动 wasm
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const wasmBytes = fs.readFileSync(path.resolve('.probe/zsec/blobs/wasm_b64.bin'));
const glueSrc = fs.readFileSync(path.resolve('zse_ck_service.restored.js'), 'utf8');

// ---- mock 浏览器环境 ----
const noop = () => 0;
const elStub = () => ({
  style: {}, id: '', innerHTML: '', width: 0, height: 0, offsetWidth: 100, offsetHeight: 20,
  getAttribute: () => null, setAttribute: noop, appendChild: noop, removeChild: noop,
  getContext: () => ({ getExtension: () => ({ UNMASKED_VENDOR_WEBGL: 1, UNMASKED_RENDERER_WEBGL: 2 }),
    getParameter: () => 'x', fillRect: noop, fillText: noop, beginPath: noop, arc: noop,
    closePath: noop, fill: noop }),
  toDataURL: () => 'data:image/png;base64,AAAA',
});
const documentMock = {
  createElement: elStub, getElementById: () => null,
  getElementsByTagName: () => [elStub()], querySelector: () => null,
  documentElement: elStub(), head: elStub(), body: elStub(),
  cookie: '', addEventListener: noop, readyState: 'complete',
};
const navigatorMock = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:152.0) Gecko/20100101 Firefox/152.0',
  hardwareConcurrency: 8, plugins: [], mimeTypes: [], languages: ['zh-CN'],
};

const sandbox = {
  console,
  setTimeout, clearTimeout, setInterval, clearInterval,
  Reflect, Math, JSON, Date, Promise, Error, BigInt, Number, String, Array, Object, Symbol,
  TextDecoder: global.TextDecoder, TextEncoder: global.TextEncoder,
  Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array,
  Float32Array, Float64Array, ArrayBuffer, DataView, isNaN, parseInt, parseFloat,
  decodeURIComponent, encodeURIComponent, unescape, escape,
  performance: { now: () => Number(process.hrtime.bigint() / 1000n) / 1000 },
  crypto: require('crypto').webcrypto,
  atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  WebAssembly,
  __g: { warn: () => {}, ck: undefined },
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
sandbox.document = documentMock;
sandbox.navigator = navigatorMock;
sandbox.location = { href: 'https://www.zhihu.com/', protocol: 'https:', reload: noop };
sandbox.performance = sandbox.performance;

vm.createContext(sandbox);
try {
  vm.runInContext(glueSrc, sandbox, { timeout: 20000 });
  console.log('glue 加载完成; window.Go =', typeof sandbox.window.Go);
} catch (e) {
  console.log('glue 加载失败:', String(e).slice(0, 300));
  process.exit(1);
}

(async () => {
  try {
    const g = new sandbox.window.Go();
    console.log('Go 实例化; 方法:', Object.keys(g));
    const inst = await WebAssembly.instantiate(wasmBytes, g._);
    console.log('wasm 实例化 OK; 内存页', inst.instance.exports.memory.buffer.byteLength / 65536);
    await g.t(inst.instance);
    console.log('go.t() 返回; __g.ck =', String(sandbox.__g.ck).slice(0, 40));
  } catch (e) {
    console.log('驱动失败:', String(e).slice(0, 300));
  }
})();
