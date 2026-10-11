import json, itertools

d = json.loads(open('.probe/live-wobjs.json', encoding='utf-8', errors='replace').read())
if isinstance(d, str):
    d = json.loads(d)
w = d['wobjs']
zh = w['__b']['zh']
qh = w['__c']['qh']
SEP = '\u200c'
SEP2 = '\u200e'

segs = zh.split(SEP)
qs = qh.split(SEP2)

KEYS = {
    'inner:b53cc3fa93dc8013': 'b53cc3fa93dc8013',
    'orch:44ae0b7a68bf0f7a': '44ae0b7a68bf0f7a',
    'pay1:acc7471d3eb9bc30': 'acc7471d3eb9bc30',
    'pay2:f25b8434cca9a1f5': 'f25b8434cca9a1f5',
    'zh1:9c1a5f2b7e3d8064': '9c1a5f2b7e3d8064',
}


def dec_body(ct, key):
    """种子只影响 part[0]；part[1:] 与种子无关"""
    out = []
    prev = ord(ct[0])
    for i in range(1, len(ct)):
        v = ord(ct[i])
        out.append(((v ^ prev) ^ ord(key[i % len(key)])) & 0xFF)
        prev = v
    return out


def printable(b):
    return 32 <= b < 127


def try_all(ct, tag):
    print('--- %s  ct(len=%d)=%r' % (tag, len(ct), ct if len(ct) <= 50 else ct[:50] + '...'))
    if len(ct) < 2:
        return
    best = []
    for kn, k in KEYS.items():
        body = dec_body(ct, k)
        okb = sum(1 for b in body if printable(b))
        # 穷举 part[0]
        for s0 in range(256):
            p0 = ((ord(ct[0]) ^ s0) ^ ord(k[0])) & 0xFF
            if not printable(p0):
                continue
            pt = bytes([p0] + body)
            score = sum(1 for b in pt if printable(b))
            if score == len(pt):
                best.append((kn, s0, pt.decode('latin1')))
    if not best:
        # 放宽：允许少量不可打印
        for kn, k in KEYS.items():
            body = dec_body(ct, k)
            for s0 in range(256):
                p0 = ((ord(ct[0]) ^ s0) ^ ord(k[0])) & 0xFF
                pt = bytes([p0] + body)
                score = sum(1 for b in pt if printable(b))
                if score >= len(pt) - 1:
                    best.append((kn, s0, pt.decode('latin1')))
    if not best:
        print('    （无全可打印解）')
    seen = set()
    for kn, s0, s in best[:12]:
        if s in seen:
            continue
        seen.add(s)
        print('    seed=%-4d %-24s -> %r' % (s0, kn, s))


print('=== zh 各段 ===')
for i, s in enumerate(segs):
    if not s:
        continue
    if len(s) > 60:
        print('--- zh[%d] 太长(%d)，跳过（base64 调用栈，已知明文）' % (i, len(s)))
        continue
    try_all(s, 'zh[%d]' % i)

print()
print('=== qh 各段 ===')
for i, s in enumerate(qs):
    if not s:
        continue
    try_all(s, 'qh[%d]' % i)

print()
print('=== 附加：把 zh[0] 去掉前 4 字符 .z(\' 再解 ===')
try_all(segs[0][4:], "zh[0][4:]")
