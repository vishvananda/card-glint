import { v as Re, f as Ae, c as _e } from "./image-cover-Bq6wMyQU.js";
import { R as Ne, f as Fe, a as Le, P as ke, v as Se, S as De, _ as Pe } from "./foil-preview-shader-DZ1KA2NA.js";
import { c as V, a as T } from "./canvas-raster-DIqHyOj6.js";
const W = (s) => (Math.imul(s + 1, 1597334677) >>> 0) % 65536 / 65536;
function pe(s) {
  if (s && (s.kind !== "heat" || !Number.isFinite(s.amount) || s.amount < 0 || s.amount > 0.02))
    throw RangeError("Heat deformation amount must be between 0 and 0.02");
}
function Ue(s, e) {
  return s?.amount ? e / (e + 4) / (1 + 2 * s.amount) : 1;
}
function D(s) {
  return Number.isInteger(s) && s >= 0 && s <= 4294967295;
}
function F(s) {
  if (s.length !== 4 || s.some((e) => !Number.isFinite(e)) || s[2] <= 0 || s[3] <= 0)
    throw Error("Invalid normalized rectangle");
}
function S(s) {
  if (!s.key || s.key.length > 131072) throw Error("Invalid raster key");
  const [e, t] = s.size;
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 1 || t < 1 || e * t > 4194304)
    throw Error("Invalid raster size");
}
function Ce(s) {
  if (!D(s.id) || !Number.isSafeInteger(s.revision) || s.revision < 0)
    throw Error("Invalid card identity");
  const e = s.recipe;
  if (S(e.color), e.stamp && S(e.stamp), !e.pack || e.artWindows.length > 8 || e.edges.length > 32)
    throw Error("Invalid recipe or too many regions");
  if (!Number.isFinite(e.cornerRadius) || e.cornerRadius < 0 || e.cornerRadius > 0.5)
    throw Error("Invalid corner radius");
  const t = e.finishCoverageBase ?? 1;
  if (!Number.isFinite(t) || t < 0 || t > 1) throw Error("Invalid base coverage");
  if (e.overlayFoil) {
    const { tone: i, strength: o } = e.overlayFoil;
    if (!["gold", "silver", "prismatic"].includes(i) || !Number.isFinite(o) || o < 0 || o > 1)
      throw Error("Invalid overlay foil");
  }
  if (e.hologram) {
    const { mask: i, rect: o, strength: r, seed: a = 0 } = e.hologram;
    if (S(i), F(o), !Number.isFinite(r) || r < 0 || r > 1 || !D(a))
      throw Error("Invalid hologram material");
  }
  e.artWindows.forEach(F), e.regions.forEach((i) => F(i.rect));
  for (const i of e.edges) {
    if (i.fit !== void 0 && Re(i.fit), F(i.crop), F(i.destination), F(i.clip), i.crop[0] < 0 || i.crop[1] < 0 || i.crop[0] + i.crop[2] > 1.000001 || i.crop[1] + i.crop[3] > 1.000001)
      throw Error("Crop leaves the source image");
    if (!Number.isInteger(i.threshold) || i.threshold < 0 || i.threshold > 255 || ![-90, 0, 90].includes(i.rotation ?? 0))
      throw Error("Invalid edge recipe");
  }
  for (const i of s.layers ?? []) {
    if (S(i.raster), i.clip && F(i.clip), !Number.isInteger(i.order) || Math.abs(i.order) > 2147483647)
      throw Error("Invalid layer order");
    for (const o of [
      i.finishCoverage?.add,
      i.finishCoverage?.exclude,
      i.etchCoverage?.add,
      i.etchCoverage?.exclude
    ])
      o && S(o);
  }
}
function Be(s) {
  if (s?.artwork !== void 0 && typeof s.artwork != "boolean")
    throw Error("Invalid print dot artwork option");
  if (s?.inset !== void 0 && (!Number.isFinite(s.inset) || s.inset < 0 || s.inset > 0.2))
    throw Error("Invalid print dot inset");
  if (s?.variation !== void 0 && (!Number.isFinite(s.variation) || s.variation < 0 || s.variation > 1))
    throw Error("Invalid print dot variation");
  if (s && (s.amount !== void 0 && (!Number.isFinite(s.amount) || s.amount < 0 || s.amount > 1) || s.period !== void 0 && (!Number.isFinite(s.period) || s.period < 2 || s.period > 16)))
    throw Error("Invalid print dots");
}
function J(s) {
  if (s.rainFog !== void 0 && (!Number.isFinite(s.rainFog) || s.rainFog < 0 || s.rainFog > 2))
    throw Error("Invalid rain fog density");
  if (Be(s.printDots), s.cardstock && (!Number.isFinite(s.cardstock.amount) || s.cardstock.amount < 0 || s.cardstock.amount > 1))
    throw Error("Invalid cardstock amount");
  if (pe(s.deformation), s.wear && (!Number.isFinite(s.wear.amount) || s.wear.amount < 0 || s.wear.amount > 1 || s.wear.seed !== void 0 && !D(s.wear.seed)))
    throw Error("Invalid wear amount or seed");
  if (!D(s.id) || !D(s.card) || s.transform.length !== 16 || s.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid instance identity or transform");
  if (!Number.isInteger(s.order ?? 0) || Math.abs(s.order ?? 0) > 2147483647)
    throw Error("Invalid instance order");
  if (![
    "regular",
    "gloss",
    "holofoil",
    "etched",
    "prismatic",
    "cold",
    "opal",
    "rain",
    "heat",
    "pool"
  ].includes(s.finish ?? "regular"))
    throw Error("Unknown finish");
  if (s.normal && (s.normal.length !== 3 || s.normal.some((e) => !Number.isFinite(e)) || Math.hypot(...s.normal) < 1e-8))
    throw Error("Invalid surface normal");
}
function Me(s) {
  if (s.lighting !== void 0 && !["pointer", "studio"].includes(s.lighting))
    throw Error("Invalid lighting model");
  if (!Number.isFinite(s.time ?? 0) || (s.time ?? 0) < 0)
    throw Error("Frame time must be finite, nonnegative seconds");
  if (s.hover && (!D(s.hover.instance) || s.hover.uv.length !== 2 || s.hover.uv.some((e) => !Number.isFinite(e) || e < 0 || e > 1)))
    throw Error("Invalid card-local hover");
}
function Ge(s) {
  if (S(s.raster), !s.id || !Number.isInteger(s.order) || s.transform.length !== 16 || s.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid scene layer");
  if (!["world-under-cards", "world-interleaved", "scene-overlay", "hud"].includes(s.stage) || !["test-write", "test-readonly", "ignore"].includes(s.depth))
    throw Error("Invalid scene layer stage or depth");
  if (["scene-overlay", "hud"].includes(s.stage) && s.depth !== "ignore")
    throw Error("Overlay/HUD layers must ignore depth");
}
class ve {
  constructor(e, t) {
    if (this.destroy = t, !Number.isSafeInteger(e) || e < 1 || e > 4294967295)
      throw RangeError("Invalid cache budget");
    this.policy = new Ne(e);
  }
  destroy;
  policy;
  resources = /* @__PURE__ */ new Map();
  generation = 0;
  acquire(e) {
    const t = this.policy.lookup(e);
    return t === void 0 ? null : this.lease(t);
  }
  insert(e, t, i) {
    if (!Number.isSafeInteger(i) || i < 1 || i > 4294967295)
      throw this.destroy(t), RangeError("Invalid resource size");
    let o;
    try {
      o = JSON.parse(this.policy.admit(e, i, 1));
    } catch (r) {
      throw this.destroy(t), r;
    }
    for (const r of o.evicted) {
      const a = this.resources.get(r);
      a !== void 0 && this.destroy(a), this.resources.delete(r);
    }
    return this.resources.has(o.handle) ? this.destroy(t) : this.resources.set(o.handle, t), this.lease(o.handle);
  }
  /** Admit and evict before allocating a GPU object, so a miss does not
   * temporarily duplicate the resident cache's entire working set. */
  create(e, t, i, o = 1) {
    if (!Number.isSafeInteger(t) || t < 1 || t > 4294967295)
      throw RangeError("Invalid resource size");
    const r = JSON.parse(
      this.policy.admit(e, t, o)
    );
    for (const a of r.evicted) {
      const c = this.resources.get(a);
      c !== void 0 && this.destroy(c), this.resources.delete(a);
    }
    if (this.resources.has(r.handle)) return this.lease(r.handle);
    try {
      return this.resources.set(r.handle, i()), this.lease(r.handle);
    } catch (a) {
      throw this.policy.remove(r.handle), a;
    }
  }
  lease(e) {
    const t = this.resources.get(e);
    if (t === void 0) throw Error("Resource ownership mismatch");
    this.policy.pin(e, !0);
    const i = this.generation;
    let o = !1;
    return {
      value: t,
      release: () => {
        o || (o = !0, i === this.generation && this.policy.pin(e, !1));
      }
    };
  }
  get stats() {
    return JSON.parse(this.policy.stats());
  }
  clear() {
    this.generation++;
    for (const e of this.resources.values()) this.destroy(e);
    this.resources.clear(), this.policy.clear();
  }
  dispose() {
    this.clear(), this.policy.free();
  }
}
async function Oe(s, e) {
  const t = await Ae(s.url, { mode: "cors", signal: e });
  if (!t.ok) throw Error(`Asset ${t.status}: ${s.url}`);
  const i = await t.blob();
  if (!i.type.includes("svg"))
    return createImageBitmap(
      i,
      s.width ? { resizeWidth: s.width, resizeQuality: "high" } : {}
    );
  const o = new DOMParser().parseFromString(await i.text(), "image/svg+xml"), r = o.documentElement;
  if (r.localName !== "svg" || o.querySelector("parsererror")) throw Error("Invalid SVG");
  const a = (r.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), c = a[2] ?? Number.parseFloat(r.getAttribute("width") ?? ""), n = a[3] ?? Number.parseFloat(r.getAttribute("height") ?? "");
  if (!(c > 0 && n > 0 && Number.isFinite(c + n))) throw Error("SVG needs finite dimensions");
  const l = (s.width ?? 512) / Math.max(c, n);
  r.hasAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${c} ${n}`), r.setAttribute("width", String(Math.max(1, Math.round(c * l)))), r.setAttribute("height", String(Math.max(1, Math.round(n * l))));
  const d = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(r)], { type: "image/svg+xml" })
  ), f = new Image();
  try {
    return f.src = d, await f.decode(), await createImageBitmap(f);
  } finally {
    f.src = "", URL.revokeObjectURL(d);
  }
}
class ze {
  store;
  pending = /* @__PURE__ */ new Map();
  active = 0;
  waiting = [];
  disposed = !1;
  generation = 0;
  controllers = /* @__PURE__ */ new Set();
  decodes = 0;
  constructor(e) {
    this.store = new ve(e, (t) => t.close());
  }
  async reserve() {
    return this.active >= 4 ? await new Promise((e) => this.waiting.push(e)) : this.active++, () => {
      const e = this.waiting.shift();
      e ? e() : this.active--;
    };
  }
  async image(e, t) {
    if (t.throwIfAborted(), this.disposed) throw Error("Asset store disposed");
    const i = JSON.stringify([e.url, e.width, e.revision]);
    let o = this.store.acquire(i);
    if (o) return o;
    let r = this.pending.get(i);
    if (!r) {
      const a = this.generation, c = new AbortController();
      this.controllers.add(c), r = (async () => {
        const n = await this.reserve();
        try {
          if (this.disposed || a !== this.generation) throw Error("Asset scope changed");
          const l = await Oe(e, c.signal);
          if (this.decodes++, this.disposed || a !== this.generation)
            throw l.close(), Error("Asset scope changed");
          this.store.insert(i, l, l.width * l.height * 4).release();
        } finally {
          n(), this.controllers.delete(c), a === this.generation && this.pending.delete(i);
        }
      })(), this.pending.set(i, r);
    }
    if (await r, t.throwIfAborted(), o = this.store.acquire(i), !o) throw Error("Decoded working set exceeds CPU budget");
    return o;
  }
  async images(e, t) {
    const i = [], o = /* @__PURE__ */ new Map(), r = await Promise.allSettled(
      e.map(async (n) => {
        const l = await this.image(n, t);
        i.push(l), o.set(n.url, l.value);
      })
    ), a = () => {
      for (const n of i) n.release();
      o.clear();
    }, c = r.find((n) => n.status === "rejected");
    if (c?.status === "rejected")
      throw a(), c.reason;
    return { value: o, release: a };
  }
  clear() {
    this.generation++;
    for (const e of this.controllers) e.abort();
    this.controllers.clear(), this.pending.clear(), this.store.clear();
  }
  dispose() {
    this.disposed = !0, this.clear(), this.store.dispose();
  }
}
function He(s, e = "full") {
  if (!["auto", "full", "reduced"].includes(e)) throw RangeError("Invalid finish quality");
  if (e !== "auto") return e;
  const t = /swiftshader|llvmpipe|softpipe|lavapipe|software rasterizer|basic render driver/i;
  if (t.test(String(s.getParameter(s.RENDERER)))) return "reduced";
  const i = s.getExtension("WEBGL_debug_renderer_info");
  return i && t.test(String(s.getParameter(i.UNMASKED_RENDERER_WEBGL))) ? "reduced" : "full";
}
const me = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`, q = `#version 300 es
precision highp float;precision highp int;precision highp usampler2D;
`, We = q + `uniform sampler2D source;uniform ivec2 size;uniform int mode;layout(location=0) out uvec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);if(mode==1)p.y=size.y-1-p.y;uvec3 rgb=uvec3(floor(texelFetch(source,p,0).rgb*255.+.5));
uint y=(54u*rgb.r+183u*rgb.g+19u*rgb.b)>>8u;color=uvec4(y,0,0,1);}`, Xe = q + `uniform usampler2D source;uniform ivec2 size;uniform int mode;uniform int threshold;
layout(location=0) out uvec4 color;
int at(ivec2 p){return int(texelFetch(source,p,0).r);}
void main(){ivec2 p=ivec2(gl_FragCoord.xy);int value=0;
if(mode==1){value=p.x==0||p.x==size.x-1?at(p):(at(p-ivec2(1,0))+2*at(p)+at(p+ivec2(1,0)))>>2;}
else if(mode==2){value=p.y==0||p.y==size.y-1?at(p):(at(p-ivec2(0,1))+2*at(p)+at(p+ivec2(0,1)))>>2;}
else if(p.x>0&&p.y>0&&p.x<size.x-1&&p.y<size.y-1){
int gx=-at(p+ivec2(-1,-1))+at(p+ivec2(1,-1))-2*at(p+ivec2(-1,0))+2*at(p+ivec2(1,0))-at(p+ivec2(-1,1))+at(p+ivec2(1,1));
int gy=-at(p+ivec2(-1,-1))-2*at(p+ivec2(0,-1))-at(p+ivec2(1,-1))+at(p+ivec2(-1,1))+2*at(p+ivec2(0,1))+at(p+ivec2(1,1));
value=clamp((((abs(gx)+abs(gy))>>2)-threshold)*8,0,255);}
color=uvec4(uint(value),0,0,1);}`, Ve = q + `uniform usampler2D strength;uniform usampler2D softened;out vec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);uint a=min(255u,max(texelFetch(strength,p,0).r,texelFetch(softened,p,0).r)*2u);color=vec4(float(a)/255.,0.,0.,1.);}`;
function ge(s, e, t) {
  const i = [], o = s.createProgram();
  if (!o) throw Error("WebGL program allocation failed");
  try {
    for (const [r, a] of [
      [s.VERTEX_SHADER, t],
      [s.FRAGMENT_SHADER, e]
    ]) {
      const c = s.createShader(r);
      if (!c) throw Error("WebGL shader allocation failed");
      i.push(c), s.shaderSource(c, a), s.compileShader(c), s.attachShader(o, c);
    }
    return s.linkProgram(o), { p: o, shaders: i };
  } catch (r) {
    throw s.deleteProgram(o), r;
  } finally {
    for (const r of i) s.deleteShader(r);
  }
}
function we(s, e, t) {
  if (s.getProgramParameter(e, s.LINK_STATUS)) return e;
  const i = t.map((o) => s.getShaderInfoLog(o)).filter(Boolean);
  throw Error([s.getProgramInfoLog(e), ...i].filter(Boolean).join(`
`));
}
function M(s, e, t = me) {
  const { p: i, shaders: o } = ge(s, e, t);
  try {
    return we(s, i, o);
  } catch (r) {
    throw s.deleteProgram(i), r;
  }
}
function B(s, e, t = me, i) {
  return i?.aborted ? Promise.reject(i.reason) : s.isContextLost() ? Promise.reject(Error("Graphics context is lost")) : new Promise((o, r) => {
    const a = s.getExtension("KHR_parallel_shader_compile");
    let c, n;
    const l = () => {
      clearTimeout(n), i?.removeEventListener("abort", f), s.canvas.removeEventListener("webglcontextlost", h);
    }, d = (p) => {
      l(), c && !s.isContextLost() && s.deleteProgram(c.p), c = void 0, r(p);
    }, f = () => d(i.reason), h = () => d(new DOMException("Graphics context is lost", "AbortError")), u = () => {
      if (i?.aborted) return f();
      if (s.isContextLost()) return h();
      try {
        if (a && !s.getProgramParameter(c.p, a.COMPLETION_STATUS_KHR)) {
          n = setTimeout(u, 8);
          return;
        }
        const p = we(s, c.p, c.shaders);
        l(), c = void 0, o(p);
      } catch (p) {
        d(p);
      }
    };
    i?.addEventListener("abort", f, { once: !0 }), s.canvas.addEventListener("webglcontextlost", h, { once: !0 });
    try {
      c = ge(s, e, t), n = setTimeout(u, 0);
    } catch (p) {
      d(p);
    }
  });
}
function A(s, e, t, i = s.R8, o = s.RED, r = s.UNSIGNED_BYTE) {
  const a = s.createTexture();
  s.bindTexture(s.TEXTURE_2D, a);
  const c = i === s.R8UI ? s.NEAREST : s.LINEAR;
  return s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, c), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, c), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_S, s.CLAMP_TO_EDGE), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_T, s.CLAMP_TO_EDGE), s.texImage2D(s.TEXTURE_2D, 0, i, e, t, 0, o, r, null), a;
}
class qe {
  constructor(e) {
    this.gl = e, this.scratch = [], this.width = this.height = 0, this.disposed = !1;
    const t = performance.now();
    this.programs = [];
    try {
      for (const i of [We, Xe, Ve]) this.programs.push(M(e, i));
    } catch (i) {
      throw this.dispose(), i;
    }
    this.uniforms = this.programs.map(
      (i) => Object.fromEntries(
        ["source", "size", "mode", "threshold", "strength", "softened"].map((o) => [
          o,
          e.getUniformLocation(i, o)
        ])
      )
    ), this.framebuffer = e.createFramebuffer(), this.vao = e.createVertexArray(), this.compileMs = performance.now() - t;
  }
  allocate(e, t) {
    if (e === this.width && t === this.height) return;
    const i = this.gl;
    for (const o of this.scratch) i.deleteTexture(o);
    this.scratch = [], this.width = e, this.height = t, this.input = A(i, e, t, i.RGBA8, i.RGBA), this.scratch.push(this.input);
    for (let o = 0; o < 3; o++) this.scratch.push(A(i, e, t, i.R8UI, i.RED_INTEGER));
    if (i.bindFramebuffer(i.FRAMEBUFFER, this.framebuffer), i.framebufferTexture2D(
      i.FRAMEBUFFER,
      i.COLOR_ATTACHMENT0,
      i.TEXTURE_2D,
      this.scratch[1],
      0
    ), i.checkFramebufferStatus(i.FRAMEBUFFER) !== i.FRAMEBUFFER_COMPLETE)
      throw Error("GPU integer etching framebuffer is unavailable");
  }
  run(e, t, i, o = 20, r = null) {
    if (this.disposed) throw Error("GPU etcher disposed");
    if (!Number.isInteger(t) || !Number.isInteger(i) || t < 1 || i < 1 || t * i > 4194304 || !Number.isInteger(o) || o < 0 || o > 255)
      throw RangeError("Invalid etching dimensions or threshold");
    if (ArrayBuffer.isView(e) && e.byteLength !== t * i * 4)
      throw RangeError("Wrong RGBA input length");
    if (e === null && (t !== this.width || i !== this.height))
      throw Error("Resident input must be uploaded at this size before reuse");
    const a = this.gl;
    this.allocate(t, i), a.bindVertexArray(this.vao), a.disable(a.BLEND), a.disable(a.DEPTH_TEST), a.disable(a.SCISSOR_TEST), a.disable(a.DITHER), a.colorMask(!0, !0, !0, !0), a.viewport(0, 0, t, i), a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, this.input), a.pixelStorei(a.UNPACK_ALIGNMENT, 1), a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL, a.NONE), e !== null && (this.flipped = typeof ImageBitmap < "u" && e instanceof ImageBitmap ? 1 : 0), a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !ArrayBuffer.isView(e) && !this.flipped), ArrayBuffer.isView(e) ? a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, t, i, a.RGBA, a.UNSIGNED_BYTE, e) : e !== null && a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, a.RGBA, a.UNSIGNED_BYTE, e), a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !1);
    const [c, n, l] = this.scratch.slice(1), d = r ?? A(a, t, i), f = (u, p, m, w = 0) => {
      a.useProgram(this.programs[u]);
      const g = this.uniforms[u];
      a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, p), a.uniform1i(g.source, 0), a.uniform2i(g.size, t, i), a.uniform1i(g.mode, w), a.uniform1i(g.threshold, o), a.bindFramebuffer(a.FRAMEBUFFER, this.framebuffer), a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, m, 0), a.drawArrays(a.TRIANGLES, 0, 3);
    };
    f(0, this.input, c, this.flipped ?? 0), f(1, c, n, 1), f(1, n, l, 2), f(1, l, c, 3), f(1, c, n, 1), f(1, n, l, 2);
    const h = this.uniforms[2];
    return a.useProgram(this.programs[2]), a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, c), a.uniform1i(h.strength, 0), a.activeTexture(a.TEXTURE1), a.bindTexture(a.TEXTURE_2D, l), a.uniform1i(h.softened, 1), a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, d, 0), a.drawArrays(a.TRIANGLES, 0, 3), a.bindFramebuffer(a.FRAMEBUFFER, null), a.bindVertexArray(null), d;
  }
  // Validation/measurement only. The real capture feeds the result directly to GL.
  read(e, t = this.width, i = this.height) {
    const o = this.gl, r = new Uint8Array(t * i * 4), a = new Uint8Array(t * i);
    o.bindFramebuffer(o.FRAMEBUFFER, this.framebuffer), o.framebufferTexture2D(o.FRAMEBUFFER, o.COLOR_ATTACHMENT0, o.TEXTURE_2D, e, 0), o.readPixels(0, 0, t, i, o.RGBA, o.UNSIGNED_BYTE, r), o.bindFramebuffer(o.FRAMEBUFFER, null);
    for (let c = 0; c < a.length; c++) a[c] = r[c * 4];
    return a;
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    const e = this.gl;
    for (const t of this.programs ?? []) e.deleteProgram(t);
    for (const t of this.scratch ?? []) e.deleteTexture(t);
    e.deleteFramebuffer(this.framebuffer ?? null), e.deleteVertexArray(this.vao ?? null);
  }
}
const Ke = `
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
#ifdef GLINT_REDUCED_FINISH
 // Tiny low-quality cards retain central beads; omit subpixel neighboring caps.
 for(int y=0;y<=0;y++)for(int x=0;x<=0;x++){
#else
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
#endif
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
#ifdef GLINT_REDUCED_FINISH
 vec3 linearInk=windowInk(baseUv,bounds)*.40;
#else
 vec3 linearInk=windowInk(baseUv,bounds)*mix(.40,.22,dry*.45);
#endif
 linearInk+=(windowInk(baseUv+vec2(radius.x,0.),bounds)+windowInk(baseUv-vec2(radius.x,0.),bounds)
  +windowInk(baseUv+vec2(0.,radius.y),bounds)+windowInk(baseUv-vec2(0.,radius.y),bounds))*.15;
 #ifndef GLINT_REDUCED_FINISH
 if(dry>.02){
  vec2 diag=radius*.55;
  linearInk+=(windowInk(baseUv+diag,bounds)+windowInk(baseUv-diag,bounds)
   +windowInk(baseUv+vec2(diag.x,-diag.y),bounds)+windowInk(baseUv+vec2(-diag.x,diag.y),bounds))*(.045*dry);
 }
 #endif
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
`, je = `
vec3 heatMirageInk(vec2 uv,vec2 r,vec4 bounds){
#ifdef GLINT_REDUCED_FINISH
 vec3 c=windowInk(uv,bounds)*.52;
#else
 vec3 c=windowInk(uv,bounds)*.20;
#endif
 vec2 r1=r*.65,r2=r*.82;
 c+=(windowInk(uv+vec2(r1.x,0.),bounds)+windowInk(uv-vec2(r1.x,0.),bounds)
  +windowInk(uv+vec2(0.,r1.y),bounds)+windowInk(uv-vec2(0.,r1.y),bounds))*.12;
 #ifndef GLINT_REDUCED_FINISH
 c+=(windowInk(uv+vec2(r2.x,r2.y),bounds)+windowInk(uv+vec2(-r2.x,r2.y),bounds)
  +windowInk(uv+vec2(r2.x,-r2.y),bounds)+windowInk(uv+vec2(-r2.x,-r2.y),bounds))*.08;
 #endif
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
`, be = `
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
`, $e = `
uniform sampler2D caustics;
${be}
vec3 floorIrradiance(vec2 p){
 // A small receiving footprint softens subpixel ray folds / mesh boundaries,
 // like a light source with finite angular extent instead of an ideal point,
 // and yields the local caustic gradient for prismatic dispersion at zero extra taps.
#ifdef GLINT_REDUCED_FINISH
 // Keep the evolving irradiance, with no five-tap dispersion reconstruction.
 return vec3(texture(caustics,p).r*8.,0.,0.);
#else
 vec2 radius=1.25/vec2(textureSize(caustics,0));
 float c0=texture(caustics,p).r;
 float cxP=texture(caustics,p+vec2(radius.x,0.)).r,cxN=texture(caustics,p-vec2(radius.x,0.)).r;
 float cyP=texture(caustics,p+vec2(0.,radius.y)).r,cyN=texture(caustics,p-vec2(0.,radius.y)).r;
 float light=(c0*.4+(cxP+cxN+cyP+cyN)*.15)*8.;
 vec2 grad=vec2(cxP-cxN,cyP-cyN)*8.;
 return vec3(light,grad);
#endif
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
`, Ye = `
#ifdef GLINT_HOST_SAMPLING
#define GLINT_SURFACE_FACE(uv) glintSampleFace(uv)
#define GLINT_SURFACE_SIZE facePixelSize
vec4 glintSurfaceClamp(){vec2 t=1./facePixelSize;return vec4(t,1.-t);}
#else
#define GLINT_SURFACE_FACE(uv) texture(face,uv)
#define GLINT_SURFACE_SIZE vec2(textureSize(face,0))
vec4 glintSurfaceClamp(){return vec4(.002,.002,.998,.998);}
#endif
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
vec3 surfaceInk(vec2 uv){vec4 b=glintSurfaceClamp();return GLINT_SURFACE_FACE(clamp(uv,b.xy,b.zw)).rgb;}
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
#ifdef GLINT_ART_PAIR
 if(finishBase<.5)for(int i=0;i<2;i++){
  vec4 b=i==0?artBounds:artBounds2;
#else
 if(finishBase<.5)for(int i=0;i<8;i++){
  vec4 b=artBounds[i];
#endif
  if(b.z>b.x && b.w>b.y && all(greaterThanEqual(uv,b.xy)) && all(lessThanEqual(uv,b.zw))){
   vec2 inset=min(.5/GLINT_SURFACE_SIZE,(b.zw-b.xy)*.25);
   return b+vec4(inset,-inset);
  }
 }
 return glintSurfaceClamp();
}
vec3 windowInk(vec2 uv,vec4 bounds){return GLINT_SURFACE_FACE(clamp(uv,bounds.xy,bounds.zw)).rgb;}
// Small, linear-light cross filter. Radius can be anisotropic; no blur texture.
vec3 softenedInk(vec2 uv,vec2 radius,vec4 bounds){
 vec3 ink=windowInk(uv,bounds)*.4;
 ink+=(windowInk(uv+vec2(radius.x,0.),bounds)+windowInk(uv-vec2(radius.x,0.),bounds))*.15;
 ink+=(windowInk(uv+vec2(0.,radius.y),bounds)+windowInk(uv-vec2(0.,radius.y),bounds))*.15;
 return previewInk(ink);
}
vec3 softenedInk(vec2 uv,vec2 radius){return softenedInk(uv,radius,glintSurfaceClamp());}
float surfaceReflection(vec2 uv,vec3 normal,float sharpness){
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 lamp=normalize(vec3(-.24,.32,1.));
 if(studioLighting>.5){view=studioCardView(uv,normal);lamp=normalize(studioLampPosition-studioCardPosition(uv,normal));}
 return pow(max(0.,dot(reflect(-view,normal),lamp)),sharpness);
}
#if !defined(GLINT_FINISH_KIND) || GLINT_FINISH_KIND == 5
${Ke}
#endif
#if !defined(GLINT_FINISH_KIND) || GLINT_FINISH_KIND == 6
${je}
#endif
#if !defined(GLINT_FINISH_KIND) || GLINT_FINISH_KIND == 7
${$e}
#endif
vec3 animatedSurface(vec2 uv,vec3 normal){
#if !defined(GLINT_FINISH_KIND) || GLINT_FINISH_KIND == 5
 if(previewKind==5.)return rainGlass(uv,normal);
#endif
#if !defined(GLINT_FINISH_KIND) || GLINT_FINISH_KIND == 6
 if(previewKind==6.)return heatHaze(uv,normal);
#endif
#if !defined(GLINT_FINISH_KIND) || GLINT_FINISH_KIND == 7
 return poolWater(uv,normal);
#else
 return vec3(0.); // The selected rain/heat branch above always returns.
#endif
}
`, Je = `
vec2 cardSource(vec2 local,float time,vec2 shape){
 float amount=shape.x,phase=shape.y*6.28318530718;
 if(amount==0.)return local;
 return local+amount*vec2(
  .72*sin(local.y*43.+time*2.1+phase)+.28*sin(local.y*81.-time*3.4+phase*.7),
  .18*sin(local.x*29.-time*1.3+phase));
}
`, Qe = `
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
`;
function K(s, e) {
  if (s.getParameter(s.TRANSFORM_FEEDBACK_ACTIVE) && !s.getParameter(s.TRANSFORM_FEEDBACK_PAUSED))
    throw Error("Finish preparation requires paused transform feedback");
  for (const E of [s.ANY_SAMPLES_PASSED, s.ANY_SAMPLES_PASSED_CONSERVATIVE])
    if (s.getQuery(E, s.CURRENT_QUERY))
      throw Error("Finish preparation cannot run inside an occlusion query");
  const t = s.getParameter(s.ACTIVE_TEXTURE), i = s.getParameter(s.CURRENT_PROGRAM);
  if (i && s.getProgramParameter(i, s.DELETE_STATUS))
    throw Error("Finish preparation requires an undeleted current program");
  const o = s.getParameter(s.VERTEX_ARRAY_BINDING), r = s.getParameter(s.ELEMENT_ARRAY_BUFFER_BINDING), a = s.getParameter(s.READ_FRAMEBUFFER_BINDING), c = s.getParameter(s.DRAW_FRAMEBUFFER_BINDING), n = s.getParameter(s.PIXEL_UNPACK_BUFFER_BINDING), l = s.getParameter(s.VIEWPORT), d = s.getParameter(s.COLOR_WRITEMASK), f = s.getParameter(s.COLOR_CLEAR_VALUE), h = s.getParameter(s.BLEND_EQUATION_RGB), u = s.getParameter(s.BLEND_EQUATION_ALPHA), p = s.getParameter(s.BLEND_SRC_RGB), m = s.getParameter(s.BLEND_SRC_ALPHA), w = s.getParameter(s.BLEND_DST_RGB), g = s.getParameter(s.BLEND_DST_ALPHA), b = [
    s.BLEND,
    s.CULL_FACE,
    s.DEPTH_TEST,
    s.DITHER,
    s.SCISSOR_TEST,
    s.STENCIL_TEST,
    s.RASTERIZER_DISCARD,
    s.SAMPLE_ALPHA_TO_COVERAGE,
    s.SAMPLE_COVERAGE
  ], v = b.map((E) => s.isEnabled(E));
  s.activeTexture(s.TEXTURE0);
  const x = s.getParameter(s.TEXTURE_BINDING_2D), y = s.getParameter(s.SAMPLER_BINDING);
  try {
    s.bindBuffer(s.PIXEL_UNPACK_BUFFER, null);
    for (const E of b) s.disable(E);
    return e();
  } finally {
    s.useProgram(i), s.bindVertexArray(o), s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, r), s.bindFramebuffer(s.READ_FRAMEBUFFER, a), s.bindFramebuffer(s.DRAW_FRAMEBUFFER, c), s.bindBuffer(s.PIXEL_UNPACK_BUFFER, n), s.viewport(l[0], l[1], l[2], l[3]), s.colorMask(d[0], d[1], d[2], d[3]), s.clearColor(f[0], f[1], f[2], f[3]), s.blendEquationSeparate(h, u), s.blendFuncSeparate(
      p,
      w,
      m,
      g
    ), b.forEach(
      (E, N) => v[N] ? s.enable(E) : s.disable(E)
    ), s.activeTexture(s.TEXTURE0), s.bindTexture(s.TEXTURE_2D, x), s.bindSampler(0, y), s.activeTexture(t);
  }
}
const Q = 732, Z = 1020, ee = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`, te = `#version 300 es
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
class j {
  constructor(e, t, i = "full") {
    this.gl = e, this.width = i === "reduced" ? Q / 2 : Q, this.height = i === "reduced" ? Z / 2 : Z, this.shader = t ?? M(e, te, ee);
  }
  gl;
  width;
  height;
  map;
  bytes = 0;
  passes = 0;
  shader;
  static async create(e, t, i = "full") {
    const o = await B(e, te, ee, t);
    try {
      if (t?.throwIfAborted(), e.isContextLost()) throw Error("Context lost during cardstock preparation");
      return K(e, () => new j(e, o, i));
    } catch (r) {
      throw e.deleteProgram(o), r;
    }
  }
  prepare() {
    if (this.map) return;
    const e = this.gl, t = this.width, i = this.height, o = A(e, t, i, e.RGBA8, e.RGBA), r = e.createFramebuffer(), a = e.createVertexArray();
    try {
      if (e.bindFramebuffer(e.FRAMEBUFFER, r), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, o, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
        throw Error("Cardstock framebuffer is incomplete");
      e.viewport(0, 0, t, i), e.disable(e.DEPTH_TEST), e.disable(e.CULL_FACE), e.disable(e.SCISSOR_TEST), e.disable(e.BLEND), e.disable(e.DITHER), e.colorMask(!0, !0, !0, !0), e.useProgram(this.shader), e.bindVertexArray(a), e.drawArrays(e.TRIANGLES, 0, 3), e.bindTexture(e.TEXTURE_2D, o), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR_MIPMAP_LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.generateMipmap(e.TEXTURE_2D);
      let c = t, n = i;
      for (; this.bytes += c * n * 4, !(c === 1 && n === 1); )
        c = Math.max(1, Math.floor(c / 2)), n = Math.max(1, Math.floor(n / 2));
      this.map = o, this.passes++;
    } catch (c) {
      throw e.deleteTexture(o), c;
    } finally {
      e.bindFramebuffer(e.FRAMEBUFFER, null), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.bindVertexArray(null), e.deleteFramebuffer(r), e.deleteVertexArray(a);
    }
  }
  dispose() {
    this.gl.deleteTexture(this.map ?? null), this.gl.deleteProgram(this.shader);
  }
}
const Ze = `
#ifndef GLINT_STUDIO_LIGHTING_UNIFORM
#define GLINT_STUDIO_LIGHTING_UNIFORM
uniform float studioLighting;
#endif
#ifndef GLINT_LIGHTING_POINTER
#define GLINT_LIGHTING_POINTER (studioLighting>.5?vec2(.5):pointer)
#endif
#ifdef GLINT_HOST_SAMPLING
#ifndef GLINT_POINTER_BINDING
#define GLINT_POINTER_BINDING
flat in vec2 pointer;
#endif
#endif
uniform sampler2D cardstockMap;
flat in float cardstockAmount;
float cardstockResponse(vec2 uv){
 if(cardstockAmount<=0.)return 1.;
 vec4 encoded=texture(cardstockMap,uv);
 vec2 slope=(vec2(dot(encoded.rg,vec2(256.,1.)),dot(encoded.ba,vec2(256.,1.)))/257.-.5)*4.4;
 vec2 direction=vec2(.65,.76)+(vec2(GLINT_LIGHTING_POINTER.x,1.-GLINT_LIGHTING_POINTER.y)-.5)*1.6;
 vec2 light=direction/max(length(direction),.1);
 return max(0.,1.+cardstockAmount*2.142*dot(slope,light));
}
vec3 cardstockGloss(vec2 uv,vec3 ink,vec3 reflected){
 if(cardstockAmount<=0.)return reflected;
 // Relief redistributes the finish response without reducing its overall gain.
 return ink+(reflected-ink)*cardstockResponse(uv);
}`, xe = `
#ifdef GLINT_HOST_SAMPLING
#ifndef GLINT_FACE_SIZE_BINDING
#define GLINT_FACE_SIZE_BINDING
flat in vec2 facePixelSize;
#endif
vec4 glintSampleFace(vec2 uv);
#define GLINT_PRINT_FACE(uv) glintSampleFace(uv)
#define GLINT_PRINT_SIZE facePixelSize
#else
#ifndef GLINT_PRINT_FACE
#define GLINT_PRINT_FACE(uv) texture(face,uv)
#endif
#define GLINT_PRINT_CELL_FACE(uv) textureLod(face,uv,0.)
#define GLINT_PRINT_SIZE vec2(textureSize(face,0))
#endif
#ifndef GLINT_PRINT_CELL_FACE
#define GLINT_PRINT_CELL_FACE(uv) GLINT_PRINT_FACE(uv)
#endif
flat in vec4 printDotsInfo;
float printFootprint;
float printDotPeriodTexels(){return printDotsInfo.y*GLINT_PRINT_SIZE.x/732.;}
vec2 printScreenSize(){return GLINT_PRINT_SIZE*(732./GLINT_PRINT_SIZE.x);}
float printDotFootprint(vec2 uv){vec2 p=uv*printScreenSize();return max(length(dFdx(p)),length(dFdy(p)))/printDotsInfo.y;}
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
float printNoise(vec2 p,float channel){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(plateNoise(i,channel),plateNoise(i+vec2(1.,0.),channel),f.x),mix(plateNoise(i+vec2(0.,1.),channel),plateNoise(i+1.,channel),f.x),f.y);
}
mat2 plateRotation(vec2 axis){return mat2(axis.x,axis.y,-axis.y,axis.x);}
float plateDot(vec2 cell,vec2 id,float radius,bool holes,float channel,float aa,float reach){
 if(any(greaterThan(abs(cell),vec2(reach))))return 0.;
 float variation=printDotsInfo.z;
 if(variation>0.){
  float a=plateNoise(id,channel),b=plateNoise(id,channel+1.),c=plateNoise(id,channel+2.);
  cell-=(vec2(a,b)-.5)*.5*variation;
  cell*=vec2(1.+(b-.5)*.3*variation,1.-(b-.5)*.3*variation);
  radius*=1.+(c-.5)*.36*variation;
  radius*=holes?1.-.12*variation:1.+.12*variation;
  // Stable ragged impression edges, not animated or screen-space grain.
  #ifndef GLINT_PRINT_PROCEDURAL
  float phase=plateNoise(id,channel+83.)*6.2831853,theta=atan(cell.y,cell.x);
  radius*=1.+1.5*variation*(.035*sin(3.*theta+phase)+.018*sin(5.*theta-phase));
#endif
 }
 return 1.-smoothstep(radius-aa,radius+aa,length(cell));
}
float plateScreen(vec2 p,float ink,vec2 axis,float channel,float aa){
 if(ink<=0.)return 0.;if(ink>=1.)return 1.;
 vec2 q=plateRotation(axis)*p;
 bool holes=ink>.5;
 vec2 point=q+(holes?.5:0.),id=floor(point),cell=fract(point)-.5;
 float radius=sqrt(min(ink,1.-ink)/3.14159265),variation=printDotsInfo.z;
 // Include the possible irregular edge excursion before rejecting a neighbor.
 float reach=(radius*(1.+.18*variation)*(holes?1.-.12*variation:1.+.12*variation)*(1.+.0795*variation)+aa)/(1.-.15*variation)+.25*variation;
 float dotInk=plateDot(cell,id,radius,holes,channel,aa,reach);
 // Keep the validated uniform bound dynamic: full unrolling multiplies the
 // nine blur taps, spread taps and neighbors throughout finish sampling.
 int neighborEnd=printDotsInfo.z<0.?0:1;
 if(variation>0.)for(int y=-1;y<=neighborEnd;y++)for(int x=-1;x<=neighborEnd;x++){
  if(x==0&&y==0)continue;
  vec2 offset=vec2(float(x),float(y));
  dotInk=max(dotInk,plateDot(cell-offset,id+offset,radius,holes,channel,aa,reach));
 }
 return holes?1.-dotInk:dotInk;
}
// Raw coverage helper retained for numerical screen/continuity diagnostics.
float inkScreen(vec2 p,float ink,vec2 axis,float channel){return plateScreen(p,ink,axis,channel,max(.015,length(vec2(.1,printFootprint*.4))));}
// Procedural over-finish printing has its own source, never the base face.
bool printUseLocalSource=false;
vec4 printLocalProcess;
float plateSource(vec2 id,vec2 axis,float channel){
 if(printUseLocalSource)return channel<3.?printLocalProcess.x:channel<7.?printLocalProcess.y:channel<11.?printLocalProcess.z:printLocalProcess.w;
 vec2 p=transpose(plateRotation(axis))*(id+.5)*printDotsInfo.y/printScreenSize();
 vec3 ink=previewInk(GLINT_PRINT_CELL_FACE(vec2(p.x,1.-p.y)).rgb);
 float key=1.-max(max(ink.r,ink.g),ink.b);
 vec3 cmy=clamp((1.-ink-key)/max(1.-key,.0001),0.,1.);
 return channel<3.?cmy.r:channel<7.?cmy.g:channel<11.?cmy.b:key;
}
// A blur tap can cross at most one cell boundary in either direction. Sample
// each reachable source-cell color once per plate, rather than per blur tap.
struct PrintPlate {vec2 origin;vec4 inks;vec2 registration;float density;};
PrintPlate preparePlate(vec2 p,vec2 uv,vec2 axis,float channel,vec2 offset,float softness){
 float variation=2.*printDotsInfo.z;
 vec2 field=uv*vec2(8.,11.);
 vec2 drift=(vec2(printNoise(field,71.+channel),printNoise(field+17.3,102.+channel))-.5)*.28;
 vec2 registration=(offset+drift)*variation/printDotsInfo.y;
 p+=registration;
 vec2 q=plateRotation(axis)*p,origin=floor(q),f=fract(q),side=step(vec2(.5),f)*2.-1.;
 #ifdef GLINT_PRINT_PROCEDURAL
 float extent=0.;
#else
 float extent=softness*(abs(axis.x)+abs(axis.y))/printDotsInfo.y+.00001;
#endif
 bool crossX=min(f.x,1.-f.x)<extent,crossY=min(f.y,1.-f.y)<extent;
 float a=plateSource(origin,axis,channel),b=a,c=a,d=a;
 if(crossX)b=plateSource(origin+vec2(side.x,0.),axis,channel);
 if(crossY)c=plateSource(origin+vec2(0.,side.y),axis,channel);
 if(crossX&&crossY)d=plateSource(origin+side,axis,channel);
 else d=crossX?b:c;
 float density=.08*variation*(printNoise(p*.43,124.+channel)-.5);
 return PrintPlate(origin,vec4(a,b,c,d),registration,density);
}
float screenedPlate(vec2 p,vec2 axis,float channel,PrintPlate plate,float aa,float gaps){
 p+=plate.registration;
 vec2 id=floor(plateRotation(axis)*p);
 int index=(id.x==plate.origin.x?0:1)+(id.y==plate.origin.y?0:2);
 float ink=plate.inks[index],absorption=.35+.65*ink,coverage=ink/absorption;
 coverage=clamp(coverage-gaps*coverage*(1.-coverage),0.,1.);
 coverage=clamp(coverage+plate.density*coverage*(1.-coverage),0.,1.);
 vec2 drag=vec2(0.,.6*printDotsInfo.z/printDotsInfo.y);
 #ifdef GLINT_PRINT_PROCEDURAL
 return absorption*plateScreen(p,coverage,axis,channel,length(vec2(aa,drag.y*.70710678)));
#else
 if(printDotsInfo.z<=0.)return absorption*plateScreen(p,coverage,axis,channel,aa);
 return absorption*(.25*plateScreen(p-drag,coverage,axis,channel,aa)+.5*plateScreen(p,coverage,axis,channel,aa)+.25*plateScreen(p+drag,coverage,axis,channel,aa));
#endif
}
vec3 printDotInk(vec3 ink,vec2 uv){
 // Solid process black stays solid: cell-centered plate sampling must not
 // pull a neighboring paper color into a black letter stroke.
 if(printDotsInfo.x<=0. || max(max(ink.r,ink.g),ink.b)<=0.)return ink;
 float visible=1.-smoothstep(.35,.9,printFootprint);
#ifdef PRINT_DOT_ART_WINDOWS
 visible*=printArea(uv);
#endif
 if(printDotsInfo.w>0.){
  vec2 edge=min(uv,1.-uv);float aspect=GLINT_PRINT_SIZE.y/GLINT_PRINT_SIZE.x;
  visible*=smoothstep(printDotsInfo.w*.85,printDotsInfo.w*1.15,min(edge.x,edge.y*aspect));
 }
 // Coverage is tested before source sampling and remains exact at art windows.
 if(visible<=0.)return ink;
 if(printUseLocalSource){
  float key=1.-max(max(ink.r,ink.g),ink.b);
  printLocalProcess=vec4(clamp((1.-ink-key)/max(1.-key,.0001),0.,1.),key);
 }
 vec2 paper=vec2(uv.x,1.-uv.y),p=paper*printScreenSize()/printDotsInfo.y;
 float varied=clamp(2.*printDotsInfo.z,0.,1.);
 float spread=mix(.1,mix(.06,.14,smoothstep(.1,.9,printNoise(paper*vec2(21.,30.)+vec2(13.2,7.4),39.))),varied);
 float aa=max(.015,length(vec2(spread,printFootprint*.4)));
 float softness=.5*mix(.5,smoothstep(.3,.7,printNoise(paper*vec2(21.,30.)+vec2(52.7,19.1),39.)),varied);
 float brightness=dot(ink,vec3(.2126,.7152,.0722));
 float gaps=(.06+.54*smoothstep(.18,.9,brightness))*smoothstep(.1,.35,brightness);
 float lightGain=mix(1.,2.6,smoothstep(.1,.35,brightness));
 // Uniform loop bounds keep Windows compilers from cloning the full source,
 // registration and screen filter once per color plate. All four plates retain
 // the same axes, offsets, channel seeds and arithmetic as the unrolled form.
 const vec2 axes[4]=vec2[4](vec2(-.258819,.965926),vec2(.258819,.965926),vec2(0.,1.),vec2(.707107));
 const vec2 offsets[4]=vec2[4](vec2(-.30,.12),vec2(.20,-.22),vec2(.08,.26),vec2(-.05,-.03));
 int plateEnd=printDotsInfo.y<0.?0:4;
 PrintPlate plates[4];
 for(int i=0;i<plateEnd;i++)plates[i]=preparePlate(p,paper,axes[i],1.+4.*float(i),offsets[i],softness);
 vec3 sum=vec3(0.);
 #ifdef GLINT_PRINT_PROCEDURAL
 // Uncached mixed-instance/pressure fallback uses the analytic footprint.
 // The native preparation pass retains the exact nine-tap reviewed filter.
 aa=length(vec2(aa,softness/printDotsInfo.y*.70710678));
 for(int sy=0;sy<=0;sy++)for(int sx=0;sx<=0;sx++){
#else
 int blurEnd=printDotsInfo.x<0.?0:1;
 for(int sy=-1;sy<=blurEnd;sy++)for(int sx=-1;sx<=blurEnd;sx++){
#endif
  vec2 q=p+vec2(float(sx),float(sy))*softness/printDotsInfo.y;
  vec4 coverage=vec4(0.);
  for(int i=0;i<plateEnd;i++)coverage[i]=screenedPlate(q,axes[i],1.+4.*float(i),plates[i],aa,gaps);
  vec3 screened=(1.-coverage.xyz)*(1.-coverage.w);
  vec3 delta=screened-ink;
  float gain=dot(delta,vec3(.2126,.7152,.0722))>=0.?lightGain:1.;
  #ifdef GLINT_PRINT_PROCEDURAL
  float weight=1.;
#else
  float weight=(sx==0?2.:1.)*(sy==0?2.:1.)/16.;
#endif
  sum+=weight*clamp(ink+delta*gain*printDotsInfo.x*visible,0.,1.);
 }
 return sum;
}
vec4 printFace(vec2 uv){
 vec4 source=GLINT_PRINT_FACE(uv);
 if(printDotsInfo.x<=0.)return source;
 return vec4(previewLinear(printDotInk(previewInk(source.rgb),uv)),source.a);
}`, re = `#version 300 es
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
gl_Position=viewProjection*world;}`;
function et(s, e, t, i = "full") {
  const o = s >= 5 && s < 8, r = Fe().replace("uniform float previewKind;", `const float previewKind=${s.toFixed(1)};`).replaceAll("texture2D(mask,uv).r*hasMask", "edgeCoverage(uv)").replaceAll("texture2D(face,", "printFace(");
  return `#version 300 es
#define GLINT_FINISH_KIND ${s}
${i === "reduced" ? "#define GLINT_REDUCED_FINISH" : ""}
${e ? "#define LOCAL_HOLOGRAM" : ""}
${t ? "#define PROCEDURAL_PRINT" : ""}
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
${Ze}
${r}
#ifdef PROCEDURAL_PRINT
#define GLINT_PRINT_PROCEDURAL
#define PRINT_DOT_ART_WINDOWS
#define PRINT_DOT_ART_INSTANCE
${xe}
#else
vec4 printFace(vec2 uv){return texture(face,uv);}
#endif
${o ? Ye.replaceAll("texture(face,", "printFace(") : "uniform float surfaceTime;flat in vec4 surfaceInfo;"}
${Je}
${Qe}
#ifdef LOCAL_HOLOGRAM
${Le}
#endif
void main(){
 vec2 source=cardSource(v_uv,surfaceTime,surfaceInfo.wz);
 vec2 uv=vec2(source.x,1.-source.y);
#ifdef PROCEDURAL_PRINT
 printFootprint=printDotFootprint(uv);
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
 if(studioLighting>.5)view=studioVirtual>.5?studioCardView(uv,normalize(v_normal)):normalize(studioCamera.xyz-studioPosition*studioCamera.w);
 vec3 optical;
 if(previewKind==8. && studioVirtual<.5 && studioLighting>.5)optical=studioGloss(previewInk(printFace(uv).rgb),normalize(v_normal),normalize(studioCamera.xyz-studioPosition*studioCamera.w),studioPosition);
 else optical=${o ? "animatedSurface(uv,normalize(v_normal))" : "previewFoil(uv,normalize(v_normal),view)"};
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
 if(printDotsInfo.x>0. && top.a>0.) {
  printUseLocalSource=true;
  printing=previewLinear(printDotInk(previewInk(top.rgb),uv));
  printUseLocalSource=false;
 }
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
}`;
}
const tt = `#version 300 es
precision highp float;in vec2 v_uv;uniform sampler2D face;out vec4 out_color;
void main(){out_color=texture(face,vec2(v_uv.x,1.-v_uv.y));if(out_color.a<.001)discard;}`, L = (s, e) => Math.max(-e, Math.min(e, s));
function Ee(s, e) {
  const t = Math.min(2047, Math.max(0, Math.round((s / 0.24 + 0.5) * 2047))), i = Math.min(0.9995, Math.max(5e-4, e / 0.24 + 0.5));
  return 1 + t + i;
}
function ie(s, e, t, i) {
  for (let o = 1; o <= 4; o++) {
    const r = (s.activeRipple + o) % 4, a = 4 + r * 4;
    if (!(s.data[a + 3] > 0 && e - s.data[a + 2] < 2.25))
      return s.activeRipple = r, s.segStart = [t, i], s.segTime = e, s.data.set([t, i, e, Ee(0, 0)], a), !0;
  }
  return !1;
}
class ae {
  states = /* @__PURE__ */ new Map();
  serial = 0;
  begin() {
    this.serial++;
  }
  end() {
    for (const [e, t] of this.states) t.seen !== this.serial && this.states.delete(e);
  }
  clear() {
    this.states.clear();
  }
  sample(e, t) {
    const i = e.finish ?? "regular";
    if (i !== "rain" && i !== "heat" && i !== "pool" && !e.deformation)
      return null;
    const o = t.time ?? 0, r = e.transform, a = e.normal ?? [0, 0, 1], c = [r[12], r[13], a[0], a[1]];
    let n = this.states.get(e.id);
    if (!n || o < n.time) {
      const f = new Float32Array(20);
      f.set([0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0], 4), n = {
        seen: this.serial,
        time: o,
        pose: c,
        velocity: [0, 0],
        data: f,
        activeRipple: 0,
        emitting: !1,
        segStart: [0.5, 0.5],
        segTime: -100,
        hoverUv: [0.5, 0.5],
        hovering: !1
      }, this.states.set(e.id, n);
    }
    n.seen = this.serial;
    const l = Math.min(0.05, o - n.time), d = t.hover?.instance === e.id ? t.hover : void 0;
    if (d) {
      const f = d.uv[0], h = 1 - d.uv[1];
      if (!n.hovering)
        n.hoverUv = [f, h], n.emitting = ie(n, o, f, h);
      else {
        const u = f - n.hoverUv[0], p = h - n.hoverUv[1], m = Math.hypot(u, p);
        n.hoverUv = [f, h], l > 0 && m > 0 && (n.velocity[0] = L(n.velocity[0] + L(u * 1.8, 0.28), 1), n.velocity[1] = L(n.velocity[1] + L(p * 1.8, 0.28), 1));
        const w = (f - n.segStart[0]) * 0.5, g = (h - n.segStart[1]) * 0.5, b = Math.hypot(w, g) * 2, v = o - n.segTime;
        if (m > 5e-4)
          if (!n.emitting || b > 0.11 || v > 0.13 && b > 0.02)
            n.emitting = ie(n, o, f, h);
          else {
            const x = n.segStart[0] + w, y = n.segStart[1] + g, E = n.segTime + v * 0.45;
            n.data.set([x, y, E, Ee(w, g)], 4 + n.activeRipple * 4);
          }
      }
    }
    if (d || (n.emitting = !1), l > 0) {
      const f = [Math.hypot(r[0], r[1], r[2]), Math.hypot(r[4], r[5], r[6])];
      for (let h = 0; h < 2; h++) {
        const u = (c[h] - n.pose[h]) / Math.max(0.05, f[h]) + (c[h + 2] - n.pose[h + 2]) * 0.7, p = L(u, 0.22), m = Math.max(1, Math.ceil(l / (1 / 120))), w = l / m;
        for (let g = 0; g < m; g++) {
          let b = n.data[h], v = n.velocity[h] + (g === 0 ? p * 4.5 : 0);
          v += (-26 * b - 4.8 * v) * w, b = L(b + v * w, 0.35), n.data[h] = b, n.velocity[h] = L(v, 1.4);
        }
      }
    }
    return n.hovering = !!d, n.time = o, n.pose = c, n.data;
  }
}
const I = 192, k = 512, se = `#version 300 es
precision highp float;
uniform float time;
out vec2 incoming;
${be}
void main(){
 // Include a skirt around the periodic tile: rays from outside can land inside.
 vec2 p=vec2(gl_VertexID%${I + 1},gl_VertexID/${I + 1})/${I}.*2.4-.2;
 vec3 wave=waterField(p,time);
 vec3 normal=normalize(vec3(-wave.xy,1.));
 vec3 ray=refract(vec3(0.,0.,-1.),normal,1./1.333);
 vec2 floorPoint=p+ray.xy/(-ray.z)*(waterDepth+wave.z);
 incoming=p;
 gl_Position=vec4(floorPoint/waterPeriod*2.-1.,0.,1.);
}`, oe = `#version 300 es
precision highp float;
in vec2 incoming;out vec4 color;
void main(){
 // Each fragment receives the area of its source light footprint. Overlapping
 // folds accumulate by additive blending; expanded footprints become darker.
 vec2 dx=dFdx(incoming),dy=dFdy(incoming);
 float flux=abs(dx.x*dy.y-dx.y*dy.x)*${(k / 2) ** 2}.;
 color=vec4(min(flux,8.)/8.,0.,0.,1.);
}`;
class $ {
  constructor(e, t) {
    this.gl = e, this.shader = t ?? M(e, oe, se), this.clock = e.getUniformLocation(this.shader, "time");
    const i = A(e, k, k), o = e.createFramebuffer(), r = e.createVertexArray(), a = e.createBuffer();
    try {
      if (!i || !o || !r || !a) throw Error("Caustics resources unavailable");
      if (e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.REPEAT), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.REPEAT), e.bindFramebuffer(e.FRAMEBUFFER, o), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, i, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
        throw Error("Caustics framebuffer is incomplete");
      e.bindVertexArray(r), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, a);
      const c = new Uint16Array(I * I * 6);
      for (let n = 0; n < I; n++)
        for (let l = 0; l < I; l++) {
          const d = n * (I + 1) + l, f = d + I + 1;
          c.set([d, d + 1, f, f, d + 1, f + 1], (n * I + l) * 6);
        }
      e.bufferData(e.ELEMENT_ARRAY_BUFFER, c, e.STATIC_DRAW), this.map = i, this.framebuffer = o, this.vao = r, this.indices = a;
    } catch (c) {
      throw e.deleteTexture(i), e.deleteFramebuffer(o), e.deleteVertexArray(r), e.deleteBuffer(a), t || e.deleteProgram(this.shader), c;
    } finally {
      e.bindVertexArray(null), e.bindFramebuffer(e.FRAMEBUFFER, null);
    }
  }
  gl;
  map;
  bytes = k * k + I * I * 6 * 2;
  passes = 0;
  shader;
  framebuffer;
  vao;
  indices;
  clock;
  time = NaN;
  static async create(e, t) {
    const i = await B(e, oe, se, t);
    try {
      if (t?.throwIfAborted(), e.isContextLost()) throw Error("Context lost during caustics preparation");
      return K(e, () => new $(e, i));
    } catch (o) {
      throw e.deleteProgram(i), o;
    }
  }
  prepare(e) {
    if (e = Math.fround(e), e === this.time) return;
    const t = this.gl;
    t.bindFramebuffer(t.FRAMEBUFFER, this.framebuffer), t.viewport(0, 0, k, k), t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.disable(t.SCISSOR_TEST), t.colorMask(!0, !0, !0, !0), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.enable(t.BLEND), t.blendEquation(t.FUNC_ADD), t.blendFunc(t.ONE, t.ONE), t.useProgram(this.shader), t.uniform1f(this.clock, e), t.bindVertexArray(this.vao), t.drawElements(t.TRIANGLES, I * I * 6, t.UNSIGNED_SHORT, 0), t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, t.drawingBufferWidth, t.drawingBufferHeight), t.disable(t.BLEND), this.time = e, this.passes++;
  }
  dispose() {
    const e = this.gl;
    e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteVertexArray(this.vao), e.deleteBuffer(this.indices), e.deleteProgram(this.shader);
  }
}
function ye(s, e) {
  let t = 0, i = s, o = e;
  for (; ; ) {
    if (t += i * o * 4, i === 1 && o === 1) return t;
    i = Math.max(1, Math.floor(i / 2)), o = Math.max(1, Math.floor(o / 2));
  }
}
class ne {
  constructor(e, t, i, o = "gpu") {
    this.gl = e, this.scratchLimit = i, this.mode = o, this.store = new ve(t, (r) => e.deleteTexture(r.texture)), this.etcher = new qe(e);
  }
  gl;
  scratchLimit;
  mode;
  store;
  etcher;
  kernels = new ke();
  uploads = 0;
  edgeBuilds = 0;
  readbacks = 0;
  upload(e, t, i = !0, o = 1) {
    const r = this.store.acquire(e);
    if (r) return r;
    const a = this.gl, c = t.width, n = t.height;
    return this.store.create(
      e,
      i ? ye(c, n) : c * n * 4,
      () => {
        const l = A(a, c, n, i ? a.SRGB8_ALPHA8 : a.RGBA8, a.RGBA);
        if (a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, l), a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !0), a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
          const d = document.createElement("canvas");
          d.width = c, d.height = n;
          try {
            d.getContext("2d").drawImage(t, 0, 0), a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, a.RGBA, a.UNSIGNED_BYTE, d);
          } finally {
            d.width = d.height = 0;
          }
        } else
          a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, a.RGBA, a.UNSIGNED_BYTE, t);
        return a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !1), i && (a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR_MIPMAP_LINEAR), a.generateMipmap(a.TEXTURE_2D)), this.uploads++, { texture: l, width: c, height: n, mipmapped: i };
      },
      o
    );
  }
  edge(e, t, i) {
    const o = this.store.acquire(e);
    if (o) return o;
    const r = this.gl, a = t.width, c = t.height;
    if (a * c * 7 > this.scratchLimit) throw Error("Etching exceeds scratch budget");
    return this.store.create(
      e,
      a * c,
      () => {
        let n;
        if (this.mode === "gpu") n = this.etcher.run(t, a, c, i);
        else {
          const l = document.createElement("canvas");
          l.width = a, l.height = c;
          try {
            const d = l.getContext("2d", { willReadFrequently: !0 });
            d.drawImage(t, 0, 0);
            const f = d.getImageData(0, 0, a, c).data, h = this.kernels.etch(
              a,
              c,
              new Uint8Array(f.buffer, f.byteOffset, f.byteLength),
              i
            ), u = new Uint8Array(h.length);
            for (let p = 0; p < c; p++)
              u.set(h.subarray(p * a, (p + 1) * a), (c - 1 - p) * a);
            n = A(r, a, c), r.bindTexture(r.TEXTURE_2D, n), r.pixelStorei(r.UNPACK_ALIGNMENT, 1), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, a, c, r.RED, r.UNSIGNED_BYTE, u);
          } finally {
            l.width = l.height = 0;
          }
        }
        return this.uploads++, this.edgeBuilds++, { texture: n, width: a, height: c };
      },
      0
    );
  }
  uploadBytes(e, t, i) {
    const o = this.store.acquire(e);
    if (o) return o;
    const r = this.gl, [a, c] = i, n = new Uint8Array(t.length);
    for (let l = 0; l < c; l++)
      n.set(t.subarray(l * a * 4, (l + 1) * a * 4), (c - 1 - l) * a * 4);
    return this.store.create(e, a * c * 4, () => {
      const l = A(r, a, c, r.RGBA8, r.RGBA);
      return r.bindTexture(r.TEXTURE_2D, l), r.pixelStorei(r.UNPACK_ALIGNMENT, 1), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, a, c, r.RGBA, r.UNSIGNED_BYTE, n), this.uploads++, { texture: l, width: a, height: c };
    });
  }
  read(e) {
    return this.readbacks++, this.etcher.read(e.texture, e.width, e.height);
  }
  get scratchBytes() {
    return this.etcher.width * this.etcher.height * 7;
  }
  dispose() {
    this.store.dispose(), this.etcher.dispose(), this.kernels.free();
  }
}
const rt = 732;
function it(s, e = _.period) {
  if (!Number.isFinite(s) || s <= 0 || !Number.isFinite(e) || e < 2 || e > 16)
    throw RangeError("Invalid print-dot period or face width");
  return e * s / rt;
}
const _ = Object.freeze({
  amount: 0.35,
  period: 2,
  variation: 0.5,
  inset: 0.035,
  artwork: !0
});
function O(s) {
  return [
    s ? s.amount ?? _.amount : 0,
    s?.period ?? _.period,
    s?.variation ?? _.variation,
    s?.inset ?? _.inset
  ];
}
function Ie(s) {
  const e = new Float32Array(32);
  return s.forEach(([t, i, o, r], a) => e.set([t, 1 - i - r, t + o, 1 - i], a * 4)), e;
}
const ce = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`, z = `#version 300 es
#define PRINT_DOT_ART_WINDOWS
#define GLINT_PRINT_FACE(uv) textureLod(face,uv,0.)
precision highp float;
in vec2 uv;out vec4 color;uniform sampler2D face;
#ifdef GLINT_REDUCED_PRINT
uniform float printTargetWidth;
#endif
vec3 previewInk(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 previewLinear(vec3 c){return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c));}
${xe.replace("flat in vec4 printDotsInfo;", "uniform vec4 printDotsInfo;")}
void main(){
 #ifdef GLINT_REDUCED_PRINT
 printFootprint=(float(textureSize(face,0).x)/printTargetWidth)/printDotPeriodTexels();
 #else
 printFootprint=1./printDotPeriodTexels();
 #endif
 // Fine screens need pixel-area coverage before they enter the mip chain.
 // Sample only the ink screen: averaging source texels would soften lettering.
 // This pass is cached per printing/settings, never rerun for pointer motion.
 if(printDotPeriodTexels()<4.){
  vec4 source=textureLod(face,uv,0.);vec3 ink=previewInk(source.rgb),sum=vec3(0.);
  vec2 pixel=1./vec2(textureSize(face,0));
  // Validated periods are positive. Keep the four area samples in a uniform
  // loop so D3D compilers do not clone the entire CMYK filter four times.
  int sampleEnd=printDotsInfo.y<0.?0:2;
  for(int y=0;y<sampleEnd;y++)for(int x=0;x<sampleEnd;x++){
   vec2 offset=(vec2(float(x),float(y))-.5)*.5;
   sum+=previewLinear(printDotInk(ink,uv+offset*pixel));
  }
  color=vec4(sum*.25,source.a);
 }else color=printFace(uv);
}`, le = 16 * 1024 * 1024, fe = (s, e) => 1 / it(s.width, e) >= 0.9;
function Te(s, e, t) {
  const i = O(t);
  return !!(s.mipmapped && (!e || e.mipmapped) && (i[0] <= 0 || fe(s, i[1]) && (!e || fe(e, i[1]))));
}
class Y {
  constructor(e, t, i = "full") {
    this.gl = e, this.quality = i, this.shader = t ?? M(e, z, ce);
    const o = e.createFramebuffer(), r = e.createVertexArray();
    if (!o || !r)
      throw e.deleteFramebuffer(o), e.deleteVertexArray(r), t || e.deleteProgram(this.shader), Error("Printing resources unavailable");
    this.framebuffer = o, this.vao = r;
  }
  gl;
  quality;
  shader;
  framebuffer;
  vao;
  entries = [];
  invisible = /* @__PURE__ */ new WeakMap();
  frame = 0;
  bytes = 0;
  passes = 0;
  static async create(e, t, i = "full") {
    const o = i === "reduced" ? z.replace(
      "#version 300 es",
      `#version 300 es
