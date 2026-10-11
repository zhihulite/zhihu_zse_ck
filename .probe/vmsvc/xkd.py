import idautils, idaapi, idc, ida_funcs
idaapi.auto_wait()
out=[]
for T in (0xE08B, 0x750B):
    f=ida_funcs.get_func(T)
    out.append('=== 0x%X in %s [0x%X..0x%X] size=%d ==='%(T, idc.get_func_name(f.start_ea) if f else None, f.start_ea if f else 0, f.end_ea if f else 0, (f.end_ea-f.start_ea) if f else 0))
    if f:
        for ea in idautils.FuncItems(f.start_ea):
            out.append('  0x%X %s'%(ea, idc.generate_disasm_line(ea,0)))
        out.append('--- callers ---')
        for x in list(idautils.XrefsTo(f.start_ea,0))[:20]:
            cf=ida_funcs.get_func(x.frm)
            out.append('  from 0x%X %s'%(x.frm, idc.get_func_name(cf.start_ea) if cf else '?'))
    out.append('')
open(r'D:\77\Documents\zse_ck\.probe\vmsvc\xkd.txt','w',encoding='utf8').write('\n'.join(out))
print('\n'.join(out[:150]))
idc.qexit(0)