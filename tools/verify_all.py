#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""verify_all.py —— 一键跑完全部验收门，逐项打印 PASS/FAIL

用法：  python tools/verify_all.py            # 全部
        python tools/verify_all.py --fast     # 跳过耗时的语义对拍
"""
import argparse
import os
import subprocess
import sys

ROOT = os.environ.get('ZSE_ROOT') or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)

PY = sys.executable
NODE = 'node'

# (名称, 命令, 通过判据：输出里必须出现的子串)
GATES = [
    ('纯算全链路（静态推 5 常量 → 位图 → 指纹 → crc → record93 → ck）',
     [PY, P('py', 'pure_calc_verify.py')], '纯算全链路自证：PASS'),
    ('伪代码 JS 可运行（链式 XOR 流 3 帧对拍真机 zh/qh）',
     [NODE, P('tools', 'verify_final_layers.js')], '3/3 通过'),
    ('位图汇编/反解自检',
     [PY, P('py', 'bitmap.py'), '--selftest'], 'SELFTEST PASS'),
    ('makecode 取指层静态自检（10565 词逐字节）',
     [PY, P('py', 'pure_profile.py'), '--static'], '10565/10565 逐字节相同'),
    ('常量池解码（101 条全可读）',
     [PY, P('py', 'govm_makecode.py'), '--pool', '--out', P('out')], '101 条可打印'),
    ('六层还原件功能验证',
     [NODE, P('.probe', 'zsec', 'verify_layers_func.js')], '6/6 通过'),
    ('四层 VM 程序逐块差分',
     None, '0 fail'),   # 展开成 4 条，见下
]
BT = ['bt_cvm', 'bt_inner', 'bt_payload', 'bt_service']
SLOW = [('Go VM 语义派发层对拍真机轨迹',
         [PY, P('py', 'govm_semantics.py'), '--verify'], '1.000000')]


def run(name, cmd, want):
    print('· %s' % name)
    try:
        r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=1800)
    except Exception as e:
        print('  FAIL  (%s)' % e)
        return False
    out = (r.stdout or '') + (r.stderr or '')
    ok = (want in out) and r.returncode == 0
    print('  %s  %s' % ('PASS' if ok else 'FAIL', want))
    if not ok:
        print('\n'.join('    ' + l for l in out.strip().splitlines()[-12:]))
    return ok


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--fast', action='store_true', help='跳过 Go VM 语义对拍（最慢）')
    a = ap.parse_args()

    results = []
    for name, cmd, want in GATES:
        if cmd is None:
            for bt in BT:
                results.append(run('逐块差分 %s' % bt,
                                   [NODE, P('.probe', 'lift', '%s.js' % bt)], '0 fail'))
            continue
        results.append(run(name, cmd, want))
    if not a.fast:
        dop = P('.probe', 'tmp', 'mine_dop.txt')
        n = sum(1 for _ in open(dop, encoding='utf8', errors='replace')) if os.path.exists(dop) else 0
        if n < 1000:
            # 语义门的输入轨迹是**生成物**（`PROBE=1` 跑纯 JS VM 落盘），不在版本控制里。
            # 缺了就现跑一次，别让门因为「忘了生成」而红。
            print('· 语义门轨迹缺失（%d 行）→ 现跑 PROBE=1 node py/govm_pure_vm.js 生成' % n)
            try:
                subprocess.run([NODE, P('py', 'govm_pure_vm.js')], cwd=ROOT, timeout=1800,
                               env=dict(os.environ, PROBE='1'),
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            except Exception as e:
                print('  生成失败：%s' % e)
            n = sum(1 for _ in open(dop, encoding='utf8', errors='replace')) if os.path.exists(dop) else 0
            print('  → 轨迹 %d 行' % n)
        for name, cmd, want in SLOW:
            results.append(run(name, cmd, want))
    n, tot = sum(1 for x in results if x), len(results)
    print('\n合计 %d/%d 通过' % (n, tot))
    return 0 if n == tot else 1


if __name__ == '__main__':
    raise SystemExit(main())
