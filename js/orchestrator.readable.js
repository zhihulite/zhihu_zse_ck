'use strict';
// ============================================================================
// js/orchestrator.readable.js -- readable model of the 950-word CVM program
// (知乎 __zse_ck v4 orchestration layer), rewritten from js/cvm.decompiled.js.
//
// No registers, no pc, no switch: just the algorithm the VM expresses.
// Behaviour-verified against js/cvm.decompiled.js under two environments
// (full-capability and stripped) -- __c.qh comes out byte-identical.
//
// Pipeline:
//   sandbox accessor (Proxy over window) -> capability masks -> XOR-chain encrypt
//   -> fingerprint MD5 -> XOR-chain encrypt -> __c.qh = e1 + U+200E + e2
//   -> anti-tamper gauntlet (any hit returns 5) -> return 10
// ============================================================================

const KEY_A = '6a6cb1bb3970bae6';   // D[53]
const KEY_B = '44ae0b7a68bf0f7a';   // D[55]
const SEP = 8206;                   // D[72] source -> String.fromCharCode(8206) = U+200E

// instrs 877..949: the entry-877 sub-frame. Rolling XOR with the chain state kept in
// __b.a3, which therefore evolves across calls -- that is the anti-replay nonce.
function xorChain(plain, key, b) {
  let prev = b.a3, out = '';
  for (let i = 0; i < plain.length; i++) {
    prev = plain.charCodeAt(i) ^ key.charCodeAt(i % key.length) ^ prev;
    out += String.fromCharCode(prev);
  }
  b.a3 = prev;
  return out;
}

// instrs 7..43 / 742..760: the program's own accessor box, used as a Proxy handler so
// every global read goes through a JS-level getter (and can itself be integrity-checked).
function makeAccessorBox() {
  const box = new Object();
  box.get = new Function('a', 'b', 'return b in a ? a[b]: undefined');
  box.set = new Function('a', 'b', 'c', 'a[b]=c;return true');
  return box;
}

// Capability probes for mask A (l[7]); each entry sets its bit when the feature is MISSING.
// `c` carries { view, F, doc, qs, SRC0 } -- exactly what the VM had live in its registers.
const MASK_A = 15;                          // pre-seeded as 1<<15 (instrs 52..55)
const PROBES_A = [
  { bit: 14, missing: (c) => new c.F(c.SRC0)() > 1 },
  { bit: 13, missing: (c) => c.qs(':defined') !== 2 },
  { bit: 12, missing: (c) => c.qs('div:not(:has(div))') !== 2 },
  { bit: 10, missing: (c) => typeof c.doc.createNodeIterator(c.doc.body).root === 'undefined' },
  { bit: 9, missing: (c) => typeof iter(c.doc).filter === 'undefined' },
  { bit: 8, missing: (c) => typeof iter(c.doc).detach === 'undefined' },
  { bit: 7, missing: (c) => typeof iter(c.doc).whatToShow === 'undefined' },
  { bit: 6, missing: (c) => typeof c.doc.createRange().cloneRange === 'undefined' },
  { bit: 5, missing: (c) => typeof rng(c.doc).cloneContents === 'undefined' },
  { bit: 4, missing: (c) => typeof rng(c.doc).collapse === 'undefined' },
  { bit: 3, missing: (c) => typeof rng(c.doc).collapsed === 'undefined' },
  { bit: 2, missing: (c) => typeof rng(c.doc).commonAncestorContainer === 'undefined' },
  { bit: 1, missing: (c) => typeof rng(c.doc).compareBoundaryPoints === 'undefined' },
  { bit: 0, missing: (c) => typeof rng(c.doc).comparePoint === 'undefined' },
];

// Capability probes for mask B (l[8]); pre-seeded as 1<<14 (instrs 60..63).
const MASK_B = 14;
const RANGE_MEMBERS = ['endOffset', 'extractContents', 'getBoundingClientRect', 'getClientRects',
  'insertNode', 'intersectsNode', 'isPointInRange', 'selectNode', 'selectNodeContents',
  'setEnd', 'setEndAfter', 'setEndBefore', 'setStart', 'setStartAfter', 'setStartBefore',
  'startContainer'];
const PROBES_B = RANGE_MEMBERS.map((n, i) => ({
  bit: 15 - i, prop: n, missing: (c) => typeof rng(c.doc)[n] === 'undefined',
}));

const iter = (doc) => doc.createNodeIterator(doc.body);
const rng = (doc) => doc.createRange();

// The anti-tamper gauntlet, instrs 741..876.  Returns 5 on any hit.
function tamperChecks(env, bvmSource) {
  const box = makeAccessorBox();
  if (box.get.toString().length > 60) return 5;              // our own getter was rewritten
  if (typeof env.__b.zh !== 'undefined') return 5;           // debugger-side channel present
  if (bvmSource.indexOf('onsol') !== -1) return 5;           // 'c'+'onsol' injected into BVM
  const stack = String(new env.Error().stack);
  if (stack.indexOf('node') !== -1) return 5;                // running under Node
  if (stack.indexOf('executeUserEntryPoint') !== -1) return 5; // running under a runner
  if (Function.prototype.constructor.toString().indexOf('native') === -1) return 5;
  if (typeof env.window.v_log !== 'undefined') return 5;     // hook logging present
  return 0;
}

// The whole orchestration program.  `env` supplies window/document/__b/__c/Error and the
// two embedded sources; returns the program's final value (10 = clean, 5 = tampered).
function orchestrate(env) {
  const { window, document, __b, __c } = env;
  const box = makeAccessorBox();
  const view = new Proxy(window, box);            // l[4]: reads through the accessor
  const F = view.Function;                        // l[5]
  const doc = view.document;                      // l[6]

  let maskA = 1 << MASK_A, maskB = 1 << MASK_B;
  const qs = new F('a', 'try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}');
  const c = { view, F, doc, qs, SRC0: env.SRC0 };
  for (const p of PROBES_A) if (p.missing(c)) maskA |= 1 << p.bit;
  for (const p of PROBES_B) if (p.missing(c)) maskB |= 1 << p.bit;

  const probePlain = maskA.toString(16) + maskB.toString(16);        // l[20]
  const enc1 = xorChain(probePlain, KEY_A, __b);                     // l[20] := E(l[20])
  const fpMd5 = new F(env.SRC_FP)();                                 // l[22] := fingerprint MD5
  const enc2 = xorChain(fpMd5, KEY_B, __b);                          // l[22] := E(l[22])
  __c.qh = enc1 + String.fromCharCode(SEP) + enc2;                   // instrs 730..740

  const rc = tamperChecks(env, String(env.BVM));
  return rc ? rc : 10;
}

module.exports = { orchestrate, xorChain, makeAccessorBox, KEY_A, KEY_B, SEP,
  PROBES_A, PROBES_B };
