"""WAT -> readable pseudocode decompiler.

The wasm module (TinyGo-compiled Go) was disassembled to WAT with Go symbol
names intact.  WAT is a linear stack machine with *structured* control flow
(block/loop/if/else/end + br/br_if), so the work here is:
  * fold the operand stack into expressions,
  * turn block/loop/if into JS blocks / while / if-else,
  * map br/br_if to labelled break/continue,
  * name locals from the Go-ish names the linker left in.

Verification is structural: every instruction must be handled (no silent drop),
the operand stack must stay consistent (no underflow), and the output must be
balanced and syntactically valid JS.
"""
import re, sys, json, collections

import os as _os
WAT = _os.environ.get('ZSE_WAT', '.probe/wt/zse.wat')
OUT = _os.environ.get('ZSE_DECOMPILED_OUT', '.probe/wt/zse.decompiled.js')

BIN = {
    'i32.add': '+', 'i32.sub': '-', 'i32.mul': '*', 'i32.and': '&', 'i32.or': '|',
    'i32.xor': '^', 'i32.shl': '<<', 'i32.shr_u': '>>>', 'i32.shr_s': '>>',
    'i32.div_u': 'IDIV', 'i32.div_s': 'IDIV', 'i32.rem_u': 'IREM', 'i32.rem_s': 'IREM',
    'i64.add': '+', 'i64.sub': '-', 'i64.mul': '*', 'i64.and': '&', 'i64.or': '|',
    'i64.xor': '^', 'i64.shl': '<<', 'i64.shr_u': 'USHR64', 'i64.shr_s': '>>',
    'i64.div_u': 'UDIV64', 'i64.div_s': 'IDIV64', 'i64.rem_u': 'UREM64', 'i64.rem_s': 'IREM64',
    'f64.add': '+', 'f64.sub': '-', 'f64.mul': '*', 'f64.div': '/',
    'i32.eq': '===', 'i32.ne': '!==', 'i32.lt_s': '<', 'i32.lt_u': 'ULT',
    'i32.gt_s': '>', 'i32.gt_u': 'UGT', 'i32.le_s': '<=', 'i32.le_u': 'ULE',
    'i32.ge_s': '>=', 'i32.ge_u': 'UGE',
    'i64.eq': '===', 'i64.ne': '!==', 'i64.lt_s': '<', 'i64.lt_u': 'ULT64',
    'i64.gt_s': '>', 'i64.gt_u': 'UGT64', 'i64.le_s': '<=', 'i64.le_u': 'ULE64',
    'i64.ge_s': '>=', 'i64.ge_u': 'UGE64',
    'f64.eq': '===', 'f64.ne': '!==', 'f64.lt': '<', 'f64.gt': '>',
    'f64.le': '<=', 'f64.ge': '>=',
}
UN = {
    'i32.eqz': ('!', ''), 'i64.eqz': ('!', ''),
    'i32.clz': ('clz32', 'fn'), 'i32.ctz': ('ctz32', 'fn'), 'i32.popcnt': ('popcnt32', 'fn'),
    'i32.extend8_s': ('i8', 'fn'), 'i32.extend16_s': ('i16', 'fn'),
    # i64.extend_i32_u 必须 **零扩展**：JS 里 i32 结果是有符号数，直接 BigInt(x) 会符号扩展，
    #   把 0x8d0c5fe5 变成 -72f3a01b（真机是 8d0c5fe5）。见 extU32/extS32 定义。
    'i64.extend_i32_u': ('extU32', 'fn'), 'i64.extend_i32_s': ('extS32', 'fn'),
    'i32.wrap_i64': ('wrap32', 'fn'),
    'f64.convert_i32_s': ('Number', 'fn'), 'f64.convert_i32_u': ('Number', 'fn'),
    'f64.convert_i64_s': ('Number', 'fn'), 'f64.convert_i64_u': ('Number', 'fn'),
    'f64.sqrt': ('Math.sqrt', 'fn'), 'f64.abs': ('Math.abs', 'fn'),
    'f64.floor': ('Math.floor', 'fn'), 'f64.ceil': ('Math.ceil', 'fn'),
    'f64.nearest': ('Math.round', 'fn'), 'f64.trunc': ('Math.trunc', 'fn'),
    'f64.neg': ('-', 'pre'),
    'i64.extend8_s': ('i8_64', 'fn'), 'i64.extend16_s': ('i16_64', 'fn'), 'i64.extend32_s': ('i32_64', 'fn'),
    'i64.trunc_sat_f64_s': ('BigInt', 'fn'), 'i64.trunc_sat_f64_u': ('BigInt', 'fn'),
    'i32.trunc_sat_f64_s': ('trunc32', 'fn'), 'i32.trunc_sat_f64_u': ('trunc32', 'fn'),
    'f32.convert_i32_s': ('Number', 'fn'), 'f32.convert_i32_u': ('Number', 'fn'),
    'f32.demote_f64': ('f32', 'fn'), 'f64.promote_f32': ('f64', 'fn'),
    'f64.copysign': ('copysign', 'fn'), 'f64.min': ('Math.min', 'fn'), 'f64.max': ('Math.max', 'fn'),
    'f32.min': ('Math.min', 'fn'), 'f32.max': ('Math.max', 'fn'),
    'f32.sqrt': ('Math.sqrt', 'fn'), 'f32.abs': ('Math.abs', 'fn'),
    'f32.neg': ('-', 'pre'), 'f32.eq': ('===', 'pre'), 'f32.lt': ('<', 'pre'), 'f32.gt': ('>', 'pre'),
    'f32.le': ('<=', 'pre'), 'f32.ge': ('>=', 'pre'), 'f32.ne': ('!==', 'pre'),
}
LOADS = {'i32.load': 'M32', 'i64.load': 'M64', 'f64.load': 'F64',
         'i32.load8_u': 'M8', 'i32.load8_s': 'M8s', 'i32.load16_u': 'M16', 'i32.load16_s': 'M16s',
         'i64.load8_u': 'M8', 'i64.load16_u': 'M16', 'i64.load32_u': 'M32', 'i64.load8_s': 'M8s', 'i64.load16_s': 'M16s', 'i64.load32_s': 'M32s', 'f32.load': 'F32'}
