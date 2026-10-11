import io, re
s = io.open('.probe/wt/zse.decompiled.js', encoding='utf-8').read()
fns = re.split(r'\nfunction ', s)
for f in fns:
    m = re.match(r'([\w$]+)\(', f)
    if not m: continue
    nm = m.group(1)
    for n, ln in enumerate(f.split('\n'), start=1):
        if re.search(r'M32\[315284\]\s*=', ln):
            print('[写] %-28s L%-4d %s' % (nm, n, ln.strip()[:110]))