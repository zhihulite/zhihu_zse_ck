import re, sys, os, json, subprocess

BS = chr(92)


def str_end(s, i):
    q = s[i]
    k = i + 1
    while k < len(s):
        if s[k] == BS:
            k += 2
            continue
        if s[k] == q:
            return k + 1
        k += 1
    raise RuntimeError("unterminated")


def top_literals(s):
    out = []
    for m in re.finditer(r'(?:^|[\n;])\s*(?:const|var|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(["\'])', s):
        i = m.start(2)
        j = str_end(s, i)
        out.append((m.group(1), i, j))
    return out


def rewrite(container, target_name, restored_path, out_path, occurrence=0):
    c = open(container, encoding='utf8').read()
    lits = top_literals(c)
    hits = [(n, i, j) for (n, i, j) in lits if n == target_name]
    if len(hits) <= occurrence:
        return "no %s#%d in %s" % (target_name, occurrence, container)
    n, i, j = hits[occurrence]
    new = open(restored_path, encoding='utf8').read()
    lit = json.dumps(new)          # JS/JSON-compatible escaping
    out = c[:i] + lit + c[j:]
    open(out_path, 'w', encoding='utf8').write(out)
    return "OK %s[%s#%d] %d -> %d literal B, file %d B" % (out_path, n, occurrence, j - i, len(lit), len(out))


if __name__ == '__main__':
    print(rewrite('zse_ck_inner.restored.js', 'SRC0', '.probe/src/inner.SRC0.restored.js', 'zse_ck_inner.deob.js'))
    print(rewrite('zse_ck_orchestrator.restored.js', 'SRC1', '.probe/src/orch.SRC1.restored.js', 'zse_ck_orchestrator.deob.js'))
