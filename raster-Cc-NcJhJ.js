const q = "renderer_bg.wasm";
class O {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, L.unregister(this), e;
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
  etch(e, r, i, o) {
    try {
      const f = n.__wbindgen_add_to_stack_pointer(-16), g = tt(i, n.__wbindgen_export), p = l;
      n.pixelkernels_etch(f, this.__wbg_ptr, e, r, g, p, o);
      var _ = c().getInt32(f + 0, !0), s = c().getInt32(f + 4, !0), a = c().getInt32(f + 8, !0), d = c().getInt32(f + 12, !0);
      if (d)
        throw y(a);
      var u = H(_, s).slice();
      return n.__wbindgen_export2(_, s * 1, 1), u;
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
  constructor() {
    const e = n.pixelkernels_new();
    return this.__wbg_ptr = e, L.register(this, this.__wbg_ptr, this), this;
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
    let o, _;
    try {
      const p = n.__wbindgen_add_to_stack_pointer(-16), w = C(e, n.__wbindgen_export, n.__wbindgen_export3), V = l;
      n.resourcecache_admit(p, this.__wbg_ptr, w, V, r, i);
      var s = c().getInt32(p + 0, !0), a = c().getInt32(p + 4, !0), d = c().getInt32(p + 8, !0), u = c().getInt32(p + 12, !0), f = s, g = a;
      if (u)
        throw f = 0, g = 0, y(d);
      return o = f, _ = g, T(f, g);
    } finally {
      n.__wbindgen_add_to_stack_pointer(16), n.__wbindgen_export2(o, _, 1);
    }
  }
  /**
   * @returns {Uint32Array}
   */
  clear() {
    try {
      const o = n.__wbindgen_add_to_stack_pointer(-16);
      n.resourcecache_clear(o, this.__wbg_ptr);
      var e = c().getInt32(o + 0, !0), r = c().getInt32(o + 4, !0), i = M(e, r).slice();
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
    const r = C(e, n.__wbindgen_export, n.__wbindgen_export3), i = l, o = n.resourcecache_lookup(this.__wbg_ptr, r, i);
    return o === Number.MAX_SAFE_INTEGER ? void 0 : o;
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
      const _ = n.__wbindgen_add_to_stack_pointer(-16);
      n.resourcecache_pin(_, this.__wbg_ptr, e, r);
      var i = c().getInt32(_ + 0, !0), o = c().getInt32(_ + 4, !0);
      if (o)
        throw y(i);
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
      const u = n.__wbindgen_add_to_stack_pointer(-16);
      n.resourcecache_stats(u, this.__wbg_ptr);
      var i = c().getInt32(u + 0, !0), o = c().getInt32(u + 4, !0), _ = c().getInt32(u + 8, !0), s = c().getInt32(u + 12, !0), a = i, d = o;
      if (s)
        throw a = 0, d = 0, y(_);
      return e = a, r = d, T(a, d);
    } finally {
      n.__wbindgen_add_to_stack_pointer(16), n.__wbindgen_export2(e, r, 1);
    }
  }
}
Symbol.dispose && (U.prototype[Symbol.dispose] = U.prototype.free);
class D {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, N.unregister(this), e;
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
      var i = c().getInt32(s + 0, !0), o = c().getInt32(s + 4, !0), _ = G(i, o).slice();
      return n.__wbindgen_export2(i, o * 8, 8), _;
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
  constructor() {
    const e = n.scenecore_new();
    return this.__wbg_ptr = e, N.register(this, this.__wbg_ptr, this), this;
  }
  /**
   * # Errors
   * Refuses malformed or non-finite camera data.
   * @param {Float32Array} camera
   * @returns {Uint32Array}
   */
  plan(e) {
    try {
      const a = n.__wbindgen_add_to_stack_pointer(-16), d = S(e, n.__wbindgen_export), u = l;
      n.scenecore_plan(a, this.__wbg_ptr, d, u);
      var r = c().getInt32(a + 0, !0), i = c().getInt32(a + 4, !0), o = c().getInt32(a + 8, !0), _ = c().getInt32(a + 12, !0);
      if (_)
        throw y(o);
      var s = M(r, i).slice();
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
      const u = n.__wbindgen_add_to_stack_pointer(-16), f = S(e, n.__wbindgen_export), g = l, p = S(r, n.__wbindgen_export), w = l;
      n.scenecore_plan_shaped(u, this.__wbg_ptr, f, g, p, w, i);
      var o = c().getInt32(u + 0, !0), _ = c().getInt32(u + 4, !0), s = c().getInt32(u + 8, !0), a = c().getInt32(u + 12, !0);
      if (a)
        throw y(s);
      var d = M(o, _).slice();
      return n.__wbindgen_export2(o, _ * 4, 4), d;
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
      const s = n.__wbindgen_add_to_stack_pointer(-16), a = z(e, n.__wbindgen_export), d = l, u = S(r, n.__wbindgen_export), f = l, g = z(i, n.__wbindgen_export), p = l;
      n.scenecore_update(s, this.__wbg_ptr, a, d, u, f, g, p);
      var o = c().getInt32(s + 0, !0), _ = c().getInt32(s + 4, !0);
      if (_)
        throw y(o);
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
Symbol.dispose && (D.prototype[Symbol.dispose] = D.prototype.free);
function K(t) {
  try {
    const s = n.__wbindgen_add_to_stack_pointer(-16), a = C(t, n.__wbindgen_export, n.__wbindgen_export3), d = l;
    n.validate_layers(s, a, d);
    var e = c().getInt32(s + 0, !0), r = c().getInt32(s + 4, !0), i = c().getInt32(s + 8, !0), o = c().getInt32(s + 12, !0);
    if (o)
      throw y(i);
    var _ = M(e, r).slice();
    return n.__wbindgen_export2(e, r * 4, 4), _;
  } finally {
    n.__wbindgen_add_to_stack_pointer(16);
  }
}
function $() {
  return {
    __proto__: null,
    "./renderer_bg.js": {
      __proto__: null,
      __wbg___wbindgen_throw_bb96b2010945f0bc: function(e, r) {
        throw new Error(T(e, r));
      },
      __wbindgen_cast_0000000000000001: function(e, r) {
        const i = T(e, r);
        return J(i);
      }
    }
  };
}
const L = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => n.__wbg_pixelkernels_free(t, 1)), j = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => n.__wbg_resourcecache_free(t, 1)), N = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => n.__wbg_scenecore_free(t, 1));
function J(t) {
  R === b.length && b.push(b.length + 1);
  const e = R;
  return R = b[e], b[e] = t, e;
}
function X(t) {
  t < 1028 || (b[t] = R, R = t);
}
function G(t, e) {
  return t = t >>> 0, Q().subarray(t / 8, t / 8 + e);
}
function M(t, e) {
  return t = t >>> 0, P().subarray(t / 4, t / 4 + e);
}
function H(t, e) {
  return t = t >>> 0, m().subarray(t / 1, t / 1 + e);
}
let h = null;
function c() {
  return (h === null || h.buffer.detached === !0 || h.buffer.detached === void 0 && h.buffer !== n.memory.buffer) && (h = new DataView(n.memory.buffer)), h;
}
let I = null;
function Y() {
  return (I === null || I.byteLength === 0) && (I = new Float32Array(n.memory.buffer)), I;
}
let x = null;
function Q() {
  return (x === null || x.byteLength === 0) && (x = new Float64Array(n.memory.buffer)), x;
}
function T(t, e) {
  return nt(t >>> 0, e);
}
let A = null;
function P() {
  return (A === null || A.byteLength === 0) && (A = new Uint32Array(n.memory.buffer)), A;
}
let k = null;
function m() {
  return (k === null || k.byteLength === 0) && (k = new Uint8Array(n.memory.buffer)), k;
}
function Z(t) {
  return b[t];
}
let b = new Array(1024).fill(void 0);
b.push(void 0, null, !0, !1);
let R = b.length;
function z(t, e) {
  const r = e(t.length * 4, 4) >>> 0;
  return P().set(t, r / 4), l = t.length, r;
}
function tt(t, e) {
  const r = e(t.length * 1, 1) >>> 0;
  return m().set(t, r / 1), l = t.length, r;
}
function S(t, e) {
  const r = e(t.length * 4, 4) >>> 0;
  return Y().set(t, r / 4), l = t.length, r;
}
function C(t, e, r) {
  if (r === void 0) {
    const a = F.encode(t), d = e(a.length, 1) >>> 0;
    return m().subarray(d, d + a.length).set(a), l = a.length, d;
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
    s !== 0 && (t = t.slice(s)), o = r(o, i, i = s + t.length * 3, 1) >>> 0;
    const a = m().subarray(o + s, o + i), d = F.encodeInto(t, a);
    s += d.written, o = r(o, i, s, 1) >>> 0;
  }
  return l = s, o;
}
function y(t) {
  const e = Z(t);
  return X(t), e;
}
let E = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 });
E.decode();
const et = 2146435072;
let W = 0;
function nt(t, e) {
  return W += e, W >= et && (E = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 }), E.decode(), W = e), E.decode(m().subarray(t, t + e));
}
const F = new TextEncoder();
"encodeInto" in F || (F.encodeInto = function(t, e) {
  const r = F.encode(t);
  return e.set(r), {
    read: t.length,
    written: r.length
  };
});
let l = 0, n;
function rt(t, e) {
  return n = t.exports, h = null, I = null, x = null, A = null, k = null, n;
}
async function it(t, e) {
  if (typeof Response == "function" && t instanceof Response) {
    if (!t.ok)
      throw new Error(`failed to fetch Wasm: ${t.status} ${t.statusText} fetching '${t.url}'`);
    if (typeof WebAssembly.instantiateStreaming == "function")
      try {
        return await WebAssembly.instantiateStreaming(t, e);
      } catch (o) {
        if (r(t.type) && t.headers.get("Content-Type") !== "application/wasm")
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
async function at(t) {
  if (n !== void 0) return n;
  t !== void 0 && (Object.getPrototypeOf(t) === Object.prototype ? { module_or_path: t } = t : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), t === void 0 && (t = new URL(
    /* @vite-ignore */
    q,
    import.meta.url
  ));
  const e = $();
  (typeof t == "string" || typeof Request == "function" && t instanceof Request || typeof URL == "function" && t instanceof URL) && (t = fetch(t));
  const { instance: r, module: i } = await it(await t, e);
  return rt(r);
}
function B(t) {
  const [e, r] = t;
  if (!Number.isInteger(e) || !Number.isInteger(r) || e < 1 || r < 1 || e * r > 4194304)
    throw RangeError("Invalid raster size");
  const i = document.createElement("canvas");
  return i.width = e, i.height = r, i;
}
function v(t) {
  t.width = t.height = 0;
}
async function ot(t, e, r, i) {
  r.throwIfAborted();
  const o = await t.paint(e, r, i);
  if (o.width !== t.size[0] || o.height !== t.size[1] || r.aborted)
    throw v(o), r.throwIfAborted(), Error("Raster dimensions differ from recipe");
  return o;
}
function _t(t) {
  const e = t.layers ?? [], r = K(
    JSON.stringify(
      e.map((i) => ({
        id: i.id,
        stage: i.stage,
        order: i.order,
        contributesToEtch: i.contributesToEtch ?? !1
      }))
    )
  );
  return Array.from(r, (i) => e[i]);
}
function ct(t) {
  return JSON.stringify(t.map((e) => [e.id, e.stage, e.order, e.raster.key, e.clip]));
}
async function st(t, e, r, i, o = B(t)) {
  const _ = o.getContext("2d");
  try {
    for (const s of e) {
      const a = await ot(s.raster, r, i);
      try {
        if (_.save(), s.clip) {
          _.beginPath();
          const [d, u, f, g] = s.clip;
          _.rect(d * t[0], u * t[1], f * t[0], g * t[1]), _.clip();
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
async function ut(t, e, r, i) {
  const o = B(t), _ = o.getContext("2d", { willReadFrequently: !0 }), s = _.createImageData(...t);
  try {
    for (const a of e) {
      const d = [
        a.finishCoverage?.add,
        a.finishCoverage?.exclude,
        a.etchCoverage?.add,
        a.etchCoverage?.exclude
      ];
      for (let u = 0; u < 4; u++) {
        const f = d[u];
        if (!f) continue;
        const g = await st(t, [{ ...a, raster: f }], r, i);
        try {
          const p = g.getContext("2d").getImageData(0, 0, ...t).data;
          for (let w = 0; w < p.length; w += 4)
            s.data[w + u] = Math.max(s.data[w + u], p[w + 3]);
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
  O as P,
  U as R,
  D as S,
  at as _,
  ct as a,
  ot as b,
  B as c,
  v as d,
  ut as e,
  _t as l,
  st as p
};
