let H1, H2;
// lifted from js/payload.cvm.js -- operand-stack folding + structured control flow
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
    case 1832:
      return FR_1832(A, l, S);
    case 1905:
      return FR_1905(A, l, S);
    case 2039:
      return FR_2039(A, l, S);
    case 2079:
      return FR_2079(A, l, S);
    case 2146:
      return FR_2146(A, l, S);
    case 2227:
      return FR_2227(A, l, S);
    case 2289:
      return FR_2289(A, l, S);
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
    v44 = l[44],
    v45 = l[45],
    v46 = l[46],
    v47 = l[47];
  let v48 = l[48],
    v49 = l[49],
    v50 = l[50],
    v51 = l[51],
    v52 = l[52],
    v53 = l[53],
    v54 = l[54],
    v55 = l[55],
    v56 = l[56],
    v57 = l[57],
    v58 = l[58],
    v59 = l[59];
  let v60 = l[60],
    v62 = l[62],
    v63 = l[63],
    v64 = l[64],
    v65 = l[65],
    v66 = l[66],
    v67 = l[67],
    v68 = l[68],
    v69 = l[69],
    v70 = l[70],
    v71 = l[71];
  if (typeof TRACE === "function") TRACE(0, A, l, S, F);
  v0 = String.fromCharCode("8204");
  v1 = FR_1905(A, l, S);
  A[0] = FR_1905(A, l, S);
  A[1] = 2;
  A[3] = (FR_1905(A, l, S) < 2);
  if (FR_1905(A, l, S) < 2) {
    if (typeof TRACE === "function") TRACE(15, A, l, S, F);
    v2 = A[3];
    v3 = (1 << 13);
    v4 = (1 << 12);
    v5 = (1 << 15);
    v6 = (1 << 14);
    v7 = String.fromCharCode("8204");
    H1 = {};
    v8 = H1;
    v9 = new Function("a", "b", "return b in a ? a[b]: undefined");
    H1.get = new Function("a", "b", "return b in a ? a[b]: undefined");
    v10 = new Function("a", "b", "c", "a[b]=c;return true");
    H1.set = new Function("a", "b", "c", "a[b]=c;return true");
    v11 = new Proxy(window, H1);
    v12 = Object.keys(new Proxy(window, H1));
    S.push(new Function("a", "b", "return b in a ? a[b]: undefined"));
    S.push(new Function("a", "b", "c", "a[b]=c;return true"));
    if (Object.keys(new Proxy(window, H1)) < 40) {
      if (typeof TRACE === "function") TRACE(100, A, l, S, F);
      v3 |= (1 << 15);
      S.push((1 << 15));
      S.push((v3 | (1 << 15)));
    }
    if (typeof TRACE === "function") TRACE(110, A, l, S, F);
    if (typeof TRACE === "function") TRACE(111, A, l, S, F);
    A[3] = /*argc=1 */FR_2079(A, l, S);
    v13 = A[3];
    S.push(v12);
    S.push(A[3]);
    if (v13 === 1) {
      if (typeof TRACE === "function") TRACE(122, A, l, S, F);
      v3 |= (1 << 14);
      S.push((1 << 14));
      S.push((v3 | (1 << 14)));
    }
    if (typeof TRACE === "function") TRACE(132, A, l, S, F);
    if (typeof TRACE === "function") TRACE(133, A, l, S, F);
    if (v12.indexOf("top") === -1) {
      if (typeof TRACE === "function") TRACE(143, A, l, S, F);
      v3 |= (1 << 12);
      S.push((1 << 12));
      S.push((v3 | (1 << 12)));
    }
    if (typeof TRACE === "function") TRACE(153, A, l, S, F);
    if (typeof TRACE === "function") TRACE(154, A, l, S, F);
    if (v12.indexOf("customElements") === -1) {
      if (typeof TRACE === "function") TRACE(164, A, l, S, F);
      v3 |= (1 << 11);
      S.push((1 << 11));
      S.push((v3 | (1 << 11)));
    }
    if (typeof TRACE === "function") TRACE(174, A, l, S, F);
    if (typeof TRACE === "function") TRACE(175, A, l, S, F);
    if (v12.indexOf("name") === -1) {
      if (typeof TRACE === "function") TRACE(185, A, l, S, F);
      v3 |= (1 << 10);
      S.push((1 << 10));
      S.push((v3 | (1 << 10)));
    }
    if (typeof TRACE === "function") TRACE(195, A, l, S, F);
    if (typeof TRACE === "function") TRACE(196, A, l, S, F);
    if (v12.indexOf("self") === -1) {
      if (typeof TRACE === "function") TRACE(206, A, l, S, F);
      v3 |= (1 << 9);
      S.push((1 << 9));
      S.push((v3 | (1 << 9)));
    }
    if (typeof TRACE === "function") TRACE(216, A, l, S, F);
    if (typeof TRACE === "function") TRACE(217, A, l, S, F);
    if (v12.indexOf("print") === -1) {
      if (typeof TRACE === "function") TRACE(227, A, l, S, F);
      v3 |= (1 << 8);
      S.push((1 << 8));
      S.push((v3 | (1 << 8)));
    }
    if (typeof TRACE === "function") TRACE(237, A, l, S, F);
    if (typeof TRACE === "function") TRACE(238, A, l, S, F);
    if (v12.indexOf("open") === -1) {
      if (typeof TRACE === "function") TRACE(248, A, l, S, F);
      v3 |= (1 << 7);
      S.push((1 << 7));
      S.push((v3 | (1 << 7)));
    }
    if (typeof TRACE === "function") TRACE(258, A, l, S, F);
    if (typeof TRACE === "function") TRACE(259, A, l, S, F);
    if (v12.indexOf("_encrypt") === -1) {
      if (typeof TRACE === "function") TRACE(269, A, l, S, F);
      v3 |= (1 << 6);
      S.push((1 << 6));
      S.push((v3 | (1 << 6)));
    }
    if (typeof TRACE === "function") TRACE(279, A, l, S, F);
    if (typeof TRACE === "function") TRACE(280, A, l, S, F);
    if (v12.indexOf("__g") === -1) {
      if (typeof TRACE === "function") TRACE(290, A, l, S, F);
      v3 |= (1 << 5);
      S.push((1 << 5));
      S.push((v3 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(300, A, l, S, F);
    if (typeof TRACE === "function") TRACE(301, A, l, S, F);
    v14 = new Proxy(Function, v8);
    v15 = new new Proxy(Function, v8)("window={};document={};return document");
    v16 = new new Proxy(Function, v8)("window={};document={};return document")();
    v17 = new new Proxy(Function, v8)("window={};document={};return document")()?.URL;
    S.push(new new Proxy(Function, v8)("window={};document={};return document"));
    if ((new new Proxy(Function, v8)("window={};document={};return document")()?.URL).indexOf("zhihu") === -1) {
      if (typeof TRACE === "function") TRACE(333, A, l, S, F);
      v3 |= (1 << 4);
      S.push((1 << 4));
      S.push((v3 | (1 << 4)));
    }
    if (typeof TRACE === "function") TRACE(343, A, l, S, F);
    if (typeof TRACE === "function") TRACE(344, A, l, S, F);
    v18 = v16?.all;
    v19 = typeof v16?.all;
    if (typeof v16?.all !== "undefined") {
      if (typeof TRACE === "function") TRACE(356, A, l, S, F);
      v3 |= (1 << 3);
      S.push((1 << 3));
      S.push((v3 | (1 << 3)));
    }
    if (typeof TRACE === "function") TRACE(366, A, l, S, F);
    if (typeof TRACE === "function") TRACE(367, A, l, S, F);
    v20 = v18?.length;
    if (typeof v18?.length !== "number") {
      if (typeof TRACE === "function") TRACE(377, A, l, S, F);
      v3 |= (1 << 2);
      S.push((1 << 2));
      S.push((v3 | (1 << 2)));
    }
    if (typeof TRACE === "function") TRACE(387, A, l, S, F);
    if (typeof TRACE === "function") TRACE(388, A, l, S, F);
    v14 = new Proxy(Function, v8);
    v21 = new new Proxy(Function, v8)("try{window={};document={};return document.all()}catch(_){}");
    v22 = new new Proxy(Function, v8)("try{window={};document={};return document.all()}catch(_){}")();
    if (typeof new new Proxy(Function, v8)("try{window={};document={};return document.all()}catch(_){}")() !== "object") {
      if (typeof TRACE === "function") TRACE(411, A, l, S, F);
      v3 |= (1 << 1);
      S.push((1 << 1));
      S.push((v3 | (1 << 1)));
    }
    if (typeof TRACE === "function") TRACE(421, A, l, S, F);
    if (typeof TRACE === "function") TRACE(422, A, l, S, F);
    if (v20 < 4) {
      if (typeof TRACE === "function") TRACE(427, A, l, S, F);
      v3 |= 1;
      S.push(1);
      S.push((v3 | 1));
    }
    if (typeof TRACE === "function") TRACE(435, A, l, S, F);
    if (typeof TRACE === "function") TRACE(436, A, l, S, F);
    v23 = v18?.[0];
    if (v18?.[0]?.tagName !== "HTML") {
      if (typeof TRACE === "function") TRACE(448, A, l, S, F);
      v4 |= (1 << 15);
      S.push((1 << 15));
      S.push((v4 | (1 << 15)));
    }
    if (typeof TRACE === "function") TRACE(458, A, l, S, F);
    if (typeof TRACE === "function") TRACE(459, A, l, S, F);
    if (v23.toString().indexOf("HTMLHtmlElement") === -1) {
      if (typeof TRACE === "function") TRACE(471, A, l, S, F);
      v4 |= (1 << 14);
      S.push((1 << 14));
      S.push((v4 | (1 << 14)));
    }
    if (typeof TRACE === "function") TRACE(481, A, l, S, F);
    if (typeof TRACE === "function") TRACE(482, A, l, S, F);
    v24 = v23.getElementsByTagName("script");
    if (v23.getElementsByTagName("script").toString().indexOf("Collection") === -1) {
      if (typeof TRACE === "function") TRACE(500, A, l, S, F);
      v4 |= (1 << 13);
      S.push((1 << 13));
      S.push((v4 | (1 << 13)));
    }
    if (typeof TRACE === "function") TRACE(510, A, l, S, F);
    if (typeof TRACE === "function") TRACE(511, A, l, S, F);
    v25 = (v16?.createElement).bind(v16);
    v26 = (v16?.createElement).bind(v16)("script");
    if (typeof (v16?.createElement).bind(v16)("script") === "undefined") {
      if (typeof TRACE === "function") TRACE(530, A, l, S, F);
      v4 |= (1 << 11);
      S.push((1 << 11));
      S.push((v4 | (1 << 11)));
    }
    if (typeof TRACE === "function") TRACE(540, A, l, S, F);
    if (typeof TRACE === "function") TRACE(541, A, l, S, F);
    if (v26?.tagName !== "SCRIPT") {
      if (typeof TRACE === "function") TRACE(548, A, l, S, F);
      v4 |= (1 << 10);
      S.push((1 << 10));
      S.push((v4 | (1 << 10)));
    }
    if (typeof TRACE === "function") TRACE(558, A, l, S, F);
    if (typeof TRACE === "function") TRACE(559, A, l, S, F);
    v27 = v26?.style;
    if (typeof v26?.style === "undefined") {
      if (typeof TRACE === "function") TRACE(569, A, l, S, F);
      v4 |= (1 << 9);
      S.push((1 << 9));
      S.push((v4 | (1 << 9)));
    }
    if (typeof TRACE === "function") TRACE(579, A, l, S, F);
    if (typeof TRACE === "function") TRACE(580, A, l, S, F);
    v28 = new v14(SRC0);
    v28 = new v14(SRC0)();
    S.push(new v14(SRC0)());
    if (new v14(SRC0)() !== 0) {
      if (typeof TRACE === "function") TRACE(594, A, l, S, F);
      v4 |= (1 << 8);
      S.push((1 << 8));
      S.push((v4 | (1 << 8)));
    }
    if (typeof TRACE === "function") TRACE(604, A, l, S, F);
    if (typeof TRACE === "function") TRACE(605, A, l, S, F);
    v29 = new v14(SRC1);
    v29 = new v14(SRC1)();
    S.push(new v14(SRC1)());
    if (new v14(SRC1)() !== "A") {
      if (typeof TRACE === "function") TRACE(619, A, l, S, F);
      v4 |= (1 << 7);
      S.push((1 << 7));
      S.push((v4 | (1 << 7)));
    }
    if (typeof TRACE === "function") TRACE(629, A, l, S, F);
    if (typeof TRACE === "function") TRACE(630, A, l, S, F);
    if (typeof document?.baseURI === "undefined") {
      if (typeof TRACE === "function") TRACE(639, A, l, S, F);
      v4 |= (1 << 6);
      S.push((1 << 6));
      S.push((v4 | (1 << 6)));
    }
    if (typeof TRACE === "function") TRACE(649, A, l, S, F);
    if (typeof TRACE === "function") TRACE(650, A, l, S, F);
    if ((document?.baseURI).indexOf("zhihu") === -1) {
      if (typeof TRACE === "function") TRACE(663, A, l, S, F);
      v4 |= (1 << 5);
      S.push((1 << 5));
      S.push((v4 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(673, A, l, S, F);
    if (typeof TRACE === "function") TRACE(674, A, l, S, F);
    if (typeof document?.charset === "undefined") {
      if (typeof TRACE === "function") TRACE(683, A, l, S, F);
      v4 |= (1 << 4);
      S.push((1 << 4));
      S.push((v4 | (1 << 4)));
    }
    if (typeof TRACE === "function") TRACE(693, A, l, S, F);
    if (typeof TRACE === "function") TRACE(694, A, l, S, F);
    if (typeof document?.body === "undefined") {
      if (typeof TRACE === "function") TRACE(703, A, l, S, F);
      v4 |= (1 << 3);
      S.push((1 << 3));
      S.push((v4 | (1 << 3)));
    }
    if (typeof TRACE === "function") TRACE(713, A, l, S, F);
    if (typeof TRACE === "function") TRACE(714, A, l, S, F);
    if ((document?.body).toString().indexOf("HTMLBodyElement") === -1) {
      if (typeof TRACE === "function") TRACE(729, A, l, S, F);
      v4 |= (1 << 2);
      S.push((1 << 2));
      S.push((v4 | (1 << 2)));
    }
    if (typeof TRACE === "function") TRACE(739, A, l, S, F);
    if (typeof TRACE === "function") TRACE(740, A, l, S, F);
    v30 = v25("canvas");
    if (typeof v25("canvas") === "undefined") {
      if (typeof TRACE === "function") TRACE(751, A, l, S, F);
      v4 |= (1 << 1);
      S.push((1 << 1));
      S.push((v4 | (1 << 1)));
    }
    if (typeof TRACE === "function") TRACE(761, A, l, S, F);
    if (typeof TRACE === "function") TRACE(762, A, l, S, F);
    if (v30.toString().indexOf("HTMLCanvasElement") === -1) {
      if (typeof TRACE === "function") TRACE(774, A, l, S, F);
      v4 |= 1;
      S.push(1);
      S.push((v4 | 1));
    }
    if (typeof TRACE === "function") TRACE(782, A, l, S, F);
    if (typeof TRACE === "function") TRACE(783, A, l, S, F);
    if (typeof v30?.getContext === "undefined") {
      if (typeof TRACE === "function") TRACE(791, A, l, S, F);
      v5 |= (1 << 14);
      S.push((1 << 14));
      S.push((v5 | (1 << 14)));
    }
    if (typeof TRACE === "function") TRACE(801, A, l, S, F);
    if (typeof TRACE === "function") TRACE(802, A, l, S, F);
    if (v30.getContext("2d").toString().indexOf("CanvasRenderingContext2D") === -1) {
      if (typeof TRACE === "function") TRACE(818, A, l, S, F);
      v5 |= (1 << 13);
      S.push((1 << 13));
      S.push((v5 | (1 << 13)));
    }
    if (typeof TRACE === "function") TRACE(828, A, l, S, F);
    if (typeof TRACE === "function") TRACE(829, A, l, S, F);
    if (typeof v30?.width === "undefined") {
      if (typeof TRACE === "function") TRACE(837, A, l, S, F);
      v5 |= (1 << 12);
      S.push((1 << 12));
      S.push((v5 | (1 << 12)));
    }
    if (typeof TRACE === "function") TRACE(847, A, l, S, F);
    if (typeof TRACE === "function") TRACE(848, A, l, S, F);
    if (typeof v30?.height === "undefined") {
      if (typeof TRACE === "function") TRACE(856, A, l, S, F);
      v5 |= (1 << 11);
      S.push((1 << 11));
      S.push((v5 | (1 << 11)));
    }
    if (typeof TRACE === "function") TRACE(866, A, l, S, F);
    if (typeof TRACE === "function") TRACE(867, A, l, S, F);
    if (v30?.tagName !== "CANVAS") {
      if (typeof TRACE === "function") TRACE(874, A, l, S, F);
      v5 |= (1 << 10);
      S.push((1 << 10));
      S.push((v5 | (1 << 10)));
    }
    if (typeof TRACE === "function") TRACE(884, A, l, S, F);
    if (typeof TRACE === "function") TRACE(885, A, l, S, F);
    if ((v30?.outerHTML).indexOf("canvas") === -1) {
      if (typeof TRACE === "function") TRACE(897, A, l, S, F);
      v5 |= (1 << 9);
      S.push((1 << 9));
      S.push((v5 | (1 << 9)));
    }
    if (typeof TRACE === "function") TRACE(907, A, l, S, F);
    if (typeof TRACE === "function") TRACE(908, A, l, S, F);
    v31 = v30.toDataURL();
    if (v30.toDataURL()?.length < 50) {
      if (typeof TRACE === "function") TRACE(919, A, l, S, F);
      v5 |= (1 << 8);
      S.push((1 << 8));
      S.push((v5 | (1 << 8)));
    }
    if (typeof TRACE === "function") TRACE(929, A, l, S, F);
    if (typeof TRACE === "function") TRACE(930, A, l, S, F);
    if (typeof window?.buffer !== "undefined") {
      if (typeof TRACE === "function") TRACE(939, A, l, S, F);
      v5 |= (1 << 7);
      S.push((1 << 7));
      S.push((v5 | (1 << 7)));
    }
    if (typeof TRACE === "function") TRACE(949, A, l, S, F);
    if (typeof TRACE === "function") TRACE(950, A, l, S, F);
    if (typeof window?.emit !== "undefined") {
      if (typeof TRACE === "function") TRACE(959, A, l, S, F);
      v5 |= (1 << 6);
      S.push((1 << 6));
      S.push((v5 | (1 << 6)));
    }
    if (typeof TRACE === "function") TRACE(969, A, l, S, F);
    if (typeof TRACE === "function") TRACE(970, A, l, S, F);
    if (typeof window?.callPhantom !== "undefined") {
      if (typeof TRACE === "function") TRACE(979, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(989, A, l, S, F);
    if (typeof TRACE === "function") TRACE(990, A, l, S, F);
    if (typeof window?.__phantomas !== "undefined") {
      if (typeof TRACE === "function") TRACE(999, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1009, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1010, A, l, S, F);
    if (typeof window?._phantom !== "undefined") {
      if (typeof TRACE === "function") TRACE(1019, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1029, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1030, A, l, S, F);
    if (typeof window?.WebPage !== "undefined") {
      if (typeof TRACE === "function") TRACE(1039, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1049, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1050, A, l, S, F);
    if (typeof window?.fxdriver_id !== "undefined") {
      if (typeof TRACE === "function") TRACE(1059, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1069, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1070, A, l, S, F);
    if (typeof window?.__fxdriver_unwrapped !== "undefined") {
      if (typeof TRACE === "function") TRACE(1079, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1089, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1090, A, l, S, F);
    if (typeof window?.ubot !== "undefined") {
      if (typeof TRACE === "function") TRACE(1099, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1109, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1110, A, l, S, F);
    if (typeof window?.CasperError !== "undefined") {
      if (typeof TRACE === "function") TRACE(1119, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1129, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1130, A, l, S, F);
    if (typeof window?.casper !== "undefined") {
      if (typeof TRACE === "function") TRACE(1139, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1149, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1150, A, l, S, F);
    if (typeof window?.patchRequire !== "undefined") {
      if (typeof TRACE === "function") TRACE(1159, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1169, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1170, A, l, S, F);
    if (typeof document?.$cdc_asdjflasutopfhvcZLmcfl_ !== "undefined") {
      if (typeof TRACE === "function") TRACE(1179, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1189, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1190, A, l, S, F);
    if (navigator?.webdriver === "true") {
      if (typeof TRACE === "function") TRACE(1198, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1208, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1209, A, l, S, F);
    if (typeof document?.__webdriver_script_fn !== "undefined") {
      if (typeof TRACE === "function") TRACE(1218, A, l, S, F);
      v5 |= (1 << 5);
      S.push((1 << 5));
      S.push((v5 | (1 << 5)));
    }
    if (typeof TRACE === "function") TRACE(1228, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1229, A, l, S, F);
    if (typeof v11?._resourceLoader !== "undefined") {
      if (typeof TRACE === "function") TRACE(1237, A, l, S, F);
      v5 |= (1 << 4);
      S.push((1 << 4));
      S.push((v5 | (1 << 4)));
    }
    if (typeof TRACE === "function") TRACE(1247, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1248, A, l, S, F);
    if (typeof v11?._sessionHistory !== "undefined") {
      if (typeof TRACE === "function") TRACE(1256, A, l, S, F);
      v5 |= (1 << 4);
      S.push((1 << 4));
      S.push((v5 | (1 << 4)));
    }
    if (typeof TRACE === "function") TRACE(1266, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1267, A, l, S, F);
    if (typeof v11?._virtualConsole !== "undefined") {
      if (typeof TRACE === "function") TRACE(1275, A, l, S, F);
      v5 |= (1 << 4);
      S.push((1 << 4));
      S.push((v5 | (1 << 4)));
    }
    if (typeof TRACE === "function") TRACE(1285, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1286, A, l, S, F);
    v32 = localStorage?.setItem;
    if (typeof localStorage?.setItem === "undefined") {
      if (typeof TRACE === "function") TRACE(1297, A, l, S, F);
      v5 |= (1 << 3);
      S.push((1 << 3));
      S.push((v5 | (1 << 3)));
    }
    if (typeof TRACE === "function") TRACE(1307, A, l, S, F);
    if (F) {} else {
      if (typeof TRACE === "function") TRACE(1308, A, l, S, F);
      A[3] = /*argc=1 */FR_2079(A, l, S);
      v33 = A[3];
      S.push(localStorage);
      if (v33 === 1) {
        if (typeof TRACE === "function") TRACE(1319, A, l, S, F);
        v5 |= (1 << 2);
        S.push((1 << 2));
        S.push((v5 | (1 << 2)));
      }
      if (typeof TRACE === "function") TRACE(1329, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1330, A, l, S, F);
      A[3] = /*argc=1 */FR_2079(A, l, S);
      v34 = A[3];
      S.push(sessionStorage);
      if (v34 === 1) {
        if (typeof TRACE === "function") TRACE(1341, A, l, S, F);
        v5 |= (1 << 1);
        S.push((1 << 1));
        S.push((v5 | (1 << 1)));
      }
      if (typeof TRACE === "function") TRACE(1351, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1352, A, l, S, F);
      v35 = new Proxy(screen, v8);
      A[3] = /*argc=1 */FR_1(A, l, S);
      v36 = A[3];
      S.push(new Proxy(screen, v8));
      if (v36 === 1) {
        if (typeof TRACE === "function") TRACE(1371, A, l, S, F);
        v5 |= 1;
        S.push(1);
        S.push((v5 | 1));
      }
      if (typeof TRACE === "function") TRACE(1379, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1380, A, l, S, F);
      v37 = new v14("try{var a=0;var b=new Error;Object.defineProperty(b,\"stack\",{get:function(){a++}});console.debug(b);b.stack;return a>1}catch(_){return true}");
      v38 = new v14("try{var a=0;var b=new Error;Object.defineProperty(b,\"stack\",{get:function(){a++}});console.debug(b);b.stack;return a>1}catch(_){return true}")();
      S.push(new v14("try{var a=0;var b=new Error;Object.defineProperty(b,\"stack\",{get:function(){a++}});console.debug(b);b.stack;return a>1}catch(_){return true}")());
      if (new v14("try{var a=0;var b=new Error;Object.defineProperty(b,\"stack\",{get:function(){a++}});console.debug(b);b.stack;return a>1}catch(_){return true}")()) {
        if (typeof TRACE === "function") TRACE(1392, A, l, S, F);
        v6 |= (1 << 15);
        S.push((1 << 15));
        S.push((v6 | (1 << 15)));
      }
      if (typeof TRACE === "function") TRACE(1402, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1403, A, l, S, F);
      v39 = new Document();
      v40 = new Document()?.all;
      if (typeof new Document()?.all !== "undefined") {
        if (typeof TRACE === "function") TRACE(1417, A, l, S, F);
        v6 |= (1 << 13);
        S.push((1 << 13));
        S.push((v6 | (1 << 13)));
      }
      if (typeof TRACE === "function") TRACE(1427, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1428, A, l, S, F);
      if (typeof v40?.length !== "number") {
        if (typeof TRACE === "function") TRACE(1436, A, l, S, F);
        v6 |= (1 << 12);
        S.push((1 << 12));
        S.push((v6 | (1 << 12)));
      }
      if (typeof TRACE === "function") TRACE(1446, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1447, A, l, S, F);
      v41 = new v14("try{return new Document().all()}catch(_){}");
      v42 = new v14("try{return new Document().all()}catch(_){}")();
      S.push(new v14("try{return new Document().all()}catch(_){}"));
      S.push(new v14("try{return new Document().all()}catch(_){}")());
      if (typeof new v14("try{return new Document().all()}catch(_){}")() === "undefined") {
        if (typeof TRACE === "function") TRACE(1463, A, l, S, F);
        v6 |= (1 << 11);
        S.push((1 << 11));
        S.push((v6 | (1 << 11)));
      }
      if (typeof TRACE === "function") TRACE(1473, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1474, A, l, S, F);
      if (v40.toString().indexOf("HTMLAllCollection") === -1) {
        if (typeof TRACE === "function") TRACE(1486, A, l, S, F);
        v6 |= (1 << 10);
        S.push((1 << 10));
        S.push((v6 | (1 << 10)));
      }
      if (typeof TRACE === "function") TRACE(1496, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1497, A, l, S, F);
      v43 = new v14("try{return process}catch(_){}");
      v44 = new v14("try{return process}catch(_){}")();
      if (typeof new v14("try{return process}catch(_){}")() !== "undefined") {
        if (typeof TRACE === "function") TRACE(1511, A, l, S, F);
        v6 |= (1 << 9);
        S.push((1 << 9));
        S.push((v6 | (1 << 9)));
      }
      if (typeof TRACE === "function") TRACE(1521, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1522, A, l, S, F);
      v45 = new v14("try{return global}catch(_){}");
      v46 = new v14("try{return global}catch(_){}")();
      if (typeof new v14("try{return global}catch(_){}")() !== "undefined") {
        if (typeof TRACE === "function") TRACE(1536, A, l, S, F);
        v6 |= (1 << 8);
        S.push((1 << 8));
        S.push((v6 | (1 << 8)));
      }
      if (typeof TRACE === "function") TRACE(1546, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1547, A, l, S, F);
      if (window?.document !== v16) {
        if (typeof TRACE === "function") TRACE(1555, A, l, S, F);
        v6 |= (1 << 7);
        S.push((1 << 7));
        S.push((v6 | (1 << 7)));
      }
      if (typeof TRACE === "function") TRACE(1565, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1566, A, l, S, F);
      if (typeof window?.global !== "undefined") {
        if (typeof TRACE === "function") TRACE(1575, A, l, S, F);
        v6 |= (1 << 6);
        S.push((1 << 6));
        S.push((v6 | (1 << 6)));
      }
      if (typeof TRACE === "function") TRACE(1585, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1586, A, l, S, F);
      if (setTimeout.toString().indexOf("native") === -1) {
        if (typeof TRACE === "function") TRACE(1599, A, l, S, F);
        v6 |= (1 << 5);
        S.push((1 << 5));
        S.push((v6 | (1 << 5)));
      }
      if (typeof TRACE === "function") TRACE(1609, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1610, A, l, S, F);
      if (setInterval.toString().indexOf("native") === -1) {
        if (typeof TRACE === "function") TRACE(1623, A, l, S, F);
        v6 |= (1 << 4);
        S.push((1 << 4));
        S.push((v6 | (1 << 4)));
      }
      if (typeof TRACE === "function") TRACE(1633, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1634, A, l, S, F);
      v47 = window?.URL;
      v48 = new (window?.URL)("https://www.zhihu.com");
      if (typeof new (window?.URL)("https://www.zhihu.com") === "undefined") {
        if (typeof TRACE === "function") TRACE(1650, A, l, S, F);
        v6 |= (1 << 3);
        S.push((1 << 3));
        S.push((v6 | (1 << 3)));
      }
      if (typeof TRACE === "function") TRACE(1660, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1661, A, l, S, F);
      if ((window?.stop).toString().indexOf("native") === -1) {
        if (typeof TRACE === "function") TRACE(1676, A, l, S, F);
        v6 |= (1 << 2);
        S.push((1 << 2));
        S.push((v6 | (1 << 2)));
      }
      if (typeof TRACE === "function") TRACE(1686, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1687, A, l, S, F);
      v49 = window.atob("cmV0dXJuIHdpbmRvdy5NZWRpYVNvdXJjZSAmJiB3aW5kb3cuTWVkaWFTb3VyY2UuaXNUeXBlU3VwcG9ydGVkICYmIHdpbmRvdy5NZWRpYVNvdXJjZS5pc1R5cGVTdXBwb3J0ZWQoJ3ZpZGVvL21wNDsgY29kZWNzPSJhdmMxLjQyRTAxRSInKQ==");
      v50 = new v14(window.atob("cmV0dXJuIHdpbmRvdy5NZWRpYVNvdXJjZSAmJiB3aW5kb3cuTWVkaWFTb3VyY2UuaXNUeXBlU3VwcG9ydGVkICYmIHdpbmRvdy5NZWRpYVNvdXJjZS5pc1R5cGVTdXBwb3J0ZWQoJ3ZpZGVvL21wNDsgY29kZWNzPSJhdmMxLjQyRTAxRSInKQ=="));
      v51 = new v14(window.atob("cmV0dXJuIHdpbmRvdy5NZWRpYVNvdXJjZSAmJiB3aW5kb3cuTWVkaWFTb3VyY2UuaXNUeXBlU3VwcG9ydGVkICYmIHdpbmRvdy5NZWRpYVNvdXJjZS5pc1R5cGVTdXBwb3J0ZWQoJ3ZpZGVvL21wNDsgY29kZWNzPSJhdmMxLjQyRTAxRSInKQ=="))();
      if (new v14(window.atob("cmV0dXJuIHdpbmRvdy5NZWRpYVNvdXJjZSAmJiB3aW5kb3cuTWVkaWFTb3VyY2UuaXNUeXBlU3VwcG9ydGVkICYmIHdpbmRvdy5NZWRpYVNvdXJjZS5pc1R5cGVTdXBwb3J0ZWQoJ3ZpZGVvL21wNDsgY29kZWNzPSJhdmMxLjQyRTAxRSInKQ=="))() !== "true") {
        if (typeof TRACE === "function") TRACE(1707, A, l, S, F);
        v6 |= (1 << 1);
        S.push((1 << 1));
        S.push((v6 | (1 << 1)));
      }
      if (typeof TRACE === "function") TRACE(1717, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1718, A, l, S, F);
      if (window?.top !== window) {
        if (typeof TRACE === "function") TRACE(1727, A, l, S, F);
        v6 |= 1;
        S.push(1);
        S.push((v6 | 1));
      }
      if (typeof TRACE === "function") TRACE(1735, A, l, S, F);
    }
    if (typeof TRACE === "function") TRACE(1736, A, l, S, F);
    v52 = v3.toString(16);
    v53 = v4.toString(16);
    v54 = v5.toString(16);
    v55 = v6.toString(16);
    A[3] = FR_2227(A, l, S);
    v56 = A[3];
    A[3] = FR_2289(A, l, S);
    v57 = A[3];
    v58 = (new Error()?.stack).toString();
    v56 = (v56 + v57);
    A[3] = /*argc=2 */FR_1832(A, l, S);
    v56 = A[3];
    v59 = (((v3.toString(16) + v4.toString(16)) + v5.toString(16)) + v6.toString(16));
    A[3] = /*argc=2 */FR_1832(A, l, S);
    v59 = A[3];
    v58 = window.btoa((new Error()?.stack).toString());
    v60 = (((((v56 + v7) + v59) + v7) + window.btoa((new Error()?.stack).toString())) + v7);
    M_SET(__b, "zh", (((((v56 + v7) + v59) + v7) + window.btoa((new Error()?.stack).toString())) + v7));
    S.push((v56 + v57));
    S.push((v56 + v57));
    S.push("acc7471d3eb9bc30");
    S.push(A[3]);
    S.push((((v3.toString(16) + v4.toString(16)) + v5.toString(16)) + v6.toString(16)));
    S.push("f25b8434cca9a1f5");
    S.push(A[3]);
    S.push(window.btoa((new Error()?.stack).toString()));
    S.push((((((v56 + v7) + v59) + v7) + window.btoa((new Error()?.stack).toString())) + v7));
  }
  if (typeof TRACE === "function") TRACE(1830, A, l, S, F);
  if (typeof TRACE === "function") TRACE(1831, A, l, S, F);
  if (typeof TRACE === "function") TRACE(1832, A, l, S, F);
  v62 = "";
  v63 = v0?.length;
  v64 = v1?.length;
  v65 = __b?.a3;
  v66 = 0;
  A[0] = 0;
  L1849: for (;;) {
    if (typeof TRACE === "function") TRACE(1849, A, l, S, F);
    t0 = v66;
    t1 = v63;
    t2 = "" < v0;
    F = !!v0?.length;
    if (!v0?.length) break L1849;
    if (typeof TRACE === "function") TRACE(1854, A, l, S, F);
    t0 = v66;
    t1 = v0;
    t2 = v0.charCodeAt("");
    v67 = v0?.length;
    t3 = v66;
    t4 = v64;
    t5 = v1 % v1?.length;
    v68 = __b;
    t6 = __b;
    t7 = v1;
    t8 = 0 .charCodeAt(__b?.a3);
    v69 = t8;
    t9 = v0?.length;
    t10 = t8;
    t11 = t9 ^ t10;
    t12 = v65;
    t13 = t11 ^ t12;
    v70 = t13;
    t14 = t13;
    v65 = t14;
    t15 = t13;
    t16 = String;
    t17 = t16.fromCharCode(t15);
    v71 = t17;
    t18 = v62;
    t19 = t17;
    t20 = t18 + t19;
    v62 = t20;
    t21 = v66;
    t22 = 1;
    t23 = t21 + t22;
    v66 = t23;
    S.push(t14);
    S.push(t20);
    continue L1849;
  }
  if (typeof TRACE === "function") TRACE(1896, A, l, S, F);
  M_SET(__b, "a3", v65);
  A[0] = __b;
  A[3] = v62;
  return {
    A: A,
    l: l
  };
  return {
    A: A,
    l: l
  };
}
function FR_1832(A, l, S) {
  let F = false;
  let v0 = l[0],
    v1 = l[1],
    v62 = l[62],
    v63 = l[63],
    v64 = l[64],
    v65 = l[65],
    v66 = l[66],
    v67 = l[67],
    v68 = l[68],
    v69 = l[69],
    v70 = l[70],
    v71 = l[71];
  if (typeof TRACE === "function") TRACE(1832, A, l, S, F);
  v62 = "";
  v63 = v0?.length;
  v64 = v1?.length;
  v65 = __b?.a3;
  v66 = 0;
  A[0] = 0;
  L1849: for (;;) {
    if (typeof TRACE === "function") TRACE(1849, A, l, S, F);
    t0 = v66;
    t1 = v63;
    t2 = "" < v0;
    F = !!v0?.length;
    if (!v0?.length) break L1849;
    if (typeof TRACE === "function") TRACE(1854, A, l, S, F);
    t0 = v66;
    t1 = v0;
    t2 = v0.charCodeAt("");
    v67 = v0?.length;
    t3 = v66;
    t4 = v64;
    t5 = v1 % v1?.length;
    v68 = __b;
    t6 = __b;
    t7 = v1;
    t8 = 0 .charCodeAt(__b?.a3);
    v69 = 0 .charCodeAt(__b?.a3);
    t9 = v0?.length;
    t10 = 0 .charCodeAt(__b?.a3);
    t11 = v0?.length ^ 0 .charCodeAt(__b?.a3);
    t12 = v65;
    t13 = (v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65;
    v70 = ((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65);
    t14 = ((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65);
    v65 = ((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65);
    t15 = ((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65);
    t16 = String;
    t17 = String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65));
    v71 = String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65));
    t18 = v62;
    t19 = String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65));
    t20 = v62 + String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65));
    v62 = (v62 + String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65)));
    t21 = v66;
    t22 = 1;
    t23 = v66 + 1;
    v66 = (t21 + t22);
    S.push(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65));
    S.push((v62 + String.fromCharCode(((v0?.length ^ 0 .charCodeAt(__b?.a3)) ^ v65))));
    continue L1849;
  }
  if (typeof TRACE === "function") TRACE(1896, A, l, S, F);
  M_SET(__b, "a3", v65);
  A[0] = __b;
  A[3] = v62;
  return {
    A: A,
    l: l
  };
  return {
    A: A,
    l: l
  };
}
function FR_1905(A, l, S) {
  let F = false;
  let v10 = l[10],
    v11 = l[11],
    v60 = l[60],
    v72 = l[72],
    v73 = l[73];
  if (typeof TRACE === "function") TRACE(1905, A, l, S, F);
  H2 = {};
  v10 = H2;
  v11 = new Function("a", "b", "return b in a ? a[b]: undefined");
  H2.get = new Function("a", "b", "return b in a ? a[b]: undefined");
  v72 = (H2?.["get"]).toString()?.length;
  v73 = CVM.toString();
  A[0] = (H2?.["get"]).toString()?.length;
  A[1] = 60;
  A[3] = ((H2?.["get"]).toString()?.length > 60);
  if (!((H2?.["get"]).toString()?.length > 60)) {
    if (typeof TRACE === "function") TRACE(1947, A, l, S, F);
    if (typeof TRACE === "function") TRACE(1948, A, l, S, F);
    A[0] = typeof __b?.zh;
    A[1] = "undefined";
    A[3] = (typeof __b?.zh !== "undefined");
    if (!(typeof __b?.zh !== "undefined")) {
      if (typeof TRACE === "function") TRACE(1959, A, l, S, F);
      if (typeof TRACE === "function") TRACE(1960, A, l, S, F);
      A[0] = -1;
      A[3] = (v73.indexOf("onsol") !== -1);
      if (!(v73.indexOf("onsol") !== -1)) {
        if (typeof TRACE === "function") TRACE(1972, A, l, S, F);
        if (typeof TRACE === "function") TRACE(1973, A, l, S, F);
        v60 = new Error()?.stack;
        A[0] = -1;
        A[3] = ((new Error()?.stack).indexOf("node") !== -1);
        if (!((new Error()?.stack).indexOf("node") !== -1)) {
          if (typeof TRACE === "function") TRACE(1991, A, l, S, F);
          if (typeof TRACE === "function") TRACE(1992, A, l, S, F);
          A[0] = -1;
          A[3] = (v60.indexOf("executeUserEntryPoint") !== -1);
          if (!(v60.indexOf("executeUserEntryPoint") !== -1)) {
            if (typeof TRACE === "function") TRACE(2004, A, l, S, F);
            if (typeof TRACE === "function") TRACE(2005, A, l, S, F);
            A[0] = -1;
            A[3] = ((Function?.prototype?.constructor).toString().indexOf("native") === -1);
            if (!((Function?.prototype?.constructor).toString().indexOf("native") === -1)) {
              if (typeof TRACE === "function") TRACE(2024, A, l, S, F);
              if (typeof TRACE === "function") TRACE(2025, A, l, S, F);
              A[0] = typeof window?.v_log;
              A[1] = "undefined";
              if (!(typeof window?.v_log !== "undefined")) {
                if (typeof TRACE === "function") TRACE(2036, A, l, S, F);
                if (typeof TRACE === "function") TRACE(2037, A, l, S, F);
                A[3] = 1;
                return {
                  A: A,
                  l: l
                };
              } else {
                if (typeof TRACE === "function") TRACE(2034, A, l, S, F);
                A[3] = 2;
                return {
                  A: A,
                  l: l
                };
              }
            } else {
              if (typeof TRACE === "function") TRACE(2022, A, l, S, F);
              A[3] = 2;
              return {
                A: A,
                l: l
              };
            }
          } else {
            if (typeof TRACE === "function") TRACE(2002, A, l, S, F);
            A[3] = 2;
            return {
              A: A,
              l: l
            };
          }
        } else {
          if (typeof TRACE === "function") TRACE(1989, A, l, S, F);
          A[3] = 2;
          return {
            A: A,
            l: l
          };
        }
      } else {
        if (typeof TRACE === "function") TRACE(1970, A, l, S, F);
        A[3] = 2;
        return {
          A: A,
          l: l
        };
      }
    } else {
      if (typeof TRACE === "function") TRACE(1957, A, l, S, F);
      A[3] = 2;
      return {
        A: A,
        l: l
      };
    }
  } else {
    if (typeof TRACE === "function") TRACE(1945, A, l, S, F);
    A[3] = 2;
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
function FR_2039(A, l, S) {
  let F = false;
  let v0 = l[0],
    v75 = l[75],
    v76 = l[76];
  if (typeof TRACE === "function") TRACE(2039, A, l, S, F);
  v75 = v0?.length;
  A[0] = v0;
  A[1] = 1;
  A[3] = (v0 < 1);
  if (!(v0 < 1)) {
    if (typeof TRACE === "function") TRACE(2057, A, l, S, F);
    if (typeof TRACE === "function") TRACE(2058, A, l, S, F);
    v76 = v0.getItem("zseCk");
    A[0] = v0.getItem("zseCk");
    A[1] = "zseCk";
    A[3] = (v0.getItem("zseCk") !== "zseCk");
    if (!(v0.getItem("zseCk") !== "zseCk")) {
      if (typeof TRACE === "function") TRACE(2071, A, l, S, F);
      if (typeof TRACE === "function") TRACE(2072, A, l, S, F);
      A[0] = v0;
      A[3] = 2;
      return {
        A: A,
        l: l
      };
    } else {
      if (typeof TRACE === "function") TRACE(2069, A, l, S, F);
      A[3] = 1;
      return {
        A: A,
        l: l
      };
    }
  } else {
    if (typeof TRACE === "function") TRACE(2055, A, l, S, F);
    A[3] = 1;
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
function FR_2079(A, l, S) {
  let F = false;
  let v0 = l[0];
  if (typeof TRACE === "function") TRACE(2079, A, l, S, F);
  A[0] = -1;
  A[3] = (v0.indexOf("document") === -1);
  if (!(v0.indexOf("document") === -1)) {
    if (typeof TRACE === "function") TRACE(2091, A, l, S, F);
    if (typeof TRACE === "function") TRACE(2092, A, l, S, F);
    A[0] = -1;
    A[3] = (v0.indexOf("location") === -1);
    if (!(v0.indexOf("location") === -1)) {
      if (typeof TRACE === "function") TRACE(2104, A, l, S, F);
      if (typeof TRACE === "function") TRACE(2105, A, l, S, F);
      A[0] = -1;
      A[3] = (v0.indexOf("screen") === -1);
      if (!(v0.indexOf("screen") === -1)) {
        if (typeof TRACE === "function") TRACE(2117, A, l, S, F);
        if (typeof TRACE === "function") TRACE(2118, A, l, S, F);
        A[0] = -1;
        A[3] = (v0.indexOf("history") === -1);
        if (!(v0.indexOf("history") === -1)) {
          if (typeof TRACE === "function") TRACE(2130, A, l, S, F);
          if (typeof TRACE === "function") TRACE(2131, A, l, S, F);
          A[0] = -1;
          if (!(v0.indexOf("navigator") === -1)) {
            if (typeof TRACE === "function") TRACE(2143, A, l, S, F);
            if (typeof TRACE === "function") TRACE(2144, A, l, S, F);
            A[3] = 2;
            return {
              A: A,
              l: l
            };
          } else {
            if (typeof TRACE === "function") TRACE(2141, A, l, S, F);
            A[3] = 1;
            return {
              A: A,
              l: l
            };
          }
        } else {
          if (typeof TRACE === "function") TRACE(2128, A, l, S, F);
          A[3] = 1;
          return {
            A: A,
            l: l
          };
        }
      } else {
        if (typeof TRACE === "function") TRACE(2115, A, l, S, F);
        A[3] = 1;
        return {
          A: A,
          l: l
        };
      }
    } else {
      if (typeof TRACE === "function") TRACE(2102, A, l, S, F);
      A[3] = 1;
      return {
        A: A,
        l: l
      };
    }
  } else {
    if (typeof TRACE === "function") TRACE(2089, A, l, S, F);
    A[3] = 1;
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
function FR_2146(A, l, S) {
  let F = false;
  let v0 = l[0];
  if (typeof TRACE === "function") TRACE(2146, A, l, S, F);
  A[0] = typeof v0?.width;
  A[1] = "undefined";
  A[3] = (typeof v0?.width === "undefined");
  if (!(typeof v0?.width === "undefined")) {
    if (typeof TRACE === "function") TRACE(2156, A, l, S, F);
    if (typeof TRACE === "function") TRACE(2157, A, l, S, F);
    A[0] = typeof v0?.height;
    A[1] = "undefined";
    A[3] = (typeof v0?.height === "undefined");
    if (!(typeof v0?.height === "undefined")) {
      if (typeof TRACE === "function") TRACE(2167, A, l, S, F);
      if (typeof TRACE === "function") TRACE(2168, A, l, S, F);
      A[0] = typeof v0?.availHeight;
      A[1] = "undefined";
      A[3] = (typeof v0?.availHeight === "undefined");
      if (!(typeof v0?.availHeight === "undefined")) {
        if (typeof TRACE === "function") TRACE(2178, A, l, S, F);
        if (typeof TRACE === "function") TRACE(2179, A, l, S, F);
        A[0] = typeof v0?.availWidth;
        A[1] = "undefined";
        A[3] = (typeof v0?.availWidth === "undefined");
        if (!(typeof v0?.availWidth === "undefined")) {
          if (typeof TRACE === "function") TRACE(2189, A, l, S, F);
          if (typeof TRACE === "function") TRACE(2190, A, l, S, F);
          A[0] = typeof v0?.colorDepth;
          A[1] = "undefined";
          A[3] = (typeof v0?.colorDepth === "undefined");
          if (!(typeof v0?.colorDepth === "undefined")) {
            if (typeof TRACE === "function") TRACE(2200, A, l, S, F);
            if (typeof TRACE === "function") TRACE(2201, A, l, S, F);
            A[0] = typeof screen?.pixelDepth;
            A[1] = "undefined";
            A[3] = (typeof screen?.pixelDepth === "undefined");
            if (!(typeof screen?.pixelDepth === "undefined")) {
              if (typeof TRACE === "function") TRACE(2212, A, l, S, F);
              if (typeof TRACE === "function") TRACE(2213, A, l, S, F);
              A[0] = typeof screen?.availLeft;
              A[1] = "undefined";
              if (!(typeof screen?.availLeft === "undefined")) {
                if (typeof TRACE === "function") TRACE(2224, A, l, S, F);
                if (typeof TRACE === "function") TRACE(2225, A, l, S, F);
                A[3] = 2;
                return {
                  A: A,
                  l: l
                };
              } else {
                if (typeof TRACE === "function") TRACE(2222, A, l, S, F);
                A[3] = 1;
                return {
                  A: A,
                  l: l
                };
              }
            } else {
              if (typeof TRACE === "function") TRACE(2210, A, l, S, F);
              A[3] = 1;
              return {
                A: A,
                l: l
              };
            }
          } else {
            if (typeof TRACE === "function") TRACE(2198, A, l, S, F);
            A[3] = 1;
            return {
              A: A,
              l: l
            };
          }
        } else {
          if (typeof TRACE === "function") TRACE(2187, A, l, S, F);
          A[3] = 1;
          return {
            A: A,
            l: l
          };
        }
      } else {
        if (typeof TRACE === "function") TRACE(2176, A, l, S, F);
        A[3] = 1;
        return {
          A: A,
          l: l
        };
      }
    } else {
      if (typeof TRACE === "function") TRACE(2165, A, l, S, F);
      A[3] = 1;
      return {
        A: A,
        l: l
      };
    }
  } else {
    if (typeof TRACE === "function") TRACE(2154, A, l, S, F);
    A[3] = 1;
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
function FR_2227(A, l, S) {
  let F = false;
  let v77 = l[77],
    v78 = l[78],
    v79 = l[79],
    v80 = l[80],
    v81 = l[81],
    v82 = l[82],
    v83 = l[83],
    v84 = l[84],
    v85 = l[85];
  if (typeof TRACE === "function") TRACE(2227, A, l, S, F);
  v77 = Math.random();
  v78 = Math.random();
  v79 = Math.random();
  v80 = ((Math.random() + Math.random()) + Math.random());
  v81 = (Math.random() * 3);
  A[0] = ((Math.random() + Math.random()) + Math.random());
  A[1] = (Math.random() * 3);
  A[3] = (((Math.random() + Math.random()) + Math.random()) === (Math.random() * 3));
  if (!(((Math.random() + Math.random()) + Math.random()) === (Math.random() * 3))) {
    if (typeof TRACE === "function") TRACE(2262, A, l, S, F);
    if (typeof TRACE === "function") TRACE(2263, A, l, S, F);
    v83 = Math.random();
    v84 = ((Math.random() * "65536") * 16);
    v85 = Math.floor(((Math.random() * "65536") * 16));
    v82 = Math.floor(((Math.random() * "65536") * 16)).toString(16);
    A[0] = Math.floor(((Math.random() * "65536") * 16));
    A[1] = "65536";
    A[3] = Math.floor(((Math.random() * "65536") * 16)).toString(16);
    return {
      A: A,
      l: l
    };
  } else {
    if (typeof TRACE === "function") TRACE(2257, A, l, S, F);
    v82 = "sbcd";
    A[0] = "sbcd";
    A[3] = "sbcd";
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
function FR_2289(A, l, S) {
  let F = false;
  let v86 = l[86],
    v87 = l[87];
  if (typeof TRACE === "function") TRACE(2289, A, l, S, F);
  v86 = new Uint32Array(1);
  v87 = (new Uint32Array(1)?.[0]).toString(16);
  A[0] = new Uint32Array(1)?.[0];
  A[3] = (new Uint32Array(1)?.[0]).toString(16);
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