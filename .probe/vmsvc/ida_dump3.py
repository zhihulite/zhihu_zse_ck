import ida_auto, ida_funcs, idautils, idc, ida_bytes

OUT = r"D:\77\Documents\zse_ck\.probe\vmsvc\ida_dump3.txt"
ida_auto.auto_wait()
f = open(OUT, "w", encoding="utf8")

# locate the modified alphabet string in the wasm image (search bytes)
ALPHA = b'rBPa7xz6ReFTKuVHLE=IS0sJ5jwf2YCAGqXdWhQvy/OM3nk9cotp1DmZbUN4lg8i'
CRCT = bytes.fromhex('96300777')
ea = ida_bytes.find_bytes(ALPHA, 0)
f.write("alphabet at %s\n" % (hex(ea) if ea != idc.BADADDR else "NOT FOUND"))
ea2 = ida_bytes.find_bytes(CRCT, 0)
f.write("crc-table at %s\n" % (hex(ea2) if ea2 != idc.BADADDR else "NOT FOUND"))

for tag, tgt in (('ALPHABET', ea), ('CRCTABLE', ea2)):
    if tgt == idc.BADADDR:
        continue
    f.write("\n==== xrefs to %s (0x%x) ====\n" % (tag, tgt))
    n = 0
    for xr in idautils.XrefsTo(tgt, 0):
        fn = ida_funcs.get_func(xr.frm)
        nm = ida_funcs.get_func_name(fn.start_ea) if fn else "?"
        f.write("  from %08x in %s\n" % (xr.frm, nm))
        n += 1
        if n > 30:
            break

# dump disasm of the 7 _main._0oOoOO non-bound methods
TARGETS = [0xe021, 0xe0ee, 0x11171, 0x111e0, 0x11233, 0x11e7d, 0x125b1]
for t in TARGETS:
    fn = ida_funcs.get_func(t)
    nm = ida_funcs.get_func_name(t) if fn else '?'
    end = fn.end_ea if fn else t + 0x400
    f.write("\n======== %08x %s (%d bytes) ========\n" % (t, nm, end - t))
    a = t
    cnt = 0
    while a < end and cnt < 4000:
        f.write("  %08x  %s\n" % (a, idc.GetDisasm(a)))
        a = idc.next_head(a, end)
        cnt += 1
        if a == idc.BADADDR:
            break
f.close()
idc.qexit(0)
