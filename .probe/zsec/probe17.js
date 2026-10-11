// 直接在我手写环境里求值 wasm 层的 17 条探针，对照真浏览器期望值
const vm = require('vm');
const path = require('path');
const { createEnv } = require(path.join(__dirname, 'handenv.js'));

const sandbox = createEnv();
const ctx = vm.createContext(sandbox, { name: 'probe17' });

const PROBES = [
  [45,  "return typeof process !== 'undefined' ? 'y':'n'", 'n'],
  [50,  "return typeof require !== 'undefined' ? 'y':'n'", 'n'],
  [55,  "return typeof module !== 'undefined' ? 'y':'n'", 'n'],
  [60,  "return typeof exports !== 'undefined' ? 'y':'n'", 'n'],
  [65,  "return typeof __dirname !== 'undefined' ? 'y':'n'", 'n'],
  [70,  "return typeof __filename !== 'undefined' ? 'y':'n'", 'n'],
  [75,  "return typeof window._parent !== 'undefined' ? 'y':'n'", 'n'],
  [80,  "return typeof window._origin !== 'undefined' ? 'y':'n'", 'n'],
  [85,  "return typeof window._document !== 'undefined' ? 'y':'n'", 'n'],
  [90,  "return typeof window._virtualConsole !== 'undefined' ? 'y':'n'", 'n'],
  [96,  "getElementsByTagName", '<function>'],
  [122, "return typeof ws !== 'undefined' && ws.toString().indexOf('ocke') !== -1 ? 'y':'n'", 'n'],
  [127, "return typeof JSDOM !== 'undefined' ? 'y':'n'", 'n'],
  [136, "return typeof __dirname !== 'undefined' ? 'y':'n'", 'n'],
  [141, "try{return window.constructor.toString()}catch(_){return ''}", 'function Window() { [native code] }'],
  [146, "return typeof Hlclient !== 'undefined' ? 'y':'n'", 'n'],
  [151, "return typeof v_saf !== 'undefined' ? 'y':'n'", 'n'],
];

let bad = 0;
for (const [id, code, expect] of PROBES) {
  let r, err = null;
  try { r = vm.runInContext(code, ctx, { filename: 'probe' + id + '.js' }); }
  catch (e) { err = e.message; }
  const shown = err ? ('ERR:' + err) : (typeof r === 'function' ? '<function ' + r.name + '>' : JSON.stringify(r));
  let verdict;
  if (id === 96) verdict = (typeof r === 'function') ? 'OK' : 'MISMATCH';
  else if (id === 141) verdict = 'INFO';
  else verdict = (String(r) === expect) ? 'OK' : 'MISMATCH';
  if (verdict === 'MISMATCH') bad++;
  console.log(`#${id}  ${verdict.padEnd(9)} got=${shown}   expect=${JSON.stringify(expect)}`);
}
console.log('\nMISMATCH count =', bad);