// 逐条求值 payload 层「字符串内容」型守卫
const vm = require('vm');
const { createEnv } = require('./handenv.js');
const sandbox = createEnv(); sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'ps' });
for (const k of ['Object','Array','String','Math','JSON','Function','Proxy','Reflect','Symbol','Date','RegExp','Number','Boolean','parseInt','Error','Map','Set']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch (e) {} }
}
const CHECKS = [
  ['l4 bit14 documentElement.toString().indexOf("HTMLHtmlElement")',
   'String(document.documentElement).indexOf("HTMLHtmlElement") === -1'],
  ['l4 bit13 getElementsByTagName("script").toString().indexOf("Collection")',
   'String(document.getElementsByTagName("script")).indexOf("Collection") === -1'],
  ['l4 bit5  document.baseURI.indexOf("zhihu")',
   'String(document.baseURI).indexOf("zhihu") === -1'],
  ['l4 bit2  document.body.toString().indexOf("HTMLBodyElement")',
   'String(document.body).indexOf("HTMLBodyElement") === -1'],
  ['l5 bit13 canvas.getContext("2d").toString().indexOf("CanvasRenderingContext2D")',
   'String(document.createElement("canvas").getContext("2d")).indexOf("CanvasRenderingContext2D") === -1'],
  ['l5 bit9/8 canvas.outerHTML.indexOf("canvas")',
   'String(document.createElement("canvas").outerHTML).indexOf("canvas") === -1'],
  ['l4 bit6  typeof document.baseURI === "undefined"',
   'typeof document.baseURI === "undefined"'],
  ['l4 bit4  typeof document.charset === "undefined"',
   'typeof document.charset === "undefined"'],
  ['l5 bit14 typeof canvas.getContext === "undefined"',
   'typeof document.createElement("canvas").getContext === "undefined"'],
];
const js = `(function(){
  var out = [], C = ${JSON.stringify(CHECKS.map(c => c[1]))};
  for (var i=0;i<C.length;i++){ var r; try { r = eval(C[i]); } catch(e){ r = 'THROW:'+e.message; } out.push(r); }
  return out;
})()`;
const res = vm.runInContext(js, ctx);
CHECKS.forEach((c, i) => console.log('%s %s  => %s', res[i] === true ? '[命中]' : '      ', c[0], res[i]));
console.log('');
console.log('参考：真实浏览器里这些都应为「不命中」(false)');