# 环境检测清单（由 js/*.restored.js 抽出）

共 209 条守卫，去重后 **196** 条。
"置位" 列给出该守卫为真时 OR 进位图的位（w1–w6、w10–w11）；空的表示不置位。

## payload（101 条）

| 函数 | 检测条件 | 置位 |
|---|---|---|
| M_SET | `o !== undefined && o !== null` | — |
| FR_0 | `FR_1905(A, l, S) < 2` | — |
| FR_0 | `Object.keys(new Proxy(window, H1)) < 40` | w1.15 |
| FR_0 | `v13 === 1` | w1.14 |
| FR_0 | `v12.indexOf("top") === -1` | w1.12 |
| FR_0 | `v12.indexOf("customElements") === -1` | w1.11 |
| FR_0 | `v12.indexOf("name") === -1` | w1.10 |
| FR_0 | `v12.indexOf("self") === -1` | w1.9 |
| FR_0 | `v12.indexOf("print") === -1` | w1.8 |
| FR_0 | `v12.indexOf("open") === -1` | w1.7 |
| FR_0 | `v12.indexOf("_encrypt") === -1` | w1.6 |
| FR_0 | `v12.indexOf("__g") === -1` | w1.5 |
| FR_0 | `(new new Proxy(Function, v8)("window={};document={};return document")()?.URL).indexOf("zhihu") === -1` | w1.4 |
| FR_0 | `typeof v16?.all !== "undefined"` | w1.3 |
| FR_0 | `typeof v18?.length !== "number"` | w1.2 |
| FR_0 | `typeof new new Proxy(Function, v8)("try{window={};document={};return document.all()}catch(_){}")() !== "object"` | w1.1 |
| FR_0 | `v20 < 4` | w1.0 |
| FR_0 | `v18?.[0]?.tagName !== "HTML"` | w2.15 |
| FR_0 | `v23.toString().indexOf("HTMLHtmlElement") === -1` | w2.14 |
| FR_0 | `v23.getElementsByTagName("script").toString().indexOf("Collection") === -1` | w2.13 |
| FR_0 | `typeof (v16?.createElement).bind(v16)("script") === "undefined"` | w2.11 |
| FR_0 | `v26?.tagName !== "SCRIPT"` | w2.10 |
| FR_0 | `typeof v26?.style === "undefined"` | w2.9 |
| FR_0 | `new v14(SRC0)() !== 0` | w2.8 |
| FR_0 | `new v14(SRC1)() !== "A"` | w2.7 |
| FR_0 | `typeof document?.baseURI === "undefined"` | w2.6 |
| FR_0 | `(document?.baseURI).indexOf("zhihu") === -1` | w2.5 |
| FR_0 | `typeof document?.charset === "undefined"` | w2.4 |
| FR_0 | `typeof document?.body === "undefined"` | w2.3 |
| FR_0 | `(document?.body).toString().indexOf("HTMLBodyElement") === -1` | w2.2 |
| FR_0 | `typeof v25("canvas") === "undefined"` | w2.1 |
| FR_0 | `v30.toString().indexOf("HTMLCanvasElement") === -1` | w2.0 |
| FR_0 | `typeof v30?.getContext === "undefined"` | w3.14 |
| FR_0 | `v30.getContext("2d").toString().indexOf("CanvasRenderingContext2D") === -1` | w3.13 |
| FR_0 | `typeof v30?.width === "undefined"` | w3.12 |
| FR_0 | `typeof v30?.height === "undefined"` | w3.11 |
| FR_0 | `v30?.tagName !== "CANVAS"` | w3.10 |
| FR_0 | `(v30?.outerHTML).indexOf("canvas") === -1` | w3.9 |
| FR_0 | `v30.toDataURL()?.length < 50` | w3.8 |
| FR_0 | `typeof window?.buffer !== "undefined"` | w3.7 |
| FR_0 | `typeof window?.emit !== "undefined"` | w3.6 |
| FR_0 | `typeof window?.callPhantom !== "undefined"` | w3.5 |
| FR_0 | `typeof window?.__phantomas !== "undefined"` | w3.5 |
| FR_0 | `typeof window?._phantom !== "undefined"` | w3.5 |
| FR_0 | `typeof window?.WebPage !== "undefined"` | w3.5 |
| FR_0 | `typeof window?.fxdriver_id !== "undefined"` | w3.5 |
| FR_0 | `typeof window?.__fxdriver_unwrapped !== "undefined"` | w3.5 |
| FR_0 | `typeof window?.ubot !== "undefined"` | w3.5 |
| FR_0 | `typeof window?.CasperError !== "undefined"` | w3.5 |
| FR_0 | `typeof window?.casper !== "undefined"` | w3.5 |
| FR_0 | `typeof window?.patchRequire !== "undefined"` | w3.5 |
| FR_0 | `typeof document?.$cdc_asdjflasutopfhvcZLmcfl_ !== "undefined"` | w3.5 |
| FR_0 | `navigator?.webdriver === "true"` | w3.5 |
| FR_0 | `typeof document?.__webdriver_script_fn !== "undefined"` | w3.5 |
| FR_0 | `typeof v11?._resourceLoader !== "undefined"` | w3.4 |
| FR_0 | `typeof v11?._sessionHistory !== "undefined"` | w3.4 |
| FR_0 | `typeof v11?._virtualConsole !== "undefined"` | w3.4 |
| FR_0 | `typeof localStorage?.setItem === "undefined"` | w3.3 |
| FR_0 | `F` | — |
| FR_0 | `v33 === 1` | w3.2 |
| FR_0 | `v34 === 1` | w3.1 |
| FR_0 | `v36 === 1` | w3.0 |
| FR_0 | `new v14("try{var a=0;var b=new Error;Object.defineProperty(b,\"stack\",{get:function(){a++}});console.debug(b);b.stack;return a>1}catch(_){return true}")()` | w4.15 |
| FR_0 | `typeof new Document()?.all !== "undefined"` | w4.13 |
| FR_0 | `typeof v40?.length !== "number"` | w4.12 |
| FR_0 | `typeof new v14("try{return new Document().all()}catch(_){}")() === "undefined"` | w4.11 |
| FR_0 | `v40.toString().indexOf("HTMLAllCollection") === -1` | w4.10 |
| FR_0 | `typeof new v14("try{return process}catch(_){}")() !== "undefined"` | w4.9 |
| FR_0 | `typeof new v14("try{return global}catch(_){}")() !== "undefined"` | w4.8 |
| FR_0 | `window?.document !== v16` | w4.7 |
| FR_0 | `typeof window?.global !== "undefined"` | w4.6 |
| FR_0 | `setTimeout.toString().indexOf("native") === -1` | w4.5 |
| FR_0 | `setInterval.toString().indexOf("native") === -1` | w4.4 |
| FR_0 | `typeof new (window?.URL)("https://www.zhihu.com") === "undefined"` | w4.3 |
| FR_0 | `(window?.stop).toString().indexOf("native") === -1` | w4.2 |
| FR_0 | `new v14(window.atob("cmV0dXJuIHdpbmRvdy5NZWRpYVNvdXJjZSAmJiB3aW5kb3cuTWVkaWFTb3VyY2UuaXNUeXBlU3VwcG9ydGVkICYmIHdpbmRvdy5NZWRpYVNvdXJjZS5pc1R5cGVTdXBwb3J0ZWQoJ3ZpZGVvL21wNDsgY29kZWNzPSJhdmMxLjQyRTAxRSInKQ=="))() !== "true"` | w4.1 |
| FR_0 | `window?.top !== window` | w4.0 |
| FR_0 | `!v0?.length` | — |
| FR_1905 | `!((H2?.["get"]).toString()?.length > 60)` | — |
| FR_1905 | `!(typeof __b?.zh !== "undefined")` | — |
| FR_1905 | `!(v73.indexOf("onsol") !== -1)` | — |
| FR_1905 | `!((new Error()?.stack).indexOf("node") !== -1)` | — |
| FR_1905 | `!(v60.indexOf("executeUserEntryPoint") !== -1)` | — |
| FR_1905 | `!((Function?.prototype?.constructor).toString().indexOf("native") === -1)` | — |
| FR_1905 | `!(typeof window?.v_log !== "undefined")` | — |
| FR_2039 | `!(v0 < 1)` | — |
| FR_2039 | `!(v0.getItem("zseCk") !== "zseCk")` | — |
| FR_2079 | `!(v0.indexOf("document") === -1)` | — |
| FR_2079 | `!(v0.indexOf("location") === -1)` | — |
| FR_2079 | `!(v0.indexOf("screen") === -1)` | — |
| FR_2079 | `!(v0.indexOf("history") === -1)` | — |
| FR_2079 | `!(v0.indexOf("navigator") === -1)` | — |
| FR_2146 | `!(typeof v0?.width === "undefined")` | — |
| FR_2146 | `!(typeof v0?.height === "undefined")` | — |
| FR_2146 | `!(typeof v0?.availHeight === "undefined")` | — |
| FR_2146 | `!(typeof v0?.availWidth === "undefined")` | — |
| FR_2146 | `!(typeof v0?.colorDepth === "undefined")` | — |
| FR_2146 | `!(typeof screen?.pixelDepth === "undefined")` | — |
| FR_2146 | `!(typeof screen?.availLeft === "undefined")` | — |
| FR_2227 | `!(Math.random() + Math.random() + Math.random() === Math.random() * 3)` | — |
| null | `typeof module !== "undefined"` | — |

