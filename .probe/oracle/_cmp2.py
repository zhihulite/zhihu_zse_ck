import re, json
d=json.load(open('.probe/browser-proto7.json',encoding='utf-8'))
def nr(e):
    n=e.get('name','?').replace('syscall/js.','')
    a=e.get('a') or []
    return n + ('(' + str(a[1]).split(':')[-1] + ')' if n=='copyBytesToGo' and len(a)>1 else '')
real=[nr(e) for e in d]
s=open('.probe/oracle/_full.log',encoding='utf-8',errors='replace').read()
m=re.search(r'宿主调用全序列: (\[.*?\])\n', s)
mine=json.loads(m.group(1)) if m else []
print('真实 %d 条 | 我的 %d 条' % (len(real), len(mine)))
# 最长公共前缀
k=0
while k<min(len(real),len(mine)) and real[k]==mine[k]: k+=1
print('最长公共前缀:', k, '条')
print('  真实 @%d: %s' % (k, real[k:k+12]))
print('  我的 @%d: %s' % (k, mine[k:k+12]))
print('  真实 @%d 前 6: %s' % (max(0,k-6), real[max(0,k-6):k]))
print('  我的 @%d 前 6: %s' % (max(0,k-6), mine[max(0,k-6):k]))