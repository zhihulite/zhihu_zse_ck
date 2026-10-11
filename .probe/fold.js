const fs=require('fs');
const src=fs.readFileSync(process.argv[2],'utf8');
let n=0;
// fold pure numeric expressions (hex/dec with * + - /) — repeatedly
const re=/(-?\b(?:0x[0-9a-fA-F]+|\d+)\b)((?:\s*[*/]\s*-?(?:0x[0-9a-fA-F]+|\d+))+)((?:\s*[+\-]\s*-?(?:0x[0-9a-fA-F]+|\d+))*)/g;
function fold(s){
  return s.replace(re,(m)=>{
    // avoid folding if part of a larger identifier/number
    try{
      // only fold if the whole match is a self-contained arithmetic expr
      const v=Function('"use strict";return ('+m+')')();
      if(typeof v==='number'&&Number.isFinite(v)){n++;return String(v);}
    }catch(e){}
    return m;
  });
}
let out=src,prev;
do{prev=out;out=fold(out);}while(out!==prev && n<200000);
fs.writeFileSync(process.argv[3],out);
console.log('folded',n,'expressions; in',src.length,'out',out.length);