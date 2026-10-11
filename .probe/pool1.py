import glob, os
TOK = [b'function', b'return', b'length', b'toString', b'indexOf', b'window', b'document',
       b'undefined', b'prototype', b'constructor', b'charCodeAt', b'fromCharCode', b'String',
       b'Object', b'__proto__', b'eval', b'BigInt', b'DataView', b'Reflect', b'ck', b'__g',
       b'setUint8', b'setInt32', b'encode', b'decode', b'apply', b'set', b'get', b'true', b'zh']
def entries(pool):
    out = []
    i = 0
    while i + 2 <= len(pool):
        n = int.from_bytes(pool[i:i+2], 'big')
        if i + 2 + n > len(pool):
            break
        out.append(pool[i+2:i+2+n])
        i += 2 + n
    return out, i
for f in sorted(glob.glob('.probe/ldr_*.bin')):
    d = open(f, 'rb').read()
    hdr = int.from_bytes(d[:4], 'big')
    pool = d[4+hdr:]
    es, used = entries(pool)
    print(os.path.basename(f), 'pool', len(pool), 'entries', len(es), 'used', used, 'leftover', len(pool)-used)
    print('   lengths:', [len(e) for e in es][:24])
    # single-byte xor brute force
    best = []
    for k in range(256):
        blob = b''.join(bytes(c ^ k for c in e) for e in es)
        sc = sum(blob.count(t) for t in TOK)
        pr = sum(1 for x in blob if 32 <= x < 127) / max(1, len(blob))
        best.append((sc, pr, k))
    best.sort(reverse=True)
    print('   top keys (tokhits, printable, key):', best[:5])
    k = best[0][2]
    print('   sample entries with key %d:' % k)
    for e in es[:12]:
        print('      ', repr(bytes(c ^ k for c in e)))