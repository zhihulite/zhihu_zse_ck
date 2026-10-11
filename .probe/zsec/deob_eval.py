import re, json, subprocess, sys

def grab_func(s, name):
    i = s.find('function ' + name + '(')
    if i < 0: return None
    k = s.index('{', i); depth = 0
    while True:
        if s[k] == '{': depth += 1
        elif s[k] == '}':
            depth -= 1
            if depth == 0: break
        k += 1
    return s[i:k + 1]

def deob(path, out_path, tag):
    s = open(path, encoding='utf-8', errors='replace').read()
    # 解码器名 = 出现在 <ident>(0x..) 里、且被定义为 function 的那个
    dec_name = None
    for m in re.finditer(r'function (_0x[0-9a-f]+)\(', s):
        cand = m.group(1)
        if re.search(re.escape(cand) + r'\(0x[0-9a-f]+\)', s):
            dec_name = cand; break
    if not dec_name:
        print(tag, '未找到解码器'); return
    arr_name = None
    for m in re.finditer(r'function (_0x[0-9a-f]+)\(\)', s):
        if m.group(1) != dec_name: arr_name = m.group(1); break
    print('%s 解码器=%s 数组=%s' % (tag, dec_name, arr_name))

    dec_src = grab_func(s, dec_name)
    arr_src = grab_func(s, arr_name)

    # 旋转 IIFE: 从 '<arr_name>()' 往前找 '(function(' 到 '}(arr_name,NUM))'
    m = re.search(r'\(function\(_0x[0-9a-f]+,_0x[0-9a-f]+\)\{.*?\}\(_' + arr_name.lstrip('_') + r',', s, re.S)
    if not m:
        m = re.search(r'\(function\(_0x[0-9a-f]+,_0x[0-9a-f]+\)\{.*?\}\(' + re.escape(arr_name) + r',', s, re.S)
    rot = None
    if m:
        k = s.index(')', s.index('}', m.start()) + 1) if False else None
        # 从匹配尾部继续找右括号
        tail = s[m.end():]
        k2 = tail.index(')')
        rot = s[m.start():m.end() + k2 + 1]
        if rot.count('(') > rot.count(')'): rot += ')'
    print('  旋转 IIFE:', 'OK len=%d' % len(rot) if rot else 'NOT FOUND')

    # 别名（传递闭包）
    aliases = {dec_name}
    changed = True
    while changed:
        changed = False
        for mm in re.finditer(r'([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*)\b', s):
            if mm.group(2) in aliases and mm.group(1) not in aliases:
                aliases.add(mm.group(1)); changed = True

    prelude = dec_src + '\n' + arr_src + '\n' + (rot or '') + '\n' + \
        'globalThis.__DEC=%s;' % dec_name
    open('.probe/zsec/_tmp_prelude.js', 'w', encoding='utf-8').write(prelude)
    idxs = sorted(set(int(x, 16) for x in re.findall(r'\(0x([0-9a-f]+)\)', s)))
    node = ("const fs=require('fs');eval(fs.readFileSync('.probe/zsec/_tmp_prelude.js','utf8'));"
            "const idx=%s;const o={};for(const i of idx){try{o[i]=__DEC(i);}catch(e){}}"
            "fs.writeFileSync('.probe/zsec/_tmp_dec.json',JSON.stringify(o));"
            "console.log('decoded',Object.keys(o).length,'/',idx.length);" % json.dumps(idxs))
    r = subprocess.run(['node', '-e', node], capture_output=True, text=True)
    print('  ', r.stdout.strip() or r.stderr.strip()[:200])
    dec = {int(k): v for k, v in json.load(open('.probe/zsec/_tmp_dec.json', encoding='utf-8')).items()}

    pat = re.compile(r'\b(' + '|'.join(sorted(map(re.escape, aliases), key=len, reverse=True)) + r')\((0x[0-9a-fA-F]+)\)')
    cnt = [0]
    def sub(mm):
        v = dec.get(int(mm.group(2), 16))
        if v is None: return mm.group(0)
        cnt[0] += 1
        return json.dumps(v, ensure_ascii=False)
    out = pat.sub(sub, s)
    print('   回填 %d 处；剩余 _0x 调用 %d' % (cnt[0], len(re.findall(r'_0x[0-9a-f]{3,7}\(0x[0-9a-f]+\)', out))))
    open(out_path, 'w', encoding='utf-8').write(out)
    rr = subprocess.run(['node', '--check', out_path], capture_output=True, text=True)
    print('   node --check:', 'OK' if rr.returncode == 0 else rr.stderr[:200])

deob('.probe/zsec/blobs/eval_136041.js', '.probe/zsec/eval_136041.deob.js', 'eval_136041')
deob('.probe/zsec/blobs/eval_62501.js', '.probe/zsec/eval_62501.deob.js', 'eval_62501')
