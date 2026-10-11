// 用 VM 自己的 pc=139 解码子程序解 arr 池（不猜 key）
const fs = require('fs');
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const sandbox = createEnv();
delete sandbox.process; delete sandbox.global; delete sandbox.Buffer;
sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'zhihu' });

function step(name, src) {
  try { vm.runInContext(src, ctx, { filename: name, timeout: 120000 }); return 'ok'; }
  catch (e) { return 'THROW ' + e.name + ': ' + e.message; }
}

const r = {};
r.outer = step('outer', fs.readFileSync('.probe/build-859e.js', 'utf8'));
const inner = fs.readFileSync('.probe/eval-83-136041.js', 'utf8');
r.inner = step('inner', inner);

const b = sandbox.__b;
r.hasB = !!b;
if (!b) { console.log(JSON.stringify(r, null, 1)); process.exit(0); }
r.gLen = b.g ? b.g.length : -1;
r.DLen = b.D ? b.D.length : -1;

// 池原始形态
r.poolRaw = (b.g || []).slice(0, 8).map(s => Array.from(String(s).slice(0, 12)).map(c => c.charCodeAt(0)));

// 用 pc=139 解码
const dec = [];
for (let i = 0; i < (b.g || []).length; i++) {
  const raw = b.g[i];
  let out;
  try {
    const t = b.t.bind(b);
    out = t(139, raw);
  } catch (e) { out = 'THROW ' + e.message; }
  dec.push({ i, rawLen: String(raw).length, dec: (typeof out === 'string' ? out : String(out)).slice(0, 120) });
}
r.decoded = dec;
fs.writeFileSync('.probe/zsec/decode_pool_out.json', JSON.stringify(r, null, 1), 'utf8');

console.log('outer:', r.outer, '| inner:', r.inner, '| hasB:', r.hasB, '| g:', r.gLen, '| D:', r.DLen);
console.log('=== pc=139 解码结果（前 30 条）===');
for (const d of dec.slice(0, 30)) {
  console.log('  [%2d] rawLen=%-6d -> %s' % (d.i, d.rawLen, JSON.stringify(d.dec)));
}
