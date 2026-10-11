# 位图守卫映射（由 js/*.restored.js 抽出）

共 134 条置位点（去重后 119 位）。

| 层 | 函数 | 位图字 | 位 | 置位条件 |
|---|---|---|---|---|
| cvm | FR_0 | w10 | 0 | `typeof v18?.comparePoint === "undefined"` |
| cvm | FR_0 | w10 | 1 | `typeof v18?.compareBoundaryPoints === "undefined"` |
| cvm | FR_0 | w10 | 2 | `typeof v18?.commonAncestorContainer === "undefined"` |
| cvm | FR_0 | w10 | 3 | `typeof v18?.collapsed === "undefined"` |
| cvm | FR_0 | w10 | 4 | `typeof v18?.collapse === "undefined"` |
| cvm | FR_0 | w10 | 5 | `typeof v18?.cloneContents === "undefined"` |
| cvm | FR_0 | w10 | 6 | `typeof v6.createRange()?.cloneRange === "undefined"` |
| cvm | FR_0 | w10 | 7 | `typeof v17?.whatToShow === "undefined"` |
| cvm | FR_0 | w10 | 8 | `typeof v17?.detach === "undefined"` |
| cvm | FR_0 | w10 | 9 | `typeof v17?.filter === "undefined"` |
| cvm | FR_0 | w10 | 10 | `typeof v6.createNodeIterator(v6?.body)?.root === "undefined"` |
| cvm | FR_0 | w10 | 12 | `v14("div:not(:has(div))") !== 2` |
| cvm | FR_0 | w10 | 13 | `new v5("a", "try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}")(":defined") !== 2` |
| cvm | FR_0 | w10 | 14 | `new (new Proxy(window, H1)?.Function)(SRC0)() > 1` |
| cvm | FR_0 | w11 | 0 | `typeof v18?.startContainer === "undefined"` |
| cvm | FR_0 | w11 | 1 | `typeof v18?.setStartBefore === "undefined"` |
| cvm | FR_0 | w11 | 2 | `typeof v18?.setStartAfter === "undefined"` |
| cvm | FR_0 | w11 | 3 | `typeof v18?.setStart === "undefined"` |
| cvm | FR_0 | w11 | 4 | `typeof v18?.setEndBefore === "undefined"` |
| cvm | FR_0 | w11 | 5 | `typeof v18?.setEndAfter === "undefined"` |
| cvm | FR_0 | w11 | 6 | `typeof v18?.setEnd === "undefined"` |
| cvm | FR_0 | w11 | 7 | `typeof v18?.selectNodeContents === "undefined"` |
| cvm | FR_0 | w11 | 8 | `typeof v18?.selectNode === "undefined"` |
| cvm | FR_0 | w11 | 9 | `typeof v18?.isPointInRange === "undefined"` |
| cvm | FR_0 | w11 | 10 | `typeof v18?.intersectsNode === "undefined"` |
| cvm | FR_0 | w11 | 11 | `typeof v18?.getClientRects === "undefined"` |
| cvm | FR_0 | w11 | 11 | `typeof v18?.insertNode === "undefined"` *(重复)* |
| cvm | FR_0 | w11 | 12 | `typeof v18?.getBoundingClientRect === "undefined"` |
| cvm | FR_0 | w11 | 13 | `typeof v18?.extractContents === "undefined"` |
| cvm | FR_0 | w11 | 15 | `typeof v18?.endOffset === "undefined"` |
| inner | FR_0 | w5 | 0 | `typeof new XMLHttpRequest() === "undefined"` |
| inner | FR_0 | w5 | 1 | `typeof history?.replaceState !== "function"` |
| inner | FR_0 | w5 | 2 | `typeof window?.name === "undefined"` |
| inner | FR_0 | w5 | 3 | `typeof window?.globalThis === "undefined"` |
| inner | FR_0 | w5 | 4 | `typeof window?.find === "undefined"` |
| inner | FR_0 | w5 | 5 | `(window?.XMLDocument).toString().indexOf("native") === -1` |
| inner | FR_0 | w5 | 6 | `typeof history?.pushState !== "function"` |
| inner | FR_0 | w5 | 7 | `typeof window?.self === "undefined"` |
| inner | FR_0 | w5 | 8 | `(window?.blur).toString().indexOf("native") === -1` |
| inner | FR_0 | w5 | 9 | `typeof window?.blur === "undefined"` |
| inner | FR_0 | w5 | 10 | `typeof window?.devicePixelRatio === "undefined"` |
| inner | FR_0 | w5 | 11 | `typeof v9?.hostname === "undefined"` |
| inner | FR_0 | w5 | 12 | `typeof v9?.host === "undefined"` |
| inner | FR_0 | w5 | 13 | `(v9?.toString).toString().indexOf("native") === -1` |
| inner | FR_0 | w5 | 14 | `location.toString().indexOf("zhihu") === -1` |
| inner | FR_0 | w6 | 0 | `typeof v10?.timeout === "undefined"` |
| inner | FR_0 | w6 | 1 | `typeof v10?.responseXML === "undefined"` |
| inner | FR_0 | w6 | 2 | `typeof v10?.onabort === "undefined"` |
| inner | FR_0 | w6 | 3 | `typeof v10?.onabort === "undefined"` |
| inner | FR_0 | w6 | 4 | `typeof v10?.status === "undefined"` |
| inner | FR_0 | w6 | 5 | `typeof v10?.onreadystatechange === "undefined"` |
| inner | FR_0 | w6 | 6 | `typeof v10?.responseURL === "undefined"` |
| inner | FR_0 | w6 | 7 | `typeof v10?.upload === "undefined"` |
| inner | FR_0 | w6 | 8 | `typeof v10?.send === "undefined"` |
| inner | FR_0 | w6 | 9 | `typeof v10?.open === "undefined"` |
| inner | FR_0 | w6 | 10 | `typeof v10?.abort === "undefined"` |
| inner | FR_0 | w6 | 11 | `typeof v10?.UNSENT === "undefined"` |
| inner | FR_0 | w6 | 12 | `typeof v10?.OPENED === "undefined"` |
| inner | FR_0 | w6 | 13 | `typeof v10?.DONE === "undefined"` |
| inner | FR_0 | w6 | 14 | `typeof v10?.LOADING === "undefined"` |
| payload | FR_0 | w1 | 0 | `v20 < 4` |
| payload | FR_0 | w1 | 1 | `typeof new new Proxy(Function, v8)("try{window={};document={};return document.all()}catch(_){}")() !== "object"` |
| payload | FR_0 | w1 | 2 | `typeof v18?.length !== "number"` |
| payload | FR_0 | w1 | 3 | `typeof v16?.all !== "undefined"` |
| payload | FR_0 | w1 | 4 | `(new new Proxy(Function, v8)("window={};document={};return document")()?.URL).indexOf("zhihu") === -1` |
| payload | FR_0 | w1 | 5 | `v12.indexOf("__g") === -1` |
| payload | FR_0 | w1 | 6 | `v12.indexOf("_encrypt") === -1` |
| payload | FR_0 | w1 | 7 | `v12.indexOf("open") === -1` |
| payload | FR_0 | w1 | 8 | `v12.indexOf("print") === -1` |
| payload | FR_0 | w1 | 9 | `v12.indexOf("self") === -1` |
| payload | FR_0 | w1 | 10 | `v12.indexOf("name") === -1` |
| payload | FR_0 | w1 | 11 | `v12.indexOf("customElements") === -1` |
| payload | FR_0 | w1 | 12 | `v12.indexOf("top") === -1` |
| payload | FR_0 | w1 | 14 | `v13 === 1` |
| payload | FR_0 | w1 | 15 | `Object.keys(new Proxy(window, H1)) < 40` |
| payload | FR_0 | w2 | 0 | `v30.toString().indexOf("HTMLCanvasElement") === -1` |
| payload | FR_0 | w2 | 1 | `typeof v25("canvas") === "undefined"` |
| payload | FR_0 | w2 | 2 | `(document?.body).toString().indexOf("HTMLBodyElement") === -1` |
| payload | FR_0 | w2 | 3 | `typeof document?.body === "undefined"` |
| payload | FR_0 | w2 | 4 | `typeof document?.charset === "undefined"` |
| payload | FR_0 | w2 | 5 | `(document?.baseURI).indexOf("zhihu") === -1` |
| payload | FR_0 | w2 | 6 | `typeof document?.baseURI === "undefined"` |
| payload | FR_0 | w2 | 7 | `new v14(SRC1)() !== "A"` |
| payload | FR_0 | w2 | 8 | `new v14(SRC0)() !== 0` |
| payload | FR_0 | w2 | 9 | `typeof v26?.style === "undefined"` |
| payload | FR_0 | w2 | 10 | `v26?.tagName !== "SCRIPT"` |
| payload | FR_0 | w2 | 11 | `typeof (v16?.createElement).bind(v16)("script") === "undefined"` |
| payload | FR_0 | w2 | 13 | `v23.getElementsByTagName("script").toString().indexOf("Collection") === -1` |
| payload | FR_0 | w2 | 14 | `v23.toString().indexOf("HTMLHtmlElement") === -1` |
| payload | FR_0 | w2 | 15 | `v18?.[0]?.tagName !== "HTML"` |
| payload | FR_0 | w3 | 0 | `v36 === 1` |
| payload | FR_0 | w3 | 1 | `v34 === 1` |
| payload | FR_0 | w3 | 2 | `v33 === 1` |
| payload | FR_0 | w3 | 3 | `typeof localStorage?.setItem === "undefined"` |
| payload | FR_0 | w3 | 4 | `typeof v11?._resourceLoader !== "undefined"` |
| payload | FR_0 | w3 | 4 | `typeof v11?._sessionHistory !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 4 | `typeof v11?._virtualConsole !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 5 | `typeof window?.callPhantom !== "undefined"` |
| payload | FR_0 | w3 | 5 | `typeof window?.__phantomas !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 5 | `typeof window?._phantom !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 5 | `typeof window?.WebPage !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 5 | `typeof window?.fxdriver_id !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 5 | `typeof window?.__fxdriver_unwrapped !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 5 | `typeof window?.ubot !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 5 | `typeof window?.CasperError !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 5 | `typeof window?.casper !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 5 | `typeof window?.patchRequire !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 5 | `typeof document?.$cdc_asdjflasutopfhvcZLmcfl_ !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 5 | `navigator?.webdriver === "true"` *(重复)* |
| payload | FR_0 | w3 | 5 | `typeof document?.__webdriver_script_fn !== "undefined"` *(重复)* |
| payload | FR_0 | w3 | 6 | `typeof window?.emit !== "undefined"` |
| payload | FR_0 | w3 | 7 | `typeof window?.buffer !== "undefined"` |
| payload | FR_0 | w3 | 8 | `v30.toDataURL()?.length < 50` |
| payload | FR_0 | w3 | 9 | `(v30?.outerHTML).indexOf("canvas") === -1` |
| payload | FR_0 | w3 | 10 | `v30?.tagName !== "CANVAS"` |
| payload | FR_0 | w3 | 11 | `typeof v30?.height === "undefined"` |
| payload | FR_0 | w3 | 12 | `typeof v30?.width === "undefined"` |
| payload | FR_0 | w3 | 13 | `v30.getContext("2d").toString().indexOf("CanvasRenderingContext2D") === -1` |
| payload | FR_0 | w3 | 14 | `typeof v30?.getContext === "undefined"` |
| payload | FR_0 | w4 | 0 | `window?.top !== window` |
| payload | FR_0 | w4 | 1 | `new v14(window.atob("cmV0dXJuIHdpbmRvdy5NZWRpYVNvdXJjZSAmJiB3aW5kb3cuTWVkaWFTb3VyY2UuaXNUeXBlU3VwcG9ydGVkICYmIHdpbmRvdy5NZWRpYVNvdXJjZS5pc1R5cGVTdXBwb3J0ZWQoJ3ZpZGVvL21wNDsgY29kZWNzPSJhdmMxLjQyRTAxRSInKQ=="))() !== "true"` |
| payload | FR_0 | w4 | 2 | `(window?.stop).toString().indexOf("native") === -1` |
| payload | FR_0 | w4 | 3 | `typeof new (window?.URL)("https://www.zhihu.com") === "undefined"` |
| payload | FR_0 | w4 | 4 | `setInterval.toString().indexOf("native") === -1` |
| payload | FR_0 | w4 | 5 | `setTimeout.toString().indexOf("native") === -1` |
| payload | FR_0 | w4 | 6 | `typeof window?.global !== "undefined"` |
| payload | FR_0 | w4 | 7 | `window?.document !== v16` |
| payload | FR_0 | w4 | 8 | `typeof new v14("try{return global}catch(_){}")() !== "undefined"` |
| payload | FR_0 | w4 | 9 | `typeof new v14("try{return process}catch(_){}")() !== "undefined"` |
| payload | FR_0 | w4 | 10 | `v40.toString().indexOf("HTMLAllCollection") === -1` |
| payload | FR_0 | w4 | 11 | `typeof new v14("try{return new Document().all()}catch(_){}")() === "undefined"` |
| payload | FR_0 | w4 | 12 | `typeof v40?.length !== "number"` |
| payload | FR_0 | w4 | 13 | `typeof new Document()?.all !== "undefined"` |
| payload | FR_0 | w4 | 15 | `new v14("try{var a=0;var b=new Error;Object.defineProperty(b,\"stack\",{get:function(){a++}});console.debug(b);b.stack;return a>1}catch(_){return true}")()` |
