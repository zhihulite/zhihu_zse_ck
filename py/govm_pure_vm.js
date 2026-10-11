// 真机驱动在 vm.createContext 的隔离上下文里跑载荷 ⇒ 载荷的 `new Function("typeof process...")`
//   看到 process 是 undefined。而本脚本跑在 Node 全局作用域，`process` 是全局 ⇒ 那个环境检测
//   会返回 'y'（真机 'n'），导致 Go 侧环境位图/常量表差一位。
//   做法：先把 process 绑成**模块级 const**（模块内所有 process.env 照常可用），
//   再在跑 Go 之前把**全局** process 删掉 ⇒ new Function 体里看不到它。
const process = globalThis.process;
const _REAL_PROCESS = globalThis.process;
// ============================================================================
// govm_pure_vm.js —— 用**反编译产物**跑 Go VM（完全不加载 .wasm）
//
//   node py/govm_pure_vm.js
//
// 组成：
//   ① 线性内存（5 页起、可 grow）+ 字节偏移索引的 M8/M16/M32/M64/F64
//   ② wasm 的 9 段 data 段灌入
//   ③ 反编译产物需要的全部 helper
//   ④ 8 个 import：其中 syscall/js 的宿主调用塞在 copyBytesToGo 的**操作码**里
//   ⑤ elem $e0 的 107 项 → callIndirect(idx, args)
//   ⑥ eval .probe/wt/zse.decompiled.js（192 个函数）→ 调 _start
//
// 前置：反编译产物由 `.probe/watdecomp.py` 生成，i64 常量已是 BigInt 字面量
//       （NaN-box 的 js.Value 超出 2^53，用 Number 会丢精度）。
// ============================================================================
'use strict';
const _log = console.log.bind(console);
// [bisect] 起点基准：此处应为 37（V8 原生）。若后面变成 29，说明有人换了 Function.prototype.toString。
try { _log('[bisect] 脚本起点 String(Function)=%j (%d)', String(Function), String(Function).length); } catch (e) {}
   // glue blob 可能替换 console，先留一份
const fs = require('fs');
const path = require('path');
const ROOT = process.env.ZSE_ROOT || path.resolve(__dirname, '..');
const P = (...a) => path.join(ROOT, ...a);
const NL = String.fromCharCode(10);

// env 读一次就够（`process.env` 是代理，热路径里每次访问都有开销）
const PROBE = process.env.PROBE === '1';
const WATCHMAX_N = Number(process.env.WATCHMAX || 10);
const WATCHMAX40 = Number(process.env.WATCHMAX || 40);
const WR_ENV = process.env.WATCHRANGE ? process.env.WATCHRANGE.split(',').map(Number) : null;
const HEXPROBE = process.env.WATCHHEX === '1';

// PROBE 探针会往 `.probe/{tmp,zsec}/` 追加落盘；先建好目录，
// 否则 appendFileSync 抛错会中断 VM（表现为总调用骤降、无 ck）。
if (PROBE) {
  for (const d of ['.probe/tmp', '.probe/zsec']) { try { fs.mkdirSync(d, { recursive: true }); } catch (e) {} }
  // 探针用 appendFileSync 落盘（崩了也不丢）；所以开跑前先清掉上一轮的产物，
  // 否则连跑几次会把轨迹叠成几十 MB（语义门的 mine_dop/mine_bind 也在其中）。
  for (const pat of ['.probe/tmp/mine_', '.probe/tmp/my', '.probe/zsec/_pv']) {
    const dir = path.dirname(pat), pre = path.basename(pat);
    try {
      for (const f of fs.readdirSync(dir)) {
        if (f.startsWith(pre)) { try { fs.unlinkSync(path.join(dir, f)); } catch (e) {} }
      }
    } catch (e) {}
  }
  // 探针每条事件都 appendFileSync ⇒ 几十万次系统调用（PROBE 跑 130 s，其中绝大部分在这里）。
  // 改成按文件攒够 4096 条再落一次，并在 exit / 未捕获异常时强制 flush。
  const _realAppend = fs.appendFileSync.bind(fs);
  const _bufs = new Map();
  const _flushAll = () => {
    for (const [f, a] of _bufs) {
      if (!a.length) continue;
      try { _realAppend(f, a.join('')); } catch (e) {}
      a.length = 0;
    }
  };
  fs.appendFileSync = (f, data, enc) => {
    const key = String(f);
    let a = _bufs.get(key);
    if (a === undefined) { a = []; _bufs.set(key, a); }
    a.push(typeof data === 'string' ? data : String(data));
    if (a.length >= 4096) { try { _realAppend(f, a.join('')); } catch (e) {} a.length = 0; }
  };
  process.on('exit', _flushAll);
  process.on('uncaughtException', (e) => { _flushAll(); throw e; });
}

// ---------------------------------------------------------------- ① 内存
const PAGE = 65536;
let mem = new ArrayBuffer(Number(process.env.INITPAGES || 5) * PAGE);
let M8, M16, M32, M64, F64, M8s, M16s, F32;

// 反编译产物里的下标是**字节偏移**，JS typed array 按元素下标 ⇒ 用 Proxy 换算。
// wasm 允许**非对齐**访问（如 `i64.store offset=4 align=4`）；typed array 只能对齐，
//   对齐时直接用 typed array（快），非对齐时退回 DataView（正确）。曾因 floor 到 8 字节
//   边界把一次 i64 写落到相邻对象的字段上，导致 strings.Builder 误报「按值复制」。
const DVK = {
  u8: ['getUint8', 'setUint8'], i8: ['getInt8', 'setInt8'],
  u16: ['getUint16', 'setUint16'], i16: ['getInt16', 'setInt16'],
  u32: ['getUint32', 'setUint32'], u64: ['getBigUint64', 'setBigUint64'],
  f32: ['getFloat32', 'setFloat32'], f64: ['getFloat64', 'setFloat64'],
};
// WATCHHEX=1：值触发式监视 —— 只要某次写入让 [addr-15, addr] 变成 16 个 ASCII 十六进制字符
//   （且下一字节不是十六进制字符，即正好是 16 长），就记下地址 + pc。
//   用途：抓「每 build 常量 IV」这类**不以字面量存在**的 16 字符十六进制串。
const _HEXPROBE = HEXPROBE;
let _hexView = null, _hexLen = -1, _hexSeen = 0;
const _isHexB = (c) => (c >= 0x30 && c <= 0x39) || (c >= 0x61 && c <= 0x66);
function _checkHex16(endAddr) {
  if (endAddr < 15) return;
  if (_hexView === null || _hexLen !== mem.byteLength) { _hexView = new Uint8Array(mem); _hexLen = mem.byteLength; }
  const u8 = _hexView;
  if (!_isHexB(u8[endAddr])) return;
  if (endAddr < 1 || !_isHexB(u8[endAddr - 1])) return;   // 至少两连，快速剪枝
  // 向前走找整段十六进制串（上限 96）
  let a = endAddr;
  while (a > 0 && _isHexB(u8[a - 1]) && endAddr - a < 96) a--;
  const n = endAddr - a + 1;
  if (n < 8) return;
  if (_hexSeen++ > 4000) return;
  let s = ''; for (let i = 0; i < n; i++) s += String.fromCharCode(u8[a + i]);
  try {
    fs.appendFileSync('.probe/tmp/mine_hex16.txt',
      'HEXRUN @' + a + ' len=' + n + ' =' + s + ' pc=' + (M32 ? M32[(VB + 20)] : -1) + NL);
  } catch (e) {}
}

function _byteView(TA, scale, coerce, out, kind) {
  const isIdx = (k) => (typeof k === 'string' && /^[0-9]+$/.test(k));
  const idx = (k) => isIdx(k) ? Math.floor(Number(k) / scale) : k;
  const off = (k) => isIdx(k) ? Number(k) : (typeof k === 'number' ? k * scale : NaN);
  const [g, s] = DVK[kind] || DVK['u' + (scale * 8)];
  const WA = Number(process.env.WATCH32 || -1);
  return new Proxy(TA, {
    set: (t, k, v) => {
      const ii = idx(k);
      if (typeof ii === 'string') return true;
      const o = off(k), vv = coerce ? coerce(v) : v;
      const _WR = WR_ENV;
      if (o % scale === 0) { t[ii] = vv; }
      else { try { _dv()[s](o, vv, true); } catch (e) {} }
      if (_HEXPROBE) _checkHex16(o + scale - 1);
      return true;
    },
    get: (t, k) => {
      const ii = idx(k);
      if (typeof ii === 'string') return undefined;
      const o = off(k);
      let v;
      if (o % scale === 0) v = t[ii];
      else { try { v = _dv()[g](o, true); } catch (e) { v = undefined; } }
      return (out && typeof v === 'bigint') ? out(v) : v;
    },
    has: (t, k) => idx(k) in t,
  });
}
const _toBig = (v) => typeof v === 'bigint' ? v : BigInt(Math.trunc(Number(v) || 0));
function _reviews() {
  M8  = _byteView(new Uint8Array(mem), 1, null, null, 'u8');
  M16 = _byteView(new Uint16Array(mem), 2, null, null, 'u16');
  M32 = _byteView(new Uint32Array(mem), 4, null, null, 'u32');
  M64 = _byteView(new BigUint64Array(mem), 8, _toBig, (v) => v, 'u64');
  F64 = _byteView(new Float64Array(mem), 8, null, null, 'f64');
  M8s = _byteView(new Int8Array(mem), 1, null, null, 'i8');      // i32.load8_s
  M16s = _byteView(new Int16Array(mem), 2, null, null, 'i16');   // i32.load16_s
  F32 = _byteView(new Float32Array(mem), 4, null, null, 'f32');  // f32
}
_reviews();

