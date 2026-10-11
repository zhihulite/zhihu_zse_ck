#!/bin/bash
i=$1; o=$2
r=$(NO_DUMP=1 FLIP_IDX=$i FLIP_OFF=$o FLIP_XOR=1 python .probe/zsec/wdriver_flipb.py 2>&1 | grep -oE "12 x uint16 = [0-9a-f ]+" | head -1)
echo "$i $o |${r:- NONE}"