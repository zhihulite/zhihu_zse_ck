import re, subprocess, os, json, sys
SRC='.probe/zsec/zse_ck_fingerprint.restored.js'
DST='zse_ck_fingerprint.md5.js'
s=open(SRC,encoding='utf8').read()

M={
 # --- string-array accessor / decoder machinery ---
 '_0x599f':'getStringArray','_0x2f5e70':'stringArray','_0x55a077':'arrFn','_0x3c6d8d':'expectedChecksum',
 '_0x3e60c7':'arr','_0x4fd560':'checksum','_0x4919b6':'e0','_0x4a65a1':'decAlias0',
 '_0x4848':'decodeStr','_0x3244c0':'arr2','_0x3d4d1d':'index','_0x1e72a9':'keyArg2','_0x2cf623':'str',
 '_0x208a0a':'decodeBase64Utf8','_0x2618cb':'b64Input','_0x4a615d':'b64chars','_0x55e9f5':'binStr',
 '_0x54d0e6':'pctStr','_0x3e9a49':'i','_0x6dc16d':'acc','_0x1276d0':'ch','_0x4f2416':'pos',
 '_0x1f0e88':'k','_0x2a5f33':'len','_0x4352d0':'args','_0x1f04a4':'keyArg',
 '_0x560957':'offset','_0x5d5fb3':'cacheKey','_0x4a6757':'cached',
 # --- r(): fingerprint collector ---
 '_0x93a7c4':'dec','_0x18eec0':'onceFn','_0x15fb99':'firstCall','_0x4aa73e':'ctx','_0x3ccaed':'fn',
 '_0x475a3f':'wrapper','_0x23e18f':'decA','_0xbc410c':'result','_0x24eac6':'parts','_0x59006f':'e1',
 '_0x5e8630':'canvas','_0x3be9eb':'gl','_0x592177':'readGlParam','_0x1a85a5':'paramName',
 '_0x2006d4':'decB','_0x32a9dd':'antiDebug','_0x83e176':'decC','_0x2c9482':'globalObj',
 '_0xc1f1da':'getGlobal','_0x20f48f':'e2','_0xe01bd2':'consoleObj','_0x2f246b':'consoleMethods',
 '_0x2bb942':'ci','_0xd509bb':'boundFn','_0x4252ba':'methodName','_0x1ac07c':'origFn',
 '_0x5a3dd3':'dbgExt','_0x459425':'canvasText','_0xe3c601':'ctx2d','_0x5dc3b5':'e3',
 '_0x47ecde':'baseFonts','_0x1e200e':'fontList','_0x5d196b':'testString','_0x29a30e':'fontSize',
 '_0x1d1a9a':'body','_0x31bf79':'span','_0x41d853':'baseWidths','_0x2ca76d':'baseHeights',
 '_0x4f765d':'bfi','_0x41179e':'fi','_0x5b4848':'font','_0xa30f7b':'decD','_0x2a664d':'detected',
 '_0x33fea9':'bfj','_0xbb63cb':'differs','_0x5dc4c4':'e4','_0x4d6972':'plugins',
 '_0x5f4162':'pluginNames','_0x5c3a17':'pi','_0x56b698':'plugin','_0x3fe47a':'e5',
 # --- MD5 core (RFC 1321) ---
 '_0x483804':'md5Fingerprint','_0x5d5355':'input','_0x2c47ab':'decE',
 '_0x7a98':'add32','_0x2de9a5':'a','_0x4c65a8':'b','_0x1360a5':'lsw',
 '_0x340f6e':'cmn','_0x265a65':'q','_0x2303ad':'a2','_0x26c60f':'b2','_0x5475c8':'x2',
 '_0x30f0a4':'s2','_0x4bc76d':'t2',
 '_0x27e95f':'ff','_0x19c57b':'a3','_0x5519ed':'b3','_0x1d46af':'c3','_0x218686':'d3',
 '_0x3d6308':'x3','_0xdc6b5d':'s3','_0x627a80':'t3',
 '_0x1fec22':'gg','_0x383d92':'a4','_0x425bc4':'b4','_0x1ac7ed':'c4','_0x525230':'d4',
 '_0x1595c7':'x4','_0x36df6c':'s4','_0x52518e':'t4',
 '_0x479bec':'hh','_0x2ff2eb':'a5','_0x2659cb':'b5','_0x55fc0e':'c5','_0x26c144':'d5',
 '_0x216fce':'x5','_0xf894fe':'s5','_0x48acea':'t5',
 '_0x29b6d0':'ii','_0x27d159':'a6','_0x25579b':'b6','_0x9ca056':'c6','_0x32cc18':'d6',
 '_0x323592':'x6','_0x1c9cca':'s6','_0x1d4558':'t6',
 '_0x408d39':'coreMD5','_0x183d60':'x','_0x33d442':'len','_0x4f0347':'decF',
 '_0x54eb30':'olda','_0x2b8a73':'oldb','_0x67051e':'oldc','_0x4b40ee':'oldd',
 '_0x2425f6':'A','_0x5a0a54':'B','_0x11f8e4':'C','_0x5e94d':'D','_0x272027':'I',
 '_0x478ca7':'wordsToStr','_0x65c5dc':'words','_0x4450fa':'decG','_0x1e1844':'out',
 '_0x50243b':'nBits','_0x1c9614':'bi',
 '_0x465e9c':'strToWords','_0x8fb488':'str2','_0x527abf':'decH','_0x312bc4':'words2',
 '_0x3fcaa7':'wi','_0x4aa11d':'nBits2',
 '_0x1f4dda':'binStrToHex','_0x5006d2':'binStr2','_0xf53a40':'decI','_0xfee00e':'code',
 '_0x2bb9ea':'hexTab','_0x42cfc8':'hex','_0x5eadd1':'hi',
 '_0x578fac':'utf8Encode','_0x5bd628':'str3','_0x2221e2':'md5','_0x17852e':'str4',
 '_0x44beee':'hmacMD5','_0x1fc2d3':'key','_0x4692ce':'data','_0x21163c':'key2','_0x4dcf0d':'data2',
 '_0x42c2c0':'decJ','_0x1342d4':'padI','_0x1dd04b':'keyWords','_0x529fbe':'ipad','_0x408934':'opad',
 '_0x565c8f':'e6',
}
missing=sorted(set(re.findall(r'_0x[0-9a-fA-F]+',s))-set(M))
if missing: print("UNMAPPED:",missing); sys.exit(1)
# collision check on new names
news=list(M.values())
dups={n for n in news if news.count(n)>1}
if dups: print("DUP NEW NAMES:",dups); sys.exit(1)

