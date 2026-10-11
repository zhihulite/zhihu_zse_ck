import ida_auto, ida_funcs, idc, idautils
ida_auto.auto_wait()
OUT = r"D:\77\Documents\zse_ck\.probe\vmsvc\loader_dump.txt"
out = []
# map code-section offsets: find code section start in the file, then candidate addrs
# IDA addresses for wasm == file offsets (verified: alphabet @0x5060d both)
wasm = open(r"D:\77\Documents\zse_ck\.probe\zse-ck.wasm", "rb").read()
def uleb(b, i):
    r = 0; s = 0
    while True:
        x = b[i]; i += 1; r |= (x & 0x7f) << s
        if not x & 0x80: return r, i
        s += 7
i = 8; code_off = None
while i < len(wasm):
    sec = wasm[i]; i += 1
    size, i = uleb(wasm, i)
    if sec == 10: code_off = i; break
    i += size
addrs = [code_off + o for o in (0x949, 0xf76, 0x21f4, 0x268a, 0x3146, 0x3f8c, 0x534e)]
out.append("code_off=0x%x addrs=%s" % (code_off, [hex(a) for a in addrs]))
for a in addrs:
    fn = ida_funcs.get_func(a)
    if not fn:
        out.append("0x%x: no function" % a); continue
    nm = ida_funcs.get_func_name(fn.start_ea)
    out.append("\n======== 0x%x in fn 0x%x %s (size %d) ========" % (a, fn.start_ea, nm, fn.end_ea - fn.start_ea))
    ea = fn.start_ea; cnt = 0
    while ea < fn.end_ea and cnt < 240:
        out.append("  %08x  %s" % (ea, idc.GetDisasm(ea)))
        ea = idc.next_head(ea, fn.end_ea)
        cnt += 1
        if ea == idc.BADADDR: break
open(OUT, "w", encoding="utf8").write("\n".join(out))
idc.qexit(0)
