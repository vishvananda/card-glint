import "./renderer-Dz0LYE_V.js";
import "./foil-preview-shader-DTIcl3CY.js";
import { canvas as m } from "./raster-8MSDN7In.js";
const S = {
  orbit: { ink: "#151827", metal: "#c8b3ec", accent: "#c2d6fc", label: "CELESTIAL ARCHIVE" },
  tide: { ink: "#092728", metal: "#d9be87", accent: "#7ee0cb", label: "DEEPWATER RELICS" },
  garden: { ink: "#321a25", metal: "#eac091", accent: "#ffc09b", label: "THE LIVING EMBER" }
};
function g(e, i) {
  e.beginPath(), i.forEach(([l, t], o) => o ? e.lineTo(l, t) : e.moveTo(l, t)), e.stroke();
}
function y(e, i, l, t) {
  e.save(), e.translate(i, l), e.beginPath();
  for (let n = 0; n < 16; n++) {
    const p = n * Math.PI / 8, r = n % 2 === 1 ? t * 0.36 : n % 4 === 0 ? t : t * 0.74, h = Math.sin(p) * r, f = -Math.cos(p) * r;
    n ? e.lineTo(h, f) : e.moveTo(h, f);
  }
  e.closePath();
  const o = t * 0.63, s = t * 0.53;
  e.moveTo(o, 0), e.arc(0, 0, o, 0, Math.PI * 2, !1), e.moveTo(s, 0), e.arc(0, 0, s, 0, Math.PI * 2, !0);
  const a = t * 0.42;
  e.moveTo(0, -a), e.lineTo(a, 0), e.lineTo(0, a), e.lineTo(-a, 0), e.closePath();
  for (let n = 0; n < 8; n++) {
    const p = n * Math.PI / 4, r = n % 2 ? t * 0.09 : t * 0.28, h = Math.sin(p) * r, f = -Math.cos(p) * r;
    n ? e.lineTo(h, f) : e.moveTo(h, f);
  }
  e.closePath(), e.fill("evenodd"), e.restore();
}
function c(e, i, l = !1) {
  e.strokeStyle = l ? "#fff" : S[i].metal, e.fillStyle = e.strokeStyle, e.lineWidth = 1.5, g(e, [
    [38, 140],
    [38, 48],
    [125, 48]
  ]), g(e, [
    [595, 48],
    [682, 48],
    [682, 850],
    [626, 916],
    [94, 916],
    [38, 858],
    [38, 658]
  ]), g(e, [
    [52, 143],
    [52, 61],
    [125, 61]
  ]), g(e, [
    [595, 61],
    [668, 61],
    [668, 842],
    [619, 902],
    [100, 902],
    [52, 851],
    [52, 666]
  ]);
  for (const t of [198, 264, 330])
    e.beginPath(), e.arc(72, t, 25, 0, Math.PI * 2), e.stroke(), e.beginPath(), e.arc(72, t, 21, 0, Math.PI * 2), e.stroke();
  l && (e.save(), e.globalAlpha = 0.68, y(e, 360, 792, 102), e.restore());
  for (let t = 0; t < 7; t++) {
    const o = 270 + t * 30;
    e.beginPath(), e.arc(o, 676, 3, 0, Math.PI * 2), e.fill();
  }
  if (i === "tide")
    for (let t = 0; t < 4; t++)
      g(e, [
        [568 + t * 19, 720],
        [583 + t * 19, 737],
        [568 + t * 19, 754]
      ]);
  else if (i === "garden")
    for (let t = 0; t < 4; t++) y(e, 642, 740 + t * 25, 6);
  else
    e.beginPath(), e.arc(621, 748, 24, 0, Math.PI * 2), e.stroke(), g(e, [
      [592, 748],
      [650, 748]
    ]), g(e, [
      [621, 719],
      [621, 777]
    ]);
}
function b(e, i, l, t, o) {
  for (const s of i.split(`
`)) {
    let a = "";
    for (const n of s.split(" "))
      a && e.measureText(a + " " + n).width > o ? (e.fillText(a, l, t), t += 29, a = n) : a += (a ? " " : "") + n;
    e.fillText(a, l, t), t += 38;
  }
}
function T(e, i) {
  const l = S[i.theme], t = e.createLinearGradient(0, 430, 0, 860);
  t.addColorStop(0, "transparent"), t.addColorStop(0.54, l.ink + "cc"), t.addColorStop(1, l.ink), e.fillStyle = t, e.fillRect(0, 430, 720, 570);
  for (const o of [198, 264, 330]) {
    const s = e.createRadialGradient(64, o - 9, 0, 72, o, 25);
    s.addColorStop(0, l.ink + "d9"), s.addColorStop(1, l.ink), e.fillStyle = s, e.beginPath(), e.arc(72, o, 25, 0, Math.PI * 2), e.fill();
  }
  c(e, i.theme), e.textAlign = "center", e.fillStyle = l.metal, e.font = "600 14px sans-serif", e.letterSpacing = "3px", e.fillText(l.label, 360, 57), e.letterSpacing = "0px", e.font = "600 21px sans-serif", [i.charge, "II", "07"].forEach((o, s) => e.fillText(String(o), 72, 205 + s * 66)), e.textAlign = "left", e.fillStyle = l.accent, e.font = "500 15px sans-serif", e.letterSpacing = "4px", e.fillText(i.subtitle.toUpperCase(), 90, 631), e.letterSpacing = "0px", e.font = "500 48px serif", e.fillStyle = "#fff1dd", e.fillText(i.name, 86, 734, 480), e.fillStyle = "#e2decc", e.font = "22px sans-serif", b(e, i.rules, 90, 790, 500), e.fillStyle = l.metal, e.font = "12px sans-serif", e.letterSpacing = "2px", e.fillText("GLINT  /  ORIGINAL SERIES", 68, 969), e.textAlign = "right", e.fillText(i.serial, 652, 969), e.textAlign = "left", e.letterSpacing = "0px";
}
const v = "fantasy-v2", w = { art: [0, 0.04, 1, 0.64] }, u = {
  revision: v,
  layout: w
}, d = u.layout.art, E = {
  id: "showcase",
  describe(e, i) {
    return I(e, i);
  }
};
function I(e, i, l = !0) {
  const t = structuredClone(e), o = i === "inspect" ? [720, 1e3] : [252, 350];
  return {
    pack: "showcase",
    cornerRadius: 0.035,
    artWindows: [d],
    regions: [
      { id: "illustration", rect: d },
      { id: "title", rect: [0.1, 0.69, 0.7, 0.07] }
    ],
    color: {
      key: JSON.stringify([u.revision, t, i, l]),
      size: o,
      async paint(s, a, n) {
        const p = m(o), r = p.getContext("2d"), h = await s.images([{ url: t.illustration, width: 960 }], a);
        try {
          r.scale(o[0] / 720, o[1] / 1e3), r.fillStyle = S[t.theme].ink, r.fillRect(0, 0, 720, 1e3), n && r.drawImage(n, 0, 0, 720, 1e3);
          const f = h.value.get(t.illustration);
          return r.drawImage(
            f,
            f.width * 0.125,
            0,
            f.width * 0.75,
            f.height,
            0,
            40,
            720,
            640
          ), l && T(r, t), a.throwIfAborted(), p;
        } catch (f) {
          throw p.width = p.height = 0, f;
        } finally {
          h.release();
        }
      }
    },
    stamp: {
      key: JSON.stringify([u.revision, "engraving", t.theme, i]),
      size: o,
      async paint() {
        const s = m(o), a = s.getContext("2d");
        return a.scale(o[0] / 720, o[1] / 1e3), c(a, t.theme, !0), s;
      }
    },
    edges: [
      {
        key: t.illustration,
        asset: { url: t.illustration, width: 512 },
        crop: [0.125, 0, 0.75, 1],
        destination: d,
        clip: d,
        threshold: 20
      }
    ]
  };
}
function M(e, i, l = "inspect") {
  const t = structuredClone(i), o = I(t, l, !1), s = {
    key: JSON.stringify([u.revision, "separate-frame-v1", t, l]),
    size: o.color.size,
    async paint() {
      const a = m(o.color.size), n = a.getContext("2d");
      return n.scale(o.color.size[0] / 720, o.color.size[1] / 1e3), T(n, t), a;
    }
  };
  return {
    id: e,
    revision: 1,
    recipe: o,
    layers: [
      {
        id: "showcase-frame",
        order: -2,
        stage: "under-finish",
        raster: s
      }
    ]
  };
}
export {
  E as showcase,
  M as showcaseDocument
};
