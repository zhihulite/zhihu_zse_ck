import re, json, sys

s = open('blobs/jsvmp_27264.js', encoding='utf-8', errors='replace').read()
print('source len', len(s))

# 1) 取字符串数组
i = s.index('[')
j = s.index('];', i)
arr_src = s[i+1:j]
items = re.findall(r"'([^']*)'", arr_src)
print('array entries:', len(items))
print('first 6:', items[:6])
print('last 6:', items[-6:])

# 2) 出现次数统计
for kw in ['navigator', 'userAgent', 'canvas', 'webdriver', 'plugins',
           'hardwareConcurrency', 'CRC32', 'crc32', '__g', 'getContext',
           'WebGL', 'fromCharCode', 'charCodeAt', 'decodeURIComponent',
           'toDataURL', 'Function', 'window', 'document']:
    print('  kw %-22s %d' % (kw, s.count(kw)))

# 3) 全部 _0x 标识符
names = sorted(set(re.findall(r'_0x[0-9a-f]{3,7}', s)))
print('distinct _0x names:', len(names))

# 4) 找被当作解码器用的函数名（形如 _0xNNNN(0xNN) 调用最多的）
calls = {}
for m in re.finditer(r'(_0x[0-9a-f]{3,7})\((0x[0-9a-f]+)\)', s):
    calls[m.group(1)] = calls.get(m.group(1), 0) + 1
top = sorted(calls.items(), key=lambda kv: -kv[1])[:10]
print('top numeric-arg callers:', top)

json.dump({'items': items, 'top_callers': top}, open('jsvmp_meta.json', 'w'), ensure_ascii=False)
print('wrote jsvmp_meta.json')
