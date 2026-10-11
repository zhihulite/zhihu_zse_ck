// Full-protocol tracer: run the challenge JS in Node with a hand-built env,
// log every wasm import call with decoded ref -> JS value, so the host side of
// the protocol can be re-implemented in Python.
import fs from 'node:fs';
const P = (m) => fs.writeSync(2, String(m) + '\n');
process.on('exit', (c) => P('!!EXIT ' + c));
process.on('uncaughtException', (e) => P('!!UNCAUGHT ' + String(e && e.stack).slice(0, 400)));
process.on('unhandledRejection', (e) => P('!!UNHANDLED ' + String(e && e.stack).slice(0, 400)));

const BASE = 'https://www.zhihu.com';
const PAGE = '/people/zhihuadmin/activities';
const UAH = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let META = 'A'.repeat(172), JS = null, HASH = '';
if (process.env.FRESH) {
  const h = await (await fetch(BASE + PAGE, { headers: { 'user-agent': UAH, referer: BASE + '/', accept: 'text/html' } })).text();
  META = h.match(/id="zh-zse-ck"[^>]*content="([^"]*)"/)?.[1];
  HASH = h.match(/zse-ck\/v4\/([a-f0-9]+)\.js/)?.[1];
  JS = await (await fetch('https://static.zhihu.com/zse-ck/v4/' + HASH + '.js', { headers: { 'user-agent': UAH } })).text();
  fs.writeFileSync('.probe/tg-live.js', JS);
  fs.writeFileSync('.probe/tg-meta.txt', META + '\n' + HASH + '\n');
  P('FRESH hash=' + HASH.slice(0, 12) + ' js=' + JS.length + ' meta=' + META.slice(0, 16) + '…');
} else {
  JS = fs.readFileSync(process.env.JS || '.probe/tg-live.js', 'utf8');
  const mt = fs.readFileSync('.probe/tg-meta.txt', 'utf8').split('\n');
  META = process.env.META || mt[0]; HASH = mt[1] || '';
  P('CACHED hash=' + HASH.slice(0, 12) + ' js=' + JS.length);
}

import vm from 'node:vm';
const log = [];
const LIM = 20000;
let recording = true;

