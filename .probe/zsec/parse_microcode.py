# -*- coding: utf-8 -*-
"""把 VM 类（BVM/CVM）的 `z` 微码二分派发树展开成 opcode 表。

实测派发形态：
    this.z=function(pc){ ... while(!![]){ this.word=this.program[pc++]||-1;
        if(this.word<0)return;
        try{ if(this.word<=K){ 左 } else{ 右 } } catch(_){ ... } } }

关键：`if` 的 then 分支**可能没有花括号**（`if(this.word<=3)STMT;else{…}`），
  所以不能假定 `{`。then 分支用「同层扫描到 `;`」定界。

叶子 = 最内层语句。每个叶子对应的 opcode 由二分路径唯一确定（单点或小区间）。
"""
import io, re, json, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else 'zse_ck_cvm.restored.js'
OUT = sys.argv[2] if len(sys.argv) > 2 else '.probe/zsec/microcode_ops.json'
s = io.open(SRC, encoding='utf-8', errors='replace').read()

i = s.find('this.z=function(pc)')
assert i > 0, 'z 派发未找到'
j = s.find('try{', i)
assert j > 0

OPEN, CLOSE = '([{', ')]}'

def match_brace(t, k):
    assert t[k] == '{', (k, t[k:k+24])
    d = 0
    while k < len(t):
        if t[k] == '{':
            d += 1
        elif t[k] == '}':
            d -= 1
            if d == 0:
                return k
        k += 1
    raise ValueError('unbalanced brace')

def scan_to_semi(t, k):
    """从 k 起扫到同层 `;`，返回该 `;` 的下标（跳过字符串/括号内）"""
    d = 0; q = None
    while k < len(t):
        c = t[k]
        if q:
            if c == '\\':
                k += 2; continue
            if c == q:
                q = None
        elif c in '"\'`':
            q = c
        elif c in OPEN:
            d += 1
        elif c in CLOSE:
            d -= 1
        elif c == ';' and d == 0:
            return k
        k += 1
    raise ValueError('no semicolon')

leaves = []
nodes = [0]

def parse_arm(t, a, b, lo, hi):
    """解析 [a,b) 里的一条「臂」：可能是 if 链、块、或叶子语句"""
    while a < b and t[a] in ' \n\r\t':
        a += 1
    while b > a and t[b - 1] in ' \n\r\t':
        b -= 1
    if a >= b:
        return
    seg = t[a:b]
    m = re.match(r'if\(this\.word<=(\d+)\)', seg)
    if not m:
        leaves.append((lo, hi, seg))
        return
    nodes[0] += 1
    K = int(m.group(1))
    p = a + m.end()
    while p < b and t[p] in ' \n\r\t':
        p += 1
    if t[p] == '{':
        pe = match_brace(t, p)
        then = (p + 1, pe)
        q = pe + 1
    else:
        se = scan_to_semi(t, p)
        then = (p, se + 1)
        q = se + 1
    while q < b and t[q] in ' \n\r\t':
        q += 1
    if t[q:q + 4] == 'else':
        q += 4
        while q < b and t[q] in ' \n\r\t':
            q += 1
        if t[q] == '{':
            qe = match_brace(t, q)
            els = (q + 1, qe)
        else:
            els = (q, b)
    else:
        els = (q, q)
    parse_arm(t, then[0], then[1], lo, min(hi, K))
    parse_arm(t, els[0], els[1], max(lo, K + 1), hi)

p = j + 4
m = re.match(r'\s*if\(this\.word<=(\d+)\)', s[p:p + 40])
assert m, s[p:p + 60]
K0 = int(m.group(1))
p0 = p + m.end()
while s[p0] in ' \n\r\t':
    p0 += 1
assert s[p0] == '{'
pe0 = match_brace(s, p0)
parse_arm(s, p0 + 1, pe0, 0, K0)
q0 = pe0 + 1
while s[q0] in ' \n\r\t':
    q0 += 1
if s[q0:q0 + 4] == 'else':
    q0 += 4
    while s[q0] in ' \n\r\t':
        q0 += 1
    if s[q0] == '{':
        qe0 = match_brace(s, q0)
        parse_arm(s, q0 + 1, qe0, K0 + 1, 4096)

print('派发节点 %d 个，叶子 %d 个' % (nodes[0], len(leaves)))
if leaves:
    lo_all = min(l for l, h, _ in leaves)
    hi_all = max(h for l, h, _ in leaves)
    print('opcode 覆盖 %d..%d' % (lo_all, hi_all))
    single = [(l, b) for l, h, b in leaves if l == h]
    print('单点叶子 %d 个' % len(single))
    json.dump([{'op': l, 'hi': h, 'body': b} for l, h, b in leaves],
              io.open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('已写', OUT)
    for l, b in single[:16]:
        print('  op %-4d %s' % (l, b[:100]))
