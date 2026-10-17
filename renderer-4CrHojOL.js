import { v as q } from "./image-cover-QdXNryDE.js";
import { v as G, p as b, t as _, W as K, S as Y, C as J, a as U, s as T, e as Q } from "./caustics-BcoLQAX8.js";
import { S as Z, _ as ee } from "./renderer-Dz0LYE_V.js";
import { f as te } from "./asset-fetch-BSXnVtJ9.js";
import { R as re, T as B } from "./textures-DTvVPz-u.js";
import { a as ie } from "./foil-preview-shader-DUb7R5u0.js";
import { Preparer as N } from "./prepare-BrQGYlED.js";
import { layersOf as se, paintRaster as oe, closeRaster as ae } from "./raster-8MSDN7In.js";
function E(s) {
  return Number.isInteger(s) && s >= 0 && s <= 4294967295;
}
function w(s) {
  if (s.length !== 4 || s.some((e) => !Number.isFinite(e)) || s[2] <= 0 || s[3] <= 0)
    throw Error("Invalid normalized rectangle");
}
function x(s) {
  if (!s.key || s.key.length > 131072) throw Error("Invalid raster key");
  const [e, t] = s.size;
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 1 || t < 1 || e * t > 4194304)
    throw Error("Invalid raster size");
}
function ne(s) {
  if (!E(s.id) || !Number.isSafeInteger(s.revision) || s.revision < 0)
    throw Error("Invalid card identity");
  const e = s.recipe;
  if (x(e.color), e.stamp && x(e.stamp), !e.pack || e.artWindows.length > 8 || e.edges.length > 32)
    throw Error("Invalid recipe or too many regions");
  if (!Number.isFinite(e.cornerRadius) || e.cornerRadius < 0 || e.cornerRadius > 0.5)
    throw Error("Invalid corner radius");
  const t = e.finishCoverageBase ?? 1;
  if (!Number.isFinite(t) || t < 0 || t > 1) throw Error("Invalid base coverage");
  if (e.overlayFoil) {
    const { tone: r, strength: i } = e.overlayFoil;
    if (!["gold", "silver", "prismatic"].includes(r) || !Number.isFinite(i) || i < 0 || i > 1)
      throw Error("Invalid overlay foil");
  }
  if (e.hologram) {
    const { mask: r, rect: i, strength: a, seed: l = 0 } = e.hologram;
    if (x(r), w(i), !Number.isFinite(a) || a < 0 || a > 1 || !E(l))
      throw Error("Invalid hologram material");
  }
  e.artWindows.forEach(w), e.regions.forEach((r) => w(r.rect));
  for (const r of e.edges) {
    if (r.fit !== void 0 && q(r.fit), w(r.crop), w(r.destination), w(r.clip), r.crop[0] < 0 || r.crop[1] < 0 || r.crop[0] + r.crop[2] > 1.000001 || r.crop[1] + r.crop[3] > 1.000001)
      throw Error("Crop leaves the source image");
    if (!Number.isInteger(r.threshold) || r.threshold < 0 || r.threshold > 255 || ![-90, 0, 90].includes(r.rotation ?? 0))
      throw Error("Invalid edge recipe");
  }
  for (const r of s.layers ?? []) {
    if (x(r.raster), r.clip && w(r.clip), !Number.isInteger(r.order) || Math.abs(r.order) > 2147483647)
      throw Error("Invalid layer order");
    for (const i of [
      r.finishCoverage?.add,
      r.finishCoverage?.exclude,
      r.etchCoverage?.add,
      r.etchCoverage?.exclude
    ])
      i && x(i);
  }
}
function ce(s) {
  if (s.rainFog !== void 0 && (!Number.isFinite(s.rainFog) || s.rainFog < 0 || s.rainFog > 2))
    throw Error("Invalid rain fog density");
  if (s.printDots?.inset !== void 0 && (!Number.isFinite(s.printDots.inset) || s.printDots.inset < 0 || s.printDots.inset > 0.2))
    throw Error("Invalid print dot inset");
  if (s.printDots?.variation !== void 0 && (!Number.isFinite(s.printDots.variation) || s.printDots.variation < 0 || s.printDots.variation > 1))
    throw Error("Invalid print dot variation");
  if (s.printDots && (!Number.isFinite(s.printDots.amount) || s.printDots.amount < 0 || s.printDots.amount > 1 || s.printDots.period !== void 0 && (!Number.isFinite(s.printDots.period) || s.printDots.period < 2 || s.printDots.period > 16)))
    throw Error("Invalid print dots");
  if (s.cardstock && (!Number.isFinite(s.cardstock.amount) || s.cardstock.amount < 0 || s.cardstock.amount > 1))
    throw Error("Invalid cardstock amount");
  if (G(s.deformation), s.wear && (!Number.isFinite(s.wear.amount) || s.wear.amount < 0 || s.wear.amount > 1 || s.wear.seed !== void 0 && !E(s.wear.seed)))
    throw Error("Invalid wear amount or seed");
  if (!E(s.id) || !E(s.card) || s.transform.length !== 16 || s.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid instance identity or transform");
  if (!Number.isInteger(s.order ?? 0) || Math.abs(s.order ?? 0) > 2147483647)
    throw Error("Invalid instance order");
  if (!["regular", "gloss", "etched", "prismatic", "cold", "opal", "rain", "heat", "pool"].includes(
    s.finish ?? "regular"
  ))
    throw Error("Unknown finish");
  if (s.normal && (s.normal.length !== 3 || s.normal.some((e) => !Number.isFinite(e)) || Math.hypot(...s.normal) < 1e-8))
    throw Error("Invalid surface normal");
}
function le(s) {
  if (!Number.isFinite(s.time ?? 0) || (s.time ?? 0) < 0)
    throw Error("Frame time must be finite, nonnegative seconds");
  if (s.hover && (!E(s.hover.instance) || s.hover.uv.length !== 2 || s.hover.uv.some((e) => !Number.isFinite(e) || e < 0 || e > 1)))
    throw Error("Invalid card-local hover");
}
function he(s) {
  if (x(s.raster), !s.id || !Number.isInteger(s.order) || s.transform.length !== 16 || s.transform.some((e) => !Number.isFinite(e)))
    throw Error("Invalid scene layer");
  if (!["world-under-cards", "world-interleaved", "scene-overlay", "hud"].includes(s.stage) || !["test-write", "test-readonly", "ignore"].includes(s.depth))
    throw Error("Invalid scene layer stage or depth");
  if (["scene-overlay", "hud"].includes(s.stage) && s.depth !== "ignore")
    throw Error("Overlay/HUD layers must ignore depth");
}
async function de(s, e) {
  const t = await te(s.url, { mode: "cors", signal: e });
  if (!t.ok) throw Error(`Asset ${t.status}: ${s.url}`);
  const r = await t.blob();
  if (!r.type.includes("svg"))
    return createImageBitmap(
      r,
      s.width ? { resizeWidth: s.width, resizeQuality: "high" } : {}
    );
  const i = new DOMParser().parseFromString(await r.text(), "image/svg+xml"), a = i.documentElement;
  if (a.localName !== "svg" || i.querySelector("parsererror")) throw Error("Invalid SVG");
  const l = (a.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), n = l[2] ?? Number.parseFloat(a.getAttribute("width") ?? ""), o = l[3] ?? Number.parseFloat(a.getAttribute("height") ?? "");
  if (!(n > 0 && o > 0 && Number.isFinite(n + o))) throw Error("SVG needs finite dimensions");
  const h = (s.width ?? 512) / Math.max(n, o);
  a.hasAttribute("viewBox") || a.setAttribute("viewBox", `0 0 ${n} ${o}`), a.setAttribute("width", String(Math.max(1, Math.round(n * h)))), a.setAttribute("height", String(Math.max(1, Math.round(o * h))));
  const c = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" })
  ), f = new Image();
  try {
    return f.src = c, await f.decode(), await createImageBitmap(f);
  } finally {
    f.src = "", URL.revokeObjectURL(c);
  }
}
class fe {
  store;
  pending = /* @__PURE__ */ new Map();
  active = 0;
  waiting = [];
  disposed = !1;
  generation = 0;
  controllers = /* @__PURE__ */ new Set();
  decodes = 0;
  constructor(e) {
    this.store = new re(e, (t) => t.close());
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
    let i = this.store.acquire(r);
    if (i) return i;
    let a = this.pending.get(r);
    if (!a) {
      const l = this.generation, n = new AbortController();
      this.controllers.add(n), a = (async () => {
        const o = await this.reserve();
        try {
          if (this.disposed || l !== this.generation) throw Error("Asset scope changed");
          const h = await de(e, n.signal);
          if (this.decodes++, this.disposed || l !== this.generation)
            throw h.close(), Error("Asset scope changed");
          this.store.insert(r, h, h.width * h.height * 4).release();
        } finally {
          o(), this.controllers.delete(n), l === this.generation && this.pending.delete(r);
        }
      })(), this.pending.set(r, a);
    }
    if (await a, t.throwIfAborted(), i = this.store.acquire(r), !i) throw Error("Decoded working set exceeds CPU budget");
    return i;
  }
  async images(e, t) {
    const r = [], i = /* @__PURE__ */ new Map(), a = await Promise.allSettled(
      e.map(async (o) => {
        const h = await this.image(o, t);
        r.push(h), i.set(o.url, h.value);
      })
    ), l = () => {
      for (const o of r) o.release();
      i.clear();
    }, n = a.find((o) => o.status === "rejected");
    if (n?.status === "rejected")
      throw l(), n.reason;
    return { value: i, release: l };
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
const ue = `
vec2 cardSource(vec2 local,float time,vec2 shape){
 float amount=shape.x,phase=shape.y*6.28318530718;
 if(amount==0.)return local;
 return local+amount*vec2(
  .72*sin(local.y*43.+time*2.1+phase)+.28*sin(local.y*81.-time*3.4+phase*.7),
  .18*sin(local.x*29.-time*1.3+phase));
}
`, pe = `
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
  float flashAxis=dot(p-.5,vec2(.7,.25))+dot(light,vec2(.85,.4));
  float flash=exp(-flashAxis*flashAxis*70.);
  float luminance=dot(ink,vec3(.2126,.7152,.0722));
  vec3 silver=ink*(.80+.12*broad)*grain;
  vec3 colored=diffraction*(.12+.28*broad+.25*flash)*(.25+.75*luminance);
  vec3 specular=vec3(1.,.99,.96)*flash*.24;
  return mix(ink,silver+colored+specular,cover);
}
`, D = 732, L = 1020, ve = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`, ge = `#version 300 es
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
class me {
  constructor(e) {
    this.gl = e, this.shader = b(e, ge, ve);
  }
  gl;
  map;
  bytes = 0;
  passes = 0;
  shader;
  prepare() {
    if (this.map) return;
    const e = this.gl, t = _(e, D, L, e.RGBA8, e.RGBA), r = e.createFramebuffer(), i = e.createVertexArray();
    try {
      if (e.bindFramebuffer(e.FRAMEBUFFER, r), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, t, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
        throw Error("Cardstock framebuffer is incomplete");
      e.viewport(0, 0, D, L), e.disable(e.DEPTH_TEST), e.disable(e.CULL_FACE), e.disable(e.SCISSOR_TEST), e.disable(e.BLEND), e.disable(e.DITHER), e.colorMask(!0, !0, !0, !0), e.useProgram(this.shader), e.bindVertexArray(i), e.drawArrays(e.TRIANGLES, 0, 3), e.bindTexture(e.TEXTURE_2D, t), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR_MIPMAP_LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.generateMipmap(e.TEXTURE_2D);
      let a = D, l = L;
      for (; this.bytes += a * l * 4, !(a === 1 && l === 1); )
        a = Math.max(1, Math.floor(a / 2)), l = Math.max(1, Math.floor(l / 2));
      this.map = t, this.passes++;
    } catch (a) {
      throw e.deleteTexture(t), a;
    } finally {
      e.bindFramebuffer(e.FRAMEBUFFER, null), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.bindVertexArray(null), e.deleteFramebuffer(r), e.deleteVertexArray(i);
    }
  }
  dispose() {
    this.gl.deleteTexture(this.map ?? null), this.gl.deleteProgram(this.shader);
  }
}
const we = `
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
}`, j = `
flat in vec4 printDotsInfo;
float printFootprint;
float plateNoise(vec2 cell,float channel){return fract(sin(dot(cell,vec2(127.1,311.7))+channel*74.7)*43758.5453);}
float plateDot(vec2 cell,vec2 id,float radius,bool holes,float channel,float aa,float reach){
 // Reject distant neighbors before hashing; only nearby impressions can touch.
 if(any(greaterThan(abs(cell),vec2(reach))))return 0.;
 if(printDotsInfo.z>0.){
  float a=plateNoise(id,channel),b=plateNoise(id,channel+1.),c=plateNoise(id,channel+2.);
  // Stable impression irregularity. Neighboring dots stay on their plate's
  // screen, with small registration shifts, ellipticity and uneven ink gain.
  cell-=(vec2(a,b)-.5)*.24*printDotsInfo.z;
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
 float reach=(radius*(1.+.18*variation)*(holes?1.-.12*variation:1.+.12*variation)+aa)/(1.-.15*variation)+.12*variation;
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
}`, A = `#version 300 es
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
layout(location=15) in float instanceRainFog;
flat out float rainFogDensity;
uniform mat4 viewProjection;
out vec2 v_uv;out vec3 v_normal;flat out float previewKind;flat out vec2 wearInfo;
flat out vec4 surfaceInfo;flat out vec4 ripple0;flat out vec4 ripple1;flat out vec4 ripple2;flat out vec4 ripple3;
void main(){
vec2 pad=instanceSurface.w*vec2(1.,.18);
vec2 local=position*(1.+2.*pad)-pad;
v_uv=local;v_normal=instanceNormal;previewKind=instanceFinish;wearInfo=instanceWear;
cardstockAmount=instanceCardstock;printDotsInfo=instancePrintDots;
rainFogDensity=instanceRainFog;
surfaceInfo=instanceSurface;ripple0=instanceRipple0;ripple1=instanceRipple1;ripple2=instanceRipple2;ripple3=instanceRipple3;
gl_Position=viewProjection*model*vec4(local,0.,1.);}`, be = ie.replace("uniform float previewKind;", "flat in float previewKind;").replaceAll("texture2D(mask,uv).r*hasMask", "edgeCoverage(uv)").replaceAll("texture2D(face,", "printFace("), S = `#version 300 es
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
${we}
${be}
#ifdef PROCEDURAL_PRINT
${j}
#else
vec4 printFace(vec2 uv){return texture(face,uv);}
#endif
${Y.replaceAll("texture(face,", "printFace(")}
${ue}
${K}
#ifdef LOCAL_HOLOGRAM
${pe}
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
   float foilSubstrate=step(.5,previewKind)*(1.-step(4.5,previewKind));
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
}`, H = S.replace(
  "#version 300 es",
  `#version 300 es
#define LOCAL_HOLOGRAM`
), ye = S.replace(
  "#version 300 es",
  `#version 300 es
#define PROCEDURAL_PRINT`
), xe = H.replace(
  "#version 300 es",
  `#version 300 es
#define PROCEDURAL_PRINT`
), Ee = `#version 300 es
precision highp float;in vec2 v_uv;uniform sampler2D face;out vec4 out_color;
void main(){out_color=texture(face,vec2(v_uv.x,1.-v_uv.y));if(out_color.a<.001)discard;}`, Ae = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`, Re = `#version 300 es
precision highp float;
in vec2 uv;out vec4 color;uniform sampler2D face;
vec3 previewInk(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 previewLinear(vec3 c){return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c));}
${j.replace("flat in vec4 printDotsInfo;", "uniform vec4 printDotsInfo;")}
void main(){printFootprint=1./printDotsInfo.y;color=printFace(uv);}`, C = 16 * 1024 * 1024, O = (s) => {
  let e = s.width, t = s.height, r = 0;
  for (; ; ) {
    if (r += e * t * 4, e === 1 && t === 1) return r;
    e = Math.max(1, Math.floor(e / 2)), t = Math.max(1, Math.floor(t / 2));
  }
};
class Fe {
  constructor(e) {
    this.gl = e, this.shader = b(e, Re, Ae), this.framebuffer = e.createFramebuffer(), this.vao = e.createVertexArray();
  }
  gl;
  shader;
  framebuffer;
  vao;
  entries = [];
  bytes = 0;
  passes = 0;
  prepare(e, t, r) {
    const i = [
      r.amount,
      r.period ?? 5,
      r.variation ?? 0.5,
      r.inset ?? 0
    ], a = i.join(":"), l = this.entries.findIndex(
      (c) => c.source.texture === e.texture && c.overlay?.texture === t?.texture && c.settings === a
    );
    if (l >= 0) {
      const c = this.entries.splice(l, 1)[0];
      return this.entries.push(c), c;
    }
    const n = O(e) + (t ? O(t) : 0);
    if (n > C) return;
    for (; this.bytes + n > C; ) {
      const c = this.entries.shift();
      this.release(c);
    }
    let o, h;
    try {
      o = this.paint(e, i), t && (h = this.paint(t, i));
      const c = { source: e, overlay: t, settings: a, face: o, top: h, bytes: n };
      return this.entries.push(c), this.bytes += n, c;
    } catch (c) {
      throw this.gl.deleteTexture(o?.texture ?? null), this.gl.deleteTexture(h?.texture ?? null), c;
    } finally {
      const c = this.gl;
      c.bindFramebuffer(c.FRAMEBUFFER, null), c.bindVertexArray(null), c.viewport(0, 0, c.drawingBufferWidth, c.drawingBufferHeight);
    }
  }
  paint(e, t) {
    const r = this.gl, i = e.width, a = e.height, l = _(r, i, a, r.SRGB8_ALPHA8, r.RGBA);
    try {
      if (r.bindFramebuffer(r.FRAMEBUFFER, this.framebuffer), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, l, 0), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE)
        throw Error("Printed ink framebuffer is incomplete");
      return r.viewport(0, 0, i, a), r.disable(r.DEPTH_TEST), r.disable(r.CULL_FACE), r.disable(r.SCISSOR_TEST), r.disable(r.BLEND), r.disable(r.DITHER), r.colorMask(!0, !0, !0, !0), r.useProgram(this.shader), r.bindVertexArray(this.vao), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, e.texture), r.uniform1i(r.getUniformLocation(this.shader, "face"), 0), r.uniform4fv(r.getUniformLocation(this.shader, "printDotsInfo"), t), r.drawArrays(r.TRIANGLES, 0, 3), this.passes++, r.bindTexture(r.TEXTURE_2D, l), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR_MIPMAP_LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.generateMipmap(r.TEXTURE_2D), { texture: l, width: i, height: a };
    } catch (n) {
      throw r.deleteTexture(l), n;
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
const ke = {
  regular: 0,
  etched: 1,
  prismatic: 2,
  cold: 3,
  opal: 4,
  rain: 5,
  heat: 6,
  pool: 7,
  gloss: 8
}, g = 48;
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
    this.gl = t, this.caustics = new J(t), this.cardstock = new me(t), this.printedInk = new Fe(t), this.foil = b(t, S, A), this.holographic = b(t, H, A), this.procedural = b(t, ye, A), this.proceduralHolographic = b(t, xe, A), this.image = b(t, Ee, A), this.vao = t.createVertexArray(), this.quad = t.createBuffer(), this.instances = t.createBuffer(), this.blank = _(t, 1, 1, t.RGBA8, t.RGBA), t.bindTexture(t.TEXTURE_2D, this.blank), t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)), t.bindVertexArray(this.vao), t.bindBuffer(t.ARRAY_BUFFER, this.quad), t.bufferData(
      t.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      t.STATIC_DRAW
    ), t.enableVertexAttribArray(0), t.vertexAttribPointer(0, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, this.instances);
    for (let r = 0; r < 4; r++)
      t.enableVertexAttribArray(1 + r), t.vertexAttribPointer(1 + r, 4, t.FLOAT, !1, g * 4, r * 16), t.vertexAttribDivisor(1 + r, 1);
    t.enableVertexAttribArray(5), t.vertexAttribPointer(5, 3, t.FLOAT, !1, g * 4, 64), t.vertexAttribDivisor(5, 1), t.enableVertexAttribArray(6), t.vertexAttribPointer(6, 1, t.FLOAT, !1, g * 4, 76), t.vertexAttribDivisor(6, 1);
    for (let r = 7; r <= 11; r++)
      t.enableVertexAttribArray(r), t.vertexAttribPointer(r, 4, t.FLOAT, !1, g * 4, 80 + (r - 7) * 16), t.vertexAttribDivisor(r, 1);
    t.enableVertexAttribArray(12), t.vertexAttribPointer(12, 2, t.FLOAT, !1, g * 4, 160), t.vertexAttribDivisor(12, 1), t.enableVertexAttribArray(13), t.vertexAttribPointer(13, 1, t.FLOAT, !1, g * 4, 168), t.vertexAttribDivisor(13, 1), t.enableVertexAttribArray(14), t.vertexAttribPointer(14, 4, t.FLOAT, !1, g * 4, 172), t.vertexAttribDivisor(14, 1), t.enableVertexAttribArray(15), t.vertexAttribPointer(15, 1, t.FLOAT, !1, g * 4, 188), t.vertexAttribDivisor(15, 1), t.bindVertexArray(null);
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
  motion = new U();
  caustics;
  cardstock;
  printedInk;
  draws = 0;
  begin(e) {
    this.motion.begin();
    const t = this.gl;
    t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, this.canvas.width, this.canvas.height), t.disable(t.SCISSOR_TEST), t.disable(t.CULL_FACE), t.colorMask(!0, !0, !0, !0), t.depthMask(!0), t.clearDepth(1), t.clearColor(...e.clear ?? [0, 0, 0, 0]), t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT), this.draws = 0;
  }
  bind(e, t, r, i = !1) {
    const a = this.gl;
    a.useProgram(e), a.bindVertexArray(this.vao), a.bindBuffer(a.ARRAY_BUFFER, this.instances);
    const l = r.length * g;
    this.staging.length < l && (this.staging = new Float32Array(l));
    const n = this.staging;
    r.forEach((o, h) => {
      const c = h * g;
      n.set(o.transform, c), n.set(o.normal ?? [0, 0, 1], c + 16), n[c + 19] = ke[o.finish ?? "regular"];
      const f = this.motion.sample(o, t);
      f ? n.set(f, c + 20) : n.fill(0, c + 20, c + g), n[c + 22] = T(o.id), n[c + 23] = o.deformation?.amount ?? 0, n[c + 40] = o.wear?.amount ?? 0, n[c + 41] = T(o.wear?.seed ?? o.id), n[c + 42] = o.cardstock?.amount ?? 0, n[c + 43] = i ? 0 : o.printDots?.amount ?? 0, n[c + 44] = o.printDots?.period ?? 5, n[c + 45] = o.printDots?.variation ?? 0.5, n[c + 46] = o.printDots?.inset ?? 0, n[c + 47] = o.rainFog ?? 1;
    }), this.instanceCapacity < l && (this.instanceCapacity = l, a.bufferData(a.ARRAY_BUFFER, l * 4, a.DYNAMIC_DRAW)), a.bufferSubData(a.ARRAY_BUFFER, 0, n, 0, l), a.uniformMatrix4fv(
      a.getUniformLocation(e, "viewProjection"),
      !1,
      t.viewProjection
    );
  }
  draw(e, t, r) {
    const i = this.gl;
    r.some((u) => u.finish === "pool") && this.caustics.prepare(t.time ?? 0), r.some(
      (u) => u.finish && u.finish !== "regular" && (u.cardstock?.amount ?? 0) > 0
    ) && this.cardstock.prepare();
    const a = r[0]?.printDots, n = a && a.amount > 0 && r.every(
      (u) => u.printDots?.amount === a.amount && (u.printDots.period ?? 5) === (a.period ?? 5) && (u.printDots.variation ?? 0.5) === (a.variation ?? 0.5) && (u.printDots.inset ?? 0) === (a.inset ?? 0)
    ) ? this.printedInk.prepare(e.face, e.overlay, a) : void 0, o = !n && r.some((u) => (u.printDots?.amount ?? 0) > 0), h = e.recipe.hologram?.strength ? o ? this.proceduralHolographic : this.holographic : o ? this.procedural : this.foil;
    this.bind(h, t, r, !!n), i.enable(i.DEPTH_TEST), i.depthFunc(i.LEQUAL), i.depthMask(!0), i.disable(i.BLEND), [
      ["face", n?.face.texture ?? e.face.texture],
      ["mask", e.mask.texture],
      ["overlay", n?.top?.texture ?? e.overlay?.texture ?? this.blank],
      ["coverage", e.coverage?.texture ?? this.blank],
      ["caustics", this.caustics.map],
      ["hologramMask", e.hologram?.texture ?? this.blank],
      ["cardstockMap", this.cardstock.map ?? this.blank]
    ].forEach(([u, y], R) => {
      i.activeTexture(i.TEXTURE0 + R), i.bindTexture(i.TEXTURE_2D, y), i.uniform1i(i.getUniformLocation(h, u), R);
    });
    const f = e.recipe.artWindows.map(([u, y, R, $]) => [u, 1 - y - $, u + R, 1 - y]), d = new Float32Array(32);
    f.forEach((u, y) => d.set(u, y * 4)), i.uniform4fv(i.getUniformLocation(h, "artBounds[0]"), d), i.uniform1f(i.getUniformLocation(h, "finishBase"), e.recipe.finishCoverageBase ?? 1);
    const p = e.recipe.hologram, [v, m, W, M] = p?.rect ?? [0, 0, 1, 1];
    i.uniform4f(i.getUniformLocation(h, "hologramRect"), v, 1 - m - M, W, M), i.uniform2f(
      i.getUniformLocation(h, "hologramMaterial"),
      p?.strength ?? 0,
      (p?.seed ?? 0) / 4294967295
    );
    const k = e.recipe.overlayFoil;
    i.uniform2f(
      i.getUniformLocation(h, "overlayFoil"),
      k ? { gold: 1, silver: 3, prismatic: 2 }[k.tone] : 0,
      k?.strength ?? 0
    ), i.uniform1f(i.getUniformLocation(h, "cornerRadius"), e.recipe.cornerRadius), i.uniform1f(i.getUniformLocation(h, "aspect"), e.face.height / e.face.width);
    const P = t.pointer ?? [0.5, 0.5];
    i.uniform2f(i.getUniformLocation(h, "pointer"), P[0], 1 - P[1]), i.uniform1f(i.getUniformLocation(h, "hasMask"), 1), i.uniform1f(i.getUniformLocation(h, "satinCompact"), 1), i.uniform1f(i.getUniformLocation(h, "satinHoverGain"), 0), i.uniform1f(i.getUniformLocation(h, "surfaceTime"), t.time ?? 0), i.drawArraysInstanced(i.TRIANGLES, 0, 6, r.length), this.draws++;
  }
  drawLayer(e, t, r) {
    const i = this.gl, a = this.image;
    this.bind(a, r, [{ id: 0, card: 0, transform: e.transform }]), e.depth === "ignore" ? i.disable(i.DEPTH_TEST) : (i.enable(i.DEPTH_TEST), i.depthFunc(i.LEQUAL)), i.depthMask(e.depth === "test-write"), i.enable(i.BLEND), i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA), i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, t.texture), i.uniform1i(i.getUniformLocation(a, "face"), 0), i.drawArraysInstanced(i.TRIANGLES, 0, 6, 1), this.draws++, i.depthMask(!0), i.disable(i.BLEND);
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
    return this.motion = new U(), () => {
      this.motion = e;
    };
  }
}
const F = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
let I;
class V {
  constructor(e) {
    if (this.options = e, this.budgets = {
      gpuBytes: 64 * 1024 * 1024,
      cpuBytes: 32 * 1024 * 1024,
      scratchBytes: 16 * 1024 * 1024,
      preparationConcurrency: 2,
      ...e.budgets
    }, !Number.isInteger(this.budgets.preparationConcurrency) || this.budgets.preparationConcurrency < 1 || this.budgets.preparationConcurrency > 4)
      throw RangeError("Preparation concurrency must be 1–4");
    this.assets = new fe(this.budgets.cpuBytes), this.device = new z(e.canvas), this.textures = new B(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      e.etching
    ), this.preparer = new N(this.textures, e.rasterHost ?? this.assets), e.canvas.addEventListener("webglcontextlost", this.contextLost), e.canvas.addEventListener("webglcontextrestored", this.contextRestored);
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
      ne(t), se(t);
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
      if (ce(r), !this.documents.has(r.card)) throw Error(`Unknown card ${r.card}`);
    this.scene.update(
      Uint32Array.from(t, (r) => r.id),
      Float32Array.from(t.flatMap((r) => r.transform)),
      Int32Array.from(t, (r) => r.order ?? 0)
    ), this.instances = t;
  }
  plan(e) {
    return this.shapeData.length !== this.instances.length * 4 && (this.shapeData = new Float32Array(this.instances.length * 4)), this.instances.forEach((t, r) => {
      const i = (this.prepared.get(t.card)?.document ?? this.documents.get(t.card)).recipe, a = r * 4;
      this.shapeData[a] = i.color.size[1] / i.color.size[0], this.shapeData[a + 1] = i.cornerRadius, this.shapeData[a + 2] = t.deformation?.amount ?? 0, this.shapeData[a + 3] = T(t.id);
    }), this.scene.plan_shaped(e.viewProjection, this.shapeData, e.time ?? 0);
  }
  ready(e, t, r) {
    this.assertLive();
    const i = this.documents.get(e);
    if (!i || i.revision !== t)
      return Promise.reject(Error("Requested revision is not current"));
    this.failed.delete(i);
    const a = this.enqueue(i);
    return r ? new Promise((l, n) => {
      if (r.aborted) {
        n(r.reason);
        return;
      }
      const o = () => n(r.reason);
      r.addEventListener("abort", o, { once: !0 }), a.then(l, n).finally(() => r.removeEventListener("abort", o));
    }) : a;
  }
  enqueue(e) {
    const t = this.jobs.get(e.id);
    if (t) return t.promise;
    let r, i;
    const a = new Promise((n, o) => {
      r = n, i = o;
    }), l = {
      document: e,
      controller: new AbortController(),
      promise: a,
      resolve: r,
      reject: i,
      started: !1
    };
    return this.jobs.set(e.id, l), queueMicrotask(() => this.pump()), a;
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
    const r = (h) => {
      if (!h) return;
      const c = this.textures.store.acquire(h);
      return c && t.push(c), c?.value;
    }, i = r(e.color), a = r(e.mask), l = r(e.overlay), n = r(e.coverage), o = r(e.hologram);
    return i && a && (!e.overlay || l) && (!e.coverage || n) && (!e.hologram || o) ? {
      face: i,
      mask: a,
      overlay: l,
      coverage: n,
      hologram: o,
      hologramSettings: e.hologramSettings,
      recipe: e.document.recipe
    } : null;
  }
  render(e) {
    if (this.assertLive(), le(e), this.lost) return this.metrics;
    const t = performance.now(), r = this.plan(e), i = [];
    this.lastFrame = e, this.device.begin(e), this.visible = r.length;
    const a = /* @__PURE__ */ new Map(), l = (n) => {
      const o = this.textures.store.acquire("scene:" + n.raster.key);
      if (!o) {
        !this.sceneLayerPending && !this.sceneLayerFailure && this.setSceneLayers(this.sceneLayers).catch(this.options.onError ?? console.error);
        return;
      }
      i.push(o), this.device.drawLayer(
        n,
        o.value,
        n.stage === "hud" ? { ...e, viewProjection: F } : e
      );
    };
    try {
      this.sceneLayers.filter((c) => c.stage === "world-under-cards").forEach(l);
      let n = [], o = null;
      const h = () => {
        o && n.length && this.device.draw(o, e, n), n = [];
      };
      for (const c of r) {
        const f = this.instances[c];
        let d = a.get(f.card);
        if (d === void 0) {
          const p = this.prepared.get(f.card), v = this.documents.get(f.card);
          d = p ? this.material(p, i) : null, a.set(f.card, d), (!d || p?.document !== v) && !this.jobs.has(v.id) && !this.failed.has(v) && this.enqueue(v).catch((m) => {
            m instanceof DOMException && m.name === "AbortError" || this.options.onError?.(m);
          });
        }
        d !== o && (!d || !o || d.face !== o.face || d.mask !== o.mask || d.overlay !== o.overlay || d.coverage !== o.coverage || d.hologram !== o.hologram || d.hologramSettings !== o.hologramSettings || d.recipe.cornerRadius !== o.recipe.cornerRadius || d.recipe.finishCoverageBase !== o.recipe.finishCoverageBase || d.recipe.overlayFoil?.tone !== o.recipe.overlayFoil?.tone || d.recipe.overlayFoil?.strength !== o.recipe.overlayFoil?.strength || JSON.stringify(d.recipe.artWindows) !== JSON.stringify(o.recipe.artWindows)) && (h(), o = d), d && n.push(f);
      }
      h();
      for (const c of ["world-interleaved", "scene-overlay", "hud"])
        this.sceneLayers.filter((f) => f.stage === c).forEach(l);
    } finally {
      for (const n of i) n.release();
      this.device.end();
    }
    return this.frameMs = performance.now() - t, this.metrics;
  }
  async setSceneLayers(e) {
    if (this.assertLive(), this.lost) throw Error("Graphics context is lost");
    if (new Set(e.map((o) => o.id)).size !== e.length)
      throw Error("Duplicate scene layer ID");
    for (const o of e) he(o);
    const t = e.map((o) => ({ ...o, transform: [...o.transform] })), r = ++this.sceneLayerGeneration, i = this.epoch, a = this.textures, l = [];
    this.sceneLayerFailure = !1, this.sceneLayerPending++;
    const n = () => {
      if (this.disposed || this.lost || this.epoch !== i || r !== this.sceneLayerGeneration)
        throw new DOMException("Stale scene layer preparation", "AbortError");
    };
    try {
      for (const o of t) {
        const h = "scene:" + o.raster.key, c = a.store.acquire(h);
        if (c) {
          l.push(c);
          continue;
        }
        const f = await oe(
          o.raster,
          this.options.rasterHost ?? this.assets,
          new AbortController().signal
        );
        try {
          n(), l.push(a.upload(h, f, !1));
        } finally {
          ae(f);
        }
      }
      n(), this.sceneLayers = t.sort((o, h) => o.order - h.order || o.id.localeCompare(h.id)), this.options.invalidate?.();
    } catch (o) {
      throw r === this.sceneLayerGeneration && (this.sceneLayerFailure = !0), o;
    } finally {
      for (const o of l) o.release();
      this.sceneLayerPending--;
    }
  }
  hitTest(e, t) {
    const r = this.options.canvas.getBoundingClientRect(), i = this.scene.hit(e / r.width * 2 - 1, 1 - t / r.height * 2);
    if (!i.length) return null;
    const [a, l, n] = i, o = this.instances.find((f) => f.id === a), c = this.prepared.get(o.card)?.document.recipe?.regions.filter((f) => {
      const [d, p, v, m] = f.rect;
      return l >= d && n >= p && l <= d + v && n <= p + m;
    }).sort((f, d) => f.rect[2] * f.rect[3] - d.rect[2] * d.rect[3])[0]?.id;
    return { instance: a, card: o.card, uv: [l, n], part: c ?? null };
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
    this.documents.clear(), this.prepared.clear(), this.sceneLayers = [], this.sceneLayerFailure = !1, this.failed = /* @__PURE__ */ new WeakSet(), this.instances = [], this.device.resetMotion(), this.scene.update(new Uint32Array(), new Float32Array(), new Int32Array()), this.textures.store.clear(), this.assets.clear(), this.lost || this.device.begin({ viewProjection: F });
  }
  contextLost = (e) => {
    e.preventDefault(), this.lost = !0;
    for (const t of this.jobs.keys()) this.cancel(t);
    this.prepared.clear(), this.sceneLayerGeneration++, this.preparer.dispose(), this.textures.store.clear(), this.textures.etcher.dispose(), this.device.dispose();
  };
  contextRestored = () => {
    if (this.disposed) return;
    this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.device = new z(this.options.canvas), this.textures = new B(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      this.options.etching
    ), this.preparer = new N(this.textures, this.options.rasterHost ?? this.assets), this.lost = !1, this.failed = /* @__PURE__ */ new WeakSet();
    const e = this.sceneLayers;
    this.sceneLayers = [], this.setSceneLayers(e).catch(this.options.onError ?? console.error), this.options.invalidate?.(), this.pump();
  };
  async exportCard(e, t) {
    G(t.deformation), await this.ready(e, t.revision);
    const r = this.documents.get(e);
    if (r.revision !== t.revision) throw Error("Export revision changed");
    const i = this.options.canvas, a = [i.width, i.height], l = this.instances, n = this.sceneLayers, o = this.lastFrame;
    if (!Number.isInteger(t.width) || t.width < 1 || t.width > 2048)
      throw RangeError("Invalid export size");
    let h;
    const c = Q(t.deformation, t.width), f = this.device.isolateMotion();
    try {
      i.width = t.width, i.height = Math.round(
        t.width * r.recipe.color.size[1] / r.recipe.color.size[0]
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
          transform: [2 * c, 0, 0, 0, 0, -2 * c, 0, 0, 0, 0, 1, 0, -c, c, 0, 1]
        }
      ]), this.render({
        viewProjection: F,
        pointer: t.pointer,
        time: t.time ?? o?.time
      }), h = new Promise(
        (d, p) => i.toBlob(
          (v) => v ? d(v) : p(Error("Export failed")),
          "image/png"
        )
      );
    } finally {
      f(), i.width = a[0], i.height = a[1], this.sceneLayers = n, this.updateScene(l), o && this.render(o);
    }
    return h;
  }
  dispose() {
    if (!this.disposed) {
      for (const e of this.jobs.keys()) this.cancel(e);
      this.disposed = !0, this.sceneLayerGeneration++, this.lost || this.device.begin({ viewProjection: F }), this.options.canvas.removeEventListener("webglcontextlost", this.contextLost), this.options.canvas.removeEventListener("webglcontextrestored", this.contextRestored), this.preparer.dispose(), this.textures.dispose(), this.device.dispose(), this.assets.dispose(), this.scene.free();
    }
  }
}
async function X(s) {
  I ??= ee(s ? { module_or_path: s } : void 0).catch((e) => {
    throw I = void 0, e;
  }), await I;
}
async function De(s) {
  return await X(s.wasmUrl), new V(s);
}
const Be = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Renderer: V,
  createRenderer: De,
  initializeRenderer: X
}, Symbol.toStringTag, { value: "Module" }));
export {
  F as I,
  V as R,
  De as c,
  Be as r
};
