import re, json

for f, tag in (('.probe/zsec/eval_136041.deob.js', 'eval-83 (136041)'),
               ('.probe/zsec/eval_62501.deob.js', 'eval (62501)')):
    s = open(f, encoding='utf-8').read()
    strs = sorted(set(re.findall(r'"([^"]{2,60})"', s)))
    strs = [x for x in strs if not x.startswith('_0x')]
    print('=== %s  len=%d  可读串 %d 种' % (tag, len(s), len(strs)))
    print('    ', strs[:26])
    print('    头部:', repr(s[:200]))
    print()
