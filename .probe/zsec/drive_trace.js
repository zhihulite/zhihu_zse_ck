// 用插桩版 wasm 手工驱动 VM 解码器，观测真实 pc 推进
const fs = require('fs');
const path = require('path');

const bytes = fs.readFileSync(path.resolve('.probe/wt/instr.wasm'));
const prog = fs.readFileSync(path.resolve('.probe/zsec/vmprog.bin'));
const N = prog.readUInt32BE(0);
const WORDS = Array.from(prog.slice(4, 4 + N));
console.log('程序词数 N =', N);

const noop = () => 0;
const imports = {
  wasi_snapshot_preview1: { fd_write: () => 0 },
  gojs: { 'runtime.ticks': () => Date.now() * 1000000 },
  env: {
    'syscall/js.finalizeRef': () => {}, 'syscall/js.copyBytesToGo': () => {},
    'syscall/js.valueSetIndex': () => {}, 'syscall/js.valueNew': () => 0,
    'syscall/js.valueLength': () => 0, 'syscall/js.valueIndex': () => 0,
  },
};

(async () => {
  const { instance } = await WebAssembly.instantiate(bytes, imports);
  const ex = instance.exports;
  const mem = ex.memory;
  const m8 = () => new Uint8Array(mem.buffer);
  const m32 = () => new Uint32Array(mem.buffer);
  console.log('导出数:', Object.keys(ex).length, ' 有 d_56:', typeof ex['d_56']);

  // 分配：词数组 + VM 状态
  const wordsPtr = ex.malloc(N * 4 + 64);
  const statePtr = ex.malloc(4096);
  const stackPtr = ex.malloc(4096);
  console.log('wordsPtr=0x%x statePtr=0x%x stackPtr=0x%x', wordsPtr, statePtr, stackPtr);

  { const a = m32(); for (let i = 0; i < N; i++) a[(wordsPtr >> 2) + i] = WORDS[i]; }

  // 初始化 VM 状态
  const S = (off) => (statePtr + off) >> 2;
  let a = m32();
  a[S(20)] = 0;            // pc
  a[S(308)] = wordsPtr;    // words
  a[S(312)] = N;           // len
  a[S(296)] = stackPtr;    // 操作数栈数据
  a[S(300)] = 0;           // 栈顶
  a[S(304)] = 1024;        // 栈上限

  const trace = [];
  let pc = 0, steps = 0, err = null;
  const MAX = 3000;
  while (pc < N && steps < MAX) {
    const op = m32()[(wordsPtr >> 2) + pc];
    const fn = ex['d_' + op];
    if (!fn) { err = 'no handler for op=' + op + ' at pc=' + pc; break; }
    const before = pc;
    try { fn(statePtr); } catch (e) { err = 'panic at pc=' + pc + ' op=' + op + ': ' + String(e).slice(0, 90); break; }
    const after = m32()[S(20)];
    trace.push([before, op, after - before]);
    if (after <= before) { err = 'pc 未推进 at pc=' + pc + ' op=' + op; break; }
    pc = after; steps++;
  }
  console.log('步数:', trace.length, ' 结束 pc =', pc, '/', N, err ? ('\n' + err) : '  OK');
  console.log('前 40 条 (pc,op,len):');
  console.log(trace.slice(0, 40).map(t => '%d:op%d/%d'.replace('%d', t[0]).replace('op%d', 'op' + t[1]).replace('/%d', '/' + t[2])).join(' '));
  // 长度统计
  const byOp = {};
  trace.forEach(([p, o, l]) => { (byOp[o] = byOp[o] || new Set()).add(l); });
  const multi = Object.entries(byOp).filter(([o, s]) => s.size > 1);
  console.log('长度不唯一的 opcode 数:', multi.length, multi.slice(0, 8).map(([o, s]) => 'op' + o + ':' + [...s].join('/')).join(' '));
  fs.writeFileSync('.probe/zsec/vm_trace.json', JSON.stringify(trace));
  console.log('trace 已写 .probe/zsec/vm_trace.json');
})();
