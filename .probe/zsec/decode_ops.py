import json, re, sys

ops = json.load(open('.probe/zsec/handenv_out.json', encoding='utf-8'))['ops']

table = {}
for line in open('BVM_OPCODE_TABLE.txt', encoding='utf-8', errors='replace'):
    m = re.match(r'\s*(\d+)\s+(.*)$', line)
    if m:
        table[int(m.group(1))] = m.group(2).strip()

print('ops', len(ops), 'table', len(table))


def sem(w):
    return table.get(w, '?')


# 折叠连续重复的 (pc,word) 循环
seq = [(o['pc'], o['word']) for o in ops]
runs = []
i = 0
while i < len(seq):
    j = i
    # 检测 3~8 长的循环体
    found = None
    for L in range(2, 9):
        if i + 2 * L <= len(seq) and seq[i:i + L] == seq[i + L:i + 2 * L]:
            k = i + L
            while k + L <= len(seq) and seq[k:k + L] == seq[i:i + L]:
                k += L
            found = (L, k)
            break
    if found:
        L, k = found
        runs.append(('LOOP', i, k, (k - i) // L, seq[i:i + L]))
        i = k
    else:
        runs.append(('OP', i, i + 1, 1, [seq[i]]))
        i += 1

print('runs', len(runs))
for r in runs[:200]:
    kind, a, b, n, body = r
    if kind == 'LOOP':
        print('  [%5d..%5d] LOOP x%-5d  body=%s' % (a, b - 1, n, ' '.join('%d:%d' % t for t in body)))
        for t in body[:4]:
            print('           %-6d w=%-4d %s' % (t[0], t[1], sem(t[1])[:110]))
    else:
        pc, w = body[0]
        o = ops[a]
        print('  [%5d] pc=%-4d w=%-4d %-95s regs=%s o=%s ra=%s rb=%s idx=%s fn=%s val=%s' % (
            a, pc, w, sem(w)[:95], o.get('regs'), o.get('o'), o.get('ra'), o.get('rb'), o.get('idx'), o.get('fn'), o.get('val')))
