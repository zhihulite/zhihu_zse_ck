// payload runner v2: intercept the sandbox clobber (window={};document={}) with a
// recording proxy so we can see what the third program reads from the stubs.
import fs from 'node:fs';
let s = fs.readFileSync('.probe/_scratch/payloadrun.mjs', 'utf8');
const anchor = "ctx.__b = {}; ctx.__c = {}; ctx.__g = {};";
const add = `
const stubGets = [];
function stubProxy(name) {
  const store = { URL: 'https://www.zhihu.com/people/zhihuadmin/activities', href: 'https://www.zhihu.com/people/zhihuadmin/activities', domain: 'www.zhihu.com', baseURI: 'https://www.zhihu.com/people/zhihuadmin/activities' };
  return new Proxy(function(){}, { get(t, p) { stubGets.push(name + '.' + String(p)); if (p in store) return store[p]; return undefined; }, set(t, p, v) { store[p] = v; return true; } });
}
for (const gname of ['window', 'document']) {
  try { Object.defineProperty(ctx, gname, { configurable: true, get() { return ctx['_real_' + gname] || ctx['_stub_' + gname]; }, set(v) { ctx['_stub_' + gname] = stubProxy(gname); } }); } catch (e) {}
}
process.on('exit', () => { try { fs.writeFileSync('.probe/stub-gets.json', JSON.stringify([...new Set(stubGets)])); } catch (e) {} });
`;
s = s.replace(anchor, anchor + '\n' + add);
fs.writeFileSync('.probe/_scratch/payloadrun2.mjs', s);
console.log('written payloadrun2.mjs');
