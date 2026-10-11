# 从 devirt 产物 js/service.decompiled.js 按 pc 区间抽 7 个分支（最可靠）
import re
s = open('js/service.decompiled.js', encoding='utf-8').read()

# 切出所有 case N: { ... }
cases = {}
for m in re.finditer(r'\n\s*case (\d+): \{  // instrs \d+\.\.\d+\n', s):
    pc = int(m.group(1))
    end = s.find('\n    case ', m.end())
    body = s[m.end():end if end > 0 else len(s)]
    cases[pc] = body

print('case 总数', len(cases))
RANGES = [('1022', 170, 205), ('1024', 211, 269), ('1026', 275, 369),
          ('1028', 369, 460), ('1030', 460, 514), ('1032', 514, 550), ('1034', 550, 9999)]
out = []
for mk, a, b in RANGES:
    pcs = sorted(p for p in cases if a <= p < b)
    lines = []
    for p in pcs:
        for l in cases[p].split('\n'):
            if 'typeof TRACE' in l or not l.strip():
                continue
            lines.append(l)
    body = '\n'.join(lines)
    out.append((mk, a, b, pcs, body))
    print('=' * 24, 'marker', mk, 'pc %d..%d（实际块 %s，%d 行）' % (a, b, pcs, len(lines)))
    print(body[:1400])
    print()

open('.probe/zsec/cbtg_branches_devirt.txt', 'w', encoding='utf-8').write(
    '\n\n'.join('=== %s (pc %d..%d) ===\n%s' % (mk, a, b, body) for mk, a, b, pcs, body in out))
print('已写 .probe/zsec/cbtg_branches_devirt.txt')
