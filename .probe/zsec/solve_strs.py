import re, struct, collections

blob = open('.probe/zsec/vmprog.bin', 'rb').read()
N = struct.unpack('>I', blob[0:4])[0]
W = blob[4:4 + N]
s = open('.probe/zsec/objdump.txt', encoding='utf-8').read()
elem = {int(m.group(1)): m.group(2) for m in re.finditer(r'elem\[(\d+)\] = ref\.func:\d+ <([^>]+)>', s)}
VALID = set(elem)

p = 4 + N
strs = []
while p + 2 <= len(blob):
    L = struct.unpack('>H', blob[p:p+2])[0]; p += 2
    if p + L > len(blob): break
    strs.append(blob[p:p+L]); p += L
print('串数 %d, 总字节 %d' % (len(strs), sum(len(x) for x in strs)))

LEN_HINT = {56:3,5:3,18:3,3:3,70:3,89:3,81:4,10:3,100:4,63:4}
def cands(op):
    h = LEN_HINT.get(op)
    c = [h] if h else []
    for k in (3,4,2,5,1,6,7,8):
        if k not in c: c.append(k)
    return c

def solve(buf):
    """返回 (是否走到底, 指令数, 用到的opcode集合)"""
    n = len(buf)
    reach = [False]*(n+1); reach[0] = True
    for pc in range(n+1):
        if not reach[pc] or pc == n: continue
        op = buf[pc]
        if op not in VALID: continue
        for L in cands(op):
            if pc+L <= n: reach[pc+L] = True
    if not reach[n]: return False, 0, set()
    pc = 0; cnt = 0; used = set()
    while pc < n:
        op = buf[pc]
        if op not in VALID: return False, cnt, used
        done = False
        for L in cands(op):
            if pc+L <= n and reach[pc+L]:
                pc += L; cnt += 1; used.add(op); done = True; break
        if not done: return False, cnt, used
    return pc == n, cnt, used

ok = 0
for i, st in enumerate(strs):
    good, cnt, used = solve(st)
    if good:
        ok += 1
        if ok <= 12:
            print('  串 %-3d len=%-5d 指令=%-4d opcode种数=%-3d  首字节=0x%02x' % (i, len(st), cnt, len(used), st[0]))
print('以「串=字节码」假设可走到底的: %d/%d' % (ok, len(strs)))
