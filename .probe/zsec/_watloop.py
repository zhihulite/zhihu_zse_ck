import io, re
lines = io.open('.probe/wt/zse.wat', encoding='utf-8').read().split('\n')
start = None
for n, l in enumerate(lines):
    if l.strip().startswith('(func $runtime.alloc'):
        start = n; break
print('runtime.alloc 起始行:', start + 1)
depth = 0; opens = []
for n in range(start, len(lines)):
    t = lines[n].strip()
    m = re.match(r'(block|loop|if)\s+(\$[\w]+)', t)
    if m:
        depth += 1; opens.append((n + 1, m.group(1), m.group(2)))
    elif t == 'end':
        if opens:
            ln, kind, lab = opens.pop()
            if lab == '$L1':
                print('$L1 的匹配 end 在 WAT 行 %d（loop 起始行 %d）' % (n + 1, ln))
                print('  回边末尾前 20 行:')
                for k in range(max(0, n - 20), n):
                    print('    %d %s' % (k + 1, lines[k].strip()[:100]))
                print('  end 之后 6 行:')
                for k in range(n, min(n + 6, len(lines))):
                    print('    %d %s' % (k + 1, lines[k].strip()[:100]))
                break