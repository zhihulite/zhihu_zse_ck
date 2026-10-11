# 知乎 `__zse_ck`（`005_`）令牌：完整逆向分析

> 本文是这套还原件与纯算流水线的技术总览。所有数字都来自实测；推测均已标注。

---

## 0. 一句话

知乎的风控令牌 `__zse_ck` 由**六层 JavaScript 虚拟机**加一个**内嵌在 wasm 里的 Go 字节码机**共同产出。
本文把它拆到「给一个 build 的 wasm，零执行算出全部每-build 常量，纯 Python 算出服务端接受的令牌」。

```
ck       = '005_' + radix64( encrypt_96( record93 + PKCS#7(3), rk, iv, mask ), alphabet, xreg )
record93 = <48 hex 位图> <32 hex 指纹> 'z' <8 hex crc32(UA)> <4 hex tail>
```

cookie 的最终形态是 `__zse_ck = <ck 132 字符> + '-' + <meta 172 字符>`。

---

## 1. 生成链

### 1.1 record93 —— 93 字节的「会话自述」

| 段 | 长度 | 内容 |
|---|---|---|
| 位图 | 48 hex（12 × 16 位字） | 环境检测结果。`w0` 是每代随机的会话标签，`w1..w11` 是环境相关位 |
| 指纹 | 32 hex | `md5(40 个字段用 '\|' 连接)` |
| 分隔 | 1 字符 | 字面量 `'z'` |
| crc32 | 8 hex | `zlib.crc32(请求实际使用的 UA)` |
| tail | 4 hex | 每代随机 |

实测锚点：本环境位图稳定为 `2000 1000 8000 4000 8000 8000 8000 8000 8000 8000 4000`，
指纹 `be544511d8accf5879de9179e434e829`，`crc32(UA) = 3efa0afb`。

### 1.2 encrypt_96 —— 96 字节分组密码 + CBC

96 字节明文（record93 + 3 字节 PKCS#7 填充）分 6 块做 CBC：

```
块 b:  inp_b = P_b ^ prev ^ mask            prev = iv（b = 0）或 C_{b-1}
       每块 32 轮：X_{i+4} = X_i ^ L(A_i)
       A_i = S(X_{i+1} ^ X_{i+2} ^ X_{i+3} ^ RK_i)
       L(x) = x ^ rotl(x,2) ^ rotl(x,10) ^ rotl(x,18) ^ rotl(x,24)
       输出 = X35 ‖ X34 ‖ X33 ‖ X32
```

结构与 SM4 同族，但 **S 盒是换过的**（见 `py/zse_cipher.py`）。

**一个关键性质**：`iv` 只进第 0 块（`P_0 = D(C_0) ^ iv ^ mask`）；块 1..5 用的是 `C_{b-1}`，**与 iv 无关**。
这条后面会反复用到。

### 1.3 radix64 —— 不是标准 base64

用**该 build 自己的 64 字符排列**做一次 radix64，还带一个偏移量 `xreg`。
所以同样 96 字节密文，换一个 build 就得到完全不同的 128 字符。

---

## 2. 六层 JS 虚拟机

站点把整条生成链藏进了六层自定义 VM，每层都是一段「字节码 + 分派链」：

| 层 | 规模 | 产出 |
|---|---|---|
| service | 633 词 / 37 块 | 引导与粘合 |
| VM 类（BVM/CVM 解释器） | 272 词微码 | 解释执行上面几层的程序 |
| orchestrator（CVM） | 950 词 / 119 块 | 写 `__c.qh` |
| inner | 942 词 / 120 块 | 追加 `__b.zh` |
| payload | 2312 词 / 302 块 | 写 `__b.zh` 主体 + 位图 |
| fingerprint | jsvmp | 产出 32 hex 指纹 |

还原件在 `js/`：`.decompiled.js`（反编译）→ `.restored.source.js` → `.restored.js` → `.final.js`。
四层程序都做了**逐块差分**验收（37/37、119/119、120/120、302/302）。

`__b.zh` / `__c.qh` 两串用**链式 XOR 流**加密：

```
out[i] = in[i] ^ key[i % len] ^ state        state = out[i]（前一个输出字符）
```

状态跨层、跨调用共享（`__b.a3`），所以这两串的内容**每次会话都不同**，只有长度稳定
（`zh` = 3197、`qh` = 41）。

---

## 3. Go wasm 里的字节码机

站点在 wasm 里塞了一台 Go 实现的字节码 VM：**10565 词**程序 + **104 项取指格式表** + **101 条常量池**。

- 程序按**词**编址，第 `pc` 词的字节偏移是 `pc << 2`。
- 每条指令的第一个词是**表索引**（0..103），运行时分派表是 `elem = 1 if b == 0 else 105 - b`。
- 指令长度按 elem 分 4 / 8 / 10 词，每个 elem 唯一。
- 104 项表映射到 **35 个语义臂**，由 4 个派发器实现。

验收：取指自检 **10565/10565** 逐字节；语义对拍 **37309/37309 = 1.000000**。

