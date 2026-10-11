import idautils, idaapi, idc, ida_funcs
idaapi.auto_wait()
out=[]
def info(ea):
    f=ida_funcs.get_func(ea)
    return (idc.get_func_name(f.start_ea), f.start_ea, f.end_ea) if f else (None,None,None)
for T in (0x9FDF, 0x1124F, 0xBE48):
    nm,st,en=info(T)
    out.append('=== 0x%X in %s [0x%X..0x%X] ==='%(T,nm,st or 0,en or 0))
    f=ida_funcs.get_func(T)
    if f:
        for ea in idautils.FuncItems(f.start_ea):
            out.append('  0x%X %s'%(ea, idc.generate_disasm_line(ea,0)))
    out.append('--- callers ---')
    seen=set()
    for x in idautils.XrefsTo(f.start_ea if f else T,0):
        if x.frm in seen: continue
        seen.add(x.frm)
        cnm,cst,_=info(x.frm)
        out.append('  from 0x%X %s'%(x.frm,cnm))
    out.append('')
open(r'D:\77\Documents\zse_ck\.probe\vmsvc\xref2.txt','w',encoding='utf8').write('\n'.join(out))
print('\n'.join(out[:400]))
idc.qexit(0)