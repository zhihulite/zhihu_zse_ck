# zse_ck v4 —— 运行时全链捕获（方案 1 成果）

抓取方式：camoufox-reverse MCP，主世界 hook `window.Function` / `window.eval` / `window.atob`，
写入 `localStorage` 以**跨 `sc()` 的 `location.reload()` 存活**（这是关键——最初捕获随旧 window 被销毁，
表现为"什么都没抓到"）。

触发：删除 `__zse_ck`(domain=.zhihu.com) → 导航 `https://www.zhihu.com/people/zhihuadmin`
→ 403 挑战页 → 加载 `static.zhihu.com/zse-ck/v4/<hash>.js` → 生成 cookie → 200。

## 捕获清单（`cap_raw.json` → `blobs/`）

| # | 类型 | 长度 | 落盘 | 说明 |
|---|------|------|------|------|
| 0 | atob | 19,076 | `prog_19076.bin` (14,305B) | 程序池 |
| 1 | eval | 11,841 | `eval_11841_service.js` | 服务层闭包源（sc() 所在） |
| 2 | atob | 447,272 | `wasm_b64.bin` (335,454B) | **wasm 本体**（`\0asm\x01\0\0\0`） |
| 3 | eval | 136,041 | `eval_136041.js` | 最大 eval 层 |
| 4 | atob | 88,096 | `prog_88096.bin` (66,070B) | 程序池 |
| 5 | eval | 62,501 | `eval_62501.js` | 中间层 |
| 6 | atob | 14,716 | `prog_14716.bin` (11,037B) | 程序池 |
| 7 | atob | 41,892 | `prog_41892.bin` (31,419B) | 外层 950 词程序 |
| 8 | **Function** | **27,264** | `jsvmp_27264.js` | **运行时环境检测体（文章所指的 jsvmp）** |

另：`g_raw.json` / `blobs/g_ck.txt` = 同会话真实 `__g.ck`（132 字符，`005_…`）。

## 环境检测体还原（本轮核心成果）

`jsvmp_27264.js` = `function _0x599f(){var _0x2f5e70=[…127 项…]; …}`
经典 `_0x` 混淆。还原三步（脚本 `deob.js` → `subst.js` → `restore_env.js`）：

1. **跑解码器**：抽前 4,766 字符（数组 + 旋转 IIFE + `_0x4848`）进 `vm` 沙箱，对 `0x100..0x300`
   全量求值 → `dec_map.json`，**127 项全部明文**。
2. **回填**：12 个解码器别名共 156 处 `_0xNNNN(0xNNN)` → 字符串字面量。
3. **改名 + 常量折叠 + 字符串感知排版** → **`env_detect.restored.js`（1,067 行）**。

还原后的采集顺序（`collectEnvParts()`，返回 `md5Hex(parts.join('|'))`）：

1. `navigator.hardwareConcurrency`（失败取 -1）
2. WebGL：`UNMASKED_VENDOR_WEBGL` / `UNMASKED_RENDERER_WEBGL`（经 canvas `getContext('webgl')`
   + `WEBGL_debug_renderer_info`；附**反 hook**：用 `Function("return (function() {}.constructor('return this')())")`
   重建 `console`，并把 `log/warn/info/error/exception/table/trace` 逐个 `bind` 换掉）
3. canvas 2D 指纹：`'WelCome ZhiHu!'` / `'8pt ZhiHu'` / 弧线 / 颜色
4. 66 项字体探测（`'GJLwwwwwwwwww'` @ `'100px'`，与 monospace/sans-serif/serif 三基准比对）
5. `navigator.plugins` 名称
6. `return md5Hex(parts.join('|'))`  ← **即 `record93[48:80)`**

**结论：与既有 `zse_ck_generator.js` 里的 `collectParts()` + `fingerprintMd5()` 完全同构** ——
之前那份还原（对 4 个真实会话复现出 `53342e912ff1f85c0168c0f6c0b37525`）得到独立确认。

### 功能性验证（`node test_restored.js`）

mock 浏览器环境（canvas/WebGL/plugins）下直接跑还原件：

```
collectEnvParts() -> 4aea2792121cbf4024040263face107f
is 32-hex md5 : true
```

即还原件是**可执行**的，不是只做字符串替换。

### 排版注意

`restore_env.js` 里只保留**括号内**常量折叠（健全）。曾试过"无括号纯 hex 算式折叠"，
会把 `0x1107*-0x1+-0xb95*-0x1+0x572` 误折成 `0x1107*-0x1+-0xb95*(1393)`（改变运算结构），
已弃用。因此文件里仍可见 `-0x11d0+-0xf7b+0x2533` 这类未折叠算式，属预期。

### 功能性验证（`node test_restored.js`）

mock 浏览器环境（canvas/WebGL/plugins）下直接跑还原件：

```
collectEnvParts() -> 4aea2792121cbf4024040263face107f
is 32-hex md5 : true
```

即还原件是**可执行**的，不是只做字符串替换。

### 排版注意

`restore_env.js` 里只保留**括号内**常量折叠（健全）。曾试过"无括号纯 hex 算式折叠"，
会把 `0x1107*-0x1+-0xb95*-0x1+0x572` 误折成 `0x1107*-0x1+-0xb95*(1393)`（改变运算结构），
已弃用。因此文件里仍可见 `-0x11d0+-0xf7b+0x2533` 这类未折叠算式，属预期。

### 功能性验证（`node test_restored.js`）

mock 浏览器环境（canvas/WebGL/plugins）下直接跑还原件：

```
collectEnvParts() -> 4aea2792121cbf4024040263face107f
is 32-hex md5 : true
```

即还原件是**可执行**的，不是只做字符串替换。

### 排版注意

`restore_env.js` 里只保留**括号内**常量折叠（健全）。曾试过"无括号纯 hex 算式折叠"，
会把 `0x1107*-0x1+-0xb95*-0x1+0x572` 误折成 `0x1107*-0x1+-0xb95*(1393)`（改变运算结构），
已弃用。因此文件里仍可见 `-0x11d0+-0xf7b+0x2533` 这类未折叠算式，属预期。

### 功能性验证（`node test_restored.js`）

mock 浏览器环境（canvas/WebGL/plugins）下直接跑还原件：

```
collectEnvParts() -> 4aea2792121cbf4024040263face107f
is 32-hex md5 : true
```

即还原件是**可执行**的，不是只做字符串替换。

### 排版注意

`restore_env.js` 里只保留**括号内**常量折叠（健全）。曾试过"无括号纯 hex 算式折叠"，
会把 `0x1107*-0x1+-0xb95*-0x1+0x572` 误折成 `0x1107*-0x1+-0xb95*(1393)`（改变运算结构），
已弃用。因此文件里仍可见 `-0x11d0+-0xf7b+0x2533` 这类未折叠算式，属预期。

### 功能性验证（`node test_restored.js`）

mock 浏览器环境（canvas/WebGL/plugins）下直接跑还原件：

```
collectEnvParts() -> 4aea2792121cbf4024040263face107f
is 32-hex md5 : true
```

即还原件是**可执行**的，不是只做字符串替换。

### 排版注意

`restore_env.js` 里只保留**括号内**常量折叠（健全）。曾试过"无括号纯 hex 算式折叠"，
会把 `0x1107*-0x1+-0xb95*-0x1+0x572` 误折成 `0x1107*-0x1+-0xb95*(1393)`（改变运算结构），
已弃用。因此文件里仍可见 `-0x11d0+-0xf7b+0x2533` 这类未折叠算式，属预期。

### 功能性验证（`node test_restored.js`）

mock 浏览器环境（canvas/WebGL/plugins）下直接跑还原件：

```
collectEnvParts() -> 4aea2792121cbf4024040263face107f
is 32-hex md5 : true
```

即还原件是**可执行**的，不是只做字符串替换。

### 排版注意

`restore_env.js` 里只保留**括号内**常量折叠（健全）。曾试过"无括号纯 hex 算式折叠"，
会把 `0x1107*-0x1+-0xb95*-0x1+0x572` 误折成 `0x1107*-0x1+-0xb95*(1393)`（改变运算结构），
已弃用。因此文件里仍可见 `-0x11d0+-0xf7b+0x2533` 这类未折叠算式，属预期。

## 交叉验证：捕获原版 vs 我方还原（同一浏览器环境实跑）

`xcheck.js`（`build_xcheck.js` 生成）+ `cors_server.py`（本地带 CORS 的静态服务）→
在 zhihu 页面里 `fetch` + `eval` 后调 `__RUN()`：

```
capturedMd5 = 77028ee7cd1ff545a6813d7a78cc0622     <- 捕获原版 collectEnvParts()
refMd5      = 77028ee7cd1ff545a6813d7a78cc0622     <- 我方 collectParts()+fingerprintMd5()
nCap = nRef = 9,  partsEqual = true,  md5Equal = true
parts = 8 | Intel | Intel(R) HD Graphics, or similar | data:image/png;base64,… | …
```

再把 crc32 段一起验：

```
navigator.userAgent = Mozilla/5.0 (X11; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0
crc32(UA)           = 9fede141
```

**两段都等于既有真实样本 #6 的 record93 对应切片：**

| 切片 | 真实样本 #6 | 本轮实测 | 一致 |
|---|---|---|---|
| `[48:80)` 环境 MD5 | `77028ee7cd1ff545a6813d7a78cc0622` | 同（两个实现都对上） | ✅ |
| `[81:89)` crc32(UA) | `9fede141` | 同 | ✅ |

⇒ 环境检测层与 crc32 段**三方互证**：运行时原版 = 我方还原 = 真实 token 明文。
（当前 camoufox 环境与样本 #6 是同一环境。）

## 交叉验证：捕获原版 vs 我方还原（同一浏览器环境实跑）

`xcheck.js`（`build_xcheck.js` 生成）+ `cors_server.py`（本地带 CORS 的静态服务）→
在 zhihu 页面里 `fetch` + `eval` 后调 `__RUN()`：

```
capturedMd5 = 77028ee7cd1ff545a6813d7a78cc0622     <- 捕获原版 collectEnvParts()
refMd5      = 77028ee7cd1ff545a6813d7a78cc0622     <- 我方 collectParts()+fingerprintMd5()
nCap = nRef = 9,  partsEqual = true,  md5Equal = true
parts = 8 | Intel | Intel(R) HD Graphics, or similar | data:image/png;base64,… | …
```

再把 crc32 段一起验：

```
navigator.userAgent = Mozilla/5.0 (X11; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0
crc32(UA)           = 9fede141
```

**两段都等于既有真实样本 #6 的 record93 对应切片：**

| 切片 | 真实样本 #6 | 本轮实测 | 一致 |
|---|---|---|---|
| `[48:80)` 环境 MD5 | `77028ee7cd1ff545a6813d7a78cc0622` | 同（两个实现都对上） | ✅ |
| `[81:89)` crc32(UA) | `9fede141` | 同 | ✅ |

⇒ 环境检测层与 crc32 段**三方互证**：运行时原版 = 我方还原 = 真实 token 明文。
（当前 camoufox 环境与样本 #6 是同一环境。）

## 交叉验证：捕获原版 vs 我方还原（同一浏览器环境实跑）

`xcheck.js`（`build_xcheck.js` 生成）+ `cors_server.py`（本地带 CORS 的静态服务）→
在 zhihu 页面里 `fetch` + `eval` 后调 `__RUN()`：

```
capturedMd5 = 77028ee7cd1ff545a6813d7a78cc0622     <- 捕获原版 collectEnvParts()
refMd5      = 77028ee7cd1ff545a6813d7a78cc0622     <- 我方 collectParts()+fingerprintMd5()
nCap = nRef = 9,  partsEqual = true,  md5Equal = true
parts = 8 | Intel | Intel(R) HD Graphics, or similar | data:image/png;base64,… | …
```

再把 crc32 段一起验：

```
navigator.userAgent = Mozilla/5.0 (X11; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0
crc32(UA)           = 9fede141
```

**两段都等于既有真实样本 #6 的 record93 对应切片：**

| 切片 | 真实样本 #6 | 本轮实测 | 一致 |
|---|---|---|---|
| `[48:80)` 环境 MD5 | `77028ee7cd1ff545a6813d7a78cc0622` | 同（两个实现都对上） | ✅ |
| `[81:89)` crc32(UA) | `9fede141` | 同 | ✅ |

⇒ 环境检测层与 crc32 段**三方互证**：运行时原版 = 我方还原 = 真实 token 明文。
（当前 camoufox 环境与样本 #6 是同一环境。）

## 交叉验证：捕获原版 vs 我方还原（同一浏览器环境实跑）

`xcheck.js`（`build_xcheck.js` 生成）+ `cors_server.py`（本地带 CORS 的静态服务）→
在 zhihu 页面里 `fetch` + `eval` 后调 `__RUN()`：

```
capturedMd5 = 77028ee7cd1ff545a6813d7a78cc0622     <- 捕获原版 collectEnvParts()
refMd5      = 77028ee7cd1ff545a6813d7a78cc0622     <- 我方 collectParts()+fingerprintMd5()
nCap = nRef = 9,  partsEqual = true,  md5Equal = true
parts = 8 | Intel | Intel(R) HD Graphics, or similar | data:image/png;base64,… | …
```

再把 crc32 段一起验：

```
navigator.userAgent = Mozilla/5.0 (X11; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0
crc32(UA)           = 9fede141
```

**两段都等于既有真实样本 #6 的 record93 对应切片：**

| 切片 | 真实样本 #6 | 本轮实测 | 一致 |
|---|---|---|---|
| `[48:80)` 环境 MD5 | `77028ee7cd1ff545a6813d7a78cc0622` | 同（两个实现都对上） | ✅ |
| `[81:89)` crc32(UA) | `9fede141` | 同 | ✅ |

⇒ 环境检测层与 crc32 段**三方互证**：运行时原版 = 我方还原 = 真实 token 明文。
（当前 camoufox 环境与样本 #6 是同一环境。）

## 交叉验证：捕获原版 vs 我方还原（同一浏览器环境实跑）

`xcheck.js`（`build_xcheck.js` 生成）+ `cors_server.py`（本地带 CORS 的静态服务）→
在 zhihu 页面里 `fetch` + `eval` 后调 `__RUN()`：

```
capturedMd5 = 77028ee7cd1ff545a6813d7a78cc0622     <- 捕获原版 collectEnvParts()
refMd5      = 77028ee7cd1ff545a6813d7a78cc0622     <- 我方 collectParts()+fingerprintMd5()
nCap = nRef = 9,  partsEqual = true,  md5Equal = true
parts = 8 | Intel | Intel(R) HD Graphics, or similar | data:image/png;base64,… | …
```

再把 crc32 段一起验：

```
navigator.userAgent = Mozilla/5.0 (X11; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0
crc32(UA)           = 9fede141
```

**两段都等于既有真实样本 #6 的 record93 对应切片：**

| 切片 | 真实样本 #6 | 本轮实测 | 一致 |
|---|---|---|---|
| `[48:80)` 环境 MD5 | `77028ee7cd1ff545a6813d7a78cc0622` | 同（两个实现都对上） | ✅ |
| `[81:89)` crc32(UA) | `9fede141` | 同 | ✅ |

⇒ 环境检测层与 crc32 段**三方互证**：运行时原版 = 我方还原 = 真实 token 明文。
（当前 camoufox 环境与样本 #6 是同一环境。）

## 交叉验证：捕获原版 vs 我方还原（同一浏览器环境实跑）

`xcheck.js`（`build_xcheck.js` 生成）+ `cors_server.py`（本地带 CORS 的静态服务）→
在 zhihu 页面里 `fetch` + `eval` 后调 `__RUN()`：

```
capturedMd5 = 77028ee7cd1ff545a6813d7a78cc0622     <- 捕获原版 collectEnvParts()
refMd5      = 77028ee7cd1ff545a6813d7a78cc0622     <- 我方 collectParts()+fingerprintMd5()
nCap = nRef = 9,  partsEqual = true,  md5Equal = true
parts = 8 | Intel | Intel(R) HD Graphics, or similar | data:image/png;base64,… | …
```

再把 crc32 段一起验：

```
navigator.userAgent = Mozilla/5.0 (X11; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0
crc32(UA)           = 9fede141
```

**两段都等于既有真实样本 #6 的 record93 对应切片：**

| 切片 | 真实样本 #6 | 本轮实测 | 一致 |
|---|---|---|---|
| `[48:80)` 环境 MD5 | `77028ee7cd1ff545a6813d7a78cc0622` | 同（两个实现都对上） | ✅ |
| `[81:89)` crc32(UA) | `9fede141` | 同 | ✅ |

⇒ 环境检测层与 crc32 段**三方互证**：运行时原版 = 我方还原 = 真实 token 明文。
（当前 camoufox 环境与样本 #6 是同一环境。）

## 密钥来源判定（本会话新结论，修正早前记录）

### 1) fallback token（文章说的「假的 ck」）已实锤

mock 挑战页 + 固定 meta 连跑 10 次，出现一个**恒定 payload**：

```
005_Oa3kfOKbHuI3Xr02b9mQAlJZgra0E21qEafoLEhYKxTEK2hnbV5LeUBExWohs716v2awISh7Myv7pkAnpjUsVL0k=WQ0XM3d6ols0FBEZE3gSStZ1EX1sF0Wii3ZtPNo
```

浏览器 cookie 实证：`__zse_ck = 005_Oa3kfOKbHuI3…-<meta>`，即 **payload 就是那个恒定值**。
该串在 build JS / wasm / 程序池里都搜不到明文（运行时构造或来自 wasm）。

