// 24-bit jsvmp disassembler using the operand field layout FITTED FROM GROUND TRUTH:
//   outer words (.probe/map/blob_program_new.json) x outer verified listing
//   (.probe/map/full_disasm_new.txt) -- that listing is the one whose devirtualized output
//   reproduces the live browser's 43-byte qh byte-for-byte (见 docs/BITMAP.md), so the field
//   positions derived from it are evidence, not guesses.  The inner VM's leaf bodies
//   (.probe/bvm-ops-live.json: P/Z=>>16&7, T=>>13&7, O=>>10&7, K/N=>>0..) agree.
//
//   op  name    layout
//   0   RESET   -
//   1   LOAD    A[w>>15&7] = (w>>18&1) ? l[w>>0&32767] : #w>>0&32767
//   2   STORE   l[w>>0&65535] = A[w>>16&7]
//   3   ALU     A[w>>16&7] = A[w>>13&7] <op w>>0&1023> A[w>>10&7]
//   4   CALL    i = A[w>>16&7], argc = w>>0&65535, +frame
//   5   RET     -
//   6   CMP     F = A[w>>16&7]
//   7   JMP     cond = w>>0&3, target = w>>2&32767
//   8   INVOKE  A[3] = A[w>>16&7][..](args)   kind = w>>0&3 (0 call, 1 method, 2 new)
//                                        argc = w>>2&4095      <- destination is FIXED to 3
//   9   PUSH    kind = w>>17&7 (4 -> A[w>>14&7], 7 -> dec(D[w>>0&16383]))
//   10  MEMBER  kind = w>>17&3 (get/set/eval), A[w>>14&7]/A[w>>11&7]
//   11  LOADC   A[w>>16&7] = dec(D[w>>0&65535])
'use strict';
const fs = require('fs');
const W = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const f = (w, sh, m) => (w >> sh) & m;
const ALU = ['+', '-', '*', '/', '%', '==', '>=', '||', '&&', '!==', 'typeof', 'in', '>',
  'neg', '<', '&', '^', '<<', '>>>', '|', 'not', '<=', '>>', '&=', '~'];
const out = [];
let unknown = 0;
W.forEach((w, pc) => {
  const op = w >> 19;
  let s;
  switch (op) {
    case 0: s = 'RESET'; break;
    case 1: s = `A[${f(w, 15, 7)}] = ${f(w, 18, 1) ? 'l[' + f(w, 0, 32767) + ']' : '#' + f(w, 0, 32767)}`; break;
    case 2: s = `l[${f(w, 0, 65535)}] = A[${f(w, 16, 7)}]`; break;
    case 3: { const k = f(w, 0, 1023); s = `A[${f(w, 16, 7)}] = A[${f(w, 13, 7)}] ${ALU[k] || 'OP' + k} A[${f(w, 10, 7)}]`; if (k >= ALU.length) unknown++; break; }
    case 4: s = `CALL i=A[${f(w, 16, 7)}] argc=${f(w, 0, 65535)} +frame`; break;
    case 5: s = 'RET'; break;
    case 6: s = `F = A[${f(w, 16, 7)}]`; break;
    case 7: s = `JMP[${f(w, 0, 3)}] ${f(w, 2, 32767)}`; break;
    case 8: {
      const k = f(w, 0, 3), argc = f(w, 2, 4095), o = f(w, 16, 7);
      s = k === 0 ? `A[3] = A[${o}]() argc=${argc}`
        : k === 1 ? `A[3] = A[${o}][m]() argc=${argc}`
          : k === 2 ? `A[3] = A[${o}]new argc=${argc}`
            : `A[3] = A[${o}]??${k}() argc=${argc}`;
      if (k > 2) unknown++;
      break;
    }
    case 9: {
      const k = f(w, 17, 7);
      s = k === 4 ? `PUSH A[${f(w, 14, 7)}]`
        : k === 7 ? `PUSH dec(D[${f(w, 0, 16383)}])`
          : `PUSH??${k} x${f(w, 0, 16383)}`;
      if (k !== 4 && k !== 7) unknown++;
      break;
    }
    case 10: {
      const k = f(w, 17, 3);
      s = `MEMBER.${['get', 'set', 'eval'][k] || 'op' + k} A[${f(w, 14, 7)}]/A[${f(w, 11, 7)}]`;
      if (k > 2) unknown++;
      break;
    }
    case 11: s = `A[${f(w, 16, 7)}] = dec(D[${f(w, 0, 65535)}])`; break;
    case 12: s = `SETEXC ${f(w, 0, 65535)}`; break;
    case 13: s = `THROW A[${f(w, 16, 7)}]`; break;
    case 14: s = `CLOSURE G=${f(w, 0, 65535)}`; break;
    default: s = `?op${op} 0x${w.toString(16)}`; unknown++;
  }
  out.push(String(pc).padStart(5) + '  ' + s);
});
fs.writeFileSync(process.argv[3], out.join('\n') + '\n');
console.log('words=%d  unknown-encodings=%d  -> %s', W.length, unknown, process.argv[3]);
