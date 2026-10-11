import struct, re

D = '.probe/wd-post-at132.bin'
d = open(D, 'rb').read()

r93 = '236c200010008000400080008000880080008000800040006713b41072b8449e792f748225172a79z3efa0afbbf32'
vals = [int(r93[i*4:i*4+4], 16) for i in range(12)]
print('12 uint16:', ['0x%04x' % v for v in vals])

be = b''.join(struct.pack('>H', v) for v in vals)
le = b''.join(struct.pack('<H', v) for v in vals)
print('BE16 字节:', be.hex())
print('LE16 字节:', le.hex())
print()
for tag, pat in (('BE16', be), ('LE16', le)):
    offs = [m.start() for m in re.finditer(re.escape(pat), d)]
    print('%s 命中 %d 处: %s' % (tag, len(offs), [hex(o) for o in offs[:8]]))

# 也找每个单独值作为 u32 出现的密集区（可能 12 个值以 u32 形式排列）
print()
u32be = b''.join(struct.pack('>I', v) for v in vals)
u32le = b''.join(struct.pack('<I', v) for v in vals)
for tag, pat in (('BE32', u32be), ('LE32', u32le)):
    offs = [m.start() for m in re.finditer(re.escape(pat), d)]
    print('%s 命中 %d 处: %s' % (tag, len(offs), [hex(o) for o in offs[:8]]))

# 找 24 字节里前 4 字节（0x236c）单独出现的区域
print()
p1 = struct.pack('>H', vals[0])
offs = [m.start() for m in re.finditer(re.escape(p1), d)]
print('首值 BE16 0x%04x 命中 %d 处: %s' % (vals[0], len(offs), [hex(o) for o in offs[:12]]))
