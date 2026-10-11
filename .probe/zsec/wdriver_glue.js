// zse_ck 活驱动 v2：让 glue 驱动（用它自己的 loadValue/storeValue，不再自己重写）
// 架构：加载 glue(wasm_exec) → 建 __g → 用 glue 的 importObject 实例化 → go.run(instance)
//       __g.copyBytesToGo 按还原出的 7 分支实现，助手从参数里取（tools[1]=loadValue, tools[4]=storeValue）
'use strict';
const fs = require('fs');
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const WASM_PATH = process.env.WASM || '.probe/build-859e.wasm';
const GLUE = '.probe/zsec/blobs/eval_11841_service.js';

// ---------- 宿主 JS 环境 ----------
const sandbox = createEnv();
delete sandbox.process; delete sandbox.global; delete sandbox.Buffer;
sandbox.globalThis = sandbox;
const envCtx = vm.createContext(sandbox, { name: 'host' });

const log = [];
const T = (o) => { if (log.length < 8000) log.push(o); };

// ---------- 1) 加载 glue，拿到 window.Go ----------
vm.runInContext(fs.readFileSync(GLUE, 'utf8'), envCtx, { filename: 'glue', timeout: 15000 });
const GoCtor = vm.runInContext('window.Go', envCtx);
console.log('glue: window.Go =', typeof GoCtor);
if (typeof GoCtor !== 'function') { console.log('glue 未提供 Go'); process.exit(1); }

// ---------- 1b) 补 build 会定义的全局（真实页面里由 build JS 定义）----------
// wasm 会 `Reflect.get(window,"VM")` 再对它 `toString()` 做 native 检测
vm.runInContext(`
  function __mkNative(name){
    var f = function(){};
    try { Object.defineProperty(f, 'name', { value: name, configurable: true }); } catch(e){}
    try { Object.defineProperty(f, 'toString', { value: function(){ return 'function '+name+'() { [native code] }'; }, configurable: true }); } catch(e){}
    return f;
  }
  window.VM  = window.VM  || __mkNative('VM');
  window.BVM = window.BVM || __mkNative('BVM');
  window.CVM = window.CVM || __mkNative('CVM');
  window.sc  = window.sc  || __mkNative('sc');
`, envCtx);
console.log('补全局: VM/BVM/CVM/sc =', vm.runInContext('[typeof VM,typeof BVM,typeof CVM].join("/")', envCtx));

