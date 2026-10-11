# tools/gen_detection_js.py —— 由 AST 提取结果生成「还原后的位图检测 JS」
# 输入：.probe/zsec/bitmap_{payload,inner,cvm}.json（tools/bitmap_ast.js 产出）
# 输出：js/bitmap_detection.restored.js
import json, os, re

LAYERS = [
    ('payload', 'payload.cvm.js',   {'v3': 'w1', 'v4': 'w2', 'v5': 'w3', 'v6': 'w4'}),
    ('inner',   'inner.decompiled.js', {'v3': 'w5', 'v4': 'w6'}),
    ('cvm',     'cvm.decompiled.js',   {'v7': 'w10', 'v8': 'w11'}),
]

def clean(s):
    s = re.sub(r'if \(typeof TRACE === "function"\) TRACE\([^)]*\);', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

out = []
out.append('// js/bitmap_detection.restored.js —— 位图检测逻辑还原件（AST 静态提取，非穷举）')
out.append('//')
out.append('// 生成：node tools/bitmap_ast.js .probe/lift/<层>.lifted.js --json ...  →  python tools/gen_detection_js.py')
out.append('// 每个 `vN` 是该层的一个 16 位累加字，初值见 DETECT_INIT；每个 `bit k` 由一条守卫命中后置位。')
out.append('// 字→位图位置映射见 docs/BITMAP.md（w1-w4←payload、w5-w6←inner、w10-w11←cvm）。')
out.append('"use strict";')
out.append('')

init_map = {
    'payload': {'v3': '1<<13 (0x2000)', 'v4': '1<<12 (0x1000)', 'v5': '1<<15 (0x8000)', 'v6': '1<<14 (0x4000)'},
    'inner':   {'v3': '1<<15 (0x8000)', 'v4': '1<<14 (0x4000)'},
    'cvm':     {'v7': '1<<15 (0x8000)', 'v8': '1<<14 (0x4000)', 'v9': '1<<13 (0x2000, 位掩码常量)', 'v10': '1<<12 (0x1000, 位掩码常量)'},
}
out.append('const DETECT_INIT = ' + json.dumps(init_map, ensure_ascii=False, indent=2) + ';')
out.append('')
out.append('const DETECT = {};')
out.append('')

stats = {}
for layer, srcfile, wmap in LAYERS:
    p = '.probe/zsec/bitmap_%s.json' % layer
    if not os.path.exists(p):
        continue
    d = json.load(open(p, encoding='utf-8'))
    sites = {}
    for s in d['sites']:
        if s.get('bit') is None:
            continue
        sites.setdefault(s['var'], []).append(s)
    out.append('// ' + '=' * 74)
    out.append('// 层 %s  （源：%s）' % (layer, srcfile))
    out.append('// ' + '=' * 74)
    for var in sorted(sites, key=lambda x: int(x[1:])):
        tag = wmap.get(var, '')
        out.append('// ---- %s %s ----' % (var, ('→ 位图 %s' % tag) if tag else ''))
        for s in sites[var]:
            bits = ('1<<%s' % s['bit']) if s['bit'] is not None else '?'
            guards = s.get('guardPath') or []
            g = ' && '.join(x for x in guards) if guards else '(无条件)'
            g = clean(g)
            out.append('//   bit%-3s %-6s L%-6s  守卫: %s' % (s['bit'], '|=' if s['op'] != 'assign' else '=', s['line'], g[:170]))
        stats[(layer, var)] = len(sites[var])
    out.append('DETECT[%r] = { /* 见上方注释：每个字的置位点与守卫 */ };' % layer)
    out.append('')

out.append('// ' + '=' * 74)
out.append('// 各层汇编器（把 4/2/2 个累加字拼成 hex 串）')
out.append('// ' + '=' * 74)
for layer, srcfile, wmap in LAYERS:
    p = '.probe/zsec/bitmap_%s.json' % layer
    if not os.path.exists(p):
        continue
    d = json.load(open(p, encoding='utf-8'))
    asm = [a for a in d['assembler'] if a['radix'] == 16]
    hc = d['hexcat']
    if asm:
        out.append('// %-8s 汇编器: %s' % (layer, ', '.join('%s.toString(16)' % a['from'] for a in asm)))
    for h in hc:
        out.append('// %-8s 拼接:   %s = %s' % (layer, h['into'], ' + '.join(h['parts'])))
out.append('')
out.append('module.exports = { DETECT, DETECT_INIT };')

open('js/bitmap_detection.restored.js', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('已写 js/bitmap_detection.restored.js  %d 行' % len(out))
for k, v in sorted(stats.items()):
    print('   %-8s %-4s %d 个置位点' % (k[0], k[1], v))
