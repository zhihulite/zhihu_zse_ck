// record93[0:48) 预测器自检（新模型）
const fs = require('fs');
const g = require('../../js/zse_ck_generator.js');
const blobs = JSON.parse(fs.readFileSync(__dirname + '/blobs.json', 'utf8'));
const b26 = Buffer.from(blobs['26'], 'hex'), b162 = Buffer.from(blobs['162'], 'hex');

function predict(m26, m162) {
  const w0 = g.word0FromPartA(Array.from(m26.slice(0, 13)));
  const chain = g.chainBytesFromBlobs(m26.slice(16, 32), m26.slice(3266, 3274), m162.slice(0, 8));
  const cw = g.chainWords(chain, null, m26[12]);
  return [w0, cw[1], cw[2], cw[3], cw[4], cw[5], cw[6], 0x8800, 0x8000, 0x8000, cw[10], cw[11]]
    .map(x => x.toString(16).padStart(4, '0')).join(' ');
}
const hex = a => a.map(x => x.toString(16).padStart(4, '0')).join(' ');
let pass = 0, total = 0;
const chk = (label, got, exp) => { total++; if (got === exp) { pass++; } else console.log('  FAIL', label, '\n    got', got, '\n    exp', exp); };

const BASE = hex([0x236c,0x2000,0x1000,0x8000,0x4000,0x8000,0x8000,0x8800,0x8000,0x8000,0x8000,0x4000]);
chk('baseline', predict(b26, b162), BASE);
const flip = (arr, o, x) => { const c = Buffer.from(arr); c[o] ^= x; return c; };
chk('26 b0^3',   predict(flip(b26,0,3), b162), hex([0xe938,0x2000,0x1000,0x8000,0x4000,0x8000,0x8000,0x8800,0x8000,0x8000,0x8000,0x4000]));
chk('26 b12^1',  predict(flip(b26,12,1), b162), hex([0x546b,0x3000,0x1000,0x8000,0x4000,0x8000,0x8000,0x8800,0x8000,0x8000,0x8000,0x4000]));
chk('26 b3269^1',predict(flip(b26,3269,1), b162), hex([0x236c,0x2000,0x1000,0x8000,0x4000,0x8001,0x9000,0x8800,0x8000,0x8000,0x8000,0x4000]));
chk('26 b3273^1',predict(flip(b26,3273,1), b162), hex([0x236c,0x2000,0x1000,0x8000,0x4000,0x8000,0x8001,0x8800,0x8000,0x8000,0x9000,0x4000]));
chk('162 b0^1',  predict(b26, flip(b162,0,1)),   hex([0x236c,0x2000,0x1000,0x8000,0x4000,0x8000,0x8000,0x8800,0x8000,0x8000,0x9100,0x4000]));
console.log('record93[0:48) 预测器自检: %d/%d 通过', pass, total);
