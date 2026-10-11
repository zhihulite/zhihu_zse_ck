import ida_auto, ida_funcs, idautils, idc
OUT = r"D:\77\Documents\zse_ck\.probe\vmsvc\gen_list.txt"
ida_auto.auto_wait()
f=open(OUT,'w',encoding='utf8')
rows=[]
for ea,name in idautils.Names():
    if '$bound' in name: continue
    if name.startswith('(*main'): continue
    if 'main.' not in name and '_main.' not in name: continue
    fn=ida_funcs.get_func(ea)
    if not fn: continue
    rows.append((fn.start_ea, fn.end_ea-fn.start_ea, name))
rows.sort()
f.write('package-level main functions (%d):\n'%len(rows))
for ea,sz,name in rows:
    f.write('  %08x  size=%-6d %s\n'%(ea,sz,name))
f.close()
idc.qexit(0)