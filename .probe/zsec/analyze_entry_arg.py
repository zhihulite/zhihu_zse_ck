import base64, json, re

b64 = open('.probe/zsec/entry_arg.txt', encoding='utf-8').read()
print('b64 len', len(b64))
raw = base64.b64decode(b64)
print('decoded bytes', len(raw))
print('first 64 bytes:', raw[:64])
print('hex head:', raw[:32].hex())

# 可打印比例
pr = sum(1 for c in raw if 32 <= c < 127)
print('printable ratio: %.3f (%d/%d)' % (pr / len(raw), pr, len(raw)))

# 按 3 字节分组 → 24bit
words = [raw[i] << 16 | raw[i + 1] << 8 | raw[i + 2] for i in range(0, len(raw) - 2, 3)]
print('24bit words:', len(words))
print('first 24 words:', words[:24])

# 试着当 utf-8 文本
try:
    t = raw.decode('utf-8')
    print('utf-8 OK, len', len(t))
    print('text head 300:', repr(t[:300]))
except Exception as e:
    print('utf-8 fail:', e)

# 找可打印的连续片段
runs = re.findall(rb'[\x20-\x7e]{8,}', raw)
print('printable runs >=8:', len(runs))
for r in runs[:25]:
    print('   ', r[:100])
