import json, glob, os, re

rows = []

# 1) env_samples.json（6 个带 trace 的会话）
p = '.probe/vmsvc/env_samples.json'
if os.path.exists(p):
    for s in json.load(open(p, encoding='utf8')):
        rows.append((s.get('file', '?'), s['rec93']))

# 2) cap2/all.json（更早一轮，含 record）
p = '.probe/cap2/all.json'
if os.path.exists(p):
    for x in json.load(open(p, encoding='utf8')):
        if x.get('record'):
            rows.append((x['file'], x['record']))

print('样本数', len(rows))
print()
print('%-30s %-48s %-32s %s' % ('file', '[0:48)', '[48:80)', '[80:93)'))
for f, r in rows:
    print('%-30s %-48s %-32s %s' % (os.path.basename(f)[:30], r[0:48], r[48:80], r[80:93]))

print()
print('=== [0:48) 逐字节列（24 字节）===')
print('%-30s %s' % ('file', ' '.join('%02d' % i for i in range(24))))
for f, r in rows:
    b = [r[i*2:i*2+2] for i in range(24)]
    print('%-30s %s' % (os.path.basename(f)[:30], ' '.join(b)))

print()
print('=== [0:48) 里哪些字节跨样本恒定 ===')
import collections
cols = collections.defaultdict(set)
for f, r in rows:
    for i in range(24):
        cols[i].add(r[i*2:i*2+2])
for i in range(24):
    mark = 'CONST' if len(cols[i]) == 1 else ('var(%d)' % len(cols[i]))
    print('  byte %2d  %s  %s' % (i, sorted(cols[i])[:6], mark))