---

## 4. 每-build 常量：全在常量池里

这是纯算的核心。常量池的编码是：

```
blob = [00 00 <count:u16be>] <程序 count 字节> <tail>
tail = [00 <len:u8> <密文>] × 101
明文 = (c[j] ^ K[j]) ^ xor
K[0] = k0 ;  K[j] = K[j-1] ^ p[j-1] ^ p[j-2]      (p[-1] := 0x22)
```

`(k0, xor)` **每 build 不同**，但因为**池第 0 条恒为字面量 `"Go"`**，两者可以唯一解出。

解出来后，四个每-build 常量直接就在池里：

| 量 | 来源 |
|---|---|
| `rk`（32 × u32） | 池 #66..#97，逐条 `^ 0x7B7B7B7B` |
| `alphabet`（64 字符） | 池 #98；字符集恒为 `A-Za-z0-9/=` |
| `xreg` / `mask` / `iv` | 由池里 4 条 `005_…` **占位令牌**反推 |

> **一个曾经走偏的判断**：早期把池解错（用了 `skip=1, xor=0`），把 `rk` 和字母表解成乱码，
> 于是以为「它们是运行期由那段 10565 词程序算出来的」，还去找"round key 生成循环"。
> 真相是**它们就是池里的静态字符串字面量**。

### 4.1 从占位令牌反推会话常量

池里的 4 条 `005_…` 是**同一条占位记录**用**同一组会话常量**加密的，明文结构固定：

```
占位明文 = <w0:4hex> + '0'*76 + 'i' + 'ffffffff' + <tail4> + 0x03 0x03 0x03
```

因为 `pt_0[4:16]` 恒为 `'0'×12`：

```
mask      = (D(ct_b) ^ ct_{b-1}) ^ 0x30            b = 1..4
iv[4:16]  = D(ct_0)[4:16] ^ 0x30 ^ mask            ← 唯一确定
```

`iv[0:4]` 只能约束到「占位件的 `w0` 是 4 个 hex 字符」⇒ 留下一个候选集。

---

## 5. `iv[0:4]` 完全自由（实测）

`iv` 只进第 0 块，而 `P_0[0:4]` 恰好就是位图的 `w0`（会话随机标签）。服务端**从第 4 字节起**校验
（`w1..w11` / 指纹 / crc / tail），`w0` 当不透明标签放过。

实测（同一 build、同 meta、同指纹、同位图，**只换 `iv[0:4]`**）：

| `iv[0:4]` | 落点 |
|---|---|
| 候选集内第 1 个 / 第 2 个 / 最后一个 | `302 → /people/zhihuadmin` |
| **不在候选集**的 `0000` / `ffff` | `302 → /people/zhihuadmin` |

⇒ 不只是"候选不唯一也能用"，而是**任意 4 字节都行**。生成时取候选集第一个即可。

**若想钉死真值**，用站点自己的产物一步反解：

```
iv* = D(C_0) ^ record93[0:16] ^ mask
```

其中 `C_0` 是真机 `__g.ck` 的第一个密文块，`record93[0:16]` 是真机内存里那条 record93 的前 16 字节。
实测 build-859e 得 `d19e4a2bc57f8603`，确实落在候选集里。

---

## 6. 服务端校验什么

### 6.1 位图 `w4` 是会话判据

逐字段扫描（同 build、同 meta，**只改位图**）：

| 位图 | 落点 |
|---|---|
| `w4 = 0x4000` | `302 → /people/zhihuadmin`（真实页） |
| `w4 = 0x4030` | `302 → /account/unhuman`（token 有效，会话被反自动化层标记） |
| `w7 = 0x8000` 或 `0x8800` | 都通过（不参与判定） |
| 指纹值、UA | 都不参与判定 |

`w4` 的 bit5/bit4 来自 payload 层两条守卫：

```js
if (setTimeout.toString().indexOf("native")  === -1) v6 |= (1 << 5);
if (setInterval.toString().indexOf("native") === -1) v6 |= (1 << 4);
```

⇒ 补环境时 `setTimeout` / `setInterval` 必须是**原生形态**。

### 6.2 每次请求都重发一整套

| 观测 | 实测 |
|---|---|
| build JS 内容每次都变 | 连取 3 次：522097 / 522009 / 521706 字节，3 个不同 sha256 |
| 每 build 的会话常量都变 | `xreg/mask` 取过 `0x2a/0x27`、`0x36/0x18`、`0x40/0x37`、`0x30/0x4d` |
| meta 每次都变 | 172 字符 base64 = **128 字节** |

机制：服务端为每次请求新生成 `(rk, alphabet, xreg, mask, iv)`，用它重新加密池里的占位令牌，
产出**内容哈希命名**的新 build JS；同时下发新 meta。

### 6.3 `ck` 与 `meta` 没有算法关系

站点自己的拼 cookie 函数（逐字取自线上 build JS）：

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

