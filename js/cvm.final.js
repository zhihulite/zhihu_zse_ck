// js/cvm.restored.js 的帧还原版（tools/ast_frames.js）
// A[3] = 返回值寄存器 ⇒ return / ret；A[0],A[1] 死代码删除 14 条；
// return 改写 11 处；ret = CALL; v = ret ⇒ v = CALL 折叠 2 处。
// js/cvm.restored.source.js 的美化版（tools/beautify_restored.js）
// 本文件由提升后的 SSA 形式还原：对象字面量重建 1 处、SUB->FR_ 0 处、
// M_SET->赋值 3 处、TRACE 剔除 119 处、M_EVAL->eval 0 处、实参折叠 0 处。
let H1;
// lifted from js/cvm.decompiled.js -- operand-stack folding + structured control flow
function M_GET(o, k) {
  return o === undefined || o === null ? undefined : o[k];
}
function M_SET(o, k, v) {
  if (o !== undefined && o !== null) o[k] = v;
  return v;
}
function M_EVAL(name) {
  return eval(name);
}
function RUN(l, D, A, pc) {
  A = A || [undefined, undefined, undefined, undefined];
  l = l || [];
  const S = [];
  let F = false;
  switch (pc) {
    case 0:
      return FR_0(A, l, S);
    case 877:
      return FR_877(A, l, S);
    default:
      throw new Error("bad pc " + pc);
  }
}
/* 无入参：l[0] = 0；l[t>=1] = 调用者 l[t-1]（索引 +1 位移） */
function FR_0(A, l, S) {
  let ret;
  const LIT_1 = {
    A: A,
    l: l
  };
  let F = false;
  let v0 = l[0],
    v1 = l[1],
    v2 = l[2],
    v3 = l[3],
    v4 = l[4],
    v5 = l[5],
    v6 = l[6],
    v7 = l[7],
    v8 = l[8],
    v9 = l[9],
    v10 = l[10],
    v11 = l[11];
  let v12 = l[12],
    v13 = l[13],
    v14 = l[14],
    v15 = l[15],
    v16 = l[16],
    v17 = l[17],
    v18 = l[18],
    v19 = l[19],
    v20 = l[20],
    v21 = l[21],
    v22 = l[22],
    v23 = l[23];
  let v24 = l[24],
    v25 = l[25];
  v0 = 7;
  ret = 7 > 6;
  if (7 > 6) {
    H1 = {
      get: new Function("a", "b", "return b in a ? a[b]: undefined"),
      set: new Function("a", "b", "c", "a[b]=c;return true")
    };
    v1 = H1;
    v2 = new Function("a", "b", "return b in a ? a[b]: undefined");
    v3 = new Function("a", "b", "c", "a[b]=c;return true");
    v4 = new Proxy(window, H1);
    v5 = new Proxy(window, H1)?.Function;
    v6 = new Proxy(window, H1)?.document;
    v7 = 1 << 15;
    v8 = 1 << 14;
    v9 = 1 << 13;
    v10 = 1 << 12;
    v11 = new (new Proxy(window, H1)?.Function)(SRC0);
    v12 = new (new Proxy(window, H1)?.Function)(SRC0)();
    S.push("window={};document={};");
    S.push(new Function("a", "b", "return b in a ? a[b]: undefined"));
    S.push(new Function("a", "b", "c", "a[b]=c;return true"));
    if (new (new Proxy(window, H1)?.Function)(SRC0)() > 1) {
      v7 |= 1 << 14;
      S.push(1 << 14);
      S.push(v7 | 1 << 14);
    }
    v14 = new v5("a", "try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}");
    v15 = new v5("a", "try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}")(":defined");
    if (new v5("a", "try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}")(":defined") !== 2) {
      v7 |= 1 << 13;
      S.push(1 << 13);
      S.push(v7 | 1 << 13);
    }
    v15 = v14("div:not(:has(div))");
    if (v14("div:not(:has(div))") !== 2) {
      v7 |= 1 << 12;
      S.push(1 << 12);
      S.push(v7 | 1 << 12);
    }
    v16 = v6?.body;
    v17 = v6.createNodeIterator(v6?.body);
    if (typeof v6.createNodeIterator(v6?.body)?.root === "undefined") {
      v7 |= 1 << 10;
      S.push(1 << 10);
      S.push(v7 | 1 << 10);
    }
    if (typeof v17?.filter === "undefined") {
      v7 |= 1 << 9;
      S.push(1 << 9);
      S.push(v7 | 1 << 9);
    }
    if (typeof v17?.detach === "undefined") {
      v7 |= 1 << 8;
      S.push(1 << 8);
      S.push(v7 | 1 << 8);
    }
    if (typeof v17?.whatToShow === "undefined") {
      v7 |= 1 << 7;
      S.push(1 << 7);
      S.push(v7 | 1 << 7);
    }
    v18 = v6.createRange();
    if (typeof v6.createRange()?.cloneRange === "undefined") {
      v7 |= 1 << 6;
      S.push(1 << 6);
      S.push(v7 | 1 << 6);
    }
    if (typeof v18?.cloneContents === "undefined") {
      v7 |= 1 << 5;
      S.push(1 << 5);
      S.push(v7 | 1 << 5);
    }
    if (typeof v18?.collapse === "undefined") {
      v7 |= 1 << 4;
      S.push(1 << 4);
      S.push(v7 | 1 << 4);
    }
    if (typeof v18?.collapsed === "undefined") {
      v7 |= 1 << 3;
      S.push(1 << 3);
      S.push(v7 | 1 << 3);
    }
    if (typeof v18?.commonAncestorContainer === "undefined") {
      v7 |= 1 << 2;
      S.push(1 << 2);
      S.push(v7 | 1 << 2);
    }
    if (typeof v18?.compareBoundaryPoints === "undefined") {
      v7 |= 1 << 1;
      S.push(1 << 1);
      S.push(v7 | 1 << 1);
    }
    if (typeof v18?.comparePoint === "undefined") {
      v7 |= 1;
      S.push(1);
      S.push(v7 | 1);
    }
    if (typeof v18?.endOffset === "undefined") {
      v8 |= 1 << 15;
      S.push(1 << 15);
      S.push(v8 | 1 << 15);
    }
    if (typeof v18?.extractContents === "undefined") {
      v8 |= 1 << 13;
      S.push(1 << 13);
      S.push(v8 | 1 << 13);
    }
    if (typeof v18?.getBoundingClientRect === "undefined") {
      v8 |= 1 << 12;
      S.push(1 << 12);
      S.push(v8 | 1 << 12);
    }
    if (typeof v18?.getClientRects === "undefined") {
      v8 |= 1 << 11;
      S.push(1 << 11);
      S.push(v8 | 1 << 11);
    }
    if (typeof v18?.insertNode === "undefined") {
      v8 |= 1 << 11;
      S.push(1 << 11);
      S.push(v8 | 1 << 11);
    }
    if (typeof v18?.intersectsNode === "undefined") {
      v8 |= 1 << 10;
      S.push(1 << 10);
      S.push(v8 | 1 << 10);
    }
    if (typeof v18?.isPointInRange === "undefined") {
      v8 |= 1 << 9;
      S.push(1 << 9);
      S.push(v8 | 1 << 9);
    }
    if (typeof v18?.selectNode === "undefined") {
      v8 |= 1 << 8;
      S.push(1 << 8);
      S.push(v8 | 1 << 8);
    }
    if (typeof v18?.selectNodeContents === "undefined") {
      v8 |= 1 << 7;
      S.push(1 << 7);
      S.push(v8 | 1 << 7);
    }
    if (typeof v18?.setEnd === "undefined") {
      v8 |= 1 << 6;
      S.push(1 << 6);
      S.push(v8 | 1 << 6);
    }
    if (typeof v18?.setEndAfter === "undefined") {
      v8 |= 1 << 5;
      S.push(1 << 5);
      S.push(v8 | 1 << 5);
    }
    if (typeof v18?.setEndBefore === "undefined") {
      v8 |= 1 << 4;
      S.push(1 << 4);
      S.push(v8 | 1 << 4);
    }
    if (typeof v18?.setStart === "undefined") {
      v8 |= 1 << 3;
      S.push(1 << 3);
      S.push(v8 | 1 << 3);
    }
    if (typeof v18?.setStartAfter === "undefined") {
      v8 |= 1 << 2;
      S.push(1 << 2);
      S.push(v8 | 1 << 2);
    }
    if (typeof v18?.setStartBefore === "undefined") {
      v8 |= 1 << 1;
      S.push(1 << 1);
      S.push(v8 | 1 << 1);
    }
    if (typeof v18?.startContainer === "undefined") {
      v8 |= 1;
      S.push(1);
      S.push(v8 | 1);
    }
    v19 = String.fromCharCode("8206");
    v7 = v7.toString(16);
    v8 = v8.toString(16);
    v20 = v7.toString(16) + v8.toString(16);
    v20 = /*argc=2 */FR_877(A, l, S);
    v21 = new v5(SRC1);
    v22 = new v5(SRC1)();
    v22 = /*argc=2 */FR_877(A, l, S);
    __c.qh = v20 + String.fromCharCode("8206") + v22;
    S.push(v7.toString(16));
    S.push(v8.toString(16));
    S.push(v7.toString(16) + v8.toString(16));
    S.push(v7.toString(16) + v8.toString(16));
    S.push("6a6cb1bb3970bae6");
    S.push(ret);
    S.push(new v5(SRC1)());
    S.push("44ae0b7a68bf0f7a");
    S.push(ret);
    S.push(v20 + String.fromCharCode("8206") + v22);
  }
  v1 = {};
  v2 = new Function("a", "b", "return b in a ? a[b]: undefined");
  ({}).get = new Function("a", "b", "return b in a ? a[b]: undefined");
  v23 = ({}?.["get"]).toString()?.length;
  v24 = BVM.toString();
  ret = ({}?.["get"]).toString()?.length > 60;
  if (!(({}?.["get"]).toString()?.length > 60)) {
    ret = typeof __b?.zh !== "undefined";
    if (!(typeof __b?.zh !== "undefined")) {
      ret = v24.indexOf("onsol") !== -1;
      if (!(v24.indexOf("onsol") !== -1)) {
        v25 = new Error()?.stack;
        ret = (new Error()?.stack).indexOf("node") !== -1;
        if (!((new Error()?.stack).indexOf("node") !== -1)) {
          ret = v25.indexOf("executeUserEntryPoint") !== -1;
          if (!(v25.indexOf("executeUserEntryPoint") !== -1)) {
            ret = (Function?.prototype?.constructor).toString().indexOf("native") === -1;
            if (!((Function?.prototype?.constructor).toString().indexOf("native") === -1)) {
              if (!(typeof window?.v_log !== "undefined")) {
                return 10;
              } else {
                return 5;
              }
            } else {
              return 5;
            }
          } else {
            return 5;
          }
        } else {
          return 5;
        }
      } else {
        return 5;
      }
    } else {
      return 5;
    }
  } else {
    return 5;
  }
  return ret;
}
/* 入参 2 个：l[0..1] = 实参（S 尾部）；l[t>=2] = 调用者 l[t-1] */
function FR_877(A, l, S) {
  let ret;
  let F = false;
  let v0 = l[0],
    v1 = l[1],
    v28 = l[28],
    v29 = l[29],
    v30 = l[30],
    v31 = l[31],
    v32 = l[32],
    v33 = l[33],
    v34 = l[34],
    v35 = l[35],
    v36 = l[36],
    v37 = l[37];
  v28 = "";
  v29 = v0?.length;
  v30 = v1?.length;
  v31 = __b?.a3;
  v32 = 0;
  L894: for (;;) {
    t0 = v32;
    t1 = v29;
    t2 = v32 < v29;                 // 循环条件 i < n
    F = t2;
    if (!t2) break L894;
    t0 = v32;
    t1 = v0;
    t2 = v0.charCodeAt(v32);        // 输入字符
    v33 = t2;
    t3 = v32;
    t4 = v30;
    t5 = v32 % v30;                 // key 下标 i % klen
    v34 = __b;
    t6 = __b;
    t7 = v1;
    t8 = v1.charCodeAt(t5);         // key 字符
    v35 = t8;
    t9 = t2;
    t10 = t8;
    t11 = t9 ^ t10;
    t12 = v31;
    t13 = t11 ^ t12;                // out = in ^ key ^ state
    v36 = t13;
    t14 = t13;
    v31 = t13;                      // state = out
    t15 = t13;
    t16 = String;
    t17 = String.fromCharCode(t15);
    v37 = t17;
    t18 = v28;
    t19 = t17;
    t20 = v28 + t17;                // acc += out
    v28 = t20;
    t21 = v32;
    t22 = 1;
    t23 = v32 + 1;
    v32 = v32 + 1;
    S.push(t15);
    S.push(v28);
    continue L894;
  }
  __b.a3 = v31;
  return v28;
  return ret;
}
function SUB(entry, argc, A, l, S) {
  const args = argc ? S.splice(-argc) : [];
  const cl = [0].concat(l);
  for (let t = 0; t < args.length; t++) cl[t] = args[t];
  const r = RUN(cl, null, undefined, entry);
  const v = r && r.A ? r.A[3] : undefined;
  return typeof v === "number" ? String(v) : v;
}
function SUBCALL(A, l, S, i, argc) {
  return SUB(A[i], argc, A, l, S);
}
if (typeof module !== "undefined") {
  module.exports = {
    RUN: RUN,
    M_GET: M_GET,
    M_SET: M_SET,
    M_EVAL: M_EVAL,
    SUB: SUB
  };
}
