// 最小 Node 驱动：给 wasm 喂 mock imports，试跑 _start
const fs = require('fs');
const path = require('path');

const wasmPath = path.resolve('.probe/zsec/blobs/wasm_b64.bin');
const bytes = fs.readFileSync(wasmPath);

// ---- mock DOM / JS 环境 ----
const noop = () => 0;
const elStub = () => ({
  style: {}, id: '', innerHTML: '', width: 0, height: 0,
  offsetWidth: 100, offsetHeight: 20,
  getAttribute: () => null, setAttribute: noop, appendChild: noop, removeChild: noop,
  getContext: () => ({ getExtension: () => ({ UNMASKED_VENDOR_WEBGL: 1, UNMASKED_RENDERER_WEBGL: 2 }),
                       getParameter: () => 'x', fillRect: noop, fillText: noop, beginPath: noop,
                       arc: noop, closePath: noop, fill: noop }),
  toDataURL: () => 'data:image/png;base64,AAAA',
});
const documentMock = {
  createElement: elStub, getElementById: () => null,
  getElementsByTagName: () => [elStub()],
  querySelector: () => null, documentElement: elStub(), head: elStub(), body: elStub(),
  cookie: '', addEventListener: noop, readyState: 'complete',
};
const navigatorMock = { userAgent: 'Mozilla/5.0', hardwareConcurrency: 8, plugins: [], mimeTypes: [], languages: ['zh-CN'] };
const locationMock = { href: 'https://www.zhihu.com/', protocol: 'https:', reload: noop, replace: noop };

// 简单的 JS 值桥（wasm 侧 syscall/js 会传 ref 索引）
let refs = [undefined, null, true, false, globalThis];
function getRef(i) { return refs[i]; }

const imports = {
  wasi_snapshot_preview1: { fd_write: () => 0 },
  gojs: { 'runtime.ticks': () => BigInt(Date.now()) * 1000000n, },
  env: {
    'syscall/js.finalizeRef': () => {},
    'syscall/js.copyBytesToGo': () => {},
    'syscall/js.valueSetIndex': () => {},
    'syscall/js.valueNew': () => 0,
    'syscall/js.valueLength': () => 0,
    'syscall/js.valueIndex': () => 0,
  },
};

(async () => {
  try {
    const { instance } = await WebAssembly.instantiate(bytes, imports);
    console.log('instantiate OK; exports:', Object.keys(instance.exports));
    const mem = instance.exports.memory;
    console.log('memory pages:', mem.buffer.byteLength / 65536);
    try {
      const r = instance.exports._start();
      console.log('_start returned:', r);
    } catch (e) {
      console.log('_start threw:', String(e).slice(0, 200));
    }
    console.log('memory after:', mem.buffer.byteLength / 65536, 'pages');
  } catch (e) {
    console.log('instantiate failed:', String(e).slice(0, 400));
  }
})();
