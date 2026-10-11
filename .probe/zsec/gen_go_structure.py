# -*- coding: utf-8 -*-
"""从既有产物生成 DELIVERY/docs/GO_STRUCTURE.md（Go 代码结构 1:1）。"""
import json, io, re
from collections import Counter, defaultdict

d = json.load(open('.probe/zsec/wasm_funcmap.json', encoding='utf-8'))
cg = json.load(open('.probe/zsec/callgraph.json', encoding='utf-8'))
pool = json.load(open('.probe/zsec/govm_pool_decoded.json', encoding='utf-8'))

callees = Counter()
for n, v in cg.items():
    for t, c in v['direct'].items():
        callees[t] += c


def grp(n):
    if n.startswith('(*main.') or n.startswith('main.'):
        return 'main'
    if n.startswith('runtime.'):
        return 'runtime'
    if 'syscall/js' in n:
        return 'syscall/js'
    if 'reflect' in n:
        return 'reflect'
    if 'strings' in n:
        return 'strings'
    if 'base64' in n:
        return 'encoding/base64'
    if n.startswith('strconv'):
        return 'strconv'
    if n.startswith('internal/itoa'):
        return 'internal/itoa'
    if n.startswith('unicode/utf8'):
        return 'unicode/utf8'
    if n.startswith('hash/crc32'):
        return 'hash/crc32'
    if 'interface:' in n:
        return 'interface 包装'
    if n in ('malloc', 'free', 'calloc', 'realloc', '_start'):
        return 'TinyGo 入口/分配器'
    return '其他'


g = defaultdict(list)
for x in d:
    g[grp(x['name'])].append(x)
mains = [x for x in d if x['name'].startswith('(*main.')]
named = [x for x in mains if not x['name'].endswith('$bound')]

ROLE = {
 '_00oooO': '**VM 解释器 / 步进器**（12,420 B，全 wasm 最大函数；Go 用 `inst.H(pc)` 驱动 JS 侧 CVM）',
 '_OOo0o0': '共享核心 A（3,146 B）—— 24 个 `$bound` 调它',
 '_O0O00o': '共享核心 B（1,842 B）—— 27 个 `$bound` 调它',
 '_0OO0Oo': '**宿主调用分派器**（915 B，5 路 `br_table`，对应帧号 1022/1024/1026/1028/1030）',
 '_O0o0Oo': '小 helper（201 B）—— 9 个 `$bound` 调它',
 '_0ooO0o': '**弹「字符串」原语**（108 B，仅 `_00oooO` 调用）',
 '_oo0ooo': '**通用弹栈原语**（81 B，仅 `_00oooO` 调用）',
}
DESC = {
 'main': '本项目（Go VM 与其依赖）',
 'runtime': 'TinyGo 运行时（alloc / panic / slice / string / hashmap）',
 'syscall/js': '**H 通道**：Go VM 读写 JS 的唯一出口',
 'reflect': 'Go 接口分派所需',
 'strings': '字符串操作（Replace / Split / Index）',
 'encoding/base64': 'base64 解码（用于内嵌 blob）',
 'strconv': 'ParseUint / FormatInt',
 'internal/itoa': '整数转字符串',
 'unicode/utf8': 'UTF-8 码点',
 'hash/crc32': 'crc32（token 字段）',
 'interface 包装': '接口方法包装',
 'TinyGo 入口/分配器': '`_start` / malloc / free / calloc / realloc',
 '其他': '—',
}

o = []
o += ['# glue 层 Go 代码结构（1:1 结构还原）', '',
      '> 证据：wasm **未 strip**，name 段保留 **200 条真名**。对齐规则：name 段索引空间含 8 个 import',
      '> ⇒ **`names[i+8] ↔ bodies[i]`**（200 − 8 = **192** 个函数体，已互证）。',
      '> 产物：`wasm_funcmap.json`(192) · `elem_table.json`(104) · `callgraph.json` · `govm_pool_decoded.json`(101)。', '',
      '## ⚠️ 「1:1」的边界（必须先读）', '',
      '`_0oOoOO` / `_00oooO` 之类是**混淆后的链接名**，不是源码标识符；TinyGo **不导出**字段名、包级变量名、常量池。',
      '所以这里做到的是 **结构 1:1**：', '',
      '| 维度 | 能否 1:1 | 说明 |', '|---|---|---|',
      '| 函数清单 / 真名 | ✅ | 192/192，name 段直接给出 |',
      '| 方法集 / 接收者 | ✅ | `type main._0oOoOO`：104 `$bound` + 7 实名 |',
      '| 函数体（伪代码） | ✅ | `.probe/wt/zse.decompiled.js` 覆盖 192/192 |',
      '| 字符串池 | ✅ | 101/101 已解（K=0x12 / IV=0x22） |',
      '| 分派表 | ✅ | `elem` 段 104 项静态可得 |',
      '| 调用图 | ✅ | 1031 条直接边 + 27 个 `call_indirect` 位点 |',
      '| VM 结构体字段 | 🟡 仅偏移 | 已按语义命名（见 `code/go/_0oOoOO.go`），无原始字段名 |',
      '| 包级变量 / 常量池名 | ⛔ | TinyGo 不导出 |', '',
      '**⇒ 不是逐字符的原始源码，这是工具链限制，不是还原缺口。**', '',
      '## 1. 模块组成（192 个函数体）', '', '| 组 | 函数数 | 说明 |', '|---|---|---|']
