# VM built-in microcode capture (build cf2303a7, 2026-10-04)

__g (VM instance) keys: A,i,h,l,t,X,R,F,B,D,V,U,H,C,W,G,g,S,Y,M,T,z,N,Z,k,p,J,o,O,L,ck,I,copyBytesToGo

- T = 272 micro-op IDs (per-build permutation; semantics live in the class dispatch)
- M = [0,4,11,16,72,86,90,97,112,163,178,193,198,202,205,211] (stable across builds)
- methods on instance: G (Date.now native), z (run loop = range-ISA dispatch),
  N (loader/runner), copyBytesToGo (wasm_exec bridge)
- copyBytesToGo(args) := child = new VM(); child.l = parentL; child.l[4] = args;
  child.Z(251, parentB, parentG, parentD); return child.A[3]
  => the wasm_exec SERVICE = built-in microcode entry pc 251
- ck (fresh 132-char token body) minted and stored ON the instance by the service