// ---------------- environment (same as glue-node.mjs) ----------------
const TAGS = { doc: 'HTMLDocument', nav: 'Navigator', scr: 'Screen', loc: 'Location', perf: 'Performance', hist: 'History', ls: 'Storage', ss: 'Storage' };
function nativeLike(fn, label) {
  const s = `function ${label || fn.name || ''}() { [native code] }`;
  try { Object.defineProperty(fn, 'toString', { configurable: true, writable: true, value: () => s }); } catch {}
  return fn;
}
function mk(name, proto) {
  const tag = TAGS[name] || name;
  return new Proxy(proto, {
    get(t, p, r) {
      if (p === Symbol.toStringTag) return tag;
      if (p === 'toString') return () => `[object ${tag}]`;
      if (typeof p === 'symbol') return Reflect.get(t, p, r);
      if (typeof t[p] === 'function') { const w = function (...a) { return t[p].apply(t, a); }; return nativeLike(w, String(p)); }
      return Reflect.get(t, p, r);
    },
    set(t, p, v) { t[p] = v; return true; },
    has(t, p) { return String(p) in t; },
  });
}
const store = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {}, length: 0, key: () => null };
const cookieJar = { v: '' };
const document = {
  get cookie() { return this._ck || ''; },
  set cookie(v) { this._ck = String(v); if (String(v).startsWith('__zse_ck=') && String(v).length > 250) { try { fs.writeFileSync('.probe/tg-token.txt', String(v).split(';')[0]); P('TOKEN-SAVED len=' + String(v).length); } catch {} } }, title: 'z', URL: 'https://www.zhihu.com' + PAGE, documentURI: 'https://www.zhihu.com' + PAGE,
  referrer: 'https://www.zhihu.com/', domain: 'www.zhihu.com', location: null, readyState: 'complete', hidden: false,
  visibilityState: 'visible', characterSet: 'UTF-8', compatMode: 'CSS1Compat', all: [],
  getElementById: (id) => (id === 'zh-zse-ck' ? { id: 'zh-zse-ck', content: META, getAttribute: (a) => (a === 'content' ? META : null) } : null),
  getElementsByTagName: () => ({ getAttribute: () => META, 0: {} }),
  querySelector: (sel) => (String(sel).includes('data-assets-tracker-config') ? { toString: () => '[object HTMLScriptElement]' } : null),
  querySelectorAll: () => [],
  createElement: (tag) => ({ tagName: String(tag).toUpperCase(), style: {}, setAttribute: () => {}, appendChild: () => {}, getContext: () => null, toDataURL: () => '' }),
  createTextNode: () => ({}), addEventListener: () => {}, removeEventListener: () => {}, write: () => {},
  documentElement: { style: {}, clientWidth: 1280, clientHeight: 720, getAttribute: () => null },
  head: { appendChild: () => {} }, body: { appendChild: () => {} }, scripts: [],
  currentScript: {
    tagName: 'SCRIPT', nodeName: 'SCRIPT', localName: 'script', type: 'text/javascript',
    src: 'https://static.zhihu.com/zse-ck/v4/' + HASH + '.js', id: '', text: '', async: true, defer: false, crossOrigin: 'anonymous',
    getAttribute: (a) => (a === 'data-assets-tracker-config' ? '{"appName":"zse_ck","trackJSRuntimeError":true}' : a === 'src' ? 'https://static.zhihu.com/zse-ck/v4/' + HASH + '.js' : null),
    hasAttribute: (a) => a === 'data-assets-tracker-config', toString: () => '[object HTMLScriptElement]',
  },
};
const navigator = {
  userAgent: process.env.UA || UAH, platform: 'Win32',
  appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  appName: 'Netscape', appCodeName: 'Mozilla', product: 'Gecko', productSub: '20030108', vendor: 'Google Inc.', vendorSub: '',
  language: 'zh-CN', languages: ['zh-CN', 'zh', 'en'], onLine: true, cookieEnabled: true, doNotTrack: null,
  hardwareConcurrency: Number(process.env.HCPU || '8'), maxTouchPoints: 0, pdfViewerEnabled: true, webdriver: false,
  plugins: [], mimeTypes: [], connection: { effectiveType: '4g' },
  mediaDevices: {}, permissions: {}, credentials: {}, serviceWorker: {}, getBattery: () => Promise.resolve({}), javaEnabled: () => false,
};
const location = { href: document.URL, protocol: 'https:', host: 'www.zhihu.com', hostname: 'www.zhihu.com', pathname: PAGE, search: '', hash: '', origin: 'https://www.zhihu.com', reload: () => {}, replace: () => {}, assign: () => {}, toString: () => document.URL };
const screen = { width: 1920, height: 1080, availWidth: 1920, availHeight: 1040, colorDepth: 24, pixelDepth: 24, orientation: { type: 'landscape-primary', angle: 0 } };
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
  process: { exit: () => {}, on: () => {}, argv: [], env: {}, version: 'v25', platform: 'win32', nextTick: (f, ...a) => setTimeout(f, 0, ...a) },
});
vm.runInContext('window = globalThis; self = globalThis; top = window; parent = window; Object.defineProperty(globalThis, Symbol.toStringTag, { value: "Window", configurable: true });', ctx);
for (const k of ['XMLHttpRequest', 'Image', 'setTimeout', 'setInterval', 'requestAnimationFrame', 'atob', 'btoa', 'fetch']) if (typeof ctx[k] === 'function') nativeLike(ctx[k], k);
ctx.console = { log: nativeLike(() => {}, 'log'), warn: nativeLike(() => {}, 'warn'), error: nativeLike(() => {}, 'error'), info: nativeLike(() => {}, 'info'), debug: nativeLike(() => {}, 'debug'), trace: nativeLike(() => {}, 'trace'), table: nativeLike(() => {}, 'table'), dir: nativeLike(() => {}, 'dir'), group: () => {}, groupEnd: () => {}, time: () => {}, timeEnd: () => {}, assert: () => {}, clear: () => {} };
ctx.eval = function (src) { return vm.runInContext(String(src), ctx, { timeout: 30000 }); };
nativeLike(ctx.eval, 'eval');

