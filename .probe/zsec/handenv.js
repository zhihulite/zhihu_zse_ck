// 手写浏览器环境（不依赖 jsdom / sdenv），供 vm 沙箱使用。
// 设计依据：目标实际会查的项（来自已还原的 payload/inner 字符串表与活体观测）。
'use strict';

const CHROME_VER = '140.0.0.0';
// 环境指纹改为「一次真实浏览器会话整组采下」的自洽值（见 fp_real.js 头注释）
const FP = require('./fp_real.js');
// 默认 UA 改为「真机捕获会话的 UA」（144 字符，ZCode Electron）。
//   依据：record93 里含 crc32(UA) 字段；真机捕获实测 UA =
//   Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ZCode/3.14.4 Chrome/146.0.7680.80 Electron/41.0.3 Safari/537.36
//   ⇒ 默认即复现真机 crc32 = 0x3efa0afb（zlib.crc32 独立核算一致）。ZSE_UA 可覆盖。
const ZSE_REAL_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ZCode/3.14.4 Chrome/146.0.7680.80 Electron/41.0.3 Safari/537.36';
const UA = process.env.ZSE_UA || ZSE_REAL_UA;   // ZSE_UA 用于受控差分实验

// 最小 native 补丁层（只补纯 JS 做不到的两件事）：
//   ① 原生 Function.prototype.toString —— 让 Function.prototype.toString.call(fn) 也认伪装
//   ② [[IsHTMLDDA]] 对象 —— typeof === "undefined" 但仍可调用/可索引（document.all 的真机语义）
//   注意：vm.createContext 会建新 realm，sandbox 有自己的 Function.prototype ⇒
//   installNativeToString() 必须【在 sandbox 上下文里】调用（见 run_build_live.js）。
let ZSE_NATIVE = null;
// native addon：多候选解析（交付包 / 工作区两种布局都覆盖）
//   候选1 <pkg>/code/env/native/zseenv.node           （交付包）
//   候选2 <pkg>/native/zseenv/build/Release/zseenv.node（工作区构建产物）
//   候选3 <repo>/native/zseenv/build/Release/zseenv.node（脚本在 .probe/zsec/ 时上溯三级）
ZSE_NATIVE = null;
(function () {
  var cands = [
    require('path').join(__dirname, 'native', 'zseenv.node'),
    require('path').join(__dirname, '..', '..', 'native', 'zseenv', 'build', 'Release', 'zseenv.node'),
    require('path').join(__dirname, '..', '..', '..', 'native', 'zseenv', 'build', 'Release', 'zseenv.node'),
  ];
  for (var i = 0; i < cands.length; i++) {
    try { ZSE_NATIVE = require(cands[i]); return; } catch (e) {}
  }
  try { console.warn('[handenv] native addon 未加载（IsHTMLDDA/原生 toString 将退回 JS 近似）'); } catch (e) {}
})();

function b64(str) { return Buffer.from(str, 'binary').toString('base64'); }

// 一张固定的小 PNG（1x1 透明）作为 canvas.toDataURL 的返回值
const PNG_1x1 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// canvas 指纹：一段稳定的伪随机像素（真实浏览器里由字体/GPU 决定）
function makePixels(w, h) {
  const n = w * h * 4;
  const data = new Uint8ClampedArray(n);
  let s = 0x12345678;
  for (let i = 0; i < n; i++) {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    data[i] = s & 0xff;
  }
  return data;
}

function makeCanvasContext2D(w, h) {
  const px = makePixels(w, h);
  const ctx = {
    canvas: null,
    fillStyle: '#000000', strokeStyle: '#000000', globalAlpha: 1,
    font: '10px sans-serif', textBaseline: 'alphabetic', textAlign: 'start',
    lineWidth: 1, globalCompositeOperation: 'source-over', shadowBlur: 0,
    fillRect() {}, clearRect() {}, strokeRect() {}, beginPath() {}, closePath() {},
    moveTo() {}, lineTo() {}, arc() {}, arcTo() {}, bezierCurveTo() {}, quadraticCurveTo() {},
    fill() {}, stroke() {}, clip() {}, save() {}, restore() {}, scale() {}, rotate() {},
    translate() {}, transform() {}, setTransform() {}, drawImage() {}, putImageData() {},
    fillText() {}, strokeText() {}, measureText(t) { return { width: String(t).length * 6, actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2 }; },
    createLinearGradient() { return { addColorStop() {} }; },
    createRadialGradient() { return { addColorStop() {} }; },
    createPattern() { return {}; },
    getImageData(x, y, gw, gh) {
      const out = new Uint8ClampedArray(gw * gh * 4);
      for (let i = 0; i < out.length; i++) out[i] = px[(i + (y * w + x) * 4) % px.length];
      return { data: out, width: gw, height: gh, colorSpace: 'srgb' };
    },
    isPointInPath() { return false; },
    getContextAttributes() { return { alpha: true, desynchronized: false, willReadFrequently: false }; },
    toString() { return '[object CanvasRenderingContext2D]'; },
  };
  try { Object.defineProperty(ctx, Symbol.toStringTag, { value: 'CanvasRenderingContext2D', configurable: true }); } catch (e) {}
  return ctx;
}

function makeWebGLContext(w, h) {
  const PARAMS = Object.assign({
    37445: 'Google Inc. (NVIDIA)',                    // UNMASKED_VENDOR_WEBGL
    37446: 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 SUPER Direct3D11 vs_5_0 ps_5_0, D3D11)',
    7936: 'WebKit', 7937: 'WebKit WebGL', 7938: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
    35724: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.00 Chromium)',
    3379: 16384, 34930: 16, 35660: 16, 35661: 32, 34076: 16384, 34024: 16384,
    3386: [32767, 32767], 3413: 8, 3414: 8, 3415: 8, 3412: 8,
    33902: [1, 1], 33901: [1, 1024], 34921: 16, 36347: 1024, 36348: 32, 36349: 1024,
    34852: 16, 36063: 16, 35375: [16384, 16384, 16384], 34853: 0,
  }, FP.glParams || {});
  PARAMS[37445] = FP.glVendor || PARAMS[37445];
  if (process.env.ZSE_GLV) PARAMS[37445] = process.env.ZSE_GLV;
  PARAMS[37446] = FP.glRenderer || PARAMS[37446];
  PARAMS[7938] = FP.glVersion || PARAMS[7938];
  PARAMS[35724] = FP.glSL || PARAMS[35724];
  const ctx = {
    canvas: null,
    drawingBufferWidth: w, drawingBufferHeight: h,
    getParameter(p) { return (p in PARAMS) ? PARAMS[p] : 0; },
    getExtension(name) {
      if (name === 'WEBGL_debug_renderer_info') return { UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 };
      if (name === 'WEBGL_lose_context') return { loseContext() {}, restoreContext() {} };
      return null;
    },
    getSupportedExtensions() {
      return ['ANGLE_instanced_arrays', 'EXT_blend_minmax', 'EXT_texture_filter_anisotropic',
        'WEBGL_debug_renderer_info', 'WEBGL_lose_context', 'OES_element_index_uint',
        'OES_standard_derivatives', 'OES_texture_float', 'OES_vertex_array_object', 'WEBGL_depth_texture'];
    },
    getShaderPrecisionFormat() { return { rangeMin: 127, rangeMax: 127, precision: 23 }; },
    getContextAttributes() { return { alpha: true, depth: true, stencil: false, antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: 'default', failIfMajorPerformanceCaveat: false }; },
    readPixels(x, y, gw, gh, fmt, type, out) { if (out && out.fill) out.fill(0); },
    createBuffer() { return {}; }, createTexture() { return {}; }, createProgram() { return {}; },
    createShader() { return {}; }, createFramebuffer() { return {}; }, createRenderbuffer() { return {}; },
    bindBuffer() {}, bufferData() {}, enableVertexAttribArray() {}, vertexAttribPointer() {},
    drawArrays() {}, drawElements() {}, clear() {}, clearColor() {}, viewport() {},
    useProgram() {}, shaderSource() {}, compileShader() {}, attachShader() {}, linkProgram() {},
    getShaderParameter() { return true; }, getProgramParameter() { return true; },
    getShaderInfoLog() { return ''; }, getProgramInfoLog() { return ''; },
    getAttribLocation() { return 0; }, getUniformLocation() { return {}; },
    uniform1f() {}, uniform2f() {}, uniform3f() {}, uniform4f() {}, uniform1i() {},
    uniformMatrix4fv() {}, activeTexture() {}, bindTexture() {}, texParameteri() {}, texImage2D() {},
    disable() {}, enable() {}, depthFunc() {}, blendFunc() {}, cullFace() {}, frontFace() {},
    pixelStorei() {}, generateMipmap() {}, deleteShader() {}, deleteProgram() {}, deleteBuffer() {},
    toString() { return '[object WebGLRenderingContext]'; },
  };
  try { Object.defineProperty(ctx, Symbol.toStringTag, { value: 'WebGLRenderingContext', configurable: true }); } catch (e) {}
  return ctx;
}

