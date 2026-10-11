import sys
f=sys.argv[1] if len(sys.argv)>1 else '.probe/zse-ck.wasm'
d=open(f,'rb').read()
assert d[:4]==b'\x00asm', d[:8]
def uleb(b,i):
    r=0;s=0
    while True:
        x=b[i];i+=1;r|=(x&0x7f)<<s;s+=7
        if not x&0x80: break
    return r,i
def sleb(b,i):
    r=0;s=0
    while True:
        x=b[i];i+=1
        r|=(x&0x7f)<<s;s+=7
        if not x&0x80:
            if s<64 and x&0x40: r|=-(1<<s)
            break
    return r,i
i=8; datas=[]; memlimits=[]
while i<len(d):
    sid=d[i];i+=1
    sz,i=uleb(d,i)
    body=d[i:i+sz]; i+=sz
    if sid==5:
        p=0;n,p=uleb(body,p)
        for _ in range(n):
            fl,p=uleb(body,p)
            mn,p=uleb(body,p)
            mx=None
            if fl&1: mx,p=uleb(body,p)
            memlimits.append((mn,mx))
    if sid==11:
        p=0; n,p=uleb(body,p)
        for k in range(n):
            flags,p=uleb(body,p)
            if flags==0:
                op=body[p]; p+=1
                off,p=sleb(body,p)
                assert body[p]==0x0b; p+=1
                ln,p=uleb(body,p)
                datas.append((off,body[p:p+ln])); p+=ln
            elif flags==2:
                mid,p=uleb(body,p); op=body[p];p+=1
                off,p=sleb(body,p); assert body[p]==0x0b;p+=1
                ln,p=uleb(body,p); datas.append((off,body[p:p+ln]));p+=ln
            elif flags==1:
                ln,p=uleb(body,p); datas.append((None,body[p:p+ln]));p+=ln
        break
print('file',f,'size',len(d),'data segs',len(datas),'mem',memlimits)
datas.sort(key=lambda t:(t[0] is None, t[0]))
for off,b in datas:
    if off is None:
        print(f'  PASSIVE len={len(b)}'); continue
    print(f'  off=0x{off:06X} len={len(b)} end=0x{off+len(b):06X}')
def at(addr,ln=48):
    for off,b in datas:
        if off is not None and off<=addr<off+len(b):
            return b[addr-off:addr-off+ln]
    return None
for a in (0x11800,0x1189C,0x2C48C,0x4C638,0x4812D,0x48100,0x4CD30,0x4CBC8,0x4CBB4):
    r=at(a)
    print(f'  0x{a:06X}: '+(repr(r) if r else 'NOT-IN-DATA'))