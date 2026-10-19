import { r as I, a as Or, f as Hl } from "./canvas-raster-DIqHyOj6.js";
import { f as Ua, g as sn, b as ja, r as Xl, v as Jl, h as Kl } from "./editor-Bm0GCRpX.js";
import { c as go, f as fo } from "./asset-fetch-my9kgRsJ.js";
import { d as Vl } from "./canvas-images-DWl3zt32.js";
import { t as it } from "./registry-Cg8tIhk4.js";
function Zl(t, e) {
  const { width: r, height: n } = t, o = "getContext" in t ? void 0 : I([r, n]);
  try {
    const s = o ?? t;
    if (!("getContext" in s)) throw Error("Mask canvas unavailable");
    const a = s.getContext("2d", { willReadFrequently: !0 });
    if (!a) throw Error("Mask extraction needs Canvas2D");
    o && a.drawImage(t, 0, 0);
    const i = a.getImageData(0, 0, r, n).data, d = new Uint8Array(r * n), l = e === "red" ? 0 : 3;
    for (let u = 0; u < n; u++)
      for (let h = 0; h < r; h++)
        d[(n - u - 1) * r + h] = i[(u * r + h) * 4 + l];
    return { width: r, height: n, rowOrder: "bottom-up", data: d };
  } finally {
    o && Or(o);
  }
}
const Ql = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", td = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", ed = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", rd = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", nd = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-new-split-fuse.mse-style", od = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", sd = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", V = {
  RENDERER_COMPONENT_ROOT: Ql,
  KEYRUNE_ROOT: td,
  CONJURER_ROOT: ed,
  RETRO_ROOT: rd,
  MSE_SPLIT_BRIDGE_ROOT: nd,
  RETRO_SYMBOL_FONT: od,
  MSE_TEMPLATE_ROOT: sd
}, $r = /* @__PURE__ */ new WeakSet();
function ee(t) {
  return !$r.has(t);
}
function ad(t, e, r) {
  const n = $r.has(t);
  e || $r.add(t);
  try {
    r();
  } finally {
    n || $r.delete(t);
  }
}
const id = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function yr(t) {
  const e = /^Basic (?:Snow )?Land [—–-] (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    t.canonicalTypeLine ?? t.typeLine ?? ""
  )?.[1];
  return e ? id[e] : void 0;
}
function an(t) {
  if (t.frameStyle === "retro" || t.frameTemplate || t.layout && t.layout !== "normal")
    return null;
  const e = yr(t);
  if (!e) return null;
  const r = t.rulesText ?? "";
  if (!["", e, `{${e}}`, `{T}: Add {${e}}.`, `({T}: Add {${e}}.)`].includes(r))
    return null;
  if (t.rulesParagraphs) {
    const n = t.rulesParagraphs;
    if (n.length !== 1 || n[0].role !== "rules" || n[0].align || n[0].runs.length !== 1 || n[0].runs[0].text !== r || !!n[0].runs[0].italic !== r.startsWith("("))
      return null;
  }
  return `${V.RETRO_ROOT}/img/frames/m15/basics/${e.toLowerCase()}.png`;
}
function Da(t, e, r) {
  if (!ee(t)) return !0;
  const n = an(e);
  if (!n) return !1;
  const o = r.get(n);
  if (!o) throw Error(`Basic land symbol unavailable: ${n}`);
  return t.save(), t.shadowColor = "#0009", t.shadowOffsetX = -1.5, t.shadowOffsetY = 1.5, t.shadowBlur = 1.5, t.drawImage(o, 166, 440, 156, 156), t.restore(), !0;
}
const vn = "WUBRG";
function U(t) {
  const e = t.canonicalTypeLine ?? t.typeLine ?? "", r = t.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(e), n = t.land ?? (!/^Enchant\b/i.test(e) && /(^|\s)Land(?:\s|$)/i.test(e)), o = !/\bPlaneswalker\b/i.test(e) && (t.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(e)), s = t.creature ?? /(^|\s)Creature(?:\s|$)/i.test(e), a = W(t), i = a.length === 0 ? "Colourless" : a.length > 2 ? "Gold" : a.join(""), d = (r || n) && a.length === 0 ? "Artifact" : i, l = n ? "Land" : r ? "Artifact" : a.length > 1 ? "Gold" : i;
  return {
    frame: d,
    boxes: l,
    background: l,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: n && a.length > 0 ? i : r && a.length > 0 ? a.length > 1 ? "Gold" : i : l,
    pt: l,
    artifact: r,
    land: n,
    legendary: o,
    creature: s,
    className: `rendered-card-profile-${l.toLocaleLowerCase()}`
  };
}
function W(t) {
  if (t.frameColors !== void 0) return Dr(t.frameColors);
  const e = Dr(t.colors ?? []), r = yr(t);
  return e.length === 0 && r && t.land !== !1 ? [r] : e;
}
function Dr(t) {
  return [
    ...new Set(
      t.map((e) => e.toLocaleUpperCase()).filter((e) => vn.includes(e))
    )
  ].sort((e, r) => vn.indexOf(e) - vn.indexOf(r));
}
const ld = {
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
function dd(t) {
  const e = [...new Set(t)].filter((r) => /^[WUBRG]$/.test(r));
  return e.sort((r, n) => "WUBRG".indexOf(r) - "WUBRG".indexOf(n)), e.length === 1 ? e[0] : ld[e.join("")];
}
function ie(t) {
  if (t.frameTemplate || !["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "") || t.frameStyle === "modern" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) || t.layout && t.layout !== "normal")
    return;
  const e = Na(t);
  if (e.length !== 2) return;
  const r = ["WU", "WG", "UG", "BG", "RG"].includes(e.join("")) ? [...e].reverse() : e, n = `${V.RETRO_ROOT}/img/frames/old/abu/`;
  return {
    base: `${n}${r[0].toLowerCase()}l.png`,
    overlay: `${n}${r[1].toLowerCase()}l.png`,
    mask: `${V.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`,
    outline: `${n}${dd(e).toLowerCase()}l.png`
  };
}
function Na(t) {
  return t.frameColors ? W(t) : [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(
    ([e]) => new RegExp(String.raw`\b${e}\b`).test(t.canonicalTypeLine ?? t.typeLine ?? "")
  ).map(([, e]) => e);
}
function wt(t) {
  const e = t.setCalibrationCandidate;
  if (!e) return Ua(t.setCode);
  if (e.set !== t.setCode?.toLowerCase())
    throw Error("Calibration candidate belongs to another set");
  if (sn(e.set)) {
    ja(e);
    return;
  }
  return Xl(e);
}
function ud(t) {
  const e = wt(t)?.revision ?? null, r = sn(t.setCode)?.revision, n = ie(t);
  return r || n ? [
    "legacy-regional-v1",
    e,
    r ?? null,
    n ? "abu-outline-v3" : null,
    t.setCalibrationCandidate ?? null
  ] : ["set-profile-v1", e, t.setCalibrationCandidate ?? null];
}
function ht(t, e, r, n, o, s, a = "stats", i = () => o == null ? t.fillText(e, r, n) : t.fillText(e, r, n, o), d = (l) => t.measureText(l).width) {
  const l = a === "type" ? s?.typeLine : s?.stats;
  if (!l?.length) {
    i();
    return;
  }
  const u = d(e), h = u > 0 && o != null ? Math.min(1, o / u) : 1, m = u * h, c = t.textAlign === "right" || t.textAlign === "end" && t.direction !== "rtl" || t.textAlign === "start" && t.direction === "rtl", g = r - (t.textAlign === "center" ? m / 2 : c ? m : 0), f = a === "type" ? 1 : 0, y = (p, w, S) => {
    w <= p || S && s?.omitInk || (t.save(), t.beginPath(), t.rect(p, -1e4, w - p, 2e4), t.clip(), S && (t.fillStyle = S, t.shadowColor = "transparent"), i(), t.restore());
  };
  let b = -1e4;
  for (const p of l) {
    const w = Math.max(
      b,
      p.start === 0 ? -1e4 : g + d(e.slice(0, p.start)) * h - f
    ), S = p.end == null || p.end >= e.length ? 1e4 : g + d(e.slice(0, p.end)) * h + f;
    y(b, w), y(w, S, p.color), b = S;
  }
  y(b, 1e4);
}
const Of = 1, za = Object.freeze([
  Object.freeze({
    id: "m21-modern",
    revision: 1,
    label: "Modern · M21 defaults",
    setCode: "M21",
    note: "Provisional transfer: shared source colors and outer border; other materials retain source colors."
  })
]);
function Ya(t) {
  if (!(t === "auto" || t === "printing" || t === "source") && !(t && typeof t == "object" && !Array.isArray(t) && Object.keys(t).length === 1 && Object.hasOwn(t, "profile") && za.some((e) => e.id === t.profile)))
    throw Error("Invalid printing calibration choice");
}
function le(t) {
  if (["split", "aftermath", "adventure", "prepare", "room", "flip"].includes(t.layout ?? "") && t.faces?.some(
    (r) => r.calibration !== void 0 && JSON.stringify(r.calibration) !== JSON.stringify(t.calibration)
  ))
    throw Error("Composite panels share one calibration policy; select it on the physical face.");
  if (t.calibration === void 0) return t;
  Ya(t.calibration);
  const e = t.calibration === "source" ? void 0 : "set-hsb-v1";
  return {
    ...t,
    colorCalibration: e,
    ...t.faces ? {
      faces: t.faces.map(
        (r) => le({
          ...r,
          calibration: r.calibration ?? t.calibration
        })
      )
    } : {}
  };
}
function hd(t) {
  return t.power != null && t.toughness != null ? {
    text: `${t.power}/${t.toughness}`,
    label: `Power ${t.power}, toughness ${t.toughness}`
  } : t.loyalty != null && t.loyalty !== "" ? { text: String(t.loyalty), label: `Starting loyalty ${t.loyalty}` } : t.defense != null && t.defense !== "" ? { text: String(t.defense), label: `Defense ${t.defense}` } : null;
}
const T = 488, E = 680, md = 0.058;
function Pt(t, e) {
  if (e === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (e ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    t?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const cd = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", Z = {
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
  stamp: [0.34, 0.76 - 0.16 * T / E, 0.32, 0.32 * T / E]
}, J = {
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
}, us = (t) => t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
function gd(t = Z) {
  return {
    ...Object.fromEntries(
      Object.entries(t).flatMap(
        ([e, r]) => r.map((n, o) => [
          `--face-${us(e)}-${["x", "y", "w", "h"][o]}`,
          `${n * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(J).map(([e, r]) => [
        `--face-${us(e)}`,
        `${r / T * 100}cqw`
      ])
    )
  };
}
const $f = gd();
function fd(t) {
  return t.length > 340 ? "dense" : t.length > 210 ? "long" : "normal";
}
function Gf(t) {
  return {
    dense: J.denseRulesFont,
    long: J.longRulesFont,
    normal: J.normalRulesFont
  }[fd(t)];
}
function ln(t) {
  return t.split(/(\{[^}\n]+\})/g).filter(Boolean).map((e) => ({
    value: e,
    symbol: /^\{[^}\n]+\}$/.test(e) ? e.slice(1, -1) : null
  }));
}
function pd(t) {
  const e = t.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[e] ?? e.slice(0, 3);
}
const yd = it("printingStocks"), bd = (t) => {
  const e = parseInt(t.slice(1), 16);
  return [(e >> 16) / 255, (e >> 8 & 255) / 255, (e & 255) / 255];
}, qa = it("printingBlackPoints");
function mr(t) {
  return (t.colorCalibration === "set-hsb-v1" || t.colorCalibration === "early-hsb-v1") && (!t.borderColor || t.borderColor === "black") && (qa[t.setCode?.toLowerCase() ?? ""] ?? []).some(
    (e) => e.set === t.setCode?.toLowerCase() && e.stock !== null
  );
}
function Nn(t, e, r) {
  if (!["set-hsb-v1", "early-hsb-v1"].includes(t.colorCalibration ?? "")) return { materials: e };
  const n = qa[t.setCode?.toLowerCase() ?? ""] ?? [];
  if (!n.length) return { materials: e };
  let o;
  const s = { ...e };
  for (const [a, i] of Object.entries(e)) {
    const d = JSON.stringify(i);
    for (const l of n) {
      const u = l.materials.find((g) => g.url === a && g.adjustment === d);
      if (!u) continue;
      if (l.stock && mr(t) && (o = l.stock), u.bakedStock && o) {
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
  if (r && mr(t)) {
    const a = (yd[t.setCode?.toLowerCase() ?? ""] ?? []).find(
      (i) => i.set === t.setCode?.toLowerCase() && r.geometry === i.geometry && r.url.startsWith(i.prefix) && (i.family === "retro" ? /^[wubrgacml]{1,2}\.png$/.test(r.url.slice(i.prefix.length)) : /^(W|U|B|R|G|WU|WB|WR|WG|UB|UR|UG|BR|BG|RG|Artifact|Gold|Colourless)\.webp$/.test(
        r.url.slice(i.prefix.length)
      ))
    );
    a && (o = a.stock, r.mask && (s[r.url] = {
      ...s[r.url] ?? { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
      outerStock: bd(o),
      outerStockMaskSource: r.mask
    }));
  }
  return { materials: s, ...o ? { stock: o } : {} };
}
const wd = { "10e": "cmrsu", "2ed": "cmrsu", "2x2": "cmrsu", "2xm": "cmrsu", "30a": "cmrsu", "3ed": "cmrsu", "40k": "cmrsu", "4ed": "cmrsu", "5dn": "cmrsu", "5ed": "cmrsu", "6ed": "cmrsu", "7ed": "cmrsu", "8ed": "cmrsu", "9ed": "cmrsu", a25: "cmrsu", acr: "cmrsu", aer: "cmrsu", afc: "cmrsu", afr: "cmrsu", akh: "cmrsu", akr: "cmrsu", ala: "cmrsu", all: "cmrsu", ana: "cmrsu", apc: "cmrsu", arb: "cmrsu", arc: "cmrsu", archie: "cmrsu", arena: "cmrsu", arn: "cmrsu", ath: "cmrsu", atq: "cmrsu", avr: "cmrsu", azorius: "cmru", bbd: "cmrsu", bfz: "cmrsu", big: "cmrsu", blb: "cmrsu", blc: "cmrsu", bng: "cmrsu", bok: "cmrsu", boros: "cmru", bot: "cmrsu", brb: "cmrsu", brc: "cmrsu", bro: "cmrsu", brr: "cmrsu", btd: "cmrsu", c13: "cmrsu", c14: "cmrsu", c15: "cmrsu", c16: "cmrsu", c17: "cmrsu", c18: "cmrsu", c19: "cmrsu", c20: "cmrsu", c21: "cmrsu", cc1: "cmrsu", cc2: "cmrsu", ced: "cmrsu", cei: "cmrsu", chk: "cmrsu", chr: "cmrsu", clb: "cmrsu", clu: "cmrsu", cm1: "cmrsu", cm2: "cmrsu", cma: "cmrsu", cmd: "cmrsu", cmm: "cmrsu", cmr: "cmrsu", cn2: "cmrsu", cns: "cmrsu", con: "cmrsu", conf: "cmrsu", csp: "cmrsu", dci: "cmrsu", dd1: "cmrsu", dd2: "cmrsu", ddc: "cmrsu", ddd: "cmrsu", dde: "cmrsu", ddf: "cmrsu", ddg: "cmrsu", ddh: "cmrsu", ddi: "cmrsu", ddj: "cmrsu", ddk: "cmrsu", ddl: "cmrsu", ddm: "cmrsu", ddn: "cmrsu", ddo: "cmrsu", ddp: "cmrsu", ddq: "cmrsu", ddr: "cmrsu", dds: "cmrsu", ddt: "cmrsu", ddu: "cmrsu", default: "cmrsu", dft: "cmrsu", dgm: "cmrsu", dimir: "cmru", dis: "cmrsu", dka: "cmrsu", dkm: "cmrsu", dmc: "cmrsu", dmr: "cmrsu", dmu: "cmrsu", dom: "cmrsu", dpa: "cmrsu", drb: "cmrsu", drc: "cmrsu", drk: "cmrsu", dsc: "cmrsu", dsk: "cmrsu", dst: "cmrsu", dtk: "cmrsu", e01: "cmrsu", e02: "cmrsu", ecc: "cmrsu", ecl: "cmrsu", eld: "cmrsu", ema: "cmrsu", emn: "cmrsu", eoc: "cmrsu", eoe: "cmrsu", eos: "cmru", eve: "cmrsu", exo: "cmrsu", exp: "cmrsu", fca: "cmrsu", fdc: "cmrsu", fdn: "cmrsu", fem: "cmrsu", fic: "cmrsu", fin: "cmrsu", fnm: "r", fra: "cmrsu", frc: "cmrsu", frf: "cmrsu", fut: "cmrsu", gn2: "cmrsu", gn3: "cmrsu", gnt: "cmrsu", golgari: "cmru", gpt: "cmrsu", grn: "cmrsu", gruul: "cmru", gs1: "cmrsu", gtc: "cmrsu", h09: "cmrsu", h17: "cmrsu", ha1: "cmrsu", hbg: "cmrsu", hml: "cmrsu", hob: "cmrsu", hoc: "cmrsu", hop: "cmrsu", hou: "cmrsu", ice: "cmrsu", idw: "cmrsu", iko: "cmrsu", ima: "cmrsu", inr: "cmrsu", inv: "cmrsu", isd: "cmrsu", izzet: "cmru", j20: "cmrsu", j21: "cmrsu", j22: "cmrsu", j25: "cmru", jmp: "cmrsu", jou: "cmrsu", jud: "cmrsu", khc: "cmrsu", khm: "cmrsu", kld: "cmrsu", klr: "cmrsu", ktk: "cmrsu", lcc: "cmrsu", lci: "cmrsu", lea: "cmrsu", leb: "cmrsu", leg: "cmrsu", lgn: "cmrsu", lrw: "cmrsu", ltc: "cmrsu", ltr: "cmrsu", m10: "cmrsu", m11: "cmrsu", m12: "cmrsu", m13: "cmrsu", m14: "cmrsu", m15: "cmrsu", m19: "cmrsu", m20: "cmrsu", m21: "cmrsu", m3c: "cmrsu", mat: "cmrsu", mb2: "cmrsu", mbc: "cmrsu", mbs: "cmrsu", mc3: "cmrsu", md1: "cmrsu", me1: "cmrsu", me2: "cmrsu", me3: "cmrsu", me4: "cmrsu", med: "cmrsu", mh1: "cmrsu", mh2: "cmrsu", mh3: "cmrsu", mic: "cmrsu", mid: "cmrsu", mir: "cmrsu", mkc: "cmrsu", mkm: "cmrsu", mm2: "cmrsu", mm3: "cmrsu", mma: "cmrsu", mmq: "cmrsu", moc: "cmrsu", mom: "cmrsu", mor: "cmrsu", mp2: "cmrsu", mps: "cmrsu", mrd: "cmrsu", msc: "cmrsu", msh: "cmrsu", mtga: "cmrsu", mtgo: "cmrsu", mul: "cmrsu", ncc: "cmrsu", nec: "cmrsu", nem: "cmrsu", neo: "cmrsu", nph: "cmrsu", ody: "cmrsu", ogw: "cmrsu", om1: "cmrsu", omb: "cmrsu", onc: "cmrsu", one: "cmrsu", ons: "cmrsu", ori: "cmrsu", orzhov: "cmru", otc: "cmrsu", otj: "cmrsu", otp: "cmrsu", p02: "cmrsu", papac: "cmrsu", parl2: "cmrsu", past: "cmrsu", pbook: "cmrsu", pc2: "cmrsu", pca: "cmrsu", pcy: "cmrsu", pd2: "cmrsu", pd3: "cmrsu", pdrc: "c", peuro: "cmrsu", pgru: "c", phpr: "cmrsu", phuk: "cmrsu", pidw: "cmrsu", pio: "cmrsu", pip: "cmrsu", planeswalker: "cmrsu", plc: "cmrsu", pls: "cmrsu", pmps: "cmrsu", por: "cmrsu", prm: "cmrsu", ps11: "cmrsu", psal: "cmrsu", psdg: "cmrsu", psum: "cmrsu", ptg: "cmrsu", ptk: "cmrsu", pvan: "c", pxbox: "cmrsu", pz1: "cmrsu", pz2: "cmrsu", pza: "cmrsu", rav: "cmrsu", ren: "cmrsu", rex: "cmrsu", rin: "cmrsu", rix: "cmrsu", rna: "cmrsu", roe: "cmrsu", rtr: "cmrsu", rvr: "cmrsu", s00: "cmrsu", s99: "cmrsu", scd: "cmrsu", scg: "cmrsu", sds: "cmrsu", selesnya: "cmru", shm: "cmrsu", simic: "cmru", sir: "cmrsu", sis: "cmrsu", sld: "cmrsu", snc: "cmrsu", soa: "cmrsu", soc: "cmrsu", soi: "cmrsu", sok: "cmrsu", som: "cmrsu", sos: "cmrsu", spe: "cmrsu", spg: "cmrsu", spm: "cmrsu", ss1: "cmrsu", ss2: "cmrsu", ss3: "cmrsu", sta: "cmrsu", star: "cmrsu", sth: "cmrsu", stx: "cmrsu", td0: "cmrsu", td2: "cmrsu", tdc: "cmrsu", tdm: "cmrsu", thb: "cmrsu", ths: "cmrsu", tla: "cmrsu", tle: "cmrsu", tlr: "c", tmc: "cmrsu", tmp: "cmrsu", tmt: "cmrsu", tor: "cmrsu", tpr: "cmrsu", trc: "cmrsu", trk: "cmrsu", tsp: "cmrsu", tsr: "cmrsu", uds: "cmrsu", ugl: "cmrsu", ulg: "cmrsu", uma: "cmrsu", und: "cmrsu", unf: "cmrsu", unh: "cmrsu", usg: "cmrsu", ust: "cmrsu", v09: "cmrsu", v10: "cmrsu", v11: "cmrsu", v12: "cmrsu", v13: "cmrsu", v14: "cmrsu", v15: "cmrsu", v16: "cmrsu", v17: "cmrsu", van: "cmrsu", vis: "cmrsu", vma: "cmrsu", voc: "cmrsu", vow: "cmrsu", w16: "cmrsu", w17: "cmrsu", war: "cmrsu", who: "cmrsu", woc: "cmrsu", woe: "cmrsu", wor: "u", wot: "cmrsu", wth: "cmrsu", wwk: "cmrsu", x2ps: "cmrsu", xln: "cmrsu", y22: "cmrsu", y23: "cmrsu", y24: "cmrsu", y25: "cmrsu", y26: "cmrsu", zen: "cmrsu", znc: "cmrsu", zne: "cmrsu", znr: "cmrsu" }, Sd = {
  codes: wd
}, vd = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), Cd = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function Ha(t) {
  return vd.has(t?.trim().toLowerCase() ?? "");
}
function kd(t) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(t?.toLowerCase() ?? "") ? 0 : 1;
}
function Td(t, e) {
  const r = t?.trim().toLowerCase() ?? "";
  return Cd.has(r) || r === "atq" && e === "Reconstruction";
}
const P = V.CONJURER_ROOT, Xa = `${P}/img/setSymbols/official/`, hs = Sd.codes, Md = {
  common: "c",
  uncommon: "u",
  rare: "r",
  mythic: "m",
  special: "s",
  bonus: "s"
};
function Ja(t, e = "common", r = "auto") {
  const n = t.trim().toLowerCase();
  if (r === "keyrune") return null;
  const o = Ha(n) ? "c" : Md[e];
  return o && Object.hasOwn(hs, n) && hs[n].includes(o) ? `${Xa}${n}-${o}.svg` : null;
}
function Ut(t) {
  return !!t?.startsWith(Xa);
}
const xd = V.KEYRUNE_ROOT, Rd = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function de(t) {
  return !t.setSymbol && !Ja(t.setCode ?? "", t.rarity, t.setSymbolSource) ? Rd[t.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1] : [0, 0, 1, 1];
}
const Ka = new Set(
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
Ka.add("con_");
const Ad = "GLINT", Nr = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function Ed(t) {
  const e = Nr[t] ?? Nr.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${e}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function Ld(t) {
  const e = Nr[t] ?? Nr.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${e}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function Bd(t, e = "common", r) {
  const n = t.trim().toLowerCase();
  if (n === "forge") return Ld(e);
  if (n === Ad.toLowerCase()) return Ed(e);
  const o = Ja(n, e, r);
  if (o) return o;
  const s = n === "con" ? "con_" : n === "p02" ? "po2" : n;
  return Ka.has(s) ? `${xd}/${s}.svg` : null;
}
const ms = {
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
function Va(t) {
  return Object.hasOwn(ms, t) ? ms[t] : null;
}
const Ue = V.RENDERER_COMPONENT_ROOT;
function Ce(t, e = "normal") {
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
function je(t) {
  const e = t.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = e === "∞" ? "INFINITY" : e === "½" ? "HALF" : e.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? Ot("symbols", r) : null;
}
function Za(t, e, r) {
  return Bd(t, e, r);
}
function Ot(t, e) {
  const r = t === "legendary-crowns" ? "legendary_crowns" : t === "pt-boxes" ? "pt_boxes" : t === "nameplates" ? "boxes" : t, n = t === "symbols" ? "svg" : "webp";
  return `${Ue}/img/${r}/${encodeURIComponent(e)}.${n}`;
}
function Q(t, e = t.rarity) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  const r = t.setCode?.trim().toLowerCase() ?? "";
  return t.setSymbol ?? Za(
    r === "chr" ? Va(t.name) ?? "" : r,
    e,
    t.setSymbolSource
  );
}
function Id(t) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  if (Ut(t.setSymbol)) {
    const e = new URL(t.setSymbol).pathname.match(/\/([^/]+)-[curms]\.svg$/)?.[1];
    if (e) return Za(e, "common", "cardconjurer");
  }
  return Q(t, "common");
}
function Wt(t, e) {
  return t.setCode?.toLowerCase() === "plc" && t.frameAssetFamily === "eighth" && !t.frameTemplate && (!t.layout || t.layout === "normal") && (!t.borderColor || t.borderColor === "black") && e.startsWith(`${P}/img/frames/8th/`) && /^(?:[wubrgm]|colorshifted\/[wubrg])\.png$/.test(
    e.slice(`${P}/img/frames/8th/`.length)
  );
}
const zn = (t) => 244 + (t - 244) * 1.006 - 0.5, Yn = (t) => 340 + (t - 340) * 1.008 + 0.25;
function Cn([t, e, r, n]) {
  return [zn(t * 488) / 488, Yn(e * 680) / 680, r * 1.006, n * 1.008];
}
function Od([t, e, r, n], o) {
  const [s, a, i, d] = o ? [1.03, -0.5, 1.025, 2.5] : [1.005, 0.25, 1.005, 2.75];
  return [
    (407 + (t * 488 - 407) * s + a) / 488,
    (626 + (e * 680 - 626) * i + d) / 680,
    r * s,
    n * i
  ];
}
function po(t, e, r = !1) {
  const [n, o, s, a] = r ? [21, 18.75, 467.5, 661] : [22, 22, 466, 658];
  t.save(), t.beginPath(), t.rect(0, 0, 488, 680), t.rect(n, o, s - n, a - o), t.clip("evenodd"), t.drawImage(e, 0, 0, 488, 680), t.restore();
  const i = [22, 28, 460, 466], d = [22, 28, 638, 658], l = [n, zn(28), zn(460), s], u = [o, Yn(28), Yn(638), a];
  for (let h = 0; h < d.length - 1; h++)
    for (let m = 0; m < i.length - 1; m++) {
      const c = i[m], g = d[h], f = l[m], y = u[h];
      t.drawImage(
        e,
        c / 488 * e.width,
        g / 680 * e.height,
        (i[m + 1] - c) / 488 * e.width,
        (d[h + 1] - g) / 680 * e.height,
        f,
        y,
        l[m + 1] - f,
        u[h + 1] - y
      );
    }
}
const $d = /* @__PURE__ */ new Set(["artist", "legal", "collector", "manaCost", "setSymbol"]);
function Qa(t) {
  if (t.printingElements !== void 0) {
    if (!t.printingElements || typeof t.printingElements != "object" || Array.isArray(t.printingElements))
      throw Error("Printing elements must be an object");
    if (Object.keys(t.printingElements).length) {
      if (t.faces?.length || t.layout && !["normal", "token"].includes(t.layout) || t.frameTemplate && t.frameTemplate !== "future" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
        throw Error("Printing element controls require an ordinary face or Futureshifted template.");
      for (const [e, r] of Object.entries(t.printingElements)) {
        if (!$d.has(e) || !r || typeof r != "object" || Array.isArray(r))
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
function X(t, e, r, n) {
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
const ti = {
  plc: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 165 },
  fut: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 180 },
  "8ed": { legal: "™ & © 1993–2003 Wizards of the Coast, Inc.", total: 350 },
  m15: { legal: "™ & © 2014 Wizards of the Coast", total: 269 },
  war: { legal: "™ & © 2019 Wizards of the Coast", total: 264 },
  m21: { legal: "™ & © 2020 Wizards of the Coast", total: 274 },
  fdn: { legal: "™ & © 2024 Wizards of the Coast", format: "rarity-first" }
};
function yo(t) {
  return t.printingElements?.legal?.hidden ? null : t.legalText === void 0 ? ti[t.setCode?.toLowerCase() ?? ""]?.legal ?? null : t.legalText;
}
function bo(t, e = !0) {
  if (t.printingElements?.collector?.hidden) return "";
  const r = t.collectorNumber?.trim();
  if (!r) return "";
  const n = ti[t.setCode?.toLowerCase() ?? ""], o = t.collectorFormat ?? n?.format ?? "number-first", s = /^Basic (?:Snow )?Land\b/.test(t.typeLine ?? "") ? "L" : (t.rarity ?? "common")[0].toUpperCase();
  if (e && o === "rarity-first")
    return `${s} ${r.split("/")[0].replace(/^(\d+)/, (u) => u.padStart(4, "0"))}`;
  const a = /^\d+$/.test(r), i = e && a ? r.padStart(3, "0") : r, d = t.collectorTotal === void 0 ? n?.total : t.collectorTotal, l = d && a && Number(r) <= d ? `${i}/${d}` : i;
  return e ? `${l} ${s}` : l;
}
function ot() {
  const t = typeof document < "u" ? document.fonts : globalThis.fonts;
  if (!t) throw Error("Card fonts require a document or worker FontFaceSet");
  return t;
}
function ei(t, e) {
  return Wt(t, e) ? "CardRenderer MTG ModMatrix" : void 0;
}
function cs(t, e) {
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
      const a = t.measureText(o), i = s + (a.actualBoundingBoxRight - a.actualBoundingBoxLeft) / 2, d = 627 + (a.actualBoundingBoxDescent - a.actualBoundingBoxAscent) / 2;
      t.save(), t.translate(i, d + 1.25), t.scale(0.775, 0.775), t.translate(-i, -d), t.fillText(o, s, 627), t.restore();
    } else t.fillText(o, s, 627);
    n += o;
  }
  t.restore();
}
function kn(t, e, r, n) {
  if (!Wt(e, r)) return;
  const [o, s, a, i, d, l] = n === "artist" ? [77, 634, -1, 3.25, 0.995, 1] : n === "legal" ? [36.5, 647, 4.5, 4.75, 0.995, 1.1] : [407, 627, 2, -2.25, 1.03, 1.01];
  t.translate(o + a, s + i), t.scale(d * l, d), t.translate(-o, -s);
}
let gs = null;
function Gd(t, e) {
  const r = ei(t, e);
  return !r || t.power == null || t.toughness == null ? Promise.resolve() : gs ??= ot().load(`700 29px "${r}"`).then((n) => {
    if (!n.length || n.some((o) => o.status !== "loaded"))
      throw Error("Planar Chaos P/T needs card-glint/magic/fonts.css.");
  }).catch((n) => {
    throw gs = null, n;
  });
}
function ri(t) {
  return ["B", "Colourless", "Land"].includes(U(t).boxes);
}
function ni(t) {
  return t.frameAssetFamily !== "eighth" || !t.artist ? null : `${P}/img/manaSymbols/${ri(t) ? "whitebrush" : "brush"}.svg`;
}
function fs(t, e) {
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
      for (let d = 0; d < 10; d++) {
        const l = -Math.PI / 2 + d * Math.PI / 5, u = d % 2 ? 3.1 : 7.5, h = s + 7.5 + u * Math.cos(l), m = 622 + u * Math.sin(l);
        d === 0 ? t.moveTo(h, m) : t.lineTo(h, m);
      }
      t.closePath(), t.fill();
    } else t.fillText(i, s, 627);
    s += n[a];
  }
  t.restore();
}
function Pd(t, e, r, n = "") {
  if (t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.letterSpacing = "0px", e.power != null && e.toughness != null) {
    t.save(), kn(t, e, n, "stats");
    const h = e.frameTreatment === "colorshifted";
    t.fillStyle = h ? "#fff" : "#17140f", h && (t.shadowColor = "#000", t.shadowOffsetX = -21e-4 * 488, t.shadowOffsetY = 15e-4 * 680);
    const m = ei(e, n);
    t.font = `700 29px "${m ?? "CardRenderer MTG Matrix Small Caps"}", Georgia`, t.textAlign = "center", t.textBaseline = "middle";
    const c = `${e.power}/${e.toughness}`;
    if (e.textInk?.stats?.length) {
      const g = m ? void 0 : (f) => f.split(/(\*)/).reduce((y, b) => y + (b === "*" ? 15 : t.measureText(b).width), 0);
      ht(
        t,
        c,
        407,
        0,
        78,
        e.textInk,
        "stats",
        () => {
          m ? cs(t, c) : fs(t, c);
        },
        g
      );
    } else m ? cs(t, c) : fs(t, c);
    t.restore();
  }
  const o = e.setCode?.toLowerCase(), s = o === "8ed" ? 75 : o === "9ed" ? 79 : 77, a = o === "8ed" || o === "9ed", i = a ? 633 : 634;
  t.fillStyle = ri(e) ? "#fff" : "#17140f", t.textBaseline = "alphabetic", t.textAlign = "left";
  const d = ni(e);
  X(t, e, "artist", () => {
    if (d) {
      t.save(), kn(t, e, n, "artist");
      const h = r.get(d);
      if (!h) throw Error(`Eighth Edition artist brush unavailable: ${d}`);
      t.drawImage(h, 36.5, i - 10, s - 39, 13.5), t.font = `700 ${a ? 17.5 : 18}px "CardRenderer MTG Matrix", Georgia`;
      const m = e.power != null && e.toughness != null ? 350 : 448;
      t.fillText(e.artist, s, i, m - s), t.restore();
    }
  });
  const l = yo(e), u = bo(e, !1);
  if (t.save(), kn(t, e, n, "legal"), t.font = '10px "CardRenderer MTG MPlantin", Georgia', !e.printingElements?.collector?.offset && !e.printingElements?.legal?.offset) {
    const h = [l, u].filter(Boolean).join(" ");
    h && t.fillText(h, 36.5, i + 13, 409);
  } else {
    const h = [l, u].filter(Boolean).join(" "), m = Math.min(1, 409 / Math.max(1, t.measureText(h).width));
    t.translate(36.5, i + 13);
    const c = (g, f) => {
      t.save(), t.scale(m, 1), t.fillText(g, f, 0), t.restore();
    };
    l && X(t, e, "legal", () => c(l, 0)), u && X(
      t,
      e,
      "collector",
      () => c(u, t.measureText(l ? l + " " : "").width)
    );
  }
  t.restore(), t.restore();
}
const Wd = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function oi(t) {
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
function wo(t) {
  if (t.wordingMode === "oracle" || !["mir", "tmp"].includes(t.setCode?.toLowerCase() ?? "")) return null;
  const e = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    t.typeLine ?? ""
  )?.[1];
  if (!e) return null;
  const r = Wd[e];
  return oi(t) !== r ? null : {
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
const Fd = {
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
}, _d = {
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
}, Ud = it(
  "DUAL_HSB_PROFILES"
), jd = it(
  "DUAL_MANA_TARGETS"
), ps = it(
  "PRINTING_COLOR_PROFILES"
), Dd = it(
  "ORDINARY_COLOR_PROFILES"
), si = it(
  "LEGENDS_COLOR_PROFILES"
), Nd = it(
  "MANA_PRINTING_TARGETS"
), zd = it(
  "MANA_PRINTING_INK"
), Yd = it(
  "PRINTING_MANA_PROFILES"
), qd = it(
  "MODERN_MANA_OVERRIDES"
), ys = it(
  "RETRO_MANA_PROFILES"
), bs = it(
  "MAJOR_SYMBOL_PROFILES"
), ws = it(
  "MAJOR_FRAME_INSETS"
), Hd = it(
  "EARLY_EXPANSION_FRAMES"
), Xd = it(
  "EARLY_EXPANSION_COLORS"
), Ss = it("EARLY_EXPANSION_MANA_TARGETS"), vs = it("PLANAR_COLORS"), qn = it("PLANAR_TEXTURE");
function So(t) {
  return ["arn", "atq", "drk"].includes(t.setCode?.toLowerCase() ?? "") && st(t) && !t.frameTemplate && (t.layout ?? "normal") === "normal" && Rt(t) === "black" && !U(t).legendary && !/^Level up\b/m.test(t.rulesText ?? "") && t.symbolStyle !== "modern" && !(t.symbolStyle === void 0 && t.wordingMode === "oracle");
}
function vo(t) {
  if (t.setCode?.toLowerCase() !== "arn" || !So(t)) return;
  const e = t.collectorNumber ?? "";
  return /^\d+†$/.test(e) ? "light" : /^\d+$/.test(e) ? "dark" : void 0;
}
const Jd = {
  W: [105, 117, 115],
  U: [53, 97, 116],
  B: [66, 78, 76],
  R: [96, 52, 46],
  G: [57, 92, 84],
  A: [92, 90, 83]
};
function Kd(t) {
  if (vo(t) !== "dark") return;
  const e = W(t), n = U(t).artifact ? "A" : e.length === 1 ? e[0] : "", o = Jd[n];
  return o ? { fill: t.calibration !== "source" && (t.calibration === "auto" || t.colorCalibration === "set-hsb-v1") ? `rgba(${o.join(",")},0.8)` : "rgba(0,0,0,0.4)" } : void 0;
}
function Vd(t, e, r, n, o, s, a) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = s.fill, t.beginPath(), t.arc(r + o / 2 - 0.25, n + o / 2 - 0.5, o / 2 * 0.81, 0, Math.PI * 2), t.fill(), t.font = '100px "CardRenderer MTG MPlantin"', t.textAlign = "left", t.textBaseline = "alphabetic", t.fillStyle = "#111";
  const i = t.measureText(e), d = o * 0.7 * (a.numberScale ?? 1) / (i.actualBoundingBoxAscent + i.actualBoundingBoxDescent);
  t.translate(
    r + o / 2 + (a.numberDx ?? 0),
    n + o / 2 + (a.numberDy ?? 0)
  ), t.scale(d, d), t.fillText(
    e,
    (i.actualBoundingBoxLeft - i.actualBoundingBoxRight) / 2,
    (i.actualBoundingBoxAscent - i.actualBoundingBoxDescent) / 2
  ), t.restore();
}
function Et(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !wt(t) || t.frameTemplate || t.frameAssetFamily || t.frameStyle === "modern" || t.borderColor && t.borderColor !== wt(t).border || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", n = W(t), o = t.land ?? /\bLand\b/.test(r);
  let s;
  if (o) {
    const l = {
      Plains: "W",
      Island: "U",
      Swamp: "B",
      Mountain: "R",
      Forest: "G"
    }[t.name], u = t.frameColors ?? (l ? [l] : []);
    if (u.length) {
      if (e !== "4ed" || u.length !== 1) return;
      s = `L-${u[0]}`;
    } else s = "L";
  } else
    s = t.artifact ?? /\bArtifact\b/.test(r) ? "A" : n.length === 1 ? n[0] : n.length > 1 ? "M" : void 0;
  const a = s && wt(t).frames[s];
  if (!a) return;
  const i = s === "L" ? e === "chr" && t.name === "Safe Haven" ? "L-dark" : e === "chr" && t.name === "City of Brass" || e === "4ed" && t.name === "Oasis" ? "L-gold" : "L-red" : s;
  return {
    ...a,
    material: s,
    profile: `${e}/${i}`,
    asset: `${V.RETRO_ROOT}/img/frames/old/${a.family}/${a.assetKey}.png`
  };
}
function br(t) {
  return !!Et(t) && !/^Level up\b/m.test(t.rulesText ?? "") && t.symbolStyle !== "modern" && !(t.symbolStyle === void 0 && t.wordingMode === "oracle");
}
function Zd(t) {
  return br(t) ? wt(t).mana.geometry : void 0;
}
function Qd(t, e) {
  return br(t) ? wt(t).mana.paper[e === "X" ? "N" : e] : void 0;
}
function t0(t) {
  return t.calibration !== "source" && t.colorCalibration === "set-hsb-v1" && br(t) ? wt(t).mana.ink : void 0;
}
function wr(t, e) {
  if (!(t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle"))
    return Fd[t.setCode?.toLowerCase() ?? ""]?.[e];
}
function Hn(t, e) {
  const r = wr(t, e), n = r && r !== "modern" && r !== "historic-font" ? _d[`${e}/${r}`] : void 0, o = ai(t, e);
  return n && o ? { ...n, inkExpansion: o.pixels } : n;
}
function e0(t, e) {
  return e === "B" && br(t) ? "opaque-percentile" : ai(t, e)?.paperSample;
}
function ai(t, e) {
  const r = zd[`${t.setCode?.toLowerCase()}/${e}`];
  if (!(!r || r.family !== wr(t, e)) && !(r.paperSample && !So(t)))
    return r;
}
const r0 = {
  shadow: [-1.0372, 2.0372],
  paper: [202, 197, 192],
  ink: [13, 15, 15]
};
function ii(t) {
  return !st(t) && t.frameAssetFamily === void 0 && t.frameTemplate === void 0 && (t.layout ?? "normal") === "normal" && !/\b(Saga|Class|Planeswalker|Battle)\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") && !/^Level up\b/m.test(t.rulesText ?? "");
}
function li(t) {
  return ii(t) ? r0 : void 0;
}
function di(t, e) {
  return li(t) && /^\d$/.test(e) ? `${P}/img/manaSymbols/${e}.svg` : null;
}
function jt(t) {
  const e = [
    t.rulesText ?? "",
    ...(t.rulesParagraphs ?? []).flatMap((n) => n.runs.map((o) => o.text))
  ], r = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...e.flatMap(
      (n) => ln(n).flatMap((o) => o.symbol ? [o.symbol] : [])
    )
  ]);
  return [
    ...(t.manaSymbols ?? []).flatMap((n) => {
      const o = di(t, n);
      return o ? [o] : [];
    }),
    ...[...r].map(
      (n) => wr(t, n) === "historic-font" ? null : Hn(t, n)?.url ?? je(n)
    )
  ];
}
const Cs = [19.375 / 488, 21.125 / 680, 449.625 / 488, 639.25 / 680], ks = {
  W: {
    family: "abu",
    stockWindow: Cs,
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
    stockWindow: Cs,
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
function kt(t) {
  if (t.setCode?.toLowerCase() !== "leg" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const e = t.typeLine ?? "", r = W(t), n = t.land ?? /\bLand\b/.test(e) ? "L" : t.artifact ?? /\bArtifact\b/.test(e) ? "A" : r.length > 1 ? "M" : r[0];
  if (!n || !(n in ks)) return;
  const o = ks[n];
  return {
    ...o,
    material: n,
    asset: `${V.RETRO_ROOT}/img/frames/old/${o.family}/${n.toLowerCase()}.png`
  };
}
function Xe(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !["arn", "atq", "drk"].includes(e) || t.frameTemplate || t.frameStyle === "modern" || t.borderColor && t.borderColor !== "black" || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", n = W(t), o = t.land ?? /\bLand\b/.test(r);
  if (o && (/\b(Basic|Plains|Island|Swamp|Mountain|Forest)\b/.test(r) || e === "arn" && t.name === "Mountain"))
    return;
  const s = o ? "L" : t.artifact ?? /\bArtifact\b/.test(r) ? "A" : n.length === 1 ? n[0] : n.length > 1 ? "M" : void 0, a = s && Hd[`${e}/${s}`];
  if (a)
    return {
      ...a,
      material: s,
      asset: `${V.RETRO_ROOT}/img/frames/old/${a.family}/${s.toLowerCase()}.png`
    };
}
function n0(t) {
  if (t.colorCalibration !== "set-hsb-v1" || t.borderColor && t.borderColor !== "black")
    return;
  const e = kt(t);
  return e && si[`leg/black/retro/${e.material.toLowerCase()}.png`]?.source === JSON.stringify([e.asset, e.frame]) ? "#262626" : void 0;
}
function bt(t) {
  return t.setCode?.toLowerCase() === "3ed" && !t.frameTemplate && t.frameStyle !== "modern" && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") && (!t.layout || t.layout === "normal") && (t.land ?? /\bLand\b/.test(t.typeLine ?? ""));
}
const ir = `${V.RETRO_ROOT}/img/frames/old/fourth/l.png`, o0 = [2.404 / 488, 9.9 / 680, 0.984, 0.99], s0 = [
  (2.404 + 0.10533333333333333 * 488 * 0.984) / 488,
  (9.9 + 0.08571428571428572 * 680 * 0.99) / 680,
  0.7926666666666666 * 0.984,
  0.4552380952380952 * 0.99
];
function ui(t) {
  const e = t.frameColors ?? [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(([r]) => new RegExp(`\\b${r}\\b`).test(t.typeLine ?? "")).map(([, r]) => r);
  return [...new Set(e)].filter((r) => "WUBRG".includes(r)).sort((r, n) => "RBWUG".indexOf(r) - "RBWUG".indexOf(n));
}
const hi = {
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
function Co(t) {
  if (t.setCode?.toLowerCase() !== "3ed" || t.frameTemplate || t.frameStyle === "modern" || t.borderColor && t.borderColor !== "white" || bt(t) || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return null;
  if (/\bArtifact\b/.test(t.typeLine ?? "")) return "A";
  const e = W(t);
  if (e.length !== 1) return null;
  const r = e[0];
  return r === "W" || r === "U" || r === "B" || r === "R" || r === "G" ? r : null;
}
function mi(t) {
  const e = Co(t);
  if (!e) return null;
  const {
    x: [r, n],
    y: [o, s]
  } = hi[e];
  return [
    (244 + (0.012 * 488 - 244) * r + n) / 488,
    (340 + (0.01 * 680 - 340) * o + s) / 680,
    0.974 * r,
    0.982 * o
  ];
}
function a0(t) {
  const e = Co(t), r = mi(t);
  if (!e || !r) return null;
  const [n, o, s, a] = hi[e].aperture;
  return [r[0] + n * r[2], r[1] + o * r[3], s * r[2], a * r[3]];
}
function ci(t) {
  return Co(t) !== null;
}
const i0 = V.RETRO_SYMBOL_FONT, De = V.RETRO_ROOT, l0 = `${De}/fonts/goudy-medieval.ttf`, d0 = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), u0 = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function st(t) {
  return t.frameTemplate || t.layout && !["normal", "token"].includes(t.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") ? !1 : t.frameStyle === "retro" || t.frameStyle !== "modern" && d0.has(t.setCode?.toLowerCase() ?? "");
}
function ko(t) {
  return ["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "");
}
function $t(t) {
  const e = Et(t);
  if (e) return e.family;
  const r = t.setCode?.toLowerCase() ?? "", n = Xe(t);
  if (n) return n.family;
  const o = kt(t);
  return o ? o.family : ko(t) ? "abu" : r === "leg" && W(t).length > 1 ? "legends" : bt(t) || ["3ed", "4ed", "5ed", "atq"].includes(r) && !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) ? "fourth" : "seventh";
}
function Sr(t) {
  const e = Et(t);
  if (e) return e.frame;
  const r = Xe(t);
  if (r) return r.frame;
  const n = kt(t);
  if (n) return n.frame;
  if (bt(t)) return o0;
  const o = mi(t);
  return o || ($t(t) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1]);
}
function dn(t) {
  const e = ko(t), r = kt(t) && (!t.borderColor || t.borderColor === "black");
  return {
    ...Z,
    frame: Sr(t),
    title: [e ? 0.07 : 0.1134, 0.0481, e ? 0.8467 : 0.8, 0.043],
    art: Et(t)?.art ?? Xe(t)?.art ?? kt(t)?.art ?? a0(t) ?? (bt(t) ? s0 : $t(t) === "legends" ? [0.112, 0.094, 0.78, 0.45] : $t(t) === "fourth" ? [0.109, 0.093, 0.779, 0.453] : e ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429]),
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: r ? [384 / T, 617 / E, 72 / T, 30 / E] : [0.8074, 0.895, 0.1367, 0.043],
    footer: r ? [48 / T, 624 / E, 340 / T, 24 / E] : [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function Zt(t) {
  const e = Et(t);
  if (e) return e.asset;
  const r = Xe(t);
  if (r) return r.asset;
  const n = kt(t);
  if (n) return n.asset;
  if (bt(t)) return ir;
  const o = ie(t);
  if (o) return o.base;
  const s = W(t), a = t.canonicalTypeLine ?? t.typeLine ?? "", i = U(t), d = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([c]) => a.includes(c)), l = t.frameColors?.map((c) => c.toLowerCase()) ?? d.map(([, c]) => c), u = i.land ? l.length === 1 ? l[0] + "l" : "l" : i.artifact ? "a" : s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c", h = $t(t), m = h === "seventh" || u === "c" || h === "abu" && u === "m" ? "seventh/regular" : `old/${h}`;
  return `${De}/img/frames/${m}/${h === "legends" ? "legendsFrameM" : u}.png`;
}
function Rt(t) {
  return t.borderColor ?? (u0.has(t.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function h0(t) {
  return Rt(t) === "silver" ? Pt(null, "silver").border : Rt(t) === "white" ? c0 : n0(t) ?? "#080808";
}
function To(t) {
  return $t(t) === "fourth" ? `${De}/img/frames/old/fourth/borderBlack.png` : `${De}/img/frames/${$t(t) === "abu" ? "old/abu" : "seventh/regular"}/border.svg`;
}
function Ts(t) {
  return ko(t) ? "#ababab" : "#f2eee3";
}
function m0(t) {
  return t.setCode?.toLowerCase() === "7ed" && W(t).some((e) => e === "W" || e === "G") && !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) ? "saturate(.7) brightness(.88)" : "none";
}
function Mo(t) {
  if (wo(t)) return null;
  const e = oi(t);
  return e ? `${De}/img/frames/m15/basics/${e.toLowerCase()}.png` : null;
}
const c0 = "#eeedeb";
function gi(t) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  const e = t.setCode?.toLowerCase() ?? "";
  return !t.setSymbol && e === "ice" && t.setSymbolSource === "keyrune" ? `${V.KEYRUNE_ROOT}/ice2.svg` : !t.setSymbol && Td(e, t.name) ? null : Q(t);
}
function Pf(t) {
  const e = (t.rulesText ?? "").length;
  return e > 340 ? 16 : e > 210 ? 19 : 23;
}
function g0(t) {
  const e = ie(t);
  return [
    Mo(t),
    Zt(t),
    e?.overlay,
    e?.mask,
    !bt(t) && !ci(t) && (Rt(t) !== "black" || $t(t) === "fourth" || mr(t)) ? To(t) : null,
    t.illustration,
    gi(t),
    ...jt(t)
  ];
}
const xt = ([t, e, r, n]) => [
  t * T,
  e * E,
  r * T,
  n * E
];
function Wf(t, e) {
  return ["7ed", "8ed", "9ed"].includes(t?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(e ?? "") ? "black" : void 0;
}
function xo(t, e) {
  const r = yr(t)?.toLowerCase();
  return t.setCode?.toLowerCase() === "8ed" && t.frameAssetFamily === "eighth" && !t.frameTemplate && (!t.layout || t.layout === "normal") && (!t.borderColor || t.borderColor === "white") && (t.frameColors === void 0 || t.frameColors.length === 1 && t.frameColors[0]?.toLowerCase() === r) && !!r && e === `${P}/img/frames/8th/${r}l.png`;
}
const Xn = (t) => 244 + (t - 244) * 1.004 - 1.25, Jn = (t) => 340 + (t - 340) * 1.005 - 0.5;
function f0([t, e, r, n]) {
  return [Xn(t * 488) / 488, Jn(e * 680) / 680, r * 1.004, n * 1.005];
}
function p0(t, e) {
  t.save(), t.beginPath(), t.rect(0, 0, 488, 680), t.rect(22, 22, 444, 636), t.clip("evenodd"), t.drawImage(e, 0, 0, 488, 680), t.restore();
  const r = [22, 28, 460, 466], n = [22, 28, 624, 658], o = [22, Xn(28), Xn(460), 466], s = [22, Jn(28), Jn(624), 658];
  for (let a = 0; a < n.length - 1; a++)
    for (let i = 0; i < r.length - 1; i++) {
      const d = r[i], l = n[a], u = o[i], h = s[a];
      t.drawImage(
        e,
        d / 488 * e.width,
        l / 680 * e.height,
        (r[i + 1] - d) / 488 * e.width,
        (n[a + 1] - l) / 680 * e.height,
        u,
        h,
        o[i + 1] - u,
        s[a + 1] - h
      );
    }
}
const y0 = {
  w: [22 / 255, 24 / 255, 18 / 255],
  u: [21 / 255, 25 / 255, 31 / 255],
  b: [3 / 255, 7 / 255, 14 / 255],
  r: [31 / 255, 25 / 255, 24 / 255],
  g: [16 / 255, 18 / 255, 21 / 255]
};
function Je(t, e) {
  return t.colorCalibration === "set-hsb-v1" && t.frameTreatment === "colorshifted" && e.includes("/colorshifted/") && Wt(t, e) ? "#181510" : void 0;
}
function b0(t, e) {
  if (!Je(t, e)) return;
  const r = e.split("/").at(-1)?.replace(".png", ""), n = r && y0[r];
  return n ? {
    lift: n,
    transition: 96 / 255,
    ...qn[r].knots.length ? {
      textureMaskSource: `${P}/img/frames/8th/frame.png`,
      texture: qn[r].knots.map(
        ([o, s]) => [o / 255, [s[0] / 255, s[1] / 255, s[2] / 255]]
      )
    } : {}
  } : void 0;
}
function Kn(t, e) {
  if (!Je(t, e)) return;
  const r = e.split("/").at(-1)?.replace(".png", ""), n = r && qn[r];
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
function Mt(t) {
  const e = t.frameTreatment === "colorshifted";
  if (e && t.frameAssetFamily !== "eighth")
    throw Error("Colorshifted treatment requires the eighth frame family.");
  if (!t.frameAssetFamily || ["split", "aftermath"].includes(t.layout ?? "") && t.faces?.length === 2) return null;
  if (st(t) || t.layout && !["normal", "token"].includes(t.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
    throw Error("Replacement frame plates currently support ordinary modern faces only.");
  const r = t.frameAssetFamily === "eighth", n = U(t), o = yr(t), s = t.frameColors === void 0 && o ? [o] : W(t), a = s.length === 2 && "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 ? [...s].reverse() : s, i = r ? "8th" : "m15/new", d = `${P}/img/frames/${i}${e ? "/colorshifted" : ""}`, l = n.land ? "l" : n.artifact ? "a" : /\bVehicle\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "v" : s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c";
  if (e && !["w", "u", "b", "r", "g", "a"].includes(l))
    throw Error("Colorshifted plates support monocolored spells and artifacts only.");
  const u = (v) => r ? `${v.toLowerCase()}l` : `l${v.toLowerCase()}`, h = n.land && a.length ? u(a.length > 2 ? "m" : a[0]) : l, m = n.land && a.length === 2 ? u(a[1]) : void 0, c = l === "l" ? r ? "l" : "c" : l, g = r ? [0.09, 0.0629, 0.824, 0.0429] : [168 / 2010, 145 / 2814, 0.8292, 0.0543], f = r ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358] : [168 / 2010, 1588 / 2814, 0.8292, 0.0543], y = e ? [0.7234, 0.881, 0.204, 0.0772] : r ? [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814] : [0.7573, 0.8848, 0.188, 0.0733], b = `${d}/${h}.png`, p = xo(t, b), w = Wt(t, b), S = (v) => p ? f0(v) : w ? Cn(v) : v;
  return {
    frame: b,
    rightFrame: m ? `${d}/${m}.png` : void 0,
    pinlines: w && !e && l === "m" && s.length === 2 ? {
      left: `${d}/${a[0].toLowerCase()}.png`,
      right: `${d}/${a[1].toLowerCase()}.png`,
      mask: `${d}/pinline.png`
    } : void 0,
    border: `${P}/img/frames/${i}/border.png`,
    pt: e ? `${P}/img/frames/m15/colorshifted/${c}pt.png` : r ? `${P}/img/frames/8th/pt/${c === "c" ? "l" : c}.png` : `${P}/img/frames/m15/regular/m15PT${c.toUpperCase()}.png`,
    rects: {
      ...Z,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title: w ? Cn(g) : g,
      type: w ? Cn(f) : f,
      art: r ? S([180 / 2010, 341 / 2814, 1656 / 2010, 1216 / 2814]) : [0.0767, 0.1129, 0.8476, 0.4429],
      rules: r ? S([205 / 2010, 1779 / 2814, 1596 / 2010, 729 / 2814]) : [0.086, 1780 / 2814, 0.828, 0.2875],
      stats: w ? Od(y, e) : y,
      footer: r ? [150 / 2010, 1938 / 2100, 0.81, 0.04] : Z.footer
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
function w0(t) {
  const e = Mt(t);
  if (!e) return null;
  const r = ni(t), n = an(t), o = Kn(t, e.frame);
  return [
    ...n ? [n] : [],
    ...o ? [o.maskSource, o.outerMaskSource] : [],
    ...r ? [r] : [],
    e.frame,
    ...e.rightFrame ? [e.rightFrame] : [],
    ...e.pinlines ? Object.values(e.pinlines) : [],
    ...t.power != null && t.toughness != null ? [e.pt] : [],
    ...Pt(t.setCode, t.borderColor).border !== "#090806" || t.frameAssetFamily === "m15-accurate" && t.calibration !== void 0 && t.calibration !== "source" && t.calibration !== "printing" || Je(t, e.frame) || mr(t) ? [e.border] : []
  ];
}
const S0 = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", cr = {
  artInset: 3,
  artRim: 0.75,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function Ro(t) {
  if (!t.frameAssetFamily && !U(t).legendary && (t.layout ?? "normal") === "normal" && Ue === S0) {
    const e = t.borderColor ?? (Pt(t.setCode).border === "#eeedeb" ? "white" : "black"), r = `${t.setCode?.toLowerCase() ?? ""}/${e}`;
    if (Object.hasOwn(ws, r)) return ws[r];
  }
  return ["m15", "m19", "m20", "war"].includes(t.setCode?.toLowerCase() ?? "") ? cr.frameInset : 0;
}
function v0(t) {
  const e = Ro(t), r = Z.frame[0] * T, n = Z.frame[2] * T, o = Z.art[0] * T + cr.artInset, s = r + e + (o - r) * (1 - 2 * e / n), a = cr.artRim;
  return [
    s / T,
    Z.art[1] + a / E,
    1 - 2 * s / T,
    Z.art[3] - 2 * a / E
  ];
}
function Ao(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !["lea", "leb", "3ed", "leg", "8ed", "m21"].includes(e) || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = Rt(t);
  if (st(t)) {
    if (ie(t) || bt(t)) return;
    const a = Zt(t), i = Sr(t);
    return {
      key: `${e}/${r}/retro/${a.split("/").at(-1)}`,
      family: "retro",
      frame: a,
      rect: i,
      assets: { frame: a },
      source: JSON.stringify([a, i])
    };
  }
  const n = Mt(t);
  if (n)
    return n.rightFrame ? void 0 : {
      key: `${e}/${r}/${t.frameAssetFamily}/${n.frame.split("/").at(-1)}`,
      family: "plate",
      frame: n.frame,
      rect: n.rects.frame,
      assets: { frame: n.frame, pt: n.pt },
      source: JSON.stringify([n.frame, n.rects])
    };
  const o = U(t);
  if (o.land) return;
  const s = Ce(o);
  return {
    key: `${e}/${r}/components/${o.boxes}/${o.frame}`,
    family: "components",
    frame: s.frame,
    rect: Z.frame,
    assets: s,
    source: JSON.stringify([s, Z.frame, Ro(t)])
  };
}
const C0 = {
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
}, fi = (t) => ({
  kind: "polygon",
  feather: 2 / 744,
  points: t.map(([e, r]) => [e / 744, r / 1039])
}), k0 = fi([
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
]), T0 = fi([
  [74, 582],
  [677, 582],
  [688, 590],
  [696, 605],
  [705, 615],
  [705, 628],
  [696, 642],
  [682, 650],
  [82, 650]
]), M0 = { title: [1, 1, 1], type: [1, 1, 1], stats: [1.0297029702970297, 1.0088832487309645, 1.0299401197604792] }, x0 = { title: [0.9047619047619047, 0.9276018099547512, 0.9518072289156626], type: [1.4015151515151516, 1.0086206896551724, 0.9087837837837838], stats: [1.5, 1.1030927835051547, 1.0265624999999998] }, R0 = { title: [0.736842105263158, 0.8620689655172413, 1.03125], type: [0.6666666666666666, 0.8181818181818182, 1.0740740740740742], stats: [0.8936170212765957, 1.0612244897959184, 1.146551724137931] }, A0 = { title: [1.0038560411311055, 0.9704301075268819, 1.1162790697674418], type: [0.9128989361702128, 0.9044117647058825, 1.1458333333333335], stats: null }, E0 = { title: [1.2035714285714287, 1.03, 1.0040322580645162], type: [1.494318181818182, 1.0045731707317074, 1.1860465116279069], stats: [1.5, 1.1079545454545454, 1.276595744680851] }, L0 = { title: [0.8410958904109589, 0.8910614525139665, 0.9060773480662984], type: [1, 1, 1], stats: null }, B0 = {
  W: M0,
  U: x0,
  B: R0,
  R: A0,
  G: E0,
  A: L0
}, Ms = `${V.CONJURER_ROOT}/img/frames/future/regular`, Eo = V.MSE_TEMPLATE_ROOT, It = `${Eo}/magic-future.mse-style`, Mr = `${Eo}/magic-future-textless.mse-style`;
function ct(t) {
  return t.futureTreatment ?? "regular";
}
function pi(t) {
  if ((t.manaSymbols?.length || 0) > 6)
    throw Error("Futureshifted cost exceeds the six source positions");
  if (te(t), ct(t) === "full-art" && (t.rulesParagraphs?.some((e) => e.runs.some((r) => r.text.trim())) || !t.rulesParagraphs && t.rulesText?.trim()))
    throw Error("Futureshifted full-art treatment has no rules panel for the supplied wording");
}
function yi(t) {
  const e = W(t);
  return e.join("") === "WG" ? ["G", "W"] : e.join("") === "WR" ? ["R", "W"] : e;
}
function te(t) {
  const e = U(t), r = yi(t), n = ct(t), o = n === "full-art", s = e.land && !o, a = n === "regular" && !s && !e.artifact && r.length === 0, i = s || a, d = r.length > 1 ? "M" : r[0] ?? (e.artifact ? "A" : "C"), l = (r[0]?.toLowerCase() ?? "c") + "l", u = s && r.length === 2, h = (r[1]?.toLowerCase() ?? "c") + "l", m = t.power != null && t.toughness != null;
  if (o && !/^[WUBRG]$/.test(d))
    throw Error("Futureshifted full-art plates require one printed frame color");
  const c = ["U", "B", "R", "G"].includes(d) && !(s && u), g = t.canonicalTypeLine ?? t.typeLine ?? "", f = [
    "Artifact",
    "Creature",
    "Enchantment",
    "Instant",
    "Land",
    "Planeswalker",
    "Sorcery"
  ].filter((p) => new RegExp(`\\b${p}\\b`).test(g));
  /\b(?:Tribal|Kindred)\b/.test(g) && f.push("Tribal");
  const y = f.length > 1 ? "multitype" : f[0]?.toLowerCase(), b = s ? ["U", "B", "R", "G"].includes(r[0] ?? "") : c;
  return {
    kind: "future",
    base: o ? `${Mr}/${d.toLowerCase()}card.jpg` : i ? `${It}/${a ? "c" : l}card.jpg` : `${Ms}/futureFrame${d}.png`,
    ...o ? { mask: `${Mr}/mask_image.png` } : {},
    ...i ? {
      mask: `${It}/mask_image.png`,
      paper: `${It}/${a ? "c" : e.creature ? d.toLowerCase() : l}textbox.png`,
      type: `${It}/${a ? "c" : l}typeline.png`
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
      stats: o ? `${Mr}/${d.toLowerCase()}pt.jpg` : i ? `${It}/${a ? "c" : l}pt.png` : `${Ms}/futurePT${d}.png`,
      ...o ? { statsMask: `${Mr}/mask_pt.png` } : {}
    } : {},
    ...y ? {
      typeSymbol: `${Eo}/magic-future-common.mse-include/${y}_${b ? "white" : "black"}.png`
    } : {},
    ...t.artist ? {
      brush: `${V.CONJURER_ROOT}/img/manaSymbols/${s || c ? "whitebrush" : "brush"}.svg`
    } : {}
  };
}
function Lo(t) {
  const e = ct(t), r = e === "full-art";
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
const I0 = { frame: [0.9187500000000002, 0.9229729729729731, 1.1260000000000001], title: [0.8812095032397409, 0.8817567567567567, 0.9481792717086837], type: [1.0465277777777777, 1.0163352272727273, 1.1097770154373927], stats: [0.9004329004329005, 0.8952702702702703, 0.9717514124293787] }, O0 = { frame: [0.6021739130434783, 0.7878787878787878, 0.9531772575250836], title: [0.59375, 0.8760683760683762, 0.8777777777777778], type: [0.6702898550724639, 0.9859550561797753, 1.0846774193548387], stats: [0.7395209580838322, 0.8991596638655462, 0.8878378378378378] }, $0 = { frame: [0.8851981351981352, 0.9510309278350517, 0.9543269230769231], title: [0.9145199063231849, 1.0140449438202248, 1.1162790697674418], type: [1.0811023622047244, 0.9044117647058825, 0.7366071428571429], stats: [0.9608294930875576, 1.0552486187845302, 1.180722891566265] }, G0 = { frame: [1, 1, 1], title: [0.9573863636363638, 1.03, 1.3833333333333333], type: [1, 1, 1], stats: [0.9746835443037973, 1.0483870967741935, 1.5] }, P0 = {
  W: I0,
  U: O0,
  R: $0,
  G: G0
}, Bo = (t, e = 375, r = 527) => ({
  kind: "polygon",
  feather: 1 / e,
  points: t.map(([n, o]) => [n / e, o / r])
}), W0 = Bo([
  [44, 60],
  [52, 42],
  [66, 29],
  [75, 26],
  [344, 26],
  [347, 29],
  [347, 60]
]), F0 = Bo([
  [43, 438],
  [337, 438],
  [341, 443],
  [336, 448],
  [335, 458],
  [339, 466],
  [43, 466]
]), _0 = Bo(
  [
    [12, 16],
    [64, 16],
    [64, 35],
    [60, 42],
    [12, 42]
  ],
  78,
  51
), U0 = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, Ae = (t) => ({
  hueDegrees: 0,
  saturationScale: 1,
  brightnessScale: 1,
  rgbScale: t
});
function j0(t) {
  const e = te(t);
  for (const [r, n] of Object.entries(P0)) {
    const o = V.MSE_TEMPLATE_ROOT + "/magic-future-textless.mse-style/";
    if (e.base === o + r.toLowerCase() + "card.jpg")
      return {
        [e.base]: {
          frame: Ae([1, 1, 1]),
          paper: Ae(n.frame),
          mask: U0,
          regions: [
            { mask: W0, adjustment: Ae(n.title) },
            { mask: F0, adjustment: Ae(n.type) }
          ]
        },
        ...e.stats ? {
          [e.stats]: { frame: Ae(n.frame), paper: Ae(n.stats), mask: _0 }
        } : {}
      };
  }
  return {};
}
const D0 = { frame: { hueDegrees: 8, saturationScale: 0.6137499999999998, brightnessScale: 1.25 }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.1482558139534884, 1.111280487804878, 1.3] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.0692640692640691, 1.036873156342183, 1.1861510791366907] } }, N0 = { W: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8366228070175439, 0.786036036036036, 0.7373737373737373] }, G: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.4, 1.4, 1.4] } }, z0 = { frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6, 0.6, 0.6] }, paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8893905191873589, 0.8839285714285715, 0.9282511210762332] }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.947089947089947, 0.9388297872340424, 1.0242587601078168] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6957070707070706, 0.6905370843989771, 0.7095046854082999] } }, Ee = {
  land: D0,
  paper: N0,
  colorless: z0
}, xr = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, bi = (t) => ({
  kind: "polygon",
  feather: 1 / 339,
  points: t.map(([e, r]) => [e / 339, r / 464])
}), Y0 = bi([
  [26, 43],
  [34, 25],
  [48, 12],
  [57, 9],
  [326, 9],
  [329, 12],
  [329, 43]
]), q0 = bi([
  [12, 277],
  [319, 277],
  [330, 285],
  [337, 294],
  [330, 310],
  [319, 314],
  [20, 314]
]), H0 = {
  kind: "rect",
  rect: [20 / 375, 470 / 527, 338 / 375, 40 / 527],
  feather: 1 / 375
}, X0 = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, J0 = {
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
}, Qe = (t) => ({
  ...t,
  rgbScale: t.rgbScale
});
function K0(t) {
  const e = te(t), r = It + "/";
  if (!e.base.startsWith(r)) return {};
  const n = e.base === r + "ccard.jpg", o = {}, s = n ? Ee.colorless : Ee.land;
  for (const a of [e.base, e.reverseBase, e.neutralBase])
    a && (o[a] = n ? {
      frame: xr,
      paper: Qe(Ee.colorless.frame),
      mask: X0,
      regions: [{ mask: J0, adjustment: xr }]
    } : { frame: xr, paper: Ee.land.frame, mask: H0 });
  for (const a of [e.type, e.reverseType, e.neutralType])
    a === r + (n ? "c" : "cl") + "typeline.png" && (o[a] = {
      frame: xr,
      paper: Qe(s.title),
      mask: Y0,
      regions: [{ mask: q0, adjustment: Qe(s.type) }]
    });
  for (const a of [e.paper, e.reversePaper])
    if (a)
      if (n) o[a] = Qe(Ee.colorless.paper);
      else
        for (const [i, d] of Object.entries(Ee.paper))
          a === r + i.toLowerCase() + "ltextbox.png" && (o[a] = Qe(d));
  return o;
}
const V0 = {
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
function Z0(t) {
  if (t.frameTemplate !== "future" || t.setCode?.toLowerCase() !== "fut" || t.colorCalibration !== "set-hsb-v1")
    return {};
  if (ct(t) === "full-art") return j0(t);
  if (ct(t) !== "regular") return {};
  const e = te(t).base;
  for (const [r, n] of Object.entries(V0))
    if (e === V.CONJURER_ROOT + "/img/frames/future/regular/futureFrame" + r + ".png") {
      const o = B0[r], s = (i) => ({
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        rgbScale: i
      }), a = te(t).stats;
      return {
        [e]: {
          ...n,
          mask: C0,
          regions: [
            { mask: k0, adjustment: s(o.title) },
            { mask: T0, adjustment: s(o.type) }
          ]
        },
        ...a && o.stats ? { [a]: s(o.stats) } : {}
      };
    }
  return K0(t);
}
const wi = (t) => ({
  kind: "polygon",
  points: t.map(([e, r]) => [e / 488, r / 680]),
  feather: 0.75 / 488
}), Q0 = wi([
  [43, 41],
  [445, 41],
  [449, 48],
  [450, 58],
  [446, 72],
  [42, 72],
  [38, 64],
  [37, 54],
  [39, 46]
]), tu = wi([
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
function eu(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.colorCalibration !== "set-hsb-v1" || t.frameTemplate || t.layout && t.layout !== "normal")
    return {};
  const e = Mt(t);
  if (!e || !Wt(t, e.frame)) return {};
  const r = b0(t, e.frame), n = Object.entries(vs).find(([, d]) => d.source === e.frame);
  if (!n)
    return r ? {
      [e.frame]: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        blackPoint: r,
        blend: Kn(t, e.frame)
      }
    } : {};
  const [o, s] = n, a = o.endsWith("/W") || o.endsWith("/M") ? 615 : 610, i = {
    [e.frame]: {
      blackPoint: r,
      blend: Kn(t, e.frame),
      frame: s.frame,
      paper: s.paper,
      mask: {
        kind: "rect",
        rect: [41 / 488, 425 / 680, 405 / 488, (a - 425) / 680],
        feather: 0.75 / 488
      },
      regions: [
        { mask: Q0, adjustment: s.title },
        { mask: tu, adjustment: s.type }
      ]
    }
  };
  for (const d of e.pinlines ? [e.pinlines.left, e.pinlines.right] : []) {
    const l = Object.values(vs).find((u) => u.source === d);
    l && (i[d] = l.frame);
  }
  return i;
}
function Io(t) {
  if (t.colorCalibration !== "set-hsb-v1") return;
  const e = Xe(t);
  if (!e) return;
  const r = Xd[`${t.setCode?.toLowerCase()}/${e.material}`];
  if (r?.source === JSON.stringify([e.asset, e.frame]))
    return { materials: { [e.asset]: r.adjustment }, stock: r.stock };
}
function Oo(t) {
  if (t.colorCalibration !== "set-hsb-v1") return;
  const e = Et(t);
  if (!e) return;
  const r = wt(t).colors[e.profile.split("/")[1]];
  if (r?.source === JSON.stringify([e.asset, e.frame]))
    return { materials: { [e.asset]: r.adjustment }, stock: r.stock };
}
function ke(t) {
  if (t.frameTemplate) return !1;
  const e = ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  return (st(t) || !!Ao(t)) && (!t.layout || t.layout === "normal") && (t.colorCalibration === "set-hsb-v1" || e && t.colorCalibration === "early-hsb-v1");
}
function ru(t) {
  if (!ke(t) || !st(t) || ie(t)) return;
  const e = Zt(t), r = e.split("/").at(-1).replace(".png", "").toUpperCase(), n = Ud[`${t.setCode?.toLowerCase()}-${Rt(t)}-${r}`];
  if (!(n?.asset !== e || !n.rect.every((o, s) => o === Sr(t)[s])))
    return e.endsWith("/old/fourth/w.png") ? {
      ...n.adjustment,
      mask: {
        kind: "rect",
        rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
        feather: 2 / 1500
      }
    } : n.adjustment;
}
function Si(t, e) {
  if (!ke(t)) return;
  const r = Qd(t, e);
  if (r) return r;
  if (t.setCode?.toLowerCase() === "leg" && !kt(t)) return;
  const n = `${t.setCode?.toLowerCase()}-${Rt(t)}-${e}`;
  if (So(t)) {
    const o = vo(t);
    return o && (e === "W" || e === "B") ? Ss[`arn-${o}-black-${e}`] : Ss[n];
  }
  return Nd[n] ?? jd[n];
}
function $o(t) {
  const e = Oo(t);
  if (e) return e.materials;
  const r = Io(t);
  if (r) return r.materials;
  if (t.frameTemplate === "future") return Z0(t);
  if (t.setCode?.toLowerCase() === "plc") return eu(t);
  if (!ke(t)) return {};
  const n = ie(t);
  if (n) {
    const i = {};
    for (const d of [n.base, n.overlay]) {
      const l = ps[`${t.setCode?.toLowerCase()}/${Rt(t)}/retro/${d.split("/").at(-1)}`];
      l?.source === JSON.stringify([d, Sr(t)]) && Object.assign(i, l.materials);
    }
    return i;
  }
  const o = Ao(t), s = o && ((U(t).legendary ? void 0 : Dd[o.key]) ?? ps[o.key] ?? si[o.key]);
  if (s && s.source === o?.source && (s.legendary === void 0 || s.legendary === U(t).legendary))
    return s.materials;
  const a = ru(t);
  return a ? { [Zt(t)]: a } : {};
}
function nu(t) {
  return Object.keys($o(t)).length > 0;
}
function xs(t) {
  const e = Oo(t);
  if (e) return e.materials;
  const r = Io(t);
  if (r) return r.materials;
  const n = vi(t), o = ie(t);
  let s = Nn(t, $o(t), n).materials;
  return o && n && ke(t) && (s = Nn(t, s, {
    ...n,
    url: o.overlay
  }).materials), s;
}
function ou(t) {
  const e = Oo(t);
  if (e) return e.stock;
  const r = Io(t);
  return r ? r.stock : Nn(t, $o(t), vi(t)).stock;
}
function vi(t) {
  if (mr(t) && !t.frameTemplate && !st(t) && !Mt(t) && (t.layout ?? "normal") === "normal" && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") && U(t).land)
    return {
      url: Ce(U(t)).frame,
      geometry: JSON.stringify(Z.frame)
    };
  if (!ke(t)) return;
  if (st(t))
    return {
      url: Zt(t),
      geometry: JSON.stringify(Sr(t)),
      mask: To(t)
    };
  const e = Ao(t);
  return e?.family === "components" ? { url: e.frame, geometry: JSON.stringify(e.rect) } : void 0;
}
const or = /* @__PURE__ */ new WeakMap();
function su(t, e, r, n) {
  return or.get(t)?.(e, r, n) ?? !1;
}
function au(t, e, r) {
  const n = e.printingOmissions;
  if (!n?.length) return r();
  const o = t.fillText, s = t.strokeText, a = (d, l, u) => {
    const h = t.getTransform().transformPoint({ x: l, y: u }), m = h.x * 488 / t.canvas.width, c = h.y * 680 / t.canvas.height;
    return n.some(({ rect: g, rotation: f = 0, texts: y }) => {
      if (!y.includes(String(d))) return !1;
      const b = f * Math.PI / 180, p = m - g[0] * 488, w = c - g[1] * 680, S = p * Math.cos(b) + w * Math.sin(b), v = -p * Math.sin(b) + w * Math.cos(b);
      return S >= -8 && S <= g[2] * 488 + 8 && v >= -8 && v <= g[3] * 680 + 25;
    });
  }, i = or.get(t);
  or.set(t, (d, l, u) => a(d, l, u) || (i?.(d, l, u) ?? !1)), t.fillText = function(d, l, u, h) {
    a(d, l, u) || o.call(this, d, l, u, ...h === void 0 ? [] : [h]);
  }, t.strokeText = function(d, l, u, h) {
    a(d, l, u) || s.call(this, d, l, u, ...h === void 0 ? [] : [h]);
  };
  try {
    r();
  } finally {
    i ? or.set(t, i) : or.delete(t), t.fillText = o, t.strokeText = s;
  }
}
function iu(t, e, r, n, o) {
  const [s, a, i] = r;
  if (su(t, e, s, a)) return;
  const d = t.getTransform(), l = Math.hypot(d.a, d.b), u = (Math.floor((s - 4) * l + d.e) - d.e) / l, h = (Math.floor((a - n) * l + d.f) - d.f) / l, m = I();
  m.width = Math.ceil((i + 8) * l), m.height = Math.ceil(n * 2 * l);
  const c = m.getContext("2d");
  if (!c) throw Error("Magic heading ink needs Canvas2D");
  try {
    c.scale(l, l), c.translate(-u, -h), c.font = t.font, c.fillStyle = t.fillStyle, c.textAlign = t.textAlign, c.textBaseline = t.textBaseline, c.fillText(e, s, a, i), c.globalCompositeOperation = "destination-out", c.lineWidth = o, c.strokeStyle = "#000", c.strokeText(e, s, a, i), t.drawImage(
      m,
      0,
      0,
      m.width,
      m.height,
      u,
      h,
      m.width / l,
      m.height / l
    );
  } finally {
    m.width = m.height = 0;
  }
}
function Go(t, e, r, n, o, s = "#efe7cb", a, i = "#0d0f0f") {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = s, t.beginPath(), t.arc(e + n / 2, r + n / 2, n / 2, 0, Math.PI * 2), t.fill(), t.clip(), t.fillStyle = i, t.font = '100px "CardRenderer MTG Historic Symbols"', t.textAlign = "left", t.textBaseline = "alphabetic";
  const d = "", l = t.measureText(d), u = l.actualBoundingBoxLeft + l.actualBoundingBoxRight, h = l.actualBoundingBoxAscent + l.actualBoundingBoxDescent, m = o * (a?.scale ?? 1) / Math.max(u, h);
  t.translate(e + n / 2 + (a?.dx ?? 0), r + n / 2 + (a?.dy ?? 0)), t.scale(m, m), t.fillText(
    d,
    (l.actualBoundingBoxLeft - l.actualBoundingBoxRight) / 2,
    (l.actualBoundingBoxAscent - l.actualBoundingBoxDescent) / 2
  ), t.restore();
}
const Ff = "symbols-v3";
function Po(t) {
  if (t.symbolAdjustment) {
    if (t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
      throw Error("Symbol adjustment currently supports ordinary faces only.");
    for (const [e, r] of Object.entries(t.symbolAdjustment)) {
      if (e !== "mana" && e !== "set") throw Error("Unknown symbol adjustment group.");
      if (!r || typeof r != "object") throw Error("Invalid symbol adjustment.");
      for (const [n, o] of Object.entries(r)) {
        if (e === "mana" && n === "glyphs") {
          lu(o);
          continue;
        }
        const s = n === "dx" || n === "dy", a = e === "mana" && (n === "numberDx" || n === "numberDy"), i = e === "mana" && n === "spacing", d = n === "scaleX" || n === "scaleY" || e === "mana" && n === "numberScale", l = i || a ? 4 : 8;
        if (!s && !a && !i && !d || typeof o != "number" || !Number.isFinite(o) || o < (d ? 0.75 : -l) || o > (d ? 1.25 : l))
          throw Error("Symbol adjustment exceeds supported bounds.");
      }
    }
  }
}
function lu(t) {
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
function gr(t, e) {
  return /^[WUBRG]$/.test(e) ? t?.glyphs?.[e] : void 0;
}
function we(t, e) {
  const { dx: r = 0, dy: n = 0, scaleX: o = 1, scaleY: s = 1 } = e ?? {};
  if (!r && !n && o === 1 && s === 1) return t;
  const [a, i, d, l] = t;
  return [a + d + r - d * o, i + l / 2 + n - l * s / 2, d * o, l * s];
}
function Ne(t, e, r, n) {
  const o = we(e, r);
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
function du(t, e, r) {
  const n = Math.max(0, e - 1) * (r?.spacing ?? 0);
  return n ? [t[0] - n, t[1], t[2] + n, t[3]] : t;
}
function Se(t) {
  if (!/^#[a-f0-9]{6}$/i.test(t)) throw Error("Invalid mana palette color");
  return [
    parseInt(t.slice(1, 3), 16) / 255,
    parseInt(t.slice(3, 5), 16) / 255,
    parseInt(t.slice(5, 7), 16) / 255
  ];
}
const uu = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, hu = "#9aa4ae", Tn = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
function Wo(t, e, r, n) {
  const o = [];
  for (const s of e.split(`
`)) {
    let a = [], i = 0;
    const d = ln(s).flatMap(
      (l) => l.symbol ? [{ text: l.symbol, symbol: !0 }] : (l.value.match(/\s+|\S+/g) ?? []).map((u) => ({ text: u, symbol: !1 }))
    );
    for (const l of d) {
      const u = !l.symbol && t.measureText(l.text).width > r ? [...l.text].map((h) => ({ text: h, symbol: !1 })) : [l];
      for (const h of u) {
        const m = h.symbol ? n * 0.94 : t.measureText(h.text).width;
        i + m > r && a.length && (o.push(a), a = [], i = 0), !(!a.length && /^\s+$/.test(h.text)) && (a.push({ ...h, width: m }), i += m);
      }
    }
    o.push(a);
  }
  return o;
}
function et(t, e, r, n, o, s, a = !1, i) {
  if (e === "W" && s.originalWhiteGlyph) {
    Go(
      t,
      r,
      n,
      o,
      o * 0.87,
      s.manaColors?.W,
      gr(i, e),
      s.manaInkColor
    );
    return;
  }
  const d = /^\d+$/.test(e);
  if (d && i && s.manaCostNumeral) {
    Vd(t, e, r, n, o, s.manaCostNumeral, i);
    return;
  }
  const l = gr(i, e), u = s.manaGlyphScales?.[e] ?? 1, h = d ? i ? s.manaNumerals?.get(e) : void 0 : u !== 1 || l ? s.manaGlyphs?.get(e) : void 0, m = s.get(je(e) ?? "");
  if (t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, a) {
    const c = t.getTransform();
    t.shadowColor = "#000d";
    const [g, f] = s.manaCostShadow ?? [-1.5372, 1.5372];
    t.shadowOffsetX = g * c.a + f * c.c, t.shadowOffsetY = g * c.b + f * c.d;
  }
  if (t.fillStyle = s.manaColors?.[e] ?? uu[e] ?? hu, t.beginPath(), t.arc(r + o / 2, n + o / 2, o / 2, 0, Math.PI * 2), t.fill(), t.shadowColor = "transparent", h && t.drawImage(h.image, 0, 0, h.width, h.height, r, n, o, o), h) {
    const c = d ? i?.numberDx ?? 0 : l?.dx ?? 0, g = d ? i?.numberDy ?? 0 : l?.dy ?? 0, f = d ? i?.numberScale ?? 1 : u * (l?.scale ?? 1);
    d || (t.beginPath(), t.arc(r + o / 2, n + o / 2, o / 2, 0, Math.PI * 2), t.clip()), (c || g || f !== 1) && (t.translate(r + o / 2 + c, n + o / 2 + g), t.scale(f, f), t.translate(-r - o / 2, -n - o / 2));
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
function Ci(t, e, r, n, o, s, a) {
  if (!ee(t)) return;
  const i = typeof s == "number" ? s : s.size;
  t.font = `${typeof s != "number" && s.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
  const d = e.split(`
`).map((l) => Wo(t, l, o, i));
  t.textBaseline = "top";
  for (const l of d) {
    for (const u of l) {
      let h = r;
      for (const m of u)
        m.symbol ? et(t, m.text, h + i * 0.07, n + i * 0.03, i * 0.8, a) : t.fillText(m.text, h, n), h += m.width;
      n += i;
    }
    n += J.paragraphGap;
  }
}
function rt(t, e, r, n, o, s, a = !1, i = 1, d = "CardRenderer MTG Beleren", l = 0, u, h = "type") {
  if (!(o > 0)) throw Error("Magic title/type plate has no text space.");
  t.save(), t.font = `${a ? "bold " : ""}${s}px "${d}", Georgia`;
  const m = t.measureText(e).width;
  i > 1 && m * i > o && (i = 1), i !== 1 && (t.translate(r, 0), t.scale(i, 1), r = 0, o /= i), m > o && (s = Math.max(s * 0.78, s * o / m), t.font = `${a ? "bold " : ""}${s}px "${d}", Georgia`), ht(
    t,
    e,
    r,
    n,
    o,
    u,
    h,
    l > 0 ? () => iu(t, e, [r, n, o], s, l) : void 0
  ), t.restore();
}
function re(t, e, r, n, o, s, a, i, d = [0, 0, 1, 1]) {
  const l = [
    d[0] * e.width,
    d[1] * e.height,
    d[2] * e.width,
    d[3] * e.height
  ], u = {
    uncommon: "#aaaeb2",
    rare: "#bc923f",
    mythic: "#c65c2d",
    special: "#8664af",
    bonus: "#bc923f"
  }[n ?? "common"];
  if (!u || ["forge", "glint"].includes(r?.toLowerCase() ?? "")) {
    t.drawImage(e, ...l, o, s, a, i);
    return;
  }
  const h = I();
  h.width = Math.max(1, Math.ceil(a * 2)), h.height = Math.max(1, Math.ceil(i * 2));
  const m = h.getContext("2d");
  m.drawImage(e, ...l, 0, 0, h.width, h.height), m.globalCompositeOperation = "source-in", m.fillStyle = u, m.fillRect(0, 0, h.width, h.height), t.drawImage(h, o, s, a, i), h.width = h.height = 0;
}
function un(t) {
  return /^[WUBRG]$/.test(t) ? `${V.MSE_TEMPLATE_ROOT}/magic-mana-future.mse-symbol-font/mana_${t.toLowerCase()}.png` : /^(?:[0-9]|1[0-9]|20|X)$/.test(t) ? `${V.CONJURER_ROOT}/img/manaSymbols/future/f0.png` : /^[WUBRG]\/[WUBRG]$/.test(t) ? `${V.CONJURER_ROOT}/img/manaSymbols/future/f${t.toLowerCase().replace("/", "")}.png` : null;
}
function mu(t) {
  const e = t.manaSymbols ?? [];
  return [
    .../* @__PURE__ */ new Set([
      ...e.map(un).filter((r) => r !== null),
      ...e.some((r) => /^(?:\d+|X)$/.test(r)) ? Vn() : []
    ])
  ];
}
function Vn() {
  return ["0", "1", "2", "3", "4", "5", "6", "x"].map(
    (t) => `${V.CONJURER_ROOT}/img/manaSymbols/future/f${t}.png`
  );
}
function cu(t, e, r) {
  const n = [91, 61, 46, 46, 59, 106], o = [140, 207, 281, 356, 437, 512], s = e.manaSymbols ?? [];
  if (s.length > n.length) throw Error("Futureshifted cost exceeds the six source positions");
  s.forEach((a, i) => {
    const d = ct(e) === "full-art" && i > 0 && i < 3, l = d || ct(e) === "regular" && i < 4, u = l ? /^[WUBRG]$/.test(a) ? 37.125 : 38.125 : 59 * 488 / 744, h = d ? [79.0376, 58.6102, 56.1465] : [78.1626, 59.4852, 51.6465, 51.6465], m = d ? [113.101, 161.7009, 217.5071] : [111.851, 154.0759, 202.5071, 252.3427], c = l ? h[i] - u / 2 : n[i] * 488 / 744, g = l ? m[i] - u / 2 : o[i] * 680 / 1039, f = un(a), y = f ? r.get(f) : void 0;
    if (f && !y) throw Error(`Futureshifted mana asset unavailable: ${f}`);
    y ? (t.drawImage(y, c, g, u, u), /^(?:\d+|X)$/.test(a) && (t.save(), t.translate(c + u / 2 - 0.75 * u / 38.125, g + u / 2 + 1.75 * u / 38.125), t.scale(0.9375, 1), t.font = `700 ${u * 31.25 / 38.125}px "CardRenderer MTG MPlantin"`, t.fillStyle = "#111", t.textAlign = "center", t.textBaseline = "middle", t.fillText(a, 0, 0, u * 0.73), t.restore())) : et(t, a, c, g, u, r, !1);
  });
}
function Fo([t, e, r, n]) {
  return [e / 375, 1 - (t + r) / 523, n / 375, r / 523];
}
function zr([t, e, r, n]) {
  return [(1 - e - n) * 523, t * 375, n * 523, r * 375];
}
const lr = {
  rect: [455, 307, 30, 12],
  font: 'bold 16px "CardRenderer MTG ModMatrix"',
  color: "rgb(45, 45, 45)"
};
function gu(t, e) {
  if (e.frameTemplate !== "battle" || !e.reverseStats) return null;
  const r = `${e.reverseStats.power}/${e.reverseStats.toughness}`;
  t.save();
  try {
    t.font = lr.font, t.textAlign = "right", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
    const n = t.measureText(r), [o, s, a, i] = lr.rect, d = o + a, l = s + i - n.actualBoundingBoxDescent, u = [
      d - n.actualBoundingBoxLeft,
      l - n.actualBoundingBoxAscent,
      n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
      n.actualBoundingBoxAscent + n.actualBoundingBoxDescent
    ];
    return {
      text: r,
      font: lr.font,
      x: d,
      baseline: l,
      inkBounds: u,
      rect: Fo(u),
      rotation: -90
    };
  } finally {
    t.restore();
  }
}
const Rs = V.MSE_TEMPLATE_ROOT, _o = {
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
function As(t) {
  const e = W(t);
  return /\bLand\b/.test(t.typeLine ?? "") || t.land ? (e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "c") + "l" : /\bArtifact\b/.test(t.typeLine ?? "") || t.artifact ? "a" : e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "c";
}
function Uo(t) {
  if (!t.frameTemplate) return null;
  const e = t.frameTemplate, r = _o[e];
  if (!r) throw Error("Unknown standard frame template");
  if (t.frameAssetFamily) throw Error("Choose one frame template or plate family");
  if (e === "future") return te(t);
  const n = `${Rs}/${r.style}`, o = As(e === "flip" ? t.faces?.[0] ?? t : t);
  if (e === "battle")
    return {
      kind: e,
      base: `${n}/cards/${o.replace(/l$/, "")}card.png`,
      defense: `${Rs}/magic-modules.mse-include/loyalty/defense.png`,
      texture: `${n}/cards/texture/${o.replace(/l$/, "")}card.png`,
      border: `${n}/border.png`
    };
  const s = `${n}/${o}card.jpg`;
  if (e === "flip") {
    const a = t.faces?.[1] ?? t, i = t.faces?.[0] ?? t, d = As(a);
    return {
      kind: e,
      base: s,
      reverse: `${n}/${d}card.jpg`,
      ...i.power != null && i.toughness != null ? { stats: `${n}/${o}pt.jpg`, statsMask: `${n}/mask_pt.png` } : {},
      ...a.power != null && a.toughness != null ? {
        reverseStats: `${n}/${d}pt2.jpg`,
        reverseStatsMask: `${n}/mask_pt2.png`
      } : {}
    };
  }
  throw Error("Unknown standard template asset branch");
}
function fu(t) {
  const e = Uo(t);
  if (!e) return [];
  const { kind: r, ...n } = e;
  return [
    ...Object.values(n).filter((o) => typeof o == "string"),
    ...t.frameTemplate === "future" ? mu(t) : []
  ];
}
function pu(t) {
  if (!t.frameTemplate) return null;
  if (t.frameTemplate === "future") {
    const n = Lo(t), o = (s) => [s[0] / 488, s[1] / 680, s[2] / 488, s[3] / 680];
    return {
      ...Z,
      frame: [0, 0, 1, 1],
      title: o(n.title),
      art: o(n.art),
      type: o(n.type),
      rules: o(n.rules),
      stats: o(n.stats),
      footer: o(n.footer)
    };
  }
  const e = _o[t.frameTemplate];
  if (!e) throw Error("Unknown standard frame template");
  const r = (n) => {
    const [o, s, a, i] = n, [d, l] = e.size;
    return t.frameTemplate === "battle" ? Fo(n) : [o / d, s / l, a / d, i / l];
  };
  return {
    ...Z,
    frame: [0, 0, 1, 1],
    title: r(e.title),
    art: r(e.art),
    type: r(e.type),
    rules: r(e.rules),
    stats: r(e.stats),
    footer: r(e.footer)
  };
}
function zt(t) {
  return t.securityStamp !== void 0 ? t.securityStamp === "oval" : !st(t) && t.frameAssetFamily !== "eighth" && ["rare", "mythic"].includes(t.rarity ?? "");
}
const ki = `${P}/img/frames/m15/holoStamps/stamp.png`, Yr = 310.216, Es = {
  frame: [52, 20, 298, 449],
  title: [70, 40, 261, 26],
  art: [65, 76.5, 270, 183.8],
  type: [70, 265, 261, 23],
  rules: [74, 301, 255, 160],
  artistY: 0,
  legalY: 0
}, yu = `${P}/img/frames/m15/split`, Ls = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style", Ti = [
  `${Ls}/namebox/texture/normal/c.png`,
  `${Ls}/typebox/texture/normal/c.png`
], jo = (t) => `${yu}${t.layout?.endsWith("-fuse") ? "/fuse" : ""}`;
function Do(t) {
  const e = W(t);
  return `${jo(t)}/${e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "a"}.png`;
}
function Mi(t) {
  const e = t.manaSymbols ?? [];
  return e.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !e.some((r) => /^[WUBRG]$/.test(r));
}
function xi(t) {
  const e = W(t);
  return [
    Do(t),
    ...e.length === 2 ? e.map((r) => `${jo(t)}/${r.toLowerCase()}.png`) : [],
    ...e.length === 2 && Mi(t) ? Ti : [],
    ...zt(t) ? [ki] : []
  ];
}
const Le = /* @__PURE__ */ new Map(), Mn = /* @__PURE__ */ new WeakMap();
let bu = 0, xn = 0;
const wu = (t) => (Mn.has(t) || Mn.set(t, ++bu), Mn.get(t));
function Rr(t, e, r, n, o, s) {
  t.moveTo(e + s, r), t.lineTo(e + n - s, r), t.quadraticCurveTo(e + n + s * 0.25, r + o / 2, e + n - s, r + o), t.lineTo(e + s, r + o), t.quadraticCurveTo(e - s * 0.25, r + o / 2, e + s, r), t.closePath();
}
function Su(t, e) {
  const r = (g) => {
    const f = e.get(g);
    if (!f) throw Error(`Modern split asset unavailable: ${g}`);
    return f;
  }, n = r(Do(t)), o = W(t);
  if (o.length !== 2) return n;
  "WUBRG".indexOf(o[1]) - "WUBRG".indexOf(o[0]) > 2 && o.reverse();
  const s = Mi(t), a = [
    ...o.map((g) => r(`${jo(t)}/${g.toLowerCase()}.png`)),
    ...s ? Ti.map(r) : [n]
  ], i = o.join("") + (s ? "-hybrid-" : "-gold-") + [n, ...a].map(wu).join("/"), d = Le.get(i);
  if (d)
    return Le.delete(i), Le.set(i, d), d;
  const l = I();
  l.width = n.width, l.height = n.height;
  const u = l.getContext("2d");
  u.scale(l.width / 488, l.height / 680), u.translate(0, 680), u.rotate(-Math.PI / 2);
  const h = (g) => {
    u.save(), u.translate(680, 0), u.rotate(Math.PI / 2), u.drawImage(g, 0, 0, 488, 680), u.restore();
  }, m = t.layout?.endsWith("-fuse") ?? !1;
  h(n);
  for (const g of [0, Yr]) {
    if (u.save(), u.beginPath(), s ? u.rect(g + 50, 0, Yr, 488) : (Rr(u, g + 57.5, 29, 286, 47, 9), u.rect(g + 64, 74, 273, m ? 362 : 394), Rr(u, g + 57.5, 260, 286, 34, 7)), m)
      for (const [p, w] of [
        [29, 47],
        [260, 34]
      ])
        u.moveTo(334, p), u.lineTo(356, p + w / 2), u.lineTo(378, p), u.lineTo(378, p + w), u.lineTo(356, p + w / 2), u.lineTo(334, p + w), u.closePath();
    u.clip(), h(a[0]);
    const f = I();
    f.width = l.width, f.height = l.height;
    const y = f.getContext("2d");
    y.drawImage(a[1], 0, 0, f.width, f.height), y.globalCompositeOperation = "destination-in";
    const b = y.createLinearGradient(
      0,
      (680 - g - 175) / 680 * f.height,
      0,
      (680 - g - 230) / 680 * f.height
    );
    if (b.addColorStop(0, "#0000"), b.addColorStop(1, "#000"), y.fillStyle = b, y.fillRect(0, 0, f.width, f.height), u.save(), u.translate(680, 0), u.rotate(Math.PI / 2), u.drawImage(f, 0, 0, 488, 680), u.restore(), u.restore(), f.width = f.height = 0, u.save(), u.beginPath(), Rr(u, g + 62.5, 34.5, 276, 37.5, 7), Rr(u, g + 62.5, 265, 276, 24, 5), m)
      for (const [p, w] of [
        [35, 37],
        [265, 24]
      ])
        u.moveTo(332, p), u.lineTo(349, p + w / 2), u.lineTo(332, p + w), u.closePath(), u.moveTo(380, p), u.lineTo(363, p + w / 2), u.lineTo(380, p + w), u.closePath();
    u.clip(), s ? (u.drawImage(a[2], 22, 7, 196, 19, g + 62.5, 34.5, 276, 37.5), u.drawImage(a[3], 22, 192, 196, 11, g + 62.5, 265, 276, 24)) : h(a[2]), u.restore();
  }
  const c = l.width * l.height * 4;
  for (const [g, f] of Le) {
    if (xn + c <= 16 * 1024 * 1024) break;
    xn -= f.width * f.height * 4, Le.delete(g), f.width = f.height = 0;
  }
  return c <= 16 * 1024 * 1024 && (Le.set(i, l), xn += c), l;
}
function Te(t) {
  return ["split", "aftermath"].includes(t.layout ?? "") && t.faces?.length === 2 && (t.layout === "aftermath" || /^Aftermath\b/m.test(t.faces[1].rulesText ?? ""));
}
const ye = 373, Ri = 257, Ai = `${P}/img/frames/saga/stamp.png`;
function Ei(t) {
  const e = W(t), r = e.length > 1 ? "m" : e[0]?.toLowerCase();
  if (!r) throw Error("No validated colorless Aftermath plate is available.");
  return `${P}/img/frames/m15/aftermath/${r}.png`;
}
function Li(t) {
  return Te(t) ? [
    ...t.faces.map(Ei),
    ...zt(t) ? [Ai] : []
  ] : [];
}
const No = {
  title: [41.7, 35.5, 405, 37],
  art: [37.4, 76.5, 413.2, 151.8],
  type: [41.7, 235.8, 405, 37],
  rules: [41.7, 281.5, 405, 76]
}, zo = {
  title: [12, 37.5, 227, 37],
  art: [11, 80.7, 240.9, 137.9],
  // Align the rotated type plate in its reading orientation (all type labels).
  type: [9, 226.2, 230, 37],
  rules: [14, 276.5, 232, 169]
};
function vu(t) {
  const e = t ? zo : No, r = t ? Ri : 488, n = t ? 488 : ye, o = (s) => {
    const [a, i, d, l] = e[s];
    return [a / r, i / n, d / r, l / n];
  };
  return {
    ...Z,
    title: o("title"),
    art: o("art"),
    type: o("type"),
    rules: o("rules"),
    footer: [0, 1, 0, 0]
  };
}
const Bi = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", Cu = new Set("dis plc cmd pc2 dgm mma c13".split(" "));
function Nt(t) {
  return t.layout !== "split" || t.faces?.length !== 2 || Te(t) || t.faces.some(
    (e) => !/^(Instant|Sorcery)\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "")
  ) ? null : st({ ...t, layout: "normal", frameStyle: t.frameStyle ?? t.faces[0]?.frameStyle }) ? "old" : t.frameAssetFamily === "eighth" || Cu.has(t.setCode?.toLowerCase() ?? "") ? "eighth" : "m15";
}
function ze(t) {
  const e = (r) => [
    r.rulesText ?? "",
    ...(r.rulesParagraphs ?? []).map((n) => n.runs.map((o) => o.text).join(""))
  ];
  return [t, ...t.faces ?? []].some((r) => e(r).some((n) => /^Fuse\b/m.test(n)));
}
const Ii = 251 * 680 / 523, Bs = 680 / 523, qr = 488 / 375, ge = (t, e, r, n) => [
  t * Bs,
  e * qr,
  r * Bs,
  n * qr
];
function Ke(t, e) {
  if (t === "m15")
    return e ? { ...Es, rules: [74, 301, 255, 128] } : Es;
  const r = t === "old";
  return {
    frame: ge(18, 18, e ? 244 : 236, 338),
    title: ge(r ? 35 : 30, r ? 23 : 28, r ? 207 : 214, 21),
    art: r ? ge(37, 47, 197, 130) : ge(27, 56, 217, 152),
    type: ge(r ? 35 : 30, r ? 182 : 211, 210, r ? 21 : 17),
    rules: r ? ge(43, 207, 187, 109) : ge(30, 233, 213, e ? 74 : 95),
    artistY: (r ? 332 : e ? 344 : 339) * qr,
    legalY: (r ? 347 : 354) * qr
  };
}
function ku(t) {
  const e = t.layout?.startsWith("split-old") ? "old" : t.layout?.startsWith("split-m15") ? "m15" : "eighth", r = e === "m15" ? Yr : Ii, n = Ke(e, t.layout?.endsWith("-fuse") ?? !1), o = (s) => [
    s[0] / r,
    s[1] / 488,
    s[2] / r,
    s[3] / 488
  ];
  return {
    ...Z,
    frame: o(n.frame),
    title: o(n.title),
    art: o(n.art),
    type: o(n.type),
    rules: o(n.rules),
    footer: [0, 1, 0, 0]
  };
}
function Hr(t, e, r, n) {
  if (e === "m15") return Do(t);
  const o = W(t), s = o.length > 1 ? "m" : o[0]?.toLowerCase() ?? "c";
  return `${Bi}/${e === "old" ? "magic-old-split" : r ? "magic-new-split-fuse" : "magic-new-split"}.mse-style/${s}card${r ? n + 1 : ""}.${r ? "png" : "jpg"}`;
}
function Oi(t) {
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
const Ar = `${P}/img/frames/saga`, $i = [
  `${Ar}/sagaMaskPinline.png`,
  `${Ar}/sagaMaskBanner.png`,
  `${Ar}/sagaMaskBannerRight.png`,
  `${Ar}/sagaMidStripe.png`
];
function Gi(t) {
  const e = W(t);
  return e.length !== 2 || t.layout === "transform" || t.land || /\bLand\b/.test(t.typeLine ?? "") ? [] : ("WUBRG".indexOf(e[1]) - "WUBRG".indexOf(e[0]) > 2 && e.reverse(), e.map(
    (r) => `${P}/data/images/cardImages/saga/sagaFrame${r}.png`
  ));
}
function Tu(t) {
  const e = Gi(t);
  return e.length ? [...e, ...$i] : [];
}
const Is = /* @__PURE__ */ new WeakMap();
function Mu(t, e, r) {
  const n = Gi(e);
  if (!n.length) return;
  const o = [...n, ...$i].map((S) => {
    const v = r.get(S);
    if (!v) throw Error(`Saga color asset unavailable: ${S}`);
    return v;
  }), s = Is.get(o[0]);
  if (s && s.sources.every((S, v) => S === o[v])) {
    t.drawImage(s.canvas, 0, 0, 488, 680);
    return;
  }
  const [a, i, d, l, u, h] = o, m = I();
  m.width = a.width, m.height = a.height;
  const c = I();
  c.width = m.width, c.height = m.height;
  const g = I();
  g.width = m.width, g.height = m.height;
  const f = m.getContext("2d"), y = c.getContext("2d"), b = g.getContext("2d"), p = m.width, w = m.height;
  b.drawImage(d, 0, 0, p, w), b.drawImage(l, 0, 0, p, w), f.drawImage(a, 0, 0, p, w), f.globalCompositeOperation = "destination-in", f.drawImage(g, 0, 0), f.globalCompositeOperation = "source-over", b.clearRect(0, 0, p, w), b.save(), b.beginPath(), b.rect(p / 2, 0, p / 2, w), b.clip(), b.drawImage(d, 0, 0, p, w), b.restore(), b.drawImage(u, 0, 0, p, w), y.drawImage(i, 0, 0, p, w), y.globalCompositeOperation = "destination-in", y.drawImage(g, 0, 0), f.drawImage(c, 0, 0), f.drawImage(h, 0.0727 * p, 0.3058 * w, 87e-4 * p, 0.4762 * w), Is.set(a, { sources: o, canvas: m }), c.width = c.height = g.width = g.height = 0, t.drawImage(m, 0, 0, 488, 680);
}
const fr = `${P}/img/frames/saga`;
function Yo(t) {
  const e = W(t), r = e.length > 1 ? "M" : e[0];
  if (/\bLand\b/.test(t.typeLine ?? "") || t.land) return `${fr}/regular/l.png`;
  if (t.layout === "transform" && r) return `${fr}/dfc/${r.toLowerCase()}.png`;
  if (r) return `${P}/data/images/cardImages/saga/sagaFrame${r}.png`;
  throw Error("No ordinary colorless or artifact Saga plate is available.");
}
function Zn(t) {
  return t.layout === "transform" && t.setCode?.toLowerCase() === "neo" ? `${P}/img/frames/m15/transform/icons/fanClosed.svg` : null;
}
const Pi = `${fr}/sagaChapter.png`, Wi = `${fr}/sagaDivider.png`, vr = `${fr}/stamp.png`, Dt = {
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
function xu(t) {
  return [
    Yo(t),
    ...Tu(t),
    Pi,
    Wi,
    ...Zn(t) ? [Zn(t)] : [],
    ...zt(t) ? [vr] : []
  ];
}
const Fi = {
  ...Z,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.5007, 0.1134, 0.4233, 0.724],
  type: [0.0854, 0.8481, 0.8292, 0.0543],
  rules: [0.0867, 0.1129, 0.404, 0.7248],
  stamp: [0.17, 0.48, 0.23, 0.16506]
}, ve = `${P}/img/frames/adventure/regular`, _i = `${ve}/bookLeft.png`, Ui = `${ve}/pinline.svg`, ji = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style/namebox/texture/normal/c.png", Cr = (t) => t.layout === "adventure" && t.faces?.length === 2;
function Qt(t) {
  const e = t.manaSymbols ?? [];
  return W(t).length === 2 && e.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !e.some((r) => /^[WUBRG]$/.test(r));
}
function qo(t) {
  const e = U(t), r = W(t);
  return e.land ? "l" : e.artifact ? "a" : r.length > 1 ? "m" : r[0]?.toLowerCase() ?? "a";
}
const Xr = (t) => `${ve}/${qo(t)}.png`;
function Ho(t) {
  const e = Qt(t) ? "W" : qo(t).toUpperCase();
  return `${P}/img/frames/m15/regular/m15PT${e === "L" ? "C" : e}.png`;
}
const Di = (t) => `${P}/img/frames/m15/crowns/m15Crown${qo(t).toUpperCase()}.png`;
function Ni(t) {
  const e = t.faces?.[1];
  if (!Cr(t) || !e) throw Error("Adventure needs a permanent and an inset spell.");
  const r = (n) => {
    const o = W(n);
    return [
      Xr(n),
      ...o.length === 2 ? o.map((s) => `${ve}/${s.toLowerCase()}.png`) : []
    ];
  };
  return [
    .../* @__PURE__ */ new Set([
      ...r(t),
      ...r(e),
      _i,
      ...W(t).length === 2 && !Qt(t) ? [Ui] : [],
      ...Qt(t) ? [ji] : [],
      ...U(t).legendary ? [Di(t)] : [],
      ...t.power != null && t.toughness != null ? [Ho(t)] : [],
      ...zt(t) ? [vr] : []
    ])
  ];
}
const Xo = {
  ...Z,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.5267, 0.65, 0.3867, 0.2647],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.58, 0.74, 0.25, 0.1794]
}, hn = `${P}/img/frames/prepare/regular`, mn = (t) => t.layout === "prepare";
function Ve(t) {
  if (t.faces?.length !== 2) throw Error("Prepared needs a creature and an inset spell.");
  return t.faces[1];
}
function Jo(t) {
  const e = U(t), r = W(t);
  if (e.land) return "l";
  if (/\bVehicle\b/.test(t.typeLine ?? "")) return "v";
  if (e.artifact) return "a";
  if (r.length > 1) return "m";
  if (r.length) return r[0].toLowerCase();
  throw Error("The pinned Prepared source has no colorless plate.");
}
const We = (t) => `${hn}/${Jo(t)}.png`, Gr = (t) => `${hn}/${t}.png`;
function Pe(t) {
  const e = W(t);
  return e.length === 2 && "WUBRG".indexOf(e[1]) - "WUBRG".indexOf(e[0]) > 2 && e.reverse(), e;
}
const Qn = (t) => `${P}/img/frames/m15/crowns/m15Crown${t.toUpperCase()}.png`, Ru = (t) => Ho(t);
function zi(t) {
  const e = Ve(t), r = (o) => Pe(o).length === 2 ? Pe(o).map((s) => `${hn}/${s.toLowerCase()}.png`) : [], n = Pe(t);
  return [
    .../* @__PURE__ */ new Set([
      We(t),
      We(e),
      Gr("prepare"),
      ...r(t),
      ...r(e),
      ...n.length === 2 ? ["pinline", "rules", "rulesRight"].map(Gr) : [],
      ...Pe(e).length === 2 ? ["prepareRight", "prepareTypeTitle"].map(Gr) : [],
      ...U(t).legendary ? (n.length === 2 ? n : [Jo(t)]).map(Qn) : [],
      ...t.power != null && t.toughness != null ? [Ru(t)] : [],
      ...zt(t) ? [vr] : []
    ])
  ];
}
const Ko = {
  ...Z,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.086, 0.6303, 808 / 2010, 0.2875],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.17, 0.72, 0.25, 0.1794]
}, Au = {
  title: [1042 / 2010, 0.6391, 0.4, 0.0296],
  type: [1042 / 2010, 1932 / 2814, 0.4, 0.0296],
  rules: [1035 / 2010 + 2 / 488, 2059 / 2814, 0.3947, 438 / 2814]
}, Eu = [
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
], ae = 0.91339 * T / 768, to = 0.04724 * T, eo = 0.02655 * E;
function Lu(t) {
  return [
    (to + 20 * ae) / T,
    (eo + 84 * ae) / E,
    728 * ae / T,
    ((t ? 541 : 622) - 84) * ae / E
  ];
}
function Bu(t, e) {
  const r = Eu[e ? 1 : 0];
  t.beginPath(), r.forEach(([n, o], s) => {
    const a = to + (o - 1) * ae, i = eo + n * ae;
    s === 0 ? t.moveTo(a, i) : t.lineTo(a, i);
  });
  for (let n = r.length - 1; n >= 0; n--) {
    const [o, s] = r[n];
    t.lineTo(to + (769 - s) * ae, eo + o * ae);
  }
  t.closePath(), t.clip();
}
function kr(t) {
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
function tt(t) {
  return t.layout === "ability" ? "normal" : t.layout === "prepare" ? "prepare" : t.layout === "adventure" && t.faces?.length === 2 ? "adventure" : t.layout === "class" || /\bClass\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "class" : t.layout === "leveler" || /^Level up\b/m.test(t.rulesText ?? "") ? "leveler" : t.layout === "saga" || /\bSaga\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "saga" : t.layout === "planeswalker" || /\bPlaneswalker\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? kr(t).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function Ft(t) {
  const e = pu(t);
  if (e) return e;
  if (t.layout === "aftermath-top" || t.layout === "aftermath-bottom")
    return vu(t.layout === "aftermath-bottom");
  if (/^split-(old|eighth|m15)(-fuse)?$/.test(t.layout ?? "")) return ku(t);
  const r = Mt(t);
  if (r) return r.rects;
  if (st(t)) return dn(t);
  const n = tt(t);
  if (n === "adventure") return Xo;
  if (n === "prepare") return Ko;
  if (n === "class")
    return {
      ...Z,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (n === "saga") return Fi;
  if (n.startsWith("planeswalker")) {
    const o = n === "planeswalker-large", s = [
      0.04409,
      o ? 0.55118 : 0.62655,
      0.88827,
      o ? 0.37534 : 0.29997
    ], a = Z.stamp[2], i = Z.stamp[3];
    return {
      ...Z,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, 0.92126 * T * 3793 / 2778 / E],
      frame: [0.04724, 0.02655, 0.91339, 0.91339 * T * 3810 / 2736 / E],
      art: Lu(o),
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / T,
        (o ? 0.49044 : 0.55793) + 5 / E,
        0.88662,
        0.05737
      ],
      rules: s,
      stats: [0.792 + 1 / T, 0.881 - 3 / E, 0.16, 0.069],
      stamp: [
        s[0] + (s[2] - a) / 2,
        s[1] + (s[3] - i) / 2,
        a,
        i
      ]
    };
  }
  return t.layout === "split-half" ? {
    ...Z,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : { ...Z, art: v0(t) };
}
function Iu(t) {
  const e = tt(t) === "saga", r = Ft(t).rules, n = kr(t), o = r[2] * 488 - (e ? 32 : 70), s = r[3] * 680;
  let a = e ? 21 : 19;
  const i = (y, b) => Math.max(1, Math.ceil(y.length * b * 0.49 / o)), d = (y, b) => Math.max(e ? y.badges.length * 36 : 34, i(y.text, b) * b + 16), l = (y) => n.reduce((b, p) => b + d(p, y), 0);
  for (; a > 8 && l(a) > s; ) a -= 0.5;
  const u = n.map((y) => d(y, a)), h = Math.max(0, s - l(a)) / Math.max(1, n.length);
  let m = s / Math.max(1, n.length), c = s, g = n.length;
  if (!e)
    for (const y of [...u].sort((b, p) => p - b)) {
      if (y <= m) break;
      c -= y, m = c / Math.max(1, --g);
    }
  let f = 0;
  return n.map((y, b) => {
    const p = e ? u[b] + h : Math.max(m, u[b]), w = { ...y, top: f, height: p, font: a, left: e ? 27 : 62, width: o };
    return f += p, w;
  });
}
const Vo = {
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
function Ou(t, e) {
  if (e.watermark) return e.watermark;
  if (t.watermark) return t.watermark;
  const r = [...new Set(t.faces?.map((s) => s.watermark).filter(Boolean))];
  if (r.length !== 1) return e.watermark;
  const n = Vo[r[0]], o = new Set(t.faces?.flatMap(W));
  return n && o.size === 2 && n.every((s) => o.has(s)) ? r[0] : e.watermark;
}
function ro(t) {
  return t.watermark && Object.hasOwn(Vo, t.watermark) ? `${P}/img/watermarks/guild-${t.watermark}.svg` : null;
}
function Yi(t, e) {
  return `${Bi}/magic-new-split${t ? "-fuse" : ""}.mse-style/multicolor_blend_card${t ? e + 1 : ""}.png`;
}
function $u(t, e, r, n) {
  if (e === "m15") return [...xi(t), ro(t)];
  const o = W(t);
  return [
    Hr(t, e, r, n),
    ro(t),
    ...e === "eighth" && o.length === 2 ? [
      Yi(r, n),
      ...o.map(
        (s) => Hr({ ...t, colors: [s], frameColors: void 0 }, e, r, n)
      )
    ] : [],
    ...e === "eighth" && t.artist ? [`${P}/img/manaSymbols/brush.svg`] : []
  ];
}
const Os = /* @__PURE__ */ new WeakMap();
function qi(t) {
  const e = Os.get(t);
  if (e) return e;
  const r = I();
  r.width = t.width, r.height = t.height;
  const n = r.getContext("2d", { willReadFrequently: !0 });
  n.drawImage(t, 0, 0);
  const o = n.getImageData(0, 0, r.width, r.height);
  for (let s = 0; s < o.data.length; s += 4) o.data[s + 3] = o.data[s];
  return n.putImageData(o, 0, 0), Os.set(t, r), r;
}
const $s = /* @__PURE__ */ new WeakMap();
function Gu(t, e, r, n, o) {
  const s = (w) => {
    const S = o.get(w);
    if (!S) throw Error(`Split asset unavailable: ${w}`);
    return S;
  }, a = s(Hr(t, e, r, n)), i = W(t);
  if (e !== "eighth" || i.length !== 2) return a;
  "WUBRG".indexOf(i[1]) - "WUBRG".indexOf(i[0]) > 2 && i.reverse();
  const [d, l] = i.map(
    (w) => s(
      Hr({ ...t, colors: [w], frameColors: void 0 }, e, r, n)
    )
  ), u = s(Yi(r, n)), h = i.join(""), m = $s.get(a) ?? /* @__PURE__ */ new Map();
  $s.set(a, m);
  const c = m.get(h);
  if (c?.left === d && c.right === l && c.mask === u) return c.canvas;
  const g = I();
  g.width = a.width, g.height = a.height;
  const f = I();
  f.width = a.width, f.height = a.height;
  const y = g.getContext("2d"), b = f.getContext("2d");
  b.drawImage(l, 0, 0), b.globalCompositeOperation = "destination-in";
  const p = b.createLinearGradient(0, 0, a.width, 0);
  return p.addColorStop(0, "#0000"), p.addColorStop(0.4, "#0000"), p.addColorStop(0.6, "#000"), p.addColorStop(1, "#000"), b.fillStyle = p, b.fillRect(0, 0, a.width, a.height), y.drawImage(d, 0, 0), y.drawImage(f, 0, 0), y.globalCompositeOperation = "destination-in", y.drawImage(qi(u), 0, 0), y.globalCompositeOperation = "destination-over", y.drawImage(a, 0, 0), y.globalCompositeOperation = "source-over", f.width = f.height = 0, m.set(h, { left: d, right: l, mask: u, canvas: g }), g;
}
const Gs = /* @__PURE__ */ new WeakMap();
function Pu(t, e, r, n) {
  const o = ro(e);
  if (!o) return;
  const s = r.get(o);
  if (!s) throw Error(`Split watermark unavailable: ${o}`);
  const a = W(e), i = a.length === 1 ? [a[0], a[0]] : Vo[e.watermark], d = i.join(""), l = Gs.get(s) ?? /* @__PURE__ */ new Map();
  Gs.set(s, l);
  let u = l.get(d);
  if (!u) {
    u = I(), u.width = s.width, u.height = s.height;
    const f = u.getContext("2d");
    f.drawImage(s, 0, 0), f.globalCompositeOperation = "source-in";
    const y = {
      W: "#b39f4d",
      U: "#718dac",
      B: "#998795",
      R: "#b6723f",
      G: "#69936e"
    }, [b, p] = i, w = f.createLinearGradient(0, 0, u.width, 0);
    w.addColorStop(0, y[b]), w.addColorStop(0.499, y[b]), w.addColorStop(0.5, y[p]), w.addColorStop(1, y[p]), f.fillStyle = w, f.fillRect(0, 0, u.width, u.height), l.set(d, u);
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
  const e = Te(t), r = Nt(t), n = r === "m15" ? Yr : Ii;
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
      watermark: r ? Ou(t, o) : o.watermark,
      layout: e ? s === 0 ? "aftermath-top" : "aftermath-bottom" : r ? `split-${r}${ze(t) && r !== "old" ? "-fuse" : ""}` : "split-half",
      frameAssetFamily: void 0,
      faces: void 0,
      rulesText: o.rulesText?.split(`
`).filter((d) => !/^Fuse\b/.test(d)).join(`
`),
      rulesParagraphs: o.rulesParagraphs?.filter(
        (d) => !/^Fuse\b/.test(d.runs.map((l) => l.text).join(""))
      ),
      illustration: o.illustration ?? t.illustration,
      etchedIllustration: o.etchedIllustration ?? (o.illustration ? void 0 : t.etchedIllustration),
      illustrationCrop: o.illustrationCrop ?? (!o.illustration && t.illustration ? [s ? a : 0, 0, s ? 1 - a : a, 1] : void 0)
    };
    return e ? s === 0 ? { face: i, x: 0, y: 0, width: 488, height: ye, rotation: 0 } : {
      face: i,
      x: 488,
      y: ye,
      width: Ri,
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
      y: (s ? 333 : 648) - (Zo(t) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function _f(t) {
  return {
    left: `${t.x / T * 100}%`,
    top: `${t.y / E * 100}%`,
    width: `${t.width / T * 100}%`,
    height: `${t.height / E * 100}%`,
    transform: `rotate(${t.rotation}deg)`
  };
}
function Hi(t, e) {
  t.translate(e.x, e.y), t.rotate(e.rotation * Math.PI / 180), t.scale(e.width / T, e.width / T);
}
function Ps(t, e) {
  const r = e[0] * t.width, n = e[1] * t.height, o = e[2] * t.width, s = e[3] * t.height;
  return t.rotation === -90 ? [
    (t.x + n) / T,
    (t.y - r - o) / E,
    s / T,
    o / E
  ] : t.rotation === 90 ? [
    (t.x - n - s) / T,
    (t.y + r) / E,
    s / T,
    o / E
  ] : [(t.x + r) / T, (t.y + n) / E, o / T, s / E];
}
function Wu(t) {
  return t.layout === "split-half" || t.layout === "aftermath-bottom" ? 1.5 : 1;
}
const Zo = ze;
function Ye(t) {
  if (st(t) || t.frameAssetFamily === "eighth" || t.frameTemplate === "future" || t.frameTemplate === "flip")
    return !1;
  const e = Nt(t);
  return !e || e === "m15" || Te(t);
}
function Fu(t) {
  if (!Ye(t)) return { shared: [], stock: [] };
  const e = (n) => ({ shared: [], stock: n });
  if (t.frameAssetFamily === "m15-accurate") {
    const n = Mt(t);
    return e(
      n ? [n.frame, ...n.rightFrame ? [n.rightFrame] : [], n.border] : []
    );
  }
  if (t.frameTemplate === "battle") {
    const n = Uo(t);
    return e(n?.kind === "battle" ? [n.border] : []);
  }
  if (Cr(t))
    return e(
      Qt(t) ? W(t).map((n) => `${ve}/${n.toLowerCase()}.png`) : [Xr(t)]
    );
  if (mn(t)) return e([We(t)]);
  if (Te(t))
    return e(Li(t).filter((n) => n.includes("/aftermath/")));
  if (Nt(t) === "m15")
    return e(
      Gt(t).flatMap(
        (n) => xi(n.face).filter((o) => /\/[wubrgma]\.png$/.test(o))
      )
    );
  if (tt(t) === "saga") return e([Yo(t)]);
  const r = Ce(U(t), tt(t));
  return {
    shared: [
      r.frame,
      r.background,
      r.boxes,
      r.pt,
      ...U(t).legendary ? [r.crown] : []
    ],
    stock: []
  };
}
const _u = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Uu = "#16130e", ju = [22 / 255, 19 / 255, 14 / 255];
function Qo(t) {
  const e = le(t), r = e.calibration, n = { ...e }, o = typeof r == "object";
  if (o && !Ye(e))
    throw Error("M21 calibration requires a modern frame.");
  const s = e.frameAssetFamily ? Mt(n) : null, a = r === "source" ? void 0 : (s ? Je(n, s.frame) : void 0) ?? ou(n), i = r === "source" ? {} : xs(n), d = o ? {} : { ...i }, l = [];
  let u = o ? void 0 : a, h = !1;
  if ((r === "auto" || o) && Ye(e)) {
    const m = Fu(e), c = U(e), g = {
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
    for (const [y, b] of Object.entries(xs(g)))
      !f.has(y) || d[y] || (d[y] = b, l.push(y));
    if (!u && Pt(e.setCode, e.borderColor).border === "#090806") {
      u = Uu, h = !0;
      for (const y of m.stock)
        d[y] = { ...d[y] ?? _u, outerStock: ju };
    }
  }
  return {
    face: e,
    materials: d,
    measured: i,
    border: u,
    fallbackStock: h,
    fallbackAssets: l,
    assets: Ce(U(e)),
    explicitProfile: o
  };
}
const Xi = (t) => Qo(t).materials, At = (t) => Qo(t).border, no = (t, e) => {
  const r = le(t);
  return r.calibration === "source" ? void 0 : Si(r, e);
};
function Jr(t, e, r = 1, n = 1, o = 0) {
  const s = t.illustrationPlacement;
  if (!s) return e;
  if (!s.every(Number.isFinite) || s[2] <= 0 || s[3] <= 0)
    throw Error("Artwork placement requires finite coordinates and positive dimensions");
  return o === -90 ? zr(s) : [s[0] * r, s[1] * n, s[2] * r, s[3] * n];
}
function Kr(t, e, r, n) {
  return go(t, e, r, n);
}
function Du(t, e, r, n, o) {
  const s = [n[0] * t, n[1] * e, n[2] * t, n[3] * e];
  return [...s, ...Kr(s[2], s[3], r, o)];
}
function Ji(t) {
  return t.faces?.length || t.layout && !["normal", "token", "transform", "modal_dfc", "reversible_card", "meld"].includes(
    t.layout
  ) || t.frameTemplate && t.frameTemplate !== "future" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? "") ? {
    modes: [],
    reason: "Art placement currently requires an ordinary physical face or Futureshifted template."
  } : {
    modes: t.frameTemplate === "future" && t.futureTreatment !== "full-art" ? ["window", "behind-text"] : ["window"]
  };
}
function ts(t) {
  const e = t.artPlacement;
  if (e !== void 0) {
    if (!e || typeof e != "object" || Array.isArray(e))
      throw Error("Invalid artwork placement");
    if (Object.keys(e).some((r) => !["mode", "focalPoint", "zoom", "paperOpacity"].includes(r)))
      throw Error("Unknown artwork placement option");
    if (!Ji(t).modes.includes(e.mode))
      throw Error("This frame does not support the selected art placement.");
    if (e.paperOpacity !== void 0 && (e.mode !== "behind-text" || !Number.isFinite(e.paperOpacity) || e.paperOpacity < 0 || e.paperOpacity > 1))
      throw Error("Paper opacity requires behind-text mode and a value within 0..1");
    go(1, 1, [0, 0, 1, 1], e);
  }
}
function Nu(t, e) {
  const { illustrationPlacement: r, ...n } = t, o = { ...n, artPlacement: structuredClone(e) };
  return ts(o), o;
}
function Uf(t, e, r) {
  if (ts(t), !Number.isFinite(e) || !Number.isFinite(r) || e <= 0 || r <= 0)
    throw Error("Artwork dimensions must be positive");
  const n = t.illustrationCrop ?? [0, 0, 1, 1], o = Ft(t).art, s = t.frameTemplate === "battle", a = s ? Jr(t, zr(o), 523, 375, -90) : Jr(
    t,
    [o[0] * 488, o[1] * 680, o[2] * 488, o[3] * 680],
    488,
    680
  ), i = go(e * n[2], r * n[3], a, t.artPlacement);
  return {
    source: n,
    destination: s ? Fo(i) : [i[0] / 488, i[1] / 680, i[2] / 488, i[3] / 680],
    aperture: o
  };
}
const Pr = {
  fontSize: 19.5,
  fontFamily: '"CardRenderer MTG Beleren", Georgia',
  fontWeight: 700,
  ink: "#fff",
  numeralOffsetX: -0.5,
  numeralOffsetY: { plus: -0.25, zero: -3.25, minus: -4.5 },
  horizontalInset: 10,
  widthScale: 0.97
};
function zu(t, e, [r, n, o, s]) {
  Ki(t, e, 24, r + o / 2, n + s / 2 + 2.5, o * 0.72);
}
function Yu(t, e, [r, n, o, s]) {
  const a = Pr, i = a.numeralOffsetY[e.startsWith("+") ? "plus" : e === "0" ? "zero" : "minus"];
  Ki(
    t,
    e,
    a.fontSize,
    r + o / 2 + a.numeralOffsetX,
    n + s / 2 + i,
    o - a.horizontalInset,
    a.widthScale
  );
}
function Ki(t, e, r, n, o, s, a = 1) {
  t.save(), t.fillStyle = Pr.ink, t.font = `${Pr.fontWeight} ${r}px ${Pr.fontFamily}`, t.textAlign = "center", t.textBaseline = "alphabetic", t.letterSpacing = "0px", t.shadowColor = "transparent";
  const i = t.measureText(e), d = Math.min(s, i.width * a), l = Math.min(1, d / Math.max(1, i.width)), u = n + (i.actualBoundingBoxLeft - i.actualBoundingBoxRight) * l / 2, h = o + (i.actualBoundingBoxAscent - i.actualBoundingBoxDescent) / 2;
  t.fillText(e, u, h, d), t.restore();
}
function oo(t, e) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.letterSpacing = "0px", t.fillStyle = Pt(e.setCode, e.borderColor).ink, t.textBaseline = "alphabetic", t.textAlign = "left", t.font = '11px "CardRenderer MTG Relay", sans-serif', X(
    t,
    e,
    "collector",
    () => t.fillText(bo(e), 30, 645)
  );
  const r = (e.collectorSetCode ?? e.setCode)?.trim().toUpperCase() ?? "", n = r ? `${r} • ${e.collectorLanguage?.toUpperCase() ?? "EN"}` : "";
  X(t, e, "collector", () => t.fillText(n, 30, 658));
  const o = yo(e), s = e.power != null && e.toughness != null || e.loyalty != null;
  let a = 30 + t.measureText(n).width + (n ? 7 : 0);
  X(t, e, "artist", () => {
    e.artist && (t.font = '11px "CardRenderer MTG Artist Credit", sans-serif', t.fillText("a", a, 658), a += t.measureText("a").width + 2, t.font = '700 11px "CardRenderer MTG Beleren Small Caps", Georgia', t.fillText(e.artist, a, 658, Math.max(1, (o && s ? 272 : 456) - a)));
  }), o && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', X(t, e, "legal", () => t.fillText(o, 456, s ? 658 : 645, 178))), t.restore();
}
const Ws = /* @__PURE__ */ new WeakMap();
function qu(t) {
  const e = Ws.get(t);
  if (e) return e;
  const r = I();
  r.width = r.height = 16;
  try {
    const n = r.getContext("2d", { willReadFrequently: !0 });
    n.drawImage(t, 0, 0, 16, 16);
    const o = n.getImageData(0, 0, 16, 16).data, s = [[], [], []];
    for (let i = 0; i < 16; i++)
      for (let d = 0; d < 16; d++) {
        if (d > 0 && d < 15 && i > 0 && i < 15) continue;
        const l = (i * 16 + d) * 4;
        o[l + 3] < 128 || s.forEach((u, h) => u.push(o[l + h]));
      }
    const a = `rgb(${s.map((i) => i.sort((d, l) => d - l)[Math.floor(i.length / 2)] ?? 128).join(" ")})`;
    return Ws.set(t, a), a;
  } finally {
    r.width = r.height = 0;
  }
}
function _t(t, e, r, n, o, s = [488, 680], a = 0) {
  const [i, d, l, u] = n, h = tt(e);
  if (t.save(), h.startsWith("planeswalker") && Bu(t, h === "planeswalker-large"), o === "printing") {
    t.clearRect(i, d, l, u), t.restore();
    return;
  }
  const m = r.get(e.illustration ?? "");
  if ((o === "artwork" || h.startsWith("planeswalker") || e.illustrationPlacement) && (t.fillStyle = m && e.illustrationPlacement ? qu(m) : "#80745c", t.fillRect(i, d, l, u)), !m) {
    t.restore();
    return;
  }
  t.beginPath(), t.rect(i, d, l, u), t.clip();
  const c = Jr(e, n, s[0], s[1], a);
  e.illustrationCrop ? t.drawImage(
    m,
    ...Du(
      m.width,
      m.height,
      c,
      e.illustrationCrop,
      e.artPlacement
    )
  ) : t.drawImage(
    m,
    ...Kr(m.width, m.height, c, e.artPlacement)
  ), t.restore();
}
const Fs = /* @__PURE__ */ new WeakMap();
function Wr(t) {
  const e = Fs.get(t);
  if (e) return e;
  const r = I();
  r.width = t.width, r.height = t.height;
  const n = r.getContext("2d", { willReadFrequently: !0 });
  n.drawImage(t, 0, 0);
  const o = n.getImageData(0, 0, r.width, r.height);
  for (let s = 0; s < o.data.length; s += 4)
    o.data[s + 3] = Math.round(o.data[s] * o.data[s + 3] / 255), o.data[s] = o.data[s + 1] = o.data[s + 2] = 255;
  return n.putImageData(o, 0, 0), Fs.set(t, r), r;
}
function Hu(t) {
  const e = ct(t) === "full-art", r = U(t), n = !e && (r.land || ct(t) === "regular" && !r.artifact && W(t).length === 0), [o, s, a, i] = e ? [0.9967, 0.9995, -2.125, -0.85] : n ? [0.9976, 0.997, -1.925, -0.3] : [0.9867, 0.9929, 0, -0.175], d = e || n ? [0, 680] : [0, 85, 370, 385, 416, 430, 610, 680], l = e || n ? [0, 0] : [0, 0, 1, 1, 1.45, 1.45, 0, 0];
  return {
    sx: o,
    tx: a,
    source: d,
    target: d.map((u, h) => 340 + (u - 340) * s + i + l[h])
  };
}
function Xu(t, e) {
  const r = I();
  r.width = t.width, r.height = t.height;
  const n = r.getContext("2d"), o = Hu(e), s = t.height / 680;
  try {
    for (let a = 0; a < o.source.length - 1; a++) {
      const i = o.source[a], d = o.source[a + 1], l = o.target[a], u = o.target[a + 1], h = (u - l) / (d - i), m = Math.round(l * s), c = Math.round(u * s);
      n.save(), n.beginPath(), n.rect(0, m, r.width, c - m), n.clip(), n.transform(
        o.sx,
        0,
        0,
        h,
        (244 * (1 - o.sx) + o.tx) * s,
        (l - h * i) * s
      ), n.drawImage(t, 0, 0), n.restore();
    }
    return r;
  } catch (a) {
    throw r.width = r.height = 0, a;
  }
}
function pr(t, e) {
  const r = I();
  return r.width = t, r.height = e, r;
}
function Ju(t, e) {
  const r = pr(t.width, t.height), n = r.getContext("2d"), o = pr(t.width, t.height), s = o.getContext("2d");
  for (const [a, i] of [t, e].entries()) {
    s.clearRect(0, 0, o.width, o.height), s.globalCompositeOperation = "source-over", s.drawImage(i, 0, 0, o.width, o.height);
    const d = s.createLinearGradient(o.width * 0.4, 0, o.width * 0.6, 0);
    d.addColorStop(0, a ? "#0000" : "#000"), d.addColorStop(1, a ? "#000" : "#0000"), s.globalCompositeOperation = "destination-in", s.fillStyle = d, s.fillRect(0, 0, o.width, o.height), n.globalCompositeOperation = "lighter", n.drawImage(o, 0, 0);
  }
  return o.width = o.height = 0, r;
}
function Ku(t, e) {
  const r = te(t), n = pr(976, 1360), o = n.getContext("2d"), s = (d) => {
    const l = e.get(d);
    if (!l) throw Error(`Futureshifted frame asset unavailable: ${d}`);
    return l;
  }, a = (d, l, u, h) => {
    if (!l) return s(d);
    const m = Ju(s(d), s(l));
    if (u && h) {
      const c = m.getContext("2d");
      c.globalCompositeOperation = "destination-in", c.drawImage(Wr(s(h)), 0, 0, m.width, m.height), c.globalCompositeOperation = "destination-over", c.drawImage(s(u), 0, 0, m.width, m.height);
    }
    return m;
  }, i = (d, l, u, h, m) => {
    o.drawImage(d, l, u, h, m), d instanceof ImageBitmap || (d.width = d.height = 0);
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
      const d = ct(t) === "full-art";
      if (!d && ct(t) !== "clear") {
        const [, c, , g] = Lo({ ...t, artPlacement: void 0 }).art;
        o.beginPath(), o.rect(0, c * 523 / 680, 375, g * 523 / 680), o.clip();
      }
      const [l, u, h, m] = d ? [37, 46, 322, 418] : [32, 44, 327, 310];
      o.drawImage(Wr(s(r.mask)), l, u, h, m), o.restore();
    }
    if (r.paper && i(a(r.paper, r.reversePaper), 23, 320, 335, 152), r.type && i(
      a(r.type, r.reverseType, r.neutralType, r.typeBlend),
      18,
      17,
      339,
      464
    ), t.artPlacement?.mode === "behind-text") {
      o.save(), o.globalCompositeOperation = "destination-out", o.globalAlpha = 1 - (t.artPlacement.paperOpacity ?? 0.8);
      const d = new Path2D("M33 326 C25 350 22 413 37 465 L337 465 C351 450 354 379 344 326 Z");
      o.fill(d), o.restore();
    }
    if (r.stats)
      if (r.statsMask) {
        const d = pr(156, 102), l = d.getContext("2d");
        l.drawImage(s(r.stats), 0, 0, 156, 102), l.globalCompositeOperation = "destination-in", l.drawImage(Wr(s(r.statsMask)), 0, 0, 156, 102), i(d, 279, 454, 78, 51);
      } else r.paper ? o.drawImage(s(r.stats), 285, 452, 70, 52) : o.drawImage(s(r.stats), 375 * 0.7621, 523 * 0.8834, 375 * 0.1734, 523 * 0.0781);
    return Xu(n, t);
  } finally {
    n.width = n.height = 0;
  }
}
function Vu(t, e) {
  const r = pr(t.width, t.height), n = r.getContext("2d");
  return n.fillStyle = "white", ct(e) === "clear" || e.artPlacement?.mode === "behind-text" ? n.fillRect(46, 44, 442 * 2, 637 * 2) : (n.fillRect(48, 160, 444 * 2, (ct(e) === "full-art" ? 482 : 303) * 2), n.globalCompositeOperation = "destination-out", n.drawImage(t, 0, 0)), r;
}
const so = (t, e = !1) => `${e ? "italic " : ""}${t}px "CardRenderer MTG MPlantin", Georgia`;
function Zu(t) {
  const e = [];
  let r = [], n = !1;
  const o = () => {
    r.length && (e.push({ pieces: r, space: n }), r = [], n = !1);
  };
  for (const s of t)
    for (const a of ln(s.text))
      if (a.symbol) r.push({ text: a.symbol, symbol: !0, italic: !1 });
      else
        for (const i of a.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(i) ? (o(), i === `
` ? (e.push({ pieces: [], space: !1, newline: !0 }), n = !1) : n = !0) : r.push({ text: i, symbol: !1, italic: !!s.italic });
  return o(), e;
}
function pe(t, e, r, n = 1) {
  const o = [];
  for (const s of e) {
    const a = s.symbol ? s : { ...s, text: s.text.replaceAll("­", "") };
    if (!a.text) continue;
    const i = o.at(-1);
    i && !i.symbol && !a.symbol && i.italic === a.italic ? i.text += a.text : o.push({ ...a });
  }
  return o.map((s) => {
    t.font = so(r, s.italic);
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
function Qu(t, e, r, n, o, s = 1) {
  let a = null;
  for (let i = 0; i < r.length; i++) {
    const d = r[i];
    if (!d.symbol)
      for (let l = 0; l < d.text.length; l++) {
        const u = d.text[l] === "—";
        if (d.text[l] !== "­" && !u || ![...r.slice(0, i), { ...d, text: d.text.slice(0, l) }].some(
          (c) => c.text.replaceAll("­", "").length
        ))
          continue;
        const h = [
          ...r.slice(0, i),
          { ...d, text: d.text.slice(0, l) + (u ? "—" : "-") }
        ], m = [{ ...d, text: d.text.slice(l + 1) }, ...r.slice(i + 1)];
        m.some((c) => c.text.replaceAll("­", "").length) && pe(t, [...e, ...h], o, s).reduce((c, g) => c + g.width, 0) <= n && (a = { head: h, tail: m });
      }
  }
  return a;
}
function Vi(t, e, r, n, o = 1) {
  const s = [];
  let a = [];
  for (const i of e) {
    if (i.newline) {
      s.push(pe(t, a, n, o)), a = [];
      continue;
    }
    let d = i.pieces, l = a.length && i.space ? [{ text: " ", italic: i.pieces[0]?.italic ?? !1, symbol: !1 }] : [];
    for (; ; ) {
      if (pe(t, [...a, ...l, ...d], n, o).reduce((m, c) => m + c.width, 0) <= r) {
        a.push(...l, ...d);
        break;
      }
      const h = Qu(
        t,
        [...a, ...l],
        d,
        r,
        n,
        o
      );
      if (h)
        s.push(pe(t, [...a, ...l, ...h.head], n, o)), a = [], l = [], d = h.tail;
      else if (a.length)
        s.push(pe(t, a, n, o)), a = [], l = [];
      else {
        a.push(...d);
        break;
      }
    }
  }
  return a.length && s.push(pe(t, a, n, o)), s;
}
function _s(t, e, r, n, o = 1) {
  const s = Vi(t, e, r, n, o);
  if (s.length < 2) return s;
  const a = /* @__PURE__ */ new Map(), i = (m, c) => {
    const g = `${m}:${c}`;
    let f = a.get(g);
    if (!f) {
      const y = [];
      for (let b = m; b < c; b++) {
        const p = e[b];
        b > m && p.space && y.push({ text: " ", italic: p.pieces[0]?.italic ?? !1, symbol: !1 }), y.push(...p.pieces);
      }
      f = pe(t, y, n, o), a.set(g, f);
    }
    return f;
  }, d = /* @__PURE__ */ new Map(), l = (m, c) => {
    if (!c) return m === e.length ? { cost: 0, cuts: [] } : null;
    const g = `${m}:${c}`;
    if (d.has(g)) return d.get(g);
    let f = null;
    for (let y = m + 1; y <= e.length - c + 1; y++) {
      const b = i(m, y).reduce((S, v) => S + v.width, 0);
      if (b > r) break;
      const p = l(y, c - 1);
      if (!p) continue;
      const w = p.cost + (r - b) ** 2;
      (!f || w < f.cost) && (f = { cost: w, cuts: [y, ...p.cuts] });
    }
    return d.set(g, f), f;
  }, u = l(0, s.length);
  if (!u) return s;
  let h = 0;
  return u.cuts.map((m) => {
    const c = i(h, m);
    return h = m, c;
  });
}
function Us(t, e, r, n, o = !1, s = 1) {
  const a = Zu(e);
  if (!o || a.length > 64 || e.some((l) => l.text.includes("­")))
    return Vi(t, a, r, n, s);
  const i = [];
  let d = [];
  for (const l of a)
    l.newline ? (i.push(
      ...d.length ? _s(t, d, r, n, s) : [[]]
    ), d = []) : d.push(l);
  return d.length && i.push(..._s(t, d, r, n, s)), i;
}
const th = new Set(
  "mir vis 5ed wth tmp sth exo usg ulg 6ed uds mmq nem pcy inv pls 7ed apc ody tor jud ons lgn scg por p02 ptk".split(
    " "
  )
);
function eh(t) {
  return th.has(t?.toLowerCase() ?? "");
}
function rh(t) {
  if (t.role !== "flavor" || t.align !== void 0) return [t];
  const e = t.runs.map((a) => a.text).join(""), r = [...e.matchAll(/(?:^|\n)[^\S\n]*(?:—|–|--)[^\S\n]*(?=\S)/g)].at(-1);
  if (!r) return [t];
  const n = r.index, o = n + (e[n] === `
` ? 1 : 0), s = (a, i) => {
    let d = 0;
    return t.runs.flatMap((l) => {
      const u = l.text.slice(Math.max(0, a - d), Math.max(0, i - d));
      return d += l.text.length, u ? [{ ...l, text: u }] : [];
    });
  };
  return [
    ...n ? [{ ...t, runs: s(0, n) }] : [],
    { ...t, align: "right", runs: s(o, e.length) }
  ];
}
const Zi = /* @__PURE__ */ new WeakMap(), dr = (t) => Zi.get(t), Vr = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function $(t, e, r, n = 24, o = 15, s = Vr) {
  const a = s.textWidth ?? 1;
  if (!Number.isFinite(a) || a <= 0)
    throw Error("Magic rules text width must be finite and positive.");
  t.save(), t.letterSpacing = "0px", t.textBaseline = "alphabetic", t.textAlign = "left";
  try {
    const i = s.flavorAttribution === "right" ? e.flatMap(rh) : e;
    let d, l = n;
    do {
      const u = [], h = [];
      let m = 0, c;
      for (const C of i) {
        let k = l, x = Us(
          t,
          C.runs,
          r.width,
          k,
          s.balanceLines && (!s.balanceCenteredOnly || C.align === "center"),
          a
        );
        if (C.role === "flavor" && s.flavorOrphans !== !1 && x.length > 2 && x.at(-1).reduce((M, R) => M + R.width, 0) < r.width * 0.3)
          for (let M = k - 0.25; M >= k * 0.94; M -= 0.25) {
            const R = Us(
              t,
              C.runs,
              r.width,
              M,
              s.balanceLines && (!s.balanceCenteredOnly || C.align === "center"),
              a
            );
            if (R.length < x.length) {
              k = M, x = R;
              break;
            }
          }
        if (x.length) {
          c && (c === "rules" && C.role === "flavor" ? m += l * s.flavorGap : (c !== "flavor" || C.role !== "flavor") && (m += l * s.paragraphGap));
          for (const M of x) {
            const R = Math.max(0, ...M.map((Y) => Y.ascent)), L = Math.max(0, ...M.map((Y) => Y.descent)), G = M.reduce((Y, lt) => Y + lt.width, 0), A = r.x + (C.align === "right" ? r.width - G : C.align === "center" ? (r.width - G) / 2 : 0);
            let F = 0, O = 1 / 0, K = -1 / 0;
            for (const Y of M)
              O = Math.min(O, F + Y.inkLeft), K = Math.max(K, F + Y.inkRight), F += Y.width;
            u.push({
              x: A,
              runs: M,
              role: C.role,
              baseline: m,
              width: G,
              inkBounds: [
                A + (M.length ? O : 0),
                m - R,
                M.length ? K - O : 0,
                R + L
              ]
            }), m += k * s.leading;
          }
          c = C.role;
        }
      }
      if (s.flavorSeparator !== !1)
        for (let C = 1; C < u.length; C++) {
          const k = u[C - 1], x = u[C];
          if (k.role !== "rules" || x.role !== "flavor") continue;
          const M = k.inkBounds[1] + k.inkBounds[3];
          h.push((M + x.inkBounds[1]) / 2 - 0.3);
        }
      const g = u[0]?.inkBounds[1] ?? 0, f = u.at(-1)?.inkBounds, y = f ? f[1] + f[3] - g : 0, b = Math.max(0, r.height - y), p = r.y + Math.max(0, Math.min(b, b / 2 + (s.centerOffset ?? 0))), w = Math.max(r.y, r.verticalLimits?.[0] ?? r.y), S = Math.min(
        r.y + r.height,
        r.verticalLimits?.[1] ?? r.y + r.height
      ), v = Math.max(w, Math.min(S - y, p)) - g;
      if (d = {
        size: l,
        x: r.x,
        top: g + v,
        width: r.width,
        height: y,
        overflow: y > S - w + 0.01 || u.some((C) => C.width > r.width + 0.01),
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
      }, d.overflow ||= d.lines.some(
        (C) => r.exclusions?.some(([k, x, M, R]) => {
          const [L, G, A, F] = C.inkBounds;
          return L < k + M && L + A > k && G < x + R && G + F > x;
        })
      ), !d.overflow || l <= o) break;
      l = Math.max(o, l - 0.25);
    } while (!0);
    return Zi.set(d, { paragraphs: e, bounds: r, maximumSize: n, minimumSize: o, typography: s }), d;
  } finally {
    t.restore();
  }
}
function nh(t, e, r) {
  const [n, o, s, a] = r, i = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((d) => ({ role: "rules", runs: [{ text: d }] }));
  return $(
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
function Ze(t, e, r, n, o, s, a, i, d = 1 / 0) {
  const l = (c) => (c.align === void 0 || c.align === "center") && c.runs.length > 0 && c.runs.every((g) => !g.text.includes(`
`));
  if (!r.length || !r.every(l) || !e.every(l)) return null;
  const u = r.map((c) => c.runs.map((g) => g.text).join("")).join(`
`);
  if (Array.from(u.replace(/\{[^}]+\}/g, "●")).length > d) return null;
  const h = (c) => c.map((g) => ({ ...g, align: "center" })), m = $(t, h(r), n, o, o, i);
  return m.overflow || m.lines.length > a ? null : $(t, h(e), n, o, s, i);
}
const qe = {
  ordinary: [0.436 * 488, 0.9034 * 680, 0.128 * 488, 0.0458 * 680],
  planeswalker: [0.4394 * 488, 0.9015 * 680, 0.1214 * 488, 0.051 * 680],
  saga: [213.7, 620.2, 60.5, 25.3],
  aftermath: [222, 623, 43, 20],
  split: [223.5, 620, 43, 21.5]
}, jf = {
  ordinary: { size: [192, 96], interior: [29, 29, 134, 67] },
  planeswalker: { size: [182, 107], interior: [24, 26, 134, 67] },
  saga: { size: [186, 78], interior: [26, 11, 134, 67] },
  plain: { size: [134, 67], interior: [0, 0, 134, 67] }
};
function be(t) {
  if (!zt(t) || st(t) || t.frameAssetFamily === "eighth" || t.frameTemplate || t.faces?.length || t.layout && !["normal", "planeswalker", "transform", "modal_dfc", "meld"].includes(t.layout))
    return null;
  const e = tt(t), r = e.startsWith("planeswalker");
  if (e !== "normal" && !r) return null;
  const n = U(t), o = n.boxes === "Gold" ? "M" : n.boxes === "Artifact" ? "A" : n.boxes === "Land" ? "L" : n.boxes === "Colourless" ? r ? "A" : "C" : n.boxes, s = W(t);
  s.length === 2 && "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 && s.reverse();
  const a = s.length > 2 ? ["M"] : s.length ? s : [o], i = (d) => r ? `${P}/img/frames/planeswalker/holo/${d.toLowerCase()}.png` : `${P}/img/frames/m15/holoStamps/m15HoloStamp${d}.png`;
  return {
    image: i(a[0]),
    ...a.length === 2 ? { rightImage: i(a[1]) } : {},
    rect: r ? qe.planeswalker : qe.ordinary
  };
}
function Qi(t, e, r) {
  const n = be(e);
  if (!n) return;
  const o = r.get(n.image);
  if (!o) throw Error("Authenticity stamp asset is unavailable.");
  t.save(), t.shadowColor = "transparent", t.drawImage(o, ...n.rect), t.restore();
}
const oh = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function sh(t) {
  return !oh.has(t?.trim().toLowerCase() ?? "");
}
function ah(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = Mt(t);
  if (!(!e || !Wt(t, e.frame)))
    return t.frameTreatment === "colorshifted" ? [0.7234, 0.881, 0.204, 0.0772] : [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814];
}
function ih(t, e, r) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return e;
  const n = Mt(t);
  if (!n || !Wt(t, n.frame) || !e.lines.length)
    return e;
  let o = 0;
  const s = e.lines.map((m, c) => {
    if (c) {
      const g = e.lines[c - 1], f = g.runs[0]?.size ?? e.size, y = m.baseline - g.baseline - f, b = g.role === "rules" && m.role === "flavor" ? 0.625 / 0.9 : 0.4375 / 0.45;
      o += f * (0.965 - 1) + y * (b - 1);
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
  }), a = s[0], i = s.at(-1), d = i.inkBounds[1] + i.inkBounds[3] - a.inkBounds[1], l = r.y + Math.max(0, (r.height - d) / 2), u = l - a.inkBounds[1], h = s.map((m) => ({
    ...m,
    baseline: m.baseline + u,
    inkBounds: [
      m.inkBounds[0],
      m.inkBounds[1] + u,
      m.inkBounds[2],
      m.inkBounds[3]
    ]
  }));
  return d > r.height + 0.01 || h.some(
    (m) => r.exclusions?.some(([c, g, f, y]) => {
      const [b, p, w, S] = m.inkBounds;
      return b < c + f && b + w > c && p < g + y && p + S > g;
    })
  ) ? e : { ...e, x: e.x + 2.25, top: l, height: d, lines: h };
}
function lh(t, e, r, n, o) {
  if (e.setCode?.toLowerCase() !== "plc" || e.frameAssetFamily !== "eighth" || e.frameTemplate || e.layout && e.layout !== "normal" || n.size !== 24.5 || n.lines.length > 5)
    return n;
  const s = Mt(e);
  if (!s || !Wt(e, s.frame)) return n;
  const a = {
    leading: 0.965,
    paragraphGap: 0.4375,
    flavorGap: 0.625,
    flavorSeparator: !1
  }, i = { ...o, x: n.x }, d = (l) => r.some((u) => {
    if (u.runs.some((c) => c.text.includes(`
`))) return !1;
    const h = $(
      t,
      [u],
      { ...i, height: 1e3, exclusions: [] },
      l,
      l,
      a
    ), m = h.lines.at(-1);
    return h.lines.length < 2 || !m || m.width >= o.width * 0.35 ? !1 : u.role === "rules" || (m.runs.map((c) => c.text).join("").trim().match(/\S+/g)?.length ?? 0) === 1;
  });
  if (!d(n.size)) return n;
  for (let l = n.size - 0.25; l >= n.size - 2; l -= 0.25) {
    const u = $(t, r, i, l, l, a);
    if (!u.overflow && u.lines.length < n.lines.length && !d(l))
      return u;
  }
  return n;
}
function tl(t, e, r = E, n = 1) {
  const o = Ft(e), s = ah(e), a = s ?? o.stats, i = {
    ...Vr,
    flavorSeparator: e.frameAssetFamily === "eighth" ? !1 : sh(e.setCode)
  }, [d, l, u, h] = o.rules, m = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((p) => ({ role: "rules", runs: [{ text: p }] })), c = be(e), g = {
    x: d * T + (e.frameAssetFamily ? 0 : 3.5),
    y: l * r + (e.frameAssetFamily ? 0 : 7),
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
          (c.rect[1] - 1) * r / E,
          c.rect[2] + 2,
          (c.rect[3] + 2) * r / E
        ]
      ] : []
    ]
  }, f = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? m : m;
  if (e.rulesAlignment?.mode !== "left" && ["10e", "m10", "m11", "m12", "m13", "m14"].includes(e.setCode?.toLowerCase() ?? "") && f.every((p) => p.role === "rules")) {
    const p = Ze(
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
  const y = e.rulesAlignment?.mode === "left" ? m.map((p) => p.role === "rules" ? { ...p, align: "left" } : p) : m;
  let b = $(t, y, g, 24.5 * n, 15 * n, i);
  return b.overflow && s && (b = $(t, y, g, b.size, 12 * n, i)), lh(
    t,
    e,
    y,
    ih(e, b, g),
    g
  );
}
function Tt(t, e, r, n = et, o = 0, s = "#17140f") {
  if (!ee(t)) return;
  if (e.overflow) throw Error("Magic rules text does not fit the available area.");
  t.save(), e.horizontalScale && t.scale(e.horizontalScale, 1), t.textAlign = "left", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
  for (const d of e.separators) {
    const l = t.createLinearGradient(e.x, d, e.x + e.width, d);
    l.addColorStop(0, "#17140f00"), l.addColorStop(0.15, "#17140f55"), l.addColorStop(0.85, "#17140f55"), l.addColorStop(1, "#17140f00"), t.fillStyle = l, t.fillRect(e.x, d, e.width, 0.6);
  }
  t.fillStyle = s;
  const a = o > 0 ? I() : null;
  a && (a.width = t.canvas.width, a.height = t.canvas.height);
  const i = a ? a.getContext("2d") : t;
  if (!i) throw Error("Missing rules text context");
  a && (i.setTransform(t.getTransform()), i.textAlign = "left", i.textBaseline = "alphabetic", i.letterSpacing = "0px", i.fillStyle = s);
  for (const d of e.lines) {
    let l = d.x ?? e.x;
    for (const u of d.runs)
      u.symbol ? n(
        t,
        u.text,
        l + u.size * 0.025,
        d.baseline - u.size * 0.72,
        u.size * 0.8,
        r
      ) : (i.font = so(u.size, u.italic), js(i, u, l, d.baseline, !1)), l += u.width;
  }
  if (a) {
    i.globalCompositeOperation = "destination-out", i.lineJoin = "round";
    for (const d of e.lines) {
      let l = d.x ?? e.x;
      for (const u of d.runs)
        u.symbol || (i.font = so(u.size, u.italic), i.lineWidth = u.size * o * 2, js(i, u, l, d.baseline, !0)), l += u.width;
    }
    t.resetTransform(), t.drawImage(a, 0, 0), a.width = a.height = 0;
  }
  t.restore();
}
function js(t, e, r, n, o) {
  const s = e.textWidth ?? 1;
  if (s === 1) {
    o ? t.strokeText(e.text, r, n) : t.fillText(e.text, r, n);
    return;
  }
  t.save(), t.translate(r, n), t.scale(s, 1), o ? t.strokeText(e.text, 0, 0) : t.fillText(e.text, 0, 0), t.restore();
}
function dh(t) {
  const e = ct(t);
  if (t.setCode?.toLowerCase() !== "fut" || e === "clear") return;
  const r = Q(t), n = V.CONJURER_ROOT + "/img/setSymbols/official/fut-";
  if (!["c", "u", "r"].some((d) => r === n + d + ".svg")) return;
  const [o, s, a, i] = e === "full-art" ? [443.5625, 581.8125, 28.1875, 20.976866533333336] : te(t).base.includes("/future/regular/futureFrame") ? [443.5, 405.125, 29, 21.851866533333336] : [443.5, 405.5, 27.875, 22.226866533333336];
  return [o - a / 2, s - i / 2, a, i];
}
function uh(t, e, r, n, o) {
  pi(e);
  const s = Ku(e, r), a = Vu(s, e), i = Lo(e), d = te(e), l = U(e), u = yi(e);
  t.save();
  try {
    if (!n) {
      const C = At(e);
      t.fillStyle = C ?? "#080808", t.fillRect(0, 0, 488, 680), C && (t.fillStyle = "#080808", t.fillRect(17, 17, 454, 646));
    }
    if (o && t.drawImage(o, 0, 0, 488, 680), n !== "printing") {
      const C = I();
      C.width = 976, C.height = 1360;
      try {
        const k = C.getContext("2d");
        k.scale(2, 2);
        const x = ct(e) === "clear" ? [23, 22, 442, 637] : i.art;
        _t(k, e, r, x, "artwork"), k.globalCompositeOperation = "destination-in", k.drawImage(a, 0, 0, 488, 680), t.drawImage(C, 0, 0, 488, 680);
      } finally {
        C.width = C.height = 0;
      }
    }
    if (n === "artwork") return;
    t.drawImage(s, 0, 0, 488, 680), d.typeSymbol && t.drawImage(r.get(d.typeSymbol), 31.2, 31.2, 27.3, 26), t.shadowColor = "transparent", X(t, e, "manaCost", () => cu(t, e, r));
    const h = u.length === 1 && u[0] !== "W", m = (C, k, x, M, R = !1) => {
      t.textAlign = "left", t.textBaseline = "middle", rt(
        t,
        C,
        k[0] + 1.25,
        k[1] + k[3] / 2 + M,
        k[2],
        x,
        !0,
        1,
        "CardRenderer MTG Matrix",
        0,
        R ? e.textInk : void 0
      );
    };
    t.fillStyle = h ? "#fff" : "#111", m(e.name, i.title, 30.248, 1.25), m(e.typeLine ?? "", i.type, 24.969, -1.5, !0);
    const c = l.land && u.length === 2 && !u.includes("W") ? "#fff" : "#111";
    ct(e) !== "full-art" && Tt(t, nh(t, e, i.rules), r, void 0, 0, c), e.power != null && e.toughness != null && (t.fillStyle = h ? "#fff" : "#111", t.textAlign = "center", t.textBaseline = "middle", t.font = '700 29.97px "CardRenderer MTG Matrix Small Caps"', t.save(), t.translate(i.stats[0] + i.stats[2] / 2 - 1.5, i.stats[1] + i.stats[3] / 2 - 0.25), t.scale(0.99, 1), ht(t, `${e.power}/${e.toughness}`, 0, 0, i.stats[2] / 0.99, e.textInk), t.restore());
    const g = r.get(Q(e) ?? "");
    X(t, e, "setSymbol", () => {
      if (g) {
        const [C, k, x, M] = i.symbol, R = Math.min(x / g.width, M / g.height), L = dh(e) ?? [
          C + (x - g.width * R) / 2,
          k + (M - g.height * R) / 2,
          g.width * R,
          g.height * R
        ];
        t.drawImage(g, L[0], L[1], L[2], L[3]);
      }
    }), t.fillStyle = l.land || h ? "#fff" : "#111", t.textAlign = "right", t.textBaseline = "alphabetic";
    const f = e.power != null && e.toughness != null ? 361 : 442, y = ct(e) === "full-art", b = y ? 16.6 : 17.845, p = y ? 627 : 626.5;
    t.font = `400 ${b}px "CardRenderer MTG Matrix"`;
    const w = e.artist ?? "";
    X(t, e, "artist", () => {
      t.fillText(w, f, p, f - 70);
      const C = d.brush ? r.get(d.brush) : void 0;
      C && t.drawImage(C, f - t.measureText(w).width - 40, p - 10, 36, 8);
    });
    const S = yo(e), v = bo(e, !1);
    if (S || v) {
      t.font = '11.804px "CardRenderer MTG MPlantin"';
      const C = [S, v].filter(Boolean).join(" ");
      if (!e.printingElements?.legal?.offset && !e.printingElements?.collector?.offset)
        t.fillText(C, f - 0.25, 641.25, f - 40);
      else {
        const k = t.measureText(C).width, x = Math.min(1, (f - 40) / Math.max(1, k));
        t.save(), t.translate(f - 0.25, 641.25), t.textAlign = "left";
        const M = (R, L) => {
          t.save(), t.scale(x, 1), t.fillText(R, L, 0), t.restore();
        };
        S && X(t, e, "legal", () => M(S, -k)), v && X(
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
const He = 96 / 72;
function ur(t, e, r, n, o, s) {
  const [a, i, d, l] = r;
  t.textAlign = "left", t.textBaseline = "middle", rt(
    t,
    e,
    a,
    i + l / 2,
    d,
    n * He,
    o !== "CardRenderer MTG Matrix",
    1,
    o,
    0,
    s
  );
}
function el(t, e, r, n, o, s) {
  const a = e.manaSymbols ?? [], i = s + 1;
  return a.forEach(
    (d, l) => et(t, d, n - a.length * i + l * i, o, s, r, !0)
  ), a.length * i;
}
function rl(t, e, r, n, o, s, a = "#17140f") {
  if (!ee(t)) return;
  const [i, d, l, u] = n, h = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((c) => ({ role: "rules", runs: [{ text: c }] })), m = $(t, h, { x: i, y: d, width: l, height: u }, o * He, s * He, {
    leading: 0.95,
    paragraphGap: 0.4,
    flavorGap: 0.5,
    flavorOrphans: !1
  });
  if (m.overflow) throw Error("Standard template text exceeds its minimum readable size.");
  Tt(t, m, r, void 0, 0, a);
}
function nl(t, e, r, n, o) {
  if (e.power == null || e.toughness == null) return;
  const [s, a, i, d] = r;
  t.font = `bold ${n * He}px "${o}", Georgia`, t.textAlign = "center", t.textBaseline = "middle", ht(t, `${e.power}/${e.toughness}`, s + i / 2, a + d / 2, i, e.textInk);
}
function ol(t, e, r, n) {
  const [o, s, a] = r;
  t.fillStyle = n, t.textAlign = "left", t.textBaseline = "top", t.font = `${10 * He}px "CardRenderer MTG Matrix", Georgia`, t.fillText(e.artist ?? "", o, s, a), e.legalText && (t.font = `${6.5 * He}px "CardRenderer MTG MPlantin", Georgia`, t.fillText(e.legalText, o, s + 14, a));
}
const Ds = [
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
function hh(t, e, r, n, o) {
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
    const f = r.get(m), y = r.get(c);
    if (!f || !y) throw Error("Missing flip statistics plate");
    const b = I();
    b.width = 140, b.height = 76;
    const p = b.getContext("2d");
    p.drawImage(f, 0, 0, 140, 76), p.globalCompositeOperation = "destination-in", p.drawImage(Wr(y), 0, 0, 140, 76), t.drawImage(b, g[0], g[1], g[2], g[3]), b.width = b.height = 0;
  }
  t.shadowColor = "transparent", t.fillStyle = "#17140f";
  const i = "CardRenderer MTG Matrix", d = (m, c, g, f, y) => {
    const b = el(t, m, r, c[0] + c[2], c[1] + 1, 15);
    ur(
      t,
      m.name,
      [c[0], c[1], Math.max(1, c[2] - b - 4), c[3]],
      17,
      i
    ), ur(
      t,
      m.typeLine ?? "",
      [f[0], f[1], f[2] - (m.power != null ? 60 : 0), f[3]],
      14,
      i,
      m.textInk
    ), rl(t, m, r, g, 14, 8), nl(t, m, y, 17, i);
  }, l = Ds[0], u = Ds[1];
  d(s, l.title, l.rules, l.type, l.stats), t.save(), t.translate(375, 523), t.rotate(Math.PI), d(a, u.title, u.rules, u.type, u.stats), t.restore();
  const h = r.get(Q(e) ?? "");
  if (h) {
    const m = Math.min(44 / h.width, 22 / h.height);
    t.drawImage(h, 353 - h.width * m, 482, h.width * m, h.height * m);
  }
  ol(t, e, [58, 479, 217, 26], "#17140f");
}
function mh(t, e, r, n, o) {
  const s = e.frameTemplate;
  if (!s) throw Error("Missing standard template");
  if (s === "future") return uh(t, e, r, n, o);
  const a = _o[s], i = (u) => {
    const h = r.get(u);
    if (!h) throw Error(`Standard template asset unavailable: ${u}`);
    return h;
  }, d = Uo(e);
  if (!d) throw Error("Missing template assets");
  const l = i(d.base);
  t.save();
  try {
    if (n !== "artwork" && (t.fillStyle = At(e) ?? "#090806", t.fillRect(0, 0, 488, 680)), o && t.drawImage(o, 0, 0, 488, 680), s === "battle" ? (t.translate(0, 680), t.rotate(-Math.PI / 2), t.scale(680 / 523, 488 / 375)) : t.scale(488 / 375, 680 / 523), d.kind === "flip") {
      hh(t, e, r, d, n);
      return;
    }
    if (d.kind !== "battle") throw Error("Unexpected standard template branch");
    if (n !== "artwork" && t.drawImage(i(d.texture), 0, 0, 523, 375), _t(t, e, r, a.art, n, a.size, -90), n === "artwork") return;
    t.drawImage(l, 0, 0, a.size[0], a.size[1]), t.drawImage(i(d.border), 0, 0, 523, 375), e.defense != null && t.drawImage(i(d.defense), 459, 322, 64, 52), t.shadowColor = "transparent", t.fillStyle = "#17140f";
    const u = "CardRenderer MTG Beleren";
    let h = a.title;
    const m = el(t, e, r, 484, 20, 15);
    h = [h[0], h[1], Math.max(1, h[2] - m - 5), h[3]], ur(t, e.name, h, a.titleSize, u), ur(t, e.typeLine ?? "", a.type, a.typeSize, u, e.textInk), t.fillStyle = "#17140f", rl(t, e, r, a.rules, a.rulesSize, a.minimumSize), s === "battle" && e.defense != null ? (t.fillStyle = "white", ur(t, String(e.defense), a.stats, 17, u)) : nl(t, e, a.stats, 18, u);
    const c = gu(t, e);
    c && (t.fillStyle = lr.color, t.font = c.font, t.textAlign = "right", t.textBaseline = "alphabetic", t.letterSpacing = "0px", t.fillText(c.text, c.x, c.baseline));
    const g = r.get(Q(e) ?? "");
    if (g) {
      const [f, y, b, p] = a.symbol, w = Math.min(b / g.width, p / g.height);
      t.drawImage(
        g,
        f + b - g.width * w,
        y + (p - g.height * w) / 2,
        g.width * w,
        g.height * w
      );
    }
    ol(t, e, a.footer, "white");
  } finally {
    t.restore();
  }
}
let Ns, zs;
function ch(t) {
  return t.frameTemplate ? t.frameTemplate === "battle" ? t.reverseStats ? zs ??= ot().load(lr.font).then(() => {
  }).catch((e) => {
    throw zs = void 0, e;
  }) : Promise.resolve() : Ns ??= Promise.all([
    ot().load('400 24px "CardRenderer MTG Matrix"'),
    ot().load('700 24px "CardRenderer MTG Matrix"'),
    ot().load('700 24px "CardRenderer MTG Matrix Small Caps"')
  ]).then(() => {
  }).catch((e) => {
    throw Ns = void 0, e;
  }) : Promise.resolve();
}
function gh(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = Mt(t);
  if (!(!e || !Wt(t, e.frame)))
    return { dx: 1.25, dy: -2.9375, scaleX: 1.005, scaleY: 0.99375 };
}
function fh(t, e, r) {
  if (!(t.setSymbol || !Wt(t, e) || !["c", "u", "r"].some(
    (n) => r === `${P}/img/setSymbols/official/plc-${n}.svg`
  )))
    return [411, 388.75, 34, 25.5];
}
const ph = {
  scaleX: 1.01,
  scaleY: 1.01,
  numberScale: 0.98,
  numberDx: -0.25
};
function yh(t) {
  const e = Zd(t);
  if (e) return e;
  const r = gh(t);
  if (r) return r;
  const n = t.setCode?.toLowerCase() ?? "";
  if (ii(t)) return { ...ph, ...qd[n] };
  const o = Yd[n], s = ["lea", "leb", "3ed", "arn", "atq", "drk"].includes(n);
  if (!(!o || t.frameTemplate !== void 0 || /^Level up\b/m.test(t.rulesText ?? "") || (t.layout ?? "normal") !== "normal" || (t.legendary ?? /\bLegendary\b/.test(t.typeLine ?? "")) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || Rt(t) !== (["3ed", "8ed"].includes(n) ? "white" : "black") || s && (!st(t) || t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle") || n === "8ed" && (st(t) || t.frameAssetFamily !== "eighth")))
    return vo(t) === "dark" ? { ...o, numberScale: 0.87, numberDx: -0.25, numberDy: -0.25 } : o;
}
function cn(t) {
  const e = t.symbolAdjustment?.mana, r = yh(t);
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
class gn {
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
      return r.throwIfAborted(), n.map((i, d) => ({ value: i.bitmap, release: o[d] }));
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
const sl = new gn(16 * 1024 * 1024), es = new gn(8 * 1024 * 1024), Df = () => {
  sl.clear(), es.clear();
};
function bh(t) {
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
const wh = new gn(16 * 1024 * 1024), Ys = /* @__PURE__ */ new WeakMap();
let Sh = 0;
async function vh(t, e, r) {
  const n = cn(t), o = li(t), s = Kd(t), a = !s && (!!o || !!n && (!!(n.numberDx || n.numberDy) || (n.numberScale ?? 1) !== 1));
  if (!s && !o && !a && !n?.glyphs && !Object.keys(e.manaGlyphScales ?? {}).length)
    return { images: e, dispose() {
    } };
  const i = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), l = [
    .../* @__PURE__ */ new Set([...t.manaSymbols ?? [], ...Object.keys(e.manaGlyphScales ?? {})])
  ].flatMap((h) => {
    const m = gr(n, h), c = !!m && (!!(m.dx || m.dy) || (m.scale ?? 1) !== 1);
    if (!(/^\d+$/.test(h) && a) && !c && (e.manaGlyphScales?.[h] ?? 1) === 1)
      return [];
    const g = di(t, h), f = e.get(g ?? je(h) ?? "");
    if (g && !f) throw Error("Modern cost numeral asset is missing.");
    if (!f) return [];
    let y = Ys.get(f);
    return y || Ys.set(f, y = ++Sh), [
      {
        symbol: h,
        source: f,
        identity: y,
        cost: g ? o : void 0,
        paperSample: e0(t, h)
      }
    ];
  });
  let u = [];
  try {
    return u = await wh.acquireMany(
      l.map(({ source: h, identity: m, cost: c, paperSample: g }) => ({
        key: `numeral-v2:${m}:${c ? JSON.stringify(c) : "source"}${g ? ":" + g : ""}`,
        bytes: h.width * h.height * 8,
        build: () => Ch(h, c, g)
      })),
      r
    ), l.forEach(({ symbol: h, source: m }, c) => {
      (/^\d+$/.test(h) ? i : d).set(h, {
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
        manaGlyphs: d,
        manaGlyphScales: e.manaGlyphScales
      }),
      dispose: () => u.forEach((h) => h.release())
    };
  } catch (h) {
    throw u.forEach((m) => m.release()), h;
  }
}
async function Ch(t, e, r) {
  const n = I();
  n.width = t.width, n.height = t.height;
  try {
    const o = n.getContext("2d", { willReadFrequently: !0 });
    if (!o) throw Error("Mana glyph preparation needs Canvas2D.");
    o.drawImage(t, 0, 0);
    const s = o.getImageData(0, 0, n.width, n.height), a = s.data, i = (Math.floor(t.height * 0.04) * t.width + Math.floor(t.width / 2)) * 4, d = r ? bh(a) : [a[i], a[i + 1], a[i + 2]];
    let l = i;
    for (let g = 0; g < a.length; g += 4)
      a[g + 3] === 255 && a[g] + a[g + 1] + a[g + 2] < a[l] + a[l + 1] + a[l + 2] && (l = g);
    const u = [a[l], a[l + 1], a[l + 2]], h = d.map((g, f) => g - u[f]), m = h.reduce((g, f) => g + f * f, 0);
    if (m < 100) throw Error("Mana asset has no separable glyph.");
    const c = new ImageData(new Uint8ClampedArray(a), t.width, t.height);
    for (let g = 0; g < a.length; g += 4) {
      if (e) for (let y = 0; y < 3; y++) c.data[g + y] = e.paper[y];
      if (a[g + 3] < 255) {
        a[g + 3] = 0;
        continue;
      }
      for (let y = 0; y < 3; y++) c.data[g + y] = e?.paper[y] ?? d[y];
      const f = Math.max(
        0,
        Math.min(1, h.reduce((y, b, p) => y + b * (d[p] - a[g + p]), 0) / m)
      );
      a[g + 3] = Math.round(a[g + 3] * f);
      for (let y = 0; y < 3; y++) a[g + y] = e?.ink[y] ?? u[y];
    }
    return n.width = t.width * 2, o.putImageData(c, 0, 0), o.putImageData(s, t.width, 0), await createImageBitmap(n);
  } finally {
    n.width = n.height = 0;
  }
}
function Zr([t, e, r]) {
  const n = Math.max(t, e, r), o = n - Math.min(t, e, r);
  return [((o === 0 ? 0 : n === t ? (e - r) / o : n === e ? (r - t) / o + 2 : (t - e) / o + 4) * 60 % 360 + 360) % 360, n === 0 ? 0 : o / n, n];
}
function kh(t, e, r) {
  const n = (t % 360 + 360) % 360 / 60, o = r * e, s = o * (1 - Math.abs(n % 2 - 1)), a = r - o, i = n < 1 ? [o, s, 0] : n < 2 ? [s, o, 0] : n < 3 ? [0, o, s] : n < 4 ? [0, s, o] : n < 5 ? [s, 0, o] : [o, 0, s];
  return [i[0] + a, i[1] + a, i[2] + a];
}
function Ht(t, e) {
  const [r, n, o] = Zr(t), s = e.valueGamma === void 0 ? o : o ** e.valueGamma, a = kh(
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
function qs(t) {
  const e = t.valueGamma;
  if (e !== void 0 && (!Number.isFinite(e) || e < 0.5 || e > 2))
    throw RangeError("Frame value exponent must be finite and between 0.5 and 2.");
}
const Th = {
  W: { hueDegrees: 0, saturationScale: 0.439924, brightnessScale: 1.21405 },
  U: { hueDegrees: 17.808301, saturationScale: 0.546189, brightnessScale: 1.239832 },
  B: { hueDegrees: 0, saturationScale: 0.261951, brightnessScale: 1.149978 },
  R: { hueDegrees: -7.214766, saturationScale: 0.471958, brightnessScale: 1.212936 },
  G: { hueDegrees: 0, saturationScale: 0.227323, brightnessScale: 1.290867 }
};
function Rn(t, e, r) {
  if (e.colorCalibration !== "set-hsb-v1" || !["eld", "woe"].includes(e.setCode?.toLowerCase() ?? ""))
    return;
  const n = Th[r.toUpperCase()];
  if (!n) return;
  const o = t.getContext("2d"), s = t.width, a = t.height, i = [
    Math.floor(31 * s / 488),
    Math.floor(487 * a / 680),
    Math.ceil(214 * s / 488),
    Math.ceil(142 * a / 680)
  ], d = o.getImageData(...i);
  for (let u = 0; u < d.data.length; u += 4) {
    if (!d.data[u + 3]) continue;
    const h = Ht(
      [d.data[u] / 255, d.data[u + 1] / 255, d.data[u + 2] / 255],
      n
    );
    for (let m = 0; m < 3; m++)
      d.data[u + m] = Math.round(h[m] * 255);
  }
  const l = I();
  l.width = i[2], l.height = i[3], l.getContext("2d").putImageData(d, 0, 0), o.save(), o.scale(s / 488, a / 680), o.beginPath(), o.moveTo(31.8, 488.3), o.lineTo(218, 488.3), o.bezierCurveTo(235, 488.3, 241, 490.5, 244, 496), o.lineTo(244, 627.4), o.lineTo(31.8, 627.4), o.closePath(), o.clip(), o.drawImage(
    l,
    i[0] * 488 / s,
    i[1] * 680 / a,
    i[2] * 488 / s,
    i[3] * 680 / a
  ), o.restore(), l.width = l.height = 0;
}
const Be = /* @__PURE__ */ new Map(), An = /* @__PURE__ */ new WeakMap();
let Mh = 0, En = 0;
const xh = (t) => (An.has(t) || An.set(t, ++Mh), An.get(t));
function Rh(t, e) {
  const r = t.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const n = (b) => {
    const p = e.get(b);
    if (!p) throw Error(`Adventure asset unavailable: ${b}`);
    return p;
  }, o = Ni(t).map(n), s = JSON.stringify([
    t.setCode,
    t.colorCalibration,
    t.colors,
    t.frameColors,
    t.manaSymbols,
    r.colors,
    r.frameColors,
    r.manaSymbols,
    o.map(xh)
  ]), a = Be.get(s);
  if (a)
    return Be.delete(s), Be.set(s, a), a;
  const i = n(Xr(t)), d = I();
  d.width = i.width, d.height = i.height;
  const l = d.getContext("2d"), u = d.width, h = d.height, m = () => {
    const b = I();
    return b.width = u, b.height = h, b;
  }, c = (b, p) => {
    const w = m(), S = w.getContext("2d"), v = W(b);
    if (S.drawImage(n(Xr(b)), 0, 0, u, h), p && v.length === 1 && Rn(w, t, v[0]), v.length === 2) {
      "WUBRG".indexOf(v[1]) - "WUBRG".indexOf(v[0]) > 2 && v.reverse(), S.drawImage(n(`${ve}/${v[0].toLowerCase()}.png`), 0, 0, u, h), p && Rn(w, t, v[0]);
      const C = m(), k = C.getContext("2d");
      k.drawImage(n(`${ve}/${v[1].toLowerCase()}.png`), 0, 0, u, h), p && Rn(C, t, v[1]), k.globalCompositeOperation = "destination-in";
      const x = k.createLinearGradient(
        u * (p ? 0.22 : 0.43),
        0,
        u * (p ? 0.36 : 0.57),
        0
      );
      x.addColorStop(0, "#0000"), x.addColorStop(1, "#000"), k.fillStyle = x, k.fillRect(0, 0, u, h), S.drawImage(C, 0, 0), C.width = C.height = 0;
    }
    return w;
  };
  if (l.drawImage(i, 0, 0), W(t).length === 2) {
    const b = c(t, !1), p = b.getContext("2d");
    Qt(t) || (p.globalCompositeOperation = "destination-in", p.drawImage(n(Ui), 0, 0, u, h)), l.drawImage(b, 0, 0), b.width = b.height = 0;
  }
  const g = c(r, !0), f = g.getContext("2d");
  if (f.globalCompositeOperation = "destination-in", f.drawImage(n(_i), 0, 0, u, h), l.save(), Qt(r) && (l.filter = "grayscale(1)"), l.drawImage(g, 0, 0), l.restore(), g.width = g.height = 0, Qt(t)) {
    l.save(), l.scale(u / 488, h / 680), l.beginPath();
    for (const [b, p] of [
      [34, 34],
      [388, 28]
    ])
      l.moveTo(38, b), l.lineTo(450, b), l.quadraticCurveTo(461, b + p / 2, 450, b + p), l.lineTo(38, b + p), l.quadraticCurveTo(29, b + p / 2, 38, b), l.closePath();
    l.clip();
    for (const [b, p] of [
      [34, 34],
      [388, 28]
    ])
      l.drawImage(n(ji), 22, 7, 196, 19, 29, b, 432, p);
    l.restore();
  }
  const y = u * h * 4;
  for (const [b, p] of Be) {
    if (En + y <= 16 * 1024 * 1024) break;
    En -= p.width * p.height * 4, Be.delete(b), p.width = p.height = 0;
  }
  return y <= 16 * 1024 * 1024 && (Be.set(s, d), En += y), d;
}
const Ah = ["ice", "chr", "all"], Eh = { leg: { "Adun Oakenshield": "{G}{R}{B}", "Angus Mackenzie": "{W}{U}{G}", "Arcades Sabboth": "{2}{W}{W}{G}{G}{U}{U}", "Axelrod Gunnarson": "{4}{B}{B}{R}{R}", "Ayesha Tanaka": "{U}{U}{W}{W}", "Barktooth Warbeard": "{4}{B}{R}{R}", "Bartel Runeaxe": "{3}{G}{R}{B}", "Boris Devilboon": "{3}{B}{R}", Chromium: "{2}{B}{B}{U}{U}{W}{W}", "Dakkon Blackblade": "{2}{B}{U}{U}{W}", "Gabriel Angelfire": "{3}{W}{W}{G}{G}", "Gosta Dirk": "{3}{W}{W}{U}{U}", "Gwendlyn Di Corci": "{R}{B}{B}{U}", Halfdane: "{1}{B}{U}{W}", "Hazezon Tamar": "{4}{W}{G}{R}", "Hunding Gjornersen": "{3}{U}{U}{W}", "Jacques le Vert": "{1}{W}{G}{R}", "Jasmine Boreal": "{3}{W}{G}", "Jedit Ojanen": "{4}{U}{W}{W}", "Jerrard of the Closed Fist": "{3}{G}{G}{R}", Johan: "{3}{W}{G}{R}", "Kasimir the Lone Wolf": "{4}{U}{W}", "Kei Takahashi": "{2}{W}{G}", "Lady Caleria": "{3}{W}{W}{G}{G}", "Lady Evangela": "{B}{U}{W}", "Lady Orca": "{5}{B}{R}", "Livonya Silone": "{2}{G}{G}{R}{R}", "Lord Magnus": "{3}{W}{W}{G}", "Marhault Elsdragon": "{3}{G}{R}{R}", Nebuchadnezzar: "{3}{B}{U}", "Nicol Bolas": "{2}{U}{U}{B}{B}{R}{R}", "Palladia-Mors": "{2}{W}{W}{G}{G}{R}{R}", "Pavel Maliki": "{4}{B}{R}", "Princess Lucrezia": "{3}{B}{U}{U}", Ragnar: "{U}{W}{G}", "Ramirez DePietro": "{3}{B}{B}{U}", "Ramses Overdark": "{2}{B}{B}{U}{U}", "Rasputin Dreamweaver": "{4}{W}{U}", "Riven Turnbull": "{5}{B}{U}", "Rohgahh of Kher Keep": "{2}{B}{B}{R}{R}", "Rubinia Soulsinger": "{2}{U}{W}{G}", "Sir Shandlar of Eberyn": "{4}{W}{G}", "Sivitri Scarzam": "{5}{B}{U}", "Sol'kanar the Swamp King": "{2}{R}{B}{U}", Stangg: "{4}{G}{R}", "Sunastian Falconer": "{3}{G}{R}", "Tetsuo Umezawa": "{R}{B}{U}", "The Lady of the Mountain": "{4}{G}{R}", "Tobias Andrion": "{3}{U}{W}", "Tor Wauki": "{2}{B}{B}{R}", "Torsten Von Ursus": "{3}{W}{G}{G}", "Tuknir Deathlock": "{G}{G}{R}{R}", "Ur-Drago": "{3}{B}{B}{U}{U}", "Vaevictis Asmadi": "{2}{B}{B}{R}{R}{G}{G}", "Xira Arien": "{G}{R}{B}" }, drk: { "Dark Heart of the Wood": "{B}{G}", "Marsh Goblins": "{B}{R}", "Scarwood Goblins": "{G}{R}" } }, Hs = {
  wubrgSets: Ah,
  overrides: Eh
};
function al(t, e) {
  const r = t.setCode?.toLowerCase() ?? "", o = Hs.overrides[r]?.[t.name ?? ""];
  if (o) {
    const s = [...o.matchAll(/\{([^}]+)\}/g)].map((a) => a[1]);
    return [...s].sort().join("|") === [...e].sort().join("|") ? s : [...e];
  }
  return !Hs.wubrgSets.includes(r) || e.some((s) => !/^(?:\d+|X|[WUBRG])$/.test(s)) ? [...e] : [
    ...e.filter((s) => !"WUBRG".includes(s)),
    ...e.filter((s) => "WUBRG".includes(s)).sort((s, a) => "WUBRG".indexOf(s) - "WUBRG".indexOf(a))
  ];
}
function il(t) {
  if (!/\bLand\b/.test(t)) return;
  const e = ["Plains", "Island", "Swamp", "Mountain", "Forest"].flatMap(
    (r, n) => new RegExp(`\\b${r}\\b`).test(t) ? ["WUBRG"[n]] : []
  );
  return e.length >= 1 && e.length <= 2 ? e : void 0;
}
function Lh(t, e, r, n, o) {
  if (!/\bLand\b/.test(t) || e.length) return;
  const s = il(t);
  if (s || /\b(Plains|Island|Swamp|Mountain|Forest)\b/.test(t) || ["lea", "leb", "2ed", "3ed"].includes(r?.toLowerCase() ?? ""))
    return s;
  if (!["2003", "2015", "future"].includes(n) || /\bArtifact\b/.test(t) || o == null) return;
  if (!Array.isArray(o) || !o.every((i) => typeof i == "string" && /^[WUBRGC]$/.test(i)))
    throw Error("Invalid produced mana.");
  const a = [..."WUBRG"].filter((i) => o.includes(i));
  return a.length >= 1 && a.length <= 2 ? a : void 0;
}
function Bh(t) {
  const e = t.split(`
`).flatMap((r) => {
    const n = /^\(?\{T\}: Add (\{[WUBRGC]\}(?:,? (?:or )?\{[WUBRGC]\})*)\.\)?$/.exec(r);
    return n ? [...n[1].matchAll(/\{([WUBRGC])\}/g)].map((o) => o[1]) : [];
  });
  return e.length ? [...new Set(e)] : void 0;
}
function Ih(t, e, r) {
  return /\b(Saga|Class|Planeswalker|Battle)\b/.test(e) || /^Level up\b/m.test(r) ? { ...t, frameAssetFamily: void 0 } : t;
}
function Me(t) {
  return t.rulesParagraphs ?? t.rulesText.split(`
`).filter(Boolean).map((e) => ({ role: "rules", runs: [{ text: e }] }));
}
function Oh(t, e, r = "oracle", n = {}) {
  const o = e[r];
  if (!o) throw Error(`Missing ${r} printing wording`);
  if (typeof o.typeLine != "string" || typeof o.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const s = n.rulesAlignment ?? r, a = s === "left" ? void 0 : e[s];
  if (s !== "left" && !a) throw Error(`Missing ${s} alignment wording`);
  const i = U({ ...t, typeLine: e.oracle.typeLine });
  return {
    ...t,
    ...o,
    canonicalTypeLine: t.canonicalTypeLine ?? e.oracle.typeLine,
    frameColors: t.frameColors ?? (i.land && !t.colors?.length ? il(t.canonicalTypeLine ?? e.oracle.typeLine) : void 0),
    manaSymbols: o.manaSymbols ?? (r === "original" ? al(t, t.manaSymbols ?? []) : e.oracle.manaSymbols ?? t.manaSymbols),
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: o.rulesParagraphs,
    rulesAlignment: a ? { mode: "auto", reference: Me(a) } : { mode: "left" },
    artifact: t.artifact ?? i.artifact,
    land: t.land ?? i.land,
    creature: t.creature ?? i.creature,
    legendary: t.legendary ?? i.legendary,
    wordingMode: r,
    symbolStyle: n.symbolStyle ?? (r === "oracle" ? "modern" : "original")
  };
}
const Xs = {
  permanent: { x: 261, y: 438, width: 189, height: 178 },
  spell: { x: 41.7, y: 499, width: 191, height: 122 }
};
function $h(t, e) {
  const r = e.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const n = (m) => {
    const c = Me({
      rulesText: m.rulesText ?? "",
      rulesParagraphs: m.rulesParagraphs
    });
    return m.rulesAlignment?.mode === "left" ? c.map((g) => g.role === "rules" ? { ...g, align: "left" } : g) : c;
  }, o = { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: !0 }, s = n(e), a = {
    ...Xs.permanent,
    exclusions: e.power != null && e.toughness != null ? [[368, 601, 94, 51]] : []
  }, i = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? s : s, d = e.rulesAlignment?.mode !== "left" && i.length === 1 && i[0].role === "rules" ? Ze(t, s, i, a, 22.5, 9, 1, o) : null, l = n(r), u = Xs.spell, h = $(t, l, u, 20.25, 20.25, o);
  return {
    permanent: d || $(t, s, a, 22.5, 9, o),
    spell: !h.overflow && h.lines.length <= 4 ? h : $(t, l, u, 22.5, 9, o)
  };
}
function Gh(t) {
  const e = (t.rarity ?? "common")[0].toUpperCase(), r = t.collectorNumber ?? "";
  if ((t.collectorFormat ?? (t.setCode?.toLowerCase() === "woe" ? "rarity-first" : "number-first")) === "number-first") return `${r} ${e}`.trim();
  const o = r.split("/")[0].replace(/^(\d+)/, (s) => s.padStart(4, "0"));
  return `${e} ${o}`.trim();
}
function ll(t, e, r) {
  if (e.power != null && e.toughness != null) {
    const o = r.get(Ho(e));
    if (!o) throw Error("Adventure power/toughness plate is unavailable.");
    const [s, a, i, d] = Xo.stats;
    t.drawImage(o, s * 488, a * 680, i * 488, d * 680), t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.font = '700 25px "CardRenderer MTG Beleren Small Caps", Georgia', ht(t, `${e.power}/${e.toughness}`, 420, 627, 77, e.textInk);
  }
  if (zt(e)) {
    const o = r.get(vr);
    if (!o) throw Error("Adventure authenticity stamp is unavailable.");
    t.drawImage(o, ...qe.saga);
  }
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(Gh(e), 32, 645), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.artist && (t.font = '11px "CardRenderer MTG Artist Credit", serif', t.fillText("a", 93, 658), t.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', t.fillText(e.artist, 108, 658, 210)), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 658, 182));
}
let Js = null;
function dl() {
  return Js ??= ot().load('700 25px "CardRenderer MTG Beleren Small Caps"').then((t) => {
    if (!t.length || t.some((e) => e.status !== "loaded"))
      throw Error("Inset card footer lettering needs card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw Js = null, t;
  });
}
function Ph(t, e, r) {
  if (t.drawImage(Rh(e, r), 0, 0, 488, 680), U(e).legendary) {
    const n = r.get(Di(e));
    if (!n) throw Error("Adventure crown is unavailable.");
    t.fillStyle = At(e) ?? "#000", t.fillRect(19.2, 18.8, 449.6, 12.1), t.drawImage(n, 13.4, 13, 461.4, 113.4);
  }
}
function Wh(t, e, r) {
  const n = e.manaSymbols ?? [], o = 23.4, s = 1.8, a = 452, i = n.length * o + Math.max(0, n.length - 1) * s;
  t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle", rt(
    t,
    e.name,
    41.7,
    51,
    (n.length ? a - i - 8 : 449) - 41.7,
    26,
    !0
  ), n.forEach(
    (f, y) => et(t, f, a - i + y * (o + s), 38.7, o, r, !0)
  );
  const d = Q(e), l = r.get(d ?? ""), u = de(e), h = l ? Math.min(58.56 / (l.width * u[2]), 27.9 / (l.height * u[3])) : 0, m = l ? l.width * u[2] * h : 0, c = l ? l.height * u[3] * h : 0, g = [450.3 - m, 402 - c / 2, m, c];
  rt(
    t,
    e.typeLine ?? "",
    41.7,
    401.5,
    (l ? g[0] - 7 : 449) - 41.7,
    22,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  ), l && (Ut(d) || e.setSymbol ? t.drawImage(l, ...g) : re(t, l, e.setCode, e.rarity, ...g, u));
}
function Fh(t, e, r) {
  const n = e.manaSymbols ?? [], o = 19.8, s = 1.2, a = 233, i = n.length * o + Math.max(0, n.length - 1) * s;
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "middle", rt(
    t,
    e.name,
    40,
    443,
    (n.length ? a - i - 4 : a) - 40,
    20.1,
    !0
  ), n.forEach(
    (d, l) => et(t, d, a - i + l * (o + s), 432, o, r, !0)
  ), rt(
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
function _h(t, e, r, n, o) {
  const s = e.faces?.[1];
  if (!s) throw Error("Adventure spell is missing.");
  t.save(), t.fillStyle = At(e) ?? "#000", t.fillRect(0, 0, 488, 680), n && t.drawImage(n, 0, 0, 488, 680), o !== "artwork" && Ph(t, e, r);
  const [a, i, d, l] = Xo.art;
  if (_t(t, e, r, [a * 488, i * 680, d * 488, l * 680], o), o !== "artwork") {
    Wh(t, e, r), Fh(t, s, r);
    const u = $h(t, e);
    Tt(t, u.permanent, r), Tt(t, u.spell, r), ll(t, e, r);
  }
  t.restore();
}
const Ie = /* @__PURE__ */ new Map(), Ln = /* @__PURE__ */ new WeakMap();
let Uh = 0, Bn = 0;
const jh = (t) => (Ln.has(t) || Ln.set(t, ++Uh), Ln.get(t));
function Dh(t, e) {
  const r = Ve(t), n = (w) => {
    const S = e.get(w);
    if (!S) throw Error(`Prepared asset unavailable: ${w}`);
    return S;
  }, o = zi(t).map(n), s = Pe(t), a = Pe(r), i = U(t).legendary, d = JSON.stringify([
    s,
    a,
    i,
    Qt(r),
    o.map(jh)
  ]), l = Ie.get(d);
  if (l)
    return Ie.delete(d), Ie.set(d, l), l;
  const u = n(We(t)), h = u.width, m = u.height, c = () => {
    const w = I();
    return w.width = h, w.height = m, w;
  }, g = c(), f = g.getContext("2d");
  f.drawImage(u, 0, 0);
  const y = (w, S, v = !1) => {
    const C = c(), k = C.getContext("2d");
    v && (k.filter = "grayscale(1)"), k.drawImage(w, 0, 0, h, m), k.filter = "none", k.globalCompositeOperation = "destination-in", k.drawImage(n(Gr(S)), 0, 0, h, m), f.drawImage(C, 0, 0), C.width = C.height = 0;
  }, b = (w) => n(`${hn}/${w.toLowerCase()}.png`);
  if (s.length === 2) {
    const w = c(), S = w.getContext("2d");
    S.drawImage(b(s[0]), 0, 0, h, m);
    const v = c(), C = v.getContext("2d");
    C.drawImage(b(s[1]), 0, 0, h, m), C.globalCompositeOperation = "destination-in";
    const k = C.createLinearGradient(h * 0.43, 0, h * 0.57, 0);
    k.addColorStop(0, "#0000"), k.addColorStop(1, "#000"), C.fillStyle = k, C.fillRect(0, 0, h, m), S.drawImage(v, 0, 0), y(w, "pinline"), y(b(s[0]), "rules"), y(b(s[1]), "rulesRight"), w.width = w.height = v.width = v.height = 0;
  }
  if (a.length === 2 ? (y(b(a[0]), "prepare"), y(b(a[1]), "prepareRight"), y(n(We(r)), "prepareTypeTitle", Qt(r))) : y(n(We(r)), "prepare"), i) {
    f.save(), f.scale(h / 488, m / 680), f.fillStyle = At(t) ?? "#000", f.fillRect(19.2, 18.8, 449.6, 12.1);
    const w = s.length === 2 ? s : [Jo(t)];
    if (f.drawImage(n(Qn(w[0])), 13.4, 13, 461.4, 113.4), w.length === 2) {
      const S = c(), v = S.getContext("2d");
      v.scale(h / 488, m / 680), v.drawImage(n(Qn(w[1])), 13.4, 13, 461.4, 113.4), v.globalCompositeOperation = "destination-in";
      const C = v.createLinearGradient(210, 0, 278, 0);
      C.addColorStop(0, "#0000"), C.addColorStop(1, "#000"), v.fillStyle = C, v.fillRect(0, 0, 488, 680), f.drawImage(S, 0, 0, 488, 680), S.width = S.height = 0;
    }
    f.restore();
  }
  const p = h * m * 4;
  for (const [w, S] of Ie) {
    if (Bn + p <= 16 * 1024 * 1024) break;
    Bn -= S.width * S.height * 4, Ie.delete(w), S.width = S.height = 0;
  }
  return p <= 16 * 1024 * 1024 && (Ie.set(d, g), Bn += p), g;
}
function Nh(t, e) {
  const r = Ve(e), n = (o, s, a, i) => {
    const d = Me({
      rulesText: o.rulesText ?? "",
      rulesParagraphs: o.rulesParagraphs
    });
    return $(
      t,
      o.rulesAlignment?.mode === "left" ? d.map((l) => l.role === "rules" ? { ...l, align: "left" } : l) : d,
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
      Ko.rules,
      21.75,
      zt(e) ? [[213, 620, 63, 26]] : []
    ),
    spell: n(
      r,
      Au.rules,
      21.75,
      e.power != null && e.toughness != null ? [[370, 603, 93, 49]] : []
    )
  };
}
function zh(t, e, r) {
  t.drawImage(Dh(e, r), 0, 0, 488, 680);
}
function Yh(t, e, r) {
  const n = (m, c) => {
    const g = m.manaSymbols ?? [], f = c ? 19.8 : 23.4, y = c ? 1.2 : 1.8, b = c ? 1042 / 2010 * 488 : 41.7, p = 452, w = g.length * f + Math.max(0, g.length - 1) * y;
    t.fillStyle = c ? "#fff" : "#17140f", t.textAlign = "left", t.textBaseline = "middle", rt(
      t,
      m.name,
      b,
      c ? 444 : 52,
      (g.length ? p - w - (c ? 4 : 8) : p) - b,
      c ? 20 : 26,
      !0
    ), g.forEach(
      (S, v) => et(
        t,
        S,
        p - w + v * (f + y),
        c ? 434.5 : 38.7,
        f,
        r,
        !0
      )
    );
  };
  n(e, !1);
  const o = Q(e), s = r.get(o ?? ""), a = de(e), i = s ? Math.min(58.56 / (s.width * a[2]), 27.9 / (s.height * a[3])) : 0, d = s ? s.width * a[2] * i : 0, l = s ? s.height * a[3] * i : 0, u = [450.3 - d, 402 - l / 2, d, l];
  rt(
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
  ), s && (Ut(o) || e.setSymbol ? t.drawImage(s, ...u) : re(t, s, e.setCode, e.rarity, ...u, a));
  const h = Ve(e);
  n(h, !0), rt(
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
function qh(t, e, r, n, o) {
  Ve(e), t.save(), t.fillStyle = At(e) ?? "#000", t.fillRect(0, 0, 488, 680), n && t.drawImage(n, 0, 0, 488, 680), o !== "artwork" && zh(t, e, r);
  const [s, a, i, d] = Ko.art;
  if (_t(t, e, r, [s * 488, a * 680, i * 488, d * 680], o), o !== "artwork") {
    Yh(t, e, r);
    const l = Nh(t, e);
    Tt(t, l.permanent, r), Tt(t, l.spell, r), ll(
      t,
      { ...e, collectorFormat: e.collectorFormat ?? "rarity-first" },
      r
    );
  }
  t.restore();
}
function Hh(t, e, r) {
  t.fillStyle = At(e) ?? "#000", t.fillRect(0, 0, 488, 680);
  const n = Gt(e), o = n.map((s) => Su(s.face, r));
  if (n.forEach((s, a) => {
    t.save(), t.beginPath(), t.rect(0, a ? 0 : 324, 488, a ? 324 : 356), t.clip(), t.drawImage(o[a], 0, 0, 488, 680), t.restore();
  }), n[0]?.face.layout?.endsWith("-fuse")) {
    const s = I();
    s.width = 488, s.height = 680;
    const a = s.getContext("2d");
    a.drawImage(o[1], 0, 0, 488, 680), a.globalCompositeOperation = "destination-in";
    const i = a.createLinearGradient(0, 344, 0, 304);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), a.fillStyle = i, a.fillRect(0, 0, 488, 680), t.save(), t.beginPath(), t.rect(434, 0, 54, 680), t.clip(), t.drawImage(o[0], 0, 0, 488, 680), t.drawImage(s, 0, 0), t.restore(), s.width = s.height = 0;
  }
}
function Xh(t, e, r) {
  const a = e.manaSymbols ?? [], i = a.length * 23.4 + Math.max(0, a.length - 1) * 1.7;
  t.fillStyle = "#17140f", t.textBaseline = "middle", t.textAlign = "left", rt(
    t,
    e.name,
    70,
    53,
    Math.max(1, (a.length ? 331 - i - 7 : 331) - 70),
    26,
    !0
  ), a.forEach((g, f) => et(t, g, 331 - i + f * (23.4 + 1.7), 39.5, 23.4, r, !0));
  const d = Q(e), l = r.get(d ?? ""), u = de(e), h = l ? Math.min(26 / (l.width * u[2]), 15.5 / (l.height * u[3])) : 0, m = l ? l.width * u[2] * h : 0, c = l ? l.height * u[3] * h : 0;
  if (rt(
    t,
    e.typeLine ?? "",
    70,
    277,
    (l ? 331 - m - 6 : 331) - 70,
    18.5,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  ), l) {
    const g = [331 - m, 277 - c / 2, m, c];
    Ut(d) || e.setSymbol ? t.drawImage(l, ...g) : re(t, l, e.setCode, e.rarity, ...g, u);
  }
}
function Jh(t, e, r) {
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic";
  const n = [
    ...new Set((e.faces ?? []).map((o) => o.artist ?? e.artist ?? "").filter(Boolean))
  ].join(" & ");
  if (t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""} ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    646
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 660), n && (t.font = '11px "CardRenderer MTG Artist Credit", serif', t.fillText("a", 95, 660), t.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', t.fillText(n, 110, 660, 193)), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 455, 646, 170)), zt(e)) {
    const o = r.get(ki);
    if (!o) throw Error("Modern split authenticity stamp unavailable.");
    t.drawImage(o, ...qe.split);
  }
}
const In = V.MSE_SPLIT_BRIDGE_ROOT;
function ul(t, e) {
  const r = W(t);
  r.length === 2 && "WUBRG".indexOf(r[1]) - "WUBRG".indexOf(r[0]) > 2 && r.reverse();
  const n = (e ? r[0] : r.at(-1))?.toLowerCase() ?? "c";
  return {
    color: `${In}/${n}bridge.png`,
    gold: r.length > 1 ? `${In}/mbridge.png` : null,
    mask: r.length > 1 ? `${In}/bridgemask.png` : null
  };
}
function Kh(t) {
  return (t.faces ?? []).flatMap((e, r) => Object.values(ul(e, r)));
}
function Vh(t, e, r) {
  const n = (u) => {
    const h = r.get(u);
    if (!h) throw Error(`Fuse bridge asset unavailable: ${u}`);
    return h;
  }, o = e.faces.map((u, h) => {
    const m = ul(u, h), c = n(m.color), g = I();
    g.width = c.width, g.height = c.height;
    const f = g.getContext("2d");
    return f.drawImage(c, 0, 0), m.gold && m.mask && (f.globalCompositeOperation = "destination-in", f.drawImage(qi(n(m.mask)), 0, 0, g.width, g.height), f.globalCompositeOperation = "destination-over", f.drawImage(n(m.gold), 0, 0, g.width, g.height)), g;
  }), [s, a] = o, i = a.getContext("2d");
  i.globalCompositeOperation = "destination-in";
  const d = i.createLinearGradient(0, 0, a.width, 0);
  d.addColorStop(0, "#0000"), d.addColorStop(1, "#000"), i.fillStyle = d, i.fillRect(0, 0, a.width, a.height), t.save(), t.translate(0, 680), t.rotate(-Math.PI / 2);
  const l = [
    253 * 680 / 523,
    306 * 488 / 375,
    16 * 680 / 523,
    30 * 488 / 375
  ];
  t.drawImage(s, ...l), t.drawImage(a, ...l), t.restore();
  for (const u of o) u.width = u.height = 0;
}
function Zh(t, e, r, n) {
  const [o, s, a, i] = Ke(r, n).rules, d = Me({
    rulesText: e.rulesText ?? "",
    rulesParagraphs: e.rulesParagraphs
  }), l = { x: o, y: s, width: a, height: i }, u = {
    leading: 1.02,
    paragraphGap: 0.4,
    flavorGap: 0.65,
    centerOffset: r === "old" ? 0 : 2
  }, h = r === "old" ? 24.5 : r === "m15" ? n ? 20.25 : 24.25 : 21.5;
  if ((r !== "m15" || n) && e.rulesAlignment?.mode !== "left" && d.length === 1) {
    const m = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? d : d, c = Ze(t, d, m, l, h, 13, 2, u);
    if (c) return c;
  }
  return $(t, d, l, h, 13, u);
}
function Qh(t, e, r) {
  const n = Nt(e);
  if (!n) throw Error("No native split plate for this printing.");
  if (n === "m15") return Hh(t, e, r);
  const o = n !== "old" && ze(e), s = Ke(n, o);
  t.fillStyle = Pt(e.setCode, e.borderColor).border, t.fillRect(0, 0, 488, 680), Gt(e).forEach((a, i) => {
    const d = Gu(a.face, n, o, i, r);
    t.save(), t.translate(a.x, a.y), t.rotate(-Math.PI / 2);
    const [l, u, h, m] = s.frame;
    t.drawImage(d, l - (o && i ? 8 * 680 / 523 : 0), u, h, m), t.restore();
  }), o && Vh(t, e, r);
}
function tm(t, e, r, n, o) {
  if (r === "m15") return Xh(t, e, o);
  const s = Ke(r, n), a = r === "old", [i, d, l, u] = s.title, h = e.manaSymbols ?? [], m = 23.4, c = 1.7, g = 316, f = h.length * m + Math.max(0, h.length - 1) * c;
  if (t.fillStyle = a ? "#f2eee3" : "#17140f", t.textBaseline = "middle", t.textAlign = "left", a) {
    const k = t.getTransform();
    t.shadowColor = "#000b", t.shadowOffsetX = k.a + k.c, t.shadowOffsetY = k.b + k.d;
  }
  rt(
    t,
    e.name,
    i,
    d + u / 2 - (a ? 2 : 0),
    Math.max(1, h.length ? g - f - i - 7 : l),
    a ? 29 : 26.5,
    !a,
    1,
    a ? "CardRenderer MTG Goudy" : "CardRenderer MTG Matrix"
  ), h.forEach(
    (k, x) => et(t, k, g - f + x * (m + c), a ? 30.5 : 40, m, o, !a)
  );
  const y = Q(e), b = o.get(y ?? ""), p = de(e), [w, S, v, C] = s.type;
  if (rt(
    t,
    e.typeLine ?? "",
    w,
    S + C / 2,
    v - (b ? 33 : 0),
    a ? 22 : 21.5,
    !1,
    1,
    a ? "CardRenderer MTG MPlantin" : "CardRenderer MTG Matrix",
    0,
    e.textInk
  ), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, b) {
    const k = Math.min(
      32 / (b.width * p[2]),
      (a ? 26 : 22) / (b.height * p[3])
    ), x = b.width * p[2] * k, M = b.height * p[3] * k, R = [(a ? 306 : 316) - x, S + C / 2 - (a ? 1.5 : 0) - M / 2, x, M];
    Ut(y) || e.setSymbol ? t.drawImage(b, ...R) : re(t, b, e.setCode, e.rarity, ...R, p);
  }
}
function em(t, e, r, n, o, s) {
  const a = Ke(n, o), i = n === "old";
  t.fillStyle = i ? "#eeeae1" : "#17140f", t.textAlign = i ? "center" : "left", t.textBaseline = "middle", t.font = i ? '19px "CardRenderer MTG MPlantin", Georgia' : '700 14px "CardRenderer MTG Matrix", Georgia';
  const d = s.get(`${P}/img/manaSymbols/brush.svg`);
  if (!i && d && t.drawImage(d, 36, a.artistY - 4, 20, 8), i) {
    const l = t.getTransform();
    t.shadowColor = "#000b", t.shadowOffsetX = l.a + l.c, t.shadowOffsetY = l.b + l.d;
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
function rm(t, e, r, n, o) {
  const s = Nt(e);
  if (!s) throw Error("No native split plate for this printing.");
  const a = s !== "old" && ze(e), i = Ke(s, a);
  t.save(), o !== "artwork" && Qh(t, e, r), n && t.drawImage(n, 0, 0, 488, 680);
  for (const d of Gt(e))
    t.save(), t.translate(d.x, d.y), t.rotate(-Math.PI / 2), _t(t, d.face, r, i.art, o), o !== "artwork" && (tm(t, d.face, s, a, r), Pu(t, d.face, r, i.rules[1] + i.rules[3] / 2), Tt(t, Zh(t, d.face, s, a), r), s !== "m15" && em(t, d.face, e, s, a, r)), t.restore();
  if (s === "m15" && o !== "artwork" && Jh(t, e, r), a && o !== "artwork") {
    t.translate(0, 680), t.rotate(-Math.PI / 2);
    const d = Oi(e).map(
      (l) => s === "m15" ? { ...l, align: "center" } : l
    );
    Tt(
      t,
      $(
        t,
        d,
        s === "m15" ? { x: 70, y: 441, width: 577, height: 20 } : { x: 38, y: 407, width: 608, height: 26 },
        s === "m15" ? 18 : 21,
        12
      ),
      r
    );
  }
  t.restore();
}
let Ks;
function nm(t) {
  return Nt(t) === "m15" ? dl() : Nt(t) !== "eighth" ? Promise.resolve() : Ks ??= Promise.all([
    ot().load('700 24px "CardRenderer MTG Matrix"'),
    ot().load('24px "CardRenderer MTG Matrix"')
  ]).then((e) => {
    if (e.some((r) => !r.length || r.some((n) => n.status !== "loaded")))
      throw Error("Split Matrix fonts are unavailable. Load card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw Ks = void 0, e;
  });
}
const oe = {
  reminder: { x: 42.3, y: 78, width: 197 },
  chapters: { x: 65.1, width: 171 },
  top: 80,
  reminderBottom: 201,
  bottom: 569,
  reverseStatsBottom: 535
}, om = {
  maximumSize: 20.7,
  padding: 24,
  equalCells: 0,
  lastLift: 0,
  bottomSpace: 0.15
};
function sm(t, e, r = om) {
  const n = kr(e), o = n.filter((f) => !f.badges.length), s = n.filter((f) => f.badges.length), a = (f, y = !1) => [
    {
      role: "rules",
      runs: y ? [{ text: f, italic: !0 }] : f.split(/(\([^)]*\))/g).filter(Boolean).map((b) => ({ text: b, italic: b.startsWith("(") }))
    }
  ], i = { leading: 0.98, paragraphGap: 0.3, flavorGap: 0 }, d = o.length ? oe.reminderBottom : oe.top, l = e.reverseStats && e.layout === "transform" ? oe.reverseStatsBottom : oe.bottom, u = $(
    t,
    o.flatMap((f) => a(f.text, f.reminder)),
    { ...oe.reminder, height: d - oe.top },
    20.4,
    12,
    { ...i, centerOffset: -3 }
  );
  let h = r.maximumSize, m = [], c = [];
  for (; ; ) {
    const f = s.map(
      (S) => Math.max(
        $(
          t,
          a(S.text),
          { ...oe.chapters, y: 0, height: 2e3 },
          h,
          h,
          i
        ).height + r.padding,
        Dt.minimumRowHeight + Math.max(0, S.badges.length - 1) * Dt.gap
      )
    ), y = l - d;
    if (f.reduce((S, v) => S + v, 0) > y && h > 12) {
      h = Math.max(12, h - 0.25);
      continue;
    }
    if (f.reduce((S, v) => S + v, 0) > y)
      throw Error("Saga chapter text or badges do not fit the available column.");
    const b = Math.max(0, y - f.reduce((S, v) => S + v, 0)) * (1 - (s.length === 2 && s[0].badges.length > 1 ? r.bottomSpace : 0)) / Math.max(1, s.length);
    c = f.map((S) => S + b);
    const p = y / Math.max(1, s.length);
    c = c.map((S) => S * (1 - r.equalCells) + p * r.equalCells);
    let w = d;
    m = s.map((S, v) => {
      const C = c[v], k = $(
        t,
        a(S.text),
        { ...oe.chapters, y: w + 7, height: C - 14 },
        h,
        h,
        { ...i, centerOffset: v === s.length - 1 ? -r.lastLift : 0 }
      );
      return w += C, k;
    });
    break;
  }
  let g = d;
  return {
    reminder: u,
    size: h,
    rows: s.map((f, y) => {
      const b = { ...f, top: g, height: c[y], layout: m[y] };
      return g += b.height, b;
    })
  };
}
function am(t, e, r, n, o) {
  const s = (v) => {
    const C = r.get(v);
    if (!C) throw Error(`Saga asset unavailable: ${v}`);
    return C;
  };
  t.save(), t.fillStyle = At(e) ?? "#090806", t.fillRect(0, 0, T, E), n && t.drawImage(n, 0, 0, T, E), o !== "artwork" && (t.drawImage(s(Yo(e)), 0, 0, T, E), Mu(t, e, r));
  const a = Fi.art;
  if (_t(t, e, r, [a[0] * T, a[1] * E, a[2] * T, a[3] * E], o), o === "artwork") {
    t.restore();
    return;
  }
  const i = Zn(e);
  i && t.drawImage(s(i), 33.5, 35.6, 29, 32), t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
  const d = e.manaSymbols ?? [], l = 23.4, u = 1.8, h = 452, m = d.length * l + Math.max(0, d.length - 1) * u, c = e.layout === "transform" ? 78 : 41.7;
  rt(
    t,
    e.name,
    c,
    51,
    (d.length ? h - m - 8 : 449) - c,
    26,
    !0
  ), d.forEach(
    (v, C) => et(t, v, h - m + C * (l + u), 38.7, l, r, !0)
  );
  const g = Q(e), f = r.get(g ?? ""), y = de(e), b = f ? Math.min(58.56 / (f.width * y[2]), 25.9 / (f.height * y[3])) : 0, p = f ? f.width * y[2] * b : 0, w = f ? f.height * y[3] * b : 0, S = [450.3 - p, 594.25 - w / 2, p, w];
  if (rt(
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
  ), f && (Ut(g) || e.setSymbol ? t.drawImage(f, ...S) : re(t, f, e.setCode, e.rarity, ...S, y)), e.reverseStats && e.layout === "transform" && (t.fillStyle = "#65605a", t.font = 'italic 20px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.fillText(`${e.reverseStats.power}/${e.reverseStats.toughness}`, 41, 553)), ee(t)) {
    const v = sm(t, e);
    Tt(t, v.reminder, r);
    for (const C of v.rows)
      t.drawImage(s(Wi), 48.8, C.top - 1, 192.6, 2), Tt(t, C.layout, r), C.badges.forEach((k, x) => {
        const M = C.top + C.height / 2 + (x - (C.badges.length - 1) / 2) * Dt.gap;
        t.drawImage(
          s(Pi),
          Dt.x,
          M - Dt.height / 2,
          Dt.width,
          Dt.height
        ), t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.font = `550 ${Dt.fontSize}px "${Dt.fontFamily}", Georgia`, t.fillText(
          k,
          Dt.centerX,
          M + Dt.numeralOffsetY
        );
      });
  }
  zt(e) && t.drawImage(s(vr), ...qe.saga), t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""}  ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.font = '11px "CardRenderer MTG Artist Credit", serif', e.artist && t.fillText("a", 93, 658), t.font = '11px "CardRenderer MTG Beleren", serif', t.fillText(e.artist ?? "", 108, 658, 210), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 646, 182)), t.restore();
}
let Vs = null;
function im() {
  return Vs ??= ot().load('550 22px "CardRenderer MTG Chapter"').then((t) => {
    if (!t.length || t.some((e) => e.status !== "loaded"))
      throw Error("Saga chapter numerals need card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw Vs = null, t;
  });
}
function lm(t, e, r) {
  const [n, o, s, a] = (r ? zo : No).rules, i = Me({
    rulesText: e.rulesText ?? "",
    rulesParagraphs: e.rulesParagraphs
  }), d = { x: n, y: o, width: s, height: a }, l = {
    leading: 0.98,
    paragraphGap: 0.32,
    flavorGap: 0.65,
    centerOffset: r ? 0 : 2.5
  };
  let u = r ? 22 : e.setCode?.toLowerCase() === "hou" ? 24.5 : 22.5, h = $(t, i, d, u, 14, l);
  if (!r && i.length === 1 && h.lines.length > 1 && h.lines.at(-1).width < s * 0.18)
    for (let m = u - 0.25; m >= u * 0.9; m -= 0.25) {
      const c = $(t, i, d, m, m, l);
      if (!c.overflow && c.lines.length < h.lines.length) {
        u = m, h = c;
        break;
      }
    }
  if (!r && e.rulesAlignment?.mode !== "left") {
    const m = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? i : i, c = Ze(
      t,
      i,
      m,
      d,
      u,
      14,
      1,
      l
    );
    if (c) return c;
  }
  return h;
}
function dm(t, e, r, n, o) {
  const s = Gt(e), a = (i) => {
    const d = r.get(i);
    if (!d) throw Error(`Aftermath asset unavailable: ${i}`);
    return d;
  };
  t.save(), t.fillStyle = At(e) ?? "#090806", t.fillRect(0, 0, 488, 680), n && t.drawImage(n, 0, 0, 488, 680), o !== "artwork" && s.forEach((i, d) => {
    t.save(), t.beginPath(), t.rect(0, d ? ye : 0, 488, d ? 680 - ye : ye), t.clip(), t.drawImage(a(Ei(i.face)), 0, 0, 488, 680), t.restore();
  }), s.forEach((i, d) => {
    t.save(), d && (t.translate(488, ye), t.rotate(Math.PI / 2));
    const l = i.face, u = d ? zo : No;
    if (_t(t, l, r, u.art, o), o !== "artwork") {
      t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
      const h = l.manaSymbols ?? [], m = 23.4, c = 1.6, g = d ? 246 : 451, f = h.length * m + Math.max(0, h.length - 1) * c, [y, b] = u.title;
      rt(t, l.name, y, b + 15.5, g - f - y - 7, 26, !0), h.forEach(
        (w, S) => et(t, w, g - f + S * (m + c), b + 3, m, r, !0)
      );
      const p = d ? void 0 : r.get(Q(l) ?? "");
      if (rt(
        t,
        l.typeLine ?? "",
        u.type[0],
        u.type[1] + 16.5,
        u.type[2] - (p ? 45 : 0),
        23,
        !0,
        1,
        "CardRenderer MTG Beleren",
        0,
        l.textInk
      ), p) {
        const w = de(l), S = Math.min(50 / (p.width * w[2]), 27 / (p.height * w[3])), v = p.width * w[2] * S, C = p.height * w[3] * S, k = [451 - v, 252.3 - C / 2, v, C];
        Ut(Q(l)) || l.setSymbol ? t.drawImage(p, ...k) : re(t, p, l.setCode, l.rarity, ...k, w);
      }
      Tt(t, lm(t, l, !!d), r);
    }
    t.restore();
  }), o !== "artwork" && (zt(e) && t.drawImage(a(Ai), ...qe.aftermath), t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""}  ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.font = '11px "CardRenderer MTG Artist Credit", serif', e.artist && t.fillText("a", 93, 658), t.font = '11px "CardRenderer MTG Beleren", serif', t.fillText(e.artist ?? "", 108, 658, 220), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 646, 177))), t.restore();
}
function hl(t, e) {
  const r = e.paper.map((i) => i * 255), n = e.sourceInk.map((i) => i * 255), o = e.inkTarget.map((i) => i * 255), s = r.map((i, d) => i - n[d]), a = s.reduce((i, d) => i + d * d, 0);
  if (!Number.isFinite(a) || a < 100)
    throw Error("Mana ink needs a contrasting paper palette.");
  for (let i = 0; i < t.length; i += 4) {
    if (t[i + 3] !== 255) continue;
    const d = Math.max(
      0,
      Math.min(1, s.reduce((l, u, h) => l + u * (r[h] - t[i + h]), 0) / a)
    );
    for (let l = 0; l < 3; l++)
      t[i + l] = Math.round(t[i + l] + (o[l] - n[l]) * d);
  }
}
function um(t, e, r, n) {
  const o = n.inkExpansion ?? 0;
  if (!Number.isFinite(o) || o < 0 || o > 1)
    throw Error("Historical mana ink expansion is outside its supported range.");
  if (!o) return;
  if (!Number.isInteger(e) || !Number.isInteger(r) || e <= 0 || r <= 0 || t.length !== e * r * 4)
    throw Error("Historical mana ink pixels do not match their dimensions.");
  const s = Se(n.discColor), a = Se(n.inkColor), i = s.map((c, g) => c - a[g]), d = i.reduce((c, g) => c + g * g, 0);
  if (d < 0.01) throw Error("Historical mana palette has no ink contrast");
  const l = new Float32Array(e * r);
  for (let c = 0; c < l.length; c++)
    t[c * 4 + 3] < 255 || (l[c] = Math.max(
      0,
      Math.min(1, i.reduce((g, f, y) => g + f * (s[y] - t[c * 4 + y] / 255), 0) / d)
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
      let y = l[f];
      for (const b of m) {
        const p = g + b.x, w = c + b.y;
        p >= 0 && p < e && w >= 0 && w < r && (y = Math.max(y, l[w * e + p] * b.weight));
      }
      if (!(y <= l[f]))
        for (let b = 0; b < 3; b++)
          t[f * 4 + b] = Math.round(255 * (s[b] * (1 - y) + a[b] * y));
    }
}
function hm(t, e, r) {
  const n = Se(e.discColor), o = Se(e.inkColor), s = n.map((i, d) => i - o[d]), a = s.reduce((i, d) => i + d * d, 0);
  if (a < 0.01) throw Error("Historical mana palette has no ink contrast");
  for (let i = 0; i < t.length; i += 4) {
    if (!t[i + 3]) continue;
    const d = Math.max(
      0,
      Math.min(1, s.reduce((l, u, h) => l + (t[i + h] / 255 - o[h]) * u, 0) / a)
    );
    for (let l = 0; l < 3; l++)
      t[i + l] = Math.round(255 * (o[l] * (1 - d) + r[l] * d));
  }
}
async function mm(t, e, r, n) {
  const o = I();
  o.width = t.width, o.height = t.height;
  try {
    const s = o.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("Historical mana preparation needs Canvas2D.");
    s.drawImage(t, 0, 0);
    const a = s.getImageData(0, 0, o.width, o.height);
    return e.inkExpansion && um(a.data, o.width, o.height, e), hm(a.data, e, r), n && hl(a.data, n), s.putImageData(a, 0, 0), await createImageBitmap(o);
  } finally {
    o.width = o.height = 0;
  }
}
function cm(t, e, r) {
  const { width: n, height: o, data: s } = t;
  if (e.width !== n || e.height !== o || e.data.length !== s.length || !Number.isInteger(r) || r < 0 || r > Math.max(n, o))
    throw RangeError("Invalid frame material selection");
  const a = new Uint8Array(n * o), i = new Uint8Array(n * o), d = new Int32Array(Math.max(n, o));
  for (const l of [!1, !0]) {
    const u = l ? o : n, h = l ? n : o;
    for (let m = 0; m < h; m++) {
      let c = 0, g = 0, f = -1;
      const y = (p) => l ? p * n + m : m * n + p, b = (p) => l ? a[y(p)] : s[y(p) * 4 + 3];
      for (let p = 0; p < u; p++) {
        const w = Math.min(u - 1, p + r);
        for (; f < w; ) {
          for (f++; g > c && b(d[g - 1]) <= b(f); ) g--;
          d[g++] = f;
        }
        for (; c < g && d[c] < p - r; ) c++;
        (l ? i : a)[y(p)] = b(d[c]);
      }
    }
  }
  for (let l = 0; l < i.length; l++)
    s[l * 4 + 3] = Math.max(
      s[l * 4 + 3],
      Math.round(i[l] * e.data[l * 4 + 3] / 255)
    );
}
function gm(t, e, r) {
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
function fm(t, e) {
  const { width: r, height: n, data: o } = t, s = new Uint8Array(r * n), a = new Uint32Array(r * n);
  let i = 0;
  if (e) {
    for (let l = 0; l < r * n; l++) {
      const u = l * 4;
      o[u + 3] && e.data[u + 3] && Math.max(o[u], o[u + 1], o[u + 2]) < 96 && (a[i++] = l);
    }
    return a.slice(0, i);
  }
  const d = (l, u) => {
    if (l < 0 || u < 0 || l >= r || u >= n || l > r * 0.075 && l < r * 0.925 && u > n * 0.06 && u < n * 0.94) return;
    const h = u * r + l;
    if (s[h]) return;
    s[h] = 1;
    const m = h * 4, c = o[m], g = o[m + 1], f = o[m + 2];
    !o[m + 3] || Math.max(c, g, f) >= 96 || Math.max(c, g, f) - Math.min(c, g, f) > 6 || (a[i++] = h);
  };
  for (let l = 0; l < r; l++)
    d(l, 0), d(l, n - 1);
  for (let l = 0; l < n; l++)
    d(0, l), d(r - 1, l);
  for (let l = 0; l < i; l++) {
    const u = a[l], h = u % r, m = Math.floor(u / r);
    d(h - 1, m), d(h + 1, m), d(h, m - 1), d(h, m + 1);
  }
  return a.slice(0, i);
}
function pm(t, e, r, n, o) {
  ml(n);
  for (const s of r) {
    const a = s * 4, i = Math.max(0, 1 - Math.max(e[a], e[a + 1], e[a + 2]) / 96) ** 2, d = o ? o.data[a + 3] / 255 : 1;
    for (let l = 0; l < 3; l++)
      t.data[a + l] = Math.round(
        t.data[a + l] * (1 - d) + (e[a + l] + n[l] * 255 * i) * d
      );
  }
}
function ml(t) {
  if (t.length !== 3 || t.some((e) => !Number.isFinite(e) || e < 0 || e > 48 / 255))
    throw RangeError("Invalid baked stock black level");
}
const On = (t) => {
  const e = Math.max(0, Math.min(1, t));
  return e * e * (3 - 2 * e);
}, $n = (t) => {
  const e = Math.max(1e-3, t[0] + t[1] + t[2]);
  return t.map((r) => r / e);
};
function Zs(t, e) {
  const { width: r, height: n, data: o } = t, s = new Float32Array(r * n);
  if (e.kind === "polygon") {
    if (e.points.length < 3 || !Number.isFinite(e.feather) || e.feather <= 0 || e.points.some((M) => M.some((R) => !Number.isFinite(R) || R < 0 || R > 1)))
      throw Error(
        "Paper outline requires at least three normalized points and positive feathering."
      );
    const w = e.points.map(([M, R]) => [M * r, R * n]), S = e.feather * r, v = Math.max(0, Math.floor(Math.min(...w.map((M) => M[0])) - S)), C = Math.min(r, Math.ceil(Math.max(...w.map((M) => M[0])) + S)), k = Math.max(0, Math.floor(Math.min(...w.map((M) => M[1])) - S)), x = Math.min(n, Math.ceil(Math.max(...w.map((M) => M[1])) + S));
    for (let M = k; M < x; M++)
      for (let R = v; R < C; R++) {
        let L = !1, G = 1 / 0;
        const A = R + 0.5, F = M + 0.5;
        for (let O = 0; O < w.length; O++) {
          const [K, Y] = w[O], [lt, St] = w[(O + 1) % w.length], dt = lt - K, z = St - Y, N = dt * dt + z * z, _ = N ? Math.max(0, Math.min(1, ((A - K) * dt + (F - Y) * z) / N)) : 0;
          G = Math.min(G, Math.hypot(A - K - _ * dt, F - Y - _ * z)), Y > F != St > F && A < K + (F - Y) * dt / z && (L = !L);
        }
        s[M * r + R] = On((L ? G : -G) / S + 0.5);
      }
    return s;
  }
  if (e.kind === "rect") {
    const [w, S, v, C] = e.rect;
    for (let k = 0; k < n; k++)
      for (let x = 0; x < r; x++) {
        const M = Math.min(
          x / r - w,
          w + v - x / r,
          k / n - S,
          S + C - k / n
        );
        s[k * r + x] = On(M / e.feather + 0.5);
      }
    return s;
  }
  const a = $n(e.frameRgb), i = $n(e.paperRgb), d = i.map((w, S) => w - a[S]), l = d.reduce((w, S) => w + S * S, 0);
  if (l < 1e-3) throw Error("Paper and frame chroma are too similar for this mask.");
  const [u, h, m, c] = e.bounds;
  for (let w = 0; w < n; w++)
    for (let S = 0; S < r; S++) {
      if (S / r < u || S / r > u + m || w / n < h || w / n > h + c)
        continue;
      const v = w * r + S, C = v * 4;
      if (o[C + 3] < 250) continue;
      const x = $n([o[C] / 255, o[C + 1] / 255, o[C + 2] / 255]).reduce((M, R, L) => M + (R - a[L]) * d[L], 0) / l;
      s[v] = On((x - 0.22) / 0.56);
    }
  const g = new Uint8Array(s.length), f = new Int32Array(s.length), y = Math.round(e.seed[1] * n) * r + Math.round(e.seed[0] * r);
  if (!(s[y] > 0.08)) throw Error("Paper mask seed is outside the paper.");
  let b = 0, p = 1;
  for (f[0] = y, g[y] = 1; b < p; ) {
    const w = f[b++], S = w % r;
    for (const v of [w - r, w + r, S ? w - 1 : -1, S < r - 1 ? w + 1 : -1])
      v >= 0 && v < g.length && !g[v] && s[v] > 0.08 && (g[v] = 1, f[p++] = v);
  }
  for (let w = 0; w < s.length; w++) g[w] || (s[w] = 0);
  return s;
}
const Gn = (t) => {
  const e = Math.max(0, Math.min(1, t));
  return e * e * (3 - 2 * e);
}, Qs = ([t, e, r, n], o, s) => o >= t && s >= e && o < t + r && s < e + n;
function ym(t, e) {
  if (!(e.hueCenter >= 0 && e.hueCenter < 360) || !(e.hueRadius > 0 && e.hueRadius <= 180) || !(e.hueFeather > 0 && e.hueFeather <= e.hueRadius) || !(e.saturation[0] >= 0 && e.saturation[1] > e.saturation[0] && e.saturation[1] <= 1) || e.brightness !== void 0 && !(e.brightness[0] >= 0 && e.brightness[1] > e.brightness[0] && e.brightness[1] <= 1))
    throw Error("Invalid source pigment mask.");
  for (const { outer: n, inner: o } of e.rings)
    if (![...n, ...o].every(Number.isFinite) || n[2] <= 0 || n[3] <= 0 || o[2] <= 0 || o[3] <= 0 || o[0] < n[0] || o[1] < n[1] || // Normalized shared edges can differ by one floating-point rounding bit.
    o[0] + o[2] > n[0] + n[2] + 1e-12 || o[1] + o[3] > n[1] + n[3] + 1e-12)
      throw Error("Source pigment rings need nested positive rectangles.");
  const r = new Float32Array(t.width * t.height);
  for (let n = 0; n < t.height; n++)
    for (let o = 0; o < t.width; o++) {
      const s = n * t.width + o, a = s * 4, i = (o + 0.5) / t.width, d = (n + 0.5) / t.height;
      if (!t.data[a + 3] || !e.rings.some((c) => Qs(c.outer, i, d) && !Qs(c.inner, i, d)))
        continue;
      const [l, u, h] = Zr([
        t.data[a] / 255,
        t.data[a + 1] / 255,
        t.data[a + 2] / 255
      ]), m = Math.abs((l - e.hueCenter + 540) % 360 - 180);
      r[s] = Gn((e.hueRadius - m) / e.hueFeather) * Gn((u - e.saturation[0]) / (e.saturation[1] - e.saturation[0])) * (e.brightness ? Gn((h - e.brightness[0]) / (e.brightness[1] - e.brightness[0])) : 1);
    }
  return r;
}
function bm(t, e, r, n) {
  if ("mask" in e)
    for (const h of [
      e.frame,
      e.paper,
      ...e.regions?.map((m) => m.adjustment) ?? [],
      ...e.accents?.map((m) => m.adjustment) ?? []
    ])
      qs(h);
  else qs(e);
  if (e.blackPoint && Jl(e.blackPoint), e.outerStock && ml(e.outerStock), e.outerStockMaskSource && (!n || n.width !== t.width || n.height !== t.height || n.data.length !== t.data.length))
    throw RangeError("Frame stock correction needs its source selection");
  if (e.blackPoint?.textureMaskSource && (!r || r.width !== t.width || r.height !== t.height || r.data.length !== t.data.length))
    throw RangeError("Frame texture correction needs its source selection");
  const o = "mask" in e ? e : void 0, s = o ? Zs(t, o.mask) : void 0, a = "mask" in e ? e.frame : e, i = o?.regions?.map((h) => ({
    values: Zs(t, h.mask),
    adjustment: h.adjustment
  })) ?? [], d = [
    ...i,
    ...o?.accents?.map((h) => ({
      values: ym(t, h.mask),
      adjustment: h.adjustment
    })) ?? []
  ];
  for (let h = 0; h < t.data.length; h += 4) {
    if (t.data[h + 3] === 0) continue;
    const m = [t.data[h] / 255, t.data[h + 1] / 255, t.data[h + 2] / 255], c = Math.max(...m), g = c === 0 ? 0 : (c - Math.min(...m)) / c;
    if (c < 0.075 || !o && g < 0.025 && c > 0.97) continue;
    const f = s?.[h / 4] ?? 0, y = Ht(m, f === 1 && o ? o.paper : a), b = f > 0 && f < 1 && o ? Ht(m, o.paper) : y;
    for (let p = 0; p < 3; p++)
      t.data[h + p] = Math.round(
        Math.round(255 * y[p]) * (1 - f) + Math.round(255 * b[p]) * f
      );
    for (const p of d) {
      const w = p.values[h / 4];
      if (!w) continue;
      const S = Ht(m, p.adjustment);
      for (let v = 0; v < 3; v++)
        t.data[h + v] = Math.round(
          t.data[h + v] * (1 - w) + 255 * S[v] * w
        );
    }
  }
  const l = e.outerStock ? t.data.slice() : void 0, u = e.outerStock ? fm(t, n) : void 0;
  e.blackPoint && Kl(t, e.blackPoint, r), e.outerStock && l && u && pm(t, l, u, e.outerStock, n);
}
const wm = { hueDegrees: -1.0625, saturationScale: 0.9087500000000004, brightnessScale: 0.9406250000000002, gamma: 0.738125 }, Sm = { W: { header: { hueDegrees: -14.024193548387075, saturationScale: 0.5265905874026912, brightnessScale: 0.9495967741935485 }, paper: { hueDegrees: -1.1750690607734668, saturationScale: 0.7998024425287352, brightnessScale: 0.9392712550607287 }, pinline: { hueDegrees: -8.203598940779898, saturationScale: 0.4898632906133164, brightnessScale: 0.9302788844621516 }, glyph: { source: [0.9882352941176471, 0.996078431372549, 1], target: [0.9431372549019608, 0.9352941176470588, 0.9372549019607843] } }, U: { header: { hueDegrees: 42.78801843317967, saturationScale: 0.45884697719052203, brightnessScale: 0.9842342342342343 }, paper: { hueDegrees: 32.97916666666663, saturationScale: 0.5842800834685827, brightnessScale: 1.0133928571428572 }, pinline: { hueDegrees: 17.557840616966587, saturationScale: 0.5557142857142856, brightnessScale: 1.1666666666666667 }, glyph: { source: [0, 0.4588235294117647, 0.7450980392156863], target: [0.396078431372549, 0.4392156862745098, 0.7176470588235293] } }, B: { header: { hueDegrees: -14.404807692307713, saturationScale: 1.421528644784533, brightnessScale: 1.0159574468085106 }, paper: { hueDegrees: -12.3125, saturationScale: 1.2126352339181279, brightnessScale: 1.0239520958083832 }, pinline: { hueDegrees: -88.07559082483772, saturationScale: 1.277991260837483, brightnessScale: 1.308125 }, glyph: { source: [0.15294117647058825, 0.14901960784313725, 0.1411764705882353], target: [0.11568627450980393, 0.09607843137254901, 0.12941176470588234] } }, R: { header: { hueDegrees: 2.5092658770676053, saturationScale: 0.7511073790822655, brightnessScale: 0.9318181818181819 }, paper: { hueDegrees: 8.412850307587178, saturationScale: 1.0477689369398555, brightnessScale: 0.9504310344827587 }, pinline: { hueDegrees: 3.0543379373086736, saturationScale: 1.0001076704423102, brightnessScale: 1.0559610705596107 }, glyph: { source: [0.9372549019607843, 0.2196078431372549, 0.15294117647058825], target: [0.8196078431372549, 0.24901960784313726, 0.20588235294117646] } }, G: { header: { hueDegrees: -59.16304347826099, saturationScale: 1.0029481528127626, brightnessScale: 0.9543269230769231 }, paper: { hueDegrees: -26.824145962732928, saturationScale: 0.9416448402304863, brightnessScale: 0.969626168224299 }, pinline: { hueDegrees: -21.627829393491652, saturationScale: 0.47678542547538166, brightnessScale: 1.16243654822335 }, glyph: { source: [0, 0.4823529411764706, 0.2627450980392157], target: [0.22745098039215686, 0.4568627450980392, 0.29411764705882354] } } }, cl = {
  outer: wm,
  colors: Sm
}, ta = (t) => {
  if (t.length !== 3 || t.some((e) => !Number.isFinite(e) || e < 0 || e > 1))
    throw Error("Invalid Eighth basic-land palette.");
  return [t[0], t[1], t[2]];
}, vm = new Map(
  Object.entries(cl.colors).map(([t, e]) => [
    t,
    { ...e, glyph: { source: ta(e.glyph.source), target: ta(e.glyph.target) } }
  ])
), ao = cl.outer;
function rs(t) {
  if (t.colorCalibration !== "set-hsb-v1" || t.frameAssetFamily !== "eighth" || t.setCode?.toLowerCase() !== "8ed" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = yr(t), r = e ? vm.get(e) : void 0;
  if (!r) return;
  const n = Mt(t);
  if (!(!n || !xo(t, n.frame)))
    return { color: e, palette: r, frame: n.frame, glyph: an(t) };
}
const Cm = { left: [[34.1933, 40.6667], [34.6766, 39.4527], [35.4016, 38.4816], [35.6432, 38.4816], [36.6098, 37.2677], [36.8515, 37.2677], [38.3014, 35.8109], [39.7512, 34.8398], [42.1677, 33.8687], [46.7591, 32.6547], [51.1087, 32.1692], [51.3504, 31.9264], [53.5252, 31.9264], [53.7669, 31.6836], [60.2914, 31.6836], [60.533, 31.9264], [62.4662, 31.9264], [63.9161, 32.4119], [65.6077, 32.4119], [67.5409, 32.8975], [71.4072, 34.1114], [74.7903, 35.8109], [77.4485, 37.7532], [380.4762, 37.7532], [384.8259, 35.3254], [388.6923, 34.1114], [394.7335, 33.3831], [394.9751, 33.1403], [402.2246, 32.8975], [402.4662, 33.1403], [405.366, 33.1403], [405.6077, 33.3831], [411.4072, 34.1114], [415.032, 35.3254], [417.9318, 36.7821], [418.6567, 37.5104], [420.8316, 37.5104], [421.0732, 37.7532], [610.7676, 37.7532], [611.0092, 37.996], [613.6674, 37.996]], right: [[34.435, 448.79], [35.8849, 450.7323], [36.1265, 450.7323], [36.3682, 451.2179], [38.0597, 452.6746], [39.0263, 452.9174], [40.9595, 454.1313], [44.8259, 455.5881], [46.5174, 455.8308], [48.4506, 456.5592], [53.5252, 456.802], [53.7669, 457.0448], [54.9751, 457.0448], [55.2168, 456.802], [59.3248, 457.0448], [59.5665, 456.802], [66.091, 456.5592], [66.8159, 456.0736], [70.6823, 455.3453], [73.0988, 453.8886], [73.5821, 453.8886], [76.2402, 451.9463], [77.6901, 451.2179], [103.3049, 451.2179], [103.5466, 451.4607], [104.9964, 451.4607], [105.2381, 451.2179], [124.0867, 451.4607], [124.3284, 451.2179], [125.5366, 451.2179], [125.7783, 451.4607], [129.8863, 451.4607], [130.1279, 451.7035], [139.3106, 451.7035], [139.5522, 451.4607], [143.4186, 451.4607], [143.6603, 451.2179], [144.6269, 451.4607], [148.7349, 451.4607], [148.9765, 451.2179], [161.059, 451.2179], [161.3006, 451.4607], [163.9588, 451.4607], [164.2004, 451.2179], [169.0334, 451.2179], [169.2751, 451.4607], [171.2082, 451.4607], [171.4499, 451.2179], [172.6581, 451.4607], [174.833, 451.4607], [175.0746, 451.2179], [175.7996, 451.4607], [179.4243, 451.4607], [179.666, 451.2179], [181.8408, 451.2179], [182.0824, 451.4607], [187.6404, 451.4607], [187.882, 451.2179], [192.4733, 451.2179], [192.715, 451.4607], [193.4399, 451.2179], [199.7228, 451.2179], [199.9645, 451.4607], [200.9311, 451.2179], [208.1805, 451.2179], [208.4222, 451.4607], [209.6304, 451.4607], [209.8721, 451.2179], [227.9957, 451.2179], [228.2374, 451.4607], [229.9289, 451.4607], [230.1706, 451.2179], [246.8443, 451.2179], [247.086, 451.4607], [259.6517, 451.4607], [259.8934, 451.2179], [261.1016, 451.4607], [261.8266, 451.2179], [263.0348, 451.2179], [263.2765, 451.4607], [263.7598, 451.2179], [265.9346, 451.2179], [266.1763, 451.4607], [268.8344, 451.4607], [269.076, 451.2179], [367.1855, 451.4607], [367.4271, 451.2179], [374.9183, 451.2179], [375.1599, 451.4607], [377.8181, 451.4607], [378.0597, 451.2179], [379.9929, 451.2179], [381.9261, 452.1891], [382.651, 452.9174], [385.3092, 454.1313], [389.9005, 455.3453], [394.7335, 455.8308], [394.9751, 456.0736], [405.366, 456.0736], [405.6077, 455.8308], [408.7491, 455.5881], [413.0988, 454.6169], [415.5153, 453.6458], [416.4819, 453.6458], [419.14, 451.4607], [419.865, 451.2179], [426.3895, 451.2179], [426.6311, 451.4607], [432.1891, 451.4607], [432.4307, 451.2179], [434.8472, 451.2179], [435.0888, 451.4607], [613.6674, 451.2179]] }, km = { left: [[39.0263, 39.4527], [39.7512, 38.7244], [43.6176, 36.5393], [49.4172, 35.0826], [53.7669, 34.8398], [54.0085, 34.597], [59.8081, 34.597], [60.0498, 34.8398], [65.8493, 35.0826], [68.7491, 35.8109], [73.0988, 37.5104], [75.032, 38.7244], [76.7235, 40.4239], [76.9652, 60.8179]], right: [[39.0263, 449.0328], [39.7512, 449.7612], [42.651, 451.4607], [48.209, 453.1602], [49.4172, 453.1602], [51.1087, 453.6458], [57.3916, 453.6458], [58.5999, 453.8886], [58.8415, 453.6458], [63.4328, 453.6458], [70.199, 452.1891], [75.032, 449.7612], [76.7235, 448.0617], [76.9652, 447.5761]] }, Tm = { left: [[384.1009, 41.395], [385.5508, 40.1811], [387.484, 39.21], [392.317, 37.7532], [395.7001, 37.5104], [395.9417, 37.2677], [408.2658, 37.5104], [412.6155, 38.7244], [415.2736, 39.9383], [417.9318, 41.6378], [418.4151, 42.3662], [418.6567, 60.8179], [418.8984, 60.8179]], right: [[384.1009, 447.8189], [385.3092, 448.79], [388.9339, 450.4896], [392.5586, 451.4607], [396.9083, 451.7035], [397.15, 451.9463], [404.3994, 451.9463], [404.6411, 451.7035], [408.7491, 451.4607], [413.5821, 450.004], [415.9986, 448.79], [418.4151, 446.8478], [418.6567, 428.8816], [418.8984, 428.8816]] }, Mm = { left: [[424.2146, 41.6378], [608.3511, 41.6378], [609.3177, 41.395], [609.5593, 60.8179], [609.801, 60.8179]], right: [[424.2146, 446.3622], [424.6979, 446.1194], [602.3099, 446.1194], [602.5515, 446.3622], [608.5928, 446.1194], [609.076, 446.3622], [609.3177, 446.1194], [609.5593, 428.8816], [609.801, 428.8816]] }, sr = {
  outer: Cm,
  title: km,
  type: Tm,
  paper: Mm
}, xm = sr, Qr = (t) => Math.max(0, Math.min(1, t)), gl = (t) => {
  const e = Qr(t);
  return e * e * (3 - 2 * e);
}, ea = (t, e) => {
  let r = 0;
  for (; r + 1 < t.length - 1 && t[r + 1][0] < e; ) r++;
  const n = t[r], o = t[r + 1];
  return n[1] + Qr((e - n[0]) / (o[0] - n[0])) * (o[1] - n[1]);
};
function Er(t, e) {
  const { left: r, right: n } = e, o = Math.max(r[0][0], n[0][0]), s = Math.min(r.at(-1)[0], n.at(-1)[0]);
  return Array.from({ length: t }, (a, i) => {
    const d = (i + 0.5) * 680 / t;
    return [ea(r, d), ea(n, d), Math.min(d - o, s - d)];
  });
}
const Lr = (t, e) => gl(0.5 + Math.min(e - t[0], t[1] - e, t[2]) / 0.4), Pn = (t, e, r) => [
  t[0] + r * (e[0] - t[0]),
  t[1] + r * (e[1] - t[1]),
  t[2] + r * (e[2] - t[2])
];
function Rm(t, e) {
  const r = Er(t.height, sr.outer), n = Er(t.height, sr.title), o = Er(t.height, sr.type), s = Er(t.height, sr.paper);
  for (let a = 0; a < t.height; a++)
    for (let i = 0; i < t.width; i++) {
      const d = (a * t.width + i) * 4;
      if (!t.data[d + 3]) continue;
      const l = [t.data[d] / 255, t.data[d + 1] / 255, t.data[d + 2] / 255], u = Math.max(...l);
      if (u < 0.075) continue;
      const h = (i + 0.5) * 488 / t.width, m = Lr(r[a], h), c = Math.max(Lr(n[a], h), Lr(o[a], h)), g = Lr(s[a], h);
      let f;
      if (m < 1) {
        const y = Math.pow(u, ao.gamma) / u, b = Ht([l[0] * y, l[1] * y, l[2] * y], ao);
        f = Pn(l, b, gl((u - 0.075) / 0.125));
      } else f = l;
      if (m > 0) {
        const y = g > 0 ? e.paper : e.header, b = Math.max(c, g), p = b === 1 ? l : Ht(l, e.pinline), w = b > 0 ? Pn(p, Ht(l, y), b) : p;
        f = Pn(f, w, m);
      }
      for (let y = 0; y < 3; y++) t.data[d + y] = Math.round(255 * f[y]);
    }
}
function Am(t, e) {
  const r = (a) => (a[0] + a[1] + a[2]) / 3, n = r(e.source), o = e.source.map((a) => a - n), s = o.reduce((a, i) => a + i * i, 0);
  if (s <= 1e-6) throw Error("Basic glyph fill cannot be separated from neutral details.");
  for (let a = 0; a < t.data.length; a += 4) {
    if (!t.data[a + 3]) continue;
    const i = [t.data[a] / 255, t.data[a + 1] / 255, t.data[a + 2] / 255], d = r(i), l = Qr(i.reduce((u, h, m) => u + (h - d) * o[m], 0) / s);
    for (let u = 0; u < 3; u++)
      t.data[a + u] = Math.round(
        255 * Qr(i[u] + l * (e.target[u] - e.source[u]))
      );
  }
}
function Em(t, e) {
  const r = rs(t);
  return r ? [
    {
      url: r.frame,
      kind: "frame",
      color: (o) => Rm(o, r.palette)
    },
    ...r.glyph ? [
      {
        url: r.glyph,
        kind: "glyph",
        color: (o) => Am(o, r.palette.glyph)
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
        s === "frame" ? [r.palette, ao, xm] : r.palette.glyph
      ]),
      bytes: i.width * i.height * 4,
      build: async () => {
        const d = I();
        d.width = i.width, d.height = i.height;
        try {
          const l = d.getContext("2d", { willReadFrequently: !0 });
          if (!l) throw Error("Basic-land color preparation needs Canvas2D.");
          l.drawImage(i, 0, 0);
          const u = l.getImageData(0, 0, d.width, d.height);
          return a(u), l.putImageData(u, 0, 0), await createImageBitmap(d);
        } finally {
          d.width = d.height = 0;
        }
      }
    };
  }) : [];
}
function Lm(t, e) {
  if (t.width !== e.width || t.height !== e.height)
    throw Error("Stamp palette dimensions differ.");
  for (let r = 0; r < t.height; r++)
    for (let n = 0; n < t.width; n++) {
      const o = (r * t.width + n) * 4, s = Math.max(0, Math.min(1, ((n + 0.5) / t.width - 0.35) / 0.3)), a = t.data[o + 3] * (1 - s), i = e.data[o + 3] * s, d = a + i;
      for (let l = 0; l < 3; l++)
        t.data[o + l] = d ? (t.data[o + l] * a + e.data[o + l] * i) / d : 0;
      t.data[o + 3] = d;
    }
}
function Bm(t, e) {
  const r = be(t);
  if (!r) return [];
  const n = Pt(t.setCode, t.borderColor).border === "#090806";
  if (!n && !r.rightImage) return [];
  const o = t.calibration === void 0 ? "#090806" : At(t) ?? "#090806", s = [1, 3, 5].map((d) => parseInt(o.slice(d, d + 2), 16)), a = e.get(r.image);
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
        const d = I();
        d.width = a.width, d.height = a.height;
        try {
          const l = d.getContext("2d", { willReadFrequently: !0 });
          if (!l) throw Error("Stamp preparation needs Canvas2D.");
          let u;
          i && (l.drawImage(i, 0, 0), u = l.getImageData(0, 0, d.width, d.height), l.clearRect(0, 0, d.width, d.height)), l.drawImage(a, 0, 0);
          const h = l.getImageData(0, 0, d.width, d.height);
          u && Lm(h, u);
          for (let m = 0; n && m < h.data.length; m += 4) {
            if (!h.data[m + 3]) continue;
            const c = Math.max(h.data[m], h.data[m + 1], h.data[m + 2]);
            if (c >= 24) continue;
            const g = (1 - c / 24) ** 2;
            h.data[m] = h.data[m] + s[0] * g, h.data[m + 1] = h.data[m + 1] + s[1] * g, h.data[m + 2] = h.data[m + 2] + s[2] * g;
          }
          return l.putImageData(h, 0, 0), await createImageBitmap(d);
        } finally {
          d.width = d.height = 0;
        }
      }
    }
  ];
}
const Im = {
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
function Om(t, e) {
  if (t.frameTemplate !== "future") return [];
  const r = t.setCode?.toLowerCase() === "fut" && t.colorCalibration === "set-hsb-v1", n = /* @__PURE__ */ new Set();
  return [...new Set(t.manaSymbols ?? [])].flatMap((o) => {
    const s = /^(?:\d+|X)$/.test(o), a = r ? Im[s ? "N" : o] : void 0, i = un(o), d = i ? e.get(i) : void 0;
    if (!a && !s || !i || !d || n.has(i)) return [];
    n.add(i);
    const l = s ? Vn().map((u) => {
      const h = e.get(u);
      if (!h || h.width !== d.width || h.height !== d.height)
        throw Error("Future generic medallion requires all matching pinned numeral sources");
      return h;
    }) : [];
    return [
      {
        url: i,
        key: JSON.stringify([
          "future-mana-color-blank-v2",
          i,
          d.width,
          d.height,
          a,
          s ? Vn() : null
        ]),
        bytes: d.width * d.height * 4,
        build: () => $m(d, a, l)
      }
    ];
  });
}
async function $m(t, e, r) {
  const n = I();
  n.width = t.width, n.height = t.height;
  try {
    const o = n.getContext("2d", { willReadFrequently: !0 });
    o.drawImage(t, 0, 0);
    const s = o.getImageData(0, 0, n.width, n.height);
    for (const d of r) {
      o.clearRect(0, 0, n.width, n.height), o.drawImage(d, 0, 0);
      const l = o.getImageData(0, 0, n.width, n.height).data;
      for (let u = 0; u < s.data.length; u++)
        u % 4 !== 3 && (s.data[u] = Math.max(s.data[u], l[u]));
    }
    const [a, i] = e ?? [
      [1, 1, 1],
      [1, 1, 1]
    ];
    for (let d = 0; d < n.height; d++)
      for (let l = 0; l < n.width; l++) {
        const u = (d * n.width + l) * 4;
        if (!s.data[u + 3]) continue;
        const h = Math.hypot((l + 0.5) / n.width - 0.5, (d + 0.5) / n.height - 0.5), m = Math.max(0, Math.min(1, (h - 0.31) / 0.03)), c = m * m * (3 - 2 * m);
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
async function Gm(t, e, r) {
  t = le(t);
  const n = { images: e, dispose() {
  } }, o = t0(t) ?? no(t, "INK"), s = /* @__PURE__ */ new Map(), a = new Map(Object.entries(Xi(t))), i = {}, d = {}, l = /* @__PURE__ */ new Set(), u = [], h = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...[...(t.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((S) => S[1])
  ]);
  for (const S of t.rulesParagraphs ?? [])
    for (const v of S.runs) for (const C of v.text.matchAll(/\{([^}]+)\}/g)) h.add(C[1]);
  for (const S of h) {
    const v = /^\d+$/.test(S) || S === "X" && br(t) ? "N" : S, C = Hn(t, S), k = C?.discColor ?? Tn[v], x = no(t, v) ?? (C && Tn[v] ? Se(v === "W" ? "#efe7cb" : Tn[v]) : void 0);
    if (C && l.add(S), C?.glyphScale !== void 0 && (d[S] = C.glyphScale), !x || !k) continue;
    const M = C?.url ?? je(S);
    if (o && M && /^[WUBRGN]$/.test(v) && s.set(M, {
      inkTarget: o,
      paper: x,
      sourceInk: C ? Se(C.inkColor) : [13 / 255, 15 / 255, 15 / 255]
    }), C) {
      const R = e.get(C.url);
      if (!R) throw Error(`Historical mana asset unavailable: ${S}`);
      u.push({ url: C.url, source: R, palette: C, target: x });
    } else M && a.set(M, Wm(k, x));
    i[S] = `rgb(${x.map((R) => Math.round(R * 255)).join(" ")})`;
  }
  const m = h.has("W") && wr(t, "W") === "historic-font", c = Em(t, e), g = Bm(t, e), f = Om(t, e);
  if (!a.size && !u.length && !c.length && !g.length && !f.length && !Object.keys(i).length && !m)
    return n;
  const y = Object.assign(new Map(e), {
    manaInkColor: o ? `rgb(${o.map((S) => Math.round(S * 255)).join(" ")})` : void 0,
    manaColors: i,
    originalManaGlyphs: l,
    originalWhiteGlyph: m,
    manaGlyphScales: d
  }), b = [...a].flatMap(([S, v]) => {
    const C = e.get(S);
    return C ? [{ url: S, source: C, adjustment: v }] : [];
  }), p = [
    ...c,
    ...g,
    ...f,
    ...b.map(({ url: S, source: v, adjustment: C }) => ({
      url: S,
      key: s.has(S) ? JSON.stringify([
        ra(S, v.width, v.height, C),
        "mana-ink-v1",
        s.get(S)
      ]) : ra(S, v.width, v.height, C),
      bytes: v.width * v.height * 4,
      build: () => Pm(v, C, e, s.get(S))
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
      build: () => mm(v, C, k, s.get(S))
    }))
  ];
  let w = [];
  try {
    w = await sl.acquireMany(p, r), p.forEach(({ url: S }, v) => y.set(S, w[v].value));
    for (const S of l) {
      const v = Hn(t, S), C = y.get(v.url), k = je(S);
      if (!C || !k) throw Error(`Historical mana asset unavailable: ${S}`);
      y.set(k, C);
    }
    return { images: y, dispose: () => w.forEach((S) => S.release()) };
  } catch (S) {
    throw w.forEach((v) => v.release()), S;
  }
}
function ra(t, e, r, n) {
  return JSON.stringify(["frame-hsb-paper-mask-v3", t, e, r, n]);
}
async function Pm(t, e, r, n) {
  const o = I();
  o.width = t.width, o.height = t.height;
  try {
    const s = o.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("HSB preparation needs Canvas2D.");
    s.drawImage(t, 0, 0);
    const a = s.getImageData(0, 0, o.width, o.height), i = (m) => {
      const c = r.get(m);
      if (!c) throw Error(`Frame material mask unavailable: ${m}`);
      return s.clearRect(0, 0, o.width, o.height), s.drawImage(c, 0, 0, o.width, o.height), s.getImageData(0, 0, o.width, o.height);
    }, d = e.blackPoint?.textureMaskSource, l = d ? i(d) : void 0, u = e.blend ? i(e.blend.maskSource) : void 0;
    if (e.blend && u) {
      const m = e.blend.outerMaskSource === d && l ? l : i(e.blend.outerMaskSource);
      if (cm(u, m, Math.round(e.blend.outset * o.width)), l)
        for (let c = 3; c < l.data.length; c += 4)
          l.data[c] = Math.round(l.data[c] * (1 - u.data[c] / 255));
    }
    const h = e.outerStockMaskSource ? i(e.outerStockMaskSource) : void 0;
    return bm(a, e, l, h), e.blend && u && gm(a, u, e.blend), n && hl(a.data, n), s.putImageData(a, 0, 0), await createImageBitmap(o);
  } finally {
    o.width = o.height = 0;
  }
}
function Wm(t, e) {
  const r = Se(t), [n, o, s] = Zr(r), [a, i, d] = Zr(e);
  if (o <= 0 || s <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (a - n + 540) % 360 - 180,
    saturationScale: i / o,
    brightnessScale: d / s
  };
}
function ns(t, e) {
  if (t.layout && t.layout !== "normal") return [0, 0];
  const r = t.setCode?.toLowerCase();
  if (t.borderColor && t.borderColor !== (r === "8ed" ? "white" : "black")) return [0, 0];
  if (e === "retro" && kt(t)) return [-18.5, -6];
  if (t.legendary ?? /\bLegendary\b/.test(t.typeLine ?? "")) return [0, 0];
  if (e === "retro") {
    if (r === "lea") return [-1.5, 1.5];
    if (r === "leb") return [-1, 2];
  }
  return e === "eighth" && r === "8ed" ? [0.5, -2] : e === "modern" && r === "m21" ? [-1, 1] : [0, 0];
}
const na = [0.08, 0.36, 0.64, 0.92, 1], Fm = [0.18, 0.18, 0.17];
function io(t, e, r, n, o, s) {
  if (o.length !== 2) return;
  const { box: a, width: i } = s, d = t - r / 2, l = t + r / 2, u = e - n / 2, h = e + n / 2;
  if (l <= a.left || d >= a.right || h <= a.top || u >= a.bottom || d >= a.left + i.left && l <= a.right - i.right && u >= a.top + i.top && h <= a.bottom - i.bottom)
    return;
  const m = (y) => Math.max(
    0,
    Math.min(l, a.right - i.right * y) - Math.max(d, a.left + i.left * y)
  ) * Math.max(
    0,
    Math.min(h, a.bottom - i.bottom * y) - Math.max(u, a.top + i.top * y)
  ) / (r * n);
  let c = m(0), g = 0;
  const f = [0, 0, 0];
  for (let y = 0; y < na.length; y++) {
    const b = m(na[y]), p = Math.max(0, c - b), w = y === 0 || y === 4 ? Fm : o[y === 2 ? 1 : 0];
    for (let S = 0; S < 3; S++) f[S] += w[S] * p;
    g += p, c = b;
  }
  if (g)
    return { color: [f[0] / g, f[1] / g, f[2] / g], alpha: g };
}
const Vt = {
  left: 61.063333333333325 / (488 / 1500),
  right: 427.9656666666666 / (488 / 1500),
  top: 404.6309523809524 / (680 / 2100),
  bottom: 606.325 / (680 / 2100)
}, Bt = { left: 188, right: 1324, top: 1253, bottom: 1871 }, tr = { left: 26, right: 29, top: 29, bottom: 28 }, oa = 6.375 / (488 / 1500), sa = 6.375 / (680 / 2100), _m = { left: oa, right: oa, top: sa, bottom: sa }, Um = {
  W: [186 / 255, 177 / 255, 176 / 255],
  U: [72 / 255, 110 / 255, 137 / 255],
  B: [88 / 255, 77 / 255, 85 / 255],
  R: [182 / 255, 62 / 255, 81 / 255],
  G: [129 / 255, 149 / 255, 92 / 255]
};
function jm(t, e) {
  if (e.length !== 2) return;
  const n = [...e].sort((h, m) => "RGUBW".indexOf(h) - "RGUBW".indexOf(m)).map((h) => Um[h]);
  if (!n[0] || !n[1]) return;
  const o = 1500 / t.width, s = 2100 / t.height, a = t.data.slice(), i = Math.min(Vt.left, Bt.left), d = Math.max(Vt.right, Bt.right), l = Math.min(Vt.top, Bt.top), u = Math.max(Vt.bottom, Bt.bottom);
  for (let h = Math.floor(l / s); h < Math.ceil(u / s); h++)
    for (let m = Math.floor(i / o); m < Math.ceil(d / o); m++) {
      const c = io((m + 0.5) * o, (h + 0.5) * s, o, s, [n[0], n[1]], {
        box: Vt,
        width: _m
      }), g = (m + 0.5) * o, f = (h + 0.5) * s, y = io(g, f, o, s, [n[0], n[1]], {
        box: Bt,
        width: tr
      });
      if (!c && !y) continue;
      const b = (h * t.width + m) * 4;
      if (t.data[b + 3]) {
        if (y) {
          const p = [
            g - Bt.left,
            Bt.right - g,
            f - Bt.top,
            Bt.bottom - f
          ], w = p.indexOf(Math.min(...p)), S = g >= Vt.left && g < Vt.right && f >= Vt.top && f < Vt.bottom, v = w === 0 ? Bt.left + (S ? tr.left + 2 : -2) : w === 1 ? Bt.right - (S ? tr.right + 2 : -2) : g, C = w === 2 ? Bt.top + (S ? tr.top + 2 : -2) : w === 3 ? Bt.bottom - (S ? tr.bottom + 2 : -2) : f, k = (Math.floor(C / s) * t.width + Math.floor(v / o)) * 4;
          for (let x = 0; x < 3; x++)
            t.data[b + x] = a[b + x] * (1 - y.alpha) + a[k + x] * y.alpha;
        }
        if (c)
          for (let p = 0; p < 3; p++)
            t.data[b + p] = t.data[b + p] * (1 - c.alpha) + c.color[p] * 255 * c.alpha;
      }
    }
}
const ar = { left: 166.8794, right: 1338.8298, top: 1255.6105, bottom: 1882.7268 }, aa = 6.375 / (488 * 0.984 / 1500 * 1.001), ia = 6.375 / (680 * 0.99 / 2100 * 1.001), Dm = { left: aa, right: aa, top: ia, bottom: ia };
function Nm(t, e, r, n, o) {
  return io(t, e, r, n, o, {
    box: ar,
    width: Dm
  });
}
const Wn = {
  W: { hueDegrees: 8.4847, saturationScale: 0.42831, brightnessScale: 0.97071 },
  U: { hueDegrees: 164.886, saturationScale: 0.25883, brightnessScale: 0.841 },
  B: { hueDegrees: 157.329, saturationScale: 0.20015, brightnessScale: 0.62552 },
  R: { hueDegrees: -23.3867, saturationScale: 0.88939, brightnessScale: 0.9205 },
  G: { hueDegrees: 30.7835, saturationScale: 0.6094, brightnessScale: 0.79916 }
}, zm = {
  W: { hueDegrees: 7.44281, saturationScale: 0.570206, brightnessScale: 0.845188 },
  U: { hueDegrees: -177.38556, saturationScale: 0.121282, brightnessScale: 0.656904 },
  B: { hueDegrees: 0, saturationScale: 0, brightnessScale: 0.452356 },
  R: { hueDegrees: -34.23136, saturationScale: 1.238404, brightnessScale: 0.866109 },
  G: { hueDegrees: 42.19413, saturationScale: 0.716825, brightnessScale: 0.656904 }
}, la = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, da = {
  W: [0.9, 0.91, 0.9],
  U: [0.32, 0.58, 0.75],
  B: [0.38, 0.4, 0.38],
  R: [0.8, 0.32, 0.34],
  G: [0.6, 0.66, 0.29]
}, ua = { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.992232 };
function Ym(t, e, r) {
  const n = r ? Wn : zm, o = e[0], s = e[1] ?? o;
  if (!o || !s || !Wn[o] || !Wn[s]) return;
  const a = e.length === 2 ? [...e].sort((d, l) => "RGUBW".indexOf(d) - "RGUBW".indexOf(l)).map((d) => da[d]) : [], i = a.length ? t.data.slice() : void 0;
  for (let d = 0; d < t.height; d++)
    for (let l = 0; l < t.width; l++) {
      const u = (d * t.width + l) * 4;
      if (!t.data[u + 3]) continue;
      const h = (l + 0.5) * 1500 / t.width, m = (d + 0.5) * 2100 / t.height, c = [t.data[u] / 255, t.data[u + 1] / 255, t.data[u + 2] / 255], g = Math.max(...c), f = Nm(h, m, 1500 / t.width, 2100 / t.height, a), y = i ? h >= ar.left && h < ar.right && m >= ar.top && m < ar.bottom : h >= 187 && h < 1320 && m >= 1280 && m < 1864, b = i && h >= 165 && h <= 1345 && m >= 1248 && m <= 1885;
      if (!f && g < 0.075 && !(i && y) && !b) continue;
      const p = Math.min(h - 126, 1379 - h, m - 153, 1171 - m), w = Math.min(h - 170, 1340 - h, m - 1253, 1880 - m), S = p >= -1 && p < 13 || w >= -1 && w < 29;
      let v;
      if (y) {
        const C = Math.min(
          (h - 187) * 488 * 0.984 / 1500,
          (1320 - h) * 488 * 0.984 / 1500,
          (m - 1280) * 680 * 0.99 / 2100,
          (1864 - m) * 680 * 0.99 / 2100
        ), k = Math.floor(Math.max(0, C) / 11.5);
        let x = c;
        if (i && (h < 190 || m < 1284)) {
          const M = Math.min(t.width - 1, Math.max(l, Math.ceil(190 * t.width / 1500))), L = (Math.min(
            t.height - 1,
            Math.max(d, Math.ceil(1284 * t.height / 2100))
          ) * t.width + M) * 4;
          x = [i[L] / 255, i[L + 1] / 255, i[L + 2] / 255];
        }
        v = Ht(x, n[k % 2 ? s : o]);
      } else if (b) {
        const C = [h - 165, 1345 - h, m - 1248, 1885 - m], k = C.indexOf(Math.min(...C)), x = k === 0 ? 160 : k === 1 ? 1350 : h, M = k === 2 ? 1240 : k === 3 ? 1890 : m, R = Math.min(t.width - 1, Math.floor(x * t.width / 1500)), G = (Math.min(t.height - 1, Math.floor(M * t.height / 2100)) * t.width + R) * 4;
        v = Ht(
          [i[G] / 255, i[G + 1] / 255, i[G + 2] / 255],
          r ? ua : la
        );
      } else if (S && c[0] > 0.45 && c[1] > 0.35 && c[2] < Math.min(c[0], c[1]) * 0.72) {
        const C = da[(p >= -1 && p < 13 ? p < 6 : w < 14) ? s : o], k = g / 0.97;
        v = [
          Math.min(1, C[0] * k),
          Math.min(1, C[1] * k),
          Math.min(1, C[2] * k)
        ];
      } else v = Ht(c, r ? ua : la);
      for (let C = 0; C < 3; C++)
        t.data[u + C] = Math.round(
          255 * (f ? f.color[C] * f.alpha + v[C] * (1 - f.alpha) : v[C])
        );
    }
}
async function qm(t, e, r) {
  if (!bt(t)) return { images: e, dispose() {
  } };
  const n = e.get(ir);
  if (!n) throw Error("Revised land frame asset unavailable");
  const o = ui(t), s = ke(t), a = await es.acquire(
    JSON.stringify([
      "revised-fourth-land-v5",
      ir,
      n.width,
      n.height,
      o,
      s
    ]),
    n.width * n.height * 4,
    async () => {
      const d = I();
      d.width = n.width, d.height = n.height;
      try {
        const l = d.getContext("2d", { willReadFrequently: !0 });
        if (!l) throw Error("Revised land preparation needs Canvas2D");
        l.drawImage(n, 0, 0);
        const u = l.getImageData(0, 0, d.width, d.height);
        Ym(u, o, s), l.putImageData(u, 0, 0);
        const h = d.width * 160 / 1500, m = d.height * 1240 / 2100, c = d.width * 1190 / 1500, g = d.height * 654 / 2100, f = d.width * (244 - 2.404) / (488 * 0.984), y = d.height * (515 - 9.9) / (680 * 0.99);
        return l.drawImage(
          d,
          h,
          m,
          c,
          g,
          f + (h - f) * 1.001,
          y + (m - y) * 1.001 + d.height * 0.25 / (680 * 0.99),
          c * 1.001,
          g * 1.001
        ), await createImageBitmap(d);
      } finally {
        d.width = d.height = 0;
      }
    },
    r
  ), i = Object.assign(new Map(e), e);
  return i.set(ir, a.value), { images: i, dispose: () => a.release() };
}
async function Hm(t, e, r) {
  if (bt(t)) return qm(t, e, r);
  const n = ie(t);
  if (!n) return { images: e, dispose() {
  } };
  const o = (u) => {
    const h = e.get(u);
    if (!h) throw Error(`Historical dual-land asset unavailable: ${u}`);
    return h;
  }, s = o(n.base), a = o(n.overlay), i = o(n.mask), [d] = await es.acquireMany(
    [
      {
        key: JSON.stringify([
          "abu-dual-frame-v3",
          n,
          s.width,
          s.height,
          Xi(t)
        ]),
        bytes: s.width * s.height * 4,
        build: async () => {
          const u = I(), h = I();
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
            return jm(g, Na(t)), m.putImageData(g, 0, 0), await createImageBitmap(u);
          } finally {
            u.width = u.height = h.width = h.height = 0;
          }
        }
      }
    ],
    r
  ), l = Object.assign(new Map(e), e);
  return l.set(n.base, d.value), { images: l, dispose: () => d.release() };
}
const Xm = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", ha = {
  // Black outer contour after the checksum-guarded LEG SVG repair.
  "leg/retro/black": [3.25, 1.5, 1.05, 1.125],
  "6ed/retro/white": [2, -2, 1.08, 1.08],
  // Filled crescent after rim repair; independent width/height on fixed poses.
  "drk/retro/black": [2.5, -1.25, 1.146, 1.203]
}, ma = {
  m15: { family: "m15-accurate", delta: [1, 0, 1, 1] },
  m21: { family: "m15-accurate", delta: [2, 0, 1.1, 1.06] },
  woe: { family: "m15-accurate", delta: [2, 0, 1.08, 1.08] },
  tdm: { family: "m15-accurate", delta: [0, 0, 1.08, 1.08] },
  "8ed": { family: "eighth", delta: [-4, 0, 1, 0.92] },
  "9ed": { family: "eighth", delta: [0, 1, 0.9, 0.92] }
};
function Jm(t, e, r) {
  if (t.frameTreatment === "colorshifted") return r;
  const n = t.setCode?.toLowerCase() ?? "", o = Object.hasOwn(ma, n) ? ma[n] : void 0;
  let s = r;
  return o && !t.setSymbol && Ut(e) && o.family === t.frameAssetFamily && (s = fl(r, o.delta)), t.frameAssetFamily ? os(t, e, s, t.frameAssetFamily) : s;
}
function os(t, e, r, n) {
  if (t.setSymbol || !Ut(e) || P !== Xm || (t.layout ?? "normal") !== "normal" || ["component", "m15-accurate"].includes(n) && U(t).legendary)
    return r;
  const o = t.borderColor ?? (n === "retro" ? Rt(t) : Pt(t.setCode).border === "#eeedeb" ? "white" : "black"), s = `${t.setCode?.trim().toLowerCase() ?? ""}/${n}/${o}`;
  if (s === "leg/retro/black" && !kt(t)) return r;
  const a = Object.hasOwn(ha, s) ? ha[s] : Object.hasOwn(bs, s) ? bs[s] : void 0;
  return a ? fl(r, a) : r;
}
function fl(t, e) {
  const [r, n, o, s] = t, [a, i, d, l] = e;
  return [r + o + a - o * d, n + s / 2 + i - s * l / 2, o * d, s * l];
}
const Km = 0.045;
function pl(t) {
  const e = wt(t)?.cornerRadius;
  return e !== void 0 ? e : st(t) && t.setCode?.toLowerCase() === "lea" ? md : Km;
}
const er = "#fbf0c5", Oe = "#ccdaf2", Br = "#9c9995", rr = "#edaa8d", $e = "#dde6e2", Vm = {
  W: [er, er],
  U: [Oe, Oe],
  B: [Br, Br],
  R: [rr, rr],
  G: [$e, $e],
  WU: [er, Oe],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [rr, er],
  WG: [$e, er],
  UB: [Oe, Br],
  UR: [Oe, rr],
  UG: [$e, Oe],
  BR: ["#b4afb5", "#f2b096"],
  BG: [Br, $e],
  RG: [rr, $e]
};
function Zm(t, e, r) {
  if (!e.land) return;
  const n = Vm[e.frame];
  if (!n) return;
  const o = 34 + r, s = 420 - 2 * r, a = t.createLinearGradient(o, 0, o + s, 0);
  a.addColorStop(0, n[0]), a.addColorStop(0.35, n[0]), a.addColorStop(0.65, n[1]), a.addColorStop(1, n[1]), t.save(), t.globalCompositeOperation = "multiply", t.fillStyle = a, t.fillRect(o, 425, s, 203.5), t.restore();
}
function Qm(t, e, r, n) {
  if (!e.land || e.frame !== "Artifact") {
    n();
    return;
  }
  const o = 34 + r, s = 420 - 2 * r;
  for (const a of [!1, !0])
    t.save(), t.beginPath(), a || t.rect(0, 0, 488, 680), t.rect(o, 425, s, 203.5), t.clip("evenodd"), t.filter = `grayscale(1) brightness(${a ? 0.9 : 0.63})`, n(), t.restore();
}
function tc(t, e, r) {
  if (!e.land) return;
  t.save(), t.shadowColor = "transparent";
  const n = t.createLinearGradient(0, 625.75, 0, 628.25);
  n.addColorStop(0, "#ffffff00"), n.addColorStop(0.3, "#ffffffb0"), n.addColorStop(0.7, "#ffffffb0"), n.addColorStop(1, "#ffffff00"), t.fillStyle = n, t.fillRect(34 + r, 625.75, 420 - 2 * r, 2.5), t.restore();
}
function yl(t) {
  if (t.setSymbol) return null;
  const e = t.setCode?.toLowerCase();
  return e === "m15" || e === "war" ? e : null;
}
function bl(t, e, r, n, o, s, a, i, d, l) {
  const [u, h, m, c] = l ? r === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, r === "m15" ? 0.7 : 1.2];
  o += h - a * (u - 1) / 2, s += m - i * (u - 1) / 2, a *= u, i *= u;
  const g = !n || n === "common", f = I(), y = 3, b = 4;
  f.width = Math.ceil((a + y * 2) * b), f.height = Math.ceil((i + y * 2) * b);
  const p = f.getContext("2d");
  p.scale(b, b), p.translate(y, y), p.drawImage(
    e,
    d[0] * e.width,
    d[1] * e.height,
    d[2] * e.width,
    d[3] * e.height,
    0,
    0,
    a,
    i
  ), p.globalCompositeOperation = "source-in";
  const w = n === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : n === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], S = p.createLinearGradient(0, i * 0.65, a, i * 0.35);
  S.addColorStop(0, w[0]), S.addColorStop(0.35, w[1]), S.addColorStop(0.6, w[2]), S.addColorStop(1, w[3]), p.fillStyle = g ? "#111111" : S, p.fillRect(0, 0, a, i);
  const v = r === "m15" ? 32 : 27, C = new Path2D(
    r === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), k = new DOMMatrix().translate(-d[0] * a / d[2], -d[1] * i / d[3]).scale(a / (v * d[2]), i / (32 * d[3])), x = new Path2D();
  x.addPath(C, k), p.globalCompositeOperation = "destination-over", p.fillStyle = g ? "#f8f8f5" : "#111111", p.fill(x), p.strokeStyle = p.fillStyle, p.lineWidth = r === "war" && g ? 2 : c, p.lineJoin = "round", p.stroke(x), t.drawImage(
    f,
    o - y,
    s - y,
    f.width / b,
    f.height / b
  ), f.width = f.height = 0;
}
function ec(t, e, r, n, o) {
  const s = sn(e.setCode);
  if (!s || e.frameStyle === "modern" || e.frameTemplate || e.frameAssetFamily || e.borderColor && e.borderColor !== "black" || e.layout && e.layout !== "normal")
    return !1;
  const a = (e.setCalibrationCandidate ? ja(e.setCalibrationCandidate) : s).title;
  if (!a.dx && !a.dy && a.size === 27.8 && a.width === 1 && a.gray === 130 && a.shadow === 1)
    return !1;
  t.save();
  const i = t.getTransform().a * a.shadow;
  return t.translate(r + a.dx, n + a.dy), t.scale(a.width, 1), t.font = `${a.size}px "CardRenderer MTG Goudy", Georgia`, t.fillStyle = `rgb(${a.gray},${a.gray},${a.gray})`, t.shadowOffsetX = t.shadowOffsetY = i, t.fillText(e.name, 0, 0, Math.max(1, (o - a.dx) / a.width)), t.restore(), !0;
}
const rc = {
  "Mana Vault": "Tap to add 3 colorless mana to your mana pool. Mana Vault doesn't untap normally during untap phase; to untap it, you must pay 4 mana. If Mana Vault remains tapped during upkeep it does 1 damage to you. Tapping this artifact can be played as an interrupt.",
  "Hypnotic Specter": 'Flying An opponent damaged by Specter must discard a card at random from his or her hand. Ignore this effect if opponent has no cards left in hand. "...There was no trace/ Of aught on that illumined face..." —Samuel Coleridge, "Phantom"'
}, lo = (t) => t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
function nc(t, e) {
  if (t.wordingMode === "oracle" || !["lea", "leb"].includes(t.setCode?.toLowerCase() ?? ""))
    return !1;
  const r = rc[t.name];
  return !!(r && lo(e.flatMap((n) => n.runs.map((o) => o.text)).join(" ")) === lo(r));
}
const ca = {
  type: { fontSize: 22.2, dx: -2, dy: -1 },
  artistBaseline: 630.25,
  statsDx: 1,
  headingInk: "#828282"
};
function Fe(t) {
  const e = t?.toLowerCase();
  return e === "lea" ? { ...ca, artistInk: "#737373", statsInk: "#787878" } : e === "leb" ? { ...ca, artistInk: "#828282", statsInk: "#737373" } : void 0;
}
function oc(t, e) {
  const r = t.setCode?.toLowerCase();
  if (t.wordingMode === "oracle" || !["lea", "leb"].includes(r ?? "")) return {};
  const n = lo(e.flatMap((o) => o.runs.map((s) => s.text)).join(" "));
  return t.name === "Lifetap" && n === "You gain 1 life each time any forest of opponent's becomes tapped." || t.name === "Gauntlet of Might" && n === "All red creatures gain +1/+1 and all mountains provide an extra red mana when tapped." ? { centeredWidth: 390, centeredDx: -6.5 } : t.name === "Howl from Beyond" && n === "Target creature gains +X/+0 until end of turn." || r === "lea" && t.name === "Twiddle" && n === "Caster may tap or untap any one land, creature, or artifact in play." ? { centeredDx: -6.5, centeredDy: -16 } : t.name === "Black Vise" && n === "If opponent has more than four cards in hand during upkeep, black vise does 1 damage to opponent for each card in excess of four." ? { shortRegularDy: -16 } : r === "leb" && t.name === "Birds of Paradise" && n === "Flying Tap to add one mana of any color to your mana pool. This tap may be played as an interrupt." ? { centeredWidth: 374, regularDx: 10, regularDy: 12 } : {};
}
function sc(t, e, r) {
  t.save(), t.fillStyle = r, t.beginPath(), t.rect(0, 0, T, E), t.rect(...e), t.fill("evenodd"), t.restore();
}
function ac(t, e, [r, n, o, s], a) {
  const u = I();
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
function ic(t) {
  if ((t.layout ?? "normal") !== "normal") return;
  const e = `${t.setCode?.toLowerCase() ?? ""}/${Rt(t)}`;
  if (!(e === "leg/black" && !kt(t)))
    return Object.hasOwn(ys, e) ? ys[e] : void 0;
}
function fn(t, e, r, n, o, s, a) {
  t.save();
  const i = t.getTransform();
  t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0;
  const d = I();
  d.width = t.canvas.width, d.height = t.canvas.height;
  const l = d.getContext("2d");
  if (!l) throw Error("Solid title needs a Canvas2D context");
  l.setTransform(i), l.font = t.font, l.textAlign = t.textAlign, l.textBaseline = t.textBaseline, l.letterSpacing = t.letterSpacing, l.fillStyle = a?.fill ?? `rgb(${s.gray},${s.gray},${s.gray})`, l.fillText(e, r, n, o), s.trim > 0 && (l.globalCompositeOperation = "destination-out", l.lineWidth = s.trim * 2, l.strokeText(e, r, n, o)), t.resetTransform(), t.shadowColor = a?.shadow ?? "#17140f", t.shadowOffsetX = i.a / s.width * s.shadow, t.shadowOffsetY = i.d * s.shadow, t.drawImage(d, 0, 0), t.restore(), d.width = d.height = 0;
}
const lc = {
  arn: { size: 26.75, x: 37.75, y: 42.5, width: 0.995, shadow: 1.25, trim: 0.4, gray: 196 },
  atq: { size: 26.5, x: 38, y: 42.5, width: 1, shadow: 1.25, trim: 0.4, gray: 196 },
  drk: { size: 27.25, x: 37.25, y: 43, width: 1, shadow: 1.5, trim: 0.2, gray: 208 }
};
function wl(t) {
  const e = t.setCode?.toLowerCase();
  if (e !== "arn" && e !== "atq" && e !== "drk" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || t.borderColor && t.borderColor !== "black" || t.legendary || /\b(Legendary|Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", n = t.land ?? /\bLand\b/.test(r), o = t.artifact ?? /\bArtifact\b/.test(r), s = W(t).length;
  if (!(!n && !o && s !== 1 && !(e === "drk" && s === 2)))
    return lc[e];
}
function dc(t, e, r) {
  const n = wl(e);
  if (!n) return !1;
  t.save(), t.translate(n.x, n.y), t.scale(n.width, 1), t.font = `${n.size}px "CardRenderer MTG Goudy", Georgia`;
  const o = Math.max(1, (r - n.x) / n.width);
  return fn(t, e.name, 0, 0, o, n), t.restore(), !0;
}
function uc(t) {
  return Et(t) ? wt(t).title : void 0;
}
function hc(t, e, r) {
  const n = uc(e);
  return n ? (t.save(), t.translate(n.x, n.y), t.scale(n.width, 1), t.font = `${n.size}px "CardRenderer MTG Goudy", Georgia`, fn(t, e.name, 0, 0, Math.max(1, (r - n.x) / n.width), n), t.restore(), !0) : !1;
}
const mc = { size: 22, dx: -3, dy: 0.5, width: 1.02, gray: 224, shadow: 1.5, trim: 0.2 };
function cc(t) {
  return t.setCode?.toLowerCase() === "drk" && !t.frameAssetFamily && wl(t) ? mc : void 0;
}
function gc(t, e, r, n, o, s) {
  const a = cc(e);
  if (!a) return !1;
  t.save(), t.translate(n + a.dx, o + a.dy), t.scale(a.width, 1), t.font = `${a.size}px "CardRenderer MTG MPlantin", Georgia`, t.fillStyle = `rgb(${a.gray},${a.gray},${a.gray})`, t.shadowColor = "#17140f", t.shadowBlur = 0;
  const i = s / a.width;
  return ht(
    t,
    r,
    0,
    0,
    i,
    e.textInk,
    "type",
    () => fn(t, r, 0, 0, i, a, {
      fill: t.fillStyle,
      shadow: t.shadowColor
    })
  ), t.restore(), !0;
}
function fc(t) {
  const e = Fe(t.setCode);
  if (e) return e.type;
  const r = (!t.borderColor || t.borderColor === "black") && !!kt(t);
  return {
    fontSize: r ? 21.7 * 1.03 : 21.7,
    dx: r ? -2.5 : 0,
    dy: 0
  };
}
function pc(t) {
  return Et(t) ? wt(t).type : void 0;
}
function yc(t, e, r, n) {
  const o = pc(e);
  if (!o) return !1;
  t.save(), t.translate(o.x, o.y), t.scale(o.width, 1), t.font = `${o.size}px "CardRenderer MTG MPlantin", Georgia`, t.fillStyle = `rgb(${o.gray},${o.gray},${o.gray})`, t.shadowColor = "#17140f", t.shadowBlur = 0;
  const s = Math.max(1, (n - o.x) / o.width);
  return ht(
    t,
    r,
    0,
    0,
    s,
    e.textInk,
    "type",
    () => fn(t, r, 0, 0, s, o, {
      fill: t.fillStyle,
      shadow: t.shadowColor
    })
  ), t.restore(), !0;
}
function bc(t, e, r, n = !1, o) {
  Sl(
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
function wc(t, e, r, n = !1, o) {
  Sl(
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
function Sl(t, e, r, n, o, s) {
  e.forEach((a, i) => {
    const { size: d } = n, l = n.right - (e.length - 1 - i) * (n.pitch + (s?.spacing ?? 0)) - d / 2, u = n.centerY - d / 2;
    if (a !== "W" || o || r.originalManaGlyphs?.has("W")) {
      et(t, a, l, u, d, r, !1, s);
      return;
    }
    Go(
      t,
      l,
      u,
      d,
      n.whiteSize,
      r.manaColors?.W,
      gr(s, a),
      r.manaInkColor
    );
  });
}
const vl = (t, e, r, n, o, s, a = !1, i) => {
  if (e !== "W" || s.originalManaGlyphs?.has("W"))
    return et(t, e, r, n, o, s, a, i);
  Go(
    t,
    r,
    n,
    o,
    o * 0.87,
    s.manaColors?.W,
    gr(i, e),
    s.manaInkColor
  );
};
function Sc(t) {
  return ["4ed", "5ed"].includes(t.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(t.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function uo(t) {
  const e = String(t.toughness ?? ""), r = t.wordingMode !== "oracle" && t.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(e) ? `(${e})` : e;
  return `${t.power ?? ""}/${r}`;
}
function vc(t) {
  const e = t.setCode?.toLowerCase(), r = e === "4ed" && !/\bLand\b/.test(t.typeLine ?? "");
  if (e !== "mir" && e !== "tmp" && !r) return null;
  const n = W(t);
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
const ss = (t, e, r, n, o, s) => {
  if (e !== "T") return et(t, e, r, n, o, s);
  Cl(t, r, n, o, "", 0.88);
}, ho = (t, e, r, n, o, s) => {
  if (e !== "T") return vl(t, e, r, n, o, s);
  Cl(t, r, n, o, "", 0.8);
}, Cc = (t, e, r, n, o, s) => {
  if (e !== "T") return et(t, e, r, n, o, s);
  ss(t, e, r, n, o, s);
}, kc = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function Tc(t) {
  const e = t?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(e) || ["lea", "leb", "2ed", "arn", "atq"].includes(e) ? ho : e === "4ed" ? Cc : kc.has(e) ? ss : et;
}
function Cl(t, e, r, n, o, s) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = "#c9c4be", t.beginPath(), t.arc(e + n / 2, r + n / 2, n / 2, 0, Math.PI * 2), t.fill(), t.fillStyle = "#0d0f0f", t.font = `${n * s}px "CardRenderer MTG Historic Symbols"`, t.textAlign = "left", t.textBaseline = "alphabetic";
  const a = t.measureText(o);
  t.fillText(
    o,
    e + (n - a.actualBoundingBoxLeft - a.actualBoundingBoxRight) / 2 + a.actualBoundingBoxLeft,
    r + (n + a.actualBoundingBoxAscent - a.actualBoundingBoxDescent) / 2
  ), t.restore();
}
function Mc(t, e, r, n, o, s, a, i = [0, 0, 1, 1], d = null, l = "low") {
  const u = I(), h = Math.ceil(a * 2) + 1;
  u.width = Math.ceil(o * 2) + h * 2, u.height = Math.ceil(s * 2) + h * 2;
  const m = u.getContext("2d");
  m.imageSmoothingQuality = l, m.drawImage(
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
  if (m.fillStyle = "#17140f", d) {
    const c = m.createLinearGradient(h, h, h + o * 2, h);
    d.forEach((g, f) => c.addColorStop(f / 2, g)), m.fillStyle = c;
  }
  m.fillRect(0, 0, u.width, u.height), t.drawImage(u, r - h / 2, n - h / 2, u.width / 2, u.height / 2), t.restore(), u.width = u.height = 0;
}
function xc(t, e, r) {
  t.save(), t.textAlign = "left", t.textBaseline = "alphabetic", X(t, e, "artist", () => {
    e.artist && (t.fillStyle = "#f2eee3", t.shadowColor = "#000", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, t.font = `${r.artistSize}px "CardRenderer MTG MPlantin", Georgia`, t.fillText(`Illus. ${e.artist}`, r.artistX, r.artistBaseline, 338));
  }), t.shadowColor = "transparent", t.fillStyle = r.legalLight ? "#f2eee3" : "#17140f", t.font = `${r.legalSize}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && X(
    t,
    e,
    "legal",
    () => t.fillText(r.legalText, r.artistX, r.legalBaseline, 380)
  ), t.restore();
}
function ga(t, e, r, n) {
  const o = r.replaceAll("ō", "o");
  if (t[e](o, 0, 0, n), o === r) return;
  const s = t.measureText(o).width, a = Math.min(1, n / s), i = t.measureText("o").width, d = t.measureText("ˉ").width, l = -(t.textAlign === "right" ? s * a : t.textAlign === "center" ? s * a / 2 : 0), u = t.textAlign;
  t.textAlign = "left";
  try {
    for (let h = 0; h < r.length; h++)
      if (r[h] === "ō") {
        const m = t.measureText(o.slice(0, h + 1)).width;
        t[e]("ˉ", l + (m - i + (i - d) / 2) * a, 0, d * a);
      }
  } finally {
    t.textAlign = u;
  }
}
function Rc(t, e, r, n) {
  const o = I();
  o.width = t.canvas.width, o.height = t.canvas.height, t.save();
  try {
    const s = t.getTransform(), a = o.getContext("2d");
    if (!a) throw Error("Footer ink needs a Canvas2D context");
    a.setTransform(s), a.font = t.font, a.textAlign = t.textAlign, a.textBaseline = t.textBaseline, a.letterSpacing = t.letterSpacing, a.fillStyle = t.fillStyle, ga(a, "fillText", e, r), n.trim > 0 && (a.globalCompositeOperation = "destination-out", a.lineWidth = n.trim * 2, ga(a, "strokeText", e, r)), t.resetTransform(), t.shadowBlur = 0, t.shadowOffsetX = s.a / n.width * n.shadow, t.shadowOffsetY = s.d * n.shadow, t.drawImage(o, 0, 0);
  } finally {
    t.restore(), o.width = o.height = 0;
  }
}
function Ac(t) {
  const e = Et(t);
  if (!e) return;
  const r = t.setCode.toLowerCase(), n = wt(t).footer, o = ["B", "G", "A"].includes(e.material ?? "") || r === "fem" && t.name === "Ebon Stronghold";
  return {
    ...n,
    legalGray: o ? n.legal.lightGray : n.legal.darkGray,
    // Reviewed printing defaults, never a year inferred from an arbitrary set.
    legalText: t.legalText === void 0 ? `© ${r === "fem" ? "1994" : "1995"} Wizards of the Coast, Inc. All rights reserved.` : t.legalText
  };
}
function Ec(t, e) {
  const r = Ac(e);
  if (!r) return !1;
  const n = (o, s) => {
    const a = r[o];
    t.save();
    try {
      t.translate(a.x, a.y), t.scale(a.width, 1), t.font = `${a.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = o === "stats" ? "right" : "left", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
      const i = "gray" in a ? a.gray : r.legalGray;
      t.fillStyle = `rgb(${i},${i},${i})`, t.shadowColor = o === "legal" ? "transparent" : "#17140f", t.shadowBlur = 0;
      const d = o === "stats" ? 132 / a.width : Math.max(1, ((o === "artist" ? 386 : 445) - a.x) / a.width), l = () => Rc(t, s, d, a);
      o === "stats" ? ht(t, s, 0, 0, d, e.textInk, "stats", l) : l();
    } finally {
      t.restore();
    }
  };
  return e.power != null && e.toughness != null && n("stats", uo(e)), e.artist && X(t, e, "artist", () => n("artist", `Illus. ${e.artist}`)), r.legalText && X(t, e, "legal", () => n("legal", r.legalText)), !0;
}
const Lc = {
  size: 18,
  x: 49.25,
  width: 1.04,
  shadow: 2,
  inset: 0.1,
  align: "left",
  maximum: 338
}, Bc = {
  size: 27.8,
  x: 452.25,
  width: 0.99,
  shadow: 1.75,
  inset: 0.3,
  align: "right",
  maximum: 68
};
function fa(t, e, r, n) {
  const o = I();
  o.width = t.canvas.width, o.height = t.canvas.height;
  const s = o.getContext("2d");
  if (!s) throw Error("Legends footer needs a Canvas2D context");
  const a = t.getTransform();
  s.setTransform(a), s.translate(r.x, 640), s.scale(r.width, 1), s.font = `${r.size}px "CardRenderer MTG MPlantin", Georgia`, s.textAlign = r.align, s.textBaseline = "alphabetic", s.letterSpacing = "0px", s.fillStyle = "#f2eee3", ht(s, e, 0, 0, r.maximum / r.width, n), s.globalCompositeOperation = "destination-out", s.lineWidth = 2 * r.inset, s.strokeText(e, 0, 0, r.maximum / r.width), t.save(), t.resetTransform(), t.shadowColor = "#17140f", t.shadowBlur = 0, t.shadowOffsetX = t.shadowOffsetY = r.shadow * a.a, t.drawImage(o, 0, 0), t.restore(), o.width = o.height = 0;
}
function Fn(t, e) {
  return !kt(e) || e.borderColor && e.borderColor !== "black" ? !1 : (e.artist && fa(t, `Illus. © 1994 ${e.artist}`, Lc), e.power != null && e.toughness != null && fa(t, `${e.power}/${e.toughness}`, Bc, e.textInk), !0);
}
function Ic(t, e) {
  return e.printingElements?.artist ? Fn(t, { ...e, artist: null }) ? (X(t, e, "artist", () => {
    Fn(t, { ...e, power: null, toughness: null });
  }), !0) : !1 : Fn(t, e);
}
function Oc(t, e) {
  const r = e.setCode?.toLowerCase();
  if (!["usg", "ulg", "uds"].includes(r ?? "") || (e.layout ?? "normal") !== "normal")
    return !1;
  t.save(), t.textAlign = "center", t.textBaseline = "alphabetic", t.shadowColor = "#17140f", t.shadowOffsetX = t.shadowOffsetY = 1.5 * t.getTransform().a, t.fillStyle = "#f2eee3", t.font = '19px "CardRenderer MTG MPlantin", Georgia';
  const n = e.power != null && e.toughness != null ? 292 : 365;
  X(t, e, "artist", () => {
    e.artist && t.fillText(`Illus. ${e.artist}`, 244, 626, n);
  }), e.power != null && e.toughness != null && (t.shadowColor = "#000b", t.font = '27.8px "CardRenderer MTG MPlantin", Georgia', t.textBaseline = "middle", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, ht(
    t,
    `${e.power}/${e.toughness}`,
    (0.8074 + 0.1367 / 2) * 488,
    (0.895 + 0.043 / 2) * 680,
    0.1367 * 488,
    e.textInk
  )), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.textBaseline = "alphabetic", t.font = '9.5px "CardRenderer MTG MPlantin", Georgia';
  const o = W(e), s = !/\bLand\b/.test(e.typeLine ?? "") && !(o.length === 1 && ["W", "R"].includes(o[0]));
  t.fillStyle = s ? "#f2eee3" : "#17140f";
  const a = r === "usg" ? 1998 : 1999, i = e.collectorTotal === void 0 ? r === "usg" ? 350 : 143 : e.collectorTotal, d = e.collectorNumber?.trim(), l = d && !e.printingElements?.collector?.hidden && (e.legalText === void 0 || e.collectorTotal !== void 0) ? `${d}${i ? "/" + i : ""}` : "", u = e.printingElements?.legal?.hidden ? null : e.legalText === void 0 ? `©1993–${a} Wizards of the Coast, Inc.` : e.legalText, h = [u, l].filter(Boolean).join(" ");
  if (!e.printingElements?.legal?.offset && !e.printingElements?.collector?.offset)
    h && t.fillText(h, 244, 640, 365);
  else if (h) {
    const m = t.measureText(h).width, c = Math.min(1, 365 / Math.max(1, m));
    t.translate(244, 640), t.textAlign = "left";
    const g = (f, y) => {
      t.save(), t.scale(c, 1), t.fillText(f, y, 0), t.restore();
    };
    u && X(t, e, "legal", () => g(u, -m / 2)), l && X(
      t,
      e,
      "collector",
      () => g(l, m / 2 - t.measureText(l).width)
    );
  }
  return t.restore(), !0;
}
function $c(t, e, r) {
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
function Gc(t, e) {
  const r = 52.053333333333335, n = 1255 / 2100 * 680, o = 1346 / 1500 * 488, s = 1861 / 2100 * 680, a = 17 / 1500 * 488, i = 17 / 2100 * 680, d = (u) => {
    t.moveTo(...u[0]);
    for (const h of u.slice(1)) t.lineTo(...h);
    t.closePath();
  };
  t.save();
  const l = t.filter;
  t.filter = "none", t.fillStyle = "#00000047", t.beginPath(), d([
    [r, n],
    [o, n],
    [o - a, n + i],
    [r + a, n + i]
  ]), d([
    [o, n],
    [o, s],
    [o - a, s - i],
    [o - a, n + i]
  ]), t.fill(), t.beginPath(), d([
    [r, n],
    [r + a, n + i],
    [r + a, s - i],
    [r, s]
  ]), d([
    [r, s],
    [r + a, s - i],
    [o - a, s - i],
    [o, s]
  ]), t.clip(), t.filter = `${l === "none" ? "" : l + " "}brightness(1.35)`, t.drawImage(e, 0, 0, 488, 680), t.restore();
}
const at = {
  get fem() {
    return Ua("fem").setSymbols.default;
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
}, Pc = {
  W: { ...at.por, right: 436.75, centerY: 389.75 },
  U: { ...at.por, right: 436.5, centerY: 392.75 },
  R: { ...at.por, right: 433.75, centerY: 392 },
  G: { ...at.por, right: 434, centerY: 390.75 }
}, Wc = {
  all: {
    U: { ...at.all, right: 427.5, centerY: 393.25 },
    W: { ...at.all, right: 427.25, centerY: 392.75 }
  },
  mir: {
    G: { ...at.mir, right: 437, centerY: 390.25 },
    W: { ...at.mir, right: 437.75, centerY: 389.25 }
  },
  sth: {
    G: { ...at.sth, right: 434, centerY: 391 },
    R: { ...at.sth, right: 433.5, centerY: 391.75 },
    W: { ...at.sth, right: 435.25, centerY: 389.25 }
  },
  tmp: {
    U: { ...at.tmp, right: 433, centerY: 392.75 },
    W: { ...at.tmp, right: 433.25, centerY: 389.5 }
  },
  vis: {
    W: { ...at.vis, right: 437.5, centerY: 389.25 }
  },
  wth: {
    W: { ...at.wth, right: 435.75, centerY: 389.75 }
  },
  hml: {
    R: { ...at.hml, right: 437.75, centerY: 393.5 }
  },
  por: Pc
};
function Fc(t) {
  const e = t.setCode?.toLowerCase() ?? "";
  if (t.setSymbol) return null;
  if (Et(t)) {
    const n = wt(t)?.setSymbols, o = e === "chr" ? Va(t.name) : "default", s = o && n?.[o] || n?.default;
    if (s) return s;
  }
  if (!Object.hasOwn(at, e)) return null;
  const r = W(t);
  return r.length === 1 && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") ? Wc[e]?.[r[0]] ?? at[e] : at[e];
}
function _c(t) {
  return t.setSymbol || t.setCode?.toLowerCase() !== "exo" ? null : t.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : t.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const mo = {
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
}, kl = (t) => `${t}#opaque-print-details-v1`, Uc = (t) => Object.keys(mo).some((e) => t === `${V.KEYRUNE_ROOT}/${e}.svg`);
async function jc(t, e) {
  const r = Object.keys(mo).find((u) => t === `${V.KEYRUNE_ROOT}/${u}.svg`);
  if (!r) return null;
  const n = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), o = n.documentElement, s = n.querySelectorAll("path"), a = s[0]?.getAttribute("d") ?? "", i = a.match(/M[^M]*/g) ?? [], d = mo[r];
  if (o.localName !== "svg" || n.querySelector("parsererror") || s.length !== 1 || i.length !== d.count || i.some((u) => /m/.test(u) || !/[zZ]\s*$/.test(u)))
    throw new Error(`Unexpected pinned ${r} symbol paths.`);
  const l = n.createElementNS("http://www.w3.org/2000/svg", "path");
  return l.setAttribute("d", d.white.map((u) => i[u]).join("")), l.setAttribute("fill", "#fff"), o.replaceChildren(l), new Blob([new XMLSerializer().serializeToString(n)], { type: "image/svg+xml" });
}
const Dc = "symbol-svg-v6", Nc = { "leg-c": { sha256: "289e33fd164ee77b5b5d5982b299f485ca668c576368ec796be3b8260de592fd", recipe: "remove-outer-white", pathCount: 7 }, "drk-c": { sha256: "d83257eede46a709ad6f6bf8800928e5954121a75fa8511a255bef4caa382ffa", recipe: "remove-outer-white", pathCount: 2, fill: "#221c13", outline: { stroke: "#505050", width: 24 } }, "6ed-u": { sha256: "631daa24b47c80669e3b27044d9213faa69e9207940a5a7283d67ab7db54e65b", recipe: "white-outer-rim" }, "6ed-r": { sha256: "a6175526471668969615caecff1070f8d9d119ff69b03fc6c03af1ad5fc0f198", recipe: "white-outer-rim" }, "m15-u": { sha256: "bfd962ff9640a846e5690d76c0fe88324e9d49cb6771744b5ab8f34f7afe7362", recipe: "m15" }, "m15-r": { sha256: "933756b97cebe7389ff7cee219a34b1ac13bc504743a2be037a286ee5ffc4b0d", recipe: "m15" }, "m15-m": { sha256: "6e9f87473f1ed8ecb05647fbde6f13e22faeab18fe56b8f76cfa1759bb4210e7", recipe: "m15" }, "8ed-u": { sha256: "6c20e8da28fdd5cdb030814e5c1339978f276c77f4ad9d99ca816adb8d970880", recipe: "8ed" }, "8ed-r": { sha256: "eccde74c56b4810434ecdf4e99206046d6970ea601e4fed2f73eb2ee855053a2", recipe: "8ed" }, "9ed-u": { sha256: "acb7ea7f3422f50dca2aef4e07aa3977aa1641ff2cb54f6eb64ae1bc17abbf53", recipe: "9ed" }, "9ed-r": { sha256: "c1cbcc1aea4f032c5f2ccf7f1d63073813bf9c6f050ba2f5385170ff3deca8a5", recipe: "9ed" }, "7ed-u": { sha256: "94c67d433ba3012f3aa1c494a7ef0ae1e7de58ce4614dfd50ee8f52de527d7e4", recipe: "white-outer-rim" }, "7ed-r": { sha256: "8b30917e85b2c9c3549bfa6c2f62261801df33ff7debcc138bf89c4a9ba9689f", recipe: "white-outer-rim" } }, as = {
  revision: Dc,
  sources: Nc
}, pa = `${P}/img/setSymbols/official/`, ya = as.sources;
function is(t) {
  if (!t.startsWith(pa) || !t.endsWith(".svg")) return;
  const e = t.slice(pa.length, -4);
  return Object.hasOwn(ya, e) ? ya[e] : void 0;
}
function zc(t) {
  return !!is(t);
}
async function Yc(t, e) {
  const r = is(t);
  if (!r) return e;
  const n = await e.arrayBuffer();
  if ([...new Uint8Array(await crypto.subtle.digest("SHA-256", n))].map((h) => h.toString(16).padStart(2, "0")).join("") !== r.sha256) throw Error(`Unexpected pinned symbol checksum: ${t}`);
  const a = new DOMParser().parseFromString(new TextDecoder().decode(n), "image/svg+xml"), i = a.documentElement, d = [...i.querySelectorAll("path")], l = i.querySelector("linearGradient, radialGradient");
  if (i.localName !== "svg" || a.querySelector("parsererror") || !l && r.recipe !== "remove-outer-white")
    throw Error(`Unexpected pinned symbol SVG: ${t}`);
  const u = (h, m) => {
    for (const [c, g] of Object.entries(m)) h.setAttribute(c, g);
  };
  if (r.recipe === "remove-outer-white") {
    if (d.length !== r.pathCount || !/fill:\s*#ffffff\b/i.test(d[0].getAttribute("style") ?? ""))
      throw Error("Unexpected monochrome symbol topology.");
    d[0].remove(), r.fill && d[1].setAttribute("fill", r.fill);
  } else if (r.recipe === "white-outer-rim") {
    if (d.length !== 3) throw Error("Unexpected rimmed symbol topology.");
    d[0].setAttribute("fill", "#fff");
  } else if (r.recipe === "m15") {
    if (d.length !== 6) throw Error("Unexpected M15 path topology.");
    u(d[0], { fill: `url(#${l.id})`, stroke: "#000", "stroke-width": "8" });
    for (const h of d.slice(1)) h.setAttribute("fill", "#000");
  } else if (r.recipe === "8ed" || r.recipe === "9ed") {
    if (d.length !== 4) throw Error("Unexpected numeric shield path topology.");
    const h = d[2], m = h.parentElement?.getAttribute("transform");
    if (!m) throw Error("Missing numeric shield coordinate transform.");
    if (d[0].setAttribute("fill", "#000"), d[3].setAttribute("fill", "#000"), r.recipe === "9ed") {
      const c = l.cloneNode(!0);
      u(c, {
        id: "glint-root-metal",
        gradientTransform: `${m} ${l.getAttribute("gradientTransform") ?? ""}`
      }), l.after(c), u(d[3], {
        stroke: "url(#glint-root-metal)",
        "stroke-width": "12",
        "paint-order": "stroke fill"
      });
    }
  } else throw Error(`Unknown symbol SVG patch recipe: ${r.recipe}`);
  return i.setAttribute("data-card-glint-patch", as.revision), new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" });
}
const Tl = (t) => `${t}#printed-outline-v1`;
async function qc(t, e) {
  const r = is(t)?.outline;
  if (!r) return null;
  const n = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), o = n.documentElement, s = [...o.querySelectorAll("path")];
  if (o.localName !== "svg" || n.querySelector("parsererror") || o.getAttribute("data-card-glint-patch") !== as.revision || s.length !== 1)
    throw Error(`Unexpected prepared symbol outline: ${t}`);
  const a = s[0];
  return a.setAttribute("stroke", r.stroke), a.setAttribute("stroke-width", String(r.width)), a.setAttribute("stroke-linejoin", "round"), a.setAttribute("paint-order", "stroke fill"), new Blob([new XMLSerializer().serializeToString(n)], { type: "image/svg+xml" });
}
function Hc(t, e, r, n, o, s) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0;
  const a = I();
  a.width = t.canvas.width, a.height = t.canvas.height;
  const i = a.getContext("2d");
  if (!i) throw Error("Retro lettering needs a Canvas2D context");
  const d = t.getTransform();
  i.font = t.font, i.textAlign = t.textAlign, i.textBaseline = t.textBaseline, i.letterSpacing = t.letterSpacing, t.resetTransform();
  for (const [l, u, h] of [
    [0, s, "#f2eee3"],
    [s, 0, "#17140f"]
  ])
    i.resetTransform(), i.clearRect(0, 0, a.width, a.height), i.setTransform(d), i.globalCompositeOperation = "source-over", i.fillStyle = h, i.fillText(e, r + l, n + l, o), i.globalCompositeOperation = "destination-out", i.fillText(e, r + u, n + u, o), t.drawImage(a, 0, 0);
  a.width = a.height = 0, t.restore();
}
function Tr(t, e, r, n, o, s, a = "#ababab", i, d = "stats") {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, ht(t, e, r + s, n + s, o, i, d, () => {
    t.fillStyle = "#17140f", t.fillText(e, r + s, n + s, o);
  }), t.fillStyle = a, ht(t, e, r, n, o, i, d), t.restore();
}
const Xc = {
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
function Ml() {
  return Xc;
}
function _n(t, e, r, n, o) {
  const s = Ml()[r];
  t.save(), t.translate(s.x, s.y), t.scale(s.width, 1), t.font = `${s.size}px "CardRenderer MTG ${r === "title" ? "Goudy" : "MPlantin"}", Georgia`, t.textAlign = "left", t.textBaseline = r === "artist" ? "alphabetic" : "middle", Tr(
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
function Jc(t, e, r, n) {
  const o = Ml(), s = e.wordingMode === "oracle" ? 10 : 15, a = r.reduce((l, u) => l + u.runs.reduce((h, m) => h + m.text.length, 0), 0) > 150, i = (l) => ({
    leading: l.leading,
    paragraphGap: l.paragraph,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    centerOffset: l.offset
  });
  if (e.rulesAlignment?.mode !== "left") {
    const l = Ze(
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
    if (l)
      return a ? $(
        t,
        r.map((u) => ({ ...u, align: "center" })),
        o.dual,
        o.dual.size,
        Math.min(s, o.dual.size),
        { ...i(o.dual), balanceLines: !0 }
      ) : l;
  }
  const d = a ? o.dual.size : o.basic.size;
  return $(t, r, o.dual, d, Math.min(s, d), i(o.dual));
}
function Kc(t) {
  return ["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "");
}
function Vc(t, e, r) {
  t.save(), t.font = '22.5px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.textBaseline = "alphabetic", Tr(
    t,
    `Illus. © ${e}`,
    49,
    Fe(r)?.artistBaseline ?? 631,
    338,
    1.25,
    Fe(r)?.artistInk
  ), t.restore();
}
function Zc(t, e, r, n, o, s) {
  t.save();
  const a = I();
  try {
    const i = t.getTransform();
    t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = "#17140f", t.fillText(e, r + s.shadow / s.width, n + s.shadow, o), a.width = t.canvas.width, a.height = t.canvas.height;
    const d = a.getContext("2d");
    if (!d) throw Error("Artist ink needs a Canvas2D context");
    d.setTransform(i), d.font = t.font, d.textAlign = t.textAlign, d.textBaseline = t.textBaseline, d.letterSpacing = t.letterSpacing, d.fillStyle = "#f2eee3", d.fillText(e, r, n, o), s.trim > 0 && (d.globalCompositeOperation = "destination-out", d.globalAlpha = 0.65, d.lineWidth = s.trim * 2, d.strokeText(e, r, n, o)), t.resetTransform(), t.drawImage(a, 0, 0);
  } finally {
    a.width = a.height = 0, t.restore();
  }
}
const ba = {
  arn: { size: 22, x: 49.75, y: 638.5, width: 1.02, edge: 1.25 },
  atq: { size: 21, x: 48.75, y: 638.5, width: 1.075, edge: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.5, width: 1.045, edge: 1.25 }
}, Qc = {
  arn: { size: 22, x: 49.25, y: 638.5, width: 1.025, trim: 0.8, shadow: 1.5 },
  atq: { size: 21, x: 48.5, y: 638.5, width: 1.075, trim: 0.75, shadow: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.25, width: 1.045, trim: 0.55, shadow: 1.5 }
};
function xl(t) {
  const e = t.setCode?.toLowerCase();
  if (e !== "arn" && e !== "atq" && e !== "drk" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || t.borderColor && t.borderColor !== "black" || t.legendary || /\b(Legendary|Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", n = t.land ?? /\bLand\b/.test(r), o = t.artifact ?? /\bArtifact\b/.test(r), s = W(t).length;
  if (!(!n && !o && s !== 1 && !(e === "drk" && s === 2)))
    return Qc[e];
}
function tg(t, e) {
  const r = e.setCode?.toLowerCase();
  if (!e.artist || r !== "arn" && r !== "atq" && r !== "drk") return !1;
  const n = xl(e), o = n ?? ba[r];
  t.save(), t.translate(o.x, o.y), t.scale(o.width, 1), t.font = `${o.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = "left", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
  const s = `Illus. © ${r === "drk" ? "1994 " : ""}${e.artist}`;
  return n ? Zc(t, s, 0, 0, 338 / o.width, n) : Hc(t, s, 0, 0, 338 / o.width, ba[r].edge), t.restore(), !0;
}
const eg = {
  arn: { x: 452, y: 638, size: 26, width: 1.03, trim: 0.9, shadow: 2, shadowTrim: 0.4 },
  atq: { x: 452.5, y: 639, size: 27.5, width: 0.97, trim: 0.9, shadow: 1.5, shadowTrim: 0.2 },
  drk: { x: 452, y: 640, size: 27, width: 1.01, trim: 0.8, shadow: 1.25, shadowTrim: 0.3 }
};
function rg(t) {
  const e = t.setCode?.toLowerCase();
  if (!(e !== "arn" && e !== "atq" && e !== "drk" || t.power == null || t.toughness == null || !xl(t)))
    return eg[e];
}
function ng(t, e) {
  const r = rg(e);
  if (!r) return !1;
  t.save();
  try {
    t.translate(r.x, r.y), t.scale(r.width, 1), t.font = `${r.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = "right", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
    const n = `${e.power}/${e.toughness}`.replaceAll("-", "–");
    og(t, n, 132 / r.width, r, e.textInk);
  } finally {
    t.restore();
  }
  return !0;
}
function og(t, e, r, n, o) {
  const s = I();
  t.save();
  try {
    s.width = t.canvas.width, s.height = t.canvas.height;
    const a = s.getContext("2d");
    if (!a) throw Error("Stats ink needs a Canvas2D context");
    const i = t.getTransform();
    a.font = t.font, a.textAlign = t.textAlign, a.textBaseline = t.textBaseline, a.letterSpacing = t.letterSpacing, t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.resetTransform();
    for (const [d, l, u] of [
      [n.shadow, n.shadowTrim, "#17140f"],
      [0, n.trim, "#f2eee3"]
    ]) {
      a.resetTransform(), a.clearRect(0, 0, s.width, s.height), a.setTransform(i), a.globalAlpha = 1, a.globalCompositeOperation = "source-over", a.fillStyle = u;
      const h = d / n.width;
      ht(a, e, h, d, r, o, "stats", () => {
        d && (a.fillStyle = u), a.fillText(e, h, d, r);
      }), l > 0 && (a.globalCompositeOperation = "destination-out", a.globalAlpha = 0.65, a.lineWidth = l * 2, a.strokeText(e, h, d, r)), t.drawImage(s, 0, 0);
    }
  } finally {
    s.width = s.height = 0, t.restore();
  }
}
const Un = {
  centered: { left: 10.5, right: -2.5, y: -5, size: 0.5, width: 0.975, leading: -0.5 },
  regular: { left: 10.5, right: -1, y: -2, size: 0, width: 1.005, leading: -0.5 },
  long: { left: 10.5, right: -2, y: 9.5, size: 0, width: 0.99, leading: -0.25 }
};
function Rl(t, e, r, n = 0) {
  return ["lea", "leb"].includes(e.setCode?.toLowerCase() ?? "") ? Al(t, e, r, n) : r;
}
function Al(t, e, r, n = 0) {
  if (!r) return r;
  const o = dr(r);
  if (!o || !o.paragraphs.length) return r;
  const s = o.paragraphs, a = s.every((y) => y.align === "center"), i = a ? r.lines.length >= 5 && r.size >= 30 ? Un.long : Un.centered : s.some((y) => y.align === "center") || r.size < 19 ? null : Un.regular;
  if (!i) return r;
  const d = r.size + i.size, l = $(
    t,
    s,
    {
      x: 0,
      y: 0,
      width: (r.width - i.left - i.right + (a ? 0 : n)) / i.width,
      height: 200
    },
    d,
    d,
    {
      ...o.typography,
      leading: o.typography.leading + i.leading / d,
      flavorSeparator: r.separators.length > 0
    }
  ), u = (r.x + i.left) / i.width, h = r.top + i.y - l.top, m = {
    ...l,
    x: u,
    top: l.top + h,
    horizontalScale: i.width,
    lines: l.lines.map((y) => ({
      ...y,
      x: (y.x ?? l.x) + u,
      baseline: y.baseline + h,
      inkBounds: [y.inkBounds[0] + u, y.inkBounds[1] + h, y.inkBounds[2], y.inkBounds[3]]
    })),
    separators: l.separators.map((y) => y + h)
  }, c = e.wordingMode === "oracle" ? 428 : Math.min(412, r.top - 1), g = e.wordingMode === "oracle" ? 590 : 600;
  return l.overflow || m.lines.some(
    ({ inkBounds: [y, b, p, w] }) => b < c || b + w > g || y * i.width < 48 || (y + p) * i.width > 448
  ) ? r : m;
}
function sg(t, e, r) {
  return !["lea", "leb"].includes(e.setCode?.toLowerCase() ?? "") || !r ? r : e.wordingMode === "oracle" ? Rl(t, e, r) : ag(t, e, r);
}
function ag(t, e, r, n = {}) {
  if (!dr(r)) throw Error("Missing native typography request");
  const s = Me({
    rulesText: e.rulesText ?? "",
    rulesParagraphs: e.rulesParagraphs
  }), a = e.rulesAlignment?.mode === "left" ? s.map((p) => p.role === "rules" ? { ...p, align: "left" } : p) : s, i = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? a : a;
  n = { ...oc(e, i), ...n };
  const d = i.reduce(
    (p, w) => p + w.runs.reduce((S, v) => S + v.text.length, 0),
    0
  ), [, l, , u] = xt(dn(e).rules), h = {
    leading: 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1
  }, m = n.forceSmall ?? nc(e, i);
  let c;
  if (!m && d <= (n.largeMaximum ?? 117) && e.rulesAlignment?.mode !== "left") {
    const p = a.map((S) => ({ ...S, align: S.align ?? "center" })), w = $(
      t,
      p,
      {
        x: 70,
        y: l - 6,
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
        const S = $(
          t,
          p,
          { x: 70, y: l - 6, width: n.centeredWidth ?? 348, height: u - 8 },
          32.5,
          32.5,
          { ...h, leading: 1.1, balanceLines: !0, centerOffset: 0 }
        );
        !S.overflow && S.lines.length <= 5 && (c = S);
      }
  }
  if (c || (m || d > (n.mediumMaximum ?? 274) ? c = r.size < 19 ? r : $(
    t,
    a,
    { x: 70, y: l + 4, width: 346, height: u + 8 },
    15.5,
    15.5,
    { ...h, leading: 1.25, centerOffset: -18 }
  ) : c = r.size >= 19 && r.size < 30 ? r : $(
    t,
    a,
    { x: 70, y: l + 4, width: 346, height: u - 8 },
    n.mediumSize ?? 22.5,
    19,
    { ...h, centerOffset: -10 }
  )), c.overflow && (c = r), c.size >= 19) {
    const p = dr(c);
    if (!p) throw Error("Missing selected typography request");
    const w = p.paragraphs.every((A) => A.align === "center"), S = w && c.size >= 30 ? n.centeredWidth : void 0, v = !w && c.size < 30 ? n.mediumSizeDelta : void 0;
    if (S !== void 0 || v) {
      const A = c.size + (v ?? 0), F = $(
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
      F.overflow || (c = F);
    }
    const C = n.regularWidthDelta ?? (d < 180 || e.setCode?.toLowerCase() === "leb" ? 8 : 0), k = n.transferAlphaModel ? Al(t, e, c, C) ?? c : Rl(t, e, c, C) ?? c, x = w ? n.centeredDx ?? 0 : n.regularDx ?? 0, M = w ? n.centeredDy ?? 0 : n.regularDy !== void 0 ? n.regularDy : c.lines.length <= 5 ? n.shortRegularDy ?? 0 : 0;
    if (!x && !M) return k;
    const R = {
      ...k,
      x: k.x + x / (k.horizontalScale ?? 1),
      top: k.top + M,
      lines: k.lines.map((A) => ({
        ...A,
        x: (A.x ?? k.x) + x / (k.horizontalScale ?? 1),
        baseline: A.baseline + M,
        inkBounds: [
          A.inkBounds[0] + x / (k.horizontalScale ?? 1),
          A.inkBounds[1] + M,
          A.inkBounds[2],
          A.inkBounds[3]
        ]
      }))
    }, L = e.wordingMode === "oracle" ? 428 : 405, G = e.wordingMode === "oracle" ? 590 : 602;
    return R.lines.some(
      (A) => A.inkBounds[1] < L || A.inkBounds[1] + A.inkBounds[3] > G
    ) ? k : R;
  }
  const g = dr(c);
  if (!g) throw Error("Missing selected early typography request");
  const f = $(
    t,
    g.paragraphs,
    { ...g.bounds, x: g.bounds.x + 10.5, width: g.bounds.width - 10.5 },
    c.size,
    c.size,
    { ...g.typography, textWidth: n.denseWidth ?? 0.98 }
  );
  if (f.overflow) return c;
  const b = Math.max(g.bounds.y, c.top + (c.height - f.height) / 2 - 5) - f.top;
  return {
    ...f,
    top: f.top + b,
    lines: f.lines.map((p) => ({
      ...p,
      baseline: p.baseline + b,
      inkBounds: [p.inkBounds[0], p.inkBounds[1] + b, p.inkBounds[2], p.inkBounds[3]]
    }))
  };
}
function ig(t, e, r) {
  const n = wt(e), o = Et(e)?.material, s = o && n?.rulesAdjustments && {
    ...n.rulesAdjustments.default,
    ...n.rulesAdjustments[o]
  };
  if (!r || !s || !Object.values(s).some(Boolean)) return r;
  const a = dr(r);
  if (!a) throw Error("Selected rules policy does not expose calibration inputs");
  const { bounds: i, typography: d } = a, l = s.leftMargin ?? 0, u = s.rightMargin ?? 0, h = s.vertical ?? 0, m = s.alignment && s.alignment !== "printing" ? a.paragraphs.map((c) => ({ ...c, align: s.alignment })) : a.paragraphs;
  return $(
    t,
    m,
    {
      ...i,
      x: i.x + l,
      y: i.y + h,
      width: i.width - l - u,
      verticalLimits: i.verticalLimits ? [i.verticalLimits[0] + h, i.verticalLimits[1] + h] : void 0
    },
    a.maximumSize + (s.fontSize ?? 0),
    a.minimumSize + (s.fontSize ?? 0),
    {
      ...d,
      textWidth: (d.textWidth ?? 1) + (s.textWidth ?? 0),
      leading: d.leading + (s.leading ?? 0),
      paragraphGap: d.paragraphGap + (s.paragraphGap ?? 0),
      flavorGap: d.flavorGap + (s.flavorGap ?? 0)
    }
  );
}
function lg(t, e, r, n, o) {
  const s = r.centered, a = o.reduce((u, h) => u + h.runs.reduce((m, c) => m + c.text.length, 0), 0), i = e.wordingMode === "oracle" ? Math.min(10, r.minimumSize) : r.minimumSize;
  let d = !1;
  if (s && e.rulesAlignment?.mode !== "left" && a <= s.maxCharacters) {
    const u = $(
      t,
      o,
      r.bounds,
      s.maximumSize,
      s.maximumSize,
      r.typography
    );
    d = !u.overflow && u.lines.length <= s.maxLines;
  }
  const l = n.map((u) => ({
    ...u,
    align: u.align ?? (e.rulesAlignment?.mode === "left" ? "left" : d ? "center" : "left")
  }));
  return $(
    t,
    l,
    r.bounds,
    d ? s.maximumSize : r.maximumSize,
    i,
    r.typography
  );
}
const tn = (t) => t?.runs.map((e) => e.text).join("") ?? "", wa = (t) => t.length === 2 && /^[A-Za-z ,]+$/.test(tn(t[0])) && tn(t[0]).length <= 20;
function dg(t, e, r, n, o, s, a, i) {
  const d = (c) => c.role === "rules" && c.runs.length > 0 && !tn(c).includes(`
`) && c.align === void 0;
  if (!r.length || !r.every(d) || e.some((c) => c.align) || r.length !== 1 && !wa(r)) return null;
  const l = (c) => c.map(
    (g, f) => ({
      ...g,
      align: g.align ?? (g.role === "flavor" || wa(c) && f === 0 && !/^Enchant\b/.test(tn(g)) ? "left" : "center")
    })
  ), u = { x: 70, y: n - 6, width: 348, height: o - 8 }, h = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, m = $(t, l(r), u, s, s, h);
  return m.overflow || m.lines.length > 5 ? null : $(
    t,
    l(e),
    { ...u, verticalLimits: i },
    s,
    a,
    h
  );
}
function Sa(t, e) {
  return !kt(t) || t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode !== "original" ? e : e.map(
    (r) => r.role !== "rules" ? r : {
      ...r,
      runs: r.runs.map((n) => ({
        ...n,
        text: n.text.replace(/\{(\d+|[XYZ])\}/g, "$1")
      }))
    }
  );
}
const en = (t) => t.runs.map((e) => e.text).join(""), ug = (t) => t.role === "rules" && /^[A-Za-z ,]+$/.test(en(t)) && en(t).length <= 28, Ir = { x: 72, y: 413, width: 344, height: 182 }, jn = {
  leading: 1,
  paragraphGap: 0,
  flavorGap: 0,
  flavorOrphans: !1,
  flavorSeparator: !1,
  centerOffset: -14
}, va = (t) => t.map((e, r) => ({
  ...e,
  align: e.role === "rules" && (t.some((n) => n.role === "flavor") || r === 0 && t.length > 1 && ug(e)) ? "left" : "center"
}));
function hg(t, e, r, n) {
  if (!kt(e) || e.borderColor && e.borderColor !== "black") return null;
  const o = e.wordingMode === "oracle" ? 10 : 15, s = n.reduce(
    (d, l) => d + en(l).replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
    0
  );
  if (e.rulesAlignment?.mode !== "left" && s <= (n.every((d) => d.role === "flavor") ? 135 : 130) && n.length > 0 && n.every((d) => d.align === void 0 && !en(d).includes(`
`)) && r.every((d) => d.align === void 0)) {
    const d = {
      ...jn,
      leading: 1.1,
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, l = $(t, va(n), Ir, 27.5, 27.5, d);
    if (!l.overflow && l.lines.length <= 5)
      return $(t, va(r), Ir, 27.5, o, d);
  }
  const i = $(t, r, Ir, 22.25, 21.75, jn);
  return i.overflow ? $(t, r, Ir, 15.5, o, {
    ...jn,
    leading: 1.2
  }) : i;
}
const mg = {
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
}, fe = { x: 70, y: 414, width: 348, height: 184 }, rn = (t) => t.runs.map((e) => e.text).join(""), cg = (t) => t.reduce(
  (e, r) => e + rn(r).replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
  0
), gg = (t) => t.role === "rules" && /^[A-Za-z ,]+$/.test(rn(t)) && rn(t).length <= 28, Ca = (t, e = !1) => t.map((r, n) => ({
  ...r,
  align: !e && r.role === "rules" && (t.some((o) => o.role === "flavor") || n === 0 && t.length > 1 && gg(r)) ? "left" : "center"
}));
function fg(t, e, r, n) {
  const o = e.setCode?.toLowerCase();
  if (o !== "arn" && o !== "atq" && o !== "drk" || e.frameTemplate || e.frameAssetFamily || e.frameStyle === "modern" || e.borderColor && e.borderColor !== "black" || e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return null;
  const s = mg[o], a = e.wordingMode === "oracle" ? 10 : 15, i = {
    textWidth: s.textWidth,
    leading: 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    centerOffset: s.offset
  };
  if (e.rulesAlignment?.mode !== "left" && n.length > 0 && cg(n) <= s.threshold && n.every((u) => u.align === void 0 && !rn(u).includes(`
`)) && r.every((u) => u.align === void 0)) {
    const u = o === "drk", h = u ? { ...fe, x: 76, width: 336 } : fe, m = {
      ...i,
      textWidth: 1,
      leading: 1.1,
      centerOffset: u ? 0 : -14,
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, c = $(
      t,
      Ca(n, u),
      h,
      27.5,
      27.5,
      m
    );
    if (!c.overflow && c.lines.length <= 5) {
      const g = Ca(r, u), f = $(t, g, h, 27.5, a, m);
      return !u || f.lines.length >= 5 ? f : $(t, g, h, 27.5, a, {
        ...m,
        centerOffset: -2 * (5 - f.lines.length)
      });
    }
  }
  if (!$(t, r, fe, 22.5, 21.75, {
    ...i,
    textWidth: 1
  }).overflow) {
    const u = $(
      t,
      r,
      fe,
      s.regular,
      Math.min(s.regular, 21.75 / Math.max(1, s.textWidth)),
      i
    );
    if (o !== "drk") return u;
    const h = u.lines.length <= 5;
    return $(
      t,
      r,
      { ...fe, x: 71, y: h ? 415 : 418, width: h ? 348 : 351 },
      s.regular,
      Math.min(s.regular, 21.75 / Math.max(1, s.textWidth)),
      { ...i, leading: 0.96 }
    );
  }
  return $(
    t,
    r,
    o === "drk" ? { ...fe, x: 73, y: 418, width: 342 } : fe,
    s.compact,
    a,
    {
      ...i,
      textWidth: 1,
      leading: o === "drk" ? 1.22 : s.compactLeading
    }
  );
}
const ka = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: !1,
  flavorSeparator: !1
};
function pg(t, e) {
  return ig(
    t,
    e,
    sg(t, e, yg(t, e))
  );
}
function yg(t, e) {
  if (Mo(e)) return null;
  const [r, n, o, s] = xt(dn(e).rules), a = wo(e), i = Sa(
    e,
    a?.paragraphs ?? Me({
      rulesText: e.rulesText ?? "",
      rulesParagraphs: e.rulesParagraphs
    })
  ), d = e.rulesAlignment?.mode === "left", l = d ? i.map((O) => O.role === "rules" ? { ...O, align: "left" } : O) : i, u = e.rulesAlignment?.mode === "auto" ? Sa(e, e.rulesAlignment.reference ?? l) : l, h = e.wordingMode === "oracle" ? 10 : 15;
  if (bt(e)) return Jc(t, e, l, u);
  const m = hg(t, e, l, u);
  if (m) return m;
  const c = fg(t, e, l, u);
  if (c) return c;
  const g = Et(e), f = g && wt(e)?.body, y = f && (f[g.material] ?? f.default);
  if (y) return lg(t, e, y, l, u);
  const b = e.setCode?.toLowerCase(), p = eh(b) ? { ...ka, flavorAttribution: "right" } : ka, w = ["lea", "leb"].includes(b ?? "") && e.wordingMode === "oracle" ? [428, 590] : void 0, S = ["lea", "leb", "2ed"].includes(b ?? ""), v = S || b === "3ed" && $t(e) === "fourth";
  if (v && !d) {
    const O = dg(
      t,
      l,
      u,
      n,
      s,
      S ? 32.5 : 27.5,
      h,
      w
    );
    if (O) return O;
  }
  const C = u.length === 1 ? u[0] : void 0, k = C?.runs.length === 1 ? C.runs[0] : void 0;
  if (!d && b === "4ed" && $t(e) === "fourth" && u.some((O) => O.role === "flavor")) {
    const O = Ze(
      t,
      l,
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
    if (O) return O;
  }
  const x = !d && b === "4ed" && $t(e) === "fourth" && l.every((O) => O.align === void 0 || O.align === "center") && C?.role === "rules" && (C.align === void 0 || C.align === "center") && k && !k.italic && !k.text.includes(`
`) && k.text.length > 0 && k.text.length <= 100, M = (v || b === "4ed" && $t(e) === "fourth") && (l.length > 1 || l.reduce((O, K) => O + K.runs.reduce((Y, lt) => Y + lt.text.length, 0), 0) > 100), R = M && v, L = M && b === "4ed", G = (b === "mir" || b === "tmp") && !a && !/\b(?:Land|Artifact)\b/.test(e.typeLine ?? "") && W(e).join("") === "W", A = $(
    t,
    x ? l.map((O) => ({ ...O, align: "center" })) : l,
    {
      x: v ? 70 : L || x ? 72 : r,
      y: n + (a ? 1.5 : x ? -6 : L ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: v ? 346 : L || x ? 344 : o + (G ? 10 : 0),
      height: s - 8,
      verticalLimits: w
    },
    a ? 24 : x ? 25 : 22.5,
    h,
    x ? { ...p, leading: 1, balanceLines: !0 } : M ? {
      ...p,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: R ? -10 : 0
    } : p
  ), F = l.reduce(
    (O, K) => O + K.runs.reduce((Y, lt) => Y + lt.text.length, 0),
    0
  );
  return !R || F <= 270 || A.size >= 22 ? A : $(
    t,
    l,
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
function bg(t) {
  return t.setCode?.toLowerCase() === "3ed" && $t(t) === "fourth";
}
function wg(t, e, r, n, o) {
  t.save(), t.font = '26px "CardRenderer MTG Goudy", Georgia', Tr(t, e, 40, n, o + r - 40, 1), t.restore();
}
function Sg(t, e, r, n) {
  t.save(), t.font = '27.25px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "right", Tr(t, e, 451, r + 11, 130, 1.25, "#d4d4d4", n), t.restore();
}
function vg(t, e) {
  t.save(), t.font = '22px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.textBaseline = "alphabetic", Tr(t, `Illus. © ${e}`, 50, 642, 338, 1.25), t.restore();
}
function Cg(t, e, r, n, o) {
  const s = dn(e), a = vc(e), i = bg(e);
  if (o === "artwork") {
    _t(t, e, r, xt(s.art), o);
    return;
  }
  const l = At(e) ?? h0(e);
  t.fillStyle = l, t.fillRect(0, 0, 488, 680), t.fillStyle = "#686050", t.fillRect(24.4, 27.2, 439.2, 625.6), t.fillStyle = "#e5dec5", t.fillRect(...xt(s.rules)), t.fillStyle = "#746b58", t.fillRect(...xt(s.art)), n && t.drawImage(n, 0, 0, 488, 680), _t(t, e, r, xt(s.art), o);
  const u = r.get(Zt(e));
  u && (t.save(), t.filter = m0(e), t.drawImage(u, ...xt(s.frame)), $c(t, u, Zt(e)), Zt(e).endsWith("/seventh/regular/m.png") && Gc(t, u), t.restore());
  const h = Et(e)?.stockWindow ?? Xe(e)?.stockWindow ?? kt(e)?.stockWindow;
  if (h)
    sc(t, xt(h), l);
  else if (bt(e) || ci(e))
    t.save(), t.fillStyle = l, t.beginPath(), t.rect(0, 0, 488, 680), t.rect(24, 29, 440, 623), t.fill("evenodd"), t.strokeStyle = "#30312e", t.lineWidth = 1.5, t.strokeRect(24.5, 29.5, 439, 622), t.restore();
  else if (Rt(e) !== "black" || $t(e) === "fourth") {
    const D = r.get(To(e));
    D && ac(t, D, xt(s.frame), l);
  }
  t.fillStyle = Fe(e.setCode)?.headingInk ?? Ts(e), t.textBaseline = "middle", t.textAlign = "left", t.letterSpacing = "0px";
  const [m, c, g, f] = xt(s.title), y = e.manaSymbols ?? [], b = ic(e), p = b?.[3] ?? a?.manaSize ?? 23.4, w = b ? b[2] - p : a?.manaGap ?? 1.7, S = y.length * (p + w), v = b ? b[0] + p / 2 - S + w : a ? a.manaRight - S + w : m + g - S, C = ["lea", "2ed"].includes(e.setCode?.toLowerCase() ?? ""), k = i || C ? [
    (i ? 435 : 432) - Math.max(0, y.length - 1) * 27 - (i ? 23.4 : 23.9) / 2,
    (i ? 44.5 : 46) - (i ? 23.4 : 23.9) / 2,
    Math.max(0, y.length - 1) * 27 + (i ? 23.4 : 23.9),
    i ? 23.4 : 23.9
  ] : [
    v,
    b ? b[1] - p / 2 : a?.manaTop ?? c + f / 2 - p / 2,
    Math.max(0, S - w),
    p
  ], x = cn(e), M = du(k, y.length, x), R = we(M, x);
  t.shadowColor = "#000b", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, t.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const L = a?.titleX ?? m, G = c + f / 2 + (a?.titleYOffset ?? 0), A = Math.max(
    1,
    y.length ? v + R[0] - k[0] - L - 5 : a?.titleX == null ? g - 5 : m + g - L - 5
  );
  t.save(), t.translate(...ns(e, "retro")), bt(e) ? _n(t, e.name, "title", A) : i ? wg(t, e.name, L, G, A) : !hc(t, e, L + A) && !dc(t, e, L + A) && !ec(t, e, L, G, A) && t.fillText(e.name, L, G, A), t.restore();
  const F = e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode === "oracle", O = e.symbolStyle === "original" || e.symbolStyle === void 0 && e.wordingMode === "original", K = O && ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "");
  X(
    t,
    e,
    "manaCost",
    () => Ne(t, M, x, () => {
      i ? bc(t, y, r, F, x) : ["lea", "2ed"].includes(e.setCode?.toLowerCase() ?? "") ? wc(t, y, r, F, x) : y.forEach(
        (D, nt) => (K ? vl : et)(
          t,
          D,
          v + nt * (p + w) - (y.length - 1 - nt) * (x?.spacing ?? 0),
          b ? b[1] - p / 2 : a?.manaTop ?? c + f / 2 - p / 2,
          p,
          r,
          !1,
          x
        )
      );
    })
  );
  const [Y, lt, St, dt] = xt(s.type), z = gi(e) ?? "", N = r.get(z), _ = Fc(e), H = _c(e), ue = N ? Math.min(44 / N.width, (a?.setHeight ?? 23.4) / N.height) : 0, vt = _?.width ?? (N?.width ?? 0) * ue, he = _?.height ?? (N?.height ?? 0) * ue, me = [
    (_?.right ?? a?.setRight ?? Y + St) - vt,
    (_?.centerY ?? a?.setCenterY ?? lt + dt / 2) - he / 2,
    vt,
    he
  ], Yt = os(e, z, me, "retro"), qt = we(Yt, e.symbolAdjustment?.set), Xt = fc(e);
  t.font = `${Xt.fontSize}px "CardRenderer MTG MPlantin", Georgia`;
  const xe = bt(e) ? (D, nt, ft, mt) => _n(t, D, "type", mt, e.textInk) : (D, nt, ft, mt) => {
    !yc(t, e, D, nt + mt) && !gc(t, e, D, nt, ft, mt) && ht(t, D, nt, ft, mt, e.textInk, "type");
  };
  t.save(), t.translate(Xt.dx, Xt.dy), xe(
    wo(e)?.typeLine ?? e.typeLine ?? "",
    a?.typeX ?? Y,
    lt + dt / 2,
    N ? Math.max(
      1,
      Math.min(
        St - 48,
        _ ? _.right - _.width - Y - 6 : St,
        qt !== me ? qt[0] - (a?.typeX ?? Y) - 6 : St
      )
    ) : St
  ), t.restore(), X(
    t,
    e,
    "setSymbol",
    () => Ne(t, Yt, e.symbolAdjustment?.set, () => {
      if (N) {
        const D = Math.min(44 / N.width, (a?.setHeight ?? 23.4) / N.height), nt = _?.width ?? N.width * D, ft = _?.height ?? N.height * D, mt = _?.right ?? a?.setRight ?? Y + St, B = _?.centerY ?? a?.setCenterY ?? lt + dt / 2, q = _?.crop ?? [0, 0, 1, 1], ut = Ut(z), Lt = !ut && !e.setSymbol && r.get(kl(z));
        if (Lt && (t.save(), t.shadowColor = "transparent", e.setCode?.toLowerCase() === "arn" && (t.filter = "brightness(0.7)"), t.drawImage(
          Lt,
          q[0] * Lt.width,
          q[1] * Lt.height,
          q[2] * Lt.width,
          q[3] * Lt.height,
          mt - nt,
          B - ft / 2,
          nt,
          ft
        ), t.restore()), ut || e.setSymbol) {
          t.save(), t.shadowColor = "transparent";
          const Kt = !e.setSymbol && e.setCode?.toLowerCase() === "drk" && Rt(e) === "black" && U(e).boxes === "B" ? r.get(Tl(z)) : void 0;
          t.drawImage(Kt ?? N, ...Yt), t.restore();
        } else H || a || Ha(e.setCode) ? Mc(
          t,
          N,
          mt - nt,
          B - ft / 2,
          nt,
          ft,
          _?.outline ?? (H ? 2 : a?.setOutline ?? kd(e.setCode)),
          q,
          H,
          _?.sampling
        ) : re(
          t,
          N,
          e.setCode,
          e.rarity,
          Y + St - N.width * D,
          lt + dt / 2 - N.height * D / 2,
          N.width * D,
          N.height * D
        );
      }
    })
  ), t.shadowColor = "transparent";
  const [Re, ce, Jt, ne] = xt(s.rules);
  t.fillStyle = "#17140f";
  const gt = r.get(Mo(e) ?? "");
  if (gt && ee(t)) {
    const D = Math.min(Jt * 0.4 / gt.width, ne * 0.75 / gt.height);
    t.drawImage(
      gt,
      Re + (Jt - gt.width * D) / 2,
      ce + (ne - gt.height * D) / 2,
      gt.width * D,
      gt.height * D
    );
  } else {
    const D = pg(t, e);
    D && Tt(
      t,
      D,
      r,
      F ? et : O ? Tc(e.setCode) : e.setCode?.toLowerCase() === "3ed" ? ho : a ? ss : et
    );
  }
  if (Ic(t, e)) {
    Dn(t, e, !0);
    return;
  }
  if (!Oc(t, e)) {
    if (Ec(t, e)) {
      Dn(t, e, !1);
      return;
    }
    if (t.shadowColor = a?.statsOpaqueShadow ? "#000" : "#000b", a && (t.shadowOffsetX = t.shadowOffsetY = a.statsShadow * t.getTransform().a), t.fillStyle = Fe(e.setCode)?.statsInk ?? Ts(e), t.font = '27.8px "CardRenderer MTG MPlantin", Georgia', t.textBaseline = "middle", e.power != null && e.toughness != null && !ng(t, e)) {
      const [D, nt, ft, mt] = xt(s.stats), B = Sc(e);
      t.textAlign = B ? "right" : "center", i ? Sg(t, uo(e), nt + mt / 2, e.textInk) : ht(
        t,
        uo(e),
        (B?.right ?? D + ft / 2) + (Fe(e.setCode)?.statsDx ?? 0),
        nt + mt / 2 + (B?.yOffset ?? 0),
        B?.maxWidth ?? ft,
        e.textInk
      );
    }
    a ? xc(t, e, a) : X(t, e, "artist", () => {
      if (!tg(t, e)) {
        if (bt(e) && e.artist)
          _n(t, `Illus. © ${e.artist}`, "artist", 390);
        else if (i && e.artist) vg(t, e.artist);
        else if (e.artist && Kc(e))
          Vc(t, e.artist, e.setCode);
        else if (e.artist) {
          const [D, nt, ft, mt] = xt(s.footer);
          t.textAlign = "center", t.font = '15.6px "CardRenderer MTG MPlantin", Georgia', t.fillText(`Illus. ${e.artist}`, D + ft / 2, nt + mt / 2, ft);
        }
      }
    }), Dn(t, e, !a), t.shadowColor = "transparent";
  }
}
function Dn(t, e, r) {
  r && e.legalText && X(t, e, "legal", () => {
    t.save(), t.shadowColor = "transparent", t.fillStyle = Pt(e.setCode, e.borderColor).ink, t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.fillText(e.legalText, 49, 646, 390), t.restore();
  });
  const n = e.collectorNumber?.trim();
  n && e.collectorTotal !== void 0 && X(t, e, "collector", () => {
    t.save(), t.shadowColor = "transparent", t.fillStyle = Pt(e.setCode, e.borderColor).ink, t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "right", t.fillText(
      n + (e.collectorTotal ? "/" + e.collectorTotal : ""),
      439,
      660,
      180
    ), t.restore();
  }), t.shadowColor = "transparent";
}
let Ta;
const kg = [
  { family: "CardRenderer MTG Goudy", url: l0, weight: "400", style: "normal" },
  {
    family: "CardRenderer MTG Historic Symbols",
    url: i0,
    weight: "400",
    style: "normal"
  }
];
function Tg() {
  return typeof FontFace != "function" ? Promise.resolve() : Ta ??= Promise.all(
    kg.map(async ({ family: t, url: e }) => {
      if ([...ot()].some(
        (n) => n.family.replace(/^"|"$/g, "") === t && n.status === "loaded"
      ))
        return;
      const r = await fo(e);
      if (!r.ok) throw Error(`Retro font unavailable: ${t}`);
      ot().add(await new FontFace(t, await r.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((t) => {
    throw Ta = void 0, t;
  });
}
const El = `${Ue}/img/class_level_bg.webp`, Ll = (t) => ["adventure", "class", "leveler"].includes(tt(t)), Ge = (t, e, r, n) => ({
  x: t / 63.5 * 488,
  y: e / 88.9 * 680,
  width: r / 63.5 * 488,
  height: n / 88.9 * 680
}), Mg = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function xg(t, e, r, n = 21) {
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
function pn(t) {
  const e = tt(t), r = [], n = (o, s, a, i = {}) => {
    r.push({ kind: o, text: s, ...a, font: xg(s, a.width, a.height), ...i });
  };
  if (e === "adventure") {
    const o = t.faces?.[1];
    if (!o) return [];
    const s = (o.manaSymbols ?? []).map((i) => `{${i}}`).join(""), a = (o.manaSymbols?.length ?? 0) * 2.5;
    n("heading", o.name, Ge(5.6, 55.3, 25 - a, 4.2), {
      color: "white",
      font: Math.min(18, (25 - a) * 488 / 63.5 / Math.max(1, o.name.length * 0.55))
    }), n("rules", s, Ge(30 - a, 55.3, a, 4.2), { color: "white", font: 17 }), n("heading", o.typeLine ?? "", Ge(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (o.typeLine ?? "").length * 0.52))
    }), n("rules", o.rulesText ?? "", Ge(5.6, 64.5, 24.7, 15.6)), n("rules", t.rulesText ?? t.faces?.[0]?.rulesText ?? "", Ge(33, 54.9, 25.5, 25));
  } else if (e === "class") {
    const [o, s, a, i] = Ft(t).rules.map(
      (w, S) => w * (S % 2 ? E : T)
    ), d = U(t);
    n(
      "band",
      "",
      { x: o, y: s, width: a, height: i },
      {
        fill: "#e3d8bb",
        asset: Ot(
          "saga_textboxes",
          d.boxes === "Colourless" ? "Land" : d.boxes
        )
      }
    );
    const l = [];
    for (const w of (t.rulesText ?? "").split(`
`).filter(Boolean))
      l.length && !/^.*:\s*Level\s+\d+\s*$/i.test(w) && !/^.*:\s*Level\s+\d+\s*$/i.test(l.at(-1)) && !l.at(-1).startsWith("(") ? l[l.length - 1] += `
` + w : l.push(w);
    const u = (w) => /^.*:\s*Level\s+\d+\s*$/i.test(w), h = 28, m = 20, c = (w, S) => w.split(`
`).reduce(
      (v, C) => v + Math.max(1, Math.ceil(C.length * S * 0.53 / (a - 10))),
      0
    ), g = l.map(
      (w) => u(w) ? h : c(w, w.startsWith("(") ? 16 : m) * (w.startsWith("(") ? 16 : m) + 8
    ), f = l.filter((w) => !u(w)).length, y = Math.max(0, i - g.reduce((w, S) => w + S, 0)) / Math.max(1, f), b = Math.min(
      1,
      (i - l.filter(u).length * h) / g.reduce((w, S, v) => w + (u(l[v]) ? 0 : S), 0)
    );
    let p = s;
    l.forEach((w, S) => {
      const v = u(w), C = v ? h : g[S] * b + y;
      if (v) {
        const [k, x] = w.split(/:\s*/);
        n("band", "", { x: o, y: p, width: a, height: C }, { asset: El }), n("rules", k + ":", { x: o + 5, y: p, width: a / 2 - 5, height: C }, { font: 18 }), n(
          "heading",
          x,
          { x: o + a / 2, y: p, width: a / 2 - 5, height: C },
          { font: 18, align: "right" }
        );
      } else
        n(
          "rules",
          w,
          { x: o + 5, y: p + 4, width: a - 10, height: C - 8 },
          { font: (w.startsWith("(") ? 16 : m) * b, italic: w.startsWith("(") }
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
    const i = Ge(4.9, 55.6, 53.7, 25.5), d = i.height / a.length, l = Mg[U(t).frame] ?? "#dcc8af";
    a.forEach((u, h) => {
      const m = i.y + h * d;
      h && n(
        "band",
        "",
        { x: i.x, y: m, width: i.width, height: d },
        { fill: h % 2 ? "#00000018" : "#00000028" }
      );
      const c = u.range ? 55 : 7, g = u.stats ? 72 : 7;
      n("rules", u.text, {
        x: i.x + c,
        y: m + 4,
        width: i.width - c - g,
        height: d - 8
      }), u.range && n(
        "level",
        `LEVEL
${u.range}`,
        { x: i.x - 12, y: m + d / 2 - 23, width: 65, height: 46 },
        { fill: l, font: 13 }
      ), u.stats && n(
        "stats",
        u.stats,
        { x: i.x + i.width - 68, y: m + d / 2 - 22, width: 77, height: 44 },
        { asset: Ot("pt-boxes", U(t).pt), font: 26 }
      );
    });
  }
  return r;
}
function Rg(t) {
  return pn(t).flatMap((e) => [
    e.asset ?? null,
    ...ln(e.text).flatMap((r) => r.symbol ? [je(r.symbol)] : [])
  ]);
}
function Ag(t) {
  if (["adventure", "prepare"].includes(tt(t))) {
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
      U(e)
    ] : null;
  }
  return Ll(t) ? pn(t) : null;
}
function Eg(t, e, r) {
  let n = !0;
  for (const o of pn(e)) {
    if (!ee(t) && (o.asset === El || o.kind !== "band" && o.kind !== "stats" && o.kind !== "level"))
      continue;
    const { x: s, y: a, width: i, height: d, font: l } = o;
    t.save(), t.textAlign = "left", t.fillStyle = o.fill ?? "transparent", o.kind === "level" ? (t.beginPath(), t.moveTo(s, a), t.lineTo(s + i * 0.72, a), t.lineTo(s + i, a + d / 2), t.lineTo(s + i * 0.72, a + d), t.lineTo(s, a + d), t.closePath(), t.fill(), t.strokeStyle = "#0008", t.lineWidth = 1, t.stroke()) : o.fill && t.fillRect(s, a, i, d);
    const u = o.asset ? r.get(o.asset) : null;
    if (u && t.drawImage(u, s, a, i, d), t.beginPath(), t.rect(s, a, i, d), t.clip(), t.fillStyle = o.color ?? "#17140f", ["stats", "level"].includes(o.kind)) {
      t.font = `${l}px "CardRenderer MTG Beleren", Georgia`, t.textAlign = "center", t.textBaseline = "middle";
      const h = o.text.split(`
`);
      h.forEach(
        (m, c) => ht(
          t,
          m,
          s + i * (o.kind === "level" ? 0.43 : 0.5),
          a + d / 2 + (c - (h.length - 1) / 2) * l,
          i * 0.85,
          o.kind === "stats" && n && e.power != null && e.toughness != null ? e.textInk : void 0
        )
      ), o.kind === "stats" && (n = !1);
    } else if (o.align === "right")
      t.font = `${l}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = "right", t.textBaseline = "middle", t.fillText(o.text, s + i, a + d / 2, i);
    else {
      t.font = `${o.italic ? "italic " : ""}${l}px "CardRenderer MTG MPlantin", Georgia`;
      const h = Wo(t, o.text, i, l).length * l + (o.text.split(`
`).length - 1) * J.paragraphGap;
      Ci(
        t,
        o.text,
        s,
        a + Math.max(0, (d - h) / 2),
        i,
        { size: l, italic: !!o.italic },
        r
      );
    }
    t.restore();
  }
}
const Lg = 5, Bg = 0.02655 * E + 0.91339 * T * 3810 / 2736;
function ls(t) {
  const e = t ? 382 : 429;
  return { top: e, scale: 1 - Lg / (Bg - e) };
}
function Ig(t) {
  const { top: e, scale: r } = ls(t);
  return [e + 6, e + (625 - e) * r - 4];
}
function Ma(t, e, r, n, o, s) {
  const { top: a, scale: i } = ls(s), d = e.height * o / e.width, l = Math.max(0, Math.min(d, a - n)), u = l * e.width / o;
  l > 0 && t.drawImage(e, 0, 0, e.width, u, r, n, o, l), l < d && t.drawImage(
    e,
    0,
    u,
    e.width,
    e.height - u,
    r,
    n + l,
    o,
    (d - l) * i
  );
}
const Ct = {
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
function Og(t, e, r) {
  const n = t.rulesParagraphs?.filter((a) => a.role === "rules")[r], o = (t.rulesText ?? "").split(`
`).filter((a) => a.trim())[r];
  if (!n || n.runs.map((a) => a.text).join("") !== o) return [{ text: e }];
  let s = o.length - e.length;
  return n.runs.flatMap((a) => {
    const i = Math.min(s, a.text.length);
    return s -= i, i === a.text.length ? [] : [{ ...a, text: a.text.slice(i) }];
  });
}
function $g(t, e) {
  const r = tt(e) === "planeswalker-large", n = kr(e), o = !r && n.length < 3, s = Ft(e).rules, a = s[0] * T, i = s[1] * E, d = s[2] * T, l = s[3] * E - (r ? 24 : o ? 4 : 16), u = r ? 8 : o ? 3 : 0, h = r ? { ...Vr, leading: 0.9 } : Vr, m = n.map((M, R) => ({
    ...M,
    runs: Og(e, M.text, R),
    left: M.badges.length ? Ct.textLeft : Ct.staticTextLeft
  })), c = (M) => m.map(
    (R) => $(
      t,
      [{ role: "rules", runs: R.runs }],
      {
        x: a + R.left,
        y: 0,
        width: d - R.left - Ct.rightInset,
        height: 1e3
      },
      M,
      M,
      h
    )
  );
  let g = r ? 17.5 : o ? 24 : 19, f = c(g);
  const [y, b] = Ig(r), p = () => {
    const M = l / Math.max(1, m.length), R = f.map((A, F) => i + u + M * (F + 0.5) - A.height / 2);
    let L = y - 8;
    for (let A = 0; A < R.length; A++)
      R[A] = Math.max(R[A], L + 8), L = R[A] + f[A].height;
    let G = b + 8;
    for (let A = R.length - 1; A >= 0; A--)
      R[A] = Math.min(R[A], G - 8 - f[A].height), G = R[A];
    return R;
  }, w = () => (p()[0] ?? y) >= y, S = () => f.map(
    (M) => Math.max(Ct.minimumRowHeight, M.height + 16)
  ), v = () => {
    const M = l / Math.max(1, m.length);
    return f.every((R, L) => {
      const G = M * (L + 0.5);
      return G - R.height / 2 >= 6 && G + R.height / 2 <= l + 6 && (!L || M - (R.height + f[L - 1].height) / 2 >= 8);
    });
  };
  for (; g > 8 && (S().reduce((M, R) => M + R, 0) > l || !v() || !w()); )
    g -= 0.25, f = c(g);
  const C = l / Math.max(1, m.length), k = p();
  let x = u;
  return m.map((M, R) => {
    const L = C, G = f[R].height, A = $(
      t,
      [{ role: "rules", runs: M.runs }],
      {
        x: a + M.left,
        y: k[R],
        width: d - M.left - Ct.rightInset,
        height: G
      },
      g,
      g,
      h
    );
    A.overflow ||= x + L > u + l + 0.01, A.overflow ||= !v(), A.overflow ||= !w(), A.overflow ||= A.lines.some(
      (O) => O.inkBounds[1] < y - 0.01 || O.inkBounds[1] + O.inkBounds[3] > b + 0.01
    );
    const F = { ...M, top: x, height: L, font: g, width: A.width, layout: A };
    return x += L, F;
  });
}
function Bl(t, e) {
  return t === "saga" ? /^(I|II|III|IV)$/.test(e) ? Ot("saga", e) : null : Ot(
    "planeswalker",
    e.startsWith("+") ? "LoyaltyPlus" : e === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function Il(t, e) {
  return tt(t) === "saga" ? Ot("saga_textboxes", e === "Colourless" ? "Land" : e) : null;
}
function Gg(t) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[U(t).boxes] ?? "#dededbf0";
}
function Pg(t, e) {
  const { top: r, scale: n } = ls(tt(e) === "planeswalker-large");
  t.save(), t.translate(0, r), t.scale(1, n), t.translate(0, -r), t.beginPath(), t.moveTo(66, r), t.lineTo(448, r), t.quadraticCurveTo(456, r, 456, r + 8), t.lineTo(456, 613), t.bezierCurveTo(456, 623, 420, 629, 257, 629), t.bezierCurveTo(94, 629, 58, 623, 58, 613), t.lineTo(58, r + 8), t.quadraticCurveTo(58, r, 66, r), t.closePath(), t.clip(), t.fillStyle = Gg(e), t.fillRect(58, r, 398, 629 - r), t.restore();
}
function Wg(t, e, r) {
  t.save(), t.fillStyle = Ct.colonInk, t.font = `${Ct.colonFontSize}px ${Ct.colonFontFamily}`, t.textAlign = "center", t.textBaseline = "alphabetic";
  const n = t.measureText(":");
  t.fillText(
    ":",
    e,
    r + Ct.colonOffsetY + (n.actualBoundingBoxAscent - n.actualBoundingBoxDescent) / 2
  ), t.restore();
}
function Fg(t, e, r) {
  const n = tt(e), o = n === "saga", s = Ft(e).rules, a = s[0] * T, i = s[1] * E, d = s[2] * T, l = s[3] * E;
  o && (t.fillStyle = "#e3d8bb", t.fillRect(a, i, d, l));
  const u = Il(e, U(e).boxes), h = u ? r.get(u) : void 0;
  if (h && t.drawImage(h, a, i, d, l), !ee(t)) return;
  const m = o ? Iu(e) : $g(t, e);
  for (const [c, g] of m.entries()) {
    if (c > 0) {
      const b = m[c - 1]?.layout, p = g.layout && b ? Math.max(b.top + b.height + 3, Math.min(i + g.top, g.layout.top - 3)) : i + g.top;
      t.fillStyle = "#0002", t.fillRect(
        a + (o ? 0 : Ct.separatorLeft),
        p,
        d - (o ? 0 : Ct.separatorLeft),
        Ct.separatorHeight
      );
    }
    if (t.fillStyle = "#17140f", t.textAlign = "left", g.layout) Tt(t, g.layout, r);
    else {
      t.font = `${g.reminder ? "italic " : ""}${g.font}px "CardRenderer MTG MPlantin", Georgia`;
      const b = Wo(t, g.text, g.width, g.font).length * g.font;
      Ci(
        t,
        g.text,
        a + g.left,
        i + g.top + (g.height - b) / 2,
        g.width,
        { size: g.font, italic: g.reminder },
        r
      );
    }
    const f = o ? 36 : Ct.badgeWidth, y = o ? 36 : Ct.badgeHeight;
    g.badges.forEach((b, p) => {
      const w = a + (o ? -18 : 0), S = i + g.top + g.height / 2 + (p - g.badges.length / 2) * y, v = Bl(n, b), C = v ? r.get(v) : null;
      if (C) {
        if (t.save(), !o) {
          const k = t.getTransform().a;
          t.shadowColor = "#0009", t.shadowBlur = 3 * k, t.shadowOffsetY = 2 * k;
        }
        t.drawImage(C, w, S, f, y), t.restore();
      } else
        t.fillStyle = "#29231c", t.fillRect(w, S, f, y);
      o ? C || (t.fillStyle = "white", t.textAlign = "center", t.textBaseline = "middle", t.font = 'bold 19px "CardRenderer MTG Beleren", Georgia', t.fillText(b, w + f / 2, S + y / 2, f - 3)) : (Yu(t, b, [w, S, f, y]), Wg(
        t,
        w + f + Ct.colonOffsetX,
        S + y / 2
      ));
    });
  }
}
const Ol = 0.7;
function _g(t, e, r, n = !1) {
  const [o, s, a, i] = [
    r[0] * T,
    r[1] * E,
    r[2] * T,
    r[3] * E - 1
  ], d = new Path2D();
  d.moveTo(o + 14, s), d.lineTo(o + a - 14, s), d.quadraticCurveTo(o + a, s, o + a, s + 14), d.lineTo(o + a, s + i - 7), d.quadraticCurveTo(o + a, s + i, o + a - 7, s + i), d.lineTo(o + 9, s + i), d.quadraticCurveTo(o - 2, s + i, o - 2, s + i - 9), d.quadraticCurveTo(o - 2, s + 17, o + 2, s + 9), d.quadraticCurveTo(o + 5, s, o + 14, s), d.closePath(), t.save();
  const l = t.getTransform().a;
  t.shadowColor = "#0009", t.shadowBlur = 1.4 * l, t.shadowOffsetX = -1.2 * l, t.shadowOffsetY = 3.5 * l, t.fillStyle = "#191816", t.fill(d), t.shadowColor = "transparent", t.save(), t.clip(d);
  const u = e.width / a, h = [
    20 * u,
    e.height - (i - 4) * u,
    e.width - 40 * u,
    (i - 12) * u,
    o - 2,
    s,
    a + 2,
    i
  ];
  t.drawImage(e, ...h), n && (t.globalAlpha *= Ol, t.drawImage(e, ...h)), t.restore(), t.strokeStyle = "#191816", t.lineWidth = 1.2, t.stroke(d), t.restore();
}
function Ug(t, e, r) {
  if (!e.pinlines) return;
  const n = (i) => {
    const d = r.get(i);
    if (!d) throw Error(`Planar pinline asset unavailable: ${i}`);
    return d;
  }, o = () => {
    const i = I();
    i.width = 732, i.height = 1020;
    const d = i.getContext("2d");
    if (!d) throw Error("Missing Planar pinline composition context");
    return { canvas: i, context: d };
  }, s = o(), a = o();
  try {
    s.context.drawImage(n(e.pinlines.left), 0, 0, 732, 1020), a.context.drawImage(n(e.pinlines.right), 0, 0, 732, 1020), a.context.globalCompositeOperation = "destination-in";
    const i = a.context.createLinearGradient(732 * 0.47, 0, 732 * 0.53, 0);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), a.context.fillStyle = i, a.context.fillRect(0, 0, 732, 1020), s.context.drawImage(a.canvas, 0, 0), s.context.globalCompositeOperation = "destination-in", s.context.drawImage(n(e.pinlines.mask), 0, 0, 732, 1020), po(t, s.canvas);
  } finally {
    s.canvas.width = s.canvas.height = 0, a.canvas.width = a.canvas.height = 0;
  }
}
function xa(t, e, r) {
  if (!Wt(t, e)) return { dx: 0, dy: 0, size: 1 };
  const n = t.frameTreatment === "colorshifted";
  return r === "title" ? n ? { dx: 0.25, dy: 0.75, size: 1.04 } : { dx: 1, dy: 0.75, size: 1.035 } : n ? { dx: -0.75, dy: -1.25, size: 1.03 } : { dx: 0.5, dy: 0, size: 1.025 };
}
const jg = 1.1;
function $l(t) {
  return !t.setSymbol && ["m19", "m20", "m21"].includes(t.setCode?.toLowerCase() ?? "");
}
function Gl(t, e, r, n, o, s, a, i, d = 1) {
  const l = !r || r === "common", u = I(), h = 2, m = 4;
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
  f.addColorStop(0, g[0]), f.addColorStop(0.35, g[1]), f.addColorStop(0.6, g[2]), f.addColorStop(1, g[3]), c.fillStyle = l ? "#111111" : f, c.fillRect(0, 0, s, a), c.beginPath(), c.moveTo(s * 0.046, 0), c.lineTo(s * 0.953, 0), c.bezierCurveTo(
    s * 1.016,
    a * 0.38,
    s * 1.016,
    a * 0.62,
    s * 0.953,
    a
  ), c.lineTo(s * 0.046, a), c.bezierCurveTo(-s * 0.017, a * 0.62, -s * 0.017, a * 0.38, s * 0.046, 0), c.closePath(), c.globalCompositeOperation = "destination-over", c.fillStyle = l ? "#f8f8f5" : "#111111", c.fill(), c.globalCompositeOperation = "source-over", c.strokeStyle = l ? "#f8f8f5" : "#111111", c.lineWidth = d, c.stroke(), t.drawImage(
    u,
    n - h,
    o - h,
    u.width / m,
    u.height / m
  ), u.width = u.height = 0;
}
function Dg(t, e, r, n) {
  const o = I();
  o.width = 732, o.height = 1020;
  try {
    const s = o.getContext("2d");
    if (!s) throw Error("Missing frame stock composition context");
    n ? (s.save(), s.scale(1.5, 1.5), po(s, e, n === "colorshifted"), s.restore()) : s.drawImage(e, 0, 0, o.width, o.height), s.globalCompositeOperation = "source-in", s.fillStyle = r, s.fillRect(0, 0, o.width, o.height), t.drawImage(o, 0, 0, 488, 680);
  } finally {
    o.width = o.height = 0;
  }
}
const nr = (t) => [
  t[0] * T,
  t[1] * E,
  t[2] * T,
  t[3] * E
];
function Ng(t, e, r, n, o) {
  const s = Mt(e);
  if (!s) throw Error("Missing replacement frame family.");
  const a = (z) => {
    const N = r.get(z);
    if (!N) throw Error(`Replacement frame asset unavailable: ${z}`);
    return N;
  }, { rects: i } = s, d = e.frameAssetFamily === "eighth", l = Je(e, s.frame) ?? At(e) ?? Pt(e.setCode, e.borderColor).border;
  if (t.save(), t.fillStyle = l, t.fillRect(0, 0, T, E), n && t.drawImage(n, 0, 0, T, E), _t(t, e, r, nr(i.art), o), o === "artwork") {
    t.restore();
    return;
  }
  if (xo(e, s.frame) ? p0(t, a(s.frame)) : Wt(e, s.frame) ? po(t, a(s.frame), e.frameTreatment === "colorshifted") : t.drawImage(a(s.frame), 0, 0, T, E), Ug(t, s, r), s.rightFrame) {
    const z = I();
    z.width = 732, z.height = 1020;
    const N = z.getContext("2d");
    N.drawImage(a(s.rightFrame), 0, 0, z.width, z.height);
    const _ = I();
    _.width = z.width, _.height = z.height;
    const H = _.getContext("2d"), ue = (Jt, ne) => {
      const gt = H.createLinearGradient(_.width * Jt, 0, _.width * ne, 0);
      return gt.addColorStop(0, "#0000"), gt.addColorStop(1, "#000"), gt;
    };
    H.fillStyle = ue(0.47, 0.53), H.fillRect(0, 0, _.width, _.height);
    const vt = d ? [0.08, 0.627, 0.84, 0.29] : [0.071, 0.629, 0.858, 0.294], [he, me, Yt, qt] = vt, Xt = he * _.width, xe = me * _.height, Re = Yt * _.width, ce = qt * _.height;
    H.clearRect(Xt, xe, Re, ce), H.fillStyle = ue(0.27, 0.73), H.fillRect(Xt, xe, Re, ce), N.globalCompositeOperation = "destination-in", N.drawImage(_, 0, 0), t.drawImage(z, 0, 0, T, E), z.width = z.height = 0, _.width = _.height = 0;
  }
  l !== "#090806" && Dg(
    t,
    a(s.border),
    l,
    Wt(e, s.frame) ? e.frameTreatment === "colorshifted" ? "colorshifted" : "planar" : void 0
  ), Qi(t, e, r), t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
  const u = cn(e), h = d ? "CardRenderer MTG Matrix" : "CardRenderer MTG Beleren", [m, c, g, f] = nr(i.title), y = e.manaSymbols ?? [], { size: b } = s.mana, p = s.mana.gap + (u?.spacing ?? 0), w = s.mana.right * T, S = y.length * b + Math.max(0, y.length - 1) * p, v = [
    w - S,
    s.mana.center * E - b / 2,
    S,
    b
  ], C = we(v, u);
  t.font = `bold ${s.titleSize}px "${h}", Georgia`, t.save(), d && t.translate(...ns(e, "eighth"));
  const k = xa(e, s.frame, "title");
  t.translate(k.dx, k.dy), Aa(t, e, s.frame), rt(
    t,
    e.name,
    m,
    c + f / 2,
    y.length ? C[0] - m - 8 : g,
    s.titleSize * k.size,
    !0,
    1,
    h,
    e.frameTreatment === "colorshifted" ? 0.5 : 0
  ), t.restore(), X(
    t,
    e,
    "manaCost",
    () => Ne(t, v, u, () => {
      y.forEach(
        (z, N) => et(
          t,
          z,
          w - S + N * (b + p),
          s.mana.center * E - b / 2,
          b,
          r,
          !0,
          u
        )
      );
    })
  );
  const x = Q(e), M = r.get(x ?? ""), R = de(e), L = M ? Math.min(
    s.symbol.width * T / (M.width * R[2]),
    s.symbol.height * E / (M.height * R[3])
  ) : 0, G = M ? M.width * R[2] * L : 0, A = M ? M.height * R[3] * L : 0, F = fh(e, s.frame, x) ?? Jm(e, x, [
    s.symbol.right * T - G,
    s.symbol.center * E - A / 2,
    G,
    A
  ]), O = we(F, e.symbolAdjustment?.set), [K, Y, lt, St] = nr(i.type);
  t.save();
  const dt = xa(e, s.frame, "type");
  if (t.translate(dt.dx, dt.dy), Aa(t, e, s.frame), t.font = `bold ${s.typeSize}px "${h}", Georgia`, rt(
    t,
    e.typeLine ?? "",
    K,
    Y + St / 2,
    M ? O[0] - K - 7 : lt,
    s.typeSize * dt.size,
    !0,
    1,
    h,
    e.frameTreatment === "colorshifted" ? 0.5 : 0,
    e.textInk,
    "type"
  ), t.restore(), X(
    t,
    e,
    "setSymbol",
    () => Ne(t, F, e.symbolAdjustment?.set, () => {
      if (M) {
        const z = yl(e);
        Ut(x) || e.setSymbol ? t.drawImage(M, ...F) : $l(e) ? Gl(t, M, e.rarity, ...F, R, 1.5) : z ? bl(t, M, z, e.rarity, ...F, R, !1) : re(t, M, e.setCode, e.rarity, ...F, R);
      }
    })
  ), Da(t, e, r) || Tt(t, tl(t, e), r), e.power != null && e.toughness != null && t.drawImage(a(s.pt), ...nr(i.stats)), d) {
    Pd(t, e, r, s.frame), t.restore();
    return;
  }
  if (e.power != null && e.toughness != null) {
    const [z, N, _, H] = nr(i.stats);
    t.font = `bold 25px "${h}", Georgia`, t.textAlign = "center", t.textBaseline = "middle", ht(
      t,
      `${e.power}/${e.toughness}`,
      z + _ * 0.52,
      N + H * 0.52,
      _ * 0.85,
      e.textInk
    );
  }
  oo(t, e), t.restore();
}
let Ra = null;
function zg(t) {
  if (t.frameAssetFamily !== "eighth") return Promise.resolve();
  const e = Ra ??= Promise.all([
    ot().load('700 24px "CardRenderer MTG Matrix"'),
    ot().load('700 29px "CardRenderer MTG Matrix Small Caps"')
  ]).then((r) => {
    if (r.some((n) => !n.length || n.some((o) => o.status !== "loaded")))
      throw Error("Replacement Eighth Edition frames need card-glint/magic/fonts.css.");
  }).catch((r) => {
    throw Ra = null, r;
  });
  return Promise.all([e, Gd(t, Mt(t)?.frame ?? "")]).then(
    () => {
    }
  );
}
function Aa(t, e, r) {
  e.frameTreatment === "colorshifted" && (t.fillStyle = "#fff", t.shadowColor = Je(e, r) ?? "#000", t.shadowOffsetX = -21e-4 * T, t.shadowOffsetY = 15e-4 * E, t.shadowBlur = 0);
}
function Yg(t, e, [r, n, o, s]) {
  const a = e.height * o / e.width;
  t.save(), t.beginPath(), t.rect(r, n, o, s / 2), t.clip(), t.drawImage(e, r, n + s - a + 1, o, a), t.restore();
}
function qg(t, [e, r, n, o], s) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(s)) return;
  t.save(), t.shadowColor = "transparent";
  const a = t.createLinearGradient(e, 0, e + n, 0);
  a.addColorStop(0, "rgba(255,255,255,0)"), a.addColorStop(0.025, "rgba(255,255,255,0.2)"), a.addColorStop(0.975, "rgba(255,255,255,0.2)"), a.addColorStop(1, "rgba(255,255,255,0)"), t.fillStyle = a, t.fillRect(e, r + o - 4, n, 2.3), t.restore();
}
const se = /* @__PURE__ */ new Map();
function Pl(t) {
  if (!(!t.retired || t.users)) {
    if (!t.sources) {
      t.controller.abort();
      return;
    }
    URL.revokeObjectURL(t.sources.original), t.sources.backing && URL.revokeObjectURL(t.sources.backing), t.sources.outlined && URL.revokeObjectURL(t.sources.outlined), t.sources = void 0;
  }
}
function Nf() {
  for (const t of se.values())
    t.retired = !0, Pl(t);
  se.clear();
}
async function Hg(t, e) {
  e.throwIfAborted();
  let r = se.get(t);
  if (!r) {
    const d = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const l = await fo(t, {
          mode: "cors",
          signal: d.controller.signal
        });
        if (!l.ok) throw Error(`Symbol source ${l.status}: ${t}`);
        const u = await Yc(t, await l.blob()), h = await jc(t, u), m = await qc(t, u);
        d.controller.signal.throwIfAborted();
        const c = URL.createObjectURL(u);
        let g, f;
        try {
          g = h ? URL.createObjectURL(h) : void 0, f = m ? URL.createObjectURL(m) : void 0;
          const y = { original: c, backing: g, outlined: f };
          return d.sources = y, y;
        } catch (y) {
          throw URL.revokeObjectURL(c), g && URL.revokeObjectURL(g), f && URL.revokeObjectURL(f), y;
        }
      })
    };
    d.promise = d.promise.catch((l) => {
      throw se.get(t) === d && se.delete(t), l;
    }), se.set(t, d), r = d;
  }
  r.users++;
  const n = r;
  let o = !1;
  const s = () => {
    o || (o = !0, n.users--, !n.users && !n.sources && (n.retired = !0, se.get(t) === n && se.delete(t)), Pl(n));
  };
  let a = () => {
  };
  const i = new Promise((d, l) => {
    a = () => {
      s(), l(e.reason);
    }, e.addEventListener("abort", a, { once: !0 });
  });
  try {
    const d = await Promise.race([n.promise, i]);
    return e.throwIfAborted(), { sources: d, release: s };
  } catch (d) {
    throw s(), d;
  } finally {
    e.removeEventListener("abort", a);
  }
}
async function Xg(t, e) {
  e.throwIfAborted();
  const r = [...new Set(t.filter((d) => !!d))], n = [], o = /* @__PURE__ */ new Map(), s = () => {
    for (const d of n) d.release();
    n.length = 0;
  }, i = (await Promise.allSettled(
    r.map(async (d) => {
      if (!Uc(d) && !zc(d)) {
        o.set(d, d);
        return;
      }
      const l = await Hg(d, e);
      n.push(l), o.set(d, l.sources.original), l.sources.backing && o.set(kl(d), l.sources.backing), l.sources.outlined && o.set(Tl(d), l.sources.outlined);
    })
  )).find((d) => d.status === "rejected");
  if (i?.status === "rejected")
    throw s(), i.reason;
  return e.aborted && (s(), e.throwIfAborted()), { urls: [...new Set(o.values())], aliases: o, dispose: s };
}
function Jg(t, e) {
  const r = /* @__PURE__ */ new Map();
  for (const [n, o] of t) {
    const s = e.get(o);
    s && r.set(n, s);
  }
  return r;
}
async function Kg(t, e) {
  return e.throwIfAborted(), fo(t, { signal: e, mode: "cors" });
}
function Vg(t) {
  if (t.startsWith(`${P}/img/frames/m15/holoStamps/`) || t.startsWith(`${P}/img/frames/planeswalker/holo/`) || t.startsWith(P) && /\/saga\/(sagaChapter|sagaDivider|sagaMidStripe|stamp)\.png$/.test(t))
    return;
  if (t.startsWith(`${P}/data/images/cardImages/saga/`)) return 768;
  if (t.startsWith(`${P}/img/frames/future/regular/futurePT`)) return;
  if (t.startsWith(`${P}/img/frames/`) && t.endsWith(".png"))
    return /\/pt\/|\/m15PT/.test(t) ? 256 : 768;
  if (t.startsWith(`${De}/img/frames/`) && t.endsWith(".png")) return 768;
  const e = t.startsWith(`${Ue}/img/`) ? t.slice(`${Ue}/img/`.length) : "";
  return e === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    e
  ) ? 768 : void 0;
}
async function Wl(t, e) {
  const r = await Xg(t, e), n = r.urls, o = /* @__PURE__ */ new Map();
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, n.length) }, async () => {
        for (; s < n.length && !e.aborted; ) {
          const i = n[s++];
          try {
            const d = await Kg(i, e);
            if (!d.ok) continue;
            const l = await d.blob(), u = await Vl(l, e, Vg(i));
            e.aborted ? u.close() : o.set(i, u);
          } catch {
          }
        }
      })
    );
  } finally {
    r.dispose();
  }
  const a = Jg(r.aliases, o);
  return {
    images: a,
    dispose: () => {
      for (const i of o.values()) i.close();
      o.clear(), a.clear();
    }
  };
}
function Fl(t) {
  if (t = le(t), t.frameTemplate)
    return [
      ...fu(t),
      t.illustration,
      Q(t),
      ...jt(
        t.frameTemplate === "future" ? { ...t, manaSymbols: t.manaSymbols?.filter((a) => !un(a)) } : t
      ),
      ...(t.faces ?? []).flatMap(jt)
    ];
  if (mn(t))
    return [
      ...zi(t),
      t.illustration,
      Q(t),
      ...jt(t),
      ...jt(Ve(t))
    ];
  if (Cr(t))
    return [
      ...Ni(t),
      t.illustration,
      Q(t),
      ...jt(t),
      ...jt(t.faces[1])
    ];
  if (Te(t))
    return [
      ...Li(t),
      ...Gt(t).flatMap((a) => [
        a.face.illustration,
        ...jt(a.face)
      ]),
      Q(Gt(t)[0].face)
    ];
  const e = Nt(t);
  if (e)
    return [
      ...Gt(t).flatMap((a, i) => [
        ...$u(a.face, e, ze(t) && e === "eighth", i),
        a.face.illustration,
        Q(a.face),
        ...jt(a.face)
      ]),
      ...e === "eighth" && ze(t) ? Kh(t) : []
    ];
  const r = w0(t);
  if (r)
    return [
      ...r,
      be(t)?.image,
      be(t)?.rightImage,
      t.illustration,
      Q(t),
      ...jt(t)
    ];
  if (st(t)) return g0(t);
  if (tt(t) === "saga")
    return [...xu(t), t.illustration, Q(t), ...jt(t)];
  const n = Gt(t);
  if (n.length) return n.flatMap((a) => Fl(a.face));
  const o = U(t), s = Ce(o, tt(t));
  return [
    be(t)?.image,
    be(t)?.rightImage,
    tt(t) === "normal" ? an(t) : null,
    ...Rg(t),
    s.background,
    s.frame,
    s.boxes,
    s.pt,
    Il(t, o.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(tt(t)) ? kr(t).flatMap(
      (a) => a.badges.map((i) => Bl(tt(t), i))
    ) : [],
    o.legendary ? s.crown : null,
    t.illustration,
    Q(t),
    ...jt(t)
  ];
}
let Ea = null;
function La() {
  return Ea ??= Promise.all([
    ot().load('24px "CardRenderer MTG Beleren"'),
    ot().load('700 24px "CardRenderer MTG Beleren"'),
    ot().load('700 11px "CardRenderer MTG Beleren Small Caps"'),
    ot().load('24px "CardRenderer MTG MPlantin"'),
    ot().load('italic 24px "CardRenderer MTG MPlantin"'),
    ot().load('14px "CardRenderer MTG Relay"'),
    ot().load('14px "CardRenderer MTG Artist Credit"')
  ]).then((t) => {
    if (t.some((e) => !e.length || e.some((r) => r.status !== "loaded")))
      throw Error(
        "Magic fonts are unavailable. Load card-glint/magic/fonts.css before preparing cards."
      );
  }).catch((t) => {
    throw Ea = null, t;
  });
}
function Fr(t) {
  return Ft(t).art;
}
const Ba = /* @__PURE__ */ new WeakMap(), _r = ([t, e, r, n]) => [t, 1 - e - n, t + r, 1 - e], Zg = [_r(Ft({ name: "" }).art), [0, 0, 0, 0]];
function zf(t) {
  if (!t) return Zg;
  const e = Ba.get(t);
  if (e) return e;
  const r = Gt(t), n = r.length ? [
    _r(Ps(r[0], Fr(r[0].face))),
    _r(Ps(r[1], Fr(r[1].face)))
  ] : [_r(Fr(t)), [0, 0, 0, 0]];
  return Ba.set(t, n), n;
}
const Qg = new gn(4 * 1024 * 1024), Ia = /* @__PURE__ */ new WeakMap();
let tf = 0;
async function ef(t, e, r, n) {
  if (n.throwIfAborted(), r !== void 0 && !["auto", "alpha", "ink"].includes(r))
    throw Error("Invalid set symbol mask mode");
  if (!(r === "ink" || (r === void 0 || r === "auto") && Ut(e))) return { value: t, release() {
  } };
  let s = Ia.get(t);
  s === void 0 && Ia.set(t, s = ++tf);
  const a = Math.min(1, 512 / Math.max(t.width, t.height)), i = Math.max(1, Math.round(t.width * a)), d = Math.max(1, Math.round(t.height * a));
  return Qg.acquire(
    JSON.stringify(["set-symbol-ink-v1", s, i, d]),
    i * d * 4,
    async () => {
      const l = I();
      l.width = i, l.height = d;
      try {
        const u = l.getContext("2d", { willReadFrequently: !0 });
        if (!u) throw Error("Set symbol mask needs Canvas2D");
        u.drawImage(t, 0, 0, i, d);
        const h = u.getImageData(0, 0, i, d);
        for (let m = 0; m < h.data.length; m += 4) {
          const c = h.data[m] * 0.2126 + h.data[m + 1] * 0.7152 + h.data[m + 2] * 0.0722;
          h.data[m + 3] = Math.round(h.data[m + 3] * (1 - c / 255)), h.data[m] = h.data[m + 1] = h.data[m + 2] = 255;
        }
        return u.putImageData(h, 0, 0), await createImageBitmap(l);
      } finally {
        l.width = l.height = 0;
      }
    },
    n
  );
}
async function rf(t, e, r, n, o, s, a = Wl, i) {
  return _l(t, e, r, n, {
    threshold: o,
    resolveEtching: i,
    beforePaint: s,
    loadImages: a,
    height: E
  });
}
async function _l(t, e, r, n, o) {
  const { threshold: s, beforePaint: a, loadImages: i, height: d } = o, l = Gt(e);
  if (l.length) {
    for (const S of l) {
      t.save();
      try {
        Hi(t, S), await _l(t, S.face, r, n, {
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
        const k = e.frameTemplate === "battle", x = k ? 523 : T, M = k ? 375 : d, R = Ft(e).art, L = k ? zr(R) : [
          R[0] * x,
          R[1] * M,
          R[2] * x,
          R[3] * M
        ], G = S.images.get(e.illustration) ?? C;
        t.save(), k && (t.translate(0, d), t.rotate(-Math.PI / 2), t.scale(d / 523, T / 375)), t.beginPath();
        const A = Fr(e), F = k ? zr(A) : [
          A[0] * x,
          A[1] * M,
          A[2] * x,
          A[3] * M
        ];
        t.rect(...F), t.clip(), t.imageSmoothingQuality = "low";
        const O = Jr(e, L, x, M, k ? -90 : 0);
        if (e.illustrationCrop) {
          const K = e.illustrationCrop, Y = Kr(
            G.width * K[2],
            G.height * K[3],
            O,
            e.artPlacement
          );
          t.drawImage(
            C,
            K[0] * C.width,
            K[1] * C.height,
            K[2] * C.width,
            K[3] * C.height,
            ...Y
          );
        } else
          t.drawImage(
            C,
            ...Kr(G.width, G.height, O, e.artPlacement)
          );
        t.restore();
      }
    } catch {
    } finally {
      S?.dispose();
    }
  }
  if (n.throwIfAborted(), !e.setCode || e.printingElements?.setSymbol?.hidden) return;
  const [u, h, m, c] = Ft(e).stamp, g = u * T, f = h * d, y = m * T, b = c * d, p = Id(e), w = await i([p], n);
  try {
    await a?.(), n.throwIfAborted();
    const S = p ? w.images.get(p) : null;
    t.save();
    try {
      if (e.printingElements?.setSymbol?.offset && t.translate(...e.printingElements.setSymbol.offset), t.globalAlpha = 0.68, S) {
        const v = await ef(S, p, e.setSymbolMask, n);
        try {
          n.throwIfAborted();
          const C = Math.min(y / v.value.width, b / v.value.height);
          t.drawImage(
            v.value,
            g + (y - v.value.width * C) / 2,
            f + (b - v.value.height * C) / 2,
            v.value.width * C,
            v.value.height * C
          );
        } finally {
          v.release();
        }
      } else
        t.translate(g, f), t.scale(y / 100, b / 100), t.fillStyle = "white", t.fill(new Path2D(cd)), t.font = "bold 43px Georgia", t.textAlign = "center", t.textBaseline = "alphabetic", t.fillText(pd(e.setCode), 50, 65);
    } finally {
      t.restore();
    }
  } finally {
    w.dispose();
  }
}
function nf(t) {
  return t.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const of = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, Oa = /* @__PURE__ */ new WeakMap();
function sf(t, e) {
  let r = Oa.get(e);
  if (r || (r = new Path2D(e.path), Oa.set(e, r)), t.save(), e.viewBox) {
    const [n, o, s, a] = e.viewBox;
    t.scale(24 / s, 24 / a), t.translate(-n, -o);
  }
  e.transform && t.transform(...e.transform), e.filled ? (t.fillStyle = t.strokeStyle, t.fill(r)) : t.stroke(r), t.restore();
}
function $a(t, e, r, n, o = !1) {
  const s = T * 0.105, a = T * 0.015, i = Math.floor(T * 0.9 / (s + a));
  if (e.forEach((c, g) => {
    t.save(), t.translate(
      T * 0.05 + g % i * (s + a),
      E * 0.13 + Math.floor(g / i) * (s + a)
    ), t.fillStyle = "#17201fed", t.strokeStyle = "#c6af7977", t.lineWidth = 1, t.beginPath(), t.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2), t.fill(), t.stroke(), t.translate(s * 0.14, s * 0.14), t.scale(s * 0.72 / 24, s * 0.72 / 24), t.strokeStyle = "#f3e9cf", t.lineWidth = 1.8, t.lineCap = "round", t.lineJoin = "round", sf(t, c), t.restore();
  }), r?.power == null || r.toughness == null) return;
  t.save();
  const d = of[o ? "inspect" : "table"], l = T * d.width, u = E * d.height, h = T * (1 - d.right - d.width), m = E * (1 - d.bottom - d.height);
  n ? t.drawImage(n, h, m, l, u) : (t.fillStyle = "#eee5cf", t.strokeStyle = "#746854", t.lineWidth = 2, t.beginPath(), t.roundRect(
    h + l * (o ? 0.14 : 0.1),
    m + u * (o ? 0.19 : 0.18),
    l * (o ? 0.72 : 0.8),
    u * (o ? 0.62 : 0.64),
    u * 0.12
  ), t.fill(), t.stroke()), t.font = `bold ${T * (o ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.fillText(
    `${r.power}/${r.toughness}`,
    h + l / 2,
    o ? m + u / 2 - T * 0.01 : m + u * 0.48,
    l * 0.72
  ), t.restore();
}
function af(t) {
  const e = typeof t == "number" ? t : t === "table" ? 244 : t === "native" ? 488 : t === "inspect" ? 732 : NaN, r = Math.round(e * E / T);
  if (!Number.isInteger(e) || e < 1 || r < 1 || e * r > 4194304)
    throw RangeError("Invalid card texture tier");
  return [e, r];
}
function Yf(t) {
  return t.currentStats?.power != null && t.currentStats.toughness != null && t.statusLayout !== "inspect" ? { ...t, statusLayout: "inspect" } : t;
}
function qf(t, e) {
  if (t.custom)
    return JSON.stringify([
      "custom-face-v1",
      t.custom.key,
      e,
      t.layer ?? "face",
      t.layer === "etching" ? t.etchThreshold ?? 20 : null
    ]);
  const r = t.face, n = co(r, t.layer === "etching"), o = t.currentStats?.power != null && t.currentStats.toughness != null ? [t.currentStats.power, t.currentStats.toughness] : null;
  return JSON.stringify([
    Ue,
    P,
    "canvas-face-v148",
    ["silhouette-v2", pl(r)],
    ud(r),
    t.paintLayer ?? null,
    t.rulesText !== !1,
    e,
    t.printingId,
    t.layer === "etching" ? null : t.printedImage,
    n,
    t.layer ?? "face",
    t.layer === "etching" ? t.etchThreshold ?? 14 : null,
    t.layer === "etching" ? null : [
      (t.emblems ?? []).map((s) => [
        s.path,
        s.viewBox ?? null,
        s.transform ?? null,
        !!s.filled
      ]),
      o,
      o ? t.statusLayout ?? e : null
    ]
  ]);
}
function co(t, e) {
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
    o.map((s) => [s.x, s.y, s.width, s.height, s.rotation, co(s.face, e)]),
    !e && Zo(t),
    !e && Oi(t),
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
    st(t) ? [Zt(t), Rt(t)] : null,
    t.borderColor ?? null,
    t.frameAssetFamily ?? null,
    t.frameTreatment ?? null,
    t.frameTemplate ?? null,
    t.futureTreatment ?? null,
    t.defense ?? null,
    t.faces?.map((s) => co(s, e)) ?? null,
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
    Ag(t),
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
    U(t),
    ...t.printingOmissions?.length ? [t.printingOmissions] : [],
    ...t.blackBorderLift ? [["border-ink", t.blackBorderLift]] : []
  ];
}
function lf(t) {
  return I(af(t));
}
async function Hf(t, e, r, n) {
  if (r.throwIfAborted(), n?.output === "r8" && t.layer !== "etching")
    throw Error("R8 composition requires the etching layer");
  const o = async (i) => {
    if (n?.output !== "r8") {
      const d = await Hl(i, n?.output === "bitmap");
      return r.aborted && (Or(d), r.throwIfAborted()), d;
    }
    try {
      return r.throwIfAborted(), Zl(i, "alpha");
    } finally {
      Or(i);
    }
  };
  if (t = { ...t, face: le(t.face) }, ts(t.face), Qa(t.face), Po(t.face), t.custom) {
    await n?.beforePaint?.(), r.throwIfAborted();
    const i = await t.custom.compose(
      e,
      r,
      t.layer ?? "face",
      t.etchThreshold
    );
    return r.aborted && (Or(i), r.throwIfAborted()), o(i);
  }
  const s = n?.loadImages ?? Wl, a = lf(e);
  try {
    const i = a.getContext("2d", {
      willReadFrequently: !!n?.cpuPixels
    });
    if (!i) throw new Error("Card composition needs Canvas2D.");
    if (i.imageSmoothingEnabled = !0, i.imageSmoothingQuality = "high", i.scale(a.width / T, a.height / E), t.layer === "etching")
      return await rf(
        i,
        t.face,
        t.printingId,
        r,
        t.etchThreshold,
        n?.beforePaint,
        s,
        n?.resolveEtching
      ), await o(a);
    i.fillStyle = "#090806", i.fillRect(0, 0, T, E);
    const d = t.currentStats?.power != null && t.currentStats.toughness != null ? Ce(U(t.face)).pt : null;
    if (t.printedImage) {
      const c = e !== "table" ? nf(t.printedImage) : t.printedImage;
      d && await (n?.loadFonts ?? La)();
      const g = await s(d ? [c, d] : [c], r);
      try {
        const f = g.images.get(c);
        if (f && !r.aborted) {
          if (await n?.beforePaint?.(), r.throwIfAborted(), i.drawImage(f, 0, 0, T, E), t.paintLayer !== "artwork" && t.face.blackBorderLift && (t.face.borderColor ?? "black") === "black") {
            if (!Number.isFinite(t.face.blackBorderLift) || t.face.blackBorderLift < 0 || t.face.blackBorderLift > 0.2)
              throw Error("Invalid black border lift");
            const y = Math.round(t.face.blackBorderLift * 255), b = T * 0.035;
            i.save(), i.globalCompositeOperation = "lighten", i.fillStyle = `rgb(${y},${y},${y})`, i.beginPath(), i.rect(0, 0, T, E), i.rect(b, b, T - 2 * b, E - 2 * b), i.fill("evenodd"), i.restore();
          }
          return $a(
            i,
            t.emblems ?? [],
            t.currentStats,
            d ? g.images.get(d) : void 0,
            t.statusLayout === "inspect" || e === "inspect"
          ), Ga(i, t.face), await o(a);
        }
      } finally {
        g.dispose();
      }
    }
    t.paintLayer !== "artwork" && await Promise.all([
      (n?.loadFonts ?? La)(),
      Nt(t.face) ? nm(t.face) : zg(t.face),
      ch(t.face),
      tt(t.face) === "saga" ? im() : Promise.resolve(),
      Cr(t.face) || mn(t.face) ? dl() : Promise.resolve(),
      st(t.face) || Nt(t.face) === "old" || wr(t.face, "W") === "historic-font" ? (n?.loadRetroFont ?? Tg)() : Promise.resolve()
    ]), r.throwIfAborted();
    const l = await s(Fl(t.face), r);
    let u, h, m;
    try {
      t.paintLayer !== "artwork" && (u = await Gm(t.face, l.images, r)), t.paintLayer !== "artwork" && (h = await Hm(t.face, u?.images ?? l.images, r)), m = t.paintLayer === "artwork" ? { images: l.images, dispose() {
      } } : await vh(
        t.face,
        h?.images ?? u?.images ?? l.images,
        r
      ), await n?.beforePaint?.(), r.throwIfAborted();
      const c = m.images;
      if (ad(
        i,
        t.rulesText !== !1,
        () => au(
          i,
          t.face,
          () => Ul(
            i,
            t.face,
            c,
            E,
            !1,
            n?.underArt,
            t.paintLayer
          )
        )
      ), t.paintLayer !== "artwork" && t.face.blackBorderLift && (t.face.borderColor ?? "black") === "black") {
        if (!Number.isFinite(t.face.blackBorderLift) || t.face.blackBorderLift < 0 || t.face.blackBorderLift > 0.2)
          throw Error("Invalid black border lift");
        const g = Math.round(t.face.blackBorderLift * 255), f = T * 0.035;
        i.save(), i.globalCompositeOperation = "lighten", i.fillStyle = `rgb(${g},${g},${g})`, i.beginPath(), i.rect(0, 0, T, E), i.rect(f, f, T - 2 * f, E - 2 * f), i.fill("evenodd"), i.restore();
      }
      return $a(
        i,
        t.emblems ?? [],
        t.currentStats,
        d ? l.images.get(d) : void 0,
        t.statusLayout === "inspect" || e === "inspect"
      ), Ga(i, t.face), await o(a);
    } finally {
      m?.dispose(), h?.dispose(), u?.dispose(), l.dispose();
    }
  } catch (i) {
    throw a.width = a.height = 0, i;
  }
}
function Ga(t, e) {
  t.save(), t.setTransform(
    t.canvas.width / T,
    0,
    0,
    t.canvas.height / E,
    0,
    0
  ), t.globalCompositeOperation = "destination-in", t.globalAlpha = 1, t.shadowColor = "transparent", t.filter = "none", t.fillStyle = "#000", t.beginPath(), t.roundRect(0, 0, T, E, pl(e) * T), t.fill(), t.restore();
}
function Ul(t, e, r, n = E, o = !1, s, a) {
  if (e = le(e), e.frameTemplate) {
    mh(t, e, r, a, s);
    return;
  }
  if (mn(e)) {
    qh(t, e, r, s, a);
    return;
  }
  if (Cr(e)) {
    _h(t, e, r, s, a);
    return;
  }
  if (Te(e)) {
    dm(t, e, r, s, a);
    return;
  }
  if (Nt(e)) {
    rm(t, e, r, s, a);
    return;
  }
  if (e.frameAssetFamily) {
    Ng(t, e, r, s, a);
    return;
  }
  if (st(e)) {
    Cg(t, e, r, s, a);
    return;
  }
  if (tt(e) === "saga") {
    am(t, e, r, s, a);
    return;
  }
  const i = Gt(e);
  if (i.length) {
    t.fillStyle = At(e) ?? Pt(e.setCode, e.borderColor).border, t.fillRect(0, 0, T, E);
    for (const B of i)
      t.save(), Hi(t, B), Ul(
        t,
        B.face,
        r,
        B.height * T / B.width,
        !0,
        s,
        a
      ), t.restore();
    if (a === "artwork") return;
    oo(t, e), Zo(e) && ee(t) && (t.font = '14px "CardRenderer MTG MPlantin", Georgia', t.fillStyle = "white", t.textAlign = "center", t.textBaseline = "middle", t.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      T / 2,
      E - 12,
      T * 0.9
    ));
    return;
  }
  const d = (B) => [
    B[0] * T,
    B[1] * n,
    B[2] * T,
    B[3] * n
  ];
  t.fillStyle = At(e) ?? Pt(e.setCode, e.borderColor).border, t.fillRect(0, 0, T, n);
  const l = Ft(e), u = tt(e);
  if (a === "artwork") {
    _t(t, e, r, d(l.art), a);
    return;
  }
  const h = U(e), m = Ce(h, u), g = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[h.boxes] ?? "#827d72", f = (B, q, ut = "top") => {
    const Lt = r.get(B);
    if (!Lt) return !1;
    const [Kt, bn, wn, Sn] = d(q);
    t.save(), t.beginPath(), t.rect(Kt, bn, wn, Sn), t.clip();
    const ds = ut === "stretch" ? Sn : Lt.height * wn / Lt.width;
    return t.drawImage(
      Lt,
      Kt,
      ut === "bottom" ? bn + Sn - ds : bn,
      wn,
      ds
    ), t.restore(), !0;
  }, [y, b, p, w] = d(h.legendary ? l.legendaryBackground : l.background);
  if (t.save(), t.beginPath(), t.roundRect(y, b, p, w, [
    { x: p * 0.01282, y: w * 962e-5 },
    { x: p * 0.01282, y: w * 962e-5 },
    { x: p * 0.06838, y: w * 0.05128 },
    { x: p * 0.06838, y: w * 0.05128 }
  ]), t.clip(), o) {
    const B = g.slice(1).match(/../g).map(
      (q, ut) => Math.round(parseInt(q, 16) * 0.62 + [244, 236, 217][ut] * 0.38)
    );
    t.fillStyle = `rgb(${B.join(",")})`, t.fillRect(y, b, p, w);
  }
  const S = r.get(m.background), v = u.startsWith("planeswalker");
  if (S && v ? Ma(t, S, y, b, p, u === "planeswalker-large") : S ? t.drawImage(
    S,
    y,
    b + (h.legendary ? J.legendaryBackgroundLift : 0),
    p,
    o ? w : S.height * p / S.width
  ) : (t.fillStyle = g, t.fillRect(y, b, p, w)), t.restore(), t.fillStyle = "#e3d8bb", !r.has(m.frame))
    if (u === "adventure")
      for (const B of pn(e).filter((q) => q.kind === "rules" && !q.color))
        t.fillRect(B.x, B.y, B.width, B.height);
    else t.fillRect(...d(l.rules));
  r.has(m.boxes) || (t.fillRect(...d(l.title)), t.fillRect(...d(l.type))), t.fillStyle = "#80745c", v || t.fillRect(...d(l.art));
  const C = r.get(m.frame);
  if (C && u === "normal" && !o) {
    const B = Ro(e);
    Qm(
      t,
      h,
      B,
      () => Pa(t, C, h.legendary, l.frame, !0, B)
    ), Zm(t, h, B), tc(t, h, B);
  }
  if (s && (t.save(), t.beginPath(), t.rect(0, 0, T, n), t.clip(), t.resetTransform(), t.drawImage(s, 0, 0, t.canvas.width, t.canvas.height), t.restore()), u === "normal" && !o) {
    const [B, q, ut, Lt] = d(l.art), Kt = cr.artRim;
    t.fillStyle = "#090806", t.fillRect(B - Kt, q - Kt, ut + 2 * Kt, Lt + 2 * Kt);
  }
  if (_t(t, e, r, d(l.art), a), v && Pg(t, e), C && v) {
    const [B, q, ut] = d(l.frame);
    Ma(t, C, B, q, ut, u === "planeswalker-large");
  } else C && u !== "normal" && Pa(t, C, h.legendary, l.frame);
  if (h.legendary && f(m.crown, l.crown), o) {
    const B = r.get(m.boxes);
    if (B) {
      const ut = B.height * 0.104;
      t.drawImage(B, 0, 0, B.width, ut, ...d(l.title)), t.drawImage(B, 0, B.height - ut, B.width, ut, ...d(l.type));
    }
    const q = r.get(m.frame);
    t.fillStyle = "#e3d8bb", t.fillRect(...d(l.rules)), q && t.drawImage(
      q,
      q.width * 0.035,
      q.height * 0.675,
      q.width * 0.93,
      q.height * 0.325,
      ...d(l.rules)
    );
  } else {
    const B = v && ["Colourless", "Artifact", "Land"].includes(h.boxes);
    f(m.boxes, l.title), B && (t.save(), t.globalAlpha *= Ol, f(m.boxes, l.title), t.restore());
    const q = r.get(m.boxes);
    v && q ? _g(t, q, l.type, B) : (f(m.boxes, l.type, "bottom"), u === "normal" && q && (Yg(t, q, d(l.type)), qg(t, d(l.type), h.boxes)));
  }
  o || Qi(t, e, r), t.fillStyle = "#17140f", t.textBaseline = "middle", t.textAlign = "left";
  const [k, x, M, R] = d(l.title), L = k + J.plateLeft + (u === "normal" ? 1 : 0), G = cn(e), A = Wu(e), F = e.manaSymbols ?? [], O = J.manaSize * A, K = J.manaGap + (G?.spacing ?? 0), Y = F.length * O + Math.max(0, F.length - 1) * K, lt = k + M - J.plateRight, St = lt - Y, dt = [
    St,
    x + R / 2 - O / 2 + J.manaLift / 2,
    Y,
    O
  ], z = F.length ? we(dt, G) : dt, N = (u === "normal" && !o ? J.normalTitleFont : J.titleFont) * A;
  t.font = `bold ${N}px "CardRenderer MTG Beleren", Georgia`, t.letterSpacing = `${J.titleTracking}px`, t.save(), u === "normal" && !o && t.translate(...ns(e, "modern")), rt(
    t,
    e.name,
    L,
    x + R / 2 + (u === "normal" ? 1 : 0),
    z[0] - L - (F.length ? J.titleGap : 0),
    N,
    !0
  ), t.restore(), t.letterSpacing = "0px", X(
    t,
    e,
    "manaCost",
    () => Ne(t, dt, G, () => {
      F.forEach(
        (B, q) => et(
          t,
          B,
          St + q * (O + K),
          x + R / 2 - O / 2 + J.manaLift / 2,
          O,
          r,
          !0,
          G
        )
      );
    })
  );
  const _ = Q(e), H = r.get(_ ?? ""), ue = Ut(_), vt = de(e), he = $l(e), me = yl(e), Yt = he && u === "normal", qt = Yt ? jg : 1, Xt = J.setMargin + (Yt ? 2 : 0), [, xe, , Re] = d(l.type), ce = xe + Re / 2 + J.typeLift / 2 + (u === "normal" || v ? 2 : 0), Jt = H ? Math.min(
    J.setMaxWidth,
    J.setHeight * H.width * vt[2] / (H.height * vt[3])
  ) : 0, ne = H ? Math.min(
    Jt / (H.width * vt[2]),
    J.setHeight / (H.height * vt[3])
  ) : 0, gt = [
    lt - Xt - Jt - Jt * (qt - 1) / 2 + (v ? 1.5 : 0),
    ce - (H?.height ?? 0) * vt[3] * ne * qt / 2 - (Yt ? 1 : 0),
    (H?.width ?? 0) * vt[2] * ne * qt,
    (H?.height ?? 0) * vt[3] * ne * qt
  ], D = u === "normal" && !o ? os(e, _, gt, "component") : gt, nt = we(D, e.symbolAdjustment?.set), ft = Math.max(
    1,
    Math.min(
      lt - L - (H ? Jt * (1 + (qt - 1) / 2) + Xt + J.typeGap : 0),
      H && nt !== gt ? nt[0] - L - J.typeGap : 1 / 0
    )
  );
  t.font = `${J.typeFont * A}px "CardRenderer MTG Beleren", Georgia`, rt(
    t,
    e.typeLine ?? "",
    L + (v ? 1.5 : 0),
    ce,
    ft,
    J.typeFont * A,
    !1,
    u === "normal" && !o ? cr.typeWidthScale : 1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  ), X(
    t,
    e,
    "setSymbol",
    () => Ne(t, D, e.symbolAdjustment?.set, () => {
      H && (ue || e.setSymbol ? (t.save(), t.shadowColor = "transparent", t.drawImage(H, ...D), t.restore()) : he ? Gl(
        t,
        H,
        e.rarity,
        ...D,
        vt,
        Yt ? 1.5 : 1
      ) : me ? bl(
        t,
        H,
        me,
        e.rarity,
        ...D,
        vt,
        u === "normal"
      ) : re(
        t,
        H,
        e.setCode,
        e.rarity,
        ...D,
        vt
      ));
    })
  ), Ll(e) ? Eg(t, e, r) : u !== "normal" ? Fg(t, e, r) : Da(t, e, r) || Tt(t, tl(t, e, n, A), r);
  const mt = hd(e);
  if (mt && u !== "leveler")
    if (f(m.pt, l.stats, "stretch"), u.startsWith("planeswalker"))
      zu(t, mt.text, d(l.stats));
    else {
      const [B, q, ut] = d(l.stats);
      t.fillStyle = "#17140f", t.font = `bold ${J.statsFont}px "CardRenderer MTG Beleren", Georgia`, t.textAlign = "center", t.textBaseline = "middle", ht(
        t,
        mt.text,
        B + ut / 2,
        q + J.statsLine / 2 + (u === "normal" ? 2 : 0),
        ut,
        e.textInk
      );
    }
  o || oo(t, e);
}
function Pa(t, e, r, n = Z.frame, o = !1, s = 0) {
  const [a, i, d, l] = df(n), u = s, h = a + u, m = d - 2 * u, c = Math.min(e.height, l * e.width / d), g = c * d / e.width, f = t.getTransform().a, y = () => {
    if (!o) {
      t.drawImage(e, 0, 0, e.width, c, h, i, m, g);
      return;
    }
    const b = 424, p = 436;
    t.save(), t.beginPath(), t.rect(0, 0, T, b), t.rect(0, p, T, E - p), t.clip(), t.drawImage(e, 0, 0, e.width, c, h, i, m, g), t.restore(), t.save(), t.beginPath(), t.rect(0, b, T, p - b), t.clip(), t.drawImage(e, 0, 0, e.width, c, h, i - 1, m, g), t.restore();
  };
  t.save(), t.shadowColor = "black", t.shadowOffsetX = -394e-5 * T * f, t.shadowOffsetY = 394e-5 * T * f, t.shadowBlur = 236e-5 * T * f, y(), r || (t.shadowColor = "#ffffffa0", t.shadowOffsetX = 157e-5 * T * f, t.shadowOffsetY = -315e-5 * T * f, t.shadowBlur = 157e-5 * T * f, y()), t.restore();
}
function df(t) {
  return [t[0] * T, t[1] * E, t[2] * T, t[3] * E];
}
const uf = [
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
], yn = Object.freeze(
  uf.map((t) => Object.freeze(t))
), Xf = 1;
function jl(t, e) {
  if (e.family === "match") return { ...t };
  const {
    frameStyle: r,
    frameTemplate: n,
    frameAssetFamily: o,
    frameTreatment: s,
    futureTreatment: a,
    borderColor: i,
    setSymbol: d,
    symbolAdjustment: l,
    setSymbolSource: u,
    setSymbolMask: h,
    legalText: m,
    collectorFormat: c,
    collectorTotal: g,
    collectorLanguage: f,
    collectorSetCode: y,
    printingElements: b,
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
function Dl(t, e) {
  const r = yn.find((o) => o.id === e);
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
    r.family === "eighth" && Mt(jl({ ...t, layout: "normal" }, r));
  } catch (o) {
    return { supported: !1, reason: o.message };
  }
  return { supported: !0 };
}
function _e(t, e) {
  if (!e || typeof e != "object" || Array.isArray(e) || Object.keys(e).some((a) => !["preset", "overrides", "art"].includes(a)))
    throw Error("Invalid printing selection");
  const r = Dl(
    e.overrides?.frameColors === void 0 ? t : { ...t, frameColors: e.overrides.frameColors },
    e.preset
  );
  if (!r.supported) throw Error(r.reason);
  const n = yn.find((a) => a.id === e.preset);
  let o = jl(t, n);
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
        Ya(i), o.calibration = structuredClone(i);
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
          if (!Array.isArray(i) || i.length > 5 || !i.every((d) => typeof d == "string" && /^[WUBRG]$/.test(d)) || new Set(i).size !== i.length)
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
    Po(o);
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
  if (o.printingElements && Object.keys(o.printingElements).length && !nn(o).supported)
    throw Error(nn(o).reason);
  if (Qa(o), o.collectorTotal !== void 0 && o.collectorTotal !== null && (!Number.isInteger(o.collectorTotal) || o.collectorTotal < 1 || o.collectorTotal > 99999))
    throw Error("Invalid collector total");
  if (o.collectorLanguage !== void 0 && !/^[A-Za-z]{2,5}$/.test(o.collectorLanguage))
    throw Error("Invalid collector language");
  if (o.frameTemplate === "future" && pi(o), e.art !== void 0 && (o = Nu(o, e.art)), t.layout === "split" && t.faces && (o = {
    ...o,
    faces: t.faces.map(
      (a) => _e({ ...a, layout: "normal" }, e)
    )
  }), typeof o.calibration == "object" && !Ye(o))
    throw Error("M21 calibration requires a modern frame.");
  return le(o);
}
function nn(t) {
  return !t.faces?.length && (!t.layout || ["normal", "token"].includes(t.layout)) && (!t.frameTemplate || t.frameTemplate === "future") && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") && !/^Level up\b/m.test(t.rulesText ?? "") ? { supported: !0, elements: ["artist", "legal", "collector", "manaCost", "setSymbol"] } : {
    supported: !1,
    elements: [],
    reason: "Element controls currently require an ordinary single face or Futureshifted template."
  };
}
function hf(t) {
  const e = {
    setCode: t.set?.toUpperCase(),
    symbolStyle: "original"
  };
  return t.frame === "future" ? (e.frameTemplate = "future", t.textless && (e.futureTreatment = "full-art")) : t.frame === "1993" || t.frame === "1997" ? e.frameStyle = "retro" : t.frame === "2003" ? (e.frameStyle = "modern", e.frameAssetFamily = "eighth") : t.frame === "2015" && (e.frameStyle = "modern"), t.frame_effects?.includes("colorshifted") && (e.frameStyle = "modern", e.frameAssetFamily = "eighth", e.frameTreatment = "colorshifted", delete e.frameTemplate, delete e.futureTreatment), ["black", "white", "silver"].includes(t.border_color ?? "") && (e.borderColor = t.border_color), t.security_stamp && ["none", "oval", "triangle", "acorn", "circle", "arena", "heart"].includes(t.security_stamp) ? e.securityStamp = t.security_stamp : e.securityStamp = "none", e;
}
function mf(t) {
  const e = t.rulesParagraphs ? t.rulesParagraphs.flatMap((o) => o.runs.map((s) => s.text)).join(`
`) : t.rulesText ?? "", r = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...[...e.matchAll(/\{([^}]+)\}/g)].map((o) => o[1])
  ]), n = rs(t);
  return {
    frame: nu(t) || !!n || bt(t) && ke(t) && ui(t).length > 0,
    manaSymbols: [
      .../* @__PURE__ */ new Set([
        ...[...r].filter((o) => !!Si(t, /^\d+$/.test(o) ? "N" : o)),
        ...n?.glyph ? [n.color] : []
      ])
    ]
  };
}
const Wa = (t) => "mask" in t || t.hueDegrees !== 0 || t.saturationScale !== 1 || t.brightnessScale !== 1 || t.rgbScale !== void 0 || t.valueGamma !== void 0;
function cf(t) {
  const e = Qo(t), { face: r, materials: n, assets: o } = e, s = Object.entries(n), a = (p) => {
    if (!p.length) return { status: "source", assets: [] };
    const w = p.filter((S) => e.fallbackAssets.includes(S));
    return {
      status: w.length === p.length ? "fallback" : w.length ? "mixed" : "measured",
      ...w.length === p.length ? { profile: "m21-modern", revision: 1 } : w.length ? {} : { profile: `printing:${r.setCode?.toLowerCase() ?? ""}`, revision: 1 },
      assets: p
    };
  }, i = a(
    s.filter(
      ([p, w]) => Wa(w) && ("mask" in w || p === o.boxes || p.includes("/pt_boxes/"))
    ).map(([p]) => p)
  ), d = a(
    s.filter(
      ([p, w]) => Wa(w) && (p !== o.boxes && !p.includes("/pt_boxes/") || "mask" in w)
    ).map(([p]) => p)
  ), l = mf(r), u = rs(r), h = u?.frame ?? (bt(r) ? ir : void 0);
  if (h && l.frame)
    for (const p of [d, i])
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
    (p) => no(r, /^\d+$/.test(p) ? "N" : p)
  ), f = g.length ? {
    status: "measured",
    profile: `printing:${r.setCode?.toLowerCase() ?? ""}`,
    revision: 1,
    assets: [],
    symbols: g
  } : u?.glyph ? { status: "measured", profile: "printing:8ed", revision: 1, assets: [u.glyph] } : { status: "source", assets: [] }, y = e.border ? {
    status: e.fallbackStock ? "fallback" : "measured",
    profile: e.fallbackStock ? "m21-modern" : `printing:${r.setCode?.toLowerCase() ?? ""}`,
    revision: 1,
    color: e.border,
    assets: s.filter(([, p]) => p.outerStock).map(([p]) => p)
  } : { status: "source", assets: [] }, b = [];
  return (e.fallbackStock || e.fallbackAssets.length) && b.push(
    "Using provisional M21 defaults for compatible materials; this is not a measured calibration of this printing."
  ), (r.calibration === "auto" || typeof r.calibration == "object") && [d, i, m].some((p) => p.status === "source") && b.push("Some frame materials retain source colors or ink levels."), {
    mode: r.calibration ?? "legacy",
    components: { frame: d, textBox: i, border: y, interiorInk: m, manaSymbols: f },
    notices: b
  };
}
function Jf(t) {
  return za.map((e) => ({
    ...e,
    supported: Ye(t),
    ...Ye(t) ? {} : { reason: "Requires a modern frame." }
  }));
}
const gf = /^[a-z0-9][a-z0-9-]{0,47}$/;
function pt(t, e) {
  if (!t || typeof t != "object" || Array.isArray(t) || ![Object.prototype, null].includes(Object.getPrototypeOf(t)))
    throw Error("Invalid " + e);
}
function yt(t, e, r) {
  if (Object.keys(t).some((n) => !e.includes(n)))
    throw Error("Unknown " + r + " field");
}
function Ur(t) {
  if (typeof t != "string" || !gf.test(t)) throw Error("Invalid printing style ID");
}
const ff = [
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
function hr(t) {
  if (pt(t, "printing layer"), yt(t, ["overrides", "art"], "printing layer"), t.overrides !== void 0) {
    if (pt(t.overrides, "printing overrides"), yt(t.overrides, ff, "printing override"), t.overrides.elements !== void 0) {
      pt(t.overrides.elements, "printing elements"), yt(
        t.overrides.elements,
        ["artist", "legal", "collector", "manaCost", "setSymbol"],
        "printing element"
      );
      for (const e of Object.values(t.overrides.elements))
        pt(e, "printing element"), yt(e, ["hidden", "offset"], "printing element");
    }
    if (t.overrides.symbolAdjustment !== void 0) {
      pt(t.overrides.symbolAdjustment, "symbol adjustment"), yt(t.overrides.symbolAdjustment, ["mana", "set"], "symbol adjustment");
      for (const [e, r] of Object.entries(t.overrides.symbolAdjustment))
        if (pt(r, "symbol transform"), yt(
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
          pt(r.glyphs, "mana glyphs"), yt(r.glyphs, ["W", "U", "B", "R", "G"], "mana glyph");
          for (const n of Object.values(r.glyphs))
            pt(n, "mana glyph"), yt(n, ["scale", "dx", "dy"], "mana glyph");
        }
    }
  }
  if (t.art !== void 0 && (pt(t.art, "art placement"), yt(t.art, ["mode", "zoom", "focalPoint", "paperOpacity"], "art placement")), t.overrides?.futureTreatment !== void 0 && !["regular", "full-art", "clear"].includes(t.overrides.futureTreatment))
    throw Error("Invalid future treatment");
  _e(
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
  ), t.art && _e(
    { name: "Art validation", typeLine: "Creature", colors: ["U"], frameTemplate: "future" },
    { preset: "match", art: { mode: "behind-text", ...t.art } }
  );
}
function Nl(t) {
  if (pt(t, "printing style"), yt(
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
  if (Ur(t.id), typeof t.label != "string" || !t.label.trim() || t.label.length > 160)
    throw Error("Invalid printing style label");
  if (t.collectorSetCode !== void 0 && (typeof t.collectorSetCode != "string" || !/^[-A-Za-z0-9_]{1,16}$/.test(t.collectorSetCode)))
    throw Error("Invalid collector set code");
  if (t.defaults !== void 0 && hr(t.defaults), !Array.isArray(t.frames) || !t.frames.length || t.frames.length > 64)
    throw Error("A printing style needs 1..64 frame options");
  const e = /* @__PURE__ */ new Set();
  for (const r of t.frames) {
    if (pt(r, "frame option"), yt(r, ["id", "label", "selection"], "frame option"), Ur(r.id), e.has(r.id)) throw Error("Duplicate frame option");
    if (e.add(r.id), typeof r.label != "string" || !r.label.trim() || r.label.length > 160)
      throw Error("Invalid frame label");
    if (pt(r.selection, "frame selection"), yt(r.selection, ["preset", "overrides", "art"], "frame selection"), !yn.some((s) => s.id === r.selection.preset))
      throw Error("Unknown frame preset");
    const { preset: n, ...o } = r.selection;
    hr(o);
  }
  if (!e.has(t.defaultFrame)) throw Error("Unknown default frame");
  if (t.symbols !== void 0) {
    pt(t.symbols, "symbol pack"), yt(
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
      if (pt(n, "frame rule"), yt(n, ["id", "when", "frame", "defaults"], "frame rule"), Ur(n.id), r.has(n.id)) throw Error("Duplicate frame rule");
      if (r.add(n.id), !e.has(n.frame)) throw Error("Unknown rule frame");
      if (pt(n.when, "frame condition"), yt(
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
      n.defaults !== void 0 && hr(n.defaults);
    }
  }
  return structuredClone(t);
}
function pf(t) {
  pt(t, "printing style choice"), yt(t, ["frame", "overrides", "art"], "printing style choice");
  const { frame: e, ...r } = t;
  e !== void 0 && Ur(e), hr(r);
}
const Kf = 1;
function on(t) {
  return Array.isArray(t) ? t.map(on) : t && typeof t == "object" ? Object.fromEntries(
    Object.entries(t).filter(([, e]) => e !== void 0).map(([e, r]) => [e, on(r)])
  ) : t;
}
function yf(t, ...e) {
  const r = structuredClone(t);
  for (const n of e) {
    if (hr(n), n.art && (r.art = { mode: "window", ...r.art, ...on(structuredClone(n.art)) }), !n.overrides) continue;
    const o = r.overrides || {}, s = on(structuredClone(n.overrides)), a = { ...o, ...s };
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
function bf(t, e) {
  const r = t.faces?.length ? t.faces : [t], n = Dr(
    r.flatMap(
      (a) => e.colorSource === "card" ? [...a.colors || []] : W({ ...a, frameColors: void 0 })
    )
  );
  if (e.colors && Dr(e.colors).join("") !== n.join("") || e.colorCount && (n.length < e.colorCount[0] || n.length > e.colorCount[1]))
    return !1;
  const o = U(t);
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
    const d = e[a];
    if (d && !d.includes(i)) return !1;
  }
  return !0;
}
function wf(t, e) {
  const r = {};
  if (t.collectorSetCode !== void 0 && (r.collectorSetCode = t.collectorSetCode), t.symbols) {
    const n = e.rarity || "common", o = Object.hasOwn(t.symbols, n) ? t.symbols[n] : t.symbols.default, s = Object.hasOwn(t.symbols, n) && t.symbols[n] === null;
    (s || o !== void 0) && (r.setSymbol = s ? null : o);
  }
  return { overrides: r };
}
function Vf(t, e, r = {}, n = {}) {
  const o = Yl.includes(e) ? e : Nl(e);
  return o.frames.map((s) => {
    try {
      const a = vf(t, o, r, { ...n, frame: s.id });
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
function Sf(t, e) {
  return e === void 0 ? t : {
    ...t,
    frameColors: e,
    ...t.faces ? { faces: t.faces.map((r) => ({ ...r, frameColors: e })) } : {}
  };
}
function vf(t, e, r = {}, n = {}) {
  const o = Yl.includes(e) ? e : Nl(e);
  for (const v of [r, n])
    if (pf(v), v.frame !== void 0 && !o.frames.some((C) => C.id === v.frame))
      throw Error("Unknown chosen frame");
  const { frame: s, ...a } = r, { frame: i, ...d } = n, l = i ?? s, u = o.rules?.find((v) => bf(t, v.when));
  let h = i !== void 0 ? "face" : s !== void 0 ? "card" : u ? "rule" : "default", m = o.frames.find((v) => v.id === (l ?? u?.frame ?? o.defaultFrame));
  const c = [], g = (v, C = v.selection.preset) => yf(
    { ...v.selection, preset: C },
    o.defaults || {},
    wf(o, t),
    u?.defaults || {},
    a,
    d
  );
  let f = g(m);
  const y = (v) => {
    const C = g(v), k = Dl(
      Sf(t, C.overrides?.frameColors),
      C.preset
    );
    if (!k.supported) return k;
    try {
      return _e(t, {
        preset: C.preset,
        overrides: Object.fromEntries(
          Object.entries(C.overrides || {}).filter(
            ([x]) => !["elements", "symbolAdjustment"].includes(x)
          )
        )
      }), k;
    } catch (x) {
      return { supported: !1, reason: x.message };
    }
  }, b = y(m);
  if (!b.supported) {
    if (l !== void 0) throw Error(b.reason);
    h = "fallback";
    const v = o.frames.find((C) => C.id === o.defaultFrame);
    v.id !== m.id && y(v).supported ? (m = v, f = g(m), c.push("Automatic frame is unsupported; using the default frame. " + b.reason)) : (f = g(m, "match"), c.push("Keeping the native layout. " + b.reason));
  }
  const p = _e(t, {
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
  if (f.overrides?.elements && !nn(p).supported) {
    if (r.overrides?.elements || n.overrides?.elements)
      throw Error(nn(p).reason);
    delete f.overrides.elements, c.push("Inherited element positioning is unavailable for this layout.");
  }
  if (f.overrides?.symbolAdjustment)
    try {
      if (p.frameTemplate) throw Error("Fine symbol adjustments require an ordinary frame.");
      Po({
        ...p,
        symbolAdjustment: f.overrides.symbolAdjustment
      });
    } catch (v) {
      if (r.overrides?.symbolAdjustment || n.overrides?.symbolAdjustment) throw v;
      delete f.overrides.symbolAdjustment, c.push("Inherited symbol adjustments are unavailable for this layout.");
    }
  if (f.art && !Ji(p).modes.includes(f.art.mode)) {
    if (r.art || n.art)
      throw Error("This frame does not support the selected art placement.");
    delete f.art, c.push("Inherited artwork placement is unavailable for this frame.");
  }
  f = structuredClone(f);
  const w = _e(t, f), S = cf(w);
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
function zl(t) {
  if (t && typeof t == "object") {
    for (const e of Object.values(t)) zl(e);
    Object.freeze(t);
  }
  return t;
}
const Yl = Object.freeze(
  yn.filter((t) => !["plc-colorshifted", "fut"].includes(t.id)).map((t) => {
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
    }), zl({
      version: 1,
      id: t.id === "fut-regular" ? "fut" : t.id,
      label: t.id === "fut-regular" ? "Future Sight" : t.label,
      defaultFrame: "regular",
      frames: e,
      ...r.length ? { rules: r } : {}
    });
  })
);
function jr(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    throw Error("Expected a card object.");
  return t;
}
function j(t, e = "", r = 32768) {
  if (t == null) return e;
  if (typeof t != "string" || t.length > r) throw Error("Invalid card text.");
  return t;
}
function Fa(t) {
  if (t == null) return [];
  if (!Array.isArray(t) || t.length > 5 || !t.every((e) => typeof e == "string" && /^[WUBRG]$/.test(e)))
    throw Error("Invalid card colors.");
  return [...new Set(t)];
}
function Cf(t) {
  const e = j(t, "", 200);
  if (!/^(?:\{[0-9A-Z/∞]+\}\s*)*$/.test(e)) throw Error("Invalid mana cost.");
  return [...e.matchAll(/\{([^}]+)\}/g)].map((r) => r[1]);
}
function kf(t) {
  if (t == null) return null;
  const e = j(t, "", 4096), r = new URL(e);
  if (r.protocol !== "https:" || r.username || r.password)
    throw Error("Provider artwork requires an HTTPS URL.");
  return r.href;
}
function _a(t, e = "") {
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
function Tf(t, e, r, n) {
  const o = n.wording ?? "oracle";
  if (!["oracle", "original"].includes(o)) throw Error("Invalid wording choice.");
  if (n.symbolStyle !== void 0 && !["original", "modern"].includes(n.symbolStyle))
    throw Error("Invalid symbol style.");
  const s = {
    ...r ?? e,
    manaSymbols: al(t, e.manaSymbols ?? [])
  };
  return Oh(t, { oracle: e, original: s }, o, {
    symbolStyle: n.symbolStyle ?? "original"
  });
}
function ql(t, e, r, n = null) {
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
function Mf(t, e = {}) {
  const r = jr(t), n = j(r.name, "", 256);
  if (!n.trim()) throw Error("The Scryfall card needs a name.");
  const o = r.card_faces === void 0 ? [r] : r.card_faces;
  if (!Array.isArray(o) || !o.length || o.length > 2)
    throw Error("Supply one Scryfall card with at most two faces.");
  const s = hf({
    set: j(r.set),
    frame: j(r.frame),
    frame_effects: r.frame_effects === void 0 ? void 0 : xf(r.frame_effects),
    border_color: j(r.border_color),
    security_stamp: j(r.security_stamp),
    textless: r.textless === !0
  }), a = (h) => h.image_uris ? kf(jr(h.image_uris).art_crop) : null, d = ["common", "uncommon", "rare", "mythic", "special", "bonus"].find((h) => h === (r.rarity ?? "common"));
  if (!d) throw Error("Invalid card rarity.");
  const l = o.map((h, m) => {
    const c = jr(h), g = j(c.type_line, j(r.type_line), 512);
    if (!g.trim()) throw Error("The Scryfall face needs a type line.");
    const f = j(c.oracle_text), y = Cf(c.mana_cost), b = Fa(
      c.colors ?? c.color_indicator ?? (o.length === 1 ? r.colors : [..."WUBRG"].filter(
        (C) => y.some((k) => k.split("/").includes(C)) && (r.colors == null || Fa(r.colors).includes(C))
      ))
    ), p = Lh(
      g,
      b,
      s.setCode,
      j(r.frame),
      c.produced_mana ?? r.produced_mana
    ), w = {
      name: j(c.name, n, 256),
      typeLine: g,
      rulesText: f,
      manaSymbols: y,
      rulesParagraphs: _a(f, j(c.flavor_text))
    }, v = typeof c.printed_text == "string" || typeof c.printed_type_line == "string" || typeof c.printed_name == "string" ? {
      ...w,
      name: j(c.printed_name, w.name, 256),
      typeLine: j(c.printed_type_line, g, 512),
      rulesText: j(c.printed_text, f),
      rulesParagraphs: _a(
        j(c.printed_text, f),
        j(c.flavor_text)
      )
    } : void 0;
    return Tf(
      {
        ...Ih(s, g, f),
        ...m > 0 && ["transform", "modal_dfc", "battle", "double_faced_token"].includes(String(r.layout)) ? { securityStamp: "none" } : {},
        name: w.name,
        colors: b,
        ...p ? { frameColors: p } : {},
        rarity: d,
        artist: j(c.artist, j(r.artist), 256),
        collectorNumber: j(r.collector_number, "", 64),
        ...typeof r.lang == "string" && /^[a-z]{2,5}$/i.test(r.lang) ? { collectorLanguage: r.lang } : {},
        ...c.watermark == null && r.watermark == null ? {} : { watermark: j(c.watermark ?? r.watermark, "", 64) },
        power: c.power == null ? void 0 : j(c.power),
        toughness: c.toughness == null ? void 0 : j(c.toughness),
        loyalty: c.loyalty == null ? void 0 : j(c.loyalty),
        defense: c.defense == null ? void 0 : j(c.defense),
        illustration: a(c),
        colorCalibration: "set-hsb-v1"
      },
      w,
      v,
      e
    );
  });
  let u = j(r.layout, "normal", 64);
  if (o.length === 1 && ["split", "aftermath", "flip", "adventure", "prepare", "room"].includes(u))
    throw Error("Supply both Scryfall faces for this layout.");
  return u === "split" && /\bAftermath\b/.test(l[1]?.rulesText ?? "") && (u = "aftermath"), ql(l, u, e, o.length > 1 ? a(r) : null);
}
function xf(t) {
  if (!Array.isArray(t) || t.length > 32) throw Error("Invalid frame effects.");
  return t.map((e) => j(e, "", 64));
}
function Rf(t, e) {
  const r = t.map((a) => ({ type: a.originalType, text: a.originalText }));
  if (t.length !== 2 || !["split", "aftermath", "adventure", "prepare", "flip"].includes(e))
    return r;
  const n = (a) => j(a).replace(/\r\n?/g, `
`), o = t.map((a) => n(a.originalText));
  if (e === "flip") {
    if (!o.some((u) => /\n-{3,}\n/.test(u))) return r;
    const a = o[0].split(/\n-{3,}\n/), i = a[1]?.split(`
`);
    if (o[0] !== o[1] || a.length !== 2 || !i || i[0] !== t[1].faceName || !i[1] || !/^\S+\/\S+$/.test(i[2] ?? "") || i.length < 4)
      throw Error("Ambiguous joined MTGJSON original flip text.");
    const d = (u) => n(u).replace(/[—–-]/g, " ").replace(/\s+/g, " ").trim(), l = [t[1].originalType, t[1].type].find(
      (u) => typeof u == "string" && d(u) === d(i[1])
    ) ?? i[1];
    return [
      { type: r[0].type, text: a[0] },
      { type: l, text: i.slice(3).join(`
`) }
    ];
  }
  if (!o.some((a) => /\s+\/\/\s+/.test(a))) return r;
  const s = o[0].split(/\s+\/\/\s+/);
  if (o[0] !== o[1] || s.length !== 2)
    throw Error("Ambiguous joined MTGJSON original panel text.");
  return t.map((a, i) => {
    const d = e === "adventure" ? 1 - i : i;
    let l = s[d].trim();
    const u = [a.faceName ?? a.name, a.manaCost, a.originalType];
    if (d === 1 && u.every((y) => typeof y == "string")) {
      const y = u.join(`
`) + `
`;
      l.startsWith(y) && (l = l.slice(y.length));
    }
    const h = j(a.originalType);
    d === 1 && h && l.startsWith(h + `
`) && (l = l.slice(h.length + 1));
    const m = j(a.type), c = t[0].originalType === t[1].originalType, g = /^(Instant|Sorcery)$/.test(h) && /^(Instant|Sorcery)$/.test(m), f = e === "adventure" && /^(Instant|Sorcery)\s*[—–-]\s*Adventure$/.test(m);
    return { text: l, type: c && (g || f) ? m : a.originalType };
  });
}
function Zf(t, e = {}) {
  const r = (Array.isArray(t) ? t : [t]).map(jr), n = [...r];
  if (!r.length || r.length > 2)
    throw Error("Supply the associated records of one MTGJSON card.");
  if (e.illustrations !== void 0 && (!Array.isArray(e.illustrations) || e.illustrations.length !== r.length))
    throw Error("Supply one illustration override per input record.");
  if (r.length > 1) {
    const [l, u] = r;
    if (l.uuid !== void 0 && l.uuid === u.uuid || l.side !== void 0 && l.side === u.side || l.layout !== u.layout)
      throw Error("Supply two distinct associated MTGJSON faces with the same layout.");
    const h = (f, y) => typeof y.uuid == "string" && Array.isArray(f.otherFaceIds) && f.otherFaceIds.includes(y.uuid), m = h(l, u) || h(u, l), c = [l.uuid, u.uuid, l.otherFaceIds, u.otherFaceIds].some(
      (f) => f !== void 0
    ), g = l.name === u.name && typeof l.faceName == "string" && typeof u.faceName == "string" && l.faceName !== u.faceName;
    if ((c ? !m : !g) || l.setCode !== void 0 && u.setCode !== void 0 && l.setCode !== u.setCode || l.number !== void 0 && u.number !== void 0 && j(l.number).replace(/[ab]$/, "") !== j(u.number).replace(/[ab]$/, "") || [
      [l, u],
      [u, l]
    ].some(([f, y]) => Array.isArray(f.otherFaceIds) && !f.otherFaceIds.includes(y.uuid)))
      throw Error("The MTGJSON records are not associated faces of one card.");
    r.every((f) => typeof f.side == "string") && r.sort((f, y) => j(f.side).localeCompare(j(y.side)));
  }
  const o = r[0], s = j(o.layout, "normal", 64);
  if (r.length === 1 && ["split", "aftermath", "flip", "adventure", "prepare", "room"].includes(s))
    throw Error("Supply both MTGJSON face records for this layout.");
  const a = e.wording === "original" ? Rf(r, s) : void 0, i = r.map((l, u) => ({
    name: l.faceName ?? l.name,
    type_line: l.type,
    oracle_text: l.text ?? "",
    mana_cost: l.manaCost ?? "",
    colors: l.colors,
    produced_mana: Bh(j(l.text)),
    watermark: l.watermark,
    power: l.power,
    toughness: l.toughness,
    loyalty: l.loyalty,
    defense: l.defense,
    artist: l.artist,
    flavor_text: l.flavorText,
    printed_type_line: a?.[u]?.type ?? l.originalType,
    printed_text: a?.[u]?.text ?? l.originalText
  })), d = r.map(
    (l, u) => Mf(
      {
        ...i[u],
        set: l.setCode,
        rarity: l.rarity,
        collector_number: l.number,
        frame: l.frameVersion,
        frame_effects: l.frameEffects,
        border_color: l.borderColor,
        security_stamp: l.securityStamp,
        textless: l.isTextless
      },
      { wording: e.wording, symbolStyle: e.symbolStyle }
    )
  );
  return ql(d, s, {
    ...e,
    ...e.illustrations ? { illustrations: r.map((l) => e.illustrations[n.indexOf(l)]) } : {}
  });
}
function Qf(t, e) {
  const r = { ...t, setCalibrationCandidate: e };
  if (wt(r), !(sn(t.setCode) && t.frameStyle !== "modern" && !t.frameTemplate && !t.frameAssetFamily && (!t.borderColor || t.borderColor === "black") && (!t.layout || t.layout === "normal") && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "")) && !Et(r))
    throw Error("This printing has no set calibration adapter");
  return r;
}
export {
  Ag as $,
  Xs as A,
  lr as B,
  El as C,
  Zg as D,
  cd as E,
  md as F,
  Fl as G,
  Vg as H,
  Pt as I,
  qf as J,
  af as K,
  Ad as L,
  Rs as M,
  Df as N,
  Nf as O,
  ki as P,
  mf as Q,
  Ue as R,
  Pi as S,
  gr as T,
  Ot as U,
  Hf as V,
  yf as W,
  Du as X,
  pd as Y,
  Rg as Z,
  pn as _,
  E as a,
  U as a$,
  zf as a0,
  lf as a1,
  pl as a2,
  Id as a3,
  tt as a4,
  gd as a5,
  jt as a6,
  Ft as a7,
  Q as a8,
  hd as a9,
  _t as aA,
  et as aB,
  Pg as aC,
  Cg as aD,
  Ci as aE,
  Tt as aF,
  re as aG,
  Fg as aH,
  Ps as aI,
  _f as aJ,
  Hi as aK,
  df as aL,
  Ig as aM,
  $g as aN,
  Wf as aO,
  Of as aP,
  Jf as aQ,
  za as aR,
  nn as aS,
  Xf as aT,
  Dl as aU,
  yn as aV,
  Kf as aW,
  Vf as aX,
  Yl as aY,
  Ce as aZ,
  Nu as a_,
  Kg as aa,
  Mt as ab,
  w0 as ac,
  Zf as ad,
  Mf as ae,
  Ll as af,
  zt as ag,
  Kr as ah,
  Jr as ai,
  Yf as aj,
  st as ak,
  $ as al,
  La as am,
  Wl as an,
  Tg as ao,
  je as ap,
  be as aq,
  Dr as ar,
  tl as as,
  sf as at,
  Ne as au,
  Ul as av,
  $a as aw,
  rf as ax,
  Eg as ay,
  rt as az,
  $f as b,
  W as b0,
  cf as b1,
  _e as b2,
  vf as b3,
  hf as b4,
  g0 as b5,
  Mo as b6,
  Rt as b7,
  To as b8,
  ko as b9,
  kr as bA,
  Zo as bB,
  Gt as bC,
  Wu as bD,
  fu as bE,
  Uo as bF,
  pu as bG,
  ln as bH,
  As as bI,
  ts as bJ,
  Ya as bK,
  Nl as bL,
  Po as bM,
  Fr as bN,
  Oh as bO,
  Qf as bP,
  Me as bQ,
  mn as bR,
  Cr as bS,
  Te as bT,
  Nt as bU,
  jf as bV,
  qe as bW,
  Qg as bX,
  Xg as bY,
  Jg as bZ,
  Ja as b_,
  $t as ba,
  kg as bb,
  Zt as bc,
  m0 as bd,
  Sr as be,
  Ts as bf,
  xt as bg,
  dn as bh,
  Pf as bi,
  gi as bj,
  h0 as bk,
  pg as bl,
  Bl as bm,
  fd as bn,
  so as bo,
  Gf as bp,
  dr as bq,
  Wo as br,
  sm as bs,
  Il as bt,
  Za as bu,
  de as bv,
  Bd as bw,
  du as bx,
  Gg as by,
  Iu as bz,
  Z as c,
  J as d,
  T as e,
  Ds as f,
  Pr as g,
  Ct as h,
  of as i,
  Au as j,
  l0 as k,
  De as l,
  i0 as m,
  c0 as n,
  Vr as o,
  Dt as p,
  Fi as q,
  oe as r,
  _o as s,
  Ff as t,
  we as u,
  Ji as v,
  Uf as w,
  zr as x,
  Fo as y,
  gu as z
};
