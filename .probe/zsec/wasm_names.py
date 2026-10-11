import sys, struct, json

def uleb(b, i):
    r = 0; s = 0
    while True:
        x = b[i]; i += 1
        r |= (x & 0x7f) << s
        if not (x & 0x80): return r, i
        s += 7

def name_section(path):
    d = open(path, 'rb').read()
    i = 8
    names = []
    while i < len(d):
        sid = d[i]; i += 1
        sz, i = uleb(d, i)
        if sid == 0:  # custom
            j = i
            nlen, j = uleb(d, j)
            nm = d[j:j+nlen].decode('latin1'); j += nlen
            if nm == 'name':
                # subsections
                end = i + sz
                while j < end:
                    sub = d[j]; j += 1
                    ssz, j = uleb(d, j)
                    sub_end = j + ssz
                    if sub == 1:  # function names
                        cnt, k = uleb(d, j)
                        for _ in range(cnt):
                            idx, k = uleb(d, k)
                            l, k = uleb(d, k)
                            names.append((idx, d[k:k+l].decode('utf8', 'replace'))); k += l
                    j = sub_end
                return names
        i += sz
    return names

for p in sys.argv[1:]:
    ns = name_section(p)
    print('=== %s : %d names' % (p, len(ns)))
    main_ = [n for _, n in ns if n.startswith('main.') or n.startswith('(*main.')]
    print('   main.* :', len(main_))
    for _, n in ns:
        if any(k in n for k in ('crc32', 'base64', 'strings.', 'Split', 'Replace', 'Join', 'crypto', 'sm4', 'aes')):
            print('    *', n)
    if len(ns) and len(ns) < 40:
        for i, n in ns: print('      %4d %s' % (i, n))
    json.dump([n for _, n in ns], open(p.split('/')[-1] + '.names.json', 'w'), ensure_ascii=False, indent=0)
