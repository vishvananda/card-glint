import { t as v, C as T, p as x, G as L } from "./shaders-BThdCOAX.js";
import { a as W, F as V, H as K, P as z, S as Y, W as q, f as Q } from "./shaders-BThdCOAX.js";
import { v as R, a as b, b as A, d as C, l as w, e as _, i as g, T as P, f as I, C as S } from "./renderer-D_OwEmRb.js";
import { D as j, P as J, S as $, p as ee, s as te } from "./renderer-D_OwEmRb.js";
import { c as y, a as U } from "./canvas-raster-DIqHyOj6.js";
function f(s, t) {
  if (s.getParameter(s.TRANSFORM_FEEDBACK_ACTIVE) && !s.getParameter(s.TRANSFORM_FEEDBACK_PAUSED))
    throw Error("Finish preparation requires paused transform feedback");
  for (const c of [s.ANY_SAMPLES_PASSED, s.ANY_SAMPLES_PASSED_CONSERVATIVE])
    if (s.getQuery(c, s.CURRENT_QUERY))
      throw Error("Finish preparation cannot run inside an occlusion query");
  const r = s.getParameter(s.ACTIVE_TEXTURE), o = s.getParameter(s.CURRENT_PROGRAM);
  if (o && s.getProgramParameter(o, s.DELETE_STATUS))
    throw Error("Finish preparation requires an undeleted current program");
  const i = s.getParameter(s.VERTEX_ARRAY_BINDING), n = s.getParameter(s.READ_FRAMEBUFFER_BINDING), e = s.getParameter(s.DRAW_FRAMEBUFFER_BINDING), a = s.getParameter(s.PIXEL_UNPACK_BUFFER_BINDING), h = s.getParameter(s.VIEWPORT), l = s.getParameter(s.COLOR_WRITEMASK), d = [
    s.BLEND,
    s.CULL_FACE,
    s.DEPTH_TEST,
    s.DITHER,
    s.SCISSOR_TEST,
    s.STENCIL_TEST,
    s.RASTERIZER_DISCARD,
    s.SAMPLE_ALPHA_TO_COVERAGE,
    s.SAMPLE_COVERAGE
  ], p = d.map((c) => s.isEnabled(c));
  s.activeTexture(s.TEXTURE0);
  const u = s.getParameter(s.TEXTURE_BINDING_2D), E = s.getParameter(s.SAMPLER_BINDING);
  try {
    s.bindBuffer(s.PIXEL_UNPACK_BUFFER, null);
    for (const c of d) s.disable(c);
    return t();
  } finally {
    s.useProgram(o), s.bindVertexArray(i), s.bindFramebuffer(s.READ_FRAMEBUFFER, n), s.bindFramebuffer(s.DRAW_FRAMEBUFFER, e), s.bindBuffer(s.PIXEL_UNPACK_BUFFER, a), s.viewport(h[0], h[1], h[2], h[3]), s.colorMask(l[0], l[1], l[2], l[3]), d.forEach(
      (c, F) => p[F] ? s.enable(c) : s.disable(c)
    ), s.activeTexture(s.TEXTURE0), s.bindTexture(s.TEXTURE_2D, u), s.bindSampler(0, E), s.activeTexture(r);
  }
}
class G {
  constructor(t) {
    this.gl = t, this.available(), t.canvas.addEventListener("webglcontextlost", this.onLost);
  }
  gl;
  ink;
  stock;
  stockMap;
  sampler;
  disposed = !1;
  lost = !1;
  onLost = () => {
    this.lost = !0;
  };
  available() {
    if (this.disposed || this.lost || this.gl.isContextLost())
      throw Error("Finish textures unavailable; recreate after context loss");
  }
  /** Allocate one caller-owned SRGB8_ALPHA8 printing texture. Delete it with
   * gl.deleteTexture when evicted; disposing this helper does not delete it. */
  printDots(t, r = {}, o = []) {
    if (this.available(), !r || typeof r != "object") throw Error("Invalid print dots");
    if (R(r), o.length > 8 || o.some(
      (e) => e.length !== 4 || e.some((a) => !Number.isFinite(a)) || e[2] <= 0 || e[3] <= 0
    ))
      throw Error("Invalid print artwork windows");
    const i = this.gl, n = i.getParameter(i.MAX_TEXTURE_SIZE);
    if (!t || !Number.isInteger(t.width) || !Number.isInteger(t.height) || t.width < 1 || t.height < 1 || t.width > n || t.height > n || t.width * t.height > 4194304 || t.layer !== void 0 && (!Number.isInteger(t.layer) || t.layer < 0 || t.layer >= i.getParameter(i.MAX_ARRAY_TEXTURE_LAYERS)))
      throw Error("Invalid printing size or layer");
    if (!i.isTexture(t.texture)) throw Error("Printing requires a texture in this context");
    return f(i, () => {
      if (!this.sampler) {
        const a = i.createSampler();
        if (!a) throw Error("Finish texture sampler unavailable");
        i.samplerParameteri(a, i.TEXTURE_MIN_FILTER, i.LINEAR), i.samplerParameteri(a, i.TEXTURE_MAG_FILTER, i.LINEAR), i.samplerParameteri(a, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE), i.samplerParameteri(a, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE), this.sampler = a;
      }
      i.bindSampler(0, this.sampler), this.ink ??= new b(i);
      const e = t.layer === void 0 ? void 0 : this.copyLayer(t);
      try {
        const a = this.ink.paint(
          { texture: e ?? t.texture, width: t.width, height: t.height },
          A(r),
          o,
          r.artwork !== !1
        );
        if (i.isContextLost())
          throw i.deleteTexture(a.texture), Error("Context lost during finish preparation");
        return a;
      } finally {
        i.deleteTexture(e ?? null);
      }
    });
  }
  /** Borrow one shared RGBA8 packed-slope map; alpha is data. Do not delete or
   * modify it. It remains valid until this owner is disposed or context is lost. */
  cardstock() {
    return this.available(), this.stockMap ? this.stockMap : f(this.gl, () => (this.stock ??= new T(this.gl), this.stock.prepare(), this.available(), this.stockMap = {
      texture: this.stock.map,
      width: this.stock.width,
      height: this.stock.height
    }));
  }
  copyLayer(t) {
    const r = this.gl, o = r.createFramebuffer();
    if (!o) throw Error("Finish source framebuffer unavailable");
    let i;
    try {
      if (r.bindFramebuffer(r.FRAMEBUFFER, o), r.framebufferTextureLayer(
        r.FRAMEBUFFER,
        r.COLOR_ATTACHMENT0,
        t.texture,
        0,
        t.layer
      ), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE)
        throw Error("Printing source layer is incomplete");
      return i = v(r, t.width, t.height, r.SRGB8_ALPHA8, r.RGBA), r.copyTexSubImage2D(r.TEXTURE_2D, 0, 0, 0, 0, 0, t.width, t.height), i;
    } catch (n) {
      throw r.deleteTexture(i ?? null), n;
    } finally {
      r.bindFramebuffer(r.FRAMEBUFFER, null), r.deleteFramebuffer(o);
    }
  }
  /** Releases helper programs, scratch resources and borrowed cardstock only. */
  dispose() {
    this.disposed || (this.disposed = !0, this.gl.canvas.removeEventListener("webglcontextlost", this.onLost), !this.lost && !this.gl.isContextLost() && (this.ink?.dispose(), this.stock?.dispose(), this.gl.deleteSampler(this.sampler ?? null)), this.ink = void 0, this.stock = void 0, this.sampler = void 0, this.stockMap = void 0);
  }
}
class m {
  constructor(t) {
    this.gl = t;
  }
  gl;
  ink;
  stock;
  stockMap;
  disposed = !1;
  available() {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
  }
  snapshot(t) {
    const r = this.gl, o = r.createFramebuffer();
    if (!o) throw Error("Finish resource framebuffer unavailable");
    try {
      if (r.bindFramebuffer(r.FRAMEBUFFER, o), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, t.texture, 0), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE)
        throw Error("Finish resource framebuffer is incomplete");
      const i = new Uint8Array(t.width * t.height * 4);
      return r.pixelStorei(r.PACK_ALIGNMENT, 1), r.readPixels(0, 0, t.width, t.height, r.RGBA, r.UNSIGNED_BYTE, i), this.available(), { width: t.width, height: t.height, data: i };
    } finally {
      r.bindFramebuffer(r.FRAMEBUFFER, null), r.deleteFramebuffer(o);
    }
  }
  printDots(t, r, o, i, n = []) {
    if (this.available(), !i || typeof i != "object") throw Error("Invalid print dots");
    if (R(i), n.length > 8 || n.some(
      (E) => E.length !== 4 || E.some((c) => !Number.isFinite(c)) || E[2] <= 0 || E[3] <= 0
    ))
      throw Error("Invalid print artwork windows");
    const e = this.gl, a = e.getParameter(e.MAX_TEXTURE_SIZE);
    if (!Number.isInteger(r) || !Number.isInteger(o) || r < 1 || o < 1 || r > a || o > a || r * o > 4194304)
      throw Error("Invalid printing size");
    let h, l;
    if (t instanceof HTMLImageElement ? (h = t.naturalWidth, l = t.naturalHeight) : t instanceof HTMLVideoElement ? (h = t.videoWidth, l = t.videoHeight) : typeof VideoFrame < "u" && t instanceof VideoFrame ? (h = t.displayWidth, l = t.displayHeight) : (h = t.width, l = t.height), h !== r || l !== o)
      throw Error("Printing size must match the source");
    let d, p, u;
    try {
      if (typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
        u = document.createElement("canvas"), u.width = r, u.height = o;
        const c = u.getContext("2d");
        if (!c) throw Error("Printing source canvas unavailable");
        c.drawImage(t, 0, 0), t = u;
      }
      const E = v(e, r, o, e.SRGB8_ALPHA8, e.RGBA);
      return d = E, e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, E), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.BROWSER_DEFAULT_WEBGL), e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, e.RGBA, e.UNSIGNED_BYTE, t), this.ink ??= new b(e), p = this.ink.paint(
        { texture: E, width: r, height: o },
        A(i),
        n,
        i.artwork !== !1
      ), this.snapshot(p);
    } finally {
      e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), e.bindTexture(e.TEXTURE_2D, null), e.deleteTexture(d ?? null), e.deleteTexture(p?.texture ?? null), u && (u.width = u.height = 0);
    }
  }
  cardstock() {
    return this.available(), this.stockMap ? this.stockMap : (this.stock ??= new T(this.gl), this.stock.prepare(), this.stockMap = this.snapshot({
      texture: this.stock.map,
      width: this.stock.width,
      height: this.stock.height
    }), this.stockMap);
  }
  dispose() {
    this.disposed || (this.disposed = !0, this.ink?.dispose(), this.stock?.dispose(), this.stockMap = void 0);
  }
}
async function D(s, t, r) {
  r.throwIfAborted(), C(s);
  const o = s.recipe.color.size, i = s.recipe.finishCoverageBase ?? 1, n = w(s).filter((h) => h.finishCoverage).map((h) => ({ ...h, etchCoverage: void 0 })), e = await _(o, n, t, r);
  r.throwIfAborted();
  const a = y(o);
  try {
    const h = a.getContext("2d");
    for (let l = 0; l < e.length; l += 4) {
      const d = Math.round(Math.max(i * 255, e[l]) * (1 - e[l + 1] / 255));
      e[l] = e[l + 1] = e[l + 2] = d, e[l + 3] = 255;
    }
    return r.throwIfAborted(), h.putImageData(
      new ImageData(
        new Uint8ClampedArray(e.buffer, e.byteOffset, e.byteLength),
        ...o
      ),
      0,
      0
    ), a;
  } catch (h) {
    throw U(a), h;
  }
}
const N = `#version 300 es
precision highp float;
uniform sampler2D source;
uniform sampler2D coverage;
uniform bool hasCoverage;
uniform vec2 size;
out vec4 color;
void main(){
 vec2 uv=gl_FragCoord.xy/size;
 float value=texture(source,uv).r;
 if(hasCoverage){vec4 c=texture(coverage,uv);value=max(value,c.b)*(1.-c.a);}
 color=vec4(vec3(value),1.);
}`;
class O {
  canvas = document.createElement("canvas");
  poolCanvas = document.createElement("canvas");
  gl;
  etcher;
  pool;
  copy;
  vao;
  poolTime = NaN;
  disposed = !1;
  documentTextures;
  documentPreparer;
  documentHost;
  documentQueue = Promise.resolve();
  documentControllers = /* @__PURE__ */ new Set();
  printing;
  constructor() {
    const t = this.canvas.getContext("webgl2", {
      alpha: !1,
      antialias: !1,
      preserveDrawingBuffer: !0
    });
    if (!t) throw Error("WebGL2 is required for finish resources");
    this.gl = t, this.canvas.addEventListener("webglcontextlost", this.lost), this.canvas.addEventListener("webglcontextrestored", this.restored);
  }
  lost = (t) => {
    t.preventDefault();
    for (const r of this.documentControllers) r.abort();
  };
  restored = () => {
    this.documentPreparer?.dispose(), this.documentTextures?.dispose(), this.documentPreparer = void 0, this.documentTextures = void 0, this.etcher = void 0, this.pool = void 0, this.copy = void 0, this.vao = void 0, this.poolTime = NaN, this.printing = void 0;
  };
  draw(t, r, o, i, n) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    const e = this.gl, a = this.copy ??= x(e, N);
    if (this.vao ??= e.createVertexArray(), this.canvas.width = r, this.canvas.height = o, e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindVertexArray(this.vao), e.viewport(0, 0, r, o), e.disable(e.BLEND), e.disable(e.DEPTH_TEST), e.disable(e.SCISSOR_TEST), e.disable(e.CULL_FACE), e.colorMask(!0, !0, !0, !0), e.useProgram(a), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, t), e.uniform1i(e.getUniformLocation(a, "source"), 0), e.uniform2f(e.getUniformLocation(a, "size"), r, o), e.uniform1i(e.getUniformLocation(a, "hasCoverage"), n ? 1 : 0), e.activeTexture(e.TEXTURE1), e.bindTexture(e.TEXTURE_2D, n?.texture ?? t), e.uniform1i(e.getUniformLocation(a, "coverage"), 1), e.drawArrays(e.TRIANGLES, 0, 3), !i) return;
    (i.width !== r || i.height !== o) && (i.width = r, i.height = o);
    const h = i.getContext("2d");
    if (!h) throw Error("Finish resource canvas unavailable");
    h.drawImage(this.canvas, 0, 0);
  }
  mask(t, r, o) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    this.etcher ??= new L(this.gl);
    const i = this.etcher.run(t, r, o);
    try {
      const n = document.createElement("canvas");
      return this.draw(i, r, o, n), n;
    } finally {
      this.gl.deleteTexture(i);
    }
  }
  printDots(t, r, o, i, n = []) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.printing ??= new m(this.gl), this.printing.printDots(t, r, o, i, n);
  }
  cardstock() {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.printing ??= new m(this.gl), this.printing.cardstock();
  }
  documentCoverage(t, r, o) {
    return this.documentResource(o, (i) => D(t, r, i));
  }
  async documentResource(t, r) {
    if (t.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    const o = new AbortController(), i = () => o.abort(t.reason);
    t.addEventListener("abort", i, { once: !0 }), this.documentControllers.add(o);
    const n = this.documentQueue.then(async () => {
      if (o.signal.throwIfAborted(), await g(), o.signal.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
      return r(o.signal);
    });
    this.documentQueue = n.then(
      () => {
      },
      () => {
      }
    );
    try {
      return await n;
    } finally {
      t.removeEventListener("abort", i), this.documentControllers.delete(o);
    }
  }
  prepareDocumentMask(t, r, o, i) {
    return this.documentResource(o, async (n) => {
      if (n.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
      this.documentTextures ??= new P(this.gl, 16 * 1024 * 1024, 8 * 1024 * 1024), this.documentPreparer ??= new I(this.documentTextures, {
        images: (h, l) => this.documentHost.images(h, l)
      }), this.documentHost = r;
      let e, a;
      try {
        e = await this.documentPreparer.prepareMask(t, n);
        const h = w(t).filter((l) => l.etchCoverage);
        if (h.length) {
          const l = await _(t.recipe.color.size, h, r, n);
          n.throwIfAborted(), a = this.documentTextures.uploadBytes(
            `${t.recipe.pack}:` + JSON.stringify([
              "finish-etch-coverage-v1",
              t.recipe.color.size,
              h.map((d) => [
                d.clip,
                d.etchCoverage?.add?.key,
                d.etchCoverage?.exclude?.key
              ])
            ]),
            l,
            t.recipe.color.size
          );
        }
        return n.throwIfAborted(), i(e.value, a?.value);
      } finally {
        a?.release(), e?.release(), this.documentHost = void 0;
      }
    });
  }
  async documentMask(t, r, o) {
    return this.prepareDocumentMask(t, r, o, (i, n) => {
      const e = window.document.createElement("canvas");
      try {
        return this.draw(i.texture, i.width, i.height, e, n), e;
      } catch (a) {
        throw e.width = e.height = 0, a;
      }
    });
  }
  /** Preparation-only linear R8, bottom row first. No Canvas copy or row flip. */
  async documentMaskData(t, r, o) {
    return this.prepareDocumentMask(t, r, o, (i, n) => {
      this.draw(i.texture, i.width, i.height, void 0, n);
      const e = this.gl, a = new Uint8Array(i.width * i.height * 4);
      if (e.pixelStorei(e.PACK_ALIGNMENT, 1), e.readPixels(0, 0, i.width, i.height, e.RGBA, e.UNSIGNED_BYTE, a), this.disposed || e.isContextLost()) throw Error("Finish resources unavailable");
      o.throwIfAborted();
      const h = new Uint8Array(i.width * i.height);
      for (let l = 0; l < h.length; l++) h[l] = a[l * 4];
      return { width: i.width, height: i.height, rowOrder: "bottom-up", data: h };
    });
  }
  caustics(t) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.pool ??= new S(this.gl), this.poolTime !== t && (this.pool.prepare(t), this.draw(this.pool.map, 512, 512, this.poolCanvas), this.poolTime = t), this.poolCanvas;
  }
  dispose() {
    if (!this.disposed) {
      this.disposed = !0;
      for (const t of this.documentControllers) t.abort();
      this.documentControllers.clear(), this.documentPreparer?.dispose(), this.documentTextures?.dispose(), this.canvas.removeEventListener("webglcontextlost", this.lost), this.canvas.removeEventListener("webglcontextrestored", this.restored), this.etcher?.dispose(), this.pool?.dispose(), this.printing?.dispose(), this.gl.deleteProgram(this.copy ?? null), this.gl.deleteVertexArray(this.vao ?? null), this.gl.getExtension("WEBGL_lose_context")?.loseContext(), this.canvas.width = this.canvas.height = 1;
    }
  }
}
export {
  W as CARDSTOCK_GLSL,
  j as DEFAULT_PRINT_DOTS,
  V as FOIL_REFLECTION_GLSL,
  O as FinishResources,
  G as FinishTextures,
  K as HOST_SAMPLING_GLSL,
  z as PRINT_DOTS_GLSL,
  J as PRINT_DOTS_REFERENCE_WIDTH,
  Y as SURFACE_GLSL,
  $ as SurfaceMotion,
  q as WORN_GLSL,
  Q as foilShader,
  ee as printDotPeriodForWidth,
  te as surfaceSeed
};
