#!/bin/bash
o=$1
NO_DUMP=1 WASM_FILE=.probe/zsec/b_vm.wasm STK_FLIP=$o python .probe/zsec/wdriver_flipb.py >/dev/null 2>&1
python - "$o" <<'PY'
import re,sys
d=open('.probe/zsec/vmfull_1.bin','rb').read()
ents=[(m.start(),int(m.group())) for m in re.finditer(rb'[0-9]{8,10}', d)]
pairs=[i for i in range(len(ents)-1) if ents[i][1]==ents[i+1][1]]
segs=[];cur=[pairs[0]] if pairs else []
for i in range(1,len(pairs)):
    if pairs[i]-pairs[i-1] in (2,3): cur.append(pairs[i])
    else: segs.append(cur);cur=[pairs[i]]
if cur: segs.append(cur)
res=None
for sg in segs:
    if len(sg)>=32: res=[ents[i][1] for i in sg[:32]]; break
print("%s|%s" % (sys.argv[1], '' if res is None else ','.join(hex(v) for v in res)))
PY