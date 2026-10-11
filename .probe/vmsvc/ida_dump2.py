import ida_auto, ida_funcs, idautils, idc, ida_bytes, ida_hexrays, ida_strlist, idaapi

OUT = r"D:\77\Documents\zse_ck\.probe\vmsvc\ida_dump2.txt"
ida_auto.auto_wait()
f = open(OUT, "w", encoding="utf8")
BAD = idc.BADADDR

funcs = list(idautils.Functions())
f.write("FUNCS %d\n" % len(funcs))
for ea in funcs:
    f.write("  %08x %s\n" % (ea, ida_funcs.get_func_name(ea) or "?"))

# strings (look for the modified base64 alphabet / keys)
f.write("\n==== STRINGS (len>=16) ====\n")
for s in ida_strlist.string_info_t() if False else []:
    pass
try:
    ida_strlist.build_strlist()
    for i in range(ida_strlist.get_strlist_qty()):
        si = ida_strlist.string_info_t()
        ida_strlist.get_strlist_item(si, i)
        if si.length >= 16:
            try:
                b = ida_bytes.get_bytes(si.ea, si.length)
                f.write("  %08x len=%d %r\n" % (si.ea, si.length, b[:100]))
            except Exception:
                pass
except Exception as e:
    f.write("strlist err %s\n" % e)

# CRC table search + xrefs
crc_pat = bytes.fromhex('96300777')
hits = []
ea = 0
while len(hits) < 8:
    ea = ida_bytes.find_bytes(crc_pat, ea, idaapi.BIN_SEARCH_FORWARD) if hasattr(idaapi, 'BIN_SEARCH_FORWARD') else ida_bytes.find_bytes(crc_pat, ea)
    if ea == BAD or ea is None:
        break
    hits.append(ea)
    ea += 1
f.write("\nCRC table candidates: %s\n" % [hex(h) for h in hits])

targets = []
for h in hits[:2]:
    for xr in idautils.XrefsTo(h, 0):
        fn = ida_funcs.get_func(xr.frm)
        if fn:
            targets.append((fn.start_ea, ida_funcs.get_func_name(fn.start_ea)))

# decompile: base64, crc32, and main.* non-$bound + first $bound samples
extra = []
for ea in funcs:
    n = ida_funcs.get_func_name(ea) or ""
    if any(k in n for k in ('base64', 'crc32')):
        extra.append((ea, n))
mainf = [(ea, ida_funcs.get_func_name(ea)) for ea in funcs
         if '_main.' in (ida_funcs.get_func_name(ea) or '') and '$bound' not in (ida_funcs.get_func_name(ea) or '')]
f.write("\n_main non-bound funcs: %d\n" % len(mainf))
for ea, n in mainf[:40]:
    f.write("  %08x %s\n" % (ea, n))
allt = extra + mainf[:15] + targets
f.write("\n==== decompiled %d ====\n" % len(allt))
for ea, n in allt[:30]:
    f.write("\n-------- %08x %s --------\n" % (ea, n))
    try:
        cf = ida_hexrays.decompile(ea)
        f.write((str(cf) if cf else "<no decompile>") + "\n")
    except Exception as e:
        f.write("<hexrays err: %s>\n" % e)
f.close()
ida_auto.qexit(0)