### 2) 密钥 = f(环境)，**不是** f(meta)、**不是**每会话随机

在 wasm 线性内存（`WebAssembly.instantiate` 钩子拿到，5 MB）里扫 64 字符置换（radix64 字母表），
四次运行结果：

| 运行 | meta | payload | 内存字母表 |
|---|---|---|---|
| mock ① | `4Qv8MLHQ…` | 真实 | `AMVL3T/dGNenw9l6=2OZfDhJr71j0kCyiRXavSxHqIpBPm4u5KUgsz8FWtYocbEQ` |
| mock ② | `l9DftyjVhYd4…` | 真实 | 同上 |
| 真实 ③ | `VOd4d8rg…` | `005_UECB5ZrWXl…` | 同上 |
| 真实 ④ | `8BU5TtUu…` | `005_pjYIJVP9L7…` | 同上 |

⇒ 换 meta、换会话，字母表不变。**同一个浏览器环境 = 同一把密钥。**

### 3) 修正：早前「参数按会话变」是 `extract` 的**非唯一解**造成的

`zse_ck_tool.py` 的 `extract()` 在**单条 payload** 上暴力 `xreg∈[0,256)` 联合求解 `(alphabet, xreg)`；
这个解对该 payload 自洽（自检通过），但**不是真值**，换一条 payload 就不成立。
所以：
- `env_samples.json` 里 s5/s6 的 alphabet 是伪解 → 用它解新 token 失败（本轮已验证）；
- `PAIRS.md` 里 C/D/E「同环境不同字母表」同属伪解。
- 真值只有内存扫描能拿到。

**推论**：现有离线生成器对**同一环境**有效（6/6 实测），换环境需对该环境取一次参。
`extract()` 应改为「以内存扫到的字母表为准，或用第二条 payload 交叉验证 `(alphabet, xreg)`」。

## 密钥来源判定（本会话新结论，修正早前记录）

### 1) fallback token（文章说的「假的 ck」）已实锤

mock 挑战页 + 固定 meta 连跑 10 次，出现一个**恒定 payload**：

```
005_Oa3kfOKbHuI3Xr02b9mQAlJZgra0E21qEafoLEhYKxTEK2hnbV5LeUBExWohs716v2awISh7Myv7pkAnpjUsVL0k=WQ0XM3d6ols0FBEZE3gSStZ1EX1sF0Wii3ZtPNo
```

浏览器 cookie 实证：`__zse_ck = 005_Oa3kfOKbHuI3…-<meta>`，即 **payload 就是那个恒定值**。
该串在 build JS / wasm / 程序池里都搜不到明文（运行时构造或来自 wasm）。

### 2) 密钥 = f(环境)，**不是** f(meta)、**不是**每会话随机

在 wasm 线性内存（`WebAssembly.instantiate` 钩子拿到，5 MB）里扫 64 字符置换（radix64 字母表），
四次运行结果：

| 运行 | meta | payload | 内存字母表 |
|---|---|---|---|
| mock ① | `4Qv8MLHQ…` | 真实 | `AMVL3T/dGNenw9l6=2OZfDhJr71j0kCyiRXavSxHqIpBPm4u5KUgsz8FWtYocbEQ` |
| mock ② | `l9DftyjVhYd4…` | 真实 | 同上 |
| 真实 ③ | `VOd4d8rg…` | `005_UECB5ZrWXl…` | 同上 |
| 真实 ④ | `8BU5TtUu…` | `005_pjYIJVP9L7…` | 同上 |

⇒ 换 meta、换会话，字母表不变。**同一个浏览器环境 = 同一把密钥。**

### 3) 修正：早前「参数按会话变」是 `extract` 的**非唯一解**造成的

`zse_ck_tool.py` 的 `extract()` 在**单条 payload** 上暴力 `xreg∈[0,256)` 联合求解 `(alphabet, xreg)`；
这个解对该 payload 自洽（自检通过），但**不是真值**，换一条 payload 就不成立。
所以：
- `env_samples.json` 里 s5/s6 的 alphabet 是伪解 → 用它解新 token 失败（本轮已验证）；
- `PAIRS.md` 里 C/D/E「同环境不同字母表」同属伪解。
- 真值只有内存扫描能拿到。

**推论**：现有离线生成器对**同一环境**有效（6/6 实测），换环境需对该环境取一次参。
`extract()` 应改为「以内存扫到的字母表为准，或用第二条 payload 交叉验证 `(alphabet, xreg)`」。

## 密钥来源判定（本会话新结论，修正早前记录）

### 1) fallback token（文章说的「假的 ck」）已实锤

mock 挑战页 + 固定 meta 连跑 10 次，出现一个**恒定 payload**：

```
005_Oa3kfOKbHuI3Xr02b9mQAlJZgra0E21qEafoLEhYKxTEK2hnbV5LeUBExWohs716v2awISh7Myv7pkAnpjUsVL0k=WQ0XM3d6ols0FBEZE3gSStZ1EX1sF0Wii3ZtPNo
```

浏览器 cookie 实证：`__zse_ck = 005_Oa3kfOKbHuI3…-<meta>`，即 **payload 就是那个恒定值**。
该串在 build JS / wasm / 程序池里都搜不到明文（运行时构造或来自 wasm）。

### 2) 密钥 = f(环境)，**不是** f(meta)、**不是**每会话随机

在 wasm 线性内存（`WebAssembly.instantiate` 钩子拿到，5 MB）里扫 64 字符置换（radix64 字母表），
四次运行结果：

| 运行 | meta | payload | 内存字母表 |
|---|---|---|---|
| mock ① | `4Qv8MLHQ…` | 真实 | `AMVL3T/dGNenw9l6=2OZfDhJr71j0kCyiRXavSxHqIpBPm4u5KUgsz8FWtYocbEQ` |
| mock ② | `l9DftyjVhYd4…` | 真实 | 同上 |
| 真实 ③ | `VOd4d8rg…` | `005_UECB5ZrWXl…` | 同上 |
| 真实 ④ | `8BU5TtUu…` | `005_pjYIJVP9L7…` | 同上 |

⇒ 换 meta、换会话，字母表不变。**同一个浏览器环境 = 同一把密钥。**

### 3) 修正：早前「参数按会话变」是 `extract` 的**非唯一解**造成的

`zse_ck_tool.py` 的 `extract()` 在**单条 payload** 上暴力 `xreg∈[0,256)` 联合求解 `(alphabet, xreg)`；
这个解对该 payload 自洽（自检通过），但**不是真值**，换一条 payload 就不成立。
所以：
- `env_samples.json` 里 s5/s6 的 alphabet 是伪解 → 用它解新 token 失败（本轮已验证）；
- `PAIRS.md` 里 C/D/E「同环境不同字母表」同属伪解。
- 真值只有内存扫描能拿到。

**推论**：现有离线生成器对**同一环境**有效（6/6 实测），换环境需对该环境取一次参。
`extract()` 应改为「以内存扫到的字母表为准，或用第二条 payload 交叉验证 `(alphabet, xreg)`」。

## 密钥来源判定（本会话新结论，修正早前记录）

### 1) fallback token（文章说的「假的 ck」）已实锤

mock 挑战页 + 固定 meta 连跑 10 次，出现一个**恒定 payload**：

```
005_Oa3kfOKbHuI3Xr02b9mQAlJZgra0E21qEafoLEhYKxTEK2hnbV5LeUBExWohs716v2awISh7Myv7pkAnpjUsVL0k=WQ0XM3d6ols0FBEZE3gSStZ1EX1sF0Wii3ZtPNo
```

浏览器 cookie 实证：`__zse_ck = 005_Oa3kfOKbHuI3…-<meta>`，即 **payload 就是那个恒定值**。
该串在 build JS / wasm / 程序池里都搜不到明文（运行时构造或来自 wasm）。

### 2) 密钥 = f(环境)，**不是** f(meta)、**不是**每会话随机

在 wasm 线性内存（`WebAssembly.instantiate` 钩子拿到，5 MB）里扫 64 字符置换（radix64 字母表），
四次运行结果：

| 运行 | meta | payload | 内存字母表 |
|---|---|---|---|
| mock ① | `4Qv8MLHQ…` | 真实 | `AMVL3T/dGNenw9l6=2OZfDhJr71j0kCyiRXavSxHqIpBPm4u5KUgsz8FWtYocbEQ` |
| mock ② | `l9DftyjVhYd4…` | 真实 | 同上 |
| 真实 ③ | `VOd4d8rg…` | `005_UECB5ZrWXl…` | 同上 |
| 真实 ④ | `8BU5TtUu…` | `005_pjYIJVP9L7…` | 同上 |

⇒ 换 meta、换会话，字母表不变。**同一个浏览器环境 = 同一把密钥。**

### 3) 修正：早前「参数按会话变」是 `extract` 的**非唯一解**造成的

`zse_ck_tool.py` 的 `extract()` 在**单条 payload** 上暴力 `xreg∈[0,256)` 联合求解 `(alphabet, xreg)`；
这个解对该 payload 自洽（自检通过），但**不是真值**，换一条 payload 就不成立。
所以：
- `env_samples.json` 里 s5/s6 的 alphabet 是伪解 → 用它解新 token 失败（本轮已验证）；
- `PAIRS.md` 里 C/D/E「同环境不同字母表」同属伪解。
- 真值只有内存扫描能拿到。

**推论**：现有离线生成器对**同一环境**有效（6/6 实测），换环境需对该环境取一次参。
`extract()` 应改为「以内存扫到的字母表为准，或用第二条 payload 交叉验证 `(alphabet, xreg)`」。

## 密钥来源判定（本会话新结论，修正早前记录）

### 1) fallback token（文章说的「假的 ck」）已实锤

mock 挑战页 + 固定 meta 连跑 10 次，出现一个**恒定 payload**：

```
005_Oa3kfOKbHuI3Xr02b9mQAlJZgra0E21qEafoLEhYKxTEK2hnbV5LeUBExWohs716v2awISh7Myv7pkAnpjUsVL0k=WQ0XM3d6ols0FBEZE3gSStZ1EX1sF0Wii3ZtPNo
```

浏览器 cookie 实证：`__zse_ck = 005_Oa3kfOKbHuI3…-<meta>`，即 **payload 就是那个恒定值**。
该串在 build JS / wasm / 程序池里都搜不到明文（运行时构造或来自 wasm）。

### 2) 密钥 = f(环境)，**不是** f(meta)、**不是**每会话随机

在 wasm 线性内存（`WebAssembly.instantiate` 钩子拿到，5 MB）里扫 64 字符置换（radix64 字母表），
四次运行结果：

| 运行 | meta | payload | 内存字母表 |
|---|---|---|---|
| mock ① | `4Qv8MLHQ…` | 真实 | `AMVL3T/dGNenw9l6=2OZfDhJr71j0kCyiRXavSxHqIpBPm4u5KUgsz8FWtYocbEQ` |
| mock ② | `l9DftyjVhYd4…` | 真实 | 同上 |
| 真实 ③ | `VOd4d8rg…` | `005_UECB5ZrWXl…` | 同上 |
| 真实 ④ | `8BU5TtUu…` | `005_pjYIJVP9L7…` | 同上 |

⇒ 换 meta、换会话，字母表不变。**同一个浏览器环境 = 同一把密钥。**

### 3) 修正：早前「参数按会话变」是 `extract` 的**非唯一解**造成的

`zse_ck_tool.py` 的 `extract()` 在**单条 payload** 上暴力 `xreg∈[0,256)` 联合求解 `(alphabet, xreg)`；
这个解对该 payload 自洽（自检通过），但**不是真值**，换一条 payload 就不成立。
所以：
- `env_samples.json` 里 s5/s6 的 alphabet 是伪解 → 用它解新 token 失败（本轮已验证）；
- `PAIRS.md` 里 C/D/E「同环境不同字母表」同属伪解。
- 真值只有内存扫描能拿到。

**推论**：现有离线生成器对**同一环境**有效（6/6 实测），换环境需对该环境取一次参。
`extract()` 应改为「以内存扫到的字母表为准，或用第二条 payload 交叉验证 `(alphabet, xreg)`」。

## 密钥来源判定（本会话新结论，修正早前记录）

### 1) fallback token（文章说的「假的 ck」）已实锤

mock 挑战页 + 固定 meta 连跑 10 次，出现一个**恒定 payload**：

```
005_Oa3kfOKbHuI3Xr02b9mQAlJZgra0E21qEafoLEhYKxTEK2hnbV5LeUBExWohs716v2awISh7Myv7pkAnpjUsVL0k=WQ0XM3d6ols0FBEZE3gSStZ1EX1sF0Wii3ZtPNo
```

浏览器 cookie 实证：`__zse_ck = 005_Oa3kfOKbHuI3…-<meta>`，即 **payload 就是那个恒定值**。
该串在 build JS / wasm / 程序池里都搜不到明文（运行时构造或来自 wasm）。

### 2) 密钥按**会话**变（本会话内有两次自我更正，最终结论如下）

先扫 6 份历史内存转储（`.probe/cap2/dump_*.bin`），每份都含 **3 个** 64 字符置换：

| 偏移 | 值 | 跨样本 |
|---|---|---|
| ~314764 | `rBPa7xz6ReFTKuVHLE=IS0sJ5jwf2YCAGqXdWhQvy/OM3nk9cotp1DmZbUN4lg8i` | **恒定**（静态表） |
| ~680xxx | `AMVL3T/dGNenw9l6=2OZfDhJr71j0kCyiRXavSxHqIpBPm4u5KUgsz8FWtYocbEQ` | **恒定**（静态表） |
| ~1.7M–2.5M | 每会话不同 | **真会话字母表** |

第三列**逐字符等于 `extract()` 解出的字母表**（s1–s4 = `m3iN4AUe…`，s5 = `A2cxCn9…`，s6 = `ao2A6nRX…`）
⇒ **`extract()` 是对的**，`env_samples.json` / `PAIRS.md` 里的字母表就是真会话字母表。

live 验证（同样扫 wasm 线性内存）：

| 运行 | 会话字母表（高偏移） |
|---|---|
| 真实会话 ① | `EFDps4KfrIwm0V5GQXShH9JPivuMxjZL=bayYkBz2o/8WgNUelt1TC3R6dncq7AO` |
| 真实会话 ② | `03mMciPpfJXgNtRT1lS8q7dzDQuE/V6hbkv54nCIsKBZao9GjWYLAwr=2OFUxHye` |

⇒ **逐会话变化**。⇒ 现有离线生成器只能复现「已取参的那个会话」；换会话必须重新取参。

**过程中的两次自我更正（记录以免再踩）**：
1. 第一版 live 扫描写了 `if (found.length > 4) break`，在低偏移就撞到那两个静态表提前退出，
   于是错得出「字母表恒定」→ 据此又错判 `extract()` 是「非唯一伪解」。**两者都错**，根因就是那个 break。
2. 修正扫描（不提前退出、按值去重）后，真会话字母表在 ~1.4M–2.5M 偏移处才出现。

### 3) mock 挑战页会强制走「固定密钥」路径 —— 不能用它测种子来源

mock（`intercept_request` 返回自制 403 文档）下连跑，**换 meta**（`4Qv8MLHQ…` / `l9DftyjVhYd4…`）
和**换 `d_c0`**（改成全零）后，会话字母表**始终是** `AlzCVSJnGm=1R82bKDpw6syroi/huHMkPx4BN93e50dXcgFfOWYaULQTZtqEI7vj`。

⇒ mock 路径下密钥固定，与 meta、与 `d_c0` 都无关 ⇒ **mock 实验无法判定真路径的种子**。
真路径下密钥逐会话变，种子只能来自真实服务端响应链（meta / cookie 轮换 / 时序），此项**未定**。

## wasm 侧还原（本轮新增）

产物：`.probe/wt/new.wat`（新 build 的 WAT）+ `.probe/wt/zse.decompiled.js`（192 函数、0 未处理指令、12,620 行）。

### 0) 地址映射（务必用这个，之前错了）

```
mem(addr) = wasm_file[addr + 0x39d8]        # 由 'NumFieldChanDirstrconv' @file 0x13af9 定位
```
段布局（`wasm-objdump -x`）：
`.rodata` @0x10000/267B，`.rodata.1` @0x10121/247064B，`.data` @0x4C63C/321B，
`.data.1` @0x4C788/1073B，`.data.2..5` @0x4CD15 起各 2B，`.data.6` @0x4CD40/401B。

### 1) VM case 派发表 = 107 路 call_indirect

`wasm-objdump -x` 的 Elem 表逐条列出 `(*main._0oOoOO)._XXX$bound`（func 61..164 共 ~107 个）。
即文章的「`(*main.VM)` 前缀子函数组，每个 case 一个具体逻辑」——现版类型名混淆成 `_0oOoOO`。

### 2) crc32(UA) → 16 进制 → 左补零 = `record93[81:89)`

在 `(*main._0oOoOO)._00oooO`（L9521–11181，1661 行）里：

```js
l4 = (l3 ^ -1);                                        // 0xFFFFFFFF
$L68: while (true) {                                   // slicing-by-8 CRC32
  l4 = (M32[(l6 + (((M8[p1] ^ l4) & 255) << 2))] ^ (l4 >>> 8));
  p1++; l5--; if (l5) continue;
}
p1 = (l4 ^ -1);
strconv_FormatInt((l2+344), BigInt(p1), 16);           // ← 转 16 进制
l4 = M32[l2+348];                                      // 十六进制串长度
if (((8 - l4) > 0)) {                                  // 不足 8 位
  l5 = (9 - l4);
  $L70: while (true) {
    runtime_stringConcat((l2+336), 253248, 1, p1, l4); // ← 前缀补位字符
    ...
    l5--; if ((l5 > 1)) continue;
  }
}
```
补位字符：`mem[253248]` = **`'0'`**（253248 = 0x3DD40）。

