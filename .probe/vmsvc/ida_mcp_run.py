import json, subprocess, threading, sys
CMD = ['uvx', '--exclude-newer=1s', 'ida-mcp', 'stdio']
p = subprocess.Popen(CMD, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, encoding='utf8', bufsize=1)
def send(o): p.stdin.write(json.dumps(o) + '\n'); p.stdin.flush()
def rd(t=600):
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
print('OPEN:', json.dumps(r)[:300] if r else 'no resp')
code = r'''
import ida_hexrays, ida_funcs, ida_auto
ida_auto.auto_wait()
out = []
for ea in (0xe021, 0xe0ee, 0x11171, 0x111e0, 0x11233, 0x11e7d, 0x125b1):
    n = ida_funcs.get_func_name(ea)
    out.append("\n======== %08x %s ========" % (ea, n))
    try:
        cf = ida_hexrays.decompile(ea)
        out.append(str(cf) if cf else "<none>")
    except Exception as e:
        out.append("<hexrays err: %s>" % e)
open(r"D:\77\Documents\zse_ck\.probe\vmsvc\hexrays_7methods.txt", "w", encoding="utf8").write("\n".join(out))
print("WROTE", sum(len(x) for x in out))
'''
r2 = call(3, 'execute_python', {"code": code})
print('PY:', json.dumps(r2)[:400] if r2 else 'no resp')
p.terminate()