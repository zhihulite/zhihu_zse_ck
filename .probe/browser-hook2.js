async () => {
  const CFG = JSON.parse(localStorage.getItem('__zcfg') || '{}');
  CFG.tag = CFG.tag || 'x'; CFG.meta = CFG.meta || 'FRESH'; CFG.hash = CFG.hash || null;
  const HIST = '__zhist';
  const push = (o) => { let a; try { a = JSON.parse(localStorage.getItem(HIST)) || []; } catch (e) { a = []; } a.push(o); localStorage.setItem(HIST, JSON.stringify(a)); };

  let mem = null; const notes = [];
  const ZWJ = [0xe2, 0x80, 0x8d];
  function scan(tag) {
    if (!mem) { notes.push(tag + ':noMem'); return null; }
    const u = new Uint8Array(mem.buffer);
    const hits = [];
    for (let i = 0; i + 2 < u.length && hits.length < 40; i++) {
      if (u[i] === 0xe2 && u[i + 1] === 0x80 && u[i + 2] === 0x8d) hits.push(i);
    }
    const dec = new TextDecoder('utf-8', { fatal: false });
    const ctx = hits.map((h) => {
      let a = h; while (a > 0 && (u[a - 1] >= 32 && u[a - 1] < 127 || u[a - 1] > 127)) a--;
      let b = h; while (b < u.length && (u[b] >= 32 && u[b] < 127 || u[b] > 127)) b++;
      return h + '|' + dec.decode(u.subarray(Math.max(0, a - 2), Math.min(u.length, b + 3))).slice(0, 300);
    });
    push({ tag: tag, memBytes: u.length, zwjCount: hits.length, ctx: ctx });
    return hits;
  }

  const R = await fetch('/people/zhihuadmin/activities', { credentials: 'omit', headers: { accept: 'text/html' } });
  const H = await R.text();
  const fresh = (H.match(/id="zh-zse-ck"[^>]*content="([^"]*)"/) || [])[1];
  const hash = CFG.hash || (H.match(/zse-ck\/v4\/([a-f0-9]+)\.js/) || [])[1];
  const meta = CFG.meta === 'FRESH' ? fresh : CFG.meta;
  if (!hash || !meta) return 'ERR nohash/nometa';
  push({ tag: 'meta:' + CFG.tag, meta: meta, hash: hash, fresh: fresh });

  const od = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
  Object.defineProperty(Document.prototype, 'cookie', {
    configurable: true, get: od.get,
    set: function (v) {
      const s = String(v);
      const m = s.match(/__zse_ck=([^;]*)/);
      if (m && m[1].length > 50 && !window.__done) { window.__done = 1; window.__tok = m[1]; scan('cookie'); }
      return od.set.apply(this, arguments);
    },
  });

  const P = WebAssembly;
  const grab = (r) => {
    try {
      const inst = (r && r.instance) || r;
      mem = inst && inst.exports && inst.exports.memory;
      window.__mem = mem;
      notes.push('grab:' + (mem ? mem.buffer.byteLength : 'none') + ':' + Object.keys(inst.exports || {}).slice(0, 12).join(','));
    } catch (e) { notes.push('grabErr:' + String(e).slice(0, 90)); }
    return r;
  };
  const oI = P.instantiate.bind(P), oS = P.instantiateStreaming ? P.instantiateStreaming.bind(P) : null, oInst = P.Instance;
  window.WebAssembly = new Proxy(P, {
    get: (t, p) => {
      if (p === 'instantiate') return (b, i) => Promise.resolve(oI(b, i)).then(grab);
      if (p === 'instantiateStreaming') return (r2, i) => Promise.resolve(oS(r2, i)).then(grab);
      if (p === 'Instance') return function (m, i) { const x = new oInst(m, i); grab(x); return x; };
      return t[p];
    },
    set: (t, p, val) => { t[p] = val; return true; },
    has: () => true,
  });

  document.cookie = '__zse_ck=; path=/; max-age=0';
  let me = document.getElementById('zh-zse-ck');
  if (!me) { me = document.createElement('meta'); me.id = 'zh-zse-ck'; document.head.appendChild(me); }
  me.setAttribute('content', meta);
  const sc = document.createElement('script');
  sc.setAttribute('data-assets-tracker-config', '{"appName":"zse_ck","trackJSRuntimeError":true}');
  sc.setAttribute('crossorigin', '');
  sc.src = 'https://static.zhihu.com/zse-ck/v4/' + hash + '.js';
  document.body.appendChild(sc);
  await new Promise((r) => setTimeout(r, 6000));
  const t = window.__tok || (document.cookie.match(/__zse_ck=([^;]*)/) || [])[1] || '';
  push({ tag: 'end:' + CFG.tag, tok: t, metaUsed: meta, hash: hash, notes: notes });
  return JSON.stringify({ tag: CFG.tag, tokLen: t.length, tokHead: t.slice(0, 40), notes: notes.slice(0, 6), histLen: (JSON.parse(localStorage.getItem(HIST)) || []).length });
}
