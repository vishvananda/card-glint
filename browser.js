import { R as V, P as W, l as H, a as I, p as S, b as D, d as F, e as K, S as q, _ as Y } from "./raster-DzjfbiwQ.js";
import { c as Ae } from "./raster-DzjfbiwQ.js";
function U(n) {
  return Number.isInteger(n) && n >= 0 && n <= 4294967295;
}
function L(n) {
  if (n.length !== 4 || n.some((e) => !Number.isFinite(e)) || n[2] <= 0 || n[3] <= 0)
    throw Error("Invalid normalized rectangle");
}
function _(n) {
  if (!n.key || n.key.length > 131072) throw Error("Invalid raster key");
  const [e, t] = n.size;
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 1 || t < 1 || e * t > 4194304)
    throw Error("Invalid raster size");
}
function J(n) {
  if (!U(n.id) || !Number.isSafeInteger(n.revision) || n.revision < 0)
    throw Error("Invalid card identity");
  const e = n.recipe;
  if (_(e.color), e.stamp && _(e.stamp), !e.pack || e.artWindows.length > 8 || e.edges.length > 32)
    throw Error("Invalid recipe or too many regions");
  if (!Number.isFinite(e.cornerRadius) || e.cornerRadius < 0 || e.cornerRadius > 0.5)
    throw Error("Invalid corner radius");
  const t = e.finishCoverageBase ?? 1;
  if (!Number.isFinite(t) || t < 0 || t > 1) throw Error("Invalid base coverage");
  e.artWindows.forEach(L), e.regions.forEach((s) => L(s.rect));
  for (const s of e.edges) {
    if (L(s.crop), L(s.destination), L(s.clip), s.crop[0] < 0 || s.crop[1] < 0 || s.crop[0] + s.crop[2] > 1.000001 || s.crop[1] + s.crop[3] > 1.000001)
      throw Error("Crop leaves the source image");
    if (!Number.isInteger(s.threshold) || s.threshold < 0 || s.threshold > 255 || ![-90, 0, 90].includes(s.rotation ?? 0))
      throw Error("Invalid edge recipe");
  }
  for (const s of n.layers ?? []) {
    if (_(s.raster), s.clip && L(s.clip), !Number.isInteger(s.order) || Math.abs(s.order) > 2147483647)
      throw Error("Invalid layer order");
    for (const i of [
      s.finishCoverage?.add,
      s.finishCoverage?.exclude,
      s.etchCoverage?.add,
      s.etchCoverage?.exclude
    ])
      i && _(i);
  }
}
function $(n) {
  if (!U(n.id) || !U(n.card) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
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
function Q(n) {
  if (!Number.isFinite(n.time ?? 0) || (n.time ?? 0) < 0)
    throw Error("Frame time must be finite, nonnegative seconds");
  if (n.hover && (!U(n.hover.instance) || n.hover.uv.length !== 2 || n.hover.uv.some((e) => !Number.isFinite(e) || e < 0 || e > 1)))
    throw Error("Invalid card-local hover");
}
function Z(n) {
  if (_(n.raster), !n.id || !Number.isInteger(n.order) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid scene layer");
  if (!["world-under-cards", "world-interleaved", "scene-overlay", "hud"].includes(n.stage) || !["test-write", "test-readonly", "ignore"].includes(n.depth))
    throw Error("Invalid scene layer stage or depth");
  if (["scene-overlay", "hud"].includes(n.stage) && n.depth !== "ignore")
    throw Error("Overlay/HUD layers must ignore depth");
}
class j {
  constructor(e, t) {
    if (this.destroy = t, !Number.isSafeInteger(e) || e < 1 || e > 4294967295)
      throw RangeError("Invalid cache budget");
    this.policy = new V(e);
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
async function ee(n, e) {
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
  const d = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" })
  ), h = new Image();
  try {
    return h.src = d, await h.decode(), await createImageBitmap(h);
  } finally {
    h.src = "", URL.revokeObjectURL(d);
  }
}
class te {
  store;
  pending = /* @__PURE__ */ new Map();
  active = 0;
  waiting = [];
  disposed = !1;
  generation = 0;
  controllers = /* @__PURE__ */ new Set();
  decodes = 0;
  constructor(e) {
    this.store = new j(e, (t) => t.close());
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
          const l = await ee(e, o.signal);
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
const re = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`, M = `#version 300 es
precision highp float;precision highp int;precision highp usampler2D;
`, ie = M + `uniform sampler2D source;layout(location=0) out uvec4 color;
void main(){uvec3 rgb=uvec3(floor(texelFetch(source,ivec2(gl_FragCoord.xy),0).rgb*255.+.5));
uint y=(54u*rgb.r+183u*rgb.g+19u*rgb.b)>>8u;color=uvec4(y,0,0,1);}`, se = M + `uniform usampler2D source;uniform ivec2 size;uniform int mode;uniform int threshold;
layout(location=0) out uvec4 color;
int at(ivec2 p){return int(texelFetch(source,p,0).r);}
void main(){ivec2 p=ivec2(gl_FragCoord.xy);int value=0;
if(mode==1){value=p.x==0||p.x==size.x-1?at(p):(at(p-ivec2(1,0))+2*at(p)+at(p+ivec2(1,0)))>>2;}
else if(mode==2){value=p.y==0||p.y==size.y-1?at(p):(at(p-ivec2(0,1))+2*at(p)+at(p+ivec2(0,1)))>>2;}
else if(p.x>0&&p.y>0&&p.x<size.x-1&&p.y<size.y-1){
int gx=-at(p+ivec2(-1,-1))+at(p+ivec2(1,-1))-2*at(p+ivec2(-1,0))+2*at(p+ivec2(1,0))-at(p+ivec2(-1,1))+at(p+ivec2(1,1));
int gy=-at(p+ivec2(-1,-1))-2*at(p+ivec2(0,-1))-at(p+ivec2(1,-1))+at(p+ivec2(-1,1))+2*at(p+ivec2(0,1))+at(p+ivec2(1,1));
value=clamp((((abs(gx)+abs(gy))>>2)-threshold)*8,0,255);}
color=uvec4(uint(value),0,0,1);}`, oe = M + `uniform usampler2D strength;uniform usampler2D softened;out vec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);uint a=min(255u,max(texelFetch(strength,p,0).r,texelFetch(softened,p,0).r)*2u);color=vec4(float(a)/255.,0.,0.,1.);}`;
function N(n, e, t = re) {
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
function R(n, e, t, s = n.R8, i = n.RED, a = n.UNSIGNED_BYTE) {
  const r = n.createTexture();
  n.bindTexture(n.TEXTURE_2D, r);
  const o = s === n.R8UI ? n.NEAREST : n.LINEAR;
  return n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, o), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, o), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE), n.texImage2D(n.TEXTURE_2D, 0, s, e, t, 0, i, a, null), r;
}
class ae {
  constructor(e) {
    this.gl = e, this.scratch = [], this.width = this.height = 0, this.disposed = !1;
    const t = performance.now();
    this.programs = [];
    try {
      for (const s of [ie, se, oe]) this.programs.push(N(e, s));
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
    this.scratch = [], this.width = e, this.height = t, this.input = R(s, e, t, s.RGBA8, s.RGBA), this.scratch.push(this.input);
    for (let i = 0; i < 3; i++) this.scratch.push(R(s, e, t, s.R8UI, s.RED_INTEGER));
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
    const [o, c, l] = this.scratch.slice(1), d = a ?? R(r, t, s), h = (v, p, g, b = 0) => {
      r.useProgram(this.programs[v]);
      const f = this.uniforms[v];
      r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, p), r.uniform1i(f.source, 0), r.uniform2i(f.size, t, s), r.uniform1i(f.mode, b), r.uniform1i(f.threshold, i), r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, g, 0), r.drawArrays(r.TRIANGLES, 0, 3);
    };
    h(0, this.input, o), h(1, o, c, 1), h(1, c, l, 2), h(1, l, o, 3), h(1, o, c, 1), h(1, c, l, 2);
    const u = this.uniforms[2];
    return r.useProgram(this.programs[2]), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, o), r.uniform1i(u.strength, 0), r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, l), r.uniform1i(u.softened, 1), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, d, 0), r.drawArrays(r.TRIANGLES, 0, 3), r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(null), d;
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
const ne = `
uniform float satinCompact;
uniform float satinHoverGain;
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
  float broad=exp(-dot((broadQ-vec2(-.10,.17))*vec2(2.1,1.1),(broadQ-vec2(-.10,.17))*vec2(2.1,1.1)))*.46;
  float stripAxis=satinStripAxis(uv,normal,view);
  float strip=exp(-pow(stripAxis,2.)*340.)*.32;
  float reflection=broad+strip;
  float fresnel=.10+.75*pow(1.-abs(dot(normal,view)),4.);
  vec3 bands=spectrum(uv.x*.78+uv.y*.34+reflected.x*1.55+reflected.y*.90);
  vec3 substrate=base*vec3(.91,.96,1.02);
  vec3 light=vec3(.82,.93,1.)*reflection*(.78+fresnel);
  if (kind==1.) {
    substrate=base*mix(vec3(1.),vec3(.98,.94,.85),.40);
    reflection=broad*.40+strip*(.16+metal*2.5);
    light=mix(vec3(1.,.86,.61),vec3(1.,.93,.76),metal)*reflection*(.70+fresnel+metal*.90);
  } else if(kind==2.) {
    substrate=base*(.94+.06*mix(vec3(1.),bands,.80));
    // Keep the broad rainbow translucent; concentrate the shine into the
    // reflected strip so the illustration retains its contrast on hover.
    reflection=broad*.24+strip*.58;
    light=mix(vec3(1.,.98,.94),bands,.85)*reflection*(.72+fresnel);
    light+=vec3(1.,.99,.96)*exp(-pow(stripAxis,2.)*620.)*.075;
  } else if(kind==3.) {
    // Keep cold foil's ink contrast while retaining its broad cool reflection.
    light*=.75;
  } else if(kind==4.) {
    // Opal reflects jade and mint light without a cool white veil over its pigment.
    substrate=base*vec3(.94,1.,.96);
    reflection=broad*.24+strip*.58;
    light=vec3(.36,.88,.52)*reflection*(.78+fresnel);
  }
  return substrate+light*(1.+satinHoverGain);
}
vec4 opalFacet(vec2 uv, vec2 tilt, vec3 normal, vec3 view) {
  vec2 grid=uv*vec2(17.,17.*aspect), cell=floor(grid), p=fract(grid);
  float triangle=step(p.x,p.y);
  float seed=fract(sin(dot(cell,vec2(127.1,311.7)))*43758.5453);
  vec3 facet=normalize(vec3((seed-.5)*1.25,(triangle-.5)*.8,1.));
  vec3 lamp=normalize(vec3(tilt*.6+vec2(-.4,.45),1.));
  float flash=pow(max(0.,dot(facet,normalize(lamp+vec3(0.,0.,1.)))),30.);
  flash*=exp(-pow(satinStripAxis(uv,normal,view),2.)*340.);
  vec3 opal=mix(spectrum(seed*.6+triangle*.12+tilt.x*.17),vec3(.96,.98,1.),.45);
  return vec4(opal,.10+flash*.42);
}
`, ce = `
uniform float previewKind;
uniform sampler2D wave;
uniform float hasWave;
// The study was tuned against printed sRGB ink. Preserve those amounts when
// the host uploads sRGB textures and performs the final output conversion.
vec3 previewInk(vec3 c) { return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c)); }
vec3 previewLinear(vec3 c) { return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c)); }
${ne}
float artWindow(vec2 uv) {
  float coverage=0.;
  for(int i=0;i<8;i++){
    vec4 bounds=artBounds[i];
    coverage=max(coverage,step(bounds.x,uv.x)*step(uv.x,bounds.z)*step(bounds.y,uv.y)*step(uv.y,bounds.w));
  }
  return coverage;
}
// Gameplay mask alpha is stored unchanged in a linear R8 red channel.
float contour(vec2 uv) { return texture2D(mask,uv).r*hasMask*artWindow(uv); }
vec3 previewFoil(vec2 uv, vec3 normal, vec3 view) {
  vec3 base=previewInk(texture2D(face,uv).rgb);
  if(previewKind==1.) {
    float etched=texture2D(mask,uv).r*hasMask;
    float art=artWindow(uv), line=etched*art*.45, stamp=etched*(1.-art)/.68*.42;
    base=1.-(1.-base)*(1.-vec3(.78,.56,.24)*.46*line);
    base=mix(base,base*vec3(.66,.45,.20),stamp);
    return satin(uv,base,normal,view,1.,clamp(line+stamp,0.,1.));
  }
  if(previewKind==2. || previewKind==3.) return satin(uv,base,normal,view,previewKind,0.);
  vec2 tilt=(pointer-.5)*2.;
  if(previewKind==4.) {
    vec4 facet=opalFacet(uv,tilt,normal,view);
    float highlight=exp(-pow(satinStripAxis(uv,normal,view),2.)*340.);
    vec3 lamp=normalize(vec3(tilt*.6+vec2(-.4,.45),1.));
    base=mix(base,facet.rgb,facet.a);
    float h=contour(uv); vec2 d=vec2(.002,0.);
    vec2 slope=vec2(contour(uv+d)-contour(uv-d),contour(uv+d.yx)-contour(uv-d.yx));
    float pressure=.35+1.65*exp(-dot(uv-pointer,uv-pointer)*42.);
    vec3 relief=normalize(vec3(-slope*pressure*8.,1.));
    float shade=max(0.,dot(relief,lamp));
    float glint=pow(max(0.,dot(relief,normalize(lamp+vec3(0.,0.,1.)))),48.)*highlight;
    // Stronger bevel contrast and mint highlights keep the raised contour
    // visible without increasing the broad satin wash or triangular facets.
    base=base*(1.+h*(shade-.5)*.80)+vec3(.52,.97,.74)*glint*h*1.05;
    float stamp=clamp(texture2D(mask,uv).r*hasMask*(1.-artWindow(uv))/.68,0.,1.);
    // Jade pigment preserves the printed rules. Its mint glint follows the
    // same reflected strip as the satin surface, including card tilt.
    base*=mix(vec3(1.),vec3(.36,.72,.51),stamp*.34);
    return mix(base,satin(uv,base,normal,view,4.,0.),.75)+vec3(.52,.97,.74)*highlight*stamp*.28;
  }

  return base;
}`, le = `
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
 vec2 radius=vec2(.0020,.0020/aspect)*(1.-clear);
 vec3 ink=softenedInk(uv+bend,radius);
 float fog=(.030+.015*surfaceNoise(uv*vec2(3.,4.)+surfaceInfo.z*11.))*(1.-clear);
 ink=mix(ink,vec3(.72,.77,.79),fog);
 vec3 dropNormal=normalize(normal+vec3(wet.xy*1.8,0.));
 float glint=surfaceReflection(uv,dropNormal,65.)*wet.z;
 float shade=max(0.,dot(wet.xy,normalize(vec2(.5,-.7))))*wet.z*.09;
 return ink*(1.-shade)+vec3(.90,.96,1.)*(glint*.30+surfaceReflection(uv,normal,24.)*.018);
}
`, he = `
vec3 heatHaze(vec2 uv,vec3 normal){
 float t=surfaceTime,seed=surfaceInfo.z*29.;
 vec2 p=uv*vec2(1.8,32.)+vec2(seed,-t*.9)+normal.xy*.4;
 float air=surfaceNoise(p),fine=surfaceNoise(p*vec2(1.7,1.8)+vec2(t*.15,-t*.6));
 float ribbon=sin(uv.y*90.-t*3.1+air*4.+uv.x*1.5);
 vec2 displacement=vec2(ribbon*.0036+(fine-.5)*.0045,(air-.5)*.00065);
 displacement.x+=normal.x*(air-.5)*.01;
 vec2 radius=vec2(.0016+fine*.0008,.0004/aspect);
 vec3 ink=softenedInk(uv+displacement,radius);
 float reflection=surfaceReflection(uv+displacement,normal,24.);
 return ink*vec3(1.01,1.,.99)+vec3(1.,.87,.70)*reflection*.065;
}
`, ue = `
vec2 rippleSlope(vec2 p,vec4 r){
 float age=surfaceTime-r.z;
 if(age<0. || age>2.8 || r.w==0.)return vec2(0.);
 vec2 d=(p-r.xy)*vec2(1.,aspect);float radius=length(d),front=radius-age*.32;
 float envelope=exp(-front*front*180.)*exp(-age*1.4)*smoothstep(0.,.08,age);
 return d/max(radius,.001)*cos(front*65.)*envelope*r.w*.12;
}
struct PoolField{vec2 slope;vec3 curvature;};
PoolField poolField(vec2 p,float t){
 const vec2 waves[6]=vec2[6](vec2(18.,6.),vec2(-7.,23.),vec2(25.,-19.),
   vec2(-22.,-13.),vec2(38.,9.),vec2(12.,-35.));
 const float heights[6]=float[6](.0038,.0028,.0018,.0024,.0009,.0011);
 PoolField field=PoolField(vec2(0.),vec3(0.));
 // Continuous transport, not cells oscillating around fixed lattice centers.
 p-=vec2(.043,.027)*t;
 for(int i=0;i<6;i++){
  vec2 k=waves[i];float n=float(i);
  float phase=dot(k,p)-t*(.31+n*.137)+surfaceInfo.z*37.+n*2.39;
  field.slope-=k*(heights[i]*sin(phase));
  field.curvature-=vec3(k.x*k.x,k.y*k.y,k.x*k.y)*(heights[i]*cos(phase));
 }
 return field;
}
float poolFocus(vec3 curvature){
 // Area of a refracted light footprint: convergence brightens the pool floor.
 // Bounded and filtered at folds; this is not a multi-ray caustic solver.
 vec3 h=curvature*.72;
 float determinant=(1.+h.x)*(1.+h.y)-h.z*h.z;
 float width=max(.065,fwidth(determinant)*.65);
 return pow(width/(abs(determinant)+width),1.25);
}
vec3 poolWater(vec2 uv,vec3 normal){
 float t=surfaceTime;
 vec2 p=uv*vec2(1.,aspect),slosh=surfaceInfo.xy;
 PoolField field=poolField(p,t);
 vec2 slope=field.slope;
 slope+=vec2(sin(p.y*5.+t*1.4),cos(p.x*6.-t*1.3))*length(slosh)*1.8+slosh*.4;
 slope+=normal.xy*.075;
 slope+=rippleSlope(uv,ripple0)+rippleSlope(uv,ripple1)+rippleSlope(uv,ripple2)+rippleSlope(uv,ripple3);
 vec2 under=uv+slope*vec2(.055,.055/aspect);
 // One inverse-footprint estimate moves the focused light onto the floor.
 PoolField floorField=poolField(p-field.slope*.72+slosh*.25,t);
 float caustics=poolFocus(floorField.curvature);
 vec3 ink=refractedInk(under)*vec3(.86,.97,1.);
 vec3 waterNormal=normalize(normal+vec3(-slope*1.5,0.));
 float reflection=surfaceReflection(uv,waterNormal,36.);
 return ink*(.96+caustics*.52)+vec3(.50,.91,1.)*caustics*.22+vec3(.75,.94,1.)*reflection*.12;
}
`, de = `
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
// Small, linear-light cross filter. Radius can be anisotropic; no blur texture.
vec3 softenedInk(vec2 uv,vec2 radius){
 vec3 ink=surfaceInk(uv)*.4;
 ink+=(surfaceInk(uv+vec2(radius.x,0.))+surfaceInk(uv-vec2(radius.x,0.)))*.15;
 ink+=(surfaceInk(uv+vec2(0.,radius.y))+surfaceInk(uv-vec2(0.,radius.y)))*.15;
 return previewInk(ink);
}
float surfaceReflection(vec2 uv,vec3 normal,float sharpness){
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 lamp=normalize(vec3(-.24,.32,1.));
 return pow(max(0.,dot(reflect(-view,normal),lamp)),sharpness);
}
${le}
${he}
${ue}
vec3 animatedSurface(vec2 uv,vec3 normal){
 if(previewKind==5.)return rainGlass(uv,normal);
 if(previewKind==6.)return heatHaze(uv,normal);
 return poolWater(uv,normal);
}
`, P = `#version 300 es
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
void main(){v_uv=position;v_normal=instanceNormal;previewKind=instanceFinish;
surfaceInfo=instanceSurface;ripple0=instanceRipple0;ripple1=instanceRipple1;ripple2=instanceRipple2;ripple3=instanceRipple3;
gl_Position=viewProjection*model*vec4(position,0.,1.);}`, fe = ce.replace(
  "uniform float previewKind;",
  "flat in float previewKind;"
).replaceAll("texture2D(mask,uv).r*hasMask", "edgeCoverage(uv)"), ve = `#version 300 es
precision highp float;
in vec2 v_uv;in vec3 v_normal;
uniform sampler2D face;uniform sampler2D mask;uniform sampler2D overlay;uniform sampler2D coverage;
uniform vec2 pointer;uniform vec4 artBounds[8];
uniform float hasMask;uniform float cornerRadius;uniform float aspect;uniform float finishBase;
out vec4 out_color;
#define texture2D texture
float edgeCoverage(vec2 uv){vec4 c=texture(coverage,uv);return max(texture(mask,uv).r*hasMask,c.b)*(1.-c.a);}
${fe}
${de}
void main(){
 vec2 uv=vec2(v_uv.x,1.-v_uv.y);
 vec2 corner=abs((uv-.5)*vec2(1.,aspect))-(vec2(.5,aspect*.5)-cornerRadius);
 if(length(max(corner,0.))+min(max(corner.x,corner.y),0.)-cornerRadius>0.)discard;
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 shaded=previewLinear(previewKind>=5. ? animatedSurface(uv,normalize(v_normal)) : previewFoil(uv,normalize(v_normal),view));
 vec3 base=texture(face,uv).rgb;
 vec4 c=texture(coverage,uv),top=texture(overlay,uv);
 vec3 under=mix(base,shaded,max(finishBase,c.r)*(1.-c.g));
 out_color=vec4(previewInk(mix(under,top.rgb,top.a)),1.);
}`, pe = `#version 300 es
precision highp float;in vec2 v_uv;uniform sampler2D face;out vec4 out_color;
void main(){out_color=texture(face,vec2(v_uv.x,1.-v_uv.y));if(out_color.a<.001)discard;}`, C = (n, e) => Math.max(-e, Math.min(e, n));
class G {
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
      const d = new Float32Array(20);
      d[2] = (Math.imul(e.id + 1, 1597334677) >>> 0) % 65536 / 65536;
      for (let h = 0; h < 4; h++) d[6 + h * 4] = -100;
      o = {
        time: s,
        seen: this.serial,
        pose: r,
        velocity: [0, 0],
        data: d,
        nextRipple: 0,
        lastRipple: -100,
        hovering: !1
      }, this.states.set(e.id, o);
    }
    o.seen = this.serial;
    const c = Math.min(0.05, s - o.time);
    if (c > 0) {
      const d = [Math.hypot(i[0], i[1], i[2]), Math.hypot(i[4], i[5], i[6])];
      for (let h = 0; h < 2; h++) {
        const u = -(r[h] - o.pose[h]) / Math.max(d[h], 1e-3) * 2 + (r[h + 2] - o.pose[h + 2]) * 3;
        o.velocity[h] += C(u, 0.6);
        for (let v = 0; v < 2; v++)
          o.velocity[h] += (-o.data[h] * 22 - o.velocity[h] * 3.8) * c / 2, o.data[h] = C(
            o.data[h] + o.velocity[h] * c / 2,
            0.35
          );
      }
    }
    const l = t.hover?.instance === e.id ? t.hover : void 0;
    if (l && (!o.hovering || s - o.lastRipple > 0.22)) {
      const d = 4 + o.nextRipple * 4;
      o.data.set([l.uv[0], 1 - l.uv[1], s, 0.8], d), o.nextRipple = (o.nextRipple + 1) % 4, o.lastRipple = s;
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
const me = { regular: 0, etched: 1, prismatic: 2, cold: 3, opal: 4, rain: 5, heat: 6, pool: 7 }, A = 40;
class z {
  constructor(e) {
    this.canvas = e;
    const t = e.getContext("webgl2", {
      alpha: !0,
      antialias: !0,
      premultipliedAlpha: !1,
      preserveDrawingBuffer: !0
    });
    if (!t) throw Error("WebGL2 is required");
    this.gl = t, this.foil = N(t, ve, P), this.image = N(t, pe, P), this.vao = t.createVertexArray(), this.quad = t.createBuffer(), this.instances = t.createBuffer(), this.blank = R(t, 1, 1, t.RGBA8, t.RGBA), t.bindTexture(t.TEXTURE_2D, this.blank), t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)), t.bindVertexArray(this.vao), t.bindBuffer(t.ARRAY_BUFFER, this.quad), t.bufferData(
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
  motion = new G();
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
      r.set(o.transform, l), r.set(o.normal ?? [0, 0, 1], l + 16), r[l + 19] = me[o.finish ?? "regular"];
      const d = this.motion.sample(o, t);
      d ? r.set(d, l + 20) : r.fill(0, l + 20, l + A);
    }), this.instanceCapacity < a && (this.instanceCapacity = a, i.bufferData(i.ARRAY_BUFFER, a * 4, i.DYNAMIC_DRAW)), i.bufferSubData(i.ARRAY_BUFFER, 0, r, 0, a), i.uniformMatrix4fv(
      i.getUniformLocation(e, "viewProjection"),
      !1,
      t.viewProjection
    );
  }
  draw(e, t, s) {
    const i = this.gl, a = this.foil;
    this.bind(a, t, s), i.enable(i.DEPTH_TEST), i.depthFunc(i.LEQUAL), i.depthMask(!0), i.disable(i.BLEND), [
      ["face", e.face.texture],
      ["mask", e.mask.texture],
      ["overlay", e.overlay?.texture ?? this.blank],
      ["coverage", e.coverage?.texture ?? this.blank]
    ].forEach(([d, h], u) => {
      i.activeTexture(i.TEXTURE0 + u), i.bindTexture(i.TEXTURE_2D, h), i.uniform1i(i.getUniformLocation(a, d), u);
    });
    const o = e.recipe.artWindows.map(([d, h, u, v]) => [d, 1 - h - v, d + u, 1 - h]), c = new Float32Array(32);
    o.forEach((d, h) => c.set(d, h * 4)), i.uniform4fv(i.getUniformLocation(a, "artBounds[0]"), c), i.uniform1f(i.getUniformLocation(a, "finishBase"), e.recipe.finishCoverageBase ?? 1), i.uniform1f(i.getUniformLocation(a, "cornerRadius"), e.recipe.cornerRadius), i.uniform1f(i.getUniformLocation(a, "aspect"), e.face.height / e.face.width);
    const l = t.pointer ?? [0.5, 0.5];
    i.uniform2f(i.getUniformLocation(a, "pointer"), l[0], 1 - l[1]), i.uniform1f(i.getUniformLocation(a, "hasMask"), 1), i.uniform1f(i.getUniformLocation(a, "satinCompact"), 1), i.uniform1f(i.getUniformLocation(a, "satinHoverGain"), 0), i.uniform1f(i.getUniformLocation(a, "surfaceTime"), t.time ?? 0), i.drawArraysInstanced(i.TRIANGLES, 0, 6, s.length), this.draws++;
  }
  drawLayer(e, t, s) {
    const i = this.gl, a = this.image;
    this.bind(a, s, [{ id: 0, card: 0, transform: e.transform }]), e.depth === "ignore" ? i.disable(i.DEPTH_TEST) : (i.enable(i.DEPTH_TEST), i.depthFunc(i.LEQUAL)), i.depthMask(e.depth === "test-write"), i.enable(i.BLEND), i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA), i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, t.texture), i.uniform1i(i.getUniformLocation(a, "face"), 0), i.drawArraysInstanced(i.TRIANGLES, 0, 6, 1), this.draws++, i.depthMask(!0), i.disable(i.BLEND);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0, this.motion.clear();
    const e = this.gl;
    e.deleteProgram(this.foil), e.deleteProgram(this.image), e.deleteVertexArray(this.vao), e.deleteBuffer(this.quad), e.deleteBuffer(this.instances), e.deleteTexture(this.blank);
  }
  end() {
    this.motion.end();
  }
  resetMotion() {
    this.motion.clear();
  }
  isolateMotion() {
    const e = this.motion;
    return this.motion = new G(), () => {
      this.motion = e;
    };
  }
}
class O {
  constructor(e, t, s, i = "gpu") {
    this.gl = e, this.scratchLimit = s, this.mode = i, this.store = new j(t, (a) => e.deleteTexture(a.texture)), this.etcher = new ae(e);
  }
  gl;
  scratchLimit;
  mode;
  store;
  etcher;
  kernels = new W();
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
        const l = R(r, o, c, s ? r.SRGB8_ALPHA8 : r.RGBA8, r.RGBA);
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
            const d = l.getContext("2d", { willReadFrequently: !0 });
            d.drawImage(t, 0, 0);
            const h = d.getImageData(0, 0, r, o).data, u = this.kernels.etch(
              r,
              o,
              new Uint8Array(h.buffer, h.byteOffset, h.byteLength),
              s
            ), v = new Uint8Array(u.length);
            for (let p = 0; p < o; p++)
              v.set(u.subarray(p * r, (p + 1) * r), (o - 1 - p) * r);
            c = R(a, r, o), a.bindTexture(a.TEXTURE_2D, c), a.pixelStorei(a.UNPACK_ALIGNMENT, 1), a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, r, o, a.RED, a.UNSIGNED_BYTE, v);
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
      const l = R(a, r, o, a.RGBA8, a.RGBA);
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
const ge = `#version 300 es
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
class we {
  constructor(e) {
    this.textures = e;
    const t = e.gl;
    this.shader = N(t, ge), this.fbo = t.createFramebuffer(), this.vao = t.createVertexArray();
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
      const l = R(r, o, c);
      try {
        if (r.bindFramebuffer(r.FRAMEBUFFER, this.fbo), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, l, 0), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE)
          throw Error("Mask framebuffer unavailable");
        r.bindVertexArray(this.vao), r.viewport(0, 0, o, c), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.clearColor(0, 0, 0, 0), r.clear(r.COLOR_BUFFER_BIT), r.useProgram(this.shader), r.enable(r.BLEND), r.blendFunc(r.ONE, r.ONE_MINUS_SRC_ALPHA);
        const d = (h, u, v, p, g, b = 0) => {
          r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, h.texture), r.uniform1i(r.getUniformLocation(this.shader, "inputMask"), 0), r.uniform2f(r.getUniformLocation(this.shader, "size"), o, c), r.uniform4fv(r.getUniformLocation(this.shader, "cover"), u), r.uniform4fv(r.getUniformLocation(this.shader, "clip"), v), r.uniform4fv(r.getUniformLocation(this.shader, "crop"), p), r.uniform1f(r.getUniformLocation(this.shader, "alphaChannel"), g ? 1 : 0), r.uniform1f(r.getUniformLocation(this.shader, "angle"), b), r.drawArrays(r.TRIANGLES, 0, 3);
        };
        i && d(i, [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1], !0);
        for (const { value: h, spec: u } of s) {
          const [v, p, g, b] = u.destination, f = u.rotation ?? 0, w = h.width * u.crop[2], E = h.height * u.crop[3], m = Math.max(
            g * o / (f ? E : w),
            b * c / (f ? w : E)
          ), x = (f ? E : w) * m / o, y = (f ? w : E) * m / c;
          d(
            h,
            [v + (g - x) / 2, p + (b - y) / 2, x, y],
            u.clip,
            u.crop,
            !!u.importedMask,
            f
          );
        }
        this.builds++;
      } catch (d) {
        throw r.deleteTexture(l), d;
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
class X {
  constructor(e, t) {
    this.textures = e, this.assets = t, this.masks = new we(e);
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
    const { recipe: s } = e, i = s.color.size, a = H(e), r = [], o = a.filter((f) => f.stage === "under-art"), c = a.filter((f) => f.stage === "printed-content" || f.stage === "under-finish"), l = a.filter((f) => f.stage === "over-finish"), d = a.filter((f) => f.contributesToEtch), h = a.filter((f) => f.finishCoverage || f.etchCoverage), u = `${s.pack}:`, v = u + JSON.stringify(["color-v1", s.color.key, I([...o, ...c])]), p = u + JSON.stringify(["mask-v1", i, s.edges, s.stamp?.key, I(d)]), g = l.length ? u + JSON.stringify(["over-v1", i, I(l)]) : void 0, b = h.length ? u + JSON.stringify([
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
        await this.ensure(v, async () => {
          const f = o.length ? await S(i, o, this.assets, t) : void 0;
          let w;
          try {
            return w = await D(s.color, this.assets, t, f), await S(i, c, this.assets, t, w), t.throwIfAborted(), this.compositions++, this.textures.upload(v, w);
          } finally {
            f && F(f), w && F(w);
          }
        })
      ), r.push(
        await this.ensure(p, async () => {
          const f = [], w = [];
          try {
            for (const m of s.edges) {
              const x = u + JSON.stringify([
                "edge-integer-v1",
                m.key,
                m.asset,
                m.importedMask,
                m.threshold
              ]), y = await this.ensure(x, async () => {
                const T = await this.assets.image(m.importedMask ?? m.asset, t);
                try {
                  return t.throwIfAborted(), m.importedMask ? this.textures.upload(x, T.value, !1, 0) : this.textures.edge(x, T.value, m.threshold);
                } finally {
                  T.release();
                }
              });
              w.push(y), f.push({ value: y.value, spec: m });
            }
            for (const m of d) {
              const x = u + JSON.stringify(["contribution-v1", i, I([m])]), y = await this.ensure(x, async () => {
                const T = await S(i, [m], this.assets, t);
                try {
                  return t.throwIfAborted(), this.textures.edge(x, T, 20);
                } finally {
                  F(T);
                }
              });
              w.push(y), f.push({
                value: y.value,
                spec: {
                  key: x,
                  asset: { url: "" },
                  crop: [0, 0, 1, 1],
                  destination: [0, 0, 1, 1],
                  clip: [0, 0, 1, 1],
                  threshold: 20
                }
              });
            }
            let E;
            if (s.stamp) {
              const m = s.stamp, x = u + JSON.stringify(["stamp-v1", m.key]);
              E = await this.ensure(x, async () => {
                const y = await D(m, this.assets, t);
                try {
                  return t.throwIfAborted(), this.textures.upload(x, y, !1, 0);
                } finally {
                  F(y);
                }
              }), w.push(E);
            }
            return t.throwIfAborted(), this.masks.compose(p, i, f, E?.value);
          } finally {
            for (const E of w) E.release();
          }
        })
      ), g && r.push(
        await this.ensure(g, async () => {
          const f = await S(i, l, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(g, f);
          } finally {
            F(f);
          }
        })
      ), b && r.push(
        await this.ensure(b, async () => {
          const f = await K(i, h, this.assets, t);
          return t.throwIfAborted(), this.textures.uploadBytes(b, f, i);
        })
      ), t.throwIfAborted(), { color: v, mask: p, overlay: g, coverage: b, document: e };
    } finally {
      for (const f of r) f.release();
    }
  }
  dispose() {
    this.masks.dispose();
  }
}
const k = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
let B;
class xe {
  constructor(e) {
    if (this.options = e, this.budgets = {
      gpuBytes: 64 * 1024 * 1024,
      cpuBytes: 32 * 1024 * 1024,
      scratchBytes: 16 * 1024 * 1024,
      preparationConcurrency: 2,
      ...e.budgets
    }, !Number.isInteger(this.budgets.preparationConcurrency) || this.budgets.preparationConcurrency < 1 || this.budgets.preparationConcurrency > 4)
      throw RangeError("Preparation concurrency must be 1–4");
    this.assets = new te(this.budgets.cpuBytes), this.device = new z(e.canvas), this.textures = new O(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      e.etching
    ), this.preparer = new X(this.textures, this.assets), e.canvas.addEventListener("webglcontextlost", this.contextLost), e.canvas.addEventListener("webglcontextrestored", this.contextRestored);
  }
  options;
  abiVersion = 1;
  assets;
  device;
  textures;
  preparer;
  scene = new q();
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
  budgets;
  assertLive() {
    if (this.disposed) throw Error("Renderer disposed");
  }
  upsertCards(e) {
    if (this.assertLive(), new Set(e.map((t) => t.id)).size !== e.length)
      throw Error("Duplicate document ID");
    for (const t of e) {
      J(t), H(t);
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
      normal: s.normal ? [...s.normal] : void 0
    }));
    for (const s of t)
      if ($(s), !this.documents.has(s.card)) throw Error(`Unknown card ${s.card}`);
    this.scene.update(
      Uint32Array.from(t, (s) => s.id),
      Float32Array.from(t.flatMap((s) => s.transform)),
      Int32Array.from(t, (s) => s.order ?? 0)
    ), this.instances = t;
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
    if (this.assertLive(), Q(e), this.lost) return this.metrics;
    const t = performance.now(), s = this.scene.plan(e.viewProjection), i = [];
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
        o.stage === "hud" ? { ...e, viewProjection: k } : e
      );
    };
    try {
      this.sceneLayers.filter((d) => d.stage === "world-under-cards").forEach(r);
      let o = [], c = null;
      const l = () => {
        c && o.length && this.device.draw(c, e, o), o = [];
      };
      for (const d of s) {
        const h = this.instances[d];
        let u = a.get(h.card);
        if (u === void 0) {
          const v = this.prepared.get(h.card), p = this.documents.get(h.card);
          u = v ? this.material(v, i) : null, a.set(h.card, u), (!u || v?.document !== p) && !this.jobs.has(p.id) && !this.failed.has(p) && this.enqueue(p).catch((g) => {
            g instanceof DOMException && g.name === "AbortError" || this.options.onError?.(g);
          });
        }
        u !== c && (!u || !c || u.face !== c.face || u.mask !== c.mask || u.overlay !== c.overlay || u.coverage !== c.coverage || u.recipe.cornerRadius !== c.recipe.cornerRadius || u.recipe.finishCoverageBase !== c.recipe.finishCoverageBase || JSON.stringify(u.recipe.artWindows) !== JSON.stringify(c.recipe.artWindows)) && (l(), c = u), u && o.push(h);
      }
      l();
      for (const d of ["world-interleaved", "scene-overlay", "hud"])
        this.sceneLayers.filter((h) => h.stage === d).forEach(r);
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
    for (const c of e) Z(c);
    const t = e.map((c) => ({ ...c, transform: [...c.transform] })), s = ++this.sceneLayerGeneration, i = this.epoch, a = this.textures, r = [];
    this.sceneLayerFailure = !1, this.sceneLayerPending++;
    const o = () => {
      if (this.disposed || this.lost || this.epoch !== i || s !== this.sceneLayerGeneration)
        throw new DOMException("Stale scene layer preparation", "AbortError");
    };
    try {
      for (const c of t) {
        const l = "scene:" + c.raster.key, d = a.store.acquire(l);
        if (d) {
          r.push(d);
          continue;
        }
        const h = await D(c.raster, this.assets, new AbortController().signal);
        try {
          o(), r.push(a.upload(l, h, !1));
        } finally {
          F(h);
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
    const [a, r, o] = i, c = this.instances.find((h) => h.id === a), d = this.prepared.get(c.card)?.document.recipe?.regions.filter((h) => {
      const [u, v, p, g] = h.rect;
      return r >= u && o >= v && r <= u + p && o <= v + g;
    }).sort((h, u) => h.rect[2] * h.rect[3] - u.rect[2] * u.rect[3])[0]?.id;
    return { instance: a, card: c.card, uv: [r, o], part: d ?? null };
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
      cpuFrameMs: this.frameMs
    };
  }
  resetEpoch(e) {
    if (this.assertLive(), !Number.isSafeInteger(e) || e <= this.epoch) throw Error("Epoch must increase");
    this.epoch = e, this.sceneLayerGeneration++;
    for (const t of this.jobs.keys()) this.cancel(t);
    this.documents.clear(), this.prepared.clear(), this.sceneLayers = [], this.sceneLayerFailure = !1, this.failed = /* @__PURE__ */ new WeakSet(), this.instances = [], this.device.resetMotion(), this.scene.update(new Uint32Array(), new Float32Array(), new Int32Array()), this.textures.store.clear(), this.assets.clear(), this.lost || this.device.begin({ viewProjection: k });
  }
  contextLost = (e) => {
    e.preventDefault(), this.lost = !0;
    for (const t of this.jobs.keys()) this.cancel(t);
    this.prepared.clear(), this.sceneLayerGeneration++, this.preparer.dispose(), this.textures.store.clear(), this.textures.etcher.dispose(), this.device.dispose();
  };
  contextRestored = () => {
    if (this.disposed) return;
    this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.device = new z(this.options.canvas), this.textures = new O(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      this.options.etching
    ), this.preparer = new X(this.textures, this.assets), this.lost = !1, this.failed = /* @__PURE__ */ new WeakSet();
    const e = this.sceneLayers;
    this.sceneLayers = [], this.setSceneLayers(e).catch(this.options.onError ?? console.error), this.options.invalidate?.(), this.pump();
  };
  async exportCard(e, t) {
    await this.ready(e, t.revision);
    const s = this.documents.get(e);
    if (s.revision !== t.revision) throw Error("Export revision changed");
    const i = this.options.canvas, a = [i.width, i.height], r = this.instances, o = this.sceneLayers, c = this.lastFrame;
    if (!Number.isInteger(t.width) || t.width < 1 || t.width > 2048)
      throw RangeError("Invalid export size");
    let l;
    const d = this.device.isolateMotion();
    try {
      i.width = t.width, i.height = Math.round(
        t.width * s.recipe.color.size[1] / s.recipe.color.size[0]
      ), this.sceneLayers = [], this.updateScene([
        {
          id: 0,
          card: e,
          finish: t.finish,
          transform: [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]
        }
      ]), this.render({
        viewProjection: k,
        pointer: t.pointer,
        time: t.time ?? c?.time
      }), l = new Promise(
        (h, u) => i.toBlob(
          (v) => v ? h(v) : u(Error("Export failed")),
          "image/png"
        )
      );
    } finally {
      d(), i.width = a[0], i.height = a[1], this.sceneLayers = o, this.updateScene(r), c && this.render(c);
    }
    return l;
  }
  dispose() {
    if (!this.disposed) {
      for (const e of this.jobs.keys()) this.cancel(e);
      this.disposed = !0, this.sceneLayerGeneration++, this.lost || this.device.begin({ viewProjection: k }), this.options.canvas.removeEventListener("webglcontextlost", this.contextLost), this.options.canvas.removeEventListener("webglcontextrestored", this.contextRestored), this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.assets.dispose(), this.scene.free();
    }
  }
}
async function ye(n) {
  return B ??= Y(n.wasmUrl ? { module_or_path: n.wasmUrl } : void 0).catch(
    (e) => {
      throw B = void 0, e;
    }
  ), await B, new xe(n);
}
export {
  k as IDENTITY,
  xe as Renderer,
  Ae as canvas,
  F as closeRaster,
  ye as createRenderer
};
