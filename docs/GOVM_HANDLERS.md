# Go VM 的 104 个 `$bound` 方法 —— 批量解析

> 来源：`.probe/wt/zse.wat`（TinyGo 0.31.2）。脚本 `tools/parse104.py`。
> 原始数据：`.probe/zsec/govm_handlers_raw.json`。

## 归类统计

| 类别 | 个数 |
|---|---|
| 右移拼装（位提取） | 75 |
| 左移拼装（位提取） | 14 |
| 调用解释器 _00oooO | 8 |
| 其他 | 6 |
| 调用 _O0o0Oo | 1 |

## 右移拼装（位提取）（75 个）

| 方法 | wasm B | 参 | 局 | VM字段偏移 | 小常量 | 大常量(字符串ptr) | 调用 | 位运算 |
|---|---|---|---|---|---|---|---|---|
| `_00000Obound` | 1752 | 1 | 5 | 20,308 | 1,2,3,4,12 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×1 i32.or×2 |
| `_000OoObound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_000o0obound` | 1751 | 1 | 5 | 20,308 | 1,2,3,7,9 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×1 i32.or×2 |
| `_00OOO0bound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,7,30,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_00OoOObound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,7,30,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_00o0O0bound` | 1486 | 1 | 5 | 20,308 | 1,2,3,6 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×3 i32.shr_s×1 i32.or×1 |
| `_00o0OObound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,24,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_00o0Oobound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_00oOoobound` | 1486 | 1 | 5 | 20,308 | 1,2,3,4 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×3 i32.shr_s×1 i32.or×1 |
| `_00ooO0bound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,6,7,28,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_00oooobound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,6,28,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_0O0O00bound` | 1752 | 1 | 5 | 20,308 | 1,2,3,6,10 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×1 i32.or×2 |
| `_0O0o00bound` | 1752 | 1 | 5 | 20,308 | 1,2,3,7,15 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×1 i32.or×2 |
| `_0O0oOobound` | 2002 | 1 | 6 | 20,308 | 1,2,3,4,6,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.shr_u×1 i32.or |
| `_0O0ooObound` | 1916 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.shr_u×1 i32.or |
| `_0OO0oObound` | 1964 | 1 | 6 | 20,308 | 1,2,3,4,6,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 i32.and×2 |
| `_0OOO00bound` | 1700 | 1 | 5 | 20,308 | 1,2,3,5,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 |
| `_0OOO0Obound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,5,7,24,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_0Oo000bound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,5,6,24,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_0Ooo00bound` | 1752 | 1 | 5 | 20,308 | 1,2,3,5,13 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×1 i32.or×2 |
| `_0o0O00bound` | 1700 | 1 | 5 | 20,308 | 1,2,3,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 |
| `_0oO0o0bound` | 1700 | 1 | 5 | 20,308 | 1,2,3,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 |
| `_0oOoO0bound` | 1964 | 1 | 6 | 20,308 | 1,2,3,4,5,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 i32.and×2 |
| `_0oOooObound` | 1486 | 1 | 5 | 20,308 | 1,2,3,7 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×3 i32.shr_s×1 i32.or×1 |
| `_0oo0OObound` | 1916 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.shr_u×1 i32.or |
| `_0ooOO0bound` | 1964 | 1 | 6 | 20,308 | 1,2,3,4,6,28,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 i32.and×2 |
| `_0ooOo0bound` | 1964 | 1 | 6 | 20,308 | 1,2,3,4,7,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 i32.and×2 |
| `_0ooOoObound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,5,24,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_0oooOobound` | 1700 | 1 | 5 | 20,308 | 1,2,3,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 |
| `_O000O0bound` | 7591 | 1 | 9 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,6,8,13,16 | 65280,71680,71780,315316 | $main._0oooOO, $runtime.alloc, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×12 i32.shr_s×1 i32.or×1 i32.and× |
| `_O000Oobound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,5,6,28,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_O00o0obound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_O0o0oobound` | 1700 | 1 | 5 | 20,308 | 1,2,3,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 |
| `_O0oO00bound` | 1916 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.shr_u×1 i32.or |
| `_O0oO0obound` | 1700 | 1 | 5 | 20,308 | 1,2,3,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 |
| `_O0oOo0bound` | 7591 | 1 | 9 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,5,8,13,16 | 65280,71680,71780,315316 | $main._0oooOO, $runtime.alloc, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×12 i32.shr_s×1 i32.or×1 i32.and× |
| `_OO0000bound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,6,28,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_OO0OOobound` | 1878 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_OOOO00bound` | 1878 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_OOOOOobound` | 1486 | 1 | 5 | 20,308 | 1,2,3,7 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×3 i32.shr_s×1 i32.or×1 |
| `_OOo0O0bound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,24,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_OOo0OObound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,5,7,30,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_OOoOOObound` | 1486 | 1 | 5 | 20,308 | 1,2,3,6 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×3 i32.shr_s×1 i32.or×1 |
| `_OOooo0bound` | 1700 | 1 | 5 | 20,308 | 1,2,3,5,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 |
| `_Oo00Oobound` | 1916 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.shr_u×1 i32.or |
| `_Oo00oobound` | 1878 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_Oo0OOobound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_Oo0o00bound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,5,24,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_Oo0oOobound` | 1700 | 1 | 5 | 20,308 | 1,2,3,4,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 |
| `_OoO00obound` | 1964 | 1 | 6 | 20,308 | 1,2,3,4,5,24,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 i32.and×2 |
| `_OoO0oobound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,5,6,28,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_OoOOOobound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,6,7,30,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_OoOoOobound` | 1878 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_OooOO0bound` | 1752 | 1 | 5 | 20,308 | 1,2,3,5,11 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×1 i32.or×2 |
| `_Oooo00bound` | 1916 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.shr_u×1 i32.or |
| `_o00O0obound` | 1486 | 1 | 5 | 20,308 | 1,2,3,5 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×3 i32.shr_s×1 i32.or×1 |
| `_o00OoObound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,24,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_o00o0obound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,5,6,24,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_o00oOObound` | 1700 | 1 | 5 | 20,308 | 1,2,3,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 |
| `_o0Oo00bound` | 1964 | 1 | 6 | 20,308 | 1,2,3,4,7,30,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 i32.and×2 |
| `_o0OoOobound` | 2002 | 1 | 6 | 20,308 | 1,2,3,4,7,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.shr_u×1 i32.or |
| `_o0o0Oobound` | 1878 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_o0oOoObound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,24,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_oO0ooObound` | 2075 | 1 | 6 | 20,308 | 1,2,3,4,5,24,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×2 i32.or×2 i32.and×2 |
| `_oOO0o0bound` | 2002 | 1 | 6 | 20,308 | 1,2,3,4,7,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.shr_u×1 i32.or |
| `_oOO0oobound` | 1916 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.shr_u×1 i32.or |
| `_oOOO0Obound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,24,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_oOOooobound` | 7629 | 1 | 9 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,6,8,13,16 | 65280,71680,71780,315316 | $main._0oooOO, $runtime.alloc, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×12 i32.shr_s×1 i32.shr_u×1 i32.o |
| `_oOoOo0bound` | 1700 | 1 | 5 | 20,308 | 1,2,3,4,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×1 i32.or×1 |
| `_oo0Ooobound` | 1752 | 1 | 5 | 20,308 | 1,2,3,6,14 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.shr_s×1 i32.or×2 |
| `_ooO0oobound` | 1878 | 1 | 5 | 20,308 | 1,2,3,6,28,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_ooOoO0bound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_ooOoOObound` | 1486 | 1 | 5 | 20,308 | 1,2,3,5 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×3 i32.shr_s×1 i32.or×1 |
| `_ooo0Oobound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |
| `_oooO0Obound` | 1878 | 1 | 5 | 20,308 | 1,2,3,5,24,31 |  | _OOo0o0, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.shr_s×2 i32.or×1 i32.and×2 |

## 左移拼装（位提取）（14 个）

| 方法 | wasm B | 参 | 局 | VM字段偏移 | 小常量 | 大常量(字符串ptr) | 调用 | 位运算 |
|---|---|---|---|---|---|---|---|---|
| `_000000bound` | 5056 | 1 | 7 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,7,8,24,28 | 65280,315316 | _O0o0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×8 i32.or×1 i32.and×1 i32.gt_u×1 |
| `_0Ooo0obound` | 5058 | 1 | 7 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,7,8,24,28 | 65280,315316 | _O0o0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×7 i32.or×1 i32.and×2 i32.gt_u×1 |
| `_0o0Ooobound` | 5056 | 1 | 7 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,7,8,24,28 | 315316 | _O0o0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×8 i32.or×1 i32.gt_u×1 |
| `_0oOOOObound` | 5094 | 1 | 7 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,7,8,24,28 | 65280,315316 | _O0o0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×8 i32.or×1 i32.and×2 i32.gt_u×1 |
| `_O0000Obound` | 5093 | 1 | 7 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,7,8,24,28 | 65280,315316 | _O0o0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×8 i32.or×1 i32.and×2 i32.gt_u×1 |
| `_OO000obound` | 1714 | 1 | 5 | 20,308 | 1,2,3,8,16 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×5 i32.or×2 |
| `_OoOoOObound` | 5093 | 1 | 7 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,7,8,24,28 | 315316 | _O0o0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×8 i32.or×1 i32.and×1 i32.gt_u×1 |
| `_Ooooo0bound` | 7992 | 1 | 9 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,4,8,12,15 | 295176,315312,315316 | $runtime.alloc, $runtime.lookupPanic, $runtime.nilPanic, $runtime.sliceAppend, $runtime.sl | i32.shl×8 i32.or×1 i32.gt_u×2 |
| `_o0O000bound` | 5094 | 1 | 7 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,7,8,24,28 | 315316 | _O0o0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×8 i32.or×1 i32.and×1 i32.gt_u×1 |
| `_o0O00obound` | 1662 | 1 | 5 | 20,308 | 1,2,3,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.or×1 |
| `_o0O0oObound` | 1662 | 1 | 5 | 20,308 | 1,2,3,8 |  | _0OO0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×4 i32.or×1 |
| `_o0OOOobound` | 1448 | 1 | 5 | 20,308 | 1,2,3,8 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×3 i32.or×1 |
| `_oo0o0obound` | 3864 | 1 | 8 | 4,8,12,16,20,24,308,376 | 1,2,3,4,8,32 | 315316 | $runtime.lookupPanic, $runtime.nilPanic | i32.shl×6 i32.or×1 |
| `_oooOO0bound` | 5058 | 1 | 7 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,7,8,24,28 | 315316 | _O0o0Oo, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×7 i32.or×1 i32.and×1 i32.gt_u×1 |

## 调用解释器 _00oooO（8 个）

| 方法 | wasm B | 参 | 局 | VM字段偏移 | 小常量 | 大常量(字符串ptr) | 调用 | 位运算 |
|---|---|---|---|---|---|---|---|---|
| `_0O00oObound` | 977 | 1 | 2 | 20,308 | 1,2,3,5 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×1 i32.shr_s×1 |
| `_0O0oo0bound` | 977 | 1 | 2 | 20,308 | 1,2,3,6 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×1 i32.shr_s×1 |
| `_OO0O0obound` | 977 | 1 | 2 | 20,308 | 1,2,3,4 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×1 i32.shr_s×1 |
| `_Oo0O0obound` | 977 | 1 | 2 | 20,308 | 1,2,3,7 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×1 i32.shr_s×1 |
| `_Oo0o0obound` | 939 | 1 | 2 | 20,308 | 1,2,3 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×1 |
| `_o0O0Oobound` | 977 | 1 | 2 | 20,308 | 1,2,3 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×1 i32.shr_s×1 |
| `_o0Ooo0bound` | 977 | 1 | 2 | 20,308 | 1,2,3 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×1 i32.shr_s×1 |
| `_o0ooO0bound` | 977 | 1 | 2 | 20,308 | 1,2,3 |  | _00oooO, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×1 i32.shr_s×1 |

## 其他（6 个）

| 方法 | wasm B | 参 | 局 | VM字段偏移 | 小常量 | 大常量(字符串ptr) | 调用 | 位运算 |
|---|---|---|---|---|---|---|---|---|
| `_000o00bound` | 3779 | 1 | 7 | 4,8,12,16,20,24,308,376 | 0,1,2,3,5,16,18,24 | 70873,71820,315316 | $runtime.lookupPanic, $runtime.nilPanic, $runtime.runtimePanic | i32.shl×4 i32.and×1 i32.ne×1 i32.gt_u×1 |
| `_000oOObound` | 320 | 1 | 0 | 20 | 0,1 |  | $runtime.nilPanic |  |
| `_0OOo0obound` | 1891 | 1 | 6 | 20,308 | 1,2,3,4,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×3 i32.shr_u×1 i32.and×2 |
| `_OOO0oobound` | 1891 | 1 | 6 | 20,308 | 1,2,3,4,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×3 i32.shr_u×1 i32.and×2 |
| `_OOOoOobound` | 6007 | 1 | 7 | 4,8,12,16,20,24,28,32,36,40 | 0,1,2,3,12,16,17 | 315316 | $runtime.lookupPanic, $runtime.nilPanic, $runtime.slicePanic | i32.shl×3 i32.mul×2 i32.gt_u×3 |
| `_Oo0O00bound` | 1853 | 1 | 6 | 20,308 | 1,2,3,4,31 |  | _O0O00o, $runtime.lookupPanic, $runtime.nilPanic | i32.shl×3 i32.and×2 |

## 调用 _O0o0Oo（1 个）

| 方法 | wasm B | 参 | 局 | VM字段偏移 | 小常量 | 大常量(字符串ptr) | 调用 | 位运算 |
|---|---|---|---|---|---|---|---|---|
| `_00OooObound` | 11444 | 1 | 6 | 4,8,12,20,24,28,40,44,56,60 | 0,1,2,3,4,8,12,18 | 70873,71780,315312,315316 | _O0o0Oo, $runtime.alloc, $runtime.lookupPanic, $runtime.nilPanic, $runtime.runtimePanic, $ | i32.shl×4 i32.and×2 i32.ne×1 i32.gt_u×2 |
