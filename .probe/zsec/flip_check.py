"""翻转某条环境检测的结果，观察 record93[0:48) 的哪个 uint16 变 —— 求赋值映射。

用法: python .probe/zsec/flip_check.py <copy序号> [y|n]
"""
import base64, json, re, sys, time
from wasmtime import Config, Engine, Store, Module, FuncType, ValType, Linker

I32 = ValType.i32(); I64 = ValType.i64(); F64 = ValType.f64()
WASM = ".probe/build-859e.wasm"
CAPTURE = ".probe/browser-proto7.json"

FLIP_IDX = int(sys.argv[1]) if len(sys.argv) > 1 else -1
FLIP_TO = (sys.argv[2] if len(sys.argv) > 2 else 'y').encode()


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
    cpy_n = [0]

    def mview():
        return mem.get_buffer_ptr(store)

    def mread(a, n):
        return bytes(mview()[a:a + n])

    def mwrite(a, d):
        mview()[a:a + len(d)] = d

    def fd_write(fd, iovs, cnt, nw):
        t = 0
        for k in range(cnt):
            b = iovs + k * 8
            t += int.from_bytes(mread(b + 4, 4), "little")
        mwrite(nw, t.to_bytes(4, "little"))
        return 0

    def ticks():
        return time.time() * 1000.0

    def finalizeRef(ref, sp):
        rp.next("finalizeRef")

    def copyBytesToGo(sp, fsz, refA, refB, dstPtr, dstLen, dstCap, p2, l2, c2, p3, l3, c3, sp2):
        c = rp.next("copyBytesToGo")
        ca = [num(x) for x in c["a"]]
        roles = {}
        for ci, rp_ptr, rl in ((0, sp, 16), (4, dstPtr, dstLen), (7, p2, l2), (10, p3, l3)):
            if ca[ci] is not None:
                roles[ca[ci]] = (rp_ptr, rl)
        cpy_n[0] += 1
        for r in (c.get("post") or []):
            cp, cl, b64 = r[0], r[1], r[2]
            if cp not in roles or not b64:
                continue
            run_ptr, run_len = roles[cp]
            if run_len <= 0:
                continue
            data = base64.b64decode(b64)
            if cpy_n[0] == FLIP_IDX and cl == 1:
                data = FLIP_TO
            data = (data + b"\x00" * run_len)[:run_len]
            mwrite(run_ptr, data[:run_len])

    def valueNew(resultAddr, ctorRef, argvPtr, argc, argcPtr, x6):
        c = rp.next("valueNew")
        for r in (c.get("post") or []):
            if r[1] == 16 and r[2]:
                mwrite(resultAddr, base64.b64decode(r[2])[:16]); break

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
    except Exception:
        pass
    b = bytes(mview())
    pat = re.compile(rb"[0-9a-f]{48}[0-9a-f]{32}z[0-9a-f]{12}")
    hits = [m.group().decode() for m in pat.finditer(b)]
    if not hits:
        print('翻转 copy#%d -> %r : 未找到 record93' % (FLIP_IDX, FLIP_TO.decode()))
        return
    r = hits[0]
    words = [r[i*4:i*4+4] for i in range(12)]
    print('翻转 copy#%-3d -> %r  record93[0:48) = %s' % (FLIP_IDX, FLIP_TO.decode(), r[0:48]))
    print('    12 x uint16 = %s' % ' '.join(words))


if __name__ == "__main__":
    main()
