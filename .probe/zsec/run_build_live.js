// 用当前 build 的官方 JS 跑在我手写环境里 —— 判别「环境不合格」还是「我驱动的管线不合格」
const fs = require('fs');
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const BUILD = process.env.BUILD || '.probe/oracle/live_fresh.js';
const META = fs.existsSync('.probe/oracle/meta2.txt') ? fs.readFileSync('.probe/oracle/meta2.txt', 'utf8').trim() : '';

const sandbox = createEnv();
delete sandbox.process; delete sandbox.global; delete sandbox.Buffer;
sandbox.globalThis = sandbox;

const ctx = vm.createContext(sandbox, { name: 'live' });
// ZSE_DOCTAMPER：扰动 Go 侧读的 document.* 结果，用于定位它们喂养哪个位图字
if (process.env.ZSE_DOCTAMPER) {
  try {
    vm.runInContext(`(function(){
      var which = ${JSON.stringify(process.env.ZSE_DOCTAMPER)};
      var d = document;
      if (which.indexOf('gEBTN') >= 0) {
        var _g = d.getElementsByTagName.bind(d);
        d.getElementsByTagName = function(n){ var r = _g(n); try { Object.defineProperty(r, Symbol.toStringTag, {value:'TAMPERED', configurable:true}); } catch(e){} return r; };
      }
      if (which.indexOf('createElement') >= 0) {
        var _c = d.createElement.bind(d);
        d.createElement = function(n){ var r = _c(n); try { Object.defineProperty(r, Symbol.toStringTag, {value:'TAMPERED', configurable:true}); } catch(e){} return r; };
      }
      if (which.indexOf('all') >= 0) {
        try { var _a = d.all; Object.defineProperty(d, 'all', { get: function(){ return _a; }, configurable: true }); } catch(e){}
      }
      return 'ok';
    })()`, ctx);
    console.log('已扰动 document.*: ' + process.env.ZSE_DOCTAMPER);
  } catch (eDT) { console.log('document 扰动失败: ' + String(eDT.message).slice(0, 100)); }
}
// ZSE_DEFGLOB="JSDOM,ws,v_saf"：在沙箱里定义这些全局，让 Go 侧探针返回 'y'（用于映射 Go 位图字→检测项）
if (process.env.ZSE_DEFGLOB) {
  try {
    const names = process.env.ZSE_DEFGLOB.split(',').map(x => x.trim()).filter(Boolean);
    vm.runInContext('(function(){var ns=' + JSON.stringify(names) + ';for(var i=0;i<ns.length;i++){try{globalThis[ns[i]]=function(){};}catch(e){}}return ns.length;})()', ctx);
    console.log('已注入全局: ' + names.join(','));
  } catch (eDG) { console.log('注入全局失败: ' + String(eDG.message).slice(0, 100)); }
}
// ZSE_DEFWIN="_parent,_origin,_document,_virtualConsole"：在 window 上定义属性（jsdom 泄漏探针）
if (process.env.ZSE_DEFWIN) {
  try {
    const names = process.env.ZSE_DEFWIN.split(',').map(x => x.trim()).filter(Boolean);
    vm.runInContext('(function(){var ns=' + JSON.stringify(names) + ';var W=(typeof window!=="undefined")?window:globalThis;for(var i=0;i<ns.length;i++){try{W[ns[i]]=function(){};globalThis[ns[i]]=W[ns[i]];}catch(e){}}return ns.length;})()', ctx);
    console.log('已注入 window 属性: ' + names.join(','));
  } catch (eDW) { console.log('注入 window 属性失败: ' + String(eDW.message).slice(0, 100)); }
}
// native 补丁层：必须在【sandbox 上下文内】调用 —— vm.createContext 建的是新 realm，
//   sandbox 有自己的 Function.prototype，在主 realm 上 patch 无效。
try {
  if (process.env.ZSE_NONATIVE === '1') {
    console.log('native Function.prototype.toString: 已按要求跳过（ZSE_NONATIVE=1）');
  } else {
    const r = vm.runInContext('(typeof __zseenv === "object" && __zseenv) ? (__zseenv.installNativeToString(Function.prototype), "ok") : "no-addon"', ctx);
    console.log('native Function.prototype.toString:', r);
  }
} catch (e) { console.log('native patch 失败:', String(e.message).slice(0, 80)); }
if (process.env.ZSE_BMWATCH) {
  sandbox.__BMWATCH = process.env.ZSE_BMWATCH;
  console.log('48-hex 中间串搜索已装:', process.env.ZSE_BMWATCH);
}
if (process.env.ZSE_BPDUMP) {
  sandbox.__BPDUMP = 1;
  console.log('断点整栈 dump 已装');
}
if (process.env.ZSE_BPSEL) {
  sandbox.__BPSEL = 1;
  console.log('VM 调度筛选（栈上有 512）已装');
}
if (process.env.ZSE_LEWATCH) {
  sandbox.__LEWATCH = 1;
  console.log('小端 0x8200 扫描已装');
}
if (process.env.ZSE_MEMPATCH) {
  var _to = process.env.ZSE_MEMPATCH.split(':')[1] || '8000';
  var _crcStr = process.env.ZSE_MEMPATCH.split(':')[0] || '5d98534a';
  sandbox.__MEMPATCH = { crc: _crcStr, to: _to };
  console.log('内存层 record93 修正已装: crc=' + _crcStr + ' 目标 w8=' + _to);
}

// 「结果层修正」（ZSE_BITFIX=1）：三个 VM 都用 `l[k].toString(16)` 把 16 位累加字拼进位图。
//   这里在**上下文内部**把已知偏位的值映射成真机恒定值 —— 即「不在 JS 语义里造 IsHTMLDDA，
//   而在产出层把结果改对」。注意：必须 runInContext，handenv 在主 realm 改 Number.prototype 无效。
if (process.env.ZSE_BITFIX === '1') {
  try {
    vm.runInContext(`(function(){
      var _ts = Number.prototype.toString;
      // 按位置修正（默认）：只改 payload「产出那一步」的 hex —— 它把 l[3..6] 连做 4 次
      //   toString(16)，值是严格序列 [0x2008, 0x1000, 0x8000, 0x6030]。到第 4 个时前 3 个已知，
      //   于是可以**严格匹配序列**再改，绝不会碰到 __c.G[5]=0x2008 / __c.G[15]=0x6030 这类中间量。
      //   ZSE_FIXMAP 给了值映射表时走旧的值映射路径（保留兼容）。
      var FIXMAP = ${process.env.ZSE_FIXMAP ? JSON.stringify(process.env.ZSE_FIXMAP) : 'null'};
      // 未给 FIXMAP 时：w4 走严格序列匹配（不碰中间量），w1/w10 走窄值映射
      //   （窄映射已实测 gen==ck 自洽）
      var FIX = FIXMAP ? eval('(' + FIXMAP + ')') : { '2008':'2000' };   // 只剩 w1（原因见 CHECKLIST）
      var SEQ = [0x2008, 0x1000, 0x8000, 0x6030];   // payload l[3..6] 的产出序列
      var SEQ_OUT = '4030';                          // 第 4 个（l[6]）要改成真机值
      var run = [];
      var LOG = ${process.env.ZSE_BITLOG ? 1 : 0};
      Number.prototype.toString = function(r){
        if (r == 16) {
          var h = _ts.call(this, 16);
          var v = Number(this);
          if (${Number(process.env.ZSE_ALLLOG || 0)}) {
            try {
              var AL = globalThis.__ALLLOG || (globalThis.__ALLLOG = []);
              if (h.length >= 3 && h.length <= 12) {
                var kk = v + '|' + h;
                if (!AL.__seen) AL.__seen = {};
                if (!AL.__seen[kk] && AL.length < 300) { AL.__seen[kk] = 1;
                  var _stk = ''; try { _stk = String(new Error().stack).split(String.fromCharCode(10)).slice(1,4).join(' | ').slice(0, 220); } catch(eS){}
                  AL.push('0x' + _ts.call(v, 16) + ' (h=' + h + ',len=' + h.length + ') <- ' + _stk); }
              }
            } catch(eAL){}
          }
          if (LOG) {
            if (h.length === 4 && ((v & 0x800) || (v & 0x8000))) {
              var L = globalThis.__BITLOG || (globalThis.__BITLOG = []);
              if (L.length < 400) L.push('val=' + v + ' hex=' + h);
            }
          }
          // ZSE_FLIPN=1：第 k 个 len-4 产出 XOR 上 (1<<k) ⇒ 一次运行即可反推「产出序号→位图位置」
          if (${Number(process.env.ZSE_FLIPN || 0)}) {
            try {
              if (h.length === 4) {
                var _k = globalThis.__SEQN || 0;
                globalThis.__SEQN = _k + 1;
                (globalThis.__FLIPNLOG = globalThis.__FLIPNLOG || []);
                if (globalThis.__FLIPNLOG.length < 60) globalThis.__FLIPNLOG.push(_k + ':' + h);
                if (_k < 16) return ((v ^ (1 << _k)) >>> 0).toString(16);
              }
            } catch(eFN){}
          }
          // ZSE_SEQ16=1：按顺序记录所有 len===4 的 toString(16) 产出（不去重）
          if (${Number(process.env.ZSE_SEQ16 || 0)}) {
            try {
              if (h.length === 4) {
                var SQ = globalThis.__SEQ16 || (globalThis.__SEQ16 = []);
                if (SQ.length < 200) SQ.push(h + '/' + v);
              }
            } catch(eSQ){}
          }
          // ZSE_FLIPV="hex:bit"：凡 toString(16) 结果等于 hex 就翻转第 bit 位 ⇒ 直接映射「值→位图字」
          var _fv = ${JSON.stringify(process.env.ZSE_FLIPV || '')};
          if (_fv) {
            var _pairs = _fv.split(',');
            for (var _pi2 = 0; _pi2 < _pairs.length; _pi2++) {
              var _pp = _pairs[_pi2].split(':');
              if (h === _pp[0]) {
                var _fvb = Number(_pp[1]);
                globalThis.__FLIPVN = (globalThis.__FLIPVN || 0) + 1;
                return ((v ^ (1 << _fvb)) >>> 0).toString(16);
              }
            }
          }
          // ZSE_FLIP="idx:bit"：把第 idx 个 4-hex 产出翻转第 bit 位 ⇒ 看位图哪个字跟着动
          var _fl = ${JSON.stringify(process.env.ZSE_FLIP || '')};
          if (_fl) {
            var _fp = _fl.split(':'), _fi = Number(_fp[0]), _fb = Number(_fp[1]);
            if (v === 0x2008 || v === 0x1000 || v === 0x8000 || v === 0x6030) {
              globalThis.__FLIPN = (globalThis.__FLIPN || 0);
              var _idx = globalThis.__FLIPN++;
              if (_idx === _fi) {
                var _nv = (v ^ (1 << _fb)) >>> 0;
                (globalThis.__FLIPLOG = globalThis.__FLIPLOG || []).push('idx=' + _idx + ' ' + v + '->' + _nv);
                return _nv.toString(16);
              }
            }
          }
          // ZSE_TRACE16=1：记录 payload 4 连 toString(16) 的产出，以及之后谁拿走了那个 16-hex
          if (${Number(process.env.ZSE_TRACE16 || 0)}) {
            try {
              var T16 = globalThis.__T16 || (globalThis.__T16 = { seq: [], consumers: [] });
              if (v === 0x2008 || v === 0x1000 || v === 0x8000 || v === 0x6030) {
                if (T16.seq.length < 40) T16.seq.push('val=0x' + _ts.call(v, 16) + ' hex=' + h + ' recv=' + v);
              }
            } catch(e){}
          }
          // 1) 先看是否凑成 payload 的产出序列（严格匹配 ⇒ 只改产出那一步，不碰中间量）
          run.push(v); if (run.length > 4) run.shift();
          if (run.length === 4) {
            var ok = true;
            for (var i = 0; i < 4; i++) if (run[i] !== SEQ[i]) { ok = false; break; }
            if (ok) {
              globalThis.__SEQFIX = (globalThis.__SEQFIX || 0) + 1;
              (globalThis.__SEQLOG = globalThis.__SEQLOG || []).push('seq-hit -> ' + SEQ_OUT);
              run = [];
              return SEQ_OUT;
            }
          }
          // 2) 兜底：窄值映射（仅在 STRINGFIX 未启用时用）
          if (FIX) { var f = FIX[h]; if (f !== undefined) return f; }
        }
        return _ts.apply(this, arguments);
      };
      // 全位置化：钩编码器的**入参串**。payload 编码的是 16 hex（w1..w4），
      //   cvm 编码的是 8 hex（w10..w11）—— 这些串是唯一产出物，按串替换不碰任何中间量。
      globalThis.__STRINGFIX = 1;
      var _cca = String.prototype.charCodeAt, _cpa = String.prototype.codePointAt;
      var STR16 = { '2008100080006030': '2000100080004030' };   // payload 产出 → 真机值
      var STR8  = { 'c0004000': '80004000' };                   // cvm 产出   → 真机值
      // 必须用 hasOwnProperty：否则 STR8['toString'] 会从 Object.prototype 继承到函数，
      //   任何长度 8 且名为 toString/valueOf/… 的串都会被误替换（曾把 radix64 表改坏、字母表只解出 61/64）
      var HOP = Object.prototype.hasOwnProperty;
      var sub = function(s){
        if (s.length === 16 && HOP.call(STR16, s)) return STR16[s];
        if (s.length === 8  && HOP.call(STR8, s))  return STR8[s];
        return null;
      };
      String.prototype.charCodeAt = function(i){
        var s; try { s = String(this); } catch(e) { return _cca.call(this, i); }
        if (${Number(process.env.ZSE_TRACE16 || 0)}) {
          try {
            var T16b = globalThis.__T16 || (globalThis.__T16 = { seq: [], consumers: [] });
            if (/^[0-9a-f]{16}$/.test(s) && T16b.consumers.length < 60) T16b.consumers.push('charCodeAt recv=' + s + ' i=' + i);
            else if (/^[0-9a-f]{8}$/.test(s) && T16b.consumers.length < 60) T16b.consumers.push('charCodeAt recv8=' + s + ' i=' + i);
          } catch(e){}
        }
        var t = sub(s);
        if (t) { globalThis.__STRFIX = (globalThis.__STRFIX || 0) + 1;
                 (globalThis.__STRLOG = globalThis.__STRLOG || []).push(s + '->' + t);
                 return _cca.call(t, i); }
        return _cca.call(this, i);
      };
      if (typeof _cpa === 'function') {
        String.prototype.codePointAt = function(i){
          var s; try { s = String(this); } catch(e) { return _cpa.call(this, i); }
          var t = sub(s);
          if (t) { globalThis.__STRFIX = (globalThis.__STRFIX || 0) + 1; return _cpa.call(t, i); }
          return _cpa.call(this, i);
        };
      }
      globalThis.__BITFIXED = true;
    })()`, ctx);
    console.log('结果层位图修正已装:', vm.runInContext('globalThis.__BITFIXED', ctx),
                '自检 (0x2008).toString(16) =', vm.runInContext('(0x2008).toString(16)', ctx));
  } catch (e) { console.log('位图修正装载失败:', e.message); }
}

// ZSE_WP=1：抓所有可能把字符串写进 wasm 内存的路径（TextEncoder / Uint8Array.set / fromCharCode 实参）
if (process.env.ZSE_WP === '1') {
  try {
    vm.runInContext(`(function(){
      var LOG = globalThis.__WP = { te: [], u8set: [], fcc: [] };
      function noteHex(s, tag) {
        try { if (typeof s === 'string' && s.length >= 8 && /[0-9a-f]{8,}/.test(s)) { if (LOG[tag].length < 200) LOG[tag].push(s.slice(0, 120)); } } catch(e){}
      }
      if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) {
        var _e = TextEncoder.prototype.encode;
        TextEncoder.prototype.encode = function(x){ try { noteHex(String(x), 'te'); } catch(e){} return _e.apply(this, arguments); };
        if (TextEncoder.prototype.encodeInto) {
          var _ei = TextEncoder.prototype.encodeInto;
          TextEncoder.prototype.encodeInto = function(x){ try { noteHex(String(x), 'te'); } catch(e){} return _ei.apply(this, arguments); };
        }
      }
      if (typeof Uint8Array === 'function' && Uint8Array.prototype.set) {
        var _s = Uint8Array.prototype.set;
        Uint8Array.prototype.set = function(src){ try { if (LOG.u8set.length < 200 && src && src.length) { var pv = Array.prototype.slice.call(src, 0, 24); var _txt = ''; try { _txt = Array.prototype.map.call(src, function (b) { return String.fromCharCode(b); }).join(''); } catch(e){}
            var _mark = /^(0|1|2|3|4|8|9|a|b|c|d|e|f){1}/.test(_txt) || src.length >= 40;
            LOG.u8set.push('len=' + src.length + ' [' + pv.join(',') + ']' + (src.length >= 40 ? ('  TXT=' + _txt.slice(0, 140)) : '')); } } catch(e){} return _s.apply(this, arguments); };
      }
      var _fcc = String.fromCharCode;
      String.fromCharCode = function(){
        try {
          if (arguments.length >= 8 && LOG.fcc.length < 60) {
            var arr = Array.prototype.slice.call(arguments);
            LOG.fcc.push('argc=' + arr.length + ' [' + arr.slice(0, 60).join(',') + ']');
          }
        } catch(e){}
        return _fcc.apply(String, arguments);
      };
      globalThis.__WPOK = 1;
    })()`, ctx);
    console.log('写路径钩子:', vm.runInContext('globalThis.__WPOK||0', ctx));
  } catch(eWP) { console.log('写路径钩子失败: ' + String(eWP.message).slice(0,120)); }
}

// ZSE_WW=1：抓写入 wasm 内存的字节（setUint8/setUint8Array/Uint8Array 赋值），定位 48-hex 的落盘点
if (process.env.ZSE_WW === '1') {
  try {
    vm.runInContext(`(function(){
      var LOG = globalThis.__WW = { n: 0, items: [], hits: [] };
      var TARGET = '2000100080004030';
      var memBuf = null;
      var _su8 = DataView.prototype.setUint8;
      DataView.prototype.setUint8 = function(off, val){
        try {
          if (!memBuf) { var m = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem||globalThis.__INST.exports.memory); if (m) memBuf = m.buffer; }
          if (memBuf && this.buffer === memBuf) {
            LOG.n++;
            if (LOG.items.length < 4000) LOG.items.push(off + '=' + val);
          }
        } catch(e){}
        return _su8.apply(this, arguments);
      };
      globalThis.__WWOK = 1;
    })()`, ctx);
    console.log('setUint8 钩子:', vm.runInContext('globalThis.__WWOK||0', ctx));
  } catch(eW) { console.log('setUint8 钩子失败: ' + String(eW.message).slice(0,120)); }
}

// ZSE_FCC=1：抓 String.fromCharCode 全流 + 完整 zh/qh，用于判定 9800 的拼接路径
if (process.env.ZSE_FCC === '1') {
  try {
    vm.runInContext(`(function(){
      var _fcc = String.fromCharCode;
      var BUF = globalThis.__FCC = { all: '' };
      String.fromCharCode = function(){
        var r = _fcc.apply(String, arguments);
        try { if (BUF.all.length < 900000) BUF.all += r; } catch(e){}
        return r;
      };
      globalThis.__FCCOK = 1;
    })()`, ctx);
    console.log('fromCharCode 钩子:', vm.runInContext('globalThis.__FCCOK||0', ctx));
  } catch(eF) { console.log('fromCharCode 钩子失败', String(eF.message).slice(0,120)); }
}

// 断点 wasm 装载：BPWASM=<打过 fd_write 断点的 .wasm>
if (process.env.BPWASM) {
  try {
    sandbox.__BPWASM_B64 = require('fs').readFileSync(process.env.BPWASM).toString('base64');
    console.log('已装载断点 wasm:', process.env.BPWASM, sandbox.__BPWASM_B64.length, 'b64 chars');
  } catch (e) { console.log('断点 wasm 装载失败:', e.message); }
}
for (const k of ['BigInt', 'TextEncoder', 'TextDecoder', 'URL', 'URLSearchParams', 'ArrayBuffer', 'Uint8Array',
                 'Uint32Array', 'Uint8ClampedArray', 'DataView', 'Promise', 'Symbol', 'Reflect', 'Proxy', 'Map',
                 'Set', 'WeakMap', 'JSON', 'Math', 'Number', 'String', 'Object', 'Array', 'Function', 'Error',
                 'TypeError', 'RangeError', 'RegExp', 'Boolean', 'Date', 'NaN', 'Infinity', 'parseInt',
                 'parseFloat', 'isNaN', 'encodeURIComponent', 'decodeURIComponent', 'WebAssembly']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch (e) {} }
}

// Firefox 形态的 Error.stack：按真浏览器 zh 第2段的 16 帧模板**整段合成**
//   （Firefox 的 Error().stack 没有 "Error" 前缀行；每帧都带构建脚本真实 URL）
vm.runInContext(`
  (function(){
    var NL = String.fromCharCode(10);
    var U = ${JSON.stringify(process.env.BUILD_URL || 'build.js')};
    var LINES = [
      'CVM/this.z@' + U + ' line 1 > eval line 1 > eval:1:15604',
      'CVM/this.z@' + U + ' line 1 > eval line 1 > eval:1:43686',
      '@' + U + ' line 1 > eval line 1 > eval:1:47750',
      'BVM/this.z@' + U + ' line 1 > eval:1:27668',
      'BVM/this.z@' + U + ' line 1 > eval:1:30377',
      '@' + U + ' line 1 > eval:1:135996',
      'VM/this.z@' + U + ':1:42224',
      'VM/this.z@' + U + ':1:53679',
      'VM/this.z/this.A[3]@' + U + ':1:49364',
      'syscall/js.copyBytesToGo@' + U + ' line 1 > eval:1:8271',
      '(syscall/js.Value).Call@' + U + ' line 1 > WebAssembly.instantiate:wasm-function[186]:0xde22',
      '(*main._0oOoOO)._00oooO@' + U + ' line 1 > WebAssembly.instantiate:wasm-function[188]:0xf9fc',
      '(*main._0oOoOO)._0Ooo00$bound@' + U + ' line 1 > WebAssembly.instantiate:wasm-function[61]:0x6cde',
      '_start.command_export@' + U + ' line 1 > WebAssembly.instantiate:wasm-function[199]:0x1399d',
      'window.Go/this.run@' + U + ' line 1 > eval:1:8877',
      '@' + U + ':1:522024',
    ];
    var TEMPLATE = LINES.join(NL) + NL;
    function pst(err, frames){ return TEMPLATE; }
    try { Object.defineProperty(Error, 'prepareStackTrace', { value: pst, configurable: true, writable: true }); } catch(e){}
  })();
`, ctx);

// 记录所有 wasm 宿主调用（syscall/js.*），并注入 VM 解释器轨迹
// 包装 __g.N（服务 VM 入口）：记录 Go VM 每次调用服务 VM 的入口 pc
vm.runInContext(`
  globalThis.__NCALLS = [];
  var _g = undefined;
  Object.defineProperty(window, '__g', {
    configurable: true,
    enumerable: true,   // 真浏览器里 window.__g = <VM> 是普通赋值 ⇒ 可枚举；
                        //   payload 守卫 Object.keys(window).join().indexOf("__g") === -1 会因此命中并置 l[3] bit5
    get: function(){ return _g; },
    set: function(v){
      _g = v;
      try {
        if (v && typeof v['copyBytesToGo'] === 'function' && !v.__cbHooked) {
          var _cb = v['copyBytesToGo'];
          v['copyBytesToGo'] = function(tools){
            var mk = null;
            try { mk = String(tools && tools[0] && tools[0][1]); } catch (e) {}
            var rr, er = null;
            try { rr = _cb.apply(this, arguments); }
            catch (e) { er = String(e.message).slice(0, 120); }
            try {
              if ((globalThis.__CBLOG = globalThis.__CBLOG || []).length < 60)
                globalThis.__CBLOG.push('fsz=' + mk + ' threw=' + er + ' ret=' + (typeof rr === 'object' ? 'obj' : rr));
            } catch (e) {}
            if (er) throw new Error(er);
            return rr;
          };
          v.__cbHooked = 1;
          globalThis.__CBHOOK = (globalThis.__CBHOOK || 0) + 1;
        }
        if (v && typeof v['N'] === 'function' && !v.__nHooked) {
          var _N = v['N'];
          v['N'] = function(pc){
            if (globalThis.__NCALLS.length < 60)
              globalThis.__NCALLS.push('pc=' + pc + ' argc=' + (arguments.length - 1) + ' a1=' + String(arguments[1]).slice(0, 24));
            return _N.apply(this, arguments);
          };
          v.__nHooked = 1;
          globalThis.__NCALLS.push('hooked-N');
        }
      } catch (e) { globalThis.__NCALLS.push('hookErr:' + String(e.message).slice(0, 60)); }
    },
  });
`, ctx);

