# 还原程度审计

## 生成链

```
ck       = '005_' + radix64( encrypt_96( record93 + PKCS#7(3), rk, iv, mask ), alphabet, xreg )
record93 = <48 hex 位图> <32 hex 指纹> 'z' <8 hex crc32(UA)> <4 hex tail>
```

| # | 环节 | 状态 | 还原件 / 判据 |
|---|---|---|---|
| 1 | 位图（12 个 16 位字） | 已还原 | `js/bitmap_detection.restored.js` + `js/bitmap_assembler.js` + `py/bitmap.py`；反解 + 往返 + record93 逐字符 |
| 2 | `w0` / `tail4`（4 hex） | 已还原（每代随机） | 实测唯一 |
| 3 | `crc32(UA)` | 已还原 | `zlib.crc32(请求实际 UA)` |
| 4 | 指纹 | 已还原 | `js/fingerprint.restored.js` + `py/fingerprint.py`；`md5(utf8(40 字段 join '|'))`，真值入参 `.probe/zsec/_md5in.json` |
| 5 | `encrypt_96`（96 字节分组密码 + CBC） | 已还原 | `py/zse_cipher.py` |
| 6 | `radix64(..., alphabet, xreg)` | 已还原 | `py/zse_cipher.py` |
| 7 | `rk`（32×u32） | 已还原（静态字面量） | 常量池 #66..#97：`rk[i] = int(pool[66+i]) ^ 0x7B7B7B7B` |
| 8 | `alphabet`（64 字符排列） | 已还原（静态字面量） | 常量池最后一条；字符集恒为 `A-Za-z0-9/=` |
| 9 | `xreg` / `mask` / `iv` | 已还原（零执行可推） | 由常量池里 4 条 `005_…` 占位令牌反推，见下 |
| 10 | blob 常量池编码 | 已还原 | `plain[j] = (c[j] ^ K[j]) ^ xor`，`K[0]=k0`、`K[j]=K[j-1]^p[j-1]^p[j-2]`（`p[-1]:=0x22`）；`(k0,xor)` 每 build 由池第 0 条恒为 `"Go"` 唯一解出 |

## 每 build 常量的推导（第 7/8/9 行）

- `rk` / `alphabet`：常量池里的静态字符串字面量，直接取。
- `xreg` / `mask` / `iv`：池里的 4 条 `005_…` 是**同一条占位记录**用**同一组会话常量**加密的：

```
占位明文 = <w0:4hex> + '0'*76 + 'i' + 'ffffffff' + <tail4> + 0x03 0x03 0x03
```

| 量 | 推导式 |
|---|---|
| `xreg` | 使下面两条对 ≥4 条占位令牌同时成立的唯一值 |
| `mask` | `(D(ct_b) ^ ct_{b-1}) ^ 0x30`，b = 1..4（占位件 `pt_b` 恒为 `'0'×16`） |
| `iv[4:16]` | `D(ct_0)[4:16] ^ 0x30 ^ mask`（`pt_0[4:16]` 恒为 `'0'×12`，须对每条一致）—— **唯一确定** |
| `iv[0:4]` | 只能约束到「占位件 `w0` 是 4 hex」⇒ 候选集（build-859e 上 16 个，再用真令牌筛到 12 个）。**它完全自由，见下** |

### `iv[0:4]` 为什么自由（实测，2026-10-11）

**原因**：`iv` 只进第 0 块 —— `P_0 = D(C_0) ^ iv ^ mask`；块 1..5 用的是 `C_{b-1}`，**与 iv 无关**。
而 `P_0[0:4]` 就是位图的 `w0`（会话随机标签）。服务端从第 4 字节起校验（`w1..w11` / 指纹 / crc），
`w0` 当不透明标签放过。

**实测**（同一 build、同 meta、同指纹、同位图，只换 `iv[0:4]`）：

| `iv[0:4]` | 落点 |
|---|---|
| `21f0`（候选集内，第 1 个） | `302 → /people/zhihuadmin` |
| `21f1`（候选集内，第 2 个） | `302 → /people/zhihuadmin` |
| `edfe`（候选集内，最后一个） | `302 → /people/zhihuadmin` |
| `0000`（**不在候选集**） | `302 → /people/zhihuadmin` |
| `ffff`（**不在候选集**） | `302 → /people/zhihuadmin` |

