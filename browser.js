import { R as K, P as J, l as W, a as N, p as k, b as M, d as S, e as Q, S as Z, _ as ee } from "./raster-Cc-NcJhJ.js";
import { c as De } from "./raster-Cc-NcJhJ.js";
import { F as te } from "./finish-BK9QifIr.js";
const C = (n) => (Math.imul(n + 1, 1597334677) >>> 0) % 65536 / 65536;
function q(n) {
  if (n && (n.kind !== "heat" || !Number.isFinite(n.amount) || n.amount < 0 || n.amount > 0.02))
    throw RangeError("Heat deformation amount must be between 0 and 0.02");
}
function re(n, e) {
  return n?.amount ? e / (e + 4) / (1 + 2 * n.amount) : 1;
}
function B(n) {
  return Number.isInteger(n) && n >= 0 && n <= 4294967295;
}
function L(n) {
  if (n.length !== 4 || n.some((e) => !Number.isFinite(e)) || n[2] <= 0 || n[3] <= 0)
    throw Error("Invalid normalized rectangle");
}
function I(n) {
  if (!n.key || n.key.length > 131072) throw Error("Invalid raster key");
  const [e, t] = n.size;
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 1 || t < 1 || e * t > 4194304)
    throw Error("Invalid raster size");
}
function ie(n) {
  if (!B(n.id) || !Number.isSafeInteger(n.revision) || n.revision < 0)
    throw Error("Invalid card identity");
  const e = n.recipe;
  if (I(e.color), e.stamp && I(e.stamp), !e.pack || e.artWindows.length > 8 || e.edges.length > 32)
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
  e.artWindows.forEach(L), e.regions.forEach((s) => L(s.rect));
  for (const s of e.edges) {
    if (L(s.crop), L(s.destination), L(s.clip), s.crop[0] < 0 || s.crop[1] < 0 || s.crop[0] + s.crop[2] > 1.000001 || s.crop[1] + s.crop[3] > 1.000001)
      throw Error("Crop leaves the source image");
    if (!Number.isInteger(s.threshold) || s.threshold < 0 || s.threshold > 255 || ![-90, 0, 90].includes(s.rotation ?? 0))
      throw Error("Invalid edge recipe");
  }
  for (const s of n.layers ?? []) {
    if (I(s.raster), s.clip && L(s.clip), !Number.isInteger(s.order) || Math.abs(s.order) > 2147483647)
      throw Error("Invalid layer order");
    for (const i of [
      s.finishCoverage?.add,
      s.finishCoverage?.exclude,
      s.etchCoverage?.add,
      s.etchCoverage?.exclude
    ])
      i && I(i);
  }
}
function se(n) {
  if (q(n.deformation), !B(n.id) || !B(n.card) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid instance identity or transform");
  if (!Number.isInteger(n.order ?? 0) || Math.abs(n.order ?? 0) > 2147483647)
    throw Error("Invalid instance order");
  if (!["regular", "etched", "prismatic", "cold", "opal", "rain", "heat", "pool"].includes(
    n.finish ?? "regular"
  ))
    throw Error("Unknown finish");
  if (n.normal && (n.normal.length !== 3 || n.normal.some((e) => !Number.isFinite(e)) || Math.hypot(...n.normal) < 1e-8))
    throw Error("Invalid surface normal");
}
function ae(n) {
  if (!Number.isFinite(n.time ?? 0) || (n.time ?? 0) < 0)
    throw Error("Frame time must be finite, nonnegative seconds");
  if (n.hover && (!B(n.hover.instance) || n.hover.uv.length !== 2 || n.hover.uv.some((e) => !Number.isFinite(e) || e < 0 || e > 1)))
    throw Error("Invalid card-local hover");
}
function oe(n) {
  if (I(n.raster), !n.id || !Number.isInteger(n.order) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid scene layer");
  if (!["world-under-cards", "world-interleaved", "scene-overlay", "hud"].includes(n.stage) || !["test-write", "test-readonly", "ignore"].includes(n.depth))
    throw Error("Invalid scene layer stage or depth");
  if (["scene-overlay", "hud"].includes(n.stage) && n.depth !== "ignore")
    throw Error("Overlay/HUD layers must ignore depth");
}
class Y {
  constructor(e, t) {
    if (this.destroy = t, !Number.isSafeInteger(e) || e < 1 || e > 4294967295)
      throw RangeError("Invalid cache budget");
    this.policy = new K(e);
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
      const o = this.resources.get(r);
      o !== void 0 && this.destroy(o), this.resources.delete(r);
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
async function ne(n, e) {
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
  const r = (a.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), o = r[2] ?? Number.parseFloat(a.getAttribute("width") ?? ""), c = r[3] ?? Number.parseFloat(a.getAttribute("height") ?? "");
  if (!(o > 0 && c > 0 && Number.isFinite(o + c))) throw Error("SVG needs finite dimensions");
  const l = (n.width ?? 512) / Math.max(o, c);
  a.hasAttribute("viewBox") || a.setAttribute("viewBox", `0 0 ${o} ${c}`), a.setAttribute("width", String(Math.max(1, Math.round(o * l)))), a.setAttribute("height", String(Math.max(1, Math.round(c * l))));
  const u = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" })
  ), h = new Image();
  try {
    return h.src = u, await h.decode(), await createImageBitmap(h);
  } finally {
    h.src = "", URL.revokeObjectURL(u);
  }
}
class ce {
  store;
  pending = /* @__PURE__ */ new Map();
  active = 0;
  waiting = [];
  disposed = !1;
  generation = 0;
  controllers = /* @__PURE__ */ new Set();
  decodes = 0;
  constructor(e) {
    this.store = new Y(e, (t) => t.close());
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
      const r = this.generation, o = new AbortController();
      this.controllers.add(o), a = (async () => {
        const c = await this.reserve();
        try {
          if (this.disposed || r !== this.generation) throw Error("Asset scope changed");
          const l = await ne(e, o.signal);
          if (this.decodes++, this.disposed || r !== this.generation)
            throw l.close(), Error("Asset scope changed");
          this.store.insert(s, l, l.width * l.height * 4).release();
        } finally {
          c(), this.controllers.delete(o), r === this.generation && this.pending.delete(s);
        }
      })(), this.pending.set(s, a);
    }
    if (await a, t.throwIfAborted(), i = this.store.acquire(s), !i) throw Error("Decoded working set exceeds CPU budget");
    return i;
  }
  async images(e, t) {
    const s = [], i = /* @__PURE__ */ new Map(), a = await Promise.allSettled(
      e.map(async (c) => {
        const l = await this.image(c, t);
        s.push(l), i.set(c.url, l.value);
      })
    ), r = () => {
      for (const c of s) c.release();
      i.clear();
    }, o = a.find((c) => c.status === "rejected");
    if (o?.status === "rejected")
      throw r(), o.reason;
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
const le = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`, z = `#version 300 es
precision highp float;precision highp int;precision highp usampler2D;
`, he = z + `uniform sampler2D source;layout(location=0) out uvec4 color;
void main(){uvec3 rgb=uvec3(floor(texelFetch(source,ivec2(gl_FragCoord.xy),0).rgb*255.+.5));
uint y=(54u*rgb.r+183u*rgb.g+19u*rgb.b)>>8u;color=uvec4(y,0,0,1);}`, de = z + `uniform usampler2D source;uniform ivec2 size;uniform int mode;uniform int threshold;
layout(location=0) out uvec4 color;
int at(ivec2 p){return int(texelFetch(source,p,0).r);}
void main(){ivec2 p=ivec2(gl_FragCoord.xy);int value=0;
if(mode==1){value=p.x==0||p.x==size.x-1?at(p):(at(p-ivec2(1,0))+2*at(p)+at(p+ivec2(1,0)))>>2;}
else if(mode==2){value=p.y==0||p.y==size.y-1?at(p):(at(p-ivec2(0,1))+2*at(p)+at(p+ivec2(0,1)))>>2;}
else if(p.x>0&&p.y>0&&p.x<size.x-1&&p.y<size.y-1){
int gx=-at(p+ivec2(-1,-1))+at(p+ivec2(1,-1))-2*at(p+ivec2(-1,0))+2*at(p+ivec2(1,0))-at(p+ivec2(-1,1))+at(p+ivec2(1,1));
int gy=-at(p+ivec2(-1,-1))-2*at(p+ivec2(0,-1))-at(p+ivec2(1,-1))+at(p+ivec2(-1,1))+2*at(p+ivec2(0,1))+at(p+ivec2(1,1));
value=clamp((((abs(gx)+abs(gy))>>2)-threshold)*8,0,255);}
color=uvec4(uint(value),0,0,1);}`, ue = z + `uniform usampler2D strength;uniform usampler2D softened;out vec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);uint a=min(255u,max(texelFetch(strength,p,0).r,texelFetch(softened,p,0).r)*2u);color=vec4(float(a)/255.,0.,0.,1.);}`;
function U(n, e, t = le) {
  const s = [], i = n.createProgram();
  try {
    for (const [a, r] of [
      [n.VERTEX_SHADER, t],
      [n.FRAGMENT_SHADER, e]
    ]) {
      const o = n.createShader(a);
      if (s.push(o), n.shaderSource(o, r), n.compileShader(o), !n.getShaderParameter(o, n.COMPILE_STATUS))
        throw Error(n.getShaderInfoLog(o));
      n.attachShader(i, o);
    }
    if (n.linkProgram(i), !n.getProgramParameter(i, n.LINK_STATUS)) throw Error(n.getProgramInfoLog(i));
    return i;
  } catch (a) {
    throw n.deleteProgram(i), a;
  } finally {
    for (const a of s) n.deleteShader(a);
  }
}
function T(n, e, t, s = n.R8, i = n.RED, a = n.UNSIGNED_BYTE) {
  const r = n.createTexture();
  n.bindTexture(n.TEXTURE_2D, r);
  const o = s === n.R8UI ? n.NEAREST : n.LINEAR;
  return n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, o), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, o), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE), n.texImage2D(n.TEXTURE_2D, 0, s, e, t, 0, i, a, null), r;
}
class fe {
  constructor(e) {
    this.gl = e, this.scratch = [], this.width = this.height = 0, this.disposed = !1;
    const t = performance.now();
    this.programs = [];
    try {
      for (const s of [he, de, ue]) this.programs.push(U(e, s));
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
    this.scratch = [], this.width = e, this.height = t, this.input = T(s, e, t, s.RGBA8, s.RGBA), this.scratch.push(this.input);
    for (let i = 0; i < 3; i++) this.scratch.push(T(s, e, t, s.R8UI, s.RED_INTEGER));
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
    this.allocate(t, s), r.bindVertexArray(this.vao), r.disable(r.BLEND), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.viewport(0, 0, t, s), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, this.input), r.pixelStorei(r.UNPACK_ALIGNMENT, 1), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL, r.NONE), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !ArrayBuffer.isView(e)), ArrayBuffer.isView(e) ? r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, t, s, r.RGBA, r.UNSIGNED_BYTE, e) : e !== null && r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, e), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1);
    const [o, c, l] = this.scratch.slice(1), u = a ?? T(r, t, s), h = (p, v, g, E = 0) => {
      r.useProgram(this.programs[p]);
      const f = this.uniforms[p];
      r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, v), r.uniform1i(f.source, 0), r.uniform2i(f.size, t, s), r.uniform1i(f.mode, E), r.uniform1i(f.threshold, i), r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, g, 0), r.drawArrays(r.TRIANGLES, 0, 3);
    };
    h(0, this.input, o), h(1, o, c, 1), h(1, c, l, 2), h(1, l, o, 3), h(1, o, c, 1), h(1, c, l, 2);
    const d = this.uniforms[2];
    return r.useProgram(this.programs[2]), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, o), r.uniform1i(d.strength, 0), r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, l), r.uniform1i(d.softened, 1), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, u, 0), r.drawArrays(r.TRIANGLES, 0, 3), r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(null), u;
  }
  // Validation/measurement only. The real capture feeds the result directly to GL.
  read(e, t = this.width, s = this.height) {
    const i = this.gl, a = new Uint8Array(t * s * 4), r = new Uint8Array(t * s);
    i.bindFramebuffer(i.FRAMEBUFFER, this.framebuffer), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, e, 0), i.readPixels(0, 0, t, s, i.RGBA, i.UNSIGNED_BYTE, a), i.bindFramebuffer(i.FRAMEBUFFER, null);
    for (let o = 0; o < r.length; o++) r[o] = a[o * 4];
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
const pe = `
void rainCap(vec2 delta,float radius,float stretch,float strength,inout vec4 wet){
 vec2 q=delta/vec2(radius,radius*stretch);
 float cap=max(0.,1.-dot(q,q));
 float cover=smoothstep(0.,.22,cap)*strength;
 // The cap gradient bends the image; do not draw a bright circular outline.
 wet.xy+=q*sqrt(cap)*cover;
 wet.z=max(wet.z,cover);
}
vec4 rainField(vec2 uv,vec3 normal){
 vec2 metric=vec2(1.,aspect),p=uv*metric*12.,cell=floor(p);
 vec4 wet=vec4(0.);float t=surfaceTime,seed=surfaceInfo.z*83.;
 // Fine stationary beads form and evaporate at independent times.
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  vec2 id=cell+vec2(float(x),float(y)),initial=surfaceHash2(id+seed);
  float cycle=9.+initial.y*11.,clock=t+initial.x*cycle,age=mod(clock,cycle);
  vec2 rnd=surfaceHash2(id+seed+floor(clock/cycle)*vec2(17.1,29.3));
  float fade=smoothstep(0.,1.,age)*(1.-smoothstep(cycle-2.,cycle,age));
  vec2 delta=p-(id+.18+rnd*.64);
  delta.x+=delta.y*(normal.x*.24+surfaceInfo.x*.4);
  float radius=.085+.105*rnd.x*rnd.x;
  rainCap(delta,radius,1.+rnd.y*.22,fade*step(.18,rnd.y),wet);
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
   vec2 delta=stream-(id+vec2(.2+rnd.x*.6,.2+rnd.y*.6));
   delta.x+=sin(delta.y*3.+rnd.y*6.)*.014+delta.y*normal.x*.13;
   float strength=step(.58,rnd.y),radius=.075+.035*rnd.x;
   rainCap(delta,radius,1.25,strength,wet);
   float trail=exp(-pow(delta.x/(radius*.48),2.))*smoothstep(0.,.10,delta.y)
     *(1.-smoothstep(.10,.72,delta.y))*strength;
   wet.w=max(wet.w,trail);
  }
 }
 wet.xy+=beads.xy*(1.-wet.w);
 wet.z=clamp(max(wet.z,beads.z*(1.-wet.w)),0.,1.);
 return wet;
}
vec3 rainGlass(vec2 uv,vec3 normal){
 vec4 wet=rainField(uv,normal);
 vec2 bend=-wet.xy*vec2(.018,.018/aspect);
 float clear=max(wet.z,wet.w*.8);
 // Sharp lenses and wiped tracks sit over a softly fogged, still readable face.
 vec2 radius=vec2(.0032,.0032/aspect)*(1.-clear);
 vec2 behind=windowSceneUv(uv,normal);
 vec3 ink=softenedInk(behind+bend,radius,surfaceWindow(uv));
 float fog=(.060+.025*surfaceNoise(uv*vec2(3.,4.)+surfaceInfo.z*11.))*(1.-clear);
 ink=mix(ink,vec3(.72,.77,.79),fog);
 vec3 dropNormal=normalize(normal+vec3(wet.xy*1.8,0.));
 float glint=surfaceReflection(uv,dropNormal,65.)*wet.z;
 float shade=max(0.,dot(wet.xy,normalize(vec2(.5,-.7))))*wet.z*.09;
 return ink*(1.-shade)+vec3(.90,.96,1.)*(glint*.30+surfaceReflection(uv,normal,24.)*.018);
}
`, ve = `
vec3 heatHaze(vec2 uv,vec3 normal){
 float t=surfaceTime,seed=surfaceInfo.z*29.;
 vec2 p=uv*vec2(1.8,32.)+vec2(seed,-t*.9)+normal.xy*.4;
 float air=surfaceNoise(p),fine=surfaceNoise(p*vec2(1.7,1.8)+vec2(t*.15,-t*.6));
 float ribbon=sin(uv.y*90.-t*3.1+air*4.+uv.x*1.5);
 vec2 displacement=vec2(ribbon*.0036+(fine-.5)*.0045,(air-.5)*.00065);
 displacement.x+=normal.x*(air-.5)*.01;
 vec2 radius=vec2(.0028+fine*.0012,.0008/aspect);
 vec3 ink=softenedInk(uv+displacement,radius);
 float reflection=surfaceReflection(uv+displacement,normal,24.);
 return ink*vec3(1.01,1.,.99)+vec3(1.,.87,.70)*reflection*.065;
}
`, $ = `
const float waterPeriod=2.;
const float waterDepth=.65;
vec3 waterField(vec2 p,float t){
 const vec2 waves[6]=vec2[6](vec2(6.,2.),vec2(-2.,7.),vec2(8.,-6.),
   vec2(-7.,-4.),vec2(12.,3.),vec2(4.,-11.));
 const float heights[6]=float[6](.008,.006,.003,.004,.0015,.002);
 vec3 field=vec3(0.);
 p-=vec2(.043,.027)*t;
 for(int i=0;i<6;i++){
  vec2 k=waves[i]*3.14159265359;float n=float(i);
  float phase=dot(k,p)-t*(.31+n*.137)+n*2.39;
  field.xy-=k*(heights[i]*sin(phase));
  field.z+=heights[i]*cos(phase);
 }
 return field;
}
`, me = `
uniform sampler2D caustics;
${$}
float floorIrradiance(vec2 p){
 // A small receiving footprint softens subpixel ray folds / mesh boundaries,
 // like a light source with finite angular extent instead of an ideal point.
 vec2 radius=1.25/vec2(textureSize(caustics,0));
 float light=texture(caustics,p).r*.4;
 light+=(texture(caustics,p+vec2(radius.x,0.)).r+texture(caustics,p-vec2(radius.x,0.)).r)*.15;
 light+=(texture(caustics,p+vec2(0.,radius.y)).r+texture(caustics,p-vec2(0.,radius.y)).r)*.15;
 return light*8.;
}
vec2 rippleSlope(vec2 p,vec4 r){
 float age=surfaceTime-r.z;
 if(age<0. || age>2.8 || r.w==0.)return vec2(0.);
 vec2 d=(p-r.xy)*vec2(1.,aspect);float radius=length(d),front=radius-age*.32;
 float envelope=exp(-front*front*180.)*exp(-age*1.4)*smoothstep(0.,.08,age);
 return d/max(radius,.001)*cos(front*65.)*envelope*r.w*.12;
}
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
 vec2 slope=wave.xy+basinSlope;
 slope+=rippleSlope(uv,ripple0)+rippleSlope(uv,ripple1)+rippleSlope(uv,ripple2)+rippleSlope(uv,ripple3);
 // Artwork is painted on the basin floor and moves with the card. Only local
 // water refraction bends it; changing the card's angle does not pan the image.
 vec2 floorUv=uv+slope*vec2(.035,.035/aspect)*clamp(1.+swell*3.,.6,1.4);
 vec2 floorPoint=floorUv*metric+origin+drift;
 float flux=floorIrradiance(floorPoint/waterPeriod);
 vec3 ink=windowInk(floorUv,bounds);
 // Apply irradiance in linear light: divergence dims the floor, focused rays
 // brighten it. Ambient light preserves readability in the darkest troughs.
 vec3 floorLight=ink*vec3(.78,.94,1.)*(.28+.72*flux);
 vec3 waterNormal=normalize(normal+vec3(-slope*.65,0.));
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 float fresnel=.02+.98*pow(1.-max(0.,dot(view,waterNormal)),5.);
 float reflection=surfaceReflection(uv,waterNormal,52.);
 vec3 reflected=vec3(.18,.32,.41)+vec3(.8,.94,1.)*reflection*1.6;
 return previewInk(mix(floorLight,reflected,clamp(fresnel,0.,.6)));
}
`, ge = `
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
 vec2 metric=vec2(1.,aspect),p=(uv-.5)*metric;
 vec2 projected=p-normal.xy*dot(normal.xy,p)/max(.25,1.+normal.z);
 projected/=max(.65,1.+dot(normal.xy,p)/3.5);
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
${pe}
${ve}
${me}
vec3 animatedSurface(vec2 uv,vec3 normal){
 if(previewKind==5.)return rainGlass(uv,normal);
 if(previewKind==6.)return heatHaze(uv,normal);
 return poolWater(uv,normal);
}
`, we = `
vec2 cardSource(vec2 local,float time,vec2 shape){
 float amount=shape.x,phase=shape.y*6.28318530718;
 if(amount==0.)return local;
 return local+amount*vec2(
  .72*sin(local.y*43.+time*2.1+phase)+.28*sin(local.y*81.-time*3.4+phase*.7),
  .18*sin(local.x*29.-time*1.3+phase));
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
gl_Position=viewProjection*model*vec4(local,0.,1.);}`, ye = te.replace(
  "uniform float previewKind;",
  "flat in float previewKind;"
).replaceAll("texture2D(mask,uv).r*hasMask", "edgeCoverage(uv)"), be = `#version 300 es
precision highp float;
in vec2 v_uv;in vec3 v_normal;
uniform sampler2D face;uniform sampler2D mask;uniform sampler2D overlay;uniform sampler2D coverage;
uniform vec2 overlayFoil;
uniform vec2 pointer;uniform vec4 artBounds[8];
uniform float hasMask;uniform float cornerRadius;uniform float aspect;uniform float finishBase;
out vec4 out_color;
#define texture2D texture
float edgeCoverage(vec2 uv){vec4 c=texture(coverage,uv);return max(texture(mask,uv).r*hasMask,c.b)*(1.-c.a);}
${ye}
${ge}
${we}
void main(){
 vec2 source=cardSource(v_uv,surfaceTime,surfaceInfo.wz);
 vec2 uv=vec2(source.x,1.-source.y);
 vec2 corner=abs((uv-.5)*vec2(1.,aspect))-(vec2(.5,aspect*.5)-cornerRadius);
 if(length(max(corner,0.))+min(max(corner.x,corner.y),0.)-cornerRadius>0.)discard;
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 shaded=previewLinear(previewKind>=5. ? animatedSurface(uv,normalize(v_normal)) : previewFoil(uv,normalize(v_normal),view));
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
 out_color=vec4(previewInk(mix(under,printing,top.a)),1.);
}`, Ee = `#version 300 es
precision highp float;in vec2 v_uv;uniform sampler2D face;out vec4 out_color;
void main(){out_color=texture(face,vec2(v_uv.x,1.-v_uv.y));if(out_color.a<.001)discard;}`, G = (n, e) => Math.max(-e, Math.min(e, n));
class X {
  states = /* @__PURE__ */ new Map();
  serial = 0;
  begin() {
    this.serial++;
  }
  sample(e, t) {
    if (!["rain", "heat", "pool"].includes(e.finish ?? "regular")) return;
    const s = t.time ?? 0, i = e.transform, a = e.normal ?? [0, 0, 1], r = [
      i[12] + (i[0] + i[4]) / 2,
      i[13] + (i[1] + i[5]) / 2,
      a[0] / Math.hypot(...a),
      a[1] / Math.hypot(...a)
    ];
    let o = this.states.get(e.id);
    if (!o || s < o.time || s - o.time > 0.5) {
      const u = new Float32Array(20);
      u[2] = C(e.id);
      for (let h = 0; h < 4; h++) u[6 + h * 4] = -100;
      o = {
        time: s,
        seen: this.serial,
        pose: r,
        velocity: [0, 0],
        data: u,
        nextRipple: 0,
        lastRipple: -100,
        hovering: !1
      }, this.states.set(e.id, o);
    }
    o.seen = this.serial;
    const c = Math.min(0.05, s - o.time);
    if (c > 0) {
      const u = [Math.hypot(i[0], i[1], i[2]), Math.hypot(i[4], i[5], i[6])];
      for (let h = 0; h < 2; h++) {
        const d = -(r[h] - o.pose[h]) / Math.max(u[h], 1e-3) * 2 + (r[h + 2] - o.pose[h + 2]) * 3;
        o.velocity[h] += G(d, 0.6);
        for (let p = 0; p < 2; p++)
          o.velocity[h] += (-o.data[h] * 22 - o.velocity[h] * 3.8) * c / 2, o.data[h] = G(
            o.data[h] + o.velocity[h] * c / 2,
            0.35
          );
      }
    }
    const l = t.hover?.instance === e.id ? t.hover : void 0;
    if (l && (!o.hovering || s - o.lastRipple > 0.22)) {
      const u = 4 + o.nextRipple * 4;
      o.data.set([l.uv[0], 1 - l.uv[1], s, 0.8], u), o.nextRipple = (o.nextRipple + 1) % 4, o.lastRipple = s;
    }
    return o.hovering = !!l, o.time = s, o.pose = r, o.data;
  }
  end() {
    for (const [e, t] of this.states) t.seen !== this.serial && this.states.delete(e);
  }
  clear() {
    this.states.clear();
  }
}
const y = 192, F = 512, xe = `#version 300 es
precision highp float;
uniform float time;
out vec2 incoming;
${$}
void main(){
 // Include a skirt around the periodic tile: rays from outside can land inside.
 vec2 p=vec2(gl_VertexID%${y + 1},gl_VertexID/${y + 1})/${y}.*2.4-.2;
 vec3 wave=waterField(p,time);
 vec3 normal=normalize(vec3(-wave.xy,1.));
 vec3 ray=refract(vec3(0.,0.,-1.),normal,1./1.333);
 vec2 floorPoint=p+ray.xy/(-ray.z)*(waterDepth+wave.z);
 incoming=p;
 gl_Position=vec4(floorPoint/waterPeriod*2.-1.,0.,1.);
}`, Re = `#version 300 es
precision highp float;
in vec2 incoming;out vec4 color;
void main(){
 // Each fragment receives the area of its source light footprint. Overlapping
 // folds accumulate by additive blending; expanded footprints become darker.
 vec2 dx=dFdx(incoming),dy=dFdy(incoming);
 float flux=abs(dx.x*dy.y-dx.y*dy.x)*${(F / 2) ** 2}.;
 color=vec4(min(flux,8.)/8.,0.,0.,1.);
}`;
class Te {
  constructor(e) {
    if (this.gl = e, this.shader = U(e, Re, xe), this.clock = e.getUniformLocation(this.shader, "time"), this.map = T(e, F, F), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.REPEAT), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.REPEAT), this.framebuffer = e.createFramebuffer(), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.map, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
      throw e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteProgram(this.shader), Error("Caustics framebuffer is incomplete");
    this.vao = e.createVertexArray(), this.indices = e.createBuffer(), e.bindVertexArray(this.vao), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indices);
    const t = new Uint16Array(y * y * 6);
    for (let s = 0; s < y; s++)
      for (let i = 0; i < y; i++) {
        const a = s * (y + 1) + i, r = a + y + 1;
        t.set([a, a + 1, r, r, a + 1, r + 1], (s * y + i) * 6);
      }
    e.bufferData(e.ELEMENT_ARRAY_BUFFER, t, e.STATIC_DRAW), e.bindVertexArray(null), e.bindFramebuffer(e.FRAMEBUFFER, null);
  }
  gl;
  map;
  bytes = F * F + y * y * 6 * 2;
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
    t.bindFramebuffer(t.FRAMEBUFFER, this.framebuffer), t.viewport(0, 0, F, F), t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.disable(t.SCISSOR_TEST), t.colorMask(!0, !0, !0, !0), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.enable(t.BLEND), t.blendEquation(t.FUNC_ADD), t.blendFunc(t.ONE, t.ONE), t.useProgram(this.shader), t.uniform1f(this.clock, e), t.bindVertexArray(this.vao), t.drawElements(t.TRIANGLES, y * y * 6, t.UNSIGNED_SHORT, 0), t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, t.drawingBufferWidth, t.drawingBufferHeight), t.disable(t.BLEND), this.time = e, this.passes++;
  }
  dispose() {
    const e = this.gl;
    e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteVertexArray(this.vao), e.deleteBuffer(this.indices), e.deleteProgram(this.shader);
  }
}
const Ae = { regular: 0, etched: 1, prismatic: 2, cold: 3, opal: 4, rain: 5, heat: 6, pool: 7 }, A = 40;
class H {
  constructor(e) {
    this.canvas = e;
    const t = e.getContext("webgl2", {
      alpha: !0,
      antialias: !0,
      premultipliedAlpha: !1,
      preserveDrawingBuffer: !0
    });
    if (!t) throw Error("WebGL2 is required");
    this.gl = t, this.caustics = new Te(t), this.foil = U(t, be, O), this.image = U(t, Ee, O), this.vao = t.createVertexArray(), this.quad = t.createBuffer(), this.instances = t.createBuffer(), this.blank = T(t, 1, 1, t.RGBA8, t.RGBA), t.bindTexture(t.TEXTURE_2D, this.blank), t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)), t.bindVertexArray(this.vao), t.bindBuffer(t.ARRAY_BUFFER, this.quad), t.bufferData(
      t.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      t.STATIC_DRAW
    ), t.enableVertexAttribArray(0), t.vertexAttribPointer(0, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, this.instances);
    for (let s = 0; s < 4; s++)
      t.enableVertexAttribArray(1 + s), t.vertexAttribPointer(1 + s, 4, t.FLOAT, !1, A * 4, s * 16), t.vertexAttribDivisor(1 + s, 1);
    t.enableVertexAttribArray(5), t.vertexAttribPointer(5, 3, t.FLOAT, !1, A * 4, 64), t.vertexAttribDivisor(5, 1), t.enableVertexAttribArray(6), t.vertexAttribPointer(6, 1, t.FLOAT, !1, A * 4, 76), t.vertexAttribDivisor(6, 1);
    for (let s = 7; s <= 11; s++)
      t.enableVertexAttribArray(s), t.vertexAttribPointer(s, 4, t.FLOAT, !1, A * 4, 80 + (s - 7) * 16), t.vertexAttribDivisor(s, 1);
    t.bindVertexArray(null);
  }
  canvas;
  gl;
  foil;
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
    const a = s.length * A;
    this.staging.length < a && (this.staging = new Float32Array(a));
    const r = this.staging;
    s.forEach((o, c) => {
      const l = c * A;
      r.set(o.transform, l), r.set(o.normal ?? [0, 0, 1], l + 16), r[l + 19] = Ae[o.finish ?? "regular"];
      const u = this.motion.sample(o, t);
      u ? r.set(u, l + 20) : r.fill(0, l + 20, l + A), r[l + 22] = C(o.id), r[l + 23] = o.deformation?.amount ?? 0;
    }), this.instanceCapacity < a && (this.instanceCapacity = a, i.bufferData(i.ARRAY_BUFFER, a * 4, i.DYNAMIC_DRAW)), i.bufferSubData(i.ARRAY_BUFFER, 0, r, 0, a), i.uniformMatrix4fv(
      i.getUniformLocation(e, "viewProjection"),
      !1,
      t.viewProjection
    );
  }
  draw(e, t, s) {
    const i = this.gl, a = this.foil;
    s.some((h) => h.finish === "pool") && this.caustics.prepare(t.time ?? 0), this.bind(a, t, s), i.enable(i.DEPTH_TEST), i.depthFunc(i.LEQUAL), i.depthMask(!0), i.disable(i.BLEND), [
      ["face", e.face.texture],
      ["mask", e.mask.texture],
      ["overlay", e.overlay?.texture ?? this.blank],
      ["coverage", e.coverage?.texture ?? this.blank],
      ["caustics", this.caustics.map]
    ].forEach(([h, d], p) => {
      i.activeTexture(i.TEXTURE0 + p), i.bindTexture(i.TEXTURE_2D, d), i.uniform1i(i.getUniformLocation(a, h), p);
    });
    const o = e.recipe.artWindows.map(([h, d, p, v]) => [h, 1 - d - v, h + p, 1 - d]), c = new Float32Array(32);
    o.forEach((h, d) => c.set(h, d * 4)), i.uniform4fv(i.getUniformLocation(a, "artBounds[0]"), c), i.uniform1f(i.getUniformLocation(a, "finishBase"), e.recipe.finishCoverageBase ?? 1);
    const l = e.recipe.overlayFoil;
    i.uniform2f(
      i.getUniformLocation(a, "overlayFoil"),
      l ? { gold: 1, silver: 3, prismatic: 2 }[l.tone] : 0,
      l?.strength ?? 0
    ), i.uniform1f(i.getUniformLocation(a, "cornerRadius"), e.recipe.cornerRadius), i.uniform1f(i.getUniformLocation(a, "aspect"), e.face.height / e.face.width);
    const u = t.pointer ?? [0.5, 0.5];
    i.uniform2f(i.getUniformLocation(a, "pointer"), u[0], 1 - u[1]), i.uniform1f(i.getUniformLocation(a, "hasMask"), 1), i.uniform1f(i.getUniformLocation(a, "satinCompact"), 1), i.uniform1f(i.getUniformLocation(a, "satinHoverGain"), 0), i.uniform1f(i.getUniformLocation(a, "surfaceTime"), t.time ?? 0), i.drawArraysInstanced(i.TRIANGLES, 0, 6, s.length), this.draws++;
  }
  drawLayer(e, t, s) {
    const i = this.gl, a = this.image;
    this.bind(a, s, [{ id: 0, card: 0, transform: e.transform }]), e.depth === "ignore" ? i.disable(i.DEPTH_TEST) : (i.enable(i.DEPTH_TEST), i.depthFunc(i.LEQUAL)), i.depthMask(e.depth === "test-write"), i.enable(i.BLEND), i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA), i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, t.texture), i.uniform1i(i.getUniformLocation(a, "face"), 0), i.drawArraysInstanced(i.TRIANGLES, 0, 6, 1), this.draws++, i.depthMask(!0), i.disable(i.BLEND);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0, this.motion.clear();
    const e = this.gl;
    e.deleteProgram(this.foil), e.deleteProgram(this.image), e.deleteVertexArray(this.vao), e.deleteBuffer(this.quad), e.deleteBuffer(this.instances), e.deleteTexture(this.blank), this.caustics.dispose();
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
class V {
  constructor(e, t, s, i = "gpu") {
    this.gl = e, this.scratchLimit = s, this.mode = i, this.store = new Y(t, (a) => e.deleteTexture(a.texture)), this.etcher = new fe(e);
  }
  gl;
  scratchLimit;
  mode;
  store;
  etcher;
  kernels = new J();
  uploads = 0;
  edgeBuilds = 0;
  readbacks = 0;
  upload(e, t, s = !0, i = 1) {
    const a = this.store.acquire(e);
    if (a) return a;
    const r = this.gl, o = t.width, c = t.height;
    return this.store.create(
      e,
      o * c * 4,
      () => {
        const l = T(r, o, c, s ? r.SRGB8_ALPHA8 : r.RGBA8, r.RGBA);
        return r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, l), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !0), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, t), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1), this.uploads++, { texture: l, width: o, height: c };
      },
      i
    );
  }
  edge(e, t, s) {
    const i = this.store.acquire(e);
    if (i) return i;
    const a = this.gl, r = t.width, o = t.height;
    if (r * o * 7 > this.scratchLimit) throw Error("Etching exceeds scratch budget");
    return this.store.create(
      e,
      r * o,
      () => {
        let c;
        if (this.mode === "gpu") c = this.etcher.run(t, r, o, s);
        else {
          const l = document.createElement("canvas");
          l.width = r, l.height = o;
          try {
            const u = l.getContext("2d", { willReadFrequently: !0 });
            u.drawImage(t, 0, 0);
            const h = u.getImageData(0, 0, r, o).data, d = this.kernels.etch(
              r,
              o,
              new Uint8Array(h.buffer, h.byteOffset, h.byteLength),
              s
            ), p = new Uint8Array(d.length);
            for (let v = 0; v < o; v++)
              p.set(d.subarray(v * r, (v + 1) * r), (o - 1 - v) * r);
            c = T(a, r, o), a.bindTexture(a.TEXTURE_2D, c), a.pixelStorei(a.UNPACK_ALIGNMENT, 1), a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, r, o, a.RED, a.UNSIGNED_BYTE, p);
          } finally {
            l.width = l.height = 0;
          }
        }
        return this.uploads++, this.edgeBuilds++, { texture: c, width: r, height: o };
      },
      0
    );
  }
  uploadBytes(e, t, s) {
    const i = this.store.acquire(e);
    if (i) return i;
    const a = this.gl, [r, o] = s, c = new Uint8Array(t.length);
    for (let l = 0; l < o; l++)
      c.set(t.subarray(l * r * 4, (l + 1) * r * 4), (o - 1 - l) * r * 4);
    return this.store.create(e, r * o * 4, () => {
      const l = T(a, r, o, a.RGBA8, a.RGBA);
      return a.bindTexture(a.TEXTURE_2D, l), a.pixelStorei(a.UNPACK_ALIGNMENT, 1), a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !1), a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, r, o, a.RGBA, a.UNSIGNED_BYTE, c), this.uploads++, { texture: l, width: r, height: o };
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
const Fe = `#version 300 es
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
    this.shader = U(t, Fe), this.fbo = t.createFramebuffer(), this.vao = t.createVertexArray();
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
    const r = this.textures.gl, [o, c] = t;
    return this.textures.store.create(e, o * c, () => {
      const l = T(r, o, c);
      try {
        if (r.bindFramebuffer(r.FRAMEBUFFER, this.fbo), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, l, 0), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE)
          throw Error("Mask framebuffer unavailable");
        r.bindVertexArray(this.vao), r.viewport(0, 0, o, c), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.clearColor(0, 0, 0, 0), r.clear(r.COLOR_BUFFER_BIT), r.useProgram(this.shader), r.enable(r.BLEND), r.blendFunc(r.ONE, r.ONE_MINUS_SRC_ALPHA);
        const u = (h, d, p, v, g, E = 0) => {
          r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, h.texture), r.uniform1i(r.getUniformLocation(this.shader, "inputMask"), 0), r.uniform2f(r.getUniformLocation(this.shader, "size"), o, c), r.uniform4fv(r.getUniformLocation(this.shader, "cover"), d), r.uniform4fv(r.getUniformLocation(this.shader, "clip"), p), r.uniform4fv(r.getUniformLocation(this.shader, "crop"), v), r.uniform1f(r.getUniformLocation(this.shader, "alphaChannel"), g ? 1 : 0), r.uniform1f(r.getUniformLocation(this.shader, "angle"), E), r.drawArrays(r.TRIANGLES, 0, 3);
        };
        i && u(i, [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1], !0);
        for (const { value: h, spec: d } of s) {
          const [p, v, g, E] = d.destination, f = d.rotation ?? 0, w = h.width * d.crop[2], R = h.height * d.crop[3], m = Math.max(
            g * o / (f ? R : w),
            E * c / (f ? w : R)
          ), b = (f ? R : w) * m / o, x = (f ? w : R) * m / c;
          u(
            h,
            [p + (g - b) / 2, v + (E - x) / 2, b, x],
            d.clip,
            d.crop,
            !!d.importedMask,
            f
          );
        }
        this.builds++;
      } catch (u) {
        throw r.deleteTexture(l), u;
      } finally {
        r.disable(r.BLEND), r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(null);
      }
      return { texture: l, width: o, height: c };
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
    const { recipe: s } = e, i = s.color.size, a = W(e), r = [], o = a.filter((f) => f.stage === "under-art"), c = a.filter((f) => f.stage === "printed-content" || f.stage === "under-finish"), l = a.filter((f) => f.stage === "over-finish"), u = a.filter((f) => f.contributesToEtch), h = a.filter((f) => f.finishCoverage || f.etchCoverage), d = `${s.pack}:`, p = d + JSON.stringify(["color-v1", s.color.key, N([...o, ...c])]), v = d + JSON.stringify(["mask-v1", i, s.edges, s.stamp?.key, N(u)]), g = l.length ? d + JSON.stringify(["over-v1", i, N(l)]) : void 0, E = h.length ? d + JSON.stringify([
      "coverage-v1",
      i,
      h.map((f) => [
        f.clip,
        f.finishCoverage?.add?.key,
        f.finishCoverage?.exclude?.key,
        f.etchCoverage?.add?.key,
        f.etchCoverage?.exclude?.key
      ])
    ]) : void 0;
    try {
      return r.push(
        await this.ensure(p, async () => {
          const f = o.length ? await k(i, o, this.assets, t) : void 0;
          let w;
          try {
            return w = await M(s.color, this.assets, t, f), await k(i, c, this.assets, t, w), t.throwIfAborted(), this.compositions++, this.textures.upload(p, w);
          } finally {
            f && S(f), w && S(w);
          }
        })
      ), r.push(
        await this.ensure(v, async () => {
          const f = [], w = [];
          try {
            for (const m of s.edges) {
              const b = d + JSON.stringify([
                "edge-integer-v1",
                m.key,
                m.asset,
                m.importedMask,
                m.threshold
              ]), x = await this.ensure(b, async () => {
                const _ = await this.assets.image(m.importedMask ?? m.asset, t);
                try {
                  return t.throwIfAborted(), m.importedMask ? this.textures.upload(b, _.value, !1, 0) : this.textures.edge(b, _.value, m.threshold);
                } finally {
                  _.release();
                }
              });
              w.push(x), f.push({ value: x.value, spec: m });
            }
            for (const m of u) {
              const b = d + JSON.stringify(["contribution-v1", i, N([m])]), x = await this.ensure(b, async () => {
                const _ = await k(i, [m], this.assets, t);
                try {
                  return t.throwIfAborted(), this.textures.edge(b, _, 20);
                } finally {
                  S(_);
                }
              });
              w.push(x), f.push({
                value: x.value,
                spec: {
                  key: b,
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
              const m = s.stamp, b = d + JSON.stringify(["stamp-v1", m.key]);
              R = await this.ensure(b, async () => {
                const x = await M(m, this.assets, t);
                try {
                  return t.throwIfAborted(), this.textures.upload(b, x, !1, 0);
                } finally {
                  S(x);
                }
              }), w.push(R);
            }
            return t.throwIfAborted(), this.masks.compose(v, i, f, R?.value);
          } finally {
            for (const R of w) R.release();
          }
        })
      ), g && r.push(
        await this.ensure(g, async () => {
          const f = await k(i, l, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(g, f);
          } finally {
            S(f);
          }
        })
      ), E && r.push(
        await this.ensure(E, async () => {
          const f = await Q(i, h, this.assets, t);
          return t.throwIfAborted(), this.textures.uploadBytes(E, f, i);
        })
      ), t.throwIfAborted(), { color: p, mask: v, overlay: g, coverage: E, document: e };
    } finally {
      for (const f of r) f.release();
    }
  }
  dispose() {
    this.masks.dispose();
  }
}
const D = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
let P;
class Le {
  constructor(e) {
    if (this.options = e, this.budgets = {
      gpuBytes: 64 * 1024 * 1024,
      cpuBytes: 32 * 1024 * 1024,
      scratchBytes: 16 * 1024 * 1024,
      preparationConcurrency: 2,
      ...e.budgets
    }, !Number.isInteger(this.budgets.preparationConcurrency) || this.budgets.preparationConcurrency < 1 || this.budgets.preparationConcurrency > 4)
      throw RangeError("Preparation concurrency must be 1–4");
    this.assets = new ce(this.budgets.cpuBytes), this.device = new H(e.canvas), this.textures = new V(
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
  scene = new Z();
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
      ie(t), W(t);
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
      if (se(s), !this.documents.has(s.card)) throw Error(`Unknown card ${s.card}`);
    this.scene.update(
      Uint32Array.from(t, (s) => s.id),
      Float32Array.from(t.flatMap((s) => s.transform)),
      Int32Array.from(t, (s) => s.order ?? 0)
    ), this.instances = t;
  }
  plan(e) {
    return this.shapeData.length !== this.instances.length * 4 && (this.shapeData = new Float32Array(this.instances.length * 4)), this.instances.forEach((t, s) => {
      const i = (this.prepared.get(t.card)?.document ?? this.documents.get(t.card)).recipe, a = s * 4;
      this.shapeData[a] = i.color.size[1] / i.color.size[0], this.shapeData[a + 1] = i.cornerRadius, this.shapeData[a + 2] = t.deformation?.amount ?? 0, this.shapeData[a + 3] = C(t.id);
    }), this.scene.plan_shaped(e.viewProjection, this.shapeData, e.time ?? 0);
  }
  ready(e, t, s) {
    this.assertLive();
    const i = this.documents.get(e);
    if (!i || i.revision !== t)
      return Promise.reject(Error("Requested revision is not current"));
    this.failed.delete(i);
    const a = this.enqueue(i);
    return s ? new Promise((r, o) => {
      if (s.aborted) {
        o(s.reason);
        return;
      }
      const c = () => o(s.reason);
      s.addEventListener("abort", c, { once: !0 }), a.then(r, o).finally(() => s.removeEventListener("abort", c));
    }) : a;
  }
  enqueue(e) {
    const t = this.jobs.get(e.id);
    if (t) return t.promise;
    let s, i;
    const a = new Promise((o, c) => {
      s = o, i = c;
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
    const s = (c) => {
      if (!c) return;
      const l = this.textures.store.acquire(c);
      return l && t.push(l), l?.value;
    }, i = s(e.color), a = s(e.mask), r = s(e.overlay), o = s(e.coverage);
    return i && a && (!e.overlay || r) && (!e.coverage || o) ? { face: i, mask: a, overlay: r, coverage: o, recipe: e.document.recipe } : null;
  }
  render(e) {
    if (this.assertLive(), ae(e), this.lost) return this.metrics;
    const t = performance.now(), s = this.plan(e), i = [];
    this.lastFrame = e, this.device.begin(e), this.visible = s.length;
    const a = /* @__PURE__ */ new Map(), r = (o) => {
      const c = this.textures.store.acquire("scene:" + o.raster.key);
      if (!c) {
        !this.sceneLayerPending && !this.sceneLayerFailure && this.setSceneLayers(this.sceneLayers).catch(this.options.onError ?? console.error);
        return;
      }
      i.push(c), this.device.drawLayer(
        o,
        c.value,
        o.stage === "hud" ? { ...e, viewProjection: D } : e
      );
    };
    try {
      this.sceneLayers.filter((u) => u.stage === "world-under-cards").forEach(r);
      let o = [], c = null;
      const l = () => {
        c && o.length && this.device.draw(c, e, o), o = [];
      };
      for (const u of s) {
        const h = this.instances[u];
        let d = a.get(h.card);
        if (d === void 0) {
          const p = this.prepared.get(h.card), v = this.documents.get(h.card);
          d = p ? this.material(p, i) : null, a.set(h.card, d), (!d || p?.document !== v) && !this.jobs.has(v.id) && !this.failed.has(v) && this.enqueue(v).catch((g) => {
            g instanceof DOMException && g.name === "AbortError" || this.options.onError?.(g);
          });
        }
        d !== c && (!d || !c || d.face !== c.face || d.mask !== c.mask || d.overlay !== c.overlay || d.coverage !== c.coverage || d.recipe.cornerRadius !== c.recipe.cornerRadius || d.recipe.finishCoverageBase !== c.recipe.finishCoverageBase || d.recipe.overlayFoil?.tone !== c.recipe.overlayFoil?.tone || d.recipe.overlayFoil?.strength !== c.recipe.overlayFoil?.strength || JSON.stringify(d.recipe.artWindows) !== JSON.stringify(c.recipe.artWindows)) && (l(), c = d), d && o.push(h);
      }
      l();
      for (const u of ["world-interleaved", "scene-overlay", "hud"])
        this.sceneLayers.filter((h) => h.stage === u).forEach(r);
    } finally {
      for (const o of i) o.release();
      this.device.end();
    }
    return this.frameMs = performance.now() - t, this.metrics;
  }
  async setSceneLayers(e) {
    if (this.assertLive(), this.lost) throw Error("Graphics context is lost");
    if (new Set(e.map((c) => c.id)).size !== e.length)
      throw Error("Duplicate scene layer ID");
    for (const c of e) oe(c);
    const t = e.map((c) => ({ ...c, transform: [...c.transform] })), s = ++this.sceneLayerGeneration, i = this.epoch, a = this.textures, r = [];
    this.sceneLayerFailure = !1, this.sceneLayerPending++;
    const o = () => {
      if (this.disposed || this.lost || this.epoch !== i || s !== this.sceneLayerGeneration)
        throw new DOMException("Stale scene layer preparation", "AbortError");
    };
    try {
      for (const c of t) {
        const l = "scene:" + c.raster.key, u = a.store.acquire(l);
        if (u) {
          r.push(u);
          continue;
        }
        const h = await M(c.raster, this.assets, new AbortController().signal);
        try {
          o(), r.push(a.upload(l, h, !1));
        } finally {
          S(h);
        }
      }
      o(), this.sceneLayers = t.sort((c, l) => c.order - l.order || c.id.localeCompare(l.id)), this.options.invalidate?.();
    } catch (c) {
      throw s === this.sceneLayerGeneration && (this.sceneLayerFailure = !0), c;
    } finally {
      for (const c of r) c.release();
      this.sceneLayerPending--;
    }
  }
  hitTest(e, t) {
    const s = this.options.canvas.getBoundingClientRect(), i = this.scene.hit(e / s.width * 2 - 1, 1 - t / s.height * 2);
    if (!i.length) return null;
    const [a, r, o] = i, c = this.instances.find((h) => h.id === a), u = this.prepared.get(c.card)?.document.recipe?.regions.filter((h) => {
      const [d, p, v, g] = h.rect;
      return r >= d && o >= p && r <= d + v && o <= p + g;
    }).sort((h, d) => h.rect[2] * h.rect[3] - d.rect[2] * d.rect[3])[0]?.id;
    return { instance: a, card: c.card, uv: [r, o], part: u ?? null };
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
    this.documents.clear(), this.prepared.clear(), this.sceneLayers = [], this.sceneLayerFailure = !1, this.failed = /* @__PURE__ */ new WeakSet(), this.instances = [], this.device.resetMotion(), this.scene.update(new Uint32Array(), new Float32Array(), new Int32Array()), this.textures.store.clear(), this.assets.clear(), this.lost || this.device.begin({ viewProjection: D });
  }
  contextLost = (e) => {
    e.preventDefault(), this.lost = !0;
    for (const t of this.jobs.keys()) this.cancel(t);
    this.prepared.clear(), this.sceneLayerGeneration++, this.preparer.dispose(), this.textures.store.clear(), this.textures.etcher.dispose(), this.device.dispose();
  };
  contextRestored = () => {
    if (this.disposed) return;
    this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.device = new H(this.options.canvas), this.textures = new V(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      this.options.etching
    ), this.preparer = new j(this.textures, this.assets), this.lost = !1, this.failed = /* @__PURE__ */ new WeakSet();
    const e = this.sceneLayers;
    this.sceneLayers = [], this.setSceneLayers(e).catch(this.options.onError ?? console.error), this.options.invalidate?.(), this.pump();
  };
  async exportCard(e, t) {
    q(t.deformation), await this.ready(e, t.revision);
    const s = this.documents.get(e);
    if (s.revision !== t.revision) throw Error("Export revision changed");
    const i = this.options.canvas, a = [i.width, i.height], r = this.instances, o = this.sceneLayers, c = this.lastFrame;
    if (!Number.isInteger(t.width) || t.width < 1 || t.width > 2048)
      throw RangeError("Invalid export size");
    let l;
    const u = re(t.deformation, t.width), h = this.device.isolateMotion();
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
        viewProjection: D,
        pointer: t.pointer,
        time: t.time ?? c?.time
      }), l = new Promise(
        (d, p) => i.toBlob(
          (v) => v ? d(v) : p(Error("Export failed")),
          "image/png"
        )
      );
    } finally {
      h(), i.width = a[0], i.height = a[1], this.sceneLayers = o, this.updateScene(r), c && this.render(c);
    }
    return l;
  }
  dispose() {
    if (!this.disposed) {
      for (const e of this.jobs.keys()) this.cancel(e);
      this.disposed = !0, this.sceneLayerGeneration++, this.lost || this.device.begin({ viewProjection: D }), this.options.canvas.removeEventListener("webglcontextlost", this.contextLost), this.options.canvas.removeEventListener("webglcontextrestored", this.contextRestored), this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.assets.dispose(), this.scene.free();
    }
  }
}
async function Ue(n) {
  return P ??= ee(n.wasmUrl ? { module_or_path: n.wasmUrl } : void 0).catch(
    (e) => {
      throw P = void 0, e;
    }
  ), await P, new Le(n);
}
export {
  D as IDENTITY,
  Le as Renderer,
  De as canvas,
  S as closeRaster,
  Ue as createRenderer
};