function memGrow(pages) {
  const nb = new ArrayBuffer(mem.byteLength + pages * PAGE);
  new Uint8Array(nb).set(new Uint8Array(mem));
  mem = nb; _reviews();
  return mem.byteLength / PAGE - pages;
}
const memSize = () => mem.byteLength / PAGE;
const memFill = (d, v, n) => {
  globalThis.__MF = (globalThis.__MF || 0) + 1;
  if (n > 200000 || d > mem.byteLength) {
    try { require('fs').appendFileSync('.probe/zsec/_pvhelper.txt',
      'BIG memFill d=' + d + ' n=' + n + ' mem=' + mem.byteLength + String.fromCharCode(10)); } catch (e) {}
  }
  if (globalThis.__MF % 200000 === 0) {
    try { require('fs').appendFileSync('.probe/zsec/_pvhelper.txt',
      'memFill #' + globalThis.__MF + ' d=' + d + ' n=' + n + String.fromCharCode(10)); } catch (e) {}
  }
  return new Uint8Array(mem).fill(v & 0xff, d, d + n);
};
const memCopy = (d, s, n) => {
  if (process.env.ZSE_WACOPY) {
    const _wa = Number(process.env.ZSE_WACOPY);
    if (d <= _wa && _wa < d + n) {
      try { require('fs').appendFileSync('.probe/tmp/mine_wacopy.txt',
        'WACOPY dst=' + d + ' src=' + s + ' n=' + n + ' pc=' + M32[(VB+20)] +
        ' srcBytes=' + JSON.stringify(String.fromCharCode.apply(null, Array.from(new Uint8Array(mem).subarray(s, s + Math.min(n, 24))))) +
        ' ctx=' + JSON.stringify(String.fromCharCode.apply(null, Array.from(new Uint8Array(mem).subarray(Math.max(0, s - 48), s + 16)))) +
        String.fromCharCode(10) + new Error().stack.split(String.fromCharCode(10)).slice(1, 8).join(String.fromCharCode(10)) + String.fromCharCode(10));
      try {
        if (process.env.ZSE_WADUMPSRC && s === Number(process.env.ZSE_WADUMPSRC)) {
          const _b0 = Math.max(0, s - 256);
          require('fs').writeFileSync('.probe/tmp/mine_wacopy_region.bin',
            Buffer.from(new Uint8Array(mem).subarray(_b0, s + 256)));
          require('fs').writeFileSync('.probe/tmp/mine_wacopy_region.txt',
            'base=' + _b0 + ' srcoff=' + (s - _b0) + String.fromCharCode(10) +
            Array.from(new Uint8Array(mem).subarray(_b0, s + 256)).map((x, i) => (i % 16 === 0 ? (String.fromCharCode(10) + (_b0 + i) + ': ') : '') + ('0' + x.toString(16)).slice(-2)).join(' '));
        }
      } catch (e2) {}
      } catch (e) {}
    }
  }
  if (n > 200000) { try { require('fs').appendFileSync('.probe/zsec/_pvhelper.txt',
    'BIG memCopy d=' + d + ' s=' + s + ' n=' + n + String.fromCharCode(10)); } catch (e) {} }
  return new Uint8Array(mem).copyWithin(d, s, s + n);
};

// ---------------------------------------------------------------- ② data 段
// 反编译产物/数据段：工作区里在 `.probe/`，交付包里在 `evidence/`。按序找第一个存在的。
const findData = (name, sub) => {
  const cands = [];
  for (const base of [P('evidence'), P('DELIVERY', 'evidence'), P('.probe', 'zsec'), P('.probe', 'wt'), P('.probe')]) {
    cands.push(sub ? path.join(base, sub, name) : path.join(base, name));
  }
  for (const f of cands) { try { if (fs.existsSync(f)) return f; } catch (e) {} }
  return cands[0];
};
{
  const segs = JSON.parse(fs.readFileSync(findData('_datasegs.json'), 'utf8'));
  for (const [off, hex] of segs) {
    const d = Buffer.from(hex, 'hex');
    const need = Math.ceil((off + d.length) / PAGE);
    if (need > memSize()) memGrow(need - memSize());
    new Uint8Array(mem).set(d, off);
  }
  _log('[mem] data 段 %d 段已灌入，内存 %d 页', segs.length, memSize());
}

// ---------------------------------------------------------------- ③ helper
// VM 结构体基址随 build 变（new.wasm=314296 / build-859e=314288；当前数据/产物=859e ⇒ 默认 314288）
const VB = Number(process.env.ZSE_VMBASE || 314288);
// 其余全局/静态地址相对 new.wasm 的整体位移（build-859e = -8）
const VD = VB - 314296;
globalThis.VB = VB; globalThis.VD = VD;   // 反编译产物是 indirect eval，必须挂到 globalThis 才可见

const wrap32   = (x) => Number(BigInt.asUintN(32, BigInt(x)));
// wasm 的 i64.extend_i32_u / _s：JS 里 i32 是有符号 Number，BigInt(x) 会**符号扩展**，
//   必须显式区分。曾因此把 FormatInt 的入参 -1928568859 当成有符号 ⇒ 产出 "-72f3a01b"，
//   而真机（i64.extend_i32_u）产出 "8d0c5fe5"，整条宿主调用链从第 26 条起全错。
const extU32   = (x) => typeof x === 'bigint' ? (x & 0xffffffffn) : BigInt(Number(x) >>> 0);
const extS32   = (x) => typeof x === 'bigint' ? BigInt.asIntN(32, x) : BigInt(Number(x) | 0);
const i8       = (x) => (Number(x) << 24) >> 24;
const i16      = (x) => (Number(x) << 16) >> 16;
const i32_64   = (x) => BigInt.asIntN(64, BigInt(Number(x) | 0));
const i8_64    = (x) => BigInt.asIntN(64, BigInt((Number(x) << 24) >> 24));
const i16_64   = (x) => BigInt.asIntN(64, BigInt((Number(x) << 16) >> 16));
const clz32    = (x) => Math.clz32(Number(x) >>> 0);
const ctz32    = (x) => { const v = Number(x) >>> 0; return v === 0 ? 32 : (31 - Math.clz32((v & -v) >>> 0)); };
const popcnt32 = (x) => { let c = 0, v = Number(x) >>> 0; while (v) { v &= v - 1; c++; } return c; };
const trunc32  = (x) => { const n = Number(x); return (n < 0 ? Math.ceil(n) : Math.floor(n)) | 0; };
const f32      = (x) => Math.fround(Number(x));
const f64      = (x) => Number(x);
// Go 的整数除法/取余（反编译产物用 idiv/irem 标记）
// 无符号 32 位比较（wasm 的 i32.lt_u 等）
const _u = (x) => Number(x) >>> 0;
const ult = (a, b) => _u(a) < _u(b);
const ugt = (a, b) => _u(a) > _u(b);
const ule = (a, b) => _u(a) <= _u(b);
const uge = (a, b) => _u(a) >= _u(b);
const idiv = (a, b) => Math.trunc(Number(a) / Number(b));
const irem = (a, b) => Number(a) % Number(b);
// 无符号 64 位比较/移位/除法：BigInt 的 `<`/`>`/`>>`/`/` 都是**有符号**语义，
//   直接拿 i64.lt_u/i64.shr_u 套用会判反（与 i64.extend_i32_u 是同一类错误）。
const _u64 = (x) => BigInt.asUintN(64, BigInt(x));
const ult64 = (a, b) => _u64(a) < _u64(b);
const ugt64 = (a, b) => _u64(a) > _u64(b);
const ule64 = (a, b) => _u64(a) <= _u64(b);
const uge64 = (a, b) => _u64(a) >= _u64(b);
const ushr64 = (a, b) => _u64(a) >> BigInt(b);
const udiv64 = (a, b) => _u64(a) / _u64(b);
const copysign = (a, b) => (Math.sign(Number(b)) || 1) * Math.abs(Number(a));
const i64_reinterpret_f64 = (x) => { const b = Buffer.alloc(8); b.writeDoubleLE(Number(x)); return b.readBigUInt64LE(); };
const f64_reinterpret_i64 = (x) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(x)); return b.readDoubleLE(); };

