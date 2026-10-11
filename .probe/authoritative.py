d=open('.probe/zse-ck.wasm','rb').read()
def uleb(b,i):
    r=0;s=0
    while True:
        x=b[i];i+=1;r|=(x&0x7f)<<s;s+=7
        if not x&0x80: break
    return r,i
def sleb(b,i):
    r=0;s=0
    while True:
        x=b[i];i+=1;r|=(x&0x7f)<<s;s+=7
        if not x&0x80:
            if s<64 and x&0x40: r|=-(1<<s)
            break
    return r,i
i=8; datas=[]
while i<len(d):
    sid=d[i];i+=1
    sz,i=uleb(d,i); body=d[i:i+sz]; i+=sz
    if sid==11:
        p=0;n,p=uleb(body,p)
        for _ in range(n):
            fl,p=uleb(body,p)
            if fl==0:
                p+=1; off,p=sleb(body,p); p+=1
                ln,p=uleb(body,p); datas.append((off,body[p:p+ln])); p+=ln
            elif fl==2:
                p+=1; off,p=sleb(body,p); p+=1
                ln,p=uleb(body,p); datas.append((off,body[p:p+ln])); p+=ln
            elif fl==1:
                ln,p=uleb(body,p); datas.append((None,body[p:p+ln])); p+=ln
        break
datas=[x for x in datas if x[0] is not None]
datas.sort()
print('segments:',[(hex(o),len(b),hex(o+len(b))) for o,b in datas])
def at(a,ln=64):
    for o,b in datas:
        if o<=a<o+len(b): return b[a-o:a-o+ln]
    return None
for a in (0x11800,0x1189C,0x2C48C,0x15276,0x4C638,0x4812D,0x4171A,0x4BB06):
    r=at(a); print(f'0x{a:06X}: {r!r}')
# find long printable runs in the big segment
big=[b for o,b in datas if len(b)>200000][0]
base=[o for o,b in datas if len(b)>200000][0]
runs=[];i=0
while i<len(big):
    if 32<=big[i]<127:
        j=i
        while j<len(big) and 32<=big[j]<127: j+=1
        if j-i>=64: runs.append((base+i,j-i,big[i:i+60]))
        i=j
    else: i+=1
print('\nruns>=64:',len(runs))
for a,l,pre in runs: print(f'  0x{a:06X} len={l} {pre!r}')