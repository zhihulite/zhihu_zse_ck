#!/bin/bash
IDX=$1; OFF=$2; shift 2
for v in "$@"; do
  r=$(FLIP_IDX=$IDX FLIP_OFF=$OFF FLIP_SET=$v python .probe/zsec/wdriver_flipb.py 2>&1 | grep -E "12 x uint16" )
  echo "set[$v] $r"
done