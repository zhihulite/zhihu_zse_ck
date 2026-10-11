import io, re
s = io.open('.probe/wt/zse.decompiled.js', encoding='utf-8').read()
fns = re.split(r'\nfunction ', s)
for f in fns:
    m = re.match(r'([\w$]+)\(', f)
    if not m: continue
    nm = m.group(1)
    for n, ln in enumerate(f.split('\n'), start=1):
        if '314296' in ln:
            print('%-30s L%-4d %s' % (nm, n, ln.strip()[:130]))