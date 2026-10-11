"""Patch a wasm module: append an export for global 0 (the Go stack pointer)."""
import sys
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
src=open(sys.argv[1],'rb').read()
dst=sys.argv[2]; name=(sys.argv[3] if len(sys.argv)>3 else 'sp').encode()
assert src[:8]==b'\x00asm\x01\x00\x00\x00'
i=8; secs=[]
while i<len(src):
    sid=src[i]; i+=1
    sz,i=uleb(src,i)
    secs.append((sid, src[i:i+sz])); i+=sz
out=bytearray(src[:8])
done=False
for sid,body in secs:
    if sid==7:
        n,p=uleb(body,0)
        new=bytearray(); new+=leb(n+1); new+=body[p:]
        new+=leb(len(name))+name+bytes([0x03])+leb(0)   # kind=global(3), index=0
        out+=bytes([7])+leb(len(new))+new
        done=True
    else:
        out+=bytes([sid])+leb(len(body))+body
assert done,'no export section'
open(dst,'wb').write(bytes(out))
print('patched ->',dst,'added export',name.decode(),'size',len(out))