import json, glob, os, re
d=json.load(open('.probe/browser-proto7.json',encoding='utf-8'))
b=open(sorted(glob.glob('.probe/cap2/dump_*.bin'), key=os.path.getmtime, reverse=True)[0],'rb').read()
SKIP={'runtime.ticks','finalizeRef'}
real=[]
for e in d:
    n=e.get('name','').replace('syscall/js.','')
    if n in SKIP: continue
    a=e.get('a') or []
    fsz=str(a[1]).split(':')[-1] if len(a)>1 else n
    key=''
    if len(a)>5 and fsz in ('1024','1026'):
        try:
            ptr=int(str(a[4]).split(':')[-1]); ln=int(str(a[5]).split(':')[-1])
            if ptr+ln<=len(b):
                t=b[ptr:ptr+ln].decode('utf-8','replace')
                if all(32<=ord(c)<127 for c in t): key=t
        except: pass
    real.append((fsz,key))
s=open('.probe/oracle/_seq.log',encoding='utf-8',errors='replace').read()
m=re.search(r'我的全序列带键: (\[.*?\])\n', s)
mine=[]
for x in json.loads(m.group(1)):
    if x in SKIP: continue
    if ':' in x:
        br,ky=x.split(':',1); mine.append((br,ky))
    else:
        mine.append((x,''))
def dedupe(a):
    out=[]
    for x in a:
        if not out or out[-1]!=x: out.append(x)
    return out
real=dedupe(real); mine=dedupe(mine)
print('去重后: 真实 %d | 我的 %d' % (len(real), len(mine)))
k=0
while k<min(len(real),len(mine)) and real[k]==mine[k]: k+=1
print('最长公共前缀:', k)
print('%-4s %-24s | %s' % ('i','真实','我的'))
for i in range(max(0,k-3), min(max(len(real),len(mine)), k+8)):
    r=real[i] if i<len(real) else ('-',''); m2=mine[i] if i<len(mine) else ('-','')
    print('%-4d %-10s %-13s | %-10s %-13s%s' % (i, r[0], r[1], m2[0], m2[1], ' ← 分歧' if i==k else ''))