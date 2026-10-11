import json, glob, os, re
# 真实：从 dump 回读每个 1024/1026 的键名
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
            if ptr+ln<=len(b): key=b[ptr:ptr+ln].decode('utf-8','replace')
        except: pass
    real.append((fsz,key))
# 压缩相邻重复
def dedupe(a):
    out=[]
    for x in a:
        if not out or out[-1]!=x: out.append(x)
    return out
real=dedupe(real)
# 我的
s=open('.probe/oracle/_first.log',encoding='utf-8',errors='replace').read()
m=re.search(r'我的前 20 次 valueGet: (\[.*?\])', s)
m2=re.search(r'宿主调用全序列: (\[.*?\])\n', s)
mine=json.loads(m2.group(1))
print('真实（去重）前 22:')
for i,(f,k) in enumerate(real[:22]): print('   %2d %-18s %s' % (i, f, k))
print()
print('我的前 22:')
for i,x in enumerate(mine[:22]): print('   %2d %s' % (i, x))