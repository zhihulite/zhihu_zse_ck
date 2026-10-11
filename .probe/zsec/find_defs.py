import re, json

s = open('blobs/jsvmp_27264.js', encoding='utf-8', errors='replace').read()

# 找数组变量名
m = re.search(r"var (_0x[0-9a-f]+)=\[", s)
arr_name = m.group(1)
print('array var:', arr_name)

# 找旋转 IIFE 与访问器定义
for name in ['_0x93a7c4', '_0x83e176', '_0x42c2c0']:
    for pat in ['function ' + name, name + '=function', name + ' = function']:
        k = s.find(pat)
        if k >= 0:
            print('--- def of', name, 'at', k, '---')
            print(s[max(0, k-80):k+700])
            print()
            break
    else:
        print('no def found for', name)

# 旋转 IIFE 通常紧跟数组
k = s.find(arr_name)
print('=== around array decl (first 1400 chars) ===')
print(s[k-30:k+1400])
