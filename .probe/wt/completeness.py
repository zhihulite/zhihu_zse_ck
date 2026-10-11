import re

orig = open('.probe/big/inner.readable.js', encoding='utf8', errors='replace').read()
rest = open('zse_ck_cvm.runnable.js', encoding='utf8', errors='replace').read()

STR = re.compile(r"'([^'\\\\]{2,40})'")


def stats(t, label):
    strs = STR.findall(t)
    print('%-8s 字节=%-7d 字符串=%-5d function=%-4d 分号=%-6d 花括号净差=%d' % (
        label, len(t), len(strs), len(re.findall(r'function\s', t)),
        t.count(';'), t.count('{') - t.count('}')))


stats(orig, '原文')
stats(rest, '还原版')

o = set(STR.findall(orig))
r = set(STR.findall(rest))
missing = sorted(o - r)
extra = sorted(r - o)
print()
print('原文独有字符串 %d 个' % len(missing))
print('  示例:', missing[:10])
print('还原版独有字符串 %d 个（= 内联进来的解码结果）' % len(extra))
print('  示例:', extra[:10])
print()
print('完整性：还原版%s原文的全部字符串' % ('覆盖' if not missing else '缺少'))
