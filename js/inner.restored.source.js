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
    v14 = l[14];
  if (typeof TRACE === "function") TRACE(0, A, l, S, F);
  v0 = FR_735(A, l, S);
  A[0] = FR_735(A, l, S);
  A[1] = 4;
  A[3] = (FR_735(A, l, S) > 4);
  if (FR_735(A, l, S) > 4) {
    if (typeof TRACE === "function") TRACE(8, A, l, S, F);
    M_SET(__b, "a3", 41);
    v1 = String.fromCharCode("8204");
    v2 = __b?.zh;
    v3 = (1 << 15);
    v4 = (1 << 15);
    v5 = (1 << 15);
    H2 = {};
    v6 = H2;
    v7 = new Function("a", "b", "return b in a ? a[b]: undefined");
    H2.get = new Function("a", "b", "return b in a ? a[b]: undefined");
    v8 = new Function("a", "b", "c", "a[b]=c;return true");
    H2.set = new Function("a", "b", "c", "a[b]=c;return true");
    v9 = new Proxy(location, H2);
    S.push(41);
    S.push(new Function("a", "b", "return b in a ? a[b]: undefined"));
    S.push(new Function("a", "b", "c", "a[b]=c;return true"));
    if (location.toString().indexOf("zhihu") === -1) {
      if (typeof TRACE === "function") TRACE(104, A, l, S, F);
      v3 |= (1 << 14);
      S.push((1 << 14));
      S.push((v3 | (1 << 14)));
    }
    if (typeof TRACE === "function") TRACE(114, A, l, S, F);
    if (typeof TRACE === "function") TRACE(115, A, l, S, F);
    if ((v9?.toString).toString().indexOf("native") === -1) {
      if (typeof TRACE === "function") TRACE(129, A, l, S, F);
      v3 |= (1 << 13);
      S.push((1 << 13));
      S.push((v3 | (1 << 13)));
    }
    if (typeof TRACE === "function") TRACE(139, A, l, S, F);
    if (typeof TRACE === "function") TRACE(140, A, l, S, F);
    if (typeof v9?.host === "undefined") {
      if (typeof TRACE === "function") TRACE(148, A, l, S, F);
      v3 |= (1 << 12);
      S.push((1 << 12));
      S.push((v3 | (1 << 12)));
    }
    if (typeof TRACE === "function") TRACE(158, A, l, S, F);
    if (typeof TRACE === "function") TRACE(159, A, l, S, F);
    if (typeof v9?.hostname === "undefined") {
      if (typeof TRACE === "function") TRACE(167, A, l, S, F);
      v3 |= (1 << 11);
      S.push((1 << 11));
      S.push((v3 | (1 << 11)));
    }
    if (typeof TRACE === "function") TRACE(177, A, l, S, F);
    if (typeof TRACE === "function") TRACE(178, A, l, S, F);
    if (typeof window?.devicePixelRatio === "undefined") {
      if (typeof TRACE === "function") TRACE(187, A, l, S, F);
      v3 |= (1 << 10);
      S.push((1 << 10));
      S.push((v3 | (1 << 10)));
    }
    if (typeof TRACE === "function") TRACE(197, A, l, S, F);
    if (typeof TRACE === "function") TRACE(198, A, l, S, F);
    if (typeof window?.blur === "undefined") {
      if (typeof TRACE === "function") TRACE(207, A, l, S, F);
      v3 |= (1 << 9);
      S.push((1 << 9));
      S.push((v3 | (1 << 9)));
    }
    if (typeof TRACE === "function") TRACE(217, A, l, S, F);
    if (typeof TRACE === "function") TRACE(218, A, l, S, F);
    if ((window?.blur).toString().indexOf("native") === -1) {
      if (typeof TRACE === "function") TRACE(233, A, l, S, F);
      v3 |= (1 << 8);
      S.push((1 << 8));
      S.push((v3 | (1 << 8)));
    }
    if (typeof TRACE === "function") TRACE(243, A, l, S, F);
    if (typeof TRACE === "function") TRACE(244, A, l, S, F);
    if (typeof window?.self === "undefined") {
      if (typeof TRACE === "function") TRACE(253, A, l, S, F);
      v3 |= (1 << 7);
      S.push((1 << 7));
      S.push((v3 | (1 << 7)));
    }
    if (typeof TRACE === "function") TRACE(263, A, l, S, F);
    if (typeof TRACE === "function") TRACE(264, A, l, S, F);
    if (typeof history?.pushState !== "function") {
      if (typeof TRACE === "function") TRACE(273, A, l, S, F);
      v3 |= (1 << 6);
      S.push((1 << 6));
      S.push((v3 | (1 << 6)));
    }
    if (typeof TRACE === "function") TRACE(283, A, l, S, F);
    if (typeof TRACE === "function") TRACE(284, A, l, S, F);
    if ((window?.XMLDocument).toString().indexOf("native") === -1) {
      if (typeof TRACE === "function") TRACE(299, A, l, S, F);
      v3 |= (1 << 5);
      S.push((1 << 5));
      S.push((v3 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(309, A, l, S, F);
    if (typeof TRACE === "function") TRACE(310, A, l, S, F);
    if (typeof window?.find === "undefined") {
      if (typeof TRACE === "function") TRACE(319, A, l, S, F);
      v3 |= (1 << 4);
      S.push((1 << 4));
      S.push((v3 | (1 << 4)));
    }
    if (typeof TRACE === "function") TRACE(329, A, l, S, F);
    if (typeof TRACE === "function") TRACE(330, A, l, S, F);
    if (typeof window?.globalThis === "undefined") {
      if (typeof TRACE === "function") TRACE(339, A, l, S, F);
      v3 |= (1 << 3);
      S.push((1 << 3));
      S.push((v3 | (1 << 3)));
    }
    if (typeof TRACE === "function") TRACE(349, A, l, S, F);
    if (typeof TRACE === "function") TRACE(350, A, l, S, F);
    if (typeof window?.name === "undefined") {
      if (typeof TRACE === "function") TRACE(359, A, l, S, F);
      v3 |= (1 << 2);
      S.push((1 << 2));
      S.push((v3 | (1 << 2)));
    }
    if (typeof TRACE === "function") TRACE(369, A, l, S, F);
    if (typeof TRACE === "function") TRACE(370, A, l, S, F);
    if (typeof history?.replaceState !== "function") {
      if (typeof TRACE === "function") TRACE(379, A, l, S, F);
      v3 |= (1 << 1);
      S.push((1 << 1));
      S.push((v3 | (1 << 1)));
    }
    if (typeof TRACE === "function") TRACE(389, A, l, S, F);
    if (typeof TRACE === "function") TRACE(390, A, l, S, F);
    v10 = new XMLHttpRequest();
    if (typeof new XMLHttpRequest() === "undefined") {
      if (typeof TRACE === "function") TRACE(400, A, l, S, F);
      v3 |= 1;
      S.push(1);
      S.push((v3 | 1));
    }
    if (typeof TRACE === "function") TRACE(408, A, l, S, F);
    if (typeof TRACE === "function") TRACE(409, A, l, S, F);
    if (typeof v10?.LOADING === "undefined") {
      if (typeof TRACE === "function") TRACE(417, A, l, S, F);
      v4 |= (1 << 14);
      S.push((1 << 14));
      S.push((v4 | (1 << 14)));
    }
    if (typeof TRACE === "function") TRACE(427, A, l, S, F);
    if (typeof TRACE === "function") TRACE(428, A, l, S, F);
    if (typeof v10?.DONE === "undefined") {
      if (typeof TRACE === "function") TRACE(436, A, l, S, F);
      v4 |= (1 << 13);
      S.push((1 << 13));
      S.push((v4 | (1 << 13)));
    }
    if (typeof TRACE === "function") TRACE(446, A, l, S, F);
    if (typeof TRACE === "function") TRACE(447, A, l, S, F);
    if (typeof v10?.OPENED === "undefined") {
      if (typeof TRACE === "function") TRACE(455, A, l, S, F);
      v4 |= (1 << 12);
      S.push((1 << 12));
      S.push((v4 | (1 << 12)));
    }
    if (typeof TRACE === "function") TRACE(465, A, l, S, F);
    if (typeof TRACE === "function") TRACE(466, A, l, S, F);
    if (typeof v10?.UNSENT === "undefined") {
      if (typeof TRACE === "function") TRACE(474, A, l, S, F);
      v4 |= (1 << 11);
      S.push((1 << 11));
      S.push((v4 | (1 << 11)));
    }
    if (typeof TRACE === "function") TRACE(484, A, l, S, F);
    if (typeof TRACE === "function") TRACE(485, A, l, S, F);
    if (typeof v10?.abort === "undefined") {
      if (typeof TRACE === "function") TRACE(493, A, l, S, F);
      v4 |= (1 << 10);
      S.push((1 << 10));
      S.push((v4 | (1 << 10)));
    }
    if (typeof TRACE === "function") TRACE(503, A, l, S, F);
    if (typeof TRACE === "function") TRACE(504, A, l, S, F);
    if (typeof v10?.open === "undefined") {
      if (typeof TRACE === "function") TRACE(512, A, l, S, F);
      v4 |= (1 << 9);
      S.push((1 << 9));
      S.push((v4 | (1 << 9)));
    }
    if (typeof TRACE === "function") TRACE(522, A, l, S, F);
    if (typeof TRACE === "function") TRACE(523, A, l, S, F);
    if (typeof v10?.send === "undefined") {
      if (typeof TRACE === "function") TRACE(531, A, l, S, F);
      v4 |= (1 << 8);
      S.push((1 << 8));
      S.push((v4 | (1 << 8)));
    }
    if (typeof TRACE === "function") TRACE(541, A, l, S, F);
    if (typeof TRACE === "function") TRACE(542, A, l, S, F);
    if (typeof v10?.upload === "undefined") {
      if (typeof TRACE === "function") TRACE(550, A, l, S, F);
      v4 |= (1 << 7);
      S.push((1 << 7));
      S.push((v4 | (1 << 7)));
    }
    if (typeof TRACE === "function") TRACE(560, A, l, S, F);
    if (typeof TRACE === "function") TRACE(561, A, l, S, F);
    if (typeof v10?.responseURL === "undefined") {
      if (typeof TRACE === "function") TRACE(569, A, l, S, F);
      v4 |= (1 << 6);
      S.push((1 << 6));
      S.push((v4 | (1 << 6)));
    }
    if (typeof TRACE === "function") TRACE(579, A, l, S, F);
    if (typeof TRACE === "function") TRACE(580, A, l, S, F);
    if (typeof v10?.onreadystatechange === "undefined") {
      if (typeof TRACE === "function") TRACE(588, A, l, S, F);
      v4 |= (1 << 5);
      S.push((1 << 5));
      S.push((v4 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(598, A, l, S, F);
    if (typeof TRACE === "function") TRACE(599, A, l, S, F);
    if (typeof v10?.status === "undefined") {
      if (typeof TRACE === "function") TRACE(607, A, l, S, F);
      v4 |= (1 << 4);
      S.push((1 << 4));
      S.push((v4 | (1 << 4)));
    }
    if (typeof TRACE === "function") TRACE(617, A, l, S, F);
    if (typeof TRACE === "function") TRACE(618, A, l, S, F);
    if (typeof v10?.onabort === "undefined") {
      if (typeof TRACE === "function") TRACE(626, A, l, S, F);
      v4 |= (1 << 3);
      S.push((1 << 3));
      S.push((v4 | (1 << 3)));
    }
    if (typeof TRACE === "function") TRACE(636, A, l, S, F);
    if (typeof TRACE === "function") TRACE(637, A, l, S, F);
    if (typeof v10?.onabort === "undefined") {
      if (typeof TRACE === "function") TRACE(645, A, l, S, F);
      v4 |= (1 << 2);
      S.push((1 << 2));
      S.push((v4 | (1 << 2)));
    }
    if (typeof TRACE === "function") TRACE(655, A, l, S, F);
    if (typeof TRACE === "function") TRACE(656, A, l, S, F);
    if (typeof v10?.responseXML === "undefined") {
      if (typeof TRACE === "function") TRACE(664, A, l, S, F);
      v4 |= (1 << 1);
      S.push((1 << 1));
      S.push((v4 | (1 << 1)));
    }
    if (typeof TRACE === "function") TRACE(674, A, l, S, F);
    if (typeof TRACE === "function") TRACE(675, A, l, S, F);
    if (typeof v10?.timeout === "undefined") {
      if (typeof TRACE === "function") TRACE(683, A, l, S, F);
      v4 |= 1;
      S.push(1);
      S.push((v4 | 1));
    }
    if (typeof TRACE === "function") TRACE(691, A, l, S, F);
    if (typeof TRACE === "function") TRACE(692, A, l, S, F);
    v3 = v3.toString(16);
    v4 = v4.toString(16);
    v11 = (v3.toString(16) + v4.toString(16));
    A[3] = /*argc=2 */FR_869(A, l, S);
    v11 = A[3];
    v2 = ((v2 + v11) + v1);
    M_SET(__b, "zh", ((v2 + v11) + v1));
    S.push(v3.toString(16));
    S.push(v4.toString(16));
    S.push((v3.toString(16) + v4.toString(16)));
    S.push((v3.toString(16) + v4.toString(16)));
    S.push("b53cc3fa93dc8013");
    S.push(A[3]);
    S.push(((v2 + v11) + v1));
    S.push(((v2 + v11) + v1));
  }
  if (typeof TRACE === "function") TRACE(733, A, l, S, F);
  if (typeof TRACE === "function") TRACE(734, A, l, S, F);
  if (typeof TRACE === "function") TRACE(735, A, l, S, F);
  H1 = {};
  v6 = H1;
  v7 = new Function("a", "b", "return b in a ? a[b]: undefined");
  H1.get = new Function("a", "b", "return b in a ? a[b]: undefined");
  v12 = (H1?.["get"]).toString()?.length;
  v13 = BVM.toString();
  A[0] = (H1?.["get"]).toString()?.length;
  A[1] = 60;
  A[3] = ((H1?.["get"]).toString()?.length > 60);
  if (!((H1?.["get"]).toString()?.length > 60)) {
    if (typeof TRACE === "function") TRACE(777, A, l, S, F);
    if (typeof TRACE === "function") TRACE(778, A, l, S, F);
    A[0] = typeof __b?.zh;
    A[1] = "undefined";
    A[3] = (typeof __b?.zh !== "undefined");
    if (!(typeof __b?.zh !== "undefined")) {
      if (typeof TRACE === "function") TRACE(789, A, l, S, F);
      if (typeof TRACE === "function") TRACE(790, A, l, S, F);
      A[0] = -1;
      A[3] = (v13.indexOf("onsol") !== -1);
      if (!(v13.indexOf("onsol") !== -1)) {
        if (typeof TRACE === "function") TRACE(802, A, l, S, F);
        if (typeof TRACE === "function") TRACE(803, A, l, S, F);
        v14 = new Error()?.stack;
        A[0] = -1;
        A[3] = ((new Error()?.stack).indexOf("node") !== -1);
        if (!((new Error()?.stack).indexOf("node") !== -1)) {
          if (typeof TRACE === "function") TRACE(821, A, l, S, F);
          if (typeof TRACE === "function") TRACE(822, A, l, S, F);
          A[0] = -1;
          A[3] = (v14.indexOf("executeUserEntryPoint") !== -1);
          if (!(v14.indexOf("executeUserEntryPoint") !== -1)) {
            if (typeof TRACE === "function") TRACE(834, A, l, S, F);
            if (typeof TRACE === "function") TRACE(835, A, l, S, F);
            A[0] = -1;
            A[3] = ((Function?.prototype?.constructor).toString().indexOf("native") === -1);
            if (!((Function?.prototype?.constructor).toString().indexOf("native") === -1)) {
              if (typeof TRACE === "function") TRACE(854, A, l, S, F);
              if (typeof TRACE === "function") TRACE(855, A, l, S, F);
              A[0] = typeof window?.v_log;
              A[1] = "undefined";
              if (!(typeof window?.v_log !== "undefined")) {
                if (typeof TRACE === "function") TRACE(866, A, l, S, F);
                if (typeof TRACE === "function") TRACE(867, A, l, S, F);
                A[3] = 5;
                return {
                  A: A,
                  l: l
                };
              } else {
                if (typeof TRACE === "function") TRACE(864, A, l, S, F);
                A[3] = 3;
                return {
                  A: A,
                  l: l
                };
              }
            } else {
              if (typeof TRACE === "function") TRACE(852, A, l, S, F);
              A[3] = 3;
              return {
                A: A,
                l: l
              };
            }
          } else {
            if (typeof TRACE === "function") TRACE(832, A, l, S, F);
            A[3] = 3;
            return {
              A: A,
              l: l
            };
          }
        } else {
          if (typeof TRACE === "function") TRACE(819, A, l, S, F);
          A[3] = 3;
          return {
            A: A,
            l: l
          };
        }
      } else {
        if (typeof TRACE === "function") TRACE(800, A, l, S, F);
        A[3] = 3;
        return {
          A: A,
          l: l
        };
      }
    } else {
      if (typeof TRACE === "function") TRACE(787, A, l, S, F);
      A[3] = 3;
      return {
        A: A,
        l: l
      };
    }
  } else {
    if (typeof TRACE === "function") TRACE(775, A, l, S, F);
    A[3] = 3;
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
function FR_735(A, l, S) {
  let F = false;
  let v6 = l[6],
    v7 = l[7],
    v12 = l[12],
    v13 = l[13],
    v14 = l[14];
  if (typeof TRACE === "function") TRACE(735, A, l, S, F);
  H3 = {};
  v6 = H3;
  v7 = new Function("a", "b", "return b in a ? a[b]: undefined");
  H3.get = new Function("a", "b", "return b in a ? a[b]: undefined");
  v12 = (H3?.["get"]).toString()?.length;
  v13 = BVM.toString();
  A[0] = (H3?.["get"]).toString()?.length;
  A[1] = 60;
  A[3] = ((H3?.["get"]).toString()?.length > 60);
  if (!((H3?.["get"]).toString()?.length > 60)) {
    if (typeof TRACE === "function") TRACE(777, A, l, S, F);
    if (typeof TRACE === "function") TRACE(778, A, l, S, F);
    A[0] = typeof __b?.zh;
    A[1] = "undefined";
    A[3] = (typeof __b?.zh !== "undefined");
    if (!(typeof __b?.zh !== "undefined")) {
      if (typeof TRACE === "function") TRACE(789, A, l, S, F);
      if (typeof TRACE === "function") TRACE(790, A, l, S, F);
      A[0] = -1;
      A[3] = (v13.indexOf("onsol") !== -1);
      if (!(v13.indexOf("onsol") !== -1)) {
        if (typeof TRACE === "function") TRACE(802, A, l, S, F);
        if (typeof TRACE === "function") TRACE(803, A, l, S, F);
        v14 = new Error()?.stack;
        A[0] = -1;
        A[3] = ((new Error()?.stack).indexOf("node") !== -1);
        if (!((new Error()?.stack).indexOf("node") !== -1)) {
          if (typeof TRACE === "function") TRACE(821, A, l, S, F);
          if (typeof TRACE === "function") TRACE(822, A, l, S, F);
          A[0] = -1;
          A[3] = (v14.indexOf("executeUserEntryPoint") !== -1);
          if (!(v14.indexOf("executeUserEntryPoint") !== -1)) {
            if (typeof TRACE === "function") TRACE(834, A, l, S, F);
            if (typeof TRACE === "function") TRACE(835, A, l, S, F);
            A[0] = -1;
            A[3] = ((Function?.prototype?.constructor).toString().indexOf("native") === -1);
            if (!((Function?.prototype?.constructor).toString().indexOf("native") === -1)) {
              if (typeof TRACE === "function") TRACE(854, A, l, S, F);
              if (typeof TRACE === "function") TRACE(855, A, l, S, F);
              A[0] = typeof window?.v_log;
              A[1] = "undefined";
              if (!(typeof window?.v_log !== "undefined")) {
                if (typeof TRACE === "function") TRACE(866, A, l, S, F);
                if (typeof TRACE === "function") TRACE(867, A, l, S, F);
                A[3] = 5;
                return {
                  A: A,
                  l: l
                };
              } else {
                if (typeof TRACE === "function") TRACE(864, A, l, S, F);
                A[3] = 3;
                return {
                  A: A,
                  l: l
                };
              }
            } else {
              if (typeof TRACE === "function") TRACE(852, A, l, S, F);
              A[3] = 3;
              return {
                A: A,
                l: l
              };
            }
          } else {
            if (typeof TRACE === "function") TRACE(832, A, l, S, F);
            A[3] = 3;
            return {
              A: A,
              l: l
            };
          }
        } else {
          if (typeof TRACE === "function") TRACE(819, A, l, S, F);
          A[3] = 3;
          return {
            A: A,
            l: l
          };
        }
      } else {
        if (typeof TRACE === "function") TRACE(800, A, l, S, F);
        A[3] = 3;
        return {
          A: A,
          l: l
        };
      }
    } else {
      if (typeof TRACE === "function") TRACE(787, A, l, S, F);
      A[3] = 3;
      return {
        A: A,
        l: l
      };
    }
  } else {
    if (typeof TRACE === "function") TRACE(775, A, l, S, F);
    A[3] = 3;
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
function FR_869(A, l, S) {
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
  if (typeof TRACE === "function") TRACE(869, A, l, S, F);
  v17 = "";
  v18 = v0?.length;
  v19 = v1?.length;
  v20 = __b?.a3;
  v21 = 0;
  A[0] = 0;
  L886: for (;;) {
    if (typeof TRACE === "function") TRACE(886, A, l, S, F);
    t0 = v21;
    t1 = v18;
    t2 = "" < v0;
    F = !!v0?.length;
    if (!v0?.length) break L886;
    if (typeof TRACE === "function") TRACE(891, A, l, S, F);
    t0 = v21;
    t1 = v0;
    t2 = v0.charCodeAt("");
    v22 = v0?.length;
    t3 = v21;
    t4 = v19;
    t5 = v1 % v1?.length;
    v23 = __b;
    t6 = __b;
    t7 = v1;
    t8 = 0 .charCodeAt(__b?.a3);
    v24 = 0 .charCodeAt(__b?.a3);
    t9 = v0?.length;
    t10 = 0 .charCodeAt(__b?.a3);
    t11 = v0?.length ^ 0 .charCodeAt(__b?.a3);
    t12 = v20;
    t13 = (v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20;
    v25 = ((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20);
    t14 = ((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20);
    v20 = ((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20);
    t15 = ((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20);
    t16 = String;
    t17 = String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20));
    v26 = String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20));
    t18 = v17;
    t19 = String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20));
    t20 = v17 + String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20));
    v17 = (t18 + String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20)));
    t21 = v21;
    t22 = 1;
    t23 = v21 + 1;
    v21 = (v21 + 1);
    S.push(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20));
    S.push((t18 + String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v20))));
    continue L886;
  }
  if (typeof TRACE === "function") TRACE(933, A, l, S, F);
  M_SET(__b, "a3", v20);
  A[0] = __b;
  A[3] = v17;
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