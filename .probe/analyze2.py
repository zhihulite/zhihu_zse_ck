import collections,math,base64,os
def ent(b):
    c=collections.Counter(b);n=len(b)
    return -sum((v/n)*math.log2(v/n) for v in c.values())
# loader output
if os.path.exists('.probe/vmsvc/vmprog_dec.bin'):
    L=open('.probe/vmsvc/vmprog_dec.bin','rb').read()
    print('loader dec len',len(L),'entropy %.3f'%ent(L))
    print(' loader head:',L[:48].hex())
    print(' loader u32:',[hex(int.from_bytes(L[j:j+4],'little')) for j in range(0,64,4)])
    print(' loader tail:',L[-48:].hex())
    print(' loader printable runs:', [ (i,len(r)) for i,r in [(0,0)] ])
# vm custom decode
V=open('.probe/vmprog_custom.bin','rb').read()
print('vm dec len',len(V),'entropy %.3f'%ent(V))
# look for ascii runs in V
runs=[];i=0
while i<len(V):
    if 32<=V[i]<127:
        j=i
        while j<len(V) and 32<=V[j]<127: j+=1
        if j-i>=8: runs.append((i,j-i,V[i:i+40]))
        i=j
    else:i+=1
print('vm ascii runs>=8:',len(runs)); 
for r in runs[:15]:print('   ',hex(r[0]),r[1],r[2])