const q = "renderer_bg.wasm";
class C {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, D.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    r.__wbg_pixelkernels_free(e, 0);
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
  etch(e, n, i, o) {
    try {
      const d = r.__wbindgen_add_to_stack_pointer(-16), g = tt(i, r.__wbindgen_export), p = l;
      r.pixelkernels_etch(d, this.__wbg_ptr, e, n, g, p, o);
      var _ = c().getInt32(d + 0, !0), s = c().getInt32(d + 4, !0), a = c().getInt32(d + 8, !0), u = c().getInt32(d + 12, !0);
      if (u)
        throw h(a);
      var f = H(_, s).slice();
      return r.__wbindgen_export2(_, s * 1, 1), f;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  constructor() {
    const e = r.pixelkernels_new();
    return this.__wbg_ptr = e, D.register(this, this.__wbg_ptr, this), this;
  }
}
Symbol.dispose && (C.prototype[Symbol.dispose] = C.prototype.free);
class O {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, L.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    r.__wbg_resourcecache_free(e, 0);
  }
  /**
   * # Errors
   * Refuses admission beyond the budget or exhausted handles.
   * @param {string} key
   * @param {number} bytes
   * @param {number} priority
   * @returns {string}
   */
  admit(e, n, i) {
    let o, _;
    try {
      const p = r.__wbindgen_add_to_stack_pointer(-16), b = T(e, r.__wbindgen_export, r.__wbindgen_export3), V = l;
      r.resourcecache_admit(p, this.__wbg_ptr, b, V, n, i);
      var s = c().getInt32(p + 0, !0), a = c().getInt32(p + 4, !0), u = c().getInt32(p + 8, !0), f = c().getInt32(p + 12, !0), d = s, g = a;
      if (f)
        throw d = 0, g = 0, h(u);
      return o = d, _ = g, E(d, g);
    } finally {
      r.__wbindgen_add_to_stack_pointer(16), r.__wbindgen_export2(o, _, 1);
    }
  }
  /**
   * @returns {Uint32Array}
   */
  clear() {
    try {
      const o = r.__wbindgen_add_to_stack_pointer(-16);
      r.resourcecache_clear(o, this.__wbg_ptr);
      var e = c().getInt32(o + 0, !0), n = c().getInt32(o + 4, !0), i = W(e, n).slice();
      return r.__wbindgen_export2(e, n * 4, 4), i;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} key
   * @returns {number | undefined}
   */
  lookup(e) {
    const n = T(e, r.__wbindgen_export, r.__wbindgen_export3), i = l, o = r.resourcecache_lookup(this.__wbg_ptr, n, i);
    return o === Number.MAX_SAFE_INTEGER ? void 0 : o;
  }
  /**
   * @param {number} bytes
   */
  constructor(e) {
    const n = r.resourcecache_new(e);
    return this.__wbg_ptr = n, L.register(this, this.__wbg_ptr, this), this;
  }
  /**
   * # Errors
   * Refuses invalid handles and unbalanced leases.
   * @param {number} id
   * @param {boolean} acquire
   */
  pin(e, n) {
    try {
      const _ = r.__wbindgen_add_to_stack_pointer(-16);
      r.resourcecache_pin(_, this.__wbg_ptr, e, n);
      var i = c().getInt32(_ + 0, !0), o = c().getInt32(_ + 4, !0);
      if (o)
        throw h(i);
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} id
   * @returns {boolean}
   */
  remove(e) {
    return r.resourcecache_remove(this.__wbg_ptr, e) !== 0;
  }
  /**
   * # Errors
   * Reports serialization failures.
   * @returns {string}
   */
  stats() {
    let e, n;
    try {
      const f = r.__wbindgen_add_to_stack_pointer(-16);
      r.resourcecache_stats(f, this.__wbg_ptr);
      var i = c().getInt32(f + 0, !0), o = c().getInt32(f + 4, !0), _ = c().getInt32(f + 8, !0), s = c().getInt32(f + 12, !0), a = i, u = o;
      if (s)
        throw a = 0, u = 0, h(_);
      return e = a, n = u, E(a, u);
    } finally {
      r.__wbindgen_add_to_stack_pointer(16), r.__wbindgen_export2(e, n, 1);
    }
  }
}
Symbol.dispose && (O.prototype[Symbol.dispose] = O.prototype.free);
class U {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, j.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    r.__wbg_scenecore_free(e, 0);
  }
  /**
   * @param {number} x
   * @param {number} y
   * @returns {Float64Array}
   */
  hit(e, n) {
    try {
      const s = r.__wbindgen_add_to_stack_pointer(-16);
      r.scenecore_hit(s, this.__wbg_ptr, e, n);
      var i = c().getInt32(s + 0, !0), o = c().getInt32(s + 4, !0), _ = G(i, o).slice();
      return r.__wbindgen_export2(i, o * 8, 8), _;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  constructor() {
    const e = r.scenecore_new();
    return this.__wbg_ptr = e, j.register(this, this.__wbg_ptr, this), this;
  }
  /**
   * # Errors
   * Refuses malformed or non-finite camera data.
   * @param {Float32Array} camera
   * @returns {Uint32Array}
   */
  plan(e) {
    try {
      const a = r.__wbindgen_add_to_stack_pointer(-16), u = z(e, r.__wbindgen_export), f = l;
      r.scenecore_plan(a, this.__wbg_ptr, u, f);
      var n = c().getInt32(a + 0, !0), i = c().getInt32(a + 4, !0), o = c().getInt32(a + 8, !0), _ = c().getInt32(a + 12, !0);
      if (_)
        throw h(o);
      var s = W(n, i).slice();
      return r.__wbindgen_export2(n, i * 4, 4), s;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * # Errors
   * Refuses malformed, non-finite or duplicate scene data.
   * @param {Uint32Array} ids
   * @param {Float32Array} matrices
   * @param {Int32Array} orders
   */
  update(e, n, i) {
    try {
      const s = r.__wbindgen_add_to_stack_pointer(-16), a = N(e, r.__wbindgen_export), u = l, f = z(n, r.__wbindgen_export), d = l, g = N(i, r.__wbindgen_export), p = l;
      r.scenecore_update(s, this.__wbg_ptr, a, u, f, d, g, p);
      var o = c().getInt32(s + 0, !0), _ = c().getInt32(s + 4, !0);
      if (_)
        throw h(o);
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
Symbol.dispose && (U.prototype[Symbol.dispose] = U.prototype.free);
function K(t) {
  try {
    const s = r.__wbindgen_add_to_stack_pointer(-16), a = T(t, r.__wbindgen_export, r.__wbindgen_export3), u = l;
    r.validate_layers(s, a, u);
    var e = c().getInt32(s + 0, !0), n = c().getInt32(s + 4, !0), i = c().getInt32(s + 8, !0), o = c().getInt32(s + 12, !0);
    if (o)
      throw h(i);
    var _ = W(e, n).slice();
    return r.__wbindgen_export2(e, n * 4, 4), _;
  } finally {
    r.__wbindgen_add_to_stack_pointer(16);
  }
}
function $() {
  return {
    __proto__: null,
    "./renderer_bg.js": {
      __proto__: null,
      __wbg___wbindgen_throw_bb96b2010945f0bc: function(e, n) {
        throw new Error(E(e, n));
      },
      __wbindgen_cast_0000000000000001: function(e, n) {
        const i = E(e, n);
        return J(i);
      }
    }
  };
}
const D = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => r.__wbg_pixelkernels_free(t, 1)), L = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => r.__wbg_resourcecache_free(t, 1)), j = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => r.__wbg_scenecore_free(t, 1));
function J(t) {
  R === w.length && w.push(w.length + 1);
  const e = R;
  return R = w[e], w[e] = t, e;
}
function X(t) {
  t < 1028 || (w[t] = R, R = t);
}
function G(t, e) {
  return t = t >>> 0, Q().subarray(t / 8, t / 8 + e);
}
function W(t, e) {
  return t = t >>> 0, P().subarray(t / 4, t / 4 + e);
}
function H(t, e) {
  return t = t >>> 0, m().subarray(t / 1, t / 1 + e);
}
let y = null;
function c() {
  return (y === null || y.buffer.detached === !0 || y.buffer.detached === void 0 && y.buffer !== r.memory.buffer) && (y = new DataView(r.memory.buffer)), y;
}
let x = null;
function Y() {
  return (x === null || x.byteLength === 0) && (x = new Float32Array(r.memory.buffer)), x;
}
let I = null;
function Q() {
  return (I === null || I.byteLength === 0) && (I = new Float64Array(r.memory.buffer)), I;
}
function E(t, e) {
  return nt(t >>> 0, e);
}
let A = null;
function P() {
  return (A === null || A.byteLength === 0) && (A = new Uint32Array(r.memory.buffer)), A;
}
let k = null;
function m() {
  return (k === null || k.byteLength === 0) && (k = new Uint8Array(r.memory.buffer)), k;
}
function Z(t) {
  return w[t];
}
let w = new Array(1024).fill(void 0);
w.push(void 0, null, !0, !1);
let R = w.length;
function N(t, e) {
  const n = e(t.length * 4, 4) >>> 0;
  return P().set(t, n / 4), l = t.length, n;
}
function tt(t, e) {
  const n = e(t.length * 1, 1) >>> 0;
  return m().set(t, n / 1), l = t.length, n;
}
function z(t, e) {
  const n = e(t.length * 4, 4) >>> 0;
  return Y().set(t, n / 4), l = t.length, n;
}
function T(t, e, n) {
  if (n === void 0) {
    const a = F.encode(t), u = e(a.length, 1) >>> 0;
    return m().subarray(u, u + a.length).set(a), l = a.length, u;
  }
  let i = t.length, o = e(i, 1) >>> 0;
  const _ = m();
  let s = 0;
  for (; s < i; s++) {
    const a = t.charCodeAt(s);
    if (a > 127) break;
    _[o + s] = a;
  }
  if (s !== i) {
    s !== 0 && (t = t.slice(s)), o = n(o, i, i = s + t.length * 3, 1) >>> 0;
    const a = m().subarray(o + s, o + i), u = F.encodeInto(t, a);
    s += u.written, o = n(o, i, s, 1) >>> 0;
  }
  return l = s, o;
}
function h(t) {
  const e = Z(t);
  return X(t), e;
}
let S = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 });
S.decode();
const et = 2146435072;
let M = 0;
function nt(t, e) {
  return M += e, M >= et && (S = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 }), S.decode(), M = e), S.decode(m().subarray(t, t + e));
}
const F = new TextEncoder();
"encodeInto" in F || (F.encodeInto = function(t, e) {
  const n = F.encode(t);
  return e.set(n), {
    read: t.length,
    written: n.length
  };
});
let l = 0, r;
function rt(t, e) {
  return r = t.exports, y = null, x = null, I = null, A = null, k = null, r;
}
async function it(t, e) {
  if (typeof Response == "function" && t instanceof Response) {
    if (!t.ok)
      throw new Error(`failed to fetch Wasm: ${t.status} ${t.statusText} fetching '${t.url}'`);
    if (typeof WebAssembly.instantiateStreaming == "function")
      try {
        return await WebAssembly.instantiateStreaming(t, e);
      } catch (o) {
        if (n(t.type) && t.headers.get("Content-Type") !== "application/wasm")
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", o);
        else
          throw o;
      }
    const i = await t.arrayBuffer();
    return await WebAssembly.instantiate(i, e);
  } else {
    const i = await WebAssembly.instantiate(t, e);
    return i instanceof WebAssembly.Instance ? { instance: i, module: t } : i;
  }
  function n(i) {
    switch (i) {
      case "basic":
      case "cors":
      case "default":
        return !0;
    }
    return !1;
  }
}
async function at(t) {
  if (r !== void 0) return r;
  t !== void 0 && (Object.getPrototypeOf(t) === Object.prototype ? { module_or_path: t } = t : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), t === void 0 && (t = new URL(
    /* @vite-ignore */
    q,
    import.meta.url
  ));
  const e = $();
  (typeof t == "string" || typeof Request == "function" && t instanceof Request || typeof URL == "function" && t instanceof URL) && (t = fetch(t));
  const { instance: n, module: i } = await it(await t, e);
  return rt(n);
}
function B(t) {
  const [e, n] = t;
  if (!Number.isInteger(e) || !Number.isInteger(n) || e < 1 || n < 1 || e * n > 4194304)
    throw RangeError("Invalid raster size");
  const i = document.createElement("canvas");
  return i.width = e, i.height = n, i;
}
function v(t) {
  t.width = t.height = 0;
}
async function ot(t, e, n, i) {
  n.throwIfAborted();
  const o = await t.paint(e, n, i);
  if (o.width !== t.size[0] || o.height !== t.size[1] || n.aborted)
    throw v(o), n.throwIfAborted(), Error("Raster dimensions differ from recipe");
  return o;
}
function _t(t) {
  const e = t.layers ?? [], n = K(
    JSON.stringify(
      e.map((i) => ({
        id: i.id,
        stage: i.stage,
        order: i.order,
        contributesToEtch: i.contributesToEtch ?? !1
      }))
    )
  );
  return Array.from(n, (i) => e[i]);
}
function ct(t) {
  return JSON.stringify(t.map((e) => [e.id, e.stage, e.order, e.raster.key, e.clip]));
}
async function st(t, e, n, i, o = B(t)) {
  const _ = o.getContext("2d");
  try {
    for (const s of e) {
      const a = await ot(s.raster, n, i);
      try {
        if (_.save(), s.clip) {
          _.beginPath();
          const [u, f, d, g] = s.clip;
          _.rect(u * t[0], f * t[1], d * t[0], g * t[1]), _.clip();
        }
        _.drawImage(a, 0, 0, ...t), _.restore();
      } finally {
        v(a);
      }
    }
    return o;
  } catch (s) {
    throw v(o), s;
  }
}
async function ut(t, e, n, i) {
  const o = B(t), _ = o.getContext("2d", { willReadFrequently: !0 }), s = _.createImageData(...t);
  try {
    for (const a of e) {
      const u = [
        a.finishCoverage?.add,
        a.finishCoverage?.exclude,
        a.etchCoverage?.add,
        a.etchCoverage?.exclude
      ];
      for (let f = 0; f < 4; f++) {
        const d = u[f];
        if (!d) continue;
        const g = await st(t, [{ ...a, raster: d }], n, i);
        try {
          const p = g.getContext("2d").getImageData(0, 0, ...t).data;
          for (let b = 0; b < p.length; b += 4)
            s.data[b + f] = Math.max(s.data[b + f], p[b + 3]);
        } finally {
          v(g);
        }
      }
    }
    return v(o), new Uint8Array(s.data.buffer);
  } catch (a) {
    throw v(o), a;
  }
}
export {
  C as P,
  O as R,
  U as S,
  at as _,
  ct as a,
  ot as b,
  B as c,
  v as d,
  ut as e,
  _t as l,
  st as p
};
