import re, struct, collections

blob = open('.probe/zsec/vmprog.bin', 'rb').read()
N = struct.unpack('>I', blob[0:4])[0]
W = blob[4:4 + N]
s = open('.probe/zsec/objdump.txt', encoding='utf-8').read()
elem = {int(m.group(1)): m.group(2) for m in re.finditer(r'elem\[(\d+)\] = ref\.func:\d+ <([^>]+)>', s)}
VALID = set(elem)

CALL, RET = 41, 29

LEN = {op: 4 for op in VALID}
LEN[92] = 1          # _000oOO$bound: M8[p0]=0; pc+=1
LEN[41] = 2          # CALL
for op in (105, 106, 107):
    LEN.pop(op, None)

visited = set()
work = [0]
edges = []
while work:
    pc = work.pop()
    if pc in visited or pc >= N: continue
    visited.add(pc)
    op = W[pc]
    if op not in VALID:
        edges.append((pc, op, 'INVALID')); continue
    if op == RET:
        edges.append((pc, op, 'RET')); continue
    if op == CALL:
        tgt_idx = W[pc + 1] if pc + 1 < N else None
        edges.append((pc, op, 'CALL slot=%s' % tgt_idx))
        work.append(pc + 2)          # 返回点
        continue
    L = LEN.get(op, 4)
    edges.append((pc, op, L))
    work.append(pc + L)

print('可达 pc 数: %d   覆盖字节: %d / %d (%.1f%%)' % (len(visited), len(visited) * 4, N, 100.0 * len(visited) * 4 / N))
cnt = collections.Counter(o for _, o, _ in edges if isinstance(_, int))
print('指令数:', len(edges))
print('opcode 分布 top12:', collections.Counter(o for _, o, _ in edges).most_common(12))
inv = collections.Counter(o for _, o, _ in edges if o not in VALID)
print('无效 opcode 出现:', inv)
print()
print('前 50 条边:')
for pc, op, info in edges[:50]:
    print('  pc=%-6d op=%-4d %s' % (pc, op, info))
open('.probe/zsec/vm_cfg.txt', 'w', encoding='utf-8').write(
    '\n'.join('pc=%-6d op=%-4d %s' % e for e in edges))
print('已写 .probe/zsec/vm_cfg.txt')
