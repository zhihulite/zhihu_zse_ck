import io, re
s = io.open('.probe/wt/zse.decompiled.js', encoding='utf-8').read()
i = s.find('function _start_command_export(')
j = s.find('function ', i + 10)
lines = s[i:j].split('\n')
pat = re.compile(r'(\$B\d+: \{|break \$B\d+;|continue \$B\d+;|\$L\d+: while|break \$L\d+;|continue \$L\d+;)')
for n, l in enumerate(lines, start=1):
    m = pat.search(l)
    if m:
        print('  %3d %s' % (n, m.group(1)))