#define GLINT_PRINT_PROCEDURAL
#define GLINT_REDUCED_PRINT`
    ) : z, r = await B(e, o, ce, t);
    try {
      if (t?.throwIfAborted(), e.isContextLost()) throw Error("Context lost during printing preparation");
      return K(e, () => new Y(e, r, i));
    } catch (a) {
      throw e.deleteProgram(r), a;
    }
  }
  outputSize(e) {
    const t = this.quality === "reduced" ? Math.min(488, e.width) : e.width;
    return [t, Math.max(1, Math.round(e.height * t / e.width))];
  }
  outputBytes(e) {
    const [t, i] = this.outputSize(e);
    return ye(t, i);
  }
  /** Protect the active working set. Overflow uses the existing procedural path
   * instead of evicting and rebuilding the same printing on every frame. */
  beginFrame() {
    this.frame++;
  }
  prepare(e, t, i, o = [], r) {
    const a = O(i);
    if (Te(e, t, i)) {
      const u = this.invisible.get(e.texture);
      if (u && u.overlay?.texture === t?.texture) return u;
      const p = {
        source: e,
        overlay: t,
        settings: "invisible",
        face: e,
        top: t,
        bytes: 0,
        lastFrame: this.frame
      };
      return this.invisible.set(e.texture, p), p;
    }
    const c = i.artwork !== !1, n = JSON.stringify([a, c, c ? [] : o]), l = this.entries.findIndex(
      (u) => u.source.texture === e.texture && u.overlay?.texture === t?.texture && u.settings === n
    );
    if (l >= 0) {
      const u = this.entries.splice(l, 1)[0];
      return u.lastFrame = this.frame, this.entries.push(u), u;
    }
    const d = this.outputBytes(e) + (t ? this.outputBytes(t) : 0);
    if (d > le) return;
    for (; this.bytes + d > le; ) {
      const u = this.entries.findIndex(
        (m) => (this.frame === 0 || m.lastFrame < this.frame - 1) && (!r || r(m))
      );
      if (u < 0) return;
      const p = this.entries.splice(u, 1)[0];
      this.release(p);
    }
    let f, h;
    try {
      f = this.paint(e, a, o, c), t && (h = this.paint(t, a, o, c));
      const u = { source: e, overlay: t, settings: n, face: f, top: h, bytes: d, lastFrame: this.frame };
      return this.entries.push(u), this.bytes += d, u;
    } catch (u) {
      throw this.gl.deleteTexture(f?.texture ?? null), this.gl.deleteTexture(h?.texture ?? null), u;
    }
  }
  /** Uncached native preparation. The caller owns and deletes the returned texture. */
  paint(e, t, i = [], o = !0) {
    const r = this.gl, [a, c] = this.outputSize(e), n = A(r, a, c, r.SRGB8_ALPHA8, r.RGBA);
    try {
      if (r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, n, 0), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE)
        throw Error("Printed ink framebuffer is incomplete");
      return r.viewport(0, 0, a, c), r.disable(r.DEPTH_TEST), r.disable(r.CULL_FACE), r.disable(r.SCISSOR_TEST), r.disable(r.BLEND), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.useProgram(this.shader), r.bindVertexArray(this.vao), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, e.texture), r.uniform1i(r.getUniformLocation(this.shader, "face"), 0), this.quality === "reduced" && r.uniform1f(r.getUniformLocation(this.shader, "printTargetWidth"), a), r.uniform4fv(r.getUniformLocation(this.shader, "printDotsInfo"), t), r.uniform4fv(
        r.getUniformLocation(this.shader, "printArtBounds[0]"),
        Ie(i)
      ), r.uniform1f(r.getUniformLocation(this.shader, "printArtwork"), o ? 1 : 0), r.drawArrays(r.TRIANGLES, 0, 3), this.passes++, r.bindTexture(r.TEXTURE_2D, n), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR_MIPMAP_LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.generateMipmap(r.TEXTURE_2D), { texture: n, width: a, height: c };
    } catch (l) {
      throw r.deleteTexture(n), l;
    } finally {
      r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, null, 0), r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(null), r.viewport(0, 0, r.drawingBufferWidth, r.drawingBufferHeight);
    }
  }
  release(e) {
    this.gl.deleteTexture(e.face.texture), this.gl.deleteTexture(e.top?.texture ?? null), this.bytes -= e.bytes;
  }
  dispose() {
    for (const e of this.entries) this.release(e);
    this.entries = [], this.gl.deleteProgram(this.shader), this.gl.deleteFramebuffer(this.framebuffer), this.gl.deleteVertexArray(this.vao);
  }
}
const de = {
  regular: 0,
  etched: 1,
  prismatic: 2,
  cold: 3,
  opal: 4,
  rain: 5,
  heat: 6,
  pool: 7,
  gloss: 8,
  holofoil: 9
}, R = 49;
class he {
  constructor(e, t, i, o) {
    this.canvas = e, this.invalidate = t, this.onError = i;
    const r = e.getContext("webgl2", {
      alpha: !0,
      antialias: !0,
      premultipliedAlpha: !1,
      preserveDrawingBuffer: !0
    });
    if (!r) throw Error("WebGL2 is required");
    this.gl = r, this.finishQuality = He(r, o), this.vao = r.createVertexArray(), this.quad = r.createBuffer(), this.instances = r.createBuffer(), this.blank = A(r, 1, 1, r.RGBA8, r.RGBA), r.bindTexture(r.TEXTURE_2D, this.blank), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, 1, 1, r.RGBA, r.UNSIGNED_BYTE, new Uint8Array(4)), r.bindVertexArray(this.vao), r.bindBuffer(r.ARRAY_BUFFER, this.quad), r.bufferData(
      r.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      r.STATIC_DRAW
    ), r.enableVertexAttribArray(0), r.vertexAttribPointer(0, 2, r.FLOAT, !1, 0, 0), r.bindBuffer(r.ARRAY_BUFFER, this.instances);
    for (let a = 0; a < 4; a++)
      r.enableVertexAttribArray(1 + a), r.vertexAttribPointer(1 + a, 4, r.FLOAT, !1, R * 4, a * 16), r.vertexAttribDivisor(1 + a, 1);
    r.enableVertexAttribArray(5), r.vertexAttribPointer(5, 3, r.FLOAT, !1, R * 4, 64), r.vertexAttribDivisor(5, 1), r.enableVertexAttribArray(6), r.vertexAttribPointer(6, 1, r.FLOAT, !1, R * 4, 76), r.vertexAttribDivisor(6, 1);
    for (let a = 7; a <= 11; a++)
      r.enableVertexAttribArray(a), r.vertexAttribPointer(a, 4, r.FLOAT, !1, R * 4, 80 + (a - 7) * 16), r.vertexAttribDivisor(a, 1);
    r.enableVertexAttribArray(12), r.vertexAttribPointer(12, 2, r.FLOAT, !1, R * 4, 160), r.vertexAttribDivisor(12, 1), r.enableVertexAttribArray(13), r.vertexAttribPointer(13, 1, r.FLOAT, !1, R * 4, 168), r.vertexAttribDivisor(13, 1), r.enableVertexAttribArray(14), r.vertexAttribPointer(14, 4, r.FLOAT, !1, R * 4, 172), r.vertexAttribDivisor(14, 1), r.enableVertexAttribArray(15), r.vertexAttribPointer(15, 2, r.FLOAT, !1, R * 4, 188), r.vertexAttribDivisor(15, 1), r.bindVertexArray(null);
  }
  canvas;
  invalidate;
  onError;
  gl;
  finishQuality;
  programs = /* @__PURE__ */ new Map();
  image;
  imagePending;
  lifetime = new AbortController();
  reported = /* @__PURE__ */ new Set();
  compiling = 0;
  vao;
  quad;
  instances;
  blank;
  disposed = !1;
  instanceCapacity = 0;
  staging = new Float32Array();
  motion = new ae();
  caustics;
  cardstock;
  printedInk;
  // An entry can serve several finishes. Do not evict it until every affected
  // analytic fallback is ready; this keeps lazy compilation out of warm draws.
  printingUsers = /* @__PURE__ */ new WeakMap();
  causticsPending;
  cardstockPending;
  printedInkPending;
  uniforms = /* @__PURE__ */ new WeakMap();
  frameUniforms = /* @__PURE__ */ new Map();
  bounds = /* @__PURE__ */ new WeakMap();
  draws = 0;
  activePrint(e) {
    return !!(e.printDots && (e.printDots.amount ?? _.amount) > 0);
  }
  visiblePrint(e, t) {
    return this.activePrint(t) && !Te(e.face, e.overlay, t.printDots);
  }
  key(e, t, i) {
    return `${t ?? "regular"}:${!!e.hologram?.strength}:${i}`;
  }
  changed = () => {
    !this.disposed && !this.gl.isContextLost() && this.invalidate?.();
  };
  report = (e) => {
    this.disposed || this.gl.isContextLost() || this.reported.has(e) || (this.reported.add(e), this.onError?.(e));
  };
  compile(e, t, i) {
    const o = this.key(e, t, i);
    let r = this.programs.get(o);
    if (!r) {
      this.compiling++;
      const a = {
        promise: Promise.resolve().then(
          () => B(
            this.gl,
            et(
              de[t ?? "regular"],
              !!e.hologram?.strength,
              i,
              this.finishQuality
            ),
            re,
            this.lifetime.signal
          )
        )
      };
      a.promise = a.promise.then((c) => {
        if (this.disposed)
          throw this.gl.isContextLost() || this.gl.deleteProgram(c), this.lifetime.signal.reason;
        return a.value = c, this.changed(), c;
      }).finally(() => this.compiling--), this.programs.set(o, r = a);
    }
    return r.promise;
  }
  async prepare(e, t, i) {
    const o = e.recipe;
    if (i?.throwIfAborted(), this.disposed) throw Error("Device disposed");
    const r = [];
    t.length || r.push(this.compile(o, "regular", !1));
    const a = /* @__PURE__ */ new Set();
    for (const n of t) {
      const l = this.key(o, n.finish, !1);
      a.has(l) || (a.add(l), r.push(this.compile(o, n.finish, !1)));
    }
    t.some((n) => n.finish === "pool") && (this.causticsPending || this.compiling++, this.causticsPending ??= Promise.resolve().then(() => $.create(this.gl, this.lifetime.signal)).then((n) => {
      if (this.disposed)
        throw this.gl.isContextLost() || n.dispose(), this.lifetime.signal.reason;
      return this.caustics = n, this.changed(), n;
    }).finally(() => this.compiling--), r.push(this.causticsPending)), t.some(
      (n) => n.finish && n.finish !== "regular" && (n.cardstock?.amount ?? 0) > 0
    ) && (this.cardstockPending || this.compiling++, this.cardstockPending ??= Promise.resolve().then(() => j.create(this.gl, this.lifetime.signal, this.finishQuality)).then((n) => {
      if (this.disposed)
        throw this.gl.isContextLost() || n.dispose(), this.lifetime.signal.reason;
      return this.cardstock = n, this.changed(), n;
    }).finally(() => this.compiling--), r.push(this.cardstockPending)), t.some((n) => this.visiblePrint(e, n)) && (this.printedInkPending || this.compiling++, this.printedInkPending ??= Promise.resolve().then(() => Y.create(this.gl, this.lifetime.signal, this.finishQuality)).then((n) => {
      if (this.disposed)
        throw this.gl.isContextLost() || n.dispose(), this.lifetime.signal.reason;
      return this.printedInk = n, this.changed(), n;
    }).finally(() => this.compiling--), r.push(this.printedInkPending));
    const c = Promise.all(r).then(async () => {
      i?.throwIfAborted(), this.lifetime.signal.throwIfAborted(), t.some((n) => this.visiblePrint(e, n)) && !this.printing(e, t) && await Promise.all(
        t.filter((n) => this.visiblePrint(e, n)).map((n) => this.compile(o, n.finish, !0))
      );
    });
    if (!i) return c;
    await new Promise((n, l) => {
      const d = () => l(i.reason);
      i.addEventListener("abort", d, { once: !0 }), i.aborted && d(), c.then(n, l).finally(() => i.removeEventListener("abort", d));
    });
  }
  prepareLayers() {
    return this.disposed ? Promise.reject(Error("Device disposed")) : (this.imagePending || this.compiling++, this.imagePending ??= Promise.resolve().then(() => B(this.gl, tt, re, this.lifetime.signal)).then((e) => {
      if (this.disposed)
        throw this.gl.isContextLost() || this.gl.deleteProgram(e), this.lifetime.signal.reason;
      return this.image = e, this.changed(), e;
    }).finally(() => this.compiling--));
  }
  get pending() {
    return this.compiling;
  }
  begin(e) {
    this.motion.begin(), this.printedInk?.beginFrame(), this.frameUniforms.clear();
    const t = this.gl;
    t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, this.canvas.width, this.canvas.height), t.disable(t.SCISSOR_TEST), t.disable(t.CULL_FACE), t.colorMask(!0, !0, !0, !0), t.depthMask(!0), t.clearDepth(1), t.clearColor(...e.clear ?? [0, 0, 0, 0]), t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT), this.draws = 0;
  }
  uniform(e, t) {
    let i = this.uniforms.get(e);
    return i || this.uniforms.set(e, i = /* @__PURE__ */ new Map()), i.has(t) || i.set(t, this.gl.getUniformLocation(e, t)), i.get(t);
  }
  bind(e, t, i, o = !1) {
    const r = this.gl;
    r.useProgram(e), r.bindVertexArray(this.vao), r.bindBuffer(r.ARRAY_BUFFER, this.instances);
    const a = i.length * R;
    this.staging.length < a && (this.staging = new Float32Array(a));
    const c = this.staging;
    if (i.forEach((n, l) => {
      const d = l * R;
      c.set(n.transform, d), c.set(n.normal ?? [0, 0, 1], d + 16), c[d + 19] = de[n.finish ?? "regular"];
      const f = this.motion.sample(n, t);
      f ? c.set(f, d + 20) : c.fill(0, d + 20, d + R), c[d + 22] = W(n.id), c[d + 23] = n.deformation?.amount ?? 0, c[d + 40] = n.wear?.amount ?? 0, c[d + 41] = W(n.wear?.seed ?? n.id), c[d + 42] = n.cardstock?.amount ?? 0;
      const h = n.printDots;
      c[d + 43] = o || !h ? 0 : h.amount ?? _.amount, c[d + 44] = h?.period ?? _.period, c[d + 45] = h?.variation ?? _.variation, c[d + 46] = h?.inset ?? _.inset, c[d + 47] = n.rainFog ?? 1, c[d + 48] = n.printDots?.artwork === !1 ? 0 : 1;
    }), this.instanceCapacity < a && (this.instanceCapacity = a, r.bufferData(r.ARRAY_BUFFER, a * 4, r.DYNAMIC_DRAW)), r.bufferSubData(r.ARRAY_BUFFER, 0, c, 0, a), this.frameUniforms.get(e) !== t) {
      r.uniformMatrix4fv(this.uniform(e, "viewProjection"), !1, t.viewProjection);
      const n = t.lighting === "studio" ? [0.5, 0.5] : t.pointer ?? [0.5, 0.5];
      r.uniform2f(this.uniform(e, "pointer"), n[0], 1 - n[1]), r.uniform1f(this.uniform(e, "surfaceTime"), t.time ?? 0), r.uniform1f(this.uniform(e, "studioLighting"), t.lighting === "studio" ? 1 : 0), this.frameUniforms.set(e, t);
    }
  }
  printing(e, t) {
    const i = t[0]?.printDots, o = O(i);
    if (!(i && o[0] > 0 && (t.length === 1 || t.every(
      (c) => O(c.printDots).every((n, l) => n === o[l]) && c.printDots?.artwork !== !1 == (i.artwork !== !1)
    )))) return;
    const a = this.printedInk?.prepare(
      e.face,
      e.overlay,
      i,
      e.recipe.artWindows,
      (c) => {
        const n = this.printingUsers.get(c);
        return !!(n && [...n].every((l) => this.programs.get(l)?.value));
      }
    );
    if (a) {
      let c = this.printingUsers.get(a);
      c || this.printingUsers.set(a, c = /* @__PURE__ */ new Set());
      for (const n of t) c.add(this.key(e.recipe, n.finish, !0));
    }
    return a;
  }
  draw(e, t, i) {
    const o = this.gl, r = i.some((x) => this.visiblePrint(e, x)), a = i.some((x) => x.finish === "pool"), c = i.some(
      (x) => x.finish && x.finish !== "regular" && (x.cardstock?.amount ?? 0) > 0
    ), n = this.programs.get(this.key(e.recipe, i[0]?.finish, !1))?.value, l = r ? this.programs.get(this.key(e.recipe, i[0]?.finish, !0))?.value : void 0;
    if (!n || a && !this.caustics || c && !this.cardstock || r && !this.printedInk) {
      this.prepare(e, i).catch(this.report);
      return;
    }
    a && this.caustics.prepare(t.time ?? 0), c && this.cardstock.prepare();
    const d = r ? this.printing(e, i) : void 0, f = r && !d ? l : n;
    if (!f) {
      this.prepare(e, i).catch(this.report);
      return;
    }
    this.bind(f, t, i, !r || !!d), o.enable(o.DEPTH_TEST), o.depthFunc(o.LEQUAL), o.depthMask(!0), o.disable(o.BLEND), [
      ["face", d?.face.texture ?? e.face.texture],
      ["mask", e.mask.texture],
      ["overlay", d?.top?.texture ?? e.overlay?.texture ?? this.blank],
      ["coverage", e.coverage?.texture ?? this.blank],
      ["caustics", this.caustics?.map ?? this.blank],
      ["hologramMask", e.hologram?.texture ?? this.blank],
      ["cardstockMap", this.cardstock?.map ?? this.blank]
    ].forEach(([x, y], E) => {
      o.activeTexture(o.TEXTURE0 + E), o.bindTexture(o.TEXTURE_2D, y), o.uniform1i(this.uniform(f, x), E);
    });
    let u = this.bounds.get(e.recipe);
    u || this.bounds.set(e.recipe, u = Ie(e.recipe.artWindows)), o.uniform4fv(this.uniform(f, "artBounds[0]"), u), o.uniform4fv(this.uniform(f, "printArtBounds[0]"), u), o.uniform1f(this.uniform(f, "finishBase"), e.recipe.finishCoverageBase ?? 1);
    const p = e.recipe.hologram, [m, w, g, b] = p?.rect ?? [0, 0, 1, 1];
    o.uniform4f(this.uniform(f, "hologramRect"), m, 1 - w - b, g, b), o.uniform2f(
      this.uniform(f, "hologramMaterial"),
      p?.strength ?? 0,
      (p?.seed ?? 0) / 4294967295
    );
    const v = e.recipe.overlayFoil;
    o.uniform2f(
      this.uniform(f, "overlayFoil"),
      v ? { gold: 1, silver: 3, prismatic: 2 }[v.tone] : 0,
      v?.strength ?? 0
    ), o.uniform1f(this.uniform(f, "cornerRadius"), e.recipe.cornerRadius), o.uniform1f(this.uniform(f, "aspect"), e.face.height / e.face.width), o.uniform1f(this.uniform(f, "hasMask"), 1), o.uniform1f(this.uniform(f, "satinCompact"), 1), o.uniform1f(this.uniform(f, "satinHoverGain"), 0), o.drawArraysInstanced(o.TRIANGLES, 0, 6, i.length), this.draws++;
  }
  drawLayer(e, t, i) {
    const o = this.gl, r = this.image;
    if (!r) {
      this.prepareLayers().catch(this.report);
      return;
    }
    this.bind(r, i, [{ id: 0, card: 0, transform: e.transform }]), e.depth === "ignore" ? o.disable(o.DEPTH_TEST) : (o.enable(o.DEPTH_TEST), o.depthFunc(o.LEQUAL)), o.depthMask(e.depth === "test-write"), o.enable(o.BLEND), o.blendFuncSeparate(o.SRC_ALPHA, o.ONE_MINUS_SRC_ALPHA, o.ONE, o.ONE_MINUS_SRC_ALPHA), o.activeTexture(o.TEXTURE0), o.bindTexture(o.TEXTURE_2D, t.texture), o.uniform1i(this.uniform(r, "face"), 0), o.drawArraysInstanced(o.TRIANGLES, 0, 6, 1), this.draws++, o.depthMask(!0), o.disable(o.BLEND);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0, this.lifetime.abort(new DOMException("Device disposed", "AbortError")), this.motion.clear();
    const e = this.gl;
    if (!e.isContextLost()) {
      for (const t of this.programs.values()) t.value && e.deleteProgram(t.value);
      this.image && e.deleteProgram(this.image), e.deleteVertexArray(this.vao), e.deleteBuffer(this.quad), e.deleteBuffer(this.instances), e.deleteTexture(this.blank), this.caustics?.dispose(), this.cardstock?.dispose(), this.printedInk?.dispose();
    }
  }
  get surfacePasses() {
    return (this.caustics?.passes ?? 0) + (this.cardstock?.passes ?? 0) + (this.printedInk?.passes ?? 0);
  }
  get surfaceBytes() {
    return (this.caustics?.bytes ?? 0) + (this.cardstock?.bytes ?? 0) + (this.printedInk?.bytes ?? 0);
  }
  end() {
    this.motion.end();
  }
  resetMotion() {
    this.motion.clear();
  }
  isolateMotion() {
    const e = this.motion;
    return this.motion = new ae(), () => {
      this.motion = e;
    };
  }
}
const at = `#version 300 es
precision highp float;
uniform sampler2D inputMask;uniform vec2 size;uniform vec4 cover;uniform vec4 clip;
uniform vec4 crop;uniform float alphaChannel;uniform float angle;
out vec4 color;
void main(){
 vec2 pixel=vec2(gl_FragCoord.x,size.y-gl_FragCoord.y);vec2 uv=pixel/size;
 vec2 amount=max(vec2(0.),min(pixel+.5,(clip.xy+clip.zw)*size)-max(pixel-.5,clip.xy*size));
 vec2 local=(uv-cover.xy)/cover.zw;
 if(angle<0.)local=vec2(1.-local.y,local.x);else if(angle>0.)local=vec2(local.y,1.-local.x);
 vec2 source=local*crop.zw+crop.xy;
 vec4 sampleValue=texture(inputMask,vec2(source.x,1.-source.y));
 float a=mix(sampleValue.r,sampleValue.a,alphaChannel)*amount.x*amount.y;
 color=vec4(a,0.,0.,a);
}`;
class st {
  constructor(e) {
    this.textures = e;
    const t = e.gl;
    this.shader = M(t, at), this.fbo = t.createFramebuffer(), this.vao = t.createVertexArray();
  }
  textures;
  shader;
  fbo;
  vao;
  disposed = !1;
  builds = 0;
  compose(e, t, i, o) {
    const r = this.textures.store.acquire(e);
    if (r) return r;
    const a = this.textures.gl, [c, n] = t;
    return this.textures.store.create(e, c * n, () => {
      const l = A(a, c, n);
      try {
        if (a.bindFramebuffer(a.FRAMEBUFFER, this.fbo), a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, l, 0), a.checkFramebufferStatus(a.FRAMEBUFFER) !== a.FRAMEBUFFER_COMPLETE)
          throw Error("Mask framebuffer unavailable");
        a.bindVertexArray(this.vao), a.viewport(0, 0, c, n), a.disable(a.DEPTH_TEST), a.disable(a.SCISSOR_TEST), a.disable(a.DITHER), a.colorMask(!0, !0, !0, !0), a.clearColor(0, 0, 0, 0), a.clear(a.COLOR_BUFFER_BIT), a.useProgram(this.shader), a.enable(a.BLEND), a.blendFunc(a.ONE, a.ONE_MINUS_SRC_ALPHA);
        const d = (f, h, u, p, m, w = 0) => {
          a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, f.texture), a.uniform1i(a.getUniformLocation(this.shader, "inputMask"), 0), a.uniform2f(a.getUniformLocation(this.shader, "size"), c, n), a.uniform4fv(a.getUniformLocation(this.shader, "cover"), h), a.uniform4fv(a.getUniformLocation(this.shader, "clip"), u), a.uniform4fv(a.getUniformLocation(this.shader, "crop"), p), a.uniform1f(a.getUniformLocation(this.shader, "alphaChannel"), m ? 1 : 0), a.uniform1f(a.getUniformLocation(this.shader, "angle"), w), a.drawArrays(a.TRIANGLES, 0, 3);
        };
        o && d(o, [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1], !0);
        for (const { value: f, spec: h } of i) {
          const [u, p, m, w] = h.destination, g = h.rotation ?? 0, b = f.width * h.crop[2], v = f.height * h.crop[3];
          let x;
          if (h.fit) {
            const y = h.fit.focalPoint ?? [0.5, 0.5], E = {
              ...h.fit,
              focalPoint: g === 90 ? [1 - y[1], y[0]] : g === -90 ? [y[1], 1 - y[0]] : y
            }, N = _e(
              g ? v : b,
              g ? b : v,
              [u * c, p * n, m * c, w * n],
              E
            );
            x = [N[0] / c, N[1] / n, N[2] / c, N[3] / n];
          } else {
            const y = Math.max(
              m * c / (g ? v : b),
              w * n / (g ? b : v)
            ), E = (g ? v : b) * y / c, N = (g ? b : v) * y / n;
            x = [u + (m - E) / 2, p + (w - N) / 2, E, N];
          }
          d(f, x, h.clip, h.crop, !!h.importedMask, g);
        }
        this.builds++;
      } catch (d) {
        throw a.deleteTexture(l), d;
      } finally {
        a.disable(a.BLEND), a.bindFramebuffer(a.FRAMEBUFFER, null), a.bindVertexArray(null);
      }
      return { texture: l, width: c, height: n };
    });
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    const e = this.textures.gl;
    e.deleteProgram(this.shader), e.deleteFramebuffer(this.fbo), e.deleteVertexArray(this.vao);
  }
}
async function C(s, e, t, i) {
  t.throwIfAborted();
  const o = await s.paint(e, t, i);
  if (o.width !== s.size[0] || o.height !== s.size[1] || t.aborted)
    throw T(o), t.throwIfAborted(), Error("Raster dimensions differ from recipe");
  if ("getContext" in o) return o;
  const r = V(s.size);
  try {
    const a = r.getContext("2d");
    if (!a) throw Error("Canvas2D raster unavailable");
    return a.drawImage(o, 0, 0), r;
  } catch (a) {
    throw T(r), a;
  } finally {
    o.close();
  }
}
function X(s) {
  const e = s.layers ?? [], t = Se(
    JSON.stringify(
      e.map((i) => ({
        id: i.id,
        stage: i.stage,
        order: i.order,
        contributesToEtch: i.contributesToEtch ?? !1
      }))
    )
  );
  return Array.from(t, (i) => e[i]);
}
function P(s) {
  return JSON.stringify(s.map((e) => [e.id, e.stage, e.order, e.raster.key, e.clip]));
}
async function U(s, e, t, i, o = V(s)) {
  const r = o.getContext("2d");
  try {
    for (const a of e) {
      const c = await C(a.raster, t, i);
      try {
        if (r.save(), a.clip) {
          r.beginPath();
          const [n, l, d, f] = a.clip;
          r.rect(n * s[0], l * s[1], d * s[0], f * s[1]), r.clip();
        }
        r.drawImage(c, 0, 0, ...s), r.restore();
      } finally {
        T(c);
      }
    }
    return o;
  } catch (a) {
    throw T(o), a;
  }
}
async function ot(s, e, t, i) {
  const o = V(s), r = o.getContext("2d", { willReadFrequently: !0 }), a = r.createImageData(...s);
  try {
    for (const c of e) {
      const n = [
        c.finishCoverage?.add,
        c.finishCoverage?.exclude,
        c.etchCoverage?.add,
        c.etchCoverage?.exclude
      ];
      for (let l = 0; l < 4; l++) {
        const d = n[l];
        if (!d) continue;
        const f = await U(s, [{ ...c, raster: d }], t, i);
        try {
          const h = f.getContext("2d").getImageData(0, 0, ...s).data;
          for (let u = 0; u < h.length; u += 4)
            a.data[u + l] = Math.max(a.data[u + l], h[u + 3]);
        } finally {
          T(f);
        }
      }
    }
    return T(o), new Uint8Array(a.data.buffer);
  } catch (c) {
    throw T(o), c;
  }
}
class ue {
  constructor(e, t) {
    this.textures = e, this.assets = t, this.masks = new st(e);
  }
  textures;
  assets;
  masks;
  pending = /* @__PURE__ */ new Map();
  compositions = 0;
  async ensure(e, t) {
    const i = this.textures.store.acquire(e);
    if (i) return i;
    let o = this.pending.get(e);
    o || (o = t().then((a) => a.release()).finally(() => this.pending.delete(e)), this.pending.set(e, o)), await o;
    const r = this.textures.store.acquire(e);
    if (!r) throw Error("Prepared working set exceeds GPU budget");
    return r;
  }
  async prepare(e, t) {
    const { recipe: i } = e, o = i.color.size, r = X(e), a = [], c = r.filter((v) => v.stage === "under-art"), n = r.filter((v) => v.stage === "printed-content" || v.stage === "under-finish"), l = r.filter((v) => v.stage === "over-finish"), d = r.filter((v) => v.contributesToEtch), f = r.filter((v) => v.finishCoverage || v.etchCoverage), h = `${i.pack}:`, u = h + JSON.stringify(["color-v1", i.color.key, P([...c, ...n])]), p = h + JSON.stringify(["mask-v1", o, i.edges, i.stamp?.key, P(d)]), m = l.length ? h + JSON.stringify(["over-v1", o, P(l)]) : void 0, w = f.length ? h + JSON.stringify([
      "coverage-v1",
      o,
      f.map((v) => [
        v.clip,
        v.finishCoverage?.add?.key,
        v.finishCoverage?.exclude?.key,
        v.etchCoverage?.add?.key,
        v.etchCoverage?.exclude?.key
      ])
    ]) : void 0, g = i.hologram ? h + JSON.stringify(["hologram-v1", i.hologram.mask.key, i.hologram.mask.size]) : void 0, b = JSON.stringify(
      i.hologram ? [i.hologram.rect, i.hologram.strength, i.hologram.seed ?? 0] : null
    );
    try {
      return a.push(
        await this.ensure(u, async () => {
          const v = c.length ? await U(o, c, this.assets, t) : void 0;
          let x;
          try {
            return x = await C(i.color, this.assets, t, v), await U(o, n, this.assets, t, x), t.throwIfAborted(), this.compositions++, this.textures.upload(u, x);
          } finally {
            v && T(v), x && T(x);
          }
        })
      ), a.push(await this.prepareMask(e, t)), m && a.push(
        await this.ensure(m, async () => {
          const v = await U(o, l, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(m, v);
          } finally {
            T(v);
          }
        })
      ), w && a.push(
        await this.ensure(w, async () => {
          const v = await ot(o, f, this.assets, t);
          return t.throwIfAborted(), this.textures.uploadBytes(w, v, o);
        })
      ), g && a.push(
        await this.ensure(g, async () => {
          const v = await C(i.hologram.mask, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(g, v, !1);
          } finally {
            T(v);
          }
        })
      ), t.throwIfAborted(), { color: u, mask: p, overlay: m, coverage: w, hologram: g, hologramSettings: b, document: e };
    } finally {
      for (const v of a) v.release();
    }
  }
  async prepareMask(e, t) {
    const { recipe: i } = e, o = i.color.size, r = X(e).filter((n) => n.contributesToEtch), a = `${i.pack}:`, c = a + JSON.stringify(["mask-v1", o, i.edges, i.stamp?.key, P(r)]);
    return this.ensure(c, async () => {
      const n = [], l = [];
      try {
        for (const f of i.edges) {
          const h = a + JSON.stringify([
            "edge-integer-v1",
            f.key,
            f.asset,
            f.importedMask,
            f.threshold
          ]), u = await this.ensure(h, async () => {
            const p = f.importedMask ?? f.asset, m = await this.assets.images([p], t);
            try {
              t.throwIfAborted();
              const w = m.value.get(p.url);
              if (!w) throw Error(`Edge asset unavailable: ${p.url}`);
              return f.importedMask ? this.textures.upload(h, w, !1, 0) : this.textures.edge(h, w, f.threshold);
            } finally {
              m.release();
            }
          });
          l.push(u), n.push({ value: u.value, spec: f });
        }
        for (const f of r) {
          const h = a + JSON.stringify(["contribution-v1", o, P([f])]), u = await this.ensure(h, async () => {
            const p = await U(o, [f], this.assets, t);
            try {
              return t.throwIfAborted(), this.textures.edge(h, p, 20);
            } finally {
              T(p);
            }
          });
          l.push(u), n.push({
            value: u.value,
            spec: {
              key: h,
              asset: { url: "" },
              crop: [0, 0, 1, 1],
              destination: [0, 0, 1, 1],
              clip: [0, 0, 1, 1],
              threshold: 20
            }
          });
        }
        let d;
        if (i.stamp) {
          const f = i.stamp, h = a + JSON.stringify(["stamp-v1", f.key]);
          d = await this.ensure(h, async () => {
            const u = await C(f, this.assets, t);
            try {
              return t.throwIfAborted(), this.textures.upload(h, u, !1, 0);
            } finally {
              T(u);
            }
          }), l.push(d);
        }
        return t.throwIfAborted(), this.masks.compose(c, o, n, d?.value);
      } finally {
        for (const d of l) d.release();
      }
    });
  }
  dispose() {
    this.masks.dispose();
  }
}
const G = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
let H;
class nt {
  constructor(e) {
    if (this.options = e, this.budgets = {
      gpuBytes: 64 * 1024 * 1024,
      cpuBytes: 32 * 1024 * 1024,
      scratchBytes: 16 * 1024 * 1024,
      preparationConcurrency: 2,
      ...e.budgets
    }, !Number.isInteger(this.budgets.preparationConcurrency) || this.budgets.preparationConcurrency < 1 || this.budgets.preparationConcurrency > 4)
      throw RangeError("Preparation concurrency must be 1–4");
    this.assets = new ze(this.budgets.cpuBytes), this.device = new he(
      e.canvas,
      e.invalidate,
      e.onError,
      e.finishQuality
    ), this.textures = new ne(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      e.etching
    ), this.preparer = new ue(this.textures, e.rasterHost ?? this.assets), e.canvas.addEventListener("webglcontextlost", this.contextLost), e.canvas.addEventListener("webglcontextrestored", this.contextRestored);
  }
  options;
  abiVersion = 1;
  assets;
  device;
  textures;
  preparer;
  scene = new De();
  documents = /* @__PURE__ */ new Map();
  prepared = /* @__PURE__ */ new Map();
  jobs = /* @__PURE__ */ new Map();
  revisionControllers = /* @__PURE__ */ new WeakMap();
  instances = [];
  sceneLayers = [];
  sceneLayerGeneration = 0;
  sceneLayerPending = 0;
  sceneLayerFailure = !1;
  failed = /* @__PURE__ */ new WeakSet();
  active = 0;
  epoch = 0;
  disposed = !1;
  lost = !1;
  lastFrame;
  frameMs = 0;
  visible = 0;
  shapeData = new Float32Array();
  budgets;
  get finishQuality() {
    return this.device.finishQuality;
  }
  assertLive() {
    if (this.disposed) throw Error("Renderer disposed");
  }
  upsertCards(e) {
    if (this.assertLive(), new Set(e.map((t) => t.id)).size !== e.length)
      throw Error("Duplicate document ID");
    for (const t of e) {
      Ce(t), X(t);
      const i = this.documents.get(t.id);
      if (i && t.revision <= i.revision && i !== t)
        throw Error("Changed documents require a newer revision");
    }
    for (const t of e)
      this.documents.get(t.id) !== t && (this.cancel(t.id), this.documents.set(t.id, t), this.revisionControllers.set(t, new AbortController()));
  }
  releaseCards(e) {
    this.assertLive();
    for (const t of e)
      this.cancel(t), this.documents.delete(t), this.prepared.delete(t);
    this.updateScene(this.instances.filter((t) => this.documents.has(t.card)));
  }
  updateScene(e) {
    this.assertLive();
    const t = e.map((i) => ({
      ...i,
      transform: [...i.transform],
      normal: i.normal ? [...i.normal] : void 0,
      deformation: i.deformation ? { ...i.deformation } : void 0,
      wear: i.wear ? { ...i.wear } : void 0,
      cardstock: i.cardstock ? { ...i.cardstock } : void 0,
      printDots: i.printDots ? { ...i.printDots } : void 0
    }));
    for (const i of t)
      if (J(i), !this.documents.has(i.card)) throw Error(`Unknown card ${i.card}`);
    this.scene.update(
      Uint32Array.from(t, (i) => i.id),
      Float32Array.from(t.flatMap((i) => i.transform)),
      Int32Array.from(t, (i) => i.order ?? 0)
    ), this.instances = t;
  }
  plan(e) {
    return this.shapeData.length !== this.instances.length * 4 && (this.shapeData = new Float32Array(this.instances.length * 4)), this.instances.forEach((t, i) => {
      const o = (this.prepared.get(t.card)?.document ?? this.documents.get(t.card)).recipe, r = i * 4;
      this.shapeData[r] = o.color.size[1] / o.color.size[0], this.shapeData[r + 1] = o.cornerRadius, this.shapeData[r + 2] = t.deformation?.amount ?? 0, this.shapeData[r + 3] = W(t.id);
    }), this.scene.plan_shaped(e.viewProjection, this.shapeData, e.time ?? 0);
  }
  ready(e, t, i) {
    if (this.assertLive(), this.lost) return Promise.reject(Error("Graphics context is lost"));
    if (i?.aborted) return Promise.reject(i.reason);
    const o = this.documents.get(e);
    if (!o || o.revision !== t)
      return Promise.reject(Error("Requested revision is not current"));
    this.failed.delete(o);
    const r = this.device, a = this.enqueue(o).then(async () => {
      const c = this.revisionControllers.get(o).signal;
      if (c.throwIfAborted(), i?.throwIfAborted(), this.device !== r || this.lost) throw Error("Graphics context changed");
      for (; ; ) {
        const n = this.instances, l = await this.prepareDevice(
          r,
          this.prepared.get(e),
          n.filter((d) => d.card === e),
          c
        );
        for (const d of l) d.release();
        if (c.throwIfAborted(), i?.throwIfAborted(), this.assertLive(), this.device !== r || this.lost)
          throw new DOMException("Graphics context changed", "AbortError");
        if (this.documents.get(e) !== o)
          throw new DOMException("Revision invalidated", "AbortError");
        if (this.instances === n) break;
      }
    });
    return i ? new Promise((c, n) => {
      if (i.aborted) {
        n(i.reason);
        return;
      }
      const l = () => n(i.reason);
      i.addEventListener("abort", l, { once: !0 }), a.then(c, n).finally(() => i.removeEventListener("abort", l));
    }) : a;
  }
  enqueue(e) {
    const t = this.jobs.get(e.id);
    if (t) return t.promise;
    let i, o;
    const r = new Promise((c, n) => {
      i = c, o = n;
    }), a = {
      document: e,
      controller: new AbortController(),
      promise: r,
      resolve: i,
      reject: o,
      started: !1
    };
    return this.jobs.set(e.id, a), queueMicrotask(() => this.pump()), r;
  }
  pump() {
    if (!(this.disposed || this.lost))
      for (const e of this.jobs.values()) {
        if (this.active >= this.budgets.preparationConcurrency) break;
        if (e.started) continue;
        e.started = !0, this.active++;
        const t = this.preparer, i = this.device;
        t.prepare(e.document, e.controller.signal).then(async (o) => {
          e.controller.signal.throwIfAborted();
          const r = await this.prepareDevice(
            i,
            o,
            this.instances.filter((a) => a.card === e.document.id),
            e.controller.signal
          );
          try {
            if (e.controller.signal.throwIfAborted(), this.documents.get(e.document.id) !== e.document)
              throw Error("Superseded preparation");
            this.prepared.set(e.document.id, o), e.resolve(), this.options.invalidate?.();
          } finally {
            for (const a of r) a.release();
          }
        }).catch((o) => {
          e.controller.signal.aborted || this.failed.add(e.document), e.reject(o);
        }).finally(() => {
          this.jobs.get(e.document.id) === e && this.jobs.delete(e.document.id), this.active--, this.pump();
        });
      }
  }
  cancel(e) {
    const t = this.documents.get(e);
    t && this.revisionControllers.get(t)?.abort(new DOMException("Revision invalidated", "AbortError"));
    const i = this.jobs.get(e);
    i && (i.controller.abort(new DOMException("Revision invalidated", "AbortError")), i.reject(i.controller.signal.reason), this.jobs.delete(e));
  }
  material(e, t) {
    const i = (l) => {
      if (!l) return;
      const d = this.textures.store.acquire(l);
      return d && t.push(d), d?.value;
    }, o = i(e.color), r = i(e.mask), a = i(e.overlay), c = i(e.coverage), n = i(e.hologram);
    return o && r && (!e.overlay || a) && (!e.coverage || c) && (!e.hologram || n) ? {
      face: o,
      mask: r,
      overlay: a,
      coverage: c,
      hologram: n,
      hologramSettings: e.hologramSettings,
      recipe: e.document.recipe
    } : null;
  }
  async prepareDevice(e, t, i, o) {
    const r = [];
    try {
      o?.throwIfAborted();
      const a = this.material(t, r);
      if (!a) throw Error("Prepared working set exceeds GPU budget");
      return await e.prepare(a, i, o), r;
    } catch (a) {
      for (const c of r) c.release();
      throw a;
    }
  }
  render(e) {
    if (this.assertLive(), Me(e), this.lost) return this.metrics;
    const t = performance.now(), i = this.plan(e), o = [];
    this.lastFrame = e, this.device.begin(e), this.visible = i.length;
    const r = /* @__PURE__ */ new Map(), a = (c) => {
      const n = this.textures.store.acquire("scene:" + c.raster.key);
      if (!n) {
        !this.sceneLayerPending && !this.sceneLayerFailure && this.setSceneLayers(this.sceneLayers).catch(this.options.onError ?? console.error);
        return;
      }
      o.push(n), this.device.drawLayer(
        c,
        n.value,
        c.stage === "hud" ? { ...e, viewProjection: G } : e
      );
    };
    try {
      this.sceneLayers.filter((d) => d.stage === "world-under-cards").forEach(a);
      let c = [], n = null;
      const l = () => {
        n && c.length && this.device.draw(n, e, c), c = [];
      };
      for (const d of i) {
        const f = this.instances[d];
        let h = r.get(f.card);
        if (h === void 0) {
          const u = this.prepared.get(f.card), p = this.documents.get(f.card);
          h = u ? this.material(u, o) : null, r.set(f.card, h), (!h || u?.document !== p) && !this.jobs.has(p.id) && !this.failed.has(p) && this.enqueue(p).catch((m) => {
            m instanceof DOMException && m.name === "AbortError" || this.options.onError?.(m);
          });
        }
        (c.length > 0 && (c[0].finish ?? "regular") !== (f.finish ?? "regular") || h !== n && (!h || !n || h.face !== n.face || h.mask !== n.mask || h.overlay !== n.overlay || h.coverage !== n.coverage || h.hologram !== n.hologram || h.hologramSettings !== n.hologramSettings || h.recipe.cornerRadius !== n.recipe.cornerRadius || h.recipe.finishCoverageBase !== n.recipe.finishCoverageBase || h.recipe.overlayFoil?.tone !== n.recipe.overlayFoil?.tone || h.recipe.overlayFoil?.strength !== n.recipe.overlayFoil?.strength || JSON.stringify(h.recipe.artWindows) !== JSON.stringify(n.recipe.artWindows))) && (l(), n = h), h && c.push(f);
      }
      l();
      for (const d of ["world-interleaved", "scene-overlay", "hud"])
        this.sceneLayers.filter((f) => f.stage === d).forEach(a);
    } finally {
      for (const c of o) c.release();
      this.device.end();
    }
    return this.frameMs = performance.now() - t, this.metrics;
  }
  async setSceneLayers(e) {
    if (this.assertLive(), this.lost) throw Error("Graphics context is lost");
    if (new Set(e.map((n) => n.id)).size !== e.length)
      throw Error("Duplicate scene layer ID");
    for (const n of e) Ge(n);
    const t = e.map((n) => ({ ...n, transform: [...n.transform] })), i = ++this.sceneLayerGeneration, o = this.epoch, r = this.textures, a = [];
    this.sceneLayerFailure = !1, this.sceneLayerPending++;
    const c = () => {
      if (this.disposed || this.lost || this.epoch !== o || i !== this.sceneLayerGeneration)
        throw new DOMException("Stale scene layer preparation", "AbortError");
    };
    try {
      t.length && await this.device.prepareLayers(), c();
      for (const n of t) {
        const l = "scene:" + n.raster.key, d = r.store.acquire(l);
        if (d) {
          a.push(d);
          continue;
        }
        const f = await C(
          n.raster,
          this.options.rasterHost ?? this.assets,
          new AbortController().signal
        );
        try {
          c(), a.push(r.upload(l, f, !1));
        } finally {
          T(f);
        }
      }
      c(), this.sceneLayers = t.sort((n, l) => n.order - l.order || n.id.localeCompare(l.id)), this.options.invalidate?.();
    } catch (n) {
      throw i === this.sceneLayerGeneration && (this.sceneLayerFailure = !0), n;
    } finally {
      for (const n of a) n.release();
      this.sceneLayerPending--;
    }
  }
  hitTest(e, t) {
    const i = this.options.canvas.getBoundingClientRect(), o = this.scene.hit(e / i.width * 2 - 1, 1 - t / i.height * 2);
    if (!o.length) return null;
    const [r, a, c] = o, n = this.instances.find((f) => f.id === r), d = this.prepared.get(n.card)?.document.recipe?.regions.filter((f) => {
      const [h, u, p, m] = f.rect;
      return a >= h && c >= u && a <= h + p && c <= u + m;
    }).sort((f, h) => f.rect[2] * f.rect[3] - h.rect[2] * h.rect[3])[0]?.id;
    return { instance: r, card: n.card, uv: [a, c], part: d ?? null };
  }
  get metrics() {
    return {
      compositions: this.preparer.compositions,
      maskBuilds: this.preparer.masks.builds,
      edgeBuilds: this.textures.edgeBuilds,
      uploads: this.textures.uploads,
      readbacks: this.textures.readbacks,
      draws: this.device.draws,
      visible: this.visible,
      pending: this.jobs.size + this.sceneLayerPending + this.device.pending,
      gpu: this.textures.store.stats,
      cpu: this.assets.store.stats,
      scratchBytes: this.textures.scratchBytes,
      cpuFrameMs: this.frameMs,
      surfacePasses: this.device.surfacePasses,
      surfaceBytes: this.device.surfaceBytes
    };
  }
  resetEpoch(e) {
    if (this.assertLive(), !Number.isSafeInteger(e) || e <= this.epoch) throw Error("Epoch must increase");
    this.epoch = e, this.sceneLayerGeneration++;
    for (const t of this.documents.keys()) this.cancel(t);
    this.documents.clear(), this.prepared.clear(), this.sceneLayers = [], this.sceneLayerFailure = !1, this.failed = /* @__PURE__ */ new WeakSet(), this.instances = [], this.device.resetMotion(), this.scene.update(new Uint32Array(), new Float32Array(), new Int32Array()), this.textures.store.clear(), this.assets.clear(), this.lost || this.device.begin({ viewProjection: G });
  }
  contextLost = (e) => {
    e.preventDefault(), this.lost = !0;
    for (const t of this.documents.keys()) this.cancel(t);
    this.prepared.clear(), this.sceneLayerGeneration++, this.preparer.dispose(), this.textures.store.clear(), this.textures.etcher.dispose(), this.device.dispose();
  };
  contextRestored = () => {
    if (this.disposed) return;
    this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.device = new he(
      this.options.canvas,
      this.options.invalidate,
      this.options.onError,
      this.options.finishQuality
    ), this.textures = new ne(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      this.options.etching
    ), this.preparer = new ue(this.textures, this.options.rasterHost ?? this.assets), this.lost = !1;
    for (const t of this.documents.values())
      this.revisionControllers.set(t, new AbortController());
    this.failed = /* @__PURE__ */ new WeakSet();
    const e = this.sceneLayers;
    this.sceneLayers = [], this.setSceneLayers(e).catch(this.options.onError ?? console.error), this.options.invalidate?.(), this.pump();
  };
  async exportCard(e, t) {
    pe(t.deformation), await this.ready(e, t.revision);
    const i = this.documents.get(e);
    if (i.revision !== t.revision) throw Error("Export revision changed");
    if (!Number.isInteger(t.width) || t.width < 1 || t.width > 2048)
      throw RangeError("Invalid export size");
    const o = Ue(t.deformation, t.width), r = {
      id: t.instanceId ?? 0,
      card: e,
      finish: t.finish,
      normal: t.normal,
      rainFog: t.rainFog,
      wear: t.wear,
      cardstock: t.cardstock,
      printDots: t.printDots,
      deformation: t.deformation,
      transform: [2 * o, 0, 0, 0, 0, -2 * o, 0, 0, 0, 0, 1, 0, -o, o, 0, 1]
    };
    J(r);
    const a = this.device, c = this.epoch, n = await this.prepareDevice(
      a,
      this.prepared.get(e),
      [r],
      this.revisionControllers.get(i).signal
    );
    for (const w of n) w.release();
    if (this.assertLive(), this.lost || this.device !== a || this.epoch !== c)
      throw Error("Graphics context changed during export");
    if (this.documents.get(e) !== i) throw Error("Export revision changed");
    const l = this.options.canvas, d = [l.width, l.height], f = this.instances, h = this.sceneLayers, u = this.lastFrame;
    let p;
    const m = a.isolateMotion();
    try {
      l.width = t.width, l.height = Math.round(
        t.width * i.recipe.color.size[1] / i.recipe.color.size[0]
      ), this.sceneLayers = [], this.updateScene([r]), this.render({
        viewProjection: G,
        pointer: t.pointer,
        lighting: t.lighting,
        time: t.time ?? u?.time
      }), p = new Promise(
        (w, g) => l.toBlob(
          (b) => b ? w(b) : g(Error("Export failed")),
          "image/png"
        )
      );
    } finally {
      m(), l.width = d[0], l.height = d[1], this.sceneLayers = h, this.updateScene(f), u && this.render(u);
    }
    return p;
  }
  dispose() {
    if (!this.disposed) {
      for (const e of this.documents.keys()) this.cancel(e);
      this.disposed = !0, this.sceneLayerGeneration++, this.lost || this.device.begin({ viewProjection: G }), this.options.canvas.removeEventListener("webglcontextlost", this.contextLost), this.options.canvas.removeEventListener("webglcontextrestored", this.contextRestored), this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.assets.dispose(), this.scene.free();
    }
  }
}
async function ct(s) {
  H ??= Pe(s ? { module_or_path: s } : void 0).catch((e) => {
    throw H = void 0, e;
  }), await H;
}
async function ht(s) {
  return await ct(s.wasmUrl), new nt(s);
}
export {
  j as C,
  _ as D,
  qe as G,
  G as I,
  rt as P,
  nt as R,
  Ye as S,
  ne as T,
  Qe as W,
  Y as a,
  $ as b,
  ht as c,
  O as d,
  Ce as e,
  ot as f,
  M as g,
  ue as h,
  ct as i,
  B as j,
  Ze as k,
  X as l,
  xe as m,
  ae as n,
  it as p,
  W as s,
  A as t,
  Be as v,
  K as w
};
