const dec=require('./dec.js');
const args=require('./args_raw.json');
const out={};
for(const a of args){ const v=eval(a); try{ out[a]=dec(v); }catch(e){ out[a]="<ERR:"+e.message+">"; } }
require('fs').writeFileSync('.probe/md5test/strings.json', JSON.stringify(out,null,1));
console.log("resolved", Object.keys(out).length);