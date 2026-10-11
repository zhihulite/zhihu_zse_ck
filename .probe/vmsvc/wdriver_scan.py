"""wdriver_scan.py — replay the wasm (as wdriver.py) while scanning linear memory
at every logical step for: '005_' token, UA string, U+200D separator, and the
native VM program (runs of bytes where every 3rd byte (BE 24-bit word high byte) <= 0x7F).
Run: python .probe/vmsvc/wdriver_scan.py
"""
import base64
import re
import time

from wasmtime import Config, Engine, Store, Module, FuncType, ValType, Linker

WASM = ".probe/build-859e.wasm"
CAPTURE = ".probe/browser-proto7.json"
UA24 = b"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
VM_RUN = re.compile(rb"(?:[\x00-\x7f][\x00-\xff][\x00-\xff]){60,}")
FLAGS = [("005_", b"005_"), ("UA", UA24), ("U200D", b"\xe2\x80\x8d")]


def uleb(b, i):
    r = 0; s = 0
    while True:
        x = b[i]; i += 1; r |= (x & 0x7f) << s
        if not x & 0x80: return r, i
        s += 7


def num(s):
    return int(s.split(":", 1)[1]) if isinstance(s, str) and s.startswith("number:") else None


class Replay:
    def __init__(self, path):
        raw = json.load(open(path, encoding="utf8"))
        self.steps = []
        i = 0
        while i < len(raw):
            e = raw[i]; j = i + 1
            while j < len(raw) and raw[j]["name"] == e["name"] and raw[j]["a"] == e["a"]:
                j += 1
            self.steps.append(e)
            i = j
        self.cursors = {}

    def next(self, kind):
        cur = self.cursors.get(kind, 0)
        matches = [s for s in self.steps if s["name"] == kind]
        if cur >= len(matches):
            raise RuntimeError(f"capture exhausted for {kind}")
        s = matches[cur]
        self.cursors[kind] = cur + 1
        return s


import json


