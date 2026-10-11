import re, json, subprocess, os

def rename(path, mapping, tag):
    s = open(path, encoding='utf-8', errors='replace').read()
    before = len(re.findall(r'\b_0x[0-9a-f]{3,7}\b', s))
    for a, b in mapping:
        s = re.sub(r'\b' + re.escape(a) + r'\b', b, s)
    after = len(re.findall(r'\b_0x[0-9a-f]{3,7}\b', s))
    open(path, 'w', encoding='utf-8').write(s)
    r = subprocess.run(['node', '--check', path], capture_output=True, text=True)
    print('%-38s 混淆标识符 %d -> %d  语法 %s' % (tag, before, after, 'OK' if r.returncode == 0 else 'FAIL ' + r.stderr[:120]))

# 服务层：解码器 _0x17a3、串表 _0x2a91
rename('zse_ck_service.restored.js', [('_0x17a3', 'decodeStr'), ('_0x2a91', 'stringTable')], 'zse_ck_service.restored.js')

# 两份 eval 源
rename('.probe/zsec/eval_136041.deob.js', [('_0x4811', 'decodeStr'), ('_0x5836', 'stringTable')], 'eval_136041.deob.js')
rename('.probe/zsec/eval_62501.deob.js', [('_0x258f', 'decodeStr'), ('_0x4a06', 'stringTable')], 'eval_62501.deob.js')

# CVM 层：解码器已被回填，只剩串表函数 _0x5836
rename('zse_ck_cvm.restored.js', [('_0x5836', 'stringTable'), ('_0x166c42', 'decodeStr')], 'zse_ck_cvm.restored.js')

# 指纹层 / 环境检测层：jsvmp 的已知内核名（与 env_detect.restored.js 同一套）
JSVMP = [
    ('_0x599f', '_stringTableInit'), ('_0x2f5e70', 'STRINGS'), ('_0x4848', 'decodeString'),
    ('_0x483804', 'md5Hex'), ('_0x408d39', 'binlMD5'), ('_0x340f6e', 'md5cmn'),
    ('_0x27e95f', 'md5ff'), ('_0x1fec22', 'md5gg'), ('_0x479bec', 'md5hh'),
    ('_0x29b6d0', 'md5ii'), ('_0x7a98', 'safeAdd'), ('_0x24eac6', 'parts'),
    ('_0x18eec0', 'once'), ('_0x93a7c4', 'd'),
]
rename('zse_ck_fingerprint.restored.js', JSVMP, 'zse_ck_fingerprint.restored.js')
rename('.probe/zsec/env_detect.restored.js', [], 'env_detect.restored.js (already renamed)')
