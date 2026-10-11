import re, base64

txt = open('zse.wat', encoding='utf8', errors='replace').read()
segs = re.findall(r'\(data \$?[.\w]* \(i32\.const (\d+)\) ((?:"(?:[^"\\]|\\.)*"\s*)+)\)', txt)
BS = chr(92)


def unesc(s):
    out = bytearray(); i = 0
    while i < len(s):
        c = s[i]
        if c == BS:
            n = s[i + 1]
            if n == 't': out.append(9); i += 2
            elif n == 'n': out.append(10); i += 2
            elif n == 'r': out.append(13); i += 2
            elif n == '"': out.append(34); i += 2
            elif n == BS: out.append(92); i += 2
            elif n == "'": out.append(39); i += 2
            else:
                try:
                    out.append(int(s[i + 1:i + 3], 16)); i += 3
                except Exception:
                    out.append(ord(n)); i += 2
        else:
            out.append(ord(c)); i += 1
    return bytes(out)


blobs = {}
for off, body in segs:
    parts = re.findall('"((?:[^"' + BS + BS + ']|' + BS + BS + '.)*)"', body)
    raw = unesc(''.join(parts))
    for m in re.finditer(rb'[A-Za-z0-9+/=]{1000,}', raw):
        blobs[int(off) + m.start()] = m.group()

print('blobs found:', len(blobs))
for off, b in sorted(blobs.items()):
    try:
        d = base64.b64decode(b + b'=' * ((4 - len(b) % 4) % 4))
    except Exception as e:
        print('@%d len=%d decode err %s' % (off, len(b), e)); continue
    print('@%-8d b64=%-7d -> %d bytes' % (off, len(b), len(d)))
    print('    head: %r' % d[:100])
    open('blob_%d.bin' % off, 'wb').write(d)
