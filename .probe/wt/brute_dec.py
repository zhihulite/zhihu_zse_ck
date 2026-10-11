import struct

d = open('blob_295213.bin', 'rb').read()
A = [196, 8, 110, 71]
AV = [bytes(A), b''.join(struct.pack('<H', x) for x in A), b''.join(struct.pack('<I', x) for x in A)]


def dec(buf, init, key):
    out = bytearray(); st = init
    for c in buf:
        v = (c ^ st ^ key) & 0xff
        out.append(v); st = v
    return bytes(out)


best = []
for init in range(256):
    for key in range(256):
        x = dec(d, init, key)
        pr = sum(1 for c in x if 32 <= c < 127 or c in (9, 10, 13))
        hits = sum(1 for p in AV if p in x)
        best.append((pr, hits, init, key))
best.sort(reverse=True)
print('top (printable, Ahits, init, key):')
for b in best[:8]:
    print('  ', b)
# also try plain-XOR (no feedback)
best2 = []
for key in range(256):
    x = bytes(c ^ key for c in d)
    pr = sum(1 for c in x if 32 <= c < 127)
    best2.append((pr, key))
best2.sort(reverse=True)
print('plain XOR top:', best2[:4])
# show best decrypt head
pr, hits, init, key = best[0]
x = dec(d, init, key)
print('best init=%#x key=%#x head: %r' % (init, key, x[:120]))
print('  hex:', x[:64].hex())
