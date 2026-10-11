import json, base64, subprocess, os, re, sys, collections
BASE='.probe/browser-proto7.json'
raw=json.load(open(BASE,encoding='utf8'))
# collect distinct blob contents with counts
cnt=collections.Counter()
for e in raw:
    for r in (e.get('post') or []):
        if r[2]:
            try: cnt[base64.b64decode(r[2])]+=1
            except Exception: pass
items=[(b,n) for b,n in cnt.items() if 8<=len(b)<=400]
print('distinct small blobs:', len(items))
for b,n in items[:40]:
    pr=sum(1 for c in b if 32<=c<127)
    print('  len=%-4d x%-3d %r'%(len(b),n,b[:52] if pr>len(b)*0.7 else b[:24].hex()))