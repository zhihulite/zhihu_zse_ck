const fs=require('fs'),vm=require('vm');
const parser=require('@babel/parser');
const gen=require('@babel/generator').default;
const files=fs.readdirSync('.probe').filter(f=>/^live-.*\.js$/.test(f)&&!f.includes('folded')&&!f.includes('bootstrap')).sort();
for(const f of files){
  try{
    const src=fs.readFileSync('.probe/'+f,'utf8');
    const ast=parser.parse(src,{sourceType:'script',allowReturnOutsideFunction:true});
    const funcs=new Map();
    for(const st of ast.program.body) if(st.type==='FunctionDeclaration'&&st.id) funcs.set(st.id.name,st);
    let rot=null;
    (function scan(nd){ if(!nd||typeof nd!=='object')return;
      if(Array.isArray(nd)){nd.forEach(scan);return;}
      if(nd.type==='ExpressionStatement'&&nd.expression.type==='CallExpression'&&nd.expression.callee.type==='FunctionExpression'){
        const t=gen(nd.expression.callee).code; if(t.includes('push')&&t.includes('shift')) rot=nd.expression; }
      for(const k of Object.keys(nd)) if(k!=='loc'&&k!=='start'&&k!=='end') scan(nd[k]); })(ast.program);
    if(!rot){ console.log(f.padEnd(30),'no-rot'); continue; }
    const tName=rot.arguments[0].name;
    const rotSrc=src.slice(rot.start,rot.end);
    // 访问器：rotSrc 里 `var X=<fnName>` 的那个 fnName
    const m=/var (_0x[0-9a-f]+)=(_0x[0-9a-f]+)/.exec(rotSrc);
    const accName=m?m[2]:null;
    let code=src.slice(funcs.get(tName).start,funcs.get(tName).end)+';\n';
    if(accName&&funcs.has(accName)) code+=src.slice(funcs.get(accName).start,funcs.get(accName).end)+';\n';
    code+='('+rotSrc+');\n';
    const sb=vm.createContext({console});
    vm.runInContext(code,sb,{timeout:20000});
    const arr=JSON.parse(vm.runInContext('JSON.stringify('+tName+'())',sb));
    const longs=arr.map((v,i)=>[i,typeof v==='string'?v.length:-1]).filter(x=>x[1]>1000);
    console.log(f.padEnd(30), '表长='+arr.length, longs.map(([i,L])=>`#${i}:${L}:${arr[i].slice(0,20)}`).join(' | '));
  }catch(e){ console.log(f.padEnd(30),'ERR '+String(e.message).slice(0,60)); }
}