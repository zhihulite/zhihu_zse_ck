// REAL-ENV ALIGNMENT: reproduce the qh bytes the live browser produced, using the
// readable orchestrator (js/orchestrator.readable.js) -- not a hand-rolled chain.
//
// Evidence used (all captured from the live page, see ALGORITHM.md §14/§18):
//   real qh  : 7c2d2b782e2f7d2f | e2808e | 2d2e7e...2f2f77   (43 bytes)
//   seed     : __b.a3 = 114 for that session (recovered from the 8B block)
//   fp md5   : 6713b41072b8449e792f748225172a79  (three-way verified in §18)
// Everything else -- mask model, keys, separator, chain feedback -- is computed here.
import vm from 'node:vm';
import fs from 'node:fs';

const REAL = '7c2d2b782e2f7d2f' + 'e2808e' +
  '2d2e7e287a2c2a7b7a70702e2a787672717c2f2c2b7d722125287b2a282f2f77';
const SEED = 114;
const FP_MD5 = '6713b41072b8449e792f748225172a79';

const readable = fs.readFileSync('js/orchestrator.readable.js', 'utf8')
  .replace(/module\.exports[\s\S]*$/, '');

// A Chrome-complete environment: every probed capability exists, so no mask bit is added
// and the plaintext must be exactly the two pre-seeded bits, 0x8000 / 0x4000.
// every Range member either probe table (maskA bits 5..0 + maskB bits 15..0) exists,
// so no capability bit may be added: the plaintext must be the two pre-seeded bits only.
const range = {};
for (const n of ['cloneContents', 'collapse', 'collapsed', 'commonAncestorContainer',
  'compareBoundaryPoints', 'comparePoint', 'endOffset', 'extractContents',
  'getBoundingClientRect', 'getClientRects', 'insertNode', 'intersectsNode', 'isPointInRange',
  'selectNode', 'selectNodeContents', 'setEnd', 'setEndAfter', 'setEndBefore', 'setStart',
  'setStartAfter', 'setStartBefore', 'startContainer', 'cloneRange']) {
  range[n] = n === 'collapsed' ? false : () => 1;
}
const ctx = vm.createContext({ console });
Object.assign(ctx, {
  document: {
    body: {},
    createNodeIterator: () => ({ root: 1, filter: 1, detach: 1, whatToShow: 1 }),
    createRange: () => Object.assign({}, range),
    querySelectorAll: () => [1],
  },
  navigator: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' },
  Worker: function () { return { postMessage: () => {}, set onmessage(f) {} }; },
  Blob: function () {}, URL: { createObjectURL: () => 'blob:x' },
  Error: class extends globalThis.Error {
    constructor(m) { super(m); Object.defineProperty(this, 'stack',
      { value: 'Error\n    at https://static.zhihu.com/zse-ck/v4/b.js:1:1' }); }
  },
});
vm.runInContext('window = globalThis; self = globalThis; top = window; parent = window;' +
  readable, ctx);

ctx.__b = { a3: SEED };
ctx.__c = {};
const SRC0 = 'try{const worker=new Worker(URL.createObjectURL(new Blob(["x"],{type:"application/javascript"})));' +
  'worker.postMessage("");worker.onmessage=function(e){__g.worker=e};return 1}catch(_){return 2}';
const out = vm.runInContext(
  `orchestrate({ window: window, document: document, __b: __b, __c: __c, Error: Error,
     BVM: function BVM(){ /* the live interpreter class */ },
     SRC0: ${JSON.stringify(SRC0)}, SRC_FP: "return '${FP_MD5}'" })`, ctx);

const ours = Buffer.from(String(ctx.__c.qh), 'utf8');

const dbg = vm.runInContext(`(function(){
  const box = makeAccessorBox(); const view = new Proxy(window, box);
  const F = view.Function, doc = view.document;
  const qs = new F('a','try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}');
  const c = { view, F, doc, qs, SRC0: ${JSON.stringify(SRC0)} };
  const iter = doc.createNodeIterator(doc.body); const rg = doc.createRange();
  return { worker: new F(c.SRC0)(), qs_defined: qs(':defined'), qs_nothas: qs('div:not(:has(div))'),
    root: typeof iter.root, filter: typeof iter.filter, detach: typeof iter.detach, whatToShow: typeof iter.whatToShow,
    cloneRange: typeof rg.cloneRange, endOffset: typeof rg.endOffset, startContainer: typeof rg.startContainer,
    PROBES_A: PROBES_A.map(p=>[p.bit, p.missing(c)]), PROBES_B: PROBES_B.map(p=>[p.bit, p.missing(c)]) };
})()`, ctx);
console.log('probe debug =', JSON.stringify(dbg));
console.log('ours   =', ours.toString('hex'));
console.log('real   =', REAL);
console.log('chain a3 after  =', ctx.__b.a3, ' rc =', out);
console.log(ours.toString('hex') === REAL ? 'BYTE-IDENTICAL with the live browser qh '
  : 'DIFF  ours.len=' + ours.length + ' real.len=' + (REAL.length / 2));

// ---- same env, but running the DEVIRTUALIZED VM program (js/cvm.decompiled.js) ----
// Only the fingerprint layer is pinned (it needs the live canvas/WebGL/font inputs);
// everything else -- accessor box, the 27 capability probes, masks, chain, qh layout --
// is computed by the VM itself.
const stripExports = (t) => t.slice(0, t.indexOf('if (typeof module'));
const decompiled = stripExports(fs.readFileSync('js/cvm.decompiled.js', 'utf8'));
const ctx2 = vm.createContext({ console });
const env2 = (code) => vm.runInContext(code, ctx2);
ctx2.document = ctx.document; ctx2.navigator = ctx.navigator;
ctx2.Worker = ctx.Worker; ctx2.Blob = ctx.Blob; ctx2.URL = ctx.URL; ctx2.Error = ctx.Error;
ctx2.__b = { a3: SEED }; ctx2.__c = {};
vm.runInContext('function BVM(){}; globalThis.BVM = BVM;', ctx2);   // the inner VM class the gauntlet inspects
vm.runInContext('window = globalThis; self = globalThis; top = window; parent = window;' + decompiled, ctx2);
// pin the fingerprint layer: new Function(<27K source>)() -> FP_MD5
vm.runInContext(`(function(){ const RealF = Function;
  globalThis.Function = function(){ const f = RealF.apply(null, arguments);
    const s = typeof arguments[0] === 'string' ? arguments[0] : '';
    if (s.length > 500) return function(){ return ${JSON.stringify(FP_MD5)}; };
    return f; };
  globalThis.Function.prototype = RealF.prototype; })();`, ctx2);
env2('RUN([], DEC_POOL)');
const ours2 = Buffer.from(String(ctx2.__c.qh), 'utf8');   // U+200E becomes its 3 UTF-8 bytes, as in wasm memory
console.log('vm-recovered =', ours2.toString('hex'), ' a3 after =', ctx2.__b.a3);
console.log(ours2.toString('hex') === REAL ? 'VM == live browser qh  ✓' : 'VM DIFF');
