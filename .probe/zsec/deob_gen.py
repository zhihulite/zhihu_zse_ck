import json, re

res = json.load(open('.probe/zsec/pool_decoded.json', encoding='utf-8'))
pool = [r['text'] for r in res]
src = pool[2]
BASE = 341  # _0x258f(n) = pool[n - 341]

print('源码长度', len(src), '池条目', len(pool))
print('池索引范围: %d..%d' % (BASE, BASE + len(pool) - 1))

# 找源码里的解码器定义
for m in re.finditer(r'function _0x258f\(', src):
    print('  _0x258f 定义 @%d: %s' % (m.start(), repr(src[m.start():m.start() + 120])))

# 统计所有 0xNNN 实参落在池范围内的调用
cands = re.findall(r'(_0x[0-9a-fA-F]+)\((\d+|0x[0-9a-fA-F]+)\)', src)
inrange = [(n, a) for n, a in cands if BASE <= int(a, 16 if a.startswith('0x') else 10) < BASE + len(pool)]
print('实参落在池范围的调用: %d / %d' % (len(inrange), len(cands)))
names = {}
for n, a in inrange:
    names[n] = names.get(n, 0) + 1
print('涉及的函数名:', sorted(names.items(), key=lambda x: -x[1])[:12])


def deob(text):
    def rep(m):
        a = int(m.group(2), 16 if m.group(2).startswith('0x') else 10)
        i = a - BASE
        if 0 <= i < len(pool) and pool[i] is not None:
            return json.dumps(pool[i], ensure_ascii=False)
        return m.group(0)
    return re.sub(r'(_0x[0-9a-fA-F]+)\((\d+|0x[0-9a-fA-F]+)\)', rep, text)


out = deob(src)
open('.probe/zsec/generated_js.deob.js', 'w', encoding='utf-8').write(out)
print()
print('去混淆后长度', len(out), '（替换 %d 处）' % (len(inrange)))
print('残留 _0x 调用:', len(re.findall(r'_0x[0-9a-fA-F]+\(', out)))
print()
print('=== 去混淆后 head 900 ===')
print(out[:900])
