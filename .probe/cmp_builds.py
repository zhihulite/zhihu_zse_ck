import glob, hashlib

def uleb(b, i):
    r = 0; s = 0
    while True:
        x = b[i]; i += 1; r |= (x & 0x7f) << s; s += 7
        if not x & 0x80: break
    return r, i

def sleb(b, i):
    r = 0; s = 0
    while True:
        x = b[i]; i += 1; r |= (x & 0x7f) << s; s += 7
        if not x & 0x80:
            if s < 64 and x & 0x40: r |= -(1 << s)
            break
    return r, i

def load(f):
    d = open(f, 'rb').read()
    i = 8; datas = []
    while i < len(d):
        sid = d[i]; i += 1
        sz, i = uleb(d, i)
        body = d[i:i+sz]; i += sz
        if sid == 11:
            p = 0; n, p = uleb(body, p)
            for _ in range(n):
                fl, p = uleb(body, p)
                if fl == 0:
                    p += 1; off, p = sleb(body, p); p += 1
                    ln, p = uleb(body, p); datas.append((off, body[p:p+ln])); p += ln
                elif fl == 2:
                    p += 1; off, p = sleb(body, p); p += 1
                    ln, p = uleb(body, p); datas.append((off, body[p:p+ln])); p += ln
                elif fl == 1:
                    ln, p = uleb(body, p); datas.append((None, body[p:p+ln])); p += ln
            break
    return [x for x in datas if x[0] is not None]

def at(ds, a, ln):
    for o, b in ds:
        if o <= a < o + len(b): return b[a-o:a-o+ln]

RT1 = b'AMVL3T/dGNenw9l6=2OZfDhJr71j0kCyiRXavSxHqIpBPm4u5KUgsz8FWtYocbEQ'
idx = {c: i for i, c in enumerate(RT1)}
def cdec(s):
    v = [idx[c] for c in s if c in idx]
    o = bytearray()
    for k in range(0, len(v)-3, 4):
        a, b, c, e = v[k:k+4]; n = (a << 18) | (b << 12) | (c << 6) | e
        o += bytes([(n >> 16) & 255, (n >> 8) & 255, n & 255])
    return bytes(o)

for f in sorted(glob.glob('.probe/*.wasm')):
    ds = load(f)
    lb = at(ds, 0x4812D, 17384)
    sb = at(ds, 0x1189C, 181388)
    dec = cdec(sb) if sb else b''
    print(f)
    print('   loader md5', hashlib.md5(lb).hexdigest() if lb else None, 'head', lb[:20] if lb else None)
    print('   src  head', repr(dec[:36]))
    print('   src  md5', hashlib.md5(dec).hexdigest())