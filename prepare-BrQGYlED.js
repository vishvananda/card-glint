import { c as C } from "./image-cover-QdXNryDE.js";
import { p as S, t as O } from "./caustics-BcoLQAX8.js";
import { layersOf as M, layerKey as k, paintLayers as A, paintRaster as T, closeRaster as E, paintCoverage as U } from "./raster-8MSDN7In.js";
const N = `#version 300 es
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
class L {
  constructor(a) {
    this.textures = a;
    const s = a.gl;
    this.shader = S(s, N), this.fbo = s.createFramebuffer(), this.vao = s.createVertexArray();
  }
  textures;
  shader;
  fbo;
  vao;
  disposed = !1;
  builds = 0;
  compose(a, s, o, n) {
    const u = this.textures.store.acquire(a);
    if (u) return u;
    const e = this.textures.gl, [l, c] = s;
    return this.textures.store.create(a, l * c, () => {
      const g = O(e, l, c);
      try {
        if (e.bindFramebuffer(e.FRAMEBUFFER, this.fbo), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, g, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
          throw Error("Mask framebuffer unavailable");
        e.bindVertexArray(this.vao), e.viewport(0, 0, l, c), e.disable(e.DEPTH_TEST), e.disable(e.SCISSOR_TEST), e.disable(e.DITHER), e.colorMask(!0, !0, !0, !0), e.clearColor(0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT), e.useProgram(this.shader), e.enable(e.BLEND), e.blendFunc(e.ONE, e.ONE_MINUS_SRC_ALPHA);
        const y = (i, r, h, d, m, f = 0) => {
          e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, i.texture), e.uniform1i(e.getUniformLocation(this.shader, "inputMask"), 0), e.uniform2f(e.getUniformLocation(this.shader, "size"), l, c), e.uniform4fv(e.getUniformLocation(this.shader, "cover"), r), e.uniform4fv(e.getUniformLocation(this.shader, "clip"), h), e.uniform4fv(e.getUniformLocation(this.shader, "crop"), d), e.uniform1f(e.getUniformLocation(this.shader, "alphaChannel"), m ? 1 : 0), e.uniform1f(e.getUniformLocation(this.shader, "angle"), f), e.drawArrays(e.TRIANGLES, 0, 3);
        };
        n && y(n, [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1], !0);
        for (const { value: i, spec: r } of o) {
          const [h, d, m, f] = r.destination, p = r.rotation ?? 0, x = i.width * r.crop[2], t = i.height * r.crop[3];
          let v;
          if (r.fit) {
            const w = r.fit.focalPoint ?? [0.5, 0.5], F = {
              ...r.fit,
              focalPoint: p === 90 ? [1 - w[1], w[0]] : p === -90 ? [w[1], 1 - w[0]] : w
            }, b = C(
              p ? t : x,
              p ? x : t,
              [h * l, d * c, m * l, f * c],
              F
            );
            v = [b[0] / l, b[1] / c, b[2] / l, b[3] / c];
          } else {
            const w = Math.max(
              m * l / (p ? t : x),
              f * c / (p ? x : t)
            ), F = (p ? t : x) * w / l, b = (p ? x : t) * w / c;
            v = [h + (m - F) / 2, d + (f - b) / 2, F, b];
          }
          y(i, v, r.clip, r.crop, !!r.importedMask, p);
        }
        this.builds++;
      } catch (y) {
        throw e.deleteTexture(g), y;
      } finally {
        e.disable(e.BLEND), e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindVertexArray(null);
      }
      return { texture: g, width: l, height: c };
    });
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    const a = this.textures.gl;
    a.deleteProgram(this.shader), a.deleteFramebuffer(this.fbo), a.deleteVertexArray(this.vao);
  }
}
class P {
  constructor(a, s) {
    this.textures = a, this.assets = s, this.masks = new L(a);
  }
  textures;
  assets;
  masks;
  pending = /* @__PURE__ */ new Map();
  compositions = 0;
  async ensure(a, s) {
    const o = this.textures.store.acquire(a);
    if (o) return o;
    let n = this.pending.get(a);
    n || (n = s().then((e) => e.release()).finally(() => this.pending.delete(a)), this.pending.set(a, n)), await n;
    const u = this.textures.store.acquire(a);
    if (!u) throw Error("Prepared working set exceeds GPU budget");
    return u;
  }
  async prepare(a, s) {
    const { recipe: o } = a, n = o.color.size, u = M(a), e = [], l = u.filter((t) => t.stage === "under-art"), c = u.filter((t) => t.stage === "printed-content" || t.stage === "under-finish"), g = u.filter((t) => t.stage === "over-finish"), y = u.filter((t) => t.contributesToEtch), i = u.filter((t) => t.finishCoverage || t.etchCoverage), r = `${o.pack}:`, h = r + JSON.stringify(["color-v1", o.color.key, k([...l, ...c])]), d = r + JSON.stringify(["mask-v1", n, o.edges, o.stamp?.key, k(y)]), m = g.length ? r + JSON.stringify(["over-v1", n, k(g)]) : void 0, f = i.length ? r + JSON.stringify([
      "coverage-v1",
      n,
      i.map((t) => [
        t.clip,
        t.finishCoverage?.add?.key,
        t.finishCoverage?.exclude?.key,
        t.etchCoverage?.add?.key,
        t.etchCoverage?.exclude?.key
      ])
    ]) : void 0, p = o.hologram ? r + JSON.stringify(["hologram-v1", o.hologram.mask.key, o.hologram.mask.size]) : void 0, x = JSON.stringify(
      o.hologram ? [o.hologram.rect, o.hologram.strength, o.hologram.seed ?? 0] : null
    );
    try {
      return e.push(
        await this.ensure(h, async () => {
          const t = l.length ? await A(n, l, this.assets, s) : void 0;
          let v;
          try {
            return v = await T(o.color, this.assets, s, t), await A(n, c, this.assets, s, v), s.throwIfAborted(), this.compositions++, this.textures.upload(h, v);
          } finally {
            t && E(t), v && E(v);
          }
        })
      ), e.push(await this.prepareMask(a, s)), m && e.push(
        await this.ensure(m, async () => {
          const t = await A(n, g, this.assets, s);
          try {
            return s.throwIfAborted(), this.textures.upload(m, t);
          } finally {
            E(t);
          }
        })
      ), f && e.push(
        await this.ensure(f, async () => {
          const t = await U(n, i, this.assets, s);
          return s.throwIfAborted(), this.textures.uploadBytes(f, t, n);
        })
      ), p && e.push(
        await this.ensure(p, async () => {
          const t = await T(o.hologram.mask, this.assets, s);
          try {
            return s.throwIfAborted(), this.textures.upload(p, t, !1);
          } finally {
            E(t);
          }
        })
      ), s.throwIfAborted(), { color: h, mask: d, overlay: m, coverage: f, hologram: p, hologramSettings: x, document: a };
    } finally {
      for (const t of e) t.release();
    }
  }
  async prepareMask(a, s) {
    const { recipe: o } = a, n = o.color.size, u = M(a).filter((c) => c.contributesToEtch), e = `${o.pack}:`, l = e + JSON.stringify(["mask-v1", n, o.edges, o.stamp?.key, k(u)]);
    return this.ensure(l, async () => {
      const c = [], g = [];
      try {
        for (const i of o.edges) {
          const r = e + JSON.stringify([
            "edge-integer-v1",
            i.key,
            i.asset,
            i.importedMask,
            i.threshold
          ]), h = await this.ensure(r, async () => {
            const d = i.importedMask ?? i.asset, m = await this.assets.images([d], s);
            try {
              s.throwIfAborted();
              const f = m.value.get(d.url);
              if (!f) throw Error(`Edge asset unavailable: ${d.url}`);
              return i.importedMask ? this.textures.upload(r, f, !1, 0) : this.textures.edge(r, f, i.threshold);
            } finally {
              m.release();
            }
          });
          g.push(h), c.push({ value: h.value, spec: i });
        }
        for (const i of u) {
          const r = e + JSON.stringify(["contribution-v1", n, k([i])]), h = await this.ensure(r, async () => {
            const d = await A(n, [i], this.assets, s);
            try {
              return s.throwIfAborted(), this.textures.edge(r, d, 20);
            } finally {
              E(d);
            }
          });
          g.push(h), c.push({
            value: h.value,
            spec: {
              key: r,
              asset: { url: "" },
              crop: [0, 0, 1, 1],
              destination: [0, 0, 1, 1],
              clip: [0, 0, 1, 1],
              threshold: 20
            }
          });
        }
        let y;
        if (o.stamp) {
          const i = o.stamp, r = e + JSON.stringify(["stamp-v1", i.key]);
          y = await this.ensure(r, async () => {
            const h = await T(i, this.assets, s);
            try {
              return s.throwIfAborted(), this.textures.upload(r, h, !1, 0);
            } finally {
              E(h);
            }
          }), g.push(y);
        }
        return s.throwIfAborted(), this.masks.compose(l, n, c, y?.value);
      } finally {
        for (const y of g) y.release();
      }
    });
  }
  dispose() {
    this.masks.dispose();
  }
}
export {
  P as Preparer
};
