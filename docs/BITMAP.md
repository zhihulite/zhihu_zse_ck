# 位图与 record93

## 1. 结构

```
record93 = <48 hex 位图> <32 hex 指纹> 'z' <8 hex crc32(UA)> <4 hex tail>
ck       = '005_' + radix64( encrypt_96( record93 + PKCS#7(3), rk, iv, mask ), alphabet, xreg )
```

48 hex 位图 = 12 个 16 位字：

| 字 | 来源 |
|---|---|
| `w0` | 会话标签（每代随机 4 hex） |
| `w1..w4` | payload 层 `v3..v6` 的 `toString(16)` |
| `w5..w6` | inner 层 `v3,v4` |
| `w7..w9` | Go 侧自算（12 hex，JS 层无载体） |
| `w10..w11` | orchestrator（CVM）层 `v7,v8` |

## 2. 各层累加器

```
payload      FR_0 : v3=1<<13  v4=1<<12  v5=1<<15  v6=1<<14
inner        FR_0 : v3=1<<15  v4=1<<14
orchestrator FR_0 : v7=1<<15  v8=1<<14  v9=1<<13  v10=1<<12
```

之后每个环境检测命中就 `vN |= (1 << k)`。逐条守卫清单见 `js/bitmap_detection.restored.js`。

## 3. 链式 XOR 流（payload / inner / orchestrator 三层同构）

```
out[i] = in.charCodeAt(i) ^ key.charCodeAt(i % key.length) ^ state
state  = out[i]                      // 状态是前一个输出字符
acc   += String.fromCharCode(out[i])
```

解码时 `plain[i] = ct[i] ^ key[i%len] ^ ct[i-1]`（状态是前一个**密文**字符）。
各层密钥与分隔符：

| 层 | 密钥 | 分隔符 |
|---|---|---|
| payload | `f25b8434cca9a1f5` | U+200C |
| inner | `b53cc3fa93dc8013` | U+2008 |
| orchestrator | `6a6cb1bb3970bae6` | U+200E |
| 指纹段 | `44ae0b7a68bf0f7a` | — |
| 首段随机 | `acc7471d3eb9bc30` | — |

## 4. 写出的两串

```
__b.zh = X(nonce,'acc7471d3eb9bc30') + SEP + X(payload16,'f25b8434cca9a1f5') + SEP
       + btoa(Error().stack) + SEP + X(inner8,'b53cc3fa93dc8013') + SEP_inner
__c.qh = X(cvm8,'6a6cb1bb3970bae6') + SEP_cvm + X(fp32,'44ae0b7a68bf0f7a')
```

## 5. `w4` 是会话判据（决定性）

服务端按 record93 的位图判断会话是否可信。逐字段扫描（同 build、同 meta，只改位图）：

| 位图 | 落点 |
|---|---|
| `w4 = 0x4000` | `302 → /people/zhihuadmin`（真实页） |
| `w4 = 0x4030` | `302 → /account/unhuman`（token 有效、会话被反标记） |
| `w7 = 0x8000` 或 `0x8800` | 都通过（不参与判定） |
| 指纹值、UA | 都不参与判定 |

`w4` 的 bit5/bit4 来自 payload 层 v6 的两条守卫：

```js
if (setTimeout.toString().indexOf("native")  === -1) v6 |= (1 << 5);
if (setInterval.toString().indexOf("native") === -1) v6 |= (1 << 4);
```

⇒ 补环境里 `setTimeout` / `setInterval` 必须是**原生形态**（见 `docs/PITFALLS.md`）。
本环境稳定位图（`w1..w11`）：

```
2000 1000 8000 4000 8000 8000 8000 8000 8000 8000 4000
```

## 6. Go 侧的 12 hex（`w7..w9`）

JS 四层里没有任何 `toString(16)` 产出点，也不是字符串常量 ⇒ 由 wasm 内的 Go 程序自算。
它读的是环境探针结果（`typeof process/require/module/exports/__dirname/__filename`、
`window._parent/_origin/_document/_virtualConsole`、`JSDOM`/`Hlclient`/`v_saf`、
`window.constructor.toString()`、`document.createElement('div'|'canvas')` 等）。

## 7. 可运行产物

```bash
python py/bitmap.py --selftest     # 反解 zh/qh + 往返 + 与同源 record93 对拍
node js/bitmap_assembler.js        # 汇编器自检
```

`py/bitmap.py` 与 `js/bitmap_assembler.js` 提供同一组 API：
`xstream` / `xdecode` / 各层 hex / `buildZh` / `buildQh` / `decodeBitmapFromZhQh` / `buildRecord93`。
