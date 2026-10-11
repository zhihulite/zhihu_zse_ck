// livefetch.js —— 沙箱里给站点 JS / Go wasm 用的最小 HTTP 客户端
//
// 用途：站点 JS 的 `fetch` / `XMLHttpRequest` 与 Go 侧的 `syscall/js` 都靠它拉网络资源
//       （主要是每次会话的挑战 JS）。
//
// 说明：这是**手写的替代实现**，不是从站点捕获的文件 —— 它只提供标准 Response 形状，
//       不参与任何环境判定。真正需要「与真机一致」的是 `fp_real.js`。
'use strict';
const http = require('http');
const https = require('https');
const { URL } = require('url');

// 与 handenv 的 navigator.userAgent 保持一致
const UA = process.env.ZSE_REAL_UA ||
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ZCode/3.14.4 Chrome/146.0.7680.80 Electron/41.0.3 Safari/537.36';

const LOG = [];

function request(url, init) {
  const opts = init || {};
  const u = new URL(String(url));
  const mod = u.protocol === 'http:' ? http : https;
  const method = String(opts.method || 'GET').toUpperCase();
  const headers = {};
  if (opts.headers) {
    const h = opts.headers;
    if (typeof h.forEach === 'function' && !Array.isArray(h)) h.forEach((v, k) => { headers[k] = v; });
    else for (const k of Object.keys(h)) headers[k] = h[k];
  }
  if (!Object.keys(headers).some((k) => k.toLowerCase() === 'user-agent')) headers['User-Agent'] = UA;
  if (!Object.keys(headers).some((k) => k.toLowerCase() === 'accept')) headers['Accept'] = '*/*';

  LOG.push({ ev: 'fetch', url: String(url).slice(0, 220), method: method });

  return new Promise((resolve, reject) => {
    const req = mod.request({
      protocol: u.protocol, hostname: u.hostname, port: u.port || undefined,
      path: u.pathname + u.search, method: method, headers: headers,
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        const hdrs = new Map(Object.entries(res.headers));
        const r = {
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          statusText: res.statusMessage || '',
          url: String(url),
          redirected: false,
          headers: {
            get: (k) => (hdrs.has(String(k).toLowerCase()) ? hdrs.get(String(k).toLowerCase()) : null),
            has: (k) => hdrs.has(String(k).toLowerCase()),
            forEach: (fn) => hdrs.forEach((v, k) => fn(v, k)),
          },
          body: body,
          arrayBuffer: async () => body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength),
          bytes: async () => new Uint8Array(body),
          text: async () => body.toString('utf8'),
          json: async () => JSON.parse(body.toString('utf8')),
          clone() { return this; },
        };
        resolve(r);
      });
    });
    req.on('error', reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

module.exports = { fetch: request, request: request, LOG: LOG, UA: UA };
