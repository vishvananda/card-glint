const V = "renderer_bg.wasm";
class O {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, D.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    n.__wbg_pixelkernels_free(e, 0);
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
  etch(e, r, i, _) {
    try {
      const l = n.__wbindgen_add_to_stack_pointer(-16), p = J(i, n.__wbindgen_export), f = g;
      n.pixelkernels_etch(l, this.__wbg_ptr, e, r, p, f, _);
      var c = o().getInt32(l + 0, !0), s = o().getInt32(l + 4, !0), a = o().getInt32(l + 8, !0), u = o().getInt32(l + 12, !0);
      if (u)
        throw w(a);
      var d = X(c, s).slice();
      return n.__wbindgen_export2(c, s * 1, 1), d;
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
  constructor() {
    const e = n.pixelkernels_new();
    return this.__wbg_ptr = e, D.register(this, this.__wbg_ptr, this), this;
  }
}
Symbol.dispose && (O.prototype[Symbol.dispose] = O.prototype.free);
class z {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, j.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    n.__wbg_resourcecache_free(e, 0);
  }
  /**
   * # Errors
   * Refuses admission beyond the budget or exhausted handles.
   * @param {string} key
   * @param {number} bytes
   * @param {number} priority
   * @returns {string}
   */
  admit(e, r, i) {
    let _, c;
    try {
      const f = n.__wbindgen_add_to_stack_pointer(-16), M = E(e, n.__wbindgen_export, n.__wbindgen_export3), P = g;
      n.resourcecache_admit(f, this.__wbg_ptr, M, P, r, i);
      var s = o().getInt32(f + 0, !0), a = o().getInt32(f + 4, !0), u = o().getInt32(f + 8, !0), d = o().getInt32(f + 12, !0), l = s, p = a;
      if (d)
        throw l = 0, p = 0, w(u);
      return _ = l, c = p, W(l, p);
    } finally {
      n.__wbindgen_add_to_stack_pointer(16), n.__wbindgen_export2(_, c, 1);
    }
  }
  /**
   * @returns {Uint32Array}
   */
  clear() {
    try {
      const _ = n.__wbindgen_add_to_stack_pointer(-16);
      n.resourcecache_clear(_, this.__wbg_ptr);
      var e = o().getInt32(_ + 0, !0), r = o().getInt32(_ + 4, !0), i = S(e, r).slice();
      return n.__wbindgen_export2(e, r * 4, 4), i;
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} key
   * @returns {number | undefined}
   */
  lookup(e) {
    const r = E(e, n.__wbindgen_export, n.__wbindgen_export3), i = g, _ = n.resourcecache_lookup(this.__wbg_ptr, r, i);
    return _ === Number.MAX_SAFE_INTEGER ? void 0 : _;
  }
  /**
   * @param {number} bytes
   */
  constructor(e) {
    const r = n.resourcecache_new(e);
    return this.__wbg_ptr = r, j.register(this, this.__wbg_ptr, this), this;
  }
  /**
   * # Errors
   * Refuses invalid handles and unbalanced leases.
   * @param {number} id
   * @param {boolean} acquire
   */
  pin(e, r) {
    try {
      const c = n.__wbindgen_add_to_stack_pointer(-16);
      n.resourcecache_pin(c, this.__wbg_ptr, e, r);
      var i = o().getInt32(c + 0, !0), _ = o().getInt32(c + 4, !0);
      if (_)
        throw w(i);
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} id
   * @returns {boolean}
   */
  remove(e) {
    return n.resourcecache_remove(this.__wbg_ptr, e) !== 0;
  }
  /**
   * # Errors
   * Reports serialization failures.
   * @returns {string}
   */
  stats() {
    let e, r;
    try {
      const d = n.__wbindgen_add_to_stack_pointer(-16);
      n.resourcecache_stats(d, this.__wbg_ptr);
      var i = o().getInt32(d + 0, !0), _ = o().getInt32(d + 4, !0), c = o().getInt32(d + 8, !0), s = o().getInt32(d + 12, !0), a = i, u = _;
      if (s)
        throw a = 0, u = 0, w(c);
      return e = a, r = u, W(a, u);
    } finally {
      n.__wbindgen_add_to_stack_pointer(16), n.__wbindgen_export2(e, r, 1);
    }
  }
}
Symbol.dispose && (z.prototype[Symbol.dispose] = z.prototype.free);
class U {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, C.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    n.__wbg_scenecore_free(e, 0);
  }
  /**
   * @param {number} x
   * @param {number} y
   * @returns {Float64Array}
   */
  hit(e, r) {
    try {
      const s = n.__wbindgen_add_to_stack_pointer(-16);
      n.scenecore_hit(s, this.__wbg_ptr, e, r);
      var i = o().getInt32(s + 0, !0), _ = o().getInt32(s + 4, !0), c = K(i, _).slice();
      return n.__wbindgen_export2(i, _ * 8, 8), c;
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
  constructor() {
    const e = n.scenecore_new();
    return this.__wbg_ptr = e, C.register(this, this.__wbg_ptr, this), this;
  }
  /**
   * # Errors
   * Refuses malformed or non-finite camera data.
   * @param {Float32Array} camera
   * @returns {Uint32Array}
   */
  plan(e) {
    try {
      const a = n.__wbindgen_add_to_stack_pointer(-16), u = F(e, n.__wbindgen_export), d = g;
      n.scenecore_plan(a, this.__wbg_ptr, u, d);
      var r = o().getInt32(a + 0, !0), i = o().getInt32(a + 4, !0), _ = o().getInt32(a + 8, !0), c = o().getInt32(a + 12, !0);
      if (c)
        throw w(_);
      var s = S(r, i).slice();
      return n.__wbindgen_export2(r, i * 4, 4), s;
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * # Errors
   * Refuses malformed cameras, shape parameters or animation times.
   * @param {Float32Array} camera
   * @param {Float32Array} shapes
   * @param {number} time
   * @returns {Uint32Array}
   */
  plan_shaped(e, r, i) {
    try {
      const d = n.__wbindgen_add_to_stack_pointer(-16), l = F(e, n.__wbindgen_export), p = g, f = F(r, n.__wbindgen_export), M = g;
      n.scenecore_plan_shaped(d, this.__wbg_ptr, l, p, f, M, i);
      var _ = o().getInt32(d + 0, !0), c = o().getInt32(d + 4, !0), s = o().getInt32(d + 8, !0), a = o().getInt32(d + 12, !0);
      if (a)
        throw w(s);
      var u = S(_, c).slice();
      return n.__wbindgen_export2(_, c * 4, 4), u;
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * # Errors
   * Refuses malformed, non-finite or duplicate scene data.
   * @param {Uint32Array} ids
   * @param {Float32Array} matrices
   * @param {Int32Array} orders
   */
  update(e, r, i) {
    try {
      const s = n.__wbindgen_add_to_stack_pointer(-16), a = L(e, n.__wbindgen_export), u = g, d = F(r, n.__wbindgen_export), l = g, p = L(i, n.__wbindgen_export), f = g;
      n.scenecore_update(s, this.__wbg_ptr, a, u, d, l, p, f);
      var _ = o().getInt32(s + 0, !0), c = o().getInt32(s + 4, !0);
      if (c)
        throw w(_);
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
Symbol.dispose && (U.prototype[Symbol.dispose] = U.prototype.free);
function nt(t) {
  try {
    const s = n.__wbindgen_add_to_stack_pointer(-16), a = E(t, n.__wbindgen_export, n.__wbindgen_export3), u = g;
    n.validate_layers(s, a, u);
    var e = o().getInt32(s + 0, !0), r = o().getInt32(s + 4, !0), i = o().getInt32(s + 8, !0), _ = o().getInt32(s + 12, !0);
    if (_)
      throw w(i);
    var c = S(e, r).slice();
    return n.__wbindgen_export2(e, r * 4, 4), c;
  } finally {
    n.__wbindgen_add_to_stack_pointer(16);
  }
}
function N() {
  return {
    __proto__: null,
    "./renderer_bg.js": {
      __proto__: null,
      __wbg___wbindgen_throw_bb96b2010945f0bc: function(e, r) {
        throw new Error(W(e, r));
      },
      __wbindgen_cast_0000000000000001: function(e, r) {
        const i = W(e, r);
        return $(i);
      }
    }
  };
}
const D = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => n.__wbg_pixelkernels_free(t, 1)), j = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => n.__wbg_resourcecache_free(t, 1)), C = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => n.__wbg_scenecore_free(t, 1));
function $(t) {
  A === b.length && b.push(b.length + 1);
  const e = A;
  return A = b[e], b[e] = t, e;
}
function q(t) {
  t < 1028 || (b[t] = A, A = t);
}
function K(t, e) {
  return t = t >>> 0, H().subarray(t / 8, t / 8 + e);
}
function S(t, e) {
  return t = t >>> 0, B().subarray(t / 4, t / 4 + e);
}
function X(t, e) {
  return t = t >>> 0, h().subarray(t / 1, t / 1 + e);
}
let y = null;
function o() {
  return (y === null || y.buffer.detached === !0 || y.buffer.detached === void 0 && y.buffer !== n.memory.buffer) && (y = new DataView(n.memory.buffer)), y;
}
let v = null;
function G() {
  return (v === null || v.byteLength === 0) && (v = new Float32Array(n.memory.buffer)), v;
}
let m = null;
function H() {
  return (m === null || m.byteLength === 0) && (m = new Float64Array(n.memory.buffer)), m;
}
function W(t, e) {
  return Z(t >>> 0, e);
}
let I = null;
function B() {
  return (I === null || I.byteLength === 0) && (I = new Uint32Array(n.memory.buffer)), I;
}
let x = null;
function h() {
  return (x === null || x.byteLength === 0) && (x = new Uint8Array(n.memory.buffer)), x;
}
function Y(t) {
  return b[t];
}
let b = new Array(1024).fill(void 0);
b.push(void 0, null, !0, !1);
let A = b.length;
function L(t, e) {
  const r = e(t.length * 4, 4) >>> 0;
  return B().set(t, r / 4), g = t.length, r;
}
function J(t, e) {
  const r = e(t.length * 1, 1) >>> 0;
  return h().set(t, r / 1), g = t.length, r;
}
function F(t, e) {
  const r = e(t.length * 4, 4) >>> 0;
  return G().set(t, r / 4), g = t.length, r;
}
function E(t, e, r) {
  if (r === void 0) {
    const a = k.encode(t), u = e(a.length, 1) >>> 0;
    return h().subarray(u, u + a.length).set(a), g = a.length, u;
  }
  let i = t.length, _ = e(i, 1) >>> 0;
  const c = h();
  let s = 0;
  for (; s < i; s++) {
    const a = t.charCodeAt(s);
    if (a > 127) break;
    c[_ + s] = a;
  }
  if (s !== i) {
    s !== 0 && (t = t.slice(s)), _ = r(_, i, i = s + t.length * 3, 1) >>> 0;
    const a = h().subarray(_ + s, _ + i), u = k.encodeInto(t, a);
    s += u.written, _ = r(_, i, s, 1) >>> 0;
  }
  return g = s, _;
}
function w(t) {
  const e = Y(t);
  return q(t), e;
}
let R = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 });
R.decode();
const Q = 2146435072;
let T = 0;
function Z(t, e) {
  return T += e, T >= Q && (R = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 }), R.decode(), T = e), R.decode(h().subarray(t, t + e));
}
const k = new TextEncoder();
"encodeInto" in k || (k.encodeInto = function(t, e) {
  const r = k.encode(t);
  return e.set(r), {
    read: t.length,
    written: r.length
  };
});
let g = 0, n;
function tt(t, e) {
  return n = t.exports, y = null, v = null, m = null, I = null, x = null, n;
}
async function et(t, e) {
  if (typeof Response == "function" && t instanceof Response) {
    if (!t.ok)
      throw new Error(`failed to fetch Wasm: ${t.status} ${t.statusText} fetching '${t.url}'`);
    if (typeof WebAssembly.instantiateStreaming == "function")
      try {
        return await WebAssembly.instantiateStreaming(t, e);
      } catch (_) {
        if (r(t.type) && t.headers.get("Content-Type") !== "application/wasm")
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", _);
        else
          throw _;
      }
    const i = await t.arrayBuffer();
    return await WebAssembly.instantiate(i, e);
  } else {
    const i = await WebAssembly.instantiate(t, e);
    return i instanceof WebAssembly.Instance ? { instance: i, module: t } : i;
  }
  function r(i) {
    switch (i) {
      case "basic":
      case "cors":
      case "default":
        return !0;
    }
    return !1;
  }
}
async function rt(t) {
  if (n !== void 0) return n;
  t !== void 0 && (Object.getPrototypeOf(t) === Object.prototype ? { module_or_path: t } = t : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), t === void 0 && (t = new URL(
    /* @vite-ignore */
    V,
    import.meta.url
  ));
  const e = N();
  (typeof t == "string" || typeof Request == "function" && t instanceof Request || typeof URL == "function" && t instanceof URL) && (t = fetch(t));
  const { instance: r, module: i } = await et(await t, e);
  return tt(r);
}
export {
  O as P,
  z as R,
  U as S,
  rt as _,
  nt as v
};