// ---------------------------------------------------------------- ④ imports
// H 通道：本 build 把 syscall/js 的宿主调用塞进 copyBytesToGo 的**操作码**里
// 语义实测自驱动 wdriver_glue_disp.js 433–620 行
const LOG = { fd_write: 0, js: 0, ops: {} };
const encoder = new TextEncoder(), decoder = new TextDecoder('utf-8');
const _dv = () => new DataView(mem);
const NANHEAD = 0x7FF80000;
// Go wasm_exec 的 valuePool 里 **0..5 是保留 id**：1=undefined 2=null 3=true 4=false 5=global。
//   动态值必须从 6 开始发号 —— 否则 storeValue 会把 id 5 发给别的对象，
//   于是 Go 侧「对 global 调 eval」被解码成一个函数（实测报 property eval is not a function）。
const _vals = [undefined, undefined, null, true, false, globalThis];
const _ids = new Map();
const _pool = [];

function storeValue(addr, v) {
  const dv = _dv();
  // 真机基准：undefined/null/true/false = `hi == NANHEAD` 且 `lo ∈ {1,2,3,4}`；
  //   `hi == NANHEAD|code` 才是**引用**（code 1=object 2=string 3=symbol 4=function，lo = 池 id）。
  //   旧实现把这四个写成 `hi = NANHEAD|k, lo = 0` ⇒ loadValue 当成「引用 + 池 id 0」= _vals[0] = undefined，
  //   于是 **null/true/false 全都读回成 undefined**（undefined 只是碰巧对）。
  //   实证：`document.all()` 返回 null，回读成 undefined ⇒ Go 多走一条 `String(undefined)` 分支，
  //   多拷 9 字节 "undefined"，宿主调用序列从此错位 +2（copyBytesToGo index 110）。
  if (v === undefined) { dv.setUint32(addr + 4, NANHEAD, true); dv.setUint32(addr, 1, true); return; }
  if (v === null)      { dv.setUint32(addr + 4, NANHEAD, true); dv.setUint32(addr, 2, true); return; }
  if (v === true)      { dv.setUint32(addr + 4, NANHEAD, true); dv.setUint32(addr, 3, true); return; }
  if (v === false)     { dv.setUint32(addr + 4, NANHEAD, true); dv.setUint32(addr, 4, true); return; }
  const t = typeof v;
  if (t === 'number') { dv.setFloat64(addr, v, true); return; }
  // 反推的编码：槽号 = hi&7 - 1，必须落在 0..3；global 的 box 是 0x7FF80001 ⇒ 槽 0 必须是
  // Object/Function 一类。于是：object→1(槽0)、string→2、symbol→3、function→4
  // `document.all` 有 IsHTMLDDA 语义：`typeof document.all === 'undefined'` 但它不是 undefined。
  //   真 undefined 已被上面拦掉，所以这里的 'undefined' 一律按 object 处理。
  const code = { object: 1, string: 2, symbol: 3, function: 4 }[t] || (t === 'undefined' ? 1 : 0);
  if (!code) throw new Error('storeValue: bad type ' + t);
  let id = _ids.get(v);
  if (id === undefined) { id = _pool.length ? _pool.pop() : _vals.length; _vals[id] = v; _ids.set(v, id); }
  dv.setUint32(addr + 4, NANHEAD | code, true);
  dv.setUint32(addr, id, true);
}
// 真机基准（驱动实测，见 .probe/tmp/box.log）：
//   hi = NANHEAD|1 → object 引用、|2 → string 引用、|4 → function 引用，lo = 池 id（5=global）；
//   hi = NANHEAD 且 lo∈{1,2,3,4} → undefined/null/true/false；其余 → float64。
//   旧实现把 hi=NANHEAD|1 当 undefined、|2 当 null ⇒ **字符串被解成 null**（eval(null) 的来源）。
function loadValue(addr) {
  const dv = _dv();
  const hi = dv.getUint32(addr + 4, true);
  if (hi === NANHEAD) {
    const lo = dv.getUint32(addr, true);
    if (lo === 1) return undefined;
    if (lo === 2) return null;
    if (lo === 3) return true;
    if (lo === 4) return false;
    return dv.getFloat64(addr, true);
  }
  if (hi > NANHEAD && hi <= (NANHEAD | 4)) return _vals[dv.getUint32(addr, true)];
  return dv.getFloat64(addr, true);
}
// NaN-box → 宿主值（Go wasm_exec 的 id 表：1=undefined 2=null 3=true 4=false 5=global）
const _boxVals = { 1: undefined, 2: null, 3: true, 4: false, 5: globalThis };
function boxDecode(bits) {
  // 已经是宿主值（字符串/对象/布尔…）就直通，便于安全地重复解码
  if (typeof bits !== 'bigint' && typeof bits !== 'number') return bits;
  const b = BigInt(bits);
  const hi = Number((b >> 32n) & 0xffffffffn);
  const lo = Number(b & 0xffffffffn);
  if (hi === NANHEAD) {
    if (lo === 1) return undefined;
    if (lo === 2) return null;
    if (lo === 3) return true;
    if (lo === 4) return false;
    return Number(b);
  }
  if (hi > NANHEAD && hi <= (NANHEAD | 4)) return _vals[lo];   // 引用（1=object 2=string 4=function）
  return Number(b);
}
const loadString = (addr, len) => decoder.decode(new Uint8Array(mem, addr, len));
const loadSlice = (addr, len) => new Uint8Array(mem, addr, len);
function loadSliceOfValues(addr, len) {
  const out = [];
  for (let i = 0; i < len; i++) out.push(loadValue(addr + i * 8));
  return out;
}

