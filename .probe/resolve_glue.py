import re, json, subprocess, sys, os
from importlib import util

spec = util.spec_from_file_location('rs', '.probe/resolve_strings.py')
rs = util.module_from_spec(spec)
spec.loader.exec_module(rs)

ORIG = '.probe/eval-8-11841.js'
TARGET = 'zse_ck_service.restored.js'
DST = 'zse_ck_service.deob.js'
tmp = '.probe/md5test'

s = open(ORIG, encoding='utf8').read()
# decoder: body contains decodeURIComponent and a numeric subtraction with parenthesised expr
dec = dec_start = dec_end = None
for m in re.finditer(r'function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{', s):
    body = s[m.end() - 1: rs.match_brace(s, m.end() - 1)]
    if 'decodeURIComponent' in body and re.search(r'-\s*\([^()]{1,120}\)', body):
        dec, dec_start, dec_end = m.group(1), m.start(), rs.match_brace(s, m.end() - 1)
        break
acc = acc_end = None
for m in re.finditer(r'function\s+([A-Za-z_$][\w$]*)\s*\(\s*\)\s*\{\s*(?:var|const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*\[', s):
    acc, acc_end = m.start(), rs.match_brace(s, s.index('{', m.start()))
    break
iife = re.search(r'\(function\s*\([^)]*\)\s*\{', s)
body_end = rs.match_brace(s, s.index('{', iife.start()))
call_end = rs.match_brace(s, body_end, '(', ')') if s[body_end:body_end + 1] == '(' else body_end
mach = s[iife.start():call_end] + ');\n' + s[acc:acc_end] + ';\n' + s[dec_start:dec_end]
print("machinery: decoder=%s  %d B" % (dec, len(mach)))

open(os.path.join(tmp, 'dec.js'), 'w', encoding='utf8').write(mach + "\nmodule.exports=%s;\n" % dec)

# ---- collect decoder-call argument expressions (hex or decimal) from TARGET ----
t = open(TARGET, encoding='utf8').read()
alias = {dec}
ch = True
while ch:
    ch = False
    for m in re.finditer(r'([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*)\s*[,;)]', t):
        if m.group(2) in alias and m.group(1) not in alias:
            alias.add(m.group(1)); ch = True
ARGPAT = r'(0[xX][0-9a-fA-F]+|\d{1,4})'
args = sorted({m.group(2) for m in re.finditer(r'([A-Za-z_$][\w$]*)\s*\(\s*' + ARGPAT + r'\s*\)', t) if m.group(1) in alias})
open(os.path.join(tmp, 'args_raw.json'), 'w').write(json.dumps(args))
print("aliases=%d  distinct args=%d" % (len(alias), len(args)))

subprocess.run(['node', '.probe/md5test/resolve_raw.js'], check=True)
tbl = json.load(open(os.path.join(tmp, 'strings.json')))

pat = re.compile(r'(?<![\w$.])(?:%s)\s*\(\s*(%s)\s*\)' % ('|'.join(map(re.escape, sorted(alias, key=len, reverse=True))), ARGPAT))
n = [0]
def rep(m):
    v = tbl.get(m.group(1))
    if v is None:
        return m.group(0)
    n[0] += 1
    return json.dumps(v)
out = pat.sub(rep, t)
open(DST, 'w', encoding='utf8').write(out)
print("substituted %d sites -> %s (%d B)" % (n[0], DST, len(out)))
