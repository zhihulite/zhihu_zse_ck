// Smoke-test the devirtualized CVM program (js/payload.cvm.js) in a mock browser env.
// Run: node .probe/_scratch/cvmrun.mjs [--trace]
//
// The mock auto-vivifies any property the program probes (so nothing throws) and records
// the miss list -- that list is the environment surface the program actually touches,
// comparable against .probe/native-input-surface.json measured from the engine trace.
import vm from 'node:vm';
import fs from 'node:fs';

const FILE = process.argv.find(a=>a.startsWith('--file='))?.split('=')[1] || 'js/payload.cvm.js';
const src = fs.readFileSync(FILE, 'utf8');
const W = (m) => process.stderr.write(String(m) + '\n');
const T0 = 1759400000000;
const misses = [];

function auto(name) {
  const fn = function () { return auto(name + '()'); };
  const store = {};
  return new Proxy(fn, {
    get(t, p) {
      if (p === Symbol.toPrimitive) return (h) => (h === 'number' ? 0 : name);
      if (p === Symbol.iterator) return undefined;
      if (p === 'toString') return () => '[object ' + name + ']';
      if (p === 'valueOf') return () => 0;
      if (typeof p === 'symbol') return Reflect.get(t, p);
      if (Object.prototype.hasOwnProperty.call(store, p)) return store[p];
      if (!(p in t)) { misses.push(name + '.' + String(p)); }
      return auto(name + '.' + String(p));
    },
    set(t, p, v) { store[p] = v; return true; },
    has() { return true; },
    apply() { return auto(name + '()'); },
    ownKeys() { return ['prototype', 'length', 'name'].concat(Object.keys(store)); },
    getOwnPropertyDescriptor(t, p) {
      if (p === 'prototype' || p === 'length' || p === 'name') {
        const d = Reflect.getOwnPropertyDescriptor(t, p);
        if (d) d.enumerable = false;
        return d;
      }
      return Object.prototype.hasOwnProperty.call(store, p)
        ? { value: store[p], writable: true, configurable: true, enumerable: true } : undefined;
    },
  });
}

function permissive(name, proto) {
  return new Proxy(proto, {
    get(t, p, r) {
      if (typeof p === 'symbol') return Reflect.get(t, p, r);
      if (Object.prototype.hasOwnProperty.call(t, p)) {
        const v = Reflect.get(t, p, r);
        return typeof v === 'function' ? v.bind(t) : v;
      }
      misses.push(name + '.' + String(p));
      return auto(name + '.' + String(p));
    },
    set(t, p, v) { t[p] = v; return true; },
    has(t, p) { return String(p) in t; },
  });
}

const canvasEl = {
  tagName: 'CANVAS', width: 0, height: 0, style: {},
  getContext: () => null, toDataURL: () => 'data:,',
};
const doc = permissive('document', {
  cookie: '', readyState: 'complete', hidden: false, visibilityState: 'visible',
  documentElement: { style: {}, clientWidth: 1280, clientHeight: 720 },
  head: { appendChild: () => {}, removeChild: () => {} },
  body: { appendChild: () => {}, removeChild: () => {}, getAttribute: () => null },
  getElementById: () => ({ content: 'META', getAttribute: () => 'META' }),
  querySelector: () => ({ toString: () => '[object HTMLScriptElement]' }),
  querySelectorAll: () => [],
  createElement: (t) => permissive('el:' + t, canvasEl),
  getElementsByTagName: () => [{ getAttribute: () => null, appendChild: () => {}, removeChild: () => {} }],
  addEventListener: () => {}, removeEventListener: () => {}, write: () => {},
});
const nav = permissive('navigator', {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  platform: 'Win32', language: 'zh-CN', languages: ['zh-CN', 'zh'], vendor: 'Google Inc.',
  onLine: true, hardwareConcurrency: 8, plugins: [], mimeTypes: [], webdriver: false,
  maxTouchPoints: 0, appName: 'Netscape', appCodeName: 'Mozilla', product: 'Gecko',
});