function __seq(s) {
  if (process.env.PROBE !== '1') return;
  try {
    let _fl = -1; try { _fl = String(Function).length; } catch (e) {}
    let _pc = -1; try { _pc = M32[(VB+20)]; } catch (e) {}
    require('fs').appendFileSync('.probe/tmp/mine_seq.txt', String(s) + '|F=' + _fl + '|pc=' + _pc + String.fromCharCode(10));
  } catch (e) {}
}
function syscall_js_copyBytesToGo(sp, op, ...r) {
  LOG.js++; LOG.ops[op] = (LOG.ops[op] || 0) + 1;
  const A = [sp, op, ...r];                     // A[i] == 驱动里的 rawArgs[i]
  const a = (i) => Number(A[i] || 0);
  {
    let _k = '';
    if (String(op) === '1024' || String(op) === '1026') {
      try {
        let _t = ''; const _p0 = a(4), _n0 = Math.min(a(5), 60);
        for (let _q = 0; _q < _n0; _q++) _t += String.fromCharCode(_dv().getUint8(_p0 + _q));
        _k = ':' + (String(op) === '1026' ? 'CALL:' : '') + _t;
      } catch (e) {}
    }
    __seq(String(op) + _k + '|' + [0,1,4,5,7,8,9,10,11,12].map(a).join(',') + '|nb=' + String(A[2]) + ',' + String(A[3]));
  }
  // NaN-box 地址必须用 **BigInt 精确**算：A[2] 是 i64 的 NaN-box（≈9.2e18），
  //   Number() 在 2^53 以上会把低位抹掉（实测 9221120241336056837 → …056800）。
  //   `A[2] + op` 的「进位技巧」重建出 NaN-box 值本身，再由 boxDecode 解码 —— 它**不是**内存地址，
  //   早期误用 loadValue(addr) 当地址读，于是 1030 报 Offset is outside the bounds of the DataView。
  const nbSum = () => BigInt(A[2] || 0) + BigInt(A[1] || 0);
  // 精度探针：A[2] 常是 NaN-box 的 i64（≈9.2e18），Number() 在 2^53 以上会丢低位。
  // 驱动用的是 BigInt 精确算法（rawArgs[2] + BigInt(rawArgs[1])）。
  if (process.env.ARGDBG === '1' && !globalThis.__ARGD) {
    globalThis.__ARGD = 1;
    _log('[args] op=%s A=%s  addr=%d  mem=%d', op,
      JSON.stringify(A.map(x => typeof x === 'bigint' ? x.toString() : x)), a(2) + a(1), mem.byteLength);
  }
  const v7 = boxDecode(nbSum());                // a2+op 还原出的是 NaN-box 值本身
  switch (String(op)) {
    case '1022': {
      const _k = loadString(a(4), a(5));
      const _v = boxDecode(BigInt(A[3] || 0));
      let _r = null; try { _r = Reflect.set(v7, _k, _v); } catch (e) { _r = 'ERR:' + e.message; }
      break;
    }
    case '1024': {
      const s = decoder.decode(new Uint8Array(mem, a(4), a(5)));
      if (v7 === null || (typeof v7 !== 'object' && typeof v7 !== 'function')) {
        try { const _b = nbSum(); __req('fs').appendFileSync('.probe/zsec/_pvmiss.txt',
          'MISS-GET prop=' + JSON.stringify(s) + ' bits=0x' + _b.toString(16) + ' lo=' + Number(_b & 0xffffffffn)
          + ' v7=' + typeof v7 + ' poolLen=' + _vals.length + ' slots=' + JSON.stringify(_vals.slice(0,24)) + NL); } catch (e) {}
      }
      let _g = Reflect.get(v7, s);
      if (s === 'Function' && PROBE) {
        try {
          const _F = _g;
          const _ts = _F && _F.prototype && _F.prototype.toString;
          __req('fs').appendFileSync('.probe/tmp/mine_fn.txt',
            'GET Function name=' + JSON.stringify(_F && _F.name) +
            ' String(F)=' + JSON.stringify(String(_F).slice(0, 50)) + '(' + String(_F).length + ')' +
            ' proto.toString.src=' + JSON.stringify(String(_ts).slice(0, 70)) + '(' + String(_ts).length + ')' +
            ' isRealFn=' + (_F === Function) + ' protoSame=' + (_F.prototype === Function.prototype) +
            ' isProxy=' + (function(){ try { return String(_F).indexOf('native code') >= 0 && !Object.prototype.hasOwnProperty.call(_F, 'prototype'); } catch(e){ return 'err'; } })() +
            ' F.ownTS=' + Object.prototype.hasOwnProperty.call(_F, 'toString') +
            ' call=' + JSON.stringify(String(Function.prototype.toString.call(_F)).slice(0, 40)) +
            ' viaFTS=' + JSON.stringify(String(_F.toString()).slice(0, 40)) +
            ' protoTSown=' + Object.prototype.hasOwnProperty.call(_F.prototype, 'toString') + NL);
        } catch (e) {}
      }
      if (s === 'zh' && PROBE) {
        try { __req('fs').appendFileSync('.probe/tmp/mine_zh.txt',
          'len=' + (typeof _g === 'string' ? _g.length : '?') + ' head=' +
          JSON.stringify(String(_g).slice(0, 160)) + NL); } catch (e) {}
      }
      // zh 兜底：真机里 `__b.zh` 是带 U+200C 分隔的调用栈串（真机捕获 3277 B）。
      // 纯 VM 里 JS 三层尚未把它建出来（实测 __b 已是 BVM 实例但无 zh 字段），
      // 这里用真机捕获值 —— 与交付包驱动 `ZHREAL=1` 的做法一致（受控对照，不是编造）。
      if (s === 'zh' && (typeof _g !== 'string' || _g.length === 0)) {
        const zf = [P('evidence', 'real_zh.bin'), P('DELIVERY', 'evidence', 'real_zh.bin'),
                    P('.probe', 'zsec', 'real_zh.bin')].find((x) => fs.existsSync(x));
        if (zf) {
          _g = fs.readFileSync(zf, 'utf8');
          try { __req('fs').appendFileSync('.probe/zsec/_pvzh.txt', 'ZH-REAL len=' + _g.length + NL); } catch (e) {}
        }
      }
      if (s === '__b' || s === '__g' || s === '__c' || s === 'zh' || s === 'ck') {
        try { var _k = []; try { _k = Object.keys(_g).slice(0,24); } catch(e2) {}
          __req('fs').appendFileSync('.probe/zsec/_pvbobj.txt', 'PROP ' + s + ' typeof=' + typeof _g
            + ' keys=' + JSON.stringify(_k) + ' zhLen=' + ((_g && typeof _g.zh === 'string') ? _g.zh.length : 'n/a')
            + ' ctor=' + (function(){ try { return (_g && _g.constructor && _g.constructor.name) || '?'; } catch(e3){ return 'err'; } })() + NL); } catch(e) {} }
      storeValue(sp, _g);
      _dv().setUint8(sp + 8, 1);
      break;
    }
    case '1026': {
      // 真机语义（见 wdriver_glue_disp.js 501-513）：取方法再以 v7 为 this 调用
      const name = loadString(a(4), a(5));
      const args = loadSliceOfValues(a(7), a(8), a(9));
      if (v7 === null || (typeof v7 !== 'object' && typeof v7 !== 'function')) {
        try { const _b = nbSum(); __req('fs').appendFileSync('.probe/zsec/_pvmiss.txt',
          'MISS-CALL name=' + JSON.stringify(name) + ' bits=0x' + _b.toString(16) + ' hi=0x' + Number((_b>>32n)&0xffffffffn).toString(16)
          + ' lo=' + Number(_b & 0xffffffffn) + ' v7=' + typeof v7 + ' poolLen=' + _vals.length + ' slots=' + JSON.stringify(_vals.slice(0,24)) + NL); } catch (e) {}
      }
      try { const _b = nbSum(); const _tag = (function(){ try { return Object.prototype.toString.call(v7); } catch(e){ return 'tag-err:'+e.message; } })();
        __req('fs').appendFileSync('.probe/zsec/_pvmiss.txt', 'CALL name=' + JSON.stringify(name) + ' v7type=' + typeof v7
          + ' tag=' + _tag + ' isNull=' + (v7 === null) + ' isUndef=' + (v7 === undefined) + ' isGlobal=' + (v7 === globalThis)
          + ' bits=0x' + _b.toString(16) + ' lo=' + Number(_b & 0xffffffffn) + ' poolLen=' + _vals.length + NL); } catch (e) {}
      if (name === 'eval') { try { const _a0 = args && args[0];
        if (typeof _a0 === 'string') { try { __req('fs').writeFileSync('.probe/tmp/eval_src_' + _a0.length + '.js', _a0); } catch (e4) {} }
        __req('fs').appendFileSync('.probe/zsec/_pveval.txt','EVAL nargs=' + (args?args.length:0) + ' type=' + typeof _a0
          + ' len=' + (typeof _a0 === 'string' ? _a0.length : -1) + ' head=' + JSON.stringify(typeof _a0 === 'string' ? _a0.slice(0,90) : String(_a0)) + NL); } catch(e) {} }
      const fn = Reflect.get(v7, name);
      if (typeof fn !== 'function') {
        try { const _b = nbSum(); __req('fs').appendFileSync('.probe/zsec/_pv1026.txt',
          'CALL name=' + JSON.stringify(name) + ' bits=0x' + _b.toString(16) +
          ' lo=' + Number(_b & 0xffffffffn) + ' v7type=' + typeof v7 +
          ' isGlobal=' + (v7 === globalThis) + NL); } catch (e) {}
        throw new Error('Value.Call: property ' + name + ' is not a function, got ' + typeof fn);
      }
      const _rr = Reflect.apply(fn, v7, args);
      storeValue(sp, _rr);
      _dv().setUint8(sp + 8, 1);
      break;
    }
    case '1028': {
      const b = encoder.encode(String(v7));
      storeValue(sp, b);
      _dv().setInt32(sp + 8, b.length, true);
      break;
    }
    case '1030': {
      const _v = boxDecode(nbSum());
      loadSlice(a(10), a(11)).set(_v);
      if (PROBE && a(11) === 3277) {
        try {
          const _sl = loadSlice(a(10), a(11));
          const _buf = Buffer.alloc(a(11));
          for (let _i = 0; _i < a(11); _i++) _buf[_i] = _sl[_i] & 255;
          __req('fs').writeFileSync('.probe/tmp/mine_zh_full.bin', _buf);
        } catch (e) {}
      }
      break;
    }
    case '1032': {
      storeValue(sp, loadString(a(4), a(5)));
      _dv().setUint8(sp + 8, 1);
      break;
    }
    case '1034': {
      const args = loadSliceOfValues(a(7), a(8), a(9));
      let _r, _e = null;
      try { _r = Reflect.apply(v7, undefined, args); } catch (er) { _e = String(er.message); }
      storeValue(sp, _r);
      _dv().setUint8(sp + 8, 1);
      break;
    }
    default: LOG.ops['?' + op] = (LOG.ops['?' + op] || 0) + 1;
  }
  return 0;
}
const syscall_js_finalizeRef = () => { __seq('finalizeRef'); };
// 真机形态：这三个 import 收到的是 **ref（NaN-box）**，必须先解码再用
const syscall_js_valueSetIndex = (ref, i, v) => { __seq('valueSetIndex'); boxDecode(ref)[i] = boxDecode(v); };
// 真机形态：`_syscall_js_Value__New` 调的是
//   `syscall_js_valueNew(dst, ctorRef, argsPtr, argsLen, argsCap, sp)`（6 参），
//   结果按 (值, 标志字节) 写回 dst —— 与 H 通道同款。旧实现写成 (o,args)，
//   于是把「目标指针」当构造函数 ⇒ `62136 is not a constructor`。
// 真机驱动在 vm.createContext 的隔离上下文里跑载荷 ⇒ 载荷 `new Function("return typeof process ... 'y':'n'")`
//   看到的 process/require/module/exports/__dirname/__filename 全是 undefined（浏览器语义）。
//   本脚本跑在 Node 全局作用域 ⇒ 这些名字存在 ⇒ 探针会返回 'y'（真机 'n'）。
//   修法（只针对探针源码，不动其它 new Function）：把它们做成**形参**，调用时不传 ⇒ typeof 为 'undefined'。
const _NODE_ONLY = ['process', 'require', 'module', 'exports', '__dirname', '__filename'];
const _isEnvProbe = (src) => typeof src === 'string' && src.length < 200 && src.indexOf('typeof ') >= 0 && src.indexOf("'y'") >= 0;
const syscall_js_valueNew = (dst, ctor, argsPtr, argsLen) => {
  __seq('valueNew');
  let _args = loadSliceOfValues(argsPtr, argsLen);
  try {
    if (boxDecode(ctor) === Function && _args.length === 1 && _isEnvProbe(_args[0])) {
      _args = _NODE_ONLY.concat([_args[0]]);   // new Function('process','require',...,src)
    }
  } catch (e) {}
  const r = Reflect.construct(boxDecode(ctor), _args);
  storeValue(dst, r);
  _dv().setUint8(dst + 8, 1);
};
const syscall_js_valueLength = (ref) => { __seq('valueLength'); return boxDecode(ref).length; };
// 把宿主值编成 ref（NaN-box 值本身）—— import 要**返回 ref**，Go 侧再喂给 makeValue
function makeRef(v) {
  if (v === undefined) return (BigInt(NANHEAD) << 32n) | 1n;
  if (v === null) return (BigInt(NANHEAD) << 32n) | 2n;
  if (v === true) return (BigInt(NANHEAD) << 32n) | 3n;
  if (v === false) return (BigInt(NANHEAD) << 32n) | 4n;
  if (typeof v === 'number') {
    const b = new ArrayBuffer(8); new Float64Array(b)[0] = v;
    return new BigUint64Array(b)[0];
  }
  const code = { object: 1, string: 2, symbol: 3, function: 4 }[typeof v] ||
               (typeof v === 'undefined' ? 1 : 0);   // IsHTMLDDA（document.all）
  if (!code) return (BigInt(NANHEAD) << 32n) | 5n;
  let id = _ids.get(v);
  if (id === undefined) { id = _pool.length ? _pool.pop() : _vals.length; _vals[id] = v; _ids.set(v, id); }
  return (BigInt(NANHEAD | code) << 32n) | BigInt(id);
}
const syscall_js_valueIndex = (ref, i) => { __seq('valueIndex'); return makeRef(boxDecode(ref)[i]); };
function runtime_fd_write(fd, iovs, cnt) {
  LOG.fd_write++;
  try {
    const dv = _dv();
    let out = '';
    for (let i = 0; i < cnt; i++) {
      const p = dv.getUint32(iovs + i * 8, true);
      const n = dv.getUint32(iovs + i * 8 + 4, true);
      out += decoder.decode(new Uint8Array(mem, p, n));
    }
    if (out) process.stdout.write(out);
  } catch (e) { }
  return 0;
}
const runtime_ticks = () => { __seq('runtime.ticks'); return Date.now() * 1e6; };

