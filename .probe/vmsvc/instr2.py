import sys
src=open(sys.argv[1],'rb').read(); out_path=sys.argv[2]; TARGET_IDX=int(sys.argv[3])
def uleb(b,i):
    r=0;s=0
    while True:
        x=b[i];i+=1;r|=(x&0x7f)<<s;s+=7
        if not x&0x80: break
    return r,i
def leb(n):
    o=bytearray()
    while True:
        x=n&0x7f; n>>=7
        if n: o.append(x|0x80)
        else: o.append(x); break
    return bytes(o)
assert src[:8]==b'\x00asm\x01\x00\x00\x00'
secs=[]; i=8
while i<len(src):
    idp=i; sid=src[i]; i+=1
    sz,i=uleb(src,i); hdr=i; body=src[i:i+sz]
    secs.append([sid,hdr,sz,body,idp]); i+=sz
fd=None
for sid,hdr,sz,body,_idp in secs:
    if sid!=2: continue
    p=0; n,p=uleb(body,p); fi=0
    for _ in range(n):
        l,p=uleb(body,p); mod=body[p:p+l].decode(); p+=l
        l,p=uleb(body,p); nm=body[p:p+l].decode(); p+=l
        k=body[p]; p+=1; _,p=uleb(body,p)
        if mod=='wasi_snapshot_preview1' and nm=='fd_write': fd=fi
        fi+=1
# fd_write(fd=param1(opcode), iovs=param0(VM), cnt=0, nwritten=0)
ins=bytes([0x20,0x01,0x20,0x00,0x41,0x00,0x41,0x00,0x10])+leb(fd)+bytes([0x1a])
for s in secs:
    if s[0]!=10: continue
    sid,hdr,sz,body,idp=s
    p=0; n,p=uleb(body,p); chunks=[]
    for k in range(n):
        bsz,p2=uleb(body,p); chunks.append(body[p2:p2+bsz]); p=p2+bsz
    ch=chunks[TARGET_IDX]; q=0; nl,q=uleb(ch,q)
    for _ in range(nl):
        _,q=uleb(ch,q); _,q=uleb(ch,q)
    chunks[TARGET_IDX]=ch[:q]+ins+ch[q:]
    new=bytearray(); new+=leb(n)
    for c in chunks: new+=leb(len(c))+c
    out=bytes(src[:idp+1])+leb(len(new))+bytes(new)+src[hdr+sz:]
    open(out_path,'wb').write(out)
    print('OK body#%d  file %d -> %d'%(TARGET_IDX,len(src),len(out)))
    break