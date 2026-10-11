// payload runner v6: run the ORIGINAL third interpreter (eval-93) in the mock env.
// eval-93 self-ends with  var __c=new CVM();__c['H'](251,'<blob>');  -- we patch that
// tail into a deferred boot so we can wrap H (all subcalls, incl. internal H(251,...)
// loader calls) and log every environment read/write.  Swallowed interpreter exceptions
// are re-logged via a source patch of  catch(_0xXXXX){return;} .
// Run: node .probe/_scratch/payloadrun6.mjs
import vm from 'node:vm';
import fs from 'node:fs';
import { webcrypto } from 'node:crypto';

const W = (m) => process.stderr.write(String(m) + '\n');
const misses = [];
const envLog = [];   // every localStorage/__b/__g/crypto read-write with values

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
      if (p === Symbol.toPrimitive) return (h) => (h === 'number' ? NaN : '[object ' + name + ']');
      if (typeof p === 'symbol') return Reflect.get(t, p, r);
      if (p === 'valueOf') return () => 0;          // primitive, like real host objects
      if (p === 'toString') return () => '[object ' + name + ']';
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

const ctx = vm.createContext({ console, atob, btoa });
ctx.__sublog = []; ctx.__vmErrs = []; ctx.__envLog = envLog;

// ---- real-behaviour localStorage (Storage semantics) with access logging ----
const _lsStore = {};
const lsMisses = new Set();
const localStorageObj = {
  getItem: (k) => { envLog.push(['ls.get', String(k), Object.prototype.hasOwnProperty.call(_lsStore, String(k)) ? _lsStore[String(k)] : null]); return Object.prototype.hasOwnProperty.call(_lsStore, String(k)) ? _lsStore[String(k)] : null; },
  setItem: (k, v) => { envLog.push(['ls.set', String(k), String(v).slice(0, 200)]); _lsStore[String(k)] = String(v); },
  removeItem: (k) => { envLog.push(['ls.del', String(k)]); delete _lsStore[String(k)]; },
  key: (i) => Object.keys(_lsStore)[i] ?? null,
  clear: () => { for (const k of Object.keys(_lsStore)) delete _lsStore[k]; },
  get length() { return Object.keys(_lsStore).length; },
};
const localStorage = new Proxy(localStorageObj, {
  get(t, p, r) {
    if (typeof p !== 'symbol' && !(p in t)) { lsMisses.add(String(p)); envLog.push(['ls.miss', String(p)]); }
    const v = Reflect.get(t, p, r);
    return typeof v === 'function' ? v.bind(t) : v;
  },
  set(t, p, v) { t[p] = v; return true; },
});

function logStateObj(objName) {
  return new Proxy({ __name: objName }, {
    get(t, p, r) {
      if (typeof p === 'symbol' || p === '__name') return Reflect.get(t, p, r);
      const v = Reflect.get(t, p, r);
      envLog.push(['rd', objName + '.' + String(p), typeof v === 'string' ? v.slice(0, 120) : typeof v === 'object' && v !== null ? JSON.stringify(v).slice(0, 120) : String(v)]);
      return v;
    },
    set(t, p, v) {
      if (typeof p !== 'symbol') envLog.push(['wr', objName + '.' + String(p), typeof v === 'string' ? v.slice(0, 120) : String(v)]);
      t[p] = v; return true;
    },
    has(t, p) { envLog.push(['has', objName + '.' + String(p)]); return String(p) in t; },
  });
}

