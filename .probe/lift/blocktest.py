"""Per-block differential test for the lifter.

The runtime trace test only reaches the 11-12 blocks the program executes in a
stubbed host.  This harness instantiates EVERY lifted block (per the lifter's
own plan dump) with a fixed concrete entry state and compares the devirt form
against the lifted form, so the whole lifted set is covered.
"""
import re, json, sys, importlib.util

spec = importlib.util.spec_from_file_location('lf', '.probe/lift.py')
lf = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lf)

PRE = '''
function M_GET(o,k){return (o===undefined||o===null)?undefined:o[k];}
function M_SET(o,k,v){if(o!==undefined&&o!==null)o[k]=v;return v;}
function M_EVAL(name){return eval(name);}
function SUBCALL(A,l,S,i,argc){ if(argc) S.splice(-argc); return 'CALL'; }
function SUB(entry,argc,A,l,S){ if(argc) S.splice(-argc); return 'CALL'; }
globalThis.BVM = function BVM(){}; globalThis.CVM = function CVM(){};
globalThis.window = globalThis;
globalThis.location = { toString: () => 'https://www.zhihu.com/' };
globalThis.document = { createElement: () => ({ getContext: () => null, style: {}, tagName: 'DIV' }),
                        getElementsByTagName: () => [{ appendChild(){}, removeChild(){} }], all: () => [] };
globalThis.navigator = { hardwareConcurrency: 8, plugins: [] };
globalThis.__b = { a3: 0 };
Math.random = () => 0.5;          // the program samples Math.random()
Object.defineProperty(globalThis, 'crypto', { configurable: true,
  value: { getRandomValues: (a) => { for (let i=0;i<a.length;i++) a[i]=i; return a; } } });
// temps emitted by the lifter are undeclared globals; reset them so a previous
// block cannot leak a stale value into the next block's entry stack
function resetTemps(){ for (let i=0;i<400;i++) globalThis['t'+i] = undefined; }
let v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46, v47, v48, v49, v50, v51, v52, v53, v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64, v65, v66, v67, v68, v69, v70, v71, v72, v73, v74, v75, v76, v77, v78, v79, v80, v81, v82, v83, v84, v85, v86, v87, v88, v89, v90, v91, v92, v93, v94, v95, v96, v97, v98, v99;
function resetV(l){ v0=l[0]; v1=l[1]; v2=l[2]; v3=l[3]; v4=l[4]; v5=l[5]; v6=l[6]; v7=l[7]; v8=l[8]; v9=l[9]; v10=l[10]; v11=l[11]; v12=l[12]; v13=l[13]; v14=l[14]; v15=l[15]; v16=l[16]; v17=l[17]; v18=l[18]; v19=l[19]; v20=l[20]; v21=l[21]; v22=l[22]; v23=l[23]; v24=l[24]; v25=l[25]; v26=l[26]; v27=l[27]; v28=l[28]; v29=l[29]; v30=l[30]; v31=l[31]; v32=l[32]; v33=l[33]; v34=l[34]; v35=l[35]; v36=l[36]; v37=l[37]; v38=l[38]; v39=l[39]; v40=l[40]; v41=l[41]; v42=l[42]; v43=l[43]; v44=l[44]; v45=l[45]; v46=l[46]; v47=l[47]; v48=l[48]; v49=l[49]; v50=l[50]; v51=l[51]; v52=l[52]; v53=l[53]; v54=l[54]; v55=l[55]; v56=l[56]; v57=l[57]; v58=l[58]; v59=l[59]; v60=l[60]; v61=l[61]; v62=l[62]; v63=l[63]; v64=l[64]; v65=l[65]; v66=l[66]; v67=l[67]; v68=l[68]; v69=l[69]; v70=l[70]; v71=l[71]; v72=l[72]; v73=l[73]; v74=l[74]; v75=l[75]; v76=l[76]; v77=l[77]; v78=l[78]; v79=l[79]; v80=l[80]; v81=l[81]; v82=l[82]; v83=l[83]; v84=l[84]; v85=l[85]; v86=l[86]; v87=l[87]; v88=l[88]; v89=l[89]; v90=l[90]; v91=l[91]; v92=l[92]; v93=l[93]; v94=l[94]; v95=l[95]; v96=l[96]; v97=l[97]; v98=l[98]; v99=l[99]; }
const A0 = [101,102,103,104];
function mk(){ const l=[]; for(let i=0;i<90;i++) l[i]=200+i; return {A:A0.slice(), l:l, S:[], F:true}; }
function norm(x){ return x.replace(/DEV_|LIF_/g,'X').replace(/:[0-9]+:[0-9]+/g,''); }   // Error().stack text differs by construction
function dig(s){ const t=v=>{ if(v===null)return 'null'; if(typeof v==='object')return 'obj'; if(typeof v==='function')return 'fn';
  var x=norm(String(v));
  try{ var d=Buffer.from(x,'base64').toString('utf8'); if(d.length>4) x=Buffer.from(norm(d),'utf8').toString('base64'); }catch(e){}
  return x; }; }
function run(st, fn){
  try { fn(st.A, st.l, st.S, st.F); return 'ok ' + dig(st); }
  catch (e) { return 'throw ' + e.constructor.name + ' ' + dig(st); }
}
let PASS=0, FAIL=0;
'''