// 监视 __c.qh 的赋值（服务程序 case 680 的落点）
vm.runInContext(`
  globalThis.__QH = { sets: 0, gets: 0, err: null };
  var _oe2 = window.eval;
  globalThis.__STRFIX = ${process.env.ZSE_BITFIX ? 1 : 0};   // 让注入段在 BITFIX 装载前就能判断
  // 判决实验：改 zh 段D 的**最后一个编码字符**（链式 XOR 下只影响最后一个明文字符）
  //   ⇒ 精确翻转段D 末位 nibble，看位图哪个字变 ⇒ 钉死「段D → 哪两个字」
  if (${Number(process.env.ZSE_ZHD || 0)}) {
    try {
      var _zd, _b0 = window.__b;
      function _installZh(b){
        try {
          Object.defineProperty(b, 'zh', {
        configurable: true, enumerable: true,
        get: function(){ return _zd; },
        set: function(v){
          try {
            var S = String(v), SEP = String.fromCharCode(0x200C);
            var _mode = ${JSON.stringify(process.env.ZSE_ZA || 'D')};
            // 通用：ZSE_ZA = 段序号（0..n-1，按 U+200C 切分），翻转该段**最后一个编码字符**
            // ZSE_ZASET="k:内容"：把第 k 段整体替换成「同长度的指定内容」（判决 zh 是否喂位图）
            var _zs = ${JSON.stringify(process.env.ZSE_ZASET || '')};
            if (_zs) {
              var _zi = _zs.indexOf(':'), _zk = Number(_zs.slice(0, _zi)), _zv = _zs.slice(_zi + 1);
              var _zp = S.split(SEP);
              if (_zk < _zp.length) {
                var _rep = '';
                while (_rep.length < _zp[_zk].length) _rep += _zv;
                _rep = _rep.slice(0, _zp[_zk].length);
                _zp[_zk] = _rep;
                S = _zp.join(SEP);
                (globalThis.__ZHDLOG = globalThis.__ZHDLOG || []).push('setseg' + _zk + ' -> ' + JSON.stringify(_rep));
              }
              _zd = S;
              return;
            }
            // ZSE_ZA="k:i"：翻第 k 段的第 i 个字符（链式 XOR 下会翻掉该段 i..末尾的全部明文字符）
            if (/^[0-9]+:[0-9]+$/.test(_mode)) {
              var _mp = _mode.split(':'), _mk = Number(_mp[0]), _mi = Number(_mp[1]);
              var _mparts = S.split(SEP);
              if (_mk < _mparts.length && _mi < _mparts[_mk].length) {
                var _off = 0;
                for (var _z2 = 0; _z2 < _mk; _z2++) _off += _mparts[_z2].length + 1;
                var _pos2 = _off + _mi, _oc2 = S.charCodeAt(_pos2);
                S = S.slice(0, _pos2) + String.fromCharCode(_oc2 ^ 0x01) + S.slice(_pos2 + 1);
                (globalThis.__ZHDLOG = globalThis.__ZHDLOG || []).push('seg' + _mk + '@' + _mi + ' flip@' + _pos2);
              } else {
                (globalThis.__ZHDLOG = globalThis.__ZHDLOG || []).push('seg' + _mk + '@' + _mi + ' oob');
              }
              _zd = S;
              return;
            }
            if (/^[0-9]+$/.test(_mode)) {
              var _parts = S.split(SEP), _si = Number(_mode);
              if (_si < _parts.length && _parts[_si].length > 0) {
                var _pi = 0, _acc = 0;
                for (var _z = 0; _z < _si; _z++) _acc += _parts[_z].length + 1;
                _pi = _acc + _parts[_si].length - 1;
                var _oc = S.charCodeAt(_pi);
                S = S.slice(0, _pi) + String.fromCharCode(_oc ^ 0x01) + S.slice(_pi + 1);
                globalThis.__ZHD = (globalThis.__ZHD || 0) + 1;
                (globalThis.__ZHDLOG = globalThis.__ZHDLOG || []).push('seg' + _si + ' nseg=' + _parts.length + ' lens=' + JSON.stringify(_parts.map(function(x){return x.length;})) + ' flip@' + _pi);
                _zd = S;
                return;
              }
              globalThis.__ZHDLOG = (globalThis.__ZHDLOG || []).concat(['seg' + _si + ' oob nseg=' + _parts.length + ' lens=' + JSON.stringify(_parts.map(function(x){return x.length;}))]);
              _zd = S; return;
            }
            if (S.length > 2 && S.charAt(S.length - 1) === SEP) {
              var i = (_mode === 'A') ? S.indexOf(SEP) - 1     // 段A 的最后一个字符
                                      : S.length - 2;          // 段D 的最后一个字符
              var c = S.charCodeAt(i);
              var nx = (_mode === 'A') ? (c ^ 0x08) : (c ^ 0x08);
              S = S.slice(0, i) + String.fromCharCode(nx) + S.slice(i + 1);
              globalThis.__ZHD = (globalThis.__ZHD || 0) + 1;
              (globalThis.__ZHDLOG = globalThis.__ZHDLOG || []).push('seg' + _mode + ' 末位 nibble 翻转 (原 char=0x' + c.toString(16) + ' at ' + i + ')');
            }
          } catch (e) { globalThis.__ZHDERR = String(e).slice(0, 80); }
          _zd = S;
        },
          });
          globalThis.__ZHDHOOK = 1;
        } catch (e) { globalThis.__ZHDERR2 = String(e).slice(0, 80); }
      }
      if (_b0) _installZh(_b0);
      else {
        var _bv;
        Object.defineProperty(window, '__b', {
          configurable: true, enumerable: true,
          get: function(){ return _bv; },
          set: function(v){ _bv = v; globalThis.__BSET = (globalThis.__BSET || 0) + 1; _installZh(v); },
        });
      }
    } catch (e) { globalThis.__ZHDERR2 = String(e).slice(0, 80); }
  }
  var _ev = function(x){
    var src = String(x);
    try {
      if (src.length === ${Number(process.env.PTARGET || -1)} && globalThis.__GTRACE) {
        var mm = src.match(/while\\(!!\\[\\]\\)\\{this\\['(\\w+)'\\]=this\\['(\\w+)'\\]\\[(\\w+)\\+\\+\\]\\|\\|[^;]*;/);
        if (mm) {
          // （H88 教训：这里的入口插入会改坏代码，已移除）
          src = src.replace(mm[0], mm[0] + ";var __pgvm=this,__pgG=globalThis,__pgp=(" + mm[3] + "-1);__pgG.__PGI=__pgG.__PGI||{n:0};if(__pgvm.__pgid===undefined){__pgvm.__pgid=++__pgG.__PGI.n;}__pgG.__PGR=__pgG.__PGR||{};var __pgk=__pgvm.__pgid+':'+__pgp;if(__pgp>=130&&__pgp<=172&&!__pgG.__PGR[__pgk]){try{var __el=function(x){if(typeof x==='string')return 's'+x.length+':'+x.slice(0,26);if(Array.isArray(x))return 'A'+x.length;if(typeof x==='function')return 'fn';if(x===null)return 'null';return typeof x;};var __d=[];Object.getOwnPropertyNames(__pgvm).forEach(function(__n){var __v;try{__v=__pgvm[__n];}catch(e4){__d.push(__n+'=THROW');return;}if(Array.isArray(__v)){var __e=[];for(var __q=0;__q<40&&__q<__v.length;__q++)__e.push(__el(__v[__q]));__d.push(__n+'['+__v.length+']='+__e.join('|'));}else{__d.push(__n+'='+__el(__v));}});__pgG.__PGR[__pgk]='pc='+__pgp+' op='+__pgvm['" + mm[1] + "']+' :: '+__d.join(' ; ');}catch(e){__pgG.__PGR[__pgk]='ERR '+e.message;}}"
          + ";if(globalThis.__STRFIX){try{var __A=this['A'];if(__A){for(var __ai2=0;__ai2<__A.length;__ai2++){if(__A[__ai2]==='2008100080006030'){__A[__ai2]='2000100080004030';globalThis.__AFIX=(globalThis.__AFIX||0)+1;(globalThis.__AFIXLOG=globalThis.__AFIXLOG||[]).push('A['+__ai2+']');}}}}catch(eA2){}}");
          globalThis.__PGPATCH = (globalThis.__PGPATCH||0) + 1;
          globalThis.__PGCHK = 'idx=' + mm.index + ' mlen=' + mm[0].length
            + ' op=' + mm[1] + ' prog=' + mm[2] + ' pcv=' + mm[3]
            + ' ctx=' + JSON.stringify(src.slice(Math.max(0, mm.index - 40), mm.index + 120))
            + ' head0=' + JSON.stringify(src.slice(0, 60))
            + ' pgAt=' + src.indexOf('__PG');
        }
      }
    } catch (e) { globalThis.__PGERR = String(e.message).slice(0,80); }
    try {
      if ((globalThis.__EVLOG = globalThis.__EVLOG || []).length < 40) {
        globalThis.__EVLOG.push('t=' + (Date.now() - (globalThis.__T0 || Date.now()))
          + ' len=' + src.length
          + ' head=' + JSON.stringify(src.slice(0, 400))
          + ' hostN=' + ((globalThis.__HOSTCALLS && globalThis.__HOSTCALLS.length) || 0)
          + ' typeofC=' + (typeof window.__c)
          + ' typeofB=' + (typeof window.__b)
          + ' typeofG=' + (typeof window.__g));
      }
    } catch (e) {}
    try {
      if (src.length > 40000 && src.length < 50000 && !globalThis.__BIGDUMP) {
        globalThis.__BIGDUMP = 1;
        globalThis.__BIGSRC = src;
      }
    } catch (eBD) {}
    var r = _oe2.call(this, src);
    try {
      if ((globalThis.__EVLOG = globalThis.__EVLOG || []).length < 40) {
        globalThis.__EVLOG.push('  AFTER len=' + src.length
          + ' hostN=' + ((globalThis.__HOSTCALLS && globalThis.__HOSTCALLS.length) || 0)
          + ' typeofC=' + (typeof window.__c)
          + ' typeofB=' + (typeof window.__b));
      }
    } catch (e) {}
    try {
      var cc = window.__c;
      if (cc && !cc.__pgHooked && typeof cc['H'] === 'function') {
        var _H0 = cc['H'];
        cc['H'] = function(pc){
          try {
            if ((globalThis.__PGE2 = globalThis.__PGE2 || []).length < 20)
              globalThis.__PGE2.push('pc=' + pc + ' g=' + (this['g'] ? this['g'].length : 'null')
                + ' g[pc]=' + (this['g'] ? String(this['g'][pc]) : 'null')
                + ' Glen=' + (Array.isArray(this['G']) ? this['G'].length : '?'));
          } catch (e) { globalThis.__PGE2.push('ERR ' + e.message); }
          var rr = _H0.apply(this, arguments);
          try {
            if ((globalThis.__PGE3 = globalThis.__PGE3 || []).length < 20)
              globalThis.__PGE3.push('ret Glen=' + (Array.isArray(this['G']) ? this['G'].length : '?')
                + ' qh=' + (typeof this['qh'] === 'string' ? ('s' + this['qh'].length) : String(this['qh'])));
            var _rs = (typeof rr === 'string') ? rr : (typeof rr === 'number' ? ('#num ' + rr) : (rr === undefined ? '#undef' : (rr === null ? '#null' : ('#' + typeof rr))));
            var _R = globalThis.__PGER || (globalThis.__PGER = []);
            if (_R.length < 4000) _R.push({ pc: pc, ret: _rs,
              b: (typeof rr === 'boolean' ? (rr ? 1 : 0) : null),
              w: (this['g'] ? String(this['g'][pc]) : null) });
          } catch (e) {}
          return rr;
        };
        cc.__pgHooked = 1;
        globalThis.__PGHOOK = (globalThis.__PGHOOK || 0) + 1;
      }
    } catch (e) { globalThis.__PGHOOKERR = String(e.message).slice(0, 100); }
    try {
      if (src.length === 62501 && window.__c && !window.__c.__qhHooked) {
        var _q;
        Object.defineProperty(window.__c, 'qh', {
          configurable: true, enumerable: true,
          get: function(){ globalThis.__QH.gets++; return _q; },
          set: function(v){ globalThis.__QH.sets++; _q = v;
            if (globalThis.__QH.sets <= 3) globalThis.__QH.head = String(v).slice(0, 80); },
        });
        window.__c.__qhHooked = 1;
        // 方案 A（验证性）：按还原出的 case 680 逻辑直接算出 qh 并赋值，看 panic 是否消失
        try {
          // 真实会话实测：qh = 41 字符 = encode(8 hex 位图, keyA) + U+200E + encode(32 hex 指纹, keyB)
          var REC = '80004000' + 'aef15fe2d24d9213feb6845f2ee726fa';
          var enc = function(part, key, acc){
            var out = '';
            for (var i = 0; i < part.length; i++) {
              var c = part.charCodeAt(i), k = key.charCodeAt(i % key.length);
              acc = (c ^ k) ^ acc; out += String.fromCharCode(acc);
            }
            return out;
          };
          var a3 = (window.__b && typeof window.__b.a3 === 'number') ? window.__b.a3 : 0;
          var s1 = enc(REC.slice(0, 8), '6a6cb1bb3970bae6', a3);
          var s2 = enc(REC.slice(8, 40), '44ae0b7a68bf0f7a', a3);
          window.__c.qh = s1 + String.fromCharCode(0x8206) + s2;
          globalThis.__QH.forced = window.__c.qh.length;
        } catch (e) { globalThis.__QH.forceErr = String(e.message).slice(0, 100); }
        globalThis.__QH.hooked = 1;
      }
    } catch (e) { globalThis.__QH.err = String(e.message).slice(0, 120); }
    return r;
  };
  try {
    Object.defineProperty(_ev, 'name', { value: 'eval', configurable: true });
    Object.defineProperty(_ev, 'toString', {
      value: function () { return 'function eval() { [native code] }'; },
      configurable: true, writable: true, enumerable: false,
    });
    globalThis.__EVNATIVE = String(_ev).indexOf('native');
  } catch (e) { globalThis.__EVNATIVE = 'ERR'; }
  window.eval = _ev;
  if (${Number(process.env.NOEVAL || 0)}) { window.eval = _oe2; globalThis.__EVBYPASS = 1; }
`, ctx);

// 接住 console 输出 —— Go 的 panic 消息就是通过 console.error 打出来的，之前被空函数吞了
vm.runInContext(`
  globalThis.__CALLS = [];
  var __nop = ${Number(process.env.NOPROXY || 0)};   // 1 = 不包 Function.prototype.apply / Reflect.*（它们会在 Error.stack 里留帧）
  globalThis.__MC = [];
  globalThis.__mc = function(f, n, a){
    try { return f[n].apply(f, a); }
    catch (e) {
      try { if (globalThis.__MC.length < 20) globalThis.__MC.push('MC name=' + String(n)
        + ' ftype=' + (typeof f[n]) + ' nargs=' + a.length
        + ' types=' + JSON.stringify(Array.prototype.map.call(a, function(x){ return typeof x === 'string' ? ('s' + x.length) : typeof x; }))
        + ' err=' + String(e.message).slice(0, 90)); } catch (e2) {}
      throw e;
    }
  };
  globalThis.__dc = function(f, a){
    try { return f.apply(null, a); }
    catch (e) {
      try { if (globalThis.__MC.length < 20) globalThis.__MC.push('DC ftype=' + (typeof f) + ' nargs=' + a.length
        + ' types=' + JSON.stringify(Array.prototype.map.call(a, function(x){ return typeof x === 'string' ? ('s' + x.length) : typeof x; }))
        + ' err=' + String(e.message).slice(0, 90)); } catch (e2) {}
      throw e;
    }
  };
  var _ra = Reflect.apply, _rg = Reflect.get, _rs = Reflect.set;
  globalThis.__AP = [];
  var _fpa = Function.prototype.apply;
  if (!__nop) Function.prototype.apply = function(self, args){
    try {
      if (globalThis.__AP.length < 40)
        globalThis.__AP.push('fn=' + (this && this.name ? this.name : typeof this)
          + ' self=' + ((self === null || self === undefined) ? String(self)
              : (self.constructor && self.constructor.name) ? self.constructor.name : typeof self)
          + ' nargs=' + (args ? args.length : '?')
          + ' types=' + (args ? JSON.stringify(Array.prototype.map.call(args, function(x){ return typeof x === 'string' ? ('s' + x.length) : typeof x; })) : '-'));
    } catch (e) { try { globalThis.__AP.push('ERR ' + e.message); } catch (e2) {} }
    return _fpa.call(this, self, args);
  };
  globalThis.__GETS = [];
  if (!__nop) Reflect.get = function(t, k){
    try {
      if ((globalThis.__GETS = globalThis.__GETS || []).length < 400) {
        var rv;
        try { rv = _rg.apply(this, arguments); } catch (e) { rv = 'THROW'; }
        var td = (t === null) ? 'null' : (t === undefined) ? 'undefined'
          : (t === window) ? 'window' : (t.constructor && t.constructor.name) ? t.constructor.name : typeof t;
        globalThis.__GETS.push('G|' + td + '|' + String(k) + '|'
          + (rv === undefined ? 'undef' : typeof rv) + (typeof rv === 'string' ? ('s' + rv.length) : ''));
        if (rv === 33408 || rv === 0x8200) {
          (globalThis.__WHERE2 = globalThis.__WHERE2 || []).push('Reflect.get ' + td + '.' + String(k) + ' = 33408');
        }
      }
    } catch (e) { try { globalThis.__GETS.push('ERR ' + e.message); } catch (e2) {} }
    return _rg.apply(this, arguments);
  };
  globalThis.__SETS = [];
  if (!__nop) Reflect.set = function(t, k, v){
    try {
      if (globalThis.__SETS.length < 200) {
        var td = (t === null || t === undefined) ? String(t)
          : (t.constructor && t.constructor.name) ? t.constructor.name : typeof t;
        globalThis.__SETS.push(String(k) + '=' + (typeof v === 'string' ? ('s' + v.length + ':' + v.slice(0, 20)) : typeof v) + '@' + td);
      }
    } catch (e) {}
    return _rs.apply(this, arguments);
  };
  if (!__nop) Reflect.apply = function(fn, self, args){
    try {
      if (globalThis.__CALLS.length < 600) {
        var nm = (fn && fn.name) ? fn.name : (typeof fn);
        var selfDesc = (self === null || self === undefined) ? String(self)
          : (self.constructor && self.constructor.name) ? self.constructor.name : typeof self;
        var extra = '';
        if (typeof fn !== 'function' && fn !== null && fn !== undefined) {
          try { extra = '|keys=' + Object.getOwnPropertyNames(fn).slice(0, 10).join('/') + '|str=' + String(fn).slice(0, 60); } catch (e) { extra = '|err'; }
        }
        globalThis.__CALLS.push(nm + '|' + selfDesc + '|' + (args ? args.length : '?') + '|' + (typeof fn) + extra);
      }
    } catch (e) {}
    return _ra.apply(this, arguments);
  };
  globalThis.__CONSOLE = [];
  var _ce = console.error, _cw = console.warn, _cl = console.log;
  console.error = function(){ try { globalThis.__CONSOLE.push('ERR: ' + Array.prototype.map.call(arguments, String).join(' ').slice(0, 900)); } catch(e){} };
  console.warn  = function(){ try { globalThis.__CONSOLE.push('WARN: ' + Array.prototype.map.call(arguments, String).join(' ').slice(0, 400)); } catch(e){} };
  console.log   = function(){ try { globalThis.__CONSOLE.push('LOG: ' + Array.prototype.map.call(arguments, String).join(' ').slice(0, 400)); } catch(e){} };
`, ctx);

