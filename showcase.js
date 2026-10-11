import { c as u } from "./raster-Cc-NcJhJ.js";
const c = {
  orbit: { ink: "#151827", metal: "#c8b3ec", accent: "#c2d6fc", label: "CELESTIAL ARCHIVE" },
  tide: { ink: "#092728", metal: "#d9be87", accent: "#7ee0cb", label: "DEEPWATER RELICS" },
  garden: { ink: "#321a25", metal: "#eac091", accent: "#ffc09b", label: "THE LIVING EMBER" }
};
function f(e, l) {
  e.beginPath(), l.forEach(([n, t], i) => i ? e.lineTo(n, t) : e.moveTo(n, t)), e.stroke();
}
function y(e, l, n, t) {
  e.save(), e.translate(l, n), e.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI / 8, o = i % 2 ? t * 0.35 : t, s = Math.sin(a) * o, r = -Math.cos(a) * o;
    i ? e.lineTo(s, r) : e.moveTo(s, r);
  }
  e.closePath(), e.fill(), e.restore();
}
function m(e, l, n = !1) {
  e.strokeStyle = n ? "#fff" : c[l].metal, e.fillStyle = e.strokeStyle, e.lineWidth = 1.5, f(e, [
    [38, 140],
    [38, 48],
    [125, 48]
  ]), f(e, [
    [595, 48],
    [682, 48],
    [682, 850],
    [626, 916],
    [94, 916],
    [38, 858],
    [38, 658]
  ]), f(e, [
    [52, 143],
    [52, 61],
    [125, 61]
  ]), f(e, [
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
  y(e, 360, 940, 15);
  for (let t = 0; t < 7; t++) {
    const i = 270 + t * 30;
    e.beginPath(), e.arc(i, 676, 3, 0, Math.PI * 2), e.fill();
  }
  if (l === "tide")
    for (let t = 0; t < 4; t++)
      f(e, [
        [568 + t * 19, 720],
        [583 + t * 19, 737],
        [568 + t * 19, 754]
      ]);
  else if (l === "garden")
    for (let t = 0; t < 4; t++) y(e, 642, 740 + t * 25, 6);
  else
    e.beginPath(), e.arc(621, 748, 24, 0, Math.PI * 2), e.stroke(), f(e, [
      [592, 748],
      [650, 748]
    ]), f(e, [
      [621, 719],
      [621, 777]
    ]);
}
function I(e, l, n, t, i) {
  for (const a of l.split(`
`)) {
    let o = "";
    for (const s of a.split(" "))
      o && e.measureText(o + " " + s).width > i ? (e.fillText(o, n, t), t += 29, o = s) : o += (o ? " " : "") + s;
    e.fillText(o, n, t), t += 38;
  }
}
function b(e, l) {
  const n = c[l.theme], t = e.createLinearGradient(0, 430, 0, 860);
  t.addColorStop(0, "transparent"), t.addColorStop(0.54, n.ink + "cc"), t.addColorStop(1, n.ink), e.fillStyle = t, e.fillRect(0, 430, 720, 570);
  for (const i of [198, 264, 330]) {
    const a = e.createRadialGradient(64, i - 9, 0, 72, i, 25);
    a.addColorStop(0, n.ink + "d9"), a.addColorStop(1, n.ink), e.fillStyle = a, e.beginPath(), e.arc(72, i, 25, 0, Math.PI * 2), e.fill();
  }
  m(e, l.theme), e.textAlign = "center", e.fillStyle = n.metal, e.font = "600 14px sans-serif", e.letterSpacing = "3px", e.fillText(n.label, 360, 57), e.letterSpacing = "0px", e.font = "600 21px sans-serif", [l.charge, "II", "07"].forEach((i, a) => e.fillText(String(i), 72, 205 + a * 66)), e.textAlign = "left", e.fillStyle = n.accent, e.font = "500 15px sans-serif", e.letterSpacing = "4px", e.fillText(l.subtitle.toUpperCase(), 90, 631), e.letterSpacing = "0px", e.font = "500 48px serif", e.fillStyle = "#fff1dd", e.fillText(l.name, 86, 734, 480), e.fillStyle = "#e2decc", e.font = "22px sans-serif", I(e, l.rules, 90, 790, 500), e.fillStyle = n.metal, e.font = "12px sans-serif", e.letterSpacing = "2px", e.fillText("GLINT  /  ORIGINAL SERIES", 68, 969), e.textAlign = "right", e.fillText(l.serial, 652, 969), e.textAlign = "left", e.letterSpacing = "0px";
}
const k = "fantasy-v2", T = { art: [0, 0.04, 1, 0.64] }, g = {
  revision: k,
  layout: T
}, d = g.layout.art, P = {
  id: "showcase",
  describe(e, l) {
    return w(e, l);
  }
};
function w(e, l, n = !0) {
  const t = structuredClone(e), i = l === "inspect" ? [720, 1e3] : [252, 350];
  return {
    pack: "showcase",
    cornerRadius: 0.035,
    artWindows: [d],
    regions: [
      { id: "illustration", rect: d },
      { id: "title", rect: [0.1, 0.69, 0.7, 0.07] }
    ],
    color: {
      key: JSON.stringify([g.revision, t, l, n]),
      size: i,
      async paint(a, o, s) {
        const r = u(i), p = r.getContext("2d"), S = await a.images([{ url: t.illustration, width: 960 }], o);
        try {
          p.scale(i[0] / 720, i[1] / 1e3), p.fillStyle = c[t.theme].ink, p.fillRect(0, 0, 720, 1e3), s && p.drawImage(s, 0, 0, 720, 1e3);
          const h = S.value.get(t.illustration);
          return p.drawImage(
            h,
            h.width * 0.125,
            0,
            h.width * 0.75,
            h.height,
            0,
            40,
            720,
            640
          ), n && b(p, t), o.throwIfAborted(), r;
        } catch (h) {
          throw r.width = r.height = 0, h;
        } finally {
          S.release();
        }
      }
    },
    stamp: {
      key: JSON.stringify([g.revision, "engraving", t.theme, l]),
      size: i,
      async paint() {
        const a = u(i), o = a.getContext("2d");
        return o.scale(i[0] / 720, i[1] / 1e3), m(o, t.theme, !0), a;
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
function C(e, l, n = "inspect") {
  const t = structuredClone(l), i = w(t, n, !1), a = {
    key: JSON.stringify([g.revision, "separate-frame-v1", t, n]),
    size: i.color.size,
    async paint() {
      const o = u(i.color.size), s = o.getContext("2d");
      return s.scale(i.color.size[0] / 720, i.color.size[1] / 1e3), b(s, t), o;
    }
  };
  return {
    id: e,
    revision: 1,
    recipe: i,
    layers: [
      {
        id: "showcase-frame",
        order: -2,
        stage: "under-finish",
        raster: a
      }
    ]
  };
}
export {
  P as showcase,
  C as showcaseDocument
};
