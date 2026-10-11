#!/usr/bin/env python3
"""补全 .probe/vmsvc/wdriver_bp.py 缺失的 1-27 行。

wdriver_bp.py 由 .probe/vmsvc/wdriver_fuel.py 经 Bash 补丁派生；fuel 本身没进会话库，
但它与同目录的 wdriver_scan.py 同源（同一 docstring/import 段，num() 都在第 28 行）。
因此用 wdriver_scan.py 的 1-27 行补头（仅把 WASM 常量换成补丁里指定的值），
28 行以后用从 Read 记录还原的正文。
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCAN = os.path.join(ROOT, '.probe', 'vmsvc', 'wdriver_scan.py')
BP = os.path.join(ROOT, '.probe', 'vmsvc', 'wdriver_bp.py')


def main():
    scan = open(SCAN, encoding='utf8').read().split('\n')
    header = scan[:27]           # 1..27 行，末行是 `def num(s):`
    assert header[-1].startswith('def num'), header[-1]
    header = [l.replace('WASM = ".probe/build-859e.wasm"', 'WASM = ".probe/vmsvc/wasm_bp.wasm"') for l in header]

    bp = open(BP, encoding='utf8').read().split('\n')
    idx = next(i for i, l in enumerate(bp) if l.lstrip().startswith('return int(s.split'))
    body = bp[idx:]              # 从 num() 的函数体开始

    out = header + body
    text = '\n'.join(out)
    tmp = BP + '.tmp'
    open(tmp, 'w', encoding='utf8', newline='\n').write(text)
    os.replace(tmp, BP)
    print('已补全 %s（%d 行）' % (os.path.relpath(BP, ROOT), len(out)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
