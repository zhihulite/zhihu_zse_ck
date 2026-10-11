#!/usr/bin/env python3
"""给 wasm 插桩：在 _O0O00o 入口加一个 call $__probe(p0,p1,p2,p3)，用于抓类型分派的实参。"""
import subprocess, sys, os, re

WASM = sys.argv[1] if len(sys.argv) > 1 else '.probe/build-859e.wasm'
WAT = '.probe/zsec/probe.wat'
OUT = '.probe/zsec/probe.wasm'
BIN = '.probe/wt/node_modules/.bin/'

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode != 0:
        print('CMD FAIL:', cmd); print(r.stdout[:500]); print(r.stderr[:800]); sys.exit(1)
    return r.stdout

print('wasm2wat...')
run(f'"{BIN}wasm2wat" {WASM} -o {WAT}')
wat = open(WAT, encoding='utf-8').read()
print('wat 行数', wat.count('\n'))

# 1) 找函数定义
m = re.search(r'^(\s*)\(func \$_?\*?main\._0oOoOO_\._O0O00o \(type (\d+)\)', wat, re.M)
if not m:
    print('未找到 _O0O00o 定义'); sys.exit(1)
tname = m.group(2)
print('函数定义 type =', tname)

# 2) 加 import（放在最后一个 env import 之后）
imp_anchor = re.search(r'^\s*\(import "env" "[^"]+" \(func [^\n]*\n', wat, re.M)
last = None
for mm in re.finditer(r'^\s*\(import "[^"]+" "[^"]+" \(func [^\n]*\n', wat, re.M):
    last = mm
assert last, '未找到 import'
inject_imp = f'  (import "env" "__probe" (func $__probe (type {tname})))\n'
wat = wat[:last.end()] + inject_imp + wat[last.end():]

# 3) 在函数体第一行插入 call（必须跳过 (local ...) 声明行，WAT 要求 locals 在前）
m2 = re.search(r'^(\s*)\(func \$_?\*?main\._0oOoOO_\._O0O00o \(type \d+\)[^\n]*\n', wat, re.M)
indent = m2.group(1) + '  '
pos = m2.end()
# 跳过后续的 (local ...) 行
while True:
    lm = re.match(r'[ \t]*\(local [^\n]*\n', wat[pos:])
    if not lm:
        break
    pos += lm.end()
call = (indent + '(call $__probe (local.get 0) (local.get 1) (local.get 2) (local.get 3))\n')
wat = wat[:pos] + call + wat[pos:]

open(WAT, 'w', encoding='utf-8').write(wat)
print('已插桩 ->', WAT)

print('wat2wasm...')
run(f'"{BIN}wat2wasm" {WAT} -o {OUT}')
print('产物:', OUT, os.path.getsize(OUT), 'bytes')
