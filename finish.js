import { F as M, f as N } from "./foil-preview-shader-rARa43Zn.js";
import { v as E, t as g, P as b, C as x, a as w, l as v, p as m, b as T, G as C, i as L, T as F, d as R, e as y } from "./renderer-DKLtQOl9.js";
import { f as O, g as H, S as W, h as z, W as X, s as V } from "./renderer-DKLtQOl9.js";
import { c as A, a as _ } from "./canvas-raster-B9HRvi4G.js";
class p {
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
    const t = this.gl, i = t.createFramebuffer();
    if (!i) throw Error("Finish resource framebuffer unavailable");
    try {
      if (t.bindFramebuffer(t.FRAMEBUFFER, i), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, e.texture, 0), t.checkFramebufferStatus(t.FRAMEBUFFER) !== t.FRAMEBUFFER_COMPLETE)
        throw Error("Finish resource framebuffer is incomplete");
      const o = new Uint8Array(e.width * e.height * 4);
      return t.pixelStorei(t.PACK_ALIGNMENT, 1), t.readPixels(0, 0, e.width, e.height, t.RGBA, t.UNSIGNED_BYTE, o), this.available(), { width: e.width, height: e.height, data: o };
    } finally {
      t.bindFramebuffer(t.FRAMEBUFFER, null), t.deleteFramebuffer(i);
    }
  }
  printDots(e, t, i, o) {
    if (this.available(), !o || typeof o != "object") throw Error("Invalid print dots");
    E(o);
    const s = this.gl, r = s.getParameter(s.MAX_TEXTURE_SIZE);
    if (!Number.isInteger(t) || !Number.isInteger(i) || t < 1 || i < 1 || t > r || i > r || t * i > 4194304)
      throw Error("Invalid printing size");
    let n, a;
    if (e instanceof HTMLImageElement ? (n = e.naturalWidth, a = e.naturalHeight) : e instanceof HTMLVideoElement ? (n = e.videoWidth, a = e.videoHeight) : typeof VideoFrame < "u" && e instanceof VideoFrame ? (n = e.displayWidth, a = e.displayHeight) : (n = e.width, a = e.height), n !== t || a !== i)
      throw Error("Printing size must match the source");
    let l, h, c;
    try {
      if (typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
        c = document.createElement("canvas"), c.width = t, c.height = i;
        const f = c.getContext("2d");
        if (!f) throw Error("Printing source canvas unavailable");
        f.drawImage(e, 0, 0), e = c;
      }
      const d = g(s, t, i, s.SRGB8_ALPHA8, s.RGBA);
      return l = d, s.activeTexture(s.TEXTURE0), s.bindTexture(s.TEXTURE_2D, d), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !0), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, s.BROWSER_DEFAULT_WEBGL), s.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, s.RGBA, s.UNSIGNED_BYTE, e), this.ink ??= new b(s), h = this.ink.paint({ texture: d, width: t, height: i }, [
        o.amount,
        o.period ?? 5,
        o.variation ?? 0.5,
        o.inset ?? 0
      ]), this.snapshot(h);
    } finally {
      s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1), s.bindTexture(s.TEXTURE_2D, null), s.deleteTexture(l ?? null), s.deleteTexture(h?.texture ?? null), c && (c.width = c.height = 0);
    }
  }
  cardstock() {
    return this.available(), this.stockMap ? this.stockMap : (this.stock ??= new x(this.gl), this.stock.prepare(), this.stockMap = this.snapshot({
      texture: this.stock.map,
      width: this.stock.width,
      height: this.stock.height
    }), this.stockMap);
  }
  dispose() {
    this.disposed || (this.disposed = !0, this.ink?.dispose(), this.stock?.dispose(), this.stockMap = void 0);
  }
}
async function I(u, e, t) {
  t.throwIfAborted(), w(u);
  const i = u.recipe.color.size, o = u.recipe.finishCoverageBase ?? 1, s = v(u).filter((a) => a.finishCoverage).map((a) => ({ ...a, etchCoverage: void 0 })), r = await m(i, s, e, t);
  t.throwIfAborted();
  const n = A(i);
  try {
    const a = n.getContext("2d");
    for (let l = 0; l < r.length; l += 4) {
      const h = Math.round(Math.max(o * 255, r[l]) * (1 - r[l + 1] / 255));
      r[l] = r[l + 1] = r[l + 2] = h, r[l + 3] = 255;
    }
    return t.throwIfAborted(), a.putImageData(
      new ImageData(
        new Uint8ClampedArray(r.buffer, r.byteOffset, r.byteLength),
        ...i
      ),
      0,
      0
    ), n;
  } catch (a) {
    throw _(n), a;
  }
}
const S = `#version 300 es
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
class k {
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
    for (const t of this.documentControllers) t.abort();
  };
  restored = () => {
    this.documentPreparer?.dispose(), this.documentTextures?.dispose(), this.documentPreparer = void 0, this.documentTextures = void 0, this.etcher = void 0, this.pool = void 0, this.copy = void 0, this.vao = void 0, this.poolTime = NaN, this.printing = void 0;
  };
  draw(e, t, i, o, s) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    const r = this.gl, n = this.copy ??= T(r, S);
    this.vao ??= r.createVertexArray(), this.canvas.width = t, this.canvas.height = i, r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindVertexArray(this.vao), r.viewport(0, 0, t, i), r.disable(r.BLEND), r.disable(r.DEPTH_TEST), r.disable(r.SCISSOR_TEST), r.disable(r.CULL_FACE), r.colorMask(!0, !0, !0, !0), r.useProgram(n), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, e), r.uniform1i(r.getUniformLocation(n, "source"), 0), r.uniform2f(r.getUniformLocation(n, "size"), t, i), r.uniform1i(r.getUniformLocation(n, "hasCoverage"), s ? 1 : 0), r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, s?.texture ?? e), r.uniform1i(r.getUniformLocation(n, "coverage"), 1), r.drawArrays(r.TRIANGLES, 0, 3), (o.width !== t || o.height !== i) && (o.width = t, o.height = i);
    const a = o.getContext("2d");
    if (!a) throw Error("Finish resource canvas unavailable");
    a.drawImage(this.canvas, 0, 0);
  }
  mask(e, t, i) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    this.etcher ??= new C(this.gl);
    const o = this.etcher.run(e, t, i);
    try {
      const s = document.createElement("canvas");
      return this.draw(o, t, i, s), s;
    } finally {
      this.gl.deleteTexture(o);
    }
  }
  printDots(e, t, i, o) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.printing ??= new p(this.gl), this.printing.printDots(e, t, i, o);
  }
  cardstock() {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.printing ??= new p(this.gl), this.printing.cardstock();
  }
  documentCoverage(e, t, i) {
    return this.documentResource(i, (o) => I(e, t, o));
  }
  async documentResource(e, t) {
    if (e.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    const i = new AbortController(), o = () => i.abort(e.reason);
    e.addEventListener("abort", o, { once: !0 }), this.documentControllers.add(i);
    const s = this.documentQueue.then(async () => {
      if (i.signal.throwIfAborted(), await L(), i.signal.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
      return t(i.signal);
    });
    this.documentQueue = s.then(
      () => {
      },
      () => {
      }
    );
    try {
      return await s;
    } finally {
      e.removeEventListener("abort", o), this.documentControllers.delete(i);
    }
  }
  async documentMask(e, t, i) {
    return this.documentResource(i, async (o) => {
      if (o.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
      this.documentTextures ??= new F(this.gl, 16 * 1024 * 1024, 8 * 1024 * 1024), this.documentPreparer ??= new R(this.documentTextures, {
        images: (n, a) => this.documentHost.images(n, a)
      }), this.documentHost = t;
      let s, r;
      try {
        s = await this.documentPreparer.prepareMask(e, o);
        const n = v(e).filter((l) => l.etchCoverage);
        if (n.length) {
          const l = await m(e.recipe.color.size, n, t, o);
          o.throwIfAborted(), r = this.documentTextures.uploadBytes(
            `${e.recipe.pack}:` + JSON.stringify([
              "finish-etch-coverage-v1",
              e.recipe.color.size,
              n.map((h) => [
                h.clip,
                h.etchCoverage?.add?.key,
                h.etchCoverage?.exclude?.key
              ])
            ]),
            l,
            e.recipe.color.size
          );
        }
        o.throwIfAborted();
        const a = window.document.createElement("canvas");
        try {
          return this.draw(
            s.value.texture,
            s.value.width,
            s.value.height,
            a,
            r?.value
          ), a;
        } catch (l) {
          throw a.width = a.height = 0, l;
        }
      } finally {
        r?.release(), s?.release(), this.documentHost = void 0;
      }
    });
  }
  caustics(e) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.pool ??= new y(this.gl), this.poolTime !== e && (this.pool.prepare(e), this.draw(this.pool.map, 512, 512, this.poolCanvas), this.poolTime = e), this.poolCanvas;
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
  O as CARDSTOCK_GLSL,
  M as FOIL_REFLECTION_GLSL,
  k as FinishResources,
  H as PRINT_DOTS_GLSL,
  W as SURFACE_GLSL,
  z as SurfaceMotion,
  X as WORN_GLSL,
  N as foilShader,
  V as surfaceSeed
};
