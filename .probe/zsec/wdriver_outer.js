// 活驱动 v3：让 build 外层脚本驱动（它定义 __g / VM/BVM/CVM / glue，并自己实例化 wasm）
// 目的：让 JS 各层真正跑起来产出 __b.zh
'use strict';
const fs = require('fs');
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const sandbox = createEnv();
delete sandbox.process; delete sandbox.global; delete sandbox.Buffer;
sandbox.globalThis = sandbox;

const log = [];
const T = (o) => { if (log.length < 4000) log.push(o); };
sandbox.__LOG = T;

const ctx0 = vm.createContext(sandbox, { name: 'p' });
// V8 上下文全局显式挂到 window（glue 内部用 window.BigInt 等）
for (const k of ['BigInt', 'TextEncoder', 'TextDecoder', 'URL', 'URLSearchParams', 'ArrayBuffer',
                 'Uint8Array', 'Uint32Array', 'DataView', 'Promise', 'Symbol', 'Reflect', 'Proxy',
                 'Map', 'Set', 'WeakMap', 'JSON', 'Math', 'Number', 'String', 'Object', 'Array',
                 'Function', 'Error', 'TypeError', 'RangeError', 'RegExp', 'Boolean', 'Date', 'NaN',
                 'Infinity', 'parseInt', 'parseFloat', 'isNaN', 'encodeURIComponent', 'decodeURIComponent']) {
  if (sandbox[k] === undefined) sandbox[k] = vm.runInContext(k, ctx0);
}
// 保护 window 不被整体替换
const _realWin = sandbox.window;
Object.defineProperty(sandbox, 'window', {
  configurable: true,
  get() { return _realWin; },
  set(v) { T({ ev: 'clobber-window', keys: (v && typeof v === 'object') ? Object.getOwnPropertyNames(v).length : -1 }); },
});

const ctx = vm.createContext(sandbox, { name: 'host' });

// 监控 window.eval（wasm 会调它执行挑战源码）
vm.runInContext(`
  globalThis.__evals = [];
  var _oe = window.eval;
  window.eval = function(s){
    if (globalThis.__evals.length < 40) globalThis.__evals.push({ len: (s&&s.length)||0, head: String(s).slice(0,50) });
    return _oe.call(this, s);
  };
`, ctx);

const r = {};
const t0 = Date.now();
try {
  vm.runInContext(fs.readFileSync('.probe/build-859e.js', 'utf8'), ctx, { filename: 'outer', timeout: 120000 });
  r.outer = 'ok';
} catch (e) { r.outer = 'THROW ' + e.name + ': ' + String(e.message).slice(0, 160); }
console.log('outer:', r.outer, '| 耗时', Date.now() - t0, 'ms');

setTimeout(() => {
  console.log('window.eval 调用:', JSON.stringify(vm.runInContext('globalThis.__evals', ctx)).slice(0, 600));
  console.log('__g =', vm.runInContext('typeof window.__g', ctx),
              '| __b =', vm.runInContext('typeof window.__b', ctx),
              '| __c =', vm.runInContext('typeof window.__c', ctx));
  console.log('__b.zh =', vm.runInContext('window.__b && window.__b.zh ? String(window.__b.zh).slice(0,80) : null', ctx));
  console.log('__g.ck =', vm.runInContext('window.__g && window.__g.ck ? String(window.__g.ck).slice(0,60) : null', ctx));
  try {
    const inst = vm.runInContext('globalThis.__inst || (window._g && window._g.t) || null', ctx);
    if (inst && inst.exports && inst.exports.memory) {
      const buf = Buffer.from(inst.exports.memory.buffer);
      const hits = [...new Set([...buf.toString('latin1').matchAll(/005_[A-Za-z0-9+/=]{128}/g)].map(m => m[0]))];
      console.log('payload candidates:', hits.length);
      hits.slice(0, 3).forEach(h => console.log('   ', h));
    } else console.log('未拿到 wasm instance');
  } catch (e) { console.log('取内存失败:', e.message); }
  console.log('日志:', JSON.stringify(log.slice(0, 8)));
}, 4000);
