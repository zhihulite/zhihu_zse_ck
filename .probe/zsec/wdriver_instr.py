"""wdriver.py 的插桩版：每一步 dump VM 的全局状态，导出真实程序与执行流。

VM 状态全局（固定地址，来自 .probe/wt/zse.decompiled.js 的 _start）：
  314316 = pc
  314604 = 程序 word 数组指针
  314608 = 程序长度
  314672 = handler 表指针
  314676 = handler 表长度
"""
import base64, json, re, time, os, sys
from wasmtime import Config, Engine, Store, Module, FuncType, ValType, Linker

I32 = ValType.i32(); I64 = ValType.i64(); F64 = ValType.f64()
WASM = ".probe/build-859e.wasm"
CAPTURE = ".probe/browser-proto7.json"

G_PC, G_WORDS, G_LEN, G_TBL, G_TBLN = 314316, 314604, 314608, 314672, 314676


def u32(buf, addr):
    return int.from_bytes(bytes(buf[addr:addr + 4]), "little")


class Replay:
    def __init__(self, path):
        raw = json.load(open(path, encoding="utf-8"))
        self.steps, i = [], 0
        while i < len(raw):
            e = raw[i]; j = i + 1
            while j < len(raw) and raw[j]["name"] == e["name"] and raw[j].get("a") == e.get("a"):
                j += 1
            self.steps.append(e); i = j
        self.cursors = {}

    def next(self, kind):
        cur = self.cursors.get(kind, 0)
        m = [s for s in self.steps if s["name"] == kind]
        if cur >= len(m):
            raise RuntimeError("capture exhausted for " + kind)
        self.cursors[kind] = cur + 1
        return m[cur]


def num(s):
    return int(s.split(":", 1)[1]) if isinstance(s, str) and s.startswith("number:") else None


def main():
    store = Store(Engine(Config()))
    module = Module.from_file(store.engine, WASM)
    rp = Replay(CAPTURE)
    mem = None
    vm_states = []
    events = []

    def mview():
        return mem.get_buffer_ptr(store)

    def mread(a, n):
        return bytes(mview()[a:a + n])

    def mwrite(a, d):
        mview()[a:a + len(d)] = d

    def fd_write(fd, iovs, cnt, nw):
        total = 0
        for k in range(cnt):
            base = iovs + k * 8
            p = int.from_bytes(mread(base, 4), "little")
            l = int.from_bytes(mread(base + 4, 4), "little")
            total += l
        mwrite(nw, total.to_bytes(4, "little"))
        return 0

    def ticks():
        return time.time() * 1000.0

    def snap(tag):
        try:
            b = mview()
            st = dict(pc=u32(b, G_PC), words=u32(b, G_WORDS), len=u32(b, G_LEN),
                      tbl=u32(b, G_TBL), tbln=u32(b, G_TBLN))
            if st["len"] and st["len"] < 10 ** 7 and st["words"] and st["words"] < len(b):
                vm_states.append((tag, st))
        except Exception:
            pass

    def finalizeRef(ref, sp):
        rp.next("finalizeRef"); snap("finalize")

    def copyBytesToGo(sp, fsz, refA, refB, dstPtr, dstLen, dstCap, p2, l2, c2, p3, l3, c3, sp2):
        c = rp.next("copyBytesToGo")
        ca = [num(x) for x in c["a"]]
        roles = {}
        for ci, rp_ptr, rl in ((0, sp, 16), (4, dstPtr, dstLen), (7, p2, l2), (10, p3, l3)):
            if ca[ci] is not None:
                roles[ca[ci]] = (rp_ptr, rl)
        for r in (c.get("post") or []):
            cp, cl, b64 = r[0], r[1], r[2]
            if cp not in roles or not b64:
                continue
            run_ptr, run_len = roles[cp]
            if run_len <= 0:
                continue
            data = (base64.b64decode(b64) + b"\x00" * run_len)[:run_len]
            mwrite(run_ptr, data[:run_len])
        events.append(("cpy", dstLen))
        snap("cpy%d" % dstLen)

    def valueNew(resultAddr, ctorRef, argvPtr, argc, argcPtr, x6):
        c = rp.next("valueNew")
        for r in (c.get("post") or []):
            if r[1] == 16 and r[2]:
                mwrite(resultAddr, base64.b64decode(r[2])[:16]); break
        snap("new")

    def valueSetIndex(ref, sp, val, sp2):
        rp.next("valueSetIndex")

    def valueLength(ref, sp):
        c = rp.next("valueLength"); ret = c.get("ret") or ""
        v = int(ret[1:], 16) & 0xFFFFFFFF if ret.startswith("B") else 0
        return v - (1 << 32) if v >= 0x80000000 else v

    def valueIndex(ref, sp, sp2):
        c = rp.next("valueIndex"); ret = c.get("ret") or ""
        v = int(ret[1:], 16) if ret.startswith("B") else 0
        return v & 0xFFFFFFFFFFFFFFFF

    L = Linker(store.engine)
    L.define_func("wasi_snapshot_preview1", "fd_write", FuncType([I32, I32, I32, I32], [I32]), fd_write)
    L.define_func("gojs", "runtime.ticks", FuncType([], [F64]), ticks)
    L.define_func("env", "syscall/js.finalizeRef", FuncType([I64, I32], []), finalizeRef)
    L.define_func("env", "syscall/js.copyBytesToGo",
                  FuncType([I32, I32, I64, I64, I32, I32, I32, I32, I32, I32, I32, I32, I32, I32], []), copyBytesToGo)
    L.define_func("env", "syscall/js.valueSetIndex", FuncType([I64, I32, I64, I32], []), valueSetIndex)
    L.define_func("env", "syscall/js.valueNew", FuncType([I32, I64, I32, I32, I32, I32], []), valueNew)
    L.define_func("env", "syscall/js.valueLength", FuncType([I64, I32], [I32]), valueLength)
    L.define_func("env", "syscall/js.valueIndex", FuncType([I64, I32, I32], [I64]), valueIndex)

    inst = L.instantiate(store, module)
    exp = inst.exports(store)
    mem = exp["memory"]
    try:
        exp["_start"](store)
        print("_start 完成")
    except Exception as e:
        print("_start 抛出:", str(e)[:200])

    print("VM 状态快照数:", len(vm_states))
    seen = []
    for tag, st in vm_states:
        key = (st["words"], st["len"], st["tbl"], st["tbln"])
        if key not in seen:
            seen.append(key)
            print("  %-12s pc=%-6d words=%-8d len=%-6d tbl=%-8d tbln=%d" % (tag, st["pc"], st["words"], st["len"], st["tbl"], st["tbln"]))
    pcs = [(t, s["pc"]) for t, s in vm_states if s["len"]]
    print("pc 轨迹(去重相邻):", [p for i, p in enumerate([x[1] for x in pcs]) if i == 0 or p != [x[1] for x in pcs][i - 1]][:40])

    b = bytes(mview())
    if seen:
        wptr, wlen = seen[-1][0], seen[-1][1]
        if 0 < wlen < 100000 and wptr + wlen * 4 <= len(b):
            open(".probe/zsec/vm_words_live.bin", "wb").write(b[wptr:wptr + wlen * 4])
            print("已导出 VM 程序 %d 个 word -> .probe/zsec/vm_words_live.bin" % wlen)
            print("  前 24 word:", [b[wptr + 4 * i] for i in range(24)])


if __name__ == "__main__":
    main()
