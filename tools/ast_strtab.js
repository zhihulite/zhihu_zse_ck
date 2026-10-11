// AST 解析 build：取混淆字符串表真值
// 思路：AST 定位 (a) 表函数 (b) 访问器 (c) 轮转 IIFE，然后只把这三段源码拼起来在沙箱里跑
const fs = require('fs');
const vm = require('vm');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;

const FILE = process.argv[3] || '.probe/oracle/live_fresh.js';
const wantIdx = parseInt(process.argv[2] || '10f', 16);
const src = fs.readFileSync(FILE, 'utf8');
const ast = parser.parse(src, { sourceType: 'script', allowReturnOutsideFunction: true });

const funcs = new Map();
for (const st of ast.program.body) {
  if (st.type === 'FunctionDeclaration' && st.id) funcs.set(st.id.name, st);
}

// 1) 表函数：体内出现数组字面量且 return 它
const tableFns = [];
for (const [name, fn] of funcs) {
  const txt = generate(fn).code;
  if (/=\s*\[/.test(txt) && txt.length > 400 && /return/.test(txt)) tableFns.push(name);
}
console.log('表函数:', tableFns.join(', '));

// 2) 访问器：从 `var _0x1d29f7=_0x3a98;` 这类别名取真名
let accName = null;
(function scanAlias(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(scanAlias); return; }
  if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' &&
      node.init && node.init.type === 'Identifier' && funcs.has(node.init.name)) {
    const f = funcs.get(node.init.name);
    if (f && f.params.length === 2 && generate(f).code.length < 1200) accName = node.init.name;
  }
  for (const k of Object.keys(node)) { if (k !== 'loc' && k !== 'start' && k !== 'end') scanAlias(node[k]); }
})(ast.program);
console.log('访问器（别名解析后）:', accName);

// 3) 轮转 IIFE
let rotNode = null;
(function scanRot(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(scanRot); return; }
  if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' &&
      node.expression.callee.type === 'FunctionExpression') {
    const t = generate(node.expression.callee).code;
    if (t.includes('push') && t.includes('shift')) rotNode = node.expression;
  }
  for (const k of Object.keys(node)) { if (k !== 'loc' && k !== 'start' && k !== 'end') scanRot(node[k]); }
})(ast.program);
console.log('轮转 IIFE:', !!rotNode);

// 4) 拼源码跑
// 轮转 IIFE 的第一个实参就是表函数名（最可靠）
let tName = tableFns[0];
if (rotNode && rotNode.arguments[0] && rotNode.arguments[0].type === 'Identifier') tName = rotNode.arguments[0].name;
console.log('采用表函数:', tName);
const tFn = funcs.get(tName);
const aFn = accName ? funcs.get(accName) : null;
let code = '';
code += src.slice(tFn.start, tFn.end) + '\n';
if (aFn) code += src.slice(aFn.start, aFn.end) + '\n';
if (rotNode) code += '(' + src.slice(rotNode.start, rotNode.end) + ');\n';

const sb = vm.createContext({ console });
vm.runInContext(code, sb, { timeout: 30000 });

const n = vm.runInContext(tName + '().length', sb);
console.log('轮转后表长度 =', n);
const val = vm.runInContext(accName + '(' + wantIdx + ')', sb);
console.log('[0x' + wantIdx.toString(16) + '] => 类型 ' + typeof val + (typeof val === 'string' ? ', 长度 ' + val.length : ', 值 ' + val));
if (typeof val === 'string') console.log('前 240 字符:', JSON.stringify(val.slice(0, 240)));

if (typeof val === 'string') fs.writeFileSync(process.env.OUT || '.probe/zsec/js_blob.txt', val, 'utf8');
const all = vm.runInContext('JSON.stringify(' + tName + '())', sb);
fs.writeFileSync((process.env.OUT||'.probe/zsec/js_blob.txt').replace(/\.txt$/,'')+'_tab.json', all, 'utf8');
console.log('已存 .probe/zsec/js_strtab.json');
const arr = JSON.parse(all);
const longs = arr.map((v, k) => [k, typeof v === 'string' ? v.length : -1]).filter(x => x[1] > 120).sort((a, b) => b[1] - a[1]);
console.log('长度 >120 的项:', longs.slice(0, 12).map(x => '#' + x[0] + '=' + x[1]).join(' '));
