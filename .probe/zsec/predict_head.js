// 用法: node predict_head.js <blobs.json> <flipSpec...>   (所有 spec 累积作用)
const fs=require('fs');
const g=require('../../js/zse_ck_generator.js');
const blobs=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const b26=Buffer.from(blobs['26'],'hex'), b162=Buffer.from(blobs['162'],'hex');
const m26=Buffer.from(b26), m162=Buffer.from(b162);
for (const spec of process.argv.slice(3)) {
  const [i,o,x]=spec.split(',').map(Number);
  (i===26?m26:m162)[o]^=x;
}
const w0 = g.word0FromPartA(Array.from(m26.slice(0,13)));
const chain = g.chainBytesFromBlobs(m26.slice(16,32), m26.slice(3266,3274), m162.slice(0,8));
const cw = g.chainWords(chain, null, m26[12]);
const head=[w0, cw[1], cw[2], cw[3], cw[4], cw[5], cw[6], 0x8800, 0x8000, 0x8000, cw[10], cw[11]];
console.log(head.map(x=>x.toString(16).padStart(4,'0')).join(' '));