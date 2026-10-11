# 精确抽出 copyBytesToGo 的 7 个分支体（else 分支，花括号配平）
import re
s = open('.probe/lift/service.lifted.js', encoding='utf-8').read()
L = s.split('\n')


def match_brace(txt, start):
    """start = index of '{'；返回匹配 '}' 之后的位置"""
    d = 0
    i = start
    while i < len(txt):
        c = txt[i]
        if c in '"\'':
            q = c; i += 1
            while i < len(txt) and txt[i] != q:
                if txt[i] == '\\': i += 1
                i += 1
        elif c == '{': d += 1
        elif c == '}':
            d -= 1
            if d == 0: return i + 1
        i += 1
    return len(txt)


marks = ['1022', '1024', '1026', '1028', '1030', '1032', '1034']
out = []
for mk in marks:
    # 找 `tX = "<mk>";` 后紧跟的比较
    m = re.search(r'\n(\s*)t\d+ = "' + mk + r'";\n', s)
    if not m:
        print('=== %s 未找到' % mk); continue
    seg = s[m.end():m.end() + 400]
    mm = re.search(r'if \(!\(t\d+\)\) \{\n', seg)
    if not mm:
        print('=== %s 无 if 形态' % mk); continue
    # 找 else
    e = re.search(r'\}\s*else\s*\{', seg[mm.end():])
    if not e:
        print('=== %s 无 else' % mk); continue
    bstart = mm.end() + e.end()          # 指向 '{' 之后
    body = seg[bstart:match_brace(seg, bstart - 1)]
    body = '\n'.join(x for x in body.split('\n') if 'typeof TRACE' not in x)
    out.append((mk, body))
    print('=' * 26, 'marker', mk, '（%d 行）' % len(body.split('\n')))
    print(body.strip())
    print()

open('.probe/zsec/cbtg_branches.txt', 'w', encoding='utf-8').write(
    '\n\n'.join('=== %s ===\n%s' % (mk, b) for mk, b in out))
print('已写 .probe/zsec/cbtg_branches.txt')
