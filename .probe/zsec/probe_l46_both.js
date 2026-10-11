const vm = require('vm');
const { createEnv } = require('./handenv.js');
const sandbox = createEnv(); sandbox.globalThis = sandbox;
delete sandbox.process; delete sandbox.global; delete sandbox.Buffer;
const ctx = vm.createContext(sandbox, { name: 'l46' });
for (const k of ['Object','Array','String','Math','JSON','Function','Proxy','Reflect','Symbol','Date','RegExp','Number','Boolean','parseInt','Error','Map','Set','XMLHttpRequest','localStorage','sessionStorage','navigator','screen','history','location','performance','crypto']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch (e) {} }
}
const C = [
 ['l4 b14 docEl HTMLHtmlElement', 'String(document.documentElement).indexOf("HTMLHtmlElement") === -1'],
 ['l4 b13 gEBTN Collection',      'String(document.getElementsByTagName("script")).indexOf("Collection") === -1'],
 ['l4 b11 createElement.bind',    'typeof document.createElement.bind("script") === "undefined"'],
 ['l4 b9 canvas.style',           'typeof document.createElement("canvas").style === "undefined"'],
 ['l4 b6 document.baseURI',       'typeof document.baseURI === "undefined"'],
 ['l4 b5 baseURI zhihu',          'String(document.baseURI).indexOf("zhihu") === -1'],
 ['l4 b4 document.charset',       'typeof document.charset === "undefined"'],
 ['l4 b3 document.body',          'typeof document.body === "undefined"'],
 ['l4 b2 body HTMLBodyElement',   'String(document.body).indexOf("HTMLBodyElement") === -1'],
 ['l5 b14 canvas.getContext',     'typeof document.createElement("canvas").getContext === "undefined"'],
 ['l5 b13 ctx2d CanvasRenderingContext2D', 'String(document.createElement("canvas").getContext("2d")).indexOf("CanvasRenderingContext2D") === -1'],
 ['l5 b12 canvas.width',          'typeof document.createElement("canvas").width === "undefined"'],
 ['l5 b11 canvas.height',         'typeof document.createElement("canvas").height === "undefined"'],
 ['l5 b9/8 canvas.outerHTML',     'String(document.createElement("canvas").outerHTML).indexOf("canvas") === -1'],
 ['l5 b7 window.buffer',          'typeof window.buffer === "undefined"'],
 ['l5 b6 window.emit',            'typeof window.emit === "undefined"'],
 ['l5 b3/2/1 localStorage.setItem','typeof localStorage.setItem === "undefined"'],
 ['l6 b13 Document.all',          'typeof Document.all === "undefined"'],
 ['l6 window.callPhantom',        'typeof window.callPhantom === "undefined"'],
 ['l6 window._phantom',           'typeof window._phantom === "undefined"'],
 ['l6 window.webdriver',          'typeof window.webdriver === "undefined"'],
 ['l6 window.__webdriver_script_fn','typeof window.__webdriver_script_fn === "undefined"'],
 ['l6 window._resourceLoader',    'typeof window._resourceLoader === "undefined"'],
 ['l6 window._sessionHistory',    'typeof window._sessionHistory === "undefined"'],
 ['l6 window._virtualConsole',    'typeof window._virtualConsole === "undefined"'],
 ['l6 document.all.length num',   'typeof document.all.length !== "number"'],
];
const js = `(function(){ var C=${JSON.stringify(C)}; var o={}; for (var i=0;i<C.length;i++){ var r; try { r = eval(C[i][1]); } catch(e){ r='THROW:'+e.message; } o[C[i][0]] = (r===true); } return JSON.stringify(o); })()`;
const mine = JSON.parse(vm.runInContext(js, ctx));
const REAL = ["l5 b7 window.buffer","l5 b6 window.emit","l6 b13 Document.all","l6 window.callPhantom","l6 window._phantom","l6 window.webdriver","l6 window.__webdriver_script_fn","l6 window._resourceLoader","l6 window._sessionHistory","l6 window._virtualConsole"];
console.log('%-42s %-6s %-6s %s' % ('守卫', '我', '真浏览器', '判定'));
let anomalies = [];
for (const [n, e] of C) {
  const m = mine[n] === true, r = REAL.indexOf(n) >= 0;
  const tag = (m === r) ? '一致' : (m ? '我多命中' : '我真命中');
  if (m !== r) anomalies.push(n);
  console.log('%-42s %-6s %-6s %s' % (n, m, r, tag));
}
console.log('');
console.log('真异常（两边不一致）共 %d 条: %s' % (anomalies.length, JSON.stringify(anomalies)));