"""Lift a devirtualized CVM program (`js/*.decompiled.js` `RUN()`) back into JS.

The devirt artifact is a per-instruction transcription: every VM op became a JS
statement but the machine shape is intact (A[] registers, S[] operand stack,
`pc = N; continue`).  This pass removes the machine shape where that is provably
safe and falls back to the original form where it is not.

Correctness rules, each learned from a concrete failure:
  * Registers/locals are MUTABLE STATE -> materialise every write into the VM's
    own A[i]/l[i] (blocks that fall back to verbatim form still read them).
    Folding a register value inline duplicates side effects.
  * The operand stack S carries across basic blocks, so it is propagated along
    the CFG by dataflow, not reset per block.
  * Every SUBCALL starts a nested RUN with a FRESH stack, so each nested entry
    point is a dataflow root with S = [].
  * A join whose predecessors disagree on S is resolved by materialising the
    stack slots into phi variables (sN), filled at the end of each predecessor.
  * If a block folds its stack operations, every successor must fold too --
    otherwise the successor reads a runtime stack that no longer changes.
    This is the greatest fixpoint computed below.
"""
import re, sys, json

SRC = sys.argv[1] if len(sys.argv) > 1 else 'js/inner.decompiled.js'
DST = sys.argv[2] if len(sys.argv) > 2 else '.probe/lift/inner.lifted.js'


def Num(n):  return ('num', n)
def Str(s):  return ('str', s)
def V(x):    return ('var', x)
def Raw(x):  return ('raw', x)


def render(e):
    t = e[0]
    if t == 'num':  return repr(e[1])
    if t == 'str':  return json.dumps(e[1])
    if t == 'var':  return e[1]
    if t == 'glob': return e[1]
    if t == 'bin':  return '(%s %s %s)' % (render(e[2]), e[1], render(e[3]))
    if t == 'un':   return '(%s%s)' % (e[1], render(e[2]))
    if t == 'get':
        o, k = e[1], e[2]
        if k[0] == 'str' and re.fullmatch(r'[A-Za-z_$][\w$]*', k[1]):
            return '%s?.%s' % (render(o), k[1])
        return '%s?.[%s]' % (render(o), render(k))
    if t == 'call': return '%s(%s)' % (render(e[1]), ', '.join(render(x) for x in e[2]))
    if t == 'new':  return 'new %s(%s)' % (render(e[1]), ', '.join(render(x) for x in e[2]))
    if t == 'sub':  return 'SUB(%s, %s, A, l, S)' % (e[1], e[2])
    if t == 'raw':  return e[1]
    raise ValueError(t)


def fold_bin(op, a, b):
    if a[0] == 'num' and b[0] == 'num':
        try:
            v = eval('a %s b' % op, {}, {'a': a[1], 'b': b[1]})
            return V('true' if v else 'false') if isinstance(v, bool) else Num(v)
        except Exception:
            pass
    if op == '<<' and a[0] == 'num' and b[0] == 'num':
        return Num((a[1] << b[1]) & 0xFFFFFFFF)
    return ('bin', op, a, b)


def parse_blocks(body):
    starts = [(int(m.group(1)), m.start(), m.end()) for m in re.finditer(r'\n    case (\d+): \{', body)]
    out = []
    for i, (pc, _s, e) in enumerate(starts):
        end = starts[i + 1][1] if i + 1 < len(starts) else len(body)
        out.append((pc, body[e:end]))
    return out


def split_block(txt):
    lines = [l.strip() for l in txt.strip().split('\n') if l.strip()]
    stmts, exits = [], []
    for l in lines:
        if l.startswith('//') or l in ('}', '{'):
            continue
        m = re.fullmatch(r'if \((!?)F\) \{ pc = (\d+); continue; \}', l)
        if m:
            exits.append(('!F' if m.group(1) else 'F', int(m.group(2)))); continue
        m = re.fullmatch(r'pc = (\d+); continue; \}', l)
        if m:
            exits.append((None, int(m.group(1)))); continue
        if l.startswith('return'):
            exits.append(('return', None)); continue
        stmts.append(l[:-1] if l.endswith(';') else l)
    return stmts, exits


