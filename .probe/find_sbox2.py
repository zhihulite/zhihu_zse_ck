import struct
V=open('.probe/vmprog_custom.bin','rb').read()
d=open('.probe/zse-ck.wasm','rb').read()
def perms(b,minlen=256):
    hits=[]
    for i in range(len(b)-255):
        w=b[i:i+256]
        if len(set(w))==256: hits.append(i)
    return hits
print('perm256 in decoded VM blob:',[hex(i) for i in perms(V)][:10])
print('perm256 in whole wasm:',[hex(i) for i in perms(d)][:10])
# SM4 constants
FK=bytes.fromhex('a3b1bac656aa3350677d9197b27022dc')
CK1=bytes.fromhex('00070e15')
for name,pat in [('FK_be',FK),('FK_le',bytes.fromhex('c6bab1a367337a5097d177b2dc2270b2')),('CK1_be',CK1)]:
    j=d.find(pat); print(name,'in wasm @',hex(j) if j>=0 else 'none')
    j2=V.find(pat); print('   in VMblob @',hex(j2) if j2>=0 else 'none')
# S-box as a 256-byte list of u32 (little endian) in decoded blob?
# look for standard sm4 sbox anywhere
sm4=bytes([0xd6,0x90,0xe9,0xfe,0xcc,0xe1,0x3d,0xb7])
print('std sm4 sbox head in wasm:',hex(d.find(sm4)),'in VMblob:',hex(V.find(sm4)))
# maybe sbox stored as 32-bit words
import struct
s32=b''.join(struct.pack('<I',x) for x in [0xd6,0x90,0xe9,0xfe,0xcc,0xe1,0x3d,0xb7])
print('std sm4 sbox as u32 in VMblob:',hex(V.find(s32)),'in wasm:',hex(d.find(s32)))