// ---------------------------------------------------------------- ⑤ 函数表
globalThis.__CNT = {};
globalThis.__LIMIT = Number(process.env.LIMIT || 5000000);
function __tick(n) {
  globalThis.__LASTFN = n;
  { const _r = (globalThis.__FNR = globalThis.__FNR || []); let _pc=-1; try{_pc=M32[VB+20];}catch(e){} _r.push(n + ' @pc' + _pc); if (_r.length > 400) _r.shift(); }
  if (/panic/i.test(n) && !globalThis.__PANICD) {
    globalThis.__PANICD = 1;
    try {
      const _nl = String.fromCharCode(10);
      __req('fs').appendFileSync('.probe/tmp/mine_panic.txt',
        'PANIC fn=' + n + ' TOT=' + (globalThis.__TOT || 0) + ' sp=' + globalThis.sp + _nl +
        'callIndirect 尾部:' + _nl + '  ' + (globalThis.__RB || []).slice(-40).join(_nl + '  ') + _nl);
    } catch (e) {}
  }
  globalThis.__CNT[n] = (globalThis.__CNT[n] || 0) + 1;
  globalThis.__TOT = (globalThis.__TOT || 0) + 1;
  if (globalThis.__TOT > globalThis.__LIMIT) {
    _log('[watchdog] 超限，热点:', JSON.stringify(
      Object.entries(globalThis.__CNT).sort((a, b) => b[1] - a[1]).slice(0, 12)));
    throw new Error('watchdog');
  }
}
const TABLE = JSON.parse(fs.readFileSync(findData('_table.json'), 'utf8'));
let FN = {};
function callIndirect(idx, args) {
  const name = TABLE[String(idx)];
  try { (globalThis.__RB = globalThis.__RB || []).push(idx + ':' + name); if (globalThis.__RB.length > 60) globalThis.__RB.shift(); } catch (e) {}
  const f = FN[name];
  if (!f) throw new Error('callIndirect: 表[' + idx + '] = ' + name + ' 未定义');
  return f.apply(null, args || []);
}

// ---------------------------------------------------------------- ⑥ 全局 + 加载
// 诊断：js 类型表（Go syscall/js.Type）在 (312876+VD)/(312880+VD) 起，静态段里是 [5,7]
if (process.env.TYPEFIX !== '0') {
  const u32 = new Uint32Array(mem);
  _log('[dbg] 改前 M32[(312876+VD)]=%d M32[(312880+VD)]=%d', u32[(312876+VD) >> 2], u32[(312880+VD) >> 2]);
  // 该 build 只用了 4 个类型槽（表在 (312876+VD)..(312888+VD)）；槽值取 Go syscall/js.Type
  //   6=Function 7=Object 4=String 5=Symbol —— 让任一槽都满足 `(type & 6) === 6`
  // 槽号 = ((hi>>32) & 7) - 1（见 `_syscall_js_Value__Type`：hi=NANHEAD|code ⇒ 槽=code-1）。
  //   表值必须是 Go 的 syscall/js.Type：Object=6, String=4, Symbol=5, Function=7。
  //   旧值 [7,4,5,6] 把 slot0(Object) 与 slot3(Function) 写反 ⇒ 对象被判成 Function，
  //   于是 `Value.String` 走 default 分支返回字面量 "<function>"（实测 SPLIT2 收到的就是它）。
  const slots = [6, 4, 5, 7];      // 槽0=Object 槽1=String 槽2=Symbol 槽3=Function
  for (let i = 0; i < 4; i++) u32[((312876+VD) >> 2) + i] = slots[i];
}
if (process.env.FLAG314296 === '1') { new Uint8Array(mem)[VB] = 1; _log('[dbg] M8[VB] 强制置 1'); }
// JS 侧环境：真机由 build 的 JS 层建立（BVM/CVM 类、__b.zh 等）。
// 纯 VM 走 eval 执行还原出的 JS 层时同样需要 document/navigator/location… —— 直接复用交付包的手写环境。
// H 通道是 `Reflect.get(globalThis, prop)`，所以必须装到 globalThis 上（保留 getter 语义）。
{
  const cands = [P('code', 'env', 'handenv.js'), P('DELIVERY', 'code', 'env', 'handenv.js'),
                 P('.probe', 'oracle', 'handenv.js'), P('.probe', 'zsec', 'handenv.js')];
  const f = cands.find((x) => fs.existsSync(x));
  if (f) {
    try {
      const { createEnv } = require(f);
      const env = createEnv();
      const desc = Object.getOwnPropertyDescriptors(env);
      // window/self/globalThis 指向真正的 globalThis；console 必须保留 Node 的
      //（handenv 里 console 是**空实现**，装了会把本脚本自己的日志全吞掉）
      delete desc.globalThis; delete desc.self; delete desc.window; delete desc.console;
      Object.defineProperties(globalThis, desc);
      if (!('window' in globalThis)) globalThis.window = globalThis;
      if (!('self' in globalThis)) globalThis.self = globalThis;
      _log('[env] handenv 已装载 %s（%d 个键）', f.replace(ROOT + '\\', ''), Object.keys(desc).length);
      // native addon 的原生 toString 必须在**当前上下文**里装：
      //   handenv 只把 addon 挂到 g.__zseenv，装不装由调用方决定。
      //   不装的话 `Function.toString()` 返回匿名形态 `"function () { [native code] }"`（29 字符），
      //   真机是 `"function Function() { [native code] }"`（37 字符）—— 实测宿主调用序列 index 134 因此不符。
      try {
        const _F = globalThis.Function;
        _log('[env] Function 自检: name=%j ownToString=%s String(Function)=%j',
          _F && _F.name, Object.prototype.hasOwnProperty.call(_F, 'toString'), String(_F));
        // 安装推迟到 glue blob 之后（站点 JS 会替换 Function.prototype.toString）
      } catch (eNT) { _log('[env] installNativeToString 失败: %s', eNT && eNT.message); }
    } catch (e) { _log('[env] handenv 装载失败: %s', e && e.message); }
  } else {
    _log('[env] 未找到 handenv.js，仅用最小桩');
  }
}
// window.Go：真机由站点自己的 glue blob 定义（驱动即加载 evidence/blobs/eval_11841_service.js）。
// 不补它的话，Go 侧 `Reflect.get(globalThis,"Go")` 拿到 undefined，随后的 ref 就变成不存在的 id
// （实测真机此处是 `GET Go`(id5=global) → `GET toString`(hi=0x7ff80004 lo=0xc, function)）。
if (!globalThis.Go) {
  const gf = [P('evidence', 'blobs', 'eval_11841_service.js'),
              P('DELIVERY', 'evidence', 'blobs', 'eval_11841_service.js')].find((x) => fs.existsSync(x));
  if (gf) {
    try { (0, eval)(fs.readFileSync(gf, 'utf8')); _log('[env] glue blob 已加载 → Go=%s', typeof globalThis.Go); }
    catch (e) { _log('[env] glue blob 加载失败: %s', e && e.message); }
  } else _log('[env] 未找到 glue blob，Go 仍缺失');
  try { _log('[bisect] glue 后 String(Function)=%j (%d)', String(Function), String(Function).length); } catch (e) {}
  // 站点 JS（glue blob / 反篡改探针）会**替换 Function.prototype.toString**，
  //   把原生形态换成匿名形态 `"function () { [native code] }"`（29 字符，真机 37）。
  //   所以 native 安装必须放在它之后**再补一次**。
  try {
    if (process.env.ZSE_NOTOSTS === '1') {
      _log('[env] ZSE_NOTOSTS=1：跳过 addon 的 installNativeToString');
    } else if (globalThis.__zseenv && globalThis.__zseenv.installNativeToString) {
      globalThis.__zseenv.installNativeToString(Function.prototype);
      _log('[env] glue 后补装 installNativeToString → String(Function)=%j', String(globalThis.Function));
    }
  } catch (eNT2) { _log('[env] glue 后补装失败: %s', eNT2 && eNT2.message); }
}
// 兜底（与 handenv 的 ZSE_ROGLOBAL 重复，见 PITFALLS.md H41）：
//   站点反篡改探针会执行 `new Function("window={};document={};return document")` ——
//   真浏览器里 window/document/navigator/location 是**不可写**的全局属性，赋值静默失败、真对象还在；
//   若这里做成可写属性，探针会把它们清成 `{}`，之后整层 JS 立刻崩。
//   实测：探针体 "window={};document={};return document" 与
//   "try{window={};document={};return document.all()}catch(_){}" 都在构造列表里。
for (const k of ['window', 'document', 'navigator', 'location', 'self', 'top', 'parent', 'frames', 'history', 'screen']) {
  try {
    if (k in globalThis) Object.defineProperty(globalThis, k,
      { value: globalThis[k], writable: false, configurable: false, enumerable: true });
  } catch (e) {}
}

