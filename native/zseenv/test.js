const zse = require('./build/Release/zseenv.node');
const out = {};

// ---- 先看替换前的基线 ----
out.before_fnToString = String(Function.prototype.toString).slice(0, 60);
out.before_setTimeout = String(setTimeout).slice(0, 60);

// ---- 装原生 Function.prototype.toString ----
const newFn = zse.installNativeToString();
out.after_fnToString = String(Function.prototype.toString).slice(0, 60);
out.after_fnToString_call = Function.prototype.toString.call(Function.prototype.toString).slice(0, 60);
out.newFnSelf = String(newFn).slice(0, 60);

// ---- 注册一批伪装 ----
zse.registerNative(setTimeout, 'setTimeout');
zse.registerNative(Array.prototype.map, 'map');
out.g1 = Function.prototype.toString.call(setTimeout);
out.g2 = Function.prototype.toString.call(Array.prototype.map);
out.g3 = String(setTimeout);
// 未注册的必须回落到真实源码（V8 原生行为）
out.g4 = Function.prototype.toString.call(function foo(){ return 1; }).slice(0, 40);
// 注册表本身不可见
out.g5 = Object.keys(setTimeout).length;
out.g6 = Object.getOwnPropertyNames(setTimeout).join(',');

// ---- [[IsHTMLDDA]] ----
const all = zse.makeUndetectable([{tagName:'HTML'}, {tagName:'HEAD'}, {tagName:'BODY'}, {tagName:'DIV'}]);
out.i1_typeof = typeof all;                 // 真机: "undefined"
out.i2_len = all.length;                    // 4
out.i3_idx0 = all[0] && all[0].tagName;     // HTML
out.i4_call = (function(){ try { var r = all(); return typeof r; } catch(e) { return 'THROW:'+e.message; } })();
out.i5_notUndef = (all !== undefined);      // true（对象还在）
out.i6_bool = !!all;                        // 真机里 !!document.all === false
out.i7_str = String(all);

console.log(JSON.stringify(out, null, 1));