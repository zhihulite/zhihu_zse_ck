import io, re
lines = io.open('.probe/wt/zse.wat', encoding='utf-8').read().split('\n')
# _start 从 36126 行开始
start = 36125
depth = 0
opens = []
for n in range(start, len(lines)):
    t = lines[n].strip()
    m = re.match(r'(block|loop|if)\s+(\$[\w]+)', t)
    if m:
        depth += 1
        opens.append((n + 1, m.group(1), m.group(2), depth))
        if m.group(2) == '$I4':
            print('找到 $I4 于 WAT 行 %d，嵌套深度 %d' % (n + 1, depth))
    elif t == 'end':
        if opens:
            ln, kind, lab, d = opens.pop()
            if lab == '$I4':
                print('  $I4 的匹配 end 在 WAT 行 %d' % (n + 1))
                print('  end 之后 6 行:')
                for k in range(n + 1, min(n + 7, len(lines))):
                    print('     %d %s' % (k + 1, lines[k].strip()[:100]))
                break
        depth -= 1