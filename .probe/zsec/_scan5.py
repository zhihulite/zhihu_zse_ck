import io
s = io.open('.probe/wt/zse.decompiled.js', encoding='utf-8').read()
i = s.find('function _start_command_export(')
j = s.find('function ', i + 10)
lines = s[i:j].split('\n')
depth = 0
for n in range(1, len(lines) + 1):
    ln = lines[n - 1]
    d0 = depth
    for ch in ln:
        if ch == '{': depth += 1
        elif ch == '}': depth -= 1
    if n <= 40 or n >= 355 or (d0 != depth and 250 <= n <= 365):
        print('%3d d%d->%d %s' % (n, d0, depth, ln.strip()[:110]))