#!/bin/bash
i=$1
k=$(NO_DUMP=1 WASM_FILE=.probe/zsec/b_vm.wasm FLIP_IDX=$i FLIP_OFF=0 FLIP_XOR=1 python .probe/zsec/getkeys.py 2>/dev/null | tail -1)
echo "$i|$k"