// 在 handenv 里求值全部守卫属性（按 ENV_DETECTION.md 的三张表 + 常见基对象），列出 typeof === "undefined" 的
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const sandbox = createEnv(); sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'g' });
for (const k of ['Object','Array','String','Math','JSON','Function','Proxy','Reflect','Symbol','Date','RegExp',
                 'Number','Boolean','parseInt','Error','Map','Set','Uint8Array','ArrayBuffer','DataView']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch (e) {} }
}

// 三张表里的属性名（按层分组）
const PAYLOAD = ['all','length','createElement','tagName','style','baseURI','charset','body','getContext','width','height',
  'outerHTML','buffer','emit','callPhantom','__phantomas','_phantom','WebPage','fxdriver_id','__fxdriver_unwrapped',
  'ubot','CasperError','casper','patchRequire','$cdc_asdjflasutopfhvcZLmcfl_','webdriver','__webdriver_script_fn',
  '_resourceLoader','_sessionHistory','_virtualConsole','setItem','document','global','URL','stop','zh','prototype',
  'v_log','availHeight','availWidth','colorDepth','pixelDepth','availLeft'];
const INNER = ['host','hostname','devicePixelRatio','blur','self','find','globalThis','name','LOADING','DONE','OPENED',
  'UNSENT','abort','open','send','upload','responseURL','onreadystatechange','status','onabort','responseXML','timeout'];
const CVM = ['root','filter','detach','whatToShow','createRange','cloneRange','cloneContents','collapse','collapsed',
  'commonAncestorContainer','compareBoundaryPoints','comparePoint','endOffset','extractContents','getBoundingClientRect',
  'getClientRects','insertNode','intersectsNode','isPointInRange','selectNode','selectNodeContents','setEnd','setEndAfter',
  'setEndBefore','setStart','setStartAfter','setStartBefore','startContainer'];

const js = `(function(){
  var out = [];
  function chk(tag, obj, props){
    for (var i=0;i<props.length;i++){
      var p = props[i], t;
      try { t = typeof obj[p]; } catch(e){ t='THROW'; }
      if (t === 'undefined') out.push(tag + '.' + p);
    }
  }
  var doc = document;
  chk('window', window, ${JSON.stringify(PAYLOAD)});
  chk('document', doc, ${JSON.stringify(PAYLOAD)});
  chk('locationProxy', new Proxy(location, {get:function(a,b){return b in a ? a[b] : undefined;}}), ${JSON.stringify(INNER)});
  chk('window2', window, ${JSON.stringify(INNER)});
  var xhr; try { xhr = new XMLHttpRequest(); } catch(e){ xhr = {}; }
  chk('xhr', xhr, ${JSON.stringify(INNER)});
  var it; try { it = doc.createNodeIterator(doc.body); } catch(e){ it = {}; }
  chk('nodeIterator', it, ${JSON.stringify(CVM)});
  var rg; try { rg = doc.createRange(); } catch(e){ rg = {}; }
  chk('range', rg, ${JSON.stringify(CVM)});
  chk('body', doc.body || {}, ${JSON.stringify(CVM)});
  return JSON.stringify(out);
})()`;
const missing = JSON.parse(vm.runInContext(js, ctx));
console.log('缺失属性 %d 个（真实浏览器应为 0）:' % missing.length);
missing.forEach(m => console.log('   ', m));
if (!missing.length) console.log('   （无）');
