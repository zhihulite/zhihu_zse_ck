import re, sys

SRC = '.probe/zsec/zse_ck_service.deob.js'

M = {
    # string pool / decoder
    '_0x2a91': 'getStringArray', '_0x460ada': 'stringArray', '_0x17a3': 'decodeStr',
    '_0x2f08a5': 'poolArr', '_0x53ec96': 'index', '_0x5780c4': 'keyArg', '_0x4cad44': 'str',
    '_0x2ec66b': 'decodeBase64Utf8', '_0x10809b': 'b64Input', '_0x522cc0': 'b64chars',
    '_0x4c3a8a': 'binStr', '_0x3190af': 'pctStr', '_0xb708cd': 'i', '_0x2ea2b5': 'acc',
    '_0x513b2f': 'ch', '_0x3bdb56': 'pos', '_0x3fdf31': 'k', '_0x478ce6': 'b64len',
    '_0x55472e': 'args', '_0x796402': 'keyArg2', '_0x2ba7aa': 'offset', '_0x3ecee5': 'cacheKey',
    '_0x34061d': 'cached', '_0x2b06dd': 'arrFn', '_0x4277c8': 'expectedChecksum',
    '_0x294f5d': 'dec0', '_0xc10034': 'arr',
    # self-defense / console patch
    '_0x32be84': 'dec', '_0x5bf163': 'onceFn', '_0x223e9f': 'firstCall', '_0x143049': 'ctx',
    '_0x429652': 'fn', '_0x2db68d': 'wrapper', '_0x2267ee': 'decB', '_0x5d87f3': 'result',
    '_0x4b24a8': 'antiDebug', '_0x390098': 'decC', '_0x455543': 'getGlobal', '_0x2a957a': 'decD',
    '_0x323b3c': 'globalObj', '_0x27268f': 'e1', '_0x17d6c2': 'globalObj2',
    '_0x4b14d7': 'consoleObj', '_0x1b6c5b': 'consoleMethods', '_0x3814f7': 'ci',
    '_0x315f49': 'boundFn', '_0x3b61ab': 'methodName', '_0xaaf07c': 'origFn',
    # Go / wasm_exec glue
    '_0x2f6d46': 'textEncoder', '_0x1df47a': 'textDecoder', '_0x7fd1b2': 'scratchDV',
    '_0x11e183': 'lineBuf', '_0x475773': 'decE', '_0x102c55': 'goInst', '_0x2e7460': 'memDV',
    '_0x2c9bb8': 'decF', '_0x34328c': 'loadValue', '_0x117a75': 'addr', '_0x2050ec': 'decG',
    '_0x4cb0b2': 'f', '_0x1e1b09': 'id', '_0x345138': 'loadString', '_0xa87891': 'addr2',
    '_0x50f5de': 'decH', '_0x27022e': 'ptr', '_0x2ec1db': 'storeValue', '_0x5bf780': 'v',
    '_0x27c8bf': 'decI', '_0x2456d2': 'NAN_HEAD', '_0x109b54': 'typeFlag',
    '_0x1e6a74': 'storeValue2', '_0x1c7a2e': 'addr3', '_0x1f56ce': 'v2', '_0x2925b5': 'decJ',
    '_0x18a195': 'boxed', '_0x492f5f': 'memBytes', '_0x301f35': 'ptr2', '_0x2b4374': 'len2',
    '_0x279c63': 'cap2', '_0x55073': 'decK', '_0xe95022': 'loadSlice', '_0x544267': 'addr4',
    '_0x2f23a4': 'len3', '_0x3894a6': 'cap3', '_0x36fe77': 'out', '_0x37d677': 'si',
    '_0x5c3184': 'loadString2', '_0x542103': 'ptr3', '_0x106efd': 'len4', '_0x2f3064': 'decL',
    '_0x150b06': 'startTime',
    # wasi fd_write
    '_0x43fe8e': 'fd', '_0x3df12c': 'iovs', '_0xc32cf8': 'iovsLen', '_0x17ac6c': 'decM',
    '_0x581cc8': 'written', '_0xc1d1e9': 'ii', '_0x5c3fa6': 'iovPtr', '_0x592fab': 'bufPtr',
    '_0x542f42': 'bufLen', '_0x29b3b0': 'bi', '_0x293886': 'byte', '_0x75dbbd': 'line',
    '_0x3123bd': 'nwritten', '_0x4ca9ce': 'err', '_0x45107c': 'bufPtr2', '_0x40b9c8': 'bufLen2',
    '_0x1bc057': 'decN',
    # gojs imports
    '_0xef1909': 'ms', '_0x45bb09': 'decO', '_0x16880f': 'ref', '_0x2a4e84': 'ref2',
    '_0x39ba50': 'key3', '_0x5d9685': 'decP', '_0x439e93': 'ref3', '_0x36b0a9': 'key4',
    '_0x4a9428': 'val', '_0x4a559e': 'decQ', '_0x2077ba': 'sp', '_0x380368': 'ctorRef',
    '_0x4f2fb0': 'argvPtr', '_0x448b63': 'argc', '_0x299e2a': 'argcPtr', '_0x3adfa5': 'decR',
    '_0x2d3a8c': 'ctor', '_0xc3999c': 'argv', '_0x433afc': 'e2', '_0x5ae678': 'ref4',
    '_0x3976be': 'decS', '_0x313211': 'decT',
    # exported resume helpers
    '_0x3dc948': 'methodId', '_0x28e358': 'go2', '_0x48d80d': 'decU', '_0x374f5a': 'call',
    '_0x3d6d79': 'decV', '_0x5e91c6': 'inst', '_0x16a670': 'decW', '_0x15b2f1': 'promise',
    '_0x1b1208': 'resume',
}

s = open(SRC, encoding='utf8').read()
missing = sorted(set(re.findall(r'_0x[0-9a-fA-F]+', s)) - set(M))
if missing:
    print("UNMAPPED (%d):" % len(missing), missing)
    sys.exit(1)
news = list(M.values())
dups = {n for n in news if news.count(n) > 1}
if dups:
    print("DUP NEW NAMES:", dups)
    sys.exit(1)
out = re.sub(r'_0x[0-9a-fA-F]+', lambda m: M.get(m.group(0), m.group(0)), s)
out = out.replace('IPCOGf', 'initialized').replace('GXEirT', 'b64Decode')
open(SRC, 'w', encoding='utf8').write(out)
print("rewritten %s  %d B  remaining _0x: %d" % (SRC, len(out), len(set(re.findall(r'_0x[0-9a-fA-F]+', out)))))
