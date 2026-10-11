import re, json
d=json.load(open('.probe/browser-proto7.json',encoding='utf-8'))
def nr(e):
    n=e.get('name','?').replace('syscall/js.','')
    a=e.get('a') or []
    return n + ('(' + str(a[1]).split(':')[-1] + ')' if n=='copyBytesToGo' and len(a)>1 else '')
SKIP={'runtime.ticks','finalizeRef'}
real=[x for x in map(nr,d) if x not in SKIP]
s=open('.probe/oracle/_full.log',encoding='utf-8',errors='replace').read()
m=re.search(r'宿主调用全序列: (\[.*?\])\n', s)
mine=[x for x in json.loads(m.group(1)) if x not in SKIP]
print('过滤后：真实 %d 条 | 我的 %d 条' % (len(real), len(mine)))
k=0
while k<min(len(real),len(mine)) and real[k]==mine[k]: k+=1
print('最长公共前缀:', k)
print('  真实 @%d-%d: %s' % (k, k+14, real[k:k+14]))
print('  我的 @%d-%d: %s' % (k, k+14, mine[k:k+14]))
print('  前 8（真实）:', real[:8])
print('  前 8（我的）:', mine[:8])