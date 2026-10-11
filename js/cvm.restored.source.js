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
function FR_0(A, l, S) {
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
  if (typeof TRACE === "function") TRACE(0, A, l, S, F);
  v0 = 7;
  A[0] = 7;
  A[1] = 6;
  A[3] = (7 > 6);
  if (7 > 6) {
    if (typeof TRACE === "function") TRACE(7, A, l, S, F);
    H1 = {};
    v1 = H1;
    v2 = new Function("a", "b", "return b in a ? a[b]: undefined");
    H1.get = new Function("a", "b", "return b in a ? a[b]: undefined");
    v3 = new Function("a", "b", "c", "a[b]=c;return true");
    H1.set = new Function("a", "b", "c", "a[b]=c;return true");
    v4 = new Proxy(window, H1);
    v5 = new Proxy(window, H1)?.Function;
    v6 = new Proxy(window, H1)?.document;
    v7 = (1 << 15);
    v8 = (1 << 14);
    v9 = (1 << 13);
    v10 = (1 << 12);
    v11 = new (new Proxy(window, H1)?.Function)(SRC0);
    v12 = new (new Proxy(window, H1)?.Function)(SRC0)();
    S.push("window={};document={};");
    S.push(new Function("a", "b", "return b in a ? a[b]: undefined"));
    S.push(new Function("a", "b", "c", "a[b]=c;return true"));
    if (new (new Proxy(window, H1)?.Function)(SRC0)() > 1) {
      if (typeof TRACE === "function") TRACE(97, A, l, S, F);
      v7 |= (1 << 14);
      S.push((1 << 14));
      S.push((v7 | (1 << 14)));
    }
    if (typeof TRACE === "function") TRACE(107, A, l, S, F);
    if (typeof TRACE === "function") TRACE(108, A, l, S, F);
    v14 = new v5("a", "try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}");
    v15 = new v5("a", "try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}")(":defined");
    if (new v5("a", "try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}")(":defined") !== 2) {
      if (typeof TRACE === "function") TRACE(125, A, l, S, F);
      v7 |= (1 << 13);
      S.push((1 << 13));
      S.push((v7 | (1 << 13)));
    }
    if (typeof TRACE === "function") TRACE(135, A, l, S, F);
    if (typeof TRACE === "function") TRACE(136, A, l, S, F);
    v15 = v14("div:not(:has(div))");
    if (v14("div:not(:has(div))") !== 2) {
      if (typeof TRACE === "function") TRACE(146, A, l, S, F);
      v7 |= (1 << 12);
      S.push((1 << 12));
      S.push((v7 | (1 << 12)));
    }
    if (typeof TRACE === "function") TRACE(156, A, l, S, F);
    if (typeof TRACE === "function") TRACE(157, A, l, S, F);
    v16 = v6?.body;
    v17 = v6.createNodeIterator(v6?.body);
    if (typeof v6.createNodeIterator(v6?.body)?.root === "undefined") {
      if (typeof TRACE === "function") TRACE(175, A, l, S, F);
      v7 |= (1 << 10);
      S.push((1 << 10));
      S.push((v7 | (1 << 10)));
    }
    if (typeof TRACE === "function") TRACE(185, A, l, S, F);
    if (typeof TRACE === "function") TRACE(186, A, l, S, F);
    if (typeof v17?.filter === "undefined") {
      if (typeof TRACE === "function") TRACE(194, A, l, S, F);
      v7 |= (1 << 9);
      S.push((1 << 9));
      S.push((v7 | (1 << 9)));
    }
    if (typeof TRACE === "function") TRACE(204, A, l, S, F);
    if (typeof TRACE === "function") TRACE(205, A, l, S, F);
    if (typeof v17?.detach === "undefined") {
      if (typeof TRACE === "function") TRACE(213, A, l, S, F);
      v7 |= (1 << 8);
      S.push((1 << 8));
      S.push((v7 | (1 << 8)));
    }
    if (typeof TRACE === "function") TRACE(223, A, l, S, F);
    if (typeof TRACE === "function") TRACE(224, A, l, S, F);
    if (typeof v17?.whatToShow === "undefined") {
      if (typeof TRACE === "function") TRACE(232, A, l, S, F);
      v7 |= (1 << 7);
      S.push((1 << 7));
      S.push((v7 | (1 << 7)));
    }
    if (typeof TRACE === "function") TRACE(242, A, l, S, F);
    if (typeof TRACE === "function") TRACE(243, A, l, S, F);
    v18 = v6.createRange();
    if (typeof v6.createRange()?.cloneRange === "undefined") {
      if (typeof TRACE === "function") TRACE(255, A, l, S, F);
      v7 |= (1 << 6);
      S.push((1 << 6));
      S.push((v7 | (1 << 6)));
    }
    if (typeof TRACE === "function") TRACE(265, A, l, S, F);
    if (typeof TRACE === "function") TRACE(266, A, l, S, F);
    if (typeof v18?.cloneContents === "undefined") {
      if (typeof TRACE === "function") TRACE(274, A, l, S, F);
      v7 |= (1 << 5);
      S.push((1 << 5));
      S.push((v7 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(284, A, l, S, F);
    if (typeof TRACE === "function") TRACE(285, A, l, S, F);
    if (typeof v18?.collapse === "undefined") {
      if (typeof TRACE === "function") TRACE(293, A, l, S, F);
      v7 |= (1 << 4);
      S.push((1 << 4));
      S.push((v7 | (1 << 4)));
    }
    if (typeof TRACE === "function") TRACE(303, A, l, S, F);
    if (typeof TRACE === "function") TRACE(304, A, l, S, F);
    if (typeof v18?.collapsed === "undefined") {
      if (typeof TRACE === "function") TRACE(312, A, l, S, F);
      v7 |= (1 << 3);
      S.push((1 << 3));
      S.push((v7 | (1 << 3)));
    }
    if (typeof TRACE === "function") TRACE(322, A, l, S, F);
    if (typeof TRACE === "function") TRACE(323, A, l, S, F);
    if (typeof v18?.commonAncestorContainer === "undefined") {
      if (typeof TRACE === "function") TRACE(331, A, l, S, F);
      v7 |= (1 << 2);
      S.push((1 << 2));
      S.push((v7 | (1 << 2)));
    }
    if (typeof TRACE === "function") TRACE(341, A, l, S, F);
    if (typeof TRACE === "function") TRACE(342, A, l, S, F);
    if (typeof v18?.compareBoundaryPoints === "undefined") {
      if (typeof TRACE === "function") TRACE(350, A, l, S, F);
      v7 |= (1 << 1);
      S.push((1 << 1));
      S.push((v7 | (1 << 1)));
    }
    if (typeof TRACE === "function") TRACE(360, A, l, S, F);
    if (typeof TRACE === "function") TRACE(361, A, l, S, F);
    if (typeof v18?.comparePoint === "undefined") {
      if (typeof TRACE === "function") TRACE(369, A, l, S, F);
      v7 |= 1;
      S.push(1);
      S.push((v7 | 1));
    }
    if (typeof TRACE === "function") TRACE(377, A, l, S, F);
    if (typeof TRACE === "function") TRACE(378, A, l, S, F);
    if (typeof v18?.endOffset === "undefined") {
      if (typeof TRACE === "function") TRACE(386, A, l, S, F);
      v8 |= (1 << 15);
      S.push((1 << 15));
      S.push((v8 | (1 << 15)));
    }
    if (typeof TRACE === "function") TRACE(396, A, l, S, F);
    if (typeof TRACE === "function") TRACE(397, A, l, S, F);
    if (typeof v18?.extractContents === "undefined") {
      if (typeof TRACE === "function") TRACE(405, A, l, S, F);
      v8 |= (1 << 13);
      S.push((1 << 13));
      S.push((v8 | (1 << 13)));
    }
    if (typeof TRACE === "function") TRACE(415, A, l, S, F);
    if (typeof TRACE === "function") TRACE(416, A, l, S, F);
    if (typeof v18?.getBoundingClientRect === "undefined") {
      if (typeof TRACE === "function") TRACE(424, A, l, S, F);
      v8 |= (1 << 12);
      S.push((1 << 12));
      S.push((v8 | (1 << 12)));
    }
    if (typeof TRACE === "function") TRACE(434, A, l, S, F);
    if (typeof TRACE === "function") TRACE(435, A, l, S, F);
    if (typeof v18?.getClientRects === "undefined") {
      if (typeof TRACE === "function") TRACE(443, A, l, S, F);
      v8 |= (1 << 11);
      S.push((1 << 11));
      S.push((v8 | (1 << 11)));
    }
    if (typeof TRACE === "function") TRACE(453, A, l, S, F);
    if (typeof TRACE === "function") TRACE(454, A, l, S, F);
    if (typeof v18?.insertNode === "undefined") {
      if (typeof TRACE === "function") TRACE(462, A, l, S, F);
      v8 |= (1 << 11);
      S.push((1 << 11));
      S.push((v8 | (1 << 11)));
    }
    if (typeof TRACE === "function") TRACE(472, A, l, S, F);
    if (typeof TRACE === "function") TRACE(473, A, l, S, F);
    if (typeof v18?.intersectsNode === "undefined") {
      if (typeof TRACE === "function") TRACE(481, A, l, S, F);
      v8 |= (1 << 10);
      S.push((1 << 10));
      S.push((v8 | (1 << 10)));
    }
    if (typeof TRACE === "function") TRACE(491, A, l, S, F);
    if (typeof TRACE === "function") TRACE(492, A, l, S, F);
    if (typeof v18?.isPointInRange === "undefined") {
      if (typeof TRACE === "function") TRACE(500, A, l, S, F);
      v8 |= (1 << 9);
      S.push((1 << 9));
      S.push((v8 | (1 << 9)));
    }
    if (typeof TRACE === "function") TRACE(510, A, l, S, F);
    if (typeof TRACE === "function") TRACE(511, A, l, S, F);
    if (typeof v18?.selectNode === "undefined") {
      if (typeof TRACE === "function") TRACE(519, A, l, S, F);
      v8 |= (1 << 8);
      S.push((1 << 8));
      S.push((v8 | (1 << 8)));
    }
    if (typeof TRACE === "function") TRACE(529, A, l, S, F);
    if (typeof TRACE === "function") TRACE(530, A, l, S, F);
    if (typeof v18?.selectNodeContents === "undefined") {
      if (typeof TRACE === "function") TRACE(538, A, l, S, F);
      v8 |= (1 << 7);
      S.push((1 << 7));
      S.push((v8 | (1 << 7)));
    }
    if (typeof TRACE === "function") TRACE(548, A, l, S, F);
    if (typeof TRACE === "function") TRACE(549, A, l, S, F);
    if (typeof v18?.setEnd === "undefined") {
      if (typeof TRACE === "function") TRACE(557, A, l, S, F);
      v8 |= (1 << 6);
      S.push((1 << 6));
      S.push((v8 | (1 << 6)));
    }
    if (typeof TRACE === "function") TRACE(567, A, l, S, F);
    if (typeof TRACE === "function") TRACE(568, A, l, S, F);
    if (typeof v18?.setEndAfter === "undefined") {
      if (typeof TRACE === "function") TRACE(576, A, l, S, F);
      v8 |= (1 << 5);
      S.push((1 << 5));
      S.push((v8 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(586, A, l, S, F);
    if (typeof TRACE === "function") TRACE(587, A, l, S, F);
    if (typeof v18?.setEndBefore === "undefined") {
      if (typeof TRACE === "function") TRACE(595, A, l, S, F);
      v8 |= (1 << 4);
      S.push((1 << 4));
      S.push((v8 | (1 << 4)));
    }
    if (typeof TRACE === "function") TRACE(605, A, l, S, F);
    if (typeof TRACE === "function") TRACE(606, A, l, S, F);
    if (typeof v18?.setStart === "undefined") {
      if (typeof TRACE === "function") TRACE(614, A, l, S, F);
      v8 |= (1 << 3);
      S.push((1 << 3));
      S.push((v8 | (1 << 3)));
    }
    if (typeof TRACE === "function") TRACE(624, A, l, S, F);
    if (typeof TRACE === "function") TRACE(625, A, l, S, F);
    if (typeof v18?.setStartAfter === "undefined") {
      if (typeof TRACE === "function") TRACE(633, A, l, S, F);
      v8 |= (1 << 2);
      S.push((1 << 2));
      S.push((v8 | (1 << 2)));
    }
    if (typeof TRACE === "function") TRACE(643, A, l, S, F);
    if (typeof TRACE === "function") TRACE(644, A, l, S, F);
    if (typeof v18?.setStartBefore === "undefined") {
      if (typeof TRACE === "function") TRACE(652, A, l, S, F);
      v8 |= (1 << 1);
      S.push((1 << 1));
      S.push((v8 | (1 << 1)));
    }
    if (typeof TRACE === "function") TRACE(662, A, l, S, F);
    if (typeof TRACE === "function") TRACE(663, A, l, S, F);
    if (typeof v18?.startContainer === "undefined") {
      if (typeof TRACE === "function") TRACE(671, A, l, S, F);
      v8 |= 1;
      S.push(1);
      S.push((v8 | 1));
    }
    if (typeof TRACE === "function") TRACE(679, A, l, S, F);
    if (typeof TRACE === "function") TRACE(680, A, l, S, F);
    v19 = String.fromCharCode("8206");
    v7 = v7.toString(16);
    v8 = v8.toString(16);
    v20 = (v7.toString(16) + v8.toString(16));
    A[3] = /*argc=2 */FR_877(A, l, S);
    v20 = A[3];
    v21 = new v5(SRC1);
    v22 = new v5(SRC1)();
    A[3] = /*argc=2 */FR_877(A, l, S);
    v22 = A[3];
    M_SET(__c, "qh", ((v20 + String.fromCharCode("8206")) + v22));
    S.push(v7.toString(16));
    S.push(v8.toString(16));
    S.push((v7.toString(16) + v8.toString(16)));
    S.push((v7.toString(16) + v8.toString(16)));
    S.push("6a6cb1bb3970bae6");
    S.push(A[3]);
    S.push(new v5(SRC1)());
    S.push("44ae0b7a68bf0f7a");
    S.push(A[3]);
    S.push(((v20 + String.fromCharCode("8206")) + v22));
  }
  if (typeof TRACE === "function") TRACE(741, A, l, S, F);
  if (typeof TRACE === "function") TRACE(742, A, l, S, F);
  v1 = new Object();
  v2 = new Function("a", "b", "return b in a ? a[b]: undefined");
  M_SET(new Object(), "get", new Function("a", "b", "return b in a ? a[b]: undefined"));
  v23 = (new Object()?.["get"]).toString()?.length;
  v24 = BVM.toString();
  A[0] = (new Object()?.["get"]).toString()?.length;
  A[1] = 60;
  A[3] = ((new Object()?.["get"]).toString()?.length > 60);
  if (!((new Object()?.["get"]).toString()?.length > 60)) {
    if (typeof TRACE === "function") TRACE(785, A, l, S, F);
    if (typeof TRACE === "function") TRACE(786, A, l, S, F);
    A[0] = typeof __b?.zh;
    A[1] = "undefined";
    A[3] = (typeof __b?.zh !== "undefined");
    if (!(typeof __b?.zh !== "undefined")) {
      if (typeof TRACE === "function") TRACE(797, A, l, S, F);
      if (typeof TRACE === "function") TRACE(798, A, l, S, F);
      A[0] = -1;
      A[3] = (v24.indexOf("onsol") !== -1);
      if (!(v24.indexOf("onsol") !== -1)) {
        if (typeof TRACE === "function") TRACE(810, A, l, S, F);
        if (typeof TRACE === "function") TRACE(811, A, l, S, F);
        v25 = new Error()?.stack;
        A[0] = -1;
        A[3] = ((new Error()?.stack).indexOf("node") !== -1);
        if (!((new Error()?.stack).indexOf("node") !== -1)) {
          if (typeof TRACE === "function") TRACE(829, A, l, S, F);
          if (typeof TRACE === "function") TRACE(830, A, l, S, F);
          A[0] = -1;
          A[3] = (v25.indexOf("executeUserEntryPoint") !== -1);
          if (!(v25.indexOf("executeUserEntryPoint") !== -1)) {
            if (typeof TRACE === "function") TRACE(842, A, l, S, F);
            if (typeof TRACE === "function") TRACE(843, A, l, S, F);
            A[0] = -1;
            A[3] = ((Function?.prototype?.constructor).toString().indexOf("native") === -1);
            if (!((Function?.prototype?.constructor).toString().indexOf("native") === -1)) {
              if (typeof TRACE === "function") TRACE(862, A, l, S, F);
              if (typeof TRACE === "function") TRACE(863, A, l, S, F);
              A[0] = typeof window?.v_log;
              A[1] = "undefined";
              if (!(typeof window?.v_log !== "undefined")) {
                if (typeof TRACE === "function") TRACE(874, A, l, S, F);
                if (typeof TRACE === "function") TRACE(875, A, l, S, F);
                A[3] = 10;
                return {
                  A: A,
                  l: l
                };
              } else {
                if (typeof TRACE === "function") TRACE(872, A, l, S, F);
                A[3] = 5;
                return {
                  A: A,
                  l: l
                };
              }
            } else {
              if (typeof TRACE === "function") TRACE(860, A, l, S, F);
              A[3] = 5;
              return {
                A: A,
                l: l
              };
            }
          } else {
            if (typeof TRACE === "function") TRACE(840, A, l, S, F);
            A[3] = 5;
            return {
              A: A,
              l: l
            };
          }
        } else {
          if (typeof TRACE === "function") TRACE(827, A, l, S, F);
          A[3] = 5;
          return {
            A: A,
            l: l
          };
        }
      } else {
        if (typeof TRACE === "function") TRACE(808, A, l, S, F);
        A[3] = 5;
        return {
          A: A,
          l: l
        };
      }
    } else {
      if (typeof TRACE === "function") TRACE(795, A, l, S, F);
      A[3] = 5;
      return {
        A: A,
        l: l
      };
    }
  } else {
    if (typeof TRACE === "function") TRACE(783, A, l, S, F);
    A[3] = 5;
    return {
      A: A,
      l: l
    };
  }
  return {
    A: A,
    l: l
  };
}
function FR_877(A, l, S) {
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
  if (typeof TRACE === "function") TRACE(877, A, l, S, F);
  v28 = "";
  v29 = v0?.length;
  v30 = v1?.length;
  v31 = __b?.a3;
  v32 = 0;
  A[0] = 0;
  L894: for (;;) {
    if (typeof TRACE === "function") TRACE(894, A, l, S, F);
    t0 = v32;
    t1 = v29;
    t2 = "" < v0;
    F = !!v0?.length;
    if (!v0?.length) break L894;
    if (typeof TRACE === "function") TRACE(899, A, l, S, F);
    t0 = v32;
    t1 = v0;
    t2 = v0.charCodeAt("");
    v33 = v0?.length;
    t3 = v32;
    t4 = v30;
    t5 = v1 % v1?.length;
    v34 = __b;
    t6 = __b;
    t7 = v1;
    t8 = 0 .charCodeAt(__b?.a3);
    v35 = 0 .charCodeAt(__b?.a3);
    t9 = v0?.length;
    t10 = 0 .charCodeAt(__b?.a3);
    t11 = v0?.length ^ 0 .charCodeAt(__b?.a3);
    t12 = v31;
    t13 = (v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v31;
    v36 = ((t9 ^ 0 .charCodeAt(__b?.a3)) ^ t12);
    t14 = ((t9 ^ 0 .charCodeAt(__b?.a3)) ^ t12);
    v31 = ((t9 ^ 0 .charCodeAt(__b?.a3)) ^ t12);
    t15 = ((t9 ^ 0 .charCodeAt(__b?.a3)) ^ t12);
    t16 = String;
    t17 = String.fromCharCode(((t9 ^ 0 .charCodeAt(__b?.a3)) ^ t12));
    v37 = String.fromCharCode(((t9 ^ 0 .charCodeAt(__b?.a3)) ^ t12));
    t18 = v28;
    t19 = String.fromCharCode(((t9 ^ 0 .charCodeAt(__b?.a3)) ^ t12));
    t20 = v28 + String.fromCharCode(((t9 ^ 0 .charCodeAt(__b?.a3)) ^ t12));
    v28 = (v28 + String.fromCharCode(((t9 ^ 0 .charCodeAt(__b?.a3)) ^ t12)));
    t21 = v32;
    t22 = 1;
    t23 = v32 + 1;
    v32 = (v32 + 1);
    S.push(((t9 ^ 0 .charCodeAt(__b?.a3)) ^ t12));
    S.push((v28 + String.fromCharCode(((t9 ^ 0 .charCodeAt(__b?.a3)) ^ t12))));
    continue L894;
  }
  if (typeof TRACE === "function") TRACE(941, A, l, S, F);
  M_SET(__b, "a3", v31);
  A[0] = __b;
  A[3] = v28;
  return {
    A: A,
    l: l
  };
  return {
    A: A,
    l: l
  };
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