### 3) 同一 `'0'` 字面量还用于补到 **4** 位 = `record93[89:93)`

L10508–10532：
```js
if ((l7 >= 4)) { ...按原样用... }        // 长度够 4 位
l6 = (4 - l7);
if ((l6 >= 0)) {
  l3 = runtime_alloc(16);
  __strings_Builder__Grow(l3, l6);
  __strings_Builder__WriteString(l3, 253248, 1);   // 同样是 '0'
  ...
}
```
⇒ `record93[89:93)` 也是一个 **零填充的 4 位十六进制**（源自某个 16 位量），与 crc32 段共用补位字符。

### 4) `main._0oooOO` = 解密 + 替换（文章的「VM 解密环境信息」）

```js
function main__0oooOO(p0 /*ret*/, p1 /*srcPtr*/, p2 /*srcLen*/) {
  l5 = runtime_alloc(p2); memCopy(l5, p1, p2);
  if ((p2 > 0)) {
    l6 = 41;                                  // 种子 0x29
    while (true) { l6 = ((l6 ^ M8[p1]) ^ 51); M8[p1] = l6; p1++; l4--; if (l4) continue; }
  }                                           // 运行式 XOR 链: out[i] = out[i-1] ^ in[i] ^ 0x33
  ...
  strings_Replace((l3 + 8), p1, p2, 295212);
}
```
`strings_Replace(p0,p1,p2,p3)` = **单字节替换**（old = `M8[p3]`，new 由栈传参、反编译器丢了）。

**调用链**：4 处调用形态完全一致 —— 从 VM 状态里的 `[]string` 取元素（数据指针 `p0+320`、长度 `p0+324`，
元素 8 字节 = ptr+len）交给它解密：
- L5825 在 `(*main._0oOoOO)._oOOooo$bound`
- L6434 在 `(*main._0oOoOO)._O000O0$bound`
- L7692 在 `(*main._0oOoOO)._O0oOo0$bound`
- L12067 在 `(*main._0oOoOO)._0OO0Oo`

⇒ **这就是文章说的「wasm 中 vm 后面的逻辑：拿到加密的环境信息，然后解密」**，落点已确定。

### 5) 零宽分隔符在 wasm 数据段，但码点与文章那版不同

| 位置 | 字节 | 字符 |
|---|---|---|
| `mem[0x3DD28]` | `E2 80 8C` | **U+200C** ZWNJ |
| `mem[0x480F1]` | `E2 80 8E` | **U+200E** LRM |

全 wasm 搜索：`E2 80 8D`（文章的 ZWJ）**0 命中**，`zhihu1` **0 命中**。
⇒ 本 build 把「6 段分隔」从 JS 搬进了 wasm，并改用 U+200C/U+200E。

## wasm 侧还原（本轮新增）

产物：`.probe/wt/new.wat`（新 build 的 WAT）+ `.probe/wt/zse.decompiled.js`（192 函数、0 未处理指令、12,620 行）。

### 0) 地址映射（务必用这个，之前错了）

```
mem(addr) = wasm_file[addr + 0x39d8]        # 由 'NumFieldChanDirstrconv' @file 0x13af9 定位
```
段布局（`wasm-objdump -x`）：
`.rodata` @0x10000/267B，`.rodata.1` @0x10121/247064B，`.data` @0x4C63C/321B，
`.data.1` @0x4C788/1073B，`.data.2..5` @0x4CD15 起各 2B，`.data.6` @0x4CD40/401B。

### 1) VM case 派发表 = 107 路 call_indirect

`wasm-objdump -x` 的 Elem 表逐条列出 `(*main._0oOoOO)._XXX$bound`（func 61..164 共 ~107 个）。
即文章的「`(*main.VM)` 前缀子函数组，每个 case 一个具体逻辑」——现版类型名混淆成 `_0oOoOO`。

### 2) crc32(UA) → 16 进制 → 左补零 = `record93[81:89)`

在 `(*main._0oOoOO)._00oooO`（L9521–11181，1661 行）里：

```js
l4 = (l3 ^ -1);                                        // 0xFFFFFFFF
$L68: while (true) {                                   // slicing-by-8 CRC32
  l4 = (M32[(l6 + (((M8[p1] ^ l4) & 255) << 2))] ^ (l4 >>> 8));
  p1++; l5--; if (l5) continue;
}
p1 = (l4 ^ -1);
strconv_FormatInt((l2+344), BigInt(p1), 16);           // ← 转 16 进制
l4 = M32[l2+348];                                      // 十六进制串长度
if (((8 - l4) > 0)) {                                  // 不足 8 位
  l5 = (9 - l4);
  $L70: while (true) {
    runtime_stringConcat((l2+336), 253248, 1, p1, l4); // ← 前缀补位字符
    ...
    l5--; if ((l5 > 1)) continue;
  }
}
```
补位字符：`mem[253248]` = **`'0'`**（253248 = 0x3DD40）。

### 3) 同一 `'0'` 字面量还用于补到 **4** 位 = `record93[89:93)`

L10508–10532：
```js
if ((l7 >= 4)) { ...按原样用... }        // 长度够 4 位
l6 = (4 - l7);
if ((l6 >= 0)) {
  l3 = runtime_alloc(16);
  __strings_Builder__Grow(l3, l6);
  __strings_Builder__WriteString(l3, 253248, 1);   // 同样是 '0'
  ...
}
```
⇒ `record93[89:93)` 也是一个 **零填充的 4 位十六进制**（源自某个 16 位量），与 crc32 段共用补位字符。

### 4) `main._0oooOO` = 解密 + 替换（文章的「VM 解密环境信息」）

```js
function main__0oooOO(p0 /*ret*/, p1 /*srcPtr*/, p2 /*srcLen*/) {
  l5 = runtime_alloc(p2); memCopy(l5, p1, p2);
  if ((p2 > 0)) {
    l6 = 41;                                  // 种子 0x29
    while (true) { l6 = ((l6 ^ M8[p1]) ^ 51); M8[p1] = l6; p1++; l4--; if (l4) continue; }
  }                                           // 运行式 XOR 链: out[i] = out[i-1] ^ in[i] ^ 0x33
  ...
  strings_Replace((l3 + 8), p1, p2, 295212);
}
```
`strings_Replace(p0,p1,p2,p3)` = **单字节替换**（old = `M8[p3]`，new 由栈传参、反编译器丢了）。

**调用链**：4 处调用形态完全一致 —— 从 VM 状态里的 `[]string` 取元素（数据指针 `p0+320`、长度 `p0+324`，
元素 8 字节 = ptr+len）交给它解密：
- L5825 在 `(*main._0oOoOO)._oOOooo$bound`
- L6434 在 `(*main._0oOoOO)._O000O0$bound`
- L7692 在 `(*main._0oOoOO)._O0oOo0$bound`
- L12067 在 `(*main._0oOoOO)._0OO0Oo`

⇒ **这就是文章说的「wasm 中 vm 后面的逻辑：拿到加密的环境信息，然后解密」**，落点已确定。

### 5) 零宽分隔符在 wasm 数据段，但码点与文章那版不同

| 位置 | 字节 | 字符 |
|---|---|---|
| `mem[0x3DD28]` | `E2 80 8C` | **U+200C** ZWNJ |
| `mem[0x480F1]` | `E2 80 8E` | **U+200E** LRM |

全 wasm 搜索：`E2 80 8D`（文章的 ZWJ）**0 命中**，`zhihu1` **0 命中**。
⇒ 本 build 把「6 段分隔」从 JS 搬进了 wasm，并改用 U+200C/U+200E。

## wasm 侧还原（本轮新增）

产物：`.probe/wt/new.wat`（新 build 的 WAT）+ `.probe/wt/zse.decompiled.js`（192 函数、0 未处理指令、12,620 行）。

### 0) 地址映射（务必用这个，之前错了）

```
mem(addr) = wasm_file[addr + 0x39d8]        # 由 'NumFieldChanDirstrconv' @file 0x13af9 定位
```
段布局（`wasm-objdump -x`）：
`.rodata` @0x10000/267B，`.rodata.1` @0x10121/247064B，`.data` @0x4C63C/321B，
`.data.1` @0x4C788/1073B，`.data.2..5` @0x4CD15 起各 2B，`.data.6` @0x4CD40/401B。

### 1) VM case 派发表 = 107 路 call_indirect

`wasm-objdump -x` 的 Elem 表逐条列出 `(*main._0oOoOO)._XXX$bound`（func 61..164 共 ~107 个）。
即文章的「`(*main.VM)` 前缀子函数组，每个 case 一个具体逻辑」——现版类型名混淆成 `_0oOoOO`。

### 2) crc32(UA) → 16 进制 → 左补零 = `record93[81:89)`

在 `(*main._0oOoOO)._00oooO`（L9521–11181，1661 行）里：

```js
l4 = (l3 ^ -1);                                        // 0xFFFFFFFF
$L68: while (true) {                                   // slicing-by-8 CRC32
  l4 = (M32[(l6 + (((M8[p1] ^ l4) & 255) << 2))] ^ (l4 >>> 8));
  p1++; l5--; if (l5) continue;
}
p1 = (l4 ^ -1);
strconv_FormatInt((l2+344), BigInt(p1), 16);           // ← 转 16 进制
l4 = M32[l2+348];                                      // 十六进制串长度
if (((8 - l4) > 0)) {                                  // 不足 8 位
  l5 = (9 - l4);
  $L70: while (true) {
    runtime_stringConcat((l2+336), 253248, 1, p1, l4); // ← 前缀补位字符
    ...
    l5--; if ((l5 > 1)) continue;
  }
}
```
补位字符：`mem[253248]` = **`'0'`**（253248 = 0x3DD40）。

### 3) 同一 `'0'` 字面量还用于补到 **4** 位 = `record93[89:93)`

L10508–10532：
```js
if ((l7 >= 4)) { ...按原样用... }        // 长度够 4 位
l6 = (4 - l7);
if ((l6 >= 0)) {
  l3 = runtime_alloc(16);
  __strings_Builder__Grow(l3, l6);
  __strings_Builder__WriteString(l3, 253248, 1);   // 同样是 '0'
  ...
}
```
⇒ `record93[89:93)` 也是一个 **零填充的 4 位十六进制**（源自某个 16 位量），与 crc32 段共用补位字符。

### 4) `main._0oooOO` = 解密 + 替换（文章的「VM 解密环境信息」）

```js
function main__0oooOO(p0 /*ret*/, p1 /*srcPtr*/, p2 /*srcLen*/) {
  l5 = runtime_alloc(p2); memCopy(l5, p1, p2);
  if ((p2 > 0)) {
    l6 = 41;                                  // 种子 0x29
    while (true) { l6 = ((l6 ^ M8[p1]) ^ 51); M8[p1] = l6; p1++; l4--; if (l4) continue; }
  }                                           // 运行式 XOR 链: out[i] = out[i-1] ^ in[i] ^ 0x33
  ...
  strings_Replace((l3 + 8), p1, p2, 295212);
}
```
`strings_Replace(p0,p1,p2,p3)` = **单字节替换**（old = `M8[p3]`，new 由栈传参、反编译器丢了）。

**调用链**：4 处调用形态完全一致 —— 从 VM 状态里的 `[]string` 取元素（数据指针 `p0+320`、长度 `p0+324`，
元素 8 字节 = ptr+len）交给它解密：
- L5825 在 `(*main._0oOoOO)._oOOooo$bound`
- L6434 在 `(*main._0oOoOO)._O000O0$bound`
- L7692 在 `(*main._0oOoOO)._O0oOo0$bound`
- L12067 在 `(*main._0oOoOO)._0OO0Oo`

⇒ **这就是文章说的「wasm 中 vm 后面的逻辑：拿到加密的环境信息，然后解密」**，落点已确定。

### 5) 零宽分隔符在 wasm 数据段，但码点与文章那版不同

| 位置 | 字节 | 字符 |
|---|---|---|
| `mem[0x3DD28]` | `E2 80 8C` | **U+200C** ZWNJ |
| `mem[0x480F1]` | `E2 80 8E` | **U+200E** LRM |

全 wasm 搜索：`E2 80 8D`（文章的 ZWJ）**0 命中**，`zhihu1` **0 命中**。
⇒ 本 build 把「6 段分隔」从 JS 搬进了 wasm，并改用 U+200C/U+200E。

## wasm 侧还原（本轮新增）

产物：`.probe/wt/new.wat`（新 build 的 WAT）+ `.probe/wt/zse.decompiled.js`（192 函数、0 未处理指令、12,620 行）。

### 0) 地址映射（务必用这个，之前错了）

```
mem(addr) = wasm_file[addr + 0x39d8]        # 由 'NumFieldChanDirstrconv' @file 0x13af9 定位
```
段布局（`wasm-objdump -x`）：
`.rodata` @0x10000/267B，`.rodata.1` @0x10121/247064B，`.data` @0x4C63C/321B，
`.data.1` @0x4C788/1073B，`.data.2..5` @0x4CD15 起各 2B，`.data.6` @0x4CD40/401B。

### 1) VM case 派发表 = 107 路 call_indirect

`wasm-objdump -x` 的 Elem 表逐条列出 `(*main._0oOoOO)._XXX$bound`（func 61..164 共 ~107 个）。
即文章的「`(*main.VM)` 前缀子函数组，每个 case 一个具体逻辑」——现版类型名混淆成 `_0oOoOO`。

### 2) crc32(UA) → 16 进制 → 左补零 = `record93[81:89)`

在 `(*main._0oOoOO)._00oooO`（L9521–11181，1661 行）里：

```js
l4 = (l3 ^ -1);                                        // 0xFFFFFFFF
$L68: while (true) {                                   // slicing-by-8 CRC32
  l4 = (M32[(l6 + (((M8[p1] ^ l4) & 255) << 2))] ^ (l4 >>> 8));
  p1++; l5--; if (l5) continue;
}
p1 = (l4 ^ -1);
strconv_FormatInt((l2+344), BigInt(p1), 16);           // ← 转 16 进制
l4 = M32[l2+348];                                      // 十六进制串长度
if (((8 - l4) > 0)) {                                  // 不足 8 位
  l5 = (9 - l4);
  $L70: while (true) {
    runtime_stringConcat((l2+336), 253248, 1, p1, l4); // ← 前缀补位字符
    ...
    l5--; if ((l5 > 1)) continue;
  }
}
```
补位字符：`mem[253248]` = **`'0'`**（253248 = 0x3DD40）。

### 3) 同一 `'0'` 字面量还用于补到 **4** 位 = `record93[89:93)`

L10508–10532：
```js
if ((l7 >= 4)) { ...按原样用... }        // 长度够 4 位
l6 = (4 - l7);
if ((l6 >= 0)) {
  l3 = runtime_alloc(16);
  __strings_Builder__Grow(l3, l6);
  __strings_Builder__WriteString(l3, 253248, 1);   // 同样是 '0'
  ...
}
```
⇒ `record93[89:93)` 也是一个 **零填充的 4 位十六进制**（源自某个 16 位量），与 crc32 段共用补位字符。

### 4) `main._0oooOO` = 解密 + 替换（文章的「VM 解密环境信息」）

```js
function main__0oooOO(p0 /*ret*/, p1 /*srcPtr*/, p2 /*srcLen*/) {
  l5 = runtime_alloc(p2); memCopy(l5, p1, p2);
  if ((p2 > 0)) {
    l6 = 41;                                  // 种子 0x29
    while (true) { l6 = ((l6 ^ M8[p1]) ^ 51); M8[p1] = l6; p1++; l4--; if (l4) continue; }
  }                                           // 运行式 XOR 链: out[i] = out[i-1] ^ in[i] ^ 0x33
  ...
  strings_Replace((l3 + 8), p1, p2, 295212);
}
```
`strings_Replace(p0,p1,p2,p3)` = **单字节替换**（old = `M8[p3]`，new 由栈传参、反编译器丢了）。

**调用链**：4 处调用形态完全一致 —— 从 VM 状态里的 `[]string` 取元素（数据指针 `p0+320`、长度 `p0+324`，
元素 8 字节 = ptr+len）交给它解密：
- L5825 在 `(*main._0oOoOO)._oOOooo$bound`
- L6434 在 `(*main._0oOoOO)._O000O0$bound`
- L7692 在 `(*main._0oOoOO)._O0oOo0$bound`
- L12067 在 `(*main._0oOoOO)._0OO0Oo`

⇒ **这就是文章说的「wasm 中 vm 后面的逻辑：拿到加密的环境信息，然后解密」**，落点已确定。

### 5) 零宽分隔符在 wasm 数据段，但码点与文章那版不同

| 位置 | 字节 | 字符 |
|---|---|---|
| `mem[0x3DD28]` | `E2 80 8C` | **U+200C** ZWNJ |
| `mem[0x480F1]` | `E2 80 8E` | **U+200E** LRM |

全 wasm 搜索：`E2 80 8D`（文章的 ZWJ）**0 命中**，`zhihu1` **0 命中**。
⇒ 本 build 把「6 段分隔」从 JS 搬进了 wasm，并改用 U+200C/U+200E。

## wasm 侧还原（本轮新增）

产物：`.probe/wt/new.wat`（新 build 的 WAT）+ `.probe/wt/zse.decompiled.js`（192 函数、0 未处理指令、12,620 行）。

