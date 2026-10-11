import re, sys, os, subprocess, json
W='.probe/zsec/b_vm.wasm'
def run(env=None):
    e=dict(os.environ); e['NO_DUMP']='1'; e['WASM_FILE']=W
    if env: e.update(env)
    subprocess.run([sys.executable,'.probe/zsec/wdriver_flipb.py'], env=e, capture_output=True)
    d=open('.probe/zsec/vmfull_1.bin','rb').read()
    lo,hi=0x155900,0x157000
    out=[]
    for m in re.finditer(rb'[0-9]{8,10}', d[lo:hi]):
        v=int(m.group())
        if not out or out[-1]!=v: out.append(v)
    return out
if __name__=='__main__':
    ks=run()
    print("count:", len(ks))
    print([hex(v) for v in ks])
