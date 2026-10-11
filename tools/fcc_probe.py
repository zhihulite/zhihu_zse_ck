import re, sys, collections

s = open('.probe/zsec/fcc_all.txt', encoding='utf-8', errors='replace').read()
print('FCC total =', len(s))

def show(pat, label, maxn=6, win=50):
    print('\n=== %s : %r ===' % (label, pat))
    n = 0
    for m in re.finditer(re.escape(pat), s):
        print('  @%d  ...%s...' % (m.start(), s[max(0,m.start()-win):m.start()+len(pat)+win]))
        n += 1
        if n >= maxn: break
    if n == 0: print('  (none)')

show('2000100080004030', 'payload 明文 16hex')
show('20001000800040308000800098008000800080004000', '44hex 位图')
show('9800', '9800')
show('4020', '4020')
show('__g', '__g')

# 找出流里所有 40+ 的纯 hex 连续串
print('\n=== 所有 >=40 hex 连续串 ===')
seen = collections.Counter()
for m in re.finditer(r'[0-9a-f]{40,}', s):
    seen[m.group()] += 1
for k, v in seen.most_common(10):
    print('  x%d len=%d %s' % (v, len(k), k))

# 流的分段结构：按 | 切分，看 token 形态
print('\n=== 流开头 1500 字符分段 ===')
for t in s[:1500].split('|')[:60]:
    print('   [%s]' % t[:60])