### 0) 地址映射（务必用这个，之前错了）

```
mem(addr) = wasm_file[addr + 0x39d8]        # 由 'NumFieldChanDirstrconv' @file 0x13af9 定位
```
段布局（`wasm-objdump -x`）：
`.rodata` @0x10000/267B，`.rodata.1` @0x10121/247064B，`.data` @0x4C63C/321B，
`.data.1` @0x4C788/1073B，`.data.2..5` @0x4CD15 起各 2B，`.data.6` @0x4CD40/401B。

### 1) VM case 派发表 = 107 路 call_indirect

`wasm-objdump -x` 的 Elem 表逐条列出 `(*main._0oOoOO)._XXX$bound`（func 61..164 共 ~107 个）。
即文章的「`(*main.VM)` 前缀子函数组，每个 case 一个具体逻辑」——现版类型名混淆成 `_0oOoOO`。

### 2) crc32(UA) → 16 进制 → 左补零 = `record93[81:89)`

在 `(*main._0oOoOO)._00oooO`（L9521–11181，1661 行）里：

```js
l4 = (l3 ^ -1);                                        // 0xFFFFFFFF
$L68: while (true) {                                   // slicing-by-8 CRC32
  l4 = (M32[(l6 + (((M8[p1] ^ l4) & 255) << 2))] ^ (l4 >>> 8));
  p1++; l5--; if (l5) continue;
}
p1 = (l4 ^ -1);
strconv_FormatInt((l2+344), BigInt(p1), 16);           // ← 转 16 进制
l4 = M32[l2+348];                                      // 十六进制串长度
if (((8 - l4) > 0)) {                                  // 不足 8 位
  l5 = (9 - l4);
  $L70: while (true) {
    runtime_stringConcat((l2+336), 253248, 1, p1, l4); // ← 前缀补位字符
    ...
    l5--; if ((l5 > 1)) continue;
  }
}
```
补位字符：`mem[253248]` = **`'0'`**（253248 = 0x3DD40）。

### 3) 同一 `'0'` 字面量还用于补到 **4** 位 = `record93[89:93)`

L10508–10532：
```js
if ((l7 >= 4)) { ...按原样用... }        // 长度够 4 位
l6 = (4 - l7);
if ((l6 >= 0)) {
  l3 = runtime_alloc(16);
  __strings_Builder__Grow(l3, l6);
  __strings_Builder__WriteString(l3, 253248, 1);   // 同样是 '0'
  ...
}
```
⇒ `record93[89:93)` 也是一个 **零填充的 4 位十六进制**（源自某个 16 位量），与 crc32 段共用补位字符。

### 4) `main._0oooOO` = 解密 + 替换（文章的「VM 解密环境信息」）

```js
function main__0oooOO(p0 /*ret*/, p1 /*srcPtr*/, p2 /*srcLen*/) {
  l5 = runtime_alloc(p2); memCopy(l5, p1, p2);
  if ((p2 > 0)) {
    l6 = 41;                                  // 种子 0x29
    while (true) { l6 = ((l6 ^ M8[p1]) ^ 51); M8[p1] = l6; p1++; l4--; if (l4) continue; }
  }                                           // 运行式 XOR 链: out[i] = out[i-1] ^ in[i] ^ 0x33
  ...
  strings_Replace((l3 + 8), p1, p2, 295212);
}
```
`strings_Replace(p0,p1,p2,p3)` = **单字节替换**（old = `M8[p3]`，new 由栈传参、反编译器丢了）。

**调用链**：4 处调用形态完全一致 —— 从 VM 状态里的 `[]string` 取元素（数据指针 `p0+320`、长度 `p0+324`，
元素 8 字节 = ptr+len）交给它解密：
- L5825 在 `(*main._0oOoOO)._oOOooo$bound`
- L6434 在 `(*main._0oOoOO)._O000O0$bound`
- L7692 在 `(*main._0oOoOO)._O0oOo0$bound`
- L12067 在 `(*main._0oOoOO)._0OO0Oo`

⇒ **这就是文章说的「wasm 中 vm 后面的逻辑：拿到加密的环境信息，然后解密」**，落点已确定。

### 5) 零宽分隔符在 wasm 数据段，但码点与文章那版不同

| 位置 | 字节 | 字符 |
|---|---|---|
| `mem[0x3DD28]` | `E2 80 8C` | **U+200C** ZWNJ |
| `mem[0x480F1]` | `E2 80 8E` | **U+200E** LRM |

全 wasm 搜索：`E2 80 8D`（文章的 ZWJ）**0 命中**，`zhihu1` **0 命中**。
⇒ 本 build 把「6 段分隔」从 JS 搬进了 wasm，并改用 U+200C/U+200E。

## wasm 侧还原（本轮新增）

产物：`.probe/wt/new.wat`（新 build 的 WAT）+ `.probe/wt/zse.decompiled.js`（192 函数、0 未处理指令、12,620 行）。

### 0) 地址映射（务必用这个，之前错了）

```
mem(addr) = wasm_file[addr + 0x39d8]        # 由 'NumFieldChanDirstrconv' @file 0x13af9 定位
```
段布局（`wasm-objdump -x`）：
`.rodata` @0x10000/267B，`.rodata.1` @0x10121/247064B，`.data` @0x4C63C/321B，
`.data.1` @0x4C788/1073B，`.data.2..5` @0x4CD15 起各 2B，`.data.6` @0x4CD40/401B。

### 1) VM case 派发表 = 107 路 call_indirect

`wasm-objdump -x` 的 Elem 表逐条列出 `(*main._0oOoOO)._XXX$bound`（func 61..164 共 ~107 个）。
即文章的「`(*main.VM)` 前缀子函数组，每个 case 一个具体逻辑」——现版类型名混淆成 `_0oOoOO`。

### 2) crc32(UA) → 16 进制 → 左补零 = `record93[81:89)`

在 `(*main._0oOoOO)._00oooO`（L9521–11181，1661 行）里：

```js
l4 = (l3 ^ -1);                                        // 0xFFFFFFFF
$L68: while (true) {                                   // slicing-by-8 CRC32
  l4 = (M32[(l6 + (((M8[p1] ^ l4) & 255) << 2))] ^ (l4 >>> 8));
  p1++; l5--; if (l5) continue;
}
p1 = (l4 ^ -1);
strconv_FormatInt((l2+344), BigInt(p1), 16);           // ← 转 16 进制
l4 = M32[l2+348];                                      // 十六进制串长度
if (((8 - l4) > 0)) {                                  // 不足 8 位
  l5 = (9 - l4);
  $L70: while (true) {
    runtime_stringConcat((l2+336), 253248, 1, p1, l4); // ← 前缀补位字符
    ...
    l5--; if ((l5 > 1)) continue;
  }
}
```
补位字符：`mem[253248]` = **`'0'`**（253248 = 0x3DD40）。

### 3) 同一 `'0'` 字面量还用于补到 **4** 位 = `record93[89:93)`

L10508–10532：
```js
if ((l7 >= 4)) { ...按原样用... }        // 长度够 4 位
l6 = (4 - l7);
if ((l6 >= 0)) {
  l3 = runtime_alloc(16);
  __strings_Builder__Grow(l3, l6);
  __strings_Builder__WriteString(l3, 253248, 1);   // 同样是 '0'
  ...
}
```
⇒ `record93[89:93)` 也是一个 **零填充的 4 位十六进制**（源自某个 16 位量），与 crc32 段共用补位字符。

### 4) `main._0oooOO` = 解密 + 替换（文章的「VM 解密环境信息」）

```js
function main__0oooOO(p0 /*ret*/, p1 /*srcPtr*/, p2 /*srcLen*/) {
  l5 = runtime_alloc(p2); memCopy(l5, p1, p2);
  if ((p2 > 0)) {
    l6 = 41;                                  // 种子 0x29
    while (true) { l6 = ((l6 ^ M8[p1]) ^ 51); M8[p1] = l6; p1++; l4--; if (l4) continue; }
  }                                           // 运行式 XOR 链: out[i] = out[i-1] ^ in[i] ^ 0x33
  ...
  strings_Replace((l3 + 8), p1, p2, 295212);
}
```
`strings_Replace(p0,p1,p2,p3)` = **单字节替换**（old = `M8[p3]`，new 由栈传参、反编译器丢了）。

**调用链**：4 处调用形态完全一致 —— 从 VM 状态里的 `[]string` 取元素（数据指针 `p0+320`、长度 `p0+324`，
元素 8 字节 = ptr+len）交给它解密：
- L5825 在 `(*main._0oOoOO)._oOOooo$bound`
- L6434 在 `(*main._0oOoOO)._O000O0$bound`
- L7692 在 `(*main._0oOoOO)._O0oOo0$bound`
- L12067 在 `(*main._0oOoOO)._0OO0Oo`

⇒ **这就是文章说的「wasm 中 vm 后面的逻辑：拿到加密的环境信息，然后解密」**，落点已确定。

### 5) 零宽分隔符在 wasm 数据段，但码点与文章那版不同

| 位置 | 字节 | 字符 |
|---|---|---|
| `mem[0x3DD28]` | `E2 80 8C` | **U+200C** ZWNJ |
| `mem[0x480F1]` | `E2 80 8E` | **U+200E** LRM |

全 wasm 搜索：`E2 80 8D`（文章的 ZWJ）**0 命中**，`zhihu1` **0 命中**。
⇒ 本 build 把「6 段分隔」从 JS 搬进了 wasm，并改用 U+200C/U+200E。

## wasm VM 内部模型（本轮新增，107 个 case 已建表）

产物：`.probe/zsec/map_cases.py`（case 总表）。

### 1) VM 状态与类型标签

`_0ooO0o`（L11182，24 行）= **从操作数栈弹出一个字符串**：

```js
function __main__0oOoOO___0ooO0o(p0 /*ret*/, p1 /*VM state*/) {
  l2 = M32[p1 + 300];                 // 栈顶指针
  l2 = (l2 - 1);
  if ((l2 > M32[(p1 + 304)])) panic;  // 上限
  l3 = (M32[p1 + 296] + (l2 << 3));   // 元素 8 字节 = (typeTag, valuePtr)
  l4 = M32[l3 + 4];
  M32[p1 + 300] = l2;
  if ((M32[l3] !== 71680)) panic;     // 类型必须是 string
  M64[p0] = M64[l4];                  // 返回 (ptr,len)
}
```

| VM 状态字段 | 含义 |
|---|---|
| `p0/p1 + 296` | 操作数栈数据指针 |
| `+ 300` | 栈顶（向下增长，push 前减） |
| `+ 304` | 栈上限 |
| `+ 320 / + 324` | 一个 `[]string` 的数据/长度（被 `main._0oooOO` 解密的密文就在这） |
| `+ 276 / + 280` | 结果寄存器（类型标签 / 数据指针） |

类型标签：`71680`(0x11800)=string，`253228`(0x3DD2C)=`[]string`。

### 2) `(*main._0oOoOO)._00oooO` = 环境信息处理主 case（1661 行）

调用顺序（按行号）：

| 行 | 调用 | 说明 |
|---|---|---|
| L10280–10293 | `_0ooO0o` → `syscall_js.Value.Get` → `.Call` → `.String` | **从 JS 侧取值**（拿加密环境信息） |
| L10294 | `strings_Replace(dst, p1, len, 71816)` | 单字节替换 |
| L10387 | `base64.DecodeString(dst, p1, 71836, 181388)` | 解一段 181388 字符 base64 |
| L10451 | `base64.DecodeString(dst, 312892, …)` | 再解一段 |
| **L10477** | `strings_Split(dst, p1, len, 253224)` | **按 U+200C 分割** → `[]string`（类型标签 253228） |
| L10577 | `stringConcat(dst, p1, M32[l2+652], l8, 4)` | 拼 4 字符 |
| L10250 / L10258 | `FormatInt(crc,16)` / `stringConcat(…, 253248, 1, …)` | crc32 → 16 进制 → `'0'` 补到 8 位 |
| L10866 | `FormatInt(l4, 16)` | 再转一次 16 进制（对应补到 4 位那段） |
| **L11109** | `strings_Split(dst, p1, len, 295153)` | **按 U+200E 分割** → `[]string` |

⇒ 文章的「wasm 中 vm 后面的逻辑：拿到加密环境信息 → 解密 → 分 6 段」，
在 `_00oooO` 里**逐环节都能对上**：JS 取值 → Replace → base64 解码 → 按两个零宽符 Split。

### 3) 分隔符（数据段实证）

| 地址 | 字节 | 字符 | 用途 |
|---|---|---|---|
| `mem[0x3DD28]` = 253224 | `E2 80 8C` | U+200C ZWNJ | L10477 的 Split 分隔符 |
| `mem[0x480F1]` = 295153 | `E2 80 8E` | U+200E LRM | L11109 的 Split 分隔符 |
| `mem[0x3DD40]` = 253248 | `'0'` | — | crc32/尾部 十六进制补位字符 |

`E2 80 8D`（文章那版的 ZWJ）与 `zhihu1` 在全 wasm **0 命中**。

### 4) 4 个 case 会调用 `main._0oooOO`（解密 + 单字节替换）

`_oOOooo`(L5825) / `_O000O0`(L6434) / `_O0oOo0`(L7692) / `_O0O00o`(L12067)，
均从 VM 状态 `[]string`（`p0+320/+324`）取元素解密。

## wasm VM 内部模型（本轮新增，107 个 case 已建表）

产物：`.probe/zsec/map_cases.py`（case 总表）。

### 1) VM 状态与类型标签

`_0ooO0o`（L11182，24 行）= **从操作数栈弹出一个字符串**：

```js
function __main__0oOoOO___0ooO0o(p0 /*ret*/, p1 /*VM state*/) {
  l2 = M32[p1 + 300];                 // 栈顶指针
  l2 = (l2 - 1);
  if ((l2 > M32[(p1 + 304)])) panic;  // 上限
  l3 = (M32[p1 + 296] + (l2 << 3));   // 元素 8 字节 = (typeTag, valuePtr)
  l4 = M32[l3 + 4];
  M32[p1 + 300] = l2;
  if ((M32[l3] !== 71680)) panic;     // 类型必须是 string
  M64[p0] = M64[l4];                  // 返回 (ptr,len)
}
```

| VM 状态字段 | 含义 |
|---|---|
| `p0/p1 + 296` | 操作数栈数据指针 |
| `+ 300` | 栈顶（向下增长，push 前减） |
| `+ 304` | 栈上限 |
| `+ 320 / + 324` | 一个 `[]string` 的数据/长度（被 `main._0oooOO` 解密的密文就在这） |
| `+ 276 / + 280` | 结果寄存器（类型标签 / 数据指针） |

类型标签：`71680`(0x11800)=string，`253228`(0x3DD2C)=`[]string`。

### 2) `(*main._0oOoOO)._00oooO` = 环境信息处理主 case（1661 行）

调用顺序（按行号）：

| 行 | 调用 | 说明 |
|---|---|---|
| L10280–10293 | `_0ooO0o` → `syscall_js.Value.Get` → `.Call` → `.String` | **从 JS 侧取值**（拿加密环境信息） |
| L10294 | `strings_Replace(dst, p1, len, 71816)` | 单字节替换 |
| L10387 | `base64.DecodeString(dst, p1, 71836, 181388)` | 解一段 181388 字符 base64 |
| L10451 | `base64.DecodeString(dst, 312892, …)` | 再解一段 |
| **L10477** | `strings_Split(dst, p1, len, 253224)` | **按 U+200C 分割** → `[]string`（类型标签 253228） |
| L10577 | `stringConcat(dst, p1, M32[l2+652], l8, 4)` | 拼 4 字符 |
| L10250 / L10258 | `FormatInt(crc,16)` / `stringConcat(…, 253248, 1, …)` | crc32 → 16 进制 → `'0'` 补到 8 位 |
| L10866 | `FormatInt(l4, 16)` | 再转一次 16 进制（对应补到 4 位那段） |
| **L11109** | `strings_Split(dst, p1, len, 295153)` | **按 U+200E 分割** → `[]string` |

⇒ 文章的「wasm 中 vm 后面的逻辑：拿到加密环境信息 → 解密 → 分 6 段」，
在 `_00oooO` 里**逐环节都能对上**：JS 取值 → Replace → base64 解码 → 按两个零宽符 Split。

### 3) 分隔符（数据段实证）

| 地址 | 字节 | 字符 | 用途 |
|---|---|---|---|
| `mem[0x3DD28]` = 253224 | `E2 80 8C` | U+200C ZWNJ | L10477 的 Split 分隔符 |
| `mem[0x480F1]` = 295153 | `E2 80 8E` | U+200E LRM | L11109 的 Split 分隔符 |
| `mem[0x3DD40]` = 253248 | `'0'` | — | crc32/尾部 十六进制补位字符 |

`E2 80 8D`（文章那版的 ZWJ）与 `zhihu1` 在全 wasm **0 命中**。

### 4) 4 个 case 会调用 `main._0oooOO`（解密 + 单字节替换）

`_oOOooo`(L5825) / `_O000O0`(L6434) / `_O0oOo0`(L7692) / `_O0O00o`(L12067)，
均从 VM 状态 `[]string`（`p0+320/+324`）取元素解密。

## wasm VM 内部模型（本轮新增，107 个 case 已建表）

产物：`.probe/zsec/map_cases.py`（case 总表）。

### 1) VM 状态与类型标签

`_0ooO0o`（L11182，24 行）= **从操作数栈弹出一个字符串**：