def build(src, decname, md5n, hmacn, hexn):
    st=src.index('function %s('%decname if False else 0)
    return None

def extract(src, start_pat, end_pat, stub_name, md5n, hmacn, hexn):
    a=src.index(start_pat); b=src.index(end_pat)
    body=src[a:b]
    js=("var %s=function(){return '';};\n"%stub_name)+body+ \
       "\nmodule.exports={md5:%s,hmac:%s,hex:%s};\n"%(md5n,hmacn,hexn)
    return js

os.makedirs('.probe/md5test',exist_ok=True)
# --- A: original ---
jsA=extract(s,'function _0x7a98(','try{return _0x1f4dda(','_0x4848','_0x2221e2','_0x44beee','_0x1f4dda')
open('.probe/md5test/orig.js','w',encoding='utf8').write(jsA)
# --- rename ---
out=re.sub(r'_0x[0-9a-fA-F]+', lambda m: M.get(m.group(0), m.group(0)), s)
out=out.replace('XgXwpS','initialized').replace('fddriw','b64Decode')
out=out.replace('function r(){','function getFingerprint(){').replace('return r();','return getFingerprint();')
open(DST,'w',encoding='utf8').write(out)
# --- B: renamed ---
jsB=extract(out,'function add32(','try{return binStrToHex(','decodeStr','md5','hmacMD5','binStrToHex')
open('.probe/md5test/renamed.js','w',encoding='utf8').write(jsB)
print("written",DST,len(out),"orig-body",len(jsA),"renamed-body",len(jsB))