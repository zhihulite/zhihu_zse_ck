const fs=require('fs');
let src=fs.readFileSync(process.argv[2],'utf8');
const NUM='(?:0x[0-9a-fA-F]+|\\d+)';
const re=new RegExp('(-?\\b'+NUM+'\\b)((?:\\s*[-+*/]\\s*-?'+NUM+')+)','g');
let n=0;
for(let it=0;it<60;it++){
  const before=n;
  src=src.replace(re,(m)=>{
    try{ const v=Function('"use strict";return ('+m+')')();
      if(typeof v==='number'&&Number.isFinite(v)){n++;return String(v);} }catch(e){}
    return m;
  });
  if(n===before) break;
}
fs.writeFileSync(process.argv[3],src);
console.log('folded',n,'in',process.argv[2],'->',src.length);