STORES = {'i32.store': 'M32', 'i64.store': 'M64', 'f64.store': 'F64',
          'i32.store8': 'M8', 'i32.store16': 'M16',
          'i64.store8': 'M8', 'i64.store16': 'M16', 'i64.store32': 'M32', 'f32.store': 'F32'}


def floatlit(v):
    if v in ('inf', '+inf'):
        return 'Infinity'
    if v == '-inf':
        return '-Infinity'
    if 'nan' in v.lower():
        return 'NaN'
    try:
        if 'p' in v.lower() or v.lower().lstrip('-').startswith('0x'):
            return repr(float.fromhex(v))
    except Exception:
        pass
    return v


MK = chr(0)          # marker: this stack entry is a call with a result


def _b64(x):
    """i64 语境：裸整数字面量补 'n'，其余包 BigInt(...)（已是 BigInt 的保持原样）。"""
    x = x.strip()
    if x.endswith('n') or x.startswith(MK):
        return x
    if re.fullmatch(r'-?\d+', x):
        return x + 'n'
    if re.fullmatch(r'-?\d+\.\d+([eE][+-]?\d+)?', x):
        return 'BigInt(%s)' % x
    return 'BigInt(%s)' % x


def mangle(n):
    return re.sub(r'[^A-Za-z0-9_$]', '_', n)


