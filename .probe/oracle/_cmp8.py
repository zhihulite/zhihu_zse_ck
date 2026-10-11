import json, re
s=open('.probe/oracle/_seq.log',encoding='utf-8',errors='replace').read()
m=re.search(r'我的全序列带键: (\[.*?\])\n', s)
mine=json.loads(m.group(1))
i=[k for k,x in enumerate(mine) if x.startswith('1022')]
print('我的序列里 1022 的位置:', i)
for k in i:
    print('  上下文:', mine[max(0,k-8):k+6])
d=json.load(open('.probe/browser-proto7.json',encoding='utf-8'))
SKIP={'runtime.ticks','finalizeRef'}
real=[]
for e in d:
    n=e.get('name','').replace('syscall/js.','')
    if n in SKIP: continue
    a=e.get('a') or []
    real.append(str(a[1]).split(':')[-1] if len(a)>1 else n)
def dedupe(a):
    out=[]
    for x in a:
        if not out or out[-1]!=x: out.append(x)
    return out
rd=dedupe(real)
print()
print('真实序列里 1022 的位置:', [k for k,x in enumerate(rd) if x=='1022'])
print('真实序列前 30:', rd[:30])
print()
print('我的序列前 30:', mine[:30])