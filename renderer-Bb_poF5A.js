import { v as ie, f as oe, c as ae } from "./asset-fetch-my9kgRsJ.js";
import { R as ne, p as R, b as ce, t as _, G as he, c as de, P as le, C as ue, v as N, d as fe, h as pe, e as ge, g as me, i as ve, j as we, k as be, _ as ye } from "./shaders-BThdCOAX.js";
import { c as H, a as A } from "./canvas-raster-DIqHyOj6.js";
const V = (n) => (Math.imul(n + 1, 1597334677) >>> 0) % 65536 / 65536;
function Z(n) {
  if (n && (n.kind !== "heat" || !Number.isFinite(n.amount) || n.amount < 0 || n.amount > 0.02))
    throw RangeError("Heat deformation amount must be between 0 and 0.02");
}
function Ee(n, e) {
  return n?.amount ? e / (e + 4) / (1 + 2 * n.amount) : 1;
}
function U(n) {
  return Number.isInteger(n) && n >= 0 && n <= 4294967295;
}
function L(n) {
  if (n.length !== 4 || n.some((e) => !Number.isFinite(e)) || n[2] <= 0 || n[3] <= 0)
    throw Error("Invalid normalized rectangle");
}
function M(n) {
  if (!n.key || n.key.length > 131072) throw Error("Invalid raster key");
  const [e, t] = n.size;
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 1 || t < 1 || e * t > 4194304)
    throw Error("Invalid raster size");
}
function xe(n) {
  if (!U(n.id) || !Number.isSafeInteger(n.revision) || n.revision < 0)
    throw Error("Invalid card identity");
  const e = n.recipe;
  if (M(e.color), e.stamp && M(e.stamp), !e.pack || e.artWindows.length > 8 || e.edges.length > 32)
    throw Error("Invalid recipe or too many regions");
  if (!Number.isFinite(e.cornerRadius) || e.cornerRadius < 0 || e.cornerRadius > 0.5)
    throw Error("Invalid corner radius");
  const t = e.finishCoverageBase ?? 1;
  if (!Number.isFinite(t) || t < 0 || t > 1) throw Error("Invalid base coverage");
  if (e.overlayFoil) {
    const { tone: r, strength: o } = e.overlayFoil;
    if (!["gold", "silver", "prismatic"].includes(r) || !Number.isFinite(o) || o < 0 || o > 1)
      throw Error("Invalid overlay foil");
  }
  if (e.hologram) {
    const { mask: r, rect: o, strength: s, seed: i = 0 } = e.hologram;
    if (M(r), L(o), !Number.isFinite(s) || s < 0 || s > 1 || !U(i))
      throw Error("Invalid hologram material");
  }
  e.artWindows.forEach(L), e.regions.forEach((r) => L(r.rect));
  for (const r of e.edges) {
    if (r.fit !== void 0 && ie(r.fit), L(r.crop), L(r.destination), L(r.clip), r.crop[0] < 0 || r.crop[1] < 0 || r.crop[0] + r.crop[2] > 1.000001 || r.crop[1] + r.crop[3] > 1.000001)
      throw Error("Crop leaves the source image");
    if (!Number.isInteger(r.threshold) || r.threshold < 0 || r.threshold > 255 || ![-90, 0, 90].includes(r.rotation ?? 0))
      throw Error("Invalid edge recipe");
  }
  for (const r of n.layers ?? []) {
    if (M(r.raster), r.clip && L(r.clip), !Number.isInteger(r.order) || Math.abs(r.order) > 2147483647)
      throw Error("Invalid layer order");
    for (const o of [
      r.finishCoverage?.add,
      r.finishCoverage?.exclude,
      r.etchCoverage?.add,
      r.etchCoverage?.exclude
    ])
      o && M(o);
  }
}
function Ae(n) {
  if (n?.artwork !== void 0 && typeof n.artwork != "boolean")
    throw Error("Invalid print dot artwork option");
  if (n?.inset !== void 0 && (!Number.isFinite(n.inset) || n.inset < 0 || n.inset > 0.2))
    throw Error("Invalid print dot inset");
  if (n?.variation !== void 0 && (!Number.isFinite(n.variation) || n.variation < 0 || n.variation > 1))
    throw Error("Invalid print dot variation");
  if (n && (n.amount !== void 0 && (!Number.isFinite(n.amount) || n.amount < 0 || n.amount > 1) || n.period !== void 0 && (!Number.isFinite(n.period) || n.period < 2 || n.period > 16)))
    throw Error("Invalid print dots");
}
function Fe(n) {
  if (n.rainFog !== void 0 && (!Number.isFinite(n.rainFog) || n.rainFog < 0 || n.rainFog > 2))
    throw Error("Invalid rain fog density");
  if (Ae(n.printDots), n.cardstock && (!Number.isFinite(n.cardstock.amount) || n.cardstock.amount < 0 || n.cardstock.amount > 1))
    throw Error("Invalid cardstock amount");
  if (Z(n.deformation), n.wear && (!Number.isFinite(n.wear.amount) || n.wear.amount < 0 || n.wear.amount > 1 || n.wear.seed !== void 0 && !U(n.wear.seed)))
    throw Error("Invalid wear amount or seed");
  if (!U(n.id) || !U(n.card) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
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
function Te(n) {
  if (n.lighting !== void 0 && !["pointer", "studio"].includes(n.lighting))
    throw Error("Invalid lighting model");
  if (!Number.isFinite(n.time ?? 0) || (n.time ?? 0) < 0)
    throw Error("Frame time must be finite, nonnegative seconds");
  if (n.hover && (!U(n.hover.instance) || n.hover.uv.length !== 2 || n.hover.uv.some((e) => !Number.isFinite(e) || e < 0 || e > 1)))
    throw Error("Invalid card-local hover");
}
function Re(n) {
  if (M(n.raster), !n.id || !Number.isInteger(n.order) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid scene layer");
  if (!["world-under-cards", "world-interleaved", "scene-overlay", "hud"].includes(n.stage) || !["test-write", "test-readonly", "ignore"].includes(n.depth))
    throw Error("Invalid scene layer stage or depth");
  if (["scene-overlay", "hud"].includes(n.stage) && n.depth !== "ignore")
    throw Error("Overlay/HUD layers must ignore depth");
}
class ee {
  constructor(e, t) {
    if (this.destroy = t, !Number.isSafeInteger(e) || e < 1 || e > 4294967295)
      throw RangeError("Invalid cache budget");
    this.policy = new ne(e);
  }
  destroy;
  policy;
  resources = /* @__PURE__ */ new Map();
  generation = 0;
  acquire(e) {
    const t = this.policy.lookup(e);
    return t === void 0 ? null : this.lease(t);
  }
  insert(e, t, r) {
    if (!Number.isSafeInteger(r) || r < 1 || r > 4294967295)
      throw this.destroy(t), RangeError("Invalid resource size");
    let o;
    try {
      o = JSON.parse(this.policy.admit(e, r, 1));
    } catch (s) {
      throw this.destroy(t), s;
    }
    for (const s of o.evicted) {
      const i = this.resources.get(s);
      i !== void 0 && this.destroy(i), this.resources.delete(s);
    }
    return this.resources.has(o.handle) ? this.destroy(t) : this.resources.set(o.handle, t), this.lease(o.handle);
  }
  /** Admit and evict before allocating a GPU object, so a miss does not
   * temporarily duplicate the resident cache's entire working set. */
  create(e, t, r, o = 1) {
    if (!Number.isSafeInteger(t) || t < 1 || t > 4294967295)
      throw RangeError("Invalid resource size");
    const s = JSON.parse(
      this.policy.admit(e, t, o)
    );
    for (const i of s.evicted) {
      const c = this.resources.get(i);
      c !== void 0 && this.destroy(c), this.resources.delete(i);
    }
    if (this.resources.has(s.handle)) return this.lease(s.handle);
    try {
      return this.resources.set(s.handle, r()), this.lease(s.handle);
    } catch (i) {
      throw this.policy.remove(s.handle), i;
    }
  }
  lease(e) {
    const t = this.resources.get(e);
    if (t === void 0) throw Error("Resource ownership mismatch");
    this.policy.pin(e, !0);
    const r = this.generation;
    let o = !1;
    return {
      value: t,
      release: () => {
        o || (o = !0, r === this.generation && this.policy.pin(e, !1));
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
async function Ie(n, e) {
  const t = await oe(n.url, { mode: "cors", signal: e });
  if (!t.ok) throw Error(`Asset ${t.status}: ${n.url}`);
  const r = await t.blob();
  if (!r.type.includes("svg"))
    return createImageBitmap(
      r,
      n.width ? { resizeWidth: n.width, resizeQuality: "high" } : {}
    );
  const o = new DOMParser().parseFromString(await r.text(), "image/svg+xml"), s = o.documentElement;
  if (s.localName !== "svg" || o.querySelector("parsererror")) throw Error("Invalid SVG");
  const i = (s.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), c = i[2] ?? Number.parseFloat(s.getAttribute("width") ?? ""), a = i[3] ?? Number.parseFloat(s.getAttribute("height") ?? "");
  if (!(c > 0 && a > 0 && Number.isFinite(c + a))) throw Error("SVG needs finite dimensions");
  const l = (n.width ?? 512) / Math.max(c, a);
  s.hasAttribute("viewBox") || s.setAttribute("viewBox", `0 0 ${c} ${a}`), s.setAttribute("width", String(Math.max(1, Math.round(c * l)))), s.setAttribute("height", String(Math.max(1, Math.round(a * l))));
  const d = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(s)], { type: "image/svg+xml" })
  ), u = new Image();
  try {
    return u.src = d, await u.decode(), await createImageBitmap(u);
  } finally {
    u.src = "", URL.revokeObjectURL(d);
  }
}
class Le {
  store;
  pending = /* @__PURE__ */ new Map();
  active = 0;
  waiting = [];
  disposed = !1;
  generation = 0;
  controllers = /* @__PURE__ */ new Set();
  decodes = 0;
  constructor(e) {
    this.store = new ee(e, (t) => t.close());
  }
  async reserve() {
    return this.active >= 4 ? await new Promise((e) => this.waiting.push(e)) : this.active++, () => {
      const e = this.waiting.shift();
      e ? e() : this.active--;
    };
  }
  async image(e, t) {
    if (t.throwIfAborted(), this.disposed) throw Error("Asset store disposed");
    const r = JSON.stringify([e.url, e.width, e.revision]);
    let o = this.store.acquire(r);
    if (o) return o;
    let s = this.pending.get(r);
    if (!s) {
      const i = this.generation, c = new AbortController();
      this.controllers.add(c), s = (async () => {
        const a = await this.reserve();
        try {
          if (this.disposed || i !== this.generation) throw Error("Asset scope changed");
          const l = await Ie(e, c.signal);
          if (this.decodes++, this.disposed || i !== this.generation)
            throw l.close(), Error("Asset scope changed");
          this.store.insert(r, l, l.width * l.height * 4).release();
        } finally {
          a(), this.controllers.delete(c), i === this.generation && this.pending.delete(r);
        }
      })(), this.pending.set(r, s);
    }
    if (await s, t.throwIfAborted(), o = this.store.acquire(r), !o) throw Error("Decoded working set exceeds CPU budget");
    return o;
  }
  async images(e, t) {
    const r = [], o = /* @__PURE__ */ new Map(), s = await Promise.allSettled(
      e.map(async (a) => {
        const l = await this.image(a, t);
        r.push(l), o.set(a.url, l.value);
      })
    ), i = () => {
      for (const a of r) a.release();
      o.clear();
    }, c = s.find((a) => a.status === "rejected");
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
function te(n, e) {
  const t = Math.min(2047, Math.max(0, Math.round((n / 0.24 + 0.5) * 2047))), r = Math.min(0.9995, Math.max(5e-4, e / 0.24 + 0.5));
  return 1 + t + r;
}
function j(n, e, t, r) {
  for (let o = 1; o <= 4; o++) {
    const s = (n.activeRipple + o) % 4, i = 4 + s * 4;
    if (!(n.data[i + 3] > 0 && e - n.data[i + 2] < 2.25))
      return n.activeRipple = s, n.segStart = [t, r], n.segTime = e, n.data.set([t, r, e, te(0, 0)], i), !0;
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
    const r = e.finish ?? "regular";
    if (r !== "rain" && r !== "heat" && r !== "pool" && !e.deformation)
      return null;
    const o = t.time ?? 0, s = e.transform, i = e.normal ?? [0, 0, 1], c = [s[12], s[13], i[0], i[1]];
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
            const y = a.segStart[0] + w, E = a.segStart[1] + v, S = a.segTime + f * 0.45;
            a.data.set([y, E, S, te(w, v)], 4 + a.activeRipple * 4);
          }
      }
    }
    if (d || (a.emitting = !1), l > 0) {
      const u = [Math.hypot(s[0], s[1], s[2]), Math.hypot(s[4], s[5], s[6])];
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
const x = 192, D = 512, ke = `#version 300 es
precision highp float;
uniform float time;
out vec2 incoming;
${ce}
void main(){
 // Include a skirt around the periodic tile: rays from outside can land inside.
 vec2 p=vec2(gl_VertexID%${x + 1},gl_VertexID/${x + 1})/${x}.*2.4-.2;
 vec3 wave=waterField(p,time);
 vec3 normal=normalize(vec3(-wave.xy,1.));
 vec3 ray=refract(vec3(0.,0.,-1.),normal,1./1.333);
 vec2 floorPoint=p+ray.xy/(-ray.z)*(waterDepth+wave.z);
 incoming=p;
 gl_Position=vec4(floorPoint/waterPeriod*2.-1.,0.,1.);
}`, De = `#version 300 es
precision highp float;
in vec2 incoming;out vec4 color;
void main(){
 // Each fragment receives the area of its source light footprint. Overlapping
 // folds accumulate by additive blending; expanded footprints become darker.
 vec2 dx=dFdx(incoming),dy=dFdy(incoming);
 float flux=abs(dx.x*dy.y-dx.y*dy.x)*${(D / 2) ** 2}.;
 color=vec4(min(flux,8.)/8.,0.,0.,1.);
}`;
class _e {
  constructor(e) {
    if (this.gl = e, this.shader = R(e, De, ke), this.clock = e.getUniformLocation(this.shader, "time"), this.map = _(e, D, D), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.REPEAT), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.REPEAT), this.framebuffer = e.createFramebuffer(), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.map, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
      throw e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteProgram(this.shader), Error("Caustics framebuffer is incomplete");
    this.vao = e.createVertexArray(), this.indices = e.createBuffer(), e.bindVertexArray(this.vao), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indices);
    const t = new Uint16Array(x * x * 6);
    for (let r = 0; r < x; r++)
      for (let o = 0; o < x; o++) {
        const s = r * (x + 1) + o, i = s + x + 1;
        t.set([s, s + 1, i, i, s + 1, i + 1], (r * x + o) * 6);
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
function re(n, e) {
  let t = 0, r = n, o = e;
  for (; ; ) {
    if (t += r * o * 4, r === 1 && o === 1) return t;
    r = Math.max(1, Math.floor(r / 2)), o = Math.max(1, Math.floor(o / 2));
  }
}
class q {
  constructor(e, t, r, o = "gpu") {
    this.gl = e, this.scratchLimit = r, this.mode = o, this.store = new ee(t, (s) => e.deleteTexture(s.texture)), this.etcher = new he(e);
  }
  gl;
  scratchLimit;
  mode;
  store;
  etcher;
  kernels = new de();
  uploads = 0;
  edgeBuilds = 0;
  readbacks = 0;
  upload(e, t, r = !0, o = 1) {
    const s = this.store.acquire(e);
    if (s) return s;
    const i = this.gl, c = t.width, a = t.height;
    return this.store.create(
      e,
      r ? re(c, a) : c * a * 4,
      () => {
        const l = _(i, c, a, r ? i.SRGB8_ALPHA8 : i.RGBA8, i.RGBA);
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
        return i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1), r && (i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.LINEAR_MIPMAP_LINEAR), i.generateMipmap(i.TEXTURE_2D)), this.uploads++, { texture: l, width: c, height: a, mipmapped: r };
      },
      o
    );
  }
  edge(e, t, r) {
    const o = this.store.acquire(e);
    if (o) return o;
    const s = this.gl, i = t.width, c = t.height;
    if (i * c * 7 > this.scratchLimit) throw Error("Etching exceeds scratch budget");
    return this.store.create(
      e,
      i * c,
      () => {
        let a;
        if (this.mode === "gpu") a = this.etcher.run(t, i, c, r);
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
              r
            ), p = new Uint8Array(h.length);
            for (let g = 0; g < c; g++)
              p.set(h.subarray(g * i, (g + 1) * i), (c - 1 - g) * i);
            a = _(s, i, c), s.bindTexture(s.TEXTURE_2D, a), s.pixelStorei(s.UNPACK_ALIGNMENT, 1), s.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, i, c, s.RED, s.UNSIGNED_BYTE, p);
          } finally {
            l.width = l.height = 0;
          }
        }
        return this.uploads++, this.edgeBuilds++, { texture: a, width: i, height: c };
      },
      0
    );
  }
  uploadBytes(e, t, r) {
    const o = this.store.acquire(e);
    if (o) return o;
    const s = this.gl, [i, c] = r, a = new Uint8Array(t.length);
    for (let l = 0; l < c; l++)
      a.set(t.subarray(l * i * 4, (l + 1) * i * 4), (c - 1 - l) * i * 4);
    return this.store.create(e, i * c * 4, () => {
      const l = _(s, i, c, s.RGBA8, s.RGBA);
      return s.bindTexture(s.TEXTURE_2D, l), s.pixelStorei(s.UNPACK_ALIGNMENT, 1), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1), s.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, i, c, s.RGBA, s.UNSIGNED_BYTE, a), this.uploads++, { texture: l, width: i, height: c };
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
const Se = 732;
function Me(n, e = T.period) {
  if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(e) || e < 2 || e > 16)
    throw RangeError("Invalid print-dot period or face width");
  return e * n / Se;
}
const T = Object.freeze({
  amount: 0.35,
  period: 2,
  variation: 0.5,
  inset: 0.035,
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
function se(n) {
  const e = new Float32Array(32);
  return n.forEach(([t, r, o, s], i) => e.set([t, 1 - r - s, t + o, 1 - r], i * 4)), e;
}
const Ue = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`, Ne = `#version 300 es
#define PRINT_DOT_ART_WINDOWS
#define GLINT_PRINT_FACE(uv) textureLod(face,uv,0.)
precision highp float;
in vec2 uv;out vec4 color;uniform sampler2D face;
vec3 previewInk(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 previewLinear(vec3 c){return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c));}
${le.replace("flat in vec4 printDotsInfo;", "uniform vec4 printDotsInfo;")}
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
}`, $ = 16 * 1024 * 1024, J = (n) => re(n.width, n.height), Y = (n, e) => 1 / Me(n.width, e) >= 0.9;
class Be {
  constructor(e) {
    this.gl = e, this.shader = R(e, Ne, Ue), this.framebuffer = e.createFramebuffer(), this.vao = e.createVertexArray();
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
  /** Protect the active working set. Overflow uses the existing procedural path
   * instead of evicting and rebuilding the same printing on every frame. */
  beginFrame() {
    this.frame++;
  }
  prepare(e, t, r, o = []) {
    const s = z(r);
    if (e.mipmapped && (!t || t.mipmapped) && (s[0] <= 0 || Y(e, s[1]) && (!t || Y(t, s[1])))) {
      const h = this.invisible.get(e.texture);
      if (h && h.overlay?.texture === t?.texture) return h;
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
    const i = r.artwork !== !1, c = JSON.stringify([s, i, i ? [] : o]), a = this.entries.findIndex(
      (h) => h.source.texture === e.texture && h.overlay?.texture === t?.texture && h.settings === c
    );
    if (a >= 0) {
      const h = this.entries.splice(a, 1)[0];
      return h.lastFrame = this.frame, this.entries.push(h), h;
    }
    const l = J(e) + (t ? J(t) : 0);
    if (l > $) return;
    for (; this.bytes + l > $; ) {
      const h = this.entries.findIndex(
        (g) => this.frame === 0 || g.lastFrame < this.frame - 1
      );
      if (h < 0) return;
      const p = this.entries.splice(h, 1)[0];
      this.release(p);
    }
    let d, u;
    try {
      d = this.paint(e, s, o, i), t && (u = this.paint(t, s, o, i));
      const h = { source: e, overlay: t, settings: c, face: d, top: u, bytes: l, lastFrame: this.frame };
      return this.entries.push(h), this.bytes += l, h;
    } catch (h) {
      throw this.gl.deleteTexture(d?.texture ?? null), this.gl.deleteTexture(u?.texture ?? null), h;
    }
  }
  /** Uncached native preparation. The caller owns and deletes the returned texture. */
  paint(e, t, r = [], o = !0) {
    const s = this.gl, i = e.width, c = e.height, a = _(s, i, c, s.SRGB8_ALPHA8, s.RGBA);
    try {
      if (s.bindFramebuffer(s.FRAMEBUFFER, this.framebuffer), s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, a, 0), s.checkFramebufferStatus(s.FRAMEBUFFER) !== s.FRAMEBUFFER_COMPLETE)
        throw Error("Printed ink framebuffer is incomplete");
      return s.viewport(0, 0, i, c), s.disable(s.DEPTH_TEST), s.disable(s.CULL_FACE), s.disable(s.SCISSOR_TEST), s.disable(s.BLEND), s.disable(s.DITHER), s.colorMask(!0, !0, !0, !0), s.useProgram(this.shader), s.bindVertexArray(this.vao), s.activeTexture(s.TEXTURE0), s.bindTexture(s.TEXTURE_2D, e.texture), s.uniform1i(s.getUniformLocation(this.shader, "face"), 0), s.uniform4fv(s.getUniformLocation(this.shader, "printDotsInfo"), t), s.uniform4fv(
        s.getUniformLocation(this.shader, "printArtBounds[0]"),
        se(r)
      ), s.uniform1f(s.getUniformLocation(this.shader, "printArtwork"), o ? 1 : 0), s.drawArrays(s.TRIANGLES, 0, 3), this.passes++, s.bindTexture(s.TEXTURE_2D, a), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.LINEAR_MIPMAP_LINEAR), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.LINEAR), s.generateMipmap(s.TEXTURE_2D), { texture: a, width: i, height: c };
    } catch (l) {
      throw s.deleteTexture(a), l;
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
const Pe = {
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
class K {
  constructor(e) {
    this.canvas = e;
    const t = e.getContext("webgl2", {
      alpha: !0,
      antialias: !0,
      premultipliedAlpha: !1,
      preserveDrawingBuffer: !0
    });
    if (!t) throw Error("WebGL2 is required");
    this.gl = t, this.caustics = new _e(t), this.cardstock = new ue(t), this.printedInk = new Be(t), this.foil = R(t, fe, N), this.holographic = R(t, pe, N), this.procedural = R(t, ge, N), this.proceduralHolographic = R(t, me, N), this.image = R(t, ve, N), this.vao = t.createVertexArray(), this.quad = t.createBuffer(), this.instances = t.createBuffer(), this.blank = _(t, 1, 1, t.RGBA8, t.RGBA), t.bindTexture(t.TEXTURE_2D, this.blank), t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)), t.bindVertexArray(this.vao), t.bindBuffer(t.ARRAY_BUFFER, this.quad), t.bufferData(
      t.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      t.STATIC_DRAW
    ), t.enableVertexAttribArray(0), t.vertexAttribPointer(0, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, this.instances);
    for (let r = 0; r < 4; r++)
      t.enableVertexAttribArray(1 + r), t.vertexAttribPointer(1 + r, 4, t.FLOAT, !1, F * 4, r * 16), t.vertexAttribDivisor(1 + r, 1);
    t.enableVertexAttribArray(5), t.vertexAttribPointer(5, 3, t.FLOAT, !1, F * 4, 64), t.vertexAttribDivisor(5, 1), t.enableVertexAttribArray(6), t.vertexAttribPointer(6, 1, t.FLOAT, !1, F * 4, 76), t.vertexAttribDivisor(6, 1);
    for (let r = 7; r <= 11; r++)
      t.enableVertexAttribArray(r), t.vertexAttribPointer(r, 4, t.FLOAT, !1, F * 4, 80 + (r - 7) * 16), t.vertexAttribDivisor(r, 1);
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
    let r = this.uniforms.get(e);
    return r || this.uniforms.set(e, r = /* @__PURE__ */ new Map()), r.has(t) || r.set(t, this.gl.getUniformLocation(e, t)), r.get(t);
  }
  bind(e, t, r, o = !1) {
    const s = this.gl;
    s.useProgram(e), s.bindVertexArray(this.vao), s.bindBuffer(s.ARRAY_BUFFER, this.instances);
    const i = r.length * F;
    this.staging.length < i && (this.staging = new Float32Array(i));
    const c = this.staging;
    if (r.forEach((a, l) => {
      const d = l * F;
      c.set(a.transform, d), c.set(a.normal ?? [0, 0, 1], d + 16), c[d + 19] = Pe[a.finish ?? "regular"];
      const u = this.motion.sample(a, t);
      u ? c.set(u, d + 20) : c.fill(0, d + 20, d + F), c[d + 22] = V(a.id), c[d + 23] = a.deformation?.amount ?? 0, c[d + 40] = a.wear?.amount ?? 0, c[d + 41] = V(a.wear?.seed ?? a.id), c[d + 42] = a.cardstock?.amount ?? 0;
      const h = a.printDots;
      c[d + 43] = o || !h ? 0 : h.amount ?? T.amount, c[d + 44] = h?.period ?? T.period, c[d + 45] = h?.variation ?? T.variation, c[d + 46] = h?.inset ?? T.inset, c[d + 47] = a.rainFog ?? 1, c[d + 48] = a.printDots?.artwork === !1 ? 0 : 1;
    }), this.instanceCapacity < i && (this.instanceCapacity = i, s.bufferData(s.ARRAY_BUFFER, i * 4, s.DYNAMIC_DRAW)), s.bufferSubData(s.ARRAY_BUFFER, 0, c, 0, i), this.frameUniforms.get(e) !== t) {
      s.uniformMatrix4fv(this.uniform(e, "viewProjection"), !1, t.viewProjection);
      const a = t.lighting === "studio" ? [0.5, 0.5] : t.pointer ?? [0.5, 0.5];
      s.uniform2f(this.uniform(e, "pointer"), a[0], 1 - a[1]), s.uniform1f(this.uniform(e, "surfaceTime"), t.time ?? 0), s.uniform1f(this.uniform(e, "studioLighting"), t.lighting === "studio" ? 1 : 0), this.frameUniforms.set(e, t);
    }
  }
  draw(e, t, r) {
    const o = this.gl;
    r.some((f) => f.finish === "pool") && this.caustics.prepare(t.time ?? 0), r.some(
      (f) => f.finish && f.finish !== "regular" && (f.cardstock?.amount ?? 0) > 0
    ) && this.cardstock.prepare();
    const s = r[0]?.printDots, i = z(s), a = s && i[0] > 0 && (r.length === 1 || r.every(
      (f) => z(f.printDots).every((y, E) => y === i[E]) && f.printDots?.artwork !== !1 == (s.artwork !== !1)
    )) ? this.printedInk.prepare(
      e.face,
      e.overlay,
      s,
      e.recipe.artWindows
    ) : void 0, l = !a && r.some(
      (f) => f.printDots && (f.printDots.amount ?? T.amount) > 0
    ), d = e.recipe.hologram?.strength ? l ? this.proceduralHolographic : this.holographic : l ? this.procedural : this.foil;
    this.bind(d, t, r, !!a), o.enable(o.DEPTH_TEST), o.depthFunc(o.LEQUAL), o.depthMask(!0), o.disable(o.BLEND), [
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
    h || this.bounds.set(e.recipe, h = se(e.recipe.artWindows)), o.uniform4fv(this.uniform(d, "artBounds[0]"), h), o.uniform4fv(this.uniform(d, "printArtBounds[0]"), h), o.uniform1f(this.uniform(d, "finishBase"), e.recipe.finishCoverageBase ?? 1);
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
    ), o.uniform1f(this.uniform(d, "cornerRadius"), e.recipe.cornerRadius), o.uniform1f(this.uniform(d, "aspect"), e.face.height / e.face.width), o.uniform1f(this.uniform(d, "hasMask"), 1), o.uniform1f(this.uniform(d, "satinCompact"), 1), o.uniform1f(this.uniform(d, "satinHoverGain"), 0), o.drawArraysInstanced(o.TRIANGLES, 0, 6, r.length), this.draws++;
  }
  drawLayer(e, t, r) {
    const o = this.gl, s = this.image;
    this.bind(s, r, [{ id: 0, card: 0, transform: e.transform }]), e.depth === "ignore" ? o.disable(o.DEPTH_TEST) : (o.enable(o.DEPTH_TEST), o.depthFunc(o.LEQUAL)), o.depthMask(e.depth === "test-write"), o.enable(o.BLEND), o.blendFuncSeparate(o.SRC_ALPHA, o.ONE_MINUS_SRC_ALPHA, o.ONE, o.ONE_MINUS_SRC_ALPHA), o.activeTexture(o.TEXTURE0), o.bindTexture(o.TEXTURE_2D, t.texture), o.uniform1i(this.uniform(s, "face"), 0), o.drawArraysInstanced(o.TRIANGLES, 0, 6, 1), this.draws++, o.depthMask(!0), o.disable(o.BLEND);
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
const Ce = `#version 300 es
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
class Oe {
  constructor(e) {
    this.textures = e;
    const t = e.gl;
    this.shader = R(t, Ce), this.fbo = t.createFramebuffer(), this.vao = t.createVertexArray();
  }
  textures;
  shader;
  fbo;
  vao;
  disposed = !1;
  builds = 0;
  compose(e, t, r, o) {
    const s = this.textures.store.acquire(e);
    if (s) return s;
    const i = this.textures.gl, [c, a] = t;
    return this.textures.store.create(e, c * a, () => {
      const l = _(i, c, a);
      try {
        if (i.bindFramebuffer(i.FRAMEBUFFER, this.fbo), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, l, 0), i.checkFramebufferStatus(i.FRAMEBUFFER) !== i.FRAMEBUFFER_COMPLETE)
          throw Error("Mask framebuffer unavailable");
        i.bindVertexArray(this.vao), i.viewport(0, 0, c, a), i.disable(i.DEPTH_TEST), i.disable(i.SCISSOR_TEST), i.disable(i.DITHER), i.colorMask(!0, !0, !0, !0), i.clearColor(0, 0, 0, 0), i.clear(i.COLOR_BUFFER_BIT), i.useProgram(this.shader), i.enable(i.BLEND), i.blendFunc(i.ONE, i.ONE_MINUS_SRC_ALPHA);
        const d = (u, h, p, g, m, w = 0) => {
          i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, u.texture), i.uniform1i(i.getUniformLocation(this.shader, "inputMask"), 0), i.uniform2f(i.getUniformLocation(this.shader, "size"), c, a), i.uniform4fv(i.getUniformLocation(this.shader, "cover"), h), i.uniform4fv(i.getUniformLocation(this.shader, "clip"), p), i.uniform4fv(i.getUniformLocation(this.shader, "crop"), g), i.uniform1f(i.getUniformLocation(this.shader, "alphaChannel"), m ? 1 : 0), i.uniform1f(i.getUniformLocation(this.shader, "angle"), w), i.drawArrays(i.TRIANGLES, 0, 3);
        };
        o && d(o, [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1], !0);
        for (const { value: u, spec: h } of r) {
          const [p, g, m, w] = h.destination, v = h.rotation ?? 0, b = u.width * h.crop[2], f = u.height * h.crop[3];
          let y;
          if (h.fit) {
            const E = h.fit.focalPoint ?? [0.5, 0.5], S = {
              ...h.fit,
              focalPoint: v === 90 ? [1 - E[1], E[0]] : v === -90 ? [E[1], 1 - E[0]] : E
            }, I = ae(
              v ? f : b,
              v ? b : f,
              [p * c, g * a, m * c, w * a],
              S
            );
            y = [I[0] / c, I[1] / a, I[2] / c, I[3] / a];
          } else {
            const E = Math.max(
              m * c / (v ? f : b),
              w * a / (v ? b : f)
            ), S = (v ? f : b) * E / c, I = (v ? b : f) * E / a;
            y = [p + (m - S) / 2, g + (w - I) / 2, S, I];
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
async function C(n, e, t, r) {
  t.throwIfAborted();
  const o = await n.paint(e, t, r);
  if (o.width !== n.size[0] || o.height !== n.size[1] || t.aborted)
    throw A(o), t.throwIfAborted(), Error("Raster dimensions differ from recipe");
  if ("getContext" in o) return o;
  const s = H(n.size);
  try {
    const i = s.getContext("2d");
    if (!i) throw Error("Canvas2D raster unavailable");
    return i.drawImage(o, 0, 0), s;
  } catch (i) {
    throw A(s), i;
  } finally {
    o.close();
  }
}
function X(n) {
  const e = n.layers ?? [], t = we(
    JSON.stringify(
      e.map((r) => ({
        id: r.id,
        stage: r.stage,
        order: r.order,
        contributesToEtch: r.contributesToEtch ?? !1
      }))
    )
  );
  return Array.from(t, (r) => e[r]);
}
function B(n) {
  return JSON.stringify(n.map((e) => [e.id, e.stage, e.order, e.raster.key, e.clip]));
}
async function P(n, e, t, r, o = H(n)) {
  const s = o.getContext("2d");
  try {
    for (const i of e) {
      const c = await C(i.raster, t, r);
      try {
        if (s.save(), i.clip) {
          s.beginPath();
          const [a, l, d, u] = i.clip;
          s.rect(a * n[0], l * n[1], d * n[0], u * n[1]), s.clip();
        }
        s.drawImage(c, 0, 0, ...n), s.restore();
      } finally {
        A(c);
      }
    }
    return o;
  } catch (i) {
    throw A(o), i;
  }
}
async function Ge(n, e, t, r) {
  const o = H(n), s = o.getContext("2d", { willReadFrequently: !0 }), i = s.createImageData(...n);
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
        const u = await P(n, [{ ...c, raster: d }], t, r);
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
class Q {
  constructor(e, t) {
    this.textures = e, this.assets = t, this.masks = new Oe(e);
  }
  textures;
  assets;
  masks;
  pending = /* @__PURE__ */ new Map();
  compositions = 0;
  async ensure(e, t) {
    const r = this.textures.store.acquire(e);
    if (r) return r;
    let o = this.pending.get(e);
    o || (o = t().then((i) => i.release()).finally(() => this.pending.delete(e)), this.pending.set(e, o)), await o;
    const s = this.textures.store.acquire(e);
    if (!s) throw Error("Prepared working set exceeds GPU budget");
    return s;
  }
  async prepare(e, t) {
    const { recipe: r } = e, o = r.color.size, s = X(e), i = [], c = s.filter((f) => f.stage === "under-art"), a = s.filter((f) => f.stage === "printed-content" || f.stage === "under-finish"), l = s.filter((f) => f.stage === "over-finish"), d = s.filter((f) => f.contributesToEtch), u = s.filter((f) => f.finishCoverage || f.etchCoverage), h = `${r.pack}:`, p = h + JSON.stringify(["color-v1", r.color.key, B([...c, ...a])]), g = h + JSON.stringify(["mask-v1", o, r.edges, r.stamp?.key, B(d)]), m = l.length ? h + JSON.stringify(["over-v1", o, B(l)]) : void 0, w = u.length ? h + JSON.stringify([
      "coverage-v1",
      o,
      u.map((f) => [
        f.clip,
        f.finishCoverage?.add?.key,
        f.finishCoverage?.exclude?.key,
        f.etchCoverage?.add?.key,
        f.etchCoverage?.exclude?.key
      ])
    ]) : void 0, v = r.hologram ? h + JSON.stringify(["hologram-v1", r.hologram.mask.key, r.hologram.mask.size]) : void 0, b = JSON.stringify(
      r.hologram ? [r.hologram.rect, r.hologram.strength, r.hologram.seed ?? 0] : null
    );
    try {
      return i.push(
        await this.ensure(p, async () => {
          const f = c.length ? await P(o, c, this.assets, t) : void 0;
          let y;
          try {
            return y = await C(r.color, this.assets, t, f), await P(o, a, this.assets, t, y), t.throwIfAborted(), this.compositions++, this.textures.upload(p, y);
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
          const f = await Ge(o, u, this.assets, t);
          return t.throwIfAborted(), this.textures.uploadBytes(w, f, o);
        })
      ), v && i.push(
        await this.ensure(v, async () => {
          const f = await C(r.hologram.mask, this.assets, t);
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
    const { recipe: r } = e, o = r.color.size, s = X(e).filter((a) => a.contributesToEtch), i = `${r.pack}:`, c = i + JSON.stringify(["mask-v1", o, r.edges, r.stamp?.key, B(s)]);
    return this.ensure(c, async () => {
      const a = [], l = [];
      try {
        for (const u of r.edges) {
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
        for (const u of s) {
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
        if (r.stamp) {
          const u = r.stamp, h = i + JSON.stringify(["stamp-v1", u.key]);
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
class Ve {
  constructor(e) {
    if (this.options = e, this.budgets = {
      gpuBytes: 64 * 1024 * 1024,
      cpuBytes: 32 * 1024 * 1024,
      scratchBytes: 16 * 1024 * 1024,
      preparationConcurrency: 2,
      ...e.budgets
    }, !Number.isInteger(this.budgets.preparationConcurrency) || this.budgets.preparationConcurrency < 1 || this.budgets.preparationConcurrency > 4)
      throw RangeError("Preparation concurrency must be 1–4");
    this.assets = new Le(this.budgets.cpuBytes), this.device = new K(e.canvas), this.textures = new q(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      e.etching
    ), this.preparer = new Q(this.textures, e.rasterHost ?? this.assets), e.canvas.addEventListener("webglcontextlost", this.contextLost), e.canvas.addEventListener("webglcontextrestored", this.contextRestored);
  }
  options;
  abiVersion = 1;
  assets;
  device;
  textures;
  preparer;
  scene = new be();
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
      xe(t), X(t);
      const r = this.documents.get(t.id);
      if (r && t.revision <= r.revision && r !== t)
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
    const t = e.map((r) => ({
      ...r,
      transform: [...r.transform],
      normal: r.normal ? [...r.normal] : void 0,
      deformation: r.deformation ? { ...r.deformation } : void 0,
      wear: r.wear ? { ...r.wear } : void 0,
      cardstock: r.cardstock ? { ...r.cardstock } : void 0,
      printDots: r.printDots ? { ...r.printDots } : void 0
    }));
    for (const r of t)
      if (Fe(r), !this.documents.has(r.card)) throw Error(`Unknown card ${r.card}`);
    this.scene.update(
      Uint32Array.from(t, (r) => r.id),
      Float32Array.from(t.flatMap((r) => r.transform)),
      Int32Array.from(t, (r) => r.order ?? 0)
    ), this.instances = t;
  }
  plan(e) {
    return this.shapeData.length !== this.instances.length * 4 && (this.shapeData = new Float32Array(this.instances.length * 4)), this.instances.forEach((t, r) => {
      const o = (this.prepared.get(t.card)?.document ?? this.documents.get(t.card)).recipe, s = r * 4;
      this.shapeData[s] = o.color.size[1] / o.color.size[0], this.shapeData[s + 1] = o.cornerRadius, this.shapeData[s + 2] = t.deformation?.amount ?? 0, this.shapeData[s + 3] = V(t.id);
    }), this.scene.plan_shaped(e.viewProjection, this.shapeData, e.time ?? 0);
  }
  ready(e, t, r) {
    this.assertLive();
    const o = this.documents.get(e);
    if (!o || o.revision !== t)
      return Promise.reject(Error("Requested revision is not current"));
    this.failed.delete(o);
    const s = this.enqueue(o);
    return r ? new Promise((i, c) => {
      if (r.aborted) {
        c(r.reason);
        return;
      }
      const a = () => c(r.reason);
      r.addEventListener("abort", a, { once: !0 }), s.then(i, c).finally(() => r.removeEventListener("abort", a));
    }) : s;
  }
  enqueue(e) {
    const t = this.jobs.get(e.id);
    if (t) return t.promise;
    let r, o;
    const s = new Promise((c, a) => {
      r = c, o = a;
    }), i = {
      document: e,
      controller: new AbortController(),
      promise: s,
      resolve: r,
      reject: o,
      started: !1
    };
    return this.jobs.set(e.id, i), queueMicrotask(() => this.pump()), s;
  }
  pump() {
    if (!(this.disposed || this.lost))
      for (const e of this.jobs.values()) {
        if (this.active >= this.budgets.preparationConcurrency) break;
        if (e.started) continue;
        e.started = !0, this.active++, this.preparer.prepare(e.document, e.controller.signal).then((r) => {
          if (e.controller.signal.throwIfAborted(), this.documents.get(e.document.id) !== e.document)
            throw Error("Superseded preparation");
          this.prepared.set(e.document.id, r), e.resolve(), this.options.invalidate?.();
        }).catch((r) => {
          e.controller.signal.aborted || this.failed.add(e.document), e.reject(r);
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
    const r = (l) => {
      if (!l) return;
      const d = this.textures.store.acquire(l);
      return d && t.push(d), d?.value;
    }, o = r(e.color), s = r(e.mask), i = r(e.overlay), c = r(e.coverage), a = r(e.hologram);
    return o && s && (!e.overlay || i) && (!e.coverage || c) && (!e.hologram || a) ? {
      face: o,
      mask: s,
      overlay: i,
      coverage: c,
      hologram: a,
      hologramSettings: e.hologramSettings,
      recipe: e.document.recipe
    } : null;
  }
  render(e) {
    if (this.assertLive(), Te(e), this.lost) return this.metrics;
    const t = performance.now(), r = this.plan(e), o = [];
    this.lastFrame = e, this.device.begin(e), this.visible = r.length;
    const s = /* @__PURE__ */ new Map(), i = (c) => {
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
      for (const d of r) {
        const u = this.instances[d];
        let h = s.get(u.card);
        if (h === void 0) {
          const p = this.prepared.get(u.card), g = this.documents.get(u.card);
          h = p ? this.material(p, o) : null, s.set(u.card, h), (!h || p?.document !== g) && !this.jobs.has(g.id) && !this.failed.has(g) && this.enqueue(g).catch((m) => {
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
    for (const a of e) Re(a);
    const t = e.map((a) => ({ ...a, transform: [...a.transform] })), r = ++this.sceneLayerGeneration, o = this.epoch, s = this.textures, i = [];
    this.sceneLayerFailure = !1, this.sceneLayerPending++;
    const c = () => {
      if (this.disposed || this.lost || this.epoch !== o || r !== this.sceneLayerGeneration)
        throw new DOMException("Stale scene layer preparation", "AbortError");
    };
    try {
      for (const a of t) {
        const l = "scene:" + a.raster.key, d = s.store.acquire(l);
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
          c(), i.push(s.upload(l, u, !1));
        } finally {
          A(u);
        }
      }
      c(), this.sceneLayers = t.sort((a, l) => a.order - l.order || a.id.localeCompare(l.id)), this.options.invalidate?.();
    } catch (a) {
      throw r === this.sceneLayerGeneration && (this.sceneLayerFailure = !0), a;
    } finally {
      for (const a of i) a.release();
      this.sceneLayerPending--;
    }
  }
  hitTest(e, t) {
    const r = this.options.canvas.getBoundingClientRect(), o = this.scene.hit(e / r.width * 2 - 1, 1 - t / r.height * 2);
    if (!o.length) return null;
    const [s, i, c] = o, a = this.instances.find((u) => u.id === s), d = this.prepared.get(a.card)?.document.recipe?.regions.filter((u) => {
      const [h, p, g, m] = u.rect;
      return i >= h && c >= p && i <= h + g && c <= p + m;
    }).sort((u, h) => u.rect[2] * u.rect[3] - h.rect[2] * h.rect[3])[0]?.id;
    return { instance: s, card: a.card, uv: [i, c], part: d ?? null };
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
    this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.device = new K(this.options.canvas), this.textures = new q(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      this.options.etching
    ), this.preparer = new Q(this.textures, this.options.rasterHost ?? this.assets), this.lost = !1, this.failed = /* @__PURE__ */ new WeakSet();
    const e = this.sceneLayers;
    this.sceneLayers = [], this.setSceneLayers(e).catch(this.options.onError ?? console.error), this.options.invalidate?.(), this.pump();
  };
  async exportCard(e, t) {
    Z(t.deformation), await this.ready(e, t.revision);
    const r = this.documents.get(e);
    if (r.revision !== t.revision) throw Error("Export revision changed");
    const o = this.options.canvas, s = [o.width, o.height], i = this.instances, c = this.sceneLayers, a = this.lastFrame;
    if (!Number.isInteger(t.width) || t.width < 1 || t.width > 2048)
      throw RangeError("Invalid export size");
    let l;
    const d = Ee(t.deformation, t.width), u = this.device.isolateMotion();
    try {
      o.width = t.width, o.height = Math.round(
        t.width * r.recipe.color.size[1] / r.recipe.color.size[0]
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
      u(), o.width = s[0], o.height = s[1], this.sceneLayers = c, this.updateScene(i), a && this.render(a);
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
async function ze(n) {
  G ??= ye(n ? { module_or_path: n } : void 0).catch((e) => {
    throw G = void 0, e;
  }), await G;
}
async function We(n) {
  return await ze(n.wasmUrl), new Ve(n);
}
export {
  _e as C,
  T as D,
  O as I,
  Se as P,
  Ve as R,
  W as S,
  q as T,
  Be as a,
  z as b,
  We as c,
  xe as d,
  Ge as e,
  Q as f,
  ze as i,
  X as l,
  Me as p,
  V as s,
  Ae as v
};
