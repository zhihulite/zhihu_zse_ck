import ida_auto, ida_funcs, idautils, idc
OUT=r"D:\77\Documents\zse_ck\.probe\vmsvc\rot_scan.txt"
ida_auto.auto_wait()
f=open(OUT,'w',encoding='utf8')
tot=0; hits=[]
for ea in idautils.Functions():
    fn=ida_funcs.get_func(ea)
    if not fn: continue
    a=fn.start_ea
    while a < fn.end_ea:
        t=idc.generate_disasm_line(a,0)
        if 'rotl' in t or 'rotr' in t or 'rotate' in t:
            hits.append((fn.start_ea, ida_funcs.get_func_name(fn.start_ea), a, t)); tot+=1
        a=idc.next_head(a, fn.end_ea)
f.write('total rotl/rotr found: %d\n'%tot)
for h in hits[:40]: f.write('  func %08x %s\n     %08x %s\n'%(h[0],h[1],h[2],h[3]))
# also: any function whose instruction mix includes shl by 2/10/18/24
f.write('\nshift-by-2/10/18/24 sites:\n')
cnt=0
for ea in idautils.Functions():
    fn=ida_funcs.get_func(ea)
    if not fn: continue
    a=fn.start_ea
    while a < fn.end_ea:
        t=idc.generate_disasm_line(a,0).strip()
        if t in ('i32.shl','i32.shr_u','i32.shr_s'):
            nxt=idc.generate_disasm_line(idc.prev_head(a,fn.start_ea),0).strip()
            if nxt in ('i32.const 2','i32.const 10','i32.const 18','i32.const 24','i32.const 14','i32.const 22','i32.const 8','i32.const 30'):
                f.write('  %08x %s  %s (prev %s)\n'%(a, ida_funcs.get_func_name(fn.start_ea), t, nxt)); cnt+=1
        a=idc.next_head(a, fn.end_ea)
f.write('total such sites: %d\n'%cnt)
f.close(); idc.qexit(0)