// Function 构造探针：CVM 层走的是 `new Function(SRC0)`（不是 window.eval），
// 必须单独观测，否则看不到内层源码是否被编译执行。
{
  const RealFn = globalThis.Function;
  // Proxy 会让 `Function.prototype.toString.call(Function)` 返回**匿名形态**
  //   `"function () { [native code] }"`（29 字符），真机是 `"function Function() { [native code] }"`（37）。
  //   实测这就是宿主调用序列 index 134 的唯一分歧来源 —— 属于**我自己的诊断包装泄漏**，
  //   不是环境差异。用 get 陷阱把 toString 透传回真 Function 即可。
  const _fnTS = function () { return Function.prototype.toString.call(RealFn); };
  try { Object.defineProperty(_fnTS, 'name', { value: 'toString', configurable: true }); } catch (e) {}
  const Wrap = new Proxy(RealFn, {
    get(t, prop, recv) {
      if (prop === 'toString') return _fnTS;
      return Reflect.get(t, prop, recv);
    },
    construct(t, args, nt) {
      return Reflect.construct(t, args, nt);
    },
    apply(t, thisArg, args) {
      return Reflect.apply(t, thisArg, args);
    },
  });
  Object.defineProperty(globalThis, 'Function', { value: Wrap, configurable: true, writable: true });
}
// 兜底：__b/__g/__c 若环境里没有，先留空对象（真机由 eval 出的 JS 层覆盖）
// 真机里 `var __g = new VM()` ⇒ `__g.ck` 是 **undefined**，不是空字符串。
//   预置 `ck: ''` 会让 Go 侧「ck 是否已是字符串」的判据得 true，从而多走一次「写假 ck」分支
//   （实测：真机该处压 bool false、我这边压 true）。
if (process.env.ZSE_NOPRESET === '1') {
  if (!globalThis.__b) globalThis.__b = {};
  if (!globalThis.__g) globalThis.__g = globalThis.__b;
  if (!globalThis.__c) globalThis.__c = globalThis.__b;
} else {
  if (!globalThis.__b) globalThis.__b = { zh: '', ck: '', z: '' };
  if (!globalThis.__g) globalThis.__g = globalThis.__b;
  if (!globalThis.__c) globalThis.__c = globalThis.__b;
}
if (!globalThis.window) globalThis.window = globalThis;

// 补 build 会定义的全局（真实页面里由 build JS 定义；wasm 会 Reflect.get(window,"VM")
// 再对 toString() 做 native 检测）。与交付包驱动 wdriver_glue_disp.js 1b 节同款。
{
  const mk = (name) => {
    const f = function () {};
    try { Object.defineProperty(f, 'name', { value: name, configurable: true }); } catch (e) {}
    try { Object.defineProperty(f, 'toString',
      { value: function () { return 'function ' + name + '() { [native code] }'; }, configurable: true }); } catch (e) {}
    return f;
  };
  // VM/BVM/CVM 必须是**真函数对象**，源码文本 = 原始 JS 里的那份
  //   （干净 oracle 实测 String(VM)/String(BVM)/String(CVM) = 44271/44577/44326）。
  //   用 `new Function('return (src)')()` 建：源码文本逐字保留，且 .toString 仍是
  //   继承来的原生 Function.prototype.toString（实测 37 字符）。
  //   早前用「桩函数 + 自定义 toString」会把 String(VM) 变成桩源码(31)、
  //   把 String(VM.toString) 变成自定义函数源码(67)，两项都与真机不符。
  const loadSrc = (n) => {
    const cands = [];
    for (const d of [P('evidence'), P('DELIVERY', 'evidence'), P('.probe', 'zsec')]) {
      cands.push(path.join(d, 'real_' + n + '_src.bin'));
      cands.push(path.join(d, 'src_' + n + '.js'));
    }
    for (const f of cands) {
      try { if (fs.existsSync(f)) return fs.readFileSync(f, 'latin1'); } catch (e) {}
    }
    return null;
  };
  let realN = 0;
  for (const k of ['VM', 'BVM', 'CVM']) {
    if (globalThis[k]) continue;
    const src = loadSrc(k);
    if (src) {
      try { globalThis[k] = new Function('return (' + src + ');')(); realN++; continue; } catch (e) {
        _log('[env] %s 真源码建函数失败: %s', k, e.message);
      }
    }
    globalThis[k] = mk(k);
  }
  _log('[env] VM/BVM/CVM 真函数对象 %d/3', realN);
  // STACKREAL：把 Error().stack 合成成真机形态。
  //   真机 zh 里那段栈就是 Error().stack（base64 段解出 20 帧 / 4 个 eval 帧 / wasm 帧 / 真实 URL）。
  //   不合成的话，**我自己的实现帧会混进去**（栈里出现本仓库的绝对路径），zh 长度从真机 1197 涨到 1445。
  //   这是纯实现泄漏，不是 Go VM 的行为差异 —— 与交付驱动 wdriver_glue_disp.js 的 STACKREAL 同款。
  {
    const sdirs = [P('evidence'), P('DELIVERY', 'evidence'), P('.probe', 'zsec')];
    let rstack = null;
    for (const d of sdirs) {
      const f = path.join(d, 'real_stack.txt');
      try { if (fs.existsSync(f)) { rstack = fs.readFileSync(f, 'utf8'); break; } } catch (e) {}
    }
    if (rstack && process.env.ZSE_NOSTACK !== '1') {
      // 用「忽略写入的 setter」装：站点 JS 会覆盖 Error.prepareStackTrace 成它自己那套
      //   `fn@file:line:col` 格式（实测 zh 第 3 段解码出 `CVM/this.z@build.js line 1 > eval...`），
      //   而真机是浏览器原生 Chrome 形态（Error + 换行 + "    at CVM.H.z (eval at ...)"）。
      //   set 里静默忽略覆盖，真机形态才保得住。
      let _st = function () { return rstack; };
      Object.defineProperty(Error, 'prepareStackTrace', {
        get() { return _st; },
        set(_v) { /* 忽略站点覆盖 */ },
        configurable: true,
      });
      let got = ''; try { got = String(new Error().stack); } catch (e) {}
      _log('[env] STACKREAL: Error().stack 合成 %d 字符', got.length);
    } else {
      _log('[env] STACKREAL: 未找到 real_stack.txt');
    }
  }
  if (!globalThis.sc) globalThis.sc = mk('sc');
}
// sp 用带 setter 的属性，便于在 PROBE 下抓「谁把栈指针写坏」
{
  let _sp = 65536;
  Object.defineProperty(globalThis, 'sp', {
    configurable: true,
    get() { return _sp; },
    set(v) {
      _sp = v;
    },
  });
}
for (const [k, g] of Object.entries({ M8: () => M8, M16: () => M16, M32: () => M32,
                                      M64: () => M64, F64: () => F64,
                                      M8s: () => M8s, M16s: () => M16s, F32: () => F32 })) {
  Object.defineProperty(globalThis, k, { get: g, configurable: true });
}
Object.assign(globalThis, {
  memGrow, memSize, memFill, memCopy, callIndirect, __tick,
  wrap32, extU32, extS32, i8, i16, i32_64, i8_64, i16_64, clz32, ctz32, popcnt32, trunc32, f32, f64, copysign, idiv, irem,
  ult64, ugt64, ule64, uge64, ushr64, udiv64, ult, ugt, ule, uge,
  i64_reinterpret_f64, f64_reinterpret_i64,
  storeValue, loadValue, loadString, loadSlice, loadSliceOfValues,
  syscall_js_finalizeRef, syscall_js_copyBytesToGo, syscall_js_valueSetIndex,
  syscall_js_valueNew, syscall_js_valueLength, syscall_js_valueIndex,
  runtime_fd_write, runtime_ticks, Reflect, __req: require,
});

