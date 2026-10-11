
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

  A[0] = 735;
  A[3] = SUBCALL(A, l, S, 0, 0);
  l[0] = A[3];
  A[0] = l[0];
  A[1] = 4;
  A[3] = A[0] > A[1];
  F = !!A[3];
}
function LIF_0(A,l,S,F){

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
}
{ // block 0
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_0); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_0);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 0 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_734(A,l,S,F){

  S.length = 0; F = undefined;
}
function LIF_734(A,l,S,F){

if (typeof TRACE === "function") TRACE(734, A, l, S, F);
}
{ // block 734
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_734); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_734);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 734 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_735(A,l,S,F){

  S.push("Object");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  l[6] = A[3];
  A[0] = "a";
  S.push(A[0]);
  A[0] = "b";
  S.push(A[0]);
  A[0] = "return b in a ? a[b]: undefined";
  S.push(A[0]);
  S.push("Function");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-3));
  l[7] = A[3];
  A[0] = l[7];
  S.push(A[0]);
  S.push(A[0]);
  A[0] = "get";
  S.push(A[0]);
  A[0] = l[6];
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  A[0] = "get";
  S.push(A[0]);
  A[0] = l[6];
  A[0] = M_GET(A[0], S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  S.push("length");
  A[3] = M_GET(A[3], S.pop());
  l[12] = A[3];
  S.push("BVM");
  A[0] = M_EVAL(S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  l[13] = A[3];
  A[0] = l[12];
  A[1] = 60;
  A[3] = A[0] > A[1];
  F = !!A[3];
}
function LIF_735(A,l,S,F){

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
}
{ // block 735
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_735); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_735);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 735 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_775(A,l,S,F){
    S.push(t0);
  A[3] = 3;
}
function LIF_775(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(775, A, l, S, F);
t0 = 3;
A[3] = t0;
}
{ // block 775
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_775); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_775);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 775 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_777(A,l,S,F){
    S.push(t0);

}
function LIF_777(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(777, A, l, S, F);
}
{ // block 777
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_777); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_777);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 777 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_778(A,l,S,F){
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
function LIF_778(A,l,S,F){
    S.push(t0);
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
}
{ // block 778
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_778); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_778);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 778 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_787(A,l,S,F){
    S.push(t0);
  A[3] = 3;
}
function LIF_787(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(787, A, l, S, F);
t0 = 3;
A[3] = t0;
}
{ // block 787
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_787); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_787);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 787 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_789(A,l,S,F){
    S.push(t0);

}
function LIF_789(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(789, A, l, S, F);
}
{ // block 789
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_789); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_789);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 789 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_790(A,l,S,F){
    S.push(t0);
  A[0] = "onsol";
  S.push(A[0]);
  A[0] = l[13];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] !== A[0];
  F = !!A[3];
}
function LIF_790(A,l,S,F){
    S.push(t0);
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
}
{ // block 790
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_790); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_790);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 790 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_800(A,l,S,F){
    S.push(t0);
  A[3] = 3;
}
function LIF_800(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(800, A, l, S, F);
t0 = 3;
A[3] = t0;
}
{ // block 800
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_800); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_800);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 800 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_802(A,l,S,F){
    S.push(t0);

}
function LIF_802(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(802, A, l, S, F);
}
{ // block 802
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_802); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_802);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 802 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_803(A,l,S,F){
    S.push(t0);
  S.push("Error");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  S.push("stack");
  A[3] = M_GET(A[3], S.pop());
  l[14] = A[3];
  A[0] = "node";
  S.push(A[0]);
  A[0] = l[14];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] !== A[0];
  F = !!A[3];
}
function LIF_803(A,l,S,F){
    S.push(t0);
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
}
{ // block 803
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_803); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_803);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 803 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_819(A,l,S,F){
    S.push(t0);
  A[3] = 3;
}
function LIF_819(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(819, A, l, S, F);
t0 = 3;
A[3] = t0;
}
{ // block 819
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_819); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_819);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 819 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_821(A,l,S,F){
    S.push(t0);

}
function LIF_821(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(821, A, l, S, F);
}
{ // block 821
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_821); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_821);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 821 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_822(A,l,S,F){
    S.push(t0);
  A[0] = "executeUserEntryPoint";
  S.push(A[0]);
  A[0] = l[14];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] !== A[0];
  F = !!A[3];
}
function LIF_822(A,l,S,F){
    S.push(t0);
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
}
{ // block 822
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_822); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_822);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 822 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_832(A,l,S,F){
    S.push(t0);
  A[3] = 3;
}
function LIF_832(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(832, A, l, S, F);
t0 = 3;
A[3] = t0;
}
{ // block 832
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_832); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_832);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 832 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_834(A,l,S,F){
    S.push(t0);

}
function LIF_834(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(834, A, l, S, F);
}
{ // block 834
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_834); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_834);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 834 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_835(A,l,S,F){
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
function LIF_835(A,l,S,F){
    S.push(t0);
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
}
{ // block 835
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_835); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_835);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 835 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_852(A,l,S,F){
    S.push(t0);
  A[3] = 3;
}
function LIF_852(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(852, A, l, S, F);
t0 = 3;
A[3] = t0;
}
{ // block 852
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_852); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_852);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 852 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_854(A,l,S,F){
    S.push(t0);

}
function LIF_854(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(854, A, l, S, F);
}
{ // block 854
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_854); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_854);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 854 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_855(A,l,S,F){
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
function LIF_855(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(855, A, l, S, F);
t0 = window;
t1 = t0?.v_log;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 !== t3);
F = !!(t4);
A[0] = t2;
A[1] = t3;
}
{ // block 855
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_855); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_855);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 855 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_864(A,l,S,F){
    S.push(t0);
  A[3] = 3;
}
function LIF_864(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(864, A, l, S, F);
t0 = 3;
A[3] = t0;
}
{ // block 864
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_864); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_864);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 864 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_866(A,l,S,F){
    S.push(t0);

}
function LIF_866(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(866, A, l, S, F);
}
{ // block 866
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_866); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_866);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 866 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_867(A,l,S,F){
    S.push(t0);
  A[3] = 5;
}
function LIF_867(A,l,S,F){
    S.push(t0);
if (typeof TRACE === "function") TRACE(867, A, l, S, F);
t0 = 5;
A[3] = t0;
}
{ // block 867
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_867); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_867);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 867 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_869(A,l,S,F){

  A[0] = "";
  l[17] = A[0];
  A[0] = l[0];
  S.push("length");
  A[0] = M_GET(A[0], S.pop());
  l[18] = A[0];
  A[0] = l[1];
  S.push("length");
  A[0] = M_GET(A[0], S.pop());
  l[19] = A[0];
  S.push("__b");
  A[0] = M_EVAL(S.pop());
  S.push("a3");
  A[0] = M_GET(A[0], S.pop());
  l[20] = A[0];
  A[0] = 0;
  l[21] = A[0];
}
function LIF_869(A,l,S,F){

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
}
{ // block 869
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_869); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_869);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 869 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_933(A,l,S,F){

  A[0] = l[20];
  S.push(A[0]);
  S.push(A[0]);
  S.push("__b");
  A[0] = M_EVAL(S.pop());
  S.push("a3");
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  A[3] = l[17];
}
function LIF_933(A,l,S,F){

if (typeof TRACE === "function") TRACE(933, A, l, S, F);
t0 = v20;
t1 = __b;
M_SET(t1, "a3", t0);
t2 = v17;
A[0] = t1;
A[3] = t2;
}
{ // block 933
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_933); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_933);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 933 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_8(A,l,S,F){

  A[0] = 41;
  S.push(A[0]);
  S.push(A[0]);
  S.push("__b");
  A[0] = M_EVAL(S.pop());
  S.push("a3");
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  A[0] = SRC0;
  S.push(A[0]);
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("eval");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = "8204";
  S.push(A[0]);
  S.push("String");
  A[0] = M_EVAL(S.pop());
  S.push("fromCharCode");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[1] = A[3];
  S.push("__b");
  A[0] = M_EVAL(S.pop());
  S.push("zh");
  A[0] = M_GET(A[0], S.pop());
  l[2] = A[0];
  A[0] = 1;
  A[1] = 15;
  A[3] = A[0] << A[1];
  l[3] = A[3];
  A[0] = 1;
  A[1] = 15;
  A[3] = A[0] << A[1];
  l[4] = A[3];
  l[5] = A[3];
  S.push("Object");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  l[6] = A[3];
  A[0] = "a";
  S.push(A[0]);
  A[0] = "b";
  S.push(A[0]);
  A[0] = "return b in a ? a[b]: undefined";
  S.push(A[0]);
  S.push("Function");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-3));
  l[7] = A[3];
  A[0] = l[7];
  S.push(A[0]);
  S.push(A[0]);
  A[0] = "get";
  S.push(A[0]);
  A[0] = l[6];
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
  l[8] = A[3];
  A[0] = l[8];
  S.push(A[0]);
  S.push(A[0]);
  A[0] = "set";
  S.push(A[0]);
  A[0] = l[6];
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  S.push("location");
  A[0] = M_EVAL(S.pop());
  S.push(A[0]);
  A[0] = l[6];
  S.push(A[0]);
  S.push("Proxy");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-2));
  l[9] = A[3];
  A[0] = "zhihu";
  S.push(A[0]);
  S.push("location");
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
function LIF_8(A,l,S,F){

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
}
{ // block 8
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_8); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_8);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 8 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_104(A,l,S,F){

  A[0] = 1;
  A[1] = 14;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_104(A,l,S,F){

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
{ // block 104
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_104); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_104);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 104 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_114(A,l,S,F){


}
function LIF_114(A,l,S,F){

if (typeof TRACE === "function") TRACE(114, A, l, S, F);
}
{ // block 114
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_114); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_114);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 114 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_115(A,l,S,F){

  A[0] = "native";
  S.push(A[0]);
  A[0] = l[9];
  S.push("toString");
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
function LIF_115(A,l,S,F){

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
}
{ // block 115
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_115); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_115);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 115 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_129(A,l,S,F){

  A[0] = 1;
  A[1] = 13;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_129(A,l,S,F){

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
{ // block 129
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_129); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_129);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 129 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_139(A,l,S,F){


}
function LIF_139(A,l,S,F){

if (typeof TRACE === "function") TRACE(139, A, l, S, F);
}
{ // block 139
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_139); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_139);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 139 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_140(A,l,S,F){

  A[0] = l[9];
  S.push("host");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_140(A,l,S,F){

if (typeof TRACE === "function") TRACE(140, A, l, S, F);
t0 = v9;
t1 = t0?.host;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 140
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_140); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_140);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 140 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_148(A,l,S,F){

  A[0] = 1;
  A[1] = 12;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_148(A,l,S,F){

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
{ // block 148
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_148); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_148);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 148 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_158(A,l,S,F){


}
function LIF_158(A,l,S,F){

if (typeof TRACE === "function") TRACE(158, A, l, S, F);
}
{ // block 158
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_158); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_158);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 158 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_159(A,l,S,F){

  A[0] = l[9];
  S.push("hostname");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_159(A,l,S,F){

if (typeof TRACE === "function") TRACE(159, A, l, S, F);
t0 = v9;
t1 = t0?.hostname;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 159
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_159); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_159);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 159 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_167(A,l,S,F){

  A[0] = 1;
  A[1] = 11;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_167(A,l,S,F){

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
{ // block 167
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_167); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_167);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 167 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_177(A,l,S,F){


}
function LIF_177(A,l,S,F){

if (typeof TRACE === "function") TRACE(177, A, l, S, F);
}
{ // block 177
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_177); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_177);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 177 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_178(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("devicePixelRatio");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_178(A,l,S,F){

if (typeof TRACE === "function") TRACE(178, A, l, S, F);
t0 = window;
t1 = t0?.devicePixelRatio;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 178
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_178); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_178);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 178 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_187(A,l,S,F){

  A[0] = 1;
  A[1] = 10;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_187(A,l,S,F){

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
{ // block 187
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_187); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_187);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 187 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_197(A,l,S,F){


}
function LIF_197(A,l,S,F){

if (typeof TRACE === "function") TRACE(197, A, l, S, F);
}
{ // block 197
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_197); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_197);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 197 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_198(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("blur");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_198(A,l,S,F){

if (typeof TRACE === "function") TRACE(198, A, l, S, F);
t0 = window;
t1 = t0?.blur;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 198
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_198); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_198);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 198 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_207(A,l,S,F){

  A[0] = 1;
  A[1] = 9;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_207(A,l,S,F){

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
{ // block 207
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_207); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_207);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 207 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_217(A,l,S,F){


}
function LIF_217(A,l,S,F){

if (typeof TRACE === "function") TRACE(217, A, l, S, F);
}
{ // block 217
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_217); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_217);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 217 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_218(A,l,S,F){

  A[0] = "native";
  S.push(A[0]);
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("blur");
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
function LIF_218(A,l,S,F){

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
}
{ // block 218
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_218); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_218);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 218 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_233(A,l,S,F){

  A[0] = 1;
  A[1] = 8;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_233(A,l,S,F){

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
{ // block 233
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_233); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_233);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 233 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_243(A,l,S,F){


}
function LIF_243(A,l,S,F){

if (typeof TRACE === "function") TRACE(243, A, l, S, F);
}
{ // block 243
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_243); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_243);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 243 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_244(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("self");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_244(A,l,S,F){

if (typeof TRACE === "function") TRACE(244, A, l, S, F);
t0 = window;
t1 = t0?.self;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 244
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_244); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_244);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 244 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_253(A,l,S,F){

  A[0] = 1;
  A[1] = 7;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_253(A,l,S,F){

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
{ // block 253
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_253); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_253);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 253 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_263(A,l,S,F){


}
function LIF_263(A,l,S,F){

if (typeof TRACE === "function") TRACE(263, A, l, S, F);
}
{ // block 263
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_263); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_263);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 263 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_264(A,l,S,F){

  S.push("history");
  A[0] = M_EVAL(S.pop());
  S.push("pushState");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "function";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_264(A,l,S,F){

if (typeof TRACE === "function") TRACE(264, A, l, S, F);
t0 = history;
t1 = t0?.pushState;
t2 = (typeof t1);
t3 = "function";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 264
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_264); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_264);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 264 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_273(A,l,S,F){

  A[0] = 1;
  A[1] = 6;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_273(A,l,S,F){

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
{ // block 273
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_273); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_273);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 273 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_283(A,l,S,F){


}
function LIF_283(A,l,S,F){

if (typeof TRACE === "function") TRACE(283, A, l, S, F);
}
{ // block 283
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_283); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_283);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 283 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_284(A,l,S,F){

  A[0] = "native";
  S.push(A[0]);
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("XMLDocument");
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
function LIF_284(A,l,S,F){

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
}
{ // block 284
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_284); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_284);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 284 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_299(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_299(A,l,S,F){

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
{ // block 299
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_299); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_299);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 299 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_309(A,l,S,F){


}
function LIF_309(A,l,S,F){

if (typeof TRACE === "function") TRACE(309, A, l, S, F);
}
{ // block 309
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_309); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_309);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 309 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_310(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("find");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_310(A,l,S,F){

if (typeof TRACE === "function") TRACE(310, A, l, S, F);
t0 = window;
t1 = t0?.find;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 310
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_310); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_310);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 310 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_319(A,l,S,F){

  A[0] = 1;
  A[1] = 4;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_319(A,l,S,F){

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
{ // block 319
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_319); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_319);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 319 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_329(A,l,S,F){


}
function LIF_329(A,l,S,F){

if (typeof TRACE === "function") TRACE(329, A, l, S, F);
}
{ // block 329
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_329); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_329);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 329 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_330(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("globalThis");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_330(A,l,S,F){

if (typeof TRACE === "function") TRACE(330, A, l, S, F);
t0 = window;
t1 = t0?.globalThis;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 330
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_330); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_330);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 330 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_339(A,l,S,F){

  A[0] = 1;
  A[1] = 3;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_339(A,l,S,F){

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
{ // block 339
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_339); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_339);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 339 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_349(A,l,S,F){


}
function LIF_349(A,l,S,F){

if (typeof TRACE === "function") TRACE(349, A, l, S, F);
}
{ // block 349
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_349); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_349);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 349 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_350(A,l,S,F){

  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("name");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_350(A,l,S,F){

if (typeof TRACE === "function") TRACE(350, A, l, S, F);
t0 = window;
t1 = t0?.name;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 350
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_350); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_350);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 350 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_359(A,l,S,F){

  A[0] = 1;
  A[1] = 2;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_359(A,l,S,F){

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
{ // block 359
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_359); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_359);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 359 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_369(A,l,S,F){


}
function LIF_369(A,l,S,F){

if (typeof TRACE === "function") TRACE(369, A, l, S, F);
}
{ // block 369
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_369); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_369);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 369 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_370(A,l,S,F){

  S.push("history");
  A[0] = M_EVAL(S.pop());
  S.push("replaceState");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "function";
  A[3] = A[0] !== A[1];
  F = !!A[3];
}
function LIF_370(A,l,S,F){

if (typeof TRACE === "function") TRACE(370, A, l, S, F);
t0 = history;
t1 = t0?.replaceState;
t2 = (typeof t1);
t3 = "function";
t4 = (t2 !== t3);
F = !!(t4);
}
{ // block 370
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_370); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_370);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 370 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_379(A,l,S,F){

  A[0] = 1;
  A[1] = 1;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_379(A,l,S,F){

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
{ // block 379
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_379); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_379);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 379 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_389(A,l,S,F){


}
function LIF_389(A,l,S,F){

if (typeof TRACE === "function") TRACE(389, A, l, S, F);
}
{ // block 389
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_389); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_389);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 389 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_390(A,l,S,F){

  S.push("XMLHttpRequest");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0]();
  l[10] = A[3];
  A[0] = l[10];
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_390(A,l,S,F){

if (typeof TRACE === "function") TRACE(390, A, l, S, F);
t0 = XMLHttpRequest;
t1 = new t0();
v10 = t1;
t2 = t1;
t3 = (typeof t2);
t4 = "undefined";
t5 = (t3 === t4);
F = !!(t5);
}
{ // block 390
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_390); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_390);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 390 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_400(A,l,S,F){

  A[0] = 1;
  S.push(A[0]);
  l[5] = A[0];
  A[0] = l[3];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[3] = A[3];
}
function LIF_400(A,l,S,F){

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
{ // block 400
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_400); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_400);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 400 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_408(A,l,S,F){


}
function LIF_408(A,l,S,F){

if (typeof TRACE === "function") TRACE(408, A, l, S, F);
}
{ // block 408
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_408); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_408);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 408 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_409(A,l,S,F){

  A[0] = l[10];
  S.push("LOADING");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_409(A,l,S,F){

if (typeof TRACE === "function") TRACE(409, A, l, S, F);
t0 = v10;
t1 = t0?.LOADING;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 409
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_409); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_409);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 409 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_417(A,l,S,F){

  A[0] = 1;
  A[1] = 14;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_417(A,l,S,F){

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
{ // block 417
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_417); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_417);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 417 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_427(A,l,S,F){


}
function LIF_427(A,l,S,F){

if (typeof TRACE === "function") TRACE(427, A, l, S, F);
}
{ // block 427
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_427); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_427);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 427 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_428(A,l,S,F){

  A[0] = l[10];
  S.push("DONE");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_428(A,l,S,F){

if (typeof TRACE === "function") TRACE(428, A, l, S, F);
t0 = v10;
t1 = t0?.DONE;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 428
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_428); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_428);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 428 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_436(A,l,S,F){

  A[0] = 1;
  A[1] = 13;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_436(A,l,S,F){

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
{ // block 436
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_436); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_436);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 436 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_446(A,l,S,F){


}
function LIF_446(A,l,S,F){

if (typeof TRACE === "function") TRACE(446, A, l, S, F);
}
{ // block 446
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_446); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_446);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 446 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_447(A,l,S,F){

  A[0] = l[10];
  S.push("OPENED");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_447(A,l,S,F){

if (typeof TRACE === "function") TRACE(447, A, l, S, F);
t0 = v10;
t1 = t0?.OPENED;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 447
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_447); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_447);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 447 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_455(A,l,S,F){

  A[0] = 1;
  A[1] = 12;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_455(A,l,S,F){

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
{ // block 455
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_455); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_455);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 455 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_465(A,l,S,F){


}
function LIF_465(A,l,S,F){

if (typeof TRACE === "function") TRACE(465, A, l, S, F);
}
{ // block 465
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_465); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_465);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 465 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_466(A,l,S,F){

  A[0] = l[10];
  S.push("UNSENT");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_466(A,l,S,F){

if (typeof TRACE === "function") TRACE(466, A, l, S, F);
t0 = v10;
t1 = t0?.UNSENT;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 466
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_466); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_466);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 466 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_474(A,l,S,F){

  A[0] = 1;
  A[1] = 11;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_474(A,l,S,F){

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
{ // block 474
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_474); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_474);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 474 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_484(A,l,S,F){


}
function LIF_484(A,l,S,F){

if (typeof TRACE === "function") TRACE(484, A, l, S, F);
}
{ // block 484
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_484); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_484);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 484 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_485(A,l,S,F){

  A[0] = l[10];
  S.push("abort");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_485(A,l,S,F){

if (typeof TRACE === "function") TRACE(485, A, l, S, F);
t0 = v10;
t1 = t0?.abort;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 485
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_485); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_485);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 485 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_493(A,l,S,F){

  A[0] = 1;
  A[1] = 10;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_493(A,l,S,F){

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
{ // block 493
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_493); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_493);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 493 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_503(A,l,S,F){


}
function LIF_503(A,l,S,F){

if (typeof TRACE === "function") TRACE(503, A, l, S, F);
}
{ // block 503
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_503); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_503);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 503 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_504(A,l,S,F){

  A[0] = l[10];
  S.push("open");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_504(A,l,S,F){

if (typeof TRACE === "function") TRACE(504, A, l, S, F);
t0 = v10;
t1 = t0?.open;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 504
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_504); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_504);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 504 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_512(A,l,S,F){

  A[0] = 1;
  A[1] = 9;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_512(A,l,S,F){

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
{ // block 512
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_512); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_512);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 512 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_522(A,l,S,F){


}
function LIF_522(A,l,S,F){

if (typeof TRACE === "function") TRACE(522, A, l, S, F);
}
{ // block 522
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_522); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_522);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 522 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_523(A,l,S,F){

  A[0] = l[10];
  S.push("send");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_523(A,l,S,F){

if (typeof TRACE === "function") TRACE(523, A, l, S, F);
t0 = v10;
t1 = t0?.send;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 523
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_523); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_523);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 523 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_531(A,l,S,F){

  A[0] = 1;
  A[1] = 8;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_531(A,l,S,F){

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
{ // block 531
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_531); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_531);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 531 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_541(A,l,S,F){


}
function LIF_541(A,l,S,F){

if (typeof TRACE === "function") TRACE(541, A, l, S, F);
}
{ // block 541
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_541); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_541);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 541 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_542(A,l,S,F){

  A[0] = l[10];
  S.push("upload");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_542(A,l,S,F){

if (typeof TRACE === "function") TRACE(542, A, l, S, F);
t0 = v10;
t1 = t0?.upload;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 542
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_542); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_542);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 542 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_550(A,l,S,F){

  A[0] = 1;
  A[1] = 7;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_550(A,l,S,F){

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
{ // block 550
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_550); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_550);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 550 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_560(A,l,S,F){


}
function LIF_560(A,l,S,F){

if (typeof TRACE === "function") TRACE(560, A, l, S, F);
}
{ // block 560
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_560); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_560);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 560 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_561(A,l,S,F){

  A[0] = l[10];
  S.push("responseURL");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_561(A,l,S,F){

if (typeof TRACE === "function") TRACE(561, A, l, S, F);
t0 = v10;
t1 = t0?.responseURL;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 561
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_561); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_561);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 561 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_569(A,l,S,F){

  A[0] = 1;
  A[1] = 6;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_569(A,l,S,F){

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

  A[0] = l[10];
  S.push("onreadystatechange");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_580(A,l,S,F){

if (typeof TRACE === "function") TRACE(580, A, l, S, F);
t0 = v10;
t1 = t0?.onreadystatechange;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 580
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_580); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_580);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 580 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_588(A,l,S,F){

  A[0] = 1;
  A[1] = 5;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_588(A,l,S,F){

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
{ // block 588
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_588); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_588);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 588 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_598(A,l,S,F){


}
function LIF_598(A,l,S,F){

if (typeof TRACE === "function") TRACE(598, A, l, S, F);
}
{ // block 598
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_598); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_598);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 598 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_599(A,l,S,F){

  A[0] = l[10];
  S.push("status");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_599(A,l,S,F){

if (typeof TRACE === "function") TRACE(599, A, l, S, F);
t0 = v10;
t1 = t0?.status;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 599
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_599); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_599);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 599 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_607(A,l,S,F){

  A[0] = 1;
  A[1] = 4;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_607(A,l,S,F){

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
{ // block 607
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_607); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_607);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 607 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_617(A,l,S,F){


}
function LIF_617(A,l,S,F){

if (typeof TRACE === "function") TRACE(617, A, l, S, F);
}
{ // block 617
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_617); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_617);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 617 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_618(A,l,S,F){

  A[0] = l[10];
  S.push("onabort");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_618(A,l,S,F){

if (typeof TRACE === "function") TRACE(618, A, l, S, F);
t0 = v10;
t1 = t0?.onabort;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 618
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_618); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_618);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 618 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_626(A,l,S,F){

  A[0] = 1;
  A[1] = 3;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_626(A,l,S,F){

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
{ // block 626
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_626); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_626);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 626 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_636(A,l,S,F){


}
function LIF_636(A,l,S,F){

if (typeof TRACE === "function") TRACE(636, A, l, S, F);
}
{ // block 636
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_636); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_636);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 636 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_637(A,l,S,F){

  A[0] = l[10];
  S.push("onabort");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_637(A,l,S,F){

if (typeof TRACE === "function") TRACE(637, A, l, S, F);
t0 = v10;
t1 = t0?.onabort;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 637
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_637); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_637);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 637 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_645(A,l,S,F){

  A[0] = 1;
  A[1] = 2;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_645(A,l,S,F){

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
{ // block 645
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_645); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_645);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 645 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_655(A,l,S,F){


}
function LIF_655(A,l,S,F){

if (typeof TRACE === "function") TRACE(655, A, l, S, F);
}
{ // block 655
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_655); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_655);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 655 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_656(A,l,S,F){

  A[0] = l[10];
  S.push("responseXML");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_656(A,l,S,F){

if (typeof TRACE === "function") TRACE(656, A, l, S, F);
t0 = v10;
t1 = t0?.responseXML;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 656
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_656); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_656);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 656 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_664(A,l,S,F){

  A[0] = 1;
  A[1] = 1;
  A[3] = A[0] << A[1];
  S.push(A[3]);
  l[5] = A[3];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_664(A,l,S,F){

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
{ // block 664
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_664); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_664);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 664 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_674(A,l,S,F){


}
function LIF_674(A,l,S,F){

if (typeof TRACE === "function") TRACE(674, A, l, S, F);
}
{ // block 674
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_674); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_674);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 674 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_675(A,l,S,F){

  A[0] = l[10];
  S.push("timeout");
  A[0] = M_GET(A[0], S.pop());
  A[0] = typeof A[0];
  A[1] = "undefined";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_675(A,l,S,F){

if (typeof TRACE === "function") TRACE(675, A, l, S, F);
t0 = v10;
t1 = t0?.timeout;
t2 = (typeof t1);
t3 = "undefined";
t4 = (t2 === t3);
F = !!(t4);
}
{ // block 675
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_675); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_675);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 675 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_683(A,l,S,F){

  A[0] = 1;
  S.push(A[0]);
  l[5] = A[0];
  A[0] = l[4];
  A[1] = l[5];
  A[3] = A[0] | A[1];
  S.push(A[3]);
  l[4] = A[3];
}
function LIF_683(A,l,S,F){

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
{ // block 683
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_683); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_683);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 683 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_691(A,l,S,F){


}
function LIF_691(A,l,S,F){

if (typeof TRACE === "function") TRACE(691, A, l, S, F);
}
{ // block 691
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_691); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_691);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 691 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_692(A,l,S,F){

  A[0] = 16;
  S.push(A[0]);
  A[0] = l[3];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  S.push(A[3]);
  l[3] = A[3];
  A[0] = 16;
  S.push(A[0]);
  A[0] = l[4];
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  S.push(A[3]);
  l[4] = A[3];
  A[0] = l[3];
  A[1] = l[4];
  A[3] = A[0] + A[1];
  S.push(A[3]);
  l[11] = A[3];
  A[0] = l[11];
  S.push(A[0]);
  A[0] = "b53cc3fa93dc8013";
  S.push(A[0]);
  A[0] = 869;
  A[3] = SUBCALL(A, l, S, 0, 2);
  S.push(A[3]);
  l[11] = A[3];
  A[0] = l[2];
  A[1] = l[11];
  A[3] = A[0] + A[1];
  A[0] = l[1];
  A[3] = A[3] + A[0];
  S.push(A[3]);
  l[2] = A[3];
  A[0] = l[2];
  S.push(A[0]);
  S.push(A[0]);
  S.push("__b");
  A[0] = M_EVAL(S.pop());
  S.push("zh");
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
}
function LIF_692(A,l,S,F){

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
{ // block 692
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_692); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_692);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 692 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_733(A,l,S,F){


}
function LIF_733(A,l,S,F){

if (typeof TRACE === "function") TRACE(733, A, l, S, F);
}
{ // block 733
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_733); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_733);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 733 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_886(A,l,S,F){

  A[0] = l[21];
  A[1] = l[18];
  A[3] = A[0] < A[1];
  F = !!A[3];
}
function LIF_886(A,l,S,F){

if (typeof TRACE === "function") TRACE(886, A, l, S, F);
t0 = v21;
t1 = v18;
t2 = (t0 < t1);
F = !!(t2);
}
{ // block 886
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_886); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_886);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 886 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_891(A,l,S,F){

  A[0] = l[21];
  S.push(A[0]);
  A[0] = l[0];
  S.push("charCodeAt");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[22] = A[3];
  A[0] = l[21];
  A[1] = l[19];
  A[3] = A[0] % A[1];
  l[23] = A[3];
  A[0] = l[23];
  S.push(A[0]);
  A[0] = l[1];
  S.push("charCodeAt");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[24] = A[3];
  A[0] = l[22];
  A[1] = l[24];
  A[3] = A[0] ^ A[1];
  A[0] = l[20];
  A[3] = A[3] ^ A[0];
  l[25] = A[3];
  A[0] = l[25];
  S.push(A[0]);
  l[20] = A[0];
  A[0] = l[25];
  S.push(A[0]);
  S.push("String");
  A[0] = M_EVAL(S.pop());
  S.push("fromCharCode");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[26] = A[3];
  A[0] = l[17];
  A[1] = l[26];
  A[3] = A[0] + A[1];
  S.push(A[3]);
  l[17] = A[3];
  A[0] = l[21];
  A[1] = 1;
  A[1] = A[0] + A[1];
  l[21] = A[1];
}
function LIF_891(A,l,S,F){

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
}
{ // block 891
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_891); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_891);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 891 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
console.log("  per-block differential: 120 blocks, "+PASS+" pass, "+FAIL+" fail");
if (typeof process !== "undefined") process.exit(FAIL?1:0);
