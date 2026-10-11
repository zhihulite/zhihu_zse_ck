# 知乎 `__zse_ck`（`005_`）纯算

知乎风控令牌 `__zse_ck` 的**还原件 + 纯算流水线**：给一个 build 的 wasm，
**不跑它的代码、不跑 wasm、不读内存**，直接用 Python 算出被服务端接受的令牌。

> 完整技术分析见 **[docs/ANALYSIS.md](docs/ANALYSIS.md)**。

---

## 算法

```
ck       = '005_' + radix64( encrypt_96( record93 + PKCS#7(3), rk, iv, mask ), alphabet, xreg )
record93 = <48 hex 位图> <32 hex 指纹> 'z' <8 hex crc32(UA)> <4 hex tail>
cookie   = __zse_ck = <ck 132 字符> + '-' + <meta 172 字符>
```

| 量 | 来源 |
|---|---|
| 位图 | 环境检测结果（12 个 16 位字；`w0` 与 `tail4` 每代随机） |
| 指纹 | `md5(40 个字段用 '\|' 连接)`（`hardwareConcurrency` / WebGL 厂商与渲染器 / `canvas.toDataURL()` / 31 个字体名 / 5 个插件名） |
| crc32 | `crc32(请求实际使用的 UA)` |
| `rk` | 常量池 #66..#97 的 32 条十进制串，逐条 `^ 0x7B7B7B7B` |
| `alphabet` | 常量池最后一条 64 字符排列（字符集恒为 `A-Za-z0-9/=`） |
| `xreg` / `mask` / `iv` | 由常量池里 4 条 `005_…` 占位令牌反推 |
| `encrypt_96` | 96 字节分组密码 + CBC（6 块），见 `py/zse_cipher.py` |

## 用法

单一入口 `py/zse_ck.py`：

```bash
python py/zse_ck.py token          # 抓当次 build → 零执行推常量 → 出 ck → 提交（判读看 Location）
python py/zse_ck.py token --dry    # 不提交，只打印 ck / cookie / record93
python py/zse_ck.py consts <wasm>  # 只打印该 build 的常量（rk / alphabet / xreg / mask / iv）
python py/zse_ck.py trace          # 跑纯 JS VM 落轨迹 → 语义对拍（一步）
python py/zse_ck.py check          # 全部验收门（--fast 跳过慢门）
```

底层脚本仍在：`py/derive_and_submit.py`（= `token`）、`py/derive_session.py`（= `consts`）、
`py/pure_calc_verify.py`（离线全链路自证）、`tools/verify_all.py`（= `check`）、`py/fresh_ck.py`（= `driver`）。

## 实测

- 全新随机 build（多次，build 每次轮换）：**`302 → /people/zhihuadmin`（真实页）**。
- 不带 cookie：`403` + 挑战页。
- 位图 `w4 = 0x4000` → 真实页；`w4 = 0x4030` → `/account/unhuman`（token 有效但会话被反标记）。详见 `docs/BITMAP.md`。

## 三条容易踩的结论

- **`iv[0:4]` 完全自由**：`iv` 只进 CBC 第 0 块，而 `P_0[0:4]` 就是位图的 `w0`（会话标签）。
  实测候选集内 3 个 + 集外 `0000`/`ffff` **全部** `302` 真实页。取候选集第一个即可。
- **`ck` 绑定的是「meta 指向的那次挑战的 build 常量」**，不是 meta 本身：站点代码里就是
  `ck + '-' + meta` 字符串拼接。服务端拿 meta 查表取回常量再解密 ck ⇒
  **一个 meta 可产任意多个 ck，一个 ck 只能配它自己那次挑战的 meta**。整条流程必须一次抓取内闭环。
- **`rk` / `alphabet` 是常量池里的静态字面量**，不是运行期算出来的。

## 已知边界

- 位图与指纹是**环境相关**常量；换 handenv / 换 UA 后必须重新确认（见 `docs/PITFALLS.md`）。
- 每-build 常量随 build 轮换，必须用**当次** build 的 wasm 推。
- `zh` / `qh` 的内容每次不同（链式 XOR 的会话绑定值），长度已与真机一致。
- `meta` 由服务端下发，客户端无从还原。

## 环境

Python 3.10+、Node 18+（只用于对照路径与还原链）。运行时不需要任何 npm 包。

---

## 文档

| 文件 | 内容 |
|---|---|
| [docs/ANALYSIS.md](docs/ANALYSIS.md) | **完整技术分析**（生成链 / 六层 VM / Go 字节码机 / 服务端校验） |
| [docs/BITMAP.md](docs/BITMAP.md) | 位图与 record93 结构、`w4` 判据 |
| [docs/FINGERPRINT.md](docs/FINGERPRINT.md) | 指纹链（40 字段 → md5） |
| [docs/GO_VM.md](docs/GO_VM.md) | wasm 内的 Go 字节码机（取指 / 派发 / 常量池） |
| [docs/METHOD.md](docs/METHOD.md) | 方法论（分层推进 / 真机对拍差分） |
| [docs/PITFALLS.md](docs/PITFALLS.md) | 坑与判据 |
| [docs/RESTORATION.md](docs/RESTORATION.md) | 还原程度审计 |
| [docs/MISSING.md](docs/MISSING.md) | 树内缺失的捕获件 |
