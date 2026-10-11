"""跨运行+跨块 全局约束图 -> 完整 S 盒 (S^-1(v)=pot[v]^C, 任意 C 等价)"""
import struct, json, glob, os
from collections import defaultdict
def rotl(x,r): return ((x<<r)|(x>>(32-r)))&0xffffffff
def L(x): return x ^ rotl(x,2) ^ rotl(x,10) ^ rotl(x,18) ^ rotl(x,24)
def load(trace):
    d=open(trace,'rb').read(); n=len(d)//32
    rec=[struct.unpack_from('<IIIIIIII',d,i*32) for i in range(n)]
    runs=[]; i=0
    while i<n:
        if rec[i][0]==1:
            j=i
            while j<n and rec[j][0]==1: j+=1
            runs.append((i,j)); i=j
        else: i+=1
    rounds=[]; prologues=[]
    for a,b in runs:
        v=[rec[k][4] for k in range(a,b)]
        if b-a==8 and v[4:]==[30,22,14,8]: rounds.append(v[:4])
        if b-a==16: prologues.append(v)
    if len(rounds)!=192 or len(prologues)!=6: return None
    X=[];A=[]
    for bi in range(6):
        Xa=[int.from_bytes(bytes(prologues[bi][4*k:4*k+4]),'big') for k in range(4)]
        Ab=[int.from_bytes(bytes(rounds[bi*32+r]),'big') for r in range(32)]
        for r in range(32): Xa.append(Xa[r]^L(Ab[r]))
        X.append(Xa); A.append(Ab)
    return X,A
files=sorted(glob.glob('.probe/vmsvc/op_run1.bin')+glob.glob('.probe/vmsvc/op_trace_ua3.bin')+
             glob.glob('.probe/vmsvc/op_trace_v*.bin'))
print('traces:', files)
# samples[(i,j)] = list of (a, u)
samples=defaultdict(list)
for f in files:
    r=load(f)
    if not r: print('  skip', f); continue
    X,A=r
    for bi in range(6):
        for i in range(32):
            for j in range(4):
                a=(A[bi][i]>>(24-8*j))&0xff
                u=((X[bi][i+1]^X[bi][i+2]^X[bi][i+3])>>(24-8*j))&0xff
                samples[(i,j)].append((a,u))
parent=list(range(256)); pot=[0]*256
def find(x):
    if parent[x]==x: return x,0
    r,p=find(parent[x]); parent[x]=r; pot[x]^=p; return parent[x],pot[x]
conf=0; edges=0
for key,lst in samples.items():
    base=lst[0]
    for (a,u) in lst[1:]:
        delta=base[1]^u
        ra,pa=find(base[0]); rb,pb=find(a)
        if ra==rb:
            if (pa^pb)!=delta: conf+=1
        else: parent[rb]=ra; pot[rb]=pa^pb^delta
        edges+=1
comp=defaultdict(list)
for v in range(256): comp[find(v)[0]].append(v)
sizes=sorted((len(v) for v in comp.values()), reverse=True)
print('edges=%d conflicts=%d components=%d sizes=%s'%(edges,conf,len(comp),sizes[:6]))
big=max(comp.values(), key=len)
print('coverage: %d/256'%len(big))
if len(big)==256:
    # S^-1 table up to global XOR C
    inv={v:pot[v] for v in range(256)}
    json.dump({'pot':pot,'coverage':len(big),'note':'S^-1(v)=pot[v]^C; 任意 C 等价'},
              open('.probe/vmsvc/sbox_full.json','w'))
    print('FULL S-box recovered -> sbox_full.json')
else:
    missing=sorted(v for v in range(256) if len(comp[find(v)[0]])==1)
    print('unlinked outputs:', missing)
    json.dump({'pot':pot,'components':{str(k):v for k,v in comp.items()}}, open('.probe/vmsvc/sbox_partial_full.json','w'))