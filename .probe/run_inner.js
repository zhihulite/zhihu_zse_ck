const fs=require('fs');
const f=process.argv[2];
const W=s=>process.stdout.write(s);
global.window=global;
global.document={createElement:()=>({getContext:()=>null,style:{}}),getElementsByTagName:()=>[{}]};
global.navigator={hardwareConcurrency:8,plugins:[]};
global.self=global;
let src=fs.readFileSync(f,'utf8');
// expose the VM entry result (identical transformation for every variant)
const n=src.replace(/__c\.H\(/g,'globalThis.__RES__=__c.H(');
if(n===src) W('  [warn] no __c.H( found\n');
try{
  const fn=new Function(n);
  const t0=Date.now();
  fn();
  const dt=Date.now()-t0;
  const r=globalThis.__RES__;
  W('  RAN in '+dt+'ms  result='+(r===undefined?'undefined':JSON.stringify(r).slice(0,180))+'\n');
}catch(e){ W('  THREW '+e.constructor.name+': '+String(e.message).slice(0,180)+'\n'); }