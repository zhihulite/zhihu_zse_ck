# 缺失件

原始捕获大部分在树内，但有一部分（尤其是**执行产物**）从来没有落过盘，无法还原。本文只列现状。

## 仍缺

| 类 | 例子 | 原因 |
|---|---|---|
| VM 程序数据段 | `prog_19076` / `prog_88096` / `prog_14716` / `prog_41892` | 由跑脚本产生 |
| 真机原始捕获 | `browser-proto7.json`、`callgraph.json`、`microcode_ops.json`、`real_VM_src.bin` | 同上 |
| 分析中间物 | `.probe/zsec/bptail.json`、`.probe/zsec/govm_decode_table.json`、`.probe/oracle/meta.txt` | 同上 |
| 运行期输出 | `mem_mine.bin`、`disp2.txt`、`out/len_emp.json` | 重跑即得 |
| 浏览器状态快照 | `state_capture.json` / `cap_raw.json`（localStorage `__CAP` 849020 字符） | 从未落盘 |

**影响范围**：只影响「对照路径」（跑真机代码那条线）。
交付路径（`py/zse_ck.py token`、`py/pure_calc_verify.py`）与 `tools/verify_all.py` **都不依赖它们**。

## 从快照派生出来的 blob

`state_capture.json` → localStorage `__CAP` → `cap_raw.json` 共 9 项。原件不在，但内容多数在树内别处：

| 项 | 树内来源 | 状态 |
|---|---|---|
| `eval_136041.js`（136041 字符，挑战 JS） | `.probe/zsec/eval_arg_big.js`（长度逐字节相同） | 已放回 `.probe/zsec/blobs/` |
| `eval_11841_service.js` | `.probe/src0.decoded.txt` | 已放回 |
| `eval_62501.js`（payload 源码） | `.probe/zsec/eval_arg_mid.js` | 已放回 |
| `jsvmp_27264.js`（指纹 jsvmp） | `.probe/zsec/src1_orig.js` | 已放回 |
| `wasm_b64`（447272 → 335454 B） | `.probe/build-859e.wasm` | 在 |
| `prog_19076` / `prog_88096` / `prog_14716` / `prog_41892` | — | 树内没有 |

## 在的大件（别误以为丢了）

`.probe/zsec/mem_build.bin`（5 MB 真机内存 dump）· `.probe/wt/zse.wat`（1.5 MB）·
`.probe/wt/zse.decompiled.js`（479 KB）· `.probe/zsec/_transformed.js`（759 KB）·
`.probe/a7d63cc5.wasm` / `.probe/build-859e.wasm` · `.probe/tmp/mine_{int,bind,dop}.txt`（语义门轨迹）。