def strip_ctrl(lines):
    out = []
    for ln in lines:
        t = ln.strip()
        if t.startswith('if (') and 'pc = ' in t and 'continue;' in t:
            continue
        if t.startswith('pc = ') and 'continue;' in t:
            continue
        if t.startswith('return'):
            continue
        out.append(ln)
    return out


def build(src_file, plan_file, out_file):
    src = open(src_file, encoding='utf8').read()
    i = src.index('function RUN(l, D, A, pc)')
    j = src.rindex('default:')
    blk = {pc: lf.split_block(t) for pc, t in lf.parse_blocks(src[i:j])}
    plan = json.load(open(plan_file, encoding='utf8'))
    NL = chr(10)
    body = [PRE]
    n = 0
    for pc in list(plan['liftable']) + list(plan.get('keep', [])):
        if pc not in blk:
            continue
        ents = NL.join('    S.push(%s);' % e for e in plan['entryS'].get(str(pc), []))
        devirt = NL.join('  ' + s + ';' for s in strip_ctrl(blk[pc][0]))
        bmap = plan['bodies'] if str(pc) in plan['bodies'] else plan.get('keepBodies', {})
        lifted = NL.join(strip_ctrl(bmap[str(pc)]))
        body.append(NL.join([
            'function DEV_%d(A,l,S,F){' % pc,
            ents,
            devirt,
            '}',
            'function LIF_%d(A,l,S,F){' % pc,
            ents,
            lifted,
            '}',
            '{ // block %d' % pc,
            '  const s1 = mk(), s2 = mk(); resetTemps();',
            "  resetTemps(); resetV(s1.l); const r1 = run(s1, DEV_%d); resetTemps(); resetV(s2.l); const r2 = run(s2, LIF_%d);" % (pc, pc),
            "  if (r1 === r2) PASS++; else { FAIL++; if (FAIL<=5) console.log('  MISMATCH block ' + %d + String.fromCharCode(10) + '    devirt: ' + r1 + String.fromCharCode(10) + '    lifted: ' + r2); }" % pc,
            '}',
        ]))
        n += 1
    body.append('console.log("  per-block differential: %d blocks, "+PASS+" pass, "+FAIL+" fail");' % n)
    body.append('if (typeof process !== "undefined") process.exit(FAIL?1:0);')
    open(out_file, 'w', encoding='utf8').write(NL.join(body) + NL)
    return n


if __name__ == '__main__':
    for src, plan, out in [('js/cvm.decompiled.js', '.probe/lift/cvm.lifted.js.plan.json', '.probe/lift/bt_cvm.js'),
                           ('js/inner.decompiled.js', '.probe/lift/inner.lifted.js.plan.json', '.probe/lift/bt_inner.js'),
                           ('js/payload.cvm.js', '.probe/lift/payload.lifted.js.plan.json', '.probe/lift/bt_payload.js'),
                           # 2026-10-08 补：service 程序层（633 词 / 37 块）此前漏跑逐块差分
                           ('js/service.decompiled.js', '.probe/lift/service.lifted.js.plan.json', '.probe/lift/bt_service.js')]:
        n = build(src, plan, out)
        print("%-24s %d lifted blocks -> %s" % (src, n, out))
