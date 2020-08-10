/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/offScreen.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/comlink/dist/esm/comlink.mjs":
/*!***************************************************!*\
  !*** ./node_modules/comlink/dist/esm/comlink.mjs ***!
  \***************************************************/
/*! exports provided: createEndpoint, expose, proxy, proxyMarker, releaseProxy, transfer, transferHandlers, windowEndpoint, wrap */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createEndpoint\", function() { return createEndpoint; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"expose\", function() { return expose; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"proxy\", function() { return proxy; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"proxyMarker\", function() { return proxyMarker; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"releaseProxy\", function() { return releaseProxy; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transfer\", function() { return transfer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transferHandlers\", function() { return transferHandlers; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"windowEndpoint\", function() { return windowEndpoint; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"wrap\", function() { return wrap; });\n/**\r\n * Copyright 2019 Google Inc. All Rights Reserved.\r\n * Licensed under the Apache License, Version 2.0 (the \"License\");\r\n * you may not use this file except in compliance with the License.\r\n * You may obtain a copy of the License at\r\n *     http://www.apache.org/licenses/LICENSE-2.0\r\n * Unless required by applicable law or agreed to in writing, software\r\n * distributed under the License is distributed on an \"AS IS\" BASIS,\r\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\r\n * See the License for the specific language governing permissions and\r\n * limitations under the License.\r\n */\r\nconst proxyMarker = Symbol(\"Comlink.proxy\");\r\nconst createEndpoint = Symbol(\"Comlink.endpoint\");\r\nconst releaseProxy = Symbol(\"Comlink.releaseProxy\");\r\nconst throwMarker = Symbol(\"Comlink.thrown\");\r\nconst isObject = (val) => (typeof val === \"object\" && val !== null) || typeof val === \"function\";\r\n/**\r\n * Internal transfer handle to handle objects marked to proxy.\r\n */\r\nconst proxyTransferHandler = {\r\n    canHandle: (val) => isObject(val) && val[proxyMarker],\r\n    serialize(obj) {\r\n        const { port1, port2 } = new MessageChannel();\r\n        expose(obj, port1);\r\n        return [port2, [port2]];\r\n    },\r\n    deserialize(port) {\r\n        port.start();\r\n        return wrap(port);\r\n    },\r\n};\r\n/**\r\n * Internal transfer handler to handle thrown exceptions.\r\n */\r\nconst throwTransferHandler = {\r\n    canHandle: (value) => isObject(value) && throwMarker in value,\r\n    serialize({ value }) {\r\n        let serialized;\r\n        if (value instanceof Error) {\r\n            serialized = {\r\n                isError: true,\r\n                value: {\r\n                    message: value.message,\r\n                    name: value.name,\r\n                    stack: value.stack,\r\n                },\r\n            };\r\n        }\r\n        else {\r\n            serialized = { isError: false, value };\r\n        }\r\n        return [serialized, []];\r\n    },\r\n    deserialize(serialized) {\r\n        if (serialized.isError) {\r\n            throw Object.assign(new Error(serialized.value.message), serialized.value);\r\n        }\r\n        throw serialized.value;\r\n    },\r\n};\r\n/**\r\n * Allows customizing the serialization of certain values.\r\n */\r\nconst transferHandlers = new Map([\r\n    [\"proxy\", proxyTransferHandler],\r\n    [\"throw\", throwTransferHandler],\r\n]);\r\nfunction expose(obj, ep = self) {\r\n    ep.addEventListener(\"message\", function callback(ev) {\r\n        if (!ev || !ev.data) {\r\n            return;\r\n        }\r\n        const { id, type, path } = Object.assign({ path: [] }, ev.data);\r\n        const argumentList = (ev.data.argumentList || []).map(fromWireValue);\r\n        let returnValue;\r\n        try {\r\n            const parent = path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);\r\n            const rawValue = path.reduce((obj, prop) => obj[prop], obj);\r\n            switch (type) {\r\n                case 0 /* GET */:\r\n                    {\r\n                        returnValue = rawValue;\r\n                    }\r\n                    break;\r\n                case 1 /* SET */:\r\n                    {\r\n                        parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);\r\n                        returnValue = true;\r\n                    }\r\n                    break;\r\n                case 2 /* APPLY */:\r\n                    {\r\n                        returnValue = rawValue.apply(parent, argumentList);\r\n                    }\r\n                    break;\r\n                case 3 /* CONSTRUCT */:\r\n                    {\r\n                        const value = new rawValue(...argumentList);\r\n                        returnValue = proxy(value);\r\n                    }\r\n                    break;\r\n                case 4 /* ENDPOINT */:\r\n                    {\r\n                        const { port1, port2 } = new MessageChannel();\r\n                        expose(obj, port2);\r\n                        returnValue = transfer(port1, [port1]);\r\n                    }\r\n                    break;\r\n                case 5 /* RELEASE */:\r\n                    {\r\n                        returnValue = undefined;\r\n                    }\r\n                    break;\r\n            }\r\n        }\r\n        catch (value) {\r\n            returnValue = { value, [throwMarker]: 0 };\r\n        }\r\n        Promise.resolve(returnValue)\r\n            .catch((value) => {\r\n            return { value, [throwMarker]: 0 };\r\n        })\r\n            .then((returnValue) => {\r\n            const [wireValue, transferables] = toWireValue(returnValue);\r\n            ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);\r\n            if (type === 5 /* RELEASE */) {\r\n                // detach and deactive after sending release response above.\r\n                ep.removeEventListener(\"message\", callback);\r\n                closeEndPoint(ep);\r\n            }\r\n        });\r\n    });\r\n    if (ep.start) {\r\n        ep.start();\r\n    }\r\n}\r\nfunction isMessagePort(endpoint) {\r\n    return endpoint.constructor.name === \"MessagePort\";\r\n}\r\nfunction closeEndPoint(endpoint) {\r\n    if (isMessagePort(endpoint))\r\n        endpoint.close();\r\n}\r\nfunction wrap(ep, target) {\r\n    return createProxy(ep, [], target);\r\n}\r\nfunction throwIfProxyReleased(isReleased) {\r\n    if (isReleased) {\r\n        throw new Error(\"Proxy has been released and is not useable\");\r\n    }\r\n}\r\nfunction createProxy(ep, path = [], target = function () { }) {\r\n    let isProxyReleased = false;\r\n    const proxy = new Proxy(target, {\r\n        get(_target, prop) {\r\n            throwIfProxyReleased(isProxyReleased);\r\n            if (prop === releaseProxy) {\r\n                return () => {\r\n                    return requestResponseMessage(ep, {\r\n                        type: 5 /* RELEASE */,\r\n                        path: path.map((p) => p.toString()),\r\n                    }).then(() => {\r\n                        closeEndPoint(ep);\r\n                        isProxyReleased = true;\r\n                    });\r\n                };\r\n            }\r\n            if (prop === \"then\") {\r\n                if (path.length === 0) {\r\n                    return { then: () => proxy };\r\n                }\r\n                const r = requestResponseMessage(ep, {\r\n                    type: 0 /* GET */,\r\n                    path: path.map((p) => p.toString()),\r\n                }).then(fromWireValue);\r\n                return r.then.bind(r);\r\n            }\r\n            return createProxy(ep, [...path, prop]);\r\n        },\r\n        set(_target, prop, rawValue) {\r\n            throwIfProxyReleased(isProxyReleased);\r\n            // FIXME: ES6 Proxy Handler `set` methods are supposed to return a\r\n            // boolean. To show good will, we return true asynchronously ¯\\_(ツ)_/¯\r\n            const [value, transferables] = toWireValue(rawValue);\r\n            return requestResponseMessage(ep, {\r\n                type: 1 /* SET */,\r\n                path: [...path, prop].map((p) => p.toString()),\r\n                value,\r\n            }, transferables).then(fromWireValue);\r\n        },\r\n        apply(_target, _thisArg, rawArgumentList) {\r\n            throwIfProxyReleased(isProxyReleased);\r\n            const last = path[path.length - 1];\r\n            if (last === createEndpoint) {\r\n                return requestResponseMessage(ep, {\r\n                    type: 4 /* ENDPOINT */,\r\n                }).then(fromWireValue);\r\n            }\r\n            // We just pretend that `bind()` didn’t happen.\r\n            if (last === \"bind\") {\r\n                return createProxy(ep, path.slice(0, -1));\r\n            }\r\n            const [argumentList, transferables] = processArguments(rawArgumentList);\r\n            return requestResponseMessage(ep, {\r\n                type: 2 /* APPLY */,\r\n                path: path.map((p) => p.toString()),\r\n                argumentList,\r\n            }, transferables).then(fromWireValue);\r\n        },\r\n        construct(_target, rawArgumentList) {\r\n            throwIfProxyReleased(isProxyReleased);\r\n            const [argumentList, transferables] = processArguments(rawArgumentList);\r\n            return requestResponseMessage(ep, {\r\n                type: 3 /* CONSTRUCT */,\r\n                path: path.map((p) => p.toString()),\r\n                argumentList,\r\n            }, transferables).then(fromWireValue);\r\n        },\r\n    });\r\n    return proxy;\r\n}\r\nfunction myFlat(arr) {\r\n    return Array.prototype.concat.apply([], arr);\r\n}\r\nfunction processArguments(argumentList) {\r\n    const processed = argumentList.map(toWireValue);\r\n    return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];\r\n}\r\nconst transferCache = new WeakMap();\r\nfunction transfer(obj, transfers) {\r\n    transferCache.set(obj, transfers);\r\n    return obj;\r\n}\r\nfunction proxy(obj) {\r\n    return Object.assign(obj, { [proxyMarker]: true });\r\n}\r\nfunction windowEndpoint(w, context = self, targetOrigin = \"*\") {\r\n    return {\r\n        postMessage: (msg, transferables) => w.postMessage(msg, targetOrigin, transferables),\r\n        addEventListener: context.addEventListener.bind(context),\r\n        removeEventListener: context.removeEventListener.bind(context),\r\n    };\r\n}\r\nfunction toWireValue(value) {\r\n    for (const [name, handler] of transferHandlers) {\r\n        if (handler.canHandle(value)) {\r\n            const [serializedValue, transferables] = handler.serialize(value);\r\n            return [\r\n                {\r\n                    type: 3 /* HANDLER */,\r\n                    name,\r\n                    value: serializedValue,\r\n                },\r\n                transferables,\r\n            ];\r\n        }\r\n    }\r\n    return [\r\n        {\r\n            type: 0 /* RAW */,\r\n            value,\r\n        },\r\n        transferCache.get(value) || [],\r\n    ];\r\n}\r\nfunction fromWireValue(value) {\r\n    switch (value.type) {\r\n        case 3 /* HANDLER */:\r\n            return transferHandlers.get(value.name).deserialize(value.value);\r\n        case 0 /* RAW */:\r\n            return value.value;\r\n    }\r\n}\r\nfunction requestResponseMessage(ep, msg, transfers) {\r\n    return new Promise((resolve) => {\r\n        const id = generateUUID();\r\n        ep.addEventListener(\"message\", function l(ev) {\r\n            if (!ev.data || !ev.data.id || ev.data.id !== id) {\r\n                return;\r\n            }\r\n            ep.removeEventListener(\"message\", l);\r\n            resolve(ev.data);\r\n        });\r\n        if (ep.start) {\r\n            ep.start();\r\n        }\r\n        ep.postMessage(Object.assign({ id }, msg), transfers);\r\n    });\r\n}\r\nfunction generateUUID() {\r\n    return new Array(4)\r\n        .fill(0)\r\n        .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))\r\n        .join(\"-\");\r\n}\n\n\n//# sourceMappingURL=comlink.mjs.map\n\n\n//# sourceURL=webpack:///./node_modules/comlink/dist/esm/comlink.mjs?");

