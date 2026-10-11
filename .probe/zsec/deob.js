const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync('blobs/jsvmp_27264.js', 'utf8');
const cut = src.indexOf('function r()');
if (cut < 0) { console.error('no r() found'); process.exit(1); }
const prelude = src.slice(0, cut);
console.log('prelude len', prelude.length, 'total', src.length);

const sandbox = {
  window: { navigator: { hardwareConcurrency: 8, userAgent: 'UA', plugins: [], mimeTypes: [] },
            location: { href: 'https://www.zhihu.com/' }, screen: {}, performance: {} },
  document: { createElement: () => ({ getContext: () => null, style: {}, toDataURL: () => '' }),
              documentElement: { style: {} }, getElementsByTagName: () => [] },
  navigator: { hardwareConcurrency: 8, userAgent: 'UA', plugins: [] },
  self: {}, globalThis: {}, console: console,
};
sandbox.window.window = sandbox.window;
sandbox.globalThis = sandbox;

let dec = null;
try {
  vm.createContext(sandbox);
  vm.runInContext(prelude + '\n;this.__DEC = (typeof _0x4848 !== "undefined") ? _0x4848 : null;', sandbox, { timeout: 20000 });
  dec = sandbox.__DEC;
} catch (e) {
  console.error('prelude run error:', e.message);
}
console.log('decoder found:', typeof dec);

const map = {};
if (typeof dec === 'function') {
  for (let i = 0x100; i <= 0x300; i++) {
    try { map[i] = dec(i); } catch (e) { }
  }
  const got = Object.keys(map).length;
  console.log('decoded entries:', got);
  const sample = Object.entries(map).slice(0, 20);
  console.log('sample:', JSON.stringify(sample));
  fs.writeFileSync('dec_map.json', JSON.stringify(map, null, 0));
} else {
  console.error('cannot decode; dumping prelude head');
  console.log(prelude.slice(0, 500));
}
