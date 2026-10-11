import json, base64, re, collections

raw = json.load(open('.probe/browser-proto7.json', encoding='utf-8'))
steps, i = [], 0
while i < len(raw):
    e = raw[i]; j = i + 1
    while j < len(raw) and raw[j]['name'] == e['name'] and raw[j].get('a') == e.get('a'):
        j += 1
    steps.append(e); i = j
print('去重后步数', len(steps))

def num(s):
    return int(s.split(':', 1)[1]) if isinstance(s, str) and s.startswith('number:') else None

print()
print('=== copyBytesToGo 中 post 含 1 字节载荷的步 ===')
k = 0
for e in steps:
    if e['name'] != 'copyBytesToGo':
        continue
    k += 1
    post = e.get('post') or []
    for r in post:
        if r[1] == 1 and r[2]:
            b = base64.b64decode(r[2])
            ch = b.decode('latin1')
            if ch in ('y', 'n'):
                ca = [num(x) for x in e['a']]
                print('  copy#%-3d  @%-8s  值=%r   args(dstLen,l2,l3)=%s' % (k, r[0], ch, (ca[5], ca[8], ca[11])))
print()
print('=== 所有 post 载荷长度分布 ===')
c = collections.Counter()
for e in steps:
    for r in (e.get('post') or []):
        if r[2]:
            c[r[1]] += 1
print(' ', c.most_common(12))
