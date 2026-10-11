import re, json, subprocess

SRC = '.probe/zsec/blobs/eval_11841_service.js'
s = open(SRC, encoding='utf-8', errors='replace').read()

# 1) 收集解码器别名（传递闭包）：_0xXXXX = _0x17a3 或 = 另一个别名
aliases = {'_0x17a3'}
changed = True
while changed:
    changed = False
    for m in re.finditer(r'([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*)\b', s):
        if m.group(2) in aliases and m.group(1) not in aliases:
            aliases.add(m.group(1)); changed = True
print('解码器别名 %d 个: %s' % (len(aliases), sorted(aliases)))

# 2) 取解码表
dec = json.load(open('.probe/zsec/svc_dec.json', encoding='utf-8'))
dec = {int(k): v for k, v in dec.items()}

# 3) 回填：把 <alias>(0xNN) 换成字符串字面量
pat = re.compile(r'\b(' + '|'.join(sorted(map(re.escape, aliases), key=len, reverse=True)) + r')\((0x[0-9a-fA-F]+)\)')
n = [0]

def sub(m):
    v = dec.get(int(m.group(2), 16))
    if v is None:
        return m.group(0)
    n[0] += 1
    return json.dumps(v, ensure_ascii=False)

out = pat.sub(sub, s)
print('回填 %d 处' % n[0])

# 4) 常量折叠（只折叠纯算术括号，且括号内无标识符）
def fold(src):
    rex = re.compile(r'\(([-+*/0-9a-fx\s]+)\)')
    prev = None
    while prev != src:
        prev = src
        def f(m):
            t = m.group(1).strip()
            if not re.match(r'^[-+*/0-9a-fx\s]+$', t): return m.group(0)
            if not re.search(r'[+\-*/]', t): return m.group(0)
            if re.match(r'^(0x[0-9a-f]+|\d+)$', t, re.I): return m.group(0)
            try:
                v = eval(t, {'__builtins__': {}}, {})
                if isinstance(v, int): return '(' + str(v) + ')'
            except Exception:
                pass
            return m.group(0)
        src = rex.sub(f, src)
    return src

out2 = fold(out)
open('.probe/zsec/service.deob2.js', 'w', encoding='utf-8').write(out2)
print('已写 .probe/zsec/service.deob2.js  (%d -> %d 字符)' % (len(s), len(out2)))

# 5) 语法自检
r = subprocess.run(['node', '--check', '.probe/zsec/service.deob2.js'], capture_output=True, text=True)
print('node --check:', 'OK' if r.returncode == 0 else r.stderr[:300])

# 6) 关键点校验
for probe in ('copyBytesToGo', 'apply', 'now'):
    print('  含 %-16s : %d 次' % (probe, out2.count('"' + probe + '"')))
