const crypto = require('crypto');
const fs = require('fs');
const vm = require('vm');
const { createEnv } = require('./handenv.js');
const patched = fs.readFileSync('.probe/zsec/src1_parts.js', 'utf8');
const sandbox = createEnv(); sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'p' });
for (const k of ['Object','Array','String','Math','JSON','Function','Proxy','Reflect','Symbol','Date','RegExp','Number','Boolean','parseInt','Error','Map','Set','Uint8Array','ArrayBuffer','decodeURIComponent','unescape','encodeURIComponent']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch(e){} }
}
sandbox.__S = patched;
const parts = JSON.parse(vm.runInContext('new Function(__S)()', ctx));
const joined = parts.join('|');
console.log('parts 项数', parts.length, ' join 长度', joined.length);
console.log('Node crypto md5      :', crypto.createHash('md5').update(joined, 'utf8').digest('hex'));
// 我的 SRC1 原始版（用它自己的 md5 实现）
const orig = fs.readFileSync('.probe/zsec/src1_orig.js', 'utf8');
sandbox.__O = orig;
console.log('SRC1 自带 md5 实现   :', vm.runInContext('new Function(__O)()', ctx));
console.log('真浏览器当前指纹     : be544511d8accf5879de9179e434e829');