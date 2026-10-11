import re, json, os, hashlib

def extract_src(layer_file):
    """从还原件里抽出 SRC0/SRC1... 字符串字面量（用 JS 引擎解析最稳）"""
    s = open(layer_file, encoding='utf-8', errors='replace').read()
    names = sorted(set(re.findall(r'\bconst (SRC\d+)\s*=', s)) | set(re.findall(r'\bvar (SRC\d+)\s*=', s)))
    return names, s

def js_eval_strs(layer_file, names):
    """在 node 里把 SRC* 求值出来"""
    code = ("const fs=require('fs');const src=fs.readFileSync(%s,'utf8');"
            "const out={};const re=/\\b(?:const|var)\\s+(SRC\\d+)\\s*=\\s*(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')/g;"
            "let m;while((m=re.exec(src))){try{out[m[1]]=eval(m[2]);}catch(e){out[m[1]]='ERR '+e.message;}}"
            "fs.writeFileSync(%s,JSON.stringify(out));"
            "console.log(Object.entries(out).map(([k,v])=>k+':'+(typeof v==='string'?v.length:'?')).join(' '));"
            % (json.dumps(layer_file), json.dumps('.probe/zsec/_srcs.json')))
    import subprocess
    r = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    print('   ', r.stdout.strip() or r.stderr.strip()[:200])
    try:
        return json.load(open('.probe/zsec/_srcs.json', encoding='utf-8'))
    except Exception:
        return {}

LAYERS = ['zse_ck_fingerprint', 'zse_ck_orchestrator', 'zse_ck_inner', 'zse_ck_payload', 'zse_ck_cvm']
CAPS = {os.path.basename(p): open(p, 'rb').read() for p in
        ['.probe/zsec/blobs/eval_11841_service.js', '.probe/zsec/blobs/eval_136041.js',
         '.probe/zsec/blobs/eval_62501.js', '.probe/zsec/blobs/jsvmp_27264.js']}
cap_hashes = {k: hashlib.sha256(v).hexdigest()[:16] for k, v in CAPS.items()}
print('捕获源 sha256[:16]:', cap_hashes)
print()

for lay in LAYERS:
    f = lay + '.restored.js'
    print('=== %s (%d 字节) ===' % (f, os.path.getsize(f)))
    names, _ = extract_src(f)
    print('   SRC 变量:', names)
    srcs = js_eval_strs(f, names)
    for k, v in srcs.items():
        if not isinstance(v, str):
            print('   %s: 非字符串' % k); continue
        b = v.encode('utf-8', 'replace')
        h = hashlib.sha256(b).hexdigest()[:16]
        match = [name for name, ch in cap_hashes.items() if ch == h]
        print('   %-6s len=%-8d sha16=%s  %s' % (k, len(b), h, ('与捕获源一致: ' + match[0]) if match else '（无对应捕获源）'))
    print()
