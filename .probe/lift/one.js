const fs=require('fs'),path=require('path'),vm=require('vm');
const BS=String.fromCharCode(92);
global.window=global; global.location={toString:()=>'https://www.zhihu.com/'};
global.document={createElement:()=>({getContext:()=>null,style:{},tagName:'DIV'}),getElementsByTagName:()=>[{appendChild(){},removeChild(){}}],all:()=>[]};
global.navigator={hardwareConcurrency:8,plugins:[]}; global.self=global;
global.BVM=function(){}; global.CVM=function(){};
global.__b=new Proxy({a3:0},{get:(t,k)=>(k in t?t[k]:()=>-1),set:(t,k,v)=>{t[k]=v;return true;}});
function expose(f){const s=fs.readFileSync(f,'utf8');for(const m of s.matchAll(/(?:^|\n|;)\s*(?:const|var|let)\s+([A-Za-z_\$][\w\$]*)\s*=\s*([\"'])/g)){const i=m.index+m[0].length-1,q=s[i];let k=i+1;while(k<s.length){if(s[k]===BS){k+=2;continue}if(s[k]===q)break;k++}try{global[m[1]]=vm.runInThisContext('('+s.slice(i,k+1)+')')}catch(e){}}}
const [srcFile, liftedFile] = process.argv.slice(2);
expose(srcFile);
function tr(mod,limit){const t=[];let err=null;global.TRACE=(pc)=>{ if(t.length<limit) t.push(pc); };try{mod.RUN([],null,undefined,0)}catch(e){err=e.constructor.name}global.TRACE=undefined;return {t,err}}
const A=tr(require(path.resolve(srcFile)),200);
const B=tr(require(path.resolve(liftedFile)),200);
const same=A.t.length===B.t.length&&A.t.every((x,i)=>x===B.t[i]);
console.log('  devirt: '+A.t.length+' steps '+(A.err||'')+' | lifted: '+B.t.length+' steps '+(B.err||'')+' | identical: '+same);