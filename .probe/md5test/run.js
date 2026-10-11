const path=process.argv[2];
const m=require('./'+path);
const vec=[
 ["",              "d41d8cd98f00b204e9800998ecf8427e"],
 ["abc",           "900150983cd24fb0d6963f7d28e17f72"],
 ["The quick brown fox jumps over the lazy dog","9e107d9d372bb6826bd81d3542a419d6"],
 ["message digest","f96b697d7cb7938d525a2f31aaf161d0"],
 ["\u4e2d\u6587\u6d4b\u8bd5","bd0ba2a3d4e2aebcb9e0d6f1b3d3e3e6"],
];
let ok=0,bad=0;
for(const [inp,exp] of vec){
  let got;
  try{ got=m.md5(inp); }catch(e){ got="ERR:"+e.message; }
  const hit = got===exp;
  if(hit)ok++; else bad++;
  console.log((hit?"PASS":"FAIL")+" md5("+JSON.stringify(inp)+") = "+got+(hit?"":"  expected "+exp));
}
// HMAC-MD5 RFC2202 test case 1: key=0x0b*16, data="Hi There" -> 9294727a3638bb1c13f48ef8158bfc9d
try{
  const key=String.fromCharCode(...Array(16).fill(0x0b));
  const got=m.hmac(key,"Hi There");
  const hit=got==="9294727a3638bb1c13f48ef8158bfc9d";
  if(hit)ok++; else bad++;
  console.log((hit?"PASS":"FAIL")+" hmac(key=0b*16,'Hi There') = "+got+(hit?"":"  expected 9294727a3638bb1c13f48ef8158bfc9d"));
}catch(e){ bad++; console.log("FAIL hmac ERR "+e.message); }
console.log(path+": "+ok+" pass, "+bad+" fail");
process.exit(bad?1:0);