vm.runInContext(`
  globalThis.__VTCAP = Number('${process.env.VTCAP || 30000}');
  globalThis.__GTRACE = Number('${process.env.GTRACE || 1}');
  // 监视 __b.R 的每一次写入（段 D 的来源：l[3]/l[4] 两个环境校验字）
  (function(){
    var handler = {
      set: function(t, k, val){
        try {
          if ((globalThis.__RSET = globalThis.__RSET || []).length < 600)
            globalThis.__RSET.push('set[' + String(k) + ']=' + (typeof val === 'string' ? ('s' + val.length + ':' + val.slice(0, 24)) : (typeof val === 'number' ? String(val) + '(0x' + val.toString(16) + ')' : typeof val)));
        } catch (e) {}
        t[k] = val; return true;
      }
    };
    var t = setInterval(function(){
      try {
        globalThis.__RPOLL = (globalThis.__RPOLL || 0) + 1;
        var b = window.__b;
        if (b) globalThis.__RSAW = (globalThis.__RSAW || 0) + 1;
        if (b && !b.__rHooked) {
          var cur = b.R;
          if (cur === undefined || cur === null) return;   // 还没建，等下一轮
          b.__rHooked = 1;
          var _R = new Proxy(cur, handler);
          (globalThis.__RSET = globalThis.__RSET || []).push('HOOK 初始 len=' + cur.length + ' ' + (function(){ try { return JSON.stringify(Array.prototype.slice.call(cur, 0, 12).map(function(x){ return typeof x === 'string' ? ('s' + x.length + ':' + x.slice(0, 16)) : (typeof x === 'number' ? x : typeof x); })); } catch (e) { return 'ERR'; } })());
          Object.defineProperty(b, 'R', {
            configurable: true, enumerable: true,
            get: function(){ return _R; },
            set: function(v){ _R = new Proxy(v, handler); }
          });
        }
      } catch (e) { globalThis.__RHERR = String(e.message).slice(0, 140); }
    }, 1);
    setTimeout(function(){ clearInterval(t); }, 60000);
  })();
  globalThis.__T0 = Date.now();
  // 轮询安装 __c.H 包装（__c 可能在最后一次 eval 之后才创建）
  (function(){
    var t = setInterval(function(){
      try {
        var cc = window.__c;
        if (cc && !cc.__pgHooked && typeof cc['H'] === 'function') {
          var _H0 = cc['H'];
          cc['H'] = function(pc){
            try {
              if ((globalThis.__PGE2 = globalThis.__PGE2 || []).length < 20)
                globalThis.__PGE2.push('pc=' + pc + ' g=' + (this['g'] ? this['g'].length : 'null')
                  + ' g[pc]=' + (this['g'] ? String(this['g'][pc]) : 'null')
                  + ' Glen=' + (Array.isArray(this['G']) ? this['G'].length : '?'));
            } catch (e) { globalThis.__PGE2.push('ERR ' + e.message); }
            var rr = _H0.apply(this, arguments);
            try {
              if ((globalThis.__PGE3 = globalThis.__PGE3 || []).length < 20)
                globalThis.__PGE3.push('ret Glen=' + (Array.isArray(this['G']) ? this['G'].length : '?')
                  + ' qh=' + (typeof this['qh'] === 'string' ? ('s' + this['qh'].length) : String(this['qh'])));
            } catch (e) {}
            return rr;
          };
          cc.__pgHooked = 1;
          globalThis.__PGHOOK = (globalThis.__PGHOOK || 0) + 1;
        }
      } catch (e) { globalThis.__PGHOOKERR = String(e.message).slice(0, 100); }
    }, 20);
    setTimeout(function(){ clearInterval(t); }, 60000);
  })();
  globalThis.__HOSTCALLS = [];
  globalThis.__VT = [];
  globalThis.__ALLN_GO = ${Number(process.env.ZSE_ALLN_GO || 0)};
  globalThis.__CHOOK2 = ${Number(process.env.ZSE_CHOOK2 || 0)};
  globalThis.__CHREQ = ${Number(process.env.ZSE_CHOOK2 || 0)};
  globalThis.__GPOKE_C = ${Number(process.env.ZSE_GPOKE_C ? 1 : 0)};
  globalThis.__DELALL = ${Number(process.env.ZSE_DELALL || 0)};
  globalThis.__MEMPATCHW = (function(){ var e = ${JSON.stringify(process.env.ZSE_MEMPATCHW || '')}; if (!e) return null;
    var ci = e.indexOf(':'); var crc = e.slice(0, ci); var rest = e.slice(ci + 1);
    var ws = rest.split(',').map(function(x){ var q = x.split(':'); return [Number(q[0]), q[1]]; });
    return { crc: crc, words: ws }; })();
  globalThis.__QHFLIP = ${Number(process.env.ZSE_QHFLIP === undefined ? -1 : process.env.ZSE_QHFLIP)};
  globalThis.__QHFLIP_POLL = 1;
  globalThis.__ALLN_GO_PATCH = function(n){
    var d = document, a2 = d.all;
    var base = 0; try { base = Number(a2.length) || 0; } catch(e){}
    for (var i = 0; i < n; i++) { try { a2[base + i] = d.createElement('div'); } catch(e){} }
    try { Object.defineProperty(a2, 'length', { value: base + n, configurable: true }); } catch(e){}
    return a2.length;
  };
  var _inst = WebAssembly.instantiate;
  try { globalThis.__WAC = globalThis.__WAC || []; } catch(e){}
  WebAssembly.instantiate = function(bytes, imports){
    try { globalThis.__WAC.push('called len=' + (bytes && (bytes.byteLength || bytes.length)) + ' impKeys=' + (imports?Object.keys(imports).join('|'):'none')); } catch(e){}

    // 捕获导入对象里的 WebAssembly.Table，并包住它的 set（JS 侧钩 table.set，无需改 wasm）
    try {
      var _tbl = null;
      if (imports) Object.keys(imports).forEach(function(m){
        var o = imports[m];
        if (o && typeof o === 'object') Object.keys(o).forEach(function(k){
          try { if (o[k] instanceof WebAssembly.Table) { _tbl = o[k]; } } catch(e){}
        });
      });
      if (!_tbl && imports && imports.env && imports.env.__indirect_function_table) _tbl = imports.env.__indirect_function_table;
      if (_tbl) {
        globalThis.__TBL = _tbl;
        var _set = _tbl.set.bind(_tbl);
        var _origSet = WebAssembly.Table.prototype.set;
        Object.defineProperty(_tbl, 'set', {
          configurable: true, writable: true,
          value: function(i, fn){
            try {
              var L = globalThis.__TSET || (globalThis.__TSET = []);
              if (L.length < 400) {
                var nm = '';
                try { nm = (fn && (fn.name || '')) + '|' + String(fn).slice(0, 40); } catch(e){}
                L.push('i=' + i + ' fn=' + nm);
              }
            } catch(e){}
            return _origSet.call(this, i, fn);
          },
        });
        globalThis.__TBLOK = (_tbl.length || -1);
      } else { globalThis.__TBLERR = 'no table in imports'; }
    } catch (e) { globalThis.__TBLERR = String(e).slice(0, 80); }
    // 钩导出的 malloc/calloc/realloc（导出段 idx=195..198，Emscripten 风格）
    var _wrapExp = function(inst){
        try {
          var ex = inst && (inst.exports || (inst.instance && inst.instance.exports));
          if (!ex) return;
          ['malloc', 'calloc', 'realloc'].forEach(function(nm){
            if (typeof ex[nm] !== 'function' || ex['__w_' + nm]) return;
            var o = ex[nm];
            ex[nm] = function(){
              var r = o.apply(null, arguments);
              try {
                var L = globalThis.__MALLOC || (globalThis.__MALLOC = []);
                if (L.length < 300) L.push(nm + '(' + Array.prototype.slice.call(arguments).join(',') + ') -> 0x' + (Number(r) >>> 0).toString(16));
              } catch(e){}
              return r;
            };
            try { ex['__w_' + nm] = 1; } catch(e){}
          });
        } catch(e){ globalThis.__MALLOCERR = String(e).slice(0,80); }
      };

    // 断点插桩：把内嵌 wasm 换成打过 fd_write 断点的版本（BPWASM 由外层注入为 base64）
    if (globalThis.__BPWASM_B64) {
      try {
        var _b = atob(globalThis.__BPWASM_B64);
        var _u = new Uint8Array(_b.length);
        for (var _i = 0; _i < _b.length; _i++) _u[_i] = _b.charCodeAt(_i);
        bytes = _u;
        globalThis.__BPOK = (globalThis.__BPOK || 0) + 1;
      } catch (e) { globalThis.__BPERR = String(e.message); }
    }
    try {
      var wasi = imports && imports.wasi_snapshot_preview1;
      if (wasi && typeof wasi.fd_write === 'function') {
        var _fw = wasi.fd_write;
        wasi.fd_write = function(fd, iovs, iovsLen, nwritten){
          // 断点：插桩调用传 cnt=0 ⇒ fd=opcode、iovs=VM 指针；记 [opcode, sp, pr, 栈顶3个低32位]
          // 魔数断点（sliceAppend 入口）：nwritten = 0x5A5A5A5A ⇒ 记全部 4 个局部
          if (Number(nwritten) === 0x5A5A5A5A) {
            var _sl = globalThis.__SLOG || (globalThis.__SLOG = []);
            var _extra = '';
            try {
              var _p0 = Number(iovs);
              var _mo = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
              if (_mo && _p0 > 0x10000) {
                var _d = new DataView(_mo.buffer);
                var _sp = _d.getUint32(_p0 + 0x12C, true);
                var _pr = _d.getUint32(_p0 + 0x128, true);
                var _sw = [];
                for (var _q = 0; _q < 44; _q++) {
                  var _ix = _sp - 1 - _q;
                  if (_ix < 0) break;
                  _sw.push(_d.getUint32(_pr + _ix * 8, true).toString(16) + ':' + _d.getUint32(_pr + _ix * 8 + 4, true).toString(16));
                }
                _extra = ' p0=' + _p0 + ' sp=' + _sp + ' pr=' + _pr + ' stack=' + _sw.join(' ');
                try {
                  var _u8 = new Uint8Array(_mo.buffer);
                  var _strs = [];
                  for (var _q2 = 0; _q2 < 44; _q2++) {
                    var _ix2 = _sp - 1 - _q2;
                    if (_ix2 < 0) break;
                    var _t = _d.getUint32(_pr + _ix2 * 8, true);
                    if (_t !== 0x11800) continue;
                    var _h = _d.getUint32(_pr + _ix2 * 8 + 4, true);
                    var _dp = _d.getUint32(_h, true), _ln = _d.getUint32(_h + 4, true);
                    if (_ln > 0 && _ln < 200 && _dp + _ln < _u8.length) {
                      var _s2 = '';
                      for (var _c2 = 0; _c2 < _ln; _c2++) _s2 += String.fromCharCode(_u8[_dp + _c2]);
                      _strs.push(_ix2 + '=' + JSON.stringify(_s2));
                    }
                  }
                  _extra += ' STRS[' + _strs.join(' ') + ']';
                } catch(eS2) { _extra += ' STRERR ' + String(eS2.message).slice(0,40); }
              }
            } catch(eBPX) { _extra = ' ERR ' + String(eBPX.message).slice(0,40); }
            var _pv = '';
            try {
              var _p1 = Number(fd);
              var _mo2 = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
              if (_mo2 && _p1 > 0x10000 && _p1 < _mo2.buffer.byteLength - 300) {
                var _d2 = new DataView(_mo2.buffer);
                var _ty = _d2.getUint32(_p1 + 276, true), _va = _d2.getUint32(_p1 + 280, true);
                _pv = ' PUSHtype=' + _ty.toString(16) + ' val=' + _va + '(0x' + _va.toString(16) + ')';
              }
            } catch(ePV){}
            if (_sl.length < 3000) _sl.push('fd=' + Number(fd) + ' hex=' + (Number(fd) >>> 0).toString(16) + _pv + _extra);
          }
          // 格式化点断点：这里 fd = 正在被格式化成 hex 的值（iovs 可能很小/为 0）
          if (Number(iovsLen) === 0) {
            var _fv = Number(fd);
            if (_fv > 0x100) {
              var _fl = globalThis.__FMTLOG || (globalThis.__FMTLOG = []);
              if (_fl.length < 200) _fl.push('v=' + _fv + ' hex=' + _fv.toString(16));
            }
          }
          if (Number(iovsLen) === 0 && Number(iovs) > 0x10000) {
            try {
              var _mo = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
              if (!_mo) { try { _mo = this && this.t && this.t.exports && (this.t.exports.mem || this.t.exports.memory); } catch (e9) {} }
              if (_mo) {
                var _d = new DataView(_mo.buffer);
                var _sp = _d.getUint32(Number(iovs) + 0x12C, true);
                var _pr = _d.getUint32(Number(iovs) + 0x128, true);
                var _r = [Number(fd), _sp, _pr, 0, 0, 0, 0, 0, 0, 0, 0];
                if (_pr && _sp > 0 && _sp < 200000) {
                  for (var _k = 0; _k < 4; _k++) {
                    var _ix = _sp - 1 - _k;
                    if (_ix >= 0) {
                      _r[3 + _k * 2] = _d.getUint32(_pr + _ix * 8, true);
                      _r[4 + _k * 2] = _d.getUint32(_pr + _ix * 8 + 4, true);
                    }
                  }
                }
                globalThis.__BPN = (globalThis.__BPN || 0) + 1;
                // 按「逐字节」找 Go 侧的整数 0x8200（小端 00 82 00 00），在断点处扫 wasm 内存
                if (globalThis.__LEWATCH && globalThis.__BPN % 40 === 0 && (globalThis.__LEHITS || 0) < 40) {
                  var _u8w = new Uint8Array(_mo.buffer);
                  var _posw = _u8w.indexOf(0x00), _nw = 0;
                  while (_posw >= 0 && _nw < 300000) {
                    _nw++;
                    if (_u8w[_posw+1] === 0x82 && _u8w[_posw+2] === 0x00 && _u8w[_posw+3] === 0x00) {
                      globalThis.__LEHITS = (globalThis.__LEHITS || 0) + 1;
                      var _lw = globalThis.__LELOG || (globalThis.__LELOG = []);
                      if (_lw.length < 20) _lw.push('bp' + globalThis.__BPN + ' @0x' + _posw.toString(16) + ' ctx=' + _u8w[_posw-4] + ',' + _u8w[_posw-3] + ',' + _u8w[_posw-2] + ',' + _u8w[_posw-1]);
                    }
                    _posw = _u8w.indexOf(0x00, _posw + 1);
                  }
                }
                // 整栈 dump：前 12 次断点把整个操作数栈记下来（找 record93 的 16 字节块在不在栈上）
                if (globalThis.__BPDUMP && (globalThis.__BPN || 0) >= 2380) {
                  var _sw = [];
                  for (var _q3 = 0; _q3 < 24; _q3++) {
                    var _ix3 = _sp - 1 - _q3;
                    if (_ix3 < 0) break;
                    _sw.push(_d.getUint32(_pr + _ix3 * 8, true).toString(16));
                  }
                  (globalThis.__STK = globalThis.__STK || []).push('bp' + globalThis.__BPN + ' sp=' + _sp + ' [' + _sw.join(',') + ']');
                }
                var _bt = globalThis.__BPTR || (globalThis.__BPTR = []);
                if (_bt.length < 200000) _bt.push(_r);
                // 内存层修正：在密码学函数断点上打补丁（此时 record93 已在内存里）
                if (globalThis.__MEMPATCH && (globalThis.__MPHIT || 0) === 0 && (globalThis.__MPSCAN || 0) < 120
                      && ((globalThis.__BPN || 0) % 20) === 0) {
                  globalThis.__MPSCAN = (globalThis.__MPSCAN || 0) + 1;
                  // record93 里 crc 是**8 个 ASCII 字符**（'5d98534a'），不是原始 4 字节
                  var _hx = globalThis.__MEMPATCH.crc;   // 8 字符
                  var cc = [];
                  for (var _ci = 0; _ci < 8; _ci++) cc.push(_hx.charCodeAt(_ci));
                  var _u8b = new Uint8Array(_mo.buffer);
                  var _p2 = _u8b.indexOf(cc[0]), _n2 = 0, _seen = 0;
                  while (_p2 >= 0 && _n2 < 400000) {
                    _n2++;
                    var _ok = true;
                    for (var _cj = 1; _cj < 8; _cj++) { if (_u8b[_p2+_cj] !== cc[_cj]) { _ok = false; break; } }
                    if (_ok) {
                      _seen++;
                      var _st2 = _p2 - 81;
                      if (_st2 >= 0 && _u8b[_st2 + 80] === 0x7a) {
                        var _o2 = _st2 + 32;
                        var _cur2 = String.fromCharCode(_u8b[_o2], _u8b[_o2+1], _u8b[_o2+2], _u8b[_o2+3]);
                        if (_cur2 !== globalThis.__MEMPATCH.to) {
                          var _t2 = globalThis.__MEMPATCH.to;
                          _u8b[_o2] = _t2.charCodeAt(0); _u8b[_o2+1] = _t2.charCodeAt(1);
                          _u8b[_o2+2] = _t2.charCodeAt(2); _u8b[_o2+3] = _t2.charCodeAt(3);
                          globalThis.__MPHIT = (globalThis.__MPHIT || 0) + 1;
                          (globalThis.__MPLOG = globalThis.__MPLOG || []).push('from=' + _cur2 + ' to=' + _t2 + ' at=0x' + _st2.toString(16));
                        }
                      }
                    }
                    _p2 = _u8b.indexOf(c0, _p2 + 1);
                  }
                  globalThis.__MPCRCSEEN = (globalThis.__MPCRCSEEN || 0) + _seen;
                }
              }
            } catch (e8) { (globalThis.__BPTRERR = globalThis.__BPTRERR || []).push(String(e8.message).slice(0, 80)); }
          }
          try {
            var mo = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
            if (!mo) { try { mo = this && this.t && this.t.exports && (this.t.exports.mem || this.t.exports.memory); } catch (e0) {} }
            var out = '';
            if (mo) {
              var dv = new DataView(mo.buffer);
              for (var i = 0; i < Number(iovsLen); i++) {
                var base = Number(dv.getUint32(Number(iovs) + i * 8, true));
                var len = Number(dv.getUint32(Number(iovs) + i * 8 + 4, true));
                for (var q = 0; q < len && q < 4000; q++) out += String.fromCharCode(dv.getUint8(base + q));
              }
            }
            (globalThis.__FD = globalThis.__FD || []).push('fd' + Number(fd) + ':' + out.slice(0, 900));
          } catch (e) { (globalThis.__FD = globalThis.__FD || []).push('ERR ' + String(e.message).slice(0, 120)); }
          // 魔数断点：绝不能调原始 fd_write（否则会往 0x5A5A5A5A 写、越界陷阱）
          if (Number(nwritten) === 0x5A5A5A5A) return 0;
          return _fw.apply(this, arguments);
        };
      }
      var env = imports && imports.env;
      try {
        var _gj = imports && imports.gojs;
        globalThis.__GOJS = _gj ? Object.keys(_gj).map(function(k){ return k + ':' + typeof _gj[k]; }).join(',') : 'noGojs';
      } catch(eGJ) { globalThis.__GOJS = 'ERR:' + String(eGJ.message).slice(0,50); }
      // NOHOSTHOOK=1 时完全不包装 env 导入：包装会让 Error.stack 里多出
      //   "Function.apply (evalmachine.<anonymous>)" 这一帧，而 zh 段2 就是调用栈的 base64。
      // gojs 命名空间同样包装（原来只包了 env）—— N 只在这里，是没被看到的通道
      try {
        var _gjo = imports && imports.gojs;
        if (_gjo && !${Number(process.env.NOHOSTHOOK || 0)}) Object.keys(_gjo).forEach(function(k){
          if (typeof _gjo[k] !== 'function') return;
          var _origG = _gjo[k];
          if (_origG.__gjw) return;
          var _wg = function(){
            var _ag = Array.prototype.slice.call(arguments);
            try {
              var _L = globalThis.__GJLOG || (globalThis.__GJLOG = []);
              if (_L.length < 400) {
                var _brief = _ag.map(function(x){ return (typeof x === 'bigint') ? ('i' + x.toString()) : String(x); }).join(',');
                var _key = '';
                try {
                  var _moG = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
                  if (_moG && k === 'N' && _ag.length >= 2) {
                    var _dvg = new DataView(_moG.buffer), _pg = Number(_ag[1]), _ng = Number(_ag[2]);
                    if (_ng > 0 && _ng < 200) { var _tg = ''; for (var _qg = 0; _qg < _ng; _qg++) _tg += String.fromCharCode(_dvg.getUint8(_pg + _qg)); _key = _tg; }
                  }
                } catch(eG3){}
                _L.push(k + '(' + _brief.slice(0, 90) + ')' + (_key ? (' key=' + JSON.stringify(_key)) : ''));
              }
            } catch(eG2){}
            return _origG.apply(this, arguments);
          };
          _wg.__gjw = 1;
          try { _wg.toString = function(){ return _origG.toString(); }; } catch(e){}
          _gjo[k] = _wg;
        });
      } catch (eGJ3) { globalThis.__GJERR = String(eGJ3.message).slice(0,80); }
      if (env && !${Number(process.env.NOHOSTHOOK || 0)}) Object.keys(env).forEach(function(k){
        if (typeof env[k] !== 'function') return;
        var orig = env[k];
        env[k] = function(){
          var a = Array.prototype.slice.call(arguments);
          var brief = a.map(function(x){ return (typeof x === 'bigint') ? ('i' + x.toString()) : String(x); }).join(',');
          var rec = { n: globalThis.__HOSTCALLS.length, name: k, a: brief.slice(0, 160) };
          // ZSE_ALLN_GO：JS 层跑完、Go 层开始读 document 时，才改 document.all 的长度。
          //   这样 JS 侧累加器不受影响（避免 Go VM panic），只改 Go 侧看到的 valueLength。
          try {
            if ((globalThis.__ALLN_GO || globalThis.__QHFLIP >= 0 || globalThis.__CHOOK2 || globalThis.__CHREQ || globalThis.__GPOKE_C || globalThis.__DELALL) && !globalThis.__ALLN_GO_DONE) {
              var _gk0 = null;
              try {
                var _moA = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
                if (_moA && k.indexOf('copyBytesToGo') >= 0 && Number(a[1]) === 1024) {
                  var _dvA = new DataView(_moA.buffer), _sA = Number(a[4]), _nA = Number(a[5]);
                  var _tA = ''; for (var _qA = 0; _qA < _nA; _qA++) _tA += String.fromCharCode(_dvA.getUint8(_sA + _qA));
                  _gk0 = _tA;
                }
              } catch(eA) {}
              if (_gk0 === 'document') {
                globalThis.__ALLN_GO_DONE = 1;
                if (globalThis.__ALLN_GO) {
                  try { globalThis.__ALLN_GO_RES = globalThis.__ALLN_GO_PATCH(globalThis.__ALLN_GO); } catch(eAG2){ globalThis.__ALLN_GO_ERR = String(eAG2.message).slice(0,60); }
                }
                if (globalThis.__QHFLIP >= 0 && !globalThis.__QHFLIP_REQ) globalThis.__QHFLIP_REQ = globalThis.__QHFLIP;

                if (globalThis.__CHREQ && !globalThis.__CHREQ_DONE) { globalThis.__CHREQ_DONE = 1; globalThis.__CHREQ_REQ = 1; }
                if (globalThis.__DELALL && !globalThis.__DELALL_DONE) {
                  globalThis.__DELALL_DONE = 1;
                  try {
                    globalThis.__DELALL_RES = globalThis.__NODEDEL ? globalThis.__NODEDEL() : 'nohelper';
                  } catch(eDA) { globalThis.__DELALL_RES = 'ERR:' + String(eDA.message).slice(0,50); }
                }
                if (globalThis.__GPOKE_C && !globalThis.__GPOKE_C_DONE) {
                  globalThis.__GPOKE_C_DONE = 1;
                  try { globalThis.__GPOKE_C_RES = globalThis.__NODEPOKE ? globalThis.__NODEPOKE() : 'nohelper'; } catch(ePk) { globalThis.__GPOKE_C_RES = 'ERR:' + String(ePk.message).slice(0,50); }
                }

              }
            }
          } catch(eAG) { globalThis.__ALLN_GO_ERR = String(eAG.message).slice(0,80); }
          try {
            if (k.indexOf('copyBytesToGo') >= 0 && (Number(a[1]) === 1032 || Number(a[1]) === 1034)) {
              var _mo9 = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
              if (_mo9) {
                var _u9 = new Uint8Array(_mo9.buffer), _p9 = Number(a[4]), _l9 = Number(a[5]);
                if (_l9 > 0 && _l9 <= 400 && _p9 > 0 && _p9 + _l9 <= _u9.length) {
                  var _s9 = '';
                  for (var _q9 = 0; _q9 < _l9; _q9++) _s9 += String.fromCharCode(_u9[_p9 + _q9]);
                  rec.srcText = _s9;
                }
              }
            }
          } catch (e9) { rec.srcErr = String(e9.message).slice(0, 60); }
          try {
            if (k.indexOf('copyBytesToGo') >= 0 && (Number(a[1]) === 1024 || Number(a[1]) === 1026)) {
              var mo = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
              if (mo) {
                var dv = new DataView(mo.buffer), s0 = Number(a[4]), n0 = Number(a[5]);
                var str = '';
                for (var q = 0; q < Math.min(n0, 60); q++) str += String.fromCharCode(dv.getUint8(s0 + q));
                rec.getKey = (Number(a[1]) === 1026 ? 'CALL:' : '') + str;
                var recvRef = Number(a[2]);
                rec.recvIsNull = (recvRef === 0);
              }
            }
          } catch (e) { rec.probeErr = String(e.message).slice(0, 60); }
          // 桥接探针：找 record93 / zh 是否以 JS 字符串过桥（改桥接层的前置条件）
          try {
            if (k.indexOf('copyBytesToGo') >= 0) {
              var moB = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
              if (moB) {
                var dvB = new DataView(moB.buffer);
                var cands = [[Number(a[4]), Number(a[5])], [Number(a[2]), Number(a[3])], [Number(a[6]), Number(a[7])]];
                for (var ci = 0; ci < cands.length; ci++) {
                  var pp = cands[ci][0], nn = cands[ci][1];
                  if (!(nn >= 40 && nn <= 200000 && pp > 0 && pp + nn <= dvB.byteLength)) continue;
                  var ss = '';
                  for (var q2 = 0; q2 < Math.min(nn, 260); q2++) ss += String.fromCharCode(dvB.getUint8(pp + q2));
                  var printable = /^[\x20-\x7e]{40,}$/.test(ss);
                  if (!printable) continue;
                  var rec93 = (nn === 93 && /^[0-9a-f]{48}[0-9a-f]{32}z[0-9a-f]{12}$/.test(ss + ''));
                  var br = globalThis.__BRIDGE || (globalThis.__BRIDGE = []);
                  if (br.length < 200) br.push('len=' + nn + ' || ' + ss.split(String.fromCharCode(13)).join(' ').split(String.fromCharCode(10)).join(' '));
                }
              }
            }
          } catch (eB) { (globalThis.__BRIDGE = globalThis.__BRIDGE || []).push('ERR ' + String(eB.message).slice(0, 60)); }
          // 位图首次出现在 wasm 内存的时刻（相对宿主调用序号）——判定 JS 写还是 Go 写
          try {
            if (!globalThis.__RECFIRST) {
              var _mr = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
              if (_mr) {
                var _ur = new Uint8Array(_mr.buffer);
                // 找 '48hex + 32hex + z' 的模式：先用 'z'(0x7a) 定位，再回看 80 字节
                for (var _pz = 0; _pz < _ur.length; _pz++) {
                  if (_ur[_pz] !== 0x7a) continue;
                  if (_pz < 80) continue;
                  var _st0 = _pz - 80, _ok = true, _hb = '';
                  for (var _q5 = 0; _q5 < 80; _q5++) {
                    var _ch = _ur[_st0 + _q5];
                    var _isHex = (_ch >= 48 && _ch <= 57) || (_ch >= 97 && _ch <= 102);
                    if (!_isHex) { _ok = false; break; }
                  }
                  if (!_ok) continue;
                  for (var _q6 = 0; _q6 < 48; _q6++) _hb += String.fromCharCode(_ur[_st0 + _q6]);
                  globalThis.__RECFIRST = { atHostCall: globalThis.__HOSTCALLS.length, addr: _st0, bitmap: _hb };
                  break;
                }
                if (!globalThis.__RECFIRST) globalThis.__RECSCAN = (globalThis.__RECSCAN || 0) + 1;
              }
            }
          } catch (eR) { globalThis.__RECERR = String(eR.message).slice(0,60); }
          if (globalThis.__HOSTCALLS.length < 4000) globalThis.__HOSTCALLS.push(rec);
          // 内存层修正（ZSE_MEMPATCH=1）：w8 的 0x8200 完全在 Go 侧算出、从不经过宿主边界，
          //   所以直接改 wasm 内存里的 record93：用已知的 crc32(UA) 定位，再把第 8 个字改成真机值。
          try {
            if (globalThis.__MEMPATCHW) {
              // ZSE_MEMPATCHW="7:8800,8:8000"：按「字序号:目标值」直接改内存里的 record93（诊断用）
              try {
                var _mw = globalThis.__MEMPATCHW;
                var _mmw = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
                if (_mmw && _mw.crc) {
                  var _u8w = new Uint8Array(_mmw.buffer);
                  var _c0 = parseInt(_mw.crc.substr(0,2),16), _c1 = parseInt(_mw.crc.substr(2,2),16),
                      _c2 = parseInt(_mw.crc.substr(4,2),16), _c3 = parseInt(_mw.crc.substr(6,2),16);
                  globalThis.__MWDIAG = globalThis.__MWDIAG || [];
                  if (globalThis.__MWDIAG.length < 10) globalThis.__MWDIAG.push('scan len=' + _u8w.length + ' crcBytes=' + _c0 + ',' + _c1 + ',' + _c2 + ',' + _c3);
                  var _pw = _u8w.indexOf(_c0), _nw = 0;
                  while (_pw >= 0 && _nw < 200000) {
                    _nw++;
                    if (_u8w[_pw+1] === _c1 && _u8w[_pw+2] === _c2 && _u8w[_pw+3] === _c3) {
                      var _stw = _pw - 81;
                      if (globalThis.__MWDIAG && globalThis.__MWDIAG.length < 40) globalThis.__MWDIAG.push('crcMatch@' + _pw + ' stw=' + _stw + ' byte80=' + _u8w[_stw+80]);
                      if (_stw >= 0 && _u8w[_stw + 80] === 0x7a) {
                        for (var _wi = 0; _wi < _mw.words.length; _wi++) {
                          var _of = _stw + _mw.words[_wi][0] * 4, _tv = _mw.words[_wi][1];
                          var _cur2 = '';
                          for (var _q3 = 0; _q3 < 4; _q3++) _cur2 += String.fromCharCode(_u8w[_of + _q3]);
                          if (_cur2 !== _tv) {
                            for (var _q4 = 0; _q4 < 4; _q4++) _u8w[_of + _q4] = _tv.charCodeAt(_q4);
                            (globalThis.__MWLOG = globalThis.__MWLOG || []).push('w' + _mw.words[_wi][0] + ' ' + _cur2 + '->' + _tv);
                          }
                        }
                      }
                    }
                    _pw = _u8w.indexOf(_c0, _pw + 1);
                  }
                }
              } catch (eMW) { globalThis.__MWERR = String(eMW.message).slice(0,80); }
            }
            if (globalThis.__MEMPATCH) {
              var _mm = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
              if (_mm) {
                var _u8 = new Uint8Array(_mm.buffer);
                var _hx = globalThis.__MEMPATCH.crc;   // 8 个 hex 字符
                var c0 = parseInt(_hx.substr(0,2),16), c1 = parseInt(_hx.substr(2,2),16),
                    c2 = parseInt(_hx.substr(4,2),16), c3 = parseInt(_hx.substr(6,2),16);
                var _pos = _u8.indexOf(c0), _n = 0, _found = 0;
                while (_pos >= 0 && _n < 200000) {
                  _n++;
                  if (_u8[_pos+1] === c1 && _u8[_pos+2] === c2 && _u8[_pos+3] === c3) {
                    _found++;
                    var _st = _pos - 81;
                    if (_st >= 0 && _u8[_st + 80] === 0x7a) {
                      var _o = _st + 32;
                      var _cur = String.fromCharCode(_u8[_o], _u8[_o+1], _u8[_o+2], _u8[_o+3]);
                      if (_cur !== globalThis.__MEMPATCH.to) {
                        var _t = globalThis.__MEMPATCH.to;
                        _u8[_o] = _t.charCodeAt(0); _u8[_o+1] = _t.charCodeAt(1);
                        _u8[_o+2] = _t.charCodeAt(2); _u8[_o+3] = _t.charCodeAt(3);
                        globalThis.__MPHIT = (globalThis.__MPHIT || 0) + 1;
                        (globalThis.__MPLOG = globalThis.__MPLOG || []).push('from=' + _cur + ' to=' + _t + ' at=0x' + _st.toString(16));
                      }
                    }
                  }
                  _pos = _u8.indexOf(c0, _pos + 1);
                }
                globalThis.__MPSCAN = (globalThis.__MPSCAN || 0) + 1;
                globalThis.__MPCRCSEEN = (globalThis.__MPCRCSEEN || 0) + _found;
              }
            }
          } catch (eM) { (globalThis.__MPERR = globalThis.__MPERR || []).push(String(eM.message).slice(0, 60)); }
          // 找 0x8200(=33408) 从哪条路出去
          try {
            for (var _ai = 0; _ai < a.length; _ai++) {
              var _av = a[_ai];
              var _hit = (typeof _av === 'number' && _av === 33408) ||
                         (typeof _av === 'string' && (_av === '8200' || _av.indexOf('8200') >= 0)) ||
                         (typeof _av === 'bigint' && _av === 33408n);
              if (_hit) {
                var _bd = globalThis.__WHERE || (globalThis.__WHERE = []);
                if (_bd.length < 60) _bd.push(k + ' argIdx=' + _ai + ' type=' + typeof _av + ' brief=' + brief.slice(0, 120));
              }
            }
          } catch (eW) {}
          var r;
          var slot = null;
          try {
            var fsz0 = Number(a[1]);
            if (k.indexOf('copyBytesToGo') >= 0 && fsz0 === 1032) {
            globalThis.__AFTER = { at: globalThis.__HOSTCALLS.length, args: brief.slice(0, 200), next: [] };
            (globalThis.__AFTERS = globalThis.__AFTERS || []).push(globalThis.__AFTER);
          }
          if (globalThis.__AFTER && globalThis.__AFTER.next.length < 6) {
            globalThis.__AFTER.next.push(k.replace('syscall/js.','') + ':' + brief.slice(0, 90));
          }
          if (k.indexOf('copyBytesToGo') >= 0 && (fsz0 === 1024 || fsz0 === 1026 || fsz0 === 1032)) {
              var mo0 = globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem || globalThis.__INST.exports.memory);
              if (mo0) {
                var dv0 = new DataView(mo0.buffer), sp0 = Number(a[0]);
                var before = { bits: BigInt.asUintN(64, dv0.getBigInt64(sp0)).toString(16), flag: dv0.getUint8(sp0 + 8) };
                slot = { sp: sp0, before: before };
                rec.slotBefore = before;
              }
            }
          } catch (e) { rec.slotErr = String(e.message).slice(0, 60); }
          try { r = orig.apply(this, arguments); }
          catch (e) {
            rec.threw = String(e && e.message).slice(0, 160);
            throw e;
          }
          // 紧跟 Go 自己的 eval(136041) 之后立刻包装：Go 在 n=35 就缓存了 window.CVM 的 ref，
          //   晚于这一刻再包就来不及了。
          try {
            if (rec.getKey === 'CALL:eval' && !globalThis.__AFTEVAL) {
              globalThis.__AFTEVAL = 1;
              try { if (globalThis.__NOWRAP) globalThis.__NWRES = globalThis.__NOWRAP(); } catch(eNW) { globalThis.__NWERR = String(eNW.message).slice(0,80); }
              try { if (globalThis.__SNAP) globalThis.__SNAPRES = globalThis.__SNAP('AFTER_EVAL'); } catch(eSN) { globalThis.__SNAPERR = String(eSN.message).slice(0,80); }
              try { if (globalThis.__GETPROBE) globalThis.__GPRES = globalThis.__GETPROBE(); } catch(eGP) { globalThis.__GPERR = String(eGP.message).slice(0,80); }
              try { if (globalThis.__GETCVM) globalThis.__CVMRES = globalThis.__GETCVM(); } catch(eCV) { globalThis.__CVMERR = String(eCV.message).slice(0,80); }
            }
          } catch (eEv) {}
          rec.ret = (typeof r === 'bigint') ? ('i' + r.toString()) : String(r);
          if (slot) {
            try {
              var mo1 = globalThis.__INST.exports.mem || globalThis.__INST.exports.memory;
              var dv1 = new DataView(mo1.buffer);
              rec.slotAfter = { bits: BigInt.asUintN(64, dv1.getBigInt64(slot.sp)).toString(16), flag: dv1.getUint8(slot.sp + 8) };
            } catch (e) { rec.slotErr2 = String(e.message).slice(0, 60); }
          }
          return r;
        };
      });
    } catch (e) { globalThis.__HOSTWRAPERR = String(e.message); }
    var pr = _inst.apply(this, arguments);
    var _fin = function(r){ try { globalThis.__INST = r && (r.instance || r); } catch(e){} try { _wrapExp(r && (r.instance || r)); } catch(e){} return r; };
    try { if (pr && typeof pr.then === 'function') { pr = pr.then(_fin); } else { _fin(pr); } } catch (e) {}
    try { if (pr && pr.then) pr = pr.catch(function(e){ try { globalThis.__WAC.push('ERR ' + String(e && e.message).slice(0,120)); } catch(e2){} throw e; }); } catch(e){}
    return pr;
  };
`, ctx);

// CHREQ：Node 侧轮询包装 __c.H（Go 层通过 __c.H(pc) 驱动 CVM VM）
(function(){
  var n = 0;
  var src = `(function(){
    try {
      var c = window.__c;
      if (!c || typeof c.H !== 'function') return null;
      if (c.H.__chr) return 'already';
      var o = c.H;
      var LOG = globalThis.__CHRLOG = globalThis.__CHRLOG || [];
      var f = function(){
        var r, err = null;
        var a0 = arguments[0];
        try { r = o.apply(this, arguments); } catch(e){ err = String(e.message).slice(0,80); }
        try {
          if (LOG.length < 400) LOG.push('pc=' + a0 + ' argc=' + arguments.length + ' ret=' + (r === undefined ? 'undef' : (typeof r === 'object' ? ('obj') : String(r).slice(0,40))) + (err ? (' THREW:' + err) : ''));
        } catch(e){}
        if (err) throw new Error(err);
        return r;
      };
      f.__chr = 1;
      try { f.toString = function(){ return o.toString(); }; } catch(e){}
      c.H = f;
      return 'wrappedH';
    } catch(e) { return 'ERR:' + String(e.message).slice(0,50); }
  })()`;
  var iv = setInterval(function(){
    try {
      var req = vm.runInContext('globalThis.__CHREQ_REQ||0', ctx);
      if (req) {
        var res = vm.runInContext(src, ctx);
        vm.runInContext('globalThis.__CHRES = ' + JSON.stringify(res) + '; globalThis.__CHREQ_REQ = 0;', ctx);
      }
    } catch(e) {}
    if (++n > 1500) clearInterval(iv);
  }, 20);
})();

