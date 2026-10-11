import json, subprocess, os, sys, struct
BASE='.probe/browser-proto7.json'
def patch(k):
    raw=json.load(open(BASE,encoding='utf8'))
    n=0
    for e in raw:
        if e['name']=='runtime.ticks':
            e['ret']=str(179092810025 + k*1000000); n+=1
    cap='.probe/cap_ticks%d.json'%k
    json.dump(raw,open(cap,'w',encoding='utf8'))
    return cap,n
env=dict(os.environ)
k=int(sys.argv[1])
cap,n=patch(k)
env['ZSE_CAPTURE']=cap; env['ZSE_OUT']='_tk%d'%k
r=subprocess.run([sys.executable,'.probe/vmsvc/wdriver_bp.py'],capture_output=True,text=True,env=env,timeout=900)
print('patched ticks x%d -> %s'%(n,cap))
print(r.stdout.strip().split(chr(10))[-3:])