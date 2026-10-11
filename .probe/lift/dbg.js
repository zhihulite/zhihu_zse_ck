const W=s=>process.stdout.write(s);
global.window=global;
global.location={toString:()=>'https://www.zhihu.com/'};
global.document={createElement:()=>({getContext:()=>null,style:{},tagName:'DIV'}),getElementsByTagName:()=>[{appendChild(){},removeChild(){}}],all:()=>[]};
global.navigator={hardwareConcurrency:8,plugins:[]};
global.self=global;
global.BVM=function BVM(){};
global.__b=new Proxy({a3:0},{get:(t,k)=>(k in t?t[k]:()=>-1),set:(t,k,v)=>{t[k]=v;return true;}});
const trace=[];
global.TRACE=(pc,A,l,S,F,n)=>{ if(n<400) trace.push(pc); };
const A=require('../../js/inner.decompiled.js');
function run(mod,tag,tr){
  trace.length=0; global.TRACE = tr ? ((pc,A,l,S,F,n)=>{if(trace.length<3000)trace.push(pc)}) : undefined;
  try{ mod.RUN([], null, undefined, 0); }catch(e){}
  return trace.slice();
}
const ta=run(A,'devirt',true);
const B=require('./inner.lifted.js');
// patch lifted M_EVAL to log
const src=require('fs').readFileSync('.probe/lift/inner.lifted.js','utf8');
const patched=src.replace('function M_EVAL(name) { return eval(name); }',
  'function M_EVAL(name) { try { return eval(name); } catch(e) { process.stdout.write("  M_EVAL FAILED on: "+JSON.stringify(String(name).slice(0,140))+"\\n"); throw e; } }');
require('fs').writeFileSync('.probe/lift/_dbg.js', patched);
const B2=require('./_dbg.js');
global.TRACE=undefined;
try{ B2.RUN([], null, undefined, 0); }catch(e){ W('  lifted threw: '+e.message.slice(0,80)+'\n'); }