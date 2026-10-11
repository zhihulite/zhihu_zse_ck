// 关键对照：先跑【外层脚本】(建立 __g / sc)，再跑【内层脚本】(创建 __b)
// 假设：离线只跑内层 → __g 缺失 → 程序走不同分支 → __b.zh 不生成
const fs = require('fs');
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const OUTER = process.env.OUTER || '.probe/build-859e.js';
const INNER = process.env.INNER || '.probe/eval-83-136041.js';

const sandbox = createEnv();
delete sandbox.process; delete sandbox.global; delete sandbox.Buffer;
sandbox.globalThis = sandbox;
// 捕获页面 console（Go panic 会往这里打）
const logs = [];
['log', 'debug', 'info', 'warn', 'error', 'trace'].forEach((k) => {
  sandbox.console[k] = (...a) => {
    if (logs.length < 200) logs.push(k + ': ' + a.map(x => { try { return typeof x === 'string' ? x : JSON.stringify(x); } catch (e) { return String(x); } }).join(' ').slice(0, 600));
  };
});
const ctx = vm.createContext(sandbox, { name: 'zhihu' });

const events = [];
const T = (o) => { if (events.length < 500) events.push(o); };

let innerSrc = fs.readFileSync(INNER, 'utf8');
innerSrc = innerSrc.replace('var __b=new BVM();', 'var __b=new BVM();__HOOK_BVM(__b);');
sandbox.__HOOK_BVM = function (b) {
  let _zh;
  Object.defineProperty(b, 'zh', {
    configurable: true, enumerable: true,
    get() { return _zh; },
    set(v) { _zh = v; T({ ev: 'zh:set', len: v && v.length, head: String(v).slice(0, 60) }); },
  });
};

const outerSrc = fs.readFileSync(OUTER, 'utf8');

const report = {};
function step(name, src) {
  try {
    vm.runInContext(src, ctx, { filename: name, timeout: 120000 });
    report[name] = 'ok';
  } catch (e) {
    report[name] = 'THROW ' + e.name + ': ' + e.message;
  }
}

if (process.env.SKIP_OUTER !== '1') step('outer', outerSrc);

report.globalsAfterOuter = {
  __g: typeof sandbox.__g, __b: typeof sandbox.__b, __c: typeof sandbox.__c,
  sc: typeof sandbox.sc,
  gCk: sandbox.__g && typeof sandbox.__g.ck,
};

step('inner', innerSrc);

const b = sandbox.__b;
report.after = {
  __b: typeof b,
  zhLen: b && b.zh ? String(b.zh).length : 0,
  zhHead: b && b.zh ? String(b.zh).slice(0, 80) : null,
  a3: b ? b.a3 : null,
  word: b ? b.k : null,
  Rlen: b && b.R ? b.R.length : null,
  Dlen: b && b.D ? b.D.length : null,
  glen: b && b.g ? b.g.length : null,
  __g: typeof sandbox.__g, __c: typeof sandbox.__c,
  gCk: sandbox.__g && typeof sandbox.__g.ck,
  gCkVal: sandbox.__g && sandbox.__g.ck ? String(sandbox.__g.ck).slice(0, 40) : null,
};
report.events = events;
report.pageLogs = logs;
report.pageLogs = logs;
report.pageLogs = logs;
report.pageLogs = logs;
report.pageLogs = logs;
report.pageLogs = logs;

fs.writeFileSync('.probe/zsec/run_both_out.json', JSON.stringify(report, null, 1), 'utf8');
console.log(JSON.stringify(report, null, 1));
