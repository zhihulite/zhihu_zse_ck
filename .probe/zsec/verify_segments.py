# 正演验证：用还原出的链式 XOR 编码器把解出的明文重新编码，必须逐字符复现密文
import json

d = json.loads(open('.probe/live-wobjs.json', encoding='utf-8', errors='replace').read())
if isinstance(d, str):
    d = json.loads(d)
w = d['wobjs']
segs = w['__b']['zh'].split('\u200c')
qs = w['__c']['qh'].split('\u200e')


def enc(pt, key, seed):
    """out_i = pt_i ^ key_{i%nk} ^ out_{i-1}"""
    out = []
    prev = seed
    for i, ch in enumerate(pt):
        v = ((ord(ch) & 0xFF) ^ ord(key[i % len(key)]) ^ prev) & 0xFF
        out.append(v)
        prev = v
    return ''.join(chr(v) for v in out)


CASES = [
    # (名称, 密文, 明文, 密钥, seed)
    ('zh[0]', segs[0], 'f71829dce4784', 'acc7471d3eb9bc30', 41),
    ('zh[3]', segs[3], '80008000', 'b53cc3fa93dc8013', 36),
    ('qh[0]', qs[0], 'e0004000', '6a6cb1bb3970bae6', 41),
    ('qh[1]', qs[1], '6713b41072b8449e792f748225172a79', '44ae0b7a68bf0f7a', 41),
    ('zh[1]', segs[1], 'c000100080004000', 'f25b8434cca9a1f5', 41),
]

ok = 0
for name, ct, pt, key, seed in CASES:
    got = enc(pt, key, seed)
    good = (got == ct)
    ok += good
    print('%-6s pt=%-34s key=%-18s seed=%-4d 复现=%s' % (name, pt, key, seed, '✅ 逐字符相同' if good else '❌ 不一致'))
    if not good:
        print('        期望 %r' % ct)
        print('        实得 %r' % got)

print()
print('正演验证: %d/%d 通过' % (ok, len(CASES)))

# 额外：zh[1] 的 seed 是唯一能把首字符变成合法 hex 的那个吗？
print()
print('=== zh[1] 首字符随 seed 的取值（key=f25b8434cca9a1f5）===')
k = 'f25b8434cca9a1f5'
body = ''.join(chr((ord(segs[1][i]) ^ ord(segs[1][i - 1]) ^ ord(k[i % len(k)])) & 0xFF) for i in range(1, len(segs[1])))
for s in range(256):
    c0 = chr((ord(segs[1][0]) ^ s ^ ord(k[0])) & 0xFF)
    pt = c0 + body
    if all(ch in '0123456789abcdefABCDEF' for ch in pt):
        print('   seed=%-4d -> %r' % (s, pt))
