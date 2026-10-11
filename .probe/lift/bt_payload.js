
function M_GET(o,k){return (o===undefined||o===null)?undefined:o[k];}
function M_SET(o,k,v){if(o!==undefined&&o!==null)o[k]=v;return v;}
function M_EVAL(name){return eval(name);}
function SUBCALL(A,l,S,i,argc){ if(argc) S.splice(-argc); return 'CALL'; }
function SUB(entry,argc,A,l,S){ if(argc) S.splice(-argc); return 'CALL'; }
globalThis.BVM = function BVM(){}; globalThis.CVM = function CVM(){};
globalThis.window = globalThis;
globalThis.location = { toString: () => 'https://www.zhihu.com/' };
globalThis.document = { createElement: () => ({ getContext: () => null, style: {}, tagName: 'DIV' }),
                        getElementsByTagName: () => [{ appendChild(){}, removeChild(){} }], all: () => [] };
globalThis.navigator = { hardwareConcurrency: 8, plugins: [] };
globalThis.__b = { a3: 0 };
Math.random = () => 0.5;          // the program samples Math.random()
Object.defineProperty(globalThis, 'crypto', { configurable: true,
  value: { getRandomValues: (a) => { for (let i=0;i<a.length;i++) a[i]=i; return a; } } });
// temps emitted by the lifter are undeclared globals; reset them so a previous
// block cannot leak a stale value into the next block's entry stack
function resetTemps(){ for (let i=0;i<400;i++) globalThis['t'+i] = undefined; }
let v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46, v47, v48, v49, v50, v51, v52, v53, v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64, v65, v66, v67, v68, v69, v70, v71, v72, v73, v74, v75, v76, v77, v78, v79, v80, v81, v82, v83, v84, v85, v86, v87, v88, v89, v90, v91, v92, v93, v94, v95, v96, v97, v98, v99;
function resetV(l){ v0=l[0]; v1=l[1]; v2=l[2]; v3=l[3]; v4=l[4]; v5=l[5]; v6=l[6]; v7=l[7]; v8=l[8]; v9=l[9]; v10=l[10]; v11=l[11]; v12=l[12]; v13=l[13]; v14=l[14]; v15=l[15]; v16=l[16]; v17=l[17]; v18=l[18]; v19=l[19]; v20=l[20]; v21=l[21]; v22=l[22]; v23=l[23]; v24=l[24]; v25=l[25]; v26=l[26]; v27=l[27]; v28=l[28]; v29=l[29]; v30=l[30]; v31=l[31]; v32=l[32]; v33=l[33]; v34=l[34]; v35=l[35]; v36=l[36]; v37=l[37]; v38=l[38]; v39=l[39]; v40=l[40]; v41=l[41]; v42=l[42]; v43=l[43]; v44=l[44]; v45=l[45]; v46=l[46]; v47=l[47]; v48=l[48]; v49=l[49]; v50=l[50]; v51=l[51]; v52=l[52]; v53=l[53]; v54=l[54]; v55=l[55]; v56=l[56]; v57=l[57]; v58=l[58]; v59=l[59]; v60=l[60]; v61=l[61]; v62=l[62]; v63=l[63]; v64=l[64]; v65=l[65]; v66=l[66]; v67=l[67]; v68=l[68]; v69=l[69]; v70=l[70]; v71=l[71]; v72=l[72]; v73=l[73]; v74=l[74]; v75=l[75]; v76=l[76]; v77=l[77]; v78=l[78]; v79=l[79]; v80=l[80]; v81=l[81]; v82=l[82]; v83=l[83]; v84=l[84]; v85=l[85]; v86=l[86]; v87=l[87]; v88=l[88]; v89=l[89]; v90=l[90]; v91=l[91]; v92=l[92]; v93=l[93]; v94=l[94]; v95=l[95]; v96=l[96]; v97=l[97]; v98=l[98]; v99=l[99]; }
const A0 = [101,102,103,104];
function mk(){ const l=[]; for(let i=0;i<90;i++) l[i]=200+i; return {A:A0.slice(), l:l, S:[], F:true}; }
function norm(x){ return x.replace(/DEV_|LIF_/g,'X').replace(/:[0-9]+:[0-9]+/g,''); }   // Error().stack text differs by construction
function dig(s){ const t=v=>{ if(v===null)return 'null'; if(typeof v==='object')return 'obj'; if(typeof v==='function')return 'fn';
  var x=norm(String(v));
  try{ var d=Buffer.from(x,'base64').toString('utf8'); if(d.length>4) x=Buffer.from(norm(d),'utf8').toString('base64'); }catch(e){}
  return x; }; }
function run(st, fn){
  try { fn(st.A, st.l, st.S, st.F); return 'ok ' + dig(st); }
  catch (e) { return 'throw ' + e.constructor.name + ' ' + dig(st); }
}
let PASS=0, FAIL=0;

