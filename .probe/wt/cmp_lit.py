import re

orig = open('.probe/big/inner.readable.js', encoding='utf8', errors='replace').read()
rest = open('zse_ck_cvm.runnable.js', encoding='utf8', errors='replace').read()

# 先去掉 this['X'] / obj["X"] 这类成员访问，再统计真正的字符串字面量
MEM1 = re.compile(r"\w+\[\s*'[^']{1,30}'\s*\]")
MEM2 = re.compile(r'\w+\[\s*"[^"]{1,30}"\s*\]')
LIT = re.compile(r"""'((?:[^'\\]|\\.){2,60})'|"((?:[^"\\]|\\.){2,60})" """)


def count(t, label):
    t2 = MEM1.sub('MEM', t)
    t2 = MEM2.sub('MEM', t2)
    lits = [a or b for a, b in LIT.findall(t2)]
    print('%-8s 去成员访问后字节=%-7d 真字符串字面量=%d' % (label, len(t2), len(lits)))
    return set(lits)


o = count(orig, '原文')
r = count(rest, '还原版')
print()
print('原文有、还原版没有的字符串字面量 (%d):' % len(o - r))
for x in sorted(o - r)[:15]:
    print('   ', repr(x))
print()
print('还原版有、原文没有的 (%d):' % len(r - o))
for x in sorted(r - o)[:10]:
    print('   ', repr(x))
