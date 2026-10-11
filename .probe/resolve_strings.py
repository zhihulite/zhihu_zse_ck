import re, json, subprocess, sys, os

BS = chr(92)   # backslash
QUOTES = ('"', "'", '`')


def match_brace(s, i, oc='{', cc='}'):
    """i = index of oc; return index just after the matching cc"""
    d = 0
    n = len(s)
    k = i
    while k < n:
        c = s[k]
        if c in QUOTES:
            q = c
            k += 1
            while k < n:
                if s[k] == BS:
                    k += 2
                    continue
                if s[k] == q:
                    break
                k += 1
        elif c == '/':
            if k + 1 < n and s[k + 1] == '/':
                while k < n and s[k] != '\n':
                    k += 1
            elif k + 1 < n and s[k + 1] == '*':
                j = s.find('*/', k)
                k = (j + 2) if j >= 0 else n
        elif c == oc:
            d += 1
        elif c == cc:
            d -= 1
            if d == 0:
                return k + 1
        k += 1
    raise RuntimeError("unbalanced")


def resolve(path, out_path, tmp='.probe/md5test'):
    s = open(path, encoding='utf8').read()
    dec = None
    dec_end = None
    kind = None
    for m in re.finditer(r'function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{', s):
        body = s[m.end() - 1: match_brace(s, m.end() - 1)]
        sub = re.search(r'=\s*[A-Za-z_$][\w$]*\s*-\s*\(\s*\d+\s*\)', body)
        if not sub:
            continue
        if 'decodeURIComponent' in body:
            kind = 'b64'
        elif re.search(r'\]\s*;\s*return', body):
            kind = 'idx'
        else:
            continue
        dec = m.group(1)
        dec_start = m.start()
        dec_end = match_brace(s, m.end() - 1)
        break
    if not dec:
        return None, "no decoder"
    acc = None
    acc_end = None
    for m in re.finditer(r'function\s+([A-Za-z_$][\w$]*)\s*\(\s*\)\s*\{\s*(?:var|const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*\[', s):
        acc = m.start()
        acc_end = match_brace(s, s.index('{', m.start()))
        break
    if acc is None:
        return None, "no accessor"
    parts = []
    iife = re.search(r'\(function\s*\([^)]*\)\s*\{', s)
    if iife and iife.start() < dec_end:
        body_end = match_brace(s, s.index('{', iife.start()))
        call_end = match_brace(s, body_end, '(', ')') if s[body_end:body_end + 1] == '(' else body_end
        parts.append(s[iife.start():call_end] + ')')
    parts.append(s[acc:acc_end])
    parts.append(s[dec_start:dec_end])
    mach = ';\n'.join(parts)
    os.makedirs(tmp, exist_ok=True)
    open(os.path.join(tmp, 'dec.js'), 'w', encoding='utf8').write(mach + "\nmodule.exports=%s;\n" % dec)
    alias = {dec}
    ch = True
    while ch:
        ch = False
        for m in re.finditer(r'([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*)\s*[,;)]', s):
            if m.group(2) in alias and m.group(1) not in alias:
                alias.add(m.group(1))
                ch = True
    args = sorted({int(m.group(2)) for m in re.finditer(r'([A-Za-z_$][\w$]*)\s*\(\s*(\d{1,4})\s*\)', s) if m.group(1) in alias})
    open(os.path.join(tmp, 'args.json'), 'w').write(json.dumps(args))
    subprocess.run(['node', '.probe/md5test/resolve.js'], check=True, capture_output=True)
    tbl = json.load(open(os.path.join(tmp, 'strings.json')))
    pat = re.compile(r'(?<![\w$.])(?:%s)\s*\(\s*(\d{1,4})\s*\)' % '|'.join(map(re.escape, sorted(alias, key=len, reverse=True))))
    n = [0]

    def rep(m):
        v = tbl.get(m.group(1))
        if v is None:
            return m.group(0)
        n[0] += 1
        return json.dumps(v)

    out = pat.sub(rep, s)
    open(out_path, 'w', encoding='utf8').write(out)
    return (len(args), n[0], len(out)), None


if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    r, e = resolve(src, dst)
    print(("OK " + str(r)) if r else ("SKIP: " + e))
