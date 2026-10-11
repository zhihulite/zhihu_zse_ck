// 完整 VM 状态初始化 + 驱动 + fd_write 捕获
const fs = require('fs');
const path = require('path');

const bytes = fs.readFileSync(path.resolve('.probe/wt/instr.wasm'));
const prog = fs.readFileSync(path.resolve('.probe/zsec/vmprog.bin'));
const N = prog.readUInt32BE(0);
const WORDS = Array.from(prog.slice(4, 4 + N));

let instRef = null;
function fdWrite(fd, iovs, n, nw) {
  try {
    const dv = new DataView(instRef.exports.memory.buffer);
    let out = '', written = 0;
    for (let i = 0; i < n; i++) {
      const p = dv.getUint32(iovs + i * 8, true);
      const l = dv.getUint32(iovs + i * 8 + 4, true);
      for (let k = 0; k < l; k++) out += String.fromCharCode(dv.getUint8(p + k));
      written += l;
    }
    if (out) process.stdout.write('[fd' + fd + '] ' + JSON.stringify(out) + '\n');
    dv.setUint32(nw, written, true);
    return 0;
  } catch (e) { return 0; }
}

const imports = {
  wasi_snapshot_preview1: { fd_write: fdWrite },
  gojs: { 'runtime.ticks': () => Date.now() * 1000000 },
  env: {
    'syscall/js.finalizeRef': () => {}, 'syscall/js.copyBytesToGo': () => {},
    'syscall/js.valueSetIndex': () => {}, 'syscall/js.valueNew': () => 0,
    'syscall/js.valueLength': () => 0, 'syscall/js.valueIndex': () => 0,
  },
};

(async () => {
  const { instance } = await WebAssembly.instantiate(bytes, imports);
  instRef = instance;
  const ex = instance.exports;
  const mem = ex.memory;
  const M32 = () => new Uint32Array(mem.buffer);

  const wordsPtr = ex.malloc(N * 4 + 64);
  const statePtr = ex.malloc(1024);
  const stk = ex.malloc(65536), res = ex.malloc(65536);
  const retStk = ex.malloc(65536), savRes = ex.malloc(65536), savStk = ex.malloc(65536);
  const tbl = ex.malloc(2048);

  let a = M32();
  for (let i = 0; i < N; i++) a[(wordsPtr >> 2) + i] = WORDS[i];
  for (let k = 0; k < 108; k++) { a[(tbl >> 2) + 2 * k] = k; a[(tbl >> 2) + 2 * k + 1] = k ? 1 : 0; }
  const S = (o) => (statePtr + o) >> 2;
  for (let off = 176; off <= 656; off += 8) a[(statePtr + off) >> 2] = 314296;

  a[S(20)] = 0; a[S(276)] = 314296; a[S(280)] = 0;
  a[S(284)] = res; a[S(288)] = 0;
  a[S(296)] = stk; a[S(300)] = 0; a[S(304)] = 4096;
  a[S(308)] = wordsPtr; a[S(312)] = N;
  a[S(336)] = retStk; a[S(340)] = 0; a[S(344)] = 4096;
  a[S(348)] = savRes; a[S(352)] = 0; a[S(356)] = 1024;
  a[S(360)] = savStk; a[S(364)] = 0; a[S(368)] = 1024;
  a[S(376)] = tbl; a[S(380)] = 108;

  console.log('初始化完成');
  const trace = [];
  let pc = 0, steps = 0, err = null;
  const MAX = 200;
  while (pc < N && steps < MAX) {
    const op = M32()[(wordsPtr >> 2) + pc];
    const fn = ex['d_' + op];
    if (!fn) { err = 'no handler op=' + op + ' @pc=' + pc; break; }
    const before = pc;
    let trap = null;
    try { fn(statePtr); } catch (e) { trap = String(e).slice(0, 60); }
    let after = M32()[S(20)];
    const TAIL = new Set([14, 16, 21, 24, 29, 35, 41, 44, 49, 59, 66, 81, 87, 95, 100, 102]);
    if (TAIL.has(op) && after === before + 3) after = before + 4;
    trace.push({ pc: before, op, next: after, trap });
    if (after <= before) { err = 'no advance @pc=' + before + ' op=' + op; break; }
    pc = after; steps++;
  }
  console.log('步数 %d  结束 pc=%d/%d  %s', trace.length, pc, N, err || 'OK');
  fs.writeFileSync('.probe/zsec/vm_trace2.json', JSON.stringify(trace, null, 0));
})();
