import { R as ee, P as te, l as Y, a as M, p as P, b as z, d as I, e as re, S as ie, _ as se } from "./raster-Cc-NcJhJ.js";
import { c as ze } from "./raster-Cc-NcJhJ.js";
import { F as ae } from "./finish-DB7LnVO_.js";
const $ = (n) => (Math.imul(n + 1, 1597334677) >>> 0) % 65536 / 65536;
function K(n) {
  if (n && (n.kind !== "heat" || !Number.isFinite(n.amount) || n.amount < 0 || n.amount > 0.02))
    throw RangeError("Heat deformation amount must be between 0 and 0.02");
}
function oe(n, e) {
  return n?.amount ? e / (e + 4) / (1 + 2 * n.amount) : 1;
}
function D(n) {
  return Number.isInteger(n) && n >= 0 && n <= 4294967295;
}
function S(n) {
  if (n.length !== 4 || n.some((e) => !Number.isFinite(e)) || n[2] <= 0 || n[3] <= 0)
    throw Error("Invalid normalized rectangle");
}
function B(n) {
  if (!n.key || n.key.length > 131072) throw Error("Invalid raster key");
  const [e, t] = n.size;
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 1 || t < 1 || e * t > 4194304)
    throw Error("Invalid raster size");
}
function ne(n) {
  if (!D(n.id) || !Number.isSafeInteger(n.revision) || n.revision < 0)
    throw Error("Invalid card identity");
  const e = n.recipe;
  if (B(e.color), e.stamp && B(e.stamp), !e.pack || e.artWindows.length > 8 || e.edges.length > 32)
    throw Error("Invalid recipe or too many regions");
  if (!Number.isFinite(e.cornerRadius) || e.cornerRadius < 0 || e.cornerRadius > 0.5)
    throw Error("Invalid corner radius");
  const t = e.finishCoverageBase ?? 1;
  if (!Number.isFinite(t) || t < 0 || t > 1) throw Error("Invalid base coverage");
  if (e.overlayFoil) {
    const { tone: s, strength: i } = e.overlayFoil;
    if (!["gold", "silver", "prismatic"].includes(s) || !Number.isFinite(i) || i < 0 || i > 1)
      throw Error("Invalid overlay foil");
  }
  if (e.hologram) {
    const { mask: s, rect: i, strength: a, seed: r = 0 } = e.hologram;
    if (B(s), S(i), !Number.isFinite(a) || a < 0 || a > 1 || !D(r))
      throw Error("Invalid hologram material");
  }
  e.artWindows.forEach(S), e.regions.forEach((s) => S(s.rect));
  for (const s of e.edges) {
    if (S(s.crop), S(s.destination), S(s.clip), s.crop[0] < 0 || s.crop[1] < 0 || s.crop[0] + s.crop[2] > 1.000001 || s.crop[1] + s.crop[3] > 1.000001)
      throw Error("Crop leaves the source image");
    if (!Number.isInteger(s.threshold) || s.threshold < 0 || s.threshold > 255 || ![-90, 0, 90].includes(s.rotation ?? 0))
      throw Error("Invalid edge recipe");
  }
  for (const s of n.layers ?? []) {
    if (B(s.raster), s.clip && S(s.clip), !Number.isInteger(s.order) || Math.abs(s.order) > 2147483647)
      throw Error("Invalid layer order");
    for (const i of [
      s.finishCoverage?.add,
      s.finishCoverage?.exclude,
      s.etchCoverage?.add,
      s.etchCoverage?.exclude
    ])
      i && B(i);
  }
}
function ce(n) {
  if (K(n.deformation), !D(n.id) || !D(n.card) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid instance identity or transform");
  if (!Number.isInteger(n.order ?? 0) || Math.abs(n.order ?? 0) > 2147483647)
    throw Error("Invalid instance order");
  if (!["regular", "gloss", "etched", "prismatic", "cold", "opal", "rain", "heat", "pool"].includes(
    n.finish ?? "regular"
  ))
    throw Error("Unknown finish");
  if (n.normal && (n.normal.length !== 3 || n.normal.some((e) => !Number.isFinite(e)) || Math.hypot(...n.normal) < 1e-8))
    throw Error("Invalid surface normal");
}
function le(n) {
  if (!Number.isFinite(n.time ?? 0) || (n.time ?? 0) < 0)
    throw Error("Frame time must be finite, nonnegative seconds");
  if (n.hover && (!D(n.hover.instance) || n.hover.uv.length !== 2 || n.hover.uv.some((e) => !Number.isFinite(e) || e < 0 || e > 1)))
    throw Error("Invalid card-local hover");
}
function he(n) {
  if (B(n.raster), !n.id || !Number.isInteger(n.order) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid scene layer");
  if (!["world-under-cards", "world-interleaved", "scene-overlay", "hud"].includes(n.stage) || !["test-write", "test-readonly", "ignore"].includes(n.depth))
    throw Error("Invalid scene layer stage or depth");
  if (["scene-overlay", "hud"].includes(n.stage) && n.depth !== "ignore")
    throw Error("Overlay/HUD layers must ignore depth");
}
class J {
  constructor(e, t) {
    if (this.destroy = t, !Number.isSafeInteger(e) || e < 1 || e > 4294967295)
      throw RangeError("Invalid cache budget");
    this.policy = new ee(e);
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
    let i;
    try {
      i = JSON.parse(this.policy.admit(e, s, 1));
    } catch (a) {
      throw this.destroy(t), a;
    }
    for (const a of i.evicted) {
      const r = this.resources.get(a);
      r !== void 0 && this.destroy(r), this.resources.delete(a);
    }
    return this.resources.has(i.handle) ? this.destroy(t) : this.resources.set(i.handle, t), this.lease(i.handle);
  }
  /** Admit and evict before allocating a GPU object, so a miss does not
   * temporarily duplicate the resident cache's entire working set. */
  create(e, t, s, i = 1) {
    if (!Number.isSafeInteger(t) || t < 1 || t > 4294967295)
      throw RangeError("Invalid resource size");
    const a = JSON.parse(
      this.policy.admit(e, t, i)
    );
    for (const r of a.evicted) {
      const c = this.resources.get(r);
      c !== void 0 && this.destroy(c), this.resources.delete(r);
    }
    if (this.resources.has(a.handle)) return this.lease(a.handle);
    try {
      return this.resources.set(a.handle, s()), this.lease(a.handle);
    } catch (r) {
      throw this.policy.remove(a.handle), r;
    }
  }
  lease(e) {
    const t = this.resources.get(e);
    if (t === void 0) throw Error("Resource ownership mismatch");
    this.policy.pin(e, !0);
    const s = this.generation;
    let i = !1;
    return {
      value: t,
      release: () => {
        i || (i = !0, s === this.generation && this.policy.pin(e, !1));
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
async function de(n, e) {
  const t = await fetch(n.url, { mode: "cors", signal: e });
  if (!t.ok) throw Error(`Asset ${t.status}: ${n.url}`);
  const s = await t.blob();
  if (!s.type.includes("svg"))
    return createImageBitmap(
      s,
      n.width ? { resizeWidth: n.width, resizeQuality: "high" } : {}
    );
  const i = new DOMParser().parseFromString(await s.text(), "image/svg+xml"), a = i.documentElement;
  if (a.localName !== "svg" || i.querySelector("parsererror")) throw Error("Invalid SVG");
  const r = (a.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), c = r[2] ?? Number.parseFloat(a.getAttribute("width") ?? ""), o = r[3] ?? Number.parseFloat(a.getAttribute("height") ?? "");
  if (!(c > 0 && o > 0 && Number.isFinite(c + o))) throw Error("SVG needs finite dimensions");
  const l = (n.width ?? 512) / Math.max(c, o);
  a.hasAttribute("viewBox") || a.setAttribute("viewBox", `0 0 ${c} ${o}`), a.setAttribute("width", String(Math.max(1, Math.round(c * l)))), a.setAttribute("height", String(Math.max(1, Math.round(o * l))));
  const u = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" })
  ), d = new Image();
  try {
    return d.src = u, await d.decode(), await createImageBitmap(d);
  } finally {
    d.src = "", URL.revokeObjectURL(u);
  }
}
class ue {
  store;
  pending = /* @__PURE__ */ new Map();
  active = 0;
  waiting = [];
  disposed = !1;
  generation = 0;
  controllers = /* @__PURE__ */ new Set();
  decodes = 0;
  constructor(e) {
    this.store = new J(e, (t) => t.close());
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
    let i = this.store.acquire(s);
    if (i) return i;
    let a = this.pending.get(s);
    if (!a) {
      const r = this.generation, c = new AbortController();
      this.controllers.add(c), a = (async () => {
        const o = await this.reserve();
        try {
          if (this.disposed || r !== this.generation) throw Error("Asset scope changed");
          const l = await de(e, c.signal);
          if (this.decodes++, this.disposed || r !== this.generation)
            throw l.close(), Error("Asset scope changed");
          this.store.insert(s, l, l.width * l.height * 4).release();
        } finally {
          o(), this.controllers.delete(c), r === this.generation && this.pending.delete(s);
        }
      })(), this.pending.set(s, a);
    }
    if (await a, t.throwIfAborted(), i = this.store.acquire(s), !i) throw Error("Decoded working set exceeds CPU budget");
    return i;
  }
  async images(e, t) {
    const s = [], i = /* @__PURE__ */ new Map(), a = await Promise.allSettled(
      e.map(async (o) => {
        const l = await this.image(o, t);
        s.push(l), i.set(o.url, l.value);
      })
    ), r = () => {
      for (const o of s) o.release();
      i.clear();
    }, c = a.find((o) => o.status === "rejected");
    if (c?.status === "rejected")
      throw r(), c.reason;
    return { value: i, release: r };
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
const fe = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`, W = `#version 300 es
precision highp float;precision highp int;precision highp usampler2D;
`, ve = W + `uniform sampler2D source;uniform ivec2 size;uniform int mode;layout(location=0) out uvec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);if(mode==1)p.y=size.y-1-p.y;uvec3 rgb=uvec3(floor(texelFetch(source,p,0).rgb*255.+.5));
uint y=(54u*rgb.r+183u*rgb.g+19u*rgb.b)>>8u;color=uvec4(y,0,0,1);}`, pe = W + `uniform usampler2D source;uniform ivec2 size;uniform int mode;uniform int threshold;
layout(location=0) out uvec4 color;
int at(ivec2 p){return int(texelFetch(source,p,0).r);}
void main(){ivec2 p=ivec2(gl_FragCoord.xy);int value=0;
if(mode==1){value=p.x==0||p.x==size.x-1?at(p):(at(p-ivec2(1,0))+2*at(p)+at(p+ivec2(1,0)))>>2;}
else if(mode==2){value=p.y==0||p.y==size.y-1?at(p):(at(p-ivec2(0,1))+2*at(p)+at(p+ivec2(0,1)))>>2;}
else if(p.x>0&&p.y>0&&p.x<size.x-1&&p.y<size.y-1){
int gx=-at(p+ivec2(-1,-1))+at(p+ivec2(1,-1))-2*at(p+ivec2(-1,0))+2*at(p+ivec2(1,0))-at(p+ivec2(-1,1))+at(p+ivec2(1,1));
int gy=-at(p+ivec2(-1,-1))-2*at(p+ivec2(0,-1))-at(p+ivec2(1,-1))+at(p+ivec2(-1,1))+2*at(p+ivec2(0,1))+at(p+ivec2(1,1));
value=clamp((((abs(gx)+abs(gy))>>2)-threshold)*8,0,255);}
color=uvec4(uint(value),0,0,1);}`, me = W + `uniform usampler2D strength;uniform usampler2D softened;out vec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);uint a=min(255u,max(texelFetch(strength,p,0).r,texelFetch(softened,p,0).r)*2u);color=vec4(float(a)/255.,0.,0.,1.);}`;
function N(n, e, t = fe) {
  const s = [], i = n.createProgram();
  try {
    for (const [a, r] of [
      [n.VERTEX_SHADER, t],
      [n.FRAGMENT_SHADER, e]
    ]) {
      const c = n.createShader(a);
      if (s.push(c), n.shaderSource(c, r), n.compileShader(c), !n.getShaderParameter(c, n.COMPILE_STATUS))
        throw Error(n.getShaderInfoLog(c));
      n.attachShader(i, c);
    }
    if (n.linkProgram(i), !n.getProgramParameter(i, n.LINK_STATUS)) throw Error(n.getProgramInfoLog(i));
    return i;
  } catch (a) {
    throw n.deleteProgram(i), a;
  } finally {
    for (const a of s) n.deleteShader(a);
  }
}
function A(n, e, t, s = n.R8, i = n.RED, a = n.UNSIGNED_BYTE) {
  const r = n.createTexture();
  n.bindTexture(n.TEXTURE_2D, r);
  const c = s === n.R8UI ? n.NEAREST : n.LINEAR;
  return n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, c), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, c), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE), n.texImage2D(n.TEXTURE_2D, 0, s, e, t, 0, i, a, null), r;
}
class ge {
  constructor(e) {
    this.gl = e, this.scratch = [], this.width = this.height = 0, this.disposed = !1;
    const t = performance.now();
    this.programs = [];
    try {
      for (const s of [ve, pe, me]) this.programs.push(N(e, s));
    } catch (s) {
      throw this.dispose(), s;
    }
    this.uniforms = this.programs.map(
      (s) => Object.fromEntries(
        ["source", "size", "mode", "threshold", "strength", "softened"].map((i) => [
          i,
          e.getUniformLocation(s, i)
        ])
      )
    ), this.framebuffer = e.createFramebuffer(), this.vao = e.createVertexArray(), this.compileMs = performance.now() - t;
  }
  allocate(e, t) {
    if (e === this.width && t === this.height) return;
    const s = this.gl;
    for (const i of this.scratch) s.deleteTexture(i);
    this.scratch = [], this.width = e, this.height = t, this.input = A(s, e, t, s.RGBA8, s.RGBA), this.scratch.push(this.input);
    for (let i = 0; i < 3; i++) this.scratch.push(A(s, e, t, s.R8UI, s.RED_INTEGER));
    if (s.bindFramebuffer(s.FRAMEBUFFER, this.framebuffer), s.framebufferTexture2D(
      s.FRAMEBUFFER,
      s.COLOR_ATTACHMENT0,
      s.TEXTURE_2D,
      this.scratch[1],
      0
    ), s.checkFramebufferStatus(s.FRAMEBUFFER) !== s.FRAMEBUFFER_COMPLETE)
      throw Error("GPU integer etching framebuffer is unavailable");
  }
  run(e, t, s, i = 20, a = null) {
    if (this.disposed) throw Error("GPU etcher disposed");
    if (!Number.isInteger(t) || !Number.isInteger(s) || t < 1 || s < 1 || t * s > 4194304 || !Number.isInteger(i) || i < 0 || i > 255)
      throw RangeError("Invalid etching dimensions or threshold");
    if (ArrayBuffer.isView(e) && e.byteLength !== t * s * 4)
      throw RangeError("Wrong RGBA input length");
    if (e === null && (t !== this.width || s !== this.height))
      throw Error("Resident input must be uploaded at this size before reuse");
    const r = this.gl;
    this.allocate(t, s), r.bindVertexArray(this.vao), r.disable(r.BLEND), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.viewport(0, 0, t, s), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, this.input), r.pixelStorei(r.UNPACK_ALIGNMENT, 1), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL, r.NONE), e !== null && (this.flipped = typeof ImageBitmap < "u" && e instanceof ImageBitmap ? 1 : 0), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !ArrayBuffer.isView(e) && !this.flipped), ArrayBuffer.isView(e) ? r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, t, s, r.RGBA, r.UNSIGNED_BYTE, e) : e !== null && r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, e), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1);
    const [c, o, l] = this.scratch.slice(1), u = a ?? A(r, t, s), d = (m, v, w, g = 0) => {
      r.useProgram(this.programs[m]);
      const p = this.uniforms[m];
      r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, v), r.uniform1i(p.source, 0), r.uniform2i(p.size, t, s), r.uniform1i(p.mode, g), r.uniform1i(p.threshold, i), r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, w, 0), r.drawArrays(r.TRIANGLES, 0, 3);
    };
    d(0, this.input, c, this.flipped ?? 0), d(1, c, o, 1), d(1, o, l, 2), d(1, l, c, 3), d(1, c, o, 1), d(1, o, l, 2);
    const h = this.uniforms[2];
    return r.useProgram(this.programs[2]), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, c), r.uniform1i(h.strength, 0), r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, l), r.uniform1i(h.softened, 1), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, u, 0), r.drawArrays(r.TRIANGLES, 0, 3), r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(null), u;
  }
  // Validation/measurement only. The real capture feeds the result directly to GL.
  read(e, t = this.width, s = this.height) {
    const i = this.gl, a = new Uint8Array(t * s * 4), r = new Uint8Array(t * s);
    i.bindFramebuffer(i.FRAMEBUFFER, this.framebuffer), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, e, 0), i.readPixels(0, 0, t, s, i.RGBA, i.UNSIGNED_BYTE, a), i.bindFramebuffer(i.FRAMEBUFFER, null);
    for (let c = 0; c < r.length; c++) r[c] = a[c * 4];
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
const we = `
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
 float fog=clamp((.145+.058*mist+.032*fineMist+.025*streak)*dry,0.,.32);
 vec3 mistColor=vec3(.73,.79,.83)+vec3(.11,.12,.13)*(spot*.65+paneBand*.35);
 ink=mix(ink,vec3(inkLuma(ink))*.82+.18,.16*dry);
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
`, ye = `
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
`, Q = `
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
`, be = `
uniform sampler2D caustics;
${Q}
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
 float taper=segLen>.004 ? smoothstep(0.,.18,h) : 1.;
 float amp=(.85+min(.55,segLen*4.))*taper;
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
 // Ambient waves organically advect the dragged wake so it undulates with the pool.
 vec2 wakeDrag;
 vec3 rip=rippleWake(uv+wave.xy*.24,wakeDrag);
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
`, xe = `
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
${we}
${ye}
${be}
vec3 animatedSurface(vec2 uv,vec3 normal){
 if(previewKind==5.)return rainGlass(uv,normal);
 if(previewKind==6.)return heatHaze(uv,normal);
 return poolWater(uv,normal);
}
`, Ee = `
vec2 cardSource(vec2 local,float time,vec2 shape){
 float amount=shape.x,phase=shape.y*6.28318530718;
 if(amount==0.)return local;
 return local+amount*vec2(
  .72*sin(local.y*43.+time*2.1+phase)+.28*sin(local.y*81.-time*3.4+phase*.7),
  .18*sin(local.x*29.-time*1.3+phase));
}
`, Re = `
uniform sampler2D hologramMask;
uniform vec4 hologramRect;
uniform vec2 hologramMaterial;
vec3 localHologram(vec2 uv, vec3 ink, vec3 normal, vec3 view, float grainFilter) {
  if(hologramMaterial.x<=0.) return ink;
  vec2 p=(uv-hologramRect.xy)/hologramRect.zw;
  if(any(lessThan(p,vec2(0.))) || any(greaterThan(p,vec2(1.)))) return ink;
  float cover=texture(hologramMask,p).a*hologramMaterial.x;
  if(cover<=0.) return ink;
  vec3 reflected=reflect(-view,normal);
  vec2 light=reflected.xy/max(abs(reflected.z),.25)+(pointer-.5)*.85;
  float seed=hologramMaterial.y;
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
  float flash=exp(-pow(dot(p-.5,vec2(.7,.25))+dot(light,vec2(.85,.4)),2.)*70.);
  float luminance=dot(ink,vec3(.2126,.7152,.0722));
  vec3 silver=ink*(.80+.12*broad)*grain;
  vec3 colored=diffraction*(.12+.28*broad+.25*flash)*(.25+.75*luminance);
  vec3 specular=vec3(1.,.99,.96)*flash*.24;
  return mix(ink,silver+colored+specular,cover);
}
`, O = `#version 300 es
layout(location=0) in vec2 position;
layout(location=1) in mat4 model;
layout(location=5) in vec3 instanceNormal;
layout(location=6) in float instanceFinish;
layout(location=7) in vec4 instanceSurface;
layout(location=8) in vec4 instanceRipple0;layout(location=9) in vec4 instanceRipple1;
layout(location=10) in vec4 instanceRipple2;layout(location=11) in vec4 instanceRipple3;
uniform mat4 viewProjection;
out vec2 v_uv;out vec3 v_normal;flat out float previewKind;
flat out vec4 surfaceInfo;flat out vec4 ripple0;flat out vec4 ripple1;flat out vec4 ripple2;flat out vec4 ripple3;
void main(){
vec2 pad=instanceSurface.w*vec2(1.,.18);
vec2 local=position*(1.+2.*pad)-pad;
v_uv=local;v_normal=instanceNormal;previewKind=instanceFinish;
surfaceInfo=instanceSurface;ripple0=instanceRipple0;ripple1=instanceRipple1;ripple2=instanceRipple2;ripple3=instanceRipple3;
gl_Position=viewProjection*model*vec4(local,0.,1.);}`, Te = ae.replace(
  "uniform float previewKind;",
  "flat in float previewKind;"
).replaceAll("texture2D(mask,uv).r*hasMask", "edgeCoverage(uv)"), Z = `#version 300 es
precision highp float;
in vec2 v_uv;in vec3 v_normal;
uniform sampler2D face;uniform sampler2D mask;uniform sampler2D overlay;uniform sampler2D coverage;
uniform vec2 overlayFoil;
uniform vec2 pointer;uniform vec4 artBounds[8];
uniform float hasMask;uniform float cornerRadius;uniform float aspect;uniform float finishBase;
out vec4 out_color;
#define texture2D texture
float edgeCoverage(vec2 uv){vec4 c=texture(coverage,uv);return max(texture(mask,uv).r*hasMask,c.b)*(1.-c.a);}
${Te}
${xe}
${Ee}
#ifdef LOCAL_HOLOGRAM
${Re}
#endif
void main(){
 vec2 source=cardSource(v_uv,surfaceTime,surfaceInfo.wz);
 vec2 uv=vec2(source.x,1.-source.y);
#ifdef LOCAL_HOLOGRAM
 // Evaluate derivatives before any per-fragment return/discard. The outer
 // material condition is uniform across the draw, including instanced cards.
 float grainFilter=1.;
 if(hologramMaterial.x>0.) {
   vec2 local=(uv-hologramRect.xy)/hologramRect.zw;
   grainFilter=exp(-fwidth(dot(local,vec2(24.,8.)))*2.);
 }
#endif
 vec2 corner=abs((uv-.5)*vec2(1.,aspect))-(vec2(.5,aspect*.5)-cornerRadius);
 if(length(max(corner,0.))+min(max(corner.x,corner.y),0.)-cornerRadius>0.)discard;
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 shaded=previewLinear(previewKind>=5. && previewKind<8. ? animatedSurface(uv,normalize(v_normal)) : previewFoil(uv,normalize(v_normal),view));
 vec3 base=texture(face,uv).rgb;
 vec4 c=texture(coverage,uv),top=texture(overlay,uv);
 vec3 under=mix(base,shaded,max(finishBase,c.r)*(1.-c.g));
 // Printing stays at the original UV, above all optical effects. The same
 // satin response as the conventional finishes supplies an optional reflection.
 vec3 printing=top.rgb;
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
}`, Ae = Z.replace(
  "#version 300 es",
  `#version 300 es
#define LOCAL_HOLOGRAM`
), Fe = `#version 300 es
precision highp float;in vec2 v_uv;uniform sampler2D face;out vec4 out_color;
void main(){out_color=texture(face,vec2(v_uv.x,1.-v_uv.y));if(out_color.a<.001)discard;}`, k = (n, e) => Math.max(-e, Math.min(e, n));
function G(n, e) {
  const t = Math.min(2047, Math.max(0, Math.round((n / 0.24 + 0.5) * 2047))), s = Math.min(0.9995, Math.max(5e-4, e / 0.24 + 0.5));
  return 1 + t + s;
}
class X {
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
    const i = t.time ?? 0, a = e.transform, r = e.normal ?? [0, 0, 1], c = [a[12], a[13], r[0], r[1]];
    let o = this.states.get(e.id);
    if (!o || i < o.time) {
      const d = new Float32Array(20);
      d.set([0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0], 4), o = {
        seen: this.serial,
        time: i,
        pose: c,
        velocity: [0, 0],
        data: d,
        activeRipple: 0,
        segStart: [0.5, 0.5],
        segTime: -100,
        hoverUv: [0.5, 0.5],
        hovering: !1
      }, this.states.set(e.id, o);
    }
    o.seen = this.serial;
    const l = Math.min(0.05, i - o.time), u = t.hover?.instance === e.id ? t.hover : void 0;
    if (u) {
      const d = u.uv[0], h = 1 - u.uv[1];
      if (!o.hovering)
        o.activeRipple = (o.activeRipple + 1) % 4, o.segStart = [d, h], o.segTime = i, o.hoverUv = [d, h], o.data.set([d, h, i, G(0, 0)], 4 + o.activeRipple * 4);
      else {
        const m = d - o.hoverUv[0], v = h - o.hoverUv[1], w = Math.hypot(m, v);
        o.hoverUv = [d, h], l > 0 && w > 0 && (o.velocity[0] = k(o.velocity[0] + k(m * 1.8, 0.28), 1), o.velocity[1] = k(o.velocity[1] + k(v * 1.8, 0.28), 1));
        const g = (d - o.segStart[0]) * 0.5, p = (h - o.segStart[1]) * 0.5, x = Math.hypot(g, p) * 2, f = i - o.segTime;
        if (w > 5e-4)
          if (x > 0.11 || f > 0.13 && x > 0.02) {
            const b = [
              o.segStart[0] + g * 2,
              o.segStart[1] + p * 2
            ];
            o.activeRipple = (o.activeRipple + 1) % 4, o.segStart = b, o.segTime = i;
            const R = (d - b[0]) * 0.5, y = (h - b[1]) * 0.5;
            o.data.set(
              [b[0] + R, b[1] + y, i, G(R, y)],
              4 + o.activeRipple * 4
            );
          } else {
            const b = o.segStart[0] + g, R = o.segStart[1] + p, y = o.segTime + f * 0.45;
            o.data.set([b, R, y, G(g, p)], 4 + o.activeRipple * 4);
          }
      }
    }
    if (l > 0) {
      const d = [Math.hypot(a[0], a[1], a[2]), Math.hypot(a[4], a[5], a[6])];
      for (let h = 0; h < 2; h++) {
        const m = (c[h] - o.pose[h]) / Math.max(0.05, d[h]) + (c[h + 2] - o.pose[h + 2]) * 0.7, v = k(m, 0.22), w = Math.max(1, Math.ceil(l / (1 / 120))), g = l / w;
        for (let p = 0; p < w; p++) {
          let x = o.data[h], f = o.velocity[h] + (p === 0 ? v * 4.5 : 0);
          f += (-26 * x - 4.8 * f) * g, x = k(x + f * g, 0.35), o.data[h] = x, o.velocity[h] = k(f, 1.4);
        }
      }
    }
    return o.hovering = !!u, o.time = i, o.pose = c, o.data;
  }
}
const E = 192, U = 512, Se = `#version 300 es
precision highp float;
uniform float time;
out vec2 incoming;
${Q}
void main(){
 // Include a skirt around the periodic tile: rays from outside can land inside.
 vec2 p=vec2(gl_VertexID%${E + 1},gl_VertexID/${E + 1})/${E}.*2.4-.2;
 vec3 wave=waterField(p,time);
 vec3 normal=normalize(vec3(-wave.xy,1.));
 vec3 ray=refract(vec3(0.,0.,-1.),normal,1./1.333);
 vec2 floorPoint=p+ray.xy/(-ray.z)*(waterDepth+wave.z);
 incoming=p;
 gl_Position=vec4(floorPoint/waterPeriod*2.-1.,0.,1.);
}`, ke = `#version 300 es
precision highp float;
in vec2 incoming;out vec4 color;
void main(){
 // Each fragment receives the area of its source light footprint. Overlapping
 // folds accumulate by additive blending; expanded footprints become darker.
 vec2 dx=dFdx(incoming),dy=dFdy(incoming);
 float flux=abs(dx.x*dy.y-dx.y*dy.x)*${(U / 2) ** 2}.;
 color=vec4(min(flux,8.)/8.,0.,0.,1.);
}`;
class Le {
  constructor(e) {
    if (this.gl = e, this.shader = N(e, ke, Se), this.clock = e.getUniformLocation(this.shader, "time"), this.map = A(e, U, U), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.REPEAT), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.REPEAT), this.framebuffer = e.createFramebuffer(), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.map, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
      throw e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteProgram(this.shader), Error("Caustics framebuffer is incomplete");
    this.vao = e.createVertexArray(), this.indices = e.createBuffer(), e.bindVertexArray(this.vao), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indices);
    const t = new Uint16Array(E * E * 6);
    for (let s = 0; s < E; s++)
      for (let i = 0; i < E; i++) {
        const a = s * (E + 1) + i, r = a + E + 1;
        t.set([a, a + 1, r, r, a + 1, r + 1], (s * E + i) * 6);
      }
    e.bufferData(e.ELEMENT_ARRAY_BUFFER, t, e.STATIC_DRAW), e.bindVertexArray(null), e.bindFramebuffer(e.FRAMEBUFFER, null);
  }
  gl;
  map;
  bytes = U * U + E * E * 6 * 2;
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
    t.bindFramebuffer(t.FRAMEBUFFER, this.framebuffer), t.viewport(0, 0, U, U), t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.disable(t.SCISSOR_TEST), t.colorMask(!0, !0, !0, !0), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.enable(t.BLEND), t.blendEquation(t.FUNC_ADD), t.blendFunc(t.ONE, t.ONE), t.useProgram(this.shader), t.uniform1f(this.clock, e), t.bindVertexArray(this.vao), t.drawElements(t.TRIANGLES, E * E * 6, t.UNSIGNED_SHORT, 0), t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, t.drawingBufferWidth, t.drawingBufferHeight), t.disable(t.BLEND), this.time = e, this.passes++;
  }
  dispose() {
    const e = this.gl;
    e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteVertexArray(this.vao), e.deleteBuffer(this.indices), e.deleteProgram(this.shader);
  }
}
const Ie = {
  regular: 0,
  etched: 1,
  prismatic: 2,
  cold: 3,
  opal: 4,
  rain: 5,
  heat: 6,
  pool: 7,
  gloss: 8
}, L = 40;
class V {
  constructor(e) {
    this.canvas = e;
    const t = e.getContext("webgl2", {
      alpha: !0,
      antialias: !0,
      premultipliedAlpha: !1,
      preserveDrawingBuffer: !0
    });
    if (!t) throw Error("WebGL2 is required");
    this.gl = t, this.caustics = new Le(t), this.foil = N(t, Z, O), this.holographic = N(t, Ae, O), this.image = N(t, Fe, O), this.vao = t.createVertexArray(), this.quad = t.createBuffer(), this.instances = t.createBuffer(), this.blank = A(t, 1, 1, t.RGBA8, t.RGBA), t.bindTexture(t.TEXTURE_2D, this.blank), t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)), t.bindVertexArray(this.vao), t.bindBuffer(t.ARRAY_BUFFER, this.quad), t.bufferData(
      t.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      t.STATIC_DRAW
    ), t.enableVertexAttribArray(0), t.vertexAttribPointer(0, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, this.instances);
    for (let s = 0; s < 4; s++)
      t.enableVertexAttribArray(1 + s), t.vertexAttribPointer(1 + s, 4, t.FLOAT, !1, L * 4, s * 16), t.vertexAttribDivisor(1 + s, 1);
    t.enableVertexAttribArray(5), t.vertexAttribPointer(5, 3, t.FLOAT, !1, L * 4, 64), t.vertexAttribDivisor(5, 1), t.enableVertexAttribArray(6), t.vertexAttribPointer(6, 1, t.FLOAT, !1, L * 4, 76), t.vertexAttribDivisor(6, 1);
    for (let s = 7; s <= 11; s++)
      t.enableVertexAttribArray(s), t.vertexAttribPointer(s, 4, t.FLOAT, !1, L * 4, 80 + (s - 7) * 16), t.vertexAttribDivisor(s, 1);
    t.bindVertexArray(null);
  }
  canvas;
  gl;
  foil;
  holographic;
  image;
  vao;
  quad;
  instances;
  blank;
  disposed = !1;
  instanceCapacity = 0;
  staging = new Float32Array();
  motion = new X();
  caustics;
  draws = 0;
  begin(e) {
    this.motion.begin();
    const t = this.gl;
    t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, this.canvas.width, this.canvas.height), t.disable(t.SCISSOR_TEST), t.disable(t.CULL_FACE), t.colorMask(!0, !0, !0, !0), t.depthMask(!0), t.clearDepth(1), t.clearColor(...e.clear ?? [0, 0, 0, 0]), t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT), this.draws = 0;
  }
  bind(e, t, s) {
    const i = this.gl;
    i.useProgram(e), i.bindVertexArray(this.vao), i.bindBuffer(i.ARRAY_BUFFER, this.instances);
    const a = s.length * L;
    this.staging.length < a && (this.staging = new Float32Array(a));
    const r = this.staging;
    s.forEach((c, o) => {
      const l = o * L;
      r.set(c.transform, l), r.set(c.normal ?? [0, 0, 1], l + 16), r[l + 19] = Ie[c.finish ?? "regular"];
      const u = this.motion.sample(c, t);
      u ? r.set(u, l + 20) : r.fill(0, l + 20, l + L), r[l + 22] = $(c.id), r[l + 23] = c.deformation?.amount ?? 0;
    }), this.instanceCapacity < a && (this.instanceCapacity = a, i.bufferData(i.ARRAY_BUFFER, a * 4, i.DYNAMIC_DRAW)), i.bufferSubData(i.ARRAY_BUFFER, 0, r, 0, a), i.uniformMatrix4fv(
      i.getUniformLocation(e, "viewProjection"),
      !1,
      t.viewProjection
    );
  }
  draw(e, t, s) {
    const i = this.gl, a = e.recipe.hologram?.strength ? this.holographic : this.foil;
    s.some((g) => g.finish === "pool") && this.caustics.prepare(t.time ?? 0), this.bind(a, t, s), i.enable(i.DEPTH_TEST), i.depthFunc(i.LEQUAL), i.depthMask(!0), i.disable(i.BLEND), [
      ["face", e.face.texture],
      ["mask", e.mask.texture],
      ["overlay", e.overlay?.texture ?? this.blank],
      ["coverage", e.coverage?.texture ?? this.blank],
      ["caustics", this.caustics.map],
      ["hologramMask", e.hologram?.texture ?? this.blank]
    ].forEach(([g, p], x) => {
      i.activeTexture(i.TEXTURE0 + x), i.bindTexture(i.TEXTURE_2D, p), i.uniform1i(i.getUniformLocation(a, g), x);
    });
    const c = e.recipe.artWindows.map(([g, p, x, f]) => [g, 1 - p - f, g + x, 1 - p]), o = new Float32Array(32);
    c.forEach((g, p) => o.set(g, p * 4)), i.uniform4fv(i.getUniformLocation(a, "artBounds[0]"), o), i.uniform1f(i.getUniformLocation(a, "finishBase"), e.recipe.finishCoverageBase ?? 1);
    const l = e.recipe.hologram, [u, d, h, m] = l?.rect ?? [0, 0, 1, 1];
    i.uniform4f(i.getUniformLocation(a, "hologramRect"), u, 1 - d - m, h, m), i.uniform2f(
      i.getUniformLocation(a, "hologramMaterial"),
      l?.strength ?? 0,
      (l?.seed ?? 0) / 4294967295
    );
    const v = e.recipe.overlayFoil;
    i.uniform2f(
      i.getUniformLocation(a, "overlayFoil"),
      v ? { gold: 1, silver: 3, prismatic: 2 }[v.tone] : 0,
      v?.strength ?? 0
    ), i.uniform1f(i.getUniformLocation(a, "cornerRadius"), e.recipe.cornerRadius), i.uniform1f(i.getUniformLocation(a, "aspect"), e.face.height / e.face.width);
    const w = t.pointer ?? [0.5, 0.5];
    i.uniform2f(i.getUniformLocation(a, "pointer"), w[0], 1 - w[1]), i.uniform1f(i.getUniformLocation(a, "hasMask"), 1), i.uniform1f(i.getUniformLocation(a, "satinCompact"), 1), i.uniform1f(i.getUniformLocation(a, "satinHoverGain"), 0), i.uniform1f(i.getUniformLocation(a, "surfaceTime"), t.time ?? 0), i.drawArraysInstanced(i.TRIANGLES, 0, 6, s.length), this.draws++;
  }
  drawLayer(e, t, s) {
    const i = this.gl, a = this.image;
    this.bind(a, s, [{ id: 0, card: 0, transform: e.transform }]), e.depth === "ignore" ? i.disable(i.DEPTH_TEST) : (i.enable(i.DEPTH_TEST), i.depthFunc(i.LEQUAL)), i.depthMask(e.depth === "test-write"), i.enable(i.BLEND), i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA), i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, t.texture), i.uniform1i(i.getUniformLocation(a, "face"), 0), i.drawArraysInstanced(i.TRIANGLES, 0, 6, 1), this.draws++, i.depthMask(!0), i.disable(i.BLEND);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0, this.motion.clear();
    const e = this.gl;
    e.deleteProgram(this.foil), e.deleteProgram(this.holographic), e.deleteProgram(this.image), e.deleteVertexArray(this.vao), e.deleteBuffer(this.quad), e.deleteBuffer(this.instances), e.deleteTexture(this.blank), this.caustics.dispose();
  }
  get surfacePasses() {
    return this.caustics.passes;
  }
  get surfaceBytes() {
    return this.caustics.bytes;
  }
  end() {
    this.motion.end();
  }
  resetMotion() {
    this.motion.clear();
  }
  isolateMotion() {
    const e = this.motion;
    return this.motion = new X(), () => {
      this.motion = e;
    };
  }
}
class q {
  constructor(e, t, s, i = "gpu") {
    this.gl = e, this.scratchLimit = s, this.mode = i, this.store = new J(t, (a) => e.deleteTexture(a.texture)), this.etcher = new ge(e);
  }
  gl;
  scratchLimit;
  mode;
  store;
  etcher;
  kernels = new te();
  uploads = 0;
  edgeBuilds = 0;
  readbacks = 0;
  upload(e, t, s = !0, i = 1) {
    const a = this.store.acquire(e);
    if (a) return a;
    const r = this.gl, c = t.width, o = t.height;
    return this.store.create(
      e,
      c * o * 4,
      () => {
        const l = A(r, c, o, s ? r.SRGB8_ALPHA8 : r.RGBA8, r.RGBA);
        if (r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, l), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !0), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
          const u = document.createElement("canvas");
          u.width = c, u.height = o;
          try {
            u.getContext("2d").drawImage(t, 0, 0), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, u);
          } finally {
            u.width = u.height = 0;
          }
        } else
          r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, t);
        return r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1), this.uploads++, { texture: l, width: c, height: o };
      },
      i
    );
  }
  edge(e, t, s) {
    const i = this.store.acquire(e);
    if (i) return i;
    const a = this.gl, r = t.width, c = t.height;
    if (r * c * 7 > this.scratchLimit) throw Error("Etching exceeds scratch budget");
    return this.store.create(
      e,
      r * c,
      () => {
        let o;
        if (this.mode === "gpu") o = this.etcher.run(t, r, c, s);
        else {
          const l = document.createElement("canvas");
          l.width = r, l.height = c;
          try {
            const u = l.getContext("2d", { willReadFrequently: !0 });
            u.drawImage(t, 0, 0);
            const d = u.getImageData(0, 0, r, c).data, h = this.kernels.etch(
              r,
              c,
              new Uint8Array(d.buffer, d.byteOffset, d.byteLength),
              s
            ), m = new Uint8Array(h.length);
            for (let v = 0; v < c; v++)
              m.set(h.subarray(v * r, (v + 1) * r), (c - 1 - v) * r);
            o = A(a, r, c), a.bindTexture(a.TEXTURE_2D, o), a.pixelStorei(a.UNPACK_ALIGNMENT, 1), a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, r, c, a.RED, a.UNSIGNED_BYTE, m);
          } finally {
            l.width = l.height = 0;
          }
        }
        return this.uploads++, this.edgeBuilds++, { texture: o, width: r, height: c };
      },
      0
    );
  }
  uploadBytes(e, t, s) {
    const i = this.store.acquire(e);
    if (i) return i;
    const a = this.gl, [r, c] = s, o = new Uint8Array(t.length);
    for (let l = 0; l < c; l++)
      o.set(t.subarray(l * r * 4, (l + 1) * r * 4), (c - 1 - l) * r * 4);
    return this.store.create(e, r * c * 4, () => {
      const l = A(a, r, c, a.RGBA8, a.RGBA);
      return a.bindTexture(a.TEXTURE_2D, l), a.pixelStorei(a.UNPACK_ALIGNMENT, 1), a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !1), a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, r, c, a.RGBA, a.UNSIGNED_BYTE, o), this.uploads++, { texture: l, width: r, height: c };
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
const Ue = `#version 300 es
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
class _e {
  constructor(e) {
    this.textures = e;
    const t = e.gl;
    this.shader = N(t, Ue), this.fbo = t.createFramebuffer(), this.vao = t.createVertexArray();
  }
  textures;
  shader;
  fbo;
  vao;
  disposed = !1;
  builds = 0;
  compose(e, t, s, i) {
    const a = this.textures.store.acquire(e);
    if (a) return a;
    const r = this.textures.gl, [c, o] = t;
    return this.textures.store.create(e, c * o, () => {
      const l = A(r, c, o);
      try {
        if (r.bindFramebuffer(r.FRAMEBUFFER, this.fbo), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, l, 0), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE)
          throw Error("Mask framebuffer unavailable");
        r.bindVertexArray(this.vao), r.viewport(0, 0, c, o), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.clearColor(0, 0, 0, 0), r.clear(r.COLOR_BUFFER_BIT), r.useProgram(this.shader), r.enable(r.BLEND), r.blendFunc(r.ONE, r.ONE_MINUS_SRC_ALPHA);
        const u = (d, h, m, v, w, g = 0) => {
          r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, d.texture), r.uniform1i(r.getUniformLocation(this.shader, "inputMask"), 0), r.uniform2f(r.getUniformLocation(this.shader, "size"), c, o), r.uniform4fv(r.getUniformLocation(this.shader, "cover"), h), r.uniform4fv(r.getUniformLocation(this.shader, "clip"), m), r.uniform4fv(r.getUniformLocation(this.shader, "crop"), v), r.uniform1f(r.getUniformLocation(this.shader, "alphaChannel"), w ? 1 : 0), r.uniform1f(r.getUniformLocation(this.shader, "angle"), g), r.drawArrays(r.TRIANGLES, 0, 3);
        };
        i && u(i, [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1], !0);
        for (const { value: d, spec: h } of s) {
          const [m, v, w, g] = h.destination, p = h.rotation ?? 0, x = d.width * h.crop[2], f = d.height * h.crop[3], b = Math.max(
            w * c / (p ? f : x),
            g * o / (p ? x : f)
          ), R = (p ? f : x) * b / c, y = (p ? x : f) * b / o;
          u(
            d,
            [m + (w - R) / 2, v + (g - y) / 2, R, y],
            h.clip,
            h.crop,
            !!h.importedMask,
            p
          );
        }
        this.builds++;
      } catch (u) {
        throw r.deleteTexture(l), u;
      } finally {
        r.disable(r.BLEND), r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(null);
      }
      return { texture: l, width: c, height: o };
    });
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    const e = this.textures.gl;
    e.deleteProgram(this.shader), e.deleteFramebuffer(this.fbo), e.deleteVertexArray(this.vao);
  }
}
class j {
  constructor(e, t) {
    this.textures = e, this.assets = t, this.masks = new _e(e);
  }
  textures;
  assets;
  masks;
  pending = /* @__PURE__ */ new Map();
  compositions = 0;
  async ensure(e, t) {
    const s = this.textures.store.acquire(e);
    if (s) return s;
    let i = this.pending.get(e);
    i || (i = t().then((r) => r.release()).finally(() => this.pending.delete(e)), this.pending.set(e, i)), await i;
    const a = this.textures.store.acquire(e);
    if (!a) throw Error("Prepared working set exceeds GPU budget");
    return a;
  }
  async prepare(e, t) {
    const { recipe: s } = e, i = s.color.size, a = Y(e), r = [], c = a.filter((f) => f.stage === "under-art"), o = a.filter((f) => f.stage === "printed-content" || f.stage === "under-finish"), l = a.filter((f) => f.stage === "over-finish"), u = a.filter((f) => f.contributesToEtch), d = a.filter((f) => f.finishCoverage || f.etchCoverage), h = `${s.pack}:`, m = h + JSON.stringify(["color-v1", s.color.key, M([...c, ...o])]), v = h + JSON.stringify(["mask-v1", i, s.edges, s.stamp?.key, M(u)]), w = l.length ? h + JSON.stringify(["over-v1", i, M(l)]) : void 0, g = d.length ? h + JSON.stringify([
      "coverage-v1",
      i,
      d.map((f) => [
        f.clip,
        f.finishCoverage?.add?.key,
        f.finishCoverage?.exclude?.key,
        f.etchCoverage?.add?.key,
        f.etchCoverage?.exclude?.key
      ])
    ]) : void 0, p = s.hologram ? h + JSON.stringify(["hologram-v1", s.hologram.mask.key, s.hologram.mask.size]) : void 0, x = JSON.stringify(
      s.hologram ? [s.hologram.rect, s.hologram.strength, s.hologram.seed ?? 0] : null
    );
    try {
      return r.push(
        await this.ensure(m, async () => {
          const f = c.length ? await P(i, c, this.assets, t) : void 0;
          let b;
          try {
            return b = await z(s.color, this.assets, t, f), await P(i, o, this.assets, t, b), t.throwIfAborted(), this.compositions++, this.textures.upload(m, b);
          } finally {
            f && I(f), b && I(b);
          }
        })
      ), r.push(
        await this.ensure(v, async () => {
          const f = [], b = [];
          try {
            for (const y of s.edges) {
              const T = h + JSON.stringify([
                "edge-integer-v1",
                y.key,
                y.asset,
                y.importedMask,
                y.threshold
              ]), F = await this.ensure(T, async () => {
                const _ = await this.assets.image(y.importedMask ?? y.asset, t);
                try {
                  return t.throwIfAborted(), y.importedMask ? this.textures.upload(T, _.value, !1, 0) : this.textures.edge(T, _.value, y.threshold);
                } finally {
                  _.release();
                }
              });
              b.push(F), f.push({ value: F.value, spec: y });
            }
            for (const y of u) {
              const T = h + JSON.stringify(["contribution-v1", i, M([y])]), F = await this.ensure(T, async () => {
                const _ = await P(i, [y], this.assets, t);
                try {
                  return t.throwIfAborted(), this.textures.edge(T, _, 20);
                } finally {
                  I(_);
                }
              });
              b.push(F), f.push({
                value: F.value,
                spec: {
                  key: T,
                  asset: { url: "" },
                  crop: [0, 0, 1, 1],
                  destination: [0, 0, 1, 1],
                  clip: [0, 0, 1, 1],
                  threshold: 20
                }
              });
            }
            let R;
            if (s.stamp) {
              const y = s.stamp, T = h + JSON.stringify(["stamp-v1", y.key]);
              R = await this.ensure(T, async () => {
                const F = await z(y, this.assets, t);
                try {
                  return t.throwIfAborted(), this.textures.upload(T, F, !1, 0);
                } finally {
                  I(F);
                }
              }), b.push(R);
            }
            return t.throwIfAborted(), this.masks.compose(v, i, f, R?.value);
          } finally {
            for (const R of b) R.release();
          }
        })
      ), w && r.push(
        await this.ensure(w, async () => {
          const f = await P(i, l, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(w, f);
          } finally {
            I(f);
          }
        })
      ), g && r.push(
        await this.ensure(g, async () => {
          const f = await re(i, d, this.assets, t);
          return t.throwIfAborted(), this.textures.uploadBytes(g, f, i);
        })
      ), p && r.push(
        await this.ensure(p, async () => {
          const f = await z(s.hologram.mask, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(p, f, !1);
          } finally {
            I(f);
          }
        })
      ), t.throwIfAborted(), { color: m, mask: v, overlay: w, coverage: g, hologram: p, hologramSettings: x, document: e };
    } finally {
      for (const f of r) f.release();
    }
  }
  dispose() {
    this.masks.dispose();
  }
}
const C = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
let H;
class Be {
  constructor(e) {
    if (this.options = e, this.budgets = {
      gpuBytes: 64 * 1024 * 1024,
      cpuBytes: 32 * 1024 * 1024,
      scratchBytes: 16 * 1024 * 1024,
      preparationConcurrency: 2,
      ...e.budgets
    }, !Number.isInteger(this.budgets.preparationConcurrency) || this.budgets.preparationConcurrency < 1 || this.budgets.preparationConcurrency > 4)
      throw RangeError("Preparation concurrency must be 1–4");
    this.assets = new ue(this.budgets.cpuBytes), this.device = new V(e.canvas), this.textures = new q(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      e.etching
    ), this.preparer = new j(this.textures, this.assets), e.canvas.addEventListener("webglcontextlost", this.contextLost), e.canvas.addEventListener("webglcontextrestored", this.contextRestored);
  }
  options;
  abiVersion = 1;
  assets;
  device;
  textures;
  preparer;
  scene = new ie();
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
      ne(t), Y(t);
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
      deformation: s.deformation ? { ...s.deformation } : void 0
    }));
    for (const s of t)
      if (ce(s), !this.documents.has(s.card)) throw Error(`Unknown card ${s.card}`);
    this.scene.update(
      Uint32Array.from(t, (s) => s.id),
      Float32Array.from(t.flatMap((s) => s.transform)),
      Int32Array.from(t, (s) => s.order ?? 0)
    ), this.instances = t;
  }
  plan(e) {
    return this.shapeData.length !== this.instances.length * 4 && (this.shapeData = new Float32Array(this.instances.length * 4)), this.instances.forEach((t, s) => {
      const i = (this.prepared.get(t.card)?.document ?? this.documents.get(t.card)).recipe, a = s * 4;
      this.shapeData[a] = i.color.size[1] / i.color.size[0], this.shapeData[a + 1] = i.cornerRadius, this.shapeData[a + 2] = t.deformation?.amount ?? 0, this.shapeData[a + 3] = $(t.id);
    }), this.scene.plan_shaped(e.viewProjection, this.shapeData, e.time ?? 0);
  }
  ready(e, t, s) {
    this.assertLive();
    const i = this.documents.get(e);
    if (!i || i.revision !== t)
      return Promise.reject(Error("Requested revision is not current"));
    this.failed.delete(i);
    const a = this.enqueue(i);
    return s ? new Promise((r, c) => {
      if (s.aborted) {
        c(s.reason);
        return;
      }
      const o = () => c(s.reason);
      s.addEventListener("abort", o, { once: !0 }), a.then(r, c).finally(() => s.removeEventListener("abort", o));
    }) : a;
  }
  enqueue(e) {
    const t = this.jobs.get(e.id);
    if (t) return t.promise;
    let s, i;
    const a = new Promise((c, o) => {
      s = c, i = o;
    }), r = {
      document: e,
      controller: new AbortController(),
      promise: a,
      resolve: s,
      reject: i,
      started: !1
    };
    return this.jobs.set(e.id, r), queueMicrotask(() => this.pump()), a;
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
      const u = this.textures.store.acquire(l);
      return u && t.push(u), u?.value;
    }, i = s(e.color), a = s(e.mask), r = s(e.overlay), c = s(e.coverage), o = s(e.hologram);
    return i && a && (!e.overlay || r) && (!e.coverage || c) && (!e.hologram || o) ? {
      face: i,
      mask: a,
      overlay: r,
      coverage: c,
      hologram: o,
      hologramSettings: e.hologramSettings,
      recipe: e.document.recipe
    } : null;
  }
  render(e) {
    if (this.assertLive(), le(e), this.lost) return this.metrics;
    const t = performance.now(), s = this.plan(e), i = [];
    this.lastFrame = e, this.device.begin(e), this.visible = s.length;
    const a = /* @__PURE__ */ new Map(), r = (c) => {
      const o = this.textures.store.acquire("scene:" + c.raster.key);
      if (!o) {
        !this.sceneLayerPending && !this.sceneLayerFailure && this.setSceneLayers(this.sceneLayers).catch(this.options.onError ?? console.error);
        return;
      }
      i.push(o), this.device.drawLayer(
        c,
        o.value,
        c.stage === "hud" ? { ...e, viewProjection: C } : e
      );
    };
    try {
      this.sceneLayers.filter((u) => u.stage === "world-under-cards").forEach(r);
      let c = [], o = null;
      const l = () => {
        o && c.length && this.device.draw(o, e, c), c = [];
      };
      for (const u of s) {
        const d = this.instances[u];
        let h = a.get(d.card);
        if (h === void 0) {
          const m = this.prepared.get(d.card), v = this.documents.get(d.card);
          h = m ? this.material(m, i) : null, a.set(d.card, h), (!h || m?.document !== v) && !this.jobs.has(v.id) && !this.failed.has(v) && this.enqueue(v).catch((w) => {
            w instanceof DOMException && w.name === "AbortError" || this.options.onError?.(w);
          });
        }
        h !== o && (!h || !o || h.face !== o.face || h.mask !== o.mask || h.overlay !== o.overlay || h.coverage !== o.coverage || h.hologram !== o.hologram || h.hologramSettings !== o.hologramSettings || h.recipe.cornerRadius !== o.recipe.cornerRadius || h.recipe.finishCoverageBase !== o.recipe.finishCoverageBase || h.recipe.overlayFoil?.tone !== o.recipe.overlayFoil?.tone || h.recipe.overlayFoil?.strength !== o.recipe.overlayFoil?.strength || JSON.stringify(h.recipe.artWindows) !== JSON.stringify(o.recipe.artWindows)) && (l(), o = h), h && c.push(d);
      }
      l();
      for (const u of ["world-interleaved", "scene-overlay", "hud"])
        this.sceneLayers.filter((d) => d.stage === u).forEach(r);
    } finally {
      for (const c of i) c.release();
      this.device.end();
    }
    return this.frameMs = performance.now() - t, this.metrics;
  }
  async setSceneLayers(e) {
    if (this.assertLive(), this.lost) throw Error("Graphics context is lost");
    if (new Set(e.map((o) => o.id)).size !== e.length)
      throw Error("Duplicate scene layer ID");
    for (const o of e) he(o);
    const t = e.map((o) => ({ ...o, transform: [...o.transform] })), s = ++this.sceneLayerGeneration, i = this.epoch, a = this.textures, r = [];
    this.sceneLayerFailure = !1, this.sceneLayerPending++;
    const c = () => {
      if (this.disposed || this.lost || this.epoch !== i || s !== this.sceneLayerGeneration)
        throw new DOMException("Stale scene layer preparation", "AbortError");
    };
    try {
      for (const o of t) {
        const l = "scene:" + o.raster.key, u = a.store.acquire(l);
        if (u) {
          r.push(u);
          continue;
        }
        const d = await z(o.raster, this.assets, new AbortController().signal);
        try {
          c(), r.push(a.upload(l, d, !1));
        } finally {
          I(d);
        }
      }
      c(), this.sceneLayers = t.sort((o, l) => o.order - l.order || o.id.localeCompare(l.id)), this.options.invalidate?.();
    } catch (o) {
      throw s === this.sceneLayerGeneration && (this.sceneLayerFailure = !0), o;
    } finally {
      for (const o of r) o.release();
      this.sceneLayerPending--;
    }
  }
  hitTest(e, t) {
    const s = this.options.canvas.getBoundingClientRect(), i = this.scene.hit(e / s.width * 2 - 1, 1 - t / s.height * 2);
    if (!i.length) return null;
    const [a, r, c] = i, o = this.instances.find((d) => d.id === a), u = this.prepared.get(o.card)?.document.recipe?.regions.filter((d) => {
      const [h, m, v, w] = d.rect;
      return r >= h && c >= m && r <= h + v && c <= m + w;
    }).sort((d, h) => d.rect[2] * d.rect[3] - h.rect[2] * h.rect[3])[0]?.id;
    return { instance: a, card: o.card, uv: [r, c], part: u ?? null };
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
    this.documents.clear(), this.prepared.clear(), this.sceneLayers = [], this.sceneLayerFailure = !1, this.failed = /* @__PURE__ */ new WeakSet(), this.instances = [], this.device.resetMotion(), this.scene.update(new Uint32Array(), new Float32Array(), new Int32Array()), this.textures.store.clear(), this.assets.clear(), this.lost || this.device.begin({ viewProjection: C });
  }
  contextLost = (e) => {
    e.preventDefault(), this.lost = !0;
    for (const t of this.jobs.keys()) this.cancel(t);
    this.prepared.clear(), this.sceneLayerGeneration++, this.preparer.dispose(), this.textures.store.clear(), this.textures.etcher.dispose(), this.device.dispose();
  };
  contextRestored = () => {
    if (this.disposed) return;
    this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.device = new V(this.options.canvas), this.textures = new q(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      this.options.etching
    ), this.preparer = new j(this.textures, this.assets), this.lost = !1, this.failed = /* @__PURE__ */ new WeakSet();
    const e = this.sceneLayers;
    this.sceneLayers = [], this.setSceneLayers(e).catch(this.options.onError ?? console.error), this.options.invalidate?.(), this.pump();
  };
  async exportCard(e, t) {
    K(t.deformation), await this.ready(e, t.revision);
    const s = this.documents.get(e);
    if (s.revision !== t.revision) throw Error("Export revision changed");
    const i = this.options.canvas, a = [i.width, i.height], r = this.instances, c = this.sceneLayers, o = this.lastFrame;
    if (!Number.isInteger(t.width) || t.width < 1 || t.width > 2048)
      throw RangeError("Invalid export size");
    let l;
    const u = oe(t.deformation, t.width), d = this.device.isolateMotion();
    try {
      i.width = t.width, i.height = Math.round(
        t.width * s.recipe.color.size[1] / s.recipe.color.size[0]
      ), this.sceneLayers = [], this.updateScene([
        {
          id: t.instanceId ?? 0,
          card: e,
          finish: t.finish,
          deformation: t.deformation,
          transform: [2 * u, 0, 0, 0, 0, -2 * u, 0, 0, 0, 0, 1, 0, -u, u, 0, 1]
        }
      ]), this.render({
        viewProjection: C,
        pointer: t.pointer,
        time: t.time ?? o?.time
      }), l = new Promise(
        (h, m) => i.toBlob(
          (v) => v ? h(v) : m(Error("Export failed")),
          "image/png"
        )
      );
    } finally {
      d(), i.width = a[0], i.height = a[1], this.sceneLayers = c, this.updateScene(r), o && this.render(o);
    }
    return l;
  }
  dispose() {
    if (!this.disposed) {
      for (const e of this.jobs.keys()) this.cancel(e);
      this.disposed = !0, this.sceneLayerGeneration++, this.lost || this.device.begin({ viewProjection: C }), this.options.canvas.removeEventListener("webglcontextlost", this.contextLost), this.options.canvas.removeEventListener("webglcontextrestored", this.contextRestored), this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.assets.dispose(), this.scene.free();
    }
  }
}
async function Me(n) {
  return H ??= se(n.wasmUrl ? { module_or_path: n.wasmUrl } : void 0).catch(
    (e) => {
      throw H = void 0, e;
    }
  ), await H, new Be(n);
}
export {
  C as IDENTITY,
  Be as Renderer,
  ze as canvas,
  I as closeRaster,
  Me as createRenderer
};
