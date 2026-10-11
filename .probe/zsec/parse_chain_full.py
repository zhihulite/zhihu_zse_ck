# 生成 0..802 的完整 BVM 操作码语义表（旧 BVM_OPCODE_TABLE.txt 只到 255，缺 ~547 个）
import re, json, importlib.util, sys

spec = importlib.util.spec_from_file_location('pc', '.probe/zsec/parse_chain.py')
# 直接复制解析函数，避免执行 parse_chain.py 的副作用
s = open('.probe/zsec/chain.js', encoding='utf-8').read()
BS = chr(92)


def parse_chain(text):
    j = [0]

    def skip_ws():
        while j[0] < len(text) and text[j[0]] in ' \t\r\n':
            j[0] += 1

    def read_balanced():
        d = 0
        st = j[0]
        while j[0] < len(text):
            c = text[j[0]]
            if c in '"\'`':
                q = c
                j[0] += 1
                while j[0] < len(text):
                    if text[j[0]] == BS:
                        j[0] += 2
                        continue
                    if text[j[0]] == q:
                        break
                    j[0] += 1
                j[0] += 1
                continue
            if c == '{':
                d += 1
            elif c == '}':
                d -= 1
                if d == 0:
                    j[0] += 1
                    return text[st + 1:j[0] - 1]
            j[0] += 1
        return text[st + 1:]

    def read_stmt():
        skip_ws()
        if j[0] < len(text) and text[j[0]] == '{':
            return read_balanced()
        st = j[0]
        d = 0
        while j[0] < len(text):
            c = text[j[0]]
            if c in '"\'`':
                q = c
                j[0] += 1
                while j[0] < len(text):
                    if text[j[0]] == BS:
                        j[0] += 2
                        continue
                    if text[j[0]] == q:
                        break
                    j[0] += 1
                j[0] += 1
                continue
            if c in '([{':
                d += 1
            elif c in ')]}':
                d -= 1
            elif c == ';' and d == 0:
                j[0] += 1
                return text[st:j[0] - 1]
            j[0] += 1
        return text[st:]

    skip_ws()
    m = re.match(r'if\(this\.word<=(\d+)\)', text[j[0]:])
    if not m:
        return None
    thr = int(m.group(1))
    j[0] += m.end()
    A = read_stmt()
    skip_ws()
    B = None
    if text[j[0]:j[0] + 4] == 'else':
        j[0] += 4
        B = read_stmt()
    return (thr, A, B)


def leaf_for(tree, w):
    n = tree
    d = 0
    while n:
        d += 1
        if d > 400:
            return '<deep>'
        thr, A, B = n
        if w <= thr:
            sub = parse_chain(A)
            if sub:
                n = sub
            else:
                return A.strip()
        else:
            if B is None:
                return None
            sub = parse_chain(B)
            if sub:
                n = sub
            else:
                return B.strip()
    return None


tree = parse_chain(s)
assert tree is not None, 'chain 解析失败'
MAXW = 802
mp = {w: leaf_for(tree, w) for w in range(MAXW + 1)}
nz = [w for w in range(MAXW + 1) if mp[w] and not str(mp[w]).startswith('<')]
print('word 空间 0..%d，有语义 %d 个，无解 %d 个' % (MAXW, len(nz), MAXW + 1 - len(nz)))

# 归并：相邻同语义的 word 合并成区间
runs = []
i = 0
while i <= MAXW:
    j = i
    while j + 1 <= MAXW and mp[j + 1] == mp[i]:
        j += 1
    runs.append((i, j, mp[i]))
    i = j + 1
print('归并后 %d 个区间' % len(runs))

with open('BVM_OPCODE_TABLE_FULL.txt', 'w', encoding='utf-8') as f:
    f.write('# zse_ck JS 侧 BVM 完整操作码语义表（word 0..802，覆盖 program 全部取值）\n')
    f.write('# 生成: .probe/zsec/parse_chain_full.py  源: zse_ck_cvm.restored.js 的分派链\n')
    for w in range(MAXW + 1):
        f.write('%5d  %s\n' % (w, str(mp[w])))
json.dump({str(k): v for k, v in mp.items()}, open('.probe/zsec/leafmap_full.json', 'w', encoding='utf-8'), ensure_ascii=False)

print()
print('=== 之前查不到的 word 现在的结果 ===')
for w in [404, 407, 555, 169, 368, 597, 723, 70, 478, 110, 17, 481, 151, 714, 659, 165, 205, 609, 275, 163, 178, 193, 196, 800, 802]:
    print('  w=%-5d %s' % (w, str(mp.get(w))[:130]))
