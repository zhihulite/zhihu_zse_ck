import struct, json, glob, os, re
from collections import defaultdict
def rotl(x,r): return ((x<<r)|(x>>(32-r)))&0xffffffff
def L(x): return x ^ rotl(x,2) ^ rotl(x,10) ^ rotl(x,18) ^ rotl(x,24)
def rounds_from(entries):
    """entries: list of (op, sp, t1, v1, t2, v2)"""
    runs=[]; i=0; n=len(entries)
    while i<n:
        if entries[i][0]==1:
            j=i
            while j<n and entries[j][0]==1: j+=1
            runs.append((i,j)); i=j
        else: i+=1
    rounds=[]; prologues=[]
    for a,b in runs:
        v=[entries[k][3] for k in range(a,b)]   # v1 = stack top
        if b-a==8 and v[4:]==[30,22,14,8]: rounds.append(v[:4])
        if b-a==16: prologues.append(v)
    return rounds, prologues
def load_harness(trace):
    d=open(trace,'rb').read(); n=len(d)//32
    ent=[]
    for i in range(n):
        op,sp,pr,t1,v1,t2,v2,pad=struct.unpack_from('<IIIIIIII',d,i*32)
        ent.append((op,sp,t1,v1,t2,v2))
    return rounds_from(ent)
def load_live(meta):
    j=json.load(open(meta,encoding='utf8'))
    ent=[tuple(e) for e in j['log']]
    return rounds_from(ent)
def blocks_XA(rounds, prologues):
    X=[];A=[]
    for bi in range(6):
        Xa=[int.from_bytes(bytes(prologues[bi][4*k:4*k+4]),'big') for k in range(4)]
        Ab=[int.from_bytes(bytes(rounds[bi*32+r]),'big') for r in range(32)]
        for r in range(32): Xa.append(Xa[r]^L(Ab[r]))
        X.append(Xa); A.append(Ab)
    return X,A
parent=list(range(256)); pot=[0]*256
def find(x):
    if parent[x]==x: return x,0
    r,p=find(parent[x]); parent[x]=r; pot[x]^=p; return parent[x],pot[x]
conf=0; edges=0
def ingest(rounds, prologues, tag):
    global conf, edges
    if len(rounds)!=192 or len(prologues)!=6:
        print('  %-22s SKIP (rounds=%d prologues=%d)'%(tag,len(rounds),len(prologues))); return
    X,A=blocks_XA(rounds,prologues)
    local=0
    for r in range(32):
        for j in range(4):
            for bi in range(6):
                a=(A[bi][r]>>(24-8*j))&0xff
                u=((X[bi][r+1]^X[bi][r+2]^X[bi][r+3])>>(24-8*j))&0xff
                for bk in range(bi+1,6):
                    a2=(A[bk][r]>>(24-8*j))&0xff
                    u2=((X[bk][r+1]^X[bk][r+2]^X[bk][r+3])>>(24-8*j))&0xff
                    edges+=1
                    ra,pa=find(a); rb,pb=find(a2)
                    if ra==rb:
                        if (pa^pb)!=(u^u2): conf+=1; local+=1
                    else: parent[rb]=ra; pot[rb]=pa^pb^(u^u2)
    comp=defaultdict(list)
    for v in range(256): comp[find(v)[0]].append(v)
    print('  %-22s rounds=%d  conflicts_so_far=%d  components=%d  big=%d'%(
        tag,len(rounds),conf,len(comp),max(len(v) for v in comp.values())))
r,p = load_harness('.probe/vmsvc/op_run1.bin'); ingest(r,p,'harness(proto7)')
# live session
meta='.probe/cap2/dump_1791198678168.bin.meta.json'
r2,p2 = load_live(meta); ingest(r2,p2,'LIVE session')
print()
print('TOTAL edges=%d conflicts=%d'%(edges,conf))
print('=> S 盒全局?' , 'NO (per-session)' if conf>0 else 'YES (global, only key varies)')
# save live session params
if len(r2)==192 and len(p2)==6:
    X2,A2=blocks_XA(r2,p2)
    json.dump({'prologues':[list(x) for x in p2],'A':[[list(a) for a in A] for A in [A2]]},
              open('.probe/vmsvc/live_session.json','w'))
    print('live prologue[0]:', bytes(p2[0]).hex())