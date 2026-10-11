import re, sys

WASM = '.probe/zsec/blobs/wasm_b64.bin'
DEC = '.probe/wt/zse.decompiled.js'
BASE = 0x39d8          # file offset = mem_addr + 0x39d8
SEG_ADDR = 0x10121

d = open(WASM, 'rb').read()
lines = open(DEC, encoding='utf-8').read().split('\n')

# 找目标函数边界
start = None
for i, l in enumerate(lines):
    if l.startswith('function __main__0oOoOO___00oooO('):
        start = i; break
end = None
for i in range(start + 1, len(lines)):
    if lines[i].startswith('function '):
        end = i; break
print('function lines %d..%d (%d lines)' % (start + 1, end, end - start))

def mem(a, n):
    if a < SEG_ADDR or a > SEG_ADDR + 247060:
        return None
    o = BASE + (a - SEG_ADDR)
    return d[o:o + n]

def show(a, n=32):
    b = mem(a, n)
    if b is None: return '<not in seg1>'
    return repr(b)

# 收集形如 f(a, NUM, ...) 或含 5~7 位十进制常量的调用
pat = re.compile(r'([A-Za-z_$][\w$]*)\(([^()]*)\)')
rows = []
for i in range(start, end):
    l = lines[i].strip()
    for m in pat.finditer(l):
        fn, args = m.group(1), m.group(2)
        nums = re.findall(r'\b(\d{4,7})\b', args)
        if nums:
            rows.append((i + 1, fn, args[:150]))

print('含 4~7 位常量的调用: %d 处' % len(rows))
seen = set()
for ln, fn, args in rows:
    key = (fn, args)
    if key in seen: continue
    seen.add(key)
    nums = re.findall(r'\b(\d{4,7})\b', args)
    desc = []
    for n in nums:
        v = int(n)
        b = mem(v, 24)
        if b:
            desc.append('%d->%r' % (v, b))
        else:
            desc.append('%d->heap' % v)
    print('  L%-6d %s(%s)' % (ln, fn, args[:110]))
    for x in desc:
        print('            %s' % x)
