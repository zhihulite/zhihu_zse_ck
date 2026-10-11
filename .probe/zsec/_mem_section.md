## 2026-10-08 里程碑：**Go↔JS 协议 `1034` 帧语义修正 ⇒ panic 根因消除，与真机 168 步逐条对齐**

- **新增 `zseck-govm-protocol-1034.md`**（project）：`copyBytesToGo` 的 **`1034` 帧 = 纯调用**（`js/service.decompiled.js` case 554..632）：
  `Reflect.apply(loadValue(v7), undefined, loadSliceOfValues(a7,a8,a9))`。我此前写成 `storeValue(sp, undefined)` **空操作** ⇒ Go 侧 `js.Value.Invoke` 要求 `Type()==Function`，而 `document.all` 是 object ⇒ `panic: syscall/js: call of Value.Invoke on object` + `unreachable`，**流程在第 83 个事件就断**（此前所有「0 命中 ⇒ 没执行」的结论因此全部作废）。改对后**事件数 86 → 176、exit 0、与真机 `browser-proto7.json` 168 步逐条对齐**。
- **帧号语义表（实测）**：1022=valueSet、1024=valueGet、1026=方法调用、1028=字符串返回、1030=JS→wasm 写入、**1032=wasm→JS（把自己内存交给 JS 读，不是 JS 供给）**、1034=纯调用。真实 ref = `a[2]+a[1]`（进位技巧）；flag 1=对象 / 2=字符串 / 4=函数。
- **推翻两个旧假设**：① `1032` 不是「JS 供给」——`NOSUPPLY=1` 完全不喂，结果逐条相同；② **136041 字节挑战 JS 由 wasm 自己产生**——首次 `1032 132` 时内存 `var _0x3ba8e2@-1`，到 `1032 136041` 时内存 655360→1310720、挑战 JS 出现在偏移 505168，且全部 `1030` 最大只写 44,577 字节。
- **内嵌 base64 定位并解码**：`off=268056`（41,892 字符 → 31,419 B）= 真机交给 `CVM.H()` 的 CVM 程序（逐字节相同）；`off=310021`（17,380 字符 → 13,034 B）= 另一份 VM 程序；**字母表是标准 base64**（wasm @0x50011）。
- **交付 `js/govm_detection.restored.js`**：Go 侧环境检测关卡**原始代码逐字还原**（16 条 `new Function(src)` + `document.all[0].tagName` / `all()` / `all.toString()` / `createElement('canvas').toString()` / `Function.toString()` / `window.constructor.toString()`），19 条检查的**返回值已与真机逐条一致**（含 `function Window() { [native code] }` 35 字符）。
- **「wasm 先写假 ck」已直接验证**：同一次运行里出现两个不同 token —— 事件 21 = 假 ck、事件 170 = 真 ck。事件数记账闭合：我 172 = 真机 168 + 2（开头 `1024 __g` + `1032 132`）+ 2（`1022`，真机捕获不记录 1022）。
- **位图现状**：`2000 1000 8000 4000 8000 8000 9800 8000 8000 8000 4000` vs 真机 `2000 1000 8000 4030 8000 8000 8800 8000 8000 8000 4000` ⇒ 仅差 **w7 bit12** 与 **w4 bit4/5**。唯一与真机不同的「值」是 `getElementsByTagName('div')[0].innerHTML`（真机 14319 vs 我 133 字符，DOM 内容差异）。

