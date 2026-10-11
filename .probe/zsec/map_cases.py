import re

lines = open('.probe/wt/zse.decompiled.js', encoding='utf-8').read().split('\n')

# 收集所有函数
funcs = []
for i, l in enumerate(lines):
    if l.startswith('function '):
        funcs.append((i, l[9:l.index('(')]))
funcs.append((len(lines), '<end>'))

def body(a, b):
    return '\n'.join(lines[a:b])

MARKS = {
    'crc32': 'hash_crc32_ieeeInit',
    'b64dec': 'encoding_base64_Encoding__DecodeString',
    'split': 'strings_Split',
    'replace': 'strings_Replace',
    'concat': 'runtime_stringConcat',
    'fmt16': 'strconv_FormatInt',
    'decrypt': 'main__0oooOO',
    'callind': 'call_indirect',
    'utf8dec': 'utf8_DecodeRuneInString',
}

print('%-38s %6s %6s  %s' % ('case', 'start', 'lines', 'uses'))
rows = []
for k in range(len(funcs) - 1):
    a, name = funcs[k]
    b = funcs[k + 1][0]
    if not name.startswith('__main__0oOoOO___'):
        continue
    bd = body(a, b)
    used = [mk for mk, pat in MARKS.items() if pat in bd]
    if '253248' in bd:
        used.append("'0'pad")
    rows.append((name, a + 1, b - a, used))

for name, st, n, used in sorted(rows, key=lambda r: -r[2]):
    print('%-38s %6d %6d  %s' % (name.replace('__main__0oOoOO___', ''), st, n, ','.join(used)))
print()
print('总计 %d 个 case 函数' % len(rows))
