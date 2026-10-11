#!/usr/bin/env python3
"""重新装配 DELIVERY/ 交付包（依据 DELIVERY/MANIFEST.md 的清单）。

按 MANIFEST 清单从工作区源文件装配，并做两处必要改写：
  * code/env/handenv.js —— native addon 的 require 路径改成优先「包内布局」
    `./native/zseenv.node`，退回工作区构建产物。
  * code/tools/wdriver_glue_disp.js —— 证据路径改指包内 evidence/out。

清单里没有源文件的条目（真机捕获 json / bin）会跳过并打印。
"""
import os, shutil, sys, io

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'DELIVERY')

# (源, 交付内相对路径)
COPY = [
    # --- code/js ---
    ('js/payload.final.js', 'code/js/payload.final.js'),
    ('js/inner.final.js', 'code/js/inner.final.js'),
    ('js/cvm.final.js', 'code/js/cvm.final.js'),
    ('js/service.final.js', 'code/js/service.final.js'),
    ('js/bitmap_assembler.js', 'code/js/bitmap_assembler.js'),
    ('js/bitmap_detection.restored.js', 'code/js/bitmap_detection.restored.js'),
    ('js/govm_detection.restored.js', 'code/js/govm_detection.restored.js'),
    ('js/govm.interp.restored.js', 'code/js/govm.interp.restored.js'),
    ('js/fingerprint.restored.js', 'code/js/fingerprint.restored.js'),
    ('js/env_checks.md', 'code/js/env_checks.md'),
    ('js/bitmap_guards.md', 'code/js/bitmap_guards.md'),
    # --- code/env ---
    ('.probe/zsec/handenv.js', 'code/env/handenv.js'),
    ('.probe/zsec/fp_real.js', 'code/env/fp_real.js'),
    ('.probe/zsec/livefetch.js', 'code/env/livefetch.js'),
    ('native/zseenv/build/Release/zseenv.node', 'code/env/native/zseenv.node'),
    ('native/zseenv/src/zseenv.cc', 'code/env/native/zseenv.cc'),
    ('native/zseenv/binding.gyp', 'code/env/native/binding.gyp'),
    # --- code/tools ---
    ('.probe/zsec/wdriver_glue_disp.js', 'code/tools/wdriver_glue_disp.js'),
    ('py/wasm_patch_raw.py', 'code/tools/wasm_patch_raw.py'),
    ('py/wasm_patch_at.py', 'code/tools/wasm_patch_at.py'),
    ('tools/restore_ast.js', 'code/tools/restore_ast.js'),
    ('tools/beautify_restored.js', 'code/tools/beautify_restored.js'),
    ('tools/ast_frames.js', 'code/tools/ast_frames.js'),
    ('tools/bitmap_ast.js', 'code/tools/bitmap_ast.js'),
    ('.probe/lift.py', 'code/tools/lift.py'),
    ('.probe/structure.py', 'code/tools/structure.py'),
    ('.probe/lift/blocktest.py', 'code/tools/blocktest.py'),
    ('.probe/zsec/parse_microcode.py', 'code/tools/parse_microcode.py'),
    ('py/zse_cipher.py', 'code/tools/zse_cipher.py'),
    ('py/govm_pure_vm.js', 'code/tools/govm_pure_vm.js'),
    ('py/verify_rk_e2e.py', 'code/tools/verify_rk_e2e.py'),
    ('py/extract_rk.py', 'code/tools/extract_rk.py'),
    ('.probe/watdecomp.py', 'code/tools/watdecomp.py'),
    # --- evidence ---
    ('.probe/build-859e.wasm', 'evidence/build-859e.wasm'),
    ('.probe/zsec/_md5in.json', 'evidence/fingerprint_preimage.json'),
    ('.probe/zsec/src_VM.js', 'evidence/src_VM.js'),
    ('.probe/zsec/src_BVM.js', 'evidence/src_BVM.js'),
    ('.probe/zsec/src_CVM.js', 'evidence/src_CVM.js'),
    ('.probe/zsec/_datasegs.json', 'evidence/_datasegs.json'),
    ('.probe/zsec/_table.json', 'evidence/_table.json'),
    ('.probe/wt/zse.decompiled.js', 'evidence/zse.decompiled.js'),
    ('.probe/zsec/real_zh.bin', 'evidence/real_zh.bin'),
    ('profiles/_live_fixture.json', 'out/_live_fixture.json'),
    # --- 文档（以 docs/ 为准，避免交付包里留过时副本）---
    ('docs/PITFALLS.md', 'PITFALLS.md'),
    ('docs/RESTORATION.md', 'RESTORATION.md'),
    ('docs/FINGERPRINT.md', 'docs/FINGERPRINT.md'),
]


def main():
    os.makedirs(D, exist_ok=True)
    # 清掉上次留下的 __pycache__（跑过包内脚本会生成）
    for dp, dn, fn in os.walk(D):
        for d in list(dn):
            if d == '__pycache__':
                shutil.rmtree(os.path.join(dp, d), ignore_errors=True)
    done, miss = [], []
    for src, rel in COPY:
        s = os.path.join(ROOT, src)
        if not os.path.exists(s):
            miss.append((src, rel))
            continue
        dst = os.path.join(D, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(s, dst)
        done.append(rel)

    # handenv：addon require 路径改为包内优先
    hp = os.path.join(D, 'code/env/handenv.js')
    if os.path.exists(hp):
        t = io.open(hp, encoding='utf8').read()
        old = "try { ZSE_NATIVE = require('../../native/zseenv/build/Release/zseenv.node'); } catch (e) { ZSE_NATIVE = null; }"
        new = ("// native addon：优先交付包布局（code/env/native/zseenv.node），退回工作区构建产物\n"
               "try { ZSE_NATIVE = require('./native/zseenv.node'); }\n"
               "catch (e) { try { ZSE_NATIVE = require('../../native/zseenv/build/Release/zseenv.node'); } catch (e2) { ZSE_NATIVE = null; } }")
        if old in t:
            io.open(hp, 'w', encoding='utf8', newline='').write(t.replace(old, new))
            print('已改写 code/env/handenv.js 的 addon 路径')

    print('拷入 %d 个文件；缺源 %d 个：' % (len(done), len(miss)))
    for src, rel in miss:
        print('  缺 %-45s (清单要求 %s)' % (src, rel))
    return 0


if __name__ == '__main__':
    sys.exit(main())
