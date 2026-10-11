const vm = require('vm'); const fs = require('fs');
const { createEnv } = require('./handenv.js');
const patched = fs.readFileSync('.probe/zsec/src1_parts.js', 'utf8');
const sandbox = createEnv(); sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'src1p' });
for (const k of ['Object','Array','String','Math','JSON','Function','Proxy','Reflect','Symbol','Date','RegExp','Number','Boolean','parseInt','Error','Map','Set','Uint8Array','ArrayBuffer','decodeURIComponent','unescape','encodeURIComponent']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch(e){} }
}
sandbox.__S = patched;
const r = vm.runInContext('(function(){ try { return new Function(__S)(); } catch(e){ return "ERR "+e.message; } })()', ctx);
console.log('我的 parts =', String(r).slice(0, 2500));
try { const a = JSON.parse(r); console.log('项数', a.length); } catch(e) { console.log('（非 JSON，见上）'); }