// 用手写环境（无 jsdom/sdenv）在 vm 沙箱里跑挑战 JS，观测 __b.zh / __b.a3
const fs = require('fs');
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const src0 = fs.readFileSync('.probe/eval-83-136041.js', 'utf8');

const sandbox = createEnv();
// 沙箱内不应存在 process / global / require
delete sandbox.process; delete sandbox.global; delete sandbox.Buffer;
sandbox.globalThis = sandbox;

const ctx = vm.createContext(sandbox, { name: 'zhihu' });

const trace = [];
const T = (o) => { if (trace.length < 4000) trace.push(o); };

// 逐 opcode 轨迹（可选，用 OP=1 打开）
const WANT_OPS = process.env.OP === '1';
const ops = [];

const FETCH = "this['k']=this['S'][_0x57e9c4++]||-(0x1d59+-0x43*0x83+-0xfd*-0x5);";
let src = src0;
const MIN = process.env.MIN === '1';
if (!MIN) {
  if (WANT_OPS) src = src.split(FETCH).join(FETCH + "__OPLOG(this,_0x57e9c4-1,this['k']);");
  src = src.replace('var __b=new BVM();', 'var __b=new BVM();__HOOK_BVM(__b);');
  src = src.replace('eval(_0x25dc0d[_0x2a5cf3(0x8b)]())', 'eval(__EVLOG(_0x25dc0d[_0x2a5cf3(0x8b)]()))');
  src = src.replace('eval(_0x1b9b89)', 'eval(__EVLOG(_0x1b9b89))');
} else {
  // 最小插桩：只挂 zh setter，不追踪 z/t、不记 op、不碰 eval
  src = src.replace('var __b=new BVM();', 'var __b=new BVM();__HOOK_MIN(__b);');
}
sandbox.__HOOK_MIN = function (b) {
  let _zh;
  Object.defineProperty(b, 'zh', {
    configurable: true, enumerable: true,
    get() { return _zh; },
    set(v) { _zh = v; T({ ev: 'zh:set', len: v && v.length, head: String(v).slice(0, 120) }); },
  });
};

sandbox.__EVLOG = (s) => { T({ ev: 'eval', len: (s && s.length) || 0, head: String(s).slice(0, 160) }); return s; };
sandbox.__OPLOG = (self, pc, word) => {
  if (ops.length < 30000) ops.push({ pc, word, o: self.o, dst: self.N, ra: self.K, rb: self.P, idx: self.T, fn: self.O, val: self.val, regs: self.F && self.F.slice(0, 4), a3: self.a3, arrLen: self.g ? self.g.length : -1, t0: self.G, dt: Date.now() - self.G });
};
sandbox.__HOOK_BVM = function (b) {
  T({ ev: 'hookBVM' });
  let _zh;
  Object.defineProperty(b, 'zh', {
    configurable: true, enumerable: true,
    get() { T({ ev: 'zh:get', stack: (new Error()).stack.split('\n').slice(2, 5).map(s => s.trim().slice(0, 110)) }); return _zh; },
    set(v) { _zh = v; T({ ev: 'zh:set', len: v && v.length, head: String(v).slice(0, 80) }); },
  });
  const orig = b.z;
  const tracer = function (pc, ...rest) {
    const self = this;
    let out, err = null;
    try { out = orig.apply(self, [pc, ...rest]); } catch (e) { err = e; }
    if (typeof rest[0] === 'string' && rest[0].length > 1000 && !fs.existsSync('.probe/zsec/entry_arg.txt')) {
      fs.writeFileSync('.probe/zsec/entry_arg.txt', rest[0], 'utf8');
      fs.writeFileSync('.probe/zsec/entry_arg.meta.json', JSON.stringify({ pc, len: rest[0].length, nargs: rest.length }), 'utf8');
    }
    T({ ev: 'call', pc: typeof pc === 'string' ? 'STR(' + pc.length + ')' : pc, args: rest.map(a => typeof a === 'string' ? 'STR(' + a.length + ')' : String(a)), ret: err ? ('THROW ' + err.message) : (typeof out === 'string' ? 'STR(' + out.length + ')' : String(out)), a3: self.a3 });
    if (err) throw err;
    return out;
  };
  b.z = tracer; b.t = tracer;
};

let runErr = null;
try { vm.runInContext(src, ctx, { filename: 'challenge.js', timeout: 120000 }); } catch (e) { runErr = e; }

const b = sandbox.__b;
function snap(o) {
  const out = {};
  if (!o) return out;
  for (const k of Object.getOwnPropertyNames(o)) {
    const v = o[k];
    if (Array.isArray(v)) out[k] = { arr: v.length, head: v.slice(0, 12).map(x => typeof x === 'string' ? 'STR(' + x.length + ')' : x) };
    else if (typeof v === 'function') out[k] = '<fn>';
    else if (v && typeof v === 'object') out[k] = '<obj>';
    else out[k] = v;
  }
  return out;
}
const out = {
  runErr: runErr ? (runErr.name + ': ' + runErr.message) : null,
  hasB: !!b,
  bA3: b && b.a3, bWord: b && b.k, bDst: b && b.N, bRa: b && b.K,
  bZhLen: b && b.zh ? String(b.zh).length : 0,
  bZh: b && b.zh ? String(b.zh).slice(0, 400) : null,
  bR: b && b.R ? b.R.slice(0, 10).map(x => typeof x === 'string' ? 'STR(' + x.length + ')' : String(x)) : null,
  bW: b && b.W ? Array.from(b.W).map(x => x) : null,
  bSnap: snap(b),
  bSnap: snap(b),
  bSnap: snap(b),
  bSnap: snap(b),
  bSnap: snap(b),
  bSnap: snap(b),
  trace, ops,
};
fs.writeFileSync('.probe/zsec/handenv_out.json', JSON.stringify(out, null, 1), 'utf8');
console.log('runErr:', out.runErr);
console.log('hasB:', out.hasB, 'a3:', out.bA3, 'word:', out.bWord, 'dst:', out.bDst, 'ra:', out.bRa);
console.log('zhLen:', out.bZhLen);
console.log('bR:', JSON.stringify(out.bR));
console.log('bW:', JSON.stringify(out.bW));
console.log('traceCount:', trace.length, 'opCount:', ops.length);
console.log('zh:set events:', JSON.stringify(trace.filter(t => t.ev === 'zh:set')));
console.log('evals:', JSON.stringify(trace.filter(t => t.ev === 'eval')));
if (WANT_OPS) console.log('ops:', ops.map(o => o.pc + ':' + o.word).join(' '));