// CHOOK2：Node 侧轮询包装 window.CVM（宿主包装里拿不到 vm；且必须在 Go 读 CVM 之前完成）
(function(){
  var n = 0;
  var src = `(function(){
    try {
      var C0 = window.CVM;
      if (typeof C0 !== 'function') return null;
      if (C0.__ch2) return 'already';
      var LOG = globalThis.__CHLOG2 = globalThis.__CHLOG2 || [];
      var wrapFn = function(o, tag){
        var f = function(){
          var a0 = arguments[0];
          var d0 = (a0 && typeof a0 === 'object' && a0.length !== undefined) ? ('arrlen=' + a0.length) : (typeof a0);
          var r, err = null;
          try { r = o.apply(this, arguments); } catch(e){ err = String(e.message).slice(0,80); }
          try { if (LOG.length < 80) LOG.push(tag + ' argc=' + arguments.length + ' arg0=' + d0 + ' ret=' + (r === undefined ? 'undefined' : (typeof r === 'object' ? ('obj:' + (r && r.length)) : String(r).slice(0,400))) + (err ? (' THREW:' + err) : '')); } catch(e){}
          if (err) throw new Error(err);
          return r;
        };
        try { f.toString = function(){ return o.toString(); }; } catch(e){}
        return f;
      };
      var cache = {};
      var P = new Proxy(C0, {
        get: function(t, k, recv){
          var v;
          try { v = t[k]; } catch(e) { return v; }
          if (typeof v === 'function' && (k === 'H' || k === 'h')) {
            if (!cache[k]) { cache[k] = wrapFn(v, 'CVM.' + String(k)); LOG.push('wrapped-static-' + String(k)); }
            return cache[k];
          }
          if (k === 'prototype' && v && typeof v === 'object') {
            try {
              var pH = v.H;
              if (typeof pH === 'function' && !pH.__ch2) {
                var wf = wrapFn(pH, 'proto.H'); wf.__ch2 = 1; v.H = wf; LOG.push('wrapped-proto-H');
              }
            } catch(e){}
          }
          return v;
        },
        construct: function(t, args, nt){
          var inst = Reflect.construct(t, args, nt);
          try {
            if (inst && typeof inst.H === 'function' && !inst.H.__ch2) { var wf2 = wrapFn(inst.H, 'inst.H'); wf2.__ch2 = 1; inst.H = wf2; LOG.push('wrapped-inst-H'); }
          } catch(e){}
          return inst;
        },
      });
      try { Object.defineProperty(P, 'name', { value: C0.name, configurable: true }); } catch(e){}
      // 默认不再包 Proxy：实测「不包」与「包」的位图完全相同（w8=8000 ✓），
      //   而包了之后 String(CVM) 会变成 "[native code]"，与真机（挑战源码）不一致。
      //   H 通道由 PGHOOK 包装处理，Proxy 本就多余。ZSE_NOPROXY=0 可回退。
      if (process.env.ZSE_NOPROXY !== '0') { return 'skip-proxy'; }
      window.CVM = P;
      return 'proxied';
    } catch(e) { return 'ERR:' + String(e.message).slice(0,60); }
  })()`;

  var iv = setInterval(function(){
    try {
      var req = vm.runInContext('globalThis.__CHOOK2_REQ||0', ctx);
      if (req) {
        var res = vm.runInContext(src, ctx);
        vm.runInContext('globalThis.__CHOOK2_RES = ' + JSON.stringify(res) + '; globalThis.__CHOOK2_REQ = 0;', ctx);
      }
    } catch(e) {}
    if (++n > 1500) clearInterval(iv);
  }, 20);
})();

// ZSE_CVMLONG：把 window.CVM.toString() 改成返回 >60 字符的串
//   （CVM 程序里有 `if (CVM.toString().length > 60) return 5` —— 真机 CVM 是 44326 字符的类源码
//     ⇒ 该守卫命中；我的 CVM 是 bound 函数 ⇒ toString 只有 29 字符 ⇒ 不命中。这是一处真实偏差。）
if (Number(process.env.ZSE_CVMLONG || 0)) {
  var _clSrc = `(function(){
    try {
      var C = window.CVM;
      if (typeof C !== 'function') return 'noCVM';
      if (C.__cl) return 'already';
      var fake = 'function CVM(){' + new Array(200).join('var _0x1=1;') + '}';
      try { Object.defineProperty(C, 'toString', { configurable: true, writable: true, value: function(){ return fake; } }); }
      catch(e) { return 'assignfail:' + String(e.message).slice(0,40); }
      C.__cl = 1;
      return 'ok len=' + fake.length;
    } catch(e) { return 'ERR:' + String(e.message).slice(0,50); }
  })()`;
  var _cln = 0;
  var _cliv = setInterval(function(){
    try {
      var r = vm.runInContext(_clSrc, ctx);
      if (r && r.indexOf('ok') === 0) { globalThis.__CLRES = r; clearInterval(_cliv); }
      else if (++_cln > 600) clearInterval(_cliv);
    } catch(e) {}
  }, 20);
}

// CVMLEN：轮询 CVM.toString().length，记录它在运行中的变化（查清 44326 vs 29 的矛盾）
(function(){
  var n = 0, last = null;
  var log = [];
  var iv = setInterval(function(){
    try {
      var r = vm.runInContext(`(function(){
        var out = { t: 0 };
        var o;
        try { o = window.CVM; } catch(e) { return 'CVMget THROW'; }
        out.type = typeof o;
        if (o !== undefined && o !== null) {
          try { out.len = String(o.toString()).length; } catch(e) { out.len = 'THROW'; }
          try { out.head = String(o.toString()).slice(0, 40); } catch(e) {}
          try { out.ctorName = o.constructor && o.constructor.name; } catch(e) {}
          try { out.ownKeys = Object.getOwnPropertyNames(o).slice(0,8).join(','); } catch(e) {}
        }
        try { out.ftLen = String(Function.prototype.toString.call(function(){})).length; } catch(e) {}
        try { out.fpNative = String(Function.prototype.toString).slice(0, 60); } catch(e) {}
        return JSON.stringify(out);
      })()`, ctx);
      var key = String(r);
      if (key !== last) { last = key; log.push('n=' + n + ' ' + key); }
    } catch(e) {}
    if (++n > 1200) { clearInterval(iv); try { require('fs').writeFileSync('.probe/zsec/cvmlen.json', JSON.stringify(log, null, 1)); } catch(e) {} }
  }, 20);
})();

// QHFLIP：Node 侧轮询（沙箱内 setInterval 是 mock，且宿主包装里拿不到 vm）
(function(){
  var n = 0;
  var iv = setInterval(function(){
    try {
      var req = vm.runInContext('globalThis.__QHFLIP_REQ', ctx);
      if (typeof req === 'number' && req >= 0) {
        var res = vm.runInContext('(function(){ var k = ' + req + '; var c = __c; var s = c && c.qh; if (typeof s !== "string") return "noqh:" + (typeof s); if (k >= s.length) return "oob:" + s.length; var a = s.split(""); a[k] = String.fromCharCode(a[k].charCodeAt(0) ^ 1); var t = a.join(""); try { c.qh = t; } catch(e){ return "setfail:" + e.message.slice(0,40); } return s.length + "|" + JSON.stringify(s.slice(0,10)) + "->" + JSON.stringify(t.slice(0,10)); })()', ctx);
        vm.runInContext('globalThis.__QHRES = ' + JSON.stringify(res) + '; globalThis.__QHFLIP_REQ = null;', ctx);
      }
    } catch (e) {}
    if (++n > 1500) clearInterval(iv);
  }, 20);
})();

// 监视 __g.ck 的赋值：谁在什么时候写了什么值（位图/ck 的真正产地）
vm.runInContext(`
  (function(){
    var _g, _ck;
    globalThis.__CKLOG = [];
    Object.defineProperty(window, '__g', {
      configurable: true, enumerable: true,
      get: function(){ return _g; },
      set: function(v){
        _g = v;
        try {
          if (v && typeof v === 'object' && !v.__ckw) {
            Object.defineProperty(v, 'ck', {
              configurable: true, enumerable: true,
              get: function(){ return _ck; },
              set: function(nv){
                _ck = nv;
                try {
                  var st = '';
                  try { st = String(new Error().stack).split(String.fromCharCode(10)).slice(1, 6).join(' <- ').slice(0, 200); } catch(e){}
                  // 同时 dump 所有 VM 实例的寄存器全表
                  var dumps = [];
                  try {
                    var cands = [['__c', window.__c], ['__b', window.__b], ['LASTINST', globalThis.__LASTINST]];
                    try {
                      var _ci2 = globalThis.__CVMINST;
                      if (_ci2) {
                        var _ps = [];
                        var _ks2 = Object.getOwnPropertyNames(_ci2);
                        for (var _k9 = 0; _k9 < _ks2.length; _k9++) {
                          var _nm9 = _ks2[_k9], _vv9;
                          try { _vv9 = _ci2[_nm9]; } catch(e) { _ps.push(_nm9 + '=THROW'); continue; }
                          if (Array.isArray(_vv9)) {
                            var _es9 = [];
                            for (var _q9 = 0; _q9 < _vv9.length && _q9 < 30; _q9++) {
                              var _x9 = _vv9[_q9];
                              if (typeof _x9 === 'number') _es9.push('0x' + (_x9 >>> 0).toString(16));
                              else if (typeof _x9 === 'string') _es9.push(JSON.stringify(_x9.length > 16 ? _x9.slice(0,16) + '…' : _x9));
                              else if (typeof _x9 === 'function') _es9.push('<fn>');
                              else if (_x9 && typeof _x9 === 'object') _es9.push('<' + Object.prototype.toString.call(_x9) + '>');
                              else _es9.push(String(_x9));
                            }
                            _ps.push(_nm9 + '[' + _vv9.length + ']=' + _es9.join(' '));
                          } else if (typeof _vv9 === 'function') _ps.push(_nm9 + '=<fn>');
                          else if (_vv9 && typeof _vv9 === 'object') _ps.push(_nm9 + '=' + Object.prototype.toString.call(_vv9));
                          else _ps.push(_nm9 + '=' + String(_vv9).slice(0, 24));
                        }
                        dumps.push('CVMINST: ' + _ps.join(' | '));
                      } else dumps.push('CVMINST=null');
                    } catch(eCI) { dumps.push('CVMINST err ' + eCI.message); }
                    try {
                      var _R = window.__b && window.__b.R;
                      if (Array.isArray(_R)) {
                        var _rs = [];
                        for (var _ri = 0; _ri < _R.length; _ri++) {
                          var _rv2 = _R[_ri];
                          _rs.push('[' + _ri + '](' + (typeof _rv2) + ')' + (typeof _rv2 === 'number' ? ('0x' + (_rv2 >>> 0).toString(16) + '/' + _rv2) : (typeof _rv2 === 'string' ? JSON.stringify(_rv2) : (typeof _rv2 === 'function' ? '<fn>' : String(_rv2)))));
                        }
                        dumps.push('__b.R 全表(n=' + _R.length + '): ' + _rs.join('  '));
                      }
                      var _a3 = window.__b && window.__b.a3;
                      dumps.push('__b.a3=' + _a3 + ' typeof=' + (typeof _a3) + ' zh.len=' + String(window.__b && window.__b.zh).length);
                    } catch(eR3) { dumps.push('R dump err ' + eR3.message); }
                    for (var _ci = 0; _ci < cands.length; _ci++) {
                      var nm = cands[_ci][0], ob = cands[_ci][1];
                      if (!ob) { dumps.push(nm + '=null'); continue; }
                      var parts = [];
                      try {
                        var ks = Object.getOwnPropertyNames(ob);
                        for (var _ki = 0; _ki < ks.length; _ki++) {
                          var kk = ks[_ki], vv;
                          try { vv = ob[kk]; } catch(e) { parts.push(kk + '=THROW'); continue; }
                          if (Array.isArray(vv)) {
                            var es = [];
                            for (var _ei = 0; _ei < vv.length && _ei < 26; _ei++) {
                              var x = vv[_ei];
                              if (typeof x === 'number') es.push('0x' + (x >>> 0).toString(16));
                              else if (typeof x === 'string') es.push(JSON.stringify(x.length > 14 ? x.slice(0,14) + '…' : x));
                              else if (typeof x === 'function') es.push('<fn>');
                              else if (x && typeof x === 'object') es.push('<' + Object.prototype.toString.call(x) + '>');
                              else es.push(String(x));
                            }
                            parts.push(kk + '[' + vv.length + ']=' + es.join(' '));
                          } else if (typeof vv === 'function') parts.push(kk + '=<fn>');
                          else if (vv && typeof vv === 'object') parts.push(kk + '=' + Object.prototype.toString.call(vv));
                          else parts.push(kk + '=' + String(vv).slice(0, 30));
                        }
                      } catch(e){}
                      dumps.push(nm + ': ' + parts.join(' | '));
                    }
                  } catch(e){}
                  globalThis.__CKLOG.push({ n: globalThis.__CKLOG.length, len: String(nv).length, head: String(nv).slice(0, 24), full: String(nv), st: st, dumps: dumps });
                } catch(e){}
              },
            });
            v.__ckw = 1;
          }
        } catch(e) { globalThis.__CKLOG.push({ err: String(e.message).slice(0, 60) }); }
      },
    });
  })();
`, ctx);

// ZSE_RWATCH：在 __b.R 上装索引写入监视，记录 4-hex 字符串的写入顺序
if (Number(process.env.ZSE_RWATCH || 0)) {
  vm.runInContext(`
    (function(){
      globalThis.__RWLOG = [];
      var _b, _wrapped = {};
      function wrapArr(nm, arr){
        if (!arr || typeof arr !== 'object') return arr;
        if (arr.__rw) return arr;
        try {
          var P = new Proxy(arr, {
            set: function(t, k, v){
              try {
                if (globalThis.__RWLOG.length < 4000) {
                  var sv = (typeof v === 'string') ? JSON.stringify(v.length > 30 ? v.slice(0,30)+'…' : v) : (typeof v === 'number' ? ('0x' + (v>>>0).toString(16)) : (typeof v === 'function' ? '<fn>' : (v && typeof v === 'object' ? '<obj>' : String(v))));
                  var st = '';
                  try { st = String(new Error().stack).split(String.fromCharCode(10)).slice(1,5).join(' <- ').slice(0,200); } catch(e){}
                  globalThis.__RWLOG.push(nm + '[' + String(k) + '] = ' + sv + '   @ ' + st);
                }
              } catch(e){}
              t[k] = v;
              return true;
            },
          });
          try { Object.defineProperty(P, '__rw', { value: 1, configurable: true }); } catch(e){}
          return P;
        } catch(e) { return arr; }
      }
      function install(b){
        if (!b || b.__rwi) return;
        b.__rwi = 1;
        var _R = b.R;
        try {
          Object.defineProperty(b, 'R', {
            configurable: true, enumerable: true,
            get: function(){ return _R; },
            set: function(nv){ _R = wrapArr('R', nv); },
          });
          if (_R) _R = wrapArr('R', _R);
        } catch(e) { globalThis.__RWERR = String(e.message).slice(0,60); }
      }
      Object.defineProperty(window, '__b', {
        configurable: true, enumerable: true,
        get: function(){ return _b; },
        set: function(v){ _b = v; try { install(v); } catch(e){} },
      });
    })();
  `, ctx);
}

// ZSE_ZWATCH：包装 __c.z（CVM 调度器），记录每次调用的 pc / 栈 / 寄存器，
//   并在出现 132 字符串（ck）时留下完整快照 —— 用来定位 ck 是哪个 pc 拼出来的。
if (Number(process.env.ZSE_ZWATCH || 0)) {
  vm.runInContext(`
    (function(){
      globalThis.__ZWLOG = [];
      var _c;
      function fmt(x){
        if (typeof x === 'number') return '0x' + (x >>> 0).toString(16);
        if (typeof x === 'string') return JSON.stringify(x.length > 60 ? (x.slice(0,60) + '…') : x);
        if (typeof x === 'function') return '<fn>';
        if (x && typeof x === 'object') return '<' + Object.prototype.toString.call(x) + '>';
        return String(x);
      }
      function snap(c, tag){
        var o = { tag: tag, pc: c.i, A: null, S: null, G: null, R: null };
        try { if (Array.isArray(c.A)) o.A = c.A.slice(0, 8).map(fmt); else if (c.A && typeof c.A === 'object') o.A = '<obj>'; } catch(e){}
        try { if (Array.isArray(c.S)) o.S = c.S.slice(0, 12).map(fmt); } catch(e){}
        try { if (Array.isArray(c.G)) o.G = c.G.slice(0, 26).map(fmt); } catch(e){}
        try { if (Array.isArray(c.R)) o.R = c.R.slice(0, 34).map(fmt); } catch(e){}
        return o;
      }
      function install(c){
        if (!c || c.__zw) return;
        c.__zw = 1;
        var z = c.z;
        if (typeof z !== 'function') return;
        var W = function(){
          var r = z.apply(this, arguments);
          try {
            var S = this && this.S;
            var hit = false;
            if (Array.isArray(S)) {
              for (var i = 0; i < S.length; i++) {
                var v = S[i];
                if (typeof v === 'string' && v.length === 132 && v.slice(0,4) === '005_') { hit = true; break; }
              }
            }
            if (hit && globalThis.__ZWLOG.length < 40) globalThis.__ZWLOG.push(snap(this, 'CK-on-stack'));
            else if (globalThis.__ZWRING) globalThis.__ZWRING.push(snap(this, 'pc'));
          } catch(e){}
          return r;
        };
        W.__zw = 1;
        try { W.toString = function(){ return z.toString(); }; } catch(e){}
        c.z = W;
      }
      Object.defineProperty(window, '__c', {
        configurable: true, enumerable: true,
        get: function(){ return _c; },
        set: function(v){ _c = v; try { install(v); } catch(e){} },
      });
    })();
  `, ctx);
}

// 把挑战页里的 <meta id="zh-zse-ck"> 放进 DOM（build 的 sc() 要读它）
vm.runInContext(`
  (function(){
    var me = document.getElementById('zh-zse-ck');
    if (!me) { me = { id: 'zh-zse-ck', getAttribute: function(){ return ${JSON.stringify(META)}; },
                      setAttribute: function(){}, nodeName: 'META' }; document.head.appendChild(me); }
    window.__META_INJECTED = ${JSON.stringify(META)};
  })();
`, ctx);

let errs = [];
sandbox.__onerr = (e) => errs.push(String(e && e.stack || e).slice(0, 300));
vm.runInContext(`
  window.onerror = function(m, s, l, c, e){ __onerr(e || m); };
  window.addEventListener('error', function(ev){ __onerr(ev.error || ev.message); });
`, ctx);

// 抓 build 运行期间所有 eval（服务层就是被 eval 出来的）
vm.runInContext(`
  globalThis.__EV = []; globalThis.__EVR = [];
  var _oe = window.eval;
  function __evw(x){
    var src = String(x);
    if (globalThis.__EV.length < 300) globalThis.__EV.push({ len: src.length, head: src.slice(0, 200) });
    if (src.length > 5000 && src.length < 60000) { globalThis.__EVSRC = globalThis.__EVSRC || {}; globalThis.__EVSRC[src.length] = src; }
    if (src.length > 100000) { globalThis.__EVBIG = src; }
    else if (src.length > 60000) { globalThis.__EVMID = src; }
    try {
      var _rv0 = _oe.call(this, src);
      try {
        if (globalThis.__EVR.length < 500) globalThis.__EVR.push({ len: src.length, head: src.slice(0, 110),
          ret: (typeof _rv0 === 'string' ? _rv0.slice(0, 220) : (typeof _rv0 === 'number' ? ('#num ' + _rv0) : (typeof _rv0))) });
      } catch(e3){}
      return _rv0;
    } catch (e) {
      try {
        (globalThis.__EVERR = globalThis.__EVERR || []).push({
          len: src.length,
          msg: String(e && e.message).slice(0, 200),
          stack: String(e && e.stack).slice(0, 1200)
        });
      } catch (e2) {}
      throw e;
    }
  }
  if (!${Number(process.env.NOEVAL || 0)}) { window.eval = __evw; try { globalThis.eval = __evw; } catch (e) {} }
  try { globalThis.__EVSAME = (window === globalThis); } catch (e) {}
`, ctx);
sandbox.__saveEval = null;

function __crashDump(tag, e) {
  console.log('=== CRASH DUMP [' + tag + '] ' + String(e && (e.stack || e.message)).slice(0, 400));
  const dump = (expr, cap) => { try { console.log(expr + ':', JSON.stringify(vm.runInContext(expr, ctx)).slice(0, cap || 2500)); } catch (e2) { console.log(expr + ' 读失败: ' + String(e2.message).slice(0, 100)); } };
  dump('globalThis.__EV||[]', 4000);
  dump('globalThis.__RSET||[]', 6000);
  dump('JSON.stringify({poll:globalThis.__RPOLL||0, saw:globalThis.__RSAW||0, hook:globalThis.__RHOOK||0})', 300);
  dump('globalThis.__RHERR||"none"', 300);
  dump('globalThis.__FD||[]', 4000);
  dump('globalThis.__EVERR||[]', 4000);
  try {
    const big = vm.runInContext('globalThis.__EVBIG || ""', ctx);
    if (big) { require('fs').writeFileSync('.probe/zsec/eval_arg_big.js', big, 'utf8'); console.log('已存 eval_arg_big.js len=' + big.length); }
    const mid = vm.runInContext('globalThis.__EVMID || ""', ctx);
    if (mid) { require('fs').writeFileSync('.probe/zsec/eval_arg_mid.js', mid, 'utf8'); console.log('已存 eval_arg_mid.js len=' + mid.length); }
  } catch (e3) { console.log('存 eval_arg_big 失败: ' + String(e3.message).slice(0, 100)); }
  try {
    const z = vm.runInContext('(window.__b && typeof window.__b.zh === "string") ? window.__b.zh : ""', ctx);
    const q = vm.runInContext('(window.__c && typeof window.__c.qh === "string") ? window.__c.qh : ""', ctx);
    require('fs').writeFileSync('.probe/zsec/zh_mine_full.txt', z, 'utf8');
    require('fs').writeFileSync('.probe/zsec/qh_mine_full.txt', q, 'utf8');
    const segs = z.split(String.fromCharCode(0x200c));
    console.log('zh 长度=' + z.length + ' 段数=' + segs.length + ' 各段=' + JSON.stringify(segs.map(function(s){ return s.length; })));
    console.log('qh 长度=' + q.length + ' 段数=' + (q.split(String.fromCharCode(0x200e)).length));
  } catch (e4) { console.log('存 zh 失败: ' + String(e4.message).slice(0, 120)); }
  try {
    const R = vm.runInContext(`(function(){var b=window.__b; if(!b)return 'no __b'; if(!Array.isArray(b.R))return 'R is '+(typeof b.R);
      return JSON.stringify(b.R.map(function(x){return typeof x==='string'?('s'+x.length+':'+x.slice(0,24)):(typeof x==='number'?x:typeof x);}));})()`, ctx);
    console.log('__b.R:', String(R).slice(0, 1600));
  } catch (e5) { console.log('dump R 失败: ' + String(e5.message).slice(0, 100)); }
  try {
    const G = vm.runInContext(`(function(){var c=window.__c; if(!c)return 'no __c'; if(!Array.isArray(c.G))return 'G is '+(typeof c.G);
      return JSON.stringify(c.G.map(function(x){return typeof x==='string'?('s'+x.length+':'+x.slice(0,24)):(typeof x==='number'?x:typeof x);}));})()`, ctx);
    console.log('__c.G:', String(G).slice(0, 2600));
  } catch (e6) { console.log('dump G 失败: ' + String(e6.message).slice(0, 100)); }
  dump('globalThis.__EVLOG||[]', 2500);
  dump('globalThis.__CBLOG||[]', 2500);
  dump('globalThis.__GETS||[]', 2000);
  dump('globalThis.__ENTRYD||[]', 900);
  dump('globalThis.__RETS||[]', 1200);
  dump('globalThis.__VT||[]', 1200);
  dump('(function(){var G=globalThis.__PGI;if(!G)return "noPGI";var o=[];for(var k in G.inst){var r=G.inst[k];var ps=Object.keys(r.pcs).map(Number);o.push(k+":ylen="+r.ylen+" cnt="+r.cnt+" npc="+ps.length+" min="+Math.min.apply(null,ps)+" max="+Math.max.apply(null,ps)+" ops="+Object.keys(r.ops).join("/"));}return o.join(" || ");})()', 4000);
  dump('JSON.stringify({EVSAME:globalThis.__EVSAME, has4811: typeof globalThis._0x4811, has17a3: typeof globalThis._0x17a3, hasEval: typeof globalThis.eval, __b: typeof globalThis.__b, __c: typeof globalThis.__c})', 600);
}
process.on('uncaughtException', (e) => { errs.push('UNCAUGHT:' + String(e && (e.stack || e.message)).slice(0, 700)); __crashDump('uncaught', e); });
process.on('unhandledRejection', (e) => { errs.push('REJECT:' + String(e && (e.stack || e.message)).slice(0, 700)); __crashDump('reject', e); });

