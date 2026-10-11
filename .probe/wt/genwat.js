// 通用 WAT 生成器: node genwat.js <wasm> <out.wat>
const wabtInit = require('wabt');
const fs = require('fs');
(async () => {
  const wabt = await wabtInit();
  const buf = fs.readFileSync(process.argv[2]);
  const mod = wabt.readWasm(new Uint8Array(buf), { readDebugNames: true });
  mod.generateNames(); mod.applyNames();
  const wat = mod.toText({ foldExprs: false, inlineExport: false });
  fs.writeFileSync(process.argv[3], wat);
  console.log('WAT bytes:', wat.length);
})();
