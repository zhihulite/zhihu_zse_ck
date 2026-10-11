const fs = require('fs');
const out = fs.readFileSync('jsvmp_deob.js', 'utf8');

const i = out.indexOf('function r()');
console.log('r() at', i, 'of', out.length);
let body = out.slice(i);

// 在函数体里插入换行，便于阅读
let pretty = body
  .replace(/,/g, ',\n')
  .replace(/\{/g, '{\n')
  .replace(/\}/g, '\n}')
  .replace(/;/g, ';\n');

fs.writeFileSync('jsvmp_r_pretty.js', pretty);
console.log('pretty len', pretty.length);
console.log(pretty.slice(0, 6000));
