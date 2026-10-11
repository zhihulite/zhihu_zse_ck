import struct

d = open('blob_295213.bin', 'rb').read()
print('blob len', len(d))

# rolling XOR decryptor recovered from main._0oooOO:
#   state = 0x46 ; loop: b = b ^ state ^ 0x4B ; state = b
def dec(buf, init=0x46, key=0x4B):
    out = bytearray(); st = init
    for c in buf:
        v = (c ^ st ^ key) & 0xff
        out.append(v); st = v
    return bytes(out)

x = dec(d)
print('decrypted head:', x[:120].hex())
print('decrypted ascii:', x[:200])
# count printable
pr = sum(1 for c in x if 32 <= c < 127)
print('printable ratio: %.3f' % (pr / len(x)))
# look for the observed opcode values (62648 etc. as u32le)
for v in (62648, 62640, 62720, 62296, 63536, 63072):
    p = struct.pack('<I', v)
    print('  u32le %d (%#x) in decrypted: %s ; in raw: %s' % (v, v, x.find(p), d.find(p)))
# structure check: 8-byte records?
print('first 16 records (8B each):')
for i in range(16):
    r = x[i*8:i*8+8]
    print('   %2d  %s' % (i, r.hex()))
