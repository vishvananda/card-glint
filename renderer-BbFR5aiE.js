import { v as le, f as de, c as he } from "./asset-fetch-my9kgRsJ.js";
import { R as fe, H as ue, a as pe, P as ve, v as me, S as ge, _ as we } from "./foil-preview-shader-rARa43Zn.js";
import { c as te, a as A } from "./canvas-raster-B9HRvi4G.js";
const W = (o) => (Math.imul(o + 1, 1597334677) >>> 0) % 65536 / 65536;
function re(o) {
  if (o && (o.kind !== "heat" || !Number.isFinite(o.amount) || o.amount < 0 || o.amount > 0.02))
    throw RangeError("Heat deformation amount must be between 0 and 0.02");
}
function be(o, e) {
  return o?.amount ? e / (e + 4) / (1 + 2 * o.amount) : 1;
}
function N(o) {
  return Number.isInteger(o) && o >= 0 && o <= 4294967295;
}
function _(o) {
  if (o.length !== 4 || o.some((e) => !Number.isFinite(e)) || o[2] <= 0 || o[3] <= 0)
    throw Error("Invalid normalized rectangle");
}
function U(o) {
  if (!o.key || o.key.length > 131072) throw Error("Invalid raster key");
  const [e, t] = o.size;
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 1 || t < 1 || e * t > 4194304)
    throw Error("Invalid raster size");
}
function xe(o) {
  if (!N(o.id) || !Number.isSafeInteger(o.revision) || o.revision < 0)
    throw Error("Invalid card identity");
  const e = o.recipe;
  if (U(e.color), e.stamp && U(e.stamp), !e.pack || e.artWindows.length > 8 || e.edges.length > 32)
    throw Error("Invalid recipe or too many regions");
  if (!Number.isFinite(e.cornerRadius) || e.cornerRadius < 0 || e.cornerRadius > 0.5)
    throw Error("Invalid corner radius");
  const t = e.finishCoverageBase ?? 1;
  if (!Number.isFinite(t) || t < 0 || t > 1) throw Error("Invalid base coverage");
  if (e.overlayFoil) {
    const { tone: i, strength: a } = e.overlayFoil;
    if (!["gold", "silver", "prismatic"].includes(i) || !Number.isFinite(a) || a < 0 || a > 1)
      throw Error("Invalid overlay foil");
  }
  if (e.hologram) {
    const { mask: i, rect: a, strength: s, seed: r = 0 } = e.hologram;
    if (U(i), _(a), !Number.isFinite(s) || s < 0 || s > 1 || !N(r))
      throw Error("Invalid hologram material");
  }
  e.artWindows.forEach(_), e.regions.forEach((i) => _(i.rect));
  for (const i of e.edges) {
    if (i.fit !== void 0 && le(i.fit), _(i.crop), _(i.destination), _(i.clip), i.crop[0] < 0 || i.crop[1] < 0 || i.crop[0] + i.crop[2] > 1.000001 || i.crop[1] + i.crop[3] > 1.000001)
      throw Error("Crop leaves the source image");
    if (!Number.isInteger(i.threshold) || i.threshold < 0 || i.threshold > 255 || ![-90, 0, 90].includes(i.rotation ?? 0))
      throw Error("Invalid edge recipe");
  }
  for (const i of o.layers ?? []) {
    if (U(i.raster), i.clip && _(i.clip), !Number.isInteger(i.order) || Math.abs(i.order) > 2147483647)
      throw Error("Invalid layer order");
    for (const a of [
      i.finishCoverage?.add,
      i.finishCoverage?.exclude,
      i.etchCoverage?.add,
      i.etchCoverage?.exclude
    ])
      a && U(a);
  }
}
function ye(o) {
  if (o?.artwork !== void 0 && typeof o.artwork != "boolean")
    throw Error("Invalid print dot artwork option");
  if (o?.inset !== void 0 && (!Number.isFinite(o.inset) || o.inset < 0 || o.inset > 0.2))
    throw Error("Invalid print dot inset");
  if (o?.variation !== void 0 && (!Number.isFinite(o.variation) || o.variation < 0 || o.variation > 1))
    throw Error("Invalid print dot variation");
  if (o && (o.amount !== void 0 && (!Number.isFinite(o.amount) || o.amount < 0 || o.amount > 1) || o.period !== void 0 && (!Number.isFinite(o.period) || o.period < 2 || o.period > 16)))
    throw Error("Invalid print dots");
}
function Ee(o) {
  if (o.rainFog !== void 0 && (!Number.isFinite(o.rainFog) || o.rainFog < 0 || o.rainFog > 2))
    throw Error("Invalid rain fog density");
  if (ye(o.printDots), o.cardstock && (!Number.isFinite(o.cardstock.amount) || o.cardstock.amount < 0 || o.cardstock.amount > 1))
    throw Error("Invalid cardstock amount");
  if (re(o.deformation), o.wear && (!Number.isFinite(o.wear.amount) || o.wear.amount < 0 || o.wear.amount > 1 || o.wear.seed !== void 0 && !N(o.wear.seed)))
    throw Error("Invalid wear amount or seed");
  if (!N(o.id) || !N(o.card) || o.transform.length !== 16 || o.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid instance identity or transform");
  if (!Number.isInteger(o.order ?? 0) || Math.abs(o.order ?? 0) > 2147483647)
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
  ].includes(o.finish ?? "regular"))
    throw Error("Unknown finish");
  if (o.normal && (o.normal.length !== 3 || o.normal.some((e) => !Number.isFinite(e)) || Math.hypot(...o.normal) < 1e-8))
    throw Error("Invalid surface normal");
}
function Re(o) {
  if (!Number.isFinite(o.time ?? 0) || (o.time ?? 0) < 0)
    throw Error("Frame time must be finite, nonnegative seconds");
  if (o.hover && (!N(o.hover.instance) || o.hover.uv.length !== 2 || o.hover.uv.some((e) => !Number.isFinite(e) || e < 0 || e > 1)))
    throw Error("Invalid card-local hover");
}
function Te(o) {
  if (U(o.raster), !o.id || !Number.isInteger(o.order) || o.transform.length !== 16 || o.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid scene layer");
  if (!["world-under-cards", "world-interleaved", "scene-overlay", "hud"].includes(o.stage) || !["test-write", "test-readonly", "ignore"].includes(o.depth))
    throw Error("Invalid scene layer stage or depth");
  if (["scene-overlay", "hud"].includes(o.stage) && o.depth !== "ignore")
    throw Error("Overlay/HUD layers must ignore depth");
}
class ie {
  constructor(e, t) {
    if (this.destroy = t, !Number.isSafeInteger(e) || e < 1 || e > 4294967295)
      throw RangeError("Invalid cache budget");
    this.policy = new fe(e);
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
    let a;
    try {
      a = JSON.parse(this.policy.admit(e, i, 1));
    } catch (s) {
      throw this.destroy(t), s;
    }
    for (const s of a.evicted) {
      const r = this.resources.get(s);
      r !== void 0 && this.destroy(r), this.resources.delete(s);
    }
    return this.resources.has(a.handle) ? this.destroy(t) : this.resources.set(a.handle, t), this.lease(a.handle);
  }
  /** Admit and evict before allocating a GPU object, so a miss does not
   * temporarily duplicate the resident cache's entire working set. */
  create(e, t, i, a = 1) {
    if (!Number.isSafeInteger(t) || t < 1 || t > 4294967295)
      throw RangeError("Invalid resource size");
    const s = JSON.parse(
      this.policy.admit(e, t, a)
    );
    for (const r of s.evicted) {
      const c = this.resources.get(r);
      c !== void 0 && this.destroy(c), this.resources.delete(r);
    }
    if (this.resources.has(s.handle)) return this.lease(s.handle);
    try {
      return this.resources.set(s.handle, i()), this.lease(s.handle);
    } catch (r) {
      throw this.policy.remove(s.handle), r;
    }
  }
  lease(e) {
    const t = this.resources.get(e);
    if (t === void 0) throw Error("Resource ownership mismatch");
    this.policy.pin(e, !0);
    const i = this.generation;
    let a = !1;
    return {
      value: t,
      release: () => {
        a || (a = !0, i === this.generation && this.policy.pin(e, !1));
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
async function Ae(o, e) {
  const t = await de(o.url, { mode: "cors", signal: e });
  if (!t.ok) throw Error(`Asset ${t.status}: ${o.url}`);
  const i = await t.blob();
  if (!i.type.includes("svg"))
    return createImageBitmap(
      i,
      o.width ? { resizeWidth: o.width, resizeQuality: "high" } : {}
    );
  const a = new DOMParser().parseFromString(await i.text(), "image/svg+xml"), s = a.documentElement;
  if (s.localName !== "svg" || a.querySelector("parsererror")) throw Error("Invalid SVG");
  const r = (s.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), c = r[2] ?? Number.parseFloat(s.getAttribute("width") ?? ""), n = r[3] ?? Number.parseFloat(s.getAttribute("height") ?? "");
  if (!(c > 0 && n > 0 && Number.isFinite(c + n))) throw Error("SVG needs finite dimensions");
  const h = (o.width ?? 512) / Math.max(c, n);
  s.hasAttribute("viewBox") || s.setAttribute("viewBox", `0 0 ${c} ${n}`), s.setAttribute("width", String(Math.max(1, Math.round(c * h)))), s.setAttribute("height", String(Math.max(1, Math.round(n * h))));
  const d = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(s)], { type: "image/svg+xml" })
  ), f = new Image();
  try {
    return f.src = d, await f.decode(), await createImageBitmap(f);
  } finally {
    f.src = "", URL.revokeObjectURL(d);
  }
}
class ke {
  store;
  pending = /* @__PURE__ */ new Map();
  active = 0;
  waiting = [];
  disposed = !1;
  generation = 0;
  controllers = /* @__PURE__ */ new Set();
  decodes = 0;
  constructor(e) {
    this.store = new ie(e, (t) => t.close());
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
    let a = this.store.acquire(i);
    if (a) return a;
    let s = this.pending.get(i);
    if (!s) {
      const r = this.generation, c = new AbortController();
      this.controllers.add(c), s = (async () => {
        const n = await this.reserve();
        try {
          if (this.disposed || r !== this.generation) throw Error("Asset scope changed");
          const h = await Ae(e, c.signal);
          if (this.decodes++, this.disposed || r !== this.generation)
            throw h.close(), Error("Asset scope changed");
          this.store.insert(i, h, h.width * h.height * 4).release();
        } finally {
          n(), this.controllers.delete(c), r === this.generation && this.pending.delete(i);
        }
      })(), this.pending.set(i, s);
    }
    if (await s, t.throwIfAborted(), a = this.store.acquire(i), !a) throw Error("Decoded working set exceeds CPU budget");
    return a;
  }
  async images(e, t) {
    const i = [], a = /* @__PURE__ */ new Map(), s = await Promise.allSettled(
      e.map(async (n) => {
        const h = await this.image(n, t);
        i.push(h), a.set(n.url, h.value);
      })
    ), r = () => {
      for (const n of i) n.release();
      a.clear();
    }, c = s.find((n) => n.status === "rejected");
    if (c?.status === "rejected")
      throw r(), c.reason;
    return { value: a, release: r };
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
const Fe = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`, V = `#version 300 es
precision highp float;precision highp int;precision highp usampler2D;
`, Ie = V + `uniform sampler2D source;uniform ivec2 size;uniform int mode;layout(location=0) out uvec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);if(mode==1)p.y=size.y-1-p.y;uvec3 rgb=uvec3(floor(texelFetch(source,p,0).rgb*255.+.5));
uint y=(54u*rgb.r+183u*rgb.g+19u*rgb.b)>>8u;color=uvec4(y,0,0,1);}`, Se = V + `uniform usampler2D source;uniform ivec2 size;uniform int mode;uniform int threshold;
layout(location=0) out uvec4 color;
int at(ivec2 p){return int(texelFetch(source,p,0).r);}
void main(){ivec2 p=ivec2(gl_FragCoord.xy);int value=0;
if(mode==1){value=p.x==0||p.x==size.x-1?at(p):(at(p-ivec2(1,0))+2*at(p)+at(p+ivec2(1,0)))>>2;}
else if(mode==2){value=p.y==0||p.y==size.y-1?at(p):(at(p-ivec2(0,1))+2*at(p)+at(p+ivec2(0,1)))>>2;}
else if(p.x>0&&p.y>0&&p.x<size.x-1&&p.y<size.y-1){
int gx=-at(p+ivec2(-1,-1))+at(p+ivec2(1,-1))-2*at(p+ivec2(-1,0))+2*at(p+ivec2(1,0))-at(p+ivec2(-1,1))+at(p+ivec2(1,1));
int gy=-at(p+ivec2(-1,-1))-2*at(p+ivec2(0,-1))-at(p+ivec2(1,-1))+at(p+ivec2(-1,1))+2*at(p+ivec2(0,1))+at(p+ivec2(1,1));
value=clamp((((abs(gx)+abs(gy))>>2)-threshold)*8,0,255);}
color=uvec4(uint(value),0,0,1);}`, _e = V + `uniform usampler2D strength;uniform usampler2D softened;out vec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);uint a=min(255u,max(texelFetch(strength,p,0).r,texelFetch(softened,p,0).r)*2u);color=vec4(float(a)/255.,0.,0.,1.);}`;
function I(o, e, t = Fe) {
  const i = [], a = o.createProgram();
  try {
    for (const [s, r] of [
      [o.VERTEX_SHADER, t],
      [o.FRAGMENT_SHADER, e]
    ]) {
      const c = o.createShader(s);
      if (i.push(c), o.shaderSource(c, r), o.compileShader(c), !o.getShaderParameter(c, o.COMPILE_STATUS))
        throw Error(o.getShaderInfoLog(c));
      o.attachShader(a, c);
    }
    if (o.linkProgram(a), !o.getProgramParameter(a, o.LINK_STATUS)) throw Error(o.getProgramInfoLog(a));
    return a;
  } catch (s) {
    throw o.deleteProgram(a), s;
  } finally {
    for (const s of i) o.deleteShader(s);
  }
}
function F(o, e, t, i = o.R8, a = o.RED, s = o.UNSIGNED_BYTE) {
  const r = o.createTexture();
  o.bindTexture(o.TEXTURE_2D, r);
  const c = i === o.R8UI ? o.NEAREST : o.LINEAR;
  return o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MIN_FILTER, c), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MAG_FILTER, c), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_S, o.CLAMP_TO_EDGE), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_T, o.CLAMP_TO_EDGE), o.texImage2D(o.TEXTURE_2D, 0, i, e, t, 0, a, s, null), r;
}
class De {
  constructor(e) {
    this.gl = e, this.scratch = [], this.width = this.height = 0, this.disposed = !1;
    const t = performance.now();
    this.programs = [];
    try {
      for (const i of [Ie, Se, _e]) this.programs.push(I(e, i));
    } catch (i) {
      throw this.dispose(), i;
    }
    this.uniforms = this.programs.map(
      (i) => Object.fromEntries(
        ["source", "size", "mode", "threshold", "strength", "softened"].map((a) => [
          a,
          e.getUniformLocation(i, a)
        ])
      )
    ), this.framebuffer = e.createFramebuffer(), this.vao = e.createVertexArray(), this.compileMs = performance.now() - t;
  }
  allocate(e, t) {
    if (e === this.width && t === this.height) return;
    const i = this.gl;
    for (const a of this.scratch) i.deleteTexture(a);
    this.scratch = [], this.width = e, this.height = t, this.input = F(i, e, t, i.RGBA8, i.RGBA), this.scratch.push(this.input);
    for (let a = 0; a < 3; a++) this.scratch.push(F(i, e, t, i.R8UI, i.RED_INTEGER));
    if (i.bindFramebuffer(i.FRAMEBUFFER, this.framebuffer), i.framebufferTexture2D(
      i.FRAMEBUFFER,
      i.COLOR_ATTACHMENT0,
      i.TEXTURE_2D,
      this.scratch[1],
      0
    ), i.checkFramebufferStatus(i.FRAMEBUFFER) !== i.FRAMEBUFFER_COMPLETE)
      throw Error("GPU integer etching framebuffer is unavailable");
  }
  run(e, t, i, a = 20, s = null) {
    if (this.disposed) throw Error("GPU etcher disposed");
    if (!Number.isInteger(t) || !Number.isInteger(i) || t < 1 || i < 1 || t * i > 4194304 || !Number.isInteger(a) || a < 0 || a > 255)
      throw RangeError("Invalid etching dimensions or threshold");
    if (ArrayBuffer.isView(e) && e.byteLength !== t * i * 4)
      throw RangeError("Wrong RGBA input length");
    if (e === null && (t !== this.width || i !== this.height))
      throw Error("Resident input must be uploaded at this size before reuse");
    const r = this.gl;
    this.allocate(t, i), r.bindVertexArray(this.vao), r.disable(r.BLEND), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.viewport(0, 0, t, i), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, this.input), r.pixelStorei(r.UNPACK_ALIGNMENT, 1), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL, r.NONE), e !== null && (this.flipped = typeof ImageBitmap < "u" && e instanceof ImageBitmap ? 1 : 0), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !ArrayBuffer.isView(e) && !this.flipped), ArrayBuffer.isView(e) ? r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, t, i, r.RGBA, r.UNSIGNED_BYTE, e) : e !== null && r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, e), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1);
    const [c, n, h] = this.scratch.slice(1), d = s ?? F(r, t, i), f = (p, v, m, b = 0) => {
      r.useProgram(this.programs[p]);
      const g = this.uniforms[p];
      r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, v), r.uniform1i(g.source, 0), r.uniform2i(g.size, t, i), r.uniform1i(g.mode, b), r.uniform1i(g.threshold, a), r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, m, 0), r.drawArrays(r.TRIANGLES, 0, 3);
    };
    f(0, this.input, c, this.flipped ?? 0), f(1, c, n, 1), f(1, n, h, 2), f(1, h, c, 3), f(1, c, n, 1), f(1, n, h, 2);
    const l = this.uniforms[2];
    return r.useProgram(this.programs[2]), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, c), r.uniform1i(l.strength, 0), r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, h), r.uniform1i(l.softened, 1), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, d, 0), r.drawArrays(r.TRIANGLES, 0, 3), r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(null), d;
  }
  // Validation/measurement only. The real capture feeds the result directly to GL.
  read(e, t = this.width, i = this.height) {
    const a = this.gl, s = new Uint8Array(t * i * 4), r = new Uint8Array(t * i);
    a.bindFramebuffer(a.FRAMEBUFFER, this.framebuffer), a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, e, 0), a.readPixels(0, 0, t, i, a.RGBA, a.UNSIGNED_BYTE, s), a.bindFramebuffer(a.FRAMEBUFFER, null);
    for (let c = 0; c < r.length; c++) r[c] = s[c * 4];
    return r;
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
const Le = `
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
`, Ue = `
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
`, ae = `
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
`, Ne = `
uniform sampler2D caustics;
${ae}
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
`, Pe = `
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
${Le}
${Ue}
${Ne}
vec3 animatedSurface(vec2 uv,vec3 normal){
 if(previewKind==5.)return rainGlass(uv,normal);
 if(previewKind==6.)return heatHaze(uv,normal);
 return poolWater(uv,normal);
}
`, Me = `
vec2 cardSource(vec2 local,float time,vec2 shape){
 float amount=shape.x,phase=shape.y*6.28318530718;
 if(amount==0.)return local;
 return local+amount*vec2(
  .72*sin(local.y*43.+time*2.1+phase)+.28*sin(local.y*81.-time*3.4+phase*.7),
  .18*sin(local.x*29.-time*1.3+phase));
}
`, Be = `
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
`, O = 732, z = 1020, Ce = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`, Oe = `#version 300 es
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
class ze {
  constructor(e) {
    this.gl = e, this.shader = I(e, Oe, Ce);
  }
  gl;
  width = O;
  height = z;
  map;
  bytes = 0;
  passes = 0;
  shader;
  prepare() {
    if (this.map) return;
    const e = this.gl, t = F(e, O, z, e.RGBA8, e.RGBA), i = e.createFramebuffer(), a = e.createVertexArray();
    try {
      if (e.bindFramebuffer(e.FRAMEBUFFER, i), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, t, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
        throw Error("Cardstock framebuffer is incomplete");
      e.viewport(0, 0, O, z), e.disable(e.DEPTH_TEST), e.disable(e.CULL_FACE), e.disable(e.SCISSOR_TEST), e.disable(e.BLEND), e.disable(e.DITHER), e.colorMask(!0, !0, !0, !0), e.useProgram(this.shader), e.bindVertexArray(a), e.drawArrays(e.TRIANGLES, 0, 3), e.bindTexture(e.TEXTURE_2D, t), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR_MIPMAP_LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.generateMipmap(e.TEXTURE_2D);
      let s = O, r = z;
      for (; this.bytes += s * r * 4, !(s === 1 && r === 1); )
        s = Math.max(1, Math.floor(s / 2)), r = Math.max(1, Math.floor(r / 2));
      this.map = t, this.passes++;
    } catch (s) {
      throw e.deleteTexture(t), s;
    } finally {
      e.bindFramebuffer(e.FRAMEBUFFER, null), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.bindVertexArray(null), e.deleteFramebuffer(i), e.deleteVertexArray(a);
    }
  }
  dispose() {
    this.gl.deleteTexture(this.map ?? null), this.gl.deleteProgram(this.shader);
  }
}
const Ge = `
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
}`, se = `
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
}`, P = `#version 300 es
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
flat out vec4 surfaceInfo;flat out vec4 ripple0;flat out vec4 ripple1;flat out vec4 ripple2;flat out vec4 ripple3;
void main(){
vec2 pad=instanceSurface.w*vec2(1.,.18);
vec2 local=position*(1.+2.*pad)-pad;
v_uv=local;v_normal=instanceNormal;previewKind=instanceFinish;wearInfo=instanceWear;
cardstockAmount=instanceCardstock;printDotsInfo=instancePrintDots;
rainFogDensity=instanceRainFog.x;printArtwork=instanceRainFog.y;
surfaceInfo=instanceSurface;ripple0=instanceRipple0;ripple1=instanceRipple1;ripple2=instanceRipple2;ripple3=instanceRipple3;
gl_Position=viewProjection*model*vec4(local,0.,1.);}`, He = pe.replace("uniform float previewKind;", "flat in float previewKind;").replaceAll("texture2D(mask,uv).r*hasMask", "edgeCoverage(uv)").replaceAll("texture2D(face,", "printFace("), j = `#version 300 es
precision highp float;
in vec2 v_uv;in vec3 v_normal;flat in vec2 wearInfo;
uniform sampler2D face;uniform sampler2D mask;uniform sampler2D overlay;uniform sampler2D coverage;
uniform vec2 overlayFoil;
uniform vec2 pointer;uniform vec4 artBounds[8];
uniform float hasMask;uniform float cornerRadius;uniform float aspect;uniform float finishBase;
out vec4 out_color;
#define texture2D texture
float edgeCoverage(vec2 uv){vec4 c=texture(coverage,uv);return max(texture(mask,uv).r*hasMask,c.b)*(1.-c.a);}
vec4 printFace(vec2 uv);
${Ge}
${He}
#ifdef PROCEDURAL_PRINT
#define PRINT_DOT_ART_WINDOWS
#define PRINT_DOT_ART_INSTANCE
${se}
#else
vec4 printFace(vec2 uv){return texture(face,uv);}
#endif
${Pe.replaceAll("texture(face,", "printFace(")}
${Me}
${Be}
#ifdef LOCAL_HOLOGRAM
${ue}
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
 vec3 shaded=previewLinear(previewKind>=5. && previewKind<8. ? animatedSurface(uv,normalize(v_normal)) : previewFoil(uv,normalize(v_normal),view));
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
}`, oe = j.replace(
  "#version 300 es",
  `#version 300 es
