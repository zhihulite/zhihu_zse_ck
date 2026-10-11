import struct, json, sys
pot=json.load(open('.probe/vmsvc/sbox_full.json'))['pot']
def rotl(x,r): return ((x<<r)|(x>>(32-r)))&0xffffffff
def L(x): return x ^ rotl(x,2) ^ rotl(x,10) ^ rotl(x,18) ^ rotl(x,24)
def getRK(trace):
    d=open(trace,'rb').read(); n=len(d)//32
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
    return [int.from_bytes(bytes(pot[b] for b in rounds[r]),'big') ^ X[r+1]^X[r+2]^X[r+3] for r in range(32)], bytes(prologues[0])
if __name__=='__main__':
    for t in sys.argv[1:]:
        rk,pr=getRK(t)
        print('%-42s prologue=%s RK[0:3]=%s'%(t.split('/')[-1], pr.hex()[:16], [hex(x) for x in rk[:3]]))