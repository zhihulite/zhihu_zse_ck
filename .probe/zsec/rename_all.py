"""系统性标识符重命名：已知角色 -> 语义名；其余 _0x 名 -> v<N>（按首现顺序）。
改完做语法自检；调用方随后复跑功能级验证。
"""
import re, sys, subprocess

# 已知角色（按出现顺序尝试；先长后短避免前缀冲突）
KNOWN = [
    # 解码器别名（各层不同）
    ('_0x17a3', 'decodeStr'), ('_0x4811', 'decodeStr'), ('_0x258f', 'decodeStr'),
    # 串表函数
    ('_0x2a91', 'stringTable'), ('_0x5836', 'stringTable'), ('_0x4a06', 'stringTable'),
    # 单次包装器 / 反篡改
    ('_0x5bf163', 'once'), ('_0x4b24a8', 'antiTamper'),
    # jsvmp MD5 内核
    ('_0x599f', '_stringTableInit'), ('_0x2f5e70', 'STRINGS'), ('_0x4848', 'decodeString'),
    ('_0x483804', 'md5Hex'), ('_0x408d39', 'binlMD5'), ('_0x340f6e', 'md5cmn'),
    ('_0x27e95f', 'md5ff'), ('_0x1fec22', 'md5gg'), ('_0x479bec', 'md5hh'),
    ('_0x29b6d0', 'md5ii'), ('_0x7a98', 'safeAdd'), ('_0x24eac6', 'parts'),
    ('_0x18eec0', 'once2'), ('_0x93a7c4', 'd'),
    # CVM 层
    ('_0x166c42', 'decodeStr'), ('_0x2a5cf3', 'decodeStrAlias'),
]

def reserved(s):
    """现有非 _0x 标识符集合（避免改名冲突）"""
    return set(re.findall(r'\b[A-Za-z_$][\w$]*\b', s))

def rename_file(path, tag):
    s = open(path, encoding='utf-8', errors='replace').read()
    before = len(set(re.findall(r'\b_0x[0-9a-f]{3,7}\b', s)))

    # 1) 已知角色
    for a, b in KNOWN:
        if a in s:
            s = re.sub(r'\b' + re.escape(a) + r'\b', b, s)

    # 2) 其余 _0x：按首现顺序 -> v0, v1, ...
    ids = []
    for m in re.finditer(r'\b_0x[0-9a-f]{3,7}\b', s):
        if m.group(0) not in ids:
            ids.append(m.group(0))
    used = reserved(s)
    mapping = {}
    n = 0
    for i in ids:
        while ('v%d' % n) in used:
            n += 1
        mapping[i] = 'v%d' % n
        used.add('v%d' % n)
        n += 1
    for a, b in mapping.items():
        s = re.sub(r'\b' + re.escape(a) + r'\b', b, s)

    after = len(set(re.findall(r'\b_0x[0-9a-f]{3,7}\b', s)))
    open(path, 'w', encoding='utf-8').write(s)
    r = subprocess.run(['node', '--check', path], capture_output=True, text=True)
    print('%-40s 不同 _0x 名 %4d -> %d   语法 %s' % (tag, before, after,
          'OK' if r.returncode == 0 else 'FAIL ' + r.stderr[:150]))
    return r.returncode == 0

TARGETS = [
    ('zse_ck_orchestrator.restored.js', 'zse_ck_orchestrator.restored.js'),
    ('zse_ck_inner.restored.js', 'zse_ck_inner.restored.js'),
    ('.probe/zsec/eval_136041.deob.js', 'eval_136041.deob.js'),
    ('.probe/zsec/eval_62501.deob.js', 'eval_62501.deob.js'),
    ('zse_ck_service.restored.js', 'zse_ck_service.restored.js'),
    ('zse_ck_fingerprint.restored.js', 'zse_ck_fingerprint.restored.js'),
    ('zse_ck_cvm.restored.js', 'zse_ck_cvm.restored.js'),
]
ok = True
for p, t in TARGETS:
    ok = rename_file(p, t) and ok
sys.exit(0 if ok else 1)
