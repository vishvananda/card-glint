import { r as $, a as Qr, f as Gu } from "./canvas-raster-DIqHyOj6.js";
import { f as In, c as ts } from "./image-cover-Bq6wMyQU.js";
import { t as gt, j as sl, k as rt, i as On, v as Fu, n as Wu, u as $n, o as es, p as _u, b as Uu } from "./modern-style-scope-DDcUW_Tp.js";
import { d as Du } from "./canvas-images-DWl3zt32.js";
function bt(t, e, r, n, o, s, a = "stats", i = () => o == null ? t.fillText(e, r, n) : t.fillText(e, r, n, o), l = (d) => t.measureText(d).width) {
  const d = a === "type" ? s?.typeLine : s?.stats;
  if (!d?.length) {
    i();
    return;
  }
  const u = l(e), h = u > 0 && o != null ? Math.min(1, o / u) : 1, m = u * h, c = t.textAlign === "right" || t.textAlign === "end" && t.direction !== "rtl" || t.textAlign === "start" && t.direction === "rtl", g = r - (t.textAlign === "center" ? m / 2 : c ? m : 0), f = a === "type" ? 1 : 0, p = (y, b, v) => {
    b <= y || v && s?.omitInk || (t.save(), t.beginPath(), t.rect(y, -1e4, b - y, 2e4), t.clip(), v && (t.fillStyle = v, t.shadowColor = "transparent"), i(), t.restore());
  };
  let w = -1e4;
  for (const y of d) {
    const b = Math.max(
      w,
      y.start === 0 ? -1e4 : g + l(e.slice(0, y.start)) * h - f
    ), v = y.end == null || y.end >= e.length ? 1e4 : g + l(e.slice(0, y.end)) * h + f;
    p(w, b), p(b, v, y.color), w = v;
  }
  p(w, 1e4);
}
function Nu(t, e, r, n, o, s) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0;
  const a = $();
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
function ar(t, e, r, n, o, s, a = "#ababab", i, l = "stats") {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, bt(t, e, r + s, n + s, o, i, l, () => {
    t.fillStyle = "#17140f", t.fillText(e, r + s, n + s, o);
  }), t.fillStyle = a, bt(t, e, r, n, o, i, l), t.restore();
}
const ju = gt("printingStocks"), zu = (t) => {
  const e = parseInt(t.slice(1), 16);
  return [(e >> 16) / 255, (e >> 8 & 255) / 255, (e & 255) / 255];
}, al = gt("printingBlackPoints");
function Ze(t) {
  return (t.colorCalibration === "set-hsb-v1" || t.colorCalibration === "early-hsb-v1") && (!t.borderColor || t.borderColor === "black") && (al[t.setCode?.toLowerCase() ?? ""] ?? []).some(
    (e) => e.set === t.setCode?.toLowerCase() && e.stock !== null
  );
}
function dn(t, e, r) {
  if (!["set-hsb-v1", "early-hsb-v1"].includes(t.colorCalibration ?? "")) return { materials: e };
  const n = al[t.setCode?.toLowerCase() ?? ""] ?? [];
  if (!n.length) return { materials: e };
  let o;
  const s = { ...e };
  for (const [a, i] of Object.entries(e)) {
    const l = JSON.stringify(i);
    for (const d of n) {
      const u = d.materials.find((g) => g.url === a && g.adjustment === l);
      if (!u) continue;
      if (d.stock && Ze(t) && (o = d.stock), u.bakedStock && o) {
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
  if (r && Ze(t)) {
    const a = (ju[t.setCode?.toLowerCase() ?? ""] ?? []).find(
      (i) => i.set === t.setCode?.toLowerCase() && r.geometry === i.geometry && r.url.startsWith(i.prefix) && (i.family === "retro" ? /^[wubrgacml]{1,2}\.png$/.test(r.url.slice(i.prefix.length)) : /^(W|U|B|R|G|WU|WB|WR|WG|UB|UR|UG|BR|BG|RG|Artifact|Gold|Colourless)\.webp$/.test(
        r.url.slice(i.prefix.length)
      ))
    );
    a && (o = a.stock, r.mask && (s[r.url] = {
      ...s[r.url] ?? { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
      outerStock: zu(o),
      outerStockMaskSource: r.mask
    }));
  }
  return { materials: s, ...o ? { stock: o } : {} };
}
const Yu = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", qu = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", Hu = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Xu = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", Ju = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-new-split-fuse.mse-style", Ku = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", Vu = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", Y = {
  RENDERER_COMPONENT_ROOT: Yu,
  KEYRUNE_ROOT: qu,
  CONJURER_ROOT: Hu,
  RETRO_ROOT: Xu,
  MSE_SPLIT_BRIDGE_ROOT: Ju,
  RETRO_SYMBOL_FONT: Ku,
  MSE_TEMPLATE_ROOT: Vu
}, Zu = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), Qu = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function il(t) {
  return Zu.has(t?.trim().toLowerCase() ?? "");
}
function t0(t) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(t?.toLowerCase() ?? "") ? 0 : 1;
}
function e0(t, e) {
  const r = t?.trim().toLowerCase() ?? "";
  return Qu.has(r) || r === "atq" && e === "Reconstruction";
}
const r0 = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function ll(t) {
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
function rs(t) {
  if (t.wordingMode === "oracle" || !["mir", "tmp"].includes(t.setCode?.toLowerCase() ?? "")) return null;
  const e = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    t.typeLine ?? ""
  )?.[1];
  if (!e) return null;
  const r = r0[e];
  return ll(t) !== r ? null : {
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
function n0(t) {
  return t.power != null && t.toughness != null ? {
    text: `${t.power}/${t.toughness}`,
    label: `Power ${t.power}, toughness ${t.toughness}`
  } : t.loyalty != null && t.loyalty !== "" ? { text: String(t.loyalty), label: `Starting loyalty ${t.loyalty}` } : t.defense != null && t.defense !== "" ? { text: String(t.defense), label: `Defense ${t.defense}` } : null;
}
const x = 488, I = 680, o0 = 0.058;
function It(t, e) {
  if (e === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (e ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    t?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const s0 = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", H = {
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
  stamp: [0.34, 0.76 - 0.16 * x / I, 0.32, 0.32 * x / I]
}, j = {
  titleFont: 24,
  normalTitleFont: 26,
  titleTracking: 54e-5 * x,
  titleGap: 0.02362 * x,
  plateLeft: 0.02362 * x,
  plateRight: 0.01575 * x,
  manaSize: 0.03556 * 1.35 * x,
  manaGap: 378e-5 * x,
  manaLift: -63e-4 * x,
  typeFont: 0.044 * x,
  typeGap: 945e-5 * x,
  typeLift: -315e-5 * x,
  setHeight: 0.06142 * x,
  setMaxWidth: 0.11024 * x,
  setMargin: 472e-5 * x,
  rulesPaddingX: 0.01575 * x,
  rulesPaddingY: 0.02362 * x,
  normalRulesFont: 0.04444 * x,
  longRulesFont: 0.0381 * x,
  denseRulesFont: 0.0328 * x,
  paragraphGap: 787e-5 * x,
  statsFont: 0.05333 * x,
  statsLine: 0.08661 * x,
  footerFont: 0.02167 * x,
  footerLine: 0.02126 * x,
  footerTracking: 362e-5 * x,
  artistMarginLeft: 7e-3 * x,
  artistMarginRight: 35e-4 * x,
  legendaryBackgroundLift: -0.02047 * x
}, ma = (t) => t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
function a0(t = H) {
  return {
    ...Object.fromEntries(
      Object.entries(t).flatMap(
        ([e, r]) => r.map((n, o) => [
          `--face-${ma(e)}-${["x", "y", "w", "h"][o]}`,
          `${n * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(j).map(([e, r]) => [
        `--face-${ma(e)}`,
        `${r / x * 100}cqw`
      ])
    )
  };
}
const Q1 = a0();
function i0(t) {
  return t.length > 340 ? "dense" : t.length > 210 ? "long" : "normal";
}
function t2(t) {
  return {
    dense: j.denseRulesFont,
    long: j.longRulesFont,
    normal: j.normalRulesFont
  }[i0(t)];
}
function Pn(t) {
  return t.split(/(\{[^}\n]+\})/g).filter(Boolean).map((e) => ({
    value: e,
    symbol: /^\{[^}\n]+\}$/.test(e) ? e.slice(1, -1) : null
  }));
}
function l0(t) {
  const e = t.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[e] ?? e.slice(0, 3);
}
const Vn = gt("EIGHTH_PRINTING_PROFILES"), dl = gt("MODERN_PRINTING_PROFILES"), d0 = gt(
  "DUAL_HSB_PROFILES"
), Zn = gt(
  "DUAL_MANA_TARGETS"
), un = gt(
  "PRINTING_COLOR_PROFILES"
), ns = gt(
  "ORDINARY_COLOR_PROFILES"
), Gn = gt(
  "LEGENDS_COLOR_PROFILES"
), jr = gt(
  "MANA_PRINTING_TARGETS"
), u0 = gt(
  "MANA_PRINTING_INK"
), h0 = gt(
  "PRINTING_MANA_PROFILES"
), m0 = gt(
  "MODERN_MANA_OVERRIDES"
), ca = gt(
  "RETRO_MANA_PROFILES"
), ga = gt(
  "MAJOR_SYMBOL_PROFILES"
), fa = gt(
  "MAJOR_FRAME_INSETS"
), c0 = gt(
  "EARLY_EXPANSION_FRAMES"
), g0 = gt(
  "EARLY_EXPANSION_COLORS"
), pa = gt("EARLY_EXPANSION_MANA_TARGETS"), ya = gt("PLANAR_COLORS"), xo = gt("PLANAR_TEXTURE"), ba = /* @__PURE__ */ new WeakMap();
function f0(t) {
  if (t.calibration === "printing" || !sl(t)) return;
  const e = dl.m21;
  if (!e) return;
  let r = ba.get(e);
  return r || (r = Object.freeze({
    ...e,
    inheritedFrom: "m21",
    printedLandRarities: Object.freeze([]),
    printedFrameColors: Object.freeze({}),
    foilStarNumbers: Object.freeze([]),
    ...e.planeswalkers ? {
      planeswalkers: Object.freeze({
        ...e.planeswalkers,
        deckCollectorNumbers: Object.freeze([])
      })
    } : {}
  }), ba.set(e, r)), r;
}
const p0 = { "10e": "cmrsu", "2ed": "cmrsu", "2x2": "cmrsu", "2xm": "cmrsu", "30a": "cmrsu", "3ed": "cmrsu", "40k": "cmrsu", "4ed": "cmrsu", "5dn": "cmrsu", "5ed": "cmrsu", "6ed": "cmrsu", "7ed": "cmrsu", "8ed": "cmrsu", "9ed": "cmrsu", a25: "cmrsu", acr: "cmrsu", aer: "cmrsu", afc: "cmrsu", afr: "cmrsu", akh: "cmrsu", akr: "cmrsu", ala: "cmrsu", all: "cmrsu", ana: "cmrsu", apc: "cmrsu", arb: "cmrsu", arc: "cmrsu", archie: "cmrsu", arena: "cmrsu", arn: "cmrsu", ath: "cmrsu", atq: "cmrsu", avr: "cmrsu", azorius: "cmru", bbd: "cmrsu", bfz: "cmrsu", big: "cmrsu", blb: "cmrsu", blc: "cmrsu", bng: "cmrsu", bok: "cmrsu", boros: "cmru", bot: "cmrsu", brb: "cmrsu", brc: "cmrsu", bro: "cmrsu", brr: "cmrsu", btd: "cmrsu", c13: "cmrsu", c14: "cmrsu", c15: "cmrsu", c16: "cmrsu", c17: "cmrsu", c18: "cmrsu", c19: "cmrsu", c20: "cmrsu", c21: "cmrsu", cc1: "cmrsu", cc2: "cmrsu", ced: "cmrsu", cei: "cmrsu", chk: "cmrsu", chr: "cmrsu", clb: "cmrsu", clu: "cmrsu", cm1: "cmrsu", cm2: "cmrsu", cma: "cmrsu", cmd: "cmrsu", cmm: "cmrsu", cmr: "cmrsu", cn2: "cmrsu", cns: "cmrsu", con: "cmrsu", conf: "cmrsu", csp: "cmrsu", dci: "cmrsu", dd1: "cmrsu", dd2: "cmrsu", ddc: "cmrsu", ddd: "cmrsu", dde: "cmrsu", ddf: "cmrsu", ddg: "cmrsu", ddh: "cmrsu", ddi: "cmrsu", ddj: "cmrsu", ddk: "cmrsu", ddl: "cmrsu", ddm: "cmrsu", ddn: "cmrsu", ddo: "cmrsu", ddp: "cmrsu", ddq: "cmrsu", ddr: "cmrsu", dds: "cmrsu", ddt: "cmrsu", ddu: "cmrsu", default: "cmrsu", dft: "cmrsu", dgm: "cmrsu", dimir: "cmru", dis: "cmrsu", dka: "cmrsu", dkm: "cmrsu", dmc: "cmrsu", dmr: "cmrsu", dmu: "cmrsu", dom: "cmrsu", dpa: "cmrsu", drb: "cmrsu", drc: "cmrsu", drk: "cmrsu", dsc: "cmrsu", dsk: "cmrsu", dst: "cmrsu", dtk: "cmrsu", e01: "cmrsu", e02: "cmrsu", ecc: "cmrsu", ecl: "cmrsu", eld: "cmrsu", ema: "cmrsu", emn: "cmrsu", eoc: "cmrsu", eoe: "cmrsu", eos: "cmru", eve: "cmrsu", exo: "cmrsu", exp: "cmrsu", fca: "cmrsu", fdc: "cmrsu", fdn: "cmrsu", fem: "cmrsu", fic: "cmrsu", fin: "cmrsu", fnm: "r", fra: "cmrsu", frc: "cmrsu", frf: "cmrsu", fut: "cmrsu", gn2: "cmrsu", gn3: "cmrsu", gnt: "cmrsu", golgari: "cmru", gpt: "cmrsu", grn: "cmrsu", gruul: "cmru", gs1: "cmrsu", gtc: "cmrsu", h09: "cmrsu", h17: "cmrsu", ha1: "cmrsu", hbg: "cmrsu", hml: "cmrsu", hob: "cmrsu", hoc: "cmrsu", hop: "cmrsu", hou: "cmrsu", ice: "cmrsu", idw: "cmrsu", iko: "cmrsu", ima: "cmrsu", inr: "cmrsu", inv: "cmrsu", isd: "cmrsu", izzet: "cmru", j20: "cmrsu", j21: "cmrsu", j22: "cmrsu", j25: "cmru", jmp: "cmrsu", jou: "cmrsu", jud: "cmrsu", khc: "cmrsu", khm: "cmrsu", kld: "cmrsu", klr: "cmrsu", ktk: "cmrsu", lcc: "cmrsu", lci: "cmrsu", lea: "cmrsu", leb: "cmrsu", leg: "cmrsu", lgn: "cmrsu", lrw: "cmrsu", ltc: "cmrsu", ltr: "cmrsu", m10: "cmrsu", m11: "cmrsu", m12: "cmrsu", m13: "cmrsu", m14: "cmrsu", m15: "cmrsu", m19: "cmrsu", m20: "cmrsu", m21: "cmrsu", m3c: "cmrsu", mat: "cmrsu", mb2: "cmrsu", mbc: "cmrsu", mbs: "cmrsu", mc3: "cmrsu", md1: "cmrsu", me1: "cmrsu", me2: "cmrsu", me3: "cmrsu", me4: "cmrsu", med: "cmrsu", mh1: "cmrsu", mh2: "cmrsu", mh3: "cmrsu", mic: "cmrsu", mid: "cmrsu", mir: "cmrsu", mkc: "cmrsu", mkm: "cmrsu", mm2: "cmrsu", mm3: "cmrsu", mma: "cmrsu", mmq: "cmrsu", moc: "cmrsu", mom: "cmrsu", mor: "cmrsu", mp2: "cmrsu", mps: "cmrsu", mrd: "cmrsu", msc: "cmrsu", msh: "cmrsu", mtga: "cmrsu", mtgo: "cmrsu", mul: "cmrsu", ncc: "cmrsu", nec: "cmrsu", nem: "cmrsu", neo: "cmrsu", nph: "cmrsu", ody: "cmrsu", ogw: "cmrsu", om1: "cmrsu", omb: "cmrsu", onc: "cmrsu", one: "cmrsu", ons: "cmrsu", ori: "cmrsu", orzhov: "cmru", otc: "cmrsu", otj: "cmrsu", otp: "cmrsu", p02: "cmrsu", papac: "cmrsu", parl2: "cmrsu", past: "cmrsu", pbook: "cmrsu", pc2: "cmrsu", pca: "cmrsu", pcy: "cmrsu", pd2: "cmrsu", pd3: "cmrsu", pdrc: "c", peuro: "cmrsu", pgru: "c", phpr: "cmrsu", phuk: "cmrsu", pidw: "cmrsu", pio: "cmrsu", pip: "cmrsu", planeswalker: "cmrsu", plc: "cmrsu", pls: "cmrsu", pmps: "cmrsu", por: "cmrsu", prm: "cmrsu", ps11: "cmrsu", psal: "cmrsu", psdg: "cmrsu", psum: "cmrsu", ptg: "cmrsu", ptk: "cmrsu", pvan: "c", pxbox: "cmrsu", pz1: "cmrsu", pz2: "cmrsu", pza: "cmrsu", rav: "cmrsu", ren: "cmrsu", rex: "cmrsu", rin: "cmrsu", rix: "cmrsu", rna: "cmrsu", roe: "cmrsu", rtr: "cmrsu", rvr: "cmrsu", s00: "cmrsu", s99: "cmrsu", scd: "cmrsu", scg: "cmrsu", sds: "cmrsu", selesnya: "cmru", shm: "cmrsu", simic: "cmru", sir: "cmrsu", sis: "cmrsu", sld: "cmrsu", snc: "cmrsu", soa: "cmrsu", soc: "cmrsu", soi: "cmrsu", sok: "cmrsu", som: "cmrsu", sos: "cmrsu", spe: "cmrsu", spg: "cmrsu", spm: "cmrsu", ss1: "cmrsu", ss2: "cmrsu", ss3: "cmrsu", sta: "cmrsu", star: "cmrsu", sth: "cmrsu", stx: "cmrsu", td0: "cmrsu", td2: "cmrsu", tdc: "cmrsu", tdm: "cmrsu", thb: "cmrsu", ths: "cmrsu", tla: "cmrsu", tle: "cmrsu", tlr: "c", tmc: "cmrsu", tmp: "cmrsu", tmt: "cmrsu", tor: "cmrsu", tpr: "cmrsu", trc: "cmrsu", trk: "cmrsu", tsp: "cmrsu", tsr: "cmrsu", uds: "cmrsu", ugl: "cmrsu", ulg: "cmrsu", uma: "cmrsu", und: "cmrsu", unf: "cmrsu", unh: "cmrsu", usg: "cmrsu", ust: "cmrsu", v09: "cmrsu", v10: "cmrsu", v11: "cmrsu", v12: "cmrsu", v13: "cmrsu", v14: "cmrsu", v15: "cmrsu", v16: "cmrsu", v17: "cmrsu", van: "cmrsu", vis: "cmrsu", vma: "cmrsu", voc: "cmrsu", vow: "cmrsu", w16: "cmrsu", w17: "cmrsu", war: "cmrsu", who: "cmrsu", woc: "cmrsu", woe: "cmrsu", wor: "u", wot: "cmrsu", wth: "cmrsu", wwk: "cmrsu", x2ps: "cmrsu", xln: "cmrsu", y22: "cmrsu", y23: "cmrsu", y24: "cmrsu", y25: "cmrsu", y26: "cmrsu", zen: "cmrsu", znc: "cmrsu", zne: "cmrsu", znr: "cmrsu" }, y0 = {
  codes: p0
}, W = Y.CONJURER_ROOT, ul = `${W}/img/setSymbols/official/`, wa = y0.codes, b0 = {
  common: "c",
  uncommon: "u",
  rare: "r",
  mythic: "m",
  special: "s",
  bonus: "s"
};
function hl(t, e = "common", r = "auto") {
  const n = t.trim().toLowerCase();
  if (r === "keyrune") return null;
  const o = il(n) ? "c" : b0[e];
  return o && Object.hasOwn(wa, n) && wa[n].includes(o) ? `${ul}${n}-${o}.svg` : null;
}
function Gt(t) {
  return !!t?.startsWith(ul);
}
const w0 = Y.KEYRUNE_ROOT, v0 = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function Me(t) {
  return !t.setSymbol && !hl(t.setCode ?? "", t.rarity, t.setSymbolSource) ? v0[t.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1] : [0, 0, 1, 1];
}
const ml = new Set(
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
ml.add("con_");
const S0 = "GLINT", hn = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function C0(t) {
  const e = hn[t] ?? hn.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${e}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function k0(t) {
  const e = hn[t] ?? hn.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${e}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function M0(t, e = "common", r) {
  const n = t.trim().toLowerCase();
  if (n === "forge") return k0(e);
  if (n === S0.toLowerCase()) return C0(e);
  const o = hl(n, e, r);
  if (o) return o;
  const s = n === "con" ? "con_" : n === "p02" ? "po2" : n;
  return ml.has(s) ? `${w0}/${s}.svg` : null;
}
const va = {
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
function cl(t) {
  return Object.hasOwn(va, t) ? va[t] : null;
}
function mn(t) {
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
function T0(t, e) {
  const r = t.dualLand, n = t.frames["L-dual"];
  if (!r || !n || n.family !== "abu" || e.length !== 2) return;
  const o = `${Y.RETRO_ROOT}/img/frames/old/abu/`, s = (u) => `${o}${u.toLowerCase()}l.png`;
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
    mask: `${Y.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`,
    outline: s(a),
    pinline: r.pinline,
    materials: d
  };
}
function at(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !rt(t) || t.frameTemplate || t.frameAssetFamily || t.frameStyle === "modern" || t.borderColor && t.borderColor !== rt(t).border || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
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
    }[t.name], h = t.frameColors ?? (u ? [u] : rt(t).dualLand ? mn(t) : []);
    if (h.length === 2) {
      if (a = T0(rt(t), mn(t)), !a) return;
      s = "L-dual";
    } else if (h.length) {
      if (h.length !== 1) return;
      s = `L-${h[0]}`;
    } else s = "L";
  } else
    s = t.artifact ?? /\bArtifact\b/.test(r) ? "A" : n.length === 1 ? n[0] : n.length > 1 ? "M" : void 0;
  const i = s && rt(t).frames[s];
  if (!i) return;
  const l = s === "L" ? e === "chr" && t.name === "Safe Haven" ? "L-dark" : e === "chr" && t.name === "City of Brass" || e === "4ed" && t.name === "Oasis" ? "L-gold" : "L-red" : s;
  return {
    ...i,
    dual: a,
    material: s,
    profile: `${e}/${l}`,
    asset: a?.base ?? `${Y.RETRO_ROOT}/img/frames/old/${i.family}/${i.assetKey}.png`
  };
}
function x0(t) {
  return t.setSymbolSource && t.setSymbolSource !== "auto" ? t.setSymbolSource : (at(t) ? rt(t)?.setSymbolSource : void 0) ?? t.setSymbolSource;
}
const Qe = Y.RENDERER_COMPONENT_ROOT;
function re(t, e = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(e), n = e === "saga" ? "saga" : e === "planeswalker-large" ? "planeswalker_large" : e, o = r && t.land && /^[WUBRG]$/.test(t.frame) ? t.frame : ["saga", "class"].includes(e) && t.boxes === "Colourless" ? "Land" : e.startsWith("planeswalker") && t.boxes === "Artifact" ? "Colourless" : t.boxes;
  return {
    background: Nt(
      r ? "bg" : e === "class" ? "saga_bg" : `${n}_bg`,
      e.startsWith("planeswalker") && o === "Land" ? "Colourless" : r ? t.boxes : o
    ),
    frame: Nt(
      ["normal", "leveler"].includes(e) ? "frames" : `${n}_frames`,
      e === "adventure" ? "WUBRG".includes(t.frame) ? t.frame : "W" : e === "class" ? t.frame === "WU" ? "UW" : t.frame.length === 2 ? "Gold" : t.frame : e === "saga" && t.frame === "Colourless" ? "Land" : e.startsWith("planeswalker") && ["Artifact", "Land"].includes(t.frame) ? "Colourless" : t.frame
    ),
    boxes: Nt(e.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", o),
    nameplate: Nt("nameplates", t.boxes),
    crown: Nt("legendary-crowns", t.crown),
    pt: e.startsWith("planeswalker") ? Nt("planeswalker", "Loyalty") : Nt("pt-boxes", t.pt)
  };
}
function tr(t) {
  const e = t.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = e === "∞" ? "INFINITY" : e === "½" ? "HALF" : e.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? Nt("symbols", r) : null;
}
function gl(t, e, r) {
  return M0(t, e, r);
}
function Nt(t, e) {
  const r = t === "legendary-crowns" ? "legendary_crowns" : t === "pt-boxes" ? "pt_boxes" : t === "nameplates" ? "boxes" : t, n = t === "symbols" ? "svg" : "webp";
  return `${Qe}/img/${r}/${encodeURIComponent(e)}.${n}`;
}
function st(t, e = t.rarity) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  const r = t.setCode?.trim().toLowerCase() ?? "";
  return t.setSymbol ?? gl(
    r === "chr" ? cl(t.name) ?? "" : r,
    e,
    x0(t)
  );
}
function R0(t) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  if (Gt(t.setSymbol)) {
    const e = new URL(t.setSymbol).pathname.match(/\/([^/]+)-[curms]\.svg$/)?.[1];
    if (e) return gl(e, "common", "cardconjurer");
  }
  return st(t, "common");
}
const Sa = /* @__PURE__ */ new WeakMap();
function nt(t) {
  if (!On(t)) return;
  const e = t.setCode?.toLowerCase() ?? "", r = Object.hasOwn(Vn, e) ? Vn[e] : void 0, n = Y.CONJURER_ROOT + "/img/frames/8th";
  if (r?.root === n) return r;
  if (t.calibration === "printing") return;
  const o = Vn["8ed"];
  if (!o || o.root !== n) return;
  let s = Sa.get(o);
  return s || (s = Object.freeze({
    ...o,
    inheritedFrom: "8ed",
    rules: Object.freeze({ ...o.rules, shortCenterLines: void 0 }),
    originalRules: Object.freeze({})
  }), Sa.set(o, s)), s;
}
const tn = /* @__PURE__ */ new WeakSet();
function fe(t) {
  return !tn.has(t);
}
function L0(t, e, r) {
  const n = tn.has(t);
  e || tn.add(t);
  try {
    r();
  } finally {
    n || tn.delete(t);
  }
}
const E0 = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function pe(t) {
  const e = /^Basic (?:Snow )?Land [—–-] (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    t.canonicalTypeLine ?? t.typeLine ?? ""
  )?.[1];
  return e ? E0[e] : void 0;
}
function ir(t) {
  if (t.frameStyle === "retro" || t.frameTemplate || t.layout && t.layout !== "normal")
    return null;
  const e = pe(t);
  if (!e) return null;
  const r = t.rulesText ?? "";
  if (!["", e, `{${e}}`, `{T}: Add {${e}}.`, `({T}: Add {${e}}.)`].includes(r))
    return null;
  if (t.rulesParagraphs) {
    const n = t.rulesParagraphs;
    if (n.length !== 1 || n[0].role !== "rules" || n[0].align || n[0].runs.length !== 1 || n[0].runs[0].text !== r || !!n[0].runs[0].italic !== r.startsWith("("))
      return null;
  }
  return `${Y.RETRO_ROOT}/img/frames/m15/basics/${e.toLowerCase()}.png`;
}
function fl(t) {
  const e = pe(t), r = e ? ot(t)?.largeLandSymbols?.[e] : void 0;
  return r && r.source === ir(t) ? r : void 0;
}
function pl(t, e, r) {
  if (!fe(t)) return !0;
  const n = ir(e);
  if (!n) return !1;
  const o = r.get(n);
  if (!o) throw Error(`Basic land symbol unavailable: ${n}`);
  const s = pe(e), a = nt(e), i = s ? a?.largeLandSymbols[s] : void 0, l = fl(e) ?? (i?.source === n ? i : void 0), d = l && (a?.largeLandShadow ?? ot(e)?.largeLandShadow);
  if (t.save(), d) {
    const h = t.getTransform();
    t.shadowColor = `rgba(0,0,0,${d.alpha})`, t.shadowOffsetX = h.a * d.dx + h.c * d.dy, t.shadowOffsetY = h.b * d.dx + h.d * d.dy, t.shadowBlur = d.blur * Math.sqrt(Math.abs(h.a * h.d - h.b * h.c));
  } else
    t.shadowColor = "#0009", t.shadowOffsetX = -1.5, t.shadowOffsetY = 1.5, t.shadowBlur = 1.5;
  const u = l?.geometry;
  return t.drawImage(
    o,
    u ? 244 + -78 * u.scaleX + u.dx : 166,
    u ? 518 + -78 * u.scaleY + u.dy : 440,
    u ? 156 * u.scaleX : 156,
    u ? 156 * u.scaleY : 156
  ), t.restore(), !0;
}
function Ro(t, e) {
  const r = nt(t);
  if (!r || !["#eeedeb", "#090806"].includes(It(t.setCode, t.borderColor).border))
    return;
  const n = r.root + "/", o = e.startsWith(n) ? e.slice(n.length) : "";
  if (/^(?:[wubrgam]l?|l)[.]png$/.test(o))
    return pe(t) ? r.geometry.basic : r.geometry.ordinary;
}
const Lo = (t, e) => 244 + (t - 244) * e.scaleX + e.dx, Eo = (t, e) => 340 + (t - 340) * e.scaleY + e.dy;
function A0([t, e, r, n], o) {
  return [Lo(t * 488, o) / 488, Eo(e * 680, o) / 680, r * o.scaleX, n * o.scaleY];
}
function Ca(t, e, r) {
  t.save(), t.beginPath(), t.rect(0, 0, 488, 680), t.rect(22, 22, 444, 636), t.clip("evenodd"), t.drawImage(e, 0, 0, 488, 680), t.restore();
  const n = [22, 28, 460, 466], o = [22, 28, 624, 658], s = [22, Lo(28, r), Lo(460, r), 466], a = [22, Eo(28, r), Eo(624, r), 658];
  for (let i = 0; i < 3; i++)
    for (let l = 0; l < 3; l++) {
      const d = n[l], u = o[i], h = s[l], m = a[i];
      t.drawImage(
        e,
        d / 488 * e.width,
        u / 680 * e.height,
        (n[l + 1] - d) / 488 * e.width,
        (o[i + 1] - u) / 680 * e.height,
        h,
        m,
        s[l + 1] - h,
        a[i + 1] - m
      );
    }
}
const e2 = 1, os = Object.freeze([
  Object.freeze({
    id: "m21-modern",
    revision: 16,
    label: "Modern · M21 defaults",
    setCode: "M21",
    note: "Source-bound M21 frame, color, mana, heading, body and footer defaults. Printing content stays local; inherited values are not target-set measurements."
  }),
  Object.freeze({
    id: "8ed-eighth",
    revision: 1,
    label: "Eighth · 8ED defaults",
    setCode: "8ED",
    note: "Source-bound Eighth-family geometry, typography, land, mana and material defaults. Black and white surrounds remain separate. Printing content and set icons are never donated; inherited values are not target-set certification."
  })
]);
function yl(t) {
  if (!(t === "auto" || t === "printing" || t === "source") && !(t && typeof t == "object" && !Array.isArray(t) && Object.keys(t).length === 1 && Object.hasOwn(t, "profile") && os.some((e) => e.id === t.profile)))
    throw Error("Invalid printing calibration choice");
}
function Ht(t) {
  if (["split", "aftermath", "adventure", "prepare", "room", "flip"].includes(t.layout ?? "") && t.faces?.some(
    (r) => r.calibration !== void 0 && JSON.stringify(r.calibration) !== JSON.stringify(t.calibration)
  ))
    throw Error("Composite panels share one calibration policy; select it on the physical face.");
  if (t.calibration === void 0) return t;
  yl(t.calibration);
  const e = t.calibration === "source" ? void 0 : "set-hsb-v1";
  return {
    ...t,
    colorCalibration: e,
    ...t.faces ? {
      faces: t.faces.map(
        (r) => Ht({
          ...r,
          calibration: r.calibration ?? t.calibration
        })
      )
    } : {}
  };
}
function B0(t, e) {
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
function I0(t, e, r, n, o) {
  bl(n);
  for (const s of r) {
    const a = s * 4, i = Math.max(0, 1 - Math.max(e[a], e[a + 1], e[a + 2]) / 96) ** 2, l = o ? o.data[a + 3] / 255 : 1;
    for (let d = 0; d < 3; d++)
      t.data[a + d] = Math.round(
        t.data[a + d] * (1 - l) + (e[a + d] + n[d] * 255 * i) * l
      );
  }
}
function bl(t) {
  if (t.length !== 3 || t.some((e) => !Number.isFinite(e) || e < 0 || e > 48 / 255))
    throw RangeError("Invalid baked stock black level");
}
const O0 = {
  hueDegrees: 0,
  saturationScale: 1,
  brightnessScale: 1
};
function cn([t, e, r]) {
  const n = Math.max(t, e, r), o = n - Math.min(t, e, r);
  return [((o === 0 ? 0 : n === t ? (e - r) / o : n === e ? (r - t) / o + 2 : (t - e) / o + 4) * 60 % 360 + 360) % 360, n === 0 ? 0 : o / n, n];
}
function $0(t, e, r) {
  const n = (t % 360 + 360) % 360 / 60, o = r * e, s = o * (1 - Math.abs(n % 2 - 1)), a = r - o, i = n < 1 ? [o, s, 0] : n < 2 ? [s, o, 0] : n < 3 ? [0, o, s] : n < 4 ? [0, s, o] : n < 5 ? [s, 0, o] : [o, 0, s];
  return [i[0] + a, i[1] + a, i[2] + a];
}
function te(t, e) {
  const [r, n, o] = cn(t), s = e.valueGamma === void 0 ? o : o ** e.valueGamma, a = $0(
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
function ka(t) {
  const e = t.valueGamma;
  if (e !== void 0 && (!Number.isFinite(e) || e < 0.5 || e > 2))
    throw RangeError("Frame value exponent must be finite and between 0.5 and 2.");
}
const Qn = (t) => {
  const e = Math.max(0, Math.min(1, t));
  return e * e * (3 - 2 * e);
}, to = (t) => {
  const e = Math.max(1e-3, t[0] + t[1] + t[2]);
  return t.map((r) => r / e);
};
function Ma(t, e) {
  const { width: r, height: n, data: o } = t, s = new Float32Array(r * n);
  if (e.kind === "polygon") {
    if (e.points.length < 3 || !Number.isFinite(e.feather) || e.feather <= 0 || e.points.some((T) => T.some((R) => !Number.isFinite(R) || R < 0 || R > 1)))
      throw Error(
        "Paper outline requires at least three normalized points and positive feathering."
      );
    const b = e.points.map(([T, R]) => [T * r, R * n]), v = e.feather * r, S = Math.max(0, Math.floor(Math.min(...b.map((T) => T[0])) - v)), k = Math.min(r, Math.ceil(Math.max(...b.map((T) => T[0])) + v)), M = Math.max(0, Math.floor(Math.min(...b.map((T) => T[1])) - v)), C = Math.min(n, Math.ceil(Math.max(...b.map((T) => T[1])) + v));
    for (let T = M; T < C; T++)
      for (let R = S; R < k; R++) {
        let A = !1, L = 1 / 0;
        const O = R + 0.5, B = T + 0.5;
        for (let U = 0; U < b.length; U++) {
          const [E, q] = b[U], [K, dt] = b[(U + 1) % b.length], pt = K - E, Pt = dt - q, Wt = pt * pt + Pt * Pt, X = Wt ? Math.max(0, Math.min(1, ((O - E) * pt + (B - q) * Pt) / Wt)) : 0;
          L = Math.min(L, Math.hypot(O - E - X * pt, B - q - X * Pt)), q > B != dt > B && O < E + (B - q) * pt / Pt && (A = !A);
        }
        s[T * r + R] = Qn((A ? L : -L) / v + 0.5);
      }
    return s;
  }
  if (e.kind === "rect") {
    const [b, v, S, k] = e.rect;
    for (let M = 0; M < n; M++)
      for (let C = 0; C < r; C++) {
        const T = Math.min(
          C / r - b,
          b + S - C / r,
          M / n - v,
          v + k - M / n
        );
        s[M * r + C] = Qn(T / e.feather + 0.5);
      }
    return s;
  }
  const a = to(e.frameRgb), i = to(e.paperRgb), l = i.map((b, v) => b - a[v]), d = l.reduce((b, v) => b + v * v, 0);
  if (d < 1e-3) throw Error("Paper and frame chroma are too similar for this mask.");
  const [u, h, m, c] = e.bounds;
  for (let b = 0; b < n; b++)
    for (let v = 0; v < r; v++) {
      if (v / r < u || v / r > u + m || b / n < h || b / n > h + c)
        continue;
      const S = b * r + v, k = S * 4;
      if (o[k + 3] < 250) continue;
      const C = to([o[k] / 255, o[k + 1] / 255, o[k + 2] / 255]).reduce((T, R, A) => T + (R - a[A]) * l[A], 0) / d;
      s[S] = Qn((C - 0.22) / 0.56);
    }
  const g = new Uint8Array(s.length), f = new Int32Array(s.length), p = Math.round(e.seed[1] * n) * r + Math.round(e.seed[0] * r);
  if (!(s[p] > 0.08)) throw Error("Paper mask seed is outside the paper.");
  let w = 0, y = 1;
  for (f[0] = p, g[p] = 1; w < y; ) {
    const b = f[w++], v = b % r;
    for (const S of [b - r, b + r, v ? b - 1 : -1, v < r - 1 ? b + 1 : -1])
      S >= 0 && S < g.length && !g[S] && s[S] > 0.08 && (g[S] = 1, f[y++] = S);
  }
  for (let b = 0; b < s.length; b++) g[b] || (s[b] = 0);
  return s;
}
const eo = (t) => {
  const e = Math.max(0, Math.min(1, t));
  return e * e * (3 - 2 * e);
}, Ta = ([t, e, r, n], o, s) => o >= t && s >= e && o < t + r && s < e + n;
function P0(t, e) {
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
      if (!t.data[a + 3] || !e.rings.some((c) => Ta(c.outer, i, l) && !Ta(c.inner, i, l)))
        continue;
      const [d, u, h] = cn([
        t.data[a] / 255,
        t.data[a + 1] / 255,
        t.data[a + 2] / 255
      ]), m = Math.abs((d - e.hueCenter + 540) % 360 - 180);
      r[s] = eo((e.hueRadius - m) / e.hueFeather) * eo((u - e.saturation[0]) / (e.saturation[1] - e.saturation[0])) * (e.brightness ? eo((h - e.brightness[0]) / (e.brightness[1] - e.brightness[0])) : 1);
    }
  return r;
}
function gn(t, e, r, n) {
  if ("mask" in e)
    for (const h of [
      e.frame,
      e.paper,
      ...e.regions?.map((m) => m.adjustment) ?? [],
      ...e.accents?.map((m) => m.adjustment) ?? []
    ])
      ka(h);
  else ka(e);
  if (e.blackPoint && Fu(e.blackPoint), e.outerStock && bl(e.outerStock), e.outerStockMaskSource && (!n || n.width !== t.width || n.height !== t.height || n.data.length !== t.data.length))
    throw RangeError("Frame stock correction needs its source selection");
  if (e.blackPoint?.textureMaskSource && (!r || r.width !== t.width || r.height !== t.height || r.data.length !== t.data.length))
    throw RangeError("Frame texture correction needs its source selection");
  const o = "mask" in e ? e : void 0, s = o ? Ma(t, o.mask) : void 0, a = "mask" in e ? e.frame : e, i = o?.regions?.map((h) => ({
    values: Ma(t, h.mask),
    adjustment: h.adjustment
  })) ?? [], l = [
    ...i,
    ...o?.accents?.map((h) => ({
      values: P0(t, h.mask),
      adjustment: h.adjustment
    })) ?? []
  ];
  for (let h = 0; h < t.data.length; h += 4) {
    if (t.data[h + 3] === 0) continue;
    const m = [t.data[h] / 255, t.data[h + 1] / 255, t.data[h + 2] / 255], c = Math.max(...m), g = c === 0 ? 0 : (c - Math.min(...m)) / c;
    if (c < 0.075 || !o && g < 0.025 && c > 0.97) continue;
    const f = s?.[h / 4] ?? 0, p = te(m, f === 1 && o ? o.paper : a), w = f > 0 && f < 1 && o ? te(m, o.paper) : p;
    for (let y = 0; y < 3; y++)
      t.data[h + y] = Math.round(
        Math.round(255 * p[y]) * (1 - f) + Math.round(255 * w[y]) * f
      );
    for (const y of l) {
      const b = y.values[h / 4];
      if (!b) continue;
      const v = te(m, y.adjustment);
      for (let S = 0; S < 3; S++)
        t.data[h + S] = Math.round(
          t.data[h + S] * (1 - b) + 255 * v[S] * b
        );
    }
  }
  const d = e.outerStock ? t.data.slice() : void 0, u = e.outerStock ? B0(t, n) : void 0;
  e.blackPoint && Wu(t, e.blackPoint, r), e.outerStock && d && u && I0(t, d, u, e.outerStock, n);
}
const wl = "card-glint:magic/artifact-pinline";
function G0(t) {
  const e = Fn(Ht(t));
  return e ? [e.source, e.mask] : [];
}
function F0(t, e) {
  const r = Ht(t), n = Fn(r);
  if (!n) return [];
  const o = (d) => {
    const u = e.get(d);
    if (!u) throw Error("Modern artifact layer asset unavailable: " + d);
    return u;
  }, s = o(n.source), a = o(n.mask), i = r.colorCalibration === "set-hsb-v1" ? n.correction : void 0, l = i ? (() => {
    const { outerStock: d, outerStockMaskSource: u, ...h } = i;
    return h;
  })() : void 0;
  return [
    {
      url: wl,
      key: JSON.stringify([
        "modern-artifact-pinline-v1",
        n.source,
        n.mask,
        l,
        s.width,
        s.height,
        a.width,
        a.height
      ]),
      bytes: 732 * 1020 * 4,
      build: async () => {
        const d = $(), u = $();
        d.width = s.width, d.height = s.height, u.width = 732, u.height = 1020;
        try {
          const h = d.getContext("2d", { willReadFrequently: !0 }), m = u.getContext("2d");
          if (!h || !m) throw Error("Modern artifact layer needs Canvas2D");
          if (h.drawImage(s, 0, 0), l) {
            const c = h.getImageData(0, 0, d.width, d.height);
            gn(c, l), h.putImageData(c, 0, 0);
          }
          return m.drawImage(d, 0, 0, 732, 1020), m.globalCompositeOperation = "destination-in", m.drawImage(a, 0, 0, 732, 1020), await createImageBitmap(u);
        } finally {
          d.width = d.height = u.width = u.height = 0;
        }
      }
    }
  ];
}
function W0(t, e, r) {
  if (!Fn(e)) return;
  const n = r.get(wl);
  if (!n) throw Error("Modern artifact pinline layer was not prepared");
  t.drawImage(n, 0, 0, 488, 680);
}
function ss(t) {
  const e = Ht(t), r = fs(e);
  if (!r) return [];
  const { profile: n, dual: o } = r, s = e.colorCalibration === "set-hsb-v1";
  return [
    ...s ? [
      {
        key: "card-glint:magic/land-texture",
        source: n.root + "/l.png",
        masks: [n.root + "/frame.png"],
        correction: n.commonTexture,
        kind: "texture"
      }
    ] : [],
    ...o ? [
      {
        key: "card-glint:magic/land-headers",
        source: n.root + "/l.png",
        masks: [n.root + "/title.png", n.root + "/type.png"],
        correction: s ? n.neutralHeaders : void 0,
        kind: "headers"
      }
    ] : []
  ];
}
function _0(t) {
  return [...new Set(ss(t).flatMap((e) => [e.source, ...e.masks]))];
}
function U0(t, e) {
  return ss(t).map((r) => {
    const n = (a) => {
      const i = e.get(a);
      if (!i) throw Error("Modern land layer asset unavailable: " + a);
      return i;
    }, o = n(r.source), s = r.masks.map(n);
    return {
      url: r.key,
      key: JSON.stringify(["modern-land-layer-v1", r, o.width, o.height]),
      bytes: 732 * 1020 * 4,
      build: async () => {
        const a = $(), i = $();
        a.width = 732, a.height = 1020;
        try {
          const l = a.getContext("2d", { willReadFrequently: !0 });
          if (!l) throw Error("Modern land layer needs Canvas2D");
          let d = o;
          if (r.kind === "headers" && r.correction) {
            i.width = o.width, i.height = o.height;
            const u = i.getContext("2d", { willReadFrequently: !0 });
            if (!u) throw Error("Modern land header preparation needs Canvas2D");
            u.drawImage(o, 0, 0);
            const h = u.getImageData(0, 0, i.width, i.height), { outerStock: m, outerStockMaskSource: c, ...g } = r.correction;
            gn(h, g), u.putImageData(h, 0, 0), d = i;
          }
          for (const u of s) l.drawImage(u, 0, 0, 732, 1020);
          if (l.globalCompositeOperation = "source-in", l.drawImage(d, 0, 0, 732, 1020), r.kind === "texture" && r.correction) {
            const u = l.getImageData(0, 0, 732, 1020);
            gn(u, r.correction), l.putImageData(u, 0, 0);
          }
          return await createImageBitmap(a);
        } finally {
          a.width = a.height = 0, i.width = i.height = 0;
        }
      }
    };
  });
}
function D0(t, e, r) {
  for (const n of ss(e)) {
    const o = r.get(n.key);
    if (!o) throw Error("Modern land layer was not prepared: " + n.key);
    t.drawImage(o, 0, 0, 488, 680);
  }
}
function zt(t, e) {
  return t.setCode?.toLowerCase() === "plc" && t.frameAssetFamily === "eighth" && !t.frameTemplate && (!t.layout || t.layout === "normal") && (!t.borderColor || t.borderColor === "black") && e.startsWith(`${W}/img/frames/8th/`) && /^(?:[wubrgm]|colorshifted\/[wubrg])\.png$/.test(
    e.slice(`${W}/img/frames/8th/`.length)
  );
}
const Ao = (t) => 244 + (t - 244) * 1.006 - 0.5, Bo = (t) => 340 + (t - 340) * 1.008 + 0.25;
function ro([t, e, r, n]) {
  return [Ao(t * 488) / 488, Bo(e * 680) / 680, r * 1.006, n * 1.008];
}
function N0([t, e, r, n], o) {
  const [s, a, i, l] = o ? [1.03, -0.5, 1.025, 2.5] : [1.005, 0.25, 1.005, 2.75];
  return [
    (407 + (t * 488 - 407) * s + a) / 488,
    (626 + (e * 680 - 626) * i + l) / 680,
    r * s,
    n * i
  ];
}
function as(t, e, r = !1) {
  const [n, o, s, a] = r ? [21, 18.75, 467.5, 661] : [22, 22, 466, 658];
  t.save(), t.beginPath(), t.rect(0, 0, 488, 680), t.rect(n, o, s - n, a - o), t.clip("evenodd"), t.drawImage(e, 0, 0, 488, 680), t.restore();
  const i = [22, 28, 460, 466], l = [22, 28, 638, 658], d = [n, Ao(28), Ao(460), s], u = [o, Bo(28), Bo(638), a];
  for (let h = 0; h < l.length - 1; h++)
    for (let m = 0; m < i.length - 1; m++) {
      const c = i[m], g = l[h], f = d[m], p = u[h];
      t.drawImage(
        e,
        c / 488 * e.width,
        g / 680 * e.height,
        (i[m + 1] - c) / 488 * e.width,
        (l[h + 1] - g) / 680 * e.height,
        f,
        p,
        d[m + 1] - f,
        u[h + 1] - p
      );
    }
}
const j0 = /* @__PURE__ */ new Set(["artist", "legal", "collector", "manaCost", "setSymbol"]);
function vl(t) {
  if (t.printingElements !== void 0) {
    if (!t.printingElements || typeof t.printingElements != "object" || Array.isArray(t.printingElements))
      throw Error("Printing elements must be an object");
    if (Object.keys(t.printingElements).length) {
      if (t.faces?.length || t.layout && !["normal", "token"].includes(t.layout) || t.frameTemplate && t.frameTemplate !== "future" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
        throw Error("Printing element controls require an ordinary face or Futureshifted template.");
      for (const [e, r] of Object.entries(t.printingElements)) {
        if (!j0.has(e) || !r || typeof r != "object" || Array.isArray(r))
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
function Z(t, e, r, n) {
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
const Sl = {
  plc: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 165 },
  fut: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 180 },
  "8ed": { legal: "™ & © 1993–2003 Wizards of the Coast, Inc.", total: 350 },
  m15: { legal: "™ & © 2014 Wizards of the Coast", total: 269 },
  war: { legal: "™ & © 2019 Wizards of the Coast", total: 264 },
  m21: { legal: "™ & © 2020 Wizards of the Coast", total: 274 },
  fdn: { legal: "™ & © 2024 Wizards of the Coast", format: "rarity-first" }
};
function is(t) {
  return t.printingElements?.legal?.hidden ? null : t.legalText === void 0 ? Sl[t.setCode?.toLowerCase() ?? ""]?.legal ?? null : t.legalText;
}
function ls(t, e = !0) {
  if (t.printingElements?.collector?.hidden) return "";
  const r = t.collectorNumber?.trim(), n = t.setCode?.toLowerCase() === "8ed" ? r?.replace(/^(\d+)★$/, "$1") : r;
  if (!n) return "";
  const o = Sl[t.setCode?.toLowerCase() ?? ""], s = t.collectorFormat ?? o?.format ?? "number-first", a = e && t.rarity === "common" && /\bLand\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") && ot(t)?.printedLandRarities.includes(n) || /^Basic (?:Snow )?Land\b/.test(t.typeLine ?? "") ? "L" : (t.rarity ?? "common")[0].toUpperCase();
  if (e && s === "rarity-first")
    return `${a} ${n.split("/")[0].replace(/^(\d+)/, (m) => m.padStart(4, "0"))}`;
  const i = /^\d+$/.test(n), l = e && i ? n.padStart(3, "0") : n, d = t.setCode?.toLowerCase() === "8ed" && /^S[1-7]$/.test(n), u = t.collectorTotal === void 0 ? d ? 7 : o?.total : t.collectorTotal, h = u && (d || i && Number(n) <= u) ? `${l}/${u}` : l;
  return e ? `${h} ${a}` : h;
}
function it() {
  const t = typeof document < "u" ? document.fonts : globalThis.fonts;
  if (!t) throw Error("Card fonts require a document or worker FontFaceSet");
  return t;
}
function Cl(t, e) {
  return zt(t, e) ? "CardRenderer MTG ModMatrix" : void 0;
}
function xa(t, e) {
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
function no(t, e, r, n) {
  if (!zt(e, r)) return;
  const [o, s, a, i, l, d] = n === "artist" ? [77, 634, -1, 3.25, 0.995, 1] : n === "legal" ? [36.5, 647, 4.5, 4.75, 0.995, 1.1] : [407, 627, 2, -2.25, 1.03, 1.01];
  t.translate(o + a, s + i), t.scale(l * d, l), t.translate(-o, -s);
}
let Ra = null;
function z0(t, e) {
  const r = Cl(t, e);
  return !r || t.power == null || t.toughness == null ? Promise.resolve() : Ra ??= it().load(`700 29px "${r}"`).then((n) => {
    if (!n.length || n.some((o) => o.status !== "loaded"))
      throw Error("Planar Chaos P/T needs card-glint/magic/fonts.css.");
  }).catch((n) => {
    throw Ra = null, n;
  });
}
function kl(t) {
  return ["B", "Colourless", "Land"].includes(G(t).boxes);
}
function Ml(t) {
  return t.frameAssetFamily !== "eighth" || !t.artist ? null : `${W}/img/manaSymbols/${kl(t) ? "whitebrush" : "brush"}.svg`;
}
function La(t, e) {
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
function Y0(t, e, r, n = "") {
  const o = nt(e), s = o?.footer;
  if (t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.letterSpacing = "0px", e.power != null && e.toughness != null) {
    if (t.save(), no(t, e, n, "stats"), s) {
      const b = s.stats;
      t.translate(407 + b.dx, 627 + b.dy), t.scale(b.width, b.height), t.translate(-407, -627);
    }
    const p = e.frameTreatment === "colorshifted";
    t.fillStyle = p ? "#fff" : "#17140f", p && (t.shadowColor = "#000", t.shadowOffsetX = -21e-4 * 488, t.shadowOffsetY = 15e-4 * 680);
    const w = Cl(e, n);
    t.font = `700 29px "${w ?? "CardRenderer MTG Matrix Small Caps"}", Georgia`, t.textAlign = "center", t.textBaseline = "middle";
    const y = `${e.power}/${e.toughness}`;
    if (e.textInk?.stats?.length) {
      const b = w ? void 0 : (v) => v.split(/(\*)/).reduce((S, k) => S + (k === "*" ? 15 : t.measureText(k).width), 0);
      bt(
        t,
        y,
        407,
        0,
        78,
        e.textInk,
        "stats",
        () => {
          w ? xa(t, y) : La(t, y);
        },
        b
      );
    } else w ? xa(t, y) : La(t, y);
    t.restore();
  }
  const a = e.setCode?.toLowerCase(), i = a === "8ed" ? 75 : a === "9ed" ? 79 : 77, l = a === "8ed" || a === "9ed", d = o?.inheritedFrom && ["9ed", "mrd"].includes(a ?? "") ? void 0 : s?.artist, u = d ? 75 : i, h = d || l ? 633 : 634, m = l ? 633 : 634;
  t.fillStyle = kl(e) ? "#fff" : "#17140f", t.textBaseline = "alphabetic", t.textAlign = "left";
  const c = Ml(e);
  Z(t, e, "artist", () => {
    if (c) {
      t.save(), no(t, e, n, "artist");
      const p = r.get(c);
      if (!p) throw Error(`Eighth Edition artist brush unavailable: ${c}`);
      t.drawImage(p, 36.5, h - 10, u - 39, 13.5), t.font = `700 ${d || l ? 17.5 : 18}px "CardRenderer MTG Matrix", Georgia`;
      const w = e.power != null && e.toughness != null ? 350 : 448;
      if (d) {
        const y = d;
        t.translate(y.dx, y.dy), t.translate(u, h), t.scale(y.width, y.height), t.translate(-u, -h);
      }
      t.fillText(e.artist, u, h, w - u), t.restore();
    }
  });
  const g = is(e), f = ls(e, !1);
  if (t.save(), no(t, e, n, "legal"), t.font = '10px "CardRenderer MTG MPlantin", Georgia', !e.printingElements?.collector?.offset && !e.printingElements?.legal?.offset) {
    const p = [g, f].filter(Boolean).join(" ");
    p && t.fillText(p, 36.5, m + 13, 409);
  } else {
    const p = [g, f].filter(Boolean).join(" "), w = Math.min(1, 409 / Math.max(1, t.measureText(p).width));
    t.translate(36.5, m + 13);
    const y = (b, v) => {
      t.save(), t.scale(w, 1), t.fillText(b, v, 0), t.restore();
    };
    g && Z(t, e, "legal", () => y(g, 0)), f && Z(
      t,
      e,
      "collector",
      () => y(f, t.measureText(g ? g + " " : "").width)
    );
  }
  t.restore(), t.restore();
}
function ds(t, e) {
  const r = pe(t)?.toLowerCase();
  return t.setCode?.toLowerCase() === "8ed" && t.frameAssetFamily === "eighth" && !t.frameTemplate && (!t.layout || t.layout === "normal") && (!t.borderColor || t.borderColor === "white") && (t.frameColors === void 0 || t.frameColors.length === 1 && t.frameColors[0]?.toLowerCase() === r) && !!r && e === `${W}/img/frames/8th/${r}l.png`;
}
const Io = (t) => 244 + (t - 244) * 1.004 - 1.25, Oo = (t) => 340 + (t - 340) * 1.005 - 0.5;
function q0([t, e, r, n]) {
  return [Io(t * 488) / 488, Oo(e * 680) / 680, r * 1.004, n * 1.005];
}
function H0(t, e) {
  t.save(), t.beginPath(), t.rect(0, 0, 488, 680), t.rect(22, 22, 444, 636), t.clip("evenodd"), t.drawImage(e, 0, 0, 488, 680), t.restore();
  const r = [22, 28, 460, 466], n = [22, 28, 624, 658], o = [22, Io(28), Io(460), 466], s = [22, Oo(28), Oo(624), 658];
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
const X0 = {
  w: [22 / 255, 24 / 255, 18 / 255],
  u: [21 / 255, 25 / 255, 31 / 255],
  b: [3 / 255, 7 / 255, 14 / 255],
  r: [31 / 255, 25 / 255, 24 / 255],
  g: [16 / 255, 18 / 255, 21 / 255]
};
function lr(t, e) {
  return t.colorCalibration === "set-hsb-v1" && t.frameTreatment === "colorshifted" && e.includes("/colorshifted/") && zt(t, e) ? "#181510" : void 0;
}
function J0(t, e) {
  if (!lr(t, e)) return;
  const r = e.split("/").at(-1)?.replace(".png", ""), n = r && X0[r];
  return n ? {
    lift: n,
    transition: 96 / 255,
    ...xo[r].knots.length ? {
      textureMaskSource: `${W}/img/frames/8th/frame.png`,
      texture: xo[r].knots.map(
        ([o, s]) => [o / 255, [s[0] / 255, s[1] / 255, s[2] / 255]]
      )
    } : {}
  } : void 0;
}
function $o(t, e) {
  if (!lr(t, e)) return;
  const r = e.split("/").at(-1)?.replace(".png", ""), n = r && xo[r];
  return n ? {
    maskSource: `${W}/img/frames/8th/pinline.png`,
    outerMaskSource: `${W}/img/frames/8th/frame.png`,
    outset: 7 / 488,
    backdrop: [
      n.bevel.backdrop[0] / 255,
      n.bevel.backdrop[1] / 255,
      n.bevel.backdrop[2] / 255
    ],
    amount: n.bevel.amount
  } : void 0;
}
function wt(t) {
  const e = t.frameTreatment === "colorshifted";
  if (e && t.frameAssetFamily !== "eighth")
    throw Error("Colorshifted treatment requires the eighth frame family.");
  const r = !!ne(t);
  if (!t.frameAssetFamily && !r || ["split", "aftermath"].includes(t.layout ?? "") && t.faces?.length === 2) return null;
  if (lt(t) || t.layout && !["normal", "token"].includes(t.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
    throw Error("Replacement frame plates currently support ordinary modern faces only.");
  const n = t.frameAssetFamily === "eighth", o = G(t), s = pe(t), a = t.frameColors === void 0 && s ? [s] : F(t), i = a.length === 2 && "WUBRG".indexOf(a[1]) - "WUBRG".indexOf(a[0]) > 2 ? [...a].reverse() : a, l = n ? "8th" : "m15/new", d = `${W}/img/frames/${l}${e ? "/colorshifted" : ""}`, u = o.land ? "l" : o.artifact ? "a" : /\bVehicle\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "v" : a.length > 1 ? "m" : a[0]?.toLowerCase() ?? "c";
  if (e && !["w", "u", "b", "r", "g", "a"].includes(u))
    throw Error("Colorshifted plates support monocolored spells and artifacts only.");
  const h = (M) => n ? `${M.toLowerCase()}l` : `l${M.toLowerCase()}`, m = o.land && i.length ? h(i.length > 2 ? "m" : i[0]) : u, c = o.land && i.length === 2 ? h(i[1]) : void 0, g = u === "l" ? n ? "l" : "c" : u, f = n ? [0.09, 0.0629, 0.824, 0.0429] : [168 / 2010, 145 / 2814, 0.8292, 0.0543], p = n ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358] : [168 / 2010, 1588 / 2814, 0.8292, 0.0543], w = e ? [0.7234, 0.881, 0.204, 0.0772] : n ? [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814] : [0.7573, 0.8848, 0.188, 0.0733], y = `${d}/${m}.png`, b = ds(t, y), v = zt(t, y), S = Ro(t, y), k = (M) => b ? q0(M) : S ? A0(M, S) : v ? ro(M) : M;
  return {
    frame: y,
    rightFrame: c ? `${d}/${c}.png` : void 0,
    pinlines: v && !e && u === "m" && a.length === 2 ? {
      left: `${d}/${i[0].toLowerCase()}.png`,
      right: `${d}/${i[1].toLowerCase()}.png`,
      mask: `${d}/pinline.png`
    } : void 0,
    border: `${W}/img/frames/${l}/border.png`,
    pt: r ? re(o).pt : e ? `${W}/img/frames/m15/colorshifted/${g}pt.png` : n ? `${W}/img/frames/8th/pt/${g === "c" ? "l" : g}.png` : `${W}/img/frames/m15/regular/m15PT${g.toUpperCase()}.png`,
    rects: {
      ...H,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title: v ? ro(f) : f,
      type: v ? ro(p) : p,
      art: n ? k([180 / 2010, 341 / 2814, 1656 / 2010, 1216 / 2814]) : [0.0767, 0.1129, 0.8476, 0.4429],
      rules: n ? k([205 / 2010, 1779 / 2814, 1596 / 2010, 729 / 2814]) : r ? H.rules : [0.086, 1780 / 2814, 0.828, 0.2875],
      stats: r ? H.stats : v ? N0(w, e) : w,
      footer: n ? [150 / 2010, 1938 / 2100, 0.81, 0.04] : H.footer
    },
    titleSize: n ? nt(t)?.headings.title.size ?? 29.2 : 26,
    typeSize: n ? 24.3 : 22,
    // Shared family adjustments measured after frame-only scan normalization.
    // Cost discs have their own baseline; they do not follow font centering.
    mana: {
      right: r ? H.title[0] + H.title[2] - j.plateRight / 488 : (n ? 0.9147 : 1864 / 2010) - (n ? 2 : 1) / 488,
      center: r ? H.title[1] + H.title[3] / 2 + j.manaLift / (2 * 680) : f[1] + f[3] / 2 + (n ? 1 : -4) / 680,
      size: r ? j.manaSize : n ? 22 : 23.4,
      gap: r ? j.manaGap : 1.5
    },
    symbol: n ? { right: 0.9079 - 2 / 488, center: 0.5886, width: 0.114, height: 0.0391 * 0.95 } : { right: 1862 / 2010 - 2 / 488, center: 0.591, width: 0.114, height: 0.041 * 0.95 }
  };
}
function K0(t) {
  const e = wt(t);
  if (!e) return null;
  const r = Ml(t), n = ir(t), o = $o(t, e.frame);
  return [
    ...n ? [n] : [],
    ...o ? [o.maskSource, o.outerMaskSource] : [],
    ...r ? [r] : [],
    e.frame,
    ..._0(t),
    ...G0(t),
    ...e.rightFrame ? [e.rightFrame] : [],
    ...e.pinlines ? Object.values(e.pinlines) : [],
    ...t.power != null && t.toughness != null ? [e.pt] : [],
    ...nt(t) || It(t.setCode, t.borderColor).border !== "#090806" || t.frameAssetFamily === "m15-accurate" && t.calibration !== void 0 && t.calibration !== "source" && t.calibration !== "printing" || t.colorCalibration === "set-hsb-v1" && ne(t) || lr(t, e.frame) || Ze(t) ? [e.border] : []
  ];
}
const V0 = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", Br = {
  artInset: 3,
  artRim: 0.75,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function us(t) {
  if (!t.frameAssetFamily && !G(t).legendary && (t.layout ?? "normal") === "normal" && Qe === V0) {
    const e = t.borderColor ?? (It(t.setCode).border === "#eeedeb" ? "white" : "black"), r = `${t.setCode?.toLowerCase() ?? ""}/${e}`;
    if (Object.hasOwn(fa, r)) return fa[r];
  }
  return ["m15", "m19", "m20", "war"].includes(t.setCode?.toLowerCase() ?? "") ? Br.frameInset : 0;
}
function Z0(t) {
  const e = us(t), r = H.frame[0] * x, n = H.frame[2] * x, o = H.art[0] * x + Br.artInset, s = r + e + (o - r) * (1 - 2 * e / n), a = Br.artRim;
  return [
    s / x,
    H.art[1] + a / I,
    1 - 2 * s / x,
    H.art[3] - 2 * a / I
  ];
}
const Q0 = {
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
function th(t, e) {
  const r = [...new Set(t)].filter((o) => /^[WUBRG]$/.test(o));
  r.sort((o, s) => "WUBRG".indexOf(o) - "WUBRG".indexOf(s));
  const n = r.join("");
  return e?.toLowerCase() === "leb" && (n === "WU" || n === "UR") ? n === "WU" ? "W" : "U" : r.length === 1 ? r[0] : Q0[n];
}
function ie(t) {
  if (t.frameTemplate || !["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "") || t.frameStyle === "modern" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) || t.layout && t.layout !== "normal")
    return;
  const e = at(t)?.dual;
  if (e) return e;
  const r = mn(t);
  if (r.length !== 2) return;
  const n = ["WU", "WG", "UG", "BG", "RG"].includes(r.join("")) ? [...r].reverse() : r, o = `${Y.RETRO_ROOT}/img/frames/old/abu/`;
  return {
    pinline: void 0,
    base: `${o}${n[0].toLowerCase()}l.png`,
    overlay: `${o}${n[1].toLowerCase()}l.png`,
    mask: `${Y.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`,
    outline: `${o}${th(r, t.setCode).toLowerCase()}l.png`
  };
}
function hs(t) {
  return ["lea", "leb"].includes(t.setCode?.toLowerCase() ?? "") && ie(t) !== void 0;
}
function ms(t) {
  return hs(t) ? 2 : 0;
}
function eh(t, e, r, n) {
  if (hs(e)) {
    t.save();
    try {
      t.beginPath(), t.rect(0, 0, 488, 680);
      const o = t.getTransform();
      if (o.b !== 0 || o.c !== 0 || o.a <= 0 || o.d <= 0)
        throw Error("Historical perimeter composition requires axis-aligned raster scaling.");
      const s = (u) => (Math.round(u * o.a + o.e) - o.e) / o.a, a = (u) => (Math.round(u * o.d + o.f) - o.f) / o.d, i = s(45), l = a(45);
      t.rect(i, l, s(443) - i, a(632) - l), t.clip("evenodd");
      const d = t.filter;
      t.filter = "none", t.fillStyle = n, t.fillRect(0, 0, 488, 680), t.filter = d, t.drawImage(r, 0, -2, 488, 680);
    } finally {
      t.restore();
    }
  }
}
function rh(t) {
  if (hs(t)) return "abu-dual-perimeter-up2-paper-up6-art-up2-v4";
  const e = ie(t);
  return e && e.outline !== e.overlay ? "abu-dual-outline-raster-v4" : void 0;
}
function vt(t) {
  return t.setCode?.toLowerCase() === "3ed" && !t.frameTemplate && t.frameStyle !== "modern" && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") && (!t.layout || t.layout === "normal") && (t.land ?? /\bLand\b/.test(t.typeLine ?? ""));
}
const xr = `${Y.RETRO_ROOT}/img/frames/old/fourth/l.png`, nh = [2.404 / 488, 9.9 / 680, 0.984, 0.99], oh = [
  (2.404 + 0.10533333333333333 * 488 * 0.984) / 488,
  (9.9 + 0.08571428571428572 * 680 * 0.99) / 680,
  0.7926666666666666 * 0.984,
  0.4552380952380952 * 0.99
];
function Tl(t) {
  const e = t.frameColors ?? [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(([r]) => new RegExp(`\\b${r}\\b`).test(t.typeLine ?? "")).map(([, r]) => r);
  return [...new Set(e)].filter((r) => "WUBRG".includes(r)).sort((r, n) => "RBWUG".indexOf(r) - "RBWUG".indexOf(n));
}
function cs(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !["lea", "leb", "3ed", "leg", "8ed", "m21"].includes(e) || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = St(t);
  if (lt(t)) {
    if (ie(t) || vt(t)) return;
    const o = me(t), s = Wr(t);
    return {
      key: `${e}/${r}/retro/${o.split("/").at(-1)}`,
      family: "retro",
      frame: o,
      rect: s,
      assets: { frame: o },
      source: JSON.stringify([o, s])
    };
  }
  const n = wt(t);
  if (n) {
    if (n.rightFrame) return;
    const o = lh(t);
    return {
      key: `${e}/${r}/${t.frameAssetFamily ?? "m15-accurate"}/${n.frame.split("/").at(-1)}${o ? "/paper-" + o : ""}`,
      family: "plate",
      frame: n.frame,
      rect: n.rects.frame,
      assets: { frame: n.frame, pt: n.pt },
      source: JSON.stringify([
        n.frame,
        n.rects,
        ...o ? [["artifact-paper", o]] : []
      ])
    };
  }
  return gs(t);
}
function gs(t) {
  const e = t.setCode?.toLowerCase(), r = St(t), n = G(t);
  if (n.land) return;
  const o = re(n);
  return {
    key: `${e}/${r}/components/${n.boxes}/${n.frame}`,
    family: "components",
    frame: o.frame,
    rect: H.frame,
    assets: o,
    source: JSON.stringify([o, H.frame, us(t)])
  };
}
function ot(t) {
  if (!ah(t)) return;
  const e = dl[t.setCode?.toLowerCase() ?? ""], r = !t.frameTemplate && !t.faces?.length && (!t.layout || t.layout === "normal" || t.layout === "planeswalker") && !/\b(Saga|Class|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "");
  return e && r ? e : f0(t);
}
function sh(t) {
  const e = ot(t);
  if (!e) return [];
  const { ordinaryPlates: r, landPlates: n, ...o } = e, s = fs(t);
  return [
    [
      "modern-printing",
      t.setCode?.toLowerCase(),
      o,
      ne(t) ?? null,
      Fn(t) ?? null,
      s ? [
        s.profile.root,
        s.profile.commonTexture,
        s.dual ? s.profile.neutralHeaders : null
      ] : null
    ]
  ];
}
function ah(t) {
  return sl(t);
}
function fs(t) {
  const e = ot(t)?.landPlates;
  if (!e || e.root !== Y.CONJURER_ROOT + "/img/frames/m15/new" || t.frameTemplate || t.faces?.length)
    return;
  const r = G(t);
  if (!r.land || r.legendary || r.artifact || t.legendary || t.layout && t.layout !== "normal" || t.borderColor !== void 0 && t.borderColor !== "black")
    return;
  const n = F(t), o = n.length > 2 ? [e.root + "/lm.png"] : n.length ? n.map((s) => e.root + "/l" + s.toLowerCase() + ".png") : [e.root + "/l.png"];
  if (o.every((s) => Object.hasOwn(e.materials, s)))
    return { profile: e, sources: o, dual: n.length === 2 };
}
function Fn(t) {
  const e = t.frameColors ?? t.colors ?? [], r = t.canonicalTypeLine ?? t.typeLine ?? "";
  if (!(t.artifact ?? /\bArtifact\b/.test(r)) || e.length !== 1 || !ne(t))
    return;
  const n = Y.CONJURER_ROOT + "/img/frames/m15/new", o = n + "/" + e[0].toLowerCase() + ".png", s = ot(t)?.ordinaryPlates?.[o];
  if (s)
    return { source: o, mask: n + "/pinline.png", correction: s };
}
function Te(t) {
  return /\bPlaneswalker\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? ot(t)?.planeswalkers : void 0;
}
function ih(t, e) {
  return t.colorCalibration === "set-hsb-v1" && t.calibration !== "source" ? Te(t)?.frameRepaint?.[e] ?? 0 : 0;
}
function xl(t) {
  const e = Te(t);
  return e?.deckCollectorNumbers.includes(t.collectorNumber ?? "") ? void 0 : e;
}
function ne(t) {
  const e = fs(t);
  if (e)
    return Object.fromEntries(
      e.sources.map((h) => [h, e.profile.materials[h]])
    );
  const r = ot(t);
  if (r?.inheritedFrom && ps(t)) return;
  const n = r?.ordinaryPlates, o = t.canonicalTypeLine ?? t.typeLine ?? "", s = t.frameColors ?? t.colors ?? [], a = t.artifact ?? /\bArtifact\b/.test(o), i = a ? "a" : s[0]?.toLowerCase(), l = `${Y.CONJURER_ROOT}/img/frames/m15/new/${i}.png`;
  if (!n || t.frameTemplate || t.faces?.length || !Object.hasOwn(n, l) || t.layout && t.layout !== "normal" || t.legendary || t.land || t.borderColor !== void 0 && t.borderColor !== "black" || /\b(Legendary|Land|Planeswalker|Saga|Class|Battle|Vehicle)\b/.test(o) || /^Level up\b/m.test(t.rulesText ?? "") || s.length > 1 || !a && s.length !== 1)
    return;
  const d = n[l], u = a ? ot(t)?.artifactPapers?.[s[0] ?? ""] : void 0;
  if (!u) return { [l]: d };
  if (!("mask" in d) || d.regions?.length !== 2)
    throw Error("Colored artifact paper requires the source-local three-panel masks.");
  return {
    [l]: {
      ...d,
      paper: u.paper,
      regions: [
        { ...d.regions[0], adjustment: u.name },
        { ...d.regions[1], adjustment: u.type }
      ]
    }
  };
}
function lh(t) {
  const e = t.frameColors ?? t.colors ?? [], r = e.length === 1 ? e[0] : void 0, n = Y.CONJURER_ROOT + "/img/frames/m15/new/a.png";
  return r && ot(t)?.artifactPapers?.[r] && ne(t)?.[n] ? r : void 0;
}
function ps(t) {
  const e = gs(t);
  if (!e) return;
  const r = G(t).legendary, n = (r ? void 0 : ns[e.key]) ?? un[e.key] ?? Gn[e.key];
  return n?.source === e.source && (n.legendary === void 0 || n.legendary === r) ? n.materials : void 0;
}
const oo = "WUBRG";
function G(t) {
  const e = t.canonicalTypeLine ?? t.typeLine ?? "", r = t.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(e), n = t.land ?? (!/^Enchant\b/i.test(e) && /(^|\s)Land(?:\s|$)/i.test(e)), o = !/\bPlaneswalker\b/i.test(e) && (t.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(e)), s = t.creature ?? /(^|\s)Creature(?:\s|$)/i.test(e), a = F(t), i = a.length === 0 ? "Colourless" : a.length > 2 ? "Gold" : a.join(""), l = (r || n) && a.length === 0 ? "Artifact" : i, d = n ? "Land" : r ? "Artifact" : a.length > 1 ? "Gold" : i;
  return {
    frame: l,
    boxes: d,
    background: d,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: n && a.length > 0 ? i : r && a.length > 0 ? a.length > 1 ? "Gold" : i : o && a.length === 2 && t.setCode && ot(t)?.pairedLegendaryCrowns ? i : d,
    pt: d,
    artifact: r,
    land: n,
    legendary: o,
    creature: s,
    className: `rendered-card-profile-${d.toLocaleLowerCase()}`
  };
}
function F(t) {
  if (t.frameColors !== void 0) return Rr(t.frameColors);
  const e = t.setCode && t.name && t.collectorNumber ? ot(t)?.printedFrameColors?.[t.collectorNumber] : void 0;
  if (e && e.name === t.name) return Rr(e.colors);
  const r = Rr(t.colors ?? []), n = pe(t);
  return r.length === 0 && n && t.land !== !1 ? [n] : r;
}
function Rr(t) {
  return [
    ...new Set(
      t.map((e) => e.toLocaleUpperCase()).filter((e) => oo.includes(e))
    )
  ].sort((e, r) => oo.indexOf(e) - oo.indexOf(r));
}
const dh = {
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
}, uh = {
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
};
function ys(t) {
  return ["arn", "atq", "drk"].includes(t.setCode?.toLowerCase() ?? "") && lt(t) && !t.frameTemplate && (t.layout ?? "normal") === "normal" && St(t) === "black" && !G(t).legendary && !/^Level up\b/m.test(t.rulesText ?? "") && t.symbolStyle !== "modern" && !(t.symbolStyle === void 0 && t.wordingMode === "oracle");
}
function Fr(t) {
  if (t.setCode?.toLowerCase() !== "arn" || !ys(t)) return;
  const e = t.collectorNumber ?? "";
  return /^\d+†$/.test(e) ? "light" : /^\d+$/.test(e) ? "dark" : void 0;
}
const hh = {
  W: [105, 117, 115],
  U: [53, 97, 116],
  B: [66, 78, 76],
  R: [96, 52, 46],
  G: [57, 92, 84],
  A: [92, 90, 83]
};
function mh(t) {
  if (Fr(t) !== "dark") return;
  const e = F(t), n = G(t).artifact ? "A" : e.length === 1 ? e[0] : "", o = hh[n];
  return o ? { fill: t.calibration !== "source" && (t.calibration === "auto" || t.colorCalibration === "set-hsb-v1") ? `rgba(${o.join(",")},0.8)` : "rgba(0,0,0,0.4)" } : void 0;
}
function ch(t, e, r, n, o, s, a) {
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
function dr(t) {
  return !!at(t) && !/^Level up\b/m.test(t.rulesText ?? "") && t.symbolStyle !== "modern" && !(t.symbolStyle === void 0 && t.wordingMode === "oracle");
}
function gh(t) {
  if (!dr(t)) return;
  const e = rt(t).mana, r = Fr(t), n = r ? e.variants?.[r]?.geometry : void 0;
  return n ? { ...e.geometry, ...n } : e.geometry;
}
function fh(t, e) {
  if (!dr(t) || $n(t)) return;
  const r = rt(t).mana, n = Fr(t), o = e === "X" ? "N" : e;
  return (n ? r.variants?.[n]?.paper?.[o] : void 0) ?? r.paper[o];
}
function ph(t) {
  return !$n(t) && t.calibration !== "source" && t.colorCalibration === "set-hsb-v1" && dr(t) ? rt(t).mana.ink : void 0;
}
function Qt(t, e) {
  if (!(t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle"))
    return dh[t.setCode?.toLowerCase() ?? ""]?.[e];
}
function bs(t) {
  return t.setCode?.toLowerCase() === "3ed" && lt(t) && (t.layout ?? "normal") === "normal" && !(t.legendary ?? /\bLegendary\b/.test(t.typeLine ?? "")) && !/^Level up\b/m.test(t.rulesText ?? "") && St(t) === "white" && Lt(t) === "fourth" && Qt(t, "W") === "historic-font" && Qt(t, "U") === "conjurer-old" && Qt(t, "B") === "mse-old" && Qt(t, "R") === "mse-old" && Qt(t, "G") === "conjurer-old";
}
function Po(t, e) {
  const r = Qt(t, e), n = r && r !== "modern" && r !== "historic-font" ? uh[`${e}/${r}`] : void 0, o = Ll(t, e);
  return n && o ? { ...n, inkExpansion: o.pixels } : n;
}
function Rl(t, e) {
  return e === "B" && dr(t) && rt(t).mana.paperSample !== "printing" ? "opaque-percentile" : Ll(t, e)?.paperSample;
}
function Ll(t, e) {
  const r = dr(t), o = (r && /^[WUBRG]$/.test(e) ? rt(t).mana.sourceInk?.[e] : void 0) ?? u0[`${t.setCode?.toLowerCase()}/${e}`];
  if (!o || o.family !== Qt(t, e)) return;
  const s = t.setCode?.toLowerCase() === "3ed" && lt(t) && (t.layout ?? "normal") === "normal" && St(t) === "white" && Lt(t) === "fourth";
  if (!(o.paperSample && !ys(t) && !r && !s))
    return o;
}
const so = {
  shadow: [-1.0372, 2.0372],
  paper: [202, 197, 192],
  ink: [13, 15, 15]
};
function El(t) {
  return Te(t) && (t.manaSymbols?.length ?? 0) > 0 ? !0 : !lt(t) && (t.frameAssetFamily === void 0 || !!ne(t)) && t.frameTemplate === void 0 && (t.layout ?? "normal") === "normal" && !/\b(Saga|Class|Planeswalker|Battle)\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") && !/^Level up\b/m.test(t.rulesText ?? "");
}
function Al(t) {
  if (!El(t)) return;
  const e = ot(t)?.mana;
  return e ? {
    ...so,
    shadow: e.shadow,
    ...t.colorCalibration === "set-hsb-v1" && t.calibration !== "source" ? { paper: e.paperTargets.N ?? so.paper } : {}
  } : so;
}
function Bl(t, e) {
  return Al(t) && /^\d$/.test(e) ? `${W}/img/manaSymbols/${e}.svg` : null;
}
function Kt(t) {
  const e = [
    t.rulesText ?? "",
    ...(t.rulesParagraphs ?? []).flatMap((n) => n.runs.map((o) => o.text))
  ], r = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...e.flatMap(
      (n) => Pn(n).flatMap((o) => o.symbol ? [o.symbol] : [])
    )
  ]);
  return [
    ...(t.manaSymbols ?? []).flatMap((n) => {
      const o = Bl(t, n);
      return o ? [o] : [];
    }),
    ...[...r].map(
      (n) => Qt(t, n) === "historic-font" ? null : Po(t, n)?.url ?? tr(n)
    )
  ];
}
const Ea = [19.375 / 488, 21.125 / 680, 449.625 / 488, 639.25 / 680], Aa = {
  W: {
    family: "abu",
    stockWindow: Ea,
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
    stockWindow: Ea,
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
function Ot(t) {
  if (t.setCode?.toLowerCase() !== "leg" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const e = t.typeLine ?? "", r = F(t), n = t.land ?? /\bLand\b/.test(e) ? "L" : t.artifact ?? /\bArtifact\b/.test(e) ? "A" : r.length > 1 ? "M" : r[0];
  if (!n || !(n in Aa)) return;
  const o = Aa[n];
  return {
    ...o,
    material: n,
    asset: `${Y.RETRO_ROOT}/img/frames/old/${o.family}/${n.toLowerCase()}.png`
  };
}
function ur(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !["arn", "atq", "drk"].includes(e) || t.frameTemplate || t.frameStyle === "modern" || t.borderColor && t.borderColor !== "black" || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", n = F(t), o = t.land ?? /\bLand\b/.test(r);
  if (o && (/\b(Basic|Plains|Island|Swamp|Mountain|Forest)\b/.test(r) || e === "arn" && t.name === "Mountain"))
    return;
  const s = o ? "L" : t.artifact ?? /\bArtifact\b/.test(r) ? "A" : n.length === 1 ? n[0] : n.length > 1 ? "M" : void 0, a = s && c0[`${e}/${s}`];
  if (a)
    return {
      ...a,
      material: s,
      asset: `${Y.RETRO_ROOT}/img/frames/old/${a.family}/${s.toLowerCase()}.png`
    };
}
function yh(t) {
  if (t.colorCalibration !== "set-hsb-v1" || t.borderColor && t.borderColor !== "black")
    return;
  const e = Ot(t);
  return e && Gn[`leg/black/retro/${e.material.toLowerCase()}.png`]?.source === JSON.stringify([e.asset, e.frame]) ? "#262626" : void 0;
}
const Il = {
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
    x: [1.0095, -0.59375],
    y: [1.0095, 4.75],
    aperture: [0.10533333333333333, 0.08952380952380952, 0.792, 0.45285714285714285]
  }
};
function ws(t) {
  if (t.setCode?.toLowerCase() !== "3ed" || t.frameTemplate || t.frameStyle === "modern" || t.borderColor && t.borderColor !== "white" || vt(t) || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return null;
  if (G(t).artifact) return "A";
  const e = F(t);
  if (e.length !== 1) return null;
  const r = e[0];
  return r === "W" || r === "U" || r === "B" || r === "R" || r === "G" ? r : null;
}
function Ol(t) {
  const e = ws(t);
  if (!e) return null;
  const {
    x: [r, n],
    y: [o, s]
  } = Il[e];
  return [
    (244 + (0.012 * 488 - 244) * r + n) / 488,
    (340 + (0.01 * 680 - 340) * o + s) / 680,
    0.974 * r,
    0.982 * o
  ];
}
function bh(t) {
  const e = ws(t), r = Ol(t);
  if (!e || !r) return null;
  const [n, o, s, a] = Il[e].aperture;
  return [r[0] + n * r[2], r[1] + o * r[3], s * r[2], a * r[3]];
}
function $l(t) {
  return ws(t) !== null;
}
const wh = Y.RETRO_SYMBOL_FONT, er = Y.RETRO_ROOT, vh = `${er}/fonts/goudy-medieval.ttf`, Sh = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), Ch = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function lt(t) {
  return t.frameTemplate || t.layout && !["normal", "token"].includes(t.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") ? !1 : t.frameStyle === "retro" || t.frameStyle !== "modern" && Sh.has(t.setCode?.toLowerCase() ?? "");
}
function vs(t) {
  return ["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "");
}
function Lt(t) {
  const e = at(t);
  if (e) return e.family;
  const r = t.setCode?.toLowerCase() ?? "", n = ur(t);
  if (n) return n.family;
  const o = Ot(t);
  return o ? o.family : vs(t) ? "abu" : r === "leg" && F(t).length > 1 ? "legends" : vt(t) || ["3ed", "4ed", "5ed", "atq"].includes(r) && !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) ? "fourth" : "seventh";
}
function Wr(t) {
  const e = at(t);
  if (e) return e.frame;
  const r = ur(t);
  if (r) return r.frame;
  const n = Ot(t);
  if (n) return n.frame;
  if (vt(t)) return nh;
  const o = Ol(t);
  return o || (Lt(t) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1]);
}
function Wn(t) {
  const e = vs(t), r = Ot(t) && (!t.borderColor || t.borderColor === "black");
  return {
    ...H,
    frame: Wr(t),
    title: [e ? 0.07 : 0.1134, 0.0481, e ? 0.8467 : 0.8, 0.043],
    art: at(t)?.art ?? ur(t)?.art ?? Ot(t)?.art ?? bh(t) ?? (vt(t) ? oh : Lt(t) === "legends" ? [0.112, 0.094, 0.78, 0.45] : Lt(t) === "fourth" ? [0.109, 0.093, 0.779, 0.453] : e ? [0.116, 0.1043, 0.7654, 0.441 - ms(t) / I] : [0.12, 0.0991, 0.7667, 0.4429]),
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: r ? [384 / x, 617 / I, 72 / x, 30 / I] : [0.8074, 0.895, 0.1367, 0.043],
    footer: r ? [48 / x, 624 / I, 340 / x, 24 / I] : [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function me(t) {
  const e = at(t);
  if (e) return e.asset;
  const r = ur(t);
  if (r) return r.asset;
  const n = Ot(t);
  if (n) return n.asset;
  if (vt(t)) return xr;
  const o = ie(t);
  if (o) return o.base;
  const s = F(t), a = t.canonicalTypeLine ?? t.typeLine ?? "", i = G(t), l = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([c]) => a.includes(c)), d = t.frameColors?.map((c) => c.toLowerCase()) ?? l.map(([, c]) => c), u = i.land ? d.length === 1 ? d[0] + "l" : "l" : i.artifact ? "a" : s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c", h = Lt(t), m = h === "seventh" || u === "c" || h === "abu" && u === "m" ? "seventh/regular" : `old/${h}`;
  return `${er}/img/frames/${m}/${h === "legends" ? "legendsFrameM" : u}.png`;
}
function St(t) {
  return t.borderColor ?? (Ch.has(t.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function kh(t) {
  return St(t) === "silver" ? It(null, "silver").border : St(t) === "white" ? Th : yh(t) ?? "#080808";
}
function fn(t) {
  return Lt(t) === "fourth" ? `${er}/img/frames/old/fourth/borderBlack.png` : `${er}/img/frames/${Lt(t) === "abu" ? "old/abu" : "seventh/regular"}/border.svg`;
}
function Ba(t) {
  return vs(t) ? "#ababab" : "#f2eee3";
}
function Mh(t) {
  return t.setCode?.toLowerCase() === "7ed" && F(t).some((e) => e === "W" || e === "G") && !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) ? "saturate(.7) brightness(.88)" : "none";
}
function Ss(t) {
  if (rs(t)) return null;
  const e = ll(t);
  return e ? `${er}/img/frames/m15/basics/${e.toLowerCase()}.png` : null;
}
const Th = "#eeedeb";
function Pl(t) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  const e = t.setCode?.toLowerCase() ?? "";
  return !t.setSymbol && e === "ice" && t.setSymbolSource === "keyrune" ? `${Y.KEYRUNE_ROOT}/ice2.svg` : !t.setSymbol && e0(e, t.name) ? null : st(t);
}
function r2(t) {
  const e = (t.rulesText ?? "").length;
  return e > 340 ? 16 : e > 210 ? 19 : 23;
}
function xh(t) {
  const e = ie(t);
  return [
    Ss(t),
    me(t),
    e?.overlay,
    e?.mask,
    ...at(t)?.dual ? [e?.outline] : [],
    !vt(t) && !$l(t) && (at(t)?.stockMaskFrame || St(t) !== "black" || Lt(t) === "fourth" || Ze(t)) ? fn(t) : null,
    t.illustration,
    Pl(t),
    ...Kt(t)
  ];
}
const At = ([t, e, r, n]) => [
  t * x,
  e * I,
  r * x,
  n * I
];
function n2(t, e) {
  return ["7ed", "8ed", "9ed"].includes(t?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(e ?? "") ? "black" : void 0;
}
function Cs(t) {
  return t.setCode?.toLowerCase() === "3ed" && Lt(t) === "fourth";
}
function Rh(t, e, r, n, o) {
  t.save(), t.translate(38, n), t.scale(1.03, 1), t.font = '26px "CardRenderer MTG Goudy", Georgia', ar(t, e, 0, 0, (o + r - 38) / 1.03, 1), t.restore();
}
function Lh(t, e, r, n) {
  t.save(), t.font = '27.25px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "right", ar(t, e, 450.5, r + 11.5, 130, 1.25, "#d4d4d4", n), t.restore();
}
function Eh(t, e) {
  t.save(), t.font = '22px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.textBaseline = "alphabetic", t.translate(48, 642.5), t.scale(1.02, 1), ar(t, `Illus. © ${e}`, 0, 0, 338 / 1.02, 1.25), t.restore();
}
const Ah = {
  family: "CardRenderer MTG Revised Plantin",
  url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/PlantinMTProRg.woff2",
  weight: "400",
  style: "normal"
};
let Ia;
function ks(t) {
  return Cs(t) && lt(t) && !vt(t);
}
function Bh(t) {
  return ks(t) ? Ia ??= (async () => {
    const { family: e, url: r, weight: n, style: o } = Ah;
    if ([...it()].some(
      (i) => i.family.replace(/^"|"$/g, "") === e && i.status === "loaded"
    ))
      return;
    if (typeof FontFace != "function") throw Error("Revised type font needs FontFace support");
    const s = await In(r);
    if (!s.ok) throw Error("Revised type font is unavailable");
    const a = await new FontFace(e, await s.arrayBuffer(), { weight: n, style: o }).load();
    it().add(a);
  })().catch((e) => {
    throw Ia = void 0, e;
  }) : Promise.resolve();
}
function Ih(t, e, r, n, o, s) {
  if (!ks(e)) return !1;
  t.save();
  const a = t.measureText("Hg");
  t.font = '21.7px "CardRenderer MTG Revised Plantin", Georgia';
  const i = t.measureText("Hg"), l = (-a.actualBoundingBoxAscent + a.actualBoundingBoxDescent + i.actualBoundingBoxAscent - i.actualBoundingBoxDescent) / 2;
  return ar(
    t,
    r,
    n - 2,
    o + 4 + l,
    s,
    1,
    "#ababab",
    e.textInk,
    "type"
  ), t.restore(), !0;
}
function Oa(t) {
  if (!t) return [];
  const e = t.rulesParagraphs?.filter((r) => r.role === "flavor");
  return e?.length ? e : (t.flavorText ?? "").split(`
`).filter(Boolean).map((r) => ({
    role: "flavor",
    runs: r.split("*").map((n, o) => ({ text: n, italic: o % 2 === 0 })).filter((n) => n.text)
  }));
}
function Oh(t, e, r) {
  const n = Oa(t), o = r ? n.length ? n : Oa(e) : [];
  if (!n.length && !o.length) return t;
  const a = [...t.rulesParagraphs?.filter((i) => i.role !== "flavor") ?? t.rulesText.split(`
`).filter(Boolean).map((i) => ({ role: "rules", runs: [{ text: i }] })), ...o];
  return {
    ...t,
    flavorText: void 0,
    rulesText: a.map((i) => i.runs.map((l) => l.text).join("")).join(`
`),
    rulesParagraphs: a
  };
}
const $h = ["ice", "chr", "all"], Ph = { leg: { "Adun Oakenshield": "{G}{R}{B}", "Angus Mackenzie": "{W}{U}{G}", "Arcades Sabboth": "{2}{W}{W}{G}{G}{U}{U}", "Axelrod Gunnarson": "{4}{B}{B}{R}{R}", "Ayesha Tanaka": "{U}{U}{W}{W}", "Barktooth Warbeard": "{4}{B}{R}{R}", "Bartel Runeaxe": "{3}{G}{R}{B}", "Boris Devilboon": "{3}{B}{R}", Chromium: "{2}{B}{B}{U}{U}{W}{W}", "Dakkon Blackblade": "{2}{B}{U}{U}{W}", "Gabriel Angelfire": "{3}{W}{W}{G}{G}", "Gosta Dirk": "{3}{W}{W}{U}{U}", "Gwendlyn Di Corci": "{R}{B}{B}{U}", Halfdane: "{1}{B}{U}{W}", "Hazezon Tamar": "{4}{W}{G}{R}", "Hunding Gjornersen": "{3}{U}{U}{W}", "Jacques le Vert": "{1}{W}{G}{R}", "Jasmine Boreal": "{3}{W}{G}", "Jedit Ojanen": "{4}{U}{W}{W}", "Jerrard of the Closed Fist": "{3}{G}{G}{R}", Johan: "{3}{W}{G}{R}", "Kasimir the Lone Wolf": "{4}{U}{W}", "Kei Takahashi": "{2}{W}{G}", "Lady Caleria": "{3}{W}{W}{G}{G}", "Lady Evangela": "{B}{U}{W}", "Lady Orca": "{5}{B}{R}", "Livonya Silone": "{2}{G}{G}{R}{R}", "Lord Magnus": "{3}{W}{W}{G}", "Marhault Elsdragon": "{3}{G}{R}{R}", Nebuchadnezzar: "{3}{B}{U}", "Nicol Bolas": "{2}{U}{U}{B}{B}{R}{R}", "Palladia-Mors": "{2}{W}{W}{G}{G}{R}{R}", "Pavel Maliki": "{4}{B}{R}", "Princess Lucrezia": "{3}{B}{U}{U}", Ragnar: "{U}{W}{G}", "Ramirez DePietro": "{3}{B}{B}{U}", "Ramses Overdark": "{2}{B}{B}{U}{U}", "Rasputin Dreamweaver": "{4}{W}{U}", "Riven Turnbull": "{5}{B}{U}", "Rohgahh of Kher Keep": "{2}{B}{B}{R}{R}", "Rubinia Soulsinger": "{2}{U}{W}{G}", "Sir Shandlar of Eberyn": "{4}{W}{G}", "Sivitri Scarzam": "{5}{B}{U}", "Sol'kanar the Swamp King": "{2}{R}{B}{U}", Stangg: "{4}{G}{R}", "Sunastian Falconer": "{3}{G}{R}", "Tetsuo Umezawa": "{R}{B}{U}", "The Lady of the Mountain": "{4}{G}{R}", "Tobias Andrion": "{3}{U}{W}", "Tor Wauki": "{2}{B}{B}{R}", "Torsten Von Ursus": "{3}{W}{G}{G}", "Tuknir Deathlock": "{G}{G}{R}{R}", "Ur-Drago": "{3}{B}{B}{U}{U}", "Vaevictis Asmadi": "{2}{B}{B}{R}{R}{G}{G}", "Xira Arien": "{G}{R}{B}" }, drk: { "Dark Heart of the Wood": "{B}{G}", "Marsh Goblins": "{B}{R}", "Scarwood Goblins": "{G}{R}" } }, $a = {
  wubrgSets: $h,
  overrides: Ph
};
function Gl(t, e) {
  const r = t.setCode?.toLowerCase() ?? "", o = $a.overrides[r]?.[t.name ?? ""];
  if (o) {
    const s = [...o.matchAll(/\{([^}]+)\}/g)].map((a) => a[1]);
    return [...s].sort().join("|") === [...e].sort().join("|") ? s : [...e];
  }
  return !$a.wubrgSets.includes(r) || e.some((s) => !/^(?:\d+|X|[WUBRG])$/.test(s)) ? [...e] : [
    ...e.filter((s) => !"WUBRG".includes(s)),
    ...e.filter((s) => "WUBRG".includes(s)).sort((s, a) => "WUBRG".indexOf(s) - "WUBRG".indexOf(a))
  ];
}
function Fl(t) {
  if (!/\bLand\b/.test(t)) return;
  const e = ["Plains", "Island", "Swamp", "Mountain", "Forest"].flatMap(
    (r, n) => new RegExp(`\\b${r}\\b`).test(t) ? ["WUBRG"[n]] : []
  );
  return e.length >= 1 && e.length <= 2 ? e : void 0;
}
function Gh(t, e, r, n, o) {
  if (!/\bLand\b/.test(t) || e.length) return;
  const s = Fl(t);
  if (s || /\b(Plains|Island|Swamp|Mountain|Forest)\b/.test(t) || ["lea", "leb", "2ed", "3ed"].includes(r?.toLowerCase() ?? ""))
    return s;
  if (!["2003", "2015", "future"].includes(n) || /\bArtifact\b/.test(t) || o == null) return;
  if (!Array.isArray(o) || !o.every((l) => typeof l == "string" && /^[WUBRGC]$/.test(l)))
    throw Error("Invalid produced mana.");
  const a = [..."WUBRG"].filter((l) => o.includes(l)), i = r?.toLowerCase() === "8ed" && n === "2003" ? 5 : 2;
  return a.length >= 1 && a.length <= i ? a : void 0;
}
function Fh(t) {
  const e = t.split(`
`).flatMap((r) => {
    const n = /^\(?\{T\}: Add (\{[WUBRGC]\}(?:,? (?:or )?\{[WUBRGC]\})*)\.\)?$/.exec(r);
    return n ? [...n[1].matchAll(/\{([WUBRGC])\}/g)].map((o) => o[1]) : [];
  });
  return e.length ? [...new Set(e)] : void 0;
}
function Wh(t, e, r) {
  return /\b(Saga|Class|Planeswalker|Battle)\b/.test(e) || /^Level up\b/m.test(r) ? { ...t, frameAssetFamily: void 0 } : t;
}
function ee(t) {
  return t.rulesParagraphs ?? t.rulesText.split(`
`).filter(Boolean).map((e) => ({ role: "rules", runs: [{ text: e }] }));
}
function Wl(t, e, r = "oracle", n = {}) {
  if (n.includeFlavorText !== void 0 && typeof n.includeFlavorText != "boolean")
    throw Error("Flavor-text selection must be a boolean");
  if (r === "oracle" && n.includeFlavorText !== void 0) {
    const { includeFlavorText: l, ...d } = n, u = Oh(e.oracle, e.original, l);
    return Wl(t, { ...e, oracle: u }, r, d);
  }
  const o = e[r];
  if (!o) throw Error(`Missing ${r} printing wording`);
  if (typeof o.typeLine != "string" || typeof o.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const s = n.rulesAlignment ?? r, a = s === "left" ? void 0 : e[s];
  if (s !== "left" && !a) throw Error(`Missing ${s} alignment wording`);
  const i = G({ ...t, typeLine: e.oracle.typeLine });
  return {
    ...t,
    ...o,
    canonicalTypeLine: t.canonicalTypeLine ?? e.oracle.typeLine,
    frameColors: t.frameColors ?? (i.land && !t.colors?.length ? Fl(t.canonicalTypeLine ?? e.oracle.typeLine) : void 0),
    manaSymbols: o.manaSymbols ?? (r === "original" ? Gl(t, t.manaSymbols ?? []) : e.oracle.manaSymbols ?? t.manaSymbols),
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: o.rulesParagraphs,
    rulesAlignment: a ? { mode: "auto", reference: ee(a) } : { mode: "left" },
    artifact: t.artifact ?? i.artifact,
    land: t.land ?? i.land,
    creature: t.creature ?? i.creature,
    legendary: t.legendary ?? i.legendary,
    wordingMode: r,
    symbolStyle: n.symbolStyle ?? (r === "oracle" ? "modern" : "original")
  };
}
const _h = {
  "Mana Vault": "Tap to add 3 colorless mana to your mana pool. Mana Vault doesn't untap normally during untap phase; to untap it, you must pay 4 mana. If Mana Vault remains tapped during upkeep it does 1 damage to you. Tapping this artifact can be played as an interrupt.",
  "Hypnotic Specter": 'Flying An opponent damaged by Specter must discard a card at random from his or her hand. Ignore this effect if opponent has no cards left in hand. "...There was no trace/ Of aught on that illumined face..." —Samuel Coleridge, "Phantom"'
}, pn = (t) => t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
function Ms(t, e) {
  if (t.wordingMode === "oracle" || !["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? ""))
    return !1;
  const r = _h[t.name];
  return !!(r && pn(e.flatMap((n) => n.runs.map((o) => o.text)).join(" ")) === pn(r));
}
const Ts = (t) => t.wordingMode !== "oracle" && ["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? ""), _l = (t) => t.reduce((e, r) => e + r.runs.reduce((n, o) => n + o.text.length, 0), 0);
function Uh(t, e) {
  return Ts(t) && t.name === "Word of Command" && pn(e.flatMap((r) => r.runs.map((n) => n.text)).join(" ")) === Dh ? 7 : 0;
}
const Dh = "You may look at opponent's hand and choose any card opponent can legally play using mana from his or her mana pool or lands. Opponent must play this card immediately; you make all the decisions it calls for. This spell may not be countered after you have looked at opponent's hand.";
function Ul(t, e, r = _l(e)) {
  return Ts(t) && r <= 117 && e.length === 2 && e.every((n) => n.role === "rules" && (n.align === void 0 || n.align === "left")) && e[0].runs.map((n) => n.text).join("").length <= 15;
}
function Nh(t) {
  if (!Ts(t) || t.frameTemplate || t.frameStyle === "modern" || t.layout && !["normal", "token"].includes(t.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const e = ee({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), r = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? e : e, n = _l(r);
  return n > 274 || Ms(t, r) || Dl(t, r).centeredDy === 0 || Ul(t, e, n) ? "abu-original-flow-v1" : void 0;
}
const Pa = {
  type: { fontSize: 22.2, dx: -2, dy: -1 },
  artistBaseline: 630.25,
  statsDx: 1,
  headingInk: "#828282"
};
function He(t) {
  const e = t?.toLowerCase();
  return e === "lea" ? { ...Pa, artistInk: "#737373", statsInk: "#787878" } : e === "leb" ? { ...Pa, artistInk: "#828282", statsInk: "#737373" } : void 0;
}
function Dl(t, e) {
  const r = t.setCode?.toLowerCase();
  if (t.wordingMode === "oracle" || !["lea", "leb"].includes(r ?? "")) return {};
  const n = pn(e.flatMap((o) => o.runs.map((s) => s.text)).join(" "));
  return t.name === "Lifetap" && n === "You gain 1 life each time any forest of opponent's becomes tapped." || t.name === "Gauntlet of Might" && n === "All red creatures gain +1/+1 and all mountains provide an extra red mana when tapped." ? { centeredWidth: 390, centeredDx: -6.5 } : t.name === "Howl from Beyond" && n === "Target creature gains +X/+0 until end of turn." ? { centeredDx: -6.5, centeredDy: 0 } : r === "lea" && t.name === "Twiddle" && n === "Caster may tap or untap any one land, creature, or artifact in play." ? { centeredDx: -6.5, centeredDy: -16 } : t.name === "Black Vise" && n === "If opponent has more than four cards in hand during upkeep, black vise does 1 damage to opponent for each card in excess of four." ? { shortRegularDy: -16 } : r === "leb" && t.name === "Birds of Paradise" && n === "Flying Tap to add one mana of any color to your mana pool. This tap may be played as an interrupt." ? { centeredWidth: 374, regularDx: 10, regularDy: 12 } : {};
}
const Nl = "CardRenderer MTG Beleren 2016";
let ao;
function xs(t) {
  return ot(t)?.headingFont === "beleren-2016" ? Nl : void 0;
}
function Go(t, e) {
  return e === Nl ? t.replace(/n(?=[gjpy\u00fd\u00fe\u00ff\u1ef3J\s]|$)/gu, "") : t;
}
const jh = { dx: 0, dy: 0, size: 1, width: 1 };
function jl(t, e, r) {
  const n = ot(e)?.typeText?.[r];
  return n ? (t.textRendering = "geometricPrecision", t.fontKerning = "normal", n) : jh;
}
function zh(t) {
  const e = xs(t);
  return e ? (ao ??= it().load(`bold 12px "${e}"`).then((r) => {
    if (!r.length || r.some((n) => n.status !== "loaded"))
      throw Error("Modern heading font is unavailable. Load card-glint/magic/fonts.css.");
  }).catch((r) => {
    throw ao = void 0, r;
  }), ao) : Promise.resolve();
}
const io = /* @__PURE__ */ new Map();
function Yh(t) {
  const e = ot(t)?.footer.collectorFamily;
  if (!e) return Promise.resolve();
  let r = io.get(e);
  return r || (r = it().load(`12px "${e}"`).then((n) => {
    if (!n.length || n.some((o) => o.status !== "loaded"))
      throw Error("Modern footer font is unavailable. Load card-glint/magic/fonts.css.");
  }).catch((n) => {
    throw io.delete(e), n;
  }), io.set(e, r)), r;
}
const zl = /* @__PURE__ */ new WeakMap(), Sr = /* @__PURE__ */ new WeakMap(), Yl = /* @__PURE__ */ Symbol("prepared-rules-request");
function qh(t, e, r) {
  zl.set(e, r), Sr.has(t) && Object.defineProperty(e, Yl, {
    value: { request: r, x: e.x, top: e.top },
    enumerable: !0
  });
}
function ae(t) {
  const e = zl.get(t);
  if (e) return e;
  const r = t[Yl];
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
function Ga(t, e) {
  const r = Sr.get(t) ?? 0;
  Sr.set(t, r + 1);
  try {
    return e();
  } finally {
    r ? Sr.set(t, r) : Sr.delete(t);
  }
}
const Fo = (t, e = !1) => `${e ? "italic " : ""}${t}px "CardRenderer MTG MPlantin", Georgia`;
function Hh(t) {
  const e = [];
  let r = [], n = !1;
  const o = () => {
    r.length && (e.push({ pieces: r, space: n }), r = [], n = !1);
  };
  for (const s of t)
    for (const a of Pn(s.text))
      if (a.symbol) r.push({ text: a.symbol, symbol: !0, italic: !1 });
      else
        for (const i of a.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(i) ? (o(), i === `
` ? (e.push({ pieces: [], space: !1, newline: !0 }), n = !1) : n = !0) : r.push({ text: i, symbol: !1, italic: !!s.italic });
  return o(), e;
}
function Ae(t, e, r, n = 1) {
  const o = [];
  for (const s of e) {
    const a = s.symbol ? s : { ...s, text: s.text.replaceAll("­", "") };
    if (!a.text) continue;
    const i = o.at(-1);
    i && !i.symbol && !a.symbol && i.italic === a.italic ? i.text += a.text : o.push({ ...a });
  }
  return o.map((s) => {
    t.font = Fo(r, s.italic);
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
function Xh(t, e, r, n, o, s = 1) {
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
        m.some((c) => c.text.replaceAll("­", "").length) && Ae(t, [...e, ...h], o, s).reduce((c, g) => c + g.width, 0) <= n && (a = { head: h, tail: m });
      }
  }
  return a;
}
function ql(t, e, r, n, o = 1) {
  const s = [];
  let a = [];
  for (const i of e) {
    if (i.newline) {
      s.push(Ae(t, a, n, o)), a = [];
      continue;
    }
    let l = i.pieces, d = a.length && i.space ? [{ text: " ", italic: i.pieces[0]?.italic ?? !1, symbol: !1 }] : [];
    for (; ; ) {
      if (Ae(t, [...a, ...d, ...l], n, o).reduce((m, c) => m + c.width, 0) <= r) {
        a.push(...d, ...l);
        break;
      }
      const h = Xh(
        t,
        [...a, ...d],
        l,
        r,
        n,
        o
      );
      if (h)
        s.push(Ae(t, [...a, ...d, ...h.head], n, o)), a = [], d = [], l = h.tail;
      else if (a.length)
        s.push(Ae(t, a, n, o)), a = [], d = [];
      else {
        a.push(...l);
        break;
      }
    }
  }
  return a.length && s.push(Ae(t, a, n, o)), s;
}
function Fa(t, e, r, n, o = 1) {
  const s = ql(t, e, r, n, o);
  if (s.length < 2) return s;
  const a = /* @__PURE__ */ new Map(), i = (m, c) => {
    const g = `${m}:${c}`;
    let f = a.get(g);
    if (!f) {
      const p = [];
      for (let w = m; w < c; w++) {
        const y = e[w];
        w > m && y.space && p.push({ text: " ", italic: y.pieces[0]?.italic ?? !1, symbol: !1 }), p.push(...y.pieces);
      }
      f = Ae(t, p, n, o), a.set(g, f);
    }
    return f;
  }, l = /* @__PURE__ */ new Map(), d = (m, c) => {
    if (!c) return m === e.length ? { cost: 0, cuts: [] } : null;
    const g = `${m}:${c}`;
    if (l.has(g)) return l.get(g);
    let f = null;
    for (let p = m + 1; p <= e.length - c + 1; p++) {
      const w = i(m, p).reduce((v, S) => v + S.width, 0);
      if (w > r) break;
      const y = d(p, c - 1);
      if (!y) continue;
      const b = y.cost + (r - w) ** 2;
      (!f || b < f.cost) && (f = { cost: b, cuts: [p, ...y.cuts] });
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
function Wa(t, e, r, n, o = !1, s = 1) {
  const a = Hh(e);
  if (!o || a.length > 64 || e.some((d) => d.text.includes("­")))
    return ql(t, a, r, n, s);
  const i = [];
  let l = [];
  for (const d of a)
    d.newline ? (i.push(
      ...l.length ? Fa(t, l, r, n, s) : [[]]
    ), l = []) : l.push(d);
  return l.length && i.push(...Fa(t, l, r, n, s)), i;
}
const Jh = new Set(
  "mir vis 5ed wth tmp sth exo usg ulg 6ed uds mmq nem pcy inv pls 7ed apc ody tor jud ons lgn scg por p02 ptk".split(
    " "
  )
);
function Kh(t) {
  return Jh.has(t?.toLowerCase() ?? "");
}
function Vh(t) {
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
const Ir = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function P(t, e, r, n = 24, o = 15, s = Ir) {
  const a = s.textWidth ?? 1;
  if (!Number.isFinite(a) || a <= 0)
    throw Error("Magic rules text width must be finite and positive.");
  if (s.maximumLines !== void 0 && (!Number.isInteger(s.maximumLines) || s.maximumLines <= 0))
    throw Error("Magic rules line limit must be a positive integer.");
  if (!Number.isFinite(s.symbolOffsetY ?? 0) || Math.abs(s.symbolOffsetY ?? 0) > 0.5)
    throw Error("Magic inline symbol offset must be finite and within half a diameter.");
  const i = s.flavorOrphanMinCharacters ?? 0;
  if (!Number.isInteger(i) || i < 0)
    throw Error("Magic flavor orphan threshold must be a nonnegative integer.");
  t.save(), s.fractionalMetrics && (t.textRendering = "geometricPrecision", t.fontKerning = "normal"), t.letterSpacing = "0px", t.textBaseline = "alphabetic", t.textAlign = "left";
  try {
    const l = s.flavorAttribution === "right" ? e.flatMap(Vh) : e;
    let d, u = n;
    do {
      const h = [], m = [];
      let c = 0, g;
      for (const M of l) {
        let C = u, T = Wa(
          t,
          M.runs,
          r.width,
          C,
          s.balanceLines && (!s.balanceCenteredOnly || M.align === "center"),
          a
        );
        if (M.role === "flavor" && s.flavorOrphans !== !1 && M.runs.reduce(
          (R, A) => R + A.text.replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
          0
        ) >= i && T.length > 2 && T.at(-1).reduce((R, A) => R + A.width, 0) < r.width * 0.3)
          for (let R = C - 0.25; R >= C * 0.94; R -= 0.25) {
            const A = Wa(
              t,
              M.runs,
              r.width,
              R,
              s.balanceLines && (!s.balanceCenteredOnly || M.align === "center"),
              a
            );
            if (A.length < T.length) {
              C = R, T = A;
              break;
            }
          }
        if (T.length) {
          g && (g === "rules" && M.role === "flavor" ? c += u * s.flavorGap : (g !== "flavor" || M.role !== "flavor") && (c += u * s.paragraphGap));
          for (const R of T) {
            const A = Math.max(0, ...R.map((K) => K.ascent)), L = Math.max(0, ...R.map((K) => K.descent)), O = R.reduce((K, dt) => K + dt.width, 0), B = r.x + (M.align === "right" ? r.width - O : M.align === "center" ? (r.width - O) / 2 : 0);
            let U = 0, E = 1 / 0, q = -1 / 0;
            for (const K of R)
              E = Math.min(E, U + K.inkLeft), q = Math.max(q, U + K.inkRight), U += K.width;
            h.push({
              x: B,
              runs: R,
              role: M.role,
              baseline: c,
              width: O,
              inkBounds: [
                B + (R.length ? E : 0),
                c - A,
                R.length ? q - E : 0,
                A + L
              ]
            }), c += C * s.leading;
          }
          g = M.role;
        }
      }
      if (s.flavorSeparator !== !1)
        for (let M = 1; M < h.length; M++) {
          const C = h[M - 1], T = h[M];
          if (C.role !== "rules" || T.role !== "flavor") continue;
          const R = C.inkBounds[1] + C.inkBounds[3];
          m.push((R + T.inkBounds[1]) / 2 - 0.3);
        }
      const f = h[0]?.inkBounds[1] ?? 0, p = h.at(-1)?.inkBounds, w = p ? p[1] + p[3] - f : 0, y = Math.max(0, r.height - w), b = r.y + Math.max(0, Math.min(y, y / 2 + (s.centerOffset ?? 0))), v = Math.max(r.y, r.verticalLimits?.[0] ?? r.y), S = Math.min(
        r.y + r.height,
        r.verticalLimits?.[1] ?? r.y + r.height
      ), k = Math.max(v, Math.min(S - w, b)) - f;
      if (d = {
        ...s.fractionalMetrics ? { fractionalMetrics: !0 } : {},
        ...s.symbolOffsetY === void 0 ? {} : { symbolOffsetY: s.symbolOffsetY },
        size: u,
        x: r.x,
        top: f + k,
        width: r.width,
        height: w,
        overflow: s.maximumLines !== void 0 && h.length > s.maximumLines || w > S - v + 0.01 || h.some((M) => M.width > r.width + 0.01),
        lines: h.map((M) => ({
          ...M,
          baseline: M.baseline + k,
          inkBounds: [
            M.inkBounds[0],
            M.inkBounds[1] + k,
            M.inkBounds[2],
            M.inkBounds[3]
          ]
        })),
        separators: m.map((M) => M + k)
      }, d.overflow ||= d.lines.some(
        (M) => r.exclusions?.some(([C, T, R, A]) => {
          const [L, O, B, U] = M.inkBounds;
          return L < C + R && L + B > C && O < T + A && O + U > T;
        })
      ), !d.overflow || u <= o) break;
      u = Math.max(o, u - 0.25);
    } while (!0);
    return qh(t, d, {
      paragraphs: e,
      bounds: r,
      maximumSize: n,
      minimumSize: o,
      typography: s
    }), d;
  } finally {
    t.restore();
  }
}
const en = {
  centered: { left: 10.5, right: -2.5, y: -5, size: 0.5, width: 0.975, leading: -0.5 },
  regular: { left: 10.5, right: -1, y: -2, size: 0, width: 1.005, leading: -0.5 },
  long: { left: 10.5, right: -2, y: 9.5, size: 0, width: 0.99, leading: -0.25 }
};
function Wo(t, e, r, n = 0) {
  return ["lea", "leb"].includes(e.setCode?.toLowerCase() ?? "") ? Rs(t, e, r, n) : r;
}
function Rs(t, e, r, n = 0) {
  if (!r) return r;
  const o = ae(r);
  if (!o || !o.paragraphs.length) return r;
  const s = o.paragraphs, a = s.every((p) => p.align === "center"), i = a ? r.lines.length >= 5 && r.size >= 30 ? en.long : en.centered : s.some((p) => p.align === "center") || r.size < 19 ? null : en.regular;
  if (!i)
    return e.wordingMode === "oracle" ? _a(t, r) : r;
  const l = r.size + i.size, d = P(
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
    lines: d.lines.map((p) => ({
      ...p,
      x: (p.x ?? d.x) + u,
      baseline: p.baseline + h,
      inkBounds: [p.inkBounds[0] + u, p.inkBounds[1] + h, p.inkBounds[2], p.inkBounds[3]]
    })),
    separators: d.separators.map((p) => p + h)
  }, c = e.wordingMode === "oracle" ? 428 : Math.min(412, r.top - 1), g = e.wordingMode === "oracle" ? 590 : 600;
  return d.overflow || m.lines.some(
    ({ inkBounds: [p, w, y, b] }) => w < c || w + b > g || p * i.width < 48 || (p + y) * i.width > 448
  ) ? e.wordingMode === "oracle" ? _a(t, r) : r : m;
}
function _a(t, e) {
  const r = ae(e);
  if (!r) throw Error("Missing Oracle typography request");
  const n = en.regular;
  return { ...P(
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
const Zh = "abu-original-fractional-tiers-v3";
function Qh(t, e, r, n = !1) {
  return !["lea", "leb"].includes(e.setCode?.toLowerCase() ?? "") || !r ? r : e.wordingMode === "oracle" ? Wo(t, e, r) : Hl(t, e, r, {}, n);
}
function Hl(t, e, r, n = {}, o = !1) {
  if (!ae(r)) throw Error("Missing native typography request");
  const a = ee({
    rulesText: e.rulesText ?? "",
    rulesParagraphs: e.rulesParagraphs
  }), i = e.rulesAlignment?.mode === "left" ? a.map((b) => b.role === "rules" ? { ...b, align: "left" } : b) : a, l = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? i : i;
  n = { ...Dl(e, l), ...n };
  const d = l.reduce(
    (b, v) => b + v.runs.reduce((S, k) => S + k.text.length, 0),
    0
  ), [, u, , h] = At(Wn(e).rules), m = {
    leading: 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1
  }, c = n.forceSmall ?? Ms(e, l);
  if (!c && Ul(e, i, d)) {
    const b = P(
      t,
      i.map((v) => ({ ...v, align: "left" })),
      { x: 80, y: u + 6, width: n.largeFitWidth ?? 374, height: h - 8 },
      32.5,
      32.5,
      { ...m, leading: 1.1, balanceLines: !0, centerOffset: 0 }
    );
    if (!b.overflow && b.lines.length <= 5) return b;
  }
  let g;
  if (!c && d <= (n.largeMaximum ?? 117) && e.rulesAlignment?.mode !== "left") {
    const b = i.map((S) => ({ ...S, align: S.align ?? "center" })), v = P(
      t,
      b,
      {
        x: 70,
        y: u - 6,
        width: n.largeFitWidth ?? n.centeredWidth ?? 340,
        height: h - 8
      },
      32.5,
      32.5,
      { ...m, leading: 1.1, balanceLines: !0, centerOffset: 0 }
    );
    if (!v.overflow && v.lines.length <= 5)
      if (r.size >= 30) g = r;
      else {
        const S = P(
          t,
          b,
          { x: 70, y: u - 6, width: n.centeredWidth ?? 348, height: h - 8 },
          32.5,
          32.5,
          { ...m, leading: 1.1, balanceLines: !0, centerOffset: 0 }
        );
        !S.overflow && S.lines.length <= 5 && (g = S);
      }
  }
  if (g || (c || d > (n.mediumMaximum ?? 274) ? g = r.size < 19 ? r : P(
    t,
    i,
    { x: 70, y: u + 4, width: 346, height: h + 8 },
    15.5,
    15.5,
    { ...m, leading: 1.25, centerOffset: -18 }
  ) : g = r.size >= 19 && r.size < 30 ? r : P(
    t,
    i,
    { x: 70, y: u + 4, width: 346, height: h - 8 },
    n.mediumSize ?? 22.5,
    19,
    { ...m, centerOffset: -10 }
  )), g.overflow && (g = r), o && g.size < 30) {
    const b = ae(g);
    if (!b) throw Error("Missing selected early metrics request");
    const v = P(t, b.paragraphs, b.bounds, g.size, g.size, {
      ...b.typography,
      fractionalMetrics: !0
    });
    v.overflow || (g = v.lines.length === g.lines.length && v.lines.length ? tm(v, g.lines[0].baseline - v.lines[0].baseline) : v);
  }
  if (g.size >= 19) {
    const b = ae(g);
    if (!b) throw Error("Missing selected typography request");
    const v = b.paragraphs.every((B) => B.align === "center"), S = v && g.size >= 30 ? n.centeredWidth : void 0, k = !v && g.size < 30 ? n.mediumSizeDelta : void 0;
    if (S !== void 0 || k) {
      const B = g.size + (k ?? 0), U = P(
        t,
        b.paragraphs,
        {
          ...b.bounds,
          ...S !== void 0 ? { x: (488 - S) / 2, width: S } : {}
        },
        B,
        B,
        b.typography
      );
      U.overflow || (g = U);
    }
    const M = n.regularWidthDelta ?? (d < 180 || e.setCode?.toLowerCase() === "leb" ? 8 : 0);
    let C = n.transferAlphaModel ? Rs(t, e, g, M) ?? g : Wo(t, e, g, M) ?? g;
    if (e.setCode?.toLowerCase() === "lea" && e.wordingMode !== "oracle" && !o && n.regularWidthDelta === void 0 && M === 0 && !v && b.paragraphs.every((B) => B.role === "rules") && C.lines.length > g.lines.length) {
      const B = Wo(t, e, g, 8);
      B && B !== g && B.lines.length < C.lines.length && (C = B);
    }
    const T = v ? n.centeredDx ?? 0 : n.regularDx ?? 0, R = v ? n.centeredDy ?? 0 : n.regularDy !== void 0 ? n.regularDy : g.lines.length <= 5 ? n.shortRegularDy ?? 0 : 0;
    if (!T && !R) return C;
    const A = {
      ...C,
      x: C.x + T / (C.horizontalScale ?? 1),
      top: C.top + R,
      lines: C.lines.map((B) => ({
        ...B,
        x: (B.x ?? C.x) + T / (C.horizontalScale ?? 1),
        baseline: B.baseline + R,
        inkBounds: [
          B.inkBounds[0] + T / (C.horizontalScale ?? 1),
          B.inkBounds[1] + R,
          B.inkBounds[2],
          B.inkBounds[3]
        ]
      }))
    }, L = e.wordingMode === "oracle" ? 428 : 405, O = e.wordingMode === "oracle" ? 590 : 602;
    return A.lines.some(
      (B) => B.inkBounds[1] < L || B.inkBounds[1] + B.inkBounds[3] > O
    ) ? C : A;
  }
  const f = ae(g);
  if (!f) throw Error("Missing selected early typography request");
  const p = P(
    t,
    f.paragraphs,
    { ...f.bounds, x: f.bounds.x + 10.5, width: f.bounds.width - 10.5 },
    g.size,
    g.size,
    { ...f.typography, textWidth: n.denseWidth ?? (o ? 1 : 0.98) }
  );
  if (p.overflow) return g;
  const y = Math.max(f.bounds.y, g.top + (g.height - p.height) / 2 - 5) - p.top;
  return {
    ...p,
    top: p.top + y,
    lines: p.lines.map((b) => ({
      ...b,
      baseline: b.baseline + y,
      inkBounds: [b.inkBounds[0], b.inkBounds[1] + y, b.inkBounds[2], b.inkBounds[3]]
    }))
  };
}
function Ua(t, e, r = 1, n) {
  if (n && (!Number.isFinite(n.textWidth) || n.textWidth <= 0 || !Number.isFinite(n.right) || n.right <= e.x || n.right > 488))
    throw RangeError("Invalid printing text geometry");
  if (e.size >= 30 || !e.lines.length) return e;
  const o = ae(e);
  if (!o) throw Error("Missing final early text request");
  const s = P(
    t,
    o.paragraphs,
    n ? {
      ...o.bounds,
      width: Math.min(
        n.right - o.bounds.x,
        o.bounds.width * n.textWidth
      )
    } : o.bounds,
    e.size,
    Math.max(10, e.size - 0.5),
    {
      ...o.typography,
      ...n ? { textWidth: n.textWidth } : e.size < 19 ? { textWidth: r } : {},
      fractionalMetrics: !0,
      maximumLines: e.lines.length
    }
  );
  if (s.overflow) return e;
  const a = e.lines[0].baseline - s.lines[0].baseline, i = {
    ...s,
    ...e.horizontalScale === void 0 ? {} : { horizontalScale: e.horizontalScale },
    top: s.top + a,
    lines: s.lines.map((l) => ({
      ...l,
      baseline: l.baseline + a,
      inkBounds: [l.inkBounds[0], l.inkBounds[1] + a, l.inkBounds[2], l.inkBounds[3]]
    })),
    separators: s.separators.map((l) => l + a)
  };
  return i.lines.some(
    ({ inkBounds: [l, d, u, h] }) => d < 399 || d + h > 604 || l * (i.horizontalScale ?? 1) < 48 || (l + u) * (i.horizontalScale ?? 1) > 449
  ) ? e : i;
}
function tm(t, e) {
  return e ? {
    ...t,
    top: t.top + e,
    lines: t.lines.map((r) => ({
      ...r,
      baseline: r.baseline + e,
      inkBounds: [r.inkBounds[0], r.inkBounds[1] + e, r.inkBounds[2], r.inkBounds[3]]
    })),
    separators: t.separators.map((r) => r + e)
  } : t;
}
const Cr = /* @__PURE__ */ new WeakMap();
function em(t, e, r, n) {
  return Cr.get(t)?.(e, r, n) ?? !1;
}
function rm(t, e, r) {
  const n = e.printingOmissions;
  if (!n?.length) return r();
  const o = t.fillText, s = t.strokeText, a = (l, d, u) => {
    const h = t.getTransform().transformPoint({ x: d, y: u }), m = h.x * 488 / t.canvas.width, c = h.y * 680 / t.canvas.height;
    return n.some(({ rect: g, rotation: f = 0, texts: p }) => {
      if (!p.includes(String(l))) return !1;
      const w = f * Math.PI / 180, y = m - g[0] * 488, b = c - g[1] * 680, v = y * Math.cos(w) + b * Math.sin(w), S = -y * Math.sin(w) + b * Math.cos(w);
      return v >= -8 && v <= g[2] * 488 + 8 && S >= -8 && S <= g[3] * 680 + 25;
    });
  }, i = Cr.get(t);
  Cr.set(t, (l, d, u) => a(l, d, u) || (i?.(l, d, u) ?? !1)), t.fillText = function(l, d, u, h) {
    a(l, d, u) || o.call(this, l, d, u, ...h === void 0 ? [] : [h]);
  }, t.strokeText = function(l, d, u, h) {
    a(l, d, u) || s.call(this, l, d, u, ...h === void 0 ? [] : [h]);
  };
  try {
    r();
  } finally {
    i ? Cr.set(t, i) : Cr.delete(t), t.fillText = o, t.strokeText = s;
  }
}
function nm(t, e, r, n, o) {
  const [s, a, i] = r;
  if (em(t, e, s, a)) return;
  const l = t.getTransform(), d = Math.hypot(l.a, l.b), u = (Math.floor((s - 4) * d + l.e) - l.e) / d, h = (Math.floor((a - n) * d + l.f) - l.f) / d, m = $();
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
function Ls(t, e, r, n, o, s = "#efe7cb", a, i = "#0d0f0f") {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = s, t.beginPath(), t.arc(e + n / 2, r + n / 2, n / 2, 0, Math.PI * 2), t.fill(), t.clip(), t.fillStyle = i, t.font = '100px "CardRenderer MTG Historic Symbols"', t.textAlign = "left", t.textBaseline = "alphabetic";
  const l = "", d = t.measureText(l), u = d.actualBoundingBoxLeft + d.actualBoundingBoxRight, h = d.actualBoundingBoxAscent + d.actualBoundingBoxDescent, m = o * (a?.scale ?? 1) / Math.max(u, h);
  t.translate(e + n / 2 + (a?.dx ?? 0), r + n / 2 + (a?.dy ?? 0)), t.scale(m, m), t.fillText(
    l,
    (d.actualBoundingBoxLeft - d.actualBoundingBoxRight) / 2,
    (d.actualBoundingBoxAscent - d.actualBoundingBoxDescent) / 2
  ), t.restore();
}
const o2 = "symbols-v3";
function Es(t) {
  if (t.symbolAdjustment) {
    if (t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
      throw Error("Symbol adjustment currently supports ordinary faces only.");
    for (const [e, r] of Object.entries(t.symbolAdjustment)) {
      if (e !== "mana" && e !== "set") throw Error("Unknown symbol adjustment group.");
      if (!r || typeof r != "object") throw Error("Invalid symbol adjustment.");
      for (const [n, o] of Object.entries(r)) {
        if (e === "mana" && n === "glyphs") {
          om(o);
          continue;
        }
        const s = n === "dx" || n === "dy", a = e === "mana" && (n === "numberDx" || n === "numberDy"), i = e === "mana" && n === "spacing", l = n === "scaleX" || n === "scaleY" || e === "mana" && n === "numberScale", d = i || a ? 4 : 8;
        if (!s && !a && !i && !l || typeof o != "number" || !Number.isFinite(o) || o < (l ? 0.75 : -d) || o > (l ? 1.25 : d))
          throw Error("Symbol adjustment exceeds supported bounds.");
      }
    }
  }
}
function om(t) {
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
function Or(t, e) {
  return /^[WUBRG]$/.test(e) ? t?.glyphs?.[e] : void 0;
}
function ke(t, e) {
  const { dx: r = 0, dy: n = 0, scaleX: o = 1, scaleY: s = 1 } = e ?? {};
  if (!r && !n && o === 1 && s === 1) return t;
  const [a, i, l, d] = t;
  return [a + l + r - l * o, i + d / 2 + n - d * s / 2, l * o, d * s];
}
function rr(t, e, r, n) {
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
function sm(t, e, r) {
  const n = Math.max(0, e - 1) * (r?.spacing ?? 0);
  return n ? [t[0] - n, t[1], t[2] + n, t[3]] : t;
}
function Oe(t) {
  if (!/^#[a-f0-9]{6}$/i.test(t)) throw Error("Invalid mana palette color");
  return [
    parseInt(t.slice(1, 3), 16) / 255,
    parseInt(t.slice(3, 5), 16) / 255,
    parseInt(t.slice(5, 7), 16) / 255
  ];
}
const am = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, im = "#9aa4ae", lo = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
function As(t, e, r, n) {
  const o = [];
  for (const s of e.split(`
`)) {
    let a = [], i = 0;
    const l = Pn(s).flatMap(
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
function mt(t, e, r, n, o, s, a = !1, i) {
  if (e === "W" && s.originalWhiteGlyph) {
    Ls(
      t,
      r,
      n,
      o,
      o * 0.87,
      s.manaColors?.W,
      Or(i, e),
      s.manaInkColor
    );
    return;
  }
  const l = /^\d+$/.test(e);
  if (l && i && s.manaCostNumeral) {
    ch(t, e, r, n, o, s.manaCostNumeral, i);
    return;
  }
  const d = Or(i, e), u = s.manaGlyphScales?.[e] ?? 1, h = l ? i ? s.manaNumerals?.get(e) : void 0 : u !== 1 || d ? s.manaGlyphs?.get(e) : void 0, m = s.get(tr(e) ?? "");
  if (t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, a) {
    const c = t.getTransform();
    t.shadowColor = "#000d";
    const [g, f] = s.manaCostShadow ?? [-1.5372, 1.5372];
    t.shadowOffsetX = g * c.a + f * c.c, t.shadowOffsetY = g * c.b + f * c.d;
  }
  if (t.fillStyle = s.manaColors?.[e] ?? am[e] ?? im, t.beginPath(), t.arc(r + o / 2, n + o / 2, o / 2, 0, Math.PI * 2), t.fill(), t.shadowColor = "transparent", h && t.drawImage(h.image, 0, 0, h.width, h.height, r, n, o, o), h) {
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
function Xl(t, e, r, n, o, s, a) {
  if (!fe(t)) return;
  const i = typeof s == "number" ? s : s.size;
  t.font = `${typeof s != "number" && s.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
  const l = e.split(`
`).map((d) => As(t, d, o, i));
  t.textBaseline = "top";
  for (const d of l) {
    for (const u of d) {
      let h = r;
      for (const m of u)
        m.symbol ? mt(t, m.text, h + i * 0.07, n + i * 0.03, i * 0.8, a) : t.fillText(m.text, h, n), h += m.width;
      n += i;
    }
    n += j.paragraphGap;
  }
}
function ct(t, e, r, n, o, s, a = !1, i = 1, l = "CardRenderer MTG Beleren", d = 0, u, h = "type") {
  if (!(o > 0)) throw Error("Magic title/type plate has no text space.");
  e = Go(e, l), t.save(), l === "CardRenderer MTG Matrix" && (t.textBaseline = "alphabetic"), t.font = `${a ? "bold " : ""}${s}px "${l}", Georgia`;
  const m = t.measureText(e).width;
  i > 1 && m * i > o && (i = 1), i !== 1 && (t.translate(r, 0), t.scale(i, 1), r = 0, o /= i), m > o && (s = Math.max(s * 0.78, s * o / m), t.font = `${a ? "bold " : ""}${s}px "${l}", Georgia`), bt(
    t,
    e,
    r,
    n,
    o,
    u,
    h,
    d > 0 ? () => nm(t, e, [r, n, o], s, d) : void 0
  ), t.restore();
}
function ye(t, e, r, n, o, s, a, i, l = [0, 0, 1, 1]) {
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
  const h = $();
  h.width = Math.max(1, Math.ceil(a * 2)), h.height = Math.max(1, Math.ceil(i * 2));
  const m = h.getContext("2d");
  m.drawImage(e, ...d, 0, 0, h.width, h.height), m.globalCompositeOperation = "source-in", m.fillStyle = u, m.fillRect(0, 0, h.width, h.height), t.drawImage(h, o, s, a, i), h.width = h.height = 0;
}
function lm(t, e, r, n = !1, o) {
  Jl(
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
function dm(t, e, r, n = !1, o) {
  Jl(
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
function Jl(t, e, r, n, o, s) {
  e.forEach((a, i) => {
    const { size: l } = n, d = n.right - (e.length - 1 - i) * (n.pitch + (s?.spacing ?? 0)) - l / 2, u = n.centerY - l / 2;
    if (a !== "W" || o || r.originalManaGlyphs?.has("W")) {
      mt(t, a, d, u, l, r, !1, s);
      return;
    }
    Ls(
      t,
      d,
      u,
      l,
      n.whiteSize,
      r.manaColors?.W,
      Or(s, a),
      r.manaInkColor
    );
  });
}
const Kl = (t, e, r, n, o, s, a = !1, i) => {
  if (e !== "W" || s.originalManaGlyphs?.has("W"))
    return mt(t, e, r, n, o, s, a, i);
  Ls(
    t,
    r,
    n,
    o,
    o * 0.87,
    s.manaColors?.W,
    Or(i, e),
    s.manaInkColor
  );
};
function um(t) {
  return ["4ed", "5ed"].includes(t.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(t.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function _o(t) {
  const e = String(t.toughness ?? ""), r = t.wordingMode !== "oracle" && t.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(e) ? `(${e})` : e;
  return `${t.power ?? ""}/${r}`;
}
function hm(t) {
  const e = t.setCode?.toLowerCase(), r = $n(t), n = (e === "4ed" || r) && !G(t).land;
  if (e !== "mir" && e !== "tmp" && !n) return null;
  const o = F(t);
  return {
    titleX: n ? 42.5 : void 0,
    titleYOffset: n ? -5 : 0,
    typeX: n ? 42.5 : void 0,
    manaRight: n ? 446.5 : 448,
    manaTop: n ? 27.5 : 33.5,
    manaSize: 23.4,
    manaGap: n ? 3.6 : 1.7,
    statsShadow: n ? 1 : 1.5,
    statsOpaqueShadow: !n,
    setRight: r ? void 0 : e === "mir" ? 434 : 432.5,
    setCenterY: r ? void 0 : e === "mir" ? 388 : 387.5,
    setHeight: r ? void 0 : e === "mir" ? 26 : 23.4,
    setOutline: r ? void 0 : 1.25,
    artistX: n ? 42.5 : 52,
    artistBaseline: n ? 628.5 : 624,
    artistSize: 19.5,
    legalBaseline: n ? 640.5 : 637.5,
    legalSize: 10.5,
    legalLight: n ? /\bArtifact\b/.test(t.typeLine ?? "") || o.length === 1 && ["B", "G"].includes(o[0]) : !/\bLand\b/.test(t.typeLine ?? "") && !(o.length === 1 && ["W", "R"].includes(o[0])),
    legalText: t.legalText === void 0 ? n ? "©1995 Wizards of the Coast, Inc. All rights reserved." : e === "mir" ? "©1996 Wizards of the Coast, Inc. All rights reserved." : "©1997 Wizards of the Coast, Inc." : t.legalText
  };
}
function Da(t) {
  return t.setCode?.toLowerCase() === "4ed" && /\bLand\b/.test(t.typeLine ?? "") && !G(t).land ? "fourth-semantic-details-v1" : void 0;
}
const Bs = (t, e, r, n, o, s) => {
  if (e !== "T") return mt(t, e, r, n, o, s);
  Vl(t, r, n, o, "", 0.88);
}, Uo = (t, e, r, n, o, s) => {
  if (e !== "T") return Kl(t, e, r, n, o, s);
  Vl(t, r, n, o, "", 0.8);
}, mm = (t, e, r, n, o, s) => {
  if (e !== "T") return mt(t, e, r, n, o, s);
  Bs(t, e, r, n, o, s);
}, cm = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function gm(t) {
  const e = t?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(e) || ["lea", "leb", "2ed", "arn", "atq"].includes(e) ? Uo : e === "4ed" ? mm : cm.has(e) ? Bs : mt;
}
function Vl(t, e, r, n, o, s) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = "#c9c4be", t.beginPath(), t.arc(e + n / 2, r + n / 2, n / 2, 0, Math.PI * 2), t.fill(), t.fillStyle = "#0d0f0f", t.font = `${n * s}px "CardRenderer MTG Historic Symbols"`, t.textAlign = "left", t.textBaseline = "alphabetic";
  const a = t.measureText(o);
  t.fillText(
    o,
    e + (n - a.actualBoundingBoxLeft - a.actualBoundingBoxRight) / 2 + a.actualBoundingBoxLeft,
    r + (n + a.actualBoundingBoxAscent - a.actualBoundingBoxDescent) / 2
  ), t.restore();
}
function fm(t, e, r, n, o, s, a, i = [0, 0, 1, 1], l = null, d = "low") {
  const u = $(), h = Math.ceil(a * 2) + 1;
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
function pm(t, e, r) {
  t.save(), t.textAlign = "left", t.textBaseline = "alphabetic", Z(t, e, "artist", () => {
    e.artist && (t.fillStyle = "#f2eee3", t.shadowColor = "#000", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, t.font = `${r.artistSize}px "CardRenderer MTG MPlantin", Georgia`, t.fillText(`Illus. ${e.artist}`, r.artistX, r.artistBaseline, 338));
  }), t.shadowColor = "transparent", t.fillStyle = r.legalLight ? "#f2eee3" : "#17140f", t.font = `${r.legalSize}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && Z(
    t,
    e,
    "legal",
    () => t.fillText(r.legalText, r.artistX, r.legalBaseline, 380)
  ), t.restore();
}
function ym(t, e, r) {
  const n = rt(e), o = at(e)?.material, s = o && n?.rulesAdjustments && {
    ...n.rulesAdjustments.default,
    ...n.rulesAdjustments[o]
  };
  if (!r || !s || !Object.values(s).some(Boolean)) return r;
  const a = ae(r);
  if (!a) throw Error("Selected rules policy does not expose calibration inputs");
  const { bounds: i, typography: l } = a, d = r.horizontalScale ?? 1, u = (s.leftMargin ?? 0) / d, h = (s.rightMargin ?? 0) / d, m = s.vertical ?? 0, c = s.alignment && s.alignment !== "printing" ? a.paragraphs.map((f) => ({ ...f, align: s.alignment })) : a.paragraphs, g = P(
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
function bm(t, e, r, n, o) {
  const s = r.centered, a = o.reduce((u, h) => u + h.runs.reduce((m, c) => m + c.text.length, 0), 0), i = e.wordingMode === "oracle" ? Math.min(10, r.minimumSize) : r.minimumSize;
  let l = !1;
  if (s && e.rulesAlignment?.mode !== "left" && a <= s.maxCharacters) {
    const u = P(
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
  return P(
    t,
    d,
    r.bounds,
    l ? s.maximumSize : r.maximumSize,
    i,
    r.typography
  );
}
function Is(t, e) {
  return t.length > 0 && e.length > 0 && [...t, ...e].every((r) => r.role === "flavor");
}
function wm(t, e, r, n, o, s, a) {
  if (Is(s, a)) {
    if (!r.typography.fractionalMetrics || o.size === r.centered.size)
      return n;
    const h = ae(n);
    if (!h) throw Error("Missing native flavor layout request");
    if (h.typography.fractionalMetrics !== void 0) return n;
    const m = P(
      t,
      h.paragraphs,
      h.bounds,
      h.maximumSize,
      h.minimumSize,
      { ...h.typography, fractionalMetrics: !0 }
    );
    return m.overflow ? n : m;
  }
  if (!a.length || !s.length || [...s, ...a].some((h) => h.role !== "rules" || h.align !== void 0) || o.size === r.centered.size)
    return n;
  const i = a.reduce(
    (h, m) => h + m.runs.map((c) => c.text).join("").replace(/\{[^}]+\}/g, "●").length,
    0
  ), l = (h) => e.wordingMode === "oracle" ? Math.min(10, h) : h, d = (h) => h.map((m) => ({ ...m, align: "center" }));
  if (e.rulesAlignment?.mode !== "left" && i <= r.centered.maxCharacters && a.every((h) => h.runs.every((m) => !m.text.includes(`
`)))) {
    const h = {
      ...r.typography,
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, m = P(
      t,
      d(a),
      r.bounds,
      r.centered.size,
      r.centered.size,
      h
    );
    if (!m.overflow && m.lines.length <= r.centered.maxLines) {
      const c = P(
        t,
        d(s),
        r.bounds,
        r.centered.size,
        l(r.centered.size),
        h
      );
      return c.overflow ? n : c;
    }
  }
  if (o.size < r.compact.nominalMinimum || o.size >= r.compact.nominalMaximum)
    return n;
  const u = P(
    t,
    s,
    r.bounds,
    r.compact.size,
    l(r.compact.size),
    { ...r.typography, leading: r.compact.leading }
  );
  return u.overflow ? n : u;
}
const yn = (t) => t?.runs.map((e) => e.text).join("") ?? "", Na = (t) => t.length === 2 && /^[A-Za-z ,]+$/.test(yn(t[0])) && yn(t[0]).length <= 20;
function vm(t, e, r, n, o, s, a, i) {
  const l = (c) => c.role === "rules" && c.runs.length > 0 && !yn(c).includes(`
`) && c.align === void 0;
  if (!r.length || !r.every(l) || e.some((c) => c.align) || r.length !== 1 && !Na(r)) return null;
  const d = (c) => c.map(
    (g, f) => ({
      ...g,
      align: g.align ?? (g.role === "flavor" || Na(c) && f === 0 && !/^Enchant\b/.test(yn(g)) ? "left" : "center")
    })
  ), u = { x: 70, y: n - 6, width: 348, height: o - 8 }, h = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, m = P(t, d(r), u, s, s, h);
  return m.overflow || m.lines.length > 5 ? null : P(
    t,
    d(e),
    { ...u, verticalLimits: i },
    s,
    a,
    h
  );
}
function hr(t, e, r, n, o, s, a, i, l = 1 / 0) {
  const d = (c) => (c.align === void 0 || c.align === "center") && c.runs.length > 0 && c.runs.every((g) => !g.text.includes(`
`));
  if (!r.length || !r.every(d) || !e.every(d)) return null;
  const u = r.map((c) => c.runs.map((g) => g.text).join("")).join(`
`);
  if (Array.from(u.replace(/\{[^}]+\}/g, "●")).length > l) return null;
  const h = (c) => c.map((g) => ({ ...g, align: "center" })), m = P(t, h(r), n, o, o, i);
  return m.overflow || m.lines.length > a ? null : P(t, h(e), n, o, s, i);
}
const Sm = {
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
function Zl() {
  return Sm;
}
function uo(t, e, r, n, o) {
  const s = Zl()[r];
  t.save(), t.translate(s.x, s.y), t.scale(s.width, 1), t.font = `${s.size}px "CardRenderer MTG ${r === "title" ? "Goudy" : "MPlantin"}", Georgia`, t.textAlign = "left", t.textBaseline = r === "artist" ? "alphabetic" : "middle", ar(
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
function Cm(t, e, r, n) {
  const o = Zl(), s = e.wordingMode === "oracle" ? 10 : 15, a = r.reduce((d, u) => d + u.runs.reduce((h, m) => h + m.text.length, 0), 0) > 150, i = (d) => ({
    leading: d.leading,
    paragraphGap: d.paragraph,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    centerOffset: d.offset
  });
  if (e.rulesAlignment?.mode !== "left") {
    const d = hr(
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
      return a ? P(
        t,
        r.map((u) => ({ ...u, align: "center" })),
        o.dual,
        o.dual.size,
        Math.min(s, o.dual.size),
        { ...i(o.dual), balanceLines: !0 }
      ) : d;
  }
  const l = a ? o.dual.size : o.basic.size;
  return P(t, r, o.dual, l, Math.min(s, l), i(o.dual));
}
function ja(t, e) {
  return !Ot(t) || t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode !== "original" ? e : e.map(
    (r) => r.role !== "rules" ? r : {
      ...r,
      runs: r.runs.map((n) => ({
        ...n,
        text: n.text.replace(/\{(\d+|[XYZ])\}/g, "$1")
      }))
    }
  );
}
const bn = (t) => t.runs.map((e) => e.text).join(""), km = (t) => t.role === "rules" && /^[A-Za-z ,]+$/.test(bn(t)) && bn(t).length <= 28, zr = { x: 72, y: 413, width: 344, height: 182 }, ho = {
  leading: 1,
  paragraphGap: 0,
  flavorGap: 0,
  flavorOrphans: !1,
  flavorSeparator: !1,
  centerOffset: -14
}, za = (t) => t.map((e, r) => ({
  ...e,
  align: e.role === "rules" && (t.some((n) => n.role === "flavor") || r === 0 && t.length > 1 && km(e)) ? "left" : "center"
}));
function Mm(t, e, r, n) {
  if (!Ot(e) || e.borderColor && e.borderColor !== "black") return null;
  const o = e.wordingMode === "oracle" ? 10 : 15, s = n.reduce(
    (l, d) => l + bn(d).replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
    0
  );
  if (e.rulesAlignment?.mode !== "left" && s <= (n.every((l) => l.role === "flavor") ? 135 : 130) && n.length > 0 && n.every((l) => l.align === void 0 && !bn(l).includes(`
`)) && r.every((l) => l.align === void 0)) {
    const l = {
      ...ho,
      leading: 1.1,
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, d = P(t, za(n), zr, 27.5, 27.5, l);
    if (!d.overflow && d.lines.length <= 5)
      return P(t, za(r), zr, 27.5, o, l);
  }
  const i = P(t, r, zr, 22.25, 21.75, ho);
  return i.overflow ? P(t, r, zr, 15.5, o, {
    ...ho,
    leading: 1.2
  }) : i;
}
const Tm = {
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
}, Ql = { x: 70, y: 414, width: 348, height: 184 }, wn = (t) => t.runs.map((e) => e.text).join(""), xm = (t) => t.reduce(
  (e, r) => e + wn(r).replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
  0
), Rm = (t) => t.role === "rules" && /^[A-Za-z ,]+$/.test(wn(t)) && wn(t).length <= 28, Ya = (t, e = !1) => t.map((r, n) => ({
  ...r,
  align: !e && r.role === "rules" && (t.some((o) => o.role === "flavor") || n === 0 && t.length > 1 && Rm(r)) ? "left" : "center"
}));
function Lm(t, e, r, n) {
  const o = e.setCode?.toLowerCase();
  if (o !== "arn" && o !== "atq" && o !== "drk" && o !== "4ed") return null;
  const s = o === "4ed";
  if (s && at(e)?.material !== "L" || e.frameTemplate || e.frameAssetFamily || e.frameStyle === "modern" || e.borderColor && e.borderColor !== (s ? "white" : "black") || e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return null;
  const a = rt(e)?.expansionBody ?? (s ? void 0 : Tm[o]);
  if (!a) return null;
  const i = qa(t, e, r, n, o, a), l = (a.bounds ?? Ql).height - i.height;
  if (!a.unconstrained || i.size >= 20 && l <= (a.unconstrained.minimumFreeSpace ?? 20) + 0.02)
    return i;
  const d = qa(t, e, r, n, o, {
    ...a,
    ...a.unconstrained
  });
  return d.overflow && !i.overflow ? i : d;
}
function qa(t, e, r, n, o, s) {
  const a = s.bounds ?? Ql, i = e.wordingMode === "oracle" ? 10 : 15, l = {
    fractionalMetrics: s.fractionalMetrics,
    textWidth: s.textWidth,
    leading: s.regularLeading ?? 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: s.flavorOrphans ?? !1,
    flavorOrphanMinCharacters: s.flavorOrphanMinCharacters,
    flavorSeparator: !1,
    centerOffset: s.offset
  };
  if (e.rulesAlignment?.mode !== "left" && n.length > 0 && xm(n) <= s.threshold && n.every((h) => h.align === void 0 && !wn(h).includes(`
`)) && r.every((h) => h.align === void 0)) {
    const h = o === "drk", m = h ? { ...a, x: 76, width: 336 } : a, c = {
      ...l,
      textWidth: 1,
      leading: s.largeLeading ?? 1.1,
      centerOffset: s.largeOffset ?? (h ? 0 : -14),
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, g = P(
      t,
      Ya(n, h),
      m,
      s.largeSize ?? 27.5,
      s.largeSize ?? 27.5,
      c
    );
    if (!g.overflow && g.lines.length <= 5) {
      const f = Ya(r, h), p = P(
        t,
        f,
        m,
        s.largeSize ?? 27.5,
        i,
        c
      );
      return !h || p.lines.length >= 5 ? p : P(t, f, m, s.largeSize ?? 27.5, i, {
        ...c,
        centerOffset: -2 * (5 - p.lines.length)
      });
    }
  }
  if (!P(t, r, a, 22.5, 21.75, {
    ...l,
    textWidth: 1
  }).overflow) {
    const h = P(
      t,
      r,
      a,
      s.regular,
      Math.min(s.regular, 21.75 / Math.max(1, s.textWidth)),
      l
    );
    if (o !== "drk") return h;
    const m = h.lines.length <= 5;
    return P(
      t,
      r,
      { ...a, x: 71, y: m ? 415 : 418, width: m ? 348 : 351 },
      s.regular,
      Math.min(s.regular, 21.75 / Math.max(1, s.textWidth)),
      { ...l, leading: 0.96 }
    );
  }
  return P(
    t,
    r,
    o === "drk" ? { ...a, x: 73, y: 418, width: 342 } : a,
    s.compact,
    i,
    {
      ...l,
      textWidth: 1,
      leading: o === "drk" ? 1.22 : s.compactLeading
    }
  );
}
const Ha = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: !1,
  flavorSeparator: !1
}, Em = "revised-original-fractional-v1";
function td(t) {
  return t.setCode?.toLowerCase() === "3ed" && t.wordingMode === "original" && t.frameStyle !== "modern" && !t.frameTemplate && (!t.layout || t.layout === "normal") && Lt(t) === "fourth" && !vt(t);
}
function Am(t, e) {
  const r = at(e) && rt(e)?.textTiers, n = at(e) && rt(e)?.bodyClasses, o = n?.materials.includes(at(e)?.material ?? "") ? n : void 0, s = e.wordingMode !== "oracle" && ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? ""), a = (m = !1) => {
    let c = Xa(t, e);
    const g = r?.retainRegularAboveLines, f = r || o ? ee({
      rulesText: e.rulesText ?? "",
      rulesParagraphs: e.rulesParagraphs
    }) : [], p = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? f : f;
    if (o && c && (f.every((v) => v.role === "rules") && p.every((v) => v.role === "rules") || Is(f, p))) {
      const v = p === f ? c : Xa(t, { ...e, rulesParagraphs: p });
      c = wm(
        t,
        e,
        o,
        c,
        v ?? c,
        f,
        p
      );
    }
    const w = r && (Ms(e, p) || p.reduce((v, S) => v + S.runs.reduce((k, M) => k + M.text.length, 0), 0) > (r.mediumMaximum ?? 274));
    if (g !== void 0 && (!Number.isInteger(g) || g < 1))
      throw Error("Invalid regular density limit");
    const b = !w && c && e.wordingMode !== "oracle" && g !== void 0 && c.size >= 19 && c.size < 30 && c.lines.length > g ? c : r && c ? e.wordingMode === "oracle" ? Rs(t, e, c, r.regularWidthDelta) : Hl(t, e, c, r, m) : Qh(t, e, c, m);
    return ym(t, e, b);
  }, i = Uh(
    e,
    ee({
      rulesText: e.rulesText ?? "",
      rulesParagraphs: e.rulesParagraphs
    })
  ), l = () => {
    const m = a();
    if (!s || !m || m.size >= 30) return m;
    const c = a(!0);
    return c?.fractionalMetrics && c.lines.length <= Math.max(m.lines.length, i) ? c : Ua(t, m, r?.denseWidth ?? 1);
  }, d = td(e), u = r || o || s || d ? Ga(t, l) : l();
  if (!d || !u) return u;
  const h = u.size >= 26 ? 1 : u.size >= 22.5 ? 1.01 : 1.02;
  return Ga(
    t,
    () => Ua(t, u, 1, { textWidth: h, right: 424 })
  );
}
function Xa(t, e) {
  if (Ss(e)) return null;
  const [r, n, o, s] = At(Wn(e).rules), a = rs(e), i = ja(
    e,
    a?.paragraphs ?? ee({
      rulesText: e.rulesText ?? "",
      rulesParagraphs: e.rulesParagraphs
    })
  ), l = e.rulesAlignment?.mode === "left", d = l ? i.map((E) => E.role === "rules" ? { ...E, align: "left" } : E) : i, u = e.rulesAlignment?.mode === "auto" ? ja(e, e.rulesAlignment.reference ?? d) : d, h = e.wordingMode === "oracle" ? 10 : 15;
  if (vt(e)) return Cm(t, e, d, u);
  const m = Mm(t, e, d, u);
  if (m) return m;
  const c = Lm(t, e, d, u);
  if (c) return c;
  const g = at(e), f = g && rt(e)?.body, p = !l && u.length > 0 && u.every((E) => E.align === "center") && d.every((E) => E.align === void 0 || E.align === "center"), w = f && (f[g.material] ?? (p ? f.centered : void 0) ?? f.default);
  if (w)
    return bm(
      t,
      e,
      w,
      w === f?.centered ? d.map((E) => ({ ...E, align: "center" })) : d,
      u
    );
  const y = e.setCode?.toLowerCase(), b = Kh(y) ? { ...Ha, flavorAttribution: "right" } : Ha, v = ["lea", "leb"].includes(y ?? "") && e.wordingMode === "oracle" ? [428, 590] : void 0, S = ["lea", "leb", "2ed"].includes(y ?? ""), k = S || y === "3ed" && Lt(e) === "fourth";
  if (k && !l) {
    const E = vm(
      t,
      d,
      u,
      n,
      s,
      S ? 32.5 : 27.5,
      h,
      v
    );
    if (E) return E;
  }
  const M = u.length === 1 ? u[0] : void 0, C = M?.runs.length === 1 ? M.runs[0] : void 0;
  if (!l && y === "4ed" && Lt(e) === "fourth" && u.some((E) => E.role === "flavor")) {
    const E = hr(
      t,
      d,
      u,
      { x: 72, y: n + 2, width: 344, height: s - 8 },
      25,
      h,
      5,
      {
        ...b,
        leading: 1.1,
        paragraphGap: 0,
        flavorGap: 0,
        balanceLines: !0
      },
      150
    );
    if (E) return E;
  }
  const T = !l && y === "4ed" && Lt(e) === "fourth" && d.every((E) => E.align === void 0 || E.align === "center") && M?.role === "rules" && (M.align === void 0 || M.align === "center") && C && !C.italic && !C.text.includes(`
`) && C.text.length > 0 && C.text.length <= 100, R = (k || y === "4ed" && Lt(e) === "fourth") && (d.length > 1 || d.reduce((E, q) => E + q.runs.reduce((K, dt) => K + dt.text.length, 0), 0) > 100), A = R && k, L = R && y === "4ed", O = (y === "mir" || y === "tmp") && !a && !/\b(?:Land|Artifact)\b/.test(e.typeLine ?? "") && F(e).join("") === "W", B = P(
    t,
    T ? d.map((E) => ({ ...E, align: "center" })) : d,
    {
      x: k ? 70 : L || T ? 72 : r,
      y: n + (a ? 1.5 : T ? -6 : L ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: k ? 346 : L || T ? 344 : o + (O ? 10 : 0),
      height: s - 8,
      verticalLimits: v
    },
    a ? 24 : T ? 25 : 22.5,
    h,
    T ? { ...b, leading: 1, balanceLines: !0 } : R ? {
      ...b,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: A ? -10 : 0
    } : b
  ), U = d.reduce(
    (E, q) => E + q.runs.reduce((K, dt) => K + dt.text.length, 0),
    0
  );
  return !A || U <= 270 || B.size >= 22 ? B : P(
    t,
    d,
    { x: 70, y: n + 4, width: 346, height: s + 8, verticalLimits: v },
    15.5,
    h,
    {
      ...b,
      leading: 1.25,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: -18
    }
  );
}
function Ja(t) {
  const e = at(t), r = e && rt(t)?.bodyClasses;
  if (!r?.typography.fractionalMetrics || !r.materials.includes(e?.material ?? ""))
    return;
  const n = ee({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), o = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? n : n;
  return Is(n, o) ? "fractional-pure-flavor-v1" : void 0;
}
const Ct = {
  middleLift: 4,
  rightInset: 2,
  titleWidth: 1.06,
  typeWidth: 1.03
};
function vn(t, e) {
  const r = e ? 310 : 356, n = e ? 384 : 430;
  return t <= 70 || t >= 620 ? t : t < r ? t - Ct.middleLift * (t - 70) / (r - 70) : t <= n ? t - Ct.middleLift : t - Ct.middleLift * (620 - t) / (620 - n);
}
function ed(t, e, r) {
  const n = [0, 70, e ? 310 : 356, e ? 384 : 430, 620, 680];
  for (let o = 0; o < n.length - 1; o++) {
    const s = n[o], a = n[o + 1], i = vn(s, e), l = vn(a, e);
    t.save();
    try {
      t.beginPath(), t.rect(0, i, 488, l - i), t.clip(), t.translate(0, i), t.scale(1, (l - i) / (a - s)), t.translate(0, -s), r();
    } finally {
      t.restore();
    }
  }
}
const Ka = {
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
function Bm(t) {
  const e = t?.toLowerCase() ?? "";
  return Object.hasOwn(Ka, e) ? Ka[e] : [1, 1];
}
function Im(t, e) {
  const { width: r, height: n } = t, o = "getContext" in t ? void 0 : $([r, n]);
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
    o && Qr(o);
  }
}
function Om(t) {
  const e = rt(t)?.revision ?? null, r = es(t.setCode)?.revision, n = ie(t);
  return r || n ? [
    "legacy-regional-v1",
    e,
    r ?? null,
    n ? "abu-outline-v3" : null,
    t.setCalibrationCandidate ?? null
  ] : ["set-profile-v1", e, t.setCalibrationCandidate ?? null];
}
function rd(t, e, r, n, o, s) {
  const a = ot(s)?.statsText;
  if (!a) return bt(t, e, r, n, o, s.textInk);
  t.save();
  try {
    t.font = t.font.replace(/([\d.]+)px/, (i, l) => `${Number(l) * a.size}px`), a.fractionalMetrics && (t.textRendering = "geometricPrecision", t.fontKerning = "normal"), bt(t, e, r, n, o, s.textInk);
  } finally {
    t.restore();
  }
}
function nd(t) {
  if (t.colorCalibration !== "set-hsb-v1" || t.calibration === "source") return;
  const e = nt(t), r = e && wt(t);
  if (!e || !r) return;
  const n = [
    r.frame,
    ...r.rightFrame ? [r.rightFrame] : [],
    ...t.power != null && t.toughness != null ? [r.pt] : []
  ].flatMap((o) => {
    const s = o.startsWith(e.root + "/") ? o.slice(e.root.length + 1) : "", a = e.materials[s];
    return a ? [[o, a]] : [];
  });
  return Object.fromEntries(n);
}
const Va = `${Y.CONJURER_ROOT}/img/frames/future/regular`, Os = Y.MSE_TEMPLATE_ROOT, Dt = `${Os}/magic-future.mse-style`, Yr = `${Os}/magic-future-textless.mse-style`;
function kt(t) {
  return t.futureTreatment ?? "regular";
}
function od(t) {
  if ((t.manaSymbols?.length || 0) > 6)
    throw Error("Futureshifted cost exceeds the six source positions");
  if (ge(t), kt(t) === "full-art" && (t.rulesParagraphs?.some((e) => e.runs.some((r) => r.text.trim())) || !t.rulesParagraphs && t.rulesText?.trim()))
    throw Error("Futureshifted full-art treatment has no rules panel for the supplied wording");
}
function sd(t) {
  const e = F(t);
  return e.join("") === "WG" ? ["G", "W"] : e.join("") === "WR" ? ["R", "W"] : e;
}
function ge(t) {
  const e = G(t), r = sd(t), n = kt(t), o = n === "full-art", s = e.land && !o, a = n === "regular" && !s && !e.artifact && r.length === 0, i = s || a, l = r.length > 1 ? "M" : r[0] ?? (e.artifact ? "A" : "C"), d = (r[0]?.toLowerCase() ?? "c") + "l", u = s && r.length === 2, h = (r[1]?.toLowerCase() ?? "c") + "l", m = t.power != null && t.toughness != null;
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
  ].filter((y) => new RegExp(`\\b${y}\\b`).test(g));
  /\b(?:Tribal|Kindred)\b/.test(g) && f.push("Tribal");
  const p = f.length > 1 ? "multitype" : f[0]?.toLowerCase(), w = s ? ["U", "B", "R", "G"].includes(r[0] ?? "") : c;
  return {
    kind: "future",
    base: o ? `${Yr}/${l.toLowerCase()}card.jpg` : i ? `${Dt}/${a ? "c" : d}card.jpg` : `${Va}/futureFrame${l}.png`,
    ...o ? { mask: `${Yr}/mask_image.png` } : {},
    ...i ? {
      mask: `${Dt}/mask_image.png`,
      paper: `${Dt}/${a ? "c" : e.creature ? l.toLowerCase() : d}textbox.png`,
      type: `${Dt}/${a ? "c" : d}typeline.png`
    } : {},
    ...u ? {
      reverseBase: `${Dt}/${h}card.jpg`,
      reversePaper: `${Dt}/${h}textbox.png`,
      reverseType: `${Dt}/${h}typeline.png`,
      neutralBase: `${Dt}/clcard.jpg`,
      neutralType: `${Dt}/cltypeline.png`,
      baseBlend: `${Dt}/hybrid_blend_card.png`,
      typeBlend: `${Dt}/hybrid_blend_typeline.png`
    } : {},
    ...m ? {
      stats: o ? `${Yr}/${l.toLowerCase()}pt.jpg` : i ? `${Dt}/${a ? "c" : d}pt.png` : `${Va}/futurePT${l}.png`,
      ...o ? { statsMask: `${Yr}/mask_pt.png` } : {}
    } : {},
    ...p ? {
      typeSymbol: `${Os}/magic-future-common.mse-include/${p}_${w ? "white" : "black"}.png`
    } : {},
    ...t.artist ? {
      brush: `${Y.CONJURER_ROOT}/img/manaSymbols/${s || c ? "whitebrush" : "brush"}.svg`
    } : {}
  };
}
function $s(t) {
  const e = kt(t), r = e === "full-art";
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
function _n(t) {
  return /^[WUBRG]$/.test(t) ? `${Y.MSE_TEMPLATE_ROOT}/magic-mana-future.mse-symbol-font/mana_${t.toLowerCase()}.png` : /^(?:[0-9]|1[0-9]|20|X)$/.test(t) ? `${Y.CONJURER_ROOT}/img/manaSymbols/future/f0.png` : /^[WUBRG]\/[WUBRG]$/.test(t) ? `${Y.CONJURER_ROOT}/img/manaSymbols/future/f${t.toLowerCase().replace("/", "")}.png` : null;
}
function $m(t) {
  const e = t.manaSymbols ?? [];
  return [
    .../* @__PURE__ */ new Set([
      ...e.map(_n).filter((r) => r !== null),
      ...e.some((r) => /^(?:\d+|X)$/.test(r)) ? Do() : []
    ])
  ];
}
function Do() {
  return ["0", "1", "2", "3", "4", "5", "6", "x"].map(
    (t) => `${Y.CONJURER_ROOT}/img/manaSymbols/future/f${t}.png`
  );
}
function Pm(t, e, r) {
  const n = [91, 61, 46, 46, 59, 106], o = [140, 207, 281, 356, 437, 512], s = e.manaSymbols ?? [];
  if (s.length > n.length) throw Error("Futureshifted cost exceeds the six source positions");
  s.forEach((a, i) => {
    const l = kt(e) === "full-art" && i > 0 && i < 3, d = l || kt(e) === "regular" && i < 4, u = d ? /^[WUBRG]$/.test(a) ? 37.125 : 38.125 : 59 * 488 / 744, h = l ? [79.0376, 58.6102, 56.1465] : [78.1626, 59.4852, 51.6465, 51.6465], m = l ? [113.101, 161.7009, 217.5071] : [111.851, 154.0759, 202.5071, 252.3427], c = d ? h[i] - u / 2 : n[i] * 488 / 744, g = d ? m[i] - u / 2 : o[i] * 680 / 1039, f = _n(a), p = f ? r.get(f) : void 0;
    if (f && !p) throw Error(`Futureshifted mana asset unavailable: ${f}`);
    p ? (t.drawImage(p, c, g, u, u), /^(?:\d+|X)$/.test(a) && (t.save(), t.translate(c + u / 2 - 0.75 * u / 38.125, g + u / 2 + 1.75 * u / 38.125), t.scale(0.9375, 1), t.font = `700 ${u * 31.25 / 38.125}px "CardRenderer MTG MPlantin"`, t.fillStyle = "#111", t.textAlign = "center", t.textBaseline = "middle", t.fillText(a, 0, 0, u * 0.73), t.restore())) : mt(t, a, c, g, u, r, !1);
  });
}
function Ps([t, e, r, n]) {
  return [e / 375, 1 - (t + r) / 523, n / 375, r / 523];
}
function Sn([t, e, r, n]) {
  return [(1 - e - n) * 523, t * 375, n * 523, r * 375];
}
const Lr = {
  rect: [455, 307, 30, 12],
  font: 'bold 16px "CardRenderer MTG ModMatrix"',
  color: "rgb(45, 45, 45)"
};
function Gm(t, e) {
  if (e.frameTemplate !== "battle" || !e.reverseStats) return null;
  const r = `${e.reverseStats.power}/${e.reverseStats.toughness}`;
  t.save();
  try {
    t.font = Lr.font, t.textAlign = "right", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
    const n = t.measureText(r), [o, s, a, i] = Lr.rect, l = o + a, d = s + i - n.actualBoundingBoxDescent, u = [
      l - n.actualBoundingBoxLeft,
      d - n.actualBoundingBoxAscent,
      n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
      n.actualBoundingBoxAscent + n.actualBoundingBoxDescent
    ];
    return {
      text: r,
      font: Lr.font,
      x: l,
      baseline: d,
      inkBounds: u,
      rect: Ps(u),
      rotation: -90
    };
  } finally {
    t.restore();
  }
}
const Za = Y.MSE_TEMPLATE_ROOT, Gs = {
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
function Qa(t) {
  const e = F(t);
  return /\bLand\b/.test(t.typeLine ?? "") || t.land ? (e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "c") + "l" : /\bArtifact\b/.test(t.typeLine ?? "") || t.artifact ? "a" : e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "c";
}
function Fs(t) {
  if (!t.frameTemplate) return null;
  const e = t.frameTemplate, r = Gs[e];
  if (!r) throw Error("Unknown standard frame template");
  if (t.frameAssetFamily) throw Error("Choose one frame template or plate family");
  if (e === "future") return ge(t);
  const n = `${Za}/${r.style}`, o = Qa(e === "flip" ? t.faces?.[0] ?? t : t);
  if (e === "battle")
    return {
      kind: e,
      base: `${n}/cards/${o.replace(/l$/, "")}card.png`,
      defense: `${Za}/magic-modules.mse-include/loyalty/defense.png`,
      texture: `${n}/cards/texture/${o.replace(/l$/, "")}card.png`,
      border: `${n}/border.png`
    };
  const s = `${n}/${o}card.jpg`;
  if (e === "flip") {
    const a = t.faces?.[1] ?? t, i = t.faces?.[0] ?? t, l = Qa(a);
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
function Fm(t) {
  const e = Fs(t);
  if (!e) return [];
  const { kind: r, ...n } = e;
  return [
    ...Object.values(n).filter((o) => typeof o == "string"),
    ...t.frameTemplate === "future" ? $m(t) : []
  ];
}
function Wm(t) {
  if (!t.frameTemplate) return null;
  if (t.frameTemplate === "future") {
    const n = $s(t), o = (s) => [s[0] / 488, s[1] / 680, s[2] / 488, s[3] / 680];
    return {
      ...H,
      frame: [0, 0, 1, 1],
      title: o(n.title),
      art: o(n.art),
      type: o(n.type),
      rules: o(n.rules),
      stats: o(n.stats),
      footer: o(n.footer)
    };
  }
  const e = Gs[t.frameTemplate];
  if (!e) throw Error("Unknown standard frame template");
  const r = (n) => {
    const [o, s, a, i] = n, [l, d] = e.size;
    return t.frameTemplate === "battle" ? Ps(n) : [o / l, s / d, a / l, i / d];
  };
  return {
    ...H,
    frame: [0, 0, 1, 1],
    title: r(e.title),
    art: r(e.art),
    type: r(e.type),
    rules: r(e.rules),
    stats: r(e.stats),
    footer: r(e.footer)
  };
}
function oe(t) {
  return t.securityStamp !== void 0 ? t.securityStamp === "oval" : !lt(t) && t.frameAssetFamily !== "eighth" && ["rare", "mythic"].includes(t.rarity ?? "");
}
const ad = `${W}/img/frames/m15/holoStamps/stamp.png`, Cn = 310.216, ti = {
  frame: [52, 20, 298, 449],
  title: [70, 40, 261, 26],
  art: [65, 76.5, 270, 183.8],
  type: [70, 265, 261, 23],
  rules: [74, 301, 255, 160],
  artistY: 0,
  legalY: 0
}, _m = `${W}/img/frames/m15/split`, ei = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style", id = [
  `${ei}/namebox/texture/normal/c.png`,
  `${ei}/typebox/texture/normal/c.png`
], Ws = (t) => `${_m}${t.layout?.endsWith("-fuse") ? "/fuse" : ""}`;
function _s(t) {
  const e = F(t);
  return `${Ws(t)}/${e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "a"}.png`;
}
function ld(t) {
  const e = t.manaSymbols ?? [];
  return e.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !e.some((r) => /^[WUBRG]$/.test(r));
}
function dd(t) {
  const e = F(t);
  return [
    _s(t),
    ...e.length === 2 ? e.map((r) => `${Ws(t)}/${r.toLowerCase()}.png`) : [],
    ...e.length === 2 && ld(t) ? id : [],
    ...oe(t) ? [ad] : []
  ];
}
const We = /* @__PURE__ */ new Map(), mo = /* @__PURE__ */ new WeakMap();
let Um = 0, co = 0;
const Dm = (t) => (mo.has(t) || mo.set(t, ++Um), mo.get(t));
function qr(t, e, r, n, o, s) {
  t.moveTo(e + s, r), t.lineTo(e + n - s, r), t.quadraticCurveTo(e + n + s * 0.25, r + o / 2, e + n - s, r + o), t.lineTo(e + s, r + o), t.quadraticCurveTo(e - s * 0.25, r + o / 2, e + s, r), t.closePath();
}
function Nm(t, e) {
  const r = (g) => {
    const f = e.get(g);
    if (!f) throw Error(`Modern split asset unavailable: ${g}`);
    return f;
  }, n = r(_s(t)), o = F(t);
  if (o.length !== 2) return n;
  "WUBRG".indexOf(o[1]) - "WUBRG".indexOf(o[0]) > 2 && o.reverse();
  const s = ld(t), a = [
    ...o.map((g) => r(`${Ws(t)}/${g.toLowerCase()}.png`)),
    ...s ? id.map(r) : [n]
  ], i = o.join("") + (s ? "-hybrid-" : "-gold-") + [n, ...a].map(Dm).join("/"), l = We.get(i);
  if (l)
    return We.delete(i), We.set(i, l), l;
  const d = $();
  d.width = n.width, d.height = n.height;
  const u = d.getContext("2d");
  u.scale(d.width / 488, d.height / 680), u.translate(0, 680), u.rotate(-Math.PI / 2);
  const h = (g) => {
    u.save(), u.translate(680, 0), u.rotate(Math.PI / 2), u.drawImage(g, 0, 0, 488, 680), u.restore();
  }, m = t.layout?.endsWith("-fuse") ?? !1;
  h(n);
  for (const g of [0, Cn]) {
    if (u.save(), u.beginPath(), s ? u.rect(g + 50, 0, Cn, 488) : (qr(u, g + 57.5, 29, 286, 47, 9), u.rect(g + 64, 74, 273, m ? 362 : 394), qr(u, g + 57.5, 260, 286, 34, 7)), m)
      for (const [y, b] of [
        [29, 47],
        [260, 34]
      ])
        u.moveTo(334, y), u.lineTo(356, y + b / 2), u.lineTo(378, y), u.lineTo(378, y + b), u.lineTo(356, y + b / 2), u.lineTo(334, y + b), u.closePath();
    u.clip(), h(a[0]);
    const f = $();
    f.width = d.width, f.height = d.height;
    const p = f.getContext("2d");
    p.drawImage(a[1], 0, 0, f.width, f.height), p.globalCompositeOperation = "destination-in";
    const w = p.createLinearGradient(
      0,
      (680 - g - 175) / 680 * f.height,
      0,
      (680 - g - 230) / 680 * f.height
    );
    if (w.addColorStop(0, "#0000"), w.addColorStop(1, "#000"), p.fillStyle = w, p.fillRect(0, 0, f.width, f.height), u.save(), u.translate(680, 0), u.rotate(Math.PI / 2), u.drawImage(f, 0, 0, 488, 680), u.restore(), u.restore(), f.width = f.height = 0, u.save(), u.beginPath(), qr(u, g + 62.5, 34.5, 276, 37.5, 7), qr(u, g + 62.5, 265, 276, 24, 5), m)
      for (const [y, b] of [
        [35, 37],
        [265, 24]
      ])
        u.moveTo(332, y), u.lineTo(349, y + b / 2), u.lineTo(332, y + b), u.closePath(), u.moveTo(380, y), u.lineTo(363, y + b / 2), u.lineTo(380, y + b), u.closePath();
    u.clip(), s ? (u.drawImage(a[2], 22, 7, 196, 19, g + 62.5, 34.5, 276, 37.5), u.drawImage(a[3], 22, 192, 196, 11, g + 62.5, 265, 276, 24)) : h(a[2]), u.restore();
  }
  const c = d.width * d.height * 4;
  for (const [g, f] of We) {
    if (co + c <= 16 * 1024 * 1024) break;
    co -= f.width * f.height * 4, We.delete(g), f.width = f.height = 0;
  }
  return c <= 16 * 1024 * 1024 && (We.set(i, d), co += c), d;
}
function Pe(t) {
  return ["split", "aftermath"].includes(t.layout ?? "") && t.faces?.length === 2 && (t.layout === "aftermath" || /^Aftermath\b/m.test(t.faces[1].rulesText ?? ""));
}
const Be = 373, ud = 257, hd = `${W}/img/frames/saga/stamp.png`;
function md(t) {
  const e = F(t), r = e.length > 1 ? "m" : e[0]?.toLowerCase();
  if (!r) throw Error("No validated colorless Aftermath plate is available.");
  return `${W}/img/frames/m15/aftermath/${r}.png`;
}
function cd(t) {
  return Pe(t) ? [
    ...t.faces.map(md),
    ...oe(t) ? [hd] : []
  ] : [];
}
const Us = {
  title: [41.7, 35.5, 405, 37],
  art: [37.4, 76.5, 413.2, 151.8],
  type: [41.7, 235.8, 405, 37],
  rules: [41.7, 281.5, 405, 76]
}, Ds = {
  title: [12, 37.5, 227, 37],
  art: [11, 80.7, 240.9, 137.9],
  // Align the rotated type plate in its reading orientation (all type labels).
  type: [9, 226.2, 230, 37],
  rules: [14, 276.5, 232, 169]
};
function jm(t) {
  const e = t ? Ds : Us, r = t ? ud : 488, n = t ? 488 : Be, o = (s) => {
    const [a, i, l, d] = e[s];
    return [a / r, i / n, l / r, d / n];
  };
  return {
    ...H,
    title: o("title"),
    art: o("art"),
    type: o("type"),
    rules: o("rules"),
    footer: [0, 1, 0, 0]
  };
}
const gd = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", zm = new Set("dis plc cmd pc2 dgm mma c13".split(" "));
function Vt(t) {
  return t.layout !== "split" || t.faces?.length !== 2 || Pe(t) || t.faces.some(
    (e) => !/^(Instant|Sorcery)\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "")
  ) ? null : lt({ ...t, layout: "normal", frameStyle: t.frameStyle ?? t.faces[0]?.frameStyle }) ? "old" : t.frameAssetFamily === "eighth" || zm.has(t.setCode?.toLowerCase() ?? "") ? "eighth" : "m15";
}
function nr(t) {
  const e = (r) => [
    r.rulesText ?? "",
    ...(r.rulesParagraphs ?? []).map((n) => n.runs.map((o) => o.text).join(""))
  ];
  return [t, ...t.faces ?? []].some((r) => e(r).some((n) => /^Fuse\b/m.test(n)));
}
const fd = 251 * 680 / 523, ri = 680 / 523, kn = 488 / 375, Ee = (t, e, r, n) => [
  t * ri,
  e * kn,
  r * ri,
  n * kn
];
function mr(t, e) {
  if (t === "m15")
    return e ? { ...ti, rules: [74, 301, 255, 128] } : ti;
  const r = t === "old";
  return {
    frame: Ee(18, 18, e ? 244 : 236, 338),
    title: Ee(r ? 35 : 30, r ? 23 : 28, r ? 207 : 214, 21),
    art: r ? Ee(37, 47, 197, 130) : Ee(27, 56, 217, 152),
    type: Ee(r ? 35 : 30, r ? 182 : 211, 210, r ? 21 : 17),
    rules: r ? Ee(43, 207, 187, 109) : Ee(30, 233, 213, e ? 74 : 95),
    artistY: (r ? 332 : e ? 344 : 339) * kn,
    legalY: (r ? 347 : 354) * kn
  };
}
function Ym(t) {
  const e = t.layout?.startsWith("split-old") ? "old" : t.layout?.startsWith("split-m15") ? "m15" : "eighth", r = e === "m15" ? Cn : fd, n = mr(e, t.layout?.endsWith("-fuse") ?? !1), o = (s) => [
    s[0] / r,
    s[1] / 488,
    s[2] / r,
    s[3] / 488
  ];
  return {
    ...H,
    frame: o(n.frame),
    title: o(n.title),
    art: o(n.art),
    type: o(n.type),
    rules: o(n.rules),
    footer: [0, 1, 0, 0]
  };
}
function Mn(t, e, r, n) {
  if (e === "m15") return _s(t);
  const o = F(t), s = o.length > 1 ? "m" : o[0]?.toLowerCase() ?? "c";
  return `${gd}/${e === "old" ? "magic-old-split" : r ? "magic-new-split-fuse" : "magic-new-split"}.mse-style/${s}card${r ? n + 1 : ""}.${r ? "png" : "jpg"}`;
}
function pd(t) {
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
const Hr = `${W}/img/frames/saga`, yd = [
  `${Hr}/sagaMaskPinline.png`,
  `${Hr}/sagaMaskBanner.png`,
  `${Hr}/sagaMaskBannerRight.png`,
  `${Hr}/sagaMidStripe.png`
];
function bd(t) {
  const e = F(t);
  return e.length !== 2 || t.layout === "transform" || t.land || /\bLand\b/.test(t.typeLine ?? "") ? [] : ("WUBRG".indexOf(e[1]) - "WUBRG".indexOf(e[0]) > 2 && e.reverse(), e.map(
    (r) => `${W}/data/images/cardImages/saga/sagaFrame${r}.png`
  ));
}
function qm(t) {
  const e = bd(t);
  return e.length ? [...e, ...yd] : [];
}
const ni = /* @__PURE__ */ new WeakMap();
function Hm(t, e, r) {
  const n = bd(e);
  if (!n.length) return;
  const o = [...n, ...yd].map((v) => {
    const S = r.get(v);
    if (!S) throw Error(`Saga color asset unavailable: ${v}`);
    return S;
  }), s = ni.get(o[0]);
  if (s && s.sources.every((v, S) => v === o[S])) {
    t.drawImage(s.canvas, 0, 0, 488, 680);
    return;
  }
  const [a, i, l, d, u, h] = o, m = $();
  m.width = a.width, m.height = a.height;
  const c = $();
  c.width = m.width, c.height = m.height;
  const g = $();
  g.width = m.width, g.height = m.height;
  const f = m.getContext("2d"), p = c.getContext("2d"), w = g.getContext("2d"), y = m.width, b = m.height;
  w.drawImage(l, 0, 0, y, b), w.drawImage(d, 0, 0, y, b), f.drawImage(a, 0, 0, y, b), f.globalCompositeOperation = "destination-in", f.drawImage(g, 0, 0), f.globalCompositeOperation = "source-over", w.clearRect(0, 0, y, b), w.save(), w.beginPath(), w.rect(y / 2, 0, y / 2, b), w.clip(), w.drawImage(l, 0, 0, y, b), w.restore(), w.drawImage(u, 0, 0, y, b), p.drawImage(i, 0, 0, y, b), p.globalCompositeOperation = "destination-in", p.drawImage(g, 0, 0), f.drawImage(c, 0, 0), f.drawImage(h, 0.0727 * y, 0.3058 * b, 87e-4 * y, 0.4762 * b), ni.set(a, { sources: o, canvas: m }), c.width = c.height = g.width = g.height = 0, t.drawImage(m, 0, 0, 488, 680);
}
const $r = `${W}/img/frames/saga`;
function Ns(t) {
  const e = F(t), r = e.length > 1 ? "M" : e[0];
  if (/\bLand\b/.test(t.typeLine ?? "") || t.land) return `${$r}/regular/l.png`;
  if (t.layout === "transform" && r) return `${$r}/dfc/${r.toLowerCase()}.png`;
  if (r) return `${W}/data/images/cardImages/saga/sagaFrame${r}.png`;
  throw Error("No ordinary colorless or artifact Saga plate is available.");
}
function No(t) {
  return t.layout === "transform" && t.setCode?.toLowerCase() === "neo" ? `${W}/img/frames/m15/transform/icons/fanClosed.svg` : null;
}
const wd = `${$r}/sagaChapter.png`, vd = `${$r}/sagaDivider.png`, _r = `${$r}/stamp.png`, Zt = {
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
function Xm(t) {
  return [
    Ns(t),
    ...qm(t),
    wd,
    vd,
    ...No(t) ? [No(t)] : [],
    ...oe(t) ? [_r] : []
  ];
}
const Sd = {
  ...H,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.5007, 0.1134, 0.4233, 0.724],
  type: [0.0854, 0.8481, 0.8292, 0.0543],
  rules: [0.0867, 0.1129, 0.404, 0.7248],
  stamp: [0.17, 0.48, 0.23, 0.16506]
}, $e = `${W}/img/frames/adventure/regular`, Cd = `${$e}/bookLeft.png`, kd = `${$e}/pinline.svg`, Md = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style/namebox/texture/normal/c.png", Ur = (t) => t.layout === "adventure" && t.faces?.length === 2;
function ce(t) {
  const e = t.manaSymbols ?? [];
  return F(t).length === 2 && e.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !e.some((r) => /^[WUBRG]$/.test(r));
}
function js(t) {
  const e = G(t), r = F(t);
  return e.land ? "l" : e.artifact ? "a" : r.length > 1 ? "m" : r[0]?.toLowerCase() ?? "a";
}
const Tn = (t) => `${$e}/${js(t)}.png`;
function zs(t) {
  const e = ce(t) ? "W" : js(t).toUpperCase();
  return `${W}/img/frames/m15/regular/m15PT${e === "L" ? "C" : e}.png`;
}
const Td = (t) => `${W}/img/frames/m15/crowns/m15Crown${js(t).toUpperCase()}.png`;
function xd(t) {
  const e = t.faces?.[1];
  if (!Ur(t) || !e) throw Error("Adventure needs a permanent and an inset spell.");
  const r = (n) => {
    const o = F(n);
    return [
      Tn(n),
      ...o.length === 2 ? o.map((s) => `${$e}/${s.toLowerCase()}.png`) : []
    ];
  };
  return [
    .../* @__PURE__ */ new Set([
      ...r(t),
      ...r(e),
      Cd,
      ...F(t).length === 2 && !ce(t) ? [kd] : [],
      ...ce(t) ? [Md] : [],
      ...G(t).legendary ? [Td(t)] : [],
      ...t.power != null && t.toughness != null ? [zs(t)] : [],
      ...oe(t) ? [_r] : []
    ])
  ];
}
const Ys = {
  ...H,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.5267, 0.65, 0.3867, 0.2647],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.58, 0.74, 0.25, 0.1794]
}, Un = `${W}/img/frames/prepare/regular`, Dn = (t) => t.layout === "prepare";
function cr(t) {
  if (t.faces?.length !== 2) throw Error("Prepared needs a creature and an inset spell.");
  return t.faces[1];
}
function qs(t) {
  const e = G(t), r = F(t);
  if (e.land) return "l";
  if (/\bVehicle\b/.test(t.typeLine ?? "")) return "v";
  if (e.artifact) return "a";
  if (r.length > 1) return "m";
  if (r.length) return r[0].toLowerCase();
  throw Error("The pinned Prepared source has no colorless plate.");
}
const Xe = (t) => `${Un}/${qs(t)}.png`, rn = (t) => `${Un}/${t}.png`;
function qe(t) {
  const e = F(t);
  return e.length === 2 && "WUBRG".indexOf(e[1]) - "WUBRG".indexOf(e[0]) > 2 && e.reverse(), e;
}
const jo = (t) => `${W}/img/frames/m15/crowns/m15Crown${t.toUpperCase()}.png`, Jm = (t) => zs(t);
function Rd(t) {
  const e = cr(t), r = (o) => qe(o).length === 2 ? qe(o).map((s) => `${Un}/${s.toLowerCase()}.png`) : [], n = qe(t);
  return [
    .../* @__PURE__ */ new Set([
      Xe(t),
      Xe(e),
      rn("prepare"),
      ...r(t),
      ...r(e),
      ...n.length === 2 ? ["pinline", "rules", "rulesRight"].map(rn) : [],
      ...qe(e).length === 2 ? ["prepareRight", "prepareTypeTitle"].map(rn) : [],
      ...G(t).legendary ? (n.length === 2 ? n : [qs(t)]).map(jo) : [],
      ...t.power != null && t.toughness != null ? [Jm(t)] : [],
      ...oe(t) ? [_r] : []
    ])
  ];
}
const Hs = {
  ...H,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.086, 0.6303, 808 / 2010, 0.2875],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.17, 0.72, 0.25, 0.1794]
}, Km = {
  title: [1042 / 2010, 0.6391, 0.4, 0.0296],
  type: [1042 / 2010, 1932 / 2814, 0.4, 0.0296],
  rules: [1035 / 2010 + 2 / 488, 2059 / 2814, 0.3947, 438 / 2814]
}, Vm = [
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
], Ce = 0.91339 * x / 768, zo = 0.04724 * x, Yo = 0.02655 * I;
function Zm(t) {
  return [
    (zo + 20 * Ce) / x,
    (Yo + 84 * Ce) / I,
    (728 * Ce - Ct.rightInset) / x,
    (((t ? 541 : 622) - 84) * Ce - Ct.middleLift) / I
  ];
}
function Qm(t, e) {
  const r = Vm[e ? 1 : 0];
  t.beginPath(), r.forEach(([n, o], s) => {
    const a = zo + (o - 1) * Ce, i = vn(Yo + n * Ce, e);
    s === 0 ? t.moveTo(a, i) : t.lineTo(a, i);
  });
  for (let n = r.length - 1; n >= 0; n--) {
    const [o, s] = r[n];
    t.lineTo(
      zo + (769 - s) * Ce - Ct.rightInset,
      vn(Yo + o * Ce, e)
    );
  }
  t.closePath(), t.clip();
}
function Dr(t) {
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
function Q(t) {
  return t.layout === "ability" ? "normal" : t.layout === "prepare" ? "prepare" : t.layout === "adventure" && t.faces?.length === 2 ? "adventure" : t.layout === "class" || /\bClass\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "class" : t.layout === "leveler" || /^Level up\b/m.test(t.rulesText ?? "") ? "leveler" : t.layout === "saga" || /\bSaga\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "saga" : t.layout === "planeswalker" || /\bPlaneswalker\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? Dr(t).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function Yt(t) {
  const e = Wm(t);
  if (e) return e;
  if (t.layout === "aftermath-top" || t.layout === "aftermath-bottom")
    return jm(t.layout === "aftermath-bottom");
  if (/^split-(old|eighth|m15)(-fuse)?$/.test(t.layout ?? "")) return Ym(t);
  const r = wt(t);
  if (r) return r.rects;
  if (lt(t)) return Wn(t);
  const n = Q(t);
  if (n === "adventure") return Ys;
  if (n === "prepare") return Hs;
  if (n === "class")
    return {
      ...H,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (n === "saga") return Sd;
  if (n.startsWith("planeswalker")) {
    const o = n === "planeswalker-large", s = [
      0.04409,
      (o ? 0.55118 : 0.62655) - Ct.middleLift / I,
      0.88827,
      (o ? 0.37534 : 0.29997) + Ct.middleLift / I
    ], a = H.stamp[2], i = H.stamp[3];
    return {
      ...H,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, 0.92126 * x * 3793 / 2778 / I],
      frame: [0.04724, 0.02655, 0.91339, 0.91339 * x * 3810 / 2736 / I],
      art: Zm(o),
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / x,
        (o ? 0.49044 : 0.55793) + (5 - Ct.middleLift) / I,
        0.88662,
        0.05737
      ],
      rules: s,
      stats: [0.792 + 1 / x, 0.881 - 3 / I, 0.16, 0.069],
      stamp: [
        s[0] + (s[2] - a) / 2,
        s[1] + (s[3] - i) / 2,
        a,
        i
      ]
    };
  }
  return t.layout === "split-half" ? {
    ...H,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : { ...H, art: Z0(t) };
}
function tc(t) {
  const e = Q(t) === "saga", r = Yt(t).rules, n = Dr(t), o = r[2] * 488 - (e ? 32 : 70), s = r[3] * 680;
  let a = e ? 21 : 19;
  const i = (p, w) => Math.max(1, Math.ceil(p.length * w * 0.49 / o)), l = (p, w) => Math.max(e ? p.badges.length * 36 : 34, i(p.text, w) * w + 16), d = (p) => n.reduce((w, y) => w + l(y, p), 0);
  for (; a > 8 && d(a) > s; ) a -= 0.5;
  const u = n.map((p) => l(p, a)), h = Math.max(0, s - d(a)) / Math.max(1, n.length);
  let m = s / Math.max(1, n.length), c = s, g = n.length;
  if (!e)
    for (const p of [...u].sort((w, y) => y - w)) {
      if (p <= m) break;
      c -= p, m = c / Math.max(1, --g);
    }
  let f = 0;
  return n.map((p, w) => {
    const y = e ? u[w] + h : Math.max(m, u[w]), b = { ...p, top: f, height: y, font: a, left: e ? 27 : 62, width: o };
    return f += y, b;
  });
}
const ec = {
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
}, Ld = (t) => ({
  kind: "polygon",
  feather: 2 / 744,
  points: t.map(([e, r]) => [e / 744, r / 1039])
}), rc = Ld([
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
]), nc = Ld([
  [74, 582],
  [677, 582],
  [688, 590],
  [696, 605],
  [705, 615],
  [705, 628],
  [696, 642],
  [682, 650],
  [82, 650]
]), oc = { title: [1, 1, 1], type: [1, 1, 1], stats: [1.0297029702970297, 1.0088832487309645, 1.0299401197604792] }, sc = { title: [0.9047619047619047, 0.9276018099547512, 0.9518072289156626], type: [1.4015151515151516, 1.0086206896551724, 0.9087837837837838], stats: [1.5, 1.1030927835051547, 1.0265624999999998] }, ac = { title: [0.736842105263158, 0.8620689655172413, 1.03125], type: [0.6666666666666666, 0.8181818181818182, 1.0740740740740742], stats: [0.8936170212765957, 1.0612244897959184, 1.146551724137931] }, ic = { title: [1.0038560411311055, 0.9704301075268819, 1.1162790697674418], type: [0.9128989361702128, 0.9044117647058825, 1.1458333333333335], stats: null }, lc = { title: [1.2035714285714287, 1.03, 1.0040322580645162], type: [1.494318181818182, 1.0045731707317074, 1.1860465116279069], stats: [1.5, 1.1079545454545454, 1.276595744680851] }, dc = { title: [0.8410958904109589, 0.8910614525139665, 0.9060773480662984], type: [1, 1, 1], stats: null }, uc = {
  W: oc,
  U: sc,
  B: ac,
  R: ic,
  G: lc,
  A: dc
}, hc = { frame: [0.9187500000000002, 0.9229729729729731, 1.1260000000000001], title: [0.8812095032397409, 0.8817567567567567, 0.9481792717086837], type: [1.0465277777777777, 1.0163352272727273, 1.1097770154373927], stats: [0.9004329004329005, 0.8952702702702703, 0.9717514124293787] }, mc = { frame: [0.6021739130434783, 0.7878787878787878, 0.9531772575250836], title: [0.59375, 0.8760683760683762, 0.8777777777777778], type: [0.6702898550724639, 0.9859550561797753, 1.0846774193548387], stats: [0.7395209580838322, 0.8991596638655462, 0.8878378378378378] }, cc = { frame: [0.8851981351981352, 0.9510309278350517, 0.9543269230769231], title: [0.9145199063231849, 1.0140449438202248, 1.1162790697674418], type: [1.0811023622047244, 0.9044117647058825, 0.7366071428571429], stats: [0.9608294930875576, 1.0552486187845302, 1.180722891566265] }, gc = { frame: [1, 1, 1], title: [0.9573863636363638, 1.03, 1.3833333333333333], type: [1, 1, 1], stats: [0.9746835443037973, 1.0483870967741935, 1.5] }, fc = {
  W: hc,
  U: mc,
  R: cc,
  G: gc
}, Xs = (t, e = 375, r = 527) => ({
  kind: "polygon",
  feather: 1 / e,
  points: t.map(([n, o]) => [n / e, o / r])
}), pc = Xs([
  [44, 60],
  [52, 42],
  [66, 29],
  [75, 26],
  [344, 26],
  [347, 29],
  [347, 60]
]), yc = Xs([
  [43, 438],
  [337, 438],
  [341, 443],
  [336, 448],
  [335, 458],
  [339, 466],
  [43, 466]
]), bc = Xs(
  [
    [12, 16],
    [64, 16],
    [64, 35],
    [60, 42],
    [12, 42]
  ],
  78,
  51
), wc = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, _e = (t) => ({
  hueDegrees: 0,
  saturationScale: 1,
  brightnessScale: 1,
  rgbScale: t
});
function vc(t) {
  const e = ge(t);
  for (const [r, n] of Object.entries(fc)) {
    const o = Y.MSE_TEMPLATE_ROOT + "/magic-future-textless.mse-style/";
    if (e.base === o + r.toLowerCase() + "card.jpg")
      return {
        [e.base]: {
          frame: _e([1, 1, 1]),
          paper: _e(n.frame),
          mask: wc,
          regions: [
            { mask: pc, adjustment: _e(n.title) },
            { mask: yc, adjustment: _e(n.type) }
          ]
        },
        ...e.stats ? {
          [e.stats]: { frame: _e(n.frame), paper: _e(n.stats), mask: bc }
        } : {}
      };
  }
  return {};
}
const Sc = { frame: { hueDegrees: 8, saturationScale: 0.6137499999999998, brightnessScale: 1.25 }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.1482558139534884, 1.111280487804878, 1.3] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.0692640692640691, 1.036873156342183, 1.1861510791366907] } }, Cc = { W: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8366228070175439, 0.786036036036036, 0.7373737373737373] }, G: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.4, 1.4, 1.4] } }, kc = { frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6, 0.6, 0.6] }, paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8893905191873589, 0.8839285714285715, 0.9282511210762332] }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.947089947089947, 0.9388297872340424, 1.0242587601078168] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6957070707070706, 0.6905370843989771, 0.7095046854082999] } }, Ue = {
  land: Sc,
  paper: Cc,
  colorless: kc
}, Xr = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Ed = (t) => ({
  kind: "polygon",
  feather: 1 / 339,
  points: t.map(([e, r]) => [e / 339, r / 464])
}), Mc = Ed([
  [26, 43],
  [34, 25],
  [48, 12],
  [57, 9],
  [326, 9],
  [329, 12],
  [329, 43]
]), Tc = Ed([
  [12, 277],
  [319, 277],
  [330, 285],
  [337, 294],
  [330, 310],
  [319, 314],
  [20, 314]
]), xc = {
  kind: "rect",
  rect: [20 / 375, 470 / 527, 338 / 375, 40 / 527],
  feather: 1 / 375
}, Rc = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, Lc = {
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
}, pr = (t) => ({
  ...t,
  rgbScale: t.rgbScale
});
function Ec(t) {
  const e = ge(t), r = Dt + "/";
  if (!e.base.startsWith(r)) return {};
  const n = e.base === r + "ccard.jpg", o = {}, s = n ? Ue.colorless : Ue.land;
  for (const a of [e.base, e.reverseBase, e.neutralBase])
    a && (o[a] = n ? {
      frame: Xr,
      paper: pr(Ue.colorless.frame),
      mask: Rc,
      regions: [{ mask: Lc, adjustment: Xr }]
    } : { frame: Xr, paper: Ue.land.frame, mask: xc });
  for (const a of [e.type, e.reverseType, e.neutralType])
    a === r + (n ? "c" : "cl") + "typeline.png" && (o[a] = {
      frame: Xr,
      paper: pr(s.title),
      mask: Mc,
      regions: [{ mask: Tc, adjustment: pr(s.type) }]
    });
  for (const a of [e.paper, e.reversePaper])
    if (a)
      if (n) o[a] = pr(Ue.colorless.paper);
      else
        for (const [i, l] of Object.entries(Ue.paper))
          a === r + i.toLowerCase() + "ltextbox.png" && (o[a] = pr(l));
  return o;
}
const Ac = {
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
function Bc(t) {
  if (t.frameTemplate !== "future" || t.setCode?.toLowerCase() !== "fut" || t.colorCalibration !== "set-hsb-v1")
    return {};
  if (kt(t) === "full-art") return vc(t);
  if (kt(t) !== "regular") return {};
  const e = ge(t).base;
  for (const [r, n] of Object.entries(Ac))
    if (e === Y.CONJURER_ROOT + "/img/frames/future/regular/futureFrame" + r + ".png") {
      const o = uc[r], s = (i) => ({
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        rgbScale: i
      }), a = ge(t).stats;
      return {
        [e]: {
          ...n,
          mask: ec,
          regions: [
            { mask: rc, adjustment: s(o.title) },
            { mask: nc, adjustment: s(o.type) }
          ]
        },
        ...a && o.stats ? { [a]: s(o.stats) } : {}
      };
    }
  return Ec(t);
}
const Ad = (t) => ({
  kind: "polygon",
  points: t.map(([e, r]) => [e / 488, r / 680]),
  feather: 0.75 / 488
}), Ic = Ad([
  [43, 41],
  [445, 41],
  [449, 48],
  [450, 58],
  [446, 72],
  [42, 72],
  [38, 64],
  [37, 54],
  [39, 46]
]), Oc = Ad([
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
function $c(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.colorCalibration !== "set-hsb-v1" || t.frameTemplate || t.layout && t.layout !== "normal")
    return {};
  const e = wt(t);
  if (!e || !zt(t, e.frame)) return {};
  const r = J0(t, e.frame), n = Object.entries(ya).find(([, l]) => l.source === e.frame);
  if (!n)
    return r ? {
      [e.frame]: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        blackPoint: r,
        blend: $o(t, e.frame)
      }
    } : {};
  const [o, s] = n, a = o.endsWith("/W") || o.endsWith("/M") ? 615 : 610, i = {
    [e.frame]: {
      blackPoint: r,
      blend: $o(t, e.frame),
      frame: s.frame,
      paper: s.paper,
      mask: {
        kind: "rect",
        rect: [41 / 488, 425 / 680, 405 / 488, (a - 425) / 680],
        feather: 0.75 / 488
      },
      regions: [
        { mask: Ic, adjustment: s.title },
        { mask: Oc, adjustment: s.type }
      ]
    }
  };
  for (const l of e.pinlines ? [e.pinlines.left, e.pinlines.right] : []) {
    const d = Object.values(ya).find((u) => u.source === l);
    d && (i[l] = d.frame);
  }
  return i;
}
function Js(t) {
  if (t.colorCalibration !== "set-hsb-v1") return;
  const e = ur(t);
  if (!e) return;
  const r = g0[`${t.setCode?.toLowerCase()}/${e.material}`];
  if (r?.source === JSON.stringify([e.asset, e.frame]))
    return { materials: { [e.asset]: r.adjustment }, stock: r.stock };
}
function Ks(t) {
  if (t.colorCalibration !== "set-hsb-v1") return;
  const e = at(t);
  if (!e) return;
  if (e.dual)
    return {
      materials: e.dual.materials,
      stock: rt(t).dualLand.stock
    };
  const r = rt(t).colors[e.profile.split("/")[1]];
  if (r?.source === JSON.stringify([e.asset, e.frame]))
    return { materials: { [e.asset]: r.adjustment }, stock: r.stock };
}
function xe(t) {
  if (t.frameTemplate) return !1;
  const e = ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  return (lt(t) || !!cs(t)) && (!t.layout || t.layout === "normal") && (t.colorCalibration === "set-hsb-v1" || e && t.colorCalibration === "early-hsb-v1");
}
function Pc(t) {
  if (!xe(t) || !lt(t) || ie(t)) return;
  const e = me(t), r = e.split("/").at(-1).replace(".png", "").toUpperCase(), n = d0[`${t.setCode?.toLowerCase()}-${St(t)}-${r}`];
  if (!(n?.asset !== e || !n.rect.every((o, s) => o === Wr(t)[s])))
    return e.endsWith("/old/fourth/w.png") ? {
      ...n.adjustment,
      mask: {
        kind: "rect",
        rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
        feather: 2 / 1500
      }
    } : n.adjustment;
}
function Bd(t, e) {
  const r = t.colorCalibration === "set-hsb-v1" && t.calibration !== "source" && nt(t)?.mana.paperTargets[e];
  if (r) {
    const d = nt(t)?.inheritedFrom, u = `${t.setCode?.toLowerCase()}-${St(t)}-${e}`;
    return d && (jr[u] ?? Zn[u]) || [r[0] / 255, r[1] / 255, r[2] / 255];
  }
  const n = t.colorCalibration === "set-hsb-v1" && t.calibration !== "source", o = n ? ot(t) : void 0;
  if (!xe(t) && !(n && (Te(t) || o?.inheritedFrom)))
    return;
  if (t.calibration !== "source" && bs(t)) {
    const d = jr[`3ed-original-white-${e}`];
    if (d) return d;
  }
  const s = `${t.setCode?.toLowerCase()}-${St(t)}-${e}`, a = jr[s] ?? Zn[s];
  if (o?.inheritedFrom && a) return a;
  const i = o?.mana?.paperTargets[e];
  if (i) return [i[0] / 255, i[1] / 255, i[2] / 255];
  const l = fh(t, e);
  if (l) return l;
  if (!(t.setCode?.toLowerCase() === "leg" && !Ot(t))) {
    if (ys(t)) {
      const d = Fr(t);
      return d && (e === "W" || e === "B") ? pa[`arn-${d}-black-${e}`] : pa[s];
    }
    return jr[s] ?? Zn[s];
  }
}
function Nn(t) {
  const e = nt(t), r = nd(t);
  if (r && Object.keys(r).length) {
    const u = e?.inheritedFrom ? Nn({ ...t, calibration: "printing" }) : {};
    return { ...r, ...u };
  }
  const n = Ks(t);
  if (n) return n.materials;
  const o = Js(t);
  if (o) return o.materials;
  if (t.frameTemplate === "future") return Bc(t);
  if (t.setCode?.toLowerCase() === "plc") return $c(t);
  if (ot(t)?.inheritedFrom && t.colorCalibration === "set-hsb-v1") {
    const u = ps(t);
    if (u) return u;
  }
  const s = ne(t);
  if (s && t.colorCalibration === "set-hsb-v1") return s;
  if (!xe(t)) return {};
  const a = ie(t);
  if (a) {
    const u = {};
    for (const h of [a.base, a.overlay]) {
      const m = un[`${t.setCode?.toLowerCase()}/${St(t)}/retro/${h.split("/").at(-1)}`];
      m?.source === JSON.stringify([h, Wr(t)]) && Object.assign(u, m.materials);
    }
    return u;
  }
  const i = cs(t), l = i && ((G(t).legendary ? void 0 : ns[i.key]) ?? un[i.key] ?? Gn[i.key]);
  if (l && l.source === i?.source && (l.legendary === void 0 || l.legendary === G(t).legendary))
    return l.materials;
  const d = Pc(t);
  return d ? { [me(t)]: d } : {};
}
function Gc(t) {
  return Object.keys(Nn(t)).length > 0 || Object.keys(Id(t)).length > 0;
}
function oi(t) {
  const e = Ks(t);
  if (e) return e.materials;
  const r = Js(t);
  if (r) return r.materials;
  const n = Od(t), o = ie(t);
  let s = dn(t, Nn(t), n).materials;
  o && n && xe(t) && (s = dn(t, s, {
    ...n,
    url: o.overlay
  }).materials);
  const a = Id(t);
  return ot(t)?.inheritedFrom ? { ...a, ...s } : { ...s, ...a };
}
function Id(t) {
  const e = ot(t)?.componentMaterials;
  if (!e || t.colorCalibration !== "set-hsb-v1" || t.calibration === "source") return {};
  const r = Q(t);
  if (t.frameTemplate || t.faces?.length || t.layout && !["normal", "planeswalker", "token"].includes(t.layout) || !["normal", "planeswalker", "planeswalker-large"].includes(r) || r === "normal" && wt(t))
    return {};
  const n = G(t);
  if (n.land || !Te(t) && !n.legendary && F(t).length < 2)
    return {};
  const o = re(n, Q(t)), s = [
    o.frame,
    o.background,
    o.boxes,
    ...n.legendary ? [o.crown] : [],
    o.pt
  ];
  return Object.fromEntries(
    s.filter((a) => Object.hasOwn(e, a)).map((a) => [a, e[a]])
  );
}
function qo(t) {
  const e = t.colorCalibration === "set-hsb-v1" && t.calibration !== "source" && nt(t);
  if (e) {
    const o = e.inheritedFrom ? qo({ ...t, calibration: "printing" }) : void 0;
    if (o) return o;
    const s = It(t.setCode, t.borderColor).border;
    return s === "#eeedeb" ? e.stock.white : s === "#090806" ? e.stock.black : void 0;
  }
  const r = Ks(t);
  if (r) return r.stock;
  const n = Js(t);
  return n ? n.stock : dn(t, Nn(t), Od(t)).stock;
}
function Od(t) {
  if (Ze(t) && !t.frameTemplate && !lt(t) && !wt(t) && (t.layout ?? "normal") === "normal" && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") && G(t).land)
    return {
      url: re(G(t)).frame,
      geometry: JSON.stringify(H.frame)
    };
  if (!xe(t)) return;
  if (lt(t))
    return {
      url: me(t),
      geometry: JSON.stringify(Wr(t)),
      mask: fn(t)
    };
  const e = cs(t);
  return e?.family === "components" ? { url: e.frame, geometry: JSON.stringify(e.rect) } : void 0;
}
function Fc(t) {
  if (!xe(t)) return {};
  const e = gs(t), r = e && ((G(t).legendary ? void 0 : ns[e.key]) ?? un[e.key] ?? Gn[e.key]), n = r && r.source === e?.source && (r.legendary === void 0 || r.legendary === G(t).legendary) ? r.materials : {}, o = re(G(t)), s = Ze(t) ? { url: o.frame, geometry: JSON.stringify(H.frame) } : void 0;
  return dn(t, n, s).materials;
}
const Vs = {
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
function Wc(t, e) {
  if (e.watermark) return e.watermark;
  if (t.watermark) return t.watermark;
  const r = [...new Set(t.faces?.map((s) => s.watermark).filter(Boolean))];
  if (r.length !== 1) return e.watermark;
  const n = Vs[r[0]], o = new Set(t.faces?.flatMap(F));
  return n && o.size === 2 && n.every((s) => o.has(s)) ? r[0] : e.watermark;
}
function Ho(t) {
  return t.watermark && Object.hasOwn(Vs, t.watermark) ? `${W}/img/watermarks/guild-${t.watermark}.svg` : null;
}
function $d(t, e) {
  return `${gd}/magic-new-split${t ? "-fuse" : ""}.mse-style/multicolor_blend_card${t ? e + 1 : ""}.png`;
}
function _c(t, e, r, n) {
  if (e === "m15") return [...dd(t), Ho(t)];
  const o = F(t);
  return [
    Mn(t, e, r, n),
    Ho(t),
    ...e === "eighth" && o.length === 2 ? [
      $d(r, n),
      ...o.map(
        (s) => Mn({ ...t, colors: [s], frameColors: void 0 }, e, r, n)
      )
    ] : [],
    ...e === "eighth" && t.artist ? [`${W}/img/manaSymbols/brush.svg`] : []
  ];
}
const si = /* @__PURE__ */ new WeakMap();
function Pd(t) {
  const e = si.get(t);
  if (e) return e;
  const r = $();
  r.width = t.width, r.height = t.height;
  const n = r.getContext("2d", { willReadFrequently: !0 });
  n.drawImage(t, 0, 0);
  const o = n.getImageData(0, 0, r.width, r.height);
  for (let s = 0; s < o.data.length; s += 4) o.data[s + 3] = o.data[s];
  return n.putImageData(o, 0, 0), si.set(t, r), r;
}
const ai = /* @__PURE__ */ new WeakMap();
function Uc(t, e, r, n, o) {
  const s = (b) => {
    const v = o.get(b);
    if (!v) throw Error(`Split asset unavailable: ${b}`);
    return v;
  }, a = s(Mn(t, e, r, n)), i = F(t);
  if (e !== "eighth" || i.length !== 2) return a;
  "WUBRG".indexOf(i[1]) - "WUBRG".indexOf(i[0]) > 2 && i.reverse();
  const [l, d] = i.map(
    (b) => s(
      Mn({ ...t, colors: [b], frameColors: void 0 }, e, r, n)
    )
  ), u = s($d(r, n)), h = i.join(""), m = ai.get(a) ?? /* @__PURE__ */ new Map();
  ai.set(a, m);
  const c = m.get(h);
  if (c?.left === l && c.right === d && c.mask === u) return c.canvas;
  const g = $();
  g.width = a.width, g.height = a.height;
  const f = $();
  f.width = a.width, f.height = a.height;
  const p = g.getContext("2d"), w = f.getContext("2d");
  w.drawImage(d, 0, 0), w.globalCompositeOperation = "destination-in";
  const y = w.createLinearGradient(0, 0, a.width, 0);
  return y.addColorStop(0, "#0000"), y.addColorStop(0.4, "#0000"), y.addColorStop(0.6, "#000"), y.addColorStop(1, "#000"), w.fillStyle = y, w.fillRect(0, 0, a.width, a.height), p.drawImage(l, 0, 0), p.drawImage(f, 0, 0), p.globalCompositeOperation = "destination-in", p.drawImage(Pd(u), 0, 0), p.globalCompositeOperation = "destination-over", p.drawImage(a, 0, 0), p.globalCompositeOperation = "source-over", f.width = f.height = 0, m.set(h, { left: l, right: d, mask: u, canvas: g }), g;
}
const ii = /* @__PURE__ */ new WeakMap();
function Dc(t, e, r, n) {
  const o = Ho(e);
  if (!o) return;
  const s = r.get(o);
  if (!s) throw Error(`Split watermark unavailable: ${o}`);
  const a = F(e), i = a.length === 1 ? [a[0], a[0]] : Vs[e.watermark], l = i.join(""), d = ii.get(s) ?? /* @__PURE__ */ new Map();
  ii.set(s, d);
  let u = d.get(l);
  if (!u) {
    u = $(), u.width = s.width, u.height = s.height;
    const f = u.getContext("2d");
    f.drawImage(s, 0, 0), f.globalCompositeOperation = "source-in";
    const p = {
      W: "#b39f4d",
      U: "#718dac",
      B: "#998795",
      R: "#b6723f",
      G: "#69936e"
    }, [w, y] = i, b = f.createLinearGradient(0, 0, u.width, 0);
    b.addColorStop(0, p[w]), b.addColorStop(0.499, p[w]), b.addColorStop(0.5, p[y]), b.addColorStop(1, p[y]), f.fillStyle = b, f.fillRect(0, 0, u.width, u.height), d.set(l, u);
  }
  const h = e.layout?.startsWith("split-m15") ?? !1, m = Math.min(
    (h ? 135 : 110) / s.width,
    (h ? 125 : e.setCode?.toLowerCase() === "dgm" ? 75 : 100) / s.height
  ), c = s.width * m, g = s.height * m;
  t.save(), t.globalAlpha = 0.3, t.drawImage(u, (h ? 199.5 : 177) - c / 2, n - g / 2, c, g), t.restore();
}
function jt(t) {
  if (t.frameTemplate) return [];
  if (!["split", "aftermath"].includes(t.layout ?? "") || t.faces?.length !== 2) return [];
  const e = Pe(t), r = Vt(t), n = r === "m15" ? Cn : fd;
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
      watermark: r ? Wc(t, o) : o.watermark,
      layout: e ? s === 0 ? "aftermath-top" : "aftermath-bottom" : r ? `split-${r}${nr(t) && r !== "old" ? "-fuse" : ""}` : "split-half",
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
    return e ? s === 0 ? { face: i, x: 0, y: 0, width: 488, height: Be, rotation: 0 } : {
      face: i,
      x: 488,
      y: Be,
      width: ud,
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
      y: (s ? 333 : 648) - (Zs(t) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function s2(t) {
  return {
    left: `${t.x / x * 100}%`,
    top: `${t.y / I * 100}%`,
    width: `${t.width / x * 100}%`,
    height: `${t.height / I * 100}%`,
    transform: `rotate(${t.rotation}deg)`
  };
}
function Gd(t, e) {
  t.translate(e.x, e.y), t.rotate(e.rotation * Math.PI / 180), t.scale(e.width / x, e.width / x);
}
function li(t, e) {
  const r = e[0] * t.width, n = e[1] * t.height, o = e[2] * t.width, s = e[3] * t.height;
  return t.rotation === -90 ? [
    (t.x + n) / x,
    (t.y - r - o) / I,
    s / x,
    o / I
  ] : t.rotation === 90 ? [
    (t.x - n - s) / x,
    (t.y + r) / I,
    s / x,
    o / I
  ] : [(t.x + r) / x, (t.y + n) / I, o / x, s / I];
}
function Nc(t) {
  return t.layout === "split-half" || t.layout === "aftermath-bottom" ? 1.5 : 1;
}
const Zs = nr;
function Pr(t) {
  if (lt(t) || t.frameAssetFamily === "eighth" || t.frameTemplate === "future" || t.frameTemplate === "flip")
    return !1;
  const e = Vt(t);
  return !e || e === "m15" || Pe(t);
}
function jc(t) {
  if (!Pr(t)) return { shared: [], stock: [] };
  const e = (o) => ({ shared: [], stock: o }), r = wt(t);
  if (r)
    return e(
      r ? [r.frame, ...r.rightFrame ? [r.rightFrame] : [], r.border] : []
    );
  if (t.frameTemplate === "battle") {
    const o = Fs(t);
    return e(o?.kind === "battle" ? [o.border] : []);
  }
  if (Ur(t))
    return e(
      ce(t) ? F(t).map((o) => `${$e}/${o.toLowerCase()}.png`) : [Tn(t)]
    );
  if (Dn(t)) return e([Xe(t)]);
  if (Pe(t))
    return e(cd(t).filter((o) => o.includes("/aftermath/")));
  if (Vt(t) === "m15")
    return e(
      jt(t).flatMap(
        (o) => dd(o.face).filter((s) => /\/[wubrgma]\.png$/.test(s))
      )
    );
  if (Q(t) === "saga") return e([Ns(t)]);
  const n = re(G(t), Q(t));
  return {
    shared: [
      n.frame,
      n.background,
      n.boxes,
      n.pt,
      ...G(t).legendary ? [n.crown] : []
    ],
    stock: []
  };
}
const zc = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Jr = "#16130e", Yc = [22 / 255, 19 / 255, 14 / 255];
function Qs(t) {
  const e = Ht(t), r = e.calibration, n = { ...e, calibration: r === "printing" ? r : void 0 }, o = typeof r == "object", s = o && r.profile === "8ed-eighth";
  if (o && (s ? !On(e) : !Pr(e)))
    throw Error(
      s ? "8ED calibration requires an ordinary Eighth frame." : "M21 calibration requires a modern frame."
    );
  const a = ot(n), i = nt(n), l = a?.inheritedFrom ? ps(n) : void 0, d = wt(n), u = n.colorCalibration === "set-hsb-v1" ? ne(n) : void 0, h = n.colorCalibration === "set-hsb-v1" && a && (n.borderColor ?? "black") === "black" ? Jr : void 0, m = r === "source" || u ? void 0 : qo(n), c = r === "source" ? void 0 : (d ? lr(n, d.frame) : void 0) ?? (u ? Jr : m ?? h), g = r === "source" ? {} : oi(n), f = !o || s || !!u || !!(a && !l), p = f ? { ...g } : {}, w = [];
  if (a?.inheritedFrom && r !== "source")
    for (const v of Object.keys(p))
      !l?.[v] && (u?.[v] || a.componentMaterials?.[v]) && w.push(v);
  let y = f ? c : void 0, b = !!(a?.inheritedFrom && (u || h && !m) && y && r !== "source");
  if (i?.inheritedFrom && r !== "source") {
    const v = oi({ ...n, calibration: "printing" });
    for (const S of Object.keys(nd(n) ?? {}))
      v[S] || w.push(S);
    b = !!(y && !qo({ ...n, calibration: "printing" }));
  }
  if ((r === "auto" || o || h && a?.inheritedFrom) && Pr(e)) {
    const v = jc(e), S = G(e), k = {
      name: "",
      setCode: "M21",
      frameStyle: "modern",
      layout: "normal",
      typeLine: S.land ? "Land" : S.artifact ? "Artifact" : "Creature",
      colors: e.colors,
      frameColors: e.frameColors,
      land: S.land,
      artifact: S.artifact,
      legendary: S.legendary,
      colorCalibration: "set-hsb-v1"
    }, M = new Set(v.shared);
    for (const [C, T] of Object.entries(
      Fc(k)
    ))
      !M.has(C) || p[C] || (p[C] = T, w.push(C));
    if (!y && It(e.setCode, e.borderColor).border === "#090806" && (y = Jr, b = !0), b && !u && y === Jr)
      for (const C of v.stock)
        p[C] = { ...p[C] ?? zc, outerStock: Yc };
  }
  return {
    face: e,
    materials: p,
    measured: g,
    border: y,
    fallbackStock: b,
    fallbackAssets: w,
    fallbackProfile: i?.inheritedFrom ? "8ed-eighth" : "m21-modern",
    assets: re(G(e)),
    explicitProfile: o
  };
}
const Fd = (t) => Qs(t).materials, Ft = (t) => Qs(t).border, Xo = (t, e) => {
  const r = Ht(t);
  return r.calibration === "source" ? void 0 : Bd(r, e);
};
function xn(t, e, r = 1, n = 1, o = 0) {
  const s = t.illustrationPlacement;
  if (!s) return e;
  if (!s.every(Number.isFinite) || s[2] <= 0 || s[3] <= 0)
    throw Error("Artwork placement requires finite coordinates and positive dimensions");
  return o === -90 ? Sn(s) : [s[0] * r, s[1] * n, s[2] * r, s[3] * n];
}
function Rn(t, e, r, n) {
  return ts(t, e, r, n);
}
function qc(t, e, r, n, o) {
  const s = [n[0] * t, n[1] * e, n[2] * t, n[3] * e];
  return [...s, ...Rn(s[2], s[3], r, o)];
}
function Wd(t) {
  return t.faces?.length || t.layout && !["normal", "token", "transform", "modal_dfc", "reversible_card", "meld"].includes(
    t.layout
  ) || t.frameTemplate && t.frameTemplate !== "future" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? "") ? {
    modes: [],
    reason: "Art placement currently requires an ordinary physical face or Futureshifted template."
  } : {
    modes: t.frameTemplate === "future" && t.futureTreatment !== "full-art" ? ["window", "behind-text"] : ["window"]
  };
}
function ta(t) {
  const e = t.artPlacement;
  if (e !== void 0) {
    if (!e || typeof e != "object" || Array.isArray(e))
      throw Error("Invalid artwork placement");
    if (Object.keys(e).some((r) => !["mode", "focalPoint", "zoom", "paperOpacity"].includes(r)))
      throw Error("Unknown artwork placement option");
    if (!Wd(t).modes.includes(e.mode))
      throw Error("This frame does not support the selected art placement.");
    if (e.paperOpacity !== void 0 && (e.mode !== "behind-text" || !Number.isFinite(e.paperOpacity) || e.paperOpacity < 0 || e.paperOpacity > 1))
      throw Error("Paper opacity requires behind-text mode and a value within 0..1");
    ts(1, 1, [0, 0, 1, 1], e);
  }
}
function Hc(t, e) {
  const { illustrationPlacement: r, ...n } = t, o = { ...n, artPlacement: structuredClone(e) };
  return ta(o), o;
}
function a2(t, e, r) {
  if (ta(t), !Number.isFinite(e) || !Number.isFinite(r) || e <= 0 || r <= 0)
    throw Error("Artwork dimensions must be positive");
  const n = t.illustrationCrop ?? [0, 0, 1, 1], o = Yt(t).art, s = t.frameTemplate === "battle", a = s ? xn(t, Sn(o), 523, 375, -90) : xn(
    t,
    [o[0] * 488, o[1] * 680, o[2] * 488, o[3] * 680],
    488,
    680
  ), i = ts(e * n[2], r * n[3], a, t.artPlacement);
  return {
    source: n,
    destination: s ? Ps(i) : [i[0] / 488, i[1] / 680, i[2] / 488, i[3] / 680],
    aperture: o
  };
}
const Je = {
  fontSize: 19.5,
  fontFamily: '"CardRenderer MTG Beleren", Georgia',
  fontWeight: 700,
  ink: "#fff",
  numeralOffsetX: -0.5,
  numeralOffsetY: { plus: -0.25, zero: -3.25, minus: -4.5 },
  horizontalInset: 10,
  widthScale: 0.97
};
function Xc(t, e, [r, n, o, s], a) {
  _d(
    t,
    e,
    24,
    r + o / 2,
    n + s / 2 + 2.5,
    o * 0.72,
    1,
    a
  );
}
function ea(t, e) {
  return e?.[(t.match(/[0-9]/g)?.length ?? 0) > 1 ? "wideCost" : "cost"];
}
function Jc(t, e, r) {
  const n = t.startsWith("+") ? "plus" : t === "0" ? "zero" : "minus";
  return e + Je.numeralOffsetY[n] + (ea(t, r)?.dy ?? 0);
}
function Kc(t, e, [r, n, o, s], a) {
  const i = ea(e, a), l = Je, d = l.numeralOffsetY[e.startsWith("+") ? "plus" : e === "0" ? "zero" : "minus"];
  _d(
    t,
    e,
    l.fontSize,
    r + o / 2 + l.numeralOffsetX,
    n + s / 2 + d,
    o - l.horizontalInset,
    l.widthScale,
    i
  );
}
function _d(t, e, r, n, o, s, a, i) {
  if (!i) {
    di(t, e, r, n, o, s, a);
    return;
  }
  t.save(), i.fractionalMetrics && (t.textRendering = "geometricPrecision", t.fontKerning = "normal");
  const l = n + i.dx;
  t.translate(l, 0), t.scale(i.width, 1);
  const d = i.font === "beleren-2016" ? '"CardRenderer MTG Beleren 2016", Georgia' : Je.fontFamily;
  di(
    t,
    e,
    r * i.size,
    0,
    o + i.dy,
    s / i.width,
    a,
    d
  ), t.restore();
}
function di(t, e, r, n, o, s, a = 1, i = Je.fontFamily) {
  t.save(), t.fillStyle = Je.ink, t.font = `${Je.fontWeight} ${r}px ${i}`, t.textAlign = "center", t.textBaseline = "alphabetic", t.letterSpacing = "0px", t.shadowColor = "transparent";
  const l = t.measureText(e), d = Math.min(s, l.width * a), u = Math.min(1, d / Math.max(1, l.width)), h = n + (l.actualBoundingBoxLeft - l.actualBoundingBoxRight) * u / 2, m = o + (l.actualBoundingBoxAscent - l.actualBoundingBoxDescent) / 2;
  t.fillText(e, h, m, d), t.restore();
}
function Jo(t, e) {
  const r = ot(e), n = r?.footer;
  if (n) {
    const d = { ...e.printingElements };
    for (const u of ["collector", "artist", "legal"]) {
      const h = e.printingElements?.[u], m = n[`${u}Offset`];
      d[u] = {
        ...h,
        offset: [(h?.offset?.[0] ?? 0) + m[0], (h?.offset?.[1] ?? 0) + m[1]]
      };
    }
    e = { ...e, printingElements: d };
  }
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.letterSpacing = `${n?.collectorTracking ?? 0}px`, t.fillStyle = It(e.setCode, e.borderColor).ink, t.textBaseline = "alphabetic", t.textAlign = "left", t.font = `${n?.collectorSize ?? 11}px "${n?.collectorFamily ?? "CardRenderer MTG Relay"}", sans-serif`, Z(t, e, "collector", () => {
    const d = ls(e);
    if (!n || !d) return t.fillText(d, 30, 645);
    const u = /^(\d{3}(?:\/\d+)?) ([CMRUL])$/.exec(d);
    if (!u) return t.fillText(d, 30, 645);
    t.fillText(u[1], 30, 645), t.fillText(u[2], n.collectorRarityX, 645);
  });
  const o = (e.collectorSetCode ?? e.setCode)?.trim().toUpperCase() ?? "", s = o ? `${o} • ${e.collectorLanguage?.toUpperCase() ?? "EN"}` : "";
  Z(t, e, "collector", () => {
    const d = r?.foilStarNumbers.includes(e.collectorNumber ?? "") && o === "M21" ? n?.collectorMarker : void 0;
    if (!d) return t.fillText(s, 30, 658);
    const u = o + " ", h = " " + (e.collectorLanguage?.toUpperCase() ?? "EN");
    t.fillText(u, 30, 658), t.fillText(h, 30 + t.measureText(u).width + t.measureText("•").width, 658);
    const m = t.measureText("★"), c = m.actualBoundingBoxLeft + m.actualBoundingBoxRight, g = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    if (!(c > 0 && g > 0)) throw Error("Modern collector marker has no glyph ink");
    t.save(), t.translate(d.center[0], d.center[1]), t.scale(d.size[0] / c, d.size[1] / g), t.fillText(
      "★",
      (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
      (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2
    ), t.restore();
  });
  const a = is(e), i = e.power != null && e.toughness != null || e.loyalty != null;
  let l = 30 + t.measureText(s).width + (s ? 7 : 0);
  Z(t, e, "artist", () => {
    e.artist && (t.letterSpacing = "0px", t.font = `${n?.artistSize ?? 11}px "CardRenderer MTG Artist Credit", sans-serif`, t.fillText("a", l, 658), l += t.measureText("a").width + 2, t.letterSpacing = `${n?.artistTracking ?? 0}px`, t.font = `700 ${n?.artistSize ?? 11}px "CardRenderer MTG Beleren Small Caps", Georgia`, t.fillText(e.artist, l, 658, Math.max(1, (a && i ? 272 : 456) - l)));
  }), a && (t.textAlign = "right", t.letterSpacing = `${n?.legalTracking ?? 0}px`, t.font = `${n?.legalSize ?? 10}px "CardRenderer MTG MPlantin", Georgia`, Z(t, e, "legal", () => t.fillText(a, 456, i ? 658 : 645, 178))), t.restore();
}
const ui = /* @__PURE__ */ new WeakMap();
function Vc(t) {
  const e = ui.get(t);
  if (e) return e;
  const r = $();
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
    return ui.set(t, a), a;
  } finally {
    r.width = r.height = 0;
  }
}
function qt(t, e, r, n, o, s = [488, 680], a = 0) {
  const [i, l, d, u] = n, h = Q(e);
  if (t.save(), h.startsWith("planeswalker") && Qm(t, h === "planeswalker-large"), o === "printing") {
    t.clearRect(i, l, d, u), t.restore();
    return;
  }
  const m = r.get(e.illustration ?? "");
  if ((o === "artwork" || h.startsWith("planeswalker") || e.illustrationPlacement) && (t.fillStyle = m && e.illustrationPlacement ? Vc(m) : "#80745c", t.fillRect(i, l, d, u)), !m) {
    t.restore();
    return;
  }
  t.beginPath(), t.rect(i, l, d, u), t.clip();
  const c = xn(e, n, s[0], s[1], a);
  e.illustrationCrop ? t.drawImage(
    m,
    ...qc(
      m.width,
      m.height,
      c,
      e.illustrationCrop,
      e.artPlacement
    )
  ) : t.drawImage(
    m,
    ...Rn(m.width, m.height, c, e.artPlacement)
  ), t.restore();
}
const hi = /* @__PURE__ */ new WeakMap();
function nn(t) {
  const e = hi.get(t);
  if (e) return e;
  const r = $();
  r.width = t.width, r.height = t.height;
  const n = r.getContext("2d", { willReadFrequently: !0 });
  n.drawImage(t, 0, 0);
  const o = n.getImageData(0, 0, r.width, r.height);
  for (let s = 0; s < o.data.length; s += 4)
    o.data[s + 3] = Math.round(o.data[s] * o.data[s + 3] / 255), o.data[s] = o.data[s + 1] = o.data[s + 2] = 255;
  return n.putImageData(o, 0, 0), hi.set(t, r), r;
}
function Zc(t) {
  const e = kt(t) === "full-art", r = G(t), n = !e && (r.land || kt(t) === "regular" && !r.artifact && F(t).length === 0), [o, s, a, i] = e ? [0.9967, 0.9995, -2.125, -0.85] : n ? [0.9976, 0.997, -1.925, -0.3] : [0.9867, 0.9929, 0, -0.175], l = e || n ? [0, 680] : [0, 85, 370, 385, 416, 430, 610, 680], d = e || n ? [0, 0] : [0, 0, 1, 1, 1.45, 1.45, 0, 0];
  return {
    sx: o,
    tx: a,
    source: l,
    target: l.map((u, h) => 340 + (u - 340) * s + i + d[h])
  };
}
function Qc(t, e) {
  const r = $();
  r.width = t.width, r.height = t.height;
  const n = r.getContext("2d"), o = Zc(e), s = t.height / 680;
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
function Gr(t, e) {
  const r = $();
  return r.width = t, r.height = e, r;
}
function tg(t, e) {
  const r = Gr(t.width, t.height), n = r.getContext("2d"), o = Gr(t.width, t.height), s = o.getContext("2d");
  for (const [a, i] of [t, e].entries()) {
    s.clearRect(0, 0, o.width, o.height), s.globalCompositeOperation = "source-over", s.drawImage(i, 0, 0, o.width, o.height);
    const l = s.createLinearGradient(o.width * 0.4, 0, o.width * 0.6, 0);
    l.addColorStop(0, a ? "#0000" : "#000"), l.addColorStop(1, a ? "#000" : "#0000"), s.globalCompositeOperation = "destination-in", s.fillStyle = l, s.fillRect(0, 0, o.width, o.height), n.globalCompositeOperation = "lighter", n.drawImage(o, 0, 0);
  }
  return o.width = o.height = 0, r;
}
function eg(t, e) {
  const r = ge(t), n = Gr(976, 1360), o = n.getContext("2d"), s = (l) => {
    const d = e.get(l);
    if (!d) throw Error(`Futureshifted frame asset unavailable: ${l}`);
    return d;
  }, a = (l, d, u, h) => {
    if (!d) return s(l);
    const m = tg(s(l), s(d));
    if (u && h) {
      const c = m.getContext("2d");
      c.globalCompositeOperation = "destination-in", c.drawImage(nn(s(h)), 0, 0, m.width, m.height), c.globalCompositeOperation = "destination-over", c.drawImage(s(u), 0, 0, m.width, m.height);
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
      const l = kt(t) === "full-art";
      if (!l && kt(t) !== "clear") {
        const [, c, , g] = $s({ ...t, artPlacement: void 0 }).art;
        o.beginPath(), o.rect(0, c * 523 / 680, 375, g * 523 / 680), o.clip();
      }
      const [d, u, h, m] = l ? [37, 46, 322, 418] : [32, 44, 327, 310];
      o.drawImage(nn(s(r.mask)), d, u, h, m), o.restore();
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
        const l = Gr(156, 102), d = l.getContext("2d");
        d.drawImage(s(r.stats), 0, 0, 156, 102), d.globalCompositeOperation = "destination-in", d.drawImage(nn(s(r.statsMask)), 0, 0, 156, 102), i(l, 279, 454, 78, 51);
      } else r.paper ? o.drawImage(s(r.stats), 285, 452, 70, 52) : o.drawImage(s(r.stats), 375 * 0.7621, 523 * 0.8834, 375 * 0.1734, 523 * 0.0781);
    return Qc(n, t);
  } finally {
    n.width = n.height = 0;
  }
}
function rg(t, e) {
  const r = Gr(t.width, t.height), n = r.getContext("2d");
  return n.fillStyle = "white", kt(e) === "clear" || e.artPlacement?.mode === "behind-text" ? n.fillRect(46, 44, 442 * 2, 637 * 2) : (n.fillRect(48, 160, 444 * 2, (kt(e) === "full-art" ? 482 : 303) * 2), n.globalCompositeOperation = "destination-out", n.drawImage(t, 0, 0)), r;
}
function ng(t, e, r) {
  const [n, o, s, a] = r, i = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((l) => ({ role: "rules", runs: [{ text: l }] }));
  return P(
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
function og(t) {
  const e = nt(t);
  if (e) {
    if (t.wordingMode === "original" && !e.inheritedFrom) {
      const r = t.collectorNumber?.replace(/★$/, "") ?? "", n = e.originalRules[r], o = t.rulesParagraphs?.map((s) => s.runs.map((a) => a.text).join("")).join(`
`) ?? t.rulesText ?? "";
      if (n && o.replace(/\s/g, "") === n.text.replace(/\s/g, ""))
        return n.maximumSize;
    }
    return /\bLand\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? e.rules.landMaximumSize : e.rules.maximumSize;
  }
}
function sg(t, e, r, n) {
  const o = nt(t)?.rules.compact, s = t.rulesParagraphs?.length ?? (t.rulesText ?? "").split(`
`).filter(Boolean).length;
  if (!o || e.size >= o.minimumSize * r || s < o.minimumParagraphs || /\bLand\b/.test(t.canonicalTypeLine ?? t.typeLine ?? ""))
    return e;
  const a = n(o.leading);
  return !a.overflow && a.size >= o.minimumSize * r ? a : e;
}
const or = {
  ordinary: [0.436 * 488, 0.9034 * 680, 0.128 * 488, 0.0458 * 680],
  planeswalker: [0.4394 * 488, 0.9015 * 680, 0.1214 * 488, 0.051 * 680],
  saga: [213.7, 620.2, 60.5, 25.3],
  aftermath: [222, 623, 43, 20],
  split: [223.5, 620, 43, 21.5]
}, i2 = {
  ordinary: { size: [192, 96], interior: [29, 29, 134, 67] },
  planeswalker: { size: [182, 107], interior: [24, 26, 134, 67] },
  saga: { size: [186, 78], interior: [26, 11, 134, 67] },
  plain: { size: [134, 67], interior: [0, 0, 134, 67] }
};
function Ie(t) {
  if (!oe(t) || lt(t) || t.frameAssetFamily === "eighth" || t.frameTemplate || t.faces?.length || t.layout && !["normal", "planeswalker", "transform", "modal_dfc", "meld"].includes(t.layout))
    return null;
  const e = Q(t), r = e.startsWith("planeswalker");
  if (e !== "normal" && !r) return null;
  const n = G(t), o = n.boxes === "Gold" ? "M" : n.boxes === "Artifact" ? "A" : n.boxes === "Land" ? "L" : n.boxes === "Colourless" ? r ? "A" : "C" : n.boxes, s = F(t);
  s.length === 2 && "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 && s.reverse();
  const a = s.length > 2 ? ["M"] : s.length ? s : [o], i = (l) => r ? `${W}/img/frames/planeswalker/holo/${l.toLowerCase()}.png` : `${W}/img/frames/m15/holoStamps/m15HoloStamp${l}.png`;
  return {
    image: i(a[0]),
    ...a.length === 2 ? { rightImage: i(a[1]) } : {},
    rect: r ? or.planeswalker : or.ordinary
  };
}
function Ud(t, e, r) {
  const n = Ie(e);
  if (!n) return;
  const o = r.get(n.image);
  if (!o) throw Error("Authenticity stamp asset is unavailable.");
  t.save(), t.shadowColor = "transparent", t.drawImage(o, ...n.rect), t.restore();
}
const ag = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function ig(t) {
  return !ag.has(t?.trim().toLowerCase() ?? "");
}
function lg(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = wt(t);
  if (!(!e || !zt(t, e.frame)))
    return t.frameTreatment === "colorshifted" ? [0.7234, 0.881, 0.204, 0.0772] : [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814];
}
function dg(t, e, r) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return e;
  const n = wt(t);
  if (!n || !zt(t, n.frame) || !e.lines.length)
    return e;
  let o = 0;
  const s = e.lines.map((m, c) => {
    if (c) {
      const g = e.lines[c - 1], f = g.runs[0]?.size ?? e.size, p = m.baseline - g.baseline - f, w = g.role === "rules" && m.role === "flavor" ? 0.625 / 0.9 : 0.4375 / 0.45;
      o += f * (0.965 - 1) + p * (w - 1);
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
    (m) => r.exclusions?.some(([c, g, f, p]) => {
      const [w, y, b, v] = m.inkBounds;
      return w < c + f && w + b > c && y < g + p && y + v > g;
    })
  ) ? e : { ...e, x: e.x + 2.25, top: d, height: l, lines: h };
}
function ug(t, e, r, n, o) {
  if (e.setCode?.toLowerCase() !== "plc" || e.frameAssetFamily !== "eighth" || e.frameTemplate || e.layout && e.layout !== "normal" || n.size !== 24.5 || n.lines.length > 5)
    return n;
  const s = wt(e);
  if (!s || !zt(e, s.frame)) return n;
  const a = {
    leading: 0.965,
    paragraphGap: 0.4375,
    flavorGap: 0.625,
    flavorSeparator: !1
  }, i = { ...o, x: n.x }, l = (d) => r.some((u) => {
    if (u.runs.some((c) => c.text.includes(`
`))) return !1;
    const h = P(
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
    const u = P(t, r, i, d, d, a);
    if (!u.overflow && u.lines.length < n.lines.length && !l(d))
      return u;
  }
  return n;
}
function Dd(t, e, r = I, n = 1) {
  const o = !/\bPlaneswalker\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "") && e.layout !== "planeswalker" ? ot(e)?.rules : void 0, s = og(e), a = go(
    t,
    e,
    r,
    n,
    void 0,
    (s ?? 24.5) * n
  );
  return o ? go(
    t,
    e,
    r,
    n,
    o,
    o.capAtBaseSize ? a.size : (o.maximumSize ?? 24.5) * n,
    o.preserveLineCount && a.lines.length || void 0
  ) : sg(
    e,
    a,
    n,
    (i) => go(
      t,
      e,
      r,
      n,
      void 0,
      (s ?? 24.5) * n,
      void 0,
      { leading: i }
    )
  );
}
function go(t, e, r, n, o, s = 24.5 * n, a, i) {
  const l = Yt(e), d = lg(e), u = d ?? l.stats, h = {
    ...Ir,
    flavorGap: nt(e)?.rules.flavorGap ?? Ir.flavorGap,
    ...o ? {
      leading: o.leading,
      paragraphGap: o.paragraphGap,
      textWidth: o.textWidth,
      fractionalMetrics: o.fractionalMetrics,
      maximumLines: a
    } : {},
    ...i,
    flavorSeparator: e.frameAssetFamily === "eighth" ? !1 : ig(e.setCode)
  }, [m, c, g, f] = l.rules, p = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((C) => ({ role: "rules", runs: [{ text: C }] })), w = Ie(e), y = !e.frameAssetFamily || !!ne(e), b = {
    x: m * x + (y ? 3.5 : 0) + (o?.dx ?? 0) * n,
    y: c * r + (y ? 7 : 0),
    width: g * x - (y ? 9.5 : 0),
    height: f * r - (y ? 8 : 0),
    // Fit actual line ink around the existing power/toughness plate. Short
    // final lines can use the lower left area without being painted over.
    exclusions: [
      ...e.power != null && e.toughness != null ? [
        [
          u[0] * x - 2,
          u[1] * r - 2,
          u[2] * x + 4,
          u[3] * r + 4
        ]
      ] : [],
      ...w ? [
        [
          w.rect[0] - 1,
          (w.rect[1] - 1) * r / I,
          w.rect[2] + 2,
          (w.rect[3] + 2) * r / I
        ]
      ] : []
    ]
  }, v = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? p : p, S = nt(e)?.rules.shortCenterLines ?? (["10e", "m10", "m11", "m12", "m13", "m14"].includes(e.setCode?.toLowerCase() ?? "") ? 3 : void 0);
  if (e.rulesAlignment?.mode !== "left" && S !== void 0 && v.every((C) => C.role === "rules")) {
    const C = hr(
      t,
      p,
      v,
      b,
      s,
      15 * n,
      S,
      { ...h, balanceLines: !0 }
    );
    if (C) return C;
  }
  const k = e.rulesAlignment?.mode === "left" ? p.map((C) => C.role === "rules" ? { ...C, align: "left" } : C) : p;
  let M = P(t, k, b, s, 15 * n, h);
  return M.overflow && d && (M = P(t, k, b, M.size, 12 * n, h)), ug(
    t,
    e,
    k,
    dg(e, M, b),
    b
  );
}
function $t(t, e, r, n = mt, o = 0, s = "#17140f") {
  if (!fe(t)) return;
  if (e.overflow) throw Error("Magic rules text does not fit the available area.");
  t.save(), e.fractionalMetrics && (t.textRendering = "geometricPrecision", t.fontKerning = "normal"), e.horizontalScale && t.scale(e.horizontalScale, 1), t.textAlign = "left", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
  for (const l of e.separators) {
    const d = t.createLinearGradient(e.x, l, e.x + e.width, l);
    d.addColorStop(0, "#17140f00"), d.addColorStop(0.15, "#17140f55"), d.addColorStop(0.85, "#17140f55"), d.addColorStop(1, "#17140f00"), t.fillStyle = d, t.fillRect(e.x, l, e.width, 0.6);
  }
  t.fillStyle = s;
  const a = o > 0 ? $() : null;
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
        l.baseline - u.size * 0.72 + u.size * 0.8 * (e.symbolOffsetY ?? 0),
        u.size * 0.8,
        r
      ) : (i.font = Fo(u.size, u.italic), mi(i, u, d, l.baseline, !1)), d += u.width;
  }
  if (a) {
    i.globalCompositeOperation = "destination-out", i.lineJoin = "round";
    for (const l of e.lines) {
      let d = l.x ?? e.x;
      for (const u of l.runs)
        u.symbol || (i.font = Fo(u.size, u.italic), i.lineWidth = u.size * o * 2, mi(i, u, d, l.baseline, !0)), d += u.width;
    }
    t.resetTransform(), t.drawImage(a, 0, 0), a.width = a.height = 0;
  }
  t.restore();
}
function mi(t, e, r, n, o) {
  const s = e.textWidth ?? 1;
  if (s === 1) {
    o ? t.strokeText(e.text, r, n) : t.fillText(e.text, r, n);
    return;
  }
  t.save(), t.translate(r, n), t.scale(s, 1), o ? t.strokeText(e.text, 0, 0) : t.fillText(e.text, 0, 0), t.restore();
}
function hg(t) {
  const e = kt(t);
  if (t.setCode?.toLowerCase() !== "fut" || e === "clear") return;
  const r = st(t), n = Y.CONJURER_ROOT + "/img/setSymbols/official/fut-";
  if (!["c", "u", "r"].some((l) => r === n + l + ".svg")) return;
  const [o, s, a, i] = e === "full-art" ? [443.5625, 581.8125, 28.1875, 20.976866533333336] : ge(t).base.includes("/future/regular/futureFrame") ? [443.5, 405.125, 29, 21.851866533333336] : [443.5, 405.5, 27.875, 22.226866533333336];
  return [o - a / 2, s - i / 2, a, i];
}
function mg(t, e, r, n, o) {
  od(e);
  const s = eg(e, r), a = rg(s, e), i = $s(e), l = ge(e), d = G(e), u = sd(e);
  t.save();
  try {
    if (!n) {
      const k = Ft(e);
      t.fillStyle = k ?? "#080808", t.fillRect(0, 0, 488, 680), k && (t.fillStyle = "#080808", t.fillRect(17, 17, 454, 646));
    }
    if (o && t.drawImage(o, 0, 0, 488, 680), n !== "printing") {
      const k = $();
      k.width = 976, k.height = 1360;
      try {
        const M = k.getContext("2d");
        M.scale(2, 2);
        const C = kt(e) === "clear" ? [23, 22, 442, 637] : i.art;
        qt(M, e, r, C, "artwork"), M.globalCompositeOperation = "destination-in", M.drawImage(a, 0, 0, 488, 680), t.drawImage(k, 0, 0, 488, 680);
      } finally {
        k.width = k.height = 0;
      }
    }
    if (n === "artwork") return;
    t.drawImage(s, 0, 0, 488, 680), l.typeSymbol && t.drawImage(r.get(l.typeSymbol), 31.2, 31.2, 27.3, 26), t.shadowColor = "transparent", Z(t, e, "manaCost", () => Pm(t, e, r));
    const h = u.length === 1 && u[0] !== "W", m = (k, M, C, T, R = !1) => {
      t.textAlign = "left", t.textBaseline = "middle", ct(
        t,
        k,
        M[0] + 1.25,
        M[1] + M[3] / 2 + T,
        M[2],
        C,
        !0,
        1,
        "CardRenderer MTG Matrix",
        0,
        R ? e.textInk : void 0
      );
    };
    t.fillStyle = h ? "#fff" : "#111", m(e.name, i.title, 30.248, 1.25), m(e.typeLine ?? "", i.type, 24.969, -1.5, !0);
    const c = d.land && u.length === 2 && !u.includes("W") ? "#fff" : "#111";
    kt(e) !== "full-art" && $t(t, ng(t, e, i.rules), r, void 0, 0, c), e.power != null && e.toughness != null && (t.fillStyle = h ? "#fff" : "#111", t.textAlign = "center", t.textBaseline = "middle", t.font = '700 29.97px "CardRenderer MTG Matrix Small Caps"', t.save(), t.translate(i.stats[0] + i.stats[2] / 2 - 1.5, i.stats[1] + i.stats[3] / 2 - 0.25), t.scale(0.99, 1), bt(t, `${e.power}/${e.toughness}`, 0, 0, i.stats[2] / 0.99, e.textInk), t.restore());
    const g = r.get(st(e) ?? "");
    Z(t, e, "setSymbol", () => {
      if (g) {
        const [k, M, C, T] = i.symbol, R = Math.min(C / g.width, T / g.height), A = hg(e) ?? [
          k + (C - g.width * R) / 2,
          M + (T - g.height * R) / 2,
          g.width * R,
          g.height * R
        ];
        t.drawImage(g, A[0], A[1], A[2], A[3]);
      }
    }), t.fillStyle = d.land || h ? "#fff" : "#111", t.textAlign = "right", t.textBaseline = "alphabetic";
    const f = e.power != null && e.toughness != null ? 361 : 442, p = kt(e) === "full-art", w = p ? 16.6 : 17.845, y = p ? 627 : 626.5;
    t.font = `400 ${w}px "CardRenderer MTG Matrix"`;
    const b = e.artist ?? "";
    Z(t, e, "artist", () => {
      t.fillText(b, f, y, f - 70);
      const k = l.brush ? r.get(l.brush) : void 0;
      k && t.drawImage(k, f - t.measureText(b).width - 40, y - 10, 36, 8);
    });
    const v = is(e), S = ls(e, !1);
    if (v || S) {
      t.font = '11.804px "CardRenderer MTG MPlantin"';
      const k = [v, S].filter(Boolean).join(" ");
      if (!e.printingElements?.legal?.offset && !e.printingElements?.collector?.offset)
        t.fillText(k, f - 0.25, 641.25, f - 40);
      else {
        const M = t.measureText(k).width, C = Math.min(1, (f - 40) / Math.max(1, M));
        t.save(), t.translate(f - 0.25, 641.25), t.textAlign = "left";
        const T = (R, A) => {
          t.save(), t.scale(C, 1), t.fillText(R, A, 0), t.restore();
        };
        v && Z(t, e, "legal", () => T(v, -M)), S && Z(
          t,
          e,
          "collector",
          () => T(S, -t.measureText(S).width)
        ), t.restore();
      }
    }
  } finally {
    s.width = s.height = a.width = a.height = 0, t.restore();
  }
}
const sr = 96 / 72;
function Er(t, e, r, n, o, s) {
  const [a, i, l, d] = r;
  t.textAlign = "left", t.textBaseline = "middle", ct(
    t,
    e,
    a,
    i + d / 2,
    l,
    n * sr,
    o !== "CardRenderer MTG Matrix",
    1,
    o,
    0,
    s
  );
}
function Nd(t, e, r, n, o, s) {
  const a = e.manaSymbols ?? [], i = s + 1;
  return a.forEach(
    (l, d) => mt(t, l, n - a.length * i + d * i, o, s, r, !0)
  ), a.length * i;
}
function jd(t, e, r, n, o, s, a = "#17140f") {
  if (!fe(t)) return;
  const [i, l, d, u] = n, h = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((c) => ({ role: "rules", runs: [{ text: c }] })), m = P(t, h, { x: i, y: l, width: d, height: u }, o * sr, s * sr, {
    leading: 0.95,
    paragraphGap: 0.4,
    flavorGap: 0.5,
    flavorOrphans: !1
  });
  if (m.overflow) throw Error("Standard template text exceeds its minimum readable size.");
  $t(t, m, r, void 0, 0, a);
}
function zd(t, e, r, n, o) {
  if (e.power == null || e.toughness == null) return;
  const [s, a, i, l] = r;
  t.font = `bold ${n * sr}px "${o}", Georgia`, t.textAlign = "center", t.textBaseline = "middle", bt(t, `${e.power}/${e.toughness}`, s + i / 2, a + l / 2, i, e.textInk);
}
function Yd(t, e, r, n) {
  const [o, s, a] = r;
  t.fillStyle = n, t.textAlign = "left", t.textBaseline = "top", t.font = `${10 * sr}px "CardRenderer MTG Matrix", Georgia`, t.fillText(e.artist ?? "", o, s, a), e.legalText && (t.font = `${6.5 * sr}px "CardRenderer MTG MPlantin", Georgia`, t.fillText(e.legalText, o, s + 14, a));
}
const ci = [
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
function cg(t, e, r, n, o) {
  if (e.faces?.length !== 2) throw Error("A flip template needs exactly two printed panels.");
  const s = e.faces[0], a = e.faces[1];
  if (o !== "artwork")
    for (const [m, c] of [n.base, n.reverse].entries()) {
      const g = r.get(c);
      if (!g) throw Error(`Flip frame unavailable: ${c}`);
      t.save(), m && (t.beginPath(), t.rect(0, 344, 375, 179), t.clip()), t.drawImage(g, 0, 0, 375, 523), t.restore();
    }
  if (qt(t, e, r, [32, 162, 311, 182], o), o === "artwork") return;
  for (const [m, c, g] of [
    [n.stats, n.statsMask, [285, 123, 70, 38]],
    [n.reverseStats, n.reverseStatsMask, [18, 342, 70, 38]]
  ]) {
    if (!m || !c) continue;
    const f = r.get(m), p = r.get(c);
    if (!f || !p) throw Error("Missing flip statistics plate");
    const w = $();
    w.width = 140, w.height = 76;
    const y = w.getContext("2d");
    y.drawImage(f, 0, 0, 140, 76), y.globalCompositeOperation = "destination-in", y.drawImage(nn(p), 0, 0, 140, 76), t.drawImage(w, g[0], g[1], g[2], g[3]), w.width = w.height = 0;
  }
  t.shadowColor = "transparent", t.fillStyle = "#17140f";
  const i = "CardRenderer MTG Matrix", l = (m, c, g, f, p) => {
    const w = Nd(t, m, r, c[0] + c[2], c[1] + 1, 15);
    Er(
      t,
      m.name,
      [c[0], c[1], Math.max(1, c[2] - w - 4), c[3]],
      17,
      i
    ), Er(
      t,
      m.typeLine ?? "",
      [f[0], f[1], f[2] - (m.power != null ? 60 : 0), f[3]],
      14,
      i,
      m.textInk
    ), jd(t, m, r, g, 14, 8), zd(t, m, p, 17, i);
  }, d = ci[0], u = ci[1];
  l(s, d.title, d.rules, d.type, d.stats), t.save(), t.translate(375, 523), t.rotate(Math.PI), l(a, u.title, u.rules, u.type, u.stats), t.restore();
  const h = r.get(st(e) ?? "");
  if (h) {
    const m = Math.min(44 / h.width, 22 / h.height);
    t.drawImage(h, 353 - h.width * m, 482, h.width * m, h.height * m);
  }
  Yd(t, e, [58, 479, 217, 26], "#17140f");
}
function gg(t, e, r, n, o) {
  const s = e.frameTemplate;
  if (!s) throw Error("Missing standard template");
  if (s === "future") return mg(t, e, r, n, o);
  const a = Gs[s], i = (u) => {
    const h = r.get(u);
    if (!h) throw Error(`Standard template asset unavailable: ${u}`);
    return h;
  }, l = Fs(e);
  if (!l) throw Error("Missing template assets");
  const d = i(l.base);
  t.save();
  try {
    if (n !== "artwork" && (t.fillStyle = Ft(e) ?? "#090806", t.fillRect(0, 0, 488, 680)), o && t.drawImage(o, 0, 0, 488, 680), s === "battle" ? (t.translate(0, 680), t.rotate(-Math.PI / 2), t.scale(680 / 523, 488 / 375)) : t.scale(488 / 375, 680 / 523), l.kind === "flip") {
      cg(t, e, r, l, n);
      return;
    }
    if (l.kind !== "battle") throw Error("Unexpected standard template branch");
    if (n !== "artwork" && t.drawImage(i(l.texture), 0, 0, 523, 375), qt(t, e, r, a.art, n, a.size, -90), n === "artwork") return;
    t.drawImage(d, 0, 0, a.size[0], a.size[1]), t.drawImage(i(l.border), 0, 0, 523, 375), e.defense != null && t.drawImage(i(l.defense), 459, 322, 64, 52), t.shadowColor = "transparent", t.fillStyle = "#17140f";
    const u = "CardRenderer MTG Beleren";
    let h = a.title;
    const m = Nd(t, e, r, 484, 20, 15);
    h = [h[0], h[1], Math.max(1, h[2] - m - 5), h[3]], Er(t, e.name, h, a.titleSize, u), Er(t, e.typeLine ?? "", a.type, a.typeSize, u, e.textInk), t.fillStyle = "#17140f", jd(t, e, r, a.rules, a.rulesSize, a.minimumSize), s === "battle" && e.defense != null ? (t.fillStyle = "white", Er(t, String(e.defense), a.stats, 17, u)) : zd(t, e, a.stats, 18, u);
    const c = Gm(t, e);
    c && (t.fillStyle = Lr.color, t.font = c.font, t.textAlign = "right", t.textBaseline = "alphabetic", t.letterSpacing = "0px", t.fillText(c.text, c.x, c.baseline));
    const g = r.get(st(e) ?? "");
    if (g) {
      const [f, p, w, y] = a.symbol, b = Math.min(w / g.width, y / g.height);
      t.drawImage(
        g,
        f + w - g.width * b,
        p + (y - g.height * b) / 2,
        g.width * b,
        g.height * b
      );
    }
    Yd(t, e, a.footer, "white");
  } finally {
    t.restore();
  }
}
let gi, fi;
function fg(t) {
  return t.frameTemplate ? t.frameTemplate === "battle" ? t.reverseStats ? fi ??= it().load(Lr.font).then(() => {
  }).catch((e) => {
    throw fi = void 0, e;
  }) : Promise.resolve() : gi ??= Promise.all([
    it().load('400 24px "CardRenderer MTG Matrix"'),
    it().load('700 24px "CardRenderer MTG Matrix"'),
    it().load('700 24px "CardRenderer MTG Matrix Small Caps"')
  ]).then(() => {
  }).catch((e) => {
    throw gi = void 0, e;
  }) : Promise.resolve();
}
function pg(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = wt(t);
  if (!(!e || !zt(t, e.frame)))
    return { dx: 1.25, dy: -2.9375, scaleX: 1.005, scaleY: 0.99375 };
}
function yg(t, e, r) {
  if (!(t.setSymbol || !zt(t, e) || !["c", "u", "r"].some(
    (n) => r === `${W}/img/setSymbols/official/plc-${n}.svg`
  )))
    return [411, 388.75, 34, 25.5];
}
const bg = {
  scaleX: 1.01,
  scaleY: 1.01,
  numberScale: 0.98,
  numberDx: -0.25
};
function wg(t) {
  const e = gh(t);
  if (e) return e;
  const r = pg(t);
  if (r) return r;
  const n = nt(t)?.mana.transform;
  if (n) {
    const i = Object.fromEntries(
      Object.entries(n.glyphs ?? {}).filter(([l]) => {
        const d = Qt(t, l);
        return !d || d === "modern";
      })
    );
    return { ...n, glyphs: i };
  }
  const o = t.setCode?.toLowerCase() ?? "";
  if (El(t)) {
    const i = (t.manaSymbols?.length ?? 0) > 0 ? ot(t)?.mana : void 0;
    return {
      ...bg,
      ...i ? Te(t) ? i.walker : i.normal : m0[o]
    };
  }
  const s = h0[o], a = ["lea", "leb", "3ed", "arn", "atq", "drk"].includes(o);
  if (!(!s || o === "3ed" && !bs(t) || t.frameTemplate !== void 0 || /^Level up\b/m.test(t.rulesText ?? "") || (t.layout ?? "normal") !== "normal" || (t.legendary ?? /\bLegendary\b/.test(t.typeLine ?? "")) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || St(t) !== (["3ed", "8ed"].includes(o) ? "white" : "black") || a && (!lt(t) || t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle") || o === "8ed" && (lt(t) || t.frameAssetFamily !== "eighth")))
    return Fr(t) === "dark" ? { ...s, numberScale: 0.87, numberDx: -0.25, numberDy: -0.25 } : s;
}
function jn(t) {
  const e = t.symbolAdjustment?.mana, r = wg(t);
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
class Nr {
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
const qd = new Nr(16 * 1024 * 1024), ra = new Nr(8 * 1024 * 1024), Hd = new Nr(64 * 1024 * 1024), l2 = () => {
  Hd.clear(), qd.clear(), ra.clear();
}, pi = /* @__PURE__ */ new WeakMap();
let yi = 0;
function Ke(t) {
  const e = pi.get(t);
  if (e !== void 0) return e;
  if (yi >= Number.MAX_SAFE_INTEGER)
    throw Error("Material bitmap identity space exhausted");
  const r = ++yi;
  return pi.set(t, r), r;
}
function vg(t) {
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
const Sg = new Nr(16 * 1024 * 1024), bi = /* @__PURE__ */ new WeakMap();
let Cg = 0;
async function kg(t, e, r) {
  const n = jn(t), o = Al(t), s = mh(t), a = !s && (!!o || !!n && (!!(n.numberDx || n.numberDy) || (n.numberScale ?? 1) !== 1));
  if (!s && !o && !a && !n?.glyphs && !Object.keys(e.manaGlyphScales ?? {}).length)
    return { images: e, dispose() {
    } };
  const i = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), d = [
    .../* @__PURE__ */ new Set([...t.manaSymbols ?? [], ...Object.keys(e.manaGlyphScales ?? {})])
  ].flatMap((h) => {
    const m = Or(n, h), c = !!m && (!!(m.dx || m.dy) || (m.scale ?? 1) !== 1);
    if (!(/^\d+$/.test(h) && a) && !c && (e.manaGlyphScales?.[h] ?? 1) === 1)
      return [];
    const g = Bl(t, h), f = e.get(g ?? tr(h) ?? "");
    if (g && !f) throw Error("Modern cost numeral asset is missing.");
    if (!f) return [];
    let p = bi.get(f);
    return p || bi.set(f, p = ++Cg), [
      {
        symbol: h,
        source: f,
        identity: p,
        cost: g ? o : void 0,
        paperSample: Rl(t, h)
      }
    ];
  });
  let u = [];
  try {
    const h = d.map(({ source: g, identity: f, cost: p, paperSample: w }) => ({
      key: `numeral-v2:${f}:${p ? JSON.stringify(p) : "source"}${w ? ":" + w : ""}`,
      bytes: g.width * g.height * 8,
      build: () => Mg(g, p, w)
    })), m = new Map(h.map((g) => [g.key, g])), c = new Map([...m.keys()].map((g, f) => [g, f]));
    return u = await Sg.acquireMany([...m.values()], r), d.forEach(({ symbol: g, source: f }, p) => {
      (/^\d+$/.test(g) ? i : l).set(g, {
        image: u[c.get(h[p].key)].value,
        width: f.width,
        height: f.height
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
      dispose: () => u.forEach((g) => g.release())
    };
  } catch (h) {
    throw u.forEach((m) => m.release()), h;
  }
}
async function Mg(t, e, r) {
  const n = $();
  n.width = t.width, n.height = t.height;
  try {
    const o = n.getContext("2d", { willReadFrequently: !0 });
    if (!o) throw Error("Mana glyph preparation needs Canvas2D.");
    o.drawImage(t, 0, 0);
    const s = o.getImageData(0, 0, n.width, n.height), a = s.data, i = (Math.floor(t.height * 0.04) * t.width + Math.floor(t.width / 2)) * 4, l = r ? vg(a) : [a[i], a[i + 1], a[i + 2]];
    let d = i;
    for (let g = 0; g < a.length; g += 4)
      a[g + 3] === 255 && a[g] + a[g + 1] + a[g + 2] < a[d] + a[d + 1] + a[d + 2] && (d = g);
    const u = [a[d], a[d + 1], a[d + 2]], h = l.map((g, f) => g - u[f]), m = h.reduce((g, f) => g + f * f, 0);
    if (m < 100) throw Error("Mana asset has no separable glyph.");
    const c = new ImageData(new Uint8ClampedArray(a), t.width, t.height);
    for (let g = 0; g < a.length; g += 4) {
      if (e) for (let p = 0; p < 3; p++) c.data[g + p] = e.paper[p];
      if (a[g + 3] < 255) {
        a[g + 3] = 0;
        continue;
      }
      for (let p = 0; p < 3; p++) c.data[g + p] = e?.paper[p] ?? l[p];
      const f = Math.max(
        0,
        Math.min(1, h.reduce((p, w, y) => p + w * (l[y] - a[g + y]), 0) / m)
      );
      a[g + 3] = Math.round(a[g + 3] * f);
      for (let p = 0; p < 3; p++) a[g + p] = e?.ink[p] ?? u[p];
    }
    return n.width = t.width * 2, o.putImageData(c, 0, 0), o.putImageData(s, t.width, 0), await createImageBitmap(n);
  } finally {
    n.width = n.height = 0;
  }
}
const Tg = {
  W: { hueDegrees: 0, saturationScale: 0.439924, brightnessScale: 1.21405 },
  U: { hueDegrees: 17.808301, saturationScale: 0.546189, brightnessScale: 1.239832 },
  B: { hueDegrees: 0, saturationScale: 0.261951, brightnessScale: 1.149978 },
  R: { hueDegrees: -7.214766, saturationScale: 0.471958, brightnessScale: 1.212936 },
  G: { hueDegrees: 0, saturationScale: 0.227323, brightnessScale: 1.290867 }
};
function fo(t, e, r) {
  if (e.colorCalibration !== "set-hsb-v1" || !["eld", "woe"].includes(e.setCode?.toLowerCase() ?? ""))
    return;
  const n = Tg[r.toUpperCase()];
  if (!n) return;
  const o = t.getContext("2d"), s = t.width, a = t.height, i = [
    Math.floor(31 * s / 488),
    Math.floor(487 * a / 680),
    Math.ceil(214 * s / 488),
    Math.ceil(142 * a / 680)
  ], l = o.getImageData(...i);
  for (let u = 0; u < l.data.length; u += 4) {
    if (!l.data[u + 3]) continue;
    const h = te(
      [l.data[u] / 255, l.data[u + 1] / 255, l.data[u + 2] / 255],
      n
    );
    for (let m = 0; m < 3; m++)
      l.data[u + m] = Math.round(h[m] * 255);
  }
  const d = $();
  d.width = i[2], d.height = i[3], d.getContext("2d").putImageData(l, 0, 0), o.save(), o.scale(s / 488, a / 680), o.beginPath(), o.moveTo(31.8, 488.3), o.lineTo(218, 488.3), o.bezierCurveTo(235, 488.3, 241, 490.5, 244, 496), o.lineTo(244, 627.4), o.lineTo(31.8, 627.4), o.closePath(), o.clip(), o.drawImage(
    d,
    i[0] * 488 / s,
    i[1] * 680 / a,
    i[2] * 488 / s,
    i[3] * 680 / a
  ), o.restore(), d.width = d.height = 0;
}
const De = /* @__PURE__ */ new Map(), po = /* @__PURE__ */ new WeakMap();
let xg = 0, yo = 0;
const Rg = (t) => (po.has(t) || po.set(t, ++xg), po.get(t));
function Lg(t, e) {
  const r = t.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const n = (w) => {
    const y = e.get(w);
    if (!y) throw Error(`Adventure asset unavailable: ${w}`);
    return y;
  }, o = xd(t).map(n), s = JSON.stringify([
    t.setCode,
    t.colorCalibration,
    t.colors,
    t.frameColors,
    t.manaSymbols,
    r.colors,
    r.frameColors,
    r.manaSymbols,
    o.map(Rg)
  ]), a = De.get(s);
  if (a)
    return De.delete(s), De.set(s, a), a;
  const i = n(Tn(t)), l = $();
  l.width = i.width, l.height = i.height;
  const d = l.getContext("2d"), u = l.width, h = l.height, m = () => {
    const w = $();
    return w.width = u, w.height = h, w;
  }, c = (w, y) => {
    const b = m(), v = b.getContext("2d"), S = F(w);
    if (v.drawImage(n(Tn(w)), 0, 0, u, h), y && S.length === 1 && fo(b, t, S[0]), S.length === 2) {
      "WUBRG".indexOf(S[1]) - "WUBRG".indexOf(S[0]) > 2 && S.reverse(), v.drawImage(n(`${$e}/${S[0].toLowerCase()}.png`), 0, 0, u, h), y && fo(b, t, S[0]);
      const k = m(), M = k.getContext("2d");
      M.drawImage(n(`${$e}/${S[1].toLowerCase()}.png`), 0, 0, u, h), y && fo(k, t, S[1]), M.globalCompositeOperation = "destination-in";
      const C = M.createLinearGradient(
        u * (y ? 0.22 : 0.43),
        0,
        u * (y ? 0.36 : 0.57),
        0
      );
      C.addColorStop(0, "#0000"), C.addColorStop(1, "#000"), M.fillStyle = C, M.fillRect(0, 0, u, h), v.drawImage(k, 0, 0), k.width = k.height = 0;
    }
    return b;
  };
  if (d.drawImage(i, 0, 0), F(t).length === 2) {
    const w = c(t, !1), y = w.getContext("2d");
    ce(t) || (y.globalCompositeOperation = "destination-in", y.drawImage(n(kd), 0, 0, u, h)), d.drawImage(w, 0, 0), w.width = w.height = 0;
  }
  const g = c(r, !0), f = g.getContext("2d");
  if (f.globalCompositeOperation = "destination-in", f.drawImage(n(Cd), 0, 0, u, h), d.save(), ce(r) && (d.filter = "grayscale(1)"), d.drawImage(g, 0, 0), d.restore(), g.width = g.height = 0, ce(t)) {
    d.save(), d.scale(u / 488, h / 680), d.beginPath();
    for (const [w, y] of [
      [34, 34],
      [388, 28]
    ])
      d.moveTo(38, w), d.lineTo(450, w), d.quadraticCurveTo(461, w + y / 2, 450, w + y), d.lineTo(38, w + y), d.quadraticCurveTo(29, w + y / 2, 38, w), d.closePath();
    d.clip();
    for (const [w, y] of [
      [34, 34],
      [388, 28]
    ])
      d.drawImage(n(Md), 22, 7, 196, 19, 29, w, 432, y);
    d.restore();
  }
  const p = u * h * 4;
  for (const [w, y] of De) {
    if (yo + p <= 16 * 1024 * 1024) break;
    yo -= y.width * y.height * 4, De.delete(w), y.width = y.height = 0;
  }
  return p <= 16 * 1024 * 1024 && (De.set(s, l), yo += p), l;
}
const wi = {
  permanent: { x: 261, y: 438, width: 189, height: 178 },
  spell: { x: 41.7, y: 499, width: 191, height: 122 }
};
function Eg(t, e) {
  const r = e.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const n = (m) => {
    const c = ee({
      rulesText: m.rulesText ?? "",
      rulesParagraphs: m.rulesParagraphs
    });
    return m.rulesAlignment?.mode === "left" ? c.map((g) => g.role === "rules" ? { ...g, align: "left" } : g) : c;
  }, o = { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: !0 }, s = n(e), a = {
    ...wi.permanent,
    exclusions: e.power != null && e.toughness != null ? [[368, 601, 94, 51]] : []
  }, i = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? s : s, l = e.rulesAlignment?.mode !== "left" && i.length === 1 && i[0].role === "rules" ? hr(t, s, i, a, 22.5, 9, 1, o) : null, d = n(r), u = wi.spell, h = P(t, d, u, 20.25, 20.25, o);
  return {
    permanent: l || P(t, s, a, 22.5, 9, o),
    spell: !h.overflow && h.lines.length <= 4 ? h : P(t, d, u, 22.5, 9, o)
  };
}
function Ag(t) {
  const e = (t.rarity ?? "common")[0].toUpperCase(), r = t.collectorNumber ?? "";
  if ((t.collectorFormat ?? (t.setCode?.toLowerCase() === "woe" ? "rarity-first" : "number-first")) === "number-first") return `${r} ${e}`.trim();
  const o = r.split("/")[0].replace(/^(\d+)/, (s) => s.padStart(4, "0"));
  return `${e} ${o}`.trim();
}
function Xd(t, e, r) {
  if (e.power != null && e.toughness != null) {
    const o = r.get(zs(e));
    if (!o) throw Error("Adventure power/toughness plate is unavailable.");
    const [s, a, i, l] = Ys.stats;
    t.drawImage(o, s * 488, a * 680, i * 488, l * 680), t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.font = '700 25px "CardRenderer MTG Beleren Small Caps", Georgia', bt(t, `${e.power}/${e.toughness}`, 420, 627, 77, e.textInk);
  }
  if (oe(e)) {
    const o = r.get(_r);
    if (!o) throw Error("Adventure authenticity stamp is unavailable.");
    t.drawImage(o, ...or.saga);
  }
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(Ag(e), 32, 645), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.artist && (t.font = '11px "CardRenderer MTG Artist Credit", serif', t.fillText("a", 93, 658), t.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', t.fillText(e.artist, 108, 658, 210)), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 658, 182));
}
let vi = null;
function Jd() {
  return vi ??= it().load('700 25px "CardRenderer MTG Beleren Small Caps"').then((t) => {
    if (!t.length || t.some((e) => e.status !== "loaded"))
      throw Error("Inset card footer lettering needs card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw vi = null, t;
  });
}
function Bg(t, e, r) {
  if (t.drawImage(Lg(e, r), 0, 0, 488, 680), G(e).legendary) {
    const n = r.get(Td(e));
    if (!n) throw Error("Adventure crown is unavailable.");
    t.fillStyle = Ft(e) ?? "#000", t.fillRect(19.2, 18.8, 449.6, 12.1), t.drawImage(n, 13.4, 13, 461.4, 113.4);
  }
}
function Ig(t, e, r) {
  const n = e.manaSymbols ?? [], o = 23.4, s = 1.8, a = 452, i = n.length * o + Math.max(0, n.length - 1) * s;
  t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle", ct(
    t,
    e.name,
    41.7,
    51,
    (n.length ? a - i - 8 : 449) - 41.7,
    26,
    !0
  ), n.forEach(
    (f, p) => mt(t, f, a - i + p * (o + s), 38.7, o, r, !0)
  );
  const l = st(e), d = r.get(l ?? ""), u = Me(e), h = d ? Math.min(58.56 / (d.width * u[2]), 27.9 / (d.height * u[3])) : 0, m = d ? d.width * u[2] * h : 0, c = d ? d.height * u[3] * h : 0, g = [450.3 - m, 402 - c / 2, m, c];
  ct(
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
  ), d && (Gt(l) || e.setSymbol ? t.drawImage(d, ...g) : ye(t, d, e.setCode, e.rarity, ...g, u));
}
function Og(t, e, r) {
  const n = e.manaSymbols ?? [], o = 19.8, s = 1.2, a = 233, i = n.length * o + Math.max(0, n.length - 1) * s;
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "middle", ct(
    t,
    e.name,
    40,
    443,
    (n.length ? a - i - 4 : a) - 40,
    20.1,
    !0
  ), n.forEach(
    (l, d) => mt(t, l, a - i + d * (o + s), 432, o, r, !0)
  ), ct(
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
function $g(t, e, r, n, o) {
  const s = e.faces?.[1];
  if (!s) throw Error("Adventure spell is missing.");
  t.save(), t.fillStyle = Ft(e) ?? "#000", t.fillRect(0, 0, 488, 680), n && t.drawImage(n, 0, 0, 488, 680), o !== "artwork" && Bg(t, e, r);
  const [a, i, l, d] = Ys.art;
  if (qt(t, e, r, [a * 488, i * 680, l * 488, d * 680], o), o !== "artwork") {
    Ig(t, e, r), Og(t, s, r);
    const u = Eg(t, e);
    $t(t, u.permanent, r), $t(t, u.spell, r), Xd(t, e, r);
  }
  t.restore();
}
const Ne = /* @__PURE__ */ new Map(), bo = /* @__PURE__ */ new WeakMap();
let Pg = 0, wo = 0;
const Gg = (t) => (bo.has(t) || bo.set(t, ++Pg), bo.get(t));
function Fg(t, e) {
  const r = cr(t), n = (b) => {
    const v = e.get(b);
    if (!v) throw Error(`Prepared asset unavailable: ${b}`);
    return v;
  }, o = Rd(t).map(n), s = qe(t), a = qe(r), i = G(t).legendary, l = JSON.stringify([
    s,
    a,
    i,
    ce(r),
    o.map(Gg)
  ]), d = Ne.get(l);
  if (d)
    return Ne.delete(l), Ne.set(l, d), d;
  const u = n(Xe(t)), h = u.width, m = u.height, c = () => {
    const b = $();
    return b.width = h, b.height = m, b;
  }, g = c(), f = g.getContext("2d");
  f.drawImage(u, 0, 0);
  const p = (b, v, S = !1) => {
    const k = c(), M = k.getContext("2d");
    S && (M.filter = "grayscale(1)"), M.drawImage(b, 0, 0, h, m), M.filter = "none", M.globalCompositeOperation = "destination-in", M.drawImage(n(rn(v)), 0, 0, h, m), f.drawImage(k, 0, 0), k.width = k.height = 0;
  }, w = (b) => n(`${Un}/${b.toLowerCase()}.png`);
  if (s.length === 2) {
    const b = c(), v = b.getContext("2d");
    v.drawImage(w(s[0]), 0, 0, h, m);
    const S = c(), k = S.getContext("2d");
    k.drawImage(w(s[1]), 0, 0, h, m), k.globalCompositeOperation = "destination-in";
    const M = k.createLinearGradient(h * 0.43, 0, h * 0.57, 0);
    M.addColorStop(0, "#0000"), M.addColorStop(1, "#000"), k.fillStyle = M, k.fillRect(0, 0, h, m), v.drawImage(S, 0, 0), p(b, "pinline"), p(w(s[0]), "rules"), p(w(s[1]), "rulesRight"), b.width = b.height = S.width = S.height = 0;
  }
  if (a.length === 2 ? (p(w(a[0]), "prepare"), p(w(a[1]), "prepareRight"), p(n(Xe(r)), "prepareTypeTitle", ce(r))) : p(n(Xe(r)), "prepare"), i) {
    f.save(), f.scale(h / 488, m / 680), f.fillStyle = Ft(t) ?? "#000", f.fillRect(19.2, 18.8, 449.6, 12.1);
    const b = s.length === 2 ? s : [qs(t)];
    if (f.drawImage(n(jo(b[0])), 13.4, 13, 461.4, 113.4), b.length === 2) {
      const v = c(), S = v.getContext("2d");
      S.scale(h / 488, m / 680), S.drawImage(n(jo(b[1])), 13.4, 13, 461.4, 113.4), S.globalCompositeOperation = "destination-in";
      const k = S.createLinearGradient(210, 0, 278, 0);
      k.addColorStop(0, "#0000"), k.addColorStop(1, "#000"), S.fillStyle = k, S.fillRect(0, 0, 488, 680), f.drawImage(v, 0, 0, 488, 680), v.width = v.height = 0;
    }
    f.restore();
  }
  const y = h * m * 4;
  for (const [b, v] of Ne) {
    if (wo + y <= 16 * 1024 * 1024) break;
    wo -= v.width * v.height * 4, Ne.delete(b), v.width = v.height = 0;
  }
  return y <= 16 * 1024 * 1024 && (Ne.set(l, g), wo += y), g;
}
function Wg(t, e) {
  const r = cr(e), n = (o, s, a, i) => {
    const l = ee({
      rulesText: o.rulesText ?? "",
      rulesParagraphs: o.rulesParagraphs
    });
    return P(
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
      Hs.rules,
      21.75,
      oe(e) ? [[213, 620, 63, 26]] : []
    ),
    spell: n(
      r,
      Km.rules,
      21.75,
      e.power != null && e.toughness != null ? [[370, 603, 93, 49]] : []
    )
  };
}
function _g(t, e, r) {
  t.drawImage(Fg(e, r), 0, 0, 488, 680);
}
function Ug(t, e, r) {
  const n = (m, c) => {
    const g = m.manaSymbols ?? [], f = c ? 19.8 : 23.4, p = c ? 1.2 : 1.8, w = c ? 1042 / 2010 * 488 : 41.7, y = 452, b = g.length * f + Math.max(0, g.length - 1) * p;
    t.fillStyle = c ? "#fff" : "#17140f", t.textAlign = "left", t.textBaseline = "middle", ct(
      t,
      m.name,
      w,
      c ? 444 : 52,
      (g.length ? y - b - (c ? 4 : 8) : y) - w,
      c ? 20 : 26,
      !0
    ), g.forEach(
      (v, S) => mt(
        t,
        v,
        y - b + S * (f + p),
        c ? 434.5 : 38.7,
        f,
        r,
        !0
      )
    );
  };
  n(e, !1);
  const o = st(e), s = r.get(o ?? ""), a = Me(e), i = s ? Math.min(58.56 / (s.width * a[2]), 27.9 / (s.height * a[3])) : 0, l = s ? s.width * a[2] * i : 0, d = s ? s.height * a[3] * i : 0, u = [450.3 - l, 402 - d / 2, l, d];
  ct(
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
  ), s && (Gt(o) || e.setSymbol ? t.drawImage(s, ...u) : ye(t, s, e.setCode, e.rarity, ...u, a));
  const h = cr(e);
  n(h, !0), ct(
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
function Dg(t, e, r, n, o) {
  cr(e), t.save(), t.fillStyle = Ft(e) ?? "#000", t.fillRect(0, 0, 488, 680), n && t.drawImage(n, 0, 0, 488, 680), o !== "artwork" && _g(t, e, r);
  const [s, a, i, l] = Hs.art;
  if (qt(t, e, r, [s * 488, a * 680, i * 488, l * 680], o), o !== "artwork") {
    Ug(t, e, r);
    const d = Wg(t, e);
    $t(t, d.permanent, r), $t(t, d.spell, r), Xd(
      t,
      { ...e, collectorFormat: e.collectorFormat ?? "rarity-first" },
      r
    );
  }
  t.restore();
}
function Ng(t, e, r) {
  t.fillStyle = Ft(e) ?? "#000", t.fillRect(0, 0, 488, 680);
  const n = jt(e), o = n.map((s) => Nm(s.face, r));
  if (n.forEach((s, a) => {
    t.save(), t.beginPath(), t.rect(0, a ? 0 : 324, 488, a ? 324 : 356), t.clip(), t.drawImage(o[a], 0, 0, 488, 680), t.restore();
  }), n[0]?.face.layout?.endsWith("-fuse")) {
    const s = $();
    s.width = 488, s.height = 680;
    const a = s.getContext("2d");
    a.drawImage(o[1], 0, 0, 488, 680), a.globalCompositeOperation = "destination-in";
    const i = a.createLinearGradient(0, 344, 0, 304);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), a.fillStyle = i, a.fillRect(0, 0, 488, 680), t.save(), t.beginPath(), t.rect(434, 0, 54, 680), t.clip(), t.drawImage(o[0], 0, 0, 488, 680), t.drawImage(s, 0, 0), t.restore(), s.width = s.height = 0;
  }
}
function jg(t, e, r) {
  const a = e.manaSymbols ?? [], i = a.length * 23.4 + Math.max(0, a.length - 1) * 1.7;
  t.fillStyle = "#17140f", t.textBaseline = "middle", t.textAlign = "left", ct(
    t,
    e.name,
    70,
    53,
    Math.max(1, (a.length ? 331 - i - 7 : 331) - 70),
    26,
    !0
  ), a.forEach((g, f) => mt(t, g, 331 - i + f * (23.4 + 1.7), 39.5, 23.4, r, !0));
  const l = st(e), d = r.get(l ?? ""), u = Me(e), h = d ? Math.min(26 / (d.width * u[2]), 15.5 / (d.height * u[3])) : 0, m = d ? d.width * u[2] * h : 0, c = d ? d.height * u[3] * h : 0;
  if (ct(
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
    Gt(l) || e.setSymbol ? t.drawImage(d, ...g) : ye(t, d, e.setCode, e.rarity, ...g, u);
  }
}
function zg(t, e, r) {
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic";
  const n = [
    ...new Set((e.faces ?? []).map((o) => o.artist ?? e.artist ?? "").filter(Boolean))
  ].join(" & ");
  if (t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""} ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    646
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 660), n && (t.font = '11px "CardRenderer MTG Artist Credit", serif', t.fillText("a", 95, 660), t.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', t.fillText(n, 110, 660, 193)), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 455, 646, 170)), oe(e)) {
    const o = r.get(ad);
    if (!o) throw Error("Modern split authenticity stamp unavailable.");
    t.drawImage(o, ...or.split);
  }
}
const vo = Y.MSE_SPLIT_BRIDGE_ROOT;
function Kd(t, e) {
  const r = F(t);
  r.length === 2 && "WUBRG".indexOf(r[1]) - "WUBRG".indexOf(r[0]) > 2 && r.reverse();
  const n = (e ? r[0] : r.at(-1))?.toLowerCase() ?? "c";
  return {
    color: `${vo}/${n}bridge.png`,
    gold: r.length > 1 ? `${vo}/mbridge.png` : null,
    mask: r.length > 1 ? `${vo}/bridgemask.png` : null
  };
}
function Yg(t) {
  return (t.faces ?? []).flatMap((e, r) => Object.values(Kd(e, r)));
}
function qg(t, e, r) {
  const n = (u) => {
    const h = r.get(u);
    if (!h) throw Error(`Fuse bridge asset unavailable: ${u}`);
    return h;
  }, o = e.faces.map((u, h) => {
    const m = Kd(u, h), c = n(m.color), g = $();
    g.width = c.width, g.height = c.height;
    const f = g.getContext("2d");
    return f.drawImage(c, 0, 0), m.gold && m.mask && (f.globalCompositeOperation = "destination-in", f.drawImage(Pd(n(m.mask)), 0, 0, g.width, g.height), f.globalCompositeOperation = "destination-over", f.drawImage(n(m.gold), 0, 0, g.width, g.height)), g;
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
function Hg(t, e, r, n) {
  const [o, s, a, i] = mr(r, n).rules, l = ee({
    rulesText: e.rulesText ?? "",
    rulesParagraphs: e.rulesParagraphs
  }), d = { x: o, y: s, width: a, height: i }, u = {
    leading: 1.02,
    paragraphGap: 0.4,
    flavorGap: 0.65,
    centerOffset: r === "old" ? 0 : 2
  }, h = r === "old" ? 24.5 : r === "m15" ? n ? 20.25 : 24.25 : 21.5;
  if ((r !== "m15" || n) && e.rulesAlignment?.mode !== "left" && l.length === 1) {
    const m = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? l : l, c = hr(t, l, m, d, h, 13, 2, u);
    if (c) return c;
  }
  return P(t, l, d, h, 13, u);
}
function Xg(t, e, r) {
  const n = Vt(e);
  if (!n) throw Error("No native split plate for this printing.");
  if (n === "m15") return Ng(t, e, r);
  const o = n !== "old" && nr(e), s = mr(n, o);
  t.fillStyle = It(e.setCode, e.borderColor).border, t.fillRect(0, 0, 488, 680), jt(e).forEach((a, i) => {
    const l = Uc(a.face, n, o, i, r);
    t.save(), t.translate(a.x, a.y), t.rotate(-Math.PI / 2);
    const [d, u, h, m] = s.frame;
    t.drawImage(l, d - (o && i ? 8 * 680 / 523 : 0), u, h, m), t.restore();
  }), o && qg(t, e, r);
}
function Jg(t, e, r, n, o) {
  if (r === "m15") return jg(t, e, o);
  const s = mr(r, n), a = r === "old", [i, l, d, u] = s.title, h = e.manaSymbols ?? [], m = 23.4, c = 1.7, g = 316, f = h.length * m + Math.max(0, h.length - 1) * c;
  if (t.fillStyle = a ? "#f2eee3" : "#17140f", t.textBaseline = "middle", t.textAlign = "left", a) {
    const M = t.getTransform();
    t.shadowColor = "#000b", t.shadowOffsetX = M.a + M.c, t.shadowOffsetY = M.b + M.d;
  }
  ct(
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
    (M, C) => mt(t, M, g - f + C * (m + c), a ? 30.5 : 40, m, o, !a)
  );
  const p = st(e), w = o.get(p ?? ""), y = Me(e), [b, v, S, k] = s.type;
  if (ct(
    t,
    e.typeLine ?? "",
    b,
    v + k / 2,
    S - (w ? 33 : 0),
    a ? 22 : 21.5,
    !1,
    1,
    a ? "CardRenderer MTG MPlantin" : "CardRenderer MTG Matrix",
    0,
    e.textInk
  ), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, w) {
    const M = Math.min(
      32 / (w.width * y[2]),
      (a ? 26 : 22) / (w.height * y[3])
    ), C = w.width * y[2] * M, T = w.height * y[3] * M, R = [(a ? 306 : 316) - C, v + k / 2 - (a ? 1.5 : 0) - T / 2, C, T];
    Gt(p) || e.setSymbol ? t.drawImage(w, ...R) : ye(t, w, e.setCode, e.rarity, ...R, y);
  }
}
function Kg(t, e, r, n, o, s) {
  const a = mr(n, o), i = n === "old";
  t.fillStyle = i ? "#eeeae1" : "#17140f", t.textAlign = i ? "center" : "left", t.textBaseline = "middle", t.font = i ? '19px "CardRenderer MTG MPlantin", Georgia' : '700 14px "CardRenderer MTG Matrix", Georgia';
  const l = s.get(`${W}/img/manaSymbols/brush.svg`);
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
function Vg(t, e, r, n, o) {
  const s = Vt(e);
  if (!s) throw Error("No native split plate for this printing.");
  const a = s !== "old" && nr(e), i = mr(s, a);
  t.save(), o !== "artwork" && Xg(t, e, r), n && t.drawImage(n, 0, 0, 488, 680);
  for (const l of jt(e))
    t.save(), t.translate(l.x, l.y), t.rotate(-Math.PI / 2), qt(t, l.face, r, i.art, o), o !== "artwork" && (Jg(t, l.face, s, a, r), Dc(t, l.face, r, i.rules[1] + i.rules[3] / 2), $t(t, Hg(t, l.face, s, a), r), s !== "m15" && Kg(t, l.face, e, s, a, r)), t.restore();
  if (s === "m15" && o !== "artwork" && zg(t, e, r), a && o !== "artwork") {
    t.translate(0, 680), t.rotate(-Math.PI / 2);
    const l = pd(e).map(
      (d) => s === "m15" ? { ...d, align: "center" } : d
    );
    $t(
      t,
      P(
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
let Si;
function Zg(t) {
  return Vt(t) === "m15" ? Jd() : Vt(t) !== "eighth" ? Promise.resolve() : Si ??= Promise.all([
    it().load('700 24px "CardRenderer MTG Matrix"'),
    it().load('24px "CardRenderer MTG Matrix"')
  ]).then((e) => {
    if (e.some((r) => !r.length || r.some((n) => n.status !== "loaded")))
      throw Error("Split Matrix fonts are unavailable. Load card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw Si = void 0, e;
  });
}
const ve = {
  reminder: { x: 42.3, y: 78, width: 197 },
  chapters: { x: 65.1, width: 171 },
  top: 80,
  reminderBottom: 201,
  bottom: 569,
  reverseStatsBottom: 535
}, Qg = {
  maximumSize: 20.7,
  padding: 24,
  equalCells: 0,
  lastLift: 0,
  bottomSpace: 0.15
};
function tf(t, e, r = Qg) {
  const n = Dr(e), o = n.filter((f) => !f.badges.length), s = n.filter((f) => f.badges.length), a = (f, p = !1) => [
    {
      role: "rules",
      runs: p ? [{ text: f, italic: !0 }] : f.split(/(\([^)]*\))/g).filter(Boolean).map((w) => ({ text: w, italic: w.startsWith("(") }))
    }
  ], i = { leading: 0.98, paragraphGap: 0.3, flavorGap: 0 }, l = o.length ? ve.reminderBottom : ve.top, d = e.reverseStats && e.layout === "transform" ? ve.reverseStatsBottom : ve.bottom, u = P(
    t,
    o.flatMap((f) => a(f.text, f.reminder)),
    { ...ve.reminder, height: l - ve.top },
    20.4,
    12,
    { ...i, centerOffset: -3 }
  );
  let h = r.maximumSize, m = [], c = [];
  for (; ; ) {
    const f = s.map(
      (v) => Math.max(
        P(
          t,
          a(v.text),
          { ...ve.chapters, y: 0, height: 2e3 },
          h,
          h,
          i
        ).height + r.padding,
        Zt.minimumRowHeight + Math.max(0, v.badges.length - 1) * Zt.gap
      )
    ), p = d - l;
    if (f.reduce((v, S) => v + S, 0) > p && h > 12) {
      h = Math.max(12, h - 0.25);
      continue;
    }
    if (f.reduce((v, S) => v + S, 0) > p)
      throw Error("Saga chapter text or badges do not fit the available column.");
    const w = Math.max(0, p - f.reduce((v, S) => v + S, 0)) * (1 - (s.length === 2 && s[0].badges.length > 1 ? r.bottomSpace : 0)) / Math.max(1, s.length);
    c = f.map((v) => v + w);
    const y = p / Math.max(1, s.length);
    c = c.map((v) => v * (1 - r.equalCells) + y * r.equalCells);
    let b = l;
    m = s.map((v, S) => {
      const k = c[S], M = P(
        t,
        a(v.text),
        { ...ve.chapters, y: b + 7, height: k - 14 },
        h,
        h,
        { ...i, centerOffset: S === s.length - 1 ? -r.lastLift : 0 }
      );
      return b += k, M;
    });
    break;
  }
  let g = l;
  return {
    reminder: u,
    size: h,
    rows: s.map((f, p) => {
      const w = { ...f, top: g, height: c[p], layout: m[p] };
      return g += w.height, w;
    })
  };
}
function ef(t, e, r, n, o) {
  const s = (S) => {
    const k = r.get(S);
    if (!k) throw Error(`Saga asset unavailable: ${S}`);
    return k;
  };
  t.save(), t.fillStyle = Ft(e) ?? "#090806", t.fillRect(0, 0, x, I), n && t.drawImage(n, 0, 0, x, I), o !== "artwork" && (t.drawImage(s(Ns(e)), 0, 0, x, I), Hm(t, e, r));
  const a = Sd.art;
  if (qt(t, e, r, [a[0] * x, a[1] * I, a[2] * x, a[3] * I], o), o === "artwork") {
    t.restore();
    return;
  }
  const i = No(e);
  i && t.drawImage(s(i), 33.5, 35.6, 29, 32), t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
  const l = e.manaSymbols ?? [], d = 23.4, u = 1.8, h = 452, m = l.length * d + Math.max(0, l.length - 1) * u, c = e.layout === "transform" ? 78 : 41.7;
  ct(
    t,
    e.name,
    c,
    51,
    (l.length ? h - m - 8 : 449) - c,
    26,
    !0
  ), l.forEach(
    (S, k) => mt(t, S, h - m + k * (d + u), 38.7, d, r, !0)
  );
  const g = st(e), f = r.get(g ?? ""), p = Me(e), w = f ? Math.min(58.56 / (f.width * p[2]), 25.9 / (f.height * p[3])) : 0, y = f ? f.width * p[2] * w : 0, b = f ? f.height * p[3] * w : 0, v = [450.3 - y, 594.25 - b / 2, y, b];
  if (ct(
    t,
    e.typeLine ?? "",
    41.7,
    594.5,
    (f ? v[0] - 7 : 449) - 41.7,
    22,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  ), f && (Gt(g) || e.setSymbol ? t.drawImage(f, ...v) : ye(t, f, e.setCode, e.rarity, ...v, p)), e.reverseStats && e.layout === "transform" && (t.fillStyle = "#65605a", t.font = 'italic 20px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.fillText(`${e.reverseStats.power}/${e.reverseStats.toughness}`, 41, 553)), fe(t)) {
    const S = tf(t, e);
    $t(t, S.reminder, r);
    for (const k of S.rows)
      t.drawImage(s(vd), 48.8, k.top - 1, 192.6, 2), $t(t, k.layout, r), k.badges.forEach((M, C) => {
        const T = k.top + k.height / 2 + (C - (k.badges.length - 1) / 2) * Zt.gap;
        t.drawImage(
          s(wd),
          Zt.x,
          T - Zt.height / 2,
          Zt.width,
          Zt.height
        ), t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.font = `550 ${Zt.fontSize}px "${Zt.fontFamily}", Georgia`, t.fillText(
          M,
          Zt.centerX,
          T + Zt.numeralOffsetY
        );
      });
  }
  oe(e) && t.drawImage(s(_r), ...or.saga), t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""}  ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.font = '11px "CardRenderer MTG Artist Credit", serif', e.artist && t.fillText("a", 93, 658), t.font = '11px "CardRenderer MTG Beleren", serif', t.fillText(e.artist ?? "", 108, 658, 210), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 646, 182)), t.restore();
}
let Ci = null;
function rf() {
  return Ci ??= it().load('550 22px "CardRenderer MTG Chapter"').then((t) => {
    if (!t.length || t.some((e) => e.status !== "loaded"))
      throw Error("Saga chapter numerals need card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw Ci = null, t;
  });
}
function nf(t, e, r) {
  const [n, o, s, a] = (r ? Ds : Us).rules, i = ee({
    rulesText: e.rulesText ?? "",
    rulesParagraphs: e.rulesParagraphs
  }), l = { x: n, y: o, width: s, height: a }, d = {
    leading: 0.98,
    paragraphGap: 0.32,
    flavorGap: 0.65,
    centerOffset: r ? 0 : 2.5
  };
  let u = r ? 22 : e.setCode?.toLowerCase() === "hou" ? 24.5 : 22.5, h = P(t, i, l, u, 14, d);
  if (!r && i.length === 1 && h.lines.length > 1 && h.lines.at(-1).width < s * 0.18)
    for (let m = u - 0.25; m >= u * 0.9; m -= 0.25) {
      const c = P(t, i, l, m, m, d);
      if (!c.overflow && c.lines.length < h.lines.length) {
        u = m, h = c;
        break;
      }
    }
  if (!r && e.rulesAlignment?.mode !== "left") {
    const m = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? i : i, c = hr(
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
function of(t, e, r, n, o) {
  const s = jt(e), a = (i) => {
    const l = r.get(i);
    if (!l) throw Error(`Aftermath asset unavailable: ${i}`);
    return l;
  };
  t.save(), t.fillStyle = Ft(e) ?? "#090806", t.fillRect(0, 0, 488, 680), n && t.drawImage(n, 0, 0, 488, 680), o !== "artwork" && s.forEach((i, l) => {
    t.save(), t.beginPath(), t.rect(0, l ? Be : 0, 488, l ? 680 - Be : Be), t.clip(), t.drawImage(a(md(i.face)), 0, 0, 488, 680), t.restore();
  }), s.forEach((i, l) => {
    t.save(), l && (t.translate(488, Be), t.rotate(Math.PI / 2));
    const d = i.face, u = l ? Ds : Us;
    if (qt(t, d, r, u.art, o), o !== "artwork") {
      t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
      const h = d.manaSymbols ?? [], m = 23.4, c = 1.6, g = l ? 246 : 451, f = h.length * m + Math.max(0, h.length - 1) * c, [p, w] = u.title;
      ct(t, d.name, p, w + 15.5, g - f - p - 7, 26, !0), h.forEach(
        (b, v) => mt(t, b, g - f + v * (m + c), w + 3, m, r, !0)
      );
      const y = l ? void 0 : r.get(st(d) ?? "");
      if (ct(
        t,
        d.typeLine ?? "",
        u.type[0],
        u.type[1] + 16.5,
        u.type[2] - (y ? 45 : 0),
        23,
        !0,
        1,
        "CardRenderer MTG Beleren",
        0,
        d.textInk
      ), y) {
        const b = Me(d), v = Math.min(50 / (y.width * b[2]), 27 / (y.height * b[3])), S = y.width * b[2] * v, k = y.height * b[3] * v, M = [451 - S, 252.3 - k / 2, S, k];
        Gt(st(d)) || d.setSymbol ? t.drawImage(y, ...M) : ye(t, y, d.setCode, d.rarity, ...M, b);
      }
      $t(t, nf(t, d, !!l), r);
    }
    t.restore();
  }), o !== "artwork" && (oe(e) && t.drawImage(a(hd), ...or.aftermath), t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""}  ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.font = '11px "CardRenderer MTG Artist Credit", serif', e.artist && t.fillText("a", 93, 658), t.font = '11px "CardRenderer MTG Beleren", serif', t.fillText(e.artist ?? "", 108, 658, 220), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 646, 177))), t.restore();
}
const Ko = "conjurer-planeswalker-v3", sf = {
  W: { hueDegrees: -19.0561061, saturationScale: 1.0414075, brightnessScale: 0.967493 },
  U: { hueDegrees: 10.198972, saturationScale: 0.7186607, brightnessScale: 0.8360822 },
  B: { hueDegrees: 5.4208506, saturationScale: 0.7598563, brightnessScale: 0.8801518 },
  R: { hueDegrees: -3.269066, saturationScale: 1.2589451, brightnessScale: 1.0859474 },
  G: { hueDegrees: 6.636047, saturationScale: 0.8931966, brightnessScale: 0.8272016 },
  M: { hueDegrees: -3.6353884, saturationScale: 0.9038432, brightnessScale: 0.9853541 },
  A: { hueDegrees: -0.0941491, saturationScale: 1.6, brightnessScale: 1.1230379 }
};
function Vd(t) {
  return t === "Gold" ? "M" : ["Colourless", "Artifact", "Land"].includes(t) ? "A" : t;
}
function Zd(t, e) {
  const r = t ? "tall" : "regular", n = t ? "planeswalkerTall" : "planeswalkerFrame", o = `${Y.CONJURER_ROOT}/img/frames/planeswalker/${r}/${n}${e}.png`;
  return { family: r, source: o };
}
function af(t, e, r, n) {
  if (n.hueDegrees === 0 && n.saturationScale === 1 && n.brightnessScale === 1) return;
  const o = t.getImageData(0, 0, e, r);
  for (let s = 0; s < o.data.length; s += 4) {
    if (!o.data[s + 3]) continue;
    const a = te([o.data[s] / 255, o.data[s + 1] / 255, o.data[s + 2] / 255], n);
    for (let i = 0; i < 3; i++) o.data[s + i] = Math.round(a[i] * 255);
  }
  t.putImageData(o, 0, 0);
}
async function lf(t, e, r, n) {
  const o = $();
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
    ), af(s, o.width, o.height, r), s.globalCompositeOperation = "destination-in", n) {
      const u = $();
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
async function ki(t, e) {
  const r = $();
  r.width = t.width, r.height = t.height;
  try {
    const n = r.getContext("2d");
    if (!n) throw Error("Planeswalker inset needs Canvas2D");
    const o = (e ? 0.03937 : 0.04724) * 488, s = (e ? 0.92126 : 0.91339) * 488, a = t.width / s, i = (l) => (l - o) * a;
    if (e) {
      const l = [0, i(420), i(442), t.width - 4 * a, t.width], d = [
        0,
        i(420),
        i(442 - Ct.rightInset),
        t.width - (4 + Ct.rightInset) * a,
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
      const l = Math.round(i(420)), d = l - Ct.rightInset * a;
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
async function df(t, e, r) {
  const n = Q(t);
  if (!n.startsWith("planeswalker")) return { images: e, dispose() {
  } };
  const o = n === "planeswalker-large", s = Vd(G(t).boxes), a = Zd(o, s), i = re(G(t), n), l = (f) => {
    const p = e.get(f);
    if (!p) throw Error("Planeswalker asset unavailable: " + f);
    return p;
  }, d = l(a.source), u = l(i.background), h = t.calibration === "source" ? O0 : sf[s], m = l(i.frame), c = await Hd.acquireMany(
    [
      {
        key: JSON.stringify([
          Ko,
          "background",
          a.source,
          i.background,
          Ke(d),
          Ke(u),
          u.width,
          u.height,
          h
        ]),
        bytes: u.width * u.height * 4,
        async build() {
          const f = await lf(d, u, h, s === "A");
          try {
            return await ki(f, !0);
          } finally {
            f.close();
          }
        }
      },
      {
        key: JSON.stringify([
          Ko,
          "frame",
          i.frame,
          Ke(m),
          m.width,
          m.height
        ]),
        bytes: m.width * m.height * 4,
        build: () => ki(m, !1)
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
const uf = { left: [[34.1933, 40.6667], [34.6766, 39.4527], [35.4016, 38.4816], [35.6432, 38.4816], [36.6098, 37.2677], [36.8515, 37.2677], [38.3014, 35.8109], [39.7512, 34.8398], [42.1677, 33.8687], [46.7591, 32.6547], [51.1087, 32.1692], [51.3504, 31.9264], [53.5252, 31.9264], [53.7669, 31.6836], [60.2914, 31.6836], [60.533, 31.9264], [62.4662, 31.9264], [63.9161, 32.4119], [65.6077, 32.4119], [67.5409, 32.8975], [71.4072, 34.1114], [74.7903, 35.8109], [77.4485, 37.7532], [380.4762, 37.7532], [384.8259, 35.3254], [388.6923, 34.1114], [394.7335, 33.3831], [394.9751, 33.1403], [402.2246, 32.8975], [402.4662, 33.1403], [405.366, 33.1403], [405.6077, 33.3831], [411.4072, 34.1114], [415.032, 35.3254], [417.9318, 36.7821], [418.6567, 37.5104], [420.8316, 37.5104], [421.0732, 37.7532], [610.7676, 37.7532], [611.0092, 37.996], [613.6674, 37.996]], right: [[34.435, 448.79], [35.8849, 450.7323], [36.1265, 450.7323], [36.3682, 451.2179], [38.0597, 452.6746], [39.0263, 452.9174], [40.9595, 454.1313], [44.8259, 455.5881], [46.5174, 455.8308], [48.4506, 456.5592], [53.5252, 456.802], [53.7669, 457.0448], [54.9751, 457.0448], [55.2168, 456.802], [59.3248, 457.0448], [59.5665, 456.802], [66.091, 456.5592], [66.8159, 456.0736], [70.6823, 455.3453], [73.0988, 453.8886], [73.5821, 453.8886], [76.2402, 451.9463], [77.6901, 451.2179], [103.3049, 451.2179], [103.5466, 451.4607], [104.9964, 451.4607], [105.2381, 451.2179], [124.0867, 451.4607], [124.3284, 451.2179], [125.5366, 451.2179], [125.7783, 451.4607], [129.8863, 451.4607], [130.1279, 451.7035], [139.3106, 451.7035], [139.5522, 451.4607], [143.4186, 451.4607], [143.6603, 451.2179], [144.6269, 451.4607], [148.7349, 451.4607], [148.9765, 451.2179], [161.059, 451.2179], [161.3006, 451.4607], [163.9588, 451.4607], [164.2004, 451.2179], [169.0334, 451.2179], [169.2751, 451.4607], [171.2082, 451.4607], [171.4499, 451.2179], [172.6581, 451.4607], [174.833, 451.4607], [175.0746, 451.2179], [175.7996, 451.4607], [179.4243, 451.4607], [179.666, 451.2179], [181.8408, 451.2179], [182.0824, 451.4607], [187.6404, 451.4607], [187.882, 451.2179], [192.4733, 451.2179], [192.715, 451.4607], [193.4399, 451.2179], [199.7228, 451.2179], [199.9645, 451.4607], [200.9311, 451.2179], [208.1805, 451.2179], [208.4222, 451.4607], [209.6304, 451.4607], [209.8721, 451.2179], [227.9957, 451.2179], [228.2374, 451.4607], [229.9289, 451.4607], [230.1706, 451.2179], [246.8443, 451.2179], [247.086, 451.4607], [259.6517, 451.4607], [259.8934, 451.2179], [261.1016, 451.4607], [261.8266, 451.2179], [263.0348, 451.2179], [263.2765, 451.4607], [263.7598, 451.2179], [265.9346, 451.2179], [266.1763, 451.4607], [268.8344, 451.4607], [269.076, 451.2179], [367.1855, 451.4607], [367.4271, 451.2179], [374.9183, 451.2179], [375.1599, 451.4607], [377.8181, 451.4607], [378.0597, 451.2179], [379.9929, 451.2179], [381.9261, 452.1891], [382.651, 452.9174], [385.3092, 454.1313], [389.9005, 455.3453], [394.7335, 455.8308], [394.9751, 456.0736], [405.366, 456.0736], [405.6077, 455.8308], [408.7491, 455.5881], [413.0988, 454.6169], [415.5153, 453.6458], [416.4819, 453.6458], [419.14, 451.4607], [419.865, 451.2179], [426.3895, 451.2179], [426.6311, 451.4607], [432.1891, 451.4607], [432.4307, 451.2179], [434.8472, 451.2179], [435.0888, 451.4607], [613.6674, 451.2179]] }, hf = { left: [[39.0263, 39.4527], [39.7512, 38.7244], [43.6176, 36.5393], [49.4172, 35.0826], [53.7669, 34.8398], [54.0085, 34.597], [59.8081, 34.597], [60.0498, 34.8398], [65.8493, 35.0826], [68.7491, 35.8109], [73.0988, 37.5104], [75.032, 38.7244], [76.7235, 40.4239], [76.9652, 60.8179]], right: [[39.0263, 449.0328], [39.7512, 449.7612], [42.651, 451.4607], [48.209, 453.1602], [49.4172, 453.1602], [51.1087, 453.6458], [57.3916, 453.6458], [58.5999, 453.8886], [58.8415, 453.6458], [63.4328, 453.6458], [70.199, 452.1891], [75.032, 449.7612], [76.7235, 448.0617], [76.9652, 447.5761]] }, mf = { left: [[384.1009, 41.395], [385.5508, 40.1811], [387.484, 39.21], [392.317, 37.7532], [395.7001, 37.5104], [395.9417, 37.2677], [408.2658, 37.5104], [412.6155, 38.7244], [415.2736, 39.9383], [417.9318, 41.6378], [418.4151, 42.3662], [418.6567, 60.8179], [418.8984, 60.8179]], right: [[384.1009, 447.8189], [385.3092, 448.79], [388.9339, 450.4896], [392.5586, 451.4607], [396.9083, 451.7035], [397.15, 451.9463], [404.3994, 451.9463], [404.6411, 451.7035], [408.7491, 451.4607], [413.5821, 450.004], [415.9986, 448.79], [418.4151, 446.8478], [418.6567, 428.8816], [418.8984, 428.8816]] }, cf = { left: [[424.2146, 41.6378], [608.3511, 41.6378], [609.3177, 41.395], [609.5593, 60.8179], [609.801, 60.8179]], right: [[424.2146, 446.3622], [424.6979, 446.1194], [602.3099, 446.1194], [602.5515, 446.3622], [608.5928, 446.1194], [609.076, 446.3622], [609.3177, 446.1194], [609.5593, 428.8816], [609.801, 428.8816]] }, kr = {
  outer: uf,
  title: hf,
  type: mf,
  paper: cf
}, gf = { hueDegrees: -1.0625, saturationScale: 0.9087500000000004, brightnessScale: 0.9406250000000002, gamma: 0.738125 }, ff = { W: { header: { hueDegrees: -14.024193548387075, saturationScale: 0.5265905874026912, brightnessScale: 0.9495967741935485 }, paper: { hueDegrees: -1.1750690607734668, saturationScale: 0.7998024425287352, brightnessScale: 0.9392712550607287 }, pinline: { hueDegrees: -8.203598940779898, saturationScale: 0.4898632906133164, brightnessScale: 0.9302788844621516 }, glyph: { source: [0.9882352941176471, 0.996078431372549, 1], target: [0.9431372549019608, 0.9352941176470588, 0.9372549019607843] } }, U: { header: { hueDegrees: 42.78801843317967, saturationScale: 0.45884697719052203, brightnessScale: 0.9842342342342343 }, paper: { hueDegrees: 32.97916666666663, saturationScale: 0.5842800834685827, brightnessScale: 1.0133928571428572 }, pinline: { hueDegrees: 17.557840616966587, saturationScale: 0.5557142857142856, brightnessScale: 1.1666666666666667 }, glyph: { source: [0, 0.4588235294117647, 0.7450980392156863], target: [0.396078431372549, 0.4392156862745098, 0.7176470588235293] } }, B: { header: { hueDegrees: -14.404807692307713, saturationScale: 1.421528644784533, brightnessScale: 1.0159574468085106 }, paper: { hueDegrees: -12.3125, saturationScale: 1.2126352339181279, brightnessScale: 1.0239520958083832 }, pinline: { hueDegrees: -88.07559082483772, saturationScale: 1.277991260837483, brightnessScale: 1.308125 }, glyph: { source: [0.15294117647058825, 0.14901960784313725, 0.1411764705882353], target: [0.11568627450980393, 0.09607843137254901, 0.12941176470588234] } }, R: { header: { hueDegrees: 2.5092658770676053, saturationScale: 0.7511073790822655, brightnessScale: 0.9318181818181819 }, paper: { hueDegrees: 8.412850307587178, saturationScale: 1.0477689369398555, brightnessScale: 0.9504310344827587 }, pinline: { hueDegrees: 3.0543379373086736, saturationScale: 1.0001076704423102, brightnessScale: 1.0559610705596107 }, glyph: { source: [0.9372549019607843, 0.2196078431372549, 0.15294117647058825], target: [0.8196078431372549, 0.24901960784313726, 0.20588235294117646] } }, G: { header: { hueDegrees: -59.16304347826099, saturationScale: 1.0029481528127626, brightnessScale: 0.9543269230769231 }, paper: { hueDegrees: -26.824145962732928, saturationScale: 0.9416448402304863, brightnessScale: 0.969626168224299 }, pinline: { hueDegrees: -21.627829393491652, saturationScale: 0.47678542547538166, brightnessScale: 1.16243654822335 }, glyph: { source: [0, 0.4823529411764706, 0.2627450980392157], target: [0.22745098039215686, 0.4568627450980392, 0.29411764705882354] } } }, Qd = {
  outer: gf,
  colors: ff
}, Mi = (t) => {
  if (t.length !== 3 || t.some((e) => !Number.isFinite(e) || e < 0 || e > 1))
    throw Error("Invalid Eighth basic-land palette.");
  return [t[0], t[1], t[2]];
}, pf = new Map(
  Object.entries(Qd.colors).map(([t, e]) => [
    t,
    { ...e, glyph: { source: Mi(e.glyph.source), target: Mi(e.glyph.target) } }
  ])
), Ln = Qd.outer;
function na(t) {
  if (t.colorCalibration !== "set-hsb-v1" || t.frameAssetFamily !== "eighth" || t.setCode?.toLowerCase() !== "8ed" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = pe(t), r = e ? pf.get(e) : void 0;
  if (!r) return;
  const n = wt(t);
  if (!(!n || !ds(t, n.frame)))
    return { color: e, palette: r, frame: n.frame, glyph: ir(t) };
}
const tu = kr, En = (t) => Math.max(0, Math.min(1, t)), eu = (t) => {
  const e = En(t);
  return e * e * (3 - 2 * e);
}, Ti = (t, e) => {
  let r = 0;
  for (; r + 1 < t.length - 1 && t[r + 1][0] < e; ) r++;
  const n = t[r], o = t[r + 1];
  return n[1] + En((e - n[0]) / (o[0] - n[0])) * (o[1] - n[1]);
};
function Kr(t, e) {
  const { left: r, right: n } = e, o = Math.max(r[0][0], n[0][0]), s = Math.min(r.at(-1)[0], n.at(-1)[0]);
  return Array.from({ length: t }, (a, i) => {
    const l = (i + 0.5) * 680 / t;
    return [Ti(r, l), Ti(n, l), Math.min(l - o, s - l)];
  });
}
const Vr = (t, e) => eu(0.5 + Math.min(e - t[0], t[1] - e, t[2]) / 0.4), So = (t, e, r) => [
  t[0] + r * (e[0] - t[0]),
  t[1] + r * (e[1] - t[1]),
  t[2] + r * (e[2] - t[2])
];
function ru(t, e) {
  const r = Kr(t.height, kr.outer), n = Kr(t.height, kr.title), o = Kr(t.height, kr.type), s = Kr(t.height, kr.paper);
  for (let a = 0; a < t.height; a++)
    for (let i = 0; i < t.width; i++) {
      const l = (a * t.width + i) * 4;
      if (!t.data[l + 3]) continue;
      const d = [t.data[l] / 255, t.data[l + 1] / 255, t.data[l + 2] / 255], u = Math.max(...d);
      if (u < 0.075) continue;
      const h = (i + 0.5) * 488 / t.width, m = Vr(r[a], h), c = Math.max(Vr(n[a], h), Vr(o[a], h)), g = Vr(s[a], h);
      let f;
      if (m < 1) {
        const p = Math.pow(u, Ln.gamma) / u, w = te([d[0] * p, d[1] * p, d[2] * p], Ln);
        f = So(d, w, eu((u - 0.075) / 0.125));
      } else f = d;
      if (m > 0) {
        const p = g > 0 ? e.paper : e.header, w = Math.max(c, g), y = w === 1 ? d : te(d, e.pinline), b = w > 0 ? So(y, te(d, p), w) : y;
        f = So(f, b, m);
      }
      for (let p = 0; p < 3; p++) t.data[l + p] = Math.round(255 * f[p]);
    }
}
function nu(t, e) {
  const r = (a) => (a[0] + a[1] + a[2]) / 3, n = r(e.source), o = e.source.map((a) => a - n), s = o.reduce((a, i) => a + i * i, 0);
  if (s <= 1e-6) throw Error("Basic glyph fill cannot be separated from neutral details.");
  for (let a = 0; a < t.data.length; a += 4) {
    if (!t.data[a + 3]) continue;
    const i = [t.data[a] / 255, t.data[a + 1] / 255, t.data[a + 2] / 255], l = r(i), d = En(i.reduce((u, h, m) => u + (h - l) * o[m], 0) / s);
    for (let u = 0; u < 3; u++)
      t.data[a + u] = Math.round(
        255 * En(i[u] + d * (e.target[u] - e.source[u]))
      );
  }
}
function oa(t) {
  if (t.colorCalibration !== "set-hsb-v1" || t.calibration === "source" || !/\bLand\b/.test(t.canonicalTypeLine ?? t.typeLine ?? ""))
    return [];
  const e = nt(t), r = e && wt(t);
  return !e || !r ? [] : [r.frame, ...r.rightFrame ? [r.rightFrame] : []].flatMap((n) => {
    const o = n.startsWith(e.root + "/") ? n.slice(e.root.length + 1) : "", s = /^(?:([wubrgm])l|([l]))[.]png$/.exec(o), a = s && (s[1] ?? s[2]).toUpperCase(), i = a && (r.rightFrame && e.landPalettes["dual-" + a] || e.landPalettes[a]);
    return i ? [{ url: n, palette: i }] : [];
  });
}
function yf(t, e) {
  if (t.colorCalibration !== "set-hsb-v1" || t.calibration === "source") return [];
  const r = oa(t), n = pe(t), o = n && ir(t), s = r.map((i) => ({ ...i, kind: "frame" })), a = nt(t)?.landPalettes[n ?? ""];
  return o && a && s.push({ url: o, palette: a, kind: "glyph" }), s.map(({ url: i, palette: l, kind: d }) => {
    const u = e.get(i);
    if (!u) throw Error("Eighth land material unavailable: " + i);
    return {
      url: i,
      key: JSON.stringify([
        "eighth-land-material-v1",
        i,
        Ke(u),
        d,
        l,
        ...d === "frame" ? [Ln, tu] : []
      ]),
      bytes: u.width * u.height * 4,
      build: async () => {
        const h = $();
        h.width = u.width, h.height = u.height;
        try {
          const m = h.getContext("2d", { willReadFrequently: !0 });
          if (!m) throw Error("Eighth land preparation needs Canvas2D");
          m.drawImage(u, 0, 0);
          const c = m.getImageData(0, 0, h.width, h.height);
          return d === "frame" ? ru(c, l) : nu(c, l.glyph), m.putImageData(c, 0, 0), await createImageBitmap(h);
        } finally {
          h.width = h.height = 0;
        }
      }
    };
  });
}
function bf(t, e, r) {
  if (!Number.isFinite(e) || e <= 0 || e > 2 || r.some((d) => !Number.isFinite(d) || d < 0 || d > 255))
    throw RangeError("Invalid Eighth stock-rule parameters");
  const { width: n, height: o, data: s } = t, a = new Uint8ClampedArray(n * o);
  for (let d = 0; d < a.length; d++) a[d] = s[d * 4 + 3];
  const i = (d, u) => {
    d = Math.max(0, Math.min(n - 1, d)), u = Math.max(0, Math.min(o - 1, u));
    const h = Math.floor(d), m = Math.floor(u), c = d - h, g = u - m, f = (p, w) => a[Math.min(o - 1, w) * n + Math.min(n - 1, p)];
    return (f(h, m) * (1 - c) + f(h + 1, m) * c) * (1 - g) + (f(h, m + 1) * (1 - c) + f(h + 1, m + 1) * c) * g;
  }, l = Array.from(
    { length: 8 },
    (d, u) => [Math.cos(u * Math.PI / 4) * e, Math.sin(u * Math.PI / 4) * e]
  );
  for (let d = 0; d < o; d++)
    for (let u = 0; u < n; u++) {
      let h = 255, m = 0;
      for (const [g, f] of l) {
        const p = i(u + g, d + f);
        h = Math.min(h, p), m = Math.max(m, p);
      }
      const c = (d * n + u) * 4;
      s[c] = r[0], s[c + 1] = r[1], s[c + 2] = r[2], s[c + 3] = Math.round(m - h);
    }
}
const ou = "card-glint:eighth-stock-rule";
function wf(t, e) {
  const r = nt(t)?.outerRule;
  if (!r) return [];
  const n = e.get(r.source);
  if (!n) throw Error("Eighth stock contour unavailable: " + r.source);
  return [
    {
      url: ou,
      key: JSON.stringify(["eighth-stock-rule-v1", r, Ke(n)]),
      bytes: 732 * 1020 * 4,
      build: async () => {
        const o = $();
        o.width = 732, o.height = 1020;
        try {
          const s = o.getContext("2d", { willReadFrequently: !0 });
          if (!s) throw Error("Eighth stock-rule preparation needs Canvas2D");
          s.drawImage(n, 0, 0, 732, 1020);
          const a = s.getImageData(0, 0, 732, 1020);
          return bf(a, r.width * 1.5, r.rgb), s.putImageData(a, 0, 0), await createImageBitmap(o);
        } finally {
          o.width = o.height = 0;
        }
      }
    }
  ];
}
function vf(t, e, r) {
  if (!nt(e)?.outerRule) return;
  const n = r.get(ou);
  if (!n) throw Error("Eighth stock rule was not prepared");
  t.drawImage(n, 0, 0, 488, 680);
}
function su(t, e) {
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
function Sf(t, e, r, n) {
  const o = n.inkExpansion ?? 0;
  if (!Number.isFinite(o) || o < 0 || o > 1)
    throw Error("Historical mana ink expansion is outside its supported range.");
  if (!o) return;
  if (!Number.isInteger(e) || !Number.isInteger(r) || e <= 0 || r <= 0 || t.length !== e * r * 4)
    throw Error("Historical mana ink pixels do not match their dimensions.");
  const s = Oe(n.discColor), a = Oe(n.inkColor), i = s.map((c, g) => c - a[g]), l = i.reduce((c, g) => c + g * g, 0);
  if (l < 0.01) throw Error("Historical mana palette has no ink contrast");
  const d = new Float32Array(e * r);
  for (let c = 0; c < d.length; c++)
    t[c * 4 + 3] < 255 || (d[c] = Math.max(
      0,
      Math.min(1, i.reduce((g, f, p) => g + f * (s[p] - t[c * 4 + p] / 255), 0) / l)
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
      let p = d[f];
      for (const w of m) {
        const y = g + w.x, b = c + w.y;
        y >= 0 && y < e && b >= 0 && b < r && (p = Math.max(p, d[b * e + y] * w.weight));
      }
      if (!(p <= d[f]))
        for (let w = 0; w < 3; w++)
          t[f * 4 + w] = Math.round(255 * (s[w] * (1 - p) + a[w] * p));
    }
}
function Cf(t, e, r) {
  const n = Oe(e.discColor), o = Oe(e.inkColor), s = n.map((i, l) => i - o[l]), a = s.reduce((i, l) => i + l * l, 0);
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
async function kf(t, e, r, n) {
  const o = $();
  o.width = t.width, o.height = t.height;
  try {
    const s = o.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("Historical mana preparation needs Canvas2D.");
    s.drawImage(t, 0, 0);
    const a = s.getImageData(0, 0, o.width, o.height);
    return e.inkExpansion && Sf(a.data, o.width, o.height, e), Cf(a.data, e, r), n && su(a.data, n), s.putImageData(a, 0, 0), await createImageBitmap(o);
  } finally {
    o.width = o.height = 0;
  }
}
function Mf(t, e, r) {
  const { width: n, height: o, data: s } = t;
  if (e.width !== n || e.height !== o || e.data.length !== s.length || !Number.isInteger(r) || r < 0 || r > Math.max(n, o))
    throw RangeError("Invalid frame material selection");
  const a = new Uint8Array(n * o), i = new Uint8Array(n * o), l = new Int32Array(Math.max(n, o));
  for (const d of [!1, !0]) {
    const u = d ? o : n, h = d ? n : o;
    for (let m = 0; m < h; m++) {
      let c = 0, g = 0, f = -1;
      const p = (y) => d ? y * n + m : m * n + y, w = (y) => d ? a[p(y)] : s[p(y) * 4 + 3];
      for (let y = 0; y < u; y++) {
        const b = Math.min(u - 1, y + r);
        for (; f < b; ) {
          for (f++; g > c && w(l[g - 1]) <= w(f); ) g--;
          l[g++] = f;
        }
        for (; c < g && l[c] < y - r; ) c++;
        (d ? i : a)[p(y)] = w(l[c]);
      }
    }
  }
  for (let d = 0; d < i.length; d++)
    s[d * 4 + 3] = Math.max(
      s[d * 4 + 3],
      Math.round(i[d] * e.data[d * 4 + 3] / 255)
    );
}
function Tf(t, e, r) {
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
function xf(t, e) {
  const [r, n, o] = e.sourceInk;
  for (let s = 0; s < t.length; s += 4) {
    if (!t[s + 3]) continue;
    const a = Math.hypot(t[s] - r, t[s + 1] - n, t[s + 2] - o), i = Math.max(0, 1 - a / 24) ** 2;
    for (let l = 0; l < 3; l++)
      t[s + l] = Math.round(
        t[s + l] + i * (e.body[l] - e.sourceInk[l])
      );
  }
}
function Rf(t, e) {
  if (t.colorCalibration !== "set-hsb-v1") return [];
  const r = fl(t);
  if (!r) return [];
  const n = e.get(r.source);
  if (!n) throw Error("Modern basic-land glyph unavailable: " + r.source);
  return [
    {
      url: r.source,
      key: JSON.stringify([
        "modern-basic-ink-v1",
        r.source,
        r.sha256,
        Ke(n),
        n.width,
        n.height,
        r.sourceInk,
        r.body
      ]),
      bytes: n.width * n.height * 4,
      build: async () => {
        const o = $();
        o.width = n.width, o.height = n.height;
        try {
          const s = o.getContext("2d", { willReadFrequently: !0 });
          if (!s) throw Error("Modern basic-land preparation needs Canvas2D.");
          s.drawImage(n, 0, 0);
          const a = s.getImageData(0, 0, o.width, o.height);
          return xf(a.data, r), s.putImageData(a, 0, 0), await createImageBitmap(o);
        } finally {
          o.width = o.height = 0;
        }
      }
    }
  ];
}
function Lf(t, e) {
  const r = na(t);
  return r ? [
    {
      url: r.frame,
      kind: "frame",
      color: (o) => ru(o, r.palette)
    },
    ...r.glyph ? [
      {
        url: r.glyph,
        kind: "glyph",
        color: (o) => nu(o, r.palette.glyph)
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
        s === "frame" ? [r.palette, Ln, tu] : r.palette.glyph
      ]),
      bytes: i.width * i.height * 4,
      build: async () => {
        const l = $();
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
function Ef(t, e) {
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
function Af(t, e) {
  const r = Ie(t);
  if (!r) return [];
  const n = It(t.setCode, t.borderColor).border === "#090806";
  if (!n && !r.rightImage) return [];
  const o = Ft(t) ?? "#090806", s = [1, 3, 5].map((l) => parseInt(o.slice(l, l + 2), 16)), a = e.get(r.image);
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
        const l = $();
        l.width = a.width, l.height = a.height;
        try {
          const d = l.getContext("2d", { willReadFrequently: !0 });
          if (!d) throw Error("Stamp preparation needs Canvas2D.");
          let u;
          i && (d.drawImage(i, 0, 0), u = d.getImageData(0, 0, l.width, l.height), d.clearRect(0, 0, l.width, l.height)), d.drawImage(a, 0, 0);
          const h = d.getImageData(0, 0, l.width, l.height);
          u && Ef(h, u);
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
const Bf = {
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
function If(t, e) {
  if (t.frameTemplate !== "future") return [];
  const r = t.setCode?.toLowerCase() === "fut" && t.colorCalibration === "set-hsb-v1", n = /* @__PURE__ */ new Set();
  return [...new Set(t.manaSymbols ?? [])].flatMap((o) => {
    const s = /^(?:\d+|X)$/.test(o), a = r ? Bf[s ? "N" : o] : void 0, i = _n(o), l = i ? e.get(i) : void 0;
    if (!a && !s || !i || !l || n.has(i)) return [];
    n.add(i);
    const d = s ? Do().map((u) => {
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
          s ? Do() : null
        ]),
        bytes: l.width * l.height * 4,
        build: () => Of(l, a, d)
      }
    ];
  });
}
async function Of(t, e, r) {
  const n = $();
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
async function $f(t, e, r) {
  t = Ht(t);
  const n = { images: e, dispose() {
  } }, o = ph(t) ?? Xo(t, "INK"), s = /* @__PURE__ */ new Map(), a = new Map(Object.entries(Fd(t))), i = {}, l = {}, d = /* @__PURE__ */ new Set(), u = [], h = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...[...(t.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((C) => C[1])
  ]);
  for (const C of t.rulesParagraphs ?? [])
    for (const T of C.runs) for (const R of T.text.matchAll(/\{([^}]+)\}/g)) h.add(R[1]);
  for (const C of h) {
    const T = /^\d+$/.test(C) || C === "X" && (dr(t) || nt(t)) ? "N" : C, R = Po(t, C), A = R?.discColor ?? lo[T], L = Xo(t, T) ?? (R && lo[T] ? Oe(T === "W" ? "#efe7cb" : lo[T]) : void 0);
    if (R && d.add(C), R?.glyphScale !== void 0 && (l[C] = R.glyphScale), !L || !A) continue;
    const O = R?.url ?? tr(C);
    if (o && O && /^[WUBRGN]$/.test(T) && s.set(O, {
      inkTarget: o,
      paper: L,
      sourceInk: R ? Oe(R.inkColor) : [13 / 255, 15 / 255, 15 / 255]
    }), R) {
      const B = e.get(R.url);
      if (!B) throw Error(`Historical mana asset unavailable: ${C}`);
      u.push({ url: R.url, source: B, palette: R, target: L });
    } else O && a.set(O, Gf(A, L));
    i[C] = `rgb(${L.map((B) => Math.round(B * 255)).join(" ")})`;
  }
  const m = h.has("W") && Qt(t, "W") === "historic-font", c = U0(t, e), g = F0(t, e), f = wf(t, e), p = yf(t, e), w = [
    ...p.length ? p : Lf(t, e),
    ...Rf(t, e)
  ], y = Af(t, e), b = If(t, e);
  if (!f.length && !a.size && !u.length && !w.length && !c.length && !g.length && !y.length && !b.length && !Object.keys(i).length && !m)
    return n;
  const v = Object.assign(new Map(e), {
    manaInkColor: o ? `rgb(${o.map((C) => Math.round(C * 255)).join(" ")})` : void 0,
    manaColors: i,
    originalManaGlyphs: d,
    originalWhiteGlyph: m,
    manaGlyphScales: l
  }), S = [...a].flatMap(([C, T]) => {
    const R = e.get(C);
    return R ? [{ url: C, source: R, adjustment: T }] : [];
  }), k = [
    ...f,
    ...c,
    ...g,
    ...w,
    ...y,
    ...b,
    ...S.map(({ url: C, source: T, adjustment: R }) => ({
      url: C,
      key: s.has(C) ? JSON.stringify([
        xi(C, T.width, T.height, R),
        "mana-ink-v1",
        s.get(C)
      ]) : xi(C, T.width, T.height, R),
      bytes: T.width * T.height * 4,
      build: () => Pf(T, R, e, s.get(C))
    })),
    ...u.map(({ url: C, source: T, palette: R, target: A }) => ({
      url: C,
      key: JSON.stringify([
        "historical-mana-palette-v1",
        C,
        T.width,
        T.height,
        R,
        A,
        ...s.has(C) ? ["mana-ink-v1", s.get(C)] : []
      ]),
      bytes: T.width * T.height * 4,
      build: () => kf(T, R, A, s.get(C))
    }))
  ];
  let M = [];
  try {
    M = await qd.acquireMany(k, r), k.forEach(({ url: C }, T) => v.set(C, M[T].value));
    for (const C of d) {
      const T = Po(t, C), R = v.get(T.url), A = tr(C);
      if (!R || !A) throw Error(`Historical mana asset unavailable: ${C}`);
      v.set(A, R);
    }
    return { images: v, dispose: () => M.forEach((C) => C.release()) };
  } catch (C) {
    throw M.forEach((T) => T.release()), C;
  }
}
function xi(t, e, r, n) {
  return JSON.stringify(["frame-hsb-paper-mask-v3", t, e, r, n]);
}
async function Pf(t, e, r, n) {
  const o = $();
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
      if (Mf(u, m, Math.round(e.blend.outset * o.width)), d)
        for (let c = 3; c < d.data.length; c += 4)
          d.data[c] = Math.round(d.data[c] * (1 - u.data[c] / 255));
    }
    const h = e.outerStockMaskSource ? i(e.outerStockMaskSource) : void 0;
    return gn(a, e, d, h), e.blend && u && Tf(a, u, e.blend), n && su(a.data, n), s.putImageData(a, 0, 0), await createImageBitmap(o);
  } finally {
    o.width = o.height = 0;
  }
}
function Gf(t, e) {
  const r = Oe(t), [n, o, s] = cn(r), [a, i, l] = cn(e);
  if (o <= 0 || s <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (a - n + 540) % 360 - 180,
    saturationScale: i / o,
    brightnessScale: l / s
  };
}
function sa(t, e) {
  if (t.layout && t.layout !== "normal") return [0, 0];
  const r = t.setCode?.toLowerCase(), n = e === "eighth" ? nt(t)?.headings.title : void 0;
  if (n) return [n.dx, n.dy];
  if (t.borderColor && t.borderColor !== (r === "8ed" ? "white" : "black")) return [0, 0];
  if (e === "retro" && Ot(t)) return [-18.5, -6];
  if (t.legendary ?? /\bLegendary\b/.test(t.typeLine ?? "")) return [0, 0];
  if (e === "retro") {
    if (r === "lea") return [-1.5, 1.5];
    if (r === "leb") return [-1, 2];
  }
  return e === "eighth" && r === "8ed" ? [0.5, -2] : e === "modern" && r === "m21" ? [-1, 1] : [0, 0];
}
const Ri = [0.08, 0.36, 0.64, 0.92, 1], Ff = [0.18, 0.18, 0.17];
function Vo(t, e, r, n, o, s) {
  if (o.length !== 2) return;
  const { box: a, width: i } = s, l = t - r / 2, d = t + r / 2, u = e - n / 2, h = e + n / 2;
  if (d <= a.left || l >= a.right || h <= a.top || u >= a.bottom || l >= a.left + i.left && d <= a.right - i.right && u >= a.top + i.top && h <= a.bottom - i.bottom)
    return;
  const m = (p) => Math.max(
    0,
    Math.min(d, a.right - i.right * p) - Math.max(l, a.left + i.left * p)
  ) * Math.max(
    0,
    Math.min(h, a.bottom - i.bottom * p) - Math.max(u, a.top + i.top * p)
  ) / (r * n);
  let c = m(0), g = 0;
  const f = [0, 0, 0];
  for (let p = 0; p < Ri.length; p++) {
    const w = m(Ri[p]), y = Math.max(0, c - w), b = p === 0 || p === 4 ? s.edge ?? Ff : o[p === 2 ? 1 : 0];
    for (let v = 0; v < 3; v++) f[v] += b[v] * y;
    g += y, c = w;
  }
  if (g)
    return { color: [f[0] / g, f[1] / g, f[2] / g], alpha: g };
}
const Mr = {
  left: 61.063333333333325 / (488 / 1500),
  right: 427.9656666666666 / (488 / 1500),
  top: 404.6309523809524 / (680 / 2100),
  bottom: 606.325 / (680 / 2100)
}, Ut = { left: 188, right: 1324, top: 1253, bottom: 1871 }, yr = { left: 26, right: 29, top: 29, bottom: 28 }, aa = 6.375, Li = aa / (488 / 1500), Ei = aa / (680 / 2100), Wf = { left: Li, right: Li, top: Ei, bottom: Ei }, _f = {
  W: [186 / 255, 177 / 255, 176 / 255],
  U: [72 / 255, 110 / 255, 137 / 255],
  B: [88 / 255, 77 / 255, 85 / 255],
  R: [182 / 255, 62 / 255, 81 / 255],
  G: [129 / 255, 149 / 255, 92 / 255]
};
function Uf(t, e, r) {
  const n = r?.box ?? Mr, o = r?.width ?? Wf;
  if (e.length !== 2) return;
  const a = [...e].sort((g, f) => "RGUBW".indexOf(g) - "RGUBW".indexOf(f)).map((g) => (r?.palette ?? _f)[g]);
  if (!a[0] || !a[1]) return;
  const i = 1500 / t.width, l = 2100 / t.height, d = t.data.slice(), u = Math.min(n.left, Ut.left), h = Math.max(n.right, Ut.right), m = Math.min(n.top, Ut.top), c = Math.max(n.bottom, Ut.bottom);
  for (let g = Math.floor(m / l); g < Math.ceil(c / l); g++)
    for (let f = Math.floor(u / i); f < Math.ceil(h / i); f++) {
      const p = Vo((f + 0.5) * i, (g + 0.5) * l, i, l, [a[0], a[1]], {
        box: n,
        width: o,
        edge: r?.edge
      }), w = (f + 0.5) * i, y = (g + 0.5) * l, b = Vo(w, y, i, l, [a[0], a[1]], {
        box: Ut,
        width: yr
      });
      if (!p && !b) continue;
      const v = (g * t.width + f) * 4;
      if (t.data[v + 3]) {
        if (b) {
          const S = [
            w - Ut.left,
            Ut.right - w,
            y - Ut.top,
            Ut.bottom - y
          ], k = S.indexOf(Math.min(...S)), M = w >= n.left && w < n.right && y >= n.top && y < n.bottom, C = k === 0 ? Ut.left + (M ? yr.left + 2 : -2) : k === 1 ? Ut.right - (M ? yr.right + 2 : -2) : w, T = k === 2 ? Ut.top + (M ? yr.top + 2 : -2) : k === 3 ? Ut.bottom - (M ? yr.bottom + 2 : -2) : y, R = (Math.floor(T / l) * t.width + Math.floor(C / i)) * 4;
          for (let A = 0; A < 3; A++)
            t.data[v + A] = d[v + A] * (1 - b.alpha) + d[R + A] * b.alpha;
        }
        if (p)
          for (let S = 0; S < 3; S++)
            t.data[v + S] = t.data[v + S] * (1 - p.alpha) + p.color[S] * 255 * p.alpha;
      }
    }
}
const Tr = { left: 166.8794, right: 1338.8298, top: 1255.6105, bottom: 1882.7268 }, Ai = 6.375 / (488 * 0.984 / 1500 * 1.001), Bi = 6.375 / (680 * 0.99 / 2100 * 1.001), Df = { left: Ai, right: Ai, top: Bi, bottom: Bi };
function Nf(t, e, r, n, o) {
  return Vo(t, e, r, n, o, {
    box: Tr,
    width: Df
  });
}
const Co = {
  W: { hueDegrees: 8.4847, saturationScale: 0.42831, brightnessScale: 0.97071 },
  U: { hueDegrees: 164.886, saturationScale: 0.25883, brightnessScale: 0.841 },
  B: { hueDegrees: 157.329, saturationScale: 0.20015, brightnessScale: 0.62552 },
  R: { hueDegrees: -23.3867, saturationScale: 0.88939, brightnessScale: 0.9205 },
  G: { hueDegrees: 30.7835, saturationScale: 0.6094, brightnessScale: 0.79916 }
}, jf = {
  W: { hueDegrees: 7.44281, saturationScale: 0.570206, brightnessScale: 0.845188 },
  U: { hueDegrees: -177.38556, saturationScale: 0.121282, brightnessScale: 0.656904 },
  B: { hueDegrees: 0, saturationScale: 0, brightnessScale: 0.452356 },
  R: { hueDegrees: -34.23136, saturationScale: 1.238404, brightnessScale: 0.866109 },
  G: { hueDegrees: 42.19413, saturationScale: 0.716825, brightnessScale: 0.656904 }
}, Ii = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Oi = {
  W: [0.9, 0.91, 0.9],
  U: [0.32, 0.58, 0.75],
  B: [0.38, 0.4, 0.38],
  R: [0.8, 0.32, 0.34],
  G: [0.6, 0.66, 0.29]
}, $i = { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.992232 };
function zf(t, e, r) {
  const n = r ? Co : jf, o = e[0], s = e[1] ?? o;
  if (!o || !s || !Co[o] || !Co[s]) return;
  const a = e.length === 2 ? [...e].sort((l, d) => "RGUBW".indexOf(l) - "RGUBW".indexOf(d)).map((l) => Oi[l]) : [], i = a.length ? t.data.slice() : void 0;
  for (let l = 0; l < t.height; l++)
    for (let d = 0; d < t.width; d++) {
      const u = (l * t.width + d) * 4;
      if (!t.data[u + 3]) continue;
      const h = (d + 0.5) * 1500 / t.width, m = (l + 0.5) * 2100 / t.height, c = [t.data[u] / 255, t.data[u + 1] / 255, t.data[u + 2] / 255], g = Math.max(...c), f = Nf(h, m, 1500 / t.width, 2100 / t.height, a), p = i ? h >= Tr.left && h < Tr.right && m >= Tr.top && m < Tr.bottom : h >= 187 && h < 1320 && m >= 1280 && m < 1864, w = i && h >= 165 && h <= 1345 && m >= 1248 && m <= 1885;
      if (!f && g < 0.075 && !(i && p) && !w) continue;
      const y = Math.min(h - 126, 1379 - h, m - 153, 1171 - m), b = Math.min(h - 170, 1340 - h, m - 1253, 1880 - m), v = y >= -1 && y < 13 || b >= -1 && b < 29;
      let S;
      if (p) {
        const k = Math.min(
          (h - 187) * 488 * 0.984 / 1500,
          (1320 - h) * 488 * 0.984 / 1500,
          (m - 1280) * 680 * 0.99 / 2100,
          (1864 - m) * 680 * 0.99 / 2100
        ), M = Math.floor(Math.max(0, k) / 11.5);
        let C = c;
        if (i && (h < 190 || m < 1284)) {
          const T = Math.min(t.width - 1, Math.max(d, Math.ceil(190 * t.width / 1500))), A = (Math.min(
            t.height - 1,
            Math.max(l, Math.ceil(1284 * t.height / 2100))
          ) * t.width + T) * 4;
          C = [i[A] / 255, i[A + 1] / 255, i[A + 2] / 255];
        }
        S = te(C, n[M % 2 ? s : o]);
      } else if (w) {
        const k = [h - 165, 1345 - h, m - 1248, 1885 - m], M = k.indexOf(Math.min(...k)), C = M === 0 ? 160 : M === 1 ? 1350 : h, T = M === 2 ? 1240 : M === 3 ? 1890 : m, R = Math.min(t.width - 1, Math.floor(C * t.width / 1500)), L = (Math.min(t.height - 1, Math.floor(T * t.height / 2100)) * t.width + R) * 4;
        S = te(
          [i[L] / 255, i[L + 1] / 255, i[L + 2] / 255],
          r ? $i : Ii
        );
      } else if (v && c[0] > 0.45 && c[1] > 0.35 && c[2] < Math.min(c[0], c[1]) * 0.72) {
        const k = Oi[(y >= -1 && y < 13 ? y < 6 : b < 14) ? s : o], M = g / 0.97;
        S = [
          Math.min(1, k[0] * M),
          Math.min(1, k[1] * M),
          Math.min(1, k[2] * M)
        ];
      } else S = te(c, r ? $i : Ii);
      for (let k = 0; k < 3; k++)
        t.data[u + k] = Math.round(
          255 * (f ? f.color[k] * f.alpha + S[k] * (1 - f.alpha) : S[k])
        );
    }
}
async function Yf(t, e, r) {
  if (!vt(t)) return { images: e, dispose() {
  } };
  const n = e.get(xr);
  if (!n) throw Error("Revised land frame asset unavailable");
  const o = Tl(t), s = xe(t), a = await ra.acquire(
    JSON.stringify([
      "revised-fourth-land-v5",
      xr,
      n.width,
      n.height,
      o,
      s
    ]),
    n.width * n.height * 4,
    async () => {
      const l = $();
      l.width = n.width, l.height = n.height;
      try {
        const d = l.getContext("2d", { willReadFrequently: !0 });
        if (!d) throw Error("Revised land preparation needs Canvas2D");
        d.drawImage(n, 0, 0);
        const u = d.getImageData(0, 0, l.width, l.height);
        zf(u, o, s), d.putImageData(u, 0, 0);
        const h = l.width * 160 / 1500, m = l.height * 1240 / 2100, c = l.width * 1190 / 1500, g = l.height * 654 / 2100, f = l.width * (244 - 2.404) / (488 * 0.984), p = l.height * (515 - 9.9) / (680 * 0.99);
        return d.drawImage(
          l,
          h,
          m,
          c,
          g,
          f + (h - f) * 1.001,
          p + (m - p) * 1.001 + l.height * 0.25 / (680 * 0.99),
          c * 1.001,
          g * 1.001
        ), await createImageBitmap(l);
      } finally {
        l.width = l.height = 0;
      }
    },
    r
  ), i = Object.assign(new Map(e), e);
  return i.set(xr, a.value), { images: i, dispose: () => a.release() };
}
async function qf(t, e, r) {
  if (vt(t)) return Yf(t, e, r);
  const n = ie(t);
  if (!n) return { images: e, dispose() {
  } };
  const o = (m) => {
    const c = e.get(m);
    if (!c) throw Error(`Historical dual-land asset unavailable: ${m}`);
    return c;
  }, s = ["lea", "leb"].includes(t.setCode?.toLowerCase() ?? ""), a = ms(t), i = o(n.base), l = o(n.overlay), d = o(n.mask), [u] = await ra.acquireMany(
    [
      {
        key: JSON.stringify([
          "abu-dual-frame-v4",
          ...s ? ["abu-dual-paper-up6-v1"] : [],
          ...a ? ["abu-dual-art-bottom-up2-v1"] : [],
          ...n.pinline ? [n.pinline] : [],
          n,
          i.width,
          i.height,
          Fd(t)
        ]),
        bytes: i.width * i.height * 4,
        build: async () => {
          const m = $(), c = $();
          m.width = c.width = i.width, m.height = c.height = i.height;
          try {
            const g = m.getContext("2d"), f = c.getContext("2d");
            if (!g || !f) throw Error("Historical dual-land preparation needs Canvas2D.");
            if (f.drawImage(l, 0, 0, i.width, i.height), f.globalCompositeOperation = "destination-in", f.drawImage(d, 0, 0, i.width, i.height), g.drawImage(i, 0, 0), g.drawImage(c, 0, 0), n.outline !== n.overlay) {
              const w = o(n.outline);
              g.save(), g.beginPath();
              const y = (v) => Math.round(v / 1500 * i.width), b = (v) => Math.round(v / 2100 * i.height);
              g.rect(y(78), b(90), y(1422) - y(78), b(2010) - b(90)), g.rect(y(108), b(120), y(1392) - y(108), b(1980) - b(120)), g.clip("evenodd"), g.drawImage(w, 0, 0, i.width, i.height), g.restore();
            }
            const p = g.getImageData(0, 0, i.width, i.height);
            return Uf(p, mn(t), n.pinline), s && Hf(p, 6), a && Xf(p, a), g.putImageData(p, 0, 0), await createImageBitmap(m);
          } finally {
            m.width = m.height = c.width = c.height = 0;
          }
        }
      }
    ],
    r
  ), h = Object.assign(new Map(e), e);
  return h.set(n.base, u.value), { images: h, dispose: () => u.release() };
}
function Hf(t, e, r = 2) {
  if (!Number.isFinite(e) || e < 0 || e > 12 || !Number.isFinite(r) || r < 1 || r > 4)
    throw Error("Invalid historical paper reflow");
  const { width: n, height: o, data: s } = t;
  if (!Number.isInteger(n) || !Number.isInteger(o) || n < 1 || o < 1 || s.length !== n * o * 4)
    throw Error("Invalid historical paper raster");
  const a = n / 488, i = o / 680, l = {
    left: Mr.left * (488 / 1500) - r,
    right: Mr.right * (488 / 1500) + r,
    top: Mr.top * (680 / 2100) - r,
    bottom: Mr.bottom * (680 / 2100) + r
  }, d = aa + r + 0.5, u = l.bottom - e, h = l.bottom - l.top - 2 * d, m = h - e, c = s.slice(), g = (f) => {
    const p = Math.max(0, Math.min(1, f));
    return p * p * (3 - 2 * p);
  };
  for (let f = Math.max(0, Math.floor(l.top * i)); f < Math.min(o, Math.ceil(l.bottom * i)); f++) {
    const p = (f + 0.5) / i;
    let w = p;
    p >= u || p >= u - d ? w = p + e : p > l.top + d && (w = l.top + d + (p - l.top - d) * h / m);
    const y = Math.max(0, Math.min(o - 1, w * i - 0.5)), b = Math.floor(y), v = Math.min(o - 1, b + 1), S = y - b;
    for (let k = Math.max(0, Math.floor(l.left * a)); k < Math.min(n, Math.ceil(l.right * a)); k++) {
      const M = (k + 0.5) / a, C = g((M - l.left) / r) * g((l.right - M) / r) * g((l.bottom - p) / r);
      if (!C) continue;
      const T = (f * n + k) * 4, R = (b * n + k) * 4, A = (v * n + k) * 4;
      for (let L = 0; L < 3; L++) {
        const O = c[R + L] * (1 - S) + c[A + L] * S;
        s[T + L] = c[T + L] * (1 - C) + O * C;
      }
    }
  }
}
function Xf(t, e) {
  if (!Number.isFinite(e) || e < 0 || e > 4)
    throw Error("Invalid art-height trial");
  const { width: r, height: n, data: o } = t;
  if (!Number.isInteger(r) || !Number.isInteger(n) || r < 1 || n < 1 || o.length !== r * n * 4)
    throw Error("Invalid art-height raster");
  if (e === 0) return;
  const s = o.slice(), a = r / 488, i = n / 680, l = { left: 47, right: 441, top: 65, bottom: 384 }, d = 2, u = 14, h = l.bottom - l.top - 2 * u, m = h - e, c = l.bottom - e, g = (f) => {
    const p = Math.max(0, Math.min(1, f));
    return p * p * (3 - 2 * p);
  };
  for (let f = Math.floor(l.top * i); f < Math.ceil(l.bottom * i); f++) {
    const p = (f + 0.5) / i;
    if (p <= l.top + u) continue;
    const w = p >= c - u ? p + e : l.top + u + (p - l.top - u) * h / m, y = Math.max(0, Math.min(n - 1, w * i - 0.5)), b = Math.floor(y), v = Math.min(n - 1, b + 1), S = y - b;
    for (let k = Math.floor(l.left * a); k < Math.ceil(l.right * a); k++) {
      const M = (k + 0.5) / a, C = g((M - l.left) / d) * g((l.right - M) / d) * g((l.bottom - p) / d);
      if (!C) continue;
      const T = (f * r + k) * 4, R = (b * r + k) * 4, A = (v * r + k) * 4, L = s[R + 3] * (1 - S) + s[A + 3] * S, O = s[T + 3] * (1 - C) + L * C;
      for (let B = 0; B < 3; B++) {
        const U = s[R + B] * s[R + 3] * (1 - S) + s[A + B] * s[A + 3] * S;
        o[T + B] = O ? (s[T + B] * s[T + 3] * (1 - C) + U * C) / O : 0;
      }
      o[T + 3] = O;
    }
  }
}
const Jf = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", yt = {
  get fem() {
    return _u("fem").setSymbols.default;
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
}, Kf = {
  W: { ...yt.por, right: 436.75, centerY: 389.75 },
  U: { ...yt.por, right: 436.5, centerY: 392.75 },
  R: { ...yt.por, right: 433.75, centerY: 392 },
  G: { ...yt.por, right: 434, centerY: 390.75 }
}, Vf = {
  all: {
    U: { ...yt.all, right: 427.5, centerY: 393.25 },
    W: { ...yt.all, right: 427.25, centerY: 392.75 }
  },
  mir: {
    G: { ...yt.mir, right: 437, centerY: 390.25 },
    W: { ...yt.mir, right: 437.75, centerY: 389.25 }
  },
  sth: {
    G: { ...yt.sth, right: 434, centerY: 391 },
    R: { ...yt.sth, right: 433.5, centerY: 391.75 },
    W: { ...yt.sth, right: 435.25, centerY: 389.25 }
  },
  tmp: {
    U: { ...yt.tmp, right: 433, centerY: 392.75 },
    W: { ...yt.tmp, right: 433.25, centerY: 389.5 }
  },
  vis: {
    W: { ...yt.vis, right: 437.5, centerY: 389.25 }
  },
  wth: {
    W: { ...yt.wth, right: 435.75, centerY: 389.75 }
  },
  hml: {
    R: { ...yt.hml, right: 437.75, centerY: 393.5 }
  },
  por: Kf
};
function au(t) {
  const e = t.setCode?.toLowerCase() ?? "";
  if (t.setSymbol) return null;
  if (at(t)) {
    const n = rt(t)?.setSymbols, o = e === "chr" ? cl(t.name) : "default", s = o && n?.[o] || n?.default;
    if (s) return s;
  }
  if (!Object.hasOwn(yt, e)) return null;
  const r = F(t);
  return r.length === 1 && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") ? Vf[e]?.[r[0]] ?? yt[e] : yt[e];
}
const Pi = {
  // Black outer contour after the checksum-guarded LEG SVG repair.
  "leg/retro/black": [3.25, 1.5, 1.05, 1.125],
  "6ed/retro/white": [2, -2, 1.08, 1.08],
  // Filled crescent after rim repair; independent width/height on fixed poses.
  "drk/retro/black": [2.5, -1.25, 1.146, 1.203]
}, Gi = {
  m15: { family: "m15-accurate", delta: [1, 0, 1, 1] },
  m21: { family: "m15-accurate", delta: [2, 0, 1.1, 1.06] },
  woe: { family: "m15-accurate", delta: [2, 0, 1.08, 1.08] },
  tdm: { family: "m15-accurate", delta: [0, 0, 1.08, 1.08] },
  "8ed": { family: "eighth", delta: [-4, 0, 1, 0.92] },
  "9ed": { family: "eighth", delta: [0, 1, 0.9, 0.92] }
};
function Zf(t, e, r) {
  if (t.frameTreatment === "colorshifted") return r;
  const n = t.frameAssetFamily ?? (ne(t) ? "m15-accurate" : void 0), o = t.setCode?.toLowerCase() ?? "", s = Object.hasOwn(Gi, o) ? Gi[o] : void 0;
  let a = r;
  s && !t.setSymbol && Gt(e) && s.family === n && (a = iu(r, s.delta)), a = n ? ia(t, e, a, n) : a;
  const i = nt(t);
  return i && !i.inheritedFrom && !t.setSymbol && Gt(e) ? ke(a, i.setSymbol) : a;
}
function ia(t, e, r, n) {
  if (t.setSymbol || !Gt(e) || W !== Jf || (t.layout ?? "normal") !== "normal" || ["component", "m15-accurate"].includes(n) && G(t).legendary || n === "retro" && au(t)?.placement === "native") return r;
  const o = t.borderColor ?? (n === "retro" ? St(t) : It(t.setCode).border === "#eeedeb" ? "white" : "black"), s = `${t.setCode?.trim().toLowerCase() ?? ""}/${n}/${o}`;
  if (s === "leg/retro/black" && !Ot(t)) return r;
  const a = Object.hasOwn(Pi, s) ? Pi[s] : Object.hasOwn(ga, s) ? ga[s] : void 0;
  return a ? iu(r, a) : r;
}
function iu(t, e) {
  const [r, n, o, s] = t, [a, i, l, d] = e;
  return [r + o + a - o * l, n + s / 2 + i - s * d / 2, o * l, s * d];
}
const Qf = 0.045;
function lu(t) {
  const e = rt(t)?.cornerRadius;
  return e !== void 0 ? e : lt(t) && t.setCode?.toLowerCase() === "lea" ? o0 : Qf;
}
const br = "#fbf0c5", je = "#ccdaf2", Zr = "#9c9995", wr = "#edaa8d", ze = "#dde6e2", tp = {
  W: [br, br],
  U: [je, je],
  B: [Zr, Zr],
  R: [wr, wr],
  G: [ze, ze],
  WU: [br, je],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [wr, br],
  WG: [ze, br],
  UB: [je, Zr],
  UR: [je, wr],
  UG: [ze, je],
  BR: ["#b4afb5", "#f2b096"],
  BG: [Zr, ze],
  RG: [wr, ze]
};
function ep(t, e, r) {
  if (!e.land) return;
  const n = tp[e.frame];
  if (!n) return;
  const o = 34 + r, s = 420 - 2 * r, a = t.createLinearGradient(o, 0, o + s, 0);
  a.addColorStop(0, n[0]), a.addColorStop(0.35, n[0]), a.addColorStop(0.65, n[1]), a.addColorStop(1, n[1]), t.save(), t.globalCompositeOperation = "multiply", t.fillStyle = a, t.fillRect(o, 425, s, 203.5), t.restore();
}
function rp(t, e, r, n) {
  if (!e.land || e.frame !== "Artifact") {
    n();
    return;
  }
  const o = 34 + r, s = 420 - 2 * r;
  for (const a of [!1, !0])
    t.save(), t.beginPath(), a || t.rect(0, 0, 488, 680), t.rect(o, 425, s, 203.5), t.clip("evenodd"), t.filter = `grayscale(1) brightness(${a ? 0.9 : 0.63})`, n(), t.restore();
}
function np(t, e, r) {
  if (!e.land) return;
  t.save(), t.shadowColor = "transparent";
  const n = t.createLinearGradient(0, 625.75, 0, 628.25);
  n.addColorStop(0, "#ffffff00"), n.addColorStop(0.3, "#ffffffb0"), n.addColorStop(0.7, "#ffffffb0"), n.addColorStop(1, "#ffffff00"), t.fillStyle = n, t.fillRect(34 + r, 625.75, 420 - 2 * r, 2.5), t.restore();
}
function du(t) {
  if (t.setSymbol) return null;
  const e = t.setCode?.toLowerCase();
  return e === "m15" || e === "war" ? e : null;
}
function uu(t, e, r, n, o, s, a, i, l, d) {
  const [u, h, m, c] = d ? r === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, r === "m15" ? 0.7 : 1.2];
  o += h - a * (u - 1) / 2, s += m - i * (u - 1) / 2, a *= u, i *= u;
  const g = !n || n === "common", f = $(), p = 3, w = 4;
  f.width = Math.ceil((a + p * 2) * w), f.height = Math.ceil((i + p * 2) * w);
  const y = f.getContext("2d");
  y.scale(w, w), y.translate(p, p), y.drawImage(
    e,
    l[0] * e.width,
    l[1] * e.height,
    l[2] * e.width,
    l[3] * e.height,
    0,
    0,
    a,
    i
  ), y.globalCompositeOperation = "source-in";
  const b = n === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : n === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], v = y.createLinearGradient(0, i * 0.65, a, i * 0.35);
  v.addColorStop(0, b[0]), v.addColorStop(0.35, b[1]), v.addColorStop(0.6, b[2]), v.addColorStop(1, b[3]), y.fillStyle = g ? "#111111" : v, y.fillRect(0, 0, a, i);
  const S = r === "m15" ? 32 : 27, k = new Path2D(
    r === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), M = new DOMMatrix().translate(-l[0] * a / l[2], -l[1] * i / l[3]).scale(a / (S * l[2]), i / (32 * l[3])), C = new Path2D();
  C.addPath(k, M), y.globalCompositeOperation = "destination-over", y.fillStyle = g ? "#f8f8f5" : "#111111", y.fill(C), y.strokeStyle = y.fillStyle, y.lineWidth = r === "war" && g ? 2 : c, y.lineJoin = "round", y.stroke(C), t.drawImage(
    f,
    o - p,
    s - p,
    f.width / w,
    f.height / w
  ), f.width = f.height = 0;
}
function Fi(t, e, r, n, o, s = "title", a = e.name) {
  const i = es(e.setCode);
  if (!i || e.frameStyle === "modern" || e.frameTemplate || e.frameAssetFamily || e.borderColor && e.borderColor !== "black" || e.layout && e.layout !== "normal")
    return !1;
  const l = (e.setCalibrationCandidate ? Uu(e.setCalibrationCandidate) : i)[s];
  if (!l.dx && !l.dy && l.size === (s === "title" ? 27.8 : 22.2) && l.width === 1 && !l.wordSpacing && l.gray === 130 && l.shadow === 1)
    return !1;
  t.save();
  const d = t.getTransform().a * l.shadow;
  t.translate(r + l.dx, n + l.dy), t.scale(l.width, 1), t.font = `${l.size}px "${s === "title" ? "CardRenderer MTG Goudy" : "CardRenderer MTG MPlantin"}", Georgia`, l.wordSpacing && (t.wordSpacing = `${l.wordSpacing}px`), t.fillStyle = `rgb(${l.gray},${l.gray},${l.gray})`, t.shadowOffsetX = t.shadowOffsetY = d;
  const u = Math.max(1, o - l.dx);
  return s === "type" ? bt(t, a, 0, 0, u, e.textInk, "type") : t.fillText(a, 0, 0, u), t.restore(), !0;
}
function op(t, e, r) {
  t.save(), t.fillStyle = r, t.beginPath(), t.rect(0, 0, x, I), t.rect(...e), t.fill("evenodd"), t.restore();
}
function Wi(t, e, [r, n, o, s], a) {
  const u = $();
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
function sp(t) {
  if ((t.layout ?? "normal") !== "normal") return;
  const e = `${t.setCode?.toLowerCase() ?? ""}/${St(t)}`;
  if (!(e === "leg/black" && !Ot(t)))
    return Object.hasOwn(ca, e) ? ca[e] : void 0;
}
function zn(t, e, r, n, o, s, a) {
  t.save();
  const i = t.getTransform();
  t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0;
  const l = $();
  l.width = t.canvas.width, l.height = t.canvas.height;
  const d = l.getContext("2d");
  if (!d) throw Error("Solid title needs a Canvas2D context");
  d.setTransform(i), d.font = t.font, d.textAlign = t.textAlign, d.textBaseline = t.textBaseline, d.letterSpacing = t.letterSpacing, d.fillStyle = a?.fill ?? `rgb(${s.gray},${s.gray},${s.gray})`, d.fillText(e, r, n, o), s.trim > 0 && (d.globalCompositeOperation = "destination-out", d.lineWidth = s.trim * 2, d.strokeText(e, r, n, o)), t.resetTransform(), t.shadowColor = a?.shadow ?? "#17140f", t.shadowOffsetX = i.a / s.width * s.shadow, t.shadowOffsetY = i.d * s.shadow, t.drawImage(l, 0, 0), t.restore(), l.width = l.height = 0;
}
const ap = {
  arn: { size: 26.75, x: 37.75, y: 42.5, width: 0.995, shadow: 1.25, trim: 0.4, gray: 196 },
  atq: { size: 26.5, x: 38, y: 42.5, width: 1, shadow: 1.25, trim: 0.4, gray: 196 },
  drk: { size: 27.25, x: 37.25, y: 43, width: 1, shadow: 1.5, trim: 0.2, gray: 208 }
};
function hu(t) {
  const e = t.setCode?.toLowerCase();
  if (e !== "arn" && e !== "atq" && e !== "drk" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || t.borderColor && t.borderColor !== "black" || t.legendary || /\b(Legendary|Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", n = t.land ?? /\bLand\b/.test(r), o = t.artifact ?? /\bArtifact\b/.test(r), s = F(t).length;
  if (!(!n && !o && s !== 1 && !(e === "drk" && s === 2)))
    return ap[e];
}
function ip(t, e, r) {
  const n = hu(e);
  if (!n) return !1;
  t.save(), t.translate(n.x, n.y), t.scale(n.width, 1), t.font = `${n.size}px "CardRenderer MTG Goudy", Georgia`;
  const o = Math.max(1, (r - n.x) / n.width);
  return zn(t, e.name, 0, 0, o, n), t.restore(), !0;
}
function lp(t) {
  return at(t) ? rt(t).title : void 0;
}
function dp(t, e, r) {
  const n = lp(e);
  return n ? (t.save(), t.translate(n.x, n.y), t.scale(n.width, 1), t.font = `${n.size}px "CardRenderer MTG Goudy", Georgia`, zn(t, e.name, 0, 0, Math.max(1, (r - n.x) / n.width), n), t.restore(), !0) : !1;
}
const up = { size: 22, dx: -3, dy: 0.5, width: 1.02, gray: 224, shadow: 1.5, trim: 0.2 };
function hp(t) {
  return t.setCode?.toLowerCase() === "drk" && !t.frameAssetFamily && hu(t) ? up : void 0;
}
function mp(t, e, r, n, o, s) {
  const a = hp(e);
  if (!a) return !1;
  t.save(), t.translate(n + a.dx, o + a.dy), t.scale(a.width, 1), t.font = `${a.size}px "CardRenderer MTG MPlantin", Georgia`, t.fillStyle = `rgb(${a.gray},${a.gray},${a.gray})`, t.shadowColor = "#17140f", t.shadowBlur = 0;
  const i = s / a.width;
  return bt(
    t,
    r,
    0,
    0,
    i,
    e.textInk,
    "type",
    () => zn(t, r, 0, 0, i, a, {
      fill: t.fillStyle,
      shadow: t.shadowColor
    })
  ), t.restore(), !0;
}
function cp(t) {
  const e = He(t.setCode);
  if (e) return e.type;
  const r = (!t.borderColor || t.borderColor === "black") && !!Ot(t);
  return {
    fontSize: r ? 21.7 * 1.03 : 21.7,
    dx: r ? -2.5 : 0,
    dy: 0
  };
}
function gp(t) {
  return at(t) ? rt(t).type : void 0;
}
function fp(t, e, r, n) {
  const o = gp(e);
  if (!o) return !1;
  t.save(), t.translate(o.x, o.y), t.scale(o.width, 1), t.font = `${o.size}px "CardRenderer MTG MPlantin", Georgia`, t.fillStyle = `rgb(${o.gray},${o.gray},${o.gray})`, t.shadowColor = "#17140f", t.shadowBlur = 0;
  const s = Math.max(1, (n - o.x) / o.width);
  return bt(
    t,
    r,
    0,
    0,
    s,
    e.textInk,
    "type",
    () => zn(t, r, 0, 0, s, o, {
      fill: t.fillStyle,
      shadow: t.shadowColor
    })
  ), t.restore(), !0;
}
function mu(t, e, r, n, o, s, a = "#f2eee3") {
  t.save();
  const i = $();
  try {
    const l = t.getTransform();
    t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = "#17140f", t.fillText(e, r + s.shadow / s.width, n + s.shadow, o), i.width = t.canvas.width, i.height = t.canvas.height;
    const d = i.getContext("2d");
    if (!d) throw Error("Artist ink needs a Canvas2D context");
    d.setTransform(l), d.font = t.font, d.textAlign = t.textAlign, d.textBaseline = t.textBaseline, d.letterSpacing = t.letterSpacing, d.fillStyle = a, d.fillText(e, r, n, o), s.trim > 0 && (d.globalCompositeOperation = "destination-out", d.globalAlpha = 0.65, d.lineWidth = s.trim * 2, d.strokeText(e, r, n, o)), t.resetTransform(), t.drawImage(i, 0, 0);
  } finally {
    i.width = i.height = 0, t.restore();
  }
}
const _i = {
  arn: { size: 22, x: 49.75, y: 638.5, width: 1.02, edge: 1.25 },
  atq: { size: 21, x: 48.75, y: 638.5, width: 1.075, edge: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.5, width: 1.045, edge: 1.25 }
}, pp = {
  arn: { size: 22, x: 49.25, y: 638.5, width: 1.025, trim: 0.8, shadow: 1.5 },
  atq: { size: 21, x: 48.5, y: 638.5, width: 1.075, trim: 0.75, shadow: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.25, width: 1.045, trim: 0.55, shadow: 1.5 }
};
function cu(t) {
  const e = t.setCode?.toLowerCase();
  if (e !== "arn" && e !== "atq" && e !== "drk" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || t.borderColor && t.borderColor !== "black" || t.legendary || /\b(Legendary|Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", n = t.land ?? /\bLand\b/.test(r), o = t.artifact ?? /\bArtifact\b/.test(r), s = F(t).length;
  if (!(!n && !o && s !== 1 && !(e === "drk" && s === 2)))
    return pp[e];
}
function yp(t, e) {
  const r = e.setCode?.toLowerCase();
  if (!e.artist || r !== "arn" && r !== "atq" && r !== "drk") return !1;
  const n = cu(e), o = n ?? _i[r];
  t.save(), t.translate(o.x, o.y), t.scale(o.width, 1), t.font = `${o.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = "left", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
  const s = `Illus. © ${r === "drk" ? "1994 " : ""}${e.artist}`;
  return n ? mu(t, s, 0, 0, 338 / o.width, n) : Nu(t, s, 0, 0, 338 / o.width, _i[r].edge), t.restore(), !0;
}
const bp = {
  arn: { x: 452, y: 638, size: 26, width: 1.03, trim: 0.9, shadow: 2, shadowTrim: 0.4 },
  atq: { x: 452.5, y: 639, size: 27.5, width: 0.97, trim: 0.9, shadow: 1.5, shadowTrim: 0.2 },
  drk: { x: 452, y: 640, size: 27, width: 1.01, trim: 0.8, shadow: 1.25, shadowTrim: 0.3 }
};
function wp(t) {
  const e = t.setCode?.toLowerCase();
  if (!(e !== "arn" && e !== "atq" && e !== "drk" || t.power == null || t.toughness == null || !cu(t)))
    return bp[e];
}
function vp(t, e) {
  const r = wp(e);
  if (!r) return !1;
  t.save();
  try {
    t.translate(r.x, r.y), t.scale(r.width, 1), t.font = `${r.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = "right", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
    const n = `${e.power}/${e.toughness}`.replaceAll("-", "–");
    gu(t, n, 132 / r.width, r, e.textInk);
  } finally {
    t.restore();
  }
  return !0;
}
function gu(t, e, r, n, o, s = "#f2eee3") {
  const a = $();
  t.save();
  try {
    a.width = t.canvas.width, a.height = t.canvas.height;
    const i = a.getContext("2d");
    if (!i) throw Error("Stats ink needs a Canvas2D context");
    const l = t.getTransform();
    i.font = t.font, i.textAlign = t.textAlign, i.textBaseline = t.textBaseline, i.letterSpacing = t.letterSpacing, t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.resetTransform();
    for (const [d, u, h] of [
      [n.shadow, n.shadowTrim, "#17140f"],
      [0, n.trim, s]
    ]) {
      i.resetTransform(), i.clearRect(0, 0, a.width, a.height), i.setTransform(l), i.globalAlpha = 1, i.globalCompositeOperation = "source-over", i.fillStyle = h;
      const m = d / n.width;
      bt(i, e, m, d, r, o, "stats", () => {
        d && (i.fillStyle = h), i.fillText(e, m, d, r);
      }), u > 0 && (i.globalCompositeOperation = "destination-out", i.globalAlpha = 0.65, i.lineWidth = u * 2, i.strokeText(e, m, d, r)), t.drawImage(a, 0, 0);
    }
  } finally {
    a.width = a.height = 0, t.restore();
  }
}
function Ui(t, e, r, n) {
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
function Sp(t, e, r, n) {
  const o = $();
  o.width = t.canvas.width, o.height = t.canvas.height, t.save();
  try {
    const s = t.getTransform(), a = o.getContext("2d");
    if (!a) throw Error("Footer ink needs a Canvas2D context");
    a.setTransform(s), a.font = t.font, a.textAlign = t.textAlign, a.textBaseline = t.textBaseline, a.letterSpacing = t.letterSpacing, a.fillStyle = t.fillStyle, Ui(a, "fillText", e, r), n.trim > 0 && (a.globalCompositeOperation = "destination-out", a.lineWidth = n.trim * 2, Ui(a, "strokeText", e, r)), t.resetTransform(), t.shadowBlur = 0, t.shadowOffsetX = s.a / n.width * n.shadow, t.shadowOffsetY = s.d * n.shadow, t.drawImage(o, 0, 0);
  } finally {
    t.restore(), o.width = o.height = 0;
  }
}
function Cp(t) {
  const e = at(t);
  if (!e) return;
  const r = t.setCode.toLowerCase(), n = rt(t).footer, o = ["B", "G", "A"].includes(e.material ?? "") || r === "fem" && t.name === "Ebon Stronghold";
  return {
    ...n,
    legalGray: o ? n.legal.lightGray : n.legal.darkGray,
    // Reviewed printing defaults, never a year inferred from an arbitrary set.
    legalText: t.legalText === void 0 ? n.legal.defaultText ?? `© ${r === "fem" ? "1994" : "1995"} Wizards of the Coast, Inc. All rights reserved.` : t.legalText
  };
}
function kp(t, e) {
  const r = Cp(e);
  if (!r) return !1;
  const n = (o, s) => {
    const a = r[o];
    t.save();
    try {
      t.translate(a.x, a.y), t.scale(a.width, 1), t.font = `${a.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = o === "artist" ? r.artist.align ?? "left" : o === "stats" ? "right" : "left", t.textBaseline = o === "artist" ? r.artist.baseline ?? "alphabetic" : o === "stats" ? r.stats.baseline ?? "alphabetic" : "alphabetic", t.letterSpacing = "0px";
      const i = "gray" in a ? a.gray : r.legalGray, l = o === "artist" ? r.artist.tint : o === "stats" ? r.stats.tint : void 0, d = l ? l.map((m) => Math.round(m * i)) : [i, i, i];
      t.fillStyle = "rgb(" + d.join(",") + ")", t.shadowColor = o === "legal" ? "transparent" : "#17140f", t.shadowBlur = 0;
      const u = o === "artist" && r.artist.maxWidth !== void 0 ? r.artist.maxWidth / a.width : o === "stats" ? 132 / a.width : Math.max(1, ((o === "artist" ? 386 : 445) - a.x) / a.width), h = () => o === "artist" && r.artist.inkStyle === "separate-shadow" ? mu(t, s, 0, 0, u, a, t.fillStyle) : Sp(t, s, u, a);
      o === "stats" && r.stats.inkStyle === "separate-shadow" ? gu(
        t,
        // Preserve the expansion painter's visible MPlantin minus glyph.
        s.replaceAll("-", "–"),
        u,
        { ...a, shadowTrim: r.stats.shadowTrim ?? 0 },
        e.textInk,
        t.fillStyle
      ) : o === "stats" ? bt(t, s, 0, 0, u, e.textInk, "stats", h) : h();
    } finally {
      t.restore();
    }
  };
  return e.power != null && e.toughness != null && n("stats", _o(e)), e.artist && Z(
    t,
    e,
    "artist",
    () => n("artist", `${r.artist.prefix ?? "Illus. "}${e.artist}`)
  ), r.legalText && Z(t, e, "legal", () => n("legal", r.legalText)), !0;
}
const Mp = {
  size: 18,
  x: 49.25,
  width: 1.04,
  shadow: 2,
  inset: 0.1,
  align: "left",
  maximum: 338
}, Tp = {
  size: 27.8,
  x: 452.25,
  width: 0.99,
  shadow: 1.75,
  inset: 0.3,
  align: "right",
  maximum: 68
};
function Di(t, e, r, n) {
  const o = $();
  o.width = t.canvas.width, o.height = t.canvas.height;
  const s = o.getContext("2d");
  if (!s) throw Error("Legends footer needs a Canvas2D context");
  const a = t.getTransform();
  s.setTransform(a), s.translate(r.x, 640), s.scale(r.width, 1), s.font = `${r.size}px "CardRenderer MTG MPlantin", Georgia`, s.textAlign = r.align, s.textBaseline = "alphabetic", s.letterSpacing = "0px", s.fillStyle = "#f2eee3", bt(s, e, 0, 0, r.maximum / r.width, n), s.globalCompositeOperation = "destination-out", s.lineWidth = 2 * r.inset, s.strokeText(e, 0, 0, r.maximum / r.width), t.save(), t.resetTransform(), t.shadowColor = "#17140f", t.shadowBlur = 0, t.shadowOffsetX = t.shadowOffsetY = r.shadow * a.a, t.drawImage(o, 0, 0), t.restore(), o.width = o.height = 0;
}
function ko(t, e) {
  return !Ot(e) || e.borderColor && e.borderColor !== "black" ? !1 : (e.artist && Di(t, `Illus. © 1994 ${e.artist}`, Mp), e.power != null && e.toughness != null && Di(t, `${e.power}/${e.toughness}`, Tp, e.textInk), !0);
}
function xp(t, e) {
  return e.printingElements?.artist ? ko(t, { ...e, artist: null }) ? (Z(t, e, "artist", () => {
    ko(t, { ...e, power: null, toughness: null });
  }), !0) : !1 : ko(t, e);
}
function Rp(t, e) {
  const r = e.setCode?.toLowerCase();
  if (!["usg", "ulg", "uds"].includes(r ?? "") || (e.layout ?? "normal") !== "normal")
    return !1;
  t.save(), t.textAlign = "center", t.textBaseline = "alphabetic", t.shadowColor = "#17140f", t.shadowOffsetX = t.shadowOffsetY = 1.5 * t.getTransform().a, t.fillStyle = "#f2eee3", t.font = '19px "CardRenderer MTG MPlantin", Georgia';
  const n = e.power != null && e.toughness != null ? 292 : 365;
  Z(t, e, "artist", () => {
    e.artist && t.fillText(`Illus. ${e.artist}`, 244, 626, n);
  }), e.power != null && e.toughness != null && (t.shadowColor = "#000b", t.font = '27.8px "CardRenderer MTG MPlantin", Georgia', t.textBaseline = "middle", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, bt(
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
    const g = (f, p) => {
      t.save(), t.scale(c, 1), t.fillText(f, p, 0), t.restore();
    };
    u && Z(t, e, "legal", () => g(u, -m / 2)), d && Z(
      t,
      e,
      "collector",
      () => g(d, m / 2 - t.measureText(d).width)
    );
  }
  return t.restore(), !0;
}
function Lp(t, e, r) {
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
function Ep(t, e) {
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
function Ap(t) {
  return t.setSymbol || t.setCode?.toLowerCase() !== "exo" ? null : t.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : t.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const Zo = {
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
}, fu = (t) => `${t}#opaque-print-details-v1`, Bp = (t) => Object.keys(Zo).some((e) => t === `${Y.KEYRUNE_ROOT}/${e}.svg`);
async function Ip(t, e) {
  const r = Object.keys(Zo).find((u) => t === `${Y.KEYRUNE_ROOT}/${u}.svg`);
  if (!r) return null;
  const n = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), o = n.documentElement, s = n.querySelectorAll("path"), a = s[0]?.getAttribute("d") ?? "", i = a.match(/M[^M]*/g) ?? [], l = Zo[r];
  if (o.localName !== "svg" || n.querySelector("parsererror") || s.length !== 1 || i.length !== l.count || i.some((u) => /m/.test(u) || !/[zZ]\s*$/.test(u)))
    throw new Error(`Unexpected pinned ${r} symbol paths.`);
  const d = n.createElementNS("http://www.w3.org/2000/svg", "path");
  return d.setAttribute("d", l.white.map((u) => i[u]).join("")), d.setAttribute("fill", "#fff"), o.replaceChildren(d), new Blob([new XMLSerializer().serializeToString(n)], { type: "image/svg+xml" });
}
const Op = "symbol-svg-v6", $p = { "leg-c": { sha256: "289e33fd164ee77b5b5d5982b299f485ca668c576368ec796be3b8260de592fd", recipe: "remove-outer-white", pathCount: 7 }, "drk-c": { sha256: "d83257eede46a709ad6f6bf8800928e5954121a75fa8511a255bef4caa382ffa", recipe: "remove-outer-white", pathCount: 2, fill: "#221c13", outline: { stroke: "#505050", width: 24 } }, "6ed-u": { sha256: "631daa24b47c80669e3b27044d9213faa69e9207940a5a7283d67ab7db54e65b", recipe: "white-outer-rim" }, "6ed-r": { sha256: "a6175526471668969615caecff1070f8d9d119ff69b03fc6c03af1ad5fc0f198", recipe: "white-outer-rim" }, "m15-u": { sha256: "bfd962ff9640a846e5690d76c0fe88324e9d49cb6771744b5ab8f34f7afe7362", recipe: "m15" }, "m15-r": { sha256: "933756b97cebe7389ff7cee219a34b1ac13bc504743a2be037a286ee5ffc4b0d", recipe: "m15" }, "m15-m": { sha256: "6e9f87473f1ed8ecb05647fbde6f13e22faeab18fe56b8f76cfa1759bb4210e7", recipe: "m15" }, "8ed-u": { sha256: "6c20e8da28fdd5cdb030814e5c1339978f276c77f4ad9d99ca816adb8d970880", recipe: "8ed" }, "8ed-r": { sha256: "eccde74c56b4810434ecdf4e99206046d6970ea601e4fed2f73eb2ee855053a2", recipe: "8ed" }, "9ed-u": { sha256: "acb7ea7f3422f50dca2aef4e07aa3977aa1641ff2cb54f6eb64ae1bc17abbf53", recipe: "9ed" }, "9ed-r": { sha256: "c1cbcc1aea4f032c5f2ccf7f1d63073813bf9c6f050ba2f5385170ff3deca8a5", recipe: "9ed" }, "7ed-u": { sha256: "94c67d433ba3012f3aa1c494a7ef0ae1e7de58ce4614dfd50ee8f52de527d7e4", recipe: "white-outer-rim" }, "7ed-r": { sha256: "8b30917e85b2c9c3549bfa6c2f62261801df33ff7debcc138bf89c4a9ba9689f", recipe: "white-outer-rim" }, "arn-c": { sha256: "aa9fa21e104232cb6768ce1f61be5ba6714e57e950ec93232d64698c9ac3cf0b", recipe: "printed-paths", pathCount: 4, remove: [0, 1], fills: { 3: "#b3b3b3" } }, "atq-c": { sha256: "eab0072d3a2c8ede6cabc81c1864d7490fe8973c6700df3a156fad2953727242", recipe: "remove-outer-white", pathCount: 2 } }, la = {
  revision: Op,
  sources: $p
}, Ni = `${W}/img/setSymbols/official/`, ji = la.sources;
function da(t) {
  if (!t.startsWith(Ni) || !t.endsWith(".svg")) return;
  const e = t.slice(Ni.length, -4);
  return Object.hasOwn(ji, e) ? ji[e] : void 0;
}
function Pp(t) {
  return !!da(t);
}
async function Gp(t, e) {
  const r = da(t);
  if (!r) return e;
  const n = await e.arrayBuffer();
  if ([...new Uint8Array(await crypto.subtle.digest("SHA-256", n))].map((h) => h.toString(16).padStart(2, "0")).join("") !== r.sha256) throw Error(`Unexpected pinned symbol checksum: ${t}`);
  const a = new DOMParser().parseFromString(new TextDecoder().decode(n), "image/svg+xml"), i = a.documentElement, l = [...i.querySelectorAll("path")], d = i.querySelector("linearGradient, radialGradient");
  if (i.localName !== "svg" || a.querySelector("parsererror") || !d && !["remove-outer-white", "printed-paths"].includes(r.recipe))
    throw Error(`Unexpected pinned symbol SVG: ${t}`);
  const u = (h, m) => {
    for (const [c, g] of Object.entries(m)) h.setAttribute(c, g);
  };
  if (r.recipe === "printed-paths") {
    if (l.length !== r.pathCount) throw Error("Unexpected printed symbol topology.");
    const h = r.remove ?? [];
    if (new Set(h).size !== h.length) throw Error("Repeated symbol removal.");
    for (const m of h) {
      if (!Number.isInteger(m) || !l[m]) throw Error("Invalid symbol removal.");
      l[m].remove();
    }
    for (const [m, c] of Object.entries(r.fills ?? {})) {
      const g = Number(m);
      if (!Number.isInteger(g) || !l[g] || h.includes(g))
        throw Error("Invalid printed symbol fill.");
      l[g].style.fill = c;
    }
  } else if (r.recipe === "remove-outer-white") {
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
  return i.setAttribute("data-card-glint-patch", la.revision), new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" });
}
const pu = (t) => `${t}#printed-outline-v1`;
async function Fp(t, e) {
  const r = da(t)?.outline;
  if (!r) return null;
  const n = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), o = n.documentElement, s = [...o.querySelectorAll("path")];
  if (o.localName !== "svg" || n.querySelector("parsererror") || o.getAttribute("data-card-glint-patch") !== la.revision || s.length !== 1)
    throw Error(`Unexpected prepared symbol outline: ${t}`);
  const a = s[0];
  return a.setAttribute("stroke", r.stroke), a.setAttribute("stroke-width", String(r.width)), a.setAttribute("stroke-linejoin", "round"), a.setAttribute("paint-order", "stroke fill"), new Blob([new XMLSerializer().serializeToString(n)], { type: "image/svg+xml" });
}
function Wp(t) {
  return ["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "");
}
function _p(t, e, r) {
  t.save(), t.font = '22.5px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.textBaseline = "alphabetic", ar(
    t,
    `Illus. © ${e}`,
    49,
    He(r)?.artistBaseline ?? 631,
    338,
    1.25,
    He(r)?.artistInk
  ), t.restore();
}
function Up(t, e, r, n, o) {
  const s = Wn(e), a = hm(e), i = Cs(e);
  if (o === "artwork") {
    qt(t, e, r, At(s.art), o);
    return;
  }
  const d = Ft(e) ?? kh(e);
  t.fillStyle = d, t.fillRect(0, 0, 488, 680), t.fillStyle = "#686050", t.fillRect(24.4, 27.2, 439.2, 625.6), t.fillStyle = "#e5dec5", t.fillRect(...At(s.rules)), t.fillStyle = "#746b58", t.fillRect(...At(s.art)), n && t.drawImage(n, 0, 0, 488, 680), qt(t, e, r, At(s.art), o);
  const u = r.get(me(e));
  u && (t.save(), t.filter = Mh(e), t.drawImage(u, ...At(s.frame)), eh(t, e, u, d), Lp(t, u, me(e)), me(e).endsWith("/seventh/regular/m.png") && Ep(t, u), t.restore());
  const h = at(e)?.stockWindow ?? ur(e)?.stockWindow ?? Ot(e)?.stockWindow, m = at(e)?.stockMaskFrame;
  if (m) {
    const D = r.get(fn(e));
    if (!D) throw Error("Calibrated historical stock mask is unavailable.");
    Wi(t, D, At(m), d);
  } else if (h)
    op(t, At(h), d);
  else if (vt(e) || $l(e))
    t.save(), t.fillStyle = d, t.beginPath(), t.rect(0, 0, 488, 680), t.rect(24, 29, 440, 623), t.fill("evenodd"), t.strokeStyle = "#30312e", t.lineWidth = 1.5, t.strokeRect(24.5, 29.5, 439, 622), t.restore();
  else if (St(e) !== "black" || Lt(e) === "fourth") {
    const D = r.get(fn(e));
    D && Wi(t, D, At(s.frame), d);
  }
  t.fillStyle = He(e.setCode)?.headingInk ?? Ba(e), t.textBaseline = "middle", t.textAlign = "left", t.letterSpacing = "0px";
  const [c, g, f, p] = At(s.title), w = e.manaSymbols ?? [], y = sp(e), b = y?.[3] ?? a?.manaSize ?? 23.4, v = y ? y[2] - b : a?.manaGap ?? 1.7, S = w.length * (b + v), k = y ? y[0] + b / 2 - S + v : a ? a.manaRight - S + v : c + f - S, M = ["lea", "2ed"].includes(e.setCode?.toLowerCase() ?? ""), C = i || M ? [
    (i ? 435 : 432) - Math.max(0, w.length - 1) * 27 - (i ? 23.4 : 23.9) / 2,
    (i ? 44.5 : 46) - (i ? 23.4 : 23.9) / 2,
    Math.max(0, w.length - 1) * 27 + (i ? 23.4 : 23.9),
    i ? 23.4 : 23.9
  ] : [
    k,
    y ? y[1] - b / 2 : a?.manaTop ?? g + p / 2 - b / 2,
    Math.max(0, S - v),
    b
  ], T = jn(e), R = sm(C, w.length, T), A = ke(R, T);
  t.shadowColor = "#000b", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, t.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const L = a?.titleX ?? c, O = g + p / 2 + (a?.titleYOffset ?? 0), B = Math.max(
    1,
    w.length ? k + A[0] - C[0] - L - 5 : a?.titleX == null ? f - 5 : c + f - L - 5
  );
  t.save(), t.translate(...sa(e, "retro")), vt(e) ? uo(t, e.name, "title", B) : i ? Rh(t, e.name, L, O, B) : !dp(t, e, L + B) && !ip(t, e, L + B) && !Fi(t, e, L, O, B) && t.fillText(e.name, L, O, B), t.restore();
  const U = e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode === "oracle", E = e.symbolStyle === "original" || e.symbolStyle === void 0 && e.wordingMode === "original", q = E && ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "");
  Z(
    t,
    e,
    "manaCost",
    () => rr(t, R, T, () => {
      i ? lm(t, w, r, U, T) : ["lea", "2ed"].includes(e.setCode?.toLowerCase() ?? "") ? dm(t, w, r, U, T) : w.forEach(
        (D, J) => (q ? Kl : mt)(
          t,
          D,
          k + J * (b + v) - (w.length - 1 - J) * (T?.spacing ?? 0),
          y ? y[1] - b / 2 : a?.manaTop ?? g + p / 2 - b / 2,
          b,
          r,
          !1,
          T
        )
      );
    })
  );
  const [K, dt, pt, Pt] = At(s.type), Wt = Pl(e) ?? "", X = r.get(Wt), ut = au(e), le = Ap(e), tt = X ? Math.min(44 / X.width, (a?.setHeight ?? 23.4) / X.height) : 0, z = ut?.width ?? (X?.width ?? 0) * tt, Xt = ut?.height ?? (X?.height ?? 0) * tt, V = [
    (ut?.right ?? a?.setRight ?? K + pt) - z,
    (ut?.centerY ?? a?.setCenterY ?? dt + Pt / 2) - Xt / 2,
    z,
    Xt
  ], Et = ia(e, Wt, V, "retro"), be = ke(Et, e.symbolAdjustment?.set), se = cp(e);
  t.font = `${se.fontSize}px "CardRenderer MTG MPlantin", Georgia`;
  const de = vt(e) ? (D, J, ht, ft) => uo(t, D, "type", ft, e.textInk) : (D, J, ht, ft) => {
    !Ih(t, e, D, J, ht, ft) && !fp(t, e, D, J + ft) && !mp(t, e, D, J, ht, ft) && !Fi(t, e, J, ht, ft, "type", D) && bt(t, D, J, ht, ft, e.textInk, "type");
  };
  t.save(), t.translate(se.dx, se.dy), de(
    rs(e)?.typeLine ?? e.typeLine ?? "",
    a?.typeX ?? K,
    dt + Pt / 2,
    X ? Math.max(
      1,
      Math.min(
        pt - 48,
        ut ? ut.right - ut.width - K - 6 : pt,
        be !== V ? be[0] - (a?.typeX ?? K) - 6 : pt
      )
    ) : pt
  ), t.restore(), Z(
    t,
    e,
    "setSymbol",
    () => rr(t, Et, e.symbolAdjustment?.set, () => {
      if (X) {
        const D = Math.min(44 / X.width, (a?.setHeight ?? 23.4) / X.height), J = ut?.width ?? X.width * D, ht = ut?.height ?? X.height * D, ft = ut?.right ?? a?.setRight ?? K + pt, _t = ut?.centerY ?? a?.setCenterY ?? dt + Pt / 2, Jt = ut?.crop ?? [0, 0, 1, 1], fr = Gt(Wt), ue = !fr && !e.setSymbol && r.get(fu(Wt));
        if (ue && (t.save(), t.shadowColor = "transparent", e.setCode?.toLowerCase() === "arn" && (t.filter = "brightness(0.7)"), t.drawImage(
          ue,
          Jt[0] * ue.width,
          Jt[1] * ue.height,
          Jt[2] * ue.width,
          Jt[3] * ue.height,
          ft - J,
          _t - ht / 2,
          J,
          ht
        ), t.restore()), fr || e.setSymbol) {
          t.save(), t.shadowColor = "transparent";
          const Re = !e.setSymbol && e.setCode?.toLowerCase() === "drk" && St(e) === "black" && G(e).boxes === "B" ? r.get(pu(Wt)) : void 0;
          t.drawImage(Re ?? X, ...Et), t.restore();
        } else le || a || il(e.setCode) ? fm(
          t,
          X,
          ft - J,
          _t - ht / 2,
          J,
          ht,
          ut?.outline ?? (le ? 2 : a?.setOutline ?? t0(e.setCode)),
          Jt,
          le,
          ut?.sampling
        ) : ye(
          t,
          X,
          e.setCode,
          e.rarity,
          K + pt - X.width * D,
          dt + Pt / 2 - X.height * D / 2,
          X.width * D,
          X.height * D
        );
      }
    })
  ), t.shadowColor = "transparent";
  const [Ge, gr, Fe, we] = At(s.rules);
  t.fillStyle = "#17140f";
  const Mt = r.get(Ss(e) ?? "");
  if (Mt && fe(t)) {
    const D = Math.min(Fe * 0.4 / Mt.width, we * 0.75 / Mt.height);
    t.drawImage(
      Mt,
      Ge + (Fe - Mt.width * D) / 2,
      gr + (we - Mt.height * D) / 2,
      Mt.width * D,
      Mt.height * D
    );
  } else {
    const D = Am(t, e);
    D && $t(
      t,
      D,
      r,
      U ? mt : E ? gm(e.setCode) : e.setCode?.toLowerCase() === "3ed" ? Uo : a ? Bs : mt
    );
  }
  if (xp(t, e)) {
    Mo(t, e, !0);
    return;
  }
  if (!Rp(t, e)) {
    if (kp(t, e)) {
      Mo(t, e, !1);
      return;
    }
    if (t.shadowColor = a?.statsOpaqueShadow ? "#000" : "#000b", a && (t.shadowOffsetX = t.shadowOffsetY = a.statsShadow * t.getTransform().a), t.fillStyle = He(e.setCode)?.statsInk ?? Ba(e), t.font = '27.8px "CardRenderer MTG MPlantin", Georgia', t.textBaseline = "middle", e.power != null && e.toughness != null && !vp(t, e)) {
      const [D, J, ht, ft] = At(s.stats), _t = um(e);
      t.textAlign = _t ? "right" : "center", i ? Lh(t, _o(e), J + ft / 2, e.textInk) : bt(
        t,
        _o(e),
        (_t?.right ?? D + ht / 2) + (He(e.setCode)?.statsDx ?? 0),
        J + ft / 2 + (_t?.yOffset ?? 0),
        _t?.maxWidth ?? ht,
        e.textInk
      );
    }
    a ? pm(t, e, a) : Z(t, e, "artist", () => {
      if (!yp(t, e)) {
        if (vt(e) && e.artist)
          uo(t, `Illus. © ${e.artist}`, "artist", 390);
        else if (i && e.artist) Eh(t, e.artist);
        else if (e.artist && Wp(e))
          _p(t, e.artist, e.setCode);
        else if (e.artist) {
          const [D, J, ht, ft] = At(s.footer);
          t.textAlign = "center", t.font = '15.6px "CardRenderer MTG MPlantin", Georgia', t.fillText(`Illus. ${e.artist}`, D + ht / 2, J + ft / 2, ht);
        }
      }
    }), Mo(t, e, !a), t.shadowColor = "transparent";
  }
}
function Mo(t, e, r) {
  r && e.legalText && Z(t, e, "legal", () => {
    t.save(), t.shadowColor = "transparent", t.fillStyle = It(e.setCode, e.borderColor).ink, t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.fillText(e.legalText, 49, 646, 390), t.restore();
  });
  const n = e.collectorNumber?.trim();
  n && e.collectorTotal !== void 0 && Z(t, e, "collector", () => {
    t.save(), t.shadowColor = "transparent", t.fillStyle = It(e.setCode, e.borderColor).ink, t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "right", t.fillText(
      n + (e.collectorTotal ? "/" + e.collectorTotal : ""),
      439,
      660,
      180
    ), t.restore();
  }), t.shadowColor = "transparent";
}
let zi;
const Dp = [
  { family: "CardRenderer MTG Goudy", url: vh, weight: "400", style: "normal" },
  {
    family: "CardRenderer MTG Historic Symbols",
    url: wh,
    weight: "400",
    style: "normal"
  }
];
function Np() {
  return typeof FontFace != "function" ? Promise.resolve() : zi ??= Promise.all(
    Dp.map(async ({ family: t, url: e }) => {
      if ([...it()].some(
        (n) => n.family.replace(/^"|"$/g, "") === t && n.status === "loaded"
      ))
        return;
      const r = await In(e);
      if (!r.ok) throw Error(`Retro font unavailable: ${t}`);
      it().add(await new FontFace(t, await r.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((t) => {
    throw zi = void 0, t;
  });
}
const yu = `${Qe}/img/class_level_bg.webp`, bu = (t) => ["adventure", "class", "leveler"].includes(Q(t)), Ye = (t, e, r, n) => ({
  x: t / 63.5 * 488,
  y: e / 88.9 * 680,
  width: r / 63.5 * 488,
  height: n / 88.9 * 680
}), jp = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function zp(t, e, r, n = 21) {
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
function Yn(t) {
  const e = Q(t), r = [], n = (o, s, a, i = {}) => {
    r.push({ kind: o, text: s, ...a, font: zp(s, a.width, a.height), ...i });
  };
  if (e === "adventure") {
    const o = t.faces?.[1];
    if (!o) return [];
    const s = (o.manaSymbols ?? []).map((i) => `{${i}}`).join(""), a = (o.manaSymbols?.length ?? 0) * 2.5;
    n("heading", o.name, Ye(5.6, 55.3, 25 - a, 4.2), {
      color: "white",
      font: Math.min(18, (25 - a) * 488 / 63.5 / Math.max(1, o.name.length * 0.55))
    }), n("rules", s, Ye(30 - a, 55.3, a, 4.2), { color: "white", font: 17 }), n("heading", o.typeLine ?? "", Ye(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (o.typeLine ?? "").length * 0.52))
    }), n("rules", o.rulesText ?? "", Ye(5.6, 64.5, 24.7, 15.6)), n("rules", t.rulesText ?? t.faces?.[0]?.rulesText ?? "", Ye(33, 54.9, 25.5, 25));
  } else if (e === "class") {
    const [o, s, a, i] = Yt(t).rules.map(
      (b, v) => b * (v % 2 ? I : x)
    ), l = G(t);
    n(
      "band",
      "",
      { x: o, y: s, width: a, height: i },
      {
        fill: "#e3d8bb",
        asset: Nt(
          "saga_textboxes",
          l.boxes === "Colourless" ? "Land" : l.boxes
        )
      }
    );
    const d = [];
    for (const b of (t.rulesText ?? "").split(`
`).filter(Boolean))
      d.length && !/^.*:\s*Level\s+\d+\s*$/i.test(b) && !/^.*:\s*Level\s+\d+\s*$/i.test(d.at(-1)) && !d.at(-1).startsWith("(") ? d[d.length - 1] += `
` + b : d.push(b);
    const u = (b) => /^.*:\s*Level\s+\d+\s*$/i.test(b), h = 28, m = 20, c = (b, v) => b.split(`
`).reduce(
      (S, k) => S + Math.max(1, Math.ceil(k.length * v * 0.53 / (a - 10))),
      0
    ), g = d.map(
      (b) => u(b) ? h : c(b, b.startsWith("(") ? 16 : m) * (b.startsWith("(") ? 16 : m) + 8
    ), f = d.filter((b) => !u(b)).length, p = Math.max(0, i - g.reduce((b, v) => b + v, 0)) / Math.max(1, f), w = Math.min(
      1,
      (i - d.filter(u).length * h) / g.reduce((b, v, S) => b + (u(d[S]) ? 0 : v), 0)
    );
    let y = s;
    d.forEach((b, v) => {
      const S = u(b), k = S ? h : g[v] * w + p;
      if (S) {
        const [M, C] = b.split(/:\s*/);
        n("band", "", { x: o, y, width: a, height: k }, { asset: yu }), n("rules", M + ":", { x: o + 5, y, width: a / 2 - 5, height: k }, { font: 18 }), n(
          "heading",
          C,
          { x: o + a / 2, y, width: a / 2 - 5, height: k },
          { font: 18, align: "right" }
        );
      } else
        n(
          "rules",
          b,
          { x: o + 5, y: y + 4, width: a - 10, height: k - 8 },
          { font: (b.startsWith("(") ? 16 : m) * w, italic: b.startsWith("(") }
        );
      y += k;
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
    const i = Ye(4.9, 55.6, 53.7, 25.5), l = i.height / a.length, d = jp[G(t).frame] ?? "#dcc8af";
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
        { asset: Nt("pt-boxes", G(t).pt), font: 26 }
      );
    });
  }
  return r;
}
function Yp(t) {
  return Yn(t).flatMap((e) => [
    e.asset ?? null,
    ...Pn(e.text).flatMap((r) => r.symbol ? [tr(r.symbol)] : [])
  ]);
}
function qp(t) {
  if (["adventure", "prepare"].includes(Q(t))) {
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
      G(e)
    ] : null;
  }
  return bu(t) ? Yn(t) : null;
}
function Hp(t, e, r) {
  let n = !0;
  for (const o of Yn(e)) {
    if (!fe(t) && (o.asset === yu || o.kind !== "band" && o.kind !== "stats" && o.kind !== "level"))
      continue;
    const { x: s, y: a, width: i, height: l, font: d } = o;
    t.save(), t.textAlign = "left", t.fillStyle = o.fill ?? "transparent", o.kind === "level" ? (t.beginPath(), t.moveTo(s, a), t.lineTo(s + i * 0.72, a), t.lineTo(s + i, a + l / 2), t.lineTo(s + i * 0.72, a + l), t.lineTo(s, a + l), t.closePath(), t.fill(), t.strokeStyle = "#0008", t.lineWidth = 1, t.stroke()) : o.fill && t.fillRect(s, a, i, l);
    const u = o.asset ? r.get(o.asset) : null;
    if (u && t.drawImage(u, s, a, i, l), t.beginPath(), t.rect(s, a, i, l), t.clip(), t.fillStyle = o.color ?? "#17140f", ["stats", "level"].includes(o.kind)) {
      t.font = `${d}px "CardRenderer MTG Beleren", Georgia`, t.textAlign = "center", t.textBaseline = "middle";
      const h = o.text.split(`
`);
      h.forEach(
        (m, c) => bt(
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
      const h = As(t, o.text, i, d).length * d + (o.text.split(`
`).length - 1) * j.paragraphGap;
      Xl(
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
const Xp = 5, Jp = 0.02655 * I + 0.91339 * x * 3810 / 2736;
function ua(t) {
  const e = t ? 382 : 429;
  return { top: e, scale: 1 - Xp / (Jp - e) };
}
function Kp(t) {
  const { top: e, scale: r } = ua(t);
  return [e + 6 - Ct.middleLift, e + (625 - e) * r - 4];
}
function Vp(t, e, r, n, o, s) {
  const { top: a, scale: i } = ua(s), l = e.height * o / e.width, d = Math.max(0, Math.min(l, a - n)), u = d * e.width / o;
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
function To(t, e, r, n, o, s) {
  ed(
    t,
    s,
    () => Vp(t, e, r, n, o, s)
  );
}
const Bt = {
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
function Zp(t, e, r) {
  const n = t.rulesParagraphs?.filter((a) => a.role === "rules")[r], o = (t.rulesText ?? "").split(`
`).filter((a) => a.trim())[r];
  if (!n || n.runs.map((a) => a.text).join("") !== o) return [{ text: e }];
  let s = o.length - e.length;
  return n.runs.flatMap((a) => {
    const i = Math.min(s, a.text.length);
    return s -= i, i === a.text.length ? [] : [{ ...a, text: a.text.slice(i) }];
  });
}
function Qp(t, e) {
  const r = Q(e) === "planeswalker-large", n = Dr(e), o = !r && n.length < 3, s = xl(e), a = s?.rules[r ? "tall" : "regular"], i = Yt(e).rules, l = i[0] * x, d = i[1] * I + (a?.dy ?? 0), u = i[2] * x + (a?.width ?? 0), h = i[3] * I - (r ? 24 : o ? 4 : 16) + (a?.height ?? 0), m = r ? 8 : o ? 3 : 0, c = {
    ...Ir,
    leading: a?.leading ?? (r ? 0.9 : Ir.leading)
  }, g = n.map((L, O) => ({
    ...L,
    runs: Zp(e, L.text, O),
    left: (L.badges.length ? Bt.textLeft : Bt.staticTextLeft) + (a?.dx ?? 0)
  })), f = (L) => g.map(
    (O) => P(
      t,
      [{ role: "rules", runs: O.runs }],
      {
        x: l + O.left,
        y: 0,
        width: u - O.left - Bt.rightInset,
        height: 1e3
      },
      L,
      L,
      c
    )
  );
  let p = (r ? 17.5 : o ? 24 : 19) + (a?.size ?? 0), w = f(p);
  const [y, b] = Kp(r), v = () => {
    const L = h / Math.max(1, g.length), O = w.map((E, q) => d + m + L * (q + 0.5) - E.height / 2);
    let B = y - 8;
    for (let E = 0; E < O.length; E++)
      O[E] = Math.max(O[E], B + 8), B = O[E] + w[E].height;
    let U = b + 8;
    for (let E = O.length - 1; E >= 0; E--)
      O[E] = Math.min(O[E], U - 8 - w[E].height), U = O[E];
    return O;
  }, S = () => (v()[0] ?? y) >= y, k = () => w.map(
    (L) => Math.max(Bt.minimumRowHeight, L.height + 16)
  ), M = () => {
    const L = h / Math.max(1, g.length);
    return w.every((O, B) => {
      const U = L * (B + 0.5);
      return U - O.height / 2 >= 6 && U + O.height / 2 <= h + 6 && (!B || L - (O.height + w[B - 1].height) / 2 >= 8);
    });
  };
  for (; p > 8 && (k().reduce((L, O) => L + O, 0) > h || !M() || !S()); )
    p -= 0.25, w = f(p);
  const C = h / Math.max(1, g.length), T = v();
  let R = m, A = y - 8;
  return g.map((L, O) => {
    const B = C, U = w[O].height;
    let E = P(
      t,
      [{ role: "rules", runs: L.runs }],
      {
        x: l + L.left,
        y: T[O],
        width: u - L.left - Bt.rightInset,
        height: U
      },
      p,
      p,
      c
    );
    E.overflow ||= R + B > m + h + 0.01, E.overflow ||= !M(), E.overflow ||= !S(), E.overflow ||= E.lines.some(
      (dt) => dt.inkBounds[1] < y - 0.01 || dt.inkBounds[1] + dt.inkBounds[3] > b + 0.01
    );
    const q = L.badges.length ? void 0 : s?.staticText;
    q && (E = t1(
      t,
      E,
      [
        Math.max(y, A + 8),
        Math.min(b, (T[O + 1] ?? b + 8) - 8)
      ],
      q
    )), A = E.top + E.height;
    const K = {
      ...L,
      ...q ? { left: L.left + q.dx } : {},
      top: R,
      height: B,
      font: E.size,
      width: E.width,
      layout: E
    };
    return R += B, K;
  });
}
function t1(t, e, r, n) {
  const o = ae(e);
  if (!o) throw Error("Missing static-ability layout request");
  const s = o.bounds.y + o.bounds.height / 2, a = Math.min(s - r[0], r[1] - s);
  t.save();
  try {
    n.fractionalMetrics && (t.textRendering = "geometricPrecision", t.fontKerning = "normal");
    const i = e.size + n.size, l = P(
      t,
      o.paragraphs,
      {
        ...o.bounds,
        x: o.bounds.x + n.dx,
        y: (a > 0 ? s - a : r[0]) + n.dy,
        width: o.bounds.width + n.width,
        height: a > 0 ? a * 2 : Math.max(0, r[1] - r[0]),
        verticalLimits: r
      },
      i,
      Math.min(i, 8),
      {
        ...o.typography,
        leading: n.leading,
        textWidth: n.textWidth
      }
    );
    return l.overflow ||= e.overflow, n.fractionalMetrics && (l.fractionalMetrics = !0), l;
  } finally {
    t.restore();
  }
}
function wu(t, e) {
  return t === "saga" ? /^(I|II|III|IV)$/.test(e) ? Nt("saga", e) : null : Nt(
    "planeswalker",
    e.startsWith("+") ? "LoyaltyPlus" : e === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function vu(t, e) {
  return Q(t) === "saga" ? Nt("saga_textboxes", e === "Colourless" ? "Land" : e) : null;
}
function e1(t) {
  const e = t.colorCalibration === "set-hsb-v1" && t.calibration !== "source" ? xl(t)?.paperColors[G(t).boxes] : void 0;
  return e || ({
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[G(t).boxes] ?? "#dededbf0");
}
function r1(t, e) {
  const { top: r, scale: n } = ua(Q(e) === "planeswalker-large");
  t.save(), t.translate(0, r), t.scale(1, n), t.translate(0, -r), t.beginPath(), t.moveTo(66, r);
  const o = Ct.rightInset;
  t.lineTo(448 - o, r), t.quadraticCurveTo(456 - o, r, 456 - o, r + 8), t.lineTo(456 - o, 613), t.bezierCurveTo(456 - o, 623, 420 - o, 629, 257, 629), t.bezierCurveTo(94, 629, 58, 623, 58, 613), t.lineTo(58, r + 8), t.quadraticCurveTo(58, r, 66, r), t.closePath(), t.clip(), t.fillStyle = e1(e), t.fillRect(58, r, 398 - o, 629 - r), t.restore();
}
function n1(t, e, r, n) {
  t.save(), n && (n.fractionalMetrics && (t.textRendering = "geometricPrecision", t.fontKerning = "normal"), e += n.dx, r += n.dy, t.translate(e, 0), t.scale(n.width, 1), e = 0), t.fillStyle = Bt.colonInk, t.font = `${Bt.colonFontSize * (n?.size ?? 1)}px ${Bt.colonFontFamily}`, t.textAlign = "center", t.textBaseline = "alphabetic";
  const o = t.measureText(":");
  t.fillText(
    ":",
    e,
    r + Bt.colonOffsetY + (o.actualBoundingBoxAscent - o.actualBoundingBoxDescent) / 2
  ), t.restore();
}
function o1(t, e, r) {
  const n = Q(e), o = n === "saga", s = Yt(e).rules, a = o ? void 0 : Te(e), i = s[0] * x, l = s[1] * I, d = s[2] * x, u = s[3] * I;
  o && (t.fillStyle = "#e3d8bb", t.fillRect(i, l, d, u));
  const h = vu(e, G(e).boxes), m = h ? r.get(h) : void 0;
  if (m && t.drawImage(m, i, l, d, u), !fe(t)) return;
  const c = o ? tc(e) : Qp(t, e);
  for (const [g, f] of c.entries()) {
    if (g > 0) {
      const y = c[g - 1]?.layout, b = f.layout && y ? Math.max(y.top + y.height + 3, Math.min(l + f.top, f.layout.top - 3)) : l + f.top;
      t.fillStyle = "#0002", t.fillRect(
        i + (o ? 0 : Bt.separatorLeft),
        b,
        d - (o ? 0 : Bt.separatorLeft),
        Bt.separatorHeight
      );
    }
    if (t.fillStyle = "#17140f", t.textAlign = "left", f.layout) $t(t, f.layout, r);
    else {
      t.font = `${f.reminder ? "italic " : ""}${f.font}px "CardRenderer MTG MPlantin", Georgia`;
      const y = As(t, f.text, f.width, f.font).length * f.font;
      Xl(
        t,
        f.text,
        i + f.left,
        l + f.top + (f.height - y) / 2,
        f.width,
        { size: f.font, italic: f.reminder },
        r
      );
    }
    const p = o ? 36 : Bt.badgeWidth, w = o ? 36 : Bt.badgeHeight;
    f.badges.forEach((y, b) => {
      const v = i + (o ? -18 : 0), S = l + f.top + f.height / 2 + (b - f.badges.length / 2) * w, k = wu(n, y), M = k ? r.get(k) : null;
      if (M) {
        if (t.save(), !o) {
          const T = t.getTransform().a;
          t.shadowColor = "#0009", t.shadowBlur = 3 * T, t.shadowOffsetY = 2 * T;
        }
        const C = a?.badges;
        if (C) {
          const T = ea(y, a?.loyalty), R = p * C.width, A = w * C.height;
          t.drawImage(
            M,
            v + (p - R) / 2 + C.dx + (T?.dx ?? 0),
            S + (w - A) / 2 + C.dy + (T?.dy ?? 0),
            R,
            A
          );
        } else t.drawImage(M, v, S, p, w);
        t.restore();
      } else
        t.fillStyle = "#29231c", t.fillRect(v, S, p, w);
      o ? M || (t.fillStyle = "white", t.textAlign = "center", t.textBaseline = "middle", t.font = 'bold 19px "CardRenderer MTG Beleren", Georgia', t.fillText(y, v + p / 2, S + w / 2, p - 3)) : (Kc(t, y, [v, S, p, w], a?.loyalty), n1(
        t,
        v + p + Bt.colonOffsetX,
        a?.colon ? Jc(y, S + w / 2, a.loyalty) : S + w / 2,
        a?.colon
      ));
    });
  }
}
function s1(t, e) {
  ed(
    t,
    Q(e) === "planeswalker-large",
    () => r1(t, e)
  );
}
const Su = 0.7;
function a1(t, e, r, n = !1) {
  const [o, s, a, i] = [
    r[0] * x,
    r[1] * I,
    r[2] * x,
    r[3] * I - 1
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
  t.drawImage(e, ...u), n && (t.globalAlpha *= Su, t.drawImage(e, ...u)), t.restore(), t.save(), t.clip(l), t.strokeStyle = "#0007", t.lineWidth = 3, t.stroke(l), t.restore(), t.strokeStyle = "#191816", t.lineWidth = 1.2, t.stroke(l), t.restore();
}
function i1(t, e, r) {
  if (!e.pinlines) return;
  const n = (i) => {
    const l = r.get(i);
    if (!l) throw Error(`Planar pinline asset unavailable: ${i}`);
    return l;
  }, o = () => {
    const i = $();
    i.width = 732, i.height = 1020;
    const l = i.getContext("2d");
    if (!l) throw Error("Missing Planar pinline composition context");
    return { canvas: i, context: l };
  }, s = o(), a = o();
  try {
    s.context.drawImage(n(e.pinlines.left), 0, 0, 732, 1020), a.context.drawImage(n(e.pinlines.right), 0, 0, 732, 1020), a.context.globalCompositeOperation = "destination-in";
    const i = a.context.createLinearGradient(732 * 0.47, 0, 732 * 0.53, 0);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), a.context.fillStyle = i, a.context.fillRect(0, 0, 732, 1020), s.context.drawImage(a.canvas, 0, 0), s.context.globalCompositeOperation = "destination-in", s.context.drawImage(n(e.pinlines.mask), 0, 0, 732, 1020), as(t, s.canvas);
  } finally {
    s.canvas.width = s.canvas.height = 0, a.canvas.width = a.canvas.height = 0;
  }
}
function Yi(t, e, r) {
  if (!zt(t, e)) return { dx: 0, dy: 0, size: 1 };
  const n = t.frameTreatment === "colorshifted";
  return r === "title" ? n ? { dx: 0.25, dy: 0.75, size: 1.04 } : { dx: 1, dy: 0.75, size: 1.035 } : n ? { dx: -0.75, dy: -1.25, size: 1.03 } : { dx: 0.5, dy: 0, size: 1.025 };
}
const l1 = 1.1;
function Cu(t) {
  return !t.setSymbol && ["m19", "m20", "m21"].includes(t.setCode?.toLowerCase() ?? "");
}
function ku(t, e, r, n, o, s, a, i, l = 1) {
  const d = !r || r === "common", u = $(), h = 2, m = 4;
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
function d1(t, e, r, n) {
  const o = $();
  o.width = 732, o.height = 1020;
  try {
    const s = o.getContext("2d");
    if (!s) throw Error("Missing frame stock composition context");
    n ? (s.save(), s.scale(1.5, 1.5), as(s, e, n === "colorshifted"), s.restore()) : s.drawImage(e, 0, 0, o.width, o.height), s.globalCompositeOperation = "source-in", s.fillStyle = r, s.fillRect(0, 0, o.width, o.height), t.drawImage(o, 0, 0, 488, 680);
  } finally {
    o.width = o.height = 0;
  }
}
const vr = (t) => [
  t[0] * x,
  t[1] * I,
  t[2] * x,
  t[3] * I
];
function u1(t, e, r, n, o) {
  const s = wt(e);
  if (!s) throw Error("Missing replacement frame family.");
  const a = (tt) => {
    const z = r.get(tt);
    if (!z) throw Error(`Replacement frame asset unavailable: ${tt}`);
    return z;
  }, { rects: i } = s, l = e.frameAssetFamily === "eighth", d = !!ne(e), u = lr(e, s.frame) ?? Ft(e) ?? It(e.setCode, e.borderColor).border;
  if (t.save(), t.fillStyle = u, t.fillRect(0, 0, x, I), n && t.drawImage(n, 0, 0, x, I), qt(t, e, r, vr(i.art), o), o === "artwork") {
    t.restore();
    return;
  }
  const h = Ro(e, s.frame);
  if (ds(e, s.frame) ? H0(t, a(s.frame)) : h ? Ca(t, a(s.frame), h) : zt(e, s.frame) ? as(t, a(s.frame), e.frameTreatment === "colorshifted") : t.drawImage(a(s.frame), 0, 0, x, I), i1(t, s, r), s.rightFrame) {
    const tt = $();
    tt.width = 732, tt.height = 1020;
    const z = tt.getContext("2d"), Xt = Ro(e, s.rightFrame);
    Xt ? (z.save(), z.scale(1.5, 1.5), Ca(z, a(s.rightFrame), Xt), z.restore()) : z.drawImage(a(s.rightFrame), 0, 0, tt.width, tt.height);
    const V = $();
    V.width = tt.width, V.height = tt.height;
    const Et = V.getContext("2d"), be = (ht, ft) => {
      const _t = Et.createLinearGradient(V.width * ht, 0, V.width * ft, 0);
      return _t.addColorStop(0, "#0000"), _t.addColorStop(1, "#000"), _t;
    };
    Et.fillStyle = be(0.47, 0.53), Et.fillRect(0, 0, V.width, V.height);
    const se = l ? [0.08, 0.627, 0.84, 0.29] : [0.071, 0.629, 0.858, 0.294], [de, Ge, gr, Fe] = se, we = de * V.width, Mt = Ge * V.height, D = gr * V.width, J = Fe * V.height;
    Et.clearRect(we, Mt, D, J), Et.fillStyle = be(0.27, 0.73), Et.fillRect(we, Mt, D, J), z.globalCompositeOperation = "destination-in", z.drawImage(V, 0, 0), t.drawImage(tt, 0, 0, x, I), tt.width = tt.height = 0, V.width = V.height = 0;
  }
  u !== "#090806" && d1(
    t,
    a(s.border),
    u,
    zt(e, s.frame) ? e.frameTreatment === "colorshifted" ? "colorshifted" : "planar" : void 0
  ), vf(t, e, r), D0(t, e, r), W0(t, e, r), Ud(t, e, r), t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
  const m = jn(e), c = l ? "CardRenderer MTG Matrix" : xs(e) ?? "CardRenderer MTG Beleren", [g, f, p, w] = vr(d ? H.title : i.title), y = g + (d ? j.plateLeft + 1 : 0), b = e.manaSymbols ?? [], { size: v } = s.mana, S = s.mana.gap + (m?.spacing ?? 0), k = s.mana.right * x, M = b.length * v + Math.max(0, b.length - 1) * S, C = [
    k - M,
    s.mana.center * I - v / 2,
    M,
    v
  ], T = ke(C, m);
  t.font = `bold ${s.titleSize}px "${c}", Georgia`, t.save(), (l || d) && t.translate(...sa(e, l ? "eighth" : "modern")), d && (t.letterSpacing = `${j.titleTracking}px`);
  const R = Yi(e, s.frame, "title");
  t.translate(R.dx, R.dy), Hi(t, e, s.frame), ct(
    t,
    e.name,
    y,
    f + w / 2 + (d ? 1 : 0),
    d ? T[0] - y - (b.length ? j.titleGap : 0) : b.length ? T[0] - y - 8 : p,
    s.titleSize * R.size,
    !0,
    1,
    c,
    e.frameTreatment === "colorshifted" ? 0.5 : 0
  ), t.restore(), Z(
    t,
    e,
    "manaCost",
    () => rr(t, C, m, () => {
      b.forEach(
        (tt, z) => mt(
          t,
          tt,
          k - M + z * (v + S),
          s.mana.center * I - v / 2,
          v,
          r,
          !0,
          m
        )
      );
    })
  );
  const A = st(e), L = r.get(A ?? ""), O = Me(e), B = L ? Math.min(
    s.symbol.width * x / (L.width * O[2]),
    s.symbol.height * I / (L.height * O[3])
  ) : 0, U = L ? L.width * O[2] * B : 0, E = L ? L.height * O[3] * B : 0, q = yg(e, s.frame, A) ?? Zf(e, A, [
    s.symbol.right * x - U,
    s.symbol.center * I - E / 2,
    U,
    E
  ]), K = ke(q, e.symbolAdjustment?.set), [dt, pt, Pt, Wt] = vr(i.type);
  t.save();
  const X = Yi(e, s.frame, "type"), ut = jl(t, e, "plate"), le = nt(e)?.headings.type;
  if (t.translate(X.dx + (le?.dx ?? 0), X.dy + (le?.dy ?? 0)), Hi(t, e, s.frame), t.font = `bold ${s.typeSize}px "${c}", Georgia`, ct(
    t,
    e.typeLine ?? "",
    dt + ut.dx,
    pt + Wt / 2 + ut.dy,
    (L ? K[0] - dt - 7 : Pt) - ut.dx,
    s.typeSize * X.size * ut.size,
    !0,
    ut.width * (le?.width ?? 1),
    c,
    e.frameTreatment === "colorshifted" ? 0.5 : 0,
    e.textInk,
    "type"
  ), t.restore(), Z(
    t,
    e,
    "setSymbol",
    () => rr(t, q, e.symbolAdjustment?.set, () => {
      if (L) {
        const tt = du(e);
        Gt(A) || e.setSymbol ? t.drawImage(L, ...q) : Cu(e) ? ku(t, L, e.rarity, ...q, O, 1.5) : tt ? uu(t, L, tt, e.rarity, ...q, O, !1) : ye(t, L, e.setCode, e.rarity, ...q, O);
      }
    })
  ), pl(t, e, r) || $t(t, Dd(t, e), r), e.power != null && e.toughness != null && t.drawImage(a(s.pt), ...vr(i.stats)), l) {
    Y0(t, e, r, s.frame), t.restore();
    return;
  }
  if (e.power != null && e.toughness != null) {
    const [tt, z, Xt, V] = vr(i.stats), Et = l ? "CardRenderer MTG Matrix" : "CardRenderer MTG Beleren";
    t.font = `bold ${d ? j.statsFont : 25}px "${Et}", Georgia`, t.textAlign = "center", t.textBaseline = "middle", rd(
      t,
      `${e.power}/${e.toughness}`,
      tt + Xt * (d ? 0.5 : 0.52),
      d ? z + j.statsLine / 2 + 2 : z + V * 0.52,
      d ? Xt : Xt * 0.85,
      e
    );
  }
  Jo(t, e), t.restore();
}
let qi = null;
function h1(t) {
  if (t.frameAssetFamily !== "eighth") return Promise.resolve();
  const e = qi ??= Promise.all([
    it().load('700 24px "CardRenderer MTG Matrix"'),
    it().load('700 29px "CardRenderer MTG Matrix Small Caps"')
  ]).then((r) => {
    if (r.some((n) => !n.length || n.some((o) => o.status !== "loaded")))
      throw Error("Replacement Eighth Edition frames need card-glint/magic/fonts.css.");
  }).catch((r) => {
    throw qi = null, r;
  });
  return Promise.all([e, z0(t, wt(t)?.frame ?? "")]).then(
    () => {
    }
  );
}
function Hi(t, e, r) {
  e.frameTreatment === "colorshifted" && (t.fillStyle = "#fff", t.shadowColor = lr(e, r) ?? "#000", t.shadowOffsetX = -21e-4 * x, t.shadowOffsetY = 15e-4 * I, t.shadowBlur = 0);
}
function m1(t, e, [r, n, o, s]) {
  const a = e.height * o / e.width;
  t.save(), t.beginPath(), t.rect(r, n, o, s / 2), t.clip(), t.drawImage(e, r, n + s - a + 1, o, a), t.restore();
}
function c1(t, [e, r, n, o], s) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(s)) return;
  t.save(), t.shadowColor = "transparent";
  const a = t.createLinearGradient(e, 0, e + n, 0);
  a.addColorStop(0, "rgba(255,255,255,0)"), a.addColorStop(0.025, "rgba(255,255,255,0.2)"), a.addColorStop(0.975, "rgba(255,255,255,0.2)"), a.addColorStop(1, "rgba(255,255,255,0)"), t.fillStyle = a, t.fillRect(e, r + o - 4, n, 2.3), t.restore();
}
const Se = /* @__PURE__ */ new Map();
function Mu(t) {
  if (!(!t.retired || t.users)) {
    if (!t.sources) {
      t.controller.abort();
      return;
    }
    URL.revokeObjectURL(t.sources.original), t.sources.backing && URL.revokeObjectURL(t.sources.backing), t.sources.outlined && URL.revokeObjectURL(t.sources.outlined), t.sources = void 0;
  }
}
function d2() {
  for (const t of Se.values())
    t.retired = !0, Mu(t);
  Se.clear();
}
async function g1(t, e) {
  e.throwIfAborted();
  let r = Se.get(t);
  if (!r) {
    const l = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const d = await In(t, {
          mode: "cors",
          signal: l.controller.signal
        });
        if (!d.ok) throw Error(`Symbol source ${d.status}: ${t}`);
        const u = await Gp(t, await d.blob()), h = await Ip(t, u), m = await Fp(t, u);
        l.controller.signal.throwIfAborted();
        const c = URL.createObjectURL(u);
        let g, f;
        try {
          g = h ? URL.createObjectURL(h) : void 0, f = m ? URL.createObjectURL(m) : void 0;
          const p = { original: c, backing: g, outlined: f };
          return l.sources = p, p;
        } catch (p) {
          throw URL.revokeObjectURL(c), g && URL.revokeObjectURL(g), f && URL.revokeObjectURL(f), p;
        }
      })
    };
    l.promise = l.promise.catch((d) => {
      throw Se.get(t) === l && Se.delete(t), d;
    }), Se.set(t, l), r = l;
  }
  r.users++;
  const n = r;
  let o = !1;
  const s = () => {
    o || (o = !0, n.users--, !n.users && !n.sources && (n.retired = !0, Se.get(t) === n && Se.delete(t)), Mu(n));
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
async function f1(t, e) {
  e.throwIfAborted();
  const r = [...new Set(t.filter((l) => !!l))], n = [], o = /* @__PURE__ */ new Map(), s = () => {
    for (const l of n) l.release();
    n.length = 0;
  }, i = (await Promise.allSettled(
    r.map(async (l) => {
      if (!Bp(l) && !Pp(l)) {
        o.set(l, l);
        return;
      }
      const d = await g1(l, e);
      n.push(d), o.set(l, d.sources.original), d.sources.backing && o.set(fu(l), d.sources.backing), d.sources.outlined && o.set(pu(l), d.sources.outlined);
    })
  )).find((l) => l.status === "rejected");
  if (i?.status === "rejected")
    throw s(), i.reason;
  return e.aborted && (s(), e.throwIfAborted()), { urls: [...new Set(o.values())], aliases: o, dispose: s };
}
function p1(t, e) {
  const r = /* @__PURE__ */ new Map();
  for (const [n, o] of t) {
    const s = e.get(o);
    s && r.set(n, s);
  }
  return r;
}
async function y1(t, e) {
  return e.throwIfAborted(), In(t, { signal: e, mode: "cors" });
}
function b1(t) {
  if (t.startsWith(`${W}/img/frames/m15/holoStamps/`) || t.startsWith(`${W}/img/frames/planeswalker/holo/`) || t.startsWith(W) && /\/saga\/(sagaChapter|sagaDivider|sagaMidStripe|stamp)\.png$/.test(t))
    return;
  if (t.startsWith(`${W}/data/images/cardImages/saga/`)) return 768;
  if (t.startsWith(`${W}/img/frames/future/regular/futurePT`)) return;
  if (t.startsWith(`${W}/img/frames/`) && t.endsWith(".png"))
    return /\/pt\/|\/m15PT/.test(t) ? 256 : 768;
  if (t.startsWith(`${er}/img/frames/`) && t.endsWith(".png")) return 768;
  const e = t.startsWith(`${Qe}/img/`) ? t.slice(`${Qe}/img/`.length) : "";
  return e === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    e
  ) ? 768 : void 0;
}
async function Tu(t, e) {
  const r = await f1(t, e), n = r.urls, o = /* @__PURE__ */ new Map();
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, n.length) }, async () => {
        for (; s < n.length && !e.aborted; ) {
          const i = n[s++];
          try {
            const l = await y1(i, e);
            if (!l.ok) continue;
            const d = await l.blob(), u = await Du(d, e, b1(i));
            e.aborted ? u.close() : o.set(i, u);
          } catch {
          }
        }
      })
    );
  } finally {
    r.dispose();
  }
  const a = p1(r.aliases, o);
  return {
    images: a,
    dispose: () => {
      for (const i of o.values()) i.close();
      o.clear(), a.clear();
    }
  };
}
function xu(t) {
  if (t = Ht(t), t.frameTemplate)
    return [
      ...Fm(t),
      t.illustration,
      st(t),
      ...Kt(
        t.frameTemplate === "future" ? { ...t, manaSymbols: t.manaSymbols?.filter((a) => !_n(a)) } : t
      ),
      ...(t.faces ?? []).flatMap(Kt)
    ];
  if (Dn(t))
    return [
      ...Rd(t),
      t.illustration,
      st(t),
      ...Kt(t),
      ...Kt(cr(t))
    ];
  if (Ur(t))
    return [
      ...xd(t),
      t.illustration,
      st(t),
      ...Kt(t),
      ...Kt(t.faces[1])
    ];
  if (Pe(t))
    return [
      ...cd(t),
      ...jt(t).flatMap((a) => [
        a.face.illustration,
        ...Kt(a.face)
      ]),
      st(jt(t)[0].face)
    ];
  const e = Vt(t);
  if (e)
    return [
      ...jt(t).flatMap((a, i) => [
        ..._c(a.face, e, nr(t) && e === "eighth", i),
        a.face.illustration,
        st(a.face),
        ...Kt(a.face)
      ]),
      ...e === "eighth" && nr(t) ? Yg(t) : []
    ];
  const r = K0(t);
  if (r)
    return [
      ...r,
      Ie(t)?.image,
      Ie(t)?.rightImage,
      t.illustration,
      st(t),
      ...Kt(t)
    ];
  if (lt(t)) return xh(t);
  if (Q(t) === "saga")
    return [...Xm(t), t.illustration, st(t), ...Kt(t)];
  const n = jt(t);
  if (n.length) return n.flatMap((a) => xu(a.face));
  const o = G(t), s = re(o, Q(t));
  return [
    Ie(t)?.image,
    Ie(t)?.rightImage,
    Q(t) === "normal" ? ir(t) : null,
    ...Yp(t),
    ...Q(t).startsWith("planeswalker") ? [Zd(
      Q(t) === "planeswalker-large",
      Vd(o.boxes)
    ).source] : [],
    s.background,
    s.frame,
    s.boxes,
    s.pt,
    vu(t, o.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(Q(t)) ? Dr(t).flatMap(
      (a) => a.badges.map((i) => wu(Q(t), i))
    ) : [],
    o.legendary ? s.crown : null,
    t.illustration,
    st(t),
    ...Kt(t)
  ];
}
let Xi = null;
function Ji() {
  return Xi ??= Promise.all([
    it().load('24px "CardRenderer MTG Beleren"'),
    it().load('700 24px "CardRenderer MTG Beleren"'),
    it().load('700 11px "CardRenderer MTG Beleren Small Caps"'),
    it().load('24px "CardRenderer MTG MPlantin"'),
    it().load('italic 24px "CardRenderer MTG MPlantin"'),
    it().load('14px "CardRenderer MTG Relay"'),
    it().load('14px "CardRenderer MTG Artist Credit"')
  ]).then((t) => {
    if (t.some((e) => !e.length || e.some((r) => r.status !== "loaded")))
      throw Error(
        "Magic fonts are unavailable. Load card-glint/magic/fonts.css before preparing cards."
      );
  }).catch((t) => {
    throw Xi = null, t;
  });
}
function on(t) {
  return Yt(t).art;
}
const Ki = /* @__PURE__ */ new WeakMap(), sn = ([t, e, r, n]) => [t, 1 - e - n, t + r, 1 - e], w1 = [
  sn(Yt({ name: "", calibration: "printing" }).art),
  [0, 0, 0, 0]
];
function u2(t) {
  if (!t) return w1;
  const e = Ki.get(t);
  if (e) return e;
  const r = jt(t), n = r.length ? [
    sn(li(r[0], on(r[0].face))),
    sn(li(r[1], on(r[1].face)))
  ] : [sn(on(t)), [0, 0, 0, 0]];
  return Ki.set(t, n), n;
}
const v1 = new Nr(4 * 1024 * 1024), Vi = /* @__PURE__ */ new WeakMap();
let S1 = 0;
async function C1(t, e, r, n) {
  if (n.throwIfAborted(), r !== void 0 && !["auto", "alpha", "ink"].includes(r))
    throw Error("Invalid set symbol mask mode");
  if (!(r === "ink" || (r === void 0 || r === "auto") && Gt(e))) return { value: t, release() {
  } };
  let s = Vi.get(t);
  s === void 0 && Vi.set(t, s = ++S1);
  const a = Math.min(1, 512 / Math.max(t.width, t.height)), i = Math.max(1, Math.round(t.width * a)), l = Math.max(1, Math.round(t.height * a));
  return v1.acquire(
    JSON.stringify(["set-symbol-ink-v1", s, i, l]),
    i * l * 4,
    async () => {
      const d = $();
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
async function k1(t, e, r, n, o, s, a = Tu, i) {
  return Ru(t, e, r, n, {
    threshold: o,
    resolveEtching: i,
    beforePaint: s,
    loadImages: a,
    height: I
  });
}
async function Ru(t, e, r, n, o) {
  const { threshold: s, beforePaint: a, loadImages: i, height: l } = o, d = jt(e);
  if (d.length) {
    for (const v of d) {
      t.save();
      try {
        Gd(t, v), await Ru(t, v.face, r, n, {
          ...o,
          height: v.height * x / v.width
        });
      } finally {
        t.restore();
      }
    }
    return;
  }
  if (e.illustration && o.resolveEtching) {
    let v;
    try {
      const S = await o.resolveEtching(e, r, n, s, a);
      v = await i([S, e.illustration], n);
      const k = v.images.get(S ?? "");
      if (k && !n.aborted) {
        await a?.(), n.throwIfAborted();
        const M = e.frameTemplate === "battle", C = M ? 523 : x, T = M ? 375 : l, R = Yt(e).art, A = M ? Sn(R) : [
          R[0] * C,
          R[1] * T,
          R[2] * C,
          R[3] * T
        ], L = v.images.get(e.illustration) ?? k;
        t.save(), M && (t.translate(0, l), t.rotate(-Math.PI / 2), t.scale(l / 523, x / 375)), t.beginPath();
        const O = on(e), B = M ? Sn(O) : [
          O[0] * C,
          O[1] * T,
          O[2] * C,
          O[3] * T
        ];
        t.rect(...B), t.clip(), t.imageSmoothingQuality = "low";
        const U = xn(e, A, C, T, M ? -90 : 0);
        if (e.illustrationCrop) {
          const E = e.illustrationCrop, q = Rn(
            L.width * E[2],
            L.height * E[3],
            U,
            e.artPlacement
          );
          t.drawImage(
            k,
            E[0] * k.width,
            E[1] * k.height,
            E[2] * k.width,
            E[3] * k.height,
            ...q
          );
        } else
          t.drawImage(
            k,
            ...Rn(L.width, L.height, U, e.artPlacement)
          );
        t.restore();
      }
    } catch {
    } finally {
      v?.dispose();
    }
  }
  if (n.throwIfAborted(), !e.setCode || e.printingElements?.setSymbol?.hidden) return;
  const [u, h, m, c] = Yt(e).stamp, g = u * x, f = h * l, p = m * x, w = c * l, y = R0(e), b = await i([y], n);
  try {
    await a?.(), n.throwIfAborted();
    const v = y ? b.images.get(y) : null;
    t.save();
    try {
      if (e.printingElements?.setSymbol?.offset && t.translate(...e.printingElements.setSymbol.offset), t.globalAlpha = 0.68, v) {
        const S = await C1(v, y, e.setSymbolMask, n);
        try {
          n.throwIfAborted();
          const k = Math.min(p / S.value.width, w / S.value.height);
          t.drawImage(
            S.value,
            g + (p - S.value.width * k) / 2,
            f + (w - S.value.height * k) / 2,
            S.value.width * k,
            S.value.height * k
          );
        } finally {
          S.release();
        }
      } else
        t.translate(g, f), t.scale(p / 100, w / 100), t.fillStyle = "white", t.fill(new Path2D(s0)), t.font = "bold 43px Georgia", t.textAlign = "center", t.textBaseline = "alphabetic", t.fillText(l0(e.setCode), 50, 65);
    } finally {
      t.restore();
    }
  } finally {
    b.dispose();
  }
}
function M1(t) {
  return t.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const T1 = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, Zi = /* @__PURE__ */ new WeakMap();
function x1(t, e) {
  let r = Zi.get(e);
  if (r || (r = new Path2D(e.path), Zi.set(e, r)), t.save(), e.viewBox) {
    const [n, o, s, a] = e.viewBox;
    t.scale(24 / s, 24 / a), t.translate(-n, -o);
  }
  e.transform && t.transform(...e.transform), e.filled ? (t.fillStyle = t.strokeStyle, t.fill(r)) : t.stroke(r), t.restore();
}
function Qi(t, e, r, n, o = !1) {
  const s = x * 0.105, a = x * 0.015, i = Math.floor(x * 0.9 / (s + a));
  if (e.forEach((c, g) => {
    t.save(), t.translate(
      x * 0.05 + g % i * (s + a),
      I * 0.13 + Math.floor(g / i) * (s + a)
    ), t.fillStyle = "#17201fed", t.strokeStyle = "#c6af7977", t.lineWidth = 1, t.beginPath(), t.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2), t.fill(), t.stroke(), t.translate(s * 0.14, s * 0.14), t.scale(s * 0.72 / 24, s * 0.72 / 24), t.strokeStyle = "#f3e9cf", t.lineWidth = 1.8, t.lineCap = "round", t.lineJoin = "round", x1(t, c), t.restore();
  }), r?.power == null || r.toughness == null) return;
  t.save();
  const l = T1[o ? "inspect" : "table"], d = x * l.width, u = I * l.height, h = x * (1 - l.right - l.width), m = I * (1 - l.bottom - l.height);
  n ? t.drawImage(n, h, m, d, u) : (t.fillStyle = "#eee5cf", t.strokeStyle = "#746854", t.lineWidth = 2, t.beginPath(), t.roundRect(
    h + d * (o ? 0.14 : 0.1),
    m + u * (o ? 0.19 : 0.18),
    d * (o ? 0.72 : 0.8),
    u * (o ? 0.62 : 0.64),
    u * 0.12
  ), t.fill(), t.stroke()), t.font = `bold ${x * (o ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.fillText(
    `${r.power}/${r.toughness}`,
    h + d / 2,
    o ? m + u / 2 - x * 0.01 : m + u * 0.48,
    d * 0.72
  ), t.restore();
}
function R1(t) {
  const e = typeof t == "number" ? t : t === "table" ? 244 : t === "native" ? 488 : t === "inspect" ? 732 : NaN, r = Math.round(e * I / x);
  if (!Number.isInteger(e) || e < 1 || r < 1 || e * r > 4194304)
    throw RangeError("Invalid card texture tier");
  return [e, r];
}
function h2(t) {
  return t.currentStats?.power != null && t.currentStats.toughness != null && t.statusLayout !== "inspect" ? { ...t, statusLayout: "inspect" } : t;
}
function L1(t) {
  if (t.printedImage || t.layer === "etching" || t.paintLayer === "artwork")
    return;
  const e = Ht(t.face);
  if (!bs(e)) return;
  const r = e.printingElements?.manaCost?.hidden ? [] : e.manaSymbols ?? [], n = r.some((i) => /^[BRG]$|^\d+$/.test(i)), o = e.calibration !== "source" && ["set-hsb-v1", "early-hsb-v1"].includes(e.colorCalibration ?? ""), s = t.rulesText !== !1 ? [
    e.rulesText ?? "",
    ...(e.rulesParagraphs ?? []).flatMap((i) => i.runs.map((l) => l.text))
  ].join(`
`) : "", a = o && (r.some((i) => /^[WUBRG]$|^\d+$/.test(i)) || /\{(?:[WUBRG]|\d+)\}/.test(s));
  return n || a ? "revised-mana-fit-v1" : void 0;
}
function m2(t, e) {
  if (t.custom)
    return JSON.stringify([
      "custom-face-v1",
      t.custom.key,
      e,
      t.layer ?? "face",
      t.layer === "etching" ? t.etchThreshold ?? 20 : null
    ]);
  const r = t.face, n = t.layer === "etching" && !ms(r) ? void 0 : rh(r), o = !t.printedImage && t.layer !== "etching" && t.paintLayer !== "artwork" && t.rulesText !== !1 ? Nh(r) : void 0, s = !t.printedImage && t.layer !== "etching" && t.paintLayer !== "artwork" && (r.frameAssetFamily === "eighth" || r.frameTemplate === "future" || Vt(r) === "eighth"), a = Qo(r, t.layer === "etching"), i = t.currentStats?.power != null && t.currentStats.toughness != null ? [t.currentStats.power, t.currentStats.toughness] : null;
  return JSON.stringify([
    Qe,
    W,
    "canvas-face-v148",
    ...!t.printedImage && t.layer !== "etching" && t.paintLayer !== "artwork" && Da(r) ? [Da(r)] : [],
    ...!t.printedImage && t.layer !== "etching" && t.paintLayer !== "artwork" && Ja(r) ? [Ja(r)] : [],
    ...s ? ["matrix-heading-alphabetic-v1"] : [],
    ...!t.printedImage && t.layer !== "etching" && t.paintLayer !== "artwork" && t.rulesText !== !1 && td(r) ? [Em] : [],
    ...!t.printedImage && t.layer !== "etching" && t.paintLayer !== "artwork" && Cs(r) && lt(r) && (!(r.land ?? /\bLand\b/.test(r.typeLine ?? "")) && r.artist && !r.printingElements?.artist?.hidden || r.power != null && r.toughness != null) ? ["revised-footer-geometry-v1"] : [],
    ...!t.printedImage && t.layer !== "etching" && t.paintLayer !== "artwork" && r.setCode?.toLowerCase() === "3ed" && Rl(r, "B") === "opaque-percentile" && (!r.printingElements?.manaCost?.hidden && r.manaSymbols?.includes("B") || t.rulesText !== !1 && /\{B\}/.test(
      [
        r.rulesText ?? "",
        ...(r.rulesParagraphs ?? []).flatMap((l) => l.runs.map((d) => d.text))
      ].join(`
`)
    )) ? ["revised-black-paper-v1"] : [],
    ...L1(t) ? ["revised-mana-fit-v1"] : [],
    ...!t.printedImage && t.layer !== "etching" && t.paintLayer !== "artwork" && ks(Ht(r)) ? ["revised-heading-fit-v1"] : [],
    ...n ? [n] : [],
    ...o ? [o] : [],
    ...t.layer !== "etching" && ["lea", "leb", "2ed"].includes(r.setCode?.toLowerCase() ?? "") && r.wordingMode !== "oracle" ? [Zh] : [],
    ...Q(r).startsWith("planeswalker") ? [Ko] : [],
    ...st(r)?.startsWith(`${W}/img/setSymbols/official/m15-`) && !r.setSymbol && r.rarity !== "common" ? ["m15-no-added-rim-v1"] : [],
    ["silhouette-v2", lu(r)],
    Om(r),
    t.paintLayer ?? null,
    t.rulesText !== !1,
    e,
    t.printingId,
    t.layer === "etching" ? null : t.printedImage,
    a,
    t.layer ?? "face",
    t.layer === "etching" ? t.etchThreshold ?? 14 : null,
    t.layer === "etching" ? null : [
      (t.emblems ?? []).map((l) => [
        l.path,
        l.viewBox ?? null,
        l.transform ?? null,
        !!l.filled
      ]),
      i,
      i ? t.statusLayout ?? e : null
    ]
  ]);
}
function Qo(t, e) {
  const r = [
    t.printingElements,
    t.collectorTotal,
    t.collectorLanguage,
    t.collectorSetCode,
    ...t.calibration !== void 0 ? [["printing-calibration-v1", t.calibration]] : []
  ], n = r.some((s) => s !== void 0) ? [["printing-elements-v1", ...r]] : [], o = jt(t);
  return o.length ? [
    t.layout,
    ...n,
    t.artist ?? null,
    t.collectorNumber ?? null,
    t.legalText ?? null,
    t.borderColor ?? null,
    o.map((s) => [s.x, s.y, s.width, s.height, s.rotation, Qo(s.face, e)]),
    !e && Zs(t),
    !e && pd(t),
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
    Yt(t)
  ] : [
    ...n,
    lt(t) ? [me(t), St(t)] : null,
    t.borderColor ?? null,
    t.frameAssetFamily ?? null,
    t.frameTreatment ?? null,
    t.frameTemplate ?? null,
    t.futureTreatment ?? null,
    t.defense ?? null,
    t.faces?.map((s) => Qo(s, e)) ?? null,
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
    qp(t),
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
    Yt(t),
    G(t),
    ...t.printingOmissions?.length ? [t.printingOmissions] : [],
    ...t.blackBorderLift ? [["border-ink", t.blackBorderLift]] : [],
    ...sh(t),
    ...nt(t) ? [["eighth-printing", t.setCode?.toLowerCase(), nt(t)]] : []
  ];
}
function E1(t) {
  return $(R1(t));
}
async function c2(t, e, r, n) {
  if (r.throwIfAborted(), n?.output === "r8" && t.layer !== "etching")
    throw Error("R8 composition requires the etching layer");
  const o = async (i) => {
    if (n?.output !== "r8") {
      const l = await Gu(i, n?.output === "bitmap");
      return r.aborted && (Qr(l), r.throwIfAborted()), l;
    }
    try {
      return r.throwIfAborted(), Im(i, "alpha");
    } finally {
      Qr(i);
    }
  };
  if (t = { ...t, face: Ht(t.face) }, ta(t.face), vl(t.face), Es(t.face), t.custom) {
    await n?.beforePaint?.(), r.throwIfAborted();
    const i = await t.custom.compose(
      e,
      r,
      t.layer ?? "face",
      t.etchThreshold
    );
    return r.aborted && (Qr(i), r.throwIfAborted()), o(i);
  }
  const s = n?.loadImages ?? Tu, a = E1(e);
  try {
    const i = a.getContext("2d", {
      willReadFrequently: !!n?.cpuPixels
    });
    if (!i) throw new Error("Card composition needs Canvas2D.");
    if (i.imageSmoothingEnabled = !0, i.imageSmoothingQuality = "high", i.scale(a.width / x, a.height / I), t.layer === "etching")
      return await k1(
        i,
        t.face,
        t.printingId,
        r,
        t.etchThreshold,
        n?.beforePaint,
        s,
        n?.resolveEtching
      ), await o(a);
    i.fillStyle = "#090806", i.fillRect(0, 0, x, I);
    const l = t.currentStats?.power != null && t.currentStats.toughness != null ? re(G(t.face)).pt : null;
    if (t.printedImage) {
      const g = e !== "table" ? M1(t.printedImage) : t.printedImage;
      l && await (n?.loadFonts ?? Ji)();
      const f = await s(l ? [g, l] : [g], r);
      try {
        const p = f.images.get(g);
        if (p && !r.aborted) {
          if (await n?.beforePaint?.(), r.throwIfAborted(), i.drawImage(p, 0, 0, x, I), t.paintLayer !== "artwork" && t.face.blackBorderLift && (t.face.borderColor ?? "black") === "black") {
            if (!Number.isFinite(t.face.blackBorderLift) || t.face.blackBorderLift < 0 || t.face.blackBorderLift > 0.2)
              throw Error("Invalid black border lift");
            const w = Math.round(t.face.blackBorderLift * 255), y = x * 0.035;
            i.save(), i.globalCompositeOperation = "lighten", i.fillStyle = `rgb(${w},${w},${w})`, i.beginPath(), i.rect(0, 0, x, I), i.rect(y, y, x - 2 * y, I - 2 * y), i.fill("evenodd"), i.restore();
          }
          return Qi(
            i,
            t.emblems ?? [],
            t.currentStats,
            l ? f.images.get(l) : void 0,
            t.statusLayout === "inspect" || e === "inspect"
          ), tl(i, t.face), await o(a);
        }
      } finally {
        f.dispose();
      }
    }
    t.paintLayer !== "artwork" && await Promise.all([
      (n?.loadFonts ?? Ji)().then(
        () => Promise.all([Yh(t.face), zh(t.face)])
      ),
      Vt(t.face) ? Zg(t.face) : h1(t.face),
      fg(t.face),
      Bh(t.face),
      Q(t.face) === "saga" ? rf() : Promise.resolve(),
      Ur(t.face) || Dn(t.face) ? Jd() : Promise.resolve(),
      lt(t.face) || Vt(t.face) === "old" || Qt(t.face, "W") === "historic-font" ? (n?.loadRetroFont ?? Np)() : Promise.resolve()
    ]), r.throwIfAborted();
    const d = await s(xu(t.face), r);
    let u, h, m, c;
    try {
      t.paintLayer !== "artwork" && (u = await $f(t.face, d.images, r)), t.paintLayer !== "artwork" && (h = await qf(t.face, u?.images ?? d.images, r)), m = t.paintLayer === "artwork" ? { images: d.images, dispose() {
      } } : await kg(
        t.face,
        h?.images ?? u?.images ?? d.images,
        r
      ), t.paintLayer !== "artwork" && (c = await df(t.face, m.images, r)), await n?.beforePaint?.(), r.throwIfAborted();
      const g = c?.images ?? m.images;
      if (L0(
        i,
        t.rulesText !== !1,
        () => rm(
          i,
          t.face,
          () => Lu(
            i,
            t.face,
            g,
            I,
            !1,
            n?.underArt,
            t.paintLayer
          )
        )
      ), t.paintLayer !== "artwork" && t.face.blackBorderLift && (t.face.borderColor ?? "black") === "black") {
        if (!Number.isFinite(t.face.blackBorderLift) || t.face.blackBorderLift < 0 || t.face.blackBorderLift > 0.2)
          throw Error("Invalid black border lift");
        const f = Math.round(t.face.blackBorderLift * 255), p = x * 0.035;
        i.save(), i.globalCompositeOperation = "lighten", i.fillStyle = `rgb(${f},${f},${f})`, i.beginPath(), i.rect(0, 0, x, I), i.rect(p, p, x - 2 * p, I - 2 * p), i.fill("evenodd"), i.restore();
      }
      return Qi(
        i,
        t.emblems ?? [],
        t.currentStats,
        l ? d.images.get(l) : void 0,
        t.statusLayout === "inspect" || e === "inspect"
      ), tl(i, t.face), await o(a);
    } finally {
      c?.dispose(), m?.dispose(), h?.dispose(), u?.dispose(), d.dispose();
    }
  } catch (i) {
    throw a.width = a.height = 0, i;
  }
}
function tl(t, e) {
  t.save(), t.setTransform(
    t.canvas.width / x,
    0,
    0,
    t.canvas.height / I,
    0,
    0
  ), t.globalCompositeOperation = "destination-in", t.globalAlpha = 1, t.shadowColor = "transparent", t.filter = "none", t.fillStyle = "#000", t.beginPath(), t.roundRect(0, 0, x, I, lu(e) * x), t.fill(), t.restore();
}
function Lu(t, e, r, n = I, o = !1, s, a) {
  if (e = Ht(e), e.frameTemplate) {
    gg(t, e, r, a, s);
    return;
  }
  if (Dn(e)) {
    Dg(t, e, r, s, a);
    return;
  }
  if (Ur(e)) {
    $g(t, e, r, s, a);
    return;
  }
  if (Pe(e)) {
    of(t, e, r, s, a);
    return;
  }
  if (Vt(e)) {
    Vg(t, e, r, s, a);
    return;
  }
  if (wt(e)) {
    u1(t, e, r, s, a);
    return;
  }
  if (lt(e)) {
    Up(t, e, r, s, a);
    return;
  }
  if (Q(e) === "saga") {
    ef(t, e, r, s, a);
    return;
  }
  const i = jt(e);
  if (i.length) {
    t.fillStyle = Ft(e) ?? It(e.setCode, e.borderColor).border, t.fillRect(0, 0, x, I);
    for (const _ of i)
      t.save(), Gd(t, _), Lu(
        t,
        _.face,
        r,
        _.height * x / _.width,
        !0,
        s,
        a
      ), t.restore();
    if (a === "artwork") return;
    Jo(t, e), Zs(e) && fe(t) && (t.font = '14px "CardRenderer MTG MPlantin", Georgia', t.fillStyle = "white", t.textAlign = "center", t.textBaseline = "middle", t.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      x / 2,
      I - 12,
      x * 0.9
    ));
    return;
  }
  const l = (_) => [
    _[0] * x,
    _[1] * n,
    _[2] * x,
    _[3] * n
  ];
  t.fillStyle = Ft(e) ?? It(e.setCode, e.borderColor).border, t.fillRect(0, 0, x, n);
  const d = Yt(e), u = Q(e);
  if (a === "artwork") {
    qt(t, e, r, l(d.art), a);
    return;
  }
  const h = G(e), m = re(h, u), g = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[h.boxes] ?? "#827d72", f = (_, et, Tt = "top") => {
    const he = r.get(_);
    if (!he) return !1;
    const [Le, Xn, Jn, Kn] = l(et);
    t.save(), t.beginPath(), t.rect(Le, Xn, Jn, Kn), t.clip();
    const ha = Tt === "stretch" ? Kn : he.height * Jn / he.width;
    return t.drawImage(
      he,
      Le,
      Tt === "bottom" ? Xn + Kn - ha : Xn,
      Jn,
      ha
    ), t.restore(), !0;
  }, [p, w, y, b] = l(h.legendary ? d.legendaryBackground : d.background);
  if (t.save(), t.beginPath(), t.roundRect(p, w, y, b, [
    { x: y * 0.01282, y: b * 962e-5 },
    { x: y * 0.01282, y: b * 962e-5 },
    { x: y * 0.06838, y: b * 0.05128 },
    { x: y * 0.06838, y: b * 0.05128 }
  ]), t.clip(), o) {
    const _ = g.slice(1).match(/../g).map(
      (et, Tt) => Math.round(parseInt(et, 16) * 0.62 + [244, 236, 217][Tt] * 0.38)
    );
    t.fillStyle = `rgb(${_.join(",")})`, t.fillRect(p, w, y, b);
  }
  const v = r.get(m.background), S = u.startsWith("planeswalker");
  if (v && S ? To(t, v, p, w, y, u === "planeswalker-large") : v ? t.drawImage(
    v,
    p,
    w + (h.legendary ? j.legendaryBackgroundLift : 0),
    y,
    o ? b : v.height * y / v.width
  ) : (t.fillStyle = g, t.fillRect(p, w, y, b)), t.restore(), t.fillStyle = "#e3d8bb", !r.has(m.frame))
    if (u === "adventure")
      for (const _ of Yn(e).filter((et) => et.kind === "rules" && !et.color))
        t.fillRect(_.x, _.y, _.width, _.height);
    else t.fillRect(...l(d.rules));
  r.has(m.boxes) || (t.fillRect(...l(d.title)), t.fillRect(...l(d.type))), t.fillStyle = "#80745c", S || t.fillRect(...l(d.art));
  const k = r.get(m.frame);
  if (k && u === "normal" && !o) {
    const _ = us(e);
    rp(
      t,
      h,
      _,
      () => el(t, k, h.legendary, d.frame, !0, _)
    ), ep(t, h, _), np(t, h, _);
  }
  if (s && (t.save(), t.beginPath(), t.rect(0, 0, x, n), t.clip(), t.resetTransform(), t.drawImage(s, 0, 0, t.canvas.width, t.canvas.height), t.restore()), u === "normal" && !o) {
    const [_, et, Tt, he] = l(d.art), Le = Br.artRim;
    t.fillStyle = "#090806", t.fillRect(_ - Le, et - Le, Tt + 2 * Le, he + 2 * Le);
  }
  if (qt(t, e, r, l(d.art), a), S && s1(t, e), k && S) {
    const [_, et, Tt] = l(d.frame);
    To(t, k, _, et, Tt, u === "planeswalker-large");
    const he = ih(e, h.boxes);
    he && (t.save(), t.globalAlpha *= he, To(t, k, _, et, Tt, u === "planeswalker-large"), t.restore());
  } else k && u !== "normal" && el(t, k, h.legendary, d.frame);
  if (h.legendary && f(m.crown, d.crown), o) {
    const _ = r.get(m.boxes);
    if (_) {
      const Tt = _.height * 0.104;
      t.drawImage(_, 0, 0, _.width, Tt, ...l(d.title)), t.drawImage(_, 0, _.height - Tt, _.width, Tt, ...l(d.type));
    }
    const et = r.get(m.frame);
    t.fillStyle = "#e3d8bb", t.fillRect(...l(d.rules)), et && t.drawImage(
      et,
      et.width * 0.035,
      et.height * 0.675,
      et.width * 0.93,
      et.height * 0.325,
      ...l(d.rules)
    );
  } else {
    const _ = S && ["Colourless", "Artifact", "Land"].includes(h.boxes);
    f(m.boxes, d.title), _ && (t.save(), t.globalAlpha *= Su, f(m.boxes, d.title), t.restore());
    const et = r.get(m.boxes);
    S && et ? a1(t, et, d.type, _) : (f(m.boxes, d.type, "bottom"), u === "normal" && et && (m1(t, et, l(d.type)), c1(t, l(d.type), h.boxes)));
  }
  o || Ud(t, e, r), t.fillStyle = "#17140f", t.textBaseline = "middle", t.textAlign = "left";
  const [M, C, T, R] = l(d.title), A = M + j.plateLeft + (u === "normal" ? 1 : 0), L = jn(e), O = Nc(e), B = e.manaSymbols ?? [], U = j.manaSize * O, E = j.manaGap + (L?.spacing ?? 0), q = B.length * U + Math.max(0, B.length - 1) * E, K = M + T - j.plateRight, dt = K - q, pt = [
    dt,
    C + R / 2 - U / 2 + j.manaLift / 2,
    q,
    U
  ], Pt = B.length ? ke(pt, L) : pt, Wt = (u === "normal" && !o ? j.normalTitleFont : j.titleFont) * O, X = xs(e) ?? "CardRenderer MTG Beleren";
  t.font = `bold ${Wt}px "${X}", Georgia`, t.letterSpacing = `${j.titleTracking}px`, t.save(), u === "normal" && !o && t.translate(...sa(e, "modern"));
  const ut = Pt[0] - A - (B.length ? j.titleGap : 0), le = S ? Math.max(
    1,
    Math.min(
      Ct.titleWidth,
      (ut - 0.5) / t.measureText(Go(e.name, X)).width
    )
  ) : 1;
  ct(
    t,
    e.name,
    A,
    C + R / 2 + (u === "normal" ? 1 : 0),
    ut,
    Wt,
    !0,
    le,
    X
  ), t.restore(), t.letterSpacing = "0px", Z(
    t,
    e,
    "manaCost",
    () => rr(t, pt, L, () => {
      B.forEach(
        (_, et) => mt(
          t,
          _,
          dt + et * (U + E),
          C + R / 2 - U / 2 + j.manaLift / 2,
          U,
          r,
          !0,
          L
        )
      );
    })
  );
  const tt = st(e), z = r.get(tt ?? ""), Xt = Gt(tt), V = Me(e), Et = Cu(e), be = du(e), se = Et && u === "normal", de = se ? l1 : 1, Ge = j.setMargin + (se ? 2 : 0), [, gr, , Fe] = l(d.type), we = gr + Fe / 2 + j.typeLift / 2 + (u === "normal" || S ? 2 : 0), Mt = z ? Math.min(
    j.setMaxWidth,
    j.setHeight * z.width * V[2] / (z.height * V[3])
  ) : 0, D = z ? Math.min(
    Mt / (z.width * V[2]),
    j.setHeight / (z.height * V[3])
  ) : 0, J = [
    K - Ge - Mt - Mt * (de - 1) / 2 + (S ? 1.5 : 0),
    we - (z?.height ?? 0) * V[3] * D * de / 2 - (se ? 1 : 0),
    (z?.width ?? 0) * V[2] * D * de,
    (z?.height ?? 0) * V[3] * D * de
  ], [ht, ft] = S && Xt && !e.setSymbol ? Bm(e.setCode) : [1, 1], _t = S ? [
    J[0] + J[2] * (1 - ht),
    J[1] + J[3] * (1 - ft),
    J[2] * ht,
    J[3] * ft
  ] : J, Jt = u === "normal" && !o ? ia(e, tt, J, "component") : _t, fr = ke(Jt, e.symbolAdjustment?.set), ue = Math.max(
    1,
    Math.min(
      K - A - (z ? Mt * (1 + (de - 1) / 2) + Ge + j.typeGap : 0),
      z && fr !== J ? fr[0] - A - j.typeGap : 1 / 0
    )
  );
  t.save();
  const Re = jl(t, e, S ? "walker" : "components");
  t.font = `${j.typeFont * O}px "${X}", Georgia`;
  const Pu = u === "normal" && !o ? Br.typeWidthScale : S && t.measureText(Go(e.typeLine ?? "", X)).width * Ct.typeWidth <= ue * 0.97 ? Ct.typeWidth : 1;
  ct(
    t,
    e.typeLine ?? "",
    A + (S ? 1.5 : 0) + Re.dx,
    we + Re.dy,
    ue - Re.dx,
    j.typeFont * O * Re.size,
    !1,
    Pu * Re.width,
    X,
    0,
    e.textInk
  ), t.restore(), Z(
    t,
    e,
    "setSymbol",
    () => rr(t, Jt, e.symbolAdjustment?.set, () => {
      z && (Xt || e.setSymbol ? (t.save(), t.shadowColor = "transparent", t.drawImage(z, ...Jt), t.restore()) : Et ? ku(
        t,
        z,
        e.rarity,
        ...Jt,
        V,
        se ? 1.5 : 1
      ) : be ? uu(
        t,
        z,
        be,
        e.rarity,
        ...Jt,
        V,
        u === "normal"
      ) : ye(
        t,
        z,
        e.setCode,
        e.rarity,
        ...Jt,
        V
      ));
    })
  ), bu(e) ? Hp(t, e, r) : u !== "normal" ? o1(t, e, r) : pl(t, e, r) || $t(t, Dd(t, e, n, O), r);
  const Hn = n0(e);
  if (Hn && u !== "leveler")
    if (f(m.pt, d.stats, "stretch"), u.startsWith("planeswalker"))
      Xc(
        t,
        Hn.text,
        l(d.stats),
        Te(e)?.loyalty?.starting
      );
    else {
      const [_, et, Tt] = l(d.stats);
      t.fillStyle = "#17140f", t.font = `bold ${j.statsFont}px "CardRenderer MTG Beleren", Georgia`, t.textAlign = "center", t.textBaseline = "middle", rd(
        t,
        Hn.text,
        _ + Tt / 2,
        et + j.statsLine / 2 + (u === "normal" ? 2 : 0),
        Tt,
        e
      );
    }
  o || Jo(t, e);
}
function el(t, e, r, n = H.frame, o = !1, s = 0) {
  const [a, i, l, d] = A1(n), u = s, h = a + u, m = l - 2 * u, c = Math.min(e.height, d * e.width / l), g = c * l / e.width, f = t.getTransform().a, p = () => {
    if (!o) {
      t.drawImage(e, 0, 0, e.width, c, h, i, m, g);
      return;
    }
    const w = 424, y = 436;
    t.save(), t.beginPath(), t.rect(0, 0, x, w), t.rect(0, y, x, I - y), t.clip(), t.drawImage(e, 0, 0, e.width, c, h, i, m, g), t.restore(), t.save(), t.beginPath(), t.rect(0, w, x, y - w), t.clip(), t.drawImage(e, 0, 0, e.width, c, h, i - 1, m, g), t.restore();
  };
  t.save(), t.shadowColor = "black", t.shadowOffsetX = -394e-5 * x * f, t.shadowOffsetY = 394e-5 * x * f, t.shadowBlur = 236e-5 * x * f, p(), r || (t.shadowColor = "#ffffffa0", t.shadowOffsetX = 157e-5 * x * f, t.shadowOffsetY = -315e-5 * x * f, t.shadowBlur = 157e-5 * x * f, p()), t.restore();
}
function A1(t) {
  return [t[0] * x, t[1] * I, t[2] * x, t[3] * I];
}
const B1 = [
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
], qn = Object.freeze(
  B1.map((t) => Object.freeze(t))
), g2 = 1;
function Eu(t, e) {
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
    collectorSetCode: p,
    printingElements: w,
    illustrationPlacement: y,
    artPlacement: b,
    ...v
  } = t;
  return {
    ...v,
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
function Au(t, e) {
  const r = qn.find((o) => o.id === e);
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
    r.family === "eighth" && wt(Eu({ ...t, layout: "normal" }, r));
  } catch (o) {
    return { supported: !1, reason: o.message };
  }
  return { supported: !0 };
}
function Ve(t, e) {
  if (!e || typeof e != "object" || Array.isArray(e) || Object.keys(e).some((a) => !["preset", "overrides", "art"].includes(a)))
    throw Error("Invalid printing selection");
  const r = Au(
    e.overrides?.frameColors === void 0 ? t : { ...t, frameColors: e.overrides.frameColors },
    e.preset
  );
  if (!r.supported) throw Error(r.reason);
  const n = qn.find((a) => a.id === e.preset);
  let o = Eu(t, n);
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
        yl(i), o.calibration = structuredClone(i);
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
    Es(o);
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
    o.setSymbol = st({
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
  if (o.printingElements && Object.keys(o.printingElements).length && !An(o).supported)
    throw Error(An(o).reason);
  if (vl(o), o.collectorTotal !== void 0 && o.collectorTotal !== null && (!Number.isInteger(o.collectorTotal) || o.collectorTotal < 1 || o.collectorTotal > 99999))
    throw Error("Invalid collector total");
  if (o.collectorLanguage !== void 0 && !/^[A-Za-z]{2,5}$/.test(o.collectorLanguage))
    throw Error("Invalid collector language");
  if (o.frameTemplate === "future" && od(o), e.art !== void 0 && (o = Hc(o, e.art)), t.layout === "split" && t.faces && (o = {
    ...o,
    faces: t.faces.map(
      (a) => Ve({ ...a, layout: "normal" }, e)
    )
  }), typeof o.calibration == "object") {
    const a = o.calibration.profile === "8ed-eighth";
    if (a ? !On(o) : !Pr(o))
      throw Error(
        a ? "8ED calibration requires an ordinary Eighth frame." : "M21 calibration requires a modern frame."
      );
  }
  return Ht(o);
}
function An(t) {
  return !t.faces?.length && (!t.layout || ["normal", "token"].includes(t.layout)) && (!t.frameTemplate || t.frameTemplate === "future") && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") && !/^Level up\b/m.test(t.rulesText ?? "") ? { supported: !0, elements: ["artist", "legal", "collector", "manaCost", "setSymbol"] } : {
    supported: !1,
    elements: [],
    reason: "Element controls currently require an ordinary single face or Futureshifted template."
  };
}
function I1(t) {
  const e = {
    setCode: t.set?.toUpperCase(),
    symbolStyle: "original"
  };
  return t.frame === "future" ? (e.frameTemplate = "future", t.textless && (e.futureTreatment = "full-art")) : t.frame === "1993" || t.frame === "1997" ? e.frameStyle = "retro" : t.frame === "2003" ? (e.frameStyle = "modern", e.frameAssetFamily = "eighth") : t.frame === "2015" && (e.frameStyle = "modern"), t.frame_effects?.includes("colorshifted") && (e.frameStyle = "modern", e.frameAssetFamily = "eighth", e.frameTreatment = "colorshifted", delete e.frameTemplate, delete e.futureTreatment), ["black", "white", "silver"].includes(t.border_color ?? "") && (e.borderColor = t.border_color), t.security_stamp && ["none", "oval", "triangle", "acorn", "circle", "arena", "heart"].includes(t.security_stamp) ? e.securityStamp = t.security_stamp : e.securityStamp = "none", e;
}
function O1(t) {
  const e = t.rulesParagraphs ? t.rulesParagraphs.flatMap((o) => o.runs.map((s) => s.text)).join(`
`) : t.rulesText ?? "", r = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...[...e.matchAll(/\{([^}]+)\}/g)].map((o) => o[1])
  ]), n = na(t);
  return {
    frame: Gc(t) || !!n || oa(t).length > 0 || vt(t) && xe(t) && Tl(t).length > 0,
    manaSymbols: [
      .../* @__PURE__ */ new Set([
        ...[...r].filter((o) => !!Bd(t, /^\d+$/.test(o) ? "N" : o)),
        ...n?.glyph ? [n.color] : []
      ])
    ]
  };
}
const rl = (t) => "mask" in t || t.hueDegrees !== 0 || t.saturationScale !== 1 || t.brightnessScale !== 1 || t.rgbScale !== void 0 || t.valueGamma !== void 0;
function $1(t) {
  const e = Qs(t), { face: r, materials: n, assets: o } = e, s = ot(r), a = nt(r), i = a?.revision ?? s?.revision ?? os[0].revision, l = ["m21", "8ed"].includes(r.setCode?.toLowerCase() ?? "") ? i : 1, d = Object.entries(n), u = (C) => {
    if (!C.length) return { status: "source", assets: [] };
    const T = C.filter((R) => e.fallbackAssets.includes(R));
    return {
      status: T.length === C.length ? "fallback" : T.length ? "mixed" : "measured",
      ...T.length === C.length ? { profile: e.fallbackProfile, revision: i } : T.length ? {} : { profile: `printing:${r.setCode?.toLowerCase() ?? ""}`, revision: l },
      assets: C
    };
  }, h = u(
    d.filter(
      ([C, T]) => rl(T) && ("mask" in T || C === o.boxes || C.includes("/pt_boxes/"))
    ).map(([C]) => C)
  ), m = u(
    d.filter(
      ([C, T]) => rl(T) && (C !== o.boxes && !C.includes("/pt_boxes/") || "mask" in T)
    ).map(([C]) => C)
  ), c = O1(r), g = na(r), p = oa(r)[0]?.url ?? g?.frame ?? (vt(r) ? xr : void 0);
  if (p && c.frame)
    for (const C of [m, h])
      Object.assign(C, {
        status: a?.inheritedFrom ? "fallback" : "measured",
        profile: a?.inheritedFrom ? "8ed-eighth" : `printing:${r.setCode?.toLowerCase()}`,
        revision: 1,
        assets: [p]
      });
  const w = u(d.filter(([, C]) => C.blackPoint).map(([C]) => C)), b = [.../* @__PURE__ */ new Set([
    ...r.manaSymbols ?? [],
    ...[...(r.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((C) => C[1]),
    ...(r.rulesParagraphs ?? []).flatMap(
      (C) => C.runs.flatMap((T) => [...T.text.matchAll(/\{([^}]+)\}/g)].map((R) => R[1]))
    )
  ])].filter(
    (C) => Xo(r, /^\d+$/.test(C) ? "N" : C)
  ), v = b.length ? {
    status: "measured",
    profile: `printing:${r.setCode?.toLowerCase() ?? ""}`,
    revision: 1,
    assets: [],
    symbols: b
  } : g?.glyph ? { status: "measured", profile: "printing:8ed", revision: 1, assets: [g.glyph] } : { status: "source", assets: [] }, S = e.border ? {
    status: e.fallbackStock ? "fallback" : "measured",
    profile: e.fallbackStock ? e.fallbackProfile : `printing:${r.setCode?.toLowerCase() ?? ""}`,
    revision: e.fallbackStock ? i : l,
    color: e.border,
    assets: d.filter(([, C]) => C.outerStock).map(([C]) => C)
  } : { status: "source", assets: [] }, k = a?.inheritedFrom ? { status: "inherited", profile: "8ed-eighth", revision: a.revision } : s?.inheritedFrom ? {
    status: "inherited",
    profile: "m21-modern",
    revision: s.revision
  } : void 0;
  k && v.status === "measured" && b.length && (v.status = "fallback", v.profile = k.profile, v.revision = k.revision);
  const M = [];
  if ($n(r) && at(r)) {
    const C = rt(r);
    for (const T of [m, h, w])
      T.status !== "source" && (T.status = "fallback", T.profile = "printing:4ed", T.revision = C.revision);
    M.push(
      "Using Fourth Edition frame and layout defaults with Ice Age symbols and black surround; this printing has not been independently calibrated."
    );
  }
  return k && M.push(
    a?.inheritedFrom ? "Using shared 8ED layout and typography defaults; this printing has not been independently calibrated." : "Using shared M21 layout and typography defaults; this printing has not been independently calibrated."
  ), (e.fallbackStock || e.fallbackAssets.length) && M.push(
    a?.inheritedFrom ? "Using provisional 8ED defaults for compatible materials; black and white surrounds remain separate. This is not a measured calibration of this printing." : "Using provisional M21 defaults for compatible materials; this is not a measured calibration of this printing."
  ), (r.calibration === "auto" || typeof r.calibration == "object") && [m, h, w].some((C) => C.status === "source") && M.push("Some frame materials retain source colors or ink levels."), {
    mode: r.calibration ?? "legacy",
    components: { frame: m, textBox: h, border: S, interiorInk: w, manaSymbols: v },
    ...k ? { defaults: k } : {},
    notices: M
  };
}
function f2(t) {
  return os.map((e) => {
    const r = e.id === "8ed-eighth" ? On(t) : Pr(t);
    return {
      ...e,
      supported: r,
      ...r ? {} : {
        reason: e.id === "8ed-eighth" ? "Requires an ordinary Eighth frame." : "Requires a modern frame."
      }
    };
  });
}
const P1 = /^[a-z0-9][a-z0-9-]{0,47}$/;
function xt(t, e) {
  if (!t || typeof t != "object" || Array.isArray(t) || ![Object.prototype, null].includes(Object.getPrototypeOf(t)))
    throw Error("Invalid " + e);
}
function Rt(t, e, r) {
  if (Object.keys(t).some((n) => !e.includes(n)))
    throw Error("Unknown " + r + " field");
}
function an(t) {
  if (typeof t != "string" || !P1.test(t)) throw Error("Invalid printing style ID");
}
const G1 = [
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
function Ar(t) {
  if (xt(t, "printing layer"), Rt(t, ["overrides", "art"], "printing layer"), t.overrides !== void 0) {
    if (xt(t.overrides, "printing overrides"), Rt(t.overrides, G1, "printing override"), t.overrides.elements !== void 0) {
      xt(t.overrides.elements, "printing elements"), Rt(
        t.overrides.elements,
        ["artist", "legal", "collector", "manaCost", "setSymbol"],
        "printing element"
      );
      for (const r of Object.values(t.overrides.elements))
        xt(r, "printing element"), Rt(r, ["hidden", "offset"], "printing element");
    }
    if (t.overrides.symbolAdjustment !== void 0) {
      xt(t.overrides.symbolAdjustment, "symbol adjustment"), Rt(t.overrides.symbolAdjustment, ["mana", "set"], "symbol adjustment");
      for (const [r, n] of Object.entries(t.overrides.symbolAdjustment))
        if (xt(n, "symbol transform"), Rt(
          n,
          r === "set" ? ["dx", "dy", "scaleX", "scaleY"] : [
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
        ), n.glyphs !== void 0) {
          xt(n.glyphs, "mana glyphs"), Rt(n.glyphs, ["W", "U", "B", "R", "G"], "mana glyph");
          for (const o of Object.values(n.glyphs))
            xt(o, "mana glyph"), Rt(o, ["scale", "dx", "dy"], "mana glyph");
        }
    }
  }
  if (t.art !== void 0 && (xt(t.art, "art placement"), Rt(t.art, ["mode", "zoom", "focalPoint", "paperOpacity"], "art placement")), t.overrides?.futureTreatment !== void 0 && !["regular", "full-art", "clear"].includes(t.overrides.futureTreatment))
    throw Error("Invalid future treatment");
  const e = t.overrides?.calibration;
  Ve(
    {
      name: "Style validation",
      typeLine: "Creature",
      colors: ["U"],
      ...typeof e == "object" && e?.profile === "8ed-eighth" ? { setCode: "8ED", frameAssetFamily: "eighth" } : {}
    },
    {
      preset: "match",
      ...t.overrides ? {
        overrides: Object.fromEntries(
          Object.entries(t.overrides).filter(
            ([r]) => r !== "futureTreatment"
          )
        )
      } : {}
    }
  ), t.art && Ve(
    { name: "Art validation", typeLine: "Creature", colors: ["U"], frameTemplate: "future" },
    { preset: "match", art: { mode: "behind-text", ...t.art } }
  );
}
function Bu(t) {
  if (xt(t, "printing style"), Rt(
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
  if (an(t.id), typeof t.label != "string" || !t.label.trim() || t.label.length > 160)
    throw Error("Invalid printing style label");
  if (t.collectorSetCode !== void 0 && (typeof t.collectorSetCode != "string" || !/^[-A-Za-z0-9_]{1,16}$/.test(t.collectorSetCode)))
    throw Error("Invalid collector set code");
  if (t.defaults !== void 0 && Ar(t.defaults), !Array.isArray(t.frames) || !t.frames.length || t.frames.length > 64)
    throw Error("A printing style needs 1..64 frame options");
  const e = /* @__PURE__ */ new Set();
  for (const r of t.frames) {
    if (xt(r, "frame option"), Rt(r, ["id", "label", "selection"], "frame option"), an(r.id), e.has(r.id)) throw Error("Duplicate frame option");
    if (e.add(r.id), typeof r.label != "string" || !r.label.trim() || r.label.length > 160)
      throw Error("Invalid frame label");
    if (xt(r.selection, "frame selection"), Rt(r.selection, ["preset", "overrides", "art"], "frame selection"), !qn.some((s) => s.id === r.selection.preset))
      throw Error("Unknown frame preset");
    const { preset: n, ...o } = r.selection;
    Ar(o);
  }
  if (!e.has(t.defaultFrame)) throw Error("Unknown default frame");
  if (t.symbols !== void 0) {
    xt(t.symbols, "symbol pack"), Rt(
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
      if (xt(n, "frame rule"), Rt(n, ["id", "when", "frame", "defaults"], "frame rule"), an(n.id), r.has(n.id)) throw Error("Duplicate frame rule");
      if (r.add(n.id), !e.has(n.frame)) throw Error("Unknown rule frame");
      if (xt(n.when, "frame condition"), Rt(
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
      n.defaults !== void 0 && Ar(n.defaults);
    }
  }
  return structuredClone(t);
}
function F1(t) {
  xt(t, "printing style choice"), Rt(t, ["frame", "overrides", "art"], "printing style choice");
  const { frame: e, ...r } = t;
  e !== void 0 && an(e), Ar(r);
}
const p2 = 1;
function Bn(t) {
  return Array.isArray(t) ? t.map(Bn) : t && typeof t == "object" ? Object.fromEntries(
    Object.entries(t).filter(([, e]) => e !== void 0).map(([e, r]) => [e, Bn(r)])
  ) : t;
}
function W1(t, ...e) {
  const r = structuredClone(t);
  for (const n of e) {
    if (Ar(n), n.art && (r.art = { mode: "window", ...r.art, ...Bn(structuredClone(n.art)) }), !n.overrides) continue;
    const o = r.overrides || {}, s = Bn(structuredClone(n.overrides)), a = { ...o, ...s };
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
function _1(t, e) {
  const r = t.faces?.length ? t.faces : [t], n = Rr(
    r.flatMap(
      (a) => e.colorSource === "card" ? [...a.colors || []] : F({ ...a, frameColors: void 0 })
    )
  );
  if (e.colors && Rr(e.colors).join("") !== n.join("") || e.colorCount && (n.length < e.colorCount[0] || n.length > e.colorCount[1]))
    return !1;
  const o = G(t);
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
function U1(t, e) {
  const r = {};
  if (t.collectorSetCode !== void 0 && (r.collectorSetCode = t.collectorSetCode), t.symbols) {
    const n = e.rarity || "common", o = Object.hasOwn(t.symbols, n) ? t.symbols[n] : t.symbols.default, s = Object.hasOwn(t.symbols, n) && t.symbols[n] === null;
    (s || o !== void 0) && (r.setSymbol = s ? null : o);
  }
  return { overrides: r };
}
function y2(t, e, r = {}, n = {}) {
  const o = Ou.includes(e) ? e : Bu(e);
  return o.frames.map((s) => {
    try {
      const a = N1(t, o, r, { ...n, frame: s.id });
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
function D1(t, e) {
  return e === void 0 ? t : {
    ...t,
    frameColors: e,
    ...t.faces ? { faces: t.faces.map((r) => ({ ...r, frameColors: e })) } : {}
  };
}
function N1(t, e, r = {}, n = {}) {
  const o = Ou.includes(e) ? e : Bu(e);
  for (const S of [r, n])
    if (F1(S), S.frame !== void 0 && !o.frames.some((k) => k.id === S.frame))
      throw Error("Unknown chosen frame");
  const { frame: s, ...a } = r, { frame: i, ...l } = n, d = i ?? s, u = o.rules?.find((S) => _1(t, S.when));
  let h = i !== void 0 ? "face" : s !== void 0 ? "card" : u ? "rule" : "default", m = o.frames.find((S) => S.id === (d ?? u?.frame ?? o.defaultFrame));
  const c = [], g = (S, k = S.selection.preset) => W1(
    { ...S.selection, preset: k },
    o.defaults || {},
    U1(o, t),
    u?.defaults || {},
    a,
    l
  );
  let f = g(m);
  const p = (S) => {
    const k = g(S), M = Au(
      D1(t, k.overrides?.frameColors),
      k.preset
    );
    if (!M.supported) return M;
    try {
      return Ve(t, {
        preset: k.preset,
        overrides: Object.fromEntries(
          Object.entries(k.overrides || {}).filter(
            ([C]) => !["elements", "symbolAdjustment"].includes(C)
          )
        )
      }), M;
    } catch (C) {
      return { supported: !1, reason: C.message };
    }
  }, w = p(m);
  if (!w.supported) {
    if (d !== void 0) throw Error(w.reason);
    h = "fallback";
    const S = o.frames.find((k) => k.id === o.defaultFrame);
    S.id !== m.id && p(S).supported ? (m = S, f = g(m), c.push("Automatic frame is unsupported; using the default frame. " + w.reason)) : (f = g(m, "match"), c.push("Keeping the native layout. " + w.reason));
  }
  const y = Ve(t, {
    preset: f.preset,
    overrides: Object.fromEntries(
      Object.entries(f.overrides || {}).filter(
        ([S]) => !["elements", "symbolAdjustment", "futureTreatment"].includes(S)
      )
    )
  });
  if (f.overrides?.futureTreatment !== void 0)
    if (y.frameTemplate !== "future") {
      if (r.overrides?.futureTreatment || n.overrides?.futureTreatment)
        throw Error("Future treatment requires a Futureshifted frame.");
      delete f.overrides.futureTreatment, c.push("Inherited Future treatment is unavailable for this layout.");
    } else y.futureTreatment = f.overrides.futureTreatment;
  if (f.overrides?.elements && !An(y).supported) {
    if (r.overrides?.elements || n.overrides?.elements)
      throw Error(An(y).reason);
    delete f.overrides.elements, c.push("Inherited element positioning is unavailable for this layout.");
  }
  if (f.overrides?.symbolAdjustment)
    try {
      if (y.frameTemplate) throw Error("Fine symbol adjustments require an ordinary frame.");
      Es({
        ...y,
        symbolAdjustment: f.overrides.symbolAdjustment
      });
    } catch (S) {
      if (r.overrides?.symbolAdjustment || n.overrides?.symbolAdjustment) throw S;
      delete f.overrides.symbolAdjustment, c.push("Inherited symbol adjustments are unavailable for this layout.");
    }
  if (f.art && !Wd(y).modes.includes(f.art.mode)) {
    if (r.art || n.art)
      throw Error("This frame does not support the selected art placement.");
    delete f.art, c.push("Inherited artwork placement is unavailable for this frame.");
  }
  f = structuredClone(f);
  const b = Ve(t, f), v = $1(b);
  return {
    face: b,
    calibration: v,
    selection: f,
    frame: m.id,
    frameSource: h,
    ...u ? { rule: u.id } : {},
    notices: [...c, ...v.notices]
  };
}
function Iu(t) {
  if (t && typeof t == "object") {
    for (const e of Object.values(t)) Iu(e);
    Object.freeze(t);
  }
  return t;
}
const Ou = Object.freeze(
  qn.filter((t) => !["plc-colorshifted", "fut"].includes(t.id)).map((t) => {
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
    }), Iu({
      version: 1,
      id: t.id === "fut-regular" ? "fut" : t.id,
      label: t.id === "fut-regular" ? "Future Sight" : t.label,
      defaultFrame: "regular",
      frames: e,
      ...r.length ? { rules: r } : {}
    });
  })
);
function ln(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    throw Error("Expected a card object.");
  return t;
}
function N(t, e = "", r = 32768) {
  if (t == null) return e;
  if (typeof t != "string" || t.length > r) throw Error("Invalid card text.");
  return t;
}
function nl(t) {
  if (t == null) return [];
  if (!Array.isArray(t) || t.length > 5 || !t.every((e) => typeof e == "string" && /^[WUBRG]$/.test(e)))
    throw Error("Invalid card colors.");
  return [...new Set(t)];
}
function j1(t) {
  const e = N(t, "", 200);
  if (!/^(?:\{[0-9A-Z/∞]+\}\s*)*$/.test(e)) throw Error("Invalid mana cost.");
  return [...e.matchAll(/\{([^}]+)\}/g)].map((r) => r[1]);
}
function z1(t) {
  if (t == null) return null;
  const e = N(t, "", 4096), r = new URL(e);
  if (r.protocol !== "https:" || r.username || r.password)
    throw Error("Provider artwork requires an HTTPS URL.");
  return r.href;
}
function ol(t, e = "") {
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
function Y1(t, e, r, n) {
  const o = n.wording ?? "oracle";
  if (!["oracle", "original"].includes(o)) throw Error("Invalid wording choice.");
  if (n.symbolStyle !== void 0 && !["original", "modern"].includes(n.symbolStyle))
    throw Error("Invalid symbol style.");
  const s = {
    ...r ?? e,
    manaSymbols: Gl(t, e.manaSymbols ?? [])
  };
  return Wl(t, { oracle: e, original: s }, o, {
    symbolStyle: n.symbolStyle ?? "original",
    includeFlavorText: n.includeFlavorText
  });
}
function $u(t, e, r, n = null) {
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
function q1(t, e = {}) {
  const r = ln(t), n = N(r.name, "", 256);
  if (!n.trim()) throw Error("The Scryfall card needs a name.");
  const o = r.card_faces === void 0 ? [r] : r.card_faces;
  if (!Array.isArray(o) || !o.length || o.length > 2)
    throw Error("Supply one Scryfall card with at most two faces.");
  const s = I1({
    set: N(r.set),
    frame: N(r.frame),
    frame_effects: r.frame_effects === void 0 ? void 0 : H1(r.frame_effects),
    border_color: N(r.border_color),
    security_stamp: N(r.security_stamp),
    textless: r.textless === !0
  }), a = (h) => h.image_uris ? z1(ln(h.image_uris).art_crop) : null, l = ["common", "uncommon", "rare", "mythic", "special", "bonus"].find((h) => h === (r.rarity ?? "common"));
  if (!l) throw Error("Invalid card rarity.");
  const d = o.map((h, m) => {
    const c = ln(h), g = N(c.type_line, N(r.type_line), 512);
    if (!g.trim()) throw Error("The Scryfall face needs a type line.");
    const f = N(c.oracle_text), p = j1(c.mana_cost), w = nl(
      c.colors ?? c.color_indicator ?? (o.length === 1 ? r.colors : [..."WUBRG"].filter(
        (k) => p.some((M) => M.split("/").includes(k)) && (r.colors == null || nl(r.colors).includes(k))
      ))
    ), y = Gh(
      g,
      w,
      s.setCode,
      N(r.frame),
      c.produced_mana ?? r.produced_mana
    ), b = {
      name: N(c.name, n, 256),
      typeLine: g,
      rulesText: f,
      manaSymbols: p,
      rulesParagraphs: ol(f, N(c.flavor_text))
    }, S = typeof c.printed_text == "string" || typeof c.printed_type_line == "string" || typeof c.printed_name == "string" ? {
      ...b,
      name: N(c.printed_name, b.name, 256),
      typeLine: N(c.printed_type_line, g, 512),
      rulesText: N(c.printed_text, f),
      rulesParagraphs: ol(
        N(c.printed_text, f),
        N(c.flavor_text)
      )
    } : void 0;
    return Y1(
      {
        ...Wh(s, g, f),
        ...m > 0 && ["transform", "modal_dfc", "battle", "double_faced_token"].includes(String(r.layout)) ? { securityStamp: "none" } : {},
        name: b.name,
        colors: w,
        ...y ? { frameColors: y } : {},
        rarity: l,
        artist: N(c.artist, N(r.artist), 256),
        collectorNumber: N(r.collector_number, "", 64),
        ...typeof r.lang == "string" && /^[a-z]{2,5}$/i.test(r.lang) ? { collectorLanguage: r.lang } : {},
        ...c.watermark == null && r.watermark == null ? {} : { watermark: N(c.watermark ?? r.watermark, "", 64) },
        power: c.power == null ? void 0 : N(c.power),
        toughness: c.toughness == null ? void 0 : N(c.toughness),
        loyalty: c.loyalty == null ? void 0 : N(c.loyalty),
        defense: c.defense == null ? void 0 : N(c.defense),
        illustration: a(c),
        colorCalibration: "set-hsb-v1"
      },
      b,
      S,
      e
    );
  });
  let u = N(r.layout, "normal", 64);
  if (o.length === 1 && ["split", "aftermath", "flip", "adventure", "prepare", "room"].includes(u))
    throw Error("Supply both Scryfall faces for this layout.");
  return u === "split" && /\bAftermath\b/.test(d[1]?.rulesText ?? "") && (u = "aftermath"), $u(d, u, e, o.length > 1 ? a(r) : null);
}
function H1(t) {
  if (!Array.isArray(t) || t.length > 32) throw Error("Invalid frame effects.");
  return t.map((e) => N(e, "", 64));
}
function X1(t, e) {
  const r = t.map((a) => ({ type: a.originalType, text: a.originalText }));
  if (t.length !== 2 || !["split", "aftermath", "adventure", "prepare", "flip"].includes(e))
    return r;
  const n = (a) => N(a).replace(/\r\n?/g, `
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
    if (l === 1 && u.every((p) => typeof p == "string")) {
      const p = u.join(`
`) + `
`;
      d.startsWith(p) && (d = d.slice(p.length));
    }
    const h = N(a.originalType);
    l === 1 && h && d.startsWith(h + `
`) && (d = d.slice(h.length + 1));
    const m = N(a.type), c = t[0].originalType === t[1].originalType, g = /^(Instant|Sorcery)$/.test(h) && /^(Instant|Sorcery)$/.test(m), f = e === "adventure" && /^(Instant|Sorcery)\s*[—–-]\s*Adventure$/.test(m);
    return { text: d, type: c && (g || f) ? m : a.originalType };
  });
}
function b2(t, e = {}) {
  const r = (Array.isArray(t) ? t : [t]).map(ln), n = [...r];
  if (!r.length || r.length > 2)
    throw Error("Supply the associated records of one MTGJSON card.");
  if (e.illustrations !== void 0 && (!Array.isArray(e.illustrations) || e.illustrations.length !== r.length))
    throw Error("Supply one illustration override per input record.");
  if (r.length > 1) {
    const [d, u] = r;
    if (d.uuid !== void 0 && d.uuid === u.uuid || d.side !== void 0 && d.side === u.side || d.layout !== u.layout)
      throw Error("Supply two distinct associated MTGJSON faces with the same layout.");
    const h = (f, p) => typeof p.uuid == "string" && Array.isArray(f.otherFaceIds) && f.otherFaceIds.includes(p.uuid), m = h(d, u) || h(u, d), c = [d.uuid, u.uuid, d.otherFaceIds, u.otherFaceIds].some(
      (f) => f !== void 0
    ), g = d.name === u.name && typeof d.faceName == "string" && typeof u.faceName == "string" && d.faceName !== u.faceName;
    if ((c ? !m : !g) || d.setCode !== void 0 && u.setCode !== void 0 && d.setCode !== u.setCode || d.number !== void 0 && u.number !== void 0 && N(d.number).replace(/[ab]$/, "") !== N(u.number).replace(/[ab]$/, "") || [
      [d, u],
      [u, d]
    ].some(([f, p]) => Array.isArray(f.otherFaceIds) && !f.otherFaceIds.includes(p.uuid)))
      throw Error("The MTGJSON records are not associated faces of one card.");
    r.every((f) => typeof f.side == "string") && r.sort((f, p) => N(f.side).localeCompare(N(p.side)));
  }
  const o = r[0], s = N(o.layout, "normal", 64);
  if (r.length === 1 && ["split", "aftermath", "flip", "adventure", "prepare", "room"].includes(s))
    throw Error("Supply both MTGJSON face records for this layout.");
  const a = e.wording === "original" ? X1(r, s) : void 0, i = r.map((d, u) => ({
    name: d.faceName ?? d.name,
    type_line: d.type,
    oracle_text: d.text ?? "",
    mana_cost: d.manaCost ?? "",
    colors: d.colors,
    produced_mana: Fh(N(d.text)),
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
    (d, u) => q1(
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
      {
        wording: e.wording,
        symbolStyle: e.symbolStyle,
        includeFlavorText: e.includeFlavorText
      }
    )
  );
  return $u(l, s, {
    ...e,
    ...e.illustrations ? { illustrations: r.map((d) => e.illustrations[n.indexOf(d)]) } : {}
  });
}
function w2(t, e) {
  const r = { ...t, setCalibrationCandidate: e };
  if (rt(r), !(es(t.setCode) && t.frameStyle !== "modern" && !t.frameTemplate && !t.frameAssetFamily && (!t.borderColor || t.borderColor === "black") && (!t.layout || t.layout === "normal") && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "")) && !at(r))
    throw Error("This printing has no set calibration adapter");
  return r;
}
export {
  qp as $,
  wi as A,
  Lr as B,
  yu as C,
  w1 as D,
  s0 as E,
  o0 as F,
  xu as G,
  b1 as H,
  It as I,
  m2 as J,
  R1 as K,
  S0 as L,
  Za as M,
  l2 as N,
  d2 as O,
  ad as P,
  O1 as Q,
  Qe as R,
  wd as S,
  Or as T,
  Nt as U,
  c2 as V,
  W1 as W,
  qc as X,
  l0 as Y,
  Yp as Z,
  Yn as _,
  I as a,
  G as a$,
  u2 as a0,
  E1 as a1,
  lu as a2,
  R0 as a3,
  Q as a4,
  a0 as a5,
  Kt as a6,
  Yt as a7,
  st as a8,
  n0 as a9,
  qt as aA,
  mt as aB,
  s1 as aC,
  Up as aD,
  Xl as aE,
  $t as aF,
  ye as aG,
  o1 as aH,
  li as aI,
  s2 as aJ,
  Gd as aK,
  A1 as aL,
  Kp as aM,
  Qp as aN,
  n2 as aO,
  e2 as aP,
  f2 as aQ,
  os as aR,
  An as aS,
  g2 as aT,
  Au as aU,
  qn as aV,
  p2 as aW,
  y2 as aX,
  Ou as aY,
  re as aZ,
  Hc as a_,
  y1 as aa,
  wt as ab,
  K0 as ac,
  b2 as ad,
  q1 as ae,
  bu as af,
  oe as ag,
  Rn as ah,
  xn as ai,
  h2 as aj,
  lt as ak,
  P as al,
  Ji as am,
  Tu as an,
  Np as ao,
  tr as ap,
  Ie as aq,
  Rr as ar,
  Dd as as,
  x1 as at,
  rr as au,
  Lu as av,
  Qi as aw,
  k1 as ax,
  Hp as ay,
  ct as az,
  Q1 as b,
  Ah as b$,
  F as b0,
  $1 as b1,
  Ve as b2,
  N1 as b3,
  I1 as b4,
  xh as b5,
  Ss as b6,
  St as b7,
  fn as b8,
  vs as b9,
  Dr as bA,
  Zs as bB,
  jt as bC,
  Nc as bD,
  Fm as bE,
  Fs as bF,
  Wm as bG,
  Pn as bH,
  Qa as bI,
  ta as bJ,
  yl as bK,
  Bu as bL,
  Es as bM,
  on as bN,
  Wl as bO,
  Ga as bP,
  w2 as bQ,
  ee as bR,
  Dn as bS,
  Ur as bT,
  Pe as bU,
  Vt as bV,
  i2 as bW,
  or as bX,
  v1 as bY,
  f1 as bZ,
  p1 as b_,
  Lt as ba,
  Dp as bb,
  me as bc,
  Mh as bd,
  Wr as be,
  Ba as bf,
  At as bg,
  Wn as bh,
  r2 as bi,
  Pl as bj,
  kh as bk,
  Am as bl,
  wu as bm,
  i0 as bn,
  Fo as bo,
  t2 as bp,
  ae as bq,
  As as br,
  tf as bs,
  vu as bt,
  gl as bu,
  Me as bv,
  M0 as bw,
  sm as bx,
  e1 as by,
  tc as bz,
  H as c,
  hl as c0,
  j as d,
  x as e,
  ci as f,
  Je as g,
  Bt as h,
  T1 as i,
  Km as j,
  vh as k,
  er as l,
  wh as m,
  Th as n,
  Ir as o,
  Zt as p,
  Sd as q,
  ve as r,
  Gs as s,
  o2 as t,
  ke as u,
  Wd as v,
  a2 as w,
  Sn as x,
  Ps as y,
  Gm as z
};
