const addon = require('./build/Release/zseenv.node');
function E(tag){ const o={ tagName:tag, toString(){ return '[object HTML'+tag+'Element]'; } };
  try{ Object.defineProperty(o, Symbol.toStringTag, {value:'HTML'+tag+'Element'}); }catch(e){}
  return o; }
const proto = { item(i){ return this[i]!==undefined?this[i]:null; }, namedItem(){ return null; },
                toString(){ return '[object HTMLAllCollection]'; } };
try{ Object.defineProperty(proto, Symbol.toStringTag, {value:'HTMLAllCollection'}); }catch(e){}
const list=[E('HTML'),E('HEAD'),E('BODY'),E('DIV'),E('SCRIPT'),E('STYLE')];
const all = addon.makeUndetectable(list, 'HTMLAllCollection', proto);
console.log('typeof        =', typeof all, ' (期望 undefined)');
console.log('!!all         =', !!all, ' (期望 false)');
console.log('length        =', all.length, ' (期望 6)');
console.log('[0].tagName   =', all[0] && all[0].tagName, ' (期望 HTML)');
console.log('[0].toString  =', all[0] && String(all[0]));
console.log('String(all)   =', String(all), ' (期望 [object HTMLAllCollection])');
console.log('item(0).tagName=', all.item && all.item(0) && all.item(0).tagName, ' (期望 HTML)');
let called=null; try{ called = all(); }catch(e){ called='THREW '+e.message; }
console.log('all()         =', typeof called);
console.log('Object.keys   =', Object.keys(all).slice(0,8).join(','));