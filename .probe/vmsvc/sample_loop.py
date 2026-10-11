"""多轮采样：改 HTML blob 制造不同明文 -> 跑 harness -> 累积 S 盒约束图"""
import json, base64, subprocess, os, sys, struct, re
from collections import defaultdict
BASE='.probe/browser-proto7.json'
def patch_capture(k):
    raw=json.load(open(BASE,encoding='utf8'))
    n=0
    for e in raw:
        for r in (e.get('post') or []):
            if not r[2]: continue
            b=base64.b64decode(r[2])
            if len(b)==14319 and b.startswith(b'<div>'):
                # replace a mid chunk with deterministic variation, same length
                L=len(b)
                a=3000+k*1500
                chunk=b[a:a+1500]
                new=bytes((0x41+((c+k*7)%26)) for c in range(len(chunk)))
                b=b[:a]+new+b[a+len(chunk):]
                r[2]=base64.b64encode(b).decode(); n+=1
    out='.probe/cap_var%d.json'%k
    json.dump(raw, open(out,'w',encoding='utf8'))
    return out, n
def rotl(x,r): return ((x<<r)|(x>>(32-r)))&0xffffffff
def L(x): return x ^ rotl(x,2) ^ rotl(x,10) ^ rotl(x,18) ^ rotl(x,24)
parent=list(range(256)); pot=[0]*256
def find(x):
    if parent[x]==x: return x,0
    r,p=find(parent[x]); parent[x]=r; pot[x]^=p; return parent[x],pot[x]
conf=0; edges=0
def ingest(trace):
    global conf, edges
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
                        if (pa^pb)!=(u^u2): conf+=1
                    else: parent[rb]=ra; pot[rb]=pa^pb^(u^u2)
    return True
def coverage():
    comp=defaultdict(list)
    for v in range(256): comp[find(v)[0]].append(v)
    big=max(comp.values(), key=len)
    return len(big), len(comp)
env=dict(os.environ)
for k in range(1, int(sys.argv[1])+1):
    cap,n=patch_capture(k)
    env['ZSE_CAPTURE']=cap; env['ZSE_OUT']='_v%d'%k
    r=subprocess.run([sys.executable,'.probe/vmsvc/wdriver_bp.py'],capture_output=True,text=True,env=env,timeout=900)
    tr='.probe/vmsvc/op_trace_v%d.bin'%k
    mem='.probe/vmsvc/final_memory_v%d.bin'%k
    rec93=None
    if os.path.exists(mem):
        m=re.search(rb'[\x20-\x7e]{48}[0-9a-f]{32}z[0-9a-f]{12}', open(mem,'rb').read())
        rec93=m.group() if m else None
    ok=ingest(tr) if os.path.exists(tr) else None
    cov,comps=coverage()
    print('variant %d: blobs=%d trace=%s rec93_tail=%s coverage=%d/256 components=%d conflicts=%d'%(
        k,n,ok, rec93[-14:] if rec93 else None, cov, comps, conf), flush=True)
    if cov>=256: print('FULL COVERAGE'); break
json.dump({'pot':pot,'components':{str(find(v)[0]):[x for x in range(256) if find(x)[0]==find(v)[0]] for v in range(256)}},
          open('.probe/vmsvc/sbox_partial_full.json','w'))
print('saved sbox_partial_full.json  edges=%d conflicts=%d'%(edges,conf))