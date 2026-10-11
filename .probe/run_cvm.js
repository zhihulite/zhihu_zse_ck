const fs=require('fs');
const f=process.argv[2];
const W=s=>process.stdout.write(s);
global.window=global;
global.document={createElement:()=>({getContext:()=>null,style:{}}),getElementsByTagName:()=>[{}]};
global.navigator={hardwareConcurrency:8,plugins:[]};
let src=fs.readFileSync(f,'utf8');
try{ const fn=new Function(src); const t0=Date.now(); fn(); W('  RAN in '+(Date.now()-t0)+'ms\n'); }
catch(e){ W('  THREW '+e.constructor.name+': '+String(e.message).slice(0,160)+'\n'); }