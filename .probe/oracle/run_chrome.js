// 用 Node 起真实 Chrome 采指纹（避开 Git Bash 的引号/权限问题）
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const EXE = 'C:/Users/77/AppData/Local/Google/Chrome/Application/chrome.exe';
const PAGE = 'file:///' + path.resolve('.probe/oracle/harvest.html').replace(/\\/g, '/');
const OUT = '.probe/oracle/harvest_out.html';

const args = [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--disable-extensions', '--virtual-time-budget=6000', '--dump-dom',
  '--user-data-dir=' + path.resolve('.probe/oracle/_chrome_profile'),
  PAGE,
];
const r = spawnSync(EXE, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
console.log('status=', r.status, 'error=', String(r.error || '').slice(0, 160));
fs.writeFileSync(OUT, r.stdout || '', 'utf8');
console.log('stdout 长度', (r.stdout || '').length);
if (r.stderr) console.log('stderr 头:', String(r.stderr).slice(0, 300));
