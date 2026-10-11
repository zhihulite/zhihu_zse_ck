// js/service.restored.js 的帧还原版（tools/ast_frames.js）
// A[3] = 返回值寄存器 ⇒ return / ret；A[0],A[1] 死代码删除 0 条；
// return 改写 2 处；ret = CALL; v = ret ⇒ v = CALL 折叠 0 处。
// js/service.restored.source.js 的美化版（tools/beautify_restored.js）
// 本文件由提升后的 SSA 形式还原：对象字面量重建 0 处、SUB->FR_ 0 处、
// M_SET->赋值 4 处、TRACE 剔除 36 处、M_EVAL->eval 0 处、实参折叠 0 处。
// lifted from js/service.decompiled.js -- operand-stack folding + structured control flow
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
    v25 = l[25],
    v26 = l[26],
    v27 = l[27],
    v28 = l[28],
    v29 = l[29],
    v30 = l[30],
    v31 = l[31],
    v32 = l[32],
    v33 = l[33],
    v34 = l[34],
    v35 = l[35];
  let v36 = l[36],
    v37 = l[37],
    v38 = l[38],
    v39 = l[39],
    v40 = l[40],
    v41 = l[41],
    v42 = l[42],
    v43 = l[43],
    v44 = l[44];
  __g.ck = "005_ep5of98xMl=Oi4eegTO4vxKJ0BykStAMzO3VygzjzFLM5YItGrDSNnhpu8K6Czafg=MyvsN7dvwKN/eKWiNAlzfpaASVT0de1eQp1=4rg6p4y6USlXibd4MlxIjhCvCS";
  v0 = 63;
  v1 = (__g?.z).toString();
  S.push("005_ep5of98xMl=Oi4eegTO4vxKJ0BykStAMzO3VygzjzFLM5YItGrDSNnhpu8K6Czafg=MyvsN7dvwKN/eKWiNAlzfpaASVT0de1eQp1=4rg6p4y6USlXibd4MlxIjhCvCS");
  if ((__g?.z).toString().indexOf("nsol") > -1) {
    v2 = v0 + 40;
  }
  if (F) {} else {
    v2 = 64;
    S.push(64);
  }
  v3 = document.querySelector("script[data-assets-tracker-config]");
  v4 = document.querySelector("script[data-assets-tracker-config]") + "";
  if ((document.querySelector("script[data-assets-tracker-config]") + "").indexOf("HTMLScriptElement") === -1) {
    v2 = v2 + 41;
  }
  if (v2 < 100) {
    __g.ck = "005_oxzUYE7BqgGnj/EFmpVDTmQS10HfG8eFlpO47veTXs16/sJiBr419Gh2VW9/wPa4orM9wZJCZeojD2YGziudi7CNCmOaQ/4QGq0JGp3UfBTYguCYn6jsedDhmem9wRZY";
    S.push("005_oxzUYE7BqgGnj/EFmpVDTmQS10HfG8eFlpO47veTXs16/sJiBr419Gh2VW9/wPa4orM9wZJCZeojD2YGziudi7CNCmOaQ/4QGq0JGp3UfBTYguCYn6jsedDhmem9wRZY");
  }
  window._encrypt = 1;
  __g.copyBytesToGo = window.eval(SRC0);
  v5 = v0?.[0]?.[0];
  v6 = v0?.[0]?.[1];
  v7 = v0?.[0]?.[2];
  v8 = window.BigInt(v0?.[0]?.[1]);
  v7 = v0?.[0]?.[2] + window.BigInt(v0?.[0]?.[1]);
  v9 = v0?.[1];
  v10 = v0?.[2];
  v11 = v0?.[0]?.[4];
  v12 = v0?.[0]?.[5];
  v13 = v0?.[3];
  v14 = v0?.[4];
  S.push(v0?.[0]?.[2] + window.BigInt(v0?.[0]?.[1]));
  if (v0?.[0]?.[1] === "1022") {
    v15 = v0?.[0]?.[3];
    v16 = v9(v7);
    v17 = v10(v11, v12);
    v18 = v9(v0?.[0]?.[3]);
  }
  if (v6 === "1024") {
    v19 = v0?.[5];
    v20 = new DataView(v13, v11, v12);
    v21 = (v0?.[5]).decode(new DataView(v13, v11, v12));
    v16 = v9(v7);
    v22 = Reflect.get(v9(v7), (v0?.[5]).decode(new DataView(v13, v11, v12)));
    v23 = new DataView(v13);
    v24 = v5 + 8;
  }
  if (v6 === "1026") {
    v16 = v9(v7);
    v25 = v10(v11, v12);
    v26 = v0?.[6];
    v27 = v0?.[0]?.[7];
    v28 = v0?.[0]?.[8];
    v29 = v0?.[0]?.[9];
    v30 = (v0?.[6])(v0?.[0]?.[7], v0?.[0]?.[8], v0?.[0]?.[9]);
    v31 = Reflect.get(v9(v7), v10(v11, v12));
    v32 = Reflect.apply(Reflect.get(v9(v7), v10(v11, v12)), v9(v7), (v0?.[6])(v0?.[0]?.[7], v0?.[0]?.[8], v0?.[0]?.[9]));
    v23 = new DataView(v13);
    v24 = v5 + 8;
  }
  if (v6 !== "1028") {
    S.push(A[0]);
    L425: for (;;) {
      t0 = v33;
      v36 = ret;
      t1 = v5;
      t2 = v36;
      t3 = v14;
      t4 = window("1028", v6 === "1028");
      t5 = v13;
      t6 = DataView;
      t7 = new 0(__g);
      v23 = 0;
      t8 = v5;
      t9 = 8;
      t10 = v0 + v0?.[0];
      v24 = v0?.[0]?.[0];
      t11 = v36;
      t12 = 1?.length;
      v37 = 0;
      t13 = v0?.[0]?.[0];
      t14 = 0;
      t15 = "true";
      t16 = 0;
      t17 = 2 .setInt32(v0, v0?.[0], v0?.[0]?.[1]);
      S.push("encode");
      if (!F) break L425;
    }
    if (!(v6 === "1030")) {
      S.push(A[0]);
      L479: for (;;) {
        t0 = 0;
        t1 = v0;
        t2 = "1030"?.[v6];
        v40 = v6 === "1030";
        t3 = 12;
        t4 = 0;
        t5 = v0;
        t6 = __g?.[window.eval(SRC0)];
        t7 = 0?.[window];
        v41 = 0;
        t8 = v7;
        t9 = v9;
        t10 = (v0?.[0])(v0);
        v42 = v0?.[0]?.[0];
        t11 = v39;
        t12 = v6 === "1030";
        t13 = 0;
        t14 = v38;
        t15 = (v0?.[0])(1, 0, v0);
        v43 = v0?.[0]?.[1];
        t16 = v0?.[0]?.[0];
        t17 = v0?.[0]?.[1];
        t18 = 0 .set(2);
        if (!F) break L479;
      }
    } else {
      v38 = v0?.[8];
      v39 = v0?.[0]?.[10];
    }
    L514: while (true) {
      t0 = "1032";
      L515: for (;;) {
        t0 = A[0] === A[1];
        F = !!v6;
        if (!v6) break L515;
        t0 = v11;
        t1 = v12;
        t2 = v10;
        t3 = (v6 === "1030")(v6, "1030");
        v44 = window;
        t4 = v5;
        t5 = window;
        t6 = v14;
        t7 = 0(window.eval(SRC0), __g);
        t8 = v13;
        t9 = DataView;
        t10 = new (v0?.[0])(v0);
        v23 = v0?.[0]?.[0];
        t11 = v5;
        t12 = 8;
        t13 = 1 + 0;
        v24 = v0;
        t14 = v0;
        t15 = 1;
        t16 = v0?.[0]?.[0];
        t17 = 2 .setUint8(v0?.[0], v0?.[0]?.[1]);
        if (F) {} else {
          t0 = v6;
          t1 = "1034";
          t2 = v6 === "1030";
          F = !!(v6 === "1030");
          if (!(v6 === "1030")) {
            S.push(A[0]);
            L599: for (;;) {
              t0 = undefined;
              t1 = v30;
              t2 = Reflect;
              v32 = ret;
              t3 = v5;
              t4 = v32;
              t5 = v14;
              t6 = __g(window, window.eval(SRC0));
              t7 = v13;
              t8 = DataView;
              t9 = new v0(0);
              v23 = v0?.[0];
              t10 = v5;
              t11 = 8;
              t12 = v0?.[0]?.[0] + 1;
              v24 = 0;
              t13 = 0;
              t14 = 1;
              t15 = v0?.[0];
              t16 = (v0?.[0]?.[1]).setUint8(v0, v0?.[0]);
              S.push(v6);
              S.push("1030");
              S.push("apply");
              if (!F) break L599;
            }
          } else {
            t0 = v7;
            t1 = v9;
            t2 = "1030"(v6);
            v16 = v6 === "1030";
            t3 = 6;
            t4 = v0;
            t5 = window.eval(SRC0)?.[window];
            v26 = __g;
            t6 = 7;
            t7 = 0;
            t8 = v0;
            t9 = v0?.[0];
            t10 = v0?.[0]?.[0];
            v27 = v0?.[0]?.[0];
            t11 = 8;
            t12 = 0;
            t13 = v0;
            t14 = v0?.[0];
            t15 = v0?.[0]?.[1];
            v28 = v0?.[0]?.[1];
            t16 = 9;
            t17 = 0;
            t18 = v0;
            t19 = v0?.[0];
            t20 = v0?.[0]?.[2];
            v29 = v0?.[0]?.[2];
            t21 = v0?.[0]?.[0];
            t22 = v0?.[0]?.[1];
            t23 = v0?.[0]?.[2];
            t24 = __g;
            t25 = (v0?.[0]?.[2])(v0?.[0]?.[1], window, window.BigInt(v0?.[0]?.[1]));
            v30 = window.BigInt(v0?.[0]?.[1]);
            t26 = v6 === "1030";
          }
        }
      }
    }
  }
  v33 = v0?.[7];
  v34 = v9(v7);
  v35 = v9(v7);
  v36 = (v0?.[7]).encode(v9(v7));
  v23 = new DataView(v13);
  v24 = v5 + 8;
  S.push(v9(v7));
  if (F) {}
  return ret;
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
