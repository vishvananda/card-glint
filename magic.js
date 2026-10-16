import { P as y, h as T, m as k, i as I, a as R, b, n as x, c as z, f as E, S as u, d as f, s as P, e as C, v as h, p as S, g as W, j as _, k as v, l as F, o as A, q as N, r as O, t as L, u as M, w as H } from "./canvas-face-D9YCfR_z.js";
import { F as K, x as X, y as $, z as Q, A as V, B as Z, C as ee, D as te, E as ae } from "./canvas-face-D9YCfR_z.js";
const J = {
  key: JSON.stringify(["magic-oval-interior-v1", y, 2, 1]),
  size: [134, 67],
  async paint(a, n) {
    const t = await a.images([{ url: y }], n);
    try {
      n.throwIfAborted();
      const s = t.value.get(y);
      if (!s) throw Error("Authenticity stamp mask is unavailable.");
      const r = document.createElement("canvas");
      r.width = 134, r.height = 67;
      const c = r.getContext("2d");
      if (!c) throw Error("Authenticity stamp mask needs Canvas2D.");
      return c.drawImage(s, 2, 1, 130, 65), r;
    } finally {
      t.release();
    }
  }
};
function U(a) {
  if (a.securityStampEffect === "static" || a.frameTemplate || !T(a))
    return;
  const n = k(a);
  let t, s;
  if (I(a) || R(a))
    t = f.saga, s = u.saga;
  else if (b(a))
    t = f.aftermath, s = u.saga;
  else if (x(a) === "m15")
    t = f.split, s = u.plain;
  else if (!z(a) && !a.frameAssetFamily && E(a) === "saga")
    t = f.saga, s = u.saga;
  else if (n)
    t = n.rect, s = E(a).startsWith("planeswalker") ? u.planeswalker : u.ordinary;
  else return;
  const [r, c, i, m] = t, [l, e, o, p] = s.interior, [d, g] = s.size;
  return {
    mask: J,
    rect: [
      (r + l / d * i) / 488,
      (c + e / g * m) / 680,
      o / d * i / 488,
      p / g * m / 680
    ],
    strength: 0.8,
    // The same foil stock has the same pattern across printings. Placement and
    // material do not create unnecessary per-card uniforms/batch breaks.
    seed: 1914
  };
}
function w(a) {
  return async (n, t) => {
    const s = await L(n, t);
    try {
      const r = await a.images(
        s.urls.map((c) => ({ url: c, width: M(c) })),
        t
      );
      return {
        images: H(s.aliases, r.value),
        dispose: () => r.release()
      };
    } finally {
      s.dispose();
    }
  };
}
const j = {
  id: "mtg",
  dispose() {
    N(), O();
  },
  describe(a, n) {
    const t = structuredClone({
      ...a,
      setCode: a.setCode ?? "GLINT"
    }), s = n === "table" ? [244, 340] : [732, 1020], r = { printingId: null, printedImage: null, face: t }, c = P(t), i = c.length ? c.map((e) => ({ face: e.face, panel: e })) : [{ face: t, panel: void 0 }], m = i.flatMap((e) => {
      if (!e.face.illustration) return [];
      const o = C(e.face).art, p = h(e.face);
      return [
        {
          key: JSON.stringify([
            "mtg-art-v1",
            e.face.illustration,
            e.face.etchedIllustration,
            512,
            20
          ]),
          asset: { url: e.face.illustration, width: 512 },
          threshold: 20,
          crop: e.face.illustrationCrop ?? [0, 0, 1, 1],
          destination: e.panel ? S(e.panel, o) : o,
          clip: e.panel ? S(e.panel, p) : p,
          rotation: e.panel?.rotation ?? 0,
          importedMask: e.face.etchedIllustration ? { url: e.face.etchedIllustration, width: 512 } : void 0
        }
      ];
    }), l = { ...r, layer: "etching" };
    return {
      pack: "mtg",
      hologram: U(t),
      color: {
        key: A(r, n),
        size: s,
        paint: (e, o, p) => v(r, n, o, {
          loadImages: w(e),
          underArt: p
        })
      },
      stamp: {
        key: JSON.stringify([
          "mtg-stamp-v3",
          n,
          t.setCode,
          i.map((e) => [
            C(e.face).stamp,
            e.face.setCode,
            F(e.face, "common"),
            e.panel ? [
              e.panel.x,
              e.panel.y,
              e.panel.width,
              e.panel.height,
              e.panel.rotation
            ] : null
          ])
        ]),
        size: s,
        paint: (e, o) => v(l, n, o, {
          loadImages: w(e)
        })
      },
      edges: m,
      artWindows: i.map(
        (e) => e.panel ? S(e.panel, h(e.face)) : h(e.face)
      ),
      cornerRadius: _(t),
      regions: [
        ...Object.entries(C(t)).map(([e, o]) => ({ id: e, rect: o })),
        ...I(t) ? Object.entries(W).map(([e, o]) => ({ id: `spell-${e}`, rect: o })) : []
      ]
    };
  }
}, D = "This Magic game pack is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.";
function Y(a, n, t, s, r = "inspect") {
  const c = structuredClone({ ...t, setCode: t.setCode ?? "GLINT" }), i = j.describe(c, r), m = (l) => {
    const e = { face: c, printingId: null, printedImage: null, paintLayer: l };
    return {
      key: A(e, r),
      size: i.color.size,
      paint: (o, p) => v(e, r, p, { loadImages: w(o) })
    };
  };
  return {
    id: a,
    revision: n,
    recipe: {
      ...i,
      color: m("artwork"),
      edges: [],
      stamp: void 0,
      finishCoverageBase: 0,
      overlayFoil: { tone: s, strength: { gold: 0.7, silver: 0.6, prismatic: 0.75 }[s] }
    },
    layers: [
      {
        id: "magic-printing",
        order: 0,
        stage: "over-finish",
        raster: m("printing"),
        finishCoverage: {
          add: {
            key: JSON.stringify(["magic-art-scope-v1", i.color.size, i.artWindows]),
            size: i.color.size,
            async paint() {
              const l = document.createElement("canvas");
              [l.width, l.height] = i.color.size;
              const e = l.getContext("2d");
              e.fillStyle = "#fff";
              for (const [o, p, d, g] of i.artWindows)
                e.fillRect(
                  o * l.width,
                  p * l.height,
                  d * l.width,
                  g * l.height
                );
              return l;
            }
          }
        }
      }
    ]
  };
}
export {
  K as FACE_RECTS,
  X as FACE_TEXT,
  D as disclaimer,
  E as faceFrame,
  C as faceRects,
  z as isRetro,
  j as magic,
  $ as manaSymbolAsset,
  j as mtg,
  Y as opticalDocument,
  Q as profileAssets,
  V as resolveCardProfile,
  Z as retroFamily,
  ee as retroRects,
  te as setSymbolAsset,
  ae as withCardWording
};
