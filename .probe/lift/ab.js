const fs = require('fs'), path = require('path'), vm = require('vm');
const W = s => process.stdout.write(s);
const BS = String.fromCharCode(92);

global.window = global;
global.location = { toString: () => 'https://www.zhihu.com/' };
global.document = {
  createElement: () => ({ getContext: () => null, style: {}, tagName: 'DIV' }),
  getElementsByTagName: () => [{ appendChild() {}, removeChild() {} }],
  all: () => []
};
global.navigator = { hardwareConcurrency: 8, plugins: [] };
global.self = global;
global.BVM = function BVM() {};
global.CVM = function CVM() {};
global.__b = new Proxy({ a3: 0 }, {
  get: (t, k) => (k in t ? t[k] : () => -1),
  set: (t, k, v) => { t[k] = v; return true; }
});

// expose the container's top-level string consts (SRC0/SRC1/...) as globals
function exposeConsts(file) {
  const s = fs.readFileSync(file, 'utf8');
  let n = 0;
  for (const m of s.matchAll(/(?:^|[\n;])\s*(?:const|var|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(["'])/g)) {
    const i = m.index + m[0].length - 1, q = s[i];
    let k = i + 1;
    while (k < s.length) { if (s[k] === BS) { k += 2; continue; } if (s[k] === q) break; k++; }
    const lit = s.slice(i, k + 1);
    try { global[m[1]] = vm.runInThisContext('(' + lit + ')'); n++; } catch (e) {}
  }
  return n;
}

function probe(mod) {
  const tr = []; let err = null;
  global.TRACE = (pc, A, l, S, F, n) => { if (tr.length < 20000) tr.push(pc); };
  try { mod.RUN([], null, undefined, 0); } catch (e) { err = e.constructor.name + ': ' + String(e.message).slice(0, 70); }
  global.TRACE = undefined;
  return { tr, err };
}

const pairs = [['js/cvm.decompiled.js', '.probe/lift/cvm.lifted.js'],
               ['js/inner.decompiled.js', '.probe/lift/inner.lifted.js'],
               ['js/payload.cvm.js', '.probe/lift/payload.lifted.js']];
let allSame = true;
for (const [a, b] of pairs) {
  const na = exposeConsts(a);
  const A = probe(require(path.resolve(a)));
  const B = probe(require(path.resolve(b)));
  const same = A.tr.length === B.tr.length && A.tr.every((x, i) => x === B.tr[i]);
  allSame = allSame && same;
  let fd = -1;
  for (let i = 0; i < Math.max(A.tr.length, B.tr.length); i++) if (A.tr[i] !== B.tr[i]) { fd = i; break; }
  W(path.basename(a) + '  (exposed ' + na + ' consts)\n');
  W('  devirt : ' + A.tr.length + ' steps  ' + (A.err ? ('ERR ' + A.err) : 'OK') + '\n');
  W('  lifted : ' + B.tr.length + ' steps  ' + (B.err ? ('ERR ' + B.err) : 'OK') + '\n');
  W('  trace identical: ' + same + (same ? '' : '  first diff step ' + fd + ' (pc ' + A.tr[fd] + ' vs ' + B.tr[fd] + ')') + '\n\n');
}
W('ALL TRACES IDENTICAL: ' + allSame + '\n');
