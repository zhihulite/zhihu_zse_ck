import vm from 'node:vm';
import fs from 'node:fs';
const P = (m) => { fs.writeSync(2, String(m) + String.fromCharCode(10)); };
process.on('exit', (c) => P('!!EXIT ' + c));
process.on('uncaughtException', (e) => P('!!UNCAUGHT ' + String(e && e.stack).slice(0, 300)));

const BASE = 'https://www.zhihu.com';
const PAGE = '/people/zhihuadmin/activities';
const UAH = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
let GLUE = process.env.GLUE || '.probe/eval-1-522094.js';
let META = process.env.META || 'A'.repeat(172);
if (process.env.FRESH) {
  const h = await (await fetch(BASE + PAGE, { headers: { 'user-agent': UAH, referer: BASE + '/', accept: 'text/html' } })).text();
  const meta = h.match(/id="zh-zse-ck"[^>]*content="([^"]*)"/)?.[1];
  const hash = h.match(/zse-ck\/v4\/([a-f0-9]+)\.js/)?.[1];
  if (!meta || !hash) { console.log('NO CHALLENGE', h.slice(0, 120)); process.exit(1); }
  const js = await (await fetch('https://static.zhihu.com/zse-ck/v4/' + hash + '.js', { headers: { 'user-agent': UAH } })).text();
  fs.writeFileSync('.probe/fresh-live.js', js);
  fs.writeFileSync('.probe/fresh-meta.txt', meta + '\n' + hash + '\n' + new Date().toISOString());
  GLUE = '.probe/fresh-live.js'; META = meta;
  fs.writeSync(2, 'FRESH meta=' + META.slice(0, 24) + '… len=' + META.length + ' hash=' + hash.slice(0, 12) + ' js=' + js.length + '\n');
}
const E = (k, d) => (process.env[k] === undefined ? d : process.env[k]);
const glue = fs.readFileSync(GLUE, 'utf8');

const reads = [];
const missing = new Set();
let recording = true;

function rec(path, val) {
  if (!recording) return val;
  reads.push(path);
  return val;
}

const TAGS = { doc: 'HTMLDocument', nav: 'Navigator', scr: 'Screen', loc: 'Location', perf: 'Performance', hist: 'History', ls: 'Storage', ss: 'Storage' };

function nativeLike(fn, label) {
  const src = `function ${label || fn.name || ''}() { [native code] }`;
  try { Object.defineProperty(fn, 'toString', { configurable: true, writable: true, value: () => src }); } catch {}
  return fn;
}

function mk(name, proto) {
  const tag = TAGS[name] || name;
  return new Proxy(proto, {
    get(t, p, r) {
      if (p === Symbol.toStringTag) return tag;
      if (p === 'toString') return () => `[object ${tag}]`;
      if (typeof p === 'symbol') return Reflect.get(t, p, r);
      const key = name + '.' + String(p);
      if (!(String(p) in t) && !(String(p) in Object.prototype)) missing.add(key);
      if (typeof t[p] === 'function') {
        const w = function (...a) { reads.push(key + '()'); return t[p].apply(t, a); };
        return nativeLike(w, String(p));
      }
      return rec(key, t[p]);
    },
    set(t, p, v) { reads.push(name + '.' + String(p) + ' <= ' + String(v).slice(0, 120)); t[p] = v; return true; },
    has(t, p) { return String(p) in t; },
    ownKeys(t) { return Reflect.ownKeys(t); },
  });
}

const store = { getItem: (k) => null, setItem: () => {}, removeItem: () => {}, clear: () => {}, length: 0, key: () => null };

