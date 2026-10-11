// 在上下文内部包装 WebAssembly.instantiate 的 imports，记录 gojs 全部调用
const fs = require('fs');
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const sandbox = createEnv();
delete sandbox.process; delete sandbox.global; delete sandbox.Buffer;
sandbox.globalThis = sandbox;

const log = [];
sandbox.__WLOG = (o) => { if (log.length < 8000) log.push(o); };

const ctx = vm.createContext(sandbox, { name: 'zhihu' });

vm.runInContext(`(function(){
  var orig = WebAssembly.instantiate.bind(WebAssembly);
  var INST = null;
  globalThis.__INST = null;
  function readStrs(addr){
    var out = [];
    if(!INST || typeof addr !== 'number' || addr <= 0 || addr > 0x7fffffff) return out;
    try{
      var dv = new DataView(INST.exports.memory.buffer);
      var p1 = dv.getUint32(addr,true), l1 = dv.getUint32(addr+4,true);
      if(l1>0 && l1<400 && p1>0 && p1+l1<=dv.byteLength) out.push(new TextDecoder().decode(new Uint8Array(dv.buffer,p1,l1)));
      var p2 = Number(dv.getBigUint64(addr,true)), l2 = Number(dv.getBigUint64(addr+8,true));
      if(l2>0 && l2<400 && p2>0 && p2+l2<=dv.byteLength) out.push(new TextDecoder().decode(new Uint8Array(dv.buffer,p2,l2)));
    }catch(e){}
    return out;
  }
  WebAssembly.instantiate = function(bytes, imports){
    var out = {};
    var mods = Object.keys(imports||{});
    var fnNames = {};
    mods.forEach(function(m){ fnNames[m] = Object.keys(imports[m]); });
    __WLOG({ ev: 'instantiate-enter', mods: mods, fnNames: fnNames });
    mods.forEach(function(mod){
      out[mod] = {};
      Object.keys(imports[mod]).forEach(function(fn){
        var f = imports[mod][fn];
        if(typeof f !== 'function'){ out[mod][fn] = f; return; }
        out[mod][fn] = function(){
          var a = Array.prototype.slice.call(arguments);
          var rec = { mod: mod, fn: fn, args: a.map(function(x){
            if(typeof x === 'bigint') return Number(x);
            if(x === null || typeof x !== 'object') return x;
            return '<obj>';
          }) };
          var strs = [];
          for(var k=0;k<a.length;k++){ readStrs(a[k]).forEach(function(s){ strs.push('arg'+k+'='+s); }); }
          if(strs.length) rec.strs = strs;
          __WLOG(rec);
          return f.apply(this, arguments);
        };
      });
    });
    return orig(bytes, out).then(function(r){ INST = r.instance || r; globalThis.__INST = INST; return r; });
  };
})();`, ctx);

const r = {};
try { vm.runInContext(fs.readFileSync('.probe/build-859e.js', 'utf8'), ctx, { filename: 'outer', timeout: 180000 }); r.outer = 'ok'; }
catch (e) { r.outer = 'THROW ' + e.name + ': ' + e.message; }
r.inst = !!vm.runInContext('!!globalThis.__INST', ctx);

fs.writeFileSync('.probe/zsec/wasm_import_log.json', JSON.stringify({ r, log }, null, 1), 'utf8');
console.log('outer:', r.outer, '| instance:', r.inst, '| 日志:', log.length);
const mods = {};
log.forEach(x => { mods[x.mod] = (mods[x.mod] || 0) + 1; });
console.log('模块分布:', JSON.stringify(mods));
console.log();
console.log('=== gojs 调用序列（前 45）===');
log.filter(y => y.mod === 'gojs').slice(0, 45).forEach(x => {
  console.log('  %-30s args=%-30s strs=%s', x.fn, JSON.stringify(x.args), JSON.stringify(x.strs || []));
});
console.log();
console.log('=== gojs 最后 25 条 ===');
log.filter(y => y.mod === 'gojs').slice(-25).forEach(x => {
  console.log('  %-30s args=%-30s strs=%s', x.fn, JSON.stringify(x.args), JSON.stringify(x.strs || []));
});
