import collections,base64,re
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
            if s<64 and x&0x40: r|=-(1<<s)
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
blob=at(0x1189C,181388)
print('blob len',len(blob))
cs=collections.Counter(blob)
print('distinct',len(cs))
print('chars:',''.join(chr(c) for c in sorted(cs)))
print('counts sorted:',sorted(((chr(c),n) for c,n in cs.items()), key=lambda t:-t[1])[:12])
# candidate alphabet from py/zseck.py
AW=b'rBPa7xz6ReFTKuVHLE=IS0sJ5jwf2YCAGqXdWhQvy/OM3nk9cotp1DmZbUN4lg8i'
print('AW len',len(AW),'AW set==blob set?', set(AW)==set(cs))
# search data for 64-char strings that are permutations covering blob set
S=set(cs)
for o,b in datas:
    for m in re.finditer(rb'[A-Za-z0-9+/=]{64}',b):
        cand=m.group()
        if set(cand)==S:
            print('ALPHABET FOUND at 0x%06X: %r'%(o+m.start(),cand))
# also check if blob set is 64 and includes '='
print("has '=' in set:", ord('=') in cs)