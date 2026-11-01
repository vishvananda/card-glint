const k = "pixels_bg.wasm";
class g {
  __destroy_into_raw() {
    const t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, m.unregister(this), t;
  }
  free() {
    const t = this.__destroy_into_raw();
    i.__wbg_pixelkernels_free(t, 0);
  }
  /**
   * # Errors
   * Rejects invalid dimensions, thresholds and buffer lengths.
   * @param {number} width
   * @param {number} height
   * @param {Uint8Array} rgba
   * @param {number} threshold
   * @returns {Uint8Array}
   */
  etch(t, r, n, s) {
    try {
      const u = i.__wbindgen_add_to_stack_pointer(-16), O = I(n, i.__wbindgen_export), W = x;
      i.pixelkernels_etch(u, this.__wbg_ptr, t, r, O, W, s);
      var o = b().getInt32(u + 0, !0), c = b().getInt32(u + 4, !0), A = b().getInt32(u + 8, !0), R = b().getInt32(u + 12, !0);
      if (R)
        throw S(A);
      var v = U(o, c).slice();
      return i.__wbindgen_export2(o, c * 1, 1), v;
    } finally {
      i.__wbindgen_add_to_stack_pointer(16);
    }
  }
  constructor() {
    const t = i.pixelkernels_new();
    return this.__wbg_ptr = t, m.register(this, this.__wbg_ptr, this), this;
  }
}
Symbol.dispose && (g.prototype[Symbol.dispose] = g.prototype.free);
function E() {
  return {
    __proto__: null,
    "./pixels_bg.js": {
      __proto__: null,
      __wbg___wbindgen_throw_bb96b2010945f0bc: function(t, r) {
        throw new Error(h(t, r));
      },
      __wbindgen_cast_0000000000000001: function(t, r) {
        const n = h(t, r);
        return M(n);
      }
    }
  };
}
const m = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e) => i.__wbg_pixelkernels_free(e, 1));
function M(e) {
  _ === a.length && a.push(a.length + 1);
  const t = _;
  return _ = a[t], a[t] = e, t;
}
function T(e) {
  e < 1028 || (a[e] = _, _ = e);
}
function U(e, t) {
  return e = e >>> 0, d().subarray(e / 1, e / 1 + t);
}
let f = null;
function b() {
  return (f === null || f.buffer.detached === !0 || f.buffer.detached === void 0 && f.buffer !== i.memory.buffer) && (f = new DataView(i.memory.buffer)), f;
}
function h(e, t) {
  return z(e >>> 0, t);
}
let l = null;
function d() {
  return (l === null || l.byteLength === 0) && (l = new Uint8Array(i.memory.buffer)), l;
}
function D(e) {
  return a[e];
}
let a = new Array(1024).fill(void 0);
a.push(void 0, null, !0, !1);
let _ = a.length;
function I(e, t) {
  const r = t(e.length * 1, 1) >>> 0;
  return d().set(e, r / 1), x = e.length, r;
}
function S(e) {
  const t = D(e);
  return T(e), t;
}
let w = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 });
w.decode();
const j = 2146435072;
let y = 0;
function z(e, t) {
  return y += t, y >= j && (w = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 }), w.decode(), y = t), w.decode(d().subarray(e, e + t));
}
let x = 0, i;
function F(e, t) {
  return i = e.exports, f = null, l = null, i;
}
async function L(e, t) {
  if (typeof Response == "function" && e instanceof Response) {
    if (!e.ok)
      throw new Error(`failed to fetch Wasm: ${e.status} ${e.statusText} fetching '${e.url}'`);
    if (typeof WebAssembly.instantiateStreaming == "function")
      try {
        return await WebAssembly.instantiateStreaming(e, t);
      } catch (s) {
        if (r(e.type) && e.headers.get("Content-Type") !== "application/wasm")
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", s);
        else
          throw s;
      }
    const n = await e.arrayBuffer();
    return await WebAssembly.instantiate(n, t);
  } else {
    const n = await WebAssembly.instantiate(e, t);
    return n instanceof WebAssembly.Instance ? { instance: n, module: e } : n;
  }
  function r(n) {
    switch (n) {
      case "basic":
      case "cors":
      case "default":
        return !0;
    }
    return !1;
  }
}
async function P(e) {
  if (i !== void 0) return i;
  e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? { module_or_path: e } = e : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), e === void 0 && (e = new URL(
    /* @vite-ignore */
    k,
    import.meta.url
  ));
  const t = E();
  (typeof e == "string" || typeof Request == "function" && e instanceof Request || typeof URL == "function" && e instanceof URL) && (e = fetch(e));
  const { instance: r, module: n } = await L(await e, t);
  return F(r);
}
let p;
async function B(e = {}) {
  p ??= P(e.wasmUrl ? { module_or_path: e.wasmUrl } : void 0).catch(
    (t) => {
      throw p = void 0, t;
    }
  ), await p;
}
async function K(e = {}) {
  await B(e);
  const t = new g();
  let r = !1;
  return {
    etch(n, s, o, c = 20) {
      if (r) throw Error("Pixel kernels disposed");
      if (![n, s, c].every(Number.isInteger) || n < 1 || s < 1 || c < 0 || c > 255 || n * s > 4194304 || o.byteLength !== n * s * 4)
        throw RangeError("Invalid edge dimensions or threshold");
      return t.etch(
        n,
        s,
        new Uint8Array(o.buffer, o.byteOffset, o.byteLength),
        c
      );
    },
    dispose() {
      r || (r = !0, t.free());
    }
  };
}
export {
  K as createPixelKernels,
  B as initializeKernels
};
