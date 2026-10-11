// 在 handenv（以及可选的 build 上下文）里求值 15 条 VM 侧 Node 探测，算出 word8/word9
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const CHECKS = [
  [9, 10, "return typeof process !== 'undefined' ? 'y':'n'"],
  [9,  9, "return typeof require !== 'undefined' ? 'y':'n'"],
  [9,  8, "return typeof module !== 'undefined' ? 'y':'n'"],
  [9,  7, "return typeof exports !== 'undefined' ? 'y':'n'"],
  [9,  6, "return typeof __dirname !== 'undefined' ? 'y':'n'"],
  [9,  5, "return typeof __filename !== 'undefined' ? 'y':'n'"],
  [9,  4, "return typeof window._parent !== 'undefined' ? 'y':'n'"],
  [9,  3, "return typeof window._origin !== 'undefined' ? 'y':'n'"],
  [9,  2, "return typeof window._document !== 'undefined' ? 'y':'n'"],
  [9,  1, "return typeof window._virtualConsole !== 'undefined' ? 'y':'n'"],
  [8,  6, "return typeof ws !== 'undefined' && ws.toString().indexOf('ocke') !== -1 ? 'y':'n'"],
  [8,  5, "return typeof JSDOM !== 'undefined' ? 'y':'n'"],
  [8,  3, "return typeof __dirname !== 'undefined' ? 'y':'n'"],
  [8,  1, "return typeof Hlclient !== 'undefined' ? 'y':'n'"],
  [8,  0, "return typeof v_saf !== 'undefined' ? 'y':'n'"],
];

function buildCtx() {
  const sandbox = createEnv();
  delete sandbox.process; delete sandbox.global; delete sandbox.Buffer;
  sandbox.globalThis = sandbox;
  const ctx = vm.createContext(sandbox, { name: 'probe' });
  for (const k of ['BigInt', 'Object', 'Array', 'String', 'Math', 'JSON', 'Function', 'Proxy', 'Reflect',
                   'Symbol', 'Map', 'Set', 'Uint8Array', 'ArrayBuffer', 'DataView', 'Promise', 'Number',
                   'Boolean', 'Error', 'RegExp', 'Date', 'parseInt']) {
    if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch (e) {} }
  }
  return ctx;
}

const ctx = buildCtx();
const script = `(function(){
  var out = [];
  var F = Function;
  var checks = ${JSON.stringify(CHECKS.map(c => c[2]))};
  for (var i = 0; i < checks.length; i++) {
    var r;
    try { r = (new F(checks[i]))(); } catch (e) { r = 'ERR:' + e.message; }
    out.push(r);
  }
  return out;
})()`;
const res = vm.runInContext(script, ctx);

let w8 = 0x8000, w9 = 0x8000;
console.log('--- 15 条 VM 侧 Node 探测（handenv 上下文）---');
CHECKS.forEach(([w, b, expr], i) => {
  const y = res[i] === 'y';
  if (y) { if (w === 8) w8 |= (1 << b); else w9 |= (1 << b); }
  console.log('  %s word%d bit%-2d  %-72s => %s', y ? '[命中]' : '      ', w, b, expr, res[i]);
});
console.log('\n我的 word8 = 0x%s   word9 = 0x%s' % (w8.toString(16), w9.toString(16)));
console.log('真实       word8 = 0x8000   word9 = 0x8000  (全为 n)');
