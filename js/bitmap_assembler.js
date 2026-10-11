// js/bitmap_assembler.js —— 「拼 48-hex 的 JS 侧汇编器」可运行还原版
//
// 本文件把四层 VM 中「把 16 位累加字拼成 48-hex 位图」的完整链路写成可读、可运行的 JS，
// 全部来自静态 AST 提取（tools/bitmap_ast.js）+ 动态实验（ZSE_FLIPV / ZSE_SEQ16 / ZSE_FCC）
// + 离线解码（tools/decode_zh.py）验证，**不含任何硬修正**。
//
// ── 一、结构（已逐字符验证）───────────────────────────────────────────────
//
//   record93 = [48-hex 位图][32-hex 指纹(md5)][ 'z' ][8-hex crc32(UA)][4-hex tail]
//   96 B = record93 + PKCS#7(3) → 6 块 CBC → radix64(会话字母表) → 128 字符
//   ck = "005_" + 128 = 132 字符
//
//   48-hex 位图 = 12 × 16-bit 字：
//     w0      会话标签（每会话随机）
//     w1..w4  ← payload 层  v3..v6   .toString(16)   （16 hex）
//     w5..w6  ← inner   层  v3,v4    .toString(16)   （8  hex）
//     w7..w9  ← 【Go 侧】3 字 = 12 hex（无 JS 载体，见第五节）
//     w10..w11← cvm     层  v7,v8    .toString(16)   （8  hex）
//
// ── 二、各层累加器初值（AST 静态提取，`.probe/lift/*.lifted.js`）──────────
//
//   payload  FR_0 @ L70  :  v3=1<<13  v4=1<<12  v5=1<<15  v6=1<<14  v7=SEP
//   inner    FR_0 @ L58  :  v3=1<<15  v4=1<<14  v5=SEP
//   cvm      FR_0 @ L77  :  v7=1<<15  v8=1<<14  v9=1<<13  v10=1<<12
//
//   之后每个环境检测命中就 `vN |= (1<<k)`。每个 `(1<<k)` 站点及其守卫条件可用
//   `node tools/bitmap_ast.js .probe/lift/<层>.lifted.js --md 报告.md` 全量导出。
//
// ── 三、链式 XOR 流函数（payload FR_1832 / inner FR_869 / cvm FR_877，三者同构）──
//
//   out[i] = in[i] ^ key[i % key.length] ^ out[i-1]        out[-1] = __b.a3
//   __b.a3 = out[最后一位]                                  ← 状态跨层、跨调用共享
//
//   注意：状态是**前一个输出字符**，因此
//     · 编码/解码是同一个函数
//     · 解码时 `plain[i] = ct[i] ^ key[i%klen] ^ ct[i-1]`（i>=1 不需要进入状态）
//
// ── 四、各层写出的密文串（分隔符是隐形 Unicode 字符）────────────────────
//
//   SEP_payload = U+200C, SEP_cvm = U+200E, SEP_inner = U+2008
//
//   __b.zh (payload 先写，inner 追加) =
//        X(v56, 'acc7471d3eb9bc30')   v56 = Math.floor(random*65536*16).toString(16)
//                                     + crypto.getRandomValues(Uint32Array(1))[0].toString(16)
//      + SEP_payload
//      + X(v59, 'f25b8434cca9a1f5')   v59 = v3+v4+v5+v6 的 16 hex   ← 位图 w1..w4
//      + SEP_payload
//      + btoa(new Error().stack)      ← 明文，不加密
//      + SEP_payload
//      + X(inner8, 'b53cc3fa93dc8013')  inner 的 8 hex            ← 位图 w5..w6
//      + SEP_inner
//
//   __c.qh =
//        X(cvm8, '6a6cb1bb3970bae6')     cvm 的 8 hex             ← 位图 w10..w11
//      + SEP_cvm
//      + X(fp32, '44ae0b7a68bf0f7a')     fp32 = 32 hex 指纹(md5)  ← record93 的指纹段
//
//   实测段长（一次干净会话）：zh = [13][SEP][16][SEP][1148][SEP][8][SEP]，qh = [8][SEP][32]
//
// ── 五、尚未归属的 12 hex ────────────────────────────────────────────────
//
//   w7..w9 在四层 devirt 产物里**没有任何 toString(16) 产出点**（tools/bitmap_ast.js
//   穷举 4 层全部帧、全部进制，无遗漏），也不是字符串常量，也不走宿主桥接（H 通道
//   2658 条返回全无、copyBytesToGo 21 条 srcText 全无、DataView.setUint8 只写 2 字节）。
//   真机该组 = 8800 8000 8000，本环境 = 9800 8000 8000（差 1 位）。
//   ⇒ 判为 **Go(wasm) 侧自算的 3 个字**。Go 侧可枚举的环境探针共 16 条（见下），
//     本环境全部返回真机正确值，故差异另有来源。
//
// ── 六、Go 侧环境探针（从宿主调用 srcText 提取，共 16 条）─────────────────
//
//   typeof process / require / module / exports / __dirname / __filename  !== 'undefined'
//   typeof window._parent / _origin / _document / _virtualConsole          !== 'undefined'
//   typeof ws !== 'undefined' && ws.toString().indexOf('ocke') !== -1
//   typeof JSDOM / Hlclient / v_saf                                        !== 'undefined'
//   window.constructor.toString()          （期望 "function Window() { [native code] }"）
//   document.createElement('div' | 'canvas')
//
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. 链式 XOR 流函数（与 FR_1832 逐句对应）
// ─────────────────────────────────────────────────────────────────────────────
function xstream(inp, key, state) {
  const out = [];
  let st = state;
  for (let i = 0; i < inp.length; i++) {
    const c = (inp.charCodeAt(i) ^ key.charCodeAt(i % key.length) ^ st) & 0xffff;
    st = c;
    out.push(String.fromCharCode(c));
  }
  return { out: out.join(''), state: st };
}

