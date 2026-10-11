import json, base64, subprocess, os, sys, zlib
BASE='.probe/browser-proto7.json'
OLD=b'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ZCode/3.14.4 Chrome/146.0.7680.80 Electron/41.0.3 Safari/537.36'
pre=OLD[:96]
env=dict(os.environ)
k0=int(sys.argv[1]); k1=int(sys.argv[2])
for k in range(k0,k1+1):
    tag=('UA%03d'%k).encode()
    NEW=(pre+tag+b'X'*200)[:len(OLD)]
    raw=json.load(open(BASE,encoding='utf8'))
    for e in raw:
        for r in (e.get('post') or []):
            if not r[2]: continue
            b=base64.b64decode(r[2])
            if OLD in b:
                r[2]=base64.b64encode(b.replace(OLD,NEW)).decode()
    cap='.probe/cap_ua%03d.json'%k
    json.dump(raw, open(cap,'w',encoding='utf8'))
    env['ZSE_CAPTURE']=cap; env['ZSE_OUT']='_ua%03d'%k
    subprocess.run([sys.executable,'.probe/vmsvc/wdriver_bp.py'],capture_output=True,text=True,env=env,timeout=900)
    print('ua%03d crc32=%#x done'%(k, zlib.crc32(NEW)&0xffffffff), flush=True)