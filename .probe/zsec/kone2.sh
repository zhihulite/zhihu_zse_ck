#!/bin/bash
IFS=' ' read -r i o <<< "$1"
NO_DUMP=1 WASM_FILE=.probe/zsec/b_vm.wasm FLIP_IDX=$i FLIP_OFF=$o FLIP_XOR=1 python .probe/zsec/wdriver_flipb.py >/dev/null 2>&1
python - "$i" "$o" <<'PY'
import re,sys
d=open('.probe/zsec/vmfull_1.bin','rb').read()
out=[]
for m in re.finditer(rb'[0-9]{8,10}', d[0x155900:0x157000]):
    v=int(m.group())
    if not out or out[-1]!=v: out.append(v)
print("%s,%s|%s" % (sys.argv[1],sys.argv[2],','.join(hex(v) for v in out)))
PY