import { F as q, H as Z, f as j } from "./foil-preview-shader-C-MhLK3-.js";
import { a as v, C as g, b, v as T, w, t as R, d as x, e as M, l as L, f as P, g as k, G as U, i as B, T as D, h as N, j as G } from "./renderer-ER8PRpsi.js";
import { k as $, D as ee, m as te, P as re, S as ie, n as se, W as oe, p as ae, s as ne } from "./renderer-ER8PRpsi.js";
import { c as O, a as K } from "./canvas-raster-DIqHyOj6.js";
class z {
  constructor(e) {
    this.gl = e, this.available(), e.canvas.addEventListener("webglcontextlost", this.onLost);
  }
  gl;
  ink;
  stock;
  stockMap;
  pool;
  poolMap;
  poolTime = NaN;
  warming;
  warmupController;
  sampler;
  disposed = !1;
  lost = !1;
  onLost = () => {
    this.lost = !0, this.warmupController?.abort();
  };
  available() {
    if (this.disposed || this.lost || this.gl.isContextLost())
      throw Error("Finish textures unavailable; recreate after context loss");
  }
  async ready(e) {
    if (this.available(), e?.throwIfAborted(), this.ink && this.stock && this.pool) return;
    if (!this.warming) {
      const o = new AbortController();
      this.warmupController = o, this.warming = this.warm(o.signal).finally(() => {
        this.warming = void 0, this.warmupController = void 0;
      });
    }
    let i;
    try {
      e ? await new Promise((o, s) => {
        i = () => s(e.reason ?? new DOMException("Aborted", "AbortError")), e.addEventListener("abort", i, { once: !0 }), this.warming.then(o, s);
      }) : await this.warming, e?.throwIfAborted(), this.available();
    } finally {
      i && e?.removeEventListener("abort", i);
    }
  }
  async warm(e) {
    const i = (o, s) => {
      try {
        return e.throwIfAborted(), this.available(), s ? (o.dispose(), s) : o;
      } catch (a) {
        throw !this.lost && !this.gl.isContextLost() && o.dispose(), a;
      }
    };
    this.ink || (this.ink = i(await v.create(this.gl, e), this.ink)), this.stock || (this.stock = i(await g.create(this.gl, e), this.stock)), this.pool || (this.pool = i(await b.create(this.gl, e), this.pool));
  }
  /** Allocate one caller-owned SRGB8_ALPHA8 printing texture. Delete it with
   * gl.deleteTexture when evicted; disposing this helper does not delete it. */
  printDots(e, i = {}, o = []) {
    if (this.available(), !i || typeof i != "object") throw Error("Invalid print dots");
    if (T(i), o.length > 8 || o.some(
      (r) => r.length !== 4 || r.some((t) => !Number.isFinite(t)) || r[2] <= 0 || r[3] <= 0
    ))
      throw Error("Invalid print artwork windows");
    const s = this.gl, a = s.getParameter(s.MAX_TEXTURE_SIZE);
    if (!e || !Number.isInteger(e.width) || !Number.isInteger(e.height) || e.width < 1 || e.height < 1 || e.width > a || e.height > a || e.width * e.height > 4194304 || e.layer !== void 0 && (!Number.isInteger(e.layer) || e.layer < 0 || e.layer >= s.getParameter(s.MAX_ARRAY_TEXTURE_LAYERS)))
      throw Error("Invalid printing size or layer");
    if (!s.isTexture(e.texture)) throw Error("Printing requires a texture in this context");
    return w(s, () => {
      if (!this.sampler) {
        const t = s.createSampler();
        if (!t) throw Error("Finish texture sampler unavailable");
        s.samplerParameteri(t, s.TEXTURE_MIN_FILTER, s.LINEAR), s.samplerParameteri(t, s.TEXTURE_MAG_FILTER, s.LINEAR), s.samplerParameteri(t, s.TEXTURE_WRAP_S, s.CLAMP_TO_EDGE), s.samplerParameteri(t, s.TEXTURE_WRAP_T, s.CLAMP_TO_EDGE), this.sampler = t;
      }
      s.bindSampler(0, this.sampler), this.ink ??= new v(s);
      const r = e.layer === void 0 ? void 0 : this.copyLayer(e);
      try {
        const t = this.ink.paint(
          { texture: r ?? e.texture, width: e.width, height: e.height },
          x(i),
          o,
          i.artwork !== !1
        );
        if (s.isContextLost())
          throw s.deleteTexture(t.texture), Error("Context lost during finish preparation");
        return t;
      } finally {
        s.deleteTexture(r ?? null);
      }
    });
  }
  /** Borrow one shared RGBA8 packed-slope map; alpha is data. Do not delete or
   * modify it. It remains valid until this owner is disposed or context is lost. */
  cardstock() {
    return this.available(), this.stockMap ? this.stockMap : w(this.gl, () => (this.stock ??= new g(this.gl), this.stock.prepare(), this.available(), this.stockMap = {
      texture: this.stock.map,
      width: this.stock.width,
      height: this.stock.height
    }));
  }
  caustics(e) {
    if (this.available(), e = Math.fround(e), !Number.isFinite(e) || e < 0) throw Error("Invalid caustics time");
    return this.poolMap && this.poolTime === e ? this.poolMap : w(this.gl, () => (this.pool ??= new b(this.gl), this.pool.prepare(e), this.available(), this.poolTime = e, this.poolMap ??= { texture: this.pool.map, width: 512, height: 512 }));
  }
  copyLayer(e) {
    const i = this.gl, o = i.createFramebuffer();
    if (!o) throw Error("Finish source framebuffer unavailable");
    let s;
    try {
      if (i.bindFramebuffer(i.FRAMEBUFFER, o), i.framebufferTextureLayer(
        i.FRAMEBUFFER,
        i.COLOR_ATTACHMENT0,
        e.texture,
        0,
        e.layer
      ), i.checkFramebufferStatus(i.FRAMEBUFFER) !== i.FRAMEBUFFER_COMPLETE)
        throw Error("Printing source layer is incomplete");
      return s = R(i, e.width, e.height, i.SRGB8_ALPHA8, i.RGBA), i.copyTexSubImage2D(i.TEXTURE_2D, 0, 0, 0, 0, 0, e.width, e.height), s;
    } catch (a) {
      throw i.deleteTexture(s ?? null), a;
    } finally {
      i.bindFramebuffer(i.FRAMEBUFFER, null), i.deleteFramebuffer(o);
    }
  }
  /** Releases helper programs, scratch resources and borrowed maps only. */
  dispose() {
    this.disposed || (this.disposed = !0, this.warmupController?.abort(), this.gl.canvas.removeEventListener("webglcontextlost", this.onLost), !this.lost && !this.gl.isContextLost() && (this.ink?.dispose(), this.stock?.dispose(), this.pool?.dispose(), this.gl.deleteSampler(this.sampler ?? null)), this.ink = void 0, this.stock = void 0, this.pool = void 0, this.poolMap = void 0, this.sampler = void 0, this.stockMap = void 0);
  }
}
class A {
  constructor(e) {
    this.gl = e;
  }
  gl;
  ink;
  stock;
  stockMap;
  disposed = !1;
  available() {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
  }
  snapshot(e) {
    const i = this.gl, o = i.createFramebuffer();
    if (!o) throw Error("Finish resource framebuffer unavailable");
    try {
      if (i.bindFramebuffer(i.FRAMEBUFFER, o), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, e.texture, 0), i.checkFramebufferStatus(i.FRAMEBUFFER) !== i.FRAMEBUFFER_COMPLETE)
        throw Error("Finish resource framebuffer is incomplete");
      const s = new Uint8Array(e.width * e.height * 4);
      return i.pixelStorei(i.PACK_ALIGNMENT, 1), i.readPixels(0, 0, e.width, e.height, i.RGBA, i.UNSIGNED_BYTE, s), this.available(), { width: e.width, height: e.height, data: s };
    } finally {
      i.bindFramebuffer(i.FRAMEBUFFER, null), i.deleteFramebuffer(o);
    }
  }
  printDots(e, i, o, s, a = []) {
    if (this.available(), !s || typeof s != "object") throw Error("Invalid print dots");
    if (T(s), a.length > 8 || a.some(
      (d) => d.length !== 4 || d.some((f) => !Number.isFinite(f)) || d[2] <= 0 || d[3] <= 0
    ))
      throw Error("Invalid print artwork windows");
    const r = this.gl, t = r.getParameter(r.MAX_TEXTURE_SIZE);
    if (!Number.isInteger(i) || !Number.isInteger(o) || i < 1 || o < 1 || i > t || o > t || i * o > 4194304)
      throw Error("Invalid printing size");
    let n, h;
    if (e instanceof HTMLImageElement ? (n = e.naturalWidth, h = e.naturalHeight) : e instanceof HTMLVideoElement ? (n = e.videoWidth, h = e.videoHeight) : typeof VideoFrame < "u" && e instanceof VideoFrame ? (n = e.displayWidth, h = e.displayHeight) : (n = e.width, h = e.height), n !== i || h !== o)
      throw Error("Printing size must match the source");
    let l, p, c;
    try {
      if (typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
        c = document.createElement("canvas"), c.width = i, c.height = o;
        const f = c.getContext("2d");
        if (!f) throw Error("Printing source canvas unavailable");
        f.drawImage(e, 0, 0), e = c;
      }
      const d = R(r, i, o, r.SRGB8_ALPHA8, r.RGBA);
      return l = d, r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, d), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !0), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL, r.BROWSER_DEFAULT_WEBGL), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, e), this.ink ??= new v(r), p = this.ink.paint(
        { texture: d, width: i, height: o },
        x(s),
        a,
        s.artwork !== !1
      ), this.snapshot(p);
    } finally {
      r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1), r.bindTexture(r.TEXTURE_2D, null), r.deleteTexture(l ?? null), r.deleteTexture(p?.texture ?? null), c && (c.width = c.height = 0);
    }
  }
  cardstock() {
    return this.available(), this.stockMap ? this.stockMap : (this.stock ??= new g(this.gl), this.stock.prepare(), this.stockMap = this.snapshot({
      texture: this.stock.map,
      width: this.stock.width,
      height: this.stock.height
    }), this.stockMap);
  }
  dispose() {
    this.disposed || (this.disposed = !0, this.ink?.dispose(), this.stock?.dispose(), this.stockMap = void 0);
  }
}
async function X(u, e, i) {
  i.throwIfAborted(), M(u);
  const o = u.recipe.color.size, s = u.recipe.finishCoverageBase ?? 1, a = L(u).filter((n) => n.finishCoverage).map((n) => ({ ...n, etchCoverage: void 0 })), r = await P(o, a, e, i);
  i.throwIfAborted();
  const t = O(o);
  try {
    const n = t.getContext("2d");
    for (let h = 0; h < r.length; h += 4) {
      const l = Math.round(Math.max(s * 255, r[h]) * (1 - r[h + 1] / 255));
      r[h] = r[h + 1] = r[h + 2] = l, r[h + 3] = 255;
    }
    return i.throwIfAborted(), n.putImageData(
      new ImageData(
        new Uint8ClampedArray(r.buffer, r.byteOffset, r.byteLength),
        ...o
      ),
      0,
      0
    ), t;
  } catch (n) {
    throw K(t), n;
  }
}
const _ = `#version 300 es
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
class Y {
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
    const e = this.canvas.getContext("webgl2", {
      alpha: !1,
      antialias: !1,
      preserveDrawingBuffer: !0
    });
    if (!e) throw Error("WebGL2 is required for finish resources");
    this.gl = e, this.canvas.addEventListener("webglcontextlost", this.lost), this.canvas.addEventListener("webglcontextrestored", this.restored);
  }
  lost = (e) => {
    e.preventDefault();
    for (const i of this.documentControllers) i.abort();
  };
  restored = () => {
    this.documentPreparer?.dispose(), this.documentTextures?.dispose(), this.documentPreparer = void 0, this.documentTextures = void 0, this.etcher = void 0, this.pool = void 0, this.copy = void 0, this.vao = void 0, this.poolTime = NaN, this.printing = void 0;
  };
  draw(e, i, o, s, a) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    const r = this.gl, t = this.copy ??= k(r, _);
    if (this.vao ??= r.createVertexArray(), this.canvas.width = i, this.canvas.height = o, r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(this.vao), r.viewport(0, 0, i, o), r.disable(r.BLEND), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.CULL_FACE), r.colorMask(!0, !0, !0, !0), r.useProgram(t), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, e), r.uniform1i(r.getUniformLocation(t, "source"), 0), r.uniform2f(r.getUniformLocation(t, "size"), i, o), r.uniform1i(r.getUniformLocation(t, "hasCoverage"), a ? 1 : 0), r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, a?.texture ?? e), r.uniform1i(r.getUniformLocation(t, "coverage"), 1), r.drawArrays(r.TRIANGLES, 0, 3), !s) return;
    (s.width !== i || s.height !== o) && (s.width = i, s.height = o);
    const n = s.getContext("2d");
    if (!n) throw Error("Finish resource canvas unavailable");
    n.drawImage(this.canvas, 0, 0);
  }
  mask(e, i, o) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    this.etcher ??= new U(this.gl);
    const s = this.etcher.run(e, i, o);
    try {
      const a = document.createElement("canvas");
      return this.draw(s, i, o, a), a;
    } finally {
      this.gl.deleteTexture(s);
    }
  }
  printDots(e, i, o, s, a = []) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.printing ??= new A(this.gl), this.printing.printDots(e, i, o, s, a);
  }
  cardstock() {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.printing ??= new A(this.gl), this.printing.cardstock();
  }
  documentCoverage(e, i, o) {
    return this.documentResource(o, (s) => X(e, i, s));
  }
  async documentResource(e, i) {
    if (e.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    const o = new AbortController(), s = () => o.abort(e.reason);
    e.addEventListener("abort", s, { once: !0 }), this.documentControllers.add(o);
    const a = this.documentQueue.then(async () => {
      if (o.signal.throwIfAborted(), await B(), o.signal.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
      return i(o.signal);
    });
    this.documentQueue = a.then(
      () => {
      },
      () => {
      }
    );
    try {
      return await a;
    } finally {
      e.removeEventListener("abort", s), this.documentControllers.delete(o);
    }
  }
  prepareDocumentMask(e, i, o, s) {
    return this.documentResource(o, async (a) => {
      if (a.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
      this.documentTextures ??= new D(this.gl, 16 * 1024 * 1024, 8 * 1024 * 1024), this.documentPreparer ??= new N(this.documentTextures, {
        images: (n, h) => this.documentHost.images(n, h)
      }), this.documentHost = i;
      let r, t;
      try {
        r = await this.documentPreparer.prepareMask(e, a);
        const n = L(e).filter((h) => h.etchCoverage);
        if (n.length) {
          const h = await P(e.recipe.color.size, n, i, a);
          a.throwIfAborted(), t = this.documentTextures.uploadBytes(
            `${e.recipe.pack}:` + JSON.stringify([
              "finish-etch-coverage-v1",
              e.recipe.color.size,
              n.map((l) => [
                l.clip,
                l.etchCoverage?.add?.key,
                l.etchCoverage?.exclude?.key
              ])
            ]),
            h,
            e.recipe.color.size
          );
        }
        if (!this.copy) {
          const h = await G(this.gl, _, void 0, a);
          try {
            if (a.throwIfAborted(), this.disposed || this.gl.isContextLost())
              throw Error("Finish resources unavailable");
            this.copy ? this.gl.deleteProgram(h) : this.copy = h;
          } catch (l) {
            throw this.gl.deleteProgram(h), l;
          }
        }
        return a.throwIfAborted(), await s(r.value, t?.value, a);
      } finally {
        t?.release(), r?.release(), this.documentHost = void 0;
      }
    });
  }
  async documentMask(e, i, o) {
    return this.prepareDocumentMask(e, i, o, (s, a) => {
      const r = window.document.createElement("canvas");
      try {
        return this.draw(s.texture, s.width, s.height, r, a), r;
      } catch (t) {
        throw r.width = r.height = 0, t;
      }
    });
  }
  /** Preparation-only linear R8, bottom row first, with asynchronous GPU readback. */
  async documentMaskData(e, i, o) {
    return this.prepareDocumentMask(e, i, o, async (s, a, r) => {
      const t = this.gl, n = t.createBuffer();
      if (!n) throw Error("Finish mask readback buffer unavailable");
      let h = null;
      try {
        const l = t.getParameter(t.READ_FRAMEBUFFER_BINDING), p = t.getParameter(t.DRAW_FRAMEBUFFER_BINDING), c = t.getParameter(t.PIXEL_PACK_BUFFER_BINDING), d = t.getParameter(t.PACK_ALIGNMENT), f = t.getParameter(t.PACK_ROW_LENGTH), C = t.getParameter(t.PACK_SKIP_ROWS), y = t.getParameter(t.PACK_SKIP_PIXELS);
        t.bindFramebuffer(t.READ_FRAMEBUFFER, null);
        const I = t.getParameter(t.READ_BUFFER);
        try {
          if (this.draw(s.texture, s.width, s.height, void 0, a), t.readBuffer(t.BACK), t.bindBuffer(t.PIXEL_PACK_BUFFER, n), t.bufferData(t.PIXEL_PACK_BUFFER, s.width * s.height * 4, t.STREAM_READ), t.pixelStorei(t.PACK_ALIGNMENT, 1), t.pixelStorei(t.PACK_ROW_LENGTH, 0), t.pixelStorei(t.PACK_SKIP_ROWS, 0), t.pixelStorei(t.PACK_SKIP_PIXELS, 0), t.readPixels(0, 0, s.width, s.height, t.RGBA, t.UNSIGNED_BYTE, 0), h = t.fenceSync(t.SYNC_GPU_COMMANDS_COMPLETE, 0), !h) throw Error("Finish mask readback fence unavailable");
          t.flush();
        } finally {
          t.pixelStorei(t.PACK_ALIGNMENT, d), t.pixelStorei(t.PACK_ROW_LENGTH, f), t.pixelStorei(t.PACK_SKIP_ROWS, C), t.pixelStorei(t.PACK_SKIP_PIXELS, y), t.bindBuffer(t.PIXEL_PACK_BUFFER, c), t.bindFramebuffer(t.READ_FRAMEBUFFER, null), t.readBuffer(I), t.bindFramebuffer(t.READ_FRAMEBUFFER, l), t.bindFramebuffer(t.DRAW_FRAMEBUFFER, p);
        }
        if (await this.waitForReadback(h, r), r.throwIfAborted(), this.disposed || t.isContextLost()) throw Error("Finish resources unavailable");
        const F = new Uint8Array(s.width * s.height * 4), S = t.getParameter(t.PIXEL_PACK_BUFFER_BINDING);
        try {
          t.bindBuffer(t.PIXEL_PACK_BUFFER, n), t.getBufferSubData(t.PIXEL_PACK_BUFFER, 0, F);
        } finally {
          t.bindBuffer(t.PIXEL_PACK_BUFFER, S);
        }
        if (t.isContextLost()) throw Error("Context lost during finish mask readback");
        const m = new Uint8Array(s.width * s.height);
        for (let E = 0; E < m.length; E++) m[E] = F[E * 4];
        return { width: s.width, height: s.height, rowOrder: "bottom-up", data: m };
      } finally {
        t.deleteSync(h), t.deleteBuffer(n);
      }
    });
  }
  async waitForReadback(e, i) {
    let o, s;
    try {
      await new Promise((a, r) => {
        s = () => r(i.reason ?? new DOMException("Aborted", "AbortError")), i.addEventListener("abort", s, { once: !0 });
        const t = () => {
          try {
            if (i.throwIfAborted(), this.disposed || this.gl.isContextLost())
              throw Error("Finish resources unavailable");
            const n = this.gl.clientWaitSync(e, 0, 0);
            if (n === this.gl.WAIT_FAILED) throw Error("Finish mask readback failed");
            n === this.gl.TIMEOUT_EXPIRED ? o = window.setTimeout(t, 4) : a();
          } catch (n) {
            r(n);
          }
        };
        o = window.setTimeout(t, 0);
      });
    } finally {
      window.clearTimeout(o), s && i.removeEventListener("abort", s);
    }
  }
  caustics(e) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.pool ??= new b(this.gl), this.poolTime !== e && (this.pool.prepare(e), this.draw(this.pool.map, 512, 512, this.poolCanvas), this.poolTime = e), this.poolCanvas;
  }
  dispose() {
    if (!this.disposed) {
      this.disposed = !0;
      for (const e of this.documentControllers) e.abort();
      this.documentControllers.clear(), this.documentPreparer?.dispose(), this.documentTextures?.dispose(), this.canvas.removeEventListener("webglcontextlost", this.lost), this.canvas.removeEventListener("webglcontextrestored", this.restored), this.etcher?.dispose(), this.pool?.dispose(), this.printing?.dispose(), this.gl.deleteProgram(this.copy ?? null), this.gl.deleteVertexArray(this.vao ?? null), this.gl.getExtension("WEBGL_lose_context")?.loseContext(), this.canvas.width = this.canvas.height = 1;
    }
  }
}
export {
  $ as CARDSTOCK_GLSL,
  ee as DEFAULT_PRINT_DOTS,
  q as FOIL_REFLECTION_GLSL,
  Y as FinishResources,
  z as FinishTextures,
  Z as HOST_SAMPLING_GLSL,
  te as PRINT_DOTS_GLSL,
  re as PRINT_DOTS_REFERENCE_WIDTH,
  ie as SURFACE_GLSL,
  se as SurfaceMotion,
  oe as WORN_GLSL,
  j as foilShader,
  ae as printDotPeriodForWidth,
  ne as surfaceSeed
};
