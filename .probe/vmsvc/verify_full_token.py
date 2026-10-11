"""端到端：record93 -> token，对 harness 会话逐字符验证"""
import importlib.util, struct, json
spec=importlib.util.spec_from_file_location('zc','.probe/vmsvc/zse_cipher.py')
zc=importlib.util.module_from_spec(spec); spec.loader.exec_module(zc)
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
ALPHA='lstHZNLD1EWUP3vxemY2CK=M8z7p960AqaVFORy/SQX4h5bIuwGdBnkgrjJfocTi'
REAL='005_6EKcQyE4a7EdGycE6KJDIJ1723wyocWt8b0CGG/hv1SahmYLeZHLiY0irnuBaxAbxGguOKpel9Pxdxj1mTCLD6R3MqdsYF3xkjSCwN6aJSXAPzzHu2PTdQQwlg6Co6wu'
gen=zc.generate_token(rec93, RK, ALPHA)
print('generate_token == captured token :', gen==REAL, '(%d chars)'%len(gen))
ct=zc.encrypt_96(zc.record93_to_pt(rec93), RK)
print('radix64 roundtrip                 :', zc.radix64_decode(zc.radix64_encode(ct,ALPHA),ALPHA)==ct)
# live session: verify radix64 self-consistency with its own xreg
d2=json.load(open('.probe/vmsvc/live_session.json'))
ct2=zc.encrypt_96(zc.record93_to_pt(bytes(d2['rec93'],'utf8')), d2['rk'],
                  iv=bytes(d2['iv'],'utf8'), mask=d2['mask'])
lj=json.load(open('.probe/cap2/dump_1791198678168.bin.meta.json',encoding='utf8'))
pl=''.join(chr(e[3]) for e in lj['log'] if e[0]==10)
m={}; bad=0
seq=ct2[::-1]
for g in range(32):
    base=(0,24,16,8)[g%4]; v=0
    for j in range(3): v|=seq[g*3+j]<<((base+8*j)%32)
    v=(v&0xffffffff)^0x50
    for k in range(4):
        idx=zc._circ_slice(v,(base+6*k)%32)
        if idx in m:
            if m[idx]!=pl[g*4+k]: bad+=1
        else: m[idx]=pl[g*4+k]
print('live session radix64 conflicts     :', bad, '(indices resolved %d/64)'%len(m))