function DEV_0(A,l,S,F){

  A[0] = "8204";
  S.push(A[0]);
  S.push("String");
  A[0] = M_EVAL(S.pop());
  S.push("fromCharCode");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[0] = A[3];
  A[0] = 1905;
  A[3] = SUBCALL(A, l, S, 0, 0);
  l[1] = A[3];
  A[0] = l[1];
  A[1] = 2;
  A[3] = A[0] < A[1];
  F = !!A[3];
}
function LIF_0(A,l,S,F){

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
}
{ // block 0
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_0); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_0);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 0 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1831(A,l,S,F){

  S.length = 0; F = undefined;
}
function LIF_1831(A,l,S,F){

if (typeof TRACE === "function") TRACE(1831, A, l, S, F);
}
{ // block 1831
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1831); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1831);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1831 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1832(A,l,S,F){

  A[0] = "";
  l[62] = A[0];
  A[0] = l[0];
  S.push("length");
  A[0] = M_GET(A[0], S.pop());
  l[63] = A[0];
  A[0] = l[1];
  S.push("length");
  A[0] = M_GET(A[0], S.pop());
  l[64] = A[0];
  S.push("__b");
  A[0] = M_EVAL(S.pop());
  S.push("a3");
  A[0] = M_GET(A[0], S.pop());
  l[65] = A[0];
  A[0] = 0;
  l[66] = A[0];
}
function LIF_1832(A,l,S,F){

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
}
{ // block 1832
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1832); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1832);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1832 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1896(A,l,S,F){

  A[0] = l[65];
  S.push(A[0]);
  S.push(A[0]);
  S.push("__b");
  A[0] = M_EVAL(S.pop());
  S.push("a3");
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  A[3] = l[62];
}
function LIF_1896(A,l,S,F){

if (typeof TRACE === "function") TRACE(1896, A, l, S, F);
t0 = v65;
t1 = __b;
M_SET(t1, "a3", t0);
t2 = v62;
A[0] = t1;
A[3] = t2;
}
{ // block 1896
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1896); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1896);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1896 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1905(A,l,S,F){

  S.push("Object");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  l[10] = A[3];
  A[0] = "a";
  S.push(A[0]);
  A[0] = "b";
  S.push(A[0]);
  A[0] = "return b in a ? a[b]: undefined";
  S.push(A[0]);
  S.push("Function");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-3));
  l[11] = A[3];
  A[0] = l[11];
  S.push(A[0]);
  S.push(A[0]);
  A[0] = "get";
  S.push(A[0]);
  A[0] = l[10];
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  A[0] = "get";
  S.push(A[0]);
  A[0] = l[10];
  A[0] = M_GET(A[0], S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("length");
  A[3] = M_GET(A[3], S.pop());
  l[72] = A[3];
  S.push("CVM");
  A[0] = M_EVAL(S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  l[73] = A[3];
  A[0] = l[72];
  A[1] = 60;
  A[3] = A[0] > A[1];
  F = !!A[3];
}
function LIF_1905(A,l,S,F){

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
}
{ // block 1905
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1905); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1905);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1905 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1945(A,l,S,F){
    S.push(t0);
  A[3] = 2;
}
function LIF_1945(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(1945, A, l, S, F);
t0 = 2;
A[3] = t0;
}
{ // block 1945
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1945); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1945);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1945 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1947(A,l,S,F){
    S.push(t0);

}
function LIF_1947(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(1947, A, l, S, F);
}
{ // block 1947
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1947); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1947);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1947 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1948(A,l,S,F){
    S.push(t0);
  S.push("__b");
  A[0] = M_EVAL(S.pop());
  S.push("zh");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1948(A,l,S,F){
    S.push(t0);
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
}
{ // block 1948
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1948); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1948);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1948 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1957(A,l,S,F){
    S.push(t0);
  A[3] = 2;
}
function LIF_1957(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(1957, A, l, S, F);
t0 = 2;
A[3] = t0;
}
{ // block 1957
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1957); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1957);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1957 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1959(A,l,S,F){
    S.push(t0);

}
function LIF_1959(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(1959, A, l, S, F);
}
{ // block 1959
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1959); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1959);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1959 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1960(A,l,S,F){
    S.push(t0);
  A[0] = "onsol";
  S.push(A[0]);
  A[0] = l[73];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] !== A[0];
  F = !!A[3];
}
function LIF_1960(A,l,S,F){
    S.push(t0);
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
}
{ // block 1960
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1960); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1960);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1960 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1970(A,l,S,F){
    S.push(t0);
  A[3] = 2;
}
function LIF_1970(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(1970, A, l, S, F);
t0 = 2;
A[3] = t0;
}
{ // block 1970
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1970); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1970);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1970 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1972(A,l,S,F){
    S.push(t0);

}
function LIF_1972(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(1972, A, l, S, F);
}
{ // block 1972
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1972); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1972);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1972 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1973(A,l,S,F){
    S.push(t0);
  S.push("Error");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  S.push("stack");
  A[3] = M_GET(A[3], S.pop());
  l[60] = A[3];
  A[0] = "node";
  S.push(A[0]);
  A[0] = l[60];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] !== A[0];
  F = !!A[3];
}
function LIF_1973(A,l,S,F){
    S.push(t0);
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
}
{ // block 1973
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1973); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1973);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1973 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1989(A,l,S,F){
    S.push(t0);
  A[3] = 2;
}
function LIF_1989(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(1989, A, l, S, F);
t0 = 2;
A[3] = t0;
}
{ // block 1989
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1989); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1989);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1989 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1991(A,l,S,F){
    S.push(t0);

}
function LIF_1991(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(1991, A, l, S, F);
}
{ // block 1991
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1991); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1991);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1991 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1992(A,l,S,F){
    S.push(t0);
  A[0] = "executeUserEntryPoint";
  S.push(A[0]);
  A[0] = l[60];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] !== A[0];
  F = !!A[3];
}
function LIF_1992(A,l,S,F){
    S.push(t0);
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
}
{ // block 1992
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1992); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1992);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1992 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2002(A,l,S,F){
    S.push(t0);
  A[3] = 2;
}
function LIF_2002(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(2002, A, l, S, F);
t0 = 2;
A[3] = t0;
}
{ // block 2002
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2002); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2002);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2002 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2004(A,l,S,F){
    S.push(t0);

}
function LIF_2004(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(2004, A, l, S, F);
}
{ // block 2004
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2004); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2004);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2004 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2005(A,l,S,F){
    S.push(t0);
  A[0] = "native";
  S.push(A[0]);
  S.push("Function");
  A[0] = M_EVAL(S.pop());
  S.push("prototype");
  A[0] = M_GET(A[0], S.pop());
  S.push("constructor");
  A[0] = M_GET(A[0], S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_2005(A,l,S,F){
    S.push(t0);
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
}
{ // block 2005
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2005); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2005);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2005 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2022(A,l,S,F){
    S.push(t0);
  A[3] = 2;
}
function LIF_2022(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(2022, A, l, S, F);
t0 = 2;
A[3] = t0;
}
{ // block 2022
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2022); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2022);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2022 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2024(A,l,S,F){
    S.push(t0);

}
function LIF_2024(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(2024, A, l, S, F);
}
{ // block 2024
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2024); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2024);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2024 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2025(A,l,S,F){
    S.push(t0);
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("v_log");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_2025(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(2025, A, l, S, F);
t0 = window;
t1 = t0?.v_log;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
A[0] = t2;
A[1] = t3;
}
{ // block 2025
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2025); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2025);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2025 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2034(A,l,S,F){
    S.push(t0);
  A[3] = 2;
}
function LIF_2034(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(2034, A, l, S, F);
t0 = 2;
A[3] = t0;
}
{ // block 2034
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2034); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2034);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2034 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2036(A,l,S,F){
    S.push(t0);

}
function LIF_2036(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(2036, A, l, S, F);
}
{ // block 2036
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2036); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2036);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2036 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2037(A,l,S,F){
    S.push(t0);
  A[3] = 1;
}
function LIF_2037(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(2037, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2037
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2037); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2037);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2037 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2039(A,l,S,F){

  A[0] = "zseCk";
  S.push(A[0]);
  A[0] = "zseCk";
  S.push(A[0]);
  A[0] = l[0];
  S.push("setItem");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); };
  A[0] = l[0];
  S.push("length");
  A[0] = M_GET(A[0], S.pop());
  l[75] = A[0];
  A[0] = l[0];
  A[1] = 1;
  A[3] = A[0] < A[1];
  F = !!A[3];
}
function LIF_2039(A,l,S,F){

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
}
{ // block 2039
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2039); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2039);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2039 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2055(A,l,S,F){

  A[3] = 1;
}
function LIF_2055(A,l,S,F){

if (typeof TRACE === "function") TRACE(2055, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2055
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2055); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2055);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2055 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2057(A,l,S,F){


}
function LIF_2057(A,l,S,F){

if (typeof TRACE === "function") TRACE(2057, A, l, S, F);
}
{ // block 2057
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2057); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2057);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2057 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2058(A,l,S,F){

  A[0] = "zseCk";
  S.push(A[0]);
  A[0] = l[0];
  S.push("getItem");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[76] = A[3];
  A[0] = l[76];
  A[1] = "zseCk";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_2058(A,l,S,F){

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
}
{ // block 2058
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2058); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2058);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2058 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2069(A,l,S,F){

  A[3] = 1;
}
function LIF_2069(A,l,S,F){

if (typeof TRACE === "function") TRACE(2069, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2069
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2069); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2069);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2069 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2071(A,l,S,F){


}
function LIF_2071(A,l,S,F){

if (typeof TRACE === "function") TRACE(2071, A, l, S, F);
}
{ // block 2071
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2071); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2071);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2071 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2072(A,l,S,F){

  A[0] = "zseCk";
  S.push(A[0]);
  A[0] = l[0];
  S.push("removeItem");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[3] = 2;
}
function LIF_2072(A,l,S,F){

if (typeof TRACE === "function") TRACE(2072, A, l, S, F);
t0 = "zseCk";
t1 = v0;
t2 = t1.removeItem(t0);
t3 = 2;
A[0] = t1;
A[3] = t3;
}
{ // block 2072
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2072); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2072);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2072 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2079(A,l,S,F){

  A[0] = "document";
  S.push(A[0]);
  A[0] = l[0];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_2079(A,l,S,F){

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
}
{ // block 2079
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2079); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2079);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2079 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2089(A,l,S,F){

  A[3] = 1;
}
function LIF_2089(A,l,S,F){

if (typeof TRACE === "function") TRACE(2089, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2089
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2089); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2089);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2089 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2091(A,l,S,F){


}
function LIF_2091(A,l,S,F){

if (typeof TRACE === "function") TRACE(2091, A, l, S, F);
}
{ // block 2091
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2091); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2091);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2091 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2092(A,l,S,F){

  A[0] = "location";
  S.push(A[0]);
  A[0] = l[0];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_2092(A,l,S,F){

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
}
{ // block 2092
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2092); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2092);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2092 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2102(A,l,S,F){

  A[3] = 1;
}
function LIF_2102(A,l,S,F){

if (typeof TRACE === "function") TRACE(2102, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2102
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2102); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2102);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2102 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2104(A,l,S,F){


}
function LIF_2104(A,l,S,F){

if (typeof TRACE === "function") TRACE(2104, A, l, S, F);
}
{ // block 2104
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2104); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2104);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2104 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2105(A,l,S,F){

  A[0] = "screen";
  S.push(A[0]);
  A[0] = l[0];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_2105(A,l,S,F){

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
}
{ // block 2105
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2105); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2105);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2105 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2115(A,l,S,F){

  A[3] = 1;
}
function LIF_2115(A,l,S,F){

if (typeof TRACE === "function") TRACE(2115, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2115
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2115); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2115);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2115 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2117(A,l,S,F){


}
function LIF_2117(A,l,S,F){

if (typeof TRACE === "function") TRACE(2117, A, l, S, F);
}
{ // block 2117
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2117); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2117);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2117 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2118(A,l,S,F){

  A[0] = "history";
  S.push(A[0]);
  A[0] = l[0];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_2118(A,l,S,F){

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
}
{ // block 2118
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2118); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2118);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2118 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2128(A,l,S,F){

  A[3] = 1;
}
function LIF_2128(A,l,S,F){

if (typeof TRACE === "function") TRACE(2128, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2128
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2128); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2128);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2128 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2130(A,l,S,F){


}
function LIF_2130(A,l,S,F){

if (typeof TRACE === "function") TRACE(2130, A, l, S, F);
}
{ // block 2130
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2130); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2130);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2130 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2131(A,l,S,F){

  A[0] = "navigator";
  S.push(A[0]);
  A[0] = l[0];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_2131(A,l,S,F){

if (typeof TRACE === "function") TRACE(2131, A, l, S, F);
t0 = "navigator";
t1 = v0;
t2 = t1.indexOf(t0);
t3 = 1;
t4 = (-t3);
t5 = (t2 === t4);
F = !!(t5);
A[0] = t4;
}
{ // block 2131
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2131); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2131);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2131 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2141(A,l,S,F){

  A[3] = 1;
}
function LIF_2141(A,l,S,F){

if (typeof TRACE === "function") TRACE(2141, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2141
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2141); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2141);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2141 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2143(A,l,S,F){


}
function LIF_2143(A,l,S,F){

if (typeof TRACE === "function") TRACE(2143, A, l, S, F);
}
{ // block 2143
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2143); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2143);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2143 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2144(A,l,S,F){

  A[3] = 2;
}
function LIF_2144(A,l,S,F){

if (typeof TRACE === "function") TRACE(2144, A, l, S, F);
t0 = 2;
A[3] = t0;
}
{ // block 2144
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2144); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2144);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2144 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2146(A,l,S,F){

  A[0] = l[0];
  S.push("width");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_2146(A,l,S,F){

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
}
{ // block 2146
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2146); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2146);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2146 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2154(A,l,S,F){

  A[3] = 1;
}
function LIF_2154(A,l,S,F){

if (typeof TRACE === "function") TRACE(2154, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2154
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2154); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2154);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2154 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2156(A,l,S,F){


}
function LIF_2156(A,l,S,F){

if (typeof TRACE === "function") TRACE(2156, A, l, S, F);
}
{ // block 2156
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2156); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2156);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2156 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2157(A,l,S,F){

  A[0] = l[0];
  S.push("height");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_2157(A,l,S,F){

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
}
{ // block 2157
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2157); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2157);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2157 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2165(A,l,S,F){

  A[3] = 1;
}
function LIF_2165(A,l,S,F){

if (typeof TRACE === "function") TRACE(2165, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2165
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2165); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2165);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2165 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2167(A,l,S,F){


}
function LIF_2167(A,l,S,F){

if (typeof TRACE === "function") TRACE(2167, A, l, S, F);
}
{ // block 2167
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2167); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2167);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2167 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2168(A,l,S,F){

  A[0] = l[0];
  S.push("availHeight");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_2168(A,l,S,F){

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
}
{ // block 2168
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2168); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2168);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2168 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2176(A,l,S,F){

  A[3] = 1;
}
function LIF_2176(A,l,S,F){

if (typeof TRACE === "function") TRACE(2176, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2176
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2176); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2176);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2176 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2178(A,l,S,F){


}
function LIF_2178(A,l,S,F){

if (typeof TRACE === "function") TRACE(2178, A, l, S, F);
}
{ // block 2178
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2178); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2178);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2178 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2179(A,l,S,F){

  A[0] = l[0];
  S.push("availWidth");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_2179(A,l,S,F){

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
}
{ // block 2179
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2179); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2179);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2179 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2187(A,l,S,F){

  A[3] = 1;
}
function LIF_2187(A,l,S,F){

if (typeof TRACE === "function") TRACE(2187, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2187
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2187); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2187);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2187 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2189(A,l,S,F){


}
function LIF_2189(A,l,S,F){

if (typeof TRACE === "function") TRACE(2189, A, l, S, F);
}
{ // block 2189
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2189); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2189);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2189 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2190(A,l,S,F){

  A[0] = l[0];
  S.push("colorDepth");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_2190(A,l,S,F){

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
}
{ // block 2190
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2190); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2190);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2190 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2198(A,l,S,F){

  A[3] = 1;
}
function LIF_2198(A,l,S,F){

if (typeof TRACE === "function") TRACE(2198, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2198
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2198); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2198);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2198 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2200(A,l,S,F){


}
function LIF_2200(A,l,S,F){

if (typeof TRACE === "function") TRACE(2200, A, l, S, F);
}
{ // block 2200
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2200); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2200);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2200 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2201(A,l,S,F){

  S.push("screen");
  A[0] = M_EVAL(S.pop());
  S.push("pixelDepth");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_2201(A,l,S,F){

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
}
{ // block 2201
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2201); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2201);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2201 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2210(A,l,S,F){

  A[3] = 1;
}
function LIF_2210(A,l,S,F){

if (typeof TRACE === "function") TRACE(2210, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2210
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2210); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2210);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2210 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2212(A,l,S,F){


}
function LIF_2212(A,l,S,F){

if (typeof TRACE === "function") TRACE(2212, A, l, S, F);
}
{ // block 2212
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2212); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2212);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2212 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2213(A,l,S,F){

  S.push("screen");
  A[0] = M_EVAL(S.pop());
  S.push("availLeft");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_2213(A,l,S,F){

if (typeof TRACE === "function") TRACE(2213, A, l, S, F);
t0 = screen;
t1 = t0?.availLeft;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
A[0] = t2;
A[1] = t3;
}
{ // block 2213
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2213); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2213);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2213 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2222(A,l,S,F){

  A[3] = 1;
}
function LIF_2222(A,l,S,F){

if (typeof TRACE === "function") TRACE(2222, A, l, S, F);
t0 = 1;
A[3] = t0;
}
{ // block 2222
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2222); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2222);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2222 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2224(A,l,S,F){


}
function LIF_2224(A,l,S,F){

if (typeof TRACE === "function") TRACE(2224, A, l, S, F);
}
{ // block 2224
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2224); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2224);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2224 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2225(A,l,S,F){

  A[3] = 2;
}
function LIF_2225(A,l,S,F){

if (typeof TRACE === "function") TRACE(2225, A, l, S, F);
t0 = 2;
A[3] = t0;
}
{ // block 2225
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2225); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2225);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2225 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2227(A,l,S,F){

  S.push("Math");
  A[0] = M_EVAL(S.pop());
  S.push("random");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  l[77] = A[3];
  S.push("Math");
  A[0] = M_EVAL(S.pop());
  S.push("random");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  l[78] = A[3];
  S.push("Math");
  A[0] = M_EVAL(S.pop());
  S.push("random");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  l[79] = A[3];
  A[0] = l[77];
  A[1] = l[78];
  A[3] = A[0] + A[1];
  A[0] = l[79];
  A[3] = A[3] + A[0];
  l[80] = A[3];
  A[0] = l[77];
  A[1] = 3;
  A[3] = A[0] * A[1];
  l[81] = A[3];
  A[0] = l[80];
  A[1] = l[81];
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_2227(A,l,S,F){

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
}
{ // block 2227
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2227); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2227);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2227 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2257(A,l,S,F){

  A[0] = "sbcd";
  S.push(A[0]);
  l[82] = A[0];
  A[3] = l[82];
}
function LIF_2257(A,l,S,F){

if (typeof TRACE === "function") TRACE(2257, A, l, S, F);
t0 = "sbcd";
v82 = t0;
t1 = t0;
A[0] = t0;
A[3] = t1;
}
{ // block 2257
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2257); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2257);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2257 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2262(A,l,S,F){


}
function LIF_2262(A,l,S,F){

if (typeof TRACE === "function") TRACE(2262, A, l, S, F);
}
{ // block 2262
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2262); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2262);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2262 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2263(A,l,S,F){

  S.push("Math");
  A[0] = M_EVAL(S.pop());
  S.push("random");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  l[83] = A[3];
  A[0] = l[83];
  A[1] = "65536";
  A[3] = A[0] * A[1];
  A[0] = 16;
  A[3] = A[3] * A[0];
  l[84] = A[3];
  A[0] = l[84];
  S.push(A[0]);
  S.push("Math");
  A[0] = M_EVAL(S.pop());
  S.push("floor");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[85] = A[3];
  A[0] = 16;
  S.push(A[0]);
  A[0] = l[85];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[82] = A[3];
  A[3] = l[82];
}
function LIF_2263(A,l,S,F){

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
}
{ // block 2263
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2263); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2263);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2263 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_2289(A,l,S,F){

  A[0] = 1;
  S.push(A[0]);
  S.push("Uint32Array");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-1));
  l[86] = A[3];
  A[0] = l[86];
  S.push(A[0]);
  S.push("crypto");
  A[0] = M_EVAL(S.pop());
  S.push("getRandomValues");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 16;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[86];
  A[0] = M_GET(A[0], S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[87] = A[3];
  A[3] = l[87];
}
function LIF_2289(A,l,S,F){

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
}
{ // block 2289
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_2289); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_2289);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 2289 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_15(A,l,S,F){

  l[2] = A[3];
  A[0] = 1;
  A[1] = 13;
  A[3] = A[0] << A[1];
  l[3] = A[3];
  A[0] = 1;
  A[1] = 12;
  A[3] = A[0] << A[1];
  l[4] = A[3];
  A[0] = 1;
  A[1] = 15;
  A[3] = A[0] << A[1];
  l[5] = A[3];
  A[0] = 1;
  A[1] = 14;
  A[3] = A[0] << A[1];
  l[6] = A[3];
  A[0] = "8204";
  S.push(A[0]);
  S.push("String");
  A[0] = M_EVAL(S.pop());
  S.push("fromCharCode");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[7] = A[3];
  S.push("Object");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  l[8] = A[3];
  A[0] = "a";
  S.push(A[0]);
  A[0] = "b";
  S.push(A[0]);
  A[0] = "return b in a ? a[b]: undefined";
  S.push(A[0]);
  S.push("Function");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-3));
  l[9] = A[3];
  A[0] = l[9];
  S.push(A[0]);
  S.push(A[0]);
  A[0] = "get";
  S.push(A[0]);
  A[0] = l[8];
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  A[0] = "a";
  S.push(A[0]);
  A[0] = "b";
  S.push(A[0]);
  A[0] = "c";
  S.push(A[0]);
  A[0] = "a[b]=c;return true";
  S.push(A[0]);
  S.push("Function");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-4));
  l[10] = A[3];
  A[0] = l[10];
  S.push(A[0]);
  S.push(A[0]);
  A[0] = "set";
  S.push(A[0]);
  A[0] = l[8];
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push(A[0]);
  A[0] = l[8];
  S.push(A[0]);
  S.push("Proxy");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-2));
  l[11] = A[3];
  A[0] = l[11];
  S.push(A[0]);
  S.push("Object");
  A[0] = M_EVAL(S.pop());
  S.push("keys");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[12] = A[3];
  A[0] = l[12];
  A[1] = 40;
  A[3] = A[0] < A[1];
  F = !!A[3];
}
function LIF_15(A,l,S,F){

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
}
{ // block 15
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_15); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_15);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 15 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_100(A,l,S,F){

  A[0] = 1;
  A[1] = 15;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_100(A,l,S,F){

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
{ // block 100
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_100); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_100);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 100 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_110(A,l,S,F){


}
function LIF_110(A,l,S,F){

if (typeof TRACE === "function") TRACE(110, A, l, S, F);
}
{ // block 110
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_110); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_110);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 110 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_111(A,l,S,F){

  A[0] = l[12];
  S.push(A[0]);
  A[0] = 2079;
  A[3] = SUBCALL(A, l, S, 0, 1);
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[13];
  A[1] = 1;
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_111(A,l,S,F){

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
}
{ // block 111
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_111); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_111);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 111 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_122(A,l,S,F){

  A[0] = 1;
  A[1] = 14;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_122(A,l,S,F){

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
{ // block 122
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_122); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_122);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 122 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_132(A,l,S,F){


}
function LIF_132(A,l,S,F){

if (typeof TRACE === "function") TRACE(132, A, l, S, F);
}
{ // block 132
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_132); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_132);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 132 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_133(A,l,S,F){

  A[0] = "top";
  S.push(A[0]);
  A[0] = l[12];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_133(A,l,S,F){

if (typeof TRACE === "function") TRACE(133, A, l, S, F);
t0 = "top";
t1 = v12;
t2 = t1.indexOf(t0);
t3 = 1;
t4 = (-t3);
t5 = (t2 === t4);
F = !!(t5);
}
{ // block 133
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_133); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_133);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 133 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_143(A,l,S,F){

  A[0] = 1;
  A[1] = 12;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_143(A,l,S,F){

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
{ // block 143
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_143); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_143);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 143 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_153(A,l,S,F){


}
function LIF_153(A,l,S,F){

if (typeof TRACE === "function") TRACE(153, A, l, S, F);
}
{ // block 153
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_153); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_153);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 153 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_154(A,l,S,F){

  A[0] = "customElements";
  S.push(A[0]);
  A[0] = l[12];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_154(A,l,S,F){

if (typeof TRACE === "function") TRACE(154, A, l, S, F);
t0 = "customElements";
t1 = v12;
t2 = t1.indexOf(t0);
t3 = 1;
t4 = (-t3);
t5 = (t2 === t4);
F = !!(t5);
}
{ // block 154
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_154); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_154);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 154 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_164(A,l,S,F){

  A[0] = 1;
  A[1] = 11;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_164(A,l,S,F){

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
{ // block 164
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_164); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_164);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 164 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_174(A,l,S,F){


}
function LIF_174(A,l,S,F){

if (typeof TRACE === "function") TRACE(174, A, l, S, F);
}
{ // block 174
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_174); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_174);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 174 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_175(A,l,S,F){

  A[0] = "name";
  S.push(A[0]);
  A[0] = l[12];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_175(A,l,S,F){

if (typeof TRACE === "function") TRACE(175, A, l, S, F);
t0 = "name";
t1 = v12;
t2 = t1.indexOf(t0);
t3 = 1;
t4 = (-t3);
t5 = (t2 === t4);
F = !!(t5);
}
{ // block 175
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_175); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_175);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 175 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_185(A,l,S,F){

  A[0] = 1;
  A[1] = 10;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_185(A,l,S,F){

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
{ // block 185
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_185); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_185);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 185 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_195(A,l,S,F){


}
function LIF_195(A,l,S,F){

if (typeof TRACE === "function") TRACE(195, A, l, S, F);
}
{ // block 195
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_195); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_195);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 195 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_196(A,l,S,F){

  A[0] = "self";
  S.push(A[0]);
  A[0] = l[12];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_196(A,l,S,F){

if (typeof TRACE === "function") TRACE(196, A, l, S, F);
t0 = "self";
t1 = v12;
t2 = t1.indexOf(t0);
t3 = 1;
t4 = (-t3);
t5 = (t2 === t4);
F = !!(t5);
}
{ // block 196
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_196); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_196);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 196 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_206(A,l,S,F){

  A[0] = 1;
  A[1] = 9;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_206(A,l,S,F){

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
{ // block 206
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_206); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_206);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 206 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_216(A,l,S,F){


}
function LIF_216(A,l,S,F){

if (typeof TRACE === "function") TRACE(216, A, l, S, F);
}
{ // block 216
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_216); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_216);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 216 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_217(A,l,S,F){

  A[0] = "print";
  S.push(A[0]);
  A[0] = l[12];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_217(A,l,S,F){

if (typeof TRACE === "function") TRACE(217, A, l, S, F);
t0 = "print";
t1 = v12;
t2 = t1.indexOf(t0);
t3 = 1;
t4 = (-t3);
t5 = (t2 === t4);
F = !!(t5);
}
{ // block 217
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_217); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_217);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 217 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_227(A,l,S,F){

  A[0] = 1;
  A[1] = 8;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_227(A,l,S,F){

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
{ // block 227
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_227); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_227);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 227 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_237(A,l,S,F){


}
function LIF_237(A,l,S,F){

if (typeof TRACE === "function") TRACE(237, A, l, S, F);
}
{ // block 237
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_237); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_237);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 237 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_238(A,l,S,F){

  A[0] = "open";
  S.push(A[0]);
  A[0] = l[12];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_238(A,l,S,F){

if (typeof TRACE === "function") TRACE(238, A, l, S, F);
t0 = "open";
t1 = v12;
t2 = t1.indexOf(t0);
t3 = 1;
t4 = (-t3);
t5 = (t2 === t4);
F = !!(t5);
}
{ // block 238
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_238); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_238);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 238 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_248(A,l,S,F){

  A[0] = 1;
  A[1] = 7;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_248(A,l,S,F){

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
{ // block 248
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_248); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_248);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 248 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_258(A,l,S,F){


}
function LIF_258(A,l,S,F){

if (typeof TRACE === "function") TRACE(258, A, l, S, F);
}
{ // block 258
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_258); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_258);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 258 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_259(A,l,S,F){

  A[0] = "_encrypt";
  S.push(A[0]);
  A[0] = l[12];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_259(A,l,S,F){

if (typeof TRACE === "function") TRACE(259, A, l, S, F);
t0 = "_encrypt";
t1 = v12;
t2 = t1.indexOf(t0);
t3 = 1;
t4 = (-t3);
t5 = (t2 === t4);
F = !!(t5);
}
{ // block 259
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_259); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_259);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 259 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_269(A,l,S,F){

  A[0] = 1;
  A[1] = 6;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_269(A,l,S,F){

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
{ // block 269
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_269); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_269);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 269 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_279(A,l,S,F){


}
function LIF_279(A,l,S,F){

if (typeof TRACE === "function") TRACE(279, A, l, S, F);
}
{ // block 279
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_279); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_279);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 279 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_280(A,l,S,F){

  A[0] = "__g";
  S.push(A[0]);
  A[0] = l[12];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_280(A,l,S,F){

if (typeof TRACE === "function") TRACE(280, A, l, S, F);
t0 = "__g";
t1 = v12;
t2 = t1.indexOf(t0);
t3 = 1;
t4 = (-t3);
t5 = (t2 === t4);
F = !!(t5);
}
{ // block 280
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_280); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_280);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 280 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_290(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_290(A,l,S,F){

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
{ // block 290
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_290); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_290);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 290 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_300(A,l,S,F){


}
function LIF_300(A,l,S,F){

if (typeof TRACE === "function") TRACE(300, A, l, S, F);
}
{ // block 300
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_300); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_300);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 300 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_301(A,l,S,F){

  S.push("Function");
  A[0] = M_EVAL(S.pop());
  S.push(A[0]);
  A[0] = l[8];
  S.push(A[0]);
  S.push("Proxy");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-2));
  l[14] = A[3];
  A[0] = "window={};document={};return document";
  S.push(A[0]);
  A[0] = l[14];
  A[3] = new A[0](...S.splice(-1));
  S.push(A[3]);
  l[15] = A[3];
  A[0] = l[15];
  A[3] = A[0]();
  l[16] = A[3];
  A[0] = l[16];
  S.push("URL");
  A[0] = M_GET(A[0], S.pop());
  l[17] = A[0];
  A[0] = "zhihu";
  S.push(A[0]);
  A[0] = l[17];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_301(A,l,S,F){

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
}
{ // block 301
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_301); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_301);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 301 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_333(A,l,S,F){

  A[0] = 1;
  A[1] = 4;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_333(A,l,S,F){

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
{ // block 333
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_333); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_333);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 333 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_343(A,l,S,F){


}
function LIF_343(A,l,S,F){

if (typeof TRACE === "function") TRACE(343, A, l, S, F);
}
{ // block 343
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_343); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_343);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 343 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_344(A,l,S,F){

  A[0] = l[16];
  S.push("all");
  A[0] = M_GET(A[0], S.pop());
  l[18] = A[0];
  A[0] = l[18];
  A[0] = typeof A[0];
  l[19] = A[0];
  A[0] = l[19];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_344(A,l,S,F){

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
}
{ // block 344
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_344); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_344);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 344 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_356(A,l,S,F){

  A[0] = 1;
  A[1] = 3;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_356(A,l,S,F){

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
{ // block 356
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_356); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_356);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 356 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_366(A,l,S,F){


}
function LIF_366(A,l,S,F){

if (typeof TRACE === "function") TRACE(366, A, l, S, F);
}
{ // block 366
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_366); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_366);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 366 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_367(A,l,S,F){

  A[0] = l[18];
  S.push("length");
  A[0] = M_GET(A[0], S.pop());
  l[20] = A[0];
  A[0] = l[20];
  A[0] = typeof A[0];
  A[1] = "number";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_367(A,l,S,F){

if (typeof TRACE === "function") TRACE(367, A, l, S, F);
t0 = v18;
t1 = t0?.length;
v20 = t1;
t2 = t1;
t3 = (typeof t2);
t4 = "number";
t5 = (t3 !== t4);
F = !!(t5);
}
{ // block 367
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_367); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_367);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 367 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_377(A,l,S,F){

  A[0] = 1;
  A[1] = 2;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_377(A,l,S,F){

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
{ // block 377
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_377); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_377);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 377 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_387(A,l,S,F){


}
function LIF_387(A,l,S,F){

if (typeof TRACE === "function") TRACE(387, A, l, S, F);
}
{ // block 387
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_387); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_387);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 387 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_388(A,l,S,F){

  S.push("Function");
  A[0] = M_EVAL(S.pop());
  S.push(A[0]);
  A[0] = l[8];
  S.push(A[0]);
  S.push("Proxy");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-2));
  l[14] = A[3];
  A[0] = "try{window={};document={};return document.all()}catch(_){}";
  S.push(A[0]);
  A[0] = l[14];
  A[3] = new A[0](...S.splice(-1));
  l[21] = A[3];
  A[0] = l[21];
  A[3] = A[0]();
  l[22] = A[3];
  A[0] = l[22];
  A[0] = typeof A[0];
  A[1] = "object";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_388(A,l,S,F){

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
}
{ // block 388
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_388); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_388);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 388 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_411(A,l,S,F){

  A[0] = 1;
  A[1] = 1;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_411(A,l,S,F){

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
{ // block 411
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_411); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_411);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 411 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_421(A,l,S,F){


}
function LIF_421(A,l,S,F){

if (typeof TRACE === "function") TRACE(421, A, l, S, F);
}
{ // block 421
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_421); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_421);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 421 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_422(A,l,S,F){

  A[0] = l[20];
  A[1] = 4;
  A[3] = A[0] < A[1];
  F = !!A[3];
}
function LIF_422(A,l,S,F){

if (typeof TRACE === "function") TRACE(422, A, l, S, F);
t0 = v20;
t1 = 4;
t2 = (t0 < t1);
F = !!(t2);
}
{ // block 422
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_422); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_422);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 422 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_427(A,l,S,F){

  A[0] = 1;
  S.push(A[0]);
  l[2] = A[0];
  A[0] = l[3];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_427(A,l,S,F){

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
{ // block 427
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_427); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_427);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 427 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_435(A,l,S,F){


}
function LIF_435(A,l,S,F){

if (typeof TRACE === "function") TRACE(435, A, l, S, F);
}
{ // block 435
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_435); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_435);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 435 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_436(A,l,S,F){

  A[0] = 0;
  S.push(A[0]);
  A[0] = l[18];
  A[0] = M_GET(A[0], S.pop());
  l[23] = A[0];
  A[0] = l[23];
  S.push("tagName");
  A[0] = M_GET(A[0], S.pop());
  A[1] = "HTML";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_436(A,l,S,F){

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
}
{ // block 436
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_436); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_436);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 436 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_448(A,l,S,F){

  A[0] = 1;
  A[1] = 15;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_448(A,l,S,F){

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
{ // block 448
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_448); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_448);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 448 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_458(A,l,S,F){


}
function LIF_458(A,l,S,F){

if (typeof TRACE === "function") TRACE(458, A, l, S, F);
}
{ // block 458
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_458); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_458);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 458 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_459(A,l,S,F){

  A[0] = "HTMLHtmlElement";
  S.push(A[0]);
  A[0] = l[23];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_459(A,l,S,F){

if (typeof TRACE === "function") TRACE(459, A, l, S, F);
t0 = "HTMLHtmlElement";
t1 = v23;
t2 = t1.toString();
t3 = t2.indexOf(t0);
t4 = 1;
t5 = (-t4);
t6 = (t3 === t5);
F = !!(t6);
}
{ // block 459
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_459); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_459);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 459 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_471(A,l,S,F){

  A[0] = 1;
  A[1] = 14;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_471(A,l,S,F){

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
{ // block 471
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_471); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_471);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 471 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_481(A,l,S,F){


}
function LIF_481(A,l,S,F){

if (typeof TRACE === "function") TRACE(481, A, l, S, F);
}
{ // block 481
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_481); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_481);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 481 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_482(A,l,S,F){

  A[0] = "script";
  S.push(A[0]);
  A[0] = l[23];
  S.push("getElementsByTagName");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[24] = A[3];
  A[0] = "Collection";
  S.push(A[0]);
  A[0] = l[24];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_482(A,l,S,F){

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
}
{ // block 482
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_482); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_482);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 482 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_500(A,l,S,F){

  A[0] = 1;
  A[1] = 13;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_500(A,l,S,F){

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
{ // block 500
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_500); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_500);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 500 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_510(A,l,S,F){


}
function LIF_510(A,l,S,F){

if (typeof TRACE === "function") TRACE(510, A, l, S, F);
}
{ // block 510
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_510); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_510);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 510 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_511(A,l,S,F){

  A[0] = l[16];
  S.push(A[0]);
  A[0] = l[16];
  S.push("createElement");
  A[0] = M_GET(A[0], S.pop());
  S.push("bind");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[25] = A[3];
  A[0] = "script";
  S.push(A[0]);
  A[0] = l[25];
  A[3] = A[0](...S.splice(-1));
  l[26] = A[3];
  A[0] = l[26];
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_511(A,l,S,F){

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
}
{ // block 511
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_511); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_511);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 511 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_530(A,l,S,F){

  A[0] = 1;
  A[1] = 11;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_530(A,l,S,F){

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
{ // block 530
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_530); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_530);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 530 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_540(A,l,S,F){


}
function LIF_540(A,l,S,F){

if (typeof TRACE === "function") TRACE(540, A, l, S, F);
}
{ // block 540
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_540); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_540);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 540 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_541(A,l,S,F){

  A[0] = l[26];
  S.push("tagName");
  A[0] = M_GET(A[0], S.pop());
  A[1] = "SCRIPT";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_541(A,l,S,F){

if (typeof TRACE === "function") TRACE(541, A, l, S, F);
t0 = v26;
t1 = t0?.tagName;
t2 = "SCRIPT";
t3 = (t1 !== t2);
F = !!(t3);
}
{ // block 541
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_541); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_541);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 541 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_548(A,l,S,F){

  A[0] = 1;
  A[1] = 10;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_548(A,l,S,F){

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
{ // block 548
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_548); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_548);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 548 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_558(A,l,S,F){


}
function LIF_558(A,l,S,F){

if (typeof TRACE === "function") TRACE(558, A, l, S, F);
}
{ // block 558
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_558); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_558);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 558 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_559(A,l,S,F){

  A[0] = l[26];
  S.push("style");
  A[0] = M_GET(A[0], S.pop());
  l[27] = A[0];
  A[0] = l[27];
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_559(A,l,S,F){

if (typeof TRACE === "function") TRACE(559, A, l, S, F);
t0 = v26;
t1 = t0?.style;
v27 = t1;
t2 = t1;
t3 = (typeof t2);
t4 = "undefined";
t5 = (t3 === t4);
F = !!(t5);
}
{ // block 559
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_559); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_559);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 559 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_569(A,l,S,F){

  A[0] = 1;
  A[1] = 9;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_569(A,l,S,F){

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
{ // block 569
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_569); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_569);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 569 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_579(A,l,S,F){


}
function LIF_579(A,l,S,F){

if (typeof TRACE === "function") TRACE(579, A, l, S, F);
}
{ // block 579
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_579); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_579);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 579 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_580(A,l,S,F){

  A[0] = SRC0;
  S.push(A[0]);
  A[0] = l[14];
  A[3] = new A[0](...S.splice(-1));
  l[28] = A[3];
  A[0] = l[28];
  A[3] = A[0]();
  S.push(A[3]);
  l[28] = A[3];
  A[0] = l[28];
  A[1] = 0;
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_580(A,l,S,F){

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
}
{ // block 580
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_580); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_580);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 580 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_594(A,l,S,F){

  A[0] = 1;
  A[1] = 8;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_594(A,l,S,F){

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
{ // block 594
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_594); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_594);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 594 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_604(A,l,S,F){


}
function LIF_604(A,l,S,F){

if (typeof TRACE === "function") TRACE(604, A, l, S, F);
}
{ // block 604
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_604); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_604);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 604 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_605(A,l,S,F){

  A[0] = SRC1;
  S.push(A[0]);
  A[0] = l[14];
  A[3] = new A[0](...S.splice(-1));
  l[29] = A[3];
  A[0] = l[29];
  A[3] = A[0]();
  S.push(A[3]);
  l[29] = A[3];
  A[0] = l[29];
  A[1] = "A";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_605(A,l,S,F){

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
}
{ // block 605
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_605); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_605);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 605 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_619(A,l,S,F){

  A[0] = 1;
  A[1] = 7;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_619(A,l,S,F){

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
{ // block 619
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_619); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_619);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 619 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_629(A,l,S,F){


}
function LIF_629(A,l,S,F){

if (typeof TRACE === "function") TRACE(629, A, l, S, F);
}
{ // block 629
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_629); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_629);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 629 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_630(A,l,S,F){

  S.push("document");
  A[0] = M_EVAL(S.pop());
  S.push("baseURI");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_630(A,l,S,F){

if (typeof TRACE === "function") TRACE(630, A, l, S, F);
t0 = document;
t1 = t0?.baseURI;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 630
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_630); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_630);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 630 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_639(A,l,S,F){

  A[0] = 1;
  A[1] = 6;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_639(A,l,S,F){

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
{ // block 639
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_639); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_639);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 639 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_649(A,l,S,F){


}
function LIF_649(A,l,S,F){

if (typeof TRACE === "function") TRACE(649, A, l, S, F);
}
{ // block 649
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_649); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_649);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 649 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_650(A,l,S,F){

  A[0] = "zhihu";
  S.push(A[0]);
  S.push("document");
  A[0] = M_EVAL(S.pop());
  S.push("baseURI");
  A[0] = M_GET(A[0], S.pop());
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_650(A,l,S,F){

if (typeof TRACE === "function") TRACE(650, A, l, S, F);
t0 = "zhihu";
t1 = document;
t2 = t1?.baseURI;
t3 = t2.indexOf(t0);
t4 = 1;
t5 = (-t4);
t6 = (t3 === t5);
F = !!(t6);
}
{ // block 650
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_650); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_650);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 650 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_663(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_663(A,l,S,F){

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
{ // block 663
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_663); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_663);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 663 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_673(A,l,S,F){


}
function LIF_673(A,l,S,F){

if (typeof TRACE === "function") TRACE(673, A, l, S, F);
}
{ // block 673
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_673); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_673);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 673 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_674(A,l,S,F){

  S.push("document");
  A[0] = M_EVAL(S.pop());
  S.push("charset");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_674(A,l,S,F){

if (typeof TRACE === "function") TRACE(674, A, l, S, F);
t0 = document;
t1 = t0?.charset;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 674
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_674); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_674);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 674 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_683(A,l,S,F){

  A[0] = 1;
  A[1] = 4;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_683(A,l,S,F){

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
{ // block 683
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_683); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_683);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 683 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_693(A,l,S,F){


}
function LIF_693(A,l,S,F){

if (typeof TRACE === "function") TRACE(693, A, l, S, F);
}
{ // block 693
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_693); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_693);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 693 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_694(A,l,S,F){

  S.push("document");
  A[0] = M_EVAL(S.pop());
  S.push("body");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_694(A,l,S,F){

if (typeof TRACE === "function") TRACE(694, A, l, S, F);
t0 = document;
t1 = t0?.body;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 694
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_694); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_694);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 694 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_703(A,l,S,F){

  A[0] = 1;
  A[1] = 3;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_703(A,l,S,F){

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
{ // block 703
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_703); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_703);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 703 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_713(A,l,S,F){


}
function LIF_713(A,l,S,F){

if (typeof TRACE === "function") TRACE(713, A, l, S, F);
}
{ // block 713
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_713); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_713);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 713 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_714(A,l,S,F){

  A[0] = "HTMLBodyElement";
  S.push(A[0]);
  S.push("document");
  A[0] = M_EVAL(S.pop());
  S.push("body");
  A[0] = M_GET(A[0], S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_714(A,l,S,F){

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
}
{ // block 714
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_714); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_714);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 714 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_729(A,l,S,F){

  A[0] = 1;
  A[1] = 2;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_729(A,l,S,F){

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
{ // block 729
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_729); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_729);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 729 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_739(A,l,S,F){


}
function LIF_739(A,l,S,F){

if (typeof TRACE === "function") TRACE(739, A, l, S, F);
}
{ // block 739
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_739); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_739);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 739 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_740(A,l,S,F){

  A[0] = "canvas";
  S.push(A[0]);
  A[0] = l[25];
  A[3] = A[0](...S.splice(-1));
  l[30] = A[3];
  A[0] = l[30];
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_740(A,l,S,F){

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
}
{ // block 740
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_740); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_740);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 740 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_751(A,l,S,F){

  A[0] = 1;
  A[1] = 1;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_751(A,l,S,F){

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
{ // block 751
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_751); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_751);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 751 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_761(A,l,S,F){


}
function LIF_761(A,l,S,F){

if (typeof TRACE === "function") TRACE(761, A, l, S, F);
}
{ // block 761
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_761); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_761);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 761 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_762(A,l,S,F){

  A[0] = "HTMLCanvasElement";
  S.push(A[0]);
  A[0] = l[30];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_762(A,l,S,F){

if (typeof TRACE === "function") TRACE(762, A, l, S, F);
t0 = "HTMLCanvasElement";
t1 = v30;
t2 = t1.toString();
t3 = t2.indexOf(t0);
t4 = 1;
t5 = (-t4);
t6 = (t3 === t5);
F = !!(t6);
}
{ // block 762
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_762); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_762);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 762 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_774(A,l,S,F){

  A[0] = 1;
  S.push(A[0]);
  l[2] = A[0];
  A[0] = l[4];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_774(A,l,S,F){

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
{ // block 774
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_774); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_774);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 774 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_782(A,l,S,F){


}
function LIF_782(A,l,S,F){

if (typeof TRACE === "function") TRACE(782, A, l, S, F);
}
{ // block 782
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_782); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_782);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 782 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_783(A,l,S,F){

  A[0] = l[30];
  S.push("getContext");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_783(A,l,S,F){

if (typeof TRACE === "function") TRACE(783, A, l, S, F);
t0 = v30;
t1 = t0?.getContext;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 783
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_783); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_783);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 783 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_791(A,l,S,F){

  A[0] = 1;
  A[1] = 14;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_791(A,l,S,F){

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
{ // block 791
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_791); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_791);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 791 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_801(A,l,S,F){


}
function LIF_801(A,l,S,F){

if (typeof TRACE === "function") TRACE(801, A, l, S, F);
}
{ // block 801
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_801); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_801);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 801 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_802(A,l,S,F){

  A[0] = "CanvasRenderingContext2D";
  S.push(A[0]);
  A[0] = "2d";
  S.push(A[0]);
  A[0] = l[30];
  S.push("getContext");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  S.push("toString");
  { const _m = S.pop(); A[3] = A[3][_m](); };
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_802(A,l,S,F){

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
}
{ // block 802
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_802); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_802);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 802 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_818(A,l,S,F){

  A[0] = 1;
  A[1] = 13;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_818(A,l,S,F){

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
{ // block 818
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_818); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_818);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 818 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_828(A,l,S,F){


}
function LIF_828(A,l,S,F){

if (typeof TRACE === "function") TRACE(828, A, l, S, F);
}
{ // block 828
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_828); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_828);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 828 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_829(A,l,S,F){

  A[0] = l[30];
  S.push("width");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_829(A,l,S,F){

if (typeof TRACE === "function") TRACE(829, A, l, S, F);
t0 = v30;
t1 = t0?.width;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 829
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_829); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_829);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 829 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_837(A,l,S,F){

  A[0] = 1;
  A[1] = 12;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_837(A,l,S,F){

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
{ // block 837
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_837); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_837);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 837 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_847(A,l,S,F){


}
function LIF_847(A,l,S,F){

if (typeof TRACE === "function") TRACE(847, A, l, S, F);
}
{ // block 847
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_847); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_847);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 847 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_848(A,l,S,F){

  A[0] = l[30];
  S.push("height");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_848(A,l,S,F){

if (typeof TRACE === "function") TRACE(848, A, l, S, F);
t0 = v30;
t1 = t0?.height;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 848
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_848); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_848);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 848 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_856(A,l,S,F){

  A[0] = 1;
  A[1] = 11;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_856(A,l,S,F){

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
{ // block 856
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_856); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_856);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 856 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_866(A,l,S,F){


}
function LIF_866(A,l,S,F){

if (typeof TRACE === "function") TRACE(866, A, l, S, F);
}
{ // block 866
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_866); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_866);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 866 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_867(A,l,S,F){

  A[0] = l[30];
  S.push("tagName");
  A[0] = M_GET(A[0], S.pop());
  A[1] = "CANVAS";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_867(A,l,S,F){

if (typeof TRACE === "function") TRACE(867, A, l, S, F);
t0 = v30;
t1 = t0?.tagName;
t2 = "CANVAS";
t3 = (t1 !== t2);
F = !!(t3);
}
{ // block 867
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_867); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_867);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 867 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_874(A,l,S,F){

  A[0] = 1;
  A[1] = 10;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_874(A,l,S,F){

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
{ // block 874
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_874); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_874);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 874 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_884(A,l,S,F){


}
function LIF_884(A,l,S,F){

if (typeof TRACE === "function") TRACE(884, A, l, S, F);
}
{ // block 884
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_884); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_884);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 884 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_885(A,l,S,F){

  A[0] = "canvas";
  S.push(A[0]);
  A[0] = l[30];
  S.push("outerHTML");
  A[0] = M_GET(A[0], S.pop());
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_885(A,l,S,F){

if (typeof TRACE === "function") TRACE(885, A, l, S, F);
t0 = "canvas";
t1 = v30;
t2 = t1?.outerHTML;
t3 = t2.indexOf(t0);
t4 = 1;
t5 = (-t4);
t6 = (t3 === t5);
F = !!(t6);
}
{ // block 885
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_885); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_885);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 885 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_897(A,l,S,F){

  A[0] = 1;
  A[1] = 9;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_897(A,l,S,F){

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
{ // block 897
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_897); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_897);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 897 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_907(A,l,S,F){


}
function LIF_907(A,l,S,F){

if (typeof TRACE === "function") TRACE(907, A, l, S, F);
}
{ // block 907
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_907); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_907);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 907 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_908(A,l,S,F){

  A[0] = l[30];
  S.push("toDataURL");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  l[31] = A[3];
  A[0] = l[31];
  S.push("length");
  A[0] = M_GET(A[0], S.pop());
  A[1] = 50;
  A[3] = A[0] < A[1];
  F = !!A[3];
}
function LIF_908(A,l,S,F){

if (typeof TRACE === "function") TRACE(908, A, l, S, F);
t0 = v30;
t1 = t0.toDataURL();
v31 = t1;
t2 = t1;
t3 = t2?.length;
t4 = 50;
t5 = (t3 < t4);
F = !!(t5);
}
{ // block 908
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_908); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_908);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 908 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_919(A,l,S,F){

  A[0] = 1;
  A[1] = 8;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_919(A,l,S,F){

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
{ // block 919
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_919); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_919);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 919 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_929(A,l,S,F){


}
function LIF_929(A,l,S,F){

if (typeof TRACE === "function") TRACE(929, A, l, S, F);
}
{ // block 929
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_929); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_929);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 929 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_930(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("buffer");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_930(A,l,S,F){

if (typeof TRACE === "function") TRACE(930, A, l, S, F);
t0 = window;
t1 = t0?.buffer;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 930
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_930); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_930);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 930 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_939(A,l,S,F){

  A[0] = 1;
  A[1] = 7;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_939(A,l,S,F){

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
{ // block 939
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_939); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_939);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 939 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_949(A,l,S,F){


}
function LIF_949(A,l,S,F){

if (typeof TRACE === "function") TRACE(949, A, l, S, F);
}
{ // block 949
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_949); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_949);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 949 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_950(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("emit");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_950(A,l,S,F){

if (typeof TRACE === "function") TRACE(950, A, l, S, F);
t0 = window;
t1 = t0?.emit;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 950
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_950); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_950);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 950 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_959(A,l,S,F){

  A[0] = 1;
  A[1] = 6;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_959(A,l,S,F){

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
{ // block 959
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_959); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_959);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 959 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_969(A,l,S,F){


}
function LIF_969(A,l,S,F){

if (typeof TRACE === "function") TRACE(969, A, l, S, F);
}
{ // block 969
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_969); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_969);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 969 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_970(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("callPhantom");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_970(A,l,S,F){

if (typeof TRACE === "function") TRACE(970, A, l, S, F);
t0 = window;
t1 = t0?.callPhantom;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 970
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_970); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_970);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 970 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_979(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_979(A,l,S,F){

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
{ // block 979
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_979); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_979);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 979 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_989(A,l,S,F){


}
function LIF_989(A,l,S,F){

if (typeof TRACE === "function") TRACE(989, A, l, S, F);
}
{ // block 989
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_989); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_989);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 989 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_990(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("__phantomas");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_990(A,l,S,F){

if (typeof TRACE === "function") TRACE(990, A, l, S, F);
t0 = window;
t1 = t0?.__phantomas;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 990
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_990); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_990);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 990 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_999(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_999(A,l,S,F){

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
{ // block 999
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_999); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_999);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 999 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1009(A,l,S,F){


}
function LIF_1009(A,l,S,F){

if (typeof TRACE === "function") TRACE(1009, A, l, S, F);
}
{ // block 1009
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1009); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1009);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1009 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1010(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("_phantom");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1010(A,l,S,F){

if (typeof TRACE === "function") TRACE(1010, A, l, S, F);
t0 = window;
t1 = t0?._phantom;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1010
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1010); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1010);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1010 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1019(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1019(A,l,S,F){

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
{ // block 1019
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1019); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1019);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1019 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1029(A,l,S,F){


}
function LIF_1029(A,l,S,F){

if (typeof TRACE === "function") TRACE(1029, A, l, S, F);
}
{ // block 1029
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1029); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1029);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1029 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1030(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("WebPage");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1030(A,l,S,F){

if (typeof TRACE === "function") TRACE(1030, A, l, S, F);
t0 = window;
t1 = t0?.WebPage;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1030
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1030); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1030);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1030 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1039(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1039(A,l,S,F){

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
{ // block 1039
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1039); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1039);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1039 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1049(A,l,S,F){


}
function LIF_1049(A,l,S,F){

if (typeof TRACE === "function") TRACE(1049, A, l, S, F);
}
{ // block 1049
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1049); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1049);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1049 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1050(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("fxdriver_id");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1050(A,l,S,F){

if (typeof TRACE === "function") TRACE(1050, A, l, S, F);
t0 = window;
t1 = t0?.fxdriver_id;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1050
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1050); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1050);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1050 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1059(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1059(A,l,S,F){

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
{ // block 1059
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1059); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1059);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1059 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1069(A,l,S,F){


}
function LIF_1069(A,l,S,F){

if (typeof TRACE === "function") TRACE(1069, A, l, S, F);
}
{ // block 1069
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1069); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1069);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1069 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1070(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("__fxdriver_unwrapped");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1070(A,l,S,F){

if (typeof TRACE === "function") TRACE(1070, A, l, S, F);
t0 = window;
t1 = t0?.__fxdriver_unwrapped;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1070
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1070); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1070);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1070 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1079(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1079(A,l,S,F){

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
{ // block 1079
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1079); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1079);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1079 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1089(A,l,S,F){


}
function LIF_1089(A,l,S,F){

if (typeof TRACE === "function") TRACE(1089, A, l, S, F);
}
{ // block 1089
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1089); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1089);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1089 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1090(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("ubot");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1090(A,l,S,F){

if (typeof TRACE === "function") TRACE(1090, A, l, S, F);
t0 = window;
t1 = t0?.ubot;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1090
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1090); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1090);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1090 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1099(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1099(A,l,S,F){

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
{ // block 1099
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1099); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1099);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1099 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1109(A,l,S,F){


}
function LIF_1109(A,l,S,F){

if (typeof TRACE === "function") TRACE(1109, A, l, S, F);
}
{ // block 1109
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1109); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1109);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1109 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1110(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("CasperError");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1110(A,l,S,F){

if (typeof TRACE === "function") TRACE(1110, A, l, S, F);
t0 = window;
t1 = t0?.CasperError;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1110
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1110); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1110);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1110 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1119(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1119(A,l,S,F){

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
{ // block 1119
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1119); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1119);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1119 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1129(A,l,S,F){


}
function LIF_1129(A,l,S,F){

if (typeof TRACE === "function") TRACE(1129, A, l, S, F);
}
{ // block 1129
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1129); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1129);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1129 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1130(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("casper");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1130(A,l,S,F){

if (typeof TRACE === "function") TRACE(1130, A, l, S, F);
t0 = window;
t1 = t0?.casper;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1130
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1130); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1130);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1130 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1139(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1139(A,l,S,F){

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
{ // block 1139
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1139); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1139);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1139 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1149(A,l,S,F){


}
function LIF_1149(A,l,S,F){

if (typeof TRACE === "function") TRACE(1149, A, l, S, F);
}
{ // block 1149
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1149); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1149);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1149 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1150(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("patchRequire");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1150(A,l,S,F){

if (typeof TRACE === "function") TRACE(1150, A, l, S, F);
t0 = window;
t1 = t0?.patchRequire;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1150
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1150); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1150);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1150 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1159(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1159(A,l,S,F){

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
{ // block 1159
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1159); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1159);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1159 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1169(A,l,S,F){


}
function LIF_1169(A,l,S,F){

if (typeof TRACE === "function") TRACE(1169, A, l, S, F);
}
{ // block 1169
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1169); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1169);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1169 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1170(A,l,S,F){

  S.push("document");
  A[0] = M_EVAL(S.pop());
  S.push("$cdc_asdjflasutopfhvcZLmcfl_");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1170(A,l,S,F){

if (typeof TRACE === "function") TRACE(1170, A, l, S, F);
t0 = document;
t1 = t0?.$cdc_asdjflasutopfhvcZLmcfl_;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1170
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1170); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1170);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1170 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1179(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1179(A,l,S,F){

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
{ // block 1179
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1179); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1179);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1179 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1189(A,l,S,F){


}
function LIF_1189(A,l,S,F){

if (typeof TRACE === "function") TRACE(1189, A, l, S, F);
}
{ // block 1189
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1189); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1189);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1189 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1190(A,l,S,F){

  S.push("navigator");
  A[0] = M_EVAL(S.pop());
  S.push("webdriver");
  A[0] = M_GET(A[0], S.pop());
  A[1] = "true";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_1190(A,l,S,F){

if (typeof TRACE === "function") TRACE(1190, A, l, S, F);
t0 = navigator;
t1 = t0?.webdriver;
t2 = "true";
t3 = (t1 === t2);
F = !!(t3);
}
{ // block 1190
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1190); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1190);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1190 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1198(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1198(A,l,S,F){

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
{ // block 1198
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1198); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1198);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1198 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1208(A,l,S,F){


}
function LIF_1208(A,l,S,F){

if (typeof TRACE === "function") TRACE(1208, A, l, S, F);
}
{ // block 1208
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1208); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1208);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1208 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1209(A,l,S,F){

  S.push("document");
  A[0] = M_EVAL(S.pop());
  S.push("__webdriver_script_fn");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1209(A,l,S,F){

if (typeof TRACE === "function") TRACE(1209, A, l, S, F);
t0 = document;
t1 = t0?.__webdriver_script_fn;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1209
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1209); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1209);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1209 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1218(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1218(A,l,S,F){

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
{ // block 1218
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1218); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1218);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1218 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1228(A,l,S,F){


}
function LIF_1228(A,l,S,F){

if (typeof TRACE === "function") TRACE(1228, A, l, S, F);
}
{ // block 1228
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1228); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1228);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1228 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1229(A,l,S,F){

  A[0] = l[11];
  S.push("_resourceLoader");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1229(A,l,S,F){

if (typeof TRACE === "function") TRACE(1229, A, l, S, F);
t0 = v11;
t1 = t0?._resourceLoader;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1229
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1229); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1229);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1229 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1237(A,l,S,F){

  A[0] = 1;
  A[1] = 4;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1237(A,l,S,F){

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
{ // block 1237
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1237); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1237);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1237 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1247(A,l,S,F){


}
function LIF_1247(A,l,S,F){

if (typeof TRACE === "function") TRACE(1247, A, l, S, F);
}
{ // block 1247
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1247); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1247);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1247 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1248(A,l,S,F){

  A[0] = l[11];
  S.push("_sessionHistory");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1248(A,l,S,F){

if (typeof TRACE === "function") TRACE(1248, A, l, S, F);
t0 = v11;
t1 = t0?._sessionHistory;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1248
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1248); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1248);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1248 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1256(A,l,S,F){

  A[0] = 1;
  A[1] = 4;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1256(A,l,S,F){

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
{ // block 1256
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1256); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1256);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1256 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1266(A,l,S,F){


}
function LIF_1266(A,l,S,F){

if (typeof TRACE === "function") TRACE(1266, A, l, S, F);
}
{ // block 1266
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1266); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1266);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1266 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1267(A,l,S,F){

  A[0] = l[11];
  S.push("_virtualConsole");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1267(A,l,S,F){

if (typeof TRACE === "function") TRACE(1267, A, l, S, F);
t0 = v11;
t1 = t0?._virtualConsole;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1267
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1267); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1267);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1267 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1275(A,l,S,F){

  A[0] = 1;
  A[1] = 4;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1275(A,l,S,F){

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
{ // block 1275
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1275); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1275);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1275 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1285(A,l,S,F){


}
function LIF_1285(A,l,S,F){

if (typeof TRACE === "function") TRACE(1285, A, l, S, F);
}
{ // block 1285
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1285); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1285);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1285 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1286(A,l,S,F){

  S.push("localStorage");
  A[0] = M_EVAL(S.pop());
  S.push("setItem");
  A[0] = M_GET(A[0], S.pop());
  l[32] = A[0];
  A[0] = l[32];
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_1286(A,l,S,F){

if (typeof TRACE === "function") TRACE(1286, A, l, S, F);
t0 = localStorage;
t1 = t0?.setItem;
v32 = t1;
t2 = t1;
t3 = (typeof t2);
t4 = "undefined";
t5 = (t3 === t4);
F = !!(t5);
}
{ // block 1286
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1286); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1286);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1286 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1297(A,l,S,F){

  A[0] = 1;
  A[1] = 3;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1297(A,l,S,F){

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
{ // block 1297
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1297); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1297);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1297 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1307(A,l,S,F){


}
function LIF_1307(A,l,S,F){

if (typeof TRACE === "function") TRACE(1307, A, l, S, F);
}
{ // block 1307
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1307); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1307);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1307 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1308(A,l,S,F){

  S.push("localStorage");
  A[0] = M_EVAL(S.pop());
  S.push(A[0]);
  A[0] = 2039;
  A[3] = SUBCALL(A, l, S, 0, 1);
  l[33] = A[3];
  A[0] = l[33];
  A[1] = 1;
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_1308(A,l,S,F){

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
}
{ // block 1308
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1308); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1308);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1308 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1319(A,l,S,F){

  A[0] = 1;
  A[1] = 2;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1319(A,l,S,F){

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
{ // block 1319
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1319); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1319);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1319 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1329(A,l,S,F){


}
function LIF_1329(A,l,S,F){

if (typeof TRACE === "function") TRACE(1329, A, l, S, F);
}
{ // block 1329
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1329); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1329);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1329 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1330(A,l,S,F){

  S.push("sessionStorage");
  A[0] = M_EVAL(S.pop());
  S.push(A[0]);
  A[0] = 2039;
  A[3] = SUBCALL(A, l, S, 0, 1);
  l[34] = A[3];
  A[0] = l[34];
  A[1] = 1;
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_1330(A,l,S,F){

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
}
{ // block 1330
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1330); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1330);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1330 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1341(A,l,S,F){

  A[0] = 1;
  A[1] = 1;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1341(A,l,S,F){

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
{ // block 1341
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1341); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1341);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1341 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1351(A,l,S,F){


}
function LIF_1351(A,l,S,F){

if (typeof TRACE === "function") TRACE(1351, A, l, S, F);
}
{ // block 1351
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1351); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1351);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1351 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1352(A,l,S,F){

  S.push("screen");
  A[0] = M_EVAL(S.pop());
  S.push(A[0]);
  A[0] = l[8];
  S.push(A[0]);
  S.push("Proxy");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-2));
  l[35] = A[3];
  A[0] = l[35];
  S.push(A[0]);
  A[0] = 2146;
  A[3] = SUBCALL(A, l, S, 0, 1);
  l[36] = A[3];
  A[0] = l[36];
  A[1] = 1;
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_1352(A,l,S,F){

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
}
{ // block 1352
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1352); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1352);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1352 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1371(A,l,S,F){

  A[0] = 1;
  S.push(A[0]);
  l[2] = A[0];
  A[0] = l[5];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[5] = A[3];
}
function LIF_1371(A,l,S,F){

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
{ // block 1371
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1371); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1371);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1371 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1379(A,l,S,F){


}
function LIF_1379(A,l,S,F){

if (typeof TRACE === "function") TRACE(1379, A, l, S, F);
}
{ // block 1379
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1379); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1379);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1379 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1380(A,l,S,F){

  A[0] = "try{var a=0;var b=new Error;Object.defineProperty(b,\"stack\",{get:function(){a++}});console.debug(b);b.stack;return a>1}catch(_){return true}";
  S.push(A[0]);
  A[0] = l[14];
  A[3] = new A[0](...S.splice(-1));
  l[37] = A[3];
  A[0] = l[37];
  A[3] = A[0]();
  S.push(A[3]);
  l[38] = A[3];
  A[0] = l[38];
  F = !!A[0];
}
function LIF_1380(A,l,S,F){

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
}
{ // block 1380
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1380); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1380);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1380 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1392(A,l,S,F){

  A[0] = 1;
  A[1] = 15;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1392(A,l,S,F){

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
{ // block 1392
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1392); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1392);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1392 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1402(A,l,S,F){


}
function LIF_1402(A,l,S,F){

if (typeof TRACE === "function") TRACE(1402, A, l, S, F);
}
{ // block 1402
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1402); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1402);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1402 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1403(A,l,S,F){

  S.push("Document");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  l[39] = A[3];
  A[0] = l[39];
  S.push("all");
  A[0] = M_GET(A[0], S.pop());
  l[40] = A[0];
  A[0] = l[40];
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1403(A,l,S,F){

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
}
{ // block 1403
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1403); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1403);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1403 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1417(A,l,S,F){

  A[0] = 1;
  A[1] = 13;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1417(A,l,S,F){

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
{ // block 1417
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1417); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1417);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1417 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1427(A,l,S,F){


}
function LIF_1427(A,l,S,F){

if (typeof TRACE === "function") TRACE(1427, A, l, S, F);
}
{ // block 1427
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1427); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1427);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1427 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1428(A,l,S,F){

  A[0] = l[40];
  S.push("length");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "number";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1428(A,l,S,F){

if (typeof TRACE === "function") TRACE(1428, A, l, S, F);
t0 = v40;
t1 = t0?.length;
t2 = (typeof t1);
t3 = "number";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1428
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1428); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1428);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1428 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1436(A,l,S,F){

  A[0] = 1;
  A[1] = 12;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1436(A,l,S,F){

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
{ // block 1436
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1436); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1436);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1436 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1446(A,l,S,F){


}
function LIF_1446(A,l,S,F){

if (typeof TRACE === "function") TRACE(1446, A, l, S, F);
}
{ // block 1446
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1446); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1446);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1446 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1447(A,l,S,F){

  A[0] = "try{return new Document().all()}catch(_){}";
  S.push(A[0]);
  A[0] = l[14];
  A[3] = new A[0](...S.splice(-1));
  S.push(A[3]);
  l[41] = A[3];
  A[0] = l[41];
  A[3] = A[0]();
  S.push(A[3]);
  l[42] = A[3];
  A[0] = l[42];
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_1447(A,l,S,F){

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
}
{ // block 1447
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1447); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1447);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1447 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1463(A,l,S,F){

  A[0] = 1;
  A[1] = 11;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1463(A,l,S,F){

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
{ // block 1463
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1463); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1463);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1463 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1473(A,l,S,F){


}
function LIF_1473(A,l,S,F){

if (typeof TRACE === "function") TRACE(1473, A, l, S, F);
}
{ // block 1473
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1473); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1473);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1473 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1474(A,l,S,F){

  A[0] = "HTMLAllCollection";
  S.push(A[0]);
  A[0] = l[40];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_1474(A,l,S,F){

if (typeof TRACE === "function") TRACE(1474, A, l, S, F);
t0 = "HTMLAllCollection";
t1 = v40;
t2 = t1.toString();
t3 = t2.indexOf(t0);
t4 = 1;
t5 = (-t4);
t6 = (t3 === t5);
F = !!(t6);
}
{ // block 1474
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1474); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1474);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1474 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1486(A,l,S,F){

  A[0] = 1;
  A[1] = 10;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1486(A,l,S,F){

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
{ // block 1486
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1486); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1486);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1486 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1496(A,l,S,F){


}
function LIF_1496(A,l,S,F){

if (typeof TRACE === "function") TRACE(1496, A, l, S, F);
}
{ // block 1496
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1496); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1496);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1496 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1497(A,l,S,F){

  A[0] = "try{return process}catch(_){}";
  S.push(A[0]);
  A[0] = l[14];
  A[3] = new A[0](...S.splice(-1));
  l[43] = A[3];
  A[0] = l[43];
  A[3] = A[0]();
  l[44] = A[3];
  A[0] = l[44];
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1497(A,l,S,F){

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
}
{ // block 1497
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1497); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1497);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1497 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1511(A,l,S,F){

  A[0] = 1;
  A[1] = 9;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1511(A,l,S,F){

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
{ // block 1511
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1511); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1511);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1511 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1521(A,l,S,F){


}
function LIF_1521(A,l,S,F){

if (typeof TRACE === "function") TRACE(1521, A, l, S, F);
}
{ // block 1521
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1521); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1521);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1521 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1522(A,l,S,F){

  A[0] = "try{return global}catch(_){}";
  S.push(A[0]);
  A[0] = l[14];
  A[3] = new A[0](...S.splice(-1));
  l[45] = A[3];
  A[0] = l[45];
  A[3] = A[0]();
  l[46] = A[3];
  A[0] = l[46];
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1522(A,l,S,F){

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
}
{ // block 1522
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1522); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1522);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1522 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1536(A,l,S,F){

  A[0] = 1;
  A[1] = 8;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1536(A,l,S,F){

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
{ // block 1536
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1536); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1536);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1536 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1546(A,l,S,F){


}
function LIF_1546(A,l,S,F){

if (typeof TRACE === "function") TRACE(1546, A, l, S, F);
}
{ // block 1546
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1546); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1546);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1546 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1547(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("document");
  A[0] = M_GET(A[0], S.pop());
  A[1] = l[16];
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1547(A,l,S,F){

if (typeof TRACE === "function") TRACE(1547, A, l, S, F);
t0 = window;
t1 = t0?.document;
t2 = v16;
t3 = (t1 !== t2);
F = !!(t3);
}
{ // block 1547
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1547); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1547);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1547 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1555(A,l,S,F){

  A[0] = 1;
  A[1] = 7;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1555(A,l,S,F){

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
{ // block 1555
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1555); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1555);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1555 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1565(A,l,S,F){


}
function LIF_1565(A,l,S,F){

if (typeof TRACE === "function") TRACE(1565, A, l, S, F);
}
{ // block 1565
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1565); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1565);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1565 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1566(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("global");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1566(A,l,S,F){

if (typeof TRACE === "function") TRACE(1566, A, l, S, F);
t0 = window;
t1 = t0?.global;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 1566
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1566); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1566);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1566 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1575(A,l,S,F){

  A[0] = 1;
  A[1] = 6;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1575(A,l,S,F){

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
{ // block 1575
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1575); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1575);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1575 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1585(A,l,S,F){


}
function LIF_1585(A,l,S,F){

if (typeof TRACE === "function") TRACE(1585, A, l, S, F);
}
{ // block 1585
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1585); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1585);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1585 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1586(A,l,S,F){

  A[0] = "native";
  S.push(A[0]);
  S.push("setTimeout");
  A[0] = M_EVAL(S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_1586(A,l,S,F){

if (typeof TRACE === "function") TRACE(1586, A, l, S, F);
t0 = "native";
t1 = setTimeout;
t2 = t1.toString();
t3 = t2.indexOf(t0);
t4 = 1;
t5 = (-t4);
t6 = (t3 === t5);
F = !!(t6);
}
{ // block 1586
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1586); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1586);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1586 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1599(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1599(A,l,S,F){

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
{ // block 1599
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1599); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1599);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1599 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1609(A,l,S,F){


}
function LIF_1609(A,l,S,F){

if (typeof TRACE === "function") TRACE(1609, A, l, S, F);
}
{ // block 1609
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1609); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1609);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1609 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1610(A,l,S,F){

  A[0] = "native";
  S.push(A[0]);
  S.push("setInterval");
  A[0] = M_EVAL(S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_1610(A,l,S,F){

if (typeof TRACE === "function") TRACE(1610, A, l, S, F);
t0 = "native";
t1 = setInterval;
t2 = t1.toString();
t3 = t2.indexOf(t0);
t4 = 1;
t5 = (-t4);
t6 = (t3 === t5);
F = !!(t6);
}
{ // block 1610
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1610); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1610);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1610 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1623(A,l,S,F){

  A[0] = 1;
  A[1] = 4;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1623(A,l,S,F){

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
{ // block 1623
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1623); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1623);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1623 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1633(A,l,S,F){


}
function LIF_1633(A,l,S,F){

if (typeof TRACE === "function") TRACE(1633, A, l, S, F);
}
{ // block 1633
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1633); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1633);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1633 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1634(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("URL");
  A[0] = M_GET(A[0], S.pop());
  l[47] = A[0];
  A[0] = "https://www.zhihu.com";
  S.push(A[0]);
  A[0] = l[47];
  A[3] = new A[0](...S.splice(-1));
  l[48] = A[3];
  A[0] = l[48];
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_1634(A,l,S,F){

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
}
{ // block 1634
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1634); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1634);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1634 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1650(A,l,S,F){

  A[0] = 1;
  A[1] = 3;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1650(A,l,S,F){

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
{ // block 1650
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1650); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1650);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1650 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1660(A,l,S,F){


}
function LIF_1660(A,l,S,F){

if (typeof TRACE === "function") TRACE(1660, A, l, S, F);
}
{ // block 1660
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1660); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1660);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1660 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1661(A,l,S,F){

  A[0] = "native";
  S.push(A[0]);
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("stop");
  A[0] = M_GET(A[0], S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_1661(A,l,S,F){

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
}
{ // block 1661
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1661); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1661);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1661 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1676(A,l,S,F){

  A[0] = 1;
  A[1] = 2;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1676(A,l,S,F){

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
{ // block 1676
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1676); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1676);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1676 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1686(A,l,S,F){


}
function LIF_1686(A,l,S,F){

if (typeof TRACE === "function") TRACE(1686, A, l, S, F);
}
{ // block 1686
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1686); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1686);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1686 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1687(A,l,S,F){

  A[0] = "cmV0dXJuIHdpbmRvdy5NZWRpYVNvdXJjZSAmJiB3aW5kb3cuTWVkaWFTb3VyY2UuaXNUeXBlU3VwcG9ydGVkICYmIHdpbmRvdy5NZWRpYVNvdXJjZS5pc1R5cGVTdXBwb3J0ZWQoJ3ZpZGVvL21wNDsgY29kZWNzPSJhdmMxLjQyRTAxRSInKQ==";
  S.push(A[0]);
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("atob");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[49] = A[3];
  A[0] = l[49];
  S.push(A[0]);
  A[0] = l[14];
  A[3] = new A[0](...S.splice(-1));
  l[50] = A[3];
  A[0] = l[50];
  A[3] = A[0]();
  l[51] = A[3];
  A[0] = l[51];
  A[1] = "true";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1687(A,l,S,F){

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
}
{ // block 1687
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1687); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1687);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1687 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1707(A,l,S,F){

  A[0] = 1;
  A[1] = 1;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1707(A,l,S,F){

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
{ // block 1707
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1707); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1707);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1707 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1717(A,l,S,F){


}
function LIF_1717(A,l,S,F){

if (typeof TRACE === "function") TRACE(1717, A, l, S, F);
}
{ // block 1717
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1717); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1717);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1717 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1718(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("top");
  A[0] = M_GET(A[0], S.pop());
  S.push("window");
  A[1] = M_EVAL(S.pop());
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_1718(A,l,S,F){

if (typeof TRACE === "function") TRACE(1718, A, l, S, F);
t0 = window;
t1 = t0?.top;
t2 = window;
t3 = (t1 !== t2);
F = !!(t3);
}
{ // block 1718
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1718); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1718);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1718 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1727(A,l,S,F){

  A[0] = 1;
  S.push(A[0]);
  l[2] = A[0];
  A[0] = l[6];
  A[1] = l[2];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[6] = A[3];
}
function LIF_1727(A,l,S,F){

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
{ // block 1727
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1727); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1727);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1727 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1735(A,l,S,F){


}
function LIF_1735(A,l,S,F){

if (typeof TRACE === "function") TRACE(1735, A, l, S, F);
}
{ // block 1735
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1735); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1735);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1735 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1736(A,l,S,F){

  A[0] = 16;
  S.push(A[0]);
  A[0] = l[3];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[52] = A[3];
  A[0] = 16;
  S.push(A[0]);
  A[0] = l[4];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[53] = A[3];
  A[0] = 16;
  S.push(A[0]);
  A[0] = l[5];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[54] = A[3];
  A[0] = 16;
  S.push(A[0]);
  A[0] = l[6];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[55] = A[3];
  A[0] = 2227;
  A[3] = SUBCALL(A, l, S, 0, 0);
  l[56] = A[3];
  A[0] = 2289;
  A[3] = SUBCALL(A, l, S, 0, 0);
  l[57] = A[3];
  S.push("Error");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  S.push("stack");
  A[3] = M_GET(A[3], S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[3][_m](); };
  l[58] = A[3];
  A[0] = l[56];
  A[1] = l[57];
  A[3] = A[0] + A[1];
  S.push(A[3]);
  l[56] = A[3];
  A[0] = l[56];
  S.push(A[0]);
  A[0] = "acc7471d3eb9bc30";
  S.push(A[0]);
  A[0] = 1832;
  A[3] = SUBCALL(A, l, S, 0, 2);
  S.push(A[3]);
  l[56] = A[3];
  A[0] = l[52];
  A[1] = l[53];
  A[3] = A[0] + A[1];
  A[0] = l[54];
  A[3] = A[3] + A[0];
  A[0] = l[55];
  A[3] = A[3] + A[0];
  l[59] = A[3];
  A[0] = l[59];
  S.push(A[0]);
  A[0] = "f25b8434cca9a1f5";
  S.push(A[0]);
  A[0] = 1832;
  A[3] = SUBCALL(A, l, S, 0, 2);
  S.push(A[3]);
  l[59] = A[3];
  A[0] = l[58];
  S.push(A[0]);
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("btoa");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  S.push(A[3]);
  l[58] = A[3];
  A[0] = l[56];
  A[1] = l[7];
  A[3] = A[0] + A[1];
  A[0] = l[59];
  A[3] = A[3] + A[0];
  A[0] = l[7];
  A[3] = A[3] + A[0];
  A[0] = l[58];
  A[3] = A[3] + A[0];
  A[0] = l[7];
  A[3] = A[3] + A[0];
  l[60] = A[3];
  A[0] = l[60];
  S.push(A[0]);
  S.push(A[0]);
  S.push("__b");
  A[0] = M_EVAL(S.pop());
  S.push("zh");
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
}
function LIF_1736(A,l,S,F){

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
{ // block 1736
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1736); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1736);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1736 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1830(A,l,S,F){


}
function LIF_1830(A,l,S,F){

if (typeof TRACE === "function") TRACE(1830, A, l, S, F);
}
{ // block 1830
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1830); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1830);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1830 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1849(A,l,S,F){

  A[0] = l[66];
  A[1] = l[63];
  A[3] = A[0] < A[1];
  F = !!A[3];
}
function LIF_1849(A,l,S,F){

if (typeof TRACE === "function") TRACE(1849, A, l, S, F);
t0 = v66;
t1 = v63;
t2 = (t0 < t1);
F = !!(t2);
}
{ // block 1849
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1849); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1849);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1849 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_1854(A,l,S,F){

  A[0] = l[66];
  S.push(A[0]);
  A[0] = l[0];
  S.push("charCodeAt");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[67] = A[3];
  A[0] = l[66];
  A[1] = l[64];
  A[3] = A[0] % A[1];
  l[68] = A[3];
  A[0] = l[68];
  S.push(A[0]);
  A[0] = l[1];
  S.push("charCodeAt");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[69] = A[3];
  A[0] = l[67];
  A[1] = l[69];
  A[3] = A[0] ^ A[1];
  A[0] = l[65];
  A[3] = A[3] ^ A[0];
  l[70] = A[3];
  A[0] = l[70];
  S.push(A[0]);
  l[65] = A[0];
  A[0] = l[70];
  S.push(A[0]);
  S.push("String");
  A[0] = M_EVAL(S.pop());
  S.push("fromCharCode");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[71] = A[3];
  A[0] = l[62];
  A[1] = l[71];
  A[3] = A[0] + A[1];
  S.push(A[3]);
  l[62] = A[3];
  A[0] = l[66];
  A[1] = 1;
  A[1] = A[0] + A[1];
  l[66] = A[1];
}
function LIF_1854(A,l,S,F){

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
}
{ // block 1854
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_1854); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_1854);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 1854 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
console.log("  per-block differential: 302 blocks, "+PASS+" pass, "+FAIL+" fail");
if (typeof process !== "undefined") process.exit(FAIL?1:0);
