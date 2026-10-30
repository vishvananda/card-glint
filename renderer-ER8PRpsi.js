import { v as Ae, f as Ie, c as _e } from "./image-cover-Bq6wMyQU.js";
import { R as Fe, f as ke, a as Le, P as Pe, v as Ne, S as Se, _ as De } from "./foil-preview-shader-C-MhLK3-.js";
import { c as W, a as T } from "./canvas-raster-DIqHyOj6.js";
const X = (s) => (Math.imul(s + 1, 1597334677) >>> 0) % 65536 / 65536;
function ve(s) {
  if (s && (s.kind !== "heat" || !Number.isFinite(s.amount) || s.amount < 0 || s.amount > 0.02))
    throw RangeError("Heat deformation amount must be between 0 and 0.02");
}
function Ue(s, e) {
  return s?.amount ? e / (e + 4) / (1 + 2 * s.amount) : 1;
}
function S(s) {
  return Number.isInteger(s) && s >= 0 && s <= 4294967295;
}
function k(s) {
  if (s.length !== 4 || s.some((e) => !Number.isFinite(e)) || s[2] <= 0 || s[3] <= 0)
    throw Error("Invalid normalized rectangle");
}
function N(s) {
  if (!s.key || s.key.length > 131072) throw Error("Invalid raster key");
  const [e, t] = s.size;
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 1 || t < 1 || e * t > 4194304)
    throw Error("Invalid raster size");
}
function Ce(s) {
  if (!S(s.id) || !Number.isSafeInteger(s.revision) || s.revision < 0)
    throw Error("Invalid card identity");
  const e = s.recipe;
  if (N(e.color), e.stamp && N(e.stamp), !e.pack || e.artWindows.length > 8 || e.edges.length > 32)
    throw Error("Invalid recipe or too many regions");
  if (!Number.isFinite(e.cornerRadius) || e.cornerRadius < 0 || e.cornerRadius > 0.5)
    throw Error("Invalid corner radius");
  const t = e.finishCoverageBase ?? 1;
  if (!Number.isFinite(t) || t < 0 || t > 1) throw Error("Invalid base coverage");
  if (e.overlayFoil) {
    const { tone: a, strength: r } = e.overlayFoil;
    if (!["gold", "silver", "prismatic"].includes(a) || !Number.isFinite(r) || r < 0 || r > 1)
      throw Error("Invalid overlay foil");
  }
  if (e.hologram) {
    const { mask: a, rect: r, strength: o, seed: i = 0 } = e.hologram;
    if (N(a), k(r), !Number.isFinite(o) || o < 0 || o > 1 || !S(i))
      throw Error("Invalid hologram material");
  }
  e.artWindows.forEach(k), e.regions.forEach((a) => k(a.rect));
  for (const a of e.edges) {
    if (a.fit !== void 0 && Ae(a.fit), k(a.crop), k(a.destination), k(a.clip), a.crop[0] < 0 || a.crop[1] < 0 || a.crop[0] + a.crop[2] > 1.000001 || a.crop[1] + a.crop[3] > 1.000001)
      throw Error("Crop leaves the source image");
    if (!Number.isInteger(a.threshold) || a.threshold < 0 || a.threshold > 255 || ![-90, 0, 90].includes(a.rotation ?? 0))
      throw Error("Invalid edge recipe");
  }
  for (const a of s.layers ?? []) {
    if (N(a.raster), a.clip && k(a.clip), !Number.isInteger(a.order) || Math.abs(a.order) > 2147483647)
      throw Error("Invalid layer order");
    for (const r of [
      a.finishCoverage?.add,
      a.finishCoverage?.exclude,
      a.etchCoverage?.add,
      a.etchCoverage?.exclude
    ])
      r && N(r);
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
function Z(s) {
  if (s.rainFog !== void 0 && (!Number.isFinite(s.rainFog) || s.rainFog < 0 || s.rainFog > 2))
    throw Error("Invalid rain fog density");
  if (Be(s.printDots), s.cardstock && (!Number.isFinite(s.cardstock.amount) || s.cardstock.amount < 0 || s.cardstock.amount > 1))
    throw Error("Invalid cardstock amount");
  if (ve(s.deformation), s.wear && (!Number.isFinite(s.wear.amount) || s.wear.amount < 0 || s.wear.amount > 1 || s.wear.seed !== void 0 && !S(s.wear.seed)))
    throw Error("Invalid wear amount or seed");
  if (!S(s.id) || !S(s.card) || s.transform.length !== 16 || s.transform.some((e) => !Number.isFinite(e)))
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
  if (s.hover && (!S(s.hover.instance) || s.hover.uv.length !== 2 || s.hover.uv.some((e) => !Number.isFinite(e) || e < 0 || e > 1)))
    throw Error("Invalid card-local hover");
}
function Ge(s) {
  if (N(s.raster), !s.id || !Number.isInteger(s.order) || s.transform.length !== 16 || s.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid scene layer");
  if (!["world-under-cards", "world-interleaved", "scene-overlay", "hud"].includes(s.stage) || !["test-write", "test-readonly", "ignore"].includes(s.depth))
    throw Error("Invalid scene layer stage or depth");
  if (["scene-overlay", "hud"].includes(s.stage) && s.depth !== "ignore")
    throw Error("Overlay/HUD layers must ignore depth");
}
class me {
  constructor(e, t) {
    if (this.destroy = t, !Number.isSafeInteger(e) || e < 1 || e > 4294967295)
      throw RangeError("Invalid cache budget");
    this.policy = new Fe(e);
  }
  destroy;
  policy;
  resources = /* @__PURE__ */ new Map();
  generation = 0;
  acquire(e) {
    const t = this.policy.lookup(e);
    return t === void 0 ? null : this.lease(t);
  }
  insert(e, t, a) {
    if (!Number.isSafeInteger(a) || a < 1 || a > 4294967295)
      throw this.destroy(t), RangeError("Invalid resource size");
    let r;
    try {
      r = JSON.parse(this.policy.admit(e, a, 1));
    } catch (o) {
      throw this.destroy(t), o;
    }
    for (const o of r.evicted) {
      const i = this.resources.get(o);
      i !== void 0 && this.destroy(i), this.resources.delete(o);
    }
    return this.resources.has(r.handle) ? this.destroy(t) : this.resources.set(r.handle, t), this.lease(r.handle);
  }
  /** Admit and evict before allocating a GPU object, so a miss does not
   * temporarily duplicate the resident cache's entire working set. */
  create(e, t, a, r = 1) {
    if (!Number.isSafeInteger(t) || t < 1 || t > 4294967295)
      throw RangeError("Invalid resource size");
    const o = JSON.parse(
      this.policy.admit(e, t, r)
    );
    for (const i of o.evicted) {
      const n = this.resources.get(i);
      n !== void 0 && this.destroy(n), this.resources.delete(i);
    }
    if (this.resources.has(o.handle)) return this.lease(o.handle);
    try {
      return this.resources.set(o.handle, a()), this.lease(o.handle);
    } catch (i) {
      throw this.policy.remove(o.handle), i;
    }
  }
  lease(e) {
    const t = this.resources.get(e);
    if (t === void 0) throw Error("Resource ownership mismatch");
    this.policy.pin(e, !0);
    const a = this.generation;
    let r = !1;
    return {
      value: t,
      release: () => {
        r || (r = !0, a === this.generation && this.policy.pin(e, !1));
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
  const t = await Ie(s.url, { mode: "cors", signal: e });
  if (!t.ok) throw Error(`Asset ${t.status}: ${s.url}`);
  const a = await t.blob();
  if (!a.type.includes("svg"))
    return createImageBitmap(
      a,
      s.width ? { resizeWidth: s.width, resizeQuality: "high" } : {}
    );
  const r = new DOMParser().parseFromString(await a.text(), "image/svg+xml"), o = r.documentElement;
  if (o.localName !== "svg" || r.querySelector("parsererror")) throw Error("Invalid SVG");
  const i = (o.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), n = i[2] ?? Number.parseFloat(o.getAttribute("width") ?? ""), c = i[3] ?? Number.parseFloat(o.getAttribute("height") ?? "");
  if (!(n > 0 && c > 0 && Number.isFinite(n + c))) throw Error("SVG needs finite dimensions");
  const d = (s.width ?? 512) / Math.max(n, c);
  o.hasAttribute("viewBox") || o.setAttribute("viewBox", `0 0 ${n} ${c}`), o.setAttribute("width", String(Math.max(1, Math.round(n * d)))), o.setAttribute("height", String(Math.max(1, Math.round(c * d))));
  const h = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(o)], { type: "image/svg+xml" })
  ), f = new Image();
  try {
    return f.src = h, await f.decode(), await createImageBitmap(f);
  } finally {
    f.src = "", URL.revokeObjectURL(h);
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
    this.store = new me(e, (t) => t.close());
  }
  async reserve() {
    return this.active >= 4 ? await new Promise((e) => this.waiting.push(e)) : this.active++, () => {
      const e = this.waiting.shift();
      e ? e() : this.active--;
    };
  }
  async image(e, t) {
    if (t.throwIfAborted(), this.disposed) throw Error("Asset store disposed");
    const a = JSON.stringify([e.url, e.width, e.revision]);
    let r = this.store.acquire(a);
    if (r) return r;
    let o = this.pending.get(a);
    if (!o) {
      const i = this.generation, n = new AbortController();
      this.controllers.add(n), o = (async () => {
        const c = await this.reserve();
        try {
          if (this.disposed || i !== this.generation) throw Error("Asset scope changed");
          const d = await Oe(e, n.signal);
          if (this.decodes++, this.disposed || i !== this.generation)
            throw d.close(), Error("Asset scope changed");
          this.store.insert(a, d, d.width * d.height * 4).release();
        } finally {
          c(), this.controllers.delete(n), i === this.generation && this.pending.delete(a);
        }
      })(), this.pending.set(a, o);
    }
    if (await o, t.throwIfAborted(), r = this.store.acquire(a), !r) throw Error("Decoded working set exceeds CPU budget");
    return r;
  }
  async images(e, t) {
    const a = [], r = /* @__PURE__ */ new Map(), o = await Promise.allSettled(
      e.map(async (c) => {
        const d = await this.image(c, t);
        a.push(d), r.set(c.url, d.value);
      })
    ), i = () => {
      for (const c of a) c.release();
      r.clear();
    }, n = o.find((c) => c.status === "rejected");
    if (n?.status === "rejected")
      throw i(), n.reason;
    return { value: r, release: i };
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
const ge = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`, j = `#version 300 es
precision highp float;precision highp int;precision highp usampler2D;
`, He = j + `uniform sampler2D source;uniform ivec2 size;uniform int mode;layout(location=0) out uvec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);if(mode==1)p.y=size.y-1-p.y;uvec3 rgb=uvec3(floor(texelFetch(source,p,0).rgb*255.+.5));
uint y=(54u*rgb.r+183u*rgb.g+19u*rgb.b)>>8u;color=uvec4(y,0,0,1);}`, Xe = j + `uniform usampler2D source;uniform ivec2 size;uniform int mode;uniform int threshold;
layout(location=0) out uvec4 color;
int at(ivec2 p){return int(texelFetch(source,p,0).r);}
void main(){ivec2 p=ivec2(gl_FragCoord.xy);int value=0;
if(mode==1){value=p.x==0||p.x==size.x-1?at(p):(at(p-ivec2(1,0))+2*at(p)+at(p+ivec2(1,0)))>>2;}
else if(mode==2){value=p.y==0||p.y==size.y-1?at(p):(at(p-ivec2(0,1))+2*at(p)+at(p+ivec2(0,1)))>>2;}
else if(p.x>0&&p.y>0&&p.x<size.x-1&&p.y<size.y-1){
int gx=-at(p+ivec2(-1,-1))+at(p+ivec2(1,-1))-2*at(p+ivec2(-1,0))+2*at(p+ivec2(1,0))-at(p+ivec2(-1,1))+at(p+ivec2(1,1));
int gy=-at(p+ivec2(-1,-1))-2*at(p+ivec2(0,-1))-at(p+ivec2(1,-1))+at(p+ivec2(-1,1))+2*at(p+ivec2(0,1))+at(p+ivec2(1,1));
value=clamp((((abs(gx)+abs(gy))>>2)-threshold)*8,0,255);}
color=uvec4(uint(value),0,0,1);}`, Ve = j + `uniform usampler2D strength;uniform usampler2D softened;out vec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);uint a=min(255u,max(texelFetch(strength,p,0).r,texelFetch(softened,p,0).r)*2u);color=vec4(float(a)/255.,0.,0.,1.);}`;
function we(s, e, t) {
  const a = [], r = s.createProgram();
  if (!r) throw Error("WebGL program allocation failed");
  try {
    for (const [o, i] of [
      [s.VERTEX_SHADER, t],
      [s.FRAGMENT_SHADER, e]
    ]) {
      const n = s.createShader(o);
      if (!n) throw Error("WebGL shader allocation failed");
      a.push(n), s.shaderSource(n, i), s.compileShader(n), s.attachShader(r, n);
    }
    return s.linkProgram(r), { p: r, shaders: a };
  } catch (o) {
    throw s.deleteProgram(r), o;
  } finally {
    for (const o of a) s.deleteShader(o);
  }
}
function be(s, e, t) {
  if (s.getProgramParameter(e, s.LINK_STATUS)) return e;
  const a = t.map((r) => s.getShaderInfoLog(r)).filter(Boolean);
  throw Error([s.getProgramInfoLog(e), ...a].filter(Boolean).join(`
`));
}
function M(s, e, t = ge) {
  const { p: a, shaders: r } = we(s, e, t);
  try {
    return be(s, a, r);
  } catch (o) {
    throw s.deleteProgram(a), o;
  }
}
function B(s, e, t = ge, a) {
  return a?.aborted ? Promise.reject(a.reason) : s.isContextLost() ? Promise.reject(Error("Graphics context is lost")) : new Promise((r, o) => {
    const i = s.getExtension("KHR_parallel_shader_compile");
    let n, c;
    const d = () => {
      clearTimeout(c), a?.removeEventListener("abort", f), s.canvas.removeEventListener("webglcontextlost", l);
    }, h = (p) => {
      d(), n && !s.isContextLost() && s.deleteProgram(n.p), n = void 0, o(p);
    }, f = () => h(a.reason), l = () => h(new DOMException("Graphics context is lost", "AbortError")), u = () => {
      if (a?.aborted) return f();
      if (s.isContextLost()) return l();
      try {
        if (i && !s.getProgramParameter(n.p, i.COMPLETION_STATUS_KHR)) {
          c = setTimeout(u, 8);
          return;
        }
        const p = be(s, n.p, n.shaders);
        d(), n = void 0, r(p);
      } catch (p) {
        h(p);
      }
    };
    a?.addEventListener("abort", f, { once: !0 }), s.canvas.addEventListener("webglcontextlost", l, { once: !0 });
    try {
      n = we(s, e, t), c = setTimeout(u, 0);
    } catch (p) {
      h(p);
    }
  });
}
function I(s, e, t, a = s.R8, r = s.RED, o = s.UNSIGNED_BYTE) {
  const i = s.createTexture();
  s.bindTexture(s.TEXTURE_2D, i);
  const n = a === s.R8UI ? s.NEAREST : s.LINEAR;
  return s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, n), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, n), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_S, s.CLAMP_TO_EDGE), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_T, s.CLAMP_TO_EDGE), s.texImage2D(s.TEXTURE_2D, 0, a, e, t, 0, r, o, null), i;
}
class qe {
  constructor(e) {
    this.gl = e, this.scratch = [], this.width = this.height = 0, this.disposed = !1;
    const t = performance.now();
    this.programs = [];
    try {
      for (const a of [He, Xe, Ve]) this.programs.push(M(e, a));
    } catch (a) {
      throw this.dispose(), a;
    }
    this.uniforms = this.programs.map(
      (a) => Object.fromEntries(
        ["source", "size", "mode", "threshold", "strength", "softened"].map((r) => [
          r,
          e.getUniformLocation(a, r)
        ])
      )
    ), this.framebuffer = e.createFramebuffer(), this.vao = e.createVertexArray(), this.compileMs = performance.now() - t;
  }
  allocate(e, t) {
    if (e === this.width && t === this.height) return;
    const a = this.gl;
    for (const r of this.scratch) a.deleteTexture(r);
    this.scratch = [], this.width = e, this.height = t, this.input = I(a, e, t, a.RGBA8, a.RGBA), this.scratch.push(this.input);
    for (let r = 0; r < 3; r++) this.scratch.push(I(a, e, t, a.R8UI, a.RED_INTEGER));
    if (a.bindFramebuffer(a.FRAMEBUFFER, this.framebuffer), a.framebufferTexture2D(
      a.FRAMEBUFFER,
      a.COLOR_ATTACHMENT0,
      a.TEXTURE_2D,
      this.scratch[1],
      0
    ), a.checkFramebufferStatus(a.FRAMEBUFFER) !== a.FRAMEBUFFER_COMPLETE)
      throw Error("GPU integer etching framebuffer is unavailable");
  }
  run(e, t, a, r = 20, o = null) {
    if (this.disposed) throw Error("GPU etcher disposed");
    if (!Number.isInteger(t) || !Number.isInteger(a) || t < 1 || a < 1 || t * a > 4194304 || !Number.isInteger(r) || r < 0 || r > 255)
      throw RangeError("Invalid etching dimensions or threshold");
    if (ArrayBuffer.isView(e) && e.byteLength !== t * a * 4)
      throw RangeError("Wrong RGBA input length");
    if (e === null && (t !== this.width || a !== this.height))
      throw Error("Resident input must be uploaded at this size before reuse");
    const i = this.gl;
    this.allocate(t, a), i.bindVertexArray(this.vao), i.disable(i.BLEND), i.disable(i.DEPTH_TEST), i.disable(i.SCISSOR_TEST), i.disable(i.DITHER), i.colorMask(!0, !0, !0, !0), i.viewport(0, 0, t, a), i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, this.input), i.pixelStorei(i.UNPACK_ALIGNMENT, 1), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, i.NONE), e !== null && (this.flipped = typeof ImageBitmap < "u" && e instanceof ImageBitmap ? 1 : 0), i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !ArrayBuffer.isView(e) && !this.flipped), ArrayBuffer.isView(e) ? i.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, t, a, i.RGBA, i.UNSIGNED_BYTE, e) : e !== null && i.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, i.RGBA, i.UNSIGNED_BYTE, e), i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1);
    const [n, c, d] = this.scratch.slice(1), h = o ?? I(i, t, a), f = (u, p, g, b = 0) => {
      i.useProgram(this.programs[u]);
      const m = this.uniforms[u];
      i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, p), i.uniform1i(m.source, 0), i.uniform2i(m.size, t, a), i.uniform1i(m.mode, b), i.uniform1i(m.threshold, r), i.bindFramebuffer(i.FRAMEBUFFER, this.framebuffer), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, g, 0), i.drawArrays(i.TRIANGLES, 0, 3);
    };
    f(0, this.input, n, this.flipped ?? 0), f(1, n, c, 1), f(1, c, d, 2), f(1, d, n, 3), f(1, n, c, 1), f(1, c, d, 2);
    const l = this.uniforms[2];
    return i.useProgram(this.programs[2]), i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, n), i.uniform1i(l.strength, 0), i.activeTexture(i.TEXTURE1), i.bindTexture(i.TEXTURE_2D, d), i.uniform1i(l.softened, 1), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, h, 0), i.drawArrays(i.TRIANGLES, 0, 3), i.bindFramebuffer(i.FRAMEBUFFER, null), i.bindVertexArray(null), h;
  }
  // Validation/measurement only. The real capture feeds the result directly to GL.
  read(e, t = this.width, a = this.height) {
    const r = this.gl, o = new Uint8Array(t * a * 4), i = new Uint8Array(t * a);
    r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, e, 0), r.readPixels(0, 0, t, a, r.RGBA, r.UNSIGNED_BYTE, o), r.bindFramebuffer(r.FRAMEBUFFER, null);
    for (let n = 0; n < i.length; n++) i[n] = o[n * 4];
    return i;
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
const We = `
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
`, je = `
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
`, xe = `
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
${xe}
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
`, Ke = `
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
${We}
${je}
${$e}
vec3 animatedSurface(vec2 uv,vec3 normal){
 if(previewKind==5.)return rainGlass(uv,normal);
 if(previewKind==6.)return heatHaze(uv,normal);
 return poolWater(uv,normal);
}
`, Ye = `
vec2 cardSource(vec2 local,float time,vec2 shape){
 float amount=shape.x,phase=shape.y*6.28318530718;
 if(amount==0.)return local;
 return local+amount*vec2(
  .72*sin(local.y*43.+time*2.1+phase)+.28*sin(local.y*81.-time*3.4+phase*.7),
  .18*sin(local.x*29.-time*1.3+phase));
}
`, Je = `
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
function $(s, e) {
  if (s.getParameter(s.TRANSFORM_FEEDBACK_ACTIVE) && !s.getParameter(s.TRANSFORM_FEEDBACK_PAUSED))
    throw Error("Finish preparation requires paused transform feedback");
  for (const y of [s.ANY_SAMPLES_PASSED, s.ANY_SAMPLES_PASSED_CONSERVATIVE])
    if (s.getQuery(y, s.CURRENT_QUERY))
      throw Error("Finish preparation cannot run inside an occlusion query");
  const t = s.getParameter(s.ACTIVE_TEXTURE), a = s.getParameter(s.CURRENT_PROGRAM);
  if (a && s.getProgramParameter(a, s.DELETE_STATUS))
    throw Error("Finish preparation requires an undeleted current program");
  const r = s.getParameter(s.VERTEX_ARRAY_BINDING), o = s.getParameter(s.ELEMENT_ARRAY_BUFFER_BINDING), i = s.getParameter(s.READ_FRAMEBUFFER_BINDING), n = s.getParameter(s.DRAW_FRAMEBUFFER_BINDING), c = s.getParameter(s.PIXEL_UNPACK_BUFFER_BINDING), d = s.getParameter(s.VIEWPORT), h = s.getParameter(s.COLOR_WRITEMASK), f = s.getParameter(s.COLOR_CLEAR_VALUE), l = s.getParameter(s.BLEND_EQUATION_RGB), u = s.getParameter(s.BLEND_EQUATION_ALPHA), p = s.getParameter(s.BLEND_SRC_RGB), g = s.getParameter(s.BLEND_SRC_ALPHA), b = s.getParameter(s.BLEND_DST_RGB), m = s.getParameter(s.BLEND_DST_ALPHA), w = [
    s.BLEND,
    s.CULL_FACE,
    s.DEPTH_TEST,
    s.DITHER,
    s.SCISSOR_TEST,
    s.STENCIL_TEST,
    s.RASTERIZER_DISCARD,
    s.SAMPLE_ALPHA_TO_COVERAGE,
    s.SAMPLE_COVERAGE
  ], v = w.map((y) => s.isEnabled(y));
  s.activeTexture(s.TEXTURE0);
  const x = s.getParameter(s.TEXTURE_BINDING_2D), R = s.getParameter(s.SAMPLER_BINDING);
  try {
    s.bindBuffer(s.PIXEL_UNPACK_BUFFER, null);
    for (const y of w) s.disable(y);
    return e();
  } finally {
    s.useProgram(a), s.bindVertexArray(r), s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, o), s.bindFramebuffer(s.READ_FRAMEBUFFER, i), s.bindFramebuffer(s.DRAW_FRAMEBUFFER, n), s.bindBuffer(s.PIXEL_UNPACK_BUFFER, c), s.viewport(d[0], d[1], d[2], d[3]), s.colorMask(h[0], h[1], h[2], h[3]), s.clearColor(f[0], f[1], f[2], f[3]), s.blendEquationSeparate(l, u), s.blendFuncSeparate(
      p,
      b,
      g,
      m
    ), w.forEach(
      (y, F) => v[F] ? s.enable(y) : s.disable(y)
    ), s.activeTexture(s.TEXTURE0), s.bindTexture(s.TEXTURE_2D, x), s.bindSampler(0, R), s.activeTexture(t);
  }
}
const G = 732, O = 1020, Q = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`, ee = `#version 300 es
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
class K {
  constructor(e, t) {
    this.gl = e, this.shader = t ?? M(e, ee, Q);
  }
  gl;
  width = G;
  height = O;
  map;
  bytes = 0;
  passes = 0;
  shader;
  static async create(e, t) {
    const a = await B(e, ee, Q, t);
    try {
      if (t?.throwIfAborted(), e.isContextLost()) throw Error("Context lost during cardstock preparation");
      return $(e, () => new K(e, a));
    } catch (r) {
      throw e.deleteProgram(a), r;
    }
  }
  prepare() {
    if (this.map) return;
    const e = this.gl, t = I(e, G, O, e.RGBA8, e.RGBA), a = e.createFramebuffer(), r = e.createVertexArray();
    try {
      if (e.bindFramebuffer(e.FRAMEBUFFER, a), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, t, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
        throw Error("Cardstock framebuffer is incomplete");
      e.viewport(0, 0, G, O), e.disable(e.DEPTH_TEST), e.disable(e.CULL_FACE), e.disable(e.SCISSOR_TEST), e.disable(e.BLEND), e.disable(e.DITHER), e.colorMask(!0, !0, !0, !0), e.useProgram(this.shader), e.bindVertexArray(r), e.drawArrays(e.TRIANGLES, 0, 3), e.bindTexture(e.TEXTURE_2D, t), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR_MIPMAP_LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.generateMipmap(e.TEXTURE_2D);
      let o = G, i = O;
      for (; this.bytes += o * i * 4, !(o === 1 && i === 1); )
        o = Math.max(1, Math.floor(o / 2)), i = Math.max(1, Math.floor(i / 2));
      this.map = t, this.passes++;
    } catch (o) {
      throw e.deleteTexture(t), o;
    } finally {
      e.bindFramebuffer(e.FRAMEBUFFER, null), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.bindVertexArray(null), e.deleteFramebuffer(a), e.deleteVertexArray(r);
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
}`, ye = `
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
 vec2 cyan=vec2(-.258819,.965926),magenta=vec2(.258819,.965926),yellow=vec2(0.,1.),black=vec2(.707107);
 PrintPlate c=preparePlate(p,paper,cyan,1.,vec2(-.30,.12),softness);
 PrintPlate m=preparePlate(p,paper,magenta,5.,vec2(.20,-.22),softness);
 PrintPlate y=preparePlate(p,paper,yellow,9.,vec2(.08,.26),softness);
 PrintPlate k=preparePlate(p,paper,black,13.,vec2(-.05,-.03),softness);
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
  vec3 plates=vec3(screenedPlate(q,cyan,1.,c,aa,gaps),screenedPlate(q,magenta,5.,m,aa,gaps),screenedPlate(q,yellow,9.,y,aa,gaps));
  vec3 screened=(1.-plates)*(1.-screenedPlate(q,black,13.,k,aa,gaps));
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
}`, te = `#version 300 es
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
function Qe(s, e, t) {
  const a = s >= 5 && s < 8, r = ke().replace("uniform float previewKind;", `const float previewKind=${s.toFixed(1)};`).replaceAll("texture2D(mask,uv).r*hasMask", "edgeCoverage(uv)").replaceAll("texture2D(face,", "printFace(");
  return `#version 300 es
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
${ye}
#else
vec4 printFace(vec2 uv){return texture(face,uv);}
#endif
${a ? Ke.replaceAll("texture(face,", "printFace(") : "uniform float surfaceTime;flat in vec4 surfaceInfo;"}
${Ye}
${Je}
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
 else optical=${a ? "animatedSurface(uv,normalize(v_normal))" : "previewFoil(uv,normalize(v_normal),view)"};
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
const et = `#version 300 es
precision highp float;in vec2 v_uv;uniform sampler2D face;out vec4 out_color;
void main(){out_color=texture(face,vec2(v_uv.x,1.-v_uv.y));if(out_color.a<.001)discard;}`, L = (s, e) => Math.max(-e, Math.min(e, s));
function Ee(s, e) {
  const t = Math.min(2047, Math.max(0, Math.round((s / 0.24 + 0.5) * 2047))), a = Math.min(0.9995, Math.max(5e-4, e / 0.24 + 0.5));
  return 1 + t + a;
}
function re(s, e, t, a) {
  for (let r = 1; r <= 4; r++) {
    const o = (s.activeRipple + r) % 4, i = 4 + o * 4;
    if (!(s.data[i + 3] > 0 && e - s.data[i + 2] < 2.25))
      return s.activeRipple = o, s.segStart = [t, a], s.segTime = e, s.data.set([t, a, e, Ee(0, 0)], i), !0;
  }
  return !1;
}
class ie {
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
    const a = e.finish ?? "regular";
    if (a !== "rain" && a !== "heat" && a !== "pool" && !e.deformation)
      return null;
    const r = t.time ?? 0, o = e.transform, i = e.normal ?? [0, 0, 1], n = [o[12], o[13], i[0], i[1]];
    let c = this.states.get(e.id);
    if (!c || r < c.time) {
      const f = new Float32Array(20);
      f.set([0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0], 4), c = {
        seen: this.serial,
        time: r,
        pose: n,
        velocity: [0, 0],
        data: f,
        activeRipple: 0,
        emitting: !1,
        segStart: [0.5, 0.5],
        segTime: -100,
        hoverUv: [0.5, 0.5],
        hovering: !1
      }, this.states.set(e.id, c);
    }
    c.seen = this.serial;
    const d = Math.min(0.05, r - c.time), h = t.hover?.instance === e.id ? t.hover : void 0;
    if (h) {
      const f = h.uv[0], l = 1 - h.uv[1];
      if (!c.hovering)
        c.hoverUv = [f, l], c.emitting = re(c, r, f, l);
      else {
        const u = f - c.hoverUv[0], p = l - c.hoverUv[1], g = Math.hypot(u, p);
        c.hoverUv = [f, l], d > 0 && g > 0 && (c.velocity[0] = L(c.velocity[0] + L(u * 1.8, 0.28), 1), c.velocity[1] = L(c.velocity[1] + L(p * 1.8, 0.28), 1));
        const b = (f - c.segStart[0]) * 0.5, m = (l - c.segStart[1]) * 0.5, w = Math.hypot(b, m) * 2, v = r - c.segTime;
        if (g > 5e-4)
          if (!c.emitting || w > 0.11 || v > 0.13 && w > 0.02)
            c.emitting = re(c, r, f, l);
          else {
            const x = c.segStart[0] + b, R = c.segStart[1] + m, y = c.segTime + v * 0.45;
            c.data.set([x, R, y, Ee(b, m)], 4 + c.activeRipple * 4);
          }
      }
    }
    if (h || (c.emitting = !1), d > 0) {
      const f = [Math.hypot(o[0], o[1], o[2]), Math.hypot(o[4], o[5], o[6])];
      for (let l = 0; l < 2; l++) {
        const u = (n[l] - c.pose[l]) / Math.max(0.05, f[l]) + (n[l + 2] - c.pose[l + 2]) * 0.7, p = L(u, 0.22), g = Math.max(1, Math.ceil(d / (1 / 120))), b = d / g;
        for (let m = 0; m < g; m++) {
          let w = c.data[l], v = c.velocity[l] + (m === 0 ? p * 4.5 : 0);
          v += (-26 * w - 4.8 * v) * b, w = L(w + v * b, 0.35), c.data[l] = w, c.velocity[l] = L(v, 1.4);
        }
      }
    }
    return c.hovering = !!h, c.time = r, c.pose = n, c.data;
  }
}
const E = 192, P = 512, ae = `#version 300 es
precision highp float;
uniform float time;
out vec2 incoming;
${xe}
void main(){
 // Include a skirt around the periodic tile: rays from outside can land inside.
 vec2 p=vec2(gl_VertexID%${E + 1},gl_VertexID/${E + 1})/${E}.*2.4-.2;
 vec3 wave=waterField(p,time);
 vec3 normal=normalize(vec3(-wave.xy,1.));
 vec3 ray=refract(vec3(0.,0.,-1.),normal,1./1.333);
 vec2 floorPoint=p+ray.xy/(-ray.z)*(waterDepth+wave.z);
 incoming=p;
 gl_Position=vec4(floorPoint/waterPeriod*2.-1.,0.,1.);
}`, se = `#version 300 es
precision highp float;
in vec2 incoming;out vec4 color;
void main(){
 // Each fragment receives the area of its source light footprint. Overlapping
 // folds accumulate by additive blending; expanded footprints become darker.
 vec2 dx=dFdx(incoming),dy=dFdy(incoming);
 float flux=abs(dx.x*dy.y-dx.y*dy.x)*${(P / 2) ** 2}.;
 color=vec4(min(flux,8.)/8.,0.,0.,1.);
}`;
class Y {
  constructor(e, t) {
    this.gl = e, this.shader = t ?? M(e, se, ae), this.clock = e.getUniformLocation(this.shader, "time");
    const a = I(e, P, P), r = e.createFramebuffer(), o = e.createVertexArray(), i = e.createBuffer();
    try {
      if (!a || !r || !o || !i) throw Error("Caustics resources unavailable");
      if (e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.REPEAT), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.REPEAT), e.bindFramebuffer(e.FRAMEBUFFER, r), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, a, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
        throw Error("Caustics framebuffer is incomplete");
      e.bindVertexArray(o), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, i);
      const n = new Uint16Array(E * E * 6);
      for (let c = 0; c < E; c++)
        for (let d = 0; d < E; d++) {
          const h = c * (E + 1) + d, f = h + E + 1;
          n.set([h, h + 1, f, f, h + 1, f + 1], (c * E + d) * 6);
        }
      e.bufferData(e.ELEMENT_ARRAY_BUFFER, n, e.STATIC_DRAW), this.map = a, this.framebuffer = r, this.vao = o, this.indices = i;
    } catch (n) {
      throw e.deleteTexture(a), e.deleteFramebuffer(r), e.deleteVertexArray(o), e.deleteBuffer(i), t || e.deleteProgram(this.shader), n;
    } finally {
      e.bindVertexArray(null), e.bindFramebuffer(e.FRAMEBUFFER, null);
    }
  }
  gl;
  map;
  bytes = P * P + E * E * 6 * 2;
  passes = 0;
  shader;
  framebuffer;
  vao;
  indices;
  clock;
  time = NaN;
  static async create(e, t) {
    const a = await B(e, se, ae, t);
    try {
      if (t?.throwIfAborted(), e.isContextLost()) throw Error("Context lost during caustics preparation");
      return $(e, () => new Y(e, a));
    } catch (r) {
      throw e.deleteProgram(a), r;
    }
  }
  prepare(e) {
    if (e = Math.fround(e), e === this.time) return;
    const t = this.gl;
    t.bindFramebuffer(t.FRAMEBUFFER, this.framebuffer), t.viewport(0, 0, P, P), t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.disable(t.SCISSOR_TEST), t.colorMask(!0, !0, !0, !0), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.enable(t.BLEND), t.blendEquation(t.FUNC_ADD), t.blendFunc(t.ONE, t.ONE), t.useProgram(this.shader), t.uniform1f(this.clock, e), t.bindVertexArray(this.vao), t.drawElements(t.TRIANGLES, E * E * 6, t.UNSIGNED_SHORT, 0), t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, t.drawingBufferWidth, t.drawingBufferHeight), t.disable(t.BLEND), this.time = e, this.passes++;
  }
  dispose() {
    const e = this.gl;
    e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteVertexArray(this.vao), e.deleteBuffer(this.indices), e.deleteProgram(this.shader);
  }
}
function Te(s, e) {
  let t = 0, a = s, r = e;
  for (; ; ) {
    if (t += a * r * 4, a === 1 && r === 1) return t;
    a = Math.max(1, Math.floor(a / 2)), r = Math.max(1, Math.floor(r / 2));
  }
}
class oe {
  constructor(e, t, a, r = "gpu") {
    this.gl = e, this.scratchLimit = a, this.mode = r, this.store = new me(t, (o) => e.deleteTexture(o.texture)), this.etcher = new qe(e);
  }
  gl;
  scratchLimit;
  mode;
  store;
  etcher;
  kernels = new Pe();
  uploads = 0;
  edgeBuilds = 0;
  readbacks = 0;
  upload(e, t, a = !0, r = 1) {
    const o = this.store.acquire(e);
    if (o) return o;
    const i = this.gl, n = t.width, c = t.height;
    return this.store.create(
      e,
      a ? Te(n, c) : n * c * 4,
      () => {
        const d = I(i, n, c, a ? i.SRGB8_ALPHA8 : i.RGBA8, i.RGBA);
        if (i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, d), i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !0), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
          const h = document.createElement("canvas");
          h.width = n, h.height = c;
          try {
            h.getContext("2d").drawImage(t, 0, 0), i.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, i.RGBA, i.UNSIGNED_BYTE, h);
          } finally {
            h.width = h.height = 0;
          }
        } else
          i.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, i.RGBA, i.UNSIGNED_BYTE, t);
        return i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1), a && (i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.LINEAR_MIPMAP_LINEAR), i.generateMipmap(i.TEXTURE_2D)), this.uploads++, { texture: d, width: n, height: c, mipmapped: a };
      },
      r
    );
  }
  edge(e, t, a) {
    const r = this.store.acquire(e);
    if (r) return r;
    const o = this.gl, i = t.width, n = t.height;
    if (i * n * 7 > this.scratchLimit) throw Error("Etching exceeds scratch budget");
    return this.store.create(
      e,
      i * n,
      () => {
        let c;
        if (this.mode === "gpu") c = this.etcher.run(t, i, n, a);
        else {
          const d = document.createElement("canvas");
          d.width = i, d.height = n;
          try {
            const h = d.getContext("2d", { willReadFrequently: !0 });
            h.drawImage(t, 0, 0);
            const f = h.getImageData(0, 0, i, n).data, l = this.kernels.etch(
              i,
              n,
              new Uint8Array(f.buffer, f.byteOffset, f.byteLength),
              a
            ), u = new Uint8Array(l.length);
            for (let p = 0; p < n; p++)
              u.set(l.subarray(p * i, (p + 1) * i), (n - 1 - p) * i);
            c = I(o, i, n), o.bindTexture(o.TEXTURE_2D, c), o.pixelStorei(o.UNPACK_ALIGNMENT, 1), o.texSubImage2D(o.TEXTURE_2D, 0, 0, 0, i, n, o.RED, o.UNSIGNED_BYTE, u);
          } finally {
            d.width = d.height = 0;
          }
        }
        return this.uploads++, this.edgeBuilds++, { texture: c, width: i, height: n };
      },
      0
    );
  }
  uploadBytes(e, t, a) {
    const r = this.store.acquire(e);
    if (r) return r;
    const o = this.gl, [i, n] = a, c = new Uint8Array(t.length);
    for (let d = 0; d < n; d++)
      c.set(t.subarray(d * i * 4, (d + 1) * i * 4), (n - 1 - d) * i * 4);
    return this.store.create(e, i * n * 4, () => {
      const d = I(o, i, n, o.RGBA8, o.RGBA);
      return o.bindTexture(o.TEXTURE_2D, d), o.pixelStorei(o.UNPACK_ALIGNMENT, 1), o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL, !1), o.texSubImage2D(o.TEXTURE_2D, 0, 0, 0, i, n, o.RGBA, o.UNSIGNED_BYTE, c), this.uploads++, { texture: d, width: i, height: n };
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
const tt = 732;
function rt(s, e = _.period) {
  if (!Number.isFinite(s) || s <= 0 || !Number.isFinite(e) || e < 2 || e > 16)
    throw RangeError("Invalid print-dot period or face width");
  return e * s / tt;
}
const _ = Object.freeze({
  amount: 0.35,
  period: 2,
  variation: 0.5,
  inset: 0.035,
  artwork: !0
});
function V(s) {
  return [
    s ? s.amount ?? _.amount : 0,
    s?.period ?? _.period,
    s?.variation ?? _.variation,
    s?.inset ?? _.inset
  ];
}
function Re(s) {
  const e = new Float32Array(32);
  return s.forEach(([t, a, r, o], i) => e.set([t, 1 - a - o, t + r, 1 - a], i * 4)), e;
}
const ne = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`, ce = `#version 300 es
#define PRINT_DOT_ART_WINDOWS
#define GLINT_PRINT_FACE(uv) textureLod(face,uv,0.)
precision highp float;
in vec2 uv;out vec4 color;uniform sampler2D face;
vec3 previewInk(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 previewLinear(vec3 c){return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c));}
${ye.replace("flat in vec4 printDotsInfo;", "uniform vec4 printDotsInfo;")}
void main(){
 printFootprint=1./printDotPeriodTexels();
 // Fine screens need pixel-area coverage before they enter the mip chain.
 // Sample only the ink screen: averaging source texels would soften lettering.
 // This pass is cached per printing/settings, never rerun for pointer motion.
 if(printDotPeriodTexels()<4.){
  vec4 source=textureLod(face,uv,0.);vec3 ink=previewInk(source.rgb),sum=vec3(0.);
  vec2 pixel=1./vec2(textureSize(face,0));
  for(int y=0;y<2;y++)for(int x=0;x<2;x++){
   vec2 offset=(vec2(float(x),float(y))-.5)*.5;
   sum+=previewLinear(printDotInk(ink,uv+offset*pixel));
  }
  color=vec4(sum*.25,source.a);
 }else color=printFace(uv);
}`, le = 16 * 1024 * 1024, de = (s) => Te(s.width, s.height), fe = (s, e) => 1 / rt(s.width, e) >= 0.9;
class J {
  constructor(e, t) {
    this.gl = e, this.shader = t ?? M(e, ce, ne);
    const a = e.createFramebuffer(), r = e.createVertexArray();
    if (!a || !r)
      throw e.deleteFramebuffer(a), e.deleteVertexArray(r), t || e.deleteProgram(this.shader), Error("Printing resources unavailable");
    this.framebuffer = a, this.vao = r;
  }
  gl;
  shader;
  framebuffer;
  vao;
  entries = [];
  invisible = /* @__PURE__ */ new WeakMap();
  frame = 0;
  bytes = 0;
  passes = 0;
  static async create(e, t) {
    const a = await B(e, ce, ne, t);
    try {
      if (t?.throwIfAborted(), e.isContextLost()) throw Error("Context lost during printing preparation");
      return $(e, () => new J(e, a));
    } catch (r) {
      throw e.deleteProgram(a), r;
    }
  }
  /** Protect the active working set. Overflow uses the existing procedural path
   * instead of evicting and rebuilding the same printing on every frame. */
  beginFrame() {
    this.frame++;
  }
  prepare(e, t, a, r = []) {
    const o = V(a);
    if (e.mipmapped && (!t || t.mipmapped) && (o[0] <= 0 || fe(e, o[1]) && (!t || fe(t, o[1])))) {
      const l = this.invisible.get(e.texture);
      if (l && l.overlay?.texture === t?.texture) return l;
      const u = {
        source: e,
        overlay: t,
        settings: "invisible",
        face: e,
        top: t,
        bytes: 0,
        lastFrame: this.frame
      };
      return this.invisible.set(e.texture, u), u;
    }
    const i = a.artwork !== !1, n = JSON.stringify([o, i, i ? [] : r]), c = this.entries.findIndex(
      (l) => l.source.texture === e.texture && l.overlay?.texture === t?.texture && l.settings === n
    );
    if (c >= 0) {
      const l = this.entries.splice(c, 1)[0];
      return l.lastFrame = this.frame, this.entries.push(l), l;
    }
    const d = de(e) + (t ? de(t) : 0);
    if (d > le) return;
    for (; this.bytes + d > le; ) {
      const l = this.entries.findIndex(
        (p) => this.frame === 0 || p.lastFrame < this.frame - 1
      );
      if (l < 0) return;
      const u = this.entries.splice(l, 1)[0];
      this.release(u);
    }
    let h, f;
    try {
      h = this.paint(e, o, r, i), t && (f = this.paint(t, o, r, i));
      const l = { source: e, overlay: t, settings: n, face: h, top: f, bytes: d, lastFrame: this.frame };
      return this.entries.push(l), this.bytes += d, l;
    } catch (l) {
      throw this.gl.deleteTexture(h?.texture ?? null), this.gl.deleteTexture(f?.texture ?? null), l;
    }
  }
  /** Uncached native preparation. The caller owns and deletes the returned texture. */
  paint(e, t, a = [], r = !0) {
    const o = this.gl, i = e.width, n = e.height, c = I(o, i, n, o.SRGB8_ALPHA8, o.RGBA);
    try {
      if (o.bindFramebuffer(o.FRAMEBUFFER, this.framebuffer), o.framebufferTexture2D(o.FRAMEBUFFER, o.COLOR_ATTACHMENT0, o.TEXTURE_2D, c, 0), o.checkFramebufferStatus(o.FRAMEBUFFER) !== o.FRAMEBUFFER_COMPLETE)
        throw Error("Printed ink framebuffer is incomplete");
      return o.viewport(0, 0, i, n), o.disable(o.DEPTH_TEST), o.disable(o.CULL_FACE), o.disable(o.SCISSOR_TEST), o.disable(o.BLEND), o.disable(o.DITHER), o.colorMask(!0, !0, !0, !0), o.useProgram(this.shader), o.bindVertexArray(this.vao), o.activeTexture(o.TEXTURE0), o.bindTexture(o.TEXTURE_2D, e.texture), o.uniform1i(o.getUniformLocation(this.shader, "face"), 0), o.uniform4fv(o.getUniformLocation(this.shader, "printDotsInfo"), t), o.uniform4fv(
        o.getUniformLocation(this.shader, "printArtBounds[0]"),
        Re(a)
      ), o.uniform1f(o.getUniformLocation(this.shader, "printArtwork"), r ? 1 : 0), o.drawArrays(o.TRIANGLES, 0, 3), this.passes++, o.bindTexture(o.TEXTURE_2D, c), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MIN_FILTER, o.LINEAR_MIPMAP_LINEAR), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MAG_FILTER, o.LINEAR), o.generateMipmap(o.TEXTURE_2D), { texture: c, width: i, height: n };
    } catch (d) {
      throw o.deleteTexture(c), d;
    } finally {
      o.bindFramebuffer(o.FRAMEBUFFER, this.framebuffer), o.framebufferTexture2D(o.FRAMEBUFFER, o.COLOR_ATTACHMENT0, o.TEXTURE_2D, null, 0), o.bindFramebuffer(o.FRAMEBUFFER, null), o.bindVertexArray(null), o.viewport(0, 0, o.drawingBufferWidth, o.drawingBufferHeight);
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
const he = {
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
}, A = 49;
class ue {
  constructor(e, t, a) {
    this.canvas = e, this.invalidate = t, this.onError = a;
    const r = e.getContext("webgl2", {
      alpha: !0,
      antialias: !0,
      premultipliedAlpha: !1,
      preserveDrawingBuffer: !0
    });
    if (!r) throw Error("WebGL2 is required");
    this.gl = r, this.vao = r.createVertexArray(), this.quad = r.createBuffer(), this.instances = r.createBuffer(), this.blank = I(r, 1, 1, r.RGBA8, r.RGBA), r.bindTexture(r.TEXTURE_2D, this.blank), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, 1, 1, r.RGBA, r.UNSIGNED_BYTE, new Uint8Array(4)), r.bindVertexArray(this.vao), r.bindBuffer(r.ARRAY_BUFFER, this.quad), r.bufferData(
      r.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      r.STATIC_DRAW
    ), r.enableVertexAttribArray(0), r.vertexAttribPointer(0, 2, r.FLOAT, !1, 0, 0), r.bindBuffer(r.ARRAY_BUFFER, this.instances);
    for (let o = 0; o < 4; o++)
      r.enableVertexAttribArray(1 + o), r.vertexAttribPointer(1 + o, 4, r.FLOAT, !1, A * 4, o * 16), r.vertexAttribDivisor(1 + o, 1);
    r.enableVertexAttribArray(5), r.vertexAttribPointer(5, 3, r.FLOAT, !1, A * 4, 64), r.vertexAttribDivisor(5, 1), r.enableVertexAttribArray(6), r.vertexAttribPointer(6, 1, r.FLOAT, !1, A * 4, 76), r.vertexAttribDivisor(6, 1);
    for (let o = 7; o <= 11; o++)
      r.enableVertexAttribArray(o), r.vertexAttribPointer(o, 4, r.FLOAT, !1, A * 4, 80 + (o - 7) * 16), r.vertexAttribDivisor(o, 1);
    r.enableVertexAttribArray(12), r.vertexAttribPointer(12, 2, r.FLOAT, !1, A * 4, 160), r.vertexAttribDivisor(12, 1), r.enableVertexAttribArray(13), r.vertexAttribPointer(13, 1, r.FLOAT, !1, A * 4, 168), r.vertexAttribDivisor(13, 1), r.enableVertexAttribArray(14), r.vertexAttribPointer(14, 4, r.FLOAT, !1, A * 4, 172), r.vertexAttribDivisor(14, 1), r.enableVertexAttribArray(15), r.vertexAttribPointer(15, 2, r.FLOAT, !1, A * 4, 188), r.vertexAttribDivisor(15, 1), r.bindVertexArray(null);
  }
  canvas;
  invalidate;
  onError;
  gl;
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
  motion = new ie();
  caustics;
  cardstock;
  printedInk;
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
  key(e, t, a) {
    return `${t ?? "regular"}:${!!e.hologram?.strength}:${a}`;
  }
  changed = () => {
    !this.disposed && !this.gl.isContextLost() && this.invalidate?.();
  };
  report = (e) => {
    this.disposed || this.gl.isContextLost() || this.reported.has(e) || (this.reported.add(e), this.onError?.(e));
  };
  compile(e, t, a) {
    const r = this.key(e, t, a);
    let o = this.programs.get(r);
    if (!o) {
      this.compiling++;
      const i = {
        promise: Promise.resolve().then(
          () => B(
            this.gl,
            Qe(
              he[t ?? "regular"],
              !!e.hologram?.strength,
              a
            ),
            te,
            this.lifetime.signal
          )
        )
      };
      i.promise = i.promise.then((n) => {
        if (this.disposed)
          throw this.gl.isContextLost() || this.gl.deleteProgram(n), this.lifetime.signal.reason;
        return i.value = n, this.changed(), n;
      }).finally(() => this.compiling--), this.programs.set(r, o = i);
    }
    return o.promise;
  }
  async prepare(e, t, a) {
    if (a?.throwIfAborted(), this.disposed) throw Error("Device disposed");
    const r = [];
    t.length || r.push(this.compile(e, "regular", !1));
    const o = /* @__PURE__ */ new Set();
    for (const n of t) {
      const c = this.activePrint(n), d = this.key(e, n.finish, c);
      o.has(d) || (o.add(d), r.push(this.compile(e, n.finish, c)));
    }
    t.some((n) => n.finish === "pool") && (this.causticsPending || this.compiling++, this.causticsPending ??= Promise.resolve().then(() => Y.create(this.gl, this.lifetime.signal)).then((n) => {
      if (this.disposed)
        throw this.gl.isContextLost() || n.dispose(), this.lifetime.signal.reason;
      return this.caustics = n, this.changed(), n;
    }).finally(() => this.compiling--), r.push(this.causticsPending)), t.some(
      (n) => n.finish && n.finish !== "regular" && (n.cardstock?.amount ?? 0) > 0
    ) && (this.cardstockPending || this.compiling++, this.cardstockPending ??= Promise.resolve().then(() => K.create(this.gl, this.lifetime.signal)).then((n) => {
      if (this.disposed)
        throw this.gl.isContextLost() || n.dispose(), this.lifetime.signal.reason;
      return this.cardstock = n, this.changed(), n;
    }).finally(() => this.compiling--), r.push(this.cardstockPending)), t.some((n) => this.activePrint(n)) && (this.printedInkPending || this.compiling++, this.printedInkPending ??= Promise.resolve().then(() => J.create(this.gl, this.lifetime.signal)).then((n) => {
      if (this.disposed)
        throw this.gl.isContextLost() || n.dispose(), this.lifetime.signal.reason;
      return this.printedInk = n, this.changed(), n;
    }).finally(() => this.compiling--), r.push(this.printedInkPending));
    const i = Promise.all(r).then(() => {
    });
    if (!a) return i;
    await new Promise((n, c) => {
      const d = () => c(a.reason);
      a.addEventListener("abort", d, { once: !0 }), a.aborted && d(), i.then(n, c).finally(() => a.removeEventListener("abort", d));
    });
  }
  prepareLayers() {
    return this.disposed ? Promise.reject(Error("Device disposed")) : (this.imagePending || this.compiling++, this.imagePending ??= Promise.resolve().then(() => B(this.gl, et, te, this.lifetime.signal)).then((e) => {
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
    let a = this.uniforms.get(e);
    return a || this.uniforms.set(e, a = /* @__PURE__ */ new Map()), a.has(t) || a.set(t, this.gl.getUniformLocation(e, t)), a.get(t);
  }
  bind(e, t, a, r = !1) {
    const o = this.gl;
    o.useProgram(e), o.bindVertexArray(this.vao), o.bindBuffer(o.ARRAY_BUFFER, this.instances);
    const i = a.length * A;
    this.staging.length < i && (this.staging = new Float32Array(i));
    const n = this.staging;
    if (a.forEach((c, d) => {
      const h = d * A;
      n.set(c.transform, h), n.set(c.normal ?? [0, 0, 1], h + 16), n[h + 19] = he[c.finish ?? "regular"];
      const f = this.motion.sample(c, t);
      f ? n.set(f, h + 20) : n.fill(0, h + 20, h + A), n[h + 22] = X(c.id), n[h + 23] = c.deformation?.amount ?? 0, n[h + 40] = c.wear?.amount ?? 0, n[h + 41] = X(c.wear?.seed ?? c.id), n[h + 42] = c.cardstock?.amount ?? 0;
      const l = c.printDots;
      n[h + 43] = r || !l ? 0 : l.amount ?? _.amount, n[h + 44] = l?.period ?? _.period, n[h + 45] = l?.variation ?? _.variation, n[h + 46] = l?.inset ?? _.inset, n[h + 47] = c.rainFog ?? 1, n[h + 48] = c.printDots?.artwork === !1 ? 0 : 1;
    }), this.instanceCapacity < i && (this.instanceCapacity = i, o.bufferData(o.ARRAY_BUFFER, i * 4, o.DYNAMIC_DRAW)), o.bufferSubData(o.ARRAY_BUFFER, 0, n, 0, i), this.frameUniforms.get(e) !== t) {
      o.uniformMatrix4fv(this.uniform(e, "viewProjection"), !1, t.viewProjection);
      const c = t.lighting === "studio" ? [0.5, 0.5] : t.pointer ?? [0.5, 0.5];
      o.uniform2f(this.uniform(e, "pointer"), c[0], 1 - c[1]), o.uniform1f(this.uniform(e, "surfaceTime"), t.time ?? 0), o.uniform1f(this.uniform(e, "studioLighting"), t.lighting === "studio" ? 1 : 0), this.frameUniforms.set(e, t);
    }
  }
  printing(e, t) {
    const a = t[0]?.printDots, r = V(a);
    return a && r[0] > 0 && (t.length === 1 || t.every(
      (i) => V(i.printDots).every((n, c) => n === r[c]) && i.printDots?.artwork !== !1 == (a.artwork !== !1)
    )) ? this.printedInk?.prepare(
      e.face,
      e.overlay,
      a,
      e.recipe.artWindows
    ) : void 0;
  }
  draw(e, t, a) {
    const r = this.gl, o = a.some((w) => this.activePrint(w)), i = this.programs.get(this.key(e.recipe, a[0]?.finish, o))?.value, n = a.some((w) => w.finish === "pool"), c = a.some(
      (w) => w.finish && w.finish !== "regular" && (w.cardstock?.amount ?? 0) > 0
    );
    if (!i || n && !this.caustics || c && !this.cardstock || o && !this.printedInk) {
      this.prepare(e.recipe, a).catch(this.report);
      return;
    }
    n && this.caustics.prepare(t.time ?? 0), c && this.cardstock.prepare();
    const d = this.printing(e, a);
    this.bind(i, t, a, !!d), r.enable(r.DEPTH_TEST), r.depthFunc(r.LEQUAL), r.depthMask(!0), r.disable(r.BLEND), [
      ["face", d?.face.texture ?? e.face.texture],
      ["mask", e.mask.texture],
      ["overlay", d?.top?.texture ?? e.overlay?.texture ?? this.blank],
      ["coverage", e.coverage?.texture ?? this.blank],
      ["caustics", this.caustics?.map ?? this.blank],
      ["hologramMask", e.hologram?.texture ?? this.blank],
      ["cardstockMap", this.cardstock?.map ?? this.blank]
    ].forEach(([w, v], x) => {
      r.activeTexture(r.TEXTURE0 + x), r.bindTexture(r.TEXTURE_2D, v), r.uniform1i(this.uniform(i, w), x);
    });
    let f = this.bounds.get(e.recipe);
    f || this.bounds.set(e.recipe, f = Re(e.recipe.artWindows)), r.uniform4fv(this.uniform(i, "artBounds[0]"), f), r.uniform4fv(this.uniform(i, "printArtBounds[0]"), f), r.uniform1f(this.uniform(i, "finishBase"), e.recipe.finishCoverageBase ?? 1);
    const l = e.recipe.hologram, [u, p, g, b] = l?.rect ?? [0, 0, 1, 1];
    r.uniform4f(this.uniform(i, "hologramRect"), u, 1 - p - b, g, b), r.uniform2f(
      this.uniform(i, "hologramMaterial"),
      l?.strength ?? 0,
      (l?.seed ?? 0) / 4294967295
    );
    const m = e.recipe.overlayFoil;
    r.uniform2f(
      this.uniform(i, "overlayFoil"),
      m ? { gold: 1, silver: 3, prismatic: 2 }[m.tone] : 0,
      m?.strength ?? 0
    ), r.uniform1f(this.uniform(i, "cornerRadius"), e.recipe.cornerRadius), r.uniform1f(this.uniform(i, "aspect"), e.face.height / e.face.width), r.uniform1f(this.uniform(i, "hasMask"), 1), r.uniform1f(this.uniform(i, "satinCompact"), 1), r.uniform1f(this.uniform(i, "satinHoverGain"), 0), r.drawArraysInstanced(r.TRIANGLES, 0, 6, a.length), this.draws++;
  }
  drawLayer(e, t, a) {
    const r = this.gl, o = this.image;
    if (!o) {
      this.prepareLayers().catch(this.report);
      return;
    }
    this.bind(o, a, [{ id: 0, card: 0, transform: e.transform }]), e.depth === "ignore" ? r.disable(r.DEPTH_TEST) : (r.enable(r.DEPTH_TEST), r.depthFunc(r.LEQUAL)), r.depthMask(e.depth === "test-write"), r.enable(r.BLEND), r.blendFuncSeparate(r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, t.texture), r.uniform1i(this.uniform(o, "face"), 0), r.drawArraysInstanced(r.TRIANGLES, 0, 6, 1), this.draws++, r.depthMask(!0), r.disable(r.BLEND);
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
    return this.motion = new ie(), () => {
      this.motion = e;
    };
  }
}
const it = `#version 300 es
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
class at {
  constructor(e) {
    this.textures = e;
    const t = e.gl;
    this.shader = M(t, it), this.fbo = t.createFramebuffer(), this.vao = t.createVertexArray();
  }
  textures;
  shader;
  fbo;
  vao;
  disposed = !1;
  builds = 0;
  compose(e, t, a, r) {
    const o = this.textures.store.acquire(e);
    if (o) return o;
    const i = this.textures.gl, [n, c] = t;
    return this.textures.store.create(e, n * c, () => {
      const d = I(i, n, c);
      try {
        if (i.bindFramebuffer(i.FRAMEBUFFER, this.fbo), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, d, 0), i.checkFramebufferStatus(i.FRAMEBUFFER) !== i.FRAMEBUFFER_COMPLETE)
          throw Error("Mask framebuffer unavailable");
        i.bindVertexArray(this.vao), i.viewport(0, 0, n, c), i.disable(i.DEPTH_TEST), i.disable(i.SCISSOR_TEST), i.disable(i.DITHER), i.colorMask(!0, !0, !0, !0), i.clearColor(0, 0, 0, 0), i.clear(i.COLOR_BUFFER_BIT), i.useProgram(this.shader), i.enable(i.BLEND), i.blendFunc(i.ONE, i.ONE_MINUS_SRC_ALPHA);
        const h = (f, l, u, p, g, b = 0) => {
          i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, f.texture), i.uniform1i(i.getUniformLocation(this.shader, "inputMask"), 0), i.uniform2f(i.getUniformLocation(this.shader, "size"), n, c), i.uniform4fv(i.getUniformLocation(this.shader, "cover"), l), i.uniform4fv(i.getUniformLocation(this.shader, "clip"), u), i.uniform4fv(i.getUniformLocation(this.shader, "crop"), p), i.uniform1f(i.getUniformLocation(this.shader, "alphaChannel"), g ? 1 : 0), i.uniform1f(i.getUniformLocation(this.shader, "angle"), b), i.drawArrays(i.TRIANGLES, 0, 3);
        };
        r && h(r, [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1], !0);
        for (const { value: f, spec: l } of a) {
          const [u, p, g, b] = l.destination, m = l.rotation ?? 0, w = f.width * l.crop[2], v = f.height * l.crop[3];
          let x;
          if (l.fit) {
            const R = l.fit.focalPoint ?? [0.5, 0.5], y = {
              ...l.fit,
              focalPoint: m === 90 ? [1 - R[1], R[0]] : m === -90 ? [R[1], 1 - R[0]] : R
            }, F = _e(
              m ? v : w,
              m ? w : v,
              [u * n, p * c, g * n, b * c],
              y
            );
            x = [F[0] / n, F[1] / c, F[2] / n, F[3] / c];
          } else {
            const R = Math.max(
              g * n / (m ? v : w),
              b * c / (m ? w : v)
            ), y = (m ? v : w) * R / n, F = (m ? w : v) * R / c;
            x = [u + (g - y) / 2, p + (b - F) / 2, y, F];
          }
          h(f, x, l.clip, l.crop, !!l.importedMask, m);
        }
        this.builds++;
      } catch (h) {
        throw i.deleteTexture(d), h;
      } finally {
        i.disable(i.BLEND), i.bindFramebuffer(i.FRAMEBUFFER, null), i.bindVertexArray(null);
      }
      return { texture: d, width: n, height: c };
    });
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    const e = this.textures.gl;
    e.deleteProgram(this.shader), e.deleteFramebuffer(this.fbo), e.deleteVertexArray(this.vao);
  }
}
async function C(s, e, t, a) {
  t.throwIfAborted();
  const r = await s.paint(e, t, a);
  if (r.width !== s.size[0] || r.height !== s.size[1] || t.aborted)
    throw T(r), t.throwIfAborted(), Error("Raster dimensions differ from recipe");
  if ("getContext" in r) return r;
  const o = W(s.size);
  try {
    const i = o.getContext("2d");
    if (!i) throw Error("Canvas2D raster unavailable");
    return i.drawImage(r, 0, 0), o;
  } catch (i) {
    throw T(o), i;
  } finally {
    r.close();
  }
}
function q(s) {
  const e = s.layers ?? [], t = Ne(
    JSON.stringify(
      e.map((a) => ({
        id: a.id,
        stage: a.stage,
        order: a.order,
        contributesToEtch: a.contributesToEtch ?? !1
      }))
    )
  );
  return Array.from(t, (a) => e[a]);
}
function D(s) {
  return JSON.stringify(s.map((e) => [e.id, e.stage, e.order, e.raster.key, e.clip]));
}
async function U(s, e, t, a, r = W(s)) {
  const o = r.getContext("2d");
  try {
    for (const i of e) {
      const n = await C(i.raster, t, a);
      try {
        if (o.save(), i.clip) {
          o.beginPath();
          const [c, d, h, f] = i.clip;
          o.rect(c * s[0], d * s[1], h * s[0], f * s[1]), o.clip();
        }
        o.drawImage(n, 0, 0, ...s), o.restore();
      } finally {
        T(n);
      }
    }
    return r;
  } catch (i) {
    throw T(r), i;
  }
}
async function st(s, e, t, a) {
  const r = W(s), o = r.getContext("2d", { willReadFrequently: !0 }), i = o.createImageData(...s);
  try {
    for (const n of e) {
      const c = [
        n.finishCoverage?.add,
        n.finishCoverage?.exclude,
        n.etchCoverage?.add,
        n.etchCoverage?.exclude
      ];
      for (let d = 0; d < 4; d++) {
        const h = c[d];
        if (!h) continue;
        const f = await U(s, [{ ...n, raster: h }], t, a);
        try {
          const l = f.getContext("2d").getImageData(0, 0, ...s).data;
          for (let u = 0; u < l.length; u += 4)
            i.data[u + d] = Math.max(i.data[u + d], l[u + 3]);
        } finally {
          T(f);
        }
      }
    }
    return T(r), new Uint8Array(i.data.buffer);
  } catch (n) {
    throw T(r), n;
  }
}
class pe {
  constructor(e, t) {
    this.textures = e, this.assets = t, this.masks = new at(e);
  }
  textures;
  assets;
  masks;
  pending = /* @__PURE__ */ new Map();
  compositions = 0;
  async ensure(e, t) {
    const a = this.textures.store.acquire(e);
    if (a) return a;
    let r = this.pending.get(e);
    r || (r = t().then((i) => i.release()).finally(() => this.pending.delete(e)), this.pending.set(e, r)), await r;
    const o = this.textures.store.acquire(e);
    if (!o) throw Error("Prepared working set exceeds GPU budget");
    return o;
  }
  async prepare(e, t) {
    const { recipe: a } = e, r = a.color.size, o = q(e), i = [], n = o.filter((v) => v.stage === "under-art"), c = o.filter((v) => v.stage === "printed-content" || v.stage === "under-finish"), d = o.filter((v) => v.stage === "over-finish"), h = o.filter((v) => v.contributesToEtch), f = o.filter((v) => v.finishCoverage || v.etchCoverage), l = `${a.pack}:`, u = l + JSON.stringify(["color-v1", a.color.key, D([...n, ...c])]), p = l + JSON.stringify(["mask-v1", r, a.edges, a.stamp?.key, D(h)]), g = d.length ? l + JSON.stringify(["over-v1", r, D(d)]) : void 0, b = f.length ? l + JSON.stringify([
      "coverage-v1",
      r,
      f.map((v) => [
        v.clip,
        v.finishCoverage?.add?.key,
        v.finishCoverage?.exclude?.key,
        v.etchCoverage?.add?.key,
        v.etchCoverage?.exclude?.key
      ])
    ]) : void 0, m = a.hologram ? l + JSON.stringify(["hologram-v1", a.hologram.mask.key, a.hologram.mask.size]) : void 0, w = JSON.stringify(
      a.hologram ? [a.hologram.rect, a.hologram.strength, a.hologram.seed ?? 0] : null
    );
    try {
      return i.push(
        await this.ensure(u, async () => {
          const v = n.length ? await U(r, n, this.assets, t) : void 0;
          let x;
          try {
            return x = await C(a.color, this.assets, t, v), await U(r, c, this.assets, t, x), t.throwIfAborted(), this.compositions++, this.textures.upload(u, x);
          } finally {
            v && T(v), x && T(x);
          }
        })
      ), i.push(await this.prepareMask(e, t)), g && i.push(
        await this.ensure(g, async () => {
          const v = await U(r, d, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(g, v);
          } finally {
            T(v);
          }
        })
      ), b && i.push(
        await this.ensure(b, async () => {
          const v = await st(r, f, this.assets, t);
          return t.throwIfAborted(), this.textures.uploadBytes(b, v, r);
        })
      ), m && i.push(
        await this.ensure(m, async () => {
          const v = await C(a.hologram.mask, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(m, v, !1);
          } finally {
            T(v);
          }
        })
      ), t.throwIfAborted(), { color: u, mask: p, overlay: g, coverage: b, hologram: m, hologramSettings: w, document: e };
    } finally {
      for (const v of i) v.release();
    }
  }
  async prepareMask(e, t) {
    const { recipe: a } = e, r = a.color.size, o = q(e).filter((c) => c.contributesToEtch), i = `${a.pack}:`, n = i + JSON.stringify(["mask-v1", r, a.edges, a.stamp?.key, D(o)]);
    return this.ensure(n, async () => {
      const c = [], d = [];
      try {
        for (const f of a.edges) {
          const l = i + JSON.stringify([
            "edge-integer-v1",
            f.key,
            f.asset,
            f.importedMask,
            f.threshold
          ]), u = await this.ensure(l, async () => {
            const p = f.importedMask ?? f.asset, g = await this.assets.images([p], t);
            try {
              t.throwIfAborted();
              const b = g.value.get(p.url);
              if (!b) throw Error(`Edge asset unavailable: ${p.url}`);
              return f.importedMask ? this.textures.upload(l, b, !1, 0) : this.textures.edge(l, b, f.threshold);
            } finally {
              g.release();
            }
          });
          d.push(u), c.push({ value: u.value, spec: f });
        }
        for (const f of o) {
          const l = i + JSON.stringify(["contribution-v1", r, D([f])]), u = await this.ensure(l, async () => {
            const p = await U(r, [f], this.assets, t);
            try {
              return t.throwIfAborted(), this.textures.edge(l, p, 20);
            } finally {
              T(p);
            }
          });
          d.push(u), c.push({
            value: u.value,
            spec: {
              key: l,
              asset: { url: "" },
              crop: [0, 0, 1, 1],
              destination: [0, 0, 1, 1],
              clip: [0, 0, 1, 1],
              threshold: 20
            }
          });
        }
        let h;
        if (a.stamp) {
          const f = a.stamp, l = i + JSON.stringify(["stamp-v1", f.key]);
          h = await this.ensure(l, async () => {
            const u = await C(f, this.assets, t);
            try {
              return t.throwIfAborted(), this.textures.upload(l, u, !1, 0);
            } finally {
              T(u);
            }
          }), d.push(h);
        }
        return t.throwIfAborted(), this.masks.compose(n, r, c, h?.value);
      } finally {
        for (const h of d) h.release();
      }
    });
  }
  dispose() {
    this.masks.dispose();
  }
}
const z = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
let H;
class ot {
  constructor(e) {
    if (this.options = e, this.budgets = {
      gpuBytes: 64 * 1024 * 1024,
      cpuBytes: 32 * 1024 * 1024,
      scratchBytes: 16 * 1024 * 1024,
      preparationConcurrency: 2,
      ...e.budgets
    }, !Number.isInteger(this.budgets.preparationConcurrency) || this.budgets.preparationConcurrency < 1 || this.budgets.preparationConcurrency > 4)
      throw RangeError("Preparation concurrency must be 1–4");
    this.assets = new ze(this.budgets.cpuBytes), this.device = new ue(e.canvas, e.invalidate, e.onError), this.textures = new oe(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      e.etching
    ), this.preparer = new pe(this.textures, e.rasterHost ?? this.assets), e.canvas.addEventListener("webglcontextlost", this.contextLost), e.canvas.addEventListener("webglcontextrestored", this.contextRestored);
  }
  options;
  abiVersion = 1;
  assets;
  device;
  textures;
  preparer;
  scene = new Se();
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
  assertLive() {
    if (this.disposed) throw Error("Renderer disposed");
  }
  upsertCards(e) {
    if (this.assertLive(), new Set(e.map((t) => t.id)).size !== e.length)
      throw Error("Duplicate document ID");
    for (const t of e) {
      Ce(t), q(t);
      const a = this.documents.get(t.id);
      if (a && t.revision <= a.revision && a !== t)
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
    const t = e.map((a) => ({
      ...a,
      transform: [...a.transform],
      normal: a.normal ? [...a.normal] : void 0,
      deformation: a.deformation ? { ...a.deformation } : void 0,
      wear: a.wear ? { ...a.wear } : void 0,
      cardstock: a.cardstock ? { ...a.cardstock } : void 0,
      printDots: a.printDots ? { ...a.printDots } : void 0
    }));
    for (const a of t)
      if (Z(a), !this.documents.has(a.card)) throw Error(`Unknown card ${a.card}`);
    this.scene.update(
      Uint32Array.from(t, (a) => a.id),
      Float32Array.from(t.flatMap((a) => a.transform)),
      Int32Array.from(t, (a) => a.order ?? 0)
    ), this.instances = t;
  }
  plan(e) {
    return this.shapeData.length !== this.instances.length * 4 && (this.shapeData = new Float32Array(this.instances.length * 4)), this.instances.forEach((t, a) => {
      const r = (this.prepared.get(t.card)?.document ?? this.documents.get(t.card)).recipe, o = a * 4;
      this.shapeData[o] = r.color.size[1] / r.color.size[0], this.shapeData[o + 1] = r.cornerRadius, this.shapeData[o + 2] = t.deformation?.amount ?? 0, this.shapeData[o + 3] = X(t.id);
    }), this.scene.plan_shaped(e.viewProjection, this.shapeData, e.time ?? 0);
  }
  ready(e, t, a) {
    if (this.assertLive(), this.lost) return Promise.reject(Error("Graphics context is lost"));
    if (a?.aborted) return Promise.reject(a.reason);
    const r = this.documents.get(e);
    if (!r || r.revision !== t)
      return Promise.reject(Error("Requested revision is not current"));
    this.failed.delete(r);
    const o = this.device, i = this.enqueue(r).then(async () => {
      const n = this.revisionControllers.get(r).signal;
      if (n.throwIfAborted(), a?.throwIfAborted(), this.device !== o || this.lost) throw Error("Graphics context changed");
      for (; ; ) {
        const c = this.instances, d = await this.prepareDevice(
          o,
          this.prepared.get(e),
          c.filter((h) => h.card === e),
          n
        );
        for (const h of d) h.release();
        if (n.throwIfAborted(), a?.throwIfAborted(), this.assertLive(), this.device !== o || this.lost)
          throw new DOMException("Graphics context changed", "AbortError");
        if (this.documents.get(e) !== r)
          throw new DOMException("Revision invalidated", "AbortError");
        if (this.instances === c) break;
      }
    });
    return a ? new Promise((n, c) => {
      if (a.aborted) {
        c(a.reason);
        return;
      }
      const d = () => c(a.reason);
      a.addEventListener("abort", d, { once: !0 }), i.then(n, c).finally(() => a.removeEventListener("abort", d));
    }) : i;
  }
  enqueue(e) {
    const t = this.jobs.get(e.id);
    if (t) return t.promise;
    let a, r;
    const o = new Promise((n, c) => {
      a = n, r = c;
    }), i = {
      document: e,
      controller: new AbortController(),
      promise: o,
      resolve: a,
      reject: r,
      started: !1
    };
    return this.jobs.set(e.id, i), queueMicrotask(() => this.pump()), o;
  }
  pump() {
    if (!(this.disposed || this.lost))
      for (const e of this.jobs.values()) {
        if (this.active >= this.budgets.preparationConcurrency) break;
        if (e.started) continue;
        e.started = !0, this.active++;
        const t = this.preparer, a = this.device;
        t.prepare(e.document, e.controller.signal).then(async (r) => {
          e.controller.signal.throwIfAborted();
          const o = await this.prepareDevice(
            a,
            r,
            this.instances.filter((i) => i.card === e.document.id),
            e.controller.signal
          );
          try {
            if (e.controller.signal.throwIfAborted(), this.documents.get(e.document.id) !== e.document)
              throw Error("Superseded preparation");
            this.prepared.set(e.document.id, r), e.resolve(), this.options.invalidate?.();
          } finally {
            for (const i of o) i.release();
          }
        }).catch((r) => {
          e.controller.signal.aborted || this.failed.add(e.document), e.reject(r);
        }).finally(() => {
          this.jobs.get(e.document.id) === e && this.jobs.delete(e.document.id), this.active--, this.pump();
        });
      }
  }
  cancel(e) {
    const t = this.documents.get(e);
    t && this.revisionControllers.get(t)?.abort(new DOMException("Revision invalidated", "AbortError"));
    const a = this.jobs.get(e);
    a && (a.controller.abort(new DOMException("Revision invalidated", "AbortError")), a.reject(a.controller.signal.reason), this.jobs.delete(e));
  }
  material(e, t) {
    const a = (d) => {
      if (!d) return;
      const h = this.textures.store.acquire(d);
      return h && t.push(h), h?.value;
    }, r = a(e.color), o = a(e.mask), i = a(e.overlay), n = a(e.coverage), c = a(e.hologram);
    return r && o && (!e.overlay || i) && (!e.coverage || n) && (!e.hologram || c) ? {
      face: r,
      mask: o,
      overlay: i,
      coverage: n,
      hologram: c,
      hologramSettings: e.hologramSettings,
      recipe: e.document.recipe
    } : null;
  }
  async prepareDevice(e, t, a, r) {
    const o = [];
    try {
      if (r?.throwIfAborted(), !this.material(t, o)) throw Error("Prepared working set exceeds GPU budget");
      return await e.prepare(t.document.recipe, a, r), o;
    } catch (i) {
      for (const n of o) n.release();
      throw i;
    }
  }
  render(e) {
    if (this.assertLive(), Me(e), this.lost) return this.metrics;
    const t = performance.now(), a = this.plan(e), r = [];
    this.lastFrame = e, this.device.begin(e), this.visible = a.length;
    const o = /* @__PURE__ */ new Map(), i = (n) => {
      const c = this.textures.store.acquire("scene:" + n.raster.key);
      if (!c) {
        !this.sceneLayerPending && !this.sceneLayerFailure && this.setSceneLayers(this.sceneLayers).catch(this.options.onError ?? console.error);
        return;
      }
      r.push(c), this.device.drawLayer(
        n,
        c.value,
        n.stage === "hud" ? { ...e, viewProjection: z } : e
      );
    };
    try {
      this.sceneLayers.filter((h) => h.stage === "world-under-cards").forEach(i);
      let n = [], c = null;
      const d = () => {
        c && n.length && this.device.draw(c, e, n), n = [];
      };
      for (const h of a) {
        const f = this.instances[h];
        let l = o.get(f.card);
        if (l === void 0) {
          const u = this.prepared.get(f.card), p = this.documents.get(f.card);
          l = u ? this.material(u, r) : null, o.set(f.card, l), (!l || u?.document !== p) && !this.jobs.has(p.id) && !this.failed.has(p) && this.enqueue(p).catch((g) => {
            g instanceof DOMException && g.name === "AbortError" || this.options.onError?.(g);
          });
        }
        (n.length > 0 && (n[0].finish ?? "regular") !== (f.finish ?? "regular") || l !== c && (!l || !c || l.face !== c.face || l.mask !== c.mask || l.overlay !== c.overlay || l.coverage !== c.coverage || l.hologram !== c.hologram || l.hologramSettings !== c.hologramSettings || l.recipe.cornerRadius !== c.recipe.cornerRadius || l.recipe.finishCoverageBase !== c.recipe.finishCoverageBase || l.recipe.overlayFoil?.tone !== c.recipe.overlayFoil?.tone || l.recipe.overlayFoil?.strength !== c.recipe.overlayFoil?.strength || JSON.stringify(l.recipe.artWindows) !== JSON.stringify(c.recipe.artWindows))) && (d(), c = l), l && n.push(f);
      }
      d();
      for (const h of ["world-interleaved", "scene-overlay", "hud"])
        this.sceneLayers.filter((f) => f.stage === h).forEach(i);
    } finally {
      for (const n of r) n.release();
      this.device.end();
    }
    return this.frameMs = performance.now() - t, this.metrics;
  }
  async setSceneLayers(e) {
    if (this.assertLive(), this.lost) throw Error("Graphics context is lost");
    if (new Set(e.map((c) => c.id)).size !== e.length)
      throw Error("Duplicate scene layer ID");
    for (const c of e) Ge(c);
    const t = e.map((c) => ({ ...c, transform: [...c.transform] })), a = ++this.sceneLayerGeneration, r = this.epoch, o = this.textures, i = [];
    this.sceneLayerFailure = !1, this.sceneLayerPending++;
    const n = () => {
      if (this.disposed || this.lost || this.epoch !== r || a !== this.sceneLayerGeneration)
        throw new DOMException("Stale scene layer preparation", "AbortError");
    };
    try {
      t.length && await this.device.prepareLayers(), n();
      for (const c of t) {
        const d = "scene:" + c.raster.key, h = o.store.acquire(d);
        if (h) {
          i.push(h);
          continue;
        }
        const f = await C(
          c.raster,
          this.options.rasterHost ?? this.assets,
          new AbortController().signal
        );
        try {
          n(), i.push(o.upload(d, f, !1));
        } finally {
          T(f);
        }
      }
      n(), this.sceneLayers = t.sort((c, d) => c.order - d.order || c.id.localeCompare(d.id)), this.options.invalidate?.();
    } catch (c) {
      throw a === this.sceneLayerGeneration && (this.sceneLayerFailure = !0), c;
    } finally {
      for (const c of i) c.release();
      this.sceneLayerPending--;
    }
  }
  hitTest(e, t) {
    const a = this.options.canvas.getBoundingClientRect(), r = this.scene.hit(e / a.width * 2 - 1, 1 - t / a.height * 2);
    if (!r.length) return null;
    const [o, i, n] = r, c = this.instances.find((f) => f.id === o), h = this.prepared.get(c.card)?.document.recipe?.regions.filter((f) => {
      const [l, u, p, g] = f.rect;
      return i >= l && n >= u && i <= l + p && n <= u + g;
    }).sort((f, l) => f.rect[2] * f.rect[3] - l.rect[2] * l.rect[3])[0]?.id;
    return { instance: o, card: c.card, uv: [i, n], part: h ?? null };
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
    this.documents.clear(), this.prepared.clear(), this.sceneLayers = [], this.sceneLayerFailure = !1, this.failed = /* @__PURE__ */ new WeakSet(), this.instances = [], this.device.resetMotion(), this.scene.update(new Uint32Array(), new Float32Array(), new Int32Array()), this.textures.store.clear(), this.assets.clear(), this.lost || this.device.begin({ viewProjection: z });
  }
  contextLost = (e) => {
    e.preventDefault(), this.lost = !0;
    for (const t of this.documents.keys()) this.cancel(t);
    this.prepared.clear(), this.sceneLayerGeneration++, this.preparer.dispose(), this.textures.store.clear(), this.textures.etcher.dispose(), this.device.dispose();
  };
  contextRestored = () => {
    if (this.disposed) return;
    this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.device = new ue(this.options.canvas, this.options.invalidate, this.options.onError), this.textures = new oe(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      this.options.etching
    ), this.preparer = new pe(this.textures, this.options.rasterHost ?? this.assets), this.lost = !1;
    for (const t of this.documents.values())
      this.revisionControllers.set(t, new AbortController());
    this.failed = /* @__PURE__ */ new WeakSet();
    const e = this.sceneLayers;
    this.sceneLayers = [], this.setSceneLayers(e).catch(this.options.onError ?? console.error), this.options.invalidate?.(), this.pump();
  };
  async exportCard(e, t) {
    ve(t.deformation), await this.ready(e, t.revision);
    const a = this.documents.get(e);
    if (a.revision !== t.revision) throw Error("Export revision changed");
    if (!Number.isInteger(t.width) || t.width < 1 || t.width > 2048)
      throw RangeError("Invalid export size");
    const r = Ue(t.deformation, t.width), o = {
      id: t.instanceId ?? 0,
      card: e,
      finish: t.finish,
      normal: t.normal,
      rainFog: t.rainFog,
      wear: t.wear,
      cardstock: t.cardstock,
      printDots: t.printDots,
      deformation: t.deformation,
      transform: [2 * r, 0, 0, 0, 0, -2 * r, 0, 0, 0, 0, 1, 0, -r, r, 0, 1]
    };
    Z(o);
    const i = this.device, n = this.epoch, c = await this.prepareDevice(
      i,
      this.prepared.get(e),
      [o],
      this.revisionControllers.get(a).signal
    );
    for (const b of c) b.release();
    if (this.assertLive(), this.lost || this.device !== i || this.epoch !== n)
      throw Error("Graphics context changed during export");
    if (this.documents.get(e) !== a) throw Error("Export revision changed");
    const d = this.options.canvas, h = [d.width, d.height], f = this.instances, l = this.sceneLayers, u = this.lastFrame;
    let p;
    const g = i.isolateMotion();
    try {
      d.width = t.width, d.height = Math.round(
        t.width * a.recipe.color.size[1] / a.recipe.color.size[0]
      ), this.sceneLayers = [], this.updateScene([o]), this.render({
        viewProjection: z,
        pointer: t.pointer,
        lighting: t.lighting,
        time: t.time ?? u?.time
      }), p = new Promise(
        (b, m) => d.toBlob(
          (w) => w ? b(w) : m(Error("Export failed")),
          "image/png"
        )
      );
    } finally {
      g(), d.width = h[0], d.height = h[1], this.sceneLayers = l, this.updateScene(f), u && this.render(u);
    }
    return p;
  }
  dispose() {
    if (!this.disposed) {
      for (const e of this.documents.keys()) this.cancel(e);
      this.disposed = !0, this.sceneLayerGeneration++, this.lost || this.device.begin({ viewProjection: z }), this.options.canvas.removeEventListener("webglcontextlost", this.contextLost), this.options.canvas.removeEventListener("webglcontextrestored", this.contextRestored), this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.assets.dispose(), this.scene.free();
    }
  }
}
async function nt(s) {
  H ??= De(s ? { module_or_path: s } : void 0).catch((e) => {
    throw H = void 0, e;
  }), await H;
}
async function ft(s) {
  return await nt(s.wasmUrl), new ot(s);
}
export {
  K as C,
  _ as D,
  qe as G,
  z as I,
  tt as P,
  ot as R,
  Ke as S,
  oe as T,
  Je as W,
  J as a,
  Y as b,
  ft as c,
  V as d,
  Ce as e,
  st as f,
  M as g,
  pe as h,
  nt as i,
  B as j,
  Ze as k,
  q as l,
  ye as m,
  ie as n,
  rt as p,
  X as s,
  I as t,
  Be as v,
  $ as w
};
