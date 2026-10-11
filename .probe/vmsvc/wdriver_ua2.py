"""wdriver_scan.py — replay the wasm (as wdriver.py) while scanning linear memory
at every logical step for: '005_' token, UA string, U+200D separator, and the
native VM program (runs of bytes where every 3rd byte (BE 24-bit word high byte) <= 0x7F).
Run: python .probe/vmsvc/wdriver_scan.py
"""
import base64
import re
import time

from wasmtime import Config, Engine, Store, Module, FuncType, ValType, Linker

WASM = ".probe/vmsvc/wasm_bp.wasm"
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


import os
TRY_FUEL = int(os.environ.get('TRY_FUEL', '0'))

def main():
    cfg = Config()
    if TRY_FUEL:
        cfg.consume_fuel = True
    engine = Engine(cfg)
    store = Store(engine)
    if TRY_FUEL:
        store.set_fuel(10**12)
    module = Module.from_file(store.engine, WASM)
    rp = Replay(CAPTURE)
    mem = None
    seen = {}
    step = [0]

    def mview():
        return mem.get_buffer_ptr(store)

    def scan(tag):
        buf = bytes(mview())
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
                g = buf[off:off + 240]
                if g.count(0) > 10:
                    continue
                ops = set()
                c = 0
                for k in range(0, 240, 3):
                    w = g[k] << 16 | g[k + 1] << 8 | g[k + 2]
                    op = w >> 19
                    if op <= 14:
                        c += 1
                        ops.add(op)
                if c >= 70 and len(ops) >= 6 and ops - {0}:
                    seen["VM"] = (step[0], off, tag)
                    found.append(("VM", off))
                    break
        if found:
            print("step %4d [%s] FIRST APPEARANCE: %s" % (step[0], tag, ", ".join("%s@0x%x" % f for f in found)))
            for nm, _o in found:
                if nm == "005_":
                    try:
                        open(".probe/vmsvc/mem_at_token.bin", "wb").write(buf)
                        print("   snapshot saved: mem_at_token.bin (%d bytes)" % len(buf))
                    except Exception as e:
                        print("   snap err", e)
        return found

    TAB = chr(9); NL = chr(10)
    bp_log = open(".probe/vmsvc/bp_trace.txt", "w", encoding="utf8")
    bp_state = {"n": 0, "err": 0, "done": set()}
    def bp_read(ptr, ln):
        buf = mview()
        return bytes(buf[ptr:ptr+ln])
    def fd_write(fd, iovs, cnt, nwritten):
        # our inserted call passes cnt=0 and iovs=vm
        if cnt == 0 and iovs > 0x10000:
            try:
                vm = iovs
                buf = bytes(mview())
                import struct as _s
                pc = _s.unpack_from("<I", buf, vm+0x12C)[0]
                prog = _s.unpack_from("<I", buf, vm+0x128)[0]
                plen = _s.unpack_from("<I", buf, vm+0x130)[0]
                bp_state["n"] += 1
                if bp_state["n"] == 1:
                    _s = __import__("struct")
                    out = []
                    for i in range(min(plen, 20000)):
                        e0 = _s.unpack_from("<I", buf, prog+i*8)[0]
                        e1 = _s.unpack_from("<I", buf, prog+i*8+4)[0]
                        if e0 == 0x11800 and 0x10000 < e1 < len(buf)-8:
                            sp = _s.unpack_from("<I", buf, e1)[0]
                            sl = _s.unpack_from("<I", buf, e1+4)[0]
                            if 0 < sl < 400 and 0x10000 < sp < len(buf)-sl:
                                out.append(str(i) + TAB + repr(bytes(buf[sp:sp+sl]).decode("utf8","replace")) % (i, bytes(buf[sp:sp+sl]).decode("utf8","replace")))
                            else:
                                out.append("%d	<str %d %d>" % (i, sp, sl))
                        else:
                            out.append("%d	<type 0x%x val 0x%x>" % (i, e0, e1))
                    open(".probe/vmsvc/bp_program.txt","w",encoding="utf8").write(NL.join(out))
                    print("   program array dumped:", plen, "entries", flush=True)
                if bp_state["n"] <= 400000 and 0 < pc <= plen:
                    ep = _s.unpack_from("<I", buf, prog+(pc-1)*8)[0]
                    dp = _s.unpack_from("<I", buf, prog+(pc-1)*8+4)[0]
                    if ep == 0x11800 and 0x10000 < dp < len(buf)-8:
                        sp = _s.unpack_from("<I", buf, dp)[0]
                        sl = _s.unpack_from("<I", buf, dp+4)[0]
                        if 0 < sl < 300 and 0x10000 < sp < len(buf)-sl:
                            st = bytes(buf[sp:sp+sl]).decode("utf8", "replace")
                            bp_log.write(str(bp_state["n"]) + TAB + str(pc) + TAB + repr(st) + NL)
                    if bp_state["n"] % 20000 == 0:
                        bp_log.flush()
                        print("   bp call", bp_state["n"], "pc", pc, flush=True)
            except Exception as e:
                pass
        r = scan("fd_write")
        total = 0
        buf = mview()
        for k in range(cnt):
            base = iovs + k * 8






























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
            mview()[run_ptr:run_ptr + run_len] = data
        scan("copy#%d-post(dstLen=%d)" % (rp.cursors["copyBytesToGo"], dstLen))
        if TRY_FUEL and rp.cursors["copyBytesToGo"] == 166:
            store.set_fuel(TRY_FUEL)
            print("   fuel set to %d after copy#166" % TRY_FUEL)
        return

    def valueNew(resultAddr, ctorRef, argvPtr, argc, argcPtr, x6):
        c = rp.next("valueNew")
        scan("valueNew")
        for r in (c.get("post") or []):
            if r[1] == 16 and r[2]:
                mview()[resultAddr:resultAddr + 16] = base64.b64decode(r[2])[:16]
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