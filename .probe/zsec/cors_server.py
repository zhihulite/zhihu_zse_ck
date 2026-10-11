import http.server, socketserver, functools, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *a):
        pass

with socketserver.TCPServer(('127.0.0.1', 8899), H) as httpd:
    print('serving 127.0.0.1:8899 with CORS')
    httpd.serve_forever()
