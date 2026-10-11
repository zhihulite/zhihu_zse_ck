// 求值 payload 层的「自动化工具」探测（全部应返回 'undefined'）
const vm = require('vm');
const { createEnv } = require('./handenv.js');
const sandbox = createEnv();
sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox, { name: 'auto' });
for (const k of ['Object','Array','String','Math','JSON','Function','Proxy','Reflect','Symbol','Date','RegExp']) {
  if (sandbox[k] === undefined) { try { sandbox[k] = vm.runInContext(k, ctx); } catch (e) {} }
}
const PROPS = ['callPhantom','__phantomas','_phantom','WebPage','fxdriver_id','__fxdriver_unwrapped',
               'ubot','CasperError','casper','patchRequire','$cdc_asdjflasutopfhvcZLmcfl_','webdriver',
               '__webdriver_script_fn','_resourceLoader','_sessionHistory','_virtualConsole',
               'buffer','emit','__nightmare','domAutomation','domAutomationController','_selenium',
               'callSelenium','__selenium_unwrapped','__webdriver_evaluate','__driver_evaluate',
               '__selenium_evaluate','__webdriver_script_func','_WEBDRIVER_ELEM_CACHE','cdc_adoQpoasnfa76pfcZLmcfl_'];
const js = `(function(){
  var out = [];
  ${JSON.stringify(PROPS)}.forEach(function(p){
    var t;
    try { t = typeof window[p]; } catch (e) { t = 'THROW'; }
    if (t !== 'undefined') out.push(p + ' = ' + t);
  });
  return JSON.stringify(out);
})()`;
const hits = JSON.parse(vm.runInContext(js, ctx));
console.log('自动化类属性命中 %d 条（真实浏览器应为 0）:' % hits.length);
hits.forEach(h => console.log('   ', h));
if (!hits.length) console.log('   （无命中）');