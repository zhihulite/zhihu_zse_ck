const SRC0 = "\u0007 \u0007)\u000b.\u0002p<h&5.#4)/.h\u001fp8r\"pv$$l\u001fp8trww#xi;#/.34`\u001fp8ryt&u$}\u001fp8qw!sl\u001fp8#qppst}\u001fp8r\"pv$$hi{7(),%haa\u001b\u001di;429;#/.34`\u001fp8tx%pp\"}m0!23%\t.4h\u001fp8ryt&u$hp8ysiiohp8sjp8ur#kmp8rv#%kp8qwt\"ijh0!23%\t.4h\u001fp8ryt&u$hp8\"&iiohp8qjmp8&uqkmp8s&qkp8qrjp8qqriikm0!23%\t.4h\u001fp8ryt&u$hp8!$iiohp8\"jmp8qurkmp8rxykp8qqqrik0!23%\t.4h\u001fp8ryt&u$hp8\"";

// CVM 950-word program, devirtualized from .probe/map/full_disasm_new.txt
// by py/devirt.py  --  basic-block CFG, constants inlined from blob_constants_dec.json
// Helper semantics: M_GET(o,k)=o[k]; M_EVAL resolves a member/call site; M_SET(o,k,v).
// Registers: A[0..3] value stack slots, l[] locals, S[] operand stack, F flag, D[] const pool.
// ground truth from the folded interpreter (.probe/bvm-t.folded.js):
//   eval : F[P] = eval(R.pop())          -> globals resolved BY NAME, 1 pop
//   get  : F[P] = F[T][R.pop()]          -> object comes from a register
//   set  : F[T][k] = v                   -> k = top of stack, then v
//   call : F[3] = F[Z][R.pop()](...args) -> method name popped, args unshifted
//   frame: child.B = [0,...parent.B], child.B[0..argc-1] = args, result = child.F[3]
const DEC_POOL = ["005_ep5of98xMl=Oi4eegTO4vxKJ0BykStAMzO3VygzjzFLM5YItGrDSNnhpu8K6Czafg=MyvsN7dvwKN/eKWiNAlzfpaASVT0de1eQp1=4rg6p4y6USlXibd4MlxIjhCvCS", "__g", "ck", "z", "toString", "nsol", "indexOf", "script[data-assets-tracker-config]", "document", "querySelector", "", "HTMLScriptElement", "005_oxzUYE7BqgGnj/EFmpVDTmQS10HfG8eFlpO47veTXs16/sJiBr419Gh2VW9/wPa4orM9wZJCZeojD2YGziudi7CNCmOaQ/4QGq0JGp3UfBTYguCYn6jsedDhmem9wRZY", "window", "_encrypt", "\u0007 \u0007)\u000b.\u0002p<h&5.#4)/.h\u001fp8r\"pv$$l\u001fp8trww#xi;#/.34`\u001fp8ryt&u$}\u001fp8qw!sl\u001fp8#qppst}\u001fp8r\"pv$$hi{7(),%haa\u001b\u001di;429;#/.34`\u001fp8tx%pp\"}m0!23%\t.4h\u001fp8ryt&u$hp8ysiiohp8sjp8ur#kmp8rv#%kp8qwt\"ijh0!23%\t.4h\u001fp8ryt&u$hp8\"&iiohp8qjmp8&uqkmp8s&qkp8qrjp8qqriikm0!23%\t.4h\u001fp8ryt&u$hp8!$iiohp8\"jmp8qurkmp8rxykp8qqqrik0!23%\t.4h\u001fp8ryt&u$hp8\"", "eval", "copyBytesToGo", "BigInt", "1022", "Reflect", "set", "1024", "DataView", "decode", "get", "setUint8", "1026", "apply", "1028", "String", "encode", "length", "true", "setInt32", "1030", "1032", "1034", "undefined"];
function M_GET(o, k) { return (o === undefined || o === null) ? undefined : o[k]; }
function M_SET(o, k, v) { if (o !== undefined && o !== null) o[k] = v; return v; }
function M_EVAL(name) { return eval(name); }
function SUBCALL(A, l, S, i, argc) {
  const entry = A[i];
  if (typeof entry !== 'number') return undefined;
  const args = argc ? S.splice(-argc) : [];
  const cl = [0].concat(l);
  for (let t = 0; t < args.length; t++) cl[t] = args[t];
  const r = RUN(cl, DEC_POOL, undefined, entry);   // nested frame, result slot F[3]
  return r && r.A ? r.A[3] : undefined;
}

