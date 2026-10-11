// lifted from js/cvm.decompiled.js -- operand-stack folding + structured control flow
function M_GET(o, k) { return (o === undefined || o === null) ? undefined : o[k]; }
function M_SET(o, k, v) { if (o !== undefined && o !== null) o[k] = v; return v; }
function M_EVAL(name) { return eval(name); }
function RUN(l, D, A, pc) {
  A = A || [undefined, undefined, undefined, undefined];
  l = l || [];
  const S = []; let F = false;
  switch (pc) {
    case 0: return FR_0(A, l, S);
    case 877: return FR_877(A, l, S);
    default: throw new Error("bad pc " + pc);
  }
}
function FR_0(A, l, S) {   // frame entered at pc 0
  let F = false;
  let v0 = l[0], v1 = l[1], v2 = l[2], v3 = l[3], v4 = l[4], v5 = l[5], v6 = l[6], v7 = l[7], v8 = l[8], v9 = l[9], v10 = l[10], v11 = l[11];
  let v12 = l[12], v13 = l[13], v14 = l[14], v15 = l[15], v16 = l[16], v17 = l[17], v18 = l[18], v19 = l[19], v20 = l[20], v21 = l[21], v22 = l[22], v23 = l[23];
  let v24 = l[24], v25 = l[25];
  let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15;
  let t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31;
  let t32, t33, t34, t35, t36, t37, t38, t39, t40, t41, t42, t43, t44, t45, t46, t47;
  let t48;
  if (typeof TRACE === "function") TRACE(0, A, l, S, F);
  t0 = 7;
  v0 = t0;
  t1 = t0;
  t2 = 6;
  t3 = (t1 > t2);
  F = !!(t3);
  A[0] = t1;
  A[1] = t2;
  A[3] = t3;
  if (!(t3)) {
  } else {
    if (typeof TRACE === "function") TRACE(7, A, l, S, F);
    t0 = "window={};document={};";
    t1 = eval;
    t2 = Object;
    t3 = new t2();
    v1 = t3;
    t4 = "a";
    t5 = "b";
    t6 = "return b in a ? a[b]: undefined";
    t7 = Function;
    t8 = new t7(t4, t5, t6);
    v2 = t8;
    t9 = t8;
    t10 = "get";
    t11 = t3;
    M_SET(t11, t10, t9);
    t12 = "a";
    t13 = "b";
    t14 = "c";
    t15 = "a[b]=c;return true";
    t16 = Function;
    t17 = new t16(t12, t13, t14, t15);
    v3 = t17;
    t18 = t17;
    t19 = "set";
    t20 = t3;
    M_SET(t20, t19, t18);
    t21 = window;
    t22 = t3;
    t23 = Proxy;
    t24 = new t23(t21, t22);
    v4 = t24;
    t25 = t24;
    t26 = t25?.Function;
    v5 = t26;
    t27 = t24;
    t28 = t27?.document;
    v6 = t28;
    t29 = 1;
    t30 = 15;
    t31 = (t29 << t30);
    v7 = t31;
    t32 = 1;
    t33 = 14;
    t34 = (t32 << t33);
    v8 = t34;
    t35 = 1;
    t36 = 13;
    t37 = (t35 << t36);
    v9 = t37;
    t38 = 1;
    t39 = 12;
    t40 = (t38 << t39);
    v10 = t40;
    t41 = SRC0;
    t42 = t26;
    t43 = new t42(t41);
    v11 = t43;
    t44 = t43;
    t45 = t44();
    v12 = t45;
    t46 = t45;
    t47 = 1;
    t48 = (t46 > t47);
    F = !!(t48);
    S.push(t0);
    S.push(t9);
    S.push(t18);
    if (!(t48)) {
    } else {
      if (typeof TRACE === "function") TRACE(97, A, l, S, F);
      t0 = 1;
      t1 = 14;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(107, A, l, S, F);
    if (typeof TRACE === "function") TRACE(108, A, l, S, F);
    t0 = "a";
    t1 = "try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}";
    t2 = v5;
    t3 = new t2(t0, t1);
    v14 = t3;
    t4 = ":defined";
    t5 = t3;
    t6 = t5(t4);
    v15 = t6;
    t7 = t6;
    t8 = 2;
    t9 = (t7 !== t8);
    F = !!(t9);
    if (!(t9)) {
    } else {
      if (typeof TRACE === "function") TRACE(125, A, l, S, F);
      t0 = 1;
      t1 = 13;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(135, A, l, S, F);
    if (typeof TRACE === "function") TRACE(136, A, l, S, F);
    t0 = "div:not(:has(div))";
    t1 = v14;
    t2 = t1(t0);
    v15 = t2;
    t3 = t2;
    t4 = 2;
    t5 = (t3 !== t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(146, A, l, S, F);
      t0 = 1;
      t1 = 12;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(156, A, l, S, F);
    if (typeof TRACE === "function") TRACE(157, A, l, S, F);
    t0 = v6;
    t1 = t0?.body;
    v16 = t1;
    t2 = t1;
    t3 = v6;
    t4 = t3.createNodeIterator(t2);
    v17 = t4;
    t5 = t4;
    t6 = t5?.root;
    t7 = (typeof t6);
    t8 = "undefined";
    t9 = (t7 === t8);
    F = !!(t9);
    if (!(t9)) {
    } else {
      if (typeof TRACE === "function") TRACE(175, A, l, S, F);
      t0 = 1;
      t1 = 10;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(185, A, l, S, F);
    if (typeof TRACE === "function") TRACE(186, A, l, S, F);
    t0 = v17;
    t1 = t0?.filter;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(194, A, l, S, F);
      t0 = 1;
      t1 = 9;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(204, A, l, S, F);
    if (typeof TRACE === "function") TRACE(205, A, l, S, F);
    t0 = v17;
    t1 = t0?.detach;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(213, A, l, S, F);
      t0 = 1;
      t1 = 8;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(223, A, l, S, F);
    if (typeof TRACE === "function") TRACE(224, A, l, S, F);
    t0 = v17;
    t1 = t0?.whatToShow;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(232, A, l, S, F);
      t0 = 1;
      t1 = 7;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(242, A, l, S, F);
    if (typeof TRACE === "function") TRACE(243, A, l, S, F);
    t0 = v6;
    t1 = t0.createRange();
    v18 = t1;
    t2 = t1;
    t3 = t2?.cloneRange;
    t4 = (typeof t3);
    t5 = "undefined";
    t6 = (t4 === t5);
    F = !!(t6);
    if (!(t6)) {
    } else {
      if (typeof TRACE === "function") TRACE(255, A, l, S, F);
      t0 = 1;
      t1 = 6;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(265, A, l, S, F);
    if (typeof TRACE === "function") TRACE(266, A, l, S, F);
    t0 = v18;
    t1 = t0?.cloneContents;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(274, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(284, A, l, S, F);
    if (typeof TRACE === "function") TRACE(285, A, l, S, F);
    t0 = v18;
    t1 = t0?.collapse;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(293, A, l, S, F);
      t0 = 1;
      t1 = 4;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(303, A, l, S, F);
    if (typeof TRACE === "function") TRACE(304, A, l, S, F);
    t0 = v18;
    t1 = t0?.collapsed;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(312, A, l, S, F);
      t0 = 1;
      t1 = 3;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(322, A, l, S, F);
    if (typeof TRACE === "function") TRACE(323, A, l, S, F);
    t0 = v18;
    t1 = t0?.commonAncestorContainer;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(331, A, l, S, F);
      t0 = 1;
      t1 = 2;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(341, A, l, S, F);
    if (typeof TRACE === "function") TRACE(342, A, l, S, F);
    t0 = v18;
    t1 = t0?.compareBoundaryPoints;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(350, A, l, S, F);
      t0 = 1;
      t1 = 1;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v7;
      t4 = t2;
      t5 = (t3 | t4);
      v7 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(360, A, l, S, F);
    if (typeof TRACE === "function") TRACE(361, A, l, S, F);
    t0 = v18;
    t1 = t0?.comparePoint;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(369, A, l, S, F);
      t0 = 1;
      v13 = t0;
      t1 = v7;
      t2 = t0;
      t3 = (t1 | t2);
      v7 = t3;
      S.push(t0);
      S.push(t3);
    }
    if (typeof TRACE === "function") TRACE(377, A, l, S, F);
    if (typeof TRACE === "function") TRACE(378, A, l, S, F);
    t0 = v18;
    t1 = t0?.endOffset;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(386, A, l, S, F);
      t0 = 1;
      t1 = 15;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(396, A, l, S, F);
    if (typeof TRACE === "function") TRACE(397, A, l, S, F);
    t0 = v18;
    t1 = t0?.extractContents;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(405, A, l, S, F);
      t0 = 1;
      t1 = 13;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(415, A, l, S, F);
    if (typeof TRACE === "function") TRACE(416, A, l, S, F);
    t0 = v18;
    t1 = t0?.getBoundingClientRect;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(424, A, l, S, F);
      t0 = 1;
      t1 = 12;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(434, A, l, S, F);
    if (typeof TRACE === "function") TRACE(435, A, l, S, F);
    t0 = v18;
    t1 = t0?.getClientRects;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(443, A, l, S, F);
      t0 = 1;
      t1 = 11;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(453, A, l, S, F);
    if (typeof TRACE === "function") TRACE(454, A, l, S, F);
    t0 = v18;
    t1 = t0?.insertNode;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(462, A, l, S, F);
      t0 = 1;
      t1 = 11;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(472, A, l, S, F);
    if (typeof TRACE === "function") TRACE(473, A, l, S, F);
    t0 = v18;
    t1 = t0?.intersectsNode;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(481, A, l, S, F);
      t0 = 1;
      t1 = 10;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(491, A, l, S, F);
    if (typeof TRACE === "function") TRACE(492, A, l, S, F);
    t0 = v18;
    t1 = t0?.isPointInRange;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(500, A, l, S, F);
      t0 = 1;
      t1 = 9;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(510, A, l, S, F);
    if (typeof TRACE === "function") TRACE(511, A, l, S, F);
    t0 = v18;
    t1 = t0?.selectNode;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(519, A, l, S, F);
      t0 = 1;
      t1 = 8;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(529, A, l, S, F);
    if (typeof TRACE === "function") TRACE(530, A, l, S, F);
    t0 = v18;
    t1 = t0?.selectNodeContents;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(538, A, l, S, F);
      t0 = 1;
      t1 = 7;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(548, A, l, S, F);
    if (typeof TRACE === "function") TRACE(549, A, l, S, F);
    t0 = v18;
    t1 = t0?.setEnd;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(557, A, l, S, F);
      t0 = 1;
      t1 = 6;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(567, A, l, S, F);
    if (typeof TRACE === "function") TRACE(568, A, l, S, F);
    t0 = v18;
    t1 = t0?.setEndAfter;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(576, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(586, A, l, S, F);
    if (typeof TRACE === "function") TRACE(587, A, l, S, F);
    t0 = v18;
    t1 = t0?.setEndBefore;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(595, A, l, S, F);
      t0 = 1;
      t1 = 4;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(605, A, l, S, F);
    if (typeof TRACE === "function") TRACE(606, A, l, S, F);
    t0 = v18;
    t1 = t0?.setStart;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(614, A, l, S, F);
      t0 = 1;
      t1 = 3;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(624, A, l, S, F);
    if (typeof TRACE === "function") TRACE(625, A, l, S, F);
    t0 = v18;
    t1 = t0?.setStartAfter;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(633, A, l, S, F);
      t0 = 1;
      t1 = 2;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(643, A, l, S, F);
    if (typeof TRACE === "function") TRACE(644, A, l, S, F);
    t0 = v18;
    t1 = t0?.setStartBefore;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(652, A, l, S, F);
      t0 = 1;
      t1 = 1;
      t2 = (t0 << t1);
      v13 = t2;
      t3 = v8;
      t4 = t2;
      t5 = (t3 | t4);
      v8 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(662, A, l, S, F);
    if (typeof TRACE === "function") TRACE(663, A, l, S, F);
    t0 = v18;
    t1 = t0?.startContainer;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(671, A, l, S, F);
      t0 = 1;
      v13 = t0;
      t1 = v8;
      t2 = t0;
      t3 = (t1 | t2);
      v8 = t3;
      S.push(t0);
      S.push(t3);
    }
    if (typeof TRACE === "function") TRACE(679, A, l, S, F);
    if (typeof TRACE === "function") TRACE(680, A, l, S, F);
    t0 = "8206";
    t1 = String;
    t2 = t1.fromCharCode(t0);
    v19 = t2;
    t3 = 16;
    t4 = v7;
    t5 = t4.toString(t3);
    v7 = t5;
    t6 = 16;
    t7 = v8;
    t8 = t7.toString(t6);
    v8 = t8;
    t9 = t5;
    t10 = t8;
    t11 = (t9 + t10);
    v20 = t11;
    t12 = t11;
    t13 = "6a6cb1bb3970bae6";
    t14 = 877;
    A[3] = SUB(t14, 2, A, l, S);
    v20 = A[3];
    t15 = SRC1;
    t16 = v5;
    t17 = new t16(t15);
    v21 = t17;
    t18 = t17;
    t19 = t18();
    v22 = t19;
    t20 = t19;
    t21 = "44ae0b7a68bf0f7a";
    t22 = 877;
    A[3] = SUB(t22, 2, A, l, S);
    v22 = A[3];
    t23 = v20;
    t24 = t2;
    t25 = (t23 + t24);
    t26 = v22;
    t27 = (t25 + t26);
    t28 = __c;
    M_SET(t28, "qh", t27);
    S.push(t5);
    S.push(t8);
    S.push(t11);
    S.push(t12);
    S.push(t13);
    S.push(A[3]);
    S.push(t20);
    S.push(t21);
    S.push(A[3]);
    S.push(t27);
  }
  if (typeof TRACE === "function") TRACE(741, A, l, S, F);
  if (typeof TRACE === "function") TRACE(742, A, l, S, F);
  t0 = Object;
  t1 = new t0();
  v1 = t1;
  t2 = "a";
  t3 = "b";
  t4 = "return b in a ? a[b]: undefined";
  t5 = Function;
  t6 = new t5(t2, t3, t4);
  v2 = t6;
  t7 = t6;
  t8 = "get";
  t9 = t1;
  M_SET(t9, t8, t7);
  t10 = "get";
  t11 = t1;
  t12 = t11?.[t10];
  t13 = t12.toString();
  t14 = t13?.length;
  v23 = t14;
  t15 = BVM;
  t16 = t15.toString();
  v24 = t16;
  t17 = t14;
  t18 = 60;
  t19 = (t17 > t18);
  F = !!(t19);
  A[0] = t17;
  A[1] = t18;
  A[3] = t19;
  if (!(t19)) {
    if (typeof TRACE === "function") TRACE(785, A, l, S, F);
    if (typeof TRACE === "function") TRACE(786, A, l, S, F);
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
      if (typeof TRACE === "function") TRACE(797, A, l, S, F);
      if (typeof TRACE === "function") TRACE(798, A, l, S, F);
      t0 = "onsol";
      t1 = v24;
      t2 = t1.indexOf(t0);
      t3 = 1;
      t4 = (-t3);
      t5 = (t2 !== t4);
      F = !!(t5);
      A[0] = t4;
      A[3] = t5;
      if (!(t5)) {
        if (typeof TRACE === "function") TRACE(810, A, l, S, F);
        if (typeof TRACE === "function") TRACE(811, A, l, S, F);
        t0 = Error;
        t1 = new t0();
        t2 = t1?.stack;
        v25 = t2;
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
          if (typeof TRACE === "function") TRACE(829, A, l, S, F);
          if (typeof TRACE === "function") TRACE(830, A, l, S, F);
          t0 = "executeUserEntryPoint";
          t1 = v25;
          t2 = t1.indexOf(t0);
          t3 = 1;
          t4 = (-t3);
          t5 = (t2 !== t4);
          F = !!(t5);
          A[0] = t4;
          A[3] = t5;
          if (!(t5)) {
            if (typeof TRACE === "function") TRACE(842, A, l, S, F);
            if (typeof TRACE === "function") TRACE(843, A, l, S, F);
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
              if (typeof TRACE === "function") TRACE(862, A, l, S, F);
              if (typeof TRACE === "function") TRACE(863, A, l, S, F);
              t0 = window;
              t1 = t0?.v_log;
              t2 = (typeof t1);
              t3 = "undefined";
              t4 = (t2 !== t3);
              F = !!(t4);
              A[0] = t2;
              A[1] = t3;
              if (!(t4)) {
                if (typeof TRACE === "function") TRACE(874, A, l, S, F);
                if (typeof TRACE === "function") TRACE(875, A, l, S, F);
                t0 = 10;
                A[3] = t0;
                return { A: A, l: l };
              } else {
                if (typeof TRACE === "function") TRACE(872, A, l, S, F);
                t0 = 5;
                A[3] = t0;
                return { A: A, l: l };
              }
            } else {
              if (typeof TRACE === "function") TRACE(860, A, l, S, F);
              t0 = 5;
              A[3] = t0;
              return { A: A, l: l };
            }
          } else {
            if (typeof TRACE === "function") TRACE(840, A, l, S, F);
            t0 = 5;
            A[3] = t0;
            return { A: A, l: l };
          }
        } else {
          if (typeof TRACE === "function") TRACE(827, A, l, S, F);
          t0 = 5;
          A[3] = t0;
          return { A: A, l: l };
        }
      } else {
        if (typeof TRACE === "function") TRACE(808, A, l, S, F);
        t0 = 5;
        A[3] = t0;
        return { A: A, l: l };
      }
    } else {
      if (typeof TRACE === "function") TRACE(795, A, l, S, F);
      t0 = 5;
      A[3] = t0;
      return { A: A, l: l };
    }
  } else {
    if (typeof TRACE === "function") TRACE(783, A, l, S, F);
    t0 = 5;
    A[3] = t0;
    return { A: A, l: l };
  }
  return { A: A, l: l };
}
function FR_877(A, l, S) {   // frame entered at pc 877
  let F = false;
  let v0 = l[0], v1 = l[1], v28 = l[28], v29 = l[29], v30 = l[30], v31 = l[31], v32 = l[32], v33 = l[33], v34 = l[34], v35 = l[35], v36 = l[36], v37 = l[37];
  let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15;
  let t16, t17, t18, t19, t20, t21, t22, t23;
  if (typeof TRACE === "function") TRACE(877, A, l, S, F);
  t0 = "";
  v28 = t0;
  t1 = v0;
  t2 = t1?.length;
  v29 = t2;
  t3 = v1;
  t4 = t3?.length;
  v30 = t4;
  t5 = __b;
  t6 = t5?.a3;
  v31 = t6;
  t7 = 0;
  v32 = t7;
  A[0] = t7;
  L894: for (;;) {
    if (typeof TRACE === "function") TRACE(894, A, l, S, F);
    t0 = v32;
    t1 = v29;
    t2 = (t0 < t1);
    F = !!(t2);
    if (!(t2)) break L894;
    if (typeof TRACE === "function") TRACE(899, A, l, S, F);
    t0 = v32;
    t1 = v0;
    t2 = t1.charCodeAt(t0);
    v33 = t2;
    t3 = v32;
    t4 = v30;
    t5 = (t3 % t4);
    v34 = t5;
    t6 = t5;
    t7 = v1;
    t8 = t7.charCodeAt(t6);
    v35 = t8;
    t9 = t2;
    t10 = t8;
    t11 = (t9 ^ t10);
    t12 = v31;
    t13 = (t11 ^ t12);
    v36 = t13;
    t14 = t13;
    v31 = t14;
    t15 = t13;
    t16 = String;
    t17 = t16.fromCharCode(t15);
    v37 = t17;
    t18 = v28;
    t19 = t17;
    t20 = (t18 + t19);
    v28 = t20;
    t21 = v32;
    t22 = 1;
    t23 = (t21 + t22);
    v32 = t23;
    S.push(t14);
    S.push(t20);
    continue L894;
  }   // end loop L894
  if (typeof TRACE === "function") TRACE(941, A, l, S, F);
  t0 = v31;
  t1 = __b;
  M_SET(t1, "a3", t0);
  t2 = v28;
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

