import ida_auto, ida_funcs, idc, idautils
ida_auto.auto_wait()
OUT = r"D:\77\Documents\zse_ck\.probe\vmsvc\loader_dump2.txt"
out = []
# 1) callers of the base64 DecodeString / decodeQuantum
for tgt, nm in ((0x518d, 'DecodeString'), (0x4dee, 'decodeQuantum'), (0x43be, 'CorruptInputError.Error')):
    out.append("==== callers of %s (0x%x) ====" % (nm, tgt))
    seen = set()
    for xr in idautils.XrefsTo(tgt, 0):
        fn = ida_funcs.get_func(xr.frm)
        if fn and fn.start_ea not in seen:
            seen.add(fn.start_ea)
            out.append("  caller 0x%x %s" % (fn.start_ea, ida_funcs.get_func_name(fn.start_ea)))
    out.append("")
# 2) all functions referencing i32.const 0x11800 as a pointer: scan code for the LEB and map to funcs
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
code = wasm[code_off:code_off + 79460]
pat = bytes([0x41, 0x80, 0xB0, 0x04])
fns = set()
k = 0
while True:
    k = code.find(pat, k)
    if k < 0: break
    a = code_off + k
    fn = ida_funcs.get_func(a)
    if fn:
        fns.add((fn.start_ea, ida_funcs.get_func_name(fn.start_ea)))
    k += 1
out.append("==== functions containing i32.const 0x11800 (%d) ====" % len(fns))
for ea, nm in sorted(fns):
    out.append("  0x%x %s" % (ea, nm))
# 3) dump disasm of the _main.* functions that also call base64 (candidates for the loader)
base64_callers = set()
for tgt in (0x518d, 0x4dee):
    for xr in idautils.XrefsTo(tgt, 0):
        fn = ida_funcs.get_func(xr.frm)
        if fn: base64_callers.add(fn.start_ea)
out.append("\n==== base64 callers (0x%x) ====" % len(base64_callers))
for ea in sorted(base64_callers):
    nm = ida_funcs.get_func_name(ea)
    fn = ida_funcs.get_func(ea)
    out.append("\n-------- 0x%x %s (size %d) --------" % (ea, nm, fn.end_ea - ea))
    a = ea; cnt = 0
    while a < fn.end_ea and cnt < 400:
        out.append("  %08x  %s" % (a, idc.GetDisasm(a)))
        a = idc.next_head(a, fn.end_ea); cnt += 1
        if a == idc.BADADDR: break
open(OUT, "w", encoding="utf8").write("\n".join(out))
idc.qexit(0)