// ---------------- wasm import tracer ----------------
const REF_NAN = 0x7ff80000n << 32n;
const Shorts = new WeakMap();
const short = (v, d = 0) => {
  if (v === null) return 'null';
  const t = typeof v;
  if (t === 'string') return 'str(' + v.length + ')=' + JSON.stringify(v.length > 80 ? v.slice(0, 77) + '…' : v);
  if (t === 'number') return 'num(' + v + ')';
  if (t === 'bigint') return 'big(' + v + ')';
  if (t === 'boolean' || t === 'undefined') return String(v);
  if (t === 'function') return 'fn:' + (v.name || '?') + '/' + v.length;
  if (Array.isArray(v)) return 'arr[' + v.length + ']';
  if (v instanceof Uint8Array) return 'u8[' + v.length + ']=' + Buffer.from(v.buffer, v.byteOffset, Math.min(v.length, 24)).toString('hex');
  if (v instanceof DataView) return 'DataView(' + v.byteLength + ')';
  if (d <= 0) {
    const ks = Object.keys(v).slice(0, 12);
    return 'obj{' + ks.map((k) => k + '=' + short(v[k], 1)).join(', ') + '}';
  }
  return 'obj{…}';
};
function decodeRef(ref) {
  // ref: BigInt as passed to imports
  if (typeof ref !== 'bigint') return null;
  const hi = (ref >> 32n) & 0xffffffffn, lo = ref & 0xffffffffn;
  if (hi === 0x7ff80000n) {
    if (lo === 0n) return undefined;
    if (lo === 1n) return null;
    if (lo === 2n) return true;
    if (lo === 3n) return false;
    return 'NaNBOX?' + lo;
  }
  const f = new Float64Array(new BigUint64Array([ref]).buffer)[0];
  if (!Number.isNaN(f)) return 'num(' + f + ')';
  const id = Number(lo);
  const v = GO && GO.i ? GO.i[id] : undefined;
  return 'ref#' + id + '=' + short(v);
}
let GO = null, MEM = null;
const wrap = (name, fn) => function (...a) {
  let dec = '';
  try {
    if (/copyBytesToGo|valueNew|valueSetIndex|valueIndex|valueLength|finalizeRef/.test(name)) dec = ' | ' + a.map((x) => (typeof x === 'bigint' ? decodeRef(GO, x) : String(x))).join(', ');
    if (/valueNew/.test(name) && GO) {
      // args: (resultAddr, ctorRef, argvPtr, argc, argcPtr?) -> decode ctor
    }
  } catch (e) { dec = ' | <dec err ' + e.message + '>'; }
  const r = fn.apply(this, a);
  if (log.length < LIM) log.push({ n: log.length, name, args: a.map((x) => (typeof x === 'bigint' ? 'B' + x.toString(16) : String(x).slice(0, 30))), dec, ret: (() => { try { return typeof r === 'bigint' ? 'B' + r.toString(16) : String(r).slice(0, 40); } catch { return '?'; } })() });
  return r;
};
vm.runInContext(`
globalThis.__hookWasm = function () {
  const W = WebAssembly;
  const oI = W.instantiate.bind(W);
  Object.defineProperty(globalThis, 'WebAssembly', { configurable: true, writable: true, value: new Proxy(W, { get(t, p) {
    if (p === 'instantiate') return function (b, i) {
      globalThis.__impShape = i;
      for (const m of Object.keys(i || {})) for (const n of Object.keys(i[m])) {
        if (typeof i[m][n] === 'function') { const f = i[m][n]; i[m][n] = function (...a) { return __traceImport(m + '.' + n, f, this, a); }; }
      }
      const r = oI(b, i);
      Promise.resolve(r).then((res) => { const inst = (res && res.instance) || res; if (inst && inst.exports && inst.exports.memory) { __nodeMem(inst.exports.memory); } });
      return r;
    };
    return t[p];
  } }) });
};
`, ctx);
ctx.__traceImport = (name, f, thiz, a) => {
  let dec = '';
  try {
    if (/copyBytesToGo|valueNew|valueSetIndex|valueIndex|valueLength|finalizeRef/.test(name)) {
      dec = ' | ' + a.map((x) => (typeof x === 'bigint' ? JSON.stringify(decodeRef(x)) : String(x).slice(0, 40))).join(', ');
      if (MEM && /copyBytesToGo/.test(name)) {
        // decode the wasm-side buffer the copy lands in: find (ptr,len) pair in args
        const nums = a.map((x) => Number(x)).filter((x) => Number.isFinite(x) && x >= 0);
        const dv = new DataView(MEM.buffer);
        for (let i = 0; i + 1 < nums.length; i++) {
          const ptr = nums[i], len = nums[i + 1];
          if (ptr > 0 && ptr < MEM.buffer.byteLength && len > 0 && len < 200000 && ptr + len <= MEM.buffer.byteLength) {
            const u = new Uint8Array(MEM.buffer, ptr, Math.min(len, 60));
            let s = '';
            for (const c of u) s += c >= 32 && c < 127 ? String.fromCharCode(c) : '?';
            if (s.replace(/\?/g, '').length > 2) dec += ` | mem[${ptr},+${len}]=${JSON.stringify(s)}`;
          }
        }
      }
    }
    if (/fd_write/.test(name) && MEM) {
      const dv = new DataView(MEM.buffer);
      const iovs = Number(a[1]) >>> 0, cnt = Number(a[2]) || 0;
      let out = '';
      for (let k = 0; k < cnt; k++) {
        const ptr = dv.getUint32(iovs + k * 8, true), len = dv.getUint32(iovs + k * 8 + 4, true);
        out += new TextDecoder().decode(new Uint8Array(MEM.buffer, ptr, Math.min(len, 2000)));
      }
      dec = ' | STDOUT: ' + out;
    }
  } catch (e) { dec += ' | <dec err ' + e.message + '>'; }
  const r = f.apply(thiz, a);
  if (log.length < LIM) log.push({ n: log.length, name, args: a.map((x) => (typeof x === 'bigint' ? 'B' + x.toString(16) : String(x).slice(0, 24))), dec, ret: (() => { try { return typeof r === 'bigint' ? 'B' + r.toString(16) : String(r).slice(0, 30); } catch { return '?'; } })() });
  return r;
};
vm.runInContext('__hookWasm()', ctx);
ctx.__nodeMem = (m) => { MEM = m; P('MEM-BOUND ' + m.buffer.byteLength); };
let MEM = null;
ctx.__nodeMem = (m) => { MEM = m; P('MEM-BOUND ' + m.buffer.byteLength); };
let MEM = null;
ctx.__nodeMem = (m) => { MEM = m; P('MEM-BOUND ' + m.buffer.byteLength); };
let MEM = null;
ctx.__nodeMem = (m) => { MEM = m; P('MEM-BOUND ' + m.buffer.byteLength); };
let MEM = null;
ctx.__nodeMem = (m) => { MEM = m; P('MEM-BOUND ' + m.buffer.byteLength); };
let MEM = null;
ctx.__nodeMem = (m) => { MEM = m; P('MEM-BOUND ' + m.buffer.byteLength); };
let MEM = null;
ctx.__nodeMem = (m) => { MEM = m; P('MEM-BOUND ' + m.buffer.byteLength); };
let MEM = null;
ctx.__nodeMem = (m) => { MEM = m; P('MEM-BOUND ' + m.buffer.byteLength); };
let MEM = null;
ctx.__nodeMem = (m) => { MEM = m; P('MEM-BOUND ' + m.buffer.byteLength); };
let MEM = null;
ctx.__nodeMem = (m) => { MEM = m; P('MEM-BOUND ' + m.buffer.byteLength); };

