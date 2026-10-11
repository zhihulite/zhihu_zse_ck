// fp_real.js —— 「一次真实浏览器会话整组采下」的环境值
//
// 字段来源：
//   · glVendor / glRenderer / canvasDataURL / 字体集合 / 插件名 —— **真值**，
//     直接取自捕获的指纹入参 `.probe/zsec/_md5in.json`（40 段）。
//   · screen / glParams / glVersion / glSL / 字体度量表 —— **重建值**：
//     原始捕获文件已丢失，这里按「必须让环境检测结果与真值一致」构造，
//     并以「跑出来的 48-hex 位图与真机一致」作为验收判据（见 tools/verify_all.py）。
//
// 用法：handenv.js 里 `const FP = require('./fp_real.js')`。
'use strict';

module.exports = {
  // ---- 真值（来自捕获的指纹入参）----
  hardwareConcurrency: "8",
  glVendor: "Google Inc. (NVIDIA)",
  glRenderer: "ANGLE (NVIDIA, NVIDIA GeForce GTX 980 Direct3D11 vs_5_0 ps_5_0), or similar",
  canvasDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAACAUlEQVR4Xu3WMQ0AAAzDsJU/6eGIZCPoFXUHELHITgDBAjo8LCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyBAvIECwgQ7CADMECMgQLyBAsIEOwgAzBAjIEC8gQLCBDsIAMwQIyHlYxAJczebf5AAAAEGRlQkc2QUZCQjc2MEE5MEFFMjVG1c8vPwAAAABJRU5ErkJggg==",
  fonts: ["Arial", "Arial Black", "Arial Narrow", "Calibri", "Cambria Math", "Comic Sans MS", "Consolas", "Courier", "Courier New", "Georgia", "Helvetica", "Lucida Console", "Lucida Sans Unicode", "Microsoft Sans Serif", "MS PGothic", "MS Sans Serif", "MS Serif", "Palatino Linotype", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Tahoma", "Times", "Times New Roman", "Trebuchet MS", "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"],
  plugins: ["PDF Viewer", "Chrome PDF Viewer", "Chromium PDF Viewer", "Microsoft Edge PDF Viewer", "WebKit built-in PDF"],

  // ---- 重建值 ----
  glVersion: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
  glSL: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
  glParams: {
    7936: 'WebKit',        // VENDOR
    7937: 'WebKit WebGL',  // RENDERER
    7938: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
    35724: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
    3379: 16384,           // MAX_TEXTURE_SIZE
    34930: 16,             // MAX_TEXTURE_IMAGE_UNITS
    35660: 16,             // MAX_VERTEX_TEXTURE_IMAGE_UNITS
    34076: 16384,          // MAX_CUBE_MAP_TEXTURE_SIZE
    34024: 16384,          // MAX_RENDERBUFFER_SIZE
    3386: [16384, 16384],  // MAX_VIEWPORT_DIMS
    3413: 8,               // MAX_TEXTURE_MAX_ANISOTROPY_EXT（若有）
  },
  screen: { w: 1920, h: 1080, aw: 1920, ah: 1040 },

  // 字体度量：31 个候选全部「与基准不同」⇒ 全部被检出（与真机一致）
  baseMetrics: {"monospace": [100, 20], "sans-serif": [110, 20], "serif": [105, 20]},
  fontMetricFlat: {"Arial": [200, 30], "Arial Black": [200, 30], "Arial Narrow": [200, 30], "Calibri": [200, 30], "Cambria Math": [200, 30], "Comic Sans MS": [200, 30], "Consolas": [200, 30], "Courier": [200, 30], "Courier New": [200, 30], "Georgia": [200, 30], "Helvetica": [200, 30], "Lucida Console": [200, 30], "Lucida Sans Unicode": [200, 30], "Microsoft Sans Serif": [200, 30], "MS PGothic": [200, 30], "MS Sans Serif": [200, 30], "MS Serif": [200, 30], "Palatino Linotype": [200, 30], "Segoe Print": [200, 30], "Segoe Script": [200, 30], "Segoe UI": [200, 30], "Segoe UI Light": [200, 30], "Segoe UI Semibold": [200, 30], "Tahoma": [200, 30], "Times": [200, 30], "Times New Roman": [200, 30], "Trebuchet MS": [200, 30], "Verdana": [200, 30], "Wingdings": [200, 30], "Wingdings 2": [200, 30], "Wingdings 3": [200, 30]},
  fontMetrics: {},
};
