import json, subprocess, sys, threading, time
CMD = ['uvx', '--exclude-newer=1s', 'ida-mcp', 'stdio']
p = subprocess.Popen(CMD, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, encoding='utf8', bufsize=1)
def send(obj):
    p.stdin.write(json.dumps(obj) + '\n'); p.stdin.flush()
def readline(timeout=120):
    out = [None]
    def rd(): out[0] = p.stdout.readline()
    t = threading.Thread(target=rd, daemon=True); t.start(); t.join(timeout)
    return out[0]
send({"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"zcode","version":"1.0"}}})
print('INIT:', readline()[:400])
send({"jsonrpc":"2.0","method":"notifications/initialized"})
send({"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}})
line = readline()
try:
    tools = json.loads(line)['result']['tools']
    print('TOOLS:', len(tools))
    for t in tools:
        print('  -', t['name'], '::', (t.get('description') or '')[:90])
except Exception as e:
    print('parse err', e, line[:500] if line else None)
p.terminate()