import re, subprocess, os

# 语义重命名表：仅纳入用法明确、高置信度的容器/状态字段
RENAME = {
    'k': 'word',        # this.word = this.program[pc++] || -1
    'S': 'program',     # 272 词程序表
    'F': 'regs',        # 寄存器组 this.regs[a] = ...
    'A': 'stack',       # 值栈 this.stack[this.J]
    'X': 'opStack',     # this.opStack.push(this.stack)
    'B': 'buf',         # this.buf = this.hStack.pop()
    'h': 'hStack',
    'R': 'rStack',
    'U': 'uStack',
    'g': 'arr',
    'M': 'tbl16',       # 16 项表
    'W': 'roundKeys',   # new Array(32)
    'G': 't0',          # Date.now()
}

FILES = [f for f in os.listdir('.') if re.match(r'zse_ck_.*\.js$', f)]

for f in sorted(FILES):
    d = open(f, encoding='utf8', errors='replace').read()
    n = 0
    for old, new in RENAME.items():
        # 只替换 this.OLD 形式，且 OLD 后不能紧跟标识符字符
        pat = re.compile(r'this\.' + re.escape(old) + r'(?![\w$])')
        d, c = pat.subn('this.' + new, d)
        n += c
    open(f, 'w', encoding='utf8').write(d)
    r = subprocess.run(['node', '--check', f], capture_output=True)
    print('%-38s renames=%-4d  syntax=%s' % (f, n, 'PASS' if r.returncode == 0 else 'FAIL'))