// ---------- 2) 建 __g（服务程序本来会写它；我们提供同等接口）----------
// 7 分支语义来自 js/service.decompiled.js（pc 170/211/275/369/460/514/554）
sandbox.__g = {
  ck: undefined,
  _encrypt: 1,
  z: function () { },                 // 服务程序会读 __g.z.toString() 找 'nsol'（反调试计分）
  copyBytesToGo: function (tools) {
    // tools = [arguments, loadValue, loadString2, memory.buffer, storeValue, decoder,
    //          loadSliceOfValues, encoder, loadSlice]
    const rawArgs = tools[0];
    const loadValue = tools[1];
    const loadString2 = tools[2];
    const memBuffer = tools[3];
    const storeValue = tools[4];
    const decoder = tools[5];
    const loadSliceOfValues = tools[6];
    const encoder = tools[7];
    const loadSlice = tools[8];
    const sp = rawArgs[0], fsz = rawArgs[1];
    const marker = String(fsz);
    const DV = () => new DataView(memBuffer);
    const v7 = loadValue(rawArgs[2] + BigInt(rawArgs[1]));   // ← 进位技巧，用 glue 的 loadValue
    const a = (i) => rawArgs[i];
    try {
      if (marker === '1022') {
        // Reflect.set(loadValue(v7), loadString2(a4,a5), loadValue(rawArgs[3]))
        T({ ev: '1022', v7: typeof v7, key: loadString2(a(4), a(5)), val: typeof loadValue(rawArgs[3]) });
        Reflect.set(v7, loadString2(a(4), a(5)), loadValue(rawArgs[3]));
      } else if (marker === '1024') {
        const s = decoder.decode(new DataView(memBuffer, a(4), a(5)));
        storeValue(sp, Reflect.get(v7, s));
        DV().setUint8(sp + 8, 1);
        T({ ev: '1024', s, v7: typeof v7 });
      } else if (marker === '1026') {
        const name = loadString2(a(4), a(5));
        const args = loadSliceOfValues(rawArgs[7], rawArgs[8], rawArgs[9]);
        storeValue(sp, Reflect.apply(Reflect.get(v7, name), v7, args));
        DV().setUint8(sp + 8, 1);
        T({ ev: '1026', name, v7: typeof v7 });
      } else if (marker === '1028') {
        const b = encoder.encode(String(v7));
        storeValue(sp, b);
        DV().setInt32(sp + 8, b.length, true);
        T({ ev: '1028', len: b.length });
      } else if (marker === '1030') {
        // loadSlice(a10,a11,a12).set(loadValue(v7))  —— 把 JS 值的字节写进 wasm 切片
        loadSlice(a(10), a(11), a(12)).set(loadValue(rawArgs[2] + BigInt(rawArgs[1])));
        T({ ev: '1030', len: Number(a(11)) });
      } else if (marker === '1032') {
        const len = Number(a(5)) >>> 0, ptr = Number(a(4)) >>> 0;
        let data = null, src = 'read-only';
        if (len === 136041) { data = fs.readFileSync('.probe/zsec/blobs/eval_136041.js'); src = 'challenge-js'; }
        else if (len === 41892) { data = fs.readFileSync('.probe/zsec/blobs/prog_41892.bin'); src = 'wasm-prog'; }
        else if (len === 132) { src = 'token(不供给)'; }
        if (data) new Uint8Array(memBuffer, ptr, Math.min(len, data.length)).set(data.subarray(0, len));
        storeValue(sp, loadString2(a(4), a(5)));
        DV().setUint8(sp + 8, 1);
        T({ ev: '1032', len, src });
      } else if (marker === '1034') {
        storeValue(sp, undefined);
      } else {
        T({ ev: 'unknown-marker', marker });
      }
    } catch (e) {
      T({ ev: 'cbtg-error', marker, msg: String(e.message).slice(0, 140) });
    }
  },
};

// ---------- 3) 用 glue 的 importObject 实例化，并让 glue 自己 run ----------
(async () => {
  const bytes = fs.readFileSync(WASM_PATH);
  const go = new GoCtor();
  // glue 的 importObject 挂在 go._ 上（go.u=boxValue, go.v=storeValue）
  const imports = go._ || go.importObject;
  console.log('importObject 模块:', Object.keys(imports || {}));
  const t0 = Date.now();
  try {
    const { instance } = await WebAssembly.instantiate(bytes, imports);
    vm.runInContext('globalThis.__inst = null', envCtx);
    sandbox.__inst = instance;
    console.log('实例化 OK %dms', Date.now() - t0);
    go.run(instance);                       // glue 自己驱动（值表/imports 全用它的实现）
    console.log('go.run 返回');
  } catch (e) {
    console.log('运行抛错 %dms: %s', Date.now() - t0, String(e.message).slice(0, 200));
  }
  const c = log.filter(y => y.ev === '1024' || y.ev === '1026' || y.ev === '1028' || y.ev === '1032');
  console.log('分支事件:', log.length);
  for (const x of c.slice(0, 25)) console.log('   ', JSON.stringify(x));
  for (const x of log.filter(y => y.ev === 'cbtg-error').slice(0, 10)) console.log('  ERR', JSON.stringify(x));
  // 从 wasm 内存里找 token
  try {
    const inst = vm.runInContext('globalThis.__inst', envCtx);
    const buf = Buffer.from(inst.exports.memory.buffer);
    const hits = [...new Set([...buf.toString('latin1').matchAll(/005_[A-Za-z0-9+/=]{128}/g)].map(m => m[0]))];
    console.log('payload candidates:', hits.length);
    hits.slice(0, 3).forEach(h => console.log('   ', h));
  } catch (e) { console.log('取内存失败:', e.message); }
})();