⇒ 不只是"候选不唯一也能用"，而是**任意 4 字节都行**。生成时取候选集第一个即可。

### 想钉死它（可选）

用站点自己的产物反解，一步到位：

```
iv* = D(C_0)  ^  record93[0:16]  ^  mask
```

其中 `C_0` = 真机 `__g.ck` 的第一个密文块（`radix64_decode(ck[4:])[:16]`），
`record93[0:16]` = 真机内存里那条 record93 的前 16 字节。
实测 build-859e 得 `iv* = d19e4a2bc57f8603`，且它确实落在候选集里（最后一个）。
**日常不需要做**——`iv[0:4]` 取哪个都一样。

实测：`xreg` / `mask` 在全部样本 build 上精确命中；`iv[4:16]` 的 12 个字符精确。

## ck ↔ meta 的绑定（实测，2026-10-11）

服务端**每次请求都重发一套东西**，不是缓存复用：

| 观测 | 实测 |
|---|---|
| build JS 内容每次都变 | 连取 3 次：522097 / 522009 / 521706 字节，3 个不同 sha256 |
| 每 build 的会话常量都变 | `xreg`/`mask` 实测取过 `0x2a/0x27`、`0x36/0x18`、`0x40/0x37`、`0x30/0x4d` |
| meta 每次都变 | 172 字符 base64（= **128 字节**），逐次不同 |
| meta 与 build hash 无可见关系 | build hash（32 B）既不出现在 meta 里，meta 也不是它的 base64 |

机制：服务端为每次请求生成新的 `(rk, alphabet, xreg, mask, iv)`，用它重新加密池里的占位令牌，
产出内容哈希命名的新 build JS；同时下发新的 meta。**meta 就是服务端查表的键** ——
它据此取回该次挑战的常量来解密 ck。

**绑定实测**（同一 ck，只换 meta）：

| 组合 | 落点 |
|---|---|
| `ck(buildA) + metaA` | `302 → /people/zhihuadmin` |
| `ck(buildA) + metaB`（另一次挑战的 meta） | **`403` 挑战页**（拒绝） |

**同一个 meta 能配多个 ck**（`w0` / `tail4` / `nonce` 自由）：

| 组合 | 落点 |
|---|---|
| `ck(w0=7442) + metaA` | `302 → /people/zhihuadmin` |
| `ck(w0=56a8) + metaA` | `302 → /people/zhihuadmin` |

### ck 与 meta 之间**没有算法关系**（站点源码）

build JS 里拼 cookie 的就是这么一个函数（逐字取自线上 build）：

```js
function sc(){try{
  var e="__zse_ck",
      t=(typeof __g.ck=="string" && __g.ck || "001_jW6qUp+…")            // ← ck（Go wasm 产出）
        + '-' + (document.getElementById("zh-zse-ck").getAttribute("content")
                 || document.getElementsByTagName("meta").getAttribute("content")),  // ← meta
      _=630e8;
  document.cookie = e+"=; expires=Mon, 20 Sep 1970 00:00:00 UTC; path=/;";  // 先删
  document.cookie = e+"="+t+"; domain=.zhihu.com; expires="+new Date(Date.now()+_).toGMTString()
                    +"; path=/;"+(location.protocol=="https:"?" SameSite=None; Secure":"");
  sessionStorage.setItem("zap:zse_ck_referrer", document.referrer);
  window.location.reload();
}catch(_){}}
```

- **`ck` 与 `meta` 只是用 `-` 拼接** —— meta **不参与** ck 的计算，ck 也不含 meta 的任何变换。
- cookie 有效期 `630e8` ms ≈ **7.29 天**，写完立刻 `location.reload()`。

meta 本身：**128 字节**（172 字符标准 base64），逐次不同，**与 build hash 无关**
（hash 不出现在 meta 里，meta 也不是它的 base64），用该 build 的 `rk` 解也解不出 record93 头
⇒ 是**服务端自持的 128 字节不透明值**（熵 6.6 bit/byte，看着就是随机的）。