{
  let src = fs.readFileSync(findData('zse.decompiled.js'), 'utf8');
  _log('[dbg] src 读入 %d 字节', src.length);
  // 反编译产物用 wasm 局部名（lN）却不声明 ⇒ 逐函数补 `let lN = 0;`
  src = src.split(NL + 'function ').map((chunk, i) => {
    let body = i === 0 ? chunk : 'function ' + chunk;
    const names = new Set();
    const re = /\bl(\d+)\b/g; let m;
    while ((m = re.exec(body))) names.add('l' + m[1]);
    // 必须带 `let`：反编译产物里的 lN 是 wasm **局部**；不带关键字会退化成全局，
      //   被嵌套调用覆盖 ⇒ sp 被写坏。
    const decl = names.size ? ('let ' + [...names].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
                           .map(n => n + ' = 0').join(', ') + ';') : '';
    const nm = (body.match(/^function ([\w$]+)\(/) || [, '?'])[1];
    if (PROBE) {
      // OOo0o0 末尾的 type assert 判据（p4 应为字符串 tag 71680）
      const _o = '      if ((p4 !== 71680)) {';
      const _n = '      try{const _g=(globalThis.__TAG=globalThis.__TAG||[]);_g.push("p4="+p4+" p2="+p2+" l6="+l6+" p1="+p1);if(_g.length>40)_g.shift();}catch(e){}' + NL + _o;
      if (src.indexOf(_o) >= 0) { src = src.split(_o).join(_n); _log('[TAG] 判据探针已插'); } else _log('[TAG] 判据文本未命中');
    }
    let extra = '';
    if (PROBE && process.env.ZSE_OLDFN && nm === process.env.ZSE_OLDFN) {
      try {
        const _old = fs.readFileSync('.probe/wt/zse.decompiled.js.bak', 'utf8');
        const _key = 'function ' + nm + '(';
        const _st = _old.indexOf(_key);
        let _d = 0, _en = -1;
        if (_st >= 0) {
          for (let _q = _old.indexOf('{', _st); _q < _old.length; _q++) {
            if (_old[_q] === '{') _d++;
            else if (_old[_q] === '}') { _d--; if (_d === 0) { _en = _q; break; } }
          }
        }
        if (_st >= 0 && _en > _st) { body = _old.slice(_st, _en + 1); _log('[OLDFN] %s 已换回旧体 %d 字节', nm, body.length); }
        else _log('[OLDFN] %s 未找到', nm);
      } catch (e) { _log('[OLDFN] 失败: %s', e.message); }
    }
    if (PROBE && nm === '_syscall_js_Value__Type' && process.env.ZSE_TYPEFIX2 === '1') {
      const _a = 'return _br1;';
      const _b = 'return (_br1 || M32[(312876+VD)]);';
      if (body.indexOf(_a) >= 0) { body = body.split(_a).join(_b); _log('[TF2] Value__Type 已改回旧行为'); }
    }
    if (PROBE &&
        /^__main__0oOoOO___(00oooO|OOo0o0|O0O00o|0OO0Oo|O0o0Oo)$/.test(nm)) {
      // 5 个语义派发器**公共尾部取指**探针：(派发器名, 取指 pc, idx=prog[pc])
      //   这是「取指层」的 ground truth，用来验收 out/isa.json。
      const _tag = nm.replace('__main__0oOoOO___', '');
      if (body.split('callIndirect(p0, [p1]);').length === 2) {
        body = body.split('callIndirect(p0, [p1]);').join(
          'try{ globalThis.__FSEQ=(globalThis.__FSEQ||0)+1; __req("fs").appendFileSync(".probe/tmp/mine_tail5.txt", "seq="+globalThis.__FSEQ+" "+' +
          JSON.stringify(_tag) + '+" pc="+M32[VB+20]+" idx="+M32[M32[VB+308]+(M32[VB+20]<<2)]+" f1="+p0+" f0="+p1+String.fromCharCode(10)); }catch(e){}' + NL +
          'callIndirect(p0, [p1]);');
        _log('[TAIL5] %s 尾部取指探针已加', _tag);
      } else _log('[TAIL5] %s callIndirect 命中数不是 1，跳过', _tag);
    }
    if (PROBE &&
        /^__main__0oOoOO___(00oooO|OOo0o0|O0O00o|0OO0Oo)$/.test(nm)) {
      // 4 个语义派发器的**入口 op**：真机轨迹里 `p1` 就是该派发器的 switch key。
      //   这是「elem → 派发器 op」二级映射的 ground truth。
      extra += NL + 'try{ globalThis.__DSEQ=(globalThis.__DSEQ||0)+1;' +
        ' __req("fs").appendFileSync(".probe/tmp/mine_dop.txt", "seq="+globalThis.__DSEQ+" "+' +
        JSON.stringify(nm.replace('__main__0oOoOO___', '')) +
        '+" pc="+(M32[VB+20]-3)+" op="+p1+String.fromCharCode(10)); }catch(e){}';
    }
    if (PROBE && nm === '__main__0oOoOO___00oooO') {
      extra += NL + 'try{ globalThis.__SEQ=(globalThis.__SEQ||0)+1; const _pc3=(M32[(VB+20)]-3); let _stk=\"\"; try{ const _SP=VB+28; for(let _k=0;_k<6;_k++){ const _v=M32[_SP+4+(_k<<3)]; let _t2=\"\"; try{ const _dp=M32[_v], _ln=M32[_v+4]; if(_ln>=0&&_ln<300){ for(let _i=0;_i<_ln;_i++)_t2+=String.fromCharCode(M8[_dp+_i]&255); } else _t2=\"len=\"+_ln; }catch(e){_t2=\"ERR\";} _stk+=\" [\"+_k+\"]t\"+M32[_SP+(_k<<3)]+\"/v\"+_v+\"=\"+JSON.stringify(_t2.slice(0,60)); } }catch(e){} __req(\"fs\").appendFileSync(\".probe/tmp/mine_int.txt\",\"seq=\"+globalThis.__SEQ+\" pc=\"+_pc3+\" packed=\"+p1+\" sp=\"+sp+\" PUSHtype=\"+M32[VB+276]+\" val=\"+M32[VB+280]+\" sp=\"+M32[VB+300]+\" stk\"+_stk+\" op=\"+M32[M32[VB+308]+(_pc3<<2)]+\" flg=\"+M8[VB+24]+\" s31=t\"+M32[(VB+276)]+\"/v\"+M32[(VB+280)]+String.fromCharCode(10)); }catch(e){}';
    }
    if (PROBE && nm === '_start_command_export') {
      // 外层驱动 = `_start_command_export` 的绑定循环：`callIndirect(l0, [l2])`。
        //   只探 4 个派发器 + $bound 尾取指会漏掉这条 ⇒ 轨迹不完整。
      if (body.split('callIndirect(l0, [l2]);').length === 2) {
        body = body.split('callIndirect(l0, [l2]);').join(
          'try{ globalThis.__FSEQ=(globalThis.__FSEQ||0)+1; __req("fs").appendFileSync(".probe/tmp/mine_bind.txt", "seq="+globalThis.__FSEQ+" BIND pc="+M32[VB+20]+" elem="+l0+" arg="+l2+String.fromCharCode(10)); }catch(e){}' + NL +
          'callIndirect(l0, [l2]);');
        _log('[BIND] _start_command_export 绑定循环探针已加');
      } else _log('[BIND] 绑定循环文本未命中');
    }
    if (PROBE && /\$bound$/.test(nm)) {
      // 给**每个取指格式**的尾部取指打点：无论它用 `callIndirect(p0,[p1])`（派发器路由）
      //   还是 `callIndirect(p0,[l1])`（自派发），都记下 (格式名, 取指 pc, idx)。
      //   这样得到的是**完整指令轨迹**，可以直接量出每个格式的真实步进。
      const _m = /callIndirect\(p0, \[(\w+)\]\);/.exec(body);
      if (_m && body.split(_m[0]).length === 2) {
        const _tag2 = nm.replace('__main__0oOoOO___', '');
        body = body.split(_m[0]).join(
          'try{ globalThis.__FSEQ=(globalThis.__FSEQ||0)+1; __req("fs").appendFileSync(".probe/tmp/mine_fetch.txt", "seq="+globalThis.__FSEQ+" "+' +
          JSON.stringify(_tag2) + '+" pc="+M32[VB+20]+" idx="+M32[M32[VB+308]+(M32[VB+20]<<2)]+String.fromCharCode(10)); }catch(e){}' + NL + _m[0]);
      }
    }
    // 锚定到函数签名里的 `{`，绝不用「第一个 {」（探针/字符串里的 { 会把它带偏）
    const sig = /^function [\w$]+\([^)]*\)[^{]*\{/;
    if (!sig.test(body)) return body;   // 非函数块（如产物头部注释）原样返回
    return body.replace(sig, (mm) => mm + NL + decl + NL + '__tick(' + JSON.stringify(nm) + ');' + extra);
  }).join(NL);
  _log('[dbg] src join 后 %d 字节, 行数 %d', src.length, src.split(NL).length);
  const names = src.split(NL).filter(l => l.startsWith('function '))
                  .map(l => l.slice(9, l.indexOf('(')));
  if (PROBE) { try { fs.writeFileSync('.probe/zsec/_transformed.js', src); } catch (e) {} }
  (0, eval)(src + NL + ';globalThis.__FN__ = {' + names.join(',') + '};');
  FN = globalThis.__FN__;
  _log('[vm] 反编译产物已加载，函数 %d 个', Object.keys(FN).length);
}

// ---------------------------------------------------------------- ⑦ 跑
process.on('SIGINT', () => {
  _log('[SIGINT] 总调用', globalThis.__TOT, '热点:',
    JSON.stringify(Object.entries(globalThis.__CNT || {}).sort((a, b) => b[1] - a[1]).slice(0, 10)));
  process.exit(3);
});
const ENTRY = process.env.ENTRY || '_start_command_export';
_log('[vm] sp=%d  ENTRY=%s', globalThis.sp, ENTRY);
const t0 = Date.now();
try {
  try { _log('[bisect] 即将跑 Go 前 String(Function)=%j (%d)', String(Function), String(Function).length); } catch (e) {}
  if (process.env.ZSE_DELCK === '1') {
    try { _log('[DELCK] 跑前 __g 存在=%s ck 类型=%s', !!(globalThis.__g), (globalThis.__g && typeof globalThis.__g.ck)); } catch (e) {}
    try { if (globalThis.__g && 'ck' in globalThis.__g) { delete globalThis.__g.ck; } } catch (e) {}
    try { _log('[DELCK] 删除后 ck 类型=%s', (globalThis.__g && typeof globalThis.__g.ck)); } catch (e) {}
  }
  const r = FN[ENTRY]();
  _log('[vm] %s 返回 %s  (%d ms)', ENTRY, r, Date.now() - t0);
} catch (e) {
  _log('[vm] 抛错 (%d ms): %s', Date.now() - t0, (e && e.message || e));
  { const _nl = String.fromCharCode(10);
    const _seq = [];
    for (const _x of (globalThis.__FNR || [])) { if (_seq.length && _seq[_seq.length-1] === _x) { _seq[_seq.length-1] = _x + ' (xN)'; } else _seq.push(_x); }
    const _out = [];
    for (const _x of _seq) { if (_x.indexOf('runtime_putchar') >= 0) { if (_out.length && _out[_out.length-1] === '  ...putchar...') continue; _out.push('  ...putchar...'); } else _out.push('  ' + _x); }
    _log('[vm] B0 命中(末 12) = ' + String.fromCharCode(10) + '  ' + (globalThis.__B0H || []).slice(-12).join(String.fromCharCode(10) + '  '));
    _log('[vm] OOo0o0 return 路径命中次数 = %d', globalThis.__RETN || 0);
    _log('[vm] 最后命中的 break $B0 序号 = %s', String(globalThis.__B0S));
    _log('[vm] 12223 判据记录(末 8) = ' + String.fromCharCode(10) + '  ' + (globalThis.__B6 || []).slice(-8).join(String.fromCharCode(10) + '  '));
    _log('[vm] ParseUint@12226 结果(末 6) = ' + String.fromCharCode(10) + '  ' + (globalThis.__PU || []).slice(-6).join(String.fromCharCode(10) + '  '));
    _log('[vm] 第8处断言现场(末 6) = ' + String.fromCharCode(10) + '  ' + (globalThis.__B0L || []).slice(-6).join(String.fromCharCode(10) + '  '));
    _log('[vm] TAG2 (OOo0o0 panic 点) 记录(末 10) = ' + String.fromCharCode(10) + '  ' + (globalThis.__TAG2 || []).slice(-10).join(String.fromCharCode(10) + '  '));
    _log('[vm] TAG 判据记录(末 20) = ' + String.fromCharCode(10) + '  ' + (globalThis.__TAG || []).slice(-20).join(String.fromCharCode(10) + '  '));
    _log('[vm] 出错函数 = ' + globalThis.__LASTFN + _nl + '  执行路径(去重):' + _nl + _out.slice(-45).join(_nl)); }
  try {
    const _nl = String.fromCharCode(10);
    _log('[vm] 出错前最近 60 次 callIndirect:' + _nl + '  ' + (globalThis.__RB || []).join(_nl + '  '));
    _log('[vm] vm.pc=%d prog=%d n=%d', M32[VB + 20], M32[(VB+308)], M32[(VB+312)]);
    _log('[vm] putchar 索引 M32[(315148+VD)]=%d  缓冲区 @(315152+VD) 前 16 字节=%s', M32[(315148+VD)], Array.from(new Uint8Array(mem, (315152+VD), 16)).join(','));
    _log('[vm] putchar l1 历史(末 40) = ' + (globalThis.__PL || []).slice(-40).join(','));
    _log('[vm] putchar l1 最大值 = ' + Math.max.apply(null, globalThis.__PL || [0]));
  } catch (e2) {}
  if (process.env.STACK) _log(e.stack);
}
_log('[cnt] _00oooO=%d  _0oOoOO=%d  sliceAppend=%d', (globalThis.__CNT||{})['__main__0oOoOO___00oooO']||0, (globalThis.__CNT||{})['__main__0oOoOO___0oOoOO']||0, (globalThis.__CNT||{})['runtime_sliceAppend']||0);
_log('[vm] 总调用 %d  热点:', globalThis.__TOT,
  JSON.stringify(Object.entries(globalThis.__CNT).sort((a, b) => b[1] - a[1]).slice(0, 8)));
_log('[vm] import 统计:', JSON.stringify(LOG));
if (PROBE) {
  try {
    const _g = globalThis.__g, _b = globalThis.__b, _c = globalThis.__c;
    const _f = (x, n) => (x && typeof x.length === 'number') ? ('len=' + x.length + ' head=' + JSON.stringify(Array.from(x).slice(0, 60))) : String(typeof x);
    _log('[END] __g.ck %s', (typeof (_g && _g.ck) === 'string') ? ('len=' + _g.ck.length + ' head=' + JSON.stringify(_g.ck.slice(0, 40))) : String(typeof (_g && _g.ck)));
    _log('[END] __b.zh %s', (typeof (_b && _b.zh) === 'string') ? ('len=' + _b.zh.length) : String(typeof (_b && _b.zh)));
    _log('[END] __c.qh %s', (typeof (_c && _c.qh) === 'string') ? ('len=' + _c.qh.length) : String(typeof (_c && _c.qh)));
    _log('[END] __c.g %s', _f(_c && _c.g));
    try { const _a = Array.from(_c.g); const _bf = Buffer.alloc(_a.length*4); for (let _i=0;_i<_a.length;_i++) _bf.writeUInt32LE(_a[_i]>>>0, _i*4); require('fs').writeFileSync('.probe/tmp/mine_cg.bin', _bf); } catch(e){}
    _log('[END] __c.F %s', _f(_c && _c.F));
    _log('[END] __g.B %s', _f(_g && _g.B));
  } catch (e) { _log('[END] dump 失败 %s', e.message); }
}
if (PROBE && process.env.ZSE_MEMDUMP === '1') {
  try {
    fs.writeFileSync('.probe/tmp/mine_mem.bin', Buffer.from(new Uint8Array(mem)));
    _log('[vm] 已写 mine_mem.bin %d 字节', mem.byteLength);
  } catch (e) { _log('[vm] 写内存失败: %s', e.message); }
}
