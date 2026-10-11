import re, struct, collections

blob = open('.probe/zsec/vmprog.bin', 'rb').read()
N = struct.unpack('>I', blob[0:4])[0]
W = blob[4:4 + N]
s = open('.probe/zsec/objdump.txt', encoding='utf-8').read()
elem = {int(m.group(1)): m.group(2) for m in re.finditer(r'elem\[(\d+)\] = ref\.func:\d+ <([^>]+)>', s)}

lines = open('.probe/wt/zse.decompiled.js', encoding='utf-8').read().split('\n')
funcs = [(i, l[9:l.index('(')]) for i, l in enumerate(lines) if l.startswith('function ')] + [(len(lines), '<end>')]
body = {}
for k in range(len(funcs) - 1):
    body[funcs[k][1]] = lines[funcs[k][0]:funcs[k + 1][0]]

def instr_len(txt):
    """解码器最终 pc 值 - 基准"""
    assigns = re.findall(r'M32\[(?:p0|\(p0)\s*\+\s*20\)?\]\s*=\s*([^;]+);', txt)
    if not assigns: return None
    last = assigns[-1].strip()
    # 情形 A: M32[p0+20] = (lX + k)
    m = re.match(r'\(?l\d+\s*\+\s*(\d+)\)?$', last)
    if m: return int(m.group(1))
    # 情形 B: M32[p0+20] = lX，找 lX = (lY + k)
    m2 = re.match(r'^l(\d+)$', last)
    if m2:
        loc = m2.group(1)
        # 若 lX = (M32[p0+20] + 1) → 在前一次赋值基础上再 +1
        if re.search(r'l%s = \(M32\[(?:p0|\(p0)\s*\+\s*20\)?\] \+ 1\)' % loc, txt):
            prev = assigns[-2].strip() if len(assigns) >= 2 else None
            mp = re.match(r'\(?l\d+\s*\+\s*(\d+)\)?$', prev or '')
            if mp: return int(mp.group(1)) + 1
            mp2 = re.match(r'^l(\d+)$', prev or '')
            if mp2:
                h = re.findall(r'l%s = \(l\d+ \+ (\d+)\)' % mp2.group(1), txt)
                if h: return int(h[-1]) + 1
        h = re.findall(r'l%s = \(l\d+ \+ (\d+)\)' % loc, txt)
        if h: return int(h[-1])
    return None

LEN, TAIL = {}, set()
for idx, fname in elem.items():
    sh = fname.split(')._')[-1]
    full = '__main__0oOoOO___' + sh
    if full not in body: continue
    txt = '\n'.join(body[full])
    L = instr_len(txt)
    if L: LEN[idx] = L
    if 'callIndirect()' in txt: TAIL.add(idx)
print('长度表: %d 项  %s' % (len(LEN), collections.Counter(LEN.values())))
print('尾调用型 opcode: %s' % sorted(TAIL))

def run(start, cap=100000):
    pc, n, seq = start, 0, []
    while pc < N and n < cap:
        op = W[pc]; L = LEN.get(op)
        if L is None: return seq, pc, ('NO-LEN op=%d' % op)
        seq.append((pc, op, L)); pc += L; n += 1
    return seq, pc, None

res = [(run(st)[0].__len__(), st) for st in range(0, 256)]
res.sort(reverse=True)
print('\n最佳起点:', res[:6])
seq, pc, err = run(0)
print('\nstart=0: %d 条, 结束 pc=%d/%d, %s' % (len(seq), pc, N, err or 'OK 走到底'))
print('  前 30 条:', ' '.join('op%d' % o for _, o, _ in seq[:30]))