const cookieJar = {};
const document = {
  cookie: '',
  title: 'z',
  URL: 'https://www.zhihu.com/people/zhihuadmin/activities',
  documentURI: 'https://www.zhihu.com/people/zhihuadmin/activities',
  referrer: 'https://www.zhihu.com/',
  domain: 'www.zhihu.com',
  location: null,
  readyState: 'complete',
  hidden: false,
  visibilityState: 'visible',
  characterSet: 'UTF-8',
  compatMode: 'CSS1Compat',
  all: [],
  getElementById: (id) => (id === 'zh-zse-ck' ? { id: 'zh-zse-ck', content: META, getAttribute: (a) => (a === 'content' ? META : null) } : null),
  getElementsByTagName: () => ({ getAttribute: () => META, 0: {} }),
  querySelector: (sel) => (sel.includes('data-assets-tracker-config') ? { toString: () => '[object HTMLScriptElement]' } : null),
  querySelectorAll: () => [],
  createElement: (tag) => ({ tagName: String(tag).toUpperCase(), style: {}, setAttribute: () => {}, appendChild: () => {}, getContext: () => null, toDataURL: () => '' }),
  createTextNode: () => ({}),
  addEventListener: () => {},
  removeEventListener: () => {},
  write: () => {},
  documentElement: { style: {}, clientWidth: 1280, clientHeight: 720, getAttribute: () => null },
  head: { appendChild: () => {} },
  body: { appendChild: () => {} },
  scripts: [],
  currentScript: {
    tagName: 'SCRIPT', nodeName: 'SCRIPT', localName: 'script', type: 'text/javascript',
    src: 'https://static.zhihu.com/zse-ck/v4/' + 'd9b132ce434c68ca9fb5516cae2eaea9c8927c38722b48008d89c1a9f0fcace2' + '.js',
    id: '', text: '', async: true, defer: false, crossOrigin: 'anonymous',
    getAttribute: (a) => (a === 'data-assets-tracker-config' ? '{"appName":"zse_ck","trackJSRuntimeError":true}' : a === 'src' ? 'https://static.zhihu.com/zse-ck/v4/d9b132ce434c68ca9fb5516cae2eaea9c8927c38722b48008d89c1a9f0fcace2.js' : null),
    hasAttribute: (a) => a === 'data-assets-tracker-config',
    toString: () => '[object HTMLScriptElement]',
  },
};
const navigator = {
  userAgent: E('UA', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'),
  platform: E('PLAT', 'Win32'), appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  appName: 'Netscape', appCodeName: 'Mozilla', product: 'Gecko', productSub: '20030108', vendor: E('VENDOR', 'Google Inc.'), vendorSub: '',
  language: E('LANG', 'zh-CN'), languages: E('LANGS', 'zh-CN,zh,en').split(','), onLine: true, cookieEnabled: true, doNotTrack: null, hardwareConcurrency: Number(E('HCPU', '8')),
  maxTouchPoints: 0, pdfViewerEnabled: true, webdriver: false, plugins: [], mimeTypes: [], connection: { effectiveType: '4g' },
  mediaDevices: {}, permissions: {}, credentials: {}, serviceWorker: {}, getBattery: () => Promise.resolve({}), javaEnabled: () => false,
};
const location = { href: document.URL, protocol: 'https:', host: 'www.zhihu.com', hostname: 'www.zhihu.com', pathname: '/people/zhihuadmin/activities', search: '', hash: '', origin: 'https://www.zhihu.com', reload: () => {}, replace: () => {}, assign: () => {}, toString: () => document.URL };
const screen = { width: Number(E('SW', '1920')), height: Number(E('SH', '1080')), availWidth: 1920, availHeight: 1040, colorDepth: 24, pixelDepth: 24, orientation: { type: 'landscape-primary', angle: 0 } };
const perf = { now: () => Number(process.hrtime.bigint() / 1000n) / 1000, timeOrigin: Date.now() - 800, memory: { usedJSHeapSize: 4e7, totalJSHeapSize: 8e7 } };
const history = { length: 2, pushState: () => {}, replaceState: () => {}, back: () => {}, state: null };

const ctx = vm.createContext({ console });
Object.assign(ctx, {
  window: null, self: null, top: null, parent: null, frames: [], frameElement: null,
  document: mk('doc', document), navigator: mk('nav', navigator), screen: mk('scr', screen),
  location: mk('loc', location), performance: mk('perf', perf), history: mk('hist', history),
  localStorage: mk('ls', store), sessionStorage: mk('ss', store), indexedDB: undefined,
  XMLHttpRequest: function () { return { open: () => {}, send: () => {}, setRequestHeader: () => {}, readyState: 0, status: 0 }; },
  fetch: () => Promise.reject(new Error('no fetch')),
  atob: (b64) => Buffer.from(b64, 'base64').toString('binary'),
  btoa: (bin) => Buffer.from(bin, 'binary').toString('base64'),
  setTimeout: (f, t) => setTimeout(f, Math.min(t || 0, 50)), setInterval: () => 0, clearInterval: () => {}, clearTimeout: () => {},
  requestAnimationFrame: (f) => setTimeout(f, 16), cancelAnimationFrame: () => {},
  addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
  Image: function () { return {}; }, Worker: undefined, Blob: undefined, URL: { createObjectURL: () => '' },
  crypto: { getRandomValues: (a) => { for (let i = 0; i < a.length; i++) a[i] = (i * 37 + 11) & 255; return a; }, subtle: {} },
  TextEncoder, TextDecoder,
  process: { exit: (c) => { P('CTX process.exit ' + c + ' << ' + new Error('x').stack.split('\n').slice(1, 8).join(' >> ')); }, on: () => {}, argv: [], env: {}, version: 'v25', platform: 'win32', nextTick: (f, ...a) => setTimeout(f, 0, ...a) },
});
vm.runInContext('window = globalThis; self = globalThis; top = window; parent = window; Object.defineProperty(globalThis, Symbol.toStringTag, { value: "Window", configurable: true });', ctx);
for (const k of ['XMLHttpRequest', 'Image', 'setTimeout', 'setInterval', 'requestAnimationFrame', 'atob', 'btoa', 'fetch']) {
  if (typeof ctx[k] === 'function') nativeLike(ctx[k], k);
}
ctx.console = { log: nativeLike(() => {}, 'log'), warn: nativeLike(() => {}, 'warn'), error: nativeLike(() => {}, 'error'), info: nativeLike(() => {}, 'info'), debug: nativeLike(() => {}, 'debug'), trace: nativeLike(() => {}, 'trace'), table: nativeLike(() => {}, 'table'), dir: nativeLike(() => {}, 'dir'), group: nativeLike(() => {}, 'group'), groupEnd: nativeLike(() => {}, 'groupEnd'), time: nativeLike(() => {}, 'time'), timeEnd: nativeLike(() => {}, 'timeEnd'), assert: nativeLike(() => {}, 'assert'), clear: nativeLike(() => {}, 'clear') };

// The wasm fetches `eval` as a global *property* and expects eval'd code to land in
// global scope (that is how `var __b = new BVM()` becomes reachable). Node's direct
// eval would keep it in the caller scope, so route the property through runInContext.
ctx.eval = function (src) {
  const s = String(src);
  P('CTX-EVAL len=' + s.length + ' head=' + JSON.stringify(s.slice(0, 40)));
  try { return vm.runInContext(s, ctx, { timeout: 30000 }); }
  catch (e) { P('CTX-EVAL THROW ' + String(e && e.message).slice(0, 160)); throw e; }
};
nativeLike(ctx.eval, 'eval');

// Optionally pre-load an already-recovered inner program (e.g. the 62,501-char
// layer that defines CVM) so the wasm's eval("CVM") lookup resolves.
if (process.env.PRELOAD) {
  for (const p of process.env.PRELOAD.split(',')) {
    const s = fs.readFileSync(p, 'utf8');
    try { vm.runInContext(s, ctx, { timeout: 20000 }); P('PRELOAD ok ' + p + ' len=' + s.length); }
    catch (e) { P('PRELOAD FAIL ' + p + ' ' + String(e && e.message).slice(0, 160)); }
  }
  P('PRELOAD GLOBALS ' + vm.runInContext('JSON.stringify({VM:typeof VM,BVM:typeof BVM,CVM:typeof CVM,_b:typeof __b,_c:typeof __c})', ctx));
}

// --- trace every syscall/js import the wasm makes ---
vm.runInContext(`
globalThis.__implog = [];
globalThis.__memrefs = null;
(function () {
  const W = WebAssembly;
  const oI = W.instantiate.bind(W);
  const enc = (v) => (typeof v === 'bigint' ? 'B' + v : typeof v === 'object' && v ? Object.prototype.toString.call(v) : String(v).slice(0, 60));
  function wrapImports(i) {
    const o = {};
    for (const m of Object.keys(i)) {
      o[m] = {};
      for (const n of Object.keys(i[m])) {
        const f = i[m][n];
        if (typeof f !== 'function') { o[m][n] = f; continue; }
        o[m][n] = function (...a) {
          if (globalThis.__implog.length < 6000) globalThis.__implog.push([m, n].concat(a.map(enc)));
          const r = f.apply(i[m], a);
          if (globalThis.__mem) {
            globalThis.__snaps = globalThis.__snaps || [];
            if (globalThis.__snaps.length < 300) {
              const dv = new DataView(globalThis.__mem.buffer);
              const fr = [];
              for (let k = 0x4CF90; k <= 0x4CFC4; k += 4) fr.push(dv.getUint32(k, true));
              let h = 0; const u = new Uint8Array(globalThis.__mem.buffer);
              for (let k = 0x11800; k < 0x11900; k += 7) h = (h * 31 + u[k]) >>> 0;
              globalThis.__snaps.push({ i: globalThis.__snaps.length, n: n.replace('syscall/js.', ''), frame: fr, pcrc: h, mem: u.length });
            }
          }
          if (/fd_write/.test(n) && globalThis.__mem) {
            const dv = new DataView(globalThis.__mem.buffer);
            const iovs = Number(a[1]) >>> 0, cnt = Number(a[2]) || 0;
            let out = '';
            for (let k = 0; k < cnt; k++) {
              const ptr = dv.getUint32(iovs + k * 8, true), len = dv.getUint32(iovs + k * 8 + 4, true);
              out += new TextDecoder().decode(new Uint8Array(globalThis.__mem.buffer, ptr, Math.min(len, 900)));
            }
            P('FD_WRITE fd=' + Number(a[0]) + ' :: ' + JSON.stringify(out.slice(0, 900)));
          }
          if (/copyBytesToGo/.test(n) && globalThis.__mem) {
            const dst = Number(a[4]) >>> 0, len = Number(a[5]) || 0;
            const u = new Uint8Array(globalThis.__mem.buffer);
            globalThis.__copies = globalThis.__copies || [];
            if (globalThis.__copies.length < 400) {
              let s = '';
              for (let k = 0; k < Math.min(len, 70); k++) { const c = u[dst + k]; s += c >= 32 && c < 127 ? String.fromCharCode(c) : '?'; }
              globalThis.__copies.push({ at: (globalThis.__implog || []).length, dst: dst, len: len, txt: s, args: a.map((x) => (typeof x === 'bigint' ? 'B' + (x - 9221120241336056832n) : String(x).slice(0, 12))) });
            }
          }
          return r;
        };
      }
    }
    return o;
  }
  Object.defineProperty(globalThis, 'WebAssembly', {
    configurable: true, writable: true,
    value: new Proxy(W, {
      get(t, p) {
        if (p === 'instantiate') return function (b, i) {
          globalThis.__impShape = Object.keys(i || {});
          const wrapped = wrapImports(i || {});
          globalThis.__wrappedImports = wrapped;
          return Promise.resolve(oI(b, wrapped)).then(function (r) {
            const inst = r.instance || r;
            globalThis.__mem = inst.exports && inst.exports.memory;
            globalThis.__exp = Object.keys(inst.exports || {});
            return r;
          });
        };
        return t[p];
      },
    }),
  });
})();
`, ctx);

// The jsvmp keeps its working state as arrays on the global __g. Logging every
// write into them recovers the cipher's data path (the fallback ck is still a
// real 128-char payload, so the encoder+cipher do execute here).
const glog = [];
const LIM = 400000;
const shortv = (v) => (typeof v === 'number' ? v : typeof v === 'string' ? (v.length > 40 ? v.slice(0, 40) + '…' : v) : (v && v.constructor ? v.constructor.name : typeof v));
const arrMemo = new WeakMap();
function wrapArr(arr, path) {
  if (arrMemo.has(arr)) return arrMemo.get(arr);
  const w = new Proxy(arr, {
    get(t, p, r) {
      const v = Reflect.get(t, p, r);
      if (typeof p === 'symbol' || p === 'length') return v;
      if (typeof v === 'function') return v;
      if (glog.length < LIM && typeof p === 'string' && /^\d+$/.test(p)) glog.push(['r', path + '.' + p, shortv(v)]);
      return v;
    },
    set(t, p, v) {
      if (glog.length < LIM) glog.push(['w', path + '.' + String(p), shortv(v)]);
      t[p] = v;
      return true;
    },
  });
  arrMemo.set(arr, w);
  return w;
}
function wrapG(obj) {
  const cache = new WeakMap();
  return new Proxy(obj, {
    get(t, p, r) {
      const v = Reflect.get(t, p, r);
      if (typeof v === 'function') return v;
      if (Array.isArray(v)) return wrapArr(v, '__g.' + String(p));
      if (glog.length < LIM && typeof p === 'string') glog.push(['G', '__g.' + p, shortv(v)]);
      return v;
    },
    set(t, p, v) {
      if (glog.length < LIM) glog.push(['w', '__g.' + String(p), shortv(v)]);
      if (String(p) === 'ck' && typeof v === 'string' && v.length > 100 && globalThis.__snap) globalThis.__snap(v);
      t[p] = v;
      return true;
    },
  });
}
ctx.__g = vm.runInContext('__g = globalThis.__g', ctx) || {};
vm.runInContext('globalThis.__g = globalThis.__g || {};', ctx);
ctx.__gRaw = ctx.__g;
Object.defineProperty(vm.runInContext('globalThis', ctx) || ctx, '__g', { configurable: true, get: () => ctx.__gW || ctx.__gRaw, set: (v) => { ctx.__gRaw = v; ctx.__gW = wrapG(v); } });
ctx.__gW = wrapG(ctx.__gRaw);
vm.runInContext('globalThis.__snap = null', ctx);
globalThisSnap = (v) => { try { const m = ctx.__mem || ctx.__memRaw; if (!m) { P('SNAP nomem ck=' + v.slice(0, 20)); return; } fs.writeFileSync('.probe/glr-mem-atck.bin', Buffer.from(new Uint8Array(m.buffer))); fs.writeFileSync('.probe/glr-ck-atck.txt', v); P('SNAP ok ck=' + v.slice(0, 24) + ' mem=' + m.buffer.byteLength); } catch (e) { P('SNAP fail ' + String(e).slice(0, 120)); } };
vm.runInContext('globalThis.__snap = (s) => __nodeSnap(s)', Object.assign(ctx, { __nodeSnap: globalThisSnap }));

process.on('unhandledRejection', (e) => console.log('UNHANDLED:', String(e && e.message).slice(0, 200)));

P('MARK before glue len '+glue.length);
try { vm.runInContext(glue, ctx, { timeout: 60000 }); P('MARK after glue'); }
catch (e) { P('GLUE THROW: ' + String(e && e.stack || e).split('\n').slice(0, 6).join(' >> ')); }

P('MARK scheduling report');
setTimeout(() => {
  P('MARK report fired');
  const g = ctx.__gRaw || ctx.__g;
  fs.writeFileSync('.probe/glr-glog.json', JSON.stringify(glog));
  P('GLOG ' + glog.length + ' entries');
  { const agg = {}; for (const e of glog) { const k = e[0] + ' ' + e[1].replace(/\.\d+$/,'.N'); agg[k] = (agg[k]||0)+1; } P('GLOG PATHS ' + JSON.stringify(Object.entries(agg).sort((a,b)=>b[1]-a[1]).slice(0,25))); }
  const out = { ck: typeof g.ck === 'string' ? g.ck : String(g.ck), ckLen: g.ck ? g.ck.length : 0, cookie: document.cookie, gKeys: Object.keys(g), reads: reads.length };
  fs.writeFileSync('.probe/glr-reads.json', JSON.stringify({ reads, missing: [...missing], gKeys: Object.keys(g), ck: out.ck, cookie: out.cookie }, null, 1));
  P('RESULT ' + JSON.stringify(out).slice(0, 500));
  P('MISSING(' + missing.size + '): ' + [...missing].slice(0, 60).join(' | '));
  const uniq = [...new Set(reads)];
  P('READS unique(' + uniq.length + '): ' + uniq.slice(0, 90).join(' | '));

  const log = ctx.__implog || [];
  fs.writeFileSync('.probe/glr-implog.json', JSON.stringify(log, null, 0));
  P('IMPORTLOG ' + log.length + ' entries grouped above');
  if (ctx.__wrappedImports) {
    const names = {};
    for (const m of Object.keys(ctx.__wrappedImports)) names[m] = Object.keys(ctx.__wrappedImports[m]);
    P('IMPORT NAMES ' + JSON.stringify(names));
  } else P('IMPORT NAMES none captured');
  const byName = {};
  for (const e of log) { const k = e[0] + '.' + e[1]; (byName[k] = byName[k] || []).push(e.slice(2)); }
  P('IMPORT NAME COUNTS: ' + Object.entries(byName).map(([k, v]) => k + ':' + v.length).join(' '));
  fs.writeFileSync('.probe/glr-imports-grouped.json', JSON.stringify(byName, null, 1));

  const gshape = {};
  for (const k of Object.keys(ctx.__g)) {
    const v = ctx.__g[k];
    gshape[k] = Array.isArray(v) ? 'arr[' + v.length + ']' + (v.length ? '{' + v.slice(0, 12).map((x) => (x && x.constructor ? x.constructor.name : typeof x)).join(',') + '}' : '')
      : (typeof v === 'function' ? 'fn/' + v.length : typeof v === 'object' && v ? 'obj:' + Object.keys(v).slice(0, 8).join(',') : String(v).slice(0, 60));
  }
  P('G SHAPE ' + JSON.stringify(gshape).slice(0, 1800));
  const arrays = {};
  for (const k of Object.keys(ctx.__g)) { const v = ctx.__g[k]; if (Array.isArray(v)) arrays[k] = v.slice(0, 80); }
  fs.writeFileSync('.probe/glr-arrays.json', JSON.stringify(arrays, null, 1));
  P('ARRAYS ' + Object.entries(arrays).map(([k, v]) => k + '=' + JSON.stringify(v).slice(0, 260)).join('\n  '));

  P('GLOBALS ' + JSON.stringify(vm.runInContext('JSON.stringify({VM:typeof window.VM,BVM:typeof window.BVM,CVM:typeof window.CVM,_b:typeof window.__b,_c:typeof window.__c,_g:typeof window.__g,sc:typeof window.sc,z:typeof window.z,_0oO:Object.keys(window).filter(function(k){return /^_(|g|b|c|d)$/.test(k)}).slice(0,12)})', ctx)));
  P('COPIES ' + JSON.stringify(ctx.__copies || []).slice(0, 4000));
  fs.writeFileSync('.probe/glr-copies.json', JSON.stringify(ctx.__copies || [], null, 1));

  fs.writeFileSync('.probe/glr-snaps.json', JSON.stringify(ctx.__snaps || [], null, 1));
  P('SNAPS ' + (ctx.__snaps || []).length + ' last=' + JSON.stringify((ctx.__snaps || []).slice(-3)));

  if (ctx.__mem) {
    try {
      const buf = Buffer.from(new Uint8Array(ctx.__mem.buffer));
      fs.writeFileSync('.probe/glr-mem.bin', buf);
      P('MEM DUMP ' + buf.length + ' bytes -> .probe/glr-mem.bin');
    } catch (e) { P('MEMDUMP FAIL ' + String(e).slice(0, 120)); }
  } else P('NO MEM CAPTURED');
}, 4000);
