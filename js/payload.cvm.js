const SRC0 = "try{window={};document={};var c=0;\"A,ABBR,ACRONYM,ADDRESS,APPLET,AREA,ARTICLE,ASIDE,AUDIO,B,BASE,BASEFONT,BDI,BDO,BGSOUND,BIG,BLINK,BLOCKQUOTE,BODY,BR,BUTTON,CANVAS,CAPTION,CENTER,CITE,CODE,COL,COLGROUP,CONTENT,DATA,DATALIST,DD,DECORATOR,DEL,DETAILS,DFN,DIALOG,DIR,DIV,DL,DT,ELEMENT,EM,EMBED,FIELDSET,FIGCAPTION,FIGURE,FONT,FOOTER,FORM,FRAME,FRAMESET,H1,H2,H3,H4,H5,H6,HEAD,HEADER,HGROUP,HR,HTML,I,IFRAME,IMAGE,IMG,INPUT,INS,ISINDEX,KBD,KEYGEN,LABEL,LEGEND,LI,LINK,LISTING,MAIN,MAP,MARK,MARQUEE,MENU,MENUITEM,META,METER,NAV,NOBR,NOEMBED,NOFRAMES,NOSCRIPT,OBJECT,OL,OPTGROUP,OPTION,OUTPUT,P,PARAM,PLAINTEXT,PRE,PROGRESS,Q,RP,RT,RTC,RUBY,S,SAMP,SCRIPT,SECTION,SELECT,SHADOW,SLOT,SMALL,SOURCE,SPACER,SPAN,STRIKE,STRONG,STYLE,SUB,SUMMARY,SUP,TABLE,TBODY,TD,TEMPLATE,TEXTAREA,TFOOT,TH,THEAD,TIME,TITLE,TR,TRACK,TT,U,UL,VAR,VIDEO,WBR,XMP\".split(\",\").forEach(function(i){document.createElement(i).tagName!==i&&(c=1)});return c}catch(_){return 2}";
const SRC1 = "try{window={};document={};var p=null,q=\"A,ABBR,ACRONYM,ADDRESS,APPLET,AREA,ARTICLE,ASIDE,AUDIO,B,BASE,BASEFONT,BDI,BDO,BGSOUND,BIG,BLINK,BLOCKQUOTE,BODY,BR,BUTTON,CANVAS,CAPTION,CENTER,CITE,CODE,COL,COLGROUP,CONTENT,DATA,DATALIST,DD,DECORATOR,DEL,DETAILS,DFN,DIALOG,DIR,DIV,DL,DT,ELEMENT,EM,EMBED,FIELDSET,FIGCAPTION,FIGURE,FONT,FOOTER,FORM,FRAME,FRAMESET,H1,H2,H3,H4,H5,H6,HEAD,HEADER,HGROUP,HR,HTML,I,IFRAME,IMAGE,IMG,INPUT,INS,ISINDEX,KBD,KEYGEN,LABEL,LEGEND,LI,LINK,LISTING,MAIN,MAP,MARK,MARQUEE,MENU,MENUITEM,META,METER,NAV,NOBR,NOEMBED,NOFRAMES,NOSCRIPT,OBJECT,OL,OPTGROUP,OPTION,OUTPUT,P,PARAM,PLAINTEXT,PRE,PROGRESS,Q,RP,RT,RTC,RUBY,S,SAMP,SCRIPT,SECTION,SELECT,SHADOW,SLOT,SMALL,SOURCE,SPACER,SPAN,STRIKE,STRONG,STYLE,SUB,SUMMARY,SUP,TABLE,TBODY,TD,TEMPLATE,TEXTAREA,TFOOT,TH,THEAD,TIME,TITLE,TR,TRACK,TT,U,UL,VAR,VIDEO,WBR,XMP\";q.split(\",\").forEach(function(i){e=document.createElement(i);e.tagName===i&&p&&p.appendChild(e);p=e});while(p.parentNode){if(q.indexOf(p.tagName)>-1){p=p.parentNode}else{break}};return p.tagName}catch(_){return \"\"}";

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
const DEC_POOL = ["8204", "String", "fromCharCode", "Object", "a", "b", "return b in a ? a[b]: undefined", "Function", "get", "c", "a[b]=c;return true", "set", "window", "Proxy", "keys", "top", "indexOf", "customElements", "name", "self", "print", "open", "_encrypt", "__g", "window={};document={};return document", "URL", "zhihu", "all", "undefined", "length", "number", "try{window={};document={};return document.all()}catch(_){}", "object", "tagName", "HTML", "HTMLHtmlElement", "toString", "script", "getElementsByTagName", "Collection", "createElement", "bind", "SCRIPT", "style", "try{window={};document={};var c=0;\"A,ABBR,ACRONYM,ADDRESS,APPLET,AREA,ARTICLE,ASIDE,AUDIO,B,BASE,BASEFONT,BDI,BDO,BGSOUND,BIG,BLINK,BLOCKQUOTE,BODY,BR,BUTTON,CANVAS,CAPTION,CENTER,CITE,CODE,COL,COLGROUP,CONTENT,DATA,DATALIST,DD,DECORATOR,DEL,DETAILS,DFN,DIALOG,DIR,DIV,DL,DT,ELEMENT,EM,EMBED,FIELDSET,FIGCAPTION,FIGURE,FONT,FOOTER,FORM,FRAME,FRAMESET,H1,H2,H3,H4,H5,H6,HEAD,HEADER,HGROUP,HR,HTML,I,IFRAME,IMAGE,IMG,INPUT,INS,ISINDEX,KBD,KEYGEN,LABEL,LEGEND,LI,LINK,LISTING,MAIN,MAP,MARK,MARQUEE,MENU,MENUITEM,META,METER,NAV,NOBR,NOEMBED,NOFRAMES,NOSCRIPT,OBJECT,OL,OPTGROUP,OPTION,OUTPUT,P,PARAM,PLAINTEXT,PRE,PROGRESS,Q,RP,RT,RTC,RUBY,S,SAMP,SCRIPT,SECTION,SELECT,SHADOW,SLOT,SMALL,SOURCE,SPACER,SPAN,STRIKE,STRONG,STYLE,SUB,SUMMARY,SUP,TABLE,TBODY,TD,TEMPLATE,TEXTAREA,TFOOT,TH,THEAD,TIME,TITLE,TR,TRACK,TT,U,UL,VAR,VIDEO,WBR,XMP\".split(\",\").forEach(function(i){document.createElement(i).tagName!==i&&(c=1)});return c}catch(_){return 2}", "try{window={};document={};var p=null,q=\"A,ABBR,ACRONYM,ADDRESS,APPLET,AREA,ARTICLE,ASIDE,AUDIO,B,BASE,BASEFONT,BDI,BDO,BGSOUND,BIG,BLINK,BLOCKQUOTE,BODY,BR,BUTTON,CANVAS,CAPTION,CENTER,CITE,CODE,COL,COLGROUP,CONTENT,DATA,DATALIST,DD,DECORATOR,DEL,DETAILS,DFN,DIALOG,DIR,DIV,DL,DT,ELEMENT,EM,EMBED,FIELDSET,FIGCAPTION,FIGURE,FONT,FOOTER,FORM,FRAME,FRAMESET,H1,H2,H3,H4,H5,H6,HEAD,HEADER,HGROUP,HR,HTML,I,IFRAME,IMAGE,IMG,INPUT,INS,ISINDEX,KBD,KEYGEN,LABEL,LEGEND,LI,LINK,LISTING,MAIN,MAP,MARK,MARQUEE,MENU,MENUITEM,META,METER,NAV,NOBR,NOEMBED,NOFRAMES,NOSCRIPT,OBJECT,OL,OPTGROUP,OPTION,OUTPUT,P,PARAM,PLAINTEXT,PRE,PROGRESS,Q,RP,RT,RTC,RUBY,S,SAMP,SCRIPT,SECTION,SELECT,SHADOW,SLOT,SMALL,SOURCE,SPACER,SPAN,STRIKE,STRONG,STYLE,SUB,SUMMARY,SUP,TABLE,TBODY,TD,TEMPLATE,TEXTAREA,TFOOT,TH,THEAD,TIME,TITLE,TR,TRACK,TT,U,UL,VAR,VIDEO,WBR,XMP\";q.split(\",\").forEach(function(i){e=document.createElement(i);e.tagName===i&&p&&p.appendChild(e);p=e});while(p.parentNode){if(q.indexOf(p.tagName)>-1){p=p.parentNode}else{break}};return p.tagName}catch(_){return \"\"}", "A", "document", "baseURI", "charset", "body", "HTMLBodyElement", "canvas", "HTMLCanvasElement", "getContext", "CanvasRenderingContext2D", "2d", "width", "height", "CANVAS", "outerHTML", "toDataURL", "buffer", "emit", "callPhantom", "__phantomas", "_phantom", "WebPage", "fxdriver_id", "__fxdriver_unwrapped", "ubot", "CasperError", "casper", "patchRequire", "$cdc_asdjflasutopfhvcZLmcfl_", "navigator", "webdriver", "true", "__webdriver_script_fn", "_resourceLoader", "_sessionHistory", "_virtualConsole", "localStorage", "setItem", "sessionStorage", "screen", "try{var a=0;var b=new Error;Object.defineProperty(b,\"stack\",{get:function(){a++}});console.debug(b);b.stack;return a>1}catch(_){return true}", "Document", "try{return new Document().all()}catch(_){}", "HTMLAllCollection", "try{return process}catch(_){}", "try{return global}catch(_){}", "global", "native", "setTimeout", "setInterval", "https://www.zhihu.com", "stop", "cmV0dXJuIHdpbmRvdy5NZWRpYVNvdXJjZSAmJiB3aW5kb3cuTWVkaWFTb3VyY2UuaXNUeXBlU3VwcG9ydGVkICYmIHdpbmRvdy5NZWRpYVNvdXJjZS5pc1R5cGVTdXBwb3J0ZWQoJ3ZpZGVvL21wNDsgY29kZWNzPSJhdmMxLjQyRTAxRSInKQ==", "atob", "Error", "stack", "acc7471d3eb9bc30", "f25b8434cca9a1f5", "btoa", "__b", "zh", "", "a3", "charCodeAt", "CVM", "onsol", "node", "executeUserEntryPoint", "prototype", "constructor", "v_log", "zseCk", "getItem", "removeItem", "location", "history", "availHeight", "availWidth", "colorDepth", "pixelDepth", "availLeft", "Math", "random", "sbcd", "65536", "floor", "Uint32Array", "crypto", "getRandomValues"];
function M_GET(o, k) { return (o === undefined || o === null) ? undefined : o[k]; }
function M_SET(o, k, v) { if (o !== undefined && o !== null) o[k] = v; return v; }
function M_EVAL(name) { return eval(name); }
function SUBCALL(A, l, S, i, argc) {
  const entry = A[i];
  if (typeof globalThis.__sublog !== 'undefined') { try { globalThis.__sublog.push({ i: i, entry: entry, argc: argc, args: S.slice(-argc).map((x) => typeof x === 'string' ? 's:' + x.length + ':' + x.slice(0, 40) : String(x).slice(0, 30)) }); } catch (e) {} }
  if (typeof entry !== 'number') return undefined;
  const args = argc ? S.splice(-argc) : [];
  const cl = [0].concat(l);
  for (let t = 0; t < args.length; t++) cl[t] = args[t];
  const r = RUN(cl, DEC_POOL, undefined, entry);   // nested frame, result slot F[3]
  // the original VM passes immediates as decimal strings; numeric results must reach
  // the caller as strings (e.g. the 1905 probe result is used as an XOR key via charCodeAt)
  const v = r && r.A ? r.A[3] : undefined;
  return typeof v === 'number' ? String(v) : v;
}