// run the challenge
P('MARK run glue len=' + JS.length);
try { vm.runInContext(JS, ctx, { timeout: 60000 }); P('MARK glue done'); } catch (e) { P('GLUE THROW ' + String(e && e.stack).split('\n').slice(0, 5).join(' >> ')); }
GO = ctx._g || null;
if (GO) P('GO bound: i=' + (GO.i ? GO.i.length : '?'));

setTimeout(() => {
  const ck = (() => { try { return vm.runInContext('typeof __g === "object" ? (__g.ck || "") : ""', ctx); } catch { return ''; } })();
  const cookie = document.cookie;
  P('CK ' + JSON.stringify((ck || '').slice(0, 100)) + ' len=' + (ck || '').length);
  P('COOKIE ' + JSON.stringify(cookie).slice(0, 200));
  P('GO ' + (GO ? ('i=' + (GO.i ? GO.i.length : '?') + ' t=' + (GO.t ? 'yes' : 'no') + ' A=' + GO.A) : 'null'));
  fs.writeFileSync('.probe/tg-trace.json', JSON.stringify(log, null, 1));
  P('TRACE ' + log.length + ' entries -> .probe/tg-trace.json');
  if (GO && GO.t) {
    MEM = GO.t.exports.memory;
    fs.writeFileSync('.probe/tg-mem.bin', Buffer.from(new Uint8Array(MEM.buffer)));
    P('MEM ' + MEM.buffer.byteLength);
    const rows = [];
    const deep = (v, d) => {
      if (v === null || v === undefined) return String(v);
      const t = typeof v;
      if (t === 'string') return v.length > 60 ? 'str(' + v.length + ')=' + JSON.stringify(v.slice(0, 60)) : JSON.stringify(v);
      if (t === 'number' || t === 'boolean' || t === 'bigint') return String(v);
      if (t === 'function') return 'fn:' + (v.name || '?') + '/' + v.length + ':' + JSON.stringify(String(v).slice(0, 60));
      if (d <= 0) return 'obj{…}';
      if (Array.isArray(v)) return '[' + v.slice(0, 6).map((x) => deep(x, d - 1)).join(', ') + (v.length > 6 ? ',…' : '') + ']';
      return '{' + Object.keys(v).slice(0, 20).map((k) => k + ':' + deep(v[k], d - 1)).join(', ') + '}';
    };
    for (let id = 0; id < (GO.i ? GO.i.length : 0); id++) rows.push(id + '\t' + deep(GO.i[id], 3));
    fs.writeFileSync('.probe/tg-values.txt', rows.join('\n'));
    P('VALUES ' + rows.length + ' -> .probe/tg-values.txt');
  }
  // string constants seen
  const seen = new Set();
  for (const e of log) if (e.dec && e.dec.includes('str(')) { const m = e.dec.match(/str\(\d+\)=("[^"]*")/g); if (m) for (const s of m) seen.add(s); }
  P('STRINGS ' + JSON.stringify([...seen].slice(0, 80)));
}, 4000);