const ctx = vm.createContext({ console }); ctx.__sublog = [];
Object.assign(ctx, {
  document: doc, navigator: nav,
  screen: permissive('screen', { width: 1920, height: 1080, availWidth: 1920, availHeight: 1040, colorDepth: 24, pixelDepth: 24 }),
  location: permissive('location', {
    href: 'https://www.zhihu.com/signin', protocol: 'https:', host: 'www.zhihu.com',
    hostname: 'www.zhihu.com', pathname: '/signin', search: '', hash: '',
    reload: () => {}, replace: () => {}, assign: () => {}, toString: () => 'https://www.zhihu.com/signin',
  }),
  history: permissive('history', { length: 1 }),
  performance: permissive('performance', { now: () => 12.5, timeOrigin: T0 - 900 }),
  localStorage: permissive('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} }),
  sessionStorage: permissive('sessionStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} }),
  setTimeout: (f) => { try { f(); } catch (e) { W('timer threw ' + e); } return 0; },
  setInterval: () => 0, clearTimeout: () => {}, clearInterval: () => {},
  addEventListener: () => {}, removeEventListener: () => {},
  Date: class { static now() { return T0; } },
});
for (const g of ['Worker', 'Blob', 'URL', 'XMLHttpRequest', 'MutationObserver', 'Image',
  'SharedWorker', 'RTCPeerConnection', 'AudioContext', 'OfflineAudioContext', 'Element',
  'Node', 'Range', 'NodeIterator', 'Text', 'Event', 'HTMLElement', 'CSS', 'Intl', 'WebGLRenderingContext']) {
  ctx[g] = auto(g);
}
ctx.__b = {}; ctx.__c = {}; ctx.__g = {};

const stubGets = [];
const mkColl = (els) => { const a = els.slice(); a.toString = () => '[object HTMLCollection]'; a.item = (i) => a[i]; a.namedItem = () => null; return a; };
const mkEl = (tag) => ({ tagName: tag, toString() { return '[object HTML' + tag.charAt(0) + tag.slice(1).toLowerCase() + 'Element]'; }, style: {}, appendChild() {}, removeChild() {}, parentNode: null, offsetWidth: 10, offsetHeight: 20, toDataURL: () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', outerHTML: '<canvas width="240" height="60"></canvas>', getElementsByTagName: (t2) => mkColl([mkEl(String(t2).toUpperCase())]), getBoundingClientRect: () => ({}), getContext: (t2) => { if (t2 === '2d') { const store2 = {}; return new Proxy({}, { get(t3, p3) { if (p3 in store2) return store2[p3]; return (...a) => undefined; }, set(t3, p3, v) { store2[p3] = v; return true; } }); } return null; } });
const htmlEl = mkEl('HTML'); htmlEl.toString = () => '[object HTMLHtmlElement]';
const bodyEl = mkEl('BODY'); bodyEl.toString = () => '[object HTMLBodyElement]';
const stubDoc = new Proxy(function(){}, {
  get(t, p) {
    stubGets.push('document.' + String(p));
    if (p === 'URL' || p === 'documentURI' || p === 'baseURI') return 'https://www.zhihu.com/people/zhihuadmin/activities';
    if (p === 'domain') return 'www.zhihu.com';
    if (p === 'documentElement') return htmlEl;
    if (p === 'body') return bodyEl;
    if (p === 'all') { const arr = Array.from({length: 137}, (_, i2) => mkEl(['HTML','HEAD','BODY','DIV','SCRIPT','A','P','SPAN','TITLE','META','LINK','STYLE','UL','LI'][i2 % 14])); arr.getElementsByTagName = (t2) => [t2 === 'script' ? mkEl('SCRIPT') : mkEl(String(t2).toUpperCase())]; arr.toString = () => '[object HTMLAllCollection]'; return arr; }
    if (p === 'getElementsByTagName') return (t2) => [t2 === 'html' ? htmlEl : mkEl(String(t2).toUpperCase())];
    if (p === 'createElement') return (t2) => mkEl(String(t2).toUpperCase());
    if (p === 'createNodeIterator' || p === 'createRange') return () => ({ toString: () => '[object Object]', cloneRange() { return this; }, cloneContents() { return this; }, collapse() {}, selectNode() {}, selectNodeContents() {}, setEnd() {}, setEndAfter() {}, setEndBefore() {}, setStart() {}, setStartAfter() {}, setStartBefore() {}, extractContents() { return this; }, getBoundingClientRect() { return {}; }, getClientRects() { return []; }, insertNode() {}, intersectsNode() { return false; }, isPointInRange() { return false; }, compareBoundaryPoints() { return 0; }, comparePoint() {}, commonAncestorContainer: bodyEl, endOffset: 0, startContainer: bodyEl, startOffset: 0, collapsed: false, detach() {}, whatToShow: 0, filter: undefined, root: bodyEl });
    if (typeof p === 'string' && p.length > 12 && /[;=(){}]/.test(p)) { try { return new Function(p); } catch (e) { return undefined; } }
    return undefined;
  },
  set(t, p, v) { return true; },
});
const stubWin = new Proxy(function(){}, { get(t, p) { stubGets.push('window.' + String(p)); if (p === 'v_log') return undefined; return undefined; }, set(t, p, v) { return true; } });
for (const gname of ['window', 'document', 'self', 'top']) {
  try { Object.defineProperty(ctx, gname, { configurable: true, get() { return gname === 'document' ? stubDoc : stubWin; }, set(v) {} }); } catch (e) {}
}
process.on('exit', () => { try { fs.writeFileSync('.probe/stub-gets.json', JSON.stringify([...new Set(stubGets)])); } catch (e) {} });
   // plain: the program itself fills a3/ck/qh
// Watch the chain state: the child VM reads __b.a3 once per call and writes it back once,
// so every read is the seed of one encryption -- enough to recompute it independently.
const seeds = [], writes = [];
let _a3;
Object.defineProperty(ctx.__b, 'a3', {
  get() { seeds.push(_a3); return _a3; },
  set(v) { writes.push(v); _a3 = v; },
  enumerable: true, configurable: true,
});
// Record what the program feeds to new Function(<big source>) and what that returns
// (the fingerprint layer) -- the plaintext of the second subcall.
vm.runInContext(`
  __fp = []; (function(){
    const RealF = Function;
    globalThis.Function = function () {
      const f = RealF.apply(null, arguments);
      const s = typeof arguments[0] === 'string' ? arguments[0] : '';
      if (s.length > 500) {
        const rec = { src_len: s.length, ret: null };
        __fp.push(rec);
        return function () { const r = f.apply(this, arguments); rec.ret = String(r); return r; };
      }
      return f;
    };
    globalThis.Function.prototype = RealF.prototype;
  })();`, ctx);
// The program's anti-simulation check greps Error().stack for 'node' and returns 5 --
// in Node that is TRUE by construction.  Hand it a browser-shaped stack instead.
vm.runInContext(`(function(){
  const Real = Error, STACK = "Error\\n    at https://static.zhihu.com/zse-ck/v4/build.js:1:1\\n    at https://static.zhihu.com/people:2:3";
  function FakeError(m){ const e = new Real(m); Object.defineProperty(e, "stack", { value: STACK, configurable: true }); return e; }
  FakeError.prototype = Real.prototype;
  Error = FakeError; globalThis.Error = FakeError;
})();`, ctx);
vm.runInContext('window = globalThis; self = globalThis; top = window; parent = window;', ctx);

// The real page exposes VM/BVM/CVM + their string-decoder helpers as globals (see the
// 'added' list in .probe/live-fns.json).  The devirtualized program resolves BVM by name
// for its anti-tamper check and instantiates it for the inner layer, so load them.
let boot = 'n/a';
try {
  vm.runInContext(fs.readFileSync('.probe/live-fns.bootstrap.js', 'utf8'), ctx, { timeout: 10000 });
  boot = vm.runInContext("['VM','BVM','CVM','sc','_0x4811','_0x26f8','_0x258f'].map(n=>n+'='+typeof eval(n)).join(' ')", ctx);
} catch (e) { boot = 'BOOT FAIL: ' + e; }

// Every global the program resolves by name (M_EVAL("<name>")) must exist, otherwise
// eval(name) throws ReferenceError.  Define the ones we do not model as auto-mocks.
const names = new Set();
const L = src.split('\n');
for (let i = 0; i + 1 < L.length; i++) {
  const m = /S\.push\("([^"]+)"\);/.exec(L[i]);
  if (m && /M_EVAL\(S\.pop\(\)\)/.test(L[i + 1])) names.add(m[1].split('.')[0]);
}
const added = [];
for (const n of names) {
  if (!/^[A-Za-z_$][\w$]*$/.test(n)) continue;
  if (vm.runInContext('typeof ' + n, ctx) !== 'undefined') continue;
  ctx[n] = auto(n); added.push(n);
}


// Capability probes read members off globals (window.blur, history.pushState, ...) and check
// whether Function.prototype.toString of them contains 'native'.  A JS stub would trip the
// anti-tamper path, so fill missing names with REAL native functions from this runtime.
const NATIVES = [Array.prototype.push, Array.prototype.slice, Object.prototype.hasOwnProperty,
  Array.isArray, JSON.parse, Math.max, String.prototype.charCodeAt, RegExp.prototype.test,
  Date.prototype.getTime, Number.prototype.toFixed];
let _ni = 0;
const missingKeys = new Set();
{
  const L2 = src.split(String.fromCharCode(10));
  for (let i = 0; i + 1 < L2.length; i++) {
    const m = /S\.push\("([^"]+)"\);/.exec(L2[i]);
    if (m && /M_GET\(A\[\d\], S\.pop\(\)\)/.test(L2[i + 1])) missingKeys.add(m[1]);
  }
}
const filled = [];
// Anti-tamper markers must stay ABSENT (their presence is what the program tests for),
// so never auto-fill them: that would fabricate a "tampered" verdict.
const DENY = new Set(['v_log', 'zh', 'onsol', 'node', 'executeUserEntryPoint', '__proto__',
  'domAutomation', 'domAutomationController', 'cdc_adoQpoasnfa76pfcZLmcfl_Array', 'callPhantom',
  'phantom', 'spawn', '__nightmare', '$chrome_', '$cdc_asdjflasutopfhvcZLmcfl_']);
for (const k of missingKeys) {
  if (DENY.has(k)) continue;
  if (!/^[A-Za-z_$][\w$]*$/.test(k)) continue;
  if (vm.runInContext('typeof ' + JSON.stringify(k).slice(1,-1), ctx) !== 'undefined') continue;
  ctx[k] = NATIVES[_ni++ % NATIVES.length]; filled.push(k);
}

// ---- pc trace ----
const seq = [];
const show = process.argv.includes('--trace');
const captured = [];   // (plain, key, chain-seed) at every entry=877 subcall
ctx.TRACE = (pc, A, l, S, F, n) => {
  seq.push(pc);
  if (seq.length > 400000) throw new Error('step cap');
  if (pc === 727 && S.length >= 2) {
    captured.push({ plain: String(S[S.length - 2]), key: String(S[S.length - 1]),
                    seed: ctx.__b.a3, out_slot: null });
  }
  if (show && n <= 500) {
    W(`pc=${pc} A=[${A.map((x) => typeof x === 'string' ? JSON.stringify(x.slice(0, 22)) : typeof x).join(', ')}] S=${S.length} F=${F}`);
  }
};

let err = null, res;
try {
  res = vm.runInContext(src + '\n;RUN([String.fromCharCode(50,51,54,99,50,48,48,48,49,48,48,48,56,48,48,48,52,48,48,48,56,48,48,48,56,48,48,48,56,56,48,48,56,48,48,48,56,48,48,48,56,48,48,48,52,48,48,48,54,55,49,51,98,52,49,48,55,50,98,56,52,52,57,101,55,57,50,102,55,52,56,50,50,53,49,55,50,97,55,57,122,51,101,102,97,48,97,102,98,98,102,51,50)], DEC_POOL);', ctx, { timeout: 25000 });
} catch (e) {
  err = String((e && e.stack) || e).split('\n').slice(0, 10).join('\n');
}

W('bootstrap: ' + boot);
W('auto-added globals: ' + added.join(' '));
W('native-filled: ' + filled.join(' '));
W('steps=' + seq.length + '  distinct pcs=' + new Set(seq).size);
W('pc path: ' + seq.join(' '));
const touched = {};
for (const m of misses) { const k = m.split('.')[0]; touched[k] = (touched[k] || 0) + 1; }
W('env gaps (auto-vivified) by root: ' + JSON.stringify(touched));
W('sample gaps: ' + [...new Set(misses)].slice(0, 25).join('  '));
try {
  const qh = vm.runInContext('typeof __c !== "undefined" && __c && __c.qh ? String(__c.qh) : null', ctx);
  if (qh) {
    const buf = Buffer.from(qh, 'binary');
    W('qh len=' + qh.length + ' bytes=' + buf.length + ' hex=' + buf.toString('hex'));
    fs.writeFileSync('.probe/qh-node-'+(/inner/.test(FILE)?'inner':'outer')+'.bin', buf);
  }
  W('ck=' + vm.runInContext('typeof __g!=="undefined"&&__g&&__g.ck?String(__g.ck).slice(0,140):null', ctx));
} catch (e) { W('state dump failed ' + e); }

// ---- independent recomputation of the XOR chain (ALGORITHM.md 11.5) ----
const KEY_A = '6a6cb1bb3970bae6', KEY_B = '44ae0b7a68bf0f7a';
const enc = (p, k, seed) => { let prev = seed, o = ''; for (let i = 0; i < p.length; i++) { prev = p.charCodeAt(i) ^ k.charCodeAt(i % k.length) ^ prev; o += String.fromCharCode(prev); } return o; };
const dec = (c, k, seed) => { let prev = seed, o = ''; for (let i = 0; i < c.length; i++) { const x = c.charCodeAt(i); o += String.fromCharCode(x ^ k.charCodeAt(i % k.length) ^ prev); prev = x; } return o; };
const LR = res && res.l ? res.l : [];
W('l[19]=' + JSON.stringify(LR[19]) + ' l[20].len=' + (LR[20] || '').length + ' l[22].len=' + (LR[22] || '').length);
W('locals: ' + (LR || []).map((v, i) => {
  if (v === undefined) return i + ':-';
  if (typeof v === 'function') return i + ':FN';
  if (typeof v === 'object') return i + ':' + (v === null ? 'null' : 'OBJ');
  return i + ':' + (String(v).length > 12 ? 'len' + String(v).length : JSON.stringify(String(v)));
}).join(' '));
W('string locals (hex): ' + (res && res.l ? res.l.map((v, i) =>
  (typeof v === 'string' && v.length > 3 ? 'l[' + i + ']=' + Buffer.from(v, 'utf8').toString('hex') + '(' + v.length + 'c)' : '')
).filter(Boolean).join(' ') : 'n/a'));
W('chain seeds read=' + JSON.stringify(seeds) + '  writes=' + JSON.stringify(writes));
const fp = vm.runInContext('__fp', ctx) || [];
W('l[22] hex=' + Buffer.from(String(LR[22]), 'binary').toString('hex') + '  typeof=' + typeof LR[22]);
W('fp md5 hex=' + Buffer.from(fp[0] ? fp[0].ret : '', 'binary').toString('hex'));
W('l[20] hex=' + Buffer.from(String(LR[20]), 'binary').toString('hex'));

const fp2 = fp;
W('fingerprint layer: ' + JSON.stringify(fp.map((r) => ({ src_len: r.src_len, ret: r.ret }))));
if (fp[0] && fp[0].ret && seeds[1] !== undefined) {
  const mine = enc(fp[0].ret, KEY_B, seeds[1]);
  const theirs = String(LR[22] || '').slice(-fp[0].ret.length);
  W('chain recheck(fp): ' + (mine === theirs ? 'PASS' : 'FAIL  mine=' + JSON.stringify(mine.slice(0, 24)) + ' theirs=' + JSON.stringify(theirs.slice(0, 24))));
}
if (LR[20] !== undefined && seeds.length) {
  const back = dec(String(LR[20]), KEY_A, seeds[0] | 0);
  W('l[20] decrypt(keyA,seed0) = ' + JSON.stringify(back.slice(0, 60)) +
    '  printable=' + /^[ -~]*$/.test(back));
}
W(err ? '!! ERROR\n' + err : 'RUN completed');

process.on('uncaughtException', (e) => { console.log('PCPATH:', (globalThis.__pcPath||[]).join(' ').slice(-300)); console.log('MISSES:', [...new Set(misses)].slice(-30).join(' | ')); });

process.on('exit', () => { try { fs.writeFileSync('.probe/sublog.json', JSON.stringify(ctx.__sublog || [])); } catch (e) {} });
