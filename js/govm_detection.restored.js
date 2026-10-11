// ============================================================================
// js/govm_detection.restored.js
// Go VM（wasm 内）的环境检测关卡 —— **原始代码逐字还原**
//
// 证据来源：真机捕获 .probe/browser-proto7.json 的 copyBytesToGo 轨迹。
//   该协议把「字符串」用 1032 帧从 wasm 内存交给 JS 侧；下面的 src 字符串就是
//   真机在 1032 帧里交出来的**原始字节**，未做任何改写。
//   每条检查的调用形态是：1024 Function → 1032 <src> → 1034（= 调用 new Function(src)()）
//   → 1028/1030 把结果写回 wasm。
//   `1034` 的语义由 js/service.decompiled.js case 554..632 确定：
//     Reflect.apply(loadValue(receiver), undefined, loadSliceOfValues(a7,a8,a9))
//     —— 即无方法名的纯调用 v(...)，对应 Go 的 js.Value.Invoke(args...)。
//
// 真机步骤号（logical index）列在每条注释里，便于回溯。
// 本文件只做「按原顺序重排 + 加注」，字符串本身逐字符取自捕获。
// ============================================================================

'use strict';

// ---- 1) 10 条 Node/浏览器全局存在性探测（步骤 45..93）-----------------------
// 结果全部 'n'（真机与本环境一致）。任一条返回 'y' 说明跑在 Node/runner 里。
const NODE_PROBES = [
  "return typeof process !== 'undefined' ? 'y':'n'",              // #45
  "return typeof require !== 'undefined' ? 'y':'n'",              // #50
  "return typeof module !== 'undefined' ? 'y':'n'",               // #55
  "return typeof exports !== 'undefined' ? 'y':'n'",              // #60
  "return typeof __dirname !== 'undefined' ? 'y':'n'",            // #65
  "return typeof __filename !== 'undefined' ? 'y':'n'",           // #70
  "return typeof window._parent !== 'undefined' ? 'y':'n'",       // #75
  "return typeof window._origin !== 'undefined' ? 'y':'n'",       // #80
  "return typeof window._document !== 'undefined' ? 'y':'n'",     // #85
  "return typeof window._virtualConsole !== 'undefined' ? 'y':'n'", // #90
];

// ---- 2) DOM 能力探测（步骤 95..120）----------------------------------------
// 步骤 95：1024 document → 1032 'div' → 1026 getElementsByTagName('div')
//           → 1024 innerHTML → 1028/1030 把 innerHTML 写回
//           真机写回 14319 字符（真实知乎页面 DOM）；本环境 133 字符（桩 DOM）
const DOM_DIV_PROBE = "div";        // #95  document.getElementsByTagName('div')[0].innerHTML

// 步骤 100..106：document.all[0].tagName
//   1024 document → 1024 all → 1024 document → 1024 all → 1024 tagName
//   → 1028/1030 写回 4 字符 'HTML'
//   （即 (document.all)[0].tagName）

// 步骤 107..109：document.all()  —— **把它当函数调用**
//   1024 document → 1024 all → 1034（纯调用）
//   ⇒ 这是本环境此前崩溃点：驱动把 1034 实现成空操作，
//     Go 侧 `js.Value.Invoke` 要求 Type()==Function，而 document.all 的
//     typeFlag 是 object ⇒ panic "syscall/js: call of Value.Invoke on object"。
//   真机：document.all 是带 [[IsHTMLDDA]] 的可调用 HTMLAllCollection，
//         调用返回**对象**（不是 undefined、不是 null）。

// 步骤 110..114：document.all.toString()
//   1024 document → 1024 all → 1026 toString → 1028/1030 写回
//   真机写回 26 字符 '[object HTMLAllCollection]'

// 步骤 115..120：document.createElement('canvas').toString()
//   1024 document → 1032 'canvas' → 1026 createElement → 1026 toString
//   → 1028/1030 写回 26 字符 '[object HTMLCanvasElement]'
const DOM_CANVAS_PROBE = "canvas";  // #116

