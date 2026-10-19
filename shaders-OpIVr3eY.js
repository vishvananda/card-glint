const J = "renderer_bg.wasm";
class G {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, W.unregister(this), e;
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
  etch(e, i, a, o) {
    try {
      const p = n.__wbindgen_add_to_stack_pointer(-16), d = se(a, n.__wbindgen_export), m = u;
      n.pixelkernels_etch(p, this.__wbg_ptr, e, i, d, m, o);
      var c = l().getInt32(p + 0, !0), r = l().getInt32(p + 4, !0), s = l().getInt32(p + 8, !0), v = l().getInt32(p + 12, !0);
      if (v)
        throw g(s);
      var f = ae(c, r).slice();
      return n.__wbindgen_export2(c, r * 1, 1), f;
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
  constructor() {
    const e = n.pixelkernels_new();
    return this.__wbg_ptr = e, W.register(this, this.__wbg_ptr, this), this;
  }
}
Symbol.dispose && (G.prototype[Symbol.dispose] = G.prototype.free);
class B {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, H.unregister(this), e;
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
  admit(e, i, a) {
    let o, c;
    try {
      const m = n.__wbindgen_add_to_stack_pointer(-16), w = M(e, n.__wbindgen_export, n.__wbindgen_export3), P = u;
      n.resourcecache_admit(m, this.__wbg_ptr, w, P, i, a);
      var r = l().getInt32(m + 0, !0), s = l().getInt32(m + 4, !0), v = l().getInt32(m + 8, !0), f = l().getInt32(m + 12, !0), p = r, d = s;
      if (f)
        throw p = 0, d = 0, g(v);
      return o = p, c = d, L(p, d);
    } finally {
      n.__wbindgen_add_to_stack_pointer(16), n.__wbindgen_export2(o, c, 1);
    }
  }
  /**
   * @returns {Uint32Array}
   */
  clear() {
    try {
      const o = n.__wbindgen_add_to_stack_pointer(-16);
      n.resourcecache_clear(o, this.__wbg_ptr);
      var e = l().getInt32(o + 0, !0), i = l().getInt32(o + 4, !0), a = z(e, i).slice();
      return n.__wbindgen_export2(e, i * 4, 4), a;
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} key
   * @returns {number | undefined}
   */
  lookup(e) {
    const i = M(e, n.__wbindgen_export, n.__wbindgen_export3), a = u, o = n.resourcecache_lookup(this.__wbg_ptr, i, a);
    return o === Number.MAX_SAFE_INTEGER ? void 0 : o;
  }
  /**
   * @param {number} bytes
   */
  constructor(e) {
    const i = n.resourcecache_new(e);
    return this.__wbg_ptr = i, H.register(this, this.__wbg_ptr, this), this;
  }
  /**
   * # Errors
   * Refuses invalid handles and unbalanced leases.
   * @param {number} id
   * @param {boolean} acquire
   */
  pin(e, i) {
    try {
      const c = n.__wbindgen_add_to_stack_pointer(-16);
      n.resourcecache_pin(c, this.__wbg_ptr, e, i);
      var a = l().getInt32(c + 0, !0), o = l().getInt32(c + 4, !0);
      if (o)
        throw g(a);
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
    let e, i;
    try {
      const f = n.__wbindgen_add_to_stack_pointer(-16);
      n.resourcecache_stats(f, this.__wbg_ptr);
      var a = l().getInt32(f + 0, !0), o = l().getInt32(f + 4, !0), c = l().getInt32(f + 8, !0), r = l().getInt32(f + 12, !0), s = a, v = o;
      if (r)
        throw s = 0, v = 0, g(c);
      return e = s, i = v, L(s, v);
    } finally {
      n.__wbindgen_add_to_stack_pointer(16), n.__wbindgen_export2(e, i, 1);
    }
  }
}
Symbol.dispose && (B.prototype[Symbol.dispose] = B.prototype.free);
class O {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, q.unregister(this), e;
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
  hit(e, i) {
    try {
      const r = n.__wbindgen_add_to_stack_pointer(-16);
      n.scenecore_hit(r, this.__wbg_ptr, e, i);
      var a = l().getInt32(r + 0, !0), o = l().getInt32(r + 4, !0), c = re(a, o).slice();
      return n.__wbindgen_export2(a, o * 8, 8), c;
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
  constructor() {
    const e = n.scenecore_new();
    return this.__wbg_ptr = e, q.register(this, this.__wbg_ptr, this), this;
  }
  /**
   * # Errors
   * Refuses malformed or non-finite camera data.
   * @param {Float32Array} camera
   * @returns {Uint32Array}
   */
  plan(e) {
    try {
      const s = n.__wbindgen_add_to_stack_pointer(-16), v = E(e, n.__wbindgen_export), f = u;
      n.scenecore_plan(s, this.__wbg_ptr, v, f);
      var i = l().getInt32(s + 0, !0), a = l().getInt32(s + 4, !0), o = l().getInt32(s + 8, !0), c = l().getInt32(s + 12, !0);
      if (c)
        throw g(o);
      var r = z(i, a).slice();
      return n.__wbindgen_export2(i, a * 4, 4), r;
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
  plan_shaped(e, i, a) {
    try {
      const f = n.__wbindgen_add_to_stack_pointer(-16), p = E(e, n.__wbindgen_export), d = u, m = E(i, n.__wbindgen_export), w = u;
      n.scenecore_plan_shaped(f, this.__wbg_ptr, p, d, m, w, a);
      var o = l().getInt32(f + 0, !0), c = l().getInt32(f + 4, !0), r = l().getInt32(f + 8, !0), s = l().getInt32(f + 12, !0);
      if (s)
        throw g(r);
      var v = z(o, c).slice();
      return n.__wbindgen_export2(o, c * 4, 4), v;
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
  update(e, i, a) {
    try {
      const r = n.__wbindgen_add_to_stack_pointer(-16), s = K(e, n.__wbindgen_export), v = u, f = E(i, n.__wbindgen_export), p = u, d = K(a, n.__wbindgen_export), m = u;
      n.scenecore_update(r, this.__wbg_ptr, s, v, f, p, d, m);
      var o = l().getInt32(r + 0, !0), c = l().getInt32(r + 4, !0);
      if (c)
        throw g(o);
    } finally {
      n.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
Symbol.dispose && (O.prototype[Symbol.dispose] = O.prototype.free);
function Le(t) {
  try {
    const r = n.__wbindgen_add_to_stack_pointer(-16), s = M(t, n.__wbindgen_export, n.__wbindgen_export3), v = u;
    n.validate_layers(r, s, v);
    var e = l().getInt32(r + 0, !0), i = l().getInt32(r + 4, !0), a = l().getInt32(r + 8, !0), o = l().getInt32(r + 12, !0);
    if (o)
      throw g(a);
    var c = z(e, i).slice();
    return n.__wbindgen_export2(e, i * 4, 4), c;
  } finally {
    n.__wbindgen_add_to_stack_pointer(16);
  }
}
function Z() {
  return {
    __proto__: null,
    "./renderer_bg.js": {
      __proto__: null,
      __wbg___wbindgen_throw_bb96b2010945f0bc: function(e, i) {
        throw new Error(L(e, i));
      },
      __wbindgen_cast_0000000000000001: function(e, i) {
        const a = L(e, i);
        return ee(a);
      }
    }
  };
}
const W = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => n.__wbg_pixelkernels_free(t, 1)), H = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => n.__wbg_resourcecache_free(t, 1)), q = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => n.__wbg_scenecore_free(t, 1));
function ee(t) {
  R === h.length && h.push(h.length + 1);
  const e = R;
  return R = h[e], h[e] = t, e;
}
function te(t) {
  t < 1028 || (h[t] = R, R = t);
}
function re(t, e) {
  return t = t >>> 0, oe().subarray(t / 8, t / 8 + e);
}
function z(t, e) {
  return t = t >>> 0, X().subarray(t / 4, t / 4 + e);
}
function ae(t, e) {
  return t = t >>> 0, b().subarray(t / 1, t / 1 + e);
}
let x = null;
function l() {
  return (x === null || x.buffer.detached === !0 || x.buffer.detached === void 0 && x.buffer !== n.memory.buffer) && (x = new DataView(n.memory.buffer)), x;
}
let y = null;
function ie() {
  return (y === null || y.byteLength === 0) && (y = new Float32Array(n.memory.buffer)), y;
}
let _ = null;
function oe() {
  return (_ === null || _.byteLength === 0) && (_ = new Float64Array(n.memory.buffer)), _;
}
function L(t, e) {
  return le(t >>> 0, e);
}
let k = null;
function X() {
  return (k === null || k.byteLength === 0) && (k = new Uint32Array(n.memory.buffer)), k;
}
let T = null;
function b() {
  return (T === null || T.byteLength === 0) && (T = new Uint8Array(n.memory.buffer)), T;
}
function ne(t) {
  return h[t];
}
let h = new Array(1024).fill(void 0);
h.push(void 0, null, !0, !1);
let R = h.length;
function K(t, e) {
  const i = e(t.length * 4, 4) >>> 0;
  return X().set(t, i / 4), u = t.length, i;
}
function se(t, e) {
  const i = e(t.length * 1, 1) >>> 0;
  return b().set(t, i / 1), u = t.length, i;
}
function E(t, e) {
  const i = e(t.length * 4, 4) >>> 0;
  return ie().set(t, i / 4), u = t.length, i;
}
function M(t, e, i) {
  if (i === void 0) {
    const s = I.encode(t), v = e(s.length, 1) >>> 0;
    return b().subarray(v, v + s.length).set(s), u = s.length, v;
  }
  let a = t.length, o = e(a, 1) >>> 0;
  const c = b();
  let r = 0;
  for (; r < a; r++) {
    const s = t.charCodeAt(r);
    if (s > 127) break;
    c[o + r] = s;
  }
  if (r !== a) {
    r !== 0 && (t = t.slice(r)), o = i(o, a, a = r + t.length * 3, 1) >>> 0;
    const s = b().subarray(o + r, o + a), v = I.encodeInto(t, s);
    r += v.written, o = i(o, a, r, 1) >>> 0;
  }
  return u = r, o;
}
function g(t) {
  const e = ne(t);
  return te(t), e;
}
let D = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 });
D.decode();
const ce = 2146435072;
let N = 0;
function le(t, e) {
  return N += e, N >= ce && (D = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 }), D.decode(), N = e), D.decode(b().subarray(t, t + e));
}
const I = new TextEncoder();
"encodeInto" in I || (I.encodeInto = function(t, e) {
  const i = I.encode(t);
  return e.set(i), {
    read: t.length,
    written: i.length
  };
});
let u = 0, n;
function ve(t, e) {
  return n = t.exports, x = null, y = null, _ = null, k = null, T = null, n;
}
async function fe(t, e) {
  if (typeof Response == "function" && t instanceof Response) {
    if (!t.ok)
      throw new Error(`failed to fetch Wasm: ${t.status} ${t.statusText} fetching '${t.url}'`);
    if (typeof WebAssembly.instantiateStreaming == "function")
      try {
        return await WebAssembly.instantiateStreaming(t, e);
      } catch (o) {
        if (i(t.type) && t.headers.get("Content-Type") !== "application/wasm")
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", o);
        else
          throw o;
      }
    const a = await t.arrayBuffer();
    return await WebAssembly.instantiate(a, e);
  } else {
    const a = await WebAssembly.instantiate(t, e);
    return a instanceof WebAssembly.Instance ? { instance: a, module: t } : a;
  }
  function i(a) {
    switch (a) {
      case "basic":
      case "cors":
      case "default":
        return !0;
    }
    return !1;
  }
}
async function Pe(t) {
  if (n !== void 0) return n;
  t !== void 0 && (Object.getPrototypeOf(t) === Object.prototype ? { module_or_path: t } = t : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), t === void 0 && (t = new URL(
    /* @vite-ignore */
    J,
    import.meta.url
  ));
  const e = Z();
  (typeof t == "string" || typeof Request == "function" && t instanceof Request || typeof URL == "function" && t instanceof URL) && (t = fetch(t));
  const { instance: i, module: a } = await fe(await t, e);
  return ve(i);
}
const pe = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`, C = `#version 300 es
precision highp float;precision highp int;precision highp usampler2D;
`, de = C + `uniform sampler2D source;uniform ivec2 size;uniform int mode;layout(location=0) out uvec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);if(mode==1)p.y=size.y-1-p.y;uvec3 rgb=uvec3(floor(texelFetch(source,p,0).rgb*255.+.5));
uint y=(54u*rgb.r+183u*rgb.g+19u*rgb.b)>>8u;color=uvec4(y,0,0,1);}`, ue = C + `uniform usampler2D source;uniform ivec2 size;uniform int mode;uniform int threshold;
layout(location=0) out uvec4 color;
int at(ivec2 p){return int(texelFetch(source,p,0).r);}
void main(){ivec2 p=ivec2(gl_FragCoord.xy);int value=0;
if(mode==1){value=p.x==0||p.x==size.x-1?at(p):(at(p-ivec2(1,0))+2*at(p)+at(p+ivec2(1,0)))>>2;}
else if(mode==2){value=p.y==0||p.y==size.y-1?at(p):(at(p-ivec2(0,1))+2*at(p)+at(p+ivec2(0,1)))>>2;}
else if(p.x>0&&p.y>0&&p.x<size.x-1&&p.y<size.y-1){
int gx=-at(p+ivec2(-1,-1))+at(p+ivec2(1,-1))-2*at(p+ivec2(-1,0))+2*at(p+ivec2(1,0))-at(p+ivec2(-1,1))+at(p+ivec2(1,1));
int gy=-at(p+ivec2(-1,-1))-2*at(p+ivec2(0,-1))-at(p+ivec2(1,-1))+at(p+ivec2(-1,1))+2*at(p+ivec2(0,1))+at(p+ivec2(1,1));
value=clamp((((abs(gx)+abs(gy))>>2)-threshold)*8,0,255);}
color=uvec4(uint(value),0,0,1);}`, me = C + `uniform usampler2D strength;uniform usampler2D softened;out vec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);uint a=min(255u,max(texelFetch(strength,p,0).r,texelFetch(softened,p,0).r)*2u);color=vec4(float(a)/255.,0.,0.,1.);}`;
function V(t, e, i = pe) {
  const a = [], o = t.createProgram();
  try {
    for (const [c, r] of [
      [t.VERTEX_SHADER, i],
      [t.FRAGMENT_SHADER, e]
    ]) {
      const s = t.createShader(c);
      if (a.push(s), t.shaderSource(s, r), t.compileShader(s), !t.getShaderParameter(s, t.COMPILE_STATUS))
        throw Error(t.getShaderInfoLog(s));
      t.attachShader(o, s);
    }
    if (t.linkProgram(o), !t.getProgramParameter(o, t.LINK_STATUS)) throw Error(t.getProgramInfoLog(o));
    return o;
  } catch (c) {
    throw t.deleteProgram(o), c;
  } finally {
    for (const c of a) t.deleteShader(c);
  }
}
function U(t, e, i, a = t.R8, o = t.RED, c = t.UNSIGNED_BYTE) {
  const r = t.createTexture();
  t.bindTexture(t.TEXTURE_2D, r);
  const s = a === t.R8UI ? t.NEAREST : t.LINEAR;
  return t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, s), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, s), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texImage2D(t.TEXTURE_2D, 0, a, e, i, 0, o, c, null), r;
}
class Ne {
  constructor(e) {
    this.gl = e, this.scratch = [], this.width = this.height = 0, this.disposed = !1;
    const i = performance.now();
    this.programs = [];
    try {
      for (const a of [de, ue, me]) this.programs.push(V(e, a));
    } catch (a) {
      throw this.dispose(), a;
    }
    this.uniforms = this.programs.map(
      (a) => Object.fromEntries(
        ["source", "size", "mode", "threshold", "strength", "softened"].map((o) => [
          o,
          e.getUniformLocation(a, o)
        ])
      )
    ), this.framebuffer = e.createFramebuffer(), this.vao = e.createVertexArray(), this.compileMs = performance.now() - i;
  }
  allocate(e, i) {
    if (e === this.width && i === this.height) return;
    const a = this.gl;
    for (const o of this.scratch) a.deleteTexture(o);
    this.scratch = [], this.width = e, this.height = i, this.input = U(a, e, i, a.RGBA8, a.RGBA), this.scratch.push(this.input);
    for (let o = 0; o < 3; o++) this.scratch.push(U(a, e, i, a.R8UI, a.RED_INTEGER));
    if (a.bindFramebuffer(a.FRAMEBUFFER, this.framebuffer), a.framebufferTexture2D(
      a.FRAMEBUFFER,
      a.COLOR_ATTACHMENT0,
      a.TEXTURE_2D,
      this.scratch[1],
      0
    ), a.checkFramebufferStatus(a.FRAMEBUFFER) !== a.FRAMEBUFFER_COMPLETE)
      throw Error("GPU integer etching framebuffer is unavailable");
  }
  run(e, i, a, o = 20, c = null) {
    if (this.disposed) throw Error("GPU etcher disposed");
    if (!Number.isInteger(i) || !Number.isInteger(a) || i < 1 || a < 1 || i * a > 4194304 || !Number.isInteger(o) || o < 0 || o > 255)
      throw RangeError("Invalid etching dimensions or threshold");
    if (ArrayBuffer.isView(e) && e.byteLength !== i * a * 4)
      throw RangeError("Wrong RGBA input length");
    if (e === null && (i !== this.width || a !== this.height))
      throw Error("Resident input must be uploaded at this size before reuse");
    const r = this.gl;
    this.allocate(i, a), r.bindVertexArray(this.vao), r.disable(r.BLEND), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.viewport(0, 0, i, a), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, this.input), r.pixelStorei(r.UNPACK_ALIGNMENT, 1), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL, r.NONE), e !== null && (this.flipped = typeof ImageBitmap < "u" && e instanceof ImageBitmap ? 1 : 0), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !ArrayBuffer.isView(e) && !this.flipped), ArrayBuffer.isView(e) ? r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, i, a, r.RGBA, r.UNSIGNED_BYTE, e) : e !== null && r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, e), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1);
    const [s, v, f] = this.scratch.slice(1), p = c ?? U(r, i, a), d = (w, P, Y, Q = 0) => {
      r.useProgram(this.programs[w]);
      const A = this.uniforms[w];
      r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, P), r.uniform1i(A.source, 0), r.uniform2i(A.size, i, a), r.uniform1i(A.mode, Q), r.uniform1i(A.threshold, o), r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, Y, 0), r.drawArrays(r.TRIANGLES, 0, 3);
    };
    d(0, this.input, s, this.flipped ?? 0), d(1, s, v, 1), d(1, v, f, 2), d(1, f, s, 3), d(1, s, v, 1), d(1, v, f, 2);
    const m = this.uniforms[2];
    return r.useProgram(this.programs[2]), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, s), r.uniform1i(m.strength, 0), r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, f), r.uniform1i(m.softened, 1), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, p, 0), r.drawArrays(r.TRIANGLES, 0, 3), r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(null), p;
  }
  // Validation/measurement only. The real capture feeds the result directly to GL.
  read(e, i = this.width, a = this.height) {
    const o = this.gl, c = new Uint8Array(i * a * 4), r = new Uint8Array(i * a);
    o.bindFramebuffer(o.FRAMEBUFFER, this.framebuffer), o.framebufferTexture2D(o.FRAMEBUFFER, o.COLOR_ATTACHMENT0, o.TEXTURE_2D, e, 0), o.readPixels(0, 0, i, a, o.RGBA, o.UNSIGNED_BYTE, c), o.bindFramebuffer(o.FRAMEBUFFER, null);
    for (let s = 0; s < r.length; s++) r[s] = c[s * 4];
    return r;
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    const e = this.gl;
    for (const i of this.programs ?? []) e.deleteProgram(i);
    for (const i of this.scratch ?? []) e.deleteTexture(i);
    e.deleteFramebuffer(this.framebuffer ?? null), e.deleteVertexArray(this.vao ?? null);
  }
}
const he = `
float holofoilGrainFilter=1.;
vec3 holofoil(vec2 p,vec3 ink,vec3 normal,vec3 view,float seed,float grainFilter){
  vec3 reflected=reflect(-view,normal);
  vec2 light=reflected.xy/max(abs(reflected.z),.25)+(pointer-.5)*.85;
  float axisA=dot(p,vec2(1.6,.45))+dot(light,vec2(1.1,.65))+seed;
  float axisB=dot(p,vec2(-.7,1.9))+dot(light,vec2(-.8,1.3))+seed*.37;
  // Reuse the card foil's mylar spectra while retaining patch-local axes,
  // stationary grooves and the printed emblem's luminance.
  vec3 rainbow=mix(pastelSpectrum(axisA),vividSpectrum(axisA+.06),.48);
  vec3 rawDiffraction=mix(rainbow,iridescentBands(axisB,3.),.35);
  vec3 diffraction=mix(vec3(inkLuma(rawDiffraction)),rawDiffraction,.84);
  float stripe=dot(p,vec2(24.,8.));
  float grain=1.-.035*(.5+.5*cos(stripe*6.2831853))*grainFilter;
  float broad=exp(-dot(light-vec2(-.15,.12),light-vec2(-.15,.12))*2.8);
  float flashAxis=dot(p-.5,vec2(.7,.25))+dot(light,vec2(.85,.4));
  float flash=exp(-flashAxis*flashAxis*70.);
  float luminance=dot(ink,vec3(.2126,.7152,.0722));
  vec3 silver=ink*(.80+.12*broad)*grain;
  vec3 colored=diffraction*(.12+.28*broad+.25*flash)*(.25+.75*luminance);
  vec3 specular=vec3(1.,.99,.96)*flash*.24;
  return silver+colored+specular;
}
`, ge = `
uniform sampler2D hologramMask;
uniform vec4 hologramRect;
uniform vec2 hologramMaterial;
vec3 localHologram(vec2 uv, vec3 ink, vec3 normal, vec3 view, float grainFilter) {
  if(hologramMaterial.x<=0.) return ink;
  vec2 p=(uv-hologramRect.xy)/hologramRect.zw;
  if(any(lessThan(p,vec2(0.))) || any(greaterThan(p,vec2(1.)))) return ink;
  float cover=texture(hologramMask,p).a*hologramMaterial.x;
  if(cover<=0.) return ink;
  return mix(ink,holofoil(p,ink,normal,view,hologramMaterial.y,grainFilter),cover);
}
`, xe = `
  if(previewKind>=5. && previewKind<8.) {
    vec2 d=vec2(1./244.,1./340.);
    float height=texture2D(wave,uv).r*hasWave;
    vec2 gradient=vec2(texture2D(wave,uv+vec2(d.x,0.)).r-texture2D(wave,uv-vec2(d.x,0.)).r,
      texture2D(wave,uv+vec2(0.,d.y)).r-texture2D(wave,uv-vec2(0.,d.y)).r)*hasWave;
    vec4 bounds=vec4(.03937,.02531,.96063,.96063);
    float edge=min(min(uv.x-bounds.x,bounds.z-uv.x),min(uv.y-bounds.y,bounds.w-uv.y));
    float window=smoothstep(0.,max(fwidth(edge),.00001),edge);
    gradient*=smoothstep(0.,.016,edge);
    vec2 shift=gradient*1.3;
    shift*=min(1.,max(0.,edge-.0015)/max(length(shift),.00001));
    // The bounded shift cannot cross the border. Preserve texture filtering
    // there instead of snapping the sample to an inset art rectangle.
    base=previewInk(texture2D(face,uv+shift).rgb);
    vec3 fluidNormal=normalize(vec3(-gradient*32.,1.));
    // Ripple glints perturb the same reflected strip as cold/prismatic foil.
    // At rest their angle is identical, including the card's physical tilt.
    vec3 tangent=normalize(vec3(normal.z,0.,-normal.x));
    vec3 bitangent=normalize(cross(normal,tangent));
    vec3 rippleNormal=normalize(normal+tangent*fluidNormal.x+bitangent*fluidNormal.y);
    float specAxis=satinStripAxis(uv,rippleNormal,view);
    float spec=exp(-specAxis*specAxis*620.);
    float crest=smoothstep(.0003,.012,length(gradient));
    vec3 fluid=base;
    if(window>0.) {
      if(previewKind==5.) {
        fluid+=vec3(.10,.16,.17)*crest;
        fluid=mix(fluid,mix(vec3(.12,.38,.48),vec3(.9,.99,1.),spec),.012+crest*.11+spec*crest*.75);
      } else {
        float phase=height*15.+fluidNormal.x*1.7+fluidNormal.y*1.3+dot(uv,vec2(.12,.18));
        fluid=mix(fluid,mix(spectrum(phase),vec3(1.),spec*.3),min(.85,.06+crest*.64+spec*crest*.24));
      }
    }
    base=mix(base,fluid,window);
    return mix(base,satin(uv,base,normal,view,previewKind==6.?2.:3.,0.),.65);
  }
`, we = `
uniform float satinCompact;
uniform float satinHoverGain;
float foilHash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
vec2 foilHash2(vec2 p) {
  return vec2(foilHash(p), foilHash(p + vec2(37.2, 19.8)));
}
float inkLuma(vec3 c) {
  return dot(c, vec3(.2126, .7152, .0722));
}
vec3 blendColorDodge(vec3 base, vec3 blend) {
  return clamp(base / max(vec3(1.) - clamp(blend, 0., .95), vec3(.05)), 0., 1.);
}
vec3 blendOverlay(vec3 base, vec3 blend) {
  return mix(
    2. * base * blend,
    vec3(1.) - 2. * (vec3(1.) - base) * (vec3(1.) - blend),
    step(vec3(.5), base)
  );
}
vec3 blendScreen(vec3 a, vec3 b) {
  return vec3(1.) - (vec3(1.) - a) * (vec3(1.) - b);
}
// Color-dodge + subtle screen lift so foil highlights work naturally on both bright art and dark frames.
vec3 foilSheenBlend(vec3 base, vec3 shine) {
  vec3 s = clamp(shine, 0., .90);
  vec3 lifted = max(base, min(vec3(.26), s * .42));
  return mix(blendColorDodge(lifted, s), blendScreen(base, s * .85), .28);
}
vec2 foilPointer(vec3 normal) {
  vec2 delta = vec2(normal.x * 2.63, normal.y * 3.33) + vec2(pointer.x - .5, .5 - pointer.y);
  // Keep the flat-pose studio offset, but taper it broadly. A narrow Gaussian
  // folds the light path near zero: highlights reverse as the card keeps turning.
  // Here the offset Jacobian norm is <= length(vec2(.18,.20))*sqrt(4/e) < .33,
  // so the unclamped mapping stays monotone with gain bounded by .67..1.33.
  vec2 rest = vec2(-.18, -.20) * exp(-dot(delta, delta) * 2.);
  return clamp(vec2(.5) + delta + rest, 0., 1.);
}
vec2 foilSweepOffset(vec2 ptr) {
  return mix(vec2(.37, .33), vec2(.63, .67), ptr);
}
float foilRadialDistance(vec2 cardUv, vec2 ptr) {
  const vec2 cardAspect = vec2(.718, 1.);
  float cornerDist = length(max(ptr, vec2(1.) - ptr) * cardAspect);
  return length((cardUv - ptr) * cardAspect) / max(cornerDist, .5);
}
vec3 applyStudioGlare(vec3 c, float rT, float opacity) {
  vec2 pa;
  if (rT <= .10) {
    pa = vec2(.80, .80);
  } else if (rT <= .20) {
    pa = mix(vec2(.80, .80), vec2(.65, .65), (rT - .10) * 10.);
  } else {
    float u = clamp((rT - .20) * 1.4285714, 0., 1.);
    pa = mix(vec2(.65, .65), vec2(.0, .50), u);
  }
  float a = pa.y;
  float gray = pa.x / max(a, 1e-4);
  vec3 ov = blendOverlay(c, vec3(gray));
  float bloom = max(0., gray - .5) * 2. * (1. - smoothstep(0., .58, rT));
  vec3 glazed = mix(ov, blendScreen(c, vec3(bloom * .48)), .42);
  return mix(c, glazed, clamp(a * opacity, 0., 1.));
}
vec3 spectrum(float phase) { return .5 + .5*cos(6.2831853*(phase+vec3(0.,.333,.667))); }
float satinStripAxis(vec2 uv, vec3 normal, vec3 view) {
  vec3 reflected=reflect(-view,normal);
  vec2 q=reflected.xy/max(abs(reflected.z),.25)+(pointer-.5)*1.1;
  return mix(q.x+.12+q.y*.2,
    (uv.x-pointer.x)*.65+(uv.y-pointer.y)*.18+dot(reflected.xy,vec2(.16,.10)),satinCompact);
}
vec3 satin(vec2 uv, vec3 base, vec3 normal, vec3 view, float kind, float metal) {
  vec3 reflected=reflect(-view,normal);
  vec2 q=reflected.xy/max(abs(reflected.z),.25)+(pointer-.5)*1.1;
  vec2 broadQ=mix(q,reflected.xy/max(abs(reflected.z),.25)+vec2(-.10,.17)+(pointer-.5)*.28,satinCompact);
  vec2 broadDelta=(broadQ-vec2(-.10,.17))*vec2(1.45,.85);
  float broad=exp(-dot(broadDelta,broadDelta))*.38;
  float stripAxis=satinStripAxis(uv,normal,view);
  float strip2=stripAxis*stripAxis;
  float strip=exp(-strip2*48.)*.34+exp(-strip2*240.)*.18;
  float reflection=broad+strip;
  float nv=1.-abs(dot(normal,view)),nv2=nv*nv;
  float fresnel=.08+.62*(nv2*nv2);
  vec3 bands=spectrum(uv.x*.62+uv.y*.28+reflected.x*1.35+reflected.y*.75);
  vec3 substrate=base;
  vec3 light=vec3(.84,.94,1.)*reflection*(.68+fresnel);
  if (kind==1.) {
    substrate=base*mix(vec3(1.),vec3(.99,.95,.88),.28);
    reflection=broad*.34+strip*(.22+metal*2.1);
    light=mix(vec3(1.,.86,.58),vec3(1.,.94,.78),metal)*reflection*(.68+fresnel+metal*.85);
  } else if(kind==2.) {
    substrate=base*(.96+.04*mix(vec3(1.),bands,.75));
    reflection=broad*.26+strip*.54;
    light=mix(vec3(1.,.98,.94),bands,.82)*reflection*(.70+fresnel);
    light+=vec3(1.,.99,.96)*exp(-strip2*280.)*.08;
  } else if(kind==3.) {
    reflection=broad*.28+strip*.52;
    light=vec3(.86,.94,1.)*reflection*(.64+fresnel);
  } else if(kind==4.) {
    substrate=base*vec3(.96,1.,.98);
    reflection=broad*.24+strip*.52;
    light=vec3(.42,.90,.62)*reflection*(.72+fresnel);
  }
  return clamp(substrate+light*(1.+satinHoverGain),0.,1.);
}
vec4 opalFacet(vec2 uv, vec2 tilt, vec3 normal, vec3 view) {
  vec2 grid=uv*vec2(14.,14.*aspect), cell=floor(grid), p=fract(grid);
  float triangle=step(p.x,p.y);
  float seed=fract(sin(dot(cell,vec2(127.1,311.7)))*43758.5453);
  vec3 facet=normalize(vec3((seed-.5)*1.15,(triangle-.5)*.75,1.));
  vec3 lamp=normalize(vec3(tilt*.6+vec2(-.4,.45),1.));
  float spec=max(0.,dot(facet,normalize(lamp+vec3(0.,0.,1.))));
  float s2=spec*spec,s4=s2*s2,s8=s4*s4;
  float stripAxis=satinStripAxis(uv,normal,view);
  float flash=(s8*s8*s8)*exp(-(stripAxis*stripAxis)*90.);
  vec3 opal=mix(spectrum(seed*.6+triangle*.12+tilt.x*.17),vec3(.92,.99,.96),.50);
  return vec4(opal,flash*.40);
}
`, be = `
vec3 studioGloss(vec3 ink, vec3 normal, vec3 view, vec3 position) {
  vec3 n=normalize(normal),v=normalize(view);
  float nv=dot(n,v);
  if(nv<=0.)return ink;
  vec3 ray=reflect(-v,n);
  if(ray.z<=.0001)return ink;
  const vec3 lamp=vec3(-.85,1.10,3.);
  const vec2 halfSize=vec2(.52,.95);
  float travel=(lamp.z-position.z)/ray.z;
  if(travel<=0.)return ink;
  vec2 hit=(position+ray*travel).xy-lamp.xy;
  // A modest reflection cone softens the source without pinning it to the face.
  float blur=.10+travel*.08;
  vec2 edge=abs(hit)-halfSize;
  vec2 coverage=vec2(1.)-smoothstep(vec2(-blur),vec2(blur),edge);
  float source=coverage.x*coverage.y;
  float grazing=1.-clamp(nv,0.,1.);
  float g2=grazing*grazing;
  float fresnel=.035+.965*g2*g2*grazing;
  // Restrained pack-fresh varnish, with a nearly neutral softbox reflection.
  vec3 reflected=vec3(1.00,.99,.97)*source*fresnel*.78*1.10;
  vec3 linearInk=previewLinear(ink);
  return previewInk(clamp(linearInk*(1.-source*fresnel*.15)+reflected,0.,1.));
}
// Normal-only / 2D hosts use an upright virtual card and a finite studio camera.
// The native 3D pass instead supplies actual world positions and its own camera.
vec3 studioCardGloss(vec2 uv, vec3 ink, vec3 normal) {
  vec3 n=normalize(normal);
  float cy=max(length(n.yz),.0001);
  float sx=-n.y/cy,cx=n.z/cy;
  vec3 right=vec3(cy,sx*n.x,-cx*n.x),up=vec3(0.,cx,sx);
  vec3 position=right*((uv.x-.5)/aspect)+up*(uv.y-.5);
  return studioGloss(ink,n,normalize(vec3(0.,0.,2.1)-position),position);
}
`;
function j(t = {}) {
  const e = t.artWindows === "pair" ? `float artWindow(vec2 uv) {
    float first=step(artBounds.x,uv.x)*step(uv.x,artBounds.z)*step(artBounds.y,uv.y)*step(uv.y,artBounds.w);
    float second=step(artBounds2.x,uv.x)*step(uv.x,artBounds2.z)*step(artBounds2.y,uv.y)*step(uv.y,artBounds2.w);
    return max(first,second);
  }` : `float artWindow(vec2 uv) {
  float coverage=0.;
  for(int i=0;i<8;i++){
    vec4 bounds=artBounds[i];
    coverage=max(coverage,step(bounds.x,uv.x)*step(uv.x,bounds.z)*step(bounds.y,uv.y)*step(uv.y,bounds.w));
  }
  return coverage;
}`;
  return `
uniform float previewKind;
uniform sampler2D wave;
uniform float hasWave;
// The study was tuned against printed sRGB ink. Preserve those amounts when
// the host uploads sRGB textures and performs the final output conversion.
vec3 previewInk(vec3 c) { return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c)); }
vec3 previewLinear(vec3 c) { return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c)); }
${we}
${be}
${e}
// Gameplay mask alpha is stored unchanged in a linear R8 red channel.
float etchMask(vec2 uv) { return texture2D(mask,uv).r*hasMask; }
float contour(vec2 uv) { return texture2D(mask,uv).r*hasMask*artWindow(uv); }
vec3 vividSpectrum(float t) {
  float x=fract(t)*5.;
  int idx=int(floor(x));
  float f=fract(x);
  vec3 c0=vec3(.788,.161,.945);
  vec3 c1=vec3(.051,.741,.914);
  vec3 c2=vec3(.129,.914,.522);
  vec3 c3=vec3(.933,.875,.063);
  vec3 c4=vec3(.973,.055,.208);
  if(idx==0) return mix(c0,c1,f);
  if(idx==1) return mix(c1,c2,f);
  if(idx==2) return mix(c2,c3,f);
  if(idx==3) return mix(c3,c4,f);
  return mix(c4,c0,f);
}
vec3 iridescentBands(float t, float offset) {
  float x=fract(t+offset*.1666667)*6.;
  int idx=int(floor(x));
  float f=fract(x);
  vec3 c0=vec3(1.00,.46,.44);
  vec3 c1=vec3(1.00,.93,.38);
  vec3 c2=vec3(.67,1.00,.38);
  vec3 c3=vec3(.52,1.00,.97);
  vec3 c4=vec3(.48,.58,1.00);
  vec3 c5=vec3(.84,.44,1.00);
  if(idx==0) return mix(c0,c1,f);
  if(idx==1) return mix(c1,c2,f);
  if(idx==2) return mix(c2,c3,f);
  if(idx==3) return mix(c3,c4,f);
  if(idx==4) return mix(c4,c5,f);
  return mix(c5,c0,f);
}
vec3 pastelSpectrum(float t) {
  float x=fract(t)*7.;
  int idx=int(floor(x));
  float f=fract(x);
  vec3 c0=vec3(.94,.48,.48);
  vec3 c1=vec3(.95,.78,.44);
  vec3 c2=vec3(.64,.92,.45);
  vec3 c3=vec3(.42,.90,.88);
  vec3 c4=vec3(.44,.82,.96);
  vec3 c5=vec3(.56,.66,.98);
  vec3 c6=vec3(.84,.52,.94);
  if(idx==0) return mix(c0,c1,f);
  if(idx==1) return mix(c1,c2,f);
  if(idx==2) return mix(c2,c3,f);
  if(idx==3) return mix(c3,c4,f);
  if(idx==4) return mix(c4,c5,f);
  if(idx==5) return mix(c5,c6,f);
  return mix(c6,c0,f);
}
${he}
float microSparkle(vec2 cardUv, vec2 shift, float density) {
  vec2 p=(cardUv+shift)*vec2(96.,134.)*density;
  vec2 i=floor(p);
  vec2 f=fract(p);
  vec2 rnd=foilHash2(i);
  float d=length(f-(.18+.64*rnd));
  float h=foilHash(i+vec2(11.7,53.1));
  float speck=(1.-smoothstep(.03,.28,d))*step(.36,h);
  float bright=(1.-smoothstep(.0,.18,d))*step(.82,h);
  return clamp(speck*.55+bright*.75,0.,1.);
}
float nacreWavePattern(vec2 cardUv) {
  vec2 tile=fract(cardUv*vec2(3.,4.18))-.5;
  vec2 w=tile+vec2(.06*sin(tile.y*6.28318),-.06*sin(tile.x*6.28318));
  float astroid=pow(abs(w.x)+.001,.68)+pow(abs(w.y)+.001,.68);
  return .5+.5*cos(astroid*88.);
}
float embossFacetPattern(vec2 cardUv) {
  vec2 p=cardUv*vec2(3.,4.18);
  vec2 r=vec2(p.x+p.y,p.y-p.x)*2.2;
  vec2 cell=floor(r);
  vec2 f=fract(r);
  float dir=step(.5,foilHash(cell));
  float coord=mix(f.x,f.y,dir);
  float stripes=.5+.5*cos(coord*25.1327);
  float border=smoothstep(.0,.08,min(min(f.x,1.-f.x),min(f.y,1.-f.y)));
  return stripes*border;
}
const vec2 dir133=vec2(-.6819984,.7313537);
const vec2 dir115=vec2(-.4226183,.9063078);
const vec2 dir35=vec2(.8191520,.5735764);
const vec2 dirNeg35=vec2(.8191520,-.5735764);
vec3 previewFoil(vec2 uv, vec3 normal, vec3 view) {
  vec3 base=previewInk(texture2D(face,uv).rgb);
  if(previewKind<.5) return base;
  if(previewKind==8.) return studioCardGloss(uv,base,normal);
  vec2 cardUv=vec2(uv.x,1.-uv.y);
  vec2 ptr=foilPointer(normal);
  vec2 bg=foilSweepOffset(ptr);
  float rT=foilRadialDistance(cardUv,ptr);
  float spot=1.-smoothstep(.05,.88,rT);
  float innerCore=1.-smoothstep(0.,.38,rT);
  float etched=etchMask(uv);
  float art=artWindow(uv);
  float line=etched*art;
  float stamp=clamp(etched*(1.-art)/.68,0.,1.);
  vec3 lamp=normalize(vec3((ptr-.5)*vec2(1.35,-1.35)+vec2(-.28,.36),1.));

  if(previewKind==9.)return holofoil(uv,base,normal,view,317./4294967295.,holofoilGrainFilter);
  if(previewKind==1.) {
    // Etched gold foil: embossed contour bevels, warm champagne-gold leaf, and micro-sparkle (+10% gold highlight).
    float fineLine=smoothstep(.24,.88,etched)*art;
    vec2 d=vec2(.0015,0.);
    vec2 slopeArt=vec2(contour(uv+d)-contour(uv-d),contour(uv+d.yx)-contour(uv-d.yx));
    vec2 slopeAll=vec2(etchMask(uv+d)-etchMask(uv-d),etchMask(uv+d.yx)-etchMask(uv-d.yx));
    vec2 slope=mix(slopeAll*1.25,slopeArt,art);
    vec3 relief=normalize(vec3(-slope*(.56+1.08*spot)*6.6,1.));
    float shade=max(0.,dot(relief,lamp));
    float spec=max(0.,dot(relief,normalize(lamp+vec3(0.,0.,1.))));
    float s2=spec*spec,s4=s2*s2,s8=s4*s4,s16=s8*s8;
    float ridgeGlint=s16*s16;
    float ridgeEdge=clamp(length(slope)*4.2,0.,1.);

    vec3 goldInk=vec3(.88,.725,.42);
    float textPreserve=1.-smoothstep(.31,.71,inkLuma(base))*.80;
    base=mix(base,blendScreen(base,goldInk*.47),fineLine*.38);
    vec3 stampGold=mix(base+goldInk*.16,blendScreen(base,goldInk*.45),.48);
    base=mix(base,stampGold,stamp*textPreserve*.46);
    base*=1.+(fineLine*.82+stamp*textPreserve*.69)*(shade-.48)*.46;
    base+=vec3(.98,.90,.66)*ridgeGlint*(fineLine*.37+stamp*textPreserve*(.28+ridgeEdge*.47))*spot;

    float d1=fract(dot(cardUv*vec2(.92,1.28),dir133)*2.2+(bg.x+bg.y*.3)*1.25);
    float pillar=smoothstep(.11,.34,d1)*(1.-smoothstep(.38,.61,d1));
    vec3 champagne=mix(vec3(.92,.775,.45),vec3(.99,.935,.76),innerCore*.53+pillar*.47);
    vec3 warmSpectrum=mix(champagne,iridescentBands(cardUv.y*.55-bg.y*.55,2.),.08);

    float glit=microSparkle(cardUv,(ptr-.5)*.02,1.15);
    float geom=embossFacetPattern(cardUv*1.8);
    float stampTex=(.78+.22*geom)*(.31+.69*textPreserve);
    float metalMask=clamp(fineLine*.86+stamp*stampTex*.82,0.,1.);
    float sheenStrength=(.036+pillar*.050)*spot+metalMask*(.17+pillar*.29+spot*.23+ridgeGlint*.31);
    vec3 shine=warmSpectrum*sheenStrength+mix(champagne,vec3(1.),.53)*glit*(.029+.31*metalMask)*(.31+.69*spot);

    vec3 res=foilSheenBlend(base,shine*(1.+satinHoverGain*.30));
    return applyStudioGlare(res,rT,.40);
  }
  if(previewKind==2.) {
    // Prismatic foil: natural mylar rainbow diffraction bands with contour catch.
    float phase1=dot(cardUv-(bg-.5)*1.35,dir115);
    float phase2=dot(cardUv*.78+(bg-.5)*.85,dir35)+.14;
    vec3 rain=mix(pastelSpectrum(phase1),vividSpectrum(phase1+.06),.48);
    vec3 sun=iridescentBands(phase2,3.);
    vec3 rawPrism=mix(rain,sun,.35);
    vec3 prism=mix(vec3(inkLuma(rawPrism)),rawPrism,.84);

    float sweepOffset=(bg.x+bg.y*.25)*1.30;
    float d1=fract(dot(cardUv*vec2(.88,1.22),dir133)*2.15+sweepOffset);
    float d2=fract(dot(cardUv*vec2(1.24,1.72),dir133)*2.15-sweepOffset);
    float pillar1=smoothstep(.11,.34,d1)*(1.-smoothstep(.38,.61,d1));
    float pillar2=smoothstep(.13,.36,d2)*(1.-smoothstep(.40,.63,d2));
    float sheet=(.15+pillar1*.34+pillar2*.19)*(.35+.65*spot)+innerCore*.11;
    float fineLine=smoothstep(.24,.88,etched)*art;
    float frameLines=smoothstep(.74,.96,etched*(1.-art));
    float edgeBoost=1.+clamp(fineLine*.40+frameLines*.54,0.,1.)*.38;

    vec3 shine=prism*sheet*edgeBoost;
    vec3 dodged=foilSheenBlend(base,shine*(1.+satinHoverGain*.32));
    vec3 tinted=mix(dodged,blendOverlay(base,prism),clamp(sheet*.05,0.,.045));
    return applyStudioGlare(tinted,rT,.45);
  }
  if(previewKind==3.) {
    // Cold silver foil: brushed-aluminum grain with twin specular silver beams.
    float fineLine=smoothstep(.33,.90,etched)*art;
    float frameLines=smoothstep(.74,.96,etched*(1.-art));
    float silverMask=clamp(fineLine*.74+frameLines*.87,0.,1.);
    vec3 silverLeaf=mix(vec3(inkLuma(base)),vec3(.87,.91,.96),.38);
    base=mix(base,silverLeaf,silverMask*.205);

    float brushed=.89+.11*sin((cardUv.x*.32+cardUv.y*.95)*380.);
    float bgShift=bg.x+bg.y*.28;
    float d1=fract(dot(cardUv*vec2(.90,1.25),dir133)*2.25+bgShift*1.30);
    float d2=fract(dot(cardUv*vec2(1.28,1.78),dir133)*2.25-bgShift*1.15);
    float pillar1=smoothstep(.12,.33,d1)*(1.-smoothstep(.37,.58,d1));
    float core1=smoothstep(.26,.34,d1)*(1.-smoothstep(.36,.44,d1));
    float pillar2=smoothstep(.16,.36,d2)*(1.-smoothstep(.40,.60,d2));

    vec3 coolSpec=mix(vec3(.815,.89,.965),vec3(.96,.985,1.),core1*.62+innerCore*.38);
    float sheen=((.068+pillar1*.20+pillar2*.105)*spot+silverMask*(.13+pillar1*.30+core1*.20+spot*.205))*brushed;
    vec3 shine=coolSpec*sheen;

    vec3 res=foilSheenBlend(base,shine*(1.+satinHoverGain*.32));
    return applyStudioGlare(res,rT,.42);
  }
  vec2 tilt=(pointer-.5)*2.;
  if(previewKind==4.) {
    // Opal embossed foil: contour relief bevels and mother-of-pearl nacre.
    vec4 facet=opalFacet(uv,tilt,normal,view);
    float stripAxis=satinStripAxis(uv,normal,view);
    float highlight=exp(-(stripAxis*stripAxis)*85.);
    float h=smoothstep(.20,.86,line);
    vec2 d=vec2(.0017,0.);
    vec2 slopeArt=vec2(contour(uv+d)-contour(uv-d),contour(uv+d.yx)-contour(uv-d.yx));
    vec2 slopeAll=vec2(etchMask(uv+d)-etchMask(uv-d),etchMask(uv+d.yx)-etchMask(uv-d.yx));
    vec2 slope=mix(slopeAll*1.25,slopeArt,art);
    float pressure=.48+1.15*spot;
    vec3 relief=normalize(vec3(-slope*pressure*6.8,1.));
    float shade=max(0.,dot(relief,lamp));
    float spec=max(0.,dot(relief,normalize(lamp+vec3(0.,0.,1.))));
    float s2=spec*spec,s4=s2*s2,s8=s4*s4,s16=s8*s8;
    float glint=(s16*s16*spec)*(.35+.65*spot);
    float ridgeEdge=clamp(length(slope)*4.2,0.,1.);

    vec3 pearl1=pastelSpectrum(dot(cardUv*.68+(ptr-.5)*.55,dirNeg35));
    vec3 pearl2=mix(vec3(.58,.94,.79),vec3(.89,.76,.96),.5+.5*sin(dot(cardUv,vec2(2.4,1.8))-(bg.x-bg.y)*3.2));
    vec3 rawNacre=mix(pearl1,pearl2,.52);
    vec3 nacre=mix(vec3(inkLuma(rawNacre)),rawNacre,.82);
    float wave=.77+.23*nacreWavePattern(cardUv)*(.65+.35*etched);

    float textPreserve=1.-smoothstep(.31,.71,inkLuma(base))*.79;
    vec3 opalStampInk=mix(vec3(.48,.82,.68),nacre,.48);
    base=mix(base,blendScreen(base,opalStampInk*.35),stamp*textPreserve*(.40+.19*wave));
    base=base*(1.+(h*.86+stamp*textPreserve*.74)*(shade-.48)*.58)+vec3(.66,.97,.84)*glint*(h*.75+stamp*textPreserve*(.39+ridgeEdge*.54));
    base=mix(base,facet.rgb,facet.a*.85*(.20+.80*clamp(h+stamp*textPreserve,0.,1.)));

    float glit=microSparkle(cardUv,(ptr-.5)*.02,1.10);
    float opalMask=clamp(h*.78+stamp*(.34+.66*textPreserve)*(.68+.27*wave),0.,1.);
    vec3 shine=nacre*wave*((.12+.135*spot)*spot+opalMask*(.20+.30*spot+highlight*.22))
             +mix(nacre,vec3(1.),.60)*glit*(.039+.255*opalMask)*(.32+.68*spot);

    vec3 res=foilSheenBlend(base,shine*(1.+satinHoverGain*.32));
    return applyStudioGlare(res,rT,.47);
  }

${t.liquid ? xe : ""}
  return base;
}`;
}
j();
const ye = `
flat in float rainFogDensity;
void rainCap(vec2 delta,float radius,float stretch,float strength,inout vec4 wet){
 vec2 q=delta/vec2(radius,radius*stretch);
 // Gravity-heavy teardrop profile: slightly narrower crown, fuller lower meniscus.
 q.x*=1.+clamp(q.y,-.45,.45)*.22;
 float q2=dot(q,q);
 if(q2>=1.)return;
 float cap=1.-q2;
 float cover=smoothstep(0.,.22,cap)*strength;
 // Surface-tension meniscus gradient bends the image; do not draw a bright circular outline.
 wet.xy+=q*(.32+.68*sqrt(cap))*cover;
 wet.z=max(wet.z,cover);
}
vec4 rainField(vec2 uv,vec3 normal){
 vec2 metric=vec2(1.,aspect),p=uv*metric*12.,cell=floor(p);
 vec4 wet=vec4(0.);float t=surfaceTime,seed=surfaceInfo.z*83.;
 vec2 beadShear=vec2(normal.x*.26+surfaceInfo.x*.42,normal.y*.10+surfaceInfo.y*.16);
 float streamShear=normal.x*.15+surfaceInfo.x*.22;
 // Fine stationary beads form and evaporate at independent times.
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  vec2 id=cell+vec2(float(x),float(y)),initial=surfaceHash2(id+seed);
  float cycle=9.+initial.y*11.,clock=t+initial.x*cycle,age=mod(clock,cycle);
  vec2 rnd=surfaceHash2(id+seed+floor(clock/cycle)*vec2(17.1,29.3));
  if(rnd.y>=.18){
   float fade=smoothstep(0.,1.,age)*(1.-smoothstep(cycle-2.,cycle,age));
   vec2 delta=p-(id+.18+rnd*.64);
   delta+=delta.y*beadShear;
   float radius=.085+.105*rnd.x*rnd.x;
   rainCap(delta,radius,1.+rnd.y*.22,fade,wet);
  }
 }
 // A sparser population drains down the glass, leaving narrow clear tracks.
 vec4 beads=wet;wet=vec4(0.);
 vec2 moving=uv*metric*7.;
 float column=floor(moving.x);
 for(int x=-1;x<=1;x++){
  float col=column+float(x),speed=.22+.12*surfaceHash(vec2(col,seed));
  vec2 stream=vec2(moving.x,moving.y+t*speed);
  float row=floor(stream.y);
  for(int y=-1;y<=1;y++){
   vec2 id=vec2(col,row+float(y)),rnd=surfaceHash2(id+seed+39.);
   if(rnd.y>=.58){
    vec2 delta=stream-(id+vec2(.2+rnd.x*.6,.2+rnd.y*.6));
    delta.x+=sin(delta.y*3.+rnd.y*6.)*.014+delta.y*streamShear;
    float radius=.075+.035*rnd.x;
    rainCap(delta,radius,1.28,1.,wet);
    float tx=delta.x/(radius*.48);
    float trail=exp(-tx*tx)*smoothstep(0.,.10,delta.y)*(1.-smoothstep(.10,.72,delta.y));
    wet.w=max(wet.w,trail);
   }
  }
 }
 wet.xy+=beads.xy*(1.-wet.w);
 wet.z=clamp(max(wet.z,beads.z*(1.-wet.w)),0.,1.);
 return wet;
}
vec3 rainGlass(vec2 uv,vec3 normal){
 vec4 wet=rainField(uv,normal);
 vec2 bend=-wet.xy*vec2(.020,.020/aspect);
 float clear=clamp(max(wet.z,wet.w*.88),0.,1.);
 float dry=1.-clear;
 // Frosted/fogged glass blurs the card where unwiped; droplets and drainage tracks wipe it crystal-clear.
 vec2 radius=vec2(.0056,.0056/aspect)*dry;
 vec2 baseUv=windowSceneUv(uv,normal)+bend;
 vec4 bounds=surfaceWindow(uv);
 vec3 linearInk=windowInk(baseUv,bounds)*mix(.40,.22,dry*.45);
 linearInk+=(windowInk(baseUv+vec2(radius.x,0.),bounds)+windowInk(baseUv-vec2(radius.x,0.),bounds)
  +windowInk(baseUv+vec2(0.,radius.y),bounds)+windowInk(baseUv-vec2(0.,radius.y),bounds))*.15;
 if(dry>.02){
  vec2 diag=radius*.55;
  linearInk+=(windowInk(baseUv+diag,bounds)+windowInk(baseUv-diag,bounds)
   +windowInk(baseUv+vec2(diag.x,-diag.y),bounds)+windowInk(baseUv+vec2(-diag.x,diag.y),bounds))*(.045*dry);
 }
 vec3 ink=previewInk(linearInk);

 // Physical card response behind the pane: artwork contours & frame lines catch light on tilt.
 vec2 cardUv=vec2(uv.x,1.-uv.y);
 vec2 ptr=foilPointer(normal);
 vec2 bg=foilSweepOffset(ptr);
 float rT=foilRadialDistance(cardUv,ptr);
 float spot=1.-smoothstep(.06,.88,rT);
 vec2 sampleUv=clamp(baseUv,bounds.xy,bounds.zw);
 float etched=etchMask(sampleUv),art=artWindow(sampleUv);
 float cardLines=etched*art+smoothstep(.74,.96,etched*(1.-art));
 float paneSweep=fract(dot(cardUv*vec2(.88,1.22),dir133)*1.65+(bg.x+bg.y*.3)*1.15);
 float paneBand=smoothstep(.10,.36,paneSweep)*(1.-smoothstep(.42,.68,paneSweep));
 vec3 cardSheen=vec3(.78,.90,.99)*cardLines*(.12+.24*spot+.18*paneBand)*(.45+.55*clear);
 ink=foilSheenBlend(ink,cardSheen);

 // Breath/weather condensation mist on unwiped glass: milky contrast softening + forward light scatter.
 float mist=surfaceNoise(uv*vec2(3.0,4.2)+surfaceInfo.z*11.);
 float fineMist=surfaceNoise(uv*vec2(9.5,13.5)-surfaceInfo.z*7.);
 float streak=surfaceNoise(uv*vec2(16.,2.2)+surfaceInfo.z*23.);
 float fog=clamp((.145+.058*mist+.032*fineMist+.025*streak)*dry,0.,.32)*rainFogDensity;
 vec3 mistColor=vec3(.73,.79,.83)+vec3(.11,.12,.13)*(spot*.65+paneBand*.35);
 ink=mix(ink,vec3(inkLuma(ink))*.82+.18,.16*dry*rainFogDensity);
 ink=mix(ink,mistColor,fog);

 // 3D droplet & rivulet optics: translucent water meniscus, lower-belly caustic focus, and sky glints.
 float trailRidge=wet.w*(1.-wet.w)*3.5;
 float rimMag=clamp(length(wet.xy)*1.35,0.,1.);
 vec3 dropNormal=normalize(normal+vec3(wet.xy*1.75+vec2(trailRidge*.16,0.),0.));
 float pinGlint=surfaceReflection(uv,dropNormal,48.)*wet.z;
 float crownGlow=surfaceReflection(uv,dropNormal,12.)*(wet.z*.80+trailRidge*.40);
 float sunDot=dot(wet.xy,vec2(.2614254,-.9652237));
 float bellyCaustic=max(0.,sunDot)*wet.z;
 float upperShade=max(0.,-sunDot)*wet.z*.035;
 float waterRim=rimMag*sqrt(rimMag)*wet.z*(.065+.075*spot);
 float paneReflect=(surfaceReflection(uv,normal,22.)*.024+paneBand*spot*.042)*(1.-wet.z*.35);

 vec3 lit=ink*(1.-upperShade+bellyCaustic*.24)
   +vec3(.82,.91,.99)*(waterRim+bellyCaustic*.075)
   +vec3(.94,.98,1.)*(pinGlint*.40+crownGlow*.16+paneReflect);
 return applyStudioGlare(lit,rT,.28);
}
`, _e = `
vec3 heatMirageInk(vec2 uv,vec2 r,vec4 bounds){
 vec3 c=windowInk(uv,bounds)*.20;
 vec2 r1=r*.65,r2=r*.82;
 c+=(windowInk(uv+vec2(r1.x,0.),bounds)+windowInk(uv-vec2(r1.x,0.),bounds)
  +windowInk(uv+vec2(0.,r1.y),bounds)+windowInk(uv-vec2(0.,r1.y),bounds))*.12;
 c+=(windowInk(uv+vec2(r2.x,r2.y),bounds)+windowInk(uv+vec2(-r2.x,r2.y),bounds)
  +windowInk(uv+vec2(r2.x,-r2.y),bounds)+windowInk(uv+vec2(-r2.x,-r2.y),bounds))*.08;
 return previewInk(c);
}
vec3 heatHaze(vec2 uv,vec3 normal){
 float t=surfaceTime,seed=surfaceInfo.z*29.;
 vec2 lean=normal.xy*.48+surfaceInfo.xy*.75;
 float grazing=1.+min(.65,length(normal.xy)*1.25);

 // Rising buoyant convective plumes + smooth thermal eddies (uv.y increases bottom to top).
 vec2 plumeCoord=vec2(uv.x*2.4-lean.x*uv.y,uv.y*4.2-t*1.10)+vec2(seed,seed*.61);
 float plume=surfaceNoise(plumeCoord);
 vec2 p=uv*vec2(1.8,18.)+vec2(seed-lean.x*1.1,-t*.92-lean.y*1.2);
 float air=surfaceNoise(p),fine=surfaceNoise(p*vec2(1.7,1.6)+vec2(t*.16+(plume-.5)*.8,-t*.68));

 // Schlieren refractive envelope: smooth rising mirage columns alternating with clearer air.
 float shear=abs(air-fine);
 float schlieren=clamp(.36+smoothstep(.20,.82,plume)*.58+shear*.65,0.,1.35)*grazing;
 float ribbon=sin(uv.y*46.-t*3.1+air*4.2+plume*2.8+uv.x*1.6);
 float microRibbon=cos(uv.y*82.-t*4.4+fine*4.5-uv.x*2.1);
 vec2 displacement=vec2(
  (ribbon*.0028+microRibbon*.0009+(fine-.5)*.0036)*schlieren,
  ((air-.5)*.00085+(plume-.5)*.00065)*schlieren
 );
 displacement.x+=normal.x*(air-.5)*.010+surfaceInfo.x*(plume-.5)*.008;
 displacement.y+=normal.y*(plume-.5)*.004;

 vec4 bounds=surfaceWindow(uv);
 float boil=clamp(smoothstep(.14,.80,plume)*.58+smoothstep(.04,.40,shear)*.52,0.,1.2);
 float mirageBlur=clamp((.32+boil*.82)*(.78+.22*(.5+.5*abs(ribbon)))*grazing,0.,1.45);
 vec2 blurRadius=vec2(.0014+.0032*mirageBlur,(.0015+.0036*mirageBlur)/aspect);
 vec3 ink=heatMirageInk(uv+displacement,blurRadius,bounds);

 // Subtle chromatic warmth/shimmer along rising thermal shear lines.
 float causticWave=(ribbon*.7+microRibbon*.3)*schlieren;
 ink=clamp(ink*vec3(1.+.022*causticWave,1.+.005*causticWave,1.-.018*causticWave),0.,1.);

 // Physical card tilt response: warm mirage glare + sunlit ember catch on artwork contours & frame.
 vec2 cardUv=vec2(uv.x,1.-uv.y);
 vec2 ptr=foilPointer(normal);
 vec2 bg=foilSweepOffset(ptr);
 float rT=foilRadialDistance(cardUv,ptr);
 float spot=1.-smoothstep(.06,.88,rT);
 vec2 sampleUv=clamp(uv+displacement*.5,bounds.xy,bounds.zw);
 float etched=etchMask(sampleUv),art=artWindow(sampleUv);
 float cardLines=etched*art+smoothstep(.74,.96,etched*(1.-art));
 float heatSweep=fract(dot(cardUv*vec2(.90,1.25),dir115)*1.75+(bg.x+bg.y*.35)*1.2);
 float mirageBand=smoothstep(.10,.36,heatSweep)*(1.-smoothstep(.42,.68,heatSweep));

 vec3 heatNormal=normalize(normal+vec3(displacement.x*36.,displacement.y*48.,0.));
 float reflection=surfaceReflection(uv+displacement,heatNormal,20.);
 float plumeRidge=smoothstep(.42,.78,plume)*(.5+.5*ribbon);
 float hearthGlow=(1.-smoothstep(0.,.68,uv.y))*(.30+.70*plume)*(.45+.55*spot);
 vec3 emberShine=mix(vec3(1.,.76,.42),vec3(1.,.92,.74),spot*.55+mirageBand*.45)
  *((.035+mirageBand*.068+plumeRidge*.048)*spot+hearthGlow*.045+cardLines*(.13+.25*spot+.16*mirageBand)+reflection*.080);

 vec3 res=foilSheenBlend(ink,emberShine);
 return applyStudioGlare(res,rT,.36);
}
`, ke = `
const float waterPeriod=2.;
const float waterDepth=.65;
vec3 waterField(vec2 p,float t){
 // Non-orthogonal 9-wave quasi-periodic standing/counter-propagating spectrum
 // across varied scales (|w| = 5.1..10.8) so caustics undulate in place like a
 // bounded pool rather than drifting in one direction.
 const vec2 waves[9]=vec2[9](
   vec2(5.,1.),vec2(3.,5.),vec2(-2.,6.),
   vec2(-6.,3.),vec2(-7.,-2.),vec2(-3.,-7.),
   vec2(4.,-7.),vec2(9.,-4.),vec2(6.,9.)
 );
 const float heights[9]=float[9](.00372,.002976,.002604,.002294,.001922,.001798,.00155,.001054,.000868);
 vec3 field=vec3(0.);
 for(int i=0;i<9;i++){
  vec2 k=waves[i]*3.14159265359;float n=float(i);
  float kp=dot(k,p),freq=.42+n*.095;
  float phaseA=kp-t*freq+n*2.39996;
  float phaseB=kp+t*(freq*.86)+n*4.12345;
  float h=heights[i];
  field.xy-=k*(h*(sin(phaseA)+.85*sin(phaseB)));
  field.z+=h*(cos(phaseA)+.85*cos(phaseB));
 }
 return field;
}
`, Te = `
uniform sampler2D caustics;
${ke}
vec3 floorIrradiance(vec2 p){
 // A small receiving footprint softens subpixel ray folds / mesh boundaries,
 // like a light source with finite angular extent instead of an ideal point,
 // and yields the local caustic gradient for prismatic dispersion at zero extra taps.
 vec2 radius=1.25/vec2(textureSize(caustics,0));
 float c0=texture(caustics,p).r;
 float cxP=texture(caustics,p+vec2(radius.x,0.)).r,cxN=texture(caustics,p-vec2(radius.x,0.)).r;
 float cyP=texture(caustics,p+vec2(0.,radius.y)).r,cyN=texture(caustics,p-vec2(0.,radius.y)).r;
 float light=(c0*.4+(cxP+cxN+cyP+cyN)*.15)*8.;
 vec2 grad=vec2(cxP-cxN,cyP-cyN)*8.;
 return vec3(light,grad);
}
// Outward-radiating shallow-water wave train around a connected stroke capsule.
// Leaves calm water behind in the interior as the 2.5-cycle wave packet expands.
vec3 rippleCapsule(vec2 p,vec4 r,inout vec2 drag){
 float age=surfaceTime-r.z;
 if(age<0. || age>2.25 || r.w<=0.)return vec3(0.);
 float code=r.w-1.;
 vec2 seg=(vec2(floor(code)/2047.,fract(code))-.5)*.24;
 vec2 metric=vec2(1.,aspect);
 vec2 aPt=r.xy-seg,s=(seg*2.)*metric,d=(p-aPt)*metric;
 float s2=dot(s,s);
 float h=clamp(dot(d,s)/max(s2,1e-6),0.,1.);
 vec2 delta=d-s*h;
 float r2=dot(delta,delta),eps=.014,rho=sqrt(r2+eps*eps);
 float segLen=sqrt(s2)*.5;
 float localAge=clamp(age+(.5-h)*min(.14,segLen*1.5),0.,2.25);
 float r0=.016+localAge*.23,w=.024+localAge*.009;
 float u=(rho-r0)/w;
 float dragEnv=exp(-r2*312.5-age*7.5);
 drag+=seg*(2.4*dragEnv);
 if(u<-2.8 || u>1.9)return vec3(0.);
 float innerR=max(.014,r0-w*1.85);
 float core=smoothstep(0.,1.,rho/innerR);
 // Both ends radiate: tapering the rear cap erases half of a near-stationary
 // tap as soon as a tiny pointer movement turns it into a short stroke.
 float amp=.85+min(.55,segLen*4.);
 float fade=exp(-localAge*1.05)*inversesqrt(1.+rho*9.)*smoothstep(0.,.02,localAge)*amp;
 float uShift=u+.45;
 float env=core*exp(-.36*uShift*uShift)*fade;
 float phi=3.10*u-.30;
 vec2 slope=-(delta/rho)*sin(phi)*env*.23;
 float curv=cos(phi)*env*.72;
 return vec3(slope,curv);
}
vec3 rippleWake(vec2 p,out vec2 drag){
 drag=vec2(0.);
 return rippleCapsule(p,ripple0,drag)+rippleCapsule(p,ripple1,drag)
  +rippleCapsule(p,ripple2,drag)+rippleCapsule(p,ripple3,drag);
}
const vec2 sunHorizontal=vec2(-.5822871,.8129832);
vec3 poolWater(vec2 uv,vec3 normal){
 vec2 metric=vec2(1.,aspect),slosh=surfaceInfo.xy;
 vec4 bounds=surfaceWindow(uv);
 vec2 extent=max((bounds.zw-bounds.xy)*metric,vec2(.01));
 vec2 basin=clamp((uv-bounds.xy)/(bounds.zw-bounds.xy),0.,1.);
 // The two lowest basin modes pile water against opposite walls and rebound.
 // Slosh is the host-motion-driven damped spring, not a sliding floor texture.
 vec2 phase=basin*3.14159265359;
 float swell=.20*dot(slosh,cos(phase));
 vec2 basinSlope=-.20*3.14159265359*slosh*sin(phase)/extent;
 vec2 origin=vec2(surfaceInfo.z,surfaceInfo.z*.618)*waterPeriod;
 vec2 drift=slosh*.35;
 vec2 p=uv*metric+origin+drift;
 vec3 wave=waterField(p,surfaceTime);
 // Propagate wakes in the flat surface metric. Ambient slopes still add to
 // lighting/refraction below, but must not bend a spreading wave into contours.
 vec2 wakeDrag;
 vec3 rip=rippleWake(uv,wakeDrag);
 vec2 slope=wave.xy+basinSlope+rip.xy;
 slope+=normal.xy*wave.z*3.2;
 // The painted basin floor and its caustics sit recessed below the water surface
 // and move together under tilt, slosh, and pointer-dragged water refraction.
 float wall=min(min(uv.x-bounds.x,bounds.z-uv.x),min(uv.y-bounds.y,bounds.w-uv.y));
 float wallContain=smoothstep(0.,.055,wall);
 vec2 baseUv=mix(uv,windowSceneUv(uv,normal),.72*wallContain);
 vec2 floorShift=((slope+rip.xy*1.20-slosh*.42)*vec2(.040,.040/aspect)*clamp(1.+swell*3.,.6,1.4)-wakeDrag*.28)*wallContain;
 vec2 floorUv=baseUv+floorShift;
 vec2 floorPoint=floorUv*metric+origin+drift*.25-wakeDrag*metric*1.5;
 float breath=surfaceTime*.45;
 vec2 causticWarp=vec2(
  surfaceNoise(floorPoint*1.35+vec2(sin(breath)*.35+1.7,cos(breath*.8)*.35+4.3))-.5,
  surfaceNoise(floorPoint*1.35+vec2(cos(breath*.9)*.35+8.1,sin(breath*.7)*.35+2.9))-.5
 )*.085;
 vec3 caustic=floorIrradiance((floorPoint+causticWarp)/waterPeriod);
 // Combine wake curvature with the sun-projected slope to shift the floor caustic
 // along the sun direction without a second 4-capsule rippleWake evaluation.
 float sunDot=dot(-rip.xy,sunHorizontal);
 float ripCaustic=rip.z*.88+sunDot*1.85;
 float causticFactor=clamp(1.+ripCaustic*1.15,.58,2.25);
 float flux=max(.04,caustic.x*causticFactor+max(0.,ripCaustic)*(.16+.28*caustic.x));
 vec3 ink=windowInk(floorUv,bounds);

 // Subtle prismatic dispersion along bright caustic ridges + local water depth tint.
 float fringe=clamp((caustic.y+caustic.z+ripCaustic*1.15)*.38,-.48,.48);
 vec3 prismTint=vec3(1.+fringe*.16,1.+abs(fringe)*.03,1.-fringe*.16);
 float depth=clamp(.5+swell*1.8+wave.z*14.-ripCaustic*.22,0.,1.);
 vec3 waterTint=mix(vec3(.80,.95,1.),vec3(.72,.91,1.),depth*.45)*prismTint;

 // Physical card details on the basin floor catch focused caustic rays and card tilt.
 vec2 cardUv=vec2(uv.x,1.-uv.y);
 vec2 ptr=foilPointer(normal);
 float rT=foilRadialDistance(cardUv,ptr);
 float spot=1.-smoothstep(.06,.86,rT);
 float tiltMag=clamp(length(normal.xy)*3.2,0.,1.);
 vec2 sampleUv=clamp(floorUv,bounds.xy,bounds.zw);
 float etched=etchMask(sampleUv),art=artWindow(sampleUv);
 float cardLines=etched*art+smoothstep(.74,.96,etched*(1.-art));
 float causticPeak=max(0.,flux-.85);
 vec3 submergedInk=ink+vec3(.62,.93,1.)*cardLines*(causticPeak*.16+tiltMag*spot*.26);

 // Apply irradiance in linear light: divergence dims the floor, focused rays
 // brighten it. Ambient light preserves readability in the darkest troughs.
 float sunSlope=clamp(sunDot*3.4,-.28,.38);
 vec3 floorLight=submergedInk*waterTint*(.28+.72*flux)*(1.+causticPeak*.10)*(1.+sunSlope*.32);

 vec3 waterNormal=normalize(normal+vec3(-slope*(.75+tiltMag*.18)-rip.xy*1.45,0.));
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 float nv=1.-max(0.,dot(view,waterNormal)),nv2=nv*nv;
 float fresnel=.02+.98*(nv2*nv2*nv);
 float reflection=surfaceReflection(uv,waterNormal,48.);
 float sunGlint=surfaceReflection(uv,waterNormal,135.);
 float waveFacet=clamp(dot(-(rip.xy+wave.xy*.35),sunHorizontal)*3.2,0.,1.);
 float wf2=waveFacet*waveFacet;
 float ripSpec=(wf2*waveFacet)*clamp(rip.z*1.35,0.,1.);
 vec3 reflected=vec3(.16,.31,.41)+vec3(.82,.95,1.)*(reflection*1.55+sunGlint*1.25+ripSpec*.85+.20*spot*tiltMag);
 float surfaceMix=clamp(fresnel+ripSpec*.032+tiltMag*spot*.07,0.,.52);
 vec3 combined=previewInk(mix(floorLight,reflected,surfaceMix));
 return applyStudioGlare(combined,rT,tiltMag*.26);
}
`, Re = `
uniform float surfaceTime;
flat in vec4 surfaceInfo;
flat in vec4 ripple0;flat in vec4 ripple1;flat in vec4 ripple2;flat in vec4 ripple3;
float surfaceHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 surfaceHash2(vec2 p){return vec2(surfaceHash(p),surfaceHash(p+vec2(53.7,19.3)));}
float surfaceNoise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(surfaceHash(i),surfaceHash(i+vec2(1.,0.)),f.x),
 mix(surfaceHash(i+vec2(0.,1.)),surfaceHash(i+vec2(1.,1.)),f.x),f.y);
}
vec3 surfaceInk(vec2 uv){return texture(face,clamp(uv,vec2(.002),vec2(.998))).rgb;}
vec3 refractedInk(vec2 uv){return previewInk(surfaceInk(uv));}
// Project the turning pane onto a nearly stationary, front-facing scene.
// Shortest-arc rotation from +Z to the normal, with a restrained perspective
// distance in card widths. The center stays anchored: no uniform image pan.
// This is an approximation for host-owned cameras, not a world-space portal.
vec2 windowSceneUv(vec2 uv,vec3 normal){
 vec2 metric=vec2(1.,aspect),p=(uv-.5)*metric,tilt=vec2(normal.x,-normal.y);
 vec2 projected=p-tilt*dot(tilt,p)/max(.25,1.+normal.z);
 projected/=max(.65,1.+dot(tilt,p)/3.5);
 return .5+mix(p,projected,.9)/metric;
}
// In artwork-only mode, clamp to this art window so moving ink cannot pull the
// printed frame into the illustration. No overscan image or extra texture needed.
vec4 surfaceWindow(vec2 uv){
 if(finishBase<.5)for(int i=0;i<8;i++){
  vec4 b=artBounds[i];
  if(b.z>b.x && b.w>b.y && all(greaterThanEqual(uv,b.xy)) && all(lessThanEqual(uv,b.zw))){
   vec2 inset=min(.5/vec2(textureSize(face,0)),(b.zw-b.xy)*.25);
   return b+vec4(inset,-inset);
  }
 }
 return vec4(.002,.002,.998,.998);
}
vec3 windowInk(vec2 uv,vec4 bounds){return texture(face,clamp(uv,bounds.xy,bounds.zw)).rgb;}
// Small, linear-light cross filter. Radius can be anisotropic; no blur texture.
vec3 softenedInk(vec2 uv,vec2 radius,vec4 bounds){
 vec3 ink=windowInk(uv,bounds)*.4;
 ink+=(windowInk(uv+vec2(radius.x,0.),bounds)+windowInk(uv-vec2(radius.x,0.),bounds))*.15;
 ink+=(windowInk(uv+vec2(0.,radius.y),bounds)+windowInk(uv-vec2(0.,radius.y),bounds))*.15;
 return previewInk(ink);
}
vec3 softenedInk(vec2 uv,vec2 radius){return softenedInk(uv,radius,vec4(.002,.002,.998,.998));}
float surfaceReflection(vec2 uv,vec3 normal,float sharpness){
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 lamp=normalize(vec3(-.24,.32,1.));
 return pow(max(0.,dot(reflect(-view,normal),lamp)),sharpness);
}
${ye}
${_e}
${Te}
vec3 animatedSurface(vec2 uv,vec3 normal){
 if(previewKind==5.)return rainGlass(uv,normal);
 if(previewKind==6.)return heatHaze(uv,normal);
 return poolWater(uv,normal);
}
`, Ie = `
vec2 cardSource(vec2 local,float time,vec2 shape){
 float amount=shape.x,phase=shape.y*6.28318530718;
 if(amount==0.)return local;
 return local+amount*vec2(
  .72*sin(local.y*43.+time*2.1+phase)+.28*sin(local.y*81.-time*3.4+phase*.7),
  .18*sin(local.x*29.-time*1.3+phase));
}
`, Ae = `
float wearHash(vec2 p){return foilHash(p);}
float wearNoise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(wearHash(i),wearHash(i+vec2(1.,0.)),f.x),
 mix(wearHash(i+vec2(0.,1.)),wearHash(i+vec2(1.,1.)),f.x),f.y);
}
// Footprints come from continuous card UVs before clipping. Passing them in
// avoids nested derivatives when filtered noise also warps another octave.
float wearFilteredNoise(vec2 p,float frequency,float pixel){
 return mix(wearNoise(p),.5,smoothstep(.25,.85,pixel*frequency));
}
float wearCut(float lo,float hi,float value,float aa){
 return smoothstep(lo-aa,hi+aa,value);
}
// Jittered, finite scores with independent angles and lengths. No repeated
// parallel hatch field; antialias from continuous coordinates, not cell jumps.
float wearScores(vec2 p, float angle, float seed,vec2 pixel){
 float c=cos(angle),s=sin(angle);
 vec2 q=mat2(c,-s,s,c)*p*13.7+seed;
 vec2 cell=floor(q);
 float h=wearHash(cell);
 vec2 center=.22+.56*vec2(wearHash(cell+19.),wearHash(cell+43.));
 float direction=wearHash(cell+71.)*6.2831853;
 vec2 axis=vec2(cos(direction),sin(direction)),local=fract(q)-center;
 float halfLength=.025+.17*wearHash(cell+113.);
 float distance=length(local-axis*clamp(dot(local,axis),-halfLength,halfLength));
 float aa=max(length(pixel*13.7)*.48,.003);
 float coverage=(1.-smoothstep(.002,.002+aa,distance))*.004/max(.004,aa);
 return coverage*smoothstep(.72,.95,h);
}
vec3 wornSurface(vec2 uv,vec3 ink,vec3 coated,vec3 normal,vec3 view,float seed,float amount,float foil,vec2 pixel){
 vec2 p=uv*vec2(1.,aspect),offset=vec2(seed*37.,seed*19.);
 float footprint=max(pixel.x,pixel.y),alphaAA=clamp(footprint*40.,.012,.22);
 vec2 q=abs((uv-.5)*vec2(1.,aspect))-(vec2(.5,aspect*.5)-cornerRadius);
 float edge=-(length(max(q,0.))+min(max(q.x,q.y),0.)-cornerRadius);
 // Extra abrasion where both edges meet; asymmetric, broad handling patches
 // break up the perimeter instead of drawing an even white outline.
 vec2 toEdge=min(uv,1.-uv)*vec2(1.,aspect);
 float corner=exp(-length(toEdge*vec2(1.,.85))*19.)
   *(.55+.9*wearHash(floor(uv*1.999)+offset));
 float patches=wearFilteredNoise(p*vec2(22.,17.)+offset,22.,footprint);
 // Warp the chip domain before combining incommensurate frequencies. A single
 // rotated lattice otherwise reads as diagonal stair-steps along straight cuts.
 vec2 warp=vec2(wearFilteredNoise(p*9.+offset,9.,footprint),wearFilteredNoise(p*11.-offset,11.,footprint))*2.5;
 vec2 grainP=p*vec2(92.,71.)+offset+warp;
 float chips=wearFilteredNoise(grainP,120.,footprint)*.7+wearFilteredNoise(grainP*1.67+23.,200.,footprint)*.3;
 float micro=wearFilteredNoise(p*vec2(440.,310.)+offset+warp*2.,490.,footprint);
 float grain=clamp((chips*.85+micro*.15-.5)*1.5+.5,0.,1.);
 float fibre=wearFilteredNoise(p*vec2(790.,240.)-offset,790.,footprint);
 float depth=(.0012+.008*patches*patches+corner*(.011+.016*patches))*(.18+.82*amount);
 // The leading edge wears in separate contact patches, not an even rim.
 // Two unrelated scales give intact runs between deep, ragged shuffle nicks.
 float top=smoothstep(.88,.985,uv.y);
 float coast=wearFilteredNoise(vec2(uv.x*6.7,.3)+offset,6.7,footprint);
 float nicks=wearFilteredNoise(vec2(uv.x*29.3,3.1)+offset*1.3,29.3,footprint);
 float contact=smoothstep(.34,.64,coast*.65+nicks*.35+corner*.3);
 float topContact=mix(1.,contact,top);
 depth*=mix(1.,.08+contact*2.4,top);
 float aa=max(length(pixel)*.55,.0006);
 float rim=1.-smoothstep(depth-aa,depth+aa,edge);
 rim*=wearCut(.19,.57,grain+corner*.28,alphaAA)*topContact;
 float fringe=(1.-smoothstep(depth-aa,depth+.019*amount+aa,edge))*wearCut(.61,.79,grain,alphaAA)*topContact;
 float paper=clamp(rim+fringe*.78,0.,1.)*smoothstep(.02,.3,amount);
 // Rubbed islands and pale flecks, concentrated near the shuffled borders.
 float handling=wearFilteredNoise(p*6.+offset,6.,footprint);
 float scuff=smoothstep(.39,.73,handling)*(.35+.65*patches)*amount;
 float nearEdge=exp(-edge*19.);
 float flecks=wearCut(.86-.12*amount,.95-.09*amount,grain,alphaAA)*smoothstep(.46,.68,patches)*amount;
 paper=max(paper,flecks*(.14+nearEdge*.66)*topContact);
 float scratches=wearScores(p,.16,seed*27.,pixel)
   +wearScores(p,-.48,seed*43.+7.,pixel)*.7
   +wearScores(p,1.42,seed*61.+31.,pixel)*.45;
 scratches=clamp(scratches*(.06+scuff+nearEdge*.4)*amount,0.,1.);
 // Subtle play dirt in the rough margin; intact ink keeps its original color.
 ink*=1.-nearEdge*patches*.11*amount;
 vec3 stock=mix(vec3(.64,.60,.51),vec3(.91,.89,.81),.35+.65*fibre);
 float rough=clamp(scuff*.92+scratches*.55,0.,1.);
 // Preserve the selected finish's current gloss/foil response in intact areas.
 // Scuffed varnish loses that sharp reflection rather than adding a new gloss.
 vec3 base=mix(coated,ink,rough*.88);
 float axis=satinStripAxis(uv,normal,view);
 float sharp=exp(-axis*axis*90.);
 float haze=exp(-axis*axis*32.);
 float diffuse=haze*scuff*.045;
 float scoreGlint=scratches*(.015+haze*.12+sharp*.19);
 base+=vec3(1.,.985,.95)*(diffuse+scoreGlint);
 base=mix(base,vec3(.79,.77,.69),scratches*.07);
 // Shallow ink loss reveals reflective metallized film on foil cards. It is
 // strongest along shuffled edges, with a few rubbed islands farther inside.
 float rub=wearCut(.57,.80,grain,alphaAA)*smoothstep(.35,.67,patches);
 float exposed=rub*(nearEdge*.9+scuff*.42)*amount*foil;
 float spot=1.-smoothstep(.05,.88,foilRadialDistance(vec2(uv.x,1.-uv.y),foilPointer(normal)));
 vec3 film=foilSheenBlend(vec3(.48,.50,.53),vec3(.94,.97,1.)*(.08+spot*.23+sharp*.52));
 base=mix(base,film,clamp(exposed,0.,1.));
 // Deep chips remove the film as well: matte fibres cover every reflection.
 return mix(base,stock,paper*.95);
}
`, S = 732, F = 1020, Ee = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`, Se = `#version 300 es
precision highp float;precision highp int;
in vec2 uv;out vec4 color;
float stockNoise(vec2 p){uvec2 q=uvec2(ivec2(p));uint n=q.x*1664525u+q.y*1013904223u+2246822519u;n^=n>>16;n*=2246822519u;n^=n>>13;return float(n)/4294967295.;}
vec2 relief(vec2 p){
 vec2 i=floor(p),f=fract(p),s=f*f*(3.-2.*f),ds=6.*f*(1.-f);
 float a=stockNoise(i),b=stockNoise(i+vec2(1,0)),c=stockNoise(i+vec2(0,1)),d=stockNoise(i+1.);
 return vec2(mix(b-a,d-c,s.y)*ds.x,mix(c-a,d-b,s.x)*ds.y);
}
void main(){
 mat2 rotation=mat2(.83,.55776,-.55776,.83);
 vec2 p=rotation*(uv*vec2(732.,1020.));
 vec2 slope=transpose(rotation)*(relief(p/2.4)*.82+relief(p/6.7+19.3)*.18);
 // Two 16-bit slopes in a portable RGBA8 target. Decoding is affine, so
 // interpolation and mip averaging remain valid across byte boundaries.
 vec2 encoded=floor(clamp(slope/4.4+.5,0.,1.)*65535.+.5);
 vec2 high=floor(encoded/256.);
 color=vec4(high.x,encoded.x-high.x*256.,high.y,encoded.y-high.y*256.)/255.;
}`;
class Me {
  constructor(e) {
    this.gl = e, this.shader = V(e, Se, Ee);
  }
  gl;
  width = S;
  height = F;
  map;
  bytes = 0;
  passes = 0;
  shader;
  prepare() {
    if (this.map) return;
    const e = this.gl, i = U(e, S, F, e.RGBA8, e.RGBA), a = e.createFramebuffer(), o = e.createVertexArray();
    try {
      if (e.bindFramebuffer(e.FRAMEBUFFER, a), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, i, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
        throw Error("Cardstock framebuffer is incomplete");
      e.viewport(0, 0, S, F), e.disable(e.DEPTH_TEST), e.disable(e.CULL_FACE), e.disable(e.SCISSOR_TEST), e.disable(e.BLEND), e.disable(e.DITHER), e.colorMask(!0, !0, !0, !0), e.useProgram(this.shader), e.bindVertexArray(o), e.drawArrays(e.TRIANGLES, 0, 3), e.bindTexture(e.TEXTURE_2D, i), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR_MIPMAP_LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.generateMipmap(e.TEXTURE_2D);
      let c = S, r = F;
      for (; this.bytes += c * r * 4, !(c === 1 && r === 1); )
        c = Math.max(1, Math.floor(c / 2)), r = Math.max(1, Math.floor(r / 2));
      this.map = i, this.passes++;
    } catch (c) {
      throw e.deleteTexture(i), c;
    } finally {
      e.bindFramebuffer(e.FRAMEBUFFER, null), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.bindVertexArray(null), e.deleteFramebuffer(a), e.deleteVertexArray(o);
    }
  }
  dispose() {
    this.gl.deleteTexture(this.map ?? null), this.gl.deleteProgram(this.shader);
  }
}
const Fe = `
uniform sampler2D cardstockMap;
flat in float cardstockAmount;
float cardstockResponse(vec2 uv){
 if(cardstockAmount<=0.)return 1.;
 vec4 encoded=texture(cardstockMap,uv);
 vec2 slope=(vec2(dot(encoded.rg,vec2(256.,1.)),dot(encoded.ba,vec2(256.,1.)))/257.-.5)*4.4;
 vec2 direction=vec2(.65,.76)+(vec2(pointer.x,1.-pointer.y)-.5)*1.6;
 vec2 light=direction/max(length(direction),.1);
 return max(0.,1.+cardstockAmount*2.38*dot(slope,light));
}
vec3 cardstockGloss(vec2 uv,vec3 ink,vec3 reflected){
 if(cardstockAmount<=0.)return reflected;
 // Relief redistributes the finish response without reducing its overall gain.
 return ink+(reflected-ink)*cardstockResponse(uv);
}`, De = `
flat in vec4 printDotsInfo;
float printFootprint;
// Optional host contract. Without these defines the public shader is unchanged.
#ifdef PRINT_DOT_ART_WINDOWS
uniform vec4 printArtBounds[8];
#ifdef PRINT_DOT_ART_INSTANCE
flat in float printArtwork;
#else
uniform float printArtwork;
#endif
float printArea(vec2 uv){
 if(printArtwork>.5)return 1.;
 for(int i=0;i<8;i++){
  vec4 b=printArtBounds[i];
  if(b.z>b.x && b.w>b.y && all(greaterThanEqual(uv,b.xy)) && all(lessThanEqual(uv,b.zw)))return 0.;
 }
 return 1.;
}
#endif
float plateNoise(vec2 cell,float channel){return fract(sin(dot(cell,vec2(127.1,311.7))+channel*74.7)*43758.5453);}
float plateDot(vec2 cell,vec2 id,float radius,bool holes,float channel,float aa,float reach){
 // Reject distant neighbors before hashing; only nearby impressions can touch.
 if(any(greaterThan(abs(cell),vec2(reach))))return 0.;
 if(printDotsInfo.z>0.){
  float a=plateNoise(id,channel),b=plateNoise(id,channel+1.),c=plateNoise(id,channel+2.);
  // Stable impression irregularity. Neighboring dots stay on their plate's
  // screen, with subpixel registration shifts, ellipticity and uneven ink gain.
  cell-=(vec2(a,b)-.5)*.5*printDotsInfo.z;
  cell*=vec2(1.+(b-.5)*.3*printDotsInfo.z,1.-(b-.5)*.3*printDotsInfo.z);
  radius*=1.+(c-.5)*.36*printDotsInfo.z;
  radius*=holes?1.-.12*printDotsInfo.z:1.+.12*printDotsInfo.z;
 }
 return 1.-smoothstep(radius-aa,radius+aa,length(cell));
}
float inkScreen(vec2 p,float ink,vec2 axis,float channel){
 if(ink<=0.)return 0.;if(ink>=1.)return 1.;
 vec2 q=mat2(axis.x,axis.y,-axis.y,axis.x)*p;
 bool holes=ink>.5;
 vec2 point=q+(holes?.5:0.),id=floor(point),cell=fract(point)-.5;
 float radius=sqrt(min(ink,1.-ink)/3.14159265),aa=max(.015,printFootprint*.4);
 float variation=printDotsInfo.z;
 float reach=(radius*(1.+.18*variation)*(holes?1.-.12*variation:1.+.12*variation)+aa)/(1.-.15*variation)+.25*variation;
 float dotInk=plateDot(cell,id,radius,holes,channel,aa,reach);
 // Varied dots can cross cell borders. Union neighboring impressions instead
 // of clipping each dot to its square cell, including reversed (hole) screens.
 if(variation>0.)for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  if(x==0&&y==0)continue;
  vec2 offset=vec2(float(x),float(y));
  dotInk=max(dotInk,plateDot(cell-offset,id+offset,radius,holes,channel,aa,reach));
 }
 return holes?1.-dotInk:dotInk;
}
vec3 printDotInk(vec3 ink,vec2 uv){
 if(printDotsInfo.x<=0.)return ink;
 float visible=1.-smoothstep(.35,.9,printFootprint);
#ifdef PRINT_DOT_ART_WINDOWS
 visible*=printArea(uv);
#endif
 if(printDotsInfo.w>0.){
  vec2 edge=min(uv,1.-uv);float aspect=float(textureSize(face,0).y)/float(textureSize(face,0).x);
  visible*=smoothstep(printDotsInfo.w*.85,printDotsInfo.w*1.15,min(edge.x,edge.y*aspect));
 }
 if(visible<=0.)return ink;
 vec2 p=vec2(uv.x,1.-uv.y)*vec2(textureSize(face,0))/printDotsInfo.y;
 float k=1.-max(max(ink.r,ink.g),ink.b);
 vec3 cmy=clamp((1.-ink-k)/max(1.-k,.0001),0.,1.);
 vec3 plates=vec3(inkScreen(p,cmy.x,vec2(-.258819,.965926),1.),inkScreen(p,cmy.y,vec2(.258819,.965926),5.),inkScreen(p,cmy.z,vec2(0.,1.),9.));
 float black=inkScreen(p,k,vec2(.707107),13.);
 vec3 screened=(1.-plates)*(1.-black);
 return mix(ink,screened,printDotsInfo.x*visible);
}
vec4 printFace(vec2 uv){
 vec4 source=texture(face,uv);
 if(printDotsInfo.x<=0.)return source;
 return vec4(previewLinear(printDotInk(previewInk(source.rgb),uv)),source.a);
}`, Ce = `#version 300 es
layout(location=0) in vec2 position;
layout(location=1) in mat4 model;
layout(location=5) in vec3 instanceNormal;
layout(location=6) in float instanceFinish;
layout(location=7) in vec4 instanceSurface;
layout(location=8) in vec4 instanceRipple0;layout(location=9) in vec4 instanceRipple1;
layout(location=10) in vec4 instanceRipple2;layout(location=11) in vec4 instanceRipple3;
layout(location=12) in vec2 instanceWear;
layout(location=13) in float instanceCardstock;
flat out float cardstockAmount;
layout(location=14) in vec4 instancePrintDots;
flat out vec4 printDotsInfo;
layout(location=15) in vec2 instanceRainFog;
flat out float printArtwork;
flat out float rainFogDensity;
uniform mat4 viewProjection;
out vec2 v_uv;out vec3 v_normal;flat out float previewKind;flat out vec2 wearInfo;
out vec3 studioPosition;flat out vec4 studioCamera;flat out float studioVirtual;
flat out vec4 surfaceInfo;flat out vec4 ripple0;flat out vec4 ripple1;flat out vec4 ripple2;flat out vec4 ripple3;
void main(){
vec2 pad=instanceSurface.w*vec2(1.,.18);
vec2 local=position*(1.+2.*pad)-pad;
v_uv=local;v_normal=instanceNormal;previewKind=instanceFinish;wearInfo=instanceWear;
cardstockAmount=instanceCardstock;printDotsInfo=instancePrintDots;
rainFogDensity=instanceRainFog.x;printArtwork=instanceRainFog.y;
surfaceInfo=instanceSurface;ripple0=instanceRipple0;ripple1=instanceRipple1;ripple2=instanceRipple2;ripple3=instanceRipple3;
vec4 world=model*vec4(local,0.,1.);
studioPosition=world.xyz/world.w;
studioVirtual=viewProjection==mat4(1.)?1.:0.;
vec4 eye=inverse(viewProjection)*vec4(0.,0.,1.,0.);
studioCamera=abs(eye.w)>.00001?vec4(eye.xyz/eye.w,1.):vec4(normalize(eye.xyz),0.);
gl_Position=viewProjection*world;}`, Ue = j().replace("uniform float previewKind;", "flat in float previewKind;").replaceAll("texture2D(mask,uv).r*hasMask", "edgeCoverage(uv)").replaceAll("texture2D(face,", "printFace("), $ = `#version 300 es
precision highp float;
in vec2 v_uv;in vec3 v_normal;flat in vec2 wearInfo;
in vec3 studioPosition;flat in vec4 studioCamera;flat in float studioVirtual;
uniform sampler2D face;uniform sampler2D mask;uniform sampler2D overlay;uniform sampler2D coverage;
uniform vec2 overlayFoil;
uniform vec2 pointer;uniform vec4 artBounds[8];
uniform float hasMask;uniform float cornerRadius;uniform float aspect;uniform float finishBase;
out vec4 out_color;
#define texture2D texture
float edgeCoverage(vec2 uv){vec4 c=texture(coverage,uv);return max(texture(mask,uv).r*hasMask,c.b)*(1.-c.a);}
vec4 printFace(vec2 uv);
${Fe}
${Ue}
#ifdef PROCEDURAL_PRINT
#define PRINT_DOT_ART_WINDOWS
#define PRINT_DOT_ART_INSTANCE
${De}
#else
vec4 printFace(vec2 uv){return texture(face,uv);}
#endif
${Re.replaceAll("texture(face,", "printFace(")}
${Ie}
${Ae}
#ifdef LOCAL_HOLOGRAM
${ge}
#endif
void main(){
 vec2 source=cardSource(v_uv,surfaceTime,surfaceInfo.wz);
 vec2 uv=vec2(source.x,1.-source.y);
#ifdef PROCEDURAL_PRINT
 printFootprint=max(length(dFdx(uv*vec2(textureSize(face,0)))),length(dFdy(uv*vec2(textureSize(face,0)))))/max(printDotsInfo.y,2.);
#endif
#ifdef LOCAL_HOLOGRAM
 // Evaluate derivatives before any per-fragment return/discard. The outer
 // material condition is uniform across the draw, including instanced cards.
 float grainFilter=1.;
 if(hologramMaterial.x>0.) {
   vec2 local=(uv-hologramRect.xy)/hologramRect.zw;
   grainFilter=exp(-fwidth(dot(local,vec2(24.,8.)))*2.);
 }
#endif
 // Filter the sheet grooves before silhouette rejection, like local patches.
 if(previewKind==9.)holofoilGrainFilter=exp(-fwidth(dot(uv,vec2(24.,8.)))*2.);
 // Derive wear filtering from continuous UVs before silhouette rejection.
 vec2 wearPixel=vec2(0.);
 if(wearInfo.x>0.)wearPixel=fwidth(uv*vec2(1.,aspect));
 vec2 corner=abs((uv-.5)*vec2(1.,aspect))-(vec2(.5,aspect*.5)-cornerRadius);
 if(length(max(corner,0.))+min(max(corner.x,corner.y),0.)-cornerRadius>0.)discard;
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 optical;
 if(previewKind==8. && studioVirtual<.5)optical=studioGloss(previewInk(printFace(uv).rgb),normalize(v_normal),normalize(studioCamera.xyz-studioPosition*studioCamera.w),studioPosition);
 else optical=previewKind>=5. && previewKind<8. ? animatedSurface(uv,normalize(v_normal)) : previewFoil(uv,normalize(v_normal),view);
 vec3 shaded=previewLinear(optical);
 vec3 base=printFace(uv).rgb;
 if(cardstockAmount>0. && previewKind>.5)shaded=previewLinear(cardstockGloss(uv,previewInk(base),previewInk(shaded)));
 if(wearInfo.x>0.) {
   float foilSubstrate=max(step(.5,previewKind)*(1.-step(4.5,previewKind)),step(8.5,previewKind));
   shaded=previewLinear(wornSurface(uv,previewInk(base),previewInk(shaded),normalize(v_normal),view,wearInfo.y,wearInfo.x,foilSubstrate,wearPixel));
 }
 vec4 c=texture(coverage,uv),top=texture(overlay,uv);
 vec3 under=mix(base,shaded,max(finishBase,c.r)*(1.-c.g));
 // Printing stays at the original UV, above all optical effects. The same
 // satin response as the conventional finishes supplies an optional reflection.
 vec3 printing=top.rgb;
#ifdef PROCEDURAL_PRINT
 if(printDotsInfo.x>0.)printing=previewLinear(printDotInk(previewInk(top.rgb),uv));
#endif
 if(overlayFoil.y>0. && top.a>0.) {
   // Gold printing is metallic even without an etch mask. The zero-metal
   // satin branch deliberately mutes its strip and made this foil nearly flat.
   float metal=overlayFoil.x==1. ? .35 : 0.;
   vec3 reflected=previewLinear(satin(uv,previewInk(printing),normalize(v_normal),view,overlayFoil.x,metal));
   printing=mix(printing,reflected,overlayFoil.y);
 }
 vec3 printed=previewInk(mix(under,printing,top.a));
#ifdef LOCAL_HOLOGRAM
 out_color=vec4(localHologram(uv,printed,normalize(v_normal),view,grainFilter),1.);
#else
 out_color=vec4(printed,1.);
#endif
}`, ze = $.replace(
  "#version 300 es",
  `#version 300 es
#define LOCAL_HOLOGRAM`
), Ge = $.replace(
  "#version 300 es",
  `#version 300 es
#define PROCEDURAL_PRINT`
), Be = ze.replace(
  "#version 300 es",
  `#version 300 es
#define PROCEDURAL_PRINT`
), Oe = `#version 300 es
precision highp float;in vec2 v_uv;uniform sampler2D face;out vec4 out_color;
void main(){out_color=texture(face,vec2(v_uv.x,1.-v_uv.y));if(out_color.a<.001)discard;}`;
export {
  Me as C,
  we as F,
  Ne as G,
  De as P,
  B as R,
  Re as S,
  Ae as W,
  Pe as _,
  Fe as a,
  ke as b,
  $ as c,
  Ge as d,
  Be as e,
  j as f,
  G as g,
  ze as h,
  Oe as i,
  Le as j,
  O as k,
  V as p,
  U as t,
  Ce as v
};
