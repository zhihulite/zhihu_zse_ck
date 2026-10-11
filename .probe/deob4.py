import re, json
BS = chr(92)
s = open('.probe/big/blob-818064.bin','rb').read().decode('utf8', errors='replace')
tbl = dict((int(a), b) for a, b in json.load(open('.probe/big/_dec_out.json')) if b is not None)
print('table entries', len(tbl))
def repl(m):
    i = int(m.group(1), 16)
    v = tbl.get(i)
    if v is None: return m.group(0)
    return json.dumps(v)
out = re.sub(r'_0x4811\((0x[0-9a-fA-F]+)\)', repl, s)
open('.probe/big/deob.js','w',encoding='utf8').write(out)
print('deob len', len(out), 'remaining calls', len(re.findall(r'_0x4811\(', out)))