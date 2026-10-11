import json, glob, os, re
d=json.load(open('.probe/browser-proto7.json',encoding='utf-8'))
# 取开头所有 1024 调用的 (a4,a5)
calls=[]
for e in d:
    if e.get('name')=='copyBytesToGo':
        a=e.get('a') or []
        fsz=str(a[1]).split(':')[-1] if len(a)>1 else ''
        if fsz=='1024':
            try: ptr=int(str(a[4]).split(':')[-1]); ln=int(str(a[5]).split(':')[-1])
            except: continue
            calls.append((ptr,ln))
print('真实会话 1024 调用数:', len(calls))
print('前 8 个 (ptr,len):', calls[:8])
# 用真实 dump 回读
dumps=sorted(glob.glob('.probe/cap2/dump_*.bin'), key=os.path.getmtime, reverse=True)
print('可用 dump:', [os.path.basename(x) for x in dumps[:3]])
for dp in dumps[:1]:
    b=open(dp,'rb').read()
    print('--- %s (%d 字节) ---' % (os.path.basename(dp), len(b)))
    for i,(ptr,ln) in enumerate(calls[:8]):
        if ptr+ln <= len(b):
            s=b[ptr:ptr+ln]
            try: txt=s.decode('utf-8')
            except: txt=repr(s)
            print('  #%d ptr=%d len=%d -> %r' % (i, ptr, ln, txt))
        else:
            print('  #%d ptr=%d len=%d -> 超出 dump 范围' % (i, ptr, ln))