import json, itertools

d = json.loads(open('.probe/live-wobjs.json', encoding='utf-8', errors='replace').read())
if isinstance(d, str):
    d = json.loads(d)
w = d['wobjs']

zh = w['__b']['zh']
qh = w['__c']['qh']
SEP = '\u200c'
SEP2 = '\u200e'

print('zh len', len(zh))
segs = zh.split(SEP)
print('zh split by U+200C -> %d parts' % len(segs))
for i, s in enumerate(segs):
    print('  [%d] len=%-5d %r' % (i, len(s), s if len(s) < 60 else s[:60] + '...'))

print()
print('qh = %r' % qh)
qs = qh.split(SEP2)
print('qh split by U+200E -> %d parts' % len(qs))
for i, s in enumerate(qs):
    print('  [%d] len=%-5d %r' % (i, len(s), s))

print()
print('__b.R =', [x if not isinstance(x, str) else ('STR(%d)' % len(x)) for x in w['__b']['R']['head']])
print('__c.G[9..13] =', [x if not isinstance(x, str) else repr(x[:60]) for x in w['__c']['G']['head'][9:14]])
print('__b.a3 final =', w['__b']['a3'], ' R[0] =', w['__b']['R']['head'][0])


def dec(ct, key, seed):
    """part_i = (out_i ^ out_{i-1}) ^ key_{i % nk}"""
    out = []
    prev = seed
    for i, ch in enumerate(ct):
        v = ord(ch)
        p = (v ^ prev) ^ ord(key[i % len(key)])
        out.append(p & 0xFF)
        prev = v
    return out


def enc(pt, key, seed):
    out = []
    prev = seed
    for i, p in enumerate(pt):
        v = ((p & 0xFF) ^ ord(key[i % len(key)]) ^ prev) & 0xFF
        out.append(v)
        prev = v
    return ''.join(chr(v) for v in out)


KEYS = {
    'inner(b53cc3fa93dc8013)': 'b53cc3fa93dc8013',
    'orch(44ae0b7a68bf0f7a)': '44ae0b7a68bf0f7a',
    'pay(acc7471d3eb9bc30)': 'acc7471d3eb9bc30',
    'pay(f25b8434cca9a1f5)': 'f25b8434cca9a1f5',
}
SEEDS = [41, 0, 113, 48, 256, 0x8000 & 0xff]

print()
print('===== 反解 zh 各段（所有 key/seed 组合，只打可打印结果）=====')
targets = [('zh[%d]' % i, s) for i, s in enumerate(segs) if s]
for tname, ct in targets:
    if len(ct) > 40:
        continue
    print('--- %s  ct=%r' % (tname, ct))
    for kn, k in KEYS.items():
        for sd in SEEDS:
            pt = dec(ct, k, sd)
            pr = ''.join(chr(c) if 32 <= c < 127 else '.' for c in pt)
            ok = sum(1 for c in pt if 32 <= c < 127)
            if ok == len(pt):
                print('    OK  %-24s seed=%-6s -> %r' % (kn, sd, pr))

print()
print('===== 反解 qh 各段 =====')
for i, ct in enumerate(qs):
    if not ct or len(ct) > 40:
        continue
    print('--- qh[%d] ct=%r' % (i, ct))
    for kn, k in KEYS.items():
        for sd in SEEDS:
            pt = dec(ct, k, sd)
            pr = ''.join(chr(c) if 32 <= c < 127 else '.' for c in pt)
            ok = sum(1 for c in pt if 32 <= c < 127)
            if ok == len(pt):
                print('    OK  %-24s seed=%-6s -> %r' % (kn, sd, pr))

print()
print('===== 正演验证：用 inner key/seed41 编码已知明文，比对 ct =====')
for tname, ct in targets:
    if len(ct) > 40:
        continue
    for kn, k in KEYS.items():
        for sd in SEEDS:
            pt = dec(ct, k, sd)
            if enc(pt, k, sd) == ct:
                pass
print('（正演恒等，仅确认 enc/dec 互逆）')
