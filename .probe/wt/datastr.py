import re, sys

txt = open('zse.wat', encoding='utf8', errors='replace').read()
segs = re.findall(r'\(data \$?[.\w]* \(i32\.const (\d+)\) ((?:"(?:[^"\\]|\\.)*"\s*)+)\)', txt)
print('data segments:', len(segs))

BS = chr(92)

def unesc(s):
    out = bytearray(); i = 0
    while i < len(s):
        c = s[i]
        if c == BS:
            n = s[i+1]
            if n == 't': out.append(9); i += 2
            elif n == 'n': out.append(10); i += 2
            elif n == 'r': out.append(13); i += 2
            elif n == '"': out.append(34); i += 2
            elif n == BS: out.append(92); i += 2
            elif n == "'": out.append(39); i += 2
            else:
                try:
                    out.append(int(s[i+1:i+3], 16)); i += 3
                except Exception:
                    out.append(ord(n)); i += 2
        else:
            out.append(ord(c)); i += 1
    return bytes(out)

big = []
for off, body in segs:
    parts = re.findall(r'"((?:[^"' + BS + BS + r']|' + BS + BS + r'.)*)"', body)
    raw = unesc(''.join(parts))
    big.append((int(off), raw))
big.sort()
print('total data bytes:', sum(len(b) for _, b in big))

print('--- long printable runs (>=100) ---')
for off, raw in big:
    for m in re.finditer(rb'[\x20-\x7e]{100,}', raw):
        s = m.group()
        print('  @%-7d len=%-5d %r' % (off + m.start(), len(s), s[:100]))

print('--- long digit/comma runs (possible VM program template) ---')
for off, raw in big:
    for m in re.finditer(rb'[0-9,\[\]{};: ]{200,}', raw):
        s = m.group()
        print('  @%-7d len=%-5d %r' % (off + m.start(), len(s), s[:140]))
