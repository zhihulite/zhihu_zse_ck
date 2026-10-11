import re, sys, os, subprocess, json
BS=chr(92)
def str_end(s,i):
    q=s[i]; k=i+1
    while k<len(s):
        if s[k]==BS: k+=2; continue
        if s[k]==q: return k+1
        k+=1
    raise RuntimeError("unterminated")
def lits(s):
    out=[]
    for m in re.finditer(r'(?:^|[\n;])\s*(?:const|var|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(["\'])', s):
        i=m.start(2); j=str_end(s,i)
        out.append((m.group(1), s[i:j]))
    return out
os.makedirs('.probe/src',exist_ok=True)
jobs=[]
for fn,outpref in [('zse_ck_orchestrator.restored.js','orch'),('zse_ck_inner.restored.js','inner'),('zse_ck_payload.restored.js','payload')]:
    s=open(fn,encoding='utf8').read()
    for idx,(name,lit) in enumerate(lits(s)):
        if len(lit)<100: continue
        jobs.append((name,lit,'%s.SRC%d'%(outpref,idx)))
# build one node script that writes each
parts=["const fs=require('fs');"]
for k,(name,lit,tag) in enumerate(jobs):
    parts.append("fs.writeFileSync('.probe/src/%s.js', %s);" % (tag, lit))
open('.probe/src/_dump.js','w',encoding='utf8').write("\n".join(parts))
subprocess.run(['node','.probe/src/_dump.js'],check=True)
for name,lit,tag in jobs:
    p='.probe/src/%s.js'%tag
    print("%-14s -> %-24s %7d B" % (name,p,os.path.getsize(p)))