Object.assign(ctx, {
  document: doc, navigator: nav, localStorage,
  screen: permissive('screen', { width: 1920, height: 1080, availWidth: 1920, availHeight: 1040, colorDepth: 24, pixelDepth: 24, availLeft: 0, availTop: 0 }),
  location: permissive('location', {
    href: 'https://www.zhihu.com/people/zhihuadmin/activities', protocol: 'https:', host: 'www.zhihu.com',
    hostname: 'www.zhihu.com', pathname: '/people/zhihuadmin/activities', search: '', hash: '',
    reload: () => {}, replace: () => {}, assign: () => {}, toString: () => 'https://www.zhihu.com/people/zhihuadmin/activities',
  }),
  history: permissive('history', { length: 1, pushState: () => {}, replaceState: () => {} }),
  performance: permissive('performance', { now: () => 12.5, timeOrigin: 1759400000000 - 900 }),
  sessionStorage: permissive('sessionStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {}, length: 0 }),
  setTimeout: (f) => { try { f(); } catch (e) { W('timer threw ' + e); } return 0; },
  setInterval: () => 0, clearTimeout: () => {}, clearInterval: () => {},
  addEventListener: () => {}, removeEventListener: () => {},
  URL: URL,   // real WHATWG URL -- the program does `new URL('https://www.zhihu.com')`
  URL: URL,   // real WHATWG URL -- the program does `new URL('https://www.zhihu.com')`
  URL: URL,   // real WHATWG URL -- the program does `new URL('https://www.zhihu.com')`
  URL: URL,   // real WHATWG URL -- the program does `new URL('https://www.zhihu.com')`
  URL: URL,   // real WHATWG URL -- the program does `new URL('https://www.zhihu.com')`
  URL: URL,   // real WHATWG URL -- the program does `new URL('https://www.zhihu.com')`
  URL: URL,   // real WHATWG URL -- the program does `new URL('https://www.zhihu.com')`
  URL: URL,   // real WHATWG URL -- the program does `new URL('https://www.zhihu.com')`
  URL: URL,   // real WHATWG URL -- the program does `new URL('https://www.zhihu.com')`
  URL: URL,   // real WHATWG URL -- the program does `new URL('https://www.zhihu.com')`
  crypto: new Proxy(webcrypto, {   // real webcrypto; log getRandomValues sizes
    get(t, p, r) {
      const v = Reflect.get(t, p, r);
      if (p === 'getRandomValues' && typeof v === 'function') {
        return (arr) => { envLog.push(['crypto.getRandomValues', arr && arr.constructor.name, arr && arr.length]); return v.call(t, arr); };
      }
      envLog.push(['crypto.' + String(p)]);
      return typeof v === 'function' ? v.bind(t) : v;
    },
  }),
});
for (const g of ['Worker', 'Blob', 'XMLHttpRequest', 'MutationObserver', 'Image',
  'SharedWorker', 'RTCPeerConnection', 'AudioContext', 'OfflineAudioContext', 'Element',
  'Node', 'Range', 'NodeIterator', 'Text', 'Event', 'HTMLElement', 'CSS', 'Intl',
  'WebGLRenderingContext', 'MediaSource', 'customElements']) {
  ctx[g] = auto(g);
}
// real Chrome HAS these interfaces; the probes do `new Document().all()` which must
// THROW (all is undefined) like in a browser -- so a bare class, not an auto-mock.
ctx.Document = class Document {};
ctx.HTMLAllCollection = function HTMLAllCollection() {};
// real Chrome HAS these interfaces; the probes do `new Document().all()` which must
// THROW (all is undefined) like in a browser -- so a bare class, not an auto-mock.
ctx.Document = class Document {};
ctx.HTMLAllCollection = function HTMLAllCollection() {};
// real Chrome HAS these interfaces; the probes do `new Document().all()` which must
// THROW (all is undefined) like in a browser -- so a bare class, not an auto-mock.
ctx.Document = class Document {};
ctx.HTMLAllCollection = function HTMLAllCollection() {};
// real Chrome HAS these interfaces; the probes do `new Document().all()` which must
// THROW (all is undefined) like in a browser -- so a bare class, not an auto-mock.
ctx.Document = class Document {};
ctx.HTMLAllCollection = function HTMLAllCollection() {};
// real Chrome HAS these interfaces; the probes do `new Document().all()` which must
// THROW (all is undefined) like in a browser -- so a bare class, not an auto-mock.
ctx.Document = class Document {};
ctx.HTMLAllCollection = function HTMLAllCollection() {};
// real Chrome HAS these interfaces; the probes do `new Document().all()` which must
// THROW (all is undefined) like in a browser -- so a bare class, not an auto-mock.
ctx.Document = class Document {};
ctx.HTMLAllCollection = function HTMLAllCollection() {};
// real Chrome HAS these interfaces; the probes do `new Document().all()` which must
// THROW (all is undefined) like in a browser -- so a bare class, not an auto-mock.
ctx.Document = class Document {};
ctx.HTMLAllCollection = function HTMLAllCollection() {};
// real Chrome HAS these interfaces; the probes do `new Document().all()` which must
// THROW (all is undefined) like in a browser -- so a bare class, not an auto-mock.
ctx.Document = class Document {};
ctx.HTMLAllCollection = function HTMLAllCollection() {};
// real Chrome HAS these interfaces; the probes do `new Document().all()` which must
// THROW (all is undefined) like in a browser -- so a bare class, not an auto-mock.
ctx.Document = class Document {};
ctx.HTMLAllCollection = function HTMLAllCollection() {};
// real Chrome HAS these interfaces; the probes do `new Document().all()` which must
// THROW (all is undefined) like in a browser -- so a bare class, not an auto-mock.
ctx.Document = class Document {};
ctx.HTMLAllCollection = function HTMLAllCollection() {};
ctx.__b = logStateObj('__b'); ctx.__g = logStateObj('__g');
// real page had __b.a3 as a string chain-state; keep it writable through the logging proxy
ctx.__b.a3 = '114';

const stubGets = [];
const mkColl = (els) => { const a = els.slice(); a.toString = () => '[object HTMLCollection]'; a.item = (i) => a[i]; a.namedItem = () => null; return a; };
const mkEl = (tag) => {
  const el = {
    tagName: String(tag).toUpperCase(), style: {}, parentNode: null,
    offsetWidth: 10, offsetHeight: 20,
    appendChild(c) { c.parentNode = el; return c; },
    removeChild(c) { if (c.parentNode === el) c.parentNode = null; return c; },
    toDataURL: () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    outerHTML: '<canvas width="240" height="60"></canvas>',
    getAttribute: () => null, setAttribute: () => {}, bind: () => el,
    getElementsByTagName: (t2) => mkColl([mkEl(String(t2))]),
    getBoundingClientRect: () => ({}),
  };
  el.toString = () => '[object HTML' + el.tagName.charAt(0) + el.tagName.slice(1).toLowerCase() + 'Element]';
  el.getContext = (t2) => {
    if (t2 === '2d') {
      const store2 = {};
      return new Proxy({}, {
        get(t3, p3) { if (p3 in store2) return store2[p3]; return (...a) => undefined; },
        set(t3, p3, v) { store2[p3] = v; return true; },
      });
    }
    return null;
  };
  return el;
};
const htmlEl = mkEl('HTML'); htmlEl.toString = () => '[object HTMLHtmlElement]';
const bodyEl = mkEl('BODY'); bodyEl.toString = () => '[object HTMLBodyElement]';
const stubDoc = new Proxy(function () {}, {
  get(t, p) {
    stubGets.push('document.' + String(p));
    if (p === 'URL' || p === 'documentURI' || p === 'baseURI') return 'https://www.zhihu.com/people/zhihuadmin/activities';
    if (p === 'domain') return 'www.zhihu.com';
    if (p === 'charset') return 'UTF-8';
    if (p === 'documentElement') return htmlEl;
    if (p === 'body') return bodyEl;
    if (p === 'all') { const arr = Array.from({ length: 137 }, (_, i2) => mkEl(['HTML', 'HEAD', 'BODY', 'DIV', 'SCRIPT', 'A', 'P', 'SPAN', 'TITLE', 'META', 'LINK', 'STYLE', 'UL', 'LI'][i2 % 14])); arr.getElementsByTagName = (t2) => [t2 === 'script' ? mkEl('SCRIPT') : mkEl(String(t2).toUpperCase())]; arr.toString = () => '[object HTMLAllCollection]'; return arr; }
    if (p === 'getElementsByTagName') return (t2) => [t2 === 'html' ? htmlEl : mkEl(String(t2).toUpperCase())];
    if (p === 'createElement') return (t2) => mkEl(String(t2).toUpperCase());
    if (p === 'createNodeIterator' || p === 'createRange') return () => ({ toString: () => '[object Object]', cloneRange() { return this; }, cloneContents() { return this; }, collapse() {}, selectNode() {}, selectNodeContents() {}, extractContents() { return this; }, getBoundingClientRect() { return {}; }, getClientRects() { return []; }, insertNode() {}, intersectsNode() { return false; }, isPointInRange() { return false; }, compareBoundaryPoints() { return 0; }, commonAncestorContainer: bodyEl, endOffset: 0, startContainer: bodyEl, startOffset: 0, collapsed: false, detach() {}, whatToShow: 0, filter: undefined, root: bodyEl });
    if (typeof p === 'string' && p.length > 12 && /[;=(){}]/.test(p)) { try { return new Function(p); } catch (e) { return undefined; } }
    return undefined;
  },
  set(t, p, v) { return true; },
});
// Chrome-window members the probes read; functions are bound no-ops so
// Function.prototype.toString reports '[native code]' exactly like a browser.
const WIN_FNS = new Set(['stop', 'open', 'print', 'blur', 'focus', 'close', 'alert',
  'prompt', 'confirm', 'getSelection', 'requestAnimationFrame', 'cancelAnimationFrame',
  'getComputedStyle', 'matchMedia', 'scrollTo', 'scrollBy', 'scroll', 'postMessage']);
const WIN_VALS = { devicePixelRatio: 1, innerWidth: 1280, innerHeight: 720, outerWidth: 1382, outerHeight: 760 };
const stubWin = new Proxy(function () {}, {
  get(t, p) {
    stubGets.push('window.' + String(p));
    if (p === 'v_log') return undefined;
    if (p === 'eval') {
      return (code) => {
        code = String(code);
        // the inner program evals the 62.5K payload-layer source; redirect THAT to the
        // devirtualized payload program so we get pc-level TRACE visibility.
        if (code.length > 40000) return runPayloadDevirt('via inner eval');
        return vm.runInContext(code, ctx);
      };
    }
    if (typeof p === 'string') {
      if (WIN_FNS.has(p)) { const f = function () {}; const b = f.bind(null); return b; }
      if (p in WIN_VALS) return WIN_VALS[p];
      try { const v = ctx[p]; if (v !== undefined) return v; } catch (e) {}
    }
    return undefined;
  },
  has(t, p) {
    // the outer program's accessor box does `'Function' in window` -- answer from ctx;
    // anti-tamper markers stay absent because ctx lacks them.
    if (typeof p !== 'string') return false;
    try { return ctx[p] !== undefined; } catch (e) { return false; }
  },
  set(t, p, v) { return true; },
});

// ---- devirtualized payload runner (same 2312-word program, pc-traceable) ----
const payloadDevirtFull = fs.readFileSync('js/payload.cvm.js', 'utf8');
const payloadDevirtSrc = payloadDevirtFull.slice(0, payloadDevirtFull.indexOf('if (typeof module'));
const payPath = [];
const payLast = [];
function runPayloadDevirt(via) {
  payPath.length = 0; payLast.length = 0;
  ctx.TRACE = (pc, A, l, S, F, n) => {
    payPath.push(pc);
    if (payPath.length > 5000) payPath.shift();
    payLast.push({ pc, n,
      a: A.map((x) => typeof x === 'string' ? 's:' + x.length + ':' + x.slice(0, 20) : typeof x === 'function' ? 'FN' : String(x).slice(0, 20)),
      l01: [l[0], l[1]].map((x) => typeof x === 'string' ? 's:' + x.length + ':' + x.slice(0, 20) : String(x).slice(0, 20)),
      s: S.length, top: S.length ? (typeof S[S.length - 1] === 'string' ? 's:' + S[S.length - 1].length : String(S[S.length - 1]).slice(0, 24)) : '-' });
    if (payLast.length > 10) payLast.shift();
  };
  try {
    // wrap in an IIFE: the inner devirt shares this vm context and both declare
    // SRC0/DEC_POOL as top-level consts.
    const r = vm.runInContext('(function(){' + payloadDevirtSrc + '\n;return RUN([], DEC_POOL);})()', ctx, { timeout: 60000 });
    W('payload devirt run (' + via + '): completed. pc steps=' + payPath.length);
    W('payload distinct pcs: ' + [...new Set(payPath)].sort((a, b) => a - b).join(' '));
    return r;
  } catch (e) {
    W('payload devirt run (' + via + ') THREW: ' + (e && e.message));
    W('  pc tail: ' + payPath.slice(-50).join(' '));
    for (const st of payLast) W('   pc=' + st.pc + ' n=' + st.n + ' S=' + st.s + ' top=' + st.top + ' l01=[' + st.l01.join(', ') + '] A=[' + st.a.join(', ') + ']');
    const sl = vm.runInContext('typeof __sublog !== "undefined" ? __sublog.slice(-6) : []', ctx) || [];
    W('  subcalls (last): ' + JSON.stringify(sl));
    return undefined;
  } finally {
    ctx.TRACE = undefined;
  }
}
for (const gname of ['window', 'document', 'self', 'top', 'parent']) {
  try { Object.defineProperty(ctx, gname, { configurable: true, get() { return gname === 'document' ? stubDoc : stubWin; }, set(v) {} }); } catch (e) {}
}

// anti-simulation: browser-shaped Error().stack (the program greps it for 'node')
vm.runInContext(`(function(){
  const Real = Error, STACK = "Error\\n    at https://static.zhihu.com/zse-ck/v4/build.js:1:1\\n    at https://static.zhihu.com/people:2:3";
  function FakeError(m){ const e = new Real(m); Object.defineProperty(e, "stack", { value: STACK, configurable: true }); return e; }
  FakeError.prototype = Real.prototype;
  Error = FakeError; globalThis.Error = FakeError;
})();`, ctx);
vm.runInContext('window = globalThis; self = globalThis; top = window; parent = window;', ctx);

// big new Function sources = the embedded probe/fingerprint snippets
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

// ---- load eval-93 with (a) swallowed-catch logging, (b) deferred boot ----
// The real page exposes VM/BVM/CVM as globals (the anti-tamper gauntlet inspects
// BVM.toString().length) -- load the captured bootstrap before any layer runs.
try {
  vm.runInContext(fs.readFileSync('.probe/live-fns.bootstrap.js', 'utf8'), ctx, { timeout: 15000 });
  W('live-fns bootstrap: ' + vm.runInContext(
    "['VM','BVM','CVM'].map(n=>n+'='+typeof eval(n)+'/'+eval(n).toString().length).join(' ')", ctx));
} catch (e) { W('bootstrap fail: ' + e.message); }

let src = fs.readFileSync('.probe/eval-93-62501.js', 'utf8');
src = src.replace(/catch\((_0x[0-9a-f]+)\)\{return;\}/g,
  'catch($1){globalThis.__vmErrs.push("swallowed: "+($1&&$1.message||$1));return;}');
const bootRe = /var __c=new CVM\(\);__c\['H'\]\(([^;]*)\);/;
const bm = bootRe.exec(src);
let bootPc = null, bootBlob = null;
if (!bm) {
  W('!! boot pattern NOT found -- tail call layout changed');
} else {
  const parts = bm[1].split(',');
  bootPc = vm.runInContext('(' + parts[0] + ')', ctx);
  bootBlob = parts.slice(1).join(',').trim().replace(/^'/, '').replace(/'$/, '');
  src = src.replace(bootRe, 'var __c=new CVM();globalThis.__cRef=__c;');
  W('boot: pc=' + bootPc + ' blob=' + bootBlob.length + ' chars');
}

try {
  vm.runInContext(src, ctx, { timeout: 30000 });
} catch (e) {
  W('EVAL-93 threw: ' + (e && e.message || e) + '\n  at ' + String(e && e.stack || '').split('\n')[1]);
}

// ---- wrap H on the instance, then boot ----
// The payload program requires __b.zh to be defined (typeof check).  The INNER 942-word
// program is what writes it (masks -> keyC XOR -> accumulated string).  Run the inner
// devirtualized program in the same context first, exactly as the real page order does.
// The OUTER 950-word program runs FIRST in the real page (driver: __g = new VM(); __g.N(251, blob)).
const outerFull = fs.readFileSync('js/cvm.decompiled.js', 'utf8');
const outerSrc = outerFull.slice(0, outerFull.indexOf('if (typeof module'))
  .replace(/typeof TRACE === 'function'/g, "typeof TRACE3 === 'function'")
  .replace(/TRACE\(pc, A, l, S, F, \+\+_n\)/g, 'TRACE3(pc, A, l, S, F, ++_n)');
const outerPath = [];
try {
  ctx.TRACE3 = (pc) => { outerPath.push(pc); if (outerPath.length > 5000) outerPath.shift(); };
  vm.runInContext(outerSrc + '\n;RUN([], DEC_POOL)', ctx, { timeout: 30000 });
  W('outer run: done. distinct pcs=' + [...new Set(outerPath)].sort((a, b) => a - b).join(' '));
} catch (e) {
  W('OUTER threw: ' + (e && e.message) + '  pc tail: ' + outerPath.slice(-30).join(' '));
} finally {
  ctx.TRACE3 = undefined;
}

const innerFull = fs.readFileSync('js/inner.decompiled.js', 'utf8');
const innerSrc = innerFull.slice(0, innerFull.indexOf('if (typeof module'))
  // keep the inner trace independent from the payload runner's ctx.TRACE
  .replace(/typeof TRACE === 'function'/g, "typeof TRACE2 === 'function'")
  .replace(/TRACE\(pc, A, l, S, F, \+\+_n\)/g, 'TRACE2(pc, A, l, S, F, ++_n)');
const innerPath = [];
const innerLast = [];
ctx.TRACE2 = (pc, A, l, S, F, n) => {
  innerPath.push(pc);
  if (innerPath.length > 3000) innerPath.shift();
  innerLast.push({ pc, n,
    a: A.map((x) => typeof x === 'string' ? 's:' + x.length + ':' + x.slice(0, 24) : typeof x === 'function' ? 'FN' : String(x).slice(0, 24)),
    s: S.length, top: S.length ? (typeof S[S.length - 1] === 'string' ? 's:' + S[S.length - 1].length : String(S[S.length - 1]).slice(0, 30)) : '-' });
  if (innerLast.length > 12) innerLast.shift();
};
ctx.TRACE_LAST = () => null;
ctx.TRACE_LAST = () => null;
ctx.TRACE_LAST = () => null;
ctx.TRACE_LAST = () => null;
ctx.TRACE_LAST = () => null;
ctx.TRACE_LAST = () => null;
ctx.TRACE_LAST = () => null;
ctx.TRACE_LAST = () => null;
ctx.TRACE_LAST = () => null;
try {
  const r = vm.runInContext(innerSrc + '\n;RUN([], DEC_POOL)', ctx, { timeout: 30000 });
  W('inner run: done.  __b.zh=' + JSON.stringify(vm.runInContext('String(__b.zh)', ctx))
    + '  __b.a3=' + vm.runInContext('String(__b.a3)', ctx));
} catch (e) {
  W('INNER threw: ' + (e && e.message) + '\n  ' + String(e && e.stack || '').split('\n').slice(1, 3).join(' | '));
  W('  inner pc tail: ' + innerPath.slice(-40).join(' '));
  for (const st of innerLast) W('   pc=' + st.pc + ' n=' + st.n + ' S=' + st.s + ' top=' + st.top + ' A=[' + st.a.join(', ') + ']');
  const sl = vm.runInContext('typeof __sublog !== "undefined" ? __sublog.slice(-8) : []', ctx) || [];
  W('  inner subcalls (last ' + sl.length + '): ' + JSON.stringify(sl));
  ctx.TRACE2 = undefined;
}

const boot = vm.runInContext(`
  (function(){
    if (!globalThis.__cRef) return 'NO __cRef';
    const realH = __cRef.H;
    __cRef.__calls = [];
    __cRef.H = function(pc){
      const rest = Array.prototype.slice.call(arguments, 1);
      const rec = { pc: pc, nargs: rest.length,
                    args: rest.map(a => typeof a === 'string' ? 's:' + a.length : Array.isArray(a) ? 'arr:' + a.length : typeof a) };
      this.__calls.push(rec);
      if (this.__calls.length > 200000) throw new Error('subcall cap');
      return realH.apply(this, arguments);
    };
    try {
      const r = realH.call(__cRef, BOOT_PC, BOOT_BLOB);
      return 'BOOT OK  returns=' + (typeof r) + '  subcalls=' + __cRef.__calls.length;
    } catch (e) {
      return 'BOOT THREW: ' + (e && e.message);
    }
  })()
`.replace('BOOT_PC', JSON.stringify(bootPc)).replace('BOOT_BLOB', JSON.stringify(bootBlob)), ctx, { timeout: 120000 });
W('bootstrap: ' + boot);

const calls = (vm.runInContext('typeof __cRef !== "undefined" && __cRef ? __cRef.__calls : []', ctx)) || [];
W('subcall trace (' + calls.length + '):');
for (const c of calls.slice(0, 60)) W('  H(pc=' + c.pc + ') nargs=' + c.nargs + ' [' + c.args.join(', ') + ']');
if (calls.length > 60) W('  ... +' + (calls.length - 60) + ' more');

const errs = vm.runInContext('typeof __vmErrs !== "undefined" ? __vmErrs : []', ctx) || [];
W('swallowed errors (' + errs.length + '):');
for (const e of [...new Set(errs)].slice(0, 20)) W('  ' + e);

W('env log (' + envLog.length + '):');
for (const [k, ...v] of envLog.slice(0, 120)) W('  ' + k + ' ' + v.map(x => String(x).slice(0, 110)).join(' | '));

W('ls misses: ' + [...lsMisses].join(' '));
W('stub gets: ' + JSON.stringify([...new Set(stubGets)]));
const touched = {};
for (const m of misses) { const k = m.split('.')[0]; touched[k] = (touched[k] || 0) + 1; }
W('env gaps (auto-vivified) by root: ' + JSON.stringify(touched));
W('sample gaps: ' + [...new Set(misses)].slice(0, 40).join('  '));

// ---- results ----
try {
  W('localStorage dump: ' + JSON.stringify(_lsStore).slice(0, 400));
  W('ck=' + vm.runInContext('typeof __g!=="undefined"&&__g&&__g.ck?String(__g.ck):null', ctx));
  W('__b.a3=' + vm.runInContext('__b ? String(__b.a3) : null', ctx));
  const fp = vm.runInContext('__fp', ctx) || [];
  W('fp layer: ' + JSON.stringify(fp.map((r) => ({ src_len: r.src_len, ret: String(r.ret).slice(0, 80) }))));
  // any 005_ token produced anywhere in the context
  W('token scan: ' + vm.runInContext(`
    (function(){
      const hits = [];
      try { for (const k of Object.keys(localStorage)) if (/005_/.test(String(localStorage.getItem(k)))) hits.push('ls:' + k); } catch (e) {}
      try { if (__g && __g.ck && /005_/.test(__g.ck)) hits.push('__g.ck'); } catch (e) {}
      return hits.join(',') || 'none';
    })()
  `, ctx));
} catch (e) { W('state dump failed ' + e); }

process.on('exit', () => {
  try { fs.writeFileSync('.probe/payloadrun6-envlog.json', JSON.stringify({ envLog, misses: [...new Set(misses)], stubGets: [...new Set(stubGets)], calls }, null, 1)); } catch (e) {}
});
