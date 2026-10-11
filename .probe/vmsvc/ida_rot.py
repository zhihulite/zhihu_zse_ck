import ida_auto, ida_funcs, idautils, idc
OUT = r"D:\77\Documents\zse_ck\.probe\vmsvc\rot_dump.txt"
ida_auto.auto_wait()
f=open(OUT,'w',encoding='utf8')
tgt=None
for ea,name in idautils.Names():
    if name.endswith('_00OooO$bound') or name.endswith('_00oOoo$bound'):
        fn=ida_funcs.get_func(ea)
        if fn:
            f.write('==== %s @ %08x size=%d ====\n'%(name, fn.start_ea, fn.end_ea-fn.start_ea))
            ea2=fn.start_ea
            while ea2 < fn.end_ea:
                f.write('%08x  %s\n'%(ea2, idc.generate_disasm_line(ea2,0)))
                ea2=idc.next_head(ea2, fn.end_ea)
            f.write('\n')
            if tgt is None: tgt=fn.start_ea
f.write('target=%s\n'%hex(tgt) if tgt else 'not found\n')
f.close(); idc.qexit(0)