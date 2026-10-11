import idautils, idaapi, idc, ida_funcs
idaapi.auto_wait()
out=[]
TARGET=0xFD4A
def fname(ea):
    f=ida_funcs.get_func(ea)
    if not f: return None
    return idc.get_func_name(f.start_ea), f.start_ea
out.append('=== function containing 0x%X ==='%TARGET)
r=fname(TARGET)
out.append('  %s'%(r,))
seen=set(); frontier=[TARGET]
for depth in range(1,6):
    nxt=[]
    out.append('--- level %d ---'%depth)
    for ea in frontier:
        f=ida_funcs.get_func(ea)
        if not f: continue
        key=f.start_ea
        if key in seen: continue
        seen.add(key)
        nm=idc.get_func_name(key)
        xr=list(idautils.XrefsTo(key,0))
        callers=[]
        for x in xr:
            if x.type in (idaapi.fl_CN, idaapi.fl_CF, 16, 17):
                callers.append(x.frm)
        out.append('  %s @0x%X  callers=%d %s'%(nm,key,len(callers),[hex(c) for c in callers[:12]]))
        nxt.extend(callers)
    frontier=nxt
    if not frontier: break
open(r'D:\77\Documents\zse_ck\.probe\vmsvc\xref_up.txt','w',encoding='utf8').write('\n'.join(out))
print('\n'.join(out))
idc.qexit(0)