// 解码：状态是前一个**密文**字符，因此 i>=1 不需要进入状态
function xdecode(ct, key, stateIn) {
  const out = [];
  let prev = stateIn;
  for (let i = 0; i < ct.length; i++) {
    out.push(String.fromCharCode((ct.charCodeAt(i) ^ key.charCodeAt(i % key.length) ^ prev) & 0xffff));
    prev = ct.charCodeAt(i);
  }
  return out.join('');
}

const KEY = {
  random: 'acc7471d3eb9bc30',   // zh[0]
  payload: 'f25b8434cca9a1f5',  // zh[1]  → 位图 w1..w4
  inner: 'b53cc3fa93dc8013',    // zh[3]  → 位图 w5..w6
  cvm: '6a6cb1bb3970bae6',      // qh[0]  → 位图 w10..w11
  fingerprint: '44ae0b7a68bf0f7a' // qh[1] → record93 指纹段
};

const SEP = { payload: 0x200c, cvm: 0x200e, inner: 0x2008 };

// ─────────────────────────────────────────────────────────────────────────────
// 2. 从各层累加器拼出该层的 hex 串（等价于原 VM 的 toString(16) 连做）
//    v3..v6 等就是「16 位累加字」，初值见文件头第二节，之后 |= (1<<k)
// ─────────────────────────────────────────────────────────────────────────────
function layerHex(words) {
  // words: 该层的累加字数组，按汇编器顺序
  return words.map(w => (w >>> 0).toString(16).padStart(4, '0')).join('');
}

