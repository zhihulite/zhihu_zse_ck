// 钩住运行期的 t(139, X) 调用 —— 直接拿到池的解码结果（不猜 key、不猜状态）
const fs = require('fs');
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const sandbox = createEnv();
delete sandbox.process; delete sandbox.global; delete sandbox.Buffer;
sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'zhihu' });

const calls = [];          // 所有 t(139, ...) 调用
const allCalls = [];       // 其他 pc 的调用（限 200 条）
const T = (o) => { if (allCalls.length < 200) allCalls.push(o); };

sandbox.__HOOK_BVM = function (b) {
  const orig = b.t;
  const wrapped = function (pc, ...rest) {
    const self = this;
    let out, err = null;
    try { out = orig.apply(self, [pc, ...rest]); } catch (e) { err = e; }
    if (pc === 139) {
      calls.push({
        arg: (typeof rest[0] === 'string' ? rest[0] : String(rest[0])).slice(0, 160),
        argLen: typeof rest[0] === 'string' ? rest[0].length : -1,
        ret: err ? ('THROW ' + err.message) : (typeof out === 'string' ? out.slice(0, 160) : String(out)),
        retLen: typeof out === 'string' ? out.length : -1,
        idx: self.T, val: self.val, fn: self.O,
      });
    } else {
      T({ pc, nargs: rest.length, ret: err ? 'THROW' : (typeof out === 'string' ? 'STR(' + out.length + ')' : String(out)) });
    }
    if (err) throw err;
    return out;
  };
  b.t = wrapped; b.z = wrapped;
};

let innerSrc = fs.readFileSync('.probe/eval-83-136041.js', 'utf8');
innerSrc = innerSrc.replace('var __b=new BVM();', 'var __b=new BVM();__HOOK_BVM(__b);');

const r = {};
try { vm.runInContext(fs.readFileSync('.probe/build-859e.js', 'utf8'), ctx, { filename: 'outer', timeout: 120000 }); r.outer = 'ok'; }
catch (e) { r.outer = 'THROW ' + e.message; }
try { vm.runInContext(innerSrc, ctx, { filename: 'inner', timeout: 120000 }); r.inner = 'ok'; }
catch (e) { r.inner = 'THROW ' + e.message; }

r.calls139 = calls.length;
r.callsOther = allCalls.length;
r.gLen = sandbox.__b && sandbox.__b.g ? sandbox.__b.g.length : -1;
fs.writeFileSync('.probe/zsec/pool_calls.json', JSON.stringify({ r, calls, allCalls }, null, 1), 'utf8');

console.log('outer:', r.outer, '| inner:', r.inner, '| g:', r.gLen);
console.log('t(139,...) 调用次数:', calls.length, ' 其他调用:', allCalls.length);
console.log('=== t(139, X) 调用明细（前 40）===');
for (const c of calls.slice(0, 40)) {
  console.log('  idx=%-5s fn=%-4s argLen=%-6d retLen=%-6d\n      arg=%s\n      ret=%s'
    .replace(/\n\s+/g, '\n      '), c.idx, c.fn, c.argLen, c.retLen, JSON.stringify(c.arg), JSON.stringify(c.ret));
}
