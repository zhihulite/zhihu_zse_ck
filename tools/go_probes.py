import json, re, collections

h = json.load(open('.probe/zsec/hostcalls.json', encoding='utf-8'))
srcs = []
for x in h:
    st = x.get('srcText')
    if st:
        srcs.append((x.get('n'), st))

print('=== 全部 srcText（Go 侧 eval 的 JS 片段） n=%d ===' % len(srcs))
seen = set()
for n, st in srcs:
    k = st.strip()
    if k in seen:
        continue
    seen.add(k)
    print('  #%s %s' % (n, st))

print('\n=== 去重后 %d 条 ===' % len(seen))
with open('.probe/zsec/go_probes.txt', 'w', encoding='utf-8') as f:
    for k in sorted(seen):
        f.write(k + '\n')
print('已写 .probe/zsec/go_probes.txt')
