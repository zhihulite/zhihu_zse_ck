// 按实际守卫的基对象逐条求值（基对象取自 payload/inner/cvm 的还原代码）
const vm = require('vm');
const { createEnv } = require('./handenv.js');

const sandbox = createEnv(); sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'g2' });
for (const k of ['Object','Array','String','Math','JSON','Function','Proxy','Reflect','Symbol','Date','RegExp',
                 'Number','Boolean','parseInt','Error','Map','Set','Uint8Array','ArrayBuffer','DataView']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch (e) {} }
}

const CASES = [
  ['locationProxy(host/hostname)', 'new Proxy(location,{get:function(a,b){return b in a ? a[b] : undefined;}})', ['host','hostname','href','origin','protocol','port','pathname','search','hash','ancestorOrigins','assign','replace','reload','toString']],
  ['window', 'window', ['devicePixelRatio','blur','self','find','globalThis','name','XMLDocument','URL','URLSearchParams','stop','print','open','close','focus','alert','confirm','prompt','scrollTo','scrollBy','moveTo','resizeTo','postMessage','getComputedStyle','matchMedia','requestAnimationFrame','cancelAnimationFrame','atob','btoa','fetch','top','parent','frames','length','history','screen','navigator','location','localStorage','sessionStorage','document','performance','crypto','indexedDB','Worker','Blob','TextEncoder','TextDecoder','CustomEvent','Event','MutationObserver','IntersectionObserver','ResizeObserver','WebSocket','XMLHttpRequest','Proxy','Reflect','Symbol','Promise','Map','Set','WeakMap','WeakSet','BigInt','URL','FileReader','FormData','Headers','Request','Response','AbortController','MessageChannel','queueMicrotask','structuredClone','reportError']],
  ['history', 'history', ['pushState','replaceState','back','forward','go','length','state','scrollRestoration']],
  ['xhr', 'new XMLHttpRequest()', ['LOADING','DONE','OPENED','UNSENT','HEADERS_RECEIVED','abort','open','send','setRequestHeader','getResponseHeader','getAllResponseHeaders','overrideMimeType','addEventListener','removeEventListener','dispatchEvent','upload','responseURL','onreadystatechange','status','statusText','onabort','onerror','onload','ontimeout','responseXML','response','responseText','timeout','withCredentials']],
  ['document', 'document', ['all','createElement','createElementNS','createTextNode','createDocumentFragment','createEvent','getElementById','getElementsByTagName','getElementsByClassName','getElementsByName','querySelector','querySelectorAll','addEventListener','removeEventListener','dispatchEvent','write','writeln','open','close','getSelection','elementFromPoint','createTreeWalker','createNodeIterator','createExpression','createRange','documentElement','head','body','charset','characterSet','contentType','baseURI','URL','documentURI','referrer','domain','cookie','readyState','title','compatMode','visibilityState','hidden','hasFocus','defaultView','location']],
  ['canvas300', 'document.createElement("canvas")', ['getContext','width','height','outerHTML','toDataURL','toBlob','style','getBoundingClientRect','tagName','nodeName']],
  ['range', 'document.createRange()', ['startContainer','endContainer','startOffset','endOffset','collapsed','commonAncestorContainer','setStart','setEnd','setStartBefore','setStartAfter','setEndBefore','setEndAfter','selectNode','selectNodeContents','collapse','cloneContents','cloneRange','deleteContents','detach','extractContents','insertNode','surroundContents','compareBoundaryPoints','comparePoint','getBoundingClientRect','getClientRects','intersectsNode','isPointInRange','toString']],
  ['nodeIterator', 'document.createNodeIterator(document.body)', ['root','filter','whatToShow','detach','nextNode','previousNode','referenceNode','pointerBeforeReferenceNode']],
  ['localStorage', 'localStorage', ['setItem','getItem','removeItem','clear','key','length']],
  ['screen', 'screen', ['availHeight','availWidth','colorDepth','pixelDepth','availLeft','availTop','width','height','orientation']],
  ['navigator', 'navigator', ['hardwareConcurrency','userAgent','platform','language','languages','plugins','mimeTypes','webdriver','cookieEnabled','onLine','deviceMemory','maxTouchPoints','vendor','appVersion','appName','appCodeName','product','productSub','vendorSub','oscpu','buildID','doNotTrack','geolocation','permissions','mediaDevices','serviceWorker','storage','clipboard','credentials','sendBeacon','vibrate','javaEnabled','getBattery']],
  ['documentElement', 'document.documentElement', ['tagName','nodeName','outerHTML','innerHTML','style','getBoundingClientRect','clientWidth','clientHeight','scrollWidth','scrollHeight','attributes','children','classList','dataset']],
  ['body', 'document.body', ['tagName','nodeName','outerHTML','innerHTML','style','appendChild','removeChild','getBoundingClientRect','clientWidth','clientHeight','scrollTop','children','classList']],
];

const js = `(function(){
  var out = [];
  ${CASES.map(([tag, expr, props]) => `
  try {
    var o_${CASES.indexOf([tag, expr, props])} = ${expr};
  } catch(e) {}
  `).join('')}
  var CASES = ${JSON.stringify(CASES.map(c => [c[0], c[1], c[2]]))};
  for (var i=0;i<CASES.length;i++){
    var tag = CASES[i][0], obj;
    try { obj = eval(CASES[i][1]); } catch(e){ out.push(tag + ' <BASE_THROW ' + e.message + '>'); continue; }
    var props = CASES[i][2];
    for (var j=0;j<props.length;j++){
      var t; try { t = typeof obj[props[j]]; } catch(e){ t='THROW'; }
      if (t === 'undefined') out.push(tag + '.' + props[j]);
    }
  }
  return JSON.stringify(out);
})()`;
const missing = JSON.parse(vm.runInContext(js, ctx));
console.log('缺失属性 %d 个（真实浏览器应为 0）:' % missing.length);
missing.forEach(m => console.log('   ', m));
