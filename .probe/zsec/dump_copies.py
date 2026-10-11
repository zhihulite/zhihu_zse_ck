import base64, json, re, os
raw = json.load(open(".probe/browser-proto7.json", encoding="utf-8"))
steps = []
i = 0
while i < len(raw):
    e = raw[i]; j = i + 1
    while j < len(raw) and raw[j]["name"] == e["name"] and raw[j]["a"] == e["a"]:
        j += 1
    steps.append(e); i = j
copies = [s for s in steps if s["name"] == "copyBytesToGo"]
n = 0
for c in copies:
    n += 1
    ca = c["a"]
    out = []
    for r in (c.get("post") or []):
        cap_ptr, cap_len, b64 = r[0], r[1], r[2]
        if not b64: continue
        data = base64.b64decode(b64)
        if len(data) < 16: continue
        out.append((cap_len, data))
    if not out: continue
    ln, d = max(out, key=lambda t: len(t[1]))
    head = d[:16].hex(' ')
    print("copy#%-4d ca=%s len=%d head=%s" % (n, ca[:2], ln, head))