## inner（41 条）

| 函数 | 检测条件 | 置位 |
|---|---|---|
| M_SET | `o !== undefined && o !== null` | — |
| FR_0 | `FR_735(A, l, S) > 4` | — |
| FR_0 | `location.toString().indexOf("zhihu") === -1` | w5.14 |
| FR_0 | `(v9?.toString).toString().indexOf("native") === -1` | w5.13 |
| FR_0 | `typeof v9?.host === "undefined"` | w5.12 |
| FR_0 | `typeof v9?.hostname === "undefined"` | w5.11 |
| FR_0 | `typeof window?.devicePixelRatio === "undefined"` | w5.10 |
| FR_0 | `typeof window?.blur === "undefined"` | w5.9 |
| FR_0 | `(window?.blur).toString().indexOf("native") === -1` | w5.8 |
| FR_0 | `typeof window?.self === "undefined"` | w5.7 |
| FR_0 | `typeof history?.pushState !== "function"` | w5.6 |
| FR_0 | `(window?.XMLDocument).toString().indexOf("native") === -1` | w5.5 |
| FR_0 | `typeof window?.find === "undefined"` | w5.4 |
| FR_0 | `typeof window?.globalThis === "undefined"` | w5.3 |
| FR_0 | `typeof window?.name === "undefined"` | w5.2 |
| FR_0 | `typeof history?.replaceState !== "function"` | w5.1 |
| FR_0 | `typeof new XMLHttpRequest() === "undefined"` | w5.0 |
| FR_0 | `typeof v10?.LOADING === "undefined"` | w6.14 |
| FR_0 | `typeof v10?.DONE === "undefined"` | w6.13 |
| FR_0 | `typeof v10?.OPENED === "undefined"` | w6.12 |
| FR_0 | `typeof v10?.UNSENT === "undefined"` | w6.11 |
| FR_0 | `typeof v10?.abort === "undefined"` | w6.10 |
| FR_0 | `typeof v10?.open === "undefined"` | w6.9 |
| FR_0 | `typeof v10?.send === "undefined"` | w6.8 |
| FR_0 | `typeof v10?.upload === "undefined"` | w6.7 |
| FR_0 | `typeof v10?.responseURL === "undefined"` | w6.6 |
| FR_0 | `typeof v10?.onreadystatechange === "undefined"` | w6.5 |
| FR_0 | `typeof v10?.status === "undefined"` | w6.4 |
| FR_0 | `typeof v10?.onabort === "undefined"` | w6.3, w6.2 |
| FR_0 | `typeof v10?.responseXML === "undefined"` | w6.1 |
| FR_0 | `typeof v10?.timeout === "undefined"` | w6.0 |
| FR_0 | `!((H1?.["get"]).toString()?.length > 60)` | — |
| FR_0 | `!(typeof __b?.zh !== "undefined")` | — |
| FR_0 | `!(v13.indexOf("onsol") !== -1)` | — |
| FR_0 | `!((new Error()?.stack).indexOf("node") !== -1)` | — |
| FR_0 | `!(v14.indexOf("executeUserEntryPoint") !== -1)` | — |
| FR_0 | `!((Function?.prototype?.constructor).toString().indexOf("native") === -1)` | — |
| FR_0 | `!(typeof window?.v_log !== "undefined")` | — |
| FR_735 | `!((H3?.["get"]).toString()?.length > 60)` | — |
| FR_869 | `!v0?.length` | — |
| null | `typeof module !== "undefined"` | — |