def parse_types(text):
    """type index -> (nparams, nresults); func name -> (nparams, nresults)"""
    types = {}
    for m in re.finditer(r'\(type \$t(\d+) \(func([^)]*)\)\)', text):
        ps = len(re.findall(r'param', m.group(2)))
        # count actual param entries
        ps = len(re.findall(r'(?:param\s+[\w$]+\s+)?', ''))  # placeholder
        seg = m.group(2)
        ps = len(re.findall(r'\bparam\b', seg))
        rs = 1 if 'result' in seg else 0
        types['$t' + m.group(1)] = (ps, rs)
    # refine: count types inside param group
    for m in re.finditer(r'\(type \$t(\d+) \(func \(param((?: [\w$]+)+)\)( \(result [\w$]+\))?\)\)', text):
        types['$t' + m.group(1)] = (len(m.group(2).split()), 1 if m.group(3) else 0)
    for m in re.finditer(r'\(type \$t(\d+) \(func(?: \(param((?: [\w$]+)+)\))?(?: \(result [\w$]+\))?\)\)', text):
        ps = len(m.group(2).split()) if m.group(2) else 0
        rs = 1 if m.group(0).count('result') else 0
        types['$t' + m.group(1)] = (ps, rs)
    sig = {}
    for m in re.finditer(r'\(func \$([\w./$:*\[\]<>,+-]+) \(type \$t(\d+)\)', text):
        sig[m.group(1)] = types.get('$t' + m.group(2), (0, 0))
    for m in re.finditer(r'\(import "[^"]*" "([^"]*)" \(func \$([\w./$:*\[\]<>,+-]+) \(type \$t(\d+)\)', text):
        sig[m.group(2)] = types.get('$t' + m.group(3), (0, 0))
    return sig, types


def funcs(text):
    lines = text.split('\n')
    starts = [i for i, l in enumerate(lines) if l.startswith('  (func ')]
    out = []
    for k, a in enumerate(starts):
        b = starts[k + 1] if k + 1 < len(starts) else len(lines)
        head = lines[a]
        name = re.search(r'\(func \$([^\s]+)', head)
        out.append((name.group(1) if name else 'anon', head, lines[a + 1:b]))
    return out


