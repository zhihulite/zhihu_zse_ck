"""Structure a pc-dispatcher CFG back into if/else + while.

Input: the basic blocks of a devirtualized CVM program (already expression-lifted
where possible) plus their CFG.  Output: nested JS with real control flow instead
of `switch (pc) { case N: ... pc = M; continue; }`.

Algorithm: dominators -> natural loops -> recursive emission with the immediate
post-dominator as the join point.  Irreducible or already-emitted regions fall
back to a comment so the output is always valid JS.
"""


def _reachable(entry, succ):
    seen, stack = set(), [entry]
    while stack:
        c = stack.pop()
        if c in seen or c not in succ:
            continue
        seen.add(c)
        stack.extend(succ[c])
    return seen


def dominators(entry, succ, nodes):
    dom = {n: set(nodes) for n in nodes}
    dom[entry] = {entry}
    preds = {n: [] for n in nodes}
    for n in nodes:
        for t in succ.get(n, []):
            if t in preds:
                preds[t].append(n)
    changed = True
    while changed:
        changed = False
        for n in nodes:
            if n == entry:
                continue
            new = set(nodes)
            for p in preds[n]:
                new &= dom[p]
            new |= {n}
            if new != dom[n]:
                dom[n] = new
                changed = True
    return dom


def postdominators(entry, succ, nodes, exits):
    """pd[n] = {n} union (intersection of pd[successor]) on the REVERSE CFG;
    nodes with no successor (or that return) get the virtual EXIT as successor."""
    V = 'EXIT'
    alln = list(nodes) + [V]
    pd = {n: set(alln) for n in alln}
    pd[V] = {V}
    changed = True
    while changed:
        changed = False
        for n in nodes:
            ss = [t for t in succ.get(n, []) if t in pd]
            if not ss or n in exits:
                ss = ss + [V]
            new = set(alln)
            for t in ss:
                new &= pd[t]
            new |= {n}
            if new != pd[n]:
                pd[n] = new
                changed = True
    return pd


def structure(entry, succ, conds, body_of, is_return, order):
    nodes = [n for n in order if n in _reachable(entry, succ)]
    exits = {n for n in nodes if is_return.get(n) or not succ.get(n)}
    dom = dominators(entry, succ, nodes)
    pd = postdominators(entry, succ, nodes, exits)
    ipdom = {}
    for n in nodes:
        cands = [m for m in pd[n] if m != n and m != 'EXIT']
        ipdom[n] = max(cands, key=lambda m: len(pd[m])) if cands else None

    # natural loops: back edge n -> h when h dominates n
    loops = {}
    for n in nodes:
        for t in succ.get(n, []):
            if t in dom.get(n, set()) and t in nodes:
                body = {t, n}
                stack = [n]
                while stack:
                    x = stack.pop()
                    for p in nodes:
                        if x in succ.get(p, []) and p not in body:
                            body.add(p)
                            stack.append(p)
                loops.setdefault(t, set()).update(body)
    header_of = {}
    for h, b in loops.items():
        for n in b:
            header_of.setdefault(n, h)

    out = []
    emitted = set()

    def emit_one(pc, indent, in_loop):
        """emit block pc's body + terminator; return the next pc to fall into"""
        pad = '  ' * indent
        for line in body_of.get(pc, []):
            out.append(pad + line)
        if is_return.get(pc) or not succ.get(pc):
            out.append('%sreturn { A: A, l: l };' % pad)
            return None
        ss = list(dict.fromkeys(succ[pc]))
        if len(ss) == 1:
            nxt = ss[0]
            if in_loop is not None and nxt == in_loop:
                out.append('%scontinue L%d;' % (pad, in_loop))
                return None
            return nxt
        cond, target = conds.get(pc, (None, ss[0]))
        if target not in ss:
            target = ss[0]
        other = ss[1] if target == ss[0] else ss[0]
        join = ipdom.get(pc) or 'EXIT'
        out.append('%sif (%s) {' % (pad, cond))
        emit_seq(target, join, indent + 1, in_loop)
        if other != join:
            out.append('%s} else {' % pad)
            emit_seq(other, join, indent + 1, in_loop)
        out.append('%s}' % pad)
        return None if join == 'EXIT' else join

    def emit_seq(pc, stop, indent, in_loop, depth=0):
        pad = '  ' * indent
        guard = 0
        while pc is not None and pc != stop and pc in nodes and guard < 100000:
            guard += 1
            if pc in emitted:
                return
            # a loop header is emitted INSIDE its loop (check before marking,
            # otherwise the body comes out empty and `while (true) {}` spins)
            if pc in loops and not loops[pc] <= emitted:
                hdr = pc
                emitted.add(hdr)
                out.append('%sL%d: while (true) {' % (pad, hdr))
                nxt = emit_one(hdr, indent + 1, hdr)
                if nxt is not None:
                    emit_seq(nxt, None, indent + 1, hdr, depth + 1)
                out.append('%s}   // end loop L%d' % (pad, hdr))
                return
            emitted.add(pc)
            pc = emit_one(pc, indent, in_loop)

    emit_seq(entry, None, 0, None)
    return out
