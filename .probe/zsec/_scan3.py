import io
s = io.open('.probe/wt/zse.decompiled.js', encoding='utf-8').read()
i = s.find('function _start_command_export(')
j = s.find('function ', i + 10)
lines = s[i:j].split('\n')
# 从第 33 行开始做花括号配平，找 if 块的结束行
depth = 0
started = False
for n in range(33, len(lines) + 1):
    ln = lines[n - 1]
    for ch in ln:
        if ch == '{':
            depth += 1; started = True
        elif ch == '}':
            depth -= 1
    if started and depth == 0:
        print('第 33 行 if 块结束于第 %d 行' % n)
        print('  收尾行内容: %r' % ln.strip()[:120])
        for k in range(n, min(n + 6, len(lines) + 1)):
            print('   %3d %s' % (k, lines[k - 1].rstrip()[:120]))
        break