function createEnv() {
  const g = {};
  const doc = {};

  // ---------- navigator ----------
  const pluginList = [
    { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 2 },
    { name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 2 },
    { name: 'Chromium PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 2 },
    { name: 'Microsoft Edge PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 2 },
    { name: 'WebKit built-in PDF', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 2 },
  ];
  pluginList.item = (i) => pluginList[i];
  pluginList.namedItem = (n) => pluginList.find(p => p.name === n) || null;
  pluginList.refresh = () => {};

  const mimeList = [
    { type: 'application/pdf', suffixes: 'pdf', description: 'Portable Document Format' },
    { type: 'text/pdf', suffixes: 'pdf', description: 'Portable Document Format' },
  ];
  mimeList.item = (i) => mimeList[i];
  mimeList.namedItem = (n) => mimeList.find(m => m.type === n) || null;

  const navigator = {
    userAgent: UA,
    appName: 'Netscape', appCodeName: 'Mozilla', appVersion: UA.replace('Mozilla/', ''),
    platform: 'Win32', product: 'Gecko', productSub: '20030107', vendor: 'Google Inc.',
    vendorSub: '', language: 'zh-CN', languages: ['zh-CN', 'zh', 'en'],
    onLine: true, cookieEnabled: true, doNotTrack: null, webdriver: false,
    hardwareConcurrency: Number(process.env.ZSE_HC || 8), deviceMemory: 8, maxTouchPoints: 0,
    plugins: pluginList, mimeTypes: mimeList,
    userAgentData: {
      brands: [
        { brand: 'Not)A;Brand', version: '8' },
        { brand: 'Chromium', version: CHROME_VER.split('.')[0] },
        { brand: 'Google Chrome', version: CHROME_VER.split('.')[0] },
      ],
      mobile: false, platform: 'Windows',
    },
    javaEnabled() { return false; },
    getBattery: undefined,
  };
  navigator.plugins.length = pluginList.length;
  navigator.mimeTypes.length = mimeList.length;

  // ---------- screen ----------
  const screen = {
    width: FP.screen.w, height: FP.screen.h, availWidth: FP.screen.aw, availHeight: FP.screen.ah,
    colorDepth: 24, pixelDepth: 24, availLeft: 0, availTop: 0,
    orientation: { angle: 0, type: 'landscape-primary', onchange: null },
  };

  // ---------- location ----------
  const location = {
    href: 'https://www.zhihu.com/', origin: 'https://www.zhihu.com', protocol: 'https:',
    host: 'www.zhihu.com', hostname: 'www.zhihu.com', port: '', pathname: '/', search: '', hash: '',
    ancestorOrigins: { length: 0 },
    // inner 层 pc115 守卫：String(Proxy(location).toString).indexOf("native") === -1 会置 l[3] bit13。
    //   真实浏览器 location.toString 是原生 ⇒ 必须走 nativeFn，同时仍返回 href（pc8 用它判 "zhihu"）。
    assign() {}, replace() {}, reload() {},
    toString: nativeFn('toString', function () { return this.href; }),
  };

  // ---------- history ----------
  const history = { length: 2, state: null, scrollRestoration: 'auto', pushState() {}, replaceState() {}, back() {}, forward() {}, go() {} };

  // ---------- localStorage / sessionStorage ----------
  function makeStorage() {
    const m = new Map();
    const s = {
      get length() { return m.size; },
      key(i) { return Array.from(m.keys())[i] ?? null; },
      getItem(k) { k = String(k); return m.has(k) ? m.get(k) : null; },
      setItem(k, v) { m.set(String(k), String(v)); },
      removeItem(k) { m.delete(String(k)); },
      clear() { m.clear(); },
    };
    return new Proxy(s, {
      get(t, p) { if (p in t) return t[p]; if (typeof p === 'string') return t.getItem(p); return undefined; },
      set(t, p, v) { if (p in t) return true; t.setItem(p, v); return true; },
      has(t, p) { return (p in t) || m.has(String(p)); },
      deleteProperty(t, p) { m.delete(String(p)); return true; },
    });
  }
  const localStorage = makeStorage();
  const sessionStorage = makeStorage();

  // ---------- console（关键：debug 不能读取传入对象的 stack，否则会命中反调试探针） ----------
  const consoleObj = {};
  for (const k of ['log', 'debug', 'info', 'warn', 'error', 'trace', 'dir', 'table', 'group', 'groupEnd', 'time', 'timeEnd', 'assert', 'count', 'clear']) {
    consoleObj[k] = () => {};
  }
  consoleObj.memory = undefined;

  // ---------- canvas / WebGL ----------
  function makeCanvas(w, h) {
    const canvas = makeElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.__html = '<canvas width="' + w + '" height="' + h + '"></canvas>';
    canvas.toDataURL = function (type) {
      // 指纹层固定用 240x60 画布画同一组图形；返回真实浏览器的渲染结果，保证与字体/GPU 自洽
      if (canvas.width === 240 && canvas.height === 60) return FP.canvasDataURL;
      // 默认 300x150 空白画布：collectParts() 直接对它取 toDataURL()，必须返回真浏览器同一张 PNG
      if (canvas.width === 300 && canvas.height === 150 && FP.canvasDataURL300x150) return FP.canvasDataURL300x150;
      return 'data:' + (type || 'image/png') + ';base64,' + PNG_1x1;
    };
    canvas.toBlob = function (cb, type) { cb && cb({ size: 68, type: type || 'image/png' }); };
    canvas.getContext = function (kind) {
      if (kind === '2d') { const c = makeCanvasContext2D(w, h); c.canvas = canvas; return c; }
      if (kind === 'webgl' || kind === 'experimental-webgl' || kind === 'webgl2') { const c = makeWebGLContext(w, h); c.canvas = canvas; return c; }
      return null;
    };
    canvas.getBoundingClientRect = function () { return { x: 0, y: 0, top: 0, left: 0, right: w, bottom: h, width: w, height: h }; };
    canvas.captureStream = function () { return {}; };
    canvas.toBlob = canvas.toBlob;
    return canvas;
  }

  // ---------- XMLHttpRequest ----------
  function XMLHttpRequest() {
    this.readyState = 0; this.status = 0; this.statusText = ''; this.response = ''; this.responseText = '';
    this.responseType = ''; this.responseURL = ''; this.timeout = 0; this.withCredentials = false;
    this.upload = { addEventListener() {}, removeEventListener() {} };
    this.onreadystatechange = null; this.onload = null; this.onerror = null;
    this.onabort = null; this.ontimeout = null; this.onloadstart = null; this.onloadend = null;
    this.onprogress = null; this.responseXML = null;
    this._headers = {};
  }
  XMLHttpRequest.prototype.open = function (m, u) { this._method = String(m || 'GET').toUpperCase(); this._url = String(u); this.readyState = 1; };
  XMLHttpRequest.prototype.setRequestHeader = function (k, v) { this._headers[k] = v; };
  XMLHttpRequest.prototype.getResponseHeader = function (k) { const h = this._hdrs || {}; const v = h[String(k).toLowerCase()]; return v === undefined ? null : String(v); };
  XMLHttpRequest.prototype.getAllResponseHeaders = function () { const h = this._hdrs || {}; return Object.keys(h).map(k => k + ': ' + h[k]).join(String.fromCharCode(13) + String.fromCharCode(10)); };
  XMLHttpRequest.prototype.overrideMimeType = function () {};
  XMLHttpRequest.prototype.abort = function () {};
  XMLHttpRequest.prototype.addEventListener = function (t, cb) { (this._ls = this._ls || {})[t] = (this._ls[t] || []).concat([cb]); };
  XMLHttpRequest.prototype.removeEventListener = function () {};
  XMLHttpRequest.prototype.dispatchEvent = function (ev) { const l = this._ls && this._ls[ev && ev.type]; if (l) for (const cb of l) { try { cb.call(this, ev); } catch (e) {} } return true; };
  XMLHttpRequest.prototype.send = function () {
    this.readyState = 1;
    const self = this;
    const fire = (name, ev) => {
      if (typeof self['on' + name] === 'function') { try { self['on' + name](ev); } catch (e) {} }
      try { self.dispatchEvent({ type: name }); } catch (e) {}
    };
    const _lf = require('./livefetch.js');
    _lf.LOG.push({ ev: 'xhr', url: String(self._url).slice(0, 220), method: self._method });
    const done = (ok, res, err) => {
      if (ok) {
        self.readyState = 4; self.status = res.status; self.statusText = '';
        self.responseText = res.body.toString('utf8');
        self.response = self.responseType === 'json' ? (() => { try { return JSON.parse(self.responseText); } catch (e) { return null; } })() : self.responseText;
        self.responseURL = res.url;
        self._hdrs = res.headers;
        fire('readystatechange', { type: 'readystatechange' });
        fire('load', { type: 'load' });
      } else {
        self.readyState = 4; self.status = 0;
        fire('readystatechange', { type: 'readystatechange' });
        fire('error', { type: 'error', message: String(err) });
      }
      fire('loadend', { type: 'loadend' });
    };
    _lf.raw(self._url, { method: self._method, headers: self._headers }).then(
      (res) => done(true, res), (e) => done(false, null, e && e.message));
    return;
  };
  XMLHttpRequest.prototype._legacy_send_unused = function () {
    this.readyState = 4; this.status = 0; this.statusText = '';
    const self = this;
    setTimeout(() => {
      if (typeof self.onerror === 'function') { try { self.onerror({ type: 'error' }); } catch (e) {} }
      if (typeof self.onloadend === 'function') { try { self.onloadend({ type: 'loadend' }); } catch (e) {} }
      if (typeof self.onreadystatechange === 'function') { try { self.onreadystatechange({ type: 'readystatechange' }); } catch (e) {} }
    }, 0);
  };

  // ---------- Document / HTMLAllCollection ----------
  // document.all 在真实浏览器里是【可调用】的（HTMLAllCollection 的 legacy [[Call]]，
  //   即 [[IsHTMLDDA]] 那套遗留行为的一部分）。Go VM 会真的去调它，
  //   若返回不可调用对象，(syscall/js.Value).Invoke 会 panic（RuntimeError: unreachable）。
  function HTMLAllCollection(list) {
    list = list || [];
    // payload l[3] bit1 的守卫是 `typeof <new Proxy(Function)("try{window={};document={};
    //   return document.all()}catch(_){}")() !== "object"` ⇒ 真机里该表达式的结果是**对象**，
    //   所以可调用的 document.all 必须返回对象（不能返回 undefined，否则 typeof 是 "undefined"）。
    const f = function () { return { length: list.length }; };
    for (let i = 0; i < list.length; i++) f[i] = list[i];
    try { Object.defineProperty(f, 'length', { value: list.length, configurable: true }); } catch (e) {}
    try { Object.setPrototypeOf(f, HTMLAllCollection.prototype); } catch (e) {}
    return f;
  }
  HTMLAllCollection.prototype.item = function (i) { return this[i] !== undefined ? this[i] : null; };
  HTMLAllCollection.prototype.namedItem = function () { return null; };
  HTMLAllCollection.prototype.toString = function () { return '[object HTMLAllCollection]'; };
  try { Object.defineProperty(HTMLAllCollection.prototype, Symbol.toStringTag, { value: 'HTMLAllCollection', configurable: true }); } catch (e) {}
  // 真机里 `new Document()` 会抛 TypeError（"Illegal constructor"）—— Document 接口不可构造。
  //   payload case 1403 的守卫正是 `typeof (new Document()).all !== "undefined"` ⇒ 真机抛错 ⇒ 该位不置。
  //   我原来的 mock 允许构造 ⇒ 误置 w4 bit13（此前用硬编码 SEQ_OUT='4030' 掩盖）。ZSE_DOCTHROW=1 打开真机语义。
  // 真机语义：`new Document()` 抛 TypeError（"Illegal constructor"）—— Document 接口不可构造。
  //   payload case 1403 的守卫是 `typeof (new Document()).all !== "undefined"`：
  //   真机抛 ⇒ try/catch 得 undefined ⇒ typeof "undefined" ⇒ w4 bit13 **不置**。
  //   我原来允许构造、且 prototype 上有 all ⇒ 误置 bit13（此前靠 SEQ_OUT='4030' 硬修正掩盖）。
  //   ZSE_DOCCTOR=1（默认）打开真机语义；=0 退回旧的宽松构造做对拍。
  // 真机实测（Firefox about:blank）：`new Document()` **不抛**，实例是 `[object Document]`。
  //   （早前我以为真机抛 Illegal constructor，据此加过 ZSE_DOCCTOR 抛错开关，实测是错的 ——
  //     抛错会让 payload 直接中断：ALL LOG n=0、zh len=18、Go VM panic。已撤掉。）
  function Document() {
    if (process.env.ZSE_DOCCTOR === 'throw') throw new TypeError('Illegal constructor');
    this.documentElement = null; this.location = location;
    // 不要在这里挂自有 all —— 否则会遮蔽 prototype 上的 accessor，
    //   导致 `(new Document()).all` 变成真集合（typeof "object"）⇒ 误置 w4 bit13。
    if (process.env.ZSE_DOCPROTOALL === '1') this.all = new HTMLAllCollection();
  }
  // 真机实测（Firefox about:blank）：`new Document()` **不抛**，实例是 `[object Document]`，
  //   但 `typeof (new Document()).all === "undefined"` —— 尽管 `'all' in Document.prototype` 为 true
  //   （原型上是 legacy accessor，对非真 Document 实例给出 undefined）。
  //   ⇒ payload case 1403 的守卫 `typeof (new Document()).all !== "undefined"` 在真机**不置位**。
  //   我原来在 prototype 上放了一个真 HTMLAllCollection ⇒ 实例继承到它 ⇒ 误置 w4 bit13
  //   （此前靠 SEQ_OUT='4030' 硬修正掩盖）。这里去掉 prototype 上的 all、只留构造器静态。
  //   ZSE_DOCPROTOALL=1 可退回旧形态做对拍。
  //   精确复刻 Firefox 形态：`'all' in Document.prototype` 为 **true**，但 `(new Document()).all`
  //     取值是 **undefined**（原型上是 legacy accessor，对非真 Document 实例给出 undefined）。
  //     直接删掉 prototype.all 会让 payload 在产出 zh 前就中断（实测 ALLLOG n=0、zh len=18），
  //     所以用访问器保留属性存在性、只让取值变 undefined。
  if (process.env.ZSE_DOCPROTOALL === '1') {
    Document.prototype.all = new HTMLAllCollection();
  } else {
    // 真机实测（Firefox about:blank）逐段：
    //     typeof (new Document()).all        === "undefined"   ⇒ 守卫不置位
    //     (new Document()).all.length        === 0（number）  ⇒ case1428 的 `l[40].length` 不抛
    //     (new Document()).all()             → 对象
    //     Object.getOwnPropertyDescriptor(Document.prototype,'all') 是 accessor；'all' in prototype 为 true
    //   ⇒ 它**不是 undefined**，而是一个**空的 IsHTMLDDA 集合**（typeof 给 "undefined"，但有 length、可调用）。
    //   我原来放真集合 ⇒ typeof "object" ⇒ 误置 w4 bit13；改成返回 undefined 又会让 case1428 抛错中断。
    var _emptyAll = (ZSE_NATIVE && process.env.ZSE_NOALLNATIVE !== '1')
      ? ZSE_NATIVE.makeUndetectable([], 'HTMLAllCollection')
      : new HTMLAllCollection([]);
    try {
      Object.defineProperty(Document.prototype, 'all', {
        configurable: true, enumerable: true,
        get: function () { return _emptyAll; },
      });
    } catch (e) {}
  }
  // 真机里 `Document.all` 是**构造器上的静态**（legacy accessor），`typeof Document.all === "object"`。
  //   我原来没有它 ⇒ `typeof Document.all === "undefined"` ⇒ payload 的 `typeof Document.all` 守卫误判。
  //   只补静态、不动 prototype（动 prototype 会让实例继承 all，反而把 w4 bit13 带歪，且会打断 payload）。
  Document.all = new HTMLAllCollection();
  Document.prototype.createElement = function (t) { return t === 'canvas' ? makeCanvas(300, 150) : makeElement(t); };
  Document.prototype.getElementById = function () { return null; };
  Document.prototype.getElementsByTagName = function () { return []; };
  Document.prototype.querySelector = function () { return null; };
  Document.prototype.querySelectorAll = function () { return []; };

  // tag → [object Xxx] 类名（payload 的检测会读 documentElement/body/canvas 的 toString）
  const TAG2CLASS = {
    a: 'HTMLAnchorElement', abbr: 'HTMLElement', acronym: 'HTMLElement', address: 'HTMLElement',
    applet: 'HTMLUnknownElement', area: 'HTMLAreaElement', article: 'HTMLElement', aside: 'HTMLElement',
    audio: 'HTMLAudioElement', b: 'HTMLElement', base: 'HTMLBaseElement', basefont: 'HTMLElement',
    bdi: 'HTMLElement', bdo: 'HTMLElement', bgsound: 'HTMLUnknownElement', big: 'HTMLElement',
    blink: 'HTMLUnknownElement', blockquote: 'HTMLQuoteElement', body: 'HTMLBodyElement',
    br: 'HTMLBRElement', button: 'HTMLButtonElement', canvas: 'HTMLCanvasElement',
    caption: 'HTMLTableCaptionElement', center: 'HTMLElement', cite: 'HTMLElement', code: 'HTMLElement',
    col: 'HTMLTableColElement', colgroup: 'HTMLTableColElement', content: 'HTMLUnknownElement',
    data: 'HTMLDataElement', datalist: 'HTMLDataListElement', dd: 'HTMLElement',
    decorator: 'HTMLUnknownElement', del: 'HTMLModElement', details: 'HTMLDetailsElement',
    dfn: 'HTMLElement', dialog: 'HTMLDialogElement', dir: 'HTMLDirectoryElement', div: 'HTMLDivElement',
    dl: 'HTMLDListElement', dt: 'HTMLElement', element: 'HTMLUnknownElement', em: 'HTMLElement',
    embed: 'HTMLEmbedElement', fieldset: 'HTMLFieldSetElement', figcaption: 'HTMLElement',
    figure: 'HTMLElement', font: 'HTMLFontElement', footer: 'HTMLElement', form: 'HTMLFormElement',
    frame: 'HTMLFrameElement', frameset: 'HTMLFrameSetElement', h1: 'HTMLHeadingElement',
    h2: 'HTMLHeadingElement', h3: 'HTMLHeadingElement', h4: 'HTMLHeadingElement', h5: 'HTMLHeadingElement',
    h6: 'HTMLHeadingElement', head: 'HTMLHeadElement', header: 'HTMLElement', hgroup: 'HTMLElement',
    hr: 'HTMLHRElement', html: 'HTMLHtmlElement', i: 'HTMLElement', iframe: 'HTMLIFrameElement',
    image: 'HTMLElement', img: 'HTMLImageElement', input: 'HTMLInputElement', ins: 'HTMLModElement',
    isindex: 'HTMLUnknownElement', kbd: 'HTMLElement', keygen: 'HTMLUnknownElement',
    label: 'HTMLLabelElement', legend: 'HTMLLegendElement', li: 'HTMLLIElement', link: 'HTMLLinkElement',
    listing: 'HTMLPreElement', main: 'HTMLElement', map: 'HTMLMapElement', mark: 'HTMLElement',
    marquee: 'HTMLMarqueeElement', menu: 'HTMLMenuElement', menuitem: 'HTMLUnknownElement',
    meta: 'HTMLMetaElement', meter: 'HTMLMeterElement', nav: 'HTMLElement', nobr: 'HTMLElement',
    noembed: 'HTMLElement', noframes: 'HTMLElement', noscript: 'HTMLElement', object: 'HTMLObjectElement',
    ol: 'HTMLOListElement', optgroup: 'HTMLOptGroupElement', option: 'HTMLOptionElement',
    output: 'HTMLOutputElement', p: 'HTMLParagraphElement', param: 'HTMLParamElement',
    plaintext: 'HTMLElement', pre: 'HTMLPreElement', progress: 'HTMLProgressElement',
    q: 'HTMLQuoteElement', rp: 'HTMLElement', rt: 'HTMLElement', rtc: 'HTMLElement', ruby: 'HTMLElement',
    s: 'HTMLElement', samp: 'HTMLElement', script: 'HTMLScriptElement', section: 'HTMLElement',
    select: 'HTMLSelectElement', shadow: 'HTMLUnknownElement', slot: 'HTMLSlotElement',
    small: 'HTMLElement', source: 'HTMLSourceElement', spacer: 'HTMLUnknownElement',
    span: 'HTMLSpanElement', strike: 'HTMLElement', strong: 'HTMLElement', style: 'HTMLStyleElement',
    sub: 'HTMLElement', summary: 'HTMLElement', sup: 'HTMLElement', table: 'HTMLTableElement',
    tbody: 'HTMLTableSectionElement', td: 'HTMLTableCellElement', template: 'HTMLTemplateElement',
    textarea: 'HTMLTextAreaElement', tfoot: 'HTMLTableSectionElement', th: 'HTMLTableCellElement',
    thead: 'HTMLTableSectionElement', time: 'HTMLTimeElement', title: 'HTMLTitleElement',
    tr: 'HTMLTableRowElement', track: 'HTMLTrackElement', tt: 'HTMLElement', u: 'HTMLElement',
    ul: 'HTMLUListElement', var: 'HTMLElement', video: 'HTMLVideoElement', wbr: 'HTMLElement',
    xmp: 'HTMLPreElement',
  };
  const CTOR_CACHE = {};
  function classOf(tag) {
    const t = String(tag).toLowerCase();
    if (TAG2CLASS[t]) return TAG2CLASS[t];
    if (!/^[a-z][a-z0-9]*$/.test(t)) return 'HTMLUnknownElement';
    return 'HTML' + t.charAt(0).toUpperCase() + t.slice(1) + 'Element';
  }

  // 字体度量：指纹层靠 span.offsetWidth/offsetHeight 的偏移差探字体。
  // 这里用真实浏览器采下的表（fp_real.js），保证「检出字体集合」与真实环境一致。
  function fontMetric(family, idx) {
    const parts = String(family || '').split(',').map((x) => x.trim().replace(/^["']|["']$/g, ''));
    const cand = parts[0], base = parts.length > 1 ? parts[parts.length - 1] : '';
    const flat = FP.fontMetricFlat || {}, b = FP.baseMetrics || {};
    // 有实测表时以实测表为准：表内字体与基准不同 ⇒ 被检出；表外字体回落基准 ⇒ 不检出（与真浏览器一致）
    if (base && Object.keys(flat).length) {
      if (flat[cand]) return flat[cand][idx];
      return b[base] ? b[base][idx] : 0;
    }
    const m = FP.fontMetrics || {};
    if (base && m[cand] && m[cand][base]) return m[cand][base][idx];
    if (b[cand]) return b[cand][idx];
    if (base && b[base]) return b[base][idx];
    return 0;
  }

  function makeElement(tag) {
    const t = String(tag).toLowerCase();
    const el = {
      nodeName: t.toUpperCase(), tagName: t.toUpperCase(), nodeType: 1, localName: t,
      style: {}, dataset: {}, children: [], childNodes: [], attributes: [],
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
      id: '', className: '', textContent: '', parentNode: null,
      getAttribute() { return null; }, setAttribute() {}, removeAttribute() {}, hasAttribute() { return false; },
      addEventListener() {}, removeEventListener() {},
      appendChild(c) { if (c) { el.childNodes.push(c); el.children.push(c); c.parentNode = el; } return c; },
      removeChild(c) { return c; },
      getBoundingClientRect() { return { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }; },
      getContext() { return null; },
      getElementsByTagName() { return new HTMLCollection(); },
      querySelector() { return null; }, querySelectorAll() { return new HTMLCollection(); },
      cloneNode() { return makeElement(t); },
      toString() { return '[object ' + classOf(t) + ']'; },
    };
    el.ownerDocument = doc;
    Object.defineProperty(el, 'offsetWidth', { configurable: true, get() { return fontMetric(el.style.fontFamily, 0); } });
    Object.defineProperty(el, 'offsetHeight', { configurable: true, get() { return fontMetric(el.style.fontFamily, 1); } });
    Object.defineProperty(el, 'outerHTML', {
      configurable: true,
      get() { return el.__html !== undefined ? el.__html : '<' + t + '></' + t + '>'; },
    });
    Object.defineProperty(el, 'innerHTML', {
      configurable: true, get() { return ''; }, set(v) { el.__html = '<' + t + '>' + String(v) + '</' + t + '>'; },
    });
    try { Object.defineProperty(el, Symbol.toStringTag, { value: classOf(t), configurable: true }); } catch (e) {}
    // 真机里 el.constructor.name 就是类名（HTMLDivElement 等）；我原来是 Object ⇒ 补一个同名构造器
    try {
      var _cn = classOf(t);
      var _cf = CTOR_CACHE[_cn] || (CTOR_CACHE[_cn] = ({ [_cn]: function () {} })[_cn]);
      Object.defineProperty(el, 'constructor', { value: _cf, configurable: true, writable: true });
    } catch (e) {}
    // 真机 `<a>` / `<area>` 的 String() 是空串（[[DefaultValue]] 走 href），不是 "[object HTMLAnchorElement]"
    if (t === 'a' || t === 'area') {
      try { Object.defineProperty(el, 'toString', { value: function () { return ''; }, configurable: true }); } catch (e) {}
    }
    return el;
  }

  // document.getElementsByTagName('script') 必须长得像 HTMLCollection
  function HTMLCollection(list) {
    list = list || [];
    for (let i = 0; i < list.length; i++) this[i] = list[i];
    this.length = list.length;
  }
  // 合成元素池：真机 getElementsByTagName('div') 等返回真实页面元素（含 innerHTML）
  // ZSE_DIVLEN=<n> 把首个 div 的 innerHTML 撑到 n 字符（真机实测 14319）—— 受控差分实验用
  const _ZH_DIV_BASE = '<div><div class="WechatShareImage"><img src="https://static.zhihu.com/heifetz/assets/wechat-share-logo.png" alt="知乎"></div></div>';
  const _ZH_DIV_HTML = (function () {
    // 目标按 **UTF-8 字节数**算：真机 #19 的 1030 切片长 14319 是**字节数**
    //   （该值 13644 字符 / 含 1013 字节非 ASCII）。按字符截断会差几字节。
    // 默认 14319（真机 #19 的 1030 字节长），使默认配置即对齐真机指纹。
    // ZSE_DIVTEXT：直接用给定文本作为 div[0].innerHTML（真机挑战页实测 35 字符/101 字节）。
    //   优先于 ZSE_DIVLEN 的填充逻辑 —— 真机页面内容随页面而变，不能靠填充模拟。
    if (typeof process !== 'undefined' && process.env && process.env.ZSE_DIVTEXT) {
      return process.env.ZSE_DIVTEXT;
    }
    const want = Number((typeof process !== 'undefined' && process.env && process.env.ZSE_DIVLEN) || 14319);
    const blen = (str) => (typeof Buffer !== 'undefined' ? Buffer.byteLength(str, 'utf8') : str.length);
    if (!want || want <= blen(_ZH_DIV_BASE)) return _ZH_DIV_BASE;
    const filler = '<div class="Card"><span class="ContentItem-title">zhihu content</span></div>';
    let out = _ZH_DIV_BASE;
    while (blen(out) < want) out += filler;
    // 按字节精确截断（填充是纯 ASCII，故按字节截即可）
    while (blen(out) > want) out = out.slice(0, out.length - 1);
    return out;
  })();
  const _ZH_SCRIPT_HTML = 'window.__zhihu_init = function(){return 1};';
  const _SYNTH_POOLS = {};
  function synthTagPool(tag) {
    if (_SYNTH_POOLS[tag]) return _SYNTH_POOLS[tag];
    const n = tag === 'DIV' ? 24 : (tag === 'SCRIPT' ? 12 : 4);
    const out = [];
    for (let i = 0; i < n; i++) {
      const el = doc.createElement ? doc.createElement(tag.toLowerCase()) : { tagName: tag };
      try {
        const ih = tag === 'DIV' ? _ZH_DIV_HTML : (tag === 'SCRIPT' ? _ZH_SCRIPT_HTML : '');
        Object.defineProperty(el, 'innerHTML', { value: ih, configurable: true, writable: true });
        Object.defineProperty(el, 'outerHTML', {
          value: '<' + tag.toLowerCase() + '>' + ih + '</' + tag.toLowerCase() + '>',
          configurable: true, writable: true,
        });
        Object.defineProperty(el, 'textContent', { value: ih.replace(/<[^>]*>/g, ''), configurable: true });
        Object.defineProperty(el, 'className', { value: '', configurable: true });
      } catch (e) {}
      out.push(el);
    }
    _SYNTH_POOLS[tag] = out;
    return out;
  }

  HTMLCollection.prototype.item = function (i) { return this[i] !== undefined ? this[i] : null; };
  HTMLCollection.prototype.namedItem = function () { return null; };
  HTMLCollection.prototype.toString = function () { return '[object HTMLCollection]'; };
  try { Object.defineProperty(HTMLCollection.prototype, Symbol.toStringTag, { value: 'HTMLCollection', configurable: true }); } catch (e) {}

  // ---------- document ----------
  Object.assign(doc, {
    nodeName: '#document', nodeType: 9, readyState: 'complete', title: '知乎 - 有问题，就会有答案',
    characterSet: 'UTF-8', charset: 'UTF-8', contentType: 'text/html',
    referrer: '', domain: 'www.zhihu.com', URL: location.href, documentURI: location.href,
    baseURI: 'https://www.zhihu.com/',
    compatMode: 'CSS1Compat', visibilityState: 'visible', hidden: false, hasFocus() { return true; },
    cookie: '',
    all: new HTMLAllCollection(),
    documentElement: makeElement('html'),
    head: makeElement('head'), body: makeElement('body'),
    location,
    defaultView: g,
    createElement(t) { return t === 'canvas' ? makeCanvas(300, 150) : makeElement(t); },
    createElementNS(_ns, t) { return t === 'canvas' ? makeCanvas(300, 150) : makeElement(t); },
    createTextNode(t) { return { nodeName: '#text', nodeType: 3, data: String(t), textContent: String(t) }; },
    createDocumentFragment() { return makeElement('#fragment'); },
    createEvent() { return { initEvent() {}, initCustomEvent() {} }; },
    getElementById() { return null; },
    getElementsByTagName(t) {
      const tag = String(t).toUpperCase();
      const pool = [doc.documentElement, doc.head, doc.body];
      const found = pool.filter((el) => el && String(el.tagName).toUpperCase() === tag);
      if (found.length) return new HTMLCollection(found);
      // 真机页面里有大量元素，Go VM 会读 `document.getElementsByTagName('div')[i].innerHTML`
      //   并拿到**真实页面 HTML**（实测原浏览器返回
      //   '<div><div class="WechatShareImage"><img src="https://static.zhihu.com/heifetz/assets/...'）。
      //   我原来返回空集合 ⇒ [0] 是 undefined ⇒ innerHTML 读到 undefined ⇒ 位图位判错。
      return new HTMLCollection(synthTagPool(tag));
    },
    getElementsByClassName() { return new HTMLCollection(); },
    getElementsByName() { return new HTMLCollection(); },
    querySelector() { return null; },
    // CVM 层 case108/136 守卫：Function("a","try{return !!document.querySelectorAll(a)+1}catch(_){return 1}")
    //   以 ":defined" / "div:not(:has(div))" 调用，结果 !== 2 就置 l[7] bit13/bit12 ⇒ 必须返回非空集合
    querySelectorAll(sel) {
      const s = String(sel);
      if (s.indexOf(':defined') >= 0) return new HTMLCollection([doc.documentElement, doc.head, doc.body]);
      if (s.indexOf(':has(') >= 0 || s.indexOf(':not(') >= 0) return new HTMLCollection([doc.body]);
      return new HTMLCollection();
    },
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
    write() {}, writeln() {}, open() {}, close() {},
    getSelection() { return { toString() { return ''; } }; },
    elementFromPoint() { return null; },
    createTreeWalker() { return { currentNode: null, nextNode() { return null; } }; },
    // CVM 层 case157 是 document.createNodeIterator(document.body)，随后逐项 typeof 查
    //   root/filter/whatToShow/detach。缺这个方法会让整条 CVM 链在 case157 抛异常 ⇒ qh 永不写入。
    createNodeIterator(root, whatToShow, filter) {
      const o = {
        root: root === undefined ? doc.documentElement : root,
        whatToShow: whatToShow === undefined ? 0xFFFFFFFF : whatToShow,
        filter: filter === undefined ? null : filter,
        referenceNode: root === undefined ? doc.documentElement : root,
        pointerBeforeReferenceNode: true,
        detach() {}, nextNode() { return null; }, previousNode() { return null; },
      };
      // 扰动开关：CVM 守卫 `typeof nodeIterator.filter === "undefined"` 会置 l[7] 的某一位，
      //   用它来反查该位落在位图哪个字（ZSE_NI_NOFILTER=1 时故意不给 filter）。
      if (process.env.ZSE_NI_NOFILTER === '1') delete o.filter;
      // 真机 String(document.createNodeIterator(...)) = "[object NodeIterator]"
      try { Object.defineProperty(o, Symbol.toStringTag, { value: 'NodeIterator', configurable: true }); } catch (e) {}
      return o;
    },
    createExpression() { return { evaluate() { return { snapshotLength: 0, iterateNext() { return null; } }; } }; },
    createRange() { return makeRange(); },
  });

  // DOM Range 全套 —— 服务程序会逐项 typeof 检查这些成员（缺失会置位进环境位图）
  function makeRange() {
    const r = {
      startContainer: null, endContainer: null, startOffset: 0, endOffset: 0,
      collapsed: true, commonAncestorContainer: null,
      setStart() {}, setEnd() {}, setStartBefore() {}, setStartAfter() {},
      setEndBefore() {}, setEndAfter() {}, selectNode() {}, selectNodeContents() {},
      collapse() {}, cloneContents() { return doc.createDocumentFragment ? doc.createDocumentFragment() : {}; },
      cloneRange() { return makeRange(); }, deleteContents() {}, detach() {}, extractContents() { return {}; },
      insertNode() {}, surroundContents() {}, compareBoundaryPoints() { return 0; },
      comparePoint() { return 0; }, intersectsNode() { return false; }, isPointInRange() { return false; },
      getBoundingClientRect() { return { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }; },
      getClientRects() { return []; },
    };
    // 扰动开关：故意删掉一组 Range 方法，用来反查 CVM 的 `typeof range.X === "undefined"`
    //   守卫到底置的是位图哪个字/哪一位（ZSE_RANGE_DROP=getClientRects,insertNode,...）。
    if (process.env.ZSE_RANGE_DROP) {
      for (const k of process.env.ZSE_RANGE_DROP.split(',')) { try { delete r[k]; } catch (e) {} }
    }
    try { Object.defineProperty(r, Symbol.toStringTag, { value: 'Range', configurable: true }); } catch (e) {}
    return r;
  }

  // document.all 在真实浏览器里是「全部元素」的集合，[0] = <html>
  // payload l[3] bit0 的守卫是 `document.all.length < 4`（真机长度远大于 4）⇒ 元素数不能只有 3 个。
  var _allList = [doc.documentElement, doc.head, doc.body,
    doc.createElement('div'), doc.createElement('script'), doc.createElement('style')];
  // 真机语义：typeof document.all === "undefined"、!!document.all === false、但可调用可索引。
  //   纯 JS 造不出这个 internal slot（handenv 之前只能用「前 N 次返回 undefined」的有状态 getter 近似，
  //   一旦守卫读取顺序变化就失效）⇒ 改用 native addon 的 [[IsHTMLDDA]]。
  //   ZSE_NOALLNATIVE=1 可退回旧的 HTMLAllCollection 形态做对拍。
  if (ZSE_NATIVE && process.env.ZSE_NOALLNATIVE !== '1') {
    doc.all = ZSE_NATIVE.makeUndetectable(_allList, 'HTMLAllCollection', HTMLAllCollection.prototype);
  } else {
    doc.all = new HTMLAllCollection(_allList);
  }

  // ---------- Blob / URL.createObjectURL / Worker ----------
  // cvm.decompiled.js 里有一条真守卫：
  //   try{const worker=new Worker(URL.createObjectURL(new Blob(["self.onmessage = function(e) {self.postMessage(new Error().stack);}"],{type:"application/javascript"})));
  //       worker.postMessage("");worker.onmessage=function(e){__g.worker=e};return 1}catch(_){return 2}
  //   真机返回 1 并把 Worker 里的 Error().stack 存进 __g.worker；我原来的 stub 返回 2
  //   （Blob.size=0、Object.prototype.toString 是 [object Object]、Node 的 URL.createObjectURL 拒收 ⇒ 抛错）。
  function BLOB_CTOR(parts, opts) {
    parts = parts || [];
    this._parts = [];
    var n = 0;
    for (var i = 0; i < parts.length; i++) { var t = String(parts[i]); this._parts.push(t); n += Buffer.byteLength(t, 'utf8'); }
    this.size = n;
    this.type = (opts && opts.type) || '';
  }
  try { Object.defineProperty(BLOB_CTOR.prototype, Symbol.toStringTag, { value: 'Blob', configurable: true }); } catch (e) {}
  BLOB_CTOR.prototype.text = function () { return Promise.resolve(this._parts.join('')); };
  BLOB_CTOR.prototype.arrayBuffer = function () { return Promise.resolve(new ArrayBuffer(this.size)); };
  BLOB_CTOR.prototype.slice = function () { return new BLOB_CTOR(this._parts); };

  var _OBJURLS = Object.create(null);
  var _OBJSEQ = 0;
  function URL_STUB(url, base) { return new (require('url').URL)(url, base); }
  URL_STUB.createObjectURL = function (b) {
    if (!(b instanceof BLOB_CTOR)) throw new TypeError('Failed to execute \'createObjectURL\' on \'URL\': parameter 1 is not of type \'Blob\'.');
    var id = 'blob:https://www.zhihu.com/' + (++_OBJSEQ).toString(16) + '-' + Math.floor(Math.random() * 0xffffffff).toString(16);
    _OBJURLS[id] = b;
    return id;
  };
  URL_STUB.revokeObjectURL = function (u) { delete _OBJURLS[u]; };
  try { Object.defineProperty(URL_STUB, 'name', { value: 'URL', configurable: true }); } catch (e) {}
  URL_STUB.prototype = (typeof URL !== 'undefined' && URL.prototype) || {};
  try { Object.setPrototypeOf(URL_STUB, typeof URL !== 'undefined' ? URL : Function.prototype); } catch (e) {}

  // 真机 Worker 里 `new Error().stack` 的形态：脚本来自 blob: URL
  function workerStack(objUrl) {
    return 'self.onmessage@' + objUrl + ':1:37';
  }
  function WORKER_CTOR(url, opts) {
    this.url = String(url);
    this.onmessage = null; this.onerror = null; this.onmessageerror = null;
    this._ls = {};
  }
  try { Object.defineProperty(WORKER_CTOR.prototype, Symbol.toStringTag, { value: 'Worker', configurable: true }); } catch (e) {}
  WORKER_CTOR.prototype.postMessage = function () {
    var self = this;
    // 真机是异步投递 ⇒ 用微任务（沙箱里的 setTimeout 是 mock，不可靠）
    Promise.resolve().then(function () {
      var ev = { data: workerStack(self.url), type: 'message', target: self };
      try { if (typeof self.onmessage === 'function') self.onmessage(ev); } catch (e) {}
      var ls = self._ls['message'] || [];
      for (var i = 0; i < ls.length; i++) { try { ls[i](ev); } catch (e) {} }
    });
  };
  WORKER_CTOR.prototype.terminate = function () {};
  WORKER_CTOR.prototype.addEventListener = function (t, f) { (this._ls[t] = this._ls[t] || []).push(f); };
  WORKER_CTOR.prototype.removeEventListener = function (t, f) {
    var a = this._ls[t] || []; var i = a.indexOf(f); if (i >= 0) a.splice(i, 1);
  };

  // 诊断开关 ZSE_ADDPROPS=1：把 H 序列里 27 个「查不到」的名字补到几个候选接收者上，
  //   看位图是否变化 ⇒ 判定这些查找的接收者是谁、是否喂位图。
  if (process.env.ZSE_ADDPROPS) {
    var NAMES = ['body','root','filter','detach','whatToShow','createRange','cloneRange','cloneContents',
      'collapse','collapsed','commonAncestorContainer','compareBoundaryPoints','comparePoint','endOffset',
      'extractContents','getBoundingClientRect','getClientRects','insertNode','intersectsNode','isPointInRange',
      'selectNode','selectNodeContents','setEnd','setEndAfter','setEndBefore','setStart','setStartAfter',
      'setStartBefore','startContainer','createNodeIterator'];
    var _ALLT = { location: location, history: history, navigator: navigator, screen: screen, doc: doc, ls: localStorage, ss: sessionStorage };
    var _sel = String(process.env.ZSE_ADDPROPS);
    var TARGETS = (_sel === '1') ? [_ALLT.location, _ALLT.history, _ALLT.navigator, _ALLT.screen, _ALLT.doc, _ALLT.ls, _ALLT.ss]
                                : (_ALLT[_sel] ? [_ALLT[_sel]] : []);
    for (var _t = 0; _t < TARGETS.length; _t++) {
      var _o = TARGETS[_t];
      if (!_o) continue;
      for (var _n = 0; _n < NAMES.length; _n++) {
        // 只补「原本不存在」的名字，避免把 document.body / document.createRange 这类真属性覆盖掉
        var _had = false;
        try { _had = (NAMES[_n] in _o); } catch (e) { _had = true; }
        if (_had) continue;
        try { Object.defineProperty(_o, NAMES[_n], { value: 1, configurable: true, writable: true }); } catch (e) {}
      }
    }
  }

  if (ZSE_NATIVE) { try { g.__zseenv = ZSE_NATIVE; } catch (e) {} }

  // ---------- Go 侧守卫扰动开关（用于反查哪条 Go 检查喂给位图的哪个字） ----------
  //   ZSE_ALLTAG=值   → document.all[0].tagName 改成该值
  //   ZSE_ALLSTR=值   → document.all.toString() 返回该值
  //   ZSE_CANVSTR=值  → createElement('canvas').toString() 返回该值
  if (process.env.ZSE_ALLTAG) { try { Object.defineProperty(_allList[0], 'tagName', { get: function () { return process.env.ZSE_ALLTAG; }, configurable: true }); } catch (e) {} }
  if (process.env.ZSE_ALLSTR) { try { Object.defineProperty(doc.all, 'toString', { value: function () { return process.env.ZSE_ALLSTR; }, configurable: true }); } catch (e) {} }
  if (process.env.ZSE_CANVSTR) { try { var _cv = doc.createElement('canvas'); Object.defineProperty(_cv, 'toString', { value: function () { return process.env.ZSE_CANVSTR; }, configurable: true }); var _oce = doc.createElement; doc.createElement = function (t) { return t === 'canvas' ? _cv : _oce.call(doc, t); }; } catch (e) {} }

  // ---------- window ----------
  // 真机里这些对象的 Object.prototype.toString 走 Symbol.toStringTag：
  //   window → "[object Window]"、document → "[object HTMLDocument]"、navigator → "[object Navigator]" …
  //   我原来全是 "[object Object]" ⇒ payload 里 `String(window).indexOf("Window")` 一类的守卫会误判。
  function tag(obj, name) {
    try { Object.defineProperty(obj, Symbol.toStringTag, { value: name, configurable: true }); } catch (e) {}
  }
  tag(g, 'Window');
  tag(doc, 'HTMLDocument');
  tag(navigator, 'Navigator');
  tag(screen, 'Screen');
  tag(location, 'Location');
  tag(history, 'History');
  tag(localStorage, 'Storage');
  tag(sessionStorage, 'Storage');

  Object.assign(g, {
    window: g, self: g, top: g, parent: g, frames: g, globalThis: g,
    document: doc, navigator, screen, location, history,
    localStorage, sessionStorage, console: consoleObj,
    name: '', closed: false, length: 0, devicePixelRatio: 1.25, innerWidth: 1920, innerHeight: 969,
    outerWidth: 1920, outerHeight: 1040, screenX: 0, screenY: 0, screenLeft: 0, screenTop: 0,
    pageXOffset: 0, pageYOffset: 0, scrollX: 0, scrollY: 0, isSecureContext: true, origin: location.origin,
    XMLHttpRequest, Document, HTMLAllCollection, HTMLCollection,
    customElements: { define() {}, get() { return undefined; }, whenDefined() { return Promise.resolve(); }, upgrade() {}, getName() { return null; } },
    print() {}, open() { return null; }, stop() {}, _encrypt: 1,
    WebGLRenderingContext: function () {}, WebGL2RenderingContext: function () {},
    CanvasRenderingContext2D: function () {}, HTMLCanvasElement: function () {}, OffscreenCanvas: undefined,
    Element: function () {}, HTMLElement: function () {}, Node: function () {}, Event: function () {},
    Image: function () { return makeElement('img'); },
    Audio: function () { return makeElement('audio'); },
    MediaSource: { isTypeSupported(t) { return /video\/mp4|audio\/mp4|audio\/webm/.test(String(t)); }, addEventListener() {}, removeEventListener() {} },
    SourceBuffer: function () {}, ManagedMediaSource: undefined,
    RTCPeerConnection: function () { this.createDataChannel = () => ({}); this.createOffer = () => Promise.resolve({ type: 'offer', sdp: '' }); this.setLocalDescription = () => Promise.resolve(); this.close = () => {}; },
    webkitRTCPeerConnection: undefined,
    indexedDB: { open() { return {}; }, deleteDatabase() { return {}; } },
    caches: { open() { return Promise.resolve({ match() { return Promise.resolve(undefined); } }); } },
    matchMedia(q) { return { matches: false, media: String(q), addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, onchange: null }; },
    getComputedStyle(el) { return { getPropertyValue() { return ''; }, length: 0 }; },
    requestAnimationFrame(cb) { return setTimeout(() => cb(Date.now()), 16); },
    cancelAnimationFrame(id) { clearTimeout(id); },
    setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask,
    atob: (s) => Buffer.from(String(s), 'base64').toString('binary'),
    btoa: (s) => Buffer.from(String(s), 'binary').toString('base64'),
    fetch: require('./livefetch.js').fetch,   // 真 fetch：wasm(Go) 靠它拉每会话挑战 JS
    postMessage() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
    open() { return null; }, close() {}, focus() {}, blur() {}, print() {}, stop() {}, alert() {}, confirm() { return false; }, prompt() { return null; },
    scrollTo() {}, scrollBy() {}, moveTo() {}, resizeTo() {}, resizeBy() {},
    performance: { now: () => Number(process.hrtime.bigint() / 1000n) / 1000, timeOrigin: Date.now(), memory: { jsHeapSizeLimit: 4294705152, totalJSHeapSize: 2e7, usedJSHeapSize: 1.5e7 } },
    crypto: require('crypto').webcrypto,
    structuredClone: (x) => JSON.parse(JSON.stringify(x)),
    EventTarget: function () {}, CustomEvent: function () {},
    Blob: BLOB_CTOR,
    FileReader: function () {}, URL: URL_STUB, URLSearchParams, TextEncoder, TextDecoder,
    AbortController: function () { this.signal = {}; this.abort = () => {}; },
    Worker: WORKER_CTOR,
    SharedWorker: undefined, ServiceWorker: undefined,
    Notification: undefined, WebSocket: function () { this.close = () => {}; this.send = () => {}; },
    chrome: { runtime: {}, loadTimes: () => ({}), csi: () => ({}), app: { isInstalled: false } },
    webkitRequestFileSystem: undefined,
    styleMedia: { type: 'screen', matchMedium() { return false; } },
    visualViewport: { width: 1920, height: 969, scale: 1, offsetLeft: 0, offsetTop: 0, pageLeft: 0, pageTop: 0, addEventListener() {}, removeEventListener() {} },
    SpeechSynthesisUtterance: function () {}, speechSynthesis: { getVoices: () => [], speaking: false, pending: false, paused: false },
    DeviceOrientationEvent: function () {}, DeviceMotionEvent: function () {},
    TouchEvent: function () {}, PointerEvent: function () {}, MouseEvent: function () {}, KeyboardEvent: function () {},
    MutationObserver: function () { this.observe = () => {}; this.disconnect = () => {}; this.takeRecords = () => []; },
    IntersectionObserver: function () { this.observe = () => {}; this.disconnect = () => {}; },
    ResizeObserver: function () { this.observe = () => {}; this.disconnect = () => {}; },
    onerror: null, onload: null, onunload: null, onbeforeunload: null, onmessage: null, onfocus: null, onblur: null,
  });
  g.window = g;
  // 扰动开关：把 document 改成可写，让 SRC0 里的 `document={}` 真正生效 ⇒ createElement 消失
  //   ⇒ SRC0 抛错返回 2 ⇒ 触发 CVM 守卫 `new Function(SRC0)() > 1`。用来反查该位落在位图哪个字。
  if (process.env.ZSE_WDOC === '1') {
    try { Object.defineProperty(g, 'document', { value: doc, writable: true, configurable: true, enumerable: true }); } catch (e) {}
  }
  // 扰动开关：删掉指定属性，反查守卫（`typeof X === "undefined"`）落在位图哪个字/位。
  //   ZSE_DROP_LOC=hostname   ZSE_DROP_WIN=blur,devicePixelRatio
  if (process.env.ZSE_DROP_LOC) {
    for (const k of process.env.ZSE_DROP_LOC.split(',')) { try { delete location[k]; } catch (e) {} }
  }
  if (process.env.ZSE_DROP_XHR) {
    for (const k of process.env.ZSE_DROP_XHR.split(',')) { try { delete XMLHttpRequest[k]; } catch (e) {} }
  }
  if (process.env.ZSE_DROP_WIN) {
    for (const k of process.env.ZSE_DROP_WIN.split(',')) { try { delete g[k]; } catch (e) {} }
  }
  // `window`/`document` 必须是只读全局：载荷里有 `window={};document={}`，
  //   真浏览器里这是静默失败（它们在 Window 上是只读属性）；
  //   可写环境下会把全局清空、之后整层 JS 崩（见下面的无条件循环）。

  // payload 的 `native` 检测：对 setTimeout/setInterval/window.stop/print/open 等
  //   做 `String(fn).indexOf('native')`，非原生会置位（`Function.prototype.constructor`
  //   那一条甚至直接 return 2 退出）。Node 的 setTimeout 是 JS 实现 ⇒ 必须补成原生形态。
  function nativeFn(name, impl) {
    const f = function () { return impl.apply(this, arguments); };
    try {
      Object.defineProperty(f, 'name', { value: name, configurable: true });
      Object.defineProperty(f, 'length', { value: impl.length, configurable: true });
      Object.defineProperty(f, 'toString', {
        value: function () { return 'function ' + name + '() { [native code] }'; },
        configurable: true, writable: true, enumerable: false,
      });
    } catch (e) {}
    // 同时登记进 native addon 的注册表 ⇒ Function.prototype.toString.call(f) 也返回 native 形态
    //   （自有 toString 会被 Function.prototype.toString.call 绕过，这是纯 JS 补不了的）
    if (ZSE_NATIVE) { try { ZSE_NATIVE.registerNative(f, name); } catch (e) {} }
    return f;
  }
  // 原生形态：payload 层 v6 的 bit5/bit4 来自
  //   `setTimeout.toString().indexOf("native") === -1` 与 `setInterval` 同样的检查。
  //   Node 的 setTimeout 是 JS 实现（不含 "native"）⇒ 必须包成原生形态，
  //   否则 w4 会多出 0x30，会话被反自动化层标记（见 docs/BITMAP.md §5）。
  const ZSE_ST_NATIVE = process.env.ZSE_ST_NATIVE !== '0';
  const _st = setTimeout, _ct = clearTimeout, _si = setInterval, _ci = clearInterval;
  const _stNative = (process.env.ZSE_ST_NATIVE !== '0');
  g.setTimeout = _stNative ? nativeFn('setTimeout', function (cb, ms) { return _st(cb, ms); }) : _st;
  g.setInterval = _stNative ? nativeFn('setInterval', function (cb, ms) { return _si(cb, ms); }) : _si;
  g.clearTimeout = ZSE_ST_NATIVE ? nativeFn('clearTimeout', function (id) { return _ct.call(null, id); }) : _ct;
  g.clearInterval = ZSE_ST_NATIVE ? nativeFn('clearInterval', function (id) { return _ci.call(null, id); }) : _ci;
  g.requestAnimationFrame = nativeFn('requestAnimationFrame', function (cb) { return _st(function () { cb(Date.now()); }, 16); });
  g.cancelAnimationFrame = nativeFn('cancelAnimationFrame', function (id) { return _ct.call(null, id); });
  g.atob = nativeFn('atob', function (x) { return Buffer.from(String(x), 'base64').toString('binary'); });
  g.btoa = nativeFn('btoa', function (x) { return Buffer.from(String(x), 'binary').toString('base64'); });
  g.fetch = nativeFn('fetch', function () { return require('./livefetch.js').fetch.apply(null, arguments); });
  for (const nm of ['stop', 'print', 'open', 'close', 'focus', 'blur', 'alert', 'confirm', 'prompt',
                    'scrollTo', 'scrollBy', 'moveTo', 'resizeTo', 'resizeBy', 'postMessage']) {
    if (typeof g[nm] === 'function') g[nm] = nativeFn(nm, g[nm]);
  }
  for (const nm of ['getComputedStyle', 'matchMedia']) {
    if (typeof g[nm] === 'function') g[nm] = nativeFn(nm, g[nm]);
  }

  // wasm 探针 #141 验真：window.constructor.toString() 必须是【原生 Window 形态】，
  // 否则会返回 "function Object() { [native code] }" 而被判定为 mock 环境。
  function Window() {}
  try {
    Object.defineProperty(Window, 'name', { value: 'Window', configurable: true });
    Object.defineProperty(Window, 'toString', {
      value: function () { return 'function Window() { [native code] }'; },
      configurable: true, writable: true, enumerable: false,
    });
  } catch (e) {}
  try {
    Object.defineProperty(g, 'constructor', { value: Window, enumerable: false, configurable: true, writable: true });
  } catch (e) {}

  // inner 层 l[4] bit14/13/12/11 守卫：new XMLHttpRequest() 必须带上 XHR 常量
  for (const [k, v] of [['UNSENT', 0], ['OPENED', 1], ['HEADERS_RECEIVED', 2], ['LOADING', 3], ['DONE', 4]]) {
    XMLHttpRequest.prototype[k] = v; XMLHttpRequest[k] = v;
  }
  XMLHttpRequest.UNSENT = 0; XMLHttpRequest.OPENED = 1; XMLHttpRequest.HEADERS_RECEIVED = 2;
  XMLHttpRequest.LOADING = 3; XMLHttpRequest.DONE = 4;

  // inner 层 l[3] bit5 守卫：String(window.XMLDocument).indexOf("native") === -1
  g.XMLDocument = nativeFn('XMLDocument', function () {});
  // inner 层 l[3] bit4 守卫：typeof window.find === "undefined"（Firefox/Chrome 都有 window.find）
  g.find = nativeFn('find', function () { return false; });

  // 浏览器里这些全局是不可写的：脚本 `window = {}` / `document = {}` 会静默失败。
  // payload 的检测正是用 new Function 里的赋值来验真伪（不可写才返回真 document）。
  for (const k of ['window', 'document', 'location', 'navigator', 'self', 'top', 'parent', 'frames']) {
    try { Object.defineProperty(g, k, { value: g[k], writable: false, configurable: true, enumerable: true }); } catch (e) {}
  }

  // ZSE_FREEZE=<ms>：冻结 performance.now() 与 Date.now()，用于判定 ck 里有没有时间量
  if (process.env.ZSE_FREEZE) {
    const t = Number(process.env.ZSE_FREEZE);
    g.performance = { now: () => t, timeOrigin: 0, memory: (g.performance && g.performance.memory) || {} };
    const RD = Date;
    function FD(...a) { return a.length === 0 ? new RD(t) : new RD(...a); }
    FD.now = () => t; FD.parse = RD.parse; FD.UTC = RD.UTC; FD.prototype = RD.prototype;
    try { Object.defineProperty(g, 'Date', { value: FD, configurable: true, writable: true }); } catch (e) {}
  }

  // 实验开关：把 document.all 变成 getter 返回 undefined（让 typeof === "undefined"，模拟真浏览器 IsHTMLDDA）
  if (process.env.ZSE_ALLUNDEF === '1') {
    try { Object.defineProperty(g.document, 'all', { get: function () { return undefined; }, configurable: true }); } catch (e) {}
  }
  // 2026-10-07 新增：真浏览器 document.all 是 IsHTMLDDA —— `typeof` 返回 "undefined"，
  //   但它同时可索引、`.length` 是 number。纯 JS 造不出该槽，但守卫是**按固定顺序**读的：
  //   先 `typeof document.all`（要 undefined），后 `document.all.length`（要 number）。
  //   这里用「前 N 次读返回 undefined、之后返回真集合」的有状态 getter 去对齐顺序。
  {
    const _allN = Number(process.env.ZSE_ALLN || 0);
    if (_allN > 0) {
      const _realAll = g.document.all;
      let _seen = 0;
      try {
        Object.defineProperty(g.document, 'all', {
          get: function () { _seen++; return _seen <= _allN ? undefined : _realAll; },
          configurable: true,
        });
      } catch (e) {}
    }
  }

  // Firefox 形态的 Error.stack（V8 的 prepareStackTrace）：fn@url:line:col
  //   真浏览器里 zh 第2段是 base64 调用栈，每帧都带构建脚本真实 URL；V8 默认形态
  //   (`at fn (url:...)`) 与 Firefox (`fn@url:...`) 不同，且我的栈里是 evalmachine.<anonymous>。
  try {
    var _pst = function (err, frames) {
      var out = String(err) + '\n';
      for (var i = 0; i < frames.length; i++) {
        var f = frames[i], fn = '', url = '', ln = 0, col = 0;
        try { fn = f.getFunctionName() || ''; } catch (e) {}
        try { url = f.getFileName() || ''; } catch (e) {}
        try { ln = f.getLineNumber() || 0; } catch (e) {}
        try { col = f.getColumnNumber() || 0; } catch (e) {}
        if (process.env.ZSE_STACK_URL && (!url || url.indexOf('evalmachine') >= 0 || url === 'eval')) url = process.env.ZSE_STACK_URL;
        out += fn + '@' + url + (url ? (':' + ln + ':' + col) : '') + '\n';
      }
      return out;
    };
    try { Object.defineProperty(g.Error, 'prepareStackTrace', { value: _pst, configurable: true, writable: true }); } catch (e) {}
  } catch (e) {}

  return g;
}

module.exports = { createEnv, UA };
