#!/usr/bin/env python3
# 批量解析 (*main._0oOoOO)._XXXXXX$bound 的 104 个方法体
# 输入: .probe/wt/zse.wat（TinyGo 0.31.2，wabt 生成，带真名）
# 输出: GOVM_HANDLERS.md + .probe/zsec/govm_handlers_raw.json
import re, json, collections

WAT = '.probe/wt/zse.wat'
src = open(WAT, encoding='utf-8', errors='replace').read()

# ---- 顶层切分 (module 的直接子项) ----
m0 = src.find('(module')
i = m0 + len('(module'); top = []; depth = 1; start = None
while i < len(src):
    c = src[i]
    if c == '(':
        if depth == 1: start = i
        depth += 1
    elif c == ')':
        depth -= 1
        if depth == 0: break
        if depth == 1 and start is not None:
            top.append(src[start:i+1]); start = None
    i += 1

funcs = {}
for t in top:
    m = re.match(r'\(func (\$[A-Za-z0-9_.$*]+)', t)
    if m: funcs[m.group(1)] = t

BOUND = {n: b for n, b in funcs.items() if n.endswith('$bound') and '_0oOoOO_' in n}
print('104 方法数 =', len(BOUND))

def analyze(name, body):
    flat = re.sub(r'\s+', ' ', body)
    params = re.findall(r'\(param \$(\w+) i32\)', flat)
    locals_ = re.findall(r'\(local \$(\w+) i(\d+)\)', flat)
    calls = sorted(set(re.findall(r'call (\$[A-Za-z0-9_.$*]+)', flat)))
    ind = flat.count('call_indirect')
    # 字段偏移：i32.load/store offset=N （8 字节槽用 <<3，字段用 offset=）
    offs = sorted(set(int(x) for x in re.findall(r'(?:i32\.(?:load|store)|i64\.(?:load|store))\s+offset=(\d+)', flat)))
    # 常量
    consts = sorted(set(int(x) for x in re.findall(r'i32\.const (-?\d+)', flat)))
    small = [c for c in consts if 0 <= c <= 40]
    big = [c for c in consts if c >= 4096]
    ops = collections.Counter()
    for op in ['i32.shl','i32.shr_s','i32.shr_u','i32.or','i32.xor','i32.and',
               'i32.add','i32.sub','i32.mul','i32.eq','i32.ne','i32.lt_u','i32.gt_u',
               'if','block','loop','br_table','memory.copy','memory.fill','i64.store','i64.load']:
        k = len(re.findall(re.escape(op) + r'\b', flat))
        if k: ops[op] = k
    return {
        'name': name.replace('$_*main._0oOoOO_.', '').replace('$', ''),
        'wat_bytes': len(body),
        'n_params': len(params),
        'n_locals': len(locals_),
        'calls': [c for c in calls],
        'call_indirect': ind,
        'offsets': offs,
        'const_small': small,
        'const_big': big,
        'ops': dict(ops),
    }

rows = [analyze(n, b) for n, b in BOUND.items()]
rows.sort(key=lambda r: r['name'])

# ---- 归类 ----
def cls(r):
    c = ' '.join(r['calls'])
    o = r['ops']
    if 'i32.shr_s' in o and 'i32.or' in o: return '右移拼装（位提取）'
    if 'i32.shl' in o and 'i32.or' in o:   return '左移拼装（位提取）'
    if '_00oooO' in c:                      return '调用解释器 _00oooO'
    if '_OOo0o0' in c:                      return '调用 _OOo0o0'
    if '_O0o0Oo' in c:                      return '调用 _O0o0Oo'
    if 'syscall' in c or 'js.Value' in c or 'copyBytesToGo' in c: return 'JS 桥接（syscall/js）'
    if 'runtime.alloc' in c:                return '内存分配'
    return '其他'
for r in rows: r['cls'] = cls(r)

groups = collections.defaultdict(list)
for r in rows: groups[r['cls']].append(r)

json.dump(rows, open('.probe/zsec/govm_handlers_raw.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

md = ['# Go VM 的 104 个 `$bound` 方法 —— 批量解析',
      '',
      '> 来源：`.probe/wt/zse.wat`（TinyGo 0.31.2）。脚本 `tools/parse104.py`。',
      '> 原始数据：`.probe/zsec/govm_handlers_raw.json`。',
      '']
md.append('## 归类统计\n')
md.append('| 类别 | 个数 |')
md.append('|---|---|')
for k, v in sorted(groups.items(), key=lambda x: -len(x[1])):
    md.append('| %s | %d |' % (k, len(v)))
md.append('')

for k, v in sorted(groups.items(), key=lambda x: -len(x[1])):
    md.append('## %s（%d 个）\n' % (k, len(v)))
    md.append('| 方法 | wasm B | 参 | 局 | VM字段偏移 | 小常量 | 大常量(字符串ptr) | 调用 | 位运算 |')
    md.append('|---|---|---|---|---|---|---|---|---|')
    for r in v:
        md.append('| `%s` | %d | %d | %d | %s | %s | %s | %s | %s |' % (
            r['name'], r['wat_bytes'], r['n_params'], r['n_locals'],
            ','.join(str(x) for x in r['offsets'][:10]),
            ','.join(str(x) for x in r['const_small'][:8]),
            ','.join(str(x) for x in r['const_big'][:4]),
            ', '.join(c.replace('$_*main._0oOoOO_.', '').replace('$_', '') for c in r['calls'])[:90],
            ' '.join('%s×%d' % (a, b) for a, b in r['ops'].items() if a.startswith('i32.') and a not in ('i32.add', 'i32.sub'))[:40],
        ))
    md.append('')

open('docs/GOVM_HANDLERS.md', 'w', encoding='utf-8').write('\n'.join(md))
print('-> docs/GOVM_HANDLERS.md')
print()
for k, v in sorted(groups.items(), key=lambda x: -len(x[1])):
    print('  %-26s %d' % (k, len(v)))