// ---- 3) 更多反自动化 / 反调试探测（步骤 122..154）-------------------------
const ANTI_AUTOMATION_PROBES = [
  "return typeof ws !== 'undefined' && ws.toString().indexOf('ocke') !== -1 ? 'y':'n'", // #122
  "return typeof JSDOM !== 'undefined' ? 'y':'n'",                 // #127
  "return typeof __dirname !== 'undefined' ? 'y':'n'",             // #136（第二次）
  "try{return window.constructor.toString()}catch(_){return ''}",  // #141
  "return typeof Hlclient !== 'undefined' ? 'y':'n'",              // #146
  "return typeof v_saf !== 'undefined' ? 'y':'n'",                 // #151
];

// 步骤 131..134：Function.prototype.toString 完整性检查
//   1024 Function → 1026 toString → 1028/1030 写回
//   真机写回 37 字符 'function Function() { [native code] }'
// 步骤 140..144：window.constructor.toString()
//   真机写回 35 字符 'function Window() { [native code] }'
//   ⇒ 这一条**必须**由原生 Function.prototype.toString 支持才能过；
//     纯 JS 伪装会让它显示为普通函数源码。

// ---- 4) 把整个关卡按真机顺序重排 ------------------------------------------
// 返回 { src, kind } 列表；kind 表示这一步用的是哪种协议形态。
const GAUNTLET = [
  ...NODE_PROBES.map(src => ({ src, kind: 'newFunction', real: 'n' })),

  { src: DOM_DIV_PROBE, kind: 'getElementsByTagName', real: 'HTML(14319B innerHTML)' },
  { src: null, kind: 'all[0].tagName', real: 'HTML' },
  { src: null, kind: 'all()', real: 'object' },
  { src: null, kind: 'all.toString()', real: '[object HTMLAllCollection]' },
  { src: DOM_CANVAS_PROBE, kind: 'createElement+toString', real: '[object HTMLCanvasElement]' },

  { src: ANTI_AUTOMATION_PROBES[0], kind: 'newFunction', real: 'n' },   // ws
  { src: ANTI_AUTOMATION_PROBES[1], kind: 'newFunction', real: 'n' },   // JSDOM
  { src: null, kind: 'Function.toString', real: 'function Function() { [native code] }' },
  { src: ANTI_AUTOMATION_PROBES[2], kind: 'newFunction', real: 'n' },   // __dirname #2
  { src: ANTI_AUTOMATION_PROBES[3], kind: 'newFunction', real: 'function Window() { [native code] }' },
  { src: ANTI_AUTOMATION_PROBES[4], kind: 'newFunction', real: 'n' },   // Hlclient
  { src: ANTI_AUTOMATION_PROBES[5], kind: 'newFunction', real: 'n' },   // v_saf
];

// ---- 5) 可直接执行的等价实现（在浏览器/手写环境里跑同一套）----------------
function runGauntlet(env) {
  const w = env || (typeof window !== 'undefined' ? window : globalThis);
  const F = w.Function;
  const out = [];
  for (const step of GAUNTLET) {
    switch (step.kind) {
      case 'newFunction':
        out.push({ kind: step.kind, src: step.src, value: new F(step.src)() });
        break;
      case 'getElementsByTagName':
        out.push({ kind: step.kind, value: String(w.document.getElementsByTagName(step.src)[0].innerHTML) });
        break;
      case 'all[0].tagName':
        out.push({ kind: step.kind, value: w.document.all[0].tagName });
        break;
      case 'all()':
        out.push({ kind: step.kind, value: typeof w.document.all() });
        break;
      case 'all.toString':
        out.push({ kind: step.kind, value: w.document.all.toString() });
        break;
      case 'createElement+toString':
        out.push({ kind: step.kind, value: w.document.createElement(step.src).toString() });
        break;
      case 'Function.toString':
        out.push({ kind: step.kind, value: F.toString() });
        break;
      default:
        out.push({ kind: step.kind, value: undefined });
    }
  }
  return out;
}

module.exports = { NODE_PROBES, ANTI_AUTOMATION_PROBES, DOM_DIV_PROBE, DOM_CANVAS_PROBE, GAUNTLET, runGauntlet };
