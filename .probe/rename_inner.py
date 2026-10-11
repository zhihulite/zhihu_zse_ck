import re, sys, json

SRC = '.probe/src/inner.SRC0.strings.js'
DST = '.probe/src/inner.SRC0.restored.js'

M = {
    # ---- string pool / decoder machinery ----
    '_0x4a06': 'getStringArray', '_0x44afa4': 'stringArray', '_0x258f': 'decodeStr',
    '_0x258f2a': 'poolArr', '_0x239767': 'index', '_0x3542f3': 'keyArg2', '_0x474945': 'str',
    '_0x4cf430': 'onceFn', '_0x4a06ab': 'keyArg', '_0x5016bd': 'arrFn', '_0x54542d': 'expectedChecksum',
    '_0x7961a9': 'decAlias', '_0x312337': 'arr', '_0x2eea26': 'checksum', '_0x43f1a9': 'e0',
    # ---- self-defense (onceFn / console patch) ----
    '_0x5b52ed': 'onceFn2', '_0x35470d': 'firstCall', '_0x2fb765': 'ctx', '_0x20933c': 'fn',
    '_0x4a688d': 'wrapper', '_0x3312a7': 'decB', '_0x4f829f': 'result', '_0x4c2054': 'antiDebug',
    '_0x53ae69': 'decC', '_0x56d535': 'globalObj', '_0x13825c': 'getGlobal', '_0x2beb47': 'e1',
    '_0x3e1356': 'consoleObj', '_0x56731f': 'consoleMethods', '_0x1ea10e': 'ci', '_0x3ddd6f': 'boundFn',
    '_0x745f83': 'methodName', '_0x410e50': 'origFn', '_0x357ba0': 'selfCheck', '_0x469303': 'decD',
    '_0x490749': 'decE', '_0x3b3b78': 'result2', '_0x2076e9': 'wrapper2', '_0x3b9e31': 'ctx2',
    '_0x9544e': 'fn2', '_0x2d35c5': 'firstCall2',
    # ---- interpreter core ----
    '_0x465891': 'pc', '_0x91ad3e': 'w', '_0x246a3b': 'idx', '_0x29649d': 'args',
    '_0x50b5e2': 'strBuf', '_0x422bd7': 'evalParts', '_0x2f480b': 'val', '_0x1c60b7': 'dec',
    '_0x3a51ce': 'dec0', '_0x36ccf0': 'condVal', '_0x4a3589': 'numArg', '_0x5ec02c': 'len',
    '_0x17ac7b': 'substr', '_0x9b4c07': 'opHi', '_0x2a7df7': 'self', '_0x580678': 'popA',
    '_0x21a7b6': 'newArr', '_0x168d7e': 'v168', '_0x549ada': 'callRes', '_0x160ce9': 'chCode',
    '_0x5ea31a': 'regsInit', '_0x1d500c': 'strPacked', '_0x2f771c': 'v2f77', '_0x5884db': 'arg1',
    '_0x3e9608': 'stackCopy', '_0x23de42': 'seed', '_0x81d75e': 'child', '_0x4cda1e': 'const67',
    '_0x17a4b8': 'arr2', '_0x154f74': 'popB', '_0x2cdf8f': 'method', '_0x533c19': 'regsVal',
    '_0x54d578': 'limit', '_0x55a7a4': 'ts', '_0x462430': 'elapsed', '_0xa2ed': 'flag',
    '_0x306b0a': 'e',
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

# property renames (verified collision-free below)
nj = len(re.findall(r'\.J\b', out))
if nj != len(re.findall(r'this\.J\b', out)):
    print("ABORT: .J appears outside this.J (%d vs %d)" % (nj, len(re.findall(r'this\.J\b', out))))
    sys.exit(1)
out = re.sub(r'\.J\b', '.word', out)
open(DST, 'w', encoding='utf8').write(out)

left = sorted(set(re.findall(r'_0x[0-9a-fA-F]+', out)))
print("written %s  %d B  remaining _0x names: %d" % (DST, len(out), len(left)))
print("this.word occurrences:", len(re.findall(r'this\.word\b', out)))
