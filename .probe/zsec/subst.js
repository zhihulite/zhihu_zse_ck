const fs = require('fs');

const src = fs.readFileSync('blobs/jsvmp_27264.js', 'utf8');
const map = JSON.parse(fs.readFileSync('dec_map.json', 'utf8'));

// 收集所有 _0xNNNN(0xNNN) 调用，判断哪些 _0x 名是解码器别名
const calls = {};
const re = /(_0x[0-9a-f]{3,7})\((0x[0-9a-f]+)\)/g;
let m;
const aliasCount = {};
while ((m = re.exec(src))) {
  const idx = parseInt(m[2], 16);
  if (map[idx] !== undefined) {
    aliasCount[m[1]] = (aliasCount[m[1]] || 0) + 1;
  }
}
console.log('decoder aliases:', aliasCount);
const aliases = Object.keys(aliasCount);
console.log('total decoded calls:', Object.values(aliasCount).reduce((a, b) => a + b, 0));

// 回填
let out = src;
for (const a of aliases) {
  const r = new RegExp(a.replace('$', '\\$') + '\\((0x[0-9a-f]+)\\)', 'g');
  out = out.replace(r, (mm, hex) => {
    const s = map[parseInt(hex, 16)];
    return JSON.stringify(s);
  });
}

// 再清理常见的无意义算术混淆（可选）：把 (0x..+-0x..) 之类保留，先不处理
fs.writeFileSync('jsvmp_deob.js', out);
console.log('wrote jsvmp_deob.js len', out.length);
console.log('--- head 1500 ---');
console.log(out.slice(0, 1500));
