const dec=require('./dec.js');
const args=require('./args.json');
const out={};
for(const n of args){ try{ out[n]=dec(n); }catch(e){ out[n]="<ERR:"+e.message+">"; } }
require('fs').writeFileSync('.probe/md5test/strings.json', JSON.stringify(out,null,1));
console.log("resolved", Object.keys(out).length);
for(const n of args.slice(0,12)) console.log("  "+n+" -> "+JSON.stringify(out[n]));