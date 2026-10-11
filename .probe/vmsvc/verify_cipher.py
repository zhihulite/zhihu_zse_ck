import importlib.util
spec=importlib.util.spec_from_file_location('zc','.probe/vmsvc/zse_cipher.py')
zc=importlib.util.module_from_spec(spec); spec.loader.exec_module(zc)
# harness session rk (recovered from trace)
import struct, json
pot=json.load(open('.probe/vmsvc/sbox_global.json'))['pot']
def rotl(x,r): return ((x<<r)|(x>>(32-r)))&0xffffffff
def L(x): return x ^ rotl(x,2) ^ rotl(x,10) ^ rotl(x,18) ^ rotl(x,24)
d=open('.probe/vmsvc/op_run1.bin','rb').read(); n=len(d)//32
ent=[]
for i in range(n):
    op,sp,pr,t1,v1,t2,v2,pad=struct.unpack_from('<IIIIIIII',d,i*32); ent.append((op,sp,t1,v1,t2,v2))
runs=[]; i=0
while i<n:
    if ent[i][0]==1:
        j=i
        while j<n and ent[j][0]==1: j+=1
        runs.append((i,j)); i=j
    else: i+=1
rounds=[]; pro=[]
for a,b in runs:
    v=[ent[k][3] for k in range(a,b)]
    if b-a==8 and v[4:]==[30,22,14,8]: rounds.append(v[:4])
    if b-a==16: pro.append(bytes(v))
X=[int.from_bytes(pro[0][4*k:4*k+4],'big') for k in range(4)]
for r in range(32): X.append(X[r]^L(int.from_bytes(bytes(rounds[r]),'big')))
RK=[int.from_bytes(bytes(pot[b] for b in rounds[r]),'big')^X[r+1]^X[r+2]^X[r+3] for r in range(32)]
rec93=b'236c200010008000400080008000880080008000800040006713b41072b8449e792f748225172a79z3efa0afbbf32'
pt=zc.record93_to_pt(rec93)
ct=zc.encrypt_96(pt, RK)
CAP=bytes.fromhex('c3177c61ddc0c6aa73f8c4c00d964c4eaa3a85e171528e463cd8d23738173667'
                  '47194fa12393f30cc700418564c37cbfb9f3e1e30d78fdd4bf18312019246cb6'
                  '820eb24cb251eba808af7cab135368be')
print('encrypt_96 matches captured 80B :', ct[:80]==CAP)
print('decrypt_96 roundtrip             :', zc.decrypt_96(ct, RK)==pt)
# live-session structural check: enc_block(prologue_b) == prologue_{b+1} ^ P_{b+1} ^ MASK
lj=json.load(open('.probe/cap2/dump_1791198678168.bin.meta.json',encoding='utf8'))
ent2=[tuple(e) for e in lj['log']]
runs=[]; i=0; n2=len(ent2)
while i<n2:
    if ent2[i][0]==1:
        j=i
        while j<n2 and ent2[j][0]==1: j+=1
        runs.append((i,j)); i=j
    else: i+=1
rounds2=[]; pro2=[]
for a,b in runs:
    v=[ent2[k][3] for k in range(a,b)]
    if b-a==8 and v[4:]==[30,22,14,8]: rounds2.append(v[:4])
    if b-a==16: pro2.append(bytes(v))
d2=json.load(open('.probe/vmsvc/live_session.json'))
RK2=d2['rk']; rec2=bytes(d2['rec93'],'utf8'); pt2=zc.record93_to_pt(rec2)
ok=all(zc.encrypt_block(pro2[b],RK2)==bytes(x^y^0x1B for x,y in zip(pro2[b+1], pt2[16*(b+1):16*(b+1)+16])) for b in range(5))
print('live session block-chain check   :', ok, '(MASK=0x1B)')
print('radix64 input order == ct[::-1]  :', zc.radix64_input_order(ct)==ct[::-1])