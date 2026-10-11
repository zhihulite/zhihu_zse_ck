import re, json

s = open('.probe/zsec/chain.js', encoding='utf-8').read()
BS = chr(92)  # backslash


def parse_chain(text):
    """在 text 上解析 if(this.word<=N)<stmt>[else<stmt>] 链，返回树。"""
    j = [0]

    def skip_ws():
        while j[0] < len(text) and text[j[0]] in ' \t\r\n':
            j[0] += 1

    def read_balanced():
        # text[j] == '{'
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
        if d > 300:
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
print("tree ok:", tree is not None, " thr:", tree[0] if tree else None)
if tree:
    print("A 前 80:", repr(tree[1][:80]))
mp = {w: leaf_for(tree, w) for w in range(256)}
nz = [w for w in range(256) if mp[w] and not str(mp[w]).startswith('<')]
print("有语义的 word:", len(nz))
json.dump({str(k): v for k, v in mp.items()}, open('.probe/zsec/leafmap.json', 'w'))

d = open('.probe/zsec/prog_live.bin', 'rb').read()


def wd(pc):
    return d[pc * 4]


print()
print("=== pc 4372..4400 的 word -> 语义 ===")
for pc in range(4372, 4401):
    v = wd(pc)
    t = mp.get(v) or '?'
    print("  %5d w=%-3d %s" % (pc, v, str(t)[:120].replace('\n', ' ')))
