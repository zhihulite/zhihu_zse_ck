import re, sys, os, json, subprocess
BS=chr(92)
def str_end(s,i):
    # i at opening quote
    q=s[i]; k=i+1
    while k<len(s):
        if s[k]==BS: k+=2; continue
        if s[k]==q: return k+1
        k+=1
    raise RuntimeError("unterminated")
def top_literals(s):
    out=[]
    for m in re.finditer(r'(?:^|[\n;])\s*(?:const|var|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(["\'])', s):
        i=m.start(2)
        j=str_end(s,i)
        out.append((m.group(1), i, j))
    return out
for fn in sys.argv[1:]:
    s=open(fn,encoding='utf8').read()
    lits=top_literals(s)
    print("=== %s (%d B) : %d top-level string consts ===" % (fn,len(s),len(lits)))
    total=0
    for name,i,j in lits:
        lit=s[i:j]
        print("   %-10s literal %7d B" % (name, len(lit)))
        total+=len(lit)
    print("   total literal bytes: %d" % total)