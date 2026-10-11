const zse = require('./build/Release/zseenv.node');
zse.installNativeToString();
zse.registerNative(setTimeout, 'setTimeout');
const d = Object.getOwnPropertyDescriptor(setTimeout, '__zseNativeName');
console.log('注册表属性 descriptor:', JSON.stringify(d));
console.log('直读 setTimeout.__zseNativeName =', JSON.stringify(setTimeout.__zseNativeName));
console.log('该属性是自有属性?', Object.prototype.hasOwnProperty.call(setTimeout, '__zseNativeName'));
console.log('直调 Function.prototype.toString.call(setTimeout) 前 60:', Function.prototype.toString.call(setTimeout).slice(0,60));