const t0 = Date.now();
try {
  let src = fs.readFileSync(BUILD, 'utf8');
  const m = src.match(/while\(!!\[\]\)\{this\['(\w+)'\]=this\['(\w+)'\]\[(\w+)\+\+\]\|\|[^;]*;/);
  if (m) {
    const op = m[1], prog = m[2], pcv = m[3];
    // 先在函数入口（while 之外）加 __ENTRY 标记
    const fnRe = /(=\s*function\s*\([^)]*\)\s*\{)/g;
    let lastFn = null, mm2;
    while ((mm2 = fnRe.exec(src.slice(0, m.index))) !== null) lastFn = mm2;
    if (lastFn) {
      const at = lastFn.index + lastFn[1].length;
      src = src.slice(0, at) + ("globalThis.__ENTRY=(globalThis.__ENTRY||0)+1;"
        + "if((globalThis.__ENTRYD=globalThis.__ENTRYD||[]).length<6){try{"
        + "globalThis.__ENTRYD.push('pc='+arguments[0]+' Tlen='+(this['T']?this['T'].length:'null')"
        + "+' T[pc]='+(this['T']?String(this['T'][arguments[0]]):'null')"
        + "+' Z='+this['Z']);}catch(e){globalThis.__ENTRYD.push('ERR '+e.message);}}") + src.slice(at);
      console.log('  已在解释器函数入口注入 __ENTRY');
    } else console.log('  !! 未找到函数入口');
    const inject = `if(this.__vid===undefined)this.__vid=(globalThis.__VMID=(globalThis.__VMID||0)+1);`
                 + `var __roll=(globalThis.__ROLL=globalThis.__ROLL||[]);__roll.push(this.__vid+':'+(${pcv}-1));if(__roll.length>4000)__roll.shift();`
                 + `if(this['${op}']<0){if((globalThis.__RETS=globalThis.__RETS||[]).length<60)globalThis.__RETS.push(this.__vid+':ret@pc'+(${pcv}-1)+':prog'+this['${prog}'].length+':before='+JSON.stringify(__roll.slice(-4000)));return;}`
                 + `if(this['${prog}'].length===2312&&(globalThis.__VT=globalThis.__VT||[]).length<200000)globalThis.__VT.push(this.__vid+':'+this['${op}']+':'+(${pcv}-1)+':G'+(Array.isArray(this['G'])?this['G'].length:-1));`;
                 + `var __p=(${pcv}-1);`
                 + `if(__p>=143&&__p<=147&&(globalThis.__LOOPS=globalThis.__LOOPS||[]).length<24){try{`
                 + `var __st={pc:__p,op:this['${op}'],A:(this['A']||[]).map(function(x){return typeof x==='string'?('s:'+x.slice(0,24)):(typeof x==='number'?x:typeof x);}),`
                 + `G:(Array.isArray(this['G'])?this['G'].slice(-6):('['+typeof this['G']+']')).map?null:(Array.isArray(this['G'])?this['G'].slice(-6).map(function(x){return typeof x==='string'?('s:'+x.slice(0,20)):typeof x;}):('['+typeof this['G']+']')),`
                 + `B:(function(__b){if(!__b)return null;var o=[];for(var q=0;q<Math.min(__b.length,80);q++){var x=__b[q];`
                 + `o.push(typeof x==='string'?('s'+x.length+':'+x.slice(0,26)):(typeof x==='number'?x:typeof x));}return o;})(this['B']),`
                 + `Btail:(function(__b){if(!__b)return null;var o=[];for(var q=Math.max(0,__b.length-20);q<__b.length;q++){var x=__b[q];`
                 + `o.push(typeof x==='string'?('s'+x.length+':'+x.slice(0,26)):(typeof x==='number'?x:typeof x));}return o;})(this['B']),`
                 + `arrays:(function(__vm){var o={};Object.getOwnPropertyNames(__vm).forEach(function(kk){var vv;try{vv=__vm[kk];}catch(e){return;}`
                 + `if(Array.isArray(vv)){o[kk]='arr'+vv.length+':['+vv.slice(0,60).map(function(x){`
                 + `return typeof x==='string'?('s'+x.length+':'+x.slice(0,16)):(typeof x==='number'?String(x):typeof x);}).join(',')+']';}});return o;})(this),`
                 + `fields:(function(__vm){var f={};Object.getOwnPropertyNames(__vm).forEach(function(kk){var vv;try{vv=__vm[kk];}catch(e){f[kk]='THROW';return;}`
                 + `if(typeof vv==='string')f[kk]='s'+vv.length+':'+vv.slice(0,40);`
                 + `else if(Array.isArray(vv))f[kk]='arr'+vv.length;`
                 + `else if(typeof vv==='function')f[kk]='fn';`
                 + `else if(vv===null)f[kk]='null';`
                 + `else if(typeof vv==='object')f[kk]='obj';`
                 + `else f[kk]=vv;});return f;})(this)};`
                 + `globalThis.__LOOPS.push(__st);}catch(e){globalThis.__LOOPS.push('ERR '+e.message);}}`
                 + `globalThis.__MARK=(globalThis.__MARK||0)+1;`
                 + `if(globalThis.__VT&&globalThis.__VT.length<400000)globalThis.__VT.push(this.__vid+':'+this['${op}']+':'+__p+':G'+(Array.isArray(this['G'])?this['G'].length:-1)+':prog'+this['${prog}'].length);`
                 + `if((globalThis.__VT2=globalThis.__VT2||[]).length<400)globalThis.__VT2.push(this.__vid+':'+__p);`;
    src = src.replace(m[0], m[0] + inject);
    console.log('解释器轨迹已注入: opcode=this[' + op + '] prog=this[' + prog + '] pc=' + pcv);
  } else console.log('!! 未找到解释器主循环');
  {
    var _mc = "this['A'][this['o']][_0x5346a3](..._0x13289c)";
    var _n1 = src.split(_mc).length - 1;
    if (_n1 > 0) src = src.split(_mc).join("globalThis.__mc(this['A'][this['o']],_0x5346a3,_0x13289c)");
    var _dc = "this['A'][this['o']](..._0x13289c)";
    var _n2 = src.split(_dc).length - 1;
    if (_n2 > 0) src = src.split(_dc).join("globalThis.__dc(this['A'][this['o']],_0x13289c)");
    console.log('调用 opcode 替换计数: method=' + _n1 + ' direct=' + _n2);
  }
  console.log('补丁自检: __VT@' + src.indexOf('__VT') + ' __ENTRY@' + src.indexOf('__ENTRY') + ' __roll@' + src.indexOf('__roll') + ' len=' + src.length);
  try { console.log('__MC 记录:', JSON.stringify(vm.runInContext('globalThis.__MC||[]', ctx)).slice(0, 1800)); } catch (e) { console.log('读 __MC 失败:', String(e.message).slice(0,80)); }
  try { console.log('__AP 记录:', JSON.stringify(vm.runInContext('globalThis.__AP||[]', ctx)).slice(0, 2000)); } catch (e) { console.log('读 __AP 失败:', String(e.message).slice(0,80)); }
  /* 同步安装包装：Go 在 eval(136041) 之后几微秒内就缓存 window.CVM 的 ref，
     轮询来不及 —— 把 Node 侧闭包挂到沙箱上，让宿主包装同步调用。 */
  // 捕获 CVM 编排器实例（栈里的 `CVM/this.z`）—— 位图的 12 个字应该在它的寄存器文件里
  sandbox.__GETCVM = function(){
    try {
      return vm.runInContext(`(function(){
        try {
          var C = window.CVM;
          if (typeof C !== 'function') return 'noCVM';
          var P = C.prototype;
          if (!P || typeof P.z !== 'function') return 'noZ';
          if (P.z.__czw) return 'already';
          var o = P.z;
          var W = function(){
            try { globalThis.__CVMINST = this; } catch(e){}
            return o.apply(this, arguments);
          };
          W.__czw = 1;
          try { W.toString = function(){ return o.toString(); }; } catch(e){}
          P.z = W;
          return 'wrappedZ';
        } catch(e) { return 'ERR:' + String(e.message).slice(0,50); }
      })()`, ctx);
    } catch (e) { return 'ERR2:' + String(e.message).slice(0,60); }
  };

  var _GPOKE_C = (function(){ var e = process.env.ZSE_GPOKE_C || ''; if (e.indexOf(':') < 0) return null; return e.split(':').map(Number); })();
  // 在 CALL:eval 返回的瞬间快照所有 VM 寄存器文件（与位图 12 字逐字对照）
  sandbox.__SNAP = function(tag){
    try {
      return vm.runInContext(`(function(tag){
        function fmt(x){
          if (typeof x === 'number') return '0x' + (x >>> 0).toString(16);
          if (typeof x === 'string') return JSON.stringify(x.length > 20 ? (x.slice(0,20) + '…') : x);
          if (typeof x === 'function') return '<fn>';
          if (x && typeof x === 'object') return '<obj>';
          return String(x);
        }
        var out = [];
        var seen = [];
        function walk(o, path, depth){
          if (!o || depth > 2) return;
          if (seen.indexOf(o) >= 0) return;
          seen.push(o);
          var G = null;
          try { G = o.G; } catch(e){}
          if (G && typeof G === 'object' && G.length !== undefined) {
            var parts = [];
            for (var i = 0; i < G.length; i++) parts.push('[' + i + ']' + fmt(G[i]));
            out.push(tag + ' ' + path + '.G(n=' + G.length + ') ' + parts.join(' '));
          }
          try {
            var ks = Object.keys(o);
            for (var j = 0; j < ks.length && j < 40; j++) {
              var v; try { v = o[ks[j]]; } catch(e) { continue; }
              if (v && typeof v === 'object' && v !== o) walk(v, path + '.' + ks[j], depth + 1);
            }
          } catch(e){}
        }
        try { walk(window, 'window', 0); } catch(e){}
        try { if (globalThis.__LASTINST) walk(globalThis.__LASTINST, 'LASTINST', 0); } catch(e){}
        return out.join('\n');
      })(${JSON.stringify(tag)})`, ctx);
    } catch (e) { return 'ERR:' + String(e.message).slice(0,80); }
  };

  // 包装 VM 自己的属性取值器 __c.G[0]（= function anonymous(a,b){return b in a ? a[b]: undefined}）
  //   用来确定「返回 undefined 的那些查找」查的是哪个对象。
  sandbox.__GETPROBE = function(){
    try {
      return vm.runInContext(`(function(){
        var c = window.__c;
        if (!c || !c.G) return 'noG';
        var f = c.G[0];
        if (typeof f !== 'function') return 'notfn:' + typeof f;
        if (f.__gp) return 'already';
        var LOG = globalThis.__GPLOG = globalThis.__GPLOG || [];
        var W = function(a, b){
          var r;
          try { r = f.apply(this, arguments); } catch(e){ r = 'THREW'; }
          try {
            if (LOG.length < 3000) {
              var desc;
              if (a === null || a === undefined) desc = String(a);
              else if (a === window) desc = 'window';
              else if (a === document) desc = 'document';
              else if (a === location) desc = 'location';
              else if (a === history) desc = 'history';
              else if (a === navigator) desc = 'navigator';
              else if (a === screen) desc = 'screen';
              else if (a === globalThis.__LASTINST) desc = 'LASTINST';
              else desc = (Object.prototype.toString.call(a)) + '|ctor=' + (a.constructor && a.constructor.name) + '|keys=' + Object.keys(a).slice(0,6).join(',');
              LOG.push(String(b) + ' <- ' + desc + ' => ' + (r === undefined ? 'undefined' : String(r).slice(0,40)));
            }
          } catch(e){}
          return r;
        };
        W.__gp = 1;
        try { W.toString = function(){ return f.toString(); }; } catch(e){}
        c.G[0] = W;
        return 'wrappedG0';
      })()`, ctx);
    } catch (e) { return 'ERR:' + String(e.message).slice(0,80); }
  };

  sandbox.__NODEDEL = function(){
    try {
      return vm.runInContext('(function(){ var d = document; var had = ("all" in d); try { delete d.all; } catch(e){ return "delfail:" + e.message.slice(0,30); } return "had=" + had + " now=" + (typeof d.all); })()', ctx);
    } catch (e) { return 'ERR:' + String(e.message).slice(0,60); }
  };

  sandbox.__NODEPOKE = function(){
    try {
      var gp = _GPOKE_C;
      if (!gp) return 'nogp';
      var r = vm.runInContext('(function(){ var gp = ' + JSON.stringify(gp) + '; var c = window.__c; if (!c || !c.G) return "noG"; var cur = c.G[gp[0]]; var before = (typeof cur === "number") ? ("0x" + cur.toString(16)) : String(cur).slice(0,24); if (typeof cur === "number") c.G[gp[0]] = (cur ^ (1 << gp[1])) >>> 0; else if (typeof cur === "string" && cur.length) c.G[gp[0]] = String.fromCharCode(cur.charCodeAt(0) ^ 1) + cur.slice(1); var nv = c.G[gp[0]]; var after = (typeof nv === "number") ? ("0x" + nv.toString(16)) : String(nv).slice(0,24); return "G[" + gp[0] + "] " + before + " -> " + after; })()', ctx);
      return r;
    } catch (e) { return 'ERR:' + String(e.message).slice(0,60); }
  };

  sandbox.__NOWRAP = function(){
    var srcs = [];
    srcs.push(`(function(){
      try {
        var C0 = window.CVM;
        if (typeof C0 !== 'function') return 'noCVM';
        if (C0.__ch2) return 'already';
        try { globalThis.__CVMPRE = (globalThis.__CVMPRE||[]); if (globalThis.__CVMPRE.length<3) globalThis.__CVMPRE.push('name=' + C0.name + ' nativeName=' + (C0.hasOwnProperty('__zseNativeName')?JSON.stringify(C0.__zseNativeName):'(none)') + ' FPTsrc=' + JSON.stringify(Function.prototype.toString.call(C0).slice(0,80))); } catch(e){}
        var LOG = globalThis.__CHLOG2 = globalThis.__CHLOG2 || [];
        var wrapFn = function(o, tag){
          var f = function(){
            var a0 = arguments[0];
            var d0 = (a0 && typeof a0 === 'object' && a0.length !== undefined) ? ('arrlen=' + a0.length) : (typeof a0);
            var r, err = null;
            try { r = o.apply(this, arguments); } catch(e){ err = String(e.message).slice(0,80); }
            try {
              if (LOG.length < 4000) LOG.push(tag + ' argc=' + arguments.length + ' arg0=' + d0 + ' ret=' + (r === undefined ? 'undef' : (typeof r === 'object' ? 'obj' : String(r).slice(0,80))) + (err ? (' THREW:' + err) : ''));
              if (typeof r === 'string' && r.length > 2000) {
                globalThis.__BIGFN = globalThis.__BIGFN || [];
                if (globalThis.__BIGFN.length < 8) globalThis.__BIGFN.push(r);
              }
            } catch(e){}
            if (err) throw new Error(err);
            return r;
          };
          try { f.toString = function(){ return o.toString(); }; } catch(e){}
          return f;
        };
        var cache = {};
        var P = new Proxy(C0, {
          get: function(t, k){
            var v; try { v = t[k]; } catch(e) { return v; }
            if (typeof v === 'function' && (k === 'H' || k === 'h')) {
              if (!cache[k]) { cache[k] = wrapFn(v, 'CVM.' + String(k)); LOG.push('wrap-static-H'); }
              return cache[k];
            }
            if (k === 'prototype' && v && typeof v === 'object') {
              try { var pH = v.H; if (typeof pH === 'function' && !pH.__ch2) { var wf = wrapFn(pH, 'proto.H'); wf.__ch2 = 1; v.H = wf; LOG.push('wrap-proto-H'); } } catch(e){}
            }
            return v;
          },
          construct: function(t, args, nt){
            var inst = Reflect.construct(t, args, nt);
            try { globalThis.__LASTINST = inst; } catch(e){}

            // 在 LASTINST 上装 R 索引写入监视（与 __b.R 同样的手法）
            try {
              if (inst && !inst.__rwi) {
                inst.__rwi = 1;
                var _LR = inst.R;
                globalThis.__LRLOG = globalThis.__LRLOG || [];
                var _wrapR = function(nm, arr){
                  if (!arr || typeof arr !== 'object') return arr;
                  if (arr.__rw) return arr;
                  try {
                    var P = new Proxy(arr, {
                      set: function(t, k, v){
                        try {
                          if (globalThis.__LRLOG.length < 4000) {
                            var sv = (typeof v === 'string') ? JSON.stringify(v.length > 30 ? v.slice(0,30)+'…' : v) : (typeof v === 'number' ? ('0x' + (v>>>0).toString(16)) : (typeof v === 'function' ? '<fn>' : (v && typeof v === 'object' ? '<obj>' : String(v))));
                            globalThis.__LRLOG.push(nm + '[' + String(k) + '] = ' + sv);
                          }
                        } catch(e){}
                        t[k] = v; return true;
                      },
                    });
                    try { Object.defineProperty(P, '__rw', { value: 1, configurable: true }); } catch(e){}
                    return P;
                  } catch(e) { return arr; }
                };
                try {
                  Object.defineProperty(inst, 'R', {
                    configurable: true, enumerable: true,
                    get: function(){ return _LR; },
                    set: function(nv){ _LR = _wrapR('LASTINST.R', nv); },
                  });
                  if (_LR) _LR = _wrapR('LASTINST.R', _LR);
                  LOG.push('wrap-inst-R');
                } catch(e) { LOG.push('RwrapErr:' + String(e.message).slice(0,30)); }
              }
            } catch(eR4) { LOG.push('RwrapOuter:' + String(eR4.message).slice(0,30)); }
            try { if (inst && typeof inst.H === 'function' && !inst.H.__ch2) { var wf2 = wrapFn(inst.H, 'inst.H'); wf2.__ch2 = 1; inst.H = wf2; LOG.push('wrap-inst-H'); } } catch(e){}
            // 同时钩实例的 z（栈里写 __g.ck 的就是 CVM/this.z）—— 用来看它写 ck 那一步的寄存器
            try {
              if (inst && typeof inst.z === 'function' && !inst.z.__ch2z) {
                var _oz = inst.z;
                var _wz = function(){
                  var r;
                  try { r = _oz.apply(this, arguments); } catch(e){ LOG.push('z THREW:' + String(e.message).slice(0,60)); throw e; }
                  try {
                    if (!globalThis.__ZLOG) globalThis.__ZLOG = [];
                    if (globalThis.__ZLOG.length < 200) {
                      var pc = (this && typeof this.i === 'number') ? this.i : '?';
                      var ck = (window.__g && typeof window.__g.ck === 'string') ? window.__g.ck : null;
                      globalThis.__ZLOG.push('pc=' + pc + ' ck=' + (ck ? (ck.length + ':' + ck.slice(0,14)) : 'none'));
                    }
                  } catch(e){}
                  return r;
                };
                _wz.__ch2z = 1;
                try { _wz.toString = function(){ return _oz.toString(); }; } catch(e){}
                inst.z = _wz;
                LOG.push('wrap-inst-z');
              }
            } catch(eZ) { LOG.push('zwrapErr:' + String(eZ.message).slice(0,30)); }
            return inst;
          },
        });
        if (process.env.ZSE_NOPROXY !== '0') { return 'skip-proxy2'; }
        window.CVM = P;
        return 'proxied';
      } catch(e) { return 'ERR:' + String(e.message).slice(0,50); }
    })()`);
    srcs.push(`(function(){
      try {
        var c = window.__c;
        if (!c || typeof c.H !== 'function') return 'no__c';
        if (c.H.__chr) return 'already';
        var o = c.H;
        var LOG = globalThis.__CHRLOG = globalThis.__CHRLOG || [];
        var f = function(){
          var a0 = arguments[0];
          var r, err = null;
          try { r = o.apply(this, arguments); } catch(e){ err = String(e.message).slice(0,80); }
          try { if (LOG.length < 600) LOG.push('pc=' + a0 + ' argc=' + arguments.length + ' ret=' + (r === undefined ? 'undef' : (typeof r === 'object' ? 'obj' : String(r).slice(0,40))) + (err ? (' THREW:' + err) : '')); } catch(e){}
          // ZSE_GPOKE="regIdx:bit"：每一步都翻转寄存器 G[regIdx] 的第 bit 位，看位图哪个字动
          try {
            var gp = globalThis.__GPOKE;
            if (gp && this && this.G) {
              var cur = this.G[gp[0]];
              if (typeof cur === 'number') this.G[gp[0]] = (cur ^ (1 << gp[1])) >>> 0;
              else if (typeof cur === 'string' && cur.length) {
                var cc = cur.charCodeAt(0);
                this.G[gp[0]] = String.fromCharCode(cc ^ 1) + cur.slice(1);
              }
              globalThis.__GPOKEN = (globalThis.__GPOKEN || 0) + 1;
            }
          } catch(eG) { globalThis.__GPOKEERR = String(eG.message).slice(0,60); }
          if (err) throw new Error(err);
          return r;
        };
        f.__chr = 1;
        try { f.toString = function(){ return o.toString(); }; } catch(e){}
        c.H = f;
        return 'wrappedH';
      } catch(e) { return 'ERR:' + String(e.message).slice(0,50); }
    })()`);
    vm.runInContext('globalThis.__GPOKE = ' + JSON.stringify(process.env.ZSE_GPOKE ? process.env.ZSE_GPOKE.split(':').map(Number) : null) + ';', ctx);
    var out = [];
    for (var i = 0; i < srcs.length; i++) { try { out.push(vm.runInContext(srcs[i], ctx)); } catch(e) { out.push('THROW:' + String(e.message).slice(0,60)); } }
    return out.join('|');
  };

  vm.runInContext(src, ctx, { filename: process.env.BUILD_URL || 'build.js', timeout: 60000 });
  console.log('build 加载完成 %dms', Date.now() - t0);
  /* ZSE_CHOOK: 记录/扰动 CVM.H（Go 侧把 41892 字节内层 blob 交给它调用） */
  if (process.env.ZSE_CHOOK) {
    var _chSrc = `(function(){
      try {
        var C0 = window.CVM;
        if (typeof C0 !== 'function') return 'noCVM:' + (typeof C0);
        if (C0.__chw) return 'already';
        globalThis.__CHLOG = globalThis.__CHLOG || [];
        var W = function(){
          var inst;
          try { inst = Reflect.construct(C0, arguments, W); } catch(e){ inst = C0.apply(this, arguments); }
          try {
            if (inst && typeof inst.H === 'function' && !inst.H.__chw) {
              var o = inst.H;
              var f = function(){
                var a0 = arguments[0];
                var d0 = (a0 && typeof a0 === 'object' && a0.length !== undefined) ? ('arrlen=' + a0.length) : (typeof a0);
                var r, err = null;
                try { r = o.apply(this, arguments); } catch(e) { err = String(e.message).slice(0,80); }
                try {
                  var L = globalThis.__CHLOG;
                  if (L.length < 60) L.push('H argc=' + arguments.length + ' arg0=' + d0 + ' ret=' + (r === undefined ? 'undefined' : (typeof r === 'object' ? ('obj:' + (r && r.length)) : String(r).slice(0,60))) + (err ? (' THREW:' + err) : ''));
                  var L2 = globalThis.__CHLOG2 || (globalThis.__CHLOG2 = []);
                  if (L2.length < 4000) L2.push({ pc: (typeof a0 === 'number' ? a0 : null), argc: arguments.length,
                    ret: (typeof r === 'string' ? r : (typeof r === 'number' ? ('#num ' + r) : (r === undefined ? '#undef' : (r === null ? '#null' : ('#' + typeof r))))) });
                } catch(e){}
                if (err) throw new Error(err);
                return r;
              };
              f.__chw = 1;
              try { f.toString = function(){ return o.toString(); }; } catch(e){}
              inst.H = f;
            }
          } catch(eI) { (globalThis.__CHLOG = globalThis.__CHLOG || []).push('wrapinstErr:' + String(eI.message).slice(0,40)); }
          return inst;
        };
        W.prototype = C0.prototype;
        try { Object.defineProperty(W, 'name', { value: C0.name, configurable: true }); } catch(e){}
        try { Object.defineProperty(W, 'toString', { value: function(){ return C0.toString(); }, configurable: true }); } catch(e){}
        if (process.env.ZSE_NOPROXY !== '0') { globalThis.__CHW = 1; return 'skip-wrap2'; }
        window.CVM = W;
        globalThis.__CHW = 1;
        return 'wrapped';
      } catch(e) { return 'ERR:' + String(e.message).slice(0,50); }
    })()`;
    try {
      console.log('ZSE_CHOOK:', vm.runInContext(_chSrc, ctx));
    } catch (e) { console.log('ZSE_CHOOK 失败', String(e.message).slice(0,100)); }
    var _chn = 0;
    var _chiv = setInterval(function(){ try { vm.runInContext(_chSrc, ctx); } catch(e){} if (++_chn > 1500) clearInterval(_chiv); }, 20);
  }
  /* ZSE_VMSTR: 扰动 window.CVM/BVM/VM/Go 的 toString()（Go 侧会读这四个的源码文本） */
  if (process.env.ZSE_VMSTR) {
    try {
      var _vs = vm.runInContext(`(function(){
        var want = ${JSON.stringify(process.env.ZSE_VMSTR)};
        var names = want.split(',');
        globalThis.__VSLOG = [];
        function wrapOne(nm){
          var o = window[nm];
          if (o === null || o === undefined) return false;
          if (typeof o !== 'function' && typeof o !== 'object') return false;
          if (o.__vsw) return true;
          try {
            var orig = o.toString;
            Object.defineProperty(o, 'toString', { configurable: true, writable: true,
              value: function(){ return orig.call(o) + '\u0020'; } });
            o.__vsw = 1;
            globalThis.__VSLOG.push(nm + ':wrapped');
            return true;
          } catch(e){ globalThis.__VSLOG.push(nm + ':err'); return false; }
        }
        function tick(){
          for (var i=0;i<names.length;i++) wrapOne(names[i]);
        }
        tick();
        return globalThis.__VSLOG.join(',');
      })()`, ctx);
      console.log('ZSE_VMSTR 包装:', _vs);
      var _vsSrc = `(function(){
        var want = ${JSON.stringify(process.env.ZSE_VMSTR)};
        var names = want.split(',');
        globalThis.__VSLOG = globalThis.__VSLOG || [];
        function wrapOne(nm){
          try {
            var o = window[nm];
            if (o === null || o === undefined) return;
            if (typeof o !== 'function' && typeof o !== 'object') return;
            if (o.__vsw) return;
            var orig = o.toString;
            Object.defineProperty(o, 'toString', { configurable: true, writable: true,
              value: function(){ return orig.call(o) + '\u0020'; } });
            o.__vsw = 1;
            globalThis.__VSLOG.push(nm + ':wrapped');
          } catch(e){ globalThis.__VSLOG.push(nm + ':err:' + String(e.message).slice(0,40)); }
        }
        for (var i=0;i<names.length;i++) wrapOne(names[i]);
        return globalThis.__VSLOG.join(',');
      })()`;
      var _vn = 0;
      var _niv = setInterval(function(){
        try { vm.runInContext(_vsSrc, ctx); } catch(e){}
        if (++_vn > 1500) clearInterval(_niv);
      }, 20);
    } catch (e) { console.log('ZSE_VMSTR 失败', String(e.message).slice(0,100)); }
  }
} catch (e) {
  console.log('build 抛错:', String(e && e.message).slice(0, 300));
}

// 给异步留时间（wasm 实例化 + 挑战生成 + 三层 JS）
setTimeout(() => {
  const out = {};
  try { out.cookie = vm.runInContext('String(document.cookie)', ctx); } catch (e) { out.cookie = 'THROW:' + e.message; }
  try { out.gType = vm.runInContext('typeof window.__g', ctx); } catch (e) {}
  try { out.gck = vm.runInContext('(window.__g && typeof window.__g.ck === "string") ? window.__g.ck : null', ctx); } catch (e) {}
  try { out.goType = vm.runInContext('typeof window.Go', ctx); } catch (e) {}
  try { out.wasm = vm.runInContext('typeof WebAssembly.instantiate', ctx); } catch (e) {}
  console.log('--- 结果 ---');
  console.log('__g:', out.gType, '| Go:', out.goType);
  if (out.gck) { require('fs').writeFileSync('.probe/zsec/ck_build.txt', out.gck, 'utf8'); console.log('__g.ck 已存:', out.gck.length, out.gck.slice(0, 30)); }
  const ck = String(out.cookie || '').match(/__zse_ck=([^;]*)/);
  console.log('document.cookie 里的 __zse_ck:', ck ? ck[1].length + ' ' + ck[1].slice(0, 34) : '(无)');
  if (ck) fs.writeFileSync('.probe/zsec/ck_build.txt', ck[1], 'utf8');
  try { const es = vm.runInContext('globalThis.__EVSRC || {}', ctx);
        for (const k of Object.keys(es)) { require('fs').writeFileSync('.probe/oracle/cur_eval_' + k + '.js', es[k]); console.log('已存 cur_eval_' + k + '.js'); } } catch (e) { console.log('存 eval 失败', e.message); }
  try {
    const mems = vm.runInContext(`(function(){ var out=[]; try{ var w=window; }catch(e){}
      return out; })()`, ctx);
    // 从 WebAssembly 实例里找内存：遍历 window 上的对象
    const dump = vm.runInContext(`(function(){
      var found = globalThis.__INST;
      if (!found || !found.exports) return null;
      var mo = found.exports.mem || found.exports.memory;
      if (!mo) return null;
      var u = new Uint8Array(mo.buffer); var s = '';
      for (var i=0;i<u.length;i++) s += String.fromCharCode(u[i]);
      return btoa(s);
    })()`, ctx);
    if (dump) { require('fs').writeFileSync('.probe/zsec/mem_build.bin', Buffer.from(dump,'base64')); console.log('已存 mem_build.bin:', Buffer.from(dump,'base64').length); }
    else console.log('未找到 wasm 内存实例');
  } catch (e) { console.log('dump build 内存失败:', String(e.message).slice(0,120)); }
  try {
    const q = vm.runInContext(`(function(){
      var c = window.__c;
      var o = { hasC: !!c };
      if (c) { o.qh = (typeof c.qh === 'string') ? ('s' + c.qh.length + ':' + c.qh.slice(0, 60)) : String(c.qh); }
      var b = window.__b;
      if (b) { o.zh = (typeof b.zh === 'string') ? ('s' + b.zh.length + ':' + b.zh.slice(0, 40)) : String(b.zh); }
      return JSON.stringify(o);
    })()`, ctx);
  try {
    const g2 = vm.runInContext(`(function(){
      var g = window.__g; if (!g) return 'no __g';
      var o = {};
      ['g','M','D','R','A','B'].forEach(function(k){
        var v = g[k]; if (!Array.isArray(v)) { o[k] = typeof v; return; }
        o[k] = 'arr' + v.length + ':[' + v.slice(0, 40).map(function(x){
          if (typeof x === 'string') return 's' + x.length + ':' + x.slice(0, 18);
          if (typeof x === 'number') return String(x);
          return typeof x; }).join(',') + ']';
      });
      return JSON.stringify(o);
    })()`, ctx);
    console.log('__g 数组内容:', String(g2).slice(0, 1800));
  } catch (e) { console.log('dump __g 失败:', String(e.message).slice(0,100)); }
  try {
    const hc2 = vm.runInContext('globalThis.__HOSTCALLS', ctx);
    const slots = hc2.filter(function(x){ return x && x.slotBefore; });
    console.log('结果槽写入（尾 12）:', JSON.stringify(slots.slice(-12)));
  } catch (e) { console.log('读结果槽失败:', String(e.message).slice(0,120)); }
  try { console.log('__g.N 调用:', JSON.stringify(vm.runInContext('globalThis.__NCALLS', ctx)).slice(0, 1200)); } catch (e) {}
  try { console.log('首次进入详情:', JSON.stringify(vm.runInContext('globalThis.__ENTRYD||[]', ctx)).slice(0, 600)); } catch (e) {}
  try {
  try { console.log('get eval 的接收者:', JSON.stringify(vm.runInContext('globalThis.__GETS||[]', ctx)).slice(0, 1200)); } catch (e) { console.log('读 __GETS 失败:', String(e.message).slice(0,80)); }
  try { console.log('1032 及其后 6 次调用:', JSON.stringify(vm.runInContext('globalThis.__AFTERS||[]', ctx)).slice(0, 2000)); } catch (e) { console.log('读 __AFTERS 失败:', String(e.message).slice(0,80)); }
  try { console.log('eval 时间线:', JSON.stringify(vm.runInContext('globalThis.__EVLOG||[]', ctx)).slice(0, 1800)); } catch (e) { console.log('读 eval 时间线失败:', String(e.message).slice(0,80)); }
    console.log('__c.H 包装:', vm.runInContext('globalThis.__PGHOOK||0', ctx), vm.runInContext('globalThis.__PGHOOKERR||""', ctx));
    console.log('__c.H 入参:', JSON.stringify(vm.runInContext('globalThis.__PGE2||[]', ctx)).slice(0, 900));
    console.log('__c.H 返回:', JSON.stringify(vm.runInContext('globalThis.__PGE3||[]', ctx)).slice(0, 900));
  } catch (e) { console.log('读 __c.H 包装失败:', String(e.message).slice(0,80)); }
  try {
    const pg = vm.runInContext('globalThis.__PG||[]', ctx);
    console.log('payload G 轨迹: patch=' + vm.runInContext('globalThis.__PGPATCH||0', ctx) + ' 自检=' + vm.runInContext('globalThis.__PGCHK||"(无)"', ctx) + ' n=' + pg.length + ' 头30=' + JSON.stringify(pg.slice(0,30)) + ' 尾10=' + JSON.stringify(pg.slice(-10)));
    console.log('payload 入口:', vm.runInContext('globalThis.__PGENTRY||0', ctx), JSON.stringify(vm.runInContext('globalThis.__PGE||[]', ctx)).slice(0,400));
  } catch (e) { console.log('读 payload 轨迹失败:', String(e.message).slice(0,80)); }
  try {
    console.log('PGI 实例表:', vm.runInContext(`(function(){var G=globalThis.__PGI;if(!G)return "noPGI";
      var o=[];for(var k in G.inst){var r=G.inst[k];
      o.push(k+":ylen="+r.ylen+" cnt="+r.cnt);}
      return o.join(" || ");})()`, ctx));
    var pgr = vm.runInContext('globalThis.__PGR||{}', ctx);
    var keys = Object.keys(pgr).sort(function(a,b){var x=a.split(':'),y=b.split(':');return Number(x[0])-Number(y[0])||Number(x[1])-Number(y[1]);});
    console.log('PGR 条数:', keys.length);
    for (var _i = 0; _i < keys.length; _i++) console.log('   ' + pgr[keys[_i]]);
  } catch (e) { console.log('读 PGI 失败:', String(e.message).slice(0,80)); }
  try {
    console.log('Range/NodeIterator 探测:', vm.runInContext(`(function(){
      var o = {};
      try { o.hasDoc = ('document' in window); } catch(e){ o.hasDoc='ERR'; }
      try { var r = document.createRange();
            o.createRange = typeof document.createRange;
            o.getClientRects = typeof r.getClientRects;
            o.insertNode = typeof r.insertNode;
            o.intersectsNode = typeof r.intersectsNode;
            o.isPointInRange = typeof r.isPointInRange;
            o.selectNode = typeof r.selectNode;
            o.cloneRange = typeof r.cloneRange; } catch(e){ o.rangeErr = String(e.message).slice(0,60); }
      try { var n = document.createNodeIterator(document.body);
            o.niRoot = typeof n.root; o.niFilter = typeof n.filter;
            o.niWhat = typeof n.whatToShow; o.niDetach = typeof n.detach; } catch(e){ o.niErr = String(e.message).slice(0,60); }
      try { o.src0 = new Function('try{window={};document={};var c=0;"A,ABBR,DECORATOR".split(",").forEach(function(i){document.createElement(i).tagName!==i&&(c=1)});return c}catch(_){return 2}')(); } catch(e){ o.src0Err = String(e.message).slice(0,60); }
      return JSON.stringify(o);
    })()`, ctx));
  } catch (e) { console.log('Range 探测失败:', String(e.message).slice(0,80)); }
  try {
    var bl = vm.runInContext('globalThis.__BITLOG||[]', ctx);
    var uniq = {};
    for (var _q = 0; _q < bl.length; _q++) uniq[bl[_q]] = (uniq[bl[_q]] || 0) + 1;
    var ks = Object.keys(uniq);
    console.log('toString(16) 含 bit11/bit15 的值: ' + ks.length + ' 种');
    for (var _k = 0; _k < Math.min(ks.length, 30); _k++) console.log('   ' + ks[_k] + '  x' + uniq[ks[_k]]);
  } catch (e) { console.log('读 BITLOG 失败:', String(e.message).slice(0,80)); }
  try {
    console.log('__b/__c/__g 数组字段:', vm.runInContext(`(function(){
      var o = {};
      ['__c'].forEach(function(nm){
        var v = window[nm];
        if (!v) { o[nm] = 'none'; return; }
        var d = {};
        Object.getOwnPropertyNames(v).forEach(function(k){
          var x; try { x = v[k]; } catch(e){ return; }
          if (Array.isArray(x)) {
            var vals = [];
            for (var i = 0; i < Math.min(x.length, 40); i++) {
              var e2 = x[i];
              vals.push(typeof e2 === 'number' ? e2 : (typeof e2 === 'string' ? ('s' + e2.length) : typeof e2));
            }
            d[k] = 'arr' + x.length + '[' + vals.join(',') + ']';
          }
        });
        o[nm] = d;
      });
      return JSON.stringify(o);
    })()`, ctx));
  } catch (e) { console.log('读 __b 数组失败:', String(e.message).slice(0,80)); }
  try {
    console.log('全上下文搜 33280(0x8200):', vm.runInContext(`(function(){
      var hits = [];
      var seen = new Set();
      function scan(obj, path, depth){
        if (!obj || depth > 2 || hits.length > 20) return;
        if (typeof obj !== 'object' && typeof obj !== 'function') return;
        if (seen.has(obj)) return; seen.add(obj);
        var ks; try { ks = Object.getOwnPropertyNames(obj); } catch(e){ return; }
        for (var i = 0; i < ks.length && i < 60; i++) {
          var k = ks[i], v; try { v = obj[k]; } catch(e){ continue; }
          if (v === 33280) hits.push(path + '.' + k);
          else if (typeof v === 'object' && v !== null) {
            if (Array.isArray(v)) {
              for (var j = 0; j < Math.min(v.length, 60); j++) if (v[j] === 33280) hits.push(path + '.' + k + '[' + j + ']');
            } else scan(v, path + '.' + k, depth + 1);
          }
        }
      }
      scan(window, 'window', 0);
      return JSON.stringify(hits);
    })()`, ctx));
  } catch (e) { console.log('搜 33280 失败:', String(e.message).slice(0,80)); }
  try {
    var hc = vm.runInContext('globalThis.__HOSTCALLS||[]', ctx);
    var byName = {};
    for (var _h = 0; _h < hc.length; _h++) {
      var nm = String(hc[_h].name || '?').replace('syscall/js.','');
      var key = nm + ' argc=' + (String(hc[_h].a||'').split(',').length);
      if (!byName[key]) byName[key] = [];
      if (byName[key].length < 3) byName[key].push(String(hc[_h].a||'').slice(0, 110));
    }
    var keys = Object.keys(byName).sort();
    console.log('宿主调用种类 = ' + keys.length + ' 总调用 = ' + hc.length);
    for (var _q = 0; _q < keys.length; _q++) {
      console.log('   ' + keys[_q] + '  e.g. ' + byName[keys[_q]][0]);
    }
  } catch (e) { console.log('读 HOSTCALLS 失败:', String(e.message).slice(0,80)); }
  try {
    var ml = vm.runInContext('globalThis.__MALLOC||[]', ctx);
    console.log('malloc/calloc/realloc 调用 = ' + ml.length + ' err=' + vm.runInContext('globalThis.__MALLOCERR||"none"', ctx));
    for (var _m2 = 0; _m2 < Math.min(ml.length, 20); _m2++) console.log('   ' + ml[_m2]);
  } catch (e) {}
  try {
    console.log('table 捕获: len=' + vm.runInContext('globalThis.__TBLOK||-1', ctx)
      + ' err=' + vm.runInContext('globalThis.__TBLERR||"none"', ctx)
      + ' set 次数=' + vm.runInContext('(globalThis.__TSET||[]).length', ctx));
    var ts = vm.runInContext('globalThis.__TSET||[]', ctx);
    for (var _t2 = 0; _t2 < Math.min(ts.length, 25); _t2++) console.log('   ' + ts[_t2]);
    console.log('table 槽位快照:', vm.runInContext(`(function(){
      var t = globalThis.__TBL; if (!t) return 'no table';
      var out = [];
      for (var i = 0; i < t.length; i++) {
        var f = null; try { f = t.get(i); } catch(e){ out.push(i + ':ERR'); continue; }
        if (f) { var nm=''; try { nm = f.name || ''; } catch(e){} out.push(i + ':' + (nm || 'fn')); }
      }
      return out.join(' ');
    })()`, ctx));
  } catch (e) { console.log('读 table 失败:', String(e.message).slice(0,80)); }
  try {
    console.log('48-hex 中间串命中 = ' + vm.runInContext('globalThis.__BMHITS||0', ctx)
      + ' 位置=' + JSON.stringify(vm.runInContext('globalThis.__BMLOG||[]', ctx)).slice(0, 400));
  } catch (e) {}
  try {
    console.log('按产出串修正命中 = ' + vm.runInContext('globalThis.__STRFIX||0', ctx)
      + '  序列匹配命中 = ' + vm.runInContext('globalThis.__SEQFIX||0', ctx)
      + '  日志 = ' + JSON.stringify(vm.runInContext('globalThis.__STRLOG||[]', ctx)).slice(0, 200));
  } catch (e) {}
  try {
    var sel = vm.runInContext('globalThis.__SEL||[]', ctx);
    console.log('栈上出现 512 的调度: ' + sel.length + ' 条');
    for (var _z2 = 0; _z2 < Math.min(sel.length, 25); _z2++) console.log('   ' + sel[_z2]);
  } catch (e) {}
  try {
    var stk = vm.runInContext('globalThis.__STK||[]', ctx);
    console.log('断点处整栈 dump: ' + stk.length + ' 条');
    for (var _s2 = 0; _s2 < Math.min(stk.length, 8); _s2++) console.log('   ' + stk[_s2]);
  } catch (e) {}
  try {
    console.log('搜 JS 里的位图 hex 串:', vm.runInContext(`(function(){
      var hits = [], seen = new Set();
      var NEEDLE = '880082008000c000';   // 位图里 w7..w10 的 16 hex
      function scan(o, path, d){
        if (!o || d > 3 || hits.length > 10) return;
        var t = typeof o; if (t !== 'object' && t !== 'function') return;
        if (seen.has(o)) return; seen.add(o);
        var ks; try { ks = Object.getOwnPropertyNames(o); } catch(e){ return; }
        for (var i = 0; i < ks.length && i < 80; i++) {
          var k = ks[i], v; try { v = o[k]; } catch(e){ continue; }
          if (typeof v === 'string') { if (v.indexOf(NEEDLE) >= 0) hits.push(path + '.' + k + ' len=' + v.length); }
          else if (typeof v === 'object' && v !== null) {
            if (Array.isArray(v)) { for (var j = 0; j < Math.min(v.length,80); j++) if (typeof v[j]==='string' && v[j].indexOf(NEEDLE)>=0) hits.push(path+'.'+k+'['+j+']'); }
            else scan(v, path + '.' + k, d + 1);
          }
        }
      }
      scan(window, 'window', 0);
      return JSON.stringify(hits);
    })()`, ctx));
  } catch (e) { console.log('搜位图串失败:', String(e.message).slice(0,80)); }
  try {
    console.log('小端 0x8200 命中=' + vm.runInContext('globalThis.__LEHITS||0', ctx)
      + ' 位置=' + JSON.stringify(vm.runInContext('globalThis.__LELOG||[]', ctx)).slice(0, 500));
  } catch (e) {}
  try {
    var hc = vm.runInContext('globalThis.__HOSTCALLS||[]', ctx);
    console.log('valueIndex / valueLength / valueNew 明细:');
    var n = 0;
    for (var _h = 0; _h < hc.length; _h++) {
      var nm = String(hc[_h].name || '');
      if (nm.indexOf('valueIndex') < 0 && nm.indexOf('valueLength') < 0 && nm.indexOf('valueNew') < 0) continue;
      if (n++ > 30) break;
      console.log('   ' + nm.replace('syscall/js.','') + ' a=' + String(hc[_h].a||'').slice(0,80) + ' ret=' + String(hc[_h].ret||'').slice(0,40));
    }
    console.log('   共 ' + n + ' 条');
  } catch (e) {}
  try {
    var wh = vm.runInContext('globalThis.__WHERE||[]', ctx);
    console.log('0x8200 出现处: ' + wh.length + ' 条');
    for (var _w = 0; _w < Math.min(wh.length, 20); _w++) console.log('   ' + wh[_w]);
  } catch (e) { console.log('读 WHERE 失败:', String(e.message).slice(0,80)); }
  try {
    var fl = vm.runInContext('globalThis.__FMTLOG||[]', ctx);
    console.log('格式化点命中 = ' + fl.length + ' 条');
    for (var _f2 = 0; _f2 < Math.min(fl.length, 20); _f2++) console.log('   ' + fl[_f2]);
  } catch (e) {}
  try {
    var w2 = vm.runInContext('globalThis.__WHERE2||[]', ctx);
    console.log('Reflect.get 见到 33408: ' + w2.length + ' 条');
    for (var _z = 0; _z < Math.min(w2.length, 10); _z++) console.log('   ' + w2[_z]);
  } catch (e) {}
  try {
    console.log('内存修正命中=' + vm.runInContext('globalThis.__MPHIT||0', ctx)
      + ' 日志=' + JSON.stringify(vm.runInContext('globalThis.__MPLOG||[]', ctx)).slice(0, 300)
      + ' err=' + JSON.stringify(vm.runInContext('globalThis.__MPERR||[]', ctx)).slice(0, 200));
  } catch (e) {}
  try {
    var br = vm.runInContext('globalThis.__BRIDGE||[]', ctx);
    console.log('桥接字符串轨迹: 条数=' + br.length);
    for (var _b = 0; _b < Math.min(br.length, 40); _b++) console.log('   ' + br[_b]);
  } catch (e) { console.log('读桥接轨迹失败:', String(e.message).slice(0,80)); }
  try {
    var bptr = vm.runInContext('globalThis.__BPTR||[]', ctx);
    console.log('断点轨迹: 条数=' + bptr.length + ' 装载=' + vm.runInContext('globalThis.__BPOK||0', ctx)
      + ' err=' + JSON.stringify(vm.runInContext('globalThis.__BPTRERR||[]', ctx)).slice(0, 160));
    if (bptr.length) {
      require('fs').writeFileSync('.probe/zsec/bp_trace.json', JSON.stringify(bptr));
      console.log('  已写 .probe/zsec/bp_trace.json');
      console.log('  头6条=' + JSON.stringify(bptr.slice(0, 6)));
    }
  } catch (e) { console.log('读断点轨迹失败:', String(e.message).slice(0,80)); }
  try { console.log('__ENTRY / __MARK:', vm.runInContext('JSON.stringify({ENTRY:globalThis.__ENTRY||0, MARK:globalThis.__MARK||0})', ctx)); } catch (e) { console.log('读标记失败:', String(e.message).slice(0,80)); }
  try { console.log('Reflect.set 调用:', JSON.stringify(vm.runInContext('globalThis.__SETS', ctx)).slice(0, 900)); } catch (e) {}
  try { console.log('VM 返回点:', JSON.stringify(vm.runInContext('globalThis.__RETS||[]', ctx)).slice(0, 900)); } catch (e) {}
  try { console.log('qh 赋值监视:', JSON.stringify(vm.runInContext('globalThis.__QH', ctx)).slice(0, 400)); } catch (e) {}
    console.log('qh 检查:', String(q).slice(0, 400));
  } catch (e) { console.log('qh 检查失败:', String(e.message).slice(0,120)); }
  try { console.log('前 400 条 pc 轨迹:', JSON.stringify(vm.runInContext('globalThis.__VT2||[]', ctx)).slice(0, 1800)); } catch (e) {}
  try { console.log('143-147 循环处状态:', JSON.stringify(vm.runInContext('globalThis.__LOOPS||[]', ctx)).slice(0, 2000)); } catch (e) {}
  try {
    const cs = vm.runInContext('globalThis.__CALLS', ctx);
    console.log('JS 调用总数:', cs.length);
    console.log('JS 调用尾 25:', JSON.stringify(cs.slice(-25)));
  } catch (e) { console.log('读 __CALLS 失败:', String(e.message).slice(0,120)); }
  try { console.log('console 输出:', JSON.stringify(vm.runInContext('globalThis.__CONSOLE', ctx)).slice(0, 2000)); } catch (e) {}
  try {
    try { console.log('WAC = ' + JSON.stringify(vm.runInContext('globalThis.__WAC||[]', ctx)).slice(0,600)); } catch(eW2){}
    try {
      var _hc9 = vm.runInContext('globalThis.__HOSTCALLS||[]', ctx);
      var _ss = _hc9.filter(function(x){ return x && x.srcText; });
      console.log('op1032/1034 源文本捕获 n=' + _ss.length);
      for (var _i9 = 0; _i9 < _ss.length; _i9++) console.log('   n=' + _ss[_i9].n + ' len=' + _ss[_i9].srcText.length + ' ' + JSON.stringify(_ss[_i9].srcText).slice(0,140));
      require('fs').writeFileSync('.probe/zsec/srcs.json', JSON.stringify(_ss));
    } catch (eS9) { console.log('srcText dump 失败', String(eS9.message).slice(0,100)); }
    try {
      var _hc8 = vm.runInContext('globalThis.__HOSTCALLS||[]', ctx);
      var _probes = _hc8.filter(function(x){ return x && x.srcText && /return |try\{/.test(x.srcText) && x.srcText.length < 400; });
      console.log('在最终上下文里重放 Go 侧探针 n=' + _probes.length);
      for (var _i8 = 0; _i8 < _probes.length; _i8++) {
        var _s8 = _probes[_i8].srcText, _r8;
        try { _r8 = vm.runInContext('(function(){' + _s8 + '})()', ctx); } catch (e8) { _r8 = 'THROW:' + e8.message; }
        console.log('   n=' + _probes[_i8].n + ' res=' + JSON.stringify(_r8).slice(0,110) + '  src=' + JSON.stringify(_s8).slice(0,90));
      }
    } catch (eP8) { console.log('探针重放失败', String(eP8.message).slice(0,100)); }
    try {
      console.log('CVM/BVM/VM/Go 诊断: ' + vm.runInContext(`(function(){
        var out = [];
        ['CVM','BVM','VM','Go'].forEach(function(n){
          var o;
          try { o = window[n]; } catch(e) { out.push(n + ':THROW'); return; }
          var d = n + ' typeof=' + (typeof o);
          if (o !== undefined && o !== null) {
            try { d += ' ctor=' + (o.constructor && o.constructor.name); } catch(e){}
            try { d += ' keys=' + Object.keys(o).length; } catch(e){}
            try { d += ' tsLen=' + String(o.toString()).length; } catch(e) { d += ' tsTHROW'; }
          }
          out.push(d);
        });
        try { out.push('hasCVM=' + ('CVM' in window) + ' hasBVM=' + ('BVM' in window)); } catch(e){}
        try { out.push('winKeys=' + Object.keys(window).filter(function(k){return /CVM|BVM|^VM$|^Go$/.test(k);}).join('|')); } catch(e){}
        return out.join('  ||  ');
      })()`, ctx));
    } catch (e) { console.log('诊断失败', String(e.message).slice(0,100)); }
    try { console.log('VSLOG 最终: ' + JSON.stringify(vm.runInContext('globalThis.__VSLOG||[]', ctx)).slice(0,400)); } catch(eV){}
    try { console.log('CHLOG: ' + JSON.stringify(vm.runInContext('globalThis.__CHLOG||[]', ctx)).slice(0,900)); } catch(eC){}
    try { console.log('CHPOLL: ' + JSON.stringify(vm.runInContext('globalThis.__CHPOLL||[]', ctx)).slice(0,600)); } catch(eP){}
    try {
      console.log('H 定位: ' + vm.runInContext(`(function(){
        var out = [];
        var names = ['CVM','BVM','VM','Go','__g','__c','__b'];
        for (var i=0;i<names.length;i++){
          var n = names[i], o;
          try { o = (n.charAt(0)==='_' ? window[n] : window[n]); } catch(e) { out.push(n + ':THROW'); continue; }
          if (o === undefined) { out.push(n + ':undef'); continue; }
          var d = n + ':' + (typeof o);
          try { var own = Object.getOwnPropertyNames(o); if (own.indexOf('H')>=0) d += ' HAS_H(own)'; } catch(e){}
          try { if (o.prototype) { var po = Object.getOwnPropertyNames(o.prototype); if (po.indexOf('H')>=0) d += ' HAS_H(proto)'; } } catch(e){}
          try { if (typeof o.H === 'function') d += ' H=' + String(o.H).slice(0,40); } catch(e){}
          out.push(d);
        }
        return out.join('  ||  ');
      })()`, ctx));
    } catch (eH2) { console.log('H 定位失败', String(eH2.message).slice(0,80)); }
    try {
      console.log('实例寄存器: ' + vm.runInContext(`(function(){
        var out = [];
        function dump(nm, o){
          if (o === undefined || o === null) { out.push(nm + '=null'); return; }
          var t = Object.prototype.toString.call(o);
          var d = nm + ':' + t;
          try {
            var ks = Object.keys(o);
            d += ' nkeys=' + ks.length;
            if (ks.length) {
              var parts = [];
              for (var i = 0; i < Math.min(ks.length, 30); i++) {
                var v = o[ks[i]];
                var sv = (v && typeof v === 'object') ? (Object.prototype.toString.call(v) + ':len' + (v.length !== undefined ? v.length : '?')) : String(v).slice(0, 30);
                parts.push(ks[i] + '=' + sv);
              }
              d += ' {' + parts.join(' | ') + '}';
            }
          } catch(e) { d += ' keysErr'; }
          out.push(d);
        }
        var I = globalThis.__LASTINST;
        dump('LASTINST', I);
        if (I) { try { var own = Object.getOwnPropertyNames(I); out.push('ownProps=' + own.join(',')); } catch(e){} }
        try { dump('__c', window.__c); } catch(e){}
        try { if (window.__c) { var own2 = Object.getOwnPropertyNames(window.__c); out.push('__c.ownProps=' + own2.join(',')); } } catch(e){}
        try { dump('__c.G', window.__c && window.__c.G); } catch(e){}
        try {
          var I2 = globalThis.__LASTINST;
          if (I2 && I2.G) { out.push('LASTINST.G = ' + Array.prototype.slice.call(I2.G).map(function(x){ return (typeof x === 'number') ? ('0x' + x.toString(16)) : String(x); }).join(' ')); }
          if (I2 && I2.g) { out.push('LASTINST.i=' + I2.i + ' U=' + I2.U + ' J=' + I2.J + ' X=' + I2.X + ' u=' + I2.u); }
        } catch(e){}
        try {
          var c2 = window.__c;
          if (c2 && c2.G) { out.push('__c.G = ' + Array.prototype.slice.call(c2.G).map(function(x){ return (typeof x === 'number') ? ('0x' + x.toString(16)) : String(x); }).join(' ')); }
        } catch(e){}
        return out.join('  ||  ');
      })()`, ctx).slice(0, 7000));
    } catch (eIR) { console.log('实例 dump 失败', String(eIR.message).slice(0,80)); }
    try {
      var _rf = vm.runInContext(`(function(){
        function fmt(x){
          if (typeof x === 'number') return '0x' + (x >>> 0).toString(16);
          if (typeof x === 'string') return JSON.stringify(x.length > 24 ? (x.slice(0,24) + '…') : x);
          if (typeof x === 'function') return '<fn:' + String(x).replace(/\s+/g,' ').slice(0,40) + '>';
          if (x && typeof x === 'object') return '<' + Object.prototype.toString.call(x) + '>';
          return String(x);
        }
        function dumpG(nm, o){
          if (!o || !o.G) return nm + '.G=null';
          var g = o.G, n = g.length, parts = [];
          for (var i = 0; i < n; i++) parts.push('[' + i + ']' + fmt(g[i]));
          return nm + '.G(n=' + n + ') ' + parts.join(' ');
        }
        var out = [];
        out.push(dumpG('__c', window.__c));
        out.push(dumpG('LASTINST', globalThis.__LASTINST));
        return out.join('\n');
      })()`, ctx);
      console.log('寄存器全表:\n' + _rf);
    } catch (eRF) { console.log('寄存器 dump 失败', String(eRF.message).slice(0,80)); }
    try {
      var _t16 = vm.runInContext('globalThis.__T16||null', ctx);
      if (_t16) {
        console.log('T16.seq n=' + _t16.seq.length + ' ' + JSON.stringify(_t16.seq.slice(0, 20)));
        console.log('T16.consumers n=' + _t16.consumers.length + ' ' + JSON.stringify(_t16.consumers.slice(0, 24)));
      }
      console.log('SEQFIX=' + vm.runInContext('globalThis.__SEQFIX||0', ctx) + ' STRFIX=' + vm.runInContext('globalThis.__STRFIX||0', ctx) + ' STRLOG=' + JSON.stringify(vm.runInContext('globalThis.__STRLOG||[]', ctx)).slice(0,300) + ' AFIX=' + vm.runInContext('globalThis.__AFIX||0', ctx));
    } catch (eT16) {}
    try {
      var _gl = vm.runInContext('globalThis.__GJLOG||[]', ctx);
      console.log('GJLOG n=' + _gl.length + ' err=' + JSON.stringify(vm.runInContext('globalThis.__GJERR||null', ctx)));
      console.log('GJLOG 内容: ' + JSON.stringify(_gl.slice(0, 40)));
    } catch (eG4) {}
    try { var _al = vm.runInContext('globalThis.__ALLLOG||[]', ctx); console.log('ALLLOG n=' + _al.length + ' ' + JSON.stringify(_al.slice(0,60))); } catch(eAL2){}
    try { console.log('DELALL: ' + JSON.stringify(vm.runInContext('globalThis.__DELALL_RES||null', ctx))); } catch(eDA2){}
    try {
      var _gp = vm.runInContext('globalThis.__GPLOG||[]', ctx);
      console.log('GETPROBE res=' + JSON.stringify(vm.runInContext('globalThis.__GPRES||null', ctx)) + ' err=' + JSON.stringify(vm.runInContext('globalThis.__GPERR||null', ctx)) + ' n=' + _gp.length);
      var _und = {};
      for (var _i2 = 0; _i2 < _gp.length; _i2++) {
        var _ln = String(_gp[_i2]);
        if (_ln.indexOf('=> undefined') < 0) continue;
        var _key = _ln.slice(0, _ln.indexOf(' <- '));
        var _rcv = _ln.slice(_ln.indexOf(' <- ') + 4);
        var _k2 = _rcv.split('|')[0];
        _und[_k2] = _und[_k2] || [];
        if (_und[_k2].indexOf(_key) < 0 && _und[_k2].length < 40) _und[_k2].push(_key);
      }
      console.log('返回 undefined 的查找按接收者分类:');
      for (var _rk in _und) console.log('   ' + _rk + '  ←  ' + _und[_rk].join(','));
      var _u2 = {};
      for (var _i3 = 0; _i3 < _gp.length; _i3++) { var _l2 = String(_gp[_i3]); var _r2 = _l2.slice(_l2.indexOf(' <- ')); _u2[_r2.split('|')[0]] = 1; }
      console.log('全部接收者种类: ' + JSON.stringify(Object.keys(_u2)));
    } catch (eGP2) {}
    try {
      var _sn = vm.runInContext('globalThis.__SNAPRES||null', ctx);
      console.log('SNAPSHOT(AFTER_EVAL) err=' + JSON.stringify(vm.runInContext('globalThis.__SNAPERR||null', ctx)));
      if (_sn) { var _ls = String(_sn).split(String.fromCharCode(10)); for (var _i=0;_i<_ls.length && _i<12;_i++) console.log('   ' + _ls[_i].slice(0, 1200)); }
    } catch(eSN2) {}
    try {
      var _bs = vm.runInContext('globalThis.__BIGSRC||null', ctx);
      if (_bs) { require('fs').writeFileSync('.probe/zsec/cvm_src.txt', String(_bs)); console.log('已存 cvm_src.txt len=' + String(_bs).length); }
      else console.log('没抓到 40K..50K 的 eval');
    } catch (eBD2) {}
    try {
      var _cs = vm.runInContext('(typeof window.CVM === "function") ? window.CVM.toString() : ""', ctx);
      console.log('CVM.toString() 长度=' + String(_cs).length);
      console.log('CVM 源码 [43200..44200]:');
      console.log(String(_cs).slice(43200, 44200));
      require('fs').writeFileSync('.probe/zsec/cvm_src.txt', String(_cs));
    } catch (eCS) { console.log('CVM 源码 dump 失败', String(eCS.message).slice(0,80)); }
    try {
      var _cl4 = vm.runInContext('globalThis.__CKLOG||[]', ctx);
      for (var _i5 = 0; _i5 < _cl4.length; _i5++) {
        var _e5 = _cl4[_i5];
        if (!_e5 || !_e5.dumps) continue;
        console.log('--- CKLOG #' + _i5 + ' len=' + _e5.len + ' head=' + JSON.stringify(_e5.head));
        for (var _d5 = 0; _d5 < _e5.dumps.length; _d5++) console.log('   ' + String(_e5.dumps[_d5]).split(String.fromCharCode(10)).join(' ~ ').slice(0, 2500));
      }
    } catch (eCK2) {}
    try {
      var _zw = vm.runInContext('globalThis.__ZWLOG||[]', ctx);
      console.log('ZWLOG n=' + _zw.length);
      for (var _i9 = 0; _i9 < _zw.length; _i9++) {
        var _e9 = _zw[_i9];
        console.log('   [pc=0x' + ((_e9.pc >>> 0).toString(16)) + '] A=' + JSON.stringify(_e9.A) + ' S=' + JSON.stringify(_e9.S) + ' G=' + JSON.stringify(_e9.G) + ' R=' + JSON.stringify(_e9.R));
      }
    } catch(eZW) {}
    try {
      var _bf = vm.runInContext('globalThis.__BIGFN||[]', ctx);
      console.log('BIGFN n=' + _bf.length + ' lens=' + JSON.stringify(_bf.map(function(x){return String(x).length;})));
      for (var _bi = 0; _bi < _bf.length; _bi++) {
        require('fs').writeFileSync('.probe/zsec/bigfn_' + _bi + '.js', String(_bf[_bi]));
        console.log('   已存 bigfn_' + _bi + '.js len=' + String(_bf[_bi]).length + ' head=' + JSON.stringify(String(_bf[_bi]).slice(0, 150)));
      }
    } catch(eBF) {}
    try {
      var _lr = vm.runInContext('globalThis.__LRLOG||[]', ctx);
      console.log('LRLOG n=' + _lr.length);
      var _hex = [], _seen2 = {};
      for (var _i8 = 0; _i8 < _lr.length; _i8++) {
        var _s8 = String(_lr[_i8]);
        if (!_seen2[_s8]) { _seen2[_s8] = 1; if (_hex.length < 200) _hex.push(_s8); }
      }
      console.log('LRLOG 去重(' + _hex.length + '): ' + JSON.stringify(_hex.slice(0, 120)));
    } catch(eLR2) {}
    try {
      var _rw = vm.runInContext('globalThis.__RWLOG||[]', ctx);
      console.log('RWLOG n=' + _rw.length + ' err=' + JSON.stringify(vm.runInContext('globalThis.__RWERR||null', ctx)));
      for (var _i7 = 0; _i7 < Math.min(_rw.length, 700); _i7++) console.log('   ' + String(_rw[_i7]).split(String.fromCharCode(10)).join(' ~ ').slice(0, 260));
    } catch(eRW2) {}
    try { console.log('CKLOG n=' + vm.runInContext('(globalThis.__CKLOG||[]).length', ctx)); var _cl3 = vm.runInContext('globalThis.__CKLOG||[]', ctx); for (var _i4 = 0; _i4 < Math.min(_cl3.length, 8); _i4++) console.log('   ' + JSON.stringify(_cl3[_i4]).slice(0, 400)); } catch(eCK){}
    try {
      var _m93 = vm.runInContext('globalThis.__INST && globalThis.__INST.exports && (globalThis.__INST.exports.mem||globalThis.__INST.exports.memory)', ctx);
      if (_m93) {
        var _u93 = new Uint8Array(_m93.buffer), _found = [];
        for (var _i93 = 0; _i93 + 93 <= _u93.length && _found.length < 12; _i93++) {
          var _zok = true;
          for (var _j93 = 0; _j93 < 93; _j93++) {
            var _c93 = _u93[_i93 + _j93];
            var _isHex93 = (_c93 >= 48 && _c93 <= 57) || (_c93 >= 97 && _c93 <= 102) || _c93 === 88; /* 'X' canary */
            if (_j93 === 80) { if (_c93 !== 0x7a) { _zok = false; break; } }
            else if (!_isHex93) { _zok = false; break; }
          }
          if (!_zok) continue;
          var _str93 = ''; for (var _k93 = 0; _k93 < 93; _k93++) _str93 += String.fromCharCode(_u93[_i93 + _k93]);
          _found.push({ addr: _i93, rec: _str93 });
          _i93 += 92;
        }
        console.log('REC93 全量匹配 n=' + _found.length);
        for (var _f9 = 0; _f9 < _found.length; _f9++) {
          var _r9 = _found[_f9].rec;
          console.log('   @' + _found[_f9].addr + ' bmp=' + _r9.slice(0,48) + ' fp=' + _r9.slice(48,80) + ' z=' + _r9[80] + ' crc=' + _r9.slice(81,89) + ' tail=' + _r9.slice(89,93));
        }
      }
    } catch(e93) { console.log('REC93 dump 失败: ' + String(e93.message).slice(0,90)); }
    try { console.log('位图首现: ' + JSON.stringify(vm.runInContext('globalThis.__RECFIRST||null', ctx)) + ' 扫描次数=' + vm.runInContext('globalThis.__RECSCAN||0', ctx) + ' err=' + JSON.stringify(vm.runInContext('globalThis.__RECERR||null', ctx))); } catch(eR2){}
    try {
      var _all = {};
      var _names = ['CVM','BVM','VM','Go'];
      for (var _ni = 0; _ni < _names.length; _ni++) {
        var _nm2 = _names[_ni];
        try {
          var _o2 = vm.runInContext('window[' + JSON.stringify(_nm2) + ']', ctx);
          if (typeof _o2 === 'function') {
            var _src2 = vm.runInContext('window[' + JSON.stringify(_nm2) + '].toString()', ctx);
            _all[_nm2] = String(_src2);
          }
        } catch(eN2) {}
      }
      for (var _k3 in _all) {
        var _fn2 = '.probe/zsec/src_' + _k3 + '.js';
        require('fs').writeFileSync(_fn2, _all[_k3]);
        console.log('已存 ' + _fn2 + ' len=' + _all[_k3].length);
      }
    } catch (eAll) { console.log('dump 全部类失败', String(eAll.message).slice(0,80)); }
    try { console.log('imports.gojs = ' + vm.runInContext('globalThis.__GOJS||null', ctx)); } catch(eGJ2){}
    try { console.log('GPOKE_C: flag=' + vm.runInContext('globalThis.__GPOKE_C', ctx) + ' done=' + vm.runInContext('globalThis.__GPOKE_C_DONE||0', ctx) + ' res=' + JSON.stringify(vm.runInContext('globalThis.__GPOKE_C_RES||null', ctx)) + ' allnDone=' + vm.runInContext('globalThis.__ALLN_GO_DONE||0', ctx)); } catch(eGC){}
    try {
      console.log('RNGCHK = ' + vm.runInContext(`(function(){
        var out = {};
        try { var r = document.createRange(); out.rngStr = String(r); out.cloneRange = typeof r.cloneRange; out.root = typeof r.root; out.body = typeof r.body; out.keys = Object.keys(r).length; } catch(e) { out.rngErr = e.message; }
        try { var it = document.createNodeIterator(document.body); out.iterStr = String(it); out.iterRoot = typeof it.root; out.iterFilter = typeof it.filter; out.iterDetach = typeof it.detach; out.iterWhat = typeof it.whatToShow; } catch(e) { out.iterErr = e.message; }
        try { out.docIsWinDoc = (document === window.document); } catch(e){}
        return JSON.stringify(out);
      })()`, ctx));
    } catch(eRC2){}
    try {
      var _full = vm.runInContext('globalThis.__CHLOG2||[]', ctx);
      require('fs').writeFileSync('.probe/zsec/h_full.json', JSON.stringify(_full));
      console.log('已存 h_full.json n=' + _full.length);
    } catch(eHF) {}
    try {
      var _cl2 = vm.runInContext('globalThis.__CHLOG2||[]', ctx);
      var _uniq = {}, _order = [];
      for (var _q = 0; _q < _cl2.length; _q++) {
        var _m = String(_cl2[_q]).match(/ret=(.*)$/);
        if (!_m) continue;
        var _rv = _m[1];
        if (_rv === 'true' || _rv === 'undef') continue;
        if (!_uniq[_rv]) { _uniq[_rv] = 0; _order.push(_rv); }
        _uniq[_rv]++;
      }
      var _seq = _cl2.map(function(x){ var m=String(x).match(/ret=([\s\S]*)$/); return m ? m[1] : ''; });
      console.log('H 返回序列 全长度=' + _seq.length);
      console.log('H 序列[130..300]: ' + JSON.stringify(_seq.slice(130, 300)));
      console.log('H 序列[300..470]: ' + JSON.stringify(_seq.slice(300, 470)));
      var _longs = _order.filter(function(x){ return String(x).length > 60; });
      console.log('H 长返回值（>60 字符，共 ' + _longs.length + ' 种）:');
      for (var _y = 0; _y < _longs.length && _y < 20; _y++) console.log('   ' + JSON.stringify(_longs[_y]));
      console.log('H 的非布尔返回值（去重，共 ' + _order.length + ' 种）:');
      for (var _z = 0; _z < _order.length && _z < 60; _z++) console.log('   [' + _uniq[_order[_z]] + 'x] ' + JSON.stringify(_order[_z]));
    } catch (eHR) {}
    try { var _cl = vm.runInContext('globalThis.__CHRLOG||[]', ctx); console.log('CHRES=' + JSON.stringify(vm.runInContext('globalThis.__CHRES||null', ctx)) + ' n=' + _cl.length + ' head=' + JSON.stringify(_cl.slice(0,12)) + ' tail=' + JSON.stringify(_cl.slice(-6))); } catch(eCR){}
    try { console.log('CHOOK2: ' + JSON.stringify(vm.runInContext('globalThis.__CHOOK2_RES||null', ctx)) + ' log=' + JSON.stringify(vm.runInContext('globalThis.__CHLOG2||[]', ctx)).slice(0,600)); } catch(eCH2){}
    try {
      var _zl = vm.runInContext('globalThis.__ZLOG||[]', ctx);
      var _ck4 = vm.runInContext('globalThis.__CKLOG||[]', ctx);
      for (var _i9 = 0; _i9 < _ck4.length; _i9++) {
        if (_ck4[_i9] && _ck4[_i9].full) console.log('CK#' + _i9 + ' = ' + _ck4[_i9].full);
      }
      console.log('CLRES: ' + vm.runInContext('globalThis.__CLRES||null', ctx));
      console.log('ZLOG n=' + _zl.length);
      var _uniq=[]; var _s2={};
      for (var _zi=0;_zi<_zl.length;_zi++){ var _k2=String(_zl[_zi]); if(!_s2[_k2]){_s2[_k2]=1; if(_uniq.length<40)_uniq.push(_k2);} }
      console.log('ZLOG 去重(' + _uniq.length + '): ' + JSON.stringify(_uniq.slice(0,40)));
    } catch(eZ2) {}
    try { console.log('MWDIAG: ' + JSON.stringify(vm.runInContext('globalThis.__MWDIAG||[]', ctx)).slice(0,900)); } catch(eMD){}
    try { console.log('MWLOG: ' + JSON.stringify(vm.runInContext('globalThis.__MWLOG||[]', ctx)) + ' err=' + JSON.stringify(vm.runInContext('globalThis.__MWERR||null', ctx))); } catch(eMW2){}
    try { console.log('ZHD: hook=' + vm.runInContext('globalThis.__ZHDHOOK||0', ctx) + ' n=' + vm.runInContext('globalThis.__ZHD||0', ctx) + ' err=' + JSON.stringify(vm.runInContext('globalThis.__ZHDERR||globalThis.__ZHDERR2||null', ctx)) + ' log=' + JSON.stringify(vm.runInContext('globalThis.__ZHDLOG||[]', ctx)).slice(0,300)); } catch(eZ){}
    try { console.log('QHRES: ' + JSON.stringify(vm.runInContext('globalThis.__QHRES||null', ctx))); } catch(eQ){}
    const hc = vm.runInContext('globalThis.__HOSTCALLS', ctx);
    console.log('宿主调用总数:', hc.length);
    try { require('fs').writeFileSync('.probe/zsec/hostcalls.json', JSON.stringify(hc)); console.log('已写 hostcalls.json n=' + hc.length); } catch(eDump) { console.log('dump fail', eDump.message); }
    try { require('fs').writeFileSync('.probe/zsec/bridge.json', JSON.stringify(vm.runInContext('globalThis.__BRIDGE||[]', ctx))); console.log('已写 bridge.json'); } catch(eDump2) {}
    console.log('宿主调用全序列:', JSON.stringify(hc.map(function(x){
      return x.name.replace('syscall/js.','') + (x.name.indexOf('copyBytesToGo')>=0 ? ('(' + String(x.a).split(',')[1] + ')') : '');
    })).slice(0, 6000));
    console.log('宿主调用尾 30:', JSON.stringify(hc.slice(-30)));
    const gk = hc.filter(function(x){ return x && x.getKey; }).map(function(x){ return x.getKey; });
    console.log('valueGet 读取的属性名序列:', JSON.stringify(gk.slice(-40)));
    console.log('我的全序列带键:', JSON.stringify(hc.map(function(x){
      var n=x.name.replace('syscall/js.','');
      var b=x.name.indexOf('copyBytesToGo')>=0 ? String(x.a).split(',')[1] : n;
      return b + (x.getKey ? (':' + x.getKey) : '');
    })).slice(0, 8000));
    console.log('我的前 20 次 valueGet:', JSON.stringify(gk.slice(0, 20)));
    console.log('我的前 20 条宿主调用:', JSON.stringify(hc.slice(0, 20).map(function(x){
      return x.name.replace('syscall/js.','') + (x.name.indexOf('copyBytesToGo')>=0 ? ('(' + String(x.a).split(',')[1] + ')' + (x.getKey ? (':' + x.getKey) : '')) : '');
    })));
    const thr = hc.filter(function(x){ return x && x.threw; });
    console.log('抛错的宿主调用:', JSON.stringify(thr.slice(-5)));
  } catch (e) { console.log('读宿主调用失败:', String(e.message).slice(0,120)); }
  try { const vt = vm.runInContext('globalThis.__VT', ctx);
        console.log('VM 指令轨迹: n=' + vt.length + ' 头=' + JSON.stringify(vt.slice(0, 30)) + ' 尾=' + JSON.stringify(vt.slice(-25))); } catch (e) {}
  try { console.log('build 期间的 eval:', JSON.stringify(vm.runInContext('globalThis.__EV', ctx)).slice(0, 900)); } catch (e) {}
  try {
    const big = vm.runInContext('globalThis.__EVBIG || ""', ctx);
    if (big) { require('fs').writeFileSync('.probe/zsec/eval_arg_big.js', big, 'utf8'); console.log('已存 eval_arg_big.js len=' + big.length); }
    const mid = vm.runInContext('globalThis.__EVMID || ""', ctx);
    if (mid) { require('fs').writeFileSync('.probe/zsec/eval_arg_mid.js', mid, 'utf8'); console.log('已存 eval_arg_mid.js len=' + mid.length); }
  } catch (e) { console.log('存 eval 参数失败:', String(e.message).slice(0,80)); }
  try {
    const q = vm.runInContext('(window.__c && typeof window.__c.qh === "string") ? window.__c.qh : ""', ctx);
    require('fs').writeFileSync('.probe/zsec/qh_mine_raw.txt', q, 'utf8');
    const a3 = vm.runInContext('(window.__b && typeof window.__b.a3 === "number") ? window.__b.a3 : -1', ctx);
    const z = vm.runInContext('(window.__b && typeof window.__b.zh === "string") ? window.__b.zh : ""', ctx);
    require('fs').writeFileSync('.probe/zsec/zh_mine_raw.txt', z, 'utf8');
    console.log('已存 qh_mine_raw(len=' + q.length + ') zh_mine_raw(len=' + z.length + ') a3=' + a3);
  } catch (e) { console.log('存 qh/zh 失败:', String(e.message).slice(0,80)); }
  /* ZSE_GUARDPROBE */
  try {
    const _out = vm.runInContext('(function(){ var CH = ' + "[[\"inner locProxy.host\", \"typeof new Proxy(location,{get:function(a,b){return b in a ? a[b] : undefined;}}).host === \\\"undefined\\\"\"], [\"inner locProxy.hostname\", \"typeof new Proxy(location,{get:function(a,b){return b in a ? a[b] : undefined;}}).hostname === \\\"undefined\\\"\"], [\"inner window.devicePixelRatio\", \"typeof window.devicePixelRatio === \\\"undefined\\\"\"], [\"inner window.blur\", \"typeof window.blur === \\\"undefined\\\"\"], [\"inner window.blur native\", \"String(window.blur).indexOf(\\\"native\\\") === -1\"], [\"inner window.self\", \"typeof window.self === \\\"undefined\\\"\"], [\"inner history.pushState\", \"typeof history.pushState !== \\\"function\\\"\"], [\"inner window.XMLDocument native\", \"String(window.XMLDocument).indexOf(\\\"native\\\") === -1\"], [\"inner window.find\", \"typeof window.find === \\\"undefined\\\"\"], [\"inner window.globalThis\", \"typeof window.globalThis === \\\"undefined\\\"\"], [\"inner window.name\", \"typeof window.name === \\\"undefined\\\"\"], [\"inner history.replaceState\", \"typeof history.replaceState !== \\\"function\\\"\"], [\"payload locProxy.toString native\", \"String(new Proxy(location,{get:function(a,b){return b in a ? a[b] : undefined;}}).toString).indexOf(\\\"native\\\") === -1\"], [\"payload indexOf top\", \"String(window.toString()).indexOf(\\\"top\\\") === -1\"], [\"payload indexOf customElements\", \"String(window.toString()).indexOf(\\\"customElements\\\") === -1\"], [\"payload indexOf name\", \"String(window.toString()).indexOf(\\\"name\\\") === -1\"], [\"payload indexOf self\", \"String(window.toString()).indexOf(\\\"self\\\") === -1\"], [\"payload indexOf print\", \"String(window.toString()).indexOf(\\\"print\\\") === -1\"], [\"payload indexOf open\", \"String(window.toString()).indexOf(\\\"open\\\") === -1\"], [\"payload indexOf _encrypt\", \"String(window.toString()).indexOf(\\\"_encrypt\\\") === -1\"], [\"payload indexOf __g\", \"String(window.toString()).indexOf(\\\"__g\\\") === -1\"], [\"payload doc.URL zhihu\", \"String(document.URL).indexOf(\\\"zhihu\\\") === -1\"], [\"payload typeof document.all\", \"typeof document.all !== \\\"undefined\\\"\"], [\"payload typeof document.all.len\", \"typeof document.all.length !== \\\"number\\\"\"], [\"payload docEl HTMLHtmlElement\", \"String(document.documentElement).indexOf(\\\"HTMLHtmlElement\\\") === -1\"], [\"payload gEBTN Collection\", \"String(document.getElementsByTagName(\\\"script\\\")).indexOf(\\\"Collection\\\") === -1\"], [\"payload baseURI zhihu\", \"String(document.baseURI).indexOf(\\\"zhihu\\\") === -1\"], [\"payload body HTMLBodyElement\", \"String(document.body).indexOf(\\\"HTMLBodyElement\\\") === -1\"], [\"payload ctx2d CanvasRenderingContext2D\", \"String(document.createElement(\\\"canvas\\\").getContext(\\\"2d\\\")).indexOf(\\\"CanvasRenderingContext2D\\\") === -1\"], [\"payload canvas.outerHTML\", \"String(document.createElement(\\\"canvas\\\").outerHTML).indexOf(\\\"canvas\\\") === -1\"], [\"payload typeof document.baseURI\", \"typeof document.baseURI === \\\"undefined\\\"\"], [\"payload typeof document.charset\", \"typeof document.charset === \\\"undefined\\\"\"], [\"payload typeof document.body\", \"typeof document.body === \\\"undefined\\\"\"], [\"payload typeof localStorage.setItem\", \"typeof localStorage.setItem === \\\"undefined\\\"\"], [\"payload typeof Document.all\", \"typeof Document.all === \\\"undefined\\\"\"], [\"payload typeof window.buffer\", \"typeof window.buffer === \\\"undefined\\\"\"], [\"payload typeof window.emit\", \"typeof window.emit === \\\"undefined\\\"\"], [\"payload typeof window.URL\", \"typeof window.URL === \\\"undefined\\\"\"], [\"payload typeof window.stop\", \"typeof window.stop === \\\"undefined\\\"\"], [\"payload typeof screen.availLeft\", \"typeof screen.availLeft === \\\"undefined\\\"\"], [\"payload typeof screen.availHeight\", \"typeof screen.availHeight === \\\"undefined\\\"\"], [\"payload typeof screen.colorDepth\", \"typeof screen.colorDepth === \\\"undefined\\\"\"], [\"payload typeof screen.pixelDepth\", \"typeof screen.pixelDepth === \\\"undefined\\\"\"], [\"payload typeof window.callPhantom\", \"typeof window[\\\"callPhantom\\\"] === \\\"undefined\\\"\"], [\"payload typeof window.__phantomas\", \"typeof window[\\\"__phantomas\\\"] === \\\"undefined\\\"\"], [\"payload typeof window._phantom\", \"typeof window[\\\"_phantom\\\"] === \\\"undefined\\\"\"], [\"payload typeof window.WebPage\", \"typeof window[\\\"WebPage\\\"] === \\\"undefined\\\"\"], [\"payload typeof window.fxdriver_id\", \"typeof window[\\\"fxdriver_id\\\"] === \\\"undefined\\\"\"], [\"payload typeof window.__fxdriver_unwrapped\", \"typeof window[\\\"__fxdriver_unwrapped\\\"] === \\\"undefined\\\"\"], [\"payload typeof window.ubot\", \"typeof window[\\\"ubot\\\"] === \\\"undefined\\\"\"], [\"payload typeof window.CasperError\", \"typeof window[\\\"CasperError\\\"] === \\\"undefined\\\"\"], [\"payload typeof window.casper\", \"typeof window[\\\"casper\\\"] === \\\"undefined\\\"\"], [\"payload typeof window.patchRequire\", \"typeof window[\\\"patchRequire\\\"] === \\\"undefined\\\"\"], [\"payload typeof window.$cdc_asdjflasutopfhvcZLmcfl_\", \"typeof window[\\\"$cdc_asdjflasutopfhvcZLmcfl_\\\"] === \\\"undefined\\\"\"], [\"payload typeof window.webdriver\", \"typeof window[\\\"webdriver\\\"] === \\\"undefined\\\"\"], [\"payload typeof window.__webdriver_script_fn\", \"typeof window[\\\"__webdriver_script_fn\\\"] === \\\"undefined\\\"\"], [\"payload typeof window._resourceLoader\", \"typeof window[\\\"_resourceLoader\\\"] === \\\"undefined\\\"\"], [\"payload typeof window._sessionHistory\", \"typeof window[\\\"_sessionHistory\\\"] === \\\"undefined\\\"\"], [\"payload typeof window._virtualConsole\", \"typeof window[\\\"_virtualConsole\\\"] === \\\"undefined\\\"\"]]" + '; var hits = []; for (var i=0;i<CH.length;i++){ var r; try { r = eval(CH[i][1]); } catch(e){ r = "THROW:" + e.message; } if (r === true) hits.push(CH[i][0]); } return JSON.stringify({total: CH.length, hits: hits}); })()', ctx);
    const _o = JSON.parse(_out);
    console.log('守卫求值（运行上下文）: 共 ' + _o.total + ' 条，命中 ' + _o.hits.length + ' 条');
    _o.hits.forEach(function(h){ console.log('   [命中] ' + h); });
  } catch (e) { console.log('守卫求值失败:', String(e.message).slice(0,140)); }
  /* ZSE_GUARDPROBE2 */
  try {
    const _o2 = JSON.parse(vm.runInContext('(function(){ var CH = ' + "[[\"payload typeof canvas.style\", \"typeof document.createElement(\\\"canvas\\\").style === \\\"undefined\\\"\"], [\"payload typeof canvas.width\", \"typeof document.createElement(\\\"canvas\\\").width === \\\"undefined\\\"\"], [\"payload typeof canvas.height\", \"typeof document.createElement(\\\"canvas\\\").height === \\\"undefined\\\"\"], [\"payload typeof canvas.getContext\", \"typeof document.createElement(\\\"canvas\\\").getContext === \\\"undefined\\\"\"], [\"payload canvas.outerHTML idx\", \"String(document.createElement(\\\"canvas\\\").outerHTML).indexOf(\\\"canvas\\\") === -1\"], [\"payload createElement.bind script\", \"typeof document.createElement.bind(\\\"script\\\") === \\\"undefined\\\"\"], [\"payload typeof document.all.len\", \"typeof document.all.length !== \\\"number\\\"\"], [\"payload document.all() typeof\", \"typeof (new Function(\\\"try{window={};document={};return document.all()}catch(_){}\\\"))() !== \\\"object\\\"\"], [\"payload Document.all typeof\", \"typeof Document.all === \\\"undefined\\\"\"], [\"payload typeof screen.availLeft\", \"typeof screen.availLeft === \\\"undefined\\\"\"], [\"payload typeof screen.availTop\", \"typeof screen.availTop === \\\"undefined\\\"\"], [\"payload typeof screen.availWidth\", \"typeof screen.availWidth === \\\"undefined\\\"\"], [\"payload typeof screen.availHeight\", \"typeof screen.availHeight === \\\"undefined\\\"\"], [\"payload typeof screen.colorDepth\", \"typeof screen.colorDepth === \\\"undefined\\\"\"], [\"payload typeof screen.pixelDepth\", \"typeof screen.pixelDepth === \\\"undefined\\\"\"], [\"inner typeof xhr.LOADING\", \"typeof new XMLHttpRequest().LOADING === \\\"undefined\\\"\"], [\"inner typeof xhr.DONE\", \"typeof new XMLHttpRequest().DONE === \\\"undefined\\\"\"], [\"inner typeof xhr.OPENED\", \"typeof new XMLHttpRequest().OPENED === \\\"undefined\\\"\"], [\"inner typeof xhr.UNSENT\", \"typeof new XMLHttpRequest().UNSENT === \\\"undefined\\\"\"], [\"inner typeof xhr.abort\", \"typeof new XMLHttpRequest().abort === \\\"undefined\\\"\"], [\"inner typeof xhr.open\", \"typeof new XMLHttpRequest().open === \\\"undefined\\\"\"], [\"inner typeof xhr.send\", \"typeof new XMLHttpRequest().send === \\\"undefined\\\"\"], [\"inner typeof xhr.upload\", \"typeof new XMLHttpRequest().upload === \\\"undefined\\\"\"], [\"inner typeof xhr.responseURL\", \"typeof new XMLHttpRequest().responseURL === \\\"undefined\\\"\"], [\"inner typeof xhr.onreadystatechange\", \"typeof new XMLHttpRequest().onreadystatechange === \\\"undefined\\\"\"], [\"inner typeof xhr.status\", \"typeof new XMLHttpRequest().status === \\\"undefined\\\"\"], [\"inner typeof xhr.onabort\", \"typeof new XMLHttpRequest().onabort === \\\"undefined\\\"\"], [\"inner typeof xhr.responseXML\", \"typeof new XMLHttpRequest().responseXML === \\\"undefined\\\"\"], [\"cvm typeof iter.root\", \"typeof document.createNodeIterator(document.body).root === \\\"undefined\\\"\"], [\"cvm typeof iter.filter\", \"typeof document.createNodeIterator(document.body).filter === \\\"undefined\\\"\"], [\"cvm typeof iter.whatToShow\", \"typeof document.createNodeIterator(document.body).whatToShow === \\\"undefined\\\"\"], [\"cvm typeof iter.detach\", \"typeof document.createNodeIterator(document.body).detach === \\\"undefined\\\"\"], [\"cvm typeof rng.body\", \"typeof document.createRange().body === \\\"undefined\\\"\"], [\"cvm typeof rng.root\", \"typeof document.createRange().root === \\\"undefined\\\"\"], [\"cvm typeof rng.filter\", \"typeof document.createRange().filter === \\\"undefined\\\"\"], [\"cvm typeof rng.detach\", \"typeof document.createRange().detach === \\\"undefined\\\"\"], [\"cvm typeof rng.whatToShow\", \"typeof document.createRange().whatToShow === \\\"undefined\\\"\"], [\"cvm typeof rng.cloneRange\", \"typeof document.createRange().cloneRange === \\\"undefined\\\"\"], [\"cvm typeof rng.cloneContents\", \"typeof document.createRange().cloneContents === \\\"undefined\\\"\"], [\"cvm typeof rng.collapse\", \"typeof document.createRange().collapse === \\\"undefined\\\"\"], [\"cvm typeof rng.collapsed\", \"typeof document.createRange().collapsed === \\\"undefined\\\"\"], [\"cvm typeof rng.commonAncestorContainer\", \"typeof document.createRange().commonAncestorContainer === \\\"undefined\\\"\"], [\"cvm typeof rng.compareBoundaryPoints\", \"typeof document.createRange().compareBoundaryPoints === \\\"undefined\\\"\"], [\"cvm typeof rng.comparePoint\", \"typeof document.createRange().comparePoint === \\\"undefined\\\"\"], [\"cvm typeof rng.endOffset\", \"typeof document.createRange().endOffset === \\\"undefined\\\"\"], [\"cvm typeof rng.extractContents\", \"typeof document.createRange().extractContents === \\\"undefined\\\"\"], [\"cvm typeof rng.getBoundingClientRect\", \"typeof document.createRange().getBoundingClientRect === \\\"undefined\\\"\"], [\"cvm typeof rng.getClientRects\", \"typeof document.createRange().getClientRects === \\\"undefined\\\"\"], [\"cvm typeof rng.insertNode\", \"typeof document.createRange().insertNode === \\\"undefined\\\"\"], [\"cvm typeof rng.intersectsNode\", \"typeof document.createRange().intersectsNode === \\\"undefined\\\"\"], [\"cvm typeof rng.isPointInRange\", \"typeof document.createRange().isPointInRange === \\\"undefined\\\"\"], [\"cvm typeof rng.selectNode\", \"typeof document.createRange().selectNode === \\\"undefined\\\"\"], [\"cvm typeof rng.selectNodeContents\", \"typeof document.createRange().selectNodeContents === \\\"undefined\\\"\"], [\"cvm typeof rng.setEnd\", \"typeof document.createRange().setEnd === \\\"undefined\\\"\"], [\"cvm typeof rng.setEndAfter\", \"typeof document.createRange().setEndAfter === \\\"undefined\\\"\"], [\"cvm typeof rng.setEndBefore\", \"typeof document.createRange().setEndBefore === \\\"undefined\\\"\"], [\"cvm typeof rng.setStart\", \"typeof document.createRange().setStart === \\\"undefined\\\"\"], [\"cvm typeof rng.setStartAfter\", \"typeof document.createRange().setStartAfter === \\\"undefined\\\"\"], [\"cvm typeof rng.setStartBefore\", \"typeof document.createRange().setStartBefore === \\\"undefined\\\"\"], [\"cvm typeof rng.startContainer\", \"typeof document.createRange().startContainer === \\\"undefined\\\"\"], [\"cvm typeof rng.length\", \"typeof document.createRange().length === \\\"undefined\\\"\"]]" + '; var hits = []; for (var i=0;i<CH.length;i++){ var r; try { r = eval(CH[i][1]); } catch(e){ r = "THROW:" + e.message; } if (r === true) hits.push(CH[i][0]); } return JSON.stringify({total: CH.length, hits: hits}); })()', ctx));
    console.log('守卫求值#2（运行上下文）: 共 ' + _o2.total + ' 条，命中 ' + _o2.hits.length + ' 条');
    _o2.hits.forEach(function(h){ console.log('   [命中2] ' + h); });
  } catch (e) { console.log('守卫求值#2 失败:', String(e.message).slice(0,140)); }
  /* ZSE_HEXHUNT */
  try {
    var _hxsrc = "(function(){ var TARGET = '200010008000'; var out = []; var seen = new Set(); function walk(o, path, d) { if (d > 3 || out.length > 80) return; if (o === null || o === undefined) return; var t = typeof o; if (t === 'string') { if (o.indexOf(TARGET) >= 0) out.push(path + ' TARGET@' + o.indexOf(TARGET) + ' [' + o.length + '] ' + o.slice(0, 80)); else if (/^[0-9a-f]{40,64}$/.test(o)) out.push(path + ' HEXLIKE [' + o.length + '] ' + o.slice(0, 70)); return; } if (t !== 'object' && t !== 'function') return; if (seen.has(o)) return; seen.add(o); var ks; try { ks = Object.getOwnPropertyNames(o); } catch(e) { return; } for (var i = 0; i < ks.length && i < 60; i++) { var k = ks[i]; if (k === 'window' || k === 'document' || k === 'self' || k === 'globalThis' || k === 'top' || k === 'parent' || k === 'frames' || k === 'location') continue; var v; try { v = o[k]; } catch(e) { continue; } walk(v, path + '.' + k, d + 1); } } walk(window, 'window', 0); walk(window.__b, '__b', 0); walk(window.__c, '__c', 0); walk(window.__g, '__g', 0); var zh = (window.__b && typeof window.__b.zh === 'string') ? window.__b.zh : ''; var qh = (window.__c && typeof window.__c.qh === 'string') ? window.__c.qh : ''; out.push('ZH len=' + zh.length + ' TARGET@' + zh.indexOf(TARGET)); out.push('QH len=' + qh.length + ' TARGET@' + qh.indexOf(TARGET)); out.push('ZH40=' + zh.slice(0,40)); out.push('QH40=' + qh.slice(0,40)); return JSON.stringify(out); })()";
    console.log('HEXHUNT: ' + vm.runInContext(_hxsrc, ctx));
  } catch(eHX) { console.log('HEXHUNT 失败:', String(eHX.message).slice(0,140)); }
  try {
    var _al = vm.runInContext('globalThis.__ALLLOG||[]', ctx);
    console.log('ALLLOG n=' + _al.length);
    for (var _ai = 0; _ai < _al.length; _ai++) console.log('   AL[' + _ai + '] ' + _al[_ai]);
  } catch(eAL2){ console.log('ALLLOG 读失败', String(eAL2.message).slice(0,80)); }
  try {
    var _fccAll = vm.runInContext('(globalThis.__FCC && globalThis.__FCC.all) || ""', ctx);
    console.log('FCC len=' + _fccAll.length);
    var _idx = _fccAll.indexOf('9800');
    console.log('FCC 9800 首现 idx=' + _idx + ' ctx=' + JSON.stringify(_fccAll.slice(Math.max(0, _idx - 60), _idx + 60)));
    var _idx2 = _fccAll.indexOf('8800');
    console.log('FCC 8800 首现 idx=' + _idx2 + ' ctx=' + JSON.stringify(_fccAll.slice(Math.max(0, _idx2 - 60), _idx2 + 60)));
    require('fs').writeFileSync('.probe/zsec/fcc_all.txt', _fccAll, 'utf8');
    var _zh = vm.runInContext('(window.__b && typeof window.__b.zh === "string") ? window.__b.zh : ""', ctx);
    var _qh = vm.runInContext('(window.__c && typeof window.__c.qh === "string") ? window.__c.qh : ""', ctx);
    var _a3 = vm.runInContext('(window.__b && typeof window.__b.a3 === "number") ? window.__b.a3 : -1', ctx);
    require('fs').writeFileSync('.probe/zsec/zh_full.txt', _zh, 'utf8');
    require('fs').writeFileSync('.probe/zsec/qh_full.txt', _qh, 'utf8');
    console.log('zh len=' + _zh.length + ' qh len=' + _qh.length + ' a3=' + _a3);
    console.log('zh 里 2000100080004030 @' + _zh.indexOf('2000100080004030'));
  } catch(eFCC2) { console.log('FCC dump 失败: ' + String(eFCC2.message).slice(0,120)); }
  try {
    var _sq = vm.runInContext('globalThis.__SEQ16||[]', ctx);
    console.log('SEQ16 n=' + _sq.length + ' : ' + _sq.join(' '));
  } catch(eSQ2) { console.log('SEQ16 读失败', String(eSQ2.message).slice(0,80)); }
  try {
    console.log('FLIPNLOG: ' + JSON.stringify(vm.runInContext('globalThis.__FLIPNLOG||[]', ctx)));
  } catch(eFN2){}
  try {
    var _ww = vm.runInContext('globalThis.__WW||null', ctx);
    console.log('WW n=' + (_ww ? _ww.n : -1));
    if (_ww && _ww.items) {
      console.log('   WW 前 120: ' + _ww.items.slice(0, 120).join(' '));
      require('fs').writeFileSync('.probe/zsec/ww_items.txt', _ww.items.join(String.fromCharCode(10)), 'utf8');
    }
  } catch(eWW2) { console.log('WW dump 失败: ' + String(eWW2.message).slice(0,120)); }
  try {
    var _h2 = vm.runInContext('globalThis.__CHLOG2||[]', ctx);
    console.log('CHLOG2 n=' + _h2.length);
    var _hits = [];
    for (var _hi = 0; _hi < _h2.length; _hi++) {
      var _rv = _h2[_hi].ret;
      if (typeof _rv === 'string' && (_rv.indexOf('9800') >= 0 || _rv.indexOf('2000100080004030') >= 0 || _rv.indexOf('8000') >= 0)) _hits.push(_hi + ' pc=' + _h2[_hi].pc + ' ' + _rv.slice(0, 80));
    }
    console.log('CHLOG2 命中(' + _hits.length + '): ' + JSON.stringify(_hits.slice(0, 40)));
    require('fs').writeFileSync('.probe/zsec/chlog2b.json', JSON.stringify(_h2), 'utf8');
    var _uniq = {}; for (var _ui = 0; _ui < _h2.length; _ui++) { var _rr = _h2[_ui].ret; var _kk = (typeof _rr === 'string' ? _rr : String(_rr)); _uniq[_kk] = (_uniq[_kk] || 0) + 1; }
    var _ks = Object.keys(_uniq);
    console.log('H 返回值共 ' + _ks.length + ' 种');
    for (var _kj = 0; _kj < _ks.length; _kj++) console.log('   H[' + _kj + '] x' + _uniq[_ks[_kj]] + '  ' + JSON.stringify(_ks[_kj]).slice(0, 100));
  } catch(eH2) { console.log('CHLOG2 dump 失败: ' + String(eH2.message).slice(0,120)); }
  try {
    var _evr = vm.runInContext('globalThis.__EVR||[]', ctx);
    console.log('EVR n=' + _evr.length);
    for (var _ei = 0; _ei < _evr.length; _ei++) {
      var _e = _evr[_ei];
      if (_e.len < 400) console.log('   EVR[' + _ei + '] len=' + _e.len + ' ret=' + JSON.stringify(_e.ret).slice(0,150) + ' src=' + JSON.stringify(_e.head).slice(0,110));
    }
  } catch(eEVR) { console.log('EVR dump 失败: ' + String(eEVR.message).slice(0,120)); }
  try {
    var PROBES = [
      ["process", "typeof process !== 'undefined'"],
      ["require", "typeof require !== 'undefined'"],
      ["module", "typeof module !== 'undefined'"],
      ["exports", "typeof exports !== 'undefined'"],
      ["__dirname", "typeof __dirname !== 'undefined'"],
      ["__filename", "typeof __filename !== 'undefined'"],
      ["window._parent", "typeof window._parent !== 'undefined'"],
      ["window._origin", "typeof window._origin !== 'undefined'"],
      ["window._document", "typeof window._document !== 'undefined'"],
      ["window._virtualConsole", "typeof window._virtualConsole !== 'undefined'"],
      ["ws", "typeof ws !== 'undefined' && ws.toString().indexOf('ocke') !== -1"],
      ["JSDOM", "typeof JSDOM !== 'undefined'"],
      ["Hlclient", "typeof Hlclient !== 'undefined'"],
      ["v_saf", "typeof v_saf !== 'undefined'"],
      ["window.constructor.toString()", "String(window.constructor.toString()).slice(0,80)"],
      ["global", "typeof global !== 'undefined'"],
      ["document.createElement('div')", "String(document.createElement('div')).slice(0,60)"],
      ["document.createElement('canvas')", "String(document.createElement('canvas')).slice(0,60)"],
      ["navigator.userAgent", "String(navigator.userAgent).slice(0,60)"]
    ];
    for (var _pi = 0; _pi < PROBES.length; _pi++) {
      var _r;
      try { _r = vm.runInContext('(' + PROBES[_pi][1] + ')', ctx); } catch(e) { _r = 'THROW:' + String(e.message).slice(0,60); }
      console.log('   GO-PROBE ' + PROBES[_pi][0] + ' = ' + JSON.stringify(_r));
    }
  } catch(eGP) { console.log('GO-PROBE 失败: ' + String(eGP.message).slice(0,120)); }
  try {
    var _segsrc = "(function(){ var out=[]; var seen=new Set(); function walk(o,path,d){ if(d>3||out.length>120) return; if(o===null||o===undefined) return; var t=typeof o; if(t==='string'){ var hasSep=false; for(var i=0;i<o.length;i++){var c=o.charCodeAt(i); if(c>=0x2000&&c<=0x2010){hasSep=true;break;}} if(hasSep) out.push(path+' len='+o.length+' seps='+JSON.stringify(o.split('').map(function(ch){return ch.charCodeAt(0)>=0x2000&&ch.charCodeAt(0)<=0x2010?ch.charCodeAt(0):null;}).map(function(x,i){return x;}).filter(function(x){return x!==null;}))); return; } if(t!=='object'&&t!=='function') return; if(seen.has(o)) return; seen.add(o); var ks; try{ks=Object.getOwnPropertyNames(o);}catch(e){return;} for(var i=0;i<ks.length&&i<80;i++){var k=ks[i]; if(k==='window'||k==='document'||k==='self'||k==='globalThis'||k==='top'||k==='parent'||k==='frames'||k==='location') continue; var v; try{v=o[k];}catch(e){continue;} walk(v,path+'.'+k,d+1);} } walk(window,'window',0); walk(window.__b,'__b',0); walk(window.__c,'__c',0); walk(window.__g,'__g',0); return JSON.stringify(out); })()";
    console.log('SEGSRC: ' + vm.runInContext(_segsrc, ctx));
    var _gp = vm.runInContext("(function(){var o={};['__b','__c','__g'].forEach(function(n){var v=window[n]; if(!v){o[n]='none';return;} var d={}; Object.getOwnPropertyNames(v).forEach(function(k){var x;try{x=v[k];}catch(e){return;} if(typeof x==='string') d[k]='s'+x.length; else if(typeof x==='number') d[k]='n:'+x; }); o[n]=d;}); return JSON.stringify(o);})()", ctx);
    console.log('GPROPS: ' + _gp);
  } catch(eSS) { console.log('SEGSRC 失败: ' + String(eSS.message).slice(0,140)); }
  try {
    var _gsrc = "(function(){var out=[];function scan(arr,nm){if(!arr)return;for(var i=0;i<arr.length;i++){var v=arr[i];if(typeof v==='string'&&v.length>=4&&v.length<=40)out.push(nm+'['+i+'] s'+v.length+' cp='+Array.prototype.slice.call(v,0,24).map(function(c){return c.charCodeAt(0).toString(16)}).join(','));else if(typeof v==='number')out.push(nm+'['+i+'] n=0x'+(v>>>0).toString(16));}}scan(window.__c&&window.__c.G,'__c.G');scan(window.__b&&window.__b.l,'__b.l');var D=window.__g&&window.__g.D;if(D)for(var i=0;i<D.length;i++){var v=D[i];if(typeof v==='string')out.push('__g.D['+i+'] s'+v.length);}return JSON.stringify(out);})()";
    var _g = vm.runInContext(_gsrc, ctx);
    console.log('GREGS: ' + _g);
  } catch(eG) { console.log('GREGS 失败: ' + String(eG.message).slice(0,140)); }
  try {
    var _wp = vm.runInContext('globalThis.__WP||null', ctx);
    if (_wp) {
      console.log('WP.te n=' + _wp.te.length);
      _wp.te.slice(0, 20).forEach(function (x, i) { console.log('   TE[' + i + '] ' + JSON.stringify(x).slice(0, 160)); });
      console.log('WP.u8set n=' + _wp.u8set.length);
      _wp.u8set.slice(0, 60).forEach(function (x, i) { console.log('   U8[' + i + '] ' + x.slice(0, 160)); });
      console.log('WP.fcc(argc>=8) n=' + _wp.fcc.length);
      _wp.fcc.slice(0, 10).forEach(function (x, i) { console.log('   FC[' + i + '] ' + x.slice(0, 200)); });
    } else { console.log('WP 未装载'); }
  } catch(eWP2) { console.log('WP dump 失败: ' + String(eWP2.message).slice(0,120)); }
  try {
    var _pg = vm.runInContext('globalThis.__PGER||[]', ctx);
    console.log('PGER n=' + _pg.length);
    var _u = {}; for (var _i2 = 0; _i2 < _pg.length; _i2++) { var _k2 = String(_pg[_i2].ret); _u[_k2] = (_u[_k2] || 0) + 1; }
    var _ks2 = Object.keys(_u);
    console.log('PGER 不同返回 ' + _ks2.length + ' 种');
    _ks2.sort(function(a,b){return _u[b]-_u[a];});
    for (var _j2 = 0; _j2 < _ks2.length && _j2 < 80; _j2++) console.log('   R[' + _j2 + '] x' + _u[_ks2[_j2]] + '  ' + JSON.stringify(_ks2[_j2]).slice(0, 110));
    require('fs').writeFileSync('.probe/zsec/pger.json', JSON.stringify(_pg), 'utf8');
  } catch(ePG) { console.log('PGER dump 失败: ' + String(ePG.message).slice(0,120)); }
  try {
    var _nt = vm.runInContext("(function(){var o={};['setTimeout','setInterval','requestAnimationFrame','window.stop','fetch'].forEach(function(n){try{var f=window[n];o[n]=(typeof f)+'|'+String(f).slice(0,60);}catch(e){o[n]='ERR';}});try{o['Function.prototype.constructor']=String(Function.prototype.constructor).slice(0,60);}catch(e){}return JSON.stringify(o);})()", ctx);
    console.log('NATIVE 形态: ' + _nt);
  } catch(eNT){ console.log('NATIVE 探针失败: ' + String(eNT.message).slice(0,100)); }
  try {
    var _gv = vm.runInContext("(function(){var o={};function s(n,f){try{o[n]=f();}catch(e){o[n]='THROW:'+e.message.slice(0,40);}}s('String(Go)',function(){return String(window.Go).slice(0,70)});s('String(VM)',function(){return String(window.VM).slice(0,70)});s('String(CVM)',function(){return String(window.CVM).slice(0,70)});s('String(BVM)',function(){return String(window.BVM).slice(0,70)});s('String(Function)',function(){return String(Function).slice(0,70)});s('String(Object)',function(){return String(Object).slice(0,70)});s('doc.all',function(){return typeof document.all+' | '+String(document.all).slice(0,50)});s('doc.all.toString()',function(){return document.all.toString().slice(0,60)});s('doc.all.tagName',function(){return String(document.all.tagName)});s('createElement(div)',function(){return String(document.createElement('div')).slice(0,60)});s('createElement(canvas)',function(){return String(document.createElement('canvas')).slice(0,60)});s('gEBTN(script)',function(){return String(document.getElementsByTagName('script')).slice(0,60)});s('String(window)',function(){var t=String(window);return 'len='+t.length+' has_top='+(t.indexOf('top')>=0)+' has_name='+(t.indexOf('name')>=0)+' has_self='+(t.indexOf('self')>=0)+' has_print='+(t.indexOf('print')>=0)+' has_open='+(t.indexOf('open')>=0)+' has__encrypt='+(t.indexOf('_encrypt')>=0)+' has___g='+(t.indexOf('__g')>=0)+' has_customElements='+(t.indexOf('customElements')>=0);});return JSON.stringify(o,null,1);})()", ctx);
    console.log('GO 读的 JS 值:\n' + _gv);
    var _cv = vm.runInContext("(function(){var C=window.CVM;var o={};o.name=C.name;o.hasOwnToString=C.hasOwnProperty('toString');o.ownIsFPT=C.toString===Function.prototype.toString;o.toStringSrc=String(C.toString).slice(0,90);o.nativeName=C.hasOwnProperty('__zseNativeName')?String(C.__zseNativeName):'(none)';o.srcHead=String(C).slice(0,60);o.protoIsFPT=Object.getPrototypeOf(C)===Function.prototype;o.FPTsrc=String(Function.prototype.toString).slice(0,70);return JSON.stringify(o,null,1);})()", ctx);
    console.log('CVM 包装身份:' + String.fromCharCode(10) + _cv);
    var _all = vm.runInContext("(function(){var o={};['CVM','BVM','VM','Go'].forEach(function(n){try{var C=window[n];o[n]={name:C.name,ownTS:C.hasOwnProperty('toString'),srcHead:String(C).slice(0,50)};}catch(e){o[n]='ERR';}});return JSON.stringify(o,null,1);})()", ctx);
    console.log('四个类对照:' + String.fromCharCode(10) + _all);
  } catch(eGV){ console.log('GO 读值探针失败: ' + String(eGV.message).slice(0,120)); }
  try {
    var _sl = vm.runInContext('globalThis.__SLOG||[]', ctx);
    console.log('SLOG n=' + _sl.length + ' : ' + JSON.stringify(_sl.slice(0, 20)));
  } catch(eSL){}
  try {
    console.log('BPWASM 替换: __BPOK=' + vm.runInContext('globalThis.__BPOK||0', ctx) + ' err=' + JSON.stringify(vm.runInContext('globalThis.__BPERR||null', ctx)) + ' hasB64=' + vm.runInContext('typeof globalThis.__BPWASM_B64', ctx));
  } catch(eBP0){}
  try {
    var _f = vm.runInContext('globalThis.__FMTLOG||[]', ctx);
    console.log('FMTLOG n=' + _f.length + ' : ' + JSON.stringify(_f.slice(0, 60)));
    var _bt = vm.runInContext('globalThis.__BPTR||[]', ctx);
    console.log('BPTR n=' + _bt.length);
    var _hit = 0;
    for (var _bi = 0; _bi < _bt.length && _hit < 20; _bi++) {
      var _r = _bt[_bi];
      var interesting = false;
      for (var _k = 0; _k < _r.length; _k++) { if (_r[_k] === 38912 || _r[_k] === 34816 || _r[_k] === 32768) { interesting = true; break; } }
      if (interesting) { console.log('   BP[' + _bi + '] ' + JSON.stringify(_r)); _hit++; }
    }
  } catch(eBP3) { console.log('BP dump 失败: ' + String(eBP3.message).slice(0,120)); }
  try {
    var _al = vm.runInContext("(function(){var o={};var A=document.all;function t(n,f){try{o[n]=f();}catch(e){o[n]='THROW:'+String(e.message).slice(0,40);}}t('typeof all',function(){return typeof A});t('String(all)',function(){return String(A)});t('all.length',function(){return A.length});t('all[0]',function(){return String(A[0])});t('all[0].tagName',function(){return String(A[0]&&A[0].tagName)});t('all.item(0)',function(){return String(A.item(0))});t('all.namedItem',function(){return String(A.namedItem('x'))});t('all()',function(){return String(A())});t('docEl.tagName',function(){return String(document.documentElement.tagName)});t('docEl',function(){return String(document.documentElement)});t('String(all) idx0',function(){return String(A)[0]});return JSON.stringify(o,null,1);})()", ctx);
    console.log('document.all 形态:' + String.fromCharCode(10) + _al);
  } catch(eAL3){ console.log('all 探针失败: ' + String(eAL3.message).slice(0,100)); }
  try { console.log('CVMPRE: ' + JSON.stringify(vm.runInContext('globalThis.__CVMPRE||[]', ctx))); } catch(eCP){}
  try {
    var _ih = vm.runInContext("(function(){var o={};try{var L=document.getElementsByTagName('div');o.divLen=L.length;o.div0=String(L[0]);o.div0ih=JSON.stringify(String(L[0]&&L[0].innerHTML)).slice(0,120);}catch(e){o.err=String(e.message).slice(0,60);}try{var S=document.getElementsByTagName('script');o.scriptLen=S.length;o.script0ih=JSON.stringify(String(S[0]&&S[0].innerHTML)).slice(0,120);}catch(e){}try{o.bodyIH=JSON.stringify(String(document.body&&document.body.innerHTML)).slice(0,120);}catch(e){}return JSON.stringify(o,null,1);})()", ctx);
    console.log('innerHTML 形态:' + String.fromCharCode(10) + _ih);
  } catch(eIH){ console.log('innerHTML 探针失败: '+String(eIH.message).slice(0,100)); }
  try {
    var _src = vm.runInContext("(function(){var o={};['Go','VM','CVM','BVM'].forEach(function(n){try{var f=window[n];o[n]=String(f);}catch(e){o[n]='ERR';}});o.TS=String(Function.prototype.toString);return JSON.stringify(o);})()", ctx);
    require('fs').writeFileSync('.probe/zsec/mine_src.json', _src, 'utf8');
    console.log('我的源码串已存 .probe/zsec/mine_src.json');
  } catch(eMS){}
  try {
    var _q = vm.runInContext("(function(){var o={};var A=document.all;function t(n,f){try{var r=f();o[n]=(typeof r)+':'+String(r).slice(0,50);}catch(e){o[n]='THROW:'+String(e.message).slice(0,40);}}t('A.tagName',function(){return A.tagName});t('A[0].tagName',function(){return A[0].tagName});t('A.item',function(){return typeof A.item});t('A.namedItem',function(){return typeof A.namedItem});t('A()',function(){return A()});t('A().x',function(){return A().x});t('typeof A()',function(){return typeof A()});t('A.length',function(){return A.length});t('D.all.tagName',function(){return new Document().all.tagName});t('D.all.length',function(){return new Document().all.length});t('A.toString',function(){return A.toString()});return JSON.stringify(o,null,1);})()", ctx);
    console.log('all 语义:' + String.fromCharCode(10) + _q);
  } catch(eQ){ console.log('all 探针失败: '+String(eQ.message).slice(0,90)); }
  try {
    var _g = require('fs').readFileSync('.probe/zsec/bit12_guards.json','utf8');
    var _src2 = '(function(){var CH=' + _g + ';var r=[];for(var i=0;i<CH.length;i++){var v;try{v=eval(CH[i][1]);}catch(e){v="THROW:"+String(e.message).slice(0,40);}r.push(CH[i][0]+"  =>  "+JSON.stringify(v));}return r;})()';
    var _o2 = vm.runInContext(_src2, ctx);
    console.log('bit12 守卫求值:');
    for (var _i2=0;_i2<_o2.length;_i2++) console.log('   ' + _o2[_i2]);
  } catch(eB12){ console.log('bit12 守卫探针失败: '+String(eB12.message).slice(0,90)); }
  console.log('错误数:', errs.length, errs.slice(0, 3));
}, Number(process.env.WAIT_MS || 25000));
