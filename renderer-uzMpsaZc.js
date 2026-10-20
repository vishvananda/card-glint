import { v as re, f as se, c as ie } from "./asset-fetch-my9kgRsJ.js";
import { R as oe, p as R, b as ae, t as S, P as ne, C as ce, v as N, c as he, h as de, d as le, e as ue, i as fe, G as pe, g as ge, j as me, k as ve, _ as we } from "./shaders-BMWWbZTX.js";
import { c as X, a as A } from "./canvas-raster-DIqHyOj6.js";
const V = (n) => (Math.imul(n + 1, 1597334677) >>> 0) % 65536 / 65536;
function Q(n) {
  if (n && (n.kind !== "heat" || !Number.isFinite(n.amount) || n.amount < 0 || n.amount > 0.02))
    throw RangeError("Heat deformation amount must be between 0 and 0.02");
}
function be(n, e) {
  return n?.amount ? e / (e + 4) / (1 + 2 * n.amount) : 1;
}
function M(n) {
  return Number.isInteger(n) && n >= 0 && n <= 4294967295;
}
function L(n) {
  if (n.length !== 4 || n.some((e) => !Number.isFinite(e)) || n[2] <= 0 || n[3] <= 0)
    throw Error("Invalid normalized rectangle");
}
function U(n) {
  if (!n.key || n.key.length > 131072) throw Error("Invalid raster key");
  const [e, t] = n.size;
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 1 || t < 1 || e * t > 4194304)
    throw Error("Invalid raster size");
}
function ye(n) {
  if (!M(n.id) || !Number.isSafeInteger(n.revision) || n.revision < 0)
    throw Error("Invalid card identity");
  const e = n.recipe;
  if (U(e.color), e.stamp && U(e.stamp), !e.pack || e.artWindows.length > 8 || e.edges.length > 32)
    throw Error("Invalid recipe or too many regions");
  if (!Number.isFinite(e.cornerRadius) || e.cornerRadius < 0 || e.cornerRadius > 0.5)
    throw Error("Invalid corner radius");
  const t = e.finishCoverageBase ?? 1;
  if (!Number.isFinite(t) || t < 0 || t > 1) throw Error("Invalid base coverage");
  if (e.overlayFoil) {
    const { tone: s, strength: o } = e.overlayFoil;
    if (!["gold", "silver", "prismatic"].includes(s) || !Number.isFinite(o) || o < 0 || o > 1)
      throw Error("Invalid overlay foil");
  }
  if (e.hologram) {
    const { mask: s, rect: o, strength: r, seed: i = 0 } = e.hologram;
    if (U(s), L(o), !Number.isFinite(r) || r < 0 || r > 1 || !M(i))
      throw Error("Invalid hologram material");
  }
  e.artWindows.forEach(L), e.regions.forEach((s) => L(s.rect));
  for (const s of e.edges) {
    if (s.fit !== void 0 && re(s.fit), L(s.crop), L(s.destination), L(s.clip), s.crop[0] < 0 || s.crop[1] < 0 || s.crop[0] + s.crop[2] > 1.000001 || s.crop[1] + s.crop[3] > 1.000001)
      throw Error("Crop leaves the source image");
    if (!Number.isInteger(s.threshold) || s.threshold < 0 || s.threshold > 255 || ![-90, 0, 90].includes(s.rotation ?? 0))
      throw Error("Invalid edge recipe");
  }
  for (const s of n.layers ?? []) {
    if (U(s.raster), s.clip && L(s.clip), !Number.isInteger(s.order) || Math.abs(s.order) > 2147483647)
      throw Error("Invalid layer order");
    for (const o of [
      s.finishCoverage?.add,
      s.finishCoverage?.exclude,
      s.etchCoverage?.add,
      s.etchCoverage?.exclude
    ])
      o && U(o);
  }
}
function Ee(n) {
  if (n?.artwork !== void 0 && typeof n.artwork != "boolean")
    throw Error("Invalid print dot artwork option");
  if (n?.inset !== void 0 && (!Number.isFinite(n.inset) || n.inset < 0 || n.inset > 0.2))
    throw Error("Invalid print dot inset");
  if (n?.variation !== void 0 && (!Number.isFinite(n.variation) || n.variation < 0 || n.variation > 1))
    throw Error("Invalid print dot variation");
  if (n && (n.amount !== void 0 && (!Number.isFinite(n.amount) || n.amount < 0 || n.amount > 1) || n.period !== void 0 && (!Number.isFinite(n.period) || n.period < 2 || n.period > 16)))
    throw Error("Invalid print dots");
}
function xe(n) {
  if (n.rainFog !== void 0 && (!Number.isFinite(n.rainFog) || n.rainFog < 0 || n.rainFog > 2))
    throw Error("Invalid rain fog density");
  if (Ee(n.printDots), n.cardstock && (!Number.isFinite(n.cardstock.amount) || n.cardstock.amount < 0 || n.cardstock.amount > 1))
    throw Error("Invalid cardstock amount");
  if (Q(n.deformation), n.wear && (!Number.isFinite(n.wear.amount) || n.wear.amount < 0 || n.wear.amount > 1 || n.wear.seed !== void 0 && !M(n.wear.seed)))
    throw Error("Invalid wear amount or seed");
  if (!M(n.id) || !M(n.card) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid instance identity or transform");
  if (!Number.isInteger(n.order ?? 0) || Math.abs(n.order ?? 0) > 2147483647)
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
  ].includes(n.finish ?? "regular"))
    throw Error("Unknown finish");
  if (n.normal && (n.normal.length !== 3 || n.normal.some((e) => !Number.isFinite(e)) || Math.hypot(...n.normal) < 1e-8))
    throw Error("Invalid surface normal");
}
function Ae(n) {
  if (n.lighting !== void 0 && !["pointer", "studio"].includes(n.lighting))
    throw Error("Invalid lighting model");
  if (!Number.isFinite(n.time ?? 0) || (n.time ?? 0) < 0)
    throw Error("Frame time must be finite, nonnegative seconds");
  if (n.hover && (!M(n.hover.instance) || n.hover.uv.length !== 2 || n.hover.uv.some((e) => !Number.isFinite(e) || e < 0 || e > 1)))
    throw Error("Invalid card-local hover");
}
function Fe(n) {
  if (U(n.raster), !n.id || !Number.isInteger(n.order) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid scene layer");
  if (!["world-under-cards", "world-interleaved", "scene-overlay", "hud"].includes(n.stage) || !["test-write", "test-readonly", "ignore"].includes(n.depth))
    throw Error("Invalid scene layer stage or depth");
  if (["scene-overlay", "hud"].includes(n.stage) && n.depth !== "ignore")
    throw Error("Overlay/HUD layers must ignore depth");
}
class Z {
  constructor(e, t) {
    if (this.destroy = t, !Number.isSafeInteger(e) || e < 1 || e > 4294967295)
      throw RangeError("Invalid cache budget");
    this.policy = new oe(e);
  }
  destroy;
  policy;
  resources = /* @__PURE__ */ new Map();
  generation = 0;
  acquire(e) {
    const t = this.policy.lookup(e);
    return t === void 0 ? null : this.lease(t);
  }
  insert(e, t, s) {
    if (!Number.isSafeInteger(s) || s < 1 || s > 4294967295)
      throw this.destroy(t), RangeError("Invalid resource size");
    let o;
    try {
      o = JSON.parse(this.policy.admit(e, s, 1));
    } catch (r) {
      throw this.destroy(t), r;
    }
    for (const r of o.evicted) {
      const i = this.resources.get(r);
      i !== void 0 && this.destroy(i), this.resources.delete(r);
    }
    return this.resources.has(o.handle) ? this.destroy(t) : this.resources.set(o.handle, t), this.lease(o.handle);
  }
  /** Admit and evict before allocating a GPU object, so a miss does not
   * temporarily duplicate the resident cache's entire working set. */
  create(e, t, s, o = 1) {
    if (!Number.isSafeInteger(t) || t < 1 || t > 4294967295)
      throw RangeError("Invalid resource size");
    const r = JSON.parse(
      this.policy.admit(e, t, o)
    );
    for (const i of r.evicted) {
      const c = this.resources.get(i);
      c !== void 0 && this.destroy(c), this.resources.delete(i);
    }
    if (this.resources.has(r.handle)) return this.lease(r.handle);
    try {
      return this.resources.set(r.handle, s()), this.lease(r.handle);
    } catch (i) {
      throw this.policy.remove(r.handle), i;
    }
  }
  lease(e) {
    const t = this.resources.get(e);
    if (t === void 0) throw Error("Resource ownership mismatch");
    this.policy.pin(e, !0);
    const s = this.generation;
    let o = !1;
    return {
      value: t,
      release: () => {
        o || (o = !0, s === this.generation && this.policy.pin(e, !1));
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
async function Te(n, e) {
  const t = await se(n.url, { mode: "cors", signal: e });
  if (!t.ok) throw Error(`Asset ${t.status}: ${n.url}`);
  const s = await t.blob();
  if (!s.type.includes("svg"))
    return createImageBitmap(
      s,
      n.width ? { resizeWidth: n.width, resizeQuality: "high" } : {}
    );
  const o = new DOMParser().parseFromString(await s.text(), "image/svg+xml"), r = o.documentElement;
  if (r.localName !== "svg" || o.querySelector("parsererror")) throw Error("Invalid SVG");
  const i = (r.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), c = i[2] ?? Number.parseFloat(r.getAttribute("width") ?? ""), a = i[3] ?? Number.parseFloat(r.getAttribute("height") ?? "");
  if (!(c > 0 && a > 0 && Number.isFinite(c + a))) throw Error("SVG needs finite dimensions");
  const l = (n.width ?? 512) / Math.max(c, a);
  r.hasAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${c} ${a}`), r.setAttribute("width", String(Math.max(1, Math.round(c * l)))), r.setAttribute("height", String(Math.max(1, Math.round(a * l))));
  const d = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(r)], { type: "image/svg+xml" })
  ), u = new Image();
  try {
    return u.src = d, await u.decode(), await createImageBitmap(u);
  } finally {
    u.src = "", URL.revokeObjectURL(d);
  }
}
class Re {
  store;
  pending = /* @__PURE__ */ new Map();
  active = 0;
  waiting = [];
  disposed = !1;
  generation = 0;
  controllers = /* @__PURE__ */ new Set();
  decodes = 0;
  constructor(e) {
    this.store = new Z(e, (t) => t.close());
  }
  async reserve() {
    return this.active >= 4 ? await new Promise((e) => this.waiting.push(e)) : this.active++, () => {
      const e = this.waiting.shift();
      e ? e() : this.active--;
    };
  }
  async image(e, t) {
    if (t.throwIfAborted(), this.disposed) throw Error("Asset store disposed");
    const s = JSON.stringify([e.url, e.width, e.revision]);
    let o = this.store.acquire(s);
    if (o) return o;
    let r = this.pending.get(s);
    if (!r) {
      const i = this.generation, c = new AbortController();
      this.controllers.add(c), r = (async () => {
        const a = await this.reserve();
        try {
          if (this.disposed || i !== this.generation) throw Error("Asset scope changed");
          const l = await Te(e, c.signal);
          if (this.decodes++, this.disposed || i !== this.generation)
            throw l.close(), Error("Asset scope changed");
          this.store.insert(s, l, l.width * l.height * 4).release();
        } finally {
          a(), this.controllers.delete(c), i === this.generation && this.pending.delete(s);
        }
      })(), this.pending.set(s, r);
    }
    if (await r, t.throwIfAborted(), o = this.store.acquire(s), !o) throw Error("Decoded working set exceeds CPU budget");
    return o;
  }
  async images(e, t) {
    const s = [], o = /* @__PURE__ */ new Map(), r = await Promise.allSettled(
      e.map(async (a) => {
        const l = await this.image(a, t);
        s.push(l), o.set(a.url, l.value);
      })
    ), i = () => {
      for (const a of s) a.release();
      o.clear();
    }, c = r.find((a) => a.status === "rejected");
    if (c?.status === "rejected")
      throw i(), c.reason;
    return { value: o, release: i };
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
const k = (n, e) => Math.max(-e, Math.min(e, n));
function ee(n, e) {
  const t = Math.min(2047, Math.max(0, Math.round((n / 0.24 + 0.5) * 2047))), s = Math.min(0.9995, Math.max(5e-4, e / 0.24 + 0.5));
  return 1 + t + s;
}
function j(n, e, t, s) {
  for (let o = 1; o <= 4; o++) {
    const r = (n.activeRipple + o) % 4, i = 4 + r * 4;
    if (!(n.data[i + 3] > 0 && e - n.data[i + 2] < 2.25))
      return n.activeRipple = r, n.segStart = [t, s], n.segTime = e, n.data.set([t, s, e, ee(0, 0)], i), !0;
  }
  return !1;
}
class W {
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
    const s = e.finish ?? "regular";
    if (s !== "rain" && s !== "heat" && s !== "pool" && !e.deformation)
      return null;
    const o = t.time ?? 0, r = e.transform, i = e.normal ?? [0, 0, 1], c = [r[12], r[13], i[0], i[1]];
    let a = this.states.get(e.id);
    if (!a || o < a.time) {
      const u = new Float32Array(20);
      u.set([0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0], 4), a = {
        seen: this.serial,
        time: o,
        pose: c,
        velocity: [0, 0],
        data: u,
        activeRipple: 0,
        emitting: !1,
        segStart: [0.5, 0.5],
        segTime: -100,
        hoverUv: [0.5, 0.5],
        hovering: !1
      }, this.states.set(e.id, a);
    }
    a.seen = this.serial;
    const l = Math.min(0.05, o - a.time), d = t.hover?.instance === e.id ? t.hover : void 0;
    if (d) {
      const u = d.uv[0], h = 1 - d.uv[1];
      if (!a.hovering)
        a.hoverUv = [u, h], a.emitting = j(a, o, u, h);
      else {
        const p = u - a.hoverUv[0], g = h - a.hoverUv[1], m = Math.hypot(p, g);
        a.hoverUv = [u, h], l > 0 && m > 0 && (a.velocity[0] = k(a.velocity[0] + k(p * 1.8, 0.28), 1), a.velocity[1] = k(a.velocity[1] + k(g * 1.8, 0.28), 1));
        const w = (u - a.segStart[0]) * 0.5, v = (h - a.segStart[1]) * 0.5, b = Math.hypot(w, v) * 2, f = o - a.segTime;
        if (m > 5e-4)
          if (!a.emitting || b > 0.11 || f > 0.13 && b > 0.02)
            a.emitting = j(a, o, u, h);
          else {
            const y = a.segStart[0] + w, E = a.segStart[1] + v, _ = a.segTime + f * 0.45;
            a.data.set([y, E, _, ee(w, v)], 4 + a.activeRipple * 4);
          }
      }
    }
    if (d || (a.emitting = !1), l > 0) {
      const u = [Math.hypot(r[0], r[1], r[2]), Math.hypot(r[4], r[5], r[6])];
      for (let h = 0; h < 2; h++) {
        const p = (c[h] - a.pose[h]) / Math.max(0.05, u[h]) + (c[h + 2] - a.pose[h + 2]) * 0.7, g = k(p, 0.22), m = Math.max(1, Math.ceil(l / (1 / 120))), w = l / m;
        for (let v = 0; v < m; v++) {
          let b = a.data[h], f = a.velocity[h] + (v === 0 ? g * 4.5 : 0);
          f += (-26 * b - 4.8 * f) * w, b = k(b + f * w, 0.35), a.data[h] = b, a.velocity[h] = k(f, 1.4);
        }
      }
    }
    return a.hovering = !!d, a.time = o, a.pose = c, a.data;
  }
}
const x = 192, D = 512, Ie = `#version 300 es
precision highp float;
uniform float time;
out vec2 incoming;
${ae}
void main(){
 // Include a skirt around the periodic tile: rays from outside can land inside.
 vec2 p=vec2(gl_VertexID%${x + 1},gl_VertexID/${x + 1})/${x}.*2.4-.2;
 vec3 wave=waterField(p,time);
 vec3 normal=normalize(vec3(-wave.xy,1.));
 vec3 ray=refract(vec3(0.,0.,-1.),normal,1./1.333);
 vec2 floorPoint=p+ray.xy/(-ray.z)*(waterDepth+wave.z);
 incoming=p;
 gl_Position=vec4(floorPoint/waterPeriod*2.-1.,0.,1.);
}`, Le = `#version 300 es
precision highp float;
in vec2 incoming;out vec4 color;
void main(){
 // Each fragment receives the area of its source light footprint. Overlapping
 // folds accumulate by additive blending; expanded footprints become darker.
 vec2 dx=dFdx(incoming),dy=dFdy(incoming);
 float flux=abs(dx.x*dy.y-dx.y*dy.x)*${(D / 2) ** 2}.;
 color=vec4(min(flux,8.)/8.,0.,0.,1.);
}`;
class ke {
  constructor(e) {
    if (this.gl = e, this.shader = R(e, Le, Ie), this.clock = e.getUniformLocation(this.shader, "time"), this.map = S(e, D, D), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.REPEAT), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.REPEAT), this.framebuffer = e.createFramebuffer(), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.map, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
      throw e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteProgram(this.shader), Error("Caustics framebuffer is incomplete");
    this.vao = e.createVertexArray(), this.indices = e.createBuffer(), e.bindVertexArray(this.vao), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indices);
    const t = new Uint16Array(x * x * 6);
    for (let s = 0; s < x; s++)
      for (let o = 0; o < x; o++) {
        const r = s * (x + 1) + o, i = r + x + 1;
        t.set([r, r + 1, i, i, r + 1, i + 1], (s * x + o) * 6);
      }
    e.bufferData(e.ELEMENT_ARRAY_BUFFER, t, e.STATIC_DRAW), e.bindVertexArray(null), e.bindFramebuffer(e.FRAMEBUFFER, null);
  }
  gl;
  map;
  bytes = D * D + x * x * 6 * 2;
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
    t.bindFramebuffer(t.FRAMEBUFFER, this.framebuffer), t.viewport(0, 0, D, D), t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.disable(t.SCISSOR_TEST), t.colorMask(!0, !0, !0, !0), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.enable(t.BLEND), t.blendEquation(t.FUNC_ADD), t.blendFunc(t.ONE, t.ONE), t.useProgram(this.shader), t.uniform1f(this.clock, e), t.bindVertexArray(this.vao), t.drawElements(t.TRIANGLES, x * x * 6, t.UNSIGNED_SHORT, 0), t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, t.drawingBufferWidth, t.drawingBufferHeight), t.disable(t.BLEND), this.time = e, this.passes++;
  }
  dispose() {
    const e = this.gl;
    e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteVertexArray(this.vao), e.deleteBuffer(this.indices), e.deleteProgram(this.shader);
  }
}
const De = 732;
function He(n, e = T.period) {
  if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(e) || e < 2 || e > 16)
    throw RangeError("Invalid print-dot period or face width");
  return e * n / De;
}
const T = Object.freeze({
  amount: 0.35,
  period: 2,
  variation: 0.5,
  inset: 0,
  artwork: !0
});
function z(n) {
  return [
    n ? n.amount ?? T.amount : 0,
    n?.period ?? T.period,
    n?.variation ?? T.variation,
    n?.inset ?? T.inset
  ];
}
function te(n) {
  const e = new Float32Array(32);
  return n.forEach(([t, s, o, r], i) => e.set([t, 1 - s - r, t + o, 1 - s], i * 4)), e;
}
const Se = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`, _e = `#version 300 es
#define PRINT_DOT_ART_WINDOWS
precision highp float;
in vec2 uv;out vec4 color;uniform sampler2D face;
vec3 previewInk(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 previewLinear(vec3 c){return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c));}
${ne.replace("flat in vec4 printDotsInfo;", "uniform vec4 printDotsInfo;")}
void main(){
 printFootprint=1./printDotPeriodTexels();
 // Fine screens need pixel-area coverage before they enter the mip chain.
 // Sample only the ink screen: averaging source texels would soften lettering.
 // This pass is cached per printing/settings, never rerun for pointer motion.
 if(printDotPeriodTexels()<4.){
  vec4 source=texture(face,uv);vec3 ink=previewInk(source.rgb),sum=vec3(0.);
  vec2 pixel=1./vec2(textureSize(face,0));
  for(int y=0;y<2;y++)for(int x=0;x<2;x++){
   vec2 offset=(vec2(float(x),float(y))-.5)*.5;
   sum+=previewLinear(printDotInk(ink,uv+offset*pixel));
  }
  color=vec4(sum*.25,source.a);
 }else color=printFace(uv);
}`, q = 16 * 1024 * 1024, $ = (n) => {
  let e = n.width, t = n.height, s = 0;
  for (; ; ) {
    if (s += e * t * 4, e === 1 && t === 1) return s;
    e = Math.max(1, Math.floor(e / 2)), t = Math.max(1, Math.floor(t / 2));
  }
};
class Ue {
  constructor(e) {
    this.gl = e, this.shader = R(e, _e, Se), this.framebuffer = e.createFramebuffer(), this.vao = e.createVertexArray();
  }
  gl;
  shader;
  framebuffer;
  vao;
  entries = [];
  frame = 0;
  bytes = 0;
  passes = 0;
  /** Protect the active working set. Overflow uses the existing procedural path
   * instead of evicting and rebuilding the same printing on every frame. */
  beginFrame() {
    this.frame++;
  }
  prepare(e, t, s, o = []) {
    const r = z(s), i = s.artwork !== !1, c = JSON.stringify([r, i, i ? [] : o]), a = this.entries.findIndex(
      (h) => h.source.texture === e.texture && h.overlay?.texture === t?.texture && h.settings === c
    );
    if (a >= 0) {
      const h = this.entries.splice(a, 1)[0];
      return h.lastFrame = this.frame, this.entries.push(h), h;
    }
    const l = $(e) + (t ? $(t) : 0);
    if (l > q) return;
    for (; this.bytes + l > q; ) {
      const h = this.entries.findIndex(
        (g) => this.frame === 0 || g.lastFrame < this.frame - 1
      );
      if (h < 0) return;
      const p = this.entries.splice(h, 1)[0];
      this.release(p);
    }
    let d, u;
    try {
      d = this.paint(e, r, o, i), t && (u = this.paint(t, r, o, i));
      const h = { source: e, overlay: t, settings: c, face: d, top: u, bytes: l, lastFrame: this.frame };
      return this.entries.push(h), this.bytes += l, h;
    } catch (h) {
      throw this.gl.deleteTexture(d?.texture ?? null), this.gl.deleteTexture(u?.texture ?? null), h;
    }
  }
  /** Uncached native preparation. The caller owns and deletes the returned texture. */
  paint(e, t, s = [], o = !0) {
    const r = this.gl, i = e.width, c = e.height, a = S(r, i, c, r.SRGB8_ALPHA8, r.RGBA);
    try {
      if (r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, a, 0), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE)
        throw Error("Printed ink framebuffer is incomplete");
      return r.viewport(0, 0, i, c), r.disable(r.DEPTH_TEST), r.disable(r.CULL_FACE), r.disable(r.SCISSOR_TEST), r.disable(r.BLEND), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.useProgram(this.shader), r.bindVertexArray(this.vao), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, e.texture), r.uniform1i(r.getUniformLocation(this.shader, "face"), 0), r.uniform4fv(r.getUniformLocation(this.shader, "printDotsInfo"), t), r.uniform4fv(
        r.getUniformLocation(this.shader, "printArtBounds[0]"),
        te(s)
      ), r.uniform1f(r.getUniformLocation(this.shader, "printArtwork"), o ? 1 : 0), r.drawArrays(r.TRIANGLES, 0, 3), this.passes++, r.bindTexture(r.TEXTURE_2D, a), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR_MIPMAP_LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.generateMipmap(r.TEXTURE_2D), { texture: a, width: i, height: c };
    } catch (l) {
      throw r.deleteTexture(a), l;
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
const Me = {
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
}, F = 49;
class J {
  constructor(e) {
    this.canvas = e;
    const t = e.getContext("webgl2", {
      alpha: !0,
      antialias: !0,
      premultipliedAlpha: !1,
      preserveDrawingBuffer: !0
    });
    if (!t) throw Error("WebGL2 is required");
    this.gl = t, this.caustics = new ke(t), this.cardstock = new ce(t), this.printedInk = new Ue(t), this.foil = R(t, he, N), this.holographic = R(t, de, N), this.procedural = R(t, le, N), this.proceduralHolographic = R(t, ue, N), this.image = R(t, fe, N), this.vao = t.createVertexArray(), this.quad = t.createBuffer(), this.instances = t.createBuffer(), this.blank = S(t, 1, 1, t.RGBA8, t.RGBA), t.bindTexture(t.TEXTURE_2D, this.blank), t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)), t.bindVertexArray(this.vao), t.bindBuffer(t.ARRAY_BUFFER, this.quad), t.bufferData(
      t.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      t.STATIC_DRAW
    ), t.enableVertexAttribArray(0), t.vertexAttribPointer(0, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, this.instances);
    for (let s = 0; s < 4; s++)
      t.enableVertexAttribArray(1 + s), t.vertexAttribPointer(1 + s, 4, t.FLOAT, !1, F * 4, s * 16), t.vertexAttribDivisor(1 + s, 1);
    t.enableVertexAttribArray(5), t.vertexAttribPointer(5, 3, t.FLOAT, !1, F * 4, 64), t.vertexAttribDivisor(5, 1), t.enableVertexAttribArray(6), t.vertexAttribPointer(6, 1, t.FLOAT, !1, F * 4, 76), t.vertexAttribDivisor(6, 1);
    for (let s = 7; s <= 11; s++)
      t.enableVertexAttribArray(s), t.vertexAttribPointer(s, 4, t.FLOAT, !1, F * 4, 80 + (s - 7) * 16), t.vertexAttribDivisor(s, 1);
    t.enableVertexAttribArray(12), t.vertexAttribPointer(12, 2, t.FLOAT, !1, F * 4, 160), t.vertexAttribDivisor(12, 1), t.enableVertexAttribArray(13), t.vertexAttribPointer(13, 1, t.FLOAT, !1, F * 4, 168), t.vertexAttribDivisor(13, 1), t.enableVertexAttribArray(14), t.vertexAttribPointer(14, 4, t.FLOAT, !1, F * 4, 172), t.vertexAttribDivisor(14, 1), t.enableVertexAttribArray(15), t.vertexAttribPointer(15, 2, t.FLOAT, !1, F * 4, 188), t.vertexAttribDivisor(15, 1), t.bindVertexArray(null);
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
  motion = new W();
  caustics;
  cardstock;
  printedInk;
  uniforms = /* @__PURE__ */ new WeakMap();
  frameUniforms = /* @__PURE__ */ new Map();
  bounds = /* @__PURE__ */ new WeakMap();
  draws = 0;
  begin(e) {
    this.motion.begin(), this.printedInk.beginFrame(), this.frameUniforms.clear();
    const t = this.gl;
    t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, this.canvas.width, this.canvas.height), t.disable(t.SCISSOR_TEST), t.disable(t.CULL_FACE), t.colorMask(!0, !0, !0, !0), t.depthMask(!0), t.clearDepth(1), t.clearColor(...e.clear ?? [0, 0, 0, 0]), t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT), this.draws = 0;
  }
  uniform(e, t) {
    let s = this.uniforms.get(e);
    return s || this.uniforms.set(e, s = /* @__PURE__ */ new Map()), s.has(t) || s.set(t, this.gl.getUniformLocation(e, t)), s.get(t);
  }
  bind(e, t, s, o = !1) {
    const r = this.gl;
    r.useProgram(e), r.bindVertexArray(this.vao), r.bindBuffer(r.ARRAY_BUFFER, this.instances);
    const i = s.length * F;
    this.staging.length < i && (this.staging = new Float32Array(i));
    const c = this.staging;
    if (s.forEach((a, l) => {
      const d = l * F;
      c.set(a.transform, d), c.set(a.normal ?? [0, 0, 1], d + 16), c[d + 19] = Me[a.finish ?? "regular"];
      const u = this.motion.sample(a, t);
      u ? c.set(u, d + 20) : c.fill(0, d + 20, d + F), c[d + 22] = V(a.id), c[d + 23] = a.deformation?.amount ?? 0, c[d + 40] = a.wear?.amount ?? 0, c[d + 41] = V(a.wear?.seed ?? a.id), c[d + 42] = a.cardstock?.amount ?? 0;
      const h = a.printDots;
      c[d + 43] = o || !h ? 0 : h.amount ?? T.amount, c[d + 44] = h?.period ?? T.period, c[d + 45] = h?.variation ?? T.variation, c[d + 46] = h?.inset ?? T.inset, c[d + 47] = a.rainFog ?? 1, c[d + 48] = a.printDots?.artwork === !1 ? 0 : 1;
    }), this.instanceCapacity < i && (this.instanceCapacity = i, r.bufferData(r.ARRAY_BUFFER, i * 4, r.DYNAMIC_DRAW)), r.bufferSubData(r.ARRAY_BUFFER, 0, c, 0, i), this.frameUniforms.get(e) !== t) {
      r.uniformMatrix4fv(this.uniform(e, "viewProjection"), !1, t.viewProjection);
      const a = t.lighting === "studio" ? [0.5, 0.5] : t.pointer ?? [0.5, 0.5];
      r.uniform2f(this.uniform(e, "pointer"), a[0], 1 - a[1]), r.uniform1f(this.uniform(e, "surfaceTime"), t.time ?? 0), r.uniform1f(this.uniform(e, "studioLighting"), t.lighting === "studio" ? 1 : 0), this.frameUniforms.set(e, t);
    }
  }
  draw(e, t, s) {
    const o = this.gl;
    s.some((f) => f.finish === "pool") && this.caustics.prepare(t.time ?? 0), s.some(
      (f) => f.finish && f.finish !== "regular" && (f.cardstock?.amount ?? 0) > 0
    ) && this.cardstock.prepare();
    const r = s[0]?.printDots, i = z(r), a = r && i[0] > 0 && (s.length === 1 || s.every(
      (f) => z(f.printDots).every((y, E) => y === i[E]) && f.printDots?.artwork !== !1 == (r.artwork !== !1)
    )) ? this.printedInk.prepare(
      e.face,
      e.overlay,
      r,
      e.recipe.artWindows
    ) : void 0, l = !a && s.some(
      (f) => f.printDots && (f.printDots.amount ?? T.amount) > 0
    ), d = e.recipe.hologram?.strength ? l ? this.proceduralHolographic : this.holographic : l ? this.procedural : this.foil;
    this.bind(d, t, s, !!a), o.enable(o.DEPTH_TEST), o.depthFunc(o.LEQUAL), o.depthMask(!0), o.disable(o.BLEND), [
      ["face", a?.face.texture ?? e.face.texture],
      ["mask", e.mask.texture],
      ["overlay", a?.top?.texture ?? e.overlay?.texture ?? this.blank],
      ["coverage", e.coverage?.texture ?? this.blank],
      ["caustics", this.caustics.map],
      ["hologramMask", e.hologram?.texture ?? this.blank],
      ["cardstockMap", this.cardstock.map ?? this.blank]
    ].forEach(([f, y], E) => {
      o.activeTexture(o.TEXTURE0 + E), o.bindTexture(o.TEXTURE_2D, y), o.uniform1i(this.uniform(d, f), E);
    });
    let h = this.bounds.get(e.recipe);
    h || this.bounds.set(e.recipe, h = te(e.recipe.artWindows)), o.uniform4fv(this.uniform(d, "artBounds[0]"), h), o.uniform4fv(this.uniform(d, "printArtBounds[0]"), h), o.uniform1f(this.uniform(d, "finishBase"), e.recipe.finishCoverageBase ?? 1);
    const p = e.recipe.hologram, [g, m, w, v] = p?.rect ?? [0, 0, 1, 1];
    o.uniform4f(this.uniform(d, "hologramRect"), g, 1 - m - v, w, v), o.uniform2f(
      this.uniform(d, "hologramMaterial"),
      p?.strength ?? 0,
      (p?.seed ?? 0) / 4294967295
    );
    const b = e.recipe.overlayFoil;
    o.uniform2f(
      this.uniform(d, "overlayFoil"),
      b ? { gold: 1, silver: 3, prismatic: 2 }[b.tone] : 0,
      b?.strength ?? 0
    ), o.uniform1f(this.uniform(d, "cornerRadius"), e.recipe.cornerRadius), o.uniform1f(this.uniform(d, "aspect"), e.face.height / e.face.width), o.uniform1f(this.uniform(d, "hasMask"), 1), o.uniform1f(this.uniform(d, "satinCompact"), 1), o.uniform1f(this.uniform(d, "satinHoverGain"), 0), o.drawArraysInstanced(o.TRIANGLES, 0, 6, s.length), this.draws++;
  }
  drawLayer(e, t, s) {
    const o = this.gl, r = this.image;
    this.bind(r, s, [{ id: 0, card: 0, transform: e.transform }]), e.depth === "ignore" ? o.disable(o.DEPTH_TEST) : (o.enable(o.DEPTH_TEST), o.depthFunc(o.LEQUAL)), o.depthMask(e.depth === "test-write"), o.enable(o.BLEND), o.blendFuncSeparate(o.SRC_ALPHA, o.ONE_MINUS_SRC_ALPHA, o.ONE, o.ONE_MINUS_SRC_ALPHA), o.activeTexture(o.TEXTURE0), o.bindTexture(o.TEXTURE_2D, t.texture), o.uniform1i(this.uniform(r, "face"), 0), o.drawArraysInstanced(o.TRIANGLES, 0, 6, 1), this.draws++, o.depthMask(!0), o.disable(o.BLEND);
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
    return this.motion = new W(), () => {
      this.motion = e;
    };
  }
}
class Y {
  constructor(e, t, s, o = "gpu") {
    this.gl = e, this.scratchLimit = s, this.mode = o, this.store = new Z(t, (r) => e.deleteTexture(r.texture)), this.etcher = new pe(e);
  }
  gl;
  scratchLimit;
  mode;
  store;
  etcher;
  kernels = new ge();
  uploads = 0;
  edgeBuilds = 0;
  readbacks = 0;
  upload(e, t, s = !0, o = 1) {
    const r = this.store.acquire(e);
    if (r) return r;
    const i = this.gl, c = t.width, a = t.height;
    return this.store.create(
      e,
      c * a * 4,
      () => {
        const l = S(i, c, a, s ? i.SRGB8_ALPHA8 : i.RGBA8, i.RGBA);
        if (i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, l), i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !0), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
          const d = document.createElement("canvas");
          d.width = c, d.height = a;
          try {
            d.getContext("2d").drawImage(t, 0, 0), i.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, i.RGBA, i.UNSIGNED_BYTE, d);
          } finally {
            d.width = d.height = 0;
          }
        } else
          i.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, i.RGBA, i.UNSIGNED_BYTE, t);
        return i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1), this.uploads++, { texture: l, width: c, height: a };
      },
      o
    );
  }
  edge(e, t, s) {
    const o = this.store.acquire(e);
    if (o) return o;
    const r = this.gl, i = t.width, c = t.height;
    if (i * c * 7 > this.scratchLimit) throw Error("Etching exceeds scratch budget");
    return this.store.create(
      e,
      i * c,
      () => {
        let a;
        if (this.mode === "gpu") a = this.etcher.run(t, i, c, s);
        else {
          const l = document.createElement("canvas");
          l.width = i, l.height = c;
          try {
            const d = l.getContext("2d", { willReadFrequently: !0 });
            d.drawImage(t, 0, 0);
            const u = d.getImageData(0, 0, i, c).data, h = this.kernels.etch(
              i,
              c,
              new Uint8Array(u.buffer, u.byteOffset, u.byteLength),
              s
            ), p = new Uint8Array(h.length);
            for (let g = 0; g < c; g++)
              p.set(h.subarray(g * i, (g + 1) * i), (c - 1 - g) * i);
            a = S(r, i, c), r.bindTexture(r.TEXTURE_2D, a), r.pixelStorei(r.UNPACK_ALIGNMENT, 1), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, i, c, r.RED, r.UNSIGNED_BYTE, p);
          } finally {
            l.width = l.height = 0;
          }
        }
        return this.uploads++, this.edgeBuilds++, { texture: a, width: i, height: c };
      },
      0
    );
  }
  uploadBytes(e, t, s) {
    const o = this.store.acquire(e);
    if (o) return o;
    const r = this.gl, [i, c] = s, a = new Uint8Array(t.length);
    for (let l = 0; l < c; l++)
      a.set(t.subarray(l * i * 4, (l + 1) * i * 4), (c - 1 - l) * i * 4);
    return this.store.create(e, i * c * 4, () => {
      const l = S(r, i, c, r.RGBA8, r.RGBA);
      return r.bindTexture(r.TEXTURE_2D, l), r.pixelStorei(r.UNPACK_ALIGNMENT, 1), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, i, c, r.RGBA, r.UNSIGNED_BYTE, a), this.uploads++, { texture: l, width: i, height: c };
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
const Ne = `#version 300 es
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
class Be {
  constructor(e) {
    this.textures = e;
    const t = e.gl;
    this.shader = R(t, Ne), this.fbo = t.createFramebuffer(), this.vao = t.createVertexArray();
  }
  textures;
  shader;
  fbo;
  vao;
  disposed = !1;
  builds = 0;
  compose(e, t, s, o) {
    const r = this.textures.store.acquire(e);
    if (r) return r;
    const i = this.textures.gl, [c, a] = t;
    return this.textures.store.create(e, c * a, () => {
      const l = S(i, c, a);
      try {
        if (i.bindFramebuffer(i.FRAMEBUFFER, this.fbo), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, l, 0), i.checkFramebufferStatus(i.FRAMEBUFFER) !== i.FRAMEBUFFER_COMPLETE)
          throw Error("Mask framebuffer unavailable");
        i.bindVertexArray(this.vao), i.viewport(0, 0, c, a), i.disable(i.DEPTH_TEST), i.disable(i.SCISSOR_TEST), i.disable(i.DITHER), i.colorMask(!0, !0, !0, !0), i.clearColor(0, 0, 0, 0), i.clear(i.COLOR_BUFFER_BIT), i.useProgram(this.shader), i.enable(i.BLEND), i.blendFunc(i.ONE, i.ONE_MINUS_SRC_ALPHA);
        const d = (u, h, p, g, m, w = 0) => {
          i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, u.texture), i.uniform1i(i.getUniformLocation(this.shader, "inputMask"), 0), i.uniform2f(i.getUniformLocation(this.shader, "size"), c, a), i.uniform4fv(i.getUniformLocation(this.shader, "cover"), h), i.uniform4fv(i.getUniformLocation(this.shader, "clip"), p), i.uniform4fv(i.getUniformLocation(this.shader, "crop"), g), i.uniform1f(i.getUniformLocation(this.shader, "alphaChannel"), m ? 1 : 0), i.uniform1f(i.getUniformLocation(this.shader, "angle"), w), i.drawArrays(i.TRIANGLES, 0, 3);
        };
        o && d(o, [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1], !0);
        for (const { value: u, spec: h } of s) {
          const [p, g, m, w] = h.destination, v = h.rotation ?? 0, b = u.width * h.crop[2], f = u.height * h.crop[3];
          let y;
          if (h.fit) {
            const E = h.fit.focalPoint ?? [0.5, 0.5], _ = {
              ...h.fit,
              focalPoint: v === 90 ? [1 - E[1], E[0]] : v === -90 ? [E[1], 1 - E[0]] : E
            }, I = ie(
              v ? f : b,
              v ? b : f,
              [p * c, g * a, m * c, w * a],
              _
            );
            y = [I[0] / c, I[1] / a, I[2] / c, I[3] / a];
          } else {
            const E = Math.max(
              m * c / (v ? f : b),
              w * a / (v ? b : f)
            ), _ = (v ? f : b) * E / c, I = (v ? b : f) * E / a;
            y = [p + (m - _) / 2, g + (w - I) / 2, _, I];
          }
          d(u, y, h.clip, h.crop, !!h.importedMask, v);
        }
        this.builds++;
      } catch (d) {
        throw i.deleteTexture(l), d;
      } finally {
        i.disable(i.BLEND), i.bindFramebuffer(i.FRAMEBUFFER, null), i.bindVertexArray(null);
      }
      return { texture: l, width: c, height: a };
    });
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    const e = this.textures.gl;
    e.deleteProgram(this.shader), e.deleteFramebuffer(this.fbo), e.deleteVertexArray(this.vao);
  }
}
async function C(n, e, t, s) {
  t.throwIfAborted();
  const o = await n.paint(e, t, s);
  if (o.width !== n.size[0] || o.height !== n.size[1] || t.aborted)
    throw A(o), t.throwIfAborted(), Error("Raster dimensions differ from recipe");
  if ("getContext" in o) return o;
  const r = X(n.size);
  try {
    const i = r.getContext("2d");
    if (!i) throw Error("Canvas2D raster unavailable");
    return i.drawImage(o, 0, 0), r;
  } catch (i) {
    throw A(r), i;
  } finally {
    o.close();
  }
}
function H(n) {
  const e = n.layers ?? [], t = me(
    JSON.stringify(
      e.map((s) => ({
        id: s.id,
        stage: s.stage,
        order: s.order,
        contributesToEtch: s.contributesToEtch ?? !1
      }))
    )
  );
  return Array.from(t, (s) => e[s]);
}
function B(n) {
  return JSON.stringify(n.map((e) => [e.id, e.stage, e.order, e.raster.key, e.clip]));
}
async function P(n, e, t, s, o = X(n)) {
  const r = o.getContext("2d");
  try {
    for (const i of e) {
      const c = await C(i.raster, t, s);
      try {
        if (r.save(), i.clip) {
          r.beginPath();
          const [a, l, d, u] = i.clip;
          r.rect(a * n[0], l * n[1], d * n[0], u * n[1]), r.clip();
        }
        r.drawImage(c, 0, 0, ...n), r.restore();
      } finally {
        A(c);
      }
    }
    return o;
  } catch (i) {
    throw A(o), i;
  }
}
async function Pe(n, e, t, s) {
  const o = X(n), r = o.getContext("2d", { willReadFrequently: !0 }), i = r.createImageData(...n);
  try {
    for (const c of e) {
      const a = [
        c.finishCoverage?.add,
        c.finishCoverage?.exclude,
        c.etchCoverage?.add,
        c.etchCoverage?.exclude
      ];
      for (let l = 0; l < 4; l++) {
        const d = a[l];
        if (!d) continue;
        const u = await P(n, [{ ...c, raster: d }], t, s);
        try {
          const h = u.getContext("2d").getImageData(0, 0, ...n).data;
          for (let p = 0; p < h.length; p += 4)
            i.data[p + l] = Math.max(i.data[p + l], h[p + 3]);
        } finally {
          A(u);
        }
      }
    }
    return A(o), new Uint8Array(i.data.buffer);
  } catch (c) {
    throw A(o), c;
  }
}
class K {
  constructor(e, t) {
    this.textures = e, this.assets = t, this.masks = new Be(e);
  }
  textures;
  assets;
  masks;
  pending = /* @__PURE__ */ new Map();
  compositions = 0;
  async ensure(e, t) {
    const s = this.textures.store.acquire(e);
    if (s) return s;
    let o = this.pending.get(e);
    o || (o = t().then((i) => i.release()).finally(() => this.pending.delete(e)), this.pending.set(e, o)), await o;
    const r = this.textures.store.acquire(e);
    if (!r) throw Error("Prepared working set exceeds GPU budget");
    return r;
  }
  async prepare(e, t) {
    const { recipe: s } = e, o = s.color.size, r = H(e), i = [], c = r.filter((f) => f.stage === "under-art"), a = r.filter((f) => f.stage === "printed-content" || f.stage === "under-finish"), l = r.filter((f) => f.stage === "over-finish"), d = r.filter((f) => f.contributesToEtch), u = r.filter((f) => f.finishCoverage || f.etchCoverage), h = `${s.pack}:`, p = h + JSON.stringify(["color-v1", s.color.key, B([...c, ...a])]), g = h + JSON.stringify(["mask-v1", o, s.edges, s.stamp?.key, B(d)]), m = l.length ? h + JSON.stringify(["over-v1", o, B(l)]) : void 0, w = u.length ? h + JSON.stringify([
      "coverage-v1",
      o,
      u.map((f) => [
        f.clip,
        f.finishCoverage?.add?.key,
        f.finishCoverage?.exclude?.key,
        f.etchCoverage?.add?.key,
        f.etchCoverage?.exclude?.key
      ])
    ]) : void 0, v = s.hologram ? h + JSON.stringify(["hologram-v1", s.hologram.mask.key, s.hologram.mask.size]) : void 0, b = JSON.stringify(
      s.hologram ? [s.hologram.rect, s.hologram.strength, s.hologram.seed ?? 0] : null
    );
    try {
      return i.push(
        await this.ensure(p, async () => {
          const f = c.length ? await P(o, c, this.assets, t) : void 0;
          let y;
          try {
            return y = await C(s.color, this.assets, t, f), await P(o, a, this.assets, t, y), t.throwIfAborted(), this.compositions++, this.textures.upload(p, y);
          } finally {
            f && A(f), y && A(y);
          }
        })
      ), i.push(await this.prepareMask(e, t)), m && i.push(
        await this.ensure(m, async () => {
          const f = await P(o, l, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(m, f);
          } finally {
            A(f);
          }
        })
      ), w && i.push(
        await this.ensure(w, async () => {
          const f = await Pe(o, u, this.assets, t);
          return t.throwIfAborted(), this.textures.uploadBytes(w, f, o);
        })
      ), v && i.push(
        await this.ensure(v, async () => {
          const f = await C(s.hologram.mask, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(v, f, !1);
          } finally {
            A(f);
          }
        })
      ), t.throwIfAborted(), { color: p, mask: g, overlay: m, coverage: w, hologram: v, hologramSettings: b, document: e };
    } finally {
      for (const f of i) f.release();
    }
  }
  async prepareMask(e, t) {
    const { recipe: s } = e, o = s.color.size, r = H(e).filter((a) => a.contributesToEtch), i = `${s.pack}:`, c = i + JSON.stringify(["mask-v1", o, s.edges, s.stamp?.key, B(r)]);
    return this.ensure(c, async () => {
      const a = [], l = [];
      try {
        for (const u of s.edges) {
          const h = i + JSON.stringify([
            "edge-integer-v1",
            u.key,
            u.asset,
            u.importedMask,
            u.threshold
          ]), p = await this.ensure(h, async () => {
            const g = u.importedMask ?? u.asset, m = await this.assets.images([g], t);
            try {
              t.throwIfAborted();
              const w = m.value.get(g.url);
              if (!w) throw Error(`Edge asset unavailable: ${g.url}`);
              return u.importedMask ? this.textures.upload(h, w, !1, 0) : this.textures.edge(h, w, u.threshold);
            } finally {
              m.release();
            }
          });
          l.push(p), a.push({ value: p.value, spec: u });
        }
        for (const u of r) {
          const h = i + JSON.stringify(["contribution-v1", o, B([u])]), p = await this.ensure(h, async () => {
            const g = await P(o, [u], this.assets, t);
            try {
              return t.throwIfAborted(), this.textures.edge(h, g, 20);
            } finally {
              A(g);
            }
          });
          l.push(p), a.push({
            value: p.value,
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
        if (s.stamp) {
          const u = s.stamp, h = i + JSON.stringify(["stamp-v1", u.key]);
          d = await this.ensure(h, async () => {
            const p = await C(u, this.assets, t);
            try {
              return t.throwIfAborted(), this.textures.upload(h, p, !1, 0);
            } finally {
              A(p);
            }
          }), l.push(d);
        }
        return t.throwIfAborted(), this.masks.compose(c, o, a, d?.value);
      } finally {
        for (const d of l) d.release();
      }
    });
  }
  dispose() {
    this.masks.dispose();
  }
}
const O = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
let G;
class Ce {
  constructor(e) {
    if (this.options = e, this.budgets = {
      gpuBytes: 64 * 1024 * 1024,
      cpuBytes: 32 * 1024 * 1024,
      scratchBytes: 16 * 1024 * 1024,
      preparationConcurrency: 2,
      ...e.budgets
    }, !Number.isInteger(this.budgets.preparationConcurrency) || this.budgets.preparationConcurrency < 1 || this.budgets.preparationConcurrency > 4)
      throw RangeError("Preparation concurrency must be 1–4");
    this.assets = new Re(this.budgets.cpuBytes), this.device = new J(e.canvas), this.textures = new Y(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      e.etching
    ), this.preparer = new K(this.textures, e.rasterHost ?? this.assets), e.canvas.addEventListener("webglcontextlost", this.contextLost), e.canvas.addEventListener("webglcontextrestored", this.contextRestored);
  }
  options;
  abiVersion = 1;
  assets;
  device;
  textures;
  preparer;
  scene = new ve();
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
      ye(t), H(t);
      const s = this.documents.get(t.id);
      if (s && t.revision <= s.revision && s !== t)
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
    const t = e.map((s) => ({
      ...s,
      transform: [...s.transform],
      normal: s.normal ? [...s.normal] : void 0,
      deformation: s.deformation ? { ...s.deformation } : void 0,
      wear: s.wear ? { ...s.wear } : void 0,
      cardstock: s.cardstock ? { ...s.cardstock } : void 0,
      printDots: s.printDots ? { ...s.printDots } : void 0
    }));
    for (const s of t)
      if (xe(s), !this.documents.has(s.card)) throw Error(`Unknown card ${s.card}`);
    this.scene.update(
      Uint32Array.from(t, (s) => s.id),
      Float32Array.from(t.flatMap((s) => s.transform)),
      Int32Array.from(t, (s) => s.order ?? 0)
    ), this.instances = t;
  }
  plan(e) {
    return this.shapeData.length !== this.instances.length * 4 && (this.shapeData = new Float32Array(this.instances.length * 4)), this.instances.forEach((t, s) => {
      const o = (this.prepared.get(t.card)?.document ?? this.documents.get(t.card)).recipe, r = s * 4;
      this.shapeData[r] = o.color.size[1] / o.color.size[0], this.shapeData[r + 1] = o.cornerRadius, this.shapeData[r + 2] = t.deformation?.amount ?? 0, this.shapeData[r + 3] = V(t.id);
    }), this.scene.plan_shaped(e.viewProjection, this.shapeData, e.time ?? 0);
  }
  ready(e, t, s) {
    this.assertLive();
    const o = this.documents.get(e);
    if (!o || o.revision !== t)
      return Promise.reject(Error("Requested revision is not current"));
    this.failed.delete(o);
    const r = this.enqueue(o);
    return s ? new Promise((i, c) => {
      if (s.aborted) {
        c(s.reason);
        return;
      }
      const a = () => c(s.reason);
      s.addEventListener("abort", a, { once: !0 }), r.then(i, c).finally(() => s.removeEventListener("abort", a));
    }) : r;
  }
  enqueue(e) {
    const t = this.jobs.get(e.id);
    if (t) return t.promise;
    let s, o;
    const r = new Promise((c, a) => {
      s = c, o = a;
    }), i = {
      document: e,
      controller: new AbortController(),
      promise: r,
      resolve: s,
      reject: o,
      started: !1
    };
    return this.jobs.set(e.id, i), queueMicrotask(() => this.pump()), r;
  }
  pump() {
    if (!(this.disposed || this.lost))
      for (const e of this.jobs.values()) {
        if (this.active >= this.budgets.preparationConcurrency) break;
        if (e.started) continue;
        e.started = !0, this.active++, this.preparer.prepare(e.document, e.controller.signal).then((s) => {
          if (e.controller.signal.throwIfAborted(), this.documents.get(e.document.id) !== e.document)
            throw Error("Superseded preparation");
          this.prepared.set(e.document.id, s), e.resolve(), this.options.invalidate?.();
        }).catch((s) => {
          e.controller.signal.aborted || this.failed.add(e.document), e.reject(s);
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
    const s = (l) => {
      if (!l) return;
      const d = this.textures.store.acquire(l);
      return d && t.push(d), d?.value;
    }, o = s(e.color), r = s(e.mask), i = s(e.overlay), c = s(e.coverage), a = s(e.hologram);
    return o && r && (!e.overlay || i) && (!e.coverage || c) && (!e.hologram || a) ? {
      face: o,
      mask: r,
      overlay: i,
      coverage: c,
      hologram: a,
      hologramSettings: e.hologramSettings,
      recipe: e.document.recipe
    } : null;
  }
  render(e) {
    if (this.assertLive(), Ae(e), this.lost) return this.metrics;
    const t = performance.now(), s = this.plan(e), o = [];
    this.lastFrame = e, this.device.begin(e), this.visible = s.length;
    const r = /* @__PURE__ */ new Map(), i = (c) => {
      const a = this.textures.store.acquire("scene:" + c.raster.key);
      if (!a) {
        !this.sceneLayerPending && !this.sceneLayerFailure && this.setSceneLayers(this.sceneLayers).catch(this.options.onError ?? console.error);
        return;
      }
      o.push(a), this.device.drawLayer(
        c,
        a.value,
        c.stage === "hud" ? { ...e, viewProjection: O } : e
      );
    };
    try {
      this.sceneLayers.filter((d) => d.stage === "world-under-cards").forEach(i);
      let c = [], a = null;
      const l = () => {
        a && c.length && this.device.draw(a, e, c), c = [];
      };
      for (const d of s) {
        const u = this.instances[d];
        let h = r.get(u.card);
        if (h === void 0) {
          const p = this.prepared.get(u.card), g = this.documents.get(u.card);
          h = p ? this.material(p, o) : null, r.set(u.card, h), (!h || p?.document !== g) && !this.jobs.has(g.id) && !this.failed.has(g) && this.enqueue(g).catch((m) => {
            m instanceof DOMException && m.name === "AbortError" || this.options.onError?.(m);
          });
        }
        h !== a && (!h || !a || h.face !== a.face || h.mask !== a.mask || h.overlay !== a.overlay || h.coverage !== a.coverage || h.hologram !== a.hologram || h.hologramSettings !== a.hologramSettings || h.recipe.cornerRadius !== a.recipe.cornerRadius || h.recipe.finishCoverageBase !== a.recipe.finishCoverageBase || h.recipe.overlayFoil?.tone !== a.recipe.overlayFoil?.tone || h.recipe.overlayFoil?.strength !== a.recipe.overlayFoil?.strength || JSON.stringify(h.recipe.artWindows) !== JSON.stringify(a.recipe.artWindows)) && (l(), a = h), h && c.push(u);
      }
      l();
      for (const d of ["world-interleaved", "scene-overlay", "hud"])
        this.sceneLayers.filter((u) => u.stage === d).forEach(i);
    } finally {
      for (const c of o) c.release();
      this.device.end();
    }
    return this.frameMs = performance.now() - t, this.metrics;
  }
  async setSceneLayers(e) {
    if (this.assertLive(), this.lost) throw Error("Graphics context is lost");
    if (new Set(e.map((a) => a.id)).size !== e.length)
      throw Error("Duplicate scene layer ID");
    for (const a of e) Fe(a);
    const t = e.map((a) => ({ ...a, transform: [...a.transform] })), s = ++this.sceneLayerGeneration, o = this.epoch, r = this.textures, i = [];
    this.sceneLayerFailure = !1, this.sceneLayerPending++;
    const c = () => {
      if (this.disposed || this.lost || this.epoch !== o || s !== this.sceneLayerGeneration)
        throw new DOMException("Stale scene layer preparation", "AbortError");
    };
    try {
      for (const a of t) {
        const l = "scene:" + a.raster.key, d = r.store.acquire(l);
        if (d) {
          i.push(d);
          continue;
        }
        const u = await C(
          a.raster,
          this.options.rasterHost ?? this.assets,
          new AbortController().signal
        );
        try {
          c(), i.push(r.upload(l, u, !1));
        } finally {
          A(u);
        }
      }
      c(), this.sceneLayers = t.sort((a, l) => a.order - l.order || a.id.localeCompare(l.id)), this.options.invalidate?.();
    } catch (a) {
      throw s === this.sceneLayerGeneration && (this.sceneLayerFailure = !0), a;
    } finally {
      for (const a of i) a.release();
      this.sceneLayerPending--;
    }
  }
  hitTest(e, t) {
    const s = this.options.canvas.getBoundingClientRect(), o = this.scene.hit(e / s.width * 2 - 1, 1 - t / s.height * 2);
    if (!o.length) return null;
    const [r, i, c] = o, a = this.instances.find((u) => u.id === r), d = this.prepared.get(a.card)?.document.recipe?.regions.filter((u) => {
      const [h, p, g, m] = u.rect;
      return i >= h && c >= p && i <= h + g && c <= p + m;
    }).sort((u, h) => u.rect[2] * u.rect[3] - h.rect[2] * h.rect[3])[0]?.id;
    return { instance: r, card: a.card, uv: [i, c], part: d ?? null };
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
    this.documents.clear(), this.prepared.clear(), this.sceneLayers = [], this.sceneLayerFailure = !1, this.failed = /* @__PURE__ */ new WeakSet(), this.instances = [], this.device.resetMotion(), this.scene.update(new Uint32Array(), new Float32Array(), new Int32Array()), this.textures.store.clear(), this.assets.clear(), this.lost || this.device.begin({ viewProjection: O });
  }
  contextLost = (e) => {
    e.preventDefault(), this.lost = !0;
    for (const t of this.jobs.keys()) this.cancel(t);
    this.prepared.clear(), this.sceneLayerGeneration++, this.preparer.dispose(), this.textures.store.clear(), this.textures.etcher.dispose(), this.device.dispose();
  };
  contextRestored = () => {
    if (this.disposed) return;
    this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.device = new J(this.options.canvas), this.textures = new Y(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      this.options.etching
    ), this.preparer = new K(this.textures, this.options.rasterHost ?? this.assets), this.lost = !1, this.failed = /* @__PURE__ */ new WeakSet();
    const e = this.sceneLayers;
    this.sceneLayers = [], this.setSceneLayers(e).catch(this.options.onError ?? console.error), this.options.invalidate?.(), this.pump();
  };
  async exportCard(e, t) {
    Q(t.deformation), await this.ready(e, t.revision);
    const s = this.documents.get(e);
    if (s.revision !== t.revision) throw Error("Export revision changed");
    const o = this.options.canvas, r = [o.width, o.height], i = this.instances, c = this.sceneLayers, a = this.lastFrame;
    if (!Number.isInteger(t.width) || t.width < 1 || t.width > 2048)
      throw RangeError("Invalid export size");
    let l;
    const d = be(t.deformation, t.width), u = this.device.isolateMotion();
    try {
      o.width = t.width, o.height = Math.round(
        t.width * s.recipe.color.size[1] / s.recipe.color.size[0]
      ), this.sceneLayers = [], this.updateScene([
        {
          id: t.instanceId ?? 0,
          card: e,
          finish: t.finish,
          normal: t.normal,
          rainFog: t.rainFog,
          wear: t.wear,
          cardstock: t.cardstock,
          printDots: t.printDots,
          deformation: t.deformation,
          transform: [2 * d, 0, 0, 0, 0, -2 * d, 0, 0, 0, 0, 1, 0, -d, d, 0, 1]
        }
      ]), this.render({
        viewProjection: O,
        pointer: t.pointer,
        lighting: t.lighting,
        time: t.time ?? a?.time
      }), l = new Promise(
        (h, p) => o.toBlob(
          (g) => g ? h(g) : p(Error("Export failed")),
          "image/png"
        )
      );
    } finally {
      u(), o.width = r[0], o.height = r[1], this.sceneLayers = c, this.updateScene(i), a && this.render(a);
    }
    return l;
  }
  dispose() {
    if (!this.disposed) {
      for (const e of this.jobs.keys()) this.cancel(e);
      this.disposed = !0, this.sceneLayerGeneration++, this.lost || this.device.begin({ viewProjection: O }), this.options.canvas.removeEventListener("webglcontextlost", this.contextLost), this.options.canvas.removeEventListener("webglcontextrestored", this.contextRestored), this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.assets.dispose(), this.scene.free();
    }
  }
}
async function Oe(n) {
  G ??= we(n ? { module_or_path: n } : void 0).catch((e) => {
    throw G = void 0, e;
  }), await G;
}
async function Xe(n) {
  return await Oe(n.wasmUrl), new Ce(n);
}
export {
  ke as C,
  T as D,
  O as I,
  De as P,
  Ce as R,
  W as S,
  Y as T,
  Ue as a,
  z as b,
  Xe as c,
  ye as d,
  Pe as e,
  K as f,
  Oe as i,
  H as l,
  He as p,
  V as s,
  Ee as v
};
