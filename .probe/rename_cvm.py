import re, sys

SRC = 'zse_ck_cvm.runnable.js'
DST = 'zse_ck_cvm.deob.js'

M = {
    # ---- string pool / decoder ----
    '_0x5836': 'getStringArray', '_0x2c3262': 'stringArray', '_0x4811': 'decodeStr',
    '_0x58367b': 'poolArr', '_0x4811c5': 'index', '_0x3e1bd0': 'keyArg', '_0x47a53e': 'str',
    '_0x334336': 'arrFn', '_0x249ad5': 'expectedChecksum', '_0x290b9f': 'decAlias',
    '_0x3793e4': 'arr', '_0x3ba8e2': 'dec0',
    # ---- self-defense / console patch ----
    '_0x3a47ec': 'onceFn', '_0x3fe757': 'firstCall', '_0x28ee7c': 'ctx', '_0x5df52e': 'fn',
    '_0x31c6ed': 'wrapper', '_0x298318': 'decB', '_0x4612f1': 'result', '_0x2d5c28': 'antiDebug',
    '_0x46e767': 'decC', '_0x364712': 'onceFn2', '_0x4b238a': 'firstCall2', '_0x8f9370': 'ctx2',
    '_0x39fdf5': 'fn2', '_0x383afd': 'wrapper2', '_0x193848': 'decD', '_0x1d9945': 'result2',
    '_0x37560c': 'antiDebug2', '_0x13f606': 'decE', '_0x873baa': 'getGlobal', '_0x13b482': 'decF',
    '_0x3a1cc1': 'globalObj', '_0x201c36': 'e1', '_0x866de8': 'globalObj2', '_0x4af45a': 'consoleObj',
    '_0x5141f6': 'consoleMethods', '_0x44770c': 'ci', '_0x17c29d': 'methodName',
    '_0x4502b2': 'origFn', '_0x166c42': 'decG', '_0x2a5cf3': 'decH', '_0x19a6d4': 'e',
    # ---- interpreter locals ----
    '_0x5eb7cf': 'idx', '_0x25dc0d': 'evalParts', '_0x523fe8': 'words', '_0x40a1ef': 'cnt',
    '_0x1038bf': 'srcVal', '_0xbad610': 'tmpVal', '_0x52eba9': 'packed', '_0x342339': 'callRes',
    '_0x194c44': 'arr3', '_0x5c3a1a': 'arg1', '_0x2a4590': 'elem', '_0x2107fc': 'counter',
    '_0x17eea9': 'flag', '_0x3c8f15': 'ts', '_0x28ea16': 'limit', '_0x42e4c2': 'arg2',
    '_0x7b50cf': 'val3', '_0x260379': 'stackArr', '_0x404520': 'popVal', '_0x2179d2': 'method',
    '_0xd40585': 'joined', '_0x167492': 'tblIdx', '_0x316fb4': 'seed', '_0x49daa3': 'child',
    '_0x48503c': 'stackCopy', '_0x3701f7': 'outer', '_0xf5b16e': 'key2',
}

s = open(SRC, encoding='utf8').read()
missing = sorted(set(re.findall(r'_0x[0-9a-fA-F]+', s)) - set(M))
if missing:
    print("UNMAPPED:", missing)
    sys.exit(1)
news = list(M.values())
dups = {n for n in news if news.count(n) > 1}
if dups:
    print("DUP NEW NAMES:", dups)
    sys.exit(1)
out = re.sub(r'_0x[0-9a-fA-F]+', lambda m: M.get(m.group(0), m.group(0)), s)
open(DST, 'w', encoding='utf8').write(out)
print("written %s  %d B  remaining _0x: %d" % (DST, len(out), len(set(re.findall(r'_0x[0-9a-fA-F]+', out)))))