class Sym:
    def __init__(self, S=()):
        self.A = {i: Raw('A[%d]' % i) for i in range(4)}
        self.l = {}
        self.S = list(S)
        self.F = None
        self.out = []
        self.amb = False

    def emit(self, s):
        self.out.append(s)

    def setA(self, i, e):
        self.emit('A[%d] = %s;' % (i, render(e)))
        self.A[i] = e if e[0] in ('num', 'str', 'var', 'glob') else Raw('A[%d]' % i)

    def setL(self, i, e):
        self.emit('l[%d] = %s;' % (i, render(e)))
        self.l[i] = e if e[0] in ('num', 'str', 'var', 'glob') else Raw('l[%d]' % i)

    def run(self, stmts):
        for st in stmts:
            try:
                self.step(st)
            except Exception:
                self.amb = True
                self.out.append('/* amb: %s */' % st)

    def step(self, st):
        A, l, S = self.A, self.l, self.S
        m = re.fullmatch(r'A\[(\d)\] = (-?\d+)', st)
        if m:
            self.setA(int(m.group(1)), Num(int(m.group(2)))); return
        m = re.fullmatch(r'A\[(\d)\] = (true|false)', st)
        if m:
            self.setA(int(m.group(1)), V(m.group(2))); return
        m = re.fullmatch(r'A\[(\d)\] = ("(?:[^"\\]|\\.)*")', st)
        if m:
            self.setA(int(m.group(1)), Str(json.loads(m.group(2)))); return
        m = re.fullmatch(r'A\[(\d)\] = (SRC\d+|window|location|document|globalThis)', st)
        if m:
            self.setA(int(m.group(1)), ('glob', m.group(2))); return
        m = re.fullmatch(r'A\[(\d)\] = l\[(\d+)\]', st)
        if m:
            self.setA(int(m.group(1)), l.get(int(m.group(2)), Raw('l[%s]' % m.group(2)))); return
        m = re.fullmatch(r'l\[(\d+)\] = A\[(\d)\]', st)
        if m:
            self.setL(int(m.group(1)), A[int(m.group(2))]); return
        if st.startswith('S.push('):
            S.append(self.expr(st[len('S.push('):-1])); return
        m = re.fullmatch(r'A\[(\d)\] = M_EVAL\(S\.pop\(\)\)', st)
        if m:
            if not S:
                self.amb = True; return
            e = S.pop()
            if e[0] == 'str' and re.fullmatch(r'[\w$.]+', e[1]):
                self.setA(int(m.group(1)), ('glob', e[1]))
            else:
                self.setA(int(m.group(1)), Raw('eval(%s)' % render(e)))
            return
        m = re.fullmatch(r'A\[(\d)\] = M_GET\(A\[(\d)\], S\.pop\(\)\)', st)
        if m:
            if not S:
                self.amb = True; return
            self.setA(int(m.group(1)), ('get', A[int(m.group(2))], S.pop())); return
        m = re.fullmatch(r'\{ const _m = S\.pop\(\); A\[(\d)\] = A\[(\d)\]\[_m\]\(\.\.\.S\.splice\(-(\d+)\)\); \}', st)
        if m:
            i, j, n = int(m.group(1)), int(m.group(2)), int(m.group(3))
            if len(S) < n + 1:
                self.amb = True; return
            mname = S.pop()                      # JS order: pop() runs before splice()
            args = S[-n:] if n else []
            del S[len(S) - n:]
            self.setA(i, ('call', ('get', A[j], mname), args)); return
        m = re.fullmatch(r'\{ const _m = S\.pop\(\); A\[(\d)\] = A\[(\d)\]\[_m\]\(\); \}', st)
        if m:
            if not S:
                self.amb = True; return
            self.setA(int(m.group(1)), ('call', ('get', A[int(m.group(2))], S.pop()), [])); return
        m = re.fullmatch(r'\{ const k = S\.pop\(\), v = S\.pop\(\); M_SET\(A\[(\d)\], k, v\); \}', st)
        if m:
            if len(S) < 2:
                self.amb = True; return
            i = int(m.group(1)); k = S.pop(); v = S.pop()
            self.emit('M_SET(%s, %s, %s);' % (render(A[i]), render(k), render(v)))
            self.A[i] = Raw('A[%d]' % i)
            return
        m = re.fullmatch(r'A\[(\d)\] = new A\[(\d)\]\(\)', st)
        if m:
            self.setA(int(m.group(1)), ('new', A[int(m.group(2))], [])); return
        m = re.fullmatch(r'A\[(\d)\] = new A\[(\d)\]\(\.\.\.S\.splice\(-(\d+)\)\)', st)
        if m:
            i, j, n = int(m.group(1)), int(m.group(2)), int(m.group(3))
            if len(S) < n:
                self.amb = True; return
            args = S[-n:]; del S[len(S) - n:]
            self.setA(i, ('new', A[j], args)); return
        m = re.fullmatch(r'A\[(\d)\] = SUBCALL\(A, l, S, (\d+), (\d+)\)', st)
        if m:
            i, ent, argc = int(m.group(1)), int(m.group(2)), int(m.group(3))
            if len(S) < argc:
                self.amb = True; return
            if argc:
                del S[len(S) - argc:]
            self.setA(i, ('sub', render(A.get(ent, Raw(str(ent)))), argc)); return
        m = re.fullmatch(r'A\[(\d)\] = (typeof |-)?A\[(\d)\](?: (\S+) A\[(\d)\])?', st)
        if m:
            i = int(m.group(1)); src = A[int(m.group(3))]
            if m.group(2) == 'typeof ':
                e = ('un', 'typeof ', src)
            elif m.group(2) == '-':
                e = ('un', '-', src)
            elif m.group(5) is not None:
                e = fold_bin(m.group(4), src, A[int(m.group(5))])
            else:
                e = src
            self.setA(i, e); return
        m = re.fullmatch(r'F = !!A\[(\d)\]', st)
        if m:
            self.F = A[int(m.group(1))]; return
        m = re.fullmatch(r'S\.length = (\d+); F = undefined', st)
        if m:
            del S[int(m.group(1)):]; self.F = None; return
        self.amb = True

    def expr(self, txt):
        txt = txt.strip()
        if txt in ('true', 'false'):
            return V(txt)
        m = re.fullmatch(r'A\[(\d)\]', txt)
        if m:
            return self.A[int(m.group(1))]
        m = re.fullmatch(r'l\[(\d+)\]', txt)
        if m:
            return self.l.get(int(m.group(1)), Raw('l[%s]' % m.group(1)))
        m = re.fullmatch(r'-?\d+', txt)
        if m:
            return Num(int(txt))
        m = re.fullmatch(r'"(?:[^"\\]|\\.)*"', txt)
        if m:
            return Str(json.loads(txt))
        return Raw(txt)


