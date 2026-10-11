# 指纹链

## 1. 总链

```
环境对象
  → 40 个字段（'|' 连接）
  → md5(utf8(连接串))
  → 32 hex 指纹
  → 写入 record93 的第 49..80 字符
```

同时，环境检测的命中情况写进 **48 hex 位图**（见 `docs/BITMAP.md`）。

## 2. 指纹的 40 个字段（顺序固定）

| 段 | 内容 |
|---|---|
| `[0]` | `navigator.hardwareConcurrency`（取不到为 `-1`） |
| `[1]` | WebGL `UNMASKED_VENDOR_WEBGL` |
| `[2]` | WebGL `UNMASKED_RENDERER_WEBGL` |
| `[3]` | `canvas.toDataURL()` |
| `[4..34]` | 探测命中的字体名（按探测列表顺序） |
| `[35..39]` | `navigator.plugins` 的 `name` |

实现：`js/fingerprint.restored.js`（`collect()` / `md5hex()` / `fingerprint()`），纯 Python 版 `py/fingerprint.py`。

真值入参存于 `.probe/zsec/_md5in.json`；`md5(utf8(入参))` 与真机 record93 的 32-hex 字段逐字一致。

## 3. 环境检测（两层）

| 层 | 规模 | 还原件 |
|---|---|---|
| JS 三层（payload / inner / orchestrator） | 逐条守卫，AST 抽取 | `js/bitmap_detection.restored.js` |
| Go VM（wasm 内） | 16 条 `new Function` 探针 + DOM 能力探测 | `js/govm_detection.restored.js` |

JS 侧检测对象包括：`window` 的键集合与 `toString`、`document`（`all` / `body` / `baseURI` /
`charset` / `createElement` / `getElementsByTagName`）、`canvas` 2D 上下文、`navigator`、
自动化痕迹（`webdriver` / `_phantom` / `callPhantom` / `fxdriver_id` / `$cdc_…` / `CasperError` /
`ubot` / `WebPage` / `patchRequire`）、`setTimeout`/`setInterval` 的原生形态、`localStorage`、
`screen.*`、`XMLDocument` / `MediaSource` / `stop` / `open` / `blur` 的原生绑定等。

## 4. 反篡改：`toString` 链

站点校验 `Function.prototype.toString` 与 `VM/BVM/CVM/Go.toString()` 的**内容**（长度对不等于通过）。
补环境必须做到：

- `Function.prototype.toString` 是原生形态（`function Function() { [native code] }`）；
- 被包装的函数（`setTimeout` / `setInterval` / `stop` / `print` / `open` / …）的 `toString()`
  返回 `function <name>() { [native code] }`；
- 相关全局（`window` / `document` / `location` / `navigator` / …）为**不可写**，否则载荷里的
  `window={}` 会静默清空全局。

## 5. 跨帧传值位移

VM 的 `SUB(entry, argc, A, l, S)` 会构造被调帧的局部表：

```
cl = [0].concat(l)
cl[t] = args[t]            // t < argc：被调帧 l[0..argc-1] = 实参
                           // t >= argc：被调帧 l[t] = 调用者 l[t-1]   ← 索引 +1
```

⇒ `l[0]` / `l[1]` 是调用方实参，必须渲染成运行时引用，不能常量折叠。

## 6. 复现

```bash
python py/fingerprint.py --selftest        # 纯 Python 指纹自检
python tools/verify_all.py                 # 全部门（含指纹层功能验证）
```
