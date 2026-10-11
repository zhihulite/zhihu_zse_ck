import re, json
BS = chr(92)
s = open('.probe/big/blob-818064.bin','rb').read().decode('utf8', errors='replace')

def grab_fn(src, name):
    i = src.find('function ' + name + '(')
    if i < 0: return None
    j = src.find('{', i)
    depth = 0; k = j; instr = None
    while k < len(src):
        c = src[k]
        if instr:
            if c == BS: k += 2; continue
            if c == instr: instr = None
        else:
            if c in "'\"": instr = c
            elif c == '{': depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0: return src[i:k+1]
        k += 1
    return None

fn_arr = grab_fn(s, '_0x5836')
fn_dec = grab_fn(s, '_0x4811')
print('arr fn len', len(fn_arr) if fn_arr else None)
print('dec fn len', len(fn_dec) if fn_dec else None)
# rotation IIFE: from 'var _0x3ba8e2=_0x4811;' up to the '}(_0x5836,' ... '));'
i0 = s.find('(function(_0x334336')
j0 = s.find('}(_0x5836', i0)
j0 = s.find('))', j0) + 2
iife = s[i0:j0]
print('iife head', iife[:120])
print('iife tail', iife[-80:])
js = fn_arr + '\n' + fn_dec + '\n' + iife + '\n' + '''
var out=[];
for (var i=0x6f;i<0x6f+400;i++){ try{ out.push([i,_0x4811(i)]); }catch(e){ out.push([i,null]); } }
console.log(JSON.stringify(out));
'''
open('.probe/big/_dec_run.js','w',encoding='utf8').write(js)
print('wrote _dec_run.js', len(js))