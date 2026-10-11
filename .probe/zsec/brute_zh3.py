import json, re, os

d = json.loads(open('.probe/live-wobjs.json', encoding='utf-8', errors='replace').read())
if isinstance(d, str):
    d = json.loads(d)
w = d['wobjs']
segs = w['__b']['zh'].split('\u200c')
qs = w['__c']['qh'].split('\u200e')

# 收集候选密钥：所有 16-hex 常量
keys = set()
for f in ['zse_ck_inner.restored.js', 'zse_ck_orchestrator.restored.js', 'zse_ck_payload.restored.js',
          'zse_ck_cvm.restored.js', '.probe/eval-83-136041.js']:
    if not os.path.exists(f):
        continue
    s = open(f, encoding='utf-8', errors='replace').read()
    for m in re.finditer(r'"([0-9a-f]{16})"', s):
        keys.add(m.group(1))
    for m in re.finditer(r"'([0-9a-f]{16})'", s):
        keys.add(m.group(1))
keys = sorted(keys)
print('候选 16-hex 密钥 %d 个: %s' % (len(keys), keys[:20]))
HEX = re.compile(r'^[0-9a-fA-F]+$')
ALNUM = re.compile(r'^[0-9A-Za-z+/=_-]+$')


def dec_body(ct, key):
    out = []
    prev = ord(ct[0])
    for i in range(1, len(ct)):
        v = ord(ct[i])
        out.append(((v ^ prev) ^ ord(key[i % len(key)])) & 0xFF)
        prev = v
    return out


def search(ct, tag):
    print('--- %s ct(len=%d)=%r' % (tag, len(ct), ct))
    found = []
    for k in keys:
        body = dec_body(ct, k)
        for s0 in range(256):
            p0 = ((ord(ct[0]) ^ s0) ^ ord(k[0])) & 0xFF
            pt = bytes([p0] + body)
            if not all(32 <= b < 127 for b in pt):
                continue
            s = pt.decode('latin1')
            if HEX.match(s):
                found.append((2, k, s0, s))
            elif ALNUM.match(s):
                found.append((1, k, s0, s))
    found.sort(key=lambda x: -x[0])
    if not found:
        print('    （无 hex / alnum 解）')
    for score, k, s0, s in found[:8]:
        print('    %s key=%-18s seed=%-4d -> %r' % ('HEX' if score == 2 else 'ALN', k, s0, s))


for i, s in enumerate(segs):
    if s and len(s) <= 60:
        search(s, 'zh[%d]' % i)
for i, s in enumerate(qs):
    if s:
        search(s, 'qh[%d]' % i)
search(segs[0][4:], "zh[0] 去 .z(' 前缀")
