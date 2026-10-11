import re, os, sys, subprocess
def rec_of(env=None):
    e=dict(os.environ); e['NO_DUMP']='1'; e['WASM_FILE']='.probe/zsec/b_vm.wasm'
    if env: e.update(env)
    subprocess.run([sys.executable,'.probe/zsec/wdriver_flipb.py'], env=e, capture_output=True)
    d=open('.probe/zsec/vmfull_1.bin','rb').read()
    m=re.search(rb'([0-9a-f]{48})([0-9a-f]{32})z([0-9a-f]{12})', d)
    return m.group(0).decode() if m else None
if __name__=='__main__':
    print(rec_of())