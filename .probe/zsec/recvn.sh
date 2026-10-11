#!/bin/bash
IFS=' ' read -r i o <<< "$1"
r=$(NO_DUMP=1 WASM_FILE=.probe/zsec/b_vm.wasm VN_IDX=$i VN_OFF=$o python .probe/zsec/getrec.py 2>/dev/null | tail -1)
echo "$i,$o|$r"