"""用恢复的 S 盒+轮密钥 复现加密；对 harness 自身 与 浏览器抓取会话 双重验证"""
import struct, json
pot=json.load(open('.probe/vmsvc/sbox_full.json'))['pot']
assert len(set(pot))==256, 'pot not a permutation'
pot_inv=[0]*256
for v,p in enumerate(pot): pot_inv[p]=v
def rotl(x,r): return ((x<<r)|(x>>(32-r)))&0xffffffff
def L(x): return x ^ rotl(x,2) ^ rotl(x,10) ^ rotl(x,18) ^ rotl(x,24)
# --- recover rk from harness trace (C=0) ---
d=open('.probe/vmsvc/op_run1.bin','rb').read(); n=len(d)//32
rec=[struct.unpack_from('<IIIIIIII',d,i*32) for i in range(n)]
runs=[]; i=0
while i<n:
    if rec[i][0]==1:
        j=i
        while j<n and rec[j][0]==1: j+=1
        runs.append((i,j)); i=j
    else: i+=1
rounds=[]; prologues=[]
for a,b in runs:
    v=[rec[k][4] for k in range(a,b)]
    if b-a==8 and v[4:]==[30,22,14,8]: rounds.append(v[:4])
    if b-a==16: prologues.append(v)
X=[int.from_bytes(bytes(prologues[0][4*k:4*k+4]),'big') for k in range(4)]
A=[int.from_bytes(bytes(rounds[r]),'big') for r in range(32)]
for r in range(32): X.append(X[r]^L(A[r]))
RK=[int.from_bytes(bytes(pot[b] for b in rounds[r]),'big') ^ X[r+1]^X[r+2]^X[r+3] for r in range(32)]
print('RK[0:4] =', [hex(x) for x in RK[:4]])
def enc_block(P):
    X=[int.from_bytes(P[4*k:4*k+4],'big') for k in range(4)]
    for r in range(32):
        W=X[r+1]^X[r+2]^X[r+3]^RK[r]
        Ab=bytes(pot_inv[b] for b in W.to_bytes(4,'big'))
        X.append(X[r]^L(int.from_bytes(Ab,'big')))
    return X[35].to_bytes(4,'big')+X[34].to_bytes(4,'big')+X[33].to_bytes(4,'big')+X[32].to_bytes(4,'big')
def enc(pt96):
    IV=b'd19e4a2bc57f8603'; prev=IV; out=b''
    for b in range(6):
        inp=bytes(x^y^0x4d for x,y in zip(pt96[16*b:16*b+16], prev))
        c=enc_block(inp); out+=c; prev=c
    return out
# --- test 1: harness itself ---
rec93=b'236c200010008000400080008000880080008000800040006713b41072b8449e792f748225172a79z3efa0afbbf32'
pt=rec93+bytes([3,3,3])
CT=[bytes(x) for x in [[195,23,124,97,221,192,198,170,115,248,196,192,13,150,76,78],
 [170,58,133,225,113,82,142,70,60,216,210,55,56,23,54,103],
 [71,25,79,161,35,147,243,12,199,0,65,133,100,195,124,191],
 [185,243,225,227,13,120,253,212,191,24,49,32,25,36,108,182],
 [130,14,178,76,178,81,235,168,8,175,124,171,19,83,104,190]]]
mine=enc(pt)
print('harness self-test:', mine[:80].hex()==b''.join(CT).hex(), mine[:16].hex(), CT[0].hex())