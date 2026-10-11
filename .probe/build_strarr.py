import re, json, sys
BS=chr(92)
f=sys.argv[1]
s=open(f,encoding='utf8',errors='replace').read()
def grab_fn(src,name):
    i=src.find('function '+name+'(')
    if i<0: return None
    j=src.find('{',i); depth=0; k=j; instr=None
    while k<len(src):
        c=src[k]
        if instr:
            if c==BS: k+=2; continue
            if c==instr: instr=None
        else:
            if c in "'\"": instr=c
            elif c=='{': depth+=1
            elif c=='}':
                depth-=1
                if depth==0: return src[i:k+1]
        k+=1
    return None
fn_arr=grab_fn(s,'_0x1e71')
fn_dec=grab_fn(s,'_0x31f5')
print('arr fn len',len(fn_arr) if fn_arr else None)
print('dec fn len',len(fn_dec) if fn_dec else None)
# rotation iife: find '(function(_0x' ... '}(_0x1e71'
i0=s.find('(function(_0x')
j0=s.find('}(_0x1e71',i0)
if j0<0:
    # find the second arg call
    m=re.search(r'\}\(_0x1e71,\s*[^)]*\)\)', s)
    j0=m.end() if m else -1
    iife=s[i0:j0] if j0>0 else ''
else:
    j0=s.find('))',j0)+2
    iife=s[i0:j0]
print('iife len',len(iife))
js=(fn_arr or '')+chr(10)+(fn_dec or '')+chr(10)+iife+chr(10)+'''
var out=[];for(var i=0x40;i<0x40+4000;i++){try{var v=_0x31f5(i);out.push([i,v]);}catch(e){break;}}
console.log(JSON.stringify(out));
'''
open('.probe/_build_dec_run.js','w',encoding='utf8').write(js)
print('wrote',len(js))