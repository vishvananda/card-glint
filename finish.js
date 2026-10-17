import { F, f as S } from "./foil-preview-shader-DUb7R5u0.js";
import { p as g, G as x, C as w } from "./caustics-BcoLQAX8.js";
import { S as R, a as P, W as _, s as U } from "./caustics-BcoLQAX8.js";
const E = `#version 300 es
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
class T {
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
    this.documentPreparer?.dispose(), this.documentTextures?.dispose(), this.documentPreparer = void 0, this.documentTextures = void 0, this.etcher = void 0, this.pool = void 0, this.copy = void 0, this.vao = void 0, this.poolTime = NaN;
  };
  draw(t, r, s, o, a) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    const e = this.gl, n = this.copy ??= g(e, E);
    this.vao ??= e.createVertexArray(), this.canvas.width = r, this.canvas.height = s, e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindVertexArray(this.vao), e.viewport(0, 0, r, s), e.disable(e.BLEND), e.disable(e.DEPTH_TEST), e.disable(e.SCISSOR_TEST), e.disable(e.CULL_FACE), e.colorMask(!0, !0, !0, !0), e.useProgram(n), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, t), e.uniform1i(e.getUniformLocation(n, "source"), 0), e.uniform2f(e.getUniformLocation(n, "size"), r, s), e.uniform1i(e.getUniformLocation(n, "hasCoverage"), a ? 1 : 0), e.activeTexture(e.TEXTURE1), e.bindTexture(e.TEXTURE_2D, a?.texture ?? t), e.uniform1i(e.getUniformLocation(n, "coverage"), 1), e.drawArrays(e.TRIANGLES, 0, 3), (o.width !== r || o.height !== s) && (o.width = r, o.height = s);
    const u = o.getContext("2d");
    if (!u) throw Error("Finish resource canvas unavailable");
    u.drawImage(this.canvas, 0, 0);
  }
  mask(t, r, s) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    this.etcher ??= new x(this.gl);
    const o = this.etcher.run(t, r, s);
    try {
      const a = document.createElement("canvas");
      return this.draw(o, r, s, a), a;
    } finally {
      this.gl.deleteTexture(o);
    }
  }
  async documentMask(t, r, s) {
    if (s.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    const o = new AbortController(), a = () => o.abort(s.reason);
    s.addEventListener("abort", a, { once: !0 }), this.documentControllers.add(o);
    const e = async () => {
      o.signal.throwIfAborted();
      const [{ initializeRenderer: u }, { TextureStore: m }, { Preparer: f }, p] = await Promise.all([
        import("./renderer-4CrHojOL.js").then((i) => i.r),
        import("./textures-DTvVPz-u.js").then((i) => i.t),
        import("./prepare-BrQGYlED.js"),
        import("./raster-8MSDN7In.js")
      ]);
      if (await u(), o.signal.throwIfAborted(), this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
      this.documentTextures ??= new m(this.gl, 16 * 1024 * 1024, 8 * 1024 * 1024), this.documentPreparer ??= new f(this.documentTextures, {
        images: (i, c) => this.documentHost.images(i, c)
      }), this.documentHost = r;
      let l, d;
      try {
        l = await this.documentPreparer.prepareMask(t, o.signal);
        const i = p.layersOf(t).filter((h) => h.etchCoverage);
        if (i.length) {
          const h = await p.paintCoverage(
            t.recipe.color.size,
            i,
            r,
            o.signal
          );
          o.signal.throwIfAborted(), d = this.documentTextures.uploadBytes(
            `${t.recipe.pack}:` + JSON.stringify([
              "finish-etch-coverage-v1",
              t.recipe.color.size,
              i.map((v) => [
                v.clip,
                v.etchCoverage?.add?.key,
                v.etchCoverage?.exclude?.key
              ])
            ]),
            h,
            t.recipe.color.size
          );
        }
        o.signal.throwIfAborted();
        const c = window.document.createElement("canvas");
        try {
          return this.draw(
            l.value.texture,
            l.value.width,
            l.value.height,
            c,
            d?.value
          ), c;
        } catch (h) {
          throw c.width = c.height = 0, h;
        }
      } finally {
        d?.release(), l?.release(), this.documentHost = void 0;
      }
    }, n = this.documentQueue.then(e);
    this.documentQueue = n.then(
      () => {
      },
      () => {
      }
    );
    try {
      return await n;
    } finally {
      s.removeEventListener("abort", a), this.documentControllers.delete(o);
    }
  }
  caustics(t) {
    if (this.disposed || this.gl.isContextLost()) throw Error("Finish resources unavailable");
    return this.pool ??= new w(this.gl), this.poolTime !== t && (this.pool.prepare(t), this.draw(this.pool.map, 512, 512, this.poolCanvas), this.poolTime = t), this.poolCanvas;
  }
  dispose() {
    if (!this.disposed) {
      this.disposed = !0;
      for (const t of this.documentControllers) t.abort();
      this.documentControllers.clear(), this.documentPreparer?.dispose(), this.documentTextures?.dispose(), this.canvas.removeEventListener("webglcontextlost", this.lost), this.canvas.removeEventListener("webglcontextrestored", this.restored), this.etcher?.dispose(), this.pool?.dispose(), this.gl.deleteProgram(this.copy ?? null), this.gl.deleteVertexArray(this.vao ?? null), this.gl.getExtension("WEBGL_lose_context")?.loseContext(), this.canvas.width = this.canvas.height = 1;
    }
  }
}
export {
  F as FOIL_REFLECTION_GLSL,
  T as FinishResources,
  R as SURFACE_GLSL,
  P as SurfaceMotion,
  _ as WORN_GLSL,
  S as foilShader,
  U as surfaceSeed
};
