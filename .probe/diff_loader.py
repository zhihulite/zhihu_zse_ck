import glob, base64, hashlib

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
    d = open(f, 'rb').read(); i = 8; datas = []
    while i < len(d):
        sid = d[i]; i += 1
        sz, i = uleb(d, i); body = d[i:i+sz]; i += sz
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

outs = {}
for f in sorted(glob.glob('.probe/*.wasm')):
    ds = load(f)
    lb = at(ds, 0x4812D, 17384)
    dec = base64.b64decode(lb)
    outs[f] = dec
    open('.probe/ldr_' + f.split('\\')[-1] + '.bin', 'wb').write(dec)
    print(f, 'len', len(dec), 'md5', hashlib.md5(dec).hexdigest())
names = list(outs)
base = outs[names[0]]
for n in names[1:]:
    d = outs[n]
    diff = [i for i in range(min(len(base), len(d))) if base[i] != d[i]]
    print(n, 'diff bytes vs first:', len(diff), 'first', diff[:20], 'last', diff[-5:] if diff else None)