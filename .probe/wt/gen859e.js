const wabtInit = require('wabt');
const fs = require('fs');
(async () => {
  const wabt = await wabtInit();
  const buf = fs.readFileSync('.probe/build-859e.wasm');
  const mod = wabt.readWasm(new Uint8Array(buf), { readDebugNames: true });
  mod.generateNames();
  mod.applyNames();
  const wat = mod.toText({ foldExprs: false, inlineExport: false });
  fs.writeFileSync('.probe/wt/zse859e.wat', wat);
  console.log('WAT bytes:', wat.length);
})();