## cvm（41 条）

| 函数 | 检测条件 | 置位 |
|---|---|---|
| M_SET | `o !== undefined && o !== null` | — |
| FR_0 | `7 > 6` | — |
| FR_0 | `new (new Proxy(window, H1)?.Function)(SRC0)() > 1` | w10.14 |
| FR_0 | `new v5("a", "try{return !!document.querySelectorAll(a) + 1}catch(_){return 1}")(":defined") !== 2` | w10.13 |
| FR_0 | `v14("div:not(:has(div))") !== 2` | w10.12 |
| FR_0 | `typeof v6.createNodeIterator(v6?.body)?.root === "undefined"` | w10.10 |
| FR_0 | `typeof v17?.filter === "undefined"` | w10.9 |
| FR_0 | `typeof v17?.detach === "undefined"` | w10.8 |
| FR_0 | `typeof v17?.whatToShow === "undefined"` | w10.7 |
| FR_0 | `typeof v6.createRange()?.cloneRange === "undefined"` | w10.6 |
| FR_0 | `typeof v18?.cloneContents === "undefined"` | w10.5 |
| FR_0 | `typeof v18?.collapse === "undefined"` | w10.4 |
| FR_0 | `typeof v18?.collapsed === "undefined"` | w10.3 |
| FR_0 | `typeof v18?.commonAncestorContainer === "undefined"` | w10.2 |
| FR_0 | `typeof v18?.compareBoundaryPoints === "undefined"` | w10.1 |
| FR_0 | `typeof v18?.comparePoint === "undefined"` | w10.0 |
| FR_0 | `typeof v18?.endOffset === "undefined"` | w11.15 |
| FR_0 | `typeof v18?.extractContents === "undefined"` | w11.13 |
| FR_0 | `typeof v18?.getBoundingClientRect === "undefined"` | w11.12 |
| FR_0 | `typeof v18?.getClientRects === "undefined"` | w11.11 |
| FR_0 | `typeof v18?.insertNode === "undefined"` | w11.11 |
| FR_0 | `typeof v18?.intersectsNode === "undefined"` | w11.10 |
| FR_0 | `typeof v18?.isPointInRange === "undefined"` | w11.9 |
| FR_0 | `typeof v18?.selectNode === "undefined"` | w11.8 |
| FR_0 | `typeof v18?.selectNodeContents === "undefined"` | w11.7 |
| FR_0 | `typeof v18?.setEnd === "undefined"` | w11.6 |
| FR_0 | `typeof v18?.setEndAfter === "undefined"` | w11.5 |
| FR_0 | `typeof v18?.setEndBefore === "undefined"` | w11.4 |
| FR_0 | `typeof v18?.setStart === "undefined"` | w11.3 |
| FR_0 | `typeof v18?.setStartAfter === "undefined"` | w11.2 |
| FR_0 | `typeof v18?.setStartBefore === "undefined"` | w11.1 |
| FR_0 | `typeof v18?.startContainer === "undefined"` | w11.0 |
| FR_0 | `!(({}?.["get"]).toString()?.length > 60)` | — |
| FR_0 | `!(typeof __b?.zh !== "undefined")` | — |
| FR_0 | `!(v24.indexOf("onsol") !== -1)` | — |
| FR_0 | `!((new Error()?.stack).indexOf("node") !== -1)` | — |
| FR_0 | `!(v25.indexOf("executeUserEntryPoint") !== -1)` | — |
| FR_0 | `!((Function?.prototype?.constructor).toString().indexOf("native") === -1)` | — |
| FR_0 | `!(typeof window?.v_log !== "undefined")` | — |
| FR_877 | `!v0?.length` | — |
| null | `typeof module !== "undefined"` | — |

## service（13 条）

| 函数 | 检测条件 | 置位 |
|---|---|---|
| M_SET | `o !== undefined && o !== null` | — |
| FR_0 | `(__g?.z).toString().indexOf("nsol") > -1` | — |
| FR_0 | `F` | — |
| FR_0 | `(document.querySelector("script[data-assets-tracker-config]") + "").indexOf("HTMLScriptElement") === -1` | — |
| FR_0 | `v2 < 100` | — |
| FR_0 | `v0?.[0]?.[1] === "1022"` | — |
| FR_0 | `v6 === "1024"` | — |
| FR_0 | `v6 === "1026"` | — |
| FR_0 | `v6 !== "1028"` | — |
| FR_0 | `!F` | — |
| FR_0 | `!(v6 === "1030")` | — |
| FR_0 | `!v6` | — |
| null | `typeof module !== "undefined"` | — |

