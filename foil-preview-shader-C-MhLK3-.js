const H = "renderer_bg.wasm";
class z {
  __destroy_into_raw() {
    const t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, R.unregister(this), t;
  }
  free() {
    const t = this.__destroy_into_raw();
    r.__wbg_pixelkernels_free(t, 0);
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
  etch(t, i, a, n) {
    try {
      const p = r.__wbindgen_add_to_stack_pointer(-16), m = Z(a, r.__wbindgen_export), u = f;
      r.pixelkernels_etch(p, this.__wbg_ptr, t, i, m, u, n);
      var l = s().getInt32(p + 0, !0), o = s().getInt32(p + 4, !0), c = s().getInt32(p + 8, !0), v = s().getInt32(p + 12, !0);
      if (v)
        throw h(c);
      var d = j(l, o).slice();
      return r.__wbindgen_export2(l, o * 1, 1), d;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  constructor() {
    const t = r.pixelkernels_new();
    return this.__wbg_ptr = t, R.register(this, this.__wbg_ptr, this), this;
  }
}
Symbol.dispose && (z.prototype[Symbol.dispose] = z.prototype.free);
class F {
  __destroy_into_raw() {
    const t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, D.unregister(this), t;
  }
  free() {
    const t = this.__destroy_into_raw();
    r.__wbg_resourcecache_free(t, 0);
  }
  /**
   * # Errors
   * Refuses admission beyond the budget or exhausted handles.
   * @param {string} key
   * @param {number} bytes
   * @param {number} priority
   * @returns {string}
   */
  admit(t, i, a) {
    let n, l;
    try {
      const u = r.__wbindgen_add_to_stack_pointer(-16), A = O(t, r.__wbindgen_export, r.__wbindgen_export3), C = f;
      r.resourcecache_admit(u, this.__wbg_ptr, A, C, i, a);
      var o = s().getInt32(u + 0, !0), c = s().getInt32(u + 4, !0), v = s().getInt32(u + 8, !0), d = s().getInt32(u + 12, !0), p = o, m = c;
      if (d)
        throw p = 0, m = 0, h(v);
      return n = p, l = m, N(p, m);
    } finally {
      r.__wbindgen_add_to_stack_pointer(16), r.__wbindgen_export2(n, l, 1);
    }
  }
  /**
   * @returns {Uint32Array}
   */
  clear() {
    try {
      const n = r.__wbindgen_add_to_stack_pointer(-16);
      r.resourcecache_clear(n, this.__wbg_ptr);
      var t = s().getInt32(n + 0, !0), i = s().getInt32(n + 4, !0), a = S(t, i).slice();
      return r.__wbindgen_export2(t, i * 4, 4), a;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} key
   * @returns {number | undefined}
   */
  lookup(t) {
    const i = O(t, r.__wbindgen_export, r.__wbindgen_export3), a = f, n = r.resourcecache_lookup(this.__wbg_ptr, i, a);
    return n === Number.MAX_SAFE_INTEGER ? void 0 : n;
  }
  /**
   * @param {number} bytes
   */
  constructor(t) {
    const i = r.resourcecache_new(t);
    return this.__wbg_ptr = i, D.register(this, this.__wbg_ptr, this), this;
  }
  /**
   * # Errors
   * Refuses invalid handles and unbalanced leases.
   * @param {number} id
   * @param {boolean} acquire
   */
  pin(t, i) {
    try {
      const l = r.__wbindgen_add_to_stack_pointer(-16);
      r.resourcecache_pin(l, this.__wbg_ptr, t, i);
      var a = s().getInt32(l + 0, !0), n = s().getInt32(l + 4, !0);
      if (n)
        throw h(a);
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} id
   * @returns {boolean}
   */
  remove(t) {
    return r.resourcecache_remove(this.__wbg_ptr, t) !== 0;
  }
  /**
   * # Errors
   * Reports serialization failures.
   * @returns {string}
   */
  stats() {
    let t, i;
    try {
      const d = r.__wbindgen_add_to_stack_pointer(-16);
      r.resourcecache_stats(d, this.__wbg_ptr);
      var a = s().getInt32(d + 0, !0), n = s().getInt32(d + 4, !0), l = s().getInt32(d + 8, !0), o = s().getInt32(d + 12, !0), c = a, v = n;
      if (o)
        throw c = 0, v = 0, h(l);
      return t = c, i = v, N(c, v);
    } finally {
      r.__wbindgen_add_to_stack_pointer(16), r.__wbindgen_export2(t, i, 1);
    }
  }
}
Symbol.dispose && (F.prototype[Symbol.dispose] = F.prototype.free);
class M {
  __destroy_into_raw() {
    const t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, E.unregister(this), t;
  }
  free() {
    const t = this.__destroy_into_raw();
    r.__wbg_scenecore_free(t, 0);
  }
  /**
   * @param {number} x
   * @param {number} y
   * @returns {Float64Array}
   */
  hit(t, i) {
    try {
      const o = r.__wbindgen_add_to_stack_pointer(-16);
      r.scenecore_hit(o, this.__wbg_ptr, t, i);
      var a = s().getInt32(o + 0, !0), n = s().getInt32(o + 4, !0), l = q(a, n).slice();
      return r.__wbindgen_export2(a, n * 8, 8), l;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
  constructor() {
    const t = r.scenecore_new();
    return this.__wbg_ptr = t, E.register(this, this.__wbg_ptr, this), this;
  }
  /**
   * # Errors
   * Refuses malformed or non-finite camera data.
   * @param {Float32Array} camera
   * @returns {Uint32Array}
   */
  plan(t) {
    try {
      const c = r.__wbindgen_add_to_stack_pointer(-16), v = T(t, r.__wbindgen_export), d = f;
      r.scenecore_plan(c, this.__wbg_ptr, v, d);
      var i = s().getInt32(c + 0, !0), a = s().getInt32(c + 4, !0), n = s().getInt32(c + 8, !0), l = s().getInt32(c + 12, !0);
      if (l)
        throw h(n);
      var o = S(i, a).slice();
      return r.__wbindgen_export2(i, a * 4, 4), o;
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
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
  plan_shaped(t, i, a) {
    try {
      const d = r.__wbindgen_add_to_stack_pointer(-16), p = T(t, r.__wbindgen_export), m = f, u = T(i, r.__wbindgen_export), A = f;
      r.scenecore_plan_shaped(d, this.__wbg_ptr, p, m, u, A, a);
      var n = s().getInt32(d + 0, !0), l = s().getInt32(d + 4, !0), o = s().getInt32(d + 8, !0), c = s().getInt32(d + 12, !0);
      if (c)
        throw h(o);
      var v = S(n, l).slice();
      return r.__wbindgen_export2(n, l * 4, 4), v;
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
  update(t, i, a) {
    try {
      const o = r.__wbindgen_add_to_stack_pointer(-16), c = B(t, r.__wbindgen_export), v = f, d = T(i, r.__wbindgen_export), p = f, m = B(a, r.__wbindgen_export), u = f;
      r.scenecore_update(o, this.__wbg_ptr, c, v, d, p, m, u);
      var n = s().getInt32(o + 0, !0), l = s().getInt32(o + 4, !0);
      if (l)
        throw h(n);
    } finally {
      r.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
Symbol.dispose && (M.prototype[Symbol.dispose] = M.prototype.free);
function le(e) {
  try {
    const o = r.__wbindgen_add_to_stack_pointer(-16), c = O(e, r.__wbindgen_export, r.__wbindgen_export3), v = f;
    r.validate_layers(o, c, v);
    var t = s().getInt32(o + 0, !0), i = s().getInt32(o + 4, !0), a = s().getInt32(o + 8, !0), n = s().getInt32(o + 12, !0);
    if (n)
      throw h(a);
    var l = S(t, i).slice();
    return r.__wbindgen_export2(t, i * 4, 4), l;
  } finally {
    r.__wbindgen_add_to_stack_pointer(16);
  }
}
function W() {
  return {
    __proto__: null,
    "./renderer_bg.js": {
      __proto__: null,
      __wbg___wbindgen_throw_bb96b2010945f0bc: function(t, i) {
        throw new Error(N(t, i));
      },
      __wbindgen_cast_0000000000000001: function(t, i) {
        const a = N(t, i);
        return K(a);
      }
    }
  };
}
const R = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e) => r.__wbg_pixelkernels_free(e, 1)), D = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e) => r.__wbg_resourcecache_free(e, 1)), E = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e) => r.__wbg_scenecore_free(e, 1));
function K(e) {
  L === _.length && _.push(_.length + 1);
  const t = L;
  return L = _[t], _[t] = e, t;
}
function $(e) {
  e < 1028 || (_[e] = L, L = e);
}
function q(e, t) {
  return e = e >>> 0, Q().subarray(e / 8, e / 8 + t);
}
function S(e, t) {
  return e = e >>> 0, U().subarray(e / 4, e / 4 + t);
}
function j(e, t) {
  return e = e >>> 0, b().subarray(e / 1, e / 1 + t);
}
let g = null;
function s() {
  return (g === null || g.buffer.detached === !0 || g.buffer.detached === void 0 && g.buffer !== r.memory.buffer) && (g = new DataView(r.memory.buffer)), g;
}
let x = null;
function V() {
  return (x === null || x.byteLength === 0) && (x = new Float32Array(r.memory.buffer)), x;
}
let w = null;
function Q() {
  return (w === null || w.byteLength === 0) && (w = new Float64Array(r.memory.buffer)), w;
}
function N(e, t) {
  return Y(e >>> 0, t);
}
let y = null;
function U() {
  return (y === null || y.byteLength === 0) && (y = new Uint32Array(r.memory.buffer)), y;
}
let I = null;
function b() {
  return (I === null || I.byteLength === 0) && (I = new Uint8Array(r.memory.buffer)), I;
}
function X(e) {
  return _[e];
}
let _ = new Array(1024).fill(void 0);
_.push(void 0, null, !0, !1);
let L = _.length;
function B(e, t) {
  const i = t(e.length * 4, 4) >>> 0;
  return U().set(e, i / 4), f = e.length, i;
}
function Z(e, t) {
  const i = t(e.length * 1, 1) >>> 0;
  return b().set(e, i / 1), f = e.length, i;
}
function T(e, t) {
  const i = t(e.length * 4, 4) >>> 0;
  return V().set(e, i / 4), f = e.length, i;
}
function O(e, t, i) {
  if (i === void 0) {
    const c = G.encode(e), v = t(c.length, 1) >>> 0;
    return b().subarray(v, v + c.length).set(c), f = c.length, v;
  }
  let a = e.length, n = t(a, 1) >>> 0;
  const l = b();
  let o = 0;
  for (; o < a; o++) {
    const c = e.charCodeAt(o);
    if (c > 127) break;
    l[n + o] = c;
  }
  if (o !== a) {
    o !== 0 && (e = e.slice(o)), n = i(n, a, a = o + e.length * 3, 1) >>> 0;
    const c = b().subarray(n + o, n + a), v = G.encodeInto(e, c);
    o += v.written, n = i(n, a, o, 1) >>> 0;
  }
  return f = o, n;
}
function h(e) {
  const t = X(e);
  return $(e), t;
}
let k = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 });
k.decode();
const J = 2146435072;
let P = 0;
function Y(e, t) {
  return P += t, P >= J && (k = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 }), k.decode(), P = t), k.decode(b().subarray(e, e + t));
}
const G = new TextEncoder();
"encodeInto" in G || (G.encodeInto = function(e, t) {
  const i = G.encode(e);
  return t.set(i), {
    read: e.length,
    written: i.length
  };
});
let f = 0, r;
function ee(e, t) {
  return r = e.exports, g = null, x = null, w = null, y = null, I = null, r;
}
async function te(e, t) {
  if (typeof Response == "function" && e instanceof Response) {
    if (!e.ok)
      throw new Error(`failed to fetch Wasm: ${e.status} ${e.statusText} fetching '${e.url}'`);
    if (typeof WebAssembly.instantiateStreaming == "function")
      try {
        return await WebAssembly.instantiateStreaming(e, t);
      } catch (n) {
        if (i(e.type) && e.headers.get("Content-Type") !== "application/wasm")
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", n);
        else
          throw n;
      }
    const a = await e.arrayBuffer();
    return await WebAssembly.instantiate(a, t);
  } else {
    const a = await WebAssembly.instantiate(e, t);
    return a instanceof WebAssembly.Instance ? { instance: a, module: e } : a;
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
async function ve(e) {
  if (r !== void 0) return r;
  e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? { module_or_path: e } = e : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), e === void 0 && (e = new URL(
    /* @vite-ignore */
    H,
    import.meta.url
  ));
  const t = W();
  (typeof e == "string" || typeof Request == "function" && e instanceof Request || typeof URL == "function" && e instanceof URL) && (e = fetch(e));
  const { instance: i, module: a } = await te(await e, t);
  return ee(i);
}
const re = `
float holofoilGrainFilter=1.;
vec3 holofoil(vec2 p,vec3 ink,vec3 normal,vec3 view,float seed,float grainFilter){
  vec3 reflected=reflect(-view,normal);
  vec2 light=reflected.xy/max(abs(reflected.z),.25)+(GLINT_LIGHTING_POINTER-.5)*.85;
  if(studioLighting>.5)light=reflected.xy/max(abs(reflected.z),.25)-studioLampPosition.xy/studioLampPosition.z;
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
`, de = `
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
`, ie = `
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
    base=previewInk(GLINT_FOIL_FACE(uv+shift).rgb);
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
`, ae = `
#ifndef GLINT_STUDIO_LIGHTING_UNIFORM
#define GLINT_STUDIO_LIGHTING_UNIFORM
uniform float studioLighting;
#endif
#ifndef GLINT_LIGHTING_POINTER
#define GLINT_LIGHTING_POINTER (studioLighting>.5?vec2(.5):pointer)
#endif
const vec3 studioLampPosition=vec3(-.85,1.10,3.);
const vec3 studioEyePosition=vec3(0.,0.,2.1);
void studioCardBasis(vec3 normal,out vec3 right,out vec3 up){
 vec3 n=normalize(normal);
 float cy=max(length(n.yz),.0001),sx=-n.y/cy,cx=n.z/cy;
 right=vec3(cy,sx*n.x,-cx*n.x);up=vec3(0.,cx,sx);
}
vec3 studioCardPosition(vec2 uv,vec3 normal){
 vec3 right,up;studioCardBasis(normal,right,up);
 return right*((uv.x-.5)/aspect)+up*(uv.y-.5);
}
vec3 studioCardView(vec2 uv,vec3 normal){
 return normalize(studioEyePosition-studioCardPosition(uv,normal));
}
vec3 studioDetailNormal(vec3 detail,vec3 normal){
 vec3 right,up;studioCardBasis(normal,right,up);
 return normalize(right*detail.x+up*detail.y+normalize(normal)*detail.z);
}
// Mirror the fixed lamp through the card plane, then intersect the eye-to-image
// ray with that plane. Keep the source outside the card when it leaves the face.
vec2 studioFoilCenter(vec3 normal){
 vec3 n=normalize(normal),right,up;studioCardBasis(n,right,up);
 vec3 image=studioLampPosition-2.*n*dot(studioLampPosition,n);
 vec3 ray=image-studioEyePosition;
 float denominator=dot(n,ray);
 if(denominator>=-.0001)return vec2(4.);
 vec3 hit=studioEyePosition-ray*(dot(n,studioEyePosition)/denominator);
 return vec2(.5+dot(hit,right)*aspect,.5-dot(hit,up));
}
`, ne = `${ae}
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
  if(studioLighting>.5)return studioFoilCenter(normal);
  vec2 delta = vec2(normal.x * 2.63, normal.y * 3.33) + vec2(GLINT_LIGHTING_POINTER.x - .5, .5 - GLINT_LIGHTING_POINTER.y);
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
  if(studioLighting>.5)return length((cardUv-ptr)*cardAspect)/.72;
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
  if(studioLighting>.5){vec2 q=vec2(uv.x,1.-uv.y)-studioFoilCenter(normal);return dot(q,vec2(.65,.18));}
  vec3 reflected=reflect(-view,normal);
  vec2 q=reflected.xy/max(abs(reflected.z),.25)+(GLINT_LIGHTING_POINTER-.5)*1.1;
  return mix(q.x+.12+q.y*.2,
    (uv.x-GLINT_LIGHTING_POINTER.x)*.65+(uv.y-GLINT_LIGHTING_POINTER.y)*.18+dot(reflected.xy,vec2(.16,.10)),satinCompact);
}
vec3 satin(vec2 uv, vec3 base, vec3 normal, vec3 view, float kind, float metal) {
  vec3 reflected=reflect(-view,normal);
  vec2 q=reflected.xy/max(abs(reflected.z),.25)+(GLINT_LIGHTING_POINTER-.5)*1.1;
  vec2 broadQ=mix(q,reflected.xy/max(abs(reflected.z),.25)+vec2(-.10,.17)+(GLINT_LIGHTING_POINTER-.5)*.28,satinCompact);
  if(studioLighting>.5)broadQ=vec2(-.10,.17)+vec2(uv.x,1.-uv.y)-studioFoilCenter(normal);
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
  if(studioLighting>.5){facet=studioDetailNormal(facet,normal);lamp=normalize(studioLampPosition);}
  float spec=max(0.,dot(facet,normalize(lamp+vec3(0.,0.,1.))));
  float s2=spec*spec,s4=s2*s2,s8=s4*s4;
  float stripAxis=satinStripAxis(uv,normal,view);
  float flash=(s8*s8*s8)*exp(-(stripAxis*stripAxis)*90.);
  vec3 opal=mix(spectrum(seed*.6+triangle*.12+tilt.x*.17),vec3(.92,.99,.96),.50);
  return vec4(opal,flash*.40);
}
`, oe = `
vec3 studioGloss(vec3 ink, vec3 normal, vec3 view, vec3 position) {
  vec3 n=normalize(normal),v=normalize(view);
  float nv=dot(n,v);
  if(nv<=0.)return ink;
  vec3 ray=reflect(-v,n);
  if(ray.z<=.0001)return ink;
  vec3 lamp=studioLampPosition;
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
  vec3 reflected=vec3(1.00,.99,.97)*source*fresnel*.78*1.21;
  vec3 linearInk=previewLinear(ink);
  return previewInk(clamp(linearInk*(1.-source*fresnel*.15)+reflected,0.,1.));
}
// Normal-only / 2D hosts use an upright virtual card and a finite studio camera.
// The native 3D pass instead supplies actual world positions and its own camera.
vec3 studioCardGloss(vec2 uv, vec3 ink, vec3 normal) {
  vec3 n=normalize(normal),position=studioCardPosition(uv,n);
  return studioGloss(ink,n,normalize(studioEyePosition-position),position);
}
`, se = `
#ifdef GLINT_HOST_SAMPLING
#ifndef GLINT_HOST_BINDINGS
#define GLINT_HOST_BINDINGS
#ifndef GLINT_FACE_SIZE_BINDING
#define GLINT_FACE_SIZE_BINDING
flat in vec2 facePixelSize;
#endif
flat in float previewKind;
flat in float hasMask;
flat in float aspect;
#ifndef GLINT_POINTER_BINDING
#define GLINT_POINTER_BINDING
flat in vec2 pointer;
#endif
#ifdef GLINT_ART_PAIR
flat in vec4 artBounds;
flat in vec4 artBounds2;
#else
flat in vec4 artBounds[8];
#endif
// Linear RGB, straight alpha. Mask coverage is linear red-channel data.
vec4 glintSampleFace(vec2 uv);
float glintSampleMask(vec2 uv);
#endif
#endif
`;
function ce(e = {}) {
  const t = e.artWindows === "pair" ? `float artWindow(vec2 uv) {
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
${e.sampling === "host" ? "#define GLINT_HOST_SAMPLING" : ""}
${e.artWindows === "pair" ? "#define GLINT_ART_PAIR" : ""}
${se}
#ifndef GLINT_HOST_SAMPLING
uniform float previewKind;
#endif
uniform sampler2D wave;
uniform float hasWave;
#ifdef GLINT_HOST_SAMPLING
#define GLINT_FOIL_FACE(uv) glintSampleFace(uv)
#define GLINT_FOIL_MASK(uv) glintSampleMask(uv)
#else
#define GLINT_FOIL_FACE(uv) texture2D(face,uv)
#define GLINT_FOIL_MASK(uv) texture2D(mask,uv).r
#endif
// The study was tuned against printed sRGB ink. Preserve those amounts when
// the host uploads sRGB textures and performs the final output conversion.
vec3 previewInk(vec3 c) { return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c)); }
vec3 previewLinear(vec3 c) { return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c)); }
${ne}
${oe}
${t}
// Gameplay mask alpha is stored unchanged in a linear R8 red channel.
float etchMask(vec2 uv) { return GLINT_FOIL_MASK(uv)*hasMask; }
float contour(vec2 uv) { return GLINT_FOIL_MASK(uv)*hasMask*artWindow(uv); }
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
${re}
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
  vec3 base=previewInk(GLINT_FOIL_FACE(uv).rgb);
  if(previewKind<.5) return base;
  if(previewKind==8. && studioLighting>.5) return studioCardGloss(uv,base,normal);
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
  if(studioLighting>.5)lamp=normalize(studioLampPosition);

  if(previewKind==9.)return holofoil(uv,base,normal,view,317./4294967295.,holofoilGrainFilter);
  if(previewKind==8.) {
    // Compatibility varnish from 0.5.3: the legacy foil pointer moves its sheen.
    float sweep=dot(cardUv*vec2(.86,1.20)-(bg-.5)*1.25,dir133)-.42;
    float coatBand=exp(-(sweep*sweep)*5.5);
    float stripAxis=satinStripAxis(uv,normal,view);
    float strip=exp(-(stripAxis*stripAxis)*34.);
    float fineLine=smoothstep(.28,.90,etched)*art;
    float frameLines=smoothstep(.74,.96,etched*(1.-art));
    float inkGloss=1.+clamp(fineLine*.22+frameLines*.34,0.,1.);
    vec3 clearCoat=vec3(.97,.98,1.)*((.032+coatBand*.092+strip*.062)*spot+innerCore*.052)*inkGloss;
    vec3 res=foilSheenBlend(base,clearCoat*1.10*(1.+satinHoverGain*.25));
    return mix(base,applyStudioGlare(res,rT,.52),.9);
  }
  if(previewKind==1.) {
    // Etched gold foil: embossed contour bevels, warm champagne-gold leaf, and micro-sparkle (+10% gold highlight).
    float fineLine=smoothstep(.24,.88,etched)*art;
#ifdef GLINT_HOST_SAMPLING
    vec2 texel=1./facePixelSize;
    vec2 dx=vec2(texel.x,0.),dy=vec2(0.,texel.y);
#else
    vec2 dx=vec2(.0015,0.),dy=vec2(0.,.0015);
#endif
    vec2 slopeArt=vec2(contour(uv+dx)-contour(uv-dx),contour(uv+dy)-contour(uv-dy));
    vec2 slopeAll=vec2(etchMask(uv+dx)-etchMask(uv-dx),etchMask(uv+dy)-etchMask(uv-dy));
    vec2 slope=mix(slopeAll*1.25,slopeArt,art);
    vec3 relief=normalize(vec3(-slope*(.56+1.08*spot)*6.6,1.));
    if(studioLighting>.5)relief=studioDetailNormal(relief,normal);
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
  vec2 tilt=(GLINT_LIGHTING_POINTER-.5)*2.;
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
    if(studioLighting>.5)relief=studioDetailNormal(relief,normal);
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

${e.liquid ? ie : ""}
  return base;
}`;
}
ce();
export {
  ne as F,
  se as H,
  z as P,
  F as R,
  M as S,
  ve as _,
  de as a,
  ce as f,
  le as v
};
