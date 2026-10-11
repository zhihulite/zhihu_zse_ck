import re, json
BS = chr(92)
s = open('.probe/big/blob-818064.bin','rb').read().decode('utf8', errors='replace')
i = s.find('=[', 40000)
j = i+1; depth=0; instr=None; k=j
while k < len(s):
    c = s[k]
    if instr:
        if c == BS:
            k += 2; continue
        if c == instr:
            instr = None
    else:
        if c == "'" or c == '"':
            instr = c
        elif c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                break
    k += 1
arr = s[j:k+1]
print('array raw len', len(arr))
pat = "'((?:" + BS + BS + ".|[^'" + BS + BS + "])*)'"
items = re.findall(pat, arr)
print('items', len(items))
print(items[:15])
json.dump(items, open('.probe/big/strarr.json','w'))
m = re.search(r'function (_0x[0-9a-fA-F]+)\(_0x[0-9a-fA-F]+,_0x[0-9a-fA-F]+\)', s)
print('decoder name:', m.group(1) if m else None)
if m:
    print(s[m.start():m.start()+1100])