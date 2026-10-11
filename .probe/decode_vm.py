import json
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
ALPHA=b'rBPa7xz6ReFTKuVHLE=IS0sJ5jwf2YCAGqXdWhQvy/OM3nk9cotp1DmZbUN4lg8i'
assert len(ALPHA)==64
blob=at(0x1189C,181388)
idx={c:i for i,c in enumerate(ALPHA)}
vals=[idx[c] for c in blob]
out=bytearray()
for k in range(0,len(vals),4):
    a,b,c,e=vals[k:k+4]
    n=(a<<18)|(b<<12)|(c<<6)|e
    out+=bytes([(n>>16)&255,(n>>8)&255,n&255])
out=bytes(out)
print('decoded len',len(out))
open('.probe/vmprog_custom.bin','wb').write(out)
print('head64:',out[:64].hex())
print('head ascii:',repr(out[:64]))
import collections
print('first 32 u32 LE:',[hex(int.from_bytes(out[j:j+4],'little')) for j in range(0,128,4)])
print('byte hist top:',collections.Counter(out).most_common(6))