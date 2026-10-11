import json, re, collections

raw = json.load(open('.probe/browser-proto7.json', encoding='utf-8'))
print('总条目', len(raw))
c = collections.Counter(e['name'] for e in raw)
print('按名字:', dict(c))
print()

print('=== valueNew 条目（17 个）===')
n = 0
for e in raw:
    if e['name'] != 'valueNew':
        continue
    n += 1
    print('  #%-2d args=%s' % (n, str(e.get('a'))[:110]))
    post = e.get('post') or []
    for r in post:
        if r[1] == 16 and r[2]:
            import base64
            b = base64.b64decode(r[2])
            print('        post @%d len=%d bytes=%s' % (r[0], r[1], b.hex()))
    print('        ret=%r dst=%r' % (e.get('ret'), e.get('dst')))
print()

print('=== valueLength / valueIndex（少量）===')
for e in raw:
    if e['name'] in ('valueLength', 'valueIndex'):
        print('  %-12s a=%s ret=%r' % (e['name'], str(e.get('a'))[:90], e.get('ret')))