// payload 的 16 hex（= v3..v6），inner 的 8 hex（= v3,v4），cvm 的 8 hex（= v7,v8）
const layer = {
  payload16: v => layerHex([v.v3, v.v4, v.v5, v.v6]),
  inner8:    v => layerHex([v.v3, v.v4]),
  cvm8:      v => layerHex([v.v7, v.v8])
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. 按第四节的结构写出 zh / qh（等价于原 VM）
// ─────────────────────────────────────────────────────────────────────────────
function buildZh(acc, nonceHex, stack, a3) {
  const P = String.fromCharCode(SEP.payload);
  let st = a3;
  const r1 = xstream(nonceHex, KEY.random, st); st = r1.state;
  const r2 = xstream(layer.payload16(acc), KEY.payload, st); st = r2.state;
  const r3 = xstream(layer.inner8(acc), KEY.inner, st);
  return {
    zh: r1.out + P + r2.out + P + Buffer.from(stack, 'binary').toString('base64') + P + r3.out + String.fromCharCode(SEP.inner),
    a3: r3.state
  };
}

function buildQh(acc, fingerprint32, a3) {
  const C = String.fromCharCode(SEP.cvm);
  let st = a3;
  const r1 = xstream(layer.cvm8(acc), KEY.cvm, st); st = r1.state;
  const r2 = xstream(fingerprint32, KEY.fingerprint, st);
  return { qh: r1.out + C + r2.out, a3: r2.state };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. 从 zh / qh 反解位图（离线验证用；与 tools/decode_zh.py 等价）
// ─────────────────────────────────────────────────────────────────────────────
function decodeBitmapFromZhQh(zh, qh) {
  const zp = zh.split(String.fromCharCode(SEP.payload));
  const qp = qh.split(String.fromCharCode(SEP.cvm));
  // 进入状态 = 前一个被 X 段的末字符（zh[2] 是明文 btoa，不参与链）
  const stZh1 = zp[0].charCodeAt(zp[0].length - 1);
  const stZh3 = zp[1].charCodeAt(zp[1].length - 1);
  const stQh0 = zp[3].charCodeAt(zp[3].length - 1);
  const stQh1 = qp[0].charCodeAt(qp[0].length - 1);
  const payload16 = xdecode(zp[1], KEY.payload, stZh1);
  const inner8 = xdecode(zp[3], KEY.inner, stZh3);
  const cvm8 = xdecode(qp[0], KEY.cvm, stQh0);
  const fp32 = xdecode(qp[1], KEY.fingerprint, stQh1);
  return { payload16, inner8, cvm8, fp32 };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. 组装 record93（w7..w9 需由 Go 侧提供）
// ─────────────────────────────────────────────────────────────────────────────
function buildRecord93(o) {
  // o = { tag4, payload16, inner8, goSide12, cvm8, fingerprint32, crc8, tail4 }
  const bitmap48 = o.tag4 + o.payload16 + o.inner8 + o.goSide12 + o.cvm8;
  if (bitmap48.length !== 48) throw new Error('bitmap must be 48 hex, got ' + bitmap48.length);
  return bitmap48 + o.fingerprint32 + 'z' + o.crc8 + o.tail4;
}

module.exports = { xstream, xdecode, layerHex, layer, buildZh, buildQh, decodeBitmapFromZhQh, buildRecord93, KEY, SEP };

// ── 自检：用一次干净会话的实测 zh/qh 反解，应与内存 record93 逐字符一致 ──
if (require.main === module) {
  const fs = require('fs');
  const zhf = '.probe/zsec/zh_full.txt', qhf = '.probe/zsec/qh_full.txt';
  if (fs.existsSync(zhf) && fs.existsSync(qhf)) {
    const zh = fs.readFileSync(zhf, 'utf8'), qh = fs.readFileSync(qhf, 'utf8');
    const d = decodeBitmapFromZhQh(zh, qh);
    console.log('payload16 =', d.payload16, '(payload 16hex：w1..w4)');
    console.log('inner8    =', d.inner8,    '(inner 8hex：w5..w6)');
    console.log('cvm8      =', d.cvm8,      '(cvm 8hex：w10..w11)');
    console.log('fp32      =', d.fp32,      '(应等于 wasm 内存里 record93 的 32-hex 指纹段)');
  } else {
    console.log('未找到 zh/qh 样本，跳过自检');
  }
}
