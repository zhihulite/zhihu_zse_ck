# 坑与判据

每条格式：**现象 → 判据 / 做法**。只保留仍然成立、可独立验证的条目。

## 三条铁律

1. 不伪造结果：哈希、HTTP 响应、偏移、补丁一律来自真实命令输出；没跑就写「未执行」。
2. 行为不同必须用**真机对拍差分**定位到唯一差异点，禁止凭推理猜。
3. `node --check` 不算验收；判据是逐块差分 / 功能验证 / 端到端落点。

## 取证

| 现象 | 判据 / 做法 |
|---|---|
| 抓不到挑战 JS | 有效的 `__zse_ck` 会**抑制挑战**，服务器直接返真页 ⇒ 抓包前先删 cookie（两个域都删） |
| `document.cookie` 读到旧值 | setter 里回读拿到的是旧值 ⇒ 记录**被赋的那个字符串** |
| 按变量名/类名钩不住 | 名字每 build 轮换 ⇒ 用窗口差分 + 结构签名 |
| 插桩后 token 失效 | payload 绑定 JS 文本 ⇒ 插桩实验必须单独起浏览器，不与真 token 混用 |
| `location.reload` 拦不住 | `location` 实例自有、不可重定义 ⇒ 不要跟它抢，改 mock 掉 build |
| 浏览器里 `alert`/`confirm` 卡住 | 没有原生实现，调用会一直超时 ⇒ 长任务用短超时 |

## 静态搜索死路（别再重搜）

| 现象 | 判据 |
|---|---|
| 搜「魔改 SM4 / AES S 盒 / MD5-SHA IV / CRC32 表 / TEA delta」 | 全 0 命中。工作模型是**行为等价**，实现用的是查表 + 字符串操作 |
| 搜指纹 MD5 | 不在协议里、不在 wasm 里；它在页面 JS 算好后走非 copy 通道 |
| 搜关键 ASCII 串 | 不在 wasm 线性内存里 |
| 搜 `crypto.*` | 0 命中；每轮随机盐在 wasm 内生成 |
| `record93[0:48)` 的 12 个 uint16 连续存储 | 不存在（BE/LE 16/32 全 0 命中）；是即时算出来就格式化的 |
| 逐字符翻转问 round key | 每字符高 5 位是位置模板 ⇒ 可问信息被限制在 3 bit/字符；累计 ~5381 次翻转 0 变化 |

## 补环境（handenv）

| 现象 | 判据 / 做法 |
|---|---|
| `window`/`document` 可写 | 载荷里 `window={};document={}` 在真浏览器是**静默失败**；可写环境下会把全局清空、之后整层 JS 崩 ⇒ `window/document/location/navigator/...` 一律 `writable:false, configurable:false` |
| 位图 `w4` 多 `0x30`、会话掉 `/account/unhuman` | payload 层 v6 的 bit5/bit4 来自 `setTimeout`/`setInterval` 的 `toString().indexOf("native") === -1` ⇒ 必须把 Node 的 `setTimeout`/`setInterval` 包成原生形态（`handenv.js` 的 `_stNative` 默认必须为真） |
| `window.eval` 被替换 | 必须是真全局 eval（大体积源码可重定向到 devirt 版做 TRACE） |
| `Document.all` 当函数调用抛 | 真机是带 `[[IsHTMLDDA]]` 的可调用集合，调用返回**对象** ⇒ 类型标记必须是 Function 语义 |
| `XMLDocument`/`MediaSource`/`stop`/`open`/`blur` 被判定为 mock | 必须原生绑定（`toString` 含 `[native code]`） |
| `new URL` 语义不对 | 必须是真 WHATWG URL；`localStorage` 要有真 Storage 语义 |
| 想省事用 jsdom / sdenv | 不要用；本项目一律手写环境 |

## devirt / 反编译

| 现象 | 判据 |
|---|---|
| 内联折叠寄存器后行为不同 | 会重复副作用 ⇒ 必须物化到 VM 自己的 `A[]`/`l[]` |
| 压引用而不是压值 | 必须压**值** |
| 方法调用 receiver 用 `?.` | 会短路、VM 抛 ⇒ receiver 不能用可选链 |
| 求值顺序错 | 先弹方法名、再弹参数 |
| `l[0]`/`l[1]` 被常量折叠 | 它们是调用方实参，必须渲染成运行时引用 |
| 只在块内折叠操作数栈 | 栈**跨块**存活，后继块也要折叠 |
| `SUBCALL` 只取第一次赋值 | 每个 `SUBCALL` 是新帧/新根，取**最后一次** |
| `F` 标志丢了 | 跨块存活，必须发 `F = !!x;` |
| 代码静默消失 | 漏了 `A[i] = A[j](...S.splice(-n))` 这种独立形式 |
| 循环头位置错 | 循环头必须发在 body 里 |
| 花括号计数解析出错 | 字符串/正则/三元里含花括号 ⇒ 必须写带词法状态的解析器 |
| 探针插在「第一个 `{`」或按行号 | 会被字符串/探针本身带偏 ⇒ 锚定函数签名或文本 |

## wasm / VM

| 现象 | 判据 |
|---|---|
| 取指 pc 对不上 | `_00oooO` 入口的 pc 是**自增前**的 |
| 表索引算错 | 运行时分派表是 `105 - op` |
| 按 word 建静态映射 | 分派臂**不是** word 的函数（同 word 最多 16 个臂） |
| 按顺序平移 Go/JS 结构体字段 | Go 侧字段顺序 ≠ JS 侧，且 Go 侧没有 `arr` 切片 |
| 内存提取取第一个命中 | 会落到相邻对象上 ⇒ 按值去重、不提前退出 |

## 报告纪律

| 现象 | 判据 |
|---|---|
| 提前退出循环得假结论 | 不提前退出（曾因此误判「字母表恒定」） |
| 把「模型」当「实现」 | 工作模型可以行为等价而实现不同，结论里必须分开写 |
| HTTP 头读不到 | Python 里 `dict(resp.headers)` 的键**全小写**，`h.get('Location')` 恒为 `None` ⇒ 判读必须大小写不敏感 |
| `302` 当成通过 | 必须看 `Location`：`/people/zhihuadmin` = 真实页；`/account/unhuman` = token 有效但会话被反标记 |
| 归档 profile 与新捕获对拍 | 可能**不同源**（位图随环境变）⇒ 先确认同一次会话 |
| 「别的工具能连 ⇒ 环境没问题」 | 是错的；要单独验证目标能力 |