for k, v in sorted(g.items(), key=lambda x: -len(x[1])):
    o.append('| %s | %d | %s |' % (k, len(v), DESC.get(k, '—')))

o += ['', '## 2. `type main._0oOoOO`（VM 类型，111 个方法）', '', '```go', 'type _0oOoOO struct {',
      '    pc        int32    // +20   每进 handler 自增 1',
      '    pushTag   uint32   // +276  压栈类型标签',
      '    pushVal   uint32   // +280  压栈值',
      '    stackPtr  uintptr  // +296  操作数栈 ptr',
      '    stackLen  int32    // +300',
      '    stackCap  int32    // +304',
      '    progPtr   uintptr  // +308  程序 ptr',
      '    progLen   int32    // +312  = 10565（**元素个数**，u32 数组）',
      '    strings   uintptr  // +320  字符串池（101 条）',
      '    tablePtr  uintptr  // +376  分派表 ptr',
      '    tableLen  int32    // +380  = 104',
      '    jsHandle  uint32   // +392',
      '    jsType    uint32   // +400',
      '    last      uint32   // +408',
      '}', '```', '',
      '### 2.1 七个实名方法', '', '| 方法 | 大小 | 被调次数 | 角色 |', '|---|---|---|---|']
for x in sorted(named, key=lambda y: -y['len']):
    nm = re.sub(r'^\(\*main\._0oOoOO\)\.', '', x['name'])
    o.append('| `%s` | %d B | %d | %s |' % (nm, x['len'], callees.get('_*main._0oOoOO_.' + nm, 0), ROLE.get(nm, '—')))

o += ['', '### 2.2 104 个 `$bound` 方法值', '',
      'Go 为「方法值」生成的包装（`$bound`）。**与运行期实测 `vm+380 = 104`（分派表项数）精确互证**，',
      '也与 `elem` 段的 104 项一一对应（见 `OPCODE_MAP.md`）。', '',
      '分组（按主被调）：`_O0O00o` 27 · `_00oooO` 24 · `_OOo0o0` 24 · `_0OO0Oo` 12 · `_O0o0Oo` 9 · 无核心调用 8。', '',
      '## 3. 包级函数（非方法）', '', '| 函数 | 大小 | 角色 |', '|---|---|---|']
for x in sorted([y for y in d if y['name'].startswith('main.')], key=lambda y: -y['len']):
    o.append('| `%s` | %d B | 字符串替换包装器（`runtime.alloc` + `strings.Replace`） |' % (x['name'], x['len']))

o += ['', '## 4. H 通道（Go ↔ JS 的唯一出口）', '', '| 项 | 内容 |', '|---|---|',
      '| import 模块 | `wasi_snapshot_preview1.fd_write` · `gojs.runtime.ticks` · `gojs.N` · `env.syscall/js.*` |',
      '| `env` 下的 js 函数 | `finalizeRef` · `valueIndex` · `valueSetIndex` · `valueNew` · `valueLength` · **`copyBytesToGo`** |',
      '| 真正的 RPC | `__g.copyBytesToGo(tools)`，7 个帧号（1022/1024/1026/1028/1030/1032/1034） |',
      '| Go 侧 13 条 `js.Value.*` opcode | 见 `GOVM_ISA.md §2` |',
      '| 反篡改校验 | `Go/VM/CVM/BVM.toString()` 的**内容**哈希（长度对不等于通过，见 `BREAKTHROUGH.md`） |', '',
      '## 5. 字符串池（101 条，已解）', '', '| # | 值 |', '|---|---|']
for i, x in enumerate(pool[:24]):
    o.append('| %d | `%s` |' % (i, str(x)[:60].replace('|', chr(92) + '|')))
o += ['| … | （共 101 条，全文见 `evidence/govm_pool_decoded.json`） |', '',
      '池里能直接看出 Go VM 的语义：`Go` / `toString` / `native` / `__g` / `ck` / `VM` / `eval` / `__b` …，',
      '以及**假 ck 模板**（`005_…`）与 `5cafb9b8` / `83c7327f` 这类哈希片段。', '',
      '## 6. 复现', '', '```bash',
      'wasm2wat .probe/build-859e.wasm -o .probe/wt/zse.wat      # 反汇编',
      'python .probe/watdecomp.py                                # → zse.decompiled.js（192 函数体）',
      'python .probe/zsec/parse104.py                            # → 104 个 $bound 分组',
      'python .probe/zsec/build_callgraph.py                     # → callgraph.json',
      'python .probe/zsec/parse_microcode.py                     # VM 类微码 ISA（JS 侧）',
      '```', '']
io.open('DELIVERY/docs/GO_STRUCTURE.md', 'w', encoding='utf-8', newline='').write('\n'.join(o) + '\n')
print('已写 DELIVERY/docs/GO_STRUCTURE.md  %d 行' % len(o))
