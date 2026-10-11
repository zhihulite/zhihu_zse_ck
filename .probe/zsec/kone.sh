#!/bin/bash
IFS=, read -r i o <<< "$1"
k=$(NO_DUMP=1 WASM_FILE=.probe/zsec/b_vm.wasm FLIP_IDX=$i FLIP_OFF=$o FLIP_XOR=1 python .probe/zsec/getkeys.py 2>/dev/null | tail -1)
echo "$1|$k"