def decompile(name, head, body, sig, types, stats):
    out, ind = [], 0
    stack = []
    frames = []          # (kind, label, indent, info-dict)
    ifres_n = [0]        # 带结果的 if 的临时变量计数器
    brn = [0]            # 带结果的 block 的临时变量计数器（br 携带值）
    tmp_n = [0]          # hoist 用的临时变量计数器

    def emit(s):
        out.append('  ' * ind + s)

    def pop():
        e = stack.pop() if stack else '?/*underflow*/'
        return e[1:] if e.startswith(MK) else e

    def top(n):
        return stack[-n:] if len(stack) >= n else stack[:]

    def hoist(name):
        """local.set/tee 会**覆盖**该变量。若模拟栈上还有引用它的表达式，
        必须先把那些表达式落成临时量 —— 否则 emit 时读到的是新值。
        实测踩到：`local.tee $l4` 把 l4 从「旧指针」改成「长度」，于是
        `memory.copy` 的 src 被写成「长度」而不是「旧指针」。"""
        for i, e in enumerate(stack):
            if e.startswith(MK):
                continue
            if re.search(r'(?<![\w$])%s(?![\w$])' % re.escape(name), e):
                t = '_h%d' % tmp_n[0]; tmp_n[0] += 1
                emit('%s = %s;' % (t, e))
                stack[i] = t

    for raw in body:
        t = raw.strip()
        if not t:
            continue
        while t.endswith(')'):          # the function's closing paren rides on the last line
            t = t[:-1].rstrip()
        if not t or t.startswith(('(local', '(param', '(result', '(type', '(data', '(export', '(memory', '(global', '(table', '(elem', '(import', '(start', '(func')):
            continue
        parts = t.split(None, 1)
        op = parts[0]
        rest = parts[1] if len(parts) > 1 else ''

        if op == 'block':
            lab = rest.split()[0]
            mres = re.search(r'\(result ([\w.]+)', rest)
            binfo = {'base': len(stack), 'res': mres.group(1) if mres else None, 'tmp': None}
            if binfo['res']:
                # wasm 的 block 可以带结果，`br $B` 会**携带一个值**给块出口。
                #   旧实现直接发 `break $B;`，把携带值丢在模拟栈上 ⇒ 出口处只能读到
                #   「落空路径」的值。实测：strconv.ParseUint 成功路径的 `l6 = 0` 被丢掉，
                #   于是它对合法输入也报 error，调用方走「回退字符串」分支，
                #   最终在异或的类型断言处 panic。
                brn[0] += 1
                binfo['tmp'] = '_br%d' % brn[0]
                emit('let %s;' % binfo['tmp'])
            frames.append(('block', lab, ind, binfo))
            emit('%s: {' % lab); ind += 1
        elif op == 'loop':
            lab = rest.split()[0]
            frames.append(('loop', lab, ind, {}))
            emit('%s: while (true) {' % lab); ind += 1
        elif op == 'if':
            lab = rest.split()[0]
            cond = pop()
            mres = re.search(r'\(result ([\w.]+)', rest)
            info = {'base': len(stack), 'res': mres.group(1) if mres else None, 'tmp': None}
            if info['res']:
                # 带结果的 if：wasm 里它**产出值**，必须落到临时变量再压栈。
                #   旧实现把它当普通语句 if，then 分支的值被丢掉（GC 扫描回绕就丢在这里）
                ifres_n[0] += 1
                info['tmp'] = '_ifr%d' % ifres_n[0]
                emit('let %s;' % info['tmp'])
            frames.append(('if', lab, ind, info))
            emit('if (%s) {' % cond); ind += 1
        elif op == 'else':
            kind, lab, oi, info = frames[-1]
            if info.get('res'):
                if len(stack) > info['base']:
                    v = stack.pop()
                    emit('%s = %s;' % (info['tmp'], v[1:] if v.startswith(MK) else v))
                del stack[info['base']:]
            ind -= 1
            emit('} else {')
            ind += 1
        elif op == 'end':
            if frames:
                kind, lab, oi, info = frames.pop()
                if kind == 'if' and info.get('res'):
                    if len(stack) > info['base']:
                        v = stack.pop()
                        emit('%s = %s;' % (info['tmp'], v[1:] if v.startswith(MK) else v))
                    del stack[info['base']:]
                    ind -= 1
                    emit('}')
                    stack.append(info['tmp'])
                else:
                    if kind == 'block' and info.get('res'):
                        if len(stack) > info['base']:
                            v = stack.pop()
                            emit('%s = %s;' % (info['tmp'], v[1:] if v.startswith(MK) else v))
                        del stack[info['base']:]
                    if kind == 'loop':
                        # wasm 的 loop 靠「落到 end」退出；反编译成 while(true) 后，
                        # 若末尾不是无条件回跳，就必须补 break，否则会无限转（本项目踩过的坑）
                        last = next((x for x in reversed(out)
                                     if x.strip() and not x.strip().startswith('/*')), '')
                        if not last.strip().startswith('continue %s;' % lab):
                            ind -= 1
                            emit('break %s;' % lab)
                            ind += 1
                    ind -= 1
                    emit('}')
                    if kind == 'block' and info.get('res'):
                        stack.append(info['tmp'])
            else:
                emit('/* end */')
        elif op == 'br':
            lab = rest.split()[0]
            tgt = next((f for f in reversed(frames) if f[1] == lab), None)
            if tgt and tgt[0] == 'block' and tgt[3].get('res') and len(stack) > tgt[3]['base']:
                v = stack.pop()
                emit('%s = %s;' % (tgt[3]['tmp'], v[1:] if v.startswith(MK) else v))
            emit(('continue %s;' % lab) if (tgt and tgt[0] == 'loop') else ('break %s;' % lab))
        elif op == 'br_if':
            lab = rest.split()[0]
            cond = pop()
            tgt = next((f for f in reversed(frames) if f[1] == lab), None)
            if tgt and tgt[0] == 'block' and tgt[3].get('res') and len(stack) > tgt[3]['base']:
                v = stack.pop()
                t = '_h%d' % tmp_n[0]; tmp_n[0] += 1
                emit('%s = %s;' % (t, v[1:] if v.startswith(MK) else v))
                emit('if (%s) { %s = %s; break %s; }' % (cond, tgt[3]['tmp'], t, lab))
                stack.append(t)
            else:
                emit('if (%s) %s' % (cond, ('continue %s;' % lab) if (tgt and tgt[0] == 'loop') else ('break %s;' % lab)))
        elif op == 'return':
            emit('return%s;' % ((' ' + pop()) if stack else ''))
            stack = []
        elif op == 'unreachable':
            emit('throw new Error("unreachable");')
        elif op == 'nop':
            pass
        elif op == 'drop':
            if stack:
                e = stack.pop()
                if e.startswith(MK):
                    emit(e[1:] + ';')      # the call had side effects: keep it
        elif op in ('local.get', 'global.get'):
            v = rest.strip()
            stack.append('sp' if v == '$__stack_pointer' else v.lstrip('$'))
        elif op in ('local.set', 'global.set'):
            v = 'sp' if rest.strip() == '$__stack_pointer' else rest.strip().lstrip('$')
            hoist(v)
            emit('%s = %s;' % (v, pop()))
        elif op == 'local.tee':
            v = rest.strip().lstrip('$')
            hoist(v)
            emit('%s = %s;' % (v, pop()))
            stack.append(v)
        elif op.endswith('.const'):
            v = rest.split()[0]
            if op.startswith('f'):
                stack.append(floatlit(v))
            elif op.startswith('i64'):
                # i64 常量必须是 BigInt：NaN-box 的 js.Value 超出 2^53，用 Number 会丢精度
                stack.append(_b64(v))
            else:
                stack.append(v)
        elif op in BIN:
            b, a = pop(), pop()
            if op.startswith('i64'):
                a, b = _b64(a), _b64(b)
            o = BIN[op]
            if o in ('ULT', 'UGT', 'ULE', 'UGE', 'ULT64', 'UGT64', 'ULE64', 'UGE64'):
                fn = {'ULT': 'ult', 'UGT': 'ugt', 'ULE': 'ule', 'UGE': 'uge',
                      'ULT64': 'ult64', 'UGT64': 'ugt64', 'ULE64': 'ule64', 'UGE64': 'uge64'}[o]
                stack.append('%s(%s, %s)' % (fn, a, b))
            elif o == 'USHR64':
                stack.append('ushr64(%s, %s)' % (a, b))
            elif o == 'UDIV64':
                stack.append('udiv64(%s, %s)' % (a, b))
            elif o == 'UREM64':
                stack.append('(BigInt.asUintN(64, BigInt(%s)) %% BigInt.asUintN(64, BigInt(%s)))' % (a, b))
            elif o == 'IDIV':
                stack.append('idiv(%s, %s)' % (a, b))
            elif o == 'IREM':
                stack.append('irem(%s, %s)' % (a, b))
            elif o == 'IDIV64':
                stack.append('(BigInt(%s) / BigInt(%s))' % (a, b))
            elif o == 'IREM64':
                stack.append('(BigInt(%s) %% BigInt(%s))' % (a, b))
            else:
                stack.append('(%s %s %s)' % (a, o, b))
        elif op in UN:
            f, kind = UN[op]
            a = pop()
            stack.append(('(%s%s)' % (f, a)) if kind == 'pre' else ('%s(%s)' % (f, a)))
        elif op == 'select':
            c, b, a = pop(), pop(), pop()
            stack.append('(%s ? %s : %s)' % (c, a, b))
        elif op in LOADS:
            a = pop()
            off = re.search(r'offset=(\d+)', rest)
            stack.append('%s[%s]' % (LOADS[op], a if not off or off.group(1) == '0' else '%s + %s' % (a, off.group(1))))
        elif op in STORES:
            val = pop(); ptr = pop()
            off = re.search(r'offset=(\d+)', rest)
            emit('%s[%s] = %s;' % (STORES[op], ptr if not off or off.group(1) == '0' else '%s + %s' % (ptr, off.group(1)), val))
        elif op == 'memory.size':
            stack.append('memSize()')
        elif op == 'memory.grow':
            stack.append('memGrow(%s)' % pop())
        elif op == 'call':
            f = rest.strip()
            n, r = sig.get(f.lstrip('$'), (0, 0))
            args = [pop() for _ in range(n)][::-1] if n else []
            call = '%s(%s)' % (mangle(f.lstrip('$')), ', '.join(args))
            if r:
                stack.append(MK + call)
            else:
                emit(call + ';')
        elif op == 'br_table':
            labs = rest.split()
            idx = pop()
            emit('switch (%s) {' % idx)
            for k, lab in enumerate(labs[:-1]):
                tgt = next((f for f in reversed(frames) if f[1] == lab), None)
                emit('  case %d: %s' % (k, ('continue %s;' % lab) if (tgt and tgt[0] == 'loop') else ('break %s;' % lab)))
            lab = labs[-1] if labs else '?'
            tgt = next((f for f in reversed(frames) if f[1] == lab), None)
            emit('  default: %s' % (('continue %s;' % lab) if (tgt and tgt[0] == 'loop') else ('break %s;' % lab)))
            emit('}')
        elif op == 'memory.fill':
            n, v, d = pop(), pop(), pop()
            emit('memFill(%s, %s, %s);' % (d, v, n))
        elif op == 'memory.copy':
            n, src, d = pop(), pop(), pop()
            emit('memCopy(%s, %s, %s);' % (d, src, n))
        elif op in ('i64.reinterpret_f64', 'f64.reinterpret_i64', 'i32.reinterpret_f32',
                    'f32.reinterpret_i32', 'f64.promote_f32', 'f32.demote_f64'):
            a = pop()
            stack.append('%s(%s)' % (op.replace('.', '_'), a))
        elif op == 'call_indirect':
            stats['call_indirect'] += 1
            # 形如: call_indirect $T0 (type $t2)  —— 把实参从栈上带出来
            # 注意：上面的循环会剥掉行尾 ')'，所以不能要求右括号
            mt = re.search(r'\(type \$t(\d+)', rest)
            np, nr = types.get('$t' + mt.group(1), (0, 0)) if mt else (0, 0)
            idx = pop() if stack else '0'
            args = [pop() for _ in range(np)] if stack else []
            args = [x[1:] if x.startswith(MK) else x for x in reversed(args)]
            idx = idx[1:] if idx.startswith(MK) else idx
            call = 'callIndirect(%s, [%s])' % (idx, ', '.join(args))
            # 无返回值的 call_indirect 必须**立即落成语句**：若只压栈等待消费，
            #   而它本就没有结果，这一句会被永久留在栈上 ⇒ 整条调用被静默丢弃
            if nr:
                stack.append(MK + call)
            else:
                emit(call + ';')
        else:
            stats['unhandled'][op] += 1
            emit('/* UNHANDLED %s */' % t)
    while ind > 0:
        ind -= 1
        emit('}')
    if stack:
        v = stack[-1]
        emit('return %s;' % (v[1:] if v.startswith(MK) else v))
    if tmp_n[0]:
        # hoist 产生的快照临时量必须在函数顶部声明：它们可能在某个分支里赋值、
        # 在分支外被读（模拟栈不按块作用域），不声明会直接 ReferenceError
        out.insert(0, 'let ' + ', '.join('_h%d = 0' % i for i in range(tmp_n[0])) + ';')
    return out


