// payload runner v4 generator: stub DOM with writable all-array.
import fs from 'node:fs';
let s = fs.readFileSync('.probe/_scratch/payloadrun.mjs', 'utf8');
const anchor = "ctx.__b = {}; ctx.__c = {}; ctx.__g = {};";
const add = `
const stubGets = [];
const mkEl = (tag) => ({ tagName: tag, toString() { return '[object HTML' + tag.charAt(0) + tag.slice(1).toLowerCase() + 'Element]'; }, style: {}, appendChild() {}, removeChild() {}, parentNode: null, offsetWidth: 10, offsetHeight: 20, innerHTML: '' });
const htmlEl = mkEl('HTML'); htmlEl.toString = () => '[object HTMLHtmlElement]';
const bodyEl = mkEl('BODY'); bodyEl.toString = () => '[object HTMLBodyElement]';
const stubDoc = new Proxy(function(){}, {
  get(t, p) {
    stubGets.push('document.' + String(p));
    if (p === 'URL' || p === 'documentURI' || p === 'baseURI') return 'https://www.zhihu.com/people/zhihuadmin/activities';
    if (p === 'domain') return 'www.zhihu.com';
    if (p === 'documentElement') return htmlEl;
    if (p === 'body') return bodyEl;
    if (p === 'all') { const arr = []; arr.getElementsByTagName = (t2) => [t2 === 'script' ? mkEl('SCRIPT') : mkEl(String(t2).toUpperCase())]; arr.toString = () => '[object HTMLAllCollection]'; return arr; }
    if (p === 'getElementsByTagName') return (t2) => [t2 === 'html' ? htmlEl : mkEl(String(t2).toUpperCase())];
    if (p === 'createElement') return (t2) => mkEl(String(t2).toUpperCase());
    if (p === 'createNodeIterator' || p === 'createRange') return () => ({ toString: () => '[object Object]', cloneRange() { return this; }, cloneContents() { return this; }, collapse() {}, selectNode() {}, selectNodeContents() {}, setEnd() {}, setEndAfter() {}, setEndBefore() {}, setStart() {}, setStartAfter() {}, setStartBefore() {}, extractContents() { return this; }, getBoundingClientRect() { return {}; }, getClientRects() { return []; }, insertNode() {}, intersectsNode() { return false; }, isPointInRange() { return false; }, compareBoundaryPoints() { return 0; }, comparePoint() {}, commonAncestorContainer: bodyEl, endOffset: 0, startContainer: bodyEl, startOffset: 0, collapsed: false, detach() {}, whatToShow: 0, filter: undefined, root: bodyEl });
    return undefined;
  },
  set(t, p, v) { return true; },
});
const stubWin = new Proxy(function(){}, { get(t, p) { stubGets.push('window.' + String(p)); if (p === 'v_log') return undefined; return undefined; }, set(t, p, v) { return true; } });
for (const gname of ['window', 'document', 'self', 'top']) {
  try { Object.defineProperty(ctx, gname, { configurable: true, get() { return gname === 'document' ? stubDoc : stubWin; }, set(v) {} }); } catch (e) {}
}
process.on('exit', () => { try { fs.writeFileSync('.probe/stub-gets.json', JSON.stringify([...new Set(stubGets)])); } catch (e) {} });
`;
s = s.replace(anchor, anchor + '\n' + add);
fs.writeFileSync('.probe/_scratch/payloadrun3.mjs', s);
console.log('written payloadrun3.mjs v4');