def main():
    cfg = Config()
    engine = Engine(cfg)
    store = Store(engine)
    module = Module.from_file(store.engine, WASM)
    rp = Replay(CAPTURE)
    mem = None
    seen = {}
    step = [0]

    def mview():
        return mem.get_buffer_ptr(store)

    def scan(tag):
        buf = mview()
        step[0] += 1
        found = []
        for name, pat in FLAGS:
            if name in seen:
                continue
            i = buf.find(pat)
            if i >= 0:
                seen[name] = (step[0], i, tag)
                found.append((name, i))
        if "VM" not in seen:
            for m in VM_RUN.finditer(buf):
                off = m.start()
                # op histogram filter: common ops 1,2,9,10,11 should dominate
                ops = {}
                for k in range(0, min(300, len(m.group())) - 2, 3):
                    op = buf[off + k] >> 3 if False else None
                # verify: 3-byte BE words with (w>>19)<=14 density
                c = sum(1 for k in range(0, 240, 3)
                        if (buf[off + k] << 16 | buf[off + k + 1] << 8 | buf[off + k + 2]) >> 19 <= 14)
                if c >= 70:  # 70/80 words valid
                    seen["VM"] = (step[0], off, tag)
                    found.append(("VM", off))
                    break
        if found:
            print("step %4d [%s] FIRST APPEARANCE: %s" % (step[0], tag, ", ".join("%s@0x%x" % f for f in found)))
        return found

    def fd_write(fd, iovs, cnt, nwritten):
        r = scan("fd_write")
        total = 0
        buf = mview()
        for k in range(cnt):
            base = iovs + k * 8
            ptr = int.from_bytes(buf[base:base + 4], "little")
            ln = int.from_bytes(buf[base + 4:base + 8], "little")
            total += ln
        mem.write(store, nwritten, total.to_bytes(4, "little"))
        return 0

    def ticks():
        scan("ticks")
        return time.time() * 1000.0

    def finalizeRef(ref, sp):
        scan("finalizeRef")

    def copyBytesToGo(sp, fsz, refA, refB, dstPtr, dstLen, dstCap, p2, l2, c2, p3, l3, c3, sp2):
        c = rp.next("copyBytesToGo")
        ca = [num(x) for x in c["a"]]
        for mine, theirs, label in ((dstLen, ca[5], "dstLen"), (l2, ca[8], "l2"), (l3, ca[11], "l3")):
            if theirs is not None and mine != theirs:
                raise RuntimeError(f"shape divergence at copy#{rp.cursors['copyBytesToGo']-1}: {label} wasm={mine} capture={theirs}")
        roles = {}
        for cap_idx, run_ptr, run_len in ((0, sp, 16), (4, dstPtr, dstLen), (7, p2, l2), (10, p3, l3)):
            cap_ptr = ca[cap_idx]
            if cap_ptr is not None:
                roles[cap_ptr] = (run_ptr, run_len)
        scan("copy#%d(dstLen=%d)" % (rp.cursors["copyBytesToGo"], dstLen))
        buf = mview()
        for r in (c.get("post") or []):
            cap_ptr, cap_len, b64 = r[0], r[1], r[2]
            if cap_ptr not in roles or not b64:
                continue
            run_ptr, run_len = roles[cap_ptr]
            if run_len <= 0:
                continue
            data = base64.b64decode(b64)
            data = (data + b"\x00" * run_len)[:run_len]
            mem.write(store, run_ptr, data)
        scan("copy#%d-post(dstLen=%d)" % (rp.cursors["copyBytesToGo"], dstLen))
        return

    def valueNew(resultAddr, ctorRef, argvPtr, argc, argcPtr, x6):
        c = rp.next("valueNew")
        scan("valueNew")
        for r in (c.get("post") or []):
            if r[1] == 16 and r[2]:
                mem.write(store, resultAddr, base64.b64decode(r[2])[:16])
                break
        return

    def valueSetIndex(ref, sp, val, sp2):
        rp.next("valueSetIndex")
        scan("valueSetIndex")

    def valueLength(ref, sp):
        c = rp.next("valueLength")
        scan("valueLength")
        ret = c.get("ret") or ""
        if ret.startswith("B"):
            v = int(ret[1:], 16) & 0xFFFFFFFF
        else:
            try:
                v = int(float(ret)) & 0xFFFFFFFF
            except ValueError:
                v = 0
        return v - (1 << 32) if v >= 0x80000000 else v

    def valueIndex(ref, sp, sp2):
        c = rp.next("valueIndex")
        scan("valueIndex")
        ret = c.get("ret") or ""
        v = int(ret[1:], 16) if ret.startswith("B") else 0
        return v & 0xFFFFFFFFFFFFFFFF

    I32 = ValType.i32(); I64 = ValType.i64(); F64 = ValType.f64()
    linker = Linker(engine)
    linker.define_func("wasi_snapshot_preview1", "fd_write", FuncType([I32, I32, I32, I32], [I32]), fd_write)
    linker.define_func("gojs", "runtime.ticks", FuncType([], [F64]), ticks)
    linker.define_func("env", "syscall/js.finalizeRef", FuncType([I64, I32], []), finalizeRef)
    linker.define_func("env", "syscall/js.copyBytesToGo",
                       FuncType([I32, I32, I64, I64, I32, I32, I32, I32, I32, I32, I32, I32, I32, I32], []),
                       copyBytesToGo)
    linker.define_func("env", "syscall/js.valueSetIndex", FuncType([I64, I32, I64, I32], []), valueSetIndex)
    linker.define_func("env", "syscall/js.valueNew", FuncType([I32, I64, I32, I32, I32, I32], []), valueNew)
    linker.define_func("env", "syscall/js.valueLength", FuncType([I64, I32], [I32]), valueLength)
    linker.define_func("env", "syscall/js.valueIndex", FuncType([I64, I32, I32], [I64]), valueIndex)

    inst = linker.instantiate(store, module)
    exp = inst.exports(store)
    mem = exp["memory"]
    t0 = time.time()
    try:
        exp["_start"](store)
        print(f"_start completed in {time.time()-t0:.2f}s")
    except Exception as e:
        print(f"_start raised after {time.time()-t0:.2f}s:", str(e)[:200])
    scan("END")
    print("\n=== first-appearance summary ===")
    for name, (stp, off, tag) in sorted(seen.items(), key=lambda kv: kv[1][0]):
        print("%-6s first at step %-4d offset 0x%-7x during %s" % (name, stp, off, tag))
    buf = bytes(mview())
    open(".probe/vmsvc/final_memory.bin", "wb").write(buf)
    print("final memory saved (%d bytes)" % len(buf))


if __name__ == "__main__":
    main()
