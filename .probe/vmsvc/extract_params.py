"""从每个 live dump 提取 5 个每会话参数: rk / MASK / IV / alphabet / XREG"""
import json, re, glob, os, importlib.util
from collections import defaultdict
spec=importlib.util.spec_from_file_location('zc','.probe/vmsvc/zse_cipher.py')
zc=importlib.util.module_from_spec(spec); spec.loader.exec_module(zc)
pot=json.load(open('.probe/vmsvc/sbox_global.json'))['pot']
def rotl(x,r): return ((x<<r)|(x>>(32-r)))&0xffffffff
def L(x): return x ^ rotl(x,2) ^ rotl(x,10) ^ rotl(x,18) ^ rotl(x,24)
def circ(V,s): return (((V>>s)|(V<<((32-s)%32)))&0xffffffff)&63
def parse(log):
    ent=[tuple(e) for e in log]
    runs=[]; i=0; n=len(ent)
    while i<n:
        if ent[i][0]==1:
            j=i
            while j<n and ent[j][0]==1: j+=1
            runs.append((i,j)); i=j
        else: i+=1
    rounds=[]; pro=[]; enc=[]
    for a,b in runs:
        v=[ent[k][3] for k in range(a,b)]
        if b-a==8 and v[4:]==[30,22,14,8]: rounds.append(v[:4])
        if b-a==16: pro.append(bytes(v))
        if b-a==3: enc.append([(ent[k][3],ent[k][5]) for k in range(a,b)])
    return rounds, pro, enc
def analyze(meta_path):
    j=json.load(open(meta_path,encoding='utf8'))
    mem_path=meta_path.replace('.meta.json','')
    mem=open(mem_path,'rb').read()
    rec=re.search(rb'[\x20-\x7e]{48}[0-9a-f]{32}z[0-9a-f]{12}', mem)
    tok=set(re.findall(rb'005_[A-Za-z0-9+/=]{128}', mem))
    if not rec or len(tok)!=1: return None
    rec=rec.group(); tok=list(tok)[0].decode()
    rounds, pro, enc = parse(j['log'])
    if len(rounds)!=192 or len(pro)!=6: return None
    X=[];A=[]
    for bi in range(6):
        Xa=[int.from_bytes(pro[bi][4*k:4*k+4],'big') for k in range(4)]
        Ab=[int.from_bytes(bytes(rounds[bi*32+r]),'big') for r in range(32)]
        for r in range(32): Xa.append(Xa[r]^L(Ab[r]))
        X.append(Xa); A.append(Ab)
    rk=[int.from_bytes(bytes(pot[b] for b in rounds[r]),'big')^X[0][r+1]^X[0][r+2]^X[0][r+3] for r in range(32)]
    pt=zc.record93_to_pt(rec)
    # MASK: solve from block chain
    masks=set()
    for b in range(5):
        c=zc.encrypt_block(pro[b], rk)
        # c == pro[b+1] ^ P[b+1] ^ MASK -> MASK bytes
        for x,y,z in zip(c, pro[b+1], pt[16*(b+1):16*(b+1)+16]): masks.add(x^y^z)
    MASK=list(masks)[0] if len(masks)==1 else None
    if MASK is None: return None
    IV=bytes(x^y^MASK for x,y in zip(pro[0], pt[:16]))
    ct=zc.encrypt_96(pt, rk, iv=IV, mask=MASK)
    payload=tok[4:]
    seq=ct[::-1]
    # solve XREG + alphabet
    best=None
    for XR in range(256):
        m={}; bad=0
        for g in range(32):
            base=(0,24,16,8)[g%4]; v=0
            for jj in range(3): v|=seq[g*3+jj]<<((base+8*jj)%32)
            v=(v&0xffffffff)^XR
            for k in range(4):
                idx=circ(v,(base+6*k)%32); ch=payload[g*4+k]
                if idx in m:
                    if m[idx]!=ch: bad+=1
                else: m[idx]=ch
        if best is None or bad<best[0]: best=(bad,XR,m)
    bad,XR,m=best
    alpha=''.join(m.get(i,'?') for i in range(64))
    return dict(rec93=rec.decode(), token=tok, mask=MASK, iv=IV.decode('latin1'),
                xreg=XR, conflicts=bad, alpha=alpha, rk=rk,
                pro0=pro[0].hex())
if __name__=='__main__':
    import sys
    files=sorted(glob.glob('.probe/cap2/dump_*.bin.meta.json'), key=os.path.getmtime)[-4:]
    out=[]
    for f in files:
        r=analyze(f)
        if not r: print('skip', f); continue
        out.append(r)
        print('--- %s'%os.path.basename(f))
        print('  record93 :', r['rec93'][:40], '...', r['rec93'][-14:])
        print('  MASK=%#x  IV=%r  XREG=%#x  conflicts=%d  alpha_filled=%d/64'%(
            r['mask'], r['iv'], r['xreg'], r['conflicts'], 64-r['alpha'].count('?')))
        print('  rk[0:4]  :', [hex(x) for x in r['rk'][:4]])
    json.dump(out, open('.probe/vmsvc/sessions.json','w'), indent=1)
    print('\nsaved .probe/vmsvc/sessions.json (%d sessions)'%len(out))