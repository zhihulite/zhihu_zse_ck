import json, re, collections

h = json.load(open('.probe/zsec/hostcalls.json', encoding='utf-8'))
print('hostcalls n =', len(h))
print('keys sample =', sorted(h[0].keys()) if h else None)

ops = collections.Counter()
for x in h:
    ops[x.get('name', '?')] += 1
print('\nop counts:')
for k, v in ops.most_common():
    print('  %-28s %d' % (k, v))

# 打印每条调用的简短形态（名 + 关键字段）
print('\n=== 全部调用摘要（尾 60） ===')
for i, x in enumerate(h[-60:]):
    nm = x.get('name', '?').replace('syscall/js.', '')
    gk = x.get('getKey', '')
    r = x.get('ret', '')
    st = x.get('srcText', '')
    a = str(x.get('a', ''))[:40]
    print('  #%d %s gk=%r ret=%r src=%r a=%s' % (len(h) - 60 + i, nm, gk, str(r)[:60], str(st)[:70], a))

# 搜索任何含 hex 串的字段
print('\n=== 含 9800 / 8000 / 2000100080004030 的调用 ===')
pat = re.compile(r'(9800|2000100080004030)')
for i, x in enumerate(h):
    blob = json.dumps(x, ensure_ascii=False)
    if pat.search(blob):
        print('  #%d %s' % (i, blob[:300]))

# 找出 ret 是单字符 hex 的调用
print('\n=== ret 为单个 hex 字符的调用 ===')
n = 0
for i, x in enumerate(h):
    r = x.get('ret')
    if isinstance(r, str) and re.fullmatch(r'[0-9a-f]', r):
        print('  #%d %s gk=%r ret=%r' % (i, x.get('name', '').replace('syscall/js.', ''), x.get('getKey'), r))
        n += 1
        if n > 80: break
if n == 0:
    print('  (none)')
