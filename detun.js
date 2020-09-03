// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("file:///home/elemti/nux/git/detun/common/main", [], function (exports_1, context_1) {
    "use strict";
    var localIter, tcpConnect, skipBadResourceErr, PING_INTERV, PING_TIMEOUT, tryCatch;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("localIter", localIter = reader => Deno.iter(reader, { bufSize: 32 * 1024 }));
            exports_1("tcpConnect", tcpConnect = (...args) => new Promise((resolve, reject) => {
                let timeoutMs = 3 * 1000;
                let done = false;
                let callback = (err, conn) => {
                    if (done) {
                        try {
                            conn && conn.close();
                        }
                        catch { }
                        return;
                    }
                    done = true;
                    if (err)
                        return reject(err);
                    else
                        return resolve(conn);
                };
                Deno.connect(...args).then(conn => callback(null, conn), err => callback(err));
                setTimeout(() => callback(Error('tcpConnect timed out')), timeoutMs);
            }));
            exports_1("skipBadResourceErr", skipBadResourceErr = err => {
                if (err?.name?.trim?.() === 'BadResource' && err?.message?.trim?.() === 'Bad resource ID')
                    return;
                throw err;
            });
            exports_1("PING_INTERV", PING_INTERV = 5 * 1000);
            exports_1("PING_TIMEOUT", PING_TIMEOUT = 15 * 1000);
            exports_1("tryCatch", tryCatch = func => {
                try {
                    let res = func();
                    if (res instanceof Promise) {
                        return res.catch(e => e);
                    }
                    return res;
                }
                catch { }
            });
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-0c2d1322", [], function (exports_2, context_2) {
    "use strict";
    var e, t, n, r, o, l, s, f, a, T, addListener, argv, binding, browser, chdir, cwd, emit, env, listeners, nextTick, off, on, once, prependListener, prependOnceListener, removeAllListeners, removeListener, title, umask, version, versions;
    var __moduleName = context_2 && context_2.id;
    function i() { throw new Error("setTimeout has not been defined"); }
    function u() { throw new Error("clearTimeout has not been defined"); }
    function c(e) { if (t === setTimeout)
        return setTimeout(e, 0); if ((t === i || !t) && setTimeout)
        return t = setTimeout, setTimeout(e, 0); try {
        return t(e, 0);
    }
    catch (n) {
        try {
            return t.call(null, e, 0);
        }
        catch (n) {
            return t.call(this || r, e, 0);
        }
    } }
    function h() { f && l && (f = !1, l.length ? s = l.concat(s) : a = -1, s.length && d()); }
    function d() { if (!f) {
        var e = c(h);
        f = !0;
        for (var t = s.length; t;) {
            for (l = s, s = []; ++a < t;)
                l && l[a].run();
            a = -1, t = s.length;
        }
        l = null, f = !1, function (e) { if (n === clearTimeout)
            return clearTimeout(e); if ((n === u || !n) && clearTimeout)
            return n = clearTimeout, clearTimeout(e); try {
            n(e);
        }
        catch (t) {
            try {
                return n.call(null, e);
            }
            catch (t) {
                return n.call(this || r, e);
            }
        } }(e);
    } }
    function m(e, t) { (this || r).fun = e, (this || r).array = t; }
    function p() { }
    return {
        setters: [],
        execute: function () {
            r = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, o = e = {};
            !function () { try {
                t = "function" == typeof setTimeout ? setTimeout : i;
            }
            catch (e) {
                t = i;
            } try {
                n = "function" == typeof clearTimeout ? clearTimeout : u;
            }
            catch (e) {
                n = u;
            } }();
            s = [], f = !1, a = -1;
            o.nextTick = function (e) { var t = new Array(arguments.length - 1); if (arguments.length > 1)
                for (var n = 1; n < arguments.length; n++)
                    t[n - 1] = arguments[n]; s.push(new m(e, t)), 1 !== s.length || f || c(d); }, m.prototype.run = function () { (this || r).fun.apply(null, (this || r).array); }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = p, o.addListener = p, o.once = p, o.off = p, o.removeListener = p, o.removeAllListeners = p, o.emit = p, o.prependListener = p, o.prependOnceListener = p, o.listeners = function (e) { return []; }, o.binding = function (e) { throw new Error("process.binding is not supported"); }, o.cwd = function () { return "/"; }, o.chdir = function (e) { throw new Error("process.chdir is not supported"); }, o.umask = function () { return 0; };
            T = e;
            exports_2("h", T);
            exports_2("w", T);
            addListener = T.addListener;
            exports_2("a", addListener);
            argv = T.argv;
            exports_2("b", argv);
            binding = T.binding;
            exports_2("c", binding);
            browser = T.browser;
            exports_2("d", browser);
            chdir = T.chdir;
            exports_2("e", chdir);
            cwd = T.cwd;
            exports_2("f", cwd);
            emit = T.emit;
            exports_2("g", emit);
            env = T.env;
            exports_2("i", env);
            listeners = T.listeners;
            exports_2("l", listeners);
            nextTick = T.nextTick;
            exports_2("n", nextTick);
            off = T.off;
            exports_2("o", off);
            on = T.on;
            exports_2("j", on);
            once = T.once;
            exports_2("k", once);
            prependListener = T.prependListener;
            exports_2("p", prependListener);
            prependOnceListener = T.prependOnceListener;
            exports_2("m", prependOnceListener);
            removeAllListeners = T.removeAllListeners;
            exports_2("r", removeAllListeners);
            removeListener = T.removeListener;
            exports_2("q", removeListener);
            title = T.title;
            exports_2("t", title);
            umask = T.umask;
            exports_2("u", umask);
            version = T.version;
            exports_2("v", version);
            versions = T.versions;
            exports_2("s", versions);
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-dac557ba", ["https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-0c2d1322"], function (exports_3, context_3) {
    "use strict";
    var chunk_0c2d1322_js_1, t, e, o, n, r, l, t$1, o$1, n$1, e$1, r$1, c, u, i, t$2, i$1, o$2, u$1, f, a, s, p, y, l$1, d, m, h, j, A, Q, X, Y, ee, te, re, ne, Se, Ee;
    var __moduleName = context_3 && context_3.id;
    function c$1(e) {
        return e.call.bind(e);
    }
    function O(e, t) {
        if ("object" != typeof e)
            return !1;
        try {
            return t(e), !0;
        }
        catch (e) {
            return !1;
        }
    }
    function S(e) {
        return l$1 && y ? void 0 !== b(e) : B(e) || k(e) || E(e) || D(e) || U(e) || P(e) || x(e) || I(e) || M(e) || z(e) || F(e);
    }
    function B(e) {
        return l$1 && y ? "Uint8Array" === b(e) : "[object Uint8Array]" === m(e) || u$1(e) && void 0 !== e.buffer;
    }
    function k(e) {
        return l$1 && y ? "Uint8ClampedArray" === b(e) : "[object Uint8ClampedArray]" === m(e);
    }
    function E(e) {
        return l$1 && y ? "Uint16Array" === b(e) : "[object Uint16Array]" === m(e);
    }
    function D(e) {
        return l$1 && y ? "Uint32Array" === b(e) : "[object Uint32Array]" === m(e);
    }
    function U(e) {
        return l$1 && y ? "Int8Array" === b(e) : "[object Int8Array]" === m(e);
    }
    function P(e) {
        return l$1 && y ? "Int16Array" === b(e) : "[object Int16Array]" === m(e);
    }
    function x(e) {
        return l$1 && y ? "Int32Array" === b(e) : "[object Int32Array]" === m(e);
    }
    function I(e) {
        return l$1 && y ? "Float32Array" === b(e) : "[object Float32Array]" === m(e);
    }
    function M(e) {
        return l$1 && y ? "Float64Array" === b(e) : "[object Float64Array]" === m(e);
    }
    function z(e) {
        return l$1 && y ? "BigInt64Array" === b(e) : "[object BigInt64Array]" === m(e);
    }
    function F(e) {
        return l$1 && y ? "BigUint64Array" === b(e) : "[object BigUint64Array]" === m(e);
    }
    function T(e) {
        return "[object Map]" === m(e);
    }
    function N(e) {
        return "[object Set]" === m(e);
    }
    function W(e) {
        return "[object WeakMap]" === m(e);
    }
    function $(e) {
        return "[object WeakSet]" === m(e);
    }
    function C(e) {
        return "[object ArrayBuffer]" === m(e);
    }
    function V(e) {
        return "undefined" != typeof ArrayBuffer && (C.working ? C(e) : e instanceof ArrayBuffer);
    }
    function G(e) {
        return "[object DataView]" === m(e);
    }
    function R(e) {
        return "undefined" != typeof DataView && (G.working ? G(e) : e instanceof DataView);
    }
    function J(e) {
        return "[object SharedArrayBuffer]" === m(e);
    }
    function _(e) {
        return "undefined" != typeof SharedArrayBuffer && (J.working ? J(e) : e instanceof SharedArrayBuffer);
    }
    function H(e) {
        return O(e, h);
    }
    function Z(e) {
        return O(e, j);
    }
    function q(e) {
        return O(e, A);
    }
    function K(e) {
        return s && O(e, w);
    }
    function L(e) {
        return p && O(e, v);
    }
    function oe(e, t) {
        var r = {
            seen: [],
            stylize: fe
        };
        return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), ye(t) ? r.showHidden = t : t && X._extend(r, t), be(r.showHidden) && (r.showHidden = !1), be(r.depth) && (r.depth = 2), be(r.colors) && (r.colors = !1), be(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = ue), ae(r, e, r.depth);
    }
    function ue(e, t) {
        var r = oe.styles[t];
        return r ? "[" + oe.colors[r][0] + "m" + e + "[" + oe.colors[r][1] + "m" : e;
    }
    function fe(e, t) {
        return e;
    }
    function ae(e, t, r) {
        if (e.customInspect && t && we(t.inspect) && t.inspect !== X.inspect && (!t.constructor || t.constructor.prototype !== t)) {
            var n = t.inspect(r, e);
            return ge(n) || (n = ae(e, n, r)), n;
        }
        var i = function (e, t) {
            if (be(t))
                return e.stylize("undefined", "undefined");
            if (ge(t)) {
                var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                return e.stylize(r, "string");
            }
            if (de(t))
                return e.stylize("" + t, "number");
            if (ye(t))
                return e.stylize("" + t, "boolean");
            if (le(t))
                return e.stylize("null", "null");
        }(e, t);
        if (i)
            return i;
        var o = Object.keys(t), u = function (e) {
            var t = {};
            return e.forEach(function (e, r) {
                t[e] = !0;
            }), t;
        }(o);
        if (e.showHidden && (o = Object.getOwnPropertyNames(t)), Ae(t) && (o.indexOf("message") >= 0 || o.indexOf("description") >= 0))
            return ce(t);
        if (0 === o.length) {
            if (we(t)) {
                var f = t.name ? ": " + t.name : "";
                return e.stylize("[Function" + f + "]", "special");
            }
            if (me(t))
                return e.stylize(RegExp.prototype.toString.call(t), "regexp");
            if (je(t))
                return e.stylize(Date.prototype.toString.call(t), "date");
            if (Ae(t))
                return ce(t);
        }
        var a, c = "", s = !1, p = ["{", "}"];
        (pe(t) && (s = !0, p = ["[", "]"]), we(t)) && (c = " [Function" + (t.name ? ": " + t.name : "") + "]");
        return me(t) && (c = " " + RegExp.prototype.toString.call(t)), je(t) && (c = " " + Date.prototype.toUTCString.call(t)), Ae(t) && (c = " " + ce(t)), 0 !== o.length || s && 0 != t.length ? r < 0 ? me(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special") : (e.seen.push(t), a = s ? function (e, t, r, n, i) {
            for (var o = [], u = 0, f = t.length; u < f; ++u)
                ke(t, String(u)) ? o.push(se(e, t, r, n, String(u), !0)) : o.push("");
            return i.forEach(function (i) {
                i.match(/^\d+$/) || o.push(se(e, t, r, n, i, !0));
            }), o;
        }(e, t, r, u, o) : o.map(function (n) {
            return se(e, t, r, u, n, s);
        }), e.seen.pop(), function (e, t, r) {
            var n = 0;
            if (e.reduce(function (e, t) {
                return n++, t.indexOf("\n") >= 0 && n++, e + t.replace(/\u001b\[\d\d?m/g, "").length + 1;
            }, 0) > 60)
                return r[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + r[1];
            return r[0] + t + " " + e.join(", ") + " " + r[1];
        }(a, c, p)) : p[0] + c + p[1];
    }
    function ce(e) {
        return "[" + Error.prototype.toString.call(e) + "]";
    }
    function se(e, t, r, n, i, o) {
        var u, f, a;
        if ((a = Object.getOwnPropertyDescriptor(t, i) || {
            value: t[i]
        }).get ? f = a.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : a.set && (f = e.stylize("[Setter]", "special")), ke(n, i) || (u = "[" + i + "]"), f || (e.seen.indexOf(a.value) < 0 ? (f = le(r) ? ae(e, a.value, null) : ae(e, a.value, r - 1)).indexOf("\n") > -1 && (f = o ? f.split("\n").map(function (e) {
            return "  " + e;
        }).join("\n").substr(2) : "\n" + f.split("\n").map(function (e) {
            return "   " + e;
        }).join("\n")) : f = e.stylize("[Circular]", "special")), be(u)) {
            if (o && i.match(/^\d+$/))
                return f;
            (u = JSON.stringify("" + i)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (u = u.substr(1, u.length - 2), u = e.stylize(u, "name")) : (u = u.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), u = e.stylize(u, "string"));
        }
        return u + ": " + f;
    }
    function pe(e) {
        return Array.isArray(e);
    }
    function ye(e) {
        return "boolean" == typeof e;
    }
    function le(e) {
        return null === e;
    }
    function de(e) {
        return "number" == typeof e;
    }
    function ge(e) {
        return "string" == typeof e;
    }
    function be(e) {
        return void 0 === e;
    }
    function me(e) {
        return he(e) && "[object RegExp]" === ve(e);
    }
    function he(e) {
        return "object" == typeof e && null !== e;
    }
    function je(e) {
        return he(e) && "[object Date]" === ve(e);
    }
    function Ae(e) {
        return he(e) && ("[object Error]" === ve(e) || e instanceof Error);
    }
    function we(e) {
        return "function" == typeof e;
    }
    function ve(e) {
        return Object.prototype.toString.call(e);
    }
    function Oe(e) {
        return e < 10 ? "0" + e.toString(10) : e.toString(10);
    }
    function Be() {
        var e = new Date(), t = [Oe(e.getHours()), Oe(e.getMinutes()), Oe(e.getSeconds())].join(":");
        return [e.getDate(), Se[e.getMonth()], t].join(" ");
    }
    function ke(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }
    function De(e, t) {
        if (!e) {
            var r = new Error("Promise was rejected with a falsy value");
            r.reason = e, e = r;
        }
        return t(e);
    }
    return {
        setters: [
            function (chunk_0c2d1322_js_1_1) {
                chunk_0c2d1322_js_1 = chunk_0c2d1322_js_1_1;
            }
        ],
        execute: function () {
            t = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag, e = Object.prototype.toString, o = function (o) {
                return !(t && o && "object" == typeof o && Symbol.toStringTag in o) && "[object Arguments]" === e.call(o);
            }, n = function (t) {
                return !!o(t) || null !== t && "object" == typeof t && "number" == typeof t.length && t.length >= 0 && "[object Array]" !== e.call(t) && "[object Function]" === e.call(t.callee);
            }, r = function () {
                return o(arguments);
            }();
            o.isLegacyArguments = n;
            l = r ? o : n;
            t$1 = Object.prototype.toString, o$1 = Function.prototype.toString, n$1 = /^\s*(?:function)?\*/, e$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag, r$1 = Object.getPrototypeOf, c = function () {
                if (!e$1)
                    return !1;
                try {
                    return Function("return function*() {}")();
                }
                catch (t) { }
            }(), u = c ? r$1(c) : {}, i = function (c) {
                return "function" == typeof c && (!!n$1.test(o$1.call(c)) || (e$1 ? r$1(c) === u : "[object GeneratorFunction]" === t$1.call(c)));
            };
            t$2 = "function" == typeof Object.create ? function (t, e) {
                e && (t.super_ = e, t.prototype = Object.create(e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }));
            } : function (t, e) {
                if (e) {
                    t.super_ = e;
                    var o = function () { };
                    o.prototype = e.prototype, t.prototype = new o(), t.prototype.constructor = t;
                }
            };
            exports_3("t", t$2);
            i$1 = function (e) {
                return e && "object" == typeof e && "function" == typeof e.copy && "function" == typeof e.fill && "function" == typeof e.readUInt8;
            }, o$2 = {}, u$1 = i$1, f = l, a = i;
            s = "undefined" != typeof BigInt, p = "undefined" != typeof Symbol, y = p && void 0 !== Symbol.toStringTag, l$1 = "undefined" != typeof Uint8Array, d = "undefined" != typeof ArrayBuffer;
            if (l$1 && y)
                var g = Object.getPrototypeOf(Uint8Array.prototype), b = c$1(Object.getOwnPropertyDescriptor(g, Symbol.toStringTag).get);
            m = c$1(Object.prototype.toString), h = c$1(Number.prototype.valueOf), j = c$1(String.prototype.valueOf), A = c$1(Boolean.prototype.valueOf);
            if (s)
                var w = c$1(BigInt.prototype.valueOf);
            if (p)
                var v = c$1(Symbol.prototype.valueOf);
            o$2.isArgumentsObject = f, o$2.isGeneratorFunction = a, o$2.isPromise = function (e) {
                return "undefined" != typeof Promise && e instanceof Promise || null !== e && "object" == typeof e && "function" == typeof e.then && "function" == typeof e.catch;
            }, o$2.isArrayBufferView = function (e) {
                return d && ArrayBuffer.isView ? ArrayBuffer.isView(e) : S(e) || R(e);
            }, o$2.isTypedArray = S, o$2.isUint8Array = B, o$2.isUint8ClampedArray = k, o$2.isUint16Array = E, o$2.isUint32Array = D, o$2.isInt8Array = U, o$2.isInt16Array = P, o$2.isInt32Array = x, o$2.isFloat32Array = I, o$2.isFloat64Array = M, o$2.isBigInt64Array = z, o$2.isBigUint64Array = F, T.working = "undefined" != typeof Map && T(new Map()), o$2.isMap = function (e) {
                return "undefined" != typeof Map && (T.working ? T(e) : e instanceof Map);
            }, N.working = "undefined" != typeof Set && N(new Set()), o$2.isSet = function (e) {
                return "undefined" != typeof Set && (N.working ? N(e) : e instanceof Set);
            }, W.working = "undefined" != typeof WeakMap && W(new WeakMap()), o$2.isWeakMap = function (e) {
                return "undefined" != typeof WeakMap && (W.working ? W(e) : e instanceof WeakMap);
            }, $.working = "undefined" != typeof WeakSet && $(new WeakSet()), o$2.isWeakSet = function (e) {
                return $(e);
            }, C.working = "undefined" != typeof ArrayBuffer && C(new ArrayBuffer()), o$2.isArrayBuffer = V, G.working = "undefined" != typeof ArrayBuffer && "undefined" != typeof DataView && G(new DataView(new ArrayBuffer(1), 0, 1)), o$2.isDataView = R, J.working = "undefined" != typeof SharedArrayBuffer && J(new SharedArrayBuffer()), o$2.isSharedArrayBuffer = _, o$2.isAsyncFunction = function (e) {
                return "[object AsyncFunction]" === m(e);
            }, o$2.isMapIterator = function (e) {
                return "[object Map Iterator]" === m(e);
            }, o$2.isSetIterator = function (e) {
                return "[object Set Iterator]" === m(e);
            }, o$2.isGeneratorObject = function (e) {
                return "[object Generator]" === m(e);
            }, o$2.isWebAssemblyCompiledModule = function (e) {
                return "[object WebAssembly.Module]" === m(e);
            }, o$2.isNumberObject = H, o$2.isStringObject = Z, o$2.isBooleanObject = q, o$2.isBigIntObject = K, o$2.isSymbolObject = L, o$2.isBoxedPrimitive = function (e) {
                return H(e) || Z(e) || q(e) || K(e) || L(e);
            }, o$2.isAnyArrayBuffer = function (e) {
                return l$1 && (V(e) || _(e));
            }, ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function (e) {
                Object.defineProperty(o$2, e, {
                    enumerable: !1,
                    value: function () {
                        throw new Error(e + " is not supported in userland");
                    }
                });
            });
            Q = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, X = {}, Y = chunk_0c2d1322_js_1.h, ee = Object.getOwnPropertyDescriptors || function (e) {
                for (var t = Object.keys(e), r = {}, n = 0; n < t.length; n++)
                    r[t[n]] = Object.getOwnPropertyDescriptor(e, t[n]);
                return r;
            }, te = /%[sdj%]/g;
            exports_3("u", X);
            X.format = function (e) {
                if (!ge(e)) {
                    for (var t = [], r = 0; r < arguments.length; r++)
                        t.push(oe(arguments[r]));
                    return t.join(" ");
                }
                r = 1;
                for (var n = arguments, i = n.length, o = String(e).replace(te, function (e) {
                    if ("%%" === e)
                        return "%";
                    if (r >= i)
                        return e;
                    switch (e) {
                        case "%s":
                            return String(n[r++]);
                        case "%d":
                            return Number(n[r++]);
                        case "%j":
                            try {
                                return JSON.stringify(n[r++]);
                            }
                            catch (e) {
                                return "[Circular]";
                            }
                        default:
                            return e;
                    }
                }), u = n[r]; r < i; u = n[++r])
                    le(u) || !he(u) ? o += " " + u : o += " " + oe(u);
                return o;
            }, X.deprecate = function (e, t) {
                if (void 0 !== Y && !0 === Y.noDeprecation)
                    return e;
                if (void 0 === Y)
                    return function () {
                        return X.deprecate(e, t).apply(this || Q, arguments);
                    };
                var r = !1;
                return function () {
                    if (!r) {
                        if (Y.throwDeprecation)
                            throw new Error(t);
                        Y.traceDeprecation ? console.trace(t) : console.error(t), r = !0;
                    }
                    return e.apply(this || Q, arguments);
                };
            };
            re = {}, ne = /^$/;
            if (Y.env.NODE_DEBUG) {
                var ie = Y.env.NODE_DEBUG;
                ie = ie.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), ne = new RegExp("^" + ie + "$", "i");
            }
            X.debuglog = function (e) {
                if (e = e.toUpperCase(), !re[e])
                    if (ne.test(e)) {
                        var t = Y.pid;
                        re[e] = function () {
                            var r = X.format.apply(X, arguments);
                            console.error("%s %d: %s", e, t, r);
                        };
                    }
                    else
                        re[e] = function () { };
                return re[e];
            }, X.inspect = oe, oe.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39]
            }, oe.styles = {
                special: "cyan",
                number: "yellow",
                boolean: "yellow",
                undefined: "grey",
                null: "bold",
                string: "green",
                date: "magenta",
                regexp: "red"
            }, X.types = o$2, X.isArray = pe, X.isBoolean = ye, X.isNull = le, X.isNullOrUndefined = function (e) {
                return null == e;
            }, X.isNumber = de, X.isString = ge, X.isSymbol = function (e) {
                return "symbol" == typeof e;
            }, X.isUndefined = be, X.isRegExp = me, X.types.isRegExp = me, X.isObject = he, X.isDate = je, X.types.isDate = je, X.isError = Ae, X.types.isNativeError = Ae, X.isFunction = we, X.isPrimitive = function (e) {
                return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e;
            }, X.isBuffer = i$1;
            Se = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            X.log = function () {
                console.log("%s - %s", Be(), X.format.apply(X, arguments));
            }, X.inherits = t$2, X._extend = function (e, t) {
                if (!t || !he(t))
                    return e;
                for (var r = Object.keys(t), n = r.length; n--;)
                    e[r[n]] = t[r[n]];
                return e;
            };
            Ee = "undefined" != typeof Symbol ? Symbol("util.promisify.custom") : void 0;
            X.promisify = function (e) {
                if ("function" != typeof e)
                    throw new TypeError('The "original" argument must be of type Function');
                if (Ee && e[Ee]) {
                    var t;
                    if ("function" != typeof (t = e[Ee]))
                        throw new TypeError('The "util.promisify.custom" argument must be of type Function');
                    return Object.defineProperty(t, Ee, {
                        value: t,
                        enumerable: !1,
                        writable: !1,
                        configurable: !0
                    }), t;
                }
                function t() {
                    for (var t, r, n = new Promise(function (e, n) {
                        t = e, r = n;
                    }), i = [], o = 0; o < arguments.length; o++)
                        i.push(arguments[o]);
                    i.push(function (e, n) {
                        e ? r(e) : t(n);
                    });
                    try {
                        e.apply(this || Q, i);
                    }
                    catch (e) {
                        r(e);
                    }
                    return n;
                }
                return Object.setPrototypeOf(t, Object.getPrototypeOf(e)), Ee && Object.defineProperty(t, Ee, {
                    value: t,
                    enumerable: !1,
                    writable: !1,
                    configurable: !0
                }), Object.defineProperties(t, ee(e));
            }, X.promisify.custom = Ee, X.callbackify = function (e) {
                if ("function" != typeof e)
                    throw new TypeError('The "original" argument must be of type Function');
                function t() {
                    for (var t = [], r = 0; r < arguments.length; r++)
                        t.push(arguments[r]);
                    var n = t.pop();
                    if ("function" != typeof n)
                        throw new TypeError("The last argument must be of type Function");
                    var i = this || Q, o = function () {
                        return n.apply(i, arguments);
                    };
                    e.apply(this || Q, t).then(function (e) {
                        Y.nextTick(o.bind(null, null, e));
                    }, function (e) {
                        Y.nextTick(De.bind(null, e, o));
                    });
                }
                return Object.setPrototypeOf(t, Object.getPrototypeOf(e)), Object.defineProperties(t, ee(e)), t;
            };
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/buffer", [], function (exports_4, context_4) {
    "use strict";
    var r, t, e, n, o, a, h, a$1, e$1, n$1, i, o$1, j, Y, Buffer, INSPECT_MAX_BYTES, kMaxLength;
    var __moduleName = context_4 && context_4.id;
    function u(r) { var t = r.length; if (t % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4"); var e = r.indexOf("="); return -1 === e && (e = t), [e, e === t ? 0 : 4 - e % 4]; }
    function c(r, e, n) { for (var o, a, h = [], u = e; u < n; u += 3)
        o = (r[u] << 16 & 16711680) + (r[u + 1] << 8 & 65280) + (255 & r[u + 2]), h.push(t[(a = o) >> 18 & 63] + t[a >> 12 & 63] + t[a >> 6 & 63] + t[63 & a]); return h.join(""); }
    function f(t) { if (t > 2147483647)
        throw new RangeError('The value "' + t + '" is invalid for option "size"'); var r = new Uint8Array(t); return Object.setPrototypeOf(r, u$1.prototype), r; }
    function u$1(t, r, e) { if ("number" == typeof t) {
        if ("string" == typeof r)
            throw new TypeError('The "string" argument must be of type string. Received type number');
        return a$2(t);
    } return s(t, r, e); }
    function s(t, r, e) { if ("string" == typeof t)
        return function (t, r) { "string" == typeof r && "" !== r || (r = "utf8"); if (!u$1.isEncoding(r))
            throw new TypeError("Unknown encoding: " + r); var e = 0 | y(t, r), n = f(e), i = n.write(t, r); i !== e && (n = n.slice(0, i)); return n; }(t, r); if (ArrayBuffer.isView(t))
        return p(t); if (null == t)
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t); if (F(t, ArrayBuffer) || t && F(t.buffer, ArrayBuffer))
        return c$1(t, r, e); if ("undefined" != typeof SharedArrayBuffer && (F(t, SharedArrayBuffer) || t && F(t.buffer, SharedArrayBuffer)))
        return c$1(t, r, e); if ("number" == typeof t)
        throw new TypeError('The "value" argument must not be of type number. Received type number'); var n = t.valueOf && t.valueOf(); if (null != n && n !== t)
        return u$1.from(n, r, e); var i = function (t) { if (u$1.isBuffer(t)) {
        var r = 0 | l(t.length), e = f(r);
        return 0 === e.length || t.copy(e, 0, 0, r), e;
    } if (void 0 !== t.length)
        return "number" != typeof t.length || N(t.length) ? f(0) : p(t); if ("Buffer" === t.type && Array.isArray(t.data))
        return p(t.data); }(t); if (i)
        return i; if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof t[Symbol.toPrimitive])
        return u$1.from(t[Symbol.toPrimitive]("string"), r, e); throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t); }
    function h$1(t) { if ("number" != typeof t)
        throw new TypeError('"size" argument must be of type number'); if (t < 0)
        throw new RangeError('The value "' + t + '" is invalid for option "size"'); }
    function a$2(t) { return h$1(t), f(t < 0 ? 0 : 0 | l(t)); }
    function p(t) { for (var r = t.length < 0 ? 0 : 0 | l(t.length), e = f(r), n = 0; n < r; n += 1)
        e[n] = 255 & t[n]; return e; }
    function c$1(t, r, e) { if (r < 0 || t.byteLength < r)
        throw new RangeError('"offset" is outside of buffer bounds'); if (t.byteLength < r + (e || 0))
        throw new RangeError('"length" is outside of buffer bounds'); var n; return n = void 0 === r && void 0 === e ? new Uint8Array(t) : void 0 === e ? new Uint8Array(t, r) : new Uint8Array(t, r, e), Object.setPrototypeOf(n, u$1.prototype), n; }
    function l(t) { if (t >= 2147483647)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + 2147483647..toString(16) + " bytes"); return 0 | t; }
    function y(t, r) { if (u$1.isBuffer(t))
        return t.length; if (ArrayBuffer.isView(t) || F(t, ArrayBuffer))
        return t.byteLength; if ("string" != typeof t)
        throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t); var e = t.length, n = arguments.length > 2 && !0 === arguments[2]; if (!n && 0 === e)
        return 0; for (var i = !1;;)
        switch (r) {
            case "ascii":
            case "latin1":
            case "binary": return e;
            case "utf8":
            case "utf-8": return _(t).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le": return 2 * e;
            case "hex": return e >>> 1;
            case "base64": return z(t).length;
            default:
                if (i)
                    return n ? -1 : _(t).length;
                r = ("" + r).toLowerCase(), i = !0;
        } }
    function g(t, r, e) { var n = !1; if ((void 0 === r || r < 0) && (r = 0), r > this.length)
        return ""; if ((void 0 === e || e > this.length) && (e = this.length), e <= 0)
        return ""; if ((e >>>= 0) <= (r >>>= 0))
        return ""; for (t || (t = "utf8");;)
        switch (t) {
            case "hex": return O(this, r, e);
            case "utf8":
            case "utf-8": return I(this, r, e);
            case "ascii": return S(this, r, e);
            case "latin1":
            case "binary": return R(this, r, e);
            case "base64": return T(this, r, e);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le": return L(this, r, e);
            default:
                if (n)
                    throw new TypeError("Unknown encoding: " + t);
                t = (t + "").toLowerCase(), n = !0;
        } }
    function w(t, r, e) { var n = t[r]; t[r] = t[e], t[e] = n; }
    function d(t, r, e, n, i) { if (0 === t.length)
        return -1; if ("string" == typeof e ? (n = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), N(e = +e) && (e = i ? 0 : t.length - 1), e < 0 && (e = t.length + e), e >= t.length) {
        if (i)
            return -1;
        e = t.length - 1;
    }
    else if (e < 0) {
        if (!i)
            return -1;
        e = 0;
    } if ("string" == typeof r && (r = u$1.from(r, n)), u$1.isBuffer(r))
        return 0 === r.length ? -1 : v(t, r, e, n, i); if ("number" == typeof r)
        return r &= 255, "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, r, e) : Uint8Array.prototype.lastIndexOf.call(t, r, e) : v(t, [r], e, n, i); throw new TypeError("val must be string, number or Buffer"); }
    function v(t, r, e, n, i) { var o, f = 1, u = t.length, s = r.length; if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
        if (t.length < 2 || r.length < 2)
            return -1;
        f = 2, u /= 2, s /= 2, e /= 2;
    } function h(t, r) { return 1 === f ? t[r] : t.readUInt16BE(r * f); } if (i) {
        var a = -1;
        for (o = e; o < u; o++)
            if (h(t, o) === h(r, -1 === a ? 0 : o - a)) {
                if (-1 === a && (a = o), o - a + 1 === s)
                    return a * f;
            }
            else
                -1 !== a && (o -= o - a), a = -1;
    }
    else
        for (e + s > u && (e = u - s), o = e; o >= 0; o--) {
            for (var p = !0, c = 0; c < s; c++)
                if (h(t, o + c) !== h(r, c)) {
                    p = !1;
                    break;
                }
            if (p)
                return o;
        } return -1; }
    function b(t, r, e, n) { e = Number(e) || 0; var i = t.length - e; n ? (n = Number(n)) > i && (n = i) : n = i; var o = r.length; n > o / 2 && (n = o / 2); for (var f = 0; f < n; ++f) {
        var u = parseInt(r.substr(2 * f, 2), 16);
        if (N(u))
            return f;
        t[e + f] = u;
    } return f; }
    function m(t, r, e, n) { return D(_(r, t.length - e), t, e, n); }
    function E(t, r, e, n) { return D(function (t) { for (var r = [], e = 0; e < t.length; ++e)
        r.push(255 & t.charCodeAt(e)); return r; }(r), t, e, n); }
    function B(t, r, e, n) { return E(t, r, e, n); }
    function A(t, r, e, n) { return D(z(r), t, e, n); }
    function U(t, r, e, n) { return D(function (t, r) { for (var e, n, i, o = [], f = 0; f < t.length && !((r -= 2) < 0); ++f)
        e = t.charCodeAt(f), n = e >> 8, i = e % 256, o.push(i), o.push(n); return o; }(r, t.length - e), t, e, n); }
    function T(t, r, e) { return 0 === r && e === t.length ? n$1.fromByteArray(t) : n$1.fromByteArray(t.slice(r, e)); }
    function I(t, r, e) { e = Math.min(t.length, e); for (var n = [], i = r; i < e;) {
        var o, f, u, s, h = t[i], a = null, p = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
        if (i + p <= e)
            switch (p) {
                case 1:
                    h < 128 && (a = h);
                    break;
                case 2:
                    128 == (192 & (o = t[i + 1])) && (s = (31 & h) << 6 | 63 & o) > 127 && (a = s);
                    break;
                case 3:
                    o = t[i + 1], f = t[i + 2], 128 == (192 & o) && 128 == (192 & f) && (s = (15 & h) << 12 | (63 & o) << 6 | 63 & f) > 2047 && (s < 55296 || s > 57343) && (a = s);
                    break;
                case 4: o = t[i + 1], f = t[i + 2], u = t[i + 3], 128 == (192 & o) && 128 == (192 & f) && 128 == (192 & u) && (s = (15 & h) << 18 | (63 & o) << 12 | (63 & f) << 6 | 63 & u) > 65535 && s < 1114112 && (a = s);
            }
        null === a ? (a = 65533, p = 1) : a > 65535 && (a -= 65536, n.push(a >>> 10 & 1023 | 55296), a = 56320 | 1023 & a), n.push(a), i += p;
    } return function (t) { var r = t.length; if (r <= 4096)
        return String.fromCharCode.apply(String, t); var e = "", n = 0; for (; n < r;)
        e += String.fromCharCode.apply(String, t.slice(n, n += 4096)); return e; }(n); }
    function S(t, r, e) { var n = ""; e = Math.min(t.length, e); for (var i = r; i < e; ++i)
        n += String.fromCharCode(127 & t[i]); return n; }
    function R(t, r, e) { var n = ""; e = Math.min(t.length, e); for (var i = r; i < e; ++i)
        n += String.fromCharCode(t[i]); return n; }
    function O(t, r, e) { var n = t.length; (!r || r < 0) && (r = 0), (!e || e < 0 || e > n) && (e = n); for (var i = "", o = r; o < e; ++o)
        i += Y[t[o]]; return i; }
    function L(t, r, e) { for (var n = t.slice(r, e), i = "", o = 0; o < n.length; o += 2)
        i += String.fromCharCode(n[o] + 256 * n[o + 1]); return i; }
    function x(t, r, e) { if (t % 1 != 0 || t < 0)
        throw new RangeError("offset is not uint"); if (t + r > e)
        throw new RangeError("Trying to access beyond buffer length"); }
    function C(t, r, e, n, i, o) { if (!u$1.isBuffer(t))
        throw new TypeError('"buffer" argument must be a Buffer instance'); if (r > i || r < o)
        throw new RangeError('"value" argument is out of bounds'); if (e + n > t.length)
        throw new RangeError("Index out of range"); }
    function P(t, r, e, n, i, o) { if (e + n > t.length)
        throw new RangeError("Index out of range"); if (e < 0)
        throw new RangeError("Index out of range"); }
    function k(t, r, e, n, o) { return r = +r, e >>>= 0, o || P(t, 0, e, 4), i.write(t, r, e, n, 23, 4), e + 4; }
    function M(t, r, e, n, o) { return r = +r, e >>>= 0, o || P(t, 0, e, 8), i.write(t, r, e, n, 52, 8), e + 8; }
    function _(t, r) { var e; r = r || 1 / 0; for (var n = t.length, i = null, o = [], f = 0; f < n; ++f) {
        if ((e = t.charCodeAt(f)) > 55295 && e < 57344) {
            if (!i) {
                if (e > 56319) {
                    (r -= 3) > -1 && o.push(239, 191, 189);
                    continue;
                }
                if (f + 1 === n) {
                    (r -= 3) > -1 && o.push(239, 191, 189);
                    continue;
                }
                i = e;
                continue;
            }
            if (e < 56320) {
                (r -= 3) > -1 && o.push(239, 191, 189), i = e;
                continue;
            }
            e = 65536 + (i - 55296 << 10 | e - 56320);
        }
        else
            i && (r -= 3) > -1 && o.push(239, 191, 189);
        if (i = null, e < 128) {
            if ((r -= 1) < 0)
                break;
            o.push(e);
        }
        else if (e < 2048) {
            if ((r -= 2) < 0)
                break;
            o.push(e >> 6 | 192, 63 & e | 128);
        }
        else if (e < 65536) {
            if ((r -= 3) < 0)
                break;
            o.push(e >> 12 | 224, e >> 6 & 63 | 128, 63 & e | 128);
        }
        else {
            if (!(e < 1114112))
                throw new Error("Invalid code point");
            if ((r -= 4) < 0)
                break;
            o.push(e >> 18 | 240, e >> 12 & 63 | 128, e >> 6 & 63 | 128, 63 & e | 128);
        }
    } return o; }
    function z(t) { return n$1.toByteArray(function (t) { if ((t = (t = t.split("=")[0]).trim().replace(j, "")).length < 2)
        return ""; for (; t.length % 4 != 0;)
        t += "="; return t; }(t)); }
    function D(t, r, e, n) { for (var i = 0; i < n && !(i + e >= r.length || i >= t.length); ++i)
        r[i + e] = t[i]; return i; }
    function F(t, r) { return t instanceof r || null != t && null != t.constructor && null != t.constructor.name && t.constructor.name === r.name; }
    function N(t) { return t != t; }
    return {
        setters: [],
        execute: function () {
            for (r = { byteLength: function (r) { var t = u(r), e = t[0], n = t[1]; return 3 * (e + n) / 4 - n; }, toByteArray: function (r) { var t, o, a = u(r), h = a[0], c = a[1], d = new n(function (r, t, e) { return 3 * (t + e) / 4 - e; }(0, h, c)), f = 0, A = c > 0 ? h - 4 : h; for (o = 0; o < A; o += 4)
                    t = e[r.charCodeAt(o)] << 18 | e[r.charCodeAt(o + 1)] << 12 | e[r.charCodeAt(o + 2)] << 6 | e[r.charCodeAt(o + 3)], d[f++] = t >> 16 & 255, d[f++] = t >> 8 & 255, d[f++] = 255 & t; 2 === c && (t = e[r.charCodeAt(o)] << 2 | e[r.charCodeAt(o + 1)] >> 4, d[f++] = 255 & t); 1 === c && (t = e[r.charCodeAt(o)] << 10 | e[r.charCodeAt(o + 1)] << 4 | e[r.charCodeAt(o + 2)] >> 2, d[f++] = t >> 8 & 255, d[f++] = 255 & t); return d; }, fromByteArray: function (r) { for (var e, n = r.length, o = n % 3, a = [], h = 0, u = n - o; h < u; h += 16383)
                    a.push(c(r, h, h + 16383 > u ? u : h + 16383)); 1 === o ? (e = r[n - 1], a.push(t[e >> 2] + t[e << 4 & 63] + "==")) : 2 === o && (e = (r[n - 2] << 8) + r[n - 1], a.push(t[e >> 10] + t[e >> 4 & 63] + t[e << 2 & 63] + "=")); return a.join(""); } }, t = [], e = [], n = "undefined" != typeof Uint8Array ? Uint8Array : Array, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, h = o.length; a < h; ++a)
                t[a] = o[a], e[o.charCodeAt(a)] = a;
            e["-".charCodeAt(0)] = 62, e["_".charCodeAt(0)] = 63;
            a$1 = { read: function (a, t, o, r, h) { var M, f, p = 8 * h - r - 1, w = (1 << p) - 1, e = w >> 1, i = -7, N = o ? h - 1 : 0, n = o ? -1 : 1, u = a[t + N]; for (N += n, M = u & (1 << -i) - 1, u >>= -i, i += p; i > 0; M = 256 * M + a[t + N], N += n, i -= 8)
                    ; for (f = M & (1 << -i) - 1, M >>= -i, i += r; i > 0; f = 256 * f + a[t + N], N += n, i -= 8)
                    ; if (0 === M)
                    M = 1 - e;
                else {
                    if (M === w)
                        return f ? NaN : 1 / 0 * (u ? -1 : 1);
                    f += Math.pow(2, r), M -= e;
                } return (u ? -1 : 1) * f * Math.pow(2, M - r); }, write: function (a, t, o, r, h, M) { var f, p, w, e = 8 * M - h - 1, i = (1 << e) - 1, N = i >> 1, n = 23 === h ? Math.pow(2, -24) - Math.pow(2, -77) : 0, u = r ? 0 : M - 1, l = r ? 1 : -1, s = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0; for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (p = isNaN(t) ? 1 : 0, f = i) : (f = Math.floor(Math.log(t) / Math.LN2), t * (w = Math.pow(2, -f)) < 1 && (f--, w *= 2), (t += f + N >= 1 ? n / w : n * Math.pow(2, 1 - N)) * w >= 2 && (f++, w /= 2), f + N >= i ? (p = 0, f = i) : f + N >= 1 ? (p = (t * w - 1) * Math.pow(2, h), f += N) : (p = t * Math.pow(2, N - 1) * Math.pow(2, h), f = 0)); h >= 8; a[o + u] = 255 & p, u += l, p /= 256, h -= 8)
                    ; for (f = f << h | p, e += h; e > 0; a[o + u] = 255 & f, u += l, f /= 256, e -= 8)
                    ; a[o + u - l] |= 128 * s; } };
            e$1 = {}, n$1 = r, i = a$1, o$1 = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
            e$1.Buffer = u$1, e$1.SlowBuffer = function (t) { +t != t && (t = 0); return u$1.alloc(+t); }, e$1.INSPECT_MAX_BYTES = 50;
            e$1.kMaxLength = 2147483647, u$1.TYPED_ARRAY_SUPPORT = function () { try {
                var t = new Uint8Array(1), r = { foo: function () { return 42; } };
                return Object.setPrototypeOf(r, Uint8Array.prototype), Object.setPrototypeOf(t, r), 42 === t.foo();
            }
            catch (t) {
                return !1;
            } }(), u$1.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(u$1.prototype, "parent", { enumerable: !0, get: function () { if (u$1.isBuffer(this))
                    return this.buffer; } }), Object.defineProperty(u$1.prototype, "offset", { enumerable: !0, get: function () { if (u$1.isBuffer(this))
                    return this.byteOffset; } }), u$1.poolSize = 8192, u$1.from = function (t, r, e) { return s(t, r, e); }, Object.setPrototypeOf(u$1.prototype, Uint8Array.prototype), Object.setPrototypeOf(u$1, Uint8Array), u$1.alloc = function (t, r, e) { return function (t, r, e) { return h$1(t), t <= 0 ? f(t) : void 0 !== r ? "string" == typeof e ? f(t).fill(r, e) : f(t).fill(r) : f(t); }(t, r, e); }, u$1.allocUnsafe = function (t) { return a$2(t); }, u$1.allocUnsafeSlow = function (t) { return a$2(t); }, u$1.isBuffer = function (t) { return null != t && !0 === t._isBuffer && t !== u$1.prototype; }, u$1.compare = function (t, r) { if (F(t, Uint8Array) && (t = u$1.from(t, t.offset, t.byteLength)), F(r, Uint8Array) && (r = u$1.from(r, r.offset, r.byteLength)), !u$1.isBuffer(t) || !u$1.isBuffer(r))
                throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'); if (t === r)
                return 0; for (var e = t.length, n = r.length, i = 0, o = Math.min(e, n); i < o; ++i)
                if (t[i] !== r[i]) {
                    e = t[i], n = r[i];
                    break;
                } return e < n ? -1 : n < e ? 1 : 0; }, u$1.isEncoding = function (t) { switch (String(t).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le": return !0;
                default: return !1;
            } }, u$1.concat = function (t, r) { if (!Array.isArray(t))
                throw new TypeError('"list" argument must be an Array of Buffers'); if (0 === t.length)
                return u$1.alloc(0); var e; if (void 0 === r)
                for (r = 0, e = 0; e < t.length; ++e)
                    r += t[e].length; var n = u$1.allocUnsafe(r), i = 0; for (e = 0; e < t.length; ++e) {
                var o = t[e];
                if (F(o, Uint8Array) && (o = u$1.from(o)), !u$1.isBuffer(o))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                o.copy(n, i), i += o.length;
            } return n; }, u$1.byteLength = y, u$1.prototype._isBuffer = !0, u$1.prototype.swap16 = function () { var t = this.length; if (t % 2 != 0)
                throw new RangeError("Buffer size must be a multiple of 16-bits"); for (var r = 0; r < t; r += 2)
                w(this, r, r + 1); return this; }, u$1.prototype.swap32 = function () { var t = this.length; if (t % 4 != 0)
                throw new RangeError("Buffer size must be a multiple of 32-bits"); for (var r = 0; r < t; r += 4)
                w(this, r, r + 3), w(this, r + 1, r + 2); return this; }, u$1.prototype.swap64 = function () { var t = this.length; if (t % 8 != 0)
                throw new RangeError("Buffer size must be a multiple of 64-bits"); for (var r = 0; r < t; r += 8)
                w(this, r, r + 7), w(this, r + 1, r + 6), w(this, r + 2, r + 5), w(this, r + 3, r + 4); return this; }, u$1.prototype.toString = function () { var t = this.length; return 0 === t ? "" : 0 === arguments.length ? I(this, 0, t) : g.apply(this, arguments); }, u$1.prototype.toLocaleString = u$1.prototype.toString, u$1.prototype.equals = function (t) { if (!u$1.isBuffer(t))
                throw new TypeError("Argument must be a Buffer"); return this === t || 0 === u$1.compare(this, t); }, u$1.prototype.inspect = function () { var t = "", r = e$1.INSPECT_MAX_BYTES; return t = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (t += " ... "), "<Buffer " + t + ">"; }, o$1 && (u$1.prototype[o$1] = u$1.prototype.inspect), u$1.prototype.compare = function (t, r, e, n, i) { if (F(t, Uint8Array) && (t = u$1.from(t, t.offset, t.byteLength)), !u$1.isBuffer(t))
                throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t); if (void 0 === r && (r = 0), void 0 === e && (e = t ? t.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), r < 0 || e > t.length || n < 0 || i > this.length)
                throw new RangeError("out of range index"); if (n >= i && r >= e)
                return 0; if (n >= i)
                return -1; if (r >= e)
                return 1; if (this === t)
                return 0; for (var o = (i >>>= 0) - (n >>>= 0), f = (e >>>= 0) - (r >>>= 0), s = Math.min(o, f), h = this.slice(n, i), a = t.slice(r, e), p = 0; p < s; ++p)
                if (h[p] !== a[p]) {
                    o = h[p], f = a[p];
                    break;
                } return o < f ? -1 : f < o ? 1 : 0; }, u$1.prototype.includes = function (t, r, e) { return -1 !== this.indexOf(t, r, e); }, u$1.prototype.indexOf = function (t, r, e) { return d(this, t, r, e, !0); }, u$1.prototype.lastIndexOf = function (t, r, e) { return d(this, t, r, e, !1); }, u$1.prototype.write = function (t, r, e, n) { if (void 0 === r)
                n = "utf8", e = this.length, r = 0;
            else if (void 0 === e && "string" == typeof r)
                n = r, e = this.length, r = 0;
            else {
                if (!isFinite(r))
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                r >>>= 0, isFinite(e) ? (e >>>= 0, void 0 === n && (n = "utf8")) : (n = e, e = void 0);
            } var i = this.length - r; if ((void 0 === e || e > i) && (e = i), t.length > 0 && (e < 0 || r < 0) || r > this.length)
                throw new RangeError("Attempt to write outside buffer bounds"); n || (n = "utf8"); for (var o = !1;;)
                switch (n) {
                    case "hex": return b(this, t, r, e);
                    case "utf8":
                    case "utf-8": return m(this, t, r, e);
                    case "ascii": return E(this, t, r, e);
                    case "latin1":
                    case "binary": return B(this, t, r, e);
                    case "base64": return A(this, t, r, e);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le": return U(this, t, r, e);
                    default:
                        if (o)
                            throw new TypeError("Unknown encoding: " + n);
                        n = ("" + n).toLowerCase(), o = !0;
                } }, u$1.prototype.toJSON = function () { return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) }; };
            u$1.prototype.slice = function (t, r) { var e = this.length; (t = ~~t) < 0 ? (t += e) < 0 && (t = 0) : t > e && (t = e), (r = void 0 === r ? e : ~~r) < 0 ? (r += e) < 0 && (r = 0) : r > e && (r = e), r < t && (r = t); var n = this.subarray(t, r); return Object.setPrototypeOf(n, u$1.prototype), n; }, u$1.prototype.readUIntLE = function (t, r, e) { t >>>= 0, r >>>= 0, e || x(t, r, this.length); for (var n = this[t], i = 1, o = 0; ++o < r && (i *= 256);)
                n += this[t + o] * i; return n; }, u$1.prototype.readUIntBE = function (t, r, e) { t >>>= 0, r >>>= 0, e || x(t, r, this.length); for (var n = this[t + --r], i = 1; r > 0 && (i *= 256);)
                n += this[t + --r] * i; return n; }, u$1.prototype.readUInt8 = function (t, r) { return t >>>= 0, r || x(t, 1, this.length), this[t]; }, u$1.prototype.readUInt16LE = function (t, r) { return t >>>= 0, r || x(t, 2, this.length), this[t] | this[t + 1] << 8; }, u$1.prototype.readUInt16BE = function (t, r) { return t >>>= 0, r || x(t, 2, this.length), this[t] << 8 | this[t + 1]; }, u$1.prototype.readUInt32LE = function (t, r) { return t >>>= 0, r || x(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]; }, u$1.prototype.readUInt32BE = function (t, r) { return t >>>= 0, r || x(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]); }, u$1.prototype.readIntLE = function (t, r, e) { t >>>= 0, r >>>= 0, e || x(t, r, this.length); for (var n = this[t], i = 1, o = 0; ++o < r && (i *= 256);)
                n += this[t + o] * i; return n >= (i *= 128) && (n -= Math.pow(2, 8 * r)), n; }, u$1.prototype.readIntBE = function (t, r, e) { t >>>= 0, r >>>= 0, e || x(t, r, this.length); for (var n = r, i = 1, o = this[t + --n]; n > 0 && (i *= 256);)
                o += this[t + --n] * i; return o >= (i *= 128) && (o -= Math.pow(2, 8 * r)), o; }, u$1.prototype.readInt8 = function (t, r) { return t >>>= 0, r || x(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]; }, u$1.prototype.readInt16LE = function (t, r) { t >>>= 0, r || x(t, 2, this.length); var e = this[t] | this[t + 1] << 8; return 32768 & e ? 4294901760 | e : e; }, u$1.prototype.readInt16BE = function (t, r) { t >>>= 0, r || x(t, 2, this.length); var e = this[t + 1] | this[t] << 8; return 32768 & e ? 4294901760 | e : e; }, u$1.prototype.readInt32LE = function (t, r) { return t >>>= 0, r || x(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24; }, u$1.prototype.readInt32BE = function (t, r) { return t >>>= 0, r || x(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]; }, u$1.prototype.readFloatLE = function (t, r) { return t >>>= 0, r || x(t, 4, this.length), i.read(this, t, !0, 23, 4); }, u$1.prototype.readFloatBE = function (t, r) { return t >>>= 0, r || x(t, 4, this.length), i.read(this, t, !1, 23, 4); }, u$1.prototype.readDoubleLE = function (t, r) { return t >>>= 0, r || x(t, 8, this.length), i.read(this, t, !0, 52, 8); }, u$1.prototype.readDoubleBE = function (t, r) { return t >>>= 0, r || x(t, 8, this.length), i.read(this, t, !1, 52, 8); }, u$1.prototype.writeUIntLE = function (t, r, e, n) { (t = +t, r >>>= 0, e >>>= 0, n) || C(this, t, r, e, Math.pow(2, 8 * e) - 1, 0); var i = 1, o = 0; for (this[r] = 255 & t; ++o < e && (i *= 256);)
                this[r + o] = t / i & 255; return r + e; }, u$1.prototype.writeUIntBE = function (t, r, e, n) { (t = +t, r >>>= 0, e >>>= 0, n) || C(this, t, r, e, Math.pow(2, 8 * e) - 1, 0); var i = e - 1, o = 1; for (this[r + i] = 255 & t; --i >= 0 && (o *= 256);)
                this[r + i] = t / o & 255; return r + e; }, u$1.prototype.writeUInt8 = function (t, r, e) { return t = +t, r >>>= 0, e || C(this, t, r, 1, 255, 0), this[r] = 255 & t, r + 1; }, u$1.prototype.writeUInt16LE = function (t, r, e) { return t = +t, r >>>= 0, e || C(this, t, r, 2, 65535, 0), this[r] = 255 & t, this[r + 1] = t >>> 8, r + 2; }, u$1.prototype.writeUInt16BE = function (t, r, e) { return t = +t, r >>>= 0, e || C(this, t, r, 2, 65535, 0), this[r] = t >>> 8, this[r + 1] = 255 & t, r + 2; }, u$1.prototype.writeUInt32LE = function (t, r, e) { return t = +t, r >>>= 0, e || C(this, t, r, 4, 4294967295, 0), this[r + 3] = t >>> 24, this[r + 2] = t >>> 16, this[r + 1] = t >>> 8, this[r] = 255 & t, r + 4; }, u$1.prototype.writeUInt32BE = function (t, r, e) { return t = +t, r >>>= 0, e || C(this, t, r, 4, 4294967295, 0), this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = 255 & t, r + 4; }, u$1.prototype.writeIntLE = function (t, r, e, n) { if (t = +t, r >>>= 0, !n) {
                var i = Math.pow(2, 8 * e - 1);
                C(this, t, r, e, i - 1, -i);
            } var o = 0, f = 1, u = 0; for (this[r] = 255 & t; ++o < e && (f *= 256);)
                t < 0 && 0 === u && 0 !== this[r + o - 1] && (u = 1), this[r + o] = (t / f >> 0) - u & 255; return r + e; }, u$1.prototype.writeIntBE = function (t, r, e, n) { if (t = +t, r >>>= 0, !n) {
                var i = Math.pow(2, 8 * e - 1);
                C(this, t, r, e, i - 1, -i);
            } var o = e - 1, f = 1, u = 0; for (this[r + o] = 255 & t; --o >= 0 && (f *= 256);)
                t < 0 && 0 === u && 0 !== this[r + o + 1] && (u = 1), this[r + o] = (t / f >> 0) - u & 255; return r + e; }, u$1.prototype.writeInt8 = function (t, r, e) { return t = +t, r >>>= 0, e || C(this, t, r, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[r] = 255 & t, r + 1; }, u$1.prototype.writeInt16LE = function (t, r, e) { return t = +t, r >>>= 0, e || C(this, t, r, 2, 32767, -32768), this[r] = 255 & t, this[r + 1] = t >>> 8, r + 2; }, u$1.prototype.writeInt16BE = function (t, r, e) { return t = +t, r >>>= 0, e || C(this, t, r, 2, 32767, -32768), this[r] = t >>> 8, this[r + 1] = 255 & t, r + 2; }, u$1.prototype.writeInt32LE = function (t, r, e) { return t = +t, r >>>= 0, e || C(this, t, r, 4, 2147483647, -2147483648), this[r] = 255 & t, this[r + 1] = t >>> 8, this[r + 2] = t >>> 16, this[r + 3] = t >>> 24, r + 4; }, u$1.prototype.writeInt32BE = function (t, r, e) { return t = +t, r >>>= 0, e || C(this, t, r, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = 255 & t, r + 4; }, u$1.prototype.writeFloatLE = function (t, r, e) { return k(this, t, r, !0, e); }, u$1.prototype.writeFloatBE = function (t, r, e) { return k(this, t, r, !1, e); }, u$1.prototype.writeDoubleLE = function (t, r, e) { return M(this, t, r, !0, e); }, u$1.prototype.writeDoubleBE = function (t, r, e) { return M(this, t, r, !1, e); }, u$1.prototype.copy = function (t, r, e, n) { if (!u$1.isBuffer(t))
                throw new TypeError("argument should be a Buffer"); if (e || (e = 0), n || 0 === n || (n = this.length), r >= t.length && (r = t.length), r || (r = 0), n > 0 && n < e && (n = e), n === e)
                return 0; if (0 === t.length || 0 === this.length)
                return 0; if (r < 0)
                throw new RangeError("targetStart out of bounds"); if (e < 0 || e >= this.length)
                throw new RangeError("Index out of range"); if (n < 0)
                throw new RangeError("sourceEnd out of bounds"); n > this.length && (n = this.length), t.length - r < n - e && (n = t.length - r + e); var i = n - e; if (this === t && "function" == typeof Uint8Array.prototype.copyWithin)
                this.copyWithin(r, e, n);
            else if (this === t && e < r && r < n)
                for (var o = i - 1; o >= 0; --o)
                    t[o + r] = this[o + e];
            else
                Uint8Array.prototype.set.call(t, this.subarray(e, n), r); return i; }, u$1.prototype.fill = function (t, r, e, n) { if ("string" == typeof t) {
                if ("string" == typeof r ? (n = r, r = 0, e = this.length) : "string" == typeof e && (n = e, e = this.length), void 0 !== n && "string" != typeof n)
                    throw new TypeError("encoding must be a string");
                if ("string" == typeof n && !u$1.isEncoding(n))
                    throw new TypeError("Unknown encoding: " + n);
                if (1 === t.length) {
                    var i = t.charCodeAt(0);
                    ("utf8" === n && i < 128 || "latin1" === n) && (t = i);
                }
            }
            else
                "number" == typeof t ? t &= 255 : "boolean" == typeof t && (t = Number(t)); if (r < 0 || this.length < r || this.length < e)
                throw new RangeError("Out of range index"); if (e <= r)
                return this; var o; if (r >>>= 0, e = void 0 === e ? this.length : e >>> 0, t || (t = 0), "number" == typeof t)
                for (o = r; o < e; ++o)
                    this[o] = t;
            else {
                var f = u$1.isBuffer(t) ? t : u$1.from(t, n), s = f.length;
                if (0 === s)
                    throw new TypeError('The value "' + t + '" is invalid for argument "value"');
                for (o = 0; o < e - r; ++o)
                    this[o + r] = f[o % s];
            } return this; };
            j = /[^+/0-9A-Za-z-_]/g;
            Y = function () { for (var t = new Array(256), r = 0; r < 16; ++r)
                for (var e = 16 * r, n = 0; n < 16; ++n)
                    t[e + n] = "0123456789abcdef"[r] + "0123456789abcdef"[n]; return t; }();
            Buffer = e$1.Buffer;
            exports_4("Buffer", Buffer);
            INSPECT_MAX_BYTES = e$1.INSPECT_MAX_BYTES;
            exports_4("INSPECT_MAX_BYTES", INSPECT_MAX_BYTES);
            kMaxLength = e$1.kMaxLength;
            exports_4("kMaxLength", kMaxLength);
            exports_4("default", e$1);
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/util", ["https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-dac557ba", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-0c2d1322"], function (exports_5, context_5) {
    "use strict";
    var chunk_dac557ba_js_1, _extend, callbackify, debuglog, deprecate, format, inherits, inspect, isArray, isBoolean, isBuffer, isDate, isError, isFunction, isNull, isNullOrUndefined, isNumber, isObject, isPrimitive, isRegExp, isString, isSymbol, isUndefined, log, promisify;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (chunk_dac557ba_js_1_1) {
                chunk_dac557ba_js_1 = chunk_dac557ba_js_1_1;
            },
            function (_1) {
            }
        ],
        execute: function () {
            _extend = chunk_dac557ba_js_1.u._extend;
            exports_5("_extend", _extend);
            callbackify = chunk_dac557ba_js_1.u.callbackify;
            exports_5("callbackify", callbackify);
            debuglog = chunk_dac557ba_js_1.u.debuglog;
            exports_5("debuglog", debuglog);
            deprecate = chunk_dac557ba_js_1.u.deprecate;
            exports_5("deprecate", deprecate);
            format = chunk_dac557ba_js_1.u.format;
            exports_5("format", format);
            inherits = chunk_dac557ba_js_1.u.inherits;
            exports_5("inherits", inherits);
            inspect = chunk_dac557ba_js_1.u.inspect;
            exports_5("inspect", inspect);
            isArray = chunk_dac557ba_js_1.u.isArray;
            exports_5("isArray", isArray);
            isBoolean = chunk_dac557ba_js_1.u.isBoolean;
            exports_5("isBoolean", isBoolean);
            isBuffer = chunk_dac557ba_js_1.u.isBuffer;
            exports_5("isBuffer", isBuffer);
            isDate = chunk_dac557ba_js_1.u.isDate;
            exports_5("isDate", isDate);
            isError = chunk_dac557ba_js_1.u.isError;
            exports_5("isError", isError);
            isFunction = chunk_dac557ba_js_1.u.isFunction;
            exports_5("isFunction", isFunction);
            isNull = chunk_dac557ba_js_1.u.isNull;
            exports_5("isNull", isNull);
            isNullOrUndefined = chunk_dac557ba_js_1.u.isNullOrUndefined;
            exports_5("isNullOrUndefined", isNullOrUndefined);
            isNumber = chunk_dac557ba_js_1.u.isNumber;
            exports_5("isNumber", isNumber);
            isObject = chunk_dac557ba_js_1.u.isObject;
            exports_5("isObject", isObject);
            isPrimitive = chunk_dac557ba_js_1.u.isPrimitive;
            exports_5("isPrimitive", isPrimitive);
            isRegExp = chunk_dac557ba_js_1.u.isRegExp;
            exports_5("isRegExp", isRegExp);
            isString = chunk_dac557ba_js_1.u.isString;
            exports_5("isString", isString);
            isSymbol = chunk_dac557ba_js_1.u.isSymbol;
            exports_5("isSymbol", isSymbol);
            isUndefined = chunk_dac557ba_js_1.u.isUndefined;
            exports_5("isUndefined", isUndefined);
            log = chunk_dac557ba_js_1.u.log;
            exports_5("log", log);
            promisify = chunk_dac557ba_js_1.u.promisify;
            exports_5("promisify", promisify);
            exports_5("default", chunk_dac557ba_js_1.u);
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-6e68c801", ["https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/buffer"], function (exports_6, context_6) {
    "use strict";
    var buffer_js_1, e, n, o, u, e$1, s, i;
    var __moduleName = context_6 && context_6.id;
    function t(r, e) {
        for (var n in r)
            e[n] = r[n];
    }
    function f(r, e, n) {
        return o(r, e, n);
    }
    function a(t) {
        var e;
        switch (this.encoding = function (t) {
            var e = function (t) {
                if (!t)
                    return "utf8";
                for (var e;;)
                    switch (t) {
                        case "utf8":
                        case "utf-8":
                            return "utf8";
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return "utf16le";
                        case "latin1":
                        case "binary":
                            return "latin1";
                        case "base64":
                        case "ascii":
                        case "hex":
                            return t;
                        default:
                            if (e)
                                return;
                            t = ("" + t).toLowerCase(), e = !0;
                    }
            }(t);
            if ("string" != typeof e && (s.isEncoding === i || !i(t)))
                throw new Error("Unknown encoding: " + t);
            return e || t;
        }(t), this.encoding) {
            case "utf16le":
                this.text = h, this.end = l, e = 4;
                break;
            case "utf8":
                this.fillLast = n$1, e = 4;
                break;
            case "base64":
                this.text = u$1, this.end = o$1, e = 3;
                break;
            default:
                return this.write = f$1, this.end = c, void 0;
        }
        this.lastNeed = 0, this.lastTotal = 0, this.lastChar = s.allocUnsafe(e);
    }
    function r(t) {
        return t <= 127 ? 0 : t >> 5 == 6 ? 2 : t >> 4 == 14 ? 3 : t >> 3 == 30 ? 4 : t >> 6 == 2 ? -1 : -2;
    }
    function n$1(t) {
        var e = this.lastTotal - this.lastNeed, s = function (t, e, s) {
            if (128 != (192 & e[0]))
                return t.lastNeed = 0, "�";
            if (t.lastNeed > 1 && e.length > 1) {
                if (128 != (192 & e[1]))
                    return t.lastNeed = 1, "�";
                if (t.lastNeed > 2 && e.length > 2 && 128 != (192 & e[2]))
                    return t.lastNeed = 2, "�";
            }
        }(this, t);
        return void 0 !== s ? s : this.lastNeed <= t.length ? (t.copy(this.lastChar, e, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (t.copy(this.lastChar, e, 0, t.length), this.lastNeed -= t.length, void 0);
    }
    function h(t, e) {
        if ((t.length - e) % 2 == 0) {
            var s = t.toString("utf16le", e);
            if (s) {
                var i = s.charCodeAt(s.length - 1);
                if (i >= 55296 && i <= 56319)
                    return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1], s.slice(0, -1);
            }
            return s;
        }
        return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = t[t.length - 1], t.toString("utf16le", e, t.length - 1);
    }
    function l(t) {
        var e = t && t.length ? this.write(t) : "";
        if (this.lastNeed) {
            var s = this.lastTotal - this.lastNeed;
            return e + this.lastChar.toString("utf16le", 0, s);
        }
        return e;
    }
    function u$1(t, e) {
        var s = (t.length - e) % 3;
        return 0 === s ? t.toString("base64", e) : (this.lastNeed = 3 - s, this.lastTotal = 3, 1 === s ? this.lastChar[0] = t[t.length - 1] : (this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1]), t.toString("base64", e, t.length - s));
    }
    function o$1(t) {
        var e = t && t.length ? this.write(t) : "";
        return this.lastNeed ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : e;
    }
    function f$1(t) {
        return t.toString(this.encoding);
    }
    function c(t) {
        return t && t.length ? this.write(t) : "";
    }
    return {
        setters: [
            function (buffer_js_1_1) {
                buffer_js_1 = buffer_js_1_1;
            }
        ],
        execute: function () {
            e = {}, n = buffer_js_1.default, o = n.Buffer;
            o.from && o.alloc && o.allocUnsafe && o.allocUnsafeSlow ? e = n : (t(n, e), e.Buffer = f), f.prototype = Object.create(o.prototype), t(o, f), f.from = function (r, e, n) {
                if ("number" == typeof r)
                    throw new TypeError("Argument must not be a number");
                return o(r, e, n);
            }, f.alloc = function (r, e, n) {
                if ("number" != typeof r)
                    throw new TypeError("Argument must be a number");
                var t = o(r);
                return void 0 !== e ? "string" == typeof n ? t.fill(e, n) : t.fill(e) : t.fill(0), t;
            }, f.allocUnsafe = function (r) {
                if ("number" != typeof r)
                    throw new TypeError("Argument must be a number");
                return o(r);
            }, f.allocUnsafeSlow = function (r) {
                if ("number" != typeof r)
                    throw new TypeError("Argument must be a number");
                return n.SlowBuffer(r);
            };
            u = e;
            exports_6("r", u);
            e$1 = {}, s = u.Buffer, i = s.isEncoding || function (t) {
                switch ((t = "" + t) && t.toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                    case "raw":
                        return !0;
                    default:
                        return !1;
                }
            };
            exports_6("s", e$1);
            e$1.StringDecoder = a, a.prototype.write = function (t) {
                if (0 === t.length)
                    return "";
                var e, s;
                if (this.lastNeed) {
                    if (void 0 === (e = this.fillLast(t)))
                        return "";
                    s = this.lastNeed, this.lastNeed = 0;
                }
                else
                    s = 0;
                return s < t.length ? e ? e + this.text(t, s) : this.text(t, s) : e || "";
            }, a.prototype.end = function (t) {
                var e = t && t.length ? this.write(t) : "";
                return this.lastNeed ? e + "�" : e;
            }, a.prototype.text = function (t, e) {
                var s = function (t, e, s) {
                    var i = e.length - 1;
                    if (i < s)
                        return 0;
                    var a = r(e[i]);
                    if (a >= 0)
                        return a > 0 && (t.lastNeed = a - 1), a;
                    if (--i < s || -2 === a)
                        return 0;
                    if ((a = r(e[i])) >= 0)
                        return a > 0 && (t.lastNeed = a - 2), a;
                    if (--i < s || -2 === a)
                        return 0;
                    if ((a = r(e[i])) >= 0)
                        return a > 0 && (2 === a ? a = 0 : t.lastNeed = a - 3), a;
                    return 0;
                }(this, t, e);
                if (!this.lastNeed)
                    return t.toString("utf8", e);
                this.lastTotal = s;
                var i = t.length - (s - this.lastNeed);
                return t.copy(this.lastChar, 0, i), t.toString("utf8", e, i);
            }, a.prototype.fillLast = function (t) {
                if (this.lastNeed <= t.length)
                    return t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
                t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t.length), this.lastNeed -= t.length;
            };
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/events", [], function (exports_7, context_7) {
    "use strict";
    var e, t, n, r, i, s, y, EventEmitter, defaultMaxListeners, init, listenerCount;
    var __moduleName = context_7 && context_7.id;
    function o() { o.init.call(this); }
    function u(e) { if ("function" != typeof e)
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e); }
    function f(e) { return void 0 === e._maxListeners ? o.defaultMaxListeners : e._maxListeners; }
    function v(e, t, n, r) { var i, o, s, v; if (u(n), void 0 === (o = e._events) ? (o = e._events = Object.create(null), e._eventsCount = 0) : (void 0 !== o.newListener && (e.emit("newListener", t, n.listener ? n.listener : n), o = e._events), s = o[t]), void 0 === s)
        s = o[t] = n, ++e._eventsCount;
    else if ("function" == typeof s ? s = o[t] = r ? [n, s] : [s, n] : r ? s.unshift(n) : s.push(n), (i = f(e)) > 0 && s.length > i && !s.warned) {
        s.warned = !0;
        var a = new Error("Possible EventEmitter memory leak detected. " + s.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        a.name = "MaxListenersExceededWarning", a.emitter = e, a.type = t, a.count = s.length, v = a, console && console.warn && console.warn(v);
    } return e; }
    function a() { if (!this.fired)
        return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments); }
    function l(e, t, n) { var r = { fired: !1, wrapFn: void 0, target: e, type: t, listener: n }, i = a.bind(r); return i.listener = n, r.wrapFn = i, i; }
    function h(e, t, n) { var r = e._events; if (void 0 === r)
        return []; var i = r[t]; return void 0 === i ? [] : "function" == typeof i ? n ? [i.listener || i] : [i] : n ? function (e) { for (var t = new Array(e.length), n = 0; n < t.length; ++n)
        t[n] = e[n].listener || e[n]; return t; }(i) : c(i, i.length); }
    function p(e) { var t = this._events; if (void 0 !== t) {
        var n = t[e];
        if ("function" == typeof n)
            return 1;
        if (void 0 !== n)
            return n.length;
    } return 0; }
    function c(e, t) { for (var n = new Array(t), r = 0; r < t; ++r)
        n[r] = e[r]; return n; }
    return {
        setters: [],
        execute: function () {
            n = "object" == typeof Reflect ? Reflect : null, r = n && "function" == typeof n.apply ? n.apply : function (e, t, n) { return Function.prototype.apply.call(e, t, n); };
            t = n && "function" == typeof n.ownKeys ? n.ownKeys : Object.getOwnPropertySymbols ? function (e) { return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e)); } : function (e) { return Object.getOwnPropertyNames(e); };
            i = Number.isNaN || function (e) { return e != e; };
            e = o, o.EventEmitter = o, o.prototype._events = void 0, o.prototype._eventsCount = 0, o.prototype._maxListeners = void 0;
            s = 10;
            Object.defineProperty(o, "defaultMaxListeners", { enumerable: !0, get: function () { return s; }, set: function (e) { if ("number" != typeof e || e < 0 || i(e))
                    throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + "."); s = e; } }), o.init = function () { void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0; }, o.prototype.setMaxListeners = function (e) { if ("number" != typeof e || e < 0 || i(e))
                throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + "."); return this._maxListeners = e, this; }, o.prototype.getMaxListeners = function () { return f(this); }, o.prototype.emit = function (e) { for (var t = [], n = 1; n < arguments.length; n++)
                t.push(arguments[n]); var i = "error" === e, o = this._events; if (void 0 !== o)
                i = i && void 0 === o.error;
            else if (!i)
                return !1; if (i) {
                var s;
                if (t.length > 0 && (s = t[0]), s instanceof Error)
                    throw s;
                var u = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
                throw u.context = s, u;
            } var f = o[e]; if (void 0 === f)
                return !1; if ("function" == typeof f)
                r(f, this, t);
            else {
                var v = f.length, a = c(f, v);
                for (n = 0; n < v; ++n)
                    r(a[n], this, t);
            } return !0; }, o.prototype.addListener = function (e, t) { return v(this, e, t, !1); }, o.prototype.on = o.prototype.addListener, o.prototype.prependListener = function (e, t) { return v(this, e, t, !0); }, o.prototype.once = function (e, t) { return u(t), this.on(e, l(this, e, t)), this; }, o.prototype.prependOnceListener = function (e, t) { return u(t), this.prependListener(e, l(this, e, t)), this; }, o.prototype.removeListener = function (e, t) { var n, r, i, o, s; if (u(t), void 0 === (r = this._events))
                return this; if (void 0 === (n = r[e]))
                return this; if (n === t || n.listener === t)
                0 == --this._eventsCount ? this._events = Object.create(null) : (delete r[e], r.removeListener && this.emit("removeListener", e, n.listener || t));
            else if ("function" != typeof n) {
                for (i = -1, o = n.length - 1; o >= 0; o--)
                    if (n[o] === t || n[o].listener === t) {
                        s = n[o].listener, i = o;
                        break;
                    }
                if (i < 0)
                    return this;
                0 === i ? n.shift() : !function (e, t) { for (; t + 1 < e.length; t++)
                    e[t] = e[t + 1]; e.pop(); }(n, i), 1 === n.length && (r[e] = n[0]), void 0 !== r.removeListener && this.emit("removeListener", e, s || t);
            } return this; }, o.prototype.off = o.prototype.removeListener, o.prototype.removeAllListeners = function (e) { var t, n, r; if (void 0 === (n = this._events))
                return this; if (void 0 === n.removeListener)
                return 0 === arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== n[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete n[e]), this; if (0 === arguments.length) {
                var i, o = Object.keys(n);
                for (r = 0; r < o.length; ++r)
                    "removeListener" !== (i = o[r]) && this.removeAllListeners(i);
                return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this;
            } if ("function" == typeof (t = n[e]))
                this.removeListener(e, t);
            else if (void 0 !== t)
                for (r = t.length - 1; r >= 0; r--)
                    this.removeListener(e, t[r]); return this; }, o.prototype.listeners = function (e) { return h(this, e, !0); }, o.prototype.rawListeners = function (e) { return h(this, e, !1); }, o.listenerCount = function (e, t) { return "function" == typeof e.listenerCount ? e.listenerCount(t) : p.call(e, t); }, o.prototype.listenerCount = p, o.prototype.eventNames = function () { return this._eventsCount > 0 ? t(this._events) : []; };
            y = e;
            EventEmitter = y.EventEmitter;
            exports_7("EventEmitter", EventEmitter);
            defaultMaxListeners = y.defaultMaxListeners;
            exports_7("defaultMaxListeners", defaultMaxListeners);
            init = y.init;
            exports_7("init", init);
            listenerCount = y.listenerCount;
            exports_7("listenerCount", listenerCount);
            exports_7("default", y);
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-cffba9d4", ["https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-dac557ba", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-0c2d1322", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/buffer", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/util", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-6e68c801", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/events"], function (exports_8, context_8) {
    "use strict";
    var chunk_dac557ba_js_2, chunk_0c2d1322_js_2, buffer_js_2, util_js_1, chunk_6e68c801_js_1, events_js_1, e, e$1, t, r$1, r$2, t$1, c, b, p, g, y, m, S, R, k, M, j, O, P, x, L, D, C, A, q, W, U, H, F, V, G, Y, z, J, Q, Z, $, t$2, r$3, n$1, b$1, p$1, g$1, y$1, w$1, S$1, R$1, k$1, E$1, M$1, O$1, T$1, x$1, P$1, D$1, L$1, C$1, A$1, I$1, N$1, U$1, H$1, F$1, V$1, Y$1, K$1, z$1, Q$1, X$1, t$4, t$5, n$2, i, a, o, s, f$2, h$2, p$2, o$1, e$3, s$1, t$6, o$2, e$4, f$3, v$2;
    var __moduleName = context_8 && context_8.id;
    function n(e, n, r) {
        r || (r = Error);
        class o extends r {
            constructor(e, t, r) {
                super(function (e, t, r) {
                    return "string" == typeof n ? n : n(e, t, r);
                }(e, t, r));
            }
        }
        o.prototype.name = r.name, o.prototype.code = e, t[e] = o;
    }
    function r(e, t) {
        if (Array.isArray(e)) {
            const n = e.length;
            return e = e.map(e => String(e)), n > 2 ? `one of ${t} ${e.slice(0, n - 1).join(", ")}, or ` + e[n - 1] : 2 === n ? `one of ${t} ${e[0]} or ${e[1]}` : `of ${t} ${e[0]}`;
        }
        return `of ${t} ${String(e)}`;
    }
    function e$2(e) {
        try {
            if (!r$2.localStorage)
                return !1;
        }
        catch (r) {
            return !1;
        }
        var t = r$2.localStorage[e];
        return null != t && "true" === String(t).toLowerCase();
    }
    function u(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            t && (r = r.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })), n.push.apply(n, r);
        }
        return n;
    }
    function f(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e;
    }
    function h(e, t) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
    }
    function w(e, t) {
        _(e, t), v(e);
    }
    function v(e) {
        e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close");
    }
    function _(e, t) {
        e.emit("error", t);
    }
    function E() { }
    function T(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e;
    }
    function B(e, t) {
        return {
            value: e,
            done: t
        };
    }
    function I(e) {
        var t = e[x];
        if (null !== t) {
            var n = e[W].read();
            null !== n && (e[A] = null, e[x] = null, e[L] = null, t(B(n, !1)));
        }
    }
    function N(e) {
        O.nextTick(I, e);
    }
    function K() {
        if (G)
            return V;
        G = !0;
        var d, u = chunk_0c2d1322_js_2.h;
        V = C, C.ReadableState = D;
        events_js_1.default.EventEmitter;
        var f = function (e, t) {
            return e.listeners(t).length;
        }, h = e, c = buffer_js_2.default.Buffer, b = Y.Uint8Array || function () { };
        var p, y = util_js_1.default;
        p = y && y.debuglog ? y.debuglog("stream") : function () { };
        var w, v, _, S = g, k = m, E = R.getHighWaterMark, M = e$1.codes, j = M.ERR_INVALID_ARG_TYPE, O = M.ERR_STREAM_PUSH_AFTER_EOF, T = M.ERR_METHOD_NOT_IMPLEMENTED, P = M.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
        chunk_dac557ba_js_2.t(C, h);
        var x = k.errorOrDestroy, L = ["error", "close", "destroy", "pause", "resume"];
        function D(e, t, n) {
            d = d || ee(), e = e || {}, "boolean" != typeof n && (n = t instanceof d), this.objectMode = !!e.objectMode, n && (this.objectMode = this.objectMode || !!e.readableObjectMode), this.highWaterMark = E(this, e, "readableHighWaterMark", n), this.buffer = new S(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = !1 !== e.emitClose, this.autoDestroy = !!e.autoDestroy, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (w || (w = chunk_6e68c801_js_1.s.StringDecoder), this.decoder = new w(e.encoding), this.encoding = e.encoding);
        }
        function C(e) {
            if (d = d || ee(), !(this instanceof C))
                return new C(e);
            var t = this instanceof d;
            this._readableState = new D(e, this, t), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), "function" == typeof e.destroy && (this._destroy = e.destroy)), h.call(this);
        }
        function A(e, t, n, r, i) {
            p("readableAddChunk", t);
            var a, o = e._readableState;
            if (null === t)
                o.reading = !1, function (e, t) {
                    if (p("onEofChunk"), t.ended)
                        return;
                    if (t.decoder) {
                        var n = t.decoder.end();
                        n && n.length && (t.buffer.push(n), t.length += t.objectMode ? 1 : n.length);
                    }
                    t.ended = !0, t.sync ? B(e) : (t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, I(e)));
                }(e, o);
            else if (i || (a = function (e, t) {
                var n;
                r = t, c.isBuffer(r) || r instanceof b || "string" == typeof t || void 0 === t || e.objectMode || (n = new j("chunk", ["string", "Buffer", "Uint8Array"], t));
                var r;
                return n;
            }(o, t)), a)
                x(e, a);
            else if (o.objectMode || t && t.length > 0) {
                if ("string" == typeof t || o.objectMode || Object.getPrototypeOf(t) === c.prototype || (t = function (e) {
                    return c.from(e);
                }(t)), r)
                    o.endEmitted ? x(e, new P()) : q(e, o, t, !0);
                else if (o.ended)
                    x(e, new O());
                else {
                    if (o.destroyed)
                        return !1;
                    o.reading = !1, o.decoder && !n ? (t = o.decoder.write(t), o.objectMode || 0 !== t.length ? q(e, o, t, !1) : N(e, o)) : q(e, o, t, !1);
                }
            }
            else
                r || (o.reading = !1, N(e, o));
            return !o.ended && (o.length < o.highWaterMark || 0 === o.length);
        }
        function q(e, t, n, r) {
            t.flowing && 0 === t.length && !t.sync ? (t.awaitDrain = 0, e.emit("data", n)) : (t.length += t.objectMode ? 1 : n.length, r ? t.buffer.unshift(n) : t.buffer.push(n), t.needReadable && B(e)), N(e, t);
        }
        Object.defineProperty(C.prototype, "destroyed", {
            enumerable: !1,
            get: function () {
                return void 0 !== this._readableState && this._readableState.destroyed;
            },
            set: function (e) {
                this._readableState && (this._readableState.destroyed = e);
            }
        }), C.prototype.destroy = k.destroy, C.prototype._undestroy = k.undestroy, C.prototype._destroy = function (e, t) {
            t(e);
        }, C.prototype.push = function (e, t) {
            var n, r = this._readableState;
            return r.objectMode ? n = !0 : "string" == typeof e && ((t = t || r.defaultEncoding) !== r.encoding && (e = c.from(e, t), t = ""), n = !0), A(this, e, t, !1, n);
        }, C.prototype.unshift = function (e) {
            return A(this, e, null, !0, !1);
        }, C.prototype.isPaused = function () {
            return !1 === this._readableState.flowing;
        }, C.prototype.setEncoding = function (e) {
            w || (w = chunk_6e68c801_js_1.s.StringDecoder);
            var t = new w(e);
            this._readableState.decoder = t, this._readableState.encoding = this._readableState.decoder.encoding;
            for (var n = this._readableState.buffer.head, r = ""; null !== n;)
                r += t.write(n.data), n = n.next;
            return this._readableState.buffer.clear(), "" !== r && this._readableState.buffer.push(r), this._readableState.length = r.length, this;
        };
        function W(e, t) {
            return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function (e) {
                return e >= 1073741824 ? e = 1073741824 : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
            }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
        }
        function B(e) {
            var t = e._readableState;
            p("emitReadable", t.needReadable, t.emittedReadable), t.needReadable = !1, t.emittedReadable || (p("emitReadable", t.flowing), t.emittedReadable = !0, u.nextTick(I, e));
        }
        function I(e) {
            var t = e._readableState;
            p("emitReadable_", t.destroyed, t.length, t.ended), t.destroyed || !t.length && !t.ended || (e.emit("readable"), t.emittedReadable = !1), t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark, J(e);
        }
        function N(e, t) {
            t.readingMore || (t.readingMore = !0, u.nextTick(U, e, t));
        }
        function U(e, t) {
            for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length);) {
                var n = t.length;
                if (p("maybeReadMore read 0"), e.read(0), n === t.length)
                    break;
            }
            t.readingMore = !1;
        }
        function H(e) {
            var t = e._readableState;
            t.readableListening = e.listenerCount("readable") > 0, t.resumeScheduled && !t.paused ? t.flowing = !0 : e.listenerCount("data") > 0 && e.resume();
        }
        function K(e) {
            p("readable nexttick read 0"), e.read(0);
        }
        function z(e, t) {
            p("resume", t.reading), t.reading || e.read(0), t.resumeScheduled = !1, e.emit("resume"), J(e), t.flowing && !t.reading && e.read(0);
        }
        function J(e) {
            var t = e._readableState;
            for (p("flow", t.flowing); t.flowing && null !== e.read();)
                ;
        }
        function Q(e, t) {
            return 0 === t.length ? null : (t.objectMode ? n = t.buffer.shift() : !e || e >= t.length ? (n = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length), t.buffer.clear()) : n = t.buffer.consume(e, t.decoder), n);
            var n;
        }
        function X(e) {
            var t = e._readableState;
            p("endReadable", t.endEmitted), t.endEmitted || (t.ended = !0, u.nextTick(Z, t, e));
        }
        function Z(e, t) {
            if (p("endReadableNT", e.endEmitted, e.length), !e.endEmitted && 0 === e.length && (e.endEmitted = !0, t.readable = !1, t.emit("end"), e.autoDestroy)) {
                var n = t._writableState;
                (!n || n.autoDestroy && n.finished) && t.destroy();
            }
        }
        function $(e, t) {
            for (var n = 0, r = e.length; n < r; n++)
                if (e[n] === t)
                    return n;
            return -1;
        }
        return C.prototype.read = function (e) {
            p("read", e), e = parseInt(e, 10);
            var t = this._readableState, n = e;
            if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : t.length > 0) || t.ended))
                return p("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? X(this) : B(this), null;
            if (0 === (e = W(e, t)) && t.ended)
                return 0 === t.length && X(this), null;
            var r, i = t.needReadable;
            return p("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && p("length less than watermark", i = !0), t.ended || t.reading ? p("reading or ended", i = !1) : i && (p("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = W(n, t))), null === (r = e > 0 ? Q(e, t) : null) ? (t.needReadable = t.length <= t.highWaterMark, e = 0) : (t.length -= e, t.awaitDrain = 0), 0 === t.length && (t.ended || (t.needReadable = !0), n !== e && t.ended && X(this)), null !== r && this.emit("data", r), r;
        }, C.prototype._read = function (e) {
            x(this, new T("_read()"));
        }, C.prototype.pipe = function (e, t) {
            var n = this, r = this._readableState;
            switch (r.pipesCount) {
                case 0:
                    r.pipes = e;
                    break;
                case 1:
                    r.pipes = [r.pipes, e];
                    break;
                default:
                    r.pipes.push(e);
            }
            r.pipesCount += 1, p("pipe count=%d opts=%j", r.pipesCount, t);
            var i = (!t || !1 !== t.end) && e !== u.stdout && e !== u.stderr ? o : g;
            function a(t, i) {
                p("onunpipe"), t === n && i && !1 === i.hasUnpiped && (i.hasUnpiped = !0, p("cleanup"), e.removeListener("close", c), e.removeListener("finish", b), e.removeListener("drain", s), e.removeListener("error", h), e.removeListener("unpipe", a), n.removeListener("end", o), n.removeListener("end", g), n.removeListener("data", d), l = !0, !r.awaitDrain || e._writableState && !e._writableState.needDrain || s());
            }
            function o() {
                p("onend"), e.end();
            }
            r.endEmitted ? u.nextTick(i) : n.once("end", i), e.on("unpipe", a);
            var s = function (e) {
                return function () {
                    var t = e._readableState;
                    p("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && f(e, "data") && (t.flowing = !0, J(e));
                };
            }(n);
            e.on("drain", s);
            var l = !1;
            function d(t) {
                p("ondata");
                var i = e.write(t);
                p("dest.write", i), !1 === i && ((1 === r.pipesCount && r.pipes === e || r.pipesCount > 1 && -1 !== $(r.pipes, e)) && !l && (p("false write response, pause", r.awaitDrain), r.awaitDrain++), n.pause());
            }
            function h(t) {
                p("onerror", t), g(), e.removeListener("error", h), 0 === f(e, "error") && x(e, t);
            }
            function c() {
                e.removeListener("finish", b), g();
            }
            function b() {
                p("onfinish"), e.removeListener("close", c), g();
            }
            function g() {
                p("unpipe"), n.unpipe(e);
            }
            return n.on("data", d), function (e, t, n) {
                if ("function" == typeof e.prependListener)
                    return e.prependListener(t, n);
                e._events && e._events[t] ? Array.isArray(e._events[t]) ? e._events[t].unshift(n) : e._events[t] = [n, e._events[t]] : e.on(t, n);
            }(e, "error", h), e.once("close", c), e.once("finish", b), e.emit("pipe", n), r.flowing || (p("pipe resume"), n.resume()), e;
        }, C.prototype.unpipe = function (e) {
            var t = this._readableState, n = {
                hasUnpiped: !1
            };
            if (0 === t.pipesCount)
                return this;
            if (1 === t.pipesCount)
                return e && e !== t.pipes || (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, n)), this;
            if (!e) {
                var r = t.pipes, i = t.pipesCount;
                t.pipes = null, t.pipesCount = 0, t.flowing = !1;
                for (var a = 0; a < i; a++)
                    r[a].emit("unpipe", this, {
                        hasUnpiped: !1
                    });
                return this;
            }
            var o = $(t.pipes, e);
            return -1 === o || (t.pipes.splice(o, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, n)), this;
        }, C.prototype.on = function (e, t) {
            var n = h.prototype.on.call(this, e, t), r = this._readableState;
            return "data" === e ? (r.readableListening = this.listenerCount("readable") > 0, !1 !== r.flowing && this.resume()) : "readable" === e && (r.endEmitted || r.readableListening || (r.readableListening = r.needReadable = !0, r.flowing = !1, r.emittedReadable = !1, p("on readable", r.length, r.reading), r.length ? B(this) : r.reading || u.nextTick(K, this))), n;
        }, C.prototype.addListener = C.prototype.on, C.prototype.removeListener = function (e, t) {
            var n = h.prototype.removeListener.call(this, e, t);
            return "readable" === e && u.nextTick(H, this), n;
        }, C.prototype.removeAllListeners = function (e) {
            var t = h.prototype.removeAllListeners.apply(this, arguments);
            return "readable" !== e && void 0 !== e || u.nextTick(H, this), t;
        }, C.prototype.resume = function () {
            var e = this._readableState;
            return e.flowing || (p("resume"), e.flowing = !e.readableListening, function (e, t) {
                t.resumeScheduled || (t.resumeScheduled = !0, u.nextTick(z, e, t));
            }(this, e)), e.paused = !1, this;
        }, C.prototype.pause = function () {
            return p("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (p("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
        }, C.prototype.wrap = function (e) {
            var t = this, n = this._readableState, r = !1;
            for (var i in e.on("end", function () {
                if (p("wrapped end"), n.decoder && !n.ended) {
                    var e = n.decoder.end();
                    e && e.length && t.push(e);
                }
                t.push(null);
            }), e.on("data", function (i) {
                (p("wrapped data"), n.decoder && (i = n.decoder.write(i)), n.objectMode && null == i) || (n.objectMode || i && i.length) && (t.push(i) || (r = !0, e.pause()));
            }), e)
                void 0 === this[i] && "function" == typeof e[i] && (this[i] = function (t) {
                    return function () {
                        return e[t].apply(e, arguments);
                    };
                }(i));
            for (var a = 0; a < L.length; a++)
                e.on(L[a], this.emit.bind(this, L[a]));
            return this._read = function (t) {
                p("wrapped _read", t), r && (r = !1, e.resume());
            }, this;
        }, "function" == typeof Symbol && (C.prototype[Symbol.asyncIterator] = function () {
            return void 0 === v && (v = F), v(this);
        }), Object.defineProperty(C.prototype, "readableHighWaterMark", {
            enumerable: !1,
            get: function () {
                return this._readableState.highWaterMark;
            }
        }), Object.defineProperty(C.prototype, "readableBuffer", {
            enumerable: !1,
            get: function () {
                return this._readableState && this._readableState.buffer;
            }
        }), Object.defineProperty(C.prototype, "readableFlowing", {
            enumerable: !1,
            get: function () {
                return this._readableState.flowing;
            },
            set: function (e) {
                this._readableState && (this._readableState.flowing = e);
            }
        }), C._fromList = Q, Object.defineProperty(C.prototype, "readableLength", {
            enumerable: !1,
            get: function () {
                return this._readableState.length;
            }
        }), "function" == typeof Symbol && (C.from = function (e, t) {
            return void 0 === _ && (_ = r$1), _(C, e, t);
        }), V;
    }
    function X() {
        if (J)
            return z;
        J = !0;
        var e$2, r = chunk_0c2d1322_js_2.h;
        function s(e) {
            var t = this;
            this.next = null, this.entry = null, this.finish = function () {
                !function (e, t, n) {
                    var r = e.entry;
                    e.entry = null;
                    for (; r;) {
                        var i = r.callback;
                        t.pendingcb--, i(n), r = r.next;
                    }
                    t.corkedRequestsFree.next = e;
                }(t, e);
            };
        }
        z = P, P.WritableState = T;
        var l = {
            deprecate: t$1
        }, u = e, f = buffer_js_2.default.Buffer, h = Q.Uint8Array || function () { };
        var c, b = m, p = R.getHighWaterMark, g = e$1.codes, y = g.ERR_INVALID_ARG_TYPE, w = g.ERR_METHOD_NOT_IMPLEMENTED, v = g.ERR_MULTIPLE_CALLBACK, _ = g.ERR_STREAM_CANNOT_PIPE, S = g.ERR_STREAM_DESTROYED, k = g.ERR_STREAM_NULL_VALUES, E = g.ERR_STREAM_WRITE_AFTER_END, M = g.ERR_UNKNOWN_ENCODING, j = b.errorOrDestroy;
        function O() { }
        function T(t, n, i) {
            e$2 = e$2 || ee(), t = t || {}, "boolean" != typeof i && (i = n instanceof e$2), this.objectMode = !!t.objectMode, i && (this.objectMode = this.objectMode || !!t.writableObjectMode), this.highWaterMark = p(this, t, "writableHighWaterMark", i), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
            var a = !1 === t.decodeStrings;
            this.decodeStrings = !a, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
                !function (e, t) {
                    var n = e._writableState, i = n.sync, a = n.writecb;
                    if ("function" != typeof a)
                        throw new v();
                    if (function (e) {
                        e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
                    }(n), t)
                        !function (e, t, n, i, a) {
                            --t.pendingcb, n ? (r.nextTick(a, i), r.nextTick(q, e, t), e._writableState.errorEmitted = !0, j(e, i)) : (a(i), e._writableState.errorEmitted = !0, j(e, i), q(e, t));
                        }(e, n, i, t, a);
                    else {
                        var o = C(n) || e.destroyed;
                        o || n.corked || n.bufferProcessing || !n.bufferedRequest || D(e, n), i ? r.nextTick(L, e, n, o, a) : L(e, n, o, a);
                    }
                }(n, e);
            }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = !1 !== t.emitClose, this.autoDestroy = !!t.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new s(this);
        }
        function P(t) {
            var n = this instanceof (e$2 = e$2 || ee());
            if (!n && !c.call(P, this))
                return new P(t);
            this._writableState = new T(t, this, n), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), "function" == typeof t.writev && (this._writev = t.writev), "function" == typeof t.destroy && (this._destroy = t.destroy), "function" == typeof t.final && (this._final = t.final)), u.call(this);
        }
        function x(e, t, n, r, i, a, o) {
            t.writelen = r, t.writecb = o, t.writing = !0, t.sync = !0, t.destroyed ? t.onwrite(new S("write")) : n ? e._writev(i, t.onwrite) : e._write(i, a, t.onwrite), t.sync = !1;
        }
        function L(e, t, n, r) {
            n || !function (e, t) {
                0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
            }(e, t), t.pendingcb--, r(), q(e, t);
        }
        function D(e, t) {
            t.bufferProcessing = !0;
            var n = t.bufferedRequest;
            if (e._writev && n && n.next) {
                var r = t.bufferedRequestCount, i = new Array(r), a = t.corkedRequestsFree;
                a.entry = n;
                for (var o = 0, l = !0; n;)
                    i[o] = n, n.isBuf || (l = !1), n = n.next, o += 1;
                i.allBuffers = l, x(e, t, !0, t.length, i, "", a.finish), t.pendingcb++, t.lastBufferedRequest = null, a.next ? (t.corkedRequestsFree = a.next, a.next = null) : t.corkedRequestsFree = new s(t), t.bufferedRequestCount = 0;
            }
            else {
                for (; n;) {
                    var d = n.chunk, u = n.encoding, f = n.callback;
                    if (x(e, t, !1, t.objectMode ? 1 : d.length, d, u, f), n = n.next, t.bufferedRequestCount--, t.writing)
                        break;
                }
                null === n && (t.lastBufferedRequest = null);
            }
            t.bufferedRequest = n, t.bufferProcessing = !1;
        }
        function C(e) {
            return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
        }
        function A(e, t) {
            e._final(function (n) {
                t.pendingcb--, n && j(e, n), t.prefinished = !0, e.emit("prefinish"), q(e, t);
            });
        }
        function q(e, t) {
            var n = C(t);
            if (n && (!function (e, t) {
                t.prefinished || t.finalCalled || ("function" != typeof e._final || t.destroyed ? (t.prefinished = !0, e.emit("prefinish")) : (t.pendingcb++, t.finalCalled = !0, r.nextTick(A, e, t)));
            }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"), t.autoDestroy))) {
                var i = e._readableState;
                (!i || i.autoDestroy && i.endEmitted) && e.destroy();
            }
            return n;
        }
        return chunk_dac557ba_js_2.t(P, u), T.prototype.getBuffer = function () {
            for (var e = this.bufferedRequest, t = []; e;)
                t.push(e), e = e.next;
            return t;
        }, function () {
            try {
                Object.defineProperty(T.prototype, "buffer", {
                    get: l.deprecate(function () {
                        return this.getBuffer();
                    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                });
            }
            catch (e) { }
        }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (c = Function.prototype[Symbol.hasInstance], Object.defineProperty(P, Symbol.hasInstance, {
            value: function (e) {
                return !!c.call(this, e) || this === P && e && e._writableState instanceof T;
            }
        })) : c = function (e) {
            return e instanceof this;
        }, P.prototype.pipe = function () {
            j(this, new _());
        }, P.prototype.write = function (e, t, n) {
            var i, a = this._writableState, o = !1, s = !a.objectMode && (i = e, f.isBuffer(i) || i instanceof h);
            return s && !f.isBuffer(e) && (e = function (e) {
                return f.from(e);
            }(e)), "function" == typeof t && (n = t, t = null), s ? t = "buffer" : t || (t = a.defaultEncoding), "function" != typeof n && (n = O), a.ending ? function (e, t) {
                var n = new E();
                j(e, n), r.nextTick(t, n);
            }(this, n) : (s || function (e, t, n, i) {
                var a;
                return null === n ? a = new k() : "string" == typeof n || t.objectMode || (a = new y("chunk", ["string", "Buffer"], n)), !a || (j(e, a), r.nextTick(i, a), !1);
            }(this, a, e, n)) && (a.pendingcb++, o = function (e, t, n, r, i, a) {
                if (!n) {
                    var o = function (e, t, n) {
                        e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = f.from(t, n));
                        return t;
                    }(t, r, i);
                    r !== o && (n = !0, i = "buffer", r = o);
                }
                var s = t.objectMode ? 1 : r.length;
                t.length += s;
                var l = t.length < t.highWaterMark;
                l || (t.needDrain = !0);
                if (t.writing || t.corked) {
                    var d = t.lastBufferedRequest;
                    t.lastBufferedRequest = {
                        chunk: r,
                        encoding: i,
                        isBuf: n,
                        callback: a,
                        next: null
                    }, d ? d.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
                }
                else
                    x(e, t, !1, s, r, i, a);
                return l;
            }(this, a, s, e, t, n)), o;
        }, P.prototype.cork = function () {
            this._writableState.corked++;
        }, P.prototype.uncork = function () {
            var e = this._writableState;
            e.corked && (e.corked--, e.writing || e.corked || e.bufferProcessing || !e.bufferedRequest || D(this, e));
        }, P.prototype.setDefaultEncoding = function (e) {
            if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1))
                throw new M(e);
            return this._writableState.defaultEncoding = e, this;
        }, Object.defineProperty(P.prototype, "writableBuffer", {
            enumerable: !1,
            get: function () {
                return this._writableState && this._writableState.getBuffer();
            }
        }), Object.defineProperty(P.prototype, "writableHighWaterMark", {
            enumerable: !1,
            get: function () {
                return this._writableState.highWaterMark;
            }
        }), P.prototype._write = function (e, t, n) {
            n(new w("_write()"));
        }, P.prototype._writev = null, P.prototype.end = function (e, t, n) {
            var i = this._writableState;
            return "function" == typeof e ? (n = e, e = null, t = null) : "function" == typeof t && (n = t, t = null), null != e && this.write(e, t), i.corked && (i.corked = 1, this.uncork()), i.ending || function (e, t, n) {
                t.ending = !0, q(e, t), n && (t.finished ? r.nextTick(n) : e.once("finish", n));
                t.ended = !0, e.writable = !1;
            }(this, i, n), this;
        }, Object.defineProperty(P.prototype, "writableLength", {
            enumerable: !1,
            get: function () {
                return this._writableState.length;
            }
        }), Object.defineProperty(P.prototype, "destroyed", {
            enumerable: !1,
            get: function () {
                return void 0 !== this._writableState && this._writableState.destroyed;
            },
            set: function (e) {
                this._writableState && (this._writableState.destroyed = e);
            }
        }), P.prototype.destroy = b.destroy, P.prototype._undestroy = b.undestroy, P.prototype._destroy = function (e, t) {
            t(e);
        }, z;
    }
    function ee() {
        if ($)
            return Z;
        $ = !0;
        var e = chunk_0c2d1322_js_2.h, t = Object.keys || function (e) {
            var t = [];
            for (var n in e)
                t.push(n);
            return t;
        };
        Z = d;
        var n = K(), r = X();
        chunk_dac557ba_js_2.t(d, n);
        for (var a = t(r.prototype), s = 0; s < a.length; s++) {
            var l = a[s];
            d.prototype[l] || (d.prototype[l] = r.prototype[l]);
        }
        function d(e) {
            if (!(this instanceof d))
                return new d(e);
            n.call(this, e), r.call(this, e), this.allowHalfOpen = !0, e && (!1 === e.readable && (this.readable = !1), !1 === e.writable && (this.writable = !1), !1 === e.allowHalfOpen && (this.allowHalfOpen = !1, this.once("end", u)));
        }
        function u() {
            this._writableState.ended || e.nextTick(f, this);
        }
        function f(e) {
            e.end();
        }
        return Object.defineProperty(d.prototype, "writableHighWaterMark", {
            enumerable: !1,
            get: function () {
                return this._writableState.highWaterMark;
            }
        }), Object.defineProperty(d.prototype, "writableBuffer", {
            enumerable: !1,
            get: function () {
                return this._writableState && this._writableState.getBuffer();
            }
        }), Object.defineProperty(d.prototype, "writableLength", {
            enumerable: !1,
            get: function () {
                return this._writableState.length;
            }
        }), Object.defineProperty(d.prototype, "destroyed", {
            enumerable: !1,
            get: function () {
                return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed;
            },
            set: function (e) {
                void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e);
            }
        }), Z;
    }
    function t$3() { }
    function f$1(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            t && (r = r.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })), n.push.apply(n, r);
        }
        return n;
    }
    function h$1(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e;
    }
    function c$1(e, t) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
    }
    function _$1(e, t) {
        m$1(e, t), v$1(e);
    }
    function v$1(e) {
        e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close");
    }
    function m$1(e, t) {
        e.emit("error", t);
    }
    function j$1(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e;
    }
    function W$1(e, t) {
        return {
            value: e,
            done: t
        };
    }
    function B$1(e) {
        var t = e[T$1];
        if (null !== t) {
            var n = e[A$1].read();
            null !== n && (e[L$1] = null, e[T$1] = null, e[x$1] = null, t(W$1(n, !1)));
        }
    }
    function q$1(e) {
        M$1.nextTick(B$1, e);
    }
    function G$1() {
        if (F$1)
            return H$1;
        F$1 = !0;
        var l, u = chunk_0c2d1322_js_2.h;
        H$1 = C, C.ReadableState = L;
        events_js_1.default.EventEmitter;
        var f = function (e, t) {
            return e.listeners(t).length;
        }, h = e, c = buffer_js_2.default.Buffer, b = V$1.Uint8Array || function () { };
        var p, g = util_js_1.default;
        p = g && g.debuglog ? g.debuglog("stream") : function () { };
        var w, _, v, m = y$1, R = S$1, k = E$1.getHighWaterMark, M = e$1.codes, j = M.ERR_INVALID_ARG_TYPE, O = M.ERR_STREAM_PUSH_AFTER_EOF, T = M.ERR_METHOD_NOT_IMPLEMENTED, x = M.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
        chunk_dac557ba_js_2.t(C, h);
        var P = R.errorOrDestroy, D = ["error", "close", "destroy", "pause", "resume"];
        function L(e, t, n) {
            l = l || Z$1(), e = e || {}, "boolean" != typeof n && (n = t instanceof l), this.objectMode = !!e.objectMode, n && (this.objectMode = this.objectMode || !!e.readableObjectMode), this.highWaterMark = k(this, e, "readableHighWaterMark", n), this.buffer = new m(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = !1 !== e.emitClose, this.autoDestroy = !!e.autoDestroy, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (w || (w = chunk_6e68c801_js_1.s.StringDecoder), this.decoder = new w(e.encoding), this.encoding = e.encoding);
        }
        function C(e) {
            if (l = l || Z$1(), !(this instanceof C))
                return new C(e);
            var t = this instanceof l;
            this._readableState = new L(e, this, t), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), "function" == typeof e.destroy && (this._destroy = e.destroy)), h.call(this);
        }
        function A(e, t, n, r, i) {
            p("readableAddChunk", t);
            var a, o = e._readableState;
            if (null === t)
                o.reading = !1, function (e, t) {
                    if (p("onEofChunk"), t.ended)
                        return;
                    if (t.decoder) {
                        var n = t.decoder.end();
                        n && n.length && (t.buffer.push(n), t.length += t.objectMode ? 1 : n.length);
                    }
                    t.ended = !0, t.sync ? q(e) : (t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, I(e)));
                }(e, o);
            else if (i || (a = function (e, t) {
                var n;
                r = t, c.isBuffer(r) || r instanceof b || "string" == typeof t || void 0 === t || e.objectMode || (n = new j("chunk", ["string", "Buffer", "Uint8Array"], t));
                var r;
                return n;
            }(o, t)), a)
                P(e, a);
            else if (o.objectMode || t && t.length > 0) {
                if ("string" == typeof t || o.objectMode || Object.getPrototypeOf(t) === c.prototype || (t = function (e) {
                    return c.from(e);
                }(t)), r)
                    o.endEmitted ? P(e, new x()) : W(e, o, t, !0);
                else if (o.ended)
                    P(e, new O());
                else {
                    if (o.destroyed)
                        return !1;
                    o.reading = !1, o.decoder && !n ? (t = o.decoder.write(t), o.objectMode || 0 !== t.length ? W(e, o, t, !1) : N(e, o)) : W(e, o, t, !1);
                }
            }
            else
                r || (o.reading = !1, N(e, o));
            return !o.ended && (o.length < o.highWaterMark || 0 === o.length);
        }
        function W(e, t, n, r) {
            t.flowing && 0 === t.length && !t.sync ? (t.awaitDrain = 0, e.emit("data", n)) : (t.length += t.objectMode ? 1 : n.length, r ? t.buffer.unshift(n) : t.buffer.push(n), t.needReadable && q(e)), N(e, t);
        }
        Object.defineProperty(C.prototype, "destroyed", {
            enumerable: !1,
            get: function () {
                return void 0 !== this._readableState && this._readableState.destroyed;
            },
            set: function (e) {
                this._readableState && (this._readableState.destroyed = e);
            }
        }), C.prototype.destroy = R.destroy, C.prototype._undestroy = R.undestroy, C.prototype._destroy = function (e, t) {
            t(e);
        }, C.prototype.push = function (e, t) {
            var n, r = this._readableState;
            return r.objectMode ? n = !0 : "string" == typeof e && ((t = t || r.defaultEncoding) !== r.encoding && (e = c.from(e, t), t = ""), n = !0), A(this, e, t, !1, n);
        }, C.prototype.unshift = function (e) {
            return A(this, e, null, !0, !1);
        }, C.prototype.isPaused = function () {
            return !1 === this._readableState.flowing;
        }, C.prototype.setEncoding = function (e) {
            w || (w = chunk_6e68c801_js_1.s.StringDecoder);
            var t = new w(e);
            this._readableState.decoder = t, this._readableState.encoding = this._readableState.decoder.encoding;
            for (var n = this._readableState.buffer.head, r = ""; null !== n;)
                r += t.write(n.data), n = n.next;
            return this._readableState.buffer.clear(), "" !== r && this._readableState.buffer.push(r), this._readableState.length = r.length, this;
        };
        function B(e, t) {
            return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function (e) {
                return e >= 1073741824 ? e = 1073741824 : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
            }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
        }
        function q(e) {
            var t = e._readableState;
            p("emitReadable", t.needReadable, t.emittedReadable), t.needReadable = !1, t.emittedReadable || (p("emitReadable", t.flowing), t.emittedReadable = !0, u.nextTick(I, e));
        }
        function I(e) {
            var t = e._readableState;
            p("emitReadable_", t.destroyed, t.length, t.ended), t.destroyed || !t.length && !t.ended || (e.emit("readable"), t.emittedReadable = !1), t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark, J(e);
        }
        function N(e, t) {
            t.readingMore || (t.readingMore = !0, u.nextTick(G, e, t));
        }
        function G(e, t) {
            for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length);) {
                var n = t.length;
                if (p("maybeReadMore read 0"), e.read(0), n === t.length)
                    break;
            }
            t.readingMore = !1;
        }
        function Y(e) {
            var t = e._readableState;
            t.readableListening = e.listenerCount("readable") > 0, t.resumeScheduled && !t.paused ? t.flowing = !0 : e.listenerCount("data") > 0 && e.resume();
        }
        function K(e) {
            p("readable nexttick read 0"), e.read(0);
        }
        function z(e, t) {
            p("resume", t.reading), t.reading || e.read(0), t.resumeScheduled = !1, e.emit("resume"), J(e), t.flowing && !t.reading && e.read(0);
        }
        function J(e) {
            var t = e._readableState;
            for (p("flow", t.flowing); t.flowing && null !== e.read();)
                ;
        }
        function Q(e, t) {
            return 0 === t.length ? null : (t.objectMode ? n = t.buffer.shift() : !e || e >= t.length ? (n = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length), t.buffer.clear()) : n = t.buffer.consume(e, t.decoder), n);
            var n;
        }
        function X(e) {
            var t = e._readableState;
            p("endReadable", t.endEmitted), t.endEmitted || (t.ended = !0, u.nextTick($, t, e));
        }
        function $(e, t) {
            if (p("endReadableNT", e.endEmitted, e.length), !e.endEmitted && 0 === e.length && (e.endEmitted = !0, t.readable = !1, t.emit("end"), e.autoDestroy)) {
                var n = t._writableState;
                (!n || n.autoDestroy && n.finished) && t.destroy();
            }
        }
        function ee(e, t) {
            for (var n = 0, r = e.length; n < r; n++)
                if (e[n] === t)
                    return n;
            return -1;
        }
        return C.prototype.read = function (e) {
            p("read", e), e = parseInt(e, 10);
            var t = this._readableState, n = e;
            if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : t.length > 0) || t.ended))
                return p("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? X(this) : q(this), null;
            if (0 === (e = B(e, t)) && t.ended)
                return 0 === t.length && X(this), null;
            var r, i = t.needReadable;
            return p("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && p("length less than watermark", i = !0), t.ended || t.reading ? p("reading or ended", i = !1) : i && (p("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = B(n, t))), null === (r = e > 0 ? Q(e, t) : null) ? (t.needReadable = t.length <= t.highWaterMark, e = 0) : (t.length -= e, t.awaitDrain = 0), 0 === t.length && (t.ended || (t.needReadable = !0), n !== e && t.ended && X(this)), null !== r && this.emit("data", r), r;
        }, C.prototype._read = function (e) {
            P(this, new T("_read()"));
        }, C.prototype.pipe = function (e, t) {
            var n = this, r = this._readableState;
            switch (r.pipesCount) {
                case 0:
                    r.pipes = e;
                    break;
                case 1:
                    r.pipes = [r.pipes, e];
                    break;
                default:
                    r.pipes.push(e);
            }
            r.pipesCount += 1, p("pipe count=%d opts=%j", r.pipesCount, t);
            var i = (!t || !1 !== t.end) && e !== u.stdout && e !== u.stderr ? o : g;
            function a(t, i) {
                p("onunpipe"), t === n && i && !1 === i.hasUnpiped && (i.hasUnpiped = !0, p("cleanup"), e.removeListener("close", c), e.removeListener("finish", b), e.removeListener("drain", s), e.removeListener("error", h), e.removeListener("unpipe", a), n.removeListener("end", o), n.removeListener("end", g), n.removeListener("data", d), l = !0, !r.awaitDrain || e._writableState && !e._writableState.needDrain || s());
            }
            function o() {
                p("onend"), e.end();
            }
            r.endEmitted ? u.nextTick(i) : n.once("end", i), e.on("unpipe", a);
            var s = function (e) {
                return function () {
                    var t = e._readableState;
                    p("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && f(e, "data") && (t.flowing = !0, J(e));
                };
            }(n);
            e.on("drain", s);
            var l = !1;
            function d(t) {
                p("ondata");
                var i = e.write(t);
                p("dest.write", i), !1 === i && ((1 === r.pipesCount && r.pipes === e || r.pipesCount > 1 && -1 !== ee(r.pipes, e)) && !l && (p("false write response, pause", r.awaitDrain), r.awaitDrain++), n.pause());
            }
            function h(t) {
                p("onerror", t), g(), e.removeListener("error", h), 0 === f(e, "error") && P(e, t);
            }
            function c() {
                e.removeListener("finish", b), g();
            }
            function b() {
                p("onfinish"), e.removeListener("close", c), g();
            }
            function g() {
                p("unpipe"), n.unpipe(e);
            }
            return n.on("data", d), function (e, t, n) {
                if ("function" == typeof e.prependListener)
                    return e.prependListener(t, n);
                e._events && e._events[t] ? Array.isArray(e._events[t]) ? e._events[t].unshift(n) : e._events[t] = [n, e._events[t]] : e.on(t, n);
            }(e, "error", h), e.once("close", c), e.once("finish", b), e.emit("pipe", n), r.flowing || (p("pipe resume"), n.resume()), e;
        }, C.prototype.unpipe = function (e) {
            var t = this._readableState, n = {
                hasUnpiped: !1
            };
            if (0 === t.pipesCount)
                return this;
            if (1 === t.pipesCount)
                return e && e !== t.pipes || (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, n)), this;
            if (!e) {
                var r = t.pipes, i = t.pipesCount;
                t.pipes = null, t.pipesCount = 0, t.flowing = !1;
                for (var a = 0; a < i; a++)
                    r[a].emit("unpipe", this, {
                        hasUnpiped: !1
                    });
                return this;
            }
            var o = ee(t.pipes, e);
            return -1 === o || (t.pipes.splice(o, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, n)), this;
        }, C.prototype.on = function (e, t) {
            var n = h.prototype.on.call(this, e, t), r = this._readableState;
            return "data" === e ? (r.readableListening = this.listenerCount("readable") > 0, !1 !== r.flowing && this.resume()) : "readable" === e && (r.endEmitted || r.readableListening || (r.readableListening = r.needReadable = !0, r.flowing = !1, r.emittedReadable = !1, p("on readable", r.length, r.reading), r.length ? q(this) : r.reading || u.nextTick(K, this))), n;
        }, C.prototype.addListener = C.prototype.on, C.prototype.removeListener = function (e, t) {
            var n = h.prototype.removeListener.call(this, e, t);
            return "readable" === e && u.nextTick(Y, this), n;
        }, C.prototype.removeAllListeners = function (e) {
            var t = h.prototype.removeAllListeners.apply(this, arguments);
            return "readable" !== e && void 0 !== e || u.nextTick(Y, this), t;
        }, C.prototype.resume = function () {
            var e = this._readableState;
            return e.flowing || (p("resume"), e.flowing = !e.readableListening, function (e, t) {
                t.resumeScheduled || (t.resumeScheduled = !0, u.nextTick(z, e, t));
            }(this, e)), e.paused = !1, this;
        }, C.prototype.pause = function () {
            return p("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (p("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
        }, C.prototype.wrap = function (e) {
            var t = this, n = this._readableState, r = !1;
            for (var i in e.on("end", function () {
                if (p("wrapped end"), n.decoder && !n.ended) {
                    var e = n.decoder.end();
                    e && e.length && t.push(e);
                }
                t.push(null);
            }), e.on("data", function (i) {
                (p("wrapped data"), n.decoder && (i = n.decoder.write(i)), n.objectMode && null == i) || (n.objectMode || i && i.length) && (t.push(i) || (r = !0, e.pause()));
            }), e)
                void 0 === this[i] && "function" == typeof e[i] && (this[i] = function (t) {
                    return function () {
                        return e[t].apply(e, arguments);
                    };
                }(i));
            for (var a = 0; a < D.length; a++)
                e.on(D[a], this.emit.bind(this, D[a]));
            return this._read = function (t) {
                p("wrapped _read", t), r && (r = !1, e.resume());
            }, this;
        }, "function" == typeof Symbol && (C.prototype[Symbol.asyncIterator] = function () {
            return void 0 === _ && (_ = U$1), _(this);
        }), Object.defineProperty(C.prototype, "readableHighWaterMark", {
            enumerable: !1,
            get: function () {
                return this._readableState.highWaterMark;
            }
        }), Object.defineProperty(C.prototype, "readableBuffer", {
            enumerable: !1,
            get: function () {
                return this._readableState && this._readableState.buffer;
            }
        }), Object.defineProperty(C.prototype, "readableFlowing", {
            enumerable: !1,
            get: function () {
                return this._readableState.flowing;
            },
            set: function (e) {
                this._readableState && (this._readableState.flowing = e);
            }
        }), C._fromList = Q, Object.defineProperty(C.prototype, "readableLength", {
            enumerable: !1,
            get: function () {
                return this._readableState.length;
            }
        }), "function" == typeof Symbol && (C.from = function (e, t) {
            return void 0 === v && (v = r$1), v(C, e, t);
        }), H$1;
    }
    function J$1() {
        if (K$1)
            return Y$1;
        K$1 = !0;
        var e$2, r = chunk_0c2d1322_js_2.h;
        function s(e) {
            var t = this;
            this.next = null, this.entry = null, this.finish = function () {
                !function (e, t, n) {
                    var r = e.entry;
                    e.entry = null;
                    for (; r;) {
                        var i = r.callback;
                        t.pendingcb--, i(n), r = r.next;
                    }
                    t.corkedRequestsFree.next = e;
                }(t, e);
            };
        }
        Y$1 = x, x.WritableState = T;
        var l = {
            deprecate: t$1
        }, d = e, f = buffer_js_2.default.Buffer, h = z$1.Uint8Array || function () { };
        var c, b = S$1, p = E$1.getHighWaterMark, g = e$1.codes, y = g.ERR_INVALID_ARG_TYPE, w = g.ERR_METHOD_NOT_IMPLEMENTED, _ = g.ERR_MULTIPLE_CALLBACK, v = g.ERR_STREAM_CANNOT_PIPE, m = g.ERR_STREAM_DESTROYED, R = g.ERR_STREAM_NULL_VALUES, k = g.ERR_STREAM_WRITE_AFTER_END, M = g.ERR_UNKNOWN_ENCODING, j = b.errorOrDestroy;
        function O() { }
        function T(t, n, i) {
            e$2 = e$2 || Z$1(), t = t || {}, "boolean" != typeof i && (i = n instanceof e$2), this.objectMode = !!t.objectMode, i && (this.objectMode = this.objectMode || !!t.writableObjectMode), this.highWaterMark = p(this, t, "writableHighWaterMark", i), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
            var a = !1 === t.decodeStrings;
            this.decodeStrings = !a, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
                !function (e, t) {
                    var n = e._writableState, i = n.sync, a = n.writecb;
                    if ("function" != typeof a)
                        throw new _();
                    if (function (e) {
                        e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
                    }(n), t)
                        !function (e, t, n, i, a) {
                            --t.pendingcb, n ? (r.nextTick(a, i), r.nextTick(W, e, t), e._writableState.errorEmitted = !0, j(e, i)) : (a(i), e._writableState.errorEmitted = !0, j(e, i), W(e, t));
                        }(e, n, i, t, a);
                    else {
                        var o = C(n) || e.destroyed;
                        o || n.corked || n.bufferProcessing || !n.bufferedRequest || L(e, n), i ? r.nextTick(D, e, n, o, a) : D(e, n, o, a);
                    }
                }(n, e);
            }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = !1 !== t.emitClose, this.autoDestroy = !!t.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new s(this);
        }
        function x(t) {
            var n = this instanceof (e$2 = e$2 || Z$1());
            if (!n && !c.call(x, this))
                return new x(t);
            this._writableState = new T(t, this, n), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), "function" == typeof t.writev && (this._writev = t.writev), "function" == typeof t.destroy && (this._destroy = t.destroy), "function" == typeof t.final && (this._final = t.final)), d.call(this);
        }
        function P(e, t, n, r, i, a, o) {
            t.writelen = r, t.writecb = o, t.writing = !0, t.sync = !0, t.destroyed ? t.onwrite(new m("write")) : n ? e._writev(i, t.onwrite) : e._write(i, a, t.onwrite), t.sync = !1;
        }
        function D(e, t, n, r) {
            n || !function (e, t) {
                0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
            }(e, t), t.pendingcb--, r(), W(e, t);
        }
        function L(e, t) {
            t.bufferProcessing = !0;
            var n = t.bufferedRequest;
            if (e._writev && n && n.next) {
                var r = t.bufferedRequestCount, i = new Array(r), a = t.corkedRequestsFree;
                a.entry = n;
                for (var o = 0, l = !0; n;)
                    i[o] = n, n.isBuf || (l = !1), n = n.next, o += 1;
                i.allBuffers = l, P(e, t, !0, t.length, i, "", a.finish), t.pendingcb++, t.lastBufferedRequest = null, a.next ? (t.corkedRequestsFree = a.next, a.next = null) : t.corkedRequestsFree = new s(t), t.bufferedRequestCount = 0;
            }
            else {
                for (; n;) {
                    var d = n.chunk, u = n.encoding, f = n.callback;
                    if (P(e, t, !1, t.objectMode ? 1 : d.length, d, u, f), n = n.next, t.bufferedRequestCount--, t.writing)
                        break;
                }
                null === n && (t.lastBufferedRequest = null);
            }
            t.bufferedRequest = n, t.bufferProcessing = !1;
        }
        function C(e) {
            return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
        }
        function A(e, t) {
            e._final(function (n) {
                t.pendingcb--, n && j(e, n), t.prefinished = !0, e.emit("prefinish"), W(e, t);
            });
        }
        function W(e, t) {
            var n = C(t);
            if (n && (!function (e, t) {
                t.prefinished || t.finalCalled || ("function" != typeof e._final || t.destroyed ? (t.prefinished = !0, e.emit("prefinish")) : (t.pendingcb++, t.finalCalled = !0, r.nextTick(A, e, t)));
            }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"), t.autoDestroy))) {
                var i = e._readableState;
                (!i || i.autoDestroy && i.endEmitted) && e.destroy();
            }
            return n;
        }
        return chunk_dac557ba_js_2.t(x, d), T.prototype.getBuffer = function () {
            for (var e = this.bufferedRequest, t = []; e;)
                t.push(e), e = e.next;
            return t;
        }, function () {
            try {
                Object.defineProperty(T.prototype, "buffer", {
                    get: l.deprecate(function () {
                        return this.getBuffer();
                    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                });
            }
            catch (e) { }
        }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (c = Function.prototype[Symbol.hasInstance], Object.defineProperty(x, Symbol.hasInstance, {
            value: function (e) {
                return !!c.call(this, e) || this === x && e && e._writableState instanceof T;
            }
        })) : c = function (e) {
            return e instanceof this;
        }, x.prototype.pipe = function () {
            j(this, new v());
        }, x.prototype.write = function (e, t, n) {
            var i, a = this._writableState, o = !1, s = !a.objectMode && (i = e, f.isBuffer(i) || i instanceof h);
            return s && !f.isBuffer(e) && (e = function (e) {
                return f.from(e);
            }(e)), "function" == typeof t && (n = t, t = null), s ? t = "buffer" : t || (t = a.defaultEncoding), "function" != typeof n && (n = O), a.ending ? function (e, t) {
                var n = new k();
                j(e, n), r.nextTick(t, n);
            }(this, n) : (s || function (e, t, n, i) {
                var a;
                return null === n ? a = new R() : "string" == typeof n || t.objectMode || (a = new y("chunk", ["string", "Buffer"], n)), !a || (j(e, a), r.nextTick(i, a), !1);
            }(this, a, e, n)) && (a.pendingcb++, o = function (e, t, n, r, i, a) {
                if (!n) {
                    var o = function (e, t, n) {
                        e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = f.from(t, n));
                        return t;
                    }(t, r, i);
                    r !== o && (n = !0, i = "buffer", r = o);
                }
                var s = t.objectMode ? 1 : r.length;
                t.length += s;
                var l = t.length < t.highWaterMark;
                l || (t.needDrain = !0);
                if (t.writing || t.corked) {
                    var d = t.lastBufferedRequest;
                    t.lastBufferedRequest = {
                        chunk: r,
                        encoding: i,
                        isBuf: n,
                        callback: a,
                        next: null
                    }, d ? d.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
                }
                else
                    P(e, t, !1, s, r, i, a);
                return l;
            }(this, a, s, e, t, n)), o;
        }, x.prototype.cork = function () {
            this._writableState.corked++;
        }, x.prototype.uncork = function () {
            var e = this._writableState;
            e.corked && (e.corked--, e.writing || e.corked || e.bufferProcessing || !e.bufferedRequest || L(this, e));
        }, x.prototype.setDefaultEncoding = function (e) {
            if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1))
                throw new M(e);
            return this._writableState.defaultEncoding = e, this;
        }, Object.defineProperty(x.prototype, "writableBuffer", {
            enumerable: !1,
            get: function () {
                return this._writableState && this._writableState.getBuffer();
            }
        }), Object.defineProperty(x.prototype, "writableHighWaterMark", {
            enumerable: !1,
            get: function () {
                return this._writableState.highWaterMark;
            }
        }), x.prototype._write = function (e, t, n) {
            n(new w("_write()"));
        }, x.prototype._writev = null, x.prototype.end = function (e, t, n) {
            var i = this._writableState;
            return "function" == typeof e ? (n = e, e = null, t = null) : "function" == typeof t && (n = t, t = null), null != e && this.write(e, t), i.corked && (i.corked = 1, this.uncork()), i.ending || function (e, t, n) {
                t.ending = !0, W(e, t), n && (t.finished ? r.nextTick(n) : e.once("finish", n));
                t.ended = !0, e.writable = !1;
            }(this, i, n), this;
        }, Object.defineProperty(x.prototype, "writableLength", {
            enumerable: !1,
            get: function () {
                return this._writableState.length;
            }
        }), Object.defineProperty(x.prototype, "destroyed", {
            enumerable: !1,
            get: function () {
                return void 0 !== this._writableState && this._writableState.destroyed;
            },
            set: function (e) {
                this._writableState && (this._writableState.destroyed = e);
            }
        }), x.prototype.destroy = b.destroy, x.prototype._undestroy = b.undestroy, x.prototype._destroy = function (e, t) {
            t(e);
        }, Y$1;
    }
    function Z$1() {
        if (X$1)
            return Q$1;
        X$1 = !0;
        var e = chunk_0c2d1322_js_2.h, t = Object.keys || function (e) {
            var t = [];
            for (var n in e)
                t.push(n);
            return t;
        };
        Q$1 = d;
        var n = G$1(), r = J$1();
        chunk_dac557ba_js_2.t(d, n);
        for (var a = t(r.prototype), s = 0; s < a.length; s++) {
            var l = a[s];
            d.prototype[l] || (d.prototype[l] = r.prototype[l]);
        }
        function d(e) {
            if (!(this instanceof d))
                return new d(e);
            n.call(this, e), r.call(this, e), this.allowHalfOpen = !0, e && (!1 === e.readable && (this.readable = !1), !1 === e.writable && (this.writable = !1), !1 === e.allowHalfOpen && (this.allowHalfOpen = !1, this.once("end", u)));
        }
        function u() {
            this._writableState.ended || e.nextTick(f, this);
        }
        function f(e) {
            e.end();
        }
        return Object.defineProperty(d.prototype, "writableHighWaterMark", {
            enumerable: !1,
            get: function () {
                return this._writableState.highWaterMark;
            }
        }), Object.defineProperty(d.prototype, "writableBuffer", {
            enumerable: !1,
            get: function () {
                return this._writableState && this._writableState.getBuffer();
            }
        }), Object.defineProperty(d.prototype, "writableLength", {
            enumerable: !1,
            get: function () {
                return this._writableState.length;
            }
        }), Object.defineProperty(d.prototype, "destroyed", {
            enumerable: !1,
            get: function () {
                return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed;
            },
            set: function (e) {
                void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e);
            }
        }), Q$1;
    }
    function l(t, r) {
        var e = this._transformState;
        e.transforming = !1;
        var n = e.writecb;
        if (null === n)
            return this.emit("error", new o());
        e.writechunk = null, e.writecb = null, null != r && this.push(r), n(t);
        var i = this._readableState;
        i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
    }
    function u$1(t) {
        if (!(this instanceof u$1))
            return new u$1(t);
        h$2.call(this, t), this._transformState = {
            afterTransform: l.bind(this),
            needTransform: !1,
            transforming: !1,
            writecb: null,
            writechunk: null,
            writeencoding: null
        }, this._readableState.needReadable = !0, this._readableState.sync = !1, t && ("function" == typeof t.transform && (this._transform = t.transform), "function" == typeof t.flush && (this._flush = t.flush)), this.on("prefinish", m$2);
    }
    function m$2() {
        var t = this;
        "function" != typeof this._flush || this._readableState.destroyed ? _$2(this, null, null) : this._flush(function (r, e) {
            _$2(t, r, e);
        });
    }
    function _$2(t, r, e) {
        if (r)
            return t.emit("error", r);
        if (null != e && t.push(e), t._writableState.length)
            throw new f$2();
        if (t._transformState.transforming)
            throw new s();
        return t.push(null);
    }
    function i$1(r) {
        if (!(this instanceof i$1))
            return new i$1(r);
        e$3.call(this, r);
    }
    function i$2(r) {
        if (r)
            throw r;
    }
    function u$2(r, o, e, i) {
        i = function (r) {
            var n = !1;
            return function () {
                n || (n = !0, r.apply(void 0, arguments));
            };
        }(i);
        var u = !1;
        r.on("close", function () {
            u = !0;
        }), void 0 === t$6 && (t$6 = n$1), t$6(r, {
            readable: o,
            writable: e
        }, function (r) {
            if (r)
                return i(r);
            u = !0, i();
        });
        var a = !1;
        return function (n) {
            if (!u && !a)
                return a = !0, function (r) {
                    return r.setHeader && "function" == typeof r.abort;
                }(r) ? r.abort() : "function" == typeof r.destroy ? r.destroy() : (i(n || new f$3("pipe")), void 0);
        };
    }
    function a$1(r) {
        r();
    }
    function c$2(r, n) {
        return r.pipe(n);
    }
    function p$3(r) {
        return r.length ? "function" != typeof r[r.length - 1] ? i$2 : r.pop() : i$2;
    }
    return {
        setters: [
            function (chunk_dac557ba_js_2_1) {
                chunk_dac557ba_js_2 = chunk_dac557ba_js_2_1;
            },
            function (chunk_0c2d1322_js_2_1) {
                chunk_0c2d1322_js_2 = chunk_0c2d1322_js_2_1;
            },
            function (buffer_js_2_1) {
                buffer_js_2 = buffer_js_2_1;
            },
            function (util_js_1_1) {
                util_js_1 = util_js_1_1;
            },
            function (chunk_6e68c801_js_1_1) {
                chunk_6e68c801_js_1 = chunk_6e68c801_js_1_1;
            },
            function (events_js_1_1) {
                events_js_1 = events_js_1_1;
            }
        ],
        execute: function () {
            e = events_js_1.default.EventEmitter;
            e$1 = {};
            t = {};
            n("ERR_INVALID_OPT_VALUE", function (e, t) {
                return 'The value "' + t + '" is invalid for option "' + e + '"';
            }, TypeError), n("ERR_INVALID_ARG_TYPE", function (e, t, n) {
                let o;
                var E;
                let u;
                if ("string" == typeof t && (E = "not ", t.substr(0, E.length) === E) ? (o = "must not be", t = t.replace(/^not /, "")) : o = "must be", function (e, t, n) {
                    return (void 0 === n || n > e.length) && (n = e.length), e.substring(n - t.length, n) === t;
                }(e, " argument"))
                    u = `The ${e} ${o} ${r(t, "type")}`;
                else {
                    u = `The "${e}" ${function (e, t, n) {
                        return "number" != typeof n && (n = 0), !(n + t.length > e.length) && -1 !== e.indexOf(t, n);
                    }(e, ".") ? "property" : "argument"} ${o} ${r(t, "type")}`;
                }
                return u += `. Received type ${typeof n}`, u;
            }, TypeError), n("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), n("ERR_METHOD_NOT_IMPLEMENTED", function (e) {
                return "The " + e + " method is not implemented";
            }), n("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), n("ERR_STREAM_DESTROYED", function (e) {
                return "Cannot call " + e + " after a stream was destroyed";
            }), n("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), n("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), n("ERR_STREAM_WRITE_AFTER_END", "write after end"), n("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), n("ERR_UNKNOWN_ENCODING", function (e) {
                return "Unknown encoding: " + e;
            }, TypeError), n("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), e$1.codes = t;
            r$1 = function () {
                throw new Error("Readable.from is not available in the browser");
            };
            r$2 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            t$1 = function (t, n) {
                if (e$2("noDeprecation"))
                    return t;
                var o = !1;
                return function () {
                    if (!o) {
                        if (e$2("throwDeprecation"))
                            throw new Error(n);
                        e$2("traceDeprecation") ? console.trace(n) : console.warn(n), o = !0;
                    }
                    return t.apply(this || r$2, arguments);
                };
            };
            c = buffer_js_2.default.Buffer, b = util_js_1.default.inspect, p = b && b.custom || "inspect";
            g = function () {
                function e() {
                    !function (e, t) {
                        if (!(e instanceof t))
                            throw new TypeError("Cannot call a class as a function");
                    }(this, e), this.head = null, this.tail = null, this.length = 0;
                }
                var t, n;
                return t = e, (n = [{
                        key: "push",
                        value: function (e) {
                            var t = {
                                data: e,
                                next: null
                            };
                            this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
                        }
                    }, {
                        key: "unshift",
                        value: function (e) {
                            var t = {
                                data: e,
                                next: this.head
                            };
                            0 === this.length && (this.tail = t), this.head = t, ++this.length;
                        }
                    }, {
                        key: "shift",
                        value: function () {
                            if (0 !== this.length) {
                                var e = this.head.data;
                                return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
                            }
                        }
                    }, {
                        key: "clear",
                        value: function () {
                            this.head = this.tail = null, this.length = 0;
                        }
                    }, {
                        key: "join",
                        value: function (e) {
                            if (0 === this.length)
                                return "";
                            for (var t = this.head, n = "" + t.data; t = t.next;)
                                n += e + t.data;
                            return n;
                        }
                    }, {
                        key: "concat",
                        value: function (e) {
                            if (0 === this.length)
                                return c.alloc(0);
                            for (var t, n, r, i = c.allocUnsafe(e >>> 0), a = this.head, o = 0; a;)
                                t = a.data, n = i, r = o, void c.prototype.copy.call(t, n, r), o += a.data.length, a = a.next;
                            return i;
                        }
                    }, {
                        key: "consume",
                        value: function (e, t) {
                            var n;
                            return e < this.head.data.length ? (n = this.head.data.slice(0, e), this.head.data = this.head.data.slice(e)) : n = e === this.head.data.length ? this.shift() : t ? this._getString(e) : this._getBuffer(e), n;
                        }
                    }, {
                        key: "first",
                        value: function () {
                            return this.head.data;
                        }
                    }, {
                        key: "_getString",
                        value: function (e) {
                            var t = this.head, n = 1, r = t.data;
                            for (e -= r.length; t = t.next;) {
                                var i = t.data, a = e > i.length ? i.length : e;
                                if (a === i.length ? r += i : r += i.slice(0, e), 0 == (e -= a)) {
                                    a === i.length ? (++n, t.next ? this.head = t.next : this.head = this.tail = null) : (this.head = t, t.data = i.slice(a));
                                    break;
                                }
                                ++n;
                            }
                            return this.length -= n, r;
                        }
                    }, {
                        key: "_getBuffer",
                        value: function (e) {
                            var t = c.allocUnsafe(e), n = this.head, r = 1;
                            for (n.data.copy(t), e -= n.data.length; n = n.next;) {
                                var i = n.data, a = e > i.length ? i.length : e;
                                if (i.copy(t, t.length - e, 0, a), 0 == (e -= a)) {
                                    a === i.length ? (++r, n.next ? this.head = n.next : this.head = this.tail = null) : (this.head = n, n.data = i.slice(a));
                                    break;
                                }
                                ++r;
                            }
                            return this.length -= r, t;
                        }
                    }, {
                        key: p,
                        value: function (e, t) {
                            return b(this, function (e) {
                                for (var t = 1; t < arguments.length; t++) {
                                    var n = null != arguments[t] ? arguments[t] : {};
                                    t % 2 ? u(Object(n), !0).forEach(function (t) {
                                        f(e, t, n[t]);
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : u(Object(n)).forEach(function (t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                                    });
                                }
                                return e;
                            }({}, t, {
                                depth: 0,
                                customInspect: !1
                            }));
                        }
                    }]) && h(t.prototype, n), e;
            }(), y = chunk_0c2d1322_js_2.h;
            m = {
                destroy: function (e, t) {
                    var n = this, r = this._readableState && this._readableState.destroyed, i = this._writableState && this._writableState.destroyed;
                    return r || i ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, y.nextTick(_, this, e)) : y.nextTick(_, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function (e) {
                        !t && e ? n._writableState ? n._writableState.errorEmitted ? y.nextTick(v, n) : (n._writableState.errorEmitted = !0, y.nextTick(w, n, e)) : y.nextTick(w, n, e) : t ? (y.nextTick(v, n), t(e)) : y.nextTick(v, n);
                    }), this);
                },
                undestroy: function () {
                    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
                },
                errorOrDestroy: function (e, t) {
                    var n = e._readableState, r = e._writableState;
                    n && n.autoDestroy || r && r.autoDestroy ? e.destroy(t) : e.emit("error", t);
                }
            }, S = e$1.codes.ERR_INVALID_OPT_VALUE;
            R = {
                getHighWaterMark: function (e, t, n, r) {
                    var i = function (e, t, n) {
                        return null != e.highWaterMark ? e.highWaterMark : t ? e[n] : null;
                    }(t, r, n);
                    if (null != i) {
                        if (!isFinite(i) || Math.floor(i) !== i || i < 0)
                            throw new S(r ? n : "highWaterMark", i);
                        return Math.floor(i);
                    }
                    return e.objectMode ? 16 : 16384;
                }
            }, k = e$1.codes.ERR_STREAM_PREMATURE_CLOSE;
            j = function e(t, n, r) {
                if ("function" == typeof n)
                    return e(t, null, n);
                n || (n = {}), r = function (e) {
                    var t = !1;
                    return function () {
                        if (!t) {
                            t = !0;
                            for (var n = arguments.length, r = new Array(n), i = 0; i < n; i++)
                                r[i] = arguments[i];
                            e.apply(this, r);
                        }
                    };
                }(r || E);
                var i = n.readable || !1 !== n.readable && t.readable, a = n.writable || !1 !== n.writable && t.writable, o = function () {
                    t.writable || l();
                }, s = t._writableState && t._writableState.finished, l = function () {
                    a = !1, s = !0, i || r.call(t);
                }, d = t._readableState && t._readableState.endEmitted, u = function () {
                    i = !1, d = !0, a || r.call(t);
                }, f = function (e) {
                    r.call(t, e);
                }, h = function () {
                    var e;
                    return i && !d ? (t._readableState && t._readableState.ended || (e = new k()), r.call(t, e)) : a && !s ? (t._writableState && t._writableState.ended || (e = new k()), r.call(t, e)) : void 0;
                }, c = function () {
                    t.req.on("finish", l);
                };
                return !function (e) {
                    return e.setHeader && "function" == typeof e.abort;
                }(t) ? a && !t._writableState && (t.on("end", o), t.on("close", o)) : (t.on("complete", l), t.on("abort", h), t.req ? c() : t.on("request", c)), t.on("end", u), t.on("finish", l), !1 !== n.error && t.on("error", f), t.on("close", h), function () {
                    t.removeListener("complete", l), t.removeListener("abort", h), t.removeListener("request", c), t.req && t.req.removeListener("finish", l), t.removeListener("end", o), t.removeListener("close", o), t.removeListener("finish", l), t.removeListener("end", u), t.removeListener("error", f), t.removeListener("close", h);
                };
            }, O = chunk_0c2d1322_js_2.h;
            P = j, x = Symbol("lastResolve"), L = Symbol("lastReject"), D = Symbol("error"), C = Symbol("ended"), A = Symbol("lastPromise"), q = Symbol("handlePromise"), W = Symbol("stream");
            U = Object.getPrototypeOf(function () { }), H = Object.setPrototypeOf((T(M = {
                get stream() {
                    return this[W];
                },
                next: function () {
                    var e = this, t = this[D];
                    if (null !== t)
                        return Promise.reject(t);
                    if (this[C])
                        return Promise.resolve(B(void 0, !0));
                    if (this[W].destroyed)
                        return new Promise(function (t, n) {
                            O.nextTick(function () {
                                e[D] ? n(e[D]) : t(B(void 0, !0));
                            });
                        });
                    var n, r = this[A];
                    if (r)
                        n = new Promise(function (e, t) {
                            return function (n, r) {
                                e.then(function () {
                                    if (t[C])
                                        return n(B(void 0, !0)), void 0;
                                    t[q](n, r);
                                }, r);
                            };
                        }(r, this));
                    else {
                        var i = this[W].read();
                        if (null !== i)
                            return Promise.resolve(B(i, !1));
                        n = new Promise(this[q]);
                    }
                    return this[A] = n, n;
                }
            }, Symbol.asyncIterator, function () {
                return this;
            }), T(M, "return", function () {
                var e = this;
                return new Promise(function (t, n) {
                    e[W].destroy(null, function (e) {
                        if (e)
                            return n(e), void 0;
                        t(B(void 0, !0));
                    });
                });
            }), M), U), F = function (e) {
                var t, n = Object.create(H, (T(t = {}, W, {
                    value: e,
                    writable: !0
                }), T(t, x, {
                    value: null,
                    writable: !0
                }), T(t, L, {
                    value: null,
                    writable: !0
                }), T(t, D, {
                    value: null,
                    writable: !0
                }), T(t, C, {
                    value: e._readableState.endEmitted,
                    writable: !0
                }), T(t, q, {
                    value: function (e, t) {
                        var r = n[W].read();
                        r ? (n[A] = null, n[x] = null, n[L] = null, e(B(r, !1))) : (n[x] = e, n[L] = t);
                    },
                    writable: !0
                }), t));
                return n[A] = null, P(e, function (e) {
                    if (e && "ERR_STREAM_PREMATURE_CLOSE" !== e.code) {
                        var t = n[L];
                        return null !== t && (n[A] = null, n[x] = null, n[L] = null, t(e)), n[D] = e, void 0;
                    }
                    var r = n[x];
                    null !== r && (n[A] = null, n[x] = null, n[L] = null, r(B(void 0, !0))), n[C] = !0;
                }), e.on("readable", N.bind(null, n)), n;
            }, V = {}, G = !1, Y = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            z = {}, J = !1, Q = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            Z = {}, $ = !1;
            t$2 = K();
            exports_8("o", t$2);
            r$3 = e$1.codes.ERR_STREAM_PREMATURE_CLOSE;
            n$1 = function e(n, o, a) {
                if ("function" == typeof o)
                    return e(n, null, o);
                o || (o = {}), a = function (e) {
                    var r = !1;
                    return function () {
                        if (!r) {
                            r = !0;
                            for (var t = arguments.length, n = new Array(t), o = 0; o < t; o++)
                                n[o] = arguments[o];
                            e.apply(this, n);
                        }
                    };
                }(a || t$3);
                var i = o.readable || !1 !== o.readable && n.readable, l = o.writable || !1 !== o.writable && n.writable, c = function () {
                    n.writable || s();
                }, f = n._writableState && n._writableState.finished, s = function () {
                    l = !1, f = !0, i || a.call(n);
                }, u = n._readableState && n._readableState.endEmitted, d = function () {
                    i = !1, u = !0, l || a.call(n);
                }, b = function (e) {
                    a.call(n, e);
                }, v = function () {
                    var e;
                    return i && !u ? (n._readableState && n._readableState.ended || (e = new r$3()), a.call(n, e)) : l && !f ? (n._writableState && n._writableState.ended || (e = new r$3()), a.call(n, e)) : void 0;
                }, m = function () {
                    n.req.on("finish", s);
                };
                return !function (e) {
                    return e.setHeader && "function" == typeof e.abort;
                }(n) ? l && !n._writableState && (n.on("end", c), n.on("close", c)) : (n.on("complete", s), n.on("abort", v), n.req ? m() : n.on("request", m)), n.on("end", d), n.on("finish", s), !1 !== o.error && n.on("error", b), n.on("close", v), function () {
                    n.removeListener("complete", s), n.removeListener("abort", v), n.removeListener("request", m), n.req && n.req.removeListener("finish", s), n.removeListener("end", c), n.removeListener("close", c), n.removeListener("finish", s), n.removeListener("end", d), n.removeListener("error", b), n.removeListener("close", v);
                };
            };
            exports_8("r", n$1);
            b$1 = buffer_js_2.default.Buffer, p$1 = util_js_1.default.inspect, g$1 = p$1 && p$1.custom || "inspect";
            y$1 = function () {
                function e() {
                    !function (e, t) {
                        if (!(e instanceof t))
                            throw new TypeError("Cannot call a class as a function");
                    }(this, e), this.head = null, this.tail = null, this.length = 0;
                }
                var t, n;
                return t = e, (n = [{
                        key: "push",
                        value: function (e) {
                            var t = {
                                data: e,
                                next: null
                            };
                            this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
                        }
                    }, {
                        key: "unshift",
                        value: function (e) {
                            var t = {
                                data: e,
                                next: this.head
                            };
                            0 === this.length && (this.tail = t), this.head = t, ++this.length;
                        }
                    }, {
                        key: "shift",
                        value: function () {
                            if (0 !== this.length) {
                                var e = this.head.data;
                                return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
                            }
                        }
                    }, {
                        key: "clear",
                        value: function () {
                            this.head = this.tail = null, this.length = 0;
                        }
                    }, {
                        key: "join",
                        value: function (e) {
                            if (0 === this.length)
                                return "";
                            for (var t = this.head, n = "" + t.data; t = t.next;)
                                n += e + t.data;
                            return n;
                        }
                    }, {
                        key: "concat",
                        value: function (e) {
                            if (0 === this.length)
                                return b$1.alloc(0);
                            for (var t, n, r, i = b$1.allocUnsafe(e >>> 0), a = this.head, o = 0; a;)
                                t = a.data, n = i, r = o, void b$1.prototype.copy.call(t, n, r), o += a.data.length, a = a.next;
                            return i;
                        }
                    }, {
                        key: "consume",
                        value: function (e, t) {
                            var n;
                            return e < this.head.data.length ? (n = this.head.data.slice(0, e), this.head.data = this.head.data.slice(e)) : n = e === this.head.data.length ? this.shift() : t ? this._getString(e) : this._getBuffer(e), n;
                        }
                    }, {
                        key: "first",
                        value: function () {
                            return this.head.data;
                        }
                    }, {
                        key: "_getString",
                        value: function (e) {
                            var t = this.head, n = 1, r = t.data;
                            for (e -= r.length; t = t.next;) {
                                var i = t.data, a = e > i.length ? i.length : e;
                                if (a === i.length ? r += i : r += i.slice(0, e), 0 == (e -= a)) {
                                    a === i.length ? (++n, t.next ? this.head = t.next : this.head = this.tail = null) : (this.head = t, t.data = i.slice(a));
                                    break;
                                }
                                ++n;
                            }
                            return this.length -= n, r;
                        }
                    }, {
                        key: "_getBuffer",
                        value: function (e) {
                            var t = b$1.allocUnsafe(e), n = this.head, r = 1;
                            for (n.data.copy(t), e -= n.data.length; n = n.next;) {
                                var i = n.data, a = e > i.length ? i.length : e;
                                if (i.copy(t, t.length - e, 0, a), 0 == (e -= a)) {
                                    a === i.length ? (++r, n.next ? this.head = n.next : this.head = this.tail = null) : (this.head = n, n.data = i.slice(a));
                                    break;
                                }
                                ++r;
                            }
                            return this.length -= r, t;
                        }
                    }, {
                        key: g$1,
                        value: function (e, t) {
                            return p$1(this, function (e) {
                                for (var t = 1; t < arguments.length; t++) {
                                    var n = null != arguments[t] ? arguments[t] : {};
                                    t % 2 ? f$1(Object(n), !0).forEach(function (t) {
                                        h$1(e, t, n[t]);
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : f$1(Object(n)).forEach(function (t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                                    });
                                }
                                return e;
                            }({}, t, {
                                depth: 0,
                                customInspect: !1
                            }));
                        }
                    }]) && c$1(t.prototype, n), e;
            }(), w$1 = chunk_0c2d1322_js_2.h;
            S$1 = {
                destroy: function (e, t) {
                    var n = this, r = this._readableState && this._readableState.destroyed, i = this._writableState && this._writableState.destroyed;
                    return r || i ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, w$1.nextTick(m$1, this, e)) : w$1.nextTick(m$1, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function (e) {
                        !t && e ? n._writableState ? n._writableState.errorEmitted ? w$1.nextTick(v$1, n) : (n._writableState.errorEmitted = !0, w$1.nextTick(_$1, n, e)) : w$1.nextTick(_$1, n, e) : t ? (w$1.nextTick(v$1, n), t(e)) : w$1.nextTick(v$1, n);
                    }), this);
                },
                undestroy: function () {
                    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
                },
                errorOrDestroy: function (e, t) {
                    var n = e._readableState, r = e._writableState;
                    n && n.autoDestroy || r && r.autoDestroy ? e.destroy(t) : e.emit("error", t);
                }
            }, R$1 = e$1.codes.ERR_INVALID_OPT_VALUE;
            E$1 = {
                getHighWaterMark: function (e, t, n, r) {
                    var i = function (e, t, n) {
                        return null != e.highWaterMark ? e.highWaterMark : t ? e[n] : null;
                    }(t, r, n);
                    if (null != i) {
                        if (!isFinite(i) || Math.floor(i) !== i || i < 0)
                            throw new R$1(r ? n : "highWaterMark", i);
                        return Math.floor(i);
                    }
                    return e.objectMode ? 16 : 16384;
                }
            }, M$1 = chunk_0c2d1322_js_2.h;
            O$1 = n$1, T$1 = Symbol("lastResolve"), x$1 = Symbol("lastReject"), P$1 = Symbol("error"), D$1 = Symbol("ended"), L$1 = Symbol("lastPromise"), C$1 = Symbol("handlePromise"), A$1 = Symbol("stream");
            I$1 = Object.getPrototypeOf(function () { }), N$1 = Object.setPrototypeOf((j$1(k$1 = {
                get stream() {
                    return this[A$1];
                },
                next: function () {
                    var e = this, t = this[P$1];
                    if (null !== t)
                        return Promise.reject(t);
                    if (this[D$1])
                        return Promise.resolve(W$1(void 0, !0));
                    if (this[A$1].destroyed)
                        return new Promise(function (t, n) {
                            M$1.nextTick(function () {
                                e[P$1] ? n(e[P$1]) : t(W$1(void 0, !0));
                            });
                        });
                    var n, r = this[L$1];
                    if (r)
                        n = new Promise(function (e, t) {
                            return function (n, r) {
                                e.then(function () {
                                    if (t[D$1])
                                        return n(W$1(void 0, !0)), void 0;
                                    t[C$1](n, r);
                                }, r);
                            };
                        }(r, this));
                    else {
                        var i = this[A$1].read();
                        if (null !== i)
                            return Promise.resolve(W$1(i, !1));
                        n = new Promise(this[C$1]);
                    }
                    return this[L$1] = n, n;
                }
            }, Symbol.asyncIterator, function () {
                return this;
            }), j$1(k$1, "return", function () {
                var e = this;
                return new Promise(function (t, n) {
                    e[A$1].destroy(null, function (e) {
                        if (e)
                            return n(e), void 0;
                        t(W$1(void 0, !0));
                    });
                });
            }), k$1), I$1), U$1 = function (e) {
                var t, n = Object.create(N$1, (j$1(t = {}, A$1, {
                    value: e,
                    writable: !0
                }), j$1(t, T$1, {
                    value: null,
                    writable: !0
                }), j$1(t, x$1, {
                    value: null,
                    writable: !0
                }), j$1(t, P$1, {
                    value: null,
                    writable: !0
                }), j$1(t, D$1, {
                    value: e._readableState.endEmitted,
                    writable: !0
                }), j$1(t, C$1, {
                    value: function (e, t) {
                        var r = n[A$1].read();
                        r ? (n[L$1] = null, n[T$1] = null, n[x$1] = null, e(W$1(r, !1))) : (n[T$1] = e, n[x$1] = t);
                    },
                    writable: !0
                }), t));
                return n[L$1] = null, O$1(e, function (e) {
                    if (e && "ERR_STREAM_PREMATURE_CLOSE" !== e.code) {
                        var t = n[x$1];
                        return null !== t && (n[L$1] = null, n[T$1] = null, n[x$1] = null, t(e)), n[P$1] = e, void 0;
                    }
                    var r = n[T$1];
                    null !== r && (n[L$1] = null, n[T$1] = null, n[x$1] = null, r(W$1(void 0, !0))), n[D$1] = !0;
                }), e.on("readable", q$1.bind(null, n)), n;
            }, H$1 = {}, F$1 = !1, V$1 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            Y$1 = {}, K$1 = !1, z$1 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            Q$1 = {}, X$1 = !1;
            t$4 = J$1();
            exports_8("s", t$4);
            t$5 = ee();
            exports_8("e", t$5);
            n$2 = u$1;
            i = e$1.codes, a = i.ERR_METHOD_NOT_IMPLEMENTED, o = i.ERR_MULTIPLE_CALLBACK, s = i.ERR_TRANSFORM_ALREADY_TRANSFORMING, f$2 = i.ERR_TRANSFORM_WITH_LENGTH_0, h$2 = t$5;
            chunk_dac557ba_js_2.t(u$1, h$2), u$1.prototype.push = function (t, r) {
                return this._transformState.needTransform = !1, h$2.prototype.push.call(this, t, r);
            }, u$1.prototype._transform = function (t, r, e) {
                e(new a("_transform()"));
            }, u$1.prototype._write = function (t, r, e) {
                var n = this._transformState;
                if (n.writecb = e, n.writechunk = t, n.writeencoding = r, !n.transforming) {
                    var i = this._readableState;
                    (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
                }
            }, u$1.prototype._read = function (t) {
                var r = this._transformState;
                null === r.writechunk || r.transforming ? r.needTransform = !0 : (r.transforming = !0, this._transform(r.writechunk, r.writeencoding, r.afterTransform));
            }, u$1.prototype._destroy = function (t, r) {
                h$2.prototype._destroy.call(this, t, function (t) {
                    r(t);
                });
            };
            p$2 = n$2;
            exports_8("t", p$2);
            o$1 = i$1;
            e$3 = p$2;
            chunk_dac557ba_js_2.t(i$1, e$3), i$1.prototype._transform = function (r, t, o) {
                o(null, r);
            };
            s$1 = o$1;
            exports_8("i", s$1);
            o$2 = e$1.codes, e$4 = o$2.ERR_MISSING_ARGS, f$3 = o$2.ERR_STREAM_DESTROYED;
            v$2 = function () {
                for (var r = arguments.length, n = new Array(r), t = 0; t < r; t++)
                    n[t] = arguments[t];
                var o, f = p$3(n);
                if (Array.isArray(n[0]) && (n = n[0]), n.length < 2)
                    throw new e$4("streams");
                var i = n.map(function (r, t) {
                    var e = t < n.length - 1;
                    return u$2(r, e, t > 0, function (r) {
                        o || (o = r), r && i.forEach(a$1), e || (i.forEach(a$1), f(o));
                    });
                });
                return n.reduce(c$2);
            };
            exports_8("m", v$2);
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/stream", ["https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-dac557ba", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-0c2d1322", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/buffer", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/util", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-6e68c801", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/events", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-cffba9d4"], function (exports_9, context_9) {
    "use strict";
    var chunk_dac557ba_js_3, events_js_2, chunk_cffba9d4_js_1, l, d, f, b, Readable, Writable, Duplex, Transform, PassThrough, finished, pipeline, Stream;
    var __moduleName = context_9 && context_9.id;
    function p() {
        f.call(this || d);
    }
    return {
        setters: [
            function (chunk_dac557ba_js_3_1) {
                chunk_dac557ba_js_3 = chunk_dac557ba_js_3_1;
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (_5) {
            },
            function (events_js_2_1) {
                events_js_2 = events_js_2_1;
            },
            function (chunk_cffba9d4_js_1_1) {
                chunk_cffba9d4_js_1 = chunk_cffba9d4_js_1_1;
            }
        ],
        execute: function () {
            d = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            l = p;
            f = events_js_2.default.EventEmitter;
            chunk_dac557ba_js_3.t(p, f), p.Readable = chunk_cffba9d4_js_1.o, p.Writable = chunk_cffba9d4_js_1.s, p.Duplex = chunk_cffba9d4_js_1.e, p.Transform = chunk_cffba9d4_js_1.t, p.PassThrough = chunk_cffba9d4_js_1.i, p.finished = chunk_cffba9d4_js_1.r, p.pipeline = chunk_cffba9d4_js_1.m, p.Stream = p, p.prototype.pipe = function (e, r) {
                var t = this || d;
                function o(r) {
                    e.writable && !1 === e.write(r) && t.pause && t.pause();
                }
                function i() {
                    t.readable && t.resume && t.resume();
                }
                t.on("data", o), e.on("drain", i), e._isStdio || r && !1 === r.end || (t.on("end", a), t.on("close", s));
                var n = !1;
                function a() {
                    n || (n = !0, e.end());
                }
                function s() {
                    n || (n = !0, "function" == typeof e.destroy && e.destroy());
                }
                function m(e) {
                    if (l(), 0 === f.listenerCount(this || d, "error"))
                        throw e;
                }
                function l() {
                    t.removeListener("data", o), e.removeListener("drain", i), t.removeListener("end", a), t.removeListener("close", s), t.removeListener("error", m), e.removeListener("error", m), t.removeListener("end", l), t.removeListener("close", l), e.removeListener("close", l);
                }
                return t.on("error", m), e.on("error", m), t.on("end", l), t.on("close", l), e.on("close", l), e.emit("pipe", t), e;
            };
            b = l;
            Readable = b.Readable;
            exports_9("Readable", Readable);
            Writable = b.Writable;
            exports_9("Writable", Writable);
            Duplex = b.Duplex;
            exports_9("Duplex", Duplex);
            Transform = b.Transform;
            exports_9("Transform", Transform);
            PassThrough = b.PassThrough;
            exports_9("PassThrough", PassThrough);
            finished = b.finished;
            exports_9("finished", finished);
            pipeline = b.pipeline;
            exports_9("pipeline", pipeline);
            Stream = b.Stream;
            exports_9("Stream", Stream);
            exports_9("default", b);
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/string_decoder", ["https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/buffer", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-6e68c801"], function (exports_10, context_10) {
    "use strict";
    var chunk_6e68c801_js_2, StringDecoder;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (_6) {
            },
            function (chunk_6e68c801_js_2_1) {
                chunk_6e68c801_js_2 = chunk_6e68c801_js_2_1;
            }
        ],
        execute: function () {
            StringDecoder = chunk_6e68c801_js_2.s.StringDecoder;
            exports_10("StringDecoder", StringDecoder);
            exports_10("default", chunk_6e68c801_js_2.s);
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/vm", [], function (exports_11, context_11) {
    "use strict";
    var _global, exports, indexOf, Object_keys, forEach, defineProp, globals, Script, Script$1, createContext, createScript, isContext, runInContext, runInNewContext, runInThisContext;
    var __moduleName = context_11 && context_11.id;
    function Context() { }
    return {
        setters: [],
        execute: function () {
            _global = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, exports = {}, indexOf = function (e, t) { if (e.indexOf)
                return e.indexOf(t); for (var n = 0; n < e.length; n++)
                if (e[n] === t)
                    return n; return -1; }, Object_keys = function (e) { if (Object.keys)
                return Object.keys(e); var t = []; for (var n in e)
                t.push(n); return t; }, forEach = function (e, t) { if (e.forEach)
                return e.forEach(t); for (var n = 0; n < e.length; n++)
                t(e[n], n, e); }, defineProp = function () { try {
                return Object.defineProperty({}, "_", {}), function (e, t, n) { Object.defineProperty(e, t, { writable: !0, enumerable: !1, configurable: !0, value: n }); };
            }
            catch (e) {
                return function (e, t, n) { e[t] = n; };
            } }(), globals = ["Array", "Boolean", "Date", "Error", "EvalError", "Function", "Infinity", "JSON", "Math", "NaN", "Number", "Object", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "URIError", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "undefined", "unescape"];
            Context.prototype = {};
            Script = exports.Script = function (e) { if (!((this || _global) instanceof Script))
                return new Script(e); (this || _global).code = e; };
            Script.prototype.runInContext = function (e) { if (!(e instanceof Context))
                throw new TypeError("needs a 'context' argument."); var t = document.createElement("iframe"); t.style || (t.style = {}), t.style.display = "none", document.body.appendChild(t); var n = t.contentWindow, r = n.eval, o = n.execScript; !r && o && (o.call(n, "null"), r = n.eval), forEach(Object_keys(e), (function (t) { n[t] = e[t]; })), forEach(globals, (function (t) { e[t] && (n[t] = e[t]); })); var c = Object_keys(n), i = r.call(n, (this || _global).code); return forEach(Object_keys(n), (function (t) { (t in e || -1 === indexOf(c, t)) && (e[t] = n[t]); })), forEach(globals, (function (t) { t in e || defineProp(e, t, n[t]); })), document.body.removeChild(t), i; }, Script.prototype.runInThisContext = function () { return eval((this || _global).code); }, Script.prototype.runInNewContext = function (e) { var t = Script.createContext(e), n = this.runInContext(t); return e && forEach(Object_keys(t), (function (n) { e[n] = t[n]; })), n; }, forEach(Object_keys(Script.prototype), (function (e) { exports[e] = Script[e] = function (t) { var n = Script(t); return n[e].apply(n, [].slice.call(arguments, 1)); }; })), exports.isContext = function (e) { return e instanceof Context; }, exports.createScript = function (e) { return exports.Script(e); }, exports.createContext = Script.createContext = function (e) { var t = new Context; return "object" == typeof e && forEach(Object_keys(e), (function (n) { t[n] = e[n]; })), t; };
            Script$1 = exports.Script;
            exports_11("Script", Script$1);
            createContext = exports.createContext;
            exports_11("createContext", createContext);
            createScript = exports.createScript;
            exports_11("createScript", createScript);
            isContext = exports.isContext;
            exports_11("isContext", isContext);
            runInContext = exports.runInContext;
            exports_11("runInContext", runInContext);
            runInNewContext = exports.runInNewContext;
            exports_11("runInNewContext", runInNewContext);
            runInThisContext = exports.runInThisContext;
            exports_11("runInThisContext", runInThisContext);
            exports_11("default", exports);
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/crypto", ["https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-dac557ba", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-0c2d1322", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/buffer", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/util", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-6e68c801", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/events", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-cffba9d4", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/stream", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/string_decoder", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/vm"], function (exports_12, context_12) {
    "use strict";
    var chunk_dac557ba_js_4, chunk_0c2d1322_js_3, buffer_js_3, chunk_6e68c801_js_3, stream_js_1, string_decoder_js_1, vm_js_1, o, n, t, f, a, e, o$1, f$1, h, r, _, e$1, u, h$1, _$1, r$1, e$2, n$2, o$3, f$3, c$1, a$2, l$1, I, s$1, h$2, _$2, n$3, r$2, o$4, f$4, l$2, a$3, w$1, _$3, e$4, n$4, r$3, l$3, o$5, c$3, d$2, p$2, b$2, w$2, g, B, T, m, A, U, x, j, q, L, k$2, z, D, F, G, H, W, X, Y, Z, $, tt, it, st, _t, et, nt, e$5, n$5, s$2, h$3, f$6, m$1, n$6, p$3, s$3, h$4, e$6, r$4, o$6, h$5, n$7, p$4, l$4, d$3, c$4, _$4, m$2, u$4, g$1, v$1, w$3, s$4, f$8, a$7, u$5, h$6, c$5, l$5, p$5, d$4, m$3, y$2, b$3, v$2, w$4, g$2, B$1, k$3, S$1, A$1, H$1, E$2, P$1, U$1, K$1, x$1, z$1, I$2, F$1, M$1, r$5, o$7, r$6, i, n$8, f$9, o$8, p$6, s$6, a$8, h$7, c$6, l$6, d$5, _$5, b$4, k$4, g$3, m$4, z$2, w$5, E$3, I$3, A$2, U$2, d$6, i$1, f$a, o$9, a$9, c$7, n$9, l$7, e$8, f$b, t$1, a$a, p$8, n$a, i$2, o$a, h$8, y$4, f$c, l$8, m$5, B$3, u$7, C$1, d$7, b$5, A$3, S$3, F$2, U$3, w$6, I$4, M$2, a$b, h$9, o$b, f$d, u$8, _$7, d$8, y$5, S$4, v$5, I$5, U$4, w$7, m$6, E$5, b$6, k$6, T$2, O$2, A$4, M$3, V$1, t$2, f$e, a$c, c$9, s$9, f$f, p$a, u$9, l$a, d$9, y$6, m$7, c$a, s$a, f$g, p$b, l$b, u$a, d$a, m$8, y$7, _$8, t$3, p$c, c$b, o$c, e$9, p$d, n$b, s$b, v$8, y$8, a$d, t$4, i$3, r$7, h$a, n$c, t$5, e$a, r$8, n$d, f$i, n$e, t$6, o$e, a$f, i$4, b$7, d$c, r$9, t$7, n$f, i$5, o$f, p$e, s$c, m$9, u$b, h$b, w$a, y$9, P$2, B$5, K$2, R$1, S$5, x$2, C$2, D$2, G$1, H$2, T$3, j$1, M$4, q$1, O$3, z$3, F$3, I$6, J$1, N$2, m$a, u$c, n$g, d$d, l$d, r$a, e$b, n$i, a$g, i$7, o$g, c$d, s$d, l$e, u$d, h$c, d$e, r$b, i$8, e$c, a$h, l$f, g$9, r$c, n$j, s$f, o$i, e$d, u$f, a$i, c$f, f$k, v$b, _$a, l$g, p$g, m$c, g$a, k$8, d$f, C$3, s$g, n$k, u$g, a$j, c$g, f$l, _$b, g$b, m$d, p$h, l$h, v$c, d$g, k$9, b$9, j$3, x$4, y$c, w$c, r$e, o$k, a$k, u$h, l$i, c$h, p$i, f$m, g$c, d$h, S$8, _$c, b$a, z$5, k$a, y$d, H$4, w$d, L$3, j$4, A$7, B$7, W$2, q$3, C$4, D$3, E$7, F$4, M$5, N$3, O$4, P$3, Q$1, R$2, T$4, V$2, X$2, Y$1, s$h, h$e, r$f, n$l, a$l, b$b, i$9, n$m, s$i, o$m, u$i, l$j, v$e, y$e, m$f, S$9, g$d, M$6, x$6, _$d, z$6, q$4, R$3, N$4, E$8, k$b, O$5, L$4, B$8, T$5, J$3, X$3, D$4, Y$2, W$3, K$4, U$6, G$3, H$5, Z$1, $$1, ee, de, ce, te, ae, re, be, ie, ne, se, ue, he, pe, le, ve, me, Se, ge, Ae, Ie, we, xe, _e, ze, qe, Re, Pe, je, Ne, Ee, Oe, Le, Be, o$n, s$j, a$m, u$j, c$i, f$n, p$k, d$i, g$e, _$e, v$f, b$c, m$g, S$a, j$6, w$f, B$9, k$c, D$5, U$7, N$5, O$6, A$9, x$7, I$9, q$5, F$6, K$5, R$4, G$4, L$5, M$7, J$4, V$4, z$7, H$6, Q$3, e$f, t$a, s$k, n$n, o$o, h$h, y$g, r$g, u$k, a$n, c$j, k$d, f$o, b$d, l$l, d$j, p$l, j$7, v$g, m$h, q$6, K$6, P$6, s$l, i$a, o$p, d$k, n$o, p$m, u$l, y$h, m$i, f$p, b$e, E$a, h$i, v$h, p$n, d$l, f$q, c$k, g$f, w$g, l$n, m$j, v$i, E$b, L$6, R$5, j$8, T$7, P$7, K$7, W$4, x$8, B$a, S$b, q$7, U$8, V$5, C$7, z$8, i$b, n$p, p$o, s$m, u$m, o$q, f$r, i$c, l$o, u$n, c$m, p$p, d$m, h$j, s$n, g$g, m$k, w$h, v$j, y$k, E$c, b$g, B$b, x$9, L$7, k$f, D$7, U$9, R$6, S$c, j$9, A$b, I$a, M$9, o$r, t$b, f$t, u$o, a$o, s$o, l$p, m$l, p$q, l$q, D$8, s$p, _$g, h$k, y$m, E$d, S$d, C$8, N$6, Cipher, Cipheriv, Decipher, Decipheriv, DiffieHellman, DiffieHellmanGroup, Hash, Hmac, Sign, Verify, constants, createCipher, createCipheriv, createCredentials, createDecipher, createDecipheriv, createDiffieHellman, createDiffieHellmanGroup, createECDH, createHash, createHmac, createSign, createVerify, getCiphers, getDiffieHellman, getHashes, listCiphers, pbkdf2, pbkdf2Sync, privateDecrypt, privateEncrypt, prng, pseudoRandomBytes, publicDecrypt, publicEncrypt, randomBytes, randomFill, randomFillSync, rng;
    var __moduleName = context_12 && context_12.id;
    function s(t) {
        o$1.call(this), this._block = e.allocUnsafe(t), this._blockSize = t, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
    }
    function n$1() {
        r.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
    }
    function o$2(t, i) {
        return t << i | t >>> 32 - i;
    }
    function f$2(t, i, s, h, r, _, e) {
        return o$2(t + (i & s | ~i & h) + r + _ | 0, e) + i | 0;
    }
    function c(t, i, s, h, r, _, e) {
        return o$2(t + (i & h | s & ~h) + r + _ | 0, e) + i | 0;
    }
    function a$1(t, i, s, h, r, _, e) {
        return o$2(t + (i ^ s ^ h) + r + _ | 0, e) + i | 0;
    }
    function l(t, i, s, h, r, _, e) {
        return o$2(t + (s ^ (i | ~h)) + r + _ | 0, e) + i | 0;
    }
    function u$1() {
        r$1.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
    }
    function b(t, i) {
        return t << i | t >>> 32 - i;
    }
    function d(t, i, s, h, _, r, e, n) {
        return b(t + (i ^ s ^ h) + r + e | 0, n) + _ | 0;
    }
    function k(t, i, s, h, _, r, e, n) {
        return b(t + (i & s | ~i & h) + r + e | 0, n) + _ | 0;
    }
    function p(t, i, s, h, _, r, e, n) {
        return b(t + ((i | ~s) ^ h) + r + e | 0, n) + _ | 0;
    }
    function w(t, i, s, h, _, r, e, n) {
        return b(t + (i & h | s & ~h) + r + e | 0, n) + _ | 0;
    }
    function E(t, i, s, h, _, r, e, n) {
        return b(t + (i ^ (s | ~h)) + r + e | 0, n) + _ | 0;
    }
    function e$3(t, i) {
        (this || s$1)._block = h$2.alloc(t), (this || s$1)._finalSize = i, (this || s$1)._blockSize = t, (this || s$1)._len = 0;
    }
    function u$2() {
        this.init(), (this || n$3)._w = a$3, o$4.call(this || n$3, 64, 56);
    }
    function c$2(t, i, s) {
        return s ^ t & (i ^ s);
    }
    function b$1(t, i, s) {
        return t & i | s & (t | i);
    }
    function p$1(t) {
        return (t >>> 2 | t << 30) ^ (t >>> 13 | t << 19) ^ (t >>> 22 | t << 10);
    }
    function d$1(t) {
        return (t >>> 6 | t << 26) ^ (t >>> 11 | t << 21) ^ (t >>> 25 | t << 7);
    }
    function k$1(t) {
        return (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
    }
    function f$5() {
        this.init(), (this || _$3)._w = o$5, n$4.call(this || _$3, 64, 56);
    }
    function a$4(t) {
        return t << 30 | t >>> 2;
    }
    function u$3(t, i, h, s) {
        return 0 === t ? i & h | ~i & s : 2 === t ? i & h | i & s | h & s : i ^ h ^ s;
    }
    function y() {
        this.init(), (this || d$2)._w = B, b$2.call(this || d$2, 64, 56);
    }
    function E$1(t) {
        return t << 5 | t >>> 27;
    }
    function I$1(t) {
        return t << 30 | t >>> 2;
    }
    function v(t, i, h, s) {
        return 0 === t ? i & h | ~i & s : 2 === t ? i & h | i & s | h & s : i ^ h ^ s;
    }
    function C() {
        this.init(), (this || m)._w = q, x.call(this || m, 64, 56);
    }
    function J() {
        this.init(), (this || k$2)._w = H, D.call(this || k$2, 128, 112);
    }
    function K(t, i, h) {
        return h ^ t & (i ^ h);
    }
    function M(t, i, h) {
        return t & i | h & (t | i);
    }
    function N(t, i) {
        return (t >>> 28 | i << 4) ^ (i >>> 2 | t << 30) ^ (i >>> 7 | t << 25);
    }
    function O(t, i) {
        return (t >>> 14 | i << 18) ^ (t >>> 18 | i << 14) ^ (i >>> 9 | t << 23);
    }
    function P(t, i) {
        return (t >>> 1 | i << 31) ^ (t >>> 8 | i << 24) ^ t >>> 7;
    }
    function Q(t, i) {
        return (t >>> 1 | i << 31) ^ (t >>> 8 | i << 24) ^ (t >>> 7 | i << 25);
    }
    function R(t, i) {
        return (t >>> 19 | i << 13) ^ (i >>> 29 | t << 3) ^ t >>> 6;
    }
    function S(t, i) {
        return (t >>> 19 | i << 13) ^ (i >>> 29 | t << 3) ^ (t >>> 6 | i << 26);
    }
    function V(t, i) {
        return t >>> 0 < i >>> 0 ? 1 : 0;
    }
    function ht() {
        this.init(), (this || X)._w = it, $.call(this || X, 128, 112);
    }
    function a$5(t) {
        s$2.call(this || e$5), (this || e$5).hashMode = "string" == typeof t, (this || e$5).hashMode ? (this || e$5)[t] = (this || e$5)._finalOrDigest : (this || e$5).final = (this || e$5)._finalOrDigest, (this || e$5)._final && ((this || e$5).__final = (this || e$5)._final, (this || e$5)._final = null), (this || e$5)._decoder = null, (this || e$5)._encoding = null;
    }
    function a$6(t) {
        s$3.call(this, "digest"), this._hash = t;
    }
    function f$7(t, a) {
        n$7.call(this, "digest"), "string" == typeof a && (a = h$5.from(a)), this._alg = t, this._key = a, a.length > 64 ? a = t(a) : a.length < 64 && (a = h$5.concat([a, p$4], 64));
        for (var e = this._ipad = h$5.allocUnsafe(64), i = this._opad = h$5.allocUnsafe(64), r = 0; r < 64; r++)
            e[r] = 54 ^ a[r], i[r] = 92 ^ a[r];
        this._hash = [e];
    }
    function y$1(t, a) {
        c$4.call(this, "digest"), "string" == typeof a && (a = _$4.from(a));
        var e = "sha512" === t || "sha384" === t ? 128 : 64;
        (this._alg = t, this._key = a, a.length > e) ? a = ("rmd160" === t ? new u$4() : g$1(t)).update(a).digest() : a.length < e && (a = _$4.concat([a, v$1], e));
        for (var i = this._ipad = _$4.allocUnsafe(e), r = this._opad = _$4.allocUnsafe(e), s = 0; s < e; s++)
            i[s] = 54 ^ a[s], r[s] = 92 ^ a[s];
        this._hash = "rmd160" === t ? new u$4() : g$1(t), this._hash.update(i);
    }
    function s$5(r, e) {
        if ("string" != typeof r && !f$8.isBuffer(r))
            throw new TypeError(e + " must be a buffer or string");
    }
    function T$1(r, e, t) {
        var n = function (r) {
            function e(e) {
                return y$2(r).update(e).digest();
            }
            return "rmd160" === r || "ripemd160" === r ? function (r) {
                return new m$3().update(r).digest();
            } : "md5" === r ? d$4 : e;
        }(r), o = "sha512" === r || "sha384" === r ? 128 : 64;
        e.length > o ? e = n(e) : e.length < o && (e = w$4.concat([e, g$2], o));
        for (var i = w$4.allocUnsafe(o + B$1[r]), f = w$4.allocUnsafe(o + B$1[r]), a = 0; a < o; a++)
            i[a] = 54 ^ e[a], f[a] = 92 ^ e[a];
        var s = w$4.allocUnsafe(o + t + 4);
        i.copy(s, 0, 0, o), (this || p$5).ipad1 = s, (this || p$5).ipad2 = i, (this || p$5).opad = f, (this || p$5).alg = r, (this || p$5).blocksize = o, (this || p$5).hash = n, (this || p$5).size = B$1[r];
    }
    function D$1(r, e, t, n, o) {
        return x$1.importKey("raw", r, {
            name: "PBKDF2"
        }, !1, ["deriveBits"]).then(function (r) {
            return x$1.deriveBits({
                name: "PBKDF2",
                salt: e,
                iterations: t,
                hash: {
                    name: o
                }
            }, r, n << 3);
        }).then(function (r) {
            return K$1.from(r);
        });
    }
    function e$7(r, e) {
        if (!r)
            throw new Error(e || "Assertion failed");
    }
    function u$6(t) {
        this.options = t, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0;
    }
    function y$3() {
        this.tmp = new Array(2), this.keys = null;
    }
    function v$3(t) {
        l$6.call(this, t);
        var e = new y$3();
        this._desState = e, this.deriveKeys(e, t.key);
    }
    function S$2(t) {
        k$4.equal(t.length, 8, "Invalid IV length"), this.iv = new Array(8);
        for (var e = 0; e < this.iv.length; e++)
            this.iv[e] = t[e];
    }
    function O$1(t, e) {
        w$5.equal(e.length, 24, "Invalid key length");
        var r = e.slice(0, 8), i = e.slice(8, 16), n = e.slice(16, 24);
        this.ciphers = "encrypt" === t ? [I$3.create({
                type: "encrypt",
                key: r
            }), I$3.create({
                type: "decrypt",
                key: i
            }), I$3.create({
                type: "encrypt",
                key: n
            })] : [I$3.create({
                type: "decrypt",
                key: n
            }), I$3.create({
                type: "encrypt",
                key: i
            }), I$3.create({
                type: "decrypt",
                key: r
            })];
    }
    function B$2(t) {
        E$3.call(this, t);
        var e = new O$1(this.type, this.options.key);
        this._edeState = e;
    }
    function p$7(e) {
        f$a.call(this || i$1);
        var t, r = e.mode.toLowerCase(), s = n$9[r];
        t = e.decrypt ? "decrypt" : "encrypt";
        var d = e.key;
        c$7.isBuffer(d) || (d = c$7.from(d)), "des-ede" !== r && "des-ede-cbc" !== r || (d = c$7.concat([d, d.slice(0, 8)]));
        var o = e.iv;
        c$7.isBuffer(o) || (o = c$7.from(o)), (this || i$1)._des = s.create({
            key: d,
            iv: o,
            type: t
        });
    }
    function v$4(e, c, r) {
        var t = c.length, a = h$8(c, e._cache);
        return e._cache = e._cache.slice(t), e._prev = o$a.concat([e._prev, r ? c : a]), a;
    }
    function s$7(e, c, r) {
        var t = e._cipher.encryptBlock(e._prev)[0] ^ c;
        return e._prev = f$c.concat([e._prev.slice(1), f$c.from([r ? c : t])]), t;
    }
    function _$6(e, c, r) {
        for (var t, a, p = -1, n = 0; ++p < 8;)
            t = c & 1 << 7 - p ? 128 : 0, n += (128 & (a = e._cipher.encryptBlock(e._prev)[0] ^ t)) >> p % 8, e._prev = k$5(e._prev, r ? t : a);
        return n;
    }
    function k$5(e, c) {
        var r = e.length, t = -1, a = m$5.allocUnsafe(e.length);
        for (e = m$5.concat([e, m$5.from([c])]); ++t < r;)
            a[t] = e[t] << 1 | e[t + 1] >> 7;
        return a;
    }
    function E$4(e) {
        return e._prev = e._cipher.encryptBlock(e._prev), e._prev;
    }
    function g$4(e) {
        var c = e._cipher.encryptBlockRaw(e._prev);
        return S$3(e._prev), c;
    }
    function s$8(t) {
        o$b.isBuffer(t) || (t = o$b.from(t));
        for (var e = t.length / 4 | 0, i = new Array(e), r = 0; r < e; r++)
            i[r] = t.readUInt32BE(4 * r);
        return i;
    }
    function c$8(t) {
        for (; 0 < t.length; t++)
            t[0] = 0;
    }
    function l$9(t, e, i, r, n) {
        for (var a, h, o, s, c = i[0], l = i[1], f = i[2], u = i[3], p = t[0] ^ e[0], _ = t[1] ^ e[1], d = t[2] ^ e[2], y = t[3] ^ e[3], B = 4, g = 1; g < n; g++)
            a = c[p >>> 24] ^ l[_ >>> 16 & 255] ^ f[d >>> 8 & 255] ^ u[255 & y] ^ e[B++], h = c[_ >>> 24] ^ l[d >>> 16 & 255] ^ f[y >>> 8 & 255] ^ u[255 & p] ^ e[B++], o = c[d >>> 24] ^ l[y >>> 16 & 255] ^ f[p >>> 8 & 255] ^ u[255 & _] ^ e[B++], s = c[y >>> 24] ^ l[p >>> 16 & 255] ^ f[_ >>> 8 & 255] ^ u[255 & d] ^ e[B++], p = a, _ = h, d = o, y = s;
        return a = (r[p >>> 24] << 24 | r[_ >>> 16 & 255] << 16 | r[d >>> 8 & 255] << 8 | r[255 & y]) ^ e[B++], h = (r[_ >>> 24] << 24 | r[d >>> 16 & 255] << 16 | r[y >>> 8 & 255] << 8 | r[255 & p]) ^ e[B++], o = (r[d >>> 24] << 24 | r[y >>> 16 & 255] << 16 | r[p >>> 8 & 255] << 8 | r[255 & _]) ^ e[B++], s = (r[y >>> 24] << 24 | r[p >>> 16 & 255] << 16 | r[_ >>> 8 & 255] << 8 | r[255 & d]) ^ e[B++], [a >>>= 0, h >>>= 0, o >>>= 0, s >>>= 0];
    }
    function p$9(t) {
        (this || a$b)._key = s$8(t), this._reset();
    }
    function B$4(t) {
        var e = d$8.allocUnsafe(16);
        return e.writeUInt32BE(t[0] >>> 0, 0), e.writeUInt32BE(t[1] >>> 0, 4), e.writeUInt32BE(t[2] >>> 0, 8), e.writeUInt32BE(t[3] >>> 0, 12), e;
    }
    function g$5(t) {
        (this || _$7).h = t, (this || _$7).state = d$8.alloc(16, 0), (this || _$7).cache = d$8.allocUnsafe(0);
    }
    function X$1(t, e, i, r) {
        w$7.call(this || v$5);
        var n = U$4.alloc(4, 0);
        (this || v$5)._cipher = new I$5.AES(e);
        var a = (this || v$5)._cipher.encryptBlock(n);
        (this || v$5)._ghash = new m$6(a), i = function (t, e, i) {
            if (12 === e.length)
                return t._finID = U$4.concat([e, U$4.from([0, 0, 0, 1])]), U$4.concat([e, U$4.from([0, 0, 0, 2])]);
            var r = new m$6(i), n = e.length, a = n % 16;
            r.update(e), a && (a = 16 - a, r.update(U$4.alloc(a, 0))), r.update(U$4.alloc(8, 0));
            var h = 8 * n, o = U$4.alloc(8);
            o.writeUIntBE(h, 0, 8), r.update(o), t._finID = r.state;
            var s = U$4.from(t._finID);
            return b$6(s), s;
        }(this || v$5, i, a), (this || v$5)._prev = U$4.from(i), (this || v$5)._cache = U$4.allocUnsafe(0), (this || v$5)._secCache = U$4.allocUnsafe(0), (this || v$5)._decrypt = r, (this || v$5)._alen = 0, (this || v$5)._len = 0, (this || v$5)._mode = t, (this || v$5)._authTag = null, (this || v$5)._called = !1;
    }
    function N$1(t, e, i, r) {
        M$3.call(this || T$2), (this || T$2)._cipher = new O$2.AES(e), (this || T$2)._prev = A$4.from(i), (this || T$2)._cache = A$4.allocUnsafe(0), (this || T$2)._secCache = A$4.allocUnsafe(0), (this || T$2)._decrypt = r, (this || T$2)._mode = t;
    }
    function g$6(t, e, r) {
        d$9.call(this || c$9), (this || c$9)._cache = new v$6(), (this || c$9)._last = void 0, (this || c$9)._cipher = new y$6.AES(e), (this || c$9)._prev = p$a.from(r), (this || c$9)._mode = t, (this || c$9)._autopadding = !0;
    }
    function v$6() {
        (this || c$9).cache = p$a.allocUnsafe(0);
    }
    function w$8(t, e, r) {
        var i = u$9[t.toLowerCase()];
        if (!i)
            throw new TypeError("invalid suite type");
        if ("string" == typeof r && (r = p$a.from(r)), "GCM" !== i.mode && r.length !== i.iv)
            throw new TypeError("invalid iv length " + r.length);
        if ("string" == typeof e && (e = p$a.from(e)), e.length !== i.key / 8)
            throw new TypeError("invalid key length " + e.length);
        return "stream" === i.type ? new l$a(i.module, e, r, !0) : "auth" === i.type ? new f$f(i.module, e, r, !0) : new g$6(i.module, e, r);
    }
    function v$7(t, e, r) {
        d$a.call(this || c$a), (this || c$a)._cache = new g$7(), (this || c$a)._cipher = new m$8.AES(e), (this || c$a)._prev = l$b.from(r), (this || c$a)._mode = t, (this || c$a)._autopadding = !0;
    }
    function g$7() {
        (this || c$a).cache = l$b.allocUnsafe(0);
    }
    function w$9(t, e, r) {
        var i = f$g[t.toLowerCase()];
        if (!i)
            throw new TypeError("invalid suite type");
        if ("string" == typeof e && (e = l$b.from(e)), e.length !== i.key / 8)
            throw new TypeError("invalid key length " + e.length);
        if ("string" == typeof r && (r = l$b.from(r)), "GCM" !== i.mode && r.length !== i.iv)
            throw new TypeError("invalid iv length " + r.length);
        return "stream" === i.type ? new u$a(i.module, e, r) : "auth" === i.type ? new p$b(i.module, e, r) : new v$7(i.module, e, r);
    }
    function f$h(e, r, i) {
        if (e = e.toLowerCase(), v$8[e])
            return s$b.createCipheriv(e, r, i);
        if (y$8[e])
            return new n$b({
                key: r,
                iv: i,
                mode: e
            });
        throw new TypeError("invalid suite type");
    }
    function c$c(e, r, i) {
        if (e = e.toLowerCase(), v$8[e])
            return s$b.createDecipheriv(e, r, i);
        if (y$8[e])
            return new n$b({
                key: r,
                iv: i,
                mode: e,
                decrypt: !0
            });
        throw new TypeError("invalid suite type");
    }
    function o$d(t) {
        (this || n$d).rand = t;
    }
    function d$b(r) {
        (this || t$6).rand = r || new a$f.Rand();
    }
    function l$c() {
        if (null !== w$a)
            return w$a;
        var f = [];
        f[0] = 2;
        for (var e = 1, c = 3; c < 1048576; c += 2) {
            for (var a = Math.ceil(Math.sqrt(c)), b = 0; b < e && f[b] <= a && c % f[b] != 0; b++)
                ;
            e !== b && f[b] <= a || (f[e++] = c);
        }
        return w$a = f, f;
    }
    function _$9(f) {
        for (var e = l$c(), c = 0; c < e.length; c++)
            if (0 === f.modn(e[c]))
                return 0 === f.cmpn(e[c]);
        return !0;
    }
    function g$8(f) {
        var e = r$9.mont(f);
        return 0 === o$f.toRed(e).redPow(f.subn(1)).fromRed().cmpn(1);
    }
    function v$9(f, e) {
        if (f < 16)
            return new r$9(2 === e || 5 === e ? [140, 123] : [140, 39]);
        var c, a;
        for (e = new r$9(e);;) {
            for (c = new r$9(d$c(Math.ceil(f / 8))); c.bitLength() > f;)
                c.ishrn(1);
            if (c.isEven() && c.iadd(i$5), c.testn(1) || c.iadd(o$f), e.cmp(o$f)) {
                if (!e.cmp(p$e))
                    for (; c.mod(s$c).cmp(m$9);)
                        c.iadd(h$b);
            }
            else
                for (; c.mod(t$7).cmp(u$b);)
                    c.iadd(h$b);
            if (_$9(a = c.shrn(1)) && _$9(c) && g$8(a) && g$8(c) && n$f.test(a) && n$f.test(c))
                return c;
        }
    }
    function E$6(f, e) {
        return e = e || "utf8", K$2.isBuffer(f) || (f = new K$2(f, e)), (this || B$5)._pub = new R$1(f), this || B$5;
    }
    function L$1(f, e) {
        return e = e || "utf8", K$2.isBuffer(f) || (f = new K$2(f, e)), (this || B$5)._priv = new R$1(f), this || B$5;
    }
    function k$7(f, e, c) {
        this.setGenerator(e), (this || B$5).__prime = new R$1(f), (this || B$5)._prime = R$1.mont((this || B$5).__prime), (this || B$5)._primeLen = f.length, (this || B$5)._pub = void 0, (this || B$5)._priv = void 0, (this || B$5)._primeCode = void 0, c ? ((this || B$5).setPublicKey = E$6, (this || B$5).setPrivateKey = L$1) : (this || B$5)._primeCode = 8;
    }
    function A$5(f, e) {
        var c = new K$2(f.toArray());
        return e ? c.toString(e) : c;
    }
    function t$8(e, o) {
        var r = function (e) {
            var o = i$6(e);
            return {
                blinder: o.toRed(n$g.mont(e.modulus)).redPow(new n$g(e.publicExponent)).fromRed(),
                unblinder: o.invm(e.modulus)
            };
        }(o), m = o.modulus.byteLength(), d = (n$g.mont(o.modulus), new n$g(e).mul(r.blinder).umod(o.modulus)), t = d.toRed(n$g.mont(o.prime1)), l = d.toRed(n$g.mont(o.prime2)), f = o.coefficient, p = o.prime1, b = o.prime2, s = t.redPow(o.exponent1), a = l.redPow(o.exponent2);
        s = s.fromRed(), a = a.fromRed();
        var w = s.isub(a).imul(f).umod(p);
        return w.imul(b), a.iadd(w), new u$c(a.imul(r.unblinder).umod(o.modulus).toArray(!1, m));
    }
    function i$6(e) {
        for (var o = e.modulus.byteLength(), r = new n$g(d$d(o)); r.cmp(e.modulus) >= 0 || !r.umod(e.prime1) || !r.umod(e.prime2);)
            r = new n$g(d$d(o));
        return r;
    }
    function t$9(r) {
        return 1 === r.length ? "0" + r : r;
    }
    function n$h(r) {
        for (var e = "", n = 0; n < r.length; n++)
            e += t$9(r[n].toString(16));
        return e;
    }
    function p$f(r, t) {
        if (r instanceof p$f)
            return r;
        this._importDER(r, t) || (h$c(r.r && r.s, "Signature without r or s"), this.r = new l$e(r.r, 16), this.s = new l$e(r.s, 16), void 0 === r.recoveryParam ? this.recoveryParam = null : this.recoveryParam = r.recoveryParam);
    }
    function f$j() {
        this.place = 0;
    }
    function v$a(r, t) {
        var e = r[t.place++];
        if (!(128 & e))
            return e;
        for (var n = 15 & e, a = 0, i = 0, o = t.place; i < n; i++, o++)
            a <<= 8, a |= r[o];
        return t.place = o, a;
    }
    function m$b(r) {
        for (var t = 0, e = r.length - 1; !r[t] && !(128 & r[t + 1]) && t < e;)
            t++;
        return 0 === t ? r : r.slice(t);
    }
    function y$a(r, t) {
        if (t < 128)
            return r.push(t), void 0;
        var e = 1 + (Math.log(t) / Math.LN2 >>> 3);
        for (r.push(128 | e); --e;)
            r.push(t >>> (e << 3) & 255);
        r.push(t);
    }
    function h$d(t, n) {
        return 55296 == (64512 & t.charCodeAt(n)) && !(n < 0 || n + 1 >= t.length) && 56320 == (64512 & t.charCodeAt(n + 1));
    }
    function o$h(t) {
        return (t >>> 24 | t >>> 8 & 65280 | t << 8 & 16711680 | (255 & t) << 24) >>> 0;
    }
    function u$e(t) {
        return 1 === t.length ? "0" + t : t;
    }
    function s$e(t) {
        return 7 === t.length ? "0" + t : 6 === t.length ? "00" + t : 5 === t.length ? "000" + t : 4 === t.length ? "0000" + t : 3 === t.length ? "00000" + t : 2 === t.length ? "000000" + t : 1 === t.length ? "0000000" + t : t;
    }
    function c$e() {
        this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
    }
    function y$b() {
        if (!(this instanceof y$b))
            return new y$b();
        k$8.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = d$f, this.W = new Array(160);
    }
    function b$8(t, h, i, r, n) {
        var s = t & i ^ ~t & n;
        return s < 0 && (s += 4294967296), s;
    }
    function x$3(t, h, i, r, n, s) {
        var o = h & r ^ ~h & s;
        return o < 0 && (o += 4294967296), o;
    }
    function B$6(t, h, i, r, n) {
        var s = t & i ^ t & n ^ i & n;
        return s < 0 && (s += 4294967296), s;
    }
    function S$6(t, h, i, r, n, s) {
        var o = h & r ^ h & s ^ r & s;
        return o < 0 && (o += 4294967296), o;
    }
    function W$1(t, h) {
        var i = e$d(t, h, 28) ^ e$d(h, t, 2) ^ e$d(h, t, 7);
        return i < 0 && (i += 4294967296), i;
    }
    function w$b(t, h) {
        var i = u$f(t, h, 28) ^ u$f(h, t, 2) ^ u$f(h, t, 7);
        return i < 0 && (i += 4294967296), i;
    }
    function z$4(t, h) {
        var i = e$d(t, h, 14) ^ e$d(t, h, 18) ^ e$d(h, t, 9);
        return i < 0 && (i += 4294967296), i;
    }
    function H$3(t, h) {
        var i = u$f(t, h, 14) ^ u$f(t, h, 18) ^ u$f(h, t, 9);
        return i < 0 && (i += 4294967296), i;
    }
    function j$2(t, h) {
        var i = e$d(t, h, 1) ^ e$d(t, h, 8) ^ a$i(t, h, 7);
        return i < 0 && (i += 4294967296), i;
    }
    function A$6(t, h) {
        var i = u$f(t, h, 1) ^ u$f(t, h, 8) ^ c$f(t, h, 7);
        return i < 0 && (i += 4294967296), i;
    }
    function L$2(t, h) {
        var i = e$d(t, h, 19) ^ e$d(h, t, 29) ^ a$i(t, h, 6);
        return i < 0 && (i += 4294967296), i;
    }
    function q$2(t, h) {
        var i = u$f(t, h, 19) ^ u$f(h, t, 29) ^ c$f(t, h, 6);
        return i < 0 && (i += 4294967296), i;
    }
    function r$d(t, h, i) {
        return t & h ^ ~t & i;
    }
    function e$e(t, h, i) {
        return t & h ^ t & i ^ h & i;
    }
    function o$j(t, h, i) {
        return t ^ h ^ i;
    }
    function S$7() {
        if (!(this instanceof S$7))
            return new S$7();
        x$4.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = y$c, this.W = new Array(64);
    }
    function m$e() {
        if (!(this instanceof m$e))
            return new m$e();
        g$c.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.W = new Array(80);
    }
    function v$d() {
        if (!(this instanceof v$d))
            return new v$d();
        z$5.call(this), this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428];
    }
    function x$5() {
        if (!(this instanceof x$5))
            return new x$5();
        w$d.call(this), this.h = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428];
    }
    function G$2() {
        if (!(this instanceof G$2))
            return new G$2();
        F$4.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";
    }
    function I$7(t, h, i, s) {
        return t <= 15 ? h ^ i ^ s : t <= 31 ? h & i | ~h & s : t <= 47 ? (h | ~i) ^ s : t <= 63 ? h & s | i & ~s : h ^ (i | ~s);
    }
    function J$2(t) {
        return t <= 15 ? 0 : t <= 31 ? 1518500249 : t <= 47 ? 1859775393 : t <= 63 ? 2400959708 : 2840853838;
    }
    function K$3(t) {
        return t <= 15 ? 1352829926 : t <= 31 ? 1548603684 : t <= 47 ? 1836072691 : t <= 63 ? 2053994217 : 0;
    }
    function U$5(t, h, i) {
        if (!(this instanceof U$5))
            return new U$5(t, h, i);
        this.Hash = t, this.blockSize = t.blockSize / 8, this.outSize = t.outSize / 8, this.inner = null, this.outer = null, this._init(R$2.toArray(h, i));
    }
    function o$l(t) {
        if (!(this instanceof o$l))
            return new o$l(t);
        this.hash = t.hash, this.predResist = !!t.predResist, this.outLen = this.hash.outSize, this.minEntropy = t.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
        var e = r$f.toArray(t.entropy, t.entropyEnc || "hex"), i = r$f.toArray(t.nonce, t.nonceEnc || "hex"), s = r$f.toArray(t.pers, t.persEnc || "hex");
        n$l(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(e, i, s);
    }
    function h$f(e, f) {
        this.type = e, this.p = new i$9(f.p, 16), this.red = f.prime ? i$9.red(f.prime) : i$9.mont(this.p), this.zero = new i$9(0).toRed(this.red), this.one = new i$9(1).toRed(this.red), this.two = new i$9(2).toRed(this.red), this.n = f.n && new i$9(f.n, 16), this.g = f.g && this.pointFromJSON(f.g, f.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
        var d = this.n && this.p.div(this.n);
        !d || d.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red));
    }
    function p$j(e, f) {
        this.curve = e, this.type = f, this.precomputed = null;
    }
    function A$8(e) {
        S$9.call(this, "short", e), this.a = new y$e(e.a, 16).toRed(this.red), this.b = new y$e(e.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = 0 === this.a.fromRed().cmpn(0), this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3), this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
    }
    function I$8(e, f, d, c) {
        S$9.BasePoint.call(this, e, "affine"), null === f && null === d ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new y$e(f, 16), this.y = new y$e(d, 16), c && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1);
    }
    function w$e(e, f, d, c) {
        S$9.BasePoint.call(this, e, "jacobian"), null === f && null === d && null === c ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new y$e(0)) : (this.x = new y$e(f, 16), this.y = new y$e(d, 16), this.z = new y$e(c, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
    }
    function P$4(e) {
        q$4.call(this, "mont", e), this.a = new _$d(e.a, 16).toRed(this.red), this.b = new _$d(e.b, 16).toRed(this.red), this.i4 = new _$d(4).toRed(this.red).redInvm(), this.two = new _$d(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two));
    }
    function j$5(e, f, d) {
        q$4.BasePoint.call(this, e, "projective"), null === f && null === d ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new _$d(f, 16), this.z = new _$d(d, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)));
    }
    function F$5(e) {
        this.twisted = 1 != (0 | e.a), this.mOneA = this.twisted && -1 == (0 | e.a), this.extended = this.mOneA, L$4.call(this, "edwards", e), this.a = new k$b(e.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new k$b(e.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new k$b(e.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), B$8(!this.twisted || 0 === this.c.fromRed().cmpn(1)), this.oneC = 1 == (0 | e.c);
    }
    function C$5(e, f, d, c, t) {
        L$4.BasePoint.call(this, e, "projective"), null === f && null === d && null === c ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new k$b(f, 16), this.y = new k$b(d, 16), this.z = c ? new k$b(c, 16) : this.curve.one, this.t = t && new k$b(t, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
    }
    function Q$2(e) {
        "short" === e.type ? this.curve = new G$3.short(e) : "edwards" === e.type ? this.curve = new G$3.edwards(e) : this.curve = new G$3.mont(e), this.g = this.curve.g, this.n = this.curve.n, this.hash = e.hash, H$5(this.g.validate(), "Invalid curve"), H$5(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
    }
    function V$3(e, f) {
        Object.defineProperty(K$4, e, {
            configurable: !0,
            enumerable: !0,
            get: function () {
                var d = new Q$2(f);
                return Object.defineProperty(K$4, e, {
                    configurable: !0,
                    enumerable: !0,
                    value: d
                }), d;
            }
        });
    }
    function fe(e, f) {
        this.ec = e, this.priv = null, this.pub = null, f.priv && this._importPrivate(f.priv, f.privEnc), f.pub && this._importPublic(f.pub, f.pubEnc);
    }
    function oe(e) {
        if (!(this instanceof oe))
            return new oe(e);
        "string" == typeof e && (ie(re.hasOwnProperty(e), "Unknown curve " + e), e = re[e]), e instanceof re.PresetCurve && (e = {
            curve: e
        }), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), this.hash = e.hash || e.curve.hash;
    }
    function ye(e, f) {
        this.eddsa = e, this._secret = le(f.secret), e.isPoint(f.pub) ? this._pub = f.pub : this._pubBytes = le(f.pub);
    }
    function Me(e, f) {
        this.eddsa = e, "object" != typeof f && (f = we(f)), Array.isArray(f) && (f = {
            R: f.slice(0, e.encodingLength),
            S: f.slice(e.encodingLength)
        }), Ae(f.R && f.S, "Signature without R or S"), e.isPoint(f.R) && (this._R = f.R), f.S instanceof Se && (this._S = f.S), this._Rencoded = Array.isArray(f.R) ? f.R : f.Rencoded, this._Sencoded = Array.isArray(f.S) ? f.S : f.Sencoded;
    }
    function ke(e) {
        if (Pe("ed25519" === e, "only tested with ed25519 so far"), !(this instanceof ke))
            return new ke(e);
        e = qe[e].curve;
        this.curve = e, this.g = e.g, this.g.precompute(e.n.bitLength() + 1), this.pointClass = e.point().constructor, this.encodingLength = Math.ceil(e.n.bitLength() / 8), this.hash = ze.sha512;
    }
    function l$k(e) {
        (this || u$j)._reporterState = {
            obj: null,
            path: [],
            options: e || {},
            errors: []
        };
    }
    function h$g(e, t) {
        (this || u$j).path = e, this.rethrow(t);
    }
    function y$f() {
        if (d$i)
            return p$k;
        d$i = !0;
        var e = chunk_dac557ba_js_4.t, r = E$9().Reporter, i = buffer_js_3.default.Buffer;
        function o(e, t) {
            if (r.call(this || g$e, t), !i.isBuffer(e))
                return this.error("Input not Buffer"), void 0;
            (this || g$e).base = e, (this || g$e).offset = 0, (this || g$e).length = e.length;
        }
        function s(e, t) {
            if (Array.isArray(e))
                (this || g$e).length = 0, (this || g$e).value = e.map(function (e) {
                    return e instanceof s || (e = new s(e, t)), (this || g$e).length += e.length, e;
                }, this || g$e);
            else if ("number" == typeof e) {
                if (!(0 <= e && e <= 255))
                    return t.error("non-byte EncoderBuffer value");
                (this || g$e).value = e, (this || g$e).length = 1;
            }
            else if ("string" == typeof e)
                (this || g$e).value = e, (this || g$e).length = i.byteLength(e);
            else {
                if (!i.isBuffer(e))
                    return t.error("Unsupported type: " + typeof e);
                (this || g$e).value = e, (this || g$e).length = e.length;
            }
        }
        return e(o, r), p$k.DecoderBuffer = o, o.prototype.save = function () {
            return {
                offset: (this || g$e).offset,
                reporter: r.prototype.save.call(this || g$e)
            };
        }, o.prototype.restore = function (e) {
            var t = new o((this || g$e).base);
            return t.offset = e.offset, t.length = (this || g$e).offset, (this || g$e).offset = e.offset, r.prototype.restore.call(this || g$e, e.reporter), t;
        }, o.prototype.isEmpty = function () {
            return (this || g$e).offset === (this || g$e).length;
        }, o.prototype.readUInt8 = function (e) {
            return (this || g$e).offset + 1 <= (this || g$e).length ? (this || g$e).base.readUInt8((this || g$e).offset++, !0) : this.error(e || "DecoderBuffer overrun");
        }, o.prototype.skip = function (e, t) {
            if (!((this || g$e).offset + e <= (this || g$e).length))
                return this.error(t || "DecoderBuffer overrun");
            var r = new o((this || g$e).base);
            return r._reporterState = (this || g$e)._reporterState, r.offset = (this || g$e).offset, r.length = (this || g$e).offset + e, (this || g$e).offset += e, r;
        }, o.prototype.raw = function (e) {
            return (this || g$e).base.slice(e ? e.offset : (this || g$e).offset, (this || g$e).length);
        }, p$k.EncoderBuffer = s, s.prototype.join = function (e, t) {
            return e || (e = new i((this || g$e).length)), t || (t = 0), 0 === (this || g$e).length || (Array.isArray((this || g$e).value) ? (this || g$e).value.forEach(function (r) {
                r.join(e, t), t += r.length;
            }) : ("number" == typeof (this || g$e).value ? e[t] = (this || g$e).value : "string" == typeof (this || g$e).value ? e.write((this || g$e).value, t) : i.isBuffer((this || g$e).value) && (this || g$e).value.copy(e, t), t += (this || g$e).length)), e;
        }, p$k;
    }
    function E$9() {
        if (S$a)
            return m$g;
        S$a = !0;
        var e = m$g;
        return e.Reporter = c$i.Reporter, e.DecoderBuffer = y$f().DecoderBuffer, e.EncoderBuffer = y$f().EncoderBuffer, e.Node = function () {
            if (v$f)
                return _$e;
            v$f = !0;
            var e = E$9().Reporter, t = E$9().EncoderBuffer, r = E$9().DecoderBuffer, n = o$7, o = ["seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr"], s = ["key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains"].concat(o);
            function a(e, t) {
                var r = {};
                (this || b$c)._baseState = r, r.enc = e, r.parent = t || null, r.children = null, r.tag = null, r.args = null, r.reverseArgs = null, r.choice = null, r.optional = !1, r.any = !1, r.obj = !1, r.use = null, r.useDecoder = null, r.key = null, r.default = null, r.explicit = null, r.implicit = null, r.contains = null, r.parent || (r.children = [], this._wrap());
            }
            _$e = a;
            var u = ["enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains"];
            return a.prototype.clone = function () {
                var e = (this || b$c)._baseState, t = {};
                u.forEach(function (r) {
                    t[r] = e[r];
                });
                var r = new (this || b$c).constructor(t.parent);
                return r._baseState = t, r;
            }, a.prototype._wrap = function () {
                var e = (this || b$c)._baseState;
                s.forEach(function (t) {
                    (this || b$c)[t] = function () {
                        var r = new (this || b$c).constructor(this || b$c);
                        return e.children.push(r), r[t].apply(r, arguments);
                    };
                }, this || b$c);
            }, a.prototype._init = function (e) {
                var t = (this || b$c)._baseState;
                n(null === t.parent), e.call(this || b$c), t.children = t.children.filter(function (e) {
                    return e._baseState.parent === (this || b$c);
                }, this || b$c), n.equal(t.children.length, 1, "Root node can have only one child");
            }, a.prototype._useArgs = function (e) {
                var t = (this || b$c)._baseState, r = e.filter(function (e) {
                    return e instanceof (this || b$c).constructor;
                }, this || b$c);
                e = e.filter(function (e) {
                    return !(e instanceof (this || b$c).constructor);
                }, this || b$c), 0 !== r.length && (n(null === t.children), t.children = r, r.forEach(function (e) {
                    e._baseState.parent = this || b$c;
                }, this || b$c)), 0 !== e.length && (n(null === t.args), t.args = e, t.reverseArgs = e.map(function (e) {
                    if ("object" != typeof e || e.constructor !== Object)
                        return e;
                    var t = {};
                    return Object.keys(e).forEach(function (r) {
                        r == (0 | r) && (r |= 0);
                        var n = e[r];
                        t[n] = r;
                    }), t;
                }));
            }, ["_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool"].forEach(function (e) {
                a.prototype[e] = function () {
                    var t = (this || b$c)._baseState;
                    throw new Error(e + " not implemented for encoding: " + t.enc);
                };
            }), o.forEach(function (e) {
                a.prototype[e] = function () {
                    var t = (this || b$c)._baseState, r = Array.prototype.slice.call(arguments);
                    return n(null === t.tag), t.tag = e, this._useArgs(r), this || b$c;
                };
            }), a.prototype.use = function (e) {
                n(e);
                var t = (this || b$c)._baseState;
                return n(null === t.use), t.use = e, this || b$c;
            }, a.prototype.optional = function () {
                return (this || b$c)._baseState.optional = !0, this || b$c;
            }, a.prototype.def = function (e) {
                var t = (this || b$c)._baseState;
                return n(null === t.default), t.default = e, t.optional = !0, this || b$c;
            }, a.prototype.explicit = function (e) {
                var t = (this || b$c)._baseState;
                return n(null === t.explicit && null === t.implicit), t.explicit = e, this || b$c;
            }, a.prototype.implicit = function (e) {
                var t = (this || b$c)._baseState;
                return n(null === t.explicit && null === t.implicit), t.implicit = e, this || b$c;
            }, a.prototype.obj = function () {
                var e = (this || b$c)._baseState, t = Array.prototype.slice.call(arguments);
                return e.obj = !0, 0 !== t.length && this._useArgs(t), this || b$c;
            }, a.prototype.key = function (e) {
                var t = (this || b$c)._baseState;
                return n(null === t.key), t.key = e, this || b$c;
            }, a.prototype.any = function () {
                return (this || b$c)._baseState.any = !0, this || b$c;
            }, a.prototype.choice = function (e) {
                var t = (this || b$c)._baseState;
                return n(null === t.choice), t.choice = e, this._useArgs(Object.keys(e).map(function (t) {
                    return e[t];
                })), this || b$c;
            }, a.prototype.contains = function (e) {
                var t = (this || b$c)._baseState;
                return n(null === t.use), t.contains = e, this || b$c;
            }, a.prototype._decode = function (e, t) {
                var n = (this || b$c)._baseState;
                if (null === n.parent)
                    return e.wrapResult(n.children[0]._decode(e, t));
                var i, o = n.default, s = !0, a = null;
                if (null !== n.key && (a = e.enterKey(n.key)), n.optional) {
                    var u = null;
                    if (null !== n.explicit ? u = n.explicit : null !== n.implicit ? u = n.implicit : null !== n.tag && (u = n.tag), null !== u || n.any) {
                        if (s = this._peekTag(e, u, n.any), e.isError(s))
                            return s;
                    }
                    else {
                        var c = e.save();
                        try {
                            null === n.choice ? this._decodeGeneric(n.tag, e, t) : this._decodeChoice(e, t), s = !0;
                        }
                        catch (e) {
                            s = !1;
                        }
                        e.restore(c);
                    }
                }
                if (n.obj && s && (i = e.enterObject()), s) {
                    if (null !== n.explicit) {
                        var f = this._decodeTag(e, n.explicit);
                        if (e.isError(f))
                            return f;
                        e = f;
                    }
                    var l = e.offset;
                    if (null === n.use && null === n.choice) {
                        if (n.any)
                            c = e.save();
                        var h = this._decodeTag(e, null !== n.implicit ? n.implicit : n.tag, n.any);
                        if (e.isError(h))
                            return h;
                        n.any ? o = e.raw(c) : e = h;
                    }
                    if (t && t.track && null !== n.tag && t.track(e.path(), l, e.length, "tagged"), t && t.track && null !== n.tag && t.track(e.path(), e.offset, e.length, "content"), o = n.any ? o : null === n.choice ? this._decodeGeneric(n.tag, e, t) : this._decodeChoice(e, t), e.isError(o))
                        return o;
                    if (n.any || null !== n.choice || null === n.children || n.children.forEach(function (r) {
                        r._decode(e, t);
                    }), n.contains && ("octstr" === n.tag || "bitstr" === n.tag)) {
                        var p = new r(o);
                        o = this._getUse(n.contains, e._reporterState.obj)._decode(p, t);
                    }
                }
                return n.obj && s && (o = e.leaveObject(i)), null === n.key || null === o && !0 !== s ? null !== a && e.exitKey(a) : e.leaveKey(a, n.key, o), o;
            }, a.prototype._decodeGeneric = function (e, t, r) {
                var n = (this || b$c)._baseState;
                return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, n.args[0], r) : /str$/.test(e) ? this._decodeStr(t, e, r) : "objid" === e && n.args ? this._decodeObjid(t, n.args[0], n.args[1], r) : "objid" === e ? this._decodeObjid(t, null, null, r) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e, r) : "null_" === e ? this._decodeNull(t, r) : "bool" === e ? this._decodeBool(t, r) : "objDesc" === e ? this._decodeStr(t, e, r) : "int" === e || "enum" === e ? this._decodeInt(t, n.args && n.args[0], r) : null !== n.use ? this._getUse(n.use, t._reporterState.obj)._decode(t, r) : t.error("unknown tag: " + e);
            }, a.prototype._getUse = function (e, t) {
                var r = (this || b$c)._baseState;
                return r.useDecoder = this._use(e, t), n(null === r.useDecoder._baseState.parent), r.useDecoder = r.useDecoder._baseState.children[0], r.implicit !== r.useDecoder._baseState.implicit && (r.useDecoder = r.useDecoder.clone(), r.useDecoder._baseState.implicit = r.implicit), r.useDecoder;
            }, a.prototype._decodeChoice = function (e, t) {
                var r = (this || b$c)._baseState, n = null, i = !1;
                return Object.keys(r.choice).some(function (o) {
                    var s = e.save(), a = r.choice[o];
                    try {
                        var u = a._decode(e, t);
                        if (e.isError(u))
                            return !1;
                        n = {
                            type: o,
                            value: u
                        }, i = !0;
                    }
                    catch (t) {
                        return e.restore(s), !1;
                    }
                    return !0;
                }, this || b$c), i ? n : e.error("Choice not matched");
            }, a.prototype._createEncoderBuffer = function (e) {
                return new t(e, (this || b$c).reporter);
            }, a.prototype._encode = function (e, t, r) {
                var n = (this || b$c)._baseState;
                if (null === n.default || n.default !== e) {
                    var i = this._encodeValue(e, t, r);
                    if (void 0 !== i && !this._skipDefault(i, t, r))
                        return i;
                }
            }, a.prototype._encodeValue = function (t, r, n) {
                var i = (this || b$c)._baseState;
                if (null === i.parent)
                    return i.children[0]._encode(t, r || new e());
                var o = null;
                if ((this || b$c).reporter = r, i.optional && void 0 === t) {
                    if (null === i.default)
                        return;
                    t = i.default;
                }
                var s = null, a = !1;
                if (i.any)
                    o = this._createEncoderBuffer(t);
                else if (i.choice)
                    o = this._encodeChoice(t, r);
                else if (i.contains)
                    s = this._getUse(i.contains, n)._encode(t, r), a = !0;
                else if (i.children)
                    s = i.children.map(function (e) {
                        if ("null_" === e._baseState.tag)
                            return e._encode(null, r, t);
                        if (null === e._baseState.key)
                            return r.error("Child should have a key");
                        var n = r.enterKey(e._baseState.key);
                        if ("object" != typeof t)
                            return r.error("Child expected, but input is not object");
                        var i = e._encode(t[e._baseState.key], r, t);
                        return r.leaveKey(n), i;
                    }, this || b$c).filter(function (e) {
                        return e;
                    }), s = this._createEncoderBuffer(s);
                else if ("seqof" === i.tag || "setof" === i.tag) {
                    if (!i.args || 1 !== i.args.length)
                        return r.error("Too many args for : " + i.tag);
                    if (!Array.isArray(t))
                        return r.error("seqof/setof, but data is not Array");
                    var u = this.clone();
                    u._baseState.implicit = null, s = this._createEncoderBuffer(t.map(function (e) {
                        var n = (this || b$c)._baseState;
                        return this._getUse(n.args[0], t)._encode(e, r);
                    }, u));
                }
                else
                    null !== i.use ? o = this._getUse(i.use, n)._encode(t, r) : (s = this._encodePrimitive(i.tag, t), a = !0);
                if (!i.any && null === i.choice) {
                    var c = null !== i.implicit ? i.implicit : i.tag, f = null === i.implicit ? "universal" : "context";
                    null === c ? null === i.use && r.error("Tag could be omitted only for .use()") : null === i.use && (o = this._encodeComposite(c, a, f, s));
                }
                return null !== i.explicit && (o = this._encodeComposite(i.explicit, !1, "context", o)), o;
            }, a.prototype._encodeChoice = function (e, t) {
                var r = (this || b$c)._baseState, i = r.choice[e.type];
                return i || n(!1, e.type + " not found in " + JSON.stringify(Object.keys(r.choice))), i._encode(e.value, t);
            }, a.prototype._encodePrimitive = function (e, t) {
                var r = (this || b$c)._baseState;
                if (/str$/.test(e))
                    return this._encodeStr(t, e);
                if ("objid" === e && r.args)
                    return this._encodeObjid(t, r.reverseArgs[0], r.args[1]);
                if ("objid" === e)
                    return this._encodeObjid(t, null, null);
                if ("gentime" === e || "utctime" === e)
                    return this._encodeTime(t, e);
                if ("null_" === e)
                    return this._encodeNull();
                if ("int" === e || "enum" === e)
                    return this._encodeInt(t, r.args && r.reverseArgs[0]);
                if ("bool" === e)
                    return this._encodeBool(t);
                if ("objDesc" === e)
                    return this._encodeStr(t, e);
                throw new Error("Unsupported tag: " + e);
            }, a.prototype._isNumstr = function (e) {
                return /^[0-9 ]*$/.test(e);
            }, a.prototype._isPrintstr = function (e) {
                return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e);
            }, _$e;
        }(), m$g;
    }
    function T$6() {
        if (k$c)
            return B$9;
        k$c = !0;
        var e = B$9;
        return e._reverse = function (e) {
            var t = {};
            return Object.keys(e).forEach(function (r) {
                (0 | r) == r && (r |= 0);
                var n = e[r];
                t[n] = r;
            }), t;
        }, e.der = function () {
            if (w$f)
                return j$6;
            w$f = !0;
            var e = T$6();
            return j$6.tagClass = {
                0: "universal",
                1: "application",
                2: "context",
                3: "private"
            }, j$6.tagClassByName = e._reverse(j$6.tagClass), j$6.tag = {
                0: "end",
                1: "bool",
                2: "int",
                3: "bitstr",
                4: "octstr",
                5: "null_",
                6: "objid",
                7: "objDesc",
                8: "external",
                9: "real",
                10: "enum",
                11: "embed",
                12: "utf8str",
                13: "relativeOid",
                16: "seq",
                17: "set",
                18: "numstr",
                19: "printstr",
                20: "t61str",
                21: "videostr",
                22: "ia5str",
                23: "utctime",
                24: "gentime",
                25: "graphstr",
                26: "iso646str",
                27: "genstr",
                28: "unistr",
                29: "charstr",
                30: "bmpstr"
            }, j$6.tagByName = e._reverse(j$6.tag), j$6;
        }(), B$9;
    }
    function C$6() {
        if (U$7)
            return D$5;
        U$7 = !0;
        var e = chunk_dac557ba_js_4.t, r = Y$3(), n = r.base, i = r.bignum, o = r.constants.der;
        function s(e) {
            (this || N$5).enc = "der", (this || N$5).name = e.name, (this || N$5).entity = e, (this || N$5).tree = new a(), (this || N$5).tree._init(e.body);
        }
        function a(e) {
            n.Node.call(this || N$5, "der", e);
        }
        function u(e, t) {
            var r = e.readUInt8(t);
            if (e.isError(r))
                return r;
            var n = o.tagClass[r >> 6], i = 0 == (32 & r);
            if (31 == (31 & r)) {
                var s = r;
                for (r = 0; 128 == (128 & s);) {
                    if (s = e.readUInt8(t), e.isError(s))
                        return s;
                    r <<= 7, r |= 127 & s;
                }
            }
            else
                r &= 31;
            return {
                cls: n,
                primitive: i,
                tag: r,
                tagStr: o.tag[r]
            };
        }
        function c(e, t, r) {
            var n = e.readUInt8(r);
            if (e.isError(n))
                return n;
            if (!t && 128 === n)
                return null;
            if (0 == (128 & n))
                return n;
            var i = 127 & n;
            if (i > 4)
                return e.error("length octect is too long");
            n = 0;
            for (var o = 0; o < i; o++) {
                n <<= 8;
                var s = e.readUInt8(r);
                if (e.isError(s))
                    return s;
                n |= s;
            }
            return n;
        }
        return D$5 = s, s.prototype.decode = function (e, t) {
            return e instanceof n.DecoderBuffer || (e = new n.DecoderBuffer(e, t)), (this || N$5).tree._decode(e, t);
        }, e(a, n.Node), a.prototype._peekTag = function (e, t, r) {
            if (e.isEmpty())
                return !1;
            var n = e.save(), i = u(e, 'Failed to peek tag: "' + t + '"');
            return e.isError(i) ? i : (e.restore(n), i.tag === t || i.tagStr === t || i.tagStr + "of" === t || r);
        }, a.prototype._decodeTag = function (e, t, r) {
            var n = u(e, 'Failed to decode tag of "' + t + '"');
            if (e.isError(n))
                return n;
            var i = c(e, n.primitive, 'Failed to get length of "' + t + '"');
            if (e.isError(i))
                return i;
            if (!r && n.tag !== t && n.tagStr !== t && n.tagStr + "of" !== t)
                return e.error('Failed to match tag: "' + t + '"');
            if (n.primitive || null !== i)
                return e.skip(i, 'Failed to match body of: "' + t + '"');
            var o = e.save(), s = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + (this || N$5).tag + '"');
            return e.isError(s) ? s : (i = e.offset - o.offset, e.restore(o), e.skip(i, 'Failed to match body of: "' + t + '"'));
        }, a.prototype._skipUntilEnd = function (e, t) {
            for (;;) {
                var r = u(e, t);
                if (e.isError(r))
                    return r;
                var n, i = c(e, r.primitive, t);
                if (e.isError(i))
                    return i;
                if (n = r.primitive || null !== i ? e.skip(i) : this._skipUntilEnd(e, t), e.isError(n))
                    return n;
                if ("end" === r.tagStr)
                    break;
            }
        }, a.prototype._decodeList = function (e, t, r, n) {
            for (var i = []; !e.isEmpty();) {
                var o = this._peekTag(e, "end");
                if (e.isError(o))
                    return o;
                var s = r.decode(e, "der", n);
                if (e.isError(s) && o)
                    break;
                i.push(s);
            }
            return i;
        }, a.prototype._decodeStr = function (e, t) {
            if ("bitstr" === t) {
                var r = e.readUInt8();
                return e.isError(r) ? r : {
                    unused: r,
                    data: e.raw()
                };
            }
            if ("bmpstr" === t) {
                var n = e.raw();
                if (n.length % 2 == 1)
                    return e.error("Decoding of string type: bmpstr length mismatch");
                for (var i = "", o = 0; o < n.length / 2; o++)
                    i += String.fromCharCode(n.readUInt16BE(2 * o));
                return i;
            }
            if ("numstr" === t) {
                var s = e.raw().toString("ascii");
                return this._isNumstr(s) ? s : e.error("Decoding of string type: numstr unsupported characters");
            }
            if ("octstr" === t)
                return e.raw();
            if ("objDesc" === t)
                return e.raw();
            if ("printstr" === t) {
                var a = e.raw().toString("ascii");
                return this._isPrintstr(a) ? a : e.error("Decoding of string type: printstr unsupported characters");
            }
            return /str$/.test(t) ? e.raw().toString() : e.error("Decoding of string type: " + t + " unsupported");
        }, a.prototype._decodeObjid = function (e, t, r) {
            for (var n, i = [], o = 0; !e.isEmpty();) {
                var s = e.readUInt8();
                o <<= 7, o |= 127 & s, 0 == (128 & s) && (i.push(o), o = 0);
            }
            128 & s && i.push(o);
            var a = i[0] / 40 | 0, u = i[0] % 40;
            if (n = r ? i : [a, u].concat(i.slice(1)), t) {
                var c = t[n.join(" ")];
                void 0 === c && (c = t[n.join(".")]), void 0 !== c && (n = c);
            }
            return n;
        }, a.prototype._decodeTime = function (e, t) {
            var r = e.raw().toString();
            if ("gentime" === t)
                var n = 0 | r.slice(0, 4), i = 0 | r.slice(4, 6), o = 0 | r.slice(6, 8), s = 0 | r.slice(8, 10), a = 0 | r.slice(10, 12), u = 0 | r.slice(12, 14);
            else {
                if ("utctime" !== t)
                    return e.error("Decoding " + t + " time is not supported yet");
                n = 0 | r.slice(0, 2), i = 0 | r.slice(2, 4), o = 0 | r.slice(4, 6), s = 0 | r.slice(6, 8), a = 0 | r.slice(8, 10), u = 0 | r.slice(10, 12);
                n = n < 70 ? 2e3 + n : 1900 + n;
            }
            return Date.UTC(n, i - 1, o, s, a, u, 0);
        }, a.prototype._decodeNull = function (e) {
            return null;
        }, a.prototype._decodeBool = function (e) {
            var t = e.readUInt8();
            return e.isError(t) ? t : 0 !== t;
        }, a.prototype._decodeInt = function (e, t) {
            var r = e.raw(), n = new i(r);
            return t && (n = t[n.toString(10)] || n), n;
        }, a.prototype._use = function (e, t) {
            return "function" == typeof e && (e = e(t)), e._getDecoder("der").tree;
        }, D$5;
    }
    function P$5() {
        if (q$5)
            return I$9;
        q$5 = !0;
        var e = I$9;
        return e.der = C$6(), e.pem = function () {
            if (A$9)
                return O$6;
            A$9 = !0;
            var e = chunk_dac557ba_js_4.t, r = buffer_js_3.default.Buffer, i = C$6();
            function o(e) {
                i.call(this || x$7, e), (this || x$7).enc = "pem";
            }
            return e(o, i), O$6 = o, o.prototype.decode = function (e, t) {
                for (var n = e.toString().split(/[\r\n]+/g), o = t.label.toUpperCase(), s = /^-----(BEGIN|END) ([^-]+)-----$/, a = -1, u = -1, c = 0; c < n.length; c++) {
                    var f = n[c].match(s);
                    if (null !== f && f[2] === o) {
                        if (-1 !== a) {
                            if ("END" !== f[1])
                                break;
                            u = c;
                            break;
                        }
                        if ("BEGIN" !== f[1])
                            break;
                        a = c;
                    }
                }
                if (-1 === a || -1 === u)
                    throw new Error("PEM section not found for: " + o);
                var l = n.slice(a + 1, u).join("");
                l.replace(/[^a-z0-9\+\/=]+/gi, "");
                var h = new r(l, "base64");
                return i.prototype.decode.call(this || x$7, h, t);
            }, O$6;
        }(), I$9;
    }
    function $$2() {
        if (K$5)
            return F$6;
        K$5 = !0;
        var e = chunk_dac557ba_js_4.t, r = buffer_js_3.default.Buffer, i = Y$3(), o = i.base, s = i.constants.der;
        function a(e) {
            (this || R$4).enc = "der", (this || R$4).name = e.name, (this || R$4).entity = e, (this || R$4).tree = new u(), (this || R$4).tree._init(e.body);
        }
        function u(e) {
            o.Node.call(this || R$4, "der", e);
        }
        function c(e) {
            return e < 10 ? "0" + e : e;
        }
        return F$6 = a, a.prototype.encode = function (e, t) {
            return (this || R$4).tree._encode(e, t).join();
        }, e(u, o.Node), u.prototype._encodeComposite = function (e, t, n, i) {
            var o, a = function (e, t, r, n) {
                var i;
                "seqof" === e ? e = "seq" : "setof" === e && (e = "set");
                if (s.tagByName.hasOwnProperty(e))
                    i = s.tagByName[e];
                else {
                    if ("number" != typeof e || (0 | e) !== e)
                        return n.error("Unknown tag: " + e);
                    i = e;
                }
                if (i >= 31)
                    return n.error("Multi-octet tag encoding unsupported");
                t || (i |= 32);
                return i |= s.tagClassByName[r || "universal"] << 6;
            }(e, t, n, (this || R$4).reporter);
            if (i.length < 128)
                return (o = new r(2))[0] = a, o[1] = i.length, this._createEncoderBuffer([o, i]);
            for (var u = 1, c = i.length; c >= 256; c >>= 8)
                u++;
            (o = new r(2 + u))[0] = a, o[1] = 128 | u;
            c = 1 + u;
            for (var f = i.length; f > 0; c--, f >>= 8)
                o[c] = 255 & f;
            return this._createEncoderBuffer([o, i]);
        }, u.prototype._encodeStr = function (e, t) {
            if ("bitstr" === t)
                return this._createEncoderBuffer([0 | e.unused, e.data]);
            if ("bmpstr" === t) {
                for (var n = new r(2 * e.length), i = 0; i < e.length; i++)
                    n.writeUInt16BE(e.charCodeAt(i), 2 * i);
                return this._createEncoderBuffer(n);
            }
            return "numstr" === t ? this._isNumstr(e) ? this._createEncoderBuffer(e) : (this || R$4).reporter.error("Encoding of string type: numstr supports only digits and space") : "printstr" === t ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : (this || R$4).reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(t) || "objDesc" === t ? this._createEncoderBuffer(e) : (this || R$4).reporter.error("Encoding of string type: " + t + " unsupported");
        }, u.prototype._encodeObjid = function (e, t, n) {
            if ("string" == typeof e) {
                if (!t)
                    return (this || R$4).reporter.error("string objid given, but no values map found");
                if (!t.hasOwnProperty(e))
                    return (this || R$4).reporter.error("objid not found in values map");
                e = t[e].split(/[\s\.]+/g);
                for (var i = 0; i < e.length; i++)
                    e[i] |= 0;
            }
            else if (Array.isArray(e)) {
                e = e.slice();
                for (i = 0; i < e.length; i++)
                    e[i] |= 0;
            }
            if (!Array.isArray(e))
                return (this || R$4).reporter.error("objid() should be either array or string, got: " + JSON.stringify(e));
            if (!n) {
                if (e[1] >= 40)
                    return (this || R$4).reporter.error("Second objid identifier OOB");
                e.splice(0, 2, 40 * e[0] + e[1]);
            }
            var o = 0;
            for (i = 0; i < e.length; i++) {
                var s = e[i];
                for (o++; s >= 128; s >>= 7)
                    o++;
            }
            var a = new r(o), u = a.length - 1;
            for (i = e.length - 1; i >= 0; i--) {
                s = e[i];
                for (a[u--] = 127 & s; (s >>= 7) > 0;)
                    a[u--] = 128 | 127 & s;
            }
            return this._createEncoderBuffer(a);
        }, u.prototype._encodeTime = function (e, t) {
            var r, n = new Date(e);
            return "gentime" === t ? r = [c(n.getFullYear()), c(n.getUTCMonth() + 1), c(n.getUTCDate()), c(n.getUTCHours()), c(n.getUTCMinutes()), c(n.getUTCSeconds()), "Z"].join("") : "utctime" === t ? r = [c(n.getFullYear() % 100), c(n.getUTCMonth() + 1), c(n.getUTCDate()), c(n.getUTCHours()), c(n.getUTCMinutes()), c(n.getUTCSeconds()), "Z"].join("") : (this || R$4).reporter.error("Encoding " + t + " time is not supported yet"), this._encodeStr(r, "octstr");
        }, u.prototype._encodeNull = function () {
            return this._createEncoderBuffer("");
        }, u.prototype._encodeInt = function (e, t) {
            if ("string" == typeof e) {
                if (!t)
                    return (this || R$4).reporter.error("String int or enum given, but no values map");
                if (!t.hasOwnProperty(e))
                    return (this || R$4).reporter.error("Values map doesn't contain: " + JSON.stringify(e));
                e = t[e];
            }
            if ("number" != typeof e && !r.isBuffer(e)) {
                var n = e.toArray();
                !e.sign && 128 & n[0] && n.unshift(0), e = new r(n);
            }
            if (r.isBuffer(e)) {
                var i = e.length;
                0 === e.length && i++;
                var o = new r(i);
                return e.copy(o), 0 === e.length && (o[0] = 0), this._createEncoderBuffer(o);
            }
            if (e < 128)
                return this._createEncoderBuffer(e);
            if (e < 256)
                return this._createEncoderBuffer([0, e]);
            i = 1;
            for (var s = e; s >= 256; s >>= 8)
                i++;
            for (s = (o = new Array(i)).length - 1; s >= 0; s--)
                o[s] = 255 & e, e >>= 8;
            return 128 & o[0] && o.unshift(0), this._createEncoderBuffer(new r(o));
        }, u.prototype._encodeBool = function (e) {
            return this._createEncoderBuffer(e ? 255 : 0);
        }, u.prototype._use = function (e, t) {
            return "function" == typeof e && (e = e(t)), e._getEncoder("der").tree;
        }, u.prototype._skipDefault = function (e, t, r) {
            var n, i = (this || R$4)._baseState;
            if (null === i.default)
                return !1;
            var o = e.join();
            if (void 0 === i.defaultBuffer && (i.defaultBuffer = this._encodeValue(i.default, t, r).join()), o.length !== i.defaultBuffer.length)
                return !1;
            for (n = 0; n < o.length; n++)
                if (o[n] !== i.defaultBuffer[n])
                    return !1;
            return !0;
        }, F$6;
    }
    function Z$2() {
        if (V$4)
            return J$4;
        V$4 = !0;
        var e = J$4;
        return e.der = $$2(), e.pem = function () {
            if (L$5)
                return G$4;
            L$5 = !0;
            var e = chunk_dac557ba_js_4.t, r = $$2();
            function n(e) {
                r.call(this || M$7, e), (this || M$7).enc = "pem";
            }
            return e(n, r), G$4 = n, n.prototype.encode = function (e, t) {
                for (var n = r.prototype.encode.call(this || M$7, e).toString("base64"), i = ["-----BEGIN " + t.label + "-----"], o = 0; o < n.length; o += 64)
                    i.push(n.slice(o, o + 64));
                return i.push("-----END " + t.label + "-----"), i.join("\n");
            }, G$4;
        }(), J$4;
    }
    function Y$3() {
        if (H$6)
            return z$7;
        H$6 = !0;
        var n = z$7;
        return n.bignum = n$c, n.define = function () {
            if (s$j)
                return o$n;
            s$j = !0;
            var e = Y$3(), n = chunk_dac557ba_js_4.t;
            function i(e, t) {
                (this || a$m).name = e, (this || a$m).body = t, (this || a$m).decoders = {}, (this || a$m).encoders = {};
            }
            return o$n.define = function (e, t) {
                return new i(e, t);
            }, i.prototype._createNamed = function (e) {
                var t;
                try {
                    t = vm_js_1.default.runInThisContext("(function " + (this || a$m).name + "(entity) {\n  this._initNamed(entity);\n})");
                }
                catch (e) {
                    t = function (e) {
                        this._initNamed(e);
                    };
                }
                return n(t, e), t.prototype._initNamed = function (t) {
                    e.call(this || a$m, t);
                }, new t(this || a$m);
            }, i.prototype._getDecoder = function (t) {
                return t = t || "der", (this || a$m).decoders.hasOwnProperty(t) || ((this || a$m).decoders[t] = this._createNamed(e.decoders[t])), (this || a$m).decoders[t];
            }, i.prototype.decode = function (e, t, r) {
                return this._getDecoder(t).decode(e, r);
            }, i.prototype._getEncoder = function (t) {
                return t = t || "der", (this || a$m).encoders.hasOwnProperty(t) || ((this || a$m).encoders[t] = this._createNamed(e.encoders[t])), (this || a$m).encoders[t];
            }, i.prototype.encode = function (e, t, r) {
                return this._getEncoder(t).encode(e, r);
            }, o$n;
        }().define, n.base = E$9(), n.constants = T$6(), n.decoders = P$5(), n.encoders = Z$2(), z$7;
    }
    function l$m(e) {
        var r;
        "object" != typeof e || h$i.isBuffer(e) || (r = e.passphrase, e = e.key), "string" == typeof e && (e = h$i.from(e));
        var a, t, c = f$p(e, r), s = c.tag, i = c.data;
        switch (s) {
            case "CERTIFICATE":
                t = y$h.certificate.decode(i, "der").tbsCertificate.subjectPublicKeyInfo;
            case "PUBLIC KEY":
                switch (t || (t = y$h.PublicKey.decode(i, "der")), a = t.algorithm.algorithm.join(".")) {
                    case "1.2.840.113549.1.1.1":
                        return y$h.RSAPublicKey.decode(t.subjectPublicKey.data, "der");
                    case "1.2.840.10045.2.1":
                        return t.subjectPrivateKey = t.subjectPublicKey, {
                            type: "ec",
                            data: t
                        };
                    case "1.2.840.10040.4.1":
                        return t.algorithm.params.pub_key = y$h.DSAparam.decode(t.subjectPublicKey.data, "der"), {
                            type: "dsa",
                            data: t.algorithm.params
                        };
                    default:
                        throw new Error("unknown key id " + a);
                }
            case "ENCRYPTED PRIVATE KEY":
                i = function (e, r) {
                    var a = e.algorithm.decrypt.kde.kdeparams.salt, t = parseInt(e.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), c = m$i[e.algorithm.decrypt.cipher.algo.join(".")], s = e.algorithm.decrypt.cipher.iv, i = e.subjectPrivateKey, o = parseInt(c.split("-")[1], 10) / 8, d = E$a.pbkdf2Sync(r, a, t, o, "sha1"), n = b$e.createDecipheriv(c, d, s), p = [];
                    return p.push(n.update(i)), p.push(n.final()), h$i.concat(p);
                }(i = y$h.EncryptedPrivateKey.decode(i, "der"), r);
            case "PRIVATE KEY":
                switch (a = (t = y$h.PrivateKey.decode(i, "der")).algorithm.algorithm.join(".")) {
                    case "1.2.840.113549.1.1.1":
                        return y$h.RSAPrivateKey.decode(t.subjectPrivateKey, "der");
                    case "1.2.840.10045.2.1":
                        return {
                            curve: t.algorithm.curve,
                            privateKey: y$h.ECPrivateKey.decode(t.subjectPrivateKey, "der").privateKey
                        };
                    case "1.2.840.10040.4.1":
                        return t.algorithm.params.priv_key = y$h.DSAparam.decode(t.subjectPrivateKey, "der"), {
                            type: "dsa",
                            params: t.algorithm.params
                        };
                    default:
                        throw new Error("unknown key id " + a);
                }
            case "RSA PUBLIC KEY":
                return y$h.RSAPublicKey.decode(i, "der");
            case "RSA PRIVATE KEY":
                return y$h.RSAPrivateKey.decode(i, "der");
            case "DSA PRIVATE KEY":
                return {
                    type: "dsa",
                    params: y$h.DSAPrivateKey.decode(i, "der")
                };
            case "EC PRIVATE KEY":
                return {
                    curve: (i = y$h.ECPrivateKey.decode(i, "der")).parameters.value,
                    privateKey: i.privateKey
                };
            default:
                throw new Error("unknown key type " + s);
        }
    }
    function y$i(e, t, r, n) {
        if ((e = new f$q(e.toArray())).length < t.byteLength()) {
            var a = new f$q(t.byteLength() - e.length);
            a.fill(0), e = f$q.concat([a, e]);
        }
        var o = r.length, i = function (e, t) {
            e = (e = b$f(e, t)).mod(t);
            var r = new f$q(e.toArray());
            if (r.length < t.byteLength()) {
                var n = new f$q(t.byteLength() - r.length);
                n.fill(0), r = f$q.concat([n, r]);
            }
            return r;
        }(r, t), s = new f$q(o);
        s.fill(1);
        var h = new f$q(o);
        return h.fill(0), h = c$k(n, h).update(s).update(new f$q([0])).update(e).update(i).digest(), s = c$k(n, h).update(s).digest(), {
            k: h = c$k(n, h).update(s).update(new f$q([1])).update(e).update(i).digest(),
            v: s = c$k(n, h).update(s).digest()
        };
    }
    function b$f(e, t) {
        var r = new l$n(e), n = (e.length << 3) - t.bitLength();
        return n > 0 && r.ishrn(n), r;
    }
    function _$f(e, t, r) {
        var n, a;
        do {
            for (n = new f$q(0); 8 * n.length < e.bitLength();)
                t.v = c$k(r, t.k).update(t.v).digest(), n = f$q.concat([n, t.v]);
            a = b$f(n, e), t.k = c$k(r, t.k).update(t.v).update(new f$q([0])).digest(), t.v = c$k(r, t.k).update(t.v).digest();
        } while (-1 !== a.cmp(e));
        return a;
    }
    function k$e(e, t, r, n) {
        return e.toRed(l$n.mont(r)).redPow(t).fromRed().mod(n);
    }
    function A$a(e, t) {
        if (e.cmpn(0) <= 0)
            throw new Error("invalid sig");
        if (e.cmp(t) >= t)
            throw new Error("invalid sig");
    }
    function D$6(e) {
        S$b.Writable.call(this || W$4);
        var t = C$7[e];
        if (!t)
            throw new Error("Unknown message digest");
        (this || W$4)._hashType = t.hash, (this || W$4)._hash = B$a(t.hash), (this || W$4)._tag = t.id, (this || W$4)._signType = t.sign;
    }
    function F$7(e) {
        S$b.Writable.call(this || W$4);
        var t = C$7[e];
        if (!t)
            throw new Error("Unknown message digest");
        (this || W$4)._hash = B$a(t.hash), (this || W$4)._tag = t.id, (this || W$4)._signType = t.sign;
    }
    function M$8(e) {
        return new D$6(e);
    }
    function O$7(e) {
        return new F$7(e);
    }
    function c$l(e) {
        (this || n$p).curveType = o$q[e], (this || n$p).curveType || ((this || n$p).curveType = {
            name: e
        }), (this || n$p).curve = new s$m.ec((this || n$p).curveType.name), (this || n$p).keys = void 0;
    }
    function y$j(e, t, r) {
        Array.isArray(e) || (e = e.toArray());
        var i = new p$o(e);
        if (r && i.length < r) {
            var n = new p$o(r - i.length);
            n.fill(0), i = p$o.concat([n, i]);
        }
        return t ? i.toString(t) : i;
    }
    function f$s(r) {
        var n = l$o.allocUnsafe(4);
        return n.writeUInt32BE(r, 0), n;
    }
    function i$d() {
        throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11");
    }
    function y$l(r, e) {
        if ("number" != typeof r || r != r)
            throw new TypeError("offset must be a number");
        if (r > p$q || r < 0)
            throw new TypeError("offset must be a uint32");
        if (r > l$p || r > e)
            throw new RangeError("offset out of range");
    }
    function b$h(r, e, n) {
        if ("number" != typeof r || r != r)
            throw new TypeError("size must be a number");
        if (r > p$q || r < 0)
            throw new TypeError("size must be a uint32");
        if (r + e > n || r > l$p)
            throw new RangeError("buffer too small");
    }
    function w$i(r, e, n, o) {
        if (f$t.browser) {
            var t = r.buffer, i = new Uint8Array(t, e, n);
            return m$l.getRandomValues(i), o ? (f$t.nextTick(function () {
                o(null, r);
            }), void 0) : r;
        }
        return o ? (a$o(n, function (n, t) {
            if (n)
                return o(n);
            t.copy(r, e), o(null, r);
        }), void 0) : (a$o(n).copy(r, e), r);
    }
    return {
        setters: [
            function (chunk_dac557ba_js_4_1) {
                chunk_dac557ba_js_4 = chunk_dac557ba_js_4_1;
            },
            function (chunk_0c2d1322_js_3_1) {
                chunk_0c2d1322_js_3 = chunk_0c2d1322_js_3_1;
            },
            function (buffer_js_3_1) {
                buffer_js_3 = buffer_js_3_1;
            },
            function (_7) {
            },
            function (chunk_6e68c801_js_3_1) {
                chunk_6e68c801_js_3 = chunk_6e68c801_js_3_1;
            },
            function (_8) {
            },
            function (_9) {
            },
            function (stream_js_1_1) {
                stream_js_1 = stream_js_1_1;
            },
            function (string_decoder_js_1_1) {
                string_decoder_js_1 = string_decoder_js_1_1;
            },
            function (vm_js_1_1) {
                vm_js_1 = vm_js_1_1;
            }
        ],
        execute: function () {
            o = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, n = chunk_0c2d1322_js_3.h;
            t = chunk_6e68c801_js_3.r.Buffer, f = o.crypto || o.msCrypto;
            a = f && f.getRandomValues ? function (e, r) {
                if (e > 4294967295)
                    throw new RangeError("requested too many random bytes");
                var o = t.allocUnsafe(e);
                if (e > 0)
                    if (e > 65536)
                        for (var a = 0; a < e; a += 65536)
                            f.getRandomValues(o.slice(a, a + 65536));
                    else
                        f.getRandomValues(o);
                if ("function" == typeof r)
                    return n.nextTick(function () {
                        r(null, o);
                    });
                return o;
            } : function () {
                throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
            };
            e = chunk_6e68c801_js_3.r.Buffer, o$1 = stream_js_1.default.Transform;
            chunk_dac557ba_js_4.t(s, o$1), s.prototype._transform = function (t, i, r) {
                var e = null;
                try {
                    this.update(t, i);
                }
                catch (t) {
                    e = t;
                }
                r(e);
            }, s.prototype._flush = function (t) {
                var i = null;
                try {
                    this.push(this.digest());
                }
                catch (t) {
                    i = t;
                }
                t(i);
            }, s.prototype.update = function (t, i) {
                if (!function (t, i) {
                    if (!e.isBuffer(t) && "string" != typeof t)
                        throw new TypeError(i + " must be a string or a buffer");
                }(t, "Data"), this._finalized)
                    throw new Error("Digest already called");
                e.isBuffer(t) || (t = e.from(t, i));
                for (var r = this._block, o = 0; this._blockOffset + t.length - o >= this._blockSize;) {
                    for (var s = this._blockOffset; s < this._blockSize;)
                        r[s++] = t[o++];
                    this._update(), this._blockOffset = 0;
                }
                for (; o < t.length;)
                    r[this._blockOffset++] = t[o++];
                for (var f = 0, n = 8 * t.length; n > 0; ++f)
                    this._length[f] += n, (n = this._length[f] / 4294967296 | 0) > 0 && (this._length[f] -= 4294967296 * n);
                return this;
            }, s.prototype._update = function () {
                throw new Error("_update is not implemented");
            }, s.prototype.digest = function (t) {
                if (this._finalized)
                    throw new Error("Digest already called");
                this._finalized = !0;
                var i = this._digest();
                void 0 !== t && (i = i.toString(t)), this._block.fill(0), this._blockOffset = 0;
                for (var r = 0; r < 4; ++r)
                    this._length[r] = 0;
                return i;
            }, s.prototype._digest = function () {
                throw new Error("_digest is not implemented");
            };
            f$1 = s;
            h = chunk_dac557ba_js_4.t, r = f$1, _ = chunk_6e68c801_js_3.r.Buffer, e$1 = new Array(16);
            h(n$1, r), n$1.prototype._update = function () {
                for (var t = e$1, i = 0; i < 16; ++i)
                    t[i] = this._block.readInt32LE(4 * i);
                var s = this._a, h = this._b, r = this._c, _ = this._d;
                s = f$2(s, h, r, _, t[0], 3614090360, 7), _ = f$2(_, s, h, r, t[1], 3905402710, 12), r = f$2(r, _, s, h, t[2], 606105819, 17), h = f$2(h, r, _, s, t[3], 3250441966, 22), s = f$2(s, h, r, _, t[4], 4118548399, 7), _ = f$2(_, s, h, r, t[5], 1200080426, 12), r = f$2(r, _, s, h, t[6], 2821735955, 17), h = f$2(h, r, _, s, t[7], 4249261313, 22), s = f$2(s, h, r, _, t[8], 1770035416, 7), _ = f$2(_, s, h, r, t[9], 2336552879, 12), r = f$2(r, _, s, h, t[10], 4294925233, 17), h = f$2(h, r, _, s, t[11], 2304563134, 22), s = f$2(s, h, r, _, t[12], 1804603682, 7), _ = f$2(_, s, h, r, t[13], 4254626195, 12), r = f$2(r, _, s, h, t[14], 2792965006, 17), s = c(s, h = f$2(h, r, _, s, t[15], 1236535329, 22), r, _, t[1], 4129170786, 5), _ = c(_, s, h, r, t[6], 3225465664, 9), r = c(r, _, s, h, t[11], 643717713, 14), h = c(h, r, _, s, t[0], 3921069994, 20), s = c(s, h, r, _, t[5], 3593408605, 5), _ = c(_, s, h, r, t[10], 38016083, 9), r = c(r, _, s, h, t[15], 3634488961, 14), h = c(h, r, _, s, t[4], 3889429448, 20), s = c(s, h, r, _, t[9], 568446438, 5), _ = c(_, s, h, r, t[14], 3275163606, 9), r = c(r, _, s, h, t[3], 4107603335, 14), h = c(h, r, _, s, t[8], 1163531501, 20), s = c(s, h, r, _, t[13], 2850285829, 5), _ = c(_, s, h, r, t[2], 4243563512, 9), r = c(r, _, s, h, t[7], 1735328473, 14), s = a$1(s, h = c(h, r, _, s, t[12], 2368359562, 20), r, _, t[5], 4294588738, 4), _ = a$1(_, s, h, r, t[8], 2272392833, 11), r = a$1(r, _, s, h, t[11], 1839030562, 16), h = a$1(h, r, _, s, t[14], 4259657740, 23), s = a$1(s, h, r, _, t[1], 2763975236, 4), _ = a$1(_, s, h, r, t[4], 1272893353, 11), r = a$1(r, _, s, h, t[7], 4139469664, 16), h = a$1(h, r, _, s, t[10], 3200236656, 23), s = a$1(s, h, r, _, t[13], 681279174, 4), _ = a$1(_, s, h, r, t[0], 3936430074, 11), r = a$1(r, _, s, h, t[3], 3572445317, 16), h = a$1(h, r, _, s, t[6], 76029189, 23), s = a$1(s, h, r, _, t[9], 3654602809, 4), _ = a$1(_, s, h, r, t[12], 3873151461, 11), r = a$1(r, _, s, h, t[15], 530742520, 16), s = l(s, h = a$1(h, r, _, s, t[2], 3299628645, 23), r, _, t[0], 4096336452, 6), _ = l(_, s, h, r, t[7], 1126891415, 10), r = l(r, _, s, h, t[14], 2878612391, 15), h = l(h, r, _, s, t[5], 4237533241, 21), s = l(s, h, r, _, t[12], 1700485571, 6), _ = l(_, s, h, r, t[3], 2399980690, 10), r = l(r, _, s, h, t[10], 4293915773, 15), h = l(h, r, _, s, t[1], 2240044497, 21), s = l(s, h, r, _, t[8], 1873313359, 6), _ = l(_, s, h, r, t[15], 4264355552, 10), r = l(r, _, s, h, t[6], 2734768916, 15), h = l(h, r, _, s, t[13], 1309151649, 21), s = l(s, h, r, _, t[4], 4149444226, 6), _ = l(_, s, h, r, t[11], 3174756917, 10), r = l(r, _, s, h, t[2], 718787259, 15), h = l(h, r, _, s, t[9], 3951481745, 21), this._a = this._a + s | 0, this._b = this._b + h | 0, this._c = this._c + r | 0, this._d = this._d + _ | 0;
            }, n$1.prototype._digest = function () {
                this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
                var t = _.allocUnsafe(16);
                return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t;
            };
            u = n$1;
            h$1 = buffer_js_3.default.Buffer, _$1 = chunk_dac557ba_js_4.t, r$1 = f$1, e$2 = new Array(16), n$2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13], o$3 = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11], f$3 = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6], c$1 = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11], a$2 = [0, 1518500249, 1859775393, 2400959708, 2840853838], l$1 = [1352829926, 1548603684, 1836072691, 2053994217, 0];
            _$1(u$1, r$1), u$1.prototype._update = function () {
                for (var t = e$2, i = 0; i < 16; ++i)
                    t[i] = this._block.readInt32LE(4 * i);
                for (var s = 0 | this._a, h = 0 | this._b, _ = 0 | this._c, r = 0 | this._d, u = 0 | this._e, I = 0 | this._a, L = 0 | this._b, v = 0 | this._c, m = 0 | this._d, O = 0 | this._e, g = 0; g < 80; g += 1) {
                    var y, U;
                    g < 16 ? (y = d(s, h, _, r, u, t[n$2[g]], a$2[0], f$3[g]), U = E(I, L, v, m, O, t[o$3[g]], l$1[0], c$1[g])) : g < 32 ? (y = k(s, h, _, r, u, t[n$2[g]], a$2[1], f$3[g]), U = w(I, L, v, m, O, t[o$3[g]], l$1[1], c$1[g])) : g < 48 ? (y = p(s, h, _, r, u, t[n$2[g]], a$2[2], f$3[g]), U = p(I, L, v, m, O, t[o$3[g]], l$1[2], c$1[g])) : g < 64 ? (y = w(s, h, _, r, u, t[n$2[g]], a$2[3], f$3[g]), U = k(I, L, v, m, O, t[o$3[g]], l$1[3], c$1[g])) : (y = E(s, h, _, r, u, t[n$2[g]], a$2[4], f$3[g]), U = d(I, L, v, m, O, t[o$3[g]], l$1[4], c$1[g])), s = u, u = r, r = b(_, 10), _ = h, h = y, I = O, O = m, m = b(v, 10), v = L, L = U;
                }
                var x = this._b + _ + m | 0;
                this._b = this._c + r + O | 0, this._c = this._d + u + I | 0, this._d = this._e + s + L | 0, this._e = this._a + h + v | 0, this._a = x;
            }, u$1.prototype._digest = function () {
                this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
                var t = h$1.alloc ? h$1.alloc(20) : new h$1(20);
                return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t.writeInt32LE(this._e, 16), t;
            };
            I = u$1;
            s$1 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, h$2 = chunk_6e68c801_js_3.r.Buffer;
            e$3.prototype.update = function (t, i) {
                "string" == typeof t && (i = i || "utf8", t = h$2.from(t, i));
                for (var e = (this || s$1)._block, _ = (this || s$1)._blockSize, n = t.length, r = (this || s$1)._len, o = 0; o < n;) {
                    for (var f = r % _, l = Math.min(n - o, _ - f), a = 0; a < l; a++)
                        e[f + a] = t[o + a];
                    o += l, (r += l) % _ == 0 && this._update(e);
                }
                return (this || s$1)._len += n, this || s$1;
            }, e$3.prototype.digest = function (t) {
                var i = (this || s$1)._len % (this || s$1)._blockSize;
                (this || s$1)._block[i] = 128, (this || s$1)._block.fill(0, i + 1), i >= (this || s$1)._finalSize && (this._update((this || s$1)._block), (this || s$1)._block.fill(0));
                var h = 8 * (this || s$1)._len;
                if (h <= 4294967295)
                    (this || s$1)._block.writeUInt32BE(h, (this || s$1)._blockSize - 4);
                else {
                    var e = (4294967295 & h) >>> 0, _ = (h - e) / 4294967296;
                    (this || s$1)._block.writeUInt32BE(_, (this || s$1)._blockSize - 8), (this || s$1)._block.writeUInt32BE(e, (this || s$1)._blockSize - 4);
                }
                this._update((this || s$1)._block);
                var n = this._hash();
                return t ? n.toString(t) : n;
            }, e$3.prototype._update = function () {
                throw new Error("_update must be implemented by subclass");
            };
            _$2 = e$3, n$3 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, r$2 = chunk_dac557ba_js_4.t, o$4 = _$2, f$4 = chunk_6e68c801_js_3.r.Buffer, l$2 = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], a$3 = new Array(64);
            r$2(u$2, o$4), u$2.prototype.init = function () {
                return (this || n$3)._a = 1779033703, (this || n$3)._b = 3144134277, (this || n$3)._c = 1013904242, (this || n$3)._d = 2773480762, (this || n$3)._e = 1359893119, (this || n$3)._f = 2600822924, (this || n$3)._g = 528734635, (this || n$3)._h = 1541459225, this || n$3;
            }, u$2.prototype._update = function (t) {
                for (var i, s = (this || n$3)._w, h = 0 | (this || n$3)._a, e = 0 | (this || n$3)._b, _ = 0 | (this || n$3)._c, r = 0 | (this || n$3)._d, o = 0 | (this || n$3)._e, f = 0 | (this || n$3)._f, a = 0 | (this || n$3)._g, u = 0 | (this || n$3)._h, w = 0; w < 16; ++w)
                    s[w] = t.readInt32BE(4 * w);
                for (; w < 64; ++w)
                    s[w] = 0 | (((i = s[w - 2]) >>> 17 | i << 15) ^ (i >>> 19 | i << 13) ^ i >>> 10) + s[w - 7] + k$1(s[w - 15]) + s[w - 16];
                for (var g = 0; g < 64; ++g) {
                    var B = u + d$1(o) + c$2(o, f, a) + l$2[g] + s[g] | 0, v = p$1(h) + b$1(h, e, _) | 0;
                    u = a, a = f, f = o, o = r + B | 0, r = _, _ = e, e = h, h = B + v | 0;
                }
                (this || n$3)._a = h + (this || n$3)._a | 0, (this || n$3)._b = e + (this || n$3)._b | 0, (this || n$3)._c = _ + (this || n$3)._c | 0, (this || n$3)._d = r + (this || n$3)._d | 0, (this || n$3)._e = o + (this || n$3)._e | 0, (this || n$3)._f = f + (this || n$3)._f | 0, (this || n$3)._g = a + (this || n$3)._g | 0, (this || n$3)._h = u + (this || n$3)._h | 0;
            }, u$2.prototype._hash = function () {
                var t = f$4.allocUnsafe(32);
                return t.writeInt32BE((this || n$3)._a, 0), t.writeInt32BE((this || n$3)._b, 4), t.writeInt32BE((this || n$3)._c, 8), t.writeInt32BE((this || n$3)._d, 12), t.writeInt32BE((this || n$3)._e, 16), t.writeInt32BE((this || n$3)._f, 20), t.writeInt32BE((this || n$3)._g, 24), t.writeInt32BE((this || n$3)._h, 28), t;
            };
            w$1 = u$2;
            _$3 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, e$4 = chunk_dac557ba_js_4.t, n$4 = _$2, r$3 = chunk_6e68c801_js_3.r.Buffer, l$3 = [1518500249, 1859775393, -1894007588, -899497514], o$5 = new Array(80);
            e$4(f$5, n$4), f$5.prototype.init = function () {
                return (this || _$3)._a = 1732584193, (this || _$3)._b = 4023233417, (this || _$3)._c = 2562383102, (this || _$3)._d = 271733878, (this || _$3)._e = 3285377520, this || _$3;
            }, f$5.prototype._update = function (t) {
                for (var i, h = (this || _$3)._w, s = 0 | (this || _$3)._a, e = 0 | (this || _$3)._b, n = 0 | (this || _$3)._c, r = 0 | (this || _$3)._d, o = 0 | (this || _$3)._e, f = 0; f < 16; ++f)
                    h[f] = t.readInt32BE(4 * f);
                for (; f < 80; ++f)
                    h[f] = h[f - 3] ^ h[f - 8] ^ h[f - 14] ^ h[f - 16];
                for (var c = 0; c < 80; ++c) {
                    var d = ~~(c / 20), p = 0 | ((i = s) << 5 | i >>> 27) + u$3(d, e, n, r) + o + h[c] + l$3[d];
                    o = r, r = n, n = a$4(e), e = s, s = p;
                }
                (this || _$3)._a = s + (this || _$3)._a | 0, (this || _$3)._b = e + (this || _$3)._b | 0, (this || _$3)._c = n + (this || _$3)._c | 0, (this || _$3)._d = r + (this || _$3)._d | 0, (this || _$3)._e = o + (this || _$3)._e | 0;
            }, f$5.prototype._hash = function () {
                var t = r$3.allocUnsafe(20);
                return t.writeInt32BE(0 | (this || _$3)._a, 0), t.writeInt32BE(0 | (this || _$3)._b, 4), t.writeInt32BE(0 | (this || _$3)._c, 8), t.writeInt32BE(0 | (this || _$3)._d, 12), t.writeInt32BE(0 | (this || _$3)._e, 16), t;
            };
            c$3 = f$5, d$2 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, p$2 = chunk_dac557ba_js_4.t, b$2 = _$2, w$2 = chunk_6e68c801_js_3.r.Buffer, g = [1518500249, 1859775393, -1894007588, -899497514], B = new Array(80);
            p$2(y, b$2), y.prototype.init = function () {
                return (this || d$2)._a = 1732584193, (this || d$2)._b = 4023233417, (this || d$2)._c = 2562383102, (this || d$2)._d = 271733878, (this || d$2)._e = 3285377520, this || d$2;
            }, y.prototype._update = function (t) {
                for (var i, h = (this || d$2)._w, s = 0 | (this || d$2)._a, _ = 0 | (this || d$2)._b, e = 0 | (this || d$2)._c, n = 0 | (this || d$2)._d, r = 0 | (this || d$2)._e, l = 0; l < 16; ++l)
                    h[l] = t.readInt32BE(4 * l);
                for (; l < 80; ++l)
                    h[l] = (i = h[l - 3] ^ h[l - 8] ^ h[l - 14] ^ h[l - 16]) << 1 | i >>> 31;
                for (var o = 0; o < 80; ++o) {
                    var f = ~~(o / 20), a = E$1(s) + v(f, _, e, n) + r + h[o] + g[f] | 0;
                    r = n, n = e, e = I$1(_), _ = s, s = a;
                }
                (this || d$2)._a = s + (this || d$2)._a | 0, (this || d$2)._b = _ + (this || d$2)._b | 0, (this || d$2)._c = e + (this || d$2)._c | 0, (this || d$2)._d = n + (this || d$2)._d | 0, (this || d$2)._e = r + (this || d$2)._e | 0;
            }, y.prototype._hash = function () {
                var t = w$2.allocUnsafe(20);
                return t.writeInt32BE(0 | (this || d$2)._a, 0), t.writeInt32BE(0 | (this || d$2)._b, 4), t.writeInt32BE(0 | (this || d$2)._c, 8), t.writeInt32BE(0 | (this || d$2)._d, 12), t.writeInt32BE(0 | (this || d$2)._e, 16), t;
            };
            T = y, m = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, A = chunk_dac557ba_js_4.t, U = w$1, x = _$2, j = chunk_6e68c801_js_3.r.Buffer, q = new Array(64);
            A(C, U), C.prototype.init = function () {
                return (this || m)._a = 3238371032, (this || m)._b = 914150663, (this || m)._c = 812702999, (this || m)._d = 4144912697, (this || m)._e = 4290775857, (this || m)._f = 1750603025, (this || m)._g = 1694076839, (this || m)._h = 3204075428, this || m;
            }, C.prototype._hash = function () {
                var t = j.allocUnsafe(28);
                return t.writeInt32BE((this || m)._a, 0), t.writeInt32BE((this || m)._b, 4), t.writeInt32BE((this || m)._c, 8), t.writeInt32BE((this || m)._d, 12), t.writeInt32BE((this || m)._e, 16), t.writeInt32BE((this || m)._f, 20), t.writeInt32BE((this || m)._g, 24), t;
            };
            L = C, k$2 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, z = chunk_dac557ba_js_4.t, D = _$2, F = chunk_6e68c801_js_3.r.Buffer, G = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591], H = new Array(160);
            z(J, D), J.prototype.init = function () {
                return (this || k$2)._ah = 1779033703, (this || k$2)._bh = 3144134277, (this || k$2)._ch = 1013904242, (this || k$2)._dh = 2773480762, (this || k$2)._eh = 1359893119, (this || k$2)._fh = 2600822924, (this || k$2)._gh = 528734635, (this || k$2)._hh = 1541459225, (this || k$2)._al = 4089235720, (this || k$2)._bl = 2227873595, (this || k$2)._cl = 4271175723, (this || k$2)._dl = 1595750129, (this || k$2)._el = 2917565137, (this || k$2)._fl = 725511199, (this || k$2)._gl = 4215389547, (this || k$2)._hl = 327033209, this || k$2;
            }, J.prototype._update = function (t) {
                for (var i = (this || k$2)._w, h = 0 | (this || k$2)._ah, s = 0 | (this || k$2)._bh, _ = 0 | (this || k$2)._ch, e = 0 | (this || k$2)._dh, n = 0 | (this || k$2)._eh, r = 0 | (this || k$2)._fh, l = 0 | (this || k$2)._gh, o = 0 | (this || k$2)._hh, f = 0 | (this || k$2)._al, a = 0 | (this || k$2)._bl, u = 0 | (this || k$2)._cl, c = 0 | (this || k$2)._dl, d = 0 | (this || k$2)._el, p = 0 | (this || k$2)._fl, b = 0 | (this || k$2)._gl, w = 0 | (this || k$2)._hl, g = 0; g < 32; g += 2)
                    i[g] = t.readInt32BE(4 * g), i[g + 1] = t.readInt32BE(4 * g + 4);
                for (; g < 160; g += 2) {
                    var B = i[g - 30], y = i[g - 30 + 1], E = P(B, y), I = Q(y, B), v = R(B = i[g - 4], y = i[g - 4 + 1]), T = S(y, B), m = i[g - 14], A = i[g - 14 + 1], U = i[g - 32], x = i[g - 32 + 1], j = I + A | 0, q = E + m + V(j, I) | 0;
                    q = (q = q + v + V(j = j + T | 0, T) | 0) + U + V(j = j + x | 0, x) | 0, i[g] = q, i[g + 1] = j;
                }
                for (var C = 0; C < 160; C += 2) {
                    q = i[C], j = i[C + 1];
                    var L = M(h, s, _), z = M(f, a, u), D = N(h, f), F = N(f, h), H = O(n, d), J = O(d, n), W = G[C], X = G[C + 1], Y = K(n, r, l), Z = K(d, p, b), $ = w + J | 0, tt = o + H + V($, w) | 0;
                    tt = (tt = (tt = tt + Y + V($ = $ + Z | 0, Z) | 0) + W + V($ = $ + X | 0, X) | 0) + q + V($ = $ + j | 0, j) | 0;
                    var it = F + z | 0, ht = D + L + V(it, F) | 0;
                    o = l, w = b, l = r, b = p, r = n, p = d, n = e + tt + V(d = c + $ | 0, c) | 0, e = _, c = u, _ = s, u = a, s = h, a = f, h = tt + ht + V(f = $ + it | 0, $) | 0;
                }
                (this || k$2)._al = (this || k$2)._al + f | 0, (this || k$2)._bl = (this || k$2)._bl + a | 0, (this || k$2)._cl = (this || k$2)._cl + u | 0, (this || k$2)._dl = (this || k$2)._dl + c | 0, (this || k$2)._el = (this || k$2)._el + d | 0, (this || k$2)._fl = (this || k$2)._fl + p | 0, (this || k$2)._gl = (this || k$2)._gl + b | 0, (this || k$2)._hl = (this || k$2)._hl + w | 0, (this || k$2)._ah = (this || k$2)._ah + h + V((this || k$2)._al, f) | 0, (this || k$2)._bh = (this || k$2)._bh + s + V((this || k$2)._bl, a) | 0, (this || k$2)._ch = (this || k$2)._ch + _ + V((this || k$2)._cl, u) | 0, (this || k$2)._dh = (this || k$2)._dh + e + V((this || k$2)._dl, c) | 0, (this || k$2)._eh = (this || k$2)._eh + n + V((this || k$2)._el, d) | 0, (this || k$2)._fh = (this || k$2)._fh + r + V((this || k$2)._fl, p) | 0, (this || k$2)._gh = (this || k$2)._gh + l + V((this || k$2)._gl, b) | 0, (this || k$2)._hh = (this || k$2)._hh + o + V((this || k$2)._hl, w) | 0;
            }, J.prototype._hash = function () {
                var t = F.allocUnsafe(64);
                function i(i, h, s) {
                    t.writeInt32BE(i, s), t.writeInt32BE(h, s + 4);
                }
                return i((this || k$2)._ah, (this || k$2)._al, 0), i((this || k$2)._bh, (this || k$2)._bl, 8), i((this || k$2)._ch, (this || k$2)._cl, 16), i((this || k$2)._dh, (this || k$2)._dl, 24), i((this || k$2)._eh, (this || k$2)._el, 32), i((this || k$2)._fh, (this || k$2)._fl, 40), i((this || k$2)._gh, (this || k$2)._gl, 48), i((this || k$2)._hh, (this || k$2)._hl, 56), t;
            };
            W = J, X = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, Y = chunk_dac557ba_js_4.t, Z = W, $ = _$2, tt = chunk_6e68c801_js_3.r.Buffer, it = new Array(160);
            Y(ht, Z), ht.prototype.init = function () {
                return (this || X)._ah = 3418070365, (this || X)._bh = 1654270250, (this || X)._ch = 2438529370, (this || X)._dh = 355462360, (this || X)._eh = 1731405415, (this || X)._fh = 2394180231, (this || X)._gh = 3675008525, (this || X)._hh = 1203062813, (this || X)._al = 3238371032, (this || X)._bl = 914150663, (this || X)._cl = 812702999, (this || X)._dl = 4144912697, (this || X)._el = 4290775857, (this || X)._fl = 1750603025, (this || X)._gl = 1694076839, (this || X)._hl = 3204075428, this || X;
            }, ht.prototype._hash = function () {
                var t = tt.allocUnsafe(48);
                function i(i, h, s) {
                    t.writeInt32BE(i, s), t.writeInt32BE(h, s + 4);
                }
                return i((this || X)._ah, (this || X)._al, 0), i((this || X)._bh, (this || X)._bl, 8), i((this || X)._ch, (this || X)._cl, 16), i((this || X)._dh, (this || X)._dl, 24), i((this || X)._eh, (this || X)._el, 32), i((this || X)._fh, (this || X)._fl, 40), t;
            };
            _t = ht, et = {
                exports: st = {}
            };
            (st = et.exports = function (t) {
                t = t.toLowerCase();
                var i = st[t];
                if (!i)
                    throw new Error(t + " is not supported (we accept pull requests)");
                return new i();
            }).sha = c$3, st.sha1 = T, st.sha224 = L, st.sha256 = w$1, st.sha384 = _t, st.sha512 = W;
            nt = et.exports;
            e$5 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, n$5 = chunk_6e68c801_js_3.r.Buffer, s$2 = stream_js_1.default.Transform, h$3 = string_decoder_js_1.default.StringDecoder;
            chunk_dac557ba_js_4.t(a$5, s$2), a$5.prototype.update = function (t, i, r) {
                "string" == typeof t && (t = n$5.from(t, i));
                var o = this._update(t);
                return (this || e$5).hashMode ? this || e$5 : (r && (o = this._toString(o, r)), o);
            }, a$5.prototype.setAutoPadding = function () { }, a$5.prototype.getAuthTag = function () {
                throw new Error("trying to get auth tag in unsupported state");
            }, a$5.prototype.setAuthTag = function () {
                throw new Error("trying to set auth tag in unsupported state");
            }, a$5.prototype.setAAD = function () {
                throw new Error("trying to set aad in unsupported state");
            }, a$5.prototype._transform = function (t, i, r) {
                var o;
                try {
                    (this || e$5).hashMode ? this._update(t) : this.push(this._update(t));
                }
                catch (t) {
                    o = t;
                }
                finally {
                    r(o);
                }
            }, a$5.prototype._flush = function (t) {
                var i;
                try {
                    this.push(this.__final());
                }
                catch (t) {
                    i = t;
                }
                t(i);
            }, a$5.prototype._finalOrDigest = function (t) {
                var i = this.__final() || n$5.alloc(0);
                return t && (i = this._toString(i, t, !0)), i;
            }, a$5.prototype._toString = function (t, i, r) {
                if ((this || e$5)._decoder || ((this || e$5)._decoder = new h$3(i), (this || e$5)._encoding = i), (this || e$5)._encoding !== i)
                    throw new Error("can't switch encodings");
                var o = (this || e$5)._decoder.write(t);
                return r && (o += (this || e$5)._decoder.end()), o;
            };
            f$6 = a$5;
            m$1 = u, n$6 = I, p$3 = nt, s$3 = f$6;
            chunk_dac557ba_js_4.t(a$6, s$3), a$6.prototype._update = function (t) {
                this._hash.update(t);
            }, a$6.prototype._final = function () {
                return this._hash.digest();
            };
            h$4 = function (t) {
                return "md5" === (t = t.toLowerCase()) ? new m$1() : "rmd160" === t || "ripemd160" === t ? new n$6() : new a$6(p$3(t));
            };
            e$6 = u, r$4 = function (t) {
                return new e$6().update(t).digest();
            };
            o$6 = chunk_dac557ba_js_4.t, h$5 = chunk_6e68c801_js_3.r.Buffer, n$7 = f$6, p$4 = h$5.alloc(128);
            o$6(f$7, n$7), f$7.prototype._update = function (t) {
                this._hash.push(t);
            }, f$7.prototype._final = function () {
                var t = this._alg(h$5.concat(this._hash));
                return this._alg(h$5.concat([this._opad, t]));
            };
            l$4 = chunk_dac557ba_js_4.t, d$3 = f$7, c$4 = f$6, _$4 = chunk_6e68c801_js_3.r.Buffer, m$2 = r$4, u$4 = I, g$1 = nt, v$1 = _$4.alloc(128);
            l$4(y$1, c$4), y$1.prototype._update = function (t) {
                this._hash.update(t);
            }, y$1.prototype._final = function () {
                var t = this._hash.digest();
                return ("rmd160" === this._alg ? new u$4() : g$1(this._alg)).update(this._opad).update(t).digest();
            };
            w$3 = function (t, a) {
                return "rmd160" === (t = t.toLowerCase()) || "ripemd160" === t ? new y$1("rmd160", a) : "md5" === t ? new d$3(m$2, a) : new y$1(t, a);
            };
            s$4 = {
                sha224WithRSAEncryption: {
                    sign: "rsa",
                    hash: "sha224",
                    id: "302d300d06096086480165030402040500041c"
                },
                "RSA-SHA224": {
                    sign: "ecdsa/rsa",
                    hash: "sha224",
                    id: "302d300d06096086480165030402040500041c"
                },
                sha256WithRSAEncryption: {
                    sign: "rsa",
                    hash: "sha256",
                    id: "3031300d060960864801650304020105000420"
                },
                "RSA-SHA256": {
                    sign: "ecdsa/rsa",
                    hash: "sha256",
                    id: "3031300d060960864801650304020105000420"
                },
                sha384WithRSAEncryption: {
                    sign: "rsa",
                    hash: "sha384",
                    id: "3041300d060960864801650304020205000430"
                },
                "RSA-SHA384": {
                    sign: "ecdsa/rsa",
                    hash: "sha384",
                    id: "3041300d060960864801650304020205000430"
                },
                sha512WithRSAEncryption: {
                    sign: "rsa",
                    hash: "sha512",
                    id: "3051300d060960864801650304020305000440"
                },
                "RSA-SHA512": {
                    sign: "ecdsa/rsa",
                    hash: "sha512",
                    id: "3051300d060960864801650304020305000440"
                },
                "RSA-SHA1": {
                    sign: "rsa",
                    hash: "sha1",
                    id: "3021300906052b0e03021a05000414"
                },
                "ecdsa-with-SHA1": {
                    sign: "ecdsa",
                    hash: "sha1",
                    id: ""
                },
                sha256: {
                    sign: "ecdsa",
                    hash: "sha256",
                    id: ""
                },
                sha224: {
                    sign: "ecdsa",
                    hash: "sha224",
                    id: ""
                },
                sha384: {
                    sign: "ecdsa",
                    hash: "sha384",
                    id: ""
                },
                sha512: {
                    sign: "ecdsa",
                    hash: "sha512",
                    id: ""
                },
                "DSA-SHA": {
                    sign: "dsa",
                    hash: "sha1",
                    id: ""
                },
                "DSA-SHA1": {
                    sign: "dsa",
                    hash: "sha1",
                    id: ""
                },
                DSA: {
                    sign: "dsa",
                    hash: "sha1",
                    id: ""
                },
                "DSA-WITH-SHA224": {
                    sign: "dsa",
                    hash: "sha224",
                    id: ""
                },
                "DSA-SHA224": {
                    sign: "dsa",
                    hash: "sha224",
                    id: ""
                },
                "DSA-WITH-SHA256": {
                    sign: "dsa",
                    hash: "sha256",
                    id: ""
                },
                "DSA-SHA256": {
                    sign: "dsa",
                    hash: "sha256",
                    id: ""
                },
                "DSA-WITH-SHA384": {
                    sign: "dsa",
                    hash: "sha384",
                    id: ""
                },
                "DSA-SHA384": {
                    sign: "dsa",
                    hash: "sha384",
                    id: ""
                },
                "DSA-WITH-SHA512": {
                    sign: "dsa",
                    hash: "sha512",
                    id: ""
                },
                "DSA-SHA512": {
                    sign: "dsa",
                    hash: "sha512",
                    id: ""
                },
                "DSA-RIPEMD160": {
                    sign: "dsa",
                    hash: "rmd160",
                    id: ""
                },
                ripemd160WithRSA: {
                    sign: "rsa",
                    hash: "rmd160",
                    id: "3021300906052b2403020105000414"
                },
                "RSA-RIPEMD160": {
                    sign: "rsa",
                    hash: "rmd160",
                    id: "3021300906052b2403020105000414"
                },
                md5WithRSAEncryption: {
                    sign: "rsa",
                    hash: "md5",
                    id: "3020300c06082a864886f70d020505000410"
                },
                "RSA-MD5": {
                    sign: "rsa",
                    hash: "md5",
                    id: "3020300c06082a864886f70d020505000410"
                }
            };
            f$8 = buffer_js_3.default.Buffer, a$7 = Math.pow(2, 30) - 1;
            h$6 = function (r, e, t, n) {
                if (s$5(r, "Password"), s$5(e, "Salt"), "number" != typeof t)
                    throw new TypeError("Iterations not a number");
                if (t < 0)
                    throw new TypeError("Bad iterations");
                if ("number" != typeof n)
                    throw new TypeError("Key length not a number");
                if (n < 0 || n > a$7 || n != n)
                    throw new TypeError("Bad key length");
            }, c$5 = chunk_0c2d1322_js_3.h;
            c$5.browser ? u$5 = "utf-8" : u$5 = parseInt(c$5.version.split(".")[0].slice(1), 10) >= 6 ? "utf-8" : "binary";
            l$5 = u$5, p$5 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, d$4 = r$4, m$3 = I, y$2 = nt, b$3 = h$6, v$2 = l$5, w$4 = chunk_6e68c801_js_3.r.Buffer, g$2 = w$4.alloc(128), B$1 = {
                md5: 16,
                sha1: 20,
                sha224: 28,
                sha256: 32,
                sha384: 48,
                sha512: 64,
                rmd160: 20,
                ripemd160: 20
            };
            T$1.prototype.run = function (r, e) {
                return r.copy(e, (this || p$5).blocksize), this.hash(e).copy((this || p$5).opad, (this || p$5).blocksize), this.hash((this || p$5).opad);
            };
            S$1 = function (r, e, t, n, o) {
                b$3(r, e, t, n), w$4.isBuffer(r) || (r = w$4.from(r, v$2)), w$4.isBuffer(e) || (e = w$4.from(e, v$2));
                var i = new T$1(o = o || "sha1", r, e.length), f = w$4.allocUnsafe(n), a = w$4.allocUnsafe(e.length + 4);
                e.copy(a, 0, 0, e.length);
                for (var s = 0, u = B$1[o], h = Math.ceil(n / u), c = 1; c <= h; c++) {
                    a.writeUInt32BE(c, e.length);
                    for (var l = i.run(a, i.ipad1), p = l, d = 1; d < t; d++) {
                        p = i.run(p, i.ipad2);
                        for (var m = 0; m < u; m++)
                            l[m] ^= p[m];
                    }
                    l.copy(f, s), s += u;
                }
                return f;
            }, A$1 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, H$1 = chunk_0c2d1322_js_3.h, E$2 = h$6, P$1 = l$5, U$1 = S$1, K$1 = chunk_6e68c801_js_3.r.Buffer, x$1 = A$1.crypto && A$1.crypto.subtle, z$1 = {
                sha: "SHA-1",
                "sha-1": "SHA-1",
                sha1: "SHA-1",
                sha256: "SHA-256",
                "sha-256": "SHA-256",
                sha384: "SHA-384",
                "sha-384": "SHA-384",
                "sha-512": "SHA-512",
                sha512: "SHA-512"
            }, I$2 = [];
            F$1 = function (r, e, t, n, o, i) {
                "function" == typeof o && (i = o, o = void 0);
                var f = z$1[(o = o || "sha1").toLowerCase()];
                if (!f || "function" != typeof A$1.Promise)
                    return H$1.nextTick(function () {
                        var f;
                        try {
                            f = U$1(r, e, t, n, o);
                        }
                        catch (r) {
                            return i(r);
                        }
                        i(null, f);
                    });
                if (E$2(r, e, t, n), "function" != typeof i)
                    throw new Error("No callback provided to pbkdf2");
                K$1.isBuffer(r) || (r = K$1.from(r, P$1)), K$1.isBuffer(e) || (e = K$1.from(e, P$1)), function (r, e) {
                    r.then(function (r) {
                        H$1.nextTick(function () {
                            e(null, r);
                        });
                    }, function (r) {
                        H$1.nextTick(function () {
                            e(r);
                        });
                    });
                }(function (r) {
                    if (A$1.process && !A$1.process.browser)
                        return Promise.resolve(!1);
                    if (!x$1 || !x$1.importKey || !x$1.deriveBits)
                        return Promise.resolve(!1);
                    if (void 0 !== I$2[r])
                        return I$2[r];
                    var e = D$1(k$3 = k$3 || K$1.alloc(8), k$3, 10, 128, r).then(function () {
                        return !0;
                    }).catch(function () {
                        return !1;
                    });
                    return I$2[r] = e, e;
                }(f).then(function (i) {
                    return i ? D$1(r, e, t, n, f) : U$1(r, e, t, n, o);
                }), i);
            }, M$1 = {};
            M$1.pbkdf2 = F$1, M$1.pbkdf2Sync = S$1;
            r$5 = e$7, e$7.equal = function (r, e, o) {
                if (r != e)
                    throw new Error(o || "Assertion failed: " + r + " != " + e);
            };
            o$7 = r$5;
            r$6 = {
                readUInt32BE: function (t, e) {
                    return (t[0 + e] << 24 | t[1 + e] << 16 | t[2 + e] << 8 | t[3 + e]) >>> 0;
                },
                writeUInt32BE: function (t, e, r) {
                    t[0 + r] = e >>> 24, t[1 + r] = e >>> 16 & 255, t[2 + r] = e >>> 8 & 255, t[3 + r] = 255 & e;
                },
                ip: function (t, e, r, i) {
                    for (var n = 0, f = 0, o = 6; o >= 0; o -= 2) {
                        for (var p = 0; p <= 24; p += 8)
                            n <<= 1, n |= e >>> p + o & 1;
                        for (p = 0; p <= 24; p += 8)
                            n <<= 1, n |= t >>> p + o & 1;
                    }
                    for (o = 6; o >= 0; o -= 2) {
                        for (p = 1; p <= 25; p += 8)
                            f <<= 1, f |= e >>> p + o & 1;
                        for (p = 1; p <= 25; p += 8)
                            f <<= 1, f |= t >>> p + o & 1;
                    }
                    r[i + 0] = n >>> 0, r[i + 1] = f >>> 0;
                },
                rip: function (t, e, r, i) {
                    for (var n = 0, f = 0, o = 0; o < 4; o++)
                        for (var p = 24; p >= 0; p -= 8)
                            n <<= 1, n |= e >>> p + o & 1, n <<= 1, n |= t >>> p + o & 1;
                    for (o = 4; o < 8; o++)
                        for (p = 24; p >= 0; p -= 8)
                            f <<= 1, f |= e >>> p + o & 1, f <<= 1, f |= t >>> p + o & 1;
                    r[i + 0] = n >>> 0, r[i + 1] = f >>> 0;
                },
                pc1: function (t, e, r, i) {
                    for (var n = 0, f = 0, o = 7; o >= 5; o--) {
                        for (var p = 0; p <= 24; p += 8)
                            n <<= 1, n |= e >> p + o & 1;
                        for (p = 0; p <= 24; p += 8)
                            n <<= 1, n |= t >> p + o & 1;
                    }
                    for (p = 0; p <= 24; p += 8)
                        n <<= 1, n |= e >> p + o & 1;
                    for (o = 1; o <= 3; o++) {
                        for (p = 0; p <= 24; p += 8)
                            f <<= 1, f |= e >> p + o & 1;
                        for (p = 0; p <= 24; p += 8)
                            f <<= 1, f |= t >> p + o & 1;
                    }
                    for (p = 0; p <= 24; p += 8)
                        f <<= 1, f |= t >> p + o & 1;
                    r[i + 0] = n >>> 0, r[i + 1] = f >>> 0;
                },
                r28shl: function (t, e) {
                    return t << e & 268435455 | t >>> 28 - e;
                }
            }, i = [14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24];
            r$6.pc2 = function (t, e, r, n) {
                for (var f = 0, o = 0, p = i.length >>> 1, u = 0; u < p; u++)
                    f <<= 1, f |= t >>> i[u] & 1;
                for (u = p; u < i.length; u++)
                    o <<= 1, o |= e >>> i[u] & 1;
                r[n + 0] = f >>> 0, r[n + 1] = o >>> 0;
            }, r$6.expand = function (t, e, r) {
                var i = 0, n = 0;
                i = (1 & t) << 5 | t >>> 27;
                for (var f = 23; f >= 15; f -= 4)
                    i <<= 6, i |= t >>> f & 63;
                for (f = 11; f >= 3; f -= 4)
                    n |= t >>> f & 63, n <<= 6;
                n |= (31 & t) << 1 | t >>> 31, e[r + 0] = i >>> 0, e[r + 1] = n >>> 0;
            };
            n$8 = [14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11];
            r$6.substitute = function (t, e) {
                for (var r = 0, i = 0; i < 4; i++) {
                    r <<= 4, r |= n$8[64 * i + (t >>> 18 - 6 * i & 63)];
                }
                for (i = 0; i < 4; i++) {
                    r <<= 4, r |= n$8[256 + 64 * i + (e >>> 18 - 6 * i & 63)];
                }
                return r >>> 0;
            };
            f$9 = [16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7];
            r$6.permute = function (t) {
                for (var e = 0, r = 0; r < f$9.length; r++)
                    e <<= 1, e |= t >>> f$9[r] & 1;
                return e >>> 0;
            }, r$6.padSplit = function (t, e, r) {
                for (var i = t.toString(2); i.length < e;)
                    i = "0" + i;
                for (var n = [], f = 0; f < e; f += r)
                    n.push(i.slice(f, f + r));
                return n.join(" ");
            };
            p$6 = o$7;
            o$8 = u$6, u$6.prototype._init = function () { }, u$6.prototype.update = function (t) {
                return 0 === t.length ? [] : "decrypt" === this.type ? this._updateDecrypt(t) : this._updateEncrypt(t);
            }, u$6.prototype._buffer = function (t, e) {
                for (var r = Math.min(this.buffer.length - this.bufferOff, t.length - e), i = 0; i < r; i++)
                    this.buffer[this.bufferOff + i] = t[e + i];
                return this.bufferOff += r, r;
            }, u$6.prototype._flushBuffer = function (t, e) {
                return this._update(this.buffer, 0, t, e), this.bufferOff = 0, this.blockSize;
            }, u$6.prototype._updateEncrypt = function (t) {
                var e = 0, r = 0, i = (this.bufferOff + t.length) / this.blockSize | 0, n = new Array(i * this.blockSize);
                0 !== this.bufferOff && (e += this._buffer(t, e), this.bufferOff === this.buffer.length && (r += this._flushBuffer(n, r)));
                for (var f = t.length - (t.length - e) % this.blockSize; e < f; e += this.blockSize)
                    this._update(t, e, n, r), r += this.blockSize;
                for (; e < t.length; e++, this.bufferOff++)
                    this.buffer[this.bufferOff] = t[e];
                return n;
            }, u$6.prototype._updateDecrypt = function (t) {
                for (var e = 0, r = 0, i = Math.ceil((this.bufferOff + t.length) / this.blockSize) - 1, n = new Array(i * this.blockSize); i > 0; i--)
                    e += this._buffer(t, e), r += this._flushBuffer(n, r);
                return e += this._buffer(t, e), n;
            }, u$6.prototype.final = function (t) {
                var e, r;
                return t && (e = this.update(t)), r = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt(), e ? e.concat(r) : r;
            }, u$6.prototype._pad = function (t, e) {
                if (0 === e)
                    return !1;
                for (; e < t.length;)
                    t[e++] = 0;
                return !0;
            }, u$6.prototype._finalEncrypt = function () {
                if (!this._pad(this.buffer, this.bufferOff))
                    return [];
                var t = new Array(this.blockSize);
                return this._update(this.buffer, 0, t, 0), t;
            }, u$6.prototype._unpad = function (t) {
                return t;
            }, u$6.prototype._finalDecrypt = function () {
                p$6.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
                var t = new Array(this.blockSize);
                return this._flushBuffer(t, 0), this._unpad(t);
            };
            a$8 = o$8, h$7 = o$7, c$6 = r$6, l$6 = a$8;
            chunk_dac557ba_js_4.t(v$3, l$6), s$6 = v$3, v$3.create = function (t) {
                return new v$3(t);
            };
            d$5 = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
            v$3.prototype.deriveKeys = function (t, e) {
                t.keys = new Array(32), h$7.equal(e.length, this.blockSize, "Invalid key length");
                var r = c$6.readUInt32BE(e, 0), i = c$6.readUInt32BE(e, 4);
                c$6.pc1(r, i, t.tmp, 0), r = t.tmp[0], i = t.tmp[1];
                for (var n = 0; n < t.keys.length; n += 2) {
                    var f = d$5[n >>> 1];
                    r = c$6.r28shl(r, f), i = c$6.r28shl(i, f), c$6.pc2(r, i, t.keys, n);
                }
            }, v$3.prototype._update = function (t, e, r, i) {
                var n = this._desState, f = c$6.readUInt32BE(t, e), o = c$6.readUInt32BE(t, e + 4);
                c$6.ip(f, o, n.tmp, 0), f = n.tmp[0], o = n.tmp[1], "encrypt" === this.type ? this._encrypt(n, f, o, n.tmp, 0) : this._decrypt(n, f, o, n.tmp, 0), f = n.tmp[0], o = n.tmp[1], c$6.writeUInt32BE(r, f, i), c$6.writeUInt32BE(r, o, i + 4);
            }, v$3.prototype._pad = function (t, e) {
                for (var r = t.length - e, i = e; i < t.length; i++)
                    t[i] = r;
                return !0;
            }, v$3.prototype._unpad = function (t) {
                for (var e = t[t.length - 1], r = t.length - e; r < t.length; r++)
                    h$7.equal(t[r], e);
                return t.slice(0, t.length - e);
            }, v$3.prototype._encrypt = function (t, e, r, i, n) {
                for (var f = e, o = r, p = 0; p < t.keys.length; p += 2) {
                    var u = t.keys[p], s = t.keys[p + 1];
                    c$6.expand(o, t.tmp, 0), u ^= t.tmp[0], s ^= t.tmp[1];
                    var a = c$6.substitute(u, s), h = o;
                    o = (f ^ c$6.permute(a)) >>> 0, f = h;
                }
                c$6.rip(o, f, i, n);
            }, v$3.prototype._decrypt = function (t, e, r, i, n) {
                for (var f = r, o = e, p = t.keys.length - 2; p >= 0; p -= 2) {
                    var u = t.keys[p], s = t.keys[p + 1];
                    c$6.expand(f, t.tmp, 0), u ^= t.tmp[0], s ^= t.tmp[1];
                    var a = c$6.substitute(u, s), h = f;
                    f = (o ^ c$6.permute(a)) >>> 0, o = h;
                }
                c$6.rip(f, o, i, n);
            };
            _$5 = s$6, b$4 = {}, k$4 = o$7, g$3 = chunk_dac557ba_js_4.t, m$4 = {};
            b$4.instantiate = function (t) {
                function e(e) {
                    t.call(this, e), this._cbcInit();
                }
                g$3(e, t);
                for (var r = Object.keys(m$4), i = 0; i < r.length; i++) {
                    var n = r[i];
                    e.prototype[n] = m$4[n];
                }
                return e.create = function (t) {
                    return new e(t);
                }, e;
            }, m$4._cbcInit = function () {
                var t = new S$2(this.options.iv);
                this._cbcState = t;
            }, m$4._update = function (t, e, r, i) {
                var n = this._cbcState, f = this.constructor.super_.prototype, o = n.iv;
                if ("encrypt" === this.type) {
                    for (var p = 0; p < this.blockSize; p++)
                        o[p] ^= t[e + p];
                    f._update.call(this, o, 0, r, i);
                    for (p = 0; p < this.blockSize; p++)
                        o[p] = r[i + p];
                }
                else {
                    f._update.call(this, t, e, r, i);
                    for (p = 0; p < this.blockSize; p++)
                        r[i + p] ^= o[p];
                    for (p = 0; p < this.blockSize; p++)
                        o[p] = t[e + p];
                }
            };
            w$5 = o$7, E$3 = a$8, I$3 = _$5;
            chunk_dac557ba_js_4.t(B$2, E$3), z$2 = B$2, B$2.create = function (t) {
                return new B$2(t);
            }, B$2.prototype._update = function (t, e, r, i) {
                var n = this._edeState;
                n.ciphers[0]._update(t, e, r, i), n.ciphers[1]._update(r, i, r, i), n.ciphers[2]._update(r, i, r, i);
            }, B$2.prototype._pad = I$3.prototype._pad, B$2.prototype._unpad = I$3.prototype._unpad;
            A$2 = z$2, U$2 = {};
            U$2.utils = r$6, U$2.Cipher = a$8, U$2.DES = _$5, U$2.CBC = b$4, U$2.EDE = A$2;
            i$1 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, f$a = f$6, o$9 = U$2, a$9 = chunk_dac557ba_js_4.t, c$7 = chunk_6e68c801_js_3.r.Buffer, n$9 = {
                "des-ede3-cbc": o$9.CBC.instantiate(o$9.EDE),
                "des-ede3": o$9.EDE,
                "des-ede-cbc": o$9.CBC.instantiate(o$9.EDE),
                "des-ede": o$9.EDE,
                "des-cbc": o$9.CBC.instantiate(o$9.DES),
                "des-ecb": o$9.DES
            };
            n$9.des = n$9["des-cbc"], n$9.des3 = n$9["des-ede3-cbc"], d$6 = p$7, a$9(p$7, f$a), p$7.prototype._update = function (e) {
                return c$7.from((this || i$1)._des.update(e));
            }, p$7.prototype._final = function () {
                return c$7.from((this || i$1)._des.final());
            };
            l$7 = d$6;
            e$8 = buffer_js_3.default.Buffer, f$b = function (r, f) {
                for (var t = Math.min(r.length, f.length), n = new e$8(t), o = 0; o < t; ++o)
                    n[o] = r[o] ^ f[o];
                return n;
            };
            t$1 = function (e) {
                for (var c, r = e.length; r--;) {
                    if (255 !== (c = e.readUInt8(r))) {
                        c++, e.writeUInt8(c, r);
                        break;
                    }
                    e.writeUInt8(0, r);
                }
            }, a$a = {
                encrypt: function (e, c) {
                    return e._cipher.encryptBlock(c);
                },
                decrypt: function (e, c) {
                    return e._cipher.decryptBlock(c);
                }
            }, p$8 = {}, n$a = f$b;
            p$8.encrypt = function (e, c) {
                var r = n$a(c, e._prev);
                return e._prev = e._cipher.encryptBlock(r), e._prev;
            }, p$8.decrypt = function (e, c) {
                var r = e._prev;
                e._prev = c;
                var t = e._cipher.decryptBlock(c);
                return n$a(t, r);
            };
            i$2 = {}, o$a = chunk_6e68c801_js_3.r.Buffer, h$8 = f$b;
            i$2.encrypt = function (e, c, r) {
                for (var t, a = o$a.allocUnsafe(0); c.length;) {
                    if (0 === e._cache.length && (e._cache = e._cipher.encryptBlock(e._prev), e._prev = o$a.allocUnsafe(0)), !(e._cache.length <= c.length)) {
                        a = o$a.concat([a, v$4(e, c, r)]);
                        break;
                    }
                    t = e._cache.length, a = o$a.concat([a, v$4(e, c.slice(0, t), r)]), c = c.slice(t);
                }
                return a;
            };
            y$4 = {}, f$c = chunk_6e68c801_js_3.r.Buffer;
            y$4.encrypt = function (e, c, r) {
                for (var t = c.length, a = f$c.allocUnsafe(t), p = -1; ++p < t;)
                    a[p] = s$7(e, c[p], r);
                return a;
            };
            l$8 = {}, m$5 = chunk_6e68c801_js_3.r.Buffer;
            l$8.encrypt = function (e, c, r) {
                for (var t = c.length, a = m$5.allocUnsafe(t), p = -1; ++p < t;)
                    a[p] = _$6(e, c[p], r);
                return a;
            };
            B$3 = {}, u$7 = buffer_js_3.default.Buffer, C$1 = f$b;
            B$3.encrypt = function (e, c) {
                for (; e._cache.length < c.length;)
                    e._cache = u$7.concat([e._cache, E$4(e)]);
                var r = e._cache.slice(0, c.length);
                return e._cache = e._cache.slice(c.length), C$1(c, r);
            };
            d$7 = {}, b$5 = f$b, A$3 = chunk_6e68c801_js_3.r.Buffer, S$3 = t$1;
            d$7.encrypt = function (e, c) {
                var r = Math.ceil(c.length / 16), t = e._cache.length;
                e._cache = A$3.concat([e._cache, A$3.allocUnsafe(16 * r)]);
                for (var a = 0; a < r; a++) {
                    var p = g$4(e), n = t + 16 * a;
                    e._cache.writeUInt32BE(p[0], n + 0), e._cache.writeUInt32BE(p[1], n + 4), e._cache.writeUInt32BE(p[2], n + 8), e._cache.writeUInt32BE(p[3], n + 12);
                }
                var i = e._cache.slice(0, c.length);
                return e._cache = e._cache.slice(c.length), b$5(c, i);
            };
            F$2 = {
                "aes-128-ecb": {
                    cipher: "AES",
                    key: 128,
                    iv: 0,
                    mode: "ECB",
                    type: "block"
                },
                "aes-192-ecb": {
                    cipher: "AES",
                    key: 192,
                    iv: 0,
                    mode: "ECB",
                    type: "block"
                },
                "aes-256-ecb": {
                    cipher: "AES",
                    key: 256,
                    iv: 0,
                    mode: "ECB",
                    type: "block"
                },
                "aes-128-cbc": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                "aes-192-cbc": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                "aes-256-cbc": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                aes128: {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                aes192: {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                aes256: {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CBC",
                    type: "block"
                },
                "aes-128-cfb": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CFB",
                    type: "stream"
                },
                "aes-192-cfb": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CFB",
                    type: "stream"
                },
                "aes-256-cfb": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CFB",
                    type: "stream"
                },
                "aes-128-cfb8": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CFB8",
                    type: "stream"
                },
                "aes-192-cfb8": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CFB8",
                    type: "stream"
                },
                "aes-256-cfb8": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CFB8",
                    type: "stream"
                },
                "aes-128-cfb1": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CFB1",
                    type: "stream"
                },
                "aes-192-cfb1": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CFB1",
                    type: "stream"
                },
                "aes-256-cfb1": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CFB1",
                    type: "stream"
                },
                "aes-128-ofb": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "OFB",
                    type: "stream"
                },
                "aes-192-ofb": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "OFB",
                    type: "stream"
                },
                "aes-256-ofb": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "OFB",
                    type: "stream"
                },
                "aes-128-ctr": {
                    cipher: "AES",
                    key: 128,
                    iv: 16,
                    mode: "CTR",
                    type: "stream"
                },
                "aes-192-ctr": {
                    cipher: "AES",
                    key: 192,
                    iv: 16,
                    mode: "CTR",
                    type: "stream"
                },
                "aes-256-ctr": {
                    cipher: "AES",
                    key: 256,
                    iv: 16,
                    mode: "CTR",
                    type: "stream"
                },
                "aes-128-gcm": {
                    cipher: "AES",
                    key: 128,
                    iv: 12,
                    mode: "GCM",
                    type: "auth"
                },
                "aes-192-gcm": {
                    cipher: "AES",
                    key: 192,
                    iv: 12,
                    mode: "GCM",
                    type: "auth"
                },
                "aes-256-gcm": {
                    cipher: "AES",
                    key: 256,
                    iv: 12,
                    mode: "GCM",
                    type: "auth"
                }
            }, U$3 = {
                ECB: a$a,
                CBC: p$8,
                CFB: i$2,
                CFB8: y$4,
                CFB1: l$8,
                OFB: B$3,
                CTR: d$7,
                GCM: d$7
            }, w$6 = F$2;
            for (I$4 in w$6)
                w$6[I$4].module = U$3[w$6[I$4].mode];
            M$2 = w$6;
            a$b = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, h$9 = {}, o$b = chunk_6e68c801_js_3.r.Buffer;
            f$d = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], u$8 = function () {
                for (var t = new Array(256), e = 0; e < 256; e++)
                    t[e] = e < 128 ? e << 1 : e << 1 ^ 283;
                for (var i = [], r = [], n = [[], [], [], []], a = [[], [], [], []], h = 0, o = 0, s = 0; s < 256; ++s) {
                    var c = o ^ o << 1 ^ o << 2 ^ o << 3 ^ o << 4;
                    c = c >>> 8 ^ 255 & c ^ 99, i[h] = c, r[c] = h;
                    var l = t[h], f = t[l], u = t[f], p = 257 * t[c] ^ 16843008 * c;
                    n[0][h] = p << 24 | p >>> 8, n[1][h] = p << 16 | p >>> 16, n[2][h] = p << 8 | p >>> 24, n[3][h] = p, p = 16843009 * u ^ 65537 * f ^ 257 * l ^ 16843008 * h, a[0][c] = p << 24 | p >>> 8, a[1][c] = p << 16 | p >>> 16, a[2][c] = p << 8 | p >>> 24, a[3][c] = p, 0 === h ? h = o = 1 : (h = l ^ t[t[t[u ^ l]]], o ^= t[t[o]]);
                }
                return {
                    SBOX: i,
                    INV_SBOX: r,
                    SUB_MIX: n,
                    INV_SUB_MIX: a
                };
            }();
            p$9.blockSize = 16, p$9.keySize = 32, p$9.prototype.blockSize = p$9.blockSize, p$9.prototype.keySize = p$9.keySize, p$9.prototype._reset = function () {
                for (var t = (this || a$b)._key, e = t.length, i = e + 6, r = 4 * (i + 1), n = [], h = 0; h < e; h++)
                    n[h] = t[h];
                for (h = e; h < r; h++) {
                    var o = n[h - 1];
                    h % e == 0 ? (o = o << 8 | o >>> 24, o = u$8.SBOX[o >>> 24] << 24 | u$8.SBOX[o >>> 16 & 255] << 16 | u$8.SBOX[o >>> 8 & 255] << 8 | u$8.SBOX[255 & o], o ^= f$d[h / e | 0] << 24) : e > 6 && h % e == 4 && (o = u$8.SBOX[o >>> 24] << 24 | u$8.SBOX[o >>> 16 & 255] << 16 | u$8.SBOX[o >>> 8 & 255] << 8 | u$8.SBOX[255 & o]), n[h] = n[h - e] ^ o;
                }
                for (var s = [], c = 0; c < r; c++) {
                    var l = r - c, p = n[l - (c % 4 ? 0 : 4)];
                    s[c] = c < 4 || l <= 4 ? p : u$8.INV_SUB_MIX[0][u$8.SBOX[p >>> 24]] ^ u$8.INV_SUB_MIX[1][u$8.SBOX[p >>> 16 & 255]] ^ u$8.INV_SUB_MIX[2][u$8.SBOX[p >>> 8 & 255]] ^ u$8.INV_SUB_MIX[3][u$8.SBOX[255 & p]];
                }
                (this || a$b)._nRounds = i, (this || a$b)._keySchedule = n, (this || a$b)._invKeySchedule = s;
            }, p$9.prototype.encryptBlockRaw = function (t) {
                return l$9(t = s$8(t), (this || a$b)._keySchedule, u$8.SUB_MIX, u$8.SBOX, (this || a$b)._nRounds);
            }, p$9.prototype.encryptBlock = function (t) {
                var e = this.encryptBlockRaw(t), i = o$b.allocUnsafe(16);
                return i.writeUInt32BE(e[0], 0), i.writeUInt32BE(e[1], 4), i.writeUInt32BE(e[2], 8), i.writeUInt32BE(e[3], 12), i;
            }, p$9.prototype.decryptBlock = function (t) {
                var e = (t = s$8(t))[1];
                t[1] = t[3], t[3] = e;
                var i = l$9(t, (this || a$b)._invKeySchedule, u$8.INV_SUB_MIX, u$8.INV_SBOX, (this || a$b)._nRounds), r = o$b.allocUnsafe(16);
                return r.writeUInt32BE(i[0], 0), r.writeUInt32BE(i[3], 4), r.writeUInt32BE(i[2], 8), r.writeUInt32BE(i[1], 12), r;
            }, p$9.prototype.scrub = function () {
                c$8((this || a$b)._keySchedule), c$8((this || a$b)._invKeySchedule), c$8((this || a$b)._key);
            }, h$9.AES = p$9;
            _$7 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, d$8 = chunk_6e68c801_js_3.r.Buffer, y$5 = d$8.alloc(16, 0);
            g$5.prototype.ghash = function (t) {
                for (var e = -1; ++e < t.length;)
                    (this || _$7).state[e] ^= t[e];
                this._multiply();
            }, g$5.prototype._multiply = function () {
                for (var t, e, i, r = [(t = (this || _$7).h).readUInt32BE(0), t.readUInt32BE(4), t.readUInt32BE(8), t.readUInt32BE(12)], n = [0, 0, 0, 0], a = -1; ++a < 128;) {
                    for (0 != ((this || _$7).state[~~(a / 8)] & 1 << 7 - a % 8) && (n[0] ^= r[0], n[1] ^= r[1], n[2] ^= r[2], n[3] ^= r[3]), i = 0 != (1 & r[3]), e = 3; e > 0; e--)
                        r[e] = r[e] >>> 1 | (1 & r[e - 1]) << 31;
                    r[0] = r[0] >>> 1, i && (r[0] = r[0] ^ 225 << 24);
                }
                (this || _$7).state = B$4(n);
            }, g$5.prototype.update = function (t) {
                var e;
                for ((this || _$7).cache = d$8.concat([(this || _$7).cache, t]); (this || _$7).cache.length >= 16;)
                    e = (this || _$7).cache.slice(0, 16), (this || _$7).cache = (this || _$7).cache.slice(16), this.ghash(e);
            }, g$5.prototype.final = function (t, e) {
                return (this || _$7).cache.length && this.ghash(d$8.concat([(this || _$7).cache, y$5], 16)), this.ghash(B$4([0, t, 0, e])), (this || _$7).state;
            };
            S$4 = g$5, v$5 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, I$5 = h$9, U$4 = chunk_6e68c801_js_3.r.Buffer, w$7 = f$6, m$6 = S$4, E$5 = f$b, b$6 = t$1;
            chunk_dac557ba_js_4.t(X$1, w$7), X$1.prototype._update = function (t) {
                if (!(this || v$5)._called && (this || v$5)._alen) {
                    var e = 16 - (this || v$5)._alen % 16;
                    e < 16 && (e = U$4.alloc(e, 0), (this || v$5)._ghash.update(e));
                }
                (this || v$5)._called = !0;
                var i = (this || v$5)._mode.encrypt(this || v$5, t);
                return (this || v$5)._decrypt ? (this || v$5)._ghash.update(t) : (this || v$5)._ghash.update(i), (this || v$5)._len += t.length, i;
            }, X$1.prototype._final = function () {
                if ((this || v$5)._decrypt && !(this || v$5)._authTag)
                    throw new Error("Unsupported state or unable to authenticate data");
                var t = E$5((this || v$5)._ghash.final(8 * (this || v$5)._alen, 8 * (this || v$5)._len), (this || v$5)._cipher.encryptBlock((this || v$5)._finID));
                if ((this || v$5)._decrypt && function (t, e) {
                    var i = 0;
                    t.length !== e.length && i++;
                    for (var r = Math.min(t.length, e.length), n = 0; n < r; ++n)
                        i += t[n] ^ e[n];
                    return i;
                }(t, (this || v$5)._authTag))
                    throw new Error("Unsupported state or unable to authenticate data");
                (this || v$5)._authTag = t, (this || v$5)._cipher.scrub();
            }, X$1.prototype.getAuthTag = function () {
                if ((this || v$5)._decrypt || !U$4.isBuffer((this || v$5)._authTag))
                    throw new Error("Attempting to get auth tag in unsupported state");
                return (this || v$5)._authTag;
            }, X$1.prototype.setAuthTag = function (t) {
                if (!(this || v$5)._decrypt)
                    throw new Error("Attempting to set auth tag in unsupported state");
                (this || v$5)._authTag = t;
            }, X$1.prototype.setAAD = function (t) {
                if ((this || v$5)._called)
                    throw new Error("Attempting to set AAD in unsupported state");
                (this || v$5)._ghash.update(t), (this || v$5)._alen += t.length;
            };
            k$6 = X$1, T$2 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, O$2 = h$9, A$4 = chunk_6e68c801_js_3.r.Buffer, M$3 = f$6;
            chunk_dac557ba_js_4.t(N$1, M$3), N$1.prototype._update = function (t) {
                return (this || T$2)._mode.encrypt(this || T$2, t, (this || T$2)._decrypt);
            }, N$1.prototype._final = function () {
                (this || T$2)._cipher.scrub();
            };
            V$1 = N$1;
            t$2 = chunk_6e68c801_js_3.r.Buffer, f$e = u;
            a$c = function (r, e, a, l) {
                if (t$2.isBuffer(r) || (r = t$2.from(r, "binary")), e && (t$2.isBuffer(e) || (e = t$2.from(e, "binary")), 8 !== e.length))
                    throw new RangeError("salt should be Buffer with 8 byte length");
                for (var n = a / 8, o = t$2.alloc(n), i = t$2.alloc(l || 0), h = t$2.alloc(0); n > 0 || l > 0;) {
                    var u = new f$e();
                    u.update(h), u.update(r), e && u.update(e), h = u.digest();
                    var g = 0;
                    if (n > 0) {
                        var m = o.length - n;
                        g = Math.min(n, h.length), h.copy(o, m, 0, g), n -= g;
                    }
                    if (g < h.length && l > 0) {
                        var p = i.length - l, v = Math.min(l, h.length - g);
                        h.copy(i, p, g, g + v), l -= v;
                    }
                }
                return h.fill(0), {
                    key: o,
                    iv: i
                };
            };
            c$9 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, s$9 = {}, f$f = k$6, p$a = chunk_6e68c801_js_3.r.Buffer, u$9 = M$2, l$a = V$1, d$9 = f$6, y$6 = h$9, m$7 = a$c;
            chunk_dac557ba_js_4.t(g$6, d$9), g$6.prototype._update = function (t) {
                var e, r;
                (this || c$9)._cache.add(t);
                for (var i = []; e = (this || c$9)._cache.get((this || c$9)._autopadding);)
                    r = (this || c$9)._mode.decrypt(this || c$9, e), i.push(r);
                return p$a.concat(i);
            }, g$6.prototype._final = function () {
                var t = (this || c$9)._cache.flush();
                if ((this || c$9)._autopadding)
                    return function (t) {
                        var e = t[15];
                        if (e < 1 || e > 16)
                            throw new Error("unable to decrypt data");
                        var r = -1;
                        for (; ++r < e;)
                            if (t[r + (16 - e)] !== e)
                                throw new Error("unable to decrypt data");
                        if (16 === e)
                            return;
                        return t.slice(0, 16 - e);
                    }((this || c$9)._mode.decrypt(this || c$9, t));
                if (t)
                    throw new Error("data not multiple of block length");
            }, g$6.prototype.setAutoPadding = function (t) {
                return (this || c$9)._autopadding = !!t, this || c$9;
            }, v$6.prototype.add = function (t) {
                (this || c$9).cache = p$a.concat([(this || c$9).cache, t]);
            }, v$6.prototype.get = function (t) {
                var e;
                if (t) {
                    if ((this || c$9).cache.length > 16)
                        return e = (this || c$9).cache.slice(0, 16), (this || c$9).cache = (this || c$9).cache.slice(16), e;
                }
                else if ((this || c$9).cache.length >= 16)
                    return e = (this || c$9).cache.slice(0, 16), (this || c$9).cache = (this || c$9).cache.slice(16), e;
                return null;
            }, v$6.prototype.flush = function () {
                if ((this || c$9).cache.length)
                    return (this || c$9).cache;
            }, s$9.createDecipher = function (t, e) {
                var r = u$9[t.toLowerCase()];
                if (!r)
                    throw new TypeError("invalid suite type");
                var i = m$7(e, !1, r.key, r.iv);
                return w$8(t, i.key, i.iv);
            }, s$9.createDecipheriv = w$8;
            c$a = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, s$a = {}, f$g = M$2, p$b = k$6, l$b = chunk_6e68c801_js_3.r.Buffer, u$a = V$1, d$a = f$6, m$8 = h$9, y$7 = a$c;
            chunk_dac557ba_js_4.t(v$7, d$a), v$7.prototype._update = function (t) {
                var e, r;
                (this || c$a)._cache.add(t);
                for (var i = []; e = (this || c$a)._cache.get();)
                    r = (this || c$a)._mode.encrypt(this || c$a, e), i.push(r);
                return l$b.concat(i);
            };
            _$8 = l$b.alloc(16, 16);
            v$7.prototype._final = function () {
                var t = (this || c$a)._cache.flush();
                if ((this || c$a)._autopadding)
                    return t = (this || c$a)._mode.encrypt(this || c$a, t), (this || c$a)._cipher.scrub(), t;
                if (!t.equals(_$8))
                    throw (this || c$a)._cipher.scrub(), new Error("data not multiple of block length");
            }, v$7.prototype.setAutoPadding = function (t) {
                return (this || c$a)._autopadding = !!t, this || c$a;
            }, g$7.prototype.add = function (t) {
                (this || c$a).cache = l$b.concat([(this || c$a).cache, t]);
            }, g$7.prototype.get = function () {
                if ((this || c$a).cache.length > 15) {
                    var t = (this || c$a).cache.slice(0, 16);
                    return (this || c$a).cache = (this || c$a).cache.slice(16), t;
                }
                return null;
            }, g$7.prototype.flush = function () {
                for (var t = 16 - (this || c$a).cache.length, e = l$b.allocUnsafe(t), r = -1; ++r < t;)
                    e.writeUInt8(t, r);
                return l$b.concat([(this || c$a).cache, e]);
            }, s$a.createCipheriv = w$9, s$a.createCipher = function (t, e) {
                var r = f$g[t.toLowerCase()];
                if (!r)
                    throw new TypeError("invalid suite type");
                var i = y$7(e, !1, r.key, r.iv);
                return w$9(t, i.key, i.iv);
            };
            t$3 = {}, p$c = s$a, c$b = s$9, o$c = F$2;
            t$3.createCipher = t$3.Cipher = p$c.createCipher, t$3.createCipheriv = t$3.Cipheriv = p$c.createCipheriv, t$3.createDecipher = t$3.Decipher = c$b.createDecipher, t$3.createDecipheriv = t$3.Decipheriv = c$b.createDecipheriv, t$3.listCiphers = t$3.getCiphers = function () {
                return Object.keys(o$c);
            };
            e$9 = {
                "des-ecb": {
                    key: 8,
                    iv: 0
                }
            };
            e$9["des-cbc"] = e$9.des = {
                key: 8,
                iv: 8
            }, e$9["des-ede3-cbc"] = e$9.des3 = {
                key: 24,
                iv: 8
            }, e$9["des-ede3"] = {
                key: 24,
                iv: 0
            }, e$9["des-ede-cbc"] = {
                key: 16,
                iv: 8
            }, e$9["des-ede"] = {
                key: 16,
                iv: 0
            };
            p$d = {}, n$b = l$7, s$b = t$3, v$8 = M$2, y$8 = e$9, a$d = a$c;
            p$d.createCipher = p$d.Cipher = function (e, r) {
                var i, t;
                if (e = e.toLowerCase(), v$8[e])
                    i = v$8[e].key, t = v$8[e].iv;
                else {
                    if (!y$8[e])
                        throw new TypeError("invalid suite type");
                    i = 8 * y$8[e].key, t = y$8[e].iv;
                }
                var o = a$d(r, !1, i, t);
                return f$h(e, o.key, o.iv);
            }, p$d.createCipheriv = p$d.Cipheriv = f$h, p$d.createDecipher = p$d.Decipher = function (e, r) {
                var i, t;
                if (e = e.toLowerCase(), v$8[e])
                    i = v$8[e].key, t = v$8[e].iv;
                else {
                    if (!y$8[e])
                        throw new TypeError("invalid suite type");
                    i = 8 * y$8[e].key, t = y$8[e].iv;
                }
                var o = a$d(r, !1, i, t);
                return c$c(e, o.key, o.iv);
            }, p$d.createDecipheriv = p$d.Decipheriv = c$c, p$d.listCiphers = p$d.getCiphers = function () {
                return Object.keys(y$8).concat(s$b.getCiphers());
            };
            t$4 = Object.freeze({}), i$3 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, r$7 = {}, h$a = {
                exports: r$7
            };
            !function (r, h) {
                function n(t, i) {
                    if (!t)
                        throw new Error(i || "Assertion failed");
                }
                function e(t, i) {
                    t.super_ = i;
                    var r = function () { };
                    r.prototype = i.prototype, t.prototype = new r(), t.prototype.constructor = t;
                }
                function o(t, r, h) {
                    if (o.isBN(t))
                        return t;
                    (this || i$3).negative = 0, (this || i$3).words = null, (this || i$3).length = 0, (this || i$3).red = null, null !== t && ("le" !== r && "be" !== r || (h = r, r = 10), this._init(t || 0, r || 10, h || "be"));
                }
                var s;
                "object" == typeof r ? r.exports = o : h.BN = o, o.BN = o, o.wordSize = 26;
                try {
                    s = t$4.Buffer;
                }
                catch (t) { }
                function u(t, i, r) {
                    for (var h = 0, n = Math.min(t.length, r), e = i; e < n; e++) {
                        var o = t.charCodeAt(e) - 48;
                        h <<= 4, h |= o >= 49 && o <= 54 ? o - 49 + 10 : o >= 17 && o <= 22 ? o - 17 + 10 : 15 & o;
                    }
                    return h;
                }
                function a(t, i, r, h) {
                    for (var n = 0, e = Math.min(t.length, r), o = i; o < e; o++) {
                        var s = t.charCodeAt(o) - 48;
                        n *= h, n += s >= 49 ? s - 49 + 10 : s >= 17 ? s - 17 + 10 : s;
                    }
                    return n;
                }
                o.isBN = function (t) {
                    return t instanceof o || null !== t && "object" == typeof t && t.constructor.wordSize === o.wordSize && Array.isArray(t.words);
                }, o.max = function (t, i) {
                    return t.cmp(i) > 0 ? t : i;
                }, o.min = function (t, i) {
                    return t.cmp(i) < 0 ? t : i;
                }, o.prototype._init = function (t, r, h) {
                    if ("number" == typeof t)
                        return this._initNumber(t, r, h);
                    if ("object" == typeof t)
                        return this._initArray(t, r, h);
                    "hex" === r && (r = 16), n(r === (0 | r) && r >= 2 && r <= 36);
                    var e = 0;
                    "-" === (t = t.toString().replace(/\s+/g, ""))[0] && e++, 16 === r ? this._parseHex(t, e) : this._parseBase(t, r, e), "-" === t[0] && ((this || i$3).negative = 1), this.strip(), "le" === h && this._initArray(this.toArray(), r, h);
                }, o.prototype._initNumber = function (t, r, h) {
                    t < 0 && ((this || i$3).negative = 1, t = -t), t < 67108864 ? ((this || i$3).words = [67108863 & t], (this || i$3).length = 1) : t < 4503599627370496 ? ((this || i$3).words = [67108863 & t, t / 67108864 & 67108863], (this || i$3).length = 2) : (n(t < 9007199254740992), (this || i$3).words = [67108863 & t, t / 67108864 & 67108863, 1], (this || i$3).length = 3), "le" === h && this._initArray(this.toArray(), r, h);
                }, o.prototype._initArray = function (t, r, h) {
                    if (n("number" == typeof t.length), t.length <= 0)
                        return (this || i$3).words = [0], (this || i$3).length = 1, this || i$3;
                    (this || i$3).length = Math.ceil(t.length / 3), (this || i$3).words = new Array((this || i$3).length);
                    for (var e = 0; e < (this || i$3).length; e++)
                        (this || i$3).words[e] = 0;
                    var o, s, u = 0;
                    if ("be" === h)
                        for (e = t.length - 1, o = 0; e >= 0; e -= 3)
                            s = t[e] | t[e - 1] << 8 | t[e - 2] << 16, (this || i$3).words[o] |= s << u & 67108863, (this || i$3).words[o + 1] = s >>> 26 - u & 67108863, (u += 24) >= 26 && (u -= 26, o++);
                    else if ("le" === h)
                        for (e = 0, o = 0; e < t.length; e += 3)
                            s = t[e] | t[e + 1] << 8 | t[e + 2] << 16, (this || i$3).words[o] |= s << u & 67108863, (this || i$3).words[o + 1] = s >>> 26 - u & 67108863, (u += 24) >= 26 && (u -= 26, o++);
                    return this.strip();
                }, o.prototype._parseHex = function (t, r) {
                    (this || i$3).length = Math.ceil((t.length - r) / 6), (this || i$3).words = new Array((this || i$3).length);
                    for (var h = 0; h < (this || i$3).length; h++)
                        (this || i$3).words[h] = 0;
                    var n, e, o = 0;
                    for (h = t.length - 6, n = 0; h >= r; h -= 6)
                        e = u(t, h, h + 6), (this || i$3).words[n] |= e << o & 67108863, (this || i$3).words[n + 1] |= e >>> 26 - o & 4194303, (o += 24) >= 26 && (o -= 26, n++);
                    h + 6 !== r && (e = u(t, r, h + 6), (this || i$3).words[n] |= e << o & 67108863, (this || i$3).words[n + 1] |= e >>> 26 - o & 4194303), this.strip();
                }, o.prototype._parseBase = function (t, r, h) {
                    (this || i$3).words = [0], (this || i$3).length = 1;
                    for (var n = 0, e = 1; e <= 67108863; e *= r)
                        n++;
                    n--, e = e / r | 0;
                    for (var o = t.length - h, s = o % n, u = Math.min(o, o - s) + h, l = 0, m = h; m < u; m += n)
                        l = a(t, m, m + n, r), this.imuln(e), (this || i$3).words[0] + l < 67108864 ? (this || i$3).words[0] += l : this._iaddn(l);
                    if (0 !== s) {
                        var f = 1;
                        for (l = a(t, m, t.length, r), m = 0; m < s; m++)
                            f *= r;
                        this.imuln(f), (this || i$3).words[0] + l < 67108864 ? (this || i$3).words[0] += l : this._iaddn(l);
                    }
                }, o.prototype.copy = function (t) {
                    t.words = new Array((this || i$3).length);
                    for (var r = 0; r < (this || i$3).length; r++)
                        t.words[r] = (this || i$3).words[r];
                    t.length = (this || i$3).length, t.negative = (this || i$3).negative, t.red = (this || i$3).red;
                }, o.prototype.clone = function () {
                    var t = new o(null);
                    return this.copy(t), t;
                }, o.prototype._expand = function (t) {
                    for (; (this || i$3).length < t;)
                        (this || i$3).words[(this || i$3).length++] = 0;
                    return this || i$3;
                }, o.prototype.strip = function () {
                    for (; (this || i$3).length > 1 && 0 === (this || i$3).words[(this || i$3).length - 1];)
                        (this || i$3).length--;
                    return this._normSign();
                }, o.prototype._normSign = function () {
                    return 1 === (this || i$3).length && 0 === (this || i$3).words[0] && ((this || i$3).negative = 0), this || i$3;
                }, o.prototype.inspect = function () {
                    return ((this || i$3).red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
                };
                var l = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"], m = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], f = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];
                function d(t, i, r) {
                    r.negative = i.negative ^ t.negative;
                    var h = t.length + i.length | 0;
                    r.length = h, h = h - 1 | 0;
                    var n = 0 | t.words[0], e = 0 | i.words[0], o = n * e, s = 67108863 & o, u = o / 67108864 | 0;
                    r.words[0] = s;
                    for (var a = 1; a < h; a++) {
                        for (var l = u >>> 26, m = 67108863 & u, f = Math.min(a, i.length - 1), d = Math.max(0, a - t.length + 1); d <= f; d++) {
                            var p = a - d | 0;
                            l += (o = (n = 0 | t.words[p]) * (e = 0 | i.words[d]) + m) / 67108864 | 0, m = 67108863 & o;
                        }
                        r.words[a] = 0 | m, u = 0 | l;
                    }
                    return 0 !== u ? r.words[a] = 0 | u : r.length--, r.strip();
                }
                o.prototype.toString = function (t, r) {
                    var h;
                    if (r = 0 | r || 1, 16 === (t = t || 10) || "hex" === t) {
                        h = "";
                        for (var e = 0, o = 0, s = 0; s < (this || i$3).length; s++) {
                            var u = (this || i$3).words[s], a = (16777215 & (u << e | o)).toString(16);
                            h = 0 !== (o = u >>> 24 - e & 16777215) || s !== (this || i$3).length - 1 ? l[6 - a.length] + a + h : a + h, (e += 2) >= 26 && (e -= 26, s--);
                        }
                        for (0 !== o && (h = o.toString(16) + h); h.length % r != 0;)
                            h = "0" + h;
                        return 0 !== (this || i$3).negative && (h = "-" + h), h;
                    }
                    if (t === (0 | t) && t >= 2 && t <= 36) {
                        var d = m[t], p = f[t];
                        h = "";
                        var M = this.clone();
                        for (M.negative = 0; !M.isZero();) {
                            var v = M.modn(p).toString(t);
                            h = (M = M.idivn(p)).isZero() ? v + h : l[d - v.length] + v + h;
                        }
                        for (this.isZero() && (h = "0" + h); h.length % r != 0;)
                            h = "0" + h;
                        return 0 !== (this || i$3).negative && (h = "-" + h), h;
                    }
                    n(!1, "Base should be between 2 and 36");
                }, o.prototype.toNumber = function () {
                    var t = (this || i$3).words[0];
                    return 2 === (this || i$3).length ? t += 67108864 * (this || i$3).words[1] : 3 === (this || i$3).length && 1 === (this || i$3).words[2] ? t += 4503599627370496 + 67108864 * (this || i$3).words[1] : (this || i$3).length > 2 && n(!1, "Number can only safely store up to 53 bits"), 0 !== (this || i$3).negative ? -t : t;
                }, o.prototype.toJSON = function () {
                    return this.toString(16);
                }, o.prototype.toBuffer = function (t, i) {
                    return n(void 0 !== s), this.toArrayLike(s, t, i);
                }, o.prototype.toArray = function (t, i) {
                    return this.toArrayLike(Array, t, i);
                }, o.prototype.toArrayLike = function (t, i, r) {
                    var h = this.byteLength(), e = r || Math.max(1, h);
                    n(h <= e, "byte array longer than desired length"), n(e > 0, "Requested array length <= 0"), this.strip();
                    var o, s, u = "le" === i, a = new t(e), l = this.clone();
                    if (u) {
                        for (s = 0; !l.isZero(); s++)
                            o = l.andln(255), l.iushrn(8), a[s] = o;
                        for (; s < e; s++)
                            a[s] = 0;
                    }
                    else {
                        for (s = 0; s < e - h; s++)
                            a[s] = 0;
                        for (s = 0; !l.isZero(); s++)
                            o = l.andln(255), l.iushrn(8), a[e - s - 1] = o;
                    }
                    return a;
                }, Math.clz32 ? o.prototype._countBits = function (t) {
                    return 32 - Math.clz32(t);
                } : o.prototype._countBits = function (t) {
                    var i = t, r = 0;
                    return i >= 4096 && (r += 13, i >>>= 13), i >= 64 && (r += 7, i >>>= 7), i >= 8 && (r += 4, i >>>= 4), i >= 2 && (r += 2, i >>>= 2), r + i;
                }, o.prototype._zeroBits = function (t) {
                    if (0 === t)
                        return 26;
                    var i = t, r = 0;
                    return 0 == (8191 & i) && (r += 13, i >>>= 13), 0 == (127 & i) && (r += 7, i >>>= 7), 0 == (15 & i) && (r += 4, i >>>= 4), 0 == (3 & i) && (r += 2, i >>>= 2), 0 == (1 & i) && r++, r;
                }, o.prototype.bitLength = function () {
                    var t = (this || i$3).words[(this || i$3).length - 1], r = this._countBits(t);
                    return 26 * ((this || i$3).length - 1) + r;
                }, o.prototype.zeroBits = function () {
                    if (this.isZero())
                        return 0;
                    for (var t = 0, r = 0; r < (this || i$3).length; r++) {
                        var h = this._zeroBits((this || i$3).words[r]);
                        if (t += h, 26 !== h)
                            break;
                    }
                    return t;
                }, o.prototype.byteLength = function () {
                    return Math.ceil(this.bitLength() / 8);
                }, o.prototype.toTwos = function (t) {
                    return 0 !== (this || i$3).negative ? this.abs().inotn(t).iaddn(1) : this.clone();
                }, o.prototype.fromTwos = function (t) {
                    return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone();
                }, o.prototype.isNeg = function () {
                    return 0 !== (this || i$3).negative;
                }, o.prototype.neg = function () {
                    return this.clone().ineg();
                }, o.prototype.ineg = function () {
                    return this.isZero() || ((this || i$3).negative ^= 1), this || i$3;
                }, o.prototype.iuor = function (t) {
                    for (; (this || i$3).length < t.length;)
                        (this || i$3).words[(this || i$3).length++] = 0;
                    for (var r = 0; r < t.length; r++)
                        (this || i$3).words[r] = (this || i$3).words[r] | t.words[r];
                    return this.strip();
                }, o.prototype.ior = function (t) {
                    return n(0 == ((this || i$3).negative | t.negative)), this.iuor(t);
                }, o.prototype.or = function (t) {
                    return (this || i$3).length > t.length ? this.clone().ior(t) : t.clone().ior(this || i$3);
                }, o.prototype.uor = function (t) {
                    return (this || i$3).length > t.length ? this.clone().iuor(t) : t.clone().iuor(this || i$3);
                }, o.prototype.iuand = function (t) {
                    var r;
                    r = (this || i$3).length > t.length ? t : this || i$3;
                    for (var h = 0; h < r.length; h++)
                        (this || i$3).words[h] = (this || i$3).words[h] & t.words[h];
                    return (this || i$3).length = r.length, this.strip();
                }, o.prototype.iand = function (t) {
                    return n(0 == ((this || i$3).negative | t.negative)), this.iuand(t);
                }, o.prototype.and = function (t) {
                    return (this || i$3).length > t.length ? this.clone().iand(t) : t.clone().iand(this || i$3);
                }, o.prototype.uand = function (t) {
                    return (this || i$3).length > t.length ? this.clone().iuand(t) : t.clone().iuand(this || i$3);
                }, o.prototype.iuxor = function (t) {
                    var r, h;
                    (this || i$3).length > t.length ? (r = this || i$3, h = t) : (r = t, h = this || i$3);
                    for (var n = 0; n < h.length; n++)
                        (this || i$3).words[n] = r.words[n] ^ h.words[n];
                    if ((this || i$3) !== r)
                        for (; n < r.length; n++)
                            (this || i$3).words[n] = r.words[n];
                    return (this || i$3).length = r.length, this.strip();
                }, o.prototype.ixor = function (t) {
                    return n(0 == ((this || i$3).negative | t.negative)), this.iuxor(t);
                }, o.prototype.xor = function (t) {
                    return (this || i$3).length > t.length ? this.clone().ixor(t) : t.clone().ixor(this || i$3);
                }, o.prototype.uxor = function (t) {
                    return (this || i$3).length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this || i$3);
                }, o.prototype.inotn = function (t) {
                    n("number" == typeof t && t >= 0);
                    var r = 0 | Math.ceil(t / 26), h = t % 26;
                    this._expand(r), h > 0 && r--;
                    for (var e = 0; e < r; e++)
                        (this || i$3).words[e] = 67108863 & ~(this || i$3).words[e];
                    return h > 0 && ((this || i$3).words[e] = ~(this || i$3).words[e] & 67108863 >> 26 - h), this.strip();
                }, o.prototype.notn = function (t) {
                    return this.clone().inotn(t);
                }, o.prototype.setn = function (t, r) {
                    n("number" == typeof t && t >= 0);
                    var h = t / 26 | 0, e = t % 26;
                    return this._expand(h + 1), (this || i$3).words[h] = r ? (this || i$3).words[h] | 1 << e : (this || i$3).words[h] & ~(1 << e), this.strip();
                }, o.prototype.iadd = function (t) {
                    var r, h, n;
                    if (0 !== (this || i$3).negative && 0 === t.negative)
                        return (this || i$3).negative = 0, r = this.isub(t), (this || i$3).negative ^= 1, this._normSign();
                    if (0 === (this || i$3).negative && 0 !== t.negative)
                        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
                    (this || i$3).length > t.length ? (h = this || i$3, n = t) : (h = t, n = this || i$3);
                    for (var e = 0, o = 0; o < n.length; o++)
                        r = (0 | h.words[o]) + (0 | n.words[o]) + e, (this || i$3).words[o] = 67108863 & r, e = r >>> 26;
                    for (; 0 !== e && o < h.length; o++)
                        r = (0 | h.words[o]) + e, (this || i$3).words[o] = 67108863 & r, e = r >>> 26;
                    if ((this || i$3).length = h.length, 0 !== e)
                        (this || i$3).words[(this || i$3).length] = e, (this || i$3).length++;
                    else if (h !== (this || i$3))
                        for (; o < h.length; o++)
                            (this || i$3).words[o] = h.words[o];
                    return this || i$3;
                }, o.prototype.add = function (t) {
                    var r;
                    return 0 !== t.negative && 0 === (this || i$3).negative ? (t.negative = 0, r = this.sub(t), t.negative ^= 1, r) : 0 === t.negative && 0 !== (this || i$3).negative ? ((this || i$3).negative = 0, r = t.sub(this || i$3), (this || i$3).negative = 1, r) : (this || i$3).length > t.length ? this.clone().iadd(t) : t.clone().iadd(this || i$3);
                }, o.prototype.isub = function (t) {
                    if (0 !== t.negative) {
                        t.negative = 0;
                        var r = this.iadd(t);
                        return t.negative = 1, r._normSign();
                    }
                    if (0 !== (this || i$3).negative)
                        return (this || i$3).negative = 0, this.iadd(t), (this || i$3).negative = 1, this._normSign();
                    var h, n, e = this.cmp(t);
                    if (0 === e)
                        return (this || i$3).negative = 0, (this || i$3).length = 1, (this || i$3).words[0] = 0, this || i$3;
                    e > 0 ? (h = this || i$3, n = t) : (h = t, n = this || i$3);
                    for (var o = 0, s = 0; s < n.length; s++)
                        o = (r = (0 | h.words[s]) - (0 | n.words[s]) + o) >> 26, (this || i$3).words[s] = 67108863 & r;
                    for (; 0 !== o && s < h.length; s++)
                        o = (r = (0 | h.words[s]) + o) >> 26, (this || i$3).words[s] = 67108863 & r;
                    if (0 === o && s < h.length && h !== (this || i$3))
                        for (; s < h.length; s++)
                            (this || i$3).words[s] = h.words[s];
                    return (this || i$3).length = Math.max((this || i$3).length, s), h !== (this || i$3) && ((this || i$3).negative = 1), this.strip();
                }, o.prototype.sub = function (t) {
                    return this.clone().isub(t);
                };
                var p = function (t, i, r) {
                    var h, n, e, o = t.words, s = i.words, u = r.words, a = 0, l = 0 | o[0], m = 8191 & l, f = l >>> 13, d = 0 | o[1], p = 8191 & d, M = d >>> 13, v = 0 | o[2], g = 8191 & v, c = v >>> 13, w = 0 | o[3], y = 8191 & w, b = w >>> 13, _ = 0 | o[4], k = 8191 & _, A = _ >>> 13, x = 0 | o[5], S = 8191 & x, Z = x >>> 13, R = 0 | o[6], q = 8191 & R, B = R >>> 13, N = 0 | o[7], L = 8191 & N, I = N >>> 13, T = 0 | o[8], z = 8191 & T, E = T >>> 13, O = 0 | o[9], j = 8191 & O, K = O >>> 13, P = 0 | s[0], F = 8191 & P, C = P >>> 13, D = 0 | s[1], H = 8191 & D, J = D >>> 13, U = 0 | s[2], G = 8191 & U, Q = U >>> 13, V = 0 | s[3], W = 8191 & V, X = V >>> 13, Y = 0 | s[4], $ = 8191 & Y, tt = Y >>> 13, it = 0 | s[5], rt = 8191 & it, ht = it >>> 13, nt = 0 | s[6], et = 8191 & nt, ot = nt >>> 13, st = 0 | s[7], ut = 8191 & st, at = st >>> 13, lt = 0 | s[8], mt = 8191 & lt, ft = lt >>> 13, dt = 0 | s[9], pt = 8191 & dt, Mt = dt >>> 13;
                    r.negative = t.negative ^ i.negative, r.length = 19;
                    var vt = (a + (h = Math.imul(m, F)) | 0) + ((8191 & (n = (n = Math.imul(m, C)) + Math.imul(f, F) | 0)) << 13) | 0;
                    a = ((e = Math.imul(f, C)) + (n >>> 13) | 0) + (vt >>> 26) | 0, vt &= 67108863, h = Math.imul(p, F), n = (n = Math.imul(p, C)) + Math.imul(M, F) | 0, e = Math.imul(M, C);
                    var gt = (a + (h = h + Math.imul(m, H) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(m, J) | 0) + Math.imul(f, H) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(f, J) | 0) + (n >>> 13) | 0) + (gt >>> 26) | 0, gt &= 67108863, h = Math.imul(g, F), n = (n = Math.imul(g, C)) + Math.imul(c, F) | 0, e = Math.imul(c, C), h = h + Math.imul(p, H) | 0, n = (n = n + Math.imul(p, J) | 0) + Math.imul(M, H) | 0, e = e + Math.imul(M, J) | 0;
                    var ct = (a + (h = h + Math.imul(m, G) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(m, Q) | 0) + Math.imul(f, G) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(f, Q) | 0) + (n >>> 13) | 0) + (ct >>> 26) | 0, ct &= 67108863, h = Math.imul(y, F), n = (n = Math.imul(y, C)) + Math.imul(b, F) | 0, e = Math.imul(b, C), h = h + Math.imul(g, H) | 0, n = (n = n + Math.imul(g, J) | 0) + Math.imul(c, H) | 0, e = e + Math.imul(c, J) | 0, h = h + Math.imul(p, G) | 0, n = (n = n + Math.imul(p, Q) | 0) + Math.imul(M, G) | 0, e = e + Math.imul(M, Q) | 0;
                    var wt = (a + (h = h + Math.imul(m, W) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(m, X) | 0) + Math.imul(f, W) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(f, X) | 0) + (n >>> 13) | 0) + (wt >>> 26) | 0, wt &= 67108863, h = Math.imul(k, F), n = (n = Math.imul(k, C)) + Math.imul(A, F) | 0, e = Math.imul(A, C), h = h + Math.imul(y, H) | 0, n = (n = n + Math.imul(y, J) | 0) + Math.imul(b, H) | 0, e = e + Math.imul(b, J) | 0, h = h + Math.imul(g, G) | 0, n = (n = n + Math.imul(g, Q) | 0) + Math.imul(c, G) | 0, e = e + Math.imul(c, Q) | 0, h = h + Math.imul(p, W) | 0, n = (n = n + Math.imul(p, X) | 0) + Math.imul(M, W) | 0, e = e + Math.imul(M, X) | 0;
                    var yt = (a + (h = h + Math.imul(m, $) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(m, tt) | 0) + Math.imul(f, $) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(f, tt) | 0) + (n >>> 13) | 0) + (yt >>> 26) | 0, yt &= 67108863, h = Math.imul(S, F), n = (n = Math.imul(S, C)) + Math.imul(Z, F) | 0, e = Math.imul(Z, C), h = h + Math.imul(k, H) | 0, n = (n = n + Math.imul(k, J) | 0) + Math.imul(A, H) | 0, e = e + Math.imul(A, J) | 0, h = h + Math.imul(y, G) | 0, n = (n = n + Math.imul(y, Q) | 0) + Math.imul(b, G) | 0, e = e + Math.imul(b, Q) | 0, h = h + Math.imul(g, W) | 0, n = (n = n + Math.imul(g, X) | 0) + Math.imul(c, W) | 0, e = e + Math.imul(c, X) | 0, h = h + Math.imul(p, $) | 0, n = (n = n + Math.imul(p, tt) | 0) + Math.imul(M, $) | 0, e = e + Math.imul(M, tt) | 0;
                    var bt = (a + (h = h + Math.imul(m, rt) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(m, ht) | 0) + Math.imul(f, rt) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(f, ht) | 0) + (n >>> 13) | 0) + (bt >>> 26) | 0, bt &= 67108863, h = Math.imul(q, F), n = (n = Math.imul(q, C)) + Math.imul(B, F) | 0, e = Math.imul(B, C), h = h + Math.imul(S, H) | 0, n = (n = n + Math.imul(S, J) | 0) + Math.imul(Z, H) | 0, e = e + Math.imul(Z, J) | 0, h = h + Math.imul(k, G) | 0, n = (n = n + Math.imul(k, Q) | 0) + Math.imul(A, G) | 0, e = e + Math.imul(A, Q) | 0, h = h + Math.imul(y, W) | 0, n = (n = n + Math.imul(y, X) | 0) + Math.imul(b, W) | 0, e = e + Math.imul(b, X) | 0, h = h + Math.imul(g, $) | 0, n = (n = n + Math.imul(g, tt) | 0) + Math.imul(c, $) | 0, e = e + Math.imul(c, tt) | 0, h = h + Math.imul(p, rt) | 0, n = (n = n + Math.imul(p, ht) | 0) + Math.imul(M, rt) | 0, e = e + Math.imul(M, ht) | 0;
                    var _t = (a + (h = h + Math.imul(m, et) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(m, ot) | 0) + Math.imul(f, et) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(f, ot) | 0) + (n >>> 13) | 0) + (_t >>> 26) | 0, _t &= 67108863, h = Math.imul(L, F), n = (n = Math.imul(L, C)) + Math.imul(I, F) | 0, e = Math.imul(I, C), h = h + Math.imul(q, H) | 0, n = (n = n + Math.imul(q, J) | 0) + Math.imul(B, H) | 0, e = e + Math.imul(B, J) | 0, h = h + Math.imul(S, G) | 0, n = (n = n + Math.imul(S, Q) | 0) + Math.imul(Z, G) | 0, e = e + Math.imul(Z, Q) | 0, h = h + Math.imul(k, W) | 0, n = (n = n + Math.imul(k, X) | 0) + Math.imul(A, W) | 0, e = e + Math.imul(A, X) | 0, h = h + Math.imul(y, $) | 0, n = (n = n + Math.imul(y, tt) | 0) + Math.imul(b, $) | 0, e = e + Math.imul(b, tt) | 0, h = h + Math.imul(g, rt) | 0, n = (n = n + Math.imul(g, ht) | 0) + Math.imul(c, rt) | 0, e = e + Math.imul(c, ht) | 0, h = h + Math.imul(p, et) | 0, n = (n = n + Math.imul(p, ot) | 0) + Math.imul(M, et) | 0, e = e + Math.imul(M, ot) | 0;
                    var kt = (a + (h = h + Math.imul(m, ut) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(m, at) | 0) + Math.imul(f, ut) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(f, at) | 0) + (n >>> 13) | 0) + (kt >>> 26) | 0, kt &= 67108863, h = Math.imul(z, F), n = (n = Math.imul(z, C)) + Math.imul(E, F) | 0, e = Math.imul(E, C), h = h + Math.imul(L, H) | 0, n = (n = n + Math.imul(L, J) | 0) + Math.imul(I, H) | 0, e = e + Math.imul(I, J) | 0, h = h + Math.imul(q, G) | 0, n = (n = n + Math.imul(q, Q) | 0) + Math.imul(B, G) | 0, e = e + Math.imul(B, Q) | 0, h = h + Math.imul(S, W) | 0, n = (n = n + Math.imul(S, X) | 0) + Math.imul(Z, W) | 0, e = e + Math.imul(Z, X) | 0, h = h + Math.imul(k, $) | 0, n = (n = n + Math.imul(k, tt) | 0) + Math.imul(A, $) | 0, e = e + Math.imul(A, tt) | 0, h = h + Math.imul(y, rt) | 0, n = (n = n + Math.imul(y, ht) | 0) + Math.imul(b, rt) | 0, e = e + Math.imul(b, ht) | 0, h = h + Math.imul(g, et) | 0, n = (n = n + Math.imul(g, ot) | 0) + Math.imul(c, et) | 0, e = e + Math.imul(c, ot) | 0, h = h + Math.imul(p, ut) | 0, n = (n = n + Math.imul(p, at) | 0) + Math.imul(M, ut) | 0, e = e + Math.imul(M, at) | 0;
                    var At = (a + (h = h + Math.imul(m, mt) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(m, ft) | 0) + Math.imul(f, mt) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(f, ft) | 0) + (n >>> 13) | 0) + (At >>> 26) | 0, At &= 67108863, h = Math.imul(j, F), n = (n = Math.imul(j, C)) + Math.imul(K, F) | 0, e = Math.imul(K, C), h = h + Math.imul(z, H) | 0, n = (n = n + Math.imul(z, J) | 0) + Math.imul(E, H) | 0, e = e + Math.imul(E, J) | 0, h = h + Math.imul(L, G) | 0, n = (n = n + Math.imul(L, Q) | 0) + Math.imul(I, G) | 0, e = e + Math.imul(I, Q) | 0, h = h + Math.imul(q, W) | 0, n = (n = n + Math.imul(q, X) | 0) + Math.imul(B, W) | 0, e = e + Math.imul(B, X) | 0, h = h + Math.imul(S, $) | 0, n = (n = n + Math.imul(S, tt) | 0) + Math.imul(Z, $) | 0, e = e + Math.imul(Z, tt) | 0, h = h + Math.imul(k, rt) | 0, n = (n = n + Math.imul(k, ht) | 0) + Math.imul(A, rt) | 0, e = e + Math.imul(A, ht) | 0, h = h + Math.imul(y, et) | 0, n = (n = n + Math.imul(y, ot) | 0) + Math.imul(b, et) | 0, e = e + Math.imul(b, ot) | 0, h = h + Math.imul(g, ut) | 0, n = (n = n + Math.imul(g, at) | 0) + Math.imul(c, ut) | 0, e = e + Math.imul(c, at) | 0, h = h + Math.imul(p, mt) | 0, n = (n = n + Math.imul(p, ft) | 0) + Math.imul(M, mt) | 0, e = e + Math.imul(M, ft) | 0;
                    var xt = (a + (h = h + Math.imul(m, pt) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(m, Mt) | 0) + Math.imul(f, pt) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(f, Mt) | 0) + (n >>> 13) | 0) + (xt >>> 26) | 0, xt &= 67108863, h = Math.imul(j, H), n = (n = Math.imul(j, J)) + Math.imul(K, H) | 0, e = Math.imul(K, J), h = h + Math.imul(z, G) | 0, n = (n = n + Math.imul(z, Q) | 0) + Math.imul(E, G) | 0, e = e + Math.imul(E, Q) | 0, h = h + Math.imul(L, W) | 0, n = (n = n + Math.imul(L, X) | 0) + Math.imul(I, W) | 0, e = e + Math.imul(I, X) | 0, h = h + Math.imul(q, $) | 0, n = (n = n + Math.imul(q, tt) | 0) + Math.imul(B, $) | 0, e = e + Math.imul(B, tt) | 0, h = h + Math.imul(S, rt) | 0, n = (n = n + Math.imul(S, ht) | 0) + Math.imul(Z, rt) | 0, e = e + Math.imul(Z, ht) | 0, h = h + Math.imul(k, et) | 0, n = (n = n + Math.imul(k, ot) | 0) + Math.imul(A, et) | 0, e = e + Math.imul(A, ot) | 0, h = h + Math.imul(y, ut) | 0, n = (n = n + Math.imul(y, at) | 0) + Math.imul(b, ut) | 0, e = e + Math.imul(b, at) | 0, h = h + Math.imul(g, mt) | 0, n = (n = n + Math.imul(g, ft) | 0) + Math.imul(c, mt) | 0, e = e + Math.imul(c, ft) | 0;
                    var St = (a + (h = h + Math.imul(p, pt) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(p, Mt) | 0) + Math.imul(M, pt) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(M, Mt) | 0) + (n >>> 13) | 0) + (St >>> 26) | 0, St &= 67108863, h = Math.imul(j, G), n = (n = Math.imul(j, Q)) + Math.imul(K, G) | 0, e = Math.imul(K, Q), h = h + Math.imul(z, W) | 0, n = (n = n + Math.imul(z, X) | 0) + Math.imul(E, W) | 0, e = e + Math.imul(E, X) | 0, h = h + Math.imul(L, $) | 0, n = (n = n + Math.imul(L, tt) | 0) + Math.imul(I, $) | 0, e = e + Math.imul(I, tt) | 0, h = h + Math.imul(q, rt) | 0, n = (n = n + Math.imul(q, ht) | 0) + Math.imul(B, rt) | 0, e = e + Math.imul(B, ht) | 0, h = h + Math.imul(S, et) | 0, n = (n = n + Math.imul(S, ot) | 0) + Math.imul(Z, et) | 0, e = e + Math.imul(Z, ot) | 0, h = h + Math.imul(k, ut) | 0, n = (n = n + Math.imul(k, at) | 0) + Math.imul(A, ut) | 0, e = e + Math.imul(A, at) | 0, h = h + Math.imul(y, mt) | 0, n = (n = n + Math.imul(y, ft) | 0) + Math.imul(b, mt) | 0, e = e + Math.imul(b, ft) | 0;
                    var Zt = (a + (h = h + Math.imul(g, pt) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(g, Mt) | 0) + Math.imul(c, pt) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(c, Mt) | 0) + (n >>> 13) | 0) + (Zt >>> 26) | 0, Zt &= 67108863, h = Math.imul(j, W), n = (n = Math.imul(j, X)) + Math.imul(K, W) | 0, e = Math.imul(K, X), h = h + Math.imul(z, $) | 0, n = (n = n + Math.imul(z, tt) | 0) + Math.imul(E, $) | 0, e = e + Math.imul(E, tt) | 0, h = h + Math.imul(L, rt) | 0, n = (n = n + Math.imul(L, ht) | 0) + Math.imul(I, rt) | 0, e = e + Math.imul(I, ht) | 0, h = h + Math.imul(q, et) | 0, n = (n = n + Math.imul(q, ot) | 0) + Math.imul(B, et) | 0, e = e + Math.imul(B, ot) | 0, h = h + Math.imul(S, ut) | 0, n = (n = n + Math.imul(S, at) | 0) + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, at) | 0, h = h + Math.imul(k, mt) | 0, n = (n = n + Math.imul(k, ft) | 0) + Math.imul(A, mt) | 0, e = e + Math.imul(A, ft) | 0;
                    var Rt = (a + (h = h + Math.imul(y, pt) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(y, Mt) | 0) + Math.imul(b, pt) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(b, Mt) | 0) + (n >>> 13) | 0) + (Rt >>> 26) | 0, Rt &= 67108863, h = Math.imul(j, $), n = (n = Math.imul(j, tt)) + Math.imul(K, $) | 0, e = Math.imul(K, tt), h = h + Math.imul(z, rt) | 0, n = (n = n + Math.imul(z, ht) | 0) + Math.imul(E, rt) | 0, e = e + Math.imul(E, ht) | 0, h = h + Math.imul(L, et) | 0, n = (n = n + Math.imul(L, ot) | 0) + Math.imul(I, et) | 0, e = e + Math.imul(I, ot) | 0, h = h + Math.imul(q, ut) | 0, n = (n = n + Math.imul(q, at) | 0) + Math.imul(B, ut) | 0, e = e + Math.imul(B, at) | 0, h = h + Math.imul(S, mt) | 0, n = (n = n + Math.imul(S, ft) | 0) + Math.imul(Z, mt) | 0, e = e + Math.imul(Z, ft) | 0;
                    var qt = (a + (h = h + Math.imul(k, pt) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(k, Mt) | 0) + Math.imul(A, pt) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(A, Mt) | 0) + (n >>> 13) | 0) + (qt >>> 26) | 0, qt &= 67108863, h = Math.imul(j, rt), n = (n = Math.imul(j, ht)) + Math.imul(K, rt) | 0, e = Math.imul(K, ht), h = h + Math.imul(z, et) | 0, n = (n = n + Math.imul(z, ot) | 0) + Math.imul(E, et) | 0, e = e + Math.imul(E, ot) | 0, h = h + Math.imul(L, ut) | 0, n = (n = n + Math.imul(L, at) | 0) + Math.imul(I, ut) | 0, e = e + Math.imul(I, at) | 0, h = h + Math.imul(q, mt) | 0, n = (n = n + Math.imul(q, ft) | 0) + Math.imul(B, mt) | 0, e = e + Math.imul(B, ft) | 0;
                    var Bt = (a + (h = h + Math.imul(S, pt) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(S, Mt) | 0) + Math.imul(Z, pt) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(Z, Mt) | 0) + (n >>> 13) | 0) + (Bt >>> 26) | 0, Bt &= 67108863, h = Math.imul(j, et), n = (n = Math.imul(j, ot)) + Math.imul(K, et) | 0, e = Math.imul(K, ot), h = h + Math.imul(z, ut) | 0, n = (n = n + Math.imul(z, at) | 0) + Math.imul(E, ut) | 0, e = e + Math.imul(E, at) | 0, h = h + Math.imul(L, mt) | 0, n = (n = n + Math.imul(L, ft) | 0) + Math.imul(I, mt) | 0, e = e + Math.imul(I, ft) | 0;
                    var Nt = (a + (h = h + Math.imul(q, pt) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(q, Mt) | 0) + Math.imul(B, pt) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(B, Mt) | 0) + (n >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, h = Math.imul(j, ut), n = (n = Math.imul(j, at)) + Math.imul(K, ut) | 0, e = Math.imul(K, at), h = h + Math.imul(z, mt) | 0, n = (n = n + Math.imul(z, ft) | 0) + Math.imul(E, mt) | 0, e = e + Math.imul(E, ft) | 0;
                    var Lt = (a + (h = h + Math.imul(L, pt) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(L, Mt) | 0) + Math.imul(I, pt) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(I, Mt) | 0) + (n >>> 13) | 0) + (Lt >>> 26) | 0, Lt &= 67108863, h = Math.imul(j, mt), n = (n = Math.imul(j, ft)) + Math.imul(K, mt) | 0, e = Math.imul(K, ft);
                    var It = (a + (h = h + Math.imul(z, pt) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(z, Mt) | 0) + Math.imul(E, pt) | 0)) << 13) | 0;
                    a = ((e = e + Math.imul(E, Mt) | 0) + (n >>> 13) | 0) + (It >>> 26) | 0, It &= 67108863;
                    var Tt = (a + (h = Math.imul(j, pt)) | 0) + ((8191 & (n = (n = Math.imul(j, Mt)) + Math.imul(K, pt) | 0)) << 13) | 0;
                    return a = ((e = Math.imul(K, Mt)) + (n >>> 13) | 0) + (Tt >>> 26) | 0, Tt &= 67108863, u[0] = vt, u[1] = gt, u[2] = ct, u[3] = wt, u[4] = yt, u[5] = bt, u[6] = _t, u[7] = kt, u[8] = At, u[9] = xt, u[10] = St, u[11] = Zt, u[12] = Rt, u[13] = qt, u[14] = Bt, u[15] = Nt, u[16] = Lt, u[17] = It, u[18] = Tt, 0 !== a && (u[19] = a, r.length++), r;
                };
                function M(t, i, r) {
                    return new v().mulp(t, i, r);
                }
                function v(t, r) {
                    (this || i$3).x = t, (this || i$3).y = r;
                }
                Math.imul || (p = d), o.prototype.mulTo = function (t, r) {
                    var h = (this || i$3).length + t.length;
                    return 10 === (this || i$3).length && 10 === t.length ? p(this || i$3, t, r) : h < 63 ? d(this || i$3, t, r) : h < 1024 ? function (t, i, r) {
                        r.negative = i.negative ^ t.negative, r.length = t.length + i.length;
                        for (var h = 0, n = 0, e = 0; e < r.length - 1; e++) {
                            var o = n;
                            n = 0;
                            for (var s = 67108863 & h, u = Math.min(e, i.length - 1), a = Math.max(0, e - t.length + 1); a <= u; a++) {
                                var l = e - a, m = (0 | t.words[l]) * (0 | i.words[a]), f = 67108863 & m;
                                s = 67108863 & (f = f + s | 0), n += (o = (o = o + (m / 67108864 | 0) | 0) + (f >>> 26) | 0) >>> 26, o &= 67108863;
                            }
                            r.words[e] = s, h = o, o = n;
                        }
                        return 0 !== h ? r.words[e] = h : r.length--, r.strip();
                    }(this || i$3, t, r) : M(this || i$3, t, r);
                }, v.prototype.makeRBT = function (t) {
                    for (var i = new Array(t), r = o.prototype._countBits(t) - 1, h = 0; h < t; h++)
                        i[h] = this.revBin(h, r, t);
                    return i;
                }, v.prototype.revBin = function (t, i, r) {
                    if (0 === t || t === r - 1)
                        return t;
                    for (var h = 0, n = 0; n < i; n++)
                        h |= (1 & t) << i - n - 1, t >>= 1;
                    return h;
                }, v.prototype.permute = function (t, i, r, h, n, e) {
                    for (var o = 0; o < e; o++)
                        h[o] = i[t[o]], n[o] = r[t[o]];
                }, v.prototype.transform = function (t, i, r, h, n, e) {
                    this.permute(e, t, i, r, h, n);
                    for (var o = 1; o < n; o <<= 1)
                        for (var s = o << 1, u = Math.cos(2 * Math.PI / s), a = Math.sin(2 * Math.PI / s), l = 0; l < n; l += s)
                            for (var m = u, f = a, d = 0; d < o; d++) {
                                var p = r[l + d], M = h[l + d], v = r[l + d + o], g = h[l + d + o], c = m * v - f * g;
                                g = m * g + f * v, v = c, r[l + d] = p + v, h[l + d] = M + g, r[l + d + o] = p - v, h[l + d + o] = M - g, d !== s && (c = u * m - a * f, f = u * f + a * m, m = c);
                            }
                }, v.prototype.guessLen13b = function (t, i) {
                    var r = 1 | Math.max(i, t), h = 1 & r, n = 0;
                    for (r = r / 2 | 0; r; r >>>= 1)
                        n++;
                    return 1 << n + 1 + h;
                }, v.prototype.conjugate = function (t, i, r) {
                    if (!(r <= 1))
                        for (var h = 0; h < r / 2; h++) {
                            var n = t[h];
                            t[h] = t[r - h - 1], t[r - h - 1] = n, n = i[h], i[h] = -i[r - h - 1], i[r - h - 1] = -n;
                        }
                }, v.prototype.normalize13b = function (t, i) {
                    for (var r = 0, h = 0; h < i / 2; h++) {
                        var n = 8192 * Math.round(t[2 * h + 1] / i) + Math.round(t[2 * h] / i) + r;
                        t[h] = 67108863 & n, r = n < 67108864 ? 0 : n / 67108864 | 0;
                    }
                    return t;
                }, v.prototype.convert13b = function (t, i, r, h) {
                    for (var e = 0, o = 0; o < i; o++)
                        e += 0 | t[o], r[2 * o] = 8191 & e, e >>>= 13, r[2 * o + 1] = 8191 & e, e >>>= 13;
                    for (o = 2 * i; o < h; ++o)
                        r[o] = 0;
                    n(0 === e), n(0 == (-8192 & e));
                }, v.prototype.stub = function (t) {
                    for (var i = new Array(t), r = 0; r < t; r++)
                        i[r] = 0;
                    return i;
                }, v.prototype.mulp = function (t, i, r) {
                    var h = 2 * this.guessLen13b(t.length, i.length), n = this.makeRBT(h), e = this.stub(h), o = new Array(h), s = new Array(h), u = new Array(h), a = new Array(h), l = new Array(h), m = new Array(h), f = r.words;
                    f.length = h, this.convert13b(t.words, t.length, o, h), this.convert13b(i.words, i.length, a, h), this.transform(o, e, s, u, h, n), this.transform(a, e, l, m, h, n);
                    for (var d = 0; d < h; d++) {
                        var p = s[d] * l[d] - u[d] * m[d];
                        u[d] = s[d] * m[d] + u[d] * l[d], s[d] = p;
                    }
                    return this.conjugate(s, u, h), this.transform(s, u, f, e, h, n), this.conjugate(f, e, h), this.normalize13b(f, h), r.negative = t.negative ^ i.negative, r.length = t.length + i.length, r.strip();
                }, o.prototype.mul = function (t) {
                    var r = new o(null);
                    return r.words = new Array((this || i$3).length + t.length), this.mulTo(t, r);
                }, o.prototype.mulf = function (t) {
                    var r = new o(null);
                    return r.words = new Array((this || i$3).length + t.length), M(this || i$3, t, r);
                }, o.prototype.imul = function (t) {
                    return this.clone().mulTo(t, this || i$3);
                }, o.prototype.imuln = function (t) {
                    n("number" == typeof t), n(t < 67108864);
                    for (var r = 0, h = 0; h < (this || i$3).length; h++) {
                        var e = (0 | (this || i$3).words[h]) * t, o = (67108863 & e) + (67108863 & r);
                        r >>= 26, r += e / 67108864 | 0, r += o >>> 26, (this || i$3).words[h] = 67108863 & o;
                    }
                    return 0 !== r && ((this || i$3).words[h] = r, (this || i$3).length++), this || i$3;
                }, o.prototype.muln = function (t) {
                    return this.clone().imuln(t);
                }, o.prototype.sqr = function () {
                    return this.mul(this || i$3);
                }, o.prototype.isqr = function () {
                    return this.imul(this.clone());
                }, o.prototype.pow = function (t) {
                    var r = function (t) {
                        for (var i = new Array(t.bitLength()), r = 0; r < i.length; r++) {
                            var h = r / 26 | 0, n = r % 26;
                            i[r] = (t.words[h] & 1 << n) >>> n;
                        }
                        return i;
                    }(t);
                    if (0 === r.length)
                        return new o(1);
                    for (var h = this || i$3, n = 0; n < r.length && 0 === r[n]; n++, h = h.sqr())
                        ;
                    if (++n < r.length)
                        for (var e = h.sqr(); n < r.length; n++, e = e.sqr())
                            0 !== r[n] && (h = h.mul(e));
                    return h;
                }, o.prototype.iushln = function (t) {
                    n("number" == typeof t && t >= 0);
                    var r, h = t % 26, e = (t - h) / 26, o = 67108863 >>> 26 - h << 26 - h;
                    if (0 !== h) {
                        var s = 0;
                        for (r = 0; r < (this || i$3).length; r++) {
                            var u = (this || i$3).words[r] & o, a = (0 | (this || i$3).words[r]) - u << h;
                            (this || i$3).words[r] = a | s, s = u >>> 26 - h;
                        }
                        s && ((this || i$3).words[r] = s, (this || i$3).length++);
                    }
                    if (0 !== e) {
                        for (r = (this || i$3).length - 1; r >= 0; r--)
                            (this || i$3).words[r + e] = (this || i$3).words[r];
                        for (r = 0; r < e; r++)
                            (this || i$3).words[r] = 0;
                        (this || i$3).length += e;
                    }
                    return this.strip();
                }, o.prototype.ishln = function (t) {
                    return n(0 === (this || i$3).negative), this.iushln(t);
                }, o.prototype.iushrn = function (t, r, h) {
                    var e;
                    n("number" == typeof t && t >= 0), e = r ? (r - r % 26) / 26 : 0;
                    var o = t % 26, s = Math.min((t - o) / 26, (this || i$3).length), u = 67108863 ^ 67108863 >>> o << o, a = h;
                    if (e -= s, e = Math.max(0, e), a) {
                        for (var l = 0; l < s; l++)
                            a.words[l] = (this || i$3).words[l];
                        a.length = s;
                    }
                    if (0 === s)
                        ;
                    else if ((this || i$3).length > s)
                        for ((this || i$3).length -= s, l = 0; l < (this || i$3).length; l++)
                            (this || i$3).words[l] = (this || i$3).words[l + s];
                    else
                        (this || i$3).words[0] = 0, (this || i$3).length = 1;
                    var m = 0;
                    for (l = (this || i$3).length - 1; l >= 0 && (0 !== m || l >= e); l--) {
                        var f = 0 | (this || i$3).words[l];
                        (this || i$3).words[l] = m << 26 - o | f >>> o, m = f & u;
                    }
                    return a && 0 !== m && (a.words[a.length++] = m), 0 === (this || i$3).length && ((this || i$3).words[0] = 0, (this || i$3).length = 1), this.strip();
                }, o.prototype.ishrn = function (t, r, h) {
                    return n(0 === (this || i$3).negative), this.iushrn(t, r, h);
                }, o.prototype.shln = function (t) {
                    return this.clone().ishln(t);
                }, o.prototype.ushln = function (t) {
                    return this.clone().iushln(t);
                }, o.prototype.shrn = function (t) {
                    return this.clone().ishrn(t);
                }, o.prototype.ushrn = function (t) {
                    return this.clone().iushrn(t);
                }, o.prototype.testn = function (t) {
                    n("number" == typeof t && t >= 0);
                    var r = t % 26, h = (t - r) / 26, e = 1 << r;
                    return !((this || i$3).length <= h) && !!((this || i$3).words[h] & e);
                }, o.prototype.imaskn = function (t) {
                    n("number" == typeof t && t >= 0);
                    var r = t % 26, h = (t - r) / 26;
                    if (n(0 === (this || i$3).negative, "imaskn works only with positive numbers"), (this || i$3).length <= h)
                        return this || i$3;
                    if (0 !== r && h++, (this || i$3).length = Math.min(h, (this || i$3).length), 0 !== r) {
                        var e = 67108863 ^ 67108863 >>> r << r;
                        (this || i$3).words[(this || i$3).length - 1] &= e;
                    }
                    return this.strip();
                }, o.prototype.maskn = function (t) {
                    return this.clone().imaskn(t);
                }, o.prototype.iaddn = function (t) {
                    return n("number" == typeof t), n(t < 67108864), t < 0 ? this.isubn(-t) : 0 !== (this || i$3).negative ? 1 === (this || i$3).length && (0 | (this || i$3).words[0]) < t ? ((this || i$3).words[0] = t - (0 | (this || i$3).words[0]), (this || i$3).negative = 0, this || i$3) : ((this || i$3).negative = 0, this.isubn(t), (this || i$3).negative = 1, this || i$3) : this._iaddn(t);
                }, o.prototype._iaddn = function (t) {
                    (this || i$3).words[0] += t;
                    for (var r = 0; r < (this || i$3).length && (this || i$3).words[r] >= 67108864; r++)
                        (this || i$3).words[r] -= 67108864, r === (this || i$3).length - 1 ? (this || i$3).words[r + 1] = 1 : (this || i$3).words[r + 1]++;
                    return (this || i$3).length = Math.max((this || i$3).length, r + 1), this || i$3;
                }, o.prototype.isubn = function (t) {
                    if (n("number" == typeof t), n(t < 67108864), t < 0)
                        return this.iaddn(-t);
                    if (0 !== (this || i$3).negative)
                        return (this || i$3).negative = 0, this.iaddn(t), (this || i$3).negative = 1, this || i$3;
                    if ((this || i$3).words[0] -= t, 1 === (this || i$3).length && (this || i$3).words[0] < 0)
                        (this || i$3).words[0] = -(this || i$3).words[0], (this || i$3).negative = 1;
                    else
                        for (var r = 0; r < (this || i$3).length && (this || i$3).words[r] < 0; r++)
                            (this || i$3).words[r] += 67108864, (this || i$3).words[r + 1] -= 1;
                    return this.strip();
                }, o.prototype.addn = function (t) {
                    return this.clone().iaddn(t);
                }, o.prototype.subn = function (t) {
                    return this.clone().isubn(t);
                }, o.prototype.iabs = function () {
                    return (this || i$3).negative = 0, this || i$3;
                }, o.prototype.abs = function () {
                    return this.clone().iabs();
                }, o.prototype._ishlnsubmul = function (t, r, h) {
                    var e, o, s = t.length + h;
                    this._expand(s);
                    var u = 0;
                    for (e = 0; e < t.length; e++) {
                        o = (0 | (this || i$3).words[e + h]) + u;
                        var a = (0 | t.words[e]) * r;
                        u = ((o -= 67108863 & a) >> 26) - (a / 67108864 | 0), (this || i$3).words[e + h] = 67108863 & o;
                    }
                    for (; e < (this || i$3).length - h; e++)
                        u = (o = (0 | (this || i$3).words[e + h]) + u) >> 26, (this || i$3).words[e + h] = 67108863 & o;
                    if (0 === u)
                        return this.strip();
                    for (n(-1 === u), u = 0, e = 0; e < (this || i$3).length; e++)
                        u = (o = -(0 | (this || i$3).words[e]) + u) >> 26, (this || i$3).words[e] = 67108863 & o;
                    return (this || i$3).negative = 1, this.strip();
                }, o.prototype._wordDiv = function (t, r) {
                    var h = ((this || i$3).length, t.length), n = this.clone(), e = t, s = 0 | e.words[e.length - 1];
                    0 !== (h = 26 - this._countBits(s)) && (e = e.ushln(h), n.iushln(h), s = 0 | e.words[e.length - 1]);
                    var u, a = n.length - e.length;
                    if ("mod" !== r) {
                        (u = new o(null)).length = a + 1, u.words = new Array(u.length);
                        for (var l = 0; l < u.length; l++)
                            u.words[l] = 0;
                    }
                    var m = n.clone()._ishlnsubmul(e, 1, a);
                    0 === m.negative && (n = m, u && (u.words[a] = 1));
                    for (var f = a - 1; f >= 0; f--) {
                        var d = 67108864 * (0 | n.words[e.length + f]) + (0 | n.words[e.length + f - 1]);
                        for (d = Math.min(d / s | 0, 67108863), n._ishlnsubmul(e, d, f); 0 !== n.negative;)
                            d--, n.negative = 0, n._ishlnsubmul(e, 1, f), n.isZero() || (n.negative ^= 1);
                        u && (u.words[f] = d);
                    }
                    return u && u.strip(), n.strip(), "div" !== r && 0 !== h && n.iushrn(h), {
                        div: u || null,
                        mod: n
                    };
                }, o.prototype.divmod = function (t, r, h) {
                    return n(!t.isZero()), this.isZero() ? {
                        div: new o(0),
                        mod: new o(0)
                    } : 0 !== (this || i$3).negative && 0 === t.negative ? (u = this.neg().divmod(t, r), "mod" !== r && (e = u.div.neg()), "div" !== r && (s = u.mod.neg(), h && 0 !== s.negative && s.iadd(t)), {
                        div: e,
                        mod: s
                    }) : 0 === (this || i$3).negative && 0 !== t.negative ? (u = this.divmod(t.neg(), r), "mod" !== r && (e = u.div.neg()), {
                        div: e,
                        mod: u.mod
                    }) : 0 != ((this || i$3).negative & t.negative) ? (u = this.neg().divmod(t.neg(), r), "div" !== r && (s = u.mod.neg(), h && 0 !== s.negative && s.isub(t)), {
                        div: u.div,
                        mod: s
                    }) : t.length > (this || i$3).length || this.cmp(t) < 0 ? {
                        div: new o(0),
                        mod: this || i$3
                    } : 1 === t.length ? "div" === r ? {
                        div: this.divn(t.words[0]),
                        mod: null
                    } : "mod" === r ? {
                        div: null,
                        mod: new o(this.modn(t.words[0]))
                    } : {
                        div: this.divn(t.words[0]),
                        mod: new o(this.modn(t.words[0]))
                    } : this._wordDiv(t, r);
                    var e, s, u;
                }, o.prototype.div = function (t) {
                    return this.divmod(t, "div", !1).div;
                }, o.prototype.mod = function (t) {
                    return this.divmod(t, "mod", !1).mod;
                }, o.prototype.umod = function (t) {
                    return this.divmod(t, "mod", !0).mod;
                }, o.prototype.divRound = function (t) {
                    var i = this.divmod(t);
                    if (i.mod.isZero())
                        return i.div;
                    var r = 0 !== i.div.negative ? i.mod.isub(t) : i.mod, h = t.ushrn(1), n = t.andln(1), e = r.cmp(h);
                    return e < 0 || 1 === n && 0 === e ? i.div : 0 !== i.div.negative ? i.div.isubn(1) : i.div.iaddn(1);
                }, o.prototype.modn = function (t) {
                    n(t <= 67108863);
                    for (var r = (1 << 26) % t, h = 0, e = (this || i$3).length - 1; e >= 0; e--)
                        h = (r * h + (0 | (this || i$3).words[e])) % t;
                    return h;
                }, o.prototype.idivn = function (t) {
                    n(t <= 67108863);
                    for (var r = 0, h = (this || i$3).length - 1; h >= 0; h--) {
                        var e = (0 | (this || i$3).words[h]) + 67108864 * r;
                        (this || i$3).words[h] = e / t | 0, r = e % t;
                    }
                    return this.strip();
                }, o.prototype.divn = function (t) {
                    return this.clone().idivn(t);
                }, o.prototype.egcd = function (t) {
                    n(0 === t.negative), n(!t.isZero());
                    var r = this || i$3, h = t.clone();
                    r = 0 !== r.negative ? r.umod(t) : r.clone();
                    for (var e = new o(1), s = new o(0), u = new o(0), a = new o(1), l = 0; r.isEven() && h.isEven();)
                        r.iushrn(1), h.iushrn(1), ++l;
                    for (var m = h.clone(), f = r.clone(); !r.isZero();) {
                        for (var d = 0, p = 1; 0 == (r.words[0] & p) && d < 26; ++d, p <<= 1)
                            ;
                        if (d > 0)
                            for (r.iushrn(d); d-- > 0;)
                                (e.isOdd() || s.isOdd()) && (e.iadd(m), s.isub(f)), e.iushrn(1), s.iushrn(1);
                        for (var M = 0, v = 1; 0 == (h.words[0] & v) && M < 26; ++M, v <<= 1)
                            ;
                        if (M > 0)
                            for (h.iushrn(M); M-- > 0;)
                                (u.isOdd() || a.isOdd()) && (u.iadd(m), a.isub(f)), u.iushrn(1), a.iushrn(1);
                        r.cmp(h) >= 0 ? (r.isub(h), e.isub(u), s.isub(a)) : (h.isub(r), u.isub(e), a.isub(s));
                    }
                    return {
                        a: u,
                        b: a,
                        gcd: h.iushln(l)
                    };
                }, o.prototype._invmp = function (t) {
                    n(0 === t.negative), n(!t.isZero());
                    var r = this || i$3, h = t.clone();
                    r = 0 !== r.negative ? r.umod(t) : r.clone();
                    for (var e, s = new o(1), u = new o(0), a = h.clone(); r.cmpn(1) > 0 && h.cmpn(1) > 0;) {
                        for (var l = 0, m = 1; 0 == (r.words[0] & m) && l < 26; ++l, m <<= 1)
                            ;
                        if (l > 0)
                            for (r.iushrn(l); l-- > 0;)
                                s.isOdd() && s.iadd(a), s.iushrn(1);
                        for (var f = 0, d = 1; 0 == (h.words[0] & d) && f < 26; ++f, d <<= 1)
                            ;
                        if (f > 0)
                            for (h.iushrn(f); f-- > 0;)
                                u.isOdd() && u.iadd(a), u.iushrn(1);
                        r.cmp(h) >= 0 ? (r.isub(h), s.isub(u)) : (h.isub(r), u.isub(s));
                    }
                    return (e = 0 === r.cmpn(1) ? s : u).cmpn(0) < 0 && e.iadd(t), e;
                }, o.prototype.gcd = function (t) {
                    if (this.isZero())
                        return t.abs();
                    if (t.isZero())
                        return this.abs();
                    var i = this.clone(), r = t.clone();
                    i.negative = 0, r.negative = 0;
                    for (var h = 0; i.isEven() && r.isEven(); h++)
                        i.iushrn(1), r.iushrn(1);
                    for (;;) {
                        for (; i.isEven();)
                            i.iushrn(1);
                        for (; r.isEven();)
                            r.iushrn(1);
                        var n = i.cmp(r);
                        if (n < 0) {
                            var e = i;
                            i = r, r = e;
                        }
                        else if (0 === n || 0 === r.cmpn(1))
                            break;
                        i.isub(r);
                    }
                    return r.iushln(h);
                }, o.prototype.invm = function (t) {
                    return this.egcd(t).a.umod(t);
                }, o.prototype.isEven = function () {
                    return 0 == (1 & (this || i$3).words[0]);
                }, o.prototype.isOdd = function () {
                    return 1 == (1 & (this || i$3).words[0]);
                }, o.prototype.andln = function (t) {
                    return (this || i$3).words[0] & t;
                }, o.prototype.bincn = function (t) {
                    n("number" == typeof t);
                    var r = t % 26, h = (t - r) / 26, e = 1 << r;
                    if ((this || i$3).length <= h)
                        return this._expand(h + 1), (this || i$3).words[h] |= e, this || i$3;
                    for (var o = e, s = h; 0 !== o && s < (this || i$3).length; s++) {
                        var u = 0 | (this || i$3).words[s];
                        o = (u += o) >>> 26, u &= 67108863, (this || i$3).words[s] = u;
                    }
                    return 0 !== o && ((this || i$3).words[s] = o, (this || i$3).length++), this || i$3;
                }, o.prototype.isZero = function () {
                    return 1 === (this || i$3).length && 0 === (this || i$3).words[0];
                }, o.prototype.cmpn = function (t) {
                    var r, h = t < 0;
                    if (0 !== (this || i$3).negative && !h)
                        return -1;
                    if (0 === (this || i$3).negative && h)
                        return 1;
                    if (this.strip(), (this || i$3).length > 1)
                        r = 1;
                    else {
                        h && (t = -t), n(t <= 67108863, "Number is too big");
                        var e = 0 | (this || i$3).words[0];
                        r = e === t ? 0 : e < t ? -1 : 1;
                    }
                    return 0 !== (this || i$3).negative ? 0 | -r : r;
                }, o.prototype.cmp = function (t) {
                    if (0 !== (this || i$3).negative && 0 === t.negative)
                        return -1;
                    if (0 === (this || i$3).negative && 0 !== t.negative)
                        return 1;
                    var r = this.ucmp(t);
                    return 0 !== (this || i$3).negative ? 0 | -r : r;
                }, o.prototype.ucmp = function (t) {
                    if ((this || i$3).length > t.length)
                        return 1;
                    if ((this || i$3).length < t.length)
                        return -1;
                    for (var r = 0, h = (this || i$3).length - 1; h >= 0; h--) {
                        var n = 0 | (this || i$3).words[h], e = 0 | t.words[h];
                        if (n !== e) {
                            n < e ? r = -1 : n > e && (r = 1);
                            break;
                        }
                    }
                    return r;
                }, o.prototype.gtn = function (t) {
                    return 1 === this.cmpn(t);
                }, o.prototype.gt = function (t) {
                    return 1 === this.cmp(t);
                }, o.prototype.gten = function (t) {
                    return this.cmpn(t) >= 0;
                }, o.prototype.gte = function (t) {
                    return this.cmp(t) >= 0;
                }, o.prototype.ltn = function (t) {
                    return -1 === this.cmpn(t);
                }, o.prototype.lt = function (t) {
                    return -1 === this.cmp(t);
                }, o.prototype.lten = function (t) {
                    return this.cmpn(t) <= 0;
                }, o.prototype.lte = function (t) {
                    return this.cmp(t) <= 0;
                }, o.prototype.eqn = function (t) {
                    return 0 === this.cmpn(t);
                }, o.prototype.eq = function (t) {
                    return 0 === this.cmp(t);
                }, o.red = function (t) {
                    return new k(t);
                }, o.prototype.toRed = function (t) {
                    return n(!(this || i$3).red, "Already a number in reduction context"), n(0 === (this || i$3).negative, "red works only with positives"), t.convertTo(this || i$3)._forceRed(t);
                }, o.prototype.fromRed = function () {
                    return n((this || i$3).red, "fromRed works only with numbers in reduction context"), (this || i$3).red.convertFrom(this || i$3);
                }, o.prototype._forceRed = function (t) {
                    return (this || i$3).red = t, this || i$3;
                }, o.prototype.forceRed = function (t) {
                    return n(!(this || i$3).red, "Already a number in reduction context"), this._forceRed(t);
                }, o.prototype.redAdd = function (t) {
                    return n((this || i$3).red, "redAdd works only with red numbers"), (this || i$3).red.add(this || i$3, t);
                }, o.prototype.redIAdd = function (t) {
                    return n((this || i$3).red, "redIAdd works only with red numbers"), (this || i$3).red.iadd(this || i$3, t);
                }, o.prototype.redSub = function (t) {
                    return n((this || i$3).red, "redSub works only with red numbers"), (this || i$3).red.sub(this || i$3, t);
                }, o.prototype.redISub = function (t) {
                    return n((this || i$3).red, "redISub works only with red numbers"), (this || i$3).red.isub(this || i$3, t);
                }, o.prototype.redShl = function (t) {
                    return n((this || i$3).red, "redShl works only with red numbers"), (this || i$3).red.shl(this || i$3, t);
                }, o.prototype.redMul = function (t) {
                    return n((this || i$3).red, "redMul works only with red numbers"), (this || i$3).red._verify2(this || i$3, t), (this || i$3).red.mul(this || i$3, t);
                }, o.prototype.redIMul = function (t) {
                    return n((this || i$3).red, "redMul works only with red numbers"), (this || i$3).red._verify2(this || i$3, t), (this || i$3).red.imul(this || i$3, t);
                }, o.prototype.redSqr = function () {
                    return n((this || i$3).red, "redSqr works only with red numbers"), (this || i$3).red._verify1(this || i$3), (this || i$3).red.sqr(this || i$3);
                }, o.prototype.redISqr = function () {
                    return n((this || i$3).red, "redISqr works only with red numbers"), (this || i$3).red._verify1(this || i$3), (this || i$3).red.isqr(this || i$3);
                }, o.prototype.redSqrt = function () {
                    return n((this || i$3).red, "redSqrt works only with red numbers"), (this || i$3).red._verify1(this || i$3), (this || i$3).red.sqrt(this || i$3);
                }, o.prototype.redInvm = function () {
                    return n((this || i$3).red, "redInvm works only with red numbers"), (this || i$3).red._verify1(this || i$3), (this || i$3).red.invm(this || i$3);
                }, o.prototype.redNeg = function () {
                    return n((this || i$3).red, "redNeg works only with red numbers"), (this || i$3).red._verify1(this || i$3), (this || i$3).red.neg(this || i$3);
                }, o.prototype.redPow = function (t) {
                    return n((this || i$3).red && !t.red, "redPow(normalNum)"), (this || i$3).red._verify1(this || i$3), (this || i$3).red.pow(this || i$3, t);
                };
                var g = {
                    k256: null,
                    p224: null,
                    p192: null,
                    p25519: null
                };
                function c(t, r) {
                    (this || i$3).name = t, (this || i$3).p = new o(r, 16), (this || i$3).n = (this || i$3).p.bitLength(), (this || i$3).k = new o(1).iushln((this || i$3).n).isub((this || i$3).p), (this || i$3).tmp = this._tmp();
                }
                function w() {
                    c.call(this || i$3, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
                }
                function y() {
                    c.call(this || i$3, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
                }
                function b() {
                    c.call(this || i$3, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
                }
                function _() {
                    c.call(this || i$3, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
                }
                function k(t) {
                    if ("string" == typeof t) {
                        var r = o._prime(t);
                        (this || i$3).m = r.p, (this || i$3).prime = r;
                    }
                    else
                        n(t.gtn(1), "modulus must be greater than 1"), (this || i$3).m = t, (this || i$3).prime = null;
                }
                function A(t) {
                    k.call(this || i$3, t), (this || i$3).shift = (this || i$3).m.bitLength(), (this || i$3).shift % 26 != 0 && ((this || i$3).shift += 26 - (this || i$3).shift % 26), (this || i$3).r = new o(1).iushln((this || i$3).shift), (this || i$3).r2 = this.imod((this || i$3).r.sqr()), (this || i$3).rinv = (this || i$3).r._invmp((this || i$3).m), (this || i$3).minv = (this || i$3).rinv.mul((this || i$3).r).isubn(1).div((this || i$3).m), (this || i$3).minv = (this || i$3).minv.umod((this || i$3).r), (this || i$3).minv = (this || i$3).r.sub((this || i$3).minv);
                }
                c.prototype._tmp = function () {
                    var t = new o(null);
                    return t.words = new Array(Math.ceil((this || i$3).n / 13)), t;
                }, c.prototype.ireduce = function (t) {
                    var r, h = t;
                    do {
                        this.split(h, (this || i$3).tmp), r = (h = (h = this.imulK(h)).iadd((this || i$3).tmp)).bitLength();
                    } while (r > (this || i$3).n);
                    var n = r < (this || i$3).n ? -1 : h.ucmp((this || i$3).p);
                    return 0 === n ? (h.words[0] = 0, h.length = 1) : n > 0 ? h.isub((this || i$3).p) : h.strip(), h;
                }, c.prototype.split = function (t, r) {
                    t.iushrn((this || i$3).n, 0, r);
                }, c.prototype.imulK = function (t) {
                    return t.imul((this || i$3).k);
                }, e(w, c), w.prototype.split = function (t, i) {
                    for (var r = Math.min(t.length, 9), h = 0; h < r; h++)
                        i.words[h] = t.words[h];
                    if (i.length = r, t.length <= 9)
                        return t.words[0] = 0, t.length = 1, void 0;
                    var n = t.words[9];
                    for (i.words[i.length++] = 4194303 & n, h = 10; h < t.length; h++) {
                        var e = 0 | t.words[h];
                        t.words[h - 10] = (4194303 & e) << 4 | n >>> 22, n = e;
                    }
                    n >>>= 22, t.words[h - 10] = n, 0 === n && t.length > 10 ? t.length -= 10 : t.length -= 9;
                }, w.prototype.imulK = function (t) {
                    t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
                    for (var i = 0, r = 0; r < t.length; r++) {
                        var h = 0 | t.words[r];
                        i += 977 * h, t.words[r] = 67108863 & i, i = 64 * h + (i / 67108864 | 0);
                    }
                    return 0 === t.words[t.length - 1] && (t.length--, 0 === t.words[t.length - 1] && t.length--), t;
                }, e(y, c), e(b, c), e(_, c), _.prototype.imulK = function (t) {
                    for (var i = 0, r = 0; r < t.length; r++) {
                        var h = 19 * (0 | t.words[r]) + i, n = 67108863 & h;
                        h >>>= 26, t.words[r] = n, i = h;
                    }
                    return 0 !== i && (t.words[t.length++] = i), t;
                }, o._prime = function (t) {
                    if (g[t])
                        return g[t];
                    var i;
                    if ("k256" === t)
                        i = new w();
                    else if ("p224" === t)
                        i = new y();
                    else if ("p192" === t)
                        i = new b();
                    else {
                        if ("p25519" !== t)
                            throw new Error("Unknown prime " + t);
                        i = new _();
                    }
                    return g[t] = i, i;
                }, k.prototype._verify1 = function (t) {
                    n(0 === t.negative, "red works only with positives"), n(t.red, "red works only with red numbers");
                }, k.prototype._verify2 = function (t, i) {
                    n(0 == (t.negative | i.negative), "red works only with positives"), n(t.red && t.red === i.red, "red works only with red numbers");
                }, k.prototype.imod = function (t) {
                    return (this || i$3).prime ? (this || i$3).prime.ireduce(t)._forceRed(this || i$3) : t.umod((this || i$3).m)._forceRed(this || i$3);
                }, k.prototype.neg = function (t) {
                    return t.isZero() ? t.clone() : (this || i$3).m.sub(t)._forceRed(this || i$3);
                }, k.prototype.add = function (t, r) {
                    this._verify2(t, r);
                    var h = t.add(r);
                    return h.cmp((this || i$3).m) >= 0 && h.isub((this || i$3).m), h._forceRed(this || i$3);
                }, k.prototype.iadd = function (t, r) {
                    this._verify2(t, r);
                    var h = t.iadd(r);
                    return h.cmp((this || i$3).m) >= 0 && h.isub((this || i$3).m), h;
                }, k.prototype.sub = function (t, r) {
                    this._verify2(t, r);
                    var h = t.sub(r);
                    return h.cmpn(0) < 0 && h.iadd((this || i$3).m), h._forceRed(this || i$3);
                }, k.prototype.isub = function (t, r) {
                    this._verify2(t, r);
                    var h = t.isub(r);
                    return h.cmpn(0) < 0 && h.iadd((this || i$3).m), h;
                }, k.prototype.shl = function (t, i) {
                    return this._verify1(t), this.imod(t.ushln(i));
                }, k.prototype.imul = function (t, i) {
                    return this._verify2(t, i), this.imod(t.imul(i));
                }, k.prototype.mul = function (t, i) {
                    return this._verify2(t, i), this.imod(t.mul(i));
                }, k.prototype.isqr = function (t) {
                    return this.imul(t, t.clone());
                }, k.prototype.sqr = function (t) {
                    return this.mul(t, t);
                }, k.prototype.sqrt = function (t) {
                    if (t.isZero())
                        return t.clone();
                    var r = (this || i$3).m.andln(3);
                    if (n(r % 2 == 1), 3 === r) {
                        var h = (this || i$3).m.add(new o(1)).iushrn(2);
                        return this.pow(t, h);
                    }
                    for (var e = (this || i$3).m.subn(1), s = 0; !e.isZero() && 0 === e.andln(1);)
                        s++, e.iushrn(1);
                    n(!e.isZero());
                    var u = new o(1).toRed(this || i$3), a = u.redNeg(), l = (this || i$3).m.subn(1).iushrn(1), m = (this || i$3).m.bitLength();
                    for (m = new o(2 * m * m).toRed(this || i$3); 0 !== this.pow(m, l).cmp(a);)
                        m.redIAdd(a);
                    for (var f = this.pow(m, e), d = this.pow(t, e.addn(1).iushrn(1)), p = this.pow(t, e), M = s; 0 !== p.cmp(u);) {
                        for (var v = p, g = 0; 0 !== v.cmp(u); g++)
                            v = v.redSqr();
                        n(g < M);
                        var c = this.pow(f, new o(1).iushln(M - g - 1));
                        d = d.redMul(c), f = c.redSqr(), p = p.redMul(f), M = g;
                    }
                    return d;
                }, k.prototype.invm = function (t) {
                    var r = t._invmp((this || i$3).m);
                    return 0 !== r.negative ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
                }, k.prototype.pow = function (t, r) {
                    if (r.isZero())
                        return new o(1).toRed(this || i$3);
                    if (0 === r.cmpn(1))
                        return t.clone();
                    var h = new Array(16);
                    h[0] = new o(1).toRed(this || i$3), h[1] = t;
                    for (var n = 2; n < h.length; n++)
                        h[n] = this.mul(h[n - 1], t);
                    var e = h[0], s = 0, u = 0, a = r.bitLength() % 26;
                    for (0 === a && (a = 26), n = r.length - 1; n >= 0; n--) {
                        for (var l = r.words[n], m = a - 1; m >= 0; m--) {
                            var f = l >> m & 1;
                            e !== h[0] && (e = this.sqr(e)), 0 !== f || 0 !== s ? (s <<= 1, s |= f, (4 === ++u || 0 === n && 0 === m) && (e = this.mul(e, h[s]), u = 0, s = 0)) : u = 0;
                        }
                        a = 26;
                    }
                    return e;
                }, k.prototype.convertTo = function (t) {
                    var r = t.umod((this || i$3).m);
                    return r === t ? r.clone() : r;
                }, k.prototype.convertFrom = function (t) {
                    var i = t.clone();
                    return i.red = null, i;
                }, o.mont = function (t) {
                    return new A(t);
                }, e(A, k), A.prototype.convertTo = function (t) {
                    return this.imod(t.ushln((this || i$3).shift));
                }, A.prototype.convertFrom = function (t) {
                    var r = this.imod(t.mul((this || i$3).rinv));
                    return r.red = null, r;
                }, A.prototype.imul = function (t, r) {
                    if (t.isZero() || r.isZero())
                        return t.words[0] = 0, t.length = 1, t;
                    var h = t.imul(r), n = h.maskn((this || i$3).shift).mul((this || i$3).minv).imaskn((this || i$3).shift).mul((this || i$3).m), e = h.isub(n).iushrn((this || i$3).shift), o = e;
                    return e.cmp((this || i$3).m) >= 0 ? o = e.isub((this || i$3).m) : e.cmpn(0) < 0 && (o = e.iadd((this || i$3).m)), o._forceRed(this || i$3);
                }, A.prototype.mul = function (t, r) {
                    if (t.isZero() || r.isZero())
                        return new o(0)._forceRed(this || i$3);
                    var h = t.mul(r), n = h.maskn((this || i$3).shift).mul((this || i$3).minv).imaskn((this || i$3).shift).mul((this || i$3).m), e = h.isub(n).iushrn((this || i$3).shift), s = e;
                    return e.cmp((this || i$3).m) >= 0 ? s = e.isub((this || i$3).m) : e.cmpn(0) < 0 && (s = e.iadd((this || i$3).m)), s._forceRed(this || i$3);
                }, A.prototype.invm = function (t) {
                    return this.imod(t._invmp((this || i$3).m).mul((this || i$3).r2))._forceRed(this || i$3);
                };
            }(h$a, r$7);
            n$c = h$a.exports;
            r$8 = Object.freeze({}), n$d = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            if ((t$5 = function (t) {
                return e$a || (e$a = new o$d(null)), e$a.generate(t);
            }).Rand = o$d, o$d.prototype.generate = function (t) {
                return this._rand(t);
            }, o$d.prototype._rand = function (t) {
                if ((this || n$d).rand.getBytes)
                    return (this || n$d).rand.getBytes(t);
                for (var e = new Uint8Array(t), r = 0; r < e.length; r++)
                    e[r] = (this || n$d).rand.getByte();
                return e;
            }, "object" == typeof self)
                self.crypto && self.crypto.getRandomValues ? o$d.prototype._rand = function (t) {
                    var e = new Uint8Array(t);
                    return self.crypto.getRandomValues(e), e;
                } : self.msCrypto && self.msCrypto.getRandomValues ? o$d.prototype._rand = function (t) {
                    var e = new Uint8Array(t);
                    return self.msCrypto.getRandomValues(e), e;
                } : "object" == typeof window && (o$d.prototype._rand = function () {
                    throw new Error("Not implemented yet");
                });
            else
                try {
                    var a$e = r$8;
                    if ("function" != typeof a$e.randomBytes)
                        throw new Error("Not supported");
                    o$d.prototype._rand = function (t) {
                        return a$e.randomBytes(t);
                    };
                }
                catch (t) { }
            f$i = t$5;
            t$6 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, o$e = n$c, a$f = f$i;
            n$e = d$b, d$b.create = function (r) {
                return new d$b(r);
            }, d$b.prototype._randbelow = function (r) {
                var e = r.bitLength(), n = Math.ceil(e / 8);
                do {
                    var a = new o$e((this || t$6).rand.generate(n));
                } while (a.cmp(r) >= 0);
                return a;
            }, d$b.prototype._randrange = function (r, e) {
                var n = e.sub(r);
                return r.add(this._randbelow(n));
            }, d$b.prototype.test = function (r, e, n) {
                var t = r.bitLength(), a = o$e.mont(r), d = new o$e(1).toRed(a);
                e || (e = Math.max(1, t / 48 | 0));
                for (var i = r.subn(1), f = 0; !i.testn(f); f++)
                    ;
                for (var u = r.shrn(f), p = i.toRed(a); e > 0; e--) {
                    var c = this._randrange(new o$e(2), i);
                    n && n(c);
                    var s = c.toRed(a).redPow(u);
                    if (0 !== s.cmp(d) && 0 !== s.cmp(p)) {
                        for (var m = 1; m < f; m++) {
                            if (0 === (s = s.redSqr()).cmp(d))
                                return !1;
                            if (0 === s.cmp(p))
                                break;
                        }
                        if (m === f)
                            return !1;
                    }
                }
                return !0;
            }, d$b.prototype.getDivisor = function (r, e) {
                var n = r.bitLength(), t = o$e.mont(r), a = new o$e(1).toRed(t);
                e || (e = Math.max(1, n / 48 | 0));
                for (var d = r.subn(1), i = 0; !d.testn(i); i++)
                    ;
                for (var f = r.shrn(i), u = d.toRed(t); e > 0; e--) {
                    var p = this._randrange(new o$e(2), d), c = r.gcd(p);
                    if (0 !== c.cmpn(1))
                        return c;
                    var s = p.toRed(t).redPow(f);
                    if (0 !== s.cmp(a) && 0 !== s.cmp(u)) {
                        for (var m = 1; m < i; m++) {
                            if (0 === (s = s.redSqr()).cmp(a))
                                return s.fromRed().subn(1).gcd(r);
                            if (0 === s.cmp(u))
                                break;
                        }
                        if (m === i)
                            return (s = s.redSqr()).fromRed().subn(1).gcd(r);
                    }
                }
                return !1;
            };
            i$4 = n$e;
            d$c = a;
            b$7 = v$9, v$9.simpleSieve = _$9, v$9.fermatTest = g$8;
            r$9 = n$c, t$7 = new r$9(24), n$f = new i$4(), i$5 = new r$9(1), o$f = new r$9(2), p$e = new r$9(5), s$c = (new r$9(16), new r$9(8), new r$9(10)), m$9 = new r$9(3), u$b = (new r$9(7), new r$9(11)), h$b = new r$9(4), w$a = (new r$9(12), null);
            P$2 = b$7, B$5 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, K$2 = buffer_js_3.default.Buffer, R$1 = n$c, S$5 = new i$4(), x$2 = new R$1(24), C$2 = new R$1(11), D$2 = new R$1(10), G$1 = new R$1(3), H$2 = new R$1(7), T$3 = P$2, j$1 = a;
            y$9 = k$7;
            M$4 = {};
            Object.defineProperty(k$7.prototype, "verifyError", {
                enumerable: !0,
                get: function () {
                    return "number" != typeof (this || B$5)._primeCode && ((this || B$5)._primeCode = function (f, e) {
                        var c = e.toString("hex"), a = [c, f.toString(16)].join("_");
                        if (a in M$4)
                            return M$4[a];
                        var b, d = 0;
                        if (f.isEven() || !T$3.simpleSieve || !T$3.fermatTest(f) || !S$5.test(f))
                            return d += 1, d += "02" === c || "05" === c ? 8 : 4, M$4[a] = d, d;
                        switch (S$5.test(f.shrn(1)) || (d += 2), c) {
                            case "02":
                                f.mod(x$2).cmp(C$2) && (d += 8);
                                break;
                            case "05":
                                (b = f.mod(D$2)).cmp(G$1) && b.cmp(H$2) && (d += 8);
                                break;
                            default:
                                d += 4;
                        }
                        return M$4[a] = d, d;
                    }((this || B$5).__prime, (this || B$5).__gen)), (this || B$5)._primeCode;
                }
            }), k$7.prototype.generateKeys = function () {
                return (this || B$5)._priv || ((this || B$5)._priv = new R$1(j$1((this || B$5)._primeLen))), (this || B$5)._pub = (this || B$5)._gen.toRed((this || B$5)._prime).redPow((this || B$5)._priv).fromRed(), this.getPublicKey();
            }, k$7.prototype.computeSecret = function (f) {
                var e = (f = (f = new R$1(f)).toRed((this || B$5)._prime)).redPow((this || B$5)._priv).fromRed(), c = new K$2(e.toArray()), a = this.getPrime();
                if (c.length < a.length) {
                    var b = new K$2(a.length - c.length);
                    b.fill(0), c = K$2.concat([b, c]);
                }
                return c;
            }, k$7.prototype.getPublicKey = function (f) {
                return A$5((this || B$5)._pub, f);
            }, k$7.prototype.getPrivateKey = function (f) {
                return A$5((this || B$5)._priv, f);
            }, k$7.prototype.getPrime = function (f) {
                return A$5((this || B$5).__prime, f);
            }, k$7.prototype.getGenerator = function (f) {
                return A$5((this || B$5)._gen, f);
            }, k$7.prototype.setGenerator = function (f, e) {
                return e = e || "utf8", K$2.isBuffer(f) || (f = new K$2(f, e)), (this || B$5).__gen = f, (this || B$5)._gen = new R$1(f), this || B$5;
            };
            q$1 = y$9, O$3 = {}, z$3 = buffer_js_3.default.Buffer, F$3 = P$2, I$6 = {
                modp1: {
                    gen: "02",
                    prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
                },
                modp2: {
                    gen: "02",
                    prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
                },
                modp5: {
                    gen: "02",
                    prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
                },
                modp14: {
                    gen: "02",
                    prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
                },
                modp15: {
                    gen: "02",
                    prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
                },
                modp16: {
                    gen: "02",
                    prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
                },
                modp17: {
                    gen: "02",
                    prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
                },
                modp18: {
                    gen: "02",
                    prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
                }
            }, J$1 = q$1;
            N$2 = {
                binary: !0,
                hex: !0,
                base64: !0
            };
            O$3.DiffieHellmanGroup = O$3.createDiffieHellmanGroup = O$3.getDiffieHellman = function (f) {
                var e = new z$3(I$6[f].prime, "hex"), c = new z$3(I$6[f].gen, "hex");
                return new J$1(e, c);
            }, O$3.createDiffieHellman = O$3.DiffieHellman = function f(e, c, a, b) {
                return z$3.isBuffer(c) || void 0 === N$2[c] ? f(e, "binary", c, a) : (c = c || "binary", b = b || "binary", a = a || new z$3([2]), z$3.isBuffer(a) || (a = new z$3(a, b)), "number" == typeof e ? new J$1(F$3(e, a), a, !0) : (z$3.isBuffer(e) || (e = new z$3(e, c)), new J$1(e, a, !0)));
            };
            u$c = buffer_js_3.default.Buffer, n$g = n$c, d$d = a;
            m$a = t$8, t$8.getr = i$6;
            l$d = m$a;
            r$a = {}, e$b = r$a;
            e$b.toArray = function (r, e) {
                if (Array.isArray(r))
                    return r.slice();
                if (!r)
                    return [];
                var t = [];
                if ("string" != typeof r) {
                    for (var n = 0; n < r.length; n++)
                        t[n] = 0 | r[n];
                    return t;
                }
                if ("hex" === e) {
                    (r = r.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (r = "0" + r);
                    for (n = 0; n < r.length; n += 2)
                        t.push(parseInt(r[n] + r[n + 1], 16));
                }
                else
                    for (n = 0; n < r.length; n++) {
                        var o = r.charCodeAt(n), u = o >> 8, f = 255 & o;
                        u ? t.push(u, f) : t.push(f);
                    }
                return t;
            }, e$b.zero2 = t$9, e$b.toHex = n$h, e$b.encode = function (r, e) {
                return "hex" === e ? n$h(r) : r;
            };
            n$i = {}, a$g = n$i, i$7 = n$c, o$g = o$7, c$d = r$a;
            a$g.assert = o$g, a$g.toArray = c$d.toArray, a$g.zero2 = c$d.zero2, a$g.toHex = c$d.toHex, a$g.encode = c$d.encode, a$g.getNAF = function (r, t, e) {
                var n = new Array(Math.max(r.bitLength(), e) + 1);
                n.fill(0);
                for (var a = 1 << t + 1, i = r.clone(), o = 0; o < n.length; o++) {
                    var c, s = i.andln(a - 1);
                    i.isOdd() ? (c = s > (a >> 1) - 1 ? (a >> 1) - s : s, i.isubn(c)) : c = 0, n[o] = c, i.iushrn(1);
                }
                return n;
            }, a$g.getJSF = function (r, t) {
                var e = [[], []];
                r = r.clone(), t = t.clone();
                for (var n = 0, a = 0; r.cmpn(-n) > 0 || t.cmpn(-a) > 0;) {
                    var i, o, c, s = r.andln(3) + n & 3, l = t.andln(3) + a & 3;
                    if (3 === s && (s = -1), 3 === l && (l = -1), 0 == (1 & s))
                        i = 0;
                    else
                        i = 3 !== (c = r.andln(7) + n & 7) && 5 !== c || 2 !== l ? s : -s;
                    if (e[0].push(i), 0 == (1 & l))
                        o = 0;
                    else
                        o = 3 !== (c = t.andln(7) + a & 7) && 5 !== c || 2 !== s ? l : -l;
                    e[1].push(o), 2 * n === i + 1 && (n = 1 - n), 2 * a === o + 1 && (a = 1 - a), r.iushrn(1), t.iushrn(1);
                }
                return e;
            }, a$g.cachedProperty = function (r, t, e) {
                var n = "_" + t;
                r.prototype[t] = function () {
                    return void 0 !== this[n] ? this[n] : this[n] = e.call(this);
                };
            }, a$g.parseBytes = function (r) {
                return "string" == typeof r ? a$g.toArray(r, "hex") : r;
            }, a$g.intFromLE = function (r) {
                return new i$7(r, "hex", "le");
            };
            l$e = n$c, u$d = n$i, h$c = u$d.assert;
            s$d = p$f, p$f.prototype._importDER = function (r, t) {
                r = u$d.toArray(r, t);
                var e = new f$j();
                if (48 !== r[e.place++])
                    return !1;
                if (v$a(r, e) + e.place !== r.length)
                    return !1;
                if (2 !== r[e.place++])
                    return !1;
                var n = v$a(r, e), a = r.slice(e.place, n + e.place);
                if (e.place += n, 2 !== r[e.place++])
                    return !1;
                var i = v$a(r, e);
                if (r.length !== i + e.place)
                    return !1;
                var o = r.slice(e.place, i + e.place);
                return 0 === a[0] && 128 & a[1] && (a = a.slice(1)), 0 === o[0] && 128 & o[1] && (o = o.slice(1)), this.r = new l$e(a), this.s = new l$e(o), this.recoveryParam = null, !0;
            }, p$f.prototype.toDER = function (r) {
                var t = this.r.toArray(), e = this.s.toArray();
                for (128 & t[0] && (t = [0].concat(t)), 128 & e[0] && (e = [0].concat(e)), t = m$b(t), e = m$b(e); !(e[0] || 128 & e[1]);)
                    e = e.slice(1);
                var n = [2];
                y$a(n, t.length), (n = n.concat(t)).push(2), y$a(n, e.length);
                var a = n.concat(e), i = [48];
                return y$a(i, a.length), i = i.concat(a), u$d.encode(i, r);
            };
            d$e = s$d;
            r$b = {}, i$8 = o$7, e$c = chunk_dac557ba_js_4.t;
            r$b.inherits = e$c, r$b.toArray = function (t, n) {
                if (Array.isArray(t))
                    return t.slice();
                if (!t)
                    return [];
                var r = [];
                if ("string" == typeof t) {
                    if (n) {
                        if ("hex" === n)
                            for ((t = t.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (t = "0" + t), e = 0; e < t.length; e += 2)
                                r.push(parseInt(t[e] + t[e + 1], 16));
                    }
                    else
                        for (var i = 0, e = 0; e < t.length; e++) {
                            var o = t.charCodeAt(e);
                            o < 128 ? r[i++] = o : o < 2048 ? (r[i++] = o >> 6 | 192, r[i++] = 63 & o | 128) : h$d(t, e) ? (o = 65536 + ((1023 & o) << 10) + (1023 & t.charCodeAt(++e)), r[i++] = o >> 18 | 240, r[i++] = o >> 12 & 63 | 128, r[i++] = o >> 6 & 63 | 128, r[i++] = 63 & o | 128) : (r[i++] = o >> 12 | 224, r[i++] = o >> 6 & 63 | 128, r[i++] = 63 & o | 128);
                        }
                }
                else
                    for (e = 0; e < t.length; e++)
                        r[e] = 0 | t[e];
                return r;
            }, r$b.toHex = function (t) {
                for (var n = "", r = 0; r < t.length; r++)
                    n += u$e(t[r].toString(16));
                return n;
            }, r$b.htonl = o$h, r$b.toHex32 = function (t, n) {
                for (var r = "", i = 0; i < t.length; i++) {
                    var e = t[i];
                    "little" === n && (e = o$h(e)), r += s$e(e.toString(16));
                }
                return r;
            }, r$b.zero2 = u$e, r$b.zero8 = s$e, r$b.join32 = function (t, n, r, e) {
                var h = r - n;
                i$8(h % 4 == 0);
                for (var o = new Array(h / 4), u = 0, s = n; u < o.length; u++, s += 4) {
                    var a;
                    a = "big" === e ? t[s] << 24 | t[s + 1] << 16 | t[s + 2] << 8 | t[s + 3] : t[s + 3] << 24 | t[s + 2] << 16 | t[s + 1] << 8 | t[s], o[u] = a >>> 0;
                }
                return o;
            }, r$b.split32 = function (t, n) {
                for (var r = new Array(4 * t.length), i = 0, e = 0; i < t.length; i++, e += 4) {
                    var h = t[i];
                    "big" === n ? (r[e] = h >>> 24, r[e + 1] = h >>> 16 & 255, r[e + 2] = h >>> 8 & 255, r[e + 3] = 255 & h) : (r[e + 3] = h >>> 24, r[e + 2] = h >>> 16 & 255, r[e + 1] = h >>> 8 & 255, r[e] = 255 & h);
                }
                return r;
            }, r$b.rotr32 = function (t, n) {
                return t >>> n | t << 32 - n;
            }, r$b.rotl32 = function (t, n) {
                return t << n | t >>> 32 - n;
            }, r$b.sum32 = function (t, n) {
                return t + n >>> 0;
            }, r$b.sum32_3 = function (t, n, r) {
                return t + n + r >>> 0;
            }, r$b.sum32_4 = function (t, n, r, i) {
                return t + n + r + i >>> 0;
            }, r$b.sum32_5 = function (t, n, r, i, e) {
                return t + n + r + i + e >>> 0;
            }, r$b.sum64 = function (t, n, r, i) {
                var e = t[n], h = i + t[n + 1] >>> 0, o = (h < i ? 1 : 0) + r + e;
                t[n] = o >>> 0, t[n + 1] = h;
            }, r$b.sum64_hi = function (t, n, r, i) {
                return (n + i >>> 0 < n ? 1 : 0) + t + r >>> 0;
            }, r$b.sum64_lo = function (t, n, r, i) {
                return n + i >>> 0;
            }, r$b.sum64_4_hi = function (t, n, r, i, e, h, o, u) {
                var s = 0, a = n;
                return s += (a = a + i >>> 0) < n ? 1 : 0, s += (a = a + h >>> 0) < h ? 1 : 0, t + r + e + o + (s += (a = a + u >>> 0) < u ? 1 : 0) >>> 0;
            }, r$b.sum64_4_lo = function (t, n, r, i, e, h, o, u) {
                return n + i + h + u >>> 0;
            }, r$b.sum64_5_hi = function (t, n, r, i, e, h, o, u, s, a) {
                var l = 0, g = n;
                return l += (g = g + i >>> 0) < n ? 1 : 0, l += (g = g + h >>> 0) < h ? 1 : 0, l += (g = g + u >>> 0) < u ? 1 : 0, t + r + e + o + s + (l += (g = g + a >>> 0) < a ? 1 : 0) >>> 0;
            }, r$b.sum64_5_lo = function (t, n, r, i, e, h, o, u, s, a) {
                return n + i + h + u + a >>> 0;
            }, r$b.rotr64_hi = function (t, n, r) {
                return (n << 32 - r | t >>> r) >>> 0;
            }, r$b.rotr64_lo = function (t, n, r) {
                return (t << 32 - r | n >>> r) >>> 0;
            }, r$b.shr64_hi = function (t, n, r) {
                return t >>> r;
            }, r$b.shr64_lo = function (t, n, r) {
                return (t << 32 - r | n >>> r) >>> 0;
            };
            a$h = {}, l$f = r$b, g$9 = o$7;
            a$h.BlockHash = c$e, c$e.prototype.update = function (t, n) {
                if (t = l$f.toArray(t, n), this.pending ? this.pending = this.pending.concat(t) : this.pending = t, this.pendingTotal += t.length, this.pending.length >= this._delta8) {
                    var r = (t = this.pending).length % this._delta8;
                    this.pending = t.slice(t.length - r, t.length), 0 === this.pending.length && (this.pending = null), t = l$f.join32(t, 0, t.length - r, this.endian);
                    for (var i = 0; i < t.length; i += this._delta32)
                        this._update(t, i, i + this._delta32);
                }
                return this;
            }, c$e.prototype.digest = function (t) {
                return this.update(this._pad()), g$9(null === this.pending), this._digest(t);
            }, c$e.prototype._pad = function () {
                var t = this.pendingTotal, n = this._delta8, r = n - (t + this.padLength) % n, i = new Array(r + this.padLength);
                i[0] = 128;
                for (var e = 1; e < r; e++)
                    i[e] = 0;
                if (t <<= 3, "big" === this.endian) {
                    for (var h = 8; h < this.padLength; h++)
                        i[e++] = 0;
                    i[e++] = 0, i[e++] = 0, i[e++] = 0, i[e++] = 0, i[e++] = t >>> 24 & 255, i[e++] = t >>> 16 & 255, i[e++] = t >>> 8 & 255, i[e++] = 255 & t;
                }
                else
                    for (i[e++] = 255 & t, i[e++] = t >>> 8 & 255, i[e++] = t >>> 16 & 255, i[e++] = t >>> 24 & 255, i[e++] = 0, i[e++] = 0, i[e++] = 0, i[e++] = 0, h = 8; h < this.padLength; h++)
                        i[e++] = 0;
                return i;
            };
            n$j = r$b, s$f = a$h, o$i = o$7, e$d = n$j.rotr64_hi, u$f = n$j.rotr64_lo, a$i = n$j.shr64_hi, c$f = n$j.shr64_lo, f$k = n$j.sum64, v$b = n$j.sum64_hi, _$a = n$j.sum64_lo, l$g = n$j.sum64_4_hi, p$g = n$j.sum64_4_lo, m$c = n$j.sum64_5_hi, g$a = n$j.sum64_5_lo, k$8 = s$f.BlockHash, d$f = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];
            n$j.inherits(y$b, k$8), r$c = y$b, y$b.blockSize = 1024, y$b.outSize = 512, y$b.hmacStrength = 192, y$b.padLength = 128, y$b.prototype._prepareBlock = function (t, h) {
                for (var i = this.W, r = 0; r < 32; r++)
                    i[r] = t[h + r];
                for (; r < i.length; r += 2) {
                    var n = L$2(i[r - 4], i[r - 3]), s = q$2(i[r - 4], i[r - 3]), o = i[r - 14], e = i[r - 13], u = j$2(i[r - 30], i[r - 29]), a = A$6(i[r - 30], i[r - 29]), c = i[r - 32], f = i[r - 31];
                    i[r] = l$g(n, s, o, e, u, a, c, f), i[r + 1] = p$g(n, s, o, e, u, a, c, f);
                }
            }, y$b.prototype._update = function (t, h) {
                this._prepareBlock(t, h);
                var i = this.W, r = this.h[0], n = this.h[1], s = this.h[2], e = this.h[3], u = this.h[4], a = this.h[5], c = this.h[6], l = this.h[7], p = this.h[8], k = this.h[9], d = this.h[10], y = this.h[11], j = this.h[12], A = this.h[13], L = this.h[14], q = this.h[15];
                o$i(this.k.length === i.length);
                for (var C = 0; C < i.length; C += 2) {
                    var D = L, E = q, F = z$4(p, k), G = H$3(p, k), I = b$8(p, k, d, y, j), J = x$3(p, k, d, y, j, A), K = this.k[C], M = this.k[C + 1], N = i[C], O = i[C + 1], P = m$c(D, E, F, G, I, J, K, M, N, O), Q = g$a(D, E, F, G, I, J, K, M, N, O);
                    D = W$1(r, n), E = w$b(r, n), F = B$6(r, n, s, e, u), G = S$6(r, n, s, e, u, a);
                    var R = v$b(D, E, F, G), T = _$a(D, E, F, G);
                    L = j, q = A, j = d, A = y, d = p, y = k, p = v$b(c, l, P, Q), k = _$a(l, l, P, Q), c = u, l = a, u = s, a = e, s = r, e = n, r = v$b(P, Q, R, T), n = _$a(P, Q, R, T);
                }
                f$k(this.h, 0, r, n), f$k(this.h, 2, s, e), f$k(this.h, 4, u, a), f$k(this.h, 6, c, l), f$k(this.h, 8, p, k), f$k(this.h, 10, d, y), f$k(this.h, 12, j, A), f$k(this.h, 14, L, q);
            }, y$b.prototype._digest = function (t) {
                return "hex" === t ? n$j.toHex32(this.h, "big") : n$j.split32(this.h, "big");
            };
            C$3 = r$c;
            s$g = {}, n$k = r$b.rotr32;
            s$g.ft_1 = function (t, h, i, s) {
                return 0 === t ? r$d(h, i, s) : 1 === t || 3 === t ? o$j(h, i, s) : 2 === t ? e$e(h, i, s) : void 0;
            }, s$g.ch32 = r$d, s$g.maj32 = e$e, s$g.p32 = o$j, s$g.s0_256 = function (t) {
                return n$k(t, 2) ^ n$k(t, 13) ^ n$k(t, 22);
            }, s$g.s1_256 = function (t) {
                return n$k(t, 6) ^ n$k(t, 11) ^ n$k(t, 25);
            }, s$g.g0_256 = function (t) {
                return n$k(t, 7) ^ n$k(t, 18) ^ t >>> 3;
            }, s$g.g1_256 = function (t) {
                return n$k(t, 17) ^ n$k(t, 19) ^ t >>> 10;
            };
            a$j = r$b, c$g = a$h, f$l = s$g, _$b = o$7, g$b = a$j.sum32, m$d = a$j.sum32_4, p$h = a$j.sum32_5, l$h = f$l.ch32, v$c = f$l.maj32, d$g = f$l.s0_256, k$9 = f$l.s1_256, b$9 = f$l.g0_256, j$3 = f$l.g1_256, x$4 = c$g.BlockHash, y$c = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
            a$j.inherits(S$7, x$4), u$g = S$7, S$7.blockSize = 512, S$7.outSize = 256, S$7.hmacStrength = 192, S$7.padLength = 64, S$7.prototype._update = function (t, h) {
                for (var i = this.W, s = 0; s < 16; s++)
                    i[s] = t[h + s];
                for (; s < i.length; s++)
                    i[s] = m$d(j$3(i[s - 2]), i[s - 7], b$9(i[s - 15]), i[s - 16]);
                var n = this.h[0], r = this.h[1], e = this.h[2], o = this.h[3], u = this.h[4], a = this.h[5], c = this.h[6], f = this.h[7];
                for (_$b(this.k.length === i.length), s = 0; s < i.length; s++) {
                    var x = p$h(f, k$9(u), l$h(u, a, c), this.k[s], i[s]), y = g$b(d$g(n), v$c(n, r, e));
                    f = c, c = a, a = u, u = g$b(o, x), o = e, e = r, r = n, n = g$b(x, y);
                }
                this.h[0] = g$b(this.h[0], n), this.h[1] = g$b(this.h[1], r), this.h[2] = g$b(this.h[2], e), this.h[3] = g$b(this.h[3], o), this.h[4] = g$b(this.h[4], u), this.h[5] = g$b(this.h[5], a), this.h[6] = g$b(this.h[6], c), this.h[7] = g$b(this.h[7], f);
            }, S$7.prototype._digest = function (t) {
                return "hex" === t ? a$j.toHex32(this.h, "big") : a$j.split32(this.h, "big");
            };
            w$c = u$g;
            o$k = r$b, a$k = a$h, u$h = s$g, l$i = o$k.rotl32, c$h = o$k.sum32, p$i = o$k.sum32_5, f$m = u$h.ft_1, g$c = a$k.BlockHash, d$h = [1518500249, 1859775393, 2400959708, 3395469782];
            o$k.inherits(m$e, g$c), r$e = m$e, m$e.blockSize = 512, m$e.outSize = 160, m$e.hmacStrength = 80, m$e.padLength = 64, m$e.prototype._update = function (t, h) {
                for (var i = this.W, s = 0; s < 16; s++)
                    i[s] = t[h + s];
                for (; s < i.length; s++)
                    i[s] = l$i(i[s - 3] ^ i[s - 8] ^ i[s - 14] ^ i[s - 16], 1);
                var e = this.h[0], n = this.h[1], r = this.h[2], o = this.h[3], a = this.h[4];
                for (s = 0; s < i.length; s++) {
                    var u = ~~(s / 20), g = p$i(l$i(e, 5), f$m(u, n, r, o), a, i[s], d$h[u]);
                    a = o, o = r, r = l$i(n, 30), n = e, e = g;
                }
                this.h[0] = c$h(this.h[0], e), this.h[1] = c$h(this.h[1], n), this.h[2] = c$h(this.h[2], r), this.h[3] = c$h(this.h[3], o), this.h[4] = c$h(this.h[4], a);
            }, m$e.prototype._digest = function (t) {
                return "hex" === t ? o$k.toHex32(this.h, "big") : o$k.split32(this.h, "big");
            };
            _$c = r$e, b$a = r$b, z$5 = w$c;
            b$a.inherits(v$d, z$5), S$8 = v$d, v$d.blockSize = 512, v$d.outSize = 224, v$d.hmacStrength = 192, v$d.padLength = 64, v$d.prototype._digest = function (t) {
                return "hex" === t ? b$a.toHex32(this.h.slice(0, 7), "big") : b$a.split32(this.h.slice(0, 7), "big");
            };
            y$d = S$8, H$4 = r$b, w$d = C$3;
            H$4.inherits(x$5, w$d), k$a = x$5, x$5.blockSize = 1024, x$5.outSize = 384, x$5.hmacStrength = 192, x$5.padLength = 128, x$5.prototype._digest = function (t) {
                return "hex" === t ? H$4.toHex32(this.h.slice(0, 12), "big") : H$4.split32(this.h.slice(0, 12), "big");
            };
            L$3 = k$a, j$4 = {};
            j$4.sha1 = _$c, j$4.sha224 = y$d, j$4.sha256 = w$c, j$4.sha384 = L$3, j$4.sha512 = C$3;
            A$7 = {}, B$7 = r$b, W$2 = a$h, q$3 = B$7.rotl32, C$4 = B$7.sum32, D$3 = B$7.sum32_3, E$7 = B$7.sum32_4, F$4 = W$2.BlockHash;
            B$7.inherits(G$2, F$4), A$7.ripemd160 = G$2, G$2.blockSize = 512, G$2.outSize = 160, G$2.hmacStrength = 192, G$2.padLength = 64, G$2.prototype._update = function (t, h) {
                for (var i = this.h[0], s = this.h[1], e = this.h[2], n = this.h[3], r = this.h[4], o = i, a = s, u = e, l = n, c = r, p = 0; p < 80; p++) {
                    var f = C$4(q$3(E$7(i, I$7(p, s, e, n), t[N$3[p] + h], J$2(p)), P$3[p]), r);
                    i = r, r = n, n = q$3(e, 10), e = s, s = f, f = C$4(q$3(E$7(o, I$7(79 - p, a, u, l), t[O$4[p] + h], K$3(p)), Q$1[p]), c), o = c, c = l, l = q$3(u, 10), u = a, a = f;
                }
                f = D$3(this.h[1], e, l), this.h[1] = D$3(this.h[2], n, c), this.h[2] = D$3(this.h[3], r, o), this.h[3] = D$3(this.h[4], i, a), this.h[4] = D$3(this.h[0], s, u), this.h[0] = f;
            }, G$2.prototype._digest = function (t) {
                return "hex" === t ? B$7.toHex32(this.h, "little") : B$7.split32(this.h, "little");
            };
            N$3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13], O$4 = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11], P$3 = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6], Q$1 = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11], R$2 = r$b, T$4 = o$7;
            M$5 = U$5, U$5.prototype._init = function (t) {
                t.length > this.blockSize && (t = new this.Hash().update(t).digest()), T$4(t.length <= this.blockSize);
                for (var h = t.length; h < this.blockSize; h++)
                    t.push(0);
                for (h = 0; h < t.length; h++)
                    t[h] ^= 54;
                for (this.inner = new this.Hash().update(t), h = 0; h < t.length; h++)
                    t[h] ^= 106;
                this.outer = new this.Hash().update(t);
            }, U$5.prototype.update = function (t, h) {
                return this.inner.update(t, h), this;
            }, U$5.prototype.digest = function (t) {
                return this.outer.update(this.inner.digest()), this.outer.digest(t);
            };
            V$2 = M$5, X$2 = {}, Y$1 = X$2;
            Y$1.utils = r$b, Y$1.common = a$h, Y$1.sha = j$4, Y$1.ripemd = A$7, Y$1.hmac = V$2, Y$1.sha1 = Y$1.sha.sha1, Y$1.sha256 = Y$1.sha.sha256, Y$1.sha224 = Y$1.sha.sha224, Y$1.sha384 = Y$1.sha.sha384, Y$1.sha512 = Y$1.sha.sha512, Y$1.ripemd160 = Y$1.ripemd.ripemd160;
            h$e = X$2, r$f = r$a, n$l = o$7;
            s$h = o$l, o$l.prototype._init = function (t, e, i) {
                var s = t.concat(e).concat(i);
                this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
                for (var h = 0; h < this.V.length; h++)
                    this.K[h] = 0, this.V[h] = 1;
                this._update(s), this._reseed = 1, this.reseedInterval = 281474976710656;
            }, o$l.prototype._hmac = function () {
                return new h$e.hmac(this.hash, this.K);
            }, o$l.prototype._update = function (t) {
                var e = this._hmac().update(this.V).update([0]);
                t && (e = e.update(t)), this.K = e.digest(), this.V = this._hmac().update(this.V).digest(), t && (this.K = this._hmac().update(this.V).update([1]).update(t).digest(), this.V = this._hmac().update(this.V).digest());
            }, o$l.prototype.reseed = function (t, e, i, s) {
                "string" != typeof e && (s = i, i = e, e = null), t = r$f.toArray(t, e), i = r$f.toArray(i, s), n$l(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(t.concat(i || [])), this._reseed = 1;
            }, o$l.prototype.generate = function (t, e, i, s) {
                if (this._reseed > this.reseedInterval)
                    throw new Error("Reseed is required");
                "string" != typeof e && (s = i, i = e, e = null), i && (i = r$f.toArray(i, s || "hex"), this._update(i));
                for (var h = []; h.length < t;)
                    this.V = this._hmac().update(this.V).digest(), h = h.concat(this.V);
                var n = h.slice(0, t);
                return this._update(i), this._reseed++, r$f.encode(n, e);
            };
            a$l = s$h;
            i$9 = n$c, n$m = n$i, s$i = n$m.getNAF, o$m = n$m.getJSF, u$i = n$m.assert;
            b$b = h$f, h$f.prototype.point = function () {
                throw new Error("Not implemented");
            }, h$f.prototype.validate = function () {
                throw new Error("Not implemented");
            }, h$f.prototype._fixedNafMul = function (e, f) {
                u$i(e.precomputed);
                var d = e._getDoubles(), c = s$i(f, 1, this._bitLength), t = (1 << d.step + 1) - (d.step % 2 == 0 ? 2 : 1);
                t /= 3;
                for (var a = [], r = 0; r < c.length; r += d.step) {
                    var b = 0;
                    for (f = r + d.step - 1; f >= r; f--)
                        b = (b << 1) + c[f];
                    a.push(b);
                }
                for (var i = this.jpoint(null, null, null), n = this.jpoint(null, null, null), o = t; o > 0; o--) {
                    for (r = 0; r < a.length; r++) {
                        (b = a[r]) === o ? n = n.mixedAdd(d.points[r]) : b === -o && (n = n.mixedAdd(d.points[r].neg()));
                    }
                    i = i.add(n);
                }
                return i.toP();
            }, h$f.prototype._wnafMul = function (e, f) {
                var d = 4, c = e._getNAFPoints(d);
                d = c.wnd;
                for (var t = c.points, a = s$i(f, d, this._bitLength), r = this.jpoint(null, null, null), b = a.length - 1; b >= 0; b--) {
                    for (f = 0; b >= 0 && 0 === a[b]; b--)
                        f++;
                    if (b >= 0 && f++, r = r.dblp(f), b < 0)
                        break;
                    var i = a[b];
                    u$i(0 !== i), r = "affine" === e.type ? i > 0 ? r.mixedAdd(t[i - 1 >> 1]) : r.mixedAdd(t[-i - 1 >> 1].neg()) : i > 0 ? r.add(t[i - 1 >> 1]) : r.add(t[-i - 1 >> 1].neg());
                }
                return "affine" === e.type ? r.toP() : r;
            }, h$f.prototype._wnafMulAdd = function (e, f, d, c, t) {
                for (var a = this._wnafT1, r = this._wnafT2, b = this._wnafT3, i = 0, n = 0; n < c; n++) {
                    var u = (x = f[n])._getNAFPoints(e);
                    a[n] = u.wnd, r[n] = u.points;
                }
                for (n = c - 1; n >= 1; n -= 2) {
                    var h = n - 1, p = n;
                    if (1 === a[h] && 1 === a[p]) {
                        var l = [f[h], null, null, f[p]];
                        0 === f[h].y.cmp(f[p].y) ? (l[1] = f[h].add(f[p]), l[2] = f[h].toJ().mixedAdd(f[p].neg())) : 0 === f[h].y.cmp(f[p].y.redNeg()) ? (l[1] = f[h].toJ().mixedAdd(f[p]), l[2] = f[h].add(f[p].neg())) : (l[1] = f[h].toJ().mixedAdd(f[p]), l[2] = f[h].toJ().mixedAdd(f[p].neg()));
                        var v = [-3, -1, -5, -7, 0, 7, 5, 1, 3], y = o$m(d[h], d[p]);
                        i = Math.max(y[0].length, i), b[h] = new Array(i), b[p] = new Array(i);
                        for (var m = 0; m < i; m++) {
                            var S = 0 | y[0][m], g = 0 | y[1][m];
                            b[h][m] = v[3 * (S + 1) + (g + 1)], b[p][m] = 0, r[h] = l;
                        }
                    }
                    else
                        b[h] = s$i(d[h], a[h], this._bitLength), b[p] = s$i(d[p], a[p], this._bitLength), i = Math.max(b[h].length, i), i = Math.max(b[p].length, i);
                }
                var A = this.jpoint(null, null, null), I = this._wnafT4;
                for (n = i; n >= 0; n--) {
                    for (var w = 0; n >= 0;) {
                        var M = !0;
                        for (m = 0; m < c; m++)
                            I[m] = 0 | b[m][n], 0 !== I[m] && (M = !1);
                        if (!M)
                            break;
                        w++, n--;
                    }
                    if (n >= 0 && w++, A = A.dblp(w), n < 0)
                        break;
                    for (m = 0; m < c; m++) {
                        var x, _ = I[m];
                        0 !== _ && (_ > 0 ? x = r[m][_ - 1 >> 1] : _ < 0 && (x = r[m][-_ - 1 >> 1].neg()), A = "affine" === x.type ? A.mixedAdd(x) : A.add(x));
                    }
                }
                for (n = 0; n < c; n++)
                    r[n] = null;
                return t ? A : A.toP();
            }, h$f.BasePoint = p$j, p$j.prototype.eq = function () {
                throw new Error("Not implemented");
            }, p$j.prototype.validate = function () {
                return this.curve.validate(this);
            }, h$f.prototype.decodePoint = function (e, f) {
                e = n$m.toArray(e, f);
                var d = this.p.byteLength();
                if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * d)
                    return 6 === e[0] ? u$i(e[e.length - 1] % 2 == 0) : 7 === e[0] && u$i(e[e.length - 1] % 2 == 1), this.point(e.slice(1, 1 + d), e.slice(1 + d, 1 + 2 * d));
                if ((2 === e[0] || 3 === e[0]) && e.length - 1 === d)
                    return this.pointFromX(e.slice(1, 1 + d), 3 === e[0]);
                throw new Error("Unknown point format");
            }, p$j.prototype.encodeCompressed = function (e) {
                return this.encode(e, !0);
            }, p$j.prototype._encode = function (e) {
                var f = this.curve.p.byteLength(), d = this.getX().toArray("be", f);
                return e ? [this.getY().isEven() ? 2 : 3].concat(d) : [4].concat(d, this.getY().toArray("be", f));
            }, p$j.prototype.encode = function (e, f) {
                return n$m.encode(this._encode(f), e);
            }, p$j.prototype.precompute = function (e) {
                if (this.precomputed)
                    return this;
                var f = {
                    doubles: null,
                    naf: null,
                    beta: null
                };
                return f.naf = this._getNAFPoints(8), f.doubles = this._getDoubles(4, e), f.beta = this._getBeta(), this.precomputed = f, this;
            }, p$j.prototype._hasDoubles = function (e) {
                if (!this.precomputed)
                    return !1;
                var f = this.precomputed.doubles;
                return !!f && f.points.length >= Math.ceil((e.bitLength() + 1) / f.step);
            }, p$j.prototype._getDoubles = function (e, f) {
                if (this.precomputed && this.precomputed.doubles)
                    return this.precomputed.doubles;
                for (var d = [this], c = this, t = 0; t < f; t += e) {
                    for (var a = 0; a < e; a++)
                        c = c.dbl();
                    d.push(c);
                }
                return {
                    step: e,
                    points: d
                };
            }, p$j.prototype._getNAFPoints = function (e) {
                if (this.precomputed && this.precomputed.naf)
                    return this.precomputed.naf;
                for (var f = [this], d = (1 << e) - 1, c = 1 === d ? null : this.dbl(), t = 1; t < d; t++)
                    f[t] = f[t - 1].add(c);
                return {
                    wnd: e,
                    points: f
                };
            }, p$j.prototype._getBeta = function () {
                return null;
            }, p$j.prototype.dblp = function (e) {
                for (var f = this, d = 0; d < e; d++)
                    f = f.dbl();
                return f;
            };
            v$e = b$b, y$e = n$c, m$f = chunk_dac557ba_js_4.t, S$9 = v$e, g$d = n$i.assert;
            m$f(A$8, S$9), l$j = A$8, A$8.prototype._getEndomorphism = function (e) {
                if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
                    var f, d;
                    if (e.beta)
                        f = new y$e(e.beta, 16).toRed(this.red);
                    else {
                        var c = this._getEndoRoots(this.p);
                        f = (f = c[0].cmp(c[1]) < 0 ? c[0] : c[1]).toRed(this.red);
                    }
                    if (e.lambda)
                        d = new y$e(e.lambda, 16);
                    else {
                        var t = this._getEndoRoots(this.n);
                        0 === this.g.mul(t[0]).x.cmp(this.g.x.redMul(f)) ? d = t[0] : (d = t[1], g$d(0 === this.g.mul(d).x.cmp(this.g.x.redMul(f))));
                    }
                    return {
                        beta: f,
                        lambda: d,
                        basis: e.basis ? e.basis.map(function (e) {
                            return {
                                a: new y$e(e.a, 16),
                                b: new y$e(e.b, 16)
                            };
                        }) : this._getEndoBasis(d)
                    };
                }
            }, A$8.prototype._getEndoRoots = function (e) {
                var f = e === this.p ? this.red : y$e.mont(e), d = new y$e(2).toRed(f).redInvm(), c = d.redNeg(), t = new y$e(3).toRed(f).redNeg().redSqrt().redMul(d);
                return [c.redAdd(t).fromRed(), c.redSub(t).fromRed()];
            }, A$8.prototype._getEndoBasis = function (e) {
                for (var f, d, c, t, a, r, b, i, n, s = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), o = e, u = this.n.clone(), h = new y$e(1), p = new y$e(0), l = new y$e(0), v = new y$e(1), m = 0; 0 !== o.cmpn(0);) {
                    var S = u.div(o);
                    i = u.sub(S.mul(o)), n = l.sub(S.mul(h));
                    var g = v.sub(S.mul(p));
                    if (!c && i.cmp(s) < 0)
                        f = b.neg(), d = h, c = i.neg(), t = n;
                    else if (c && 2 == ++m)
                        break;
                    b = i, u = o, o = i, l = h, h = n, v = p, p = g;
                }
                a = i.neg(), r = n;
                var A = c.sqr().add(t.sqr());
                return a.sqr().add(r.sqr()).cmp(A) >= 0 && (a = f, r = d), c.negative && (c = c.neg(), t = t.neg()), a.negative && (a = a.neg(), r = r.neg()), [{
                        a: c,
                        b: t
                    }, {
                        a,
                        b: r
                    }];
            }, A$8.prototype._endoSplit = function (e) {
                var f = this.endo.basis, d = f[0], c = f[1], t = c.b.mul(e).divRound(this.n), a = d.b.neg().mul(e).divRound(this.n), r = t.mul(d.a), b = a.mul(c.a), i = t.mul(d.b), n = a.mul(c.b);
                return {
                    k1: e.sub(r).sub(b),
                    k2: i.add(n).neg()
                };
            }, A$8.prototype.pointFromX = function (e, f) {
                (e = new y$e(e, 16)).red || (e = e.toRed(this.red));
                var d = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b), c = d.redSqrt();
                if (0 !== c.redSqr().redSub(d).cmp(this.zero))
                    throw new Error("invalid point");
                var t = c.fromRed().isOdd();
                return (f && !t || !f && t) && (c = c.redNeg()), this.point(e, c);
            }, A$8.prototype.validate = function (e) {
                if (e.inf)
                    return !0;
                var f = e.x, d = e.y, c = this.a.redMul(f), t = f.redSqr().redMul(f).redIAdd(c).redIAdd(this.b);
                return 0 === d.redSqr().redISub(t).cmpn(0);
            }, A$8.prototype._endoWnafMulAdd = function (e, f, d) {
                for (var c = this._endoWnafT1, t = this._endoWnafT2, a = 0; a < e.length; a++) {
                    var r = this._endoSplit(f[a]), b = e[a], i = b._getBeta();
                    r.k1.negative && (r.k1.ineg(), b = b.neg(!0)), r.k2.negative && (r.k2.ineg(), i = i.neg(!0)), c[2 * a] = b, c[2 * a + 1] = i, t[2 * a] = r.k1, t[2 * a + 1] = r.k2;
                }
                for (var n = this._wnafMulAdd(1, c, t, 2 * a, d), s = 0; s < 2 * a; s++)
                    c[s] = null, t[s] = null;
                return n;
            }, m$f(I$8, S$9.BasePoint), A$8.prototype.point = function (e, f, d) {
                return new I$8(this, e, f, d);
            }, A$8.prototype.pointFromJSON = function (e, f) {
                return I$8.fromJSON(this, e, f);
            }, I$8.prototype._getBeta = function () {
                if (this.curve.endo) {
                    var e = this.precomputed;
                    if (e && e.beta)
                        return e.beta;
                    var f = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
                    if (e) {
                        var d = this.curve, c = function (e) {
                            return d.point(e.x.redMul(d.endo.beta), e.y);
                        };
                        e.beta = f, f.precomputed = {
                            beta: null,
                            naf: e.naf && {
                                wnd: e.naf.wnd,
                                points: e.naf.points.map(c)
                            },
                            doubles: e.doubles && {
                                step: e.doubles.step,
                                points: e.doubles.points.map(c)
                            }
                        };
                    }
                    return f;
                }
            }, I$8.prototype.toJSON = function () {
                return this.precomputed ? [this.x, this.y, this.precomputed && {
                        doubles: this.precomputed.doubles && {
                            step: this.precomputed.doubles.step,
                            points: this.precomputed.doubles.points.slice(1)
                        },
                        naf: this.precomputed.naf && {
                            wnd: this.precomputed.naf.wnd,
                            points: this.precomputed.naf.points.slice(1)
                        }
                    }] : [this.x, this.y];
            }, I$8.fromJSON = function (e, f, d) {
                "string" == typeof f && (f = JSON.parse(f));
                var c = e.point(f[0], f[1], d);
                if (!f[2])
                    return c;
                function t(f) {
                    return e.point(f[0], f[1], d);
                }
                var a = f[2];
                return c.precomputed = {
                    beta: null,
                    doubles: a.doubles && {
                        step: a.doubles.step,
                        points: [c].concat(a.doubles.points.map(t))
                    },
                    naf: a.naf && {
                        wnd: a.naf.wnd,
                        points: [c].concat(a.naf.points.map(t))
                    }
                }, c;
            }, I$8.prototype.inspect = function () {
                return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
            }, I$8.prototype.isInfinity = function () {
                return this.inf;
            }, I$8.prototype.add = function (e) {
                if (this.inf)
                    return e;
                if (e.inf)
                    return this;
                if (this.eq(e))
                    return this.dbl();
                if (this.neg().eq(e))
                    return this.curve.point(null, null);
                if (0 === this.x.cmp(e.x))
                    return this.curve.point(null, null);
                var f = this.y.redSub(e.y);
                0 !== f.cmpn(0) && (f = f.redMul(this.x.redSub(e.x).redInvm()));
                var d = f.redSqr().redISub(this.x).redISub(e.x), c = f.redMul(this.x.redSub(d)).redISub(this.y);
                return this.curve.point(d, c);
            }, I$8.prototype.dbl = function () {
                if (this.inf)
                    return this;
                var e = this.y.redAdd(this.y);
                if (0 === e.cmpn(0))
                    return this.curve.point(null, null);
                var f = this.curve.a, d = this.x.redSqr(), c = e.redInvm(), t = d.redAdd(d).redIAdd(d).redIAdd(f).redMul(c), a = t.redSqr().redISub(this.x.redAdd(this.x)), r = t.redMul(this.x.redSub(a)).redISub(this.y);
                return this.curve.point(a, r);
            }, I$8.prototype.getX = function () {
                return this.x.fromRed();
            }, I$8.prototype.getY = function () {
                return this.y.fromRed();
            }, I$8.prototype.mul = function (e) {
                return e = new y$e(e, 16), this.isInfinity() ? this : this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e]) : this.curve._wnafMul(this, e);
            }, I$8.prototype.mulAdd = function (e, f, d) {
                var c = [this, f], t = [e, d];
                return this.curve.endo ? this.curve._endoWnafMulAdd(c, t) : this.curve._wnafMulAdd(1, c, t, 2);
            }, I$8.prototype.jmulAdd = function (e, f, d) {
                var c = [this, f], t = [e, d];
                return this.curve.endo ? this.curve._endoWnafMulAdd(c, t, !0) : this.curve._wnafMulAdd(1, c, t, 2, !0);
            }, I$8.prototype.eq = function (e) {
                return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y));
            }, I$8.prototype.neg = function (e) {
                if (this.inf)
                    return this;
                var f = this.curve.point(this.x, this.y.redNeg());
                if (e && this.precomputed) {
                    var d = this.precomputed, c = function (e) {
                        return e.neg();
                    };
                    f.precomputed = {
                        naf: d.naf && {
                            wnd: d.naf.wnd,
                            points: d.naf.points.map(c)
                        },
                        doubles: d.doubles && {
                            step: d.doubles.step,
                            points: d.doubles.points.map(c)
                        }
                    };
                }
                return f;
            }, I$8.prototype.toJ = function () {
                return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one);
            }, m$f(w$e, S$9.BasePoint), A$8.prototype.jpoint = function (e, f, d) {
                return new w$e(this, e, f, d);
            }, w$e.prototype.toP = function () {
                if (this.isInfinity())
                    return this.curve.point(null, null);
                var e = this.z.redInvm(), f = e.redSqr(), d = this.x.redMul(f), c = this.y.redMul(f).redMul(e);
                return this.curve.point(d, c);
            }, w$e.prototype.neg = function () {
                return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
            }, w$e.prototype.add = function (e) {
                if (this.isInfinity())
                    return e;
                if (e.isInfinity())
                    return this;
                var f = e.z.redSqr(), d = this.z.redSqr(), c = this.x.redMul(f), t = e.x.redMul(d), a = this.y.redMul(f.redMul(e.z)), r = e.y.redMul(d.redMul(this.z)), b = c.redSub(t), i = a.redSub(r);
                if (0 === b.cmpn(0))
                    return 0 !== i.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
                var n = b.redSqr(), s = n.redMul(b), o = c.redMul(n), u = i.redSqr().redIAdd(s).redISub(o).redISub(o), h = i.redMul(o.redISub(u)).redISub(a.redMul(s)), p = this.z.redMul(e.z).redMul(b);
                return this.curve.jpoint(u, h, p);
            }, w$e.prototype.mixedAdd = function (e) {
                if (this.isInfinity())
                    return e.toJ();
                if (e.isInfinity())
                    return this;
                var f = this.z.redSqr(), d = this.x, c = e.x.redMul(f), t = this.y, a = e.y.redMul(f).redMul(this.z), r = d.redSub(c), b = t.redSub(a);
                if (0 === r.cmpn(0))
                    return 0 !== b.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
                var i = r.redSqr(), n = i.redMul(r), s = d.redMul(i), o = b.redSqr().redIAdd(n).redISub(s).redISub(s), u = b.redMul(s.redISub(o)).redISub(t.redMul(n)), h = this.z.redMul(r);
                return this.curve.jpoint(o, u, h);
            }, w$e.prototype.dblp = function (e) {
                if (0 === e)
                    return this;
                if (this.isInfinity())
                    return this;
                if (!e)
                    return this.dbl();
                if (this.curve.zeroA || this.curve.threeA) {
                    for (var f = this, d = 0; d < e; d++)
                        f = f.dbl();
                    return f;
                }
                var c = this.curve.a, t = this.curve.tinv, a = this.x, r = this.y, b = this.z, i = b.redSqr().redSqr(), n = r.redAdd(r);
                for (d = 0; d < e; d++) {
                    var s = a.redSqr(), o = n.redSqr(), u = o.redSqr(), h = s.redAdd(s).redIAdd(s).redIAdd(c.redMul(i)), p = a.redMul(o), l = h.redSqr().redISub(p.redAdd(p)), v = p.redISub(l), y = h.redMul(v);
                    y = y.redIAdd(y).redISub(u);
                    var m = n.redMul(b);
                    d + 1 < e && (i = i.redMul(u)), a = l, b = m, n = y;
                }
                return this.curve.jpoint(a, n.redMul(t), b);
            }, w$e.prototype.dbl = function () {
                return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
            }, w$e.prototype._zeroDbl = function () {
                var e, f, d;
                if (this.zOne) {
                    var c = this.x.redSqr(), t = this.y.redSqr(), a = t.redSqr(), r = this.x.redAdd(t).redSqr().redISub(c).redISub(a);
                    r = r.redIAdd(r);
                    var b = c.redAdd(c).redIAdd(c), i = b.redSqr().redISub(r).redISub(r), n = a.redIAdd(a);
                    n = (n = n.redIAdd(n)).redIAdd(n), e = i, f = b.redMul(r.redISub(i)).redISub(n), d = this.y.redAdd(this.y);
                }
                else {
                    var s = this.x.redSqr(), o = this.y.redSqr(), u = o.redSqr(), h = this.x.redAdd(o).redSqr().redISub(s).redISub(u);
                    h = h.redIAdd(h);
                    var p = s.redAdd(s).redIAdd(s), l = p.redSqr(), v = u.redIAdd(u);
                    v = (v = v.redIAdd(v)).redIAdd(v), e = l.redISub(h).redISub(h), f = p.redMul(h.redISub(e)).redISub(v), d = (d = this.y.redMul(this.z)).redIAdd(d);
                }
                return this.curve.jpoint(e, f, d);
            }, w$e.prototype._threeDbl = function () {
                var e, f, d;
                if (this.zOne) {
                    var c = this.x.redSqr(), t = this.y.redSqr(), a = t.redSqr(), r = this.x.redAdd(t).redSqr().redISub(c).redISub(a);
                    r = r.redIAdd(r);
                    var b = c.redAdd(c).redIAdd(c).redIAdd(this.curve.a), i = b.redSqr().redISub(r).redISub(r);
                    e = i;
                    var n = a.redIAdd(a);
                    n = (n = n.redIAdd(n)).redIAdd(n), f = b.redMul(r.redISub(i)).redISub(n), d = this.y.redAdd(this.y);
                }
                else {
                    var s = this.z.redSqr(), o = this.y.redSqr(), u = this.x.redMul(o), h = this.x.redSub(s).redMul(this.x.redAdd(s));
                    h = h.redAdd(h).redIAdd(h);
                    var p = u.redIAdd(u), l = (p = p.redIAdd(p)).redAdd(p);
                    e = h.redSqr().redISub(l), d = this.y.redAdd(this.z).redSqr().redISub(o).redISub(s);
                    var v = o.redSqr();
                    v = (v = (v = v.redIAdd(v)).redIAdd(v)).redIAdd(v), f = h.redMul(p.redISub(e)).redISub(v);
                }
                return this.curve.jpoint(e, f, d);
            }, w$e.prototype._dbl = function () {
                var e = this.curve.a, f = this.x, d = this.y, c = this.z, t = c.redSqr().redSqr(), a = f.redSqr(), r = d.redSqr(), b = a.redAdd(a).redIAdd(a).redIAdd(e.redMul(t)), i = f.redAdd(f), n = (i = i.redIAdd(i)).redMul(r), s = b.redSqr().redISub(n.redAdd(n)), o = n.redISub(s), u = r.redSqr();
                u = (u = (u = u.redIAdd(u)).redIAdd(u)).redIAdd(u);
                var h = b.redMul(o).redISub(u), p = d.redAdd(d).redMul(c);
                return this.curve.jpoint(s, h, p);
            }, w$e.prototype.trpl = function () {
                if (!this.curve.zeroA)
                    return this.dbl().add(this);
                var e = this.x.redSqr(), f = this.y.redSqr(), d = this.z.redSqr(), c = f.redSqr(), t = e.redAdd(e).redIAdd(e), a = t.redSqr(), r = this.x.redAdd(f).redSqr().redISub(e).redISub(c), b = (r = (r = (r = r.redIAdd(r)).redAdd(r).redIAdd(r)).redISub(a)).redSqr(), i = c.redIAdd(c);
                i = (i = (i = i.redIAdd(i)).redIAdd(i)).redIAdd(i);
                var n = t.redIAdd(r).redSqr().redISub(a).redISub(b).redISub(i), s = f.redMul(n);
                s = (s = s.redIAdd(s)).redIAdd(s);
                var o = this.x.redMul(b).redISub(s);
                o = (o = o.redIAdd(o)).redIAdd(o);
                var u = this.y.redMul(n.redMul(i.redISub(n)).redISub(r.redMul(b)));
                u = (u = (u = u.redIAdd(u)).redIAdd(u)).redIAdd(u);
                var h = this.z.redAdd(r).redSqr().redISub(d).redISub(b);
                return this.curve.jpoint(o, u, h);
            }, w$e.prototype.mul = function (e, f) {
                return e = new y$e(e, f), this.curve._wnafMul(this, e);
            }, w$e.prototype.eq = function (e) {
                if ("affine" === e.type)
                    return this.eq(e.toJ());
                if (this === e)
                    return !0;
                var f = this.z.redSqr(), d = e.z.redSqr();
                if (0 !== this.x.redMul(d).redISub(e.x.redMul(f)).cmpn(0))
                    return !1;
                var c = f.redMul(this.z), t = d.redMul(e.z);
                return 0 === this.y.redMul(t).redISub(e.y.redMul(c)).cmpn(0);
            }, w$e.prototype.eqXToP = function (e) {
                var f = this.z.redSqr(), d = e.toRed(this.curve.red).redMul(f);
                if (0 === this.x.cmp(d))
                    return !0;
                for (var c = e.clone(), t = this.curve.redN.redMul(f);;) {
                    if (c.iadd(this.curve.n), c.cmp(this.curve.p) >= 0)
                        return !1;
                    if (d.redIAdd(t), 0 === this.x.cmp(d))
                        return !0;
                }
            }, w$e.prototype.inspect = function () {
                return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
            }, w$e.prototype.isInfinity = function () {
                return 0 === this.z.cmpn(0);
            };
            x$6 = l$j, _$d = n$c, z$6 = chunk_dac557ba_js_4.t, q$4 = v$e, R$3 = n$i;
            z$6(P$4, q$4), M$6 = P$4, P$4.prototype.validate = function (e) {
                var f = e.normalize().x, d = f.redSqr(), c = d.redMul(f).redAdd(d.redMul(this.a)).redAdd(f);
                return 0 === c.redSqrt().redSqr().cmp(c);
            }, z$6(j$5, q$4.BasePoint), P$4.prototype.decodePoint = function (e, f) {
                return this.point(R$3.toArray(e, f), 1);
            }, P$4.prototype.point = function (e, f) {
                return new j$5(this, e, f);
            }, P$4.prototype.pointFromJSON = function (e) {
                return j$5.fromJSON(this, e);
            }, j$5.prototype.precompute = function () { }, j$5.prototype._encode = function () {
                return this.getX().toArray("be", this.curve.p.byteLength());
            }, j$5.fromJSON = function (e, f) {
                return new j$5(e, f[0], f[1] || e.one);
            }, j$5.prototype.inspect = function () {
                return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
            }, j$5.prototype.isInfinity = function () {
                return 0 === this.z.cmpn(0);
            }, j$5.prototype.dbl = function () {
                var e = this.x.redAdd(this.z).redSqr(), f = this.x.redSub(this.z).redSqr(), d = e.redSub(f), c = e.redMul(f), t = d.redMul(f.redAdd(this.curve.a24.redMul(d)));
                return this.curve.point(c, t);
            }, j$5.prototype.add = function () {
                throw new Error("Not supported on Montgomery curve");
            }, j$5.prototype.diffAdd = function (e, f) {
                var d = this.x.redAdd(this.z), c = this.x.redSub(this.z), t = e.x.redAdd(e.z), a = e.x.redSub(e.z).redMul(d), r = t.redMul(c), b = f.z.redMul(a.redAdd(r).redSqr()), i = f.x.redMul(a.redISub(r).redSqr());
                return this.curve.point(b, i);
            }, j$5.prototype.mul = function (e) {
                for (var f = e.clone(), d = this, c = this.curve.point(null, null), t = []; 0 !== f.cmpn(0); f.iushrn(1))
                    t.push(f.andln(1));
                for (var a = t.length - 1; a >= 0; a--)
                    0 === t[a] ? (d = d.diffAdd(c, this), c = c.dbl()) : (c = d.diffAdd(c, this), d = d.dbl());
                return c;
            }, j$5.prototype.mulAdd = function () {
                throw new Error("Not supported on Montgomery curve");
            }, j$5.prototype.jumlAdd = function () {
                throw new Error("Not supported on Montgomery curve");
            }, j$5.prototype.eq = function (e) {
                return 0 === this.getX().cmp(e.getX());
            }, j$5.prototype.normalize = function () {
                return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this;
            }, j$5.prototype.getX = function () {
                return this.normalize(), this.x.fromRed();
            };
            E$8 = M$6, k$b = n$c, O$5 = chunk_dac557ba_js_4.t, L$4 = v$e, B$8 = n$i.assert;
            O$5(F$5, L$4), N$4 = F$5, F$5.prototype._mulA = function (e) {
                return this.mOneA ? e.redNeg() : this.a.redMul(e);
            }, F$5.prototype._mulC = function (e) {
                return this.oneC ? e : this.c.redMul(e);
            }, F$5.prototype.jpoint = function (e, f, d, c) {
                return this.point(e, f, d, c);
            }, F$5.prototype.pointFromX = function (e, f) {
                (e = new k$b(e, 16)).red || (e = e.toRed(this.red));
                var d = e.redSqr(), c = this.c2.redSub(this.a.redMul(d)), t = this.one.redSub(this.c2.redMul(this.d).redMul(d)), a = c.redMul(t.redInvm()), r = a.redSqrt();
                if (0 !== r.redSqr().redSub(a).cmp(this.zero))
                    throw new Error("invalid point");
                var b = r.fromRed().isOdd();
                return (f && !b || !f && b) && (r = r.redNeg()), this.point(e, r);
            }, F$5.prototype.pointFromY = function (e, f) {
                (e = new k$b(e, 16)).red || (e = e.toRed(this.red));
                var d = e.redSqr(), c = d.redSub(this.c2), t = d.redMul(this.d).redMul(this.c2).redSub(this.a), a = c.redMul(t.redInvm());
                if (0 === a.cmp(this.zero)) {
                    if (f)
                        throw new Error("invalid point");
                    return this.point(this.zero, e);
                }
                var r = a.redSqrt();
                if (0 !== r.redSqr().redSub(a).cmp(this.zero))
                    throw new Error("invalid point");
                return r.fromRed().isOdd() !== f && (r = r.redNeg()), this.point(r, e);
            }, F$5.prototype.validate = function (e) {
                if (e.isInfinity())
                    return !0;
                e.normalize();
                var f = e.x.redSqr(), d = e.y.redSqr(), c = f.redMul(this.a).redAdd(d), t = this.c2.redMul(this.one.redAdd(this.d.redMul(f).redMul(d)));
                return 0 === c.cmp(t);
            }, O$5(C$5, L$4.BasePoint), F$5.prototype.pointFromJSON = function (e) {
                return C$5.fromJSON(this, e);
            }, F$5.prototype.point = function (e, f, d, c) {
                return new C$5(this, e, f, d, c);
            }, C$5.fromJSON = function (e, f) {
                return new C$5(e, f[0], f[1], f[2]);
            }, C$5.prototype.inspect = function () {
                return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
            }, C$5.prototype.isInfinity = function () {
                return 0 === this.x.cmpn(0) && (0 === this.y.cmp(this.z) || this.zOne && 0 === this.y.cmp(this.curve.c));
            }, C$5.prototype._extDbl = function () {
                var e = this.x.redSqr(), f = this.y.redSqr(), d = this.z.redSqr();
                d = d.redIAdd(d);
                var c = this.curve._mulA(e), t = this.x.redAdd(this.y).redSqr().redISub(e).redISub(f), a = c.redAdd(f), r = a.redSub(d), b = c.redSub(f), i = t.redMul(r), n = a.redMul(b), s = t.redMul(b), o = r.redMul(a);
                return this.curve.point(i, n, o, s);
            }, C$5.prototype._projDbl = function () {
                var e, f, d, c = this.x.redAdd(this.y).redSqr(), t = this.x.redSqr(), a = this.y.redSqr();
                if (this.curve.twisted) {
                    var r = (n = this.curve._mulA(t)).redAdd(a);
                    if (this.zOne)
                        e = c.redSub(t).redSub(a).redMul(r.redSub(this.curve.two)), f = r.redMul(n.redSub(a)), d = r.redSqr().redSub(r).redSub(r);
                    else {
                        var b = this.z.redSqr(), i = r.redSub(b).redISub(b);
                        e = c.redSub(t).redISub(a).redMul(i), f = r.redMul(n.redSub(a)), d = r.redMul(i);
                    }
                }
                else {
                    var n = t.redAdd(a);
                    b = this.curve._mulC(this.z).redSqr(), i = n.redSub(b).redSub(b);
                    e = this.curve._mulC(c.redISub(n)).redMul(i), f = this.curve._mulC(n).redMul(t.redISub(a)), d = n.redMul(i);
                }
                return this.curve.point(e, f, d);
            }, C$5.prototype.dbl = function () {
                return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
            }, C$5.prototype._extAdd = function (e) {
                var f = this.y.redSub(this.x).redMul(e.y.redSub(e.x)), d = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)), c = this.t.redMul(this.curve.dd).redMul(e.t), t = this.z.redMul(e.z.redAdd(e.z)), a = d.redSub(f), r = t.redSub(c), b = t.redAdd(c), i = d.redAdd(f), n = a.redMul(r), s = b.redMul(i), o = a.redMul(i), u = r.redMul(b);
                return this.curve.point(n, s, u, o);
            }, C$5.prototype._projAdd = function (e) {
                var f, d, c = this.z.redMul(e.z), t = c.redSqr(), a = this.x.redMul(e.x), r = this.y.redMul(e.y), b = this.curve.d.redMul(a).redMul(r), i = t.redSub(b), n = t.redAdd(b), s = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(a).redISub(r), o = c.redMul(i).redMul(s);
                return this.curve.twisted ? (f = c.redMul(n).redMul(r.redSub(this.curve._mulA(a))), d = i.redMul(n)) : (f = c.redMul(n).redMul(r.redSub(a)), d = this.curve._mulC(i).redMul(n)), this.curve.point(o, f, d);
            }, C$5.prototype.add = function (e) {
                return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e);
            }, C$5.prototype.mul = function (e) {
                return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e);
            }, C$5.prototype.mulAdd = function (e, f, d) {
                return this.curve._wnafMulAdd(1, [this, f], [e, d], 2, !1);
            }, C$5.prototype.jmulAdd = function (e, f, d) {
                return this.curve._wnafMulAdd(1, [this, f], [e, d], 2, !0);
            }, C$5.prototype.normalize = function () {
                if (this.zOne)
                    return this;
                var e = this.z.redInvm();
                return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), this.z = this.curve.one, this.zOne = !0, this;
            }, C$5.prototype.neg = function () {
                return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
            }, C$5.prototype.getX = function () {
                return this.normalize(), this.x.fromRed();
            }, C$5.prototype.getY = function () {
                return this.normalize(), this.y.fromRed();
            }, C$5.prototype.eq = function (e) {
                return this === e || 0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY());
            }, C$5.prototype.eqXToP = function (e) {
                var f = e.toRed(this.curve.red).redMul(this.z);
                if (0 === this.x.cmp(f))
                    return !0;
                for (var d = e.clone(), c = this.curve.redN.redMul(this.z);;) {
                    if (d.iadd(this.curve.n), d.cmp(this.curve.p) >= 0)
                        return !1;
                    if (f.redIAdd(c), 0 === this.x.cmp(f))
                        return !0;
                }
            }, C$5.prototype.toP = C$5.prototype.normalize, C$5.prototype.mixedAdd = C$5.prototype.add;
            T$5 = N$4, J$3 = {}, X$3 = J$3;
            X$3.base = v$e, X$3.short = x$6, X$3.mont = E$8, X$3.edwards = T$5;
            Y$2 = {
                doubles: {
                    step: 4,
                    points: [["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"], ["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"], ["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"], ["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"], ["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"], ["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"], ["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"], ["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"], ["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"], ["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"], ["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"], ["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"], ["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"], ["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"], ["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"], ["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"], ["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"], ["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"], ["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"], ["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"], ["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"], ["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"], ["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"], ["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"], ["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"], ["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"], ["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"], ["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"], ["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"], ["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"], ["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"], ["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"], ["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"], ["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"], ["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"], ["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"], ["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"], ["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"], ["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"], ["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"], ["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"], ["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"], ["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"], ["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"], ["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"], ["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"], ["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"], ["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"], ["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"], ["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"], ["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"], ["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"], ["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"], ["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"], ["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"], ["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"], ["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"], ["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"], ["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"], ["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"], ["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"], ["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"], ["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"], ["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"], ["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]]
                },
                naf: {
                    wnd: 7,
                    points: [["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"], ["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"], ["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"], ["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"], ["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"], ["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"], ["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"], ["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"], ["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"], ["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"], ["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"], ["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"], ["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"], ["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"], ["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"], ["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"], ["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"], ["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"], ["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"], ["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"], ["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"], ["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"], ["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"], ["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"], ["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"], ["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"], ["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"], ["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"], ["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"], ["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"], ["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"], ["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"], ["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"], ["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"], ["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"], ["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"], ["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"], ["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"], ["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"], ["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"], ["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"], ["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"], ["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"], ["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"], ["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"], ["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"], ["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"], ["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"], ["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"], ["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"], ["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"], ["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"], ["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"], ["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"], ["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"], ["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"], ["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"], ["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"], ["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"], ["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"], ["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"], ["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"], ["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"], ["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"], ["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"], ["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"], ["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"], ["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"], ["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"], ["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"], ["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"], ["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"], ["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"], ["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"], ["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"], ["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"], ["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"], ["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"], ["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"], ["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"], ["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"], ["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"], ["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"], ["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"], ["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"], ["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"], ["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"], ["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"], ["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"], ["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"], ["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"], ["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"], ["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"], ["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"], ["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"], ["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"], ["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"], ["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"], ["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"], ["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"], ["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"], ["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"], ["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"], ["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"], ["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"], ["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"], ["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"], ["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"], ["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"], ["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"], ["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"], ["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"], ["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"], ["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"], ["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"], ["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"], ["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"], ["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"], ["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"], ["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"], ["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"], ["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"], ["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"], ["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"], ["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"], ["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"], ["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]]
                }
            }, W$3 = {}, K$4 = W$3, U$6 = X$2, G$3 = J$3, H$5 = n$i.assert;
            K$4.PresetCurve = Q$2, V$3("p192", {
                type: "short",
                prime: "p192",
                p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
                a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
                b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
                n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
                hash: U$6.sha256,
                gRed: !1,
                g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"]
            }), V$3("p224", {
                type: "short",
                prime: "p224",
                p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
                a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
                b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
                n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
                hash: U$6.sha256,
                gRed: !1,
                g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"]
            }), V$3("p256", {
                type: "short",
                prime: null,
                p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
                a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
                b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
                n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
                hash: U$6.sha256,
                gRed: !1,
                g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"]
            }), V$3("p384", {
                type: "short",
                prime: null,
                p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
                a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
                b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
                n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
                hash: U$6.sha384,
                gRed: !1,
                g: ["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"]
            }), V$3("p521", {
                type: "short",
                prime: null,
                p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
                a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
                b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
                n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
                hash: U$6.sha512,
                gRed: !1,
                g: ["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"]
            }), V$3("curve25519", {
                type: "mont",
                prime: "p25519",
                p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
                a: "76d06",
                b: "1",
                n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
                hash: U$6.sha256,
                gRed: !1,
                g: ["9"]
            }), V$3("ed25519", {
                type: "edwards",
                prime: "p25519",
                p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
                a: "-1",
                c: "1",
                d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
                n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
                hash: U$6.sha256,
                gRed: !1,
                g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"]
            });
            try {
                D$4 = Y$2;
            }
            catch (e) {
                D$4 = void 0;
            }
            V$3("secp256k1", {
                type: "short",
                prime: "k256",
                p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
                a: "0",
                b: "7",
                n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
                h: "1",
                hash: U$6.sha256,
                beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
                lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
                basis: [{
                        a: "3086d221a7d46bcde86c90e49284eb15",
                        b: "-e4437ed6010e88286f547fa90abfe4c3"
                    }, {
                        a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
                        b: "3086d221a7d46bcde86c90e49284eb15"
                    }],
                gRed: !1,
                g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", D$4]
            });
            $$1 = n$c, ee = n$i.assert;
            Z$1 = fe, fe.fromPublic = function (e, f, d) {
                return f instanceof fe ? f : new fe(e, {
                    pub: f,
                    pubEnc: d
                });
            }, fe.fromPrivate = function (e, f, d) {
                return f instanceof fe ? f : new fe(e, {
                    priv: f,
                    privEnc: d
                });
            }, fe.prototype.validate = function () {
                var e = this.getPublic();
                return e.isInfinity() ? {
                    result: !1,
                    reason: "Invalid public key"
                } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? {
                    result: !0,
                    reason: null
                } : {
                    result: !1,
                    reason: "Public key * N != O"
                } : {
                    result: !1,
                    reason: "Public key is not a point"
                };
            }, fe.prototype.getPublic = function (e, f) {
                return "string" == typeof e && (f = e, e = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), f ? this.pub.encode(f, e) : this.pub;
            }, fe.prototype.getPrivate = function (e) {
                return "hex" === e ? this.priv.toString(16, 2) : this.priv;
            }, fe.prototype._importPrivate = function (e, f) {
                this.priv = new $$1(e, f || 16), this.priv = this.priv.umod(this.ec.curve.n);
            }, fe.prototype._importPublic = function (e, f) {
                if (e.x || e.y)
                    return "mont" === this.ec.curve.type ? ee(e.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || ee(e.x && e.y, "Need both x and y coordinate"), this.pub = this.ec.curve.point(e.x, e.y), void 0;
                this.pub = this.ec.curve.decodePoint(e, f);
            }, fe.prototype.derive = function (e) {
                return e.mul(this.priv).getX();
            }, fe.prototype.sign = function (e, f, d) {
                return this.ec.sign(e, this, f, d);
            }, fe.prototype.verify = function (e, f) {
                return this.ec.verify(e, f, this);
            }, fe.prototype.inspect = function () {
                return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
            };
            ce = Z$1, te = n$c, ae = a$l, re = W$3, be = f$i, ie = n$i.assert, ne = ce, se = d$e;
            de = oe, oe.prototype.keyPair = function (e) {
                return new ne(this, e);
            }, oe.prototype.keyFromPrivate = function (e, f) {
                return ne.fromPrivate(this, e, f);
            }, oe.prototype.keyFromPublic = function (e, f) {
                return ne.fromPublic(this, e, f);
            }, oe.prototype.genKeyPair = function (e) {
                e || (e = {});
                for (var f = new ae({
                    hash: this.hash,
                    pers: e.pers,
                    persEnc: e.persEnc || "utf8",
                    entropy: e.entropy || be(this.hash.hmacStrength),
                    entropyEnc: e.entropy && e.entropyEnc || "utf8",
                    nonce: this.n.toArray()
                }), d = this.n.byteLength(), c = this.n.sub(new te(2));;) {
                    var t = new te(f.generate(d));
                    if (!(t.cmp(c) > 0))
                        return t.iaddn(1), this.keyFromPrivate(t);
                }
            }, oe.prototype._truncateToN = function (e, f) {
                var d = 8 * e.byteLength() - this.n.bitLength();
                return d > 0 && (e = e.ushrn(d)), !f && e.cmp(this.n) >= 0 ? e.sub(this.n) : e;
            }, oe.prototype.sign = function (e, f, d, c) {
                "object" == typeof d && (c = d, d = null), c || (c = {}), f = this.keyFromPrivate(f, d), e = this._truncateToN(new te(e, 16));
                for (var t = this.n.byteLength(), a = f.getPrivate().toArray("be", t), r = e.toArray("be", t), b = new ae({
                    hash: this.hash,
                    entropy: a,
                    nonce: r,
                    pers: c.pers,
                    persEnc: c.persEnc || "utf8"
                }), i = this.n.sub(new te(1)), n = 0;; n++) {
                    var s = c.k ? c.k(n) : new te(b.generate(this.n.byteLength()));
                    if (!((s = this._truncateToN(s, !0)).cmpn(1) <= 0 || s.cmp(i) >= 0)) {
                        var o = this.g.mul(s);
                        if (!o.isInfinity()) {
                            var u = o.getX(), h = u.umod(this.n);
                            if (0 !== h.cmpn(0)) {
                                var p = s.invm(this.n).mul(h.mul(f.getPrivate()).iadd(e));
                                if (0 !== (p = p.umod(this.n)).cmpn(0)) {
                                    var l = (o.getY().isOdd() ? 1 : 0) | (0 !== u.cmp(h) ? 2 : 0);
                                    return c.canonical && p.cmp(this.nh) > 0 && (p = this.n.sub(p), l ^= 1), new se({
                                        r: h,
                                        s: p,
                                        recoveryParam: l
                                    });
                                }
                            }
                        }
                    }
                }
            }, oe.prototype.verify = function (e, f, d, c) {
                e = this._truncateToN(new te(e, 16)), d = this.keyFromPublic(d, c);
                var t = (f = new se(f, "hex")).r, a = f.s;
                if (t.cmpn(1) < 0 || t.cmp(this.n) >= 0)
                    return !1;
                if (a.cmpn(1) < 0 || a.cmp(this.n) >= 0)
                    return !1;
                var r, b = a.invm(this.n), i = b.mul(e).umod(this.n), n = b.mul(t).umod(this.n);
                return this.curve._maxwellTrick ? !(r = this.g.jmulAdd(i, d.getPublic(), n)).isInfinity() && r.eqXToP(t) : !(r = this.g.mulAdd(i, d.getPublic(), n)).isInfinity() && 0 === r.getX().umod(this.n).cmp(t);
            }, oe.prototype.recoverPubKey = function (e, f, d, c) {
                ie((3 & d) === d, "The recovery param is more than two bits"), f = new se(f, c);
                var t = this.n, a = new te(e), r = f.r, b = f.s, i = 1 & d, n = d >> 1;
                if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && n)
                    throw new Error("Unable to find sencond key candinate");
                r = n ? this.curve.pointFromX(r.add(this.curve.n), i) : this.curve.pointFromX(r, i);
                var s = f.r.invm(t), o = t.sub(a).mul(s).umod(t), u = b.mul(s).umod(t);
                return this.g.mulAdd(o, r, u);
            }, oe.prototype.getKeyRecoveryParam = function (e, f, d, c) {
                if (null !== (f = new se(f, c)).recoveryParam)
                    return f.recoveryParam;
                for (var t = 0; t < 4; t++) {
                    var a;
                    try {
                        a = this.recoverPubKey(e, f, t);
                    }
                    catch (e) {
                        continue;
                    }
                    if (a.eq(d))
                        return t;
                }
                throw new Error("Unable to find valid recovery factor");
            };
            ue = de, he = n$i, pe = he.assert, le = he.parseBytes, ve = he.cachedProperty;
            ye.fromPublic = function (e, f) {
                return f instanceof ye ? f : new ye(e, {
                    pub: f
                });
            }, ye.fromSecret = function (e, f) {
                return f instanceof ye ? f : new ye(e, {
                    secret: f
                });
            }, ye.prototype.secret = function () {
                return this._secret;
            }, ve(ye, "pubBytes", function () {
                return this.eddsa.encodePoint(this.pub());
            }), ve(ye, "pub", function () {
                return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
            }), ve(ye, "privBytes", function () {
                var e = this.eddsa, f = this.hash(), d = e.encodingLength - 1, c = f.slice(0, e.encodingLength);
                return c[0] &= 248, c[d] &= 127, c[d] |= 64, c;
            }), ve(ye, "priv", function () {
                return this.eddsa.decodeInt(this.privBytes());
            }), ve(ye, "hash", function () {
                return this.eddsa.hash().update(this.secret()).digest();
            }), ve(ye, "messagePrefix", function () {
                return this.hash().slice(this.eddsa.encodingLength);
            }), ye.prototype.sign = function (e) {
                return pe(this._secret, "KeyPair can only verify"), this.eddsa.sign(e, this);
            }, ye.prototype.verify = function (e, f) {
                return this.eddsa.verify(e, f, this);
            }, ye.prototype.getSecret = function (e) {
                return pe(this._secret, "KeyPair is public only"), he.encode(this.secret(), e);
            }, ye.prototype.getPublic = function (e) {
                return he.encode(this.pubBytes(), e);
            };
            me = ye, Se = n$c, ge = n$i, Ae = ge.assert, Ie = ge.cachedProperty, we = ge.parseBytes;
            Ie(Me, "S", function () {
                return this.eddsa.decodeInt(this.Sencoded());
            }), Ie(Me, "R", function () {
                return this.eddsa.decodePoint(this.Rencoded());
            }), Ie(Me, "Rencoded", function () {
                return this.eddsa.encodePoint(this.R());
            }), Ie(Me, "Sencoded", function () {
                return this.eddsa.encodeInt(this.S());
            }), Me.prototype.toBytes = function () {
                return this.Rencoded().concat(this.Sencoded());
            }, Me.prototype.toHex = function () {
                return ge.encode(this.toBytes(), "hex").toUpperCase();
            };
            _e = Me, ze = X$2, qe = W$3, Re = n$i, Pe = Re.assert, je = Re.parseBytes, Ne = me, Ee = _e;
            xe = ke, ke.prototype.sign = function (e, f) {
                e = je(e);
                var d = this.keyFromSecret(f), c = this.hashInt(d.messagePrefix(), e), t = this.g.mul(c), a = this.encodePoint(t), r = this.hashInt(a, d.pubBytes(), e).mul(d.priv()), b = c.add(r).umod(this.curve.n);
                return this.makeSignature({
                    R: t,
                    S: b,
                    Rencoded: a
                });
            }, ke.prototype.verify = function (e, f, d) {
                e = je(e), f = this.makeSignature(f);
                var c = this.keyFromPublic(d), t = this.hashInt(f.Rencoded(), c.pubBytes(), e), a = this.g.mul(f.S());
                return f.R().add(c.pub().mul(t)).eq(a);
            }, ke.prototype.hashInt = function () {
                for (var e = this.hash(), f = 0; f < arguments.length; f++)
                    e.update(arguments[f]);
                return Re.intFromLE(e.digest()).umod(this.curve.n);
            }, ke.prototype.keyFromPublic = function (e) {
                return Ne.fromPublic(this, e);
            }, ke.prototype.keyFromSecret = function (e) {
                return Ne.fromSecret(this, e);
            }, ke.prototype.makeSignature = function (e) {
                return e instanceof Ee ? e : new Ee(this, e);
            }, ke.prototype.encodePoint = function (e) {
                var f = e.getY().toArray("le", this.encodingLength);
                return f[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0, f;
            }, ke.prototype.decodePoint = function (e) {
                var f = (e = Re.parseBytes(e)).length - 1, d = e.slice(0, f).concat(-129 & e[f]), c = 0 != (128 & e[f]), t = Re.intFromLE(d);
                return this.curve.pointFromY(t, c);
            }, ke.prototype.encodeInt = function (e) {
                return e.toArray("le", this.encodingLength);
            }, ke.prototype.decodeInt = function (e) {
                return Re.intFromLE(e);
            }, ke.prototype.isPoint = function (e) {
                return e instanceof this.pointClass;
            };
            Oe = xe, Le = {}, Be = Le;
            Be.version = ["elliptic", "6.5.2", "EC cryptography", "lib/elliptic.js", ["lib"], {
                    jscs: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
                    jshint: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
                    lint: "npm run jscs && npm run jshint",
                    unit: "istanbul test _mocha --reporter=spec test/index.js",
                    test: "npm run lint && npm run unit",
                    version: "grunt dist && git add dist/"
                }, {
                    type: "git",
                    url: "git@github.com:indutny/elliptic"
                }, ["EC", "Elliptic", "curve", "Cryptography"], "Fedor Indutny <fedor@indutny.com>", "MIT", {
                    url: "https://github.com/indutny/elliptic/issues"
                }, "https://github.com/indutny/elliptic", {
                    brfs: "^1.4.3",
                    coveralls: "^3.0.8",
                    grunt: "^1.0.4",
                    "grunt-browserify": "^5.0.0",
                    "grunt-cli": "^1.2.0",
                    "grunt-contrib-connect": "^1.0.0",
                    "grunt-contrib-copy": "^1.0.0",
                    "grunt-contrib-uglify": "^1.0.1",
                    "grunt-mocha-istanbul": "^3.0.1",
                    "grunt-saucelabs": "^9.0.1",
                    istanbul: "^0.4.2",
                    jscs: "^3.0.7",
                    jshint: "^2.10.3",
                    mocha: "^6.2.2"
                }, {
                    "bn.js": "^4.4.0",
                    brorand: "^1.0.1",
                    "hash.js": "^1.0.0",
                    "hmac-drbg": "^1.0.0",
                    inherits: "^2.0.1",
                    "minimalistic-assert": "^1.0.0",
                    "minimalistic-crypto-utils": "^1.0.0"
                }][1], Be.utils = n$i, Be.rand = f$i, Be.curve = J$3, Be.curves = W$3, Be.ec = ue, Be.eddsa = Oe;
            o$n = {}, s$j = !1, a$m = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            u$j = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, c$i = {}, f$n = chunk_dac557ba_js_4.t;
            c$i.Reporter = l$k, l$k.prototype.isError = function (e) {
                return e instanceof h$g;
            }, l$k.prototype.save = function () {
                var e = (this || u$j)._reporterState;
                return {
                    obj: e.obj,
                    pathLen: e.path.length
                };
            }, l$k.prototype.restore = function (e) {
                var t = (this || u$j)._reporterState;
                t.obj = e.obj, t.path = t.path.slice(0, e.pathLen);
            }, l$k.prototype.enterKey = function (e) {
                return (this || u$j)._reporterState.path.push(e);
            }, l$k.prototype.exitKey = function (e) {
                var t = (this || u$j)._reporterState;
                t.path = t.path.slice(0, e - 1);
            }, l$k.prototype.leaveKey = function (e, t, r) {
                var n = (this || u$j)._reporterState;
                this.exitKey(e), null !== n.obj && (n.obj[t] = r);
            }, l$k.prototype.path = function () {
                return (this || u$j)._reporterState.path.join("/");
            }, l$k.prototype.enterObject = function () {
                var e = (this || u$j)._reporterState, t = e.obj;
                return e.obj = {}, t;
            }, l$k.prototype.leaveObject = function (e) {
                var t = (this || u$j)._reporterState, r = t.obj;
                return t.obj = e, r;
            }, l$k.prototype.error = function (e) {
                var t, r = (this || u$j)._reporterState, n = e instanceof h$g;
                if (t = n ? e : new h$g(r.path.map(function (e) {
                    return "[" + JSON.stringify(e) + "]";
                }).join(""), e.message || e, e.stack), !r.options.partial)
                    throw t;
                return n || r.errors.push(t), t;
            }, l$k.prototype.wrapResult = function (e) {
                var t = (this || u$j)._reporterState;
                return t.options.partial ? {
                    result: this.isError(e) ? null : e,
                    errors: t.errors
                } : e;
            }, f$n(h$g, Error), h$g.prototype.rethrow = function (e) {
                if ((this || u$j).message = e + " at: " + ((this || u$j).path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this || u$j, h$g), !(this || u$j).stack)
                    try {
                        throw new Error((this || u$j).message);
                    }
                    catch (e) {
                        (this || u$j).stack = e.stack;
                    }
                return this || u$j;
            };
            p$k = {}, d$i = !1, g$e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            _$e = {}, v$f = !1, b$c = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            m$g = {}, S$a = !1;
            j$6 = {}, w$f = !1;
            B$9 = {}, k$c = !1;
            D$5 = {}, U$7 = !1, N$5 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            O$6 = {}, A$9 = !1, x$7 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            I$9 = {}, q$5 = !1;
            F$6 = {}, K$5 = !1, R$4 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            G$4 = {}, L$5 = !1, M$7 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global;
            J$4 = {}, V$4 = !1;
            z$7 = {}, H$6 = !1;
            Q$3 = Y$3();
            e$f = Q$3, t$a = e$f.define("Time", function () {
                this.choice({
                    utcTime: this.utctime(),
                    generalTime: this.gentime()
                });
            }), s$k = e$f.define("AttributeTypeValue", function () {
                this.seq().obj(this.key("type").objid(), this.key("value").any());
            }), n$n = e$f.define("AlgorithmIdentifier", function () {
                this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional(), this.key("curve").objid().optional());
            }), o$o = e$f.define("SubjectPublicKeyInfo", function () {
                this.seq().obj(this.key("algorithm").use(n$n), this.key("subjectPublicKey").bitstr());
            }), h$h = e$f.define("RelativeDistinguishedName", function () {
                this.setof(s$k);
            }), y$g = e$f.define("RDNSequence", function () {
                this.seqof(h$h);
            }), r$g = e$f.define("Name", function () {
                this.choice({
                    rdnSequence: this.use(y$g)
                });
            }), u$k = e$f.define("Validity", function () {
                this.seq().obj(this.key("notBefore").use(t$a), this.key("notAfter").use(t$a));
            }), a$n = e$f.define("Extension", function () {
                this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr());
            }), c$j = e$f.define("TBSCertificate", function () {
                this.seq().obj(this.key("version").explicit(0).int().optional(), this.key("serialNumber").int(), this.key("signature").use(n$n), this.key("issuer").use(r$g), this.key("validity").use(u$k), this.key("subject").use(r$g), this.key("subjectPublicKeyInfo").use(o$o), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(a$n).optional());
            }), k$d = e$f.define("X509Certificate", function () {
                this.seq().obj(this.key("tbsCertificate").use(c$j), this.key("signatureAlgorithm").use(n$n), this.key("signatureValue").bitstr());
            }), f$o = {}, b$d = Q$3;
            f$o.certificate = k$d;
            l$l = b$d.define("RSAPrivateKey", function () {
                this.seq().obj(this.key("version").int(), this.key("modulus").int(), this.key("publicExponent").int(), this.key("privateExponent").int(), this.key("prime1").int(), this.key("prime2").int(), this.key("exponent1").int(), this.key("exponent2").int(), this.key("coefficient").int());
            });
            f$o.RSAPrivateKey = l$l;
            d$j = b$d.define("RSAPublicKey", function () {
                this.seq().obj(this.key("modulus").int(), this.key("publicExponent").int());
            });
            f$o.RSAPublicKey = d$j;
            p$l = b$d.define("SubjectPublicKeyInfo", function () {
                this.seq().obj(this.key("algorithm").use(j$7), this.key("subjectPublicKey").bitstr());
            });
            f$o.PublicKey = p$l;
            j$7 = b$d.define("AlgorithmIdentifier", function () {
                this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p").int(), this.key("q").int(), this.key("g").int()).optional());
            }), v$g = b$d.define("PrivateKeyInfo", function () {
                this.seq().obj(this.key("version").int(), this.key("algorithm").use(j$7), this.key("subjectPrivateKey").octstr());
            });
            f$o.PrivateKey = v$g;
            m$h = b$d.define("EncryptedPrivateKeyInfo", function () {
                this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters").int())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr());
            });
            f$o.EncryptedPrivateKey = m$h;
            q$6 = b$d.define("DSAPrivateKey", function () {
                this.seq().obj(this.key("version").int(), this.key("p").int(), this.key("q").int(), this.key("g").int(), this.key("pub_key").int(), this.key("priv_key").int());
            });
            f$o.DSAPrivateKey = q$6, f$o.DSAparam = b$d.define("DSAparam", function () {
                this.int();
            });
            K$6 = b$d.define("ECPrivateKey", function () {
                this.seq().obj(this.key("version").int(), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(P$6), this.key("publicKey").optional().explicit(1).bitstr());
            });
            f$o.ECPrivateKey = K$6;
            P$6 = b$d.define("ECParameters", function () {
                this.choice({
                    namedCurve: this.objid()
                });
            });
            f$o.signature = b$d.define("signature", function () {
                this.seq().obj(this.key("r").int(), this.key("s").int());
            });
            i$a = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r\+\/\=]+)[\n\r]+/m, o$p = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m, d$k = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r\+\/\=]+)-----END \1-----$/m, n$o = a$c, p$m = t$3, u$l = chunk_6e68c801_js_3.r.Buffer, y$h = f$o, m$i = {
                "2.16.840.1.101.3.4.1.1": "aes-128-ecb",
                "2.16.840.1.101.3.4.1.2": "aes-128-cbc",
                "2.16.840.1.101.3.4.1.3": "aes-128-ofb",
                "2.16.840.1.101.3.4.1.4": "aes-128-cfb",
                "2.16.840.1.101.3.4.1.21": "aes-192-ecb",
                "2.16.840.1.101.3.4.1.22": "aes-192-cbc",
                "2.16.840.1.101.3.4.1.23": "aes-192-ofb",
                "2.16.840.1.101.3.4.1.24": "aes-192-cfb",
                "2.16.840.1.101.3.4.1.41": "aes-256-ecb",
                "2.16.840.1.101.3.4.1.42": "aes-256-cbc",
                "2.16.840.1.101.3.4.1.43": "aes-256-ofb",
                "2.16.840.1.101.3.4.1.44": "aes-256-cfb"
            }, f$p = function (e, r) {
                var a, t = e.toString(), c = t.match(i$a);
                if (c) {
                    var s = "aes" + c[1], y = u$l.from(c[2], "hex"), m = u$l.from(c[3].replace(/[\r\n]/g, ""), "base64"), f = n$o(r, y.slice(0, 8), parseInt(c[1], 10)).key, b = [], E = p$m.createDecipheriv(s, f, y);
                    b.push(E.update(m)), b.push(E.final()), a = u$l.concat(b);
                }
                else {
                    var h = t.match(d$k);
                    a = new u$l(h[2].replace(/[\r\n]/g, ""), "base64");
                }
                return {
                    tag: t.match(o$p)[1],
                    data: a
                };
            }, b$e = t$3, E$a = M$1, h$i = chunk_6e68c801_js_3.r.Buffer;
            s$l = l$m, l$m.signature = y$h.signature;
            v$h = s$l;
            p$n = {
                "1.3.132.0.10": "secp256k1",
                "1.3.132.0.33": "p224",
                "1.2.840.10045.3.1.1": "p192",
                "1.2.840.10045.3.1.7": "p256",
                "1.3.132.0.34": "p384",
                "1.3.132.0.35": "p521"
            }, d$l = {}, f$q = buffer_js_3.default.Buffer, c$k = w$3, g$f = l$d, w$g = Le.ec, l$n = n$c, m$j = v$h, v$i = p$n;
            (d$l = function (e, t, r, n, a) {
                var o = m$j(t);
                if (o.curve) {
                    if ("ecdsa" !== n && "ecdsa/rsa" !== n)
                        throw new Error("wrong private key type");
                    return function (e, t) {
                        var r = v$i[t.curve.join(".")];
                        if (!r)
                            throw new Error("unknown curve " + t.curve.join("."));
                        var n = new w$g(r).keyFromPrivate(t.privateKey).sign(e);
                        return new f$q(n.toDER());
                    }(e, o);
                }
                if ("dsa" === o.type) {
                    if ("dsa" !== n)
                        throw new Error("wrong private key type");
                    return function (e, t, r) {
                        var n, a = t.params.priv_key, o = t.params.p, i = t.params.q, s = t.params.g, h = new l$n(0), u = b$f(e, i).mod(i), p = !1, d = y$i(a, i, e, r);
                        for (; !1 === p;)
                            n = _$f(i, d, r), h = k$e(s, n, o, i), 0 === (p = n.invm(i).imul(u.add(a.mul(h))).mod(i)).cmpn(0) && (p = !1, h = new l$n(0));
                        return function (e, t) {
                            e = e.toArray(), t = t.toArray(), 128 & e[0] && (e = [0].concat(e));
                            128 & t[0] && (t = [0].concat(t));
                            var r = [48, e.length + t.length + 4, 2, e.length];
                            return r = r.concat(e, [2, t.length], t), new f$q(r);
                        }(h, p);
                    }(e, o, r);
                }
                if ("rsa" !== n && "ecdsa/rsa" !== n)
                    throw new Error("wrong private key type");
                e = f$q.concat([a, e]);
                for (var i = o.modulus.byteLength(), s = [0, 1]; e.length + s.length + 1 < i;)
                    s.push(255);
                s.push(0);
                for (var h = -1; ++h < e.length;)
                    s.push(e[h]);
                return g$f(s, o);
            }).getKey = y$i, d$l.makeKey = _$f;
            E$b = d$l, L$6 = buffer_js_3.default.Buffer, R$5 = n$c, j$8 = Le.ec, T$7 = v$h, P$7 = p$n;
            K$7 = function (e, t, r, n, a) {
                var o = T$7(r);
                if ("ec" === o.type) {
                    if ("ecdsa" !== n && "ecdsa/rsa" !== n)
                        throw new Error("wrong public key type");
                    return function (e, t, r) {
                        var n = P$7[r.data.algorithm.curve.join(".")];
                        if (!n)
                            throw new Error("unknown curve " + r.data.algorithm.curve.join("."));
                        var a = new j$8(n), o = r.data.subjectPrivateKey.data;
                        return a.verify(t, e, o);
                    }(e, t, o);
                }
                if ("dsa" === o.type) {
                    if ("dsa" !== n)
                        throw new Error("wrong public key type");
                    return function (e, t, r) {
                        var n = r.data.p, a = r.data.q, o = r.data.g, i = r.data.pub_key, s = T$7.signature.decode(e, "der"), h = s.s, u = s.r;
                        A$a(h, a), A$a(u, a);
                        var p = R$5.mont(n), d = h.invm(a);
                        return 0 === o.toRed(p).redPow(new R$5(t).mul(d).mod(a)).fromRed().mul(i.toRed(p).redPow(u.mul(d).mod(a)).fromRed()).mod(n).mod(a).cmp(u);
                    }(e, t, o);
                }
                if ("rsa" !== n && "ecdsa/rsa" !== n)
                    throw new Error("wrong public key type");
                t = L$6.concat([a, t]);
                for (var i = o.modulus.byteLength(), s = [1], h = 0; t.length + s.length + 2 < i;)
                    s.push(255), h++;
                s.push(0);
                for (var u = -1; ++u < t.length;)
                    s.push(t[u]);
                s = new L$6(s);
                var p = R$5.mont(o.modulus);
                e = (e = new R$5(e).toRed(p)).redPow(new R$5(o.publicExponent)), e = new L$6(e.fromRed().toArray());
                var d = h < 8 ? 1 : 0;
                for (i = Math.min(e.length, s.length), e.length !== s.length && (d = 1), u = -1; ++u < i;)
                    d |= e[u] ^ s[u];
                return 0 === d;
            }, W$4 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, x$8 = buffer_js_3.default.Buffer, B$a = h$4, S$b = stream_js_1.default, q$7 = chunk_dac557ba_js_4.t, U$8 = E$b, V$5 = K$7, C$7 = s$4;
            Object.keys(C$7).forEach(function (e) {
                C$7[e].id = new x$8(C$7[e].id, "hex"), C$7[e.toLowerCase()] = C$7[e];
            }), q$7(D$6, S$b.Writable), D$6.prototype._write = function (e, t, r) {
                (this || W$4)._hash.update(e), r();
            }, D$6.prototype.update = function (e, t) {
                return "string" == typeof e && (e = new x$8(e, t)), (this || W$4)._hash.update(e), this || W$4;
            }, D$6.prototype.sign = function (e, t) {
                this.end();
                var r = (this || W$4)._hash.digest(), n = U$8(r, e, (this || W$4)._hashType, (this || W$4)._signType, (this || W$4)._tag);
                return t ? n.toString(t) : n;
            }, q$7(F$7, S$b.Writable), F$7.prototype._write = function (e, t, r) {
                (this || W$4)._hash.update(e), r();
            }, F$7.prototype.update = function (e, t) {
                return "string" == typeof e && (e = new x$8(e, t)), (this || W$4)._hash.update(e), this || W$4;
            }, F$7.prototype.verify = function (e, t, r) {
                "string" == typeof t && (t = new x$8(t, r)), this.end();
                var n = (this || W$4)._hash.digest();
                return V$5(t, n, e, (this || W$4)._signType, (this || W$4)._tag);
            };
            z$8 = {
                Sign: M$8,
                Verify: O$7,
                createSign: M$8,
                createVerify: O$7
            };
            n$p = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, p$o = buffer_js_3.default.Buffer, s$m = Le, u$m = n$c;
            i$b = function (e) {
                return new c$l(e);
            };
            o$q = {
                secp256k1: {
                    name: "secp256k1",
                    byteLength: 32
                },
                secp224r1: {
                    name: "p224",
                    byteLength: 28
                },
                prime256v1: {
                    name: "p256",
                    byteLength: 32
                },
                prime192v1: {
                    name: "p192",
                    byteLength: 24
                },
                ed25519: {
                    name: "ed25519",
                    byteLength: 32
                },
                secp384r1: {
                    name: "p384",
                    byteLength: 48
                },
                secp521r1: {
                    name: "p521",
                    byteLength: 66
                }
            };
            o$q.p224 = o$q.secp224r1, o$q.p256 = o$q.secp256r1 = o$q.prime256v1, o$q.p192 = o$q.secp192r1 = o$q.prime192v1, o$q.p384 = o$q.secp384r1, o$q.p521 = o$q.secp521r1, c$l.prototype.generateKeys = function (e, t) {
                return (this || n$p).keys = (this || n$p).curve.genKeyPair(), this.getPublicKey(e, t);
            }, c$l.prototype.computeSecret = function (e, t, r) {
                return t = t || "utf8", p$o.isBuffer(e) || (e = new p$o(e, t)), y$j((this || n$p).curve.keyFromPublic(e).getPublic().mul((this || n$p).keys.getPrivate()).getX(), r, (this || n$p).curveType.byteLength);
            }, c$l.prototype.getPublicKey = function (e, t) {
                var r = (this || n$p).keys.getPublic("compressed" === t, !0);
                return "hybrid" === t && (r[r.length - 1] % 2 ? r[0] = 7 : r[0] = 6), y$j(r, e);
            }, c$l.prototype.getPrivateKey = function (e) {
                return y$j((this || n$p).keys.getPrivate(), e);
            }, c$l.prototype.setPublicKey = function (e, t) {
                return t = t || "utf8", p$o.isBuffer(e) || (e = new p$o(e, t)), (this || n$p).keys._importPublic(e), this || n$p;
            }, c$l.prototype.setPrivateKey = function (e, t) {
                t = t || "utf8", p$o.isBuffer(e) || (e = new p$o(e, t));
                var r = new u$m(e);
                return r = r.toString(16), (this || n$p).keys = (this || n$p).curve.genKeyPair(), (this || n$p).keys._importPrivate(r), this || n$p;
            };
            f$r = i$b;
            i$c = h$4, l$o = chunk_6e68c801_js_3.r.Buffer;
            u$n = function (r, n) {
                for (var e, t = l$o.alloc(0), o = 0; t.length < n;)
                    e = f$s(o++), t = l$o.concat([t, i$c("sha1").update(r).update(e).digest()]);
                return t.slice(0, n);
            }, c$m = function (r, n) {
                for (var e = r.length, t = -1; ++t < e;)
                    r[t] ^= n[t];
                return r;
            }, p$p = n$c, d$m = chunk_6e68c801_js_3.r.Buffer;
            h$j = function (r, n) {
                return d$m.from(r.toRed(p$p.mont(n.modulus)).redPow(new p$p(n.publicExponent)).fromRed().toArray());
            }, s$n = v$h, g$g = a, m$k = h$4, w$h = u$n, v$j = c$m, y$k = n$c, E$c = h$j, b$g = l$d, B$b = chunk_6e68c801_js_3.r.Buffer;
            x$9 = function (r, n, e) {
                var t;
                t = r.padding ? r.padding : e ? 1 : 4;
                var o, a = s$n(r);
                if (4 === t)
                    o = function (r, n) {
                        var e = r.modulus.byteLength(), t = n.length, o = m$k("sha1").update(B$b.alloc(0)).digest(), a = o.length, i = 2 * a;
                        if (t > e - i - 2)
                            throw new Error("message too long");
                        var l = B$b.alloc(e - t - i - 2), f = e - a - 1, u = g$g(a), c = v$j(B$b.concat([o, l, B$b.alloc(1, 1), n], f), w$h(u, f)), p = v$j(u, w$h(c, a));
                        return new y$k(B$b.concat([B$b.alloc(1), p, c], e));
                    }(a, n);
                else if (1 === t)
                    o = function (r, n, e) {
                        var t, o = n.length, a = r.modulus.byteLength();
                        if (o > a - 11)
                            throw new Error("message too long");
                        t = e ? B$b.alloc(a - o - 3, 255) : function (r) {
                            var n, e = B$b.allocUnsafe(r), t = 0, o = g$g(2 * r), a = 0;
                            for (; t < r;)
                                a === o.length && (o = g$g(2 * r), a = 0), (n = o[a++]) && (e[t++] = n);
                            return e;
                        }(a - o - 3);
                        return new y$k(B$b.concat([B$b.from([0, e ? 1 : 2]), t, B$b.alloc(1), n], a));
                    }(a, n, e);
                else {
                    if (3 !== t)
                        throw new Error("unknown padding");
                    if ((o = new y$k(n)).cmp(a.modulus) >= 0)
                        throw new Error("data too long for modulus");
                }
                return e ? b$g(o, a) : E$c(o, a);
            }, L$7 = v$h, k$f = u$n, D$7 = c$m, U$9 = n$c, R$6 = l$d, S$c = h$4, j$9 = h$j, A$b = chunk_6e68c801_js_3.r.Buffer;
            I$a = function (r, n, e) {
                var t;
                t = r.padding ? r.padding : e ? 1 : 4;
                var o, a = L$7(r), i = a.modulus.byteLength();
                if (n.length > i || new U$9(n).cmp(a.modulus) >= 0)
                    throw new Error("decryption error");
                o = e ? j$9(new U$9(n), a) : R$6(n, a);
                var l = A$b.alloc(i - o.length);
                if (o = A$b.concat([l, o], i), 4 === t)
                    return function (r, n) {
                        var e = r.modulus.byteLength(), t = S$c("sha1").update(A$b.alloc(0)).digest(), o = t.length;
                        if (0 !== n[0])
                            throw new Error("decryption error");
                        var a = n.slice(1, o + 1), i = n.slice(o + 1), l = D$7(a, k$f(i, o)), f = D$7(i, k$f(l, e - o - 1));
                        if (function (r, n) {
                            r = A$b.from(r), n = A$b.from(n);
                            var e = 0, t = r.length;
                            r.length !== n.length && (e++, t = Math.min(r.length, n.length));
                            var o = -1;
                            for (; ++o < t;)
                                e += r[o] ^ n[o];
                            return e;
                        }(t, f.slice(0, o)))
                            throw new Error("decryption error");
                        var u = o;
                        for (; 0 === f[u];)
                            u++;
                        if (1 !== f[u++])
                            throw new Error("decryption error");
                        return f.slice(u);
                    }(a, o);
                if (1 === t)
                    return function (r, n, e) {
                        var t = n.slice(0, 2), o = 2, a = 0;
                        for (; 0 !== n[o++];)
                            if (o >= n.length) {
                                a++;
                                break;
                            }
                        var i = n.slice(2, o - 1);
                        ("0002" !== t.toString("hex") && !e || "0001" !== t.toString("hex") && e) && a++;
                        i.length < 8 && a++;
                        if (a)
                            throw new Error("decryption error");
                        return n.slice(o);
                    }(0, o, e);
                if (3 === t)
                    return o;
                throw new Error("unknown padding");
            }, M$9 = {};
            M$9.publicEncrypt = x$9, M$9.privateDecrypt = I$a, M$9.privateEncrypt = function (r, n) {
                return M$9.publicEncrypt(r, n, !0);
            }, M$9.publicDecrypt = function (r, n) {
                return M$9.privateDecrypt(r, n, !0);
            };
            o$r = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, t$b = {}, f$t = chunk_0c2d1322_js_3.h;
            u$o = chunk_6e68c801_js_3.r, a$o = a, s$o = u$o.Buffer, l$p = u$o.kMaxLength, m$l = o$r.crypto || o$r.msCrypto, p$q = Math.pow(2, 32) - 1;
            m$l && m$l.getRandomValues || !f$t.browser ? (t$b.randomFill = function (r, e, n, t) {
                if (!(s$o.isBuffer(r) || r instanceof o$r.Uint8Array))
                    throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
                if ("function" == typeof e)
                    t = e, e = 0, n = r.length;
                else if ("function" == typeof n)
                    t = n, n = r.length - e;
                else if ("function" != typeof t)
                    throw new TypeError('"cb" argument must be a function');
                return y$l(e, r.length), b$h(n, e, r.length), w$i(r, e, n, t);
            }, t$b.randomFillSync = function (r, e, n) {
                void 0 === e && (e = 0);
                if (!(s$o.isBuffer(r) || r instanceof o$r.Uint8Array))
                    throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
                y$l(e, r.length), void 0 === n && (n = r.length - e);
                return b$h(n, e, r.length), w$i(r, e, n);
            }) : (t$b.randomFill = i$d, t$b.randomFillSync = i$d);
            l$q = {};
            l$q.randomBytes = l$q.rng = l$q.pseudoRandomBytes = l$q.prng = a, l$q.createHash = l$q.Hash = h$4, l$q.createHmac = l$q.Hmac = w$3;
            D$8 = s$4, s$p = Object.keys(D$8), _$g = ["sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160"].concat(s$p);
            l$q.getHashes = function () {
                return _$g;
            };
            h$k = M$1;
            l$q.pbkdf2 = h$k.pbkdf2, l$q.pbkdf2Sync = h$k.pbkdf2Sync;
            y$m = p$d;
            l$q.Cipher = y$m.Cipher, l$q.createCipher = y$m.createCipher, l$q.Cipheriv = y$m.Cipheriv, l$q.createCipheriv = y$m.createCipheriv, l$q.Decipher = y$m.Decipher, l$q.createDecipher = y$m.createDecipher, l$q.Decipheriv = y$m.Decipheriv, l$q.createDecipheriv = y$m.createDecipheriv, l$q.getCiphers = y$m.getCiphers, l$q.listCiphers = y$m.listCiphers;
            E$d = O$3;
            l$q.DiffieHellmanGroup = E$d.DiffieHellmanGroup, l$q.createDiffieHellmanGroup = E$d.createDiffieHellmanGroup, l$q.getDiffieHellman = E$d.getDiffieHellman, l$q.createDiffieHellman = E$d.createDiffieHellman, l$q.DiffieHellman = E$d.DiffieHellman;
            S$d = z$8;
            l$q.createSign = S$d.createSign, l$q.Sign = S$d.Sign, l$q.createVerify = S$d.createVerify, l$q.Verify = S$d.Verify, l$q.createECDH = f$r;
            C$8 = M$9;
            l$q.publicEncrypt = C$8.publicEncrypt, l$q.privateEncrypt = C$8.privateEncrypt, l$q.publicDecrypt = C$8.publicDecrypt, l$q.privateDecrypt = C$8.privateDecrypt;
            N$6 = t$b;
            l$q.randomFill = N$6.randomFill, l$q.randomFillSync = N$6.randomFillSync, l$q.createCredentials = function () {
                throw new Error(["sorry, createCredentials is not implemented yet", "we accept pull requests", "https://github.com/crypto-browserify/crypto-browserify"].join("\n"));
            }, l$q.constants = {
                DH_CHECK_P_NOT_SAFE_PRIME: 2,
                DH_CHECK_P_NOT_PRIME: 1,
                DH_UNABLE_TO_CHECK_GENERATOR: 4,
                DH_NOT_SUITABLE_GENERATOR: 8,
                NPN_ENABLED: 1,
                ALPN_ENABLED: 1,
                RSA_PKCS1_PADDING: 1,
                RSA_SSLV23_PADDING: 2,
                RSA_NO_PADDING: 3,
                RSA_PKCS1_OAEP_PADDING: 4,
                RSA_X931_PADDING: 5,
                RSA_PKCS1_PSS_PADDING: 6,
                POINT_CONVERSION_COMPRESSED: 2,
                POINT_CONVERSION_UNCOMPRESSED: 4,
                POINT_CONVERSION_HYBRID: 6
            };
            Cipher = l$q.Cipher;
            exports_12("Cipher", Cipher);
            Cipheriv = l$q.Cipheriv;
            exports_12("Cipheriv", Cipheriv);
            Decipher = l$q.Decipher;
            exports_12("Decipher", Decipher);
            Decipheriv = l$q.Decipheriv;
            exports_12("Decipheriv", Decipheriv);
            DiffieHellman = l$q.DiffieHellman;
            exports_12("DiffieHellman", DiffieHellman);
            DiffieHellmanGroup = l$q.DiffieHellmanGroup;
            exports_12("DiffieHellmanGroup", DiffieHellmanGroup);
            Hash = l$q.Hash;
            exports_12("Hash", Hash);
            Hmac = l$q.Hmac;
            exports_12("Hmac", Hmac);
            Sign = l$q.Sign;
            exports_12("Sign", Sign);
            Verify = l$q.Verify;
            exports_12("Verify", Verify);
            constants = l$q.constants;
            exports_12("constants", constants);
            createCipher = l$q.createCipher;
            exports_12("createCipher", createCipher);
            createCipheriv = l$q.createCipheriv;
            exports_12("createCipheriv", createCipheriv);
            createCredentials = l$q.createCredentials;
            exports_12("createCredentials", createCredentials);
            createDecipher = l$q.createDecipher;
            exports_12("createDecipher", createDecipher);
            createDecipheriv = l$q.createDecipheriv;
            exports_12("createDecipheriv", createDecipheriv);
            createDiffieHellman = l$q.createDiffieHellman;
            exports_12("createDiffieHellman", createDiffieHellman);
            createDiffieHellmanGroup = l$q.createDiffieHellmanGroup;
            exports_12("createDiffieHellmanGroup", createDiffieHellmanGroup);
            createECDH = l$q.createECDH;
            exports_12("createECDH", createECDH);
            createHash = l$q.createHash;
            exports_12("createHash", createHash);
            createHmac = l$q.createHmac;
            exports_12("createHmac", createHmac);
            createSign = l$q.createSign;
            exports_12("createSign", createSign);
            createVerify = l$q.createVerify;
            exports_12("createVerify", createVerify);
            getCiphers = l$q.getCiphers;
            exports_12("getCiphers", getCiphers);
            getDiffieHellman = l$q.getDiffieHellman;
            exports_12("getDiffieHellman", getDiffieHellman);
            getHashes = l$q.getHashes;
            exports_12("getHashes", getHashes);
            listCiphers = l$q.listCiphers;
            exports_12("listCiphers", listCiphers);
            pbkdf2 = l$q.pbkdf2;
            exports_12("pbkdf2", pbkdf2);
            pbkdf2Sync = l$q.pbkdf2Sync;
            exports_12("pbkdf2Sync", pbkdf2Sync);
            privateDecrypt = l$q.privateDecrypt;
            exports_12("privateDecrypt", privateDecrypt);
            privateEncrypt = l$q.privateEncrypt;
            exports_12("privateEncrypt", privateEncrypt);
            prng = l$q.prng;
            exports_12("prng", prng);
            pseudoRandomBytes = l$q.pseudoRandomBytes;
            exports_12("pseudoRandomBytes", pseudoRandomBytes);
            publicDecrypt = l$q.publicDecrypt;
            exports_12("publicDecrypt", publicDecrypt);
            publicEncrypt = l$q.publicEncrypt;
            exports_12("publicEncrypt", publicEncrypt);
            randomBytes = l$q.randomBytes;
            exports_12("randomBytes", randomBytes);
            randomFill = l$q.randomFill;
            exports_12("randomFill", randomFill);
            randomFillSync = l$q.randomFillSync;
            exports_12("randomFillSync", randomFillSync);
            rng = l$q.rng;
            exports_12("rng", rng);
            exports_12("default", l$q);
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1/nodelibs/crypto", ["https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/crypto", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-dac557ba", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-0c2d1322", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/buffer", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/util", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-6e68c801", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/events", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/chunk-cffba9d4", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/stream", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/string_decoder", "https://dev.jspm.io/npm:@jspm/core@1.1.1/nodelibs/vm"], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var exportedNames_1 = {};
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_13(exports);
    }
    return {
        setters: [
            function (crypto_js_1_1) {
                exportStar_1(crypto_js_1_1);
                exports_13({
                    "default": crypto_js_1_1["default"]
                });
            },
            function (_10) {
            },
            function (_11) {
            },
            function (_12) {
            },
            function (_13) {
            },
            function (_14) {
            },
            function (_15) {
            },
            function (_16) {
            },
            function (_17) {
            },
            function (_18) {
            },
            function (_19) {
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://dev.jspm.io/npm:sjcl@1.0.8/sjcl.dew", ["https://dev.jspm.io/npm:@jspm/core@1/nodelibs/crypto"], function (exports_14, context_14) {
    "use strict";
    var crypto_js_2, exports, _dewExec;
    var __moduleName = context_14 && context_14.id;
    function dew() {
        if (_dewExec)
            return exports;
        _dewExec = true;
        var sjcl = {
            cipher: {},
            hash: {},
            keyexchange: {},
            mode: {},
            misc: {},
            codec: {},
            exception: {
                corrupt: function (a) {
                    this.toString = function () {
                        return "CORRUPT: " + this.message;
                    };
                    this.message = a;
                },
                invalid: function (a) {
                    this.toString = function () {
                        return "INVALID: " + this.message;
                    };
                    this.message = a;
                },
                bug: function (a) {
                    this.toString = function () {
                        return "BUG: " + this.message;
                    };
                    this.message = a;
                },
                notReady: function (a) {
                    this.toString = function () {
                        return "NOT READY: " + this.message;
                    };
                    this.message = a;
                }
            }
        };
        sjcl.cipher.aes = function (a) {
            this.s[0][0][0] || this.O();
            var b, c, d, e, f = this.s[0][4], g = this.s[1];
            b = a.length;
            var h = 1;
            if (4 !== b && 6 !== b && 8 !== b)
                throw new sjcl.exception.invalid("invalid aes key size");
            this.b = [d = a.slice(0), e = []];
            for (a = b; a < 4 * b + 28; a++) {
                c = d[a - 1];
                if (0 === a % b || 8 === b && 4 === a % b)
                    c = f[c >>> 24] << 24 ^ f[c >> 16 & 255] << 16 ^ f[c >> 8 & 255] << 8 ^ f[c & 255], 0 === a % b && (c = c << 8 ^ c >>> 24 ^ h << 24, h = h << 1 ^ 283 * (h >> 7));
                d[a] = d[a - b] ^ c;
            }
            for (b = 0; a; b++, a--)
                c = d[b & 3 ? a : a - 4], e[b] = 4 >= a || 4 > b ? c : g[0][f[c >>> 24]] ^ g[1][f[c >> 16 & 255]] ^ g[2][f[c >> 8 & 255]] ^ g[3][f[c & 255]];
        };
        sjcl.cipher.aes.prototype = {
            encrypt: function (a) {
                return t(this, a, 0);
            },
            decrypt: function (a) {
                return t(this, a, 1);
            },
            s: [[[], [], [], [], []], [[], [], [], [], []]],
            O: function () {
                var a = this.s[0], b = this.s[1], c = a[4], d = b[4], e, f, g, h = [], k = [], l, n, m, p;
                for (e = 0; 0x100 > e; e++)
                    k[(h[e] = e << 1 ^ 283 * (e >> 7)) ^ e] = e;
                for (f = g = 0; !c[f]; f ^= l || 1, g = k[g] || 1)
                    for (m = g ^ g << 1 ^ g << 2 ^ g << 3 ^ g << 4, m = m >> 8 ^ m & 255 ^ 99, c[f] = m, d[m] = f, n = h[e = h[l = h[f]]], p = 0x1010101 * n ^ 0x10001 * e ^ 0x101 * l ^ 0x1010100 * f, n = 0x101 * h[m] ^ 0x1010100 * m, e = 0; 4 > e; e++)
                        a[e][f] = n = n << 24 ^ n >>> 8, b[e][m] = p = p << 24 ^ p >>> 8;
                for (e = 0; 5 > e; e++)
                    a[e] = a[e].slice(0), b[e] = b[e].slice(0);
            }
        };
        function t(a, b, c) {
            if (4 !== b.length)
                throw new sjcl.exception.invalid("invalid aes block size");
            var d = a.b[c], e = b[0] ^ d[0], f = b[c ? 3 : 1] ^ d[1], g = b[2] ^ d[2];
            b = b[c ? 1 : 3] ^ d[3];
            var h, k, l, n = d.length / 4 - 2, m, p = 4, r = [0, 0, 0, 0];
            h = a.s[c];
            a = h[0];
            var q = h[1], v = h[2], w = h[3], x = h[4];
            for (m = 0; m < n; m++)
                h = a[e >>> 24] ^ q[f >> 16 & 255] ^ v[g >> 8 & 255] ^ w[b & 255] ^ d[p], k = a[f >>> 24] ^ q[g >> 16 & 255] ^ v[b >> 8 & 255] ^ w[e & 255] ^ d[p + 1], l = a[g >>> 24] ^ q[b >> 16 & 255] ^ v[e >> 8 & 255] ^ w[f & 255] ^ d[p + 2], b = a[b >>> 24] ^ q[e >> 16 & 255] ^ v[f >> 8 & 255] ^ w[g & 255] ^ d[p + 3], p += 4, e = h, f = k, g = l;
            for (m = 0; 4 > m; m++)
                r[c ? 3 & -m : m] = x[e >>> 24] << 24 ^ x[f >> 16 & 255] << 16 ^ x[g >> 8 & 255] << 8 ^ x[b & 255] ^ d[p++], h = e, e = f, f = g, g = b, b = h;
            return r;
        }
        sjcl.bitArray = {
            bitSlice: function (a, b, c) {
                a = sjcl.bitArray.$(a.slice(b / 32), 32 - (b & 31)).slice(1);
                return void 0 === c ? a : sjcl.bitArray.clamp(a, c - b);
            },
            extract: function (a, b, c) {
                var d = Math.floor(-b - c & 31);
                return ((b + c - 1 ^ b) & -32 ? a[b / 32 | 0] << 32 - d ^ a[b / 32 + 1 | 0] >>> d : a[b / 32 | 0] >>> d) & (1 << c) - 1;
            },
            concat: function (a, b) {
                if (0 === a.length || 0 === b.length)
                    return a.concat(b);
                var c = a[a.length - 1], d = sjcl.bitArray.getPartial(c);
                return 32 === d ? a.concat(b) : sjcl.bitArray.$(b, d, c | 0, a.slice(0, a.length - 1));
            },
            bitLength: function (a) {
                var b = a.length;
                return 0 === b ? 0 : 32 * (b - 1) + sjcl.bitArray.getPartial(a[b - 1]);
            },
            clamp: function (a, b) {
                if (32 * a.length < b)
                    return a;
                a = a.slice(0, Math.ceil(b / 32));
                var c = a.length;
                b = b & 31;
                0 < c && b && (a[c - 1] = sjcl.bitArray.partial(b, a[c - 1] & 2147483648 >> b - 1, 1));
                return a;
            },
            partial: function (a, b, c) {
                return 32 === a ? b : (c ? b | 0 : b << 32 - a) + 0x10000000000 * a;
            },
            getPartial: function (a) {
                return Math.round(a / 0x10000000000) || 32;
            },
            equal: function (a, b) {
                if (sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b))
                    return !1;
                var c = 0, d;
                for (d = 0; d < a.length; d++)
                    c |= a[d] ^ b[d];
                return 0 === c;
            },
            $: function (a, b, c, d) {
                var e;
                e = 0;
                for (void 0 === d && (d = []); 32 <= b; b -= 32)
                    d.push(c), c = 0;
                if (0 === b)
                    return d.concat(a);
                for (e = 0; e < a.length; e++)
                    d.push(c | a[e] >>> b), c = a[e] << 32 - b;
                e = a.length ? a[a.length - 1] : 0;
                a = sjcl.bitArray.getPartial(e);
                d.push(sjcl.bitArray.partial(b + a & 31, 32 < b + a ? c : d.pop(), 1));
                return d;
            },
            i: function (a, b) {
                return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]];
            },
            byteswapM: function (a) {
                var b, c;
                for (b = 0; b < a.length; ++b)
                    c = a[b], a[b] = c >>> 24 | c >>> 8 & 0xff00 | (c & 0xff00) << 8 | c << 24;
                return a;
            }
        };
        sjcl.codec.utf8String = {
            fromBits: function (a) {
                var b = "", c = sjcl.bitArray.bitLength(a), d, e;
                for (d = 0; d < c / 8; d++)
                    0 === (d & 3) && (e = a[d / 4]), b += String.fromCharCode(e >>> 8 >>> 8 >>> 8), e <<= 8;
                return decodeURIComponent(escape(b));
            },
            toBits: function (a) {
                a = unescape(encodeURIComponent(a));
                var b = [], c, d = 0;
                for (c = 0; c < a.length; c++)
                    d = d << 8 | a.charCodeAt(c), 3 === (c & 3) && (b.push(d), d = 0);
                c & 3 && b.push(sjcl.bitArray.partial(8 * (c & 3), d));
                return b;
            }
        };
        sjcl.codec.hex = {
            fromBits: function (a) {
                var b = "", c;
                for (c = 0; c < a.length; c++)
                    b += ((a[c] | 0) + 0xf00000000000).toString(16).substr(4);
                return b.substr(0, sjcl.bitArray.bitLength(a) / 4);
            },
            toBits: function (a) {
                var b, c = [], d;
                a = a.replace(/\s|0x/g, "");
                d = a.length;
                a = a + "00000000";
                for (b = 0; b < a.length; b += 8)
                    c.push(parseInt(a.substr(b, 8), 16) ^ 0);
                return sjcl.bitArray.clamp(c, 4 * d);
            }
        };
        sjcl.codec.base32 = {
            B: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
            X: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
            BITS: 32,
            BASE: 5,
            REMAINING: 27,
            fromBits: function (a, b, c) {
                var d = sjcl.codec.base32.BASE, e = sjcl.codec.base32.REMAINING, f = "", g = 0, h = sjcl.codec.base32.B, k = 0, l = sjcl.bitArray.bitLength(a);
                c && (h = sjcl.codec.base32.X);
                for (c = 0; f.length * d < l;)
                    f += h.charAt((k ^ a[c] >>> g) >>> e), g < d ? (k = a[c] << d - g, g += e, c++) : (k <<= d, g -= d);
                for (; f.length & 7 && !b;)
                    f += "=";
                return f;
            },
            toBits: function (a, b) {
                a = a.replace(/\s|=/g, "").toUpperCase();
                var c = sjcl.codec.base32.BITS, d = sjcl.codec.base32.BASE, e = sjcl.codec.base32.REMAINING, f = [], g, h = 0, k = sjcl.codec.base32.B, l = 0, n, m = "base32";
                b && (k = sjcl.codec.base32.X, m = "base32hex");
                for (g = 0; g < a.length; g++) {
                    n = k.indexOf(a.charAt(g));
                    if (0 > n) {
                        if (!b)
                            try {
                                return sjcl.codec.base32hex.toBits(a);
                            }
                            catch (p) { }
                        throw new sjcl.exception.invalid("this isn't " + m + "!");
                    }
                    h > e ? (h -= e, f.push(l ^ n >>> h), l = n << c - h) : (h += d, l ^= n << c - h);
                }
                h & 56 && f.push(sjcl.bitArray.partial(h & 56, l, 1));
                return f;
            }
        };
        sjcl.codec.base32hex = {
            fromBits: function (a, b) {
                return sjcl.codec.base32.fromBits(a, b, 1);
            },
            toBits: function (a) {
                return sjcl.codec.base32.toBits(a, 1);
            }
        };
        sjcl.codec.base64 = {
            B: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            fromBits: function (a, b, c) {
                var d = "", e = 0, f = sjcl.codec.base64.B, g = 0, h = sjcl.bitArray.bitLength(a);
                c && (f = f.substr(0, 62) + "-_");
                for (c = 0; 6 * d.length < h;)
                    d += f.charAt((g ^ a[c] >>> e) >>> 26), 6 > e ? (g = a[c] << 6 - e, e += 26, c++) : (g <<= 6, e -= 6);
                for (; d.length & 3 && !b;)
                    d += "=";
                return d;
            },
            toBits: function (a, b) {
                a = a.replace(/\s|=/g, "");
                var c = [], d, e = 0, f = sjcl.codec.base64.B, g = 0, h;
                b && (f = f.substr(0, 62) + "-_");
                for (d = 0; d < a.length; d++) {
                    h = f.indexOf(a.charAt(d));
                    if (0 > h)
                        throw new sjcl.exception.invalid("this isn't base64!");
                    26 < e ? (e -= 26, c.push(g ^ h >>> e), g = h << 32 - e) : (e += 6, g ^= h << 32 - e);
                }
                e & 56 && c.push(sjcl.bitArray.partial(e & 56, g, 1));
                return c;
            }
        };
        sjcl.codec.base64url = {
            fromBits: function (a) {
                return sjcl.codec.base64.fromBits(a, 1, 1);
            },
            toBits: function (a) {
                return sjcl.codec.base64.toBits(a, 1);
            }
        };
        sjcl.hash.sha256 = function (a) {
            this.b[0] || this.O();
            a ? (this.F = a.F.slice(0), this.A = a.A.slice(0), this.l = a.l) : this.reset();
        };
        sjcl.hash.sha256.hash = function (a) {
            return new sjcl.hash.sha256().update(a).finalize();
        };
        sjcl.hash.sha256.prototype = {
            blockSize: 512,
            reset: function () {
                this.F = this.Y.slice(0);
                this.A = [];
                this.l = 0;
                return this;
            },
            update: function (a) {
                "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a));
                var b, c = this.A = sjcl.bitArray.concat(this.A, a);
                b = this.l;
                a = this.l = b + sjcl.bitArray.bitLength(a);
                if (0x1fffffffffffff < a)
                    throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");
                if ("undefined" !== typeof Uint32Array) {
                    var d = new Uint32Array(c), e = 0;
                    for (b = 512 + b - (512 + b & 0x1ff); b <= a; b += 512)
                        u(this, d.subarray(16 * e, 16 * (e + 1))), e += 1;
                    c.splice(0, 16 * e);
                }
                else
                    for (b = 512 + b - (512 + b & 0x1ff); b <= a; b += 512)
                        u(this, c.splice(0, 16));
                return this;
            },
            finalize: function () {
                var a, b = this.A, c = this.F, b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)]);
                for (a = b.length + 2; a & 15; a++)
                    b.push(0);
                b.push(Math.floor(this.l / 0x100000000));
                for (b.push(this.l | 0); b.length;)
                    u(this, b.splice(0, 16));
                this.reset();
                return c;
            },
            Y: [],
            b: [],
            O: function () {
                function a(a) {
                    return 0x100000000 * (a - Math.floor(a)) | 0;
                }
                for (var b = 0, c = 2, d, e; 64 > b; c++) {
                    e = !0;
                    for (d = 2; d * d <= c; d++)
                        if (0 === c % d) {
                            e = !1;
                            break;
                        }
                    e && (8 > b && (this.Y[b] = a(Math.pow(c, .5))), this.b[b] = a(Math.pow(c, 1 / 3)), b++);
                }
            }
        };
        function u(a, b) {
            var c, d, e, f = a.F, g = a.b, h = f[0], k = f[1], l = f[2], n = f[3], m = f[4], p = f[5], r = f[6], q = f[7];
            for (c = 0; 64 > c; c++)
                16 > c ? d = b[c] : (d = b[c + 1 & 15], e = b[c + 14 & 15], d = b[c & 15] = (d >>> 7 ^ d >>> 18 ^ d >>> 3 ^ d << 25 ^ d << 14) + (e >>> 17 ^ e >>> 19 ^ e >>> 10 ^ e << 15 ^ e << 13) + b[c & 15] + b[c + 9 & 15] | 0), d = d + q + (m >>> 6 ^ m >>> 11 ^ m >>> 25 ^ m << 26 ^ m << 21 ^ m << 7) + (r ^ m & (p ^ r)) + g[c], q = r, r = p, p = m, m = n + d | 0, n = l, l = k, k = h, h = d + (k & l ^ n & (k ^ l)) + (k >>> 2 ^ k >>> 13 ^ k >>> 22 ^ k << 30 ^ k << 19 ^ k << 10) | 0;
            f[0] = f[0] + h | 0;
            f[1] = f[1] + k | 0;
            f[2] = f[2] + l | 0;
            f[3] = f[3] + n | 0;
            f[4] = f[4] + m | 0;
            f[5] = f[5] + p | 0;
            f[6] = f[6] + r | 0;
            f[7] = f[7] + q | 0;
        }
        sjcl.mode.ccm = {
            name: "ccm",
            G: [],
            listenProgress: function (a) {
                sjcl.mode.ccm.G.push(a);
            },
            unListenProgress: function (a) {
                a = sjcl.mode.ccm.G.indexOf(a);
                -1 < a && sjcl.mode.ccm.G.splice(a, 1);
            },
            fa: function (a) {
                var b = sjcl.mode.ccm.G.slice(), c;
                for (c = 0; c < b.length; c += 1)
                    b[c](a);
            },
            encrypt: function (a, b, c, d, e) {
                var f, g = b.slice(0), h = sjcl.bitArray, k = h.bitLength(c) / 8, l = h.bitLength(g) / 8;
                e = e || 64;
                d = d || [];
                if (7 > k)
                    throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");
                for (f = 2; 4 > f && l >>> 8 * f; f++)
                    ;
                f < 15 - k && (f = 15 - k);
                c = h.clamp(c, 8 * (15 - f));
                b = sjcl.mode.ccm.V(a, b, c, d, e, f);
                g = sjcl.mode.ccm.C(a, g, c, b, e, f);
                return h.concat(g.data, g.tag);
            },
            decrypt: function (a, b, c, d, e) {
                e = e || 64;
                d = d || [];
                var f = sjcl.bitArray, g = f.bitLength(c) / 8, h = f.bitLength(b), k = f.clamp(b, h - e), l = f.bitSlice(b, h - e), h = (h - e) / 8;
                if (7 > g)
                    throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");
                for (b = 2; 4 > b && h >>> 8 * b; b++)
                    ;
                b < 15 - g && (b = 15 - g);
                c = f.clamp(c, 8 * (15 - b));
                k = sjcl.mode.ccm.C(a, k, c, l, e, b);
                a = sjcl.mode.ccm.V(a, k.data, c, d, e, b);
                if (!f.equal(k.tag, a))
                    throw new sjcl.exception.corrupt("ccm: tag doesn't match");
                return k.data;
            },
            na: function (a, b, c, d, e, f) {
                var g = [], h = sjcl.bitArray, k = h.i;
                d = [h.partial(8, (b.length ? 64 : 0) | d - 2 << 2 | f - 1)];
                d = h.concat(d, c);
                d[3] |= e;
                d = a.encrypt(d);
                if (b.length)
                    for (c = h.bitLength(b) / 8, 65279 >= c ? g = [h.partial(16, c)] : 0xffffffff >= c && (g = h.concat([h.partial(16, 65534)], [c])), g = h.concat(g, b), b = 0; b < g.length; b += 4)
                        d = a.encrypt(k(d, g.slice(b, b + 4).concat([0, 0, 0])));
                return d;
            },
            V: function (a, b, c, d, e, f) {
                var g = sjcl.bitArray, h = g.i;
                e /= 8;
                if (e % 2 || 4 > e || 16 < e)
                    throw new sjcl.exception.invalid("ccm: invalid tag length");
                if (0xffffffff < d.length || 0xffffffff < b.length)
                    throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");
                c = sjcl.mode.ccm.na(a, d, c, e, g.bitLength(b) / 8, f);
                for (d = 0; d < b.length; d += 4)
                    c = a.encrypt(h(c, b.slice(d, d + 4).concat([0, 0, 0])));
                return g.clamp(c, 8 * e);
            },
            C: function (a, b, c, d, e, f) {
                var g, h = sjcl.bitArray;
                g = h.i;
                var k = b.length, l = h.bitLength(b), n = k / 50, m = n;
                c = h.concat([h.partial(8, f - 1)], c).concat([0, 0, 0]).slice(0, 4);
                d = h.bitSlice(g(d, a.encrypt(c)), 0, e);
                if (!k)
                    return {
                        tag: d,
                        data: []
                    };
                for (g = 0; g < k; g += 4)
                    g > n && (sjcl.mode.ccm.fa(g / k), n += m), c[3]++, e = a.encrypt(c), b[g] ^= e[0], b[g + 1] ^= e[1], b[g + 2] ^= e[2], b[g + 3] ^= e[3];
                return {
                    tag: d,
                    data: h.clamp(b, l)
                };
            }
        };
        sjcl.mode.ocb2 = {
            name: "ocb2",
            encrypt: function (a, b, c, d, e, f) {
                if (128 !== sjcl.bitArray.bitLength(c))
                    throw new sjcl.exception.invalid("ocb iv must be 128 bits");
                var g, h = sjcl.mode.ocb2.S, k = sjcl.bitArray, l = k.i, n = [0, 0, 0, 0];
                c = h(a.encrypt(c));
                var m, p = [];
                d = d || [];
                e = e || 64;
                for (g = 0; g + 4 < b.length; g += 4)
                    m = b.slice(g, g + 4), n = l(n, m), p = p.concat(l(c, a.encrypt(l(c, m)))), c = h(c);
                m = b.slice(g);
                b = k.bitLength(m);
                g = a.encrypt(l(c, [0, 0, 0, b]));
                m = k.clamp(l(m.concat([0, 0, 0]), g), b);
                n = l(n, l(m.concat([0, 0, 0]), g));
                n = a.encrypt(l(n, l(c, h(c))));
                d.length && (n = l(n, f ? d : sjcl.mode.ocb2.pmac(a, d)));
                return p.concat(k.concat(m, k.clamp(n, e)));
            },
            decrypt: function (a, b, c, d, e, f) {
                if (128 !== sjcl.bitArray.bitLength(c))
                    throw new sjcl.exception.invalid("ocb iv must be 128 bits");
                e = e || 64;
                var g = sjcl.mode.ocb2.S, h = sjcl.bitArray, k = h.i, l = [0, 0, 0, 0], n = g(a.encrypt(c)), m, p, r = sjcl.bitArray.bitLength(b) - e, q = [];
                d = d || [];
                for (c = 0; c + 4 < r / 32; c += 4)
                    m = k(n, a.decrypt(k(n, b.slice(c, c + 4)))), l = k(l, m), q = q.concat(m), n = g(n);
                p = r - 32 * c;
                m = a.encrypt(k(n, [0, 0, 0, p]));
                m = k(m, h.clamp(b.slice(c), p).concat([0, 0, 0]));
                l = k(l, m);
                l = a.encrypt(k(l, k(n, g(n))));
                d.length && (l = k(l, f ? d : sjcl.mode.ocb2.pmac(a, d)));
                if (!h.equal(h.clamp(l, e), h.bitSlice(b, r)))
                    throw new sjcl.exception.corrupt("ocb: tag doesn't match");
                return q.concat(h.clamp(m, p));
            },
            pmac: function (a, b) {
                var c, d = sjcl.mode.ocb2.S, e = sjcl.bitArray, f = e.i, g = [0, 0, 0, 0], h = a.encrypt([0, 0, 0, 0]), h = f(h, d(d(h)));
                for (c = 0; c + 4 < b.length; c += 4)
                    h = d(h), g = f(g, a.encrypt(f(h, b.slice(c, c + 4))));
                c = b.slice(c);
                128 > e.bitLength(c) && (h = f(h, d(h)), c = e.concat(c, [-2147483648, 0, 0, 0]));
                g = f(g, c);
                return a.encrypt(f(d(f(h, d(h))), g));
            },
            S: function (a) {
                return [a[0] << 1 ^ a[1] >>> 31, a[1] << 1 ^ a[2] >>> 31, a[2] << 1 ^ a[3] >>> 31, a[3] << 1 ^ 135 * (a[0] >>> 31)];
            }
        };
        sjcl.mode.gcm = {
            name: "gcm",
            encrypt: function (a, b, c, d, e) {
                var f = b.slice(0);
                b = sjcl.bitArray;
                d = d || [];
                a = sjcl.mode.gcm.C(!0, a, f, d, c, e || 128);
                return b.concat(a.data, a.tag);
            },
            decrypt: function (a, b, c, d, e) {
                var f = b.slice(0), g = sjcl.bitArray, h = g.bitLength(f);
                e = e || 128;
                d = d || [];
                e <= h ? (b = g.bitSlice(f, h - e), f = g.bitSlice(f, 0, h - e)) : (b = f, f = []);
                a = sjcl.mode.gcm.C(!1, a, f, d, c, e);
                if (!g.equal(a.tag, b))
                    throw new sjcl.exception.corrupt("gcm: tag doesn't match");
                return a.data;
            },
            ka: function (a, b) {
                var c, d, e, f, g, h = sjcl.bitArray.i;
                e = [0, 0, 0, 0];
                f = b.slice(0);
                for (c = 0; 128 > c; c++) {
                    (d = 0 !== (a[Math.floor(c / 32)] & 1 << 31 - c % 32)) && (e = h(e, f));
                    g = 0 !== (f[3] & 1);
                    for (d = 3; 0 < d; d--)
                        f[d] = f[d] >>> 1 | (f[d - 1] & 1) << 31;
                    f[0] >>>= 1;
                    g && (f[0] ^= -0x1f000000);
                }
                return e;
            },
            j: function (a, b, c) {
                var d, e = c.length;
                b = b.slice(0);
                for (d = 0; d < e; d += 4)
                    b[0] ^= 0xffffffff & c[d], b[1] ^= 0xffffffff & c[d + 1], b[2] ^= 0xffffffff & c[d + 2], b[3] ^= 0xffffffff & c[d + 3], b = sjcl.mode.gcm.ka(b, a);
                return b;
            },
            C: function (a, b, c, d, e, f) {
                var g, h, k, l, n, m, p, r, q = sjcl.bitArray;
                m = c.length;
                p = q.bitLength(c);
                r = q.bitLength(d);
                h = q.bitLength(e);
                g = b.encrypt([0, 0, 0, 0]);
                96 === h ? (e = e.slice(0), e = q.concat(e, [1])) : (e = sjcl.mode.gcm.j(g, [0, 0, 0, 0], e), e = sjcl.mode.gcm.j(g, e, [0, 0, Math.floor(h / 0x100000000), h & 0xffffffff]));
                h = sjcl.mode.gcm.j(g, [0, 0, 0, 0], d);
                n = e.slice(0);
                d = h.slice(0);
                a || (d = sjcl.mode.gcm.j(g, h, c));
                for (l = 0; l < m; l += 4)
                    n[3]++, k = b.encrypt(n), c[l] ^= k[0], c[l + 1] ^= k[1], c[l + 2] ^= k[2], c[l + 3] ^= k[3];
                c = q.clamp(c, p);
                a && (d = sjcl.mode.gcm.j(g, h, c));
                a = [Math.floor(r / 0x100000000), r & 0xffffffff, Math.floor(p / 0x100000000), p & 0xffffffff];
                d = sjcl.mode.gcm.j(g, d, a);
                k = b.encrypt(e);
                d[0] ^= k[0];
                d[1] ^= k[1];
                d[2] ^= k[2];
                d[3] ^= k[3];
                return {
                    tag: q.bitSlice(d, 0, f),
                    data: c
                };
            }
        };
        sjcl.misc.hmac = function (a, b) {
            this.W = b = b || sjcl.hash.sha256;
            var c = [[], []], d, e = b.prototype.blockSize / 32;
            this.w = [new b(), new b()];
            a.length > e && (a = b.hash(a));
            for (d = 0; d < e; d++)
                c[0][d] = a[d] ^ 909522486, c[1][d] = a[d] ^ 1549556828;
            this.w[0].update(c[0]);
            this.w[1].update(c[1]);
            this.R = new b(this.w[0]);
        };
        sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function (a) {
            if (this.aa)
                throw new sjcl.exception.invalid("encrypt on already updated hmac called!");
            this.update(a);
            return this.digest(a);
        };
        sjcl.misc.hmac.prototype.reset = function () {
            this.R = new this.W(this.w[0]);
            this.aa = !1;
        };
        sjcl.misc.hmac.prototype.update = function (a) {
            this.aa = !0;
            this.R.update(a);
        };
        sjcl.misc.hmac.prototype.digest = function () {
            var a = this.R.finalize(), a = new this.W(this.w[1]).update(a).finalize();
            this.reset();
            return a;
        };
        sjcl.misc.pbkdf2 = function (a, b, c, d, e) {
            c = c || 1E4;
            if (0 > d || 0 > c)
                throw new sjcl.exception.invalid("invalid params to pbkdf2");
            "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a));
            "string" === typeof b && (b = sjcl.codec.utf8String.toBits(b));
            e = e || sjcl.misc.hmac;
            a = new e(a);
            var f, g, h, k, l = [], n = sjcl.bitArray;
            for (k = 1; 32 * l.length < (d || 1); k++) {
                e = f = a.encrypt(n.concat(b, [k]));
                for (g = 1; g < c; g++)
                    for (f = a.encrypt(f), h = 0; h < f.length; h++)
                        e[h] ^= f[h];
                l = l.concat(e);
            }
            d && (l = n.clamp(l, d));
            return l;
        };
        sjcl.prng = function (a) {
            this.c = [new sjcl.hash.sha256()];
            this.m = [0];
            this.P = 0;
            this.H = {};
            this.N = 0;
            this.U = {};
            this.Z = this.f = this.o = this.ha = 0;
            this.b = [0, 0, 0, 0, 0, 0, 0, 0];
            this.h = [0, 0, 0, 0];
            this.L = void 0;
            this.M = a;
            this.D = !1;
            this.K = {
                progress: {},
                seeded: {}
            };
            this.u = this.ga = 0;
            this.I = 1;
            this.J = 2;
            this.ca = 0x10000;
            this.T = [0, 48, 64, 96, 128, 192, 0x100, 384, 512, 768, 1024];
            this.da = 3E4;
            this.ba = 80;
        };
        sjcl.prng.prototype = {
            randomWords: function (a, b) {
                var c = [], d;
                d = this.isReady(b);
                var e;
                if (d === this.u)
                    throw new sjcl.exception.notReady("generator isn't seeded");
                if (d & this.J) {
                    d = !(d & this.I);
                    e = [];
                    var f = 0, g;
                    this.Z = e[0] = new Date().valueOf() + this.da;
                    for (g = 0; 16 > g; g++)
                        e.push(0x100000000 * Math.random() | 0);
                    for (g = 0; g < this.c.length && (e = e.concat(this.c[g].finalize()), f += this.m[g], this.m[g] = 0, d || !(this.P & 1 << g)); g++)
                        ;
                    this.P >= 1 << this.c.length && (this.c.push(new sjcl.hash.sha256()), this.m.push(0));
                    this.f -= f;
                    f > this.o && (this.o = f);
                    this.P++;
                    this.b = sjcl.hash.sha256.hash(this.b.concat(e));
                    this.L = new sjcl.cipher.aes(this.b);
                    for (d = 0; 4 > d && (this.h[d] = this.h[d] + 1 | 0, !this.h[d]); d++)
                        ;
                }
                for (d = 0; d < a; d += 4)
                    0 === (d + 1) % this.ca && y(this), e = z(this), c.push(e[0], e[1], e[2], e[3]);
                y(this);
                return c.slice(0, a);
            },
            setDefaultParanoia: function (a, b) {
                if (0 === a && "Setting paranoia=0 will ruin your security; use it only for testing" !== b)
                    throw new sjcl.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");
                this.M = a;
            },
            addEntropy: function (a, b, c) {
                c = c || "user";
                var d, e, f = new Date().valueOf(), g = this.H[c], h = this.isReady(), k = 0;
                d = this.U[c];
                void 0 === d && (d = this.U[c] = this.ha++);
                void 0 === g && (g = this.H[c] = 0);
                this.H[c] = (this.H[c] + 1) % this.c.length;
                switch (typeof a) {
                    case "number":
                        void 0 === b && (b = 1);
                        this.c[g].update([d, this.N++, 1, b, f, 1, a | 0]);
                        break;
                    case "object":
                        c = Object.prototype.toString.call(a);
                        if ("[object Uint32Array]" === c) {
                            e = [];
                            for (c = 0; c < a.length; c++)
                                e.push(a[c]);
                            a = e;
                        }
                        else
                            for ("[object Array]" !== c && (k = 1), c = 0; c < a.length && !k; c++)
                                "number" !== typeof a[c] && (k = 1);
                        if (!k) {
                            if (void 0 === b)
                                for (c = b = 0; c < a.length; c++)
                                    for (e = a[c]; 0 < e;)
                                        b++, e = e >>> 1;
                            this.c[g].update([d, this.N++, 2, b, f, a.length].concat(a));
                        }
                        break;
                    case "string":
                        void 0 === b && (b = a.length);
                        this.c[g].update([d, this.N++, 3, b, f, a.length]);
                        this.c[g].update(a);
                        break;
                    default:
                        k = 1;
                }
                if (k)
                    throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");
                this.m[g] += b;
                this.f += b;
                h === this.u && (this.isReady() !== this.u && A("seeded", Math.max(this.o, this.f)), A("progress", this.getProgress()));
            },
            isReady: function (a) {
                a = this.T[void 0 !== a ? a : this.M];
                return this.o && this.o >= a ? this.m[0] > this.ba && new Date().valueOf() > this.Z ? this.J | this.I : this.I : this.f >= a ? this.J | this.u : this.u;
            },
            getProgress: function (a) {
                a = this.T[a ? a : this.M];
                return this.o >= a ? 1 : this.f > a ? 1 : this.f / a;
            },
            startCollectors: function () {
                if (!this.D) {
                    this.a = {
                        loadTimeCollector: B(this, this.ma),
                        mouseCollector: B(this, this.oa),
                        keyboardCollector: B(this, this.la),
                        accelerometerCollector: B(this, this.ea),
                        touchCollector: B(this, this.qa)
                    };
                    if (window.addEventListener)
                        window.addEventListener("load", this.a.loadTimeCollector, !1), window.addEventListener("mousemove", this.a.mouseCollector, !1), window.addEventListener("keypress", this.a.keyboardCollector, !1), window.addEventListener("devicemotion", this.a.accelerometerCollector, !1), window.addEventListener("touchmove", this.a.touchCollector, !1);
                    else if (document.attachEvent)
                        document.attachEvent("onload", this.a.loadTimeCollector), document.attachEvent("onmousemove", this.a.mouseCollector), document.attachEvent("keypress", this.a.keyboardCollector);
                    else
                        throw new sjcl.exception.bug("can't attach event");
                    this.D = !0;
                }
            },
            stopCollectors: function () {
                this.D && (window.removeEventListener ? (window.removeEventListener("load", this.a.loadTimeCollector, !1), window.removeEventListener("mousemove", this.a.mouseCollector, !1), window.removeEventListener("keypress", this.a.keyboardCollector, !1), window.removeEventListener("devicemotion", this.a.accelerometerCollector, !1), window.removeEventListener("touchmove", this.a.touchCollector, !1)) : document.detachEvent && (document.detachEvent("onload", this.a.loadTimeCollector), document.detachEvent("onmousemove", this.a.mouseCollector), document.detachEvent("keypress", this.a.keyboardCollector)), this.D = !1);
            },
            addEventListener: function (a, b) {
                this.K[a][this.ga++] = b;
            },
            removeEventListener: function (a, b) {
                var c, d, e = this.K[a], f = [];
                for (d in e)
                    e.hasOwnProperty(d) && e[d] === b && f.push(d);
                for (c = 0; c < f.length; c++)
                    d = f[c], delete e[d];
            },
            la: function () {
                C(this, 1);
            },
            oa: function (a) {
                var b, c;
                try {
                    b = a.x || a.clientX || a.offsetX || 0, c = a.y || a.clientY || a.offsetY || 0;
                }
                catch (d) {
                    c = b = 0;
                }
                0 != b && 0 != c && this.addEntropy([b, c], 2, "mouse");
                C(this, 0);
            },
            qa: function (a) {
                a = a.touches[0] || a.changedTouches[0];
                this.addEntropy([a.pageX || a.clientX, a.pageY || a.clientY], 1, "touch");
                C(this, 0);
            },
            ma: function () {
                C(this, 2);
            },
            ea: function (a) {
                a = a.accelerationIncludingGravity.x || a.accelerationIncludingGravity.y || a.accelerationIncludingGravity.z;
                if (window.orientation) {
                    var b = window.orientation;
                    "number" === typeof b && this.addEntropy(b, 1, "accelerometer");
                }
                a && this.addEntropy(a, 2, "accelerometer");
                C(this, 0);
            }
        };
        function A(a, b) {
            var c, d = sjcl.random.K[a], e = [];
            for (c in d)
                d.hasOwnProperty(c) && e.push(d[c]);
            for (c = 0; c < e.length; c++)
                e[c](b);
        }
        function C(a, b) {
            "undefined" !== typeof window && window.performance && "function" === typeof window.performance.now ? a.addEntropy(window.performance.now(), b, "loadtime") : a.addEntropy(new Date().valueOf(), b, "loadtime");
        }
        function y(a) {
            a.b = z(a).concat(z(a));
            a.L = new sjcl.cipher.aes(a.b);
        }
        function z(a) {
            for (var b = 0; 4 > b && (a.h[b] = a.h[b] + 1 | 0, !a.h[b]); b++)
                ;
            return a.L.encrypt(a.h);
        }
        function B(a, b) {
            return function () {
                b.apply(a, arguments);
            };
        }
        sjcl.random = new sjcl.prng(6);
        a: try {
            var D, E, F, G;
            if (G = exports) {
                var H;
                try {
                    H = crypto_js_2.default;
                }
                catch (a) {
                    H = null;
                }
                G = E = H;
            }
            if (G && E.randomBytes)
                D = E.randomBytes(128), D = new Uint32Array(new Uint8Array(D).buffer), sjcl.random.addEntropy(D, 1024, "crypto['randomBytes']");
            else if ("undefined" !== typeof window && "undefined" !== typeof Uint32Array) {
                F = new Uint32Array(32);
                if (window.crypto && window.crypto.getRandomValues)
                    window.crypto.getRandomValues(F);
                else if (window.msCrypto && window.msCrypto.getRandomValues)
                    window.msCrypto.getRandomValues(F);
                else
                    break a;
                sjcl.random.addEntropy(F, 1024, "crypto['getRandomValues']");
            }
        }
        catch (a) {
            "undefined" !== typeof window && window.console && (console.log("There was an error collecting entropy from the browser:"), console.log(a));
        }
        sjcl.json = {
            defaults: {
                v: 1,
                iter: 1E4,
                ks: 128,
                ts: 64,
                mode: "ccm",
                adata: "",
                cipher: "aes"
            },
            ja: function (a, b, c, d) {
                c = c || {};
                d = d || {};
                var e = sjcl.json, f = e.g({
                    iv: sjcl.random.randomWords(4, 0)
                }, e.defaults), g;
                e.g(f, c);
                c = f.adata;
                "string" === typeof f.salt && (f.salt = sjcl.codec.base64.toBits(f.salt));
                "string" === typeof f.iv && (f.iv = sjcl.codec.base64.toBits(f.iv));
                if (!sjcl.mode[f.mode] || !sjcl.cipher[f.cipher] || "string" === typeof a && 100 >= f.iter || 64 !== f.ts && 96 !== f.ts && 128 !== f.ts || 128 !== f.ks && 192 !== f.ks && 0x100 !== f.ks || 2 > f.iv.length || 4 < f.iv.length)
                    throw new sjcl.exception.invalid("json encrypt: invalid parameters");
                "string" === typeof a ? (g = sjcl.misc.cachedPbkdf2(a, f), a = g.key.slice(0, f.ks / 32), f.salt = g.salt) : sjcl.ecc && a instanceof sjcl.ecc.elGamal.publicKey && (g = a.kem(), f.kemtag = g.tag, a = g.key.slice(0, f.ks / 32));
                "string" === typeof b && (b = sjcl.codec.utf8String.toBits(b));
                "string" === typeof c && (f.adata = c = sjcl.codec.utf8String.toBits(c));
                g = new sjcl.cipher[f.cipher](a);
                e.g(d, f);
                d.key = a;
                f.ct = "ccm" === f.mode && sjcl.arrayBuffer && sjcl.arrayBuffer.ccm && b instanceof ArrayBuffer ? sjcl.arrayBuffer.ccm.encrypt(g, b, f.iv, c, f.ts) : sjcl.mode[f.mode].encrypt(g, b, f.iv, c, f.ts);
                return f;
            },
            encrypt: function (a, b, c, d) {
                var e = sjcl.json, f = e.ja.apply(e, arguments);
                return e.encode(f);
            },
            ia: function (a, b, c, d) {
                c = c || {};
                d = d || {};
                var e = sjcl.json;
                b = e.g(e.g(e.g({}, e.defaults), b), c, !0);
                var f, g;
                f = b.adata;
                "string" === typeof b.salt && (b.salt = sjcl.codec.base64.toBits(b.salt));
                "string" === typeof b.iv && (b.iv = sjcl.codec.base64.toBits(b.iv));
                if (!sjcl.mode[b.mode] || !sjcl.cipher[b.cipher] || "string" === typeof a && 100 >= b.iter || 64 !== b.ts && 96 !== b.ts && 128 !== b.ts || 128 !== b.ks && 192 !== b.ks && 0x100 !== b.ks || !b.iv || 2 > b.iv.length || 4 < b.iv.length)
                    throw new sjcl.exception.invalid("json decrypt: invalid parameters");
                "string" === typeof a ? (g = sjcl.misc.cachedPbkdf2(a, b), a = g.key.slice(0, b.ks / 32), b.salt = g.salt) : sjcl.ecc && a instanceof sjcl.ecc.elGamal.secretKey && (a = a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0, b.ks / 32));
                "string" === typeof f && (f = sjcl.codec.utf8String.toBits(f));
                g = new sjcl.cipher[b.cipher](a);
                f = "ccm" === b.mode && sjcl.arrayBuffer && sjcl.arrayBuffer.ccm && b.ct instanceof ArrayBuffer ? sjcl.arrayBuffer.ccm.decrypt(g, b.ct, b.iv, b.tag, f, b.ts) : sjcl.mode[b.mode].decrypt(g, b.ct, b.iv, f, b.ts);
                e.g(d, b);
                d.key = a;
                return 1 === c.raw ? f : sjcl.codec.utf8String.fromBits(f);
            },
            decrypt: function (a, b, c, d) {
                var e = sjcl.json;
                return e.ia(a, e.decode(b), c, d);
            },
            encode: function (a) {
                var b, c = "{", d = "";
                for (b in a)
                    if (a.hasOwnProperty(b)) {
                        if (!b.match(/^[a-z0-9]+$/i))
                            throw new sjcl.exception.invalid("json encode: invalid property name");
                        c += d + '"' + b + '":';
                        d = ",";
                        switch (typeof a[b]) {
                            case "number":
                            case "boolean":
                                c += a[b];
                                break;
                            case "string":
                                c += '"' + escape(a[b]) + '"';
                                break;
                            case "object":
                                c += '"' + sjcl.codec.base64.fromBits(a[b], 0) + '"';
                                break;
                            default:
                                throw new sjcl.exception.bug("json encode: unsupported type");
                        }
                    }
                return c + "}";
            },
            decode: function (a) {
                a = a.replace(/\s/g, "");
                if (!a.match(/^\{.*\}$/))
                    throw new sjcl.exception.invalid("json decode: this isn't json!");
                a = a.replace(/^\{|\}$/g, "").split(/,/);
                var b = {}, c, d;
                for (c = 0; c < a.length; c++) {
                    if (!(d = a[c].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i)))
                        throw new sjcl.exception.invalid("json decode: this isn't json!");
                    null != d[3] ? b[d[2]] = parseInt(d[3], 10) : null != d[4] ? b[d[2]] = d[2].match(/^(ct|adata|salt|iv)$/) ? sjcl.codec.base64.toBits(d[4]) : unescape(d[4]) : null != d[5] && (b[d[2]] = "true" === d[5]);
                }
                return b;
            },
            g: function (a, b, c) {
                void 0 === a && (a = {});
                if (void 0 === b)
                    return a;
                for (var d in b)
                    if (b.hasOwnProperty(d)) {
                        if (c && void 0 !== a[d] && a[d] !== b[d])
                            throw new sjcl.exception.invalid("required parameter overridden");
                        a[d] = b[d];
                    }
                return a;
            },
            sa: function (a, b) {
                var c = {}, d;
                for (d in a)
                    a.hasOwnProperty(d) && a[d] !== b[d] && (c[d] = a[d]);
                return c;
            },
            ra: function (a, b) {
                var c = {}, d;
                for (d = 0; d < b.length; d++)
                    void 0 !== a[b[d]] && (c[b[d]] = a[b[d]]);
                return c;
            }
        };
        sjcl.encrypt = sjcl.json.encrypt;
        sjcl.decrypt = sjcl.json.decrypt;
        sjcl.misc.pa = {};
        sjcl.misc.cachedPbkdf2 = function (a, b) {
            var c = sjcl.misc.pa, d;
            b = b || {};
            d = b.iter || 1E3;
            c = c[a] = c[a] || {};
            d = c[d] = c[d] || {
                firstSalt: b.salt && b.salt.length ? b.salt.slice(0) : sjcl.random.randomWords(2, 0)
            };
            c = void 0 === b.salt ? d.firstSalt : b.salt;
            d[c] = d[c] || sjcl.misc.pbkdf2(a, c, b.iter);
            return {
                key: d[c].slice(0),
                salt: c.slice(0)
            };
        };
        exports && (exports = sjcl);
        "function" === typeof define && define([], function () {
            return sjcl;
        });
        return exports;
    }
    exports_14("dew", dew);
    return {
        setters: [
            function (crypto_js_2_1) {
                crypto_js_2 = crypto_js_2_1;
            }
        ],
        execute: function () {
            exports = {}, _dewExec = false;
        }
    };
});
System.register("https://dev.jspm.io/sjcl", ["https://dev.jspm.io/npm:sjcl@1.0.8/sjcl.dew", "https://dev.jspm.io/npm:@jspm/core@1/nodelibs/crypto"], function (exports_15, context_15) {
    "use strict";
    var sjcl_dew_js_1;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (sjcl_dew_js_1_1) {
                sjcl_dew_js_1 = sjcl_dew_js_1_1;
            },
            function (_20) {
            }
        ],
        execute: function () {
            exports_15("default", sjcl_dew_js_1.dew());
        }
    };
});
System.register("file:///home/elemti/nux/git/detun/common/crypt", ["https://dev.jspm.io/sjcl"], function (exports_16, context_16) {
    "use strict";
    var sjcl_1, SECRET, encrypt, decrypt, timelyEncrypt, timelyDecrypt, encode123, decode123;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (sjcl_1_1) {
                sjcl_1 = sjcl_1_1;
            }
        ],
        execute: function () {
            SECRET = Deno.env.get('DETUN_SECRET')?.trim();
            if (!SECRET)
                throw Error('DETUN_SECRET env is empty!');
            exports_16("encrypt", encrypt = jsonType => sjcl_1.default.encrypt(SECRET, JSON.stringify(jsonType)));
            exports_16("decrypt", decrypt = encrypted => JSON.parse(sjcl_1.default.decrypt(SECRET, encrypted)));
            exports_16("timelyEncrypt", timelyEncrypt = (payload, ttl = 3) => encrypt({ exp: Date.now() + ttl * 1000, payload }));
            exports_16("timelyDecrypt", timelyDecrypt = encrypted => {
                let { exp, payload } = decrypt(encrypted);
                if (exp && Date.now() < exp)
                    return payload;
                throw Error('PAYLOAD_EXPIRED');
            });
            exports_16("encode123", encode123 = pl => {
                if (pl?.constructor !== Object)
                    throw Error('encode payload must be Object');
                let payload = { ...pl };
                let specialKeys = {};
                let obj = { payload, specialKeys };
                Object.entries(payload).forEach(([key, value]) => {
                    if (value instanceof Uint8Array) {
                        payload[key] = Array.from(value);
                        specialKeys[key] = 'Uint8Array';
                    }
                });
                return new TextEncoder().encode(encrypt(obj));
            });
            exports_16("decode123", decode123 = buffer => {
                let { payload, specialKeys } = decrypt(new TextDecoder().decode(buffer));
                Object.entries(specialKeys).forEach(([key, keyType]) => {
                    if (keyType === 'Uint8Array') {
                        payload[key] = new Uint8Array(payload[key]);
                    }
                });
                return payload;
            });
        }
    };
});
System.register("https://deno.land/std@0.67.0/encoding/utf8", [], function (exports_17, context_17) {
    "use strict";
    var encoder, decoder;
    var __moduleName = context_17 && context_17.id;
    function encode(input) {
        return encoder.encode(input);
    }
    exports_17("encode", encode);
    function decode(input) {
        return decoder.decode(input);
    }
    exports_17("decode", decode);
    return {
        setters: [],
        execute: function () {
            exports_17("encoder", encoder = new TextEncoder());
            exports_17("decoder", decoder = new TextDecoder());
        }
    };
});
System.register("https://deno.land/std@0.67.0/_util/has_own_property", [], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    function hasOwnProperty(obj, v) {
        if (obj == null) {
            return false;
        }
        return Object.prototype.hasOwnProperty.call(obj, v);
    }
    exports_18("hasOwnProperty", hasOwnProperty);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.67.0/bytes/mod", [], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    function findIndex(source, pat) {
        const s = pat[0];
        for (let i = 0; i < source.length; i++) {
            if (source[i] !== s)
                continue;
            const pin = i;
            let matched = 1;
            let j = i;
            while (matched < pat.length) {
                j++;
                if (source[j] !== pat[j - pin]) {
                    break;
                }
                matched++;
            }
            if (matched === pat.length) {
                return pin;
            }
        }
        return -1;
    }
    exports_19("findIndex", findIndex);
    function findLastIndex(source, pat) {
        const e = pat[pat.length - 1];
        for (let i = source.length - 1; i >= 0; i--) {
            if (source[i] !== e)
                continue;
            const pin = i;
            let matched = 1;
            let j = i;
            while (matched < pat.length) {
                j--;
                if (source[j] !== pat[pat.length - 1 - (pin - j)]) {
                    break;
                }
                matched++;
            }
            if (matched === pat.length) {
                return pin - pat.length + 1;
            }
        }
        return -1;
    }
    exports_19("findLastIndex", findLastIndex);
    function equal(source, match) {
        if (source.length !== match.length)
            return false;
        for (let i = 0; i < match.length; i++) {
            if (source[i] !== match[i])
                return false;
        }
        return true;
    }
    exports_19("equal", equal);
    function hasPrefix(source, prefix) {
        for (let i = 0, max = prefix.length; i < max; i++) {
            if (source[i] !== prefix[i])
                return false;
        }
        return true;
    }
    exports_19("hasPrefix", hasPrefix);
    function hasSuffix(source, suffix) {
        for (let srci = source.length - 1, sfxi = suffix.length - 1; sfxi >= 0; srci--, sfxi--) {
            if (source[srci] !== suffix[sfxi])
                return false;
        }
        return true;
    }
    exports_19("hasSuffix", hasSuffix);
    function repeat(origin, count) {
        if (count === 0) {
            return new Uint8Array();
        }
        if (count < 0) {
            throw new Error("bytes: negative repeat count");
        }
        else if ((origin.length * count) / count !== origin.length) {
            throw new Error("bytes: repeat count causes overflow");
        }
        const int = Math.floor(count);
        if (int !== count) {
            throw new Error("bytes: repeat count must be an integer");
        }
        const nb = new Uint8Array(origin.length * count);
        let bp = copyBytes(origin, nb);
        for (; bp < nb.length; bp *= 2) {
            copyBytes(nb.slice(0, bp), nb, bp);
        }
        return nb;
    }
    exports_19("repeat", repeat);
    function concat(origin, b) {
        const output = new Uint8Array(origin.length + b.length);
        output.set(origin, 0);
        output.set(b, origin.length);
        return output;
    }
    exports_19("concat", concat);
    function contains(source, pat) {
        return findIndex(source, pat) != -1;
    }
    exports_19("contains", contains);
    function copyBytes(src, dst, off = 0) {
        off = Math.max(0, Math.min(off, dst.byteLength));
        const dstBytesAvailable = dst.byteLength - off;
        if (src.byteLength > dstBytesAvailable) {
            src = src.subarray(0, dstBytesAvailable);
        }
        dst.set(src, off);
        return src.byteLength;
    }
    exports_19("copyBytes", copyBytes);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.67.0/_util/assert", [], function (exports_20, context_20) {
    "use strict";
    var DenoStdInternalError;
    var __moduleName = context_20 && context_20.id;
    function assert(expr, msg = "") {
        if (!expr) {
            throw new DenoStdInternalError(msg);
        }
    }
    exports_20("assert", assert);
    return {
        setters: [],
        execute: function () {
            DenoStdInternalError = class DenoStdInternalError extends Error {
                constructor(message) {
                    super(message);
                    this.name = "DenoStdInternalError";
                }
            };
            exports_20("DenoStdInternalError", DenoStdInternalError);
        }
    };
});
System.register("https://deno.land/std@0.67.0/io/bufio", ["https://deno.land/std@0.67.0/bytes/mod", "https://deno.land/std@0.67.0/_util/assert"], function (exports_21, context_21) {
    "use strict";
    var mod_ts_1, assert_ts_1, DEFAULT_BUF_SIZE, MIN_BUF_SIZE, MAX_CONSECUTIVE_EMPTY_READS, CR, LF, BufferFullError, PartialReadError, BufReader, AbstractBufBase, BufWriter, BufWriterSync;
    var __moduleName = context_21 && context_21.id;
    function createLPS(pat) {
        const lps = new Uint8Array(pat.length);
        lps[0] = 0;
        let prefixEnd = 0;
        let i = 1;
        while (i < lps.length) {
            if (pat[i] == pat[prefixEnd]) {
                prefixEnd++;
                lps[i] = prefixEnd;
                i++;
            }
            else if (prefixEnd === 0) {
                lps[i] = 0;
                i++;
            }
            else {
                prefixEnd = pat[prefixEnd - 1];
            }
        }
        return lps;
    }
    async function* readDelim(reader, delim) {
        const delimLen = delim.length;
        const delimLPS = createLPS(delim);
        let inputBuffer = new Deno.Buffer();
        const inspectArr = new Uint8Array(Math.max(1024, delimLen + 1));
        let inspectIndex = 0;
        let matchIndex = 0;
        while (true) {
            const result = await reader.read(inspectArr);
            if (result === null) {
                yield inputBuffer.bytes();
                return;
            }
            if (result < 0) {
                return;
            }
            const sliceRead = inspectArr.subarray(0, result);
            await Deno.writeAll(inputBuffer, sliceRead);
            let sliceToProcess = inputBuffer.bytes();
            while (inspectIndex < sliceToProcess.length) {
                if (sliceToProcess[inspectIndex] === delim[matchIndex]) {
                    inspectIndex++;
                    matchIndex++;
                    if (matchIndex === delimLen) {
                        const matchEnd = inspectIndex - delimLen;
                        const readyBytes = sliceToProcess.subarray(0, matchEnd);
                        const pendingBytes = sliceToProcess.slice(inspectIndex);
                        yield readyBytes;
                        sliceToProcess = pendingBytes;
                        inspectIndex = 0;
                        matchIndex = 0;
                    }
                }
                else {
                    if (matchIndex === 0) {
                        inspectIndex++;
                    }
                    else {
                        matchIndex = delimLPS[matchIndex - 1];
                    }
                }
            }
            inputBuffer = new Deno.Buffer(sliceToProcess);
        }
    }
    exports_21("readDelim", readDelim);
    async function* readStringDelim(reader, delim) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        for await (const chunk of readDelim(reader, encoder.encode(delim))) {
            yield decoder.decode(chunk);
        }
    }
    exports_21("readStringDelim", readStringDelim);
    async function* readLines(reader) {
        yield* readStringDelim(reader, "\n");
    }
    exports_21("readLines", readLines);
    return {
        setters: [
            function (mod_ts_1_1) {
                mod_ts_1 = mod_ts_1_1;
            },
            function (assert_ts_1_1) {
                assert_ts_1 = assert_ts_1_1;
            }
        ],
        execute: function () {
            DEFAULT_BUF_SIZE = 4096;
            MIN_BUF_SIZE = 16;
            MAX_CONSECUTIVE_EMPTY_READS = 100;
            CR = "\r".charCodeAt(0);
            LF = "\n".charCodeAt(0);
            BufferFullError = class BufferFullError extends Error {
                constructor(partial) {
                    super("Buffer full");
                    this.partial = partial;
                    this.name = "BufferFullError";
                }
            };
            exports_21("BufferFullError", BufferFullError);
            PartialReadError = class PartialReadError extends Deno.errors.UnexpectedEof {
                constructor() {
                    super("Encountered UnexpectedEof, data only partially read");
                    this.name = "PartialReadError";
                }
            };
            exports_21("PartialReadError", PartialReadError);
            BufReader = class BufReader {
                constructor(rd, size = DEFAULT_BUF_SIZE) {
                    this.r = 0;
                    this.w = 0;
                    this.eof = false;
                    if (size < MIN_BUF_SIZE) {
                        size = MIN_BUF_SIZE;
                    }
                    this._reset(new Uint8Array(size), rd);
                }
                static create(r, size = DEFAULT_BUF_SIZE) {
                    return r instanceof BufReader ? r : new BufReader(r, size);
                }
                size() {
                    return this.buf.byteLength;
                }
                buffered() {
                    return this.w - this.r;
                }
                async _fill() {
                    if (this.r > 0) {
                        this.buf.copyWithin(0, this.r, this.w);
                        this.w -= this.r;
                        this.r = 0;
                    }
                    if (this.w >= this.buf.byteLength) {
                        throw Error("bufio: tried to fill full buffer");
                    }
                    for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
                        const rr = await this.rd.read(this.buf.subarray(this.w));
                        if (rr === null) {
                            this.eof = true;
                            return;
                        }
                        assert_ts_1.assert(rr >= 0, "negative read");
                        this.w += rr;
                        if (rr > 0) {
                            return;
                        }
                    }
                    throw new Error(`No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`);
                }
                reset(r) {
                    this._reset(this.buf, r);
                }
                _reset(buf, rd) {
                    this.buf = buf;
                    this.rd = rd;
                    this.eof = false;
                }
                async read(p) {
                    let rr = p.byteLength;
                    if (p.byteLength === 0)
                        return rr;
                    if (this.r === this.w) {
                        if (p.byteLength >= this.buf.byteLength) {
                            const rr = await this.rd.read(p);
                            const nread = rr ?? 0;
                            assert_ts_1.assert(nread >= 0, "negative read");
                            return rr;
                        }
                        this.r = 0;
                        this.w = 0;
                        rr = await this.rd.read(this.buf);
                        if (rr === 0 || rr === null)
                            return rr;
                        assert_ts_1.assert(rr >= 0, "negative read");
                        this.w += rr;
                    }
                    const copied = mod_ts_1.copyBytes(this.buf.subarray(this.r, this.w), p, 0);
                    this.r += copied;
                    return copied;
                }
                async readFull(p) {
                    let bytesRead = 0;
                    while (bytesRead < p.length) {
                        try {
                            const rr = await this.read(p.subarray(bytesRead));
                            if (rr === null) {
                                if (bytesRead === 0) {
                                    return null;
                                }
                                else {
                                    throw new PartialReadError();
                                }
                            }
                            bytesRead += rr;
                        }
                        catch (err) {
                            err.partial = p.subarray(0, bytesRead);
                            throw err;
                        }
                    }
                    return p;
                }
                async readByte() {
                    while (this.r === this.w) {
                        if (this.eof)
                            return null;
                        await this._fill();
                    }
                    const c = this.buf[this.r];
                    this.r++;
                    return c;
                }
                async readString(delim) {
                    if (delim.length !== 1) {
                        throw new Error("Delimiter should be a single character");
                    }
                    const buffer = await this.readSlice(delim.charCodeAt(0));
                    if (buffer === null)
                        return null;
                    return new TextDecoder().decode(buffer);
                }
                async readLine() {
                    let line;
                    try {
                        line = await this.readSlice(LF);
                    }
                    catch (err) {
                        let { partial } = err;
                        assert_ts_1.assert(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
                        if (!(err instanceof BufferFullError)) {
                            throw err;
                        }
                        if (!this.eof &&
                            partial.byteLength > 0 &&
                            partial[partial.byteLength - 1] === CR) {
                            assert_ts_1.assert(this.r > 0, "bufio: tried to rewind past start of buffer");
                            this.r--;
                            partial = partial.subarray(0, partial.byteLength - 1);
                        }
                        return { line: partial, more: !this.eof };
                    }
                    if (line === null) {
                        return null;
                    }
                    if (line.byteLength === 0) {
                        return { line, more: false };
                    }
                    if (line[line.byteLength - 1] == LF) {
                        let drop = 1;
                        if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                            drop = 2;
                        }
                        line = line.subarray(0, line.byteLength - drop);
                    }
                    return { line, more: false };
                }
                async readSlice(delim) {
                    let s = 0;
                    let slice;
                    while (true) {
                        let i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
                        if (i >= 0) {
                            i += s;
                            slice = this.buf.subarray(this.r, this.r + i + 1);
                            this.r += i + 1;
                            break;
                        }
                        if (this.eof) {
                            if (this.r === this.w) {
                                return null;
                            }
                            slice = this.buf.subarray(this.r, this.w);
                            this.r = this.w;
                            break;
                        }
                        if (this.buffered() >= this.buf.byteLength) {
                            this.r = this.w;
                            const oldbuf = this.buf;
                            const newbuf = this.buf.slice(0);
                            this.buf = newbuf;
                            throw new BufferFullError(oldbuf);
                        }
                        s = this.w - this.r;
                        try {
                            await this._fill();
                        }
                        catch (err) {
                            err.partial = slice;
                            throw err;
                        }
                    }
                    return slice;
                }
                async peek(n) {
                    if (n < 0) {
                        throw Error("negative count");
                    }
                    let avail = this.w - this.r;
                    while (avail < n && avail < this.buf.byteLength && !this.eof) {
                        try {
                            await this._fill();
                        }
                        catch (err) {
                            err.partial = this.buf.subarray(this.r, this.w);
                            throw err;
                        }
                        avail = this.w - this.r;
                    }
                    if (avail === 0 && this.eof) {
                        return null;
                    }
                    else if (avail < n && this.eof) {
                        return this.buf.subarray(this.r, this.r + avail);
                    }
                    else if (avail < n) {
                        throw new BufferFullError(this.buf.subarray(this.r, this.w));
                    }
                    return this.buf.subarray(this.r, this.r + n);
                }
            };
            exports_21("BufReader", BufReader);
            AbstractBufBase = class AbstractBufBase {
                constructor() {
                    this.usedBufferBytes = 0;
                    this.err = null;
                }
                size() {
                    return this.buf.byteLength;
                }
                available() {
                    return this.buf.byteLength - this.usedBufferBytes;
                }
                buffered() {
                    return this.usedBufferBytes;
                }
            };
            BufWriter = class BufWriter extends AbstractBufBase {
                constructor(writer, size = DEFAULT_BUF_SIZE) {
                    super();
                    this.writer = writer;
                    if (size <= 0) {
                        size = DEFAULT_BUF_SIZE;
                    }
                    this.buf = new Uint8Array(size);
                }
                static create(writer, size = DEFAULT_BUF_SIZE) {
                    return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
                }
                reset(w) {
                    this.err = null;
                    this.usedBufferBytes = 0;
                    this.writer = w;
                }
                async flush() {
                    if (this.err !== null)
                        throw this.err;
                    if (this.usedBufferBytes === 0)
                        return;
                    try {
                        await Deno.writeAll(this.writer, this.buf.subarray(0, this.usedBufferBytes));
                    }
                    catch (e) {
                        this.err = e;
                        throw e;
                    }
                    this.buf = new Uint8Array(this.buf.length);
                    this.usedBufferBytes = 0;
                }
                async write(data) {
                    if (this.err !== null)
                        throw this.err;
                    if (data.length === 0)
                        return 0;
                    let totalBytesWritten = 0;
                    let numBytesWritten = 0;
                    while (data.byteLength > this.available()) {
                        if (this.buffered() === 0) {
                            try {
                                numBytesWritten = await this.writer.write(data);
                            }
                            catch (e) {
                                this.err = e;
                                throw e;
                            }
                        }
                        else {
                            numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                            this.usedBufferBytes += numBytesWritten;
                            await this.flush();
                        }
                        totalBytesWritten += numBytesWritten;
                        data = data.subarray(numBytesWritten);
                    }
                    numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                    this.usedBufferBytes += numBytesWritten;
                    totalBytesWritten += numBytesWritten;
                    return totalBytesWritten;
                }
            };
            exports_21("BufWriter", BufWriter);
            BufWriterSync = class BufWriterSync extends AbstractBufBase {
                constructor(writer, size = DEFAULT_BUF_SIZE) {
                    super();
                    this.writer = writer;
                    if (size <= 0) {
                        size = DEFAULT_BUF_SIZE;
                    }
                    this.buf = new Uint8Array(size);
                }
                static create(writer, size = DEFAULT_BUF_SIZE) {
                    return writer instanceof BufWriterSync
                        ? writer
                        : new BufWriterSync(writer, size);
                }
                reset(w) {
                    this.err = null;
                    this.usedBufferBytes = 0;
                    this.writer = w;
                }
                flush() {
                    if (this.err !== null)
                        throw this.err;
                    if (this.usedBufferBytes === 0)
                        return;
                    try {
                        Deno.writeAllSync(this.writer, this.buf.subarray(0, this.usedBufferBytes));
                    }
                    catch (e) {
                        this.err = e;
                        throw e;
                    }
                    this.buf = new Uint8Array(this.buf.length);
                    this.usedBufferBytes = 0;
                }
                writeSync(data) {
                    if (this.err !== null)
                        throw this.err;
                    if (data.length === 0)
                        return 0;
                    let totalBytesWritten = 0;
                    let numBytesWritten = 0;
                    while (data.byteLength > this.available()) {
                        if (this.buffered() === 0) {
                            try {
                                numBytesWritten = this.writer.writeSync(data);
                            }
                            catch (e) {
                                this.err = e;
                                throw e;
                            }
                        }
                        else {
                            numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                            this.usedBufferBytes += numBytesWritten;
                            this.flush();
                        }
                        totalBytesWritten += numBytesWritten;
                        data = data.subarray(numBytesWritten);
                    }
                    numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                    this.usedBufferBytes += numBytesWritten;
                    totalBytesWritten += numBytesWritten;
                    return totalBytesWritten;
                }
            };
            exports_21("BufWriterSync", BufWriterSync);
        }
    };
});
System.register("https://deno.land/std@0.67.0/io/ioutil", ["https://deno.land/std@0.67.0/_util/assert"], function (exports_22, context_22) {
    "use strict";
    var assert_ts_2, DEFAULT_BUFFER_SIZE, MAX_SAFE_INTEGER;
    var __moduleName = context_22 && context_22.id;
    async function copyN(r, dest, size) {
        let bytesRead = 0;
        let buf = new Uint8Array(DEFAULT_BUFFER_SIZE);
        while (bytesRead < size) {
            if (size - bytesRead < DEFAULT_BUFFER_SIZE) {
                buf = new Uint8Array(size - bytesRead);
            }
            const result = await r.read(buf);
            const nread = result ?? 0;
            bytesRead += nread;
            if (nread > 0) {
                let n = 0;
                while (n < nread) {
                    n += await dest.write(buf.slice(n, nread));
                }
                assert_ts_2.assert(n === nread, "could not write");
            }
            if (result === null) {
                break;
            }
        }
        return bytesRead;
    }
    exports_22("copyN", copyN);
    async function readShort(buf) {
        const high = await buf.readByte();
        if (high === null)
            return null;
        const low = await buf.readByte();
        if (low === null)
            throw new Deno.errors.UnexpectedEof();
        return (high << 8) | low;
    }
    exports_22("readShort", readShort);
    async function readInt(buf) {
        const high = await readShort(buf);
        if (high === null)
            return null;
        const low = await readShort(buf);
        if (low === null)
            throw new Deno.errors.UnexpectedEof();
        return (high << 16) | low;
    }
    exports_22("readInt", readInt);
    async function readLong(buf) {
        const high = await readInt(buf);
        if (high === null)
            return null;
        const low = await readInt(buf);
        if (low === null)
            throw new Deno.errors.UnexpectedEof();
        const big = (BigInt(high) << 32n) | BigInt(low);
        if (big > MAX_SAFE_INTEGER) {
            throw new RangeError("Long value too big to be represented as a JavaScript number.");
        }
        return Number(big);
    }
    exports_22("readLong", readLong);
    function sliceLongToBytes(d, dest = new Array(8)) {
        let big = BigInt(d);
        for (let i = 0; i < 8; i++) {
            dest[7 - i] = Number(big & 0xffn);
            big >>= 8n;
        }
        return dest;
    }
    exports_22("sliceLongToBytes", sliceLongToBytes);
    return {
        setters: [
            function (assert_ts_2_1) {
                assert_ts_2 = assert_ts_2_1;
            }
        ],
        execute: function () {
            DEFAULT_BUFFER_SIZE = 32 * 1024;
            MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
        }
    };
});
System.register("https://deno.land/std@0.67.0/hash/sha1", [], function (exports_23, context_23) {
    "use strict";
    var HEX_CHARS, EXTRA, SHIFT, blocks, Sha1;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [],
        execute: function () {
            HEX_CHARS = "0123456789abcdef".split("");
            EXTRA = [-2147483648, 8388608, 32768, 128];
            SHIFT = [24, 16, 8, 0];
            blocks = [];
            Sha1 = class Sha1 {
                constructor(sharedMemory = false) {
                    this.#h0 = 0x67452301;
                    this.#h1 = 0xefcdab89;
                    this.#h2 = 0x98badcfe;
                    this.#h3 = 0x10325476;
                    this.#h4 = 0xc3d2e1f0;
                    this.#lastByteIndex = 0;
                    if (sharedMemory) {
                        blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                        this.#blocks = blocks;
                    }
                    else {
                        this.#blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    }
                    this.#h0 = 0x67452301;
                    this.#h1 = 0xefcdab89;
                    this.#h2 = 0x98badcfe;
                    this.#h3 = 0x10325476;
                    this.#h4 = 0xc3d2e1f0;
                    this.#block = this.#start = this.#bytes = this.#hBytes = 0;
                    this.#finalized = this.#hashed = false;
                }
                #blocks;
                #block;
                #start;
                #bytes;
                #hBytes;
                #finalized;
                #hashed;
                #h0;
                #h1;
                #h2;
                #h3;
                #h4;
                #lastByteIndex;
                update(message) {
                    if (this.#finalized) {
                        return this;
                    }
                    let msg;
                    if (message instanceof ArrayBuffer) {
                        msg = new Uint8Array(message);
                    }
                    else {
                        msg = message;
                    }
                    let index = 0;
                    const length = msg.length;
                    const blocks = this.#blocks;
                    while (index < length) {
                        let i;
                        if (this.#hashed) {
                            this.#hashed = false;
                            blocks[0] = this.#block;
                            blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                        }
                        if (typeof msg !== "string") {
                            for (i = this.#start; index < length && i < 64; ++index) {
                                blocks[i >> 2] |= msg[index] << SHIFT[i++ & 3];
                            }
                        }
                        else {
                            for (i = this.#start; index < length && i < 64; ++index) {
                                let code = msg.charCodeAt(index);
                                if (code < 0x80) {
                                    blocks[i >> 2] |= code << SHIFT[i++ & 3];
                                }
                                else if (code < 0x800) {
                                    blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                                }
                                else if (code < 0xd800 || code >= 0xe000) {
                                    blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                                }
                                else {
                                    code = 0x10000 +
                                        (((code & 0x3ff) << 10) | (msg.charCodeAt(++index) & 0x3ff));
                                    blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                                }
                            }
                        }
                        this.#lastByteIndex = i;
                        this.#bytes += i - this.#start;
                        if (i >= 64) {
                            this.#block = blocks[16];
                            this.#start = i - 64;
                            this.hash();
                            this.#hashed = true;
                        }
                        else {
                            this.#start = i;
                        }
                    }
                    if (this.#bytes > 4294967295) {
                        this.#hBytes += (this.#bytes / 4294967296) >>> 0;
                        this.#bytes = this.#bytes >>> 0;
                    }
                    return this;
                }
                finalize() {
                    if (this.#finalized) {
                        return;
                    }
                    this.#finalized = true;
                    const blocks = this.#blocks;
                    const i = this.#lastByteIndex;
                    blocks[16] = this.#block;
                    blocks[i >> 2] |= EXTRA[i & 3];
                    this.#block = blocks[16];
                    if (i >= 56) {
                        if (!this.#hashed) {
                            this.hash();
                        }
                        blocks[0] = this.#block;
                        blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                    }
                    blocks[14] = (this.#hBytes << 3) | (this.#bytes >>> 29);
                    blocks[15] = this.#bytes << 3;
                    this.hash();
                }
                hash() {
                    let a = this.#h0;
                    let b = this.#h1;
                    let c = this.#h2;
                    let d = this.#h3;
                    let e = this.#h4;
                    let f;
                    let j;
                    let t;
                    const blocks = this.#blocks;
                    for (j = 16; j < 80; ++j) {
                        t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
                        blocks[j] = (t << 1) | (t >>> 31);
                    }
                    for (j = 0; j < 20; j += 5) {
                        f = (b & c) | (~b & d);
                        t = (a << 5) | (a >>> 27);
                        e = (t + f + e + 1518500249 + blocks[j]) >>> 0;
                        b = (b << 30) | (b >>> 2);
                        f = (a & b) | (~a & c);
                        t = (e << 5) | (e >>> 27);
                        d = (t + f + d + 1518500249 + blocks[j + 1]) >>> 0;
                        a = (a << 30) | (a >>> 2);
                        f = (e & a) | (~e & b);
                        t = (d << 5) | (d >>> 27);
                        c = (t + f + c + 1518500249 + blocks[j + 2]) >>> 0;
                        e = (e << 30) | (e >>> 2);
                        f = (d & e) | (~d & a);
                        t = (c << 5) | (c >>> 27);
                        b = (t + f + b + 1518500249 + blocks[j + 3]) >>> 0;
                        d = (d << 30) | (d >>> 2);
                        f = (c & d) | (~c & e);
                        t = (b << 5) | (b >>> 27);
                        a = (t + f + a + 1518500249 + blocks[j + 4]) >>> 0;
                        c = (c << 30) | (c >>> 2);
                    }
                    for (; j < 40; j += 5) {
                        f = b ^ c ^ d;
                        t = (a << 5) | (a >>> 27);
                        e = (t + f + e + 1859775393 + blocks[j]) >>> 0;
                        b = (b << 30) | (b >>> 2);
                        f = a ^ b ^ c;
                        t = (e << 5) | (e >>> 27);
                        d = (t + f + d + 1859775393 + blocks[j + 1]) >>> 0;
                        a = (a << 30) | (a >>> 2);
                        f = e ^ a ^ b;
                        t = (d << 5) | (d >>> 27);
                        c = (t + f + c + 1859775393 + blocks[j + 2]) >>> 0;
                        e = (e << 30) | (e >>> 2);
                        f = d ^ e ^ a;
                        t = (c << 5) | (c >>> 27);
                        b = (t + f + b + 1859775393 + blocks[j + 3]) >>> 0;
                        d = (d << 30) | (d >>> 2);
                        f = c ^ d ^ e;
                        t = (b << 5) | (b >>> 27);
                        a = (t + f + a + 1859775393 + blocks[j + 4]) >>> 0;
                        c = (c << 30) | (c >>> 2);
                    }
                    for (; j < 60; j += 5) {
                        f = (b & c) | (b & d) | (c & d);
                        t = (a << 5) | (a >>> 27);
                        e = (t + f + e - 1894007588 + blocks[j]) >>> 0;
                        b = (b << 30) | (b >>> 2);
                        f = (a & b) | (a & c) | (b & c);
                        t = (e << 5) | (e >>> 27);
                        d = (t + f + d - 1894007588 + blocks[j + 1]) >>> 0;
                        a = (a << 30) | (a >>> 2);
                        f = (e & a) | (e & b) | (a & b);
                        t = (d << 5) | (d >>> 27);
                        c = (t + f + c - 1894007588 + blocks[j + 2]) >>> 0;
                        e = (e << 30) | (e >>> 2);
                        f = (d & e) | (d & a) | (e & a);
                        t = (c << 5) | (c >>> 27);
                        b = (t + f + b - 1894007588 + blocks[j + 3]) >>> 0;
                        d = (d << 30) | (d >>> 2);
                        f = (c & d) | (c & e) | (d & e);
                        t = (b << 5) | (b >>> 27);
                        a = (t + f + a - 1894007588 + blocks[j + 4]) >>> 0;
                        c = (c << 30) | (c >>> 2);
                    }
                    for (; j < 80; j += 5) {
                        f = b ^ c ^ d;
                        t = (a << 5) | (a >>> 27);
                        e = (t + f + e - 899497514 + blocks[j]) >>> 0;
                        b = (b << 30) | (b >>> 2);
                        f = a ^ b ^ c;
                        t = (e << 5) | (e >>> 27);
                        d = (t + f + d - 899497514 + blocks[j + 1]) >>> 0;
                        a = (a << 30) | (a >>> 2);
                        f = e ^ a ^ b;
                        t = (d << 5) | (d >>> 27);
                        c = (t + f + c - 899497514 + blocks[j + 2]) >>> 0;
                        e = (e << 30) | (e >>> 2);
                        f = d ^ e ^ a;
                        t = (c << 5) | (c >>> 27);
                        b = (t + f + b - 899497514 + blocks[j + 3]) >>> 0;
                        d = (d << 30) | (d >>> 2);
                        f = c ^ d ^ e;
                        t = (b << 5) | (b >>> 27);
                        a = (t + f + a - 899497514 + blocks[j + 4]) >>> 0;
                        c = (c << 30) | (c >>> 2);
                    }
                    this.#h0 = (this.#h0 + a) >>> 0;
                    this.#h1 = (this.#h1 + b) >>> 0;
                    this.#h2 = (this.#h2 + c) >>> 0;
                    this.#h3 = (this.#h3 + d) >>> 0;
                    this.#h4 = (this.#h4 + e) >>> 0;
                }
                hex() {
                    this.finalize();
                    const h0 = this.#h0;
                    const h1 = this.#h1;
                    const h2 = this.#h2;
                    const h3 = this.#h3;
                    const h4 = this.#h4;
                    return (HEX_CHARS[(h0 >> 28) & 0x0f] +
                        HEX_CHARS[(h0 >> 24) & 0x0f] +
                        HEX_CHARS[(h0 >> 20) & 0x0f] +
                        HEX_CHARS[(h0 >> 16) & 0x0f] +
                        HEX_CHARS[(h0 >> 12) & 0x0f] +
                        HEX_CHARS[(h0 >> 8) & 0x0f] +
                        HEX_CHARS[(h0 >> 4) & 0x0f] +
                        HEX_CHARS[h0 & 0x0f] +
                        HEX_CHARS[(h1 >> 28) & 0x0f] +
                        HEX_CHARS[(h1 >> 24) & 0x0f] +
                        HEX_CHARS[(h1 >> 20) & 0x0f] +
                        HEX_CHARS[(h1 >> 16) & 0x0f] +
                        HEX_CHARS[(h1 >> 12) & 0x0f] +
                        HEX_CHARS[(h1 >> 8) & 0x0f] +
                        HEX_CHARS[(h1 >> 4) & 0x0f] +
                        HEX_CHARS[h1 & 0x0f] +
                        HEX_CHARS[(h2 >> 28) & 0x0f] +
                        HEX_CHARS[(h2 >> 24) & 0x0f] +
                        HEX_CHARS[(h2 >> 20) & 0x0f] +
                        HEX_CHARS[(h2 >> 16) & 0x0f] +
                        HEX_CHARS[(h2 >> 12) & 0x0f] +
                        HEX_CHARS[(h2 >> 8) & 0x0f] +
                        HEX_CHARS[(h2 >> 4) & 0x0f] +
                        HEX_CHARS[h2 & 0x0f] +
                        HEX_CHARS[(h3 >> 28) & 0x0f] +
                        HEX_CHARS[(h3 >> 24) & 0x0f] +
                        HEX_CHARS[(h3 >> 20) & 0x0f] +
                        HEX_CHARS[(h3 >> 16) & 0x0f] +
                        HEX_CHARS[(h3 >> 12) & 0x0f] +
                        HEX_CHARS[(h3 >> 8) & 0x0f] +
                        HEX_CHARS[(h3 >> 4) & 0x0f] +
                        HEX_CHARS[h3 & 0x0f] +
                        HEX_CHARS[(h4 >> 28) & 0x0f] +
                        HEX_CHARS[(h4 >> 24) & 0x0f] +
                        HEX_CHARS[(h4 >> 20) & 0x0f] +
                        HEX_CHARS[(h4 >> 16) & 0x0f] +
                        HEX_CHARS[(h4 >> 12) & 0x0f] +
                        HEX_CHARS[(h4 >> 8) & 0x0f] +
                        HEX_CHARS[(h4 >> 4) & 0x0f] +
                        HEX_CHARS[h4 & 0x0f]);
                }
                toString() {
                    return this.hex();
                }
                digest() {
                    this.finalize();
                    const h0 = this.#h0;
                    const h1 = this.#h1;
                    const h2 = this.#h2;
                    const h3 = this.#h3;
                    const h4 = this.#h4;
                    return [
                        (h0 >> 24) & 0xff,
                        (h0 >> 16) & 0xff,
                        (h0 >> 8) & 0xff,
                        h0 & 0xff,
                        (h1 >> 24) & 0xff,
                        (h1 >> 16) & 0xff,
                        (h1 >> 8) & 0xff,
                        h1 & 0xff,
                        (h2 >> 24) & 0xff,
                        (h2 >> 16) & 0xff,
                        (h2 >> 8) & 0xff,
                        h2 & 0xff,
                        (h3 >> 24) & 0xff,
                        (h3 >> 16) & 0xff,
                        (h3 >> 8) & 0xff,
                        h3 & 0xff,
                        (h4 >> 24) & 0xff,
                        (h4 >> 16) & 0xff,
                        (h4 >> 8) & 0xff,
                        h4 & 0xff,
                    ];
                }
                array() {
                    return this.digest();
                }
                arrayBuffer() {
                    this.finalize();
                    const buffer = new ArrayBuffer(20);
                    const dataView = new DataView(buffer);
                    dataView.setUint32(0, this.#h0);
                    dataView.setUint32(4, this.#h1);
                    dataView.setUint32(8, this.#h2);
                    dataView.setUint32(12, this.#h3);
                    dataView.setUint32(16, this.#h4);
                    return buffer;
                }
            };
            exports_23("Sha1", Sha1);
        }
    };
});
System.register("https://deno.land/std@0.67.0/textproto/mod", ["https://deno.land/std@0.67.0/bytes/mod", "https://deno.land/std@0.67.0/encoding/utf8"], function (exports_24, context_24) {
    "use strict";
    var mod_ts_2, utf8_ts_1, invalidHeaderCharRegex, TextProtoReader;
    var __moduleName = context_24 && context_24.id;
    function str(buf) {
        if (buf == null) {
            return "";
        }
        else {
            return utf8_ts_1.decode(buf);
        }
    }
    function charCode(s) {
        return s.charCodeAt(0);
    }
    return {
        setters: [
            function (mod_ts_2_1) {
                mod_ts_2 = mod_ts_2_1;
            },
            function (utf8_ts_1_1) {
                utf8_ts_1 = utf8_ts_1_1;
            }
        ],
        execute: function () {
            invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
            TextProtoReader = class TextProtoReader {
                constructor(r) {
                    this.r = r;
                }
                async readLine() {
                    const s = await this.readLineSlice();
                    if (s === null)
                        return null;
                    return str(s);
                }
                async readMIMEHeader() {
                    const m = new Headers();
                    let line;
                    let buf = await this.r.peek(1);
                    if (buf === null) {
                        return null;
                    }
                    else if (buf[0] == charCode(" ") || buf[0] == charCode("\t")) {
                        line = (await this.readLineSlice());
                    }
                    buf = await this.r.peek(1);
                    if (buf === null) {
                        throw new Deno.errors.UnexpectedEof();
                    }
                    else if (buf[0] == charCode(" ") || buf[0] == charCode("\t")) {
                        throw new Deno.errors.InvalidData(`malformed MIME header initial line: ${str(line)}`);
                    }
                    while (true) {
                        const kv = await this.readLineSlice();
                        if (kv === null)
                            throw new Deno.errors.UnexpectedEof();
                        if (kv.byteLength === 0)
                            return m;
                        let i = kv.indexOf(charCode(":"));
                        if (i < 0) {
                            throw new Deno.errors.InvalidData(`malformed MIME header line: ${str(kv)}`);
                        }
                        const key = str(kv.subarray(0, i));
                        if (key == "") {
                            continue;
                        }
                        i++;
                        while (i < kv.byteLength &&
                            (kv[i] == charCode(" ") || kv[i] == charCode("\t"))) {
                            i++;
                        }
                        const value = str(kv.subarray(i)).replace(invalidHeaderCharRegex, encodeURI);
                        try {
                            m.append(key, value);
                        }
                        catch {
                        }
                    }
                }
                async readLineSlice() {
                    let line;
                    while (true) {
                        const r = await this.r.readLine();
                        if (r === null)
                            return null;
                        const { line: l, more } = r;
                        if (!line && !more) {
                            if (this.skipSpace(l) === 0) {
                                return new Uint8Array(0);
                            }
                            return l;
                        }
                        line = line ? mod_ts_2.concat(line, l) : l;
                        if (!more) {
                            break;
                        }
                    }
                    return line;
                }
                skipSpace(l) {
                    let n = 0;
                    for (let i = 0; i < l.length; i++) {
                        if (l[i] === charCode(" ") || l[i] === charCode("\t")) {
                            continue;
                        }
                        n++;
                    }
                    return n;
                }
            };
            exports_24("TextProtoReader", TextProtoReader);
        }
    };
});
System.register("https://deno.land/std@0.67.0/async/deferred", [], function (exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    function deferred() {
        let methods;
        const promise = new Promise((resolve, reject) => {
            methods = { resolve, reject };
        });
        return Object.assign(promise, methods);
    }
    exports_25("deferred", deferred);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.67.0/async/delay", [], function (exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    function delay(ms) {
        return new Promise((res) => setTimeout(() => {
            res();
        }, ms));
    }
    exports_26("delay", delay);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.67.0/async/mux_async_iterator", ["https://deno.land/std@0.67.0/async/deferred"], function (exports_27, context_27) {
    "use strict";
    var deferred_ts_1, MuxAsyncIterator;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (deferred_ts_1_1) {
                deferred_ts_1 = deferred_ts_1_1;
            }
        ],
        execute: function () {
            MuxAsyncIterator = class MuxAsyncIterator {
                constructor() {
                    this.iteratorCount = 0;
                    this.yields = [];
                    this.throws = [];
                    this.signal = deferred_ts_1.deferred();
                }
                add(iterator) {
                    ++this.iteratorCount;
                    this.callIteratorNext(iterator);
                }
                async callIteratorNext(iterator) {
                    try {
                        const { value, done } = await iterator.next();
                        if (done) {
                            --this.iteratorCount;
                        }
                        else {
                            this.yields.push({ iterator, value });
                        }
                    }
                    catch (e) {
                        this.throws.push(e);
                    }
                    this.signal.resolve();
                }
                async *iterate() {
                    while (this.iteratorCount > 0) {
                        await this.signal;
                        for (let i = 0; i < this.yields.length; i++) {
                            const { iterator, value } = this.yields[i];
                            yield value;
                            this.callIteratorNext(iterator);
                        }
                        if (this.throws.length) {
                            for (const e of this.throws) {
                                throw e;
                            }
                            this.throws.length = 0;
                        }
                        this.yields.length = 0;
                        this.signal = deferred_ts_1.deferred();
                    }
                }
                [Symbol.asyncIterator]() {
                    return this.iterate();
                }
            };
            exports_27("MuxAsyncIterator", MuxAsyncIterator);
        }
    };
});
System.register("https://deno.land/std@0.67.0/async/pool", [], function (exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    function pooledMap(poolLimit, array, iteratorFn) {
        const res = new TransformStream({
            async transform(p, controller) {
                controller.enqueue(await p);
            },
        });
        (async () => {
            const writer = res.writable.getWriter();
            const executing = [];
            for await (const item of array) {
                const p = Promise.resolve().then(() => iteratorFn(item));
                writer.write(p);
                const e = p.then(() => executing.splice(executing.indexOf(e), 1));
                executing.push(e);
                if (executing.length >= poolLimit) {
                    await Promise.race(executing);
                }
            }
            await Promise.all(executing);
            writer.close();
        })();
        return res.readable.getIterator();
    }
    exports_28("pooledMap", pooledMap);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.67.0/async/mod", ["https://deno.land/std@0.67.0/async/deferred", "https://deno.land/std@0.67.0/async/delay", "https://deno.land/std@0.67.0/async/mux_async_iterator", "https://deno.land/std@0.67.0/async/pool"], function (exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    function exportStar_2(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_29(exports);
    }
    return {
        setters: [
            function (deferred_ts_2_1) {
                exportStar_2(deferred_ts_2_1);
            },
            function (delay_ts_1_1) {
                exportStar_2(delay_ts_1_1);
            },
            function (mux_async_iterator_ts_1_1) {
                exportStar_2(mux_async_iterator_ts_1_1);
            },
            function (pool_ts_1_1) {
                exportStar_2(pool_ts_1_1);
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.67.0/http/server", ["https://deno.land/std@0.67.0/encoding/utf8", "https://deno.land/std@0.67.0/io/bufio", "https://deno.land/std@0.67.0/_util/assert", "https://deno.land/std@0.67.0/async/mod", "https://deno.land/std@0.67.0/http/_io"], function (exports_30, context_30) {
    "use strict";
    var utf8_ts_2, bufio_ts_1, assert_ts_3, mod_ts_3, _io_ts_1, ServerRequest, Server;
    var __moduleName = context_30 && context_30.id;
    function _parseAddrFromStr(addr) {
        let url;
        try {
            const host = addr.startsWith(":") ? `0.0.0.0${addr}` : addr;
            url = new URL(`http://${host}`);
        }
        catch {
            throw new TypeError("Invalid address.");
        }
        if (url.username ||
            url.password ||
            url.pathname != "/" ||
            url.search ||
            url.hash) {
            throw new TypeError("Invalid address.");
        }
        return {
            hostname: url.hostname,
            port: url.port === "" ? 80 : Number(url.port),
        };
    }
    exports_30("_parseAddrFromStr", _parseAddrFromStr);
    function serve(addr) {
        if (typeof addr === "string") {
            addr = _parseAddrFromStr(addr);
        }
        const listener = Deno.listen(addr);
        return new Server(listener);
    }
    exports_30("serve", serve);
    async function listenAndServe(addr, handler) {
        const server = serve(addr);
        for await (const request of server) {
            handler(request);
        }
    }
    exports_30("listenAndServe", listenAndServe);
    function serveTLS(options) {
        const tlsOptions = {
            ...options,
            transport: "tcp",
        };
        const listener = Deno.listenTls(tlsOptions);
        return new Server(listener);
    }
    exports_30("serveTLS", serveTLS);
    async function listenAndServeTLS(options, handler) {
        const server = serveTLS(options);
        for await (const request of server) {
            handler(request);
        }
    }
    exports_30("listenAndServeTLS", listenAndServeTLS);
    return {
        setters: [
            function (utf8_ts_2_1) {
                utf8_ts_2 = utf8_ts_2_1;
            },
            function (bufio_ts_1_1) {
                bufio_ts_1 = bufio_ts_1_1;
            },
            function (assert_ts_3_1) {
                assert_ts_3 = assert_ts_3_1;
            },
            function (mod_ts_3_1) {
                mod_ts_3 = mod_ts_3_1;
            },
            function (_io_ts_1_1) {
                _io_ts_1 = _io_ts_1_1;
            }
        ],
        execute: function () {
            ServerRequest = class ServerRequest {
                constructor() {
                    this.done = mod_ts_3.deferred();
                    this._contentLength = undefined;
                    this._body = null;
                    this.finalized = false;
                }
                get contentLength() {
                    if (this._contentLength === undefined) {
                        const cl = this.headers.get("content-length");
                        if (cl) {
                            this._contentLength = parseInt(cl);
                            if (Number.isNaN(this._contentLength)) {
                                this._contentLength = null;
                            }
                        }
                        else {
                            this._contentLength = null;
                        }
                    }
                    return this._contentLength;
                }
                get body() {
                    if (!this._body) {
                        if (this.contentLength != null) {
                            this._body = _io_ts_1.bodyReader(this.contentLength, this.r);
                        }
                        else {
                            const transferEncoding = this.headers.get("transfer-encoding");
                            if (transferEncoding != null) {
                                const parts = transferEncoding
                                    .split(",")
                                    .map((e) => e.trim().toLowerCase());
                                assert_ts_3.assert(parts.includes("chunked"), 'transfer-encoding must include "chunked" if content-length is not set');
                                this._body = _io_ts_1.chunkedBodyReader(this.headers, this.r);
                            }
                            else {
                                this._body = _io_ts_1.emptyReader();
                            }
                        }
                    }
                    return this._body;
                }
                async respond(r) {
                    let err;
                    try {
                        await _io_ts_1.writeResponse(this.w, r);
                    }
                    catch (e) {
                        try {
                            this.conn.close();
                        }
                        catch {
                        }
                        err = e;
                    }
                    this.done.resolve(err);
                    if (err) {
                        throw err;
                    }
                }
                async finalize() {
                    if (this.finalized)
                        return;
                    const body = this.body;
                    const buf = new Uint8Array(1024);
                    while ((await body.read(buf)) !== null) {
                    }
                    this.finalized = true;
                }
            };
            exports_30("ServerRequest", ServerRequest);
            Server = class Server {
                constructor(listener) {
                    this.listener = listener;
                    this.closing = false;
                    this.connections = [];
                }
                close() {
                    this.closing = true;
                    this.listener.close();
                    for (const conn of this.connections) {
                        try {
                            conn.close();
                        }
                        catch (e) {
                            if (!(e instanceof Deno.errors.BadResource)) {
                                throw e;
                            }
                        }
                    }
                }
                async *iterateHttpRequests(conn) {
                    const reader = new bufio_ts_1.BufReader(conn);
                    const writer = new bufio_ts_1.BufWriter(conn);
                    while (!this.closing) {
                        let request;
                        try {
                            request = await _io_ts_1.readRequest(conn, reader);
                        }
                        catch (error) {
                            if (error instanceof Deno.errors.InvalidData ||
                                error instanceof Deno.errors.UnexpectedEof) {
                                await _io_ts_1.writeResponse(writer, {
                                    status: 400,
                                    body: utf8_ts_2.encode(`${error.message}\r\n\r\n`),
                                });
                            }
                            break;
                        }
                        if (request === null) {
                            break;
                        }
                        request.w = writer;
                        yield request;
                        const responseError = await request.done;
                        if (responseError) {
                            this.untrackConnection(request.conn);
                            return;
                        }
                        await request.finalize();
                    }
                    this.untrackConnection(conn);
                    try {
                        conn.close();
                    }
                    catch (e) {
                    }
                }
                trackConnection(conn) {
                    this.connections.push(conn);
                }
                untrackConnection(conn) {
                    const index = this.connections.indexOf(conn);
                    if (index !== -1) {
                        this.connections.splice(index, 1);
                    }
                }
                async *acceptConnAndIterateHttpRequests(mux) {
                    if (this.closing)
                        return;
                    let conn;
                    try {
                        conn = await this.listener.accept();
                    }
                    catch (error) {
                        if (error instanceof Deno.errors.BadResource ||
                            error instanceof Deno.errors.InvalidData ||
                            error instanceof Deno.errors.UnexpectedEof) {
                            return mux.add(this.acceptConnAndIterateHttpRequests(mux));
                        }
                        throw error;
                    }
                    this.trackConnection(conn);
                    mux.add(this.acceptConnAndIterateHttpRequests(mux));
                    yield* this.iterateHttpRequests(conn);
                }
                [Symbol.asyncIterator]() {
                    const mux = new mod_ts_3.MuxAsyncIterator();
                    mux.add(this.acceptConnAndIterateHttpRequests(mux));
                    return mux.iterate();
                }
            };
            exports_30("Server", Server);
        }
    };
});
System.register("https://deno.land/std@0.67.0/http/http_status", [], function (exports_31, context_31) {
    "use strict";
    var Status, STATUS_TEXT;
    var __moduleName = context_31 && context_31.id;
    return {
        setters: [],
        execute: function () {
            (function (Status) {
                Status[Status["Continue"] = 100] = "Continue";
                Status[Status["SwitchingProtocols"] = 101] = "SwitchingProtocols";
                Status[Status["Processing"] = 102] = "Processing";
                Status[Status["EarlyHints"] = 103] = "EarlyHints";
                Status[Status["OK"] = 200] = "OK";
                Status[Status["Created"] = 201] = "Created";
                Status[Status["Accepted"] = 202] = "Accepted";
                Status[Status["NonAuthoritativeInfo"] = 203] = "NonAuthoritativeInfo";
                Status[Status["NoContent"] = 204] = "NoContent";
                Status[Status["ResetContent"] = 205] = "ResetContent";
                Status[Status["PartialContent"] = 206] = "PartialContent";
                Status[Status["MultiStatus"] = 207] = "MultiStatus";
                Status[Status["AlreadyReported"] = 208] = "AlreadyReported";
                Status[Status["IMUsed"] = 226] = "IMUsed";
                Status[Status["MultipleChoices"] = 300] = "MultipleChoices";
                Status[Status["MovedPermanently"] = 301] = "MovedPermanently";
                Status[Status["Found"] = 302] = "Found";
                Status[Status["SeeOther"] = 303] = "SeeOther";
                Status[Status["NotModified"] = 304] = "NotModified";
                Status[Status["UseProxy"] = 305] = "UseProxy";
                Status[Status["TemporaryRedirect"] = 307] = "TemporaryRedirect";
                Status[Status["PermanentRedirect"] = 308] = "PermanentRedirect";
                Status[Status["BadRequest"] = 400] = "BadRequest";
                Status[Status["Unauthorized"] = 401] = "Unauthorized";
                Status[Status["PaymentRequired"] = 402] = "PaymentRequired";
                Status[Status["Forbidden"] = 403] = "Forbidden";
                Status[Status["NotFound"] = 404] = "NotFound";
                Status[Status["MethodNotAllowed"] = 405] = "MethodNotAllowed";
                Status[Status["NotAcceptable"] = 406] = "NotAcceptable";
                Status[Status["ProxyAuthRequired"] = 407] = "ProxyAuthRequired";
                Status[Status["RequestTimeout"] = 408] = "RequestTimeout";
                Status[Status["Conflict"] = 409] = "Conflict";
                Status[Status["Gone"] = 410] = "Gone";
                Status[Status["LengthRequired"] = 411] = "LengthRequired";
                Status[Status["PreconditionFailed"] = 412] = "PreconditionFailed";
                Status[Status["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
                Status[Status["RequestURITooLong"] = 414] = "RequestURITooLong";
                Status[Status["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
                Status[Status["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
                Status[Status["ExpectationFailed"] = 417] = "ExpectationFailed";
                Status[Status["Teapot"] = 418] = "Teapot";
                Status[Status["MisdirectedRequest"] = 421] = "MisdirectedRequest";
                Status[Status["UnprocessableEntity"] = 422] = "UnprocessableEntity";
                Status[Status["Locked"] = 423] = "Locked";
                Status[Status["FailedDependency"] = 424] = "FailedDependency";
                Status[Status["TooEarly"] = 425] = "TooEarly";
                Status[Status["UpgradeRequired"] = 426] = "UpgradeRequired";
                Status[Status["PreconditionRequired"] = 428] = "PreconditionRequired";
                Status[Status["TooManyRequests"] = 429] = "TooManyRequests";
                Status[Status["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
                Status[Status["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
                Status[Status["InternalServerError"] = 500] = "InternalServerError";
                Status[Status["NotImplemented"] = 501] = "NotImplemented";
                Status[Status["BadGateway"] = 502] = "BadGateway";
                Status[Status["ServiceUnavailable"] = 503] = "ServiceUnavailable";
                Status[Status["GatewayTimeout"] = 504] = "GatewayTimeout";
                Status[Status["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
                Status[Status["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
                Status[Status["InsufficientStorage"] = 507] = "InsufficientStorage";
                Status[Status["LoopDetected"] = 508] = "LoopDetected";
                Status[Status["NotExtended"] = 510] = "NotExtended";
                Status[Status["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
            })(Status || (Status = {}));
            exports_31("Status", Status);
            exports_31("STATUS_TEXT", STATUS_TEXT = new Map([
                [Status.Continue, "Continue"],
                [Status.SwitchingProtocols, "Switching Protocols"],
                [Status.Processing, "Processing"],
                [Status.EarlyHints, "Early Hints"],
                [Status.OK, "OK"],
                [Status.Created, "Created"],
                [Status.Accepted, "Accepted"],
                [Status.NonAuthoritativeInfo, "Non-Authoritative Information"],
                [Status.NoContent, "No Content"],
                [Status.ResetContent, "Reset Content"],
                [Status.PartialContent, "Partial Content"],
                [Status.MultiStatus, "Multi-Status"],
                [Status.AlreadyReported, "Already Reported"],
                [Status.IMUsed, "IM Used"],
                [Status.MultipleChoices, "Multiple Choices"],
                [Status.MovedPermanently, "Moved Permanently"],
                [Status.Found, "Found"],
                [Status.SeeOther, "See Other"],
                [Status.NotModified, "Not Modified"],
                [Status.UseProxy, "Use Proxy"],
                [Status.TemporaryRedirect, "Temporary Redirect"],
                [Status.PermanentRedirect, "Permanent Redirect"],
                [Status.BadRequest, "Bad Request"],
                [Status.Unauthorized, "Unauthorized"],
                [Status.PaymentRequired, "Payment Required"],
                [Status.Forbidden, "Forbidden"],
                [Status.NotFound, "Not Found"],
                [Status.MethodNotAllowed, "Method Not Allowed"],
                [Status.NotAcceptable, "Not Acceptable"],
                [Status.ProxyAuthRequired, "Proxy Authentication Required"],
                [Status.RequestTimeout, "Request Timeout"],
                [Status.Conflict, "Conflict"],
                [Status.Gone, "Gone"],
                [Status.LengthRequired, "Length Required"],
                [Status.PreconditionFailed, "Precondition Failed"],
                [Status.RequestEntityTooLarge, "Request Entity Too Large"],
                [Status.RequestURITooLong, "Request URI Too Long"],
                [Status.UnsupportedMediaType, "Unsupported Media Type"],
                [Status.RequestedRangeNotSatisfiable, "Requested Range Not Satisfiable"],
                [Status.ExpectationFailed, "Expectation Failed"],
                [Status.Teapot, "I'm a teapot"],
                [Status.MisdirectedRequest, "Misdirected Request"],
                [Status.UnprocessableEntity, "Unprocessable Entity"],
                [Status.Locked, "Locked"],
                [Status.FailedDependency, "Failed Dependency"],
                [Status.TooEarly, "Too Early"],
                [Status.UpgradeRequired, "Upgrade Required"],
                [Status.PreconditionRequired, "Precondition Required"],
                [Status.TooManyRequests, "Too Many Requests"],
                [Status.RequestHeaderFieldsTooLarge, "Request Header Fields Too Large"],
                [Status.UnavailableForLegalReasons, "Unavailable For Legal Reasons"],
                [Status.InternalServerError, "Internal Server Error"],
                [Status.NotImplemented, "Not Implemented"],
                [Status.BadGateway, "Bad Gateway"],
                [Status.ServiceUnavailable, "Service Unavailable"],
                [Status.GatewayTimeout, "Gateway Timeout"],
                [Status.HTTPVersionNotSupported, "HTTP Version Not Supported"],
                [Status.VariantAlsoNegotiates, "Variant Also Negotiates"],
                [Status.InsufficientStorage, "Insufficient Storage"],
                [Status.LoopDetected, "Loop Detected"],
                [Status.NotExtended, "Not Extended"],
                [Status.NetworkAuthenticationRequired, "Network Authentication Required"],
            ]));
        }
    };
});
System.register("https://deno.land/std@0.67.0/http/_io", ["https://deno.land/std@0.67.0/io/bufio", "https://deno.land/std@0.67.0/textproto/mod", "https://deno.land/std@0.67.0/_util/assert", "https://deno.land/std@0.67.0/encoding/utf8", "https://deno.land/std@0.67.0/http/server", "https://deno.land/std@0.67.0/http/http_status"], function (exports_32, context_32) {
    "use strict";
    var bufio_ts_2, mod_ts_4, assert_ts_4, utf8_ts_3, server_ts_1, http_status_ts_1;
    var __moduleName = context_32 && context_32.id;
    function emptyReader() {
        return {
            read(_) {
                return Promise.resolve(null);
            },
        };
    }
    exports_32("emptyReader", emptyReader);
    function bodyReader(contentLength, r) {
        let totalRead = 0;
        let finished = false;
        async function read(buf) {
            if (finished)
                return null;
            let result;
            const remaining = contentLength - totalRead;
            if (remaining >= buf.byteLength) {
                result = await r.read(buf);
            }
            else {
                const readBuf = buf.subarray(0, remaining);
                result = await r.read(readBuf);
            }
            if (result !== null) {
                totalRead += result;
            }
            finished = totalRead === contentLength;
            return result;
        }
        return { read };
    }
    exports_32("bodyReader", bodyReader);
    function chunkedBodyReader(h, r) {
        const tp = new mod_ts_4.TextProtoReader(r);
        let finished = false;
        const chunks = [];
        async function read(buf) {
            if (finished)
                return null;
            const [chunk] = chunks;
            if (chunk) {
                const chunkRemaining = chunk.data.byteLength - chunk.offset;
                const readLength = Math.min(chunkRemaining, buf.byteLength);
                for (let i = 0; i < readLength; i++) {
                    buf[i] = chunk.data[chunk.offset + i];
                }
                chunk.offset += readLength;
                if (chunk.offset === chunk.data.byteLength) {
                    chunks.shift();
                    if ((await tp.readLine()) === null) {
                        throw new Deno.errors.UnexpectedEof();
                    }
                }
                return readLength;
            }
            const line = await tp.readLine();
            if (line === null)
                throw new Deno.errors.UnexpectedEof();
            const [chunkSizeString] = line.split(";");
            const chunkSize = parseInt(chunkSizeString, 16);
            if (Number.isNaN(chunkSize) || chunkSize < 0) {
                throw new Error("Invalid chunk size");
            }
            if (chunkSize > 0) {
                if (chunkSize > buf.byteLength) {
                    let eof = await r.readFull(buf);
                    if (eof === null) {
                        throw new Deno.errors.UnexpectedEof();
                    }
                    const restChunk = new Uint8Array(chunkSize - buf.byteLength);
                    eof = await r.readFull(restChunk);
                    if (eof === null) {
                        throw new Deno.errors.UnexpectedEof();
                    }
                    else {
                        chunks.push({
                            offset: 0,
                            data: restChunk,
                        });
                    }
                    return buf.byteLength;
                }
                else {
                    const bufToFill = buf.subarray(0, chunkSize);
                    const eof = await r.readFull(bufToFill);
                    if (eof === null) {
                        throw new Deno.errors.UnexpectedEof();
                    }
                    if ((await tp.readLine()) === null) {
                        throw new Deno.errors.UnexpectedEof();
                    }
                    return chunkSize;
                }
            }
            else {
                assert_ts_4.assert(chunkSize === 0);
                if ((await r.readLine()) === null) {
                    throw new Deno.errors.UnexpectedEof();
                }
                await readTrailers(h, r);
                finished = true;
                return null;
            }
        }
        return { read };
    }
    exports_32("chunkedBodyReader", chunkedBodyReader);
    function isProhibidedForTrailer(key) {
        const s = new Set(["transfer-encoding", "content-length", "trailer"]);
        return s.has(key.toLowerCase());
    }
    async function readTrailers(headers, r) {
        const trailers = parseTrailer(headers.get("trailer"));
        if (trailers == null)
            return;
        const trailerNames = [...trailers.keys()];
        const tp = new mod_ts_4.TextProtoReader(r);
        const result = await tp.readMIMEHeader();
        if (result == null) {
            throw new Deno.errors.InvalidData("Missing trailer header.");
        }
        const undeclared = [...result.keys()].filter((k) => !trailerNames.includes(k));
        if (undeclared.length > 0) {
            throw new Deno.errors.InvalidData(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
        }
        for (const [k, v] of result) {
            headers.append(k, v);
        }
        const missingTrailers = trailerNames.filter((k) => !result.has(k));
        if (missingTrailers.length > 0) {
            throw new Deno.errors.InvalidData(`Missing trailers: ${Deno.inspect(missingTrailers)}.`);
        }
        headers.delete("trailer");
    }
    exports_32("readTrailers", readTrailers);
    function parseTrailer(field) {
        if (field == null) {
            return undefined;
        }
        const trailerNames = field.split(",").map((v) => v.trim().toLowerCase());
        if (trailerNames.length === 0) {
            throw new Deno.errors.InvalidData("Empty trailer header.");
        }
        const prohibited = trailerNames.filter((k) => isProhibidedForTrailer(k));
        if (prohibited.length > 0) {
            throw new Deno.errors.InvalidData(`Prohibited trailer names: ${Deno.inspect(prohibited)}.`);
        }
        return new Headers(trailerNames.map((key) => [key, ""]));
    }
    async function writeChunkedBody(w, r) {
        const writer = bufio_ts_2.BufWriter.create(w);
        for await (const chunk of Deno.iter(r)) {
            if (chunk.byteLength <= 0)
                continue;
            const start = utf8_ts_3.encoder.encode(`${chunk.byteLength.toString(16)}\r\n`);
            const end = utf8_ts_3.encoder.encode("\r\n");
            await writer.write(start);
            await writer.write(chunk);
            await writer.write(end);
        }
        const endChunk = utf8_ts_3.encoder.encode("0\r\n\r\n");
        await writer.write(endChunk);
    }
    exports_32("writeChunkedBody", writeChunkedBody);
    async function writeTrailers(w, headers, trailers) {
        const trailer = headers.get("trailer");
        if (trailer === null) {
            throw new TypeError("Missing trailer header.");
        }
        const transferEncoding = headers.get("transfer-encoding");
        if (transferEncoding === null || !transferEncoding.match(/^chunked/)) {
            throw new TypeError(`Trailers are only allowed for "transfer-encoding: chunked", got "transfer-encoding: ${transferEncoding}".`);
        }
        const writer = bufio_ts_2.BufWriter.create(w);
        const trailerNames = trailer.split(",").map((s) => s.trim().toLowerCase());
        const prohibitedTrailers = trailerNames.filter((k) => isProhibidedForTrailer(k));
        if (prohibitedTrailers.length > 0) {
            throw new TypeError(`Prohibited trailer names: ${Deno.inspect(prohibitedTrailers)}.`);
        }
        const undeclared = [...trailers.keys()].filter((k) => !trailerNames.includes(k));
        if (undeclared.length > 0) {
            throw new TypeError(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
        }
        for (const [key, value] of trailers) {
            await writer.write(utf8_ts_3.encoder.encode(`${key}: ${value}\r\n`));
        }
        await writer.write(utf8_ts_3.encoder.encode("\r\n"));
        await writer.flush();
    }
    exports_32("writeTrailers", writeTrailers);
    async function writeResponse(w, r) {
        const protoMajor = 1;
        const protoMinor = 1;
        const statusCode = r.status || 200;
        const statusText = http_status_ts_1.STATUS_TEXT.get(statusCode);
        const writer = bufio_ts_2.BufWriter.create(w);
        if (!statusText) {
            throw new Deno.errors.InvalidData("Bad status code");
        }
        if (!r.body) {
            r.body = new Uint8Array();
        }
        if (typeof r.body === "string") {
            r.body = utf8_ts_3.encoder.encode(r.body);
        }
        let out = `HTTP/${protoMajor}.${protoMinor} ${statusCode} ${statusText}\r\n`;
        const headers = r.headers ?? new Headers();
        if (r.body && !headers.get("content-length")) {
            if (r.body instanceof Uint8Array) {
                out += `content-length: ${r.body.byteLength}\r\n`;
            }
            else if (!headers.get("transfer-encoding")) {
                out += "transfer-encoding: chunked\r\n";
            }
        }
        for (const [key, value] of headers) {
            out += `${key}: ${value}\r\n`;
        }
        out += `\r\n`;
        const header = utf8_ts_3.encoder.encode(out);
        const n = await writer.write(header);
        assert_ts_4.assert(n === header.byteLength);
        if (r.body instanceof Uint8Array) {
            const n = await writer.write(r.body);
            assert_ts_4.assert(n === r.body.byteLength);
        }
        else if (headers.has("content-length")) {
            const contentLength = headers.get("content-length");
            assert_ts_4.assert(contentLength != null);
            const bodyLength = parseInt(contentLength);
            const n = await Deno.copy(r.body, writer);
            assert_ts_4.assert(n === bodyLength);
        }
        else {
            await writeChunkedBody(writer, r.body);
        }
        if (r.trailers) {
            const t = await r.trailers();
            await writeTrailers(writer, headers, t);
        }
        await writer.flush();
    }
    exports_32("writeResponse", writeResponse);
    function parseHTTPVersion(vers) {
        switch (vers) {
            case "HTTP/1.1":
                return [1, 1];
            case "HTTP/1.0":
                return [1, 0];
            default: {
                const Big = 1000000;
                if (!vers.startsWith("HTTP/")) {
                    break;
                }
                const dot = vers.indexOf(".");
                if (dot < 0) {
                    break;
                }
                const majorStr = vers.substring(vers.indexOf("/") + 1, dot);
                const major = Number(majorStr);
                if (!Number.isInteger(major) || major < 0 || major > Big) {
                    break;
                }
                const minorStr = vers.substring(dot + 1);
                const minor = Number(minorStr);
                if (!Number.isInteger(minor) || minor < 0 || minor > Big) {
                    break;
                }
                return [major, minor];
            }
        }
        throw new Error(`malformed HTTP version ${vers}`);
    }
    exports_32("parseHTTPVersion", parseHTTPVersion);
    async function readRequest(conn, bufr) {
        const tp = new mod_ts_4.TextProtoReader(bufr);
        const firstLine = await tp.readLine();
        if (firstLine === null)
            return null;
        const headers = await tp.readMIMEHeader();
        if (headers === null)
            throw new Deno.errors.UnexpectedEof();
        const req = new server_ts_1.ServerRequest();
        req.conn = conn;
        req.r = bufr;
        [req.method, req.url, req.proto] = firstLine.split(" ", 3);
        [req.protoMinor, req.protoMajor] = parseHTTPVersion(req.proto);
        req.headers = headers;
        fixLength(req);
        return req;
    }
    exports_32("readRequest", readRequest);
    function fixLength(req) {
        const contentLength = req.headers.get("Content-Length");
        if (contentLength) {
            const arrClen = contentLength.split(",");
            if (arrClen.length > 1) {
                const distinct = [...new Set(arrClen.map((e) => e.trim()))];
                if (distinct.length > 1) {
                    throw Error("cannot contain multiple Content-Length headers");
                }
                else {
                    req.headers.set("Content-Length", distinct[0]);
                }
            }
            const c = req.headers.get("Content-Length");
            if (req.method === "HEAD" && c && c !== "0") {
                throw Error("http: method cannot contain a Content-Length");
            }
            if (c && req.headers.has("transfer-encoding")) {
                throw new Error("http: Transfer-Encoding and Content-Length cannot be send together");
            }
        }
    }
    return {
        setters: [
            function (bufio_ts_2_1) {
                bufio_ts_2 = bufio_ts_2_1;
            },
            function (mod_ts_4_1) {
                mod_ts_4 = mod_ts_4_1;
            },
            function (assert_ts_4_1) {
                assert_ts_4 = assert_ts_4_1;
            },
            function (utf8_ts_3_1) {
                utf8_ts_3 = utf8_ts_3_1;
            },
            function (server_ts_1_1) {
                server_ts_1 = server_ts_1_1;
            },
            function (http_status_ts_1_1) {
                http_status_ts_1 = http_status_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.67.0/ws/mod", ["https://deno.land/std@0.67.0/encoding/utf8", "https://deno.land/std@0.67.0/_util/has_own_property", "https://deno.land/std@0.67.0/io/bufio", "https://deno.land/std@0.67.0/io/ioutil", "https://deno.land/std@0.67.0/hash/sha1", "https://deno.land/std@0.67.0/http/_io", "https://deno.land/std@0.67.0/textproto/mod", "https://deno.land/std@0.67.0/async/deferred", "https://deno.land/std@0.67.0/_util/assert", "https://deno.land/std@0.67.0/bytes/mod"], function (exports_33, context_33) {
    "use strict";
    var utf8_ts_4, has_own_property_ts_1, bufio_ts_3, ioutil_ts_1, sha1_ts_1, _io_ts_2, mod_ts_5, deferred_ts_3, assert_ts_5, mod_ts_6, OpCode, WebSocketImpl, kGUID, kSecChars;
    var __moduleName = context_33 && context_33.id;
    function isWebSocketCloseEvent(a) {
        return has_own_property_ts_1.hasOwnProperty(a, "code");
    }
    exports_33("isWebSocketCloseEvent", isWebSocketCloseEvent);
    function isWebSocketPingEvent(a) {
        return Array.isArray(a) && a[0] === "ping" && a[1] instanceof Uint8Array;
    }
    exports_33("isWebSocketPingEvent", isWebSocketPingEvent);
    function isWebSocketPongEvent(a) {
        return Array.isArray(a) && a[0] === "pong" && a[1] instanceof Uint8Array;
    }
    exports_33("isWebSocketPongEvent", isWebSocketPongEvent);
    function unmask(payload, mask) {
        if (mask) {
            for (let i = 0, len = payload.length; i < len; i++) {
                payload[i] ^= mask[i & 3];
            }
        }
    }
    exports_33("unmask", unmask);
    async function writeFrame(frame, writer) {
        const payloadLength = frame.payload.byteLength;
        let header;
        const hasMask = frame.mask ? 0x80 : 0;
        if (frame.mask && frame.mask.byteLength !== 4) {
            throw new Error("invalid mask. mask must be 4 bytes: length=" + frame.mask.byteLength);
        }
        if (payloadLength < 126) {
            header = new Uint8Array([0x80 | frame.opcode, hasMask | payloadLength]);
        }
        else if (payloadLength < 0xffff) {
            header = new Uint8Array([
                0x80 | frame.opcode,
                hasMask | 0b01111110,
                payloadLength >>> 8,
                payloadLength & 0x00ff,
            ]);
        }
        else {
            header = new Uint8Array([
                0x80 | frame.opcode,
                hasMask | 0b01111111,
                ...ioutil_ts_1.sliceLongToBytes(payloadLength),
            ]);
        }
        if (frame.mask) {
            header = mod_ts_6.concat(header, frame.mask);
        }
        unmask(frame.payload, frame.mask);
        header = mod_ts_6.concat(header, frame.payload);
        const w = bufio_ts_3.BufWriter.create(writer);
        await w.write(header);
        await w.flush();
    }
    exports_33("writeFrame", writeFrame);
    async function readFrame(buf) {
        let b = await buf.readByte();
        assert_ts_5.assert(b !== null);
        let isLastFrame = false;
        switch (b >>> 4) {
            case 0b1000:
                isLastFrame = true;
                break;
            case 0b0000:
                isLastFrame = false;
                break;
            default:
                throw new Error("invalid signature");
        }
        const opcode = b & 0x0f;
        b = await buf.readByte();
        assert_ts_5.assert(b !== null);
        const hasMask = b >>> 7;
        let payloadLength = b & 0b01111111;
        if (payloadLength === 126) {
            const l = await ioutil_ts_1.readShort(buf);
            assert_ts_5.assert(l !== null);
            payloadLength = l;
        }
        else if (payloadLength === 127) {
            const l = await ioutil_ts_1.readLong(buf);
            assert_ts_5.assert(l !== null);
            payloadLength = Number(l);
        }
        let mask;
        if (hasMask) {
            mask = new Uint8Array(4);
            assert_ts_5.assert((await buf.readFull(mask)) !== null);
        }
        const payload = new Uint8Array(payloadLength);
        assert_ts_5.assert((await buf.readFull(payload)) !== null);
        return {
            isLastFrame,
            opcode,
            mask,
            payload,
        };
    }
    exports_33("readFrame", readFrame);
    function createMask() {
        return crypto.getRandomValues(new Uint8Array(4));
    }
    function acceptable(req) {
        const upgrade = req.headers.get("upgrade");
        if (!upgrade || upgrade.toLowerCase() !== "websocket") {
            return false;
        }
        const secKey = req.headers.get("sec-websocket-key");
        return (req.headers.has("sec-websocket-key") &&
            typeof secKey === "string" &&
            secKey.length > 0);
    }
    exports_33("acceptable", acceptable);
    function createSecAccept(nonce) {
        const sha1 = new sha1_ts_1.Sha1();
        sha1.update(nonce + kGUID);
        const bytes = sha1.digest();
        return btoa(String.fromCharCode(...bytes));
    }
    exports_33("createSecAccept", createSecAccept);
    async function acceptWebSocket(req) {
        const { conn, headers, bufReader, bufWriter } = req;
        if (acceptable(req)) {
            const sock = new WebSocketImpl({ conn, bufReader, bufWriter });
            const secKey = headers.get("sec-websocket-key");
            if (typeof secKey !== "string") {
                throw new Error("sec-websocket-key is not provided");
            }
            const secAccept = createSecAccept(secKey);
            await _io_ts_2.writeResponse(bufWriter, {
                status: 101,
                headers: new Headers({
                    Upgrade: "websocket",
                    Connection: "Upgrade",
                    "Sec-WebSocket-Accept": secAccept,
                }),
            });
            return sock;
        }
        throw new Error("request is not acceptable");
    }
    exports_33("acceptWebSocket", acceptWebSocket);
    function createSecKey() {
        let key = "";
        for (let i = 0; i < 16; i++) {
            const j = Math.floor(Math.random() * kSecChars.length);
            key += kSecChars[j];
        }
        return btoa(key);
    }
    exports_33("createSecKey", createSecKey);
    async function handshake(url, headers, bufReader, bufWriter) {
        const { hostname, pathname, search } = url;
        const key = createSecKey();
        if (!headers.has("host")) {
            headers.set("host", hostname);
        }
        headers.set("upgrade", "websocket");
        headers.set("connection", "upgrade");
        headers.set("sec-websocket-key", key);
        headers.set("sec-websocket-version", "13");
        let headerStr = `GET ${pathname}${search} HTTP/1.1\r\n`;
        for (const [key, value] of headers) {
            headerStr += `${key}: ${value}\r\n`;
        }
        headerStr += "\r\n";
        await bufWriter.write(utf8_ts_4.encode(headerStr));
        await bufWriter.flush();
        const tpReader = new mod_ts_5.TextProtoReader(bufReader);
        const statusLine = await tpReader.readLine();
        if (statusLine === null) {
            throw new Deno.errors.UnexpectedEof();
        }
        const m = statusLine.match(/^(?<version>\S+) (?<statusCode>\S+) /);
        if (!m) {
            throw new Error("ws: invalid status line: " + statusLine);
        }
        assert_ts_5.assert(m.groups);
        const { version, statusCode } = m.groups;
        if (version !== "HTTP/1.1" || statusCode !== "101") {
            throw new Error(`ws: server didn't accept handshake: ` +
                `version=${version}, statusCode=${statusCode}`);
        }
        const responseHeaders = await tpReader.readMIMEHeader();
        if (responseHeaders === null) {
            throw new Deno.errors.UnexpectedEof();
        }
        const expectedSecAccept = createSecAccept(key);
        const secAccept = responseHeaders.get("sec-websocket-accept");
        if (secAccept !== expectedSecAccept) {
            throw new Error(`ws: unexpected sec-websocket-accept header: ` +
                `expected=${expectedSecAccept}, actual=${secAccept}`);
        }
    }
    exports_33("handshake", handshake);
    async function connectWebSocket(endpoint, headers = new Headers()) {
        const url = new URL(endpoint);
        const { hostname } = url;
        let conn;
        if (url.protocol === "http:" || url.protocol === "ws:") {
            const port = parseInt(url.port || "80");
            conn = await Deno.connect({ hostname, port });
        }
        else if (url.protocol === "https:" || url.protocol === "wss:") {
            const port = parseInt(url.port || "443");
            conn = await Deno.connectTls({ hostname, port });
        }
        else {
            throw new Error("ws: unsupported protocol: " + url.protocol);
        }
        const bufWriter = new bufio_ts_3.BufWriter(conn);
        const bufReader = new bufio_ts_3.BufReader(conn);
        try {
            await handshake(url, headers, bufReader, bufWriter);
        }
        catch (err) {
            conn.close();
            throw err;
        }
        return new WebSocketImpl({
            conn,
            bufWriter,
            bufReader,
            mask: createMask(),
        });
    }
    exports_33("connectWebSocket", connectWebSocket);
    function createWebSocket(params) {
        return new WebSocketImpl(params);
    }
    exports_33("createWebSocket", createWebSocket);
    return {
        setters: [
            function (utf8_ts_4_1) {
                utf8_ts_4 = utf8_ts_4_1;
            },
            function (has_own_property_ts_1_1) {
                has_own_property_ts_1 = has_own_property_ts_1_1;
            },
            function (bufio_ts_3_1) {
                bufio_ts_3 = bufio_ts_3_1;
            },
            function (ioutil_ts_1_1) {
                ioutil_ts_1 = ioutil_ts_1_1;
            },
            function (sha1_ts_1_1) {
                sha1_ts_1 = sha1_ts_1_1;
            },
            function (_io_ts_2_1) {
                _io_ts_2 = _io_ts_2_1;
            },
            function (mod_ts_5_1) {
                mod_ts_5 = mod_ts_5_1;
            },
            function (deferred_ts_3_1) {
                deferred_ts_3 = deferred_ts_3_1;
            },
            function (assert_ts_5_1) {
                assert_ts_5 = assert_ts_5_1;
            },
            function (mod_ts_6_1) {
                mod_ts_6 = mod_ts_6_1;
            }
        ],
        execute: function () {
            (function (OpCode) {
                OpCode[OpCode["Continue"] = 0] = "Continue";
                OpCode[OpCode["TextFrame"] = 1] = "TextFrame";
                OpCode[OpCode["BinaryFrame"] = 2] = "BinaryFrame";
                OpCode[OpCode["Close"] = 8] = "Close";
                OpCode[OpCode["Ping"] = 9] = "Ping";
                OpCode[OpCode["Pong"] = 10] = "Pong";
            })(OpCode || (OpCode = {}));
            exports_33("OpCode", OpCode);
            WebSocketImpl = class WebSocketImpl {
                constructor({ conn, bufReader, bufWriter, mask, }) {
                    this.sendQueue = [];
                    this._isClosed = false;
                    this.conn = conn;
                    this.mask = mask;
                    this.bufReader = bufReader || new bufio_ts_3.BufReader(conn);
                    this.bufWriter = bufWriter || new bufio_ts_3.BufWriter(conn);
                }
                async *[Symbol.asyncIterator]() {
                    let frames = [];
                    let payloadsLength = 0;
                    while (!this._isClosed) {
                        let frame;
                        try {
                            frame = await readFrame(this.bufReader);
                        }
                        catch (e) {
                            this.ensureSocketClosed();
                            break;
                        }
                        unmask(frame.payload, frame.mask);
                        switch (frame.opcode) {
                            case OpCode.TextFrame:
                            case OpCode.BinaryFrame:
                            case OpCode.Continue:
                                frames.push(frame);
                                payloadsLength += frame.payload.length;
                                if (frame.isLastFrame) {
                                    const concat = new Uint8Array(payloadsLength);
                                    let offs = 0;
                                    for (const frame of frames) {
                                        concat.set(frame.payload, offs);
                                        offs += frame.payload.length;
                                    }
                                    if (frames[0].opcode === OpCode.TextFrame) {
                                        yield utf8_ts_4.decode(concat);
                                    }
                                    else {
                                        yield concat;
                                    }
                                    frames = [];
                                    payloadsLength = 0;
                                }
                                break;
                            case OpCode.Close: {
                                const code = (frame.payload[0] << 8) | frame.payload[1];
                                const reason = utf8_ts_4.decode(frame.payload.subarray(2, frame.payload.length));
                                await this.close(code, reason);
                                yield { code, reason };
                                return;
                            }
                            case OpCode.Ping:
                                await this.enqueue({
                                    opcode: OpCode.Pong,
                                    payload: frame.payload,
                                    isLastFrame: true,
                                });
                                yield ["ping", frame.payload];
                                break;
                            case OpCode.Pong:
                                yield ["pong", frame.payload];
                                break;
                            default:
                        }
                    }
                }
                dequeue() {
                    const [entry] = this.sendQueue;
                    if (!entry)
                        return;
                    if (this._isClosed)
                        return;
                    const { d, frame } = entry;
                    writeFrame(frame, this.bufWriter)
                        .then(() => d.resolve())
                        .catch((e) => d.reject(e))
                        .finally(() => {
                        this.sendQueue.shift();
                        this.dequeue();
                    });
                }
                enqueue(frame) {
                    if (this._isClosed) {
                        throw new Deno.errors.ConnectionReset("Socket has already been closed");
                    }
                    const d = deferred_ts_3.deferred();
                    this.sendQueue.push({ d, frame });
                    if (this.sendQueue.length === 1) {
                        this.dequeue();
                    }
                    return d;
                }
                send(data) {
                    const opcode = typeof data === "string"
                        ? OpCode.TextFrame
                        : OpCode.BinaryFrame;
                    const payload = typeof data === "string" ? utf8_ts_4.encode(data) : data;
                    const isLastFrame = true;
                    const frame = {
                        isLastFrame,
                        opcode,
                        payload,
                        mask: this.mask,
                    };
                    return this.enqueue(frame);
                }
                ping(data = "") {
                    const payload = typeof data === "string" ? utf8_ts_4.encode(data) : data;
                    const frame = {
                        isLastFrame: true,
                        opcode: OpCode.Ping,
                        mask: this.mask,
                        payload,
                    };
                    return this.enqueue(frame);
                }
                get isClosed() {
                    return this._isClosed;
                }
                async close(code = 1000, reason) {
                    try {
                        const header = [code >>> 8, code & 0x00ff];
                        let payload;
                        if (reason) {
                            const reasonBytes = utf8_ts_4.encode(reason);
                            payload = new Uint8Array(2 + reasonBytes.byteLength);
                            payload.set(header);
                            payload.set(reasonBytes, 2);
                        }
                        else {
                            payload = new Uint8Array(header);
                        }
                        await this.enqueue({
                            isLastFrame: true,
                            opcode: OpCode.Close,
                            mask: this.mask,
                            payload,
                        });
                    }
                    catch (e) {
                        throw e;
                    }
                    finally {
                        this.ensureSocketClosed();
                    }
                }
                closeForce() {
                    this.ensureSocketClosed();
                }
                ensureSocketClosed() {
                    if (this.isClosed)
                        return;
                    try {
                        this.conn.close();
                    }
                    catch (e) {
                        console.error(e);
                    }
                    finally {
                        this._isClosed = true;
                        const rest = this.sendQueue;
                        this.sendQueue = [];
                        rest.forEach((e) => e.d.reject(new Deno.errors.ConnectionReset("Socket has already been closed")));
                    }
                }
            };
            kGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
            kSecChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.~_";
        }
    };
});
System.register("file:///home/elemti/nux/git/detun/deps/ws", ["https://deno.land/std@0.67.0/ws/mod"], function (exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    function exportStar_3(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_34(exports);
    }
    return {
        setters: [
            function (mod_ts_7_1) {
                exportStar_3(mod_ts_7_1);
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/isObject", [], function (exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    function isObject(value) {
        var type = typeof value;
        return value != null && (type == 'object' || type == 'function');
    }
    return {
        setters: [],
        execute: function () {
            exports_35("default", isObject);
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_freeGlobal", [], function (exports_36, context_36) {
    "use strict";
    var freeGlobal;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [],
        execute: function () {
            freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
            exports_36("default", freeGlobal);
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_root", ["https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_freeGlobal"], function (exports_37, context_37) {
    "use strict";
    var _freeGlobal_js_1, freeSelf, root;
    var __moduleName = context_37 && context_37.id;
    return {
        setters: [
            function (_freeGlobal_js_1_1) {
                _freeGlobal_js_1 = _freeGlobal_js_1_1;
            }
        ],
        execute: function () {
            freeSelf = typeof self == 'object' && self && self.Object === Object && self;
            root = _freeGlobal_js_1.default || freeSelf || Function('return this')();
            exports_37("default", root);
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/now", ["https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_root"], function (exports_38, context_38) {
    "use strict";
    var _root_js_1, now;
    var __moduleName = context_38 && context_38.id;
    return {
        setters: [
            function (_root_js_1_1) {
                _root_js_1 = _root_js_1_1;
            }
        ],
        execute: function () {
            now = function () {
                return _root_js_1.default.Date.now();
            };
            exports_38("default", now);
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_Symbol", ["https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_root"], function (exports_39, context_39) {
    "use strict";
    var _root_js_2, Symbol;
    var __moduleName = context_39 && context_39.id;
    return {
        setters: [
            function (_root_js_2_1) {
                _root_js_2 = _root_js_2_1;
            }
        ],
        execute: function () {
            Symbol = _root_js_2.default.Symbol;
            exports_39("default", Symbol);
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_getRawTag", ["https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_Symbol"], function (exports_40, context_40) {
    "use strict";
    var _Symbol_js_1, objectProto, hasOwnProperty, nativeObjectToString, symToStringTag;
    var __moduleName = context_40 && context_40.id;
    function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
        try {
            value[symToStringTag] = undefined;
            var unmasked = true;
        }
        catch (e) { }
        var result = nativeObjectToString.call(value);
        if (unmasked) {
            if (isOwn) {
                value[symToStringTag] = tag;
            }
            else {
                delete value[symToStringTag];
            }
        }
        return result;
    }
    return {
        setters: [
            function (_Symbol_js_1_1) {
                _Symbol_js_1 = _Symbol_js_1_1;
            }
        ],
        execute: function () {
            objectProto = Object.prototype;
            hasOwnProperty = objectProto.hasOwnProperty;
            nativeObjectToString = objectProto.toString;
            symToStringTag = _Symbol_js_1.default ? _Symbol_js_1.default.toStringTag : undefined;
            exports_40("default", getRawTag);
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_objectToString", [], function (exports_41, context_41) {
    "use strict";
    var objectProto, nativeObjectToString;
    var __moduleName = context_41 && context_41.id;
    function objectToString(value) {
        return nativeObjectToString.call(value);
    }
    return {
        setters: [],
        execute: function () {
            objectProto = Object.prototype;
            nativeObjectToString = objectProto.toString;
            exports_41("default", objectToString);
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_baseGetTag", ["https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_Symbol", "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_getRawTag", "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_objectToString"], function (exports_42, context_42) {
    "use strict";
    var _Symbol_js_2, _getRawTag_js_1, _objectToString_js_1, nullTag, undefinedTag, symToStringTag;
    var __moduleName = context_42 && context_42.id;
    function baseGetTag(value) {
        if (value == null) {
            return value === undefined ? undefinedTag : nullTag;
        }
        return (symToStringTag && symToStringTag in Object(value))
            ? _getRawTag_js_1.default(value)
            : _objectToString_js_1.default(value);
    }
    return {
        setters: [
            function (_Symbol_js_2_1) {
                _Symbol_js_2 = _Symbol_js_2_1;
            },
            function (_getRawTag_js_1_1) {
                _getRawTag_js_1 = _getRawTag_js_1_1;
            },
            function (_objectToString_js_1_1) {
                _objectToString_js_1 = _objectToString_js_1_1;
            }
        ],
        execute: function () {
            nullTag = '[object Null]', undefinedTag = '[object Undefined]';
            symToStringTag = _Symbol_js_2.default ? _Symbol_js_2.default.toStringTag : undefined;
            exports_42("default", baseGetTag);
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/isObjectLike", [], function (exports_43, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    function isObjectLike(value) {
        return value != null && typeof value == 'object';
    }
    return {
        setters: [],
        execute: function () {
            exports_43("default", isObjectLike);
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/isSymbol", ["https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/_baseGetTag", "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/isObjectLike"], function (exports_44, context_44) {
    "use strict";
    var _baseGetTag_js_1, isObjectLike_js_1, symbolTag;
    var __moduleName = context_44 && context_44.id;
    function isSymbol(value) {
        return typeof value == 'symbol' ||
            (isObjectLike_js_1.default(value) && _baseGetTag_js_1.default(value) == symbolTag);
    }
    return {
        setters: [
            function (_baseGetTag_js_1_1) {
                _baseGetTag_js_1 = _baseGetTag_js_1_1;
            },
            function (isObjectLike_js_1_1) {
                isObjectLike_js_1 = isObjectLike_js_1_1;
            }
        ],
        execute: function () {
            symbolTag = '[object Symbol]';
            exports_44("default", isSymbol);
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/toNumber", ["https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/isObject", "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/isSymbol"], function (exports_45, context_45) {
    "use strict";
    var isObject_js_1, isSymbol_js_1, NAN, reTrim, reIsBadHex, reIsBinary, reIsOctal, freeParseInt;
    var __moduleName = context_45 && context_45.id;
    function toNumber(value) {
        if (typeof value == 'number') {
            return value;
        }
        if (isSymbol_js_1.default(value)) {
            return NAN;
        }
        if (isObject_js_1.default(value)) {
            var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
            value = isObject_js_1.default(other) ? (other + '') : other;
        }
        if (typeof value != 'string') {
            return value === 0 ? value : +value;
        }
        value = value.replace(reTrim, '');
        var isBinary = reIsBinary.test(value);
        return (isBinary || reIsOctal.test(value))
            ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
            : (reIsBadHex.test(value) ? NAN : +value);
    }
    return {
        setters: [
            function (isObject_js_1_1) {
                isObject_js_1 = isObject_js_1_1;
            },
            function (isSymbol_js_1_1) {
                isSymbol_js_1 = isSymbol_js_1_1;
            }
        ],
        execute: function () {
            NAN = 0 / 0;
            reTrim = /^\s+|\s+$/g;
            reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
            reIsBinary = /^0b[01]+$/i;
            reIsOctal = /^0o[0-7]+$/i;
            freeParseInt = parseInt;
            exports_45("default", toNumber);
        }
    };
});
System.register("https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/debounce", ["https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/isObject", "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/now", "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/toNumber"], function (exports_46, context_46) {
    "use strict";
    var isObject_js_2, now_js_1, toNumber_js_1, FUNC_ERROR_TEXT, nativeMax, nativeMin;
    var __moduleName = context_46 && context_46.id;
    function debounce(func, wait, options) {
        var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
        if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
        }
        wait = toNumber_js_1.default(wait) || 0;
        if (isObject_js_2.default(options)) {
            leading = !!options.leading;
            maxing = 'maxWait' in options;
            maxWait = maxing ? nativeMax(toNumber_js_1.default(options.maxWait) || 0, wait) : maxWait;
            trailing = 'trailing' in options ? !!options.trailing : trailing;
        }
        function invokeFunc(time) {
            var args = lastArgs, thisArg = lastThis;
            lastArgs = lastThis = undefined;
            lastInvokeTime = time;
            result = func.apply(thisArg, args);
            return result;
        }
        function leadingEdge(time) {
            lastInvokeTime = time;
            timerId = setTimeout(timerExpired, wait);
            return leading ? invokeFunc(time) : result;
        }
        function remainingWait(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
            return maxing
                ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
                : timeWaiting;
        }
        function shouldInvoke(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
            return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
                (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
        }
        function timerExpired() {
            var time = now_js_1.default();
            if (shouldInvoke(time)) {
                return trailingEdge(time);
            }
            timerId = setTimeout(timerExpired, remainingWait(time));
        }
        function trailingEdge(time) {
            timerId = undefined;
            if (trailing && lastArgs) {
                return invokeFunc(time);
            }
            lastArgs = lastThis = undefined;
            return result;
        }
        function cancel() {
            if (timerId !== undefined) {
                clearTimeout(timerId);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timerId = undefined;
        }
        function flush() {
            return timerId === undefined ? result : trailingEdge(now_js_1.default());
        }
        function debounced() {
            var time = now_js_1.default(), isInvoking = shouldInvoke(time);
            lastArgs = arguments;
            lastThis = this;
            lastCallTime = time;
            if (isInvoking) {
                if (timerId === undefined) {
                    return leadingEdge(lastCallTime);
                }
                if (maxing) {
                    clearTimeout(timerId);
                    timerId = setTimeout(timerExpired, wait);
                    return invokeFunc(lastCallTime);
                }
            }
            if (timerId === undefined) {
                timerId = setTimeout(timerExpired, wait);
            }
            return result;
        }
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
    }
    return {
        setters: [
            function (isObject_js_2_1) {
                isObject_js_2 = isObject_js_2_1;
            },
            function (now_js_1_1) {
                now_js_1 = now_js_1_1;
            },
            function (toNumber_js_1_1) {
                toNumber_js_1 = toNumber_js_1_1;
            }
        ],
        execute: function () {
            FUNC_ERROR_TEXT = 'Expected a function';
            nativeMax = Math.max, nativeMin = Math.min;
            exports_46("default", debounce);
        }
    };
});
System.register("file:///home/elemti/nux/git/detun/deps/debounce", ["https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/debounce"], function (exports_47, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    return {
        setters: [
            function (debounce_js_1_1) {
                exports_47({
                    "default": debounce_js_1_1["default"]
                });
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///home/elemti/nux/git/detun/common/commKeepAlive", ["file:///home/elemti/nux/git/detun/deps/debounce", "file:///home/elemti/nux/git/detun/common/main", "file:///home/elemti/nux/git/detun/deps/ws"], function (exports_48, context_48) {
    "use strict";
    var debounce_js_2, main_js_1, ws_js_1, pingLoop;
    var __moduleName = context_48 && context_48.id;
    return {
        setters: [
            function (debounce_js_2_1) {
                debounce_js_2 = debounce_js_2_1;
            },
            function (main_js_1_1) {
                main_js_1 = main_js_1_1;
            },
            function (ws_js_1_1) {
                ws_js_1 = ws_js_1_1;
            }
        ],
        execute: function () {
            pingLoop = async (commSock) => {
                try {
                    await commSock.ping();
                }
                catch {
                    return;
                }
                setTimeout(() => pingLoop(commSock), main_js_1.PING_INTERV);
            };
            exports_48("default", (commSock, onCleanup) => {
                let cleanup = () => {
                    onCleanup?.();
                    commSock.close().catch(err => {
                        if (err.message?.trim?.() !== 'Socket has already been closed') {
                            console.error(err);
                        }
                        commSock.closeForce();
                    });
                };
                let debouncedCleanup = debounce_js_2.default(() => {
                    cleanup();
                    console.log('idle commConn dropped');
                }, main_js_1.PING_TIMEOUT);
                let onSockEv = ev => {
                    if (ev instanceof Uint8Array || ws_js_1.isWebSocketPingEvent(ev)) {
                        debouncedCleanup();
                    }
                    if (ws_js_1.isWebSocketCloseEvent(ev)) {
                        onSockEnd();
                    }
                };
                let onSockEnd = () => {
                    debouncedCleanup.cancel();
                    cleanup();
                    console.log('commSock closed');
                };
                pingLoop(commSock);
                debouncedCleanup();
                return { onSockEv, onSockEnd };
            });
        }
    };
});
System.register("https://deno.land/std@0.67.0/flags/mod", ["https://deno.land/std@0.67.0/_util/assert"], function (exports_49, context_49) {
    "use strict";
    var assert_ts_6;
    var __moduleName = context_49 && context_49.id;
    function get(obj, key) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return obj[key];
        }
    }
    function getForce(obj, key) {
        const v = get(obj, key);
        assert_ts_6.assert(v != null);
        return v;
    }
    function isNumber(x) {
        if (typeof x === "number")
            return true;
        if (/^0x[0-9a-f]+$/i.test(String(x)))
            return true;
        return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x));
    }
    function hasKey(obj, keys) {
        let o = obj;
        keys.slice(0, -1).forEach((key) => {
            o = (get(o, key) ?? {});
        });
        const key = keys[keys.length - 1];
        return key in o;
    }
    function parse(args, { "--": doubleDash = false, alias = {}, boolean = false, default: defaults = {}, stopEarly = false, string = [], unknown = (i) => i, } = {}) {
        const flags = {
            bools: {},
            strings: {},
            unknownFn: unknown,
            allBools: false,
        };
        if (boolean !== undefined) {
            if (typeof boolean === "boolean") {
                flags.allBools = !!boolean;
            }
            else {
                const booleanArgs = typeof boolean === "string" ? [boolean] : boolean;
                for (const key of booleanArgs.filter(Boolean)) {
                    flags.bools[key] = true;
                }
            }
        }
        const aliases = {};
        if (alias !== undefined) {
            for (const key in alias) {
                const val = getForce(alias, key);
                if (typeof val === "string") {
                    aliases[key] = [val];
                }
                else {
                    aliases[key] = val;
                }
                for (const alias of getForce(aliases, key)) {
                    aliases[alias] = [key].concat(aliases[key].filter((y) => alias !== y));
                }
            }
        }
        if (string !== undefined) {
            const stringArgs = typeof string === "string" ? [string] : string;
            for (const key of stringArgs.filter(Boolean)) {
                flags.strings[key] = true;
                const alias = get(aliases, key);
                if (alias) {
                    for (const al of alias) {
                        flags.strings[al] = true;
                    }
                }
            }
        }
        const argv = { _: [] };
        function argDefined(key, arg) {
            return ((flags.allBools && /^--[^=]+$/.test(arg)) ||
                get(flags.bools, key) ||
                !!get(flags.strings, key) ||
                !!get(aliases, key));
        }
        function setKey(obj, keys, value) {
            let o = obj;
            keys.slice(0, -1).forEach(function (key) {
                if (get(o, key) === undefined) {
                    o[key] = {};
                }
                o = get(o, key);
            });
            const key = keys[keys.length - 1];
            if (get(o, key) === undefined ||
                get(flags.bools, key) ||
                typeof get(o, key) === "boolean") {
                o[key] = value;
            }
            else if (Array.isArray(get(o, key))) {
                o[key].push(value);
            }
            else {
                o[key] = [get(o, key), value];
            }
        }
        function setArg(key, val, arg = undefined) {
            if (arg && flags.unknownFn && !argDefined(key, arg)) {
                if (flags.unknownFn(arg, key, val) === false)
                    return;
            }
            const value = !get(flags.strings, key) && isNumber(val) ? Number(val) : val;
            setKey(argv, key.split("."), value);
            const alias = get(aliases, key);
            if (alias) {
                for (const x of alias) {
                    setKey(argv, x.split("."), value);
                }
            }
        }
        function aliasIsBoolean(key) {
            return getForce(aliases, key).some((x) => typeof get(flags.bools, x) === "boolean");
        }
        for (const key of Object.keys(flags.bools)) {
            setArg(key, defaults[key] === undefined ? false : defaults[key]);
        }
        let notFlags = [];
        if (args.includes("--")) {
            notFlags = args.slice(args.indexOf("--") + 1);
            args = args.slice(0, args.indexOf("--"));
        }
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (/^--.+=/.test(arg)) {
                const m = arg.match(/^--([^=]+)=(.*)$/s);
                assert_ts_6.assert(m != null);
                const [, key, value] = m;
                if (flags.bools[key]) {
                    const booleanValue = value !== "false";
                    setArg(key, booleanValue, arg);
                }
                else {
                    setArg(key, value, arg);
                }
            }
            else if (/^--no-.+/.test(arg)) {
                const m = arg.match(/^--no-(.+)/);
                assert_ts_6.assert(m != null);
                setArg(m[1], false, arg);
            }
            else if (/^--.+/.test(arg)) {
                const m = arg.match(/^--(.+)/);
                assert_ts_6.assert(m != null);
                const [, key] = m;
                const next = args[i + 1];
                if (next !== undefined &&
                    !/^-/.test(next) &&
                    !get(flags.bools, key) &&
                    !flags.allBools &&
                    (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                    setArg(key, next, arg);
                    i++;
                }
                else if (/^(true|false)$/.test(next)) {
                    setArg(key, next === "true", arg);
                    i++;
                }
                else {
                    setArg(key, get(flags.strings, key) ? "" : true, arg);
                }
            }
            else if (/^-[^-]+/.test(arg)) {
                const letters = arg.slice(1, -1).split("");
                let broken = false;
                for (let j = 0; j < letters.length; j++) {
                    const next = arg.slice(j + 2);
                    if (next === "-") {
                        setArg(letters[j], next, arg);
                        continue;
                    }
                    if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                        setArg(letters[j], next.split("=")[1], arg);
                        broken = true;
                        break;
                    }
                    if (/[A-Za-z]/.test(letters[j]) &&
                        /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                        setArg(letters[j], next, arg);
                        broken = true;
                        break;
                    }
                    if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                        setArg(letters[j], arg.slice(j + 2), arg);
                        broken = true;
                        break;
                    }
                    else {
                        setArg(letters[j], get(flags.strings, letters[j]) ? "" : true, arg);
                    }
                }
                const [key] = arg.slice(-1);
                if (!broken && key !== "-") {
                    if (args[i + 1] &&
                        !/^(-|--)[^-]/.test(args[i + 1]) &&
                        !get(flags.bools, key) &&
                        (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                        setArg(key, args[i + 1], arg);
                        i++;
                    }
                    else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
                        setArg(key, args[i + 1] === "true", arg);
                        i++;
                    }
                    else {
                        setArg(key, get(flags.strings, key) ? "" : true, arg);
                    }
                }
            }
            else {
                if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                    argv._.push(flags.strings["_"] ?? !isNumber(arg) ? arg : Number(arg));
                }
                if (stopEarly) {
                    argv._.push(...args.slice(i + 1));
                    break;
                }
            }
        }
        for (const key of Object.keys(defaults)) {
            if (!hasKey(argv, key.split("."))) {
                setKey(argv, key.split("."), defaults[key]);
                if (aliases[key]) {
                    for (const x of aliases[key]) {
                        setKey(argv, x.split("."), defaults[key]);
                    }
                }
            }
        }
        if (doubleDash) {
            argv["--"] = [];
            for (const key of notFlags) {
                argv["--"].push(key);
            }
        }
        else {
            for (const key of notFlags) {
                argv._.push(key);
            }
        }
        return argv;
    }
    exports_49("parse", parse);
    return {
        setters: [
            function (assert_ts_6_1) {
                assert_ts_6 = assert_ts_6_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///home/elemti/nux/git/detun/deps/flags", ["https://deno.land/std@0.67.0/flags/mod"], function (exports_50, context_50) {
    "use strict";
    var __moduleName = context_50 && context_50.id;
    return {
        setters: [
            function (mod_ts_8_1) {
                exports_50({
                    "parse": mod_ts_8_1["parse"]
                });
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///home/elemti/nux/git/detun/client/forwardPort", ["file:///home/elemti/nux/git/detun/common/main", "file:///home/elemti/nux/git/detun/common/crypt", "file:///home/elemti/nux/git/detun/deps/ws", "file:///home/elemti/nux/git/detun/common/commKeepAlive", "file:///home/elemti/nux/git/detun/deps/flags"], function (exports_51, context_51) {
    "use strict";
    var main_js_2, crypt_js_1, ws_js_2, commKeepAlive_js_1, flags_js_1, verbose, pipeNewConnection;
    var __moduleName = context_51 && context_51.id;
    return {
        setters: [
            function (main_js_2_1) {
                main_js_2 = main_js_2_1;
            },
            function (crypt_js_1_1) {
                crypt_js_1 = crypt_js_1_1;
            },
            function (ws_js_2_1) {
                ws_js_2 = ws_js_2_1;
            },
            function (commKeepAlive_js_1_1) {
                commKeepAlive_js_1 = commKeepAlive_js_1_1;
            },
            function (flags_js_1_1) {
                flags_js_1 = flags_js_1_1;
            }
        ],
        execute: function () {
            verbose = flags_js_1.parse(Deno.args).verbose;
            pipeNewConnection = ({ localPort, onCleanup, onReady, onPacket }) => {
                let connCleanup = ({ err } = {}) => {
                    if (err)
                        console.error(err);
                    onCleanup?.();
                    main_js_2.tryCatch(async () => {
                        await startingLocalConn.catch(e => e);
                        await localConn.close();
                    });
                };
                let onData = async (bodyArr) => {
                    await Deno.writeAll(localConn, bodyArr).catch(err => connCleanup({ err }));
                };
                let onClose = async () => {
                    await connCleanup();
                };
                let localConn;
                let startingLocalConn = Promise.resolve();
                (async () => {
                    startingLocalConn = main_js_2.tcpConnect({ port: localPort });
                    localConn = await startingLocalConn;
                    await onReady();
                    for await (let packet of main_js_2.localIter(localConn)) {
                        await onPacket(packet);
                    }
                })().catch(main_js_2.skipBadResourceErr).catch(console.error).finally(connCleanup);
                return { onData, onClose };
            };
            exports_51("default", async ({ localPort, publicPort, commPort = 8080, hostname = 'elemti.com' }) => {
                let commSend = async (...args) => {
                    return await commSock.send(crypt_js_1.encode123(...args));
                };
                let commSock = await ws_js_2.connectWebSocket(`ws://${hostname}:${commPort}`);
                console.log('connected to commServer');
                await commSend({ commConnInit: true, publicPort });
                let onCommPayload = async (payload) => {
                    if (payload.commConnInitDone) {
                        console.log(`forwarding localhost:${localPort} -> ${hostname}:${payload.publicPort}`);
                    }
                    if (payload.commConnInitFailed) {
                        console.error(`remote host error: ${payload.errMsg}`);
                        throw Error('COMM_CONN_INIT_FAILED');
                    }
                    if (payload.newConn) {
                        let { connId } = payload;
                        let onCleanup = () => {
                            delete connections[connId];
                            commSend({ connClose: true, connId }).catch(console.error);
                        };
                        let onReady = async () => await commSend({ connReady: true, connId });
                        let onPacket = async (packet) => await commSend({ packet, connData: true, connId });
                        connections[connId] = pipeNewConnection({ connId, localPort, onCleanup, onReady, onPacket });
                    }
                    if (payload.connData) {
                        await connections[payload.connId]?.onData(payload.packet).catch(console.error);
                    }
                    if (payload.connClose) {
                        await connections[payload.connId]?.onClose().catch(console.error);
                    }
                };
                let connections = {};
                let { onSockEv, onSockEnd } = commKeepAlive_js_1.default(commSock);
                try {
                    for await (let ev of commSock) {
                        onSockEv(ev);
                        if (ev instanceof Uint8Array) {
                            let payload = crypt_js_1.decode123(ev);
                            if (verbose)
                                console.log(payload);
                            await onCommPayload(payload);
                        }
                    }
                }
                finally {
                    onSockEnd();
                }
            });
        }
    };
});
System.register("file:///home/elemti/nux/git/detun/common/cli-args", ["file:///home/elemti/nux/git/detun/deps/flags"], function (exports_52, context_52) {
    "use strict";
    var flags_js_2;
    var __moduleName = context_52 && context_52.id;
    return {
        setters: [
            function (flags_js_2_1) {
                flags_js_2 = flags_js_2_1;
            }
        ],
        execute: function () {
            exports_52("default", flags_js_2.parse(Deno.args));
        }
    };
});
System.register("file:///home/elemti/nux/git/detun/client/main", ["file:///home/elemti/nux/git/detun/client/forwardPort", "file:///home/elemti/nux/git/detun/common/cli-args"], function (exports_53, context_53) {
    "use strict";
    var forwardPort_js_1, cli_args_js_1, publicPort, commPort, hostname, localPort, retryLoop, validatePorts;
    var __moduleName = context_53 && context_53.id;
    return {
        setters: [
            function (forwardPort_js_1_1) {
                forwardPort_js_1 = forwardPort_js_1_1;
            },
            function (cli_args_js_1_1) {
                cli_args_js_1 = cli_args_js_1_1;
            }
        ],
        execute: function () {
            publicPort = cli_args_js_1.default.publicPort, commPort = cli_args_js_1.default.commPort, hostname = cli_args_js_1.default.hostname, localPort = cli_args_js_1.default._[0];
            retryLoop = async (func) => {
                let retryInterv = 3 * 1000;
                while (true) {
                    try {
                        await func();
                    }
                    catch (err) {
                        console.error(err);
                    }
                    finally {
                        console.log();
                        console.log(`waiting ${retryInterv}ms to retry...`);
                        console.log();
                        await new Promise(res => setTimeout(res, retryInterv));
                    }
                }
            };
            validatePorts = ({ ...ports }) => {
                Object.entries(ports).forEach(([key, val]) => {
                    if (isNaN(val))
                        throw Error(`invalid ${key}: ${val}`);
                });
            };
            (async () => {
                validatePorts({ localPort });
                await retryLoop(async () => {
                    await forwardPort_js_1.default({ localPort, publicPort, commPort, hostname });
                });
            })();
        }
    };
});

__instantiate("file:///home/elemti/nux/git/detun/client/main", false);
