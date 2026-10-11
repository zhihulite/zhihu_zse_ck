#!/bin/bash
line=$1
IFS=, read -r a b c d e f <<< "$line"
if [ -n "${d:-}" ]; then
  out=$(NO_DUMP=1 FLIP_IDX=$a FLIP_OFF=$b FLIP_XOR=$c FLIP2=$d,$e,$f python .probe/zsec/wdriver_flipb.py 2>&1)
  pred=$(node .probe/zsec/predict_head.js .probe/zsec/blobs.json "$a,$b,$c" "$d,$e,$f" | tail -1 | sed 's/.* -> //')
else
  out=$(NO_DUMP=1 FLIP_IDX=$a FLIP_OFF=$b FLIP_XOR=$c python .probe/zsec/wdriver_flipb.py 2>&1)
  pred=$(node .probe/zsec/predict_head.js .probe/zsec/blobs.json "$a,$b,$c" | tail -1 | sed 's/.* -> //')
fi
act=$(echo "$out" | grep -oE "12 x uint16 = .*" | sed 's/12 x uint16 = //')
if [ -z "$act" ]; then echo "$line | NO-RECORD | $pred"; else
  if [ "$act" = "$pred" ]; then echo "$line | OK"; else echo "$line | MISMATCH act=[$act] pred=[$pred]"; fi
fi