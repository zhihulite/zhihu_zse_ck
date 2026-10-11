import ida_auto, ida_funcs, idautils, idc, ida_bytes, ida_name
import ida_hexrays

OUT = r"D:\77\Documents\zse_ck\.probe\vmsvc\ida_dump.txt"
ida_auto.auto_wait()
f = open(OUT, "w", encoding="utf8")

funcs = list(idautils.Functions())
f.write("FUNCS %d\n" % len(funcs))
kw = ('sm4', 'crypto', 'crc', 'base64', 'hash', 'main.', 'md5', 'aes', 'cipher')
cands = []
for ea in funcs:
    n = ida_funcs.get_func_name(ea) or ""
    if any(k in n.lower() for k in kw):
        f.write("  %08x %s\n" % (ea, n))
        cands.append((ea, n))

# locate CRC32 table bytes (0x77073096 little-endian) and its xrefs
crc_pat = bytes.fromhex('96300777')
hits = []
ea = 0
while True:
    ea = ida_bytes.find_bytes(crc_pat, ea, ida_bytes.BIN_SEARCH_FORWARD)
    if ea == ida_bytes.BADADDR:
        break
    hits.append(ea)
    ea += 1
    if len(hits) > 8:
        break
f.write("CRC table candidates: %s\n" % [hex(h) for h in hits])
for h in hits[:3]:
    for xr in idautils.XrefsTo(h, 0):
        fn = ida_funcs.get_func(xr.frm)
        nm = ida_funcs.get_func_name(fn.start_ea) if fn else "?"
        f.write("  xref to %08x from %08x in %s\n" % (h, xr.frm, nm))

# decompile candidates + the CRC-referencing functions
seen = set()
targets = list(cands)
for h in hits[:2]:
    for xr in idautils.XrefsTo(h, 0):
        fn = ida_funcs.get_func(xr.frm)
        if fn and fn.start_ea not in seen:
            seen.add(fn.start_ea)
            targets.append((fn.start_ea, ida_funcs.get_func_name(fn.start_ea)))
f.write("\n==== decompiled %d targets ====\n" % len(targets))
for ea, n in targets[:25]:
    f.write("\n-------- %08x %s --------\n" % (ea, n))
    try:
        cf = ida_hexrays.decompile(ea)
        f.write(str(cf) if cf else "<no decompile>\n")
    except Exception as e:
        f.write("<hexrays err: %s>\n" % e)
    f.write("\n")
f.close()
ida_auto.qexit(0)
