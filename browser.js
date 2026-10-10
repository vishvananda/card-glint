import { R as j, P as V, l as H, a as S, p as I, b as k, d as _, e as W, S as K, _ as Y } from "./raster-DzjfbiwQ.js";
import { c as ye } from "./raster-DzjfbiwQ.js";
function N(n) {
  return Number.isInteger(n) && n >= 0 && n <= 4294967295;
}
function L(n) {
  if (n.length !== 4 || n.some((e) => !Number.isFinite(e)) || n[2] <= 0 || n[3] <= 0)
    throw Error("Invalid normalized rectangle");
}
function F(n) {
  if (!n.key || n.key.length > 131072) throw Error("Invalid raster key");
  const [e, t] = n.size;
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 1 || t < 1 || e * t > 4194304)
    throw Error("Invalid raster size");
}
function J(n) {
  if (!N(n.id) || !Number.isSafeInteger(n.revision) || n.revision < 0)
    throw Error("Invalid card identity");
  const e = n.recipe;
  if (F(e.color), e.stamp && F(e.stamp), !e.pack || e.artWindows.length > 8 || e.edges.length > 32)
    throw Error("Invalid recipe or too many regions");
  if (!Number.isFinite(e.cornerRadius) || e.cornerRadius < 0 || e.cornerRadius > 0.5)
    throw Error("Invalid corner radius");
  const t = e.finishCoverageBase ?? 1;
  if (!Number.isFinite(t) || t < 0 || t > 1) throw Error("Invalid base coverage");
  e.artWindows.forEach(L), e.regions.forEach((i) => L(i.rect));
  for (const i of e.edges) {
    if (L(i.crop), L(i.destination), L(i.clip), i.crop[0] < 0 || i.crop[1] < 0 || i.crop[0] + i.crop[2] > 1.000001 || i.crop[1] + i.crop[3] > 1.000001)
      throw Error("Crop leaves the source image");
    if (!Number.isInteger(i.threshold) || i.threshold < 0 || i.threshold > 255 || ![-90, 0, 90].includes(i.rotation ?? 0))
      throw Error("Invalid edge recipe");
  }
  for (const i of n.layers ?? []) {
    if (F(i.raster), i.clip && L(i.clip), !Number.isInteger(i.order) || Math.abs(i.order) > 2147483647)
      throw Error("Invalid layer order");
    for (const s of [
      i.finishCoverage?.add,
      i.finishCoverage?.exclude,
      i.etchCoverage?.add,
      i.etchCoverage?.exclude
    ])
      s && F(s);
  }
}
function $(n) {
  if (!N(n.id) || !N(n.card) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
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
  if (n.hover && (!N(n.hover.instance) || n.hover.uv.length !== 2 || n.hover.uv.some((e) => !Number.isFinite(e) || e < 0 || e > 1)))
    throw Error("Invalid card-local hover");
}
function Z(n) {
  if (F(n.raster), !n.id || !Number.isInteger(n.order) || n.transform.length !== 16 || n.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid scene layer");
  if (!["world-under-cards", "world-interleaved", "scene-overlay", "hud"].includes(n.stage) || !["test-write", "test-readonly", "ignore"].includes(n.depth))
    throw Error("Invalid scene layer stage or depth");
  if (["scene-overlay", "hud"].includes(n.stage) && n.depth !== "ignore")
    throw Error("Overlay/HUD layers must ignore depth");
}
class q {
  constructor(e, t) {
    if (this.destroy = t, !Number.isSafeInteger(e) || e < 1 || e > 4294967295)
      throw RangeError("Invalid cache budget");
    this.policy = new j(e);
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
    let s;
    try {
      s = JSON.parse(this.policy.admit(e, i, 1));
    } catch (a) {
      throw this.destroy(t), a;
    }
    for (const a of s.evicted) {
      const r = this.resources.get(a);
      r !== void 0 && this.destroy(r), this.resources.delete(a);
    }
    return this.resources.has(s.handle) ? this.destroy(t) : this.resources.set(s.handle, t), this.lease(s.handle);
  }
  /** Admit and evict before allocating a GPU object, so a miss does not
   * temporarily duplicate the resident cache's entire working set. */
  create(e, t, i, s = 1) {
    if (!Number.isSafeInteger(t) || t < 1 || t > 4294967295)
      throw RangeError("Invalid resource size");
    const a = JSON.parse(
      this.policy.admit(e, t, s)
    );
    for (const r of a.evicted) {
      const o = this.resources.get(r);
      o !== void 0 && this.destroy(o), this.resources.delete(r);
    }
    if (this.resources.has(a.handle)) return this.lease(a.handle);
    try {
      return this.resources.set(a.handle, i()), this.lease(a.handle);
    } catch (r) {
      throw this.policy.remove(a.handle), r;
    }
  }
  lease(e) {
    const t = this.resources.get(e);
    if (t === void 0) throw Error("Resource ownership mismatch");
    this.policy.pin(e, !0);
    const i = this.generation;
    let s = !1;
    return {
      value: t,
      release: () => {
        s || (s = !0, i === this.generation && this.policy.pin(e, !1));
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
  const i = await t.blob();
  if (!i.type.includes("svg"))
    return createImageBitmap(
      i,
      n.width ? { resizeWidth: n.width, resizeQuality: "high" } : {}
    );
  const s = new DOMParser().parseFromString(await i.text(), "image/svg+xml"), a = s.documentElement;
  if (a.localName !== "svg" || s.querySelector("parsererror")) throw Error("Invalid SVG");
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
    this.store = new q(e, (t) => t.close());
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
    let s = this.store.acquire(i);
    if (s) return s;
    let a = this.pending.get(i);
    if (!a) {
      const r = this.generation, o = new AbortController();
      this.controllers.add(o), a = (async () => {
        const c = await this.reserve();
        try {
          if (this.disposed || r !== this.generation) throw Error("Asset scope changed");
          const l = await ee(e, o.signal);
          if (this.decodes++, this.disposed || r !== this.generation)
            throw l.close(), Error("Asset scope changed");
          this.store.insert(i, l, l.width * l.height * 4).release();
        } finally {
          c(), this.controllers.delete(o), r === this.generation && this.pending.delete(i);
        }
      })(), this.pending.set(i, a);
    }
    if (await a, t.throwIfAborted(), s = this.store.acquire(i), !s) throw Error("Decoded working set exceeds CPU budget");
    return s;
  }
  async images(e, t) {
    const i = [], s = /* @__PURE__ */ new Map(), a = await Promise.allSettled(
      e.map(async (c) => {
        const l = await this.image(c, t);
        i.push(l), s.set(c.url, l.value);
      })
    ), r = () => {
      for (const c of i) c.release();
      s.clear();
    }, o = a.find((c) => c.status === "rejected");
    if (o?.status === "rejected")
      throw r(), o.reason;
    return { value: s, release: r };
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
`, se = M + `uniform sampler2D source;layout(location=0) out uvec4 color;
void main(){uvec3 rgb=uvec3(floor(texelFetch(source,ivec2(gl_FragCoord.xy),0).rgb*255.+.5));
uint y=(54u*rgb.r+183u*rgb.g+19u*rgb.b)>>8u;color=uvec4(y,0,0,1);}`, ie = M + `uniform usampler2D source;uniform ivec2 size;uniform int mode;uniform int threshold;
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
function D(n, e, t = re) {
  const i = [], s = n.createProgram();
  try {
    for (const [a, r] of [
      [n.VERTEX_SHADER, t],
      [n.FRAGMENT_SHADER, e]
    ]) {
      const o = n.createShader(a);
      if (i.push(o), n.shaderSource(o, r), n.compileShader(o), !n.getShaderParameter(o, n.COMPILE_STATUS))
        throw Error(n.getShaderInfoLog(o));
      n.attachShader(s, o);
    }
    if (n.linkProgram(s), !n.getProgramParameter(s, n.LINK_STATUS)) throw Error(n.getProgramInfoLog(s));
    return s;
  } catch (a) {
    throw n.deleteProgram(s), a;
  } finally {
    for (const a of i) n.deleteShader(a);
  }
}
function R(n, e, t, i = n.R8, s = n.RED, a = n.UNSIGNED_BYTE) {
  const r = n.createTexture();
  n.bindTexture(n.TEXTURE_2D, r);
  const o = i === n.R8UI ? n.NEAREST : n.LINEAR;
  return n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, o), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, o), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE), n.texImage2D(n.TEXTURE_2D, 0, i, e, t, 0, s, a, null), r;
}
class ae {
  constructor(e) {
    this.gl = e, this.scratch = [], this.width = this.height = 0, this.disposed = !1;
    const t = performance.now();
    this.programs = [];
    try {
      for (const i of [se, ie, oe]) this.programs.push(D(e, i));
    } catch (i) {
      throw this.dispose(), i;
    }
    this.uniforms = this.programs.map(
      (i) => Object.fromEntries(
        ["source", "size", "mode", "threshold", "strength", "softened"].map((s) => [
          s,
          e.getUniformLocation(i, s)
        ])
      )
    ), this.framebuffer = e.createFramebuffer(), this.vao = e.createVertexArray(), this.compileMs = performance.now() - t;
  }
  allocate(e, t) {
    if (e === this.width && t === this.height) return;
    const i = this.gl;
    for (const s of this.scratch) i.deleteTexture(s);
    this.scratch = [], this.width = e, this.height = t, this.input = R(i, e, t, i.RGBA8, i.RGBA), this.scratch.push(this.input);
    for (let s = 0; s < 3; s++) this.scratch.push(R(i, e, t, i.R8UI, i.RED_INTEGER));
    if (i.bindFramebuffer(i.FRAMEBUFFER, this.framebuffer), i.framebufferTexture2D(
      i.FRAMEBUFFER,
      i.COLOR_ATTACHMENT0,
      i.TEXTURE_2D,
      this.scratch[1],
      0
    ), i.checkFramebufferStatus(i.FRAMEBUFFER) !== i.FRAMEBUFFER_COMPLETE)
      throw Error("GPU integer etching framebuffer is unavailable");
  }
  run(e, t, i, s = 20, a = null) {
    if (this.disposed) throw Error("GPU etcher disposed");
    if (!Number.isInteger(t) || !Number.isInteger(i) || t < 1 || i < 1 || t * i > 4194304 || !Number.isInteger(s) || s < 0 || s > 255)
      throw RangeError("Invalid etching dimensions or threshold");
    if (ArrayBuffer.isView(e) && e.byteLength !== t * i * 4)
      throw RangeError("Wrong RGBA input length");
    if (e === null && (t !== this.width || i !== this.height))
      throw Error("Resident input must be uploaded at this size before reuse");
    const r = this.gl;
    this.allocate(t, i), r.bindVertexArray(this.vao), r.disable(r.BLEND), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.viewport(0, 0, t, i), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, this.input), r.pixelStorei(r.UNPACK_ALIGNMENT, 1), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL, r.NONE), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !ArrayBuffer.isView(e)), ArrayBuffer.isView(e) ? r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, t, i, r.RGBA, r.UNSIGNED_BYTE, e) : e !== null && r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, e), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1);
    const [o, c, l] = this.scratch.slice(1), d = a ?? R(r, t, i), h = (p, v, g, x = 0) => {
      r.useProgram(this.programs[p]);
      const f = this.uniforms[p];
      r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, v), r.uniform1i(f.source, 0), r.uniform2i(f.size, t, i), r.uniform1i(f.mode, x), r.uniform1i(f.threshold, s), r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, g, 0), r.drawArrays(r.TRIANGLES, 0, 3);
    };
    h(0, this.input, o), h(1, o, c, 1), h(1, c, l, 2), h(1, l, o, 3), h(1, o, c, 1), h(1, c, l, 2);
    const u = this.uniforms[2];
    return r.useProgram(this.programs[2]), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, o), r.uniform1i(u.strength, 0), r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, l), r.uniform1i(u.softened, 1), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, d, 0), r.drawArrays(r.TRIANGLES, 0, 3), r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(null), d;
  }
  // Validation/measurement only. The real capture feeds the result directly to GL.
  read(e, t = this.width, i = this.height) {
    const s = this.gl, a = new Uint8Array(t * i * 4), r = new Uint8Array(t * i);
    s.bindFramebuffer(s.FRAMEBUFFER, this.framebuffer), s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, e, 0), s.readPixels(0, 0, t, i, s.RGBA, s.UNSIGNED_BYTE, a), s.bindFramebuffer(s.FRAMEBUFFER, null);
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
vec3 refractedInk(vec2 uv){return previewInk(texture(face,clamp(uv,vec2(.002),vec2(.998))).rgb);}
vec3 rainGlass(vec2 uv,vec3 normal){
 vec2 metric=vec2(1.,aspect), p=uv*metric*9.;
 vec2 cell=floor(p), bend=vec2(0.);float light=0.,shade=0.;
 float t=surfaceTime;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  vec2 id=cell+vec2(float(x),float(y));
  float seed=surfaceHash(id+surfaceInfo.z*83.);
  float cycle=5.+seed*7., epoch=floor((t+seed*cycle)/cycle),age=mod(t+seed*cycle,cycle);
  vec2 rnd=surfaceHash2(id+epoch*17.1+surfaceInfo.z*23.);
  float fade=smoothstep(0.,.18,age)*(1.-smoothstep(cycle*.65,cycle,age));
  vec2 center=id+.2+rnd*.6;
  center.y-=max(0.,age-2.5)*max(0.,age-2.5)*.007*(.3+seed);
  vec2 q=(p-center)/(.15+.19*rnd.x);
  q.x+=q.y*(normal.x*.3+surfaceInfo.x);
  q.y/=1.+max(0.,age-2.5)*.055;
  float r=length(q),body=1.-smoothstep(.72,1.,r);
  vec2 lens=q*body*fade;
  bend+=lens*(.014+.009*rnd.x)/metric;
  float rim=exp(-pow((r-.84)*18.,2.))*fade;
  light+=rim*max(0.,dot(normalize(q+vec2(.0001)),normalize(vec2(-.7,.8))))*.34;
  light+=exp(-dot(q-vec2(-.28,.36),q-vec2(-.28,.36))*55.)*fade*.38;
  shade+=rim*max(0.,dot(normalize(q+vec2(.0001)),vec2(.55,-.55)))*.24;
 }
 vec3 ink=refractedInk(uv+bend);
 return ink*(1.-shade)+vec3(.76,.90,1.)*light;
}
vec3 heatHaze(vec2 uv){
 float t=surfaceTime, seed=surfaceInfo.z*29.;
 vec2 p=uv*vec2(3.2,4.4);
 float a=surfaceNoise(p+vec2(seed,t*.45));
 float b=surfaceNoise(p*1.8+vec2(-t*.19,seed+t*.7));
 vec2 curl=vec2(sin(uv.y*32.+a*7.+t*2.4),cos(uv.x*21.+b*6.-t*1.7));
 vec2 displacement=(curl*.0055+vec2(a-.5,b-.5)*.021)*(.6+uv.y*.4);
 vec3 ink=refractedInk(uv+displacement);
 float glow=pow(max(0.,sin(uv.y*12.+a*5.-t*.9)),8.)*.032;
 return ink*vec3(1.018,1.,.98)+vec3(1.,.54,.18)*glow;
}
vec2 rippleSlope(vec2 p,vec4 r){
 float age=surfaceTime-r.z;
 if(age<0. || age>2.8 || r.w==0.)return vec2(0.);
 vec2 d=(p-r.xy)*vec2(1.,aspect);float radius=length(d), front=radius-age*.32;
 float envelope=exp(-front*front*180.)*exp(-age*1.4)*smoothstep(0.,.08,age);
 return d/max(radius,.001)*cos(front*65.)*envelope*r.w*.12;
}
float causticCell(vec2 p,float t){
 vec2 id=floor(p),f=fract(p);float first=8.,second=8.;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  vec2 g=vec2(float(x),float(y)),r=surfaceHash2(id+g);
  vec2 point=g+.5+.32*sin(t*.65+6.2831*r)-f;
  float d=dot(point,point);
  second=min(second,max(first,d));first=min(first,d);
 }
 float edge=sqrt(second)-sqrt(first);
 return pow(1.-smoothstep(.008,.11,edge),2.);
}
vec3 poolWater(vec2 uv,vec3 normal){
 float t=surfaceTime,seed=surfaceInfo.z*19.;
 vec2 p=uv*vec2(1.,aspect),slosh=surfaceInfo.xy;
 vec2 slope=vec2(cos(p.x*10.+p.y*4.+t*1.2+seed),sin(p.y*11.-p.x*3.+t*.95+seed))*.035;
 slope+=vec2(sin(p.y*5.+t*1.4),cos(p.x*6.-t*1.3))*length(slosh)*1.8+slosh*.4;
 slope+=normal.xy*.075;
 slope+=rippleSlope(uv,ripple0)+rippleSlope(uv,ripple1)+rippleSlope(uv,ripple2)+rippleSlope(uv,ripple3);
 vec2 under=uv+slope*vec2(.085,.085/aspect);
 vec2 flow=vec2(sin(p.y*6.+sin(p.x*4.+t*.5)-t*.6),cos(p.x*5.+sin(p.y*3.5-t*.6)+t*.65))*.52;
 float caustics=causticCell(p*6.4+flow+slope*4.+slosh*3.+seed,t);
 caustics+=causticCell(p*8.7-flow*.7-slope*3.+vec2(t*.06,-t*.045),-t)*.28;
 vec3 ink=refractedInk(under)*vec3(.80,.95,.99);
 float reflection=pow(max(0.,dot(normalize(vec3(-slope*3.,1.)),normalize(vec3(-.38,.46,1.)))),36.);
 return ink*(.94+caustics*.40)+vec3(.28,.83,.91)*caustics*.17+vec3(.75,.94,1.)*reflection*.065;
}
vec3 animatedSurface(vec2 uv,vec3 normal){
 if(previewKind==5.)return rainGlass(uv,normal);
 if(previewKind==6.)return heatHaze(uv);
 return poolWater(uv,normal);
}
`, C = `#version 300 es
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
gl_Position=viewProjection*model*vec4(position,0.,1.);}`, he = ce.replace(
  "uniform float previewKind;",
  "flat in float previewKind;"
).replaceAll("texture2D(mask,uv).r*hasMask", "edgeCoverage(uv)"), ue = `#version 300 es
precision highp float;
in vec2 v_uv;in vec3 v_normal;
uniform sampler2D face;uniform sampler2D mask;uniform sampler2D overlay;uniform sampler2D coverage;
uniform vec2 pointer;uniform vec4 artBounds[8];
uniform float hasMask;uniform float cornerRadius;uniform float aspect;uniform float finishBase;
out vec4 out_color;
#define texture2D texture
float edgeCoverage(vec2 uv){vec4 c=texture(coverage,uv);return max(texture(mask,uv).r*hasMask,c.b)*(1.-c.a);}
${he}
${le}
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
}`, de = `#version 300 es
precision highp float;in vec2 v_uv;uniform sampler2D face;out vec4 out_color;
void main(){out_color=texture(face,vec2(v_uv.x,1.-v_uv.y));if(out_color.a<.001)discard;}`, P = (n, e) => Math.max(-e, Math.min(e, n));
class G {
  states = /* @__PURE__ */ new Map();
  serial = 0;
  begin() {
    this.serial++;
  }
  sample(e, t) {
    if (!["rain", "heat", "pool"].includes(e.finish ?? "regular")) return;
    const i = t.time ?? 0, s = e.transform, a = e.normal ?? [0, 0, 1], r = [
      s[12] + (s[0] + s[4]) / 2,
      s[13] + (s[1] + s[5]) / 2,
      a[0] / Math.hypot(...a),
      a[1] / Math.hypot(...a)
    ];
    let o = this.states.get(e.id);
    if (!o || i < o.time || i - o.time > 0.5) {
      const d = new Float32Array(20);
      d[2] = (Math.imul(e.id + 1, 1597334677) >>> 0) % 65536 / 65536;
      for (let h = 0; h < 4; h++) d[6 + h * 4] = -100;
      o = {
        time: i,
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
    const c = Math.min(0.05, i - o.time);
    if (c > 0) {
      const d = [Math.hypot(s[0], s[1], s[2]), Math.hypot(s[4], s[5], s[6])];
      for (let h = 0; h < 2; h++) {
        const u = -(r[h] - o.pose[h]) / Math.max(d[h], 1e-3) * 2 + (r[h + 2] - o.pose[h + 2]) * 3;
        o.velocity[h] += P(u, 0.6);
        for (let p = 0; p < 2; p++)
          o.velocity[h] += (-o.data[h] * 22 - o.velocity[h] * 3.8) * c / 2, o.data[h] = P(
            o.data[h] + o.velocity[h] * c / 2,
            0.35
          );
      }
    }
    const l = t.hover?.instance === e.id ? t.hover : void 0;
    if (l && (!o.hovering || i - o.lastRipple > 0.22)) {
      const d = 4 + o.nextRipple * 4;
      o.data.set([l.uv[0], 1 - l.uv[1], i, 0.8], d), o.nextRipple = (o.nextRipple + 1) % 4, o.lastRipple = i;
    }
    return o.hovering = !!l, o.time = i, o.pose = r, o.data;
  }
  end() {
    for (const [e, t] of this.states) t.seen !== this.serial && this.states.delete(e);
  }
  clear() {
    this.states.clear();
  }
}
const fe = { regular: 0, etched: 1, prismatic: 2, cold: 3, opal: 4, rain: 5, heat: 6, pool: 7 }, A = 40;
class O {
  constructor(e) {
    this.canvas = e;
    const t = e.getContext("webgl2", {
      alpha: !0,
      antialias: !0,
      premultipliedAlpha: !1,
      preserveDrawingBuffer: !0
    });
    if (!t) throw Error("WebGL2 is required");
    this.gl = t, this.foil = D(t, ue, C), this.image = D(t, de, C), this.vao = t.createVertexArray(), this.quad = t.createBuffer(), this.instances = t.createBuffer(), this.blank = R(t, 1, 1, t.RGBA8, t.RGBA), t.bindTexture(t.TEXTURE_2D, this.blank), t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)), t.bindVertexArray(this.vao), t.bindBuffer(t.ARRAY_BUFFER, this.quad), t.bufferData(
      t.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      t.STATIC_DRAW
    ), t.enableVertexAttribArray(0), t.vertexAttribPointer(0, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, this.instances);
    for (let i = 0; i < 4; i++)
      t.enableVertexAttribArray(1 + i), t.vertexAttribPointer(1 + i, 4, t.FLOAT, !1, A * 4, i * 16), t.vertexAttribDivisor(1 + i, 1);
    t.enableVertexAttribArray(5), t.vertexAttribPointer(5, 3, t.FLOAT, !1, A * 4, 64), t.vertexAttribDivisor(5, 1), t.enableVertexAttribArray(6), t.vertexAttribPointer(6, 1, t.FLOAT, !1, A * 4, 76), t.vertexAttribDivisor(6, 1);
    for (let i = 7; i <= 11; i++)
      t.enableVertexAttribArray(i), t.vertexAttribPointer(i, 4, t.FLOAT, !1, A * 4, 80 + (i - 7) * 16), t.vertexAttribDivisor(i, 1);
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
  bind(e, t, i) {
    const s = this.gl;
    s.useProgram(e), s.bindVertexArray(this.vao), s.bindBuffer(s.ARRAY_BUFFER, this.instances);
    const a = i.length * A;
    this.staging.length < a && (this.staging = new Float32Array(a));
    const r = this.staging;
    i.forEach((o, c) => {
      const l = c * A;
      r.set(o.transform, l), r.set(o.normal ?? [0, 0, 1], l + 16), r[l + 19] = fe[o.finish ?? "regular"];
      const d = this.motion.sample(o, t);
      d ? r.set(d, l + 20) : r.fill(0, l + 20, l + A);
    }), this.instanceCapacity < a && (this.instanceCapacity = a, s.bufferData(s.ARRAY_BUFFER, a * 4, s.DYNAMIC_DRAW)), s.bufferSubData(s.ARRAY_BUFFER, 0, r, 0, a), s.uniformMatrix4fv(
      s.getUniformLocation(e, "viewProjection"),
      !1,
      t.viewProjection
    );
  }
  draw(e, t, i) {
    const s = this.gl, a = this.foil;
    this.bind(a, t, i), s.enable(s.DEPTH_TEST), s.depthFunc(s.LEQUAL), s.depthMask(!0), s.disable(s.BLEND), [
      ["face", e.face.texture],
      ["mask", e.mask.texture],
      ["overlay", e.overlay?.texture ?? this.blank],
      ["coverage", e.coverage?.texture ?? this.blank]
    ].forEach(([d, h], u) => {
      s.activeTexture(s.TEXTURE0 + u), s.bindTexture(s.TEXTURE_2D, h), s.uniform1i(s.getUniformLocation(a, d), u);
    });
    const o = e.recipe.artWindows.map(([d, h, u, p]) => [d, 1 - h - p, d + u, 1 - h]), c = new Float32Array(32);
    o.forEach((d, h) => c.set(d, h * 4)), s.uniform4fv(s.getUniformLocation(a, "artBounds[0]"), c), s.uniform1f(s.getUniformLocation(a, "finishBase"), e.recipe.finishCoverageBase ?? 1), s.uniform1f(s.getUniformLocation(a, "cornerRadius"), e.recipe.cornerRadius), s.uniform1f(s.getUniformLocation(a, "aspect"), e.face.height / e.face.width);
    const l = t.pointer ?? [0.5, 0.5];
    s.uniform2f(s.getUniformLocation(a, "pointer"), l[0], 1 - l[1]), s.uniform1f(s.getUniformLocation(a, "hasMask"), 1), s.uniform1f(s.getUniformLocation(a, "satinCompact"), 1), s.uniform1f(s.getUniformLocation(a, "satinHoverGain"), 0), s.uniform1f(s.getUniformLocation(a, "surfaceTime"), t.time ?? 0), s.drawArraysInstanced(s.TRIANGLES, 0, 6, i.length), this.draws++;
  }
  drawLayer(e, t, i) {
    const s = this.gl, a = this.image;
    this.bind(a, i, [{ id: 0, card: 0, transform: e.transform }]), e.depth === "ignore" ? s.disable(s.DEPTH_TEST) : (s.enable(s.DEPTH_TEST), s.depthFunc(s.LEQUAL)), s.depthMask(e.depth === "test-write"), s.enable(s.BLEND), s.blendFuncSeparate(s.SRC_ALPHA, s.ONE_MINUS_SRC_ALPHA, s.ONE, s.ONE_MINUS_SRC_ALPHA), s.activeTexture(s.TEXTURE0), s.bindTexture(s.TEXTURE_2D, t.texture), s.uniform1i(s.getUniformLocation(a, "face"), 0), s.drawArraysInstanced(s.TRIANGLES, 0, 6, 1), this.draws++, s.depthMask(!0), s.disable(s.BLEND);
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
class z {
  constructor(e, t, i, s = "gpu") {
    this.gl = e, this.scratchLimit = i, this.mode = s, this.store = new q(t, (a) => e.deleteTexture(a.texture)), this.etcher = new ae(e);
  }
  gl;
  scratchLimit;
  mode;
  store;
  etcher;
  kernels = new V();
  uploads = 0;
  edgeBuilds = 0;
  readbacks = 0;
  upload(e, t, i = !0, s = 1) {
    const a = this.store.acquire(e);
    if (a) return a;
    const r = this.gl, o = t.width, c = t.height;
    return this.store.create(
      e,
      o * c * 4,
      () => {
        const l = R(r, o, c, i ? r.SRGB8_ALPHA8 : r.RGBA8, r.RGBA);
        return r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, l), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !0), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, t), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1), this.uploads++, { texture: l, width: o, height: c };
      },
      s
    );
  }
  edge(e, t, i) {
    const s = this.store.acquire(e);
    if (s) return s;
    const a = this.gl, r = t.width, o = t.height;
    if (r * o * 7 > this.scratchLimit) throw Error("Etching exceeds scratch budget");
    return this.store.create(
      e,
      r * o,
      () => {
        let c;
        if (this.mode === "gpu") c = this.etcher.run(t, r, o, i);
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
              i
            ), p = new Uint8Array(u.length);
            for (let v = 0; v < o; v++)
              p.set(u.subarray(v * r, (v + 1) * r), (o - 1 - v) * r);
            c = R(a, r, o), a.bindTexture(a.TEXTURE_2D, c), a.pixelStorei(a.UNPACK_ALIGNMENT, 1), a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, r, o, a.RED, a.UNSIGNED_BYTE, p);
          } finally {
            l.width = l.height = 0;
          }
        }
        return this.uploads++, this.edgeBuilds++, { texture: c, width: r, height: o };
      },
      0
    );
  }
  uploadBytes(e, t, i) {
    const s = this.store.acquire(e);
    if (s) return s;
    const a = this.gl, [r, o] = i, c = new Uint8Array(t.length);
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
const pe = `#version 300 es
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
class ve {
  constructor(e) {
    this.textures = e;
    const t = e.gl;
    this.shader = D(t, pe), this.fbo = t.createFramebuffer(), this.vao = t.createVertexArray();
  }
  textures;
  shader;
  fbo;
  vao;
  disposed = !1;
  builds = 0;
  compose(e, t, i, s) {
    const a = this.textures.store.acquire(e);
    if (a) return a;
    const r = this.textures.gl, [o, c] = t;
    return this.textures.store.create(e, o * c, () => {
      const l = R(r, o, c);
      try {
        if (r.bindFramebuffer(r.FRAMEBUFFER, this.fbo), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, l, 0), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE)
          throw Error("Mask framebuffer unavailable");
        r.bindVertexArray(this.vao), r.viewport(0, 0, o, c), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.clearColor(0, 0, 0, 0), r.clear(r.COLOR_BUFFER_BIT), r.useProgram(this.shader), r.enable(r.BLEND), r.blendFunc(r.ONE, r.ONE_MINUS_SRC_ALPHA);
        const d = (h, u, p, v, g, x = 0) => {
          r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, h.texture), r.uniform1i(r.getUniformLocation(this.shader, "inputMask"), 0), r.uniform2f(r.getUniformLocation(this.shader, "size"), o, c), r.uniform4fv(r.getUniformLocation(this.shader, "cover"), u), r.uniform4fv(r.getUniformLocation(this.shader, "clip"), p), r.uniform4fv(r.getUniformLocation(this.shader, "crop"), v), r.uniform1f(r.getUniformLocation(this.shader, "alphaChannel"), g ? 1 : 0), r.uniform1f(r.getUniformLocation(this.shader, "angle"), x), r.drawArrays(r.TRIANGLES, 0, 3);
        };
        s && d(s, [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1], !0);
        for (const { value: h, spec: u } of i) {
          const [p, v, g, x] = u.destination, f = u.rotation ?? 0, w = h.width * u.crop[2], E = h.height * u.crop[3], m = Math.max(
            g * o / (f ? E : w),
            x * c / (f ? w : E)
          ), b = (f ? E : w) * m / o, y = (f ? w : E) * m / c;
          d(
            h,
            [p + (g - b) / 2, v + (x - y) / 2, b, y],
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
    this.textures = e, this.assets = t, this.masks = new ve(e);
  }
  textures;
  assets;
  masks;
  pending = /* @__PURE__ */ new Map();
  compositions = 0;
  async ensure(e, t) {
    const i = this.textures.store.acquire(e);
    if (i) return i;
    let s = this.pending.get(e);
    s || (s = t().then((r) => r.release()).finally(() => this.pending.delete(e)), this.pending.set(e, s)), await s;
    const a = this.textures.store.acquire(e);
    if (!a) throw Error("Prepared working set exceeds GPU budget");
    return a;
  }
  async prepare(e, t) {
    const { recipe: i } = e, s = i.color.size, a = H(e), r = [], o = a.filter((f) => f.stage === "under-art"), c = a.filter((f) => f.stage === "printed-content" || f.stage === "under-finish"), l = a.filter((f) => f.stage === "over-finish"), d = a.filter((f) => f.contributesToEtch), h = a.filter((f) => f.finishCoverage || f.etchCoverage), u = `${i.pack}:`, p = u + JSON.stringify(["color-v1", i.color.key, S([...o, ...c])]), v = u + JSON.stringify(["mask-v1", s, i.edges, i.stamp?.key, S(d)]), g = l.length ? u + JSON.stringify(["over-v1", s, S(l)]) : void 0, x = h.length ? u + JSON.stringify([
      "coverage-v1",
      s,
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
          const f = o.length ? await I(s, o, this.assets, t) : void 0;
          let w;
          try {
            return w = await k(i.color, this.assets, t, f), await I(s, c, this.assets, t, w), t.throwIfAborted(), this.compositions++, this.textures.upload(p, w);
          } finally {
            f && _(f), w && _(w);
          }
        })
      ), r.push(
        await this.ensure(v, async () => {
          const f = [], w = [];
          try {
            for (const m of i.edges) {
              const b = u + JSON.stringify([
                "edge-integer-v1",
                m.key,
                m.asset,
                m.importedMask,
                m.threshold
              ]), y = await this.ensure(b, async () => {
                const T = await this.assets.image(m.importedMask ?? m.asset, t);
                try {
                  return t.throwIfAborted(), m.importedMask ? this.textures.upload(b, T.value, !1, 0) : this.textures.edge(b, T.value, m.threshold);
                } finally {
                  T.release();
                }
              });
              w.push(y), f.push({ value: y.value, spec: m });
            }
            for (const m of d) {
              const b = u + JSON.stringify(["contribution-v1", s, S([m])]), y = await this.ensure(b, async () => {
                const T = await I(s, [m], this.assets, t);
                try {
                  return t.throwIfAborted(), this.textures.edge(b, T, 20);
                } finally {
                  _(T);
                }
              });
              w.push(y), f.push({
                value: y.value,
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
            let E;
            if (i.stamp) {
              const m = i.stamp, b = u + JSON.stringify(["stamp-v1", m.key]);
              E = await this.ensure(b, async () => {
                const y = await k(m, this.assets, t);
                try {
                  return t.throwIfAborted(), this.textures.upload(b, y, !1, 0);
                } finally {
                  _(y);
                }
              }), w.push(E);
            }
            return t.throwIfAborted(), this.masks.compose(v, s, f, E?.value);
          } finally {
            for (const E of w) E.release();
          }
        })
      ), g && r.push(
        await this.ensure(g, async () => {
          const f = await I(s, l, this.assets, t);
          try {
            return t.throwIfAborted(), this.textures.upload(g, f);
          } finally {
            _(f);
          }
        })
      ), x && r.push(
        await this.ensure(x, async () => {
          const f = await W(s, h, this.assets, t);
          return t.throwIfAborted(), this.textures.uploadBytes(x, f, s);
        })
      ), t.throwIfAborted(), { color: p, mask: v, overlay: g, coverage: x, document: e };
    } finally {
      for (const f of r) f.release();
    }
  }
  dispose() {
    this.masks.dispose();
  }
}
const U = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
let B;
class me {
  constructor(e) {
    if (this.options = e, this.budgets = {
      gpuBytes: 64 * 1024 * 1024,
      cpuBytes: 32 * 1024 * 1024,
      scratchBytes: 16 * 1024 * 1024,
      preparationConcurrency: 2,
      ...e.budgets
    }, !Number.isInteger(this.budgets.preparationConcurrency) || this.budgets.preparationConcurrency < 1 || this.budgets.preparationConcurrency > 4)
      throw RangeError("Preparation concurrency must be 1–4");
    this.assets = new te(this.budgets.cpuBytes), this.device = new O(e.canvas), this.textures = new z(
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
  scene = new K();
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
      normal: i.normal ? [...i.normal] : void 0
    }));
    for (const i of t)
      if ($(i), !this.documents.has(i.card)) throw Error(`Unknown card ${i.card}`);
    this.scene.update(
      Uint32Array.from(t, (i) => i.id),
      Float32Array.from(t.flatMap((i) => i.transform)),
      Int32Array.from(t, (i) => i.order ?? 0)
    ), this.instances = t;
  }
  ready(e, t, i) {
    this.assertLive();
    const s = this.documents.get(e);
    if (!s || s.revision !== t)
      return Promise.reject(Error("Requested revision is not current"));
    this.failed.delete(s);
    const a = this.enqueue(s);
    return i ? new Promise((r, o) => {
      if (i.aborted) {
        o(i.reason);
        return;
      }
      const c = () => o(i.reason);
      i.addEventListener("abort", c, { once: !0 }), a.then(r, o).finally(() => i.removeEventListener("abort", c));
    }) : a;
  }
  enqueue(e) {
    const t = this.jobs.get(e.id);
    if (t) return t.promise;
    let i, s;
    const a = new Promise((o, c) => {
      i = o, s = c;
    }), r = {
      document: e,
      controller: new AbortController(),
      promise: a,
      resolve: i,
      reject: s,
      started: !1
    };
    return this.jobs.set(e.id, r), queueMicrotask(() => this.pump()), a;
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
    const i = (c) => {
      if (!c) return;
      const l = this.textures.store.acquire(c);
      return l && t.push(l), l?.value;
    }, s = i(e.color), a = i(e.mask), r = i(e.overlay), o = i(e.coverage);
    return s && a && (!e.overlay || r) && (!e.coverage || o) ? { face: s, mask: a, overlay: r, coverage: o, recipe: e.document.recipe } : null;
  }
  render(e) {
    if (this.assertLive(), Q(e), this.lost) return this.metrics;
    const t = performance.now(), i = this.scene.plan(e.viewProjection), s = [];
    this.lastFrame = e, this.device.begin(e), this.visible = i.length;
    const a = /* @__PURE__ */ new Map(), r = (o) => {
      const c = this.textures.store.acquire("scene:" + o.raster.key);
      if (!c) {
        !this.sceneLayerPending && !this.sceneLayerFailure && this.setSceneLayers(this.sceneLayers).catch(this.options.onError ?? console.error);
        return;
      }
      s.push(c), this.device.drawLayer(
        o,
        c.value,
        o.stage === "hud" ? { ...e, viewProjection: U } : e
      );
    };
    try {
      this.sceneLayers.filter((d) => d.stage === "world-under-cards").forEach(r);
      let o = [], c = null;
      const l = () => {
        c && o.length && this.device.draw(c, e, o), o = [];
      };
      for (const d of i) {
        const h = this.instances[d];
        let u = a.get(h.card);
        if (u === void 0) {
          const p = this.prepared.get(h.card), v = this.documents.get(h.card);
          u = p ? this.material(p, s) : null, a.set(h.card, u), (!u || p?.document !== v) && !this.jobs.has(v.id) && !this.failed.has(v) && this.enqueue(v).catch((g) => {
            g instanceof DOMException && g.name === "AbortError" || this.options.onError?.(g);
          });
        }
        u !== c && (!u || !c || u.face !== c.face || u.mask !== c.mask || u.overlay !== c.overlay || u.coverage !== c.coverage || u.recipe.cornerRadius !== c.recipe.cornerRadius || u.recipe.finishCoverageBase !== c.recipe.finishCoverageBase || JSON.stringify(u.recipe.artWindows) !== JSON.stringify(c.recipe.artWindows)) && (l(), c = u), u && o.push(h);
      }
      l();
      for (const d of ["world-interleaved", "scene-overlay", "hud"])
        this.sceneLayers.filter((h) => h.stage === d).forEach(r);
    } finally {
      for (const o of s) o.release();
      this.device.end();
    }
    return this.frameMs = performance.now() - t, this.metrics;
  }
  async setSceneLayers(e) {
    if (this.assertLive(), this.lost) throw Error("Graphics context is lost");
    if (new Set(e.map((c) => c.id)).size !== e.length)
      throw Error("Duplicate scene layer ID");
    for (const c of e) Z(c);
    const t = e.map((c) => ({ ...c, transform: [...c.transform] })), i = ++this.sceneLayerGeneration, s = this.epoch, a = this.textures, r = [];
    this.sceneLayerFailure = !1, this.sceneLayerPending++;
    const o = () => {
      if (this.disposed || this.lost || this.epoch !== s || i !== this.sceneLayerGeneration)
        throw new DOMException("Stale scene layer preparation", "AbortError");
    };
    try {
      for (const c of t) {
        const l = "scene:" + c.raster.key, d = a.store.acquire(l);
        if (d) {
          r.push(d);
          continue;
        }
        const h = await k(c.raster, this.assets, new AbortController().signal);
        try {
          o(), r.push(a.upload(l, h, !1));
        } finally {
          _(h);
        }
      }
      o(), this.sceneLayers = t.sort((c, l) => c.order - l.order || c.id.localeCompare(l.id)), this.options.invalidate?.();
    } catch (c) {
      throw i === this.sceneLayerGeneration && (this.sceneLayerFailure = !0), c;
    } finally {
      for (const c of r) c.release();
      this.sceneLayerPending--;
    }
  }
  hitTest(e, t) {
    const i = this.options.canvas.getBoundingClientRect(), s = this.scene.hit(e / i.width * 2 - 1, 1 - t / i.height * 2);
    if (!s.length) return null;
    const [a, r, o] = s, c = this.instances.find((h) => h.id === a), d = this.prepared.get(c.card)?.document.recipe?.regions.filter((h) => {
      const [u, p, v, g] = h.rect;
      return r >= u && o >= p && r <= u + v && o <= p + g;
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
    this.documents.clear(), this.prepared.clear(), this.sceneLayers = [], this.sceneLayerFailure = !1, this.failed = /* @__PURE__ */ new WeakSet(), this.instances = [], this.device.resetMotion(), this.scene.update(new Uint32Array(), new Float32Array(), new Int32Array()), this.textures.store.clear(), this.assets.clear(), this.lost || this.device.begin({ viewProjection: U });
  }
  contextLost = (e) => {
    e.preventDefault(), this.lost = !0;
    for (const t of this.jobs.keys()) this.cancel(t);
    this.prepared.clear(), this.sceneLayerGeneration++, this.preparer.dispose(), this.textures.store.clear(), this.textures.etcher.dispose(), this.device.dispose();
  };
  contextRestored = () => {
    if (this.disposed) return;
    this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.device = new O(this.options.canvas), this.textures = new z(
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
    const i = this.documents.get(e);
    if (i.revision !== t.revision) throw Error("Export revision changed");
    const s = this.options.canvas, a = [s.width, s.height], r = this.instances, o = this.sceneLayers, c = this.lastFrame;
    if (!Number.isInteger(t.width) || t.width < 1 || t.width > 2048)
      throw RangeError("Invalid export size");
    let l;
    const d = this.device.isolateMotion();
    try {
      s.width = t.width, s.height = Math.round(
        t.width * i.recipe.color.size[1] / i.recipe.color.size[0]
      ), this.sceneLayers = [], this.updateScene([
        {
          id: 0,
          card: e,
          finish: t.finish,
          transform: [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]
        }
      ]), this.render({
        viewProjection: U,
        pointer: t.pointer,
        time: t.time ?? c?.time
      }), l = new Promise(
        (h, u) => s.toBlob(
          (p) => p ? h(p) : u(Error("Export failed")),
          "image/png"
        )
      );
    } finally {
      d(), s.width = a[0], s.height = a[1], this.sceneLayers = o, this.updateScene(r), c && this.render(c);
    }
    return l;
  }
  dispose() {
    if (!this.disposed) {
      for (const e of this.jobs.keys()) this.cancel(e);
      this.disposed = !0, this.sceneLayerGeneration++, this.lost || this.device.begin({ viewProjection: U }), this.options.canvas.removeEventListener("webglcontextlost", this.contextLost), this.options.canvas.removeEventListener("webglcontextrestored", this.contextRestored), this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.assets.dispose(), this.scene.free();
    }
  }
}
async function we(n) {
  return B ??= Y(n.wasmUrl ? { module_or_path: n.wasmUrl } : void 0).catch(
    (e) => {
      throw B = void 0, e;
    }
  ), await B, new me(n);
}
export {
  U as IDENTITY,
  me as Renderer,
  ye as canvas,
  _ as closeRaster,
  we as createRenderer
};
