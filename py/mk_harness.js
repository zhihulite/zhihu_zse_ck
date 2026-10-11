// ============================================================================
// mk_harness.js —— Go VM 字节码「格式解码器」探针（makecode 的取指层）
//
//   用法: node py/mk_harness.js <prog.bin> <requests.json> <out.json>
//   requests = [[idx, pc], ...]      idx = elem 表索引(1..107)，pc = 程序词下标
//   out      = [{"idx":..,"pc":..,"dispatcher":"..","args":[..],"nextPc":..}, ...]
//
// 原理：直接 eval 反编译产物 .probe/wt/zse.decompiled.js，把 104 个 $bound
//       解码器里对 5 个语义派发器的调用**换成捕获**，其余内存访问用稀疏字典
//       兜住。这样得到的就是**真实解码逻辑**，不是重新推导的近似。
// ============================================================================
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = process.env.ZSE_ROOT || path.resolve(__dirname, '..');
const DEC = process.env.ZSE_DECOMPILED || path.join(ROOT, '.probe', 'wt', 'zse.decompiled.js');

const progPath = process.argv[2];
const reqPath = process.argv[3];
const outPath = process.argv[4];

const progBuf = fs.readFileSync(progPath);
const NW = progBuf.length;                       // 词数（每词 1 字节，存成 u32 槽）
const PROG_PTR = 0x400000;                       // 程序在假内存里的基址
const VM_PTR = 0x100000;                         // 假 VM 结构体基址

// ---------------------------------------------------------------- 假内存
const MEM = new Map();
function mkView(scale) {
  return new Proxy({}, {
    get(t, k) {
      if (typeof k === 'string' && !/^[0-9]+$/.test(k)) return undefined;
      const a = Number(k) * scale;
      const v = MEM.get(a);
      return v === undefined ? 0 : v;
    },
    set(t, k, v) {
      if (typeof k === 'string' && !/^[0-9]+$/.test(k)) return true;
      MEM.set(Number(k) * scale, v);
      return true;
    },
  });
}
const M8 = mkView(1), M16 = mkView(2), M32 = mkView(4), M64 = mkView(8), F64 = mkView(8);

for (let i = 0; i < NW; i++) MEM.set(PROG_PTR + (i << 2), progBuf[i]);
MEM.set(VM_PTR + 308, PROG_PTR);
MEM.set(VM_PTR + 312, NW);
MEM.set(VM_PTR + 380, 108);
MEM.set(VM_PTR + 376, 0x500000);
MEM.set(VM_PTR, 0);

let sp = 0;
const uge = (a, b) => (a >>> 0) >= (b >>> 0);
const ugt = (a, b) => (a >>> 0) > (b >>> 0);
const ule = (a, b) => (a >>> 0) <= (b >>> 0);
const ult = (a, b) => (a >>> 0) < (b >>> 0);
const irem = (a, b) => (b === 0 ? 0 : ((a % b) | 0));
const runtime_nilPanic = () => { throw new Error('nilPanic'); };
const runtime_lookupPanic = () => { throw new Error('lookupPanic'); };
const runtime_divideByZeroPanic = () => { throw new Error('divByZero'); };
const runtime_stringNext = () => {};
const runtime_stringFromUnicode = () => {};
const runtime_stringConcat = () => {};
const runtime_alloc = () => 0x600000;
const memFill = () => {};
const strconv_ParseUint = () => {};
const callIndirect = () => { throw new Error('callIndirect'); };

// ---------------------------------------------------------------- 捕获
let CAP = null;
class Stop { constructor(c) { this.c = c; } }
const DISPATCHERS = ['00oooO', 'OOo0o0', 'O0O00o', '0OO0Oo', 'O0o0Oo'];
function __CAP__(name, ...args) { CAP = { name, args: args.slice(1) }; throw new Stop(CAP); }

// ---------------------------------------------------------------- 载入反编译产物
let src = fs.readFileSync(DEC, 'utf8');
let nrep = 0;
for (const d of DISPATCHERS) {
  const re = new RegExp('(?<!function )__main__0oOoOO___' + d + '\\(', 'g');
  src = src.replace(re, () => { nrep++; return "__CAP__('" + d + "',"; });
}
const exportNames = ['uge', 'ugt', 'ule', 'ult', 'irem', 'runtime_nilPanic', 'runtime_lookupPanic',
  'runtime_divideByZeroPanic', 'runtime_stringNext', 'runtime_stringFromUnicode',
  'runtime_stringConcat', 'runtime_alloc', 'memFill', 'strconv_ParseUint', 'callIndirect',
  '__CAP__', 'M8', 'M16', 'M32', 'M64', 'F64'];
const P = ['sp', 'p0', 'p1', 'p2', 'p3', 'p4', ...exportNames];
const body = src + '\n;return {' + exportNames.map(n => n + ':' + n).join(',') + '};';
const fn = new Function(...P, body);
const env = fn(0, VM_PTR, 0, 0, 0, 0,
  uge, ugt, ule, ult, irem, runtime_nilPanic, runtime_lookupPanic, runtime_divideByZeroPanic,
  runtime_stringNext, runtime_stringFromUnicode, runtime_stringConcat, runtime_alloc, memFill,
  strconv_ParseUint, callIndirect, __CAP__, M8, M16, M32, M64, F64);
// `sp` 是模块级全局，函数里会写它；用 with 包不住，改从 MEM 直接读回即可（解码器不用 sp）

const reqs = JSON.parse(fs.readFileSync(reqPath, 'utf8'));
const out = [];
for (const [idx, pc] of reqs) {
  const nm = 'main__0oOoOO_' + '_' + String(idx);   // 占位
  const rec = { idx, pc, dispatcher: null, args: null, nextPc: null, err: null };
  try {
    const fname = TABLE[idx];
    if (!fname) { rec.err = 'no-table-entry'; out.push(rec); continue; }
    const f = env[fname];
    if (typeof f !== 'function') { rec.err = 'no-fn:' + fname; out.push(rec); continue; }
    MEM.set(VM_PTR + 20, pc);
    CAP = null;
    try { f(VM_PTR); rec.err = 'no-dispatch'; }
    catch (e) {
      if (e instanceof Stop) {
        rec.dispatcher = CAP.name;
        rec.args = CAP.args.map(x => (typeof x === 'bigint' ? Number(x) : x));
      } else rec.err = 'throw:' + e.message;
    }
    rec.nextPc = MEM.get(VM_PTR + 20);
  } catch (e) { rec.err = 'outer:' + e.message; }
  out.push(rec);
}
fs.writeFileSync(outPath, JSON.stringify(out));
console.error('replaced dispatcher calls: ' + nrep);
