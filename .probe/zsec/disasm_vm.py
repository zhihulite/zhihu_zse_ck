import struct, sys, collections

blob = open('.probe/zsec/vmprog.bin', 'rb').read()
N = struct.unpack('>I', blob[0:4])[0]
print('blob %d bytes; BE32 header = %d words' % (len(blob), N))
words = list(blob[4:4 + N])
print('words: %d, 首 24: %s' % (len(words), ' '.join('%02x' % w for w in words[:24])))

# 串表：从 4+N 开始，BE16 长度前缀
p = 4 + N
strs = []
while p + 2 <= len(blob):
    L = struct.unpack('>H', blob[p:p+2])[0]
    p += 2
    if p + L > len(blob):
        print('串表尾部不完整: 剩余 %d 字节' % (len(blob) - p)); break
    strs.append(blob[p:p+L].decode('utf8', 'replace'))
    p += L
print('串表: %d 条, 尾部剩余 %d 字节' % (len(strs), len(blob) - p))
print('  串样本:', [s[:24] for s in strs[:8]])

# 指令：4 word 一条
print()
print('=== 反汇编（前 60 条）===')
ops = collections.Counter()
n_ins = N // 4
for i in range(n_ins):
    op = words[4*i]
    a, b, c = words[4*i+1], words[4*i+2], words[4*i+3]
    ops[op] += 1
    if i < 60:
        print('%4d  op=%-3d  0x%02x   %02x %02x %02x' % (i, op, op, a, b, c))
print()
print('opcode 分布 (top 20):', ops.most_common(20))
print('总指令数 %d, 用到 %d 种 opcode, 超范围 opcode: %s' %
      (n_ins, len(ops), sorted(o for o in ops if o > 34)))
