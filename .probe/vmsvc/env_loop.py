import json, base64, subprocess, os, re, sys, struct, importlib.util
BASE='.probe/browser-proto7.json'
spec=importlib.util.spec_from_file_location('tool','py/zse_ck_tool.py')
tool=importlib.util.module_from_spec(spec); spec.loader.exec_module(tool)
def mutate(raw, k):
    n=0
    for e in raw:
        for r in (e.get('post') or []):
            if not r[2]: continue
            b=base64.b64decode(r[2])
            nb=b
            if b==b'function Window() { [native code] }': nb=b'function Window() { [NATIVE-CODE] }'
            elif b==b'function Function() { [native code] }': nb=b'function Function() { [NATIVE-CODE] }'
            elif b==b'function toString() { [native code] }': nb=b'function toString() { [NATIVE-CODE] }'
            elif b==b'function Window() { [native code] }': nb=b'function Window() { [NATIVE-CODE] }'
            if nb!=b: r[2]=base64.b64encode(nb).decode(); n+=1
    # 再把探针源码里的名字改掉（长度不变）
    subs=[(b"typeof process !== 'undefined'", b"typeof PROCESS !== 'undefined'"),
          (b"typeof require !== 'undefined'", b"typeof REQUIRE !== 'undefined'"),
          (b"typeof module !== 'undefined'",  b"typeof MODULE  !== 'undefined'"),
          (b"typeof JSDOM !== 'undefined'",   b"typeof JSDOMX !== 'undefined'"),
          (b"typeof v_saf !== 'undefined'",   b"typeof V_SAF  !== 'undefined'")]
    for e in raw:
        for r in (e.get('post') or []):
            if not r[2]: continue
            b=base64.b64decode(r[2]); nb=b
            for a,c in subs:
                if a in nb and len(a)==len(c): nb=nb.replace(a,c); n+=1
            if nb!=b: r[2]=base64.b64encode(nb).decode()
    return n
for k in range(1,4):
    raw=json.load(open(BASE,encoding='utf8'))
    n=mutate(raw,k)
    cap='.probe/cap_env%d.json'%k
    json.dump(raw,open(cap,'w',encoding='utf8'))
    env=dict(os.environ); env['ZSE_CAPTURE']=cap; env['ZSE_OUT']='_env%d'%k
    r=subprocess.run([sys.executable,'.probe/vmsvc/wdriver_bp.py'],capture_output=True,text=True,env=env,timeout=900)
    tr='.probe/vmsvc/op_trace_env%d.bin'%k; mem='.probe/vmsvc/final_memory_env%d.bin'%k
    if not os.path.exists(mem): print('env%d: no mem'%k); continue
    # build meta json in the tool's format
    d=open(tr,'rb').read(); m=len(d)//64
    log=[[struct.unpack_from('<I',d,i*64)[0], struct.unpack_from('<I',d,i*64+4)[0],
          struct.unpack_from('<I',d,i*64+12)[0], struct.unpack_from('<I',d,i*64+16)[0],
          struct.unpack_from('<I',d,i*64+20)[0], struct.unpack_from('<I',d,i*64+24)[0]] for i in range(m)]
    mj='.probe/vmsvc/env%d.meta.json'%k
    json.dump({'kind':'x','log':log}, open(mj,'w'))
    try:
        p=tool.extract(mj, mem)
        print('env%d(mut=%d): rec=%s mask=%#x iv=%r xreg=%#x token_ok=%s'%(
            k,n,p['rec93'][:20],p['mask'],p['iv'],p['xreg'],tool.generate_token(p,p['rec93'])==p['token']))
    except SystemExit as e:
        mm=open(mem,'rb').read()
        rec=re.search(rb'[\x20-\x7e]{48}[0-9a-f]{32}z[0-9a-f]{12}', mm)
        tk=set(re.findall(rb'005_[A-Za-z0-9+/=]{128}', mm))
        print('env%d(mut=%d): extract failed (%s) rec=%s tok=%s'%(
            k,n,e, rec.group()[:20] if rec else None, (list(tk)[0][:26] if tk else None)))