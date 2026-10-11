import os

def load(p):
    return open(p, encoding='utf-8', errors='replace').read() if os.path.exists(p) else ''

zh = load('.probe/zsec/zh_full.txt')
qh = load('.probe/zsec/qh_full.txt')

KEYS = {'K_RND': 'acc7471d3eb9bc30', 'K_PAY': 'f25b8434cca9a1f5', 'K_INN': 'b53cc3fa93dc8013',
        'K_CVM1': '6a6cb1bb3970bae6', 'K_CVM2': '44ae0b7a68bf0f7a'}

def dec(ct, key, st_in):
    """plain[i] = ct[i] ^ key[i%klen] ^ ct[i-1];  ct[-1] = st_in"""
    out = []
    prev = st_in
    for i, ch in enumerate(ct):
        p = (ord(ch) ^ ord(key[i % len(key)]) ^ prev) & 0xffff
        out.append(chr(p))
        prev = ord(ch)            # 状态 = 前一个密文字符
    return ''.join(out), ord(ct[-1])

def hexish(s):
    return all(c in '0123456789abcdef' for c in s)

zp = zh.split('\u200c')
qp = qh.split('\u200e')
print('zh 段长度:', [len(p) for p in zp])
print('qh 段长度:', [len(p) for p in qp])

print('\n=== 各段 × 各 key：从 i=1 起解码（不需要进入状态），看是否纯 hex ===')
for label, parts, sep in (('zh', zp, '\u200c'), ('qh', qp, '\u200e')):
    for i, p in enumerate(parts):
        if not p or len(p) < 2:
            continue
        print('\n-- %s[%d] len=%d ct=%s' % (label, i, len(p), ' '.join('%04X' % ord(c) for c in p[:6])))
        for nm, k in KEYS.items():
            # i=1..n-1 用 ct[i-1] 当状态；i=0 用 0 占位
            s = ''.join(chr((ord(p[j]) ^ ord(k[j % len(k)]) ^ ord(p[j-1])) & 0xffff) for j in range(1, len(p)))
            tail = chr((ord(p[0]) ^ ord(k[0])) & 0xff)  # 占位
            cand = '?' + s
            if hexish(s):
                print('   %-7s -> %r  <== 纯 HEX!' % (nm, cand))
            else:
                print('   %-7s -> %r' % (nm, cand))
