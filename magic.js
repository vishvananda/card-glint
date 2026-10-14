import { s as I, f as m, v as d, p as u, a as b, c as g, b as h, d as C, e as S, g as k, r as z, h as x, i as F } from "./canvas-face-jQHxRroc.js";
import { F as L, j as O, k as P, l as J, m as M, n as j, o as B, q as G, t as H, u as _, w as q } from "./canvas-face-jQHxRroc.js";
function y(p) {
  return async (n, a) => {
    const i = await z(n, a);
    try {
      const r = await p.images(
        i.urls.map((c) => ({ url: c, width: x(c) })),
        a
      );
      return {
        images: F(i.aliases, r.value),
        dispose: () => r.release()
      };
    } finally {
      i.dispose();
    }
  };
}
const R = {
  id: "mtg",
  dispose() {
    S(), k();
  },
  describe(p, n) {
    const a = structuredClone({
      ...p,
      setCode: p.setCode ?? "GLINT"
    }), i = n === "table" ? [244, 340] : [732, 1020], r = { printingId: null, printedImage: null, face: a }, c = I(a), o = c.length ? c.map((e) => ({ face: e.face, panel: e })) : [{ face: a, panel: void 0 }], f = o.flatMap((e) => {
      if (!e.face.illustration) return [];
      const s = m(e.face).art, l = d(e.face);
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
          destination: e.panel ? u(e.panel, s) : s,
          clip: e.panel ? u(e.panel, l) : l,
          rotation: e.panel?.rotation ?? 0,
          importedMask: e.face.etchedIllustration ? { url: e.face.etchedIllustration, width: 512 } : void 0
        }
      ];
    }), t = { ...r, layer: "etching" };
    return {
      pack: "mtg",
      color: {
        key: C(r, n),
        size: i,
        paint: (e, s, l) => g(r, n, s, {
          loadImages: y(e),
          underArt: l
        })
      },
      stamp: {
        key: JSON.stringify([
          "mtg-stamp-v3",
          n,
          a.setCode,
          o.map((e) => [
            m(e.face).stamp,
            e.face.setCode,
            h(e.face, "common"),
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
        paint: (e, s) => g(t, n, s, {
          loadImages: y(e)
        })
      },
      edges: f,
      artWindows: o.map(
        (e) => e.panel ? u(e.panel, d(e.face)) : d(e.face)
      ),
      cornerRadius: b(a),
      regions: Object.entries(m(a)).map(([e, s]) => ({
        id: e,
        rect: s
      }))
    };
  }
}, W = "This Magic game pack is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.";
function A(p, n, a, i, r = "inspect") {
  const c = structuredClone({ ...a, setCode: a.setCode ?? "GLINT" }), o = R.describe(c, r), f = (t) => {
    const e = { face: c, printingId: null, printedImage: null, paintLayer: t };
    return {
      key: C(e, r),
      size: o.color.size,
      paint: (s, l) => g(e, r, l, { loadImages: y(s) })
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
              const t = document.createElement("canvas");
              [t.width, t.height] = o.color.size;
              const e = t.getContext("2d");
              e.fillStyle = "#fff";
              for (const [s, l, v, w] of o.artWindows)
                e.fillRect(
                  s * t.width,
                  l * t.height,
                  v * t.width,
                  w * t.height
                );
              return t;
            }
          }
        }
      }
    ]
  };
}
export {
  L as FACE_RECTS,
  O as FACE_TEXT,
  W as disclaimer,
  P as faceFrame,
  m as faceRects,
  J as isRetro,
  R as magic,
  M as manaSymbolAsset,
  R as mtg,
  A as opticalDocument,
  j as profileAssets,
  B as resolveCardProfile,
  G as retroFamily,
  H as retroRects,
  _ as setSymbolAsset,
  q as withCardWording
};
