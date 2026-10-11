// js/inner.restored.js 的帧还原版（tools/ast_frames.js）
// A[3] = 返回值寄存器 ⇒ return / ret；A[0],A[1] 死代码删除 24 条；
// return 改写 20 处；ret = CALL; v = ret ⇒ v = CALL 折叠 1 处。
// js/inner.restored.source.js 的美化版（tools/beautify_restored.js）
// 本文件由提升后的 SSA 形式还原：对象字面量重建 3 处、SUB->FR_ 0 处、
// M_SET->赋值 3 处、TRACE 剔除 142 处、M_EVAL->eval 0 处、实参折叠 0 处。
let H1, H2, H3;
// lifted from js/inner.decompiled.js -- operand-stack folding + structured control flow
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
    case 735:
      return FR_735(A, l, S);
    case 869:
      return FR_869(A, l, S);
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
    v14 = l[14];
  v0 = FR_735(A, l, S);
  FR_735(A, l, S);
  ret = FR_735(A, l, S) > 4;
  if (FR_735(A, l, S) > 4) {
    __b.a3 = 41;
    v1 = String.fromCharCode("8204");
    v2 = __b?.zh;
    v3 = 1 << 15;
    v4 = 1 << 15;
    v5 = 1 << 15;
    H2 = {
      get: new Function("a", "b", "return b in a ? a[b]: undefined"),
      set: new Function("a", "b", "c", "a[b]=c;return true")
    };
    v6 = H2;
    v7 = new Function("a", "b", "return b in a ? a[b]: undefined");
    v8 = new Function("a", "b", "c", "a[b]=c;return true");
    v9 = new Proxy(location, H2);
    S.push(41);
    S.push(new Function("a", "b", "return b in a ? a[b]: undefined"));
    S.push(new Function("a", "b", "c", "a[b]=c;return true"));
    if (location.toString().indexOf("zhihu") === -1) {
      v3 |= 1 << 14;
      S.push(1 << 14);
      S.push(v3 | 1 << 14);
    }
    if ((v9?.toString).toString().indexOf("native") === -1) {
      v3 |= 1 << 13;
      S.push(1 << 13);
      S.push(v3 | 1 << 13);
    }
    if (typeof v9?.host === "undefined") {
      v3 |= 1 << 12;
      S.push(1 << 12);
      S.push(v3 | 1 << 12);
    }
    if (typeof v9?.hostname === "undefined") {
      v3 |= 1 << 11;
      S.push(1 << 11);
      S.push(v3 | 1 << 11);
    }
    if (typeof window?.devicePixelRatio === "undefined") {
      v3 |= 1 << 10;
      S.push(1 << 10);
      S.push(v3 | 1 << 10);
    }
    if (typeof window?.blur === "undefined") {
      v3 |= 1 << 9;
      S.push(1 << 9);
      S.push(v3 | 1 << 9);
    }
    if ((window?.blur).toString().indexOf("native") === -1) {
      v3 |= 1 << 8;
      S.push(1 << 8);
      S.push(v3 | 1 << 8);
    }
    if (typeof window?.self === "undefined") {
      v3 |= 1 << 7;
      S.push(1 << 7);
      S.push(v3 | 1 << 7);
    }
    if (typeof history?.pushState !== "function") {
      v3 |= 1 << 6;
      S.push(1 << 6);
      S.push(v3 | 1 << 6);
    }
    if ((window?.XMLDocument).toString().indexOf("native") === -1) {
      v3 |= 1 << 5;
      S.push(1 << 5);
      S.push(v3 | 1 << 5);
    }
    if (typeof window?.find === "undefined") {
      v3 |= 1 << 4;
      S.push(1 << 4);
      S.push(v3 | 1 << 4);
    }
    if (typeof window?.globalThis === "undefined") {
      v3 |= 1 << 3;
      S.push(1 << 3);
      S.push(v3 | 1 << 3);
    }
    if (typeof window?.name === "undefined") {
      v3 |= 1 << 2;
      S.push(1 << 2);
      S.push(v3 | 1 << 2);
    }
    if (typeof history?.replaceState !== "function") {
      v3 |= 1 << 1;
      S.push(1 << 1);
      S.push(v3 | 1 << 1);
    }
    v10 = new XMLHttpRequest();
    if (typeof new XMLHttpRequest() === "undefined") {
      v3 |= 1;
      S.push(1);
      S.push(v3 | 1);
    }
    if (typeof v10?.LOADING === "undefined") {
      v4 |= 1 << 14;
      S.push(1 << 14);
      S.push(v4 | 1 << 14);
    }
    if (typeof v10?.DONE === "undefined") {
      v4 |= 1 << 13;
      S.push(1 << 13);
      S.push(v4 | 1 << 13);
    }
    if (typeof v10?.OPENED === "undefined") {
      v4 |= 1 << 12;
      S.push(1 << 12);
      S.push(v4 | 1 << 12);
    }
    if (typeof v10?.UNSENT === "undefined") {
      v4 |= 1 << 11;
      S.push(1 << 11);
      S.push(v4 | 1 << 11);
    }
    if (typeof v10?.abort === "undefined") {
      v4 |= 1 << 10;
      S.push(1 << 10);
      S.push(v4 | 1 << 10);
    }
    if (typeof v10?.open === "undefined") {
      v4 |= 1 << 9;
      S.push(1 << 9);
      S.push(v4 | 1 << 9);
    }
    if (typeof v10?.send === "undefined") {
      v4 |= 1 << 8;
      S.push(1 << 8);
      S.push(v4 | 1 << 8);
    }
    if (typeof v10?.upload === "undefined") {
      v4 |= 1 << 7;
      S.push(1 << 7);
      S.push(v4 | 1 << 7);
    }
    if (typeof v10?.responseURL === "undefined") {
      v4 |= 1 << 6;
      S.push(1 << 6);
      S.push(v4 | 1 << 6);
    }
    if (typeof v10?.onreadystatechange === "undefined") {
      v4 |= 1 << 5;
      S.push(1 << 5);
      S.push(v4 | 1 << 5);
    }
    if (typeof v10?.status === "undefined") {
      v4 |= 1 << 4;
      S.push(1 << 4);
      S.push(v4 | 1 << 4);
    }
    if (typeof v10?.onabort === "undefined") {
      v4 |= 1 << 3;
      S.push(1 << 3);
      S.push(v4 | 1 << 3);
    }
    if (typeof v10?.onabort === "undefined") {
      v4 |= 1 << 2;
      S.push(1 << 2);
      S.push(v4 | 1 << 2);
    }
    if (typeof v10?.responseXML === "undefined") {
      v4 |= 1 << 1;
      S.push(1 << 1);
      S.push(v4 | 1 << 1);
    }
    if (typeof v10?.timeout === "undefined") {
      v4 |= 1;
      S.push(1);
      S.push(v4 | 1);
    }
    v3 = v3.toString(16);
    v4 = v4.toString(16);
    v11 = v3.toString(16) + v4.toString(16);
    v11 = /*argc=2 */FR_869(A, l, S);
    v2 = v2 + v11 + v1;
    __b.zh = v2 + v11 + v1;
    S.push(v3.toString(16));
    S.push(v4.toString(16));
    S.push(v3.toString(16) + v4.toString(16));
    S.push(v3.toString(16) + v4.toString(16));
    S.push("b53cc3fa93dc8013");
    S.push(ret);
    S.push(v2 + v11 + v1);
    S.push(v2 + v11 + v1);
  }
  H1 = {
    get: new Function("a", "b", "return b in a ? a[b]: undefined")
  };
  v6 = H1;
  v7 = new Function("a", "b", "return b in a ? a[b]: undefined");
  v12 = (H1?.["get"]).toString()?.length;
  v13 = BVM.toString();
  ret = (H1?.["get"]).toString()?.length > 60;
  if (!((H1?.["get"]).toString()?.length > 60)) {
    ret = typeof __b?.zh !== "undefined";
    if (!(typeof __b?.zh !== "undefined")) {
      ret = v13.indexOf("onsol") !== -1;
      if (!(v13.indexOf("onsol") !== -1)) {
        v14 = new Error()?.stack;
        ret = (new Error()?.stack).indexOf("node") !== -1;
        if (!((new Error()?.stack).indexOf("node") !== -1)) {
          ret = v14.indexOf("executeUserEntryPoint") !== -1;
          if (!(v14.indexOf("executeUserEntryPoint") !== -1)) {
            ret = (Function?.prototype?.constructor).toString().indexOf("native") === -1;
            if (!((Function?.prototype?.constructor).toString().indexOf("native") === -1)) {
              if (!(typeof window?.v_log !== "undefined")) {
                return 5;
              } else {
                return 3;
              }
            } else {
              return 3;
            }
          } else {
            return 3;
          }
        } else {
          return 3;
        }
      } else {
        return 3;
      }
    } else {
      return 3;
    }
  } else {
    return 3;
  }
  return ret;
}
/* 无入参：l[0] = 0；l[t>=1] = 调用者 l[t-1]（索引 +1 位移） */
function FR_735(A, l, S) {
  let ret;
  let F = false;
  let v6 = l[6],
    v7 = l[7],
    v12 = l[12],
    v13 = l[13],
    v14 = l[14];
  H3 = {
    get: new Function("a", "b", "return b in a ? a[b]: undefined")
  };
  v6 = H3;
  v7 = new Function("a", "b", "return b in a ? a[b]: undefined");
  v12 = (H3?.["get"]).toString()?.length;
  v13 = BVM.toString();
  ret = (H3?.["get"]).toString()?.length > 60;
  if (!((H3?.["get"]).toString()?.length > 60)) {
    ret = typeof __b?.zh !== "undefined";
    if (!(typeof __b?.zh !== "undefined")) {
      ret = v13.indexOf("onsol") !== -1;
      if (!(v13.indexOf("onsol") !== -1)) {
        v14 = new Error()?.stack;
        ret = (new Error()?.stack).indexOf("node") !== -1;
        if (!((new Error()?.stack).indexOf("node") !== -1)) {
          ret = v14.indexOf("executeUserEntryPoint") !== -1;
          if (!(v14.indexOf("executeUserEntryPoint") !== -1)) {
            ret = (Function?.prototype?.constructor).toString().indexOf("native") === -1;
            if (!((Function?.prototype?.constructor).toString().indexOf("native") === -1)) {
              if (!(typeof window?.v_log !== "undefined")) {
                return 5;
              } else {
                return 3;
              }
            } else {
              return 3;
            }
          } else {
            return 3;
          }
        } else {
          return 3;
        }
      } else {
        return 3;
      }
    } else {
      return 3;
    }
  } else {
    return 3;
  }
  return ret;
}
/* 入参 2 个：l[0..1] = 实参（S 尾部）；l[t>=2] = 调用者 l[t-1] */
function FR_869(A, l, S) {
  let ret;
  let F = false;
  let v0 = l[0],
    v1 = l[1],
    v17 = l[17],
    v18 = l[18],
    v19 = l[19],
    v20 = l[20],
    v21 = l[21],
    v22 = l[22],
    v23 = l[23],
    v24 = l[24],
    v25 = l[25],
    v26 = l[26];
  v17 = "";
  v18 = v0?.length;
  v19 = v1?.length;
  v20 = __b?.a3;
  v21 = 0;
  L886: for (;;) {
    t0 = v21;
    t1 = v18;
    t2 = v21 < v18;                 // 循环条件 i < n
    F = t2;
    if (!t2) break L886;
    t0 = v21;
    t1 = v0;
    t2 = v0.charCodeAt(v21);        // 输入字符
    v22 = t2;
    t3 = v21;
    t4 = v19;
    t5 = v21 % v19;                 // key 下标 i % klen
    v23 = __b;
    t6 = __b;
    t7 = v1;
    t8 = v1.charCodeAt(t5);         // key 字符
    v24 = t8;
    t9 = t2;
    t10 = t8;
    t11 = t9 ^ t10;
    t12 = v20;
    t13 = t11 ^ t12;                // out = in ^ key ^ state
    v25 = t13;
    t14 = t13;
    v20 = t13;                      // state = out
    t15 = t13;
    t16 = String;
    t17 = String.fromCharCode(t15);
    v26 = t17;
    t18 = v17;
    t19 = t17;
    t20 = v17 + t17;                // acc += out
    v17 = t18 + t17;
    t21 = v21;
    t22 = 1;
    t23 = v21 + 1;
    v21 = v21 + 1;
    S.push(t15);
    S.push(v17);
    continue L886;
  }
  __b.a3 = v20;
  return v17;
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