/***/ }),

/***/ "./node_modules/worker-plugin/dist/loader.js?name=0!./src/offScreen-worker.ts":
/*!************************************************************************************!*\
  !*** ./node_modules/worker-plugin/dist/loader.js?name=0!./src/offScreen-worker.ts ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"0.bundle.worker.js\"\n\n//# sourceURL=webpack:///./src/offScreen-worker.ts?./node_modules/worker-plugin/dist/loader.js?name=0");

/***/ }),

/***/ "./src/offScreen.ts":
/*!**************************!*\
  !*** ./src/offScreen.ts ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__webpack__worker__0) {/* harmony import */ var comlink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! comlink */ \"./node_modules/comlink/dist/esm/comlink.mjs\");\n\r\nconst init = async () => {\r\n    const htmlCanvas = document.getElementById(\"my_canvas\");\r\n    const offscreen = htmlCanvas.transferControlToOffscreen();\r\n    offscreen.width = htmlCanvas.clientWidth * window.devicePixelRatio;\r\n    offscreen.height = htmlCanvas.clientHeight * window.devicePixelRatio;\r\n    const worker = new Worker(__webpack__worker__0, undefined);\r\n    const workerApi = Object(comlink__WEBPACK_IMPORTED_MODULE_0__[\"wrap\"])(worker);\r\n    await workerApi.run(Object(comlink__WEBPACK_IMPORTED_MODULE_0__[\"transfer\"])(offscreen, [offscreen]));\r\n    await workerApi.set(0.8);\r\n};\r\ninit();\r\ndocument.getElementById(\"btBusy\").addEventListener(\"click\", () => {\r\n    const info = document.getElementById(\"info\");\r\n    info.innerHTML =\r\n        \"Main thread working...<br>Check the console (F12)<br> Try resizing the window now\";\r\n    let a = 0;\r\n    const total = 100000000;\r\n    for (let i = 0; i < total; i++) {\r\n        a = a + Math.sin(i);\r\n        if (i % (total / 20) == 0) {\r\n            console.log(((100 * i) / total).toFixed(0) + \"%\");\r\n        }\r\n    }\r\n    info.innerHTML = \"Done!\";\r\n});\r\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/worker-plugin/dist/loader.js?name=0!./offScreen-worker */ \"./node_modules/worker-plugin/dist/loader.js?name=0!./src/offScreen-worker.ts\")))\n\n//# sourceURL=webpack:///./src/offScreen.ts?");

/***/ })

/******/ });