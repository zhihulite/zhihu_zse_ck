#!/bin/bash
IFS=' ' read -r i o <<< "$1"
r=$(NO_DUMP=1 WASM_FILE=.probe/zsec/b_vm.wasm FLIP_IDX=$i FLIP_OFF=$o FLIP_XOR=1 python .probe/zsec/getrec.py 2>/dev/null | tail -1)
echo "$i,$o|$r"