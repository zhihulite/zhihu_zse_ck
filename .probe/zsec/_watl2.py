import io
lines = io.open('.probe/wt/zse.wat', encoding='utf-8').read().split('\n')
print('runtime.alloc 体内 (359..722) 所有 l2 的写:')
for n in range(358, 722):
    t = lines[n].strip()
    if 'local.set $l2' in t or 'local.tee $l2' in t:
        print('  %d %s' % (n + 1, t))
print()
print('体内所有含 l2 的行:')
for n in range(358, 722):
    t = lines[n].strip()
    if '$l2' in t:
        print('  %d %s' % (n + 1, t))