```js
function __main__0oOoOO___0ooO0o(p0 /*ret*/, p1 /*VM state*/) {
  l2 = M32[p1 + 300];                 // 栈顶指针
  l2 = (l2 - 1);
  if ((l2 > M32[(p1 + 304)])) panic;  // 上限
  l3 = (M32[p1 + 296] + (l2 << 3));   // 元素 8 字节 = (typeTag, valuePtr)
  l4 = M32[l3 + 4];
  M32[p1 + 300] = l2;
  if ((M32[l3] !== 71680)) panic;     // 类型必须是 string
  M64[p0] = M64[l4];                  // 返回 (ptr,len)
}
```

| VM 状态字段 | 含义 |
|---|---|
| `p0/p1 + 296` | 操作数栈数据指针 |
| `+ 300` | 栈顶（向下增长，push 前减） |
| `+ 304` | 栈上限 |
| `+ 320 / + 324` | 一个 `[]string` 的数据/长度（被 `main._0oooOO` 解密的密文就在这） |
| `+ 276 / + 280` | 结果寄存器（类型标签 / 数据指针） |

类型标签：`71680`(0x11800)=string，`253228`(0x3DD2C)=`[]string`。

### 2) `(*main._0oOoOO)._00oooO` = 环境信息处理主 case（1661 行）

调用顺序（按行号）：

| 行 | 调用 | 说明 |
|---|---|---|
| L10280–10293 | `_0ooO0o` → `syscall_js.Value.Get` → `.Call` → `.String` | **从 JS 侧取值**（拿加密环境信息） |
| L10294 | `strings_Replace(dst, p1, len, 71816)` | 单字节替换 |
| L10387 | `base64.DecodeString(dst, p1, 71836, 181388)` | 解一段 181388 字符 base64 |
| L10451 | `base64.DecodeString(dst, 312892, …)` | 再解一段 |
| **L10477** | `strings_Split(dst, p1, len, 253224)` | **按 U+200C 分割** → `[]string`（类型标签 253228） |
| L10577 | `stringConcat(dst, p1, M32[l2+652], l8, 4)` | 拼 4 字符 |
| L10250 / L10258 | `FormatInt(crc,16)` / `stringConcat(…, 253248, 1, …)` | crc32 → 16 进制 → `'0'` 补到 8 位 |
| L10866 | `FormatInt(l4, 16)` | 再转一次 16 进制（对应补到 4 位那段） |
| **L11109** | `strings_Split(dst, p1, len, 295153)` | **按 U+200E 分割** → `[]string` |

⇒ 文章的「wasm 中 vm 后面的逻辑：拿到加密环境信息 → 解密 → 分 6 段」，
在 `_00oooO` 里**逐环节都能对上**：JS 取值 → Replace → base64 解码 → 按两个零宽符 Split。

### 3) 分隔符（数据段实证）

| 地址 | 字节 | 字符 | 用途 |
|---|---|---|---|
| `mem[0x3DD28]` = 253224 | `E2 80 8C` | U+200C ZWNJ | L10477 的 Split 分隔符 |
| `mem[0x480F1]` = 295153 | `E2 80 8E` | U+200E LRM | L11109 的 Split 分隔符 |
| `mem[0x3DD40]` = 253248 | `'0'` | — | crc32/尾部 十六进制补位字符 |

`E2 80 8D`（文章那版的 ZWJ）与 `zhihu1` 在全 wasm **0 命中**。

### 4) 4 个 case 会调用 `main._0oooOO`（解密 + 单字节替换）

`_oOOooo`(L5825) / `_O000O0`(L6434) / `_O0oOo0`(L7692) / `_O0O00o`(L12067)，
均从 VM 状态 `[]string`（`p0+320/+324`）取元素解密。

## wasm VM 内部模型（本轮新增，107 个 case 已建表）

产物：`.probe/zsec/map_cases.py`（case 总表）。

### 1) VM 状态与类型标签

`_0ooO0o`（L11182，24 行）= **从操作数栈弹出一个字符串**：

```js
function __main__0oOoOO___0ooO0o(p0 /*ret*/, p1 /*VM state*/) {
  l2 = M32[p1 + 300];                 // 栈顶指针
  l2 = (l2 - 1);
  if ((l2 > M32[(p1 + 304)])) panic;  // 上限
  l3 = (M32[p1 + 296] + (l2 << 3));   // 元素 8 字节 = (typeTag, valuePtr)
  l4 = M32[l3 + 4];
  M32[p1 + 300] = l2;
  if ((M32[l3] !== 71680)) panic;     // 类型必须是 string
  M64[p0] = M64[l4];                  // 返回 (ptr,len)
}
```

| VM 状态字段 | 含义 |
|---|---|
| `p0/p1 + 296` | 操作数栈数据指针 |
| `+ 300` | 栈顶（向下增长，push 前减） |
| `+ 304` | 栈上限 |
| `+ 320 / + 324` | 一个 `[]string` 的数据/长度（被 `main._0oooOO` 解密的密文就在这） |
| `+ 276 / + 280` | 结果寄存器（类型标签 / 数据指针） |

类型标签：`71680`(0x11800)=string，`253228`(0x3DD2C)=`[]string`。

### 2) `(*main._0oOoOO)._00oooO` = 环境信息处理主 case（1661 行）

调用顺序（按行号）：

| 行 | 调用 | 说明 |
|---|---|---|
| L10280–10293 | `_0ooO0o` → `syscall_js.Value.Get` → `.Call` → `.String` | **从 JS 侧取值**（拿加密环境信息） |
| L10294 | `strings_Replace(dst, p1, len, 71816)` | 单字节替换 |
| L10387 | `base64.DecodeString(dst, p1, 71836, 181388)` | 解一段 181388 字符 base64 |
| L10451 | `base64.DecodeString(dst, 312892, …)` | 再解一段 |
| **L10477** | `strings_Split(dst, p1, len, 253224)` | **按 U+200C 分割** → `[]string`（类型标签 253228） |
| L10577 | `stringConcat(dst, p1, M32[l2+652], l8, 4)` | 拼 4 字符 |
| L10250 / L10258 | `FormatInt(crc,16)` / `stringConcat(…, 253248, 1, …)` | crc32 → 16 进制 → `'0'` 补到 8 位 |
| L10866 | `FormatInt(l4, 16)` | 再转一次 16 进制（对应补到 4 位那段） |
| **L11109** | `strings_Split(dst, p1, len, 295153)` | **按 U+200E 分割** → `[]string` |

⇒ 文章的「wasm 中 vm 后面的逻辑：拿到加密环境信息 → 解密 → 分 6 段」，
在 `_00oooO` 里**逐环节都能对上**：JS 取值 → Replace → base64 解码 → 按两个零宽符 Split。

### 3) 分隔符（数据段实证）

| 地址 | 字节 | 字符 | 用途 |
|---|---|---|---|
| `mem[0x3DD28]` = 253224 | `E2 80 8C` | U+200C ZWNJ | L10477 的 Split 分隔符 |
| `mem[0x480F1]` = 295153 | `E2 80 8E` | U+200E LRM | L11109 的 Split 分隔符 |
| `mem[0x3DD40]` = 253248 | `'0'` | — | crc32/尾部 十六进制补位字符 |

`E2 80 8D`（文章那版的 ZWJ）与 `zhihu1` 在全 wasm **0 命中**。

### 4) 4 个 case 会调用 `main._0oooOO`（解密 + 单字节替换）

`_oOOooo`(L5825) / `_O000O0`(L6434) / `_O0oOo0`(L7692) / `_O0O00o`(L12067)，
均从 VM 状态 `[]string`（`p0+320/+324`）取元素解密。

## wasm VM 内部模型（本轮新增，107 个 case 已建表）

产物：`.probe/zsec/map_cases.py`（case 总表）。

### 1) VM 状态与类型标签

`_0ooO0o`（L11182，24 行）= **从操作数栈弹出一个字符串**：

```js
function __main__0oOoOO___0ooO0o(p0 /*ret*/, p1 /*VM state*/) {
  l2 = M32[p1 + 300];                 // 栈顶指针
  l2 = (l2 - 1);
  if ((l2 > M32[(p1 + 304)])) panic;  // 上限
  l3 = (M32[p1 + 296] + (l2 << 3));   // 元素 8 字节 = (typeTag, valuePtr)
  l4 = M32[l3 + 4];
  M32[p1 + 300] = l2;
  if ((M32[l3] !== 71680)) panic;     // 类型必须是 string
  M64[p0] = M64[l4];                  // 返回 (ptr,len)
}
```

| VM 状态字段 | 含义 |
|---|---|
| `p0/p1 + 296` | 操作数栈数据指针 |
| `+ 300` | 栈顶（向下增长，push 前减） |
| `+ 304` | 栈上限 |
| `+ 320 / + 324` | 一个 `[]string` 的数据/长度（被 `main._0oooOO` 解密的密文就在这） |
| `+ 276 / + 280` | 结果寄存器（类型标签 / 数据指针） |

类型标签：`71680`(0x11800)=string，`253228`(0x3DD2C)=`[]string`。

### 2) `(*main._0oOoOO)._00oooO` = 环境信息处理主 case（1661 行）

调用顺序（按行号）：

| 行 | 调用 | 说明 |
|---|---|---|
| L10280–10293 | `_0ooO0o` → `syscall_js.Value.Get` → `.Call` → `.String` | **从 JS 侧取值**（拿加密环境信息） |
| L10294 | `strings_Replace(dst, p1, len, 71816)` | 单字节替换 |
| L10387 | `base64.DecodeString(dst, p1, 71836, 181388)` | 解一段 181388 字符 base64 |
| L10451 | `base64.DecodeString(dst, 312892, …)` | 再解一段 |
| **L10477** | `strings_Split(dst, p1, len, 253224)` | **按 U+200C 分割** → `[]string`（类型标签 253228） |
| L10577 | `stringConcat(dst, p1, M32[l2+652], l8, 4)` | 拼 4 字符 |
| L10250 / L10258 | `FormatInt(crc,16)` / `stringConcat(…, 253248, 1, …)` | crc32 → 16 进制 → `'0'` 补到 8 位 |
| L10866 | `FormatInt(l4, 16)` | 再转一次 16 进制（对应补到 4 位那段） |
| **L11109** | `strings_Split(dst, p1, len, 295153)` | **按 U+200E 分割** → `[]string` |

⇒ 文章的「wasm 中 vm 后面的逻辑：拿到加密环境信息 → 解密 → 分 6 段」，
在 `_00oooO` 里**逐环节都能对上**：JS 取值 → Replace → base64 解码 → 按两个零宽符 Split。

### 3) 分隔符（数据段实证）

| 地址 | 字节 | 字符 | 用途 |
|---|---|---|---|
| `mem[0x3DD28]` = 253224 | `E2 80 8C` | U+200C ZWNJ | L10477 的 Split 分隔符 |
| `mem[0x480F1]` = 295153 | `E2 80 8E` | U+200E LRM | L11109 的 Split 分隔符 |
| `mem[0x3DD40]` = 253248 | `'0'` | — | crc32/尾部 十六进制补位字符 |

`E2 80 8D`（文章那版的 ZWJ）与 `zhihu1` 在全 wasm **0 命中**。

### 4) 4 个 case 会调用 `main._0oooOO`（解密 + 单字节替换）

`_oOOooo`(L5825) / `_O000O0`(L6434) / `_O0oOo0`(L7692) / `_O0O00o`(L12067)，
均从 VM 状态 `[]string`（`p0+320/+324`）取元素解密。

## wasm VM 内部模型（本轮新增，107 个 case 已建表）

产物：`.probe/zsec/map_cases.py`（case 总表）。

### 1) VM 状态与类型标签

`_0ooO0o`（L11182，24 行）= **从操作数栈弹出一个字符串**：

```js
function __main__0oOoOO___0ooO0o(p0 /*ret*/, p1 /*VM state*/) {
  l2 = M32[p1 + 300];                 // 栈顶指针
  l2 = (l2 - 1);
  if ((l2 > M32[(p1 + 304)])) panic;  // 上限
  l3 = (M32[p1 + 296] + (l2 << 3));   // 元素 8 字节 = (typeTag, valuePtr)
  l4 = M32[l3 + 4];
  M32[p1 + 300] = l2;
  if ((M32[l3] !== 71680)) panic;     // 类型必须是 string
  M64[p0] = M64[l4];                  // 返回 (ptr,len)
}
```

| VM 状态字段 | 含义 |
|---|---|
| `p0/p1 + 296` | 操作数栈数据指针 |
| `+ 300` | 栈顶（向下增长，push 前减） |
| `+ 304` | 栈上限 |
| `+ 320 / + 324` | 一个 `[]string` 的数据/长度（被 `main._0oooOO` 解密的密文就在这） |
| `+ 276 / + 280` | 结果寄存器（类型标签 / 数据指针） |

类型标签：`71680`(0x11800)=string，`253228`(0x3DD2C)=`[]string`。

### 2) `(*main._0oOoOO)._00oooO` = 环境信息处理主 case（1661 行）

调用顺序（按行号）：

| 行 | 调用 | 说明 |
|---|---|---|
| L10280–10293 | `_0ooO0o` → `syscall_js.Value.Get` → `.Call` → `.String` | **从 JS 侧取值**（拿加密环境信息） |
| L10294 | `strings_Replace(dst, p1, len, 71816)` | 单字节替换 |
| L10387 | `base64.DecodeString(dst, p1, 71836, 181388)` | 解一段 181388 字符 base64 |
| L10451 | `base64.DecodeString(dst, 312892, …)` | 再解一段 |
| **L10477** | `strings_Split(dst, p1, len, 253224)` | **按 U+200C 分割** → `[]string`（类型标签 253228） |
| L10577 | `stringConcat(dst, p1, M32[l2+652], l8, 4)` | 拼 4 字符 |
| L10250 / L10258 | `FormatInt(crc,16)` / `stringConcat(…, 253248, 1, …)` | crc32 → 16 进制 → `'0'` 补到 8 位 |
| L10866 | `FormatInt(l4, 16)` | 再转一次 16 进制（对应补到 4 位那段） |
| **L11109** | `strings_Split(dst, p1, len, 295153)` | **按 U+200E 分割** → `[]string` |

⇒ 文章的「wasm 中 vm 后面的逻辑：拿到加密环境信息 → 解密 → 分 6 段」，
在 `_00oooO` 里**逐环节都能对上**：JS 取值 → Replace → base64 解码 → 按两个零宽符 Split。

### 3) 分隔符（数据段实证）

| 地址 | 字节 | 字符 | 用途 |
|---|---|---|---|
| `mem[0x3DD28]` = 253224 | `E2 80 8C` | U+200C ZWNJ | L10477 的 Split 分隔符 |
| `mem[0x480F1]` = 295153 | `E2 80 8E` | U+200E LRM | L11109 的 Split 分隔符 |
| `mem[0x3DD40]` = 253248 | `'0'` | — | crc32/尾部 十六进制补位字符 |

`E2 80 8D`（文章那版的 ZWJ）与 `zhihu1` 在全 wasm **0 命中**。

### 4) 4 个 case 会调用 `main._0oooOO`（解密 + 单字节替换）

`_oOOooo`(L5825) / `_O000O0`(L6434) / `_O0oOo0`(L7692) / `_O0O00o`(L12067)，
均从 VM 状态 `[]string`（`p0+320/+324`）取元素解密。

## wasm VM 的 35 臂 opcode 表（本轮核心产出）

`(*main._0oOoOO)._00oooO(p0=VM state, p1=opcode)` 就是 VM 的**主派发器**：
开头 36 个嵌套块 `$B0{…$B43{ switch(p1){case 0: break $B43; … case 34: break $B10; default: break $B3;} }}`。
块嵌套 = 代码行序，故各 case 实体按 `$B` 编号降序依次排列。
工具：`.probe/zsec/map_switch.py`（可复跑）。

| opcode | 行范围 | 行数 | 用到的原语 |
|---|---|---|---|
| 0 | 9613–9651 | 39 | pop, stringNext, stringFromUnicode, concat — **XOR 解密**（`(l3 ^ M8[..]) ^ l4`，`l3 = M32[p0+408]`） |
| 1 | 9652–9675 | 24 | |
| 3 | 9676–9701 | 26 | |
| 4 | 9702–9728 | 27 | |
| 5 | 9729–9767 | 39 | |
| 6 | 9768–9801 | 34 | |
| 7 | 9802–9919 | 118 | |
| 8 | 9920–9965 | 46 | |
| 9 | 9966–10019 | 54 | |
| 10 | 10020–10062 | 43 | stringFromUnicode |
| 11 | 10063–10110 | 48 | pop, jsGet |
| 12 | 10111–10138 | 28 | pop, jsGet |
| **13** | 10139–10275 | 137 | **crc32, FormatInt(…,16), concat, `'0'`** → `record93[81:89)` |
| **14** | 10276–10307 | 32 | **jsGet, jsCall, pop, strings_Replace** → 从 JS 取值后替换 |
| 15 | 10308–10338 | 31 | pop, jsGet, jsCall |
| 16 | 10339–10372 | 34 | |
| **17** | 10373–10434 | 62 | **jsGet, jsCall, pop, base64.DecodeString**（解 181388 字符那段） |
| 18 | 10435–10473 | 39 | base64.DecodeString |
| **19** | 10474–10489 | 16 | **pop, strings_Split(…, 253224)** → **按 U+200C 分割** |
| **20** | 10490–10589 | 100 | pop, concat, `'0'` → **补到 4 位**（`record93[89:93)`） |
| 21 | 10590–10617 | 28 | |
| 22 | 10618–10674 | 57 | pop, jsGet, jsCall |
| 23 | 10675–10753 | 79 | stringNext |
| 24 | 10754–10790 | 37 | pop |
| 25 | 10791–10811 | 21 | pop, jsGet |
| 26 | 10812–10849 | 38 | pop, jsGet |
| 27 | 10850–10878 | 29 | FormatInt(…,16) |
| 28 | 10879–10909 | 31 | pop, jsGet |
| 29 | 10910–10944 | 35 | pop, jsGet, jsCall |
| 30 | 10945–10991 | 47 | pop, jsGet, jsCall |
| 31 | 10992–11030 | 39 | pop, jsGet |
| 32 | 11031–11058 | 28 | pop, jsGet, jsCall |
| 33 | 11059–11105 | 47 | pop, jsGet, jsCall |
| **34** | 11106–11155 | 50 | **pop, strings_Split(…, 295153)** → **按 U+200E 分割** |
| default(2) | 11156–11181 | 26 | 返回 |

