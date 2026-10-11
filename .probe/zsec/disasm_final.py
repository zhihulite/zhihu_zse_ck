import re, struct, collections

blob = open('.probe/zsec/vmprog.bin', 'rb').read()
N = struct.unpack('>I', blob[0:4])[0]
W = blob[4:4 + N]
s = open('.probe/zsec/objdump.txt', encoding='utf-8').read()
elem = {int(m.group(1)): m.group(2) for m in re.finditer(r'elem\[(\d+)\] = ref\.func:\d+ <([^>]+)>', s)}

lines = open('.probe/wt/zse.decompiled.js', encoding='utf-8').read().split('\n')
funcs = [(i, l[9:l.index('(')]) for i, l in enumerate(lines) if l.startswith('function ')] + [(len(lines), '<end>')]
body = {funcs[k][1]: lines[funcs[k][0]:funcs[k + 1][0]] for k in range(len(funcs) - 1)}

ADD1 = ('_00oooO', '_OOo0o0')   # 入口 pc+=1 的子派发器

def base_adv(txt):
    a = re.findall(r'M32\[(?:p0|\(p0)\s*\+\s*20\)?\]\s*=\s*([^;]+);', txt)
    if not a: return None
    last = a[-1].strip()
    m = re.match(r'\(?l\d+\s*\+\s*(\d+)\)?$', last)
    if m: return int(m.group(1))
    m2 = re.match(r'^l(\d+)$', last)
    if m2:
        loc = m2.group(1)
        if re.search(r'l%s = \(M32\[(?:p0|\(p0)\s*\+\s*20\)?\] \+ 1\)' % loc, txt):
            prev = a[-2].strip() if len(a) >= 2 else None
            mp = re.match(r'\(?l\d+\s*\+\s*(\d+)\)?$', prev or '')
            if mp: return int(mp.group(1)) + 1
            mp2 = re.match(r'^l(\d+)$', prev or '')
            if mp2:
                h = re.findall(r'l%s = \(l\d+ \+ (\d+)\)' % mp2.group(1), txt)
                if h: return int(h[-1]) + 1
        h = re.findall(r'l%s = \(l\d+ \+ (\d+)\)' % loc, txt)
        if h: return int(h[-1])
    return None

LEN = {}
for idx, fname in elem.items():
    sh = fname.split(')._')[-1]
    full = '__main__0oOoOO___' + sh
    if full not in body: continue
    txt = '\n'.join(body[full])
    if sh == '_000oOO$bound':
        LEN[idx] = 1; continue
    b = base_adv(txt)
    if b is None: continue
    if any(('___%s(' % a) in txt for a in ADD1):
        b += 1
    LEN[idx] = b
print('长度表 %d 项  %s' % (len(LEN), collections.Counter(LEN.values())))

def run(start, cap=200000):
    pc, n, seq = start, 0, []
    while pc < N and n < cap:
        op = W[pc]; L = LEN.get(op)
        if L is None: return seq, pc, 'NO-LEN op=%d' % op
        seq.append((pc, op, L)); pc += L; n += 1
    return seq, pc, None

for st in (0, 1, 2, 3, 4):
    seq, pc, err = run(st)
    print('start=%d: %d 条, 结束 pc=%d/%d  %s' % (st, len(seq), pc, N, err or '走到底'))
    if len(seq) > 40:
        print('   前 40 条:', ' '.join('op%d' % o for _, o, _ in seq[:40]))
