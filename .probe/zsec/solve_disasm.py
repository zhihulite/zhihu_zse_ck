import re, struct, collections, sys

blob = open('.probe/zsec/vmprog.bin', 'rb').read()
N = struct.unpack('>I', blob[0:4])[0]
W = blob[4:4 + N]
s = open('.probe/zsec/objdump.txt', encoding='utf-8').read()
elem = {int(m.group(1)): m.group(2) for m in re.finditer(r'elem\[(\d+)\] = ref\.func:\d+ <([^>]+)>', s)}
VALID = set(elem)

# 每个 opcode 的候选长度：先用抽出的表，再兜底 2..5
LEN_HINT = {
    56:3,5:3,18:3,3:3,70:3,89:3,81:4,10:3,100:4,63:4,
}
CANDS = {}
for op in VALID:
    h = LEN_HINT.get(op)
    c = [h] if h else []
    for k in (3, 4, 2, 5, 1):
        if k not in c: c.append(k)
    CANDS[op] = c

# 可达性：从 0 出发，哪些 pc 可达
reach = [False] * (N + 1)
reach[0] = True
order = []
for pc in range(N + 1):
    if not reach[pc]: continue
    if pc == N: break
    op = W[pc]
    if op not in VALID: continue
    for L in CANDS[op]:
        if pc + L <= N and not reach[pc + L]:
            reach[pc + L] = True
print('N =', N, ' 可达终点:', reach[N])

# 若可达，回溯找路径
if reach[N]:
    # 用 DP 记录一条路径
    nxt = {}
    for pc in range(N):
        if not reach[pc]: continue
        op = W[pc]
        if op not in VALID: continue
        for L in CANDS[op]:
            if pc + L <= N and reach[pc + L] and pc not in nxt:
                nxt[pc] = (op, L)
                break
    path = []
    pc = 0
    while pc < N:
        if pc not in nxt: print('断在 pc=', pc); break
        op, L = nxt[pc]
        path.append((pc, op, L)); pc += L
    print('指令数:', len(path))
    print('前 40 条:', ' '.join('op%d/%d' % (o, L) for _, o, L in path[:40]))
    cnt = collections.Counter(o for _, o, _ in path)
    print('opcode 分布 top15:', cnt.most_common(15))
    print('用到的 opcode 种数:', len(cnt))
    # 长度分布
    print('长度分布:', collections.Counter(L for _, _, L in path))
    open('.probe/zsec/vm_disasm.txt', 'w', encoding='utf-8').write(
        '\n'.join('%-6d op=%-4d len=%d  raw=%s' % (pc, o, L, ' '.join('%02x' % W[pc+j] for j in range(min(L+1, 6)))) for pc, o, L in path))
    print('已写 .probe/zsec/vm_disasm.txt')
else:
    # 报告最远可达
    far = max(i for i in range(N + 1) if reach[i])
    print('最远可达 pc =', far, '/', N)
    print('pc=%d 处 op=%d 是否合法: %s' % (far, W[far] if far < N else -1, W[far] in VALID if far < N else '-'))