⇒ **规律**：`ck` 绑定的是「meta 指向的那次挑战的 build 常量」，不是 meta 本身；
在同一次挑战内 `w0` / `tail4` / `nonce` / `iv[0:4]` 都是自由参数，所以**一个 meta 可产出任意多个可用 ck**，
而**一个 ck 只能配它自己那次挑战的 meta**。

## 各层还原状态

| 层 | 规模 | 还原件 | 验证 |
|---|---|---|---|
| service 程序 | 633 词 / 37 块 | `js/service.final.js` | 逐块差分 37/37 |
| orchestrator | 950 词 / 119 块 | `js/cvm.final.js` | 逐块差分 119/119；链式 XOR 流对拍真机 zh/qh |
| inner | 942 词 / 120 块 | `js/inner.final.js` | 逐块差分 120/120；同上 |
| payload | 2312 词 / 302 块 | `js/payload.final.js` | 逐块差分 302/302；同上 |
| fingerprint | jsvmp | `js/fingerprint.restored.js` | 产出 32-hex md5 |
| Go VM | 10565 词 / 104 取指格式 / 35 臂 | `py/govm_makecode.py` + `py/govm_semantics.py` | 取指自检 10565/10565；语义对拍 37313/37313；池 101/101 |
| bitmap | — | `js/bitmap_assembler.js` + `py/bitmap.py` | 自检 PASS |

## 验收

```bash
python tools/verify_all.py          # 11 门
python py/derive_and_submit.py      # 端到端：抓 build → 零执行推常量 → 提交
```

端到端实测（全新随机 build）：`302 → /people/zhihuadmin`（真实页）。

## 已知边界

1. **位图 / 指纹是环境相关常量**：换 handenv 或换 UA 后必须重新确认（位图 `w4` 直接决定会话是否被反自动化层标记）。
2. **每 build 常量随 build 轮换**：必须用当次 build 的 wasm 推。
3. **`iv[0:4]` 有候选歧义**：不影响可用性（见上）。
4. **VM 类（BVM/CVM 解释器）**：类源码在 `.probe/zsec/src_{VM,BVM,CVM}.js`（各约 44 KB，**混淆形态**，
   由驱动从站点 JS 里捕获），交付包另附一份（`evidence/src_*.js`）；**没有去混淆版**。
   272 词微码 T 表也未解出——解码器 `.probe/vmsvc/decode_vm_microcode.mjs` 需要
   `.probe/live-fns.bootstrap.js` 与 `.probe/live-VM.folded.js`（执行产物，不在树内）。
   注意区分：`js/cvm.final.js` 是 **CVM 层程序**（950 词）的还原件，不是 CVM 类。
   VM 类属于「实现它的 VM」，不是纯算目标。
5. **`js/*.final.js` 里残留少量反编译伪影**（如 `(x?.y).toString()` 形式）：链式 XOR 流那几处已修并跑通，其余为无害写法。
6. **「对照路径」（跑真机代码）现状**：
   - **纯 JS VM**（`py/govm_pure_vm.js`）：**完整可跑**。`VM/BVM/CVM` 真函数对象 3/3，20 万次调用，
     `PROBE=1` 出 132 字符 ck、`zh` 3197、`qh` 41。依赖 `.probe/wt/zse.decompiled.js` +
     `.probe/zsec/_datasegs.json` + `src_{VM,BVM,CVM}.js` + glue blob，都在树内。
   - **wasm 驱动**（`.probe/zsec/wdriver_glue{,_disp}.js`）：**已按会话历史恢复到能跑的版本**（见 `docs/MISSING.md`）。
     现在 `补全局 VM/BVM/CVM/sc` → `importObject` 有值 → 实例化 → **82 个真分支事件**，把挑战 JS 供上并 eval、
     `__b.zh` 写回 1321 字符。最后仍 panic 在 `syscall/js.Value.Invoke`（**历史记录里那次也一样**，属既有问题）。
   - **不影响交付路径**：`py/zse_ck.py token` 与 `py/pure_calc_verify.py` 只用 `py/` 与 curl，已端到端验证。
