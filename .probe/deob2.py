import re, json
BS = chr(92)
s = open('.probe/big/blob-818064.bin','rb').read().decode('utf8', errors='replace')
m = re.search(r'function (_0x5836)\(\)\{', s)
print('array fn at', m.start() if m else None)
i = s.find('function _0x5836()')
seg = s[i:i+200]
print(repr(seg[:200]))
# find the array within
j = s.find('[', i)
depth=0; instr=None; k=j
while k < len(s):
    c = s[k]
    if instr:
        if c == BS: k+=2; continue
        if c == instr: instr=None
    else:
        if c in "'\"": instr=c
        elif c=='[': depth+=1
        elif c==']':
            depth-=1
            if depth==0: break
    k+=1
arr = s[j:k+1]
pat = "'((?:" + BS + BS + ".|[^'" + BS + BS + "])*)'"
items = re.findall(pat, arr)
print('array items', len(items))
print(items[:12])
json.dump(items, open('.probe/big/strarr.json','w'))