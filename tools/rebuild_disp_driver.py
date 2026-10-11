#!/usr/bin/env python3
"""重建 .probe/zsec/wdriver_glue_disp.js（一键「分派 word」追踪驱动）。

它是**派生文件**：基线 .probe/zsec/wdriver_glue.js + DB 里记录的两段 Bash 补丁：
  * 包 wasi_snapshot_preview1.fd_write：命中 nwritten==0x5A5A5A5A 的断点调用时
    只把 fd（= 分派 word）记进 DISP 数组，不转发（避免 nwritten 越界）；
  * 加 exit / uncaughtException 兜底，把 DISP 落盘到 .probe/zsec/disp2.txt。

原始补丁打在 wdriver_glue.js 的早期修订（锚点是 `const imports = go._ || go.importObject;`），
而磁盘上现存的 wdriver_glue.js 是后来的 v2 重写（锚点 `const go = new GoCtor();`）。
这里把补丁适配到 v2，产出**功能等价**的一键分派追踪驱动（可重复生成）。
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(ROOT, '.probe', 'zsec', 'wdriver_glue.js')
OUT = os.path.join(ROOT, '.probe', 'zsec', 'wdriver_glue_disp.js')


def main():
    s = open(BASE, encoding='utf-8').read()

    old_wasm = "const WASM_PATH = process.env.WASM || '.probe/build-859e.wasm';"
    new_wasm = ("const WASM_PATH = process.env.WASM || '.probe/build-859e.wasm';\n"
                "const DISP=[];\n"
                "process.on('exit', () => { try { require('fs').writeFileSync('.probe/zsec/disp2.txt', DISP.join(String.fromCharCode(10)),'utf8'); } catch(e){} });\n"
                "process.on('uncaughtException', (e) => { try { require('fs').writeFileSync('.probe/zsec/disp2.txt', DISP.join(String.fromCharCode(10)),'utf8'); console.log('DISP 次数 =', DISP.length); } catch(e2){} process.exit(3); });")
    assert old_wasm in s, 'WASM_PATH 锚点未命中'
    s = s.replace(old_wasm, new_wasm, 1)

    anchor = "  const go = new GoCtor();"
    wrap = anchor + """
  try {
    const W = go.importObject && go.importObject.wasi_snapshot_preview1;
    if (W && typeof W.fd_write === 'function') {
      const _o = W.fd_write;
      W.fd_write = function (fd, iovs, cnt, nwritten) {
        if ((nwritten | 0) === 0x5A5A5A5A) { DISP.push(fd | 0); return 0; }  // 断点：只记录
        return _o.apply(this, arguments);
      };
      console.log('fd_write 已包一层（nwritten==0x5A5A5A5A 视为断点）');
    } else { console.log('未找到 fd_write'); }
  } catch (e) { console.log('wrap err', e.message); }"""
    assert anchor in s, 'go 实例锚点未命中'
    s = s.replace(anchor, wrap, 1)

    old_tail = "})();"
    new_tail = """  try{ require('fs').writeFileSync('.probe/zsec/disp2.txt', DISP.join(String.fromCharCode(10)),'utf8');
       console.log('DISP 次数 =', DISP.length); console.log('DISP 前 120:', DISP.slice(0,120).join(',')); }catch(e){}
})();"""
    assert old_tail in s, '尾部锚点未命中'
    s = s.replace(old_tail, new_tail, 1)

    tmp = OUT + '.tmp'
    open(tmp, 'w', encoding='utf-8', newline='\n').write(s)
    os.replace(tmp, OUT)
    print('已生成 %s (%d B)' % (os.path.relpath(OUT, ROOT), len(s.encode('utf8'))))
    return 0


if __name__ == '__main__':
    sys.exit(main())
