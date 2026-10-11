"""Insert fd_write(dst, vm, 0, 0) at the entry of function body #IDX (the operand-fetch helper)."""
import sys
src=open(sys.argv[1],'rb').read()
out_path=sys.argv[2]; TARGET_IDX=int(sys.argv[3]) if len(sys.argv)>3 else 181
def uleb(b,i):
    r=0;s=0
    while True:
        x=b[i];i+=1;r|=(x&0x7f)<<s;s+=7
        if not x&0x80: break
    return r,i
def leb(n):
    out=bytearray()
    while True:
        x=n&0x7f; n>>=7
        if n: out.append(x|0x80)
        else: out.append(x); break
    return bytes(out)
assert src[:8]==b'\x00asm\x01\x00\x00\x00'
i=8; secs=[]
while i<len(src):
    sid=src[i]; i+=1; sz,i=uleb(src,i); secs.append((sid,src[i-sz-1-0:i][0:0],i,sz,src[i:i+sz])); i+=sz
# find fd_write index
fd_idx=None
for sid,_,hdr_end,sz,body in secs:
    if sid==2:
        p=0;n,p=uleb(body,p); fi=0
        for _ in range(n):
            l,p=uleb(body,p); mod=body[p:p+l].decode(); p+=l
            l,p=uleb(body,p); nm=body[p:p+l].decode(); p+=l
            k=body[p]; p+=1
            if k==0:
                if mod=='wasi_snapshot_preview1' and nm=='fd_write': fd_idx=fi
                fi+=1
assert fd_idx is not None, 'fd_write not imported'
ins = bytes([0x20,0x00, 0x20,0x01, 0x41,0x00, 0x41,0x00, 0x10]) + leb(fd_idx) + bytes([0x1a])
for si,(sid,_,hdr_end,sz,body) in enumerate(secs):
    if sid!=10: continue
    p=0;n,p=uleb(body,p)
    chunks=[]
    for k in range(n):
        bsz,p2=uleb(body,p)
        chunks.append(body[p2:p2+bsz]); p=p2+bsz
    ch=chunks[TARGET_IDX]
    # locals decl
    q=0; nl,q=uleb(ch,q)
    for _ in range(nl):
        _,q=uleb(ch,q); _,q=uleb(ch,q)
    chunks[TARGET_IDX]=ch[:q]+ins+ch[q:]
    newsec=bytearray(); newsec+=leb(n)
    for c in chunks: newsec+=leb(len(c))+c
    out=bytearray(src[:hdr_end])+leb(len(newsec))+bytes(newsec)+src[hdr_end+sz:]
    open(out_path,'wb').write(bytes(out))
    print('fd_write idx=%d; inserted %d bytes into body #%d (%d -> %d); section %d -> %d; file %d -> %d'
          %(fd_idx,len(ins),TARGET_IDX,len(ch),len(chunks[TARGET_IDX]),sz,len(newsec),len(src),len(out)))
    sys.exit(0)
print('code section not found'); sys.exit(1)