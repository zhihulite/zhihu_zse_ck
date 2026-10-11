const zse = require('./build/Release/zseenv.node');
const d0 = Object.getOwnPropertyDescriptor(Function.prototype, 'toString');
console.log('替换前 descriptor:', JSON.stringify(d0 && {w:d0.writable, e:d0.enumerable, c:d0.configurable}));
const before = Function.prototype.toString;
const newFn = zse.installNativeToString();
console.log('返回值 newFn 是函数?', typeof newFn);
console.log('替换后 Function.prototype.toString === newFn ?', Function.prototype.toString === newFn);
console.log('替换后 Function.prototype.toString === before ?', Function.prototype.toString === before);
const d1 = Object.getOwnPropertyDescriptor(Function.prototype, 'toString');
console.log('替换后 descriptor:', JSON.stringify(d1 && {w:d1.writable, e:d1.enumerable, c:d1.configurable}));
// 直接调我那个函数，看它认不认注册表
zse.registerNative(setTimeout, 'setTimeout');
console.log('直调 newFn.call(setTimeout) =', newFn.call(setTimeout));
console.log('typeof newFn =', typeof newFn, '| newFn.name =', newFn.name);