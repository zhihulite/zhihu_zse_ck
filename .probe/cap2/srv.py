import http.server, socketserver, os, json, time, base64
OUT = r"D:\77\Documents\zse_ck\.probe\cap2"
class H(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()
    def do_GET(self):
        self.send_response(200); self._cors()
        self.send_header('Content-Type','application/javascript'); self.end_headers()
        self.wfile.write(b'/* ok */')
    def do_POST(self):
        n = int(self.headers.get('Content-Length') or 0)
        body = self.rfile.read(n)
        name = 'dump_%d.bin' % int(time.time()*1000)
        try:
            j = json.loads(body)
            b = base64.b64decode(j.get('b64',''))
            meta = {k:v for k,v in j.items() if k!='b64'}
            open(os.path.join(OUT, name), 'wb').write(b)
            open(os.path.join(OUT, name + '.meta.json'), 'w', encoding='utf8').write(json.dumps(meta))
            print('saved', name, len(b), 'meta', meta, flush=True)
        except Exception as e:
            open(os.path.join(OUT, 'raw_%d.bin'%int(time.time()*1000)), 'wb').write(body)
            print('raw saved', len(body), e, flush=True)
        self.send_response(200); self._cors(); self.end_headers(); self.wfile.write(b'ok')
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('127.0.0.1', 8777), H) as httpd:
    print('listening 8777', flush=True)
    httpd.serve_forever()
