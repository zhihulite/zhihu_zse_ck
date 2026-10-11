async () => {
  const HIST = '__zcopy';
  const push = (o) => { let a; try { a = JSON.parse(localStorage.getItem(HIST)) || []; } catch (e) { a = []; } a.push(o); localStorage.setItem(HIST, JSON.stringify(a)); };

  const R = await fetch('/people/zhihuadmin/activities', { credentials: 'omit', headers: { accept: 'text/html' } });
  const H = await R.text();
  const meta = (H.match(/id="zh-zse-ck"[^>]*content="([^"]*)"/) || [])[1];
  const hash = (H.match(/zse-ck\/v4\/([a-f0-9]+)\.js/) || [])[1];
  if (!meta || !hash) return 'NOCHALLENGE';
  localStorage.setItem(HIST, '[]');
  push({ tag: 'meta', meta: meta, hash: hash });

  let mem = null; const calls = [];
  const rd = (addr, n) => {
    if (!mem) return null;
    const u = new Uint8Array(mem.buffer);
    const a = addr >>> 0;
    if (a + n > u.length) return null;
    return new TextDecoder('utf-8', { fatal: false }).decode(u.subarray(a, a + n));
  };
  const latin = (addr, n) => {
    if (!mem) return null;
    const u = new Uint8Array(mem.buffer); const a = addr >>> 0;
    let s = '';
    for (let i = 0; i < n && a + i < u.length; i++) s += String.fromCharCode(u[a + i] < 32 || u[a + i] > 126 ? 0x3f : u[a + i]);
    return s;
  };

  const P = WebAssembly;
  const oI = P.instantiate.bind(P);
  const wrap = (i) => {
    const o = {};
    for (const m of Object.keys(i)) {
      o[m] = {};
      for (const n of Object.keys(i[m])) {
        const f = i[m][n];
        if (typeof f !== 'function') { o[m][n] = f; continue; }
        o[m][n] = function (...a) {
          const pre = calls.length;
          const r = f.apply(i[m], a);
          if (calls.length < 900) {
            const rec = { m: m, n: n, a: a.map((v) => (typeof v === 'bigint' ? 'B' + v : typeof v === 'number' && !Number.isInteger(v) ? 'F' + v : String(v).slice(0, 24))) };
            if (/copyBytesToGo/.test(n)) {
              const dst = Number(a[4]) >>> 0;
              const len = Math.min(Number(a[5]) || 0, 700);
              rec.dst = dst; rec.len = len;
              rec.txt = dst ? latin(dst, len) : null;
              rec.ret = typeof r === 'number' ? r : String(r);
            } else if (/valueNew|valueLength|valueIndex|valueSetIndex/.test(n)) {
              rec.big = a.map((v) => (typeof v === 'bigint' ? 'B' + (v - 9221120241336056832n) : String(v).slice(0, 20)));
              rec.ret = typeof r === 'number' ? r : (typeof r === 'bigint' ? 'RB' + (r - 9221120241336056832n) : String(r).slice(0, 24));
            }
            calls.push(rec);
            if (calls.length % 15 === 0) push({ tag: 'chunk', n: calls.length, calls: calls.slice(0) });
          }
          return r;
        };
      }
    }
    return o;
  };
  const grab = (r) => { const inst = (r && r.instance) || r; mem = inst && inst.exports && inst.exports.memory; window.__mem = mem; push({ tag: 'mem', bytes: mem ? mem.buffer.byteLength : 0 }); return r; };
  window.WebAssembly = new Proxy(P, { get: (t, p) => (p === 'instantiate' ? (b, i) => Promise.resolve(oI(b, wrap(i))).then(grab) : t[p]), set: (t, p, v) => { t[p] = v; return true; }, has: () => true });

  document.cookie = '__zse_ck=; path=/; max-age=0';
  let me = document.getElementById('zh-zse-ck');
  if (!me) { me = document.createElement('meta'); me.id = 'zh-zse-ck'; document.head.appendChild(me); }
  me.setAttribute('content', meta);
  const sc = document.createElement('script');
  sc.setAttribute('data-assets-tracker-config', '{"appName":"zse_ck","trackJSRuntimeError":true}');
  sc.src = 'https://static.zhihu.com/zse-ck/v4/' + hash + '.js';
  document.body.appendChild(sc);
  await new Promise((r) => setTimeout(r, 2500));
  push({ tag: 'calls', calls: calls, tok: window.__tok || (document.cookie.match(/__zse_ck=([^;]*)/) || [])[1] || (function () { const t = localStorage.getItem('__zhist'); try { return JSON.parse(t).filter((x) => x.tag === 'cookie')[0].tok; } catch (e) { return null; } })() });
  return JSON.stringify({ calls: calls.length, withText: calls.filter((c) => c.txt).length, tok: (document.cookie.match(/__zse_ck=([^;]*)/) || [])[1]?.slice(0, 40) || null });
}