function RUN(l, D, A, pc) {
  A = A || [undefined, undefined, undefined, undefined];
  l = l || [];
  pc = pc || 0;
  const S = []; let F = false; let _n = 0;
  while (true) {
    if (typeof TRACE === 'function') TRACE(pc, A, l, S, F, ++_n);
    switch (pc) {
    case 0: {  // instrs 0..25
      A[0] = "005_ep5of98xMl=Oi4eegTO4vxKJ0BykStAMzO3VygzjzFLM5YItGrDSNnhpu8K6Czafg=MyvsN7dvwKN/eKWiNAlzfpaASVT0de1eQp1=4rg6p4y6USlXibd4MlxIjhCvCS";
      S.push(A[0]);
      S.push(A[0]);
      S.push("__g");
      A[0] = M_EVAL(S.pop());
      S.push("ck");
      { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); }
      A[0] = 63;
      l[0] = A[0];
      S.push("__g");
      A[0] = M_EVAL(S.pop());
      S.push("z");
      A[0] = M_GET(A[0], S.pop());
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      l[1] = A[3];
      A[0] = "nsol";
      S.push(A[0]);
      A[0] = l[1];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] > A[0];
      F = !!A[3];
      if (!F) { pc = 30; continue; }
      pc = 26; continue; }
    case 26: {  // instrs 26..29
      A[0] = l[0];
      A[1] = 40;
      A[1] = A[0] + A[1];
      l[2] = A[1];
      pc = 30; continue; }
    case 30: {  // instrs 30..30
      if (F) { pc = 34; continue; }
      pc = 31; continue; }
    case 31: {  // instrs 31..33
      A[0] = 64;
      S.push(A[0]);
      l[2] = A[0];
      pc = 34; continue; }
    case 34: {  // instrs 34..54
      A[0] = "script[data-assets-tracker-config]";
      S.push(A[0]);
      S.push("document");
      A[0] = M_EVAL(S.pop());
      S.push("querySelector");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[3] = A[3];
      A[0] = l[3];
      A[1] = "";
      A[3] = A[0] + A[1];
      l[4] = A[3];
      A[0] = "HTMLScriptElement";
      S.push(A[0]);
      A[0] = l[4];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 59; continue; }
      pc = 55; continue; }
    case 55: {  // instrs 55..58
      A[0] = l[2];
      A[1] = 41;
      A[1] = A[0] + A[1];
      l[2] = A[1];
      pc = 59; continue; }
    case 59: {  // instrs 59..59
      if (F) { pc = 60; continue; }
      pc = 60; continue; }
    case 60: {  // instrs 60..64
      A[0] = l[2];
      A[1] = 100;
      A[3] = A[0] < A[1];
      F = !!A[3];
      if (!F) { pc = 72; continue; }
      pc = 65; continue; }
    case 65: {  // instrs 65..71
      A[0] = "005_oxzUYE7BqgGnj/EFmpVDTmQS10HfG8eFlpO47veTXs16/sJiBr419Gh2VW9/wPa4orM9wZJCZeojD2YGziudi7CNCmOaQ/4QGq0JGp3UfBTYguCYn6jsedDhmem9wRZY";
      S.push(A[0]);
      S.push(A[0]);
      S.push("__g");
      A[0] = M_EVAL(S.pop());
      S.push("ck");
      { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); }
      pc = 72; continue; }
    case 72: {  // instrs 72..72
      if (F) { pc = 73; continue; }
      pc = 73; continue; }
    case 73: {  // instrs 73..169
      A[0] = 1;
      S.push(A[0]);
      S.push(A[0]);
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("_encrypt");
      { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); }
      A[0] = SRC0;
      S.push(A[0]);
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("eval");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      /* UNPARSED: CLOSURE G=93 */
      S.push(A[3]);
      S.push("__g");
      A[0] = M_EVAL(S.pop());
      S.push("copyBytesToGo");
      { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
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
      if (!F) { pc = 205; continue; }
      pc = 170; continue; }
    case 170: {  // instrs 170..204
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-3)); }
      pc = 205; continue; }
    case 205: {  // instrs 205..205
      if (F) { pc = 206; continue; }
      pc = 206; continue; }
    case 206: {  // instrs 206..210
      A[0] = l[6];
      A[1] = "1024";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 269; continue; }
      pc = 211; continue; }
    case 211: {  // instrs 211..268
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); }
      pc = 269; continue; }
    case 269: {  // instrs 269..269
      if (F) { pc = 270; continue; }
      pc = 270; continue; }
    case 270: {  // instrs 270..274
      A[0] = l[6];
      A[1] = "1026";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 368; continue; }
      pc = 275; continue; }
    case 275: {  // instrs 275..367
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-3)); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); }
      pc = 368; continue; }
    case 368: {  // instrs 368..368
      if (F) { pc = 369; continue; }
      pc = 369; continue; }
    case 369: {  // instrs 369..373
      A[0] = l[6];
      A[1] = "1028";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 424; continue; }
      pc = 374; continue; }
    case 374: {  // instrs 374..418
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); }
      if (F) { pc = 599; continue; }
      pc = 419; continue; }
    case 419: {  // instrs 419..419
      return { A: A, l: l };
      }
    case 420: {  // instrs 420..423
      S.push("String");
      A[0] = M_EVAL(S.pop());
      l[35] = A[3];
      A[0] = l[35];
      pc = 424; continue; }
    case 424: {  // instrs 424..424
      S.push(A[0]);
      pc = 425; continue; }
    case 425: {  // instrs 425..458
      A[0] = l[33];
      S.push("encode");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-3)); }
      if (F) { pc = 425; continue; }
      pc = 459; continue; }
    case 459: {  // instrs 459..463
      A[0] = l[6];
      A[1] = "1030";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 478; continue; }
      pc = 464; continue; }
    case 464: {  // instrs 464..477
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
      pc = 478; continue; }
    case 478: {  // instrs 478..478
      S.push(A[0]);
      pc = 479; continue; }
    case 479: {  // instrs 479..512
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      if (F) { pc = 479; continue; }
      pc = 513; continue; }
    case 513: {  // instrs 513..513
      A[0] = l[6];
      pc = 514; continue; }
    case 514: {  // instrs 514..514
      A[1] = "1032";
      pc = 515; continue; }
    case 515: {  // instrs 515..517
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 514; continue; }
      pc = 518; continue; }
    case 518: {  // instrs 518..548
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); }
      if (F) { pc = 515; continue; }
      pc = 549; continue; }
    case 549: {  // instrs 549..553
      A[0] = l[6];
      A[1] = "1034";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 598; continue; }
      pc = 554; continue; }
    case 554: {  // instrs 554..597
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
      pc = 598; continue; }
    case 598: {  // instrs 598..598
      S.push(A[0]);
      pc = 599; continue; }
    case 599: {  // instrs 599..632
      S.push("undefined");
      A[0] = M_EVAL(S.pop());
      S.push(A[0]);
      A[0] = l[30];
      S.push(A[0]);
      S.push("Reflect");
      A[0] = M_EVAL(S.pop());
      S.push("apply");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-3)); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); }
      if (F) { pc = 599; continue; }
      pc = 633; continue; }
    default: throw new Error('bad pc ' + pc);
  } }
}
if (typeof module !== 'undefined') { module.exports = { RUN: RUN, M_GET: M_GET, M_SET: M_SET, M_EVAL: M_EVAL, DEC: DEC_POOL }; }
