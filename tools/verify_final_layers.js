// tools/verify_final_layers.js —— 验证修好伪影后的 *.final.js 能**真的跑**、且结果与真机一致
//
// 判据：把三层「链式 XOR 流」函数直接调起来，用真机 zh/qh 里的密文段对拍。
//
//   cvm   FR_877(A, [cvm8,  KEY.cvm],  S)  -> qh[0]
//   inner FR_869(A, [inner8,KEY.inner],S)  -> zh[3]
//   payload FR_1832(A,[payload16,KEY.payload],S) -> zh[1]
//
// 进入状态 = 前一个被 X 段的末字符（与 js/bitmap_assembler.js 的 decodeBitmapFromZhQh 一致）。
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const P = (...a) => path.join(ROOT, ...a);

const KEY = {
  random: 'acc7471d3eb9bc30',
  payload: 'f25b8434cca9a1f5',
  inner: 'b53cc3fa93dc8013',
  cvm: '6a6cb1bb3970bae6',
  fingerprint: '44ae0b7a68bf0f7a',
};
const SEP = { payload: 0x200c, cvm: 0x200e, inner: 0x2008 };

function loadSandbox(file) {
  const src = fs.readFileSync(P('js', file), 'utf8');
  const sandbox = { console, Error, Function, String, Number, Object, Array, Math, JSON, __b: { a3: 0 } };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: file });
  return sandbox;
}

const zh = fs.readFileSync(P('.probe', 'zsec', 'zh_full.txt'), 'utf8');
const qh = fs.readFileSync(P('.probe', 'zsec', 'qh_full.txt'), 'utf8');
const zp = zh.split(String.fromCharCode(SEP.payload));
const qp = qh.split(String.fromCharCode(SEP.cvm));

const results = [];
function run(tag, file, fn, args, state, expect) {
  try {
    const sb = loadSandbox(file);
    sb.__b.a3 = state;
    const got = sb[fn]([undefined, undefined, undefined, undefined], args, []);
    const ok = got === expect;
    results.push([tag, ok, ok ? 'OK' : 'MISMATCH', got, expect]);
  } catch (e) {
    results.push([tag, false, 'THROW: ' + String(e && e.message || e).slice(0, 90), '', expect]);
  }
}

// 从 zh/qh 现场反解（不硬编码）—— 位图随环境/handenv 修复而变，
//   硬编码会在环境更新后假报失败。
function xdecode(ct, key, stateIn) {
  const out = [];
  let prev = stateIn;
  for (let i = 0; i < ct.length; i++) {
    out.push(String.fromCharCode((ct.charCodeAt(i) ^ key.charCodeAt(i % key.length) ^ prev) & 0xffff));
    prev = ct.charCodeAt(i);
  }
  return out.join('');
}
const payload16 = xdecode(zp[1], KEY.payload, zp[0].charCodeAt(zp[0].length - 1));
const inner8 = xdecode(zp[3], KEY.inner, zp[1].charCodeAt(zp[1].length - 1));
const cvm8 = xdecode(qp[0], KEY.cvm, zp[3].charCodeAt(zp[3].length - 1));
console.log('（现场反解）payload16=%s inner8=%s cvm8=%s', payload16, inner8, cvm8);

run('cvm   FR_877', 'cvm.final.js', 'FR_877', [cvm8, KEY.cvm],
    zp[3].charCodeAt(zp[3].length - 1), qp[0]);
run('inner FR_869', 'inner.final.js', 'FR_869', [inner8, KEY.inner],
    zp[1].charCodeAt(zp[1].length - 1), zp[3]);
run('payload FR_1832', 'payload.final.js', 'FR_1832', [payload16, KEY.payload],
    zp[0].charCodeAt(zp[0].length - 1), zp[1]);

let pass = 0;
for (const [tag, ok, msg, got, exp] of results) {
  console.log('%-16s %-8s %s', tag, ok ? 'PASS' : 'FAIL', msg);
  if (!ok) {
    console.log('    got   = %j', String(got).slice(0, 60));
    console.log('    expect= %j', String(exp).slice(0, 60));
  }
  if (ok) pass++;
}
console.log('\nfinal.js 链式 XOR 流功能验证: %d/%d 通过', pass, results.length);
process.exit(pass === results.length ? 0 : 1);