⇒ 文章作者用 IDA 手工建的那张「35 臂 ISA 表」，现在从反编译的 Go 代码里**完整重建**了，
每臂都带行范围和用到的原语。明文装配相关的臂：**13(crc32/补8位)、20(补4位)、
14(JS取值+替换)、17/18(base64)、19(按 U+200C 分割)、34(按 U+200E 分割)、0(XOR解密)**。

## wasm VM 的 35 臂 opcode 表（本轮核心产出）

`(*main._0oOoOO)._00oooO(p0=VM state, p1=opcode)` 就是 VM 的**主派发器**：
开头 36 个嵌套块 `$B0{…$B43{ switch(p1){case 0: break $B43; … case 34: break $B10; default: break $B3;} }}`。
块嵌套 = 代码行序，故各 case 实体按 `$B` 编号降序依次排列。
工具：`.probe/zsec/map_switch.py`（可复跑）。

| opcode | 行范围 | 行数 | 用到的原语 |
|---|---|---|---|
| 0 | 9613–9651 | 39 | pop, stringNext, stringFromUnicode, concat — **XOR 解密**（`(l3 ^ M8[..]) ^ l4`，`l3 = M32[p0+408]`） |
| 1 | 9652–9675 | 24 | |
| 3 | 9676–9701 | 26 | |
| 4 | 9702–9728 | 27 | |
| 5 | 9729–9767 | 39 | |
| 6 | 9768–9801 | 34 | |
| 7 | 9802–9919 | 118 | |
| 8 | 9920–9965 | 46 | |
| 9 | 9966–10019 | 54 | |
| 10 | 10020–10062 | 43 | stringFromUnicode |
| 11 | 10063–10110 | 48 | pop, jsGet |
| 12 | 10111–10138 | 28 | pop, jsGet |
| **13** | 10139–10275 | 137 | **crc32, FormatInt(…,16), concat, `'0'`** → `record93[81:89)` |
| **14** | 10276–10307 | 32 | **jsGet, jsCall, pop, strings_Replace** → 从 JS 取值后替换 |
| 15 | 10308–10338 | 31 | pop, jsGet, jsCall |
| 16 | 10339–10372 | 34 | |
| **17** | 10373–10434 | 62 | **jsGet, jsCall, pop, base64.DecodeString**（解 181388 字符那段） |
| 18 | 10435–10473 | 39 | base64.DecodeString |
| **19** | 10474–10489 | 16 | **pop, strings_Split(…, 253224)** → **按 U+200C 分割** |
| **20** | 10490–10589 | 100 | pop, concat, `'0'` → **补到 4 位**（`record93[89:93)`） |
| 21 | 10590–10617 | 28 | |
| 22 | 10618–10674 | 57 | pop, jsGet, jsCall |
| 23 | 10675–10753 | 79 | stringNext |
| 24 | 10754–10790 | 37 | pop |
| 25 | 10791–10811 | 21 | pop, jsGet |
| 26 | 10812–10849 | 38 | pop, jsGet |
| 27 | 10850–10878 | 29 | FormatInt(…,16) |
| 28 | 10879–10909 | 31 | pop, jsGet |
| 29 | 10910–10944 | 35 | pop, jsGet, jsCall |
| 30 | 10945–10991 | 47 | pop, jsGet, jsCall |
| 31 | 10992–11030 | 39 | pop, jsGet |
| 32 | 11031–11058 | 28 | pop, jsGet, jsCall |
| 33 | 11059–11105 | 47 | pop, jsGet, jsCall |
| **34** | 11106–11155 | 50 | **pop, strings_Split(…, 295153)** → **按 U+200E 分割** |
| default(2) | 11156–11181 | 26 | 返回 |

⇒ 文章作者用 IDA 手工建的那张「35 臂 ISA 表」，现在从反编译的 Go 代码里**完整重建**了，
每臂都带行范围和用到的原语。明文装配相关的臂：**13(crc32/补8位)、20(补4位)、
14(JS取值+替换)、17/18(base64)、19(按 U+200C 分割)、34(按 U+200E 分割)、0(XOR解密)**。

## wasm VM 的 35 臂 opcode 表（本轮核心产出）

`(*main._0oOoOO)._00oooO(p0=VM state, p1=opcode)` 就是 VM 的**主派发器**：
开头 36 个嵌套块 `$B0{…$B43{ switch(p1){case 0: break $B43; … case 34: break $B10; default: break $B3;} }}`。
块嵌套 = 代码行序，故各 case 实体按 `$B` 编号降序依次排列。
工具：`.probe/zsec/map_switch.py`（可复跑）。

| opcode | 行范围 | 行数 | 用到的原语 |
|---|---|---|---|
| 0 | 9613–9651 | 39 | pop, stringNext, stringFromUnicode, concat — **XOR 解密**（`(l3 ^ M8[..]) ^ l4`，`l3 = M32[p0+408]`） |
| 1 | 9652–9675 | 24 | |
| 3 | 9676–9701 | 26 | |
| 4 | 9702–9728 | 27 | |
| 5 | 9729–9767 | 39 | |
| 6 | 9768–9801 | 34 | |
| 7 | 9802–9919 | 118 | |
| 8 | 9920–9965 | 46 | |
| 9 | 9966–10019 | 54 | |
| 10 | 10020–10062 | 43 | stringFromUnicode |
| 11 | 10063–10110 | 48 | pop, jsGet |
| 12 | 10111–10138 | 28 | pop, jsGet |
| **13** | 10139–10275 | 137 | **crc32, FormatInt(…,16), concat, `'0'`** → `record93[81:89)` |
| **14** | 10276–10307 | 32 | **jsGet, jsCall, pop, strings_Replace** → 从 JS 取值后替换 |
| 15 | 10308–10338 | 31 | pop, jsGet, jsCall |
| 16 | 10339–10372 | 34 | |
| **17** | 10373–10434 | 62 | **jsGet, jsCall, pop, base64.DecodeString**（解 181388 字符那段） |
| 18 | 10435–10473 | 39 | base64.DecodeString |
| **19** | 10474–10489 | 16 | **pop, strings_Split(…, 253224)** → **按 U+200C 分割** |
| **20** | 10490–10589 | 100 | pop, concat, `'0'` → **补到 4 位**（`record93[89:93)`） |
| 21 | 10590–10617 | 28 | |
| 22 | 10618–10674 | 57 | pop, jsGet, jsCall |
| 23 | 10675–10753 | 79 | stringNext |
| 24 | 10754–10790 | 37 | pop |
| 25 | 10791–10811 | 21 | pop, jsGet |
| 26 | 10812–10849 | 38 | pop, jsGet |
| 27 | 10850–10878 | 29 | FormatInt(…,16) |
| 28 | 10879–10909 | 31 | pop, jsGet |
| 29 | 10910–10944 | 35 | pop, jsGet, jsCall |
| 30 | 10945–10991 | 47 | pop, jsGet, jsCall |
| 31 | 10992–11030 | 39 | pop, jsGet |
| 32 | 11031–11058 | 28 | pop, jsGet, jsCall |
| 33 | 11059–11105 | 47 | pop, jsGet, jsCall |
| **34** | 11106–11155 | 50 | **pop, strings_Split(…, 295153)** → **按 U+200E 分割** |
| default(2) | 11156–11181 | 26 | 返回 |

⇒ 文章作者用 IDA 手工建的那张「35 臂 ISA 表」，现在从反编译的 Go 代码里**完整重建**了，
每臂都带行范围和用到的原语。明文装配相关的臂：**13(crc32/补8位)、20(补4位)、
14(JS取值+替换)、17/18(base64)、19(按 U+200C 分割)、34(按 U+200E 分割)、0(XOR解密)**。

## wasm VM 的 35 臂 opcode 表（本轮核心产出）

`(*main._0oOoOO)._00oooO(p0=VM state, p1=opcode)` 就是 VM 的**主派发器**：
开头 36 个嵌套块 `$B0{…$B43{ switch(p1){case 0: break $B43; … case 34: break $B10; default: break $B3;} }}`。
块嵌套 = 代码行序，故各 case 实体按 `$B` 编号降序依次排列。
工具：`.probe/zsec/map_switch.py`（可复跑）。

| opcode | 行范围 | 行数 | 用到的原语 |
|---|---|---|---|
| 0 | 9613–9651 | 39 | pop, stringNext, stringFromUnicode, concat — **XOR 解密**（`(l3 ^ M8[..]) ^ l4`，`l3 = M32[p0+408]`） |
| 1 | 9652–9675 | 24 | |
| 3 | 9676–9701 | 26 | |
| 4 | 9702–9728 | 27 | |
| 5 | 9729–9767 | 39 | |
| 6 | 9768–9801 | 34 | |
| 7 | 9802–9919 | 118 | |
| 8 | 9920–9965 | 46 | |
| 9 | 9966–10019 | 54 | |
| 10 | 10020–10062 | 43 | stringFromUnicode |
| 11 | 10063–10110 | 48 | pop, jsGet |
| 12 | 10111–10138 | 28 | pop, jsGet |
| **13** | 10139–10275 | 137 | **crc32, FormatInt(…,16), concat, `'0'`** → `record93[81:89)` |
| **14** | 10276–10307 | 32 | **jsGet, jsCall, pop, strings_Replace** → 从 JS 取值后替换 |
| 15 | 10308–10338 | 31 | pop, jsGet, jsCall |
| 16 | 10339–10372 | 34 | |
| **17** | 10373–10434 | 62 | **jsGet, jsCall, pop, base64.DecodeString**（解 181388 字符那段） |
| 18 | 10435–10473 | 39 | base64.DecodeString |
| **19** | 10474–10489 | 16 | **pop, strings_Split(…, 253224)** → **按 U+200C 分割** |
| **20** | 10490–10589 | 100 | pop, concat, `'0'` → **补到 4 位**（`record93[89:93)`） |
| 21 | 10590–10617 | 28 | |
| 22 | 10618–10674 | 57 | pop, jsGet, jsCall |
| 23 | 10675–10753 | 79 | stringNext |
| 24 | 10754–10790 | 37 | pop |
| 25 | 10791–10811 | 21 | pop, jsGet |
| 26 | 10812–10849 | 38 | pop, jsGet |
| 27 | 10850–10878 | 29 | FormatInt(…,16) |
| 28 | 10879–10909 | 31 | pop, jsGet |
| 29 | 10910–10944 | 35 | pop, jsGet, jsCall |
| 30 | 10945–10991 | 47 | pop, jsGet, jsCall |
| 31 | 10992–11030 | 39 | pop, jsGet |
| 32 | 11031–11058 | 28 | pop, jsGet, jsCall |
| 33 | 11059–11105 | 47 | pop, jsGet, jsCall |
| **34** | 11106–11155 | 50 | **pop, strings_Split(…, 295153)** → **按 U+200E 分割** |
| default(2) | 11156–11181 | 26 | 返回 |

⇒ 文章作者用 IDA 手工建的那张「35 臂 ISA 表」，现在从反编译的 Go 代码里**完整重建**了，
每臂都带行范围和用到的原语。明文装配相关的臂：**13(crc32/补8位)、20(补4位)、
14(JS取值+替换)、17/18(base64)、19(按 U+200C 分割)、34(按 U+200E 分割)、0(XOR解密)**。

## wasm VM 的 35 臂 opcode 表（本轮核心产出）

`(*main._0oOoOO)._00oooO(p0=VM state, p1=opcode)` 就是 VM 的**主派发器**：
开头 36 个嵌套块 `$B0{…$B43{ switch(p1){case 0: break $B43; … case 34: break $B10; default: break $B3;} }}`。
块嵌套 = 代码行序，故各 case 实体按 `$B` 编号降序依次排列。
工具：`.probe/zsec/map_switch.py`（可复跑）。

| opcode | 行范围 | 行数 | 用到的原语 |
|---|---|---|---|
| 0 | 9613–9651 | 39 | pop, stringNext, stringFromUnicode, concat — **XOR 解密**（`(l3 ^ M8[..]) ^ l4`，`l3 = M32[p0+408]`） |
| 1 | 9652–9675 | 24 | |
| 3 | 9676–9701 | 26 | |
| 4 | 9702–9728 | 27 | |
| 5 | 9729–9767 | 39 | |
| 6 | 9768–9801 | 34 | |
| 7 | 9802–9919 | 118 | |
| 8 | 9920–9965 | 46 | |
| 9 | 9966–10019 | 54 | |
| 10 | 10020–10062 | 43 | stringFromUnicode |
| 11 | 10063–10110 | 48 | pop, jsGet |
| 12 | 10111–10138 | 28 | pop, jsGet |
| **13** | 10139–10275 | 137 | **crc32, FormatInt(…,16), concat, `'0'`** → `record93[81:89)` |
| **14** | 10276–10307 | 32 | **jsGet, jsCall, pop, strings_Replace** → 从 JS 取值后替换 |
| 15 | 10308–10338 | 31 | pop, jsGet, jsCall |
| 16 | 10339–10372 | 34 | |
| **17** | 10373–10434 | 62 | **jsGet, jsCall, pop, base64.DecodeString**（解 181388 字符那段） |
| 18 | 10435–10473 | 39 | base64.DecodeString |
| **19** | 10474–10489 | 16 | **pop, strings_Split(…, 253224)** → **按 U+200C 分割** |
| **20** | 10490–10589 | 100 | pop, concat, `'0'` → **补到 4 位**（`record93[89:93)`） |
| 21 | 10590–10617 | 28 | |
| 22 | 10618–10674 | 57 | pop, jsGet, jsCall |
| 23 | 10675–10753 | 79 | stringNext |
| 24 | 10754–10790 | 37 | pop |
| 25 | 10791–10811 | 21 | pop, jsGet |
| 26 | 10812–10849 | 38 | pop, jsGet |
| 27 | 10850–10878 | 29 | FormatInt(…,16) |
| 28 | 10879–10909 | 31 | pop, jsGet |
| 29 | 10910–10944 | 35 | pop, jsGet, jsCall |
| 30 | 10945–10991 | 47 | pop, jsGet, jsCall |
| 31 | 10992–11030 | 39 | pop, jsGet |
| 32 | 11031–11058 | 28 | pop, jsGet, jsCall |
| 33 | 11059–11105 | 47 | pop, jsGet, jsCall |
| **34** | 11106–11155 | 50 | **pop, strings_Split(…, 295153)** → **按 U+200E 分割** |
| default(2) | 11156–11181 | 26 | 返回 |

⇒ 文章作者用 IDA 手工建的那张「35 臂 ISA 表」，现在从反编译的 Go 代码里**完整重建**了，
每臂都带行范围和用到的原语。明文装配相关的臂：**13(crc32/补8位)、20(补4位)、
14(JS取值+替换)、17/18(base64)、19(按 U+200C 分割)、34(按 U+200E 分割)、0(XOR解密)**。

## wasm VM 的 35 臂 opcode 表（本轮核心产出）

`(*main._0oOoOO)._00oooO(p0=VM state, p1=opcode)` 就是 VM 的**主派发器**：
开头 36 个嵌套块 `$B0{…$B43{ switch(p1){case 0: break $B43; … case 34: break $B10; default: break $B3;} }}`。
块嵌套 = 代码行序，故各 case 实体按 `$B` 编号降序依次排列。
工具：`.probe/zsec/map_switch.py`（可复跑）。

| opcode | 行范围 | 行数 | 用到的原语 |
|---|---|---|---|
| 0 | 9613–9651 | 39 | pop, stringNext, stringFromUnicode, concat — **XOR 解密**（`(l3 ^ M8[..]) ^ l4`，`l3 = M32[p0+408]`） |
| 1 | 9652–9675 | 24 | |
| 3 | 9676–9701 | 26 | |
| 4 | 9702–9728 | 27 | |
| 5 | 9729–9767 | 39 | |
| 6 | 9768–9801 | 34 | |
| 7 | 9802–9919 | 118 | |
| 8 | 9920–9965 | 46 | |
| 9 | 9966–10019 | 54 | |
| 10 | 10020–10062 | 43 | stringFromUnicode |
| 11 | 10063–10110 | 48 | pop, jsGet |
| 12 | 10111–10138 | 28 | pop, jsGet |
| **13** | 10139–10275 | 137 | **crc32, FormatInt(…,16), concat, `'0'`** → `record93[81:89)` |
| **14** | 10276–10307 | 32 | **jsGet, jsCall, pop, strings_Replace** → 从 JS 取值后替换 |
| 15 | 10308–10338 | 31 | pop, jsGet, jsCall |
| 16 | 10339–10372 | 34 | |
| **17** | 10373–10434 | 62 | **jsGet, jsCall, pop, base64.DecodeString**（解 181388 字符那段） |
| 18 | 10435–10473 | 39 | base64.DecodeString |
| **19** | 10474–10489 | 16 | **pop, strings_Split(…, 253224)** → **按 U+200C 分割** |
| **20** | 10490–10589 | 100 | pop, concat, `'0'` → **补到 4 位**（`record93[89:93)`） |
| 21 | 10590–10617 | 28 | |
| 22 | 10618–10674 | 57 | pop, jsGet, jsCall |
| 23 | 10675–10753 | 79 | stringNext |
| 24 | 10754–10790 | 37 | pop |
| 25 | 10791–10811 | 21 | pop, jsGet |
| 26 | 10812–10849 | 38 | pop, jsGet |
| 27 | 10850–10878 | 29 | FormatInt(…,16) |
| 28 | 10879–10909 | 31 | pop, jsGet |
| 29 | 10910–10944 | 35 | pop, jsGet, jsCall |
| 30 | 10945–10991 | 47 | pop, jsGet, jsCall |
| 31 | 10992–11030 | 39 | pop, jsGet |
| 32 | 11031–11058 | 28 | pop, jsGet, jsCall |
| 33 | 11059–11105 | 47 | pop, jsGet, jsCall |
| **34** | 11106–11155 | 50 | **pop, strings_Split(…, 295153)** → **按 U+200E 分割** |
| default(2) | 11156–11181 | 26 | 返回 |

