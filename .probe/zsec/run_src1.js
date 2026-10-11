const vm = require('vm'); const fs = require('fs');
const { createEnv } = require('./handenv.js');
const src = fs.readFileSync('js/cvm.decompiled.js', 'utf8');
const m = src.match(/const SRC1 = "((?:[^"\\]|\\.)*)";/);
if (!m) { console.log('未找到 SRC1 常量'); process.exit(1); }
const js = JSON.parse('"' + m[1] + '"');
console.log('SRC1 长度', js.length, ' 头:', js.slice(0, 80));
const sandbox = createEnv(); sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'src1' });
for (const k of ['Object','Array','String','Math','JSON','Function','Proxy','Reflect','Symbol','Date','RegExp','Number','Boolean','parseInt','Error','Map','Set','Uint8Array','ArrayBuffer']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch(e){} }
}
sandbox.__SRC1 = js;
try {
  const r = vm.runInContext('(function(){ try { return String(new Function(__SRC1)()); } catch(e){ return "ERR "+e.message; } })()', ctx);
  console.log('new Function(SRC1)() =>', r);
} catch (e) { console.log('执行失败:', e.message); }