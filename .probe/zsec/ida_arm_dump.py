# IDAPython: dump _00oooO (Go VM 解释器) 的 35 臂 br_table 分派；并尝试 Hex-Rays
import idc
import ida_funcs
import ida_bytes
import ida_auto
import ida_hexrays

ida_auto.auto_wait()

OUT = r"D:\77\Documents\zse_ck\.probe\zsec\ida_arm_dump.txt"
lines = []

EA = 0xE0EE
fn = ida_funcs.get_func(EA)
lines.append("func %s start=0x%x end=0x%x" % (ida_funcs.get_func_name(EA), fn.start_ea, fn.end_ea))

# 1) 尝试 Hex-Rays
try:
    cf = ida_hexrays.decompile(EA)
    lines.append("HEXRAYS: " + (str(cf)[:2000] if cf else "<none>"))
except Exception as e:
    lines.append("HEXRAYS ERR: %s" % e)

# 2) 反汇编整个函数
lines.append("\n==== DISASM 0x%x..0x%x ====" % (fn.start_ea, fn.end_ea))
ea = fn.start_ea
n = 0
while ea < fn.end_ea and n < 4000:
    d = idc.GetDisasm(ea)
    lines.append("%08x  %s" % (ea, d))
    ea = idc.next_head(ea, fn.end_ea)
    n += 1

# 3) 找 br_table 附近（wasm 的 br_table 在 IDA 里通常表现为 jmp 表 / switch）
lines.append("\n==== 含 'br_table' 或大跳转的行 ====")
for i, l in enumerate(lines):
    if 'br_table' in l or 'jpt' in l.lower() or 'switch' in l.lower():
        lines.append("HIT: " + l)

open(OUT, "w", encoding="utf8").write("\n".join(lines))
print("WROTE", len(lines), "lines")
idc.qexit(0)