#define LOCAL_HOLOGRAM`
), We = j.replace(
  "#version 300 es",
  `#version 300 es
#define PROCEDURAL_PRINT`
), Xe = oe.replace(
  "#version 300 es",
  `#version 300 es
#define PROCEDURAL_PRINT`
), qe = `#version 300 es
precision highp float;in vec2 v_uv;uniform sampler2D face;out vec4 out_color;
void main(){out_color=texture(face,vec2(v_uv.x,1.-v_uv.y));if(out_color.a<.001)discard;}`, D = (o, e) => Math.max(-e, Math.min(e, o));
function ne(o, e) {
  const t = Math.min(2047, Math.max(0, Math.round((o / 0.24 + 0.5) * 2047))), i = Math.min(0.9995, Math.max(5e-4, e / 0.24 + 0.5));
  return 1 + t + i;
}
function $(o, e, t, i) {
  for (let a = 1; a <= 4; a++) {
    const s = (o.activeRipple + a) % 4, r = 4 + s * 4;
    if (!(o.data[r + 3] > 0 && e - o.data[r + 2] < 2.25))
      return o.activeRipple = s, o.segStart = [t, i], o.segTime = e, o.data.set([t, i, e, ne(0, 0)], r), !0;
  }
  return !1;
}
class K {
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
    const a = t.time ?? 0, s = e.transform, r = e.normal ?? [0, 0, 1], c = [s[12], s[13], r[0], r[1]];
    let n = this.states.get(e.id);
    if (!n || a < n.time) {
      const f = new Float32Array(20);
      f.set([0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0], 4), n = {
        seen: this.serial,
        time: a,
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
    const h = Math.min(0.05, a - n.time), d = t.hover?.instance === e.id ? t.hover : void 0;
    if (d) {
      const f = d.uv[0], l = 1 - d.uv[1];
      if (!n.hovering)
        n.hoverUv = [f, l], n.emitting = $(n, a, f, l);
      else {
        const p = f - n.hoverUv[0], v = l - n.hoverUv[1], m = Math.hypot(p, v);
        n.hoverUv = [f, l], h > 0 && m > 0 && (n.velocity[0] = D(n.velocity[0] + D(p * 1.8, 0.28), 1), n.velocity[1] = D(n.velocity[1] + D(v * 1.8, 0.28), 1));
        const b = (f - n.segStart[0]) * 0.5, g = (l - n.segStart[1]) * 0.5, x = Math.hypot(b, g) * 2, u = a - n.segTime;
        if (m > 5e-4)
          if (!n.emitting || x > 0.11 || u > 0.13 && x > 0.02)
            n.emitting = $(n, a, f, l);
          else {
            const E = n.segStart[0] + b, w = n.segStart[1] + g, y = n.segTime + u * 0.45;
            n.data.set([E, w, y, ne(b, g)], 4 + n.activeRipple * 4);
          }
      }
    }
    if (d || (n.emitting = !1), h > 0) {
      const f = [Math.hypot(s[0], s[1], s[2]), Math.hypot(s[4], s[5], s[6])];
      for (let l = 0; l < 2; l++) {
        const p = (c[l] - n.pose[l]) / Math.max(0.05, f[l]) + (c[l + 2] - n.pose[l + 2]) * 0.7, v = D(p, 0.22), m = Math.max(1, Math.ceil(h / (1 / 120))), b = h / m;
        for (let g = 0; g < m; g++) {
          let x = n.data[l], u = n.velocity[l] + (g === 0 ? v * 4.5 : 0);
          u += (-26 * x - 4.8 * u) * b, x = D(x + u * b, 0.35), n.data[l] = x, n.velocity[l] = D(u, 1.4);
        }
      }
    }
    return n.hovering = !!d, n.time = a, n.pose = c, n.data;
  }
}
const T = 192, L = 512, Ve = `#version 300 es
precision highp float;
uniform float time;
out vec2 incoming;
${ae}
void main(){
 // Include a skirt around the periodic tile: rays from outside can land inside.
 vec2 p=vec2(gl_VertexID%${T + 1},gl_VertexID/${T + 1})/${T}.*2.4-.2;
 vec3 wave=waterField(p,time);
 vec3 normal=normalize(vec3(-wave.xy,1.));
 vec3 ray=refract(vec3(0.,0.,-1.),normal,1./1.333);
 vec2 floorPoint=p+ray.xy/(-ray.z)*(waterDepth+wave.z);
 incoming=p;
 gl_Position=vec4(floorPoint/waterPeriod*2.-1.,0.,1.);
}`, je = `#version 300 es
precision highp float;
in vec2 incoming;out vec4 color;
void main(){
 // Each fragment receives the area of its source light footprint. Overlapping
 // folds accumulate by additive blending; expanded footprints become darker.
 vec2 dx=dFdx(incoming),dy=dFdy(incoming);
 float flux=abs(dx.x*dy.y-dx.y*dy.x)*${(L / 2) ** 2}.;
 color=vec4(min(flux,8.)/8.,0.,0.,1.);
}`;
class $e {
  constructor(e) {
    if (this.gl = e, this.shader = I(e, je, Ve), this.clock = e.getUniformLocation(this.shader, "time"), this.map = F(e, L, L), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.REPEAT), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.REPEAT), this.framebuffer = e.createFramebuffer(), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.map, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
      throw e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteProgram(this.shader), Error("Caustics framebuffer is incomplete");
    this.vao = e.createVertexArray(), this.indices = e.createBuffer(), e.bindVertexArray(this.vao), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indices);
    const t = new Uint16Array(T * T * 6);
    for (let i = 0; i < T; i++)
      for (let a = 0; a < T; a++) {
        const s = i * (T + 1) + a, r = s + T + 1;
        t.set([s, s + 1, r, r, s + 1, r + 1], (i * T + a) * 6);
      }
    e.bufferData(e.ELEMENT_ARRAY_BUFFER, t, e.STATIC_DRAW), e.bindVertexArray(null), e.bindFramebuffer(e.FRAMEBUFFER, null);
  }
  gl;
  map;
  bytes = L * L + T * T * 6 * 2;
  passes = 0;
  shader;
  framebuffer;
  vao;
  indices;
  clock;
  time = NaN;
  prepare(e) {
    if (e = Math.fround(e), e === this.time) return;
    const t = this.gl;
    t.bindFramebuffer(t.FRAMEBUFFER, this.framebuffer), t.viewport(0, 0, L, L), t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.disable(t.SCISSOR_TEST), t.colorMask(!0, !0, !0, !0), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.enable(t.BLEND), t.blendEquation(t.FUNC_ADD), t.blendFunc(t.ONE, t.ONE), t.useProgram(this.shader), t.uniform1f(this.clock, e), t.bindVertexArray(this.vao), t.drawElements(t.TRIANGLES, T * T * 6, t.UNSIGNED_SHORT, 0), t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, t.drawingBufferWidth, t.drawingBufferHeight), t.disable(t.BLEND), this.time = e, this.passes++;
  }
  dispose() {
    const e = this.gl;
    e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteVertexArray(this.vao), e.deleteBuffer(this.indices), e.deleteProgram(this.shader);
  }
}
const S = Object.freeze({
  amount: 0.35,
  period: 2,
  variation: 0.5,
  inset: 0,
  artwork: !0
});
function X(o) {
  return [
    o ? o.amount ?? S.amount : 0,
    o?.period ?? S.period,
    o?.variation ?? S.variation,
    o?.inset ?? S.inset
  ];
}
function Ke(o) {
  const e = new Float32Array(32);
  return o.forEach(([t, i, a, s], r) => e.set([t, 1 - i - s, t + a, 1 - i], r * 4)), e;
}
const Ye = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`, Je = `#version 300 es
#define PRINT_DOT_ART_WINDOWS
precision highp float;
in vec2 uv;out vec4 color;uniform sampler2D face;
vec3 previewInk(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 previewLinear(vec3 c){return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c));}
${se.replace("flat in vec4 printDotsInfo;", "uniform vec4 printDotsInfo;")}
void main(){
 printFootprint=1./printDotsInfo.y;
 // Fine screens need pixel-area coverage before they enter the mip chain.
 // Sample only the ink screen: averaging source texels would soften lettering.
 // This pass is cached per printing/settings, never rerun for pointer motion.
 if(printDotsInfo.y<4.){
  vec4 source=texture(face,uv);vec3 ink=previewInk(source.rgb),sum=vec3(0.);
  vec2 pixel=1./vec2(textureSize(face,0));
  for(int y=0;y<2;y++)for(int x=0;x<2;x++){
   vec2 offset=(vec2(float(x),float(y))-.5)*.5;
   sum+=previewLinear(printDotInk(ink,uv+offset*pixel));
  }
  color=vec4(sum*.25,source.a);
 }else color=printFace(uv);
}`, Y = 16 * 1024 * 1024, J = (o) => {
  let e = o.width, t = o.height, i = 0;
  for (; ; ) {
    if (i += e * t * 4, e === 1 && t === 1) return i;
    e = Math.max(1, Math.floor(e / 2)), t = Math.max(1, Math.floor(t / 2));
  }
};
class Qe {
  constructor(e) {
    this.gl = e, this.shader = I(e, Je, Ye), this.framebuffer = e.createFramebuffer(), this.vao = e.createVertexArray();
  }
  gl;
  shader;
  framebuffer;
  vao;
  entries = [];
  bytes = 0;
  passes = 0;
  prepare(e, t, i, a = []) {
    const s = X(i), r = i.artwork !== !1, c = JSON.stringify([s, r, r ? [] : a]), n = this.entries.findIndex(
      (l) => l.source.texture === e.texture && l.overlay?.texture === t?.texture && l.settings === c
    );
    if (n >= 0) {
      const l = this.entries.splice(n, 1)[0];
      return this.entries.push(l), l;
    }
    const h = J(e) + (t ? J(t) : 0);
    if (h > Y) return;
    for (; this.bytes + h > Y; ) {
      const l = this.entries.shift();
      this.release(l);
    }
    let d, f;
    try {
      d = this.paint(e, s, a, r), t && (f = this.paint(t, s, a, r));
      const l = { source: e, overlay: t, settings: c, face: d, top: f, bytes: h };
      return this.entries.push(l), this.bytes += h, l;
    } catch (l) {
      throw this.gl.deleteTexture(d?.texture ?? null), this.gl.deleteTexture(f?.texture ?? null), l;
    }
  }
  /** Uncached native preparation. The caller owns and deletes the returned texture. */
  paint(e, t, i = [], a = !0) {
    const s = this.gl, r = e.width, c = e.height, n = F(s, r, c, s.SRGB8_ALPHA8, s.RGBA);
    try {
      if (s.bindFramebuffer(s.FRAMEBUFFER, this.framebuffer), s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, n, 0), s.checkFramebufferStatus(s.FRAMEBUFFER) !== s.FRAMEBUFFER_COMPLETE)
        throw Error("Printed ink framebuffer is incomplete");
      return s.viewport(0, 0, r, c), s.disable(s.DEPTH_TEST), s.disable(s.CULL_FACE), s.disable(s.SCISSOR_TEST), s.disable(s.BLEND), s.disable(s.DITHER), s.colorMask(!0, !0, !0, !0), s.useProgram(this.shader), s.bindVertexArray(this.vao), s.activeTexture(s.TEXTURE0), s.bindTexture(s.TEXTURE_2D, e.texture), s.uniform1i(s.getUniformLocation(this.shader, "face"), 0), s.uniform4fv(s.getUniformLocation(this.shader, "printDotsInfo"), t), s.uniform4fv(
        s.getUniformLocation(this.shader, "printArtBounds[0]"),
        Ke(i)
      ), s.uniform1f(s.getUniformLocation(this.shader, "printArtwork"), a ? 1 : 0), s.drawArrays(s.TRIANGLES, 0, 3), this.passes++, s.bindTexture(s.TEXTURE_2D, n), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.LINEAR_MIPMAP_LINEAR), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.LINEAR), s.generateMipmap(s.TEXTURE_2D), { texture: n, width: r, height: c };
    } catch (h) {
      throw s.deleteTexture(n), h;
    } finally {
      s.bindFramebuffer(s.FRAMEBUFFER, this.framebuffer), s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, null, 0), s.bindFramebuffer(s.FRAMEBUFFER, null), s.bindVertexArray(null), s.viewport(0, 0, s.drawingBufferWidth, s.drawingBufferHeight);
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
const Ze = {
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
}, k = 49;
class Q {
  constructor(e) {
    this.canvas = e;
    const t = e.getContext("webgl2", {
      alpha: !0,
      antialias: !0,
      premultipliedAlpha: !1,
      preserveDrawingBuffer: !0
    });
    if (!t) throw Error("WebGL2 is required");
    this.gl = t, this.caustics = new $e(t), this.cardstock = new ze(t), this.printedInk = new Qe(t), this.foil = I(t, j, P), this.holographic = I(t, oe, P), this.procedural = I(t, We, P), this.proceduralHolographic = I(t, Xe, P), this.image = I(t, qe, P), this.vao = t.createVertexArray(), this.quad = t.createBuffer(), this.instances = t.createBuffer(), this.blank = F(t, 1, 1, t.RGBA8, t.RGBA), t.bindTexture(t.TEXTURE_2D, this.blank), t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)), t.bindVertexArray(this.vao), t.bindBuffer(t.ARRAY_BUFFER, this.quad), t.bufferData(
      t.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      t.STATIC_DRAW
    ), t.enableVertexAttribArray(0), t.vertexAttribPointer(0, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, this.instances);
    for (let i = 0; i < 4; i++)
      t.enableVertexAttribArray(1 + i), t.vertexAttribPointer(1 + i, 4, t.FLOAT, !1, k * 4, i * 16), t.vertexAttribDivisor(1 + i, 1);
    t.enableVertexAttribArray(5), t.vertexAttribPointer(5, 3, t.FLOAT, !1, k * 4, 64), t.vertexAttribDivisor(5, 1), t.enableVertexAttribArray(6), t.vertexAttribPointer(6, 1, t.FLOAT, !1, k * 4, 76), t.vertexAttribDivisor(6, 1);
    for (let i = 7; i <= 11; i++)
      t.enableVertexAttribArray(i), t.vertexAttribPointer(i, 4, t.FLOAT, !1, k * 4, 80 + (i - 7) * 16), t.vertexAttribDivisor(i, 1);
    t.enableVertexAttribArray(12), t.vertexAttribPointer(12, 2, t.FLOAT, !1, k * 4, 160), t.vertexAttribDivisor(12, 1), t.enableVertexAttribArray(13), t.vertexAttribPointer(13, 1, t.FLOAT, !1, k * 4, 168), t.vertexAttribDivisor(13, 1), t.enableVertexAttribArray(14), t.vertexAttribPointer(14, 4, t.FLOAT, !1, k * 4, 172), t.vertexAttribDivisor(14, 1), t.enableVertexAttribArray(15), t.vertexAttribPointer(15, 2, t.FLOAT, !1, k * 4, 188), t.vertexAttribDivisor(15, 1), t.bindVertexArray(null);
  }
  canvas;
  gl;
  foil;
  holographic;
  procedural;
  proceduralHolographic;
  image;
  vao;
  quad;
  instances;
  blank;
  disposed = !1;
  instanceCapacity = 0;
  staging = new Float32Array();
  motion = new K();
  caustics;
  cardstock;
  printedInk;
  draws = 0;
  begin(e) {
    this.motion.begin();
    const t = this.gl;
    t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, this.canvas.width, this.canvas.height), t.disable(t.SCISSOR_TEST), t.disable(t.CULL_FACE), t.colorMask(!0, !0, !0, !0), t.depthMask(!0), t.clearDepth(1), t.clearColor(...e.clear ?? [0, 0, 0, 0]), t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT), this.draws = 0;
  }
  bind(e, t, i, a = !1) {
    const s = this.gl;
    s.useProgram(e), s.bindVertexArray(this.vao), s.bindBuffer(s.ARRAY_BUFFER, this.instances);
    const r = i.length * k;
    this.staging.length < r && (this.staging = new Float32Array(r));
    const c = this.staging;
    i.forEach((n, h) => {
      const d = h * k;
      c.set(n.transform, d), c.set(n.normal ?? [0, 0, 1], d + 16), c[d + 19] = Ze[n.finish ?? "regular"];
      const f = this.motion.sample(n, t);
      f ? c.set(f, d + 20) : c.fill(0, d + 20, d + k), c[d + 22] = W(n.id), c[d + 23] = n.deformation?.amount ?? 0, c[d + 40] = n.wear?.amount ?? 0, c[d + 41] = W(n.wear?.seed ?? n.id), c[d + 42] = n.cardstock?.amount ?? 0;
      const l = n.printDots;
      c[d + 43] = a || !l ? 0 : l.amount ?? S.amount, c[d + 44] = l?.period ?? S.period, c[d + 45] = l?.variation ?? S.variation, c[d + 46] = l?.inset ?? S.inset, c[d + 47] = n.rainFog ?? 1, c[d + 48] = n.printDots?.artwork === !1 ? 0 : 1;
    }), this.instanceCapacity < r && (this.instanceCapacity = r, s.bufferData(s.ARRAY_BUFFER, r * 4, s.DYNAMIC_DRAW)), s.bufferSubData(s.ARRAY_BUFFER, 0, c, 0, r), s.uniformMatrix4fv(
      s.getUniformLocation(e, "viewProjection"),
      !1,
      t.viewProjection
    );
  }
  draw(e, t, i) {
    const a = this.gl;
    i.some((w) => w.finish === "pool") && this.caustics.prepare(t.time ?? 0), i.some(
      (w) => w.finish && w.finish !== "regular" && (w.cardstock?.amount ?? 0) > 0
    ) && this.cardstock.prepare();
    const s = i[0]?.printDots, r = X(s), n = s && r[0] > 0 && i.every(
      (w) => X(w.printDots).every((y, R) => y === r[R]) && w.printDots?.artwork !== !1 == (s.artwork !== !1)
    ) ? this.printedInk.prepare(
      e.face,
      e.overlay,
      s,
      e.recipe.artWindows
    ) : void 0, h = !n && i.some(
      (w) => w.printDots && (w.printDots.amount ?? S.amount) > 0
    ), d = e.recipe.hologram?.strength ? h ? this.proceduralHolographic : this.holographic : h ? this.procedural : this.foil;
    this.bind(d, t, i, !!n), a.enable(a.DEPTH_TEST), a.depthFunc(a.LEQUAL), a.depthMask(!0), a.disable(a.BLEND), [
      ["face", n?.face.texture ?? e.face.texture],
      ["mask", e.mask.texture],
      ["overlay", n?.top?.texture ?? e.overlay?.texture ?? this.blank],
      ["coverage", e.coverage?.texture ?? this.blank],
      ["caustics", this.caustics.map],
      ["hologramMask", e.hologram?.texture ?? this.blank],
      ["cardstockMap", this.cardstock.map ?? this.blank]
    ].forEach(([w, y], R) => {
      a.activeTexture(a.TEXTURE0 + R), a.bindTexture(a.TEXTURE_2D, y), a.uniform1i(a.getUniformLocation(d, w), R);
    });
    const l = e.recipe.artWindows.map(([w, y, R, ce]) => [w, 1 - y - ce, w + R, 1 - y]), p = new Float32Array(32);
    l.forEach((w, y) => p.set(w, y * 4)), a.uniform4fv(a.getUniformLocation(d, "artBounds[0]"), p), a.uniform4fv(a.getUniformLocation(d, "printArtBounds[0]"), p), a.uniform1f(a.getUniformLocation(d, "finishBase"), e.recipe.finishCoverageBase ?? 1);
    const v = e.recipe.hologram, [m, b, g, x] = v?.rect ?? [0, 0, 1, 1];
    a.uniform4f(a.getUniformLocation(d, "hologramRect"), m, 1 - b - x, g, x), a.uniform2f(
      a.getUniformLocation(d, "hologramMaterial"),
      v?.strength ?? 0,
      (v?.seed ?? 0) / 4294967295
    );
    const u = e.recipe.overlayFoil;
    a.uniform2f(
      a.getUniformLocation(d, "overlayFoil"),
      u ? { gold: 1, silver: 3, prismatic: 2 }[u.tone] : 0,
      u?.strength ?? 0
    ), a.uniform1f(a.getUniformLocation(d, "cornerRadius"), e.recipe.cornerRadius), a.uniform1f(a.getUniformLocation(d, "aspect"), e.face.height / e.face.width);
    const E = t.pointer ?? [0.5, 0.5];
    a.uniform2f(a.getUniformLocation(d, "pointer"), E[0], 1 - E[1]), a.uniform1f(a.getUniformLocation(d, "hasMask"), 1), a.uniform1f(a.getUniformLocation(d, "satinCompact"), 1), a.uniform1f(a.getUniformLocation(d, "satinHoverGain"), 0), a.uniform1f(a.getUniformLocation(d, "surfaceTime"), t.time ?? 0), a.drawArraysInstanced(a.TRIANGLES, 0, 6, i.length), this.draws++;
  }
  drawLayer(e, t, i) {
    const a = this.gl, s = this.image;
    this.bind(s, i, [{ id: 0, card: 0, transform: e.transform }]), e.depth === "ignore" ? a.disable(a.DEPTH_TEST) : (a.enable(a.DEPTH_TEST), a.depthFunc(a.LEQUAL)), a.depthMask(e.depth === "test-write"), a.enable(a.BLEND), a.blendFuncSeparate(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA, a.ONE, a.ONE_MINUS_SRC_ALPHA), a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, t.texture), a.uniform1i(a.getUniformLocation(s, "face"), 0), a.drawArraysInstanced(a.TRIANGLES, 0, 6, 1), this.draws++, a.depthMask(!0), a.disable(a.BLEND);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0, this.motion.clear();
    const e = this.gl;
    e.deleteProgram(this.foil), e.deleteProgram(this.holographic), e.deleteProgram(this.procedural), e.deleteProgram(this.proceduralHolographic), e.deleteProgram(this.image), e.deleteVertexArray(this.vao), e.deleteBuffer(this.quad), e.deleteBuffer(this.instances), e.deleteTexture(this.blank), this.caustics.dispose(), this.cardstock.dispose(), this.printedInk.dispose();
  }
  get surfacePasses() {
    return this.caustics.passes + this.cardstock.passes + this.printedInk.passes;
  }
  get surfaceBytes() {
    return this.caustics.bytes + this.cardstock.bytes + this.printedInk.bytes;
  }
  end() {
    this.motion.end();
  }
  resetMotion() {
    this.motion.clear();
  }
  isolateMotion() {
    const e = this.motion;
    return this.motion = new K(), () => {
      this.motion = e;
    };
  }
}
class Z {
  constructor(e, t, i, a = "gpu") {
    this.gl = e, this.scratchLimit = i, this.mode = a, this.store = new ie(t, (s) => e.deleteTexture(s.texture)), this.etcher = new De(e);
  }
  gl;
  scratchLimit;
  mode;
  store;
  etcher;
  kernels = new ve();
  uploads = 0;
  edgeBuilds = 0;
  readbacks = 0;
  upload(e, t, i = !0, a = 1) {
    const s = this.store.acquire(e);
    if (s) return s;
    const r = this.gl, c = t.width, n = t.height;
    return this.store.create(
      e,
      c * n * 4,
      () => {
        const h = F(r, c, n, i ? r.SRGB8_ALPHA8 : r.RGBA8, r.RGBA);
        if (r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, h), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !0), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
          const d = document.createElement("canvas");
          d.width = c, d.height = n;
          try {
            d.getContext("2d").drawImage(t, 0, 0), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, d);
          } finally {
            d.width = d.height = 0;
          }
        } else
          r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, t);
        return r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1), this.uploads++, { texture: h, width: c, height: n };
      },
      a
    );
  }
  edge(e, t, i) {
    const a = this.store.acquire(e);
    if (a) return a;
    const s = this.gl, r = t.width, c = t.height;
    if (r * c * 7 > this.scratchLimit) throw Error("Etching exceeds scratch budget");
    return this.store.create(
      e,
      r * c,
      () => {
        let n;
        if (this.mode === "gpu") n = this.etcher.run(t, r, c, i);
        else {
          const h = document.createElement("canvas");
          h.width = r, h.height = c;
          try {
            const d = h.getContext("2d", { willReadFrequently: !0 });
            d.drawImage(t, 0, 0);
            const f = d.getImageData(0, 0, r, c).data, l = this.kernels.etch(
              r,
              c,
              new Uint8Array(f.buffer, f.byteOffset, f.byteLength),
              i
            ), p = new Uint8Array(l.length);
            for (let v = 0; v < c; v++)
              p.set(l.subarray(v * r, (v + 1) * r), (c - 1 - v) * r);
            n = F(s, r, c), s.bindTexture(s.TEXTURE_2D, n), s.pixelStorei(s.UNPACK_ALIGNMENT, 1), s.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, r, c, s.RED, s.UNSIGNED_BYTE, p);
          } finally {
            h.width = h.height = 0;
          }
        }
        return this.uploads++, this.edgeBuilds++, { texture: n, width: r, height: c };
      },
      0
    );
  }
  uploadBytes(e, t, i) {
    const a = this.store.acquire(e);
    if (a) return a;
    const s = this.gl, [r, c] = i, n = new Uint8Array(t.length);
    for (let h = 0; h < c; h++)
      n.set(t.subarray(h * r * 4, (h + 1) * r * 4), (c - 1 - h) * r * 4);
    return this.store.create(e, r * c * 4, () => {
      const h = F(s, r, c, s.RGBA8, s.RGBA);
      return s.bindTexture(s.TEXTURE_2D, h), s.pixelStorei(s.UNPACK_ALIGNMENT, 1), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1), s.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, r, c, s.RGBA, s.UNSIGNED_BYTE, n), this.uploads++, { texture: h, width: r, height: c };
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
const et = `#version 300 es
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
class tt {
  constructor(e) {
    this.textures = e;
    const t = e.gl;
    this.shader = I(t, et), this.fbo = t.createFramebuffer(), this.vao = t.createVertexArray();
  }
  textures;
  shader;
  fbo;
  vao;
  disposed = !1;
  builds = 0;
  compose(e, t, i, a) {
    const s = this.textures.store.acquire(e);
    if (s) return s;
    const r = this.textures.gl, [c, n] = t;
    return this.textures.store.create(e, c * n, () => {
      const h = F(r, c, n);
      try {
        if (r.bindFramebuffer(r.FRAMEBUFFER, this.fbo), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, h, 0), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE)
          throw Error("Mask framebuffer unavailable");
        r.bindVertexArray(this.vao), r.viewport(0, 0, c, n), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.clearColor(0, 0, 0, 0), r.clear(r.COLOR_BUFFER_BIT), r.useProgram(this.shader), r.enable(r.BLEND), r.blendFunc(r.ONE, r.ONE_MINUS_SRC_ALPHA);
        const d = (f, l, p, v, m, b = 0) => {
          r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, f.texture), r.uniform1i(r.getUniformLocation(this.shader, "inputMask"), 0), r.uniform2f(r.getUniformLocation(this.shader, "size"), c, n), r.uniform4fv(r.getUniformLocation(this.shader, "cover"), l), r.uniform4fv(r.getUniformLocation(this.shader, "clip"), p), r.uniform4fv(r.getUniformLocation(this.shader, "crop"), v), r.uniform1f(r.getUniformLocation(this.shader, "alphaChannel"), m ? 1 : 0), r.uniform1f(r.getUniformLocation(this.shader, "angle"), b), r.drawArrays(r.TRIANGLES, 0, 3);
        };
        a && d(a, [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1], !0);
        for (const { value: f, spec: l } of i) {
          const [p, v, m, b] = l.destination, g = l.rotation ?? 0, x = f.width * l.crop[2], u = f.height * l.crop[3];
          let E;
          if (l.fit) {
            const w = l.fit.focalPoint ?? [0.5, 0.5], y = {
              ...l.fit,
              focalPoint: g === 90 ? [1 - w[1], w[0]] : g === -90 ? [w[1], 1 - w[0]] : w
            }, R = he(
              g ? u : x,
              g ? x : u,
              [p * c, v * n, m * c, b * n],
              y
            );
            E = [R[0] / c, R[1] / n, R[2] / c, R[3] / n];
          } else {
            const w = Math.max(
              m * c / (g ? u : x),
              b * n / (g ? x : u)
            ), y = (g ? u : x) * w / c, R = (g ? x : u) * w / n;
            E = [p + (m - y) / 2, v + (b - R) / 2, y, R];
          }
          d(f, E, l.clip, l.crop, !!l.importedMask, g);
        }
        this.builds++;
      } catch (d) {
        throw r.deleteTexture(h), d;
      } finally {
        r.disable(r.BLEND), r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(null);
      }
      return { texture: h, width: c, height: n };
    });
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    const e = this.textures.gl;
    e.deleteProgram(this.shader), e.deleteFramebuffer(this.fbo), e.deleteVertexArray(this.vao);
  }
}
async function C(o, e, t, i) {
  t.throwIfAborted();
  const a = await o.paint(e, t, i);
  if (a.width !== o.size[0] || a.height !== o.size[1] || t.aborted)
    throw A(a), t.throwIfAborted(), Error("Raster dimensions differ from recipe");
  return a;
}
function q(o) {
  const e = o.layers ?? [], t = me(
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
function M(o) {
  return JSON.stringify(o.map((e) => [e.id, e.stage, e.order, e.raster.key, e.clip]));
}
async function B(o, e, t, i, a = te(o)) {
  const s = a.getContext("2d");
  try {
    for (const r of e) {
      const c = await C(r.raster, t, i);
      try {
        if (s.save(), r.clip) {
          s.beginPath();
          const [n, h, d, f] = r.clip;
          s.rect(n * o[0], h * o[1], d * o[0], f * o[1]), s.clip();
        }
        s.drawImage(c, 0, 0, ...o), s.restore();
      } finally {
        A(c);
      }
    }
    return a;
  } catch (r) {
    throw A(a), r;
  }
}
async function rt(o, e, t, i) {
  const a = te(o), s = a.getContext("2d", { willReadFrequently: !0 }), r = s.createImageData(...o);
  try {
    for (const c of e) {
      const n = [
        c.finishCoverage?.add,
        c.finishCoverage?.exclude,
        c.etchCoverage?.add,
        c.etchCoverage?.exclude
      ];
      for (let h = 0; h < 4; h++) {
        const d = n[h];
        if (!d) continue;
        const f = await B(o, [{ ...c, raster: d }], t, i);
        try {
          const l = f.getContext("2d").getImageData(0, 0, ...o).data;
          for (let p = 0; p < l.length; p += 4)
            r.data[p + h] = Math.max(r.data[p + h], l[p + 3]);
        } finally {
          A(f);
        }
      }
    }
    return A(a), new Uint8Array(r.data.buffer);
  } catch (c) {
    throw A(a), c;
  }
}
class ee {
  constructor(e, t) {
    this.textures = e, this.assets = t, this.masks = new tt(e);
  }
  textures;
  assets;
  masks;
  pending = /* @__PURE__ */ new Map();
  compositions = 0;
  async ensure(e, t) {
    const i = this.textures.store.acquire(e);
    if (i) return i;
    let a = this.pending.get(e);
    a || (a = t().then((r) => r.release()).finally(() => this.pending.delete(e)), this.pending.set(e, a)), await a;
    const s = this.textures.store.acquire(e);
    if (!s) throw Error("Prepared working set exceeds GPU budget");
    return s;
  }
  async prepare(e, t) {
    const { recipe: i } = e, a = i.color.size, s = q(e), r = [], c = s.filter((u) => u.stage === "under-art"), n = s.filter((u) => u.stage === "printed-content" || u.stage === "under-finish"), h = s.filter((u) => u.stage === "over-finish"), d = s.filter((u) => u.contributesToEtch), f = s.filter((u) => u.finishCoverage || u.etchCoverage), l = `${i.pack}:`, p = l + JSON.stringify(["color-v1", i.color.key, M([...c, ...n])]), v = l + JSON.stringify(["mask-v1", a, i.edges, i.stamp?.key, M(d)]), m = h.length ? l + JSON.stringify(["over-v1", a, M(h)]) : void 0, b = f.length ? l + JSON.stringify([
      "coverage-v1",
      a,
      f.map((u) => [
        u.clip,
        u.finishCoverage?.add?.key,
        u.finishCoverage?.exclude?.key,
        u.etchCoverage?.add?.key,
        u.etchCoverage?.exclude?.key
      ])
    ]) : void 0, g = i.hologram ? l + JSON.stringify(["hologram-v1", i.hologram.mask.key, i.hologram.mask.size]) : void 0, x = JSON.stringify(
      i.hologram ? [i.hologram.rect, i.hologram.strength, i.hologram.seed ?? 0] : null
    );
    try {
      return r.push(
        await this.ensure(p, async () => {
          const u = c.length ? await B(a, c, this.assets, t) : void 0;
          let E;
          try {
            return E = await C(i.color, this.assets, t, u), await B(a, n, this.assets, t, E), t.throwIfAborted(), this.compositions++, this.textures.upload(p, E);
          } finally {
            u && A(u), E && A(E);
          }
        })
      ), r.push(await this.prepareMask(e, t)), m && r.push(
        await this.ensure(m, async () => {
          const u = await B(a, h, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(m, u);
          } finally {
            A(u);
          }
        })
      ), b && r.push(
        await this.ensure(b, async () => {
          const u = await rt(a, f, this.assets, t);
          return t.throwIfAborted(), this.textures.uploadBytes(b, u, a);
        })
      ), g && r.push(
        await this.ensure(g, async () => {
          const u = await C(i.hologram.mask, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(g, u, !1);
          } finally {
            A(u);
          }
        })
      ), t.throwIfAborted(), { color: p, mask: v, overlay: m, coverage: b, hologram: g, hologramSettings: x, document: e };
    } finally {
      for (const u of r) u.release();
    }
  }
  async prepareMask(e, t) {
    const { recipe: i } = e, a = i.color.size, s = q(e).filter((n) => n.contributesToEtch), r = `${i.pack}:`, c = r + JSON.stringify(["mask-v1", a, i.edges, i.stamp?.key, M(s)]);
    return this.ensure(c, async () => {
      const n = [], h = [];
      try {
        for (const f of i.edges) {
          const l = r + JSON.stringify([
            "edge-integer-v1",
            f.key,
            f.asset,
            f.importedMask,
            f.threshold
          ]), p = await this.ensure(l, async () => {
            const v = f.importedMask ?? f.asset, m = await this.assets.images([v], t);
            try {
              t.throwIfAborted();
              const b = m.value.get(v.url);
              if (!b) throw Error(`Edge asset unavailable: ${v.url}`);
              return f.importedMask ? this.textures.upload(l, b, !1, 0) : this.textures.edge(l, b, f.threshold);
            } finally {
              m.release();
            }
          });
          h.push(p), n.push({ value: p.value, spec: f });
        }
        for (const f of s) {
          const l = r + JSON.stringify(["contribution-v1", a, M([f])]), p = await this.ensure(l, async () => {
            const v = await B(a, [f], this.assets, t);
            try {
              return t.throwIfAborted(), this.textures.edge(l, v, 20);
            } finally {
              A(v);
            }
          });
          h.push(p), n.push({
            value: p.value,
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
        let d;
        if (i.stamp) {
          const f = i.stamp, l = r + JSON.stringify(["stamp-v1", f.key]);
          d = await this.ensure(l, async () => {
            const p = await C(f, this.assets, t);
            try {
              return t.throwIfAborted(), this.textures.upload(l, p, !1, 0);
            } finally {
              A(p);
            }
          }), h.push(d);
        }
        return t.throwIfAborted(), this.masks.compose(c, a, n, d?.value);
      } finally {
        for (const d of h) d.release();
      }
    });
  }
  dispose() {
    this.masks.dispose();
  }
}
const G = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
let H;
class it {
  constructor(e) {
    if (this.options = e, this.budgets = {
      gpuBytes: 64 * 1024 * 1024,
      cpuBytes: 32 * 1024 * 1024,
      scratchBytes: 16 * 1024 * 1024,
      preparationConcurrency: 2,
      ...e.budgets
    }, !Number.isInteger(this.budgets.preparationConcurrency) || this.budgets.preparationConcurrency < 1 || this.budgets.preparationConcurrency > 4)
      throw RangeError("Preparation concurrency must be 1–4");
    this.assets = new ke(this.budgets.cpuBytes), this.device = new Q(e.canvas), this.textures = new Z(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      e.etching
    ), this.preparer = new ee(this.textures, e.rasterHost ?? this.assets), e.canvas.addEventListener("webglcontextlost", this.contextLost), e.canvas.addEventListener("webglcontextrestored", this.contextRestored);
  }
  options;
  abiVersion = 1;
  assets;
  device;
  textures;
  preparer;
  scene = new ge();
  documents = /* @__PURE__ */ new Map();
  prepared = /* @__PURE__ */ new Map();
  jobs = /* @__PURE__ */ new Map();
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
      xe(t), q(t);
      const i = this.documents.get(t.id);
      if (i && t.revision <= i.revision && i !== t)
        throw Error("Changed documents require a newer revision");
    }
    for (const t of e)
      this.documents.get(t.id) !== t && (this.cancel(t.id), this.documents.set(t.id, t));
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
      if (Ee(i), !this.documents.has(i.card)) throw Error(`Unknown card ${i.card}`);
    this.scene.update(
      Uint32Array.from(t, (i) => i.id),
      Float32Array.from(t.flatMap((i) => i.transform)),
      Int32Array.from(t, (i) => i.order ?? 0)
    ), this.instances = t;
  }
  plan(e) {
    return this.shapeData.length !== this.instances.length * 4 && (this.shapeData = new Float32Array(this.instances.length * 4)), this.instances.forEach((t, i) => {
      const a = (this.prepared.get(t.card)?.document ?? this.documents.get(t.card)).recipe, s = i * 4;
      this.shapeData[s] = a.color.size[1] / a.color.size[0], this.shapeData[s + 1] = a.cornerRadius, this.shapeData[s + 2] = t.deformation?.amount ?? 0, this.shapeData[s + 3] = W(t.id);
    }), this.scene.plan_shaped(e.viewProjection, this.shapeData, e.time ?? 0);
  }
  ready(e, t, i) {
    this.assertLive();
    const a = this.documents.get(e);
    if (!a || a.revision !== t)
      return Promise.reject(Error("Requested revision is not current"));
    this.failed.delete(a);
    const s = this.enqueue(a);
    return i ? new Promise((r, c) => {
      if (i.aborted) {
        c(i.reason);
        return;
      }
      const n = () => c(i.reason);
      i.addEventListener("abort", n, { once: !0 }), s.then(r, c).finally(() => i.removeEventListener("abort", n));
    }) : s;
  }
  enqueue(e) {
    const t = this.jobs.get(e.id);
    if (t) return t.promise;
    let i, a;
    const s = new Promise((c, n) => {
      i = c, a = n;
    }), r = {
      document: e,
      controller: new AbortController(),
      promise: s,
      resolve: i,
      reject: a,
      started: !1
    };
    return this.jobs.set(e.id, r), queueMicrotask(() => this.pump()), s;
  }
  pump() {
    if (!(this.disposed || this.lost))
      for (const e of this.jobs.values()) {
        if (this.active >= this.budgets.preparationConcurrency) break;
        if (e.started) continue;
        e.started = !0, this.active++, this.preparer.prepare(e.document, e.controller.signal).then((i) => {
          if (e.controller.signal.throwIfAborted(), this.documents.get(e.document.id) !== e.document)
            throw Error("Superseded preparation");
          this.prepared.set(e.document.id, i), e.resolve(), this.options.invalidate?.();
        }).catch((i) => {
          e.controller.signal.aborted || this.failed.add(e.document), e.reject(i);
        }).finally(() => {
          this.jobs.get(e.document.id) === e && this.jobs.delete(e.document.id), this.active--, this.pump();
        });
      }
  }
  cancel(e) {
    const t = this.jobs.get(e);
    t && (t.controller.abort(new DOMException("Revision invalidated", "AbortError")), t.reject(t.controller.signal.reason), this.jobs.delete(e));
  }
  material(e, t) {
    const i = (h) => {
      if (!h) return;
      const d = this.textures.store.acquire(h);
      return d && t.push(d), d?.value;
    }, a = i(e.color), s = i(e.mask), r = i(e.overlay), c = i(e.coverage), n = i(e.hologram);
    return a && s && (!e.overlay || r) && (!e.coverage || c) && (!e.hologram || n) ? {
      face: a,
      mask: s,
      overlay: r,
      coverage: c,
      hologram: n,
      hologramSettings: e.hologramSettings,
      recipe: e.document.recipe
    } : null;
  }
  render(e) {
    if (this.assertLive(), Re(e), this.lost) return this.metrics;
    const t = performance.now(), i = this.plan(e), a = [];
    this.lastFrame = e, this.device.begin(e), this.visible = i.length;
    const s = /* @__PURE__ */ new Map(), r = (c) => {
      const n = this.textures.store.acquire("scene:" + c.raster.key);
      if (!n) {
        !this.sceneLayerPending && !this.sceneLayerFailure && this.setSceneLayers(this.sceneLayers).catch(this.options.onError ?? console.error);
        return;
      }
      a.push(n), this.device.drawLayer(
        c,
        n.value,
        c.stage === "hud" ? { ...e, viewProjection: G } : e
      );
    };
    try {
      this.sceneLayers.filter((d) => d.stage === "world-under-cards").forEach(r);
      let c = [], n = null;
      const h = () => {
        n && c.length && this.device.draw(n, e, c), c = [];
      };
      for (const d of i) {
        const f = this.instances[d];
        let l = s.get(f.card);
        if (l === void 0) {
          const p = this.prepared.get(f.card), v = this.documents.get(f.card);
          l = p ? this.material(p, a) : null, s.set(f.card, l), (!l || p?.document !== v) && !this.jobs.has(v.id) && !this.failed.has(v) && this.enqueue(v).catch((m) => {
            m instanceof DOMException && m.name === "AbortError" || this.options.onError?.(m);
          });
        }
        l !== n && (!l || !n || l.face !== n.face || l.mask !== n.mask || l.overlay !== n.overlay || l.coverage !== n.coverage || l.hologram !== n.hologram || l.hologramSettings !== n.hologramSettings || l.recipe.cornerRadius !== n.recipe.cornerRadius || l.recipe.finishCoverageBase !== n.recipe.finishCoverageBase || l.recipe.overlayFoil?.tone !== n.recipe.overlayFoil?.tone || l.recipe.overlayFoil?.strength !== n.recipe.overlayFoil?.strength || JSON.stringify(l.recipe.artWindows) !== JSON.stringify(n.recipe.artWindows)) && (h(), n = l), l && c.push(f);
      }
      h();
      for (const d of ["world-interleaved", "scene-overlay", "hud"])
        this.sceneLayers.filter((f) => f.stage === d).forEach(r);
    } finally {
      for (const c of a) c.release();
      this.device.end();
    }
    return this.frameMs = performance.now() - t, this.metrics;
  }
  async setSceneLayers(e) {
    if (this.assertLive(), this.lost) throw Error("Graphics context is lost");
    if (new Set(e.map((n) => n.id)).size !== e.length)
      throw Error("Duplicate scene layer ID");
    for (const n of e) Te(n);
    const t = e.map((n) => ({ ...n, transform: [...n.transform] })), i = ++this.sceneLayerGeneration, a = this.epoch, s = this.textures, r = [];
    this.sceneLayerFailure = !1, this.sceneLayerPending++;
    const c = () => {
      if (this.disposed || this.lost || this.epoch !== a || i !== this.sceneLayerGeneration)
        throw new DOMException("Stale scene layer preparation", "AbortError");
    };
    try {
      for (const n of t) {
        const h = "scene:" + n.raster.key, d = s.store.acquire(h);
        if (d) {
          r.push(d);
          continue;
        }
        const f = await C(
          n.raster,
          this.options.rasterHost ?? this.assets,
          new AbortController().signal
        );
        try {
          c(), r.push(s.upload(h, f, !1));
        } finally {
          A(f);
        }
      }
      c(), this.sceneLayers = t.sort((n, h) => n.order - h.order || n.id.localeCompare(h.id)), this.options.invalidate?.();
    } catch (n) {
      throw i === this.sceneLayerGeneration && (this.sceneLayerFailure = !0), n;
    } finally {
      for (const n of r) n.release();
      this.sceneLayerPending--;
    }
  }
  hitTest(e, t) {
    const i = this.options.canvas.getBoundingClientRect(), a = this.scene.hit(e / i.width * 2 - 1, 1 - t / i.height * 2);
    if (!a.length) return null;
    const [s, r, c] = a, n = this.instances.find((f) => f.id === s), d = this.prepared.get(n.card)?.document.recipe?.regions.filter((f) => {
      const [l, p, v, m] = f.rect;
      return r >= l && c >= p && r <= l + v && c <= p + m;
    }).sort((f, l) => f.rect[2] * f.rect[3] - l.rect[2] * l.rect[3])[0]?.id;
    return { instance: s, card: n.card, uv: [r, c], part: d ?? null };
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
      pending: this.jobs.size + this.sceneLayerPending,
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
    for (const t of this.jobs.keys()) this.cancel(t);
    this.documents.clear(), this.prepared.clear(), this.sceneLayers = [], this.sceneLayerFailure = !1, this.failed = /* @__PURE__ */ new WeakSet(), this.instances = [], this.device.resetMotion(), this.scene.update(new Uint32Array(), new Float32Array(), new Int32Array()), this.textures.store.clear(), this.assets.clear(), this.lost || this.device.begin({ viewProjection: G });
  }
  contextLost = (e) => {
    e.preventDefault(), this.lost = !0;
    for (const t of this.jobs.keys()) this.cancel(t);
    this.prepared.clear(), this.sceneLayerGeneration++, this.preparer.dispose(), this.textures.store.clear(), this.textures.etcher.dispose(), this.device.dispose();
  };
  contextRestored = () => {
    if (this.disposed) return;
    this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.device = new Q(this.options.canvas), this.textures = new Z(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      this.options.etching
    ), this.preparer = new ee(this.textures, this.options.rasterHost ?? this.assets), this.lost = !1, this.failed = /* @__PURE__ */ new WeakSet();
    const e = this.sceneLayers;
    this.sceneLayers = [], this.setSceneLayers(e).catch(this.options.onError ?? console.error), this.options.invalidate?.(), this.pump();
  };
  async exportCard(e, t) {
    re(t.deformation), await this.ready(e, t.revision);
    const i = this.documents.get(e);
    if (i.revision !== t.revision) throw Error("Export revision changed");
    const a = this.options.canvas, s = [a.width, a.height], r = this.instances, c = this.sceneLayers, n = this.lastFrame;
    if (!Number.isInteger(t.width) || t.width < 1 || t.width > 2048)
      throw RangeError("Invalid export size");
    let h;
    const d = be(t.deformation, t.width), f = this.device.isolateMotion();
    try {
      a.width = t.width, a.height = Math.round(
        t.width * i.recipe.color.size[1] / i.recipe.color.size[0]
      ), this.sceneLayers = [], this.updateScene([
        {
          id: t.instanceId ?? 0,
          card: e,
          finish: t.finish,
          rainFog: t.rainFog,
          wear: t.wear,
          cardstock: t.cardstock,
          printDots: t.printDots,
          deformation: t.deformation,
          transform: [2 * d, 0, 0, 0, 0, -2 * d, 0, 0, 0, 0, 1, 0, -d, d, 0, 1]
        }
      ]), this.render({
        viewProjection: G,
        pointer: t.pointer,
        time: t.time ?? n?.time
      }), h = new Promise(
        (l, p) => a.toBlob(
          (v) => v ? l(v) : p(Error("Export failed")),
          "image/png"
        )
      );
    } finally {
      f(), a.width = s[0], a.height = s[1], this.sceneLayers = c, this.updateScene(r), n && this.render(n);
    }
    return h;
  }
  dispose() {
    if (!this.disposed) {
      for (const e of this.jobs.keys()) this.cancel(e);
      this.disposed = !0, this.sceneLayerGeneration++, this.lost || this.device.begin({ viewProjection: G }), this.options.canvas.removeEventListener("webglcontextlost", this.contextLost), this.options.canvas.removeEventListener("webglcontextrestored", this.contextRestored), this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.assets.dispose(), this.scene.free();
    }
  }
}
async function at(o) {
  H ??= we(o ? { module_or_path: o } : void 0).catch((e) => {
    throw H = void 0, e;
  }), await H;
}
async function ct(o) {
  return await at(o.wasmUrl), new it(o);
}
export {
  ze as C,
  S as D,
  De as G,
  G as I,
  Qe as P,
  it as R,
  Pe as S,
  Z as T,
  Be as W,
  xe as a,
  rt as b,
  ct as c,
  I as d,
  ee as e,
  $e as f,
  Ge as g,
  se as h,
  at as i,
  K as j,
  q as l,
  X as p,
  W as s,
  F as t,
  ye as v
};
