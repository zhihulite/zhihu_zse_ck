# 按「检测对象」归并，生成干净的环境检测清单
import json, re
from collections import OrderedDict

raw = json.load(open('.probe/zsec/env_checks.json', encoding='utf-8'))


def norm(expr):
    """把 SSA 变量名归一：typeof <x>.<p> -> typeof <p>；<x>.<p>.indexOf("s") -> <p>.indexOf("s")"""
    m = re.match(r'typeof [\w$.]+\.([\w$]+) === "undefined"', expr)
    if m:
        return 'typeof <obj>.%s === "undefined"' % m.group(1)
    m = re.match(r'[\w$.]+\.([\w$]+)\.indexOf\("([^"]+)"\) === -1', expr)
    if m:
        return '<obj>.%s.indexOf("%s") === -1' % (m.group(1), m.group(2))
    m = re.match(r'([\w$.]+)\.indexOf\("([^"]+)"\) === -1', expr)
    if m:
        return '<obj>.indexOf("%s") === -1' % m.group(2)
    return expr


groups = OrderedDict()
for x in raw:
    k = (x['layer'], norm(x['expr']))
    if k not in groups:
        groups[k] = {'layer': x['layer'], 'expr': norm(x['expr']),
                     'shifts': set(), 'raw': x['expr']}
    if x['shift'] and x['dst']:
        groups[k]['shifts'].add('%s|=1<<%s' % (x['dst'], x['shift']))

items = list(groups.values())
L = ['# 环境检测全清单（从四层 lifted 产物抽出，按检测对象归并）', '',
     '> 生成自 `.probe/lift/*.lifted.js`（2026-10-07），脚本 `.probe/zsec/gen_env_doc.py`。',
     '> 置位列是 payload 层内部的位累加（`dst |= 1 << shift`）；',
     '> 这些位随后经内层/外层的 nibble 链进入 record93 的 word8/word9。', '']
for layer in ('payload', 'inner', 'cvm', 'service'):
    sub = [x for x in items if x['layer'] == layer]
    if not sub:
        continue
    L += ['## %s 层（%d 条）' % (layer, len(sub)), '', '| 检测 | 置位 |', '|---|---|']
    for x in sub:
        bit = ', '.join(sorted(x['shifts'])) if x['shifts'] else '—'
        L.append('| `%s` | %s |' % (x['expr'], ('`%s`' % bit) if bit else '—'))
    L.append('')

L += ['## 汇总', '', '- 归并后检测点：**%d**（原始扫描 %d 条）' % (len(items), len(raw))]
for layer in ('payload', 'inner', 'cvm', 'service'):
    n = len([x for x in items if x['layer'] == layer])
    if n:
        L.append('- %s 层：%d 条' % (layer, n))
open('docs/ENV_DETECTION.md', 'w', encoding='utf-8').write('\n'.join(L))
print('docs/ENV_DETECTION.md 已写：%d 条' % len(items))
for layer in ('payload', 'inner', 'cvm'):
    print('  %s: %d' % (layer, len([x for x in items if x['layer'] == layer])))
