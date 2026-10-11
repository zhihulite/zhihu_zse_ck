import re

s = open('blobs/jsvmp_27264.js', encoding='utf-8', errors='replace').read()
print('len', len(s))

# 数组声明处
k = s.find('var _0x2f5e70=')
print('array decl at', k)
print('--- [array decl .. +900] ---')
print(s[k:k+900])
print()
print('--- [end of array .. +900] ---')
e = s.find('];', k)
print('array end at', e)
print(s[e:e+900])
print()

# 找访问器：形如 _0xNNNN=function 或 function _0xNNNN 或 _0xNNNN=...
for pat in ['=function', 'function _0x', '=function(']:
    pass
# 直接找 0x93a7c4 出现的所有位置
for name in ['_0x93a7c4']:
    idxs = [m.start() for m in re.finditer(re.escape(name), s)]
    print(name, 'occurrences', len(idxs), 'first 5 idx', idxs[:5])
    # 打印第一处上下文
    i0 = idxs[0]
    print('--- first context ---')
    print(s[max(0, i0-300):i0+400])
