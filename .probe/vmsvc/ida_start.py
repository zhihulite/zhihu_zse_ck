import ida_auto, ida_funcs, idc
ida_auto.auto_wait()
fn = ida_funcs.get_func(0x12c2b)
out = []
a = fn.start_ea; cnt = 0
while a < fn.end_ea:
    out.append("  %08x  %s" % (a, idc.GetDisasm(a)))
    a = idc.next_head(a, fn.end_ea); cnt += 1
    if a == idc.BADADDR or cnt > 3000: break
open(r"D:\77\Documents\zse_ck\.probe\vmsvc\start_full.txt", "w", encoding="utf8").write("\n".join(out))
print("LINES", cnt)
idc.qexit(0)