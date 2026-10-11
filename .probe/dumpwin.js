async () => {
  const cfg = JSON.parse(localStorage.getItem('__zcfg2') || '{}');
  const K = '__zwin2';
  let mem = null;
  const b64u = (u8) => { let s = ''; const CH = 0x8000; for (let i = 0; i < u8.length; i += CH) s += String.fromCharCode.apply(null, u8.subarray(i, i + CH)); return btoa(s); };

  const P = WebAssembly;
  const oI = P.instantiate.bind(P);
  const grab = (r) => { const inst = (r && r.instance) || r; mem = inst && inst.exports && inst.exports.memory; window.__mem = mem; return r; };
  window.WebAssembly = new Proxy(P, { get: (t, p) => (p === 'instantiate' ? (b, i) => Promise.resolve(oI(b, i)).then(grab) : t[p]), set: (t, p, v) => { t[p] = v; return true; }, has: () => true });

  const put = (o) => { for (const k in o) localStorage.setItem(K + '_' + k, typeof o[k] === 'string' ? o[k] : JSON.stringify(o[k])); };

  const od = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
  let done = false;
  Object.defineProperty(Document.prototype, 'cookie', {
    configurable: true, get: od.get,
    set: function (v) {
      const s = String(v);
      if (done || !(s.indexOf('__zse_ck=') === 0 && s.length > 200)) return od.set.apply(this, arguments);
      done = true;
      const tok = s.slice(9, s.indexOf(';') > 0 ? s.indexOf(';') : s.length);
      if (mem) {
        const u = new Uint8Array(mem.buffer);
        const needle = new TextEncoder().encode(tok.slice(4, 36));
        let off = -1;
        for (let i = 0; i + needle.length < u.length; i++) {
          if (u[i] !== needle[0]) continue;
          let k = 1; while (k < needle.length && u[i + k] === needle[k]) k++;
          if (k === needle.length) { off = i; break; }
        }
        const A = Math.max(0, (off < 0 ? 2300000 : off) - 524288), B = Math.min(u.length, (off < 0 ? 2400000 : off) + 16384);
        put({ tag: cfg.tag, tok: tok, off: off, from: A, to: B, bytes: u.length, win: b64u(u.subarray(A, B)) });
      } else put({ tag: cfg.tag, tok: tok, nomem: 1 });
      return od.set.apply(this, arguments);
    },
  });

  const R = await fetch('/people/zhihuadmin/activities', { credentials: 'omit', headers: { accept: 'text/html' } });
  const H = await R.text();
  const hash = (H.match(/zse-ck\/v4\/([a-f0-9]+)\.js/) || [])[1];
  document.cookie = '__zse_ck=; path=/; max-age=0';
  let me = document.getElementById('zh-zse-ck');
  if (!me) { me = document.createElement('meta'); me.id = 'zh-zse-ck'; document.head.appendChild(me); }
  me.setAttribute('content', cfg.meta);
  const sc = document.createElement('script');
  sc.setAttribute('data-assets-tracker-config', '{"appName":"zse_ck","trackJSRuntimeError":true}');
  sc.src = 'https://static.zhihu.com/zse-ck/v4/' + (cfg.hash || hash) + '.js';
  document.body.appendChild(sc);
  await new Promise((r) => setTimeout(r, 3000));
  return JSON.stringify({ tag: cfg.tag, fired: done, from: localStorage.getItem(K + '_from'), to: localStorage.getItem(K + '_to'), winLen: (localStorage.getItem(K + '_win') || '').length });
}
