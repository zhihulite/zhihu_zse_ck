import re, json
s=open('.probe/oracle/_roll2.log',encoding='utf-8',errors='replace').read()
m=re.search(r'VM 返回点: (.*)', s)
t=m.group(1) if m else '[]'
m2=re.search(r':before=(\[.*?\])', t)
if not m2:
    print('无 before; 返回点原文前 300:', t[:300]); raise SystemExit
a=json.loads(m2.group(1))
seq=[int(x.split(':')[1]) for x in a]
print('窗口条数:', len(seq))
print('出现过的 pc 集合:', sorted(set(seq)))
print('前 60:', seq[:60])
print('后 20:', seq[-20:])