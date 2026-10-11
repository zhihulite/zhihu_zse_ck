import re, struct, collections

D = '.probe/wd-post-at132.bin'
d = open(D, 'rb').read()
print('dump', len(d), 'bytes')

# 1) record93
pat = re.compile(rb'[0-9a-f]{48}[0-9a-f]{32}z[0-9a-f]{12}')
hits = list(pat.finditer(d))
print('record93 命中:', len(hits))
for m in hits[:3]:
    r = m.group().decode()
    print('  @0x%x  %s' % (m.start(), r))
    print('     [0:48) = %s' % r[0:48])
    words = [r[i*4:i*4+4] for i in range(12)]
    print('     12 x uint16 = %s' % ' '.join(words))
    print('     [48:80) = %s   [80] = %r   [81:89) = %s   [89:93) = %s' % (r[48:80], r[80], r[81:89], r[89:93]))

# 2) token
tok = re.findall(rb'005_[A-Za-z0-9+/=]{128}', d)
print()
print('token 命中:', len(set(tok)))
for t in list(set(tok))[:2]:
    print('  ', t.decode()[:60], '...')

# 3) 找 32 字数组（候选 rk）：连续 32 个看似随机的 u32
print()
print('=== 找候选 32 字数组（rk）===')
seen = 0
for off in range(0, len(d) - 128, 4):
    w = struct.unpack('<32I', d[off:off + 128])
    if all(x != 0 for x in w) and len(set(w)) > 28 and all(0x10000000 < x < 0xf0000000 for x in w[:8]):
        print('  @0x%x  %s' % (off, ' '.join('%08x' % x for x in w[:8])))
        seen += 1
        if seen >= 6: break
print('  候选数(截断):', seen)
