import glob, os, re, json

D = '.probe/cap2'
STD = set(b'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=')

def scan_alpha(mem):
    out = []
    n = len(mem)
    i = 0
    while i + 64 <= n:
        w = mem[i:i+64]
        if all(c in STD for c in w) and len(set(w)) == 64:
            out.append((i, w.decode()))
            i += 64
        else:
            i += 1
    return out

files = sorted(glob.glob(os.path.join(D, 'dump_*.bin')))
print('%-30s %10s %s' % ('dump', 'size', 'alphabets (offset:value)'))
for f in files:
    mem = open(f, 'rb').read()
    al = scan_alpha(mem)
    # 去掉标准 base64 表
    al = [(o, s) for o, s in al if s != 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/']
    if not al:
        print('%-30s %10d  (none)' % (os.path.basename(f), len(mem)))
        continue
    # 按值去重
    uniq = {}
    for o, s in al:
        uniq.setdefault(s, []).append(o)
    for s, offs in uniq.items():
        print('%-30s %10d  %s : %s' % (os.path.basename(f), len(mem), s, offs[:4]))
