import { R as E, P as m } from "./renderer-Dz0LYE_V.js";
import { G as w, t as u } from "./caustics-BcoLQAX8.js";
class T {
  constructor(r, s) {
    if (this.destroy = s, !Number.isSafeInteger(r) || r < 1 || r > 4294967295)
      throw RangeError("Invalid cache budget");
    this.policy = new E(r);
  }
  destroy;
  policy;
  resources = /* @__PURE__ */ new Map();
  generation = 0;
  acquire(r) {
    const s = this.policy.lookup(r);
    return s === void 0 ? null : this.lease(s);
  }
  insert(r, s, h) {
    if (!Number.isSafeInteger(h) || h < 1 || h > 4294967295)
      throw this.destroy(s), RangeError("Invalid resource size");
    let o;
    try {
      o = JSON.parse(this.policy.admit(r, h, 1));
    } catch (t) {
      throw this.destroy(s), t;
    }
    for (const t of o.evicted) {
      const e = this.resources.get(t);
      e !== void 0 && this.destroy(e), this.resources.delete(t);
    }
    return this.resources.has(o.handle) ? this.destroy(s) : this.resources.set(o.handle, s), this.lease(o.handle);
  }
  /** Admit and evict before allocating a GPU object, so a miss does not
   * temporarily duplicate the resident cache's entire working set. */
  create(r, s, h, o = 1) {
    if (!Number.isSafeInteger(s) || s < 1 || s > 4294967295)
      throw RangeError("Invalid resource size");
    const t = JSON.parse(
      this.policy.admit(r, s, o)
    );
    for (const e of t.evicted) {
      const i = this.resources.get(e);
      i !== void 0 && this.destroy(i), this.resources.delete(e);
    }
    if (this.resources.has(t.handle)) return this.lease(t.handle);
    try {
      return this.resources.set(t.handle, h()), this.lease(t.handle);
    } catch (e) {
      throw this.policy.remove(t.handle), e;
    }
  }
  lease(r) {
    const s = this.resources.get(r);
    if (s === void 0) throw Error("Resource ownership mismatch");
    this.policy.pin(r, !0);
    const h = this.generation;
    let o = !1;
    return {
      value: s,
      release: () => {
        o || (o = !0, h === this.generation && this.policy.pin(r, !1));
      }
    };
  }
  get stats() {
    return JSON.parse(this.policy.stats());
  }
  clear() {
    this.generation++;
    for (const r of this.resources.values()) this.destroy(r);
    this.resources.clear(), this.policy.clear();
  }
  dispose() {
    this.clear(), this.policy.free();
  }
}
class _ {
  constructor(r, s, h, o = "gpu") {
    this.gl = r, this.scratchLimit = h, this.mode = o, this.store = new T(s, (t) => r.deleteTexture(t.texture)), this.etcher = new w(r);
  }
  gl;
  scratchLimit;
  mode;
  store;
  etcher;
  kernels = new m();
  uploads = 0;
  edgeBuilds = 0;
  readbacks = 0;
  upload(r, s, h = !0, o = 1) {
    const t = this.store.acquire(r);
    if (t) return t;
    const e = this.gl, i = s.width, n = s.height;
    return this.store.create(
      r,
      i * n * 4,
      () => {
        const a = u(e, i, n, h ? e.SRGB8_ALPHA8 : e.RGBA8, e.RGBA);
        if (e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, a), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), typeof ImageBitmap < "u" && s instanceof ImageBitmap) {
          const c = document.createElement("canvas");
          c.width = i, c.height = n;
          try {
            c.getContext("2d").drawImage(s, 0, 0), e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, e.RGBA, e.UNSIGNED_BYTE, c);
          } finally {
            c.width = c.height = 0;
          }
        } else
          e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, e.RGBA, e.UNSIGNED_BYTE, s);
        return e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), this.uploads++, { texture: a, width: i, height: n };
      },
      o
    );
  }
  edge(r, s, h) {
    const o = this.store.acquire(r);
    if (o) return o;
    const t = this.gl, e = s.width, i = s.height;
    if (e * i * 7 > this.scratchLimit) throw Error("Etching exceeds scratch budget");
    return this.store.create(
      r,
      e * i,
      () => {
        let n;
        if (this.mode === "gpu") n = this.etcher.run(s, e, i, h);
        else {
          const a = document.createElement("canvas");
          a.width = e, a.height = i;
          try {
            const c = a.getContext("2d", { willReadFrequently: !0 });
            c.drawImage(s, 0, 0);
            const d = c.getImageData(0, 0, e, i).data, g = this.kernels.etch(
              e,
              i,
              new Uint8Array(d.buffer, d.byteOffset, d.byteLength),
              h
            ), p = new Uint8Array(g.length);
            for (let l = 0; l < i; l++)
              p.set(g.subarray(l * e, (l + 1) * e), (i - 1 - l) * e);
            n = u(t, e, i), t.bindTexture(t.TEXTURE_2D, n), t.pixelStorei(t.UNPACK_ALIGNMENT, 1), t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, e, i, t.RED, t.UNSIGNED_BYTE, p);
          } finally {
            a.width = a.height = 0;
          }
        }
        return this.uploads++, this.edgeBuilds++, { texture: n, width: e, height: i };
      },
      0
    );
  }
  uploadBytes(r, s, h) {
    const o = this.store.acquire(r);
    if (o) return o;
    const t = this.gl, [e, i] = h, n = new Uint8Array(s.length);
    for (let a = 0; a < i; a++)
      n.set(s.subarray(a * e * 4, (a + 1) * e * 4), (i - 1 - a) * e * 4);
    return this.store.create(r, e * i * 4, () => {
      const a = u(t, e, i, t.RGBA8, t.RGBA);
      return t.bindTexture(t.TEXTURE_2D, a), t.pixelStorei(t.UNPACK_ALIGNMENT, 1), t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !1), t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, e, i, t.RGBA, t.UNSIGNED_BYTE, n), this.uploads++, { texture: a, width: e, height: i };
    });
  }
  read(r) {
    return this.readbacks++, this.etcher.read(r.texture, r.width, r.height);
  }
  get scratchBytes() {
    return this.etcher.width * this.etcher.height * 7;
  }
  dispose() {
    this.store.dispose(), this.etcher.dispose(), this.kernels.free();
  }
}
const R = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextureStore: _
}, Symbol.toStringTag, { value: "Module" }));
export {
  T as R,
  _ as T,
  R as t
};
