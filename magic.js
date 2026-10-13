import { s as I, f as m, v as d, p as u, a as b, c as g, b as C, d as h, e as S, r as k, g as z, h as x } from "./canvas-face-Bbn3ruV9.js";
import { F as N, i as L, j as O, k as P, m as J, l as M, n as j, o as B, q as G, t as H, w as _ } from "./canvas-face-Bbn3ruV9.js";
function y(p) {
  return async (n, a) => {
    const i = await k(n, a);
    try {
      const r = await p.images(
        i.urls.map((l) => ({ url: l, width: z(l) })),
        a
      );
      return {
        images: x(i.aliases, r.value),
        dispose: () => r.release()
      };
    } finally {
      i.dispose();
    }
  };
}
const F = {
  id: "mtg",
  dispose() {
    h(), S();
  },
  describe(p, n) {
    const a = structuredClone({
      ...p,
      setCode: p.setCode ?? "GLINT"
    }), i = n === "table" ? [244, 340] : [732, 1020], r = { printingId: null, printedImage: null, face: a }, l = I(a), o = l.length ? l.map((e) => ({ face: e.face, panel: e })) : [{ face: a, panel: void 0 }], f = o.flatMap((e) => {
      if (!e.face.illustration) return [];
      const s = m(e.face).art, c = d(e.face);
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
          clip: e.panel ? u(e.panel, c) : c,
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
        paint: (e, s, c) => g(r, n, s, {
          loadImages: y(e),
          underArt: c
        })
      },
      stamp: {
        key: JSON.stringify([
          "mtg-stamp-v1",
          n,
          a.setCode,
          o.map((e) => [
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
}, T = "This Magic game pack is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.";
function W(p, n, a, i, r = "inspect") {
  const l = structuredClone({ ...a, setCode: a.setCode ?? "GLINT" }), o = F.describe(l, r), f = (t) => {
    const e = { face: l, printingId: null, printedImage: null, paintLayer: t };
    return {
      key: C(e, r),
      size: o.color.size,
      paint: (s, c) => g(e, r, c, { loadImages: y(s) })
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
              for (const [s, c, v, w] of o.artWindows)
                e.fillRect(
                  s * t.width,
                  c * t.height,
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
  N as FACE_RECTS,
  L as FACE_TEXT,
  T as disclaimer,
  O as faceFrame,
  m as faceRects,
  P as isRetro,
  F as magic,
  J as manaSymbolAsset,
  F as mtg,
  W as opticalDocument,
  M as profileAssets,
  j as resolveCardProfile,
  B as retroFamily,
  G as retroRects,
  H as setSymbolAsset,
  _ as withCardWording
};
