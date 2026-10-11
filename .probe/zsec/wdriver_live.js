// zse_ck 活驱动（Node 版）：实现 wasm_exec 宿主侧，探针真 eval，token 让 wasm 现算
// 用法: node .probe/zsec/wdriver_live.js
'use strict';
const fs = require('fs');
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const WASM_PATH = process.env.WASM || '.probe/build-859e.wasm';

// ---------- 宿主 JS 环境（探针就在这里求值）----------
const sandbox = createEnv();
delete sandbox.process; delete sandbox.global; delete sandbox.Buffer;
sandbox.globalThis = sandbox;
sandbox.require = undefined;
delete sandbox.require;
const envCtx = vm.createContext(sandbox, { name: 'host' });

// 真实页面里 window.Go 是 glue 定义的 Go 构造器 —— 宿主必须补上，
// 否则 wasm 第 3 步 `Reflect.get(window,"Go")` 得到 undefined，后续全部错位。
try {
  const glue = fs.readFileSync('.probe/zsec/blobs/eval_11841_service.js', 'utf8');
  vm.runInContext(glue, envCtx, { filename: 'glue', timeout: 10000 });
  console.log('glue 装载:', typeof vm.runInContext('window.Go', envCtx));
} catch (e) {
  console.log('glue 装载失败:', e.message);
}

function evalProbe(src) {
  try {
    return vm.runInContext('(function(){' + src + '\n})()', envCtx, { timeout: 2000 });
  } catch (e) {
    try { return vm.runInContext('(' + src + ')', envCtx, { timeout: 2000 }); }
    catch (e2) { return undefined; }
  }
}

// ---------- wasm_exec 值表 / NaN boxing ----------
const NAN_HEAD = 0x7FF80000n;
const T_OBJECT = 1n, T_STRING = 2n, T_SYMBOL = 3n, T_FUNCTION = 4n;
// glue 的 run() 里 this.i = [NaN, 0, null, true, false, window, this]
// ⇒ 值表 id 0..6 是**预注册**的固定值（这解释了 v7 = a2 + fsz 的进位技巧：解出 id 5 = window）
const values = [NaN, 0, null, true, false, sandbox.window, null];   // id 6 = Go 实例，暂用 null
let mem = null, dv = null;

// wasm 内存增长会换掉 ArrayBuffer（旧的被分离）——每次都从 mem.buffer 重新取 DataView
function refresh() { dv = new DataView(mem.buffer); }
const D = () => new DataView(mem.buffer);
// i64 形参在 JS 侧是 BigInt 且可能有符号；地址都是 u32，统一掩码转换
const A = (x) => (typeof x === 'bigint' ? Number(x & 0xFFFFFFFFn) : (x >>> 0));
function u32(a) { return D().getUint32(A(a), true); }
function i32(a) { return D().getInt32(A(a), true); }
function u64(a) { return D().getBigUint64(A(a), true); }
function setU32(a, v) { D().setUint32(A(a), v >>> 0, true); }
function setU64(a, v) { D().setBigUint64(A(a), BigInt(v)); }

function loadString(addr) {
  const p = u32(addr), n = u32(A(addr) + 4);
  if (!n) return '';
  return Buffer.from(new Uint8Array(mem.buffer, p, n)).toString('utf8');
}

function loadValue(addr) {
  const v = D().getFloat64(A(addr), true);
  if (v === 0) return undefined;
  if (!Number.isNaN(v)) return v;
  const id = Number(u64(addr) & 0xFFFFFFFFn);
  return values[id];
}

// refA/refB 这类 i64 形参本身就是 **NaN-boxed 的 js.Value**，不是地址
function decodeRef(x) {
  if (typeof x === 'bigint') {
    const head = x >> 32n;
    if (head >= 0x7FF80000n && head <= 0x7FF80003n) return values[Number(x & 0xFFFFFFFFn)];
    // 非 NaN-box：把它当 f64 位模式解释（与站点版 loadValue 一致）
    const dv = new DataView(new ArrayBuffer(8));
    dv.setBigUint64(0, x, true);
    return dv.getFloat64(0, true);
  }
  return x;
}

function storeValue(addr, v) {
  if (v === undefined || v === null) { setU64(addr, 0n); return; }
  if (typeof v === 'number') { D().setFloat64(A(addr), v, true); return; }
  if (typeof v === 'boolean') { D().setFloat64(A(addr), v ? 1 : 0, true); return; }
  let flag = T_OBJECT;
  if (typeof v === 'string') flag = T_STRING;
  else if (typeof v === 'function') flag = T_FUNCTION;
  else if (typeof v === 'symbol') flag = T_SYMBOL;
  const id = values.length;
  values.push(v);
  setU64(addr, NAN_HEAD | (flag << 32n) | BigInt(id));
}

// ---------- 日志 ----------
const log = [];
const T = (o) => { if (log.length < 5000) log.push(o); };

// ---------- 导入实现 ----------
function fd_write(fd, iovs, cnt, nwritten) {
  let total = 0, out = '';
  for (let k = 0; k < cnt; k++) {
    const base = iovs + k * 8;
    const p = u32(base), n = u32(base + 4);
    total += n;
    out += Buffer.from(new Uint8Array(mem.buffer, p, n)).toString('utf8');
  }
  setU32(nwritten, total);
  if (out.trim()) T({ ev: 'stdout', text: out.slice(0, 400) });
  return 0;
}

