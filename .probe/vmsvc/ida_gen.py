import ida_auto, ida_funcs, idautils, idc, ida_bytes, ida_name, ida_segment
OUT = r"D:\77\Documents\zse_ck\.probe\vmsvc\gen_dump.txt"
ida_auto.auto_wait()
f=open(OUT,'w',encoding='utf8')
# list all names containing _0oooOO / _ooo / main.
hits=[]
for ea,name in idautils.Names():
    if '0ooo' in name or ('main.' in name and not name.startswith('(*main')):
        hits.append((ea,name))
f.write('candidate package-level main functions:\n')
for ea,name in hits[:60]:
    f.write('  %08x %s\n'%(ea,name))
f.write('\n')
target=None
for ea,name in hits:
    if name.endswith('_0oooOO') or '_0oooOO' in name:
        target=ea; break
f.write('target = %s @ %s\n'%(target, hex(target) if target else None))
if target:
    fn=ida_funcs.get_func(target)
    if fn:
        ea=fn.start_ea
        while ea < fn.end_ea:
            f.write('%08x  %s\n'%(ea, idc.generate_disasm_line(ea, 0)))
            ea=idc.next_head(ea, fn.end_ea)
f.close()
idc.qexit(0)