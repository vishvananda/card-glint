import { c as u } from "./raster-DzjfbiwQ.js";
const d = {
  orbit: { ink: "#151827", metal: "#c8b3ec", accent: "#c2d6fc", label: "CELESTIAL ARCHIVE" },
  tide: { ink: "#092728", metal: "#d9be87", accent: "#7ee0cb", label: "DEEPWATER RELICS" },
  garden: { ink: "#321a25", metal: "#eac091", accent: "#ffc09b", label: "THE LIVING EMBER" }
};
function f(e, a) {
  e.beginPath(), a.forEach(([t, l], i) => i ? e.lineTo(t, l) : e.moveTo(t, l)), e.stroke();
}
function m(e, a, t, l) {
  e.save(), e.translate(a, t), e.beginPath();
  for (let i = 0; i < 16; i++) {
    const n = i * Math.PI / 8, o = i % 2 ? l * 0.35 : l, s = Math.sin(n) * o, r = -Math.cos(n) * o;
    i ? e.lineTo(s, r) : e.moveTo(s, r);
  }
  e.closePath(), e.fill(), e.restore();
}
function y(e, a, t = !1) {
  e.strokeStyle = t ? "#fff" : d[a].metal, e.fillStyle = e.strokeStyle, e.lineWidth = 1.5, f(e, [
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
  for (const l of [198, 264, 330])
    e.beginPath(), e.arc(72, l, 25, 0, Math.PI * 2), e.stroke(), e.beginPath(), e.arc(72, l, 21, 0, Math.PI * 2), e.stroke();
  m(e, 360, 940, 15);
  for (let l = 0; l < 7; l++) {
    const i = 270 + l * 30;
    e.beginPath(), e.arc(i, 676, 3, 0, Math.PI * 2), e.fill();
  }
  if (a === "tide")
    for (let l = 0; l < 4; l++)
      f(e, [
        [568 + l * 19, 720],
        [583 + l * 19, 737],
        [568 + l * 19, 754]
      ]);
  else if (a === "garden")
    for (let l = 0; l < 4; l++) m(e, 642, 740 + l * 25, 6);
  else
    e.beginPath(), e.arc(621, 748, 24, 0, Math.PI * 2), e.stroke(), f(e, [
      [592, 748],
      [650, 748]
    ]), f(e, [
      [621, 719],
      [621, 777]
    ]);
}
function b(e, a, t, l, i) {
  for (const n of a.split(`
`)) {
    let o = "";
    for (const s of n.split(" "))
      o && e.measureText(o + " " + s).width > i ? (e.fillText(o, t, l), l += 29, o = s) : o += (o ? " " : "") + s;
    e.fillText(o, t, l), l += 38;
  }
}
function I(e, a) {
  const t = d[a.theme], l = e.createLinearGradient(0, 430, 0, 860);
  l.addColorStop(0, "transparent"), l.addColorStop(0.54, t.ink + "cc"), l.addColorStop(1, t.ink), e.fillStyle = l, e.fillRect(0, 430, 720, 570);
  for (const i of [198, 264, 330]) {
    const n = e.createRadialGradient(64, i - 9, 0, 72, i, 25);
    n.addColorStop(0, t.ink + "d9"), n.addColorStop(1, t.ink), e.fillStyle = n, e.beginPath(), e.arc(72, i, 25, 0, Math.PI * 2), e.fill();
  }
  y(e, a.theme), e.textAlign = "center", e.fillStyle = t.metal, e.font = "600 14px sans-serif", e.letterSpacing = "3px", e.fillText(t.label, 360, 57), e.letterSpacing = "0px", e.font = "600 21px sans-serif", [a.charge, "II", "07"].forEach((i, n) => e.fillText(String(i), 72, 205 + n * 66)), e.textAlign = "left", e.fillStyle = t.accent, e.font = "500 15px sans-serif", e.letterSpacing = "4px", e.fillText(a.subtitle.toUpperCase(), 90, 631), e.letterSpacing = "0px", e.font = "500 48px serif", e.fillStyle = "#fff1dd", e.fillText(a.name, 86, 734, 480), e.fillStyle = "#e2decc", e.font = "22px sans-serif", b(e, a.rules, 90, 790, 500), e.fillStyle = t.metal, e.font = "12px sans-serif", e.letterSpacing = "2px", e.fillText("GLINT  /  ORIGINAL SERIES", 68, 969), e.textAlign = "right", e.fillText(a.serial, 652, 969), e.textAlign = "left", e.letterSpacing = "0px";
}
const k = "fantasy-v2", w = { art: [0, 0.04, 1, 0.64] }, g = {
  revision: k,
  layout: w
}, p = g.layout.art, P = {
  id: "showcase",
  describe(e, a) {
    const t = structuredClone(e), l = a === "inspect" ? [720, 1e3] : [252, 350];
    return {
      pack: "showcase",
      cornerRadius: 0.035,
      artWindows: [p],
      regions: [
        { id: "illustration", rect: p },
        { id: "title", rect: [0.1, 0.69, 0.7, 0.07] }
      ],
      color: {
        key: JSON.stringify([g.revision, t, a]),
        size: l,
        async paint(i, n, o) {
          const s = u(l), r = s.getContext("2d"), S = await i.images([{ url: t.illustration, width: 960 }], n);
          try {
            r.scale(l[0] / 720, l[1] / 1e3), r.fillStyle = d[t.theme].ink, r.fillRect(0, 0, 720, 1e3), o && r.drawImage(o, 0, 0, 720, 1e3);
            const h = S.value.get(t.illustration);
            return r.drawImage(
              h,
              h.width * 0.125,
              0,
              h.width * 0.75,
              h.height,
              0,
              40,
              720,
              640
            ), I(r, t), n.throwIfAborted(), s;
          } catch (h) {
            throw s.width = s.height = 0, h;
          } finally {
            S.release();
          }
        }
      },
      stamp: {
        key: JSON.stringify([g.revision, "engraving", t.theme, a]),
        size: l,
        async paint() {
          const i = u(l), n = i.getContext("2d");
          return n.scale(l[0] / 720, l[1] / 1e3), y(n, t.theme, !0), i;
        }
      },
      edges: [
        {
          key: t.illustration,
          asset: { url: t.illustration, width: 512 },
          crop: [0.125, 0, 0.75, 1],
          destination: p,
          clip: p,
          threshold: 20
        }
      ]
    };
  }
};
export {
  P as showcase
};
