"""__zse_ck v4 payload generator: drive the per-build challenge wasm under wasmtime,
replaying the host side of the wasm_exec-derived protocol exactly as a real browser
answered it (capture: .probe/browser-proto7.json, includes per-call result-slot refs
and served content bytes).

Key protocol facts (measured):
  * copyBytesToGo(arg0=resultSlot, arg1=frameSize, refA, refB, dstPtr, dstLen, dstCap,
    p2, l2, c2, p3, l3, c3, sp2): the host writes the resulting js.Value ref (8 bytes,
    NaN-boxed) at resultSlot, fills dst/p2/p3 buffers per the operation.
  * runtime.ticks() is the clock input -> we return the CURRENT time so the minted
    payload passes the server freshness window (~minutes).
Run:  python py/wdriver.py   ->  .probe/wd-payload.txt
"""
import base64
import json
import os
import re
import time

from wasmtime import Config, Engine, Store, Module, FuncType, ValType, Linker

I32 = ValType.i32()
I64 = ValType.i64()
F64 = ValType.f64()

WASM = os.environ.get("WASM_FILE", ".probe/build-859e.wasm")
CAPTURE = os.environ.get("CAPTURE_FILE", ".probe/browser-proto7.json")
META_FILE = os.environ.get("META_FILE", ".probe/browser-meta7.txt")


class Replay:
    """Logical steps: collapse adjacent duplicate (name, args) log entries."""

    def __init__(self, path):
        raw = json.load(open(path, encoding="utf-8"))
        self.steps = []
        i = 0
        while i < len(raw):
            e = raw[i]
            j = i + 1
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


def num(s):
    return int(s.split(":", 1)[1]) if isinstance(s, str) and s.startswith("number:") else None


import os
FLIP_IDX = int(os.environ.get("FLIP_IDX", "0"))
FLIP_OFF = int(os.environ.get("FLIP_OFF", "0"))
FLIP_XOR = int(os.environ.get("FLIP_XOR", "1"))
FLIP_SET = os.environ.get("FLIP_SET")
FLIP_SET = int(FLIP_SET, 0) if FLIP_SET not in (None, "") else None
FLIP2 = os.environ.get("FLIP2")
def _i(name, dflt=None):
    x = os.environ.get(name)
    return dflt if x in (None, "") else int(x, 0)
VL_IDX = _i("VL_IDX"); VL_DELTA = _i("VL_DELTA", 1)
VI_IDX = _i("VI_IDX"); VI_DELTA = _i("VI_DELTA", 1)
VN_IDX = _i("VN_IDX"); VN_OFF = _i("VN_OFF")
N = [0, 0, 0]
FLIP2 = [int(x, 0) for x in FLIP2.split(",")] if FLIP2 else None
CPY_N = [0]


