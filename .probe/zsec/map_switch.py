import re

lines = open('.probe/wt/zse.decompiled.js', encoding='utf-8').read().split('\n')

a = next(i for i, l in enumerate(lines) if l.startswith('function __main__0oOoOO___00oooO('))
b = next(i for i in range(a + 1, len(lines)) if lines[i].startswith('function '))

# 找 $Bk: { 及其配对 }
def find_block(start):
    depth = 0
    for k in range(start, b):
        s = lines[k]
        depth += s.count('{') - s.count('}')
        if k > start and depth <= 0:
            return k
    return None

blocks = {}
for k in range(a, b):
    m = re.match(r'\s*\$B(\d+): \{', lines[k])
    if m:
        blocks[int(m.group(1))] = (k, find_block(k))

# switch 映射
sw = {}
in_sw = False
for k in range(a, b):
    if 'switch (p1)' in lines[k]:
        in_sw = True; continue
    if in_sw:
        m = re.match(r'\s*case (\d+): break \$B(\d+);', lines[k])
        if m: sw[int(m.group(1))] = int(m.group(2)); continue
        m = re.match(r'\s*default: break \$B(\d+);', lines[k])
        if m: sw['default'] = int(m.group(1)); in_sw = False

print('switch arms:', len(sw))
print()
# 实体按 $B 编号降序排列（块嵌套顺序 = 代码行序）
order = sorted([x for x in sw if isinstance(x, int)], key=lambda c: -sw[c])
starts = {}
for c in order:
    bk = sw[c]
    if bk in blocks:
        starts[c] = blocks[bk][1] + 1

print('%-6s %-5s %-9s %-9s %s' % ('case', '$B', 'body', 'lines', 'primitives'))
for idx, c in enumerate(order):
    bs = starts.get(c)
    if bs is None:
        print('case %-3d -> $B%-3d (block missing)' % (c, sw[c])); continue
    be = starts.get(order[idx + 1], b) if idx + 1 < len(order) else b
    seg = '\n'.join(lines[bs:be])
    prims = []
    for name, pat in (('crc32', 'hash_crc32_ieeeInit'), ('b64', 'DecodeString'), ('split', 'strings_Split'),
                      ('replace', 'strings_Replace'), ('concat', 'stringConcat'), ('fmt16', 'FormatInt'),
                      ('pop', '_0ooO0o'), ('next', 'stringNext'), ('fromUni', 'stringFromUnicode'),
                      ('jsGet', 'Value__Get'), ('jsCall', 'Value__Call'), ('decrypt', 'main__0oooOO'),
                      ("'0'", '253248'), ('ZWNJ', '253224'), ('LRM', '295153'), ('split4', '4 - l7')):
        if pat in seg: prims.append(name)
    print('%-6d $B%-3d %-9d %-9d %s' % (c, sw[c], bs + 1, be - bs, ','.join(prims)))
