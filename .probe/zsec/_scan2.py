import io, re
s = io.open('.probe/wt/zse.decompiled.js', encoding='utf-8').read()
i = s.find('function _start_command_export(')
j = s.find('function ', i + 10)
lines = s[i:j].split('\n')
for n, l in enumerate(lines, start=1):
    if re.search(r'\bl13\b', l):
        print('  %3d %s' % (n, l.strip()[:140]))