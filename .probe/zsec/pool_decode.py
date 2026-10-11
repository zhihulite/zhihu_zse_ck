import base64, json

raw = base64.b64decode(open('.probe/zsec/entry_arg.txt', encoding='utf-8').read())
v0 = raw[0] << 16 | raw[1] << 8 | raw[2]
i = 3 + v0
pool = []
while i < len(raw) - 1:
    n = raw[i] << 8 | raw[i + 1]
    if n == 0 or i + 2 + n > len(raw):
        break
    pool.append(raw[i + 2:i + 2 + n])
    i += 2 + n
print('池条目 %d，总字节 %d' % (len(pool), sum(len(p) for p in pool)))

K, IV = 0x14, 0x7C


def dec(s):
    """前 2 字节是字面前缀（不参与链）；正文从下标 2 起：p_i = c_i ^ K ^ p_{i-1}，p_{-1}=IV"""
    out = bytearray()
    prev = IV
    for c in s[2:]:
        p = c ^ K ^ prev
        out.append(p & 0xff)
        prev = p & 0xff
    return bytes(out)


print()
print('=== 逐条解码（前缀 + 正文）===')
res = []
for j, p in enumerate(pool):
    body = dec(p)
    pre = p[:2]
    try:
        txt = body.decode('utf-8')
    except Exception:
        txt = None
    res.append({'i': j, 'rawLen': len(p), 'prefix': pre.decode('latin1'), 'text': txt})
    if j < 40:
        show = repr(txt)[:120] if txt is not None else ('<非UTF8> ' + repr(body[:40]))
        print('  [%2d] rawLen=%-6d pre=%-4r %s' % (j, len(p), pre.decode('latin1'), show))

json.dump(res, open('.probe/zsec/pool_decoded.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
ok = sum(1 for r in res if r['text'] is not None)
print()
print('可解为 UTF-8 的条目: %d/%d' % (ok, len(res)))
longs = sorted(res, key=lambda r: -r['rawLen'])[:6]
print('最长条目:', [(r['i'], r['rawLen'], (r['text'] or '')[:60]) for r in longs])
