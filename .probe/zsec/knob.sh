#!/bin/bash
LBL="$1"; shift
rm -f .probe/zsec/mem_build.bin
env "$@" BUILD=.probe/live-6d0ccece4cfc.js ZSE_BITFIX=1 timeout 300 node .probe/zsec/run_build_live.js > /tmp/k_$LBL.log 2>&1
echo "=== $LBL ($*) ==="
grep -o "宿主调用总数: [0-9]*" /tmp/k_$LBL.log
if [ -f .probe/zsec/mem_build.bin ]; then python py/bitmap_from_mem.py .probe/zsec/mem_build.bin | grep "位图"; else echo "  未产出 mem_build.bin"; fi