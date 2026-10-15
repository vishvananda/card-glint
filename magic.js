import { s as I, f as m, v as d, p as u, i as S, P as b, a as h, c as g, b as R, d as C, e as k, g as z, r as E, h as x, j as P } from "./canvas-face-DUn2ZLyj.js";
import { F as O, k as _, l as j, m as J, n as M, o as B, q as G, t as H, u as q, w as D, x as K } from "./canvas-face-DUn2ZLyj.js";
function y(p) {
  return async (n, t) => {
    const i = await E(n, t);
    try {
      const r = await p.images(
        i.urls.map((c) => ({ url: c, width: x(c) })),
        t
      );
      return {
        images: P(i.aliases, r.value),
        dispose: () => r.release()
      };
    } finally {
      i.dispose();
    }
  };
}
const T = {
  id: "mtg",
  dispose() {
    k(), z();
  },
  describe(p, n) {
    const t = structuredClone({
      ...p,
      setCode: p.setCode ?? "GLINT"
    }), i = n === "table" ? [244, 340] : [732, 1020], r = { printingId: null, printedImage: null, face: t }, c = I(t), o = c.length ? c.map((e) => ({ face: e.face, panel: e })) : [{ face: t, panel: void 0 }], f = o.flatMap((e) => {
      if (!e.face.illustration) return [];
      const a = m(e.face).art, l = d(e.face);
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
          destination: e.panel ? u(e.panel, a) : a,
          clip: e.panel ? u(e.panel, l) : l,
          rotation: e.panel?.rotation ?? 0,
          importedMask: e.face.etchedIllustration ? { url: e.face.etchedIllustration, width: 512 } : void 0
        }
      ];
    }), s = { ...r, layer: "etching" };
    return {
      pack: "mtg",
      color: {
        key: C(r, n),
        size: i,
        paint: (e, a, l) => g(r, n, a, {
          loadImages: y(e),
          underArt: l
        })
      },
      stamp: {
        key: JSON.stringify([
          "mtg-stamp-v3",
          n,
          t.setCode,
          o.map((e) => [
            m(e.face).stamp,
            e.face.setCode,
            R(e.face, "common"),
            e.panel ? [
              e.panel.x,
              e.panel.y,
              e.panel.width,
              e.panel.height,
              e.panel.rotation
            ] : null
          ])
        ]),
        size: i,
        paint: (e, a) => g(s, n, a, {
          loadImages: y(e)
        })
      },
      edges: f,
      artWindows: o.map(
        (e) => e.panel ? u(e.panel, d(e.face)) : d(e.face)
      ),
      cornerRadius: h(t),
      regions: [
        ...Object.entries(m(t)).map(([e, a]) => ({ id: e, rect: a })),
        ...S(t) ? Object.entries(b).map(([e, a]) => ({ id: `spell-${e}`, rect: a })) : []
      ]
    };
  }
}, F = "This Magic game pack is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.";
function W(p, n, t, i, r = "inspect") {
  const c = structuredClone({ ...t, setCode: t.setCode ?? "GLINT" }), o = T.describe(c, r), f = (s) => {
    const e = { face: c, printingId: null, printedImage: null, paintLayer: s };
    return {
      key: C(e, r),
      size: o.color.size,
      paint: (a, l) => g(e, r, l, { loadImages: y(a) })
    };
  };
  return {
    id: p,
    revision: n,
    recipe: {
      ...o,
      color: f("artwork"),
      edges: [],
      stamp: void 0,
      finishCoverageBase: 0,
      overlayFoil: { tone: i, strength: { gold: 0.7, silver: 0.6, prismatic: 0.75 }[i] }
    },
    layers: [
      {
        id: "magic-printing",
        order: 0,
        stage: "over-finish",
        raster: f("printing"),
        finishCoverage: {
          add: {
            key: JSON.stringify(["magic-art-scope-v1", o.color.size, o.artWindows]),
            size: o.color.size,
            async paint() {
              const s = document.createElement("canvas");
              [s.width, s.height] = o.color.size;
              const e = s.getContext("2d");
              e.fillStyle = "#fff";
              for (const [a, l, v, w] of o.artWindows)
                e.fillRect(
                  a * s.width,
                  l * s.height,
                  v * s.width,
                  w * s.height
                );
              return s;
            }
          }
        }
      }
    ]
  };
}
export {
  O as FACE_RECTS,
  _ as FACE_TEXT,
  F as disclaimer,
  j as faceFrame,
  m as faceRects,
  J as isRetro,
  T as magic,
  M as manaSymbolAsset,
  T as mtg,
  W as opticalDocument,
  B as profileAssets,
  G as resolveCardProfile,
  H as retroFamily,
  q as retroRects,
  D as setSymbolAsset,
  K as withCardWording
};
