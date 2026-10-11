import io, re
s = io.open('.probe/wt/zse.decompiled.js', encoding='utf-8').read()
i = s.find('function runtime_alloc(')
j = s.find('\nfunction ', i + 10)
lines = s[i:j].split('\n')
depth = 0
for n, l in enumerate(lines, start=1):
    d0 = depth
    for ch in l:
        if ch == '{': depth += 1
        elif ch == '}': depth -= 1
    t = l.strip()
    if re.search(r'(\$B\d+: \{|\$L\d+: while|break \$B\d+;|continue \$L\d+;|runtime_growHeap|memFill|return )', t):
        print('%3d d%d %s' % (n, d0, t[:110]))