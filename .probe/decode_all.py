import collections,math,base64
d=open('.probe/zse-ck.wasm','rb').read()
def uleb(b,i):
    r=0;s=0
    while True:
        x=b[i];i+=1;r|=(x&0x7f)<<s;s+=7
        if not x&0x80:break
    return r,i
def sleb(b,i):
    r=0;s=0
    while True:
        x=b[i];i+=1;r|=(x&0x7f)<<s;s+=7
        if not x&0x80:
            if s<64 and x&0x40:r|=-(1<<s)
            break
    return r,i
i=8;datas=[]
while i<len(d):
    sid=d[i];i+=1;sz,i=uleb(d,i);body=d[i:i+sz];i+=sz
    if sid==11:
        p=0;n,p=uleb(body,p)
        for _ in range(n):
            fl,p=uleb(body,p)
            if fl==0:
                p+=1;off,p=sleb(body,p);p+=1;ln,p=uleb(body,p);datas.append((off,body[p:p+ln]));p+=ln
            elif fl==2:
                p+=1;off,p=sleb(body,p);p+=1;ln,p=uleb(body,p);datas.append((off,body[p:p+ln]));p+=ln
            elif fl==1:
                ln,p=uleb(body,p);datas.append((None,body[p:p+ln]));p+=ln
        break
datas=[x for x in datas if x[0] is not None];datas.sort()
def at(a,ln):
    for o,b in datas:
        if o<=a<o+len(b):return b[a-o:a-o+ln]
def ent(x):
    if not x:return 0
    c=collections.Counter(x);n=len(x)
    return -sum((v/n)*math.log2(v/n) for v in c.values())
ALPHA=b'rBPa7xz6ReFTKuVHLE=IS0sJ5jwf2YCAGqXdWhQvy/OM3nk9cotp1DmZbUN4lg8i'
def cdec(s):
    idx={c:i for i,c in enumerate(ALPHA)}
    v=[idx[c] for c in s if c in idx]
    out=bytearray()
    for k in range(0,len(v)-3,4):
        a,b,c,e=v[k:k+4];n=(a<<18)|(b<<12)|(c<<6)|e
        out+=bytes([(n>>16)&255,(n>>8)&255,n&255])
    return bytes(out)
for name,a,l in [('BIG',0x1189C,181388),('MID',0x3DD40,41893),('LOADER',0x4812D,17384)]:
    s=at(a,l)
    cd=cdec(s)
    print(f'{name} @0x{a:X} len={l} chars={len(s)} cdec_len={len(cd)} ent={ent(cd):.3f}')
    # ascii runs in cdec
    runs=[];i=0
    while i<len(cd):
        if 32<=cd[i]<127:
            j=i
            while j<len(cd) and 32<=cd[j]<127:j+=1
            if j-i>=6:runs.append((i,j-i,cd[i:i+50]))
            i=j
        else:i+=1
    print('   runs>=6:',len(runs),'first:',runs[:4])
    print('   tail:',repr(cd[-40:]))