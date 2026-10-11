# 从 service.lifted.js 抽出 copyBytesToGo 的 7 个分支体
import re
s = open('.probe/lift/service.lifted.js', encoding='utf-8').read()
L = s.split('\n')

# 找每个 marker 比较点：t\d+ = "<marker>";  紧邻 t\d+ = (t\d+ === t\d+);
marks = ['1022', '1024', '1026', '1028', '1030', '1032', '1034']
pos = []
for i, l in enumerate(L):
    m = re.match(r'\s*t\d+ = "(\d{4})";\s*$', l)
    if m and m.group(1) in marks:
        pos.append((i, m.group(1)))

print('marker 位置:', pos)
print()
for k, (i, mk) in enumerate(pos):
    end = pos[k + 1][0] if k + 1 < len(pos) else min(len(L), i + 400)
    body = L[i:end]
    # 去掉 TRACE 噪音行
    body = [x for x in body if 'typeof TRACE' not in x]
    print('=' * 24, 'marker', mk, '(L%d..L%d, %d 行)' % (i, end, len(body)))
    print('\n'.join(body[:70]))
    print()
