
const vm=require('vm'), fs=require('fs'), crypto=require('crypto');
const { createEnv } = require('./handenv.js');
const S = fs.readFileSync('.probe/zsec/src1_parts.js','utf8');
const sandbox = createEnv(); sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, {name:'x'});
for (const k of ['Object','Array','String','Math','JSON','Function','Proxy','Reflect','Symbol','Date','RegExp','Number','Boolean','parseInt','Error','Map','Set','Uint8Array','ArrayBuffer','decodeURIComponent','unescape','encodeURIComponent']) {
  if (sandbox[k]===undefined) { try{ sandbox[k]=vm.runInContext(k,ctx);}catch(e){} }
}
sandbox.__S = S;
const parts = JSON.parse(vm.runInContext('new Function(__S)()', ctx));
const joined = parts.join('|');
fs.writeFileSync('.probe/oracle/mine_joined.txt', joined);
console.log(JSON.stringify({len: joined.length, md5: crypto.createHash('md5').update(joined,'utf8').digest('hex')}));
