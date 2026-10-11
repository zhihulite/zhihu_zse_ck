#!/bin/bash
pc=$1
f=.probe/zsec/pdump_$pc.bin
rm -f $f
NO_DUMP=1 WASM_FILE=.probe/zsec/b_st.wasm DUMP_PC=$pc python .probe/zsec/wdriver_flipb.py >/dev/null 2>&1
python - "$pc" <<'PY'
import re,sys,os
f='.probe/zsec/pdump_%s.bin'%sys.argv[1]
if not os.path.exists(f): print("%s|nd"%sys.argv[1]); raise SystemExit
d=open(f,'rb').read()
ents=[(m.start(),int(m.group())) for m in re.finditer(rb'[0-9]{8,10}', d)]
pairs=[i for i in range(len(ents)-1) if ents[i][1]==ents[i+1][1]]
segs=[];cur=[pairs[0]] if pairs else []
for i in range(1,len(pairs)):
    if pairs[i]-pairs[i-1] in (2,3): cur.append(pairs[i])
    else: segs.append(cur);cur=[pairs[i]]
if cur: segs.append(cur)
n=sum(1 for sg in segs if len(sg)>=32)
print("%s|%d" % (sys.argv[1], n))
os.remove(f)
PY