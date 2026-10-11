import json, subprocess, threading
CMD = ['uvx', '--exclude-newer=1s', 'ida-mcp', 'stdio']
p = subprocess.Popen(CMD, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, encoding='utf8', bufsize=1)
def send(o): p.stdin.write(json.dumps(o) + '\n'); p.stdin.flush()
def rd(t=900):
    out=[None]
    th=threading.Thread(target=lambda: out.__setitem__(0, p.stdout.readline()), daemon=True); th.start(); th.join(t)
    return out[0]
def call(i, name, args):
    send({"jsonrpc":"2.0","id":i,"method":"tools/call","params":{"name":name,"arguments":args}})
    while True:
        l = rd()
        if l is None: return None
        try: o = json.loads(l)
        except: continue
        if o.get('id') == i: return o
send({"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"zcode","version":"1"}}})
rd()
send({"jsonrpc":"2.0","method":"notifications/initialized"})
r = call(2, 'open_database', {"path": r"D:\77\Documents\zse_ck\.probe\zse-ck.wasm"})
print('OPEN:', ('ok' if r and 'error' not in json.dumps(r) else json.dumps(r)[:200]))
code = r'''
import idc, ida_funcs, idautils, ida_bytes
addrs = [0xcbd, 0x12ea, 0x2568, 0x29fe, 0x34ba, 0x4300, 0x56c2]
out = []
for a in addrs:
    fn = ida_funcs.get_func(a)
    if not fn:
        out.append("0x%x: no function" % a); continue
    nm = ida_funcs.get_func_name(fn.start_ea)
    out.append("\n======== 0x%x in fn 0x%x %s (size %d) ========" % (a, fn.start_ea, nm, fn.end_ea - fn.start_ea))
    ea = fn.start_ea; cnt = 0
    while ea < fn.end_ea and cnt < 260:
        out.append("  %08x  %s" % (ea, idc.GetDisasm(ea)))
        ea = idc.next_head(ea, fn.end_ea)
        cnt += 1
        if ea == idc.BADADDR: break
open(r"D:\77\Documents\zse_ck\.probe\vmsvc\loader_dump.txt", "w", encoding="utf8").write("\n".join(out))
print("WROTE", sum(len(x) for x in out))
'''
r2 = call(3, 'execute_python', {"code": code})
print('PY:', json.dumps(r2)[:300] if r2 else 'no resp')
p.terminate()