def main():
    text = open(WAT, encoding='utf8').read()
    sig, types = parse_types(text)
    stats = {'unhandled': collections.Counter(), 'call_indirect': 0}
    res = {}
    for name, head, body in funcs(text):
        res[name] = decompile(name, head, body, sig, types, stats)
    # emit
    NL = '\n'
    outp = ['// decompiled from .probe/wt/zse.wat (TinyGo 0.31.2)',
            '// memory model: M8/M16/M32/M64 = typed views, F64 = float64 view, sp = __stack_pointer',
            '// locals keep the linker names (pN = param, lN = local); ? = stack underflow', '']
    for name, head, body in funcs(text):
        ps = re.findall(r'\(param (\$[\w]+)', head)
        rs = 'result' in head
        outp.append('function %s(%s)%s {' % (
            mangle(name),
            ', '.join(p.lstrip('$') for p in ps), ' /* -> ' + re.search(r'\(result ([\w]+)', head).group(1) + ' */' if rs else ''))
        outp.extend(res[name])
        outp.append('}')
        outp.append('')
    open(OUT, 'w', encoding='utf8').write(NL.join(outp) + NL)
    print("functions: %d" % len(res))
    print("unhandled mnemonics: %d  %s" % (len(stats['unhandled']), dict(stats['unhandled'].most_common(10))))
    print("call_indirect: %d" % stats['call_indirect'])
    print("output lines: %d" % len(outp))


if __name__ == '__main__':
    main()
