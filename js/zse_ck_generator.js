/**
 * zse_ck (005_) token generator — pure JS port of .probe/vmsvc/zse_cipher.py
 *
 * 还原的逻辑链（与浏览器里执行顺序一致）：
 *   环境检测 -> record93 = 48hex 字体位图 + 32hex 指纹MD5 + 'z' + 8hex crc32(UA) + 4hex
 *            -> +PKCS#7(3x03) = 96B 明文
 *            -> 6 块 CBC（明文单字节掩码 + IV）: input_b = P_b ^ MASK ^ C_{b-1}
 *            -> 每块 32 轮: X_{i+4} = X_i ^ L(A_i),  A_i = S(X_{i+1}^X_{i+2}^X_{i+3} ^ RK_i)
 *               L(x) = x ^ rotl(x,2) ^ rotl(x,10) ^ rotl(x,18) ^ rotl(x,24)   (同标准 SM4)
 *               输出 = X35||X34||X33||X32
 *            -> 96B 密文 -> radix64（按密文逆序取字节, 每会话字母表 + XREG）-> payload(128)
 *            -> token = '005_' + payload
 *
 * 会话参数 rk(32字)/MASK/IV/alphabet/XREG 由指纹派生，绑定指纹 MD5（record[48:80]）。
 * S 盒是全局常量。
 */
'use strict';

// ---------------------------------------------------------------- S 盒（全局常量）
const SBOX_INV = [
  0xd4,0xd3,0x6e,0x0f,0x19,0x12,0xac,0xb9,0x3d,0x4b,0x0d,0x30,0x98,0xed,0x83,0x37,
  0xd2,0x43,0x11,0x8b,0x52,0x07,0x97,0x93,0x63,0x47,0x60,0xbe,0x75,0x38,0xae,0xe4,
  0x4c,0x6a,0x5b,0xe6,0x8a,0xab,0xcc,0xa9,0xf6,0xc7,0x17,0x3b,0x58,0xdf,0xd7,0x9f,
  0x54,0xb7,0x33,0x0c,0xc3,0x50,0x34,0x6f,0xef,0x27,0xcf,0x18,0xd0,0x51,0x9a,0xa5,
  0x94,0x02,0x87,0x0e,0x92,0x4a,0x68,0x03,0x86,0x2c,0xa2,0x40,0xda,0x8e,0x62,0xb1,
  0x26,0x76,0xf9,0x36,0x01,0x9c,0x48,0x31,0xa3,0x32,0x7a,0x79,0x7f,0x45,0x28,0x61,
  0xf7,0x96,0x7e,0xc6,0x65,0xa7,0xa4,0xf0,0x59,0xf5,0x04,0xff,0xbb,0xf4,0x4d,0x3c,
  0xfa,0xaa,0xdd,0x74,0x1d,0xe1,0xc1,0x91,0xdc,0xe7,0x25,0xb0,0xc4,0xa6,0xd8,0x3f,
  0x56,0x49,0x1a,0x84,0xa8,0xb3,0xea,0x2d,0x95,0x0a,0x0b,0xc9,0x5c,0x10,0x2f,0x8f,
  0xa0,0x73,0x99,0xfb,0xc8,0xec,0x9d,0xc5,0xe5,0x7c,0xe8,0x1e,0x16,0x55,0x15,0x6c,
  0xd1,0xca,0x5e,0x08,0x23,0x82,0x1f,0x00,0x14,0x53,0x64,0xb6,0x66,0x5f,0x7d,0x09,
  0x2b,0x29,0x6d,0xf8,0x90,0xe9,0xb8,0xdb,0x3e,0xa1,0xeb,0xf1,0x9b,0xd9,0x7b,0x41,
  0xfe,0xd6,0x8d,0xc2,0x85,0xf2,0x6b,0xbf,0x5d,0x22,0x39,0x71,0x88,0x06,0xde,0xc0,
  0x80,0xf3,0xd5,0xe0,0xce,0x05,0x35,0xb2,0x72,0x57,0x8c,0xb5,0x13,0xfc,0x4f,0x24,
  0x1b,0xcd,0x46,0x78,0x4e,0xe3,0xba,0x1c,0xbc,0x21,0x5a,0x89,0x44,0x20,0xbd,0xaf,
  0x70,0xcb,0x9e,0xb4,0xe2,0x2e,0x2a,0x81,0x3a,0x67,0xad,0xee,0xfd,0x77,0x42,0x69,
];
const SBOX = new Array(256).fill(0);
for (let v = 0; v < 256; v++) SBOX[SBOX_INV[v]] = v;

// ---------------------------------------------------------------- 32 位工具
const rotl = (x, r) => ((x << r) | (x >>> (32 - r))) >>> 0;
const L = x => (x ^ rotl(x, 2) ^ rotl(x, 10) ^ rotl(x, 18) ^ rotl(x, 24)) >>> 0;
const be32 = (b, o) => ((b[o] << 24) | (b[o+1] << 16) | (b[o+2] << 8) | b[o+3]) >>> 0;
const put32 = (x) => [(x >>> 24) & 255, (x >>> 16) & 255, (x >>> 8) & 255, x & 255];

