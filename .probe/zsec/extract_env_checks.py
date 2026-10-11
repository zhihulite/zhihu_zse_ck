# 从 lifted 产物里抽出全部环境检测点，生成可读清单
import re, json, os

FILES = [('.probe/lift/payload.lifted.js', 'payload'),
         ('.probe/lift/inner.lifted.js', 'inner'),
         ('.probe/lift/cvm.lifted.js', 'cvm'),
         ('.probe/lift/service.lifted.js', 'service')]

out = []
for path, layer in FILES:
    s = open(path, encoding='utf-8').read()
    L = s.split('\n')
    i = 0
    while i < len(L):
        line = L[i]
        # 形态 A: t0 = <ident>;  t1 = t0?.<prop>;  … (typeof t1) … === "undefined"
        m = re.match(r'\s*t\d+ = ([A-Za-z_$][\w$]*);\s*$', line)
        if m and m.group(1) not in ('undefined', 'null', 'true', 'false'):
            blk = '\n'.join(L[i:i + 26])
            mm = re.search(r't\d+ = t\d+\?\.([\w$]+);', blk)
            if mm and 'typeof' in blk and '"undefined"' in blk:
                prop = mm.group(1)
                # 找置位
                bit = re.search(r't\d+ = (\d+);\s*\n\s*t\d+ = \(t\d+ << t\d+\);', blk)
                sh = re.search(r't\d+ = (\d+);\s*\n\s*t\d+ = (\d+);\s*\n\s*t\d+ = \(t\d+ << t\d+\);', blk)
                tgt = re.search(r'(v\d+) = t\d+;\s*\n\s*t\d+ = (v\d+);\s*\n\s*t\d+ = t\d+;\s*\n\s*t\d+ = \(t\d+ \| t\d+\);', blk)
                out.append({'layer': layer, 'line': i, 'kind': 'typeof',
                            'expr': 'typeof %s.%s === "undefined"' % (m.group(1), prop),
                            'shift': sh.group(2) if sh else None,
                            'dst': tgt.group(2) if tgt else None})
                i += 1
                continue
        # 形态 B: t0 = "<needle>"; t1 = <obj>; t2 = t1?.<prop>; t3 = t2.indexOf(t0); … === -1
        m2 = re.search(r't\d+ = "([^"]{2,60})";\s*$', line)
        if m2:
            blk = '\n'.join(L[i:i + 18])
            if 'indexOf' in blk and re.search(r'=== \(-?t\d+\)|= \(-1\)', blk.replace(' ', '')) or '(-t' in blk:
                mm = re.search(r't\d+ = ([\w$.]+);\s*\n\s*t\d+ = t\d+\?\.([\w$]+);\s*\n\s*t\d+ = t\d+\.indexOf', blk)
                if mm:
                    out.append({'layer': layer, 'line': i, 'kind': 'indexOf',
                                'expr': '%s.%s.indexOf("%s") === -1' % (mm.group(1), mm.group(2), m2.group(1)),
                                'shift': None, 'dst': None})
                    i += 1
                    continue
        # 形态 C: 直接的方法/属性探测
        m3 = re.search(r't\d+ = "([^"]{2,60})";\s*\n\s*t\d+ = (v\d+);\s*\n\s*t\d+ = t\d+\((t\d+)\);', '\n'.join(L[i:i + 4]))
        if m3 and 'createElement' in '\n'.join(L[max(0, i - 4):i]):
            out.append({'layer': layer, 'line': i, 'kind': 'createElement',
                        'expr': 'createElement("%s")' % m3.group(1), 'shift': None, 'dst': None})
        i += 1

os.makedirs('.probe/zsec', exist_ok=True)
json.dump(out, open('.probe/zsec/env_checks.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('抽出检测点:', len(out))
from collections import Counter
print('按层:', Counter(x['layer'] for x in out))
print()
for x in out[:60]:
    print('  [%-7s] L%-5d %-52s shift=%-4s dst=%s' % (x['layer'], x['line'], x['expr'][:52], x['shift'], x['dst']))
