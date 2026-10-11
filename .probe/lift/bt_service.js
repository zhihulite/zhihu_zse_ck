
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

function DEV_419(A,l,S,F){
    S.push(t1);
    S.push(t1);

}
function LIF_419(A,l,S,F){
    S.push(t1);
    S.push(t1);
if (typeof TRACE === "function") TRACE(419, A, l, S, F);
}
{ // block 419
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_419); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_419);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 419 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_0(A,l,S,F){

  A[0] = "005_ep5of98xMl=Oi4eegTO4vxKJ0BykStAMzO3VygzjzFLM5YItGrDSNnhpu8K6Czafg=MyvsN7dvwKN/eKWiNAlzfpaASVT0de1eQp1=4rg6p4y6USlXibd4MlxIjhCvCS";
  S.push(A[0]);
  S.push(A[0]);
  S.push("__g");
  A[0] = M_EVAL(S.pop());
  S.push("ck");
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  A[0] = 63;
  l[0] = A[0];
  S.push("__g");
  A[0] = M_EVAL(S.pop());
  S.push("z");
  A[0] = M_GET(A[0], S.pop());
  S.push("toString");
  { const _m = S.pop(); A[3] = A[0][_m](); };
  l[1] = A[3];
  A[0] = "nsol";
  S.push(A[0]);
  A[0] = l[1];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] > A[0];
  F = !!A[3];
}
function LIF_0(A,l,S,F){

if (typeof TRACE === "function") TRACE(0, A, l, S, F);
t0 = "005_ep5of98xMl=Oi4eegTO4vxKJ0BykStAMzO3VygzjzFLM5YItGrDSNnhpu8K6Czafg=MyvsN7dvwKN/eKWiNAlzfpaASVT0de1eQp1=4rg6p4y6USlXibd4MlxIjhCvCS";
t1 = __g;
M_SET(t1, "ck", t0);
t2 = 63;
v0 = t2;
t3 = __g;
t4 = t3?.z;
t5 = t4.toString();
v1 = t5;
t6 = "nsol";
t7 = t5;
t8 = t7.indexOf(t6);
t9 = 1;
t10 = (-t9);
t11 = (t8 > t10);
F = !!(t11);
S.push(t0);
}
{ // block 0
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_0); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_0);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 0 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_26(A,l,S,F){

  A[0] = l[0];
  A[1] = 40;
  A[1] = A[0] + A[1];
  l[2] = A[1];
}
function LIF_26(A,l,S,F){

if (typeof TRACE === "function") TRACE(26, A, l, S, F);
t0 = v0;
t1 = 40;
t2 = (t0 + t1);
v2 = t2;
}
{ // block 26
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_26); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_26);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 26 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_30(A,l,S,F){


}
function LIF_30(A,l,S,F){

if (typeof TRACE === "function") TRACE(30, A, l, S, F);
}
{ // block 30
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_30); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_30);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 30 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_31(A,l,S,F){

  A[0] = 64;
  S.push(A[0]);
  l[2] = A[0];
}
function LIF_31(A,l,S,F){

if (typeof TRACE === "function") TRACE(31, A, l, S, F);
t0 = 64;
v2 = t0;
S.push(t0);
}
{ // block 31
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_31); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_31);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 31 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_34(A,l,S,F){

  A[0] = "script[data-assets-tracker-config]";
  S.push(A[0]);
  S.push("document");
  A[0] = M_EVAL(S.pop());
  S.push("querySelector");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[3] = A[3];
  A[0] = l[3];
  A[1] = "";
  A[3] = A[0] + A[1];
  l[4] = A[3];
  A[0] = "HTMLScriptElement";
  S.push(A[0]);
  A[0] = l[4];
  S.push("indexOf");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  A[0] = 1;
  A[0] = -A[0];
  A[3] = A[3] === A[0];
  F = !!A[3];
}
function LIF_34(A,l,S,F){

if (typeof TRACE === "function") TRACE(34, A, l, S, F);
t0 = "script[data-assets-tracker-config]";
t1 = document;
t2 = t1.querySelector(t0);
v3 = t2;
t3 = t2;
t4 = "";
t5 = (t3 + t4);
v4 = t5;
t6 = "HTMLScriptElement";
t7 = t5;
t8 = t7.indexOf(t6);
t9 = 1;
t10 = (-t9);
t11 = (t8 === t10);
F = !!(t11);
}
{ // block 34
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_34); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_34);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 34 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_55(A,l,S,F){

  A[0] = l[2];
  A[1] = 41;
  A[1] = A[0] + A[1];
  l[2] = A[1];
}
function LIF_55(A,l,S,F){

if (typeof TRACE === "function") TRACE(55, A, l, S, F);
t0 = v2;
t1 = 41;
t2 = (t0 + t1);
v2 = t2;
}
{ // block 55
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_55); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_55);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 55 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_59(A,l,S,F){


}
function LIF_59(A,l,S,F){

if (typeof TRACE === "function") TRACE(59, A, l, S, F);
}
{ // block 59
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_59); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_59);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 59 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_60(A,l,S,F){

  A[0] = l[2];
  A[1] = 100;
  A[3] = A[0] < A[1];
  F = !!A[3];
}
function LIF_60(A,l,S,F){

if (typeof TRACE === "function") TRACE(60, A, l, S, F);
t0 = v2;
t1 = 100;
t2 = (t0 < t1);
F = !!(t2);
}
{ // block 60
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_60); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_60);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 60 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_65(A,l,S,F){

  A[0] = "005_oxzUYE7BqgGnj/EFmpVDTmQS10HfG8eFlpO47veTXs16/sJiBr419Gh2VW9/wPa4orM9wZJCZeojD2YGziudi7CNCmOaQ/4QGq0JGp3UfBTYguCYn6jsedDhmem9wRZY";
  S.push(A[0]);
  S.push(A[0]);
  S.push("__g");
  A[0] = M_EVAL(S.pop());
  S.push("ck");
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
}
function LIF_65(A,l,S,F){

if (typeof TRACE === "function") TRACE(65, A, l, S, F);
t0 = "005_oxzUYE7BqgGnj/EFmpVDTmQS10HfG8eFlpO47veTXs16/sJiBr419Gh2VW9/wPa4orM9wZJCZeojD2YGziudi7CNCmOaQ/4QGq0JGp3UfBTYguCYn6jsedDhmem9wRZY";
t1 = __g;
M_SET(t1, "ck", t0);
S.push(t0);
}
{ // block 65
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_65); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_65);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 65 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_72(A,l,S,F){


}
function LIF_72(A,l,S,F){

if (typeof TRACE === "function") TRACE(72, A, l, S, F);
}
{ // block 72
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_72); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_72);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 72 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_73(A,l,S,F){

  A[0] = 1;
  S.push(A[0]);
  S.push(A[0]);
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("_encrypt");
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  A[0] = SRC0;
  S.push(A[0]);
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("eval");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  /* UNPARSED: CLOSURE G=93 */;
  S.push(A[3]);
  S.push("__g");
  A[0] = M_EVAL(S.pop());
  S.push("copyBytesToGo");
  { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); };
  S.length = 0; F = undefined;
  A[0] = 0;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[5] = A[0];
  A[0] = 1;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[6] = A[0];
  A[0] = 2;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[7] = A[0];
  A[0] = l[6];
  S.push(A[0]);
  S.push("window");
  A[0] = M_EVAL(S.pop());
  S.push("BigInt");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[8] = A[3];
  A[0] = l[7];
  A[1] = l[8];
  A[3] = A[0] + A[1];
  S.push(A[3]);
  l[7] = A[3];
  A[0] = 1;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  l[9] = A[0];
  A[0] = 2;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  l[10] = A[0];
  A[0] = 4;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[11] = A[0];
  A[0] = 5;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[12] = A[0];
  A[0] = 3;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  l[13] = A[0];
  A[0] = 4;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  l[14] = A[0];
  A[0] = l[6];
  A[1] = "1022";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_73(A,l,S,F){

if (typeof TRACE === "function") TRACE(73, A, l, S, F);
t0 = 1;
t1 = window;
M_SET(t1, "_encrypt", t0);
t2 = SRC0;
t3 = window;
t4 = t3.eval(t2);
/* UNPARSED: CLOSURE G=93 */;
t5 = __g;
M_SET(t5, "copyBytesToGo", t4);
t6 = 0;
t7 = 0;
t8 = v0;
t9 = t8?.[t7];
t10 = t9?.[t6];
v5 = t10;
t11 = 1;
t12 = 0;
t13 = v0;
t14 = t13?.[t12];
t15 = t14?.[t11];
v6 = t15;
t16 = 2;
t17 = 0;
t18 = v0;
t19 = t18?.[t17];
t20 = t19?.[t16];
v7 = t20;
t21 = t15;
t22 = window;
t23 = t22.BigInt(t21);
v8 = t23;
t24 = t20;
t25 = t23;
t26 = (t24 + t25);
v7 = t26;
t27 = 1;
t28 = v0;
t29 = t28?.[t27];
v9 = t29;
t30 = 2;
t31 = v0;
t32 = t31?.[t30];
v10 = t32;
t33 = 4;
t34 = 0;
t35 = v0;
t36 = t35?.[t34];
t37 = t36?.[t33];
v11 = t37;
t38 = 5;
t39 = 0;
t40 = v0;
t41 = t40?.[t39];
t42 = t41?.[t38];
v12 = t42;
t43 = 3;
t44 = v0;
t45 = t44?.[t43];
v13 = t45;
t46 = 4;
t47 = v0;
t48 = t47?.[t46];
v14 = t48;
t49 = t15;
t50 = "1022";
t51 = (t49 === t50);
F = !!(t51);
S.push(t26);
}
{ // block 73
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_73); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_73);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 73 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_170(A,l,S,F){

  A[0] = 3;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[15] = A[0];
  A[0] = l[7];
  S.push(A[0]);
  A[0] = l[9];
  A[3] = A[0](...S.splice(-1));
  l[16] = A[3];
  A[0] = l[11];
  S.push(A[0]);
  A[0] = l[12];
  S.push(A[0]);
  A[0] = l[10];
  A[3] = A[0](...S.splice(-2));
  l[17] = A[3];
  A[0] = l[15];
  S.push(A[0]);
  A[0] = l[9];
  A[3] = A[0](...S.splice(-1));
  l[18] = A[3];
  A[0] = l[16];
  S.push(A[0]);
  A[0] = l[17];
  S.push(A[0]);
  A[0] = l[18];
  S.push(A[0]);
  S.push("Reflect");
  A[0] = M_EVAL(S.pop());
  S.push("set");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-3)); };
}
function LIF_170(A,l,S,F){

if (typeof TRACE === "function") TRACE(170, A, l, S, F);
t0 = 3;
t1 = 0;
t2 = v0;
t3 = t2?.[t1];
t4 = t3?.[t0];
v15 = t4;
t5 = v7;
t6 = v9;
t7 = t6(t5);
v16 = t7;
t8 = v11;
t9 = v12;
t10 = v10;
t11 = t10(t8, t9);
v17 = t11;
t12 = t4;
t13 = v9;
t14 = t13(t12);
v18 = t14;
t15 = t7;
t16 = t11;
t17 = t14;
t18 = Reflect;
t19 = t18.set(t15, t16, t17);
}
{ // block 170
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_170); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_170);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 170 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_205(A,l,S,F){


}
function LIF_205(A,l,S,F){

if (typeof TRACE === "function") TRACE(205, A, l, S, F);
}
{ // block 205
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_205); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_205);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 205 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_206(A,l,S,F){

  A[0] = l[6];
  A[1] = "1024";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_206(A,l,S,F){

if (typeof TRACE === "function") TRACE(206, A, l, S, F);
t0 = v6;
t1 = "1024";
t2 = (t0 === t1);
F = !!(t2);
}
{ // block 206
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_206); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_206);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 206 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_211(A,l,S,F){

  A[0] = 5;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  l[19] = A[0];
  A[0] = l[13];
  S.push(A[0]);
  A[0] = l[11];
  S.push(A[0]);
  A[0] = l[12];
  S.push(A[0]);
  S.push("DataView");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-3));
  l[20] = A[3];
  A[0] = l[20];
  S.push(A[0]);
  A[0] = l[19];
  S.push("decode");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[21] = A[3];
  A[0] = l[7];
  S.push(A[0]);
  A[0] = l[9];
  A[3] = A[0](...S.splice(-1));
  l[16] = A[3];
  A[0] = l[16];
  S.push(A[0]);
  A[0] = l[21];
  S.push(A[0]);
  S.push("Reflect");
  A[0] = M_EVAL(S.pop());
  S.push("get");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); };
  l[22] = A[3];
  A[0] = l[5];
  S.push(A[0]);
  A[0] = l[22];
  S.push(A[0]);
  A[0] = l[14];
  A[3] = A[0](...S.splice(-2));
  A[0] = l[13];
  S.push(A[0]);
  S.push("DataView");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-1));
  l[23] = A[3];
  A[0] = l[5];
  A[1] = 8;
  A[3] = A[0] + A[1];
  l[24] = A[3];
  A[0] = l[24];
  S.push(A[0]);
  A[0] = 1;
  S.push(A[0]);
  A[0] = l[23];
  S.push("setUint8");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); };
}
function LIF_211(A,l,S,F){

if (typeof TRACE === "function") TRACE(211, A, l, S, F);
t0 = 5;
t1 = v0;
t2 = t1?.[t0];
v19 = t2;
t3 = v13;
t4 = v11;
t5 = v12;
t6 = DataView;
t7 = new t6(t3, t4, t5);
v20 = t7;
t8 = t7;
t9 = t2;
t10 = t9.decode(t8);
v21 = t10;
t11 = v7;
t12 = v9;
t13 = t12(t11);
v16 = t13;
t14 = t13;
t15 = t10;
t16 = Reflect;
t17 = t16.get(t14, t15);
v22 = t17;
t18 = v5;
t19 = t17;
t20 = v14;
t21 = t20(t18, t19);
t22 = v13;
t23 = DataView;
t24 = new t23(t22);
v23 = t24;
t25 = v5;
t26 = 8;
t27 = (t25 + t26);
v24 = t27;
t28 = t27;
t29 = 1;
t30 = t24;
t31 = t30.setUint8(t28, t29);
}
{ // block 211
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_211); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_211);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 211 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_269(A,l,S,F){


}
function LIF_269(A,l,S,F){

if (typeof TRACE === "function") TRACE(269, A, l, S, F);
}
{ // block 269
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_269); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_269);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 269 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_270(A,l,S,F){

  A[0] = l[6];
  A[1] = "1026";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_270(A,l,S,F){

if (typeof TRACE === "function") TRACE(270, A, l, S, F);
t0 = v6;
t1 = "1026";
t2 = (t0 === t1);
F = !!(t2);
}
{ // block 270
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_270); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_270);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 270 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_275(A,l,S,F){

  A[0] = l[7];
  S.push(A[0]);
  A[0] = l[9];
  A[3] = A[0](...S.splice(-1));
  l[16] = A[3];
  A[0] = l[11];
  S.push(A[0]);
  A[0] = l[12];
  S.push(A[0]);
  A[0] = l[10];
  A[3] = A[0](...S.splice(-2));
  l[25] = A[3];
  A[0] = 6;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  l[26] = A[0];
  A[0] = 7;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[27] = A[0];
  A[0] = 8;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[28] = A[0];
  A[0] = 9;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[29] = A[0];
  A[0] = l[27];
  S.push(A[0]);
  A[0] = l[28];
  S.push(A[0]);
  A[0] = l[29];
  S.push(A[0]);
  A[0] = l[26];
  A[3] = A[0](...S.splice(-3));
  l[30] = A[3];
  A[0] = l[16];
  S.push(A[0]);
  A[0] = l[25];
  S.push(A[0]);
  S.push("Reflect");
  A[0] = M_EVAL(S.pop());
  S.push("get");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); };
  l[31] = A[3];
  A[0] = l[31];
  S.push(A[0]);
  A[0] = l[16];
  S.push(A[0]);
  A[0] = l[30];
  S.push(A[0]);
  S.push("Reflect");
  A[0] = M_EVAL(S.pop());
  S.push("apply");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-3)); };
  l[32] = A[3];
  A[0] = l[5];
  S.push(A[0]);
  A[0] = l[32];
  S.push(A[0]);
  A[0] = l[14];
  A[3] = A[0](...S.splice(-2));
  A[0] = l[13];
  S.push(A[0]);
  S.push("DataView");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-1));
  l[23] = A[3];
  A[0] = l[5];
  A[1] = 8;
  A[3] = A[0] + A[1];
  l[24] = A[3];
  A[0] = l[24];
  S.push(A[0]);
  A[0] = 1;
  S.push(A[0]);
  A[0] = l[23];
  S.push("setUint8");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); };
}
function LIF_275(A,l,S,F){

if (typeof TRACE === "function") TRACE(275, A, l, S, F);
t0 = v7;
t1 = v9;
t2 = t1(t0);
v16 = t2;
t3 = v11;
t4 = v12;
t5 = v10;
t6 = t5(t3, t4);
v25 = t6;
t7 = 6;
t8 = v0;
t9 = t8?.[t7];
v26 = t9;
t10 = 7;
t11 = 0;
t12 = v0;
t13 = t12?.[t11];
t14 = t13?.[t10];
v27 = t14;
t15 = 8;
t16 = 0;
t17 = v0;
t18 = t17?.[t16];
t19 = t18?.[t15];
v28 = t19;
t20 = 9;
t21 = 0;
t22 = v0;
t23 = t22?.[t21];
t24 = t23?.[t20];
v29 = t24;
t25 = t14;
t26 = t19;
t27 = t24;
t28 = t9;
t29 = t28(t25, t26, t27);
v30 = t29;
t30 = t2;
t31 = t6;
t32 = Reflect;
t33 = t32.get(t30, t31);
v31 = t33;
t34 = t33;
t35 = t2;
t36 = t29;
t37 = Reflect;
t38 = t37.apply(t34, t35, t36);
v32 = t38;
t39 = v5;
t40 = t38;
t41 = v14;
t42 = t41(t39, t40);
t43 = v13;
t44 = DataView;
t45 = new t44(t43);
v23 = t45;
t46 = v5;
t47 = 8;
t48 = (t46 + t47);
v24 = t48;
t49 = t48;
t50 = 1;
t51 = t45;
t52 = t51.setUint8(t49, t50);
}
{ // block 275
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_275); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_275);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 275 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_368(A,l,S,F){


}
function LIF_368(A,l,S,F){

if (typeof TRACE === "function") TRACE(368, A, l, S, F);
}
{ // block 368
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_368); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_368);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 368 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_369(A,l,S,F){

  A[0] = l[6];
  A[1] = "1028";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_369(A,l,S,F){

if (typeof TRACE === "function") TRACE(369, A, l, S, F);
t0 = v6;
t1 = "1028";
t2 = (t0 === t1);
F = !!(t2);
}
{ // block 369
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_369); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_369);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 369 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_374(A,l,S,F){

  A[0] = 7;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  l[33] = A[0];
  A[0] = l[7];
  S.push(A[0]);
  A[0] = l[9];
  A[3] = A[0](...S.splice(-1));
  l[34] = A[3];
  A[0] = l[34];
  S.push(A[0]);
  S.push("String");
  A[0] = M_EVAL(S.pop());
  l[35] = A[3];
  A[0] = l[35];
  S.push(A[0]);
  A[0] = l[33];
  S.push("encode");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[36] = A[3];
  A[0] = l[5];
  S.push(A[0]);
  A[0] = l[36];
  S.push(A[0]);
  A[0] = l[14];
  A[3] = A[0](...S.splice(-2));
  A[0] = l[13];
  S.push(A[0]);
  S.push("DataView");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-1));
  l[23] = A[3];
  A[0] = l[5];
  A[1] = 8;
  A[3] = A[0] + A[1];
  l[24] = A[3];
  A[0] = l[24];
  S.push(A[0]);
  A[0] = 1;
  S.push(A[0]);
  A[0] = l[23];
  S.push("setUint8");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); };
}
function LIF_374(A,l,S,F){

if (typeof TRACE === "function") TRACE(374, A, l, S, F);
t0 = 7;
t1 = v0;
t2 = t1?.[t0];
v33 = t2;
t3 = v7;
t4 = v9;
t5 = t4(t3);
v34 = t5;
t6 = t5;
t7 = String;
v35 = t5;
t8 = t5;
t9 = t2;
t10 = t9.encode(t8);
v36 = t10;
t11 = v5;
t12 = t10;
t13 = v14;
t14 = t13(t11, t12);
t15 = v13;
t16 = DataView;
t17 = new t16(t15);
v23 = t17;
t18 = v5;
t19 = 8;
t20 = (t18 + t19);
v24 = t20;
t21 = t20;
t22 = 1;
t23 = t17;
t24 = t23.setUint8(t21, t22);
S.push(t6);
}
{ // block 374
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_374); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_374);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 374 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_420(A,l,S,F){

  S.push("String");
  A[0] = M_EVAL(S.pop());
  l[35] = A[3];
  A[0] = l[35];
}
function LIF_420(A,l,S,F){

if (typeof TRACE === "function") TRACE(420, A, l, S, F);
t0 = String;
v35 = A[3];
t1 = v35;
}
{ // block 420
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_420); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_420);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 420 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_424(A,l,S,F){

  S.push(A[0]);
}
function LIF_424(A,l,S,F){

if (typeof TRACE === "function") TRACE(424, A, l, S, F);
S.push(A[0]);
}
{ // block 424
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_424); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_424);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 424 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_425(A,l,S,F){

  A[0] = l[33];
  S.push("encode");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
  l[36] = A[3];
  A[0] = l[5];
  S.push(A[0]);
  A[0] = l[36];
  S.push(A[0]);
  A[0] = l[14];
  A[3] = A[0](...S.splice(-2));
  A[0] = l[13];
  S.push(A[0]);
  S.push("DataView");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-1));
  l[23] = A[3];
  A[0] = l[5];
  A[1] = 8;
  A[3] = A[0] + A[1];
  l[24] = A[3];
  A[0] = l[36];
  S.push("length");
  A[0] = M_GET(A[0], S.pop());
  l[37] = A[0];
  A[0] = l[24];
  S.push(A[0]);
  A[0] = l[37];
  S.push(A[0]);
  A[0] = "true";
  S.push(A[0]);
  A[0] = l[23];
  S.push("setInt32");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-3)); };
}
function LIF_425(A,l,S,F){

if (typeof TRACE === "function") TRACE(425, A, l, S, F);
t0 = v33;
v36 = A[3];
t1 = v5;
t2 = v36;
t3 = v14;
t4 = t3(t1, t2);
t5 = v13;
t6 = DataView;
t7 = new t6(t5);
v23 = t7;
t8 = v5;
t9 = 8;
t10 = (t8 + t9);
v24 = t10;
t11 = v36;
t12 = t11?.length;
v37 = t12;
t13 = t10;
t14 = t12;
t15 = "true";
t16 = t7;
t17 = t16.setInt32(t13, t14, t15);
S.push("encode");
}
{ // block 425
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_425); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_425);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 425 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_459(A,l,S,F){

  A[0] = l[6];
  A[1] = "1030";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_459(A,l,S,F){

if (typeof TRACE === "function") TRACE(459, A, l, S, F);
t0 = v6;
t1 = "1030";
t2 = (t0 === t1);
F = !!(t2);
}
{ // block 459
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_459); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_459);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 459 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_464(A,l,S,F){

  A[0] = 8;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  l[38] = A[0];
  A[0] = 10;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[39] = A[0];
  A[0] = 11;
}
function LIF_464(A,l,S,F){

if (typeof TRACE === "function") TRACE(464, A, l, S, F);
t0 = 8;
t1 = v0;
t2 = t1?.[t0];
v38 = t2;
t3 = 10;
t4 = 0;
t5 = v0;
t6 = t5?.[t4];
t7 = t6?.[t3];
v39 = t7;
t8 = 11;
}
{ // block 464
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_464); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_464);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 464 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_478(A,l,S,F){

  S.push(A[0]);
}
function LIF_478(A,l,S,F){

if (typeof TRACE === "function") TRACE(478, A, l, S, F);
S.push(A[0]);
}
{ // block 478
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_478); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_478);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 478 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_479(A,l,S,F){

  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[40] = A[0];
  A[0] = 12;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[41] = A[0];
  A[0] = l[7];
  S.push(A[0]);
  A[0] = l[9];
  A[3] = A[0](...S.splice(-1));
  l[42] = A[3];
  A[0] = l[39];
  S.push(A[0]);
  A[0] = l[40];
  S.push(A[0]);
  A[0] = l[41];
  S.push(A[0]);
  A[0] = l[38];
  A[3] = A[0](...S.splice(-3));
  l[43] = A[3];
  A[0] = l[42];
  S.push(A[0]);
  A[0] = l[43];
  S.push("set");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); };
}
function LIF_479(A,l,S,F){

if (typeof TRACE === "function") TRACE(479, A, l, S, F);
t0 = 0;
t1 = v0;
t2 = t1?.[t0];
v40 = t2;
t3 = 12;
t4 = 0;
t5 = v0;
t6 = t5?.[t4];
t7 = t6?.[t3];
v41 = t7;
t8 = v7;
t9 = v9;
t10 = t9(t8);
v42 = t10;
t11 = v39;
t12 = t2;
t13 = t7;
t14 = v38;
t15 = t14(t11, t12, t13);
v43 = t15;
t16 = t10;
t17 = t15;
t18 = t17.set(t16);
}
{ // block 479
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_479); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_479);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 479 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_513(A,l,S,F){

  A[0] = l[6];
}
function LIF_513(A,l,S,F){

if (typeof TRACE === "function") TRACE(513, A, l, S, F);
t0 = v6;
}
{ // block 513
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_513); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_513);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 513 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_514(A,l,S,F){

  A[1] = "1032";
}
function LIF_514(A,l,S,F){

if (typeof TRACE === "function") TRACE(514, A, l, S, F);
t0 = "1032";
}
{ // block 514
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_514); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_514);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 514 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_515(A,l,S,F){

  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_515(A,l,S,F){

if (typeof TRACE === "function") TRACE(515, A, l, S, F);
t0 = (A[0] === A[1]);
F = !!(t0);
}
{ // block 515
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_515); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_515);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 515 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_518(A,l,S,F){

  A[0] = l[11];
  S.push(A[0]);
  A[0] = l[12];
  S.push(A[0]);
  A[0] = l[10];
  A[3] = A[0](...S.splice(-2));
  l[44] = A[3];
  A[0] = l[5];
  S.push(A[0]);
  A[0] = l[44];
  S.push(A[0]);
  A[0] = l[14];
  A[3] = A[0](...S.splice(-2));
  A[0] = l[13];
  S.push(A[0]);
  S.push("DataView");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-1));
  l[23] = A[3];
  A[0] = l[5];
  A[1] = 8;
  A[3] = A[0] + A[1];
  l[24] = A[3];
  A[0] = l[24];
  S.push(A[0]);
  A[0] = 1;
  S.push(A[0]);
  A[0] = l[23];
  S.push("setUint8");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); };
}
function LIF_518(A,l,S,F){

if (typeof TRACE === "function") TRACE(518, A, l, S, F);
t0 = v11;
t1 = v12;
t2 = v10;
t3 = t2(t0, t1);
v44 = t3;
t4 = v5;
t5 = t3;
t6 = v14;
t7 = t6(t4, t5);
t8 = v13;
t9 = DataView;
t10 = new t9(t8);
v23 = t10;
t11 = v5;
t12 = 8;
t13 = (t11 + t12);
v24 = t13;
t14 = t13;
t15 = 1;
t16 = t10;
t17 = t16.setUint8(t14, t15);
}
{ // block 518
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_518); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_518);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 518 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_549(A,l,S,F){

  A[0] = l[6];
  A[1] = "1034";
  A[3] = A[0] === A[1];
  F = !!A[3];
}
function LIF_549(A,l,S,F){

if (typeof TRACE === "function") TRACE(549, A, l, S, F);
t0 = v6;
t1 = "1034";
t2 = (t0 === t1);
F = !!(t2);
}
{ // block 549
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_549); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_549);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 549 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_554(A,l,S,F){

  A[0] = l[7];
  S.push(A[0]);
  A[0] = l[9];
  A[3] = A[0](...S.splice(-1));
  l[16] = A[3];
  A[0] = 6;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  l[26] = A[0];
  A[0] = 7;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[27] = A[0];
  A[0] = 8;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[28] = A[0];
  A[0] = 9;
  S.push(A[0]);
  A[0] = 0;
  S.push(A[0]);
  A[0] = l[0];
  A[0] = M_GET(A[0], S.pop());
  A[0] = M_GET(A[0], S.pop());
  l[29] = A[0];
  A[0] = l[27];
  S.push(A[0]);
  A[0] = l[28];
  S.push(A[0]);
  A[0] = l[29];
  S.push(A[0]);
  A[0] = l[26];
  A[3] = A[0](...S.splice(-3));
  l[30] = A[3];
  A[0] = l[16];
}
function LIF_554(A,l,S,F){

if (typeof TRACE === "function") TRACE(554, A, l, S, F);
t0 = v7;
t1 = v9;
t2 = t1(t0);
v16 = t2;
t3 = 6;
t4 = v0;
t5 = t4?.[t3];
v26 = t5;
t6 = 7;
t7 = 0;
t8 = v0;
t9 = t8?.[t7];
t10 = t9?.[t6];
v27 = t10;
t11 = 8;
t12 = 0;
t13 = v0;
t14 = t13?.[t12];
t15 = t14?.[t11];
v28 = t15;
t16 = 9;
t17 = 0;
t18 = v0;
t19 = t18?.[t17];
t20 = t19?.[t16];
v29 = t20;
t21 = t10;
t22 = t15;
t23 = t20;
t24 = t5;
t25 = t24(t21, t22, t23);
v30 = t25;
t26 = t2;
}
{ // block 554
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_554); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_554);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 554 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_598(A,l,S,F){

  S.push(A[0]);
}
function LIF_598(A,l,S,F){

if (typeof TRACE === "function") TRACE(598, A, l, S, F);
S.push(A[0]);
}
{ // block 598
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_598); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_598);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 598 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
function DEV_599(A,l,S,F){

  S.push("undefined");
  A[0] = M_EVAL(S.pop());
  S.push(A[0]);
  A[0] = l[30];
  S.push(A[0]);
  S.push("Reflect");
  A[0] = M_EVAL(S.pop());
  S.push("apply");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-3)); };
  l[32] = A[3];
  A[0] = l[5];
  S.push(A[0]);
  A[0] = l[32];
  S.push(A[0]);
  A[0] = l[14];
  A[3] = A[0](...S.splice(-2));
  A[0] = l[13];
  S.push(A[0]);
  S.push("DataView");
  A[0] = M_EVAL(S.pop());
  A[3] = new A[0](...S.splice(-1));
  l[23] = A[3];
  A[0] = l[5];
  A[1] = 8;
  A[3] = A[0] + A[1];
  l[24] = A[3];
  A[0] = l[24];
  S.push(A[0]);
  A[0] = 1;
  S.push(A[0]);
  A[0] = l[23];
  S.push("setUint8");
  { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); };
}
function LIF_599(A,l,S,F){

if (typeof TRACE === "function") TRACE(599, A, l, S, F);
t0 = undefined;
t1 = v30;
t2 = Reflect;
v32 = A[3];
t3 = v5;
t4 = v32;
t5 = v14;
t6 = t5(t3, t4);
t7 = v13;
t8 = DataView;
t9 = new t8(t7);
v23 = t9;
t10 = v5;
t11 = 8;
t12 = (t10 + t11);
v24 = t12;
t13 = t12;
t14 = 1;
t15 = t9;
t16 = t15.setUint8(t13, t14);
S.push(t0);
S.push(t1);
S.push("apply");
}
{ // block 599
  const s1 = mk(), s2 = mk(); resetTemps();
  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_599); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_599);
  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + 599 + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }
}
console.log("  per-block differential: 37 blocks, "+PASS+" pass, "+FAIL+" fail");
if (typeof process !== "undefined") process.exit(FAIL?1:0);
