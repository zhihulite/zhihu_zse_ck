import sys, io
s = open('.probe/eval-83-136041.js', encoding='utf-8', errors='replace').read()
start = 11296
i = s.index('{', s.index('function', start))
BS = chr(92)
depth = 0
j = i
instr = None
esc = False
while j < len(s):
    c = s[j]
    if instr:
        if esc:
            esc = False
        elif c == BS:
            esc = True
        elif c == instr:
            instr = None
    else:
        if c == '"' or c == "'":
            instr = c
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                break
    j += 1
body = s[start:j + 1]
print("z func len", len(body))
open('.probe/z_func.raw.js', 'w', encoding='utf-8').write(body)
print(body[:1000])
print("...TAIL...")
print(body[-700:])
