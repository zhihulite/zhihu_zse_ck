// ============================================================================
// 知乎 __zse_ck 指纹算法 —— 运行时实测还原版
//
// 证据来源（不是反推，是运行时抓的真值）：
//   驱动在 md5 入口注入探针，抓到**送进 md5 的完整入参串**，存为
//   `.probe/zsec/_md5in.json`（1 条，len=1388 字符 / 1388 UTF-8 字节）。
//   验算：md5(utf8(入参)) == be544511d8accf5879de9179e434e829
//         == 真机 record93 的 32-hex 指纹字段 —— 逐字命中。
//
// 入参格式：40 个字段用 '|' 连接
//   [0]      navigator.hardwareConcurrency（真机 8）
//   [1]      WebGL UNMASKED_VENDOR_WEBGL
//   [2]      WebGL UNMASKED_RENDERER_WEBGL
//   [3]      canvas.toDataURL()（822 字符）
//   [4..34]  探测到的字体名（按探测列表顺序，31 条）
//   [35..39] 插件名（5 条）
//
// ============================================================================

'use strict';

// ---------- 1. 指纹采集（顺序 = 入参字段顺序，实测）----------
function collect() {
  const fields = [];

  // [0] 硬件并发数（取不到时 -1）
  try { fields.push(window.navigator.hardwareConcurrency || -1); } catch (_) { fields.push(-1); }

  // [1][2] WebGL 指纹（UNMASKED_* 扩展；取不到则空串）
  try {
    const cv = document.createElement('canvas');
    const gl = cv.getContext('webgl') || cv.getContext('experimental-webgl');
    const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
    const p = (name) => {
      try { return gl.getParameter(ext ? ext[name] : gl[name]) || ''; } catch (_) { return ''; }
    };
    fields.push(p('UNMASKED_VENDOR_WEBGL'));
    fields.push(p('UNMASKED_RENDERER_WEBGL'));
  } catch (_) { fields.push('', ''); }

  // [3] Canvas 2D 指纹（toDataURL；失败则空串）
  try {
    const cv = document.createElement('canvas');
    cv.width = 300; cv.height = 150;
    const ctx = cv.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Cwm fjordbank glyphs vext quiz', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.font = '18px Arial';
    ctx.fillText('Cwm fjordbank glyphs vext quiz', 4, 45);
    fields.push(cv.toDataURL());
  } catch (_) { fields.push(''); }

  // [4..] 字体探测（offsetWidth/offsetHeight 偏移法）
  //   列表与顺序取自实测入参；命中才 push
  try {
    const base = ['monospace', 'sans-serif', 'serif'];
    const FONTS = [
      'Arial', 'Arial Black', 'Arial Narrow', 'Calibri', 'Cambria Math', 'Comic Sans MS',
      'Consolas', 'Courier', 'Courier New', 'Georgia', 'Helvetica', 'Lucida Console',
      'Lucida Sans Unicode', 'Microsoft Sans Serif', 'MS PGothic', 'MS Sans Serif', 'MS Serif',
      'Palatino Linotype', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Light',
      'Segoe UI Semibold', 'Tahoma', 'Times', 'Times New Roman', 'Trebuchet MS', 'Verdana',
      'Wingdings', 'Wingdings 2', 'Wingdings 3',
    ];
    const test = 'mmmmmmmmmmlli';
    const body = document.getElementsByTagName('body')[0];
    const span = document.createElement('span');
    span.style.fontSize = '72px';
    span.innerHTML = test;
    const defW = {}, defH = {};
    for (const b of base) {
      span.style.fontFamily = b;
      body.appendChild(span);
      defW[b] = span.offsetWidth; defH[b] = span.offsetHeight;
      body.removeChild(span);
    }
    for (const f of FONTS) {
      let hit = false;
      for (const b of base) {
        span.style.fontFamily = f + ',' + b;
        body.appendChild(span);
        hit = hit || span.offsetWidth !== defW[b] || span.offsetHeight !== defH[b];
        body.removeChild(span);
      }
      if (hit) fields.push(f);
    }
  } catch (_) {}

  // [..39] 插件名
  try {
    const pl = navigator.plugins;
    if (pl) for (let i = 0; i < pl.length; i++) { if (pl[i]) fields.push(pl[i].name); }
  } catch (_) {}

  return fields;
}

// ---------- 2. md5（blueimp 风格；str2utf8 = unescape(encodeURIComponent(s))）----------
//   入口链（原始混淆名）：
//     _0x2221e2(s) = binl2hex(_0x408d39(str2binl(_0x578fac(s)), 8 * len))
//     _0x578fac    = unescape(encodeURIComponent(s))
//     _0x465e9c    = str2binl   _0x408d39 = md5_core   _0x478ca7 = binl2hex
//   等价于标准 MD5 over UTF-8 字节。这里用 node:crypto 做等价实现，
//   逐字搬运的 4 轮函数见 js/fingerprint.deobfuscated.js。
function md5hex(s) {
  return require('crypto').createHash('md5').update(Buffer.from(s, 'utf8')).digest('hex');
}

// ---------- 3. 主流程 ----------
function fingerprint() {
  return md5hex(collect().join('|'));
}

module.exports = { collect, md5hex, fingerprint };

// ---------- 4. 实测真值（自检用）----------
//   入参 len=1388，md5 = be544511d8accf5879de9179e434e829
//   前 4 段：8 | Google Inc. (NVIDIA) | ANGLE (NVIDIA, NVIDIA GeForce GTX 980 Direct3D11 vs_5_0 ps_5_0), or similar | data:image/png;base64,iVBORw0KGgo...
//   末 5 段：PDF Viewer | Chrome PDF Viewer | Chromium PDF Viewer | Microsoft Edge PDF Viewer | WebKit built-in PDF
