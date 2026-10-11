import json, re

d = json.loads(open('.probe/live-wobjs.json', encoding='utf-8', errors='replace').read())
if isinstance(d, str):
    d = json.loads(d)
w = d['wobjs']
zh = w['__b']['zh']
qh = w['__c']['qh']
segs = zh.split('\u200c')
qs = qh.split('\u200e')
KEY = 'b53cc3fa93dc8013'


def dec_body(ct, key):
    out = []
    prev = ord(ct[0])
    for i in range(1, len(ct)):
        v = ord(ct[i])
        out.append(((v ^ prev) ^ ord(key[i % len(key)])) & 0xFF)
        prev = v
    return out


HEX = re.compile(r'^[0-9a-fA-F]+$')


def show(ct, tag):
    body = dec_body(ct, KEY)
    print('--- %s ct(len=%d)=%r' % (tag, len(ct), ct))
    hits = []
    for s0 in range(256):
        p0 = ((ord(ct[0]) ^ s0) ^ ord(KEY[0])) & 0xFF
        pt = bytes([p0] + body)
        try:
            s = pt.decode('latin1')
        except Exception:
            continue
        if all(32 <= b < 127 for b in pt):
            hits.append((s0, s))
    hexhits = [(s0, s) for s0, s in hits if HEX.match(s)]
    print('   全可打印解 %d 个；其中纯 hex %d 个' % (len(hits), len(hexhits)))
    for s0, s in hexhits[:10]:
        print('      seed=%-4d -> %r' % (s0, s))
    if not hexhits:
        for s0, s in hits[:6]:
            print('      seed=%-4d -> %r' % (s0, s))


print('=== 已知明文对照 ===')
print('  __b.R =', [x if not isinstance(x, str) else repr(x) for x in w['__b']['R']['head']])
print('  __c.G[9..13] =', [repr(x) if isinstance(x, str) else x for x in w['__c']['G']['head'][9:14]])
print()

for i, s in enumerate(segs):
    if not s:
        continue
    if len(s) > 60:
        print('--- zh[%d] 太长(%d) 跳过' % (i, len(s)))
        continue
    show(s, 'zh[%d]' % i)

print()
for i, s in enumerate(qs):
    if s:
        show(s, 'qh[%d]' % i)

print()
show(segs[0][4:], "zh[0] 去前缀 .z('")

print()
print('=== 用 R[5]=80008000 与 zh[3] 反推 seed 并校验 ===')
ct = segs[3]
pt = '80008000'
prev = None
seed = None
for i, ch in enumerate(ct):
    if i == 0:
        seed = ord(ch) ^ ord(KEY[0]) ^ ord(pt[0])
    else:
        got = (ord(ch) ^ ord(ct[i - 1]) ^ ord(KEY[i % len(KEY)])) & 0xFF
        assert got == ord(pt[i]), (i, got, ord(pt[i]))
print('  seed =', seed, ' 校验通过（8/8 字符）')
