import struct

mem = open('../../.probe/vmsvc/final_memory.bin', 'rb').read()
pool_ptr, pool_len = struct.unpack_from('<II', mem, 0x4cbb0 + 0x140)
p = pool_ptr
parts = []
for k in range(pool_len):
    ln = struct.unpack_from('>H', mem, p)[0]
    parts.append(mem[p + 2:p + 2 + ln])
    p += 2 + ln

js = [x for x in parts if sum(1 for c in x if 32 <= c < 127 or c in (9, 10, 13)) > len(x) * 0.8]
js.sort(key=len, reverse=True)
ref = js[0]
print('reference entry len', len(ref))

# align every entry to ref by a long common substring
placed = []   # (offset_in_ref, entry)
placed.append((0, ref))
unplaced = []
for x in js[1:]:
    best = None
    for probe_len in (512, 256, 128, 64, 32):
        if len(x) < probe_len:
            continue
        found = False
        for i in range(0, len(x) - probe_len + 1, 8):
            j = ref.find(x[i:i + probe_len])
            if j >= 0:
                best = (j - i, i)
                found = True
                break
        if found:
            break
    if best:
        placed.append((best[0], x))
    else:
        unplaced.append(x)

print('placed:', len(placed), 'unplaced:', len(unplaced))
lo = min(o for o, _ in placed)
hi = max(o + len(x) for o, x in placed)
print('span: %d .. %d  (%d bytes)' % (lo, hi, hi - lo))

# build consensus
buf = bytearray(b'\x00' * (hi - lo))
conflict = 0
for o, x in placed:
    s = o - lo
    for i, c in enumerate(x):
        k = s + i
        if buf[k] == 0:
            buf[k] = c
        elif buf[k] != c:
            conflict += 1
print('conflicting bytes:', conflict)
out = bytes(buf)
open('../../.probe/vmsvc/vm_js_reassembled.txt', 'wb').write(out)
print('saved vm_js_reassembled.txt', len(out))
print('head:', out[:160])
print('tail:', out[-160:])
