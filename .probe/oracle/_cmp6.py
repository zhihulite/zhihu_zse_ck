import json, glob, os, re
d=json.load(open('.probe/browser-proto7.json',encoding='utf-8'))
dumps=sorted(glob.glob('.probe/cap2/dump_*.bin'), key=os.path.getmtime, reverse=True)
b=open(dumps[0],'rb').read()
SKIP={'runtime.ticks','finalizeRef'}
real=[]
for e in d:
    n=e.get('name','').replace('syscall/js.','')
    if n in SKIP: continue
    a=e.get('a') or []
    fsz=str(a[1]).split(':')[-1] if len(a)>1 else ''
    key=''
    if fsz in ('1024','1026') and len(a)>5:
        try:
            ptr=int(str(a[4]).split(':')[-1]); ln=int(str(a[5]).split(':')[-1])
            if ptr+ln<=len(b):
                t=b[ptr:ptr+ln].decode('utf-8','replace')
                if all(32<=ord(c)<127 for c in t): key=t
        except: pass
    real.append((fsz,key))
def dedupe(a):
    out=[]
    for x in a:
        if not out or out[-1]!=x: out.append(x)
    return out
real=dedupe(real)
s=open('.probe/oracle/_first.log',encoding='utf-8',errors='replace').read()
m2=re.search(r'宿主调用全序列: (\[.*?\])\n', s)
raw=json.loads(m2.group(1))
mine=[]
for x in raw:
    n=x.split('(')[0]
    if n in ('runtime.ticks','finalizeRef'): continue
    fsz=re.search(r'\((\d+)\)', x)
    mine.append((fsz.group(1) if fsz else n, ''))
mine=dedupe(mine)
print('真实 %d | 我的 %d' % (len(real), len(mine)))
k=0
while k<min(len(real),len(mine)) and real[k][0]==mine[k][0]: k+=1
print('最长公共前缀(仅比分支号):', k)
print()
print('%-4s %-22s | %s' % ('i', '真实(分支/键)', '我的(分支)'))
for i in range(max(0,k-4), min(len(real), k+8)):
    r=real[i]; m=mine[i] if i<len(mine) else ('-','')
    mark=' ← 分歧' if i==k else ''
    print('%-4d %-10s %-11s | %-10s%s' % (i, r[0], r[1], m[0], mark))