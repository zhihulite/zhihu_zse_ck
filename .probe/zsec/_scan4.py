import io, re
s = io.open('.probe/wt/zse.decompiled.js', encoding='utf-8').read()
fns = re.split(r'\nfunction ', s)
for f in fns:
    m = re.match(r'([\w$]+)\(', f)
    if not m: continue
    nm = m.group(1)
    for ln in f.split('\n'):
        if re.search(r'M8\[314296\]\s*=', ln):
            print('[写] %-28s %s' % (nm, ln.strip()[:120]))