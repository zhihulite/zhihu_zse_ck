import sys, os, json, glob
sys.path.insert(0, os.path.abspath('.'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'py'))
from zse_ck_tool import extract, generate_token

D = '.probe/cap2'
# 取 profile#2（env MD5 = 77028ee7...，与当前 camoufox 环境一致）
mt = os.path.join(D, 'dump_1791202329789.bin.meta.json')
p = extract(mt, mt.replace('.meta.json', ''))
assert generate_token(p, p['rec93']) == p['token'], 'selfcheck failed'
print('profile#2 selfcheck OK, env md5 =', p['rec93'][48:80])

# 当前会话捕获的两个 token
toks = {
    'Erk3': open('.probe/zsec/blobs/g_ck.txt').read().strip(),
}
# 第二个 token 从 __G2 原始记录里取
import re
raw = open('.probe/zsec/g_raw.json', encoding='utf8').read()
for m in re.finditer(r'005_[A-Za-z0-9+/=]{128}', raw):
    toks['G2_' + m.group()[4:8]] = m.group()

# 也扫一下 state_capture.json 里的 cookie
st = open('.probe/zsec/state_capture.json', encoding='utf8').read()
for m in re.finditer(r'005_[A-Za-z0-9+/=]{128}', st):
    toks['state_' + m.group()[4:8]] = m.group()

print('candidate tokens:', len(toks))
for name, t in toks.items():
    r = p
    # 手动解密
    from zse_ck_tool import _load_sbox, encrypt_block, encrypt_96, _circ
    pot = _load_sbox(); sbox = [0]*256
    for v, pp in enumerate(pot): sbox[pp] = v
    # radix64 解码
    seq = [0]*96
    payload = t[4:]
    inv = {c: i for i, c in enumerate(r['alphabet'])}
    ok_alpha = all(c in inv for c in payload)
    if not ok_alpha:
        print('%s  alphabet miss: %s' % (name, sorted(set(payload) - set(inv)))); continue
    for g in range(32):
        base = (0, 24, 16, 8)[g % 4]
        v = 0
        for k in range(4):
            s = (base + 6*k) % 32
            q = inv[payload[g*4+k]]
            v |= ((q << s) | (q >> ((32 - s) % 32))) & 0xffffffff
        v ^= r['xreg']
        for j in range(3):
            o = (base + 8*j) % 32
            seq[g*3+j] = ((v >> o) | (v << ((32 - o) % 32))) & 0xff
    ct = bytes(seq[::-1])
    # CBC 解密
    prev = bytes(r['iv'], 'latin1'); pt = b''
    for b in range(6):
        c = ct[16*b:16*b+16]
        # decrypt_block 反推
        X = [0]*36
        X[35] = int.from_bytes(c[0:4], 'big'); X[34] = int.from_bytes(c[4:8], 'big')
        X[33] = int.from_bytes(c[8:12], 'big'); X[32] = int.from_bytes(c[12:16], 'big')
        from zse_ck_tool import _L
        for i in range(31, -1, -1):
            w = X[i+1] ^ X[i+2] ^ X[i+3] ^ r['rk'][i]
            a = int.from_bytes(bytes(sbox[bb] for bb in w.to_bytes(4, 'big')), 'big')
            X[i] = X[i+4] ^ _L(a)
        blk = b''.join(X[i].to_bytes(4, 'big') for i in range(4))
        pt += bytes(x ^ y ^ r['mask'] for x, y in zip(blk, prev))
        prev = c
    print('%s  pad=%s  pt[0:48]=%r' % (name, list(pt[93:96]), pt[0:48].decode('latin1')))