def main():
    cfg = Config()
    engine = Engine(cfg)
    store = Store(engine)
    module = Module.from_file(store.engine, WASM)
    rp = Replay(CAPTURE)
    kinds = {}
    for s in rp.steps:
        kinds[s["name"]] = kinds.get(s["name"], 0) + 1
    print("logical steps:", kinds)

    mem = None
    stdout_buf = []
    events = []

    def mview():
        return mem.get_buffer_ptr(store)

    def mem_write(addr, data):
        buf = mview()
        buf[addr:addr + len(data)] = data

    def mem_read(addr, n):
        return bytes(mview()[addr:addr + n])

    def fd_write(fd, iovs, cnt, nwritten):
        total = 0
        for k in range(cnt):
            base = iovs + k * 8
            ptr = int.from_bytes(mem_read(base, 4), "little")
            ln = int.from_bytes(mem_read(base + 4, 4), "little")
            total += ln
            stdout_buf.append(mem_read(ptr, ln))
        mem_write(nwritten, total.to_bytes(4, "little"))
        return 0

    def ticks():
        m = os.environ.get("TICKS_MODE")
        if m == "zero": return 0.0
        if m == "big": return 1e15
        if m == "past": return 1.0
        return time.time() * 1000.0

    def finalizeRef(ref, sp):
        rp.next("finalizeRef")

    def copyBytesToGo(sp, fsz, refA, refB, dstPtr, dstLen, dstCap, p2, l2, c2, p3, l3, c3, sp2):
        c = rp.next("copyBytesToGo")
        ca = [num(x) for x in c["a"]]
        # strict shape check: catch any divergence from the captured sequence
        for mine, theirs, label in ((dstLen, ca[5], "dstLen"), (l2, ca[8], "l2"), (l3, ca[11], "l3")):
            if theirs is not None and mine != theirs:
                raise RuntimeError(
                    f"shape divergence at copy#{rp.cursors['copyBytesToGo']-1}: "
                    f"{label} wasm={mine} capture={theirs} | capture args={c['a'][:8]}")
        roles = {}  # captured ptr -> (runtime ptr, len)
        for cap_idx, run_ptr, run_len in ((0, sp, 16), (4, dstPtr, dstLen), (7, p2, l2), (10, p3, l3)):
            cap_ptr = ca[cap_idx]
            cap_len = ca[cap_idx + 1]
            if cap_ptr is not None:
                roles[cap_ptr] = (run_ptr, run_len, cap_len)
        CPY_N[0] += 1
        for r in (c.get("post") or []):
            cap_ptr, cap_len, b64 = r[0], r[1], r[2]
            if cap_ptr not in roles or not b64:
                continue
            if CPY_N[0] == FLIP_IDX and cap_len > FLIP_OFF:
                raw = bytearray(base64.b64decode(b64))
                if FLIP_OFF < len(raw):
                    if FLIP_SET is None:
                        raw[FLIP_OFF] ^= FLIP_XOR
                    else:
                        raw[FLIP_OFF] = FLIP_SET & 0xFF
                    b64 = base64.b64encode(bytes(raw)).decode()
            if FLIP2 and CPY_N[0] == FLIP2[0] and cap_len > FLIP2[1]:
                raw = bytearray(base64.b64decode(b64))
                if FLIP2[1] < len(raw):
                    raw[FLIP2[1]] ^= FLIP2[2]
                    b64 = base64.b64encode(bytes(raw)).decode()
            run_ptr, run_len, _ = roles[cap_ptr]
            if run_len <= 0:
                continue
            data = base64.b64decode(b64)
            if dstLen in (41892, 132, 43) and not os.environ.get("NO_DUMP"):
                # PRE state (before this copy's bytes are planted). One file per step --
                # never reuse a name, or a later step silently overwrites an earlier dump.
                open(".probe/wd-pre-at%d.bin" % dstLen, "wb").write(bytes(mview()))
            if dstLen == 132 and "SKIP_TOKEN" in __import__("os").environ:
                data = b"\x00" * len(data)  # experiment: do NOT plant the token
            elif dstLen == 132 and "CORRUPT_TOKEN" in __import__("os").environ:
                data = data[:8] + bytes([data[8] ^ 0x01]) + data[9:]
            data = (data + b"\x00" * run_len)[:run_len]
            mem_write(run_ptr, data[:run_len])
        if dstLen in (41892, 132, 43) and not os.environ.get("NO_DUMP"):
            # POST state: this copy's bytes are now in memory -- the full assembled
            # record is only readable from this snapshot.
            open(".probe/wd-post-at%d.bin" % dstLen, "wb").write(bytes(mview()))
        _da = os.environ.get("DUMP_AT")
        if _da and CPY_N[0] == int(_da):
            open(".probe/wd-step%s.bin" % _da, "wb").write(bytes(mview()))
        if os.environ.get("WINDOW_TRACE"):
            buf = bytes(mview())
            open(".probe/zsec/win/%04d_%d.bin" % (CPY_N[0], dstLen), "wb").write(buf[0x155600:0x155700])
        events.append(("cpy", dstLen, l2, l3))
        return

    def valueNew(resultAddr, ctorRef, argvPtr, argc, argcPtr, x6):
        c = rp.next("valueNew")
        for r in (c.get("post") or []):
            if r[1] == 16 and r[2]:
                data = bytearray(base64.b64decode(r[2])[:16])
                N[0] += 1
                if VN_OFF is not None and N[0] == VN_IDX and VN_OFF < len(data):
                    data[VN_OFF] ^= FLIP_XOR
                mem_write(resultAddr, bytes(data))
                break
        events.append(("new",))
        return

    def valueSetIndex(ref, sp, val, sp2):
        rp.next("valueSetIndex")

    def valueLength(ref, sp):
        c = rp.next("valueLength")
        ret = c.get("ret") or ""
        if ret.startswith("B"):
            v = int(ret[1:], 16) & 0xFFFFFFFF
        else:
            try:
                v = int(float(ret)) & 0xFFFFFFFF
            except ValueError:
                v = 0
        N[1] += 1
        SEQLOG.append(('valueLength', CPY_N[0], v))
        if VL_IDX is not None and N[1] == VL_IDX:
            v = (v + VL_DELTA) & 0xFFFFFFFF
        return v - (1 << 32) if v >= 0x80000000 else v

    def valueIndex(ref, sp, sp2):
        c = rp.next("valueIndex")
        ret = c.get("ret") or ""
        v = int(ret[1:], 16) if ret.startswith("B") else 0
        N[2] += 1
        SEQLOG.append(('valueIndex', CPY_N[0], ret))
        if VI_IDX is not None and N[2] == VI_IDX:
            v = (v + VI_DELTA) & 0xFFFFFFFFFFFFFFFF
        return v & 0xFFFFFFFFFFFFFFFF

    linker = Linker(engine)
    SEQLOG = []
    ILOG = []
    def ilog(v, base):
        ILOG.append((v, base))
    linker.define_func("env", "ilog", FuncType([I64, I32], []), ilog)
    SLOG = []
    def ilogstr(ptr, ln):
        if 0 <= ln <= 200 and ptr > 0:
            try: SLOG.append(bytes(mview()[ptr:ptr+ln]))
            except Exception: pass
    linker.define_func("env", "ilogstr", FuncType([I32, I32], []), ilogstr)
    CAT = []
    def _rd(p_, l_):
        try: return bytes(mview()[p_:p_+l_]) if 0 <= l_ <= 4096 and p_ > 0 else b''
        except Exception: return b''
    def ilogcat(ap, al, bp, bl):
        CAT.append((_rd(ap, al), _rd(bp, bl)))
    linker.define_func("env", "ilogcat", FuncType([I32, I32, I32, I32], []), ilogcat)
    UL = []
    def ilogu(dst, v):
        UL.append((dst, v))
    linker.define_func("env", "ilogu", FuncType([I32, I32], []), ilogu)
    VMHIT = [0]
    def ilogvm(st, op):
        if op == 4 and VMHIT[0] < 4:
            VMHIT[0] += 1
            buf = bytes(mview())
            open(".probe/zsec/vmfull_%d.bin" % VMHIT[0], "wb").write(buf)
            print("ilogvm op=4 state=%#x memlen=%#x" % (st, len(buf)))
    linker.define_func("env", "ilogvm", FuncType([I32, I32], []), ilogvm)
    FNLOG = []
    def ilogfn(fid):
        if len(FNLOG) < 400000: FNLOG.append((fid, CPY_N[0]))
    linker.define_func("env", "ilogfn", FuncType([I32], []), ilogfn)
    OPLOG = []
    def ilogop(st, op):
        if len(OPLOG) < 400000:
            try: pc = int.from_bytes(bytes(mview()[st+20:st+24]), "little")
            except Exception: pc = -1
            OPLOG.append((CPY_N[0], pc, op))
    linker.define_func("env", "ilogop", FuncType([I32, I32], []), ilogop)
    PROG = [None]
    def ilogprog(st, op):
        if PROG[0] is None:
            try:
                buf = mview()
                ptr = int.from_bytes(bytes(buf[st+308:st+312]), "little")
                ln  = int.from_bytes(bytes(buf[st+312:st+316]), "little")
                cap = int.from_bytes(bytes(buf[st+316:st+320]), "little")
                if 0 < ln < 100000 and ptr > 0:
                    raw = bytes(buf[ptr:ptr+ln*4])
                    PROG[0] = (ptr, ln, cap, raw)
            except Exception as e:
                PROG[0] = ('err', str(e), 0, b'')
    linker.define_func("env", "ilogprog", FuncType([I32, I32], []), ilogprog)
    SL = []
    SLHIT=[0]
    SLOG2 = []
    def ilogsl(a,b,c,d,e,f,g):
        SL.append((a,b,c,d,e,f,g))
        try:
            if len(SLOG2) < 4000 and 2290000 <= a <= 2320000:
                SLOG2.append((a, b, c, d, e, f, g))
        except Exception:
            pass
        if f == 16 and d == 32 and SLHIT[0] < 6:
            SLHIT[0]+=1
            buf=bytes(mview())
            open(".probe/zsec/slwin_%d.bin" % SLHIT[0],"wb").write(buf)
            print("ilogsl hit#%d dst=%#x src=%#x memlen=%#x" % (SLHIT[0],a,b,len(buf)))
    linker.define_func("env", "ilogsl", FuncType([I32]*7, []), ilogsl)

    STLOG = []
    KEYTL = []
    STK = [os.environ.get("STK_FLIP")]
    STK_N = [0]
    def ilogst(st, op):
        try:
            b = mview()
            pc = int.from_bytes(bytes(b[st+20:st+24]), "little")
            if len(STLOG) < 4000:
                rec = {"pc": pc, "op": op, "cpyn": CPY_N[0]}
                for name, off in (("stack",296),("prog",308),("strs",320),("res",276),("ret",336),("ops",360)):
                    rec[name] = [int.from_bytes(bytes(b[st+off:st+off+4]),"little"),
                                 int.from_bytes(bytes(b[st+off+4:st+off+8]),"little"),
                                 int.from_bytes(bytes(b[st+off+8:st+off+12]),"little")]
                rec["regs"] = [int.from_bytes(bytes(b[st+k*4:st+k*4+4]),"little") for k in range(0,20)]
                if os.environ.get("KEYTL") and len(KEYTL) < 5000:
                    try:
                        _lo, _hi = 0x155800, 0x156400
                        w = bytes(b[_lo:min(_hi, len(b))]) if len(b) > _lo else b""
                        KEYTL.append((CPY_N[0], pc, len(w), 1 if b"3881401906" in w else 0, w[:64].hex()))
                    except Exception as _e:
                        KEYTL.append((CPY_N[0], pc, -1, -1, str(_e)[:40]))
                _dp = os.environ.get("DUMP_PC")
                if _dp not in (None, "") and pc == int(_dp) and "PD" not in rec:
                    rec["PD"] = 1
                    _o = os.environ.get("PDUMP_OUT") or (".probe/zsec/pdump_%s.bin" % _dp)
                    _lo, _hi = 0x155800, 0x156400
                    open(_o, "wb").write(bytes(b[_lo:min(_hi, len(b))]) if len(b) > _lo else b"")
                if STK[0] not in (None, "") and pc == int(os.environ.get("STK_PC","10311")):
                    off = int(STK[0], 0)
                    p_ = int.from_bytes(bytes(b[st+296:st+300]), "little")
                    l_ = int.from_bytes(bytes(b[st+300:st+304]), "little")
                    if 0 <= off < l_:
                        b[p_ + off] ^= 1
                        STK_N[0] += 1
                if "STATEDUMP_ALL" not in rec:
                    rec["STATEDUMP_ALL"] = [pc, list(bytes(b[st:st+2048]))]
                if pc == 10311 and "STATEDUMP" not in rec:
                    rec["STATEDUMP"] = list(bytes(b[st:st+512]))
                if pc in (10311, 10467) and "STACKDUMP" not in rec:
                    p_, l_, c_ = rec["stack"]
                    if 0 < l_ < 100000 and p_ > 0:
                        rec["STACKDUMP"] = list(bytes(b[p_:p_+min(l_,2400)]))
                STLOG.append(rec)
        except Exception as e:
            STLOG.append({"err": str(e)[:100]})
    linker.define_func("env", "ilogst", FuncType([I32, I32], []), ilogst)

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
        print(f"_start raised after {time.time()-t0:.2f}s:", str(e)[:300])
    out = b"".join(stdout_buf)
    if out:
        print("stdout:", out[:200])
    print("cursors:", rp.cursors)
    print("events tail:", events[-6:])

    buf = bytes(mview())
    hits = []
    for m in re.finditer(rb"005_[A-Za-z0-9+/=]{128}", buf):
        s = m.group().decode()
        if s not in hits:
            hits.append(s)
    print("payload candidates:", len(hits))
    for h in hits[:3]:
        print("   ", h)
    if hits and not os.environ.get("NO_DUMP"):
        open(".probe/wd-payload.txt", "w").write(hits[0])
    if os.environ.get("KEYTL_FILE"):
        import json as _json
        _json.dump(KEYTL, open(os.environ["KEYTL_FILE"], "w"))
        print("KEYTL entries:", len(KEYTL))
    if STK[0] not in (None, ""):
        print("STK modifications applied:", STK_N[0])
    if os.environ.get("ST_FILE"):
        import json as _json
        _json.dump(STLOG, open(os.environ["ST_FILE"], "w"))
        print("STLOG entries:", len(STLOG))
    if os.environ.get("PROG_FILE") and PROG[0]:
        ptr, ln, cap, raw = PROG[0]
        open(os.environ["PROG_FILE"], "wb").write(raw)
        print("PROG ptr=%#x len=%d cap=%d bytes=%d" % (ptr, ln, cap, len(raw)))
    if os.environ.get("OP_FILE"):
        import json as _json
        _json.dump(OPLOG, open(os.environ["OP_FILE"], "w"))
        print("OPLOG calls:", len(OPLOG))
    if os.environ.get("FN_FILE"):
        import json as _json
        _json.dump(FNLOG, open(os.environ["FN_FILE"], "w"))
        print("FNLOG calls:", len(FNLOG))
    if os.environ.get("SEQ_FILE"):
        import json as _json
        _json.dump(SEQLOG, open(os.environ["SEQ_FILE"], "w"))
        print("SEQLOG:", SEQLOG)
    if SL and os.environ.get("SL_FILE"):
        import json as _json
        _json.dump(SL, open(os.environ["SL_FILE"], "w"))
        print("sliceAppend calls:", len(SL))
    if UL and os.environ.get("UL_FILE"):
        import json as _json
        _json.dump(UL, open(os.environ["UL_FILE"], "w"))
        print("Uitoa calls:", len(UL))
    if CAT and os.environ.get("CAT_FILE"):
        import json as _json
        _json.dump([[a.decode('latin1'), b.decode('latin1')] for a, b in CAT],
                   open(os.environ["CAT_FILE"], "w", encoding="utf-8"))
        print("stringConcat calls:", len(CAT))
    if SLOG and os.environ.get("SLOG_FILE"):
        import json as _json
        _json.dump([b.decode('latin1') for b in SLOG], open(os.environ["SLOG_FILE"], "w", encoding="utf-8"))
    if SLOG:
        print("WriteString calls (%d):" % len(SLOG))
        for k, b in enumerate(SLOG):
            try: t = b.decode('utf-8')
            except Exception: t = b.hex(' ')
            print("   #%-3d len=%-4d %r" % (k, len(b), t[:80]))
    if ILOG:
        print("ilog calls (%d):" % len(ILOG))
        for k, (v, b) in enumerate(ILOG):
            print("   #%d v=%#x base=%d" % (k, v, b))
    rr = re.search(rb"[0-9a-f]{48}[0-9a-f]{32}z[0-9a-f]{12}", buf)
    if rr:
        t = rr.group().decode()
        print("12 x uint16 =", " ".join(t[i*4:i*4+4] for i in range(12)))


if __name__ == "__main__":
    main()
