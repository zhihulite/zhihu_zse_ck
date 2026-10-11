// 按「枚举 window 属性名」重探 indexOf 型守卫（多种基对象候选）
const vm = require('vm');
const { createEnv } = require('./handenv.js');
const sandbox = createEnv(); sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'io' });
for (const k of ['Object','Array','String','Math','JSON','Function','Proxy','Reflect','Symbol','Date','RegExp','Number','Boolean','parseInt','Error','Map','Set']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch (e) {} }
}
const NAMES = ['top','customElements','name','self','print','open','_encrypt','__g'];
const BASES = {
  'Object.keys(window).join()':      'Object.keys(window).join(",")',
  'for-in window join()':            '(function(){var a=[];for(var k in window)a.push(k);return a.join(",");})()',
  'getOwnPropertyNames(window).join()': 'Object.getOwnPropertyNames(window).join(",")',
  'String(window)':                  'String(window)',
  'String(window.toString())':       'String(window.toString())',
  'window+""':                       'window+""',
};
const js = `(function(){
  var out = [];
  var NAMES = ${JSON.stringify(NAMES)};
  var BASES = ${JSON.stringify(BASES)};
  for (var b in BASES){
    var s; try { s = eval(BASES[b]); } catch(e){ out.push(b + ' : BASE_THROW ' + e.message); continue; }
    var miss = [];
    for (var i=0;i<NAMES.length;i++) if (String(s).indexOf(NAMES[i]) === -1) miss.push(NAMES[i]);
    out.push(b + ' : 长度 ' + String(s).length + ' 缺失 ' + JSON.stringify(miss));
  }
  return out.join(String.fromCharCode(10));
})()`;
console.log(vm.runInContext(js, ctx));
console.log('');
console.log('参考：真浏览器里这些 indexOf 都应「不缺失」（因为 top/name/self/print/open/customElements 都是 window 属性）');