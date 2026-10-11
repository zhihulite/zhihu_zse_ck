#!/usr/bin/env python3
"""把交付包内 code/tools/wdriver_glue_disp.js 的路径改成包内布局。

原驱动在 .probe/zsec/ 下运行，路径都是 `.probe/...`；放进 DELIVERY/code/tools/ 后
必须改指包内（code/env、evidence、out）。同时把可用的 blob 拷进 evidence/blobs/。
"""
import os, sys, io, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'DELIVERY')
DRV = os.path.join(D, 'code/tools/wdriver_glue_disp.js')

REPS = [
    ("require('./handenv.js')", "require('../env/handenv.js')"),
    ("'.probe/zsec/blobs/eval_11841_service.js'", "P('evidence','blobs','eval_11841_service.js')"),
    ("'.probe/zsec/blobs/eval_136041.js'", "P('evidence','blobs','eval_136041.js')"),
    ("'.probe/zsec/blobs/prog_41892.bin'", "P('evidence','blobs','prog_41892.bin')"),
    ("'.probe/wt/bp_disp2.wasm'", "P('evidence','build-859e.wasm')"),
    ("'.probe/zsec/disp2.txt'", "P('out','disp2.txt')"),
]

HEADER = """'use strict';
const _path = require('path');
const ROOT = process.env.ZSE_ROOT || _path.resolve(__dirname, '..', '..');
const P = (...a) => _path.join(ROOT, ...a);
"""


def main():
    t = io.open(DRV, encoding='utf8').read()
    for a, b in REPS:
        t = t.replace(a, b)
    # 注入 ROOT/P 定义（若尚未有）
    if 'const P = (...a) =>' not in t:
        t = t.replace("'use strict';\n", HEADER, 1)
    io.open(DRV, 'w', encoding='utf8', newline='\n').write(t)
    print('已改写 %s' % os.path.relpath(DRV, ROOT))

    # 拷贝可用 blob
    for src, rel in [('evidence/blobs/eval_11841_service.js', 'evidence/blobs/eval_11841_service.js')]:
        s = os.path.join(ROOT, src)
        if os.path.exists(s):
            d = os.path.join(D, rel)
            os.makedirs(os.path.dirname(d), exist_ok=True)
            shutil.copyfile(s, d)
            print('已拷 %s' % rel)
    return 0


if __name__ == '__main__':
    sys.exit(main())
