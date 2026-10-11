import io, struct
b = open('.probe/build-859e.wasm', 'rb').read()
def uleb(b, i):
    r = 0; s = 0
    while True:
        x = b[i]; i += 1; r |= (x & 0x7f) << s; s += 7
        if not x & 0x80: return r, i
i = 8; secs = {}
while i < len(b):
    sid = b[i]; i += 1; sz, i = uleb(b, i)
    secs.setdefault(sid, []).append((i, sz)); i += sz
off, sz = secs[11][0]
p = off; n, p = uleb(b, p)
print('data 段声明 %d 条，段大小 %d' % (n, sz))
segs = []
for k in range(n):
    flag, p = uleb(b, p)
    if flag == 0:
        assert b[p] == 0x41; p += 1
        eo, p = uleb(b, p)
        assert b[p] == 0x0B; p += 1
        ln, p = uleb(b, p)
        segs.append((eo, ln, p)); p += ln
    elif flag == 1:
        ln, p = uleb(b, p); segs.append((None, ln, p)); p += ln
    elif flag == 2:
        _, p = uleb(b, p)
        assert b[p] == 0x41; p += 1
        eo, p = uleb(b, p)
        assert b[p] == 0x0B; p += 1
        ln, p = uleb(b, p)
        segs.append((eo, ln, p)); p += ln
    else:
        print('未知 flag', flag); break
print('解析到 %d 条；结束偏移 %d（段区 %d..%d）' % (len(segs), p, off, off + sz))
for eo, ln, dp in segs:
    print('  0x%-8x len=%-8d end=0x%-8x' % (eo or 0, ln, (eo or 0) + ln))
tgt = 0x4CBB8
print()
print('目标 0x%X 是否被覆盖: %s' % (tgt, any(eo and eo <= tgt < eo + ln for eo, ln, _ in segs)))