
## §14.41 三层自然产出 zh（本环境，不预制）—— 2026-10-07 闭环

### 结论（先说结果）

**`__b.zh` 已由本环境三层自己产出，全程没有借用活体值。**
驱动：`.probe/zsec/wdriver_glue.js`（干净模式，诊断插桩已关）。
产物：`.probe/zsec/zh_mine.txt`（921 字符，5 段），token 候选 `005_T9yqDouFhvIFP7Ps2A/3tG=…`。
分支事件 30 → **83**；`payload 内层异常: (无)`。

### zh 的段结构与活体逐段对齐

| 段 | 活体 | 本环境 | 说明 |
|---|---|---|---|
| 0 | len 13 `.z('!/z}+z/.x` | len 13 `*/{/*./{p$sx"` | `encode(SUBCALL(2227)+SUBCALL(2289), "acc7471d3eb9bc30")` |
| 1 | len 16 `,.+yptws({*#vw!$` | len 16 `vtqqx\|{ s"+|u !` | `encode(l[59], "f25b8434cca9a1f5")` |
| 2 | len 1808 `RXJyb3IK…` | len 880 `RXJyb3IK…` | `btoa(new Error().stack)` —— **长度随栈深度，天然随环境** |
| 3 | len 8 `~{x+ps%t` | len 8 `"&%vsx.` | |
| 4 | len 0 | len 0 | 尾部空段（U+200C 收尾） |

**⇒ 段数 5 与各段长度（13/16/?/8/0）完全一致**，唯一差异是第 2 段（`btoa(Error().stack)`）
的 base64 长度——那正是「环境指纹」应当随环境变化的部分。段 0/1 是同长度不同密文，
说明明文同长、只是编码链状态 `__b.a3` 不同。

### 谁写 zh（三层分工，实测）

| 层 | 实例 | 入口 | 动作 |
|---|---|---|---|
| 内层 jsvmp | `__b` = `BVM` | `__b['t'](251, <88096 字符容器>)`（136041 源码末行） | 读 `__b.zh` 当基数，追加 `encode(l[3]+l[4], "b53cc3fa93dc8013") + U+200C`（pc 692） |
| payload | `__c` = `CVM` | `__c['H'](251, <14716 字符容器>)`（62501 源码末行） | `__b.zh = l[60]`（pc ~1820），`l[60] = l[56] + U+200C + l[59] + U+200C + l[58] + U+200C` |
| orchestrator | —— | —— | 池含 `"44ae0b7a68bf0f7a","__c","qh","BVM","__b","zh"`，读 `typeof __b.zh` |

**关键**：`BVM` 与 `CVM` 的入口方法名不同——`BVM` 是 `t`，**`CVM` 是 `H`**。
之前只钩了 `t`，所以 `__c` 的运行完全不可见（`__c pc 轨迹: n=0` 就是这个原因）。

**顺序**：时间线实测 `EVAL-start 136041 → T-top __b:251 → (内层运行途中) EVAL-start 62501 → ZH-SET`。
即 payload 在内层运行途中被 eval 出来并先跑，内层随后追加——顺序是对的。

### 载荷层（payload CVM）其实是「环境检测阵列」

`__c.g`（2312 词）前 ~280 条指令在**按位记录缺失的 window 全局**（`l[3]` 是 bitmask）：

- `l[12] = Object.keys(new Proxy(window, handler))`，要求 `l[12].length` 达标；
- `SUBCALL(2079, l[12])` 逐个 `indexOf` 检查：`document / location / screen / history / navigator`；
- 再查 `top / customElements / name / self / print / open / _encrypt / __g`，缺失各置一位；
- `l[17] = document.URL` 查 `"zhihu"`；
- `l[23]=document.all[0]` 查 `tagName === "HTML"`；`l[18]=document.all` 查 `typeof` 与 `length`；
- `l[24]=document.getElementsByTagName("script")` 查 `toString()` 含 `"Collection"`；
- `l[26]=document.createElement("script")` 查 `tagName === "SCRIPT"`；
- `l[30]=canvas` 查 `toString()` 含 `HTMLCanvasElement`、`getContext("2d")` 含 `CanvasRenderingContext2D`、`outerHTML` 含 `"canvas"`；
- `l[40]=document.all` 查 `HTMLAllCollection`；
- `setTimeout/setInterval/window.stop/Function.prototype.constructor` 查 `toString()` 含 `"native"`；
- `l[73]=CVM.toString()` 查 `"onsol"`（自身完整性）；
- `l[60]=new Error().stack` 查 `"node"` 与 `"executeUserEntryPoint"`（Node 泄漏检测）。

### 三个真实崩溃点（逐一定位并修好）

用「调用点探针」把 `this['A'][this['N']][method](...args)` 的接收者/方法名打出来，
再加 `_0x465891` 指令轨迹，逐个定位：

| # | 崩溃 | 根因 | 修法 |
|---|---|---|---|
| 1 | `undefined.indexOf("zhihu")` | 程序执行 `new Function("window={};document={};return document")()`，**真实浏览器里 `document = {}` 静默失败**（不可写），返回真 document；我的环境里赋值成功 → 返回 `{}` → `{}.URL` 是 undefined | `handenv.js`：把 `window` / `document` / `location` 定义为 **non-writable** |
| 2 | `undefined.tagName` | `l[18] = document.all`；`l[23] = l[18][0]`。我的 `HTMLAllCollection` 没有下标访问 → `undefined` | `HTMLAllCollection(list)` 支持数字下标与 `length`；`doc.all = new HTMLAllCollection([documentElement, head, body])`（`[0]` = `<html>`） |
| 3 | `undefined.outerHTML` | `l[30].outerHTML.indexOf("canvas")`。`makeCanvas` 返回的裸对象没有 `outerHTML` | 元素工厂补 `outerHTML` / `innerHTML`；并补 `Symbol.toStringTag`（`HTMLHtmlElement` / `HTMLBodyElement` / `HTMLCanvasElement` / `CanvasRenderingContext2D` / `HTMLCollection` / `HTMLAllCollection`） |

### 仍未对齐的一处（已知，未修）

`typeof document.all`：真实浏览器返回 `"undefined"`（HTML 规范的 `[[IsHTMLDDA]]` 内部槽），
本环境返回 `"object"`。**纯 JS 无法伪造该内部槽**，payload 会因此多置一位（bit 3）。
若最终 token 被服务端拒收，这里是第一个要复核的点。

### 复现命令

```
node .probe/zsec/wdriver_glue.js
# 产物：.probe/zsec/zh_mine.txt（本环境的 zh）；控制台打印 token 候选
```
