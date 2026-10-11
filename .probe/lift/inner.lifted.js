// lifted from js/inner.decompiled.js -- operand-stack folding + structured control flow
function M_GET(o, k) { return (o === undefined || o === null) ? undefined : o[k]; }
function M_SET(o, k, v) { if (o !== undefined && o !== null) o[k] = v; return v; }
function M_EVAL(name) { return eval(name); }
function RUN(l, D, A, pc) {
  A = A || [undefined, undefined, undefined, undefined];
  l = l || [];
  const S = []; let F = false;
  switch (pc) {
    case 0: return FR_0(A, l, S);
    case 735: return FR_735(A, l, S);
    case 869: return FR_869(A, l, S);
    default: throw new Error("bad pc " + pc);
  }
}
function FR_0(A, l, S) {   // frame entered at pc 0
  let F = false;
  let v0 = l[0], v1 = l[1], v2 = l[2], v3 = l[3], v4 = l[4], v5 = l[5], v6 = l[6], v7 = l[7], v8 = l[8], v9 = l[9], v10 = l[10], v11 = l[11];
  let v12 = l[12], v13 = l[13], v14 = l[14];
  let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15;
  let t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31;
  let t32, t33, t34, t35, t36, t37, t38, t39, t40, t41, t42, t43, t44, t45;
  if (typeof TRACE === "function") TRACE(0, A, l, S, F);
  t0 = 735;
  t1 = SUB(t0, 0, A, l, S);
  v0 = t1;
  t2 = t1;
  t3 = 4;
  t4 = (t2 > t3);
  F = !!(t4);
  A[0] = t2;
  A[1] = t3;
  A[3] = t4;
  if (!(t4)) {
  } else {
    if (typeof TRACE === "function") TRACE(8, A, l, S, F);
    t0 = 41;
    t1 = __b;
    M_SET(t1, "a3", t0);
    t2 = SRC0;
    t3 = window;
    t4 = t3.eval(t2);
    t5 = "8204";
    t6 = String;
    t7 = t6.fromCharCode(t5);
    v1 = t7;
    t8 = __b;
    t9 = t8?.zh;
    v2 = t9;
    t10 = 1;
    t11 = 15;
    t12 = (t10 << t11);
    v3 = t12;
    t13 = 1;
    t14 = 15;
    t15 = (t13 << t14);
    v4 = t15;
    v5 = t15;
    t16 = Object;
    t17 = new t16();
    v6 = t17;
    t18 = "a";
    t19 = "b";
    t20 = "return b in a ? a[b]: undefined";
    t21 = Function;
    t22 = new t21(t18, t19, t20);
    v7 = t22;
    t23 = t22;
    t24 = "get";
    t25 = t17;
    M_SET(t25, t24, t23);
    t26 = "a";
    t27 = "b";
    t28 = "c";
    t29 = "a[b]=c;return true";
    t30 = Function;
    t31 = new t30(t26, t27, t28, t29);
    v8 = t31;
    t32 = t31;
    t33 = "set";
    t34 = t17;
    M_SET(t34, t33, t32);
    t35 = location;
    t36 = t17;
    t37 = Proxy;
    t38 = new t37(t35, t36);
    v9 = t38;
    t39 = "zhihu";
    t40 = location;
    t41 = t40.toString();
    t42 = t41.indexOf(t39);
    t43 = 1;
    t44 = (-t43);
    t45 = (t42 === t44);
    F = !!(t45);
    S.push(t0);
    S.push(t23);
    S.push(t32);
    if (!(t45)) {
    } else {
      if (typeof TRACE === "function") TRACE(104, A, l, S, F);
      t0 = 1;
      t1 = 14;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(114, A, l, S, F);
    if (typeof TRACE === "function") TRACE(115, A, l, S, F);
    t0 = "native";
    t1 = v9;
    t2 = t1?.toString;
    t3 = t2.toString();
    t4 = t3.indexOf(t0);
    t5 = 1;
    t6 = (-t5);
    t7 = (t4 === t6);
    F = !!(t7);
    if (!(t7)) {
    } else {
      if (typeof TRACE === "function") TRACE(129, A, l, S, F);
      t0 = 1;
      t1 = 13;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(139, A, l, S, F);
    if (typeof TRACE === "function") TRACE(140, A, l, S, F);
    t0 = v9;
    t1 = t0?.host;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(148, A, l, S, F);
      t0 = 1;
      t1 = 12;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(158, A, l, S, F);
    if (typeof TRACE === "function") TRACE(159, A, l, S, F);
    t0 = v9;
    t1 = t0?.hostname;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(167, A, l, S, F);
      t0 = 1;
      t1 = 11;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(177, A, l, S, F);
    if (typeof TRACE === "function") TRACE(178, A, l, S, F);
    t0 = window;
    t1 = t0?.devicePixelRatio;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(187, A, l, S, F);
      t0 = 1;
      t1 = 10;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(197, A, l, S, F);
    if (typeof TRACE === "function") TRACE(198, A, l, S, F);
    t0 = window;
    t1 = t0?.blur;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(207, A, l, S, F);
      t0 = 1;
      t1 = 9;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(217, A, l, S, F);
    if (typeof TRACE === "function") TRACE(218, A, l, S, F);
    t0 = "native";
    t1 = window;
    t2 = t1?.blur;
    t3 = t2.toString();
    t4 = t3.indexOf(t0);
    t5 = 1;
    t6 = (-t5);
    t7 = (t4 === t6);
    F = !!(t7);
    if (!(t7)) {
    } else {
      if (typeof TRACE === "function") TRACE(233, A, l, S, F);
      t0 = 1;
      t1 = 8;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(243, A, l, S, F);
    if (typeof TRACE === "function") TRACE(244, A, l, S, F);
    t0 = window;
    t1 = t0?.self;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(253, A, l, S, F);
      t0 = 1;
      t1 = 7;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(263, A, l, S, F);
    if (typeof TRACE === "function") TRACE(264, A, l, S, F);
    t0 = history;
    t1 = t0?.pushState;
    t2 = (typeof t1);
    t3 = "function";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(273, A, l, S, F);
      t0 = 1;
      t1 = 6;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(283, A, l, S, F);
    if (typeof TRACE === "function") TRACE(284, A, l, S, F);
    t0 = "native";
    t1 = window;
    t2 = t1?.XMLDocument;
    t3 = t2.toString();
    t4 = t3.indexOf(t0);
    t5 = 1;
    t6 = (-t5);
    t7 = (t4 === t6);
    F = !!(t7);
    if (!(t7)) {
    } else {
      if (typeof TRACE === "function") TRACE(299, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(309, A, l, S, F);
    if (typeof TRACE === "function") TRACE(310, A, l, S, F);
    t0 = window;
    t1 = t0?.find;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(319, A, l, S, F);
      t0 = 1;
      t1 = 4;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(329, A, l, S, F);
    if (typeof TRACE === "function") TRACE(330, A, l, S, F);
    t0 = window;
    t1 = t0?.globalThis;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(339, A, l, S, F);
      t0 = 1;
      t1 = 3;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(349, A, l, S, F);
    if (typeof TRACE === "function") TRACE(350, A, l, S, F);
    t0 = window;
    t1 = t0?.name;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(359, A, l, S, F);
      t0 = 1;
      t1 = 2;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(369, A, l, S, F);
    if (typeof TRACE === "function") TRACE(370, A, l, S, F);
    t0 = history;
    t1 = t0?.replaceState;
    t2 = (typeof t1);
    t3 = "function";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(379, A, l, S, F);
      t0 = 1;
      t1 = 1;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(389, A, l, S, F);
    if (typeof TRACE === "function") TRACE(390, A, l, S, F);
    t0 = XMLHttpRequest;
    t1 = new t0();
    v10 = t1;
    t2 = t1;
    t3 = (typeof t2);
    t4 = "undefined";
    t5 = (t3 === t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(400, A, l, S, F);
      t0 = 1;
      v5 = t0;
      t1 = v3;
      t2 = t0;
      t3 = (t1 | t2);
      v3 = t3;
      S.push(t0);
      S.push(t3);
    }
    if (typeof TRACE === "function") TRACE(408, A, l, S, F);
    if (typeof TRACE === "function") TRACE(409, A, l, S, F);
    t0 = v10;
    t1 = t0?.LOADING;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(417, A, l, S, F);
      t0 = 1;
      t1 = 14;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(427, A, l, S, F);
    if (typeof TRACE === "function") TRACE(428, A, l, S, F);
    t0 = v10;
    t1 = t0?.DONE;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(436, A, l, S, F);
      t0 = 1;
      t1 = 13;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(446, A, l, S, F);
    if (typeof TRACE === "function") TRACE(447, A, l, S, F);
    t0 = v10;
    t1 = t0?.OPENED;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(455, A, l, S, F);
      t0 = 1;
      t1 = 12;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(465, A, l, S, F);
    if (typeof TRACE === "function") TRACE(466, A, l, S, F);
    t0 = v10;
    t1 = t0?.UNSENT;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(474, A, l, S, F);
      t0 = 1;
      t1 = 11;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(484, A, l, S, F);
    if (typeof TRACE === "function") TRACE(485, A, l, S, F);
    t0 = v10;
    t1 = t0?.abort;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(493, A, l, S, F);
      t0 = 1;
      t1 = 10;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(503, A, l, S, F);
    if (typeof TRACE === "function") TRACE(504, A, l, S, F);
    t0 = v10;
    t1 = t0?.open;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(512, A, l, S, F);
      t0 = 1;
      t1 = 9;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(522, A, l, S, F);
    if (typeof TRACE === "function") TRACE(523, A, l, S, F);
    t0 = v10;
    t1 = t0?.send;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(531, A, l, S, F);
      t0 = 1;
      t1 = 8;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(541, A, l, S, F);
    if (typeof TRACE === "function") TRACE(542, A, l, S, F);
    t0 = v10;
    t1 = t0?.upload;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(550, A, l, S, F);
      t0 = 1;
      t1 = 7;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(560, A, l, S, F);
    if (typeof TRACE === "function") TRACE(561, A, l, S, F);
    t0 = v10;
    t1 = t0?.responseURL;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(569, A, l, S, F);
      t0 = 1;
      t1 = 6;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(579, A, l, S, F);
    if (typeof TRACE === "function") TRACE(580, A, l, S, F);
    t0 = v10;
    t1 = t0?.onreadystatechange;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(588, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(598, A, l, S, F);
    if (typeof TRACE === "function") TRACE(599, A, l, S, F);
    t0 = v10;
    t1 = t0?.status;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(607, A, l, S, F);
      t0 = 1;
      t1 = 4;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(617, A, l, S, F);
    if (typeof TRACE === "function") TRACE(618, A, l, S, F);
    t0 = v10;
    t1 = t0?.onabort;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(626, A, l, S, F);
      t0 = 1;
      t1 = 3;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(636, A, l, S, F);
    if (typeof TRACE === "function") TRACE(637, A, l, S, F);
    t0 = v10;
    t1 = t0?.onabort;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(645, A, l, S, F);
      t0 = 1;
      t1 = 2;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(655, A, l, S, F);
    if (typeof TRACE === "function") TRACE(656, A, l, S, F);
    t0 = v10;
    t1 = t0?.responseXML;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(664, A, l, S, F);
      t0 = 1;
      t1 = 1;
      t2 = (t0 << t1);
      v5 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(674, A, l, S, F);
    if (typeof TRACE === "function") TRACE(675, A, l, S, F);
    t0 = v10;
    t1 = t0?.timeout;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(683, A, l, S, F);
      t0 = 1;
      v5 = t0;
      t1 = v4;
      t2 = t0;
      t3 = (t1 | t2);
      v4 = t3;
      S.push(t0);
      S.push(t3);
    }
    if (typeof TRACE === "function") TRACE(691, A, l, S, F);
    if (typeof TRACE === "function") TRACE(692, A, l, S, F);
    t0 = 16;
    t1 = v3;
    t2 = t1.toString(t0);
    v3 = t2;
    t3 = 16;
    t4 = v4;
    t5 = t4.toString(t3);
    v4 = t5;
    t6 = t2;
    t7 = t5;
    t8 = (t6 + t7);
    v11 = t8;
    t9 = t8;
    t10 = "b53cc3fa93dc8013";
    t11 = 869;
    A[3] = SUB(t11, 2, A, l, S);
    v11 = A[3];
    t12 = v2;
    t13 = v11;
    t14 = (t12 + t13);
    t15 = v1;
    t16 = (t14 + t15);
    v2 = t16;
    t17 = t16;
    t18 = __b;
    M_SET(t18, "zh", t17);
    S.push(t2);
    S.push(t5);
    S.push(t8);
    S.push(t9);
    S.push(t10);
    S.push(A[3]);
    S.push(t16);
    S.push(t17);
  }
  if (typeof TRACE === "function") TRACE(733, A, l, S, F);
  if (typeof TRACE === "function") TRACE(734, A, l, S, F);
  if (typeof TRACE === "function") TRACE(735, A, l, S, F);
  t0 = Object;
  t1 = new t0();
  v6 = t1;
  t2 = "a";
  t3 = "b";
  t4 = "return b in a ? a[b]: undefined";
  t5 = Function;
  t6 = new t5(t2, t3, t4);
  v7 = t6;
  t7 = t6;
  t8 = "get";
  t9 = t1;
  M_SET(t9, t8, t7);
  t10 = "get";
  t11 = t1;
  t12 = t11?.[t10];
  t13 = t12.toString();
  t14 = t13?.length;
  v12 = t14;
  t15 = BVM;
  t16 = t15.toString();
  v13 = t16;
  t17 = t14;
  t18 = 60;
  t19 = (t17 > t18);
  F = !!(t19);
  A[0] = t17;
  A[1] = t18;
  A[3] = t19;
  if (!(t19)) {
    if (typeof TRACE === "function") TRACE(777, A, l, S, F);
    if (typeof TRACE === "function") TRACE(778, A, l, S, F);
    t0 = __b;
    t1 = t0?.zh;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    A[0] = t2;
    A[1] = t3;
    A[3] = t4;
    if (!(t4)) {
      if (typeof TRACE === "function") TRACE(789, A, l, S, F);
      if (typeof TRACE === "function") TRACE(790, A, l, S, F);
      t0 = "onsol";
      t1 = v13;
      t2 = t1.indexOf(t0);
      t3 = 1;
      t4 = (-t3);
      t5 = (t2 !== t4);
      F = !!(t5);
      A[0] = t4;
      A[3] = t5;
      if (!(t5)) {
        if (typeof TRACE === "function") TRACE(802, A, l, S, F);
        if (typeof TRACE === "function") TRACE(803, A, l, S, F);
        t0 = Error;
        t1 = new t0();
        t2 = t1?.stack;
        v14 = t2;
        t3 = "node";
        t4 = t2;
        t5 = t4.indexOf(t3);
        t6 = 1;
        t7 = (-t6);
        t8 = (t5 !== t7);
        F = !!(t8);
        A[0] = t7;
        A[3] = t8;
        if (!(t8)) {
          if (typeof TRACE === "function") TRACE(821, A, l, S, F);
          if (typeof TRACE === "function") TRACE(822, A, l, S, F);
          t0 = "executeUserEntryPoint";
          t1 = v14;
          t2 = t1.indexOf(t0);
          t3 = 1;
          t4 = (-t3);
          t5 = (t2 !== t4);
          F = !!(t5);
          A[0] = t4;
          A[3] = t5;
          if (!(t5)) {
            if (typeof TRACE === "function") TRACE(834, A, l, S, F);
            if (typeof TRACE === "function") TRACE(835, A, l, S, F);
            t0 = "native";
            t1 = Function;
            t2 = t1?.prototype;
            t3 = t2?.constructor;
            t4 = t3.toString();
            t5 = t4.indexOf(t0);
            t6 = 1;
            t7 = (-t6);
            t8 = (t5 === t7);
            F = !!(t8);
            A[0] = t7;
            A[3] = t8;
            if (!(t8)) {
              if (typeof TRACE === "function") TRACE(854, A, l, S, F);
              if (typeof TRACE === "function") TRACE(855, A, l, S, F);
              t0 = window;
              t1 = t0?.v_log;
              t2 = (typeof t1);
              t3 = "undefined";
              t4 = (t2 !== t3);
              F = !!(t4);
              A[0] = t2;
              A[1] = t3;
              if (!(t4)) {
                if (typeof TRACE === "function") TRACE(866, A, l, S, F);
                if (typeof TRACE === "function") TRACE(867, A, l, S, F);
                t0 = 5;
                A[3] = t0;
                return { A: A, l: l };
              } else {
                if (typeof TRACE === "function") TRACE(864, A, l, S, F);
                t0 = 3;
                A[3] = t0;
                return { A: A, l: l };
              }
            } else {
              if (typeof TRACE === "function") TRACE(852, A, l, S, F);
              t0 = 3;
              A[3] = t0;
              return { A: A, l: l };
            }
          } else {
            if (typeof TRACE === "function") TRACE(832, A, l, S, F);
            t0 = 3;
            A[3] = t0;
            return { A: A, l: l };
          }
        } else {
          if (typeof TRACE === "function") TRACE(819, A, l, S, F);
          t0 = 3;
          A[3] = t0;
          return { A: A, l: l };
        }
      } else {
        if (typeof TRACE === "function") TRACE(800, A, l, S, F);
        t0 = 3;
        A[3] = t0;
        return { A: A, l: l };
      }
    } else {
      if (typeof TRACE === "function") TRACE(787, A, l, S, F);
      t0 = 3;
      A[3] = t0;
      return { A: A, l: l };
    }
  } else {
    if (typeof TRACE === "function") TRACE(775, A, l, S, F);
    t0 = 3;
    A[3] = t0;
    return { A: A, l: l };
  }
  return { A: A, l: l };
}
function FR_735(A, l, S) {   // frame entered at pc 735
  let F = false;
  let v6 = l[6], v7 = l[7], v12 = l[12], v13 = l[13], v14 = l[14];
  let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15;
  let t16, t17, t18, t19;
  if (typeof TRACE === "function") TRACE(735, A, l, S, F);
  t0 = Object;
  t1 = new t0();
  v6 = t1;
  t2 = "a";
  t3 = "b";
  t4 = "return b in a ? a[b]: undefined";
  t5 = Function;
  t6 = new t5(t2, t3, t4);
  v7 = t6;
  t7 = t6;
  t8 = "get";
  t9 = t1;
  M_SET(t9, t8, t7);
  t10 = "get";
  t11 = t1;
  t12 = t11?.[t10];
  t13 = t12.toString();
  t14 = t13?.length;
  v12 = t14;
  t15 = BVM;
  t16 = t15.toString();
  v13 = t16;
  t17 = t14;
  t18 = 60;
  t19 = (t17 > t18);
  F = !!(t19);
  A[0] = t17;
  A[1] = t18;
  A[3] = t19;
  if (!(t19)) {
    if (typeof TRACE === "function") TRACE(777, A, l, S, F);
    if (typeof TRACE === "function") TRACE(778, A, l, S, F);
    t0 = __b;
    t1 = t0?.zh;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    A[0] = t2;
    A[1] = t3;
    A[3] = t4;
    if (!(t4)) {
      if (typeof TRACE === "function") TRACE(789, A, l, S, F);
      if (typeof TRACE === "function") TRACE(790, A, l, S, F);
      t0 = "onsol";
      t1 = v13;
      t2 = t1.indexOf(t0);
      t3 = 1;
      t4 = (-t3);
      t5 = (t2 !== t4);
      F = !!(t5);
      A[0] = t4;
      A[3] = t5;
      if (!(t5)) {
        if (typeof TRACE === "function") TRACE(802, A, l, S, F);
        if (typeof TRACE === "function") TRACE(803, A, l, S, F);
        t0 = Error;
        t1 = new t0();
        t2 = t1?.stack;
        v14 = t2;
        t3 = "node";
        t4 = t2;
        t5 = t4.indexOf(t3);
        t6 = 1;
        t7 = (-t6);
        t8 = (t5 !== t7);
        F = !!(t8);
        A[0] = t7;
        A[3] = t8;
        if (!(t8)) {
          if (typeof TRACE === "function") TRACE(821, A, l, S, F);
          if (typeof TRACE === "function") TRACE(822, A, l, S, F);
          t0 = "executeUserEntryPoint";
          t1 = v14;
          t2 = t1.indexOf(t0);
          t3 = 1;
          t4 = (-t3);
          t5 = (t2 !== t4);
          F = !!(t5);
          A[0] = t4;
          A[3] = t5;
          if (!(t5)) {
            if (typeof TRACE === "function") TRACE(834, A, l, S, F);
            if (typeof TRACE === "function") TRACE(835, A, l, S, F);
            t0 = "native";
            t1 = Function;
            t2 = t1?.prototype;
            t3 = t2?.constructor;
            t4 = t3.toString();
            t5 = t4.indexOf(t0);
            t6 = 1;
            t7 = (-t6);
            t8 = (t5 === t7);
            F = !!(t8);
            A[0] = t7;
            A[3] = t8;
            if (!(t8)) {
              if (typeof TRACE === "function") TRACE(854, A, l, S, F);
              if (typeof TRACE === "function") TRACE(855, A, l, S, F);
              t0 = window;
              t1 = t0?.v_log;
              t2 = (typeof t1);
              t3 = "undefined";
              t4 = (t2 !== t3);
              F = !!(t4);
              A[0] = t2;
              A[1] = t3;
              if (!(t4)) {
                if (typeof TRACE === "function") TRACE(866, A, l, S, F);
                if (typeof TRACE === "function") TRACE(867, A, l, S, F);
                t0 = 5;
                A[3] = t0;
                return { A: A, l: l };
              } else {
                if (typeof TRACE === "function") TRACE(864, A, l, S, F);
                t0 = 3;
                A[3] = t0;
                return { A: A, l: l };
              }
            } else {
              if (typeof TRACE === "function") TRACE(852, A, l, S, F);
              t0 = 3;
              A[3] = t0;
              return { A: A, l: l };
            }
          } else {
            if (typeof TRACE === "function") TRACE(832, A, l, S, F);
            t0 = 3;
            A[3] = t0;
            return { A: A, l: l };
          }
        } else {
          if (typeof TRACE === "function") TRACE(819, A, l, S, F);
          t0 = 3;
          A[3] = t0;
          return { A: A, l: l };
        }
      } else {
        if (typeof TRACE === "function") TRACE(800, A, l, S, F);
        t0 = 3;
        A[3] = t0;
        return { A: A, l: l };
      }
    } else {
      if (typeof TRACE === "function") TRACE(787, A, l, S, F);
      t0 = 3;
      A[3] = t0;
      return { A: A, l: l };
    }
  } else {
    if (typeof TRACE === "function") TRACE(775, A, l, S, F);
    t0 = 3;
    A[3] = t0;
    return { A: A, l: l };
  }
  return { A: A, l: l };
}
function FR_869(A, l, S) {   // frame entered at pc 869
  let F = false;
  let v0 = l[0], v1 = l[1], v17 = l[17], v18 = l[18], v19 = l[19], v20 = l[20], v21 = l[21], v22 = l[22], v23 = l[23], v24 = l[24], v25 = l[25], v26 = l[26];
  let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15;
  let t16, t17, t18, t19, t20, t21, t22, t23;
  if (typeof TRACE === "function") TRACE(869, A, l, S, F);
  t0 = "";
  v17 = t0;
  t1 = v0;
  t2 = t1?.length;
  v18 = t2;
  t3 = v1;
  t4 = t3?.length;
  v19 = t4;
  t5 = __b;
  t6 = t5?.a3;
  v20 = t6;
  t7 = 0;
  v21 = t7;
  A[0] = t7;
  L886: for (;;) {
    if (typeof TRACE === "function") TRACE(886, A, l, S, F);
    t0 = v21;
    t1 = v18;
    t2 = (t0 < t1);
    F = !!(t2);
    if (!(t2)) break L886;
    if (typeof TRACE === "function") TRACE(891, A, l, S, F);
    t0 = v21;
    t1 = v0;
    t2 = t1.charCodeAt(t0);
    v22 = t2;
    t3 = v21;
    t4 = v19;
    t5 = (t3 % t4);
    v23 = t5;
    t6 = t5;
    t7 = v1;
    t8 = t7.charCodeAt(t6);
    v24 = t8;
    t9 = t2;
    t10 = t8;
    t11 = (t9 ^ t10);
    t12 = v20;
    t13 = (t11 ^ t12);
    v25 = t13;
    t14 = t13;
    v20 = t14;
    t15 = t13;
    t16 = String;
    t17 = t16.fromCharCode(t15);
    v26 = t17;
    t18 = v17;
    t19 = t17;
    t20 = (t18 + t19);
    v17 = t20;
    t21 = v21;
    t22 = 1;
    t23 = (t21 + t22);
    v21 = t23;
    S.push(t14);
    S.push(t20);
    continue L886;
  }   // end loop L886
  if (typeof TRACE === "function") TRACE(933, A, l, S, F);
  t0 = v20;
  t1 = __b;
  M_SET(t1, "a3", t0);
  t2 = v17;
  A[0] = t1;
  A[3] = t2;
  return { A: A, l: l };
  return { A: A, l: l };
}
function SUB(entry, argc, A, l, S) {
  const args = argc ? S.splice(-argc) : [];
  const cl = [0].concat(l);
  for (let t = 0; t < args.length; t++) cl[t] = args[t];
  const r = RUN(cl, null, undefined, entry);
  const v = r && r.A ? r.A[3] : undefined;
  return typeof v === "number" ? String(v) : v;
}
function SUBCALL(A, l, S, i, argc) { return SUB(A[i], argc, A, l, S); }
if (typeof module !== "undefined") { module.exports = { RUN: RUN, M_GET: M_GET, M_SET: M_SET, M_EVAL: M_EVAL, SUB: SUB }; }

