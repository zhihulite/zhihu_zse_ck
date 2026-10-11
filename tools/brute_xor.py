import os, re, itertools

zh = open('.probe/zsec/zh_full.txt', encoding='utf-8', errors='replace').read()
qh = open('.probe/zsec/qh_full.txt', encoding='utf-8', errors='replace').read()

KEYS = {
    'K_RND': 'acc7471d3eb9bc30',
    'K_PAY': 'f25b8434cca9a1f5',
    'K_INN': 'b53cc3fa93dc8013',
    'K_CVM1': '6a6cb1bb3970bae6',
    'K_CVM2': '44ae0b7a68bf0f7a',
}

def xstream(inp, key, state):
    out, st = [], state
    for i, ch in enumerate(inp):
        c = (ord(ch) ^ ord(key[i % len(key)]) ^ st) & 0xffff
        st = c
        out.append(chr(c))
    return ''.join(out), st

def is_hexish(s):
    return bool(s) and all(c in '0123456789abcdef' for c in s)

def brute(ct, label, want_len=None):
    hits = []
    for nm, k in KEYS.items():
        for a0 in range(0, 0x10000):
            dec, _ = xstream(ct, k, a0)
            if is_hexish(dec):
                hits.append((nm, a0, dec))
    print('\n=== %s (len=%d) 纯 hex 解 n=%d ===' % (label, len(ct), len(hits)))
    for nm, a0, dec in hits[:20]:
        print('   %-7s a0=U+%04X  %r' % (nm, a0, dec))
    if not hits:
        # 放宽：允许前 12 字符是 hex
        for nm, k in KEYS.items():
            for a0 in range(0, 0x10000):
                dec, _ = xstream(ct, k, a0)
                if all(c in '0123456789abcdef' for c in dec[:12]):
                    print('   [放宽12] %-7s a0=U+%04X  %r' % (nm, a0, dec))
                    break
    return hits

zp = zh.split('\u200c')
qp = qh.split('\u200e')
print('zh 段长度:', [len(p) for p in zp])
print('qh 段长度:', [len(p) for p in qp])

for i, p in enumerate(zp):
    if i == 2:
        continue
    if not p:
        continue
    brute(p, 'zh[%d]' % i)

for i, p in enumerate(qp):
    if not p:
        continue
    brute(p, 'qh[%d]' % i)
