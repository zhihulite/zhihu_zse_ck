# AGENTS.md — 在本仓库里工作的约定

## 这是什么

`__zse_ck`（知乎 `005_` 令牌）的**还原件 + 纯算流水线**。

- **纯算** = 吃透站点代码、把算法自己写出来，**不是**跑它的代码、也不是实现它的 VM。
- 交付形态：给一个 build 的 wasm，**零执行**推出全部每-build 常量，纯 Python 算出被服务端接受的 `__zse_ck`。

## 入口

单一入口 `py/zse_ck.py`，常用流程各一条命令：

```bash
python py/zse_ck.py token          # 抓当次 build → 零执行推常量 → 出 ck → 提交（看 Location）
python py/zse_ck.py token --dry    # 同上但不提交，只打印 ck / cookie
python py/zse_ck.py consts <wasm>  # 只打印该 build 的每-build 常量（rk / alphabet / xreg / mask / iv）
python py/zse_ck.py trace          # 跑纯 JS VM 落轨迹 → 语义对拍真机轨迹（一步）
python py/zse_ck.py check          # 全部验收门（--fast 跳过慢门）
python py/zse_ck.py driver --dry   # 对照路径：Node 驱动跑真机代码出 ck
```

底层脚本仍在（`py/derive_and_submit.py`、`py/govm_semantics.py`、`tools/verify_all.py` …），`zse_ck.py` 只是转发。
`node py/govm_pure_vm.js`（`PROBE=1` 打印 ck/zh/qh）是纯 JS VM 的裸入口，`trace` 会替你跑它。

运行时不依赖任何 npm 包。`package.json` 里声明的 `@babel/*` 只供**重新跑 AST 还原链**（`tools/restore_ast.js` 那一套）用，需要 `npm i`；日常流程用不到。

运行时不依赖任何 npm 包；`node_modules` 只在重新跑 `tools/restore_ast.js` 那套还原链时才需要（`npm i`）。

## 目录

| 目录 | 内容 |
|---|---|
| `py/` | 纯算流水线（推常量 / 拼 record93 / 加密 / 提交 / 取指反汇编 / 语义对拍） |
| `js/` | 站点各层 VM 程序的还原件（`.decompiled.js` → `.restored.source.js` → `.restored.js` → `.final.js`）与 `zse_ck_generator.js`（`py/zse_cipher.py` 的 JS 移植） |
| `tools/` | 还原链（AST）、验收器、DB 还原工具 |
| `docs/` | 规格与坑（`BITMAP` / `FINGERPRINT` / `GO_VM` / `METHOD` / `PITFALLS` / `RESTORATION` / `MISSING`） |
| `.probe/` | 运行所需的最小数据（wasm、handenv、反编译产物、lift 产物、轨迹） |
| `native/` | native addon（原生 `Function.prototype.toString` + `document.all` 的 IsHTMLDDA） |
| `profiles/` | 每 build 的会话常量 profile（`_live_fixture.json` 是自洽基准） |
| `DELIVERY/` | 交付包（`tools/assemble_delivery.py` 从工作区源文件装配） |
| `out/` | 生成物（反汇编、池解码、验收日志） |

## 硬规则

1. **不伪造结果**：哈希、HTTP 响应、偏移、补丁、构建产物一律来自真实命令输出；没跑就写「未执行」。
2. **行为不同必须用真机对拍差分**，禁止凭推理猜。先定位到**唯一**差异点，再改。
3. **`302` 不等于通过**：判读必须看 `Location`。`/people/zhihuadmin` = 真实页；`/account/unhuman` = token 有效但会话被反标记。
4. **改完必须跑门**：`python tools/verify_all.py`。`node --check` 不算验收。
5. **单点变量**：一次只改一个字段再提交（本项目靠这条定位到 `w4` 是唯一判据）。
6. **补环境自己手写**，不要 jsdom / sdenv。
7. **不要回退到「跑它的代码」**：`run_build_live.js` 只是对照路径，不是交付路径。

## 已知的坑（详见 `docs/PITFALLS.md`）

- HTTP 头在 Python 里是**小写键**：`dict(resp.headers).get('Location')` 恒为 `None` ⇒ 判读必须大小写不敏感。
- 位图/指纹是**环境相关**的：改 handenv 或换 UA 后必须重新确认位图，否则会假报失败。
- 归档 profile 与新捕获的 `zh/qh` 可能**不同源**，对拍前先确认同一次会话。
- 探针插入必须**锚定函数签名或文本**，不能用「第一个 `{`」或行号（会被带偏）。

## 写文档

只写**规格与判据**（「必须是什么」），不写过程叙事（「我之前错在哪、为什么这么改」）。
被否证的观察进 `docs/METHOD.md` §4.4 或 `docs/PITFALLS.md`，不散落在源码注释里。
