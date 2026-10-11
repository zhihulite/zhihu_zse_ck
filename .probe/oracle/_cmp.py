import re, json
# 真实会话
d=json.load(open('.probe/browser-proto7.json',encoding='utf-8'))
def norm_real(e):
    n=e.get('name','?').replace('syscall/js.','')
    a=e.get('a') or []
    fsz=None
    if n=='copyBytesToGo' and len(a)>1: fsz=str(a[1]).split(':')[-1]
    return n + ('(' + fsz + ')' if fsz else '')
real=[norm_real(e) for e in d]
# 我的运行
s=open('.probe/oracle/_call2.log',encoding='utf-8',errors='replace').read()
m=re.search(r'宿主调用总数: (\d+)', s)
print('我的宿主调用总数:', m.group(1) if m else '?')
tail=re.search(r'宿主调用尾 30: (\[.*?\])\n', s)
a=json.loads(tail.group(1)) if tail else []
mine=[(x['name'].replace('syscall/js.','') + ('(' + x['a'].split(',')[1] + ')' if x['name'].endswith('copyBytesToGo') else '')) for x in a]
print('（我的完整序列未全量保存，只有尾 30）')
print('我的尾 30:', mine)
print()
# 在真实序列里找 mine 的尾段位置
def find_sub(hay, needle):
    n=len(needle)
    for i in range(len(hay)-n+1):
        if hay[i:i+n]==needle: return i
    return -1
# 用尾 10 条找锚点
anchor=mine[-10:]
pos=find_sub(real, anchor)
print('真实序列中匹配尾 10 条的位置:', pos)
if pos>=0:
    print('真实序列该位置前后各 6 条:')
    print('  前:', real[max(0,pos-6):pos])
    print('  后:', real[pos+10:pos+20])
    print('  ⇒ 真实序列在匹配点之后还有 %d 条，我这次没有' % (len(real)-pos-10))