// ---------------------------------------------------------------- 单块 32 轮
function encryptBlock(block16, rk) {
  const X = [];
  for (let i = 0; i < 4; i++) X.push(be32(block16, 4 * i));
  for (let i = 0; i < 32; i++) {
    const w = (X[i+1] ^ X[i+2] ^ X[i+3] ^ rk[i]) >>> 0;
    const a = be32(new Uint8Array(SBOX.map(s => s & 255).map((_, ) => 0)), 0); // placeholder
    const sb = [SBOX[(w>>>24)&255], SBOX[(w>>>16)&255], SBOX[(w>>>8)&255], SBOX[w&255]];
    const av = ((sb[0] << 24) | (sb[1] << 16) | (sb[2] << 8) | sb[3]) >>> 0;
    X.push((X[i] ^ L(av)) >>> 0);
  }
  return [].concat(put32(X[35]), put32(X[34]), put32(X[33]), put32(X[32]));
}

function decryptBlock(block16, rk) {
  const X = new Array(36).fill(0);
  X[35] = be32(block16, 0); X[34] = be32(block16, 4);
  X[33] = be32(block16, 8); X[32] = be32(block16, 12);
  for (let i = 31; i >= 0; i--) {
    const w = (X[i+1] ^ X[i+2] ^ X[i+3] ^ rk[i]) >>> 0;
    const sb = [SBOX[(w>>>24)&255], SBOX[(w>>>16)&255], SBOX[(w>>>8)&255], SBOX[w&255]];
    const av = ((sb[0] << 24) | (sb[1] << 16) | (sb[2] << 8) | sb[3]) >>> 0;
    X[i] = (X[i+4] ^ L(av)) >>> 0;
  }
  return [].concat(put32(X[0]), put32(X[1]), put32(X[2]), put32(X[3]));
}

// ---------------------------------------------------------------- 6 块 CBC + 掩码
function encrypt96(pt96, rk, iv, mask) {
  if (pt96.length !== 96) throw new Error('pt96 must be 96 bytes');
  let prev = iv.slice();
  const out = [];
  for (let b = 0; b < 6; b++) {
    const inp = [];
    for (let k = 0; k < 16; k++) inp.push((pt96[16*b + k] ^ prev[k] ^ mask) & 255);
    const c = encryptBlock(inp, rk);
    for (let k = 0; k < 16; k++) out.push(c[k]);
    prev = c;
  }
  return out;
}

function decrypt96(ct96, rk, iv, mask) {
  let prev = iv.slice();
  const out = [];
  for (let b = 0; b < 6; b++) {
    const c = ct96.slice(16*b, 16*b + 16);
    const inp = decryptBlock(c, rk);
    for (let k = 0; k < 16; k++) out.push((inp[k] ^ prev[k] ^ mask) & 255);
    prev = c;
  }
  return out;
}

// ---------------------------------------------------------------- radix64（逆序取字节）
const circ = (v, s) => (((v >>> s) | (v << ((32 - s) % 32))) >>> 0) & 63;

function radix64Encode(ct96, alphabet, xreg) {
  const seq = ct96.slice().reverse();
  const out = [];
  for (let g = 0; g < 32; g++) {
    const base = [0, 24, 16, 8][g % 4];
    let v = 0;
    for (let j = 0; j < 3; j++) v = (v | ((seq[g*3 + j] << ((base + 8*j) % 32)) >>> 0)) >>> 0;
    v = (v & 0xffffffff) ^ xreg;
    for (let k = 0; k < 4; k++) out.push(alphabet[circ(v, (base + 6*k) % 32)]);
  }
  return out.join('');
}

function radix64Decode(payload, alphabet, xreg) {
  const inv = {}; for (let i = 0; i < alphabet.length; i++) inv[alphabet[i]] = i;
  const seq = new Array(96).fill(0);
  for (let g = 0; g < 32; g++) {
    const base = [0, 24, 16, 8][g % 4];
    let v = 0;
    for (let k = 0; k < 4; k++) {
      const s = (base + 6*k) % 32;
      const q = inv[payload[g*4 + k]];
      v = (v | (((q << s) | (q >>> ((32 - s) % 32))) >>> 0)) >>> 0;
    }
    v = (v & 0xffffffff) ^ xreg;
    for (let j = 0; j < 3; j++) {
      const o = (base + 8*j) % 32;
      seq[g*3 + j] = (((v >>> o) | (v << ((32 - o) % 32))) >>> 0) & 255;
    }
  }
  return seq.reverse();
}

// ---------------------------------------------------------------- 对外接口
/** record93(93B) + PKCS#7(3x03) -> 96B 明文 */
const record93ToPt = rec => [].concat(Array.from(rec), [3, 3, 3]);

/** record93(93B) -> 完整 token '005_' + payload(128) */
function generateToken(rec93, profile) {
  const rk = profile.rk;
  const iv = Array.from(profile.iv_bytes || Array.from(String(profile.iv), c => c.charCodeAt(0)));
  const mask = profile.mask;
  const rec = Array.isArray(rec93) ? rec93 : Array.from(String(rec93), c => c.charCodeAt(0) & 255);
  if (rec.length !== 93) throw new Error('record93 must be 93 bytes');
  const ct = encrypt96(record93ToPt(rec), rk, iv, mask);
  return '005_' + radix64Encode(ct, profile.alphabet, profile.xreg);
}

/** 反向：token -> record93（校验/调试用） */
function parseToken(token, profile) {
  const payload = token.slice(4);
  const iv = Array.from(profile.iv_bytes || Array.from(String(profile.iv), c => c.charCodeAt(0)));
  const ct = radix64Decode(payload, profile.alphabet, profile.xreg);
  const pt = decrypt96(ct, profile.rk, iv, profile.mask);
  return { pt96: pt, record93: pt.slice(0, 93), pad: pt.slice(93) };
}

module.exports = { SBOX_INV, SBOX, encryptBlock, decryptBlock, encrypt96, decrypt96,
                   radix64Encode, radix64Decode, generateToken, parseToken, record93ToPt,
                   rotl, L };
