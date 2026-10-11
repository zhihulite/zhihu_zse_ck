// 在我的 handenv 里逐条求值 inner 层的 28 条守卫，算出 l[3]/l[4] 与段 D
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const sandbox = createEnv();
sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'probe' });
for (const k of ['BigInt', 'TextEncoder', 'TextDecoder', 'URL', 'URLSearchParams', 'ArrayBuffer', 'Uint8Array',
                 'DataView', 'Promise', 'Symbol', 'Reflect', 'Proxy', 'Map', 'Set', 'JSON', 'Math', 'Number',
                 'String', 'Object', 'Array', 'Function', 'Error', 'RegExp', 'Boolean', 'Date', 'parseInt',
                 'WebAssembly', 'XMLHttpRequest']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch (e) {} }
}

const GUARDS = [
  ['l3 bit14', 'location.toString().indexOf("zhihu") === -1'],
  ['l3 bit13', 'String(P.toString).indexOf("native") === -1'],
  ['l3 bit12', 'typeof P.host === "undefined"'],
  ['l3 bit11', 'typeof P.hostname === "undefined"'],
  ['l3 bit10', 'typeof window.devicePixelRatio === "undefined"'],
  ['l3 bit9',  'typeof window.blur === "undefined"'],
  ['l3 bit8',  'String(window.blur).indexOf("native") === -1'],
  ['l3 bit7',  'typeof window.self === "undefined"'],
  ['l3 bit6',  'typeof history.pushState !== "function"'],
  ['l3 bit5',  'String(window.XMLDocument).indexOf("native") === -1'],
  ['l3 bit4',  'typeof window.find === "undefined"'],
  ['l3 bit3',  'typeof window.globalThis === "undefined"'],
  ['l3 bit2',  'typeof window.name === "undefined"'],
  ['l3 bit1',  'typeof history.replaceState !== "function"'],
  ['l4 bit14', 'typeof XHR.LOADING === "undefined"'],
  ['l4 bit13', 'typeof XHR.DONE === "undefined"'],
  ['l4 bit12', 'typeof XHR.OPENED === "undefined"'],
  ['l4 bit11', 'typeof XHR.UNSENT === "undefined"'],
  ['l4 bit10', 'typeof XHR.abort === "undefined"'],
  ['l4 bit9',  'typeof XHR.open === "undefined"'],
  ['l4 bit8',  'typeof XHR.send === "undefined"'],
  ['l4 bit7',  'typeof XHR.upload === "undefined"'],
  ['l4 bit6',  'typeof XHR.responseURL === "undefined"'],
  ['l4 bit5',  'typeof XHR.onreadystatechange === "undefined"'],
  ['l4 bit4',  'typeof XHR.status === "undefined"'],
  ['l4 bit3',  'typeof XHR.onabort === "undefined"'],
  ['l4 bit2',  'typeof XHR.onabort === "undefined"'],
  ['l4 bit1',  'typeof XHR.responseXML === "undefined"'],
];

const script = `
(function(){
  var _get = new Function("a","b","return b in a ? a[b]: undefined");
  var _set = new Function("a","b","c","a[b]=c;return true");
  var P = new Proxy(location, { get: _get, set: _set });
  var XHR;
  try { XHR = new XMLHttpRequest(); } catch (e) { XHR = undefined; }
  globalThis.__P = P; globalThis.__XHR = XHR;
  var out = [];
  var g = ${JSON.stringify(GUARDS)};
  for (var i = 0; i < g.length; i++) {
    var r;
    try { r = eval(g[i][1]); } catch (e) { r = 'THROW:' + e.message; }
    out.push(g[i][0] + '  ' + g[i][1] + '  => ' + r);
  }
  return out;
})()
`;
let rows;
try { rows = vm.runInContext(script, ctx); } catch (e) { console.log('probe 失败:', e.message); process.exit(1); }

let l3 = 1 << 15, l4 = 1 << 15;
const bits3 = { 14: 1, 13: 1, 12: 1, 11: 1, 10: 1, 9: 1, 8: 1, 7: 1, 6: 1, 5: 1, 4: 1, 3: 1, 2: 1, 1: 1 };
for (const r of rows) {
  const hit = /=> true$/.test(r);
  const m = /^(l3|l4) bit(\d+)/.exec(r);
  if (hit && m) { if (m[1] === 'l3') l3 |= (1 << +m[2]); else l4 |= (1 << +m[2]); }
  console.log((hit ? '  [TRUE ] ' : '  [false] ') + r);
}
console.log('\nl3 = 0x' + l3.toString(16) + '   l4 = 0x' + l4.toString(16));

function encode(part, key, acc0) {
  let out = '', acc = acc0;
  for (let i = 0; i < part.length; i++) {
    acc = (part.charCodeAt(i) ^ key.charCodeAt(i % key.length)) ^ acc;
    out += String.fromCharCode(acc);
  }
  return out;
}
const words = l3.toString(16) + l4.toString(16);
const D = encode(words, 'b53cc3fa93dc8013', 41);
console.log('words = "' + words + '"  段D = ' + JSON.stringify(D) + '  (真实应为 "~{x+ps%t")');
