#!/bin/bash
pc=$1
f=.probe/zsec/pd_$pc.bin
rm -f $f
NO_DUMP=1 WASM_FILE=.probe/zsec/b_st.wasm DUMP_PC=$pc PDUMP_OUT=$f python .probe/zsec/wdriver_flipb.py >/dev/null 2>&1
if [ -s "$f" ]; then
python - "$pc" "$f" <<'PY'
import re,sys
d=open(sys.argv[2],'rb').read()
ents=[(m.start(),int(m.group())) for m in re.finditer(rb'[0-9]{8,10}', d)]
pairs=[i for i in range(len(ents)-1) if ents[i][1]==ents[i+1][1]]
segs=[];cur=[pairs[0]] if pairs else []
for i in range(1,len(pairs)):
    if pairs[i]-pairs[i-1] in (2,3): cur.append(pairs[i])
    else: segs.append(cur);cur=[pairs[i]]
if cur: segs.append(cur)
n=sum(1 for sg in segs if len(sg)>=32)
print("%s %d %d" % (sys.argv[1], len(d), 1 if n else 0))
PY
rm -f "$f"
else echo "$pc 0 -1"; fi