⇒ 文章作者用 IDA 手工建的那张「35 臂 ISA 表」，现在从反编译的 Go 代码里**完整重建**了，
每臂都带行范围和用到的原语。明文装配相关的臂：**13(crc32/补8位)、20(补4位)、
14(JS取值+替换)、17/18(base64)、19(按 U+200C 分割)、34(按 U+200E 分割)、0(XOR解密)**。

## `record93[0:48)` 的结构破解（本轮核心产出）

由 opcode 27 + opcode 20 的语义推出，再用 10 个真实样本验证：

- **opcode 27**（L10850–10877）：弹出类型标签 `71696`（**整数**）→ `strconv.FormatInt(v, 16)` → 推字符串
- **opcode 20**（L10490–10588）：弹出字符串，长度 ≥4 取前 4 字符，否则**左补 `'0'` 到 4 位** → 推字符串

⇒ `record93[0:48)` = **12 个 uint16，各格式化成 4 位十六进制后拼接**（48 = 12 × 4）。

10 个真实样本逐 word 验证（脚本可复跑）：

| word | 值 | 跨样本 |
|---|---|---|
| 0 | `36c0` / `0317` / `a2c3` / … | **var(10)** —— 逐会话变 |
| 1 | `2000` | CONST |
| 2 | `1000` | CONST |
| 3 | `8000` | CONST |
| 4 | `4000` / `4030` | var(2) —— 环境相关位（bit5/bit4） |
| 5 | `8000` | CONST |
| 6 | `8000` | CONST |
| 7 | `8000` / `8800` | var(2) —— 环境相关位（bit11） |
| 8 | `8000` | CONST |
| 9 | `8000` | CONST |
| 10 | `8000` | CONST |
| 11 | `4000` | CONST |

**这解释了几个长期悬而未决的现象**：
- 早前把 `[0:48)` 当字节数组看，发现「偶数位全是 `00`」——那其实是 uint16 的**高字节**（值都在 0x1000–0x8800 区间）；
- `[0:4)`（word 0）逐会话变、`[4:48)` 同环境恒定；
- `[8:12)`（word 4）和 `[14:16)`（word 7）偶尔翻一位 —— 就是环境相关的两个检查位。

⇒ **文章说的「部分1 + 部分2」= 这 12 个 uint16 位域字**。它们与 jsvmp 产出的 32 位十六进制 MD5 一起，
构成文章那行公式里前 5 个 arg 的 80 个字符（48 + 32）。

## `record93[0:48)` 的结构破解（本轮核心产出）

由 opcode 27 + opcode 20 的语义推出，再用 10 个真实样本验证：

- **opcode 27**（L10850–10877）：弹出类型标签 `71696`（**整数**）→ `strconv.FormatInt(v, 16)` → 推字符串
- **opcode 20**（L10490–10588）：弹出字符串，长度 ≥4 取前 4 字符，否则**左补 `'0'` 到 4 位** → 推字符串

⇒ `record93[0:48)` = **12 个 uint16，各格式化成 4 位十六进制后拼接**（48 = 12 × 4）。

10 个真实样本逐 word 验证（脚本可复跑）：

| word | 值 | 跨样本 |
|---|---|---|
| 0 | `36c0` / `0317` / `a2c3` / … | **var(10)** —— 逐会话变 |
| 1 | `2000` | CONST |
| 2 | `1000` | CONST |
| 3 | `8000` | CONST |
| 4 | `4000` / `4030` | var(2) —— 环境相关位（bit5/bit4） |
| 5 | `8000` | CONST |
| 6 | `8000` | CONST |
| 7 | `8000` / `8800` | var(2) —— 环境相关位（bit11） |
| 8 | `8000` | CONST |
| 9 | `8000` | CONST |
| 10 | `8000` | CONST |
| 11 | `4000` | CONST |

**这解释了几个长期悬而未决的现象**：
- 早前把 `[0:48)` 当字节数组看，发现「偶数位全是 `00`」——那其实是 uint16 的**高字节**（值都在 0x1000–0x8800 区间）；
- `[0:4)`（word 0）逐会话变、`[4:48)` 同环境恒定；
- `[8:12)`（word 4）和 `[14:16)`（word 7）偶尔翻一位 —— 就是环境相关的两个检查位。

⇒ **文章说的「部分1 + 部分2」= 这 12 个 uint16 位域字**。它们与 jsvmp 产出的 32 位十六进制 MD5 一起，
构成文章那行公式里前 5 个 arg 的 80 个字符（48 + 32）。

## `record93[0:48)` 的结构破解（本轮核心产出）

由 opcode 27 + opcode 20 的语义推出，再用 10 个真实样本验证：

- **opcode 27**（L10850–10877）：弹出类型标签 `71696`（**整数**）→ `strconv.FormatInt(v, 16)` → 推字符串
- **opcode 20**（L10490–10588）：弹出字符串，长度 ≥4 取前 4 字符，否则**左补 `'0'` 到 4 位** → 推字符串

⇒ `record93[0:48)` = **12 个 uint16，各格式化成 4 位十六进制后拼接**（48 = 12 × 4）。

10 个真实样本逐 word 验证（脚本可复跑）：

| word | 值 | 跨样本 |
|---|---|---|
| 0 | `36c0` / `0317` / `a2c3` / … | **var(10)** —— 逐会话变 |
| 1 | `2000` | CONST |
| 2 | `1000` | CONST |
| 3 | `8000` | CONST |
| 4 | `4000` / `4030` | var(2) —— 环境相关位（bit5/bit4） |
| 5 | `8000` | CONST |
| 6 | `8000` | CONST |
| 7 | `8000` / `8800` | var(2) —— 环境相关位（bit11） |
| 8 | `8000` | CONST |
| 9 | `8000` | CONST |
| 10 | `8000` | CONST |
| 11 | `4000` | CONST |

**这解释了几个长期悬而未决的现象**：
- 早前把 `[0:48)` 当字节数组看，发现「偶数位全是 `00`」——那其实是 uint16 的**高字节**（值都在 0x1000–0x8800 区间）；
- `[0:4)`（word 0）逐会话变、`[4:48)` 同环境恒定；
- `[8:12)`（word 4）和 `[14:16)`（word 7）偶尔翻一位 —— 就是环境相关的两个检查位。

⇒ **文章说的「部分1 + 部分2」= 这 12 个 uint16 位域字**。它们与 jsvmp 产出的 32 位十六进制 MD5 一起，
构成文章那行公式里前 5 个 arg 的 80 个字符（48 + 32）。

## `record93[0:48)` 的结构破解（本轮核心产出）

由 opcode 27 + opcode 20 的语义推出，再用 10 个真实样本验证：

- **opcode 27**（L10850–10877）：弹出类型标签 `71696`（**整数**）→ `strconv.FormatInt(v, 16)` → 推字符串
- **opcode 20**（L10490–10588）：弹出字符串，长度 ≥4 取前 4 字符，否则**左补 `'0'` 到 4 位** → 推字符串

⇒ `record93[0:48)` = **12 个 uint16，各格式化成 4 位十六进制后拼接**（48 = 12 × 4）。

10 个真实样本逐 word 验证（脚本可复跑）：

| word | 值 | 跨样本 |
|---|---|---|
| 0 | `36c0` / `0317` / `a2c3` / … | **var(10)** —— 逐会话变 |
| 1 | `2000` | CONST |
| 2 | `1000` | CONST |
| 3 | `8000` | CONST |
| 4 | `4000` / `4030` | var(2) —— 环境相关位（bit5/bit4） |
| 5 | `8000` | CONST |
| 6 | `8000` | CONST |
| 7 | `8000` / `8800` | var(2) —— 环境相关位（bit11） |
| 8 | `8000` | CONST |
| 9 | `8000` | CONST |
| 10 | `8000` | CONST |
| 11 | `4000` | CONST |

**这解释了几个长期悬而未决的现象**：
- 早前把 `[0:48)` 当字节数组看，发现「偶数位全是 `00`」——那其实是 uint16 的**高字节**（值都在 0x1000–0x8800 区间）；
- `[0:4)`（word 0）逐会话变、`[4:48)` 同环境恒定；
- `[8:12)`（word 4）和 `[14:16)`（word 7）偶尔翻一位 —— 就是环境相关的两个检查位。

⇒ **文章说的「部分1 + 部分2」= 这 12 个 uint16 位域字**。它们与 jsvmp 产出的 32 位十六进制 MD5 一起，
构成文章那行公式里前 5 个 arg 的 80 个字符（48 + 32）。

## `record93[0:48)` 的结构破解（本轮核心产出）

由 opcode 27 + opcode 20 的语义推出，再用 10 个真实样本验证：

- **opcode 27**（L10850–10877）：弹出类型标签 `71696`（**整数**）→ `strconv.FormatInt(v, 16)` → 推字符串
- **opcode 20**（L10490–10588）：弹出字符串，长度 ≥4 取前 4 字符，否则**左补 `'0'` 到 4 位** → 推字符串

⇒ `record93[0:48)` = **12 个 uint16，各格式化成 4 位十六进制后拼接**（48 = 12 × 4）。

10 个真实样本逐 word 验证（脚本可复跑）：

| word | 值 | 跨样本 |
|---|---|---|
| 0 | `36c0` / `0317` / `a2c3` / … | **var(10)** —— 逐会话变 |
| 1 | `2000` | CONST |
| 2 | `1000` | CONST |
| 3 | `8000` | CONST |
| 4 | `4000` / `4030` | var(2) —— 环境相关位（bit5/bit4） |
| 5 | `8000` | CONST |
| 6 | `8000` | CONST |
| 7 | `8000` / `8800` | var(2) —— 环境相关位（bit11） |
| 8 | `8000` | CONST |
| 9 | `8000` | CONST |
| 10 | `8000` | CONST |
| 11 | `4000` | CONST |

**这解释了几个长期悬而未决的现象**：
- 早前把 `[0:48)` 当字节数组看，发现「偶数位全是 `00`」——那其实是 uint16 的**高字节**（值都在 0x1000–0x8800 区间）；
- `[0:4)`（word 0）逐会话变、`[4:48)` 同环境恒定；
- `[8:12)`（word 4）和 `[14:16)`（word 7）偶尔翻一位 —— 就是环境相关的两个检查位。

⇒ **文章说的「部分1 + 部分2」= 这 12 个 uint16 位域字**。它们与 jsvmp 产出的 32 位十六进制 MD5 一起，
构成文章那行公式里前 5 个 arg 的 80 个字符（48 + 32）。

## `record93[0:48)` 的结构破解（本轮核心产出）

由 opcode 27 + opcode 20 的语义推出，再用 10 个真实样本验证：

- **opcode 27**（L10850–10877）：弹出类型标签 `71696`（**整数**）→ `strconv.FormatInt(v, 16)` → 推字符串
- **opcode 20**（L10490–10588）：弹出字符串，长度 ≥4 取前 4 字符，否则**左补 `'0'` 到 4 位** → 推字符串

⇒ `record93[0:48)` = **12 个 uint16，各格式化成 4 位十六进制后拼接**（48 = 12 × 4）。

10 个真实样本逐 word 验证（脚本可复跑）：

| word | 值 | 跨样本 |
|---|---|---|
| 0 | `36c0` / `0317` / `a2c3` / … | **var(10)** —— 逐会话变 |
| 1 | `2000` | CONST |
| 2 | `1000` | CONST |
| 3 | `8000` | CONST |
| 4 | `4000` / `4030` | var(2) —— 环境相关位（bit5/bit4） |
| 5 | `8000` | CONST |
| 6 | `8000` | CONST |
| 7 | `8000` / `8800` | var(2) —— 环境相关位（bit11） |
| 8 | `8000` | CONST |
| 9 | `8000` | CONST |
| 10 | `8000` | CONST |
| 11 | `4000` | CONST |

**这解释了几个长期悬而未决的现象**：
- 早前把 `[0:48)` 当字节数组看，发现「偶数位全是 `00`」——那其实是 uint16 的**高字节**（值都在 0x1000–0x8800 区间）；
- `[0:4)`（word 0）逐会话变、`[4:48)` 同环境恒定；
- `[8:12)`（word 4）和 `[14:16)`（word 7）偶尔翻一位 —— 就是环境相关的两个检查位。

⇒ **文章说的「部分1 + 部分2」= 这 12 个 uint16 位域字**。它们与 jsvmp 产出的 32 位十六进制 MD5 一起，
构成文章那行公式里前 5 个 arg 的 80 个字符（48 + 32）。

## wasm VM 的指令解码结构 + 字节码程序（本轮新增）

### 1) 每个 `$bound` 函数 = 一条 opcode 的解码器

全部 107 个 `$bound` 共享同一骨架（以 `_00o0Oo$bound` 为例）：

```js
function __main__0oOoOO___00o0Oo$bound(p0 /*VM state*/) {
  l2 = M32[p0 + 20];          // ← 程序计数器 pc
  l1 = l2 + 1; M32[p0 + 20] = l1;
  l3 = M32[p0 + 312];         // ← 程序长度（word 数）
  l4 = M32[p0 + 308];         // ← 程序数据指针（[]uint32）
  l5 = M32[l4 + (l1 << 2)];   // word[pc+1]
  l1 = l2 + 2; M32[p0 + 20] = l1;
  l1 = M32[l4 + (l1 << 2)];   // word[pc+2]
  l2 = l2 + 3; M32[p0 + 20] = l2;
  p0 = M32[l4 + (l2 << 2)];   // word[pc+3]
  __main__0oOoOO___OOo0o0(p0, l5, (l1 >> 3), (((l1 << 3) & 56) | (p0 >> 5)), (p0 & 31));
  return;                     // pc 已 += 4
}
```

**指令格式**：每条指令占 **4 个 word**（`word[pc]` = opcode，由主循环消费；`word[pc+1..pc+3]` 是操作数，
按**变宽位域**打包 —— 各解码器的抽取式不同，例如
`(l1 >> 3)` / `(((l1 << 3) & 56) | (p0 >> 5))` / `(p0 & 31)` / `(l6 & 31)` / `((l6 << 2) & 28) | (l1 >> 6)`）。

VM 状态字段补充：`+20` = pc，`+308` = 程序数据，`+312` = 程序长度。

### 2) 字节码程序已提取

数据段里 file `0x4bb05`（mem `0x4812D`）有一段 **17388 字符 base64**，解出 **13,039 字节**：

- **词区** ≈ 0–10,240 字节（可打印率 25–36%），≈2,560 个 32-bit word
- **串区** ≈ 11,264–13,039 字节（可打印率 84–85%）

产物：`.probe/zsec/vmprog.bin`。头部 12 字节为 header，之后是 4 字节一组的记录，
每组首字节落在 0..34（opcode 值域）内，与 35 臂派发器吻合。
字节流是**序列化形式** —— Go 侧解析成「词数组 + 字符串数组」后才是运行时那个 `[]uint32`
（对应文章说的「2329 长度的大数组 + 90 长度字符串数组」）。

### 3) 与文章描述的对应

| 文章 | 本 build |
|---|---|
| `runtime.run$1$gowrapper` 主循环 | 读 `word[pc]` 并派发（Elem 表 107 项 `call_indirect`） |
| `(*main.VM)` 子函数组，每个 case 一个逻辑 | 107 个 `(*main._0oOoOO)._XXX$bound` 解码器 |
| 35 臂 br_table | `_00oooO` 里的 36 路 `switch (p1)` |
| 2329 词 + 90 串 | 本 build ≈2,560 词 + 串区（词数随 build 变，方法一致） |

## wasm VM 的指令解码结构 + 字节码程序（本轮新增）

### 1) 每个 `$bound` 函数 = 一条 opcode 的解码器

全部 107 个 `$bound` 共享同一骨架（以 `_00o0Oo$bound` 为例）：

```js
function __main__0oOoOO___00o0Oo$bound(p0 /*VM state*/) {
  l2 = M32[p0 + 20];          // ← 程序计数器 pc
  l1 = l2 + 1; M32[p0 + 20] = l1;
  l3 = M32[p0 + 312];         // ← 程序长度（word 数）
  l4 = M32[p0 + 308];         // ← 程序数据指针（[]uint32）
  l5 = M32[l4 + (l1 << 2)];   // word[pc+1]
  l1 = l2 + 2; M32[p0 + 20] = l1;
  l1 = M32[l4 + (l1 << 2)];   // word[pc+2]
  l2 = l2 + 3; M32[p0 + 20] = l2;
  p0 = M32[l4 + (l2 << 2)];   // word[pc+3]
  __main__0oOoOO___OOo0o0(p0, l5, (l1 >> 3), (((l1 << 3) & 56) | (p0 >> 5)), (p0 & 31));
  return;                     // pc 已 += 4
}
```

