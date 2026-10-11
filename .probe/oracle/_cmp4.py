import re, json
d=json.load(open('.probe/browser-proto7.json',encoding='utf-8'))
def nr(e):
    n=e.get('name','?').replace('syscall/js.','')
    a=e.get('a') or []
    return n + ('(' + str(a[1]).split(':')[-1] + ')' if n=='copyBytesToGo' and len(a)>1 else '')
SKIP={'runtime.ticks','finalizeRef'}
real=[x for x in map(nr,d) if x not in SKIP]
s=open('.probe/oracle/_first.log',encoding='utf-8',errors='replace').read()
m=re.search(r'宿主调用全序列: (\[.*?\])\n', s)
mine=[x for x in json.loads(m.group(1)) if x not in SKIP]
# 去重加倍：把连续相同项压成一个
def dedupe(a):
    out=[]
    for x in a:
        if not out or out[-1]!=x: out.append(x)
    return out
rd, md = dedupe(real), dedupe(mine)
print('原始: 真实 %d | 我的 %d' % (len(real), len(mine)))
print('压缩相邻重复后: 真实 %d | 我的 %d' % (len(rd), len(md)))
k=0
while k<min(len(rd),len(md)) and rd[k]==md[k]: k+=1
print('压缩后最长公共前缀:', k)
print('  真实 @%d: %s' % (k, rd[k:k+12]))
print('  我的 @%d: %s' % (k, md[k:k+12]))
print('  真实前 12:', rd[:12])
print('  我的前 12:', md[:12])