**只是 `-` 字符串拼接**：meta 不进 ck 的计算，ck 也不含 meta 的任何变换。cookie 有效期 `630e8` ms ≈ **7.29 天**。

meta 本身是**服务端自持的 128 字节不透明值**（熵 6.6 bit/byte，与 build hash 无关，
用该 build 的 `rk` 也解不出 record93 头）。

### 6.4 绑定关系实测

| 组合 | 落点 |
|---|---|
| `ck(buildA) + metaA` | `302 → /people/zhihuadmin` |
| `ck(buildA) + metaB`（另一次挑战） | **`403` 挑战页** |
| `ck(w0=7442) + metaA` | `302 → /people/zhihuadmin` |
| `ck(w0=56a8) + metaA` | `302 → /people/zhihuadmin` |

⇒ **规律**：`ck` 绑定的是「meta 指向的那次挑战的 **build 常量**」，不是 meta 本身。
服务端拿 meta 查表取回常量再解密 ck。

**推论**：同一次挑战内 `w0` / `tail4` / `nonce` / `iv[0:4]` 全自由 ⇒
**一个 meta 可产出任意多个可用 ck**；而**一个 ck 只能配它自己那次挑战的 meta**。
整条流程必须**在一次抓取内闭环**。

---

## 7. 纯算流水线

```
python py/zse_ck.py token          # 抓当次 build → 零执行推常量 → 出 ck → 提交
python py/zse_ck.py token --dry    # 不提交，只打印 ck / cookie / record93
python py/zse_ck.py consts <wasm>  # 只打印每-build 常量
python py/zse_ck.py trace          # 跑纯 JS VM 落轨迹 → 语义对拍
python py/zse_ck.py check          # 全部验收门
```

四步全在 Python 里完成，**不跑站点代码、不跑 wasm、不读内存**：

1. GET 目标页 → 403 挑战页 → 解析 meta + build URL → 下载 build JS
2. 从 build JS 里抽出内嵌 wasm
3. 解常量池 → 推 `rk` / `alphabet` / `xreg` / `mask` / `iv`
4. 拼 record93 → 加密 → radix64 → 提交

**实测**：全新随机 build（每次轮换）→ `302 → /people/zhihuadmin`（真实页）。

---

## 8. 还原程度与已知边界

| 环节 | 状态 |
|---|---|
| 位图 / 指纹 / crc32 | 已还原，与真机逐字一致 |
| `encrypt_96` + CBC + radix64 | 已还原（`py/zse_cipher.py`） |
| `rk` / `alphabet` | 已还原（池里的静态字面量） |
| `xreg` / `mask` / `iv[4:16]` | 已还原（零执行可推） |
| 四层 VM 程序 | 已还原，逐块差分全过 |
| Go VM 取指层 + 语义层 | 已还原，37309/37309 对拍 |

**边界**（不是缺陷）：

1. **位图 / 指纹是环境相关常量**：换 handenv 或换 UA 后必须重新确认。
2. **每-build 常量随 build 轮换**：必须用当次 build 的 wasm 推。
3. **`iv[0:4]` 有候选歧义**，但任意值都可用。
4. **VM 类（BVM/CVM 解释器）只有混淆形态**（`.probe/zsec/src_*.js`），没有去混淆版；
   272 词微码 T 表未解出——解码器需要两个不在树内的执行产物。VM 类属于「实现它的 VM」，不是纯算目标。
5. **`zh` / `qh` 的内容每次不同**：链式 XOR 的会话绑定值，长度已一致。
6. **`meta` 是服务端下发的**，客户端无从还原。

---

## 9. 方法论

这套东西能还原出来，靠的是四条纪律：

1. **分层推进，每层设证据门**——从最先加载的东西开始，一层只解决一件事。
2. **禁止暴力**——不在大参数空间里盲扫；搜索必须由已知明文或已知结构把未知量压到十几个候选以内。
3. **行为不同必须用真机对拍差分**——先定位到**唯一**差异点，再改；总量差异只用于判断「还没跑通」。
4. **假设与结论分离**——每个结论标 `已验证` / `假设` / `未执行`；被否证的假设留在文档里。

细节见 `docs/METHOD.md` 与 `docs/PITFALLS.md`。

---

## 10. 目录

| 目录 | 内容 |
|---|---|
| `py/` | 纯算流水线（推常量 / 拼 record93 / 加密 / 提交 / 取指反汇编 / 语义对拍） |
| `js/` | 各层 VM 程序的还原件（`.decompiled` → `.restored.source` → `.restored` → `.final`） |
| `tools/` | 还原链（AST）与验收器 |
| `docs/` | 规格与坑（`BITMAP` / `FINGERPRINT` / `GO_VM` / `METHOD` / `PITFALLS` / `RESTORATION` / `MISSING`） |
| `.probe/` | 运行所需的最小数据（wasm、手写环境、反编译产物、lift 产物、轨迹） |
| `native/` | native addon（原生 `Function.prototype.toString` + `document.all` 的 `[[IsHTMLDDA]]`） |
| `DELIVERY/` | 交付包 |
