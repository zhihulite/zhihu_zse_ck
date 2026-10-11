import re, os

ID = r'[A-Za-z_$][A-Za-z0-9_$]*'


def clean(d):
    # 1) 成员访问 obj['x'] -> obj.x  （注意不要碰字符串内容里的东西：用标识符边界）
    prev = None
    while prev != d:
        prev = d
        d = re.sub(r"(\b[A-Za-z_$][A-Za-z0-9_$.]*)\[\s*'(" + ID + r")'\s*\]", r'\1.\2', d)
        d = re.sub(r'(\b[A-Za-z_$][A-Za-z0-9_$.]*)\[\s*"(' + ID + r')"\s*\]', r'\1.\2', d)

    # 2) 常量折叠：只处理“数字算术”，且必须不在标识符内部
    NUM = r'(?<![\w$.])(?:0x[0-9a-fA-F]+|\d+)'
    ARITH = re.compile(NUM + r'(?:\s*[+\-*]\s*(?:0x[0-9a-fA-F]+|\d+))+')

    def fold(m):
        try:
            v = eval(m.group(0), {'__builtins__': {}}, {})
            return str(v) if isinstance(v, int) else m.group(0)
        except Exception:
            return m.group(0)

    d = ARITH.sub(fold, d)

    # 3) 剩下的纯 hex 常量 -> 十进制（同样要求不在标识符内部）
    d = re.sub(r'(?<![\w$.])0x[0-9a-fA-F]+',
               lambda m: str(int(m.group(0), 16)), d)
    return d


if __name__ == '__main__':
    pairs = [('js/cvm.decompiled.js', 'zse_ck_orchestrator.restored.js'),
             ('js/payload.cvm.js', 'zse_ck_payload.restored.js'),
             ('js/inner.decompiled.js', 'zse_ck_inner.restored.js'),
             ('js/fingerprint.deobfuscated.js', 'zse_ck_fingerprint.restored.js')]
    for src, out in pairs:
        if not os.path.exists(src):
            print('missing', src); continue
        d = clean(open(src, encoding='utf8', errors='replace').read())
        open(out, 'w', encoding='utf8').write(d)
        print('%-40s %7d B  hex=%-4d this[..]=%-4d' % (out, len(d),
              len(re.findall(r'(?<![\w$.])0x[0-9a-fA-F]+', d)), len(re.findall(r'this\[', d))))
    # VM 类（来自 inner.readable.js，已内联字符串数组）
    d = clean(open('zse_vm.body.js', encoding='utf8', errors='replace').read())
    open('zse_ck_cvm.restored.js', 'w', encoding='utf8').write(d)
    print('%-40s %7d B  hex=%-4d this[..]=%-4d' % ('zse_ck_cvm.restored.js', len(d),
          len(re.findall(r'(?<![\w$.])0x[0-9a-fA-F]+', d)), len(re.findall(r'this\[', d))))
