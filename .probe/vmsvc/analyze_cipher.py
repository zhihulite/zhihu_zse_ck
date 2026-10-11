"""zse_ck 005_ 密码结构复现 —— 从 op_trace.bin 推导 (自包含, 可复跑)
用法: python .probe/vmsvc/analyze_cipher.py
依赖: .probe/vmsvc/op_run1.bin (wdriver_bp.py 产物)"""
import struct, json
TRACE='.probe/vmsvc/op_run1.bin'
d=open(TRACE,'rb').read(); n=len(d)//32
rec=[struct.unpack_from('<IIIIIIII',d,i*32) for i in range(n)]
# --- 1. 切分 op=1 常量段: 192 段 x8 (=SM4 轮) / 6 段 x16 (=块输入) / 32 段 x3 (=radix64) ---
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
    if b-a==8 and v[4:]==[30,22,14,8]: rounds.append(v[:4])   # 末4位=30,22,14,8 -> SM4 L 右旋量
    if b-a==16: prologues.append(v)
assert len(rounds)==192 and len(prologues)==6, (len(rounds),len(prologues))
def rotl(x,r): return ((x<<r)|(x>>(32-r)))&0xffffffff
def L(x): return x ^ rotl(x,2) ^ rotl(x,10) ^ rotl(x,18) ^ rotl(x,24)
# --- 2. 轮结构验证: X_{i+4} = X_i ^ L(A_i), 输出=(X35,X34,X33,X32) ---
CT=[[195,23,124,97,221,192,198,170,115,248,196,192,13,150,76,78],
    [170,58,133,225,113,82,142,70,60,216,210,55,56,23,54,103],
    [71,25,79,161,35,147,243,12,199,0,65,133,100,195,124,191],
    [185,243,225,227,13,120,253,212,191,24,49,32,25,36,108,182],
    [130,14,178,76,178,81,235,168,8,175,124,171,19,83,104,190]]
X=[];A=[]
for bi in range(6):
    Xa=[int.from_bytes(bytes(prologues[bi][4*k:4*k+4]),'big') for k in range(4)]
    Ab=[int.from_bytes(bytes(rounds[bi*32+r]),'big') for r in range(32)]
    for r in range(32): Xa.append(Xa[r]^L(Ab[r]))
    X.append(Xa); A.append(Ab)
ok=all((X[bi][35].to_bytes(4,'big')+X[bi][34].to_bytes(4,'big')+
        X[bi][33].to_bytes(4,'big')+X[bi][32].to_bytes(4,'big'))==bytes(CT[bi]) for bi in range(5))
print('[2] 轮结构 X_{i+4}=X_i^L(A_i) 复现密文:', ok)
# --- 3. CBC 链接: input_b = P_b ^ 0x4D.. ^ C_{b-1}, C_{-1} = "d19e4a2bc57f8603" ---
REC93=b'236c200010008000400080008000880080008000800040006713b41072b8449e792f748225172a79z3efa0afbbf32'
P=[REC93[k:k+16] for k in range(0,80,16)]+[REC93[80:93]+bytes([3,3,3])]
IV=b'd19e4a2bc57f8603'
prev=IV; cbc=True
for b in range(6):
    inp=bytes(x^y^0x4d for x,y in zip(P[b],prev))
    if inp!=bytes(prologues[b]): cbc=False
    prev=bytes(CT[b])
print('[3] CBC + 0x4D 掩码 + IV=%r 复现块输入:'%IV, cbc)
# --- 4. S 盒相对值恢复 (跨块同轮约束图) ---
parent=list(range(256)); pot=[0]*256
def find(x):
    if parent[x]==x: return x,0
    r,p=find(parent[x]); parent[x]=r; pot[x]^=p; return parent[x],pot[x]
conf=0
for r in range(32):
    for j in range(4):
        for bi in range(6):
            a=(A[bi][r]>>(24-8*j))&0xff
            u=((X[bi][r+1]^X[bi][r+2]^X[bi][r+3])>>(24-8*j))&0xff
            for bk in range(bi+1,6):
                a2=(A[bk][r]>>(24-8*j))&0xff
                u2=((X[bk][r+1]^X[bk][r+2]^X[bk][r+3])>>(24-8*j))&0xff
                ra,pa=find(a); rb,pb=find(a2)
                if ra==rb:
                    if (pa^pb)!=(u^u2): conf+=1
                else: parent[rb]=ra; pot[rb]=pa^pb^(u^u2)
from collections import defaultdict
comp=defaultdict(list)
for v in range(256): comp[find(v)[0]].append(v)
sizes=sorted((len(v) for v in comp.values()), reverse=True)
print('[4] S^-1 约束图: 冲突=%d 分量=%d 大小=%s  -> S^-1(v)=pot[v]^C'%(conf,len(comp),sizes[:4]))
json.dump({'pot':pot,'components':{str(k):v for k,v in comp.items()},
           'note':'S^-1(v) = pot[v] ^ C_comp ; 需 pin 1 个全局常量 + 10 个单点'},
          open('.probe/vmsvc/sbox_partial.json','w'))
print('    已存 .probe/vmsvc/sbox_partial.json')
print()
print('已确认: 6 块 CBC / 标准 SM4 L 变换 / 魔改 8bit S 盒 / IV="d19e4a2bc57f8603" / 明文掩码 0x4D')
print('未决  : S 盒全局常量 + 10 单点; 32 轮密钥来源; 每会话种子->密钥/字母表')