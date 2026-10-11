import sys, os, json
sys.path.insert(0, os.path.abspath('.'))
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'py'))
from zse_ck_tool import extract, generate_token

D = '.probe/cap2'
names = ['dump_1791198678168', 'dump_1791200799672', 'dump_17912012034689'.replace('17912012034689','1791202034689'),
         'dump_1791202329789']
profs = {}
for n in names:
    mt = os.path.join(D, n + '.bin.meta.json')
    try:
        p = extract(mt, mt.replace('.meta.json', ''))
    except SystemExit as e:
        print(n, 'SKIP', e); continue
    ok = generate_token(p, p['rec93']) == p['token']
    profs[n] = p
    print('%s  selfcheck=%s' % (n, ok))
    print('   rec93 = %s' % p['rec93'])
    print('   mask=%#x  iv=%r  xreg=%#x' % (p['mask'], p['iv'], p['xreg']))
    print('   alpha = %s' % p['alphabet'])
    print('   rk[0:4] = %s' % [hex(x) for x in p['rk'][:4]])

print()
print('=== 参数是否按环境分组 ===')
sig = {}
for n, p in profs.items():
    s = (p['mask'], p['iv'], p['xreg'], p['alphabet'], tuple(p['rk']))
    sig.setdefault(s, []).append((n, p['rec93'][48:80]))
for i, (s, v) in enumerate(sig.items()):
    print('profile#%d  mask=%#x iv=%r xreg=%#x  <- %s' % (i, s[0], s[1], s[2],
          [(a.split('_')[-1][:8], b[:8]) for a, b in v]))