function ticks() { return Date.now(); }

function finalizeRef(ref, sp) { /* 释放：忽略 */ }

function copyBytesToGo(sp, fsz, refA, refB, dstPtr, dstLen, dstCap, p2, l2, c2, p3, l3, c3, sp2) {
  let src = null;
  try { src = Buffer.from(new Uint8Array(mem.buffer, dstPtr, dstLen)).toString('utf8'); } catch (e) {}
  const isProbe = dstLen >= 20 && dstLen !== 136041 && dstLen !== 41892 && dstLen !== 132;
  if (isProbe && src) {
    const res = evalProbe(src);
    storeValue(sp, res);
    T({ ev: 'probe', dstLen, src: src.slice(0, 70), res: typeof res === 'string' ? res.slice(0, 40) : typeof res });
    return;
  }
  // 非探针：把 refA 指向的 JS 值写出（token / 源码 / blob）
  if (dstLen === 132) { T({ ev: 'token-slot', note: '不植入，让 wasm 现算' }); return; }
  const v = loadValue(refA);
  if (typeof v === 'string') {
    const b = Buffer.from(v, 'utf8');
    new Uint8Array(mem.buffer, dstPtr, Math.min(b.length, dstLen)).set(b.subarray(0, dstLen));
    T({ ev: 'plant', dstLen, from: 'refA-string', len: b.length });
  } else {
    T({ ev: 'plant', dstLen, from: typeof v, skipped: true });
  }
}

function valueSetIndex(ref, sp, val, sp2) {
  const o = loadValue(ref), k = loadValue(val);
  if (o && typeof o === 'object') o[k] = loadValue(sp);
}

function valueNew(resultAddr, ctorRef, argvPtr, argc, argcPtr, x6) {
  const ctor = loadValue(ctorRef);
  const args = [];
  for (let i = 0; i < argc; i++) args.push(loadValue(A(argvPtr) + i * 8));
  try { storeValue(resultAddr, new ctor(...args)); } catch (e) { storeValue(resultAddr, undefined); }
}

function valueLength(ref, sp) {
  const v = loadValue(ref);
  if (typeof v === 'string') return v.length;
  if (v && typeof v.length === 'number') return v.length;
  return 0;
}

function valueIndex(ref, sp, sp2) {
  const o = loadValue(ref), k = loadValue(sp);
  const r = (o == null) ? undefined : o[k];
  storeValue(sp2, r);
  return 0n;
}

// ---------- 实例化并运行 ----------
(async () => {
  const bytes = fs.readFileSync(WASM_PATH);
  const imports = {
    wasi_snapshot_preview1: { fd_write },
    gojs: { 'runtime.ticks': ticks },
    env: {
      'runtime.ticks': ticks,
      'syscall/js.finalizeRef': finalizeRef,
      'syscall/js.copyBytesToGo': copyBytesToGo,
      'syscall/js.valueSetIndex': valueSetIndex,
      'syscall/js.valueNew': valueNew,
      'syscall/js.valueLength': valueLength,
      'syscall/js.valueIndex': valueIndex,
    },
  };
  // 每个导入包一层，出错时报出名字与实参（便于定位越界来源）
  for (const mod of Object.keys(imports)) {
    for (const fn of Object.keys(imports[mod])) {
      const orig = imports[mod][fn];
      imports[mod][fn] = function (...a) {
        try { return orig.apply(this, a); }
        catch (e) {
          console.log('IMPORT-ERR %s.%s args=%s : %s', mod, fn,
            JSON.stringify(a.map(x => typeof x === 'bigint' ? x.toString() : x)), e.message);
          throw e;
        }
      };
    }
  }
  let inst;
  try {
    ({ instance: inst } = await WebAssembly.instantiate(bytes, imports));
  } catch (e) {
    console.log('instantiate 失败:', e.message);
    process.exit(1);
  }
  mem = inst.exports.memory;
  refresh();
  const t0 = Date.now();
  try { inst.exports._start(); console.log('_start 完成 %dms', Date.now() - t0); }
  catch (e) { console.log('_start 抛错 %dms: %s', Date.now() - t0, e.message); }

  for (const x of log.filter(y => y.ev === 'stdout')) console.log('STDOUT:', x.text);
  const cbtg = log.filter(y => y.ev && String(y.ev).startsWith('cbtg'));
  console.log('copyBytesToGo 调用:', cbtg.length);
  for (const c of cbtg.slice(0, 20)) console.log('   ', JSON.stringify(c));
  const probes = log.filter(y => y.ev === 'probe');
  console.log('探针活算:', probes.length);
  console.log('plant 事件:', log.filter(y => y.ev === 'plant').length);

  const buf = Buffer.from(mem.buffer);
  const hits = [...new Set([...buf.toString('latin1').matchAll(/005_[A-Za-z0-9+/=]{128}/g)].map(m => m[0]))];
  console.log('payload candidates:', hits.length);
  hits.slice(0, 3).forEach(h => console.log('   ', h));
  fs.writeFileSync('.probe/zsec/wd_live_log.json', JSON.stringify({ probes, log }, null, 1), 'utf8');
})();
