import json, re, sys, os

REAL_META = '.probe/cap2/dump_1791198678168.bin.meta.json'
MINE = '.probe/vmsvc/op_full_resolved.txt'

real = json.load(open(REAL_META, encoding='utf-8'))['log']
mine = []
for ln in open(MINE, encoding='utf-8'):
    m = re.match(r'\s*(\d+)\s+op=(\d+)\s+sp=(\d+)\s+(.*)$', ln)
    if not m:
        continue
    if int(m.group(2)) > 34:
        continue
    mine.append((int(m.group(2)), int(m.group(3)), m.group(4).strip()))

print('real=%d mine=%d' % (len(real), len(mine)))
print('op 序列一致:', [e[0] for e in real] == [e[0] for e in mine])
print('sp 序列一致:', [e[1] for e in real] == [e[1] for e in mine])


def my_ops(s):
    out = []
    i, n = 0, len(s)
    while i < n:
        if s[i] == '"':
            j = i + 1
            buf = []
            while j < n:
                if s[j] == '\\' and j + 1 < n:
                    buf.append(s[j + 1]); j += 2; continue
                if s[j] == '"':
                    break
                buf.append(s[j]); j += 1
            out.append(('str', ''.join(buf)))
            i = j + 1
        elif s.startswith('S@', i):
            j = i + 2
            while j < n and s[j] != ' ':
                j += 1
            out.append(('slot', s[i:j])); i = j
        elif s[i] == ' ':
            i += 1
        elif s[i] == '-':
            out.append(('nil', '-')); i += 1
        else:
            j = i
            while j < n and s[j] != ' ':
                j += 1
            out.append(('raw', s[i:j])); i = j
    return out


TYPENAME = {71680: 'str', 71696: 'int', 71780: 'len', 71764: '?71764', 71744: '?71744', 71796: '?71796', 0: 'nil'}
diffs_int = []
diffs_type = []
for i in range(len(real)):
    r = real[i]
    ops = my_ops(mine[i][2])
    pairs = [(r[2], r[3], 0), (r[4], r[5], 1)]
    for rt, rv, k in pairs:
        mt, mv = ops[k] if len(ops) > k else ('nil', '-')
        if rt == 71696:
            if mt == 'raw' and re.fullmatch(r'-?\d+', mv):
                if int(mv) != rv:
                    diffs_int.append((i, r[0], r[1], rv, int(mv), mine[i][2][:70]))
            else:
                diffs_type.append((i, r[0], TYPENAME.get(rt, rt), rv, mt, str(mv)[:40]))
        elif rt == 0:
            if mt != 'nil':
                diffs_type.append((i, r[0], 'nil', 0, mt, str(mv)[:40]))

print('\n=== 整数操作数不一致 n=%d ===' % len(diffs_int))
for x in diffs_int[:50]:
    print('   idx=%-5d op=%-3d sp=%-4d real=%-10d mine=%-10d   %s' % x)

print('\n=== 类型不一致 n=%d（前 40）===' % len(diffs_type))
for x in diffs_type[:40]:
    print('   idx=%-5d op=%-3d real=%s(%s) mine=%s(%s)' % x)
