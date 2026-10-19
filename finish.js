import { F as G, f as O } from "./foil-preview-shader-rARa43Zn.js";
import { v as g, t as b, P as w, p as x, C as T, a as C, l as m, b as E, d as L, G as F, i as R, T as A, e as y, f as _ } from "./renderer-BbFR5aiE.js";
import { g as W, D as z, h as X, S as V, j as K, W as Y, s as Q } from "./renderer-BbFR5aiE.js";
import { c as I, a as S } from "./canvas-raster-B9HRvi4G.js";
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
  printDots(t, r, s, i, a = []) {
    if (this.available(), !i || typeof i != "object") throw Error("Invalid print dots");
    if (g(i), a.length > 8 || a.some(
      (u) => u.length !== 4 || u.some((f) => !Number.isFinite(f)) || u[2] <= 0 || u[3] <= 0
    ))
      throw Error("Invalid print artwork windows");
    const e = this.gl, l = e.getParameter(e.MAX_TEXTURE_SIZE);
    if (!Number.isInteger(r) || !Number.isInteger(s) || r < 1 || s < 1 || r > l || s > l || r * s > 4194304)
      throw Error("Invalid printing size");
    let o, n;
    if (t instanceof HTMLImageElement ? (o = t.naturalWidth, n = t.naturalHeight) : t instanceof HTMLVideoElement ? (o = t.videoWidth, n = t.videoHeight) : typeof VideoFrame < "u" && t instanceof VideoFrame ? (o = t.displayWidth, n = t.displayHeight) : (o = t.width, n = t.height), o !== r || n !== s)
      throw Error("Printing size must match the source");
    let h, p, c;
    try {
      if (typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
        c = document.createElement("canvas"), c.width = r, c.height = s;
        const f = c.getContext("2d");
        if (!f) throw Error("Printing source canvas unavailable");
        f.drawImage(t, 0, 0), t = c;
      }
      const u = b(e, r, s, e.SRGB8_ALPHA8, e.RGBA);
      return h = u, e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, u), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.BROWSER_DEFAULT_WEBGL), e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, e.RGBA, e.UNSIGNED_BYTE, t), this.ink ??= new w(e), p = this.ink.paint(
        { texture: u, width: r, height: s },
        x(i),
        a,
        i.artwork !== !1
      ), this.snapshot(p);
    } finally {
      e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), e.bindTexture(e.TEXTURE_2D, null), e.deleteTexture(h ?? null), e.deleteTexture(p?.texture ?? null), c && (c.width = c.height = 0);
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
async function P(d, t, r) {
  r.throwIfAborted(), C(d);
  const s = d.recipe.color.size, i = d.recipe.finishCoverageBase ?? 1, a = m(d).filter((o) => o.finishCoverage).map((o) => ({ ...o, etchCoverage: void 0 })), e = await E(s, a, t, r);
  r.throwIfAborted();
  const l = I(s);
  try {
    const o = l.getContext("2d");
    for (let n = 0; n < e.length; n += 4) {
      const h = Math.round(Math.max(i * 255, e[n]) * (1 - e[n + 1] / 255));
      e[n] = e[n + 1] = e[n + 2] = h, e[n + 3] = 255;
    }
    return r.throwIfAborted(), o.putImageData(
      new ImageData(
        new Uint8ClampedArray(e.buffer, e.byteOffset, e.byteLength),
        ...s
      ),
      0,
      0
    ), l;
  } catch (o) {
    throw S(l), o;
  }
}
const k = `#version 300 es
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
class N {
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
  draw(t, r, s, i, a) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    const e = this.gl, l = this.copy ??= L(e, k);
    this.vao ??= e.createVertexArray(), this.canvas.width = r, this.canvas.height = s, e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindVertexArray(this.vao), e.viewport(0, 0, r, s), e.disable(e.BLEND), e.disable(e.DEPTH_TEST), e.disable(e.SCISSOR_TEST), e.disable(e.CULL_FACE), e.colorMask(!0, !0, !0, !0), e.useProgram(l), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, t), e.uniform1i(e.getUniformLocation(l, "source"), 0), e.uniform2f(e.getUniformLocation(l, "size"), r, s), e.uniform1i(e.getUniformLocation(l, "hasCoverage"), a ? 1 : 0), e.activeTexture(e.TEXTURE1), e.bindTexture(e.TEXTURE_2D, a?.texture ?? t), e.uniform1i(e.getUniformLocation(l, "coverage"), 1), e.drawArrays(e.TRIANGLES, 0, 3), (i.width !== r || i.height !== s) && (i.width = r, i.height = s);
    const o = i.getContext("2d");
    if (!o) throw Error("Finish resource canvas unavailable");
    o.drawImage(this.canvas, 0, 0);
  }
  mask(t, r, s) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    this.etcher ??= new F(this.gl);
    const i = this.etcher.run(t, r, s);
    try {
      const a = document.createElement("canvas");
      return this.draw(i, r, s, a), a;
    } finally {
      this.gl.deleteTexture(i);
    }
  }
  printDots(t, r, s, i, a = []) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.printing ??= new v(this.gl), this.printing.printDots(t, r, s, i, a);
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
    const a = this.documentQueue.then(async () => {
      if (s.signal.throwIfAborted(), await R(), s.signal.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
      return r(s.signal);
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
      t.removeEventListener("abort", i), this.documentControllers.delete(s);
    }
  }
  async documentMask(t, r, s) {
    return this.documentResource(s, async (i) => {
      if (i.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
      this.documentTextures ??= new A(this.gl, 16 * 1024 * 1024, 8 * 1024 * 1024), this.documentPreparer ??= new y(this.documentTextures, {
        images: (l, o) => this.documentHost.images(l, o)
      }), this.documentHost = r;
      let a, e;
      try {
        a = await this.documentPreparer.prepareMask(t, i);
        const l = m(t).filter((n) => n.etchCoverage);
        if (l.length) {
          const n = await E(t.recipe.color.size, l, r, i);
          i.throwIfAborted(), e = this.documentTextures.uploadBytes(
            `${t.recipe.pack}:` + JSON.stringify([
              "finish-etch-coverage-v1",
              t.recipe.color.size,
              l.map((h) => [
                h.clip,
                h.etchCoverage?.add?.key,
                h.etchCoverage?.exclude?.key
              ])
            ]),
            n,
            t.recipe.color.size
          );
        }
        i.throwIfAborted();
        const o = window.document.createElement("canvas");
        try {
          return this.draw(
            a.value.texture,
            a.value.width,
            a.value.height,
            o,
            e?.value
          ), o;
        } catch (n) {
          throw o.width = o.height = 0, n;
        }
      } finally {
        e?.release(), a?.release(), this.documentHost = void 0;
      }
    });
  }
  caustics(t) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.pool ??= new _(this.gl), this.poolTime !== t && (this.pool.prepare(t), this.draw(this.pool.map, 512, 512, this.poolCanvas), this.poolTime = t), this.poolCanvas;
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
  z as DEFAULT_PRINT_DOTS,
  G as FOIL_REFLECTION_GLSL,
  N as FinishResources,
  X as PRINT_DOTS_GLSL,
  V as SURFACE_GLSL,
  K as SurfaceMotion,
  Y as WORN_GLSL,
  O as foilShader,
  Q as surfaceSeed
};
