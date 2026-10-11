import re, sys, json

SRC = '.probe/zsec/blobs/eval_11841_service.js'
s = open(SRC, encoding='utf-8', errors='replace').read()

# 1) 取三个部件：解码器 _0x17a3、数组函数 _0x2a91、旋转 IIFE
def grab_func(name):
    i = s.find('function ' + name + '(')
    if i < 0: raise SystemExit('no func ' + name)
    # 大括号配对
    j = s.index('{', i); depth = 0; k = j
    while True:
        if s[k] == '{': depth += 1
        elif s[k] == '}':
            depth -= 1
            if depth == 0: break
        k += 1
    return s[i:k + 1]

dec_src = grab_func('_0x17a3')
arr_src = grab_func('_0x2a91')

# 旋转 IIFE: (function(a,b){...}(_0x2a91,NUM))
m = re.search(r'\(function\(_0x2b06dd,_0x4277c8\)\{.*?\}\(_0x2a91,(\d+)\)\)?', s, re.S)
rot_src = m.group(0)
if rot_src.endswith('))'): rot_src = rot_src[:-1]
print('旋转 IIFE 长度', len(rot_src))

# 2) 在沙箱里跑：先定义函数，再跑旋转，最后暴露解码器
code = dec_src + '\n' + arr_src + '\n' + rot_src + '\n' + 'globalThis.__DEC = _0x17a3; globalThis.__ARR = _0x2a91();'
open('.probe/zsec/svc_prelude.js', 'w', encoding='utf-8').write(code)

import subprocess
r = subprocess.run(['node', '-e',
    "const fs=require('fs'); eval(fs.readFileSync('.probe/zsec/svc_prelude.js','utf8'));"
    "const out={}; for(let i=0x80;i<=0x120;i++){ try{ out[i]=__DEC(i);}catch(e){} }"
    "fs.writeFileSync('.probe/zsec/svc_dec.json', JSON.stringify(out));"
    "console.log('decoded', Object.keys(out).length, 'entries');"
    "console.log('0x93 ->', out[0x93], '| 0x9f ->', out[0x9f], '| 0xb6 ->', out[0xb6]);"],
    capture_output=True, text=True, cwd='.')
print(r.stdout.strip())
if r.stderr.strip(): print('stderr:', r.stderr.strip()[:400])
