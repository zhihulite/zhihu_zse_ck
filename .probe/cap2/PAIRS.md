# token 时刻完整内存 + (明文, 密文, 字母表) 三元组
抓取：`.probe/cap2/srv.py`（127.0.0.1:8777 接收）+ camoufox 持久 hook（document.cookie setter 同步 dump + 同步 XHR）
hook 关键点：sessionStorage.setItem 毒化 throw（阻止 sc() reload）、劫持 WebAssembly.instantiate 拿 memory 引用。

| dump | 会话 | 字母表（每会话唯一，内存里 3 份） | record93 前4/末4 | md5 | crc32(UA) |
|---|---|---|---|---|---|
| 1791188163828 | A | 9niXuNFwPHU7jDOAf=xsh1etS6LaBWpIZMyJ083YcVrd2TvQbERoglGqzK4Cmk5/ | (750KB 窗口，无 record) | — | — |
| 1791188311688 | B | AFgEaI06TDeO/G9PNdBcMkHuxWrS4U=phnR3m1iClVJ7tsYKjy5fZLvb2QXqow8z | ac60 / 5203 | aef15fe2d24d9213feb6845f2ee726fa | 5d98534a |
| 1791188402298 | C | xLNzSC8OqFMgdnV0a2JPWAQBcshZDbkpef1lrHUwv/um36X4EGt5jyYRio7TKI9= | 40de / 0314 | cd2bace611db62f0b299d4ae35a7f722 | 5d98534a |
| 1791188434809 | D | mu=2i7KJwrtkONpAdjSHR148ehgsIQ5xbGU60P/yETMDq9fWocCnFYlLBVZv3azX | e878 / 5fda | cd2bace611db62f0b299d4ae35a7f722 | 5d98534a |
| 1791188449182 | E | bgd3vhDwxjE4pfHeAlIyt0UuNBna2M/7qYJGsZ1kVmrXOFKS=9W8i6RLQ5zcPCoT | 29b6 / 1932 | cd2bace611db62f0b299d4ae35a7f722 | 5d98534a |

- 内存里 UA 原文 @0x14D340；`crc32(UA)=5d98534a` 与 record 内嵌 hex 逐字节吻合。
- record93 被逐段拼出（0x14DD90 长度 57 → 0x14DE50 长度 89 → 0x14DEF0 长度 93）。
- payload(128) 被**逐字符**拼出（8/16/32/64/96/128 各级副本 123/115/99/67/35/3 份）。
- ct96 = radix64_字母表(payload)；pt96 = record93 + PKCS#7(3×0x03)。
- **结构**：明文只差 8 字节 → 密文 96 字节全变（强扩散，排除 XOR 链族）；
  PT 块1/2 跨运行相同但 CT 块全不同 ⇒ 非 ECB；标准 SM4（5 已知密钥 + 十余派生候选，ECB/CBC）与 AES 全 0 命中。
- 工具：`.probe/sm4.py`（自写标准 SM4，可复跑）；`.probe/cap2/all.json` / `pair.json`。