def main():
    src = open(SRC, encoding='utf8').read()
    i = src.index('function RUN(l, D, A, pc)')
    j = src.rindex('default:')
    blocks = parse_blocks(src[i:j])
    blk = {pc: split_block(t) for pc, t in blocks}
    cases = [pc for pc, _ in blocks]
    succ = {pc: [t for _, t in blk[pc][1] if t is not None] for pc in cases}

    # ---- dataflow roots: entry block + every SUBCALL entry (fresh stack) ----
    roots = [cases[0]]
    for pc, txt in blocks:
        for m in re.finditer(r'SUBCALL\(A, l, S, (\d+), \d+\)', txt):
            back = re.findall(r'A\[%s\] = (\d+);' % m.group(1), txt[:m.start()])
            if back:
                roots.append(int(back[-1]))
    roots = sorted({r for r in roots if r in blk})

    # ---- fixpoint: propagate S, recording every predecessor's contribution --
    entryS = {pc: None for pc in cases}
    sources = {pc: [] for pc in cases}
    for r in roots:
        entryS[r] = []
        sources[r].append((None, []))
    changed = True
    while changed:
        changed = False
        for pc in cases:
            es = entryS[pc]
            if es is None or es == 'AMB':
                continue
            sym = Sym(es)
            sym.run(blk[pc][0])
            out_S = list(sym.S)
            for t in succ[pc]:
                cand = out_S
                if entryS.get(t) is None:
                    entryS[t] = cand
                    sources[t].append((pc, cand))
                    changed = True
                elif entryS[t] != 'AMB':
                    sources[t].append((pc, cand))
                    if tuple(render(x) for x in entryS[t]) != tuple(render(x) for x in cand):
                        entryS[t] = 'AMB'
                        changed = True

    # ---- resolve ambiguous joins by materialising stack slots (phi) ----
    fills = {}                      # pred pc -> [(slot, expr)]
    for pc in cases:
        if entryS[pc] != 'AMB':
            continue
        contrib = [(p, c) for p, c in sources[pc] if c is not None]
        if not contrib:
            continue
        width = max(len(c) for _, c in contrib)
        resolved = []
        for k in range(width):
            vals = [c[k] if k < len(c) else Raw('undefined') for _, c in contrib]
            if len({render(v) for v in vals}) == 1:
                resolved.append(vals[0])
            else:
                slot = 's%d_%d' % (pc, k)
                resolved.append(V(slot))
                for (p, c), v in zip(contrib, vals):
                    fills.setdefault(p, []).append((slot, v))
        entryS[pc] = resolved
    reached = sum(1 for pc in cases if entryS[pc] is not None)
    amb = sum(1 for pc in cases if entryS[pc] == 'AMB')

    # ---- liftable set: folding a block forces its successors to fold too ----
    exitS = {}
    for pc in cases:
        es = entryS[pc]
        if es is None or es == 'AMB':
            exitS[pc] = 'AMB'
            continue
        sym = Sym(es)
        sym.run(blk[pc][0])
        exitS[pc] = 'AMB' if sym.amb else list(sym.S)

    liftable = {pc for pc in cases if entryS[pc] not in (None, 'AMB') and exitS[pc] != 'AMB'}
    changed = True
    while changed:
        changed = False
        for pc in list(liftable):
            if exitS[pc] == []:
                continue
            if any(t not in liftable for t in succ[pc]):
                liftable.discard(pc); changed = True

    # ---- emit ----
    out = ['// lifted from %s -- operand-stack folding, registers materialised' % SRC,
           'const DEC_POOL = null;',
           'function M_GET(o, k) { return (o === undefined || o === null) ? undefined : o[k]; }',
           'function M_SET(o, k, v) { if (o !== undefined && o !== null) o[k] = v; return v; }',
           'function M_EVAL(name) { return eval(name); }',
           'function SUB(entry, argc, A, l, S) {',
           '  const args = argc ? S.splice(-argc) : [];',
           '  const cl = [0].concat(l);',
           '  for (let t = 0; t < args.length; t++) cl[t] = args[t];',
           '  const r = RUN(cl, DEC_POOL, undefined, entry);',
           '  const v = r && r.A ? r.A[3] : undefined;',
           '  return typeof v === "number" ? String(v) : v;',
           '}',
           'function SUBCALL(A, l, S, i, argc) { return SUB(A[i], argc, A, l, S); }',
           'function RUN(l, D, A, pc) {',
           '  A = A || [undefined, undefined, undefined, undefined];',
           '  l = l || [];',
           '  const S = []; let F = false; let _n = 0;',
           '  while (true) {',
           '    if (typeof TRACE === "function") TRACE(pc, A, l, S, F, ++_n);',
           '    switch (pc) {']
    n_lifted = n_verbatim = 0
    for pc in cases:
        stmts, exits = blk[pc]
        out.append('    case %d: {' % pc)
        if pc in liftable:
            sym = Sym(entryS[pc])
            sym.run(stmts)
            out.extend('      ' + e for e in sym.out)
            n_lifted += 1
        else:
            out.extend('      ' + s + ';' for s in stmts)
            n_verbatim += 1
        for slot, expr in fills.get(pc, []):
            out.append('      %s = %s;' % (slot, render(expr)))
        if exits and exits[-1][0] == 'return':
            out.append('      return { A: A, l: l }; }')
            continue
        conds = [c for c, _ in exits if c not in (None, 'return')]
        if conds:
            cond = render(Sym(entryS[pc]).F) if pc in liftable and entryS[pc] not in (None, 'AMB') else 'F'
            if conds[0] == '!F':
                cond = '!(%s)' % cond
            out.append('      if (%s) { pc = %d; continue; }' % (cond, exits[0][1]))
        tgt = exits[-1][1] if exits else None
        out.append('      pc = %d; continue; }' % tgt if tgt is not None else '      }')
    out += ['    default: throw new Error("bad pc " + pc);', '    }', '  }', '}',
            'if (typeof module !== "undefined") { module.exports = { RUN: RUN, M_GET: M_GET, M_SET: M_SET, M_EVAL: M_EVAL, SUB: SUB }; }', '']
    open(DST, 'w', encoding='utf8').write('\n'.join(out) + '\n')
    print("roots=%d reached=%d/%d amb=%d | lifted=%d verbatim=%d -> %s"
          % (len(roots), reached, len(cases), amb, n_lifted, n_verbatim, DST))


if __name__ == '__main__':
    main()
