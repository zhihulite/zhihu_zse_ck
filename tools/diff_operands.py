import json, struct, re, sys

META = '.probe/cap2/dump_1791198678168.bin.meta.json'
BIN = '.probe/cap2/dump_1791198678168.bin'
MINE = '.probe/vmsvc/op_full_resolved.txt'

real = json.load(open(META, encoding='utf-8'))['log']
mem = open(BIN, 'rb').read()
print('dump size =', len(mem), ' real trace n =', len(real))


def u32(a):
    if a + 4 > len(mem):
        return None
    return struct.unpack_from('<I', mem, a)[0]


def go_str(ptr, maxlen=200000):
    """Go string header at ptr: (dataPtr, len)."""
    dp = u32(ptr)
    ln = u32(ptr + 4)
    if dp is None or ln is None:
        return None
    if ln > maxlen or dp + ln > len(mem):
        return None
    return mem[dp:dp + ln]


TYPENAME = {71680: 'str', 71696: 'int', 71780: 'len', 71764: 'b', 71744: '?', 71796: '?'}

# 打印真机前 20 条解析结果
print('\n=== 真机前 20 条解析 ===')
for i in range(20):
    e = real[i]
    parts = []
    for k, (t, v) in enumerate(((e[2], e[3]), (e[4], e[5]))):
        if t == 71680:
            s = go_str(v)
            parts.append('str=%r' % (s[:60] if s is not None else None))
        elif t == 0:
            parts.append('nil')
        else:
            parts.append('%s=%s' % (TYPENAME.get(t, t), v))
    print('  [%2d] op=%-3d sp=%-4d %s' % (i, e[0], e[1], '  |  '.join(parts)))

# 本地操作数
mine = []
for ln in open(MINE, encoding='utf-8'):
    m = re.match(r'\s*(\d+)\s+op=(\d+)\s+sp=(\d+)\s+(.*)$', ln)
    if not m:
        continue
    if int(m.group(2)) > 34:
        continue
    mine.append((int(m.group(2)), int(m.group(3)), m.group(4).strip()))


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


print('\n=== 逐条对拍字符串操作数，找第一处内容分叉 ===')
diverge = []
for i in range(min(len(real), len(mine))):
    e = real[i]
    ops = my_ops(mine[i][2])
    for k, (t, v) in enumerate(((e[2], e[3]), (e[4], e[5]))):
        if t != 71680:
            continue
        rs = go_str(v)
        mt, mv = ops[k] if len(ops) > k else ('nil', '-')
        if rs is None:
            continue
        rtxt = rs.decode('utf-8', 'replace')
        if mt == 'str':
            if rtxt != mv:
                diverge.append((i, k, rtxt, mv, mine[i][2][:70]))
        elif mt == 'slot':
            # 本地渲染成槽地址，无法直接比；跳过
            pass
print('字符串内容不一致处 n=%d' % len(diverge))
for d in diverge[:25]:
    print('  idx=%-5d arg%d\n     真机=%r\n     本地=%r\n     line=%s' % (d[0], d[1], d[2][:110], d[3][:110], d[4]))
