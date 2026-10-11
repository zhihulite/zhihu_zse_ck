import sys
d=open('.probe/zse-ck.wasm','rb').read()
# use known segment: off=0x010121 len=247060 (covers 0x1121..0x4C635)
SEG_OFF=0x010121; SEG_LEN=247060
seg=d[SEG_OFF:SEG_OFF+SEG_LEN]   # linear addr = SEG_OFF + idx  => idx = addr - 0x10121
def at(addr,ln):
    return seg[addr-0x010121:addr-0x010121+ln]
vm=at(0x1189C,0x2C48C)
print('vm blob len',len(vm))
print('head:',vm[:120])
print('tail:',vm[-120:])
import collections
cs=collections.Counter(vm)
print('distinct chars',len(cs))
print('sorted chars:', ''.join(sorted(cs)))
print('non-ascii bytes:', sum(1 for b in vm if b>127 or b<32))
# check trailing
print('last 32 bytes:', vm[-32:])
# search for known alphabet
for pat in (b'rBPa7xz6ReFTKuVHLE', b'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'):
    j=seg.find(pat)
    print('find',pat[:20],'->',hex(0x010121+j) if j>=0 else 'none')