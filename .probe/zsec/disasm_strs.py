import re, struct, collections

blob = open('.probe/zsec/vmprog.bin', 'rb').read()
N = struct.unpack('>I', blob[0:4])[0]
W = blob[4:4 + N]
s = open('.probe/zsec/objdump.txt', encoding='utf-8').read()
elem = {int(m.group(1)): m.group(2) for m in re.finditer(r'elem\[(\d+)\] = ref\.func:\d+ <([^>]+)>', s)}
VALID = set(elem)
CALL, RET = 41, 29
LEN = {op: 4 for op in VALID}
LEN[92] = 1; LEN[41] = 2

# 取串块
p = 4 + N
strs = []
while p + 2 <= len(blob):
    L = struct.unpack('>H', blob[p:p+2])[0]; p += 2
    if p + L > len(blob): break
    strs.append(blob[p:p+L]); p += L
print('串块 %d 个, 总 %d 字节' % (len(strs), sum(len(x) for x in strs)))

def dis(buf, start=0):
    pc, out = start, []
    while pc < len(buf):
        op = buf[pc]
        if op not in VALID: return out, pc, 'BAD op=%d' % op
        if op == RET: out.append((pc, op, 'RET')); return out, pc, None
        if op == CALL:
            out.append((pc, op, 'CALL slot=%d' % (buf[pc+1] if pc+1 < len(buf) else -1)))
            pc += 2; continue
        L = LEN.get(op, 4)
        out.append((pc, op, L)); pc += L
    return out, pc, None

okc = 0
tot_ins = 0
ops_all = collections.Counter()
samples = []
for i, st in enumerate(strs):
    out, pc, err = dis(st)
    if err is None and pc == len(st):
        okc += 1; tot_ins += len(out)
        for _, o, _ in out: ops_all[o] += 1
        if len(samples) < 8: samples.append((i, len(st), out))
print('完整解出的串块: %d/%d   指令总数: %d' % (okc, len(strs), tot_ins))
print('opcode 分布:', ops_all.most_common(15))
print()
for i, ln, out in samples:
    print('串 %-3d len=%-4d %s' % (i, ln, ' '.join('op%d' % o for _, o, _ in out)))