function RUN(l, D, A, pc) {
  A = A || [undefined, undefined, undefined, undefined];
  l = l || [];
  pc = pc || 0;
  const S = []; let F = false; let _n = 0;
  while (true) {
    if (typeof TRACE === 'function') TRACE(pc, A, l, S, F, ++_n);
    switch (pc) {
    case 0: {  // instrs 0..14
      A[0] = "8204";
      S.push(A[0]);
      S.push("String");
      A[0] = M_EVAL(S.pop());
      S.push("fromCharCode");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[0] = A[3];
      A[0] = 1905;
      A[3] = SUBCALL(A, l, S, 0, 0);
      l[1] = A[3];
      A[0] = l[1];
      A[1] = 2;
      A[3] = A[0] < A[1];
      F = !!A[3];
      if (!F) { pc = 1830; continue; }
      pc = 15; continue; }
    case 15: {  // instrs 15..99
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
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
      { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); }
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
      { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[12] = A[3];
      A[0] = l[12];
      A[1] = 40;
      A[3] = A[0] < A[1];
      F = !!A[3];
      if (!F) { pc = 110; continue; }
      pc = 100; continue; }
    case 100: {  // instrs 100..109
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
      pc = 110; continue; }
    case 110: {  // instrs 110..110
      if (F) { pc = 111; continue; }
      pc = 111; continue; }
    case 111: {  // instrs 111..121
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
      if (!F) { pc = 132; continue; }
      pc = 122; continue; }
    case 122: {  // instrs 122..131
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
      pc = 132; continue; }
    case 132: {  // instrs 132..132
      if (F) { pc = 133; continue; }
      pc = 133; continue; }
    case 133: {  // instrs 133..142
      A[0] = "top";
      S.push(A[0]);
      A[0] = l[12];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 153; continue; }
      pc = 143; continue; }
    case 143: {  // instrs 143..152
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
      pc = 153; continue; }
    case 153: {  // instrs 153..153
      if (F) { pc = 154; continue; }
      pc = 154; continue; }
    case 154: {  // instrs 154..163
      A[0] = "customElements";
      S.push(A[0]);
      A[0] = l[12];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 174; continue; }
      pc = 164; continue; }
    case 164: {  // instrs 164..173
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
      pc = 174; continue; }
    case 174: {  // instrs 174..174
      if (F) { pc = 175; continue; }
      pc = 175; continue; }
    case 175: {  // instrs 175..184
      A[0] = "name";
      S.push(A[0]);
      A[0] = l[12];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 195; continue; }
      pc = 185; continue; }
    case 185: {  // instrs 185..194
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
      pc = 195; continue; }
    case 195: {  // instrs 195..195
      if (F) { pc = 196; continue; }
      pc = 196; continue; }
    case 196: {  // instrs 196..205
      A[0] = "self";
      S.push(A[0]);
      A[0] = l[12];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 216; continue; }
      pc = 206; continue; }
    case 206: {  // instrs 206..215
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
      pc = 216; continue; }
    case 216: {  // instrs 216..216
      if (F) { pc = 217; continue; }
      pc = 217; continue; }
    case 217: {  // instrs 217..226
      A[0] = "print";
      S.push(A[0]);
      A[0] = l[12];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 237; continue; }
      pc = 227; continue; }
    case 227: {  // instrs 227..236
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
      pc = 237; continue; }
    case 237: {  // instrs 237..237
      if (F) { pc = 238; continue; }
      pc = 238; continue; }
    case 238: {  // instrs 238..247
      A[0] = "open";
      S.push(A[0]);
      A[0] = l[12];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 258; continue; }
      pc = 248; continue; }
    case 248: {  // instrs 248..257
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
      pc = 258; continue; }
    case 258: {  // instrs 258..258
      if (F) { pc = 259; continue; }
      pc = 259; continue; }
    case 259: {  // instrs 259..268
      A[0] = "_encrypt";
      S.push(A[0]);
      A[0] = l[12];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 279; continue; }
      pc = 269; continue; }
    case 269: {  // instrs 269..278
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
      pc = 279; continue; }
    case 279: {  // instrs 279..279
      if (F) { pc = 280; continue; }
      pc = 280; continue; }
    case 280: {  // instrs 280..289
      A[0] = "__g";
      S.push(A[0]);
      A[0] = l[12];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 300; continue; }
      pc = 290; continue; }
    case 290: {  // instrs 290..299
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
      pc = 300; continue; }
    case 300: {  // instrs 300..300
      if (F) { pc = 301; continue; }
      pc = 301; continue; }
    case 301: {  // instrs 301..332
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 343; continue; }
      pc = 333; continue; }
    case 333: {  // instrs 333..342
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
      pc = 343; continue; }
    case 343: {  // instrs 343..343
      if (F) { pc = 344; continue; }
      pc = 344; continue; }
    case 344: {  // instrs 344..355
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
      if (!F) { pc = 366; continue; }
      pc = 356; continue; }
    case 356: {  // instrs 356..365
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
      pc = 366; continue; }
    case 366: {  // instrs 366..366
      if (F) { pc = 367; continue; }
      pc = 367; continue; }
    case 367: {  // instrs 367..376
      A[0] = l[18];
      S.push("length");
      A[0] = M_GET(A[0], S.pop());
      l[20] = A[0];
      A[0] = l[20];
      A[0] = typeof A[0];
      A[1] = "number";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 387; continue; }
      pc = 377; continue; }
    case 377: {  // instrs 377..386
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
      pc = 387; continue; }
    case 387: {  // instrs 387..387
      if (F) { pc = 388; continue; }
      pc = 388; continue; }
    case 388: {  // instrs 388..410
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
      if (!F) { pc = 421; continue; }
      pc = 411; continue; }
    case 411: {  // instrs 411..420
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
      pc = 421; continue; }
    case 421: {  // instrs 421..421
      if (F) { pc = 422; continue; }
      pc = 422; continue; }
    case 422: {  // instrs 422..426
      A[0] = l[20];
      A[1] = 4;
      A[3] = A[0] < A[1];
      F = !!A[3];
      if (!F) { pc = 435; continue; }
      pc = 427; continue; }
    case 427: {  // instrs 427..434
      A[0] = 1;
      S.push(A[0]);
      l[2] = A[0];
      A[0] = l[3];
      A[1] = l[2];
      A[3] = A[0] | A[1];
      S.push(A[3]);
      l[3] = A[3];
      pc = 435; continue; }
    case 435: {  // instrs 435..435
      if (F) { pc = 436; continue; }
      pc = 436; continue; }
    case 436: {  // instrs 436..447
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
      if (!F) { pc = 458; continue; }
      pc = 448; continue; }
    case 448: {  // instrs 448..457
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
      pc = 458; continue; }
    case 458: {  // instrs 458..458
      if (F) { pc = 459; continue; }
      pc = 459; continue; }
    case 459: {  // instrs 459..470
      A[0] = "HTMLHtmlElement";
      S.push(A[0]);
      A[0] = l[23];
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 481; continue; }
      pc = 471; continue; }
    case 471: {  // instrs 471..480
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
      pc = 481; continue; }
    case 481: {  // instrs 481..481
      if (F) { pc = 482; continue; }
      pc = 482; continue; }
    case 482: {  // instrs 482..499
      A[0] = "script";
      S.push(A[0]);
      A[0] = l[23];
      S.push("getElementsByTagName");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[24] = A[3];
      A[0] = "Collection";
      S.push(A[0]);
      A[0] = l[24];
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 510; continue; }
      pc = 500; continue; }
    case 500: {  // instrs 500..509
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
      pc = 510; continue; }
    case 510: {  // instrs 510..510
      if (F) { pc = 511; continue; }
      pc = 511; continue; }
    case 511: {  // instrs 511..529
      A[0] = l[16];
      S.push(A[0]);
      A[0] = l[16];
      S.push("createElement");
      A[0] = M_GET(A[0], S.pop());
      S.push("bind");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
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
      if (!F) { pc = 540; continue; }
      pc = 530; continue; }
    case 530: {  // instrs 530..539
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
      pc = 540; continue; }
    case 540: {  // instrs 540..540
      if (F) { pc = 541; continue; }
      pc = 541; continue; }
    case 541: {  // instrs 541..547
      A[0] = l[26];
      S.push("tagName");
      A[0] = M_GET(A[0], S.pop());
      A[1] = "SCRIPT";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 558; continue; }
      pc = 548; continue; }
    case 548: {  // instrs 548..557
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
      pc = 558; continue; }
    case 558: {  // instrs 558..558
      if (F) { pc = 559; continue; }
      pc = 559; continue; }
    case 559: {  // instrs 559..568
      A[0] = l[26];
      S.push("style");
      A[0] = M_GET(A[0], S.pop());
      l[27] = A[0];
      A[0] = l[27];
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 579; continue; }
      pc = 569; continue; }
    case 569: {  // instrs 569..578
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
      pc = 579; continue; }
    case 579: {  // instrs 579..579
      if (F) { pc = 580; continue; }
      pc = 580; continue; }
    case 580: {  // instrs 580..593
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
      if (!F) { pc = 604; continue; }
      pc = 594; continue; }
    case 594: {  // instrs 594..603
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
      pc = 604; continue; }
    case 604: {  // instrs 604..604
      if (F) { pc = 605; continue; }
      pc = 605; continue; }
    case 605: {  // instrs 605..618
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
      if (!F) { pc = 629; continue; }
      pc = 619; continue; }
    case 619: {  // instrs 619..628
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
      pc = 629; continue; }
    case 629: {  // instrs 629..629
      if (F) { pc = 630; continue; }
      pc = 630; continue; }
    case 630: {  // instrs 630..638
      S.push("document");
      A[0] = M_EVAL(S.pop());
      S.push("baseURI");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 649; continue; }
      pc = 639; continue; }
    case 639: {  // instrs 639..648
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
      pc = 649; continue; }
    case 649: {  // instrs 649..649
      if (F) { pc = 650; continue; }
      pc = 650; continue; }
    case 650: {  // instrs 650..662
      A[0] = "zhihu";
      S.push(A[0]);
      S.push("document");
      A[0] = M_EVAL(S.pop());
      S.push("baseURI");
      A[0] = M_GET(A[0], S.pop());
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 673; continue; }
      pc = 663; continue; }
    case 663: {  // instrs 663..672
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
      pc = 673; continue; }
    case 673: {  // instrs 673..673
      if (F) { pc = 674; continue; }
      pc = 674; continue; }
    case 674: {  // instrs 674..682
      S.push("document");
      A[0] = M_EVAL(S.pop());
      S.push("charset");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 693; continue; }
      pc = 683; continue; }
    case 683: {  // instrs 683..692
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
      pc = 693; continue; }
    case 693: {  // instrs 693..693
      if (F) { pc = 694; continue; }
      pc = 694; continue; }
    case 694: {  // instrs 694..702
      S.push("document");
      A[0] = M_EVAL(S.pop());
      S.push("body");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 713; continue; }
      pc = 703; continue; }
    case 703: {  // instrs 703..712
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
      pc = 713; continue; }
    case 713: {  // instrs 713..713
      if (F) { pc = 714; continue; }
      pc = 714; continue; }
    case 714: {  // instrs 714..728
      A[0] = "HTMLBodyElement";
      S.push(A[0]);
      S.push("document");
      A[0] = M_EVAL(S.pop());
      S.push("body");
      A[0] = M_GET(A[0], S.pop());
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 739; continue; }
      pc = 729; continue; }
    case 729: {  // instrs 729..738
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
      pc = 739; continue; }
    case 739: {  // instrs 739..739
      if (F) { pc = 740; continue; }
      pc = 740; continue; }
    case 740: {  // instrs 740..750
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
      if (!F) { pc = 761; continue; }
      pc = 751; continue; }
    case 751: {  // instrs 751..760
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
      pc = 761; continue; }
    case 761: {  // instrs 761..761
      if (F) { pc = 762; continue; }
      pc = 762; continue; }
    case 762: {  // instrs 762..773
      A[0] = "HTMLCanvasElement";
      S.push(A[0]);
      A[0] = l[30];
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 782; continue; }
      pc = 774; continue; }
    case 774: {  // instrs 774..781
      A[0] = 1;
      S.push(A[0]);
      l[2] = A[0];
      A[0] = l[4];
      A[1] = l[2];
      A[3] = A[0] | A[1];
      S.push(A[3]);
      l[4] = A[3];
      pc = 782; continue; }
    case 782: {  // instrs 782..782
      if (F) { pc = 783; continue; }
      pc = 783; continue; }
    case 783: {  // instrs 783..790
      A[0] = l[30];
      S.push("getContext");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 801; continue; }
      pc = 791; continue; }
    case 791: {  // instrs 791..800
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
      pc = 801; continue; }
    case 801: {  // instrs 801..801
      if (F) { pc = 802; continue; }
      pc = 802; continue; }
    case 802: {  // instrs 802..817
      A[0] = "CanvasRenderingContext2D";
      S.push(A[0]);
      A[0] = "2d";
      S.push(A[0]);
      A[0] = l[30];
      S.push("getContext");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      S.push("toString");
      { const _m = S.pop(); A[3] = A[3][_m](); }
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 828; continue; }
      pc = 818; continue; }
    case 818: {  // instrs 818..827
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
      pc = 828; continue; }
    case 828: {  // instrs 828..828
      if (F) { pc = 829; continue; }
      pc = 829; continue; }
    case 829: {  // instrs 829..836
      A[0] = l[30];
      S.push("width");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 847; continue; }
      pc = 837; continue; }
    case 837: {  // instrs 837..846
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
      pc = 847; continue; }
    case 847: {  // instrs 847..847
      if (F) { pc = 848; continue; }
      pc = 848; continue; }
    case 848: {  // instrs 848..855
      A[0] = l[30];
      S.push("height");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 866; continue; }
      pc = 856; continue; }
    case 856: {  // instrs 856..865
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
      pc = 866; continue; }
    case 866: {  // instrs 866..866
      if (F) { pc = 867; continue; }
      pc = 867; continue; }
    case 867: {  // instrs 867..873
      A[0] = l[30];
      S.push("tagName");
      A[0] = M_GET(A[0], S.pop());
      A[1] = "CANVAS";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 884; continue; }
      pc = 874; continue; }
    case 874: {  // instrs 874..883
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
      pc = 884; continue; }
    case 884: {  // instrs 884..884
      if (F) { pc = 885; continue; }
      pc = 885; continue; }
    case 885: {  // instrs 885..896
      A[0] = "canvas";
      S.push(A[0]);
      A[0] = l[30];
      S.push("outerHTML");
      A[0] = M_GET(A[0], S.pop());
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 907; continue; }
      pc = 897; continue; }
    case 897: {  // instrs 897..906
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
      pc = 907; continue; }
    case 907: {  // instrs 907..907
      if (F) { pc = 908; continue; }
      pc = 908; continue; }
    case 908: {  // instrs 908..918
      A[0] = l[30];
      S.push("toDataURL");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      l[31] = A[3];
      A[0] = l[31];
      S.push("length");
      A[0] = M_GET(A[0], S.pop());
      A[1] = 50;
      A[3] = A[0] < A[1];
      F = !!A[3];
      if (!F) { pc = 929; continue; }
      pc = 919; continue; }
    case 919: {  // instrs 919..928
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
      pc = 929; continue; }
    case 929: {  // instrs 929..929
      if (F) { pc = 930; continue; }
      pc = 930; continue; }
    case 930: {  // instrs 930..938
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("buffer");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 949; continue; }
      pc = 939; continue; }
    case 939: {  // instrs 939..948
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
      pc = 949; continue; }
    case 949: {  // instrs 949..949
      if (F) { pc = 950; continue; }
      pc = 950; continue; }
    case 950: {  // instrs 950..958
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("emit");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 969; continue; }
      pc = 959; continue; }
    case 959: {  // instrs 959..968
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
      pc = 969; continue; }
    case 969: {  // instrs 969..969
      if (F) { pc = 970; continue; }
      pc = 970; continue; }
    case 970: {  // instrs 970..978
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("callPhantom");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 989; continue; }
      pc = 979; continue; }
    case 979: {  // instrs 979..988
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
      pc = 989; continue; }
    case 989: {  // instrs 989..989
      if (F) { pc = 990; continue; }
      pc = 990; continue; }
    case 990: {  // instrs 990..998
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("__phantomas");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1009; continue; }
      pc = 999; continue; }
    case 999: {  // instrs 999..1008
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
      pc = 1009; continue; }
    case 1009: {  // instrs 1009..1009
      if (F) { pc = 1010; continue; }
      pc = 1010; continue; }
    case 1010: {  // instrs 1010..1018
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("_phantom");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1029; continue; }
      pc = 1019; continue; }
    case 1019: {  // instrs 1019..1028
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
      pc = 1029; continue; }
    case 1029: {  // instrs 1029..1029
      if (F) { pc = 1030; continue; }
      pc = 1030; continue; }
    case 1030: {  // instrs 1030..1038
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("WebPage");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1049; continue; }
      pc = 1039; continue; }
    case 1039: {  // instrs 1039..1048
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
      pc = 1049; continue; }
    case 1049: {  // instrs 1049..1049
      if (F) { pc = 1050; continue; }
      pc = 1050; continue; }
    case 1050: {  // instrs 1050..1058
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("fxdriver_id");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1069; continue; }
      pc = 1059; continue; }
    case 1059: {  // instrs 1059..1068
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
      pc = 1069; continue; }
    case 1069: {  // instrs 1069..1069
      if (F) { pc = 1070; continue; }
      pc = 1070; continue; }
    case 1070: {  // instrs 1070..1078
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("__fxdriver_unwrapped");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1089; continue; }
      pc = 1079; continue; }
    case 1079: {  // instrs 1079..1088
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
      pc = 1089; continue; }
    case 1089: {  // instrs 1089..1089
      if (F) { pc = 1090; continue; }
      pc = 1090; continue; }
    case 1090: {  // instrs 1090..1098
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("ubot");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1109; continue; }
      pc = 1099; continue; }
    case 1099: {  // instrs 1099..1108
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
      pc = 1109; continue; }
    case 1109: {  // instrs 1109..1109
      if (F) { pc = 1110; continue; }
      pc = 1110; continue; }
    case 1110: {  // instrs 1110..1118
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("CasperError");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1129; continue; }
      pc = 1119; continue; }
    case 1119: {  // instrs 1119..1128
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
      pc = 1129; continue; }
    case 1129: {  // instrs 1129..1129
      if (F) { pc = 1130; continue; }
      pc = 1130; continue; }
    case 1130: {  // instrs 1130..1138
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("casper");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1149; continue; }
      pc = 1139; continue; }
    case 1139: {  // instrs 1139..1148
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
      pc = 1149; continue; }
    case 1149: {  // instrs 1149..1149
      if (F) { pc = 1150; continue; }
      pc = 1150; continue; }
    case 1150: {  // instrs 1150..1158
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("patchRequire");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1169; continue; }
      pc = 1159; continue; }
    case 1159: {  // instrs 1159..1168
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
      pc = 1169; continue; }
    case 1169: {  // instrs 1169..1169
      if (F) { pc = 1170; continue; }
      pc = 1170; continue; }
    case 1170: {  // instrs 1170..1178
      S.push("document");
      A[0] = M_EVAL(S.pop());
      S.push("$cdc_asdjflasutopfhvcZLmcfl_");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1189; continue; }
      pc = 1179; continue; }
    case 1179: {  // instrs 1179..1188
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
      pc = 1189; continue; }
    case 1189: {  // instrs 1189..1189
      if (F) { pc = 1190; continue; }
      pc = 1190; continue; }
    case 1190: {  // instrs 1190..1197
      S.push("navigator");
      A[0] = M_EVAL(S.pop());
      S.push("webdriver");
      A[0] = M_GET(A[0], S.pop());
      A[1] = "true";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 1208; continue; }
      pc = 1198; continue; }
    case 1198: {  // instrs 1198..1207
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
      pc = 1208; continue; }
    case 1208: {  // instrs 1208..1208
      if (F) { pc = 1209; continue; }
      pc = 1209; continue; }
    case 1209: {  // instrs 1209..1217
      S.push("document");
      A[0] = M_EVAL(S.pop());
      S.push("__webdriver_script_fn");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1228; continue; }
      pc = 1218; continue; }
    case 1218: {  // instrs 1218..1227
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
      pc = 1228; continue; }
    case 1228: {  // instrs 1228..1228
      if (F) { pc = 1229; continue; }
      pc = 1229; continue; }
    case 1229: {  // instrs 1229..1236
      A[0] = l[11];
      S.push("_resourceLoader");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1247; continue; }
      pc = 1237; continue; }
    case 1237: {  // instrs 1237..1246
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
      pc = 1247; continue; }
    case 1247: {  // instrs 1247..1247
      if (F) { pc = 1248; continue; }
      pc = 1248; continue; }
    case 1248: {  // instrs 1248..1255
      A[0] = l[11];
      S.push("_sessionHistory");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1266; continue; }
      pc = 1256; continue; }
    case 1256: {  // instrs 1256..1265
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
      pc = 1266; continue; }
    case 1266: {  // instrs 1266..1266
      if (F) { pc = 1267; continue; }
      pc = 1267; continue; }
    case 1267: {  // instrs 1267..1274
      A[0] = l[11];
      S.push("_virtualConsole");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1285; continue; }
      pc = 1275; continue; }
    case 1275: {  // instrs 1275..1284
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
      pc = 1285; continue; }
    case 1285: {  // instrs 1285..1285
      if (F) { pc = 1286; continue; }
      pc = 1286; continue; }
    case 1286: {  // instrs 1286..1296
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
      if (!F) { pc = 1307; continue; }
      pc = 1297; continue; }
    case 1297: {  // instrs 1297..1306
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
      pc = 1307; continue; }
    case 1307: {  // instrs 1307..1307
      if (F) { pc = 1736; continue; }
      pc = 1308; continue; }
    case 1308: {  // instrs 1308..1318
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
      if (!F) { pc = 1329; continue; }
      pc = 1319; continue; }
    case 1319: {  // instrs 1319..1328
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
      pc = 1329; continue; }
    case 1329: {  // instrs 1329..1329
      if (F) { pc = 1330; continue; }
      pc = 1330; continue; }
    case 1330: {  // instrs 1330..1340
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
      if (!F) { pc = 1351; continue; }
      pc = 1341; continue; }
    case 1341: {  // instrs 1341..1350
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
      pc = 1351; continue; }
    case 1351: {  // instrs 1351..1351
      if (F) { pc = 1352; continue; }
      pc = 1352; continue; }
    case 1352: {  // instrs 1352..1370
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
      if (!F) { pc = 1379; continue; }
      pc = 1371; continue; }
    case 1371: {  // instrs 1371..1378
      A[0] = 1;
      S.push(A[0]);
      l[2] = A[0];
      A[0] = l[5];
      A[1] = l[2];
      A[3] = A[0] | A[1];
      S.push(A[3]);
      l[5] = A[3];
      pc = 1379; continue; }
    case 1379: {  // instrs 1379..1379
      if (F) { pc = 1380; continue; }
      pc = 1380; continue; }
    case 1380: {  // instrs 1380..1391
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
      if (!F) { pc = 1402; continue; }
      pc = 1392; continue; }
    case 1392: {  // instrs 1392..1401
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
      pc = 1402; continue; }
    case 1402: {  // instrs 1402..1402
      if (F) { pc = 1403; continue; }
      pc = 1403; continue; }
    case 1403: {  // instrs 1403..1416
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
      if (!F) { pc = 1427; continue; }
      pc = 1417; continue; }
    case 1417: {  // instrs 1417..1426
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
      pc = 1427; continue; }
    case 1427: {  // instrs 1427..1427
      if (F) { pc = 1428; continue; }
      pc = 1428; continue; }
    case 1428: {  // instrs 1428..1435
      A[0] = l[40];
      S.push("length");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "number";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1446; continue; }
      pc = 1436; continue; }
    case 1436: {  // instrs 1436..1445
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
      pc = 1446; continue; }
    case 1446: {  // instrs 1446..1446
      if (F) { pc = 1447; continue; }
      pc = 1447; continue; }
    case 1447: {  // instrs 1447..1462
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
      if (!F) { pc = 1473; continue; }
      pc = 1463; continue; }
    case 1463: {  // instrs 1463..1472
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
      pc = 1473; continue; }
    case 1473: {  // instrs 1473..1473
      if (F) { pc = 1474; continue; }
      pc = 1474; continue; }
    case 1474: {  // instrs 1474..1485
      A[0] = "HTMLAllCollection";
      S.push(A[0]);
      A[0] = l[40];
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 1496; continue; }
      pc = 1486; continue; }
    case 1486: {  // instrs 1486..1495
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
      pc = 1496; continue; }
    case 1496: {  // instrs 1496..1496
      if (F) { pc = 1497; continue; }
      pc = 1497; continue; }
    case 1497: {  // instrs 1497..1510
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
      if (!F) { pc = 1521; continue; }
      pc = 1511; continue; }
    case 1511: {  // instrs 1511..1520
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
      pc = 1521; continue; }
    case 1521: {  // instrs 1521..1521
      if (F) { pc = 1522; continue; }
      pc = 1522; continue; }
    case 1522: {  // instrs 1522..1535
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
      if (!F) { pc = 1546; continue; }
      pc = 1536; continue; }
    case 1536: {  // instrs 1536..1545
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
      pc = 1546; continue; }
    case 1546: {  // instrs 1546..1546
      if (F) { pc = 1547; continue; }
      pc = 1547; continue; }
    case 1547: {  // instrs 1547..1554
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("document");
      A[0] = M_GET(A[0], S.pop());
      A[1] = l[16];
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1565; continue; }
      pc = 1555; continue; }
    case 1555: {  // instrs 1555..1564
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
      pc = 1565; continue; }
    case 1565: {  // instrs 1565..1565
      if (F) { pc = 1566; continue; }
      pc = 1566; continue; }
    case 1566: {  // instrs 1566..1574
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("global");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1585; continue; }
      pc = 1575; continue; }
    case 1575: {  // instrs 1575..1584
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
      pc = 1585; continue; }
    case 1585: {  // instrs 1585..1585
      if (F) { pc = 1586; continue; }
      pc = 1586; continue; }
    case 1586: {  // instrs 1586..1598
      A[0] = "native";
      S.push(A[0]);
      S.push("setTimeout");
      A[0] = M_EVAL(S.pop());
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 1609; continue; }
      pc = 1599; continue; }
    case 1599: {  // instrs 1599..1608
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
      pc = 1609; continue; }
    case 1609: {  // instrs 1609..1609
      if (F) { pc = 1610; continue; }
      pc = 1610; continue; }
    case 1610: {  // instrs 1610..1622
      A[0] = "native";
      S.push(A[0]);
      S.push("setInterval");
      A[0] = M_EVAL(S.pop());
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 1633; continue; }
      pc = 1623; continue; }
    case 1623: {  // instrs 1623..1632
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
      pc = 1633; continue; }
    case 1633: {  // instrs 1633..1633
      if (F) { pc = 1634; continue; }
      pc = 1634; continue; }
    case 1634: {  // instrs 1634..1649
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
      if (!F) { pc = 1660; continue; }
      pc = 1650; continue; }
    case 1650: {  // instrs 1650..1659
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
      pc = 1660; continue; }
    case 1660: {  // instrs 1660..1660
      if (F) { pc = 1661; continue; }
      pc = 1661; continue; }
    case 1661: {  // instrs 1661..1675
      A[0] = "native";
      S.push(A[0]);
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("stop");
      A[0] = M_GET(A[0], S.pop());
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 1686; continue; }
      pc = 1676; continue; }
    case 1676: {  // instrs 1676..1685
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
      pc = 1686; continue; }
    case 1686: {  // instrs 1686..1686
      if (F) { pc = 1687; continue; }
      pc = 1687; continue; }
    case 1687: {  // instrs 1687..1706
      A[0] = "cmV0dXJuIHdpbmRvdy5NZWRpYVNvdXJjZSAmJiB3aW5kb3cuTWVkaWFTb3VyY2UuaXNUeXBlU3VwcG9ydGVkICYmIHdpbmRvdy5NZWRpYVNvdXJjZS5pc1R5cGVTdXBwb3J0ZWQoJ3ZpZGVvL21wNDsgY29kZWNzPSJhdmMxLjQyRTAxRSInKQ==";
      S.push(A[0]);
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("atob");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
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
      if (!F) { pc = 1717; continue; }
      pc = 1707; continue; }
    case 1707: {  // instrs 1707..1716
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
      pc = 1717; continue; }
    case 1717: {  // instrs 1717..1717
      if (F) { pc = 1718; continue; }
      pc = 1718; continue; }
    case 1718: {  // instrs 1718..1726
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("top");
      A[0] = M_GET(A[0], S.pop());
      S.push("window");
      A[1] = M_EVAL(S.pop());
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1735; continue; }
      pc = 1727; continue; }
    case 1727: {  // instrs 1727..1734
      A[0] = 1;
      S.push(A[0]);
      l[2] = A[0];
      A[0] = l[6];
      A[1] = l[2];
      A[3] = A[0] | A[1];
      S.push(A[3]);
      l[6] = A[3];
      pc = 1735; continue; }
    case 1735: {  // instrs 1735..1735
      if (F) { pc = 1736; continue; }
      pc = 1736; continue; }
    case 1736: {  // instrs 1736..1829
      A[0] = 16;
      S.push(A[0]);
      A[0] = l[3];
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[52] = A[3];
      A[0] = 16;
      S.push(A[0]);
      A[0] = l[4];
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[53] = A[3];
      A[0] = 16;
      S.push(A[0]);
      A[0] = l[5];
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[54] = A[3];
      A[0] = 16;
      S.push(A[0]);
      A[0] = l[6];
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
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
      { const _m = S.pop(); A[3] = A[3][_m](); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
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
      { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); }
      pc = 1830; continue; }
    case 1830: {  // instrs 1830..1830
      if (F) { pc = 1831; continue; }
      pc = 1831; continue; }
    case 1831: {  // instrs 1831..1831
      S.length = 0; F = undefined;
      pc = 1832; continue; }
    case 1832: {  // instrs 1832..1848
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
      pc = 1849; continue; }
    case 1849: {  // instrs 1849..1853
      A[0] = l[66];
      A[1] = l[63];
      A[3] = A[0] < A[1];
      F = !!A[3];
      if (!F) { pc = 1896; continue; }
      pc = 1854; continue; }
    case 1854: {  // instrs 1854..1895
      A[0] = l[66];
      S.push(A[0]);
      A[0] = l[0];
      S.push("charCodeAt");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[67] = A[3];
      A[0] = l[66];
      A[1] = l[64];
      A[3] = A[0] % A[1];
      l[68] = A[3];
      A[0] = l[68];
      S.push(A[0]);
      A[0] = l[1];
      S.push("charCodeAt");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
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
      pc = 1849; continue; }
    case 1896: {  // instrs 1896..1904
      A[0] = l[65];
      S.push(A[0]);
      S.push(A[0]);
      S.push("__b");
      A[0] = M_EVAL(S.pop());
      S.push("a3");
      { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); }
      A[3] = l[62];
      return { A: A, l: l };
      }
    case 1905: {  // instrs 1905..1944
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
      { const k = S.pop(), v = S.pop(); M_SET(A[0], k, v); }
      A[0] = "get";
      S.push(A[0]);
      A[0] = l[10];
      A[0] = M_GET(A[0], S.pop());
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      S.push("length");
      A[3] = M_GET(A[3], S.pop());
      l[72] = A[3];
      S.push("CVM");
      A[0] = M_EVAL(S.pop());
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      l[73] = A[3];
      A[0] = l[72];
      A[1] = 60;
      A[3] = A[0] > A[1];
      F = !!A[3];
      if (!F) { pc = 1947; continue; }
      pc = 1945; continue; }
    case 1945: {  // instrs 1945..1946
      A[3] = 2;
      return { A: A, l: l };
      }
    case 1947: {  // instrs 1947..1947
      if (F) { pc = 1948; continue; }
      pc = 1948; continue; }
    case 1948: {  // instrs 1948..1956
      S.push("__b");
      A[0] = M_EVAL(S.pop());
      S.push("zh");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 1959; continue; }
      pc = 1957; continue; }
    case 1957: {  // instrs 1957..1958
      A[3] = 2;
      return { A: A, l: l };
      }
    case 1959: {  // instrs 1959..1959
      if (F) { pc = 1960; continue; }
      pc = 1960; continue; }
    case 1960: {  // instrs 1960..1969
      A[0] = "onsol";
      S.push(A[0]);
      A[0] = l[73];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] !== A[0];
      F = !!A[3];
      if (!F) { pc = 1972; continue; }
      pc = 1970; continue; }
    case 1970: {  // instrs 1970..1971
      A[3] = 2;
      return { A: A, l: l };
      }
    case 1972: {  // instrs 1972..1972
      if (F) { pc = 1973; continue; }
      pc = 1973; continue; }
    case 1973: {  // instrs 1973..1988
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] !== A[0];
      F = !!A[3];
      if (!F) { pc = 1991; continue; }
      pc = 1989; continue; }
    case 1989: {  // instrs 1989..1990
      A[3] = 2;
      return { A: A, l: l };
      }
    case 1991: {  // instrs 1991..1991
      if (F) { pc = 1992; continue; }
      pc = 1992; continue; }
    case 1992: {  // instrs 1992..2001
      A[0] = "executeUserEntryPoint";
      S.push(A[0]);
      A[0] = l[60];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] !== A[0];
      F = !!A[3];
      if (!F) { pc = 2004; continue; }
      pc = 2002; continue; }
    case 2002: {  // instrs 2002..2003
      A[3] = 2;
      return { A: A, l: l };
      }
    case 2004: {  // instrs 2004..2004
      if (F) { pc = 2005; continue; }
      pc = 2005; continue; }
    case 2005: {  // instrs 2005..2021
      A[0] = "native";
      S.push(A[0]);
      S.push("Function");
      A[0] = M_EVAL(S.pop());
      S.push("prototype");
      A[0] = M_GET(A[0], S.pop());
      S.push("constructor");
      A[0] = M_GET(A[0], S.pop());
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[3][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 2024; continue; }
      pc = 2022; continue; }
    case 2022: {  // instrs 2022..2023
      A[3] = 2;
      return { A: A, l: l };
      }
    case 2024: {  // instrs 2024..2024
      if (F) { pc = 2025; continue; }
      pc = 2025; continue; }
    case 2025: {  // instrs 2025..2033
      S.push("window");
      A[0] = M_EVAL(S.pop());
      S.push("v_log");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 2036; continue; }
      pc = 2034; continue; }
    case 2034: {  // instrs 2034..2035
      A[3] = 2;
      return { A: A, l: l };
      }
    case 2036: {  // instrs 2036..2036
      if (F) { pc = 2037; continue; }
      pc = 2037; continue; }
    case 2037: {  // instrs 2037..2038
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2039: {  // instrs 2039..2054
      A[0] = "zseCk";
      S.push(A[0]);
      A[0] = "zseCk";
      S.push(A[0]);
      A[0] = l[0];
      S.push("setItem");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-2)); }
      A[0] = l[0];
      S.push("length");
      A[0] = M_GET(A[0], S.pop());
      l[75] = A[0];
      A[0] = l[0];
      A[1] = 1;
      A[3] = A[0] < A[1];
      F = !!A[3];
      if (!F) { pc = 2057; continue; }
      pc = 2055; continue; }
    case 2055: {  // instrs 2055..2056
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2057: {  // instrs 2057..2057
      if (F) { pc = 2058; continue; }
      pc = 2058; continue; }
    case 2058: {  // instrs 2058..2068
      A[0] = "zseCk";
      S.push(A[0]);
      A[0] = l[0];
      S.push("getItem");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[76] = A[3];
      A[0] = l[76];
      A[1] = "zseCk";
      A[3] = A[0] !== A[1];
      F = !!A[3];
      if (!F) { pc = 2071; continue; }
      pc = 2069; continue; }
    case 2069: {  // instrs 2069..2070
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2071: {  // instrs 2071..2071
      if (F) { pc = 2072; continue; }
      pc = 2072; continue; }
    case 2072: {  // instrs 2072..2078
      A[0] = "zseCk";
      S.push(A[0]);
      A[0] = l[0];
      S.push("removeItem");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[3] = 2;
      return { A: A, l: l };
      }
    case 2079: {  // instrs 2079..2088
      A[0] = "document";
      S.push(A[0]);
      A[0] = l[0];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 2091; continue; }
      pc = 2089; continue; }
    case 2089: {  // instrs 2089..2090
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2091: {  // instrs 2091..2091
      if (F) { pc = 2092; continue; }
      pc = 2092; continue; }
    case 2092: {  // instrs 2092..2101
      A[0] = "location";
      S.push(A[0]);
      A[0] = l[0];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 2104; continue; }
      pc = 2102; continue; }
    case 2102: {  // instrs 2102..2103
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2104: {  // instrs 2104..2104
      if (F) { pc = 2105; continue; }
      pc = 2105; continue; }
    case 2105: {  // instrs 2105..2114
      A[0] = "screen";
      S.push(A[0]);
      A[0] = l[0];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 2117; continue; }
      pc = 2115; continue; }
    case 2115: {  // instrs 2115..2116
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2117: {  // instrs 2117..2117
      if (F) { pc = 2118; continue; }
      pc = 2118; continue; }
    case 2118: {  // instrs 2118..2127
      A[0] = "history";
      S.push(A[0]);
      A[0] = l[0];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 2130; continue; }
      pc = 2128; continue; }
    case 2128: {  // instrs 2128..2129
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2130: {  // instrs 2130..2130
      if (F) { pc = 2131; continue; }
      pc = 2131; continue; }
    case 2131: {  // instrs 2131..2140
      A[0] = "navigator";
      S.push(A[0]);
      A[0] = l[0];
      S.push("indexOf");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 1;
      A[0] = -A[0];
      A[3] = A[3] === A[0];
      F = !!A[3];
      if (!F) { pc = 2143; continue; }
      pc = 2141; continue; }
    case 2141: {  // instrs 2141..2142
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2143: {  // instrs 2143..2143
      if (F) { pc = 2144; continue; }
      pc = 2144; continue; }
    case 2144: {  // instrs 2144..2145
      A[3] = 2;
      return { A: A, l: l };
      }
    case 2146: {  // instrs 2146..2153
      A[0] = l[0];
      S.push("width");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 2156; continue; }
      pc = 2154; continue; }
    case 2154: {  // instrs 2154..2155
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2156: {  // instrs 2156..2156
      if (F) { pc = 2157; continue; }
      pc = 2157; continue; }
    case 2157: {  // instrs 2157..2164
      A[0] = l[0];
      S.push("height");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 2167; continue; }
      pc = 2165; continue; }
    case 2165: {  // instrs 2165..2166
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2167: {  // instrs 2167..2167
      if (F) { pc = 2168; continue; }
      pc = 2168; continue; }
    case 2168: {  // instrs 2168..2175
      A[0] = l[0];
      S.push("availHeight");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 2178; continue; }
      pc = 2176; continue; }
    case 2176: {  // instrs 2176..2177
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2178: {  // instrs 2178..2178
      if (F) { pc = 2179; continue; }
      pc = 2179; continue; }
    case 2179: {  // instrs 2179..2186
      A[0] = l[0];
      S.push("availWidth");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 2189; continue; }
      pc = 2187; continue; }
    case 2187: {  // instrs 2187..2188
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2189: {  // instrs 2189..2189
      if (F) { pc = 2190; continue; }
      pc = 2190; continue; }
    case 2190: {  // instrs 2190..2197
      A[0] = l[0];
      S.push("colorDepth");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 2200; continue; }
      pc = 2198; continue; }
    case 2198: {  // instrs 2198..2199
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2200: {  // instrs 2200..2200
      if (F) { pc = 2201; continue; }
      pc = 2201; continue; }
    case 2201: {  // instrs 2201..2209
      S.push("screen");
      A[0] = M_EVAL(S.pop());
      S.push("pixelDepth");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 2212; continue; }
      pc = 2210; continue; }
    case 2210: {  // instrs 2210..2211
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2212: {  // instrs 2212..2212
      if (F) { pc = 2213; continue; }
      pc = 2213; continue; }
    case 2213: {  // instrs 2213..2221
      S.push("screen");
      A[0] = M_EVAL(S.pop());
      S.push("availLeft");
      A[0] = M_GET(A[0], S.pop());
      A[0] = typeof A[0];
      A[1] = "undefined";
      A[3] = A[0] === A[1];
      F = !!A[3];
      if (!F) { pc = 2224; continue; }
      pc = 2222; continue; }
    case 2222: {  // instrs 2222..2223
      A[3] = 1;
      return { A: A, l: l };
      }
    case 2224: {  // instrs 2224..2224
      if (F) { pc = 2225; continue; }
      pc = 2225; continue; }
    case 2225: {  // instrs 2225..2226
      A[3] = 2;
      return { A: A, l: l };
      }
    case 2227: {  // instrs 2227..2256
      S.push("Math");
      A[0] = M_EVAL(S.pop());
      S.push("random");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      l[77] = A[3];
      S.push("Math");
      A[0] = M_EVAL(S.pop());
      S.push("random");
      { const _m = S.pop(); A[3] = A[0][_m](); }
      l[78] = A[3];
      S.push("Math");
      A[0] = M_EVAL(S.pop());
      S.push("random");
      { const _m = S.pop(); A[3] = A[0][_m](); }
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
      if (!F) { pc = 2262; continue; }
      pc = 2257; continue; }
    case 2257: {  // instrs 2257..2261
      A[0] = "sbcd";
      S.push(A[0]);
      l[82] = A[0];
      A[3] = l[82];
      return { A: A, l: l };
      }
    case 2262: {  // instrs 2262..2262
      if (F) { pc = 2263; continue; }
      pc = 2263; continue; }
    case 2263: {  // instrs 2263..2288
      S.push("Math");
      A[0] = M_EVAL(S.pop());
      S.push("random");
      { const _m = S.pop(); A[3] = A[0][_m](); }
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[85] = A[3];
      A[0] = 16;
      S.push(A[0]);
      A[0] = l[85];
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[82] = A[3];
      A[3] = l[82];
      return { A: A, l: l };
      }
    case 2289: {  // instrs 2289..2311
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
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      A[0] = 16;
      S.push(A[0]);
      A[0] = 0;
      S.push(A[0]);
      A[0] = l[86];
      A[0] = M_GET(A[0], S.pop());
      S.push("toString");
      { const _m = S.pop(); A[3] = A[0][_m](...S.splice(-1)); }
      l[87] = A[3];
      A[3] = l[87];
      return { A: A, l: l };
      }
    default: throw new Error('bad pc ' + pc);
  } }
}
if (typeof module !== 'undefined') { module.exports = { RUN: RUN, M_GET: M_GET, M_SET: M_SET, M_EVAL: M_EVAL, DEC: DEC_POOL }; }
