// js/bitmap_detection.restored.js —— 位图检测逻辑还原件（AST 静态提取，非穷举）
//
// 生成：node tools/bitmap_ast.js .probe/lift/<层>.lifted.js --json ...  →  python tools/gen_detection_js.py
// 每个 `vN` 是该层的一个 16 位累加字，初值见 DETECT_INIT；每个 `bit k` 由一条守卫命中后置位。
// 字→位图位置映射见 docs/BITMAP.md（w1-w4←payload、w5-w6←inner、w10-w11←cvm）。
"use strict";

const DETECT_INIT = {
  "payload": {
    "v3": "1<<13 (0x2000)",
    "v4": "1<<12 (0x1000)",
    "v5": "1<<15 (0x8000)",
    "v6": "1<<14 (0x4000)"
  },
  "inner": {
    "v3": "1<<15 (0x8000)",
    "v4": "1<<14 (0x4000)"
  },
  "cvm": {
    "v7": "1<<15 (0x8000)",
    "v8": "1<<14 (0x4000)",
    "v9": "1<<13 (0x2000, 位掩码常量)",
    "v10": "1<<12 (0x1000, 位掩码常量)"
  }
};

const DETECT = {};

// ==========================================================================
// 各层汇编器（把 4/2/2 个累加字拼成 hex 串）
// ==========================================================================

module.exports = { DETECT, DETECT_INIT };
