import struct, itertools

blob = open('.probe/zsec/vmprog.bin', 'rb').read()
print('blob', len(blob))

def score(off, size, endian, stride, nmax=34):
    """每 stride 个 word 取第 0 个当 opcode，统计 <=nmax 的比例"""
    n = (len(blob) - off) // size
    if n < 16: return 0, 0
    ok = tot = 0
    for i in range(0, n - stride, stride):
        p = off + i * size
        v = int.from_bytes(blob[p:p+size], endian)
        tot += 1
        if v <= nmax: ok += 1
    return (ok / tot if tot else 0), tot

best = []
for size in (1, 2, 4):
    for endian in ('little', 'big'):
        for stride in (2, 3, 4, 5, 6, 8):
            for off in range(0, min(32, len(blob))):
                sc, tot = score(off, size, endian, stride)
                if tot >= 32:
                    best.append((sc, off, size, endian, stride, tot))
best.sort(reverse=True)
print('%-6s %-5s %-4s %-8s %-7s %s' % ('ratio', 'off', 'size', 'endian', 'stride', 'n'))
for r in best[:20]:
    print('%-6.3f %-5d %-4d %-8s %-7d %d' % r)
