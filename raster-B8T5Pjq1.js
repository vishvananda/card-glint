import { v as w } from "./renderer-Dz0LYE_V.js";
function g(t) {
  const [e, a] = t;
  if (!Number.isInteger(e) || !Number.isInteger(a) || e < 1 || a < 1 || e * a > 4194304)
    throw RangeError("Invalid raster size");
  const r = document.createElement("canvas");
  return r.width = e, r.height = a, r;
}
function d(t) {
  t.width = t.height = 0;
}
async function m(t, e, a, r) {
  a.throwIfAborted();
  const n = await t.paint(e, a, r);
  if (n.width !== t.size[0] || n.height !== t.size[1] || a.aborted)
    throw d(n), a.throwIfAborted(), Error("Raster dimensions differ from recipe");
  return n;
}
function b(t) {
  const e = t.layers ?? [], a = w(
    JSON.stringify(
      e.map((r) => ({
        id: r.id,
        stage: r.stage,
        order: r.order,
        contributesToEtch: r.contributesToEtch ?? !1
      }))
    )
  );
  return Array.from(a, (r) => e[r]);
}
function x(t) {
  return JSON.stringify(t.map((e) => [e.id, e.stage, e.order, e.raster.key, e.clip]));
}
async function p(t, e, a, r, n = g(t)) {
  const s = n.getContext("2d");
  try {
    for (const c of e) {
      const o = await m(c.raster, a, r);
      try {
        if (s.save(), c.clip) {
          s.beginPath();
          const [l, i, h, u] = c.clip;
          s.rect(l * t[0], i * t[1], h * t[0], u * t[1]), s.clip();
        }
        s.drawImage(o, 0, 0, ...t), s.restore();
      } finally {
        d(o);
      }
    }
    return n;
  } catch (c) {
    throw d(n), c;
  }
}
async function C(t, e, a, r) {
  const n = g(t), s = n.getContext("2d", { willReadFrequently: !0 }), c = s.createImageData(...t);
  try {
    for (const o of e) {
      const l = [
        o.finishCoverage?.add,
        o.finishCoverage?.exclude,
        o.etchCoverage?.add,
        o.etchCoverage?.exclude
      ];
      for (let i = 0; i < 4; i++) {
        const h = l[i];
        if (!h) continue;
        const u = await p(t, [{ ...o, raster: h }], a, r);
        try {
          const y = u.getContext("2d").getImageData(0, 0, ...t).data;
          for (let f = 0; f < y.length; f += 4)
            c.data[f + i] = Math.max(c.data[f + i], y[f + 3]);
        } finally {
          d(u);
        }
      }
    }
    return d(n), new Uint8Array(c.data.buffer);
  } catch (o) {
    throw d(n), o;
  }
}
export {
  x as a,
  m as b,
  g as c,
  d,
  C as e,
  b as l,
  p
};