**指令格式**：每条指令占 **4 个 word**（`word[pc]` = opcode，由主循环消费；`word[pc+1..pc+3]` 是操作数，
按**变宽位域**打包 —— 各解码器的抽取式不同，例如
`(l1 >> 3)` / `(((l1 << 3) & 56) | (p0 >> 5))` / `(p0 & 31)` / `(l6 & 31)` / `((l6 << 2) & 28) | (l1 >> 6)`）。

VM 状态字段补充：`+20` = pc，`+308` = 程序数据，`+312` = 程序长度。

### 2) 字节码程序已提取

数据段里 file `0x4bb05`（mem `0x4812D`）有一段 **17388 字符 base64**，解出 **13,039 字节**：

- **词区** ≈ 0–10,240 字节（可打印率 25–36%），≈2,560 个 32-bit word
- **串区** ≈ 11,264–13,039 字节（可打印率 84–85%）

产物：`.probe/zsec/vmprog.bin`。头部 12 字节为 header，之后是 4 字节一组的记录，
每组首字节落在 0..34（opcode 值域）内，与 35 臂派发器吻合。
字节流是**序列化形式** —— Go 侧解析成「词数组 + 字符串数组」后才是运行时那个 `[]uint32`
（对应文章说的「2329 长度的大数组 + 90 长度字符串数组」）。

### 3) 与文章描述的对应

| 文章 | 本 build |
|---|---|
| `runtime.run$1$gowrapper` 主循环 | 读 `word[pc]` 并派发（Elem 表 107 项 `call_indirect`） |
| `(*main.VM)` 子函数组，每个 case 一个逻辑 | 107 个 `(*main._0oOoOO)._XXX$bound` 解码器 |
| 35 臂 br_table | `_00oooO` 里的 36 路 `switch (p1)` |
| 2329 词 + 90 串 | 本 build ≈2,560 词 + 串区（词数随 build 变，方法一致） |

## wasm VM 的指令解码结构 + 字节码程序（本轮新增）

### 1) 每个 `$bound` 函数 = 一条 opcode 的解码器

全部 107 个 `$bound` 共享同一骨架（以 `_00o0Oo$bound` 为例）：

```js
function __main__0oOoOO___00o0Oo$bound(p0 /*VM state*/) {
  l2 = M32[p0 + 20];          // ← 程序计数器 pc
  l1 = l2 + 1; M32[p0 + 20] = l1;
  l3 = M32[p0 + 312];         // ← 程序长度（word 数）
  l4 = M32[p0 + 308];         // ← 程序数据指针（[]uint32）
  l5 = M32[l4 + (l1 << 2)];   // word[pc+1]
  l1 = l2 + 2; M32[p0 + 20] = l1;
  l1 = M32[l4 + (l1 << 2)];   // word[pc+2]
  l2 = l2 + 3; M32[p0 + 20] = l2;
  p0 = M32[l4 + (l2 << 2)];   // word[pc+3]
  __main__0oOoOO___OOo0o0(p0, l5, (l1 >> 3), (((l1 << 3) & 56) | (p0 >> 5)), (p0 & 31));
  return;                     // pc 已 += 4
}
```

**指令格式**：每条指令占 **4 个 word**（`word[pc]` = opcode，由主循环消费；`word[pc+1..pc+3]` 是操作数，
按**变宽位域**打包 —— 各解码器的抽取式不同，例如
`(l1 >> 3)` / `(((l1 << 3) & 56) | (p0 >> 5))` / `(p0 & 31)` / `(l6 & 31)` / `((l6 << 2) & 28) | (l1 >> 6)`）。

VM 状态字段补充：`+20` = pc，`+308` = 程序数据，`+312` = 程序长度。

### 2) 字节码程序已提取

数据段里 file `0x4bb05`（mem `0x4812D`）有一段 **17388 字符 base64**，解出 **13,039 字节**：

- **词区** ≈ 0–10,240 字节（可打印率 25–36%），≈2,560 个 32-bit word
- **串区** ≈ 11,264–13,039 字节（可打印率 84–85%）

产物：`.probe/zsec/vmprog.bin`。头部 12 字节为 header，之后是 4 字节一组的记录，
每组首字节落在 0..34（opcode 值域）内，与 35 臂派发器吻合。
字节流是**序列化形式** —— Go 侧解析成「词数组 + 字符串数组」后才是运行时那个 `[]uint32`
（对应文章说的「2329 长度的大数组 + 90 长度字符串数组」）。

### 3) 与文章描述的对应

| 文章 | 本 build |
|---|---|
| `runtime.run$1$gowrapper` 主循环 | 读 `word[pc]` 并派发（Elem 表 107 项 `call_indirect`） |
| `(*main.VM)` 子函数组，每个 case 一个逻辑 | 107 个 `(*main._0oOoOO)._XXX$bound` 解码器 |
| 35 臂 br_table | `_00oooO` 里的 36 路 `switch (p1)` |
| 2329 词 + 90 串 | 本 build ≈2,560 词 + 串区（词数随 build 变，方法一致） |

## wasm VM 的指令解码结构 + 字节码程序（本轮新增）

### 1) 每个 `$bound` 函数 = 一条 opcode 的解码器

全部 107 个 `$bound` 共享同一骨架（以 `_00o0Oo$bound` 为例）：

```js
function __main__0oOoOO___00o0Oo$bound(p0 /*VM state*/) {
  l2 = M32[p0 + 20];          // ← 程序计数器 pc
  l1 = l2 + 1; M32[p0 + 20] = l1;
  l3 = M32[p0 + 312];         // ← 程序长度（word 数）
  l4 = M32[p0 + 308];         // ← 程序数据指针（[]uint32）
  l5 = M32[l4 + (l1 << 2)];   // word[pc+1]
  l1 = l2 + 2; M32[p0 + 20] = l1;
  l1 = M32[l4 + (l1 << 2)];   // word[pc+2]
  l2 = l2 + 3; M32[p0 + 20] = l2;
  p0 = M32[l4 + (l2 << 2)];   // word[pc+3]
  __main__0oOoOO___OOo0o0(p0, l5, (l1 >> 3), (((l1 << 3) & 56) | (p0 >> 5)), (p0 & 31));
  return;                     // pc 已 += 4
}
```

**指令格式**：每条指令占 **4 个 word**（`word[pc]` = opcode，由主循环消费；`word[pc+1..pc+3]` 是操作数，
按**变宽位域**打包 —— 各解码器的抽取式不同，例如
`(l1 >> 3)` / `(((l1 << 3) & 56) | (p0 >> 5))` / `(p0 & 31)` / `(l6 & 31)` / `((l6 << 2) & 28) | (l1 >> 6)`）。

VM 状态字段补充：`+20` = pc，`+308` = 程序数据，`+312` = 程序长度。

### 2) 字节码程序已提取

数据段里 file `0x4bb05`（mem `0x4812D`）有一段 **17388 字符 base64**，解出 **13,039 字节**：

- **词区** ≈ 0–10,240 字节（可打印率 25–36%），≈2,560 个 32-bit word
- **串区** ≈ 11,264–13,039 字节（可打印率 84–85%）

产物：`.probe/zsec/vmprog.bin`。头部 12 字节为 header，之后是 4 字节一组的记录，
每组首字节落在 0..34（opcode 值域）内，与 35 臂派发器吻合。
字节流是**序列化形式** —— Go 侧解析成「词数组 + 字符串数组」后才是运行时那个 `[]uint32`
（对应文章说的「2329 长度的大数组 + 90 长度字符串数组」）。

### 3) 与文章描述的对应

| 文章 | 本 build |
|---|---|
| `runtime.run$1$gowrapper` 主循环 | 读 `word[pc]` 并派发（Elem 表 107 项 `call_indirect`） |
| `(*main.VM)` 子函数组，每个 case 一个逻辑 | 107 个 `(*main._0oOoOO)._XXX$bound` 解码器 |
| 35 臂 br_table | `_00oooO` 里的 36 路 `switch (p1)` |
| 2329 词 + 90 串 | 本 build ≈2,560 词 + 串区（词数随 build 变，方法一致） |

## wasm VM 的指令解码结构 + 字节码程序（本轮新增）

### 1) 每个 `$bound` 函数 = 一条 opcode 的解码器

全部 107 个 `$bound` 共享同一骨架（以 `_00o0Oo$bound` 为例）：

```js
function __main__0oOoOO___00o0Oo$bound(p0 /*VM state*/) {
  l2 = M32[p0 + 20];          // ← 程序计数器 pc
  l1 = l2 + 1; M32[p0 + 20] = l1;
  l3 = M32[p0 + 312];         // ← 程序长度（word 数）
  l4 = M32[p0 + 308];         // ← 程序数据指针（[]uint32）
  l5 = M32[l4 + (l1 << 2)];   // word[pc+1]
  l1 = l2 + 2; M32[p0 + 20] = l1;
  l1 = M32[l4 + (l1 << 2)];   // word[pc+2]
  l2 = l2 + 3; M32[p0 + 20] = l2;
  p0 = M32[l4 + (l2 << 2)];   // word[pc+3]
  __main__0oOoOO___OOo0o0(p0, l5, (l1 >> 3), (((l1 << 3) & 56) | (p0 >> 5)), (p0 & 31));
  return;                     // pc 已 += 4
}
```

**指令格式**：每条指令占 **4 个 word**（`word[pc]` = opcode，由主循环消费；`word[pc+1..pc+3]` 是操作数，
按**变宽位域**打包 —— 各解码器的抽取式不同，例如
`(l1 >> 3)` / `(((l1 << 3) & 56) | (p0 >> 5))` / `(p0 & 31)` / `(l6 & 31)` / `((l6 << 2) & 28) | (l1 >> 6)`）。

VM 状态字段补充：`+20` = pc，`+308` = 程序数据，`+312` = 程序长度。

### 2) 字节码程序已提取

数据段里 file `0x4bb05`（mem `0x4812D`）有一段 **17388 字符 base64**，解出 **13,039 字节**：

- **词区** ≈ 0–10,240 字节（可打印率 25–36%），≈2,560 个 32-bit word
- **串区** ≈ 11,264–13,039 字节（可打印率 84–85%）

产物：`.probe/zsec/vmprog.bin`。头部 12 字节为 header，之后是 4 字节一组的记录，
每组首字节落在 0..34（opcode 值域）内，与 35 臂派发器吻合。
字节流是**序列化形式** —— Go 侧解析成「词数组 + 字符串数组」后才是运行时那个 `[]uint32`
（对应文章说的「2329 长度的大数组 + 90 长度字符串数组」）。

### 3) 与文章描述的对应

| 文章 | 本 build |
|---|---|
| `runtime.run$1$gowrapper` 主循环 | 读 `word[pc]` 并派发（Elem 表 107 项 `call_indirect`） |
| `(*main.VM)` 子函数组，每个 case 一个逻辑 | 107 个 `(*main._0oOoOO)._XXX$bound` 解码器 |
| 35 臂 br_table | `_00oooO` 里的 36 路 `switch (p1)` |
| 2329 词 + 90 串 | 本 build ≈2,560 词 + 串区（词数随 build 变，方法一致） |

## wasm VM 的指令解码结构 + 字节码程序（本轮新增）

### 1) 每个 `$bound` 函数 = 一条 opcode 的解码器

全部 107 个 `$bound` 共享同一骨架（以 `_00o0Oo$bound` 为例）：

```js
function __main__0oOoOO___00o0Oo$bound(p0 /*VM state*/) {
  l2 = M32[p0 + 20];          // ← 程序计数器 pc
  l1 = l2 + 1; M32[p0 + 20] = l1;
  l3 = M32[p0 + 312];         // ← 程序长度（word 数）
  l4 = M32[p0 + 308];         // ← 程序数据指针（[]uint32）
  l5 = M32[l4 + (l1 << 2)];   // word[pc+1]
  l1 = l2 + 2; M32[p0 + 20] = l1;
  l1 = M32[l4 + (l1 << 2)];   // word[pc+2]
  l2 = l2 + 3; M32[p0 + 20] = l2;
  p0 = M32[l4 + (l2 << 2)];   // word[pc+3]
  __main__0oOoOO___OOo0o0(p0, l5, (l1 >> 3), (((l1 << 3) & 56) | (p0 >> 5)), (p0 & 31));
  return;                     // pc 已 += 4
}
```

**指令格式**：每条指令占 **4 个 word**（`word[pc]` = opcode，由主循环消费；`word[pc+1..pc+3]` 是操作数，
按**变宽位域**打包 —— 各解码器的抽取式不同，例如
`(l1 >> 3)` / `(((l1 << 3) & 56) | (p0 >> 5))` / `(p0 & 31)` / `(l6 & 31)` / `((l6 << 2) & 28) | (l1 >> 6)`）。

VM 状态字段补充：`+20` = pc，`+308` = 程序数据，`+312` = 程序长度。

### 2) 字节码程序已提取

数据段里 file `0x4bb05`（mem `0x4812D`）有一段 **17388 字符 base64**，解出 **13,039 字节**：

- **词区** ≈ 0–10,240 字节（可打印率 25–36%），≈2,560 个 32-bit word
- **串区** ≈ 11,264–13,039 字节（可打印率 84–85%）

产物：`.probe/zsec/vmprog.bin`。头部 12 字节为 header，之后是 4 字节一组的记录，
每组首字节落在 0..34（opcode 值域）内，与 35 臂派发器吻合。
字节流是**序列化形式** —— Go 侧解析成「词数组 + 字符串数组」后才是运行时那个 `[]uint32`
（对应文章说的「2329 长度的大数组 + 90 长度字符串数组」）。

### 3) 与文章描述的对应

| 文章 | 本 build |
|---|---|
| `runtime.run$1$gowrapper` 主循环 | 读 `word[pc]` 并派发（Elem 表 107 项 `call_indirect`） |
| `(*main.VM)` 子函数组，每个 case 一个逻辑 | 107 个 `(*main._0oOoOO)._XXX$bound` 解码器 |
| 35 臂 br_table | `_00oooO` 里的 36 路 `switch (p1)` |
| 2329 词 + 90 串 | 本 build ≈2,560 词 + 串区（词数随 build 变，方法一致） |

## 仍未闭环

- **会话密钥种子未定**（本轮尝试采集 (meta, 会话字母表) 对失败，见下）。
- **`__g.r` 在本 build 未落到 `__g` 上**：镜像 `__g` 全部字符串属性，只有 `ck` 是字符串
  （键：A i h l t X R F B D V U H C W G g S Y M Z k J L O I o + ck）。文章那版的 `__g.r`
  与 `zhihu1`→ZWJ 替换在本 build 不存在（`blobs/*.js` 中 grep `zhihu1` / ZWJ 均为 0）。
- **6 段拼装在 wasm 侧**：3 个 eval 层 + jsvmp 源码里都没有拼装代码 → 与文章一致（wasm VM 解密 + 检测）。
- **`record93[0:48)` 那 24 字节位图来源未知**：jsvmp 只产出 `[48:80)` 的指纹 MD5。

### 本轮（采集 meta↔字母表 对）失败的准确原因

目标是连抓 N 个真实会话的 `(meta, 会话字母表)` 对，检验 `字母表 = f(meta)`。三次尝试都卡住：

1. **时序**：会话字母表在 wasm 线性内存里是**瞬态**的。用
   `Storage.prototype.setItem("zap:zse_ck_referrer")` 做触发器（build 里这行紧接 `location.reload()`），
   命中时 `memLen=5,242,880`（内存已长满），但**去掉全部排除条件后 64 字符置换命中数为 0**
   —— 连那两个静态表 `rBPa7xz6…` / `AMVL3T/d…` 都不在了。说明到 `sc()` 时刻已被释放。
2. **拦不住 reload**：`location.reload` 是 `location` 实例自有、**不可重定义**属性
   （`defineProperty(location,'reload',…)` → `can't redefine non-configurable property`），
   且 build 里调用被 `try{…}catch(_){}` 包住 —— 但拦不住就是拦不住，挑战文档必被销毁。
3. **轮询扫描来不及**：改为 `setInterval` 在流程中途扫，命中不稳定（多次运行仅 1 次成功）。

**下次的正路**：不要跟 reload 赛跑，而是**改脚本本体** —— 用 `intercept_request` mock
`static.zhihu.com/zse-ck/v4/*.js`，在响应体末尾追加 `sc()` 包装器
（`var _s=sc; sc=function(){ /* 此处同步扫内存+读 meta */ return _s.apply(this,arguments); };`），
这样采集点在**同作用域、同步**发生，不受 reload 影响。
障碍：mock body 需整个 521 KB 脚本正文，无法直接塞进工具调用参数 —— 需先解决正文注入
（例如把本地 CORS 服务喂给 `intercept_request`，或改用 `instrumentation` 的 AST 改写路径）。

## 复跑

```bash
cd .probe/zsec
python analyze_jsvmp.py     # 串表统计
node  deob.js               # 解出 dec_map.json（127 项）
node  subst.js              # 回填 -> jsvmp_deob.js
node  restore_env.js        # -> env_detect.restored.js（可读版）
node  --check env_detect.restored.js
```
