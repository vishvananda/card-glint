import { r as B, a as jr, f as md } from "./canvas-raster-DIqHyOj6.js";
import { f as ri, g as bn, b as ni, r as cd, v as gd, h as fd } from "./editor-aa0HuJNA.js";
import { c as Mo, f as Ro } from "./asset-fetch-my9kgRsJ.js";
import { d as pd } from "./canvas-images-DWl3zt32.js";
import { t as ct } from "./registry-CXWh8XrR.js";
const oi = /* @__PURE__ */ new WeakMap(), hr = /* @__PURE__ */ new WeakMap(), si = /* @__PURE__ */ Symbol("prepared-rules-request");
function bd(t, e, r) {
  oi.set(e, r), hr.has(t) && Object.defineProperty(e, si, {
    value: { request: r, x: e.x, top: e.top },
    enumerable: !0
  });
}
function Ue(t) {
  const e = oi.get(t);
  if (e) return e;
  const r = t[si];
  if (!r) return;
  const { request: n, x: o, top: s } = r, a = t.x - o, i = t.top - s;
  return {
    ...n,
    bounds: {
      ...n.bounds,
      x: n.bounds.x + a,
      y: n.bounds.y + i,
      verticalLimits: n.bounds.verticalLimits ? [n.bounds.verticalLimits[0] + i, n.bounds.verticalLimits[1] + i] : void 0
    }
  };
}
function yd(t, e) {
  const r = hr.get(t) ?? 0;
  hr.set(t, r + 1);
  try {
    return e();
  } finally {
    r ? hr.set(t, r) : hr.delete(t);
  }
}
function wd(t) {
  return t.power != null && t.toughness != null ? {
    text: `${t.power}/${t.toughness}`,
    label: `Power ${t.power}, toughness ${t.toughness}`
  } : t.loyalty != null && t.loyalty !== "" ? { text: String(t.loyalty), label: `Starting loyalty ${t.loyalty}` } : t.defense != null && t.defense !== "" ? { text: String(t.defense), label: `Defense ${t.defense}` } : null;
}
const T = 488, L = 680, Sd = 0.058;
function Pt(t, e) {
  if (e === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (e ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    t?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const vd = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", V = {
  background: [0.03937, 0.02531, 0.92126, 0.88976],
  legendaryBackground: [0.03937, 0.03993, 0.92126, 0.88976],
  frame: [0.04858, 0.03937, 0.90284, 0.88864],
  crown: [0.01575, 0.01687, 0.9622, 0.15748],
  title: [0.05669, 0.04499, 0.88662, 0.05737],
  art: [0.06929, 0.10742, 0.86142, 0.44882],
  type: [0.05669, 0.5613, 0.88662, 0.05737],
  rules: [0.07638, 0.62542, 0.84724, 0.29246],
  stats: [0.7704, 0.88752, 0.18236, 0.06974],
  footer: [0.06693, 0.93262, 0.86614, 0.045],
  stamp: [0.34, 0.76 - 0.16 * T / L, 0.32, 0.32 * T / L]
}, X = {
  titleFont: 24,
  normalTitleFont: 26,
  titleTracking: 54e-5 * T,
  titleGap: 0.02362 * T,
  plateLeft: 0.02362 * T,
  plateRight: 0.01575 * T,
  manaSize: 0.03556 * 1.35 * T,
  manaGap: 378e-5 * T,
  manaLift: -63e-4 * T,
  typeFont: 0.044 * T,
  typeGap: 945e-5 * T,
  typeLift: -315e-5 * T,
  setHeight: 0.06142 * T,
  setMaxWidth: 0.11024 * T,
  setMargin: 472e-5 * T,
  rulesPaddingX: 0.01575 * T,
  rulesPaddingY: 0.02362 * T,
  normalRulesFont: 0.04444 * T,
  longRulesFont: 0.0381 * T,
  denseRulesFont: 0.0328 * T,
  paragraphGap: 787e-5 * T,
  statsFont: 0.05333 * T,
  statsLine: 0.08661 * T,
  footerFont: 0.02167 * T,
  footerLine: 0.02126 * T,
  footerTracking: 362e-5 * T,
  artistMarginLeft: 7e-3 * T,
  artistMarginRight: 35e-4 * T,
  legendaryBackgroundLift: -0.02047 * T
}, vs = (t) => t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
function Cd(t = V) {
  return {
    ...Object.fromEntries(
      Object.entries(t).flatMap(
        ([e, r]) => r.map((n, o) => [
          `--face-${vs(e)}-${["x", "y", "w", "h"][o]}`,
          `${n * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(X).map(([e, r]) => [
        `--face-${vs(e)}`,
        `${r / T * 100}cqw`
      ])
    )
  };
}
const d1 = Cd();
function kd(t) {
  return t.length > 340 ? "dense" : t.length > 210 ? "long" : "normal";
}
function u1(t) {
  return {
    dense: X.denseRulesFont,
    long: X.longRulesFont,
    normal: X.normalRulesFont
  }[kd(t)];
}
function yn(t) {
  return t.split(/(\{[^}\n]+\})/g).filter(Boolean).map((e) => ({
    value: e,
    symbol: /^\{[^}\n]+\}$/.test(e) ? e.slice(1, -1) : null
  }));
}
function Td(t) {
  const e = t.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[e] ?? e.slice(0, 3);
}
const Zn = (t, e = !1) => `${e ? "italic " : ""}${t}px "CardRenderer MTG MPlantin", Georgia`;
function Md(t) {
  const e = [];
  let r = [], n = !1;
  const o = () => {
    r.length && (e.push({ pieces: r, space: n }), r = [], n = !1);
  };
  for (const s of t)
    for (const a of yn(s.text))
      if (a.symbol) r.push({ text: a.symbol, symbol: !0, italic: !1 });
      else
        for (const i of a.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(i) ? (o(), i === `
` ? (e.push({ pieces: [], space: !1, newline: !0 }), n = !1) : n = !0) : r.push({ text: i, symbol: !1, italic: !!s.italic });
  return o(), e;
}
function Se(t, e, r, n = 1) {
  const o = [];
  for (const s of e) {
    const a = s.symbol ? s : { ...s, text: s.text.replaceAll("­", "") };
    if (!a.text) continue;
    const i = o.at(-1);
    i && !i.symbol && !a.symbol && i.italic === a.italic ? i.text += a.text : o.push({ ...a });
  }
  return o.map((s) => {
    t.font = Zn(r, s.italic);
    const a = t.measureText(s.text);
    return {
      ...s,
      ...s.symbol || n === 1 ? {} : { textWidth: n },
      size: r,
      width: s.symbol ? r * 0.88 : a.width * n,
      ascent: s.symbol ? r * 0.72 : a.actualBoundingBoxAscent,
      descent: s.symbol ? r * 0.08 : a.actualBoundingBoxDescent,
      inkLeft: s.symbol ? r * 0.025 : -a.actualBoundingBoxLeft * n,
      inkRight: s.symbol ? r * 0.825 : a.actualBoundingBoxRight * n
    };
  });
}
function Rd(t, e, r, n, o, s = 1) {
  let a = null;
  for (let i = 0; i < r.length; i++) {
    const l = r[i];
    if (!l.symbol)
      for (let d = 0; d < l.text.length; d++) {
        const u = l.text[d] === "—";
        if (l.text[d] !== "­" && !u || ![...r.slice(0, i), { ...l, text: l.text.slice(0, d) }].some(
          (c) => c.text.replaceAll("­", "").length
        ))
          continue;
        const h = [
          ...r.slice(0, i),
          { ...l, text: l.text.slice(0, d) + (u ? "—" : "-") }
        ], m = [{ ...l, text: l.text.slice(d + 1) }, ...r.slice(i + 1)];
        m.some((c) => c.text.replaceAll("­", "").length) && Se(t, [...e, ...h], o, s).reduce((c, g) => c + g.width, 0) <= n && (a = { head: h, tail: m });
      }
  }
  return a;
}
function ai(t, e, r, n, o = 1) {
  const s = [];
  let a = [];
  for (const i of e) {
    if (i.newline) {
      s.push(Se(t, a, n, o)), a = [];
      continue;
    }
    let l = i.pieces, d = a.length && i.space ? [{ text: " ", italic: i.pieces[0]?.italic ?? !1, symbol: !1 }] : [];
    for (; ; ) {
      if (Se(t, [...a, ...d, ...l], n, o).reduce((m, c) => m + c.width, 0) <= r) {
        a.push(...d, ...l);
        break;
      }
      const h = Rd(
        t,
        [...a, ...d],
        l,
        r,
        n,
        o
      );
      if (h)
        s.push(Se(t, [...a, ...d, ...h.head], n, o)), a = [], d = [], l = h.tail;
      else if (a.length)
        s.push(Se(t, a, n, o)), a = [], d = [];
      else {
        a.push(...l);
        break;
      }
    }
  }
  return a.length && s.push(Se(t, a, n, o)), s;
}
function Cs(t, e, r, n, o = 1) {
  const s = ai(t, e, r, n, o);
  if (s.length < 2) return s;
  const a = /* @__PURE__ */ new Map(), i = (m, c) => {
    const g = `${m}:${c}`;
    let f = a.get(g);
    if (!f) {
      const b = [];
      for (let y = m; y < c; y++) {
        const p = e[y];
        y > m && p.space && b.push({ text: " ", italic: p.pieces[0]?.italic ?? !1, symbol: !1 }), b.push(...p.pieces);
      }
      f = Se(t, b, n, o), a.set(g, f);
    }
    return f;
  }, l = /* @__PURE__ */ new Map(), d = (m, c) => {
    if (!c) return m === e.length ? { cost: 0, cuts: [] } : null;
    const g = `${m}:${c}`;
    if (l.has(g)) return l.get(g);
    let f = null;
    for (let b = m + 1; b <= e.length - c + 1; b++) {
      const y = i(m, b).reduce((S, v) => S + v.width, 0);
      if (y > r) break;
      const p = d(b, c - 1);
      if (!p) continue;
      const w = p.cost + (r - y) ** 2;
      (!f || w < f.cost) && (f = { cost: w, cuts: [b, ...p.cuts] });
    }
    return l.set(g, f), f;
  }, u = d(0, s.length);
  if (!u) return s;
  let h = 0;
  return u.cuts.map((m) => {
    const c = i(h, m);
    return h = m, c;
  });
}
function ks(t, e, r, n, o = !1, s = 1) {
  const a = Md(e);
  if (!o || a.length > 64 || e.some((d) => d.text.includes("­")))
    return ai(t, a, r, n, s);
  const i = [];
  let l = [];
  for (const d of a)
    d.newline ? (i.push(
      ...l.length ? Cs(t, l, r, n, s) : [[]]
    ), l = []) : l.push(d);
  return l.length && i.push(...Cs(t, l, r, n, s)), i;
}
const xd = new Set(
  "mir vis 5ed wth tmp sth exo usg ulg 6ed uds mmq nem pcy inv pls 7ed apc ody tor jud ons lgn scg por p02 ptk".split(
    " "
  )
);
function Ad(t) {
  return xd.has(t?.toLowerCase() ?? "");
}
function Ld(t) {
  if (t.role !== "flavor" || t.align !== void 0) return [t];
  const e = t.runs.map((a) => a.text).join(""), r = [...e.matchAll(/(?:^|\n)[^\S\n]*(?:—|–|--)[^\S\n]*(?=\S)/g)].at(-1);
  if (!r) return [t];
  const n = r.index, o = n + (e[n] === `
` ? 1 : 0), s = (a, i) => {
    let l = 0;
    return t.runs.flatMap((d) => {
      const u = d.text.slice(Math.max(0, a - l), Math.max(0, i - l));
      return l += d.text.length, u ? [{ ...d, text: u }] : [];
    });
  };
  return [
    ...n ? [{ ...t, runs: s(0, n) }] : [],
    { ...t, align: "right", runs: s(o, e.length) }
  ];
}
const Vr = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function O(t, e, r, n = 24, o = 15, s = Vr) {
  const a = s.textWidth ?? 1;
  if (!Number.isFinite(a) || a <= 0)
    throw Error("Magic rules text width must be finite and positive.");
  t.save(), t.letterSpacing = "0px", t.textBaseline = "alphabetic", t.textAlign = "left";
  try {
    const i = s.flavorAttribution === "right" ? e.flatMap(Ld) : e;
    let l, d = n;
    do {
      const u = [], h = [];
      let m = 0, c;
      for (const C of i) {
        let k = d, R = ks(
          t,
          C.runs,
          r.width,
          k,
          s.balanceLines && (!s.balanceCenteredOnly || C.align === "center"),
          a
        );
        if (C.role === "flavor" && s.flavorOrphans !== !1 && R.length > 2 && R.at(-1).reduce((M, x) => M + x.width, 0) < r.width * 0.3)
          for (let M = k - 0.25; M >= k * 0.94; M -= 0.25) {
            const x = ks(
              t,
              C.runs,
              r.width,
              M,
              s.balanceLines && (!s.balanceCenteredOnly || C.align === "center"),
              a
            );
            if (x.length < R.length) {
              k = M, R = x;
              break;
            }
          }
        if (R.length) {
          c && (c === "rules" && C.role === "flavor" ? m += d * s.flavorGap : (c !== "flavor" || C.role !== "flavor") && (m += d * s.paragraphGap));
          for (const M of R) {
            const x = Math.max(0, ...M.map((H) => H.ascent)), E = Math.max(0, ...M.map((H) => H.descent)), $ = M.reduce((H, it) => H + it.width, 0), A = r.x + (C.align === "right" ? r.width - $ : C.align === "center" ? (r.width - $) / 2 : 0);
            let _ = 0, I = 1 / 0, q = -1 / 0;
            for (const H of M)
              I = Math.min(I, _ + H.inkLeft), q = Math.max(q, _ + H.inkRight), _ += H.width;
            u.push({
              x: A,
              runs: M,
              role: C.role,
              baseline: m,
              width: $,
              inkBounds: [
                A + (M.length ? I : 0),
                m - x,
                M.length ? q - I : 0,
                x + E
              ]
            }), m += k * s.leading;
          }
          c = C.role;
        }
      }
      if (s.flavorSeparator !== !1)
        for (let C = 1; C < u.length; C++) {
          const k = u[C - 1], R = u[C];
          if (k.role !== "rules" || R.role !== "flavor") continue;
          const M = k.inkBounds[1] + k.inkBounds[3];
          h.push((M + R.inkBounds[1]) / 2 - 0.3);
        }
      const g = u[0]?.inkBounds[1] ?? 0, f = u.at(-1)?.inkBounds, b = f ? f[1] + f[3] - g : 0, y = Math.max(0, r.height - b), p = r.y + Math.max(0, Math.min(y, y / 2 + (s.centerOffset ?? 0))), w = Math.max(r.y, r.verticalLimits?.[0] ?? r.y), S = Math.min(
        r.y + r.height,
        r.verticalLimits?.[1] ?? r.y + r.height
      ), v = Math.max(w, Math.min(S - b, p)) - g;
      if (l = {
        size: d,
        x: r.x,
        top: g + v,
        width: r.width,
        height: b,
        overflow: b > S - w + 0.01 || u.some((C) => C.width > r.width + 0.01),
        lines: u.map((C) => ({
          ...C,
          baseline: C.baseline + v,
          inkBounds: [
            C.inkBounds[0],
            C.inkBounds[1] + v,
            C.inkBounds[2],
            C.inkBounds[3]
          ]
        })),
        separators: h.map((C) => C + v)
      }, l.overflow ||= l.lines.some(
        (C) => r.exclusions?.some(([k, R, M, x]) => {
          const [E, $, A, _] = C.inkBounds;
          return E < k + M && E + A > k && $ < R + x && $ + _ > R;
        })
      ), !l.overflow || d <= o) break;
      d = Math.max(o, d - 0.25);
    } while (!0);
    return bd(t, l, {
      paragraphs: e,
      bounds: r,
      maximumSize: n,
      minimumSize: o,
      typography: s
    }), l;
  } finally {
    t.restore();
  }
}
const Dr = {
  centered: { left: 10.5, right: -2.5, y: -5, size: 0.5, width: 0.975, leading: -0.5 },
  regular: { left: 10.5, right: -1, y: -2, size: 0, width: 1.005, leading: -0.5 },
  long: { left: 10.5, right: -2, y: 9.5, size: 0, width: 0.99, leading: -0.25 }
};
function Qn(t, e, r, n = 0) {
  return ["lea", "leb"].includes(e.setCode?.toLowerCase() ?? "") ? xo(t, e, r, n) : r;
}
function xo(t, e, r, n = 0) {
  if (!r) return r;
  const o = Ue(r);
  if (!o || !o.paragraphs.length) return r;
  const s = o.paragraphs, a = s.every((b) => b.align === "center"), i = a ? r.lines.length >= 5 && r.size >= 30 ? Dr.long : Dr.centered : s.some((b) => b.align === "center") || r.size < 19 ? null : Dr.regular;
  if (!i)
    return e.wordingMode === "oracle" ? Ts(t, r) : r;
  const l = r.size + i.size, d = O(
    t,
    s,
    {
      x: 0,
      y: 0,
      width: (r.width - i.left - i.right + (a ? 0 : n)) / i.width,
      height: 200
    },
    l,
    l,
    {
      ...o.typography,
      leading: o.typography.leading + i.leading / l,
      flavorSeparator: r.separators.length > 0
    }
  ), u = (r.x + i.left) / i.width, h = r.top + i.y - d.top, m = {
    ...d,
    x: u,
    top: d.top + h,
    horizontalScale: i.width,
    lines: d.lines.map((b) => ({
      ...b,
      x: (b.x ?? d.x) + u,
      baseline: b.baseline + h,
      inkBounds: [b.inkBounds[0] + u, b.inkBounds[1] + h, b.inkBounds[2], b.inkBounds[3]]
    })),
    separators: d.separators.map((b) => b + h)
  }, c = e.wordingMode === "oracle" ? 428 : Math.min(412, r.top - 1), g = e.wordingMode === "oracle" ? 590 : 600;
  return d.overflow || m.lines.some(
    ({ inkBounds: [b, y, p, w] }) => y < c || y + w > g || b * i.width < 48 || (b + p) * i.width > 448
  ) ? e.wordingMode === "oracle" ? Ts(t, r) : r : m;
}
function Ts(t, e) {
  const r = Ue(e);
  if (!r) throw Error("Missing Oracle typography request");
  const n = Dr.regular;
  return { ...O(
    t,
    r.paragraphs,
    {
      ...r.bounds,
      x: (e.x + n.left) / n.width,
      width: (e.width - n.left - n.right) / n.width,
      verticalLimits: [428, 590]
    },
    e.size,
    Math.min(10, e.size),
    {
      ...r.typography,
      leading: r.typography.leading + n.leading / e.size
    }
  ), horizontalScale: n.width };
}
const Ed = ct("printingStocks"), Bd = (t) => {
  const e = parseInt(t.slice(1), 16);
  return [(e >> 16) / 255, (e >> 8 & 255) / 255, (e & 255) / 255];
}, ii = ct("printingBlackPoints");
function wr(t) {
  return (t.colorCalibration === "set-hsb-v1" || t.colorCalibration === "early-hsb-v1") && (!t.borderColor || t.borderColor === "black") && (ii[t.setCode?.toLowerCase() ?? ""] ?? []).some(
    (e) => e.set === t.setCode?.toLowerCase() && e.stock !== null
  );
}
function to(t, e, r) {
  if (!["set-hsb-v1", "early-hsb-v1"].includes(t.colorCalibration ?? "")) return { materials: e };
  const n = ii[t.setCode?.toLowerCase() ?? ""] ?? [];
  if (!n.length) return { materials: e };
  let o;
  const s = { ...e };
  for (const [a, i] of Object.entries(e)) {
    const l = JSON.stringify(i);
    for (const d of n) {
      const u = d.materials.find((g) => g.url === a && g.adjustment === l);
      if (!u) continue;
      if (d.stock && wr(t) && (o = d.stock), u.bakedStock && o) {
        const g = parseInt(o.slice(1), 16);
        s[a] = {
          ...i,
          outerStockMaskSource: u.stockMask,
          outerStock: [(g >> 16) / 255, (g >> 8 & 255) / 255, (g & 255) / 255]
        };
      }
      if (!u.lift || i.blackPoint) continue;
      const [h, m, c] = u.lift;
      if (u.lift.length !== 3 || h === void 0 || m === void 0 || c === void 0)
        throw new Error("Invalid printing black-point binding");
      s[a] = {
        ...s[a],
        blackPoint: { lift: [h / 255, m / 255, c / 255], transition: 96 / 255 }
      };
    }
  }
  if (r && wr(t)) {
    const a = (Ed[t.setCode?.toLowerCase() ?? ""] ?? []).find(
      (i) => i.set === t.setCode?.toLowerCase() && r.geometry === i.geometry && r.url.startsWith(i.prefix) && (i.family === "retro" ? /^[wubrgacml]{1,2}\.png$/.test(r.url.slice(i.prefix.length)) : /^(W|U|B|R|G|WU|WB|WR|WG|UB|UR|UG|BR|BG|RG|Artifact|Gold|Colourless)\.webp$/.test(
        r.url.slice(i.prefix.length)
      ))
    );
    a && (o = a.stock, r.mask && (s[r.url] = {
      ...s[r.url] ?? { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
      outerStock: Bd(o),
      outerStockMaskSource: r.mask
    }));
  }
  return { materials: s, ...o ? { stock: o } : {} };
}
const Id = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", Od = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", $d = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Gd = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", Pd = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-new-split-fuse.mse-style", Wd = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", Fd = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", z = {
  RENDERER_COMPONENT_ROOT: Id,
  KEYRUNE_ROOT: Od,
  CONJURER_ROOT: $d,
  RETRO_ROOT: Gd,
  MSE_SPLIT_BRIDGE_ROOT: Pd,
  RETRO_SYMBOL_FONT: Wd,
  MSE_TEMPLATE_ROOT: Fd
}, _d = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), Ud = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function li(t) {
  return _d.has(t?.trim().toLowerCase() ?? "");
}
function jd(t) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(t?.toLowerCase() ?? "") ? 0 : 1;
}
function Dd(t, e) {
  const r = t?.trim().toLowerCase() ?? "";
  return Ud.has(r) || r === "atq" && e === "Reconstruction";
}
const Nd = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function di(t) {
  if (!/\bBasic Land\b/.test(t.typeLine ?? "")) return null;
  const e = t.rulesText ?? "", r = /^\(?\{T\}: Add \{([WUBRG])\}\.\)?$/.exec(e);
  if (!r || e.startsWith("(") !== e.endsWith(")")) return null;
  if (t.rulesParagraphs) {
    const n = t.rulesParagraphs;
    if (n.length !== 1 || n[0].role !== "rules" || n[0].align || n[0].runs.length !== 1 || n[0].runs[0].text !== e || !!n[0].runs[0].italic !== e.startsWith("("))
      return null;
  }
  return r[1];
}
function Ao(t) {
  if (t.wordingMode === "oracle" || !["mir", "tmp"].includes(t.setCode?.toLowerCase() ?? "")) return null;
  const e = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    t.typeLine ?? ""
  )?.[1];
  if (!e) return null;
  const r = Nd[e];
  return di(t) !== r ? null : {
    typeLine: "Land",
    paragraphs: [
      {
        role: "rules",
        align: "center",
        runs: [{ text: `{T}: Add {${r}} to your mana pool.` }]
      }
    ]
  };
}
const Nr = /* @__PURE__ */ new WeakSet();
function re(t) {
  return !Nr.has(t);
}
function zd(t, e, r) {
  const n = Nr.has(t);
  e || Nr.add(t);
  try {
    r();
  } finally {
    n || Nr.delete(t);
  }
}
const Yd = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function Mr(t) {
  const e = /^Basic (?:Snow )?Land [—–-] (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    t.canonicalTypeLine ?? t.typeLine ?? ""
  )?.[1];
  return e ? Yd[e] : void 0;
}
function wn(t) {
  if (t.frameStyle === "retro" || t.frameTemplate || t.layout && t.layout !== "normal")
    return null;
  const e = Mr(t);
  if (!e) return null;
  const r = t.rulesText ?? "";
  if (!["", e, `{${e}}`, `{T}: Add {${e}}.`, `({T}: Add {${e}}.)`].includes(r))
    return null;
  if (t.rulesParagraphs) {
    const n = t.rulesParagraphs;
    if (n.length !== 1 || n[0].role !== "rules" || n[0].align || n[0].runs.length !== 1 || n[0].runs[0].text !== r || !!n[0].runs[0].italic !== r.startsWith("("))
      return null;
  }
  return `${z.RETRO_ROOT}/img/frames/m15/basics/${e.toLowerCase()}.png`;
}
function ui(t, e, r) {
  if (!re(t)) return !0;
  const n = wn(e);
  if (!n) return !1;
  const o = r.get(n);
  if (!o) throw Error(`Basic land symbol unavailable: ${n}`);
  return t.save(), t.shadowColor = "#0009", t.shadowOffsetX = -1.5, t.shadowOffsetY = 1.5, t.shadowBlur = 1.5, t.drawImage(o, 166, 440, 156, 156), t.restore(), !0;
}
const Bn = "WUBRG";
function j(t) {
  const e = t.canonicalTypeLine ?? t.typeLine ?? "", r = t.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(e), n = t.land ?? (!/^Enchant\b/i.test(e) && /(^|\s)Land(?:\s|$)/i.test(e)), o = !/\bPlaneswalker\b/i.test(e) && (t.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(e)), s = t.creature ?? /(^|\s)Creature(?:\s|$)/i.test(e), a = F(t), i = a.length === 0 ? "Colourless" : a.length > 2 ? "Gold" : a.join(""), l = (r || n) && a.length === 0 ? "Artifact" : i, d = n ? "Land" : r ? "Artifact" : a.length > 1 ? "Gold" : i;
  return {
    frame: l,
    boxes: d,
    background: d,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: n && a.length > 0 ? i : r && a.length > 0 ? a.length > 1 ? "Gold" : i : d,
    pt: d,
    artifact: r,
    land: n,
    legendary: o,
    creature: s,
    className: `rendered-card-profile-${d.toLocaleLowerCase()}`
  };
}
function F(t) {
  if (t.frameColors !== void 0) return Zr(t.frameColors);
  const e = Zr(t.colors ?? []), r = Mr(t);
  return e.length === 0 && r && t.land !== !1 ? [r] : e;
}
function Zr(t) {
  return [
    ...new Set(
      t.map((e) => e.toLocaleUpperCase()).filter((e) => Bn.includes(e))
    )
  ].sort((e, r) => Bn.indexOf(e) - Bn.indexOf(r));
}
const qd = { "10e": "cmrsu", "2ed": "cmrsu", "2x2": "cmrsu", "2xm": "cmrsu", "30a": "cmrsu", "3ed": "cmrsu", "40k": "cmrsu", "4ed": "cmrsu", "5dn": "cmrsu", "5ed": "cmrsu", "6ed": "cmrsu", "7ed": "cmrsu", "8ed": "cmrsu", "9ed": "cmrsu", a25: "cmrsu", acr: "cmrsu", aer: "cmrsu", afc: "cmrsu", afr: "cmrsu", akh: "cmrsu", akr: "cmrsu", ala: "cmrsu", all: "cmrsu", ana: "cmrsu", apc: "cmrsu", arb: "cmrsu", arc: "cmrsu", archie: "cmrsu", arena: "cmrsu", arn: "cmrsu", ath: "cmrsu", atq: "cmrsu", avr: "cmrsu", azorius: "cmru", bbd: "cmrsu", bfz: "cmrsu", big: "cmrsu", blb: "cmrsu", blc: "cmrsu", bng: "cmrsu", bok: "cmrsu", boros: "cmru", bot: "cmrsu", brb: "cmrsu", brc: "cmrsu", bro: "cmrsu", brr: "cmrsu", btd: "cmrsu", c13: "cmrsu", c14: "cmrsu", c15: "cmrsu", c16: "cmrsu", c17: "cmrsu", c18: "cmrsu", c19: "cmrsu", c20: "cmrsu", c21: "cmrsu", cc1: "cmrsu", cc2: "cmrsu", ced: "cmrsu", cei: "cmrsu", chk: "cmrsu", chr: "cmrsu", clb: "cmrsu", clu: "cmrsu", cm1: "cmrsu", cm2: "cmrsu", cma: "cmrsu", cmd: "cmrsu", cmm: "cmrsu", cmr: "cmrsu", cn2: "cmrsu", cns: "cmrsu", con: "cmrsu", conf: "cmrsu", csp: "cmrsu", dci: "cmrsu", dd1: "cmrsu", dd2: "cmrsu", ddc: "cmrsu", ddd: "cmrsu", dde: "cmrsu", ddf: "cmrsu", ddg: "cmrsu", ddh: "cmrsu", ddi: "cmrsu", ddj: "cmrsu", ddk: "cmrsu", ddl: "cmrsu", ddm: "cmrsu", ddn: "cmrsu", ddo: "cmrsu", ddp: "cmrsu", ddq: "cmrsu", ddr: "cmrsu", dds: "cmrsu", ddt: "cmrsu", ddu: "cmrsu", default: "cmrsu", dft: "cmrsu", dgm: "cmrsu", dimir: "cmru", dis: "cmrsu", dka: "cmrsu", dkm: "cmrsu", dmc: "cmrsu", dmr: "cmrsu", dmu: "cmrsu", dom: "cmrsu", dpa: "cmrsu", drb: "cmrsu", drc: "cmrsu", drk: "cmrsu", dsc: "cmrsu", dsk: "cmrsu", dst: "cmrsu", dtk: "cmrsu", e01: "cmrsu", e02: "cmrsu", ecc: "cmrsu", ecl: "cmrsu", eld: "cmrsu", ema: "cmrsu", emn: "cmrsu", eoc: "cmrsu", eoe: "cmrsu", eos: "cmru", eve: "cmrsu", exo: "cmrsu", exp: "cmrsu", fca: "cmrsu", fdc: "cmrsu", fdn: "cmrsu", fem: "cmrsu", fic: "cmrsu", fin: "cmrsu", fnm: "r", fra: "cmrsu", frc: "cmrsu", frf: "cmrsu", fut: "cmrsu", gn2: "cmrsu", gn3: "cmrsu", gnt: "cmrsu", golgari: "cmru", gpt: "cmrsu", grn: "cmrsu", gruul: "cmru", gs1: "cmrsu", gtc: "cmrsu", h09: "cmrsu", h17: "cmrsu", ha1: "cmrsu", hbg: "cmrsu", hml: "cmrsu", hob: "cmrsu", hoc: "cmrsu", hop: "cmrsu", hou: "cmrsu", ice: "cmrsu", idw: "cmrsu", iko: "cmrsu", ima: "cmrsu", inr: "cmrsu", inv: "cmrsu", isd: "cmrsu", izzet: "cmru", j20: "cmrsu", j21: "cmrsu", j22: "cmrsu", j25: "cmru", jmp: "cmrsu", jou: "cmrsu", jud: "cmrsu", khc: "cmrsu", khm: "cmrsu", kld: "cmrsu", klr: "cmrsu", ktk: "cmrsu", lcc: "cmrsu", lci: "cmrsu", lea: "cmrsu", leb: "cmrsu", leg: "cmrsu", lgn: "cmrsu", lrw: "cmrsu", ltc: "cmrsu", ltr: "cmrsu", m10: "cmrsu", m11: "cmrsu", m12: "cmrsu", m13: "cmrsu", m14: "cmrsu", m15: "cmrsu", m19: "cmrsu", m20: "cmrsu", m21: "cmrsu", m3c: "cmrsu", mat: "cmrsu", mb2: "cmrsu", mbc: "cmrsu", mbs: "cmrsu", mc3: "cmrsu", md1: "cmrsu", me1: "cmrsu", me2: "cmrsu", me3: "cmrsu", me4: "cmrsu", med: "cmrsu", mh1: "cmrsu", mh2: "cmrsu", mh3: "cmrsu", mic: "cmrsu", mid: "cmrsu", mir: "cmrsu", mkc: "cmrsu", mkm: "cmrsu", mm2: "cmrsu", mm3: "cmrsu", mma: "cmrsu", mmq: "cmrsu", moc: "cmrsu", mom: "cmrsu", mor: "cmrsu", mp2: "cmrsu", mps: "cmrsu", mrd: "cmrsu", msc: "cmrsu", msh: "cmrsu", mtga: "cmrsu", mtgo: "cmrsu", mul: "cmrsu", ncc: "cmrsu", nec: "cmrsu", nem: "cmrsu", neo: "cmrsu", nph: "cmrsu", ody: "cmrsu", ogw: "cmrsu", om1: "cmrsu", omb: "cmrsu", onc: "cmrsu", one: "cmrsu", ons: "cmrsu", ori: "cmrsu", orzhov: "cmru", otc: "cmrsu", otj: "cmrsu", otp: "cmrsu", p02: "cmrsu", papac: "cmrsu", parl2: "cmrsu", past: "cmrsu", pbook: "cmrsu", pc2: "cmrsu", pca: "cmrsu", pcy: "cmrsu", pd2: "cmrsu", pd3: "cmrsu", pdrc: "c", peuro: "cmrsu", pgru: "c", phpr: "cmrsu", phuk: "cmrsu", pidw: "cmrsu", pio: "cmrsu", pip: "cmrsu", planeswalker: "cmrsu", plc: "cmrsu", pls: "cmrsu", pmps: "cmrsu", por: "cmrsu", prm: "cmrsu", ps11: "cmrsu", psal: "cmrsu", psdg: "cmrsu", psum: "cmrsu", ptg: "cmrsu", ptk: "cmrsu", pvan: "c", pxbox: "cmrsu", pz1: "cmrsu", pz2: "cmrsu", pza: "cmrsu", rav: "cmrsu", ren: "cmrsu", rex: "cmrsu", rin: "cmrsu", rix: "cmrsu", rna: "cmrsu", roe: "cmrsu", rtr: "cmrsu", rvr: "cmrsu", s00: "cmrsu", s99: "cmrsu", scd: "cmrsu", scg: "cmrsu", sds: "cmrsu", selesnya: "cmru", shm: "cmrsu", simic: "cmru", sir: "cmrsu", sis: "cmrsu", sld: "cmrsu", snc: "cmrsu", soa: "cmrsu", soc: "cmrsu", soi: "cmrsu", sok: "cmrsu", som: "cmrsu", sos: "cmrsu", spe: "cmrsu", spg: "cmrsu", spm: "cmrsu", ss1: "cmrsu", ss2: "cmrsu", ss3: "cmrsu", sta: "cmrsu", star: "cmrsu", sth: "cmrsu", stx: "cmrsu", td0: "cmrsu", td2: "cmrsu", tdc: "cmrsu", tdm: "cmrsu", thb: "cmrsu", ths: "cmrsu", tla: "cmrsu", tle: "cmrsu", tlr: "c", tmc: "cmrsu", tmp: "cmrsu", tmt: "cmrsu", tor: "cmrsu", tpr: "cmrsu", trc: "cmrsu", trk: "cmrsu", tsp: "cmrsu", tsr: "cmrsu", uds: "cmrsu", ugl: "cmrsu", ulg: "cmrsu", uma: "cmrsu", und: "cmrsu", unf: "cmrsu", unh: "cmrsu", usg: "cmrsu", ust: "cmrsu", v09: "cmrsu", v10: "cmrsu", v11: "cmrsu", v12: "cmrsu", v13: "cmrsu", v14: "cmrsu", v15: "cmrsu", v16: "cmrsu", v17: "cmrsu", van: "cmrsu", vis: "cmrsu", vma: "cmrsu", voc: "cmrsu", vow: "cmrsu", w16: "cmrsu", w17: "cmrsu", war: "cmrsu", who: "cmrsu", woc: "cmrsu", woe: "cmrsu", wor: "u", wot: "cmrsu", wth: "cmrsu", wwk: "cmrsu", x2ps: "cmrsu", xln: "cmrsu", y22: "cmrsu", y23: "cmrsu", y24: "cmrsu", y25: "cmrsu", y26: "cmrsu", zen: "cmrsu", znc: "cmrsu", zne: "cmrsu", znr: "cmrsu" }, Hd = {
  codes: qd
}, P = z.CONJURER_ROOT, hi = `${P}/img/setSymbols/official/`, Ms = Hd.codes, Xd = {
  common: "c",
  uncommon: "u",
  rare: "r",
  mythic: "m",
  special: "s",
  bonus: "s"
};
function mi(t, e = "common", r = "auto") {
  const n = t.trim().toLowerCase();
  if (r === "keyrune") return null;
  const o = li(n) ? "c" : Xd[e];
  return o && Object.hasOwn(Ms, n) && Ms[n].includes(o) ? `${hi}${n}-${o}.svg` : null;
}
function Ut(t) {
  return !!t?.startsWith(hi);
}
const Jd = z.KEYRUNE_ROOT, Kd = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function ue(t) {
  return !t.setSymbol && !mi(t.setCode ?? "", t.rarity, t.setSymbolSource) ? Kd[t.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1] : [0, 0, 1, 1];
}
const ci = new Set(
  `
10e 2ed 2x2 2xm 3ed 40k 4ed 5dn 5ed 6ed 7ed 8ed 9ed a25 acr aer afc afr akh akr
ala all apc arb arc arn ath atq avr bbd bcore bfz big blb blc bng bok boros bot br
brb brc bro brr btd c13 c14 c15 c16 c17 c18 c19 c20 c21 cc1 cc2 chk chr clb clu
cm1 cm2 cma cmd cmm cmr cn2 cns csp dd2 ddc ddd dde ddf ddg ddh ddi ddj ddk ddl
ddm ddn ddo ddp ddq ddr dds ddt ddu dft dgm dimir dis dka dkm dmc dmr dmu dom dpa
drb drc drk dsc dsk dst dtk dvk e01 e02 ecc ecl eld ema emn eoc eoe eos eve evg
exo exp fdc fdn fem fic fin fra frf fut gn2 gn3 gnt gpt grn gruul gs1 gtc h09 h17
ha1 hbg hml hob hoc hop hou ice ice2 iko ima inr inv isd izzet j20 j21 j22 j25 jmp
jou jud khc khm kld klr ktk lcc lci lea leb leg lgn lrw ltc ltr m10 m11 m12 m13
m14 m15 m19 m20 m21 m3c mar mat mb1 mb2 mbs md1 me1 me2 me3 me4 med mh1 mh2 mh3
mic mid mir mkc mkm mm2 mm3 mma mmq moc mom mor mp1 mp2 mrd msc msh ncc nec nem
neo nms nph ody ogw om1 omb onc one ons ori otc otj otp papac parl parl2 parl3 past pbook
pc2 pca pcy pd2 pd3 pdep pdgc peuro pfnm pgru pidw pio pip plc pleaf pls pm2 pma pmei pmodo
pmps pmpu pmtg1 pmtg2 po2 por psega psum ptg ptk ptsa pxbox pz2 rav rex rix rna roe rtr rvr
s00 s99 scg shm simic sld2 snc soa soc soi sok som sos spe spg spm ss1 ss2 ss3 sta
sth stx td2 tdc tdm thb ths tla tle tmc tmp tmt tor tpr tsp tsr uds ugl ulg uma
una und unf unh usg ust v09 v0x v10 v11 v12 v13 v14 v15 v16 v17 van vis vma voc
vow w16 w17 war who woc woe wot wth wwk x1e x2e x2ps x2u x3e x4ea xcle xice xlcu xln
xmods xren xrin y22 y24 y25 y26 ydmu zen znc zne znr
`.trim().split(/\s+/)
);
ci.add("con_");
const Vd = "GLINT", Qr = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function Zd(t) {
  const e = Qr[t] ?? Qr.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${e}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function Qd(t) {
  const e = Qr[t] ?? Qr.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${e}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function t0(t, e = "common", r) {
  const n = t.trim().toLowerCase();
  if (n === "forge") return Qd(e);
  if (n === Vd.toLowerCase()) return Zd(e);
  const o = mi(n, e, r);
  if (o) return o;
  const s = n === "con" ? "con_" : n === "p02" ? "po2" : n;
  return ci.has(s) ? `${Jd}/${s}.svg` : null;
}
const Rs = {
  "Abu Ja'far": "arn",
  "Active Volcano": "leg",
  "Akron Legionnaire": "leg",
  Aladdin: "arn",
  "Angelic Voices": "leg",
  "Arcades Sabboth": "leg",
  "Arena of the Ancients": "leg",
  "Argothian Pixies": "atq",
  "Ashnod's Altar": "atq",
  "Ashnod's Transmogrant": "atq",
  "Axelrod Gunnarson": "leg",
  "Ayesha Tanaka": "leg",
  "Azure Drake": "leg",
  Banshee: "drk",
  "Barl's Cage": "drk",
  "Beasts of Bogardan": "leg",
  "Blood Moon": "drk",
  "Blood of the Martyr": "drk",
  "Bog Rats": "drk",
  "Book of Rass": "drk",
  Boomerang: "leg",
  "Bronze Horse": "leg",
  "Cat Warriors": "leg",
  Chromium: "leg",
  "City of Brass": "arn",
  Cocoon: "leg",
  "Concordant Crossroads": "leg",
  "Craw Giant": "leg",
  "Cuombajj Witches": "arn",
  Cyclone: "arn",
  "D'Avenant Archer": "leg",
  "Dakkon Blackblade": "leg",
  "Dance of Many": "drk",
  Dandân: "arn",
  "Divine Offering": "leg",
  "Emerald Dragonfly": "leg",
  "Enchantment Alteration": "leg",
  "Erhnam Djinn": "arn",
  "Fallen Angel": "leg",
  "Feldon's Cane": "atq",
  "Fire Drake": "drk",
  "Fishliver Oil": "arn",
  "Flash Flood": "leg",
  "Fountain of Youth": "drk",
  "Gabriel Angelfire": "leg",
  "Gauntlets of Chaos": "leg",
  "Ghazbán Ogre": "arn",
  "Giant Slug": "leg",
  "Goblin Artisans": "atq",
  "Goblin Digging Team": "drk",
  "Goblin Shrine": "drk",
  "Goblins of the Flarg": "drk",
  "Hasran Ogress": "arn",
  "Hell's Caretaker": "leg",
  "Horn of Deafening": "leg",
  "Indestructible Aura": "leg",
  "Ivory Guardians": "leg",
  "Jalum Tome": "atq",
  "Jeweled Bird": "arn",
  Johan: "leg",
  Juxtapose: "leg",
  "Keepers of the Faith": "leg",
  "Kei Takahashi": "leg",
  "Land's Edge": "leg",
  "Living Armor": "drk",
  "Marhault Elsdragon": "leg",
  Metamorphosis: "arn",
  "Mountain Yeti": "leg",
  Nebuchadnezzar: "leg",
  "Nicol Bolas": "leg",
  "Obelisk of Undoing": "atq",
  "Palladia-Mors": "leg",
  "Petra Sphinx": "leg",
  "Primordial Ooze": "leg",
  "Puppet Master": "leg",
  "Rabid Wombat": "leg",
  Rakalite: "atq",
  Recall: "leg",
  "Remove Soul": "leg",
  "Repentant Blacksmith": "arn",
  Revelation: "leg",
  "Rubinia Soulsinger": "leg",
  Runesword: "drk",
  "Safe Haven": "drk",
  "Scavenger Folk": "drk",
  Sentinel: "leg",
  "Serpent Generator": "leg",
  "Shield Wall": "leg",
  "Shimian Night Stalker": "leg",
  "Sivitri Scarzam": "leg",
  "Sol'kanar the Swamp King": "leg",
  Stangg: "leg",
  "Storm Seeker": "leg",
  Takklemaggot: "leg",
  Teleport: "leg",
  "The Fallen": "drk",
  "The Wretched": "leg",
  "Tobias Andrion": "leg",
  "Tor Wauki": "leg",
  "Tormod's Crypt": "drk",
  Transmutation: "leg",
  "Triassic Egg": "leg",
  "Urza's Mine": "atq",
  "Urza's Power Plant": "atq",
  "Urza's Tower": "atq",
  "Vaevictis Asmadi": "leg",
  "Voodoo Doll": "leg",
  "Wall of Heat": "leg",
  "Wall of Opposition": "leg",
  "Wall of Shadows": "leg",
  "Wall of Vapor": "leg",
  "Wall of Wonder": "leg",
  "War Elephant": "arn",
  "Witch Hunter": "drk",
  "Xira Arien": "leg",
  "Yawgmoth Demon": "atq"
};
function gi(t) {
  return Object.hasOwn(Rs, t) ? Rs[t] : null;
}
const ze = z.RENDERER_COMPONENT_ROOT;
function he(t, e = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(e), n = e === "saga" ? "saga" : e === "planeswalker-large" ? "planeswalker_large" : e, o = r && t.land && /^[WUBRG]$/.test(t.frame) ? t.frame : ["saga", "class"].includes(e) && t.boxes === "Colourless" ? "Land" : e.startsWith("planeswalker") && t.boxes === "Artifact" ? "Colourless" : t.boxes;
  return {
    background: Ot(
      r ? "bg" : e === "class" ? "saga_bg" : `${n}_bg`,
      e.startsWith("planeswalker") && o === "Land" ? "Colourless" : r ? t.boxes : o
    ),
    frame: Ot(
      ["normal", "leveler"].includes(e) ? "frames" : `${n}_frames`,
      e === "adventure" ? "WUBRG".includes(t.frame) ? t.frame : "W" : e === "class" ? t.frame === "WU" ? "UW" : t.frame.length === 2 ? "Gold" : t.frame : e === "saga" && t.frame === "Colourless" ? "Land" : e.startsWith("planeswalker") && ["Artifact", "Land"].includes(t.frame) ? "Colourless" : t.frame
    ),
    boxes: Ot(e.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", o),
    nameplate: Ot("nameplates", t.boxes),
    crown: Ot("legendary-crowns", t.crown),
    pt: e.startsWith("planeswalker") ? Ot("planeswalker", "Loyalty") : Ot("pt-boxes", t.pt)
  };
}
function Ye(t) {
  const e = t.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = e === "∞" ? "INFINITY" : e === "½" ? "HALF" : e.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? Ot("symbols", r) : null;
}
function fi(t, e, r) {
  return t0(t, e, r);
}
function Ot(t, e) {
  const r = t === "legendary-crowns" ? "legendary_crowns" : t === "pt-boxes" ? "pt_boxes" : t === "nameplates" ? "boxes" : t, n = t === "symbols" ? "svg" : "webp";
  return `${ze}/img/${r}/${encodeURIComponent(e)}.${n}`;
}
function Q(t, e = t.rarity) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  const r = t.setCode?.trim().toLowerCase() ?? "";
  return t.setSymbol ?? fi(
    r === "chr" ? gi(t.name) ?? "" : r,
    e,
    t.setSymbolSource
  );
}
function e0(t) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  if (Ut(t.setSymbol)) {
    const e = new URL(t.setSymbol).pathname.match(/\/([^/]+)-[curms]\.svg$/)?.[1];
    if (e) return fi(e, "common", "cardconjurer");
  }
  return Q(t, "common");
}
const r0 = {
  lea: {
    W: "conjurer-old",
    U: "conjurer-old",
    B: "conjurer-old",
    R: "mse-old",
    G: "modern"
  },
  leb: {
    W: "conjurer-old",
    U: "conjurer-old",
    B: "conjurer-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  "2ed": {
    W: "conjurer-old",
    U: "conjurer-old",
    B: "conjurer-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  ced: {
    W: "historic-font",
    U: "conjurer-old",
    B: "conjurer-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  cei: {
    W: "historic-font",
    U: "conjurer-old",
    B: "conjurer-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  arn: {
    W: "historic-font",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  atq: {
    W: "historic-font",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  "3ed": {
    W: "historic-font",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  leg: {
    W: "historic-font",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  sum: {
    W: "historic-font",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  drk: {
    W: "historic-font",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "modern"
  },
  fem: {
    W: "historic-font",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  "4ed": {
    W: "modern",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  ice: {
    W: "modern",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  chr: {
    W: "modern",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  hml: {
    W: "modern",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  all: {
    W: "modern",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  rqs: {
    W: "modern",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  mir: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  itp: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  vis: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  "5ed": {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  por: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  wth: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  tmp: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  sth: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  exo: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  p02: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  usg: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  ath: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  ulg: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  "6ed": {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  ptk: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  uds: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  s99: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  mmq: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  brb: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  nem: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  pcy: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  btd: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  inv: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  pls: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  "7ed": {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  apc: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  ody: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  tor: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  jud: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  ons: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  lgn: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  scg: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  "8ed": {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  }
}, n0 = {
  "W/conjurer-old": {
    url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/manaSymbols/old/oldw.svg",
    discColor: "#f7f4d8",
    inkColor: "#0d0f0f",
    glyphScale: 0.92
  },
  "U/conjurer-old": {
    glyphScale: 0.94,
    url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/manaSymbols/old/oldu.svg",
    discColor: "#d2f0f1",
    inkColor: "#000000"
  },
  "B/conjurer-old": {
    glyphScale: 0.94,
    url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/manaSymbols/old/oldb.svg",
    discColor: "#869085",
    inkColor: "#000000"
  },
  "R/mse-old": {
    glyphScale: 0.92,
    url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-mana-old.mse-symbol-font/mana_r.png",
    discColor: "#ffcccc",
    inkColor: "#000000"
  },
  "G/conjurer-old": {
    glyphScale: 0.88,
    url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/manaSymbols/old/oldg.svg",
    discColor: "#c2e3b0",
    inkColor: "#000000"
  },
  "B/mse-old": {
    glyphScale: 0.94,
    url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-mana-old.mse-symbol-font/mana_b.png",
    discColor: "#acacac",
    inkColor: "#000000"
  },
  "U/mse-old": {
    url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-mana-old.mse-symbol-font/mana_u.png",
    discColor: "#c6eeff",
    inkColor: "#000000"
  }
}, o0 = ct(
  "DUAL_HSB_PROFILES"
), s0 = ct(
  "DUAL_MANA_TARGETS"
), xs = ct(
  "PRINTING_COLOR_PROFILES"
), a0 = ct(
  "ORDINARY_COLOR_PROFILES"
), pi = ct(
  "LEGENDS_COLOR_PROFILES"
), i0 = ct(
  "MANA_PRINTING_TARGETS"
), l0 = ct(
  "MANA_PRINTING_INK"
), d0 = ct(
  "PRINTING_MANA_PROFILES"
), u0 = ct(
  "MODERN_MANA_OVERRIDES"
), As = ct(
  "RETRO_MANA_PROFILES"
), Ls = ct(
  "MAJOR_SYMBOL_PROFILES"
), Es = ct(
  "MAJOR_FRAME_INSETS"
), h0 = ct(
  "EARLY_EXPANSION_FRAMES"
), m0 = ct(
  "EARLY_EXPANSION_COLORS"
), Bs = ct("EARLY_EXPANSION_MANA_TARGETS"), Is = ct("PLANAR_COLORS"), eo = ct("PLANAR_TEXTURE");
function Lo(t) {
  return ["arn", "atq", "drk"].includes(t.setCode?.toLowerCase() ?? "") && dt(t) && !t.frameTemplate && (t.layout ?? "normal") === "normal" && Lt(t) === "black" && !j(t).legendary && !/^Level up\b/m.test(t.rulesText ?? "") && t.symbolStyle !== "modern" && !(t.symbolStyle === void 0 && t.wordingMode === "oracle");
}
function Eo(t) {
  if (t.setCode?.toLowerCase() !== "arn" || !Lo(t)) return;
  const e = t.collectorNumber ?? "";
  return /^\d+†$/.test(e) ? "light" : /^\d+$/.test(e) ? "dark" : void 0;
}
const c0 = {
  W: [105, 117, 115],
  U: [53, 97, 116],
  B: [66, 78, 76],
  R: [96, 52, 46],
  G: [57, 92, 84],
  A: [92, 90, 83]
};
function g0(t) {
  if (Eo(t) !== "dark") return;
  const e = F(t), n = j(t).artifact ? "A" : e.length === 1 ? e[0] : "", o = c0[n];
  return o ? { fill: t.calibration !== "source" && (t.calibration === "auto" || t.colorCalibration === "set-hsb-v1") ? `rgba(${o.join(",")},0.8)` : "rgba(0,0,0,0.4)" } : void 0;
}
function f0(t, e, r, n, o, s, a) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = s.fill, t.beginPath(), t.arc(r + o / 2 - 0.25, n + o / 2 - 0.5, o / 2 * 0.81, 0, Math.PI * 2), t.fill(), t.font = '100px "CardRenderer MTG MPlantin"', t.textAlign = "left", t.textBaseline = "alphabetic", t.fillStyle = "#111";
  const i = t.measureText(e), l = o * 0.7 * (a.numberScale ?? 1) / (i.actualBoundingBoxAscent + i.actualBoundingBoxDescent);
  t.translate(
    r + o / 2 + (a.numberDx ?? 0),
    n + o / 2 + (a.numberDy ?? 0)
  ), t.scale(l, l), t.fillText(
    e,
    (i.actualBoundingBoxLeft - i.actualBoundingBoxRight) / 2,
    (i.actualBoundingBoxAscent - i.actualBoundingBoxDescent) / 2
  ), t.restore();
}
function ot(t) {
  const e = t.setCalibrationCandidate;
  if (!e) return ri(t.setCode);
  if (e.set !== t.setCode?.toLowerCase())
    throw Error("Calibration candidate belongs to another set");
  if (bn(e.set)) {
    ni(e);
    return;
  }
  return cd(e);
}
function Sr(t) {
  return t.frameColors ? F(t) : [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(
    ([e]) => new RegExp(String.raw`\b${e}\b`).test(t.canonicalTypeLine ?? t.typeLine ?? "")
  ).map(([, e]) => e);
}
function p0(t, e) {
  const r = t.dualLand, n = t.frames["L-dual"];
  if (!r || !n || n.family !== "abu" || e.length !== 2) return;
  const o = `${z.RETRO_ROOT}/img/frames/old/abu/`, s = (u) => `${o}${u.toLowerCase()}l.png`;
  for (const u of ["W", "U", "B", "R", "G"])
    if (r.sources[u]?.source !== JSON.stringify([s(u), n.frame]) || !r.pinline.palette[u])
      return;
  const a = r.outlines[e.join("")];
  if (!a) return;
  const i = ["WU", "WG", "UG", "BG", "RG"].includes(e.join("")) ? [...e].reverse() : e, l = /* @__PURE__ */ new Set([...i, a]), d = Object.fromEntries(
    [...l].map((u) => [s(u), r.sources[u].adjustment])
  );
  return {
    base: s(i[0]),
    overlay: s(i[1]),
    mask: `${z.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`,
    outline: s(a),
    pinline: r.pinline,
    materials: d
  };
}
function ht(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !ot(t) || t.frameTemplate || t.frameAssetFamily || t.frameStyle === "modern" || t.borderColor && t.borderColor !== ot(t).border || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", n = F(t), o = t.land ?? /\bLand\b/.test(r);
  let s, a;
  if (o) {
    const u = {
      Plains: "W",
      Island: "U",
      Swamp: "B",
      Mountain: "R",
      Forest: "G"
    }[t.name], h = t.frameColors ?? (u ? [u] : ot(t).dualLand ? Sr(t) : []);
    if (h.length === 2) {
      if (a = p0(ot(t), Sr(t)), !a) return;
      s = "L-dual";
    } else if (h.length) {
      if (h.length !== 1) return;
      s = `L-${h[0]}`;
    } else s = "L";
  } else
    s = t.artifact ?? /\bArtifact\b/.test(r) ? "A" : n.length === 1 ? n[0] : n.length > 1 ? "M" : void 0;
  const i = s && ot(t).frames[s];
  if (!i) return;
  const l = s === "L" ? e === "chr" && t.name === "Safe Haven" ? "L-dark" : e === "chr" && t.name === "City of Brass" || e === "4ed" && t.name === "Oasis" ? "L-gold" : "L-red" : s;
  return {
    ...i,
    dual: a,
    material: s,
    profile: `${e}/${l}`,
    asset: a?.base ?? `${z.RETRO_ROOT}/img/frames/old/${i.family}/${i.assetKey}.png`
  };
}
function Ze(t) {
  return !!ht(t) && !/^Level up\b/m.test(t.rulesText ?? "") && t.symbolStyle !== "modern" && !(t.symbolStyle === void 0 && t.wordingMode === "oracle");
}
function b0(t) {
  return Ze(t) ? ot(t).mana.geometry : void 0;
}
function y0(t, e) {
  return Ze(t) ? ot(t).mana.paper[e === "X" ? "N" : e] : void 0;
}
function w0(t) {
  return t.calibration !== "source" && t.colorCalibration === "set-hsb-v1" && Ze(t) ? ot(t).mana.ink : void 0;
}
function Rr(t, e) {
  if (!(t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle"))
    return r0[t.setCode?.toLowerCase() ?? ""]?.[e];
}
function ro(t, e) {
  const r = Rr(t, e), n = r && r !== "modern" && r !== "historic-font" ? n0[`${e}/${r}`] : void 0, o = bi(t, e);
  return n && o ? { ...n, inkExpansion: o.pixels } : n;
}
function S0(t, e) {
  return e === "B" && Ze(t) ? "opaque-percentile" : bi(t, e)?.paperSample;
}
function bi(t, e) {
  const r = Ze(t), o = (r && /^[WUBRG]$/.test(e) ? ot(t).mana.sourceInk?.[e] : void 0) ?? l0[`${t.setCode?.toLowerCase()}/${e}`];
  if (!(!o || o.family !== Rr(t, e)) && !(o.paperSample && !Lo(t) && !r))
    return o;
}
const v0 = {
  shadow: [-1.0372, 2.0372],
  paper: [202, 197, 192],
  ink: [13, 15, 15]
};
function yi(t) {
  return !dt(t) && t.frameAssetFamily === void 0 && t.frameTemplate === void 0 && (t.layout ?? "normal") === "normal" && !/\b(Saga|Class|Planeswalker|Battle)\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") && !/^Level up\b/m.test(t.rulesText ?? "");
}
function wi(t) {
  return yi(t) ? v0 : void 0;
}
function Si(t, e) {
  return wi(t) && /^\d$/.test(e) ? `${P}/img/manaSymbols/${e}.svg` : null;
}
function zt(t) {
  const e = [
    t.rulesText ?? "",
    ...(t.rulesParagraphs ?? []).flatMap((n) => n.runs.map((o) => o.text))
  ], r = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...e.flatMap(
      (n) => yn(n).flatMap((o) => o.symbol ? [o.symbol] : [])
    )
  ]);
  return [
    ...(t.manaSymbols ?? []).flatMap((n) => {
      const o = Si(t, n);
      return o ? [o] : [];
    }),
    ...[...r].map(
      (n) => Rr(t, n) === "historic-font" ? null : ro(t, n)?.url ?? Ye(n)
    )
  ];
}
const C0 = {
  WU: "U",
  WB: "W",
  WR: "W",
  WG: "W",
  UB: "B",
  UR: "R",
  UG: "U",
  BR: "B",
  BG: "B",
  RG: "G"
};
function k0(t, e) {
  const r = [...new Set(t)].filter((o) => /^[WUBRG]$/.test(o));
  r.sort((o, s) => "WUBRG".indexOf(o) - "WUBRG".indexOf(s));
  const n = r.join("");
  return e?.toLowerCase() === "leb" && (n === "WU" || n === "UR") ? n === "WU" ? "W" : "U" : r.length === 1 ? r[0] : C0[n];
}
function ne(t) {
  if (t.frameTemplate || !["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "") || t.frameStyle === "modern" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) || t.layout && t.layout !== "normal")
    return;
  const e = ht(t)?.dual;
  if (e) return e;
  const r = Sr(t);
  if (r.length !== 2) return;
  const n = ["WU", "WG", "UG", "BG", "RG"].includes(r.join("")) ? [...r].reverse() : r, o = `${z.RETRO_ROOT}/img/frames/old/abu/`;
  return {
    pinline: void 0,
    base: `${o}${n[0].toLowerCase()}l.png`,
    overlay: `${o}${n[1].toLowerCase()}l.png`,
    mask: `${z.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`,
    outline: `${o}${k0(r, t.setCode).toLowerCase()}l.png`
  };
}
function T0(t) {
  if (!(t.setCode?.toLowerCase() !== "leb" || !ne(t)))
    return ["WU", "UR"].includes(Sr(t).join("")) ? "beta-outline-ink-v2" : void 0;
}
const Os = [19.375 / 488, 21.125 / 680, 449.625 / 488, 639.25 / 680], $s = {
  W: {
    family: "abu",
    stockWindow: Os,
    frame: [-0.015000000000000013, -0.016735294117647074, 1.03, 1.032],
    art: [0.1092866666666667, 0.09137899159663865, 0.7821133333333333, 0.45408000000000004]
  },
  U: {
    family: "fourth",
    frame: [0.006241180327868882, 0.003875294117647035, 0.989584, 0.995748],
    art: [0.10981763899453553, 0.09159595126050418, 0.7830908053333334, 0.4523540914285714]
  },
  B: {
    family: "abu",
    stockWindow: Os,
    frame: [-0.015000000000000013, -0.016470588235294133, 1.03, 1.03],
    art: [0.1092866666666667, 0.09143417366946782, 0.7821133333333333, 0.4532]
  },
  R: {
    family: "fourth",
    frame: [0.006241180327868882, 0.004610588235294094, 0.989584, 0.995748],
    art: [0.10915791632786884, 0.09327957680672272, 0.7844102506666666, 0.45140576]
  },
  G: {
    family: "fourth",
    frame: [0.007265770491803308, 0.004855294117647071, 0.989584, 0.993784],
    art: [0.11084222915846996, 0.09192970173669468, 0.78177136, 0.45146187428571427]
  },
  A: {
    family: "fourth",
    frame: [0.006192590163934432, 0.004855294117647071, 0.987636, 0.993784],
    art: [0.11088200616393441, 0.09429585411764707, 0.780890864, 0.44909572190476194]
  },
  L: {
    family: "fourth",
    frame: [0.0052165901639344555, 0.00559058823529413, 0.989584, 0.993784],
    art: [0.10945277149726775, 0.09077207394957981, 0.7844102506666666, 0.4524083352380952]
  },
  M: {
    family: "fourth",
    frame: [0.0037205395409838113, 0.004187595294117773, 0.9910362339999996, 0.9947522519999996],
    art: [0.10810968952231712, 0.09276791487697494, 0.786222078973333, 0.4519017373371427]
  }
};
function Mt(t) {
  if (t.setCode?.toLowerCase() !== "leg" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const e = t.typeLine ?? "", r = F(t), n = t.land ?? /\bLand\b/.test(e) ? "L" : t.artifact ?? /\bArtifact\b/.test(e) ? "A" : r.length > 1 ? "M" : r[0];
  if (!n || !(n in $s)) return;
  const o = $s[n];
  return {
    ...o,
    material: n,
    asset: `${z.RETRO_ROOT}/img/frames/old/${o.family}/${n.toLowerCase()}.png`
  };
}
function Qe(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !["arn", "atq", "drk"].includes(e) || t.frameTemplate || t.frameStyle === "modern" || t.borderColor && t.borderColor !== "black" || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", n = F(t), o = t.land ?? /\bLand\b/.test(r);
  if (o && (/\b(Basic|Plains|Island|Swamp|Mountain|Forest)\b/.test(r) || e === "arn" && t.name === "Mountain"))
    return;
  const s = o ? "L" : t.artifact ?? /\bArtifact\b/.test(r) ? "A" : n.length === 1 ? n[0] : n.length > 1 ? "M" : void 0, a = s && h0[`${e}/${s}`];
  if (a)
    return {
      ...a,
      material: s,
      asset: `${z.RETRO_ROOT}/img/frames/old/${a.family}/${s.toLowerCase()}.png`
    };
}
function M0(t) {
  if (t.colorCalibration !== "set-hsb-v1" || t.borderColor && t.borderColor !== "black")
    return;
  const e = Mt(t);
  return e && pi[`leg/black/retro/${e.material.toLowerCase()}.png`]?.source === JSON.stringify([e.asset, e.frame]) ? "#262626" : void 0;
}
function St(t) {
  return t.setCode?.toLowerCase() === "3ed" && !t.frameTemplate && t.frameStyle !== "modern" && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") && (!t.layout || t.layout === "normal") && (t.land ?? /\bLand\b/.test(t.typeLine ?? ""));
}
const fr = `${z.RETRO_ROOT}/img/frames/old/fourth/l.png`, R0 = [2.404 / 488, 9.9 / 680, 0.984, 0.99], x0 = [
  (2.404 + 0.10533333333333333 * 488 * 0.984) / 488,
  (9.9 + 0.08571428571428572 * 680 * 0.99) / 680,
  0.7926666666666666 * 0.984,
  0.4552380952380952 * 0.99
];
function vi(t) {
  const e = t.frameColors ?? [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(([r]) => new RegExp(`\\b${r}\\b`).test(t.typeLine ?? "")).map(([, r]) => r);
  return [...new Set(e)].filter((r) => "WUBRG".includes(r)).sort((r, n) => "RBWUG".indexOf(r) - "RBWUG".indexOf(n));
}
const Ci = {
  W: {
    x: [1.009125, 0.15625],
    y: [1.008625, 3.8125],
    aperture: [0.10133333333333333, 0.08714285714285715, 0.7946666666666666, 0.4561904761904762]
  },
  U: {
    x: [1.01075, -0.421875],
    y: [1.009125, 4.1875],
    aperture: [0.104, 0.08761904761904762, 0.7926666666666666, 0.4552380952380952]
  },
  B: {
    x: [1.012375, -0.265625],
    y: [1.010375, 6.65625],
    aperture: [0.10533333333333333, 0.08523809523809524, 0.7913333333333333, 0.45476190476190476]
  },
  R: {
    x: [1.010625, 0.46875],
    y: [1.010625, 4.75],
    aperture: [0.10333333333333333, 0.08857142857142856, 0.794, 0.4542857142857143]
  },
  G: {
    x: [1.01025, -0.578125],
    y: [1.00775, 4.671875],
    aperture: [0.104, 0.08714285714285715, 0.7913333333333333, 0.4552380952380952]
  },
  A: {
    x: [1.0095, 0.65625],
    y: [1.0095, 4.75],
    aperture: [0.10533333333333333, 0.08952380952380952, 0.792, 0.45285714285714285]
  }
};
function Bo(t) {
  if (t.setCode?.toLowerCase() !== "3ed" || t.frameTemplate || t.frameStyle === "modern" || t.borderColor && t.borderColor !== "white" || St(t) || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return null;
  if (/\bArtifact\b/.test(t.typeLine ?? "")) return "A";
  const e = F(t);
  if (e.length !== 1) return null;
  const r = e[0];
  return r === "W" || r === "U" || r === "B" || r === "R" || r === "G" ? r : null;
}
function ki(t) {
  const e = Bo(t);
  if (!e) return null;
  const {
    x: [r, n],
    y: [o, s]
  } = Ci[e];
  return [
    (244 + (0.012 * 488 - 244) * r + n) / 488,
    (340 + (0.01 * 680 - 340) * o + s) / 680,
    0.974 * r,
    0.982 * o
  ];
}
function A0(t) {
  const e = Bo(t), r = ki(t);
  if (!e || !r) return null;
  const [n, o, s, a] = Ci[e].aperture;
  return [r[0] + n * r[2], r[1] + o * r[3], s * r[2], a * r[3]];
}
function Ti(t) {
  return Bo(t) !== null;
}
const L0 = z.RETRO_SYMBOL_FONT, qe = z.RETRO_ROOT, E0 = `${qe}/fonts/goudy-medieval.ttf`, B0 = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), I0 = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function dt(t) {
  return t.frameTemplate || t.layout && !["normal", "token"].includes(t.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") ? !1 : t.frameStyle === "retro" || t.frameStyle !== "modern" && B0.has(t.setCode?.toLowerCase() ?? "");
}
function Io(t) {
  return ["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "");
}
function $t(t) {
  const e = ht(t);
  if (e) return e.family;
  const r = t.setCode?.toLowerCase() ?? "", n = Qe(t);
  if (n) return n.family;
  const o = Mt(t);
  return o ? o.family : Io(t) ? "abu" : r === "leg" && F(t).length > 1 ? "legends" : St(t) || ["3ed", "4ed", "5ed", "atq"].includes(r) && !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) ? "fourth" : "seventh";
}
function xr(t) {
  const e = ht(t);
  if (e) return e.frame;
  const r = Qe(t);
  if (r) return r.frame;
  const n = Mt(t);
  if (n) return n.frame;
  if (St(t)) return R0;
  const o = ki(t);
  return o || ($t(t) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1]);
}
function Sn(t) {
  const e = Io(t), r = Mt(t) && (!t.borderColor || t.borderColor === "black");
  return {
    ...V,
    frame: xr(t),
    title: [e ? 0.07 : 0.1134, 0.0481, e ? 0.8467 : 0.8, 0.043],
    art: ht(t)?.art ?? Qe(t)?.art ?? Mt(t)?.art ?? A0(t) ?? (St(t) ? x0 : $t(t) === "legends" ? [0.112, 0.094, 0.78, 0.45] : $t(t) === "fourth" ? [0.109, 0.093, 0.779, 0.453] : e ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429]),
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: r ? [384 / T, 617 / L, 72 / T, 30 / L] : [0.8074, 0.895, 0.1367, 0.043],
    footer: r ? [48 / T, 624 / L, 340 / T, 24 / L] : [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function Qt(t) {
  const e = ht(t);
  if (e) return e.asset;
  const r = Qe(t);
  if (r) return r.asset;
  const n = Mt(t);
  if (n) return n.asset;
  if (St(t)) return fr;
  const o = ne(t);
  if (o) return o.base;
  const s = F(t), a = t.canonicalTypeLine ?? t.typeLine ?? "", i = j(t), l = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([c]) => a.includes(c)), d = t.frameColors?.map((c) => c.toLowerCase()) ?? l.map(([, c]) => c), u = i.land ? d.length === 1 ? d[0] + "l" : "l" : i.artifact ? "a" : s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c", h = $t(t), m = h === "seventh" || u === "c" || h === "abu" && u === "m" ? "seventh/regular" : `old/${h}`;
  return `${qe}/img/frames/${m}/${h === "legends" ? "legendsFrameM" : u}.png`;
}
function Lt(t) {
  return t.borderColor ?? (I0.has(t.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function O0(t) {
  return Lt(t) === "silver" ? Pt(null, "silver").border : Lt(t) === "white" ? G0 : M0(t) ?? "#080808";
}
function tn(t) {
  return $t(t) === "fourth" ? `${qe}/img/frames/old/fourth/borderBlack.png` : `${qe}/img/frames/${$t(t) === "abu" ? "old/abu" : "seventh/regular"}/border.svg`;
}
function Gs(t) {
  return Io(t) ? "#ababab" : "#f2eee3";
}
function $0(t) {
  return t.setCode?.toLowerCase() === "7ed" && F(t).some((e) => e === "W" || e === "G") && !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) ? "saturate(.7) brightness(.88)" : "none";
}
function Oo(t) {
  if (Ao(t)) return null;
  const e = di(t);
  return e ? `${qe}/img/frames/m15/basics/${e.toLowerCase()}.png` : null;
}
const G0 = "#eeedeb";
function Mi(t) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  const e = t.setCode?.toLowerCase() ?? "";
  return !t.setSymbol && e === "ice" && t.setSymbolSource === "keyrune" ? `${z.KEYRUNE_ROOT}/ice2.svg` : !t.setSymbol && Dd(e, t.name) ? null : Q(t);
}
function h1(t) {
  const e = (t.rulesText ?? "").length;
  return e > 340 ? 16 : e > 210 ? 19 : 23;
}
function P0(t) {
  const e = ne(t);
  return [
    Oo(t),
    Qt(t),
    e?.overlay,
    e?.mask,
    ...ht(t)?.dual ? [e?.outline] : [],
    !St(t) && !Ti(t) && (ht(t)?.stockMaskFrame || Lt(t) !== "black" || $t(t) === "fourth" || wr(t)) ? tn(t) : null,
    t.illustration,
    Mi(t),
    ...zt(t)
  ];
}
const kt = ([t, e, r, n]) => [
  t * T,
  e * L,
  r * T,
  n * L
];
function m1(t, e) {
  return ["7ed", "8ed", "9ed"].includes(t?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(e ?? "") ? "black" : void 0;
}
const W0 = ["ice", "chr", "all"], F0 = { leg: { "Adun Oakenshield": "{G}{R}{B}", "Angus Mackenzie": "{W}{U}{G}", "Arcades Sabboth": "{2}{W}{W}{G}{G}{U}{U}", "Axelrod Gunnarson": "{4}{B}{B}{R}{R}", "Ayesha Tanaka": "{U}{U}{W}{W}", "Barktooth Warbeard": "{4}{B}{R}{R}", "Bartel Runeaxe": "{3}{G}{R}{B}", "Boris Devilboon": "{3}{B}{R}", Chromium: "{2}{B}{B}{U}{U}{W}{W}", "Dakkon Blackblade": "{2}{B}{U}{U}{W}", "Gabriel Angelfire": "{3}{W}{W}{G}{G}", "Gosta Dirk": "{3}{W}{W}{U}{U}", "Gwendlyn Di Corci": "{R}{B}{B}{U}", Halfdane: "{1}{B}{U}{W}", "Hazezon Tamar": "{4}{W}{G}{R}", "Hunding Gjornersen": "{3}{U}{U}{W}", "Jacques le Vert": "{1}{W}{G}{R}", "Jasmine Boreal": "{3}{W}{G}", "Jedit Ojanen": "{4}{U}{W}{W}", "Jerrard of the Closed Fist": "{3}{G}{G}{R}", Johan: "{3}{W}{G}{R}", "Kasimir the Lone Wolf": "{4}{U}{W}", "Kei Takahashi": "{2}{W}{G}", "Lady Caleria": "{3}{W}{W}{G}{G}", "Lady Evangela": "{B}{U}{W}", "Lady Orca": "{5}{B}{R}", "Livonya Silone": "{2}{G}{G}{R}{R}", "Lord Magnus": "{3}{W}{W}{G}", "Marhault Elsdragon": "{3}{G}{R}{R}", Nebuchadnezzar: "{3}{B}{U}", "Nicol Bolas": "{2}{U}{U}{B}{B}{R}{R}", "Palladia-Mors": "{2}{W}{W}{G}{G}{R}{R}", "Pavel Maliki": "{4}{B}{R}", "Princess Lucrezia": "{3}{B}{U}{U}", Ragnar: "{U}{W}{G}", "Ramirez DePietro": "{3}{B}{B}{U}", "Ramses Overdark": "{2}{B}{B}{U}{U}", "Rasputin Dreamweaver": "{4}{W}{U}", "Riven Turnbull": "{5}{B}{U}", "Rohgahh of Kher Keep": "{2}{B}{B}{R}{R}", "Rubinia Soulsinger": "{2}{U}{W}{G}", "Sir Shandlar of Eberyn": "{4}{W}{G}", "Sivitri Scarzam": "{5}{B}{U}", "Sol'kanar the Swamp King": "{2}{R}{B}{U}", Stangg: "{4}{G}{R}", "Sunastian Falconer": "{3}{G}{R}", "Tetsuo Umezawa": "{R}{B}{U}", "The Lady of the Mountain": "{4}{G}{R}", "Tobias Andrion": "{3}{U}{W}", "Tor Wauki": "{2}{B}{B}{R}", "Torsten Von Ursus": "{3}{W}{G}{G}", "Tuknir Deathlock": "{G}{G}{R}{R}", "Ur-Drago": "{3}{B}{B}{U}{U}", "Vaevictis Asmadi": "{2}{B}{B}{R}{R}{G}{G}", "Xira Arien": "{G}{R}{B}" }, drk: { "Dark Heart of the Wood": "{B}{G}", "Marsh Goblins": "{B}{R}", "Scarwood Goblins": "{G}{R}" } }, Ps = {
  wubrgSets: W0,
  overrides: F0
};
function Ri(t, e) {
  const r = t.setCode?.toLowerCase() ?? "", o = Ps.overrides[r]?.[t.name ?? ""];
  if (o) {
    const s = [...o.matchAll(/\{([^}]+)\}/g)].map((a) => a[1]);
    return [...s].sort().join("|") === [...e].sort().join("|") ? s : [...e];
  }
  return !Ps.wubrgSets.includes(r) || e.some((s) => !/^(?:\d+|X|[WUBRG])$/.test(s)) ? [...e] : [
    ...e.filter((s) => !"WUBRG".includes(s)),
    ...e.filter((s) => "WUBRG".includes(s)).sort((s, a) => "WUBRG".indexOf(s) - "WUBRG".indexOf(a))
  ];
}
function xi(t) {
  if (!/\bLand\b/.test(t)) return;
  const e = ["Plains", "Island", "Swamp", "Mountain", "Forest"].flatMap(
    (r, n) => new RegExp(`\\b${r}\\b`).test(t) ? ["WUBRG"[n]] : []
  );
  return e.length >= 1 && e.length <= 2 ? e : void 0;
}
function _0(t, e, r, n, o) {
  if (!/\bLand\b/.test(t) || e.length) return;
  const s = xi(t);
  if (s || /\b(Plains|Island|Swamp|Mountain|Forest)\b/.test(t) || ["lea", "leb", "2ed", "3ed"].includes(r?.toLowerCase() ?? ""))
    return s;
  if (!["2003", "2015", "future"].includes(n) || /\bArtifact\b/.test(t) || o == null) return;
  if (!Array.isArray(o) || !o.every((i) => typeof i == "string" && /^[WUBRGC]$/.test(i)))
    throw Error("Invalid produced mana.");
  const a = [..."WUBRG"].filter((i) => o.includes(i));
  return a.length >= 1 && a.length <= 2 ? a : void 0;
}
function U0(t) {
  const e = t.split(`
`).flatMap((r) => {
    const n = /^\(?\{T\}: Add (\{[WUBRGC]\}(?:,? (?:or )?\{[WUBRGC]\})*)\.\)?$/.exec(r);
    return n ? [...n[1].matchAll(/\{([WUBRGC])\}/g)].map((o) => o[1]) : [];
  });
  return e.length ? [...new Set(e)] : void 0;
}
function j0(t, e, r) {
  return /\b(Saga|Class|Planeswalker|Battle)\b/.test(e) || /^Level up\b/m.test(r) ? { ...t, frameAssetFamily: void 0 } : t;
}
function Re(t) {
  return t.rulesParagraphs ?? t.rulesText.split(`
`).filter(Boolean).map((e) => ({ role: "rules", runs: [{ text: e }] }));
}
function D0(t, e, r = "oracle", n = {}) {
  const o = e[r];
  if (!o) throw Error(`Missing ${r} printing wording`);
  if (typeof o.typeLine != "string" || typeof o.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const s = n.rulesAlignment ?? r, a = s === "left" ? void 0 : e[s];
  if (s !== "left" && !a) throw Error(`Missing ${s} alignment wording`);
  const i = j({ ...t, typeLine: e.oracle.typeLine });
  return {
    ...t,
    ...o,
    canonicalTypeLine: t.canonicalTypeLine ?? e.oracle.typeLine,
    frameColors: t.frameColors ?? (i.land && !t.colors?.length ? xi(t.canonicalTypeLine ?? e.oracle.typeLine) : void 0),
    manaSymbols: o.manaSymbols ?? (r === "original" ? Ri(t, t.manaSymbols ?? []) : e.oracle.manaSymbols ?? t.manaSymbols),
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: o.rulesParagraphs,
    rulesAlignment: a ? { mode: "auto", reference: Re(a) } : { mode: "left" },
    artifact: t.artifact ?? i.artifact,
    land: t.land ?? i.land,
    creature: t.creature ?? i.creature,
    legendary: t.legendary ?? i.legendary,
    wordingMode: r,
    symbolStyle: n.symbolStyle ?? (r === "oracle" ? "modern" : "original")
  };
}
const N0 = {
  "Mana Vault": "Tap to add 3 colorless mana to your mana pool. Mana Vault doesn't untap normally during untap phase; to untap it, you must pay 4 mana. If Mana Vault remains tapped during upkeep it does 1 damage to you. Tapping this artifact can be played as an interrupt.",
  "Hypnotic Specter": 'Flying An opponent damaged by Specter must discard a card at random from his or her hand. Ignore this effect if opponent has no cards left in hand. "...There was no trace/ Of aught on that illumined face..." —Samuel Coleridge, "Phantom"'
}, no = (t) => t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
function z0(t, e) {
  if (t.wordingMode === "oracle" || !["lea", "leb"].includes(t.setCode?.toLowerCase() ?? ""))
    return !1;
  const r = N0[t.name];
  return !!(r && no(e.flatMap((n) => n.runs.map((o) => o.text)).join(" ")) === no(r));
}
const Ws = {
  type: { fontSize: 22.2, dx: -2, dy: -1 },
  artistBaseline: 630.25,
  statsDx: 1,
  headingInk: "#828282"
};
function je(t) {
  const e = t?.toLowerCase();
  return e === "lea" ? { ...Ws, artistInk: "#737373", statsInk: "#787878" } : e === "leb" ? { ...Ws, artistInk: "#828282", statsInk: "#737373" } : void 0;
}
function Y0(t, e) {
  const r = t.setCode?.toLowerCase();
  if (t.wordingMode === "oracle" || !["lea", "leb"].includes(r ?? "")) return {};
  const n = no(e.flatMap((o) => o.runs.map((s) => s.text)).join(" "));
  return t.name === "Lifetap" && n === "You gain 1 life each time any forest of opponent's becomes tapped." || t.name === "Gauntlet of Might" && n === "All red creatures gain +1/+1 and all mountains provide an extra red mana when tapped." ? { centeredWidth: 390, centeredDx: -6.5 } : t.name === "Howl from Beyond" && n === "Target creature gains +X/+0 until end of turn." || r === "lea" && t.name === "Twiddle" && n === "Caster may tap or untap any one land, creature, or artifact in play." ? { centeredDx: -6.5, centeredDy: -16 } : t.name === "Black Vise" && n === "If opponent has more than four cards in hand during upkeep, black vise does 1 damage to opponent for each card in excess of four." ? { shortRegularDy: -16 } : r === "leb" && t.name === "Birds of Paradise" && n === "Flying Tap to add one mana of any color to your mana pool. This tap may be played as an interrupt." ? { centeredWidth: 374, regularDx: 10, regularDy: 12 } : {};
}
const q0 = "alpha-oracle-fixed-inset-v2";
function H0(t, e, r) {
  return !["lea", "leb"].includes(e.setCode?.toLowerCase() ?? "") || !r ? r : e.wordingMode === "oracle" ? Qn(t, e, r) : Ai(t, e, r);
}
function Ai(t, e, r, n = {}) {
  if (!Ue(r)) throw Error("Missing native typography request");
  const s = Re({
    rulesText: e.rulesText ?? "",
    rulesParagraphs: e.rulesParagraphs
  }), a = e.rulesAlignment?.mode === "left" ? s.map((p) => p.role === "rules" ? { ...p, align: "left" } : p) : s, i = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? a : a;
  n = { ...Y0(e, i), ...n };
  const l = i.reduce(
    (p, w) => p + w.runs.reduce((S, v) => S + v.text.length, 0),
    0
  ), [, d, , u] = kt(Sn(e).rules), h = {
    leading: 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1
  }, m = n.forceSmall ?? z0(e, i);
  let c;
  if (!m && l <= (n.largeMaximum ?? 117) && e.rulesAlignment?.mode !== "left") {
    const p = a.map((S) => ({ ...S, align: S.align ?? "center" })), w = O(
      t,
      p,
      {
        x: 70,
        y: d - 6,
        width: n.largeFitWidth ?? n.centeredWidth ?? 340,
        height: u - 8
      },
      32.5,
      32.5,
      { ...h, leading: 1.1, balanceLines: !0, centerOffset: 0 }
    );
    if (!w.overflow && w.lines.length <= 5)
      if (r.size >= 30) c = r;
      else {
        const S = O(
          t,
          p,
          { x: 70, y: d - 6, width: n.centeredWidth ?? 348, height: u - 8 },
          32.5,
          32.5,
          { ...h, leading: 1.1, balanceLines: !0, centerOffset: 0 }
        );
        !S.overflow && S.lines.length <= 5 && (c = S);
      }
  }
  if (c || (m || l > (n.mediumMaximum ?? 274) ? c = r.size < 19 ? r : O(
    t,
    a,
    { x: 70, y: d + 4, width: 346, height: u + 8 },
    15.5,
    15.5,
    { ...h, leading: 1.25, centerOffset: -18 }
  ) : c = r.size >= 19 && r.size < 30 ? r : O(
    t,
    a,
    { x: 70, y: d + 4, width: 346, height: u - 8 },
    n.mediumSize ?? 22.5,
    19,
    { ...h, centerOffset: -10 }
  )), c.overflow && (c = r), c.size >= 19) {
    const p = Ue(c);
    if (!p) throw Error("Missing selected typography request");
    const w = p.paragraphs.every((A) => A.align === "center"), S = w && c.size >= 30 ? n.centeredWidth : void 0, v = !w && c.size < 30 ? n.mediumSizeDelta : void 0;
    if (S !== void 0 || v) {
      const A = c.size + (v ?? 0), _ = O(
        t,
        p.paragraphs,
        {
          ...p.bounds,
          ...S !== void 0 ? { x: (488 - S) / 2, width: S } : {}
        },
        A,
        A,
        p.typography
      );
      _.overflow || (c = _);
    }
    const C = n.regularWidthDelta ?? (l < 180 || e.setCode?.toLowerCase() === "leb" ? 8 : 0);
    let k = n.transferAlphaModel ? xo(t, e, c, C) ?? c : Qn(t, e, c, C) ?? c;
    if (e.setCode?.toLowerCase() === "lea" && e.wordingMode !== "oracle" && n.regularWidthDelta === void 0 && C === 0 && !w && p.paragraphs.every((A) => A.role === "rules") && k.lines.length > c.lines.length) {
      const A = Qn(t, e, c, 8);
      A && A !== c && A.lines.length < k.lines.length && (k = A);
    }
    const R = w ? n.centeredDx ?? 0 : n.regularDx ?? 0, M = w ? n.centeredDy ?? 0 : n.regularDy !== void 0 ? n.regularDy : c.lines.length <= 5 ? n.shortRegularDy ?? 0 : 0;
    if (!R && !M) return k;
    const x = {
      ...k,
      x: k.x + R / (k.horizontalScale ?? 1),
      top: k.top + M,
      lines: k.lines.map((A) => ({
        ...A,
        x: (A.x ?? k.x) + R / (k.horizontalScale ?? 1),
        baseline: A.baseline + M,
        inkBounds: [
          A.inkBounds[0] + R / (k.horizontalScale ?? 1),
          A.inkBounds[1] + M,
          A.inkBounds[2],
          A.inkBounds[3]
        ]
      }))
    }, E = e.wordingMode === "oracle" ? 428 : 405, $ = e.wordingMode === "oracle" ? 590 : 602;
    return x.lines.some(
      (A) => A.inkBounds[1] < E || A.inkBounds[1] + A.inkBounds[3] > $
    ) ? k : x;
  }
  const g = Ue(c);
  if (!g) throw Error("Missing selected early typography request");
  const f = O(
    t,
    g.paragraphs,
    { ...g.bounds, x: g.bounds.x + 10.5, width: g.bounds.width - 10.5 },
    c.size,
    c.size,
    { ...g.typography, textWidth: n.denseWidth ?? 0.98 }
  );
  if (f.overflow) return c;
  const y = Math.max(g.bounds.y, c.top + (c.height - f.height) / 2 - 5) - f.top;
  return {
    ...f,
    top: f.top + y,
    lines: f.lines.map((p) => ({
      ...p,
      baseline: p.baseline + y,
      inkBounds: [p.inkBounds[0], p.inkBounds[1] + y, p.inkBounds[2], p.inkBounds[3]]
    }))
  };
}
const ft = {
  middleLift: 4,
  rightInset: 2,
  titleWidth: 1.06,
  typeWidth: 1.03
};
function en(t, e) {
  const r = e ? 310 : 356, n = e ? 384 : 430;
  return t <= 70 || t >= 620 ? t : t < r ? t - ft.middleLift * (t - 70) / (r - 70) : t <= n ? t - ft.middleLift : t - ft.middleLift * (620 - t) / (620 - n);
}
function Li(t, e, r) {
  const n = [0, 70, e ? 310 : 356, e ? 384 : 430, 620, 680];
  for (let o = 0; o < n.length - 1; o++) {
    const s = n[o], a = n[o + 1], i = en(s, e), l = en(a, e);
    t.save();
    try {
      t.beginPath(), t.rect(0, i, 488, l - i), t.clip(), t.translate(0, i), t.scale(1, (l - i) / (a - s)), t.translate(0, -s), r();
    } finally {
      t.restore();
    }
  }
}
const Fs = {
  m15: [0.95, 1],
  m19: [1.1, 1.085],
  m20: [1.1, 1.085],
  m21: [1.1, 1.085],
  war: [0.96, 1.05],
  c14: [0.94, 0.98],
  dom: [1.12, 0.98],
  soi: [1.055, 0.95],
  dft: [0.92, 0.975]
};
function X0(t) {
  const e = t?.toLowerCase() ?? "";
  return Object.hasOwn(Fs, e) ? Fs[e] : [1, 1];
}
function J0(t, e) {
  const { width: r, height: n } = t, o = "getContext" in t ? void 0 : B([r, n]);
  try {
    const s = o ?? t;
    if (!("getContext" in s)) throw Error("Mask canvas unavailable");
    const a = s.getContext("2d", { willReadFrequently: !0 });
    if (!a) throw Error("Mask extraction needs Canvas2D");
    o && a.drawImage(t, 0, 0);
    const i = a.getImageData(0, 0, r, n).data, l = new Uint8Array(r * n), d = e === "red" ? 0 : 3;
    for (let u = 0; u < n; u++)
      for (let h = 0; h < r; h++)
        l[(n - u - 1) * r + h] = i[(u * r + h) * 4 + d];
    return { width: r, height: n, rowOrder: "bottom-up", data: l };
  } finally {
    o && jr(o);
  }
}
function K0(t) {
  const e = ot(t)?.revision ?? null, r = bn(t.setCode)?.revision, n = ne(t);
  return r || n ? [
    "legacy-regional-v1",
    e,
    r ?? null,
    n ? "abu-outline-v3" : null,
    t.setCalibrationCandidate ?? null
  ] : ["set-profile-v1", e, t.setCalibrationCandidate ?? null];
}
function mt(t, e, r, n, o, s, a = "stats", i = () => o == null ? t.fillText(e, r, n) : t.fillText(e, r, n, o), l = (d) => t.measureText(d).width) {
  const d = a === "type" ? s?.typeLine : s?.stats;
  if (!d?.length) {
    i();
    return;
  }
  const u = l(e), h = u > 0 && o != null ? Math.min(1, o / u) : 1, m = u * h, c = t.textAlign === "right" || t.textAlign === "end" && t.direction !== "rtl" || t.textAlign === "start" && t.direction === "rtl", g = r - (t.textAlign === "center" ? m / 2 : c ? m : 0), f = a === "type" ? 1 : 0, b = (p, w, S) => {
    w <= p || S && s?.omitInk || (t.save(), t.beginPath(), t.rect(p, -1e4, w - p, 2e4), t.clip(), S && (t.fillStyle = S, t.shadowColor = "transparent"), i(), t.restore());
  };
  let y = -1e4;
  for (const p of d) {
    const w = Math.max(
      y,
      p.start === 0 ? -1e4 : g + l(e.slice(0, p.start)) * h - f
    ), S = p.end == null || p.end >= e.length ? 1e4 : g + l(e.slice(0, p.end)) * h + f;
    b(y, w), b(w, S, p.color), y = S;
  }
  b(y, 1e4);
}
const c1 = 1, Ei = Object.freeze([
  Object.freeze({
    id: "m21-modern",
    revision: 1,
    label: "Modern · M21 defaults",
    setCode: "M21",
    note: "Provisional transfer: shared source colors and outer border; other materials retain source colors."
  })
]);
function Bi(t) {
  if (!(t === "auto" || t === "printing" || t === "source") && !(t && typeof t == "object" && !Array.isArray(t) && Object.keys(t).length === 1 && Object.hasOwn(t, "profile") && Ei.some((e) => e.id === t.profile)))
    throw Error("Invalid printing calibration choice");
}
function me(t) {
  if (["split", "aftermath", "adventure", "prepare", "room", "flip"].includes(t.layout ?? "") && t.faces?.some(
    (r) => r.calibration !== void 0 && JSON.stringify(r.calibration) !== JSON.stringify(t.calibration)
  ))
    throw Error("Composite panels share one calibration policy; select it on the physical face.");
  if (t.calibration === void 0) return t;
  Bi(t.calibration);
  const e = t.calibration === "source" ? void 0 : "set-hsb-v1";
  return {
    ...t,
    colorCalibration: e,
    ...t.faces ? {
      faces: t.faces.map(
        (r) => me({
          ...r,
          calibration: r.calibration ?? t.calibration
        })
      )
    } : {}
  };
}
function Wt(t, e) {
  return t.setCode?.toLowerCase() === "plc" && t.frameAssetFamily === "eighth" && !t.frameTemplate && (!t.layout || t.layout === "normal") && (!t.borderColor || t.borderColor === "black") && e.startsWith(`${P}/img/frames/8th/`) && /^(?:[wubrgm]|colorshifted\/[wubrg])\.png$/.test(
    e.slice(`${P}/img/frames/8th/`.length)
  );
}
const oo = (t) => 244 + (t - 244) * 1.006 - 0.5, so = (t) => 340 + (t - 340) * 1.008 + 0.25;
function In([t, e, r, n]) {
  return [oo(t * 488) / 488, so(e * 680) / 680, r * 1.006, n * 1.008];
}
function V0([t, e, r, n], o) {
  const [s, a, i, l] = o ? [1.03, -0.5, 1.025, 2.5] : [1.005, 0.25, 1.005, 2.75];
  return [
    (407 + (t * 488 - 407) * s + a) / 488,
    (626 + (e * 680 - 626) * i + l) / 680,
    r * s,
    n * i
  ];
}
function $o(t, e, r = !1) {
  const [n, o, s, a] = r ? [21, 18.75, 467.5, 661] : [22, 22, 466, 658];
  t.save(), t.beginPath(), t.rect(0, 0, 488, 680), t.rect(n, o, s - n, a - o), t.clip("evenodd"), t.drawImage(e, 0, 0, 488, 680), t.restore();
  const i = [22, 28, 460, 466], l = [22, 28, 638, 658], d = [n, oo(28), oo(460), s], u = [o, so(28), so(638), a];
  for (let h = 0; h < l.length - 1; h++)
    for (let m = 0; m < i.length - 1; m++) {
      const c = i[m], g = l[h], f = d[m], b = u[h];
      t.drawImage(
        e,
        c / 488 * e.width,
        g / 680 * e.height,
        (i[m + 1] - c) / 488 * e.width,
        (l[h + 1] - g) / 680 * e.height,
        f,
        b,
        d[m + 1] - f,
        u[h + 1] - b
      );
    }
}
const Z0 = /* @__PURE__ */ new Set(["artist", "legal", "collector", "manaCost", "setSymbol"]);
function Ii(t) {
  if (t.printingElements !== void 0) {
    if (!t.printingElements || typeof t.printingElements != "object" || Array.isArray(t.printingElements))
      throw Error("Printing elements must be an object");
    if (Object.keys(t.printingElements).length) {
      if (t.faces?.length || t.layout && !["normal", "token"].includes(t.layout) || t.frameTemplate && t.frameTemplate !== "future" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
        throw Error("Printing element controls require an ordinary face or Futureshifted template.");
      for (const [e, r] of Object.entries(t.printingElements)) {
        if (!Z0.has(e) || !r || typeof r != "object" || Array.isArray(r))
          throw Error("Invalid printing element");
        for (const n of Object.keys(r))
          if (!["hidden", "offset"].includes(n)) throw Error("Unknown printing element option");
        if (r.hidden !== void 0 && typeof r.hidden != "boolean")
          throw Error("Invalid element visibility");
        if (r.offset !== void 0 && (!Array.isArray(r.offset) || r.offset.length !== 2 || !r.offset.every((n) => Number.isFinite(n) && Math.abs(n) <= 100)))
          throw Error("Printing offset must be within 100 reference pixels");
      }
    }
  }
}
function Y(t, e, r, n) {
  const o = e.printingElements?.[r];
  if (!o?.hidden) {
    if (!o?.offset) return n();
    t.save();
    try {
      t.translate(...o.offset), n();
    } finally {
      t.restore();
    }
  }
}
const Oi = {
  plc: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 165 },
  fut: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 180 },
  "8ed": { legal: "™ & © 1993–2003 Wizards of the Coast, Inc.", total: 350 },
  m15: { legal: "™ & © 2014 Wizards of the Coast", total: 269 },
  war: { legal: "™ & © 2019 Wizards of the Coast", total: 264 },
  m21: { legal: "™ & © 2020 Wizards of the Coast", total: 274 },
  fdn: { legal: "™ & © 2024 Wizards of the Coast", format: "rarity-first" }
};
function Go(t) {
  return t.printingElements?.legal?.hidden ? null : t.legalText === void 0 ? Oi[t.setCode?.toLowerCase() ?? ""]?.legal ?? null : t.legalText;
}
function Po(t, e = !0) {
  if (t.printingElements?.collector?.hidden) return "";
  const r = t.collectorNumber?.trim();
  if (!r) return "";
  const n = Oi[t.setCode?.toLowerCase() ?? ""], o = t.collectorFormat ?? n?.format ?? "number-first", s = /^Basic (?:Snow )?Land\b/.test(t.typeLine ?? "") ? "L" : (t.rarity ?? "common")[0].toUpperCase();
  if (e && o === "rarity-first")
    return `${s} ${r.split("/")[0].replace(/^(\d+)/, (u) => u.padStart(4, "0"))}`;
  const a = /^\d+$/.test(r), i = e && a ? r.padStart(3, "0") : r, l = t.collectorTotal === void 0 ? n?.total : t.collectorTotal, d = l && a && Number(r) <= l ? `${i}/${l}` : i;
  return e ? `${d} ${s}` : d;
}
function lt() {
  const t = typeof document < "u" ? document.fonts : globalThis.fonts;
  if (!t) throw Error("Card fonts require a document or worker FontFaceSet");
  return t;
}
function $i(t, e) {
  return Wt(t, e) ? "CardRenderer MTG ModMatrix" : void 0;
}
function _s(t, e) {
  if (!e.includes("*")) {
    t.fillText(e, 407, 627, 78);
    return;
  }
  t.save();
  const r = t.measureText(e).width;
  t.translate(407, 0), t.scale(Math.min(1, 78 / r), 1), t.textAlign = "left";
  let n = "";
  for (const o of e.split(/(\*)/).filter(Boolean)) {
    const s = -r / 2 + t.measureText(n).width;
    if (o === "*") {
      const a = t.measureText(o), i = s + (a.actualBoundingBoxRight - a.actualBoundingBoxLeft) / 2, l = 627 + (a.actualBoundingBoxDescent - a.actualBoundingBoxAscent) / 2;
      t.save(), t.translate(i, l + 1.25), t.scale(0.775, 0.775), t.translate(-i, -l), t.fillText(o, s, 627), t.restore();
    } else t.fillText(o, s, 627);
    n += o;
  }
  t.restore();
}
function On(t, e, r, n) {
  if (!Wt(e, r)) return;
  const [o, s, a, i, l, d] = n === "artist" ? [77, 634, -1, 3.25, 0.995, 1] : n === "legal" ? [36.5, 647, 4.5, 4.75, 0.995, 1.1] : [407, 627, 2, -2.25, 1.03, 1.01];
  t.translate(o + a, s + i), t.scale(l * d, l), t.translate(-o, -s);
}
let Us = null;
function Q0(t, e) {
  const r = $i(t, e);
  return !r || t.power == null || t.toughness == null ? Promise.resolve() : Us ??= lt().load(`700 29px "${r}"`).then((n) => {
    if (!n.length || n.some((o) => o.status !== "loaded"))
      throw Error("Planar Chaos P/T needs card-glint/magic/fonts.css.");
  }).catch((n) => {
    throw Us = null, n;
  });
}
function Gi(t) {
  return ["B", "Colourless", "Land"].includes(j(t).boxes);
}
function Pi(t) {
  return t.frameAssetFamily !== "eighth" || !t.artist ? null : `${P}/img/manaSymbols/${Gi(t) ? "whitebrush" : "brush"}.svg`;
}
function js(t, e) {
  if (!e.includes("*")) {
    t.fillText(e, 407, 627, 78);
    return;
  }
  const r = e.split(/(\*)/).filter(Boolean), n = r.map((a) => a === "*" ? 15 : t.measureText(a).width), o = n.reduce((a, i) => a + i, 0);
  t.save(), t.translate(407, 0), t.scale(Math.min(1, 78 / o), 1), t.textAlign = "left";
  let s = -o / 2;
  for (const [a, i] of r.entries()) {
    if (i === "*") {
      t.beginPath();
      for (let l = 0; l < 10; l++) {
        const d = -Math.PI / 2 + l * Math.PI / 5, u = l % 2 ? 3.1 : 7.5, h = s + 7.5 + u * Math.cos(d), m = 622 + u * Math.sin(d);
        l === 0 ? t.moveTo(h, m) : t.lineTo(h, m);
      }
      t.closePath(), t.fill();
    } else t.fillText(i, s, 627);
    s += n[a];
  }
  t.restore();
}
function tu(t, e, r, n = "") {
  if (t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.letterSpacing = "0px", e.power != null && e.toughness != null) {
    t.save(), On(t, e, n, "stats");
    const h = e.frameTreatment === "colorshifted";
    t.fillStyle = h ? "#fff" : "#17140f", h && (t.shadowColor = "#000", t.shadowOffsetX = -21e-4 * 488, t.shadowOffsetY = 15e-4 * 680);
    const m = $i(e, n);
    t.font = `700 29px "${m ?? "CardRenderer MTG Matrix Small Caps"}", Georgia`, t.textAlign = "center", t.textBaseline = "middle";
    const c = `${e.power}/${e.toughness}`;
    if (e.textInk?.stats?.length) {
      const g = m ? void 0 : (f) => f.split(/(\*)/).reduce((b, y) => b + (y === "*" ? 15 : t.measureText(y).width), 0);
      mt(
        t,
        c,
        407,
        0,
        78,
        e.textInk,
        "stats",
        () => {
          m ? _s(t, c) : js(t, c);
        },
        g
      );
    } else m ? _s(t, c) : js(t, c);
    t.restore();
  }
  const o = e.setCode?.toLowerCase(), s = o === "8ed" ? 75 : o === "9ed" ? 79 : 77, a = o === "8ed" || o === "9ed", i = a ? 633 : 634;
  t.fillStyle = Gi(e) ? "#fff" : "#17140f", t.textBaseline = "alphabetic", t.textAlign = "left";
  const l = Pi(e);
  Y(t, e, "artist", () => {
    if (l) {
      t.save(), On(t, e, n, "artist");
      const h = r.get(l);
      if (!h) throw Error(`Eighth Edition artist brush unavailable: ${l}`);
      t.drawImage(h, 36.5, i - 10, s - 39, 13.5), t.font = `700 ${a ? 17.5 : 18}px "CardRenderer MTG Matrix", Georgia`;
      const m = e.power != null && e.toughness != null ? 350 : 448;
      t.fillText(e.artist, s, i, m - s), t.restore();
    }
  });
  const d = Go(e), u = Po(e, !1);
  if (t.save(), On(t, e, n, "legal"), t.font = '10px "CardRenderer MTG MPlantin", Georgia', !e.printingElements?.collector?.offset && !e.printingElements?.legal?.offset) {
    const h = [d, u].filter(Boolean).join(" ");
    h && t.fillText(h, 36.5, i + 13, 409);
  } else {
    const h = [d, u].filter(Boolean).join(" "), m = Math.min(1, 409 / Math.max(1, t.measureText(h).width));
    t.translate(36.5, i + 13);
    const c = (g, f) => {
      t.save(), t.scale(m, 1), t.fillText(g, f, 0), t.restore();
    };
    d && Y(t, e, "legal", () => c(d, 0)), u && Y(
      t,
      e,
      "collector",
      () => c(u, t.measureText(d ? d + " " : "").width)
    );
  }
  t.restore(), t.restore();
}
function Wo(t, e) {
  const r = Mr(t)?.toLowerCase();
  return t.setCode?.toLowerCase() === "8ed" && t.frameAssetFamily === "eighth" && !t.frameTemplate && (!t.layout || t.layout === "normal") && (!t.borderColor || t.borderColor === "white") && (t.frameColors === void 0 || t.frameColors.length === 1 && t.frameColors[0]?.toLowerCase() === r) && !!r && e === `${P}/img/frames/8th/${r}l.png`;
}
const ao = (t) => 244 + (t - 244) * 1.004 - 1.25, io = (t) => 340 + (t - 340) * 1.005 - 0.5;
function eu([t, e, r, n]) {
  return [ao(t * 488) / 488, io(e * 680) / 680, r * 1.004, n * 1.005];
}
function ru(t, e) {
  t.save(), t.beginPath(), t.rect(0, 0, 488, 680), t.rect(22, 22, 444, 636), t.clip("evenodd"), t.drawImage(e, 0, 0, 488, 680), t.restore();
  const r = [22, 28, 460, 466], n = [22, 28, 624, 658], o = [22, ao(28), ao(460), 466], s = [22, io(28), io(624), 658];
  for (let a = 0; a < n.length - 1; a++)
    for (let i = 0; i < r.length - 1; i++) {
      const l = r[i], d = n[a], u = o[i], h = s[a];
      t.drawImage(
        e,
        l / 488 * e.width,
        d / 680 * e.height,
        (r[i + 1] - l) / 488 * e.width,
        (n[a + 1] - d) / 680 * e.height,
        u,
        h,
        o[i + 1] - u,
        s[a + 1] - h
      );
    }
}
const nu = {
  w: [22 / 255, 24 / 255, 18 / 255],
  u: [21 / 255, 25 / 255, 31 / 255],
  b: [3 / 255, 7 / 255, 14 / 255],
  r: [31 / 255, 25 / 255, 24 / 255],
  g: [16 / 255, 18 / 255, 21 / 255]
};
function tr(t, e) {
  return t.colorCalibration === "set-hsb-v1" && t.frameTreatment === "colorshifted" && e.includes("/colorshifted/") && Wt(t, e) ? "#181510" : void 0;
}
function ou(t, e) {
  if (!tr(t, e)) return;
  const r = e.split("/").at(-1)?.replace(".png", ""), n = r && nu[r];
  return n ? {
    lift: n,
    transition: 96 / 255,
    ...eo[r].knots.length ? {
      textureMaskSource: `${P}/img/frames/8th/frame.png`,
      texture: eo[r].knots.map(
        ([o, s]) => [o / 255, [s[0] / 255, s[1] / 255, s[2] / 255]]
      )
    } : {}
  } : void 0;
}
function lo(t, e) {
  if (!tr(t, e)) return;
  const r = e.split("/").at(-1)?.replace(".png", ""), n = r && eo[r];
  return n ? {
    maskSource: `${P}/img/frames/8th/pinline.png`,
    outerMaskSource: `${P}/img/frames/8th/frame.png`,
    outset: 7 / 488,
    backdrop: [
      n.bevel.backdrop[0] / 255,
      n.bevel.backdrop[1] / 255,
      n.bevel.backdrop[2] / 255
    ],
    amount: n.bevel.amount
  } : void 0;
}
function xt(t) {
  const e = t.frameTreatment === "colorshifted";
  if (e && t.frameAssetFamily !== "eighth")
    throw Error("Colorshifted treatment requires the eighth frame family.");
  if (!t.frameAssetFamily || ["split", "aftermath"].includes(t.layout ?? "") && t.faces?.length === 2) return null;
  if (dt(t) || t.layout && !["normal", "token"].includes(t.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
    throw Error("Replacement frame plates currently support ordinary modern faces only.");
  const r = t.frameAssetFamily === "eighth", n = j(t), o = Mr(t), s = t.frameColors === void 0 && o ? [o] : F(t), a = s.length === 2 && "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 ? [...s].reverse() : s, i = r ? "8th" : "m15/new", l = `${P}/img/frames/${i}${e ? "/colorshifted" : ""}`, d = n.land ? "l" : n.artifact ? "a" : /\bVehicle\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "v" : s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c";
  if (e && !["w", "u", "b", "r", "g", "a"].includes(d))
    throw Error("Colorshifted plates support monocolored spells and artifacts only.");
  const u = (v) => r ? `${v.toLowerCase()}l` : `l${v.toLowerCase()}`, h = n.land && a.length ? u(a.length > 2 ? "m" : a[0]) : d, m = n.land && a.length === 2 ? u(a[1]) : void 0, c = d === "l" ? r ? "l" : "c" : d, g = r ? [0.09, 0.0629, 0.824, 0.0429] : [168 / 2010, 145 / 2814, 0.8292, 0.0543], f = r ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358] : [168 / 2010, 1588 / 2814, 0.8292, 0.0543], b = e ? [0.7234, 0.881, 0.204, 0.0772] : r ? [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814] : [0.7573, 0.8848, 0.188, 0.0733], y = `${l}/${h}.png`, p = Wo(t, y), w = Wt(t, y), S = (v) => p ? eu(v) : w ? In(v) : v;
  return {
    frame: y,
    rightFrame: m ? `${l}/${m}.png` : void 0,
    pinlines: w && !e && d === "m" && s.length === 2 ? {
      left: `${l}/${a[0].toLowerCase()}.png`,
      right: `${l}/${a[1].toLowerCase()}.png`,
      mask: `${l}/pinline.png`
    } : void 0,
    border: `${P}/img/frames/${i}/border.png`,
    pt: e ? `${P}/img/frames/m15/colorshifted/${c}pt.png` : r ? `${P}/img/frames/8th/pt/${c === "c" ? "l" : c}.png` : `${P}/img/frames/m15/regular/m15PT${c.toUpperCase()}.png`,
    rects: {
      ...V,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title: w ? In(g) : g,
      type: w ? In(f) : f,
      art: r ? S([180 / 2010, 341 / 2814, 1656 / 2010, 1216 / 2814]) : [0.0767, 0.1129, 0.8476, 0.4429],
      rules: r ? S([205 / 2010, 1779 / 2814, 1596 / 2010, 729 / 2814]) : [0.086, 1780 / 2814, 0.828, 0.2875],
      stats: w ? V0(b, e) : b,
      footer: r ? [150 / 2010, 1938 / 2100, 0.81, 0.04] : V.footer
    },
    titleSize: r ? 29.2 : 26,
    typeSize: r ? 24.3 : 22,
    // Shared family adjustments measured after frame-only scan normalization.
    // Cost discs have their own baseline; they do not follow font centering.
    mana: {
      right: (r ? 0.9147 : 1864 / 2010) - (r ? 2 : 1) / 488,
      center: g[1] + g[3] / 2 + (r ? 1 : -4) / 680,
      size: r ? 22 : 23.4,
      gap: 1.5
    },
    symbol: r ? { right: 0.9079 - 2 / 488, center: 0.5886, width: 0.114, height: 0.0391 * 0.95 } : { right: 1862 / 2010 - 2 / 488, center: 0.591, width: 0.114, height: 0.041 * 0.95 }
  };
}
function su(t) {
  const e = xt(t);
  if (!e) return null;
  const r = Pi(t), n = wn(t), o = lo(t, e.frame);
  return [
    ...n ? [n] : [],
    ...o ? [o.maskSource, o.outerMaskSource] : [],
    ...r ? [r] : [],
    e.frame,
    ...e.rightFrame ? [e.rightFrame] : [],
    ...e.pinlines ? Object.values(e.pinlines) : [],
    ...t.power != null && t.toughness != null ? [e.pt] : [],
    ...Pt(t.setCode, t.borderColor).border !== "#090806" || t.frameAssetFamily === "m15-accurate" && t.calibration !== void 0 && t.calibration !== "source" && t.calibration !== "printing" || tr(t, e.frame) || wr(t) ? [e.border] : []
  ];
}
const au = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", vr = {
  artInset: 3,
  artRim: 0.75,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function Fo(t) {
  if (!t.frameAssetFamily && !j(t).legendary && (t.layout ?? "normal") === "normal" && ze === au) {
    const e = t.borderColor ?? (Pt(t.setCode).border === "#eeedeb" ? "white" : "black"), r = `${t.setCode?.toLowerCase() ?? ""}/${e}`;
    if (Object.hasOwn(Es, r)) return Es[r];
  }
  return ["m15", "m19", "m20", "war"].includes(t.setCode?.toLowerCase() ?? "") ? vr.frameInset : 0;
}
function iu(t) {
  const e = Fo(t), r = V.frame[0] * T, n = V.frame[2] * T, o = V.art[0] * T + vr.artInset, s = r + e + (o - r) * (1 - 2 * e / n), a = vr.artRim;
  return [
    s / T,
    V.art[1] + a / L,
    1 - 2 * s / T,
    V.art[3] - 2 * a / L
  ];
}
function _o(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !["lea", "leb", "3ed", "leg", "8ed", "m21"].includes(e) || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = Lt(t);
  if (dt(t)) {
    if (ne(t) || St(t)) return;
    const a = Qt(t), i = xr(t);
    return {
      key: `${e}/${r}/retro/${a.split("/").at(-1)}`,
      family: "retro",
      frame: a,
      rect: i,
      assets: { frame: a },
      source: JSON.stringify([a, i])
    };
  }
  const n = xt(t);
  if (n)
    return n.rightFrame ? void 0 : {
      key: `${e}/${r}/${t.frameAssetFamily}/${n.frame.split("/").at(-1)}`,
      family: "plate",
      frame: n.frame,
      rect: n.rects.frame,
      assets: { frame: n.frame, pt: n.pt },
      source: JSON.stringify([n.frame, n.rects])
    };
  const o = j(t);
  if (o.land) return;
  const s = he(o);
  return {
    key: `${e}/${r}/components/${o.boxes}/${o.frame}`,
    family: "components",
    frame: s.frame,
    rect: V.frame,
    assets: s,
    source: JSON.stringify([s, V.frame, Fo(t)])
  };
}
const lu = {
  kind: "polygon",
  feather: 2 / 744,
  points: [
    [65.5, 651.5],
    [678, 651.5],
    [680, 660],
    [682, 675],
    [686, 700],
    [689, 725],
    [691, 750],
    [692, 775],
    [691, 800],
    [690, 825],
    [687, 850],
    [683, 875],
    [677, 900],
    [668.5, 919.5],
    [568, 919.5],
    [566.5, 922.5],
    [74.5, 922.5],
    [73.5, 920],
    [66.5, 900],
    [60.5, 875],
    [55.5, 850],
    [53, 825],
    [51.5, 800],
    [51, 775],
    [51.5, 750],
    [54, 725],
    [57, 700],
    [60.5, 675],
    [63.5, 660]
  ].map(([t, e]) => [t / 744, e / 1039])
}, Wi = (t) => ({
  kind: "polygon",
  feather: 2 / 744,
  points: t.map(([e, r]) => [e / 744, r / 1039])
}), du = Wi([
  [87, 118],
  [92, 100],
  [104, 79],
  [120, 62],
  [135, 51],
  [149, 44],
  [681, 44],
  [689, 47],
  [693, 54],
  [693, 118]
]), uu = Wi([
  [74, 582],
  [677, 582],
  [688, 590],
  [696, 605],
  [705, 615],
  [705, 628],
  [696, 642],
  [682, 650],
  [82, 650]
]), hu = { title: [1, 1, 1], type: [1, 1, 1], stats: [1.0297029702970297, 1.0088832487309645, 1.0299401197604792] }, mu = { title: [0.9047619047619047, 0.9276018099547512, 0.9518072289156626], type: [1.4015151515151516, 1.0086206896551724, 0.9087837837837838], stats: [1.5, 1.1030927835051547, 1.0265624999999998] }, cu = { title: [0.736842105263158, 0.8620689655172413, 1.03125], type: [0.6666666666666666, 0.8181818181818182, 1.0740740740740742], stats: [0.8936170212765957, 1.0612244897959184, 1.146551724137931] }, gu = { title: [1.0038560411311055, 0.9704301075268819, 1.1162790697674418], type: [0.9128989361702128, 0.9044117647058825, 1.1458333333333335], stats: null }, fu = { title: [1.2035714285714287, 1.03, 1.0040322580645162], type: [1.494318181818182, 1.0045731707317074, 1.1860465116279069], stats: [1.5, 1.1079545454545454, 1.276595744680851] }, pu = { title: [0.8410958904109589, 0.8910614525139665, 0.9060773480662984], type: [1, 1, 1], stats: null }, bu = {
  W: hu,
  U: mu,
  B: cu,
  R: gu,
  G: fu,
  A: pu
}, Ds = `${z.CONJURER_ROOT}/img/frames/future/regular`, Uo = z.MSE_TEMPLATE_ROOT, It = `${Uo}/magic-future.mse-style`, Or = `${Uo}/magic-future-textless.mse-style`;
function pt(t) {
  return t.futureTreatment ?? "regular";
}
function Fi(t) {
  if ((t.manaSymbols?.length || 0) > 6)
    throw Error("Futureshifted cost exceeds the six source positions");
  if (ee(t), pt(t) === "full-art" && (t.rulesParagraphs?.some((e) => e.runs.some((r) => r.text.trim())) || !t.rulesParagraphs && t.rulesText?.trim()))
    throw Error("Futureshifted full-art treatment has no rules panel for the supplied wording");
}
function _i(t) {
  const e = F(t);
  return e.join("") === "WG" ? ["G", "W"] : e.join("") === "WR" ? ["R", "W"] : e;
}
function ee(t) {
  const e = j(t), r = _i(t), n = pt(t), o = n === "full-art", s = e.land && !o, a = n === "regular" && !s && !e.artifact && r.length === 0, i = s || a, l = r.length > 1 ? "M" : r[0] ?? (e.artifact ? "A" : "C"), d = (r[0]?.toLowerCase() ?? "c") + "l", u = s && r.length === 2, h = (r[1]?.toLowerCase() ?? "c") + "l", m = t.power != null && t.toughness != null;
  if (o && !/^[WUBRG]$/.test(l))
    throw Error("Futureshifted full-art plates require one printed frame color");
  const c = ["U", "B", "R", "G"].includes(l) && !(s && u), g = t.canonicalTypeLine ?? t.typeLine ?? "", f = [
    "Artifact",
    "Creature",
    "Enchantment",
    "Instant",
    "Land",
    "Planeswalker",
    "Sorcery"
  ].filter((p) => new RegExp(`\\b${p}\\b`).test(g));
  /\b(?:Tribal|Kindred)\b/.test(g) && f.push("Tribal");
  const b = f.length > 1 ? "multitype" : f[0]?.toLowerCase(), y = s ? ["U", "B", "R", "G"].includes(r[0] ?? "") : c;
  return {
    kind: "future",
    base: o ? `${Or}/${l.toLowerCase()}card.jpg` : i ? `${It}/${a ? "c" : d}card.jpg` : `${Ds}/futureFrame${l}.png`,
    ...o ? { mask: `${Or}/mask_image.png` } : {},
    ...i ? {
      mask: `${It}/mask_image.png`,
      paper: `${It}/${a ? "c" : e.creature ? l.toLowerCase() : d}textbox.png`,
      type: `${It}/${a ? "c" : d}typeline.png`
    } : {},
    ...u ? {
      reverseBase: `${It}/${h}card.jpg`,
      reversePaper: `${It}/${h}textbox.png`,
      reverseType: `${It}/${h}typeline.png`,
      neutralBase: `${It}/clcard.jpg`,
      neutralType: `${It}/cltypeline.png`,
      baseBlend: `${It}/hybrid_blend_card.png`,
      typeBlend: `${It}/hybrid_blend_typeline.png`
    } : {},
    ...m ? {
      stats: o ? `${Or}/${l.toLowerCase()}pt.jpg` : i ? `${It}/${a ? "c" : d}pt.png` : `${Ds}/futurePT${l}.png`,
      ...o ? { statsMask: `${Or}/mask_pt.png` } : {}
    } : {},
    ...b ? {
      typeSymbol: `${Uo}/magic-future-common.mse-include/${b}_${y ? "white" : "black"}.png`
    } : {},
    ...t.artist ? {
      brush: `${z.CONJURER_ROOT}/img/manaSymbols/${s || c ? "whitebrush" : "brush"}.svg`
    } : {}
  };
}
function jo(t) {
  const e = pt(t), r = e === "full-art";
  return {
    art: r ? [32, 83, 433, 476] : e === "clear" || t.artPlacement?.mode === "behind-text" ? [23, 22, 442, 637] : [32, 83, 433, 297],
    title: [86, 32, 360, 43],
    type: [59, r ? 560 : 382, 367, 40],
    rules: [50, 433, 393, 166],
    stats: [377, 609, 69, 40],
    symbol: [431, r ? 571 : 389, 29, 29],
    footer: [38, 611, 404, 35]
  };
}
const yu = { frame: [0.9187500000000002, 0.9229729729729731, 1.1260000000000001], title: [0.8812095032397409, 0.8817567567567567, 0.9481792717086837], type: [1.0465277777777777, 1.0163352272727273, 1.1097770154373927], stats: [0.9004329004329005, 0.8952702702702703, 0.9717514124293787] }, wu = { frame: [0.6021739130434783, 0.7878787878787878, 0.9531772575250836], title: [0.59375, 0.8760683760683762, 0.8777777777777778], type: [0.6702898550724639, 0.9859550561797753, 1.0846774193548387], stats: [0.7395209580838322, 0.8991596638655462, 0.8878378378378378] }, Su = { frame: [0.8851981351981352, 0.9510309278350517, 0.9543269230769231], title: [0.9145199063231849, 1.0140449438202248, 1.1162790697674418], type: [1.0811023622047244, 0.9044117647058825, 0.7366071428571429], stats: [0.9608294930875576, 1.0552486187845302, 1.180722891566265] }, vu = { frame: [1, 1, 1], title: [0.9573863636363638, 1.03, 1.3833333333333333], type: [1, 1, 1], stats: [0.9746835443037973, 1.0483870967741935, 1.5] }, Cu = {
  W: yu,
  U: wu,
  R: Su,
  G: vu
}, Do = (t, e = 375, r = 527) => ({
  kind: "polygon",
  feather: 1 / e,
  points: t.map(([n, o]) => [n / e, o / r])
}), ku = Do([
  [44, 60],
  [52, 42],
  [66, 29],
  [75, 26],
  [344, 26],
  [347, 29],
  [347, 60]
]), Tu = Do([
  [43, 438],
  [337, 438],
  [341, 443],
  [336, 448],
  [335, 458],
  [339, 466],
  [43, 466]
]), Mu = Do(
  [
    [12, 16],
    [64, 16],
    [64, 35],
    [60, 42],
    [12, 42]
  ],
  78,
  51
), Ru = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, Be = (t) => ({
  hueDegrees: 0,
  saturationScale: 1,
  brightnessScale: 1,
  rgbScale: t
});
function xu(t) {
  const e = ee(t);
  for (const [r, n] of Object.entries(Cu)) {
    const o = z.MSE_TEMPLATE_ROOT + "/magic-future-textless.mse-style/";
    if (e.base === o + r.toLowerCase() + "card.jpg")
      return {
        [e.base]: {
          frame: Be([1, 1, 1]),
          paper: Be(n.frame),
          mask: Ru,
          regions: [
            { mask: ku, adjustment: Be(n.title) },
            { mask: Tu, adjustment: Be(n.type) }
          ]
        },
        ...e.stats ? {
          [e.stats]: { frame: Be(n.frame), paper: Be(n.stats), mask: Mu }
        } : {}
      };
  }
  return {};
}
const Au = { frame: { hueDegrees: 8, saturationScale: 0.6137499999999998, brightnessScale: 1.25 }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.1482558139534884, 1.111280487804878, 1.3] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.0692640692640691, 1.036873156342183, 1.1861510791366907] } }, Lu = { W: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8366228070175439, 0.786036036036036, 0.7373737373737373] }, G: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.4, 1.4, 1.4] } }, Eu = { frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6, 0.6, 0.6] }, paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8893905191873589, 0.8839285714285715, 0.9282511210762332] }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.947089947089947, 0.9388297872340424, 1.0242587601078168] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6957070707070706, 0.6905370843989771, 0.7095046854082999] } }, Ie = {
  land: Au,
  paper: Lu,
  colorless: Eu
}, $r = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Ui = (t) => ({
  kind: "polygon",
  feather: 1 / 339,
  points: t.map(([e, r]) => [e / 339, r / 464])
}), Bu = Ui([
  [26, 43],
  [34, 25],
  [48, 12],
  [57, 9],
  [326, 9],
  [329, 12],
  [329, 43]
]), Iu = Ui([
  [12, 277],
  [319, 277],
  [330, 285],
  [337, 294],
  [330, 310],
  [319, 314],
  [20, 314]
]), Ou = {
  kind: "rect",
  rect: [20 / 375, 470 / 527, 338 / 375, 40 / 527],
  feather: 1 / 375
}, $u = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, Gu = {
  kind: "polygon",
  feather: 1 / 375,
  points: [
    [35, 323],
    [344, 323],
    [348, 340],
    [351, 360],
    [350, 390],
    [350, 420],
    [349, 430],
    [345, 450],
    [342, 466],
    [38, 466],
    [32, 450],
    [29, 430],
    [26, 410],
    [26, 380],
    [28, 360],
    [31, 340]
  ].map(([t, e]) => [t / 375, e / 527])
}, ar = (t) => ({
  ...t,
  rgbScale: t.rgbScale
});
function Pu(t) {
  const e = ee(t), r = It + "/";
  if (!e.base.startsWith(r)) return {};
  const n = e.base === r + "ccard.jpg", o = {}, s = n ? Ie.colorless : Ie.land;
  for (const a of [e.base, e.reverseBase, e.neutralBase])
    a && (o[a] = n ? {
      frame: $r,
      paper: ar(Ie.colorless.frame),
      mask: $u,
      regions: [{ mask: Gu, adjustment: $r }]
    } : { frame: $r, paper: Ie.land.frame, mask: Ou });
  for (const a of [e.type, e.reverseType, e.neutralType])
    a === r + (n ? "c" : "cl") + "typeline.png" && (o[a] = {
      frame: $r,
      paper: ar(s.title),
      mask: Bu,
      regions: [{ mask: Iu, adjustment: ar(s.type) }]
    });
  for (const a of [e.paper, e.reversePaper])
    if (a)
      if (n) o[a] = ar(Ie.colorless.paper);
      else
        for (const [i, l] of Object.entries(Ie.paper))
          a === r + i.toLowerCase() + "ltextbox.png" && (o[a] = ar(l));
  return o;
}
const Wu = {
  A: {
    frame: {
      hueDegrees: -6.794165580182494,
      saturationScale: 0.7130415909549775,
      brightnessScale: 1.083617747440273
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9201680672268907, 0.9121338912133891, 0.9253112033195021]
    }
  },
  W: {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9244897959183672, 0.9248971193415638, 0.93125]
    }
  },
  U: {
    frame: {
      hueDegrees: 0,
      saturationScale: 1.0931250000000001,
      brightnessScale: 0.8931249999999998
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8502155172413793, 0.8613445378151261, 0.9300411522633745]
    }
  },
  B: {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1.0137500000000002 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8750000000000001, 0.8459821428571429, 0.8392857142857143]
    }
  },
  R: {
    frame: { hueDegrees: -4.625, saturationScale: 1.0362500000000012, brightnessScale: 1.065625 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9385245901639344, 0.8853161843515541, 0.84070796460177]
    }
  },
  G: {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8961038961038961, 0.9102564102564102, 0.8887061403508772]
    }
  }
};
function Fu(t) {
  if (t.frameTemplate !== "future" || t.setCode?.toLowerCase() !== "fut" || t.colorCalibration !== "set-hsb-v1")
    return {};
  if (pt(t) === "full-art") return xu(t);
  if (pt(t) !== "regular") return {};
  const e = ee(t).base;
  for (const [r, n] of Object.entries(Wu))
    if (e === z.CONJURER_ROOT + "/img/frames/future/regular/futureFrame" + r + ".png") {
      const o = bu[r], s = (i) => ({
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        rgbScale: i
      }), a = ee(t).stats;
      return {
        [e]: {
          ...n,
          mask: lu,
          regions: [
            { mask: du, adjustment: s(o.title) },
            { mask: uu, adjustment: s(o.type) }
          ]
        },
        ...a && o.stats ? { [a]: s(o.stats) } : {}
      };
    }
  return Pu(t);
}
const ji = (t) => ({
  kind: "polygon",
  points: t.map(([e, r]) => [e / 488, r / 680]),
  feather: 0.75 / 488
}), _u = ji([
  [43, 41],
  [445, 41],
  [449, 48],
  [450, 58],
  [446, 72],
  [42, 72],
  [38, 64],
  [37, 54],
  [39, 46]
]), Uu = ji([
  [43, 388],
  [445, 388],
  [449, 395],
  [450, 402],
  [446, 414],
  [42, 414],
  [38, 407],
  [37, 399],
  [39, 392]
]);
function ju(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.colorCalibration !== "set-hsb-v1" || t.frameTemplate || t.layout && t.layout !== "normal")
    return {};
  const e = xt(t);
  if (!e || !Wt(t, e.frame)) return {};
  const r = ou(t, e.frame), n = Object.entries(Is).find(([, l]) => l.source === e.frame);
  if (!n)
    return r ? {
      [e.frame]: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        blackPoint: r,
        blend: lo(t, e.frame)
      }
    } : {};
  const [o, s] = n, a = o.endsWith("/W") || o.endsWith("/M") ? 615 : 610, i = {
    [e.frame]: {
      blackPoint: r,
      blend: lo(t, e.frame),
      frame: s.frame,
      paper: s.paper,
      mask: {
        kind: "rect",
        rect: [41 / 488, 425 / 680, 405 / 488, (a - 425) / 680],
        feather: 0.75 / 488
      },
      regions: [
        { mask: _u, adjustment: s.title },
        { mask: Uu, adjustment: s.type }
      ]
    }
  };
  for (const l of e.pinlines ? [e.pinlines.left, e.pinlines.right] : []) {
    const d = Object.values(Is).find((u) => u.source === l);
    d && (i[l] = d.frame);
  }
  return i;
}
function No(t) {
  if (t.colorCalibration !== "set-hsb-v1") return;
  const e = Qe(t);
  if (!e) return;
  const r = m0[`${t.setCode?.toLowerCase()}/${e.material}`];
  if (r?.source === JSON.stringify([e.asset, e.frame]))
    return { materials: { [e.asset]: r.adjustment }, stock: r.stock };
}
function zo(t) {
  if (t.colorCalibration !== "set-hsb-v1") return;
  const e = ht(t);
  if (!e) return;
  if (e.dual)
    return {
      materials: e.dual.materials,
      stock: ot(t).dualLand.stock
    };
  const r = ot(t).colors[e.profile.split("/")[1]];
  if (r?.source === JSON.stringify([e.asset, e.frame]))
    return { materials: { [e.asset]: r.adjustment }, stock: r.stock };
}
function xe(t) {
  if (t.frameTemplate) return !1;
  const e = ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  return (dt(t) || !!_o(t)) && (!t.layout || t.layout === "normal") && (t.colorCalibration === "set-hsb-v1" || e && t.colorCalibration === "early-hsb-v1");
}
function Du(t) {
  if (!xe(t) || !dt(t) || ne(t)) return;
  const e = Qt(t), r = e.split("/").at(-1).replace(".png", "").toUpperCase(), n = o0[`${t.setCode?.toLowerCase()}-${Lt(t)}-${r}`];
  if (!(n?.asset !== e || !n.rect.every((o, s) => o === xr(t)[s])))
    return e.endsWith("/old/fourth/w.png") ? {
      ...n.adjustment,
      mask: {
        kind: "rect",
        rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
        feather: 2 / 1500
      }
    } : n.adjustment;
}
function Di(t, e) {
  if (!xe(t)) return;
  const r = y0(t, e);
  if (r) return r;
  if (t.setCode?.toLowerCase() === "leg" && !Mt(t)) return;
  const n = `${t.setCode?.toLowerCase()}-${Lt(t)}-${e}`;
  if (Lo(t)) {
    const o = Eo(t);
    return o && (e === "W" || e === "B") ? Bs[`arn-${o}-black-${e}`] : Bs[n];
  }
  return i0[n] ?? s0[n];
}
function Yo(t) {
  const e = zo(t);
  if (e) return e.materials;
  const r = No(t);
  if (r) return r.materials;
  if (t.frameTemplate === "future") return Fu(t);
  if (t.setCode?.toLowerCase() === "plc") return ju(t);
  if (!xe(t)) return {};
  const n = ne(t);
  if (n) {
    const i = {};
    for (const l of [n.base, n.overlay]) {
      const d = xs[`${t.setCode?.toLowerCase()}/${Lt(t)}/retro/${l.split("/").at(-1)}`];
      d?.source === JSON.stringify([l, xr(t)]) && Object.assign(i, d.materials);
    }
    return i;
  }
  const o = _o(t), s = o && ((j(t).legendary ? void 0 : a0[o.key]) ?? xs[o.key] ?? pi[o.key]);
  if (s && s.source === o?.source && (s.legendary === void 0 || s.legendary === j(t).legendary))
    return s.materials;
  const a = Du(t);
  return a ? { [Qt(t)]: a } : {};
}
function Nu(t) {
  return Object.keys(Yo(t)).length > 0;
}
function Ns(t) {
  const e = zo(t);
  if (e) return e.materials;
  const r = No(t);
  if (r) return r.materials;
  const n = Ni(t), o = ne(t);
  let s = to(t, Yo(t), n).materials;
  return o && n && xe(t) && (s = to(t, s, {
    ...n,
    url: o.overlay
  }).materials), s;
}
function zu(t) {
  const e = zo(t);
  if (e) return e.stock;
  const r = No(t);
  return r ? r.stock : to(t, Yo(t), Ni(t)).stock;
}
function Ni(t) {
  if (wr(t) && !t.frameTemplate && !dt(t) && !xt(t) && (t.layout ?? "normal") === "normal" && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") && j(t).land)
    return {
      url: he(j(t)).frame,
      geometry: JSON.stringify(V.frame)
    };
  if (!xe(t)) return;
  if (dt(t))
    return {
      url: Qt(t),
      geometry: JSON.stringify(xr(t)),
      mask: tn(t)
    };
  const e = _o(t);
  return e?.family === "components" ? { url: e.frame, geometry: JSON.stringify(e.rect) } : void 0;
}
const mr = /* @__PURE__ */ new WeakMap();
function Yu(t, e, r, n) {
  return mr.get(t)?.(e, r, n) ?? !1;
}
function qu(t, e, r) {
  const n = e.printingOmissions;
  if (!n?.length) return r();
  const o = t.fillText, s = t.strokeText, a = (l, d, u) => {
    const h = t.getTransform().transformPoint({ x: d, y: u }), m = h.x * 488 / t.canvas.width, c = h.y * 680 / t.canvas.height;
    return n.some(({ rect: g, rotation: f = 0, texts: b }) => {
      if (!b.includes(String(l))) return !1;
      const y = f * Math.PI / 180, p = m - g[0] * 488, w = c - g[1] * 680, S = p * Math.cos(y) + w * Math.sin(y), v = -p * Math.sin(y) + w * Math.cos(y);
      return S >= -8 && S <= g[2] * 488 + 8 && v >= -8 && v <= g[3] * 680 + 25;
    });
  }, i = mr.get(t);
  mr.set(t, (l, d, u) => a(l, d, u) || (i?.(l, d, u) ?? !1)), t.fillText = function(l, d, u, h) {
    a(l, d, u) || o.call(this, l, d, u, ...h === void 0 ? [] : [h]);
  }, t.strokeText = function(l, d, u, h) {
    a(l, d, u) || s.call(this, l, d, u, ...h === void 0 ? [] : [h]);
  };
  try {
    r();
  } finally {
    i ? mr.set(t, i) : mr.delete(t), t.fillText = o, t.strokeText = s;
  }
}
function Hu(t, e, r, n, o) {
  const [s, a, i] = r;
  if (Yu(t, e, s, a)) return;
  const l = t.getTransform(), d = Math.hypot(l.a, l.b), u = (Math.floor((s - 4) * d + l.e) - l.e) / d, h = (Math.floor((a - n) * d + l.f) - l.f) / d, m = B();
  m.width = Math.ceil((i + 8) * d), m.height = Math.ceil(n * 2 * d);
  const c = m.getContext("2d");
  if (!c) throw Error("Magic heading ink needs Canvas2D");
  try {
    c.scale(d, d), c.translate(-u, -h), c.font = t.font, c.fillStyle = t.fillStyle, c.textAlign = t.textAlign, c.textBaseline = t.textBaseline, c.fillText(e, s, a, i), c.globalCompositeOperation = "destination-out", c.lineWidth = o, c.strokeStyle = "#000", c.strokeText(e, s, a, i), t.drawImage(
      m,
      0,
      0,
      m.width,
      m.height,
      u,
      h,
      m.width / d,
      m.height / d
    );
  } finally {
    m.width = m.height = 0;
  }
}
function qo(t, e, r, n, o, s = "#efe7cb", a, i = "#0d0f0f") {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = s, t.beginPath(), t.arc(e + n / 2, r + n / 2, n / 2, 0, Math.PI * 2), t.fill(), t.clip(), t.fillStyle = i, t.font = '100px "CardRenderer MTG Historic Symbols"', t.textAlign = "left", t.textBaseline = "alphabetic";
  const l = "", d = t.measureText(l), u = d.actualBoundingBoxLeft + d.actualBoundingBoxRight, h = d.actualBoundingBoxAscent + d.actualBoundingBoxDescent, m = o * (a?.scale ?? 1) / Math.max(u, h);
  t.translate(e + n / 2 + (a?.dx ?? 0), r + n / 2 + (a?.dy ?? 0)), t.scale(m, m), t.fillText(
    l,
    (d.actualBoundingBoxLeft - d.actualBoundingBoxRight) / 2,
    (d.actualBoundingBoxAscent - d.actualBoundingBoxDescent) / 2
  ), t.restore();
}
const g1 = "symbols-v3";
function Ho(t) {
  if (t.symbolAdjustment) {
    if (t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
      throw Error("Symbol adjustment currently supports ordinary faces only.");
    for (const [e, r] of Object.entries(t.symbolAdjustment)) {
      if (e !== "mana" && e !== "set") throw Error("Unknown symbol adjustment group.");
      if (!r || typeof r != "object") throw Error("Invalid symbol adjustment.");
      for (const [n, o] of Object.entries(r)) {
        if (e === "mana" && n === "glyphs") {
          Xu(o);
          continue;
        }
        const s = n === "dx" || n === "dy", a = e === "mana" && (n === "numberDx" || n === "numberDy"), i = e === "mana" && n === "spacing", l = n === "scaleX" || n === "scaleY" || e === "mana" && n === "numberScale", d = i || a ? 4 : 8;
        if (!s && !a && !i && !l || typeof o != "number" || !Number.isFinite(o) || o < (l ? 0.75 : -d) || o > (l ? 1.25 : d))
          throw Error("Symbol adjustment exceeds supported bounds.");
      }
    }
  }
}
function Xu(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    throw Error("Invalid mana glyph controls.");
  for (const [e, r] of Object.entries(t)) {
    if (!/^[WUBRG]$/.test(e) || !r || typeof r != "object" || Array.isArray(r))
      throw Error("Invalid mana glyph color.");
    for (const [n, o] of Object.entries(r)) {
      const s = n === "scale";
      if (!s && n !== "dx" && n !== "dy" || typeof o != "number" || !Number.isFinite(o) || o < (s ? 0.75 : -4) || o > (s ? 1.25 : 4))
        throw Error("Mana glyph control exceeds supported bounds.");
    }
  }
}
function Cr(t, e) {
  return /^[WUBRG]$/.test(e) ? t?.glyphs?.[e] : void 0;
}
function ke(t, e) {
  const { dx: r = 0, dy: n = 0, scaleX: o = 1, scaleY: s = 1 } = e ?? {};
  if (!r && !n && o === 1 && s === 1) return t;
  const [a, i, l, d] = t;
  return [a + l + r - l * o, i + d / 2 + n - d * s / 2, l * o, d * s];
}
function He(t, e, r, n) {
  const o = ke(e, r);
  if (o === e || !e[2] || !e[3]) {
    n();
    return;
  }
  t.save();
  const s = o[2] / e[2], a = o[3] / e[3];
  t.transform(s, 0, 0, a, o[0] - e[0] * s, o[1] - e[1] * a);
  try {
    n();
  } finally {
    t.restore();
  }
}
function Ju(t, e, r) {
  const n = Math.max(0, e - 1) * (r?.spacing ?? 0);
  return n ? [t[0] - n, t[1], t[2] + n, t[3]] : t;
}
function Te(t) {
  if (!/^#[a-f0-9]{6}$/i.test(t)) throw Error("Invalid mana palette color");
  return [
    parseInt(t.slice(1, 3), 16) / 255,
    parseInt(t.slice(3, 5), 16) / 255,
    parseInt(t.slice(5, 7), 16) / 255
  ];
}
const Ku = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, Vu = "#9aa4ae", $n = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
function Xo(t, e, r, n) {
  const o = [];
  for (const s of e.split(`
`)) {
    let a = [], i = 0;
    const l = yn(s).flatMap(
      (d) => d.symbol ? [{ text: d.symbol, symbol: !0 }] : (d.value.match(/\s+|\S+/g) ?? []).map((u) => ({ text: u, symbol: !1 }))
    );
    for (const d of l) {
      const u = !d.symbol && t.measureText(d.text).width > r ? [...d.text].map((h) => ({ text: h, symbol: !1 })) : [d];
      for (const h of u) {
        const m = h.symbol ? n * 0.94 : t.measureText(h.text).width;
        i + m > r && a.length && (o.push(a), a = [], i = 0), !(!a.length && /^\s+$/.test(h.text)) && (a.push({ ...h, width: m }), i += m);
      }
    }
    o.push(a);
  }
  return o;
}
function st(t, e, r, n, o, s, a = !1, i) {
  if (e === "W" && s.originalWhiteGlyph) {
    qo(
      t,
      r,
      n,
      o,
      o * 0.87,
      s.manaColors?.W,
      Cr(i, e),
      s.manaInkColor
    );
    return;
  }
  const l = /^\d+$/.test(e);
  if (l && i && s.manaCostNumeral) {
    f0(t, e, r, n, o, s.manaCostNumeral, i);
    return;
  }
  const d = Cr(i, e), u = s.manaGlyphScales?.[e] ?? 1, h = l ? i ? s.manaNumerals?.get(e) : void 0 : u !== 1 || d ? s.manaGlyphs?.get(e) : void 0, m = s.get(Ye(e) ?? "");
  if (t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, a) {
    const c = t.getTransform();
    t.shadowColor = "#000d";
    const [g, f] = s.manaCostShadow ?? [-1.5372, 1.5372];
    t.shadowOffsetX = g * c.a + f * c.c, t.shadowOffsetY = g * c.b + f * c.d;
  }
  if (t.fillStyle = s.manaColors?.[e] ?? Ku[e] ?? Vu, t.beginPath(), t.arc(r + o / 2, n + o / 2, o / 2, 0, Math.PI * 2), t.fill(), t.shadowColor = "transparent", h && t.drawImage(h.image, 0, 0, h.width, h.height, r, n, o, o), h) {
    const c = l ? i?.numberDx ?? 0 : d?.dx ?? 0, g = l ? i?.numberDy ?? 0 : d?.dy ?? 0, f = l ? i?.numberScale ?? 1 : u * (d?.scale ?? 1);
    l || (t.beginPath(), t.arc(r + o / 2, n + o / 2, o / 2, 0, Math.PI * 2), t.clip()), (c || g || f !== 1) && (t.translate(r + o / 2 + c, n + o / 2 + g), t.scale(f, f), t.translate(-r - o / 2, -n - o / 2));
  }
  if (h || m) {
    h ? t.drawImage(
      h.image,
      h.width,
      0,
      h.width,
      h.height,
      r,
      n,
      o,
      o
    ) : t.drawImage(m, r, n, o, o), t.restore();
    return;
  }
  t.fillStyle = e === "B" ? "white" : "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.font = `bold ${o * 0.62}px Georgia`, t.fillText(e, r + o / 2, n + o / 2, o * 0.9), t.restore();
}
function zi(t, e, r, n, o, s, a) {
  if (!re(t)) return;
  const i = typeof s == "number" ? s : s.size;
  t.font = `${typeof s != "number" && s.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
  const l = e.split(`
`).map((d) => Xo(t, d, o, i));
  t.textBaseline = "top";
  for (const d of l) {
    for (const u of d) {
      let h = r;
      for (const m of u)
        m.symbol ? st(t, m.text, h + i * 0.07, n + i * 0.03, i * 0.8, a) : t.fillText(m.text, h, n), h += m.width;
      n += i;
    }
    n += X.paragraphGap;
  }
}
function at(t, e, r, n, o, s, a = !1, i = 1, l = "CardRenderer MTG Beleren", d = 0, u, h = "type") {
  if (!(o > 0)) throw Error("Magic title/type plate has no text space.");
  t.save(), t.font = `${a ? "bold " : ""}${s}px "${l}", Georgia`;
  const m = t.measureText(e).width;
  i > 1 && m * i > o && (i = 1), i !== 1 && (t.translate(r, 0), t.scale(i, 1), r = 0, o /= i), m > o && (s = Math.max(s * 0.78, s * o / m), t.font = `${a ? "bold " : ""}${s}px "${l}", Georgia`), mt(
    t,
    e,
    r,
    n,
    o,
    u,
    h,
    d > 0 ? () => Hu(t, e, [r, n, o], s, d) : void 0
  ), t.restore();
}
function oe(t, e, r, n, o, s, a, i, l = [0, 0, 1, 1]) {
  const d = [
    l[0] * e.width,
    l[1] * e.height,
    l[2] * e.width,
    l[3] * e.height
  ], u = {
    uncommon: "#aaaeb2",
    rare: "#bc923f",
    mythic: "#c65c2d",
    special: "#8664af",
    bonus: "#bc923f"
  }[n ?? "common"];
  if (!u || ["forge", "glint"].includes(r?.toLowerCase() ?? "")) {
    t.drawImage(e, ...d, o, s, a, i);
    return;
  }
  const h = B();
  h.width = Math.max(1, Math.ceil(a * 2)), h.height = Math.max(1, Math.ceil(i * 2));
  const m = h.getContext("2d");
  m.drawImage(e, ...d, 0, 0, h.width, h.height), m.globalCompositeOperation = "source-in", m.fillStyle = u, m.fillRect(0, 0, h.width, h.height), t.drawImage(h, o, s, a, i), h.width = h.height = 0;
}
function vn(t) {
  return /^[WUBRG]$/.test(t) ? `${z.MSE_TEMPLATE_ROOT}/magic-mana-future.mse-symbol-font/mana_${t.toLowerCase()}.png` : /^(?:[0-9]|1[0-9]|20|X)$/.test(t) ? `${z.CONJURER_ROOT}/img/manaSymbols/future/f0.png` : /^[WUBRG]\/[WUBRG]$/.test(t) ? `${z.CONJURER_ROOT}/img/manaSymbols/future/f${t.toLowerCase().replace("/", "")}.png` : null;
}
function Zu(t) {
  const e = t.manaSymbols ?? [];
  return [
    .../* @__PURE__ */ new Set([
      ...e.map(vn).filter((r) => r !== null),
      ...e.some((r) => /^(?:\d+|X)$/.test(r)) ? uo() : []
    ])
  ];
}
function uo() {
  return ["0", "1", "2", "3", "4", "5", "6", "x"].map(
    (t) => `${z.CONJURER_ROOT}/img/manaSymbols/future/f${t}.png`
  );
}
function Qu(t, e, r) {
  const n = [91, 61, 46, 46, 59, 106], o = [140, 207, 281, 356, 437, 512], s = e.manaSymbols ?? [];
  if (s.length > n.length) throw Error("Futureshifted cost exceeds the six source positions");
  s.forEach((a, i) => {
    const l = pt(e) === "full-art" && i > 0 && i < 3, d = l || pt(e) === "regular" && i < 4, u = d ? /^[WUBRG]$/.test(a) ? 37.125 : 38.125 : 59 * 488 / 744, h = l ? [79.0376, 58.6102, 56.1465] : [78.1626, 59.4852, 51.6465, 51.6465], m = l ? [113.101, 161.7009, 217.5071] : [111.851, 154.0759, 202.5071, 252.3427], c = d ? h[i] - u / 2 : n[i] * 488 / 744, g = d ? m[i] - u / 2 : o[i] * 680 / 1039, f = vn(a), b = f ? r.get(f) : void 0;
    if (f && !b) throw Error(`Futureshifted mana asset unavailable: ${f}`);
    b ? (t.drawImage(b, c, g, u, u), /^(?:\d+|X)$/.test(a) && (t.save(), t.translate(c + u / 2 - 0.75 * u / 38.125, g + u / 2 + 1.75 * u / 38.125), t.scale(0.9375, 1), t.font = `700 ${u * 31.25 / 38.125}px "CardRenderer MTG MPlantin"`, t.fillStyle = "#111", t.textAlign = "center", t.textBaseline = "middle", t.fillText(a, 0, 0, u * 0.73), t.restore())) : st(t, a, c, g, u, r, !1);
  });
}
function Jo([t, e, r, n]) {
  return [e / 375, 1 - (t + r) / 523, n / 375, r / 523];
}
function rn([t, e, r, n]) {
  return [(1 - e - n) * 523, t * 375, n * 523, r * 375];
}
const pr = {
  rect: [455, 307, 30, 12],
  font: 'bold 16px "CardRenderer MTG ModMatrix"',
  color: "rgb(45, 45, 45)"
};
function th(t, e) {
  if (e.frameTemplate !== "battle" || !e.reverseStats) return null;
  const r = `${e.reverseStats.power}/${e.reverseStats.toughness}`;
  t.save();
  try {
    t.font = pr.font, t.textAlign = "right", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
    const n = t.measureText(r), [o, s, a, i] = pr.rect, l = o + a, d = s + i - n.actualBoundingBoxDescent, u = [
      l - n.actualBoundingBoxLeft,
      d - n.actualBoundingBoxAscent,
      n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
      n.actualBoundingBoxAscent + n.actualBoundingBoxDescent
    ];
    return {
      text: r,
      font: pr.font,
      x: l,
      baseline: d,
      inkBounds: u,
      rect: Jo(u),
      rotation: -90
    };
  } finally {
    t.restore();
  }
}
const zs = z.MSE_TEMPLATE_ROOT, Ko = {
  future: {
    size: [375, 523],
    style: "magic-future.mse-style",
    title: [73, 30, 269, 26],
    art: [32, 44, 327, 310],
    type: [49, 300, 279, 20],
    rules: [42, 332, 291, 134],
    stats: [287, 469, 60, 28],
    footer: [30, 475, 245, 27],
    symbol: [331, 302, 22, 22],
    titleSize: 18,
    typeSize: 14,
    rulesSize: 13,
    minimumSize: 6
  },
  flip: {
    size: [375, 523],
    style: "magic-new-flip.mse-style",
    title: [32, 30, 311, 23],
    art: [32, 162, 311, 182],
    type: [33, 134, 310, 18],
    rules: [37, 59, 302, 67],
    stats: [290, 130, 60, 28],
    footer: [58, 479, 217, 26],
    symbol: [309, 482, 44, 22],
    titleSize: 17,
    typeSize: 14,
    rulesSize: 14,
    minimumSize: 8
  },
  battle: {
    size: [523, 375],
    style: "magic-m15-mainframe-battles.mse-style",
    title: [67, 21, 410, 22],
    // Boxed image aperture, not the full-height image behind opaque printing.
    art: [63, 51, 422, 162],
    type: [67, 219, 366, 22],
    rules: [69, 254, 400, 96],
    stats: [480, 336, 22, 24],
    footer: [20, 350, 420, 20],
    symbol: [441, 220, 44, 22],
    titleSize: 16,
    typeSize: 13,
    rulesSize: 14,
    minimumSize: 6
  }
};
function Ys(t) {
  const e = F(t);
  return /\bLand\b/.test(t.typeLine ?? "") || t.land ? (e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "c") + "l" : /\bArtifact\b/.test(t.typeLine ?? "") || t.artifact ? "a" : e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "c";
}
function Vo(t) {
  if (!t.frameTemplate) return null;
  const e = t.frameTemplate, r = Ko[e];
  if (!r) throw Error("Unknown standard frame template");
  if (t.frameAssetFamily) throw Error("Choose one frame template or plate family");
  if (e === "future") return ee(t);
  const n = `${zs}/${r.style}`, o = Ys(e === "flip" ? t.faces?.[0] ?? t : t);
  if (e === "battle")
    return {
      kind: e,
      base: `${n}/cards/${o.replace(/l$/, "")}card.png`,
      defense: `${zs}/magic-modules.mse-include/loyalty/defense.png`,
      texture: `${n}/cards/texture/${o.replace(/l$/, "")}card.png`,
      border: `${n}/border.png`
    };
  const s = `${n}/${o}card.jpg`;
  if (e === "flip") {
    const a = t.faces?.[1] ?? t, i = t.faces?.[0] ?? t, l = Ys(a);
    return {
      kind: e,
      base: s,
      reverse: `${n}/${l}card.jpg`,
      ...i.power != null && i.toughness != null ? { stats: `${n}/${o}pt.jpg`, statsMask: `${n}/mask_pt.png` } : {},
      ...a.power != null && a.toughness != null ? {
        reverseStats: `${n}/${l}pt2.jpg`,
        reverseStatsMask: `${n}/mask_pt2.png`
      } : {}
    };
  }
  throw Error("Unknown standard template asset branch");
}
function eh(t) {
  const e = Vo(t);
  if (!e) return [];
  const { kind: r, ...n } = e;
  return [
    ...Object.values(n).filter((o) => typeof o == "string"),
    ...t.frameTemplate === "future" ? Zu(t) : []
  ];
}
function rh(t) {
  if (!t.frameTemplate) return null;
  if (t.frameTemplate === "future") {
    const n = jo(t), o = (s) => [s[0] / 488, s[1] / 680, s[2] / 488, s[3] / 680];
    return {
      ...V,
      frame: [0, 0, 1, 1],
      title: o(n.title),
      art: o(n.art),
      type: o(n.type),
      rules: o(n.rules),
      stats: o(n.stats),
      footer: o(n.footer)
    };
  }
  const e = Ko[t.frameTemplate];
  if (!e) throw Error("Unknown standard frame template");
  const r = (n) => {
    const [o, s, a, i] = n, [l, d] = e.size;
    return t.frameTemplate === "battle" ? Jo(n) : [o / l, s / d, a / l, i / d];
  };
  return {
    ...V,
    frame: [0, 0, 1, 1],
    title: r(e.title),
    art: r(e.art),
    type: r(e.type),
    rules: r(e.rules),
    stats: r(e.stats),
    footer: r(e.footer)
  };
}
function Jt(t) {
  return t.securityStamp !== void 0 ? t.securityStamp === "oval" : !dt(t) && t.frameAssetFamily !== "eighth" && ["rare", "mythic"].includes(t.rarity ?? "");
}
const Yi = `${P}/img/frames/m15/holoStamps/stamp.png`, nn = 310.216, qs = {
  frame: [52, 20, 298, 449],
  title: [70, 40, 261, 26],
  art: [65, 76.5, 270, 183.8],
  type: [70, 265, 261, 23],
  rules: [74, 301, 255, 160],
  artistY: 0,
  legalY: 0
}, nh = `${P}/img/frames/m15/split`, Hs = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style", qi = [
  `${Hs}/namebox/texture/normal/c.png`,
  `${Hs}/typebox/texture/normal/c.png`
], Zo = (t) => `${nh}${t.layout?.endsWith("-fuse") ? "/fuse" : ""}`;
function Qo(t) {
  const e = F(t);
  return `${Zo(t)}/${e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "a"}.png`;
}
function Hi(t) {
  const e = t.manaSymbols ?? [];
  return e.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !e.some((r) => /^[WUBRG]$/.test(r));
}
function Xi(t) {
  const e = F(t);
  return [
    Qo(t),
    ...e.length === 2 ? e.map((r) => `${Zo(t)}/${r.toLowerCase()}.png`) : [],
    ...e.length === 2 && Hi(t) ? qi : [],
    ...Jt(t) ? [Yi] : []
  ];
}
const Oe = /* @__PURE__ */ new Map(), Gn = /* @__PURE__ */ new WeakMap();
let oh = 0, Pn = 0;
const sh = (t) => (Gn.has(t) || Gn.set(t, ++oh), Gn.get(t));
function Gr(t, e, r, n, o, s) {
  t.moveTo(e + s, r), t.lineTo(e + n - s, r), t.quadraticCurveTo(e + n + s * 0.25, r + o / 2, e + n - s, r + o), t.lineTo(e + s, r + o), t.quadraticCurveTo(e - s * 0.25, r + o / 2, e + s, r), t.closePath();
}
function ah(t, e) {
  const r = (g) => {
    const f = e.get(g);
    if (!f) throw Error(`Modern split asset unavailable: ${g}`);
    return f;
  }, n = r(Qo(t)), o = F(t);
  if (o.length !== 2) return n;
  "WUBRG".indexOf(o[1]) - "WUBRG".indexOf(o[0]) > 2 && o.reverse();
  const s = Hi(t), a = [
    ...o.map((g) => r(`${Zo(t)}/${g.toLowerCase()}.png`)),
    ...s ? qi.map(r) : [n]
  ], i = o.join("") + (s ? "-hybrid-" : "-gold-") + [n, ...a].map(sh).join("/"), l = Oe.get(i);
  if (l)
    return Oe.delete(i), Oe.set(i, l), l;
  const d = B();
  d.width = n.width, d.height = n.height;
  const u = d.getContext("2d");
  u.scale(d.width / 488, d.height / 680), u.translate(0, 680), u.rotate(-Math.PI / 2);
  const h = (g) => {
    u.save(), u.translate(680, 0), u.rotate(Math.PI / 2), u.drawImage(g, 0, 0, 488, 680), u.restore();
  }, m = t.layout?.endsWith("-fuse") ?? !1;
  h(n);
  for (const g of [0, nn]) {
    if (u.save(), u.beginPath(), s ? u.rect(g + 50, 0, nn, 488) : (Gr(u, g + 57.5, 29, 286, 47, 9), u.rect(g + 64, 74, 273, m ? 362 : 394), Gr(u, g + 57.5, 260, 286, 34, 7)), m)
      for (const [p, w] of [
        [29, 47],
        [260, 34]
      ])
        u.moveTo(334, p), u.lineTo(356, p + w / 2), u.lineTo(378, p), u.lineTo(378, p + w), u.lineTo(356, p + w / 2), u.lineTo(334, p + w), u.closePath();
    u.clip(), h(a[0]);
    const f = B();
    f.width = d.width, f.height = d.height;
    const b = f.getContext("2d");
    b.drawImage(a[1], 0, 0, f.width, f.height), b.globalCompositeOperation = "destination-in";
    const y = b.createLinearGradient(
      0,
      (680 - g - 175) / 680 * f.height,
      0,
      (680 - g - 230) / 680 * f.height
    );
    if (y.addColorStop(0, "#0000"), y.addColorStop(1, "#000"), b.fillStyle = y, b.fillRect(0, 0, f.width, f.height), u.save(), u.translate(680, 0), u.rotate(Math.PI / 2), u.drawImage(f, 0, 0, 488, 680), u.restore(), u.restore(), f.width = f.height = 0, u.save(), u.beginPath(), Gr(u, g + 62.5, 34.5, 276, 37.5, 7), Gr(u, g + 62.5, 265, 276, 24, 5), m)
      for (const [p, w] of [
        [35, 37],
        [265, 24]
      ])
        u.moveTo(332, p), u.lineTo(349, p + w / 2), u.lineTo(332, p + w), u.closePath(), u.moveTo(380, p), u.lineTo(363, p + w / 2), u.lineTo(380, p + w), u.closePath();
    u.clip(), s ? (u.drawImage(a[2], 22, 7, 196, 19, g + 62.5, 34.5, 276, 37.5), u.drawImage(a[3], 22, 192, 196, 11, g + 62.5, 265, 276, 24)) : h(a[2]), u.restore();
  }
  const c = d.width * d.height * 4;
  for (const [g, f] of Oe) {
    if (Pn + c <= 16 * 1024 * 1024) break;
    Pn -= f.width * f.height * 4, Oe.delete(g), f.width = f.height = 0;
  }
  return c <= 16 * 1024 * 1024 && (Oe.set(i, d), Pn += c), d;
}
function Ae(t) {
  return ["split", "aftermath"].includes(t.layout ?? "") && t.faces?.length === 2 && (t.layout === "aftermath" || /^Aftermath\b/m.test(t.faces[1].rulesText ?? ""));
}
const ve = 373, Ji = 257, Ki = `${P}/img/frames/saga/stamp.png`;
function Vi(t) {
  const e = F(t), r = e.length > 1 ? "m" : e[0]?.toLowerCase();
  if (!r) throw Error("No validated colorless Aftermath plate is available.");
  return `${P}/img/frames/m15/aftermath/${r}.png`;
}
function Zi(t) {
  return Ae(t) ? [
    ...t.faces.map(Vi),
    ...Jt(t) ? [Ki] : []
  ] : [];
}
const ts = {
  title: [41.7, 35.5, 405, 37],
  art: [37.4, 76.5, 413.2, 151.8],
  type: [41.7, 235.8, 405, 37],
  rules: [41.7, 281.5, 405, 76]
}, es = {
  title: [12, 37.5, 227, 37],
  art: [11, 80.7, 240.9, 137.9],
  // Align the rotated type plate in its reading orientation (all type labels).
  type: [9, 226.2, 230, 37],
  rules: [14, 276.5, 232, 169]
};
function ih(t) {
  const e = t ? es : ts, r = t ? Ji : 488, n = t ? 488 : ve, o = (s) => {
    const [a, i, l, d] = e[s];
    return [a / r, i / n, l / r, d / n];
  };
  return {
    ...V,
    title: o("title"),
    art: o("art"),
    type: o("type"),
    rules: o("rules"),
    footer: [0, 1, 0, 0]
  };
}
const Qi = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", lh = new Set("dis plc cmd pc2 dgm mma c13".split(" "));
function Xt(t) {
  return t.layout !== "split" || t.faces?.length !== 2 || Ae(t) || t.faces.some(
    (e) => !/^(Instant|Sorcery)\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "")
  ) ? null : dt({ ...t, layout: "normal", frameStyle: t.frameStyle ?? t.faces[0]?.frameStyle }) ? "old" : t.frameAssetFamily === "eighth" || lh.has(t.setCode?.toLowerCase() ?? "") ? "eighth" : "m15";
}
function Xe(t) {
  const e = (r) => [
    r.rulesText ?? "",
    ...(r.rulesParagraphs ?? []).map((n) => n.runs.map((o) => o.text).join(""))
  ];
  return [t, ...t.faces ?? []].some((r) => e(r).some((n) => /^Fuse\b/m.test(n)));
}
const tl = 251 * 680 / 523, Xs = 680 / 523, on = 488 / 375, ye = (t, e, r, n) => [
  t * Xs,
  e * on,
  r * Xs,
  n * on
];
function er(t, e) {
  if (t === "m15")
    return e ? { ...qs, rules: [74, 301, 255, 128] } : qs;
  const r = t === "old";
  return {
    frame: ye(18, 18, e ? 244 : 236, 338),
    title: ye(r ? 35 : 30, r ? 23 : 28, r ? 207 : 214, 21),
    art: r ? ye(37, 47, 197, 130) : ye(27, 56, 217, 152),
    type: ye(r ? 35 : 30, r ? 182 : 211, 210, r ? 21 : 17),
    rules: r ? ye(43, 207, 187, 109) : ye(30, 233, 213, e ? 74 : 95),
    artistY: (r ? 332 : e ? 344 : 339) * on,
    legalY: (r ? 347 : 354) * on
  };
}
function dh(t) {
  const e = t.layout?.startsWith("split-old") ? "old" : t.layout?.startsWith("split-m15") ? "m15" : "eighth", r = e === "m15" ? nn : tl, n = er(e, t.layout?.endsWith("-fuse") ?? !1), o = (s) => [
    s[0] / r,
    s[1] / 488,
    s[2] / r,
    s[3] / 488
  ];
  return {
    ...V,
    frame: o(n.frame),
    title: o(n.title),
    art: o(n.art),
    type: o(n.type),
    rules: o(n.rules),
    footer: [0, 1, 0, 0]
  };
}
function sn(t, e, r, n) {
  if (e === "m15") return Qo(t);
  const o = F(t), s = o.length > 1 ? "m" : o[0]?.toLowerCase() ?? "c";
  return `${Qi}/${e === "old" ? "magic-old-split" : r ? "magic-new-split-fuse" : "magic-new-split"}.mse-style/${s}card${r ? n + 1 : ""}.${r ? "png" : "jpg"}`;
}
function el(t) {
  for (const e of [t, ...t.faces ?? []]) {
    const r = e.rulesParagraphs?.find(
      (o) => /^Fuse\b/.test(o.runs.map((s) => s.text).join(""))
    );
    if (r) return [r];
    const n = e.rulesText?.split(`
`).find((o) => /^Fuse\b/.test(o));
    if (n) return [{ role: "rules", runs: [{ text: n }] }];
  }
  return [];
}
const Pr = `${P}/img/frames/saga`, rl = [
  `${Pr}/sagaMaskPinline.png`,
  `${Pr}/sagaMaskBanner.png`,
  `${Pr}/sagaMaskBannerRight.png`,
  `${Pr}/sagaMidStripe.png`
];
function nl(t) {
  const e = F(t);
  return e.length !== 2 || t.layout === "transform" || t.land || /\bLand\b/.test(t.typeLine ?? "") ? [] : ("WUBRG".indexOf(e[1]) - "WUBRG".indexOf(e[0]) > 2 && e.reverse(), e.map(
    (r) => `${P}/data/images/cardImages/saga/sagaFrame${r}.png`
  ));
}
function uh(t) {
  const e = nl(t);
  return e.length ? [...e, ...rl] : [];
}
const Js = /* @__PURE__ */ new WeakMap();
function hh(t, e, r) {
  const n = nl(e);
  if (!n.length) return;
  const o = [...n, ...rl].map((S) => {
    const v = r.get(S);
    if (!v) throw Error(`Saga color asset unavailable: ${S}`);
    return v;
  }), s = Js.get(o[0]);
  if (s && s.sources.every((S, v) => S === o[v])) {
    t.drawImage(s.canvas, 0, 0, 488, 680);
    return;
  }
  const [a, i, l, d, u, h] = o, m = B();
  m.width = a.width, m.height = a.height;
  const c = B();
  c.width = m.width, c.height = m.height;
  const g = B();
  g.width = m.width, g.height = m.height;
  const f = m.getContext("2d"), b = c.getContext("2d"), y = g.getContext("2d"), p = m.width, w = m.height;
  y.drawImage(l, 0, 0, p, w), y.drawImage(d, 0, 0, p, w), f.drawImage(a, 0, 0, p, w), f.globalCompositeOperation = "destination-in", f.drawImage(g, 0, 0), f.globalCompositeOperation = "source-over", y.clearRect(0, 0, p, w), y.save(), y.beginPath(), y.rect(p / 2, 0, p / 2, w), y.clip(), y.drawImage(l, 0, 0, p, w), y.restore(), y.drawImage(u, 0, 0, p, w), b.drawImage(i, 0, 0, p, w), b.globalCompositeOperation = "destination-in", b.drawImage(g, 0, 0), f.drawImage(c, 0, 0), f.drawImage(h, 0.0727 * p, 0.3058 * w, 87e-4 * p, 0.4762 * w), Js.set(a, { sources: o, canvas: m }), c.width = c.height = g.width = g.height = 0, t.drawImage(m, 0, 0, 488, 680);
}
const kr = `${P}/img/frames/saga`;
function rs(t) {
  const e = F(t), r = e.length > 1 ? "M" : e[0];
  if (/\bLand\b/.test(t.typeLine ?? "") || t.land) return `${kr}/regular/l.png`;
  if (t.layout === "transform" && r) return `${kr}/dfc/${r.toLowerCase()}.png`;
  if (r) return `${P}/data/images/cardImages/saga/sagaFrame${r}.png`;
  throw Error("No ordinary colorless or artifact Saga plate is available.");
}
function ho(t) {
  return t.layout === "transform" && t.setCode?.toLowerCase() === "neo" ? `${P}/img/frames/m15/transform/icons/fanClosed.svg` : null;
}
const ol = `${kr}/sagaChapter.png`, sl = `${kr}/sagaDivider.png`, Ar = `${kr}/stamp.png`, qt = {
  shape: "chapter",
  x: 18.8,
  width: 38.4,
  height: 42.8,
  centerX: 38.1,
  numeralOffsetY: 0.7,
  gap: 49,
  fontSize: 22,
  fontFamily: "CardRenderer MTG Chapter",
  minimumRowHeight: 55
};
function mh(t) {
  return [
    rs(t),
    ...uh(t),
    ol,
    sl,
    ...ho(t) ? [ho(t)] : [],
    ...Jt(t) ? [Ar] : []
  ];
}
const al = {
  ...V,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.5007, 0.1134, 0.4233, 0.724],
  type: [0.0854, 0.8481, 0.8292, 0.0543],
  rules: [0.0867, 0.1129, 0.404, 0.7248],
  stamp: [0.17, 0.48, 0.23, 0.16506]
}, Me = `${P}/img/frames/adventure/regular`, il = `${Me}/bookLeft.png`, ll = `${Me}/pinline.svg`, dl = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style/namebox/texture/normal/c.png", Lr = (t) => t.layout === "adventure" && t.faces?.length === 2;
function te(t) {
  const e = t.manaSymbols ?? [];
  return F(t).length === 2 && e.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !e.some((r) => /^[WUBRG]$/.test(r));
}
function ns(t) {
  const e = j(t), r = F(t);
  return e.land ? "l" : e.artifact ? "a" : r.length > 1 ? "m" : r[0]?.toLowerCase() ?? "a";
}
const an = (t) => `${Me}/${ns(t)}.png`;
function os(t) {
  const e = te(t) ? "W" : ns(t).toUpperCase();
  return `${P}/img/frames/m15/regular/m15PT${e === "L" ? "C" : e}.png`;
}
const ul = (t) => `${P}/img/frames/m15/crowns/m15Crown${ns(t).toUpperCase()}.png`;
function hl(t) {
  const e = t.faces?.[1];
  if (!Lr(t) || !e) throw Error("Adventure needs a permanent and an inset spell.");
  const r = (n) => {
    const o = F(n);
    return [
      an(n),
      ...o.length === 2 ? o.map((s) => `${Me}/${s.toLowerCase()}.png`) : []
    ];
  };
  return [
    .../* @__PURE__ */ new Set([
      ...r(t),
      ...r(e),
      il,
      ...F(t).length === 2 && !te(t) ? [ll] : [],
      ...te(t) ? [dl] : [],
      ...j(t).legendary ? [ul(t)] : [],
      ...t.power != null && t.toughness != null ? [os(t)] : [],
      ...Jt(t) ? [Ar] : []
    ])
  ];
}
const ss = {
  ...V,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.5267, 0.65, 0.3867, 0.2647],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.58, 0.74, 0.25, 0.1794]
}, Cn = `${P}/img/frames/prepare/regular`, kn = (t) => t.layout === "prepare";
function rr(t) {
  if (t.faces?.length !== 2) throw Error("Prepared needs a creature and an inset spell.");
  return t.faces[1];
}
function as(t) {
  const e = j(t), r = F(t);
  if (e.land) return "l";
  if (/\bVehicle\b/.test(t.typeLine ?? "")) return "v";
  if (e.artifact) return "a";
  if (r.length > 1) return "m";
  if (r.length) return r[0].toLowerCase();
  throw Error("The pinned Prepared source has no colorless plate.");
}
const De = (t) => `${Cn}/${as(t)}.png`, zr = (t) => `${Cn}/${t}.png`;
function _e(t) {
  const e = F(t);
  return e.length === 2 && "WUBRG".indexOf(e[1]) - "WUBRG".indexOf(e[0]) > 2 && e.reverse(), e;
}
const mo = (t) => `${P}/img/frames/m15/crowns/m15Crown${t.toUpperCase()}.png`, ch = (t) => os(t);
function ml(t) {
  const e = rr(t), r = (o) => _e(o).length === 2 ? _e(o).map((s) => `${Cn}/${s.toLowerCase()}.png`) : [], n = _e(t);
  return [
    .../* @__PURE__ */ new Set([
      De(t),
      De(e),
      zr("prepare"),
      ...r(t),
      ...r(e),
      ...n.length === 2 ? ["pinline", "rules", "rulesRight"].map(zr) : [],
      ..._e(e).length === 2 ? ["prepareRight", "prepareTypeTitle"].map(zr) : [],
      ...j(t).legendary ? (n.length === 2 ? n : [as(t)]).map(mo) : [],
      ...t.power != null && t.toughness != null ? [ch(t)] : [],
      ...Jt(t) ? [Ar] : []
    ])
  ];
}
const is = {
  ...V,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.086, 0.6303, 808 / 2010, 0.2875],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.17, 0.72, 0.25, 0.1794]
}, gh = {
  title: [1042 / 2010, 0.6391, 0.4, 0.0296],
  type: [1042 / 2010, 1932 / 2814, 0.4, 0.0296],
  rules: [1035 / 2010 + 2 / 488, 2059 / 2814, 0.3947, 438 / 2814]
}, fh = [
  [
    [84, 53],
    [86, 52],
    [87, 50],
    [88, 48],
    [89, 47],
    [90, 46],
    [91, 45],
    [92, 44],
    [93, 44],
    [94, 43],
    [95, 43],
    [106, 41],
    [126, 37],
    [146, 34],
    [166, 31],
    [186, 28],
    [206, 26],
    [226, 25],
    [246, 24],
    [266, 23],
    [286, 22],
    [306, 22],
    [326, 21],
    [346, 21],
    [366, 21],
    [386, 22],
    [406, 22],
    [426, 22],
    [446, 23],
    [466, 24],
    [486, 24],
    [506, 25],
    [526, 27],
    [546, 29],
    [566, 32],
    [586, 36],
    [606, 40],
    [611, 42],
    [612, 43],
    [613, 43],
    [614, 44],
    [615, 44],
    [616, 45],
    [617, 46],
    [618, 47],
    [619, 48],
    [620, 50],
    [622, 53]
  ],
  [
    [84, 53],
    [86, 52],
    [87, 50],
    [88, 48],
    [89, 47],
    [90, 46],
    [91, 45],
    [92, 44],
    [93, 44],
    [94, 43],
    [95, 43],
    [106, 41],
    [126, 37],
    [146, 34],
    [166, 31],
    [186, 28],
    [206, 26],
    [226, 24],
    [246, 23],
    [266, 22],
    [286, 22],
    [306, 21],
    [326, 21],
    [346, 22],
    [366, 22],
    [386, 23],
    [406, 24],
    [426, 25],
    [446, 27],
    [466, 29],
    [486, 32],
    [506, 36],
    [526, 41],
    [530, 42],
    [531, 42],
    [532, 43],
    [533, 43],
    [534, 44],
    [535, 45],
    [536, 46],
    [537, 47],
    [538, 48],
    [539, 50],
    [541, 53]
  ]
], de = 0.91339 * T / 768, co = 0.04724 * T, go = 0.02655 * L;
function ph(t) {
  return [
    (co + 20 * de) / T,
    (go + 84 * de) / L,
    (728 * de - ft.rightInset) / T,
    (((t ? 541 : 622) - 84) * de - ft.middleLift) / L
  ];
}
function bh(t, e) {
  const r = fh[e ? 1 : 0];
  t.beginPath(), r.forEach(([n, o], s) => {
    const a = co + (o - 1) * de, i = en(go + n * de, e);
    s === 0 ? t.moveTo(a, i) : t.lineTo(a, i);
  });
  for (let n = r.length - 1; n >= 0; n--) {
    const [o, s] = r[n];
    t.lineTo(
      co + (769 - s) * de - ft.rightInset,
      en(go + o * de, e)
    );
  }
  t.closePath(), t.clip();
}
function Er(t) {
  const e = t.layout === "saga" || /\bSaga\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "");
  return (e ? (t.rulesText ?? "").replace(/\|(?=\s*[IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*\s*[—–-]\s)/g, `
`) : t.rulesText ?? "").split(`
`).filter((n) => n.trim()).map((n) => {
    const o = e ? n.match(/^\s*([IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*)\s*[—–-]\s*(.+)$/) : null;
    if (o)
      return { text: o[2], badges: o[1].split(/\s*,\s*/), reminder: !1 };
    const s = e ? null : n.match(/^\s*\[?([+−-]?(?:\d+|X))\]?\s*:\s*(.*)$/i);
    return s ? {
      text: s[2],
      badges: [s[1].replace("-", "−").toUpperCase()],
      reminder: !1
    } : { text: n, badges: [], reminder: e && /^\s*\(/.test(n) };
  });
}
function K(t) {
  return t.layout === "ability" ? "normal" : t.layout === "prepare" ? "prepare" : t.layout === "adventure" && t.faces?.length === 2 ? "adventure" : t.layout === "class" || /\bClass\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "class" : t.layout === "leveler" || /^Level up\b/m.test(t.rulesText ?? "") ? "leveler" : t.layout === "saga" || /\bSaga\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "saga" : t.layout === "planeswalker" || /\bPlaneswalker\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? Er(t).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function Ft(t) {
  const e = rh(t);
  if (e) return e;
  if (t.layout === "aftermath-top" || t.layout === "aftermath-bottom")
    return ih(t.layout === "aftermath-bottom");
  if (/^split-(old|eighth|m15)(-fuse)?$/.test(t.layout ?? "")) return dh(t);
  const r = xt(t);
  if (r) return r.rects;
  if (dt(t)) return Sn(t);
  const n = K(t);
  if (n === "adventure") return ss;
  if (n === "prepare") return is;
  if (n === "class")
    return {
      ...V,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (n === "saga") return al;
  if (n.startsWith("planeswalker")) {
    const o = n === "planeswalker-large", s = [
      0.04409,
      (o ? 0.55118 : 0.62655) - ft.middleLift / L,
      0.88827,
      (o ? 0.37534 : 0.29997) + ft.middleLift / L
    ], a = V.stamp[2], i = V.stamp[3];
    return {
      ...V,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, 0.92126 * T * 3793 / 2778 / L],
      frame: [0.04724, 0.02655, 0.91339, 0.91339 * T * 3810 / 2736 / L],
      art: ph(o),
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / T,
        (o ? 0.49044 : 0.55793) + (5 - ft.middleLift) / L,
        0.88662,
        0.05737
      ],
      rules: s,
      stats: [0.792 + 1 / T, 0.881 - 3 / L, 0.16, 0.069],
      stamp: [
        s[0] + (s[2] - a) / 2,
        s[1] + (s[3] - i) / 2,
        a,
        i
      ]
    };
  }
  return t.layout === "split-half" ? {
    ...V,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : { ...V, art: iu(t) };
}
function yh(t) {
  const e = K(t) === "saga", r = Ft(t).rules, n = Er(t), o = r[2] * 488 - (e ? 32 : 70), s = r[3] * 680;
  let a = e ? 21 : 19;
  const i = (b, y) => Math.max(1, Math.ceil(b.length * y * 0.49 / o)), l = (b, y) => Math.max(e ? b.badges.length * 36 : 34, i(b.text, y) * y + 16), d = (b) => n.reduce((y, p) => y + l(p, b), 0);
  for (; a > 8 && d(a) > s; ) a -= 0.5;
  const u = n.map((b) => l(b, a)), h = Math.max(0, s - d(a)) / Math.max(1, n.length);
  let m = s / Math.max(1, n.length), c = s, g = n.length;
  if (!e)
    for (const b of [...u].sort((y, p) => p - y)) {
      if (b <= m) break;
      c -= b, m = c / Math.max(1, --g);
    }
  let f = 0;
  return n.map((b, y) => {
    const p = e ? u[y] + h : Math.max(m, u[y]), w = { ...b, top: f, height: p, font: a, left: e ? 27 : 62, width: o };
    return f += p, w;
  });
}
const ls = {
  azorius: ["W", "U"],
  dimir: ["U", "B"],
  rakdos: ["B", "R"],
  gruul: ["R", "G"],
  selesnya: ["G", "W"],
  orzhov: ["W", "B"],
  izzet: ["U", "R"],
  golgari: ["B", "G"],
  boros: ["R", "W"],
  simic: ["G", "U"]
};
function wh(t, e) {
  if (e.watermark) return e.watermark;
  if (t.watermark) return t.watermark;
  const r = [...new Set(t.faces?.map((s) => s.watermark).filter(Boolean))];
  if (r.length !== 1) return e.watermark;
  const n = ls[r[0]], o = new Set(t.faces?.flatMap(F));
  return n && o.size === 2 && n.every((s) => o.has(s)) ? r[0] : e.watermark;
}
function fo(t) {
  return t.watermark && Object.hasOwn(ls, t.watermark) ? `${P}/img/watermarks/guild-${t.watermark}.svg` : null;
}
function cl(t, e) {
  return `${Qi}/magic-new-split${t ? "-fuse" : ""}.mse-style/multicolor_blend_card${t ? e + 1 : ""}.png`;
}
function Sh(t, e, r, n) {
  if (e === "m15") return [...Xi(t), fo(t)];
  const o = F(t);
  return [
    sn(t, e, r, n),
    fo(t),
    ...e === "eighth" && o.length === 2 ? [
      cl(r, n),
      ...o.map(
        (s) => sn({ ...t, colors: [s], frameColors: void 0 }, e, r, n)
      )
    ] : [],
    ...e === "eighth" && t.artist ? [`${P}/img/manaSymbols/brush.svg`] : []
  ];
}
const Ks = /* @__PURE__ */ new WeakMap();
function gl(t) {
  const e = Ks.get(t);
  if (e) return e;
  const r = B();
  r.width = t.width, r.height = t.height;
  const n = r.getContext("2d", { willReadFrequently: !0 });
  n.drawImage(t, 0, 0);
  const o = n.getImageData(0, 0, r.width, r.height);
  for (let s = 0; s < o.data.length; s += 4) o.data[s + 3] = o.data[s];
  return n.putImageData(o, 0, 0), Ks.set(t, r), r;
}
const Vs = /* @__PURE__ */ new WeakMap();
function vh(t, e, r, n, o) {
  const s = (w) => {
    const S = o.get(w);
    if (!S) throw Error(`Split asset unavailable: ${w}`);
    return S;
  }, a = s(sn(t, e, r, n)), i = F(t);
  if (e !== "eighth" || i.length !== 2) return a;
  "WUBRG".indexOf(i[1]) - "WUBRG".indexOf(i[0]) > 2 && i.reverse();
  const [l, d] = i.map(
    (w) => s(
      sn({ ...t, colors: [w], frameColors: void 0 }, e, r, n)
    )
  ), u = s(cl(r, n)), h = i.join(""), m = Vs.get(a) ?? /* @__PURE__ */ new Map();
  Vs.set(a, m);
  const c = m.get(h);
  if (c?.left === l && c.right === d && c.mask === u) return c.canvas;
  const g = B();
  g.width = a.width, g.height = a.height;
  const f = B();
  f.width = a.width, f.height = a.height;
  const b = g.getContext("2d"), y = f.getContext("2d");
  y.drawImage(d, 0, 0), y.globalCompositeOperation = "destination-in";
  const p = y.createLinearGradient(0, 0, a.width, 0);
  return p.addColorStop(0, "#0000"), p.addColorStop(0.4, "#0000"), p.addColorStop(0.6, "#000"), p.addColorStop(1, "#000"), y.fillStyle = p, y.fillRect(0, 0, a.width, a.height), b.drawImage(l, 0, 0), b.drawImage(f, 0, 0), b.globalCompositeOperation = "destination-in", b.drawImage(gl(u), 0, 0), b.globalCompositeOperation = "destination-over", b.drawImage(a, 0, 0), b.globalCompositeOperation = "source-over", f.width = f.height = 0, m.set(h, { left: l, right: d, mask: u, canvas: g }), g;
}
const Zs = /* @__PURE__ */ new WeakMap();
function Ch(t, e, r, n) {
  const o = fo(e);
  if (!o) return;
  const s = r.get(o);
  if (!s) throw Error(`Split watermark unavailable: ${o}`);
  const a = F(e), i = a.length === 1 ? [a[0], a[0]] : ls[e.watermark], l = i.join(""), d = Zs.get(s) ?? /* @__PURE__ */ new Map();
  Zs.set(s, d);
  let u = d.get(l);
  if (!u) {
    u = B(), u.width = s.width, u.height = s.height;
    const f = u.getContext("2d");
    f.drawImage(s, 0, 0), f.globalCompositeOperation = "source-in";
    const b = {
      W: "#b39f4d",
      U: "#718dac",
      B: "#998795",
      R: "#b6723f",
      G: "#69936e"
    }, [y, p] = i, w = f.createLinearGradient(0, 0, u.width, 0);
    w.addColorStop(0, b[y]), w.addColorStop(0.499, b[y]), w.addColorStop(0.5, b[p]), w.addColorStop(1, b[p]), f.fillStyle = w, f.fillRect(0, 0, u.width, u.height), d.set(l, u);
  }
  const h = e.layout?.startsWith("split-m15") ?? !1, m = Math.min(
    (h ? 135 : 110) / s.width,
    (h ? 125 : e.setCode?.toLowerCase() === "dgm" ? 75 : 100) / s.height
  ), c = s.width * m, g = s.height * m;
  t.save(), t.globalAlpha = 0.3, t.drawImage(u, (h ? 199.5 : 177) - c / 2, n - g / 2, c, g), t.restore();
}
function Gt(t) {
  if (t.frameTemplate) return [];
  if (!["split", "aftermath"].includes(t.layout ?? "") || t.faces?.length !== 2) return [];
  const e = Ae(t), r = Xt(t), n = r === "m15" ? nn : tl;
  return t.faces.map((o, s) => {
    const a = e ? 0.615 : 0.5, i = {
      setCode: t.setCode,
      calibration: t.calibration,
      colorCalibration: t.colorCalibration,
      frameStyle: t.frameStyle,
      rarity: t.rarity,
      securityStamp: t.securityStamp,
      artist: t.artist,
      setSymbol: t.setSymbol,
      setSymbolSource: t.setSymbolSource,
      setSymbolMask: t.setSymbolMask,
      ...o,
      watermark: r ? wh(t, o) : o.watermark,
      layout: e ? s === 0 ? "aftermath-top" : "aftermath-bottom" : r ? `split-${r}${Xe(t) && r !== "old" ? "-fuse" : ""}` : "split-half",
      frameAssetFamily: void 0,
      faces: void 0,
      rulesText: o.rulesText?.split(`
`).filter((l) => !/^Fuse\b/.test(l)).join(`
`),
      rulesParagraphs: o.rulesParagraphs?.filter(
        (l) => !/^Fuse\b/.test(l.runs.map((d) => d.text).join(""))
      ),
      illustration: o.illustration ?? t.illustration,
      etchedIllustration: o.etchedIllustration ?? (o.illustration ? void 0 : t.etchedIllustration),
      illustrationCrop: o.illustrationCrop ?? (!o.illustration && t.illustration ? [s ? a : 0, 0, s ? 1 - a : a, 1] : void 0)
    };
    return e ? s === 0 ? { face: i, x: 0, y: 0, width: 488, height: ve, rotation: 0 } : {
      face: i,
      x: 488,
      y: ve,
      width: Ji,
      height: 488,
      rotation: 90
    } : r ? {
      face: i,
      x: 0,
      y: 680 - s * n,
      width: n,
      height: 488,
      rotation: -90
    } : {
      face: i,
      x: 5,
      y: (s ? 333 : 648) - (ds(t) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function f1(t) {
  return {
    left: `${t.x / T * 100}%`,
    top: `${t.y / L * 100}%`,
    width: `${t.width / T * 100}%`,
    height: `${t.height / L * 100}%`,
    transform: `rotate(${t.rotation}deg)`
  };
}
function fl(t, e) {
  t.translate(e.x, e.y), t.rotate(e.rotation * Math.PI / 180), t.scale(e.width / T, e.width / T);
}
function Qs(t, e) {
  const r = e[0] * t.width, n = e[1] * t.height, o = e[2] * t.width, s = e[3] * t.height;
  return t.rotation === -90 ? [
    (t.x + n) / T,
    (t.y - r - o) / L,
    s / T,
    o / L
  ] : t.rotation === 90 ? [
    (t.x - n - s) / T,
    (t.y + r) / L,
    s / T,
    o / L
  ] : [(t.x + r) / T, (t.y + n) / L, o / T, s / L];
}
function kh(t) {
  return t.layout === "split-half" || t.layout === "aftermath-bottom" ? 1.5 : 1;
}
const ds = Xe;
function Je(t) {
  if (dt(t) || t.frameAssetFamily === "eighth" || t.frameTemplate === "future" || t.frameTemplate === "flip")
    return !1;
  const e = Xt(t);
  return !e || e === "m15" || Ae(t);
}
function Th(t) {
  if (!Je(t)) return { shared: [], stock: [] };
  const e = (n) => ({ shared: [], stock: n });
  if (t.frameAssetFamily === "m15-accurate") {
    const n = xt(t);
    return e(
      n ? [n.frame, ...n.rightFrame ? [n.rightFrame] : [], n.border] : []
    );
  }
  if (t.frameTemplate === "battle") {
    const n = Vo(t);
    return e(n?.kind === "battle" ? [n.border] : []);
  }
  if (Lr(t))
    return e(
      te(t) ? F(t).map((n) => `${Me}/${n.toLowerCase()}.png`) : [an(t)]
    );
  if (kn(t)) return e([De(t)]);
  if (Ae(t))
    return e(Zi(t).filter((n) => n.includes("/aftermath/")));
  if (Xt(t) === "m15")
    return e(
      Gt(t).flatMap(
        (n) => Xi(n.face).filter((o) => /\/[wubrgma]\.png$/.test(o))
      )
    );
  if (K(t) === "saga") return e([rs(t)]);
  const r = he(j(t), K(t));
  return {
    shared: [
      r.frame,
      r.background,
      r.boxes,
      r.pt,
      ...j(t).legendary ? [r.crown] : []
    ],
    stock: []
  };
}
const Mh = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Rh = "#16130e", xh = [22 / 255, 19 / 255, 14 / 255];
function us(t) {
  const e = me(t), r = e.calibration, n = { ...e }, o = typeof r == "object";
  if (o && !Je(e))
    throw Error("M21 calibration requires a modern frame.");
  const s = e.frameAssetFamily ? xt(n) : null, a = r === "source" ? void 0 : (s ? tr(n, s.frame) : void 0) ?? zu(n), i = r === "source" ? {} : Ns(n), l = o ? {} : { ...i }, d = [];
  let u = o ? void 0 : a, h = !1;
  if ((r === "auto" || o) && Je(e)) {
    const m = Th(e), c = j(e), g = {
      name: "",
      setCode: "M21",
      frameStyle: "modern",
      layout: "normal",
      typeLine: c.land ? "Land" : c.artifact ? "Artifact" : "Creature",
      colors: e.colors,
      frameColors: e.frameColors,
      land: c.land,
      artifact: c.artifact,
      legendary: c.legendary,
      colorCalibration: "set-hsb-v1"
    }, f = new Set(m.shared);
    for (const [b, y] of Object.entries(Ns(g)))
      !f.has(b) || l[b] || (l[b] = y, d.push(b));
    if (!u && Pt(e.setCode, e.borderColor).border === "#090806") {
      u = Rh, h = !0;
      for (const b of m.stock)
        l[b] = { ...l[b] ?? Mh, outerStock: xh };
    }
  }
  return {
    face: e,
    materials: l,
    measured: i,
    border: u,
    fallbackStock: h,
    fallbackAssets: d,
    assets: he(j(e)),
    explicitProfile: o
  };
}
const pl = (t) => us(t).materials, Et = (t) => us(t).border, po = (t, e) => {
  const r = me(t);
  return r.calibration === "source" ? void 0 : Di(r, e);
};
function ln(t, e, r = 1, n = 1, o = 0) {
  const s = t.illustrationPlacement;
  if (!s) return e;
  if (!s.every(Number.isFinite) || s[2] <= 0 || s[3] <= 0)
    throw Error("Artwork placement requires finite coordinates and positive dimensions");
  return o === -90 ? rn(s) : [s[0] * r, s[1] * n, s[2] * r, s[3] * n];
}
function dn(t, e, r, n) {
  return Mo(t, e, r, n);
}
function Ah(t, e, r, n, o) {
  const s = [n[0] * t, n[1] * e, n[2] * t, n[3] * e];
  return [...s, ...dn(s[2], s[3], r, o)];
}
function bl(t) {
  return t.faces?.length || t.layout && !["normal", "token", "transform", "modal_dfc", "reversible_card", "meld"].includes(
    t.layout
  ) || t.frameTemplate && t.frameTemplate !== "future" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? "") ? {
    modes: [],
    reason: "Art placement currently requires an ordinary physical face or Futureshifted template."
  } : {
    modes: t.frameTemplate === "future" && t.futureTreatment !== "full-art" ? ["window", "behind-text"] : ["window"]
  };
}
function hs(t) {
  const e = t.artPlacement;
  if (e !== void 0) {
    if (!e || typeof e != "object" || Array.isArray(e))
      throw Error("Invalid artwork placement");
    if (Object.keys(e).some((r) => !["mode", "focalPoint", "zoom", "paperOpacity"].includes(r)))
      throw Error("Unknown artwork placement option");
    if (!bl(t).modes.includes(e.mode))
      throw Error("This frame does not support the selected art placement.");
    if (e.paperOpacity !== void 0 && (e.mode !== "behind-text" || !Number.isFinite(e.paperOpacity) || e.paperOpacity < 0 || e.paperOpacity > 1))
      throw Error("Paper opacity requires behind-text mode and a value within 0..1");
    Mo(1, 1, [0, 0, 1, 1], e);
  }
}
function Lh(t, e) {
  const { illustrationPlacement: r, ...n } = t, o = { ...n, artPlacement: structuredClone(e) };
  return hs(o), o;
}
function p1(t, e, r) {
  if (hs(t), !Number.isFinite(e) || !Number.isFinite(r) || e <= 0 || r <= 0)
    throw Error("Artwork dimensions must be positive");
  const n = t.illustrationCrop ?? [0, 0, 1, 1], o = Ft(t).art, s = t.frameTemplate === "battle", a = s ? ln(t, rn(o), 523, 375, -90) : ln(
    t,
    [o[0] * 488, o[1] * 680, o[2] * 488, o[3] * 680],
    488,
    680
  ), i = Mo(e * n[2], r * n[3], a, t.artPlacement);
  return {
    source: n,
    destination: s ? Jo(i) : [i[0] / 488, i[1] / 680, i[2] / 488, i[3] / 680],
    aperture: o
  };
}
const Yr = {
  fontSize: 19.5,
  fontFamily: '"CardRenderer MTG Beleren", Georgia',
  fontWeight: 700,
  ink: "#fff",
  numeralOffsetX: -0.5,
  numeralOffsetY: { plus: -0.25, zero: -3.25, minus: -4.5 },
  horizontalInset: 10,
  widthScale: 0.97
};
function Eh(t, e, [r, n, o, s]) {
  yl(t, e, 24, r + o / 2, n + s / 2 + 2.5, o * 0.72);
}
function Bh(t, e, [r, n, o, s]) {
  const a = Yr, i = a.numeralOffsetY[e.startsWith("+") ? "plus" : e === "0" ? "zero" : "minus"];
  yl(
    t,
    e,
    a.fontSize,
    r + o / 2 + a.numeralOffsetX,
    n + s / 2 + i,
    o - a.horizontalInset,
    a.widthScale
  );
}
function yl(t, e, r, n, o, s, a = 1) {
  t.save(), t.fillStyle = Yr.ink, t.font = `${Yr.fontWeight} ${r}px ${Yr.fontFamily}`, t.textAlign = "center", t.textBaseline = "alphabetic", t.letterSpacing = "0px", t.shadowColor = "transparent";
  const i = t.measureText(e), l = Math.min(s, i.width * a), d = Math.min(1, l / Math.max(1, i.width)), u = n + (i.actualBoundingBoxLeft - i.actualBoundingBoxRight) * d / 2, h = o + (i.actualBoundingBoxAscent - i.actualBoundingBoxDescent) / 2;
  t.fillText(e, u, h, l), t.restore();
}
function bo(t, e) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.letterSpacing = "0px", t.fillStyle = Pt(e.setCode, e.borderColor).ink, t.textBaseline = "alphabetic", t.textAlign = "left", t.font = '11px "CardRenderer MTG Relay", sans-serif', Y(
    t,
    e,
    "collector",
    () => t.fillText(Po(e), 30, 645)
  );
  const r = (e.collectorSetCode ?? e.setCode)?.trim().toUpperCase() ?? "", n = r ? `${r} • ${e.collectorLanguage?.toUpperCase() ?? "EN"}` : "";
  Y(t, e, "collector", () => t.fillText(n, 30, 658));
  const o = Go(e), s = e.power != null && e.toughness != null || e.loyalty != null;
  let a = 30 + t.measureText(n).width + (n ? 7 : 0);
  Y(t, e, "artist", () => {
    e.artist && (t.font = '11px "CardRenderer MTG Artist Credit", sans-serif', t.fillText("a", a, 658), a += t.measureText("a").width + 2, t.font = '700 11px "CardRenderer MTG Beleren Small Caps", Georgia', t.fillText(e.artist, a, 658, Math.max(1, (o && s ? 272 : 456) - a)));
  }), o && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', Y(t, e, "legal", () => t.fillText(o, 456, s ? 658 : 645, 178))), t.restore();
}
const ta = /* @__PURE__ */ new WeakMap();
function Ih(t) {
  const e = ta.get(t);
  if (e) return e;
  const r = B();
  r.width = r.height = 16;
  try {
    const n = r.getContext("2d", { willReadFrequently: !0 });
    n.drawImage(t, 0, 0, 16, 16);
    const o = n.getImageData(0, 0, 16, 16).data, s = [[], [], []];
    for (let i = 0; i < 16; i++)
      for (let l = 0; l < 16; l++) {
        if (l > 0 && l < 15 && i > 0 && i < 15) continue;
        const d = (i * 16 + l) * 4;
        o[d + 3] < 128 || s.forEach((u, h) => u.push(o[d + h]));
      }
    const a = `rgb(${s.map((i) => i.sort((l, d) => l - d)[Math.floor(i.length / 2)] ?? 128).join(" ")})`;
    return ta.set(t, a), a;
  } finally {
    r.width = r.height = 0;
  }
}
function _t(t, e, r, n, o, s = [488, 680], a = 0) {
  const [i, l, d, u] = n, h = K(e);
  if (t.save(), h.startsWith("planeswalker") && bh(t, h === "planeswalker-large"), o === "printing") {
    t.clearRect(i, l, d, u), t.restore();
    return;
  }
  const m = r.get(e.illustration ?? "");
  if ((o === "artwork" || h.startsWith("planeswalker") || e.illustrationPlacement) && (t.fillStyle = m && e.illustrationPlacement ? Ih(m) : "#80745c", t.fillRect(i, l, d, u)), !m) {
    t.restore();
    return;
  }
  t.beginPath(), t.rect(i, l, d, u), t.clip();
  const c = ln(e, n, s[0], s[1], a);
  e.illustrationCrop ? t.drawImage(
    m,
    ...Ah(
      m.width,
      m.height,
      c,
      e.illustrationCrop,
      e.artPlacement
    )
  ) : t.drawImage(
    m,
    ...dn(m.width, m.height, c, e.artPlacement)
  ), t.restore();
}
const ea = /* @__PURE__ */ new WeakMap();
function qr(t) {
  const e = ea.get(t);
  if (e) return e;
  const r = B();
  r.width = t.width, r.height = t.height;
  const n = r.getContext("2d", { willReadFrequently: !0 });
  n.drawImage(t, 0, 0);
  const o = n.getImageData(0, 0, r.width, r.height);
  for (let s = 0; s < o.data.length; s += 4)
    o.data[s + 3] = Math.round(o.data[s] * o.data[s + 3] / 255), o.data[s] = o.data[s + 1] = o.data[s + 2] = 255;
  return n.putImageData(o, 0, 0), ea.set(t, r), r;
}
function Oh(t) {
  const e = pt(t) === "full-art", r = j(t), n = !e && (r.land || pt(t) === "regular" && !r.artifact && F(t).length === 0), [o, s, a, i] = e ? [0.9967, 0.9995, -2.125, -0.85] : n ? [0.9976, 0.997, -1.925, -0.3] : [0.9867, 0.9929, 0, -0.175], l = e || n ? [0, 680] : [0, 85, 370, 385, 416, 430, 610, 680], d = e || n ? [0, 0] : [0, 0, 1, 1, 1.45, 1.45, 0, 0];
  return {
    sx: o,
    tx: a,
    source: l,
    target: l.map((u, h) => 340 + (u - 340) * s + i + d[h])
  };
}
function $h(t, e) {
  const r = B();
  r.width = t.width, r.height = t.height;
  const n = r.getContext("2d"), o = Oh(e), s = t.height / 680;
  try {
    for (let a = 0; a < o.source.length - 1; a++) {
      const i = o.source[a], l = o.source[a + 1], d = o.target[a], u = o.target[a + 1], h = (u - d) / (l - i), m = Math.round(d * s), c = Math.round(u * s);
      n.save(), n.beginPath(), n.rect(0, m, r.width, c - m), n.clip(), n.transform(
        o.sx,
        0,
        0,
        h,
        (244 * (1 - o.sx) + o.tx) * s,
        (d - h * i) * s
      ), n.drawImage(t, 0, 0), n.restore();
    }
    return r;
  } catch (a) {
    throw r.width = r.height = 0, a;
  }
}
function Tr(t, e) {
  const r = B();
  return r.width = t, r.height = e, r;
}
function Gh(t, e) {
  const r = Tr(t.width, t.height), n = r.getContext("2d"), o = Tr(t.width, t.height), s = o.getContext("2d");
  for (const [a, i] of [t, e].entries()) {
    s.clearRect(0, 0, o.width, o.height), s.globalCompositeOperation = "source-over", s.drawImage(i, 0, 0, o.width, o.height);
    const l = s.createLinearGradient(o.width * 0.4, 0, o.width * 0.6, 0);
    l.addColorStop(0, a ? "#0000" : "#000"), l.addColorStop(1, a ? "#000" : "#0000"), s.globalCompositeOperation = "destination-in", s.fillStyle = l, s.fillRect(0, 0, o.width, o.height), n.globalCompositeOperation = "lighter", n.drawImage(o, 0, 0);
  }
  return o.width = o.height = 0, r;
}
function Ph(t, e) {
  const r = ee(t), n = Tr(976, 1360), o = n.getContext("2d"), s = (l) => {
    const d = e.get(l);
    if (!d) throw Error(`Futureshifted frame asset unavailable: ${l}`);
    return d;
  }, a = (l, d, u, h) => {
    if (!d) return s(l);
    const m = Gh(s(l), s(d));
    if (u && h) {
      const c = m.getContext("2d");
      c.globalCompositeOperation = "destination-in", c.drawImage(qr(s(h)), 0, 0, m.width, m.height), c.globalCompositeOperation = "destination-over", c.drawImage(s(u), 0, 0, m.width, m.height);
    }
    return m;
  }, i = (l, d, u, h, m) => {
    o.drawImage(l, d, u, h, m), l instanceof ImageBitmap || (l.width = l.height = 0);
  };
  try {
    if (o.scale(976 / 375, 1360 / 523), i(
      a(r.base, r.reverseBase, r.neutralBase, r.baseBlend),
      0,
      0,
      375,
      523
    ), r.mask) {
      o.save(), o.globalCompositeOperation = "destination-out";
      const l = pt(t) === "full-art";
      if (!l && pt(t) !== "clear") {
        const [, c, , g] = jo({ ...t, artPlacement: void 0 }).art;
        o.beginPath(), o.rect(0, c * 523 / 680, 375, g * 523 / 680), o.clip();
      }
      const [d, u, h, m] = l ? [37, 46, 322, 418] : [32, 44, 327, 310];
      o.drawImage(qr(s(r.mask)), d, u, h, m), o.restore();
    }
    if (r.paper && i(a(r.paper, r.reversePaper), 23, 320, 335, 152), r.type && i(
      a(r.type, r.reverseType, r.neutralType, r.typeBlend),
      18,
      17,
      339,
      464
    ), t.artPlacement?.mode === "behind-text") {
      o.save(), o.globalCompositeOperation = "destination-out", o.globalAlpha = 1 - (t.artPlacement.paperOpacity ?? 0.8);
      const l = new Path2D("M33 326 C25 350 22 413 37 465 L337 465 C351 450 354 379 344 326 Z");
      o.fill(l), o.restore();
    }
    if (r.stats)
      if (r.statsMask) {
        const l = Tr(156, 102), d = l.getContext("2d");
        d.drawImage(s(r.stats), 0, 0, 156, 102), d.globalCompositeOperation = "destination-in", d.drawImage(qr(s(r.statsMask)), 0, 0, 156, 102), i(l, 279, 454, 78, 51);
      } else r.paper ? o.drawImage(s(r.stats), 285, 452, 70, 52) : o.drawImage(s(r.stats), 375 * 0.7621, 523 * 0.8834, 375 * 0.1734, 523 * 0.0781);
    return $h(n, t);
  } finally {
    n.width = n.height = 0;
  }
}
function Wh(t, e) {
  const r = Tr(t.width, t.height), n = r.getContext("2d");
  return n.fillStyle = "white", pt(e) === "clear" || e.artPlacement?.mode === "behind-text" ? n.fillRect(46, 44, 442 * 2, 637 * 2) : (n.fillRect(48, 160, 444 * 2, (pt(e) === "full-art" ? 482 : 303) * 2), n.globalCompositeOperation = "destination-out", n.drawImage(t, 0, 0)), r;
}
function Fh(t, e, r) {
  const [n, o, s, a] = r, i = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((l) => ({ role: "rules", runs: [{ text: l }] }));
  return O(
    t,
    i,
    { x: n - 0.375, y: o, width: s, height: a },
    17.6 * 4 / 3,
    32 / 3,
    {
      leading: 0.95,
      paragraphGap: 0.4,
      flavorGap: 0.5,
      flavorOrphans: !1,
      flavorSeparator: !1,
      centerOffset: 0.875
    }
  );
}
function nr(t, e, r, n, o, s, a, i, l = 1 / 0) {
  const d = (c) => (c.align === void 0 || c.align === "center") && c.runs.length > 0 && c.runs.every((g) => !g.text.includes(`
`));
  if (!r.length || !r.every(d) || !e.every(d)) return null;
  const u = r.map((c) => c.runs.map((g) => g.text).join("")).join(`
`);
  if (Array.from(u.replace(/\{[^}]+\}/g, "●")).length > l) return null;
  const h = (c) => c.map((g) => ({ ...g, align: "center" })), m = O(t, h(r), n, o, o, i);
  return m.overflow || m.lines.length > a ? null : O(t, h(e), n, o, s, i);
}
const Ke = {
  ordinary: [0.436 * 488, 0.9034 * 680, 0.128 * 488, 0.0458 * 680],
  planeswalker: [0.4394 * 488, 0.9015 * 680, 0.1214 * 488, 0.051 * 680],
  saga: [213.7, 620.2, 60.5, 25.3],
  aftermath: [222, 623, 43, 20],
  split: [223.5, 620, 43, 21.5]
}, b1 = {
  ordinary: { size: [192, 96], interior: [29, 29, 134, 67] },
  planeswalker: { size: [182, 107], interior: [24, 26, 134, 67] },
  saga: { size: [186, 78], interior: [26, 11, 134, 67] },
  plain: { size: [134, 67], interior: [0, 0, 134, 67] }
};
function Ce(t) {
  if (!Jt(t) || dt(t) || t.frameAssetFamily === "eighth" || t.frameTemplate || t.faces?.length || t.layout && !["normal", "planeswalker", "transform", "modal_dfc", "meld"].includes(t.layout))
    return null;
  const e = K(t), r = e.startsWith("planeswalker");
  if (e !== "normal" && !r) return null;
  const n = j(t), o = n.boxes === "Gold" ? "M" : n.boxes === "Artifact" ? "A" : n.boxes === "Land" ? "L" : n.boxes === "Colourless" ? r ? "A" : "C" : n.boxes, s = F(t);
  s.length === 2 && "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 && s.reverse();
  const a = s.length > 2 ? ["M"] : s.length ? s : [o], i = (l) => r ? `${P}/img/frames/planeswalker/holo/${l.toLowerCase()}.png` : `${P}/img/frames/m15/holoStamps/m15HoloStamp${l}.png`;
  return {
    image: i(a[0]),
    ...a.length === 2 ? { rightImage: i(a[1]) } : {},
    rect: r ? Ke.planeswalker : Ke.ordinary
  };
}
function wl(t, e, r) {
  const n = Ce(e);
  if (!n) return;
  const o = r.get(n.image);
  if (!o) throw Error("Authenticity stamp asset is unavailable.");
  t.save(), t.shadowColor = "transparent", t.drawImage(o, ...n.rect), t.restore();
}
const _h = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function Uh(t) {
  return !_h.has(t?.trim().toLowerCase() ?? "");
}
function jh(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = xt(t);
  if (!(!e || !Wt(t, e.frame)))
    return t.frameTreatment === "colorshifted" ? [0.7234, 0.881, 0.204, 0.0772] : [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814];
}
function Dh(t, e, r) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return e;
  const n = xt(t);
  if (!n || !Wt(t, n.frame) || !e.lines.length)
    return e;
  let o = 0;
  const s = e.lines.map((m, c) => {
    if (c) {
      const g = e.lines[c - 1], f = g.runs[0]?.size ?? e.size, b = m.baseline - g.baseline - f, y = g.role === "rules" && m.role === "flavor" ? 0.625 / 0.9 : 0.4375 / 0.45;
      o += f * (0.965 - 1) + b * (y - 1);
    }
    return {
      ...m,
      x: (m.x ?? e.x) + 2.25,
      baseline: m.baseline + o,
      inkBounds: [
        m.inkBounds[0] + 2.25,
        m.inkBounds[1] + o,
        m.inkBounds[2],
        m.inkBounds[3]
      ]
    };
  }), a = s[0], i = s.at(-1), l = i.inkBounds[1] + i.inkBounds[3] - a.inkBounds[1], d = r.y + Math.max(0, (r.height - l) / 2), u = d - a.inkBounds[1], h = s.map((m) => ({
    ...m,
    baseline: m.baseline + u,
    inkBounds: [
      m.inkBounds[0],
      m.inkBounds[1] + u,
      m.inkBounds[2],
      m.inkBounds[3]
    ]
  }));
  return l > r.height + 0.01 || h.some(
    (m) => r.exclusions?.some(([c, g, f, b]) => {
      const [y, p, w, S] = m.inkBounds;
      return y < c + f && y + w > c && p < g + b && p + S > g;
    })
  ) ? e : { ...e, x: e.x + 2.25, top: d, height: l, lines: h };
}
function Nh(t, e, r, n, o) {
  if (e.setCode?.toLowerCase() !== "plc" || e.frameAssetFamily !== "eighth" || e.frameTemplate || e.layout && e.layout !== "normal" || n.size !== 24.5 || n.lines.length > 5)
    return n;
  const s = xt(e);
  if (!s || !Wt(e, s.frame)) return n;
  const a = {
    leading: 0.965,
    paragraphGap: 0.4375,
    flavorGap: 0.625,
    flavorSeparator: !1
  }, i = { ...o, x: n.x }, l = (d) => r.some((u) => {
    if (u.runs.some((c) => c.text.includes(`
`))) return !1;
    const h = O(
      t,
      [u],
      { ...i, height: 1e3, exclusions: [] },
      d,
      d,
      a
    ), m = h.lines.at(-1);
    return h.lines.length < 2 || !m || m.width >= o.width * 0.35 ? !1 : u.role === "rules" || (m.runs.map((c) => c.text).join("").trim().match(/\S+/g)?.length ?? 0) === 1;
  });
  if (!l(n.size)) return n;
  for (let d = n.size - 0.25; d >= n.size - 2; d -= 0.25) {
    const u = O(t, r, i, d, d, a);
    if (!u.overflow && u.lines.length < n.lines.length && !l(d))
      return u;
  }
  return n;
}
function Sl(t, e, r = L, n = 1) {
  const o = Ft(e), s = jh(e), a = s ?? o.stats, i = {
    ...Vr,
    flavorSeparator: e.frameAssetFamily === "eighth" ? !1 : Uh(e.setCode)
  }, [l, d, u, h] = o.rules, m = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((p) => ({ role: "rules", runs: [{ text: p }] })), c = Ce(e), g = {
    x: l * T + (e.frameAssetFamily ? 0 : 3.5),
    y: d * r + (e.frameAssetFamily ? 0 : 7),
    width: u * T - (e.frameAssetFamily ? 0 : 9.5),
    height: h * r - (e.frameAssetFamily ? 0 : 8),
    // Fit actual line ink around the existing power/toughness plate. Short
    // final lines can use the lower left area without being painted over.
    exclusions: [
      ...e.power != null && e.toughness != null ? [
        [
          a[0] * T - 2,
          a[1] * r - 2,
          a[2] * T + 4,
          a[3] * r + 4
        ]
      ] : [],
      ...c ? [
        [
          c.rect[0] - 1,
          (c.rect[1] - 1) * r / L,
          c.rect[2] + 2,
          (c.rect[3] + 2) * r / L
        ]
      ] : []
    ]
  }, f = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? m : m;
  if (e.rulesAlignment?.mode !== "left" && ["10e", "m10", "m11", "m12", "m13", "m14"].includes(e.setCode?.toLowerCase() ?? "") && f.every((p) => p.role === "rules")) {
    const p = nr(
      t,
      m,
      f,
      g,
      24.5 * n,
      15 * n,
      3,
      { ...i, balanceLines: !0 }
    );
    if (p) return p;
  }
  const b = e.rulesAlignment?.mode === "left" ? m.map((p) => p.role === "rules" ? { ...p, align: "left" } : p) : m;
  let y = O(t, b, g, 24.5 * n, 15 * n, i);
  return y.overflow && s && (y = O(t, b, g, y.size, 12 * n, i)), Nh(
    t,
    e,
    b,
    Dh(e, y, g),
    g
  );
}
function Rt(t, e, r, n = st, o = 0, s = "#17140f") {
  if (!re(t)) return;
  if (e.overflow) throw Error("Magic rules text does not fit the available area.");
  t.save(), e.horizontalScale && t.scale(e.horizontalScale, 1), t.textAlign = "left", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
  for (const l of e.separators) {
    const d = t.createLinearGradient(e.x, l, e.x + e.width, l);
    d.addColorStop(0, "#17140f00"), d.addColorStop(0.15, "#17140f55"), d.addColorStop(0.85, "#17140f55"), d.addColorStop(1, "#17140f00"), t.fillStyle = d, t.fillRect(e.x, l, e.width, 0.6);
  }
  t.fillStyle = s;
  const a = o > 0 ? B() : null;
  a && (a.width = t.canvas.width, a.height = t.canvas.height);
  const i = a ? a.getContext("2d") : t;
  if (!i) throw Error("Missing rules text context");
  a && (i.setTransform(t.getTransform()), i.textAlign = "left", i.textBaseline = "alphabetic", i.letterSpacing = "0px", i.fillStyle = s);
  for (const l of e.lines) {
    let d = l.x ?? e.x;
    for (const u of l.runs)
      u.symbol ? n(
        t,
        u.text,
        d + u.size * 0.025,
        l.baseline - u.size * 0.72,
        u.size * 0.8,
        r
      ) : (i.font = Zn(u.size, u.italic), ra(i, u, d, l.baseline, !1)), d += u.width;
  }
  if (a) {
    i.globalCompositeOperation = "destination-out", i.lineJoin = "round";
    for (const l of e.lines) {
      let d = l.x ?? e.x;
      for (const u of l.runs)
        u.symbol || (i.font = Zn(u.size, u.italic), i.lineWidth = u.size * o * 2, ra(i, u, d, l.baseline, !0)), d += u.width;
    }
    t.resetTransform(), t.drawImage(a, 0, 0), a.width = a.height = 0;
  }
  t.restore();
}
function ra(t, e, r, n, o) {
  const s = e.textWidth ?? 1;
  if (s === 1) {
    o ? t.strokeText(e.text, r, n) : t.fillText(e.text, r, n);
    return;
  }
  t.save(), t.translate(r, n), t.scale(s, 1), o ? t.strokeText(e.text, 0, 0) : t.fillText(e.text, 0, 0), t.restore();
}
function zh(t) {
  const e = pt(t);
  if (t.setCode?.toLowerCase() !== "fut" || e === "clear") return;
  const r = Q(t), n = z.CONJURER_ROOT + "/img/setSymbols/official/fut-";
  if (!["c", "u", "r"].some((l) => r === n + l + ".svg")) return;
  const [o, s, a, i] = e === "full-art" ? [443.5625, 581.8125, 28.1875, 20.976866533333336] : ee(t).base.includes("/future/regular/futureFrame") ? [443.5, 405.125, 29, 21.851866533333336] : [443.5, 405.5, 27.875, 22.226866533333336];
  return [o - a / 2, s - i / 2, a, i];
}
function Yh(t, e, r, n, o) {
  Fi(e);
  const s = Ph(e, r), a = Wh(s, e), i = jo(e), l = ee(e), d = j(e), u = _i(e);
  t.save();
  try {
    if (!n) {
      const C = Et(e);
      t.fillStyle = C ?? "#080808", t.fillRect(0, 0, 488, 680), C && (t.fillStyle = "#080808", t.fillRect(17, 17, 454, 646));
    }
    if (o && t.drawImage(o, 0, 0, 488, 680), n !== "printing") {
      const C = B();
      C.width = 976, C.height = 1360;
      try {
        const k = C.getContext("2d");
        k.scale(2, 2);
        const R = pt(e) === "clear" ? [23, 22, 442, 637] : i.art;
        _t(k, e, r, R, "artwork"), k.globalCompositeOperation = "destination-in", k.drawImage(a, 0, 0, 488, 680), t.drawImage(C, 0, 0, 488, 680);
      } finally {
        C.width = C.height = 0;
      }
    }
    if (n === "artwork") return;
    t.drawImage(s, 0, 0, 488, 680), l.typeSymbol && t.drawImage(r.get(l.typeSymbol), 31.2, 31.2, 27.3, 26), t.shadowColor = "transparent", Y(t, e, "manaCost", () => Qu(t, e, r));
    const h = u.length === 1 && u[0] !== "W", m = (C, k, R, M, x = !1) => {
      t.textAlign = "left", t.textBaseline = "middle", at(
        t,
        C,
        k[0] + 1.25,
        k[1] + k[3] / 2 + M,
        k[2],
        R,
        !0,
        1,
        "CardRenderer MTG Matrix",
        0,
        x ? e.textInk : void 0
      );
    };
    t.fillStyle = h ? "#fff" : "#111", m(e.name, i.title, 30.248, 1.25), m(e.typeLine ?? "", i.type, 24.969, -1.5, !0);
    const c = d.land && u.length === 2 && !u.includes("W") ? "#fff" : "#111";
    pt(e) !== "full-art" && Rt(t, Fh(t, e, i.rules), r, void 0, 0, c), e.power != null && e.toughness != null && (t.fillStyle = h ? "#fff" : "#111", t.textAlign = "center", t.textBaseline = "middle", t.font = '700 29.97px "CardRenderer MTG Matrix Small Caps"', t.save(), t.translate(i.stats[0] + i.stats[2] / 2 - 1.5, i.stats[1] + i.stats[3] / 2 - 0.25), t.scale(0.99, 1), mt(t, `${e.power}/${e.toughness}`, 0, 0, i.stats[2] / 0.99, e.textInk), t.restore());
    const g = r.get(Q(e) ?? "");
    Y(t, e, "setSymbol", () => {
      if (g) {
        const [C, k, R, M] = i.symbol, x = Math.min(R / g.width, M / g.height), E = zh(e) ?? [
          C + (R - g.width * x) / 2,
          k + (M - g.height * x) / 2,
          g.width * x,
          g.height * x
        ];
        t.drawImage(g, E[0], E[1], E[2], E[3]);
      }
    }), t.fillStyle = d.land || h ? "#fff" : "#111", t.textAlign = "right", t.textBaseline = "alphabetic";
    const f = e.power != null && e.toughness != null ? 361 : 442, b = pt(e) === "full-art", y = b ? 16.6 : 17.845, p = b ? 627 : 626.5;
    t.font = `400 ${y}px "CardRenderer MTG Matrix"`;
    const w = e.artist ?? "";
    Y(t, e, "artist", () => {
      t.fillText(w, f, p, f - 70);
      const C = l.brush ? r.get(l.brush) : void 0;
      C && t.drawImage(C, f - t.measureText(w).width - 40, p - 10, 36, 8);
    });
    const S = Go(e), v = Po(e, !1);
    if (S || v) {
      t.font = '11.804px "CardRenderer MTG MPlantin"';
      const C = [S, v].filter(Boolean).join(" ");
      if (!e.printingElements?.legal?.offset && !e.printingElements?.collector?.offset)
        t.fillText(C, f - 0.25, 641.25, f - 40);
      else {
        const k = t.measureText(C).width, R = Math.min(1, (f - 40) / Math.max(1, k));
        t.save(), t.translate(f - 0.25, 641.25), t.textAlign = "left";
        const M = (x, E) => {
          t.save(), t.scale(R, 1), t.fillText(x, E, 0), t.restore();
        };
        S && Y(t, e, "legal", () => M(S, -k)), v && Y(
          t,
          e,
          "collector",
          () => M(v, -t.measureText(v).width)
        ), t.restore();
      }
    }
  } finally {
    s.width = s.height = a.width = a.height = 0, t.restore();
  }
}
const Ve = 96 / 72;
function br(t, e, r, n, o, s) {
  const [a, i, l, d] = r;
  t.textAlign = "left", t.textBaseline = "middle", at(
    t,
    e,
    a,
    i + d / 2,
    l,
    n * Ve,
    o !== "CardRenderer MTG Matrix",
    1,
    o,
    0,
    s
  );
}
function vl(t, e, r, n, o, s) {
  const a = e.manaSymbols ?? [], i = s + 1;
  return a.forEach(
    (l, d) => st(t, l, n - a.length * i + d * i, o, s, r, !0)
  ), a.length * i;
}
function Cl(t, e, r, n, o, s, a = "#17140f") {
  if (!re(t)) return;
  const [i, l, d, u] = n, h = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((c) => ({ role: "rules", runs: [{ text: c }] })), m = O(t, h, { x: i, y: l, width: d, height: u }, o * Ve, s * Ve, {
    leading: 0.95,
    paragraphGap: 0.4,
    flavorGap: 0.5,
    flavorOrphans: !1
  });
  if (m.overflow) throw Error("Standard template text exceeds its minimum readable size.");
  Rt(t, m, r, void 0, 0, a);
}
function kl(t, e, r, n, o) {
  if (e.power == null || e.toughness == null) return;
  const [s, a, i, l] = r;
  t.font = `bold ${n * Ve}px "${o}", Georgia`, t.textAlign = "center", t.textBaseline = "middle", mt(t, `${e.power}/${e.toughness}`, s + i / 2, a + l / 2, i, e.textInk);
}
function Tl(t, e, r, n) {
  const [o, s, a] = r;
  t.fillStyle = n, t.textAlign = "left", t.textBaseline = "top", t.font = `${10 * Ve}px "CardRenderer MTG Matrix", Georgia`, t.fillText(e.artist ?? "", o, s, a), e.legalText && (t.font = `${6.5 * Ve}px "CardRenderer MTG MPlantin", Georgia`, t.fillText(e.legalText, o, s + 14, a));
}
const na = [
  {
    title: [32, 30, 311, 23],
    rules: [37, 59, 302, 67],
    type: [33, 134, 310, 18],
    stats: [290, 130, 60, 28]
  },
  {
    title: [32, 49, 311, 23],
    rules: [37, 80, 302, 67],
    type: [33, 155, 310, 18],
    stats: [290, 150, 60, 28]
  }
];
function qh(t, e, r, n, o) {
  if (e.faces?.length !== 2) throw Error("A flip template needs exactly two printed panels.");
  const s = e.faces[0], a = e.faces[1];
  if (o !== "artwork")
    for (const [m, c] of [n.base, n.reverse].entries()) {
      const g = r.get(c);
      if (!g) throw Error(`Flip frame unavailable: ${c}`);
      t.save(), m && (t.beginPath(), t.rect(0, 344, 375, 179), t.clip()), t.drawImage(g, 0, 0, 375, 523), t.restore();
    }
  if (_t(t, e, r, [32, 162, 311, 182], o), o === "artwork") return;
  for (const [m, c, g] of [
    [n.stats, n.statsMask, [285, 123, 70, 38]],
    [n.reverseStats, n.reverseStatsMask, [18, 342, 70, 38]]
  ]) {
    if (!m || !c) continue;
    const f = r.get(m), b = r.get(c);
    if (!f || !b) throw Error("Missing flip statistics plate");
    const y = B();
    y.width = 140, y.height = 76;
    const p = y.getContext("2d");
    p.drawImage(f, 0, 0, 140, 76), p.globalCompositeOperation = "destination-in", p.drawImage(qr(b), 0, 0, 140, 76), t.drawImage(y, g[0], g[1], g[2], g[3]), y.width = y.height = 0;
  }
  t.shadowColor = "transparent", t.fillStyle = "#17140f";
  const i = "CardRenderer MTG Matrix", l = (m, c, g, f, b) => {
    const y = vl(t, m, r, c[0] + c[2], c[1] + 1, 15);
    br(
      t,
      m.name,
      [c[0], c[1], Math.max(1, c[2] - y - 4), c[3]],
      17,
      i
    ), br(
      t,
      m.typeLine ?? "",
      [f[0], f[1], f[2] - (m.power != null ? 60 : 0), f[3]],
      14,
      i,
      m.textInk
    ), Cl(t, m, r, g, 14, 8), kl(t, m, b, 17, i);
  }, d = na[0], u = na[1];
  l(s, d.title, d.rules, d.type, d.stats), t.save(), t.translate(375, 523), t.rotate(Math.PI), l(a, u.title, u.rules, u.type, u.stats), t.restore();
  const h = r.get(Q(e) ?? "");
  if (h) {
    const m = Math.min(44 / h.width, 22 / h.height);
    t.drawImage(h, 353 - h.width * m, 482, h.width * m, h.height * m);
  }
  Tl(t, e, [58, 479, 217, 26], "#17140f");
}
function Hh(t, e, r, n, o) {
  const s = e.frameTemplate;
  if (!s) throw Error("Missing standard template");
  if (s === "future") return Yh(t, e, r, n, o);
  const a = Ko[s], i = (u) => {
    const h = r.get(u);
    if (!h) throw Error(`Standard template asset unavailable: ${u}`);
    return h;
  }, l = Vo(e);
  if (!l) throw Error("Missing template assets");
  const d = i(l.base);
  t.save();
  try {
    if (n !== "artwork" && (t.fillStyle = Et(e) ?? "#090806", t.fillRect(0, 0, 488, 680)), o && t.drawImage(o, 0, 0, 488, 680), s === "battle" ? (t.translate(0, 680), t.rotate(-Math.PI / 2), t.scale(680 / 523, 488 / 375)) : t.scale(488 / 375, 680 / 523), l.kind === "flip") {
      qh(t, e, r, l, n);
      return;
    }
    if (l.kind !== "battle") throw Error("Unexpected standard template branch");
    if (n !== "artwork" && t.drawImage(i(l.texture), 0, 0, 523, 375), _t(t, e, r, a.art, n, a.size, -90), n === "artwork") return;
    t.drawImage(d, 0, 0, a.size[0], a.size[1]), t.drawImage(i(l.border), 0, 0, 523, 375), e.defense != null && t.drawImage(i(l.defense), 459, 322, 64, 52), t.shadowColor = "transparent", t.fillStyle = "#17140f";
    const u = "CardRenderer MTG Beleren";
    let h = a.title;
    const m = vl(t, e, r, 484, 20, 15);
    h = [h[0], h[1], Math.max(1, h[2] - m - 5), h[3]], br(t, e.name, h, a.titleSize, u), br(t, e.typeLine ?? "", a.type, a.typeSize, u, e.textInk), t.fillStyle = "#17140f", Cl(t, e, r, a.rules, a.rulesSize, a.minimumSize), s === "battle" && e.defense != null ? (t.fillStyle = "white", br(t, String(e.defense), a.stats, 17, u)) : kl(t, e, a.stats, 18, u);
    const c = th(t, e);
    c && (t.fillStyle = pr.color, t.font = c.font, t.textAlign = "right", t.textBaseline = "alphabetic", t.letterSpacing = "0px", t.fillText(c.text, c.x, c.baseline));
    const g = r.get(Q(e) ?? "");
    if (g) {
      const [f, b, y, p] = a.symbol, w = Math.min(y / g.width, p / g.height);
      t.drawImage(
        g,
        f + y - g.width * w,
        b + (p - g.height * w) / 2,
        g.width * w,
        g.height * w
      );
    }
    Tl(t, e, a.footer, "white");
  } finally {
    t.restore();
  }
}
let oa, sa;
function Xh(t) {
  return t.frameTemplate ? t.frameTemplate === "battle" ? t.reverseStats ? sa ??= lt().load(pr.font).then(() => {
  }).catch((e) => {
    throw sa = void 0, e;
  }) : Promise.resolve() : oa ??= Promise.all([
    lt().load('400 24px "CardRenderer MTG Matrix"'),
    lt().load('700 24px "CardRenderer MTG Matrix"'),
    lt().load('700 24px "CardRenderer MTG Matrix Small Caps"')
  ]).then(() => {
  }).catch((e) => {
    throw oa = void 0, e;
  }) : Promise.resolve();
}
function Jh(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = xt(t);
  if (!(!e || !Wt(t, e.frame)))
    return { dx: 1.25, dy: -2.9375, scaleX: 1.005, scaleY: 0.99375 };
}
function Kh(t, e, r) {
  if (!(t.setSymbol || !Wt(t, e) || !["c", "u", "r"].some(
    (n) => r === `${P}/img/setSymbols/official/plc-${n}.svg`
  )))
    return [411, 388.75, 34, 25.5];
}
const Vh = {
  scaleX: 1.01,
  scaleY: 1.01,
  numberScale: 0.98,
  numberDx: -0.25
};
function Zh(t) {
  const e = b0(t);
  if (e) return e;
  const r = Jh(t);
  if (r) return r;
  const n = t.setCode?.toLowerCase() ?? "";
  if (yi(t)) return { ...Vh, ...u0[n] };
  const o = d0[n], s = ["lea", "leb", "3ed", "arn", "atq", "drk"].includes(n);
  if (!(!o || t.frameTemplate !== void 0 || /^Level up\b/m.test(t.rulesText ?? "") || (t.layout ?? "normal") !== "normal" || (t.legendary ?? /\bLegendary\b/.test(t.typeLine ?? "")) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || Lt(t) !== (["3ed", "8ed"].includes(n) ? "white" : "black") || s && (!dt(t) || t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle") || n === "8ed" && (dt(t) || t.frameAssetFamily !== "eighth")))
    return Eo(t) === "dark" ? { ...o, numberScale: 0.87, numberDx: -0.25, numberDy: -0.25 } : o;
}
function Tn(t) {
  const e = t.symbolAdjustment?.mana, r = Zh(t);
  if (!r) return e;
  const n = { ...e };
  for (const o of ["dx", "dy", "spacing", "numberDx", "numberDy"])
    r[o] !== void 0 && (n[o] = r[o] + (e?.[o] ?? 0));
  for (const o of ["scaleX", "scaleY", "numberScale"])
    r[o] !== void 0 && (n[o] = r[o] * (e?.[o] ?? 1));
  if (r.glyphs) {
    n.glyphs = { ...e?.glyphs };
    for (const o of ["W", "U", "B", "R", "G"]) {
      const s = r.glyphs[o], a = e?.glyphs?.[o];
      s && (n.glyphs[o] = {
        scale: (s.scale ?? 1) * (a?.scale ?? 1),
        dx: (s.dx ?? 0) + (a?.dx ?? 0),
        dy: (s.dy ?? 0) + (a?.dy ?? 0)
      });
    }
  }
  return n;
}
class Br {
  constructor(e) {
    if (this.limit = e, !Number.isSafeInteger(e) || e < 1) throw RangeError("Invalid material budget");
  }
  limit;
  entries = /* @__PURE__ */ new Map();
  bytes = 0;
  peakBytes = 0;
  builds = 0;
  hits = 0;
  evictions = 0;
  waiting = /* @__PURE__ */ new Set();
  get stats() {
    return {
      bytes: this.bytes,
      peakBytes: this.peakBytes,
      entries: this.entries.size,
      builds: this.builds,
      hits: this.hits,
      evictions: this.evictions
    };
  }
  destroy(e) {
    e.bitmap?.close(), e.bitmap = void 0, e.accounted && (this.bytes -= e.bytes, e.accounted = !1);
  }
  admit(e) {
    const r = new Set(e.map((o) => o.key)), n = e.reduce((o, s) => {
      const a = this.entries.get(s.key);
      if (a && a.bytes !== s.bytes)
        throw Error("Material cache key has inconsistent dimensions");
      return o + (a ? 0 : s.bytes);
    }, 0);
    for (const [o, s] of this.entries) {
      if (this.bytes + n <= this.limit) break;
      s.users || r.has(o) || (this.entries.delete(o), s.retired = !0, this.destroy(s), this.evictions++);
    }
    if (!(this.bytes + n > this.limit))
      return this.bytes += n, this.peakBytes = Math.max(this.peakBytes, this.bytes), e.map((o) => {
        let s = this.entries.get(o.key);
        if (s)
          this.hits++, this.entries.delete(o.key), this.entries.set(o.key, s);
        else {
          const a = {
            users: 0,
            bytes: o.bytes,
            accounted: !0,
            retired: !1,
            promise: Promise.resolve().then(async () => {
              this.builds++;
              const i = await o.build();
              if (i.width * i.height * 4 !== o.bytes)
                throw i.close(), Error("Derived bitmap dimensions differ from its cache reservation");
              return a.bitmap = i, i;
            })
          };
          a.promise = a.promise.catch((i) => {
            throw this.entries.get(o.key) === a && this.entries.delete(o.key), a.retired = !0, this.destroy(a), this.notify(), i;
          }), this.entries.set(o.key, a), s = a;
        }
        return s.users++, s;
      });
  }
  notify() {
    for (const e of [...this.waiting]) e();
  }
  wait(e) {
    return e.throwIfAborted(), new Promise((r, n) => {
      const o = () => {
        this.waiting.delete(s), e.removeEventListener("abort", a);
      }, s = () => {
        o(), r();
      }, a = () => {
        o(), n(e.reason);
      };
      this.waiting.add(s), e.addEventListener("abort", a, { once: !0 });
    });
  }
  async acquire(e, r, n, o) {
    return (await this.acquireMany([{ key: e, bytes: r, build: n }], o))[0];
  }
  /** Admit a complete face atomically. Per-component waiting could deadlock two
   * faces that each hold half their required components while awaiting the rest. */
  async acquireMany(e, r) {
    if (r.throwIfAborted(), new Set(e.map((s) => s.key)).size !== e.length)
      throw Error("Duplicate key in material batch");
    if (e.some((s) => !Number.isSafeInteger(s.bytes) || s.bytes < 1) || e.reduce((s, a) => s + a.bytes, 0) > this.limit)
      throw RangeError("Material batch exceeds derived-image budget");
    let n;
    for (; !(n = this.admit(e)); )
      await this.wait(r), r.throwIfAborted();
    const o = n.map((s) => {
      let a = !1;
      return () => {
        a || (a = !0, s.users--, s.retired && !s.users && this.destroy(s), this.notify());
      };
    });
    try {
      const a = (await Promise.allSettled(n.map((i) => i.promise))).find((i) => i.status === "rejected");
      if (a?.status === "rejected") throw a.reason;
      return r.throwIfAborted(), n.map((i, l) => ({ value: i.bitmap, release: o[l] }));
    } catch (s) {
      for (const a of o) a();
      throw s;
    }
  }
  /** Retire active results; their final lease closes them. New work may start
   * after teardown, but retired pending/leased bytes still count toward budget. */
  clear() {
    for (const e of this.entries.values())
      e.retired = !0, e.users || this.destroy(e);
    this.entries.clear(), this.notify();
  }
}
const Ml = new Br(16 * 1024 * 1024), ms = new Br(8 * 1024 * 1024), Rl = new Br(64 * 1024 * 1024), y1 = () => {
  Rl.clear(), Ml.clear(), ms.clear();
};
function Qh(t) {
  if (!t.length || t.length % 4) throw Error("Invalid mana source pixels.");
  const e = new Uint32Array(766);
  let r = 0;
  for (let s = 0; s < t.length; s += 4) {
    if (t[s + 3] !== 255) continue;
    const a = t[s] + t[s + 1] + t[s + 2];
    e[a] = e[a] + 1, r++;
  }
  if (!r) throw Error("Mana source has no opaque paper sample.");
  let n = 0, o = 0;
  for (; o < e.length && (n += e[o], !(n >= r * 0.9)); o++)
    ;
  for (let s = 0; s < t.length; s += 4)
    if (t[s + 3] === 255 && t[s] + t[s + 1] + t[s + 2] === o)
      return [t[s], t[s + 1], t[s + 2]];
  throw Error("Mana source paper sample is inconsistent.");
}
const tm = new Br(16 * 1024 * 1024), aa = /* @__PURE__ */ new WeakMap();
let em = 0;
async function rm(t, e, r) {
  const n = Tn(t), o = wi(t), s = g0(t), a = !s && (!!o || !!n && (!!(n.numberDx || n.numberDy) || (n.numberScale ?? 1) !== 1));
  if (!s && !o && !a && !n?.glyphs && !Object.keys(e.manaGlyphScales ?? {}).length)
    return { images: e, dispose() {
    } };
  const i = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), d = [
    .../* @__PURE__ */ new Set([...t.manaSymbols ?? [], ...Object.keys(e.manaGlyphScales ?? {})])
  ].flatMap((h) => {
    const m = Cr(n, h), c = !!m && (!!(m.dx || m.dy) || (m.scale ?? 1) !== 1);
    if (!(/^\d+$/.test(h) && a) && !c && (e.manaGlyphScales?.[h] ?? 1) === 1)
      return [];
    const g = Si(t, h), f = e.get(g ?? Ye(h) ?? "");
    if (g && !f) throw Error("Modern cost numeral asset is missing.");
    if (!f) return [];
    let b = aa.get(f);
    return b || aa.set(f, b = ++em), [
      {
        symbol: h,
        source: f,
        identity: b,
        cost: g ? o : void 0,
        paperSample: S0(t, h)
      }
    ];
  });
  let u = [];
  try {
    return u = await tm.acquireMany(
      d.map(({ source: h, identity: m, cost: c, paperSample: g }) => ({
        key: `numeral-v2:${m}:${c ? JSON.stringify(c) : "source"}${g ? ":" + g : ""}`,
        bytes: h.width * h.height * 8,
        build: () => nm(h, c, g)
      })),
      r
    ), d.forEach(({ symbol: h, source: m }, c) => {
      (/^\d+$/.test(h) ? i : l).set(h, {
        image: u[c].value,
        width: m.width,
        height: m.height
      });
    }), {
      images: Object.assign(new Map(e), {
        manaCostShadow: o?.shadow,
        manaCostNumeral: s,
        manaColors: e.manaColors,
        manaInkColor: e.manaInkColor,
        originalManaGlyphs: e.originalManaGlyphs,
        originalWhiteGlyph: e.originalWhiteGlyph,
        manaNumerals: i,
        manaGlyphs: l,
        manaGlyphScales: e.manaGlyphScales
      }),
      dispose: () => u.forEach((h) => h.release())
    };
  } catch (h) {
    throw u.forEach((m) => m.release()), h;
  }
}
async function nm(t, e, r) {
  const n = B();
  n.width = t.width, n.height = t.height;
  try {
    const o = n.getContext("2d", { willReadFrequently: !0 });
    if (!o) throw Error("Mana glyph preparation needs Canvas2D.");
    o.drawImage(t, 0, 0);
    const s = o.getImageData(0, 0, n.width, n.height), a = s.data, i = (Math.floor(t.height * 0.04) * t.width + Math.floor(t.width / 2)) * 4, l = r ? Qh(a) : [a[i], a[i + 1], a[i + 2]];
    let d = i;
    for (let g = 0; g < a.length; g += 4)
      a[g + 3] === 255 && a[g] + a[g + 1] + a[g + 2] < a[d] + a[d + 1] + a[d + 2] && (d = g);
    const u = [a[d], a[d + 1], a[d + 2]], h = l.map((g, f) => g - u[f]), m = h.reduce((g, f) => g + f * f, 0);
    if (m < 100) throw Error("Mana asset has no separable glyph.");
    const c = new ImageData(new Uint8ClampedArray(a), t.width, t.height);
    for (let g = 0; g < a.length; g += 4) {
      if (e) for (let b = 0; b < 3; b++) c.data[g + b] = e.paper[b];
      if (a[g + 3] < 255) {
        a[g + 3] = 0;
        continue;
      }
      for (let b = 0; b < 3; b++) c.data[g + b] = e?.paper[b] ?? l[b];
      const f = Math.max(
        0,
        Math.min(1, h.reduce((b, y, p) => b + y * (l[p] - a[g + p]), 0) / m)
      );
      a[g + 3] = Math.round(a[g + 3] * f);
      for (let b = 0; b < 3; b++) a[g + b] = e?.ink[b] ?? u[b];
    }
    return n.width = t.width * 2, o.putImageData(c, 0, 0), o.putImageData(s, t.width, 0), await createImageBitmap(n);
  } finally {
    n.width = n.height = 0;
  }
}
const om = {
  hueDegrees: 0,
  saturationScale: 1,
  brightnessScale: 1
};
function un([t, e, r]) {
  const n = Math.max(t, e, r), o = n - Math.min(t, e, r);
  return [((o === 0 ? 0 : n === t ? (e - r) / o : n === e ? (r - t) / o + 2 : (t - e) / o + 4) * 60 % 360 + 360) % 360, n === 0 ? 0 : o / n, n];
}
function sm(t, e, r) {
  const n = (t % 360 + 360) % 360 / 60, o = r * e, s = o * (1 - Math.abs(n % 2 - 1)), a = r - o, i = n < 1 ? [o, s, 0] : n < 2 ? [s, o, 0] : n < 3 ? [0, o, s] : n < 4 ? [0, s, o] : n < 5 ? [s, 0, o] : [o, 0, s];
  return [i[0] + a, i[1] + a, i[2] + a];
}
function Ht(t, e) {
  const [r, n, o] = un(t), s = e.valueGamma === void 0 ? o : o ** e.valueGamma, a = sm(
    r + e.hueDegrees,
    Math.min(1, n * e.saturationScale),
    Math.min(1, s * e.brightnessScale)
  );
  return e.rgbScale ? [
    Math.max(0, Math.min(1, a[0] * e.rgbScale[0])),
    Math.max(0, Math.min(1, a[1] * e.rgbScale[1])),
    Math.max(0, Math.min(1, a[2] * e.rgbScale[2]))
  ] : a;
}
function ia(t) {
  const e = t.valueGamma;
  if (e !== void 0 && (!Number.isFinite(e) || e < 0.5 || e > 2))
    throw RangeError("Frame value exponent must be finite and between 0.5 and 2.");
}
const am = {
  W: { hueDegrees: 0, saturationScale: 0.439924, brightnessScale: 1.21405 },
  U: { hueDegrees: 17.808301, saturationScale: 0.546189, brightnessScale: 1.239832 },
  B: { hueDegrees: 0, saturationScale: 0.261951, brightnessScale: 1.149978 },
  R: { hueDegrees: -7.214766, saturationScale: 0.471958, brightnessScale: 1.212936 },
  G: { hueDegrees: 0, saturationScale: 0.227323, brightnessScale: 1.290867 }
};
function Wn(t, e, r) {
  if (e.colorCalibration !== "set-hsb-v1" || !["eld", "woe"].includes(e.setCode?.toLowerCase() ?? ""))
    return;
  const n = am[r.toUpperCase()];
  if (!n) return;
  const o = t.getContext("2d"), s = t.width, a = t.height, i = [
    Math.floor(31 * s / 488),
    Math.floor(487 * a / 680),
    Math.ceil(214 * s / 488),
    Math.ceil(142 * a / 680)
  ], l = o.getImageData(...i);
  for (let u = 0; u < l.data.length; u += 4) {
    if (!l.data[u + 3]) continue;
    const h = Ht(
      [l.data[u] / 255, l.data[u + 1] / 255, l.data[u + 2] / 255],
      n
    );
    for (let m = 0; m < 3; m++)
      l.data[u + m] = Math.round(h[m] * 255);
  }
  const d = B();
  d.width = i[2], d.height = i[3], d.getContext("2d").putImageData(l, 0, 0), o.save(), o.scale(s / 488, a / 680), o.beginPath(), o.moveTo(31.8, 488.3), o.lineTo(218, 488.3), o.bezierCurveTo(235, 488.3, 241, 490.5, 244, 496), o.lineTo(244, 627.4), o.lineTo(31.8, 627.4), o.closePath(), o.clip(), o.drawImage(
    d,
    i[0] * 488 / s,
    i[1] * 680 / a,
    i[2] * 488 / s,
    i[3] * 680 / a
  ), o.restore(), d.width = d.height = 0;
}
const $e = /* @__PURE__ */ new Map(), Fn = /* @__PURE__ */ new WeakMap();
let im = 0, _n = 0;
const lm = (t) => (Fn.has(t) || Fn.set(t, ++im), Fn.get(t));
function dm(t, e) {
  const r = t.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const n = (y) => {
    const p = e.get(y);
    if (!p) throw Error(`Adventure asset unavailable: ${y}`);
    return p;
  }, o = hl(t).map(n), s = JSON.stringify([
    t.setCode,
    t.colorCalibration,
    t.colors,
    t.frameColors,
    t.manaSymbols,
    r.colors,
    r.frameColors,
    r.manaSymbols,
    o.map(lm)
  ]), a = $e.get(s);
  if (a)
    return $e.delete(s), $e.set(s, a), a;
  const i = n(an(t)), l = B();
  l.width = i.width, l.height = i.height;
  const d = l.getContext("2d"), u = l.width, h = l.height, m = () => {
    const y = B();
    return y.width = u, y.height = h, y;
  }, c = (y, p) => {
    const w = m(), S = w.getContext("2d"), v = F(y);
    if (S.drawImage(n(an(y)), 0, 0, u, h), p && v.length === 1 && Wn(w, t, v[0]), v.length === 2) {
      "WUBRG".indexOf(v[1]) - "WUBRG".indexOf(v[0]) > 2 && v.reverse(), S.drawImage(n(`${Me}/${v[0].toLowerCase()}.png`), 0, 0, u, h), p && Wn(w, t, v[0]);
      const C = m(), k = C.getContext("2d");
      k.drawImage(n(`${Me}/${v[1].toLowerCase()}.png`), 0, 0, u, h), p && Wn(C, t, v[1]), k.globalCompositeOperation = "destination-in";
      const R = k.createLinearGradient(
        u * (p ? 0.22 : 0.43),
        0,
        u * (p ? 0.36 : 0.57),
        0
      );
      R.addColorStop(0, "#0000"), R.addColorStop(1, "#000"), k.fillStyle = R, k.fillRect(0, 0, u, h), S.drawImage(C, 0, 0), C.width = C.height = 0;
    }
    return w;
  };
  if (d.drawImage(i, 0, 0), F(t).length === 2) {
    const y = c(t, !1), p = y.getContext("2d");
    te(t) || (p.globalCompositeOperation = "destination-in", p.drawImage(n(ll), 0, 0, u, h)), d.drawImage(y, 0, 0), y.width = y.height = 0;
  }
  const g = c(r, !0), f = g.getContext("2d");
  if (f.globalCompositeOperation = "destination-in", f.drawImage(n(il), 0, 0, u, h), d.save(), te(r) && (d.filter = "grayscale(1)"), d.drawImage(g, 0, 0), d.restore(), g.width = g.height = 0, te(t)) {
    d.save(), d.scale(u / 488, h / 680), d.beginPath();
    for (const [y, p] of [
      [34, 34],
      [388, 28]
    ])
      d.moveTo(38, y), d.lineTo(450, y), d.quadraticCurveTo(461, y + p / 2, 450, y + p), d.lineTo(38, y + p), d.quadraticCurveTo(29, y + p / 2, 38, y), d.closePath();
    d.clip();
    for (const [y, p] of [
      [34, 34],
      [388, 28]
    ])
      d.drawImage(n(dl), 22, 7, 196, 19, 29, y, 432, p);
    d.restore();
  }
  const b = u * h * 4;
  for (const [y, p] of $e) {
    if (_n + b <= 16 * 1024 * 1024) break;
    _n -= p.width * p.height * 4, $e.delete(y), p.width = p.height = 0;
  }
  return b <= 16 * 1024 * 1024 && ($e.set(s, l), _n += b), l;
}
const la = {
  permanent: { x: 261, y: 438, width: 189, height: 178 },
  spell: { x: 41.7, y: 499, width: 191, height: 122 }
};
function um(t, e) {
  const r = e.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const n = (m) => {
    const c = Re({
      rulesText: m.rulesText ?? "",
      rulesParagraphs: m.rulesParagraphs
    });
    return m.rulesAlignment?.mode === "left" ? c.map((g) => g.role === "rules" ? { ...g, align: "left" } : g) : c;
  }, o = { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: !0 }, s = n(e), a = {
    ...la.permanent,
    exclusions: e.power != null && e.toughness != null ? [[368, 601, 94, 51]] : []
  }, i = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? s : s, l = e.rulesAlignment?.mode !== "left" && i.length === 1 && i[0].role === "rules" ? nr(t, s, i, a, 22.5, 9, 1, o) : null, d = n(r), u = la.spell, h = O(t, d, u, 20.25, 20.25, o);
  return {
    permanent: l || O(t, s, a, 22.5, 9, o),
    spell: !h.overflow && h.lines.length <= 4 ? h : O(t, d, u, 22.5, 9, o)
  };
}
function hm(t) {
  const e = (t.rarity ?? "common")[0].toUpperCase(), r = t.collectorNumber ?? "";
  if ((t.collectorFormat ?? (t.setCode?.toLowerCase() === "woe" ? "rarity-first" : "number-first")) === "number-first") return `${r} ${e}`.trim();
  const o = r.split("/")[0].replace(/^(\d+)/, (s) => s.padStart(4, "0"));
  return `${e} ${o}`.trim();
}
function xl(t, e, r) {
  if (e.power != null && e.toughness != null) {
    const o = r.get(os(e));
    if (!o) throw Error("Adventure power/toughness plate is unavailable.");
    const [s, a, i, l] = ss.stats;
    t.drawImage(o, s * 488, a * 680, i * 488, l * 680), t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.font = '700 25px "CardRenderer MTG Beleren Small Caps", Georgia', mt(t, `${e.power}/${e.toughness}`, 420, 627, 77, e.textInk);
  }
  if (Jt(e)) {
    const o = r.get(Ar);
    if (!o) throw Error("Adventure authenticity stamp is unavailable.");
    t.drawImage(o, ...Ke.saga);
  }
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(hm(e), 32, 645), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.artist && (t.font = '11px "CardRenderer MTG Artist Credit", serif', t.fillText("a", 93, 658), t.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', t.fillText(e.artist, 108, 658, 210)), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 658, 182));
}
let da = null;
function Al() {
  return da ??= lt().load('700 25px "CardRenderer MTG Beleren Small Caps"').then((t) => {
    if (!t.length || t.some((e) => e.status !== "loaded"))
      throw Error("Inset card footer lettering needs card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw da = null, t;
  });
}
function mm(t, e, r) {
  if (t.drawImage(dm(e, r), 0, 0, 488, 680), j(e).legendary) {
    const n = r.get(ul(e));
    if (!n) throw Error("Adventure crown is unavailable.");
    t.fillStyle = Et(e) ?? "#000", t.fillRect(19.2, 18.8, 449.6, 12.1), t.drawImage(n, 13.4, 13, 461.4, 113.4);
  }
}
function cm(t, e, r) {
  const n = e.manaSymbols ?? [], o = 23.4, s = 1.8, a = 452, i = n.length * o + Math.max(0, n.length - 1) * s;
  t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle", at(
    t,
    e.name,
    41.7,
    51,
    (n.length ? a - i - 8 : 449) - 41.7,
    26,
    !0
  ), n.forEach(
    (f, b) => st(t, f, a - i + b * (o + s), 38.7, o, r, !0)
  );
  const l = Q(e), d = r.get(l ?? ""), u = ue(e), h = d ? Math.min(58.56 / (d.width * u[2]), 27.9 / (d.height * u[3])) : 0, m = d ? d.width * u[2] * h : 0, c = d ? d.height * u[3] * h : 0, g = [450.3 - m, 402 - c / 2, m, c];
  at(
    t,
    e.typeLine ?? "",
    41.7,
    401.5,
    (d ? g[0] - 7 : 449) - 41.7,
    22,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  ), d && (Ut(l) || e.setSymbol ? t.drawImage(d, ...g) : oe(t, d, e.setCode, e.rarity, ...g, u));
}
function gm(t, e, r) {
  const n = e.manaSymbols ?? [], o = 19.8, s = 1.2, a = 233, i = n.length * o + Math.max(0, n.length - 1) * s;
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "middle", at(
    t,
    e.name,
    40,
    443,
    (n.length ? a - i - 4 : a) - 40,
    20.1,
    !0
  ), n.forEach(
    (l, d) => st(t, l, a - i + d * (o + s), 432, o, r, !0)
  ), at(
    t,
    e.typeLine ?? "",
    40,
    473.5,
    193,
    20.1,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  );
}
function fm(t, e, r, n, o) {
  const s = e.faces?.[1];
  if (!s) throw Error("Adventure spell is missing.");
  t.save(), t.fillStyle = Et(e) ?? "#000", t.fillRect(0, 0, 488, 680), n && t.drawImage(n, 0, 0, 488, 680), o !== "artwork" && mm(t, e, r);
  const [a, i, l, d] = ss.art;
  if (_t(t, e, r, [a * 488, i * 680, l * 488, d * 680], o), o !== "artwork") {
    cm(t, e, r), gm(t, s, r);
    const u = um(t, e);
    Rt(t, u.permanent, r), Rt(t, u.spell, r), xl(t, e, r);
  }
  t.restore();
}
const Ge = /* @__PURE__ */ new Map(), Un = /* @__PURE__ */ new WeakMap();
let pm = 0, jn = 0;
const bm = (t) => (Un.has(t) || Un.set(t, ++pm), Un.get(t));
function ym(t, e) {
  const r = rr(t), n = (w) => {
    const S = e.get(w);
    if (!S) throw Error(`Prepared asset unavailable: ${w}`);
    return S;
  }, o = ml(t).map(n), s = _e(t), a = _e(r), i = j(t).legendary, l = JSON.stringify([
    s,
    a,
    i,
    te(r),
    o.map(bm)
  ]), d = Ge.get(l);
  if (d)
    return Ge.delete(l), Ge.set(l, d), d;
  const u = n(De(t)), h = u.width, m = u.height, c = () => {
    const w = B();
    return w.width = h, w.height = m, w;
  }, g = c(), f = g.getContext("2d");
  f.drawImage(u, 0, 0);
  const b = (w, S, v = !1) => {
    const C = c(), k = C.getContext("2d");
    v && (k.filter = "grayscale(1)"), k.drawImage(w, 0, 0, h, m), k.filter = "none", k.globalCompositeOperation = "destination-in", k.drawImage(n(zr(S)), 0, 0, h, m), f.drawImage(C, 0, 0), C.width = C.height = 0;
  }, y = (w) => n(`${Cn}/${w.toLowerCase()}.png`);
  if (s.length === 2) {
    const w = c(), S = w.getContext("2d");
    S.drawImage(y(s[0]), 0, 0, h, m);
    const v = c(), C = v.getContext("2d");
    C.drawImage(y(s[1]), 0, 0, h, m), C.globalCompositeOperation = "destination-in";
    const k = C.createLinearGradient(h * 0.43, 0, h * 0.57, 0);
    k.addColorStop(0, "#0000"), k.addColorStop(1, "#000"), C.fillStyle = k, C.fillRect(0, 0, h, m), S.drawImage(v, 0, 0), b(w, "pinline"), b(y(s[0]), "rules"), b(y(s[1]), "rulesRight"), w.width = w.height = v.width = v.height = 0;
  }
  if (a.length === 2 ? (b(y(a[0]), "prepare"), b(y(a[1]), "prepareRight"), b(n(De(r)), "prepareTypeTitle", te(r))) : b(n(De(r)), "prepare"), i) {
    f.save(), f.scale(h / 488, m / 680), f.fillStyle = Et(t) ?? "#000", f.fillRect(19.2, 18.8, 449.6, 12.1);
    const w = s.length === 2 ? s : [as(t)];
    if (f.drawImage(n(mo(w[0])), 13.4, 13, 461.4, 113.4), w.length === 2) {
      const S = c(), v = S.getContext("2d");
      v.scale(h / 488, m / 680), v.drawImage(n(mo(w[1])), 13.4, 13, 461.4, 113.4), v.globalCompositeOperation = "destination-in";
      const C = v.createLinearGradient(210, 0, 278, 0);
      C.addColorStop(0, "#0000"), C.addColorStop(1, "#000"), v.fillStyle = C, v.fillRect(0, 0, 488, 680), f.drawImage(S, 0, 0, 488, 680), S.width = S.height = 0;
    }
    f.restore();
  }
  const p = h * m * 4;
  for (const [w, S] of Ge) {
    if (jn + p <= 16 * 1024 * 1024) break;
    jn -= S.width * S.height * 4, Ge.delete(w), S.width = S.height = 0;
  }
  return p <= 16 * 1024 * 1024 && (Ge.set(l, g), jn += p), g;
}
function wm(t, e) {
  const r = rr(e), n = (o, s, a, i) => {
    const l = Re({
      rulesText: o.rulesText ?? "",
      rulesParagraphs: o.rulesParagraphs
    });
    return O(
      t,
      o.rulesAlignment?.mode === "left" ? l.map((d) => d.role === "rules" ? { ...d, align: "left" } : d) : l,
      {
        x: s[0] * 488,
        y: s[1] * 680,
        width: s[2] * 488,
        height: s[3] * 680,
        exclusions: i
      },
      a,
      9,
      { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: !0 }
    );
  };
  return {
    permanent: n(
      e,
      is.rules,
      21.75,
      Jt(e) ? [[213, 620, 63, 26]] : []
    ),
    spell: n(
      r,
      gh.rules,
      21.75,
      e.power != null && e.toughness != null ? [[370, 603, 93, 49]] : []
    )
  };
}
function Sm(t, e, r) {
  t.drawImage(ym(e, r), 0, 0, 488, 680);
}
function vm(t, e, r) {
  const n = (m, c) => {
    const g = m.manaSymbols ?? [], f = c ? 19.8 : 23.4, b = c ? 1.2 : 1.8, y = c ? 1042 / 2010 * 488 : 41.7, p = 452, w = g.length * f + Math.max(0, g.length - 1) * b;
    t.fillStyle = c ? "#fff" : "#17140f", t.textAlign = "left", t.textBaseline = "middle", at(
      t,
      m.name,
      y,
      c ? 444 : 52,
      (g.length ? p - w - (c ? 4 : 8) : p) - y,
      c ? 20 : 26,
      !0
    ), g.forEach(
      (S, v) => st(
        t,
        S,
        p - w + v * (f + b),
        c ? 434.5 : 38.7,
        f,
        r,
        !0
      )
    );
  };
  n(e, !1);
  const o = Q(e), s = r.get(o ?? ""), a = ue(e), i = s ? Math.min(58.56 / (s.width * a[2]), 27.9 / (s.height * a[3])) : 0, l = s ? s.width * a[2] * i : 0, d = s ? s.height * a[3] * i : 0, u = [450.3 - l, 402 - d / 2, l, d];
  at(
    t,
    e.typeLine ?? "",
    41.7,
    401.5,
    (s ? u[0] - 7 : 449) - 41.7,
    22,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  ), s && (Ut(o) || e.setSymbol ? t.drawImage(s, ...u) : oe(t, s, e.setCode, e.rarity, ...u, a));
  const h = rr(e);
  n(h, !0), at(
    t,
    h.typeLine ?? "",
    1042 / 2010 * 488,
    477,
    195.2,
    20,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    h.textInk
  );
}
function Cm(t, e, r, n, o) {
  rr(e), t.save(), t.fillStyle = Et(e) ?? "#000", t.fillRect(0, 0, 488, 680), n && t.drawImage(n, 0, 0, 488, 680), o !== "artwork" && Sm(t, e, r);
  const [s, a, i, l] = is.art;
  if (_t(t, e, r, [s * 488, a * 680, i * 488, l * 680], o), o !== "artwork") {
    vm(t, e, r);
    const d = wm(t, e);
    Rt(t, d.permanent, r), Rt(t, d.spell, r), xl(
      t,
      { ...e, collectorFormat: e.collectorFormat ?? "rarity-first" },
      r
    );
  }
  t.restore();
}
function km(t, e, r) {
  t.fillStyle = Et(e) ?? "#000", t.fillRect(0, 0, 488, 680);
  const n = Gt(e), o = n.map((s) => ah(s.face, r));
  if (n.forEach((s, a) => {
    t.save(), t.beginPath(), t.rect(0, a ? 0 : 324, 488, a ? 324 : 356), t.clip(), t.drawImage(o[a], 0, 0, 488, 680), t.restore();
  }), n[0]?.face.layout?.endsWith("-fuse")) {
    const s = B();
    s.width = 488, s.height = 680;
    const a = s.getContext("2d");
    a.drawImage(o[1], 0, 0, 488, 680), a.globalCompositeOperation = "destination-in";
    const i = a.createLinearGradient(0, 344, 0, 304);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), a.fillStyle = i, a.fillRect(0, 0, 488, 680), t.save(), t.beginPath(), t.rect(434, 0, 54, 680), t.clip(), t.drawImage(o[0], 0, 0, 488, 680), t.drawImage(s, 0, 0), t.restore(), s.width = s.height = 0;
  }
}
function Tm(t, e, r) {
  const a = e.manaSymbols ?? [], i = a.length * 23.4 + Math.max(0, a.length - 1) * 1.7;
  t.fillStyle = "#17140f", t.textBaseline = "middle", t.textAlign = "left", at(
    t,
    e.name,
    70,
    53,
    Math.max(1, (a.length ? 331 - i - 7 : 331) - 70),
    26,
    !0
  ), a.forEach((g, f) => st(t, g, 331 - i + f * (23.4 + 1.7), 39.5, 23.4, r, !0));
  const l = Q(e), d = r.get(l ?? ""), u = ue(e), h = d ? Math.min(26 / (d.width * u[2]), 15.5 / (d.height * u[3])) : 0, m = d ? d.width * u[2] * h : 0, c = d ? d.height * u[3] * h : 0;
  if (at(
    t,
    e.typeLine ?? "",
    70,
    277,
    (d ? 331 - m - 6 : 331) - 70,
    18.5,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  ), d) {
    const g = [331 - m, 277 - c / 2, m, c];
    Ut(l) || e.setSymbol ? t.drawImage(d, ...g) : oe(t, d, e.setCode, e.rarity, ...g, u);
  }
}
function Mm(t, e, r) {
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic";
  const n = [
    ...new Set((e.faces ?? []).map((o) => o.artist ?? e.artist ?? "").filter(Boolean))
  ].join(" & ");
  if (t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""} ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    646
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 660), n && (t.font = '11px "CardRenderer MTG Artist Credit", serif', t.fillText("a", 95, 660), t.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', t.fillText(n, 110, 660, 193)), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 455, 646, 170)), Jt(e)) {
    const o = r.get(Yi);
    if (!o) throw Error("Modern split authenticity stamp unavailable.");
    t.drawImage(o, ...Ke.split);
  }
}
const Dn = z.MSE_SPLIT_BRIDGE_ROOT;
function Ll(t, e) {
  const r = F(t);
  r.length === 2 && "WUBRG".indexOf(r[1]) - "WUBRG".indexOf(r[0]) > 2 && r.reverse();
  const n = (e ? r[0] : r.at(-1))?.toLowerCase() ?? "c";
  return {
    color: `${Dn}/${n}bridge.png`,
    gold: r.length > 1 ? `${Dn}/mbridge.png` : null,
    mask: r.length > 1 ? `${Dn}/bridgemask.png` : null
  };
}
function Rm(t) {
  return (t.faces ?? []).flatMap((e, r) => Object.values(Ll(e, r)));
}
function xm(t, e, r) {
  const n = (u) => {
    const h = r.get(u);
    if (!h) throw Error(`Fuse bridge asset unavailable: ${u}`);
    return h;
  }, o = e.faces.map((u, h) => {
    const m = Ll(u, h), c = n(m.color), g = B();
    g.width = c.width, g.height = c.height;
    const f = g.getContext("2d");
    return f.drawImage(c, 0, 0), m.gold && m.mask && (f.globalCompositeOperation = "destination-in", f.drawImage(gl(n(m.mask)), 0, 0, g.width, g.height), f.globalCompositeOperation = "destination-over", f.drawImage(n(m.gold), 0, 0, g.width, g.height)), g;
  }), [s, a] = o, i = a.getContext("2d");
  i.globalCompositeOperation = "destination-in";
  const l = i.createLinearGradient(0, 0, a.width, 0);
  l.addColorStop(0, "#0000"), l.addColorStop(1, "#000"), i.fillStyle = l, i.fillRect(0, 0, a.width, a.height), t.save(), t.translate(0, 680), t.rotate(-Math.PI / 2);
  const d = [
    253 * 680 / 523,
    306 * 488 / 375,
    16 * 680 / 523,
    30 * 488 / 375
  ];
  t.drawImage(s, ...d), t.drawImage(a, ...d), t.restore();
  for (const u of o) u.width = u.height = 0;
}
function Am(t, e, r, n) {
  const [o, s, a, i] = er(r, n).rules, l = Re({
    rulesText: e.rulesText ?? "",
    rulesParagraphs: e.rulesParagraphs
  }), d = { x: o, y: s, width: a, height: i }, u = {
    leading: 1.02,
    paragraphGap: 0.4,
    flavorGap: 0.65,
    centerOffset: r === "old" ? 0 : 2
  }, h = r === "old" ? 24.5 : r === "m15" ? n ? 20.25 : 24.25 : 21.5;
  if ((r !== "m15" || n) && e.rulesAlignment?.mode !== "left" && l.length === 1) {
    const m = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? l : l, c = nr(t, l, m, d, h, 13, 2, u);
    if (c) return c;
  }
  return O(t, l, d, h, 13, u);
}
function Lm(t, e, r) {
  const n = Xt(e);
  if (!n) throw Error("No native split plate for this printing.");
  if (n === "m15") return km(t, e, r);
  const o = n !== "old" && Xe(e), s = er(n, o);
  t.fillStyle = Pt(e.setCode, e.borderColor).border, t.fillRect(0, 0, 488, 680), Gt(e).forEach((a, i) => {
    const l = vh(a.face, n, o, i, r);
    t.save(), t.translate(a.x, a.y), t.rotate(-Math.PI / 2);
    const [d, u, h, m] = s.frame;
    t.drawImage(l, d - (o && i ? 8 * 680 / 523 : 0), u, h, m), t.restore();
  }), o && xm(t, e, r);
}
function Em(t, e, r, n, o) {
  if (r === "m15") return Tm(t, e, o);
  const s = er(r, n), a = r === "old", [i, l, d, u] = s.title, h = e.manaSymbols ?? [], m = 23.4, c = 1.7, g = 316, f = h.length * m + Math.max(0, h.length - 1) * c;
  if (t.fillStyle = a ? "#f2eee3" : "#17140f", t.textBaseline = "middle", t.textAlign = "left", a) {
    const k = t.getTransform();
    t.shadowColor = "#000b", t.shadowOffsetX = k.a + k.c, t.shadowOffsetY = k.b + k.d;
  }
  at(
    t,
    e.name,
    i,
    l + u / 2 - (a ? 2 : 0),
    Math.max(1, h.length ? g - f - i - 7 : d),
    a ? 29 : 26.5,
    !a,
    1,
    a ? "CardRenderer MTG Goudy" : "CardRenderer MTG Matrix"
  ), h.forEach(
    (k, R) => st(t, k, g - f + R * (m + c), a ? 30.5 : 40, m, o, !a)
  );
  const b = Q(e), y = o.get(b ?? ""), p = ue(e), [w, S, v, C] = s.type;
  if (at(
    t,
    e.typeLine ?? "",
    w,
    S + C / 2,
    v - (y ? 33 : 0),
    a ? 22 : 21.5,
    !1,
    1,
    a ? "CardRenderer MTG MPlantin" : "CardRenderer MTG Matrix",
    0,
    e.textInk
  ), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, y) {
    const k = Math.min(
      32 / (y.width * p[2]),
      (a ? 26 : 22) / (y.height * p[3])
    ), R = y.width * p[2] * k, M = y.height * p[3] * k, x = [(a ? 306 : 316) - R, S + C / 2 - (a ? 1.5 : 0) - M / 2, R, M];
    Ut(b) || e.setSymbol ? t.drawImage(y, ...x) : oe(t, y, e.setCode, e.rarity, ...x, p);
  }
}
function Bm(t, e, r, n, o, s) {
  const a = er(n, o), i = n === "old";
  t.fillStyle = i ? "#eeeae1" : "#17140f", t.textAlign = i ? "center" : "left", t.textBaseline = "middle", t.font = i ? '19px "CardRenderer MTG MPlantin", Georgia' : '700 14px "CardRenderer MTG Matrix", Georgia';
  const l = s.get(`${P}/img/manaSymbols/brush.svg`);
  if (!i && l && t.drawImage(l, 36, a.artistY - 4, 20, 8), i) {
    const d = t.getTransform();
    t.shadowColor = "#000b", t.shadowOffsetX = d.a + d.c, t.shadowOffsetY = d.b + d.d;
  }
  t.fillText(
    `${i ? "Illus. " : ""}${e.artist ?? r.artist ?? ""}`,
    i ? 177 : 60,
    a.artistY,
    272
  ), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.font = `${i ? 10.2 : 10}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && t.fillText(
    `${r.legalText}${r.collectorNumber ? " " + r.collectorNumber : ""}`,
    i ? 177 : 36,
    a.legalY,
    280
  );
}
function Im(t, e, r, n, o) {
  const s = Xt(e);
  if (!s) throw Error("No native split plate for this printing.");
  const a = s !== "old" && Xe(e), i = er(s, a);
  t.save(), o !== "artwork" && Lm(t, e, r), n && t.drawImage(n, 0, 0, 488, 680);
  for (const l of Gt(e))
    t.save(), t.translate(l.x, l.y), t.rotate(-Math.PI / 2), _t(t, l.face, r, i.art, o), o !== "artwork" && (Em(t, l.face, s, a, r), Ch(t, l.face, r, i.rules[1] + i.rules[3] / 2), Rt(t, Am(t, l.face, s, a), r), s !== "m15" && Bm(t, l.face, e, s, a, r)), t.restore();
  if (s === "m15" && o !== "artwork" && Mm(t, e, r), a && o !== "artwork") {
    t.translate(0, 680), t.rotate(-Math.PI / 2);
    const l = el(e).map(
      (d) => s === "m15" ? { ...d, align: "center" } : d
    );
    Rt(
      t,
      O(
        t,
        l,
        s === "m15" ? { x: 70, y: 441, width: 577, height: 20 } : { x: 38, y: 407, width: 608, height: 26 },
        s === "m15" ? 18 : 21,
        12
      ),
      r
    );
  }
  t.restore();
}
let ua;
function Om(t) {
  return Xt(t) === "m15" ? Al() : Xt(t) !== "eighth" ? Promise.resolve() : ua ??= Promise.all([
    lt().load('700 24px "CardRenderer MTG Matrix"'),
    lt().load('24px "CardRenderer MTG Matrix"')
  ]).then((e) => {
    if (e.some((r) => !r.length || r.some((n) => n.status !== "loaded")))
      throw Error("Split Matrix fonts are unavailable. Load card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw ua = void 0, e;
  });
}
const ie = {
  reminder: { x: 42.3, y: 78, width: 197 },
  chapters: { x: 65.1, width: 171 },
  top: 80,
  reminderBottom: 201,
  bottom: 569,
  reverseStatsBottom: 535
}, $m = {
  maximumSize: 20.7,
  padding: 24,
  equalCells: 0,
  lastLift: 0,
  bottomSpace: 0.15
};
function Gm(t, e, r = $m) {
  const n = Er(e), o = n.filter((f) => !f.badges.length), s = n.filter((f) => f.badges.length), a = (f, b = !1) => [
    {
      role: "rules",
      runs: b ? [{ text: f, italic: !0 }] : f.split(/(\([^)]*\))/g).filter(Boolean).map((y) => ({ text: y, italic: y.startsWith("(") }))
    }
  ], i = { leading: 0.98, paragraphGap: 0.3, flavorGap: 0 }, l = o.length ? ie.reminderBottom : ie.top, d = e.reverseStats && e.layout === "transform" ? ie.reverseStatsBottom : ie.bottom, u = O(
    t,
    o.flatMap((f) => a(f.text, f.reminder)),
    { ...ie.reminder, height: l - ie.top },
    20.4,
    12,
    { ...i, centerOffset: -3 }
  );
  let h = r.maximumSize, m = [], c = [];
  for (; ; ) {
    const f = s.map(
      (S) => Math.max(
        O(
          t,
          a(S.text),
          { ...ie.chapters, y: 0, height: 2e3 },
          h,
          h,
          i
        ).height + r.padding,
        qt.minimumRowHeight + Math.max(0, S.badges.length - 1) * qt.gap
      )
    ), b = d - l;
    if (f.reduce((S, v) => S + v, 0) > b && h > 12) {
      h = Math.max(12, h - 0.25);
      continue;
    }
    if (f.reduce((S, v) => S + v, 0) > b)
      throw Error("Saga chapter text or badges do not fit the available column.");
    const y = Math.max(0, b - f.reduce((S, v) => S + v, 0)) * (1 - (s.length === 2 && s[0].badges.length > 1 ? r.bottomSpace : 0)) / Math.max(1, s.length);
    c = f.map((S) => S + y);
    const p = b / Math.max(1, s.length);
    c = c.map((S) => S * (1 - r.equalCells) + p * r.equalCells);
    let w = l;
    m = s.map((S, v) => {
      const C = c[v], k = O(
        t,
        a(S.text),
        { ...ie.chapters, y: w + 7, height: C - 14 },
        h,
        h,
        { ...i, centerOffset: v === s.length - 1 ? -r.lastLift : 0 }
      );
      return w += C, k;
    });
    break;
  }
  let g = l;
  return {
    reminder: u,
    size: h,
    rows: s.map((f, b) => {
      const y = { ...f, top: g, height: c[b], layout: m[b] };
      return g += y.height, y;
    })
  };
}
function Pm(t, e, r, n, o) {
  const s = (v) => {
    const C = r.get(v);
    if (!C) throw Error(`Saga asset unavailable: ${v}`);
    return C;
  };
  t.save(), t.fillStyle = Et(e) ?? "#090806", t.fillRect(0, 0, T, L), n && t.drawImage(n, 0, 0, T, L), o !== "artwork" && (t.drawImage(s(rs(e)), 0, 0, T, L), hh(t, e, r));
  const a = al.art;
  if (_t(t, e, r, [a[0] * T, a[1] * L, a[2] * T, a[3] * L], o), o === "artwork") {
    t.restore();
    return;
  }
  const i = ho(e);
  i && t.drawImage(s(i), 33.5, 35.6, 29, 32), t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
  const l = e.manaSymbols ?? [], d = 23.4, u = 1.8, h = 452, m = l.length * d + Math.max(0, l.length - 1) * u, c = e.layout === "transform" ? 78 : 41.7;
  at(
    t,
    e.name,
    c,
    51,
    (l.length ? h - m - 8 : 449) - c,
    26,
    !0
  ), l.forEach(
    (v, C) => st(t, v, h - m + C * (d + u), 38.7, d, r, !0)
  );
  const g = Q(e), f = r.get(g ?? ""), b = ue(e), y = f ? Math.min(58.56 / (f.width * b[2]), 25.9 / (f.height * b[3])) : 0, p = f ? f.width * b[2] * y : 0, w = f ? f.height * b[3] * y : 0, S = [450.3 - p, 594.25 - w / 2, p, w];
  if (at(
    t,
    e.typeLine ?? "",
    41.7,
    594.5,
    (f ? S[0] - 7 : 449) - 41.7,
    22,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  ), f && (Ut(g) || e.setSymbol ? t.drawImage(f, ...S) : oe(t, f, e.setCode, e.rarity, ...S, b)), e.reverseStats && e.layout === "transform" && (t.fillStyle = "#65605a", t.font = 'italic 20px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.fillText(`${e.reverseStats.power}/${e.reverseStats.toughness}`, 41, 553)), re(t)) {
    const v = Gm(t, e);
    Rt(t, v.reminder, r);
    for (const C of v.rows)
      t.drawImage(s(sl), 48.8, C.top - 1, 192.6, 2), Rt(t, C.layout, r), C.badges.forEach((k, R) => {
        const M = C.top + C.height / 2 + (R - (C.badges.length - 1) / 2) * qt.gap;
        t.drawImage(
          s(ol),
          qt.x,
          M - qt.height / 2,
          qt.width,
          qt.height
        ), t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.font = `550 ${qt.fontSize}px "${qt.fontFamily}", Georgia`, t.fillText(
          k,
          qt.centerX,
          M + qt.numeralOffsetY
        );
      });
  }
  Jt(e) && t.drawImage(s(Ar), ...Ke.saga), t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""}  ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.font = '11px "CardRenderer MTG Artist Credit", serif', e.artist && t.fillText("a", 93, 658), t.font = '11px "CardRenderer MTG Beleren", serif', t.fillText(e.artist ?? "", 108, 658, 210), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 646, 182)), t.restore();
}
let ha = null;
function Wm() {
  return ha ??= lt().load('550 22px "CardRenderer MTG Chapter"').then((t) => {
    if (!t.length || t.some((e) => e.status !== "loaded"))
      throw Error("Saga chapter numerals need card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw ha = null, t;
  });
}
function Fm(t, e, r) {
  const [n, o, s, a] = (r ? es : ts).rules, i = Re({
    rulesText: e.rulesText ?? "",
    rulesParagraphs: e.rulesParagraphs
  }), l = { x: n, y: o, width: s, height: a }, d = {
    leading: 0.98,
    paragraphGap: 0.32,
    flavorGap: 0.65,
    centerOffset: r ? 0 : 2.5
  };
  let u = r ? 22 : e.setCode?.toLowerCase() === "hou" ? 24.5 : 22.5, h = O(t, i, l, u, 14, d);
  if (!r && i.length === 1 && h.lines.length > 1 && h.lines.at(-1).width < s * 0.18)
    for (let m = u - 0.25; m >= u * 0.9; m -= 0.25) {
      const c = O(t, i, l, m, m, d);
      if (!c.overflow && c.lines.length < h.lines.length) {
        u = m, h = c;
        break;
      }
    }
  if (!r && e.rulesAlignment?.mode !== "left") {
    const m = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? i : i, c = nr(
      t,
      i,
      m,
      l,
      u,
      14,
      1,
      d
    );
    if (c) return c;
  }
  return h;
}
function _m(t, e, r, n, o) {
  const s = Gt(e), a = (i) => {
    const l = r.get(i);
    if (!l) throw Error(`Aftermath asset unavailable: ${i}`);
    return l;
  };
  t.save(), t.fillStyle = Et(e) ?? "#090806", t.fillRect(0, 0, 488, 680), n && t.drawImage(n, 0, 0, 488, 680), o !== "artwork" && s.forEach((i, l) => {
    t.save(), t.beginPath(), t.rect(0, l ? ve : 0, 488, l ? 680 - ve : ve), t.clip(), t.drawImage(a(Vi(i.face)), 0, 0, 488, 680), t.restore();
  }), s.forEach((i, l) => {
    t.save(), l && (t.translate(488, ve), t.rotate(Math.PI / 2));
    const d = i.face, u = l ? es : ts;
    if (_t(t, d, r, u.art, o), o !== "artwork") {
      t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
      const h = d.manaSymbols ?? [], m = 23.4, c = 1.6, g = l ? 246 : 451, f = h.length * m + Math.max(0, h.length - 1) * c, [b, y] = u.title;
      at(t, d.name, b, y + 15.5, g - f - b - 7, 26, !0), h.forEach(
        (w, S) => st(t, w, g - f + S * (m + c), y + 3, m, r, !0)
      );
      const p = l ? void 0 : r.get(Q(d) ?? "");
      if (at(
        t,
        d.typeLine ?? "",
        u.type[0],
        u.type[1] + 16.5,
        u.type[2] - (p ? 45 : 0),
        23,
        !0,
        1,
        "CardRenderer MTG Beleren",
        0,
        d.textInk
      ), p) {
        const w = ue(d), S = Math.min(50 / (p.width * w[2]), 27 / (p.height * w[3])), v = p.width * w[2] * S, C = p.height * w[3] * S, k = [451 - v, 252.3 - C / 2, v, C];
        Ut(Q(d)) || d.setSymbol ? t.drawImage(p, ...k) : oe(t, p, d.setCode, d.rarity, ...k, w);
      }
      Rt(t, Fm(t, d, !!l), r);
    }
    t.restore();
  }), o !== "artwork" && (Jt(e) && t.drawImage(a(Ki), ...Ke.aftermath), t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""}  ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.font = '11px "CardRenderer MTG Artist Credit", serif', e.artist && t.fillText("a", 93, 658), t.font = '11px "CardRenderer MTG Beleren", serif', t.fillText(e.artist ?? "", 108, 658, 220), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 646, 177))), t.restore();
}
const yo = "conjurer-planeswalker-v3", Um = {
  W: { hueDegrees: -19.0561061, saturationScale: 1.0414075, brightnessScale: 0.967493 },
  U: { hueDegrees: 10.198972, saturationScale: 0.7186607, brightnessScale: 0.8360822 },
  B: { hueDegrees: 5.4208506, saturationScale: 0.7598563, brightnessScale: 0.8801518 },
  R: { hueDegrees: -3.269066, saturationScale: 1.2589451, brightnessScale: 1.0859474 },
  G: { hueDegrees: 6.636047, saturationScale: 0.8931966, brightnessScale: 0.8272016 },
  M: { hueDegrees: -3.6353884, saturationScale: 0.9038432, brightnessScale: 0.9853541 },
  A: { hueDegrees: -0.0941491, saturationScale: 1.6, brightnessScale: 1.1230379 }
};
function El(t) {
  return t === "Gold" ? "M" : ["Colourless", "Artifact", "Land"].includes(t) ? "A" : t;
}
function Bl(t, e) {
  const r = t ? "tall" : "regular", n = t ? "planeswalkerTall" : "planeswalkerFrame", o = `${z.CONJURER_ROOT}/img/frames/planeswalker/${r}/${n}${e}.png`;
  return { family: r, source: o };
}
function jm(t, e, r, n) {
  if (n.hueDegrees === 0 && n.saturationScale === 1 && n.brightnessScale === 1) return;
  const o = t.getImageData(0, 0, e, r);
  for (let s = 0; s < o.data.length; s += 4) {
    if (!o.data[s + 3]) continue;
    const a = Ht([o.data[s] / 255, o.data[s + 1] / 255, o.data[s + 2] / 255], n);
    for (let i = 0; i < 3; i++) o.data[s + i] = Math.round(a[i] * 255);
  }
  t.putImageData(o, 0, 0);
}
async function Dm(t, e, r, n) {
  const o = B();
  o.width = e.width, o.height = e.height;
  try {
    const s = o.getContext("2d");
    if (!s) throw Error("Planeswalker background needs Canvas2D");
    const a = 0.03937 * 488, i = 0.02531 * 680, l = 0.92126 * 488, d = l * 3793 / 2778;
    if (s.drawImage(
      t,
      a / 488 * t.width,
      i / 680 * t.height,
      l / 488 * t.width,
      d / 680 * t.height,
      0,
      0,
      o.width,
      o.height
    ), jm(s, o.width, o.height, r), s.globalCompositeOperation = "destination-in", n) {
      const u = B();
      u.width = e.width, u.height = e.height;
      try {
        const h = u.getContext("2d");
        if (!h) throw Error("Planeswalker coverage needs Canvas2D");
        h.drawImage(e, 0, 0);
        const m = h.getImageData(0, 0, e.width, e.height);
        for (let c = 3; c < m.data.length; c += 4)
          m.data[c] = Math.min(255, Math.round(m.data[c] * 255 / 179));
        h.putImageData(m, 0, 0), s.drawImage(u, 0, 0);
      } finally {
        u.width = u.height = 0;
      }
    } else s.drawImage(e, 0, 0);
    return await createImageBitmap(o);
  } finally {
    o.width = o.height = 0;
  }
}
async function ma(t, e) {
  const r = B();
  r.width = t.width, r.height = t.height;
  try {
    const n = r.getContext("2d");
    if (!n) throw Error("Planeswalker inset needs Canvas2D");
    const o = (e ? 0.03937 : 0.04724) * 488, s = (e ? 0.92126 : 0.91339) * 488, a = t.width / s, i = (l) => (l - o) * a;
    if (e) {
      const l = [0, i(420), i(442), t.width - 4 * a, t.width], d = [
        0,
        i(420),
        i(442 - ft.rightInset),
        t.width - (4 + ft.rightInset) * a,
        t.width
      ];
      for (let u = 0; u < l.length - 1; u++)
        n.drawImage(
          t,
          l[u],
          0,
          l[u + 1] - l[u],
          t.height,
          d[u],
          0,
          d[u + 1] - d[u],
          t.height
        );
    } else {
      const l = Math.round(i(420)), d = l - ft.rightInset * a;
      n.drawImage(t, 0, 0), n.clearRect(d, 0, t.width - d, t.height), n.drawImage(
        t,
        l,
        0,
        t.width - l,
        t.height,
        d,
        0,
        t.width - l,
        t.height
      );
    }
    return await createImageBitmap(r);
  } finally {
    r.width = r.height = 0;
  }
}
async function Nm(t, e, r) {
  const n = K(t);
  if (!n.startsWith("planeswalker")) return { images: e, dispose() {
  } };
  const o = n === "planeswalker-large", s = El(j(t).boxes), a = Bl(o, s), i = he(j(t), n), l = (f) => {
    const b = e.get(f);
    if (!b) throw Error("Planeswalker asset unavailable: " + f);
    return b;
  }, d = l(a.source), u = l(i.background), h = t.calibration === "source" ? om : Um[s], m = l(i.frame), c = await Rl.acquireMany(
    [
      {
        key: JSON.stringify([
          yo,
          "background",
          a.source,
          i.background,
          u.width,
          u.height,
          h
        ]),
        bytes: u.width * u.height * 4,
        async build() {
          const f = await Dm(d, u, h, s === "A");
          try {
            return await ma(f, !0);
          } finally {
            f.close();
          }
        }
      },
      {
        key: JSON.stringify([
          yo,
          "frame",
          i.frame,
          m.width,
          m.height
        ]),
        bytes: m.width * m.height * 4,
        build: () => ma(m, !1)
      }
    ],
    r
  ), g = Object.assign(new Map(e), e);
  return g.set(i.background, c[0].value), g.set(i.frame, c[1].value), {
    images: g,
    dispose() {
      for (const f of c) f.release();
    }
  };
}
function Il(t, e) {
  const r = e.paper.map((i) => i * 255), n = e.sourceInk.map((i) => i * 255), o = e.inkTarget.map((i) => i * 255), s = r.map((i, l) => i - n[l]), a = s.reduce((i, l) => i + l * l, 0);
  if (!Number.isFinite(a) || a < 100)
    throw Error("Mana ink needs a contrasting paper palette.");
  for (let i = 0; i < t.length; i += 4) {
    if (t[i + 3] !== 255) continue;
    const l = Math.max(
      0,
      Math.min(1, s.reduce((d, u, h) => d + u * (r[h] - t[i + h]), 0) / a)
    );
    for (let d = 0; d < 3; d++)
      t[i + d] = Math.round(t[i + d] + (o[d] - n[d]) * l);
  }
}
function zm(t, e, r, n) {
  const o = n.inkExpansion ?? 0;
  if (!Number.isFinite(o) || o < 0 || o > 1)
    throw Error("Historical mana ink expansion is outside its supported range.");
  if (!o) return;
  if (!Number.isInteger(e) || !Number.isInteger(r) || e <= 0 || r <= 0 || t.length !== e * r * 4)
    throw Error("Historical mana ink pixels do not match their dimensions.");
  const s = Te(n.discColor), a = Te(n.inkColor), i = s.map((c, g) => c - a[g]), l = i.reduce((c, g) => c + g * g, 0);
  if (l < 0.01) throw Error("Historical mana palette has no ink contrast");
  const d = new Float32Array(e * r);
  for (let c = 0; c < d.length; c++)
    t[c * 4 + 3] < 255 || (d[c] = Math.max(
      0,
      Math.min(1, i.reduce((g, f, b) => g + f * (s[b] - t[c * 4 + b] / 255), 0) / l)
    ));
  const u = Math.min(e, r) * o / 24, h = Math.ceil(u), m = [];
  for (let c = -h; c <= h; c++)
    for (let g = -h; g <= h; g++) {
      const f = Math.max(0, Math.min(1, u + 1 - Math.hypot(g, c)));
      f && m.push({ x: g, y: c, weight: f });
    }
  for (let c = 0; c < r; c++)
    for (let g = 0; g < e; g++) {
      const f = c * e + g;
      if (t[f * 4 + 3] < 255) continue;
      let b = d[f];
      for (const y of m) {
        const p = g + y.x, w = c + y.y;
        p >= 0 && p < e && w >= 0 && w < r && (b = Math.max(b, d[w * e + p] * y.weight));
      }
      if (!(b <= d[f]))
        for (let y = 0; y < 3; y++)
          t[f * 4 + y] = Math.round(255 * (s[y] * (1 - b) + a[y] * b));
    }
}
function Ym(t, e, r) {
  const n = Te(e.discColor), o = Te(e.inkColor), s = n.map((i, l) => i - o[l]), a = s.reduce((i, l) => i + l * l, 0);
  if (a < 0.01) throw Error("Historical mana palette has no ink contrast");
  for (let i = 0; i < t.length; i += 4) {
    if (!t[i + 3]) continue;
    const l = Math.max(
      0,
      Math.min(1, s.reduce((d, u, h) => d + (t[i + h] / 255 - o[h]) * u, 0) / a)
    );
    for (let d = 0; d < 3; d++)
      t[i + d] = Math.round(255 * (o[d] * (1 - l) + r[d] * l));
  }
}
async function qm(t, e, r, n) {
  const o = B();
  o.width = t.width, o.height = t.height;
  try {
    const s = o.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("Historical mana preparation needs Canvas2D.");
    s.drawImage(t, 0, 0);
    const a = s.getImageData(0, 0, o.width, o.height);
    return e.inkExpansion && zm(a.data, o.width, o.height, e), Ym(a.data, e, r), n && Il(a.data, n), s.putImageData(a, 0, 0), await createImageBitmap(o);
  } finally {
    o.width = o.height = 0;
  }
}
function Hm(t, e, r) {
  const { width: n, height: o, data: s } = t;
  if (e.width !== n || e.height !== o || e.data.length !== s.length || !Number.isInteger(r) || r < 0 || r > Math.max(n, o))
    throw RangeError("Invalid frame material selection");
  const a = new Uint8Array(n * o), i = new Uint8Array(n * o), l = new Int32Array(Math.max(n, o));
  for (const d of [!1, !0]) {
    const u = d ? o : n, h = d ? n : o;
    for (let m = 0; m < h; m++) {
      let c = 0, g = 0, f = -1;
      const b = (p) => d ? p * n + m : m * n + p, y = (p) => d ? a[b(p)] : s[b(p) * 4 + 3];
      for (let p = 0; p < u; p++) {
        const w = Math.min(u - 1, p + r);
        for (; f < w; ) {
          for (f++; g > c && y(l[g - 1]) <= y(f); ) g--;
          l[g++] = f;
        }
        for (; c < g && l[c] < p - r; ) c++;
        (d ? i : a)[b(p)] = y(l[c]);
      }
    }
  }
  for (let d = 0; d < i.length; d++)
    s[d * 4 + 3] = Math.max(
      s[d * 4 + 3],
      Math.round(i[d] * e.data[d * 4 + 3] / 255)
    );
}
function Xm(t, e, r) {
  if (e.width !== t.width || e.height !== t.height || e.data.length !== t.data.length || !Number.isFinite(r.amount) || r.amount < 0 || r.amount > 1 || r.backdrop.length !== 3 || r.backdrop.some((n) => !Number.isFinite(n) || n < 0 || n > 1))
    throw RangeError("Invalid frame material blend");
  for (let n = 0; n < t.data.length; n += 4) {
    if (!t.data[n + 3] || !e.data[n + 3]) continue;
    const o = r.amount * e.data[n + 3] / 255;
    for (let s = 0; s < 3; s++)
      t.data[n + s] = Math.round(
        t.data[n + s] * (1 - o) + Math.min(t.data[n + s], 255 * r.backdrop[s]) * o
      );
  }
}
function Jm(t, e) {
  const { width: r, height: n, data: o } = t, s = new Uint8Array(r * n), a = new Uint32Array(r * n);
  let i = 0;
  if (e) {
    for (let d = 0; d < r * n; d++) {
      const u = d * 4;
      o[u + 3] && e.data[u + 3] && Math.max(o[u], o[u + 1], o[u + 2]) < 96 && (a[i++] = d);
    }
    return a.slice(0, i);
  }
  const l = (d, u) => {
    if (d < 0 || u < 0 || d >= r || u >= n || d > r * 0.075 && d < r * 0.925 && u > n * 0.06 && u < n * 0.94) return;
    const h = u * r + d;
    if (s[h]) return;
    s[h] = 1;
    const m = h * 4, c = o[m], g = o[m + 1], f = o[m + 2];
    !o[m + 3] || Math.max(c, g, f) >= 96 || Math.max(c, g, f) - Math.min(c, g, f) > 6 || (a[i++] = h);
  };
  for (let d = 0; d < r; d++)
    l(d, 0), l(d, n - 1);
  for (let d = 0; d < n; d++)
    l(0, d), l(r - 1, d);
  for (let d = 0; d < i; d++) {
    const u = a[d], h = u % r, m = Math.floor(u / r);
    l(h - 1, m), l(h + 1, m), l(h, m - 1), l(h, m + 1);
  }
  return a.slice(0, i);
}
function Km(t, e, r, n, o) {
  Ol(n);
  for (const s of r) {
    const a = s * 4, i = Math.max(0, 1 - Math.max(e[a], e[a + 1], e[a + 2]) / 96) ** 2, l = o ? o.data[a + 3] / 255 : 1;
    for (let d = 0; d < 3; d++)
      t.data[a + d] = Math.round(
        t.data[a + d] * (1 - l) + (e[a + d] + n[d] * 255 * i) * l
      );
  }
}
function Ol(t) {
  if (t.length !== 3 || t.some((e) => !Number.isFinite(e) || e < 0 || e > 48 / 255))
    throw RangeError("Invalid baked stock black level");
}
const Nn = (t) => {
  const e = Math.max(0, Math.min(1, t));
  return e * e * (3 - 2 * e);
}, zn = (t) => {
  const e = Math.max(1e-3, t[0] + t[1] + t[2]);
  return t.map((r) => r / e);
};
function ca(t, e) {
  const { width: r, height: n, data: o } = t, s = new Float32Array(r * n);
  if (e.kind === "polygon") {
    if (e.points.length < 3 || !Number.isFinite(e.feather) || e.feather <= 0 || e.points.some((M) => M.some((x) => !Number.isFinite(x) || x < 0 || x > 1)))
      throw Error(
        "Paper outline requires at least three normalized points and positive feathering."
      );
    const w = e.points.map(([M, x]) => [M * r, x * n]), S = e.feather * r, v = Math.max(0, Math.floor(Math.min(...w.map((M) => M[0])) - S)), C = Math.min(r, Math.ceil(Math.max(...w.map((M) => M[0])) + S)), k = Math.max(0, Math.floor(Math.min(...w.map((M) => M[1])) - S)), R = Math.min(n, Math.ceil(Math.max(...w.map((M) => M[1])) + S));
    for (let M = k; M < R; M++)
      for (let x = v; x < C; x++) {
        let E = !1, $ = 1 / 0;
        const A = x + 0.5, _ = M + 0.5;
        for (let I = 0; I < w.length; I++) {
          const [q, H] = w[I], [it, jt] = w[(I + 1) % w.length], et = it - q, N = jt - H, tt = et * et + N * N, U = tt ? Math.max(0, Math.min(1, ((A - q) * et + (_ - H) * N) / tt)) : 0;
          $ = Math.min($, Math.hypot(A - q - U * et, _ - H - U * N)), H > _ != jt > _ && A < q + (_ - H) * et / N && (E = !E);
        }
        s[M * r + x] = Nn((E ? $ : -$) / S + 0.5);
      }
    return s;
  }
  if (e.kind === "rect") {
    const [w, S, v, C] = e.rect;
    for (let k = 0; k < n; k++)
      for (let R = 0; R < r; R++) {
        const M = Math.min(
          R / r - w,
          w + v - R / r,
          k / n - S,
          S + C - k / n
        );
        s[k * r + R] = Nn(M / e.feather + 0.5);
      }
    return s;
  }
  const a = zn(e.frameRgb), i = zn(e.paperRgb), l = i.map((w, S) => w - a[S]), d = l.reduce((w, S) => w + S * S, 0);
  if (d < 1e-3) throw Error("Paper and frame chroma are too similar for this mask.");
  const [u, h, m, c] = e.bounds;
  for (let w = 0; w < n; w++)
    for (let S = 0; S < r; S++) {
      if (S / r < u || S / r > u + m || w / n < h || w / n > h + c)
        continue;
      const v = w * r + S, C = v * 4;
      if (o[C + 3] < 250) continue;
      const R = zn([o[C] / 255, o[C + 1] / 255, o[C + 2] / 255]).reduce((M, x, E) => M + (x - a[E]) * l[E], 0) / d;
      s[v] = Nn((R - 0.22) / 0.56);
    }
  const g = new Uint8Array(s.length), f = new Int32Array(s.length), b = Math.round(e.seed[1] * n) * r + Math.round(e.seed[0] * r);
  if (!(s[b] > 0.08)) throw Error("Paper mask seed is outside the paper.");
  let y = 0, p = 1;
  for (f[0] = b, g[b] = 1; y < p; ) {
    const w = f[y++], S = w % r;
    for (const v of [w - r, w + r, S ? w - 1 : -1, S < r - 1 ? w + 1 : -1])
      v >= 0 && v < g.length && !g[v] && s[v] > 0.08 && (g[v] = 1, f[p++] = v);
  }
  for (let w = 0; w < s.length; w++) g[w] || (s[w] = 0);
  return s;
}
const Yn = (t) => {
  const e = Math.max(0, Math.min(1, t));
  return e * e * (3 - 2 * e);
}, ga = ([t, e, r, n], o, s) => o >= t && s >= e && o < t + r && s < e + n;
function Vm(t, e) {
  if (!(e.hueCenter >= 0 && e.hueCenter < 360) || !(e.hueRadius > 0 && e.hueRadius <= 180) || !(e.hueFeather > 0 && e.hueFeather <= e.hueRadius) || !(e.saturation[0] >= 0 && e.saturation[1] > e.saturation[0] && e.saturation[1] <= 1) || e.brightness !== void 0 && !(e.brightness[0] >= 0 && e.brightness[1] > e.brightness[0] && e.brightness[1] <= 1))
    throw Error("Invalid source pigment mask.");
  for (const { outer: n, inner: o } of e.rings)
    if (![...n, ...o].every(Number.isFinite) || n[2] <= 0 || n[3] <= 0 || o[2] <= 0 || o[3] <= 0 || o[0] < n[0] || o[1] < n[1] || // Normalized shared edges can differ by one floating-point rounding bit.
    o[0] + o[2] > n[0] + n[2] + 1e-12 || o[1] + o[3] > n[1] + n[3] + 1e-12)
      throw Error("Source pigment rings need nested positive rectangles.");
  const r = new Float32Array(t.width * t.height);
  for (let n = 0; n < t.height; n++)
    for (let o = 0; o < t.width; o++) {
      const s = n * t.width + o, a = s * 4, i = (o + 0.5) / t.width, l = (n + 0.5) / t.height;
      if (!t.data[a + 3] || !e.rings.some((c) => ga(c.outer, i, l) && !ga(c.inner, i, l)))
        continue;
      const [d, u, h] = un([
        t.data[a] / 255,
        t.data[a + 1] / 255,
        t.data[a + 2] / 255
      ]), m = Math.abs((d - e.hueCenter + 540) % 360 - 180);
      r[s] = Yn((e.hueRadius - m) / e.hueFeather) * Yn((u - e.saturation[0]) / (e.saturation[1] - e.saturation[0])) * (e.brightness ? Yn((h - e.brightness[0]) / (e.brightness[1] - e.brightness[0])) : 1);
    }
  return r;
}
function Zm(t, e, r, n) {
  if ("mask" in e)
    for (const h of [
      e.frame,
      e.paper,
      ...e.regions?.map((m) => m.adjustment) ?? [],
      ...e.accents?.map((m) => m.adjustment) ?? []
    ])
      ia(h);
  else ia(e);
  if (e.blackPoint && gd(e.blackPoint), e.outerStock && Ol(e.outerStock), e.outerStockMaskSource && (!n || n.width !== t.width || n.height !== t.height || n.data.length !== t.data.length))
    throw RangeError("Frame stock correction needs its source selection");
  if (e.blackPoint?.textureMaskSource && (!r || r.width !== t.width || r.height !== t.height || r.data.length !== t.data.length))
    throw RangeError("Frame texture correction needs its source selection");
  const o = "mask" in e ? e : void 0, s = o ? ca(t, o.mask) : void 0, a = "mask" in e ? e.frame : e, i = o?.regions?.map((h) => ({
    values: ca(t, h.mask),
    adjustment: h.adjustment
  })) ?? [], l = [
    ...i,
    ...o?.accents?.map((h) => ({
      values: Vm(t, h.mask),
      adjustment: h.adjustment
    })) ?? []
  ];
  for (let h = 0; h < t.data.length; h += 4) {
    if (t.data[h + 3] === 0) continue;
    const m = [t.data[h] / 255, t.data[h + 1] / 255, t.data[h + 2] / 255], c = Math.max(...m), g = c === 0 ? 0 : (c - Math.min(...m)) / c;
    if (c < 0.075 || !o && g < 0.025 && c > 0.97) continue;
    const f = s?.[h / 4] ?? 0, b = Ht(m, f === 1 && o ? o.paper : a), y = f > 0 && f < 1 && o ? Ht(m, o.paper) : b;
    for (let p = 0; p < 3; p++)
      t.data[h + p] = Math.round(
        Math.round(255 * b[p]) * (1 - f) + Math.round(255 * y[p]) * f
      );
    for (const p of l) {
      const w = p.values[h / 4];
      if (!w) continue;
      const S = Ht(m, p.adjustment);
      for (let v = 0; v < 3; v++)
        t.data[h + v] = Math.round(
          t.data[h + v] * (1 - w) + 255 * S[v] * w
        );
    }
  }
  const d = e.outerStock ? t.data.slice() : void 0, u = e.outerStock ? Jm(t, n) : void 0;
  e.blackPoint && fd(t, e.blackPoint, r), e.outerStock && d && u && Km(t, d, u, e.outerStock, n);
}
const Qm = { hueDegrees: -1.0625, saturationScale: 0.9087500000000004, brightnessScale: 0.9406250000000002, gamma: 0.738125 }, tc = { W: { header: { hueDegrees: -14.024193548387075, saturationScale: 0.5265905874026912, brightnessScale: 0.9495967741935485 }, paper: { hueDegrees: -1.1750690607734668, saturationScale: 0.7998024425287352, brightnessScale: 0.9392712550607287 }, pinline: { hueDegrees: -8.203598940779898, saturationScale: 0.4898632906133164, brightnessScale: 0.9302788844621516 }, glyph: { source: [0.9882352941176471, 0.996078431372549, 1], target: [0.9431372549019608, 0.9352941176470588, 0.9372549019607843] } }, U: { header: { hueDegrees: 42.78801843317967, saturationScale: 0.45884697719052203, brightnessScale: 0.9842342342342343 }, paper: { hueDegrees: 32.97916666666663, saturationScale: 0.5842800834685827, brightnessScale: 1.0133928571428572 }, pinline: { hueDegrees: 17.557840616966587, saturationScale: 0.5557142857142856, brightnessScale: 1.1666666666666667 }, glyph: { source: [0, 0.4588235294117647, 0.7450980392156863], target: [0.396078431372549, 0.4392156862745098, 0.7176470588235293] } }, B: { header: { hueDegrees: -14.404807692307713, saturationScale: 1.421528644784533, brightnessScale: 1.0159574468085106 }, paper: { hueDegrees: -12.3125, saturationScale: 1.2126352339181279, brightnessScale: 1.0239520958083832 }, pinline: { hueDegrees: -88.07559082483772, saturationScale: 1.277991260837483, brightnessScale: 1.308125 }, glyph: { source: [0.15294117647058825, 0.14901960784313725, 0.1411764705882353], target: [0.11568627450980393, 0.09607843137254901, 0.12941176470588234] } }, R: { header: { hueDegrees: 2.5092658770676053, saturationScale: 0.7511073790822655, brightnessScale: 0.9318181818181819 }, paper: { hueDegrees: 8.412850307587178, saturationScale: 1.0477689369398555, brightnessScale: 0.9504310344827587 }, pinline: { hueDegrees: 3.0543379373086736, saturationScale: 1.0001076704423102, brightnessScale: 1.0559610705596107 }, glyph: { source: [0.9372549019607843, 0.2196078431372549, 0.15294117647058825], target: [0.8196078431372549, 0.24901960784313726, 0.20588235294117646] } }, G: { header: { hueDegrees: -59.16304347826099, saturationScale: 1.0029481528127626, brightnessScale: 0.9543269230769231 }, paper: { hueDegrees: -26.824145962732928, saturationScale: 0.9416448402304863, brightnessScale: 0.969626168224299 }, pinline: { hueDegrees: -21.627829393491652, saturationScale: 0.47678542547538166, brightnessScale: 1.16243654822335 }, glyph: { source: [0, 0.4823529411764706, 0.2627450980392157], target: [0.22745098039215686, 0.4568627450980392, 0.29411764705882354] } } }, $l = {
  outer: Qm,
  colors: tc
}, fa = (t) => {
  if (t.length !== 3 || t.some((e) => !Number.isFinite(e) || e < 0 || e > 1))
    throw Error("Invalid Eighth basic-land palette.");
  return [t[0], t[1], t[2]];
}, ec = new Map(
  Object.entries($l.colors).map(([t, e]) => [
    t,
    { ...e, glyph: { source: fa(e.glyph.source), target: fa(e.glyph.target) } }
  ])
), wo = $l.outer;
function cs(t) {
  if (t.colorCalibration !== "set-hsb-v1" || t.frameAssetFamily !== "eighth" || t.setCode?.toLowerCase() !== "8ed" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = Mr(t), r = e ? ec.get(e) : void 0;
  if (!r) return;
  const n = xt(t);
  if (!(!n || !Wo(t, n.frame)))
    return { color: e, palette: r, frame: n.frame, glyph: wn(t) };
}
const rc = { left: [[34.1933, 40.6667], [34.6766, 39.4527], [35.4016, 38.4816], [35.6432, 38.4816], [36.6098, 37.2677], [36.8515, 37.2677], [38.3014, 35.8109], [39.7512, 34.8398], [42.1677, 33.8687], [46.7591, 32.6547], [51.1087, 32.1692], [51.3504, 31.9264], [53.5252, 31.9264], [53.7669, 31.6836], [60.2914, 31.6836], [60.533, 31.9264], [62.4662, 31.9264], [63.9161, 32.4119], [65.6077, 32.4119], [67.5409, 32.8975], [71.4072, 34.1114], [74.7903, 35.8109], [77.4485, 37.7532], [380.4762, 37.7532], [384.8259, 35.3254], [388.6923, 34.1114], [394.7335, 33.3831], [394.9751, 33.1403], [402.2246, 32.8975], [402.4662, 33.1403], [405.366, 33.1403], [405.6077, 33.3831], [411.4072, 34.1114], [415.032, 35.3254], [417.9318, 36.7821], [418.6567, 37.5104], [420.8316, 37.5104], [421.0732, 37.7532], [610.7676, 37.7532], [611.0092, 37.996], [613.6674, 37.996]], right: [[34.435, 448.79], [35.8849, 450.7323], [36.1265, 450.7323], [36.3682, 451.2179], [38.0597, 452.6746], [39.0263, 452.9174], [40.9595, 454.1313], [44.8259, 455.5881], [46.5174, 455.8308], [48.4506, 456.5592], [53.5252, 456.802], [53.7669, 457.0448], [54.9751, 457.0448], [55.2168, 456.802], [59.3248, 457.0448], [59.5665, 456.802], [66.091, 456.5592], [66.8159, 456.0736], [70.6823, 455.3453], [73.0988, 453.8886], [73.5821, 453.8886], [76.2402, 451.9463], [77.6901, 451.2179], [103.3049, 451.2179], [103.5466, 451.4607], [104.9964, 451.4607], [105.2381, 451.2179], [124.0867, 451.4607], [124.3284, 451.2179], [125.5366, 451.2179], [125.7783, 451.4607], [129.8863, 451.4607], [130.1279, 451.7035], [139.3106, 451.7035], [139.5522, 451.4607], [143.4186, 451.4607], [143.6603, 451.2179], [144.6269, 451.4607], [148.7349, 451.4607], [148.9765, 451.2179], [161.059, 451.2179], [161.3006, 451.4607], [163.9588, 451.4607], [164.2004, 451.2179], [169.0334, 451.2179], [169.2751, 451.4607], [171.2082, 451.4607], [171.4499, 451.2179], [172.6581, 451.4607], [174.833, 451.4607], [175.0746, 451.2179], [175.7996, 451.4607], [179.4243, 451.4607], [179.666, 451.2179], [181.8408, 451.2179], [182.0824, 451.4607], [187.6404, 451.4607], [187.882, 451.2179], [192.4733, 451.2179], [192.715, 451.4607], [193.4399, 451.2179], [199.7228, 451.2179], [199.9645, 451.4607], [200.9311, 451.2179], [208.1805, 451.2179], [208.4222, 451.4607], [209.6304, 451.4607], [209.8721, 451.2179], [227.9957, 451.2179], [228.2374, 451.4607], [229.9289, 451.4607], [230.1706, 451.2179], [246.8443, 451.2179], [247.086, 451.4607], [259.6517, 451.4607], [259.8934, 451.2179], [261.1016, 451.4607], [261.8266, 451.2179], [263.0348, 451.2179], [263.2765, 451.4607], [263.7598, 451.2179], [265.9346, 451.2179], [266.1763, 451.4607], [268.8344, 451.4607], [269.076, 451.2179], [367.1855, 451.4607], [367.4271, 451.2179], [374.9183, 451.2179], [375.1599, 451.4607], [377.8181, 451.4607], [378.0597, 451.2179], [379.9929, 451.2179], [381.9261, 452.1891], [382.651, 452.9174], [385.3092, 454.1313], [389.9005, 455.3453], [394.7335, 455.8308], [394.9751, 456.0736], [405.366, 456.0736], [405.6077, 455.8308], [408.7491, 455.5881], [413.0988, 454.6169], [415.5153, 453.6458], [416.4819, 453.6458], [419.14, 451.4607], [419.865, 451.2179], [426.3895, 451.2179], [426.6311, 451.4607], [432.1891, 451.4607], [432.4307, 451.2179], [434.8472, 451.2179], [435.0888, 451.4607], [613.6674, 451.2179]] }, nc = { left: [[39.0263, 39.4527], [39.7512, 38.7244], [43.6176, 36.5393], [49.4172, 35.0826], [53.7669, 34.8398], [54.0085, 34.597], [59.8081, 34.597], [60.0498, 34.8398], [65.8493, 35.0826], [68.7491, 35.8109], [73.0988, 37.5104], [75.032, 38.7244], [76.7235, 40.4239], [76.9652, 60.8179]], right: [[39.0263, 449.0328], [39.7512, 449.7612], [42.651, 451.4607], [48.209, 453.1602], [49.4172, 453.1602], [51.1087, 453.6458], [57.3916, 453.6458], [58.5999, 453.8886], [58.8415, 453.6458], [63.4328, 453.6458], [70.199, 452.1891], [75.032, 449.7612], [76.7235, 448.0617], [76.9652, 447.5761]] }, oc = { left: [[384.1009, 41.395], [385.5508, 40.1811], [387.484, 39.21], [392.317, 37.7532], [395.7001, 37.5104], [395.9417, 37.2677], [408.2658, 37.5104], [412.6155, 38.7244], [415.2736, 39.9383], [417.9318, 41.6378], [418.4151, 42.3662], [418.6567, 60.8179], [418.8984, 60.8179]], right: [[384.1009, 447.8189], [385.3092, 448.79], [388.9339, 450.4896], [392.5586, 451.4607], [396.9083, 451.7035], [397.15, 451.9463], [404.3994, 451.9463], [404.6411, 451.7035], [408.7491, 451.4607], [413.5821, 450.004], [415.9986, 448.79], [418.4151, 446.8478], [418.6567, 428.8816], [418.8984, 428.8816]] }, sc = { left: [[424.2146, 41.6378], [608.3511, 41.6378], [609.3177, 41.395], [609.5593, 60.8179], [609.801, 60.8179]], right: [[424.2146, 446.3622], [424.6979, 446.1194], [602.3099, 446.1194], [602.5515, 446.3622], [608.5928, 446.1194], [609.076, 446.3622], [609.3177, 446.1194], [609.5593, 428.8816], [609.801, 428.8816]] }, cr = {
  outer: rc,
  title: nc,
  type: oc,
  paper: sc
}, ac = cr, hn = (t) => Math.max(0, Math.min(1, t)), Gl = (t) => {
  const e = hn(t);
  return e * e * (3 - 2 * e);
}, pa = (t, e) => {
  let r = 0;
  for (; r + 1 < t.length - 1 && t[r + 1][0] < e; ) r++;
  const n = t[r], o = t[r + 1];
  return n[1] + hn((e - n[0]) / (o[0] - n[0])) * (o[1] - n[1]);
};
function Wr(t, e) {
  const { left: r, right: n } = e, o = Math.max(r[0][0], n[0][0]), s = Math.min(r.at(-1)[0], n.at(-1)[0]);
  return Array.from({ length: t }, (a, i) => {
    const l = (i + 0.5) * 680 / t;
    return [pa(r, l), pa(n, l), Math.min(l - o, s - l)];
  });
}
const Fr = (t, e) => Gl(0.5 + Math.min(e - t[0], t[1] - e, t[2]) / 0.4), qn = (t, e, r) => [
  t[0] + r * (e[0] - t[0]),
  t[1] + r * (e[1] - t[1]),
  t[2] + r * (e[2] - t[2])
];
function ic(t, e) {
  const r = Wr(t.height, cr.outer), n = Wr(t.height, cr.title), o = Wr(t.height, cr.type), s = Wr(t.height, cr.paper);
  for (let a = 0; a < t.height; a++)
    for (let i = 0; i < t.width; i++) {
      const l = (a * t.width + i) * 4;
      if (!t.data[l + 3]) continue;
      const d = [t.data[l] / 255, t.data[l + 1] / 255, t.data[l + 2] / 255], u = Math.max(...d);
      if (u < 0.075) continue;
      const h = (i + 0.5) * 488 / t.width, m = Fr(r[a], h), c = Math.max(Fr(n[a], h), Fr(o[a], h)), g = Fr(s[a], h);
      let f;
      if (m < 1) {
        const b = Math.pow(u, wo.gamma) / u, y = Ht([d[0] * b, d[1] * b, d[2] * b], wo);
        f = qn(d, y, Gl((u - 0.075) / 0.125));
      } else f = d;
      if (m > 0) {
        const b = g > 0 ? e.paper : e.header, y = Math.max(c, g), p = y === 1 ? d : Ht(d, e.pinline), w = y > 0 ? qn(p, Ht(d, b), y) : p;
        f = qn(f, w, m);
      }
      for (let b = 0; b < 3; b++) t.data[l + b] = Math.round(255 * f[b]);
    }
}
function lc(t, e) {
  const r = (a) => (a[0] + a[1] + a[2]) / 3, n = r(e.source), o = e.source.map((a) => a - n), s = o.reduce((a, i) => a + i * i, 0);
  if (s <= 1e-6) throw Error("Basic glyph fill cannot be separated from neutral details.");
  for (let a = 0; a < t.data.length; a += 4) {
    if (!t.data[a + 3]) continue;
    const i = [t.data[a] / 255, t.data[a + 1] / 255, t.data[a + 2] / 255], l = r(i), d = hn(i.reduce((u, h, m) => u + (h - l) * o[m], 0) / s);
    for (let u = 0; u < 3; u++)
      t.data[a + u] = Math.round(
        255 * hn(i[u] + d * (e.target[u] - e.source[u]))
      );
  }
}
function dc(t, e) {
  const r = cs(t);
  return r ? [
    {
      url: r.frame,
      kind: "frame",
      color: (o) => ic(o, r.palette)
    },
    ...r.glyph ? [
      {
        url: r.glyph,
        kind: "glyph",
        color: (o) => lc(o, r.palette.glyph)
      }
    ] : []
  ].map(({ url: o, kind: s, color: a }) => {
    const i = e.get(o);
    if (!i) throw Error(`Eighth basic-land material unavailable: ${o}`);
    return {
      url: o,
      key: JSON.stringify([
        "eighth-basic-material-v1",
        o,
        i.width,
        i.height,
        s === "frame" ? [r.palette, wo, ac] : r.palette.glyph
      ]),
      bytes: i.width * i.height * 4,
      build: async () => {
        const l = B();
        l.width = i.width, l.height = i.height;
        try {
          const d = l.getContext("2d", { willReadFrequently: !0 });
          if (!d) throw Error("Basic-land color preparation needs Canvas2D.");
          d.drawImage(i, 0, 0);
          const u = d.getImageData(0, 0, l.width, l.height);
          return a(u), d.putImageData(u, 0, 0), await createImageBitmap(l);
        } finally {
          l.width = l.height = 0;
        }
      }
    };
  }) : [];
}
function uc(t, e) {
  if (t.width !== e.width || t.height !== e.height)
    throw Error("Stamp palette dimensions differ.");
  for (let r = 0; r < t.height; r++)
    for (let n = 0; n < t.width; n++) {
      const o = (r * t.width + n) * 4, s = Math.max(0, Math.min(1, ((n + 0.5) / t.width - 0.35) / 0.3)), a = t.data[o + 3] * (1 - s), i = e.data[o + 3] * s, l = a + i;
      for (let d = 0; d < 3; d++)
        t.data[o + d] = l ? (t.data[o + d] * a + e.data[o + d] * i) / l : 0;
      t.data[o + 3] = l;
    }
}
function hc(t, e) {
  const r = Ce(t);
  if (!r) return [];
  const n = Pt(t.setCode, t.borderColor).border === "#090806";
  if (!n && !r.rightImage) return [];
  const o = t.calibration === void 0 ? "#090806" : Et(t) ?? "#090806", s = [1, 3, 5].map((l) => parseInt(o.slice(l, l + 2), 16)), a = e.get(r.image);
  if (!a) throw Error("Authenticity stamp asset is unavailable.");
  const i = r.rightImage ? e.get(r.rightImage) : void 0;
  if (r.rightImage && !i) throw Error("Authenticity stamp asset is unavailable.");
  if (i && (i.width !== a.width || i.height !== a.height))
    throw Error("Authenticity stamp palette sources have different dimensions.");
  return [
    {
      url: r.image,
      key: JSON.stringify([
        "security-stamp-frame-palette-v5",
        r.image,
        r.rightImage ?? null,
        n,
        o,
        a.width,
        a.height
      ]),
      bytes: a.width * a.height * 4,
      build: async () => {
        const l = B();
        l.width = a.width, l.height = a.height;
        try {
          const d = l.getContext("2d", { willReadFrequently: !0 });
          if (!d) throw Error("Stamp preparation needs Canvas2D.");
          let u;
          i && (d.drawImage(i, 0, 0), u = d.getImageData(0, 0, l.width, l.height), d.clearRect(0, 0, l.width, l.height)), d.drawImage(a, 0, 0);
          const h = d.getImageData(0, 0, l.width, l.height);
          u && uc(h, u);
          for (let m = 0; n && m < h.data.length; m += 4) {
            if (!h.data[m + 3]) continue;
            const c = Math.max(h.data[m], h.data[m + 1], h.data[m + 2]);
            if (c >= 24) continue;
            const g = (1 - c / 24) ** 2;
            h.data[m] = h.data[m] + s[0] * g, h.data[m + 1] = h.data[m + 1] + s[1] * g, h.data[m + 2] = h.data[m + 2] + s[2] * g;
          }
          return d.putImageData(h, 0, 0), await createImageBitmap(l);
        } finally {
          l.width = l.height = 0;
        }
      }
    }
  ];
}
const mc = {
  N: [
    [0.64, 0.67, 0.73],
    [0.7, 0.72, 0.76]
  ],
  W: [
    [0.86, 0.86, 0.86],
    [0.92, 0.93, 1.02]
  ],
  U: [
    [0.64, 0.64, 0.7],
    [0.61, 0.66, 0.73]
  ],
  B: [
    [0.63, 0.58, 0.54],
    [0.51, 0.5, 0.5]
  ],
  R: [
    [0.79, 0.77, 0.7],
    [0.91, 0.98, 0.76]
  ],
  G: [
    [0.81, 0.71, 0.78],
    [0.91, 0.77, 0.91]
  ]
};
function cc(t, e) {
  if (t.frameTemplate !== "future") return [];
  const r = t.setCode?.toLowerCase() === "fut" && t.colorCalibration === "set-hsb-v1", n = /* @__PURE__ */ new Set();
  return [...new Set(t.manaSymbols ?? [])].flatMap((o) => {
    const s = /^(?:\d+|X)$/.test(o), a = r ? mc[s ? "N" : o] : void 0, i = vn(o), l = i ? e.get(i) : void 0;
    if (!a && !s || !i || !l || n.has(i)) return [];
    n.add(i);
    const d = s ? uo().map((u) => {
      const h = e.get(u);
      if (!h || h.width !== l.width || h.height !== l.height)
        throw Error("Future generic medallion requires all matching pinned numeral sources");
      return h;
    }) : [];
    return [
      {
        url: i,
        key: JSON.stringify([
          "future-mana-color-blank-v2",
          i,
          l.width,
          l.height,
          a,
          s ? uo() : null
        ]),
        bytes: l.width * l.height * 4,
        build: () => gc(l, a, d)
      }
    ];
  });
}
async function gc(t, e, r) {
  const n = B();
  n.width = t.width, n.height = t.height;
  try {
    const o = n.getContext("2d", { willReadFrequently: !0 });
    o.drawImage(t, 0, 0);
    const s = o.getImageData(0, 0, n.width, n.height);
    for (const l of r) {
      o.clearRect(0, 0, n.width, n.height), o.drawImage(l, 0, 0);
      const d = o.getImageData(0, 0, n.width, n.height).data;
      for (let u = 0; u < s.data.length; u++)
        u % 4 !== 3 && (s.data[u] = Math.max(s.data[u], d[u]));
    }
    const [a, i] = e ?? [
      [1, 1, 1],
      [1, 1, 1]
    ];
    for (let l = 0; l < n.height; l++)
      for (let d = 0; d < n.width; d++) {
        const u = (l * n.width + d) * 4;
        if (!s.data[u + 3]) continue;
        const h = Math.hypot((d + 0.5) / n.width - 0.5, (l + 0.5) / n.height - 0.5), m = Math.max(0, Math.min(1, (h - 0.31) / 0.03)), c = m * m * (3 - 2 * m);
        for (let g = 0; g < 3; g++)
          s.data[u + g] = Math.round(
            s.data[u + g] * (a[g] * (1 - c) + i[g] * c)
          );
      }
    return o.putImageData(s, 0, 0), await createImageBitmap(n);
  } finally {
    n.width = n.height = 0;
  }
}
async function fc(t, e, r) {
  t = me(t);
  const n = { images: e, dispose() {
  } }, o = w0(t) ?? po(t, "INK"), s = /* @__PURE__ */ new Map(), a = new Map(Object.entries(pl(t))), i = {}, l = {}, d = /* @__PURE__ */ new Set(), u = [], h = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...[...(t.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((S) => S[1])
  ]);
  for (const S of t.rulesParagraphs ?? [])
    for (const v of S.runs) for (const C of v.text.matchAll(/\{([^}]+)\}/g)) h.add(C[1]);
  for (const S of h) {
    const v = /^\d+$/.test(S) || S === "X" && Ze(t) ? "N" : S, C = ro(t, S), k = C?.discColor ?? $n[v], R = po(t, v) ?? (C && $n[v] ? Te(v === "W" ? "#efe7cb" : $n[v]) : void 0);
    if (C && d.add(S), C?.glyphScale !== void 0 && (l[S] = C.glyphScale), !R || !k) continue;
    const M = C?.url ?? Ye(S);
    if (o && M && /^[WUBRGN]$/.test(v) && s.set(M, {
      inkTarget: o,
      paper: R,
      sourceInk: C ? Te(C.inkColor) : [13 / 255, 15 / 255, 15 / 255]
    }), C) {
      const x = e.get(C.url);
      if (!x) throw Error(`Historical mana asset unavailable: ${S}`);
      u.push({ url: C.url, source: x, palette: C, target: R });
    } else M && a.set(M, bc(k, R));
    i[S] = `rgb(${R.map((x) => Math.round(x * 255)).join(" ")})`;
  }
  const m = h.has("W") && Rr(t, "W") === "historic-font", c = dc(t, e), g = hc(t, e), f = cc(t, e);
  if (!a.size && !u.length && !c.length && !g.length && !f.length && !Object.keys(i).length && !m)
    return n;
  const b = Object.assign(new Map(e), {
    manaInkColor: o ? `rgb(${o.map((S) => Math.round(S * 255)).join(" ")})` : void 0,
    manaColors: i,
    originalManaGlyphs: d,
    originalWhiteGlyph: m,
    manaGlyphScales: l
  }), y = [...a].flatMap(([S, v]) => {
    const C = e.get(S);
    return C ? [{ url: S, source: C, adjustment: v }] : [];
  }), p = [
    ...c,
    ...g,
    ...f,
    ...y.map(({ url: S, source: v, adjustment: C }) => ({
      url: S,
      key: s.has(S) ? JSON.stringify([
        ba(S, v.width, v.height, C),
        "mana-ink-v1",
        s.get(S)
      ]) : ba(S, v.width, v.height, C),
      bytes: v.width * v.height * 4,
      build: () => pc(v, C, e, s.get(S))
    })),
    ...u.map(({ url: S, source: v, palette: C, target: k }) => ({
      url: S,
      key: JSON.stringify([
        "historical-mana-palette-v1",
        S,
        v.width,
        v.height,
        C,
        k,
        ...s.has(S) ? ["mana-ink-v1", s.get(S)] : []
      ]),
      bytes: v.width * v.height * 4,
      build: () => qm(v, C, k, s.get(S))
    }))
  ];
  let w = [];
  try {
    w = await Ml.acquireMany(p, r), p.forEach(({ url: S }, v) => b.set(S, w[v].value));
    for (const S of d) {
      const v = ro(t, S), C = b.get(v.url), k = Ye(S);
      if (!C || !k) throw Error(`Historical mana asset unavailable: ${S}`);
      b.set(k, C);
    }
    return { images: b, dispose: () => w.forEach((S) => S.release()) };
  } catch (S) {
    throw w.forEach((v) => v.release()), S;
  }
}
function ba(t, e, r, n) {
  return JSON.stringify(["frame-hsb-paper-mask-v3", t, e, r, n]);
}
async function pc(t, e, r, n) {
  const o = B();
  o.width = t.width, o.height = t.height;
  try {
    const s = o.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("HSB preparation needs Canvas2D.");
    s.drawImage(t, 0, 0);
    const a = s.getImageData(0, 0, o.width, o.height), i = (m) => {
      const c = r.get(m);
      if (!c) throw Error(`Frame material mask unavailable: ${m}`);
      return s.clearRect(0, 0, o.width, o.height), s.drawImage(c, 0, 0, o.width, o.height), s.getImageData(0, 0, o.width, o.height);
    }, l = e.blackPoint?.textureMaskSource, d = l ? i(l) : void 0, u = e.blend ? i(e.blend.maskSource) : void 0;
    if (e.blend && u) {
      const m = e.blend.outerMaskSource === l && d ? d : i(e.blend.outerMaskSource);
      if (Hm(u, m, Math.round(e.blend.outset * o.width)), d)
        for (let c = 3; c < d.data.length; c += 4)
          d.data[c] = Math.round(d.data[c] * (1 - u.data[c] / 255));
    }
    const h = e.outerStockMaskSource ? i(e.outerStockMaskSource) : void 0;
    return Zm(a, e, d, h), e.blend && u && Xm(a, u, e.blend), n && Il(a.data, n), s.putImageData(a, 0, 0), await createImageBitmap(o);
  } finally {
    o.width = o.height = 0;
  }
}
function bc(t, e) {
  const r = Te(t), [n, o, s] = un(r), [a, i, l] = un(e);
  if (o <= 0 || s <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (a - n + 540) % 360 - 180,
    saturationScale: i / o,
    brightnessScale: l / s
  };
}
function gs(t, e) {
  if (t.layout && t.layout !== "normal") return [0, 0];
  const r = t.setCode?.toLowerCase();
  if (t.borderColor && t.borderColor !== (r === "8ed" ? "white" : "black")) return [0, 0];
  if (e === "retro" && Mt(t)) return [-18.5, -6];
  if (t.legendary ?? /\bLegendary\b/.test(t.typeLine ?? "")) return [0, 0];
  if (e === "retro") {
    if (r === "lea") return [-1.5, 1.5];
    if (r === "leb") return [-1, 2];
  }
  return e === "eighth" && r === "8ed" ? [0.5, -2] : e === "modern" && r === "m21" ? [-1, 1] : [0, 0];
}
const ya = [0.08, 0.36, 0.64, 0.92, 1], yc = [0.18, 0.18, 0.17];
function So(t, e, r, n, o, s) {
  if (o.length !== 2) return;
  const { box: a, width: i } = s, l = t - r / 2, d = t + r / 2, u = e - n / 2, h = e + n / 2;
  if (d <= a.left || l >= a.right || h <= a.top || u >= a.bottom || l >= a.left + i.left && d <= a.right - i.right && u >= a.top + i.top && h <= a.bottom - i.bottom)
    return;
  const m = (b) => Math.max(
    0,
    Math.min(d, a.right - i.right * b) - Math.max(l, a.left + i.left * b)
  ) * Math.max(
    0,
    Math.min(h, a.bottom - i.bottom * b) - Math.max(u, a.top + i.top * b)
  ) / (r * n);
  let c = m(0), g = 0;
  const f = [0, 0, 0];
  for (let b = 0; b < ya.length; b++) {
    const y = m(ya[b]), p = Math.max(0, c - y), w = b === 0 || b === 4 ? s.edge ?? yc : o[b === 2 ? 1 : 0];
    for (let S = 0; S < 3; S++) f[S] += w[S] * p;
    g += p, c = y;
  }
  if (g)
    return { color: [f[0] / g, f[1] / g, f[2] / g], alpha: g };
}
const wc = {
  left: 61.063333333333325 / (488 / 1500),
  right: 427.9656666666666 / (488 / 1500),
  top: 404.6309523809524 / (680 / 2100),
  bottom: 606.325 / (680 / 2100)
}, Bt = { left: 188, right: 1324, top: 1253, bottom: 1871 }, ir = { left: 26, right: 29, top: 29, bottom: 28 }, wa = 6.375 / (488 / 1500), Sa = 6.375 / (680 / 2100), Sc = { left: wa, right: wa, top: Sa, bottom: Sa }, vc = {
  W: [186 / 255, 177 / 255, 176 / 255],
  U: [72 / 255, 110 / 255, 137 / 255],
  B: [88 / 255, 77 / 255, 85 / 255],
  R: [182 / 255, 62 / 255, 81 / 255],
  G: [129 / 255, 149 / 255, 92 / 255]
};
function Cc(t, e, r) {
  const n = r?.box ?? wc, o = r?.width ?? Sc;
  if (e.length !== 2) return;
  const a = [...e].sort((g, f) => "RGUBW".indexOf(g) - "RGUBW".indexOf(f)).map((g) => (r?.palette ?? vc)[g]);
  if (!a[0] || !a[1]) return;
  const i = 1500 / t.width, l = 2100 / t.height, d = t.data.slice(), u = Math.min(n.left, Bt.left), h = Math.max(n.right, Bt.right), m = Math.min(n.top, Bt.top), c = Math.max(n.bottom, Bt.bottom);
  for (let g = Math.floor(m / l); g < Math.ceil(c / l); g++)
    for (let f = Math.floor(u / i); f < Math.ceil(h / i); f++) {
      const b = So((f + 0.5) * i, (g + 0.5) * l, i, l, [a[0], a[1]], {
        box: n,
        width: o,
        edge: r?.edge
      }), y = (f + 0.5) * i, p = (g + 0.5) * l, w = So(y, p, i, l, [a[0], a[1]], {
        box: Bt,
        width: ir
      });
      if (!b && !w) continue;
      const S = (g * t.width + f) * 4;
      if (t.data[S + 3]) {
        if (w) {
          const v = [
            y - Bt.left,
            Bt.right - y,
            p - Bt.top,
            Bt.bottom - p
          ], C = v.indexOf(Math.min(...v)), k = y >= n.left && y < n.right && p >= n.top && p < n.bottom, R = C === 0 ? Bt.left + (k ? ir.left + 2 : -2) : C === 1 ? Bt.right - (k ? ir.right + 2 : -2) : y, M = C === 2 ? Bt.top + (k ? ir.top + 2 : -2) : C === 3 ? Bt.bottom - (k ? ir.bottom + 2 : -2) : p, x = (Math.floor(M / l) * t.width + Math.floor(R / i)) * 4;
          for (let E = 0; E < 3; E++)
            t.data[S + E] = d[S + E] * (1 - w.alpha) + d[x + E] * w.alpha;
        }
        if (b)
          for (let v = 0; v < 3; v++)
            t.data[S + v] = t.data[S + v] * (1 - b.alpha) + b.color[v] * 255 * b.alpha;
      }
    }
}
const gr = { left: 166.8794, right: 1338.8298, top: 1255.6105, bottom: 1882.7268 }, va = 6.375 / (488 * 0.984 / 1500 * 1.001), Ca = 6.375 / (680 * 0.99 / 2100 * 1.001), kc = { left: va, right: va, top: Ca, bottom: Ca };
function Tc(t, e, r, n, o) {
  return So(t, e, r, n, o, {
    box: gr,
    width: kc
  });
}
const Hn = {
  W: { hueDegrees: 8.4847, saturationScale: 0.42831, brightnessScale: 0.97071 },
  U: { hueDegrees: 164.886, saturationScale: 0.25883, brightnessScale: 0.841 },
  B: { hueDegrees: 157.329, saturationScale: 0.20015, brightnessScale: 0.62552 },
  R: { hueDegrees: -23.3867, saturationScale: 0.88939, brightnessScale: 0.9205 },
  G: { hueDegrees: 30.7835, saturationScale: 0.6094, brightnessScale: 0.79916 }
}, Mc = {
  W: { hueDegrees: 7.44281, saturationScale: 0.570206, brightnessScale: 0.845188 },
  U: { hueDegrees: -177.38556, saturationScale: 0.121282, brightnessScale: 0.656904 },
  B: { hueDegrees: 0, saturationScale: 0, brightnessScale: 0.452356 },
  R: { hueDegrees: -34.23136, saturationScale: 1.238404, brightnessScale: 0.866109 },
  G: { hueDegrees: 42.19413, saturationScale: 0.716825, brightnessScale: 0.656904 }
}, ka = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Ta = {
  W: [0.9, 0.91, 0.9],
  U: [0.32, 0.58, 0.75],
  B: [0.38, 0.4, 0.38],
  R: [0.8, 0.32, 0.34],
  G: [0.6, 0.66, 0.29]
}, Ma = { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.992232 };
function Rc(t, e, r) {
  const n = r ? Hn : Mc, o = e[0], s = e[1] ?? o;
  if (!o || !s || !Hn[o] || !Hn[s]) return;
  const a = e.length === 2 ? [...e].sort((l, d) => "RGUBW".indexOf(l) - "RGUBW".indexOf(d)).map((l) => Ta[l]) : [], i = a.length ? t.data.slice() : void 0;
  for (let l = 0; l < t.height; l++)
    for (let d = 0; d < t.width; d++) {
      const u = (l * t.width + d) * 4;
      if (!t.data[u + 3]) continue;
      const h = (d + 0.5) * 1500 / t.width, m = (l + 0.5) * 2100 / t.height, c = [t.data[u] / 255, t.data[u + 1] / 255, t.data[u + 2] / 255], g = Math.max(...c), f = Tc(h, m, 1500 / t.width, 2100 / t.height, a), b = i ? h >= gr.left && h < gr.right && m >= gr.top && m < gr.bottom : h >= 187 && h < 1320 && m >= 1280 && m < 1864, y = i && h >= 165 && h <= 1345 && m >= 1248 && m <= 1885;
      if (!f && g < 0.075 && !(i && b) && !y) continue;
      const p = Math.min(h - 126, 1379 - h, m - 153, 1171 - m), w = Math.min(h - 170, 1340 - h, m - 1253, 1880 - m), S = p >= -1 && p < 13 || w >= -1 && w < 29;
      let v;
      if (b) {
        const C = Math.min(
          (h - 187) * 488 * 0.984 / 1500,
          (1320 - h) * 488 * 0.984 / 1500,
          (m - 1280) * 680 * 0.99 / 2100,
          (1864 - m) * 680 * 0.99 / 2100
        ), k = Math.floor(Math.max(0, C) / 11.5);
        let R = c;
        if (i && (h < 190 || m < 1284)) {
          const M = Math.min(t.width - 1, Math.max(d, Math.ceil(190 * t.width / 1500))), E = (Math.min(
            t.height - 1,
            Math.max(l, Math.ceil(1284 * t.height / 2100))
          ) * t.width + M) * 4;
          R = [i[E] / 255, i[E + 1] / 255, i[E + 2] / 255];
        }
        v = Ht(R, n[k % 2 ? s : o]);
      } else if (y) {
        const C = [h - 165, 1345 - h, m - 1248, 1885 - m], k = C.indexOf(Math.min(...C)), R = k === 0 ? 160 : k === 1 ? 1350 : h, M = k === 2 ? 1240 : k === 3 ? 1890 : m, x = Math.min(t.width - 1, Math.floor(R * t.width / 1500)), $ = (Math.min(t.height - 1, Math.floor(M * t.height / 2100)) * t.width + x) * 4;
        v = Ht(
          [i[$] / 255, i[$ + 1] / 255, i[$ + 2] / 255],
          r ? Ma : ka
        );
      } else if (S && c[0] > 0.45 && c[1] > 0.35 && c[2] < Math.min(c[0], c[1]) * 0.72) {
        const C = Ta[(p >= -1 && p < 13 ? p < 6 : w < 14) ? s : o], k = g / 0.97;
        v = [
          Math.min(1, C[0] * k),
          Math.min(1, C[1] * k),
          Math.min(1, C[2] * k)
        ];
      } else v = Ht(c, r ? Ma : ka);
      for (let C = 0; C < 3; C++)
        t.data[u + C] = Math.round(
          255 * (f ? f.color[C] * f.alpha + v[C] * (1 - f.alpha) : v[C])
        );
    }
}
async function xc(t, e, r) {
  if (!St(t)) return { images: e, dispose() {
  } };
  const n = e.get(fr);
  if (!n) throw Error("Revised land frame asset unavailable");
  const o = vi(t), s = xe(t), a = await ms.acquire(
    JSON.stringify([
      "revised-fourth-land-v5",
      fr,
      n.width,
      n.height,
      o,
      s
    ]),
    n.width * n.height * 4,
    async () => {
      const l = B();
      l.width = n.width, l.height = n.height;
      try {
        const d = l.getContext("2d", { willReadFrequently: !0 });
        if (!d) throw Error("Revised land preparation needs Canvas2D");
        d.drawImage(n, 0, 0);
        const u = d.getImageData(0, 0, l.width, l.height);
        Rc(u, o, s), d.putImageData(u, 0, 0);
        const h = l.width * 160 / 1500, m = l.height * 1240 / 2100, c = l.width * 1190 / 1500, g = l.height * 654 / 2100, f = l.width * (244 - 2.404) / (488 * 0.984), b = l.height * (515 - 9.9) / (680 * 0.99);
        return d.drawImage(
          l,
          h,
          m,
          c,
          g,
          f + (h - f) * 1.001,
          b + (m - b) * 1.001 + l.height * 0.25 / (680 * 0.99),
          c * 1.001,
          g * 1.001
        ), await createImageBitmap(l);
      } finally {
        l.width = l.height = 0;
      }
    },
    r
  ), i = Object.assign(new Map(e), e);
  return i.set(fr, a.value), { images: i, dispose: () => a.release() };
}
async function Ac(t, e, r) {
  if (St(t)) return xc(t, e, r);
  const n = ne(t);
  if (!n) return { images: e, dispose() {
  } };
  const o = (u) => {
    const h = e.get(u);
    if (!h) throw Error(`Historical dual-land asset unavailable: ${u}`);
    return h;
  }, s = o(n.base), a = o(n.overlay), i = o(n.mask), [l] = await ms.acquireMany(
    [
      {
        key: JSON.stringify([
          "abu-dual-frame-v3",
          ...n.pinline ? [n.pinline] : [],
          n,
          s.width,
          s.height,
          pl(t)
        ]),
        bytes: s.width * s.height * 4,
        build: async () => {
          const u = B(), h = B();
          u.width = h.width = s.width, u.height = h.height = s.height;
          try {
            const m = u.getContext("2d"), c = h.getContext("2d");
            if (!m || !c) throw Error("Historical dual-land preparation needs Canvas2D.");
            if (c.drawImage(a, 0, 0, s.width, s.height), c.globalCompositeOperation = "destination-in", c.drawImage(i, 0, 0, s.width, s.height), m.drawImage(s, 0, 0), m.drawImage(h, 0, 0), n.outline !== n.overlay) {
              const f = o(n.outline);
              m.save(), m.beginPath(), m.rect(
                78 / 1500 * s.width,
                90 / 2100 * s.height,
                1344 / 1500 * s.width,
                1920 / 2100 * s.height
              ), m.rect(
                108 / 1500 * s.width,
                120 / 2100 * s.height,
                1284 / 1500 * s.width,
                1860 / 2100 * s.height
              ), m.clip("evenodd"), m.drawImage(f, 0, 0, s.width, s.height), m.restore();
            }
            const g = m.getImageData(0, 0, s.width, s.height);
            return Cc(g, Sr(t), n.pinline), m.putImageData(g, 0, 0), await createImageBitmap(u);
          } finally {
            u.width = u.height = h.width = h.height = 0;
          }
        }
      }
    ],
    r
  ), d = Object.assign(new Map(e), e);
  return d.set(n.base, l.value), { images: d, dispose: () => l.release() };
}
const Lc = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Ra = {
  // Black outer contour after the checksum-guarded LEG SVG repair.
  "leg/retro/black": [3.25, 1.5, 1.05, 1.125],
  "6ed/retro/white": [2, -2, 1.08, 1.08],
  // Filled crescent after rim repair; independent width/height on fixed poses.
  "drk/retro/black": [2.5, -1.25, 1.146, 1.203]
}, xa = {
  m15: { family: "m15-accurate", delta: [1, 0, 1, 1] },
  m21: { family: "m15-accurate", delta: [2, 0, 1.1, 1.06] },
  woe: { family: "m15-accurate", delta: [2, 0, 1.08, 1.08] },
  tdm: { family: "m15-accurate", delta: [0, 0, 1.08, 1.08] },
  "8ed": { family: "eighth", delta: [-4, 0, 1, 0.92] },
  "9ed": { family: "eighth", delta: [0, 1, 0.9, 0.92] }
};
function Ec(t, e, r) {
  if (t.frameTreatment === "colorshifted") return r;
  const n = t.setCode?.toLowerCase() ?? "", o = Object.hasOwn(xa, n) ? xa[n] : void 0;
  let s = r;
  return o && !t.setSymbol && Ut(e) && o.family === t.frameAssetFamily && (s = Pl(r, o.delta)), t.frameAssetFamily ? fs(t, e, s, t.frameAssetFamily) : s;
}
function fs(t, e, r, n) {
  if (t.setSymbol || !Ut(e) || P !== Lc || (t.layout ?? "normal") !== "normal" || ["component", "m15-accurate"].includes(n) && j(t).legendary)
    return r;
  const o = t.borderColor ?? (n === "retro" ? Lt(t) : Pt(t.setCode).border === "#eeedeb" ? "white" : "black"), s = `${t.setCode?.trim().toLowerCase() ?? ""}/${n}/${o}`;
  if (s === "leg/retro/black" && !Mt(t)) return r;
  const a = Object.hasOwn(Ra, s) ? Ra[s] : Object.hasOwn(Ls, s) ? Ls[s] : void 0;
  return a ? Pl(r, a) : r;
}
function Pl(t, e) {
  const [r, n, o, s] = t, [a, i, l, d] = e;
  return [r + o + a - o * l, n + s / 2 + i - s * d / 2, o * l, s * d];
}
const Bc = 0.045;
function Wl(t) {
  const e = ot(t)?.cornerRadius;
  return e !== void 0 ? e : dt(t) && t.setCode?.toLowerCase() === "lea" ? Sd : Bc;
}
const lr = "#fbf0c5", Pe = "#ccdaf2", _r = "#9c9995", dr = "#edaa8d", We = "#dde6e2", Ic = {
  W: [lr, lr],
  U: [Pe, Pe],
  B: [_r, _r],
  R: [dr, dr],
  G: [We, We],
  WU: [lr, Pe],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [dr, lr],
  WG: [We, lr],
  UB: [Pe, _r],
  UR: [Pe, dr],
  UG: [We, Pe],
  BR: ["#b4afb5", "#f2b096"],
  BG: [_r, We],
  RG: [dr, We]
};
function Oc(t, e, r) {
  if (!e.land) return;
  const n = Ic[e.frame];
  if (!n) return;
  const o = 34 + r, s = 420 - 2 * r, a = t.createLinearGradient(o, 0, o + s, 0);
  a.addColorStop(0, n[0]), a.addColorStop(0.35, n[0]), a.addColorStop(0.65, n[1]), a.addColorStop(1, n[1]), t.save(), t.globalCompositeOperation = "multiply", t.fillStyle = a, t.fillRect(o, 425, s, 203.5), t.restore();
}
function $c(t, e, r, n) {
  if (!e.land || e.frame !== "Artifact") {
    n();
    return;
  }
  const o = 34 + r, s = 420 - 2 * r;
  for (const a of [!1, !0])
    t.save(), t.beginPath(), a || t.rect(0, 0, 488, 680), t.rect(o, 425, s, 203.5), t.clip("evenodd"), t.filter = `grayscale(1) brightness(${a ? 0.9 : 0.63})`, n(), t.restore();
}
function Gc(t, e, r) {
  if (!e.land) return;
  t.save(), t.shadowColor = "transparent";
  const n = t.createLinearGradient(0, 625.75, 0, 628.25);
  n.addColorStop(0, "#ffffff00"), n.addColorStop(0.3, "#ffffffb0"), n.addColorStop(0.7, "#ffffffb0"), n.addColorStop(1, "#ffffff00"), t.fillStyle = n, t.fillRect(34 + r, 625.75, 420 - 2 * r, 2.5), t.restore();
}
function Fl(t) {
  if (t.setSymbol) return null;
  const e = t.setCode?.toLowerCase();
  return e === "m15" || e === "war" ? e : null;
}
function _l(t, e, r, n, o, s, a, i, l, d) {
  const [u, h, m, c] = d ? r === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, r === "m15" ? 0.7 : 1.2];
  o += h - a * (u - 1) / 2, s += m - i * (u - 1) / 2, a *= u, i *= u;
  const g = !n || n === "common", f = B(), b = 3, y = 4;
  f.width = Math.ceil((a + b * 2) * y), f.height = Math.ceil((i + b * 2) * y);
  const p = f.getContext("2d");
  p.scale(y, y), p.translate(b, b), p.drawImage(
    e,
    l[0] * e.width,
    l[1] * e.height,
    l[2] * e.width,
    l[3] * e.height,
    0,
    0,
    a,
    i
  ), p.globalCompositeOperation = "source-in";
  const w = n === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : n === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], S = p.createLinearGradient(0, i * 0.65, a, i * 0.35);
  S.addColorStop(0, w[0]), S.addColorStop(0.35, w[1]), S.addColorStop(0.6, w[2]), S.addColorStop(1, w[3]), p.fillStyle = g ? "#111111" : S, p.fillRect(0, 0, a, i);
  const v = r === "m15" ? 32 : 27, C = new Path2D(
    r === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), k = new DOMMatrix().translate(-l[0] * a / l[2], -l[1] * i / l[3]).scale(a / (v * l[2]), i / (32 * l[3])), R = new Path2D();
  R.addPath(C, k), p.globalCompositeOperation = "destination-over", p.fillStyle = g ? "#f8f8f5" : "#111111", p.fill(R), p.strokeStyle = p.fillStyle, p.lineWidth = r === "war" && g ? 2 : c, p.lineJoin = "round", p.stroke(R), t.drawImage(
    f,
    o - b,
    s - b,
    f.width / y,
    f.height / y
  ), f.width = f.height = 0;
}
function Aa(t, e, r, n, o, s = "title", a = e.name) {
  const i = bn(e.setCode);
  if (!i || e.frameStyle === "modern" || e.frameTemplate || e.frameAssetFamily || e.borderColor && e.borderColor !== "black" || e.layout && e.layout !== "normal")
    return !1;
  const l = (e.setCalibrationCandidate ? ni(e.setCalibrationCandidate) : i)[s];
  if (!l.dx && !l.dy && l.size === (s === "title" ? 27.8 : 22.2) && l.width === 1 && !l.wordSpacing && l.gray === 130 && l.shadow === 1)
    return !1;
  t.save();
  const d = t.getTransform().a * l.shadow;
  t.translate(r + l.dx, n + l.dy), t.scale(l.width, 1), t.font = `${l.size}px "${s === "title" ? "CardRenderer MTG Goudy" : "CardRenderer MTG MPlantin"}", Georgia`, l.wordSpacing && (t.wordSpacing = `${l.wordSpacing}px`), t.fillStyle = `rgb(${l.gray},${l.gray},${l.gray})`, t.shadowOffsetX = t.shadowOffsetY = d;
  const u = Math.max(1, o - l.dx);
  return s === "type" ? mt(t, a, 0, 0, u, e.textInk, "type") : t.fillText(a, 0, 0, u), t.restore(), !0;
}
function Pc(t, e, r) {
  t.save(), t.fillStyle = r, t.beginPath(), t.rect(0, 0, T, L), t.rect(...e), t.fill("evenodd"), t.restore();
}
function La(t, e, [r, n, o, s], a) {
  const u = B();
  u.width = 756, u.height = 1044;
  try {
    const h = u.getContext("2d");
    if (!h) throw new Error("Retro stock preparation requires Canvas2D.");
    h.drawImage(e, 12, 12, 732, 1020), h.fillRect(0, 0, u.width, 12), h.fillRect(0, 1032, u.width, 12), h.fillRect(0, 12, 12, 1020), h.fillRect(744, 12, 12, 1020), h.globalCompositeOperation = "source-in", h.fillStyle = a, h.fillRect(0, 0, u.width, u.height), t.drawImage(
      u,
      r - 12 * o / 732,
      n - 12 * s / 1020,
      u.width * o / 732,
      u.height * s / 1020
    );
  } finally {
    u.width = u.height = 0;
  }
}
function Wc(t) {
  if ((t.layout ?? "normal") !== "normal") return;
  const e = `${t.setCode?.toLowerCase() ?? ""}/${Lt(t)}`;
  if (!(e === "leg/black" && !Mt(t)))
    return Object.hasOwn(As, e) ? As[e] : void 0;
}
function Mn(t, e, r, n, o, s, a) {
  t.save();
  const i = t.getTransform();
  t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0;
  const l = B();
  l.width = t.canvas.width, l.height = t.canvas.height;
  const d = l.getContext("2d");
  if (!d) throw Error("Solid title needs a Canvas2D context");
  d.setTransform(i), d.font = t.font, d.textAlign = t.textAlign, d.textBaseline = t.textBaseline, d.letterSpacing = t.letterSpacing, d.fillStyle = a?.fill ?? `rgb(${s.gray},${s.gray},${s.gray})`, d.fillText(e, r, n, o), s.trim > 0 && (d.globalCompositeOperation = "destination-out", d.lineWidth = s.trim * 2, d.strokeText(e, r, n, o)), t.resetTransform(), t.shadowColor = a?.shadow ?? "#17140f", t.shadowOffsetX = i.a / s.width * s.shadow, t.shadowOffsetY = i.d * s.shadow, t.drawImage(l, 0, 0), t.restore(), l.width = l.height = 0;
}
const Fc = {
  arn: { size: 26.75, x: 37.75, y: 42.5, width: 0.995, shadow: 1.25, trim: 0.4, gray: 196 },
  atq: { size: 26.5, x: 38, y: 42.5, width: 1, shadow: 1.25, trim: 0.4, gray: 196 },
  drk: { size: 27.25, x: 37.25, y: 43, width: 1, shadow: 1.5, trim: 0.2, gray: 208 }
};
function Ul(t) {
  const e = t.setCode?.toLowerCase();
  if (e !== "arn" && e !== "atq" && e !== "drk" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || t.borderColor && t.borderColor !== "black" || t.legendary || /\b(Legendary|Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", n = t.land ?? /\bLand\b/.test(r), o = t.artifact ?? /\bArtifact\b/.test(r), s = F(t).length;
  if (!(!n && !o && s !== 1 && !(e === "drk" && s === 2)))
    return Fc[e];
}
function _c(t, e, r) {
  const n = Ul(e);
  if (!n) return !1;
  t.save(), t.translate(n.x, n.y), t.scale(n.width, 1), t.font = `${n.size}px "CardRenderer MTG Goudy", Georgia`;
  const o = Math.max(1, (r - n.x) / n.width);
  return Mn(t, e.name, 0, 0, o, n), t.restore(), !0;
}
function Uc(t) {
  return ht(t) ? ot(t).title : void 0;
}
function jc(t, e, r) {
  const n = Uc(e);
  return n ? (t.save(), t.translate(n.x, n.y), t.scale(n.width, 1), t.font = `${n.size}px "CardRenderer MTG Goudy", Georgia`, Mn(t, e.name, 0, 0, Math.max(1, (r - n.x) / n.width), n), t.restore(), !0) : !1;
}
const Dc = { size: 22, dx: -3, dy: 0.5, width: 1.02, gray: 224, shadow: 1.5, trim: 0.2 };
function Nc(t) {
  return t.setCode?.toLowerCase() === "drk" && !t.frameAssetFamily && Ul(t) ? Dc : void 0;
}
function zc(t, e, r, n, o, s) {
  const a = Nc(e);
  if (!a) return !1;
  t.save(), t.translate(n + a.dx, o + a.dy), t.scale(a.width, 1), t.font = `${a.size}px "CardRenderer MTG MPlantin", Georgia`, t.fillStyle = `rgb(${a.gray},${a.gray},${a.gray})`, t.shadowColor = "#17140f", t.shadowBlur = 0;
  const i = s / a.width;
  return mt(
    t,
    r,
    0,
    0,
    i,
    e.textInk,
    "type",
    () => Mn(t, r, 0, 0, i, a, {
      fill: t.fillStyle,
      shadow: t.shadowColor
    })
  ), t.restore(), !0;
}
function Yc(t) {
  const e = je(t.setCode);
  if (e) return e.type;
  const r = (!t.borderColor || t.borderColor === "black") && !!Mt(t);
  return {
    fontSize: r ? 21.7 * 1.03 : 21.7,
    dx: r ? -2.5 : 0,
    dy: 0
  };
}
function qc(t) {
  return ht(t) ? ot(t).type : void 0;
}
function Hc(t, e, r, n) {
  const o = qc(e);
  if (!o) return !1;
  t.save(), t.translate(o.x, o.y), t.scale(o.width, 1), t.font = `${o.size}px "CardRenderer MTG MPlantin", Georgia`, t.fillStyle = `rgb(${o.gray},${o.gray},${o.gray})`, t.shadowColor = "#17140f", t.shadowBlur = 0;
  const s = Math.max(1, (n - o.x) / o.width);
  return mt(
    t,
    r,
    0,
    0,
    s,
    e.textInk,
    "type",
    () => Mn(t, r, 0, 0, s, o, {
      fill: t.fillStyle,
      shadow: t.shadowColor
    })
  ), t.restore(), !0;
}
function Xc(t, e, r, n = !1, o) {
  jl(
    t,
    e,
    r,
    {
      right: 435,
      centerY: 44.5,
      pitch: 27,
      size: 23.4,
      whiteSize: 21
    },
    n,
    o
  );
}
function Jc(t, e, r, n = !1, o) {
  jl(
    t,
    e,
    r,
    {
      right: 432,
      centerY: 46,
      pitch: 27,
      size: 23.9,
      whiteSize: 20.5
    },
    n,
    o
  );
}
function jl(t, e, r, n, o, s) {
  e.forEach((a, i) => {
    const { size: l } = n, d = n.right - (e.length - 1 - i) * (n.pitch + (s?.spacing ?? 0)) - l / 2, u = n.centerY - l / 2;
    if (a !== "W" || o || r.originalManaGlyphs?.has("W")) {
      st(t, a, d, u, l, r, !1, s);
      return;
    }
    qo(
      t,
      d,
      u,
      l,
      n.whiteSize,
      r.manaColors?.W,
      Cr(s, a),
      r.manaInkColor
    );
  });
}
const Dl = (t, e, r, n, o, s, a = !1, i) => {
  if (e !== "W" || s.originalManaGlyphs?.has("W"))
    return st(t, e, r, n, o, s, a, i);
  qo(
    t,
    r,
    n,
    o,
    o * 0.87,
    s.manaColors?.W,
    Cr(i, e),
    s.manaInkColor
  );
};
function Kc(t) {
  return ["4ed", "5ed"].includes(t.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(t.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function vo(t) {
  const e = String(t.toughness ?? ""), r = t.wordingMode !== "oracle" && t.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(e) ? `(${e})` : e;
  return `${t.power ?? ""}/${r}`;
}
function Vc(t) {
  const e = t.setCode?.toLowerCase(), r = e === "4ed" && !/\bLand\b/.test(t.typeLine ?? "");
  if (e !== "mir" && e !== "tmp" && !r) return null;
  const n = F(t);
  return {
    titleX: r ? 42.5 : void 0,
    titleYOffset: r ? -5 : 0,
    typeX: r ? 42.5 : void 0,
    manaRight: r ? 446.5 : 448,
    manaTop: r ? 27.5 : 33.5,
    manaSize: 23.4,
    manaGap: r ? 3.6 : 1.7,
    statsShadow: r ? 1 : 1.5,
    statsOpaqueShadow: !r,
    setRight: e === "mir" ? 434 : 432.5,
    setCenterY: e === "mir" ? 388 : 387.5,
    setHeight: e === "mir" ? 26 : 23.4,
    setOutline: 1.25,
    artistX: r ? 42.5 : 52,
    artistBaseline: r ? 628.5 : 624,
    artistSize: 19.5,
    legalBaseline: r ? 640.5 : 637.5,
    legalSize: 10.5,
    legalLight: r ? /\bArtifact\b/.test(t.typeLine ?? "") || n.length === 1 && ["B", "G"].includes(n[0]) : !/\bLand\b/.test(t.typeLine ?? "") && !(n.length === 1 && ["W", "R"].includes(n[0])),
    legalText: t.legalText === void 0 ? r ? "©1995 Wizards of the Coast, Inc. All rights reserved." : e === "mir" ? "©1996 Wizards of the Coast, Inc. All rights reserved." : "©1997 Wizards of the Coast, Inc." : t.legalText
  };
}
const ps = (t, e, r, n, o, s) => {
  if (e !== "T") return st(t, e, r, n, o, s);
  Nl(t, r, n, o, "", 0.88);
}, Co = (t, e, r, n, o, s) => {
  if (e !== "T") return Dl(t, e, r, n, o, s);
  Nl(t, r, n, o, "", 0.8);
}, Zc = (t, e, r, n, o, s) => {
  if (e !== "T") return st(t, e, r, n, o, s);
  ps(t, e, r, n, o, s);
}, Qc = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function tg(t) {
  const e = t?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(e) || ["lea", "leb", "2ed", "arn", "atq"].includes(e) ? Co : e === "4ed" ? Zc : Qc.has(e) ? ps : st;
}
function Nl(t, e, r, n, o, s) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = "#c9c4be", t.beginPath(), t.arc(e + n / 2, r + n / 2, n / 2, 0, Math.PI * 2), t.fill(), t.fillStyle = "#0d0f0f", t.font = `${n * s}px "CardRenderer MTG Historic Symbols"`, t.textAlign = "left", t.textBaseline = "alphabetic";
  const a = t.measureText(o);
  t.fillText(
    o,
    e + (n - a.actualBoundingBoxLeft - a.actualBoundingBoxRight) / 2 + a.actualBoundingBoxLeft,
    r + (n + a.actualBoundingBoxAscent - a.actualBoundingBoxDescent) / 2
  ), t.restore();
}
function eg(t, e, r, n, o, s, a, i = [0, 0, 1, 1], l = null, d = "low") {
  const u = B(), h = Math.ceil(a * 2) + 1;
  u.width = Math.ceil(o * 2) + h * 2, u.height = Math.ceil(s * 2) + h * 2;
  const m = u.getContext("2d");
  m.imageSmoothingQuality = d, m.drawImage(
    e,
    i[0] * e.width,
    i[1] * e.height,
    i[2] * e.width,
    i[3] * e.height,
    h,
    h,
    o * 2,
    s * 2
  ), m.globalCompositeOperation = "source-in", m.fillStyle = "#fff", m.fillRect(0, 0, u.width, u.height), t.save(), t.shadowColor = "transparent";
  for (let c = 0; a > 0 && c < 16; c++) {
    const g = c * Math.PI / 8;
    t.drawImage(
      u,
      r - h / 2 + Math.cos(g) * a,
      n - h / 2 + Math.sin(g) * a,
      u.width / 2,
      u.height / 2
    );
  }
  if (m.fillStyle = "#17140f", l) {
    const c = m.createLinearGradient(h, h, h + o * 2, h);
    l.forEach((g, f) => c.addColorStop(f / 2, g)), m.fillStyle = c;
  }
  m.fillRect(0, 0, u.width, u.height), t.drawImage(u, r - h / 2, n - h / 2, u.width / 2, u.height / 2), t.restore(), u.width = u.height = 0;
}
function rg(t, e, r) {
  t.save(), t.textAlign = "left", t.textBaseline = "alphabetic", Y(t, e, "artist", () => {
    e.artist && (t.fillStyle = "#f2eee3", t.shadowColor = "#000", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, t.font = `${r.artistSize}px "CardRenderer MTG MPlantin", Georgia`, t.fillText(`Illus. ${e.artist}`, r.artistX, r.artistBaseline, 338));
  }), t.shadowColor = "transparent", t.fillStyle = r.legalLight ? "#f2eee3" : "#17140f", t.font = `${r.legalSize}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && Y(
    t,
    e,
    "legal",
    () => t.fillText(r.legalText, r.artistX, r.legalBaseline, 380)
  ), t.restore();
}
function Ea(t, e, r, n) {
  const o = r.replaceAll("ō", "o");
  if (t[e](o, 0, 0, n), o === r) return;
  const s = t.measureText(o).width, a = Math.min(1, n / s), i = t.measureText("o").width, l = t.measureText("ˉ").width, d = -(t.textAlign === "right" ? s * a : t.textAlign === "center" ? s * a / 2 : 0), u = t.textAlign;
  t.textAlign = "left";
  try {
    for (let h = 0; h < r.length; h++)
      if (r[h] === "ō") {
        const m = t.measureText(o.slice(0, h + 1)).width;
        t[e]("ˉ", d + (m - i + (i - l) / 2) * a, 0, l * a);
      }
  } finally {
    t.textAlign = u;
  }
}
function ng(t, e, r, n) {
  const o = B();
  o.width = t.canvas.width, o.height = t.canvas.height, t.save();
  try {
    const s = t.getTransform(), a = o.getContext("2d");
    if (!a) throw Error("Footer ink needs a Canvas2D context");
    a.setTransform(s), a.font = t.font, a.textAlign = t.textAlign, a.textBaseline = t.textBaseline, a.letterSpacing = t.letterSpacing, a.fillStyle = t.fillStyle, Ea(a, "fillText", e, r), n.trim > 0 && (a.globalCompositeOperation = "destination-out", a.lineWidth = n.trim * 2, Ea(a, "strokeText", e, r)), t.resetTransform(), t.shadowBlur = 0, t.shadowOffsetX = s.a / n.width * n.shadow, t.shadowOffsetY = s.d * n.shadow, t.drawImage(o, 0, 0);
  } finally {
    t.restore(), o.width = o.height = 0;
  }
}
function og(t) {
  const e = ht(t);
  if (!e) return;
  const r = t.setCode.toLowerCase(), n = ot(t).footer, o = ["B", "G", "A"].includes(e.material ?? "") || r === "fem" && t.name === "Ebon Stronghold";
  return {
    ...n,
    legalGray: o ? n.legal.lightGray : n.legal.darkGray,
    // Reviewed printing defaults, never a year inferred from an arbitrary set.
    legalText: t.legalText === void 0 ? n.legal.defaultText ?? `© ${r === "fem" ? "1994" : "1995"} Wizards of the Coast, Inc. All rights reserved.` : t.legalText
  };
}
function sg(t, e) {
  const r = og(e);
  if (!r) return !1;
  const n = (o, s) => {
    const a = r[o];
    t.save();
    try {
      t.translate(a.x, a.y), t.scale(a.width, 1), t.font = `${a.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = o === "artist" ? r.artist.align ?? "left" : o === "stats" ? "right" : "left", t.textBaseline = o === "artist" ? r.artist.baseline ?? "alphabetic" : o === "stats" ? r.stats.baseline ?? "alphabetic" : "alphabetic", t.letterSpacing = "0px";
      const i = "gray" in a ? a.gray : r.legalGray;
      t.fillStyle = `rgb(${i},${i},${i})`, t.shadowColor = o === "legal" ? "transparent" : "#17140f", t.shadowBlur = 0;
      const l = o === "artist" && r.artist.maxWidth !== void 0 ? r.artist.maxWidth / a.width : o === "stats" ? 132 / a.width : Math.max(1, ((o === "artist" ? 386 : 445) - a.x) / a.width), d = () => ng(t, s, l, a);
      o === "stats" ? mt(t, s, 0, 0, l, e.textInk, "stats", d) : d();
    } finally {
      t.restore();
    }
  };
  return e.power != null && e.toughness != null && n("stats", vo(e)), e.artist && Y(
    t,
    e,
    "artist",
    () => n("artist", `${r.artist.prefix ?? "Illus. "}${e.artist}`)
  ), r.legalText && Y(t, e, "legal", () => n("legal", r.legalText)), !0;
}
const ag = {
  size: 18,
  x: 49.25,
  width: 1.04,
  shadow: 2,
  inset: 0.1,
  align: "left",
  maximum: 338
}, ig = {
  size: 27.8,
  x: 452.25,
  width: 0.99,
  shadow: 1.75,
  inset: 0.3,
  align: "right",
  maximum: 68
};
function Ba(t, e, r, n) {
  const o = B();
  o.width = t.canvas.width, o.height = t.canvas.height;
  const s = o.getContext("2d");
  if (!s) throw Error("Legends footer needs a Canvas2D context");
  const a = t.getTransform();
  s.setTransform(a), s.translate(r.x, 640), s.scale(r.width, 1), s.font = `${r.size}px "CardRenderer MTG MPlantin", Georgia`, s.textAlign = r.align, s.textBaseline = "alphabetic", s.letterSpacing = "0px", s.fillStyle = "#f2eee3", mt(s, e, 0, 0, r.maximum / r.width, n), s.globalCompositeOperation = "destination-out", s.lineWidth = 2 * r.inset, s.strokeText(e, 0, 0, r.maximum / r.width), t.save(), t.resetTransform(), t.shadowColor = "#17140f", t.shadowBlur = 0, t.shadowOffsetX = t.shadowOffsetY = r.shadow * a.a, t.drawImage(o, 0, 0), t.restore(), o.width = o.height = 0;
}
function Xn(t, e) {
  return !Mt(e) || e.borderColor && e.borderColor !== "black" ? !1 : (e.artist && Ba(t, `Illus. © 1994 ${e.artist}`, ag), e.power != null && e.toughness != null && Ba(t, `${e.power}/${e.toughness}`, ig, e.textInk), !0);
}
function lg(t, e) {
  return e.printingElements?.artist ? Xn(t, { ...e, artist: null }) ? (Y(t, e, "artist", () => {
    Xn(t, { ...e, power: null, toughness: null });
  }), !0) : !1 : Xn(t, e);
}
function dg(t, e) {
  const r = e.setCode?.toLowerCase();
  if (!["usg", "ulg", "uds"].includes(r ?? "") || (e.layout ?? "normal") !== "normal")
    return !1;
  t.save(), t.textAlign = "center", t.textBaseline = "alphabetic", t.shadowColor = "#17140f", t.shadowOffsetX = t.shadowOffsetY = 1.5 * t.getTransform().a, t.fillStyle = "#f2eee3", t.font = '19px "CardRenderer MTG MPlantin", Georgia';
  const n = e.power != null && e.toughness != null ? 292 : 365;
  Y(t, e, "artist", () => {
    e.artist && t.fillText(`Illus. ${e.artist}`, 244, 626, n);
  }), e.power != null && e.toughness != null && (t.shadowColor = "#000b", t.font = '27.8px "CardRenderer MTG MPlantin", Georgia', t.textBaseline = "middle", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, mt(
    t,
    `${e.power}/${e.toughness}`,
    (0.8074 + 0.1367 / 2) * 488,
    (0.895 + 0.043 / 2) * 680,
    0.1367 * 488,
    e.textInk
  )), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.textBaseline = "alphabetic", t.font = '9.5px "CardRenderer MTG MPlantin", Georgia';
  const o = F(e), s = !/\bLand\b/.test(e.typeLine ?? "") && !(o.length === 1 && ["W", "R"].includes(o[0]));
  t.fillStyle = s ? "#f2eee3" : "#17140f";
  const a = r === "usg" ? 1998 : 1999, i = e.collectorTotal === void 0 ? r === "usg" ? 350 : 143 : e.collectorTotal, l = e.collectorNumber?.trim(), d = l && !e.printingElements?.collector?.hidden && (e.legalText === void 0 || e.collectorTotal !== void 0) ? `${l}${i ? "/" + i : ""}` : "", u = e.printingElements?.legal?.hidden ? null : e.legalText === void 0 ? `©1993–${a} Wizards of the Coast, Inc.` : e.legalText, h = [u, d].filter(Boolean).join(" ");
  if (!e.printingElements?.legal?.offset && !e.printingElements?.collector?.offset)
    h && t.fillText(h, 244, 640, 365);
  else if (h) {
    const m = t.measureText(h).width, c = Math.min(1, 365 / Math.max(1, m));
    t.translate(244, 640), t.textAlign = "left";
    const g = (f, b) => {
      t.save(), t.scale(c, 1), t.fillText(f, b, 0), t.restore();
    };
    u && Y(t, e, "legal", () => g(u, -m / 2)), d && Y(
      t,
      e,
      "collector",
      () => g(d, m / 2 - t.measureText(d).width)
    );
  }
  return t.restore(), !0;
}
function ug(t, e, r) {
  r.endsWith("/seventh/regular/w.png") && t.drawImage(
    e,
    182 / 1500 * e.width,
    1258 / 2100 * e.height,
    1160 / 1500 * e.width,
    585 / 2100 * e.height,
    160 / 1500 * 488,
    1256 / 2100 * 680,
    1184 / 1500 * 488,
    605 / 2100 * 680
  );
}
function hg(t, e) {
  const r = 52.053333333333335, n = 1255 / 2100 * 680, o = 1346 / 1500 * 488, s = 1861 / 2100 * 680, a = 17 / 1500 * 488, i = 17 / 2100 * 680, l = (u) => {
    t.moveTo(...u[0]);
    for (const h of u.slice(1)) t.lineTo(...h);
    t.closePath();
  };
  t.save();
  const d = t.filter;
  t.filter = "none", t.fillStyle = "#00000047", t.beginPath(), l([
    [r, n],
    [o, n],
    [o - a, n + i],
    [r + a, n + i]
  ]), l([
    [o, n],
    [o, s],
    [o - a, s - i],
    [o - a, n + i]
  ]), t.fill(), t.beginPath(), l([
    [r, n],
    [r + a, n + i],
    [r + a, s - i],
    [r, s]
  ]), l([
    [r, s],
    [r + a, s - i],
    [o - a, s - i],
    [o, s]
  ]), t.clip(), t.filter = `${d === "none" ? "" : d + " "}brightness(1.35)`, t.drawImage(e, 0, 0, 488, 680), t.restore();
}
const ut = {
  get fem() {
    return ri("fem").setSymbols.default;
  },
  arn: {
    right: 439,
    centerY: 394,
    width: 65,
    height: 22,
    crop: [0, 0.283203125, 1, 0.435546875],
    sampling: "high"
  },
  // Native anvil bounds across Antiquities colors/materials; no added outer rim.
  atq: { right: 415, centerY: 391.5, width: 33, height: 16, crop: [0, 0.240234375, 1, 0.51953125] },
  drk: {
    right: 445,
    centerY: 397.25,
    width: 21,
    height: 18.5,
    crop: [0, 0.09375, 0.9884259259259259, 0.814453125]
  },
  // Frozen globe ink bounds across Homelands materials; preserve its white rim.
  hml: {
    right: 440.75,
    centerY: 392.5,
    width: 23.5,
    height: 22.5,
    crop: [0, 0.083984375, 0.9861111111111112, 0.83203125]
  },
  // The printed Visions V is white inside its black triangle, with no white rim.
  vis: {
    right: 436.5,
    centerY: 390.5,
    width: 23,
    height: 27,
    crop: [0.004807692307692308, 0.037109375, 0.9903846153846154, 0.92578125],
    outline: 0
  },
  leg: {
    right: 443.75,
    centerY: 394,
    width: 25.5,
    height: 22.5,
    crop: [0, 0.1264957264957265, 1, 0.764102564102564],
    sampling: "high"
  },
  all: {
    right: 429,
    centerY: 393.5,
    width: 56.5,
    height: 24.5,
    crop: [390625e-8, 0.2890625, 0.994140625, 0.421875],
    sampling: "high"
  },
  wth: {
    right: 434,
    centerY: 390,
    width: 34,
    height: 22,
    crop: [0, 0.154296875, 0.998046875, 0.646484375],
    sampling: "high"
  },
  // Native silhouettes, after independent outer-frame registration. These
  // retain the source contours and use one placement per printed set.
  mir: {
    right: 437,
    centerY: 391,
    width: 26.75,
    height: 25,
    crop: [1953125e-9, 0.037109375, 0.99609375, 0.91015625],
    sampling: "high"
  },
  tmp: {
    right: 433.5,
    centerY: 390.5,
    width: 20.5,
    height: 19.5,
    crop: [0, 0.13982300884955753, 0.984375, 0.7964601769911505],
    outline: 2,
    sampling: "high"
  },
  sth: {
    right: 434.75,
    centerY: 390.75,
    width: 18.75,
    height: 19.5,
    crop: [0, 0.10381679389312977, 0.998046875, 0.7923664122137405],
    sampling: "high"
  },
  por: {
    right: 435.5,
    centerY: 391,
    width: 23,
    height: 23,
    crop: [0, 0.08401976935749589, 0.98828125, 0.8336079077429983],
    sampling: "high"
  },
  // Independent ink-axis measurements across common Exodus scans; retain the 2 px rim.
  exo: { right: 430.5, centerY: 390, width: 55.5, height: 21, crop: [0, 0.30859375, 1, 0.3828125] },
  ice: {
    right: 443.5,
    centerY: 394.5,
    width: 20,
    height: 21,
    crop: [0, 0.04296875, 1, 0.9140625],
    outline: 0
  }
}, mg = {
  W: { ...ut.por, right: 436.75, centerY: 389.75 },
  U: { ...ut.por, right: 436.5, centerY: 392.75 },
  R: { ...ut.por, right: 433.75, centerY: 392 },
  G: { ...ut.por, right: 434, centerY: 390.75 }
}, cg = {
  all: {
    U: { ...ut.all, right: 427.5, centerY: 393.25 },
    W: { ...ut.all, right: 427.25, centerY: 392.75 }
  },
  mir: {
    G: { ...ut.mir, right: 437, centerY: 390.25 },
    W: { ...ut.mir, right: 437.75, centerY: 389.25 }
  },
  sth: {
    G: { ...ut.sth, right: 434, centerY: 391 },
    R: { ...ut.sth, right: 433.5, centerY: 391.75 },
    W: { ...ut.sth, right: 435.25, centerY: 389.25 }
  },
  tmp: {
    U: { ...ut.tmp, right: 433, centerY: 392.75 },
    W: { ...ut.tmp, right: 433.25, centerY: 389.5 }
  },
  vis: {
    W: { ...ut.vis, right: 437.5, centerY: 389.25 }
  },
  wth: {
    W: { ...ut.wth, right: 435.75, centerY: 389.75 }
  },
  hml: {
    R: { ...ut.hml, right: 437.75, centerY: 393.5 }
  },
  por: mg
};
function gg(t) {
  const e = t.setCode?.toLowerCase() ?? "";
  if (t.setSymbol) return null;
  if (ht(t)) {
    const n = ot(t)?.setSymbols, o = e === "chr" ? gi(t.name) : "default", s = o && n?.[o] || n?.default;
    if (s) return s;
  }
  if (!Object.hasOwn(ut, e)) return null;
  const r = F(t);
  return r.length === 1 && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") ? cg[e]?.[r[0]] ?? ut[e] : ut[e];
}
function fg(t) {
  return t.setSymbol || t.setCode?.toLowerCase() !== "exo" ? null : t.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : t.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const ko = {
  arn: { count: 6, white: [2] },
  leg: { count: 6, white: [0, 1, 2, 3, 4] },
  hml: { count: 5, white: [3] },
  vis: { count: 2, white: [1] },
  all: { count: 5, white: [0, 1, 2] },
  wth: { count: 8, white: [0, 1, 2, 3, 4, 5, 6] },
  exo: { count: 6, white: [0, 1, 2, 3, 4] },
  ice2: { count: 16, white: [0] },
  por: { count: 21, white: Array.from({ length: 20 }, (t, e) => e) },
  tmp: { count: 2, white: [1] }
}, zl = (t) => `${t}#opaque-print-details-v1`, pg = (t) => Object.keys(ko).some((e) => t === `${z.KEYRUNE_ROOT}/${e}.svg`);
async function bg(t, e) {
  const r = Object.keys(ko).find((u) => t === `${z.KEYRUNE_ROOT}/${u}.svg`);
  if (!r) return null;
  const n = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), o = n.documentElement, s = n.querySelectorAll("path"), a = s[0]?.getAttribute("d") ?? "", i = a.match(/M[^M]*/g) ?? [], l = ko[r];
  if (o.localName !== "svg" || n.querySelector("parsererror") || s.length !== 1 || i.length !== l.count || i.some((u) => /m/.test(u) || !/[zZ]\s*$/.test(u)))
    throw new Error(`Unexpected pinned ${r} symbol paths.`);
  const d = n.createElementNS("http://www.w3.org/2000/svg", "path");
  return d.setAttribute("d", l.white.map((u) => i[u]).join("")), d.setAttribute("fill", "#fff"), o.replaceChildren(d), new Blob([new XMLSerializer().serializeToString(n)], { type: "image/svg+xml" });
}
const yg = "symbol-svg-v6", wg = { "leg-c": { sha256: "289e33fd164ee77b5b5d5982b299f485ca668c576368ec796be3b8260de592fd", recipe: "remove-outer-white", pathCount: 7 }, "drk-c": { sha256: "d83257eede46a709ad6f6bf8800928e5954121a75fa8511a255bef4caa382ffa", recipe: "remove-outer-white", pathCount: 2, fill: "#221c13", outline: { stroke: "#505050", width: 24 } }, "6ed-u": { sha256: "631daa24b47c80669e3b27044d9213faa69e9207940a5a7283d67ab7db54e65b", recipe: "white-outer-rim" }, "6ed-r": { sha256: "a6175526471668969615caecff1070f8d9d119ff69b03fc6c03af1ad5fc0f198", recipe: "white-outer-rim" }, "m15-u": { sha256: "bfd962ff9640a846e5690d76c0fe88324e9d49cb6771744b5ab8f34f7afe7362", recipe: "m15" }, "m15-r": { sha256: "933756b97cebe7389ff7cee219a34b1ac13bc504743a2be037a286ee5ffc4b0d", recipe: "m15" }, "m15-m": { sha256: "6e9f87473f1ed8ecb05647fbde6f13e22faeab18fe56b8f76cfa1759bb4210e7", recipe: "m15" }, "8ed-u": { sha256: "6c20e8da28fdd5cdb030814e5c1339978f276c77f4ad9d99ca816adb8d970880", recipe: "8ed" }, "8ed-r": { sha256: "eccde74c56b4810434ecdf4e99206046d6970ea601e4fed2f73eb2ee855053a2", recipe: "8ed" }, "9ed-u": { sha256: "acb7ea7f3422f50dca2aef4e07aa3977aa1641ff2cb54f6eb64ae1bc17abbf53", recipe: "9ed" }, "9ed-r": { sha256: "c1cbcc1aea4f032c5f2ccf7f1d63073813bf9c6f050ba2f5385170ff3deca8a5", recipe: "9ed" }, "7ed-u": { sha256: "94c67d433ba3012f3aa1c494a7ef0ae1e7de58ce4614dfd50ee8f52de527d7e4", recipe: "white-outer-rim" }, "7ed-r": { sha256: "8b30917e85b2c9c3549bfa6c2f62261801df33ff7debcc138bf89c4a9ba9689f", recipe: "white-outer-rim" } }, bs = {
  revision: yg,
  sources: wg
}, Ia = `${P}/img/setSymbols/official/`, Oa = bs.sources;
function ys(t) {
  if (!t.startsWith(Ia) || !t.endsWith(".svg")) return;
  const e = t.slice(Ia.length, -4);
  return Object.hasOwn(Oa, e) ? Oa[e] : void 0;
}
function Sg(t) {
  return !!ys(t);
}
async function vg(t, e) {
  const r = ys(t);
  if (!r) return e;
  const n = await e.arrayBuffer();
  if ([...new Uint8Array(await crypto.subtle.digest("SHA-256", n))].map((h) => h.toString(16).padStart(2, "0")).join("") !== r.sha256) throw Error(`Unexpected pinned symbol checksum: ${t}`);
  const a = new DOMParser().parseFromString(new TextDecoder().decode(n), "image/svg+xml"), i = a.documentElement, l = [...i.querySelectorAll("path")], d = i.querySelector("linearGradient, radialGradient");
  if (i.localName !== "svg" || a.querySelector("parsererror") || !d && r.recipe !== "remove-outer-white")
    throw Error(`Unexpected pinned symbol SVG: ${t}`);
  const u = (h, m) => {
    for (const [c, g] of Object.entries(m)) h.setAttribute(c, g);
  };
  if (r.recipe === "remove-outer-white") {
    if (l.length !== r.pathCount || !/fill:\s*#ffffff\b/i.test(l[0].getAttribute("style") ?? ""))
      throw Error("Unexpected monochrome symbol topology.");
    l[0].remove(), r.fill && l[1].setAttribute("fill", r.fill);
  } else if (r.recipe === "white-outer-rim") {
    if (l.length !== 3) throw Error("Unexpected rimmed symbol topology.");
    l[0].setAttribute("fill", "#fff");
  } else if (r.recipe === "m15") {
    if (l.length !== 6) throw Error("Unexpected M15 path topology.");
    u(l[0], { fill: `url(#${d.id})` });
    for (const h of l.slice(1)) h.setAttribute("fill", "#000");
  } else if (r.recipe === "8ed" || r.recipe === "9ed") {
    if (l.length !== 4) throw Error("Unexpected numeric shield path topology.");
    const h = l[2], m = h.parentElement?.getAttribute("transform");
    if (!m) throw Error("Missing numeric shield coordinate transform.");
    if (l[0].setAttribute("fill", "#000"), l[3].setAttribute("fill", "#000"), r.recipe === "9ed") {
      const c = d.cloneNode(!0);
      u(c, {
        id: "glint-root-metal",
        gradientTransform: `${m} ${d.getAttribute("gradientTransform") ?? ""}`
      }), d.after(c), u(l[3], {
        stroke: "url(#glint-root-metal)",
        "stroke-width": "12",
        "paint-order": "stroke fill"
      });
    }
  } else throw Error(`Unknown symbol SVG patch recipe: ${r.recipe}`);
  return i.setAttribute("data-card-glint-patch", bs.revision), new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" });
}
const Yl = (t) => `${t}#printed-outline-v1`;
async function Cg(t, e) {
  const r = ys(t)?.outline;
  if (!r) return null;
  const n = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), o = n.documentElement, s = [...o.querySelectorAll("path")];
  if (o.localName !== "svg" || n.querySelector("parsererror") || o.getAttribute("data-card-glint-patch") !== bs.revision || s.length !== 1)
    throw Error(`Unexpected prepared symbol outline: ${t}`);
  const a = s[0];
  return a.setAttribute("stroke", r.stroke), a.setAttribute("stroke-width", String(r.width)), a.setAttribute("stroke-linejoin", "round"), a.setAttribute("paint-order", "stroke fill"), new Blob([new XMLSerializer().serializeToString(n)], { type: "image/svg+xml" });
}
function kg(t, e, r, n, o, s) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0;
  const a = B();
  a.width = t.canvas.width, a.height = t.canvas.height;
  const i = a.getContext("2d");
  if (!i) throw Error("Retro lettering needs a Canvas2D context");
  const l = t.getTransform();
  i.font = t.font, i.textAlign = t.textAlign, i.textBaseline = t.textBaseline, i.letterSpacing = t.letterSpacing, t.resetTransform();
  for (const [d, u, h] of [
    [0, s, "#f2eee3"],
    [s, 0, "#17140f"]
  ])
    i.resetTransform(), i.clearRect(0, 0, a.width, a.height), i.setTransform(l), i.globalCompositeOperation = "source-over", i.fillStyle = h, i.fillText(e, r + d, n + d, o), i.globalCompositeOperation = "destination-out", i.fillText(e, r + u, n + u, o), t.drawImage(a, 0, 0);
  a.width = a.height = 0, t.restore();
}
function Ir(t, e, r, n, o, s, a = "#ababab", i, l = "stats") {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, mt(t, e, r + s, n + s, o, i, l, () => {
    t.fillStyle = "#17140f", t.fillText(e, r + s, n + s, o);
  }), t.fillStyle = a, mt(t, e, r, n, o, i, l), t.restore();
}
const Tg = {
  title: { x: 38, y: 47.312, size: 25.75, width: 1 },
  type: { x: 49, y: 395.71, size: 21.95, width: 1 },
  artist: { x: 48, y: 642.5, size: 22.25, width: 1.01 },
  basic: {
    x: 70,
    y: 406.556,
    width: 348,
    height: 177.232,
    size: 27.5,
    leading: 1.1,
    offset: 0,
    paragraph: 0
  },
  dual: {
    x: 71.5,
    y: 420,
    width: 342,
    height: 187,
    size: 15.5,
    leading: 1.2,
    offset: -18,
    paragraph: 0.075
  }
};
function ql() {
  return Tg;
}
function Jn(t, e, r, n, o) {
  const s = ql()[r];
  t.save(), t.translate(s.x, s.y), t.scale(s.width, 1), t.font = `${s.size}px "CardRenderer MTG ${r === "title" ? "Goudy" : "MPlantin"}", Georgia`, t.textAlign = "left", t.textBaseline = r === "artist" ? "alphabetic" : "middle", Ir(
    t,
    e,
    0,
    0,
    n / s.width,
    r === "artist" ? 1.25 : 1,
    "#ababab",
    r === "type" ? o : void 0,
    "type"
  ), t.restore();
}
function Mg(t, e, r, n) {
  const o = ql(), s = e.wordingMode === "oracle" ? 10 : 15, a = r.reduce((d, u) => d + u.runs.reduce((h, m) => h + m.text.length, 0), 0) > 150, i = (d) => ({
    leading: d.leading,
    paragraphGap: d.paragraph,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    centerOffset: d.offset
  });
  if (e.rulesAlignment?.mode !== "left") {
    const d = nr(
      t,
      r,
      n,
      o.basic,
      o.basic.size,
      s,
      5,
      { ...i(o.basic), balanceLines: !0 },
      150
    );
    if (d)
      return a ? O(
        t,
        r.map((u) => ({ ...u, align: "center" })),
        o.dual,
        o.dual.size,
        Math.min(s, o.dual.size),
        { ...i(o.dual), balanceLines: !0 }
      ) : d;
  }
  const l = a ? o.dual.size : o.basic.size;
  return O(t, r, o.dual, l, Math.min(s, l), i(o.dual));
}
function Rg(t) {
  return ["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "");
}
function xg(t, e, r) {
  t.save(), t.font = '22.5px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.textBaseline = "alphabetic", Ir(
    t,
    `Illus. © ${e}`,
    49,
    je(r)?.artistBaseline ?? 631,
    338,
    1.25,
    je(r)?.artistInk
  ), t.restore();
}
function Ag(t, e, r, n, o, s) {
  t.save();
  const a = B();
  try {
    const i = t.getTransform();
    t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = "#17140f", t.fillText(e, r + s.shadow / s.width, n + s.shadow, o), a.width = t.canvas.width, a.height = t.canvas.height;
    const l = a.getContext("2d");
    if (!l) throw Error("Artist ink needs a Canvas2D context");
    l.setTransform(i), l.font = t.font, l.textAlign = t.textAlign, l.textBaseline = t.textBaseline, l.letterSpacing = t.letterSpacing, l.fillStyle = "#f2eee3", l.fillText(e, r, n, o), s.trim > 0 && (l.globalCompositeOperation = "destination-out", l.globalAlpha = 0.65, l.lineWidth = s.trim * 2, l.strokeText(e, r, n, o)), t.resetTransform(), t.drawImage(a, 0, 0);
  } finally {
    a.width = a.height = 0, t.restore();
  }
}
const $a = {
  arn: { size: 22, x: 49.75, y: 638.5, width: 1.02, edge: 1.25 },
  atq: { size: 21, x: 48.75, y: 638.5, width: 1.075, edge: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.5, width: 1.045, edge: 1.25 }
}, Lg = {
  arn: { size: 22, x: 49.25, y: 638.5, width: 1.025, trim: 0.8, shadow: 1.5 },
  atq: { size: 21, x: 48.5, y: 638.5, width: 1.075, trim: 0.75, shadow: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.25, width: 1.045, trim: 0.55, shadow: 1.5 }
};
function Hl(t) {
  const e = t.setCode?.toLowerCase();
  if (e !== "arn" && e !== "atq" && e !== "drk" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || t.borderColor && t.borderColor !== "black" || t.legendary || /\b(Legendary|Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", n = t.land ?? /\bLand\b/.test(r), o = t.artifact ?? /\bArtifact\b/.test(r), s = F(t).length;
  if (!(!n && !o && s !== 1 && !(e === "drk" && s === 2)))
    return Lg[e];
}
function Eg(t, e) {
  const r = e.setCode?.toLowerCase();
  if (!e.artist || r !== "arn" && r !== "atq" && r !== "drk") return !1;
  const n = Hl(e), o = n ?? $a[r];
  t.save(), t.translate(o.x, o.y), t.scale(o.width, 1), t.font = `${o.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = "left", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
  const s = `Illus. © ${r === "drk" ? "1994 " : ""}${e.artist}`;
  return n ? Ag(t, s, 0, 0, 338 / o.width, n) : kg(t, s, 0, 0, 338 / o.width, $a[r].edge), t.restore(), !0;
}
const Bg = {
  arn: { x: 452, y: 638, size: 26, width: 1.03, trim: 0.9, shadow: 2, shadowTrim: 0.4 },
  atq: { x: 452.5, y: 639, size: 27.5, width: 0.97, trim: 0.9, shadow: 1.5, shadowTrim: 0.2 },
  drk: { x: 452, y: 640, size: 27, width: 1.01, trim: 0.8, shadow: 1.25, shadowTrim: 0.3 }
};
function Ig(t) {
  const e = t.setCode?.toLowerCase();
  if (!(e !== "arn" && e !== "atq" && e !== "drk" || t.power == null || t.toughness == null || !Hl(t)))
    return Bg[e];
}
function Og(t, e) {
  const r = Ig(e);
  if (!r) return !1;
  t.save();
  try {
    t.translate(r.x, r.y), t.scale(r.width, 1), t.font = `${r.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = "right", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
    const n = `${e.power}/${e.toughness}`.replaceAll("-", "–");
    $g(t, n, 132 / r.width, r, e.textInk);
  } finally {
    t.restore();
  }
  return !0;
}
function $g(t, e, r, n, o) {
  const s = B();
  t.save();
  try {
    s.width = t.canvas.width, s.height = t.canvas.height;
    const a = s.getContext("2d");
    if (!a) throw Error("Stats ink needs a Canvas2D context");
    const i = t.getTransform();
    a.font = t.font, a.textAlign = t.textAlign, a.textBaseline = t.textBaseline, a.letterSpacing = t.letterSpacing, t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.resetTransform();
    for (const [l, d, u] of [
      [n.shadow, n.shadowTrim, "#17140f"],
      [0, n.trim, "#f2eee3"]
    ]) {
      a.resetTransform(), a.clearRect(0, 0, s.width, s.height), a.setTransform(i), a.globalAlpha = 1, a.globalCompositeOperation = "source-over", a.fillStyle = u;
      const h = l / n.width;
      mt(a, e, h, l, r, o, "stats", () => {
        l && (a.fillStyle = u), a.fillText(e, h, l, r);
      }), d > 0 && (a.globalCompositeOperation = "destination-out", a.globalAlpha = 0.65, a.lineWidth = d * 2, a.strokeText(e, h, l, r)), t.drawImage(s, 0, 0);
    }
  } finally {
    s.width = s.height = 0, t.restore();
  }
}
function Gg(t, e, r) {
  const n = ot(e), o = ht(e)?.material, s = o && n?.rulesAdjustments && {
    ...n.rulesAdjustments.default,
    ...n.rulesAdjustments[o]
  };
  if (!r || !s || !Object.values(s).some(Boolean)) return r;
  const a = Ue(r);
  if (!a) throw Error("Selected rules policy does not expose calibration inputs");
  const { bounds: i, typography: l } = a, d = r.horizontalScale ?? 1, u = (s.leftMargin ?? 0) / d, h = (s.rightMargin ?? 0) / d, m = s.vertical ?? 0, c = s.alignment && s.alignment !== "printing" ? a.paragraphs.map((f) => ({ ...f, align: s.alignment })) : a.paragraphs, g = O(
    t,
    c,
    {
      ...i,
      x: i.x + u,
      y: i.y + m,
      width: i.width - u - h,
      verticalLimits: i.verticalLimits ? [i.verticalLimits[0] + m, i.verticalLimits[1] + m] : void 0
    },
    a.maximumSize + (s.fontSize ?? 0),
    a.minimumSize + (s.fontSize ?? 0),
    {
      ...l,
      textWidth: (l.textWidth ?? 1) + (s.textWidth ?? 0),
      leading: l.leading + (s.leading ?? 0),
      paragraphGap: l.paragraphGap + (s.paragraphGap ?? 0),
      flavorGap: l.flavorGap + (s.flavorGap ?? 0)
    }
  );
  return r.horizontalScale === void 0 ? g : { ...g, horizontalScale: d };
}
function Pg(t, e, r, n, o) {
  const s = r.centered, a = o.reduce((u, h) => u + h.runs.reduce((m, c) => m + c.text.length, 0), 0), i = e.wordingMode === "oracle" ? Math.min(10, r.minimumSize) : r.minimumSize;
  let l = !1;
  if (s && e.rulesAlignment?.mode !== "left" && a <= s.maxCharacters) {
    const u = O(
      t,
      o,
      r.bounds,
      s.maximumSize,
      s.maximumSize,
      r.typography
    );
    l = !u.overflow && u.lines.length <= s.maxLines;
  }
  const d = n.map((u) => ({
    ...u,
    align: u.align ?? (e.rulesAlignment?.mode === "left" ? "left" : l ? "center" : "left")
  }));
  return O(
    t,
    d,
    r.bounds,
    l ? s.maximumSize : r.maximumSize,
    i,
    r.typography
  );
}
const mn = (t) => t?.runs.map((e) => e.text).join("") ?? "", Ga = (t) => t.length === 2 && /^[A-Za-z ,]+$/.test(mn(t[0])) && mn(t[0]).length <= 20;
function Wg(t, e, r, n, o, s, a, i) {
  const l = (c) => c.role === "rules" && c.runs.length > 0 && !mn(c).includes(`
`) && c.align === void 0;
  if (!r.length || !r.every(l) || e.some((c) => c.align) || r.length !== 1 && !Ga(r)) return null;
  const d = (c) => c.map(
    (g, f) => ({
      ...g,
      align: g.align ?? (g.role === "flavor" || Ga(c) && f === 0 && !/^Enchant\b/.test(mn(g)) ? "left" : "center")
    })
  ), u = { x: 70, y: n - 6, width: 348, height: o - 8 }, h = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, m = O(t, d(r), u, s, s, h);
  return m.overflow || m.lines.length > 5 ? null : O(
    t,
    d(e),
    { ...u, verticalLimits: i },
    s,
    a,
    h
  );
}
function Pa(t, e) {
  return !Mt(t) || t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode !== "original" ? e : e.map(
    (r) => r.role !== "rules" ? r : {
      ...r,
      runs: r.runs.map((n) => ({
        ...n,
        text: n.text.replace(/\{(\d+|[XYZ])\}/g, "$1")
      }))
    }
  );
}
const cn = (t) => t.runs.map((e) => e.text).join(""), Fg = (t) => t.role === "rules" && /^[A-Za-z ,]+$/.test(cn(t)) && cn(t).length <= 28, Ur = { x: 72, y: 413, width: 344, height: 182 }, Kn = {
  leading: 1,
  paragraphGap: 0,
  flavorGap: 0,
  flavorOrphans: !1,
  flavorSeparator: !1,
  centerOffset: -14
}, Wa = (t) => t.map((e, r) => ({
  ...e,
  align: e.role === "rules" && (t.some((n) => n.role === "flavor") || r === 0 && t.length > 1 && Fg(e)) ? "left" : "center"
}));
function _g(t, e, r, n) {
  if (!Mt(e) || e.borderColor && e.borderColor !== "black") return null;
  const o = e.wordingMode === "oracle" ? 10 : 15, s = n.reduce(
    (l, d) => l + cn(d).replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
    0
  );
  if (e.rulesAlignment?.mode !== "left" && s <= (n.every((l) => l.role === "flavor") ? 135 : 130) && n.length > 0 && n.every((l) => l.align === void 0 && !cn(l).includes(`
`)) && r.every((l) => l.align === void 0)) {
    const l = {
      ...Kn,
      leading: 1.1,
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, d = O(t, Wa(n), Ur, 27.5, 27.5, l);
    if (!d.overflow && d.lines.length <= 5)
      return O(t, Wa(r), Ur, 27.5, o, l);
  }
  const i = O(t, r, Ur, 22.25, 21.75, Kn);
  return i.overflow ? O(t, r, Ur, 15.5, o, {
    ...Kn,
    leading: 1.2
  }) : i;
}
const Ug = {
  arn: {
    regular: 23,
    textWidth: 1,
    threshold: 130,
    offset: -10,
    compact: 17.5,
    compactLeading: 1.15
  },
  atq: {
    regular: 22.5,
    textWidth: 1.02,
    threshold: 130,
    offset: -10,
    compact: 15.5,
    compactLeading: 1.2
  },
  drk: {
    regular: 22.5,
    textWidth: 1,
    threshold: 130,
    offset: -4,
    compact: 15.5,
    compactLeading: 1.2
  }
}, we = { x: 70, y: 414, width: 348, height: 184 }, gn = (t) => t.runs.map((e) => e.text).join(""), jg = (t) => t.reduce(
  (e, r) => e + gn(r).replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
  0
), Dg = (t) => t.role === "rules" && /^[A-Za-z ,]+$/.test(gn(t)) && gn(t).length <= 28, Fa = (t, e = !1) => t.map((r, n) => ({
  ...r,
  align: !e && r.role === "rules" && (t.some((o) => o.role === "flavor") || n === 0 && t.length > 1 && Dg(r)) ? "left" : "center"
}));
function Ng(t, e, r, n) {
  const o = e.setCode?.toLowerCase();
  if (o !== "arn" && o !== "atq" && o !== "drk" || e.frameTemplate || e.frameAssetFamily || e.frameStyle === "modern" || e.borderColor && e.borderColor !== "black" || e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return null;
  const s = Ug[o], a = e.wordingMode === "oracle" ? 10 : 15, i = {
    textWidth: s.textWidth,
    leading: 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    centerOffset: s.offset
  };
  if (e.rulesAlignment?.mode !== "left" && n.length > 0 && jg(n) <= s.threshold && n.every((u) => u.align === void 0 && !gn(u).includes(`
`)) && r.every((u) => u.align === void 0)) {
    const u = o === "drk", h = u ? { ...we, x: 76, width: 336 } : we, m = {
      ...i,
      textWidth: 1,
      leading: 1.1,
      centerOffset: u ? 0 : -14,
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, c = O(
      t,
      Fa(n, u),
      h,
      27.5,
      27.5,
      m
    );
    if (!c.overflow && c.lines.length <= 5) {
      const g = Fa(r, u), f = O(t, g, h, 27.5, a, m);
      return !u || f.lines.length >= 5 ? f : O(t, g, h, 27.5, a, {
        ...m,
        centerOffset: -2 * (5 - f.lines.length)
      });
    }
  }
  if (!O(t, r, we, 22.5, 21.75, {
    ...i,
    textWidth: 1
  }).overflow) {
    const u = O(
      t,
      r,
      we,
      s.regular,
      Math.min(s.regular, 21.75 / Math.max(1, s.textWidth)),
      i
    );
    if (o !== "drk") return u;
    const h = u.lines.length <= 5;
    return O(
      t,
      r,
      { ...we, x: 71, y: h ? 415 : 418, width: h ? 348 : 351 },
      s.regular,
      Math.min(s.regular, 21.75 / Math.max(1, s.textWidth)),
      { ...i, leading: 0.96 }
    );
  }
  return O(
    t,
    r,
    o === "drk" ? { ...we, x: 73, y: 418, width: 342 } : we,
    s.compact,
    a,
    {
      ...i,
      textWidth: 1,
      leading: o === "drk" ? 1.22 : s.compactLeading
    }
  );
}
const _a = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: !1,
  flavorSeparator: !1
};
function zg(t, e) {
  const r = ht(e) && ot(e)?.textTiers, n = () => {
    const o = Yg(t, e), s = r?.retainRegularAboveLines;
    if (s !== void 0 && (!Number.isInteger(s) || s < 1))
      throw Error("Invalid regular density limit");
    const i = o && e.wordingMode !== "oracle" && s !== void 0 && o.size >= 19 && o.size < 30 && o.lines.length > s ? o : r && o ? e.wordingMode === "oracle" ? xo(t, e, o, r.regularWidthDelta) : Ai(t, e, o, r) : H0(t, e, o);
    return Gg(t, e, i);
  };
  return r ? yd(t, n) : n();
}
function Yg(t, e) {
  if (Oo(e)) return null;
  const [r, n, o, s] = kt(Sn(e).rules), a = Ao(e), i = Pa(
    e,
    a?.paragraphs ?? Re({
      rulesText: e.rulesText ?? "",
      rulesParagraphs: e.rulesParagraphs
    })
  ), l = e.rulesAlignment?.mode === "left", d = l ? i.map((I) => I.role === "rules" ? { ...I, align: "left" } : I) : i, u = e.rulesAlignment?.mode === "auto" ? Pa(e, e.rulesAlignment.reference ?? d) : d, h = e.wordingMode === "oracle" ? 10 : 15;
  if (St(e)) return Mg(t, e, d, u);
  const m = _g(t, e, d, u);
  if (m) return m;
  const c = Ng(t, e, d, u);
  if (c) return c;
  const g = ht(e), f = g && ot(e)?.body, b = f && (f[g.material] ?? f.default);
  if (b) return Pg(t, e, b, d, u);
  const y = e.setCode?.toLowerCase(), p = Ad(y) ? { ..._a, flavorAttribution: "right" } : _a, w = ["lea", "leb"].includes(y ?? "") && e.wordingMode === "oracle" ? [428, 590] : void 0, S = ["lea", "leb", "2ed"].includes(y ?? ""), v = S || y === "3ed" && $t(e) === "fourth";
  if (v && !l) {
    const I = Wg(
      t,
      d,
      u,
      n,
      s,
      S ? 32.5 : 27.5,
      h,
      w
    );
    if (I) return I;
  }
  const C = u.length === 1 ? u[0] : void 0, k = C?.runs.length === 1 ? C.runs[0] : void 0;
  if (!l && y === "4ed" && $t(e) === "fourth" && u.some((I) => I.role === "flavor")) {
    const I = nr(
      t,
      d,
      u,
      { x: 72, y: n + 2, width: 344, height: s - 8 },
      25,
      h,
      5,
      {
        ...p,
        leading: 1.1,
        paragraphGap: 0,
        flavorGap: 0,
        balanceLines: !0
      },
      150
    );
    if (I) return I;
  }
  const R = !l && y === "4ed" && $t(e) === "fourth" && d.every((I) => I.align === void 0 || I.align === "center") && C?.role === "rules" && (C.align === void 0 || C.align === "center") && k && !k.italic && !k.text.includes(`
`) && k.text.length > 0 && k.text.length <= 100, M = (v || y === "4ed" && $t(e) === "fourth") && (d.length > 1 || d.reduce((I, q) => I + q.runs.reduce((H, it) => H + it.text.length, 0), 0) > 100), x = M && v, E = M && y === "4ed", $ = (y === "mir" || y === "tmp") && !a && !/\b(?:Land|Artifact)\b/.test(e.typeLine ?? "") && F(e).join("") === "W", A = O(
    t,
    R ? d.map((I) => ({ ...I, align: "center" })) : d,
    {
      x: v ? 70 : E || R ? 72 : r,
      y: n + (a ? 1.5 : R ? -6 : E ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: v ? 346 : E || R ? 344 : o + ($ ? 10 : 0),
      height: s - 8,
      verticalLimits: w
    },
    a ? 24 : R ? 25 : 22.5,
    h,
    R ? { ...p, leading: 1, balanceLines: !0 } : M ? {
      ...p,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: x ? -10 : 0
    } : p
  ), _ = d.reduce(
    (I, q) => I + q.runs.reduce((H, it) => H + it.text.length, 0),
    0
  );
  return !x || _ <= 270 || A.size >= 22 ? A : O(
    t,
    d,
    { x: 70, y: n + 4, width: 346, height: s + 8, verticalLimits: w },
    15.5,
    h,
    {
      ...p,
      leading: 1.25,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: -18
    }
  );
}
function qg(t) {
  return t.setCode?.toLowerCase() === "3ed" && $t(t) === "fourth";
}
function Hg(t, e, r, n, o) {
  t.save(), t.font = '26px "CardRenderer MTG Goudy", Georgia', Ir(t, e, 40, n, o + r - 40, 1), t.restore();
}
function Xg(t, e, r, n) {
  t.save(), t.font = '27.25px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "right", Ir(t, e, 451, r + 11, 130, 1.25, "#d4d4d4", n), t.restore();
}
function Jg(t, e) {
  t.save(), t.font = '22px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.textBaseline = "alphabetic", Ir(t, `Illus. © ${e}`, 50, 642, 338, 1.25), t.restore();
}
function Kg(t, e, r, n, o) {
  const s = Sn(e), a = Vc(e), i = qg(e);
  if (o === "artwork") {
    _t(t, e, r, kt(s.art), o);
    return;
  }
  const d = Et(e) ?? O0(e);
  t.fillStyle = d, t.fillRect(0, 0, 488, 680), t.fillStyle = "#686050", t.fillRect(24.4, 27.2, 439.2, 625.6), t.fillStyle = "#e5dec5", t.fillRect(...kt(s.rules)), t.fillStyle = "#746b58", t.fillRect(...kt(s.art)), n && t.drawImage(n, 0, 0, 488, 680), _t(t, e, r, kt(s.art), o);
  const u = r.get(Qt(e));
  u && (t.save(), t.filter = $0(e), t.drawImage(u, ...kt(s.frame)), ug(t, u, Qt(e)), Qt(e).endsWith("/seventh/regular/m.png") && hg(t, u), t.restore());
  const h = ht(e)?.stockWindow ?? Qe(e)?.stockWindow ?? Mt(e)?.stockWindow, m = ht(e)?.stockMaskFrame;
  if (m) {
    const W = r.get(tn(e));
    if (!W) throw Error("Calibrated historical stock mask is unavailable.");
    La(t, W, kt(m), d);
  } else if (h)
    Pc(t, kt(h), d);
  else if (St(e) || Ti(e))
    t.save(), t.fillStyle = d, t.beginPath(), t.rect(0, 0, 488, 680), t.rect(24, 29, 440, 623), t.fill("evenodd"), t.strokeStyle = "#30312e", t.lineWidth = 1.5, t.strokeRect(24.5, 29.5, 439, 622), t.restore();
  else if (Lt(e) !== "black" || $t(e) === "fourth") {
    const W = r.get(tn(e));
    W && La(t, W, kt(s.frame), d);
  }
  t.fillStyle = je(e.setCode)?.headingInk ?? Gs(e), t.textBaseline = "middle", t.textAlign = "left", t.letterSpacing = "0px";
  const [c, g, f, b] = kt(s.title), y = e.manaSymbols ?? [], p = Wc(e), w = p?.[3] ?? a?.manaSize ?? 23.4, S = p ? p[2] - w : a?.manaGap ?? 1.7, v = y.length * (w + S), C = p ? p[0] + w / 2 - v + S : a ? a.manaRight - v + S : c + f - v, k = ["lea", "2ed"].includes(e.setCode?.toLowerCase() ?? ""), R = i || k ? [
    (i ? 435 : 432) - Math.max(0, y.length - 1) * 27 - (i ? 23.4 : 23.9) / 2,
    (i ? 44.5 : 46) - (i ? 23.4 : 23.9) / 2,
    Math.max(0, y.length - 1) * 27 + (i ? 23.4 : 23.9),
    i ? 23.4 : 23.9
  ] : [
    C,
    p ? p[1] - w / 2 : a?.manaTop ?? g + b / 2 - w / 2,
    Math.max(0, v - S),
    w
  ], M = Tn(e), x = Ju(R, y.length, M), E = ke(x, M);
  t.shadowColor = "#000b", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, t.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const $ = a?.titleX ?? c, A = g + b / 2 + (a?.titleYOffset ?? 0), _ = Math.max(
    1,
    y.length ? C + E[0] - R[0] - $ - 5 : a?.titleX == null ? f - 5 : c + f - $ - 5
  );
  t.save(), t.translate(...gs(e, "retro")), St(e) ? Jn(t, e.name, "title", _) : i ? Hg(t, e.name, $, A, _) : !jc(t, e, $ + _) && !_c(t, e, $ + _) && !Aa(t, e, $, A, _) && t.fillText(e.name, $, A, _), t.restore();
  const I = e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode === "oracle", q = e.symbolStyle === "original" || e.symbolStyle === void 0 && e.wordingMode === "original", H = q && ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "");
  Y(
    t,
    e,
    "manaCost",
    () => He(t, x, M, () => {
      i ? Xc(t, y, r, I, M) : ["lea", "2ed"].includes(e.setCode?.toLowerCase() ?? "") ? Jc(t, y, r, I, M) : y.forEach(
        (W, nt) => (H ? Dl : st)(
          t,
          W,
          C + nt * (w + S) - (y.length - 1 - nt) * (M?.spacing ?? 0),
          p ? p[1] - w / 2 : a?.manaTop ?? g + b / 2 - w / 2,
          w,
          r,
          !1,
          M
        )
      );
    })
  );
  const [it, jt, et, N] = kt(s.type), tt = Mi(e) ?? "", U = r.get(tt), Z = gg(e), Kt = fg(e), rt = U ? Math.min(44 / U.width, (a?.setHeight ?? 23.4) / U.height) : 0, ce = Z?.width ?? (U?.width ?? 0) * rt, vt = Z?.height ?? (U?.height ?? 0) * rt, ge = [
    (Z?.right ?? a?.setRight ?? it + et) - ce,
    (Z?.centerY ?? a?.setCenterY ?? jt + N / 2) - vt / 2,
    ce,
    vt
  ], se = fs(e, tt, ge, "retro"), Vt = ke(se, e.symbolAdjustment?.set), Dt = Yc(e);
  t.font = `${Dt.fontSize}px "CardRenderer MTG MPlantin", Georgia`;
  const fe = St(e) ? (W, nt, gt, bt) => Jn(t, W, "type", bt, e.textInk) : (W, nt, gt, bt) => {
    !Hc(t, e, W, nt + bt) && !zc(t, e, W, nt, gt, bt) && !Aa(t, e, nt, gt, bt, "type", W) && mt(t, W, nt, gt, bt, e.textInk, "type");
  };
  t.save(), t.translate(Dt.dx, Dt.dy), fe(
    Ao(e)?.typeLine ?? e.typeLine ?? "",
    a?.typeX ?? it,
    jt + N / 2,
    U ? Math.max(
      1,
      Math.min(
        et - 48,
        Z ? Z.right - Z.width - it - 6 : et,
        Vt !== ge ? Vt[0] - (a?.typeX ?? it) - 6 : et
      )
    ) : et
  ), t.restore(), Y(
    t,
    e,
    "setSymbol",
    () => He(t, se, e.symbolAdjustment?.set, () => {
      if (U) {
        const W = Math.min(44 / U.width, (a?.setHeight ?? 23.4) / U.height), nt = Z?.width ?? U.width * W, gt = Z?.height ?? U.height * W, bt = Z?.right ?? a?.setRight ?? it + et, At = Z?.centerY ?? a?.setCenterY ?? jt + N / 2, ae = Z?.crop ?? [0, 0, 1, 1], sr = Ut(tt), Zt = !sr && !e.setSymbol && r.get(zl(tt));
        if (Zt && (t.save(), t.shadowColor = "transparent", e.setCode?.toLowerCase() === "arn" && (t.filter = "brightness(0.7)"), t.drawImage(
          Zt,
          ae[0] * Zt.width,
          ae[1] * Zt.height,
          ae[2] * Zt.width,
          ae[3] * Zt.height,
          bt - nt,
          At - gt / 2,
          nt,
          gt
        ), t.restore()), sr || e.setSymbol) {
          t.save(), t.shadowColor = "transparent";
          const G = !e.setSymbol && e.setCode?.toLowerCase() === "drk" && Lt(e) === "black" && j(e).boxes === "B" ? r.get(Yl(tt)) : void 0;
          t.drawImage(G ?? U, ...se), t.restore();
        } else Kt || a || li(e.setCode) ? eg(
          t,
          U,
          bt - nt,
          At - gt / 2,
          nt,
          gt,
          Z?.outline ?? (Kt ? 2 : a?.setOutline ?? jd(e.setCode)),
          ae,
          Kt,
          Z?.sampling
        ) : oe(
          t,
          U,
          e.setCode,
          e.rarity,
          it + et - U.width * W,
          jt + N / 2 - U.height * W / 2,
          U.width * W,
          U.height * W
        );
      }
    })
  ), t.shadowColor = "transparent";
  const [Le, or, pe, Yt] = kt(s.rules);
  t.fillStyle = "#17140f";
  const Nt = r.get(Oo(e) ?? "");
  if (Nt && re(t)) {
    const W = Math.min(pe * 0.4 / Nt.width, Yt * 0.75 / Nt.height);
    t.drawImage(
      Nt,
      Le + (pe - Nt.width * W) / 2,
      or + (Yt - Nt.height * W) / 2,
      Nt.width * W,
      Nt.height * W
    );
  } else {
    const W = zg(t, e);
    W && Rt(
      t,
      W,
      r,
      I ? st : q ? tg(e.setCode) : e.setCode?.toLowerCase() === "3ed" ? Co : a ? ps : st
    );
  }
  if (lg(t, e)) {
    Vn(t, e, !0);
    return;
  }
  if (!dg(t, e)) {
    if (sg(t, e)) {
      Vn(t, e, !1);
      return;
    }
    if (t.shadowColor = a?.statsOpaqueShadow ? "#000" : "#000b", a && (t.shadowOffsetX = t.shadowOffsetY = a.statsShadow * t.getTransform().a), t.fillStyle = je(e.setCode)?.statsInk ?? Gs(e), t.font = '27.8px "CardRenderer MTG MPlantin", Georgia', t.textBaseline = "middle", e.power != null && e.toughness != null && !Og(t, e)) {
      const [W, nt, gt, bt] = kt(s.stats), At = Kc(e);
      t.textAlign = At ? "right" : "center", i ? Xg(t, vo(e), nt + bt / 2, e.textInk) : mt(
        t,
        vo(e),
        (At?.right ?? W + gt / 2) + (je(e.setCode)?.statsDx ?? 0),
        nt + bt / 2 + (At?.yOffset ?? 0),
        At?.maxWidth ?? gt,
        e.textInk
      );
    }
    a ? rg(t, e, a) : Y(t, e, "artist", () => {
      if (!Eg(t, e)) {
        if (St(e) && e.artist)
          Jn(t, `Illus. © ${e.artist}`, "artist", 390);
        else if (i && e.artist) Jg(t, e.artist);
        else if (e.artist && Rg(e))
          xg(t, e.artist, e.setCode);
        else if (e.artist) {
          const [W, nt, gt, bt] = kt(s.footer);
          t.textAlign = "center", t.font = '15.6px "CardRenderer MTG MPlantin", Georgia', t.fillText(`Illus. ${e.artist}`, W + gt / 2, nt + bt / 2, gt);
        }
      }
    }), Vn(t, e, !a), t.shadowColor = "transparent";
  }
}
function Vn(t, e, r) {
  r && e.legalText && Y(t, e, "legal", () => {
    t.save(), t.shadowColor = "transparent", t.fillStyle = Pt(e.setCode, e.borderColor).ink, t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.fillText(e.legalText, 49, 646, 390), t.restore();
  });
  const n = e.collectorNumber?.trim();
  n && e.collectorTotal !== void 0 && Y(t, e, "collector", () => {
    t.save(), t.shadowColor = "transparent", t.fillStyle = Pt(e.setCode, e.borderColor).ink, t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "right", t.fillText(
      n + (e.collectorTotal ? "/" + e.collectorTotal : ""),
      439,
      660,
      180
    ), t.restore();
  }), t.shadowColor = "transparent";
}
let Ua;
const Vg = [
  { family: "CardRenderer MTG Goudy", url: E0, weight: "400", style: "normal" },
  {
    family: "CardRenderer MTG Historic Symbols",
    url: L0,
    weight: "400",
    style: "normal"
  }
];
function Zg() {
  return typeof FontFace != "function" ? Promise.resolve() : Ua ??= Promise.all(
    Vg.map(async ({ family: t, url: e }) => {
      if ([...lt()].some(
        (n) => n.family.replace(/^"|"$/g, "") === t && n.status === "loaded"
      ))
        return;
      const r = await Ro(e);
      if (!r.ok) throw Error(`Retro font unavailable: ${t}`);
      lt().add(await new FontFace(t, await r.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((t) => {
    throw Ua = void 0, t;
  });
}
const Xl = `${ze}/img/class_level_bg.webp`, Jl = (t) => ["adventure", "class", "leveler"].includes(K(t)), Fe = (t, e, r, n) => ({
  x: t / 63.5 * 488,
  y: e / 88.9 * 680,
  width: r / 63.5 * 488,
  height: n / 88.9 * 680
}), Qg = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function tf(t, e, r, n = 21) {
  const o = t.replace(/\{[^}]+\}/g, "●").split(`
`);
  let s = n;
  for (; s > 8 && o.reduce(
    (a, i) => a + Math.max(1, Math.ceil(i.length * s * 0.53 / e)) * s + 4,
    0
  ) > r; )
    s -= 0.5;
  return s;
}
function Rn(t) {
  const e = K(t), r = [], n = (o, s, a, i = {}) => {
    r.push({ kind: o, text: s, ...a, font: tf(s, a.width, a.height), ...i });
  };
  if (e === "adventure") {
    const o = t.faces?.[1];
    if (!o) return [];
    const s = (o.manaSymbols ?? []).map((i) => `{${i}}`).join(""), a = (o.manaSymbols?.length ?? 0) * 2.5;
    n("heading", o.name, Fe(5.6, 55.3, 25 - a, 4.2), {
      color: "white",
      font: Math.min(18, (25 - a) * 488 / 63.5 / Math.max(1, o.name.length * 0.55))
    }), n("rules", s, Fe(30 - a, 55.3, a, 4.2), { color: "white", font: 17 }), n("heading", o.typeLine ?? "", Fe(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (o.typeLine ?? "").length * 0.52))
    }), n("rules", o.rulesText ?? "", Fe(5.6, 64.5, 24.7, 15.6)), n("rules", t.rulesText ?? t.faces?.[0]?.rulesText ?? "", Fe(33, 54.9, 25.5, 25));
  } else if (e === "class") {
    const [o, s, a, i] = Ft(t).rules.map(
      (w, S) => w * (S % 2 ? L : T)
    ), l = j(t);
    n(
      "band",
      "",
      { x: o, y: s, width: a, height: i },
      {
        fill: "#e3d8bb",
        asset: Ot(
          "saga_textboxes",
          l.boxes === "Colourless" ? "Land" : l.boxes
        )
      }
    );
    const d = [];
    for (const w of (t.rulesText ?? "").split(`
`).filter(Boolean))
      d.length && !/^.*:\s*Level\s+\d+\s*$/i.test(w) && !/^.*:\s*Level\s+\d+\s*$/i.test(d.at(-1)) && !d.at(-1).startsWith("(") ? d[d.length - 1] += `
` + w : d.push(w);
    const u = (w) => /^.*:\s*Level\s+\d+\s*$/i.test(w), h = 28, m = 20, c = (w, S) => w.split(`
`).reduce(
      (v, C) => v + Math.max(1, Math.ceil(C.length * S * 0.53 / (a - 10))),
      0
    ), g = d.map(
      (w) => u(w) ? h : c(w, w.startsWith("(") ? 16 : m) * (w.startsWith("(") ? 16 : m) + 8
    ), f = d.filter((w) => !u(w)).length, b = Math.max(0, i - g.reduce((w, S) => w + S, 0)) / Math.max(1, f), y = Math.min(
      1,
      (i - d.filter(u).length * h) / g.reduce((w, S, v) => w + (u(d[v]) ? 0 : S), 0)
    );
    let p = s;
    d.forEach((w, S) => {
      const v = u(w), C = v ? h : g[S] * y + b;
      if (v) {
        const [k, R] = w.split(/:\s*/);
        n("band", "", { x: o, y: p, width: a, height: C }, { asset: Xl }), n("rules", k + ":", { x: o + 5, y: p, width: a / 2 - 5, height: C }, { font: 18 }), n(
          "heading",
          R,
          { x: o + a / 2, y: p, width: a / 2 - 5, height: C },
          { font: 18, align: "right" }
        );
      } else
        n(
          "rules",
          w,
          { x: o + 5, y: p + 4, width: a - 10, height: C - 8 },
          { font: (w.startsWith("(") ? 16 : m) * y, italic: w.startsWith("(") }
        );
      p += C;
    });
  } else if (e === "leveler") {
    const o = t.rulesText ?? "", s = o.split(/^LEVEL\s+([^\n]+)\n/gm), a = [
      {
        range: "",
        text: s[0] ?? "",
        stats: t.power != null && t.toughness != null ? `${t.power}/${t.toughness}` : ""
      }
    ];
    for (let u = 1; u < s.length; u += 2) {
      const h = s[u + 1] ?? "", m = h.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      a.push({
        range: s[u],
        stats: m?.[1] ?? "",
        text: m ? h.slice(m[0].length) : h
      });
    }
    const i = Fe(4.9, 55.6, 53.7, 25.5), l = i.height / a.length, d = Qg[j(t).frame] ?? "#dcc8af";
    a.forEach((u, h) => {
      const m = i.y + h * l;
      h && n(
        "band",
        "",
        { x: i.x, y: m, width: i.width, height: l },
        { fill: h % 2 ? "#00000018" : "#00000028" }
      );
      const c = u.range ? 55 : 7, g = u.stats ? 72 : 7;
      n("rules", u.text, {
        x: i.x + c,
        y: m + 4,
        width: i.width - c - g,
        height: l - 8
      }), u.range && n(
        "level",
        `LEVEL
${u.range}`,
        { x: i.x - 12, y: m + l / 2 - 23, width: 65, height: 46 },
        { fill: d, font: 13 }
      ), u.stats && n(
        "stats",
        u.stats,
        { x: i.x + i.width - 68, y: m + l / 2 - 22, width: 77, height: 44 },
        { asset: Ot("pt-boxes", j(t).pt), font: 26 }
      );
    });
  }
  return r;
}
function ef(t) {
  return Rn(t).flatMap((e) => [
    e.asset ?? null,
    ...yn(e.text).flatMap((r) => r.symbol ? [Ye(r.symbol)] : [])
  ]);
}
function rf(t) {
  if (["adventure", "prepare"].includes(K(t))) {
    const e = t.faces?.[1];
    return e ? [
      e.name,
      e.typeLine,
      e.colors,
      e.frameColors,
      e.manaSymbols,
      e.rulesText,
      e.rulesParagraphs,
      e.rulesAlignment,
      e.wordingMode,
      e.symbolStyle,
      j(e)
    ] : null;
  }
  return Jl(t) ? Rn(t) : null;
}
function nf(t, e, r) {
  let n = !0;
  for (const o of Rn(e)) {
    if (!re(t) && (o.asset === Xl || o.kind !== "band" && o.kind !== "stats" && o.kind !== "level"))
      continue;
    const { x: s, y: a, width: i, height: l, font: d } = o;
    t.save(), t.textAlign = "left", t.fillStyle = o.fill ?? "transparent", o.kind === "level" ? (t.beginPath(), t.moveTo(s, a), t.lineTo(s + i * 0.72, a), t.lineTo(s + i, a + l / 2), t.lineTo(s + i * 0.72, a + l), t.lineTo(s, a + l), t.closePath(), t.fill(), t.strokeStyle = "#0008", t.lineWidth = 1, t.stroke()) : o.fill && t.fillRect(s, a, i, l);
    const u = o.asset ? r.get(o.asset) : null;
    if (u && t.drawImage(u, s, a, i, l), t.beginPath(), t.rect(s, a, i, l), t.clip(), t.fillStyle = o.color ?? "#17140f", ["stats", "level"].includes(o.kind)) {
      t.font = `${d}px "CardRenderer MTG Beleren", Georgia`, t.textAlign = "center", t.textBaseline = "middle";
      const h = o.text.split(`
`);
      h.forEach(
        (m, c) => mt(
          t,
          m,
          s + i * (o.kind === "level" ? 0.43 : 0.5),
          a + l / 2 + (c - (h.length - 1) / 2) * d,
          i * 0.85,
          o.kind === "stats" && n && e.power != null && e.toughness != null ? e.textInk : void 0
        )
      ), o.kind === "stats" && (n = !1);
    } else if (o.align === "right")
      t.font = `${d}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = "right", t.textBaseline = "middle", t.fillText(o.text, s + i, a + l / 2, i);
    else {
      t.font = `${o.italic ? "italic " : ""}${d}px "CardRenderer MTG MPlantin", Georgia`;
      const h = Xo(t, o.text, i, d).length * d + (o.text.split(`
`).length - 1) * X.paragraphGap;
      zi(
        t,
        o.text,
        s,
        a + Math.max(0, (l - h) / 2),
        i,
        { size: d, italic: !!o.italic },
        r
      );
    }
    t.restore();
  }
}
const of = 5, sf = 0.02655 * L + 0.91339 * T * 3810 / 2736;
function ws(t) {
  const e = t ? 382 : 429;
  return { top: e, scale: 1 - of / (sf - e) };
}
function af(t) {
  const { top: e, scale: r } = ws(t);
  return [e + 6 - ft.middleLift, e + (625 - e) * r - 4];
}
function lf(t, e, r, n, o, s) {
  const { top: a, scale: i } = ws(s), l = e.height * o / e.width, d = Math.max(0, Math.min(l, a - n)), u = d * e.width / o;
  d > 0 && t.drawImage(e, 0, 0, e.width, u, r, n, o, d), d < l && t.drawImage(
    e,
    0,
    u,
    e.width,
    e.height - u,
    r,
    n + d,
    o,
    (l - d) * i
  );
}
function ja(t, e, r, n, o, s) {
  Li(
    t,
    s,
    () => lf(t, e, r, n, o, s)
  );
}
const Tt = {
  badgeWidth: 54,
  badgeHeight: 40,
  textLeft: 67,
  staticTextLeft: 45,
  rightInset: 8,
  separatorLeft: 40,
  separatorHeight: 1.5,
  minimumRowHeight: 34,
  colonOffsetX: 4,
  colonOffsetY: 1.5,
  colonFontSize: 24,
  colonFontFamily: '"CardRenderer MTG MPlantin", Georgia',
  colonInk: "#17140f"
};
function df(t, e, r) {
  const n = t.rulesParagraphs?.filter((a) => a.role === "rules")[r], o = (t.rulesText ?? "").split(`
`).filter((a) => a.trim())[r];
  if (!n || n.runs.map((a) => a.text).join("") !== o) return [{ text: e }];
  let s = o.length - e.length;
  return n.runs.flatMap((a) => {
    const i = Math.min(s, a.text.length);
    return s -= i, i === a.text.length ? [] : [{ ...a, text: a.text.slice(i) }];
  });
}
function uf(t, e) {
  const r = K(e) === "planeswalker-large", n = Er(e), o = !r && n.length < 3, s = Ft(e).rules, a = s[0] * T, i = s[1] * L, l = s[2] * T, d = s[3] * L - (r ? 24 : o ? 4 : 16), u = r ? 8 : o ? 3 : 0, h = r ? { ...Vr, leading: 0.9 } : Vr, m = n.map((M, x) => ({
    ...M,
    runs: df(e, M.text, x),
    left: M.badges.length ? Tt.textLeft : Tt.staticTextLeft
  })), c = (M) => m.map(
    (x) => O(
      t,
      [{ role: "rules", runs: x.runs }],
      {
        x: a + x.left,
        y: 0,
        width: l - x.left - Tt.rightInset,
        height: 1e3
      },
      M,
      M,
      h
    )
  );
  let g = r ? 17.5 : o ? 24 : 19, f = c(g);
  const [b, y] = af(r), p = () => {
    const M = d / Math.max(1, m.length), x = f.map((A, _) => i + u + M * (_ + 0.5) - A.height / 2);
    let E = b - 8;
    for (let A = 0; A < x.length; A++)
      x[A] = Math.max(x[A], E + 8), E = x[A] + f[A].height;
    let $ = y + 8;
    for (let A = x.length - 1; A >= 0; A--)
      x[A] = Math.min(x[A], $ - 8 - f[A].height), $ = x[A];
    return x;
  }, w = () => (p()[0] ?? b) >= b, S = () => f.map(
    (M) => Math.max(Tt.minimumRowHeight, M.height + 16)
  ), v = () => {
    const M = d / Math.max(1, m.length);
    return f.every((x, E) => {
      const $ = M * (E + 0.5);
      return $ - x.height / 2 >= 6 && $ + x.height / 2 <= d + 6 && (!E || M - (x.height + f[E - 1].height) / 2 >= 8);
    });
  };
  for (; g > 8 && (S().reduce((M, x) => M + x, 0) > d || !v() || !w()); )
    g -= 0.25, f = c(g);
  const C = d / Math.max(1, m.length), k = p();
  let R = u;
  return m.map((M, x) => {
    const E = C, $ = f[x].height, A = O(
      t,
      [{ role: "rules", runs: M.runs }],
      {
        x: a + M.left,
        y: k[x],
        width: l - M.left - Tt.rightInset,
        height: $
      },
      g,
      g,
      h
    );
    A.overflow ||= R + E > u + d + 0.01, A.overflow ||= !v(), A.overflow ||= !w(), A.overflow ||= A.lines.some(
      (I) => I.inkBounds[1] < b - 0.01 || I.inkBounds[1] + I.inkBounds[3] > y + 0.01
    );
    const _ = { ...M, top: R, height: E, font: g, width: A.width, layout: A };
    return R += E, _;
  });
}
function Kl(t, e) {
  return t === "saga" ? /^(I|II|III|IV)$/.test(e) ? Ot("saga", e) : null : Ot(
    "planeswalker",
    e.startsWith("+") ? "LoyaltyPlus" : e === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function Vl(t, e) {
  return K(t) === "saga" ? Ot("saga_textboxes", e === "Colourless" ? "Land" : e) : null;
}
function hf(t) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[j(t).boxes] ?? "#dededbf0";
}
function mf(t, e) {
  const { top: r, scale: n } = ws(K(e) === "planeswalker-large");
  t.save(), t.translate(0, r), t.scale(1, n), t.translate(0, -r), t.beginPath(), t.moveTo(66, r);
  const o = ft.rightInset;
  t.lineTo(448 - o, r), t.quadraticCurveTo(456 - o, r, 456 - o, r + 8), t.lineTo(456 - o, 613), t.bezierCurveTo(456 - o, 623, 420 - o, 629, 257, 629), t.bezierCurveTo(94, 629, 58, 623, 58, 613), t.lineTo(58, r + 8), t.quadraticCurveTo(58, r, 66, r), t.closePath(), t.clip(), t.fillStyle = hf(e), t.fillRect(58, r, 398 - o, 629 - r), t.restore();
}
function cf(t, e, r) {
  t.save(), t.fillStyle = Tt.colonInk, t.font = `${Tt.colonFontSize}px ${Tt.colonFontFamily}`, t.textAlign = "center", t.textBaseline = "alphabetic";
  const n = t.measureText(":");
  t.fillText(
    ":",
    e,
    r + Tt.colonOffsetY + (n.actualBoundingBoxAscent - n.actualBoundingBoxDescent) / 2
  ), t.restore();
}
function gf(t, e, r) {
  const n = K(e), o = n === "saga", s = Ft(e).rules, a = s[0] * T, i = s[1] * L, l = s[2] * T, d = s[3] * L;
  o && (t.fillStyle = "#e3d8bb", t.fillRect(a, i, l, d));
  const u = Vl(e, j(e).boxes), h = u ? r.get(u) : void 0;
  if (h && t.drawImage(h, a, i, l, d), !re(t)) return;
  const m = o ? yh(e) : uf(t, e);
  for (const [c, g] of m.entries()) {
    if (c > 0) {
      const y = m[c - 1]?.layout, p = g.layout && y ? Math.max(y.top + y.height + 3, Math.min(i + g.top, g.layout.top - 3)) : i + g.top;
      t.fillStyle = "#0002", t.fillRect(
        a + (o ? 0 : Tt.separatorLeft),
        p,
        l - (o ? 0 : Tt.separatorLeft),
        Tt.separatorHeight
      );
    }
    if (t.fillStyle = "#17140f", t.textAlign = "left", g.layout) Rt(t, g.layout, r);
    else {
      t.font = `${g.reminder ? "italic " : ""}${g.font}px "CardRenderer MTG MPlantin", Georgia`;
      const y = Xo(t, g.text, g.width, g.font).length * g.font;
      zi(
        t,
        g.text,
        a + g.left,
        i + g.top + (g.height - y) / 2,
        g.width,
        { size: g.font, italic: g.reminder },
        r
      );
    }
    const f = o ? 36 : Tt.badgeWidth, b = o ? 36 : Tt.badgeHeight;
    g.badges.forEach((y, p) => {
      const w = a + (o ? -18 : 0), S = i + g.top + g.height / 2 + (p - g.badges.length / 2) * b, v = Kl(n, y), C = v ? r.get(v) : null;
      if (C) {
        if (t.save(), !o) {
          const k = t.getTransform().a;
          t.shadowColor = "#0009", t.shadowBlur = 3 * k, t.shadowOffsetY = 2 * k;
        }
        t.drawImage(C, w, S, f, b), t.restore();
      } else
        t.fillStyle = "#29231c", t.fillRect(w, S, f, b);
      o ? C || (t.fillStyle = "white", t.textAlign = "center", t.textBaseline = "middle", t.font = 'bold 19px "CardRenderer MTG Beleren", Georgia', t.fillText(y, w + f / 2, S + b / 2, f - 3)) : (Bh(t, y, [w, S, f, b]), cf(
        t,
        w + f + Tt.colonOffsetX,
        S + b / 2
      ));
    });
  }
}
function ff(t, e) {
  Li(
    t,
    K(e) === "planeswalker-large",
    () => mf(t, e)
  );
}
const Zl = 0.7;
function pf(t, e, r, n = !1) {
  const [o, s, a, i] = [
    r[0] * T,
    r[1] * L,
    r[2] * T,
    r[3] * L - 1
  ], l = new Path2D();
  l.moveTo(o + 14, s), l.lineTo(o + a - 16, s), l.quadraticCurveTo(o + a, s, o + a, s + 26), l.lineTo(o + a, s + i - 7), l.quadraticCurveTo(o + a, s + i, o + a - 7, s + i), l.lineTo(o + 9, s + i), l.quadraticCurveTo(o - 2, s + i, o - 2, s + i - 9), l.quadraticCurveTo(o - 2, s + 17, o + 2, s + 9), l.quadraticCurveTo(o + 5, s, o + 14, s), l.closePath(), t.save(), t.fillStyle = "#191816", t.fill(l), t.shadowColor = "transparent", t.save(), t.clip(l);
  const d = e.width / a, u = [
    20 * d,
    e.height - (i - 4) * d,
    e.width - 40 * d,
    (i - 12) * d,
    o - 2,
    s,
    a + 2,
    i
  ];
  t.drawImage(e, ...u), n && (t.globalAlpha *= Zl, t.drawImage(e, ...u)), t.restore(), t.save(), t.clip(l), t.strokeStyle = "#0007", t.lineWidth = 3, t.stroke(l), t.restore(), t.strokeStyle = "#191816", t.lineWidth = 1.2, t.stroke(l), t.restore();
}
function bf(t, e, r) {
  if (!e.pinlines) return;
  const n = (i) => {
    const l = r.get(i);
    if (!l) throw Error(`Planar pinline asset unavailable: ${i}`);
    return l;
  }, o = () => {
    const i = B();
    i.width = 732, i.height = 1020;
    const l = i.getContext("2d");
    if (!l) throw Error("Missing Planar pinline composition context");
    return { canvas: i, context: l };
  }, s = o(), a = o();
  try {
    s.context.drawImage(n(e.pinlines.left), 0, 0, 732, 1020), a.context.drawImage(n(e.pinlines.right), 0, 0, 732, 1020), a.context.globalCompositeOperation = "destination-in";
    const i = a.context.createLinearGradient(732 * 0.47, 0, 732 * 0.53, 0);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), a.context.fillStyle = i, a.context.fillRect(0, 0, 732, 1020), s.context.drawImage(a.canvas, 0, 0), s.context.globalCompositeOperation = "destination-in", s.context.drawImage(n(e.pinlines.mask), 0, 0, 732, 1020), $o(t, s.canvas);
  } finally {
    s.canvas.width = s.canvas.height = 0, a.canvas.width = a.canvas.height = 0;
  }
}
function Da(t, e, r) {
  if (!Wt(t, e)) return { dx: 0, dy: 0, size: 1 };
  const n = t.frameTreatment === "colorshifted";
  return r === "title" ? n ? { dx: 0.25, dy: 0.75, size: 1.04 } : { dx: 1, dy: 0.75, size: 1.035 } : n ? { dx: -0.75, dy: -1.25, size: 1.03 } : { dx: 0.5, dy: 0, size: 1.025 };
}
const yf = 1.1;
function Ql(t) {
  return !t.setSymbol && ["m19", "m20", "m21"].includes(t.setCode?.toLowerCase() ?? "");
}
function td(t, e, r, n, o, s, a, i, l = 1) {
  const d = !r || r === "common", u = B(), h = 2, m = 4;
  u.width = Math.ceil((s + h * 2) * m), u.height = Math.ceil((a + h * 2) * m);
  const c = u.getContext("2d");
  c.scale(m, m), c.translate(h, h), c.drawImage(
    e,
    i[0] * e.width,
    i[1] * e.height,
    i[2] * e.width,
    i[3] * e.height,
    0,
    0,
    s,
    a
  ), c.globalCompositeOperation = "source-in";
  const g = r === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : r === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], f = c.createLinearGradient(0, a * 0.65, s, a * 0.35);
  f.addColorStop(0, g[0]), f.addColorStop(0.35, g[1]), f.addColorStop(0.6, g[2]), f.addColorStop(1, g[3]), c.fillStyle = d ? "#111111" : f, c.fillRect(0, 0, s, a), c.beginPath(), c.moveTo(s * 0.046, 0), c.lineTo(s * 0.953, 0), c.bezierCurveTo(
    s * 1.016,
    a * 0.38,
    s * 1.016,
    a * 0.62,
    s * 0.953,
    a
  ), c.lineTo(s * 0.046, a), c.bezierCurveTo(-s * 0.017, a * 0.62, -s * 0.017, a * 0.38, s * 0.046, 0), c.closePath(), c.globalCompositeOperation = "destination-over", c.fillStyle = d ? "#f8f8f5" : "#111111", c.fill(), c.globalCompositeOperation = "source-over", c.strokeStyle = d ? "#f8f8f5" : "#111111", c.lineWidth = l, c.stroke(), t.drawImage(
    u,
    n - h,
    o - h,
    u.width / m,
    u.height / m
  ), u.width = u.height = 0;
}
function wf(t, e, r, n) {
  const o = B();
  o.width = 732, o.height = 1020;
  try {
    const s = o.getContext("2d");
    if (!s) throw Error("Missing frame stock composition context");
    n ? (s.save(), s.scale(1.5, 1.5), $o(s, e, n === "colorshifted"), s.restore()) : s.drawImage(e, 0, 0, o.width, o.height), s.globalCompositeOperation = "source-in", s.fillStyle = r, s.fillRect(0, 0, o.width, o.height), t.drawImage(o, 0, 0, 488, 680);
  } finally {
    o.width = o.height = 0;
  }
}
const ur = (t) => [
  t[0] * T,
  t[1] * L,
  t[2] * T,
  t[3] * L
];
function Sf(t, e, r, n, o) {
  const s = xt(e);
  if (!s) throw Error("Missing replacement frame family.");
  const a = (N) => {
    const tt = r.get(N);
    if (!tt) throw Error(`Replacement frame asset unavailable: ${N}`);
    return tt;
  }, { rects: i } = s, l = e.frameAssetFamily === "eighth", d = tr(e, s.frame) ?? Et(e) ?? Pt(e.setCode, e.borderColor).border;
  if (t.save(), t.fillStyle = d, t.fillRect(0, 0, T, L), n && t.drawImage(n, 0, 0, T, L), _t(t, e, r, ur(i.art), o), o === "artwork") {
    t.restore();
    return;
  }
  if (Wo(e, s.frame) ? ru(t, a(s.frame)) : Wt(e, s.frame) ? $o(t, a(s.frame), e.frameTreatment === "colorshifted") : t.drawImage(a(s.frame), 0, 0, T, L), bf(t, s, r), s.rightFrame) {
    const N = B();
    N.width = 732, N.height = 1020;
    const tt = N.getContext("2d");
    tt.drawImage(a(s.rightFrame), 0, 0, N.width, N.height);
    const U = B();
    U.width = N.width, U.height = N.height;
    const Z = U.getContext("2d"), Kt = (or, pe) => {
      const Yt = Z.createLinearGradient(U.width * or, 0, U.width * pe, 0);
      return Yt.addColorStop(0, "#0000"), Yt.addColorStop(1, "#000"), Yt;
    };
    Z.fillStyle = Kt(0.47, 0.53), Z.fillRect(0, 0, U.width, U.height);
    const rt = l ? [0.08, 0.627, 0.84, 0.29] : [0.071, 0.629, 0.858, 0.294], [ce, vt, ge, se] = rt, Vt = ce * U.width, Dt = vt * U.height, fe = ge * U.width, Le = se * U.height;
    Z.clearRect(Vt, Dt, fe, Le), Z.fillStyle = Kt(0.27, 0.73), Z.fillRect(Vt, Dt, fe, Le), tt.globalCompositeOperation = "destination-in", tt.drawImage(U, 0, 0), t.drawImage(N, 0, 0, T, L), N.width = N.height = 0, U.width = U.height = 0;
  }
  d !== "#090806" && wf(
    t,
    a(s.border),
    d,
    Wt(e, s.frame) ? e.frameTreatment === "colorshifted" ? "colorshifted" : "planar" : void 0
  ), wl(t, e, r), t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
  const u = Tn(e), h = l ? "CardRenderer MTG Matrix" : "CardRenderer MTG Beleren", [m, c, g, f] = ur(i.title), b = e.manaSymbols ?? [], { size: y } = s.mana, p = s.mana.gap + (u?.spacing ?? 0), w = s.mana.right * T, S = b.length * y + Math.max(0, b.length - 1) * p, v = [
    w - S,
    s.mana.center * L - y / 2,
    S,
    y
  ], C = ke(v, u);
  t.font = `bold ${s.titleSize}px "${h}", Georgia`, t.save(), l && t.translate(...gs(e, "eighth"));
  const k = Da(e, s.frame, "title");
  t.translate(k.dx, k.dy), za(t, e, s.frame), at(
    t,
    e.name,
    m,
    c + f / 2,
    b.length ? C[0] - m - 8 : g,
    s.titleSize * k.size,
    !0,
    1,
    h,
    e.frameTreatment === "colorshifted" ? 0.5 : 0
  ), t.restore(), Y(
    t,
    e,
    "manaCost",
    () => He(t, v, u, () => {
      b.forEach(
        (N, tt) => st(
          t,
          N,
          w - S + tt * (y + p),
          s.mana.center * L - y / 2,
          y,
          r,
          !0,
          u
        )
      );
    })
  );
  const R = Q(e), M = r.get(R ?? ""), x = ue(e), E = M ? Math.min(
    s.symbol.width * T / (M.width * x[2]),
    s.symbol.height * L / (M.height * x[3])
  ) : 0, $ = M ? M.width * x[2] * E : 0, A = M ? M.height * x[3] * E : 0, _ = Kh(e, s.frame, R) ?? Ec(e, R, [
    s.symbol.right * T - $,
    s.symbol.center * L - A / 2,
    $,
    A
  ]), I = ke(_, e.symbolAdjustment?.set), [q, H, it, jt] = ur(i.type);
  t.save();
  const et = Da(e, s.frame, "type");
  if (t.translate(et.dx, et.dy), za(t, e, s.frame), t.font = `bold ${s.typeSize}px "${h}", Georgia`, at(
    t,
    e.typeLine ?? "",
    q,
    H + jt / 2,
    M ? I[0] - q - 7 : it,
    s.typeSize * et.size,
    !0,
    1,
    h,
    e.frameTreatment === "colorshifted" ? 0.5 : 0,
    e.textInk,
    "type"
  ), t.restore(), Y(
    t,
    e,
    "setSymbol",
    () => He(t, _, e.symbolAdjustment?.set, () => {
      if (M) {
        const N = Fl(e);
        Ut(R) || e.setSymbol ? t.drawImage(M, ..._) : Ql(e) ? td(t, M, e.rarity, ..._, x, 1.5) : N ? _l(t, M, N, e.rarity, ..._, x, !1) : oe(t, M, e.setCode, e.rarity, ..._, x);
      }
    })
  ), ui(t, e, r) || Rt(t, Sl(t, e), r), e.power != null && e.toughness != null && t.drawImage(a(s.pt), ...ur(i.stats)), l) {
    tu(t, e, r, s.frame), t.restore();
    return;
  }
  if (e.power != null && e.toughness != null) {
    const [N, tt, U, Z] = ur(i.stats);
    t.font = `bold 25px "${h}", Georgia`, t.textAlign = "center", t.textBaseline = "middle", mt(
      t,
      `${e.power}/${e.toughness}`,
      N + U * 0.52,
      tt + Z * 0.52,
      U * 0.85,
      e.textInk
    );
  }
  bo(t, e), t.restore();
}
let Na = null;
function vf(t) {
  if (t.frameAssetFamily !== "eighth") return Promise.resolve();
  const e = Na ??= Promise.all([
    lt().load('700 24px "CardRenderer MTG Matrix"'),
    lt().load('700 29px "CardRenderer MTG Matrix Small Caps"')
  ]).then((r) => {
    if (r.some((n) => !n.length || n.some((o) => o.status !== "loaded")))
      throw Error("Replacement Eighth Edition frames need card-glint/magic/fonts.css.");
  }).catch((r) => {
    throw Na = null, r;
  });
  return Promise.all([e, Q0(t, xt(t)?.frame ?? "")]).then(
    () => {
    }
  );
}
function za(t, e, r) {
  e.frameTreatment === "colorshifted" && (t.fillStyle = "#fff", t.shadowColor = tr(e, r) ?? "#000", t.shadowOffsetX = -21e-4 * T, t.shadowOffsetY = 15e-4 * L, t.shadowBlur = 0);
}
function Cf(t, e, [r, n, o, s]) {
  const a = e.height * o / e.width;
  t.save(), t.beginPath(), t.rect(r, n, o, s / 2), t.clip(), t.drawImage(e, r, n + s - a + 1, o, a), t.restore();
}
function kf(t, [e, r, n, o], s) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(s)) return;
  t.save(), t.shadowColor = "transparent";
  const a = t.createLinearGradient(e, 0, e + n, 0);
  a.addColorStop(0, "rgba(255,255,255,0)"), a.addColorStop(0.025, "rgba(255,255,255,0.2)"), a.addColorStop(0.975, "rgba(255,255,255,0.2)"), a.addColorStop(1, "rgba(255,255,255,0)"), t.fillStyle = a, t.fillRect(e, r + o - 4, n, 2.3), t.restore();
}
const le = /* @__PURE__ */ new Map();
function ed(t) {
  if (!(!t.retired || t.users)) {
    if (!t.sources) {
      t.controller.abort();
      return;
    }
    URL.revokeObjectURL(t.sources.original), t.sources.backing && URL.revokeObjectURL(t.sources.backing), t.sources.outlined && URL.revokeObjectURL(t.sources.outlined), t.sources = void 0;
  }
}
function w1() {
  for (const t of le.values())
    t.retired = !0, ed(t);
  le.clear();
}
async function Tf(t, e) {
  e.throwIfAborted();
  let r = le.get(t);
  if (!r) {
    const l = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const d = await Ro(t, {
          mode: "cors",
          signal: l.controller.signal
        });
        if (!d.ok) throw Error(`Symbol source ${d.status}: ${t}`);
        const u = await vg(t, await d.blob()), h = await bg(t, u), m = await Cg(t, u);
        l.controller.signal.throwIfAborted();
        const c = URL.createObjectURL(u);
        let g, f;
        try {
          g = h ? URL.createObjectURL(h) : void 0, f = m ? URL.createObjectURL(m) : void 0;
          const b = { original: c, backing: g, outlined: f };
          return l.sources = b, b;
        } catch (b) {
          throw URL.revokeObjectURL(c), g && URL.revokeObjectURL(g), f && URL.revokeObjectURL(f), b;
        }
      })
    };
    l.promise = l.promise.catch((d) => {
      throw le.get(t) === l && le.delete(t), d;
    }), le.set(t, l), r = l;
  }
  r.users++;
  const n = r;
  let o = !1;
  const s = () => {
    o || (o = !0, n.users--, !n.users && !n.sources && (n.retired = !0, le.get(t) === n && le.delete(t)), ed(n));
  };
  let a = () => {
  };
  const i = new Promise((l, d) => {
    a = () => {
      s(), d(e.reason);
    }, e.addEventListener("abort", a, { once: !0 });
  });
  try {
    const l = await Promise.race([n.promise, i]);
    return e.throwIfAborted(), { sources: l, release: s };
  } catch (l) {
    throw s(), l;
  } finally {
    e.removeEventListener("abort", a);
  }
}
async function Mf(t, e) {
  e.throwIfAborted();
  const r = [...new Set(t.filter((l) => !!l))], n = [], o = /* @__PURE__ */ new Map(), s = () => {
    for (const l of n) l.release();
    n.length = 0;
  }, i = (await Promise.allSettled(
    r.map(async (l) => {
      if (!pg(l) && !Sg(l)) {
        o.set(l, l);
        return;
      }
      const d = await Tf(l, e);
      n.push(d), o.set(l, d.sources.original), d.sources.backing && o.set(zl(l), d.sources.backing), d.sources.outlined && o.set(Yl(l), d.sources.outlined);
    })
  )).find((l) => l.status === "rejected");
  if (i?.status === "rejected")
    throw s(), i.reason;
  return e.aborted && (s(), e.throwIfAborted()), { urls: [...new Set(o.values())], aliases: o, dispose: s };
}
function Rf(t, e) {
  const r = /* @__PURE__ */ new Map();
  for (const [n, o] of t) {
    const s = e.get(o);
    s && r.set(n, s);
  }
  return r;
}
async function xf(t, e) {
  return e.throwIfAborted(), Ro(t, { signal: e, mode: "cors" });
}
function Af(t) {
  if (t.startsWith(`${P}/img/frames/m15/holoStamps/`) || t.startsWith(`${P}/img/frames/planeswalker/holo/`) || t.startsWith(P) && /\/saga\/(sagaChapter|sagaDivider|sagaMidStripe|stamp)\.png$/.test(t))
    return;
  if (t.startsWith(`${P}/data/images/cardImages/saga/`)) return 768;
  if (t.startsWith(`${P}/img/frames/future/regular/futurePT`)) return;
  if (t.startsWith(`${P}/img/frames/`) && t.endsWith(".png"))
    return /\/pt\/|\/m15PT/.test(t) ? 256 : 768;
  if (t.startsWith(`${qe}/img/frames/`) && t.endsWith(".png")) return 768;
  const e = t.startsWith(`${ze}/img/`) ? t.slice(`${ze}/img/`.length) : "";
  return e === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    e
  ) ? 768 : void 0;
}
async function rd(t, e) {
  const r = await Mf(t, e), n = r.urls, o = /* @__PURE__ */ new Map();
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, n.length) }, async () => {
        for (; s < n.length && !e.aborted; ) {
          const i = n[s++];
          try {
            const l = await xf(i, e);
            if (!l.ok) continue;
            const d = await l.blob(), u = await pd(d, e, Af(i));
            e.aborted ? u.close() : o.set(i, u);
          } catch {
          }
        }
      })
    );
  } finally {
    r.dispose();
  }
  const a = Rf(r.aliases, o);
  return {
    images: a,
    dispose: () => {
      for (const i of o.values()) i.close();
      o.clear(), a.clear();
    }
  };
}
function nd(t) {
  if (t = me(t), t.frameTemplate)
    return [
      ...eh(t),
      t.illustration,
      Q(t),
      ...zt(
        t.frameTemplate === "future" ? { ...t, manaSymbols: t.manaSymbols?.filter((a) => !vn(a)) } : t
      ),
      ...(t.faces ?? []).flatMap(zt)
    ];
  if (kn(t))
    return [
      ...ml(t),
      t.illustration,
      Q(t),
      ...zt(t),
      ...zt(rr(t))
    ];
  if (Lr(t))
    return [
      ...hl(t),
      t.illustration,
      Q(t),
      ...zt(t),
      ...zt(t.faces[1])
    ];
  if (Ae(t))
    return [
      ...Zi(t),
      ...Gt(t).flatMap((a) => [
        a.face.illustration,
        ...zt(a.face)
      ]),
      Q(Gt(t)[0].face)
    ];
  const e = Xt(t);
  if (e)
    return [
      ...Gt(t).flatMap((a, i) => [
        ...Sh(a.face, e, Xe(t) && e === "eighth", i),
        a.face.illustration,
        Q(a.face),
        ...zt(a.face)
      ]),
      ...e === "eighth" && Xe(t) ? Rm(t) : []
    ];
  const r = su(t);
  if (r)
    return [
      ...r,
      Ce(t)?.image,
      Ce(t)?.rightImage,
      t.illustration,
      Q(t),
      ...zt(t)
    ];
  if (dt(t)) return P0(t);
  if (K(t) === "saga")
    return [...mh(t), t.illustration, Q(t), ...zt(t)];
  const n = Gt(t);
  if (n.length) return n.flatMap((a) => nd(a.face));
  const o = j(t), s = he(o, K(t));
  return [
    Ce(t)?.image,
    Ce(t)?.rightImage,
    K(t) === "normal" ? wn(t) : null,
    ...ef(t),
    ...K(t).startsWith("planeswalker") ? [Bl(
      K(t) === "planeswalker-large",
      El(o.boxes)
    ).source] : [],
    s.background,
    s.frame,
    s.boxes,
    s.pt,
    Vl(t, o.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(K(t)) ? Er(t).flatMap(
      (a) => a.badges.map((i) => Kl(K(t), i))
    ) : [],
    o.legendary ? s.crown : null,
    t.illustration,
    Q(t),
    ...zt(t)
  ];
}
let Ya = null;
function qa() {
  return Ya ??= Promise.all([
    lt().load('24px "CardRenderer MTG Beleren"'),
    lt().load('700 24px "CardRenderer MTG Beleren"'),
    lt().load('700 11px "CardRenderer MTG Beleren Small Caps"'),
    lt().load('24px "CardRenderer MTG MPlantin"'),
    lt().load('italic 24px "CardRenderer MTG MPlantin"'),
    lt().load('14px "CardRenderer MTG Relay"'),
    lt().load('14px "CardRenderer MTG Artist Credit"')
  ]).then((t) => {
    if (t.some((e) => !e.length || e.some((r) => r.status !== "loaded")))
      throw Error(
        "Magic fonts are unavailable. Load card-glint/magic/fonts.css before preparing cards."
      );
  }).catch((t) => {
    throw Ya = null, t;
  });
}
function Hr(t) {
  return Ft(t).art;
}
const Ha = /* @__PURE__ */ new WeakMap(), Xr = ([t, e, r, n]) => [t, 1 - e - n, t + r, 1 - e], Lf = [Xr(Ft({ name: "" }).art), [0, 0, 0, 0]];
function S1(t) {
  if (!t) return Lf;
  const e = Ha.get(t);
  if (e) return e;
  const r = Gt(t), n = r.length ? [
    Xr(Qs(r[0], Hr(r[0].face))),
    Xr(Qs(r[1], Hr(r[1].face)))
  ] : [Xr(Hr(t)), [0, 0, 0, 0]];
  return Ha.set(t, n), n;
}
const Ef = new Br(4 * 1024 * 1024), Xa = /* @__PURE__ */ new WeakMap();
let Bf = 0;
async function If(t, e, r, n) {
  if (n.throwIfAborted(), r !== void 0 && !["auto", "alpha", "ink"].includes(r))
    throw Error("Invalid set symbol mask mode");
  if (!(r === "ink" || (r === void 0 || r === "auto") && Ut(e))) return { value: t, release() {
  } };
  let s = Xa.get(t);
  s === void 0 && Xa.set(t, s = ++Bf);
  const a = Math.min(1, 512 / Math.max(t.width, t.height)), i = Math.max(1, Math.round(t.width * a)), l = Math.max(1, Math.round(t.height * a));
  return Ef.acquire(
    JSON.stringify(["set-symbol-ink-v1", s, i, l]),
    i * l * 4,
    async () => {
      const d = B();
      d.width = i, d.height = l;
      try {
        const u = d.getContext("2d", { willReadFrequently: !0 });
        if (!u) throw Error("Set symbol mask needs Canvas2D");
        u.drawImage(t, 0, 0, i, l);
        const h = u.getImageData(0, 0, i, l);
        for (let m = 0; m < h.data.length; m += 4) {
          const c = h.data[m] * 0.2126 + h.data[m + 1] * 0.7152 + h.data[m + 2] * 0.0722;
          h.data[m + 3] = Math.round(h.data[m + 3] * (1 - c / 255)), h.data[m] = h.data[m + 1] = h.data[m + 2] = 255;
        }
        return u.putImageData(h, 0, 0), await createImageBitmap(d);
      } finally {
        d.width = d.height = 0;
      }
    },
    n
  );
}
async function Of(t, e, r, n, o, s, a = rd, i) {
  return od(t, e, r, n, {
    threshold: o,
    resolveEtching: i,
    beforePaint: s,
    loadImages: a,
    height: L
  });
}
async function od(t, e, r, n, o) {
  const { threshold: s, beforePaint: a, loadImages: i, height: l } = o, d = Gt(e);
  if (d.length) {
    for (const S of d) {
      t.save();
      try {
        fl(t, S), await od(t, S.face, r, n, {
          ...o,
          height: S.height * T / S.width
        });
      } finally {
        t.restore();
      }
    }
    return;
  }
  if (e.illustration && o.resolveEtching) {
    let S;
    try {
      const v = await o.resolveEtching(e, r, n, s, a);
      S = await i([v, e.illustration], n);
      const C = S.images.get(v ?? "");
      if (C && !n.aborted) {
        await a?.(), n.throwIfAborted();
        const k = e.frameTemplate === "battle", R = k ? 523 : T, M = k ? 375 : l, x = Ft(e).art, E = k ? rn(x) : [
          x[0] * R,
          x[1] * M,
          x[2] * R,
          x[3] * M
        ], $ = S.images.get(e.illustration) ?? C;
        t.save(), k && (t.translate(0, l), t.rotate(-Math.PI / 2), t.scale(l / 523, T / 375)), t.beginPath();
        const A = Hr(e), _ = k ? rn(A) : [
          A[0] * R,
          A[1] * M,
          A[2] * R,
          A[3] * M
        ];
        t.rect(..._), t.clip(), t.imageSmoothingQuality = "low";
        const I = ln(e, E, R, M, k ? -90 : 0);
        if (e.illustrationCrop) {
          const q = e.illustrationCrop, H = dn(
            $.width * q[2],
            $.height * q[3],
            I,
            e.artPlacement
          );
          t.drawImage(
            C,
            q[0] * C.width,
            q[1] * C.height,
            q[2] * C.width,
            q[3] * C.height,
            ...H
          );
        } else
          t.drawImage(
            C,
            ...dn($.width, $.height, I, e.artPlacement)
          );
        t.restore();
      }
    } catch {
    } finally {
      S?.dispose();
    }
  }
  if (n.throwIfAborted(), !e.setCode || e.printingElements?.setSymbol?.hidden) return;
  const [u, h, m, c] = Ft(e).stamp, g = u * T, f = h * l, b = m * T, y = c * l, p = e0(e), w = await i([p], n);
  try {
    await a?.(), n.throwIfAborted();
    const S = p ? w.images.get(p) : null;
    t.save();
    try {
      if (e.printingElements?.setSymbol?.offset && t.translate(...e.printingElements.setSymbol.offset), t.globalAlpha = 0.68, S) {
        const v = await If(S, p, e.setSymbolMask, n);
        try {
          n.throwIfAborted();
          const C = Math.min(b / v.value.width, y / v.value.height);
          t.drawImage(
            v.value,
            g + (b - v.value.width * C) / 2,
            f + (y - v.value.height * C) / 2,
            v.value.width * C,
            v.value.height * C
          );
        } finally {
          v.release();
        }
      } else
        t.translate(g, f), t.scale(b / 100, y / 100), t.fillStyle = "white", t.fill(new Path2D(vd)), t.font = "bold 43px Georgia", t.textAlign = "center", t.textBaseline = "alphabetic", t.fillText(Td(e.setCode), 50, 65);
    } finally {
      t.restore();
    }
  } finally {
    w.dispose();
  }
}
function $f(t) {
  return t.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const Gf = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, Ja = /* @__PURE__ */ new WeakMap();
function Pf(t, e) {
  let r = Ja.get(e);
  if (r || (r = new Path2D(e.path), Ja.set(e, r)), t.save(), e.viewBox) {
    const [n, o, s, a] = e.viewBox;
    t.scale(24 / s, 24 / a), t.translate(-n, -o);
  }
  e.transform && t.transform(...e.transform), e.filled ? (t.fillStyle = t.strokeStyle, t.fill(r)) : t.stroke(r), t.restore();
}
function Ka(t, e, r, n, o = !1) {
  const s = T * 0.105, a = T * 0.015, i = Math.floor(T * 0.9 / (s + a));
  if (e.forEach((c, g) => {
    t.save(), t.translate(
      T * 0.05 + g % i * (s + a),
      L * 0.13 + Math.floor(g / i) * (s + a)
    ), t.fillStyle = "#17201fed", t.strokeStyle = "#c6af7977", t.lineWidth = 1, t.beginPath(), t.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2), t.fill(), t.stroke(), t.translate(s * 0.14, s * 0.14), t.scale(s * 0.72 / 24, s * 0.72 / 24), t.strokeStyle = "#f3e9cf", t.lineWidth = 1.8, t.lineCap = "round", t.lineJoin = "round", Pf(t, c), t.restore();
  }), r?.power == null || r.toughness == null) return;
  t.save();
  const l = Gf[o ? "inspect" : "table"], d = T * l.width, u = L * l.height, h = T * (1 - l.right - l.width), m = L * (1 - l.bottom - l.height);
  n ? t.drawImage(n, h, m, d, u) : (t.fillStyle = "#eee5cf", t.strokeStyle = "#746854", t.lineWidth = 2, t.beginPath(), t.roundRect(
    h + d * (o ? 0.14 : 0.1),
    m + u * (o ? 0.19 : 0.18),
    d * (o ? 0.72 : 0.8),
    u * (o ? 0.62 : 0.64),
    u * 0.12
  ), t.fill(), t.stroke()), t.font = `bold ${T * (o ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.fillText(
    `${r.power}/${r.toughness}`,
    h + d / 2,
    o ? m + u / 2 - T * 0.01 : m + u * 0.48,
    d * 0.72
  ), t.restore();
}
function Wf(t) {
  const e = typeof t == "number" ? t : t === "table" ? 244 : t === "native" ? 488 : t === "inspect" ? 732 : NaN, r = Math.round(e * L / T);
  if (!Number.isInteger(e) || e < 1 || r < 1 || e * r > 4194304)
    throw RangeError("Invalid card texture tier");
  return [e, r];
}
function v1(t) {
  return t.currentStats?.power != null && t.currentStats.toughness != null && t.statusLayout !== "inspect" ? { ...t, statusLayout: "inspect" } : t;
}
function C1(t, e) {
  if (t.custom)
    return JSON.stringify([
      "custom-face-v1",
      t.custom.key,
      e,
      t.layer ?? "face",
      t.layer === "etching" ? t.etchThreshold ?? 20 : null
    ]);
  const r = t.face, n = t.layer === "etching" ? void 0 : T0(r), o = To(r, t.layer === "etching"), s = t.currentStats?.power != null && t.currentStats.toughness != null ? [t.currentStats.power, t.currentStats.toughness] : null;
  return JSON.stringify([
    ze,
    P,
    "canvas-face-v148",
    ...n ? [n] : [],
    ...t.layer !== "etching" && r.setCode?.toLowerCase() === "lea" && r.wordingMode !== "oracle" ? [q0] : [],
    ...K(r).startsWith("planeswalker") ? [yo] : [],
    ...Q(r)?.startsWith(`${P}/img/setSymbols/official/m15-`) && !r.setSymbol && r.rarity !== "common" ? ["m15-no-added-rim-v1"] : [],
    ["silhouette-v2", Wl(r)],
    K0(r),
    t.paintLayer ?? null,
    t.rulesText !== !1,
    e,
    t.printingId,
    t.layer === "etching" ? null : t.printedImage,
    o,
    t.layer ?? "face",
    t.layer === "etching" ? t.etchThreshold ?? 14 : null,
    t.layer === "etching" ? null : [
      (t.emblems ?? []).map((a) => [
        a.path,
        a.viewBox ?? null,
        a.transform ?? null,
        !!a.filled
      ]),
      s,
      s ? t.statusLayout ?? e : null
    ]
  ]);
}
function To(t, e) {
  const r = [
    t.printingElements,
    t.collectorTotal,
    t.collectorLanguage,
    t.collectorSetCode,
    ...t.calibration !== void 0 ? [["printing-calibration-v1", t.calibration]] : []
  ], n = r.some((s) => s !== void 0) ? [["printing-elements-v1", ...r]] : [], o = Gt(t);
  return o.length ? [
    t.layout,
    ...n,
    t.artist ?? null,
    t.collectorNumber ?? null,
    t.legalText ?? null,
    t.borderColor ?? null,
    o.map((s) => [s.x, s.y, s.width, s.height, s.rotation, To(s.face, e)]),
    !e && ds(t),
    !e && el(t),
    ...!e && t.printingOmissions?.length ? [t.printingOmissions] : [],
    ...!e && t.blackBorderLift ? [["border-ink", t.blackBorderLift]] : []
  ] : e ? [
    ...t.printingElements?.setSymbol?.hidden ? [["hidden-set-symbol"]] : [],
    ...t.printingElements?.setSymbol?.offset ? [["set-symbol-offset", t.printingElements.setSymbol.offset]] : [],
    t.illustration ?? null,
    t.etchedIllustration ?? null,
    t.illustrationCrop ?? null,
    t.illustrationPlacement ?? null,
    ...t.artPlacement ? [["art-placement-v1", t.artPlacement]] : [],
    t.setCode ?? null,
    t.setSymbol ?? null,
    t.setSymbolSource ?? null,
    ["set-symbol-mask-v1", t.setSymbolMask ?? "auto"],
    Ft(t)
  ] : [
    ...n,
    dt(t) ? [Qt(t), Lt(t)] : null,
    t.borderColor ?? null,
    t.frameAssetFamily ?? null,
    t.frameTreatment ?? null,
    t.frameTemplate ?? null,
    t.futureTreatment ?? null,
    t.defense ?? null,
    t.faces?.map((s) => To(s, e)) ?? null,
    t.name,
    t.manaSymbols ?? [],
    t.symbolAdjustment ?? null,
    t.typeLine ?? "",
    t.canonicalTypeLine ?? null,
    t.rulesText ?? "",
    t.rulesParagraphs ?? null,
    t.wordingMode ?? null,
    t.symbolStyle ?? null,
    t.colorCalibration ?? null,
    t.rulesAlignment ?? null,
    t.illustration ?? null,
    t.illustrationCrop ?? null,
    t.illustrationPlacement ?? null,
    ...t.artPlacement ? [["art-placement-v1", t.artPlacement]] : [],
    rf(t),
    t.artist ?? null,
    t.watermark ?? null,
    t.collectorNumber ?? null,
    t.collectorFormat ?? null,
    t.legalText === void 0 ? ["default"] : t.legalText,
    t.setCode ?? null,
    t.setSymbol ?? null,
    t.setSymbolSource ?? null,
    t.rarity ?? "common",
    t.securityStamp ?? "default",
    t.textInk ?? null,
    t.power ?? null,
    t.toughness ?? null,
    t.loyalty ?? null,
    t.reverseStats ?? null,
    t.layout ?? null,
    Ft(t),
    j(t),
    ...t.printingOmissions?.length ? [t.printingOmissions] : [],
    ...t.blackBorderLift ? [["border-ink", t.blackBorderLift]] : []
  ];
}
function Ff(t) {
  return B(Wf(t));
}
async function k1(t, e, r, n) {
  if (r.throwIfAborted(), n?.output === "r8" && t.layer !== "etching")
    throw Error("R8 composition requires the etching layer");
  const o = async (i) => {
    if (n?.output !== "r8") {
      const l = await md(i, n?.output === "bitmap");
      return r.aborted && (jr(l), r.throwIfAborted()), l;
    }
    try {
      return r.throwIfAborted(), J0(i, "alpha");
    } finally {
      jr(i);
    }
  };
  if (t = { ...t, face: me(t.face) }, hs(t.face), Ii(t.face), Ho(t.face), t.custom) {
    await n?.beforePaint?.(), r.throwIfAborted();
    const i = await t.custom.compose(
      e,
      r,
      t.layer ?? "face",
      t.etchThreshold
    );
    return r.aborted && (jr(i), r.throwIfAborted()), o(i);
  }
  const s = n?.loadImages ?? rd, a = Ff(e);
  try {
    const i = a.getContext("2d", {
      willReadFrequently: !!n?.cpuPixels
    });
    if (!i) throw new Error("Card composition needs Canvas2D.");
    if (i.imageSmoothingEnabled = !0, i.imageSmoothingQuality = "high", i.scale(a.width / T, a.height / L), t.layer === "etching")
      return await Of(
        i,
        t.face,
        t.printingId,
        r,
        t.etchThreshold,
        n?.beforePaint,
        s,
        n?.resolveEtching
      ), await o(a);
    i.fillStyle = "#090806", i.fillRect(0, 0, T, L);
    const l = t.currentStats?.power != null && t.currentStats.toughness != null ? he(j(t.face)).pt : null;
    if (t.printedImage) {
      const g = e !== "table" ? $f(t.printedImage) : t.printedImage;
      l && await (n?.loadFonts ?? qa)();
      const f = await s(l ? [g, l] : [g], r);
      try {
        const b = f.images.get(g);
        if (b && !r.aborted) {
          if (await n?.beforePaint?.(), r.throwIfAborted(), i.drawImage(b, 0, 0, T, L), t.paintLayer !== "artwork" && t.face.blackBorderLift && (t.face.borderColor ?? "black") === "black") {
            if (!Number.isFinite(t.face.blackBorderLift) || t.face.blackBorderLift < 0 || t.face.blackBorderLift > 0.2)
              throw Error("Invalid black border lift");
            const y = Math.round(t.face.blackBorderLift * 255), p = T * 0.035;
            i.save(), i.globalCompositeOperation = "lighten", i.fillStyle = `rgb(${y},${y},${y})`, i.beginPath(), i.rect(0, 0, T, L), i.rect(p, p, T - 2 * p, L - 2 * p), i.fill("evenodd"), i.restore();
          }
          return Ka(
            i,
            t.emblems ?? [],
            t.currentStats,
            l ? f.images.get(l) : void 0,
            t.statusLayout === "inspect" || e === "inspect"
          ), Va(i, t.face), await o(a);
        }
      } finally {
        f.dispose();
      }
    }
    t.paintLayer !== "artwork" && await Promise.all([
      (n?.loadFonts ?? qa)(),
      Xt(t.face) ? Om(t.face) : vf(t.face),
      Xh(t.face),
      K(t.face) === "saga" ? Wm() : Promise.resolve(),
      Lr(t.face) || kn(t.face) ? Al() : Promise.resolve(),
      dt(t.face) || Xt(t.face) === "old" || Rr(t.face, "W") === "historic-font" ? (n?.loadRetroFont ?? Zg)() : Promise.resolve()
    ]), r.throwIfAborted();
    const d = await s(nd(t.face), r);
    let u, h, m, c;
    try {
      t.paintLayer !== "artwork" && (u = await fc(t.face, d.images, r)), t.paintLayer !== "artwork" && (h = await Ac(t.face, u?.images ?? d.images, r)), m = t.paintLayer === "artwork" ? { images: d.images, dispose() {
      } } : await rm(
        t.face,
        h?.images ?? u?.images ?? d.images,
        r
      ), t.paintLayer !== "artwork" && (c = await Nm(t.face, m.images, r)), await n?.beforePaint?.(), r.throwIfAborted();
      const g = c?.images ?? m.images;
      if (zd(
        i,
        t.rulesText !== !1,
        () => qu(
          i,
          t.face,
          () => sd(
            i,
            t.face,
            g,
            L,
            !1,
            n?.underArt,
            t.paintLayer
          )
        )
      ), t.paintLayer !== "artwork" && t.face.blackBorderLift && (t.face.borderColor ?? "black") === "black") {
        if (!Number.isFinite(t.face.blackBorderLift) || t.face.blackBorderLift < 0 || t.face.blackBorderLift > 0.2)
          throw Error("Invalid black border lift");
        const f = Math.round(t.face.blackBorderLift * 255), b = T * 0.035;
        i.save(), i.globalCompositeOperation = "lighten", i.fillStyle = `rgb(${f},${f},${f})`, i.beginPath(), i.rect(0, 0, T, L), i.rect(b, b, T - 2 * b, L - 2 * b), i.fill("evenodd"), i.restore();
      }
      return Ka(
        i,
        t.emblems ?? [],
        t.currentStats,
        l ? d.images.get(l) : void 0,
        t.statusLayout === "inspect" || e === "inspect"
      ), Va(i, t.face), await o(a);
    } finally {
      c?.dispose(), m?.dispose(), h?.dispose(), u?.dispose(), d.dispose();
    }
  } catch (i) {
    throw a.width = a.height = 0, i;
  }
}
function Va(t, e) {
  t.save(), t.setTransform(
    t.canvas.width / T,
    0,
    0,
    t.canvas.height / L,
    0,
    0
  ), t.globalCompositeOperation = "destination-in", t.globalAlpha = 1, t.shadowColor = "transparent", t.filter = "none", t.fillStyle = "#000", t.beginPath(), t.roundRect(0, 0, T, L, Wl(e) * T), t.fill(), t.restore();
}
function sd(t, e, r, n = L, o = !1, s, a) {
  if (e = me(e), e.frameTemplate) {
    Hh(t, e, r, a, s);
    return;
  }
  if (kn(e)) {
    Cm(t, e, r, s, a);
    return;
  }
  if (Lr(e)) {
    fm(t, e, r, s, a);
    return;
  }
  if (Ae(e)) {
    _m(t, e, r, s, a);
    return;
  }
  if (Xt(e)) {
    Im(t, e, r, s, a);
    return;
  }
  if (e.frameAssetFamily) {
    Sf(t, e, r, s, a);
    return;
  }
  if (dt(e)) {
    Kg(t, e, r, s, a);
    return;
  }
  if (K(e) === "saga") {
    Pm(t, e, r, s, a);
    return;
  }
  const i = Gt(e);
  if (i.length) {
    t.fillStyle = Et(e) ?? Pt(e.setCode, e.borderColor).border, t.fillRect(0, 0, T, L);
    for (const G of i)
      t.save(), fl(t, G), sd(
        t,
        G.face,
        r,
        G.height * T / G.width,
        !0,
        s,
        a
      ), t.restore();
    if (a === "artwork") return;
    bo(t, e), ds(e) && re(t) && (t.font = '14px "CardRenderer MTG MPlantin", Georgia', t.fillStyle = "white", t.textAlign = "center", t.textBaseline = "middle", t.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      T / 2,
      L - 12,
      T * 0.9
    ));
    return;
  }
  const l = (G) => [
    G[0] * T,
    G[1] * n,
    G[2] * T,
    G[3] * n
  ];
  t.fillStyle = Et(e) ?? Pt(e.setCode, e.borderColor).border, t.fillRect(0, 0, T, n);
  const d = Ft(e), u = K(e);
  if (a === "artwork") {
    _t(t, e, r, l(d.art), a);
    return;
  }
  const h = j(e), m = he(h, u), g = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[h.boxes] ?? "#827d72", f = (G, J, Ct = "top") => {
    const Ee = r.get(G);
    if (!Ee) return !1;
    const [be, An, Ln, En] = l(J);
    t.save(), t.beginPath(), t.rect(be, An, Ln, En), t.clip();
    const Ss = Ct === "stretch" ? En : Ee.height * Ln / Ee.width;
    return t.drawImage(
      Ee,
      be,
      Ct === "bottom" ? An + En - Ss : An,
      Ln,
      Ss
    ), t.restore(), !0;
  }, [b, y, p, w] = l(h.legendary ? d.legendaryBackground : d.background);
  if (t.save(), t.beginPath(), t.roundRect(b, y, p, w, [
    { x: p * 0.01282, y: w * 962e-5 },
    { x: p * 0.01282, y: w * 962e-5 },
    { x: p * 0.06838, y: w * 0.05128 },
    { x: p * 0.06838, y: w * 0.05128 }
  ]), t.clip(), o) {
    const G = g.slice(1).match(/../g).map(
      (J, Ct) => Math.round(parseInt(J, 16) * 0.62 + [244, 236, 217][Ct] * 0.38)
    );
    t.fillStyle = `rgb(${G.join(",")})`, t.fillRect(b, y, p, w);
  }
  const S = r.get(m.background), v = u.startsWith("planeswalker");
  if (S && v ? ja(t, S, b, y, p, u === "planeswalker-large") : S ? t.drawImage(
    S,
    b,
    y + (h.legendary ? X.legendaryBackgroundLift : 0),
    p,
    o ? w : S.height * p / S.width
  ) : (t.fillStyle = g, t.fillRect(b, y, p, w)), t.restore(), t.fillStyle = "#e3d8bb", !r.has(m.frame))
    if (u === "adventure")
      for (const G of Rn(e).filter((J) => J.kind === "rules" && !J.color))
        t.fillRect(G.x, G.y, G.width, G.height);
    else t.fillRect(...l(d.rules));
  r.has(m.boxes) || (t.fillRect(...l(d.title)), t.fillRect(...l(d.type))), t.fillStyle = "#80745c", v || t.fillRect(...l(d.art));
  const C = r.get(m.frame);
  if (C && u === "normal" && !o) {
    const G = Fo(e);
    $c(
      t,
      h,
      G,
      () => Za(t, C, h.legendary, d.frame, !0, G)
    ), Oc(t, h, G), Gc(t, h, G);
  }
  if (s && (t.save(), t.beginPath(), t.rect(0, 0, T, n), t.clip(), t.resetTransform(), t.drawImage(s, 0, 0, t.canvas.width, t.canvas.height), t.restore()), u === "normal" && !o) {
    const [G, J, Ct, Ee] = l(d.art), be = vr.artRim;
    t.fillStyle = "#090806", t.fillRect(G - be, J - be, Ct + 2 * be, Ee + 2 * be);
  }
  if (_t(t, e, r, l(d.art), a), v && ff(t, e), C && v) {
    const [G, J, Ct] = l(d.frame);
    ja(t, C, G, J, Ct, u === "planeswalker-large");
  } else C && u !== "normal" && Za(t, C, h.legendary, d.frame);
  if (h.legendary && f(m.crown, d.crown), o) {
    const G = r.get(m.boxes);
    if (G) {
      const Ct = G.height * 0.104;
      t.drawImage(G, 0, 0, G.width, Ct, ...l(d.title)), t.drawImage(G, 0, G.height - Ct, G.width, Ct, ...l(d.type));
    }
    const J = r.get(m.frame);
    t.fillStyle = "#e3d8bb", t.fillRect(...l(d.rules)), J && t.drawImage(
      J,
      J.width * 0.035,
      J.height * 0.675,
      J.width * 0.93,
      J.height * 0.325,
      ...l(d.rules)
    );
  } else {
    const G = v && ["Colourless", "Artifact", "Land"].includes(h.boxes);
    f(m.boxes, d.title), G && (t.save(), t.globalAlpha *= Zl, f(m.boxes, d.title), t.restore());
    const J = r.get(m.boxes);
    v && J ? pf(t, J, d.type, G) : (f(m.boxes, d.type, "bottom"), u === "normal" && J && (Cf(t, J, l(d.type)), kf(t, l(d.type), h.boxes)));
  }
  o || wl(t, e, r), t.fillStyle = "#17140f", t.textBaseline = "middle", t.textAlign = "left";
  const [k, R, M, x] = l(d.title), E = k + X.plateLeft + (u === "normal" ? 1 : 0), $ = Tn(e), A = kh(e), _ = e.manaSymbols ?? [], I = X.manaSize * A, q = X.manaGap + ($?.spacing ?? 0), H = _.length * I + Math.max(0, _.length - 1) * q, it = k + M - X.plateRight, jt = it - H, et = [
    jt,
    R + x / 2 - I / 2 + X.manaLift / 2,
    H,
    I
  ], N = _.length ? ke(et, $) : et, tt = (u === "normal" && !o ? X.normalTitleFont : X.titleFont) * A;
  t.font = `bold ${tt}px "CardRenderer MTG Beleren", Georgia`, t.letterSpacing = `${X.titleTracking}px`, t.save(), u === "normal" && !o && t.translate(...gs(e, "modern"));
  const U = N[0] - E - (_.length ? X.titleGap : 0), Z = v ? Math.max(
    1,
    Math.min(
      ft.titleWidth,
      (U - 0.5) / t.measureText(e.name).width
    )
  ) : 1;
  at(
    t,
    e.name,
    E,
    R + x / 2 + (u === "normal" ? 1 : 0),
    U,
    tt,
    !0,
    Z
  ), t.restore(), t.letterSpacing = "0px", Y(
    t,
    e,
    "manaCost",
    () => He(t, et, $, () => {
      _.forEach(
        (G, J) => st(
          t,
          G,
          jt + J * (I + q),
          R + x / 2 - I / 2 + X.manaLift / 2,
          I,
          r,
          !0,
          $
        )
      );
    })
  );
  const Kt = Q(e), rt = r.get(Kt ?? ""), ce = Ut(Kt), vt = ue(e), ge = Ql(e), se = Fl(e), Vt = ge && u === "normal", Dt = Vt ? yf : 1, fe = X.setMargin + (Vt ? 2 : 0), [, Le, , or] = l(d.type), pe = Le + or / 2 + X.typeLift / 2 + (u === "normal" || v ? 2 : 0), Yt = rt ? Math.min(
    X.setMaxWidth,
    X.setHeight * rt.width * vt[2] / (rt.height * vt[3])
  ) : 0, Nt = rt ? Math.min(
    Yt / (rt.width * vt[2]),
    X.setHeight / (rt.height * vt[3])
  ) : 0, W = [
    it - fe - Yt - Yt * (Dt - 1) / 2 + (v ? 1.5 : 0),
    pe - (rt?.height ?? 0) * vt[3] * Nt * Dt / 2 - (Vt ? 1 : 0),
    (rt?.width ?? 0) * vt[2] * Nt * Dt,
    (rt?.height ?? 0) * vt[3] * Nt * Dt
  ], [nt, gt] = v && ce && !e.setSymbol ? X0(e.setCode) : [1, 1], bt = v ? [
    W[0] + W[2] * (1 - nt),
    W[1] + W[3] * (1 - gt),
    W[2] * nt,
    W[3] * gt
  ] : W, At = u === "normal" && !o ? fs(e, Kt, W, "component") : bt, ae = ke(At, e.symbolAdjustment?.set), sr = Math.max(
    1,
    Math.min(
      it - E - (rt ? Yt * (1 + (Dt - 1) / 2) + fe + X.typeGap : 0),
      rt && ae !== W ? ae[0] - E - X.typeGap : 1 / 0
    )
  );
  t.font = `${X.typeFont * A}px "CardRenderer MTG Beleren", Georgia`, at(
    t,
    e.typeLine ?? "",
    E + (v ? 1.5 : 0),
    pe,
    sr,
    X.typeFont * A,
    !1,
    u === "normal" && !o ? vr.typeWidthScale : v && t.measureText(e.typeLine ?? "").width * ft.typeWidth <= sr * 0.97 ? ft.typeWidth : 1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  ), Y(
    t,
    e,
    "setSymbol",
    () => He(t, At, e.symbolAdjustment?.set, () => {
      rt && (ce || e.setSymbol ? (t.save(), t.shadowColor = "transparent", t.drawImage(rt, ...At), t.restore()) : ge ? td(
        t,
        rt,
        e.rarity,
        ...At,
        vt,
        Vt ? 1.5 : 1
      ) : se ? _l(
        t,
        rt,
        se,
        e.rarity,
        ...At,
        vt,
        u === "normal"
      ) : oe(
        t,
        rt,
        e.setCode,
        e.rarity,
        ...At,
        vt
      ));
    })
  ), Jl(e) ? nf(t, e, r) : u !== "normal" ? gf(t, e, r) : ui(t, e, r) || Rt(t, Sl(t, e, n, A), r);
  const Zt = wd(e);
  if (Zt && u !== "leveler")
    if (f(m.pt, d.stats, "stretch"), u.startsWith("planeswalker"))
      Eh(t, Zt.text, l(d.stats));
    else {
      const [G, J, Ct] = l(d.stats);
      t.fillStyle = "#17140f", t.font = `bold ${X.statsFont}px "CardRenderer MTG Beleren", Georgia`, t.textAlign = "center", t.textBaseline = "middle", mt(
        t,
        Zt.text,
        G + Ct / 2,
        J + X.statsLine / 2 + (u === "normal" ? 2 : 0),
        Ct,
        e.textInk
      );
    }
  o || bo(t, e);
}
function Za(t, e, r, n = V.frame, o = !1, s = 0) {
  const [a, i, l, d] = _f(n), u = s, h = a + u, m = l - 2 * u, c = Math.min(e.height, d * e.width / l), g = c * l / e.width, f = t.getTransform().a, b = () => {
    if (!o) {
      t.drawImage(e, 0, 0, e.width, c, h, i, m, g);
      return;
    }
    const y = 424, p = 436;
    t.save(), t.beginPath(), t.rect(0, 0, T, y), t.rect(0, p, T, L - p), t.clip(), t.drawImage(e, 0, 0, e.width, c, h, i, m, g), t.restore(), t.save(), t.beginPath(), t.rect(0, y, T, p - y), t.clip(), t.drawImage(e, 0, 0, e.width, c, h, i - 1, m, g), t.restore();
  };
  t.save(), t.shadowColor = "black", t.shadowOffsetX = -394e-5 * T * f, t.shadowOffsetY = 394e-5 * T * f, t.shadowBlur = 236e-5 * T * f, b(), r || (t.shadowColor = "#ffffffa0", t.shadowOffsetX = 157e-5 * T * f, t.shadowOffsetY = -315e-5 * T * f, t.shadowBlur = 157e-5 * T * f, b()), t.restore();
}
function _f(t) {
  return [t[0] * T, t[1] * L, t[2] * T, t[3] * L];
}
const Uf = [
  {
    id: "match",
    label: "Match printing",
    family: "match",
    note: "Keep all supplied printing fields."
  },
  {
    id: "lea",
    label: "Alpha",
    family: "retro",
    setCode: "LEA",
    note: "Early black-border printing."
  },
  {
    id: "leb",
    label: "Beta",
    family: "retro",
    setCode: "LEB",
    note: "Early black-border printing."
  },
  {
    id: "2ed",
    label: "Unlimited",
    family: "retro",
    setCode: "2ED",
    note: "Early white-border printing."
  },
  {
    id: "3ed",
    label: "Revised",
    family: "retro",
    setCode: "3ED",
    note: "Revised printing and original mana."
  },
  {
    id: "4ed",
    label: "Fourth Edition",
    family: "retro",
    setCode: "4ED",
    note: "Fourth Edition lettering and credits."
  },
  {
    id: "leg",
    label: "Legends",
    family: "retro",
    setCode: "LEG",
    note: "Legends stock and symbol policy."
  },
  {
    id: "mir",
    label: "Mirage",
    family: "retro",
    setCode: "MIR",
    note: "Mirage lettering, symbols and legal line."
  },
  { id: "7ed", label: "Seventh Edition", family: "retro", setCode: "7ED", note: "Late old frame." },
  {
    id: "8ed",
    label: "Eighth Edition",
    family: "eighth",
    setCode: "8ED",
    note: "Complete Eighth-family plates."
  },
  {
    id: "plc",
    label: "Planar Chaos",
    family: "eighth",
    setCode: "PLC",
    note: "Regular 2007 printing."
  },
  {
    id: "plc-colorshifted",
    label: "Planar Chaos · Colorshifted",
    family: "eighth",
    setCode: "PLC",
    treatment: "colorshifted",
    note: "Monocolored spells and artifacts only."
  },
  {
    id: "fut-regular",
    label: "Future Sight · Regular",
    family: "eighth",
    setCode: "FUT",
    note: "Ordinary printing; the set does not imply Futureshifted."
  },
  {
    id: "fut",
    label: "Future Sight · Futureshifted",
    family: "future",
    setCode: "FUT",
    note: "Shaped frame with curved mana rail."
  },
  {
    id: "m15",
    label: "Magic 2015",
    family: "modern",
    setCode: "M15",
    note: "Modern component frame and footer."
  },
  {
    id: "m21",
    label: "Core Set 2021",
    family: "modern",
    setCode: "M21",
    note: "Modern set-specific printing."
  }
], xn = Object.freeze(
  Uf.map((t) => Object.freeze(t))
), T1 = 1;
function ad(t, e) {
  if (e.family === "match") return { ...t };
  const {
    frameStyle: r,
    frameTemplate: n,
    frameAssetFamily: o,
    frameTreatment: s,
    futureTreatment: a,
    borderColor: i,
    setSymbol: l,
    symbolAdjustment: d,
    setSymbolSource: u,
    setSymbolMask: h,
    legalText: m,
    collectorFormat: c,
    collectorTotal: g,
    collectorLanguage: f,
    collectorSetCode: b,
    printingElements: y,
    illustrationPlacement: p,
    artPlacement: w,
    ...S
  } = t;
  return {
    ...S,
    ...["transform", "modal_dfc", "reversible_card", "meld"].includes(t.layout ?? "") ? { layout: "normal" } : {},
    setCode: e.setCode,
    symbolStyle: "original",
    colorCalibration: "set-hsb-v1",
    ...e.family === "retro" ? { frameStyle: "retro", securityStamp: "none" } : {},
    ...e.family === "eighth" ? { frameStyle: "modern", frameAssetFamily: "eighth", securityStamp: "none" } : {},
    ...e.family === "modern" ? { frameStyle: "modern", securityStamp: void 0 } : {},
    ...e.family === "future" ? { frameTemplate: "future", securityStamp: "none" } : {},
    ...e.treatment ? { frameTreatment: e.treatment } : {}
  };
}
function id(t, e) {
  const r = xn.find((o) => o.id === e);
  if (!r) return { supported: !1, reason: "Unknown printing preset." };
  if (r.family === "match") return { supported: !0 };
  if (t.layout === "split" && t.faces?.length === 2)
    return r.family === "future" || r.treatment ? { supported: !1, reason: "This preset has no split-card painter." } : t.faces.some(
      (o) => !/^(Instant|Sorcery)\b/.test(o.canonicalTypeLine ?? o.typeLine ?? "")
    ) ? { supported: !1, reason: "Native split frames require two spell faces." } : { supported: !0 };
  if (t.faces?.length || t.layout && !["normal", "token", "transform", "modal_dfc", "reversible_card", "meld"].includes(
    t.layout
  ) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
    return {
      supported: !1,
      reason: "This prototype supports ordinary single faces and spell splits; retain the layout-specific painter."
    };
  try {
    r.family === "eighth" && xt(ad({ ...t, layout: "normal" }, r));
  } catch (o) {
    return { supported: !1, reason: o.message };
  }
  return { supported: !0 };
}
function Ne(t, e) {
  if (!e || typeof e != "object" || Array.isArray(e) || Object.keys(e).some((a) => !["preset", "overrides", "art"].includes(a)))
    throw Error("Invalid printing selection");
  const r = id(
    e.overrides?.frameColors === void 0 ? t : { ...t, frameColors: e.overrides.frameColors },
    e.preset
  );
  if (!r.supported) throw Error(r.reason);
  const n = xn.find((a) => a.id === e.preset);
  let o = ad(t, n);
  if (e.overrides === null) throw Error("Printing overrides must be an object");
  const s = e.overrides ?? {};
  if (typeof s != "object" || Array.isArray(s))
    throw Error("Printing overrides must be an object");
  if (t.faces?.length && s.elements && Object.keys(s.elements).length)
    throw Error(
      "Element movement/visibility in composite layouts is not implemented in this prototype."
    );
  for (const [a, i] of Object.entries(s))
    if (i !== void 0) {
      if (a === "calibration") {
        Bi(i), o.calibration = structuredClone(i);
        continue;
      }
      if (a !== "setSymbolCode") {
        if (a === "styleSetCode") {
          if (typeof i != "string" || !/^[-A-Za-z0-9_]{1,16}$/.test(i))
            throw Error("Invalid styling set code");
          o.setCode = i;
          continue;
        }
        if (a === "symbolAdjustment") {
          o.symbolAdjustment = structuredClone(i);
          continue;
        }
        if (a === "frameColors") {
          if (!Array.isArray(i) || i.length > 5 || !i.every((l) => typeof l == "string" && /^[WUBRG]$/.test(l)) || new Set(i).size !== i.length)
            throw Error("Invalid frame colors");
          o.frameColors = [...i];
          continue;
        }
        if (a === "elements") o.printingElements = structuredClone(i);
        else if ([
          "artist",
          "legalText",
          "collectorNumber",
          "collectorTotal",
          "collectorFormat",
          "collectorLanguage",
          "collectorSetCode",
          "setCode",
          "setSymbol",
          "setSymbolMask",
          "symbolStyle",
          "borderColor",
          "securityStamp",
          "futureTreatment"
        ].includes(a))
          Object.assign(o, { [a]: i });
        else throw Error("Unknown printing override: " + a);
      }
    }
  if (s.setSymbolMask !== void 0 && !["auto", "alpha", "ink"].includes(s.setSymbolMask))
    throw Error("Invalid set symbol mask mode");
  if (s.futureTreatment !== void 0 && (!["regular", "full-art", "clear"].includes(s.futureTreatment) || o.frameTemplate !== "future"))
    throw Error("Future treatment requires a Futureshifted frame.");
  if (s.styleSetCode !== void 0 && s.setCode !== void 0)
    throw Error("Choose one styling set code");
  if (s.symbolAdjustment !== void 0) {
    if (o.frameTemplate) throw Error("Fine symbol adjustments require an ordinary frame.");
    Ho(o);
  }
  for (const [a, i] of Object.entries(s)) {
    if (["artist", "legalText", "collectorNumber", "setSymbol"].includes(a) && i !== null && i !== void 0 && (typeof i != "string" || i.length > (a === "setSymbol" ? 65536 : 2048)))
      throw Error("Invalid printing text override");
    if (a === "setSymbol" && i === "") throw Error("Invalid symbol asset");
  }
  if (o.symbolStyle !== void 0 && !["original", "modern"].includes(o.symbolStyle))
    throw Error("Invalid mana symbol style");
  if (o.borderColor !== void 0 && !["black", "white", "silver"].includes(o.borderColor))
    throw Error("Invalid border color");
  if (s.setSymbolCode !== void 0) {
    if (typeof s.setSymbolCode != "string" || !/^[A-Za-z0-9_-]{1,16}$/.test(s.setSymbolCode))
      throw Error("Invalid symbol set code");
    if (s.setSymbol !== void 0) throw Error("Choose a symbol code or URL, not both.");
    o.setSymbol = Q({
      name: o.name,
      setCode: s.setSymbolCode,
      rarity: o.rarity
    });
  }
  if (s.setSymbol === null && (o.printingElements = {
    ...o.printingElements,
    setSymbol: { ...o.printingElements?.setSymbol, hidden: !0 }
  }), s.collectorNumber === null && (o.printingElements = {
    ...o.printingElements,
    collector: { ...o.printingElements?.collector, hidden: !0 }
  }), s.collectorNumber !== void 0 && o.collectorTotal === void 0 && (o.collectorTotal = null), o.collectorFormat !== void 0 && !["number-first", "rarity-first"].includes(o.collectorFormat))
    throw Error("Invalid collector format");
  for (const a of ["setCode", "collectorSetCode"])
    if (o[a] !== void 0 && o[a] !== null && (typeof o[a] != "string" || !/^[A-Za-z0-9_-]{1,16}$/.test(o[a])))
      throw Error("Invalid printing set code");
  if (o.securityStamp !== void 0 && !["none", "oval", "triangle", "acorn", "circle", "arena", "heart"].includes(o.securityStamp))
    throw Error("Invalid security stamp");
  if (o.printingElements && Object.keys(o.printingElements).length && !fn(o).supported)
    throw Error(fn(o).reason);
  if (Ii(o), o.collectorTotal !== void 0 && o.collectorTotal !== null && (!Number.isInteger(o.collectorTotal) || o.collectorTotal < 1 || o.collectorTotal > 99999))
    throw Error("Invalid collector total");
  if (o.collectorLanguage !== void 0 && !/^[A-Za-z]{2,5}$/.test(o.collectorLanguage))
    throw Error("Invalid collector language");
  if (o.frameTemplate === "future" && Fi(o), e.art !== void 0 && (o = Lh(o, e.art)), t.layout === "split" && t.faces && (o = {
    ...o,
    faces: t.faces.map(
      (a) => Ne({ ...a, layout: "normal" }, e)
    )
  }), typeof o.calibration == "object" && !Je(o))
    throw Error("M21 calibration requires a modern frame.");
  return me(o);
}
function fn(t) {
  return !t.faces?.length && (!t.layout || ["normal", "token"].includes(t.layout)) && (!t.frameTemplate || t.frameTemplate === "future") && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") && !/^Level up\b/m.test(t.rulesText ?? "") ? { supported: !0, elements: ["artist", "legal", "collector", "manaCost", "setSymbol"] } : {
    supported: !1,
    elements: [],
    reason: "Element controls currently require an ordinary single face or Futureshifted template."
  };
}
function jf(t) {
  const e = {
    setCode: t.set?.toUpperCase(),
    symbolStyle: "original"
  };
  return t.frame === "future" ? (e.frameTemplate = "future", t.textless && (e.futureTreatment = "full-art")) : t.frame === "1993" || t.frame === "1997" ? e.frameStyle = "retro" : t.frame === "2003" ? (e.frameStyle = "modern", e.frameAssetFamily = "eighth") : t.frame === "2015" && (e.frameStyle = "modern"), t.frame_effects?.includes("colorshifted") && (e.frameStyle = "modern", e.frameAssetFamily = "eighth", e.frameTreatment = "colorshifted", delete e.frameTemplate, delete e.futureTreatment), ["black", "white", "silver"].includes(t.border_color ?? "") && (e.borderColor = t.border_color), t.security_stamp && ["none", "oval", "triangle", "acorn", "circle", "arena", "heart"].includes(t.security_stamp) ? e.securityStamp = t.security_stamp : e.securityStamp = "none", e;
}
function Df(t) {
  const e = t.rulesParagraphs ? t.rulesParagraphs.flatMap((o) => o.runs.map((s) => s.text)).join(`
`) : t.rulesText ?? "", r = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...[...e.matchAll(/\{([^}]+)\}/g)].map((o) => o[1])
  ]), n = cs(t);
  return {
    frame: Nu(t) || !!n || St(t) && xe(t) && vi(t).length > 0,
    manaSymbols: [
      .../* @__PURE__ */ new Set([
        ...[...r].filter((o) => !!Di(t, /^\d+$/.test(o) ? "N" : o)),
        ...n?.glyph ? [n.color] : []
      ])
    ]
  };
}
const Qa = (t) => "mask" in t || t.hueDegrees !== 0 || t.saturationScale !== 1 || t.brightnessScale !== 1 || t.rgbScale !== void 0 || t.valueGamma !== void 0;
function Nf(t) {
  const e = us(t), { face: r, materials: n, assets: o } = e, s = Object.entries(n), a = (p) => {
    if (!p.length) return { status: "source", assets: [] };
    const w = p.filter((S) => e.fallbackAssets.includes(S));
    return {
      status: w.length === p.length ? "fallback" : w.length ? "mixed" : "measured",
      ...w.length === p.length ? { profile: "m21-modern", revision: 1 } : w.length ? {} : { profile: `printing:${r.setCode?.toLowerCase() ?? ""}`, revision: 1 },
      assets: p
    };
  }, i = a(
    s.filter(
      ([p, w]) => Qa(w) && ("mask" in w || p === o.boxes || p.includes("/pt_boxes/"))
    ).map(([p]) => p)
  ), l = a(
    s.filter(
      ([p, w]) => Qa(w) && (p !== o.boxes && !p.includes("/pt_boxes/") || "mask" in w)
    ).map(([p]) => p)
  ), d = Df(r), u = cs(r), h = u?.frame ?? (St(r) ? fr : void 0);
  if (h && d.frame)
    for (const p of [l, i])
      Object.assign(p, {
        status: "measured",
        profile: `printing:${r.setCode?.toLowerCase()}`,
        revision: 1,
        assets: [h]
      });
  const m = a(s.filter(([, p]) => p.blackPoint).map(([p]) => p)), g = [.../* @__PURE__ */ new Set([
    ...r.manaSymbols ?? [],
    ...[...(r.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((p) => p[1]),
    ...(r.rulesParagraphs ?? []).flatMap(
      (p) => p.runs.flatMap((w) => [...w.text.matchAll(/\{([^}]+)\}/g)].map((S) => S[1]))
    )
  ])].filter(
    (p) => po(r, /^\d+$/.test(p) ? "N" : p)
  ), f = g.length ? {
    status: "measured",
    profile: `printing:${r.setCode?.toLowerCase() ?? ""}`,
    revision: 1,
    assets: [],
    symbols: g
  } : u?.glyph ? { status: "measured", profile: "printing:8ed", revision: 1, assets: [u.glyph] } : { status: "source", assets: [] }, b = e.border ? {
    status: e.fallbackStock ? "fallback" : "measured",
    profile: e.fallbackStock ? "m21-modern" : `printing:${r.setCode?.toLowerCase() ?? ""}`,
    revision: 1,
    color: e.border,
    assets: s.filter(([, p]) => p.outerStock).map(([p]) => p)
  } : { status: "source", assets: [] }, y = [];
  return (e.fallbackStock || e.fallbackAssets.length) && y.push(
    "Using provisional M21 defaults for compatible materials; this is not a measured calibration of this printing."
  ), (r.calibration === "auto" || typeof r.calibration == "object") && [l, i, m].some((p) => p.status === "source") && y.push("Some frame materials retain source colors or ink levels."), {
    mode: r.calibration ?? "legacy",
    components: { frame: l, textBox: i, border: b, interiorInk: m, manaSymbols: f },
    notices: y
  };
}
function M1(t) {
  return Ei.map((e) => ({
    ...e,
    supported: Je(t),
    ...Je(t) ? {} : { reason: "Requires a modern frame." }
  }));
}
const zf = /^[a-z0-9][a-z0-9-]{0,47}$/;
function yt(t, e) {
  if (!t || typeof t != "object" || Array.isArray(t) || ![Object.prototype, null].includes(Object.getPrototypeOf(t)))
    throw Error("Invalid " + e);
}
function wt(t, e, r) {
  if (Object.keys(t).some((n) => !e.includes(n)))
    throw Error("Unknown " + r + " field");
}
function Jr(t) {
  if (typeof t != "string" || !zf.test(t)) throw Error("Invalid printing style ID");
}
const Yf = [
  "calibration",
  "artist",
  "legalText",
  "collectorNumber",
  "collectorTotal",
  "collectorFormat",
  "collectorLanguage",
  "collectorSetCode",
  "setCode",
  "styleSetCode",
  "setSymbol",
  "setSymbolCode",
  "setSymbolMask",
  "symbolStyle",
  "borderColor",
  "securityStamp",
  "frameColors",
  "futureTreatment",
  "symbolAdjustment",
  "elements"
];
function yr(t) {
  if (yt(t, "printing layer"), wt(t, ["overrides", "art"], "printing layer"), t.overrides !== void 0) {
    if (yt(t.overrides, "printing overrides"), wt(t.overrides, Yf, "printing override"), t.overrides.elements !== void 0) {
      yt(t.overrides.elements, "printing elements"), wt(
        t.overrides.elements,
        ["artist", "legal", "collector", "manaCost", "setSymbol"],
        "printing element"
      );
      for (const e of Object.values(t.overrides.elements))
        yt(e, "printing element"), wt(e, ["hidden", "offset"], "printing element");
    }
    if (t.overrides.symbolAdjustment !== void 0) {
      yt(t.overrides.symbolAdjustment, "symbol adjustment"), wt(t.overrides.symbolAdjustment, ["mana", "set"], "symbol adjustment");
      for (const [e, r] of Object.entries(t.overrides.symbolAdjustment))
        if (yt(r, "symbol transform"), wt(
          r,
          e === "set" ? ["dx", "dy", "scaleX", "scaleY"] : [
            "dx",
            "dy",
            "scaleX",
            "scaleY",
            "spacing",
            "numberScale",
            "numberDx",
            "numberDy",
            "glyphs"
          ],
          "symbol transform"
        ), r.glyphs !== void 0) {
          yt(r.glyphs, "mana glyphs"), wt(r.glyphs, ["W", "U", "B", "R", "G"], "mana glyph");
          for (const n of Object.values(r.glyphs))
            yt(n, "mana glyph"), wt(n, ["scale", "dx", "dy"], "mana glyph");
        }
    }
  }
  if (t.art !== void 0 && (yt(t.art, "art placement"), wt(t.art, ["mode", "zoom", "focalPoint", "paperOpacity"], "art placement")), t.overrides?.futureTreatment !== void 0 && !["regular", "full-art", "clear"].includes(t.overrides.futureTreatment))
    throw Error("Invalid future treatment");
  Ne(
    { name: "Style validation", typeLine: "Creature", colors: ["U"] },
    {
      preset: "match",
      ...t.overrides ? {
        overrides: Object.fromEntries(
          Object.entries(t.overrides).filter(
            ([e]) => e !== "futureTreatment"
          )
        )
      } : {}
    }
  ), t.art && Ne(
    { name: "Art validation", typeLine: "Creature", colors: ["U"], frameTemplate: "future" },
    { preset: "match", art: { mode: "behind-text", ...t.art } }
  );
}
function ld(t) {
  if (yt(t, "printing style"), wt(
    t,
    [
      "version",
      "id",
      "label",
      "defaults",
      "collectorSetCode",
      "symbols",
      "defaultFrame",
      "frames",
      "rules"
    ],
    "printing style"
  ), t.version !== 1) throw Error("Unsupported printing style version");
  if (Jr(t.id), typeof t.label != "string" || !t.label.trim() || t.label.length > 160)
    throw Error("Invalid printing style label");
  if (t.collectorSetCode !== void 0 && (typeof t.collectorSetCode != "string" || !/^[-A-Za-z0-9_]{1,16}$/.test(t.collectorSetCode)))
    throw Error("Invalid collector set code");
  if (t.defaults !== void 0 && yr(t.defaults), !Array.isArray(t.frames) || !t.frames.length || t.frames.length > 64)
    throw Error("A printing style needs 1..64 frame options");
  const e = /* @__PURE__ */ new Set();
  for (const r of t.frames) {
    if (yt(r, "frame option"), wt(r, ["id", "label", "selection"], "frame option"), Jr(r.id), e.has(r.id)) throw Error("Duplicate frame option");
    if (e.add(r.id), typeof r.label != "string" || !r.label.trim() || r.label.length > 160)
      throw Error("Invalid frame label");
    if (yt(r.selection, "frame selection"), wt(r.selection, ["preset", "overrides", "art"], "frame selection"), !xn.some((s) => s.id === r.selection.preset))
      throw Error("Unknown frame preset");
    const { preset: n, ...o } = r.selection;
    yr(o);
  }
  if (!e.has(t.defaultFrame)) throw Error("Unknown default frame");
  if (t.symbols !== void 0) {
    yt(t.symbols, "symbol pack"), wt(
      t.symbols,
      ["default", "common", "uncommon", "rare", "mythic", "special"],
      "symbol pack"
    );
    for (const r of Object.values(t.symbols))
      if (r !== null && (typeof r != "string" || !r || r.length > 65536))
        throw Error("Invalid symbol asset");
  }
  if (t.rules !== void 0) {
    if (!Array.isArray(t.rules) || t.rules.length > 128) throw Error("Invalid frame rules");
    const r = /* @__PURE__ */ new Set();
    for (const n of t.rules) {
      if (yt(n, "frame rule"), wt(n, ["id", "when", "frame", "defaults"], "frame rule"), Jr(n.id), r.has(n.id)) throw Error("Duplicate frame rule");
      if (r.add(n.id), !e.has(n.frame)) throw Error("Unknown rule frame");
      if (yt(n.when, "frame condition"), wt(
        n.when,
        [
          "colors",
          "colorSource",
          "colorCount",
          "types",
          "layouts",
          "templates",
          "treatments",
          "rarities",
          "artifact",
          "land",
          "legendary"
        ],
        "frame condition"
      ), n.when.colors !== void 0 && (!Array.isArray(n.when.colors) || n.when.colors.length > 5 || !n.when.colors.every((o) => typeof o == "string" && /^[WUBRG]$/.test(o)) || new Set(n.when.colors).size !== n.when.colors.length))
        throw Error("Invalid rule colors");
      if (n.when.colorSource !== void 0 && !["printing", "card"].includes(n.when.colorSource))
        throw Error("Invalid rule color source");
      if (n.when.colorCount !== void 0 && (!Array.isArray(n.when.colorCount) || n.when.colorCount.length !== 2 || !n.when.colorCount.every((o) => Number.isInteger(o) && o >= 0 && o <= 5) || n.when.colorCount[0] > n.when.colorCount[1]))
        throw Error("Invalid color count");
      for (const o of ["types", "layouts", "templates", "treatments", "rarities"])
        if (n.when[o] !== void 0 && (!Array.isArray(n.when[o]) || !n.when[o].length || n.when[o].length > 32 || !n.when[o].every(
          (s) => typeof s == "string" && /^[-a-zA-Z0-9_]{1,48}$/.test(s)
        )))
          throw Error("Invalid rule " + o);
      for (const o of ["artifact", "land", "legendary"])
        if (n.when[o] !== void 0 && typeof n.when[o] != "boolean")
          throw Error("Invalid rule trait");
      n.defaults !== void 0 && yr(n.defaults);
    }
  }
  return structuredClone(t);
}
function qf(t) {
  yt(t, "printing style choice"), wt(t, ["frame", "overrides", "art"], "printing style choice");
  const { frame: e, ...r } = t;
  e !== void 0 && Jr(e), yr(r);
}
const R1 = 1;
function pn(t) {
  return Array.isArray(t) ? t.map(pn) : t && typeof t == "object" ? Object.fromEntries(
    Object.entries(t).filter(([, e]) => e !== void 0).map(([e, r]) => [e, pn(r)])
  ) : t;
}
function Hf(t, ...e) {
  const r = structuredClone(t);
  for (const n of e) {
    if (yr(n), n.art && (r.art = { mode: "window", ...r.art, ...pn(structuredClone(n.art)) }), !n.overrides) continue;
    const o = r.overrides || {}, s = pn(structuredClone(n.overrides)), a = { ...o, ...s };
    if (s.elements) {
      a.elements = structuredClone(o.elements || {});
      for (const i of Object.keys(s.elements))
        a.elements[i] = { ...a.elements[i], ...s.elements[i] };
    }
    if (s.symbolAdjustment) {
      a.symbolAdjustment = { ...o.symbolAdjustment, ...s.symbolAdjustment };
      for (const i of ["mana", "set"])
        s.symbolAdjustment[i] && (a.symbolAdjustment[i] = {
          ...o.symbolAdjustment?.[i],
          ...s.symbolAdjustment[i]
        });
      if (s.symbolAdjustment.mana?.glyphs) {
        a.symbolAdjustment.mana.glyphs = { ...o.symbolAdjustment?.mana?.glyphs };
        for (const i of Object.keys(s.symbolAdjustment.mana.glyphs))
          a.symbolAdjustment.mana.glyphs[i] = {
            ...o.symbolAdjustment?.mana?.glyphs?.[i],
            ...s.symbolAdjustment.mana.glyphs[i]
          };
      }
    }
    Object.hasOwn(s, "setSymbol") && delete a.setSymbolCode, Object.hasOwn(s, "setSymbolCode") && delete a.setSymbol, Object.hasOwn(s, "styleSetCode") && delete a.setCode, Object.hasOwn(s, "setCode") && delete a.styleSetCode, r.overrides = a;
  }
  return r;
}
function Xf(t, e) {
  const r = t.faces?.length ? t.faces : [t], n = Zr(
    r.flatMap(
      (a) => e.colorSource === "card" ? [...a.colors || []] : F({ ...a, frameColors: void 0 })
    )
  );
  if (e.colors && Zr(e.colors).join("") !== n.join("") || e.colorCount && (n.length < e.colorCount[0] || n.length > e.colorCount[1]))
    return !1;
  const o = j(t);
  for (const a of ["artifact", "land", "legendary"])
    if (e[a] !== void 0 && e[a] !== o[a]) return !1;
  const s = (t.canonicalTypeLine ?? t.typeLine ?? "").split(/[—–]/)[0].split(/\s+/).map((a) => a.toLowerCase());
  for (const [a, i] of [
    ["creature", "creature"],
    ["artifact", "artifact"],
    ["land", "land"],
    ["legendary", "legendary"]
  ])
    o[a] && !s.includes(i) && s.push(i);
  if (e.types && !e.types.some((a) => s.includes(a.toLowerCase())))
    return !1;
  for (const [a, i] of [
    ["layouts", t.layout || "normal"],
    ["templates", t.frameTemplate || "normal"],
    ["treatments", t.futureTreatment || t.frameTreatment || "regular"],
    ["rarities", t.rarity || "common"]
  ]) {
    const l = e[a];
    if (l && !l.includes(i)) return !1;
  }
  return !0;
}
function Jf(t, e) {
  const r = {};
  if (t.collectorSetCode !== void 0 && (r.collectorSetCode = t.collectorSetCode), t.symbols) {
    const n = e.rarity || "common", o = Object.hasOwn(t.symbols, n) ? t.symbols[n] : t.symbols.default, s = Object.hasOwn(t.symbols, n) && t.symbols[n] === null;
    (s || o !== void 0) && (r.setSymbol = s ? null : o);
  }
  return { overrides: r };
}
function x1(t, e, r = {}, n = {}) {
  const o = ud.includes(e) ? e : ld(e);
  return o.frames.map((s) => {
    try {
      const a = Vf(t, o, r, { ...n, frame: s.id });
      return {
        id: s.id,
        label: s.label,
        supported: !0,
        notices: a.notices,
        calibration: a.calibration
      };
    } catch (a) {
      return {
        id: s.id,
        label: s.label,
        supported: !1,
        reason: a.message
      };
    }
  });
}
function Kf(t, e) {
  return e === void 0 ? t : {
    ...t,
    frameColors: e,
    ...t.faces ? { faces: t.faces.map((r) => ({ ...r, frameColors: e })) } : {}
  };
}
function Vf(t, e, r = {}, n = {}) {
  const o = ud.includes(e) ? e : ld(e);
  for (const v of [r, n])
    if (qf(v), v.frame !== void 0 && !o.frames.some((C) => C.id === v.frame))
      throw Error("Unknown chosen frame");
  const { frame: s, ...a } = r, { frame: i, ...l } = n, d = i ?? s, u = o.rules?.find((v) => Xf(t, v.when));
  let h = i !== void 0 ? "face" : s !== void 0 ? "card" : u ? "rule" : "default", m = o.frames.find((v) => v.id === (d ?? u?.frame ?? o.defaultFrame));
  const c = [], g = (v, C = v.selection.preset) => Hf(
    { ...v.selection, preset: C },
    o.defaults || {},
    Jf(o, t),
    u?.defaults || {},
    a,
    l
  );
  let f = g(m);
  const b = (v) => {
    const C = g(v), k = id(
      Kf(t, C.overrides?.frameColors),
      C.preset
    );
    if (!k.supported) return k;
    try {
      return Ne(t, {
        preset: C.preset,
        overrides: Object.fromEntries(
          Object.entries(C.overrides || {}).filter(
            ([R]) => !["elements", "symbolAdjustment"].includes(R)
          )
        )
      }), k;
    } catch (R) {
      return { supported: !1, reason: R.message };
    }
  }, y = b(m);
  if (!y.supported) {
    if (d !== void 0) throw Error(y.reason);
    h = "fallback";
    const v = o.frames.find((C) => C.id === o.defaultFrame);
    v.id !== m.id && b(v).supported ? (m = v, f = g(m), c.push("Automatic frame is unsupported; using the default frame. " + y.reason)) : (f = g(m, "match"), c.push("Keeping the native layout. " + y.reason));
  }
  const p = Ne(t, {
    preset: f.preset,
    overrides: Object.fromEntries(
      Object.entries(f.overrides || {}).filter(
        ([v]) => !["elements", "symbolAdjustment", "futureTreatment"].includes(v)
      )
    )
  });
  if (f.overrides?.futureTreatment !== void 0)
    if (p.frameTemplate !== "future") {
      if (r.overrides?.futureTreatment || n.overrides?.futureTreatment)
        throw Error("Future treatment requires a Futureshifted frame.");
      delete f.overrides.futureTreatment, c.push("Inherited Future treatment is unavailable for this layout.");
    } else p.futureTreatment = f.overrides.futureTreatment;
  if (f.overrides?.elements && !fn(p).supported) {
    if (r.overrides?.elements || n.overrides?.elements)
      throw Error(fn(p).reason);
    delete f.overrides.elements, c.push("Inherited element positioning is unavailable for this layout.");
  }
  if (f.overrides?.symbolAdjustment)
    try {
      if (p.frameTemplate) throw Error("Fine symbol adjustments require an ordinary frame.");
      Ho({
        ...p,
        symbolAdjustment: f.overrides.symbolAdjustment
      });
    } catch (v) {
      if (r.overrides?.symbolAdjustment || n.overrides?.symbolAdjustment) throw v;
      delete f.overrides.symbolAdjustment, c.push("Inherited symbol adjustments are unavailable for this layout.");
    }
  if (f.art && !bl(p).modes.includes(f.art.mode)) {
    if (r.art || n.art)
      throw Error("This frame does not support the selected art placement.");
    delete f.art, c.push("Inherited artwork placement is unavailable for this frame.");
  }
  f = structuredClone(f);
  const w = Ne(t, f), S = Nf(w);
  return {
    face: w,
    calibration: S,
    selection: f,
    frame: m.id,
    frameSource: h,
    ...u ? { rule: u.id } : {},
    notices: [...c, ...S.notices]
  };
}
function dd(t) {
  if (t && typeof t == "object") {
    for (const e of Object.values(t)) dd(e);
    Object.freeze(t);
  }
  return t;
}
const ud = Object.freeze(
  xn.filter((t) => !["plc-colorshifted", "fut"].includes(t.id)).map((t) => {
    const e = [
      {
        id: "regular",
        label: t.id === "fut-regular" ? "Regular" : t.label,
        selection: { preset: t.id }
      }
    ], r = [];
    if (t.id === "plc" && e.push({
      id: "colorshifted",
      label: "Colorshifted",
      selection: { preset: "plc-colorshifted" }
    }), t.id === "fut-regular") {
      e.push({ id: "futureshifted", label: "Futureshifted", selection: { preset: "fut" } });
      for (const [n, o] of [
        ["full-art", "Futureshifted · Full art"],
        ["clear", "Futureshifted · Clear"]
      ])
        e.push({
          id: n,
          label: o,
          selection: { preset: "fut", overrides: { futureTreatment: n } }
        }), r.push({
          id: "existing-" + n,
          when: { templates: ["future"], treatments: [n] },
          frame: n
        });
      r.push({
        id: "existing-futureshifted",
        when: { templates: ["future"] },
        frame: "futureshifted"
      });
    }
    return t.id === "plc" && r.push({
      id: "existing-colorshifted",
      when: { treatments: ["colorshifted"] },
      frame: "colorshifted"
    }), dd({
      version: 1,
      id: t.id === "fut-regular" ? "fut" : t.id,
      label: t.id === "fut-regular" ? "Future Sight" : t.label,
      defaultFrame: "regular",
      frames: e,
      ...r.length ? { rules: r } : {}
    });
  })
);
function Kr(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    throw Error("Expected a card object.");
  return t;
}
function D(t, e = "", r = 32768) {
  if (t == null) return e;
  if (typeof t != "string" || t.length > r) throw Error("Invalid card text.");
  return t;
}
function ti(t) {
  if (t == null) return [];
  if (!Array.isArray(t) || t.length > 5 || !t.every((e) => typeof e == "string" && /^[WUBRG]$/.test(e)))
    throw Error("Invalid card colors.");
  return [...new Set(t)];
}
function Zf(t) {
  const e = D(t, "", 200);
  if (!/^(?:\{[0-9A-Z/∞]+\}\s*)*$/.test(e)) throw Error("Invalid mana cost.");
  return [...e.matchAll(/\{([^}]+)\}/g)].map((r) => r[1]);
}
function Qf(t) {
  if (t == null) return null;
  const e = D(t, "", 4096), r = new URL(e);
  if (r.protocol !== "https:" || r.username || r.password)
    throw Error("Provider artwork requires an HTTPS URL.");
  return r.href;
}
function ei(t, e = "") {
  return [
    ...t.split(`
`).filter(Boolean).map((r) => ({
      role: "rules",
      runs: r.split(/(\([^)]*\))/g).filter(Boolean).map((n) => ({ text: n, ...n.startsWith("(") ? { italic: !0 } : {} }))
    })),
    ...e.split(`
`).filter(Boolean).map((r) => ({
      role: "flavor",
      runs: r.split("*").map((n, o) => ({ text: n, italic: o % 2 === 0 })).filter((n) => n.text)
    }))
  ];
}
function t1(t, e, r, n) {
  const o = n.wording ?? "oracle";
  if (!["oracle", "original"].includes(o)) throw Error("Invalid wording choice.");
  if (n.symbolStyle !== void 0 && !["original", "modern"].includes(n.symbolStyle))
    throw Error("Invalid symbol style.");
  const s = {
    ...r ?? e,
    manaSymbols: Ri(t, e.manaSymbols ?? [])
  };
  return D0(t, { oracle: e, original: s }, o, {
    symbolStyle: n.symbolStyle ?? "original"
  });
}
function hd(t, e, r, n = null) {
  if (!t.length || t.length > 2) throw Error("Supply one card with at most two faces.");
  if (r.illustrations !== void 0 && (!Array.isArray(r.illustrations) || r.illustrations.length !== t.length || !r.illustrations.every(
    (a) => a === null || typeof a == "string" && a.length <= 4096
  )))
    throw Error("Invalid illustration overrides.");
  r.illustrations && (n = null), t = t.map((a, i) => ({
    ...a,
    ...r.illustrations?.[i] !== void 0 ? { illustration: r.illustrations[i] } : {}
  }));
  const o = r.faceIndex ?? 0;
  if (!Number.isInteger(o) || o < 0 || o >= t.length)
    throw Error("This card does not have that face.");
  const s = e === "battle" || e === "transform" && /\bBattle\b/.test(t[0].canonicalTypeLine ?? t[0].typeLine ?? "");
  if (r.faceIndex !== void 0 || t.length === 1 || ["transform", "modal_dfc", "reversible_card", "meld", "double_faced_token", "battle"].includes(
    e
  )) {
    const a = t[o], i = t[1];
    return {
      ...a,
      ...o > 0 && ["transform", "modal_dfc", "battle", "double_faced_token"].includes(e) ? { securityStamp: "none" } : {},
      illustration: a.illustration ?? n,
      ...s && o === 0 ? {
        frameTemplate: "battle",
        frameAssetFamily: void 0,
        ...i && /\bCreature\b/.test(i.canonicalTypeLine ?? i.typeLine ?? "") && i.power != null && i.power !== "" && i.toughness != null && i.toughness !== "" ? { reverseStats: { power: i.power, toughness: i.toughness } } : {}
      } : {}
    };
  }
  if (!["split", "aftermath", "flip", "adventure", "prepare", "room"].includes(e))
    throw Error("Unsupported multiple-face layout: " + e);
  return {
    ...t[0],
    layout: e === "room" ? "split" : e,
    faces: t,
    illustration: n,
    ...["adventure", "prepare", "room"].includes(e) ? { frameAssetFamily: void 0 } : {},
    ...e === "flip" ? { frameTemplate: "flip", frameAssetFamily: void 0 } : {}
  };
}
function e1(t, e = {}) {
  const r = Kr(t), n = D(r.name, "", 256);
  if (!n.trim()) throw Error("The Scryfall card needs a name.");
  const o = r.card_faces === void 0 ? [r] : r.card_faces;
  if (!Array.isArray(o) || !o.length || o.length > 2)
    throw Error("Supply one Scryfall card with at most two faces.");
  const s = jf({
    set: D(r.set),
    frame: D(r.frame),
    frame_effects: r.frame_effects === void 0 ? void 0 : r1(r.frame_effects),
    border_color: D(r.border_color),
    security_stamp: D(r.security_stamp),
    textless: r.textless === !0
  }), a = (h) => h.image_uris ? Qf(Kr(h.image_uris).art_crop) : null, l = ["common", "uncommon", "rare", "mythic", "special", "bonus"].find((h) => h === (r.rarity ?? "common"));
  if (!l) throw Error("Invalid card rarity.");
  const d = o.map((h, m) => {
    const c = Kr(h), g = D(c.type_line, D(r.type_line), 512);
    if (!g.trim()) throw Error("The Scryfall face needs a type line.");
    const f = D(c.oracle_text), b = Zf(c.mana_cost), y = ti(
      c.colors ?? c.color_indicator ?? (o.length === 1 ? r.colors : [..."WUBRG"].filter(
        (C) => b.some((k) => k.split("/").includes(C)) && (r.colors == null || ti(r.colors).includes(C))
      ))
    ), p = _0(
      g,
      y,
      s.setCode,
      D(r.frame),
      c.produced_mana ?? r.produced_mana
    ), w = {
      name: D(c.name, n, 256),
      typeLine: g,
      rulesText: f,
      manaSymbols: b,
      rulesParagraphs: ei(f, D(c.flavor_text))
    }, v = typeof c.printed_text == "string" || typeof c.printed_type_line == "string" || typeof c.printed_name == "string" ? {
      ...w,
      name: D(c.printed_name, w.name, 256),
      typeLine: D(c.printed_type_line, g, 512),
      rulesText: D(c.printed_text, f),
      rulesParagraphs: ei(
        D(c.printed_text, f),
        D(c.flavor_text)
      )
    } : void 0;
    return t1(
      {
        ...j0(s, g, f),
        ...m > 0 && ["transform", "modal_dfc", "battle", "double_faced_token"].includes(String(r.layout)) ? { securityStamp: "none" } : {},
        name: w.name,
        colors: y,
        ...p ? { frameColors: p } : {},
        rarity: l,
        artist: D(c.artist, D(r.artist), 256),
        collectorNumber: D(r.collector_number, "", 64),
        ...typeof r.lang == "string" && /^[a-z]{2,5}$/i.test(r.lang) ? { collectorLanguage: r.lang } : {},
        ...c.watermark == null && r.watermark == null ? {} : { watermark: D(c.watermark ?? r.watermark, "", 64) },
        power: c.power == null ? void 0 : D(c.power),
        toughness: c.toughness == null ? void 0 : D(c.toughness),
        loyalty: c.loyalty == null ? void 0 : D(c.loyalty),
        defense: c.defense == null ? void 0 : D(c.defense),
        illustration: a(c),
        colorCalibration: "set-hsb-v1"
      },
      w,
      v,
      e
    );
  });
  let u = D(r.layout, "normal", 64);
  if (o.length === 1 && ["split", "aftermath", "flip", "adventure", "prepare", "room"].includes(u))
    throw Error("Supply both Scryfall faces for this layout.");
  return u === "split" && /\bAftermath\b/.test(d[1]?.rulesText ?? "") && (u = "aftermath"), hd(d, u, e, o.length > 1 ? a(r) : null);
}
function r1(t) {
  if (!Array.isArray(t) || t.length > 32) throw Error("Invalid frame effects.");
  return t.map((e) => D(e, "", 64));
}
function n1(t, e) {
  const r = t.map((a) => ({ type: a.originalType, text: a.originalText }));
  if (t.length !== 2 || !["split", "aftermath", "adventure", "prepare", "flip"].includes(e))
    return r;
  const n = (a) => D(a).replace(/\r\n?/g, `
`), o = t.map((a) => n(a.originalText));
  if (e === "flip") {
    if (!o.some((u) => /\n-{3,}\n/.test(u))) return r;
    const a = o[0].split(/\n-{3,}\n/), i = a[1]?.split(`
`);
    if (o[0] !== o[1] || a.length !== 2 || !i || i[0] !== t[1].faceName || !i[1] || !/^\S+\/\S+$/.test(i[2] ?? "") || i.length < 4)
      throw Error("Ambiguous joined MTGJSON original flip text.");
    const l = (u) => n(u).replace(/[—–-]/g, " ").replace(/\s+/g, " ").trim(), d = [t[1].originalType, t[1].type].find(
      (u) => typeof u == "string" && l(u) === l(i[1])
    ) ?? i[1];
    return [
      { type: r[0].type, text: a[0] },
      { type: d, text: i.slice(3).join(`
`) }
    ];
  }
  if (!o.some((a) => /\s+\/\/\s+/.test(a))) return r;
  const s = o[0].split(/\s+\/\/\s+/);
  if (o[0] !== o[1] || s.length !== 2)
    throw Error("Ambiguous joined MTGJSON original panel text.");
  return t.map((a, i) => {
    const l = e === "adventure" ? 1 - i : i;
    let d = s[l].trim();
    const u = [a.faceName ?? a.name, a.manaCost, a.originalType];
    if (l === 1 && u.every((b) => typeof b == "string")) {
      const b = u.join(`
`) + `
`;
      d.startsWith(b) && (d = d.slice(b.length));
    }
    const h = D(a.originalType);
    l === 1 && h && d.startsWith(h + `
`) && (d = d.slice(h.length + 1));
    const m = D(a.type), c = t[0].originalType === t[1].originalType, g = /^(Instant|Sorcery)$/.test(h) && /^(Instant|Sorcery)$/.test(m), f = e === "adventure" && /^(Instant|Sorcery)\s*[—–-]\s*Adventure$/.test(m);
    return { text: d, type: c && (g || f) ? m : a.originalType };
  });
}
function A1(t, e = {}) {
  const r = (Array.isArray(t) ? t : [t]).map(Kr), n = [...r];
  if (!r.length || r.length > 2)
    throw Error("Supply the associated records of one MTGJSON card.");
  if (e.illustrations !== void 0 && (!Array.isArray(e.illustrations) || e.illustrations.length !== r.length))
    throw Error("Supply one illustration override per input record.");
  if (r.length > 1) {
    const [d, u] = r;
    if (d.uuid !== void 0 && d.uuid === u.uuid || d.side !== void 0 && d.side === u.side || d.layout !== u.layout)
      throw Error("Supply two distinct associated MTGJSON faces with the same layout.");
    const h = (f, b) => typeof b.uuid == "string" && Array.isArray(f.otherFaceIds) && f.otherFaceIds.includes(b.uuid), m = h(d, u) || h(u, d), c = [d.uuid, u.uuid, d.otherFaceIds, u.otherFaceIds].some(
      (f) => f !== void 0
    ), g = d.name === u.name && typeof d.faceName == "string" && typeof u.faceName == "string" && d.faceName !== u.faceName;
    if ((c ? !m : !g) || d.setCode !== void 0 && u.setCode !== void 0 && d.setCode !== u.setCode || d.number !== void 0 && u.number !== void 0 && D(d.number).replace(/[ab]$/, "") !== D(u.number).replace(/[ab]$/, "") || [
      [d, u],
      [u, d]
    ].some(([f, b]) => Array.isArray(f.otherFaceIds) && !f.otherFaceIds.includes(b.uuid)))
      throw Error("The MTGJSON records are not associated faces of one card.");
    r.every((f) => typeof f.side == "string") && r.sort((f, b) => D(f.side).localeCompare(D(b.side)));
  }
  const o = r[0], s = D(o.layout, "normal", 64);
  if (r.length === 1 && ["split", "aftermath", "flip", "adventure", "prepare", "room"].includes(s))
    throw Error("Supply both MTGJSON face records for this layout.");
  const a = e.wording === "original" ? n1(r, s) : void 0, i = r.map((d, u) => ({
    name: d.faceName ?? d.name,
    type_line: d.type,
    oracle_text: d.text ?? "",
    mana_cost: d.manaCost ?? "",
    colors: d.colors,
    produced_mana: U0(D(d.text)),
    watermark: d.watermark,
    power: d.power,
    toughness: d.toughness,
    loyalty: d.loyalty,
    defense: d.defense,
    artist: d.artist,
    flavor_text: d.flavorText,
    printed_type_line: a?.[u]?.type ?? d.originalType,
    printed_text: a?.[u]?.text ?? d.originalText
  })), l = r.map(
    (d, u) => e1(
      {
        ...i[u],
        set: d.setCode,
        rarity: d.rarity,
        collector_number: d.number,
        frame: d.frameVersion,
        frame_effects: d.frameEffects,
        border_color: d.borderColor,
        security_stamp: d.securityStamp,
        textless: d.isTextless
      },
      { wording: e.wording, symbolStyle: e.symbolStyle }
    )
  );
  return hd(l, s, {
    ...e,
    ...e.illustrations ? { illustrations: r.map((d) => e.illustrations[n.indexOf(d)]) } : {}
  });
}
function L1(t, e) {
  const r = { ...t, setCalibrationCandidate: e };
  if (ot(r), !(bn(t.setCode) && t.frameStyle !== "modern" && !t.frameTemplate && !t.frameAssetFamily && (!t.borderColor || t.borderColor === "black") && (!t.layout || t.layout === "normal") && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "")) && !ht(r))
    throw Error("This printing has no set calibration adapter");
  return r;
}
export {
  rf as $,
  la as A,
  pr as B,
  Xl as C,
  Lf as D,
  vd as E,
  Sd as F,
  nd as G,
  Af as H,
  Pt as I,
  C1 as J,
  Wf as K,
  Vd as L,
  zs as M,
  y1 as N,
  w1 as O,
  Yi as P,
  Df as Q,
  ze as R,
  ol as S,
  Cr as T,
  Ot as U,
  k1 as V,
  Hf as W,
  Ah as X,
  Td as Y,
  ef as Z,
  Rn as _,
  L as a,
  j as a$,
  S1 as a0,
  Ff as a1,
  Wl as a2,
  e0 as a3,
  K as a4,
  Cd as a5,
  zt as a6,
  Ft as a7,
  Q as a8,
  wd as a9,
  _t as aA,
  st as aB,
  ff as aC,
  Kg as aD,
  zi as aE,
  Rt as aF,
  oe as aG,
  gf as aH,
  Qs as aI,
  f1 as aJ,
  fl as aK,
  _f as aL,
  af as aM,
  uf as aN,
  m1 as aO,
  c1 as aP,
  M1 as aQ,
  Ei as aR,
  fn as aS,
  T1 as aT,
  id as aU,
  xn as aV,
  R1 as aW,
  x1 as aX,
  ud as aY,
  he as aZ,
  Lh as a_,
  xf as aa,
  xt as ab,
  su as ac,
  A1 as ad,
  e1 as ae,
  Jl as af,
  Jt as ag,
  dn as ah,
  ln as ai,
  v1 as aj,
  dt as ak,
  O as al,
  qa as am,
  rd as an,
  Zg as ao,
  Ye as ap,
  Ce as aq,
  Zr as ar,
  Sl as as,
  Pf as at,
  He as au,
  sd as av,
  Ka as aw,
  Of as ax,
  nf as ay,
  at as az,
  d1 as b,
  mi as b$,
  F as b0,
  Nf as b1,
  Ne as b2,
  Vf as b3,
  jf as b4,
  P0 as b5,
  Oo as b6,
  Lt as b7,
  tn as b8,
  Io as b9,
  Er as bA,
  ds as bB,
  Gt as bC,
  kh as bD,
  eh as bE,
  Vo as bF,
  rh as bG,
  yn as bH,
  Ys as bI,
  hs as bJ,
  Bi as bK,
  ld as bL,
  Ho as bM,
  Hr as bN,
  D0 as bO,
  yd as bP,
  L1 as bQ,
  Re as bR,
  kn as bS,
  Lr as bT,
  Ae as bU,
  Xt as bV,
  b1 as bW,
  Ke as bX,
  Ef as bY,
  Mf as bZ,
  Rf as b_,
  $t as ba,
  Vg as bb,
  Qt as bc,
  $0 as bd,
  xr as be,
  Gs as bf,
  kt as bg,
  Sn as bh,
  h1 as bi,
  Mi as bj,
  O0 as bk,
  zg as bl,
  Kl as bm,
  kd as bn,
  Zn as bo,
  u1 as bp,
  Ue as bq,
  Xo as br,
  Gm as bs,
  Vl as bt,
  fi as bu,
  ue as bv,
  t0 as bw,
  Ju as bx,
  hf as by,
  yh as bz,
  V as c,
  X as d,
  T as e,
  na as f,
  Yr as g,
  Tt as h,
  Gf as i,
  gh as j,
  E0 as k,
  qe as l,
  L0 as m,
  G0 as n,
  Vr as o,
  qt as p,
  al as q,
  ie as r,
  Ko as s,
  g1 as t,
  ke as u,
  bl as v,
  p1 as w,
  rn as x,
  Jo as y,
  th as z
};
