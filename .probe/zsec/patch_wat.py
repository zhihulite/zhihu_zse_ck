import re, subprocess, os

WAT = '.probe/wt/new.wat'
OUT = '.probe/wt/instr.wat'
WASM = '.probe/wt/instr.wasm'

s = open('.probe/zsec/objdump.txt', encoding='utf-8').read()
elem = {}
for m in re.finditer(r'elem\[(\d+)\] = ref\.func:\d+ <([^>]+)>', s):
    elem[int(m.group(1))] = m.group(2)

def watname(go):
    return '$' + go.replace('(', '_').replace(')', '_')

wat = open(WAT, encoding='utf-8').read()
# 校验这些名字确实存在
missing = [g for g in elem.values() if ('(func %s ' % watname(g)) not in wat]
print('elem 条目 %d, WAT 中缺失 %d' % (len(elem), len(missing)))
for g in missing[:6]: print('   missing:', g)

lines = ['  (export "d_%d" (func %s))' % (k, watname(g)) for k, g in sorted(elem.items())
         if ('(func %s ' % watname(g)) in wat]
patch = '\n'.join(lines)
wat2 = wat.replace('(module\n', '(module\n' + patch + '\n', 1)
open(OUT, 'w', encoding='utf-8').write(wat2)
print('写了', OUT, '  新增导出', len(lines))

r = subprocess.run(['.probe/wt/node_modules/.bin/wat2wasm', OUT, '-o', WASM],
                   capture_output=True, text=True)
print('wat2wasm rc =', r.returncode)
if r.stdout: print(r.stdout[:500])
if r.stderr: print(r.stderr[:800])
if os.path.exists(WASM):
    print('生成', WASM, os.path.getsize(WASM), 'bytes')
