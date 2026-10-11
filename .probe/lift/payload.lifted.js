// lifted from js/payload.cvm.js -- operand-stack folding + structured control flow
function M_GET(o, k) { return (o === undefined || o === null) ? undefined : o[k]; }
function M_SET(o, k, v) { if (o !== undefined && o !== null) o[k] = v; return v; }
function M_EVAL(name) { return eval(name); }
function RUN(l, D, A, pc) {
  A = A || [undefined, undefined, undefined, undefined];
  l = l || [];
  const S = []; let F = false;
  switch (pc) {
    case 0: return FR_0(A, l, S);
    case 1832: return FR_1832(A, l, S);
    case 1905: return FR_1905(A, l, S);
    case 2039: return FR_2039(A, l, S);
    case 2079: return FR_2079(A, l, S);
    case 2146: return FR_2146(A, l, S);
    case 2227: return FR_2227(A, l, S);
    case 2289: return FR_2289(A, l, S);
    default: throw new Error("bad pc " + pc);
  }
}
function FR_0(A, l, S) {   // frame entered at pc 0
  let F = false;
  let v0 = l[0], v1 = l[1], v2 = l[2], v3 = l[3], v4 = l[4], v5 = l[5], v6 = l[6], v7 = l[7], v8 = l[8], v9 = l[9], v10 = l[10], v11 = l[11];
  let v12 = l[12], v13 = l[13], v14 = l[14], v15 = l[15], v16 = l[16], v17 = l[17], v18 = l[18], v19 = l[19], v20 = l[20], v21 = l[21], v22 = l[22], v23 = l[23];
  let v24 = l[24], v25 = l[25], v26 = l[26], v27 = l[27], v28 = l[28], v29 = l[29], v30 = l[30], v31 = l[31], v32 = l[32], v33 = l[33], v34 = l[34], v35 = l[35];
  let v36 = l[36], v37 = l[37], v38 = l[38], v39 = l[39], v40 = l[40], v41 = l[41], v42 = l[42], v43 = l[43], v44 = l[44], v45 = l[45], v46 = l[46], v47 = l[47];
  let v48 = l[48], v49 = l[49], v50 = l[50], v51 = l[51], v52 = l[52], v53 = l[53], v54 = l[54], v55 = l[55], v56 = l[56], v57 = l[57], v58 = l[58], v59 = l[59];
  let v60 = l[60], v62 = l[62], v63 = l[63], v64 = l[64], v65 = l[65], v66 = l[66], v67 = l[67], v68 = l[68], v69 = l[69], v70 = l[70], v71 = l[71];
  let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15;
  let t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31;
  let t32, t33, t34, t35, t36, t37, t38, t39, t40, t41, t42, t43, t44, t45, t46, t47;
  let t48, t49;
  if (typeof TRACE === "function") TRACE(0, A, l, S, F);
  t0 = "8204";
  t1 = String;
  t2 = t1.fromCharCode(t0);
  v0 = t2;
  t3 = 1905;
  t4 = SUB(t3, 0, A, l, S);
  v1 = t4;
  t5 = t4;
  t6 = 2;
  t7 = (t5 < t6);
  F = !!(t7);
  A[0] = t5;
  A[1] = t6;
  A[3] = t7;
  if (!(t7)) {
  } else {
    if (typeof TRACE === "function") TRACE(15, A, l, S, F);
    v2 = A[3];
    t0 = 1;
    t1 = 13;
    t2 = (t0 << t1);
    v3 = t2;
    t3 = 1;
    t4 = 12;
    t5 = (t3 << t4);
    v4 = t5;
    t6 = 1;
    t7 = 15;
    t8 = (t6 << t7);
    v5 = t8;
    t9 = 1;
    t10 = 14;
    t11 = (t9 << t10);
    v6 = t11;
    t12 = "8204";
    t13 = String;
    t14 = t13.fromCharCode(t12);
    v7 = t14;
    t15 = Object;
    t16 = new t15();
    v8 = t16;
    t17 = "a";
    t18 = "b";
    t19 = "return b in a ? a[b]: undefined";
    t20 = Function;
    t21 = new t20(t17, t18, t19);
    v9 = t21;
    t22 = t21;
    t23 = "get";
    t24 = t16;
    M_SET(t24, t23, t22);
    t25 = "a";
    t26 = "b";
    t27 = "c";
    t28 = "a[b]=c;return true";
    t29 = Function;
    t30 = new t29(t25, t26, t27, t28);
    v10 = t30;
    t31 = t30;
    t32 = "set";
    t33 = t16;
    M_SET(t33, t32, t31);
    t34 = window;
    t35 = t16;
    t36 = Proxy;
    t37 = new t36(t34, t35);
    v11 = t37;
    t38 = t37;
    t39 = Object;
    t40 = t39.keys(t38);
    v12 = t40;
    t41 = t40;
    t42 = 40;
    t43 = (t41 < t42);
    F = !!(t43);
    S.push(t22);
    S.push(t31);
    if (!(t43)) {
    } else {
      if (typeof TRACE === "function") TRACE(100, A, l, S, F);
      t0 = 1;
      t1 = 15;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(110, A, l, S, F);
    if (typeof TRACE === "function") TRACE(111, A, l, S, F);
    t0 = v12;
    t1 = 2079;
    A[3] = SUB(t1, 1, A, l, S);
    v13 = A[3];
    t2 = v13;
    t3 = 1;
    t4 = (t2 === t3);
    F = !!(t4);
    S.push(t0);
    S.push(A[3]);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(122, A, l, S, F);
      t0 = 1;
      t1 = 14;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(132, A, l, S, F);
    if (typeof TRACE === "function") TRACE(133, A, l, S, F);
    t0 = "top";
    t1 = v12;
    t2 = t1.indexOf(t0);
    t3 = 1;
    t4 = (-t3);
    t5 = (t2 === t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(143, A, l, S, F);
      t0 = 1;
      t1 = 12;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(153, A, l, S, F);
    if (typeof TRACE === "function") TRACE(154, A, l, S, F);
    t0 = "customElements";
    t1 = v12;
    t2 = t1.indexOf(t0);
    t3 = 1;
    t4 = (-t3);
    t5 = (t2 === t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(164, A, l, S, F);
      t0 = 1;
      t1 = 11;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(174, A, l, S, F);
    if (typeof TRACE === "function") TRACE(175, A, l, S, F);
    t0 = "name";
    t1 = v12;
    t2 = t1.indexOf(t0);
    t3 = 1;
    t4 = (-t3);
    t5 = (t2 === t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(185, A, l, S, F);
      t0 = 1;
      t1 = 10;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(195, A, l, S, F);
    if (typeof TRACE === "function") TRACE(196, A, l, S, F);
    t0 = "self";
    t1 = v12;
    t2 = t1.indexOf(t0);
    t3 = 1;
    t4 = (-t3);
    t5 = (t2 === t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(206, A, l, S, F);
      t0 = 1;
      t1 = 9;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(216, A, l, S, F);
    if (typeof TRACE === "function") TRACE(217, A, l, S, F);
    t0 = "print";
    t1 = v12;
    t2 = t1.indexOf(t0);
    t3 = 1;
    t4 = (-t3);
    t5 = (t2 === t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(227, A, l, S, F);
      t0 = 1;
      t1 = 8;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(237, A, l, S, F);
    if (typeof TRACE === "function") TRACE(238, A, l, S, F);
    t0 = "open";
    t1 = v12;
    t2 = t1.indexOf(t0);
    t3 = 1;
    t4 = (-t3);
    t5 = (t2 === t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(248, A, l, S, F);
      t0 = 1;
      t1 = 7;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(258, A, l, S, F);
    if (typeof TRACE === "function") TRACE(259, A, l, S, F);
    t0 = "_encrypt";
    t1 = v12;
    t2 = t1.indexOf(t0);
    t3 = 1;
    t4 = (-t3);
    t5 = (t2 === t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(269, A, l, S, F);
      t0 = 1;
      t1 = 6;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(279, A, l, S, F);
    if (typeof TRACE === "function") TRACE(280, A, l, S, F);
    t0 = "__g";
    t1 = v12;
    t2 = t1.indexOf(t0);
    t3 = 1;
    t4 = (-t3);
    t5 = (t2 === t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(290, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(300, A, l, S, F);
    if (typeof TRACE === "function") TRACE(301, A, l, S, F);
    t0 = Function;
    t1 = v8;
    t2 = Proxy;
    t3 = new t2(t0, t1);
    v14 = t3;
    t4 = "window={};document={};return document";
    t5 = t3;
    t6 = new t5(t4);
    v15 = t6;
    t7 = t6;
    t8 = t7();
    v16 = t8;
    t9 = t8;
    t10 = t9?.URL;
    v17 = t10;
    t11 = "zhihu";
    t12 = t10;
    t13 = t12.indexOf(t11);
    t14 = 1;
    t15 = (-t14);
    t16 = (t13 === t15);
    F = !!(t16);
    S.push(t6);
    if (!(t16)) {
    } else {
      if (typeof TRACE === "function") TRACE(333, A, l, S, F);
      t0 = 1;
      t1 = 4;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(343, A, l, S, F);
    if (typeof TRACE === "function") TRACE(344, A, l, S, F);
    t0 = v16;
    t1 = t0?.all;
    v18 = t1;
    t2 = t1;
    t3 = (typeof t2);
    v19 = t3;
    t4 = t3;
    t5 = "undefined";
    t6 = (t4 !== t5);
    F = !!(t6);
    if (!(t6)) {
    } else {
      if (typeof TRACE === "function") TRACE(356, A, l, S, F);
      t0 = 1;
      t1 = 3;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(366, A, l, S, F);
    if (typeof TRACE === "function") TRACE(367, A, l, S, F);
    t0 = v18;
    t1 = t0?.length;
    v20 = t1;
    t2 = t1;
    t3 = (typeof t2);
    t4 = "number";
    t5 = (t3 !== t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(377, A, l, S, F);
      t0 = 1;
      t1 = 2;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(387, A, l, S, F);
    if (typeof TRACE === "function") TRACE(388, A, l, S, F);
    t0 = Function;
    t1 = v8;
    t2 = Proxy;
    t3 = new t2(t0, t1);
    v14 = t3;
    t4 = "try{window={};document={};return document.all()}catch(_){}";
    t5 = t3;
    t6 = new t5(t4);
    v21 = t6;
    t7 = t6;
    t8 = t7();
    v22 = t8;
    t9 = t8;
    t10 = (typeof t9);
    t11 = "object";
    t12 = (t10 !== t11);
    F = !!(t12);
    if (!(t12)) {
    } else {
      if (typeof TRACE === "function") TRACE(411, A, l, S, F);
      t0 = 1;
      t1 = 1;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v3;
      t4 = t2;
      t5 = (t3 | t4);
      v3 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(421, A, l, S, F);
    if (typeof TRACE === "function") TRACE(422, A, l, S, F);
    t0 = v20;
    t1 = 4;
    t2 = (t0 < t1);
    F = !!(t2);
    if (!(t2)) {
    } else {
      if (typeof TRACE === "function") TRACE(427, A, l, S, F);
      t0 = 1;
      v2 = t0;
      t1 = v3;
      t2 = t0;
      t3 = (t1 | t2);
      v3 = t3;
      S.push(t0);
      S.push(t3);
    }
    if (typeof TRACE === "function") TRACE(435, A, l, S, F);
    if (typeof TRACE === "function") TRACE(436, A, l, S, F);
    t0 = 0;
    t1 = v18;
    t2 = t1?.[t0];
    v23 = t2;
    t3 = t2;
    t4 = t3?.tagName;
    t5 = "HTML";
    t6 = (t4 !== t5);
    F = !!(t6);
    if (!(t6)) {
    } else {
      if (typeof TRACE === "function") TRACE(448, A, l, S, F);
      t0 = 1;
      t1 = 15;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(458, A, l, S, F);
    if (typeof TRACE === "function") TRACE(459, A, l, S, F);
    t0 = "HTMLHtmlElement";
    t1 = v23;
    t2 = t1.toString();
    t3 = t2.indexOf(t0);
    t4 = 1;
    t5 = (-t4);
    t6 = (t3 === t5);
    F = !!(t6);
    if (!(t6)) {
    } else {
      if (typeof TRACE === "function") TRACE(471, A, l, S, F);
      t0 = 1;
      t1 = 14;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(481, A, l, S, F);
    if (typeof TRACE === "function") TRACE(482, A, l, S, F);
    t0 = "script";
    t1 = v23;
    t2 = t1.getElementsByTagName(t0);
    v24 = t2;
    t3 = "Collection";
    t4 = t2;
    t5 = t4.toString();
    t6 = t5.indexOf(t3);
    t7 = 1;
    t8 = (-t7);
    t9 = (t6 === t8);
    F = !!(t9);
    if (!(t9)) {
    } else {
      if (typeof TRACE === "function") TRACE(500, A, l, S, F);
      t0 = 1;
      t1 = 13;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(510, A, l, S, F);
    if (typeof TRACE === "function") TRACE(511, A, l, S, F);
    t0 = v16;
    t1 = v16;
    t2 = t1?.createElement;
    t3 = t2.bind(t0);
    v25 = t3;
    t4 = "script";
    t5 = t3;
    t6 = t5(t4);
    v26 = t6;
    t7 = t6;
    t8 = (typeof t7);
    t9 = "undefined";
    t10 = (t8 === t9);
    F = !!(t10);
    if (!(t10)) {
    } else {
      if (typeof TRACE === "function") TRACE(530, A, l, S, F);
      t0 = 1;
      t1 = 11;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(540, A, l, S, F);
    if (typeof TRACE === "function") TRACE(541, A, l, S, F);
    t0 = v26;
    t1 = t0?.tagName;
    t2 = "SCRIPT";
    t3 = (t1 !== t2);
    F = !!(t3);
    if (!(t3)) {
    } else {
      if (typeof TRACE === "function") TRACE(548, A, l, S, F);
      t0 = 1;
      t1 = 10;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(558, A, l, S, F);
    if (typeof TRACE === "function") TRACE(559, A, l, S, F);
    t0 = v26;
    t1 = t0?.style;
    v27 = t1;
    t2 = t1;
    t3 = (typeof t2);
    t4 = "undefined";
    t5 = (t3 === t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(569, A, l, S, F);
      t0 = 1;
      t1 = 9;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(579, A, l, S, F);
    if (typeof TRACE === "function") TRACE(580, A, l, S, F);
    t0 = SRC0;
    t1 = v14;
    t2 = new t1(t0);
    v28 = t2;
    t3 = t2;
    t4 = t3();
    v28 = t4;
    t5 = t4;
    t6 = 0;
    t7 = (t5 !== t6);
    F = !!(t7);
    S.push(t4);
    if (!(t7)) {
    } else {
      if (typeof TRACE === "function") TRACE(594, A, l, S, F);
      t0 = 1;
      t1 = 8;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(604, A, l, S, F);
    if (typeof TRACE === "function") TRACE(605, A, l, S, F);
    t0 = SRC1;
    t1 = v14;
    t2 = new t1(t0);
    v29 = t2;
    t3 = t2;
    t4 = t3();
    v29 = t4;
    t5 = t4;
    t6 = "A";
    t7 = (t5 !== t6);
    F = !!(t7);
    S.push(t4);
    if (!(t7)) {
    } else {
      if (typeof TRACE === "function") TRACE(619, A, l, S, F);
      t0 = 1;
      t1 = 7;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(629, A, l, S, F);
    if (typeof TRACE === "function") TRACE(630, A, l, S, F);
    t0 = document;
    t1 = t0?.baseURI;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(639, A, l, S, F);
      t0 = 1;
      t1 = 6;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(649, A, l, S, F);
    if (typeof TRACE === "function") TRACE(650, A, l, S, F);
    t0 = "zhihu";
    t1 = document;
    t2 = t1?.baseURI;
    t3 = t2.indexOf(t0);
    t4 = 1;
    t5 = (-t4);
    t6 = (t3 === t5);
    F = !!(t6);
    if (!(t6)) {
    } else {
      if (typeof TRACE === "function") TRACE(663, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(673, A, l, S, F);
    if (typeof TRACE === "function") TRACE(674, A, l, S, F);
    t0 = document;
    t1 = t0?.charset;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(683, A, l, S, F);
      t0 = 1;
      t1 = 4;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(693, A, l, S, F);
    if (typeof TRACE === "function") TRACE(694, A, l, S, F);
    t0 = document;
    t1 = t0?.body;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(703, A, l, S, F);
      t0 = 1;
      t1 = 3;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(713, A, l, S, F);
    if (typeof TRACE === "function") TRACE(714, A, l, S, F);
    t0 = "HTMLBodyElement";
    t1 = document;
    t2 = t1?.body;
    t3 = t2.toString();
    t4 = t3.indexOf(t0);
    t5 = 1;
    t6 = (-t5);
    t7 = (t4 === t6);
    F = !!(t7);
    if (!(t7)) {
    } else {
      if (typeof TRACE === "function") TRACE(729, A, l, S, F);
      t0 = 1;
      t1 = 2;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(739, A, l, S, F);
    if (typeof TRACE === "function") TRACE(740, A, l, S, F);
    t0 = "canvas";
    t1 = v25;
    t2 = t1(t0);
    v30 = t2;
    t3 = t2;
    t4 = (typeof t3);
    t5 = "undefined";
    t6 = (t4 === t5);
    F = !!(t6);
    if (!(t6)) {
    } else {
      if (typeof TRACE === "function") TRACE(751, A, l, S, F);
      t0 = 1;
      t1 = 1;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v4;
      t4 = t2;
      t5 = (t3 | t4);
      v4 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(761, A, l, S, F);
    if (typeof TRACE === "function") TRACE(762, A, l, S, F);
    t0 = "HTMLCanvasElement";
    t1 = v30;
    t2 = t1.toString();
    t3 = t2.indexOf(t0);
    t4 = 1;
    t5 = (-t4);
    t6 = (t3 === t5);
    F = !!(t6);
    if (!(t6)) {
    } else {
      if (typeof TRACE === "function") TRACE(774, A, l, S, F);
      t0 = 1;
      v2 = t0;
      t1 = v4;
      t2 = t0;
      t3 = (t1 | t2);
      v4 = t3;
      S.push(t0);
      S.push(t3);
    }
    if (typeof TRACE === "function") TRACE(782, A, l, S, F);
    if (typeof TRACE === "function") TRACE(783, A, l, S, F);
    t0 = v30;
    t1 = t0?.getContext;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(791, A, l, S, F);
      t0 = 1;
      t1 = 14;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(801, A, l, S, F);
    if (typeof TRACE === "function") TRACE(802, A, l, S, F);
    t0 = "CanvasRenderingContext2D";
    t1 = "2d";
    t2 = v30;
    t3 = t2.getContext(t1);
    t4 = t3.toString();
    t5 = t4.indexOf(t0);
    t6 = 1;
    t7 = (-t6);
    t8 = (t5 === t7);
    F = !!(t8);
    if (!(t8)) {
    } else {
      if (typeof TRACE === "function") TRACE(818, A, l, S, F);
      t0 = 1;
      t1 = 13;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(828, A, l, S, F);
    if (typeof TRACE === "function") TRACE(829, A, l, S, F);
    t0 = v30;
    t1 = t0?.width;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(837, A, l, S, F);
      t0 = 1;
      t1 = 12;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(847, A, l, S, F);
    if (typeof TRACE === "function") TRACE(848, A, l, S, F);
    t0 = v30;
    t1 = t0?.height;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(856, A, l, S, F);
      t0 = 1;
      t1 = 11;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(866, A, l, S, F);
    if (typeof TRACE === "function") TRACE(867, A, l, S, F);
    t0 = v30;
    t1 = t0?.tagName;
    t2 = "CANVAS";
    t3 = (t1 !== t2);
    F = !!(t3);
    if (!(t3)) {
    } else {
      if (typeof TRACE === "function") TRACE(874, A, l, S, F);
      t0 = 1;
      t1 = 10;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(884, A, l, S, F);
    if (typeof TRACE === "function") TRACE(885, A, l, S, F);
    t0 = "canvas";
    t1 = v30;
    t2 = t1?.outerHTML;
    t3 = t2.indexOf(t0);
    t4 = 1;
    t5 = (-t4);
    t6 = (t3 === t5);
    F = !!(t6);
    if (!(t6)) {
    } else {
      if (typeof TRACE === "function") TRACE(897, A, l, S, F);
      t0 = 1;
      t1 = 9;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(907, A, l, S, F);
    if (typeof TRACE === "function") TRACE(908, A, l, S, F);
    t0 = v30;
    t1 = t0.toDataURL();
    v31 = t1;
    t2 = t1;
    t3 = t2?.length;
    t4 = 50;
    t5 = (t3 < t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(919, A, l, S, F);
      t0 = 1;
      t1 = 8;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(929, A, l, S, F);
    if (typeof TRACE === "function") TRACE(930, A, l, S, F);
    t0 = window;
    t1 = t0?.buffer;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(939, A, l, S, F);
      t0 = 1;
      t1 = 7;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(949, A, l, S, F);
    if (typeof TRACE === "function") TRACE(950, A, l, S, F);
    t0 = window;
    t1 = t0?.emit;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(959, A, l, S, F);
      t0 = 1;
      t1 = 6;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(969, A, l, S, F);
    if (typeof TRACE === "function") TRACE(970, A, l, S, F);
    t0 = window;
    t1 = t0?.callPhantom;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(979, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(989, A, l, S, F);
    if (typeof TRACE === "function") TRACE(990, A, l, S, F);
    t0 = window;
    t1 = t0?.__phantomas;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(999, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1009, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1010, A, l, S, F);
    t0 = window;
    t1 = t0?._phantom;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1019, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1029, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1030, A, l, S, F);
    t0 = window;
    t1 = t0?.WebPage;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1039, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1049, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1050, A, l, S, F);
    t0 = window;
    t1 = t0?.fxdriver_id;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1059, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1069, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1070, A, l, S, F);
    t0 = window;
    t1 = t0?.__fxdriver_unwrapped;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1079, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1089, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1090, A, l, S, F);
    t0 = window;
    t1 = t0?.ubot;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1099, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1109, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1110, A, l, S, F);
    t0 = window;
    t1 = t0?.CasperError;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1119, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1129, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1130, A, l, S, F);
    t0 = window;
    t1 = t0?.casper;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1139, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1149, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1150, A, l, S, F);
    t0 = window;
    t1 = t0?.patchRequire;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1159, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1169, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1170, A, l, S, F);
    t0 = document;
    t1 = t0?.$cdc_asdjflasutopfhvcZLmcfl_;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1179, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1189, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1190, A, l, S, F);
    t0 = navigator;
    t1 = t0?.webdriver;
    t2 = "true";
    t3 = (t1 === t2);
    F = !!(t3);
    if (!(t3)) {
    } else {
      if (typeof TRACE === "function") TRACE(1198, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1208, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1209, A, l, S, F);
    t0 = document;
    t1 = t0?.__webdriver_script_fn;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1218, A, l, S, F);
      t0 = 1;
      t1 = 5;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1228, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1229, A, l, S, F);
    t0 = v11;
    t1 = t0?._resourceLoader;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1237, A, l, S, F);
      t0 = 1;
      t1 = 4;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1247, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1248, A, l, S, F);
    t0 = v11;
    t1 = t0?._sessionHistory;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1256, A, l, S, F);
      t0 = 1;
      t1 = 4;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1266, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1267, A, l, S, F);
    t0 = v11;
    t1 = t0?._virtualConsole;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 !== t3);
    F = !!(t4);
    if (!(t4)) {
    } else {
      if (typeof TRACE === "function") TRACE(1275, A, l, S, F);
      t0 = 1;
      t1 = 4;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1285, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1286, A, l, S, F);
    t0 = localStorage;
    t1 = t0?.setItem;
    v32 = t1;
    t2 = t1;
    t3 = (typeof t2);
    t4 = "undefined";
    t5 = (t3 === t4);
    F = !!(t5);
    if (!(t5)) {
    } else {
      if (typeof TRACE === "function") TRACE(1297, A, l, S, F);
      t0 = 1;
      t1 = 3;
      t2 = (t0 << t1);
      v2 = t2;
      t3 = v5;
      t4 = t2;
      t5 = (t3 | t4);
      v5 = t5;
      S.push(t2);
      S.push(t5);
    }
    if (typeof TRACE === "function") TRACE(1307, A, l, S, F);
    if (F) {
    } else {
      if (typeof TRACE === "function") TRACE(1308, A, l, S, F);
      t0 = localStorage;
      t1 = 2039;
      A[3] = SUB(t1, 1, A, l, S);
      v33 = A[3];
      t2 = v33;
      t3 = 1;
      t4 = (t2 === t3);
      F = !!(t4);
      S.push(t0);
      if (!(t4)) {
      } else {
        if (typeof TRACE === "function") TRACE(1319, A, l, S, F);
        t0 = 1;
        t1 = 2;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v5;
        t4 = t2;
        t5 = (t3 | t4);
        v5 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1329, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1330, A, l, S, F);
      t0 = sessionStorage;
      t1 = 2039;
      A[3] = SUB(t1, 1, A, l, S);
      v34 = A[3];
      t2 = v34;
      t3 = 1;
      t4 = (t2 === t3);
      F = !!(t4);
      S.push(t0);
      if (!(t4)) {
      } else {
        if (typeof TRACE === "function") TRACE(1341, A, l, S, F);
        t0 = 1;
        t1 = 1;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v5;
        t4 = t2;
        t5 = (t3 | t4);
        v5 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1351, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1352, A, l, S, F);
      t0 = screen;
      t1 = v8;
      t2 = Proxy;
      t3 = new t2(t0, t1);
      v35 = t3;
      t4 = t3;
      t5 = 2146;
      A[3] = SUB(t5, 1, A, l, S);
      v36 = A[3];
      t6 = v36;
      t7 = 1;
      t8 = (t6 === t7);
      F = !!(t8);
      S.push(t4);
      if (!(t8)) {
      } else {
        if (typeof TRACE === "function") TRACE(1371, A, l, S, F);
        t0 = 1;
        v2 = t0;
        t1 = v5;
        t2 = t0;
        t3 = (t1 | t2);
        v5 = t3;
        S.push(t0);
        S.push(t3);
      }
      if (typeof TRACE === "function") TRACE(1379, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1380, A, l, S, F);
      t0 = "try{var a=0;var b=new Error;Object.defineProperty(b,\"stack\",{get:function(){a++}});console.debug(b);b.stack;return a>1}catch(_){return true}";
      t1 = v14;
      t2 = new t1(t0);
      v37 = t2;
      t3 = t2;
      t4 = t3();
      v38 = t4;
      t5 = t4;
      F = !!(t5);
      S.push(t4);
      if (!(t5)) {
      } else {
        if (typeof TRACE === "function") TRACE(1392, A, l, S, F);
        t0 = 1;
        t1 = 15;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1402, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1403, A, l, S, F);
      t0 = Document;
      t1 = new t0();
      v39 = t1;
      t2 = t1;
      t3 = t2?.all;
      v40 = t3;
      t4 = t3;
      t5 = (typeof t4);
      t6 = "undefined";
      t7 = (t5 !== t6);
      F = !!(t7);
      if (!(t7)) {
      } else {
        if (typeof TRACE === "function") TRACE(1417, A, l, S, F);
        t0 = 1;
        t1 = 13;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1427, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1428, A, l, S, F);
      t0 = v40;
      t1 = t0?.length;
      t2 = (typeof t1);
      t3 = "number";
      t4 = (t2 !== t3);
      F = !!(t4);
      if (!(t4)) {
      } else {
        if (typeof TRACE === "function") TRACE(1436, A, l, S, F);
        t0 = 1;
        t1 = 12;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1446, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1447, A, l, S, F);
      t0 = "try{return new Document().all()}catch(_){}";
      t1 = v14;
      t2 = new t1(t0);
      v41 = t2;
      t3 = t2;
      t4 = t3();
      v42 = t4;
      t5 = t4;
      t6 = (typeof t5);
      t7 = "undefined";
      t8 = (t6 === t7);
      F = !!(t8);
      S.push(t2);
      S.push(t4);
      if (!(t8)) {
      } else {
        if (typeof TRACE === "function") TRACE(1463, A, l, S, F);
        t0 = 1;
        t1 = 11;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1473, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1474, A, l, S, F);
      t0 = "HTMLAllCollection";
      t1 = v40;
      t2 = t1.toString();
      t3 = t2.indexOf(t0);
      t4 = 1;
      t5 = (-t4);
      t6 = (t3 === t5);
      F = !!(t6);
      if (!(t6)) {
      } else {
        if (typeof TRACE === "function") TRACE(1486, A, l, S, F);
        t0 = 1;
        t1 = 10;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1496, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1497, A, l, S, F);
      t0 = "try{return process}catch(_){}";
      t1 = v14;
      t2 = new t1(t0);
      v43 = t2;
      t3 = t2;
      t4 = t3();
      v44 = t4;
      t5 = t4;
      t6 = (typeof t5);
      t7 = "undefined";
      t8 = (t6 !== t7);
      F = !!(t8);
      if (!(t8)) {
      } else {
        if (typeof TRACE === "function") TRACE(1511, A, l, S, F);
        t0 = 1;
        t1 = 9;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1521, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1522, A, l, S, F);
      t0 = "try{return global}catch(_){}";
      t1 = v14;
      t2 = new t1(t0);
      v45 = t2;
      t3 = t2;
      t4 = t3();
      v46 = t4;
      t5 = t4;
      t6 = (typeof t5);
      t7 = "undefined";
      t8 = (t6 !== t7);
      F = !!(t8);
      if (!(t8)) {
      } else {
        if (typeof TRACE === "function") TRACE(1536, A, l, S, F);
        t0 = 1;
        t1 = 8;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1546, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1547, A, l, S, F);
      t0 = window;
      t1 = t0?.document;
      t2 = v16;
      t3 = (t1 !== t2);
      F = !!(t3);
      if (!(t3)) {
      } else {
        if (typeof TRACE === "function") TRACE(1555, A, l, S, F);
        t0 = 1;
        t1 = 7;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1565, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1566, A, l, S, F);
      t0 = window;
      t1 = t0?.global;
      t2 = (typeof t1);
      t3 = "undefined";
      t4 = (t2 !== t3);
      F = !!(t4);
      if (!(t4)) {
      } else {
        if (typeof TRACE === "function") TRACE(1575, A, l, S, F);
        t0 = 1;
        t1 = 6;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1585, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1586, A, l, S, F);
      t0 = "native";
      t1 = setTimeout;
      t2 = t1.toString();
      t3 = t2.indexOf(t0);
      t4 = 1;
      t5 = (-t4);
      t6 = (t3 === t5);
      F = !!(t6);
      if (!(t6)) {
      } else {
        if (typeof TRACE === "function") TRACE(1599, A, l, S, F);
        t0 = 1;
        t1 = 5;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1609, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1610, A, l, S, F);
      t0 = "native";
      t1 = setInterval;
      t2 = t1.toString();
      t3 = t2.indexOf(t0);
      t4 = 1;
      t5 = (-t4);
      t6 = (t3 === t5);
      F = !!(t6);
      if (!(t6)) {
      } else {
        if (typeof TRACE === "function") TRACE(1623, A, l, S, F);
        t0 = 1;
        t1 = 4;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1633, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1634, A, l, S, F);
      t0 = window;
      t1 = t0?.URL;
      v47 = t1;
      t2 = "https://www.zhihu.com";
      t3 = t1;
      t4 = new t3(t2);
      v48 = t4;
      t5 = t4;
      t6 = (typeof t5);
      t7 = "undefined";
      t8 = (t6 === t7);
      F = !!(t8);
      if (!(t8)) {
      } else {
        if (typeof TRACE === "function") TRACE(1650, A, l, S, F);
        t0 = 1;
        t1 = 3;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1660, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1661, A, l, S, F);
      t0 = "native";
      t1 = window;
      t2 = t1?.stop;
      t3 = t2.toString();
      t4 = t3.indexOf(t0);
      t5 = 1;
      t6 = (-t5);
      t7 = (t4 === t6);
      F = !!(t7);
      if (!(t7)) {
      } else {
        if (typeof TRACE === "function") TRACE(1676, A, l, S, F);
        t0 = 1;
        t1 = 2;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1686, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1687, A, l, S, F);
      t0 = "cmV0dXJuIHdpbmRvdy5NZWRpYVNvdXJjZSAmJiB3aW5kb3cuTWVkaWFTb3VyY2UuaXNUeXBlU3VwcG9ydGVkICYmIHdpbmRvdy5NZWRpYVNvdXJjZS5pc1R5cGVTdXBwb3J0ZWQoJ3ZpZGVvL21wNDsgY29kZWNzPSJhdmMxLjQyRTAxRSInKQ==";
      t1 = window;
      t2 = t1.atob(t0);
      v49 = t2;
      t3 = t2;
      t4 = v14;
      t5 = new t4(t3);
      v50 = t5;
      t6 = t5;
      t7 = t6();
      v51 = t7;
      t8 = t7;
      t9 = "true";
      t10 = (t8 !== t9);
      F = !!(t10);
      if (!(t10)) {
      } else {
        if (typeof TRACE === "function") TRACE(1707, A, l, S, F);
        t0 = 1;
        t1 = 1;
        t2 = (t0 << t1);
        v2 = t2;
        t3 = v6;
        t4 = t2;
        t5 = (t3 | t4);
        v6 = t5;
        S.push(t2);
        S.push(t5);
      }
      if (typeof TRACE === "function") TRACE(1717, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1718, A, l, S, F);
      t0 = window;
      t1 = t0?.top;
      t2 = window;
      t3 = (t1 !== t2);
      F = !!(t3);
      if (!(t3)) {
      } else {
        if (typeof TRACE === "function") TRACE(1727, A, l, S, F);
        t0 = 1;
        v2 = t0;
        t1 = v6;
        t2 = t0;
        t3 = (t1 | t2);
        v6 = t3;
        S.push(t0);
        S.push(t3);
      }
      if (typeof TRACE === "function") TRACE(1735, A, l, S, F);
    }
    if (typeof TRACE === "function") TRACE(1736, A, l, S, F);
    t0 = 16;
    t1 = v3;
    t2 = t1.toString(t0);
    v52 = t2;
    t3 = 16;
    t4 = v4;
    t5 = t4.toString(t3);
    v53 = t5;
    t6 = 16;
    t7 = v5;
    t8 = t7.toString(t6);
    v54 = t8;
    t9 = 16;
    t10 = v6;
    t11 = t10.toString(t9);
    v55 = t11;
    t12 = 2227;
    A[3] = SUB(t12, 0, A, l, S);
    v56 = A[3];
    t13 = 2289;
    A[3] = SUB(t13, 0, A, l, S);
    v57 = A[3];
    t14 = Error;
    t15 = new t14();
    t16 = t15?.stack;
    t17 = t16.toString();
    v58 = t17;
    t18 = v56;
    t19 = v57;
    t20 = (t18 + t19);
    v56 = t20;
    t21 = t20;
    t22 = "acc7471d3eb9bc30";
    t23 = 1832;
    A[3] = SUB(t23, 2, A, l, S);
    v56 = A[3];
    t24 = t2;
    t25 = t5;
    t26 = (t24 + t25);
    t27 = t8;
    t28 = (t26 + t27);
    t29 = t11;
    t30 = (t28 + t29);
    v59 = t30;
    t31 = t30;
    t32 = "f25b8434cca9a1f5";
    t33 = 1832;
    A[3] = SUB(t33, 2, A, l, S);
    v59 = A[3];
    t34 = t17;
    t35 = window;
    t36 = t35.btoa(t34);
    v58 = t36;
    t37 = v56;
    t38 = v7;
    t39 = (t37 + t38);
    t40 = v59;
    t41 = (t39 + t40);
    t42 = v7;
    t43 = (t41 + t42);
    t44 = t36;
    t45 = (t43 + t44);
    t46 = v7;
    t47 = (t45 + t46);
    v60 = t47;
    t48 = t47;
    t49 = __b;
    M_SET(t49, "zh", t48);
    S.push(t20);
    S.push(t21);
    S.push(t22);
    S.push(A[3]);
    S.push(t31);
    S.push(t32);
    S.push(A[3]);
    S.push(t36);
    S.push(t48);
  }
  if (typeof TRACE === "function") TRACE(1830, A, l, S, F);
  if (typeof TRACE === "function") TRACE(1831, A, l, S, F);
  if (typeof TRACE === "function") TRACE(1832, A, l, S, F);
  t0 = "";
  v62 = t0;
  t1 = v0;
  t2 = t1?.length;
  v63 = t2;
  t3 = v1;
  t4 = t3?.length;
  v64 = t4;
  t5 = __b;
  t6 = t5?.a3;
  v65 = t6;
  t7 = 0;
  v66 = t7;
  A[0] = t7;
  L1849: for (;;) {
    if (typeof TRACE === "function") TRACE(1849, A, l, S, F);
    t0 = v66;
    t1 = v63;
    t2 = (t0 < t1);
    F = !!(t2);
    if (!(t2)) break L1849;
    if (typeof TRACE === "function") TRACE(1854, A, l, S, F);
    t0 = v66;
    t1 = v0;
    t2 = t1.charCodeAt(t0);
    v67 = t2;
    t3 = v66;
    t4 = v64;
    t5 = (t3 % t4);
    v68 = t5;
    t6 = t5;
    t7 = v1;
    t8 = t7.charCodeAt(t6);
    v69 = t8;
    t9 = t2;
    t10 = t8;
    t11 = (t9 ^ t10);
    t12 = v65;
    t13 = (t11 ^ t12);
    v70 = t13;
    t14 = t13;
    v65 = t14;
    t15 = t13;
    t16 = String;
    t17 = t16.fromCharCode(t15);
    v71 = t17;
    t18 = v62;
    t19 = t17;
    t20 = (t18 + t19);
    v62 = t20;
    t21 = v66;
    t22 = 1;
    t23 = (t21 + t22);
    v66 = t23;
    S.push(t14);
    S.push(t20);
    continue L1849;
  }   // end loop L1849
  if (typeof TRACE === "function") TRACE(1896, A, l, S, F);
  t0 = v65;
  t1 = __b;
  M_SET(t1, "a3", t0);
  t2 = v62;
  A[0] = t1;
  A[3] = t2;
  return { A: A, l: l };
  return { A: A, l: l };
}
function FR_1832(A, l, S) {   // frame entered at pc 1832
  let F = false;
  let v0 = l[0], v1 = l[1], v62 = l[62], v63 = l[63], v64 = l[64], v65 = l[65], v66 = l[66], v67 = l[67], v68 = l[68], v69 = l[69], v70 = l[70], v71 = l[71];
  let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15;
  let t16, t17, t18, t19, t20, t21, t22, t23;
  if (typeof TRACE === "function") TRACE(1832, A, l, S, F);
  t0 = "";
  v62 = t0;
  t1 = v0;
  t2 = t1?.length;
  v63 = t2;
  t3 = v1;
  t4 = t3?.length;
  v64 = t4;
  t5 = __b;
  t6 = t5?.a3;
  v65 = t6;
  t7 = 0;
  v66 = t7;
  A[0] = t7;
  L1849: for (;;) {
    if (typeof TRACE === "function") TRACE(1849, A, l, S, F);
    t0 = v66;
    t1 = v63;
    t2 = (t0 < t1);
    F = !!(t2);
    if (!(t2)) break L1849;
    if (typeof TRACE === "function") TRACE(1854, A, l, S, F);
    t0 = v66;
    t1 = v0;
    t2 = t1.charCodeAt(t0);
    v67 = t2;
    t3 = v66;
    t4 = v64;
    t5 = (t3 % t4);
    v68 = t5;
    t6 = t5;
    t7 = v1;
    t8 = t7.charCodeAt(t6);
    v69 = t8;
    t9 = t2;
    t10 = t8;
    t11 = (t9 ^ t10);
    t12 = v65;
    t13 = (t11 ^ t12);
    v70 = t13;
    t14 = t13;
    v65 = t14;
    t15 = t13;
    t16 = String;
    t17 = t16.fromCharCode(t15);
    v71 = t17;
    t18 = v62;
    t19 = t17;
    t20 = (t18 + t19);
    v62 = t20;
    t21 = v66;
    t22 = 1;
    t23 = (t21 + t22);
    v66 = t23;
    S.push(t14);
    S.push(t20);
    continue L1849;
  }   // end loop L1849
  if (typeof TRACE === "function") TRACE(1896, A, l, S, F);
  t0 = v65;
  t1 = __b;
  M_SET(t1, "a3", t0);
  t2 = v62;
  A[0] = t1;
  A[3] = t2;
  return { A: A, l: l };
  return { A: A, l: l };
}
function FR_1905(A, l, S) {   // frame entered at pc 1905
  let F = false;
  let v10 = l[10], v11 = l[11], v60 = l[60], v72 = l[72], v73 = l[73];
  let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15;
  let t16, t17, t18, t19;
  if (typeof TRACE === "function") TRACE(1905, A, l, S, F);
  t0 = Object;
  t1 = new t0();
  v10 = t1;
  t2 = "a";
  t3 = "b";
  t4 = "return b in a ? a[b]: undefined";
  t5 = Function;
  t6 = new t5(t2, t3, t4);
  v11 = t6;
  t7 = t6;
  t8 = "get";
  t9 = t1;
  M_SET(t9, t8, t7);
  t10 = "get";
  t11 = t1;
  t12 = t11?.[t10];
  t13 = t12.toString();
  t14 = t13?.length;
  v72 = t14;
  t15 = CVM;
  t16 = t15.toString();
  v73 = t16;
  t17 = t14;
  t18 = 60;
  t19 = (t17 > t18);
  F = !!(t19);
  A[0] = t17;
  A[1] = t18;
  A[3] = t19;
  if (!(t19)) {
    if (typeof TRACE === "function") TRACE(1947, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1948, A, l, S, F);
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
      if (typeof TRACE === "function") TRACE(1959, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1960, A, l, S, F);
      t0 = "onsol";
      t1 = v73;
      t2 = t1.indexOf(t0);
      t3 = 1;
      t4 = (-t3);
      t5 = (t2 !== t4);
      F = !!(t5);
      A[0] = t4;
      A[3] = t5;
      if (!(t5)) {
        if (typeof TRACE === "function") TRACE(1972, A, l, S, F);
        if (typeof TRACE === "function") TRACE(1973, A, l, S, F);
        t0 = Error;
        t1 = new t0();
        t2 = t1?.stack;
        v60 = t2;
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
          if (typeof TRACE === "function") TRACE(1991, A, l, S, F);
          if (typeof TRACE === "function") TRACE(1992, A, l, S, F);
          t0 = "executeUserEntryPoint";
          t1 = v60;
          t2 = t1.indexOf(t0);
          t3 = 1;
          t4 = (-t3);
          t5 = (t2 !== t4);
          F = !!(t5);
          A[0] = t4;
          A[3] = t5;
          if (!(t5)) {
            if (typeof TRACE === "function") TRACE(2004, A, l, S, F);
            if (typeof TRACE === "function") TRACE(2005, A, l, S, F);
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
              if (typeof TRACE === "function") TRACE(2024, A, l, S, F);
              if (typeof TRACE === "function") TRACE(2025, A, l, S, F);
              t0 = window;
              t1 = t0?.v_log;
              t2 = (typeof t1);
              t3 = "undefined";
              t4 = (t2 !== t3);
              F = !!(t4);
              A[0] = t2;
              A[1] = t3;
              if (!(t4)) {
                if (typeof TRACE === "function") TRACE(2036, A, l, S, F);
                if (typeof TRACE === "function") TRACE(2037, A, l, S, F);
                t0 = 1;
                A[3] = t0;
                return { A: A, l: l };
              } else {
                if (typeof TRACE === "function") TRACE(2034, A, l, S, F);
                t0 = 2;
                A[3] = t0;
                return { A: A, l: l };
              }
            } else {
              if (typeof TRACE === "function") TRACE(2022, A, l, S, F);
              t0 = 2;
              A[3] = t0;
              return { A: A, l: l };
            }
          } else {
            if (typeof TRACE === "function") TRACE(2002, A, l, S, F);
            t0 = 2;
            A[3] = t0;
            return { A: A, l: l };
          }
        } else {
          if (typeof TRACE === "function") TRACE(1989, A, l, S, F);
          t0 = 2;
          A[3] = t0;
          return { A: A, l: l };
        }
      } else {
        if (typeof TRACE === "function") TRACE(1970, A, l, S, F);
        t0 = 2;
        A[3] = t0;
        return { A: A, l: l };
      }
    } else {
      if (typeof TRACE === "function") TRACE(1957, A, l, S, F);
      t0 = 2;
      A[3] = t0;
      return { A: A, l: l };
    }
  } else {
    if (typeof TRACE === "function") TRACE(1945, A, l, S, F);
    t0 = 2;
    A[3] = t0;
    return { A: A, l: l };
  }
  return { A: A, l: l };
}
function FR_2039(A, l, S) {   // frame entered at pc 2039
  let F = false;
  let v0 = l[0], v75 = l[75], v76 = l[76];
  let t0, t1, t2, t3, t4, t5, t6, t7, t8;
  if (typeof TRACE === "function") TRACE(2039, A, l, S, F);
  t0 = "zseCk";
  t1 = "zseCk";
  t2 = v0;
  t3 = t2.setItem(t0, t1);
  t4 = v0;
  t5 = t4?.length;
  v75 = t5;
  t6 = v0;
  t7 = 1;
  t8 = (t6 < t7);
  F = !!(t8);
  A[0] = t6;
  A[1] = t7;
  A[3] = t8;
  if (!(t8)) {
    if (typeof TRACE === "function") TRACE(2057, A, l, S, F);
    if (typeof TRACE === "function") TRACE(2058, A, l, S, F);
    t0 = "zseCk";
    t1 = v0;
    t2 = t1.getItem(t0);
    v76 = t2;
    t3 = t2;
    t4 = "zseCk";
    t5 = (t3 !== t4);
    F = !!(t5);
    A[0] = t3;
    A[1] = t4;
    A[3] = t5;
    if (!(t5)) {
      if (typeof TRACE === "function") TRACE(2071, A, l, S, F);
      if (typeof TRACE === "function") TRACE(2072, A, l, S, F);
      t0 = "zseCk";
      t1 = v0;
      t2 = t1.removeItem(t0);
      t3 = 2;
      A[0] = t1;
      A[3] = t3;
      return { A: A, l: l };
    } else {
      if (typeof TRACE === "function") TRACE(2069, A, l, S, F);
      t0 = 1;
      A[3] = t0;
      return { A: A, l: l };
    }
  } else {
    if (typeof TRACE === "function") TRACE(2055, A, l, S, F);
    t0 = 1;
    A[3] = t0;
    return { A: A, l: l };
  }
  return { A: A, l: l };
}
function FR_2079(A, l, S) {   // frame entered at pc 2079
  let F = false;
  let v0 = l[0];
  let t0, t1, t2, t3, t4, t5;
  if (typeof TRACE === "function") TRACE(2079, A, l, S, F);
  t0 = "document";
  t1 = v0;
  t2 = t1.indexOf(t0);
  t3 = 1;
  t4 = (-t3);
  t5 = (t2 === t4);
  F = !!(t5);
  A[0] = t4;
  A[3] = t5;
  if (!(t5)) {
    if (typeof TRACE === "function") TRACE(2091, A, l, S, F);
    if (typeof TRACE === "function") TRACE(2092, A, l, S, F);
    t0 = "location";
    t1 = v0;
    t2 = t1.indexOf(t0);
    t3 = 1;
    t4 = (-t3);
    t5 = (t2 === t4);
    F = !!(t5);
    A[0] = t4;
    A[3] = t5;
    if (!(t5)) {
      if (typeof TRACE === "function") TRACE(2104, A, l, S, F);
      if (typeof TRACE === "function") TRACE(2105, A, l, S, F);
      t0 = "screen";
      t1 = v0;
      t2 = t1.indexOf(t0);
      t3 = 1;
      t4 = (-t3);
      t5 = (t2 === t4);
      F = !!(t5);
      A[0] = t4;
      A[3] = t5;
      if (!(t5)) {
        if (typeof TRACE === "function") TRACE(2117, A, l, S, F);
        if (typeof TRACE === "function") TRACE(2118, A, l, S, F);
        t0 = "history";
        t1 = v0;
        t2 = t1.indexOf(t0);
        t3 = 1;
        t4 = (-t3);
        t5 = (t2 === t4);
        F = !!(t5);
        A[0] = t4;
        A[3] = t5;
        if (!(t5)) {
          if (typeof TRACE === "function") TRACE(2130, A, l, S, F);
          if (typeof TRACE === "function") TRACE(2131, A, l, S, F);
          t0 = "navigator";
          t1 = v0;
          t2 = t1.indexOf(t0);
          t3 = 1;
          t4 = (-t3);
          t5 = (t2 === t4);
          F = !!(t5);
          A[0] = t4;
          if (!(t5)) {
            if (typeof TRACE === "function") TRACE(2143, A, l, S, F);
            if (typeof TRACE === "function") TRACE(2144, A, l, S, F);
            t0 = 2;
            A[3] = t0;
            return { A: A, l: l };
          } else {
            if (typeof TRACE === "function") TRACE(2141, A, l, S, F);
            t0 = 1;
            A[3] = t0;
            return { A: A, l: l };
          }
        } else {
          if (typeof TRACE === "function") TRACE(2128, A, l, S, F);
          t0 = 1;
          A[3] = t0;
          return { A: A, l: l };
        }
      } else {
        if (typeof TRACE === "function") TRACE(2115, A, l, S, F);
        t0 = 1;
        A[3] = t0;
        return { A: A, l: l };
      }
    } else {
      if (typeof TRACE === "function") TRACE(2102, A, l, S, F);
      t0 = 1;
      A[3] = t0;
      return { A: A, l: l };
    }
  } else {
    if (typeof TRACE === "function") TRACE(2089, A, l, S, F);
    t0 = 1;
    A[3] = t0;
    return { A: A, l: l };
  }
  return { A: A, l: l };
}
function FR_2146(A, l, S) {   // frame entered at pc 2146
  let F = false;
  let v0 = l[0];
  let t0, t1, t2, t3, t4;
  if (typeof TRACE === "function") TRACE(2146, A, l, S, F);
  t0 = v0;
  t1 = t0?.width;
  t2 = (typeof t1);
  t3 = "undefined";
  t4 = (t2 === t3);
  F = !!(t4);
  A[0] = t2;
  A[1] = t3;
  A[3] = t4;
  if (!(t4)) {
    if (typeof TRACE === "function") TRACE(2156, A, l, S, F);
    if (typeof TRACE === "function") TRACE(2157, A, l, S, F);
    t0 = v0;
    t1 = t0?.height;
    t2 = (typeof t1);
    t3 = "undefined";
    t4 = (t2 === t3);
    F = !!(t4);
    A[0] = t2;
    A[1] = t3;
    A[3] = t4;
    if (!(t4)) {
      if (typeof TRACE === "function") TRACE(2167, A, l, S, F);
      if (typeof TRACE === "function") TRACE(2168, A, l, S, F);
      t0 = v0;
      t1 = t0?.availHeight;
      t2 = (typeof t1);
      t3 = "undefined";
      t4 = (t2 === t3);
      F = !!(t4);
      A[0] = t2;
      A[1] = t3;
      A[3] = t4;
      if (!(t4)) {
        if (typeof TRACE === "function") TRACE(2178, A, l, S, F);
        if (typeof TRACE === "function") TRACE(2179, A, l, S, F);
        t0 = v0;
        t1 = t0?.availWidth;
        t2 = (typeof t1);
        t3 = "undefined";
        t4 = (t2 === t3);
        F = !!(t4);
        A[0] = t2;
        A[1] = t3;
        A[3] = t4;
        if (!(t4)) {
          if (typeof TRACE === "function") TRACE(2189, A, l, S, F);
          if (typeof TRACE === "function") TRACE(2190, A, l, S, F);
          t0 = v0;
          t1 = t0?.colorDepth;
          t2 = (typeof t1);
          t3 = "undefined";
          t4 = (t2 === t3);
          F = !!(t4);
          A[0] = t2;
          A[1] = t3;
          A[3] = t4;
          if (!(t4)) {
            if (typeof TRACE === "function") TRACE(2200, A, l, S, F);
            if (typeof TRACE === "function") TRACE(2201, A, l, S, F);
            t0 = screen;
            t1 = t0?.pixelDepth;
            t2 = (typeof t1);
            t3 = "undefined";
            t4 = (t2 === t3);
            F = !!(t4);
            A[0] = t2;
            A[1] = t3;
            A[3] = t4;
            if (!(t4)) {
              if (typeof TRACE === "function") TRACE(2212, A, l, S, F);
              if (typeof TRACE === "function") TRACE(2213, A, l, S, F);
              t0 = screen;
              t1 = t0?.availLeft;
              t2 = (typeof t1);
              t3 = "undefined";
              t4 = (t2 === t3);
              F = !!(t4);
              A[0] = t2;
              A[1] = t3;
              if (!(t4)) {
                if (typeof TRACE === "function") TRACE(2224, A, l, S, F);
                if (typeof TRACE === "function") TRACE(2225, A, l, S, F);
                t0 = 2;
                A[3] = t0;
                return { A: A, l: l };
              } else {
                if (typeof TRACE === "function") TRACE(2222, A, l, S, F);
                t0 = 1;
                A[3] = t0;
                return { A: A, l: l };
              }
            } else {
              if (typeof TRACE === "function") TRACE(2210, A, l, S, F);
              t0 = 1;
              A[3] = t0;
              return { A: A, l: l };
            }
          } else {
            if (typeof TRACE === "function") TRACE(2198, A, l, S, F);
            t0 = 1;
            A[3] = t0;
            return { A: A, l: l };
          }
        } else {
          if (typeof TRACE === "function") TRACE(2187, A, l, S, F);
          t0 = 1;
          A[3] = t0;
          return { A: A, l: l };
        }
      } else {
        if (typeof TRACE === "function") TRACE(2176, A, l, S, F);
        t0 = 1;
        A[3] = t0;
        return { A: A, l: l };
      }
    } else {
      if (typeof TRACE === "function") TRACE(2165, A, l, S, F);
      t0 = 1;
      A[3] = t0;
      return { A: A, l: l };
    }
  } else {
    if (typeof TRACE === "function") TRACE(2154, A, l, S, F);
    t0 = 1;
    A[3] = t0;
    return { A: A, l: l };
  }
  return { A: A, l: l };
}
function FR_2227(A, l, S) {   // frame entered at pc 2227
  let F = false;
  let v77 = l[77], v78 = l[78], v79 = l[79], v80 = l[80], v81 = l[81], v82 = l[82], v83 = l[83], v84 = l[84], v85 = l[85];
  let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15;
  let t16;
  if (typeof TRACE === "function") TRACE(2227, A, l, S, F);
  t0 = Math;
  t1 = t0.random();
  v77 = t1;
  t2 = Math;
  t3 = t2.random();
  v78 = t3;
  t4 = Math;
  t5 = t4.random();
  v79 = t5;
  t6 = t1;
  t7 = t3;
  t8 = (t6 + t7);
  t9 = t5;
  t10 = (t8 + t9);
  v80 = t10;
  t11 = t1;
  t12 = 3;
  t13 = (t11 * t12);
  v81 = t13;
  t14 = t10;
  t15 = t13;
  t16 = (t14 === t15);
  F = !!(t16);
  A[0] = t14;
  A[1] = t15;
  A[3] = t16;
  if (!(t16)) {
    if (typeof TRACE === "function") TRACE(2262, A, l, S, F);
    if (typeof TRACE === "function") TRACE(2263, A, l, S, F);
    t0 = Math;
    t1 = t0.random();
    v83 = t1;
    t2 = t1;
    t3 = "65536";
    t4 = (t2 * t3);
    t5 = 16;
    t6 = (t4 * t5);
    v84 = t6;
    t7 = t6;
    t8 = Math;
    t9 = t8.floor(t7);
    v85 = t9;
    t10 = 16;
    t11 = t9;
    t12 = t11.toString(t10);
    v82 = t12;
    t13 = t12;
    A[0] = t11;
    A[1] = t3;
    A[3] = t13;
    return { A: A, l: l };
  } else {
    if (typeof TRACE === "function") TRACE(2257, A, l, S, F);
    t0 = "sbcd";
    v82 = t0;
    t1 = t0;
    A[0] = t0;
    A[3] = t1;
    return { A: A, l: l };
  }
  return { A: A, l: l };
}
function FR_2289(A, l, S) {   // frame entered at pc 2289
  let F = false;
  let v86 = l[86], v87 = l[87];
  let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11;
  if (typeof TRACE === "function") TRACE(2289, A, l, S, F);
  t0 = 1;
  t1 = Uint32Array;
  t2 = new t1(t0);
  v86 = t2;
  t3 = t2;
  t4 = crypto;
  t5 = t4.getRandomValues(t3);
  t6 = 16;
  t7 = 0;
  t8 = t2;
  t9 = t8?.[t7];
  t10 = t9.toString(t6);
  v87 = t10;
  t11 = t10;
  A[0] = t9;
  A[3] = t11;
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

