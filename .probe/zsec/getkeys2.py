import re, os, sys, subprocess
W='.probe/zsec/b_vm.wasm'
def extract():
    d=open('.probe/zsec/vmfull_1.bin','rb').read()
    ents=[]
    for m in re.finditer(rb'[0-9]{8,10}', d):
        ents.append((m.start(), int(m.group())))
    # 找连续 32 组「相邻两值相等」的 (v,v) 对
    pairs=[i for i in range(len(ents)-1) if ents[i][1]==ents[i+1][1]]
    # 连续段
    segs=[]; cur=[pairs[0]] if pairs else []
    for i in range(1,len(pairs)):
        if pairs[i]-pairs[i-1] in (2,3): cur.append(pairs[i])
        else: segs.append(cur); cur=[pairs[i]]
    if cur: segs.append(cur)
    for sg in segs:
        if len(sg)>=32:
            return [ents[i][1] for i in sg[:32]]
    return None
def run(env=None):
    e=dict(os.environ); e['NO_DUMP']='1'; e['WASM_FILE']=W
    if env: e.update(env)
    subprocess.run([sys.executable,'.probe/zsec/wdriver_flipb.py'], env=e, capture_output=True)
    return extract()
if __name__=='__main__':
    k=run()
    print("count:", None if k is None else len(k))
    if k: print([hex(v) for v in k])
