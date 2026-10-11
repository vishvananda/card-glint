import { s as I, f as m, v as d, p as g, c as u, a as C, b as h } from "./canvas-face-CQvR50Ed.js";
import { F as T, d as A, e as R, i as W, m as N, g as E, r as L, h as M, j as O, k as P } from "./canvas-face-CQvR50Ed.js";
function y(p) {
  return async (i, n) => {
    const c = [...new Set(i.filter((r) => !!r))], o = await p.images(
      c.map((r) => ({ url: r, width: h(r) })),
      n
    );
    return { images: new Map(o.value), dispose: () => o.release() };
  };
}
const b = {
  id: "mtg",
  describe(p, i) {
    const n = structuredClone({
      ...p,
      setCode: p.setCode ?? "GLINT"
    }), c = i === "table" ? [244, 340] : [732, 1020], o = { printingId: null, printedImage: null, face: n }, r = I(n), s = r.length ? r.map((e) => ({ face: e.face, panel: e })) : [{ face: n, panel: void 0 }], f = s.flatMap((e) => {
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
          destination: e.panel ? g(e.panel, a) : a,
          clip: e.panel ? g(e.panel, l) : l,
          rotation: e.panel?.rotation ?? 0,
          importedMask: e.face.etchedIllustration ? { url: e.face.etchedIllustration, width: 512 } : void 0
        }
      ];
    }), t = { ...o, layer: "etching" };
    return {
      pack: "mtg",
      color: {
        key: C(o, i),
        size: c,
        paint: (e, a, l) => u(o, i, a, {
          loadImages: y(e),
          underArt: l
        })
      },
      stamp: {
        key: JSON.stringify([
          "mtg-stamp-v1",
          i,
          n.setCode,
          s.map((e) => [
            m(e.face).stamp,
            e.face.setCode,
            e.face.setSymbol ?? null,
            e.panel ? [
              e.panel.x,
              e.panel.y,
              e.panel.width,
              e.panel.height,
              e.panel.rotation
            ] : null
          ])
        ]),
        size: c,
        paint: (e, a) => u(t, i, a, {
          loadImages: y(e)
        })
      },
      edges: f,
      artWindows: s.map(
        (e) => e.panel ? g(e.panel, d(e.face)) : d(e.face)
      ),
      cornerRadius: 0.058,
      regions: Object.entries(m(n)).map(([e, a]) => ({
        id: e,
        rect: a
      }))
    };
  }
}, z = "This Magic game pack is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.";
function S(p, i, n, c, o = "inspect") {
  const r = structuredClone({ ...n, setCode: n.setCode ?? "GLINT" }), s = b.describe(r, o), f = (t) => {
    const e = { face: r, printingId: null, printedImage: null, paintLayer: t };
    return {
      key: C(e, o),
      size: s.color.size,
      paint: (a, l) => u(e, o, l, { loadImages: y(a) })
    };
  };
  return {
    id: p,
    revision: i,
    recipe: {
      ...s,
      color: f("artwork"),
      edges: [],
      stamp: void 0,
      finishCoverageBase: 0,
      overlayFoil: { tone: c, strength: { gold: 0.7, silver: 0.6, prismatic: 0.75 }[c] }
    },
    layers: [
      {
        id: "magic-printing",
        order: 0,
        stage: "over-finish",
        raster: f("printing"),
        finishCoverage: {
          add: {
            key: JSON.stringify(["magic-art-scope-v1", s.color.size, s.artWindows]),
            size: s.color.size,
            async paint() {
              const t = document.createElement("canvas");
              [t.width, t.height] = s.color.size;
              const e = t.getContext("2d");
              e.fillStyle = "#fff";
              for (const [a, l, v, w] of s.artWindows)
                e.fillRect(
                  a * t.width,
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
  T as FACE_RECTS,
  A as FACE_TEXT,
  z as disclaimer,
  R as faceFrame,
  m as faceRects,
  W as isRetro,
  b as magic,
  N as manaSymbolAsset,
  b as mtg,
  S as opticalDocument,
  E as profileAssets,
  L as resolveCardProfile,
  M as retroFamily,
  O as retroRects,
  P as setSymbolAsset
};
