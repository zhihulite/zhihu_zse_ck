import re, sys

src = open('.probe/big/inner.readable.js', encoding='utf8', errors='replace').read()
print('input', len(src))

# 1) obj['ident'] -> obj.ident   (only when the key is a valid identifier and not a reserved-ish risk)
IDENT = r'[A-Za-z_$][A-Za-z0-9_$]*'
pat1 = re.compile(r"(\b[A-Za-z_$][A-Za-z0-9_$.]*)\[\s*'(" + IDENT + r")'\s*\]")
pat2 = re.compile(r'(\b[A-Za-z_$][A-Za-z0-9_$.]*)\[\s*"(' + IDENT + r')"\s*\]')

n1 = n2 = 0
def rep(m):
    global n1
    n1 += 1
    return m.group(1) + '.' + m.group(2)

prev = None
cur = src
while prev != cur:
    prev = cur
    cur = pat1.sub(rep, cur)
    cur = pat2.sub(rep, cur)
print('member-access rewrites:', n1)

# 2) fold simple hex constant arithmetic like 0x1*0x2+0x3  -> decimal
def fold(expr):
    try:
        v = eval(expr, {'__builtins__': {}}, {})
        return v if isinstance(v, int) else None
    except Exception:
        return None

arith = re.compile(r'(?:-?0x[0-9a-fA-F]+|\b\d+)(?:\s*[+\-*]\s*(?:-?0x[0-9a-fA-F]+|\b\d+))+')
cnt = 0
def rep2(m):
    global cnt
    v = fold(m.group(0))
    if v is None:
        return m.group(0)
    cnt += 1
    return str(v)
cur = arith.sub(rep2, cur)
print('arithmetic folds:', cnt)

open('zse_vm.readable.js', 'w', encoding='utf8').write(cur)
print('written zse_vm.readable.js', len(cur))
print('remaining this[..]:', len(re.findall(r"this\[", cur)))
print('remaining 0x:', len(re.findall(r'0x[0-9a-fA-F]+', cur)))
print('head:', cur[:200])
