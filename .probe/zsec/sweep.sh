#!/bin/bash
IDX=$1; LO=$2; HI=$3
for off in $(seq $LO $HI); do
  r=$(FLIP_IDX=$IDX FLIP_OFF=$off FLIP_XOR=1 python .probe/zsec/wdriver_flipb.py 2>&1 | grep -E "12 x uint16|payload candidates")
  echo "off=$off  $r" | tr '\n' ' '
  echo
done