
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

  A[0] = 7;
  l[0] = A[0];
  A[0] = l[0];
  A[1] = 6;
  A[3] = A[0] > A[1];
  F = !!A[3];
}
function LIF_0(A,l,S,F){

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
}
{ // block 0
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_0); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_0);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 0 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_742(A,l,S,F){

  S.length = 0; F = undefined;
  S.push("Object");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  l[1] = A[3];
  A[0] = "a";
  S.push(A[0]);
  A[0] = "b";
  S.push(A[0]);
  A[0] = "return b in a ? a[b]: undefined";
  S.push(A[0]);
  S.push("Function");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-3));
  l[2] = A[3];
  A[0] = l[2];
  S.push(A[0]);
  S.push(A[0]);
  A[0] = "get";
  S.push(A[0]);
  A[0] = l[1];
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  A[0] = "get";
  S.push(A[0]);
  A[0] = l[1];
  A[0] = M_GET(A[0], S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("length");
  A[3] = M_GET(A[3], S.pop());
  l[23] = A[3];
  S.push("BVM");
  A[0] = M_EVAL(S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  l[24] = A[3];
  A[0] = l[23];
  A[1] = 60;
  A[3] = A[0] > A[1];
  F = !!A[3];
}
function LIF_742(A,l,S,F){

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
}
{ // block 742
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_742); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_742);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 742 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_783(A,l,S,F){
    S.push(t0);
  A[3] = 5;
}
function LIF_783(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(783, A, l, S, F);
t0 = 5;
A[3] = t0;
}
{ // block 783
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_783); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_783);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 783 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_785(A,l,S,F){
    S.push(t0);

}
function LIF_785(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(785, A, l, S, F);
}
{ // block 785
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_785); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_785);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 785 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_786(A,l,S,F){
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
function LIF_786(A,l,S,F){
    S.push(t0);
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
}
{ // block 786
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_786); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_786);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 786 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_795(A,l,S,F){
    S.push(t0);
  A[3] = 5;
}
function LIF_795(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(795, A, l, S, F);
t0 = 5;
A[3] = t0;
}
{ // block 795
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_795); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_795);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 795 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_797(A,l,S,F){
    S.push(t0);

}
function LIF_797(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(797, A, l, S, F);
}
{ // block 797
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_797); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_797);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 797 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_798(A,l,S,F){
    S.push(t0);
  A[0] = "onsol";
  S.push(A[0]);
  A[0] = l[24];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] !== A[0];
  F = !!A[3];
}
function LIF_798(A,l,S,F){
    S.push(t0);
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
}
{ // block 798
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_798); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_798);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 798 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_808(A,l,S,F){
    S.push(t0);
  A[3] = 5;
}
function LIF_808(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(808, A, l, S, F);
t0 = 5;
A[3] = t0;
}
{ // block 808
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_808); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_808);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 808 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_810(A,l,S,F){
    S.push(t0);

}
function LIF_810(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(810, A, l, S, F);
}
{ // block 810
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_810); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_810);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 810 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_811(A,l,S,F){
    S.push(t0);
  S.push("Error");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  S.push("stack");
  A[3] = M_GET(A[3], S.pop());
  l[25] = A[3];
  A[0] = "node";
  S.push(A[0]);
  A[0] = l[25];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] !== A[0];
  F = !!A[3];
}
function LIF_811(A,l,S,F){
    S.push(t0);
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
}
{ // block 811
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_811); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_811);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 811 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_827(A,l,S,F){
    S.push(t0);
  A[3] = 5;
}
function LIF_827(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(827, A, l, S, F);
t0 = 5;
A[3] = t0;
}
{ // block 827
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_827); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_827);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 827 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_829(A,l,S,F){
    S.push(t0);

}
function LIF_829(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(829, A, l, S, F);
}
{ // block 829
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_829); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_829);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 829 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_830(A,l,S,F){
    S.push(t0);
  A[0] = "executeUserEntryPoint";
  S.push(A[0]);
  A[0] = l[25];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] !== A[0];
  F = !!A[3];
}
function LIF_830(A,l,S,F){
    S.push(t0);
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
}
{ // block 830
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_830); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_830);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 830 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_840(A,l,S,F){
    S.push(t0);
  A[3] = 5;
}
function LIF_840(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(840, A, l, S, F);
t0 = 5;
A[3] = t0;
}
{ // block 840
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_840); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_840);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 840 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_842(A,l,S,F){
    S.push(t0);

}
function LIF_842(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(842, A, l, S, F);
}
{ // block 842
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_842); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_842);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 842 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_843(A,l,S,F){
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
function LIF_843(A,l,S,F){
    S.push(t0);
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
}
{ // block 843
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_843); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_843);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 843 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_860(A,l,S,F){
    S.push(t0);
  A[3] = 5;
}
function LIF_860(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(860, A, l, S, F);
t0 = 5;
A[3] = t0;
}
{ // block 860
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_860); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_860);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 860 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_862(A,l,S,F){
    S.push(t0);

}
function LIF_862(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(862, A, l, S, F);
}
{ // block 862
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_862); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_862);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 862 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_863(A,l,S,F){
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
function LIF_863(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(863, A, l, S, F);
t0 = window;
t1 = t0?.v_log;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
A[0] = t2;
A[1] = t3;
}
{ // block 863
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_863); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_863);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 863 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_872(A,l,S,F){
    S.push(t0);
  A[3] = 5;
}
function LIF_872(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(872, A, l, S, F);
t0 = 5;
A[3] = t0;
}
{ // block 872
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_872); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_872);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 872 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_874(A,l,S,F){
    S.push(t0);

}
function LIF_874(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(874, A, l, S, F);
}
{ // block 874
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_874); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_874);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 874 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_875(A,l,S,F){
    S.push(t0);
  A[3] = 10;
}
function LIF_875(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(875, A, l, S, F);
t0 = 10;
A[3] = t0;
}
{ // block 875
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_875); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_875);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 875 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_877(A,l,S,F){

  A[0] = "";
  l[28] = A[0];
  A[0] = l[0];
  S.push("length");
  A[0] = M_GET(A[0], S.pop());
  l[29] = A[0];
  A[0] = l[1];
  S.push("length");
  A[0] = M_GET(A[0], S.pop());
  l[30] = A[0];
  S.push("__b");
  A[0] = M_EVAL(S.pop());
  S.push("a3");
  A[0] = M_GET(A[0], S.pop());
  l[31] = A[0];
  A[0] = 0;
  l[32] = A[0];
}
function LIF_877(A,l,S,F){

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
}
{ // block 877
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_877); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_877);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 877 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_941(A,l,S,F){

  A[0] = l[31];
  S.push(A[0]);
  S.push(A[0]);
  S.push("__b");
  A[0] = M_EVAL(S.pop());
  S.push("a3");
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  A[3] = l[28];
}
function LIF_941(A,l,S,F){

if (typeof TRACE === "function") TRACE(941, A, l, S, F);
t0 = v31;
t1 = __b;
M_SET(t1, "a3", t0);
t2 = v28;
A[0] = t1;
A[3] = t2;
}
{ // block 941
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_941); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_941);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 941 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_7(A,l,S,F){

  A[0] = "window={};document={};";
  S.push(A[0]);
  S.push("eval");
  A[0] = M_EVAL(S.pop());
  S.push("Object");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  l[1] = A[3];
  A[0] = "a";
  S.push(A[0]);
  A[0] = "b";
  S.push(A[0]);
  A[0] = "return b in a ? a[b]: undefined";
  S.push(A[0]);
  S.push("Function");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-3));
  l[2] = A[3];
  A[0] = l[2];
  S.push(A[0]);
  S.push(A[0]);
  A[0] = "get";
  S.push(A[0]);
  A[0] = l[1];
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
  l[3] = A[3];
  A[0] = l[3];
  S.push(A[0]);
  S.push(A[0]);
  A[0] = "set";
  S.push(A[0]);
  A[0] = l[1];
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push(A[0]);
  A[0] = l[1];
  S.push(A[0]);
  S.push("Proxy");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-2));
  l[4] = A[3];
  A[0] = l[4];
  S.push("Function");
  A[0] = M_GET(A[0], S.pop());
  l[5] = A[0];
  A[0] = l[4];
  S.push("document");
  A[0] = M_GET(A[0], S.pop());
  l[6] = A[0];
  A[0] = 1;
  A[1] = 15;
  A[3] = A[0] << A[1];
  l[7] = A[3];
  A[0] = 1;
  A[1] = 14;
  A[3] = A[0] << A[1];
  l[8] = A[3];
  A[0] = 1;
  A[1] = 13;
  A[3] = A[0] << A[1];
  l[9] = A[3];
  A[0] = 1;
  A[1] = 12;
  A[3] = A[0] << A[1];
  l[10] = A[3];
  A[0] = SRC0;
  S.push(A[0]);
  A[0] = l[5];
  A[3] = new A[0](...S.splice(-1));
  l[11] = A[3];
  A[0] = l[11];
  A[3] = A[0]();
  l[12] = A[3];
  A[0] = l[12];
  A[1] = 1;
  A[3] = A[0] > A[1];
  F = !!A[3];
}
function LIF_7(A,l,S,F){

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
}
{ // block 7
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_7); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_7);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 7 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_97(A,l,S,F){

  A[0] = 1;
  A[1] = 14;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_97(A,l,S,F){

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
{ // block 97
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_97); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_97);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 97 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_107(A,l,S,F){


}
function LIF_107(A,l,S,F){

if (typeof TRACE === "function") TRACE(107, A, l, S, F);
}
{ // block 107
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_107); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_107);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 107 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_108(A,l,S,F){

  A[0] = "a";
  S.push(A[0]);
  A[0] = "try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}";
  S.push(A[0]);
  A[0] = l[5];
  A[3] = new A[0](...S.splice(-2));
  l[14] = A[3];
  A[0] = ":defined";
  S.push(A[0]);
  A[0] = l[14];
  A[3] = A[0](...S.splice(-1));
  l[15] = A[3];
  A[0] = l[15];
  A[1] = 2;
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_108(A,l,S,F){

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
}
{ // block 108
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_108); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_108);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 108 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_125(A,l,S,F){

  A[0] = 1;
  A[1] = 13;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_125(A,l,S,F){

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
{ // block 125
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_125); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_125);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 125 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_135(A,l,S,F){


}
function LIF_135(A,l,S,F){

if (typeof TRACE === "function") TRACE(135, A, l, S, F);
}
{ // block 135
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_135); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_135);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 135 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_136(A,l,S,F){

  A[0] = "div:not(:has(div))";
  S.push(A[0]);
  A[0] = l[14];
  A[3] = A[0](...S.splice(-1));
  l[15] = A[3];
  A[0] = l[15];
  A[1] = 2;
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_136(A,l,S,F){

if (typeof TRACE === "function") TRACE(136, A, l, S, F);
t0 = "div:not(:has(div))";
t1 = v14;
t2 = t1(t0);
v15 = t2;
t3 = t2;
t4 = 2;
t5 = (t3 !== t4);
F = !!(t5);
}
{ // block 136
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_136); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_136);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 136 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_146(A,l,S,F){

  A[0] = 1;
  A[1] = 12;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_146(A,l,S,F){

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
{ // block 146
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_146); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_146);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 146 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_156(A,l,S,F){


}
function LIF_156(A,l,S,F){

if (typeof TRACE === "function") TRACE(156, A, l, S, F);
}
{ // block 156
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_156); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_156);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 156 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_157(A,l,S,F){

  A[0] = l[6];
  S.push("body");
  A[0] = M_GET(A[0], S.pop());
  l[16] = A[0];
  A[0] = l[16];
  S.push(A[0]);
  A[0] = l[6];
  S.push("createNodeIterator");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[17] = A[3];
  A[0] = l[17];
  S.push("root");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_157(A,l,S,F){

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
}
{ // block 157
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_157); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_157);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 157 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_175(A,l,S,F){

  A[0] = 1;
  A[1] = 10;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_175(A,l,S,F){

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
{ // block 175
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_175); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_175);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 175 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_185(A,l,S,F){


}
function LIF_185(A,l,S,F){

if (typeof TRACE === "function") TRACE(185, A, l, S, F);
}
{ // block 185
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_185); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_185);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 185 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_186(A,l,S,F){

  A[0] = l[17];
  S.push("filter");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_186(A,l,S,F){

if (typeof TRACE === "function") TRACE(186, A, l, S, F);
t0 = v17;
t1 = t0?.filter;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 186
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_186); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_186);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 186 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_194(A,l,S,F){

  A[0] = 1;
  A[1] = 9;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_194(A,l,S,F){

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
{ // block 194
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_194); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_194);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 194 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_204(A,l,S,F){


}
function LIF_204(A,l,S,F){

if (typeof TRACE === "function") TRACE(204, A, l, S, F);
}
{ // block 204
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_204); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_204);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 204 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_205(A,l,S,F){

  A[0] = l[17];
  S.push("detach");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_205(A,l,S,F){

if (typeof TRACE === "function") TRACE(205, A, l, S, F);
t0 = v17;
t1 = t0?.detach;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 205
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_205); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_205);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 205 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_213(A,l,S,F){

  A[0] = 1;
  A[1] = 8;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_213(A,l,S,F){

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
{ // block 213
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_213); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_213);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 213 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_223(A,l,S,F){


}
function LIF_223(A,l,S,F){

if (typeof TRACE === "function") TRACE(223, A, l, S, F);
}
{ // block 223
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_223); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_223);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 223 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_224(A,l,S,F){

  A[0] = l[17];
  S.push("whatToShow");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_224(A,l,S,F){

if (typeof TRACE === "function") TRACE(224, A, l, S, F);
t0 = v17;
t1 = t0?.whatToShow;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 224
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_224); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_224);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 224 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_232(A,l,S,F){

  A[0] = 1;
  A[1] = 7;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_232(A,l,S,F){

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
{ // block 232
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_232); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_232);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 232 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_242(A,l,S,F){


}
function LIF_242(A,l,S,F){

if (typeof TRACE === "function") TRACE(242, A, l, S, F);
}
{ // block 242
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_242); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_242);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 242 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_243(A,l,S,F){

  A[0] = l[6];
  S.push("createRange");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  l[18] = A[3];
  A[0] = l[18];
  S.push("cloneRange");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_243(A,l,S,F){

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
}
{ // block 243
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_243); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_243);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 243 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_255(A,l,S,F){

  A[0] = 1;
  A[1] = 6;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_255(A,l,S,F){

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
{ // block 255
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_255); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_255);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 255 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_265(A,l,S,F){


}
function LIF_265(A,l,S,F){

if (typeof TRACE === "function") TRACE(265, A, l, S, F);
}
{ // block 265
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_265); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_265);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 265 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_266(A,l,S,F){

  A[0] = l[18];
  S.push("cloneContents");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_266(A,l,S,F){

if (typeof TRACE === "function") TRACE(266, A, l, S, F);
t0 = v18;
t1 = t0?.cloneContents;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 266
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_266); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_266);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 266 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_274(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_274(A,l,S,F){

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
{ // block 274
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_274); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_274);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 274 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_284(A,l,S,F){


}
function LIF_284(A,l,S,F){

if (typeof TRACE === "function") TRACE(284, A, l, S, F);
}
{ // block 284
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_284); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_284);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 284 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_285(A,l,S,F){

  A[0] = l[18];
  S.push("collapse");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_285(A,l,S,F){

if (typeof TRACE === "function") TRACE(285, A, l, S, F);
t0 = v18;
t1 = t0?.collapse;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 285
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_285); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_285);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 285 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_293(A,l,S,F){

  A[0] = 1;
  A[1] = 4;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_293(A,l,S,F){

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
{ // block 293
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_293); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_293);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 293 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_303(A,l,S,F){


}
function LIF_303(A,l,S,F){

if (typeof TRACE === "function") TRACE(303, A, l, S, F);
}
{ // block 303
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_303); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_303);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 303 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_304(A,l,S,F){

  A[0] = l[18];
  S.push("collapsed");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_304(A,l,S,F){

if (typeof TRACE === "function") TRACE(304, A, l, S, F);
t0 = v18;
t1 = t0?.collapsed;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 304
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_304); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_304);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 304 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_312(A,l,S,F){

  A[0] = 1;
  A[1] = 3;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_312(A,l,S,F){

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
{ // block 312
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_312); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_312);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 312 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_322(A,l,S,F){


}
function LIF_322(A,l,S,F){

if (typeof TRACE === "function") TRACE(322, A, l, S, F);
}
{ // block 322
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_322); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_322);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 322 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_323(A,l,S,F){

  A[0] = l[18];
  S.push("commonAncestorContainer");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_323(A,l,S,F){

if (typeof TRACE === "function") TRACE(323, A, l, S, F);
t0 = v18;
t1 = t0?.commonAncestorContainer;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 323
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_323); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_323);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 323 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_331(A,l,S,F){

  A[0] = 1;
  A[1] = 2;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_331(A,l,S,F){

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
{ // block 331
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_331); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_331);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 331 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_341(A,l,S,F){


}
function LIF_341(A,l,S,F){

if (typeof TRACE === "function") TRACE(341, A, l, S, F);
}
{ // block 341
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_341); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_341);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 341 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_342(A,l,S,F){

  A[0] = l[18];
  S.push("compareBoundaryPoints");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_342(A,l,S,F){

if (typeof TRACE === "function") TRACE(342, A, l, S, F);
t0 = v18;
t1 = t0?.compareBoundaryPoints;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 342
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_342); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_342);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 342 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_350(A,l,S,F){

  A[0] = 1;
  A[1] = 1;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_350(A,l,S,F){

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
{ // block 350
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_350); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_350);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 350 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_360(A,l,S,F){


}
function LIF_360(A,l,S,F){

if (typeof TRACE === "function") TRACE(360, A, l, S, F);
}
{ // block 360
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_360); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_360);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 360 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_361(A,l,S,F){

  A[0] = l[18];
  S.push("comparePoint");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_361(A,l,S,F){

if (typeof TRACE === "function") TRACE(361, A, l, S, F);
t0 = v18;
t1 = t0?.comparePoint;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 361
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_361); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_361);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 361 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_369(A,l,S,F){

  A[0] = 1;
  S.push(A[0]);
  l[13] = A[0];
  A[0] = l[7];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[7] = A[3];
}
function LIF_369(A,l,S,F){

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
{ // block 369
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_369); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_369);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 369 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_377(A,l,S,F){


}
function LIF_377(A,l,S,F){

if (typeof TRACE === "function") TRACE(377, A, l, S, F);
}
{ // block 377
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_377); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_377);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 377 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_378(A,l,S,F){

  A[0] = l[18];
  S.push("endOffset");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_378(A,l,S,F){

if (typeof TRACE === "function") TRACE(378, A, l, S, F);
t0 = v18;
t1 = t0?.endOffset;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 378
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_378); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_378);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 378 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_386(A,l,S,F){

  A[0] = 1;
  A[1] = 15;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_386(A,l,S,F){

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
{ // block 386
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_386); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_386);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 386 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_396(A,l,S,F){


}
function LIF_396(A,l,S,F){

if (typeof TRACE === "function") TRACE(396, A, l, S, F);
}
{ // block 396
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_396); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_396);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 396 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_397(A,l,S,F){

  A[0] = l[18];
  S.push("extractContents");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_397(A,l,S,F){

if (typeof TRACE === "function") TRACE(397, A, l, S, F);
t0 = v18;
t1 = t0?.extractContents;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 397
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_397); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_397);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 397 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_405(A,l,S,F){

  A[0] = 1;
  A[1] = 13;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_405(A,l,S,F){

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
{ // block 405
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_405); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_405);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 405 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_415(A,l,S,F){


}
function LIF_415(A,l,S,F){

if (typeof TRACE === "function") TRACE(415, A, l, S, F);
}
{ // block 415
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_415); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_415);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 415 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_416(A,l,S,F){

  A[0] = l[18];
  S.push("getBoundingClientRect");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_416(A,l,S,F){

if (typeof TRACE === "function") TRACE(416, A, l, S, F);
t0 = v18;
t1 = t0?.getBoundingClientRect;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 416
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_416); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_416);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 416 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_424(A,l,S,F){

  A[0] = 1;
  A[1] = 12;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_424(A,l,S,F){

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
{ // block 424
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_424); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_424);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 424 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_434(A,l,S,F){


}
function LIF_434(A,l,S,F){

if (typeof TRACE === "function") TRACE(434, A, l, S, F);
}
{ // block 434
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_434); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_434);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 434 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_435(A,l,S,F){

  A[0] = l[18];
  S.push("getClientRects");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_435(A,l,S,F){

if (typeof TRACE === "function") TRACE(435, A, l, S, F);
t0 = v18;
t1 = t0?.getClientRects;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 435
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_435); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_435);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 435 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_443(A,l,S,F){

  A[0] = 1;
  A[1] = 11;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_443(A,l,S,F){

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
{ // block 443
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_443); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_443);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 443 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_453(A,l,S,F){


}
function LIF_453(A,l,S,F){

if (typeof TRACE === "function") TRACE(453, A, l, S, F);
}
{ // block 453
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_453); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_453);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 453 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_454(A,l,S,F){

  A[0] = l[18];
  S.push("insertNode");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_454(A,l,S,F){

if (typeof TRACE === "function") TRACE(454, A, l, S, F);
t0 = v18;
t1 = t0?.insertNode;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 454
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_454); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_454);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 454 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_462(A,l,S,F){

  A[0] = 1;
  A[1] = 11;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_462(A,l,S,F){

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
{ // block 462
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_462); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_462);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 462 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_472(A,l,S,F){


}
function LIF_472(A,l,S,F){

if (typeof TRACE === "function") TRACE(472, A, l, S, F);
}
{ // block 472
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_472); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_472);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 472 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_473(A,l,S,F){

  A[0] = l[18];
  S.push("intersectsNode");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_473(A,l,S,F){

if (typeof TRACE === "function") TRACE(473, A, l, S, F);
t0 = v18;
t1 = t0?.intersectsNode;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 473
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_473); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_473);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 473 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_481(A,l,S,F){

  A[0] = 1;
  A[1] = 10;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_481(A,l,S,F){

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
{ // block 481
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_481); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_481);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 481 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_491(A,l,S,F){


}
function LIF_491(A,l,S,F){

if (typeof TRACE === "function") TRACE(491, A, l, S, F);
}
{ // block 491
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_491); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_491);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 491 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_492(A,l,S,F){

  A[0] = l[18];
  S.push("isPointInRange");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_492(A,l,S,F){

if (typeof TRACE === "function") TRACE(492, A, l, S, F);
t0 = v18;
t1 = t0?.isPointInRange;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 492
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_492); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_492);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 492 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_500(A,l,S,F){

  A[0] = 1;
  A[1] = 9;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_500(A,l,S,F){

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

  A[0] = l[18];
  S.push("selectNode");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_511(A,l,S,F){

if (typeof TRACE === "function") TRACE(511, A, l, S, F);
t0 = v18;
t1 = t0?.selectNode;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 511
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_511); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_511);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 511 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_519(A,l,S,F){

  A[0] = 1;
  A[1] = 8;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_519(A,l,S,F){

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
{ // block 519
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_519); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_519);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 519 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_529(A,l,S,F){


}
function LIF_529(A,l,S,F){

if (typeof TRACE === "function") TRACE(529, A, l, S, F);
}
{ // block 529
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_529); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_529);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 529 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_530(A,l,S,F){

  A[0] = l[18];
  S.push("selectNodeContents");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_530(A,l,S,F){

if (typeof TRACE === "function") TRACE(530, A, l, S, F);
t0 = v18;
t1 = t0?.selectNodeContents;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 530
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_530); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_530);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 530 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_538(A,l,S,F){

  A[0] = 1;
  A[1] = 7;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_538(A,l,S,F){

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
{ // block 538
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_538); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_538);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 538 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_548(A,l,S,F){


}
function LIF_548(A,l,S,F){

if (typeof TRACE === "function") TRACE(548, A, l, S, F);
}
{ // block 548
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_548); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_548);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 548 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_549(A,l,S,F){

  A[0] = l[18];
  S.push("setEnd");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_549(A,l,S,F){

if (typeof TRACE === "function") TRACE(549, A, l, S, F);
t0 = v18;
t1 = t0?.setEnd;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 549
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_549); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_549);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 549 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_557(A,l,S,F){

  A[0] = 1;
  A[1] = 6;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_557(A,l,S,F){

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
{ // block 557
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_557); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_557);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 557 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_567(A,l,S,F){


}
function LIF_567(A,l,S,F){

if (typeof TRACE === "function") TRACE(567, A, l, S, F);
}
{ // block 567
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_567); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_567);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 567 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_568(A,l,S,F){

  A[0] = l[18];
  S.push("setEndAfter");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_568(A,l,S,F){

if (typeof TRACE === "function") TRACE(568, A, l, S, F);
t0 = v18;
t1 = t0?.setEndAfter;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 568
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_568); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_568);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 568 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_576(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_576(A,l,S,F){

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
{ // block 576
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_576); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_576);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 576 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_586(A,l,S,F){


}
function LIF_586(A,l,S,F){

if (typeof TRACE === "function") TRACE(586, A, l, S, F);
}
{ // block 586
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_586); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_586);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 586 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_587(A,l,S,F){

  A[0] = l[18];
  S.push("setEndBefore");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_587(A,l,S,F){

if (typeof TRACE === "function") TRACE(587, A, l, S, F);
t0 = v18;
t1 = t0?.setEndBefore;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 587
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_587); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_587);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 587 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_595(A,l,S,F){

  A[0] = 1;
  A[1] = 4;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_595(A,l,S,F){

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
{ // block 595
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_595); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_595);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 595 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_605(A,l,S,F){


}
function LIF_605(A,l,S,F){

if (typeof TRACE === "function") TRACE(605, A, l, S, F);
}
{ // block 605
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_605); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_605);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 605 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_606(A,l,S,F){

  A[0] = l[18];
  S.push("setStart");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_606(A,l,S,F){

if (typeof TRACE === "function") TRACE(606, A, l, S, F);
t0 = v18;
t1 = t0?.setStart;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 606
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_606); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_606);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 606 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_614(A,l,S,F){

  A[0] = 1;
  A[1] = 3;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_614(A,l,S,F){

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
{ // block 614
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_614); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_614);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 614 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_624(A,l,S,F){


}
function LIF_624(A,l,S,F){

if (typeof TRACE === "function") TRACE(624, A, l, S, F);
}
{ // block 624
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_624); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_624);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 624 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_625(A,l,S,F){

  A[0] = l[18];
  S.push("setStartAfter");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_625(A,l,S,F){

if (typeof TRACE === "function") TRACE(625, A, l, S, F);
t0 = v18;
t1 = t0?.setStartAfter;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 625
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_625); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_625);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 625 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_633(A,l,S,F){

  A[0] = 1;
  A[1] = 2;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_633(A,l,S,F){

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
{ // block 633
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_633); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_633);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 633 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_643(A,l,S,F){


}
function LIF_643(A,l,S,F){

if (typeof TRACE === "function") TRACE(643, A, l, S, F);
}
{ // block 643
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_643); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_643);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 643 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_644(A,l,S,F){

  A[0] = l[18];
  S.push("setStartBefore");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_644(A,l,S,F){

if (typeof TRACE === "function") TRACE(644, A, l, S, F);
t0 = v18;
t1 = t0?.setStartBefore;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 644
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_644); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_644);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 644 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_652(A,l,S,F){

  A[0] = 1;
  A[1] = 1;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[13] = A[3];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_652(A,l,S,F){

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
{ // block 652
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_652); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_652);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 652 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_662(A,l,S,F){


}
function LIF_662(A,l,S,F){

if (typeof TRACE === "function") TRACE(662, A, l, S, F);
}
{ // block 662
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_662); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_662);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 662 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_663(A,l,S,F){

  A[0] = l[18];
  S.push("startContainer");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_663(A,l,S,F){

if (typeof TRACE === "function") TRACE(663, A, l, S, F);
t0 = v18;
t1 = t0?.startContainer;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 663
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_663); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_663);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 663 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_671(A,l,S,F){

  A[0] = 1;
  S.push(A[0]);
  l[13] = A[0];
  A[0] = l[8];
  A[1] = l[13];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[8] = A[3];
}
function LIF_671(A,l,S,F){

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
{ // block 671
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_671); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_671);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 671 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_679(A,l,S,F){


}
function LIF_679(A,l,S,F){

if (typeof TRACE === "function") TRACE(679, A, l, S, F);
}
{ // block 679
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_679); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_679);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 679 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_680(A,l,S,F){

  A[0] = "8206";
  S.push(A[0]);
  S.push("String");
  A[0] = M_EVAL(S.pop());
  S.push("fromCharCode");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[19] = A[3];
  A[0] = 16;
  S.push(A[0]);
  A[0] = l[7];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  S.push(A[3]);
  l[7] = A[3];
  A[0] = 16;
  S.push(A[0]);
  A[0] = l[8];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  S.push(A[3]);
  l[8] = A[3];
  A[0] = l[7];
  A[1] = l[8];
  A[3] = A[0] + A[1];
  S.push(A[3]);
  l[20] = A[3];
  A[0] = l[20];
  S.push(A[0]);
  A[0] = "6a6cb1bb3970bae6";
  S.push(A[0]);
  A[0] = 877;
  A[3] = SUBCALL(A, l, S, 0, 2);
  S.push(A[3]);
  l[20] = A[3];
  A[0] = SRC1;
  S.push(A[0]);
  A[0] = l[5];
  A[3] = new A[0](...S.splice(-1));
  l[21] = A[3];
  A[0] = l[21];
  A[3] = A[0]();
  l[22] = A[3];
  A[0] = l[22];
  S.push(A[0]);
  A[0] = "44ae0b7a68bf0f7a";
  S.push(A[0]);
  A[0] = 877;
  A[3] = SUBCALL(A, l, S, 0, 2);
  S.push(A[3]);
  l[22] = A[3];
  A[0] = l[20];
  A[1] = l[19];
  A[3] = A[0] + A[1];
  A[0] = l[22];
  A[3] = A[3] + A[0];
  S.push(A[3]);
  S.push(A[3]);
  S.push("__c");
  A[0] = M_EVAL(S.pop());
  S.push("qh");
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
}
function LIF_680(A,l,S,F){

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
{ // block 680
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_680); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_680);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 680 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_741(A,l,S,F){


}
function LIF_741(A,l,S,F){

if (typeof TRACE === "function") TRACE(741, A, l, S, F);
}
{ // block 741
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_741); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_741);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 741 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_894(A,l,S,F){

  A[0] = l[32];
  A[1] = l[29];
  A[3] = A[0] < A[1];
  F = !!A[3];
}
function LIF_894(A,l,S,F){

if (typeof TRACE === "function") TRACE(894, A, l, S, F);
t0 = v32;
t1 = v29;
t2 = (t0 < t1);
F = !!(t2);
}
{ // block 894
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_894); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_894);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 894 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_899(A,l,S,F){

  A[0] = l[32];
  S.push(A[0]);
  A[0] = l[0];
  S.push("charCodeAt");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[33] = A[3];
  A[0] = l[32];
  A[1] = l[30];
  A[3] = A[0] % A[1];
  l[34] = A[3];
  A[0] = l[34];
  S.push(A[0]);
  A[0] = l[1];
  S.push("charCodeAt");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[35] = A[3];
  A[0] = l[33];
  A[1] = l[35];
  A[3] = A[0] ^ A[1];
  A[0] = l[31];
  A[3] = A[3] ^ A[0];
  l[36] = A[3];
  A[0] = l[36];
  S.push(A[0]);
  l[31] = A[0];
  A[0] = l[36];
  S.push(A[0]);
  S.push("String");
  A[0] = M_EVAL(S.pop());
  S.push("fromCharCode");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[37] = A[3];
  A[0] = l[28];
  A[1] = l[37];
  A[3] = A[0] + A[1];
  S.push(A[3]);
  l[28] = A[3];
  A[0] = l[32];
  A[1] = 1;
  A[1] = A[0] + A[1];
  l[32] = A[1];
}
function LIF_899(A,l,S,F){

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
}
{ // block 899
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_899); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_899);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 899 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
console.log("  per-block differential: 119 blocks, "+PASS+" pass, "+FAIL+" fail");
if (typeof process !== "undefined") process.exit(FAIL?1:0);
