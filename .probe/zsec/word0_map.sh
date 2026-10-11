#!/bin/bash
for off in $(seq 0 11); do
  line=""
  for x in 1 2 4 8 16 32 64 128; do
    w=$(FLIP_IDX=26 FLIP_OFF=$off FLIP_XOR=$x python .probe/zsec/wdriver_flipb.py 2>&1 | grep -oE "12 x uint16 = [0-9a-f]{4}" | head -1 | awk '{print $5}')
    line="$line $w"
  done
  echo "off=$off$line"
done