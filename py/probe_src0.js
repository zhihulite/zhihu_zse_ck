// 在我的 handenv 里逐条求值 CVM 的关键守卫（离线、秒级），确认哪条会置位。
const vm = require('vm');
const path = require('path');
const { createEnv } = require(path.join(__dirname, '..', '.probe', 'zsec', 'handenv.js'));

const g = createEnv();
const ctx = vm.createContext(g);

const SRC0 = 'try{window={};document={};var c=0;"A,ABBR,ACRONYM,ADDRESS,APPLET,AREA,ARTICLE,ASIDE,AUDIO,B,BASE,BASEFONT,BDI,BDO,BGSOUND,BIG,BLINK,BLOCKQUOTE,BODY,BR,BUTTON,CANVAS,CAPTION,CENTER,CITE,CODE,COL,COLGROUP,CONTENT,DATA,DATALIST,DD,DECORATOR,DEL,DETAILS,DFN,DIALOG,DIR,DIV,DL,DT,ELEMENT,EM,EMBED,FIELDSET,FIGCAPTION,FIGURE,FONT,FOOTER,FORM,FRAME,FRAMESET,H1,H2,H3,H4,H5,H6,HEAD,HEADER,HGROUP,HR,HTML,I,IFRAME,IMAGE,IMG,INPUT,INS,ISINDEX,KBD,KEYGEN,LABEL,LEGEND,LI,LINK,LISTING,MAIN,MAP,MARK,MARQUEE,MENU,MENUITEM,META,METER,NAV,NOBR,NOEMBED,NOFRAMES,NOSCRIPT,OBJECT,OL,OPTGROUP,OPTION,OUTPUT,P,PARAM,PLAINTEXT,PRE,PROGRESS,Q,RP,RT,RTC,RUBY,S,SAMP,SCRIPT,SECTION,SELECT,SHADOW,SLOT,SMALL,SOURCE,SPACER,SPAN,STRIKE,STRONG,STYLE,SUB,SUMMARY,SUP,TABLE,TBODY,TD,TEMPLATE,TEXTAREA,TFOOT,TH,THEAD,TIME,TITLE,TR,TRACK,TT,U,UL,VAR,VIDEO,WBR,XMP".split(",").forEach(function(i){document.createElement(i).tagName!==i&&(c=1)});return c}catch(_){return 2}';

const probes = {
  'SRC0() 结果（>1 则 CVM l[7] |= 1<<14）': `(function(){try{return new Function(${JSON.stringify(SRC0)})()}catch(e){return 'THROW:'+e.message}})()`,
  'document 可写吗（= {} 是否生效）': `(function(){var before=(typeof document.createElement==='function');var save=document;try{document={}}catch(e){}var after=(typeof document.createElement==='function');try{document=save}catch(e){}return {before:before, after:after}})()`,
  'createNodeIterator(body) 的 typeof 各字段': `(function(){try{var r=document.createNodeIterator(document.body);return {root:typeof r.root, filter:typeof r.filter, whatToShow:typeof r.whatToShow, detach:typeof r.detach, length:typeof r.length, body:typeof r.body};}catch(e){return 'THROW:'+e.message}})()`,
  'typeof document.all': `typeof document.all`,
  'typeof document.all.length': `(function(){try{return typeof document.all.length}catch(e){return 'THROW:'+e.message}})()`,
  'new Function(...document.all()...) 的 typeof': `(function(){return typeof new Function("try{window={};document={};return document.all()}catch(_){}")()})()`,
};

for (const k of Object.keys(probes)) {
  let v;
  try { v = vm.runInContext(probes[k], ctx); } catch (e) { v = 'CTXERR:' + e.message; }
  console.log('  ' + k + '  =>  ' + JSON.stringify(v));
}
