import { t as m, C as w, p as b, G as T } from "./shaders-BThdCOAX.js";
import { a as O, F as H, H as W, P as z, S as X, W as V, f as K } from "./shaders-BThdCOAX.js";
import { v as x, a as C, b as L, d as F, l as E, e as g, i as A, T as R, f as _, C as y } from "./renderer-Bb_poF5A.js";
import { D as Q, P as j, S as q, p as J, s as Z } from "./renderer-Bb_poF5A.js";
import { c as I, a as S } from "./canvas-raster-DIqHyOj6.js";
class v {
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
    const r = this.gl, s = r.createFramebuffer();
    if (!s) throw Error("Finish resource framebuffer unavailable");
    try {
      if (r.bindFramebuffer(r.FRAMEBUFFER, s), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, t.texture, 0), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE)
        throw Error("Finish resource framebuffer is incomplete");
      const i = new Uint8Array(t.width * t.height * 4);
      return r.pixelStorei(r.PACK_ALIGNMENT, 1), r.readPixels(0, 0, t.width, t.height, r.RGBA, r.UNSIGNED_BYTE, i), this.available(), { width: t.width, height: t.height, data: i };
    } finally {
      r.bindFramebuffer(r.FRAMEBUFFER, null), r.deleteFramebuffer(s);
    }
  }
  printDots(t, r, s, i, o = []) {
    if (this.available(), !i || typeof i != "object") throw Error("Invalid print dots");
    if (x(i), o.length > 8 || o.some(
      (u) => u.length !== 4 || u.some((p) => !Number.isFinite(p)) || u[2] <= 0 || u[3] <= 0
    ))
      throw Error("Invalid print artwork windows");
    const e = this.gl, h = e.getParameter(e.MAX_TEXTURE_SIZE);
    if (!Number.isInteger(r) || !Number.isInteger(s) || r < 1 || s < 1 || r > h || s > h || r * s > 4194304)
      throw Error("Invalid printing size");
    let a, n;
    if (t instanceof HTMLImageElement ? (a = t.naturalWidth, n = t.naturalHeight) : t instanceof HTMLVideoElement ? (a = t.videoWidth, n = t.videoHeight) : typeof VideoFrame < "u" && t instanceof VideoFrame ? (a = t.displayWidth, n = t.displayHeight) : (a = t.width, n = t.height), a !== r || n !== s)
      throw Error("Printing size must match the source");
    let l, f, c;
    try {
      if (typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
        c = document.createElement("canvas"), c.width = r, c.height = s;
        const p = c.getContext("2d");
        if (!p) throw Error("Printing source canvas unavailable");
        p.drawImage(t, 0, 0), t = c;
      }
      const u = m(e, r, s, e.SRGB8_ALPHA8, e.RGBA);
      return l = u, e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, u), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.BROWSER_DEFAULT_WEBGL), e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, e.RGBA, e.UNSIGNED_BYTE, t), this.ink ??= new C(e), f = this.ink.paint(
        { texture: u, width: r, height: s },
        L(i),
        o,
        i.artwork !== !1
      ), this.snapshot(f);
    } finally {
      e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), e.bindTexture(e.TEXTURE_2D, null), e.deleteTexture(l ?? null), e.deleteTexture(f?.texture ?? null), c && (c.width = c.height = 0);
    }
  }
  cardstock() {
    return this.available(), this.stockMap ? this.stockMap : (this.stock ??= new w(this.gl), this.stock.prepare(), this.stockMap = this.snapshot({
      texture: this.stock.map,
      width: this.stock.width,
      height: this.stock.height
    }), this.stockMap);
  }
  dispose() {
    this.disposed || (this.disposed = !0, this.ink?.dispose(), this.stock?.dispose(), this.stockMap = void 0);
  }
}
async function P(d, t, r) {
  r.throwIfAborted(), F(d);
  const s = d.recipe.color.size, i = d.recipe.finishCoverageBase ?? 1, o = E(d).filter((a) => a.finishCoverage).map((a) => ({ ...a, etchCoverage: void 0 })), e = await g(s, o, t, r);
  r.throwIfAborted();
  const h = I(s);
  try {
    const a = h.getContext("2d");
    for (let n = 0; n < e.length; n += 4) {
      const l = Math.round(Math.max(i * 255, e[n]) * (1 - e[n + 1] / 255));
      e[n] = e[n + 1] = e[n + 2] = l, e[n + 3] = 255;
    }
    return r.throwIfAborted(), a.putImageData(
      new ImageData(
        new Uint8ClampedArray(e.buffer, e.byteOffset, e.byteLength),
        ...s
      ),
      0,
      0
    ), h;
  } catch (a) {
    throw S(h), a;
  }
}
const D = `#version 300 es
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
class B {
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
  draw(t, r, s, i, o) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    const e = this.gl, h = this.copy ??= b(e, D);
    if (this.vao ??= e.createVertexArray(), this.canvas.width = r, this.canvas.height = s, e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindVertexArray(this.vao), e.viewport(0, 0, r, s), e.disable(e.BLEND), e.disable(e.DEPTH_TEST), e.disable(e.SCISSOR_TEST), e.disable(e.CULL_FACE), e.colorMask(!0, !0, !0, !0), e.useProgram(h), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, t), e.uniform1i(e.getUniformLocation(h, "source"), 0), e.uniform2f(e.getUniformLocation(h, "size"), r, s), e.uniform1i(e.getUniformLocation(h, "hasCoverage"), o ? 1 : 0), e.activeTexture(e.TEXTURE1), e.bindTexture(e.TEXTURE_2D, o?.texture ?? t), e.uniform1i(e.getUniformLocation(h, "coverage"), 1), e.drawArrays(e.TRIANGLES, 0, 3), !i) return;
    (i.width !== r || i.height !== s) && (i.width = r, i.height = s);
    const a = i.getContext("2d");
    if (!a) throw Error("Finish resource canvas unavailable");
    a.drawImage(this.canvas, 0, 0);
  }
  mask(t, r, s) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    this.etcher ??= new T(this.gl);
    const i = this.etcher.run(t, r, s);
    try {
      const o = document.createElement("canvas");
      return this.draw(i, r, s, o), o;
    } finally {
      this.gl.deleteTexture(i);
    }
  }
  printDots(t, r, s, i, o = []) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.printing ??= new v(this.gl), this.printing.printDots(t, r, s, i, o);
  }
  cardstock() {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.printing ??= new v(this.gl), this.printing.cardstock();
  }
  documentCoverage(t, r, s) {
    return this.documentResource(s, (i) => P(t, r, i));
  }
  async documentResource(t, r) {
    if (t.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    const s = new AbortController(), i = () => s.abort(t.reason);
    t.addEventListener("abort", i, { once: !0 }), this.documentControllers.add(s);
    const o = this.documentQueue.then(async () => {
      if (s.signal.throwIfAborted(), await A(), s.signal.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
      return r(s.signal);
    });
    this.documentQueue = o.then(
      () => {
      },
      () => {
      }
    );
    try {
      return await o;
    } finally {
      t.removeEventListener("abort", i), this.documentControllers.delete(s);
    }
  }
  prepareDocumentMask(t, r, s, i) {
    return this.documentResource(s, async (o) => {
      if (o.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
      this.documentTextures ??= new R(this.gl, 16 * 1024 * 1024, 8 * 1024 * 1024), this.documentPreparer ??= new _(this.documentTextures, {
        images: (a, n) => this.documentHost.images(a, n)
      }), this.documentHost = r;
      let e, h;
      try {
        e = await this.documentPreparer.prepareMask(t, o);
        const a = E(t).filter((n) => n.etchCoverage);
        if (a.length) {
          const n = await g(t.recipe.color.size, a, r, o);
          o.throwIfAborted(), h = this.documentTextures.uploadBytes(
            `${t.recipe.pack}:` + JSON.stringify([
              "finish-etch-coverage-v1",
              t.recipe.color.size,
              a.map((l) => [
                l.clip,
                l.etchCoverage?.add?.key,
                l.etchCoverage?.exclude?.key
              ])
            ]),
            n,
            t.recipe.color.size
          );
        }
        return o.throwIfAborted(), i(e.value, h?.value);
      } finally {
        h?.release(), e?.release(), this.documentHost = void 0;
      }
    });
  }
  async documentMask(t, r, s) {
    return this.prepareDocumentMask(t, r, s, (i, o) => {
      const e = window.document.createElement("canvas");
      try {
        return this.draw(i.texture, i.width, i.height, e, o), e;
      } catch (h) {
        throw e.width = e.height = 0, h;
      }
    });
  }
  /** Preparation-only linear R8, bottom row first. No Canvas copy or row flip. */
  async documentMaskData(t, r, s) {
    return this.prepareDocumentMask(t, r, s, (i, o) => {
      this.draw(i.texture, i.width, i.height, void 0, o);
      const e = this.gl, h = new Uint8Array(i.width * i.height * 4);
      if (e.pixelStorei(e.PACK_ALIGNMENT, 1), e.readPixels(0, 0, i.width, i.height, e.RGBA, e.UNSIGNED_BYTE, h), this.disposed || e.isContextLost()) throw Error("Finish resources unavailable");
      s.throwIfAborted();
      const a = new Uint8Array(i.width * i.height);
      for (let n = 0; n < a.length; n++) a[n] = h[n * 4];
      return { width: i.width, height: i.height, rowOrder: "bottom-up", data: a };
    });
  }
  caustics(t) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.pool ??= new y(this.gl), this.poolTime !== t && (this.pool.prepare(t), this.draw(this.pool.map, 512, 512, this.poolCanvas), this.poolTime = t), this.poolCanvas;
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
  O as CARDSTOCK_GLSL,
  Q as DEFAULT_PRINT_DOTS,
  H as FOIL_REFLECTION_GLSL,
  B as FinishResources,
  W as HOST_SAMPLING_GLSL,
  z as PRINT_DOTS_GLSL,
  j as PRINT_DOTS_REFERENCE_WIDTH,
  X as SURFACE_GLSL,
  q as SurfaceMotion,
  V as WORN_GLSL,
  K as foilShader,
  J as printDotPeriodForWidth,
  Z as surfaceSeed
};
