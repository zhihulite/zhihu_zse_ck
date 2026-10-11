import re, struct, subprocess, collections, os

blob = open('.probe/zsec/vmprog.bin', 'rb').read()
N = struct.unpack('>I', blob[0:4])[0]
W = blob[4:4+N]

# 1) Elem 顺序：opcode -> 函数名
out = subprocess.run(['.probe/wt/node_modules/.bin/wasm-objdump', '-x', '.probe/wt/new.wasm'],
                     capture_output=True, text=True).stdout
elem = {}
for m in re.finditer(r'elem\[(\d+)\] = ref\.func:\d+ <([^>]+)>', out):
    elem[int(m.group(1))] = m.group(2)

# 2) 各 $bound 的 pc 推进量
lines = open('.probe/wt/zse.decompiled.js', encoding='utf-8').read().split('\n')
funcs = [(i, l[9:l.index('(')]) for i, l in enumerate(lines) if l.startswith('function ')]
funcs.append((len(lines), '<end>'))
adv = {}
for k in range(len(funcs)-1):
    a, nm = funcs[k]; b = funcs[k+1][0]
    if not nm.startswith('__main__0oOoOO___') or not nm.endswith('$bound'): continue
    body = lines[a:b]
    txt = '\n'.join(body)
    m = re.findall(r'M32\[(?:p0|\(p0)\s*\+\s*20\)?\]\s*=\s*([^;]+);', txt)
    if not m: continue
    x = m[-1].strip()
    n = None
    mm = re.match(r'\(?l(\d+)\s*\+\s*(\d+)\)?$', x)
    if mm: n = int(mm.group(2))
    else:
        mm2 = re.match(r'^l(\d+)$', x)
        if mm2:
            loc = mm2.group(1)
            hits = re.findall(r'l%s = \(l\d+ \+ (\d+)\)' % loc, txt)
            if hits: n = int(hits[-1])
    if n is not None:
        adv[nm.split('___')[1]] = n

lens = {}
for idx, fname in elem.items():
    short = fname.split(')._')[-1] if ')._ ' in fname else fname.split(')._')[-1]
    short = fname.split('._')[-1] if '._' in fname else fname
    for k2, v in adv.items():
        if k2.startswith(short):
            lens[idx] = v
print('长度表条目:', len(lens), '  值分布:', collections.Counter(lens.values()))

# 3) 变长反汇编
def disasm(start, limit=40):
    pc = start; out = []
    while pc < N and len(out) < limit:
        op = W[pc]
        L = lens.get(op)
        if L is None:
            out.append((pc, op, None, 'NO-LEN')); break
        out.append((pc, op, L, ' '.join('%02x' % W[pc+j] for j in range(min(L, 5)))))
        pc += L
    return out, pc

for start in (0, 1, 4):
    seq, endpc = disasm(start)
    ops = [o for _, o, _, _ in seq if o is not None]
    bad = [o for o in ops if o > 107]
    print()
    print('=== start=%d  结束 pc=%d/%d  前 20 条 ===' % (start, endpc, N))
    for pc, op, L, raw in seq[:20]:
        print('  pc=%-5d op=%-4d len=%-3s %s' % (pc, op, L, raw))
    print('  超范围 opcode:', bad[:10] if bad else '无')
