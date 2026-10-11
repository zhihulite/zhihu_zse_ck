// 功能性验证：在 mock 浏览器环境里跑还原件，确认可执行且产出 32-hex MD5
const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync('env_detect.restored.js', 'utf8');

const el = () => ({
  style: {}, width: 0, height: 0, innerHTML: '', offsetWidth: 100, offsetHeight: 20,
  getContext: (t) => ({
    textBaseline: '', fillStyle: '', font: '',
    fillRect() { }, fillText() { }, beginPath() { }, arc() { }, closePath() { }, fill() { },
  }),
  toDataURL: () => 'data:image/png;base64,AAAA',
});

const sandbox = {
  window: null,
  document: {
    createElement: el,
    getElementsByTagName: () => [{ appendChild() { }, removeChild() { } }],
  },
  navigator: { hardwareConcurrency: 8, plugins: [{ name: 'PDF Viewer' }, { name: 'Chrome PDF Viewer' }] },
  Math, JSON, parseInt, String, Array, Object, Error,
};
sandbox.window = sandbox;
sandbox.window.navigator = sandbox.navigator;
sandbox.globalThis = sandbox;

// WebGL mock
const origCreate = sandbox.document.createElement;
sandbox.document.createElement = (t) => {
  const e = origCreate(t);
  if (t === 'canvas') {
    e.getContext = (k) => k === '2d' ? {
      textBaseline: '', fillStyle: '', font: '',
      fillRect() { }, fillText() { }, beginPath() { }, arc() { }, closePath() { }, fill() { },
    } : {
      getExtension: () => ({ UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 }),
      getParameter: (p) => p === 37445 ? 'Mozilla' : 'MockRenderer',
    };
  }
  return e;
};

vm.createContext(sandbox);
try {
  vm.runInContext('var __out = (function(){ ' + src + ' })();', sandbox, { timeout: 20000 });
} catch (e) {
  console.log('RUN ERROR:', e.message);
  process.exit(1);
}
const out = sandbox.__out;
console.log('collectEnvParts() ->', out);
console.log('is 32-hex md5 :', /^[0-9a-f]{32}$/.test(out));
