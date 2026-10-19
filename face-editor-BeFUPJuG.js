import { a as Ma, r as $l, v as Bl, b as Il } from "./editor-uyRgeYtI.js";
import { c as to, f as eo } from "./asset-fetch-my9kgRsJ.js";
import { d as Gl } from "./canvas-images-DWl3zt32.js";
import { t as at } from "./registry-Cg8tIhk4.js";
function yt(t) {
  const e = t.setCalibrationCandidate;
  if (!e) return Ma(t.setCode);
  if (e.set !== t.setCode?.toLowerCase())
    throw Error("Calibration candidate belongs to another set");
  return $l(e);
}
function dt(t, e, r, o, n, s, a = "stats", i = () => n == null ? t.fillText(e, r, o) : t.fillText(e, r, o, n), l = (d) => t.measureText(d).width) {
  const d = a === "type" ? s?.typeLine : s?.stats;
  if (!d?.length) {
    i();
    return;
  }
  const u = l(e), m = u > 0 && n != null ? Math.min(1, n / u) : 1, h = u * m, c = t.textAlign === "right" || t.textAlign === "end" && t.direction !== "rtl" || t.textAlign === "start" && t.direction === "rtl", g = r - (t.textAlign === "center" ? h / 2 : c ? h : 0), f = a === "type" ? 1 : 0, b = (p, w, S) => {
    w <= p || S && s?.omitInk || (t.save(), t.beginPath(), t.rect(p, -1e4, w - p, 2e4), t.clip(), S && (t.fillStyle = S, t.shadowColor = "transparent"), i(), t.restore());
  };
  let y = -1e4;
  for (const p of d) {
    const w = Math.max(
      y,
      p.start === 0 ? -1e4 : g + l(e.slice(0, p.start)) * m - f
    ), S = p.end == null || p.end >= e.length ? 1e4 : g + l(e.slice(0, p.end)) * m + f;
    b(y, w), b(w, S, p.color), y = S;
  }
  b(y, 1e4);
}
const xr = /* @__PURE__ */ new WeakSet();
function Qt(t) {
  return !xr.has(t);
}
function Pl(t, e, r) {
  const o = xr.has(t);
  e || xr.add(t);
  try {
    r();
  } finally {
    o || xr.delete(t);
  }
}
const sf = 1, Ra = Object.freeze([
  Object.freeze({
    id: "m21-modern",
    revision: 1,
    label: "Modern · M21 defaults",
    setCode: "M21",
    note: "Provisional transfer: shared source colors and outer border; other materials retain source colors."
  })
]);
function xa(t) {
  if (!(t === "auto" || t === "printing" || t === "source") && !(t && typeof t == "object" && !Array.isArray(t) && Object.keys(t).length === 1 && Object.hasOwn(t, "profile") && Ra.some((e) => e.id === t.profile)))
    throw Error("Invalid printing calibration choice");
}
function se(t) {
  if (["split", "aftermath", "adventure", "prepare", "room", "flip"].includes(t.layout ?? "") && t.faces?.some(
    (r) => r.calibration !== void 0 && JSON.stringify(r.calibration) !== JSON.stringify(t.calibration)
  ))
    throw Error("Composite panels share one calibration policy; select it on the physical face.");
  if (t.calibration === void 0) return t;
  xa(t.calibration);
  const e = t.calibration === "source" ? void 0 : "set-hsb-v1";
  return {
    ...t,
    colorCalibration: e,
    ...t.faces ? {
      faces: t.faces.map(
        (r) => se({
          ...r,
          calibration: r.calibration ?? t.calibration
        })
      )
    } : {}
  };
}
function Fl(t) {
  return t.power != null && t.toughness != null ? {
    text: `${t.power}/${t.toughness}`,
    label: `Power ${t.power}, toughness ${t.toughness}`
  } : t.loyalty != null && t.loyalty !== "" ? { text: String(t.loyalty), label: `Starting loyalty ${t.loyalty}` } : t.defense != null && t.defense !== "" ? { text: String(t.defense), label: `Defense ${t.defense}` } : null;
}
const k = 488, E = 680, _l = 0.058;
function Bt(t, e) {
  if (e === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (e ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    t?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const Wl = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", K = {
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
  stamp: [0.34, 0.76 - 0.16 * k / E, 0.32, 0.32 * k / E]
}, X = {
  titleFont: 24,
  normalTitleFont: 26,
  titleTracking: 54e-5 * k,
  titleGap: 0.02362 * k,
  plateLeft: 0.02362 * k,
  plateRight: 0.01575 * k,
  manaSize: 0.03556 * 1.35 * k,
  manaGap: 378e-5 * k,
  manaLift: -63e-4 * k,
  typeFont: 0.044 * k,
  typeGap: 945e-5 * k,
  typeLift: -315e-5 * k,
  setHeight: 0.06142 * k,
  setMaxWidth: 0.11024 * k,
  setMargin: 472e-5 * k,
  rulesPaddingX: 0.01575 * k,
  rulesPaddingY: 0.02362 * k,
  normalRulesFont: 0.04444 * k,
  longRulesFont: 0.0381 * k,
  denseRulesFont: 0.0328 * k,
  paragraphGap: 787e-5 * k,
  statsFont: 0.05333 * k,
  statsLine: 0.08661 * k,
  footerFont: 0.02167 * k,
  footerLine: 0.02126 * k,
  footerTracking: 362e-5 * k,
  artistMarginLeft: 7e-3 * k,
  artistMarginRight: 35e-4 * k,
  legendaryBackgroundLift: -0.02047 * k
}, Zo = (t) => t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
function Ul(t = K) {
  return {
    ...Object.fromEntries(
      Object.entries(t).flatMap(
        ([e, r]) => r.map((o, n) => [
          `--face-${Zo(e)}-${["x", "y", "w", "h"][n]}`,
          `${o * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(X).map(([e, r]) => [
        `--face-${Zo(e)}`,
        `${r / k * 100}cqw`
      ])
    )
  };
}
const af = Ul();
function jl(t) {
  return t.length > 340 ? "dense" : t.length > 210 ? "long" : "normal";
}
function lf(t) {
  return {
    dense: X.denseRulesFont,
    long: X.longRulesFont,
    normal: X.normalRulesFont
  }[jl(t)];
}
function Kr(t) {
  return t.split(/(\{[^}\n]+\})/g).filter(Boolean).map((e) => ({
    value: e,
    symbol: /^\{[^}\n]+\}$/.test(e) ? e.slice(1, -1) : null
  }));
}
function Nl(t) {
  const e = t.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[e] ?? e.slice(0, 3);
}
const Dl = at("printingStocks"), zl = (t) => {
  const e = parseInt(t.slice(1), 16);
  return [(e >> 16) / 255, (e >> 8 & 255) / 255, (e & 255) / 255];
}, Ea = at("printingBlackPoints");
function ar(t) {
  return (t.colorCalibration === "set-hsb-v1" || t.colorCalibration === "early-hsb-v1") && (!t.borderColor || t.borderColor === "black") && (Ea[t.setCode?.toLowerCase() ?? ""] ?? []).some(
    (e) => e.set === t.setCode?.toLowerCase() && e.stock !== null
  );
}
function Aa(t, e, r) {
  if (!["set-hsb-v1", "early-hsb-v1"].includes(t.colorCalibration ?? "")) return { materials: e };
  const o = Ea[t.setCode?.toLowerCase() ?? ""] ?? [];
  if (!o.length) return { materials: e };
  let n;
  const s = { ...e };
  for (const [a, i] of Object.entries(e)) {
    const l = JSON.stringify(i);
    for (const d of o) {
      const u = d.materials.find((g) => g.url === a && g.adjustment === l);
      if (!u) continue;
      if (d.stock && ar(t) && (n = d.stock), u.bakedStock && n) {
        const g = parseInt(n.slice(1), 16);
        s[a] = {
          ...i,
          outerStockMaskSource: u.stockMask,
          outerStock: [(g >> 16) / 255, (g >> 8 & 255) / 255, (g & 255) / 255]
        };
      }
      if (!u.lift || i.blackPoint) continue;
      const [m, h, c] = u.lift;
      if (u.lift.length !== 3 || m === void 0 || h === void 0 || c === void 0)
        throw new Error("Invalid printing black-point binding");
      s[a] = {
        ...s[a],
        blackPoint: { lift: [m / 255, h / 255, c / 255], transition: 96 / 255 }
      };
    }
  }
  if (r && ar(t)) {
    const a = (Dl[t.setCode?.toLowerCase() ?? ""] ?? []).find(
      (i) => i.set === t.setCode?.toLowerCase() && r.geometry === i.geometry && r.url.startsWith(i.prefix) && (i.family === "retro" ? /^[wubrgacml]{1,2}\.png$/.test(r.url.slice(i.prefix.length)) : /^(W|U|B|R|G|WU|WB|WR|WG|UB|UR|UG|BR|BG|RG|Artifact|Gold|Colourless)\.webp$/.test(
        r.url.slice(i.prefix.length)
      ))
    );
    a && (n = a.stock, r.mask && (s[r.url] = {
      ...s[r.url] ?? { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
      outerStock: zl(n),
      outerStockMaskSource: r.mask
    }));
  }
  return { materials: s, ...n ? { stock: n } : {} };
}
const Yl = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", ql = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", Hl = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Xl = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", Jl = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-new-split-fuse.mse-style", Kl = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", Vl = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", J = {
  RENDERER_COMPONENT_ROOT: Yl,
  KEYRUNE_ROOT: ql,
  CONJURER_ROOT: Hl,
  RETRO_ROOT: Xl,
  MSE_SPLIT_BRIDGE_ROOT: Jl,
  RETRO_SYMBOL_FONT: Kl,
  MSE_TEMPLATE_ROOT: Vl
}, Zl = { "10e": "cmrsu", "2ed": "cmrsu", "2x2": "cmrsu", "2xm": "cmrsu", "30a": "cmrsu", "3ed": "cmrsu", "40k": "cmrsu", "4ed": "cmrsu", "5dn": "cmrsu", "5ed": "cmrsu", "6ed": "cmrsu", "7ed": "cmrsu", "8ed": "cmrsu", "9ed": "cmrsu", a25: "cmrsu", acr: "cmrsu", aer: "cmrsu", afc: "cmrsu", afr: "cmrsu", akh: "cmrsu", akr: "cmrsu", ala: "cmrsu", all: "cmrsu", ana: "cmrsu", apc: "cmrsu", arb: "cmrsu", arc: "cmrsu", archie: "cmrsu", arena: "cmrsu", arn: "cmrsu", ath: "cmrsu", atq: "cmrsu", avr: "cmrsu", azorius: "cmru", bbd: "cmrsu", bfz: "cmrsu", big: "cmrsu", blb: "cmrsu", blc: "cmrsu", bng: "cmrsu", bok: "cmrsu", boros: "cmru", bot: "cmrsu", brb: "cmrsu", brc: "cmrsu", bro: "cmrsu", brr: "cmrsu", btd: "cmrsu", c13: "cmrsu", c14: "cmrsu", c15: "cmrsu", c16: "cmrsu", c17: "cmrsu", c18: "cmrsu", c19: "cmrsu", c20: "cmrsu", c21: "cmrsu", cc1: "cmrsu", cc2: "cmrsu", ced: "cmrsu", cei: "cmrsu", chk: "cmrsu", chr: "cmrsu", clb: "cmrsu", clu: "cmrsu", cm1: "cmrsu", cm2: "cmrsu", cma: "cmrsu", cmd: "cmrsu", cmm: "cmrsu", cmr: "cmrsu", cn2: "cmrsu", cns: "cmrsu", con: "cmrsu", conf: "cmrsu", csp: "cmrsu", dci: "cmrsu", dd1: "cmrsu", dd2: "cmrsu", ddc: "cmrsu", ddd: "cmrsu", dde: "cmrsu", ddf: "cmrsu", ddg: "cmrsu", ddh: "cmrsu", ddi: "cmrsu", ddj: "cmrsu", ddk: "cmrsu", ddl: "cmrsu", ddm: "cmrsu", ddn: "cmrsu", ddo: "cmrsu", ddp: "cmrsu", ddq: "cmrsu", ddr: "cmrsu", dds: "cmrsu", ddt: "cmrsu", ddu: "cmrsu", default: "cmrsu", dft: "cmrsu", dgm: "cmrsu", dimir: "cmru", dis: "cmrsu", dka: "cmrsu", dkm: "cmrsu", dmc: "cmrsu", dmr: "cmrsu", dmu: "cmrsu", dom: "cmrsu", dpa: "cmrsu", drb: "cmrsu", drc: "cmrsu", drk: "cmrsu", dsc: "cmrsu", dsk: "cmrsu", dst: "cmrsu", dtk: "cmrsu", e01: "cmrsu", e02: "cmrsu", ecc: "cmrsu", ecl: "cmrsu", eld: "cmrsu", ema: "cmrsu", emn: "cmrsu", eoc: "cmrsu", eoe: "cmrsu", eos: "cmru", eve: "cmrsu", exo: "cmrsu", exp: "cmrsu", fca: "cmrsu", fdc: "cmrsu", fdn: "cmrsu", fem: "cmrsu", fic: "cmrsu", fin: "cmrsu", fnm: "r", fra: "cmrsu", frc: "cmrsu", frf: "cmrsu", fut: "cmrsu", gn2: "cmrsu", gn3: "cmrsu", gnt: "cmrsu", golgari: "cmru", gpt: "cmrsu", grn: "cmrsu", gruul: "cmru", gs1: "cmrsu", gtc: "cmrsu", h09: "cmrsu", h17: "cmrsu", ha1: "cmrsu", hbg: "cmrsu", hml: "cmrsu", hob: "cmrsu", hoc: "cmrsu", hop: "cmrsu", hou: "cmrsu", ice: "cmrsu", idw: "cmrsu", iko: "cmrsu", ima: "cmrsu", inr: "cmrsu", inv: "cmrsu", isd: "cmrsu", izzet: "cmru", j20: "cmrsu", j21: "cmrsu", j22: "cmrsu", j25: "cmru", jmp: "cmrsu", jou: "cmrsu", jud: "cmrsu", khc: "cmrsu", khm: "cmrsu", kld: "cmrsu", klr: "cmrsu", ktk: "cmrsu", lcc: "cmrsu", lci: "cmrsu", lea: "cmrsu", leb: "cmrsu", leg: "cmrsu", lgn: "cmrsu", lrw: "cmrsu", ltc: "cmrsu", ltr: "cmrsu", m10: "cmrsu", m11: "cmrsu", m12: "cmrsu", m13: "cmrsu", m14: "cmrsu", m15: "cmrsu", m19: "cmrsu", m20: "cmrsu", m21: "cmrsu", m3c: "cmrsu", mat: "cmrsu", mb2: "cmrsu", mbc: "cmrsu", mbs: "cmrsu", mc3: "cmrsu", md1: "cmrsu", me1: "cmrsu", me2: "cmrsu", me3: "cmrsu", me4: "cmrsu", med: "cmrsu", mh1: "cmrsu", mh2: "cmrsu", mh3: "cmrsu", mic: "cmrsu", mid: "cmrsu", mir: "cmrsu", mkc: "cmrsu", mkm: "cmrsu", mm2: "cmrsu", mm3: "cmrsu", mma: "cmrsu", mmq: "cmrsu", moc: "cmrsu", mom: "cmrsu", mor: "cmrsu", mp2: "cmrsu", mps: "cmrsu", mrd: "cmrsu", msc: "cmrsu", msh: "cmrsu", mtga: "cmrsu", mtgo: "cmrsu", mul: "cmrsu", ncc: "cmrsu", nec: "cmrsu", nem: "cmrsu", neo: "cmrsu", nph: "cmrsu", ody: "cmrsu", ogw: "cmrsu", om1: "cmrsu", omb: "cmrsu", onc: "cmrsu", one: "cmrsu", ons: "cmrsu", ori: "cmrsu", orzhov: "cmru", otc: "cmrsu", otj: "cmrsu", otp: "cmrsu", p02: "cmrsu", papac: "cmrsu", parl2: "cmrsu", past: "cmrsu", pbook: "cmrsu", pc2: "cmrsu", pca: "cmrsu", pcy: "cmrsu", pd2: "cmrsu", pd3: "cmrsu", pdrc: "c", peuro: "cmrsu", pgru: "c", phpr: "cmrsu", phuk: "cmrsu", pidw: "cmrsu", pio: "cmrsu", pip: "cmrsu", planeswalker: "cmrsu", plc: "cmrsu", pls: "cmrsu", pmps: "cmrsu", por: "cmrsu", prm: "cmrsu", ps11: "cmrsu", psal: "cmrsu", psdg: "cmrsu", psum: "cmrsu", ptg: "cmrsu", ptk: "cmrsu", pvan: "c", pxbox: "cmrsu", pz1: "cmrsu", pz2: "cmrsu", pza: "cmrsu", rav: "cmrsu", ren: "cmrsu", rex: "cmrsu", rin: "cmrsu", rix: "cmrsu", rna: "cmrsu", roe: "cmrsu", rtr: "cmrsu", rvr: "cmrsu", s00: "cmrsu", s99: "cmrsu", scd: "cmrsu", scg: "cmrsu", sds: "cmrsu", selesnya: "cmru", shm: "cmrsu", simic: "cmru", sir: "cmrsu", sis: "cmrsu", sld: "cmrsu", snc: "cmrsu", soa: "cmrsu", soc: "cmrsu", soi: "cmrsu", sok: "cmrsu", som: "cmrsu", sos: "cmrsu", spe: "cmrsu", spg: "cmrsu", spm: "cmrsu", ss1: "cmrsu", ss2: "cmrsu", ss3: "cmrsu", sta: "cmrsu", star: "cmrsu", sth: "cmrsu", stx: "cmrsu", td0: "cmrsu", td2: "cmrsu", tdc: "cmrsu", tdm: "cmrsu", thb: "cmrsu", ths: "cmrsu", tla: "cmrsu", tle: "cmrsu", tlr: "c", tmc: "cmrsu", tmp: "cmrsu", tmt: "cmrsu", tor: "cmrsu", tpr: "cmrsu", trc: "cmrsu", trk: "cmrsu", tsp: "cmrsu", tsr: "cmrsu", uds: "cmrsu", ugl: "cmrsu", ulg: "cmrsu", uma: "cmrsu", und: "cmrsu", unf: "cmrsu", unh: "cmrsu", usg: "cmrsu", ust: "cmrsu", v09: "cmrsu", v10: "cmrsu", v11: "cmrsu", v12: "cmrsu", v13: "cmrsu", v14: "cmrsu", v15: "cmrsu", v16: "cmrsu", v17: "cmrsu", van: "cmrsu", vis: "cmrsu", vma: "cmrsu", voc: "cmrsu", vow: "cmrsu", w16: "cmrsu", w17: "cmrsu", war: "cmrsu", who: "cmrsu", woc: "cmrsu", woe: "cmrsu", wor: "u", wot: "cmrsu", wth: "cmrsu", wwk: "cmrsu", x2ps: "cmrsu", xln: "cmrsu", y22: "cmrsu", y23: "cmrsu", y24: "cmrsu", y25: "cmrsu", y26: "cmrsu", zen: "cmrsu", znc: "cmrsu", zne: "cmrsu", znr: "cmrsu" }, Ql = {
  codes: Zl
}, td = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), ed = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function La(t) {
  return td.has(t?.trim().toLowerCase() ?? "");
}
function rd(t) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(t?.toLowerCase() ?? "") ? 0 : 1;
}
function nd(t, e) {
  const r = t?.trim().toLowerCase() ?? "";
  return ed.has(r) || r === "atq" && e === "Reconstruction";
}
const B = J.CONJURER_ROOT, Oa = `${B}/img/setSymbols/official/`, Qo = Ql.codes, od = {
  common: "c",
  uncommon: "u",
  rare: "r",
  mythic: "m",
  special: "s",
  bonus: "s"
};
function $a(t, e = "common", r = "auto") {
  const o = t.trim().toLowerCase();
  if (r === "keyrune") return null;
  const n = La(o) ? "c" : od[e];
  return n && Object.hasOwn(Qo, o) && Qo[o].includes(n) ? `${Oa}${o}-${n}.svg` : null;
}
function _t(t) {
  return !!t?.startsWith(Oa);
}
const sd = J.KEYRUNE_ROOT, ad = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function ae(t) {
  return !t.setSymbol && !$a(t.setCode ?? "", t.rarity, t.setSymbolSource) ? ad[t.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1] : [0, 0, 1, 1];
}
const Ba = new Set(
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
Ba.add("con_");
const id = "GLINT", Gr = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function ld(t) {
  const e = Gr[t] ?? Gr.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${e}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function dd(t) {
  const e = Gr[t] ?? Gr.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${e}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function ud(t, e = "common", r) {
  const o = t.trim().toLowerCase();
  if (o === "forge") return dd(e);
  if (o === id.toLowerCase()) return ld(e);
  const n = $a(o, e, r);
  if (n) return n;
  const s = o === "con" ? "con_" : o === "p02" ? "po2" : o;
  return Ba.has(s) ? `${sd}/${s}.svg` : null;
}
const ts = {
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
function Ia(t) {
  return Object.hasOwn(ts, t) ? ts[t] : null;
}
const Ie = J.RENDERER_COMPONENT_ROOT;
function we(t, e = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(e), o = e === "saga" ? "saga" : e === "planeswalker-large" ? "planeswalker_large" : e, n = r && t.land && /^[WUBRG]$/.test(t.frame) ? t.frame : ["saga", "class"].includes(e) && t.boxes === "Colourless" ? "Land" : e.startsWith("planeswalker") && t.boxes === "Artifact" ? "Colourless" : t.boxes;
  return {
    background: Lt(
      r ? "bg" : e === "class" ? "saga_bg" : `${o}_bg`,
      e.startsWith("planeswalker") && n === "Land" ? "Colourless" : r ? t.boxes : n
    ),
    frame: Lt(
      ["normal", "leveler"].includes(e) ? "frames" : `${o}_frames`,
      e === "adventure" ? "WUBRG".includes(t.frame) ? t.frame : "W" : e === "class" ? t.frame === "WU" ? "UW" : t.frame.length === 2 ? "Gold" : t.frame : e === "saga" && t.frame === "Colourless" ? "Land" : e.startsWith("planeswalker") && ["Artifact", "Land"].includes(t.frame) ? "Colourless" : t.frame
    ),
    boxes: Lt(e.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", n),
    nameplate: Lt("nameplates", t.boxes),
    crown: Lt("legendary-crowns", t.crown),
    pt: e.startsWith("planeswalker") ? Lt("planeswalker", "Loyalty") : Lt("pt-boxes", t.pt)
  };
}
function Ge(t) {
  const e = t.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = e === "∞" ? "INFINITY" : e === "½" ? "HALF" : e.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? Lt("symbols", r) : null;
}
function Ga(t, e, r) {
  return ud(t, e, r);
}
function Lt(t, e) {
  const r = t === "legendary-crowns" ? "legendary_crowns" : t === "pt-boxes" ? "pt_boxes" : t === "nameplates" ? "boxes" : t, o = t === "symbols" ? "svg" : "webp";
  return `${Ie}/img/${r}/${encodeURIComponent(e)}.${o}`;
}
function Q(t, e = t.rarity) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  const r = t.setCode?.trim().toLowerCase() ?? "";
  return t.setSymbol ?? Ga(
    r === "chr" ? Ia(t.name) ?? "" : r,
    e,
    t.setSymbolSource
  );
}
function md(t) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  if (_t(t.setSymbol)) {
    const e = new URL(t.setSymbol).pathname.match(/\/([^/]+)-[curms]\.svg$/)?.[1];
    if (e) return Ga(e, "common", "cardconjurer");
  }
  return Q(t, "common");
}
function It(t, e) {
  return t.setCode?.toLowerCase() === "plc" && t.frameAssetFamily === "eighth" && !t.frameTemplate && (!t.layout || t.layout === "normal") && (!t.borderColor || t.borderColor === "black") && e.startsWith(`${B}/img/frames/8th/`) && /^(?:[wubrgm]|colorshifted\/[wubrg])\.png$/.test(
    e.slice(`${B}/img/frames/8th/`.length)
  );
}
const Bn = (t) => 244 + (t - 244) * 1.006 - 0.5, In = (t) => 340 + (t - 340) * 1.008 + 0.25;
function mn([t, e, r, o]) {
  return [Bn(t * 488) / 488, In(e * 680) / 680, r * 1.006, o * 1.008];
}
function hd([t, e, r, o], n) {
  const [s, a, i, l] = n ? [1.03, -0.5, 1.025, 2.5] : [1.005, 0.25, 1.005, 2.75];
  return [
    (407 + (t * 488 - 407) * s + a) / 488,
    (626 + (e * 680 - 626) * i + l) / 680,
    r * s,
    o * i
  ];
}
function ro(t, e, r = !1) {
  const [o, n, s, a] = r ? [21, 18.75, 467.5, 661] : [22, 22, 466, 658];
  t.save(), t.beginPath(), t.rect(0, 0, 488, 680), t.rect(o, n, s - o, a - n), t.clip("evenodd"), t.drawImage(e, 0, 0, 488, 680), t.restore();
  const i = [22, 28, 460, 466], l = [22, 28, 638, 658], d = [o, Bn(28), Bn(460), s], u = [n, In(28), In(638), a];
  for (let m = 0; m < l.length - 1; m++)
    for (let h = 0; h < i.length - 1; h++) {
      const c = i[h], g = l[m], f = d[h], b = u[m];
      t.drawImage(
        e,
        c / 488 * e.width,
        g / 680 * e.height,
        (i[h + 1] - c) / 488 * e.width,
        (l[m + 1] - g) / 680 * e.height,
        f,
        b,
        d[h + 1] - f,
        u[m + 1] - b
      );
    }
}
const cd = /* @__PURE__ */ new Set(["artist", "legal", "collector", "manaCost", "setSymbol"]);
function Pa(t) {
  if (t.printingElements !== void 0) {
    if (!t.printingElements || typeof t.printingElements != "object" || Array.isArray(t.printingElements))
      throw Error("Printing elements must be an object");
    if (Object.keys(t.printingElements).length) {
      if (t.faces?.length || t.layout && !["normal", "token"].includes(t.layout) || t.frameTemplate && t.frameTemplate !== "future" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
        throw Error("Printing element controls require an ordinary face or Futureshifted template.");
      for (const [e, r] of Object.entries(t.printingElements)) {
        if (!cd.has(e) || !r || typeof r != "object" || Array.isArray(r))
          throw Error("Invalid printing element");
        for (const o of Object.keys(r))
          if (!["hidden", "offset"].includes(o)) throw Error("Unknown printing element option");
        if (r.hidden !== void 0 && typeof r.hidden != "boolean")
          throw Error("Invalid element visibility");
        if (r.offset !== void 0 && (!Array.isArray(r.offset) || r.offset.length !== 2 || !r.offset.every((o) => Number.isFinite(o) && Math.abs(o) <= 100)))
          throw Error("Printing offset must be within 100 reference pixels");
      }
    }
  }
}
function H(t, e, r, o) {
  const n = e.printingElements?.[r];
  if (!n?.hidden) {
    if (!n?.offset) return o();
    t.save();
    try {
      t.translate(...n.offset), o();
    } finally {
      t.restore();
    }
  }
}
const Fa = {
  plc: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 165 },
  fut: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 180 },
  "8ed": { legal: "™ & © 1993–2003 Wizards of the Coast, Inc.", total: 350 },
  m15: { legal: "™ & © 2014 Wizards of the Coast", total: 269 },
  war: { legal: "™ & © 2019 Wizards of the Coast", total: 264 },
  m21: { legal: "™ & © 2020 Wizards of the Coast", total: 274 },
  fdn: { legal: "™ & © 2024 Wizards of the Coast", format: "rarity-first" }
};
function no(t) {
  return t.printingElements?.legal?.hidden ? null : t.legalText === void 0 ? Fa[t.setCode?.toLowerCase() ?? ""]?.legal ?? null : t.legalText;
}
function oo(t, e = !0) {
  if (t.printingElements?.collector?.hidden) return "";
  const r = t.collectorNumber?.trim();
  if (!r) return "";
  const o = Fa[t.setCode?.toLowerCase() ?? ""], n = t.collectorFormat ?? o?.format ?? "number-first", s = /^Basic (?:Snow )?Land\b/.test(t.typeLine ?? "") ? "L" : (t.rarity ?? "common")[0].toUpperCase();
  if (e && n === "rarity-first")
    return `${s} ${r.split("/")[0].replace(/^(\d+)/, (u) => u.padStart(4, "0"))}`;
  const a = /^\d+$/.test(r), i = e && a ? r.padStart(3, "0") : r, l = t.collectorTotal === void 0 ? o?.total : t.collectorTotal, d = l && a && Number(r) <= l ? `${i}/${l}` : i;
  return e ? `${d} ${s}` : d;
}
const gd = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function mr(t) {
  const e = /^Basic (?:Snow )?Land [—–-] (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    t.canonicalTypeLine ?? t.typeLine ?? ""
  )?.[1];
  return e ? gd[e] : void 0;
}
function Vr(t) {
  if (t.frameStyle === "retro" || t.frameTemplate || t.layout && t.layout !== "normal")
    return null;
  const e = mr(t);
  if (!e) return null;
  const r = t.rulesText ?? "";
  if (!["", e, `{${e}}`, `{T}: Add {${e}}.`, `({T}: Add {${e}}.)`].includes(r))
    return null;
  if (t.rulesParagraphs) {
    const o = t.rulesParagraphs;
    if (o.length !== 1 || o[0].role !== "rules" || o[0].align || o[0].runs.length !== 1 || o[0].runs[0].text !== r || !!o[0].runs[0].italic !== r.startsWith("("))
      return null;
  }
  return `${J.RETRO_ROOT}/img/frames/m15/basics/${e.toLowerCase()}.png`;
}
function _a(t, e, r) {
  if (!Qt(t)) return !0;
  const o = Vr(e);
  if (!o) return !1;
  const n = r.get(o);
  if (!n) throw Error(`Basic land symbol unavailable: ${o}`);
  return t.save(), t.shadowColor = "#0009", t.shadowOffsetX = -1.5, t.shadowOffsetY = 1.5, t.shadowBlur = 1.5, t.drawImage(n, 166, 440, 156, 156), t.restore(), !0;
}
const hn = "WUBRG";
function _(t) {
  const e = t.canonicalTypeLine ?? t.typeLine ?? "", r = t.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(e), o = t.land ?? /(^|\s)Land(?:\s|$)/i.test(e), n = !/\bPlaneswalker\b/i.test(e) && (t.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(e)), s = t.creature ?? /(^|\s)Creature(?:\s|$)/i.test(e), a = I(t), i = a.length === 0 ? "Colourless" : a.length > 2 ? "Gold" : a.join(""), l = (r || o) && a.length === 0 ? "Artifact" : i, d = o ? "Land" : r ? "Artifact" : a.length > 1 ? "Gold" : i;
  return {
    frame: l,
    boxes: d,
    background: d,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: o && a.length > 0 ? i : r && a.length > 0 ? a.length > 1 ? "Gold" : i : d,
    pt: d,
    artifact: r,
    land: o,
    legendary: n,
    creature: s,
    className: `rendered-card-profile-${d.toLocaleLowerCase()}`
  };
}
function I(t) {
  if (t.frameColors !== void 0) return Pr(t.frameColors);
  const e = Pr(t.colors ?? []), r = mr(t);
  return e.length === 0 && r && t.land !== !1 ? [r] : e;
}
function Pr(t) {
  return [
    ...new Set(
      t.map((e) => e.toLocaleUpperCase()).filter((e) => hn.includes(e))
    )
  ].sort((e, r) => hn.indexOf(e) - hn.indexOf(r));
}
function Wa(t, e) {
  return It(t, e) ? "CardRenderer MTG ModMatrix" : void 0;
}
function es(t, e) {
  if (!e.includes("*")) {
    t.fillText(e, 407, 627, 78);
    return;
  }
  t.save();
  const r = t.measureText(e).width;
  t.translate(407, 0), t.scale(Math.min(1, 78 / r), 1), t.textAlign = "left";
  let o = "";
  for (const n of e.split(/(\*)/).filter(Boolean)) {
    const s = -r / 2 + t.measureText(o).width;
    if (n === "*") {
      const a = t.measureText(n), i = s + (a.actualBoundingBoxRight - a.actualBoundingBoxLeft) / 2, l = 627 + (a.actualBoundingBoxDescent - a.actualBoundingBoxAscent) / 2;
      t.save(), t.translate(i, l + 1.25), t.scale(0.775, 0.775), t.translate(-i, -l), t.fillText(n, s, 627), t.restore();
    } else t.fillText(n, s, 627);
    o += n;
  }
  t.restore();
}
function cn(t, e, r, o) {
  if (!It(e, r)) return;
  const [n, s, a, i, l, d] = o === "artist" ? [77, 634, -1, 3.25, 0.995, 1] : o === "legal" ? [36.5, 647, 4.5, 4.75, 0.995, 1.1] : [407, 627, 2, -2.25, 1.03, 1.01];
  t.translate(n + a, s + i), t.scale(l * d, l), t.translate(-n, -s);
}
let rs = null;
function fd(t, e) {
  const r = Wa(t, e);
  return !r || t.power == null || t.toughness == null ? Promise.resolve() : rs ??= document.fonts.load(`700 29px "${r}"`).then((o) => {
    if (!o.length || o.some((n) => n.status !== "loaded"))
      throw Error("Planar Chaos P/T needs card-glint/magic/fonts.css.");
  }).catch((o) => {
    throw rs = null, o;
  });
}
function Ua(t) {
  return ["B", "Colourless", "Land"].includes(_(t).boxes);
}
function ja(t) {
  return t.frameAssetFamily !== "eighth" || !t.artist ? null : `${B}/img/manaSymbols/${Ua(t) ? "whitebrush" : "brush"}.svg`;
}
function ns(t, e) {
  if (!e.includes("*")) {
    t.fillText(e, 407, 627, 78);
    return;
  }
  const r = e.split(/(\*)/).filter(Boolean), o = r.map((a) => a === "*" ? 15 : t.measureText(a).width), n = o.reduce((a, i) => a + i, 0);
  t.save(), t.translate(407, 0), t.scale(Math.min(1, 78 / n), 1), t.textAlign = "left";
  let s = -n / 2;
  for (const [a, i] of r.entries()) {
    if (i === "*") {
      t.beginPath();
      for (let l = 0; l < 10; l++) {
        const d = -Math.PI / 2 + l * Math.PI / 5, u = l % 2 ? 3.1 : 7.5, m = s + 7.5 + u * Math.cos(d), h = 622 + u * Math.sin(d);
        l === 0 ? t.moveTo(m, h) : t.lineTo(m, h);
      }
      t.closePath(), t.fill();
    } else t.fillText(i, s, 627);
    s += o[a];
  }
  t.restore();
}
function pd(t, e, r, o = "") {
  if (t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.letterSpacing = "0px", e.power != null && e.toughness != null) {
    t.save(), cn(t, e, o, "stats");
    const m = e.frameTreatment === "colorshifted";
    t.fillStyle = m ? "#fff" : "#17140f", m && (t.shadowColor = "#000", t.shadowOffsetX = -21e-4 * 488, t.shadowOffsetY = 15e-4 * 680);
    const h = Wa(e, o);
    t.font = `700 29px "${h ?? "CardRenderer MTG Matrix Small Caps"}", Georgia`, t.textAlign = "center", t.textBaseline = "middle";
    const c = `${e.power}/${e.toughness}`;
    if (e.textInk?.stats?.length) {
      const g = h ? void 0 : (f) => f.split(/(\*)/).reduce((b, y) => b + (y === "*" ? 15 : t.measureText(y).width), 0);
      dt(
        t,
        c,
        407,
        0,
        78,
        e.textInk,
        "stats",
        () => {
          h ? es(t, c) : ns(t, c);
        },
        g
      );
    } else h ? es(t, c) : ns(t, c);
    t.restore();
  }
  const n = e.setCode?.toLowerCase(), s = n === "8ed" ? 75 : n === "9ed" ? 79 : 77, a = n === "8ed" || n === "9ed", i = a ? 633 : 634;
  t.fillStyle = Ua(e) ? "#fff" : "#17140f", t.textBaseline = "alphabetic", t.textAlign = "left";
  const l = ja(e);
  H(t, e, "artist", () => {
    if (l) {
      t.save(), cn(t, e, o, "artist");
      const m = r.get(l);
      if (!m) throw Error(`Eighth Edition artist brush unavailable: ${l}`);
      t.drawImage(m, 36.5, i - 10, s - 39, 13.5), t.font = `700 ${a ? 17.5 : 18}px "CardRenderer MTG Matrix", Georgia`;
      const h = e.power != null && e.toughness != null ? 350 : 448;
      t.fillText(e.artist, s, i, h - s), t.restore();
    }
  });
  const d = no(e), u = oo(e, !1);
  if (t.save(), cn(t, e, o, "legal"), t.font = '10px "CardRenderer MTG MPlantin", Georgia', !e.printingElements?.collector?.offset && !e.printingElements?.legal?.offset) {
    const m = [d, u].filter(Boolean).join(" ");
    m && t.fillText(m, 36.5, i + 13, 409);
  } else {
    const m = [d, u].filter(Boolean).join(" "), h = Math.min(1, 409 / Math.max(1, t.measureText(m).width));
    t.translate(36.5, i + 13);
    const c = (g, f) => {
      t.save(), t.scale(h, 1), t.fillText(g, f, 0), t.restore();
    };
    d && H(t, e, "legal", () => c(d, 0)), u && H(
      t,
      e,
      "collector",
      () => c(u, t.measureText(d ? d + " " : "").width)
    );
  }
  t.restore(), t.restore();
}
const bd = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function Na(t) {
  if (!/\bBasic Land\b/.test(t.typeLine ?? "")) return null;
  const e = t.rulesText ?? "", r = /^\(?\{T\}: Add \{([WUBRG])\}\.\)?$/.exec(e);
  if (!r || e.startsWith("(") !== e.endsWith(")")) return null;
  if (t.rulesParagraphs) {
    const o = t.rulesParagraphs;
    if (o.length !== 1 || o[0].role !== "rules" || o[0].align || o[0].runs.length !== 1 || o[0].runs[0].text !== e || !!o[0].runs[0].italic !== e.startsWith("("))
      return null;
  }
  return r[1];
}
function so(t) {
  if (t.wordingMode === "oracle" || !["mir", "tmp"].includes(t.setCode?.toLowerCase() ?? "")) return null;
  const e = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    t.typeLine ?? ""
  )?.[1];
  if (!e) return null;
  const r = bd[e];
  return Na(t) !== r ? null : {
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
const yd = {
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
}, wd = {
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
}, Sd = at(
  "DUAL_HSB_PROFILES"
), vd = at(
  "DUAL_MANA_TARGETS"
), Cd = at(
  "PRINTING_COLOR_PROFILES"
), kd = at(
  "ORDINARY_COLOR_PROFILES"
), Da = at(
  "LEGENDS_COLOR_PROFILES"
), Td = at(
  "MANA_PRINTING_TARGETS"
), Md = at(
  "MANA_PRINTING_INK"
), Rd = at(
  "PRINTING_MANA_PROFILES"
), xd = at(
  "MODERN_MANA_OVERRIDES"
), os = at(
  "RETRO_MANA_PROFILES"
), ss = at(
  "MAJOR_SYMBOL_PROFILES"
), as = at(
  "MAJOR_FRAME_INSETS"
), Ed = at(
  "EARLY_EXPANSION_FRAMES"
), Ad = at(
  "EARLY_EXPANSION_COLORS"
), is = at("EARLY_EXPANSION_MANA_TARGETS"), ls = at("PLANAR_COLORS"), Gn = at("PLANAR_TEXTURE");
function ao(t) {
  return ["arn", "atq", "drk"].includes(t.setCode?.toLowerCase() ?? "") && ot(t) && !t.frameTemplate && (t.layout ?? "normal") === "normal" && Gt(t) === "black" && !_(t).legendary && !/^Level up\b/m.test(t.rulesText ?? "") && t.symbolStyle !== "modern" && !(t.symbolStyle === void 0 && t.wordingMode === "oracle");
}
function io(t) {
  if (t.setCode?.toLowerCase() !== "arn" || !ao(t)) return;
  const e = t.collectorNumber ?? "";
  return /^\d+†$/.test(e) ? "light" : /^\d+$/.test(e) ? "dark" : void 0;
}
const Ld = {
  W: [105, 117, 115],
  U: [53, 97, 116],
  B: [66, 78, 76],
  R: [96, 52, 46],
  G: [57, 92, 84],
  A: [92, 90, 83]
};
function Od(t) {
  if (io(t) !== "dark") return;
  const e = I(t), o = _(t).artifact ? "A" : e.length === 1 ? e[0] : "", n = Ld[o];
  return n ? { fill: t.calibration !== "source" && (t.calibration === "auto" || t.colorCalibration === "set-hsb-v1") ? `rgba(${n.join(",")},0.8)` : "rgba(0,0,0,0.4)" } : void 0;
}
function $d(t, e, r, o, n, s, a) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = s.fill, t.beginPath(), t.arc(r + n / 2 - 0.25, o + n / 2 - 0.5, n / 2 * 0.81, 0, Math.PI * 2), t.fill(), t.font = '100px "CardRenderer MTG MPlantin"', t.textAlign = "left", t.textBaseline = "alphabetic", t.fillStyle = "#111";
  const i = t.measureText(e), l = n * 0.7 * (a.numberScale ?? 1) / (i.actualBoundingBoxAscent + i.actualBoundingBoxDescent);
  t.translate(
    r + n / 2 + (a.numberDx ?? 0),
    o + n / 2 + (a.numberDy ?? 0)
  ), t.scale(l, l), t.fillText(
    e,
    (i.actualBoundingBoxLeft - i.actualBoundingBoxRight) / 2,
    (i.actualBoundingBoxAscent - i.actualBoundingBoxDescent) / 2
  ), t.restore();
}
function Mt(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !yt(t) || t.frameTemplate || t.frameAssetFamily || t.frameStyle === "modern" || t.borderColor && t.borderColor !== yt(t).border || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", o = I(t), n = t.land ?? /\bLand\b/.test(r);
  let s;
  if (n) {
    const d = {
      Plains: "W",
      Island: "U",
      Swamp: "B",
      Mountain: "R",
      Forest: "G"
    }[t.name], u = t.frameColors ?? (d ? [d] : []);
    if (u.length) {
      if (e !== "4ed" || u.length !== 1) return;
      s = `L-${u[0]}`;
    } else s = "L";
  } else
    s = t.artifact ?? /\bArtifact\b/.test(r) ? "A" : o.length === 1 ? o[0] : o.length > 1 ? "M" : void 0;
  const a = s && yt(t).frames[s];
  if (!a) return;
  const i = s === "L" ? e === "chr" && t.name === "Safe Haven" ? "L-dark" : e === "chr" && t.name === "City of Brass" || e === "4ed" && t.name === "Oasis" ? "L-gold" : "L-red" : s;
  return {
    ...a,
    material: s,
    profile: `${e}/${i}`,
    asset: `${J.RETRO_ROOT}/img/frames/old/${a.family}/${a.assetKey}.png`
  };
}
function hr(t) {
  return !!Mt(t) && !/^Level up\b/m.test(t.rulesText ?? "") && t.symbolStyle !== "modern" && !(t.symbolStyle === void 0 && t.wordingMode === "oracle");
}
function Bd(t) {
  return hr(t) ? yt(t).mana.geometry : void 0;
}
function Id(t, e) {
  return hr(t) ? yt(t).mana.paper[e === "X" ? "N" : e] : void 0;
}
function Gd(t) {
  return t.calibration !== "source" && t.colorCalibration === "set-hsb-v1" && hr(t) ? yt(t).mana.ink : void 0;
}
function cr(t, e) {
  if (!(t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle"))
    return yd[t.setCode?.toLowerCase() ?? ""]?.[e];
}
function Pn(t, e) {
  const r = cr(t, e), o = r && r !== "modern" && r !== "historic-font" ? wd[`${e}/${r}`] : void 0, n = za(t, e);
  return o && n ? { ...o, inkExpansion: n.pixels } : o;
}
function Pd(t, e) {
  return e === "B" && hr(t) ? "opaque-percentile" : za(t, e)?.paperSample;
}
function za(t, e) {
  const r = Md[`${t.setCode?.toLowerCase()}/${e}`];
  if (!(!r || r.family !== cr(t, e)) && !(r.paperSample && !ao(t)))
    return r;
}
const Fd = {
  shadow: [-1.0372, 2.0372],
  paper: [202, 197, 192],
  ink: [13, 15, 15]
};
function Ya(t) {
  return !ot(t) && t.frameAssetFamily === void 0 && t.frameTemplate === void 0 && (t.layout ?? "normal") === "normal" && !/\b(Saga|Class|Planeswalker|Battle)\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") && !/^Level up\b/m.test(t.rulesText ?? "");
}
function qa(t) {
  return Ya(t) ? Fd : void 0;
}
function Ha(t, e) {
  return qa(t) && /^\d$/.test(e) ? `${B}/img/manaSymbols/${e}.svg` : null;
}
function Wt(t) {
  const e = [
    t.rulesText ?? "",
    ...(t.rulesParagraphs ?? []).flatMap((o) => o.runs.map((n) => n.text))
  ], r = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...e.flatMap(
      (o) => Kr(o).flatMap((n) => n.symbol ? [n.symbol] : [])
    )
  ]);
  return [
    ...(t.manaSymbols ?? []).flatMap((o) => {
      const n = Ha(t, o);
      return n ? [n] : [];
    }),
    ...[...r].map(
      (o) => cr(t, o) === "historic-font" ? null : Pn(t, o)?.url ?? Ge(o)
    )
  ];
}
function gr(t) {
  if (t.frameTemplate || !["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "") || t.frameStyle === "modern" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) || t.layout && t.layout !== "normal")
    return;
  const e = Xa(t);
  if (e.length !== 2) return;
  const r = ["WU", "WG", "UG", "BG", "RG"].includes(e.join("")) ? [...e].reverse() : e, o = `${J.RETRO_ROOT}/img/frames/old/abu/`;
  return {
    base: `${o}${r[0].toLowerCase()}l.png`,
    overlay: `${o}${r[1].toLowerCase()}l.png`,
    mask: `${J.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`
  };
}
function Xa(t) {
  return t.frameColors ? I(t) : [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(([e]) => new RegExp(`\\b${e}\\b`).test(t.typeLine ?? "")).map(([, e]) => e);
}
const ds = [19.375 / 488, 21.125 / 680, 449.625 / 488, 639.25 / 680], us = {
  W: {
    family: "abu",
    stockWindow: ds,
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
    stockWindow: ds,
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
function vt(t) {
  if (t.setCode?.toLowerCase() !== "leg" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const e = t.typeLine ?? "", r = I(t), o = t.land ?? /\bLand\b/.test(e) ? "L" : t.artifact ?? /\bArtifact\b/.test(e) ? "A" : r.length > 1 ? "M" : r[0];
  if (!o || !(o in us)) return;
  const n = us[o];
  return {
    ...n,
    material: o,
    asset: `${J.RETRO_ROOT}/img/frames/old/${n.family}/${o.toLowerCase()}.png`
  };
}
function Ne(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !["arn", "atq", "drk"].includes(e) || t.frameTemplate || t.frameStyle === "modern" || t.borderColor && t.borderColor !== "black" || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", o = I(t), n = t.land ?? /\bLand\b/.test(r);
  if (n && (/\b(Basic|Plains|Island|Swamp|Mountain|Forest)\b/.test(r) || e === "arn" && t.name === "Mountain"))
    return;
  const s = n ? "L" : t.artifact ?? /\bArtifact\b/.test(r) ? "A" : o.length === 1 ? o[0] : o.length > 1 ? "M" : void 0, a = s && Ed[`${e}/${s}`];
  if (a)
    return {
      ...a,
      material: s,
      asset: `${J.RETRO_ROOT}/img/frames/old/${a.family}/${s.toLowerCase()}.png`
    };
}
function _d(t) {
  if (t.colorCalibration !== "set-hsb-v1" || t.borderColor && t.borderColor !== "black")
    return;
  const e = vt(t);
  return e && Da[`leg/black/retro/${e.material.toLowerCase()}.png`]?.source === JSON.stringify([e.asset, e.frame]) ? "#262626" : void 0;
}
function bt(t) {
  return t.setCode?.toLowerCase() === "3ed" && !t.frameTemplate && t.frameStyle !== "modern" && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") && (!t.layout || t.layout === "normal") && (t.land ?? /\bLand\b/.test(t.typeLine ?? ""));
}
const nr = `${J.RETRO_ROOT}/img/frames/old/fourth/l.png`, Wd = [2.404 / 488, 9.9 / 680, 0.984, 0.99], Ud = [
  (2.404 + 0.10533333333333333 * 488 * 0.984) / 488,
  (9.9 + 0.08571428571428572 * 680 * 0.99) / 680,
  0.7926666666666666 * 0.984,
  0.4552380952380952 * 0.99
];
function Ja(t) {
  const e = t.frameColors ?? [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(([r]) => new RegExp(`\\b${r}\\b`).test(t.typeLine ?? "")).map(([, r]) => r);
  return [...new Set(e)].filter((r) => "WUBRG".includes(r)).sort((r, o) => "RBWUG".indexOf(r) - "RBWUG".indexOf(o));
}
const Ka = {
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
function lo(t) {
  if (t.setCode?.toLowerCase() !== "3ed" || t.frameTemplate || t.frameStyle === "modern" || t.borderColor && t.borderColor !== "white" || bt(t) || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return null;
  if (/\bArtifact\b/.test(t.typeLine ?? "")) return "A";
  const e = I(t);
  if (e.length !== 1) return null;
  const r = e[0];
  return r === "W" || r === "U" || r === "B" || r === "R" || r === "G" ? r : null;
}
function Va(t) {
  const e = lo(t);
  if (!e) return null;
  const {
    x: [r, o],
    y: [n, s]
  } = Ka[e];
  return [
    (244 + (0.012 * 488 - 244) * r + o) / 488,
    (340 + (0.01 * 680 - 340) * n + s) / 680,
    0.974 * r,
    0.982 * n
  ];
}
function jd(t) {
  const e = lo(t), r = Va(t);
  if (!e || !r) return null;
  const [o, n, s, a] = Ka[e].aperture;
  return [r[0] + o * r[2], r[1] + n * r[3], s * r[2], a * r[3]];
}
function Za(t) {
  return lo(t) !== null;
}
const Nd = J.RETRO_SYMBOL_FONT, Pe = J.RETRO_ROOT, Dd = `${Pe}/fonts/goudy-medieval.ttf`, zd = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), Yd = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function ot(t) {
  return t.frameTemplate || t.layout && !["normal", "token"].includes(t.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") ? !1 : t.frameStyle === "retro" || t.frameStyle !== "modern" && zd.has(t.setCode?.toLowerCase() ?? "");
}
function uo(t) {
  return ["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "");
}
function Ot(t) {
  const e = Mt(t);
  if (e) return e.family;
  const r = t.setCode?.toLowerCase() ?? "", o = Ne(t);
  if (o) return o.family;
  const n = vt(t);
  return n ? n.family : uo(t) ? "abu" : r === "leg" && I(t).length > 1 ? "legends" : bt(t) || ["3ed", "4ed", "5ed", "atq"].includes(r) && !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) ? "fourth" : "seventh";
}
function Zr(t) {
  const e = Mt(t);
  if (e) return e.frame;
  const r = Ne(t);
  if (r) return r.frame;
  const o = vt(t);
  if (o) return o.frame;
  if (bt(t)) return Wd;
  const n = Va(t);
  return n || (Ot(t) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1]);
}
function mo(t) {
  const e = uo(t), r = vt(t) && (!t.borderColor || t.borderColor === "black");
  return {
    ...K,
    frame: Zr(t),
    title: [e ? 0.07 : 0.1134, 0.0481, e ? 0.8467 : 0.8, 0.043],
    art: Mt(t)?.art ?? Ne(t)?.art ?? vt(t)?.art ?? jd(t) ?? (bt(t) ? Ud : Ot(t) === "legends" ? [0.112, 0.094, 0.78, 0.45] : Ot(t) === "fourth" ? [0.109, 0.093, 0.779, 0.453] : e ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429]),
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: r ? [384 / k, 617 / E, 72 / k, 30 / E] : [0.8074, 0.895, 0.1367, 0.043],
    footer: r ? [48 / k, 624 / E, 340 / k, 24 / E] : [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function Kt(t) {
  const e = Mt(t);
  if (e) return e.asset;
  const r = Ne(t);
  if (r) return r.asset;
  const o = vt(t);
  if (o) return o.asset;
  if (bt(t)) return nr;
  const n = gr(t);
  if (n) return n.base;
  const s = I(t), a = t.typeLine ?? "", i = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([h]) => a.includes(h)), l = t.frameColors?.map((h) => h.toLowerCase()) ?? i.map(([, h]) => h), d = t.land ?? /\bLand\b/.test(a) ? l.length === 1 ? l[0] + "l" : "l" : t.artifact ?? /\bArtifact\b/.test(a) ? "a" : s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c", u = Ot(t), m = u === "seventh" || d === "c" || u === "abu" && d === "m" ? "seventh/regular" : `old/${u}`;
  return `${Pe}/img/frames/${m}/${u === "legends" ? "legendsFrameM" : d}.png`;
}
function Gt(t) {
  return t.borderColor ?? (Yd.has(t.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function qd(t) {
  return Gt(t) === "silver" ? Bt(null, "silver").border : Gt(t) === "white" ? Xd : _d(t) ?? "#080808";
}
function ho(t) {
  return Ot(t) === "fourth" ? `${Pe}/img/frames/old/fourth/borderBlack.png` : `${Pe}/img/frames/${Ot(t) === "abu" ? "old/abu" : "seventh/regular"}/border.svg`;
}
function ms(t) {
  return uo(t) ? "#ababab" : "#f2eee3";
}
function Hd(t) {
  return t.setCode?.toLowerCase() === "7ed" && I(t).some((e) => e === "W" || e === "G") && !(t.land ?? /\bLand\b/.test(t.typeLine ?? "")) ? "saturate(.7) brightness(.88)" : "none";
}
function co(t) {
  if (so(t)) return null;
  const e = Na(t);
  return e ? `${Pe}/img/frames/m15/basics/${e.toLowerCase()}.png` : null;
}
const Xd = "#eeedeb";
function Qa(t) {
  if (t.printingElements?.setSymbol?.hidden) return null;
  const e = t.setCode?.toLowerCase() ?? "";
  return !t.setSymbol && e === "ice" && t.setSymbolSource === "keyrune" ? `${J.KEYRUNE_ROOT}/ice2.svg` : !t.setSymbol && nd(e, t.name) ? null : Q(t);
}
function df(t) {
  const e = (t.rulesText ?? "").length;
  return e > 340 ? 16 : e > 210 ? 19 : 23;
}
function Jd(t) {
  const e = gr(t);
  return [
    co(t),
    Kt(t),
    e?.overlay,
    e?.mask,
    !bt(t) && !Za(t) && (Gt(t) !== "black" || Ot(t) === "fourth" || ar(t)) ? ho(t) : null,
    t.illustration,
    Qa(t),
    ...Wt(t)
  ];
}
const Et = ([t, e, r, o]) => [
  t * k,
  e * E,
  r * k,
  o * E
];
function uf(t, e) {
  return ["7ed", "8ed", "9ed"].includes(t?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(e ?? "") ? "black" : void 0;
}
function go(t, e) {
  const r = mr(t)?.toLowerCase();
  return t.setCode?.toLowerCase() === "8ed" && t.frameAssetFamily === "eighth" && !t.frameTemplate && (!t.layout || t.layout === "normal") && (!t.borderColor || t.borderColor === "white") && (t.frameColors === void 0 || t.frameColors.length === 1 && t.frameColors[0]?.toLowerCase() === r) && !!r && e === `${B}/img/frames/8th/${r}l.png`;
}
const Fn = (t) => 244 + (t - 244) * 1.004 - 1.25, _n = (t) => 340 + (t - 340) * 1.005 - 0.5;
function Kd([t, e, r, o]) {
  return [Fn(t * 488) / 488, _n(e * 680) / 680, r * 1.004, o * 1.005];
}
function Vd(t, e) {
  t.save(), t.beginPath(), t.rect(0, 0, 488, 680), t.rect(22, 22, 444, 636), t.clip("evenodd"), t.drawImage(e, 0, 0, 488, 680), t.restore();
  const r = [22, 28, 460, 466], o = [22, 28, 624, 658], n = [22, Fn(28), Fn(460), 466], s = [22, _n(28), _n(624), 658];
  for (let a = 0; a < o.length - 1; a++)
    for (let i = 0; i < r.length - 1; i++) {
      const l = r[i], d = o[a], u = n[i], m = s[a];
      t.drawImage(
        e,
        l / 488 * e.width,
        d / 680 * e.height,
        (r[i + 1] - l) / 488 * e.width,
        (o[a + 1] - d) / 680 * e.height,
        u,
        m,
        n[i + 1] - u,
        s[a + 1] - m
      );
    }
}
const Zd = {
  w: [22 / 255, 24 / 255, 18 / 255],
  u: [21 / 255, 25 / 255, 31 / 255],
  b: [3 / 255, 7 / 255, 14 / 255],
  r: [31 / 255, 25 / 255, 24 / 255],
  g: [16 / 255, 18 / 255, 21 / 255]
};
function De(t, e) {
  return t.colorCalibration === "set-hsb-v1" && t.frameTreatment === "colorshifted" && e.includes("/colorshifted/") && It(t, e) ? "#181510" : void 0;
}
function Qd(t, e) {
  if (!De(t, e)) return;
  const r = e.split("/").at(-1)?.replace(".png", ""), o = r && Zd[r];
  return o ? {
    lift: o,
    transition: 96 / 255,
    ...Gn[r].knots.length ? {
      textureMaskSource: `${B}/img/frames/8th/frame.png`,
      texture: Gn[r].knots.map(
        ([n, s]) => [n / 255, [s[0] / 255, s[1] / 255, s[2] / 255]]
      )
    } : {}
  } : void 0;
}
function Wn(t, e) {
  if (!De(t, e)) return;
  const r = e.split("/").at(-1)?.replace(".png", ""), o = r && Gn[r];
  return o ? {
    maskSource: `${B}/img/frames/8th/pinline.png`,
    outerMaskSource: `${B}/img/frames/8th/frame.png`,
    outset: 7 / 488,
    backdrop: [
      o.bevel.backdrop[0] / 255,
      o.bevel.backdrop[1] / 255,
      o.bevel.backdrop[2] / 255
    ],
    amount: o.bevel.amount
  } : void 0;
}
function kt(t) {
  const e = t.frameTreatment === "colorshifted";
  if (e && t.frameAssetFamily !== "eighth")
    throw Error("Colorshifted treatment requires the eighth frame family.");
  if (!t.frameAssetFamily || ["split", "aftermath"].includes(t.layout ?? "") && t.faces?.length === 2) return null;
  if (ot(t) || t.layout && !["normal", "token"].includes(t.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
    throw Error("Replacement frame plates currently support ordinary modern faces only.");
  const r = t.frameAssetFamily === "eighth", o = _(t), n = mr(t), s = t.frameColors === void 0 && n ? [n] : I(t), a = s.length === 2 && "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 ? [...s].reverse() : s, i = r ? "8th" : "m15/new", l = `${B}/img/frames/${i}${e ? "/colorshifted" : ""}`, d = o.land ? "l" : o.artifact ? "a" : /\bVehicle\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "v" : s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c";
  if (e && !["w", "u", "b", "r", "g", "a"].includes(d))
    throw Error("Colorshifted plates support monocolored spells and artifacts only.");
  const u = (v) => r ? `${v.toLowerCase()}l` : `l${v.toLowerCase()}`, m = o.land && a.length ? u(a.length > 2 ? "m" : a[0]) : d, h = o.land && a.length === 2 ? u(a[1]) : void 0, c = d === "l" ? r ? "l" : "c" : d, g = r ? [0.09, 0.0629, 0.824, 0.0429] : [168 / 2010, 145 / 2814, 0.8292, 0.0543], f = r ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358] : [168 / 2010, 1588 / 2814, 0.8292, 0.0543], b = e ? [0.7234, 0.881, 0.204, 0.0772] : r ? [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814] : [0.7573, 0.8848, 0.188, 0.0733], y = `${l}/${m}.png`, p = go(t, y), w = It(t, y), S = (v) => p ? Kd(v) : w ? mn(v) : v;
  return {
    frame: y,
    rightFrame: h ? `${l}/${h}.png` : void 0,
    pinlines: w && !e && d === "m" && s.length === 2 ? {
      left: `${l}/${a[0].toLowerCase()}.png`,
      right: `${l}/${a[1].toLowerCase()}.png`,
      mask: `${l}/pinline.png`
    } : void 0,
    border: `${B}/img/frames/${i}/border.png`,
    pt: e ? `${B}/img/frames/m15/colorshifted/${c}pt.png` : r ? `${B}/img/frames/8th/pt/${c === "c" ? "l" : c}.png` : `${B}/img/frames/m15/regular/m15PT${c.toUpperCase()}.png`,
    rects: {
      ...K,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title: w ? mn(g) : g,
      type: w ? mn(f) : f,
      art: r ? S([180 / 2010, 341 / 2814, 1656 / 2010, 1216 / 2814]) : [0.0767, 0.1129, 0.8476, 0.4429],
      rules: r ? S([205 / 2010, 1779 / 2814, 1596 / 2010, 729 / 2814]) : [0.086, 1780 / 2814, 0.828, 0.2875],
      stats: w ? hd(b, e) : b,
      footer: r ? [150 / 2010, 1938 / 2100, 0.81, 0.04] : K.footer
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
function t0(t) {
  const e = kt(t);
  if (!e) return null;
  const r = ja(t), o = Vr(t), n = Wn(t, e.frame);
  return [
    ...o ? [o] : [],
    ...n ? [n.maskSource, n.outerMaskSource] : [],
    ...r ? [r] : [],
    e.frame,
    ...e.rightFrame ? [e.rightFrame] : [],
    ...e.pinlines ? Object.values(e.pinlines) : [],
    ...t.power != null && t.toughness != null ? [e.pt] : [],
    ...Bt(t.setCode, t.borderColor).border !== "#090806" || t.frameAssetFamily === "m15-accurate" && t.calibration !== void 0 && t.calibration !== "source" && t.calibration !== "printing" || De(t, e.frame) || ar(t) ? [e.border] : []
  ];
}
const e0 = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", ir = {
  artInset: 3,
  artRim: 0.75,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function fo(t) {
  if (!t.frameAssetFamily && !_(t).legendary && (t.layout ?? "normal") === "normal" && Ie === e0) {
    const e = t.borderColor ?? (Bt(t.setCode).border === "#eeedeb" ? "white" : "black"), r = `${t.setCode?.toLowerCase() ?? ""}/${e}`;
    if (Object.hasOwn(as, r)) return as[r];
  }
  return ["m15", "m19", "m20", "war"].includes(t.setCode?.toLowerCase() ?? "") ? ir.frameInset : 0;
}
function r0(t) {
  const e = fo(t), r = K.frame[0] * k, o = K.frame[2] * k, n = K.art[0] * k + ir.artInset, s = r + e + (n - r) * (1 - 2 * e / o), a = ir.artRim;
  return [
    s / k,
    K.art[1] + a / E,
    1 - 2 * s / k,
    K.art[3] - 2 * a / E
  ];
}
function po(t) {
  const e = t.setCode?.toLowerCase();
  if (!e || !["lea", "leb", "3ed", "leg", "8ed", "m21"].includes(e) || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = Gt(t);
  if (ot(t)) {
    if (gr(t) || bt(t)) return;
    const a = Kt(t), i = Zr(t);
    return {
      key: `${e}/${r}/retro/${a.split("/").at(-1)}`,
      family: "retro",
      frame: a,
      rect: i,
      assets: { frame: a },
      source: JSON.stringify([a, i])
    };
  }
  const o = kt(t);
  if (o)
    return o.rightFrame ? void 0 : {
      key: `${e}/${r}/${t.frameAssetFamily}/${o.frame.split("/").at(-1)}`,
      family: "plate",
      frame: o.frame,
      rect: o.rects.frame,
      assets: { frame: o.frame, pt: o.pt },
      source: JSON.stringify([o.frame, o.rects])
    };
  const n = _(t);
  if (n.land) return;
  const s = we(n);
  return {
    key: `${e}/${r}/components/${n.boxes}/${n.frame}`,
    family: "components",
    frame: s.frame,
    rect: K.frame,
    assets: s,
    source: JSON.stringify([s, K.frame, fo(t)])
  };
}
const n0 = {
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
}, ti = (t) => ({
  kind: "polygon",
  feather: 2 / 744,
  points: t.map(([e, r]) => [e / 744, r / 1039])
}), o0 = ti([
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
]), s0 = ti([
  [74, 582],
  [677, 582],
  [688, 590],
  [696, 605],
  [705, 615],
  [705, 628],
  [696, 642],
  [682, 650],
  [82, 650]
]), a0 = { title: [1, 1, 1], type: [1, 1, 1], stats: [1.0297029702970297, 1.0088832487309645, 1.0299401197604792] }, i0 = { title: [0.9047619047619047, 0.9276018099547512, 0.9518072289156626], type: [1.4015151515151516, 1.0086206896551724, 0.9087837837837838], stats: [1.5, 1.1030927835051547, 1.0265624999999998] }, l0 = { title: [0.736842105263158, 0.8620689655172413, 1.03125], type: [0.6666666666666666, 0.8181818181818182, 1.0740740740740742], stats: [0.8936170212765957, 1.0612244897959184, 1.146551724137931] }, d0 = { title: [1.0038560411311055, 0.9704301075268819, 1.1162790697674418], type: [0.9128989361702128, 0.9044117647058825, 1.1458333333333335], stats: null }, u0 = { title: [1.2035714285714287, 1.03, 1.0040322580645162], type: [1.494318181818182, 1.0045731707317074, 1.1860465116279069], stats: [1.5, 1.1079545454545454, 1.276595744680851] }, m0 = { title: [0.8410958904109589, 0.8910614525139665, 0.9060773480662984], type: [1, 1, 1], stats: null }, h0 = {
  W: a0,
  U: i0,
  B: l0,
  R: d0,
  G: u0,
  A: m0
}, hs = `${J.CONJURER_ROOT}/img/frames/future/regular`, bo = J.MSE_TEMPLATE_ROOT, At = `${bo}/magic-future.mse-style`, wr = `${bo}/magic-future-textless.mse-style`;
function ht(t) {
  return t.futureTreatment ?? "regular";
}
function ei(t) {
  if ((t.manaSymbols?.length || 0) > 6)
    throw Error("Futureshifted cost exceeds the six source positions");
  if (Zt(t), ht(t) === "full-art" && (t.rulesParagraphs?.some((e) => e.runs.some((r) => r.text.trim())) || !t.rulesParagraphs && t.rulesText?.trim()))
    throw Error("Futureshifted full-art treatment has no rules panel for the supplied wording");
}
function ri(t) {
  const e = I(t);
  return e.join("") === "WG" ? ["G", "W"] : e.join("") === "WR" ? ["R", "W"] : e;
}
function Zt(t) {
  const e = _(t), r = ri(t), o = ht(t), n = o === "full-art", s = e.land && !n, a = o === "regular" && !s && !e.artifact && r.length === 0, i = s || a, l = r.length > 1 ? "M" : r[0] ?? (e.artifact ? "A" : "C"), d = (r[0]?.toLowerCase() ?? "c") + "l", u = s && r.length === 2, m = (r[1]?.toLowerCase() ?? "c") + "l", h = t.power != null && t.toughness != null;
  if (n && !/^[WUBRG]$/.test(l))
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
    base: n ? `${wr}/${l.toLowerCase()}card.jpg` : i ? `${At}/${a ? "c" : d}card.jpg` : `${hs}/futureFrame${l}.png`,
    ...n ? { mask: `${wr}/mask_image.png` } : {},
    ...i ? {
      mask: `${At}/mask_image.png`,
      paper: `${At}/${a ? "c" : e.creature ? l.toLowerCase() : d}textbox.png`,
      type: `${At}/${a ? "c" : d}typeline.png`
    } : {},
    ...u ? {
      reverseBase: `${At}/${m}card.jpg`,
      reversePaper: `${At}/${m}textbox.png`,
      reverseType: `${At}/${m}typeline.png`,
      neutralBase: `${At}/clcard.jpg`,
      neutralType: `${At}/cltypeline.png`,
      baseBlend: `${At}/hybrid_blend_card.png`,
      typeBlend: `${At}/hybrid_blend_typeline.png`
    } : {},
    ...h ? {
      stats: n ? `${wr}/${l.toLowerCase()}pt.jpg` : i ? `${At}/${a ? "c" : d}pt.png` : `${hs}/futurePT${l}.png`,
      ...n ? { statsMask: `${wr}/mask_pt.png` } : {}
    } : {},
    ...b ? {
      typeSymbol: `${bo}/magic-future-common.mse-include/${b}_${y ? "white" : "black"}.png`
    } : {},
    ...t.artist ? {
      brush: `${J.CONJURER_ROOT}/img/manaSymbols/${s || c ? "whitebrush" : "brush"}.svg`
    } : {}
  };
}
function yo(t) {
  const e = ht(t), r = e === "full-art";
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
const c0 = { frame: [0.9187500000000002, 0.9229729729729731, 1.1260000000000001], title: [0.8812095032397409, 0.8817567567567567, 0.9481792717086837], type: [1.0465277777777777, 1.0163352272727273, 1.1097770154373927], stats: [0.9004329004329005, 0.8952702702702703, 0.9717514124293787] }, g0 = { frame: [0.6021739130434783, 0.7878787878787878, 0.9531772575250836], title: [0.59375, 0.8760683760683762, 0.8777777777777778], type: [0.6702898550724639, 0.9859550561797753, 1.0846774193548387], stats: [0.7395209580838322, 0.8991596638655462, 0.8878378378378378] }, f0 = { frame: [0.8851981351981352, 0.9510309278350517, 0.9543269230769231], title: [0.9145199063231849, 1.0140449438202248, 1.1162790697674418], type: [1.0811023622047244, 0.9044117647058825, 0.7366071428571429], stats: [0.9608294930875576, 1.0552486187845302, 1.180722891566265] }, p0 = { frame: [1, 1, 1], title: [0.9573863636363638, 1.03, 1.3833333333333333], type: [1, 1, 1], stats: [0.9746835443037973, 1.0483870967741935, 1.5] }, b0 = {
  W: c0,
  U: g0,
  R: f0,
  G: p0
}, wo = (t, e = 375, r = 527) => ({
  kind: "polygon",
  feather: 1 / e,
  points: t.map(([o, n]) => [o / e, n / r])
}), y0 = wo([
  [44, 60],
  [52, 42],
  [66, 29],
  [75, 26],
  [344, 26],
  [347, 29],
  [347, 60]
]), w0 = wo([
  [43, 438],
  [337, 438],
  [341, 443],
  [336, 448],
  [335, 458],
  [339, 466],
  [43, 466]
]), S0 = wo(
  [
    [12, 16],
    [64, 16],
    [64, 35],
    [60, 42],
    [12, 42]
  ],
  78,
  51
), v0 = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, ke = (t) => ({
  hueDegrees: 0,
  saturationScale: 1,
  brightnessScale: 1,
  rgbScale: t
});
function C0(t) {
  const e = Zt(t);
  for (const [r, o] of Object.entries(b0)) {
    const n = J.MSE_TEMPLATE_ROOT + "/magic-future-textless.mse-style/";
    if (e.base === n + r.toLowerCase() + "card.jpg")
      return {
        [e.base]: {
          frame: ke([1, 1, 1]),
          paper: ke(o.frame),
          mask: v0,
          regions: [
            { mask: y0, adjustment: ke(o.title) },
            { mask: w0, adjustment: ke(o.type) }
          ]
        },
        ...e.stats ? {
          [e.stats]: { frame: ke(o.frame), paper: ke(o.stats), mask: S0 }
        } : {}
      };
  }
  return {};
}
const k0 = { frame: { hueDegrees: 8, saturationScale: 0.6137499999999998, brightnessScale: 1.25 }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.1482558139534884, 1.111280487804878, 1.3] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.0692640692640691, 1.036873156342183, 1.1861510791366907] } }, T0 = { W: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8366228070175439, 0.786036036036036, 0.7373737373737373] }, G: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.4, 1.4, 1.4] } }, M0 = { frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6, 0.6, 0.6] }, paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8893905191873589, 0.8839285714285715, 0.9282511210762332] }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.947089947089947, 0.9388297872340424, 1.0242587601078168] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6957070707070706, 0.6905370843989771, 0.7095046854082999] } }, Te = {
  land: k0,
  paper: T0,
  colorless: M0
}, Sr = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, ni = (t) => ({
  kind: "polygon",
  feather: 1 / 339,
  points: t.map(([e, r]) => [e / 339, r / 464])
}), R0 = ni([
  [26, 43],
  [34, 25],
  [48, 12],
  [57, 9],
  [326, 9],
  [329, 12],
  [329, 43]
]), x0 = ni([
  [12, 277],
  [319, 277],
  [330, 285],
  [337, 294],
  [330, 310],
  [319, 314],
  [20, 314]
]), E0 = {
  kind: "rect",
  rect: [20 / 375, 470 / 527, 338 / 375, 40 / 527],
  feather: 1 / 375
}, A0 = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, L0 = {
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
}, Je = (t) => ({
  ...t,
  rgbScale: t.rgbScale
});
function O0(t) {
  const e = Zt(t), r = At + "/";
  if (!e.base.startsWith(r)) return {};
  const o = e.base === r + "ccard.jpg", n = {}, s = o ? Te.colorless : Te.land;
  for (const a of [e.base, e.reverseBase, e.neutralBase])
    a && (n[a] = o ? {
      frame: Sr,
      paper: Je(Te.colorless.frame),
      mask: A0,
      regions: [{ mask: L0, adjustment: Sr }]
    } : { frame: Sr, paper: Te.land.frame, mask: E0 });
  for (const a of [e.type, e.reverseType, e.neutralType])
    a === r + (o ? "c" : "cl") + "typeline.png" && (n[a] = {
      frame: Sr,
      paper: Je(s.title),
      mask: R0,
      regions: [{ mask: x0, adjustment: Je(s.type) }]
    });
  for (const a of [e.paper, e.reversePaper])
    if (a)
      if (o) n[a] = Je(Te.colorless.paper);
      else
        for (const [i, l] of Object.entries(Te.paper))
          a === r + i.toLowerCase() + "ltextbox.png" && (n[a] = Je(l));
  return n;
}
const $0 = {
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
function B0(t) {
  if (t.frameTemplate !== "future" || t.setCode?.toLowerCase() !== "fut" || t.colorCalibration !== "set-hsb-v1")
    return {};
  if (ht(t) === "full-art") return C0(t);
  if (ht(t) !== "regular") return {};
  const e = Zt(t).base;
  for (const [r, o] of Object.entries($0))
    if (e === J.CONJURER_ROOT + "/img/frames/future/regular/futureFrame" + r + ".png") {
      const n = h0[r], s = (i) => ({
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        rgbScale: i
      }), a = Zt(t).stats;
      return {
        [e]: {
          ...o,
          mask: n0,
          regions: [
            { mask: o0, adjustment: s(n.title) },
            { mask: s0, adjustment: s(n.type) }
          ]
        },
        ...a && n.stats ? { [a]: s(n.stats) } : {}
      };
    }
  return O0(t);
}
const oi = (t) => ({
  kind: "polygon",
  points: t.map(([e, r]) => [e / 488, r / 680]),
  feather: 0.75 / 488
}), I0 = oi([
  [43, 41],
  [445, 41],
  [449, 48],
  [450, 58],
  [446, 72],
  [42, 72],
  [38, 64],
  [37, 54],
  [39, 46]
]), G0 = oi([
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
function P0(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.colorCalibration !== "set-hsb-v1" || t.frameTemplate || t.layout && t.layout !== "normal")
    return {};
  const e = kt(t);
  if (!e || !It(t, e.frame)) return {};
  const r = Qd(t, e.frame), o = Object.entries(ls).find(([, l]) => l.source === e.frame);
  if (!o)
    return r ? {
      [e.frame]: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        blackPoint: r,
        blend: Wn(t, e.frame)
      }
    } : {};
  const [n, s] = o, a = n.endsWith("/W") || n.endsWith("/M") ? 615 : 610, i = {
    [e.frame]: {
      blackPoint: r,
      blend: Wn(t, e.frame),
      frame: s.frame,
      paper: s.paper,
      mask: {
        kind: "rect",
        rect: [41 / 488, 425 / 680, 405 / 488, (a - 425) / 680],
        feather: 0.75 / 488
      },
      regions: [
        { mask: I0, adjustment: s.title },
        { mask: G0, adjustment: s.type }
      ]
    }
  };
  for (const l of e.pinlines ? [e.pinlines.left, e.pinlines.right] : []) {
    const d = Object.values(ls).find((u) => u.source === l);
    d && (i[l] = d.frame);
  }
  return i;
}
function So(t) {
  if (t.colorCalibration !== "set-hsb-v1") return;
  const e = Ne(t);
  if (!e) return;
  const r = Ad[`${t.setCode?.toLowerCase()}/${e.material}`];
  if (r?.source === JSON.stringify([e.asset, e.frame]))
    return { materials: { [e.asset]: r.adjustment }, stock: r.stock };
}
function vo(t) {
  if (t.colorCalibration !== "set-hsb-v1") return;
  const e = Mt(t);
  if (!e) return;
  const r = yt(t).colors[e.profile.split("/")[1]];
  if (r?.source === JSON.stringify([e.asset, e.frame]))
    return { materials: { [e.asset]: r.adjustment }, stock: r.stock };
}
function ze(t) {
  if (t.frameTemplate) return !1;
  const e = ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  return (ot(t) || !!po(t)) && (!t.layout || t.layout === "normal") && (t.colorCalibration === "set-hsb-v1" || e && t.colorCalibration === "early-hsb-v1");
}
function F0(t) {
  if (!ze(t) || !ot(t) || gr(t)) return;
  const e = Kt(t), r = e.split("/").at(-1).replace(".png", "").toUpperCase(), o = Sd[`${t.setCode?.toLowerCase()}-${Gt(t)}-${r}`];
  if (!(o?.asset !== e || !o.rect.every((n, s) => n === Zr(t)[s])))
    return e.endsWith("/old/fourth/w.png") ? {
      ...o.adjustment,
      mask: {
        kind: "rect",
        rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
        feather: 2 / 1500
      }
    } : o.adjustment;
}
function si(t, e) {
  if (!ze(t)) return;
  const r = Id(t, e);
  if (r) return r;
  if (t.setCode?.toLowerCase() === "leg" && !vt(t)) return;
  const o = `${t.setCode?.toLowerCase()}-${Gt(t)}-${e}`;
  if (ao(t)) {
    const n = io(t);
    return n && (e === "W" || e === "B") ? is[`arn-${n}-black-${e}`] : is[o];
  }
  return Td[o] ?? vd[o];
}
function Co(t) {
  const e = vo(t);
  if (e) return e.materials;
  const r = So(t);
  if (r) return r.materials;
  if (t.frameTemplate === "future") return B0(t);
  if (t.setCode?.toLowerCase() === "plc") return P0(t);
  if (!ze(t)) return {};
  const o = po(t), n = o && ((_(t).legendary ? void 0 : kd[o.key]) ?? Cd[o.key] ?? Da[o.key]);
  if (n && n.source === o?.source && (n.legendary === void 0 || n.legendary === _(t).legendary))
    return n.materials;
  const s = F0(t);
  return s ? { [Kt(t)]: s } : {};
}
function _0(t) {
  return Object.keys(Co(t)).length > 0;
}
function cs(t) {
  const e = vo(t);
  if (e) return e.materials;
  const r = So(t);
  return r ? r.materials : Aa(t, Co(t), ai(t)).materials;
}
function W0(t) {
  const e = vo(t);
  if (e) return e.stock;
  const r = So(t);
  return r ? r.stock : Aa(t, Co(t), ai(t)).stock;
}
function ai(t) {
  if (ar(t) && !t.frameTemplate && !ot(t) && !kt(t) && (t.layout ?? "normal") === "normal" && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") && _(t).land)
    return {
      url: we(_(t)).frame,
      geometry: JSON.stringify(K.frame)
    };
  if (!ze(t)) return;
  if (ot(t))
    return {
      url: Kt(t),
      geometry: JSON.stringify(Zr(t)),
      mask: ho(t)
    };
  const e = po(t);
  return e?.family === "components" ? { url: e.frame, geometry: JSON.stringify(e.rect) } : void 0;
}
const tr = /* @__PURE__ */ new WeakMap();
function U0(t, e, r, o) {
  return tr.get(t)?.(e, r, o) ?? !1;
}
function j0(t, e, r) {
  const o = e.printingOmissions;
  if (!o?.length) return r();
  const n = t.fillText, s = t.strokeText, a = (l, d, u) => {
    const m = t.getTransform().transformPoint({ x: d, y: u }), h = m.x * 488 / t.canvas.width, c = m.y * 680 / t.canvas.height;
    return o.some(({ rect: g, rotation: f = 0, texts: b }) => {
      if (!b.includes(String(l))) return !1;
      const y = f * Math.PI / 180, p = h - g[0] * 488, w = c - g[1] * 680, S = p * Math.cos(y) + w * Math.sin(y), v = -p * Math.sin(y) + w * Math.cos(y);
      return S >= -8 && S <= g[2] * 488 + 8 && v >= -8 && v <= g[3] * 680 + 25;
    });
  }, i = tr.get(t);
  tr.set(t, (l, d, u) => a(l, d, u) || (i?.(l, d, u) ?? !1)), t.fillText = function(l, d, u, m) {
    a(l, d, u) || n.call(this, l, d, u, ...m === void 0 ? [] : [m]);
  }, t.strokeText = function(l, d, u, m) {
    a(l, d, u) || s.call(this, l, d, u, ...m === void 0 ? [] : [m]);
  };
  try {
    r();
  } finally {
    i ? tr.set(t, i) : tr.delete(t), t.fillText = n, t.strokeText = s;
  }
}
function N0(t, e, r, o, n) {
  const [s, a, i] = r;
  if (U0(t, e, s, a)) return;
  const l = t.getTransform(), d = Math.hypot(l.a, l.b), u = (Math.floor((s - 4) * d + l.e) - l.e) / d, m = (Math.floor((a - o) * d + l.f) - l.f) / d, h = document.createElement("canvas");
  h.width = Math.ceil((i + 8) * d), h.height = Math.ceil(o * 2 * d);
  const c = h.getContext("2d");
  if (!c) throw Error("Magic heading ink needs Canvas2D");
  try {
    c.scale(d, d), c.translate(-u, -m), c.font = t.font, c.fillStyle = t.fillStyle, c.textAlign = t.textAlign, c.textBaseline = t.textBaseline, c.fillText(e, s, a, i), c.globalCompositeOperation = "destination-out", c.lineWidth = n, c.strokeStyle = "#000", c.strokeText(e, s, a, i), t.drawImage(
      h,
      0,
      0,
      h.width,
      h.height,
      u,
      m,
      h.width / d,
      h.height / d
    );
  } finally {
    h.width = h.height = 0;
  }
}
function ko(t, e, r, o, n, s = "#efe7cb", a, i = "#0d0f0f") {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = s, t.beginPath(), t.arc(e + o / 2, r + o / 2, o / 2, 0, Math.PI * 2), t.fill(), t.clip(), t.fillStyle = i, t.font = '100px "CardRenderer MTG Historic Symbols"', t.textAlign = "left", t.textBaseline = "alphabetic";
  const l = "", d = t.measureText(l), u = d.actualBoundingBoxLeft + d.actualBoundingBoxRight, m = d.actualBoundingBoxAscent + d.actualBoundingBoxDescent, h = n * (a?.scale ?? 1) / Math.max(u, m);
  t.translate(e + o / 2 + (a?.dx ?? 0), r + o / 2 + (a?.dy ?? 0)), t.scale(h, h), t.fillText(
    l,
    (d.actualBoundingBoxLeft - d.actualBoundingBoxRight) / 2,
    (d.actualBoundingBoxAscent - d.actualBoundingBoxDescent) / 2
  ), t.restore();
}
const mf = "symbols-v3";
function To(t) {
  if (t.symbolAdjustment) {
    if (t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
      throw Error("Symbol adjustment currently supports ordinary faces only.");
    for (const [e, r] of Object.entries(t.symbolAdjustment)) {
      if (e !== "mana" && e !== "set") throw Error("Unknown symbol adjustment group.");
      if (!r || typeof r != "object") throw Error("Invalid symbol adjustment.");
      for (const [o, n] of Object.entries(r)) {
        if (e === "mana" && o === "glyphs") {
          D0(n);
          continue;
        }
        const s = o === "dx" || o === "dy", a = e === "mana" && (o === "numberDx" || o === "numberDy"), i = e === "mana" && o === "spacing", l = o === "scaleX" || o === "scaleY" || e === "mana" && o === "numberScale", d = i || a ? 4 : 8;
        if (!s && !a && !i && !l || typeof n != "number" || !Number.isFinite(n) || n < (l ? 0.75 : -d) || n > (l ? 1.25 : d))
          throw Error("Symbol adjustment exceeds supported bounds.");
      }
    }
  }
}
function D0(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    throw Error("Invalid mana glyph controls.");
  for (const [e, r] of Object.entries(t)) {
    if (!/^[WUBRG]$/.test(e) || !r || typeof r != "object" || Array.isArray(r))
      throw Error("Invalid mana glyph color.");
    for (const [o, n] of Object.entries(r)) {
      const s = o === "scale";
      if (!s && o !== "dx" && o !== "dy" || typeof n != "number" || !Number.isFinite(n) || n < (s ? 0.75 : -4) || n > (s ? 1.25 : 4))
        throw Error("Mana glyph control exceeds supported bounds.");
    }
  }
}
function lr(t, e) {
  return /^[WUBRG]$/.test(e) ? t?.glyphs?.[e] : void 0;
}
function pe(t, e) {
  const { dx: r = 0, dy: o = 0, scaleX: n = 1, scaleY: s = 1 } = e ?? {};
  if (!r && !o && n === 1 && s === 1) return t;
  const [a, i, l, d] = t;
  return [a + l + r - l * n, i + d / 2 + o - d * s / 2, l * n, d * s];
}
function Fe(t, e, r, o) {
  const n = pe(e, r);
  if (n === e || !e[2] || !e[3]) {
    o();
    return;
  }
  t.save();
  const s = n[2] / e[2], a = n[3] / e[3];
  t.transform(s, 0, 0, a, n[0] - e[0] * s, n[1] - e[1] * a);
  try {
    o();
  } finally {
    t.restore();
  }
}
function z0(t, e, r) {
  const o = Math.max(0, e - 1) * (r?.spacing ?? 0);
  return o ? [t[0] - o, t[1], t[2] + o, t[3]] : t;
}
function be(t) {
  if (!/^#[a-f0-9]{6}$/i.test(t)) throw Error("Invalid mana palette color");
  return [
    parseInt(t.slice(1, 3), 16) / 255,
    parseInt(t.slice(3, 5), 16) / 255,
    parseInt(t.slice(5, 7), 16) / 255
  ];
}
const Y0 = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, q0 = "#9aa4ae", gn = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
function Mo(t, e, r, o) {
  const n = [];
  for (const s of e.split(`
`)) {
    let a = [], i = 0;
    const l = Kr(s).flatMap(
      (d) => d.symbol ? [{ text: d.symbol, symbol: !0 }] : (d.value.match(/\s+|\S+/g) ?? []).map((u) => ({ text: u, symbol: !1 }))
    );
    for (const d of l) {
      const u = !d.symbol && t.measureText(d.text).width > r ? [...d.text].map((m) => ({ text: m, symbol: !1 })) : [d];
      for (const m of u) {
        const h = m.symbol ? o * 0.94 : t.measureText(m.text).width;
        i + h > r && a.length && (n.push(a), a = [], i = 0), !(!a.length && /^\s+$/.test(m.text)) && (a.push({ ...m, width: h }), i += h);
      }
    }
    n.push(a);
  }
  return n;
}
function et(t, e, r, o, n, s, a = !1, i) {
  if (e === "W" && s.originalWhiteGlyph) {
    ko(
      t,
      r,
      o,
      n,
      n * 0.87,
      s.manaColors?.W,
      lr(i, e),
      s.manaInkColor
    );
    return;
  }
  const l = /^\d+$/.test(e);
  if (l && i && s.manaCostNumeral) {
    $d(t, e, r, o, n, s.manaCostNumeral, i);
    return;
  }
  const d = lr(i, e), u = s.manaGlyphScales?.[e] ?? 1, m = l ? i ? s.manaNumerals?.get(e) : void 0 : u !== 1 || d ? s.manaGlyphs?.get(e) : void 0, h = s.get(Ge(e) ?? "");
  if (t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, a) {
    const c = t.getTransform();
    t.shadowColor = "#000d";
    const [g, f] = s.manaCostShadow ?? [-1.5372, 1.5372];
    t.shadowOffsetX = g * c.a + f * c.c, t.shadowOffsetY = g * c.b + f * c.d;
  }
  if (t.fillStyle = s.manaColors?.[e] ?? Y0[e] ?? q0, t.beginPath(), t.arc(r + n / 2, o + n / 2, n / 2, 0, Math.PI * 2), t.fill(), t.shadowColor = "transparent", m && t.drawImage(m.image, 0, 0, m.width, m.height, r, o, n, n), m) {
    const c = l ? i?.numberDx ?? 0 : d?.dx ?? 0, g = l ? i?.numberDy ?? 0 : d?.dy ?? 0, f = l ? i?.numberScale ?? 1 : u * (d?.scale ?? 1);
    l || (t.beginPath(), t.arc(r + n / 2, o + n / 2, n / 2, 0, Math.PI * 2), t.clip()), (c || g || f !== 1) && (t.translate(r + n / 2 + c, o + n / 2 + g), t.scale(f, f), t.translate(-r - n / 2, -o - n / 2));
  }
  if (m || h) {
    m ? t.drawImage(
      m.image,
      m.width,
      0,
      m.width,
      m.height,
      r,
      o,
      n,
      n
    ) : t.drawImage(h, r, o, n, n), t.restore();
    return;
  }
  t.fillStyle = e === "B" ? "white" : "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.font = `bold ${n * 0.62}px Georgia`, t.fillText(e, r + n / 2, o + n / 2, n * 0.9), t.restore();
}
function ii(t, e, r, o, n, s, a) {
  if (!Qt(t)) return;
  const i = typeof s == "number" ? s : s.size;
  t.font = `${typeof s != "number" && s.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
  const l = e.split(`
`).map((d) => Mo(t, d, n, i));
  t.textBaseline = "top";
  for (const d of l) {
    for (const u of d) {
      let m = r;
      for (const h of u)
        h.symbol ? et(t, h.text, m + i * 0.07, o + i * 0.03, i * 0.8, a) : t.fillText(h.text, m, o), m += h.width;
      o += i;
    }
    o += X.paragraphGap;
  }
}
function rt(t, e, r, o, n, s, a = !1, i = 1, l = "CardRenderer MTG Beleren", d = 0, u, m = "type") {
  if (!(n > 0)) throw Error("Magic title/type plate has no text space.");
  t.save(), t.font = `${a ? "bold " : ""}${s}px "${l}", Georgia`;
  const h = t.measureText(e).width;
  i > 1 && h * i > n && (i = 1), i !== 1 && (t.translate(r, 0), t.scale(i, 1), r = 0, n /= i), h > n && (s = Math.max(s * 0.78, s * n / h), t.font = `${a ? "bold " : ""}${s}px "${l}", Georgia`), dt(
    t,
    e,
    r,
    o,
    n,
    u,
    m,
    d > 0 ? () => N0(t, e, [r, o, n], s, d) : void 0
  ), t.restore();
}
function te(t, e, r, o, n, s, a, i, l = [0, 0, 1, 1]) {
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
  }[o ?? "common"];
  if (!u || ["forge", "glint"].includes(r?.toLowerCase() ?? "")) {
    t.drawImage(e, ...d, n, s, a, i);
    return;
  }
  const m = document.createElement("canvas");
  m.width = Math.max(1, Math.ceil(a * 2)), m.height = Math.max(1, Math.ceil(i * 2));
  const h = m.getContext("2d");
  h.drawImage(e, ...d, 0, 0, m.width, m.height), h.globalCompositeOperation = "source-in", h.fillStyle = u, h.fillRect(0, 0, m.width, m.height), t.drawImage(m, n, s, a, i), m.width = m.height = 0;
}
function Qr(t) {
  return /^[WUBRG]$/.test(t) ? `${J.MSE_TEMPLATE_ROOT}/magic-mana-future.mse-symbol-font/mana_${t.toLowerCase()}.png` : /^(?:[0-9]|1[0-9]|20|X)$/.test(t) ? `${J.CONJURER_ROOT}/img/manaSymbols/future/f0.png` : /^[WUBRG]\/[WUBRG]$/.test(t) ? `${J.CONJURER_ROOT}/img/manaSymbols/future/f${t.toLowerCase().replace("/", "")}.png` : null;
}
function H0(t) {
  const e = t.manaSymbols ?? [];
  return [
    .../* @__PURE__ */ new Set([
      ...e.map(Qr).filter((r) => r !== null),
      ...e.some((r) => /^(?:\d+|X)$/.test(r)) ? Un() : []
    ])
  ];
}
function Un() {
  return ["0", "1", "2", "3", "4", "5", "6", "x"].map(
    (t) => `${J.CONJURER_ROOT}/img/manaSymbols/future/f${t}.png`
  );
}
function X0(t, e, r) {
  const o = [91, 61, 46, 46, 59, 106], n = [140, 207, 281, 356, 437, 512], s = e.manaSymbols ?? [];
  if (s.length > o.length) throw Error("Futureshifted cost exceeds the six source positions");
  s.forEach((a, i) => {
    const l = ht(e) === "full-art" && i > 0 && i < 3, d = l || ht(e) === "regular" && i < 4, u = d ? /^[WUBRG]$/.test(a) ? 37.125 : 38.125 : 59 * 488 / 744, m = l ? [79.0376, 58.6102, 56.1465] : [78.1626, 59.4852, 51.6465, 51.6465], h = l ? [113.101, 161.7009, 217.5071] : [111.851, 154.0759, 202.5071, 252.3427], c = d ? m[i] - u / 2 : o[i] * 488 / 744, g = d ? h[i] - u / 2 : n[i] * 680 / 1039, f = Qr(a), b = f ? r.get(f) : void 0;
    if (f && !b) throw Error(`Futureshifted mana asset unavailable: ${f}`);
    b ? (t.drawImage(b, c, g, u, u), /^(?:\d+|X)$/.test(a) && (t.save(), t.translate(c + u / 2 - 0.75 * u / 38.125, g + u / 2 + 1.75 * u / 38.125), t.scale(0.9375, 1), t.font = `700 ${u * 31.25 / 38.125}px "CardRenderer MTG MPlantin"`, t.fillStyle = "#111", t.textAlign = "center", t.textBaseline = "middle", t.fillText(a, 0, 0, u * 0.73), t.restore())) : et(t, a, c, g, u, r, !1);
  });
}
const gs = J.MSE_TEMPLATE_ROOT, Ro = {
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
    art: [41, 15, 467, 345],
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
function fs(t) {
  const e = I(t);
  return /\bLand\b/.test(t.typeLine ?? "") || t.land ? (e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "c") + "l" : /\bArtifact\b/.test(t.typeLine ?? "") || t.artifact ? "a" : e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "c";
}
function xo(t) {
  if (!t.frameTemplate) return null;
  const e = t.frameTemplate, r = Ro[e];
  if (!r) throw Error("Unknown standard frame template");
  if (t.frameAssetFamily) throw Error("Choose one frame template or plate family");
  if (e === "future") return Zt(t);
  const o = `${gs}/${r.style}`, n = fs(e === "flip" ? t.faces?.[0] ?? t : t);
  if (e === "battle")
    return {
      kind: e,
      base: `${o}/cards/${n.replace(/l$/, "")}card.png`,
      defense: `${gs}/magic-modules.mse-include/loyalty/defense.png`,
      texture: `${o}/cards/texture/${n.replace(/l$/, "")}card.png`,
      border: `${o}/border.png`
    };
  const s = `${o}/${n}card.jpg`;
  if (e === "flip") {
    const a = t.faces?.[1] ?? t, i = t.faces?.[0] ?? t, l = fs(a);
    return {
      kind: e,
      base: s,
      reverse: `${o}/${l}card.jpg`,
      ...i.power != null && i.toughness != null ? { stats: `${o}/${n}pt.jpg`, statsMask: `${o}/mask_pt.png` } : {},
      ...a.power != null && a.toughness != null ? {
        reverseStats: `${o}/${l}pt2.jpg`,
        reverseStatsMask: `${o}/mask_pt2.png`
      } : {}
    };
  }
  throw Error("Unknown standard template asset branch");
}
function J0(t) {
  const e = xo(t);
  if (!e) return [];
  const { kind: r, ...o } = e;
  return [
    ...Object.values(o).filter((n) => typeof n == "string"),
    ...t.frameTemplate === "future" ? H0(t) : []
  ];
}
function K0(t) {
  if (!t.frameTemplate) return null;
  if (t.frameTemplate === "future") {
    const o = yo(t), n = (s) => [s[0] / 488, s[1] / 680, s[2] / 488, s[3] / 680];
    return {
      ...K,
      frame: [0, 0, 1, 1],
      title: n(o.title),
      art: n(o.art),
      type: n(o.type),
      rules: n(o.rules),
      stats: n(o.stats),
      footer: n(o.footer)
    };
  }
  const e = Ro[t.frameTemplate];
  if (!e) throw Error("Unknown standard frame template");
  const r = (o) => {
    const [n, s, a, i] = o, [l, d] = e.size;
    return t.frameTemplate === "battle" ? [s / d, 1 - (n + a) / l, i / d, a / l] : [n / l, s / d, a / l, i / d];
  };
  return {
    ...K,
    frame: [0, 0, 1, 1],
    title: r(e.title),
    art: r(e.art),
    type: r(e.type),
    rules: r(e.rules),
    stats: r(e.stats),
    footer: r(e.footer)
  };
}
function Nt(t) {
  return t.securityStamp !== void 0 ? t.securityStamp === "oval" : !ot(t) && t.frameAssetFamily !== "eighth" && ["rare", "mythic"].includes(t.rarity ?? "");
}
const li = `${B}/img/frames/m15/holoStamps/stamp.png`, Fr = 310.216, ps = {
  frame: [52, 20, 298, 449],
  title: [70, 40, 261, 26],
  art: [65, 76.5, 270, 183.8],
  type: [70, 265, 261, 23],
  rules: [74, 301, 255, 160],
  artistY: 0,
  legalY: 0
}, V0 = `${B}/img/frames/m15/split`, bs = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style", di = [
  `${bs}/namebox/texture/normal/c.png`,
  `${bs}/typebox/texture/normal/c.png`
], Eo = (t) => `${V0}${t.layout?.endsWith("-fuse") ? "/fuse" : ""}`;
function Ao(t) {
  const e = I(t);
  return `${Eo(t)}/${e.length > 1 ? "m" : e[0]?.toLowerCase() ?? "a"}.png`;
}
function ui(t) {
  const e = t.manaSymbols ?? [];
  return e.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !e.some((r) => /^[WUBRG]$/.test(r));
}
function mi(t) {
  const e = I(t);
  return [
    Ao(t),
    ...e.length === 2 ? e.map((r) => `${Eo(t)}/${r.toLowerCase()}.png`) : [],
    ...e.length === 2 && ui(t) ? di : [],
    ...Nt(t) ? [li] : []
  ];
}
const Me = /* @__PURE__ */ new Map(), fn = /* @__PURE__ */ new WeakMap();
let Z0 = 0, pn = 0;
const Q0 = (t) => (fn.has(t) || fn.set(t, ++Z0), fn.get(t));
function vr(t, e, r, o, n, s) {
  t.moveTo(e + s, r), t.lineTo(e + o - s, r), t.quadraticCurveTo(e + o + s * 0.25, r + n / 2, e + o - s, r + n), t.lineTo(e + s, r + n), t.quadraticCurveTo(e - s * 0.25, r + n / 2, e + s, r), t.closePath();
}
function tu(t, e) {
  const r = (g) => {
    const f = e.get(g);
    if (!f) throw Error(`Modern split asset unavailable: ${g}`);
    return f;
  }, o = r(Ao(t)), n = I(t);
  if (n.length !== 2) return o;
  "WUBRG".indexOf(n[1]) - "WUBRG".indexOf(n[0]) > 2 && n.reverse();
  const s = ui(t), a = [
    ...n.map((g) => r(`${Eo(t)}/${g.toLowerCase()}.png`)),
    ...s ? di.map(r) : [o]
  ], i = n.join("") + (s ? "-hybrid-" : "-gold-") + [o, ...a].map(Q0).join("/"), l = Me.get(i);
  if (l)
    return Me.delete(i), Me.set(i, l), l;
  const d = document.createElement("canvas");
  d.width = o.width, d.height = o.height;
  const u = d.getContext("2d");
  u.scale(d.width / 488, d.height / 680), u.translate(0, 680), u.rotate(-Math.PI / 2);
  const m = (g) => {
    u.save(), u.translate(680, 0), u.rotate(Math.PI / 2), u.drawImage(g, 0, 0, 488, 680), u.restore();
  }, h = t.layout?.endsWith("-fuse") ?? !1;
  m(o);
  for (const g of [0, Fr]) {
    if (u.save(), u.beginPath(), s ? u.rect(g + 50, 0, Fr, 488) : (vr(u, g + 57.5, 29, 286, 47, 9), u.rect(g + 64, 74, 273, h ? 362 : 394), vr(u, g + 57.5, 260, 286, 34, 7)), h)
      for (const [p, w] of [
        [29, 47],
        [260, 34]
      ])
        u.moveTo(334, p), u.lineTo(356, p + w / 2), u.lineTo(378, p), u.lineTo(378, p + w), u.lineTo(356, p + w / 2), u.lineTo(334, p + w), u.closePath();
    u.clip(), m(a[0]);
    const f = document.createElement("canvas");
    f.width = d.width, f.height = d.height;
    const b = f.getContext("2d");
    b.drawImage(a[1], 0, 0, f.width, f.height), b.globalCompositeOperation = "destination-in";
    const y = b.createLinearGradient(
      0,
      (680 - g - 175) / 680 * f.height,
      0,
      (680 - g - 230) / 680 * f.height
    );
    if (y.addColorStop(0, "#0000"), y.addColorStop(1, "#000"), b.fillStyle = y, b.fillRect(0, 0, f.width, f.height), u.save(), u.translate(680, 0), u.rotate(Math.PI / 2), u.drawImage(f, 0, 0, 488, 680), u.restore(), u.restore(), f.width = f.height = 0, u.save(), u.beginPath(), vr(u, g + 62.5, 34.5, 276, 37.5, 7), vr(u, g + 62.5, 265, 276, 24, 5), h)
      for (const [p, w] of [
        [35, 37],
        [265, 24]
      ])
        u.moveTo(332, p), u.lineTo(349, p + w / 2), u.lineTo(332, p + w), u.closePath(), u.moveTo(380, p), u.lineTo(363, p + w / 2), u.lineTo(380, p + w), u.closePath();
    u.clip(), s ? (u.drawImage(a[2], 22, 7, 196, 19, g + 62.5, 34.5, 276, 37.5), u.drawImage(a[3], 22, 192, 196, 11, g + 62.5, 265, 276, 24)) : m(a[2]), u.restore();
  }
  const c = d.width * d.height * 4;
  for (const [g, f] of Me) {
    if (pn + c <= 16 * 1024 * 1024) break;
    pn -= f.width * f.height * 4, Me.delete(g), f.width = f.height = 0;
  }
  return c <= 16 * 1024 * 1024 && (Me.set(i, d), pn += c), d;
}
function Se(t) {
  return ["split", "aftermath"].includes(t.layout ?? "") && t.faces?.length === 2 && (t.layout === "aftermath" || /^Aftermath\b/m.test(t.faces[1].rulesText ?? ""));
}
const ge = 373, hi = 257, ci = `${B}/img/frames/saga/stamp.png`;
function gi(t) {
  const e = I(t), r = e.length > 1 ? "m" : e[0]?.toLowerCase();
  if (!r) throw Error("No validated colorless Aftermath plate is available.");
  return `${B}/img/frames/m15/aftermath/${r}.png`;
}
function fi(t) {
  return Se(t) ? [
    ...t.faces.map(gi),
    ...Nt(t) ? [ci] : []
  ] : [];
}
const Lo = {
  title: [41.7, 35.5, 405, 37],
  art: [37.4, 76.5, 413.2, 151.8],
  type: [41.7, 235.8, 405, 37],
  rules: [41.7, 281.5, 405, 76]
}, Oo = {
  title: [12, 37.5, 227, 37],
  art: [11, 80.7, 240.9, 137.9],
  // Align the rotated type plate in its reading orientation (all type labels).
  type: [9, 226.2, 230, 37],
  rules: [14, 276.5, 232, 169]
};
function eu(t) {
  const e = t ? Oo : Lo, r = t ? hi : 488, o = t ? 488 : ge, n = (s) => {
    const [a, i, l, d] = e[s];
    return [a / r, i / o, l / r, d / o];
  };
  return {
    ...K,
    title: n("title"),
    art: n("art"),
    type: n("type"),
    rules: n("rules"),
    footer: [0, 1, 0, 0]
  };
}
const pi = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", ru = new Set("dis plc cmd pc2 dgm mma c13".split(" "));
function jt(t) {
  return t.layout !== "split" || t.faces?.length !== 2 || Se(t) || t.faces.some(
    (e) => !/^(Instant|Sorcery)\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "")
  ) ? null : ot({ ...t, layout: "normal", frameStyle: t.frameStyle ?? t.faces[0]?.frameStyle }) ? "old" : t.frameAssetFamily === "eighth" || ru.has(t.setCode?.toLowerCase() ?? "") ? "eighth" : "m15";
}
function _e(t) {
  const e = (r) => [
    r.rulesText ?? "",
    ...(r.rulesParagraphs ?? []).map((o) => o.runs.map((n) => n.text).join(""))
  ];
  return [t, ...t.faces ?? []].some((r) => e(r).some((o) => /^Fuse\b/m.test(o)));
}
const bi = 251 * 680 / 523, ys = 680 / 523, _r = 488 / 375, me = (t, e, r, o) => [
  t * ys,
  e * _r,
  r * ys,
  o * _r
];
function Ye(t, e) {
  if (t === "m15")
    return e ? { ...ps, rules: [74, 301, 255, 128] } : ps;
  const r = t === "old";
  return {
    frame: me(18, 18, e ? 244 : 236, 338),
    title: me(r ? 35 : 30, r ? 23 : 28, r ? 207 : 214, 21),
    art: r ? me(37, 47, 197, 130) : me(27, 56, 217, 152),
    type: me(r ? 35 : 30, r ? 182 : 211, 210, r ? 21 : 17),
    rules: r ? me(43, 207, 187, 109) : me(30, 233, 213, e ? 74 : 95),
    artistY: (r ? 332 : e ? 344 : 339) * _r,
    legalY: (r ? 347 : 354) * _r
  };
}
function nu(t) {
  const e = t.layout?.startsWith("split-old") ? "old" : t.layout?.startsWith("split-m15") ? "m15" : "eighth", r = e === "m15" ? Fr : bi, o = Ye(e, t.layout?.endsWith("-fuse") ?? !1), n = (s) => [
    s[0] / r,
    s[1] / 488,
    s[2] / r,
    s[3] / 488
  ];
  return {
    ...K,
    frame: n(o.frame),
    title: n(o.title),
    art: n(o.art),
    type: n(o.type),
    rules: n(o.rules),
    footer: [0, 1, 0, 0]
  };
}
function Wr(t, e, r, o) {
  if (e === "m15") return Ao(t);
  const n = I(t), s = n.length > 1 ? "m" : n[0]?.toLowerCase() ?? "c";
  return `${pi}/${e === "old" ? "magic-old-split" : r ? "magic-new-split-fuse" : "magic-new-split"}.mse-style/${s}card${r ? o + 1 : ""}.${r ? "png" : "jpg"}`;
}
function yi(t) {
  for (const e of [t, ...t.faces ?? []]) {
    const r = e.rulesParagraphs?.find(
      (n) => /^Fuse\b/.test(n.runs.map((s) => s.text).join(""))
    );
    if (r) return [r];
    const o = e.rulesText?.split(`
`).find((n) => /^Fuse\b/.test(n));
    if (o) return [{ role: "rules", runs: [{ text: o }] }];
  }
  return [];
}
const Cr = `${B}/img/frames/saga`, wi = [
  `${Cr}/sagaMaskPinline.png`,
  `${Cr}/sagaMaskBanner.png`,
  `${Cr}/sagaMaskBannerRight.png`,
  `${Cr}/sagaMidStripe.png`
];
function Si(t) {
  const e = I(t);
  return e.length !== 2 || t.layout === "transform" || t.land || /\bLand\b/.test(t.typeLine ?? "") ? [] : ("WUBRG".indexOf(e[1]) - "WUBRG".indexOf(e[0]) > 2 && e.reverse(), e.map(
    (r) => `${B}/data/images/cardImages/saga/sagaFrame${r}.png`
  ));
}
function ou(t) {
  const e = Si(t);
  return e.length ? [...e, ...wi] : [];
}
const ws = /* @__PURE__ */ new WeakMap();
function su(t, e, r) {
  const o = Si(e);
  if (!o.length) return;
  const n = [...o, ...wi].map((S) => {
    const v = r.get(S);
    if (!v) throw Error(`Saga color asset unavailable: ${S}`);
    return v;
  }), s = ws.get(n[0]);
  if (s && s.sources.every((S, v) => S === n[v])) {
    t.drawImage(s.canvas, 0, 0, 488, 680);
    return;
  }
  const [a, i, l, d, u, m] = n, h = document.createElement("canvas");
  h.width = a.width, h.height = a.height;
  const c = document.createElement("canvas");
  c.width = h.width, c.height = h.height;
  const g = document.createElement("canvas");
  g.width = h.width, g.height = h.height;
  const f = h.getContext("2d"), b = c.getContext("2d"), y = g.getContext("2d"), p = h.width, w = h.height;
  y.drawImage(l, 0, 0, p, w), y.drawImage(d, 0, 0, p, w), f.drawImage(a, 0, 0, p, w), f.globalCompositeOperation = "destination-in", f.drawImage(g, 0, 0), f.globalCompositeOperation = "source-over", y.clearRect(0, 0, p, w), y.save(), y.beginPath(), y.rect(p / 2, 0, p / 2, w), y.clip(), y.drawImage(l, 0, 0, p, w), y.restore(), y.drawImage(u, 0, 0, p, w), b.drawImage(i, 0, 0, p, w), b.globalCompositeOperation = "destination-in", b.drawImage(g, 0, 0), f.drawImage(c, 0, 0), f.drawImage(m, 0.0727 * p, 0.3058 * w, 87e-4 * p, 0.4762 * w), ws.set(a, { sources: n, canvas: h }), c.width = c.height = g.width = g.height = 0, t.drawImage(h, 0, 0, 488, 680);
}
const dr = `${B}/img/frames/saga`;
function $o(t) {
  const e = I(t), r = e.length > 1 ? "M" : e[0];
  if (/\bLand\b/.test(t.typeLine ?? "") || t.land) return `${dr}/regular/l.png`;
  if (t.layout === "transform" && r) return `${dr}/dfc/${r.toLowerCase()}.png`;
  if (r) return `${B}/data/images/cardImages/saga/sagaFrame${r}.png`;
  throw Error("No ordinary colorless or artifact Saga plate is available.");
}
function jn(t) {
  return t.layout === "transform" && t.setCode?.toLowerCase() === "neo" ? `${B}/img/frames/m15/transform/icons/fanClosed.svg` : null;
}
const vi = `${dr}/sagaChapter.png`, Ci = `${dr}/sagaDivider.png`, fr = `${dr}/stamp.png`, Ut = {
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
function au(t) {
  return [
    $o(t),
    ...ou(t),
    vi,
    Ci,
    ...jn(t) ? [jn(t)] : [],
    ...Nt(t) ? [fr] : []
  ];
}
const ki = {
  ...K,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.5007, 0.1134, 0.4233, 0.724],
  type: [0.0854, 0.8481, 0.8292, 0.0543],
  rules: [0.0867, 0.1129, 0.404, 0.7248],
  stamp: [0.17, 0.48, 0.23, 0.16506]
}, ye = `${B}/img/frames/adventure/regular`, Ti = `${ye}/bookLeft.png`, Mi = `${ye}/pinline.svg`, Ri = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style/namebox/texture/normal/c.png", pr = (t) => t.layout === "adventure" && t.faces?.length === 2;
function Vt(t) {
  const e = t.manaSymbols ?? [];
  return I(t).length === 2 && e.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !e.some((r) => /^[WUBRG]$/.test(r));
}
function Bo(t) {
  const e = _(t), r = I(t);
  return e.land ? "l" : e.artifact ? "a" : r.length > 1 ? "m" : r[0]?.toLowerCase() ?? "a";
}
const Ur = (t) => `${ye}/${Bo(t)}.png`;
function Io(t) {
  const e = Vt(t) ? "W" : Bo(t).toUpperCase();
  return `${B}/img/frames/m15/regular/m15PT${e === "L" ? "C" : e}.png`;
}
const xi = (t) => `${B}/img/frames/m15/crowns/m15Crown${Bo(t).toUpperCase()}.png`;
function Ei(t) {
  const e = t.faces?.[1];
  if (!pr(t) || !e) throw Error("Adventure needs a permanent and an inset spell.");
  const r = (o) => {
    const n = I(o);
    return [
      Ur(o),
      ...n.length === 2 ? n.map((s) => `${ye}/${s.toLowerCase()}.png`) : []
    ];
  };
  return [
    .../* @__PURE__ */ new Set([
      ...r(t),
      ...r(e),
      Ti,
      ...I(t).length === 2 && !Vt(t) ? [Mi] : [],
      ...Vt(t) ? [Ri] : [],
      ..._(t).legendary ? [xi(t)] : [],
      ...t.power != null && t.toughness != null ? [Io(t)] : [],
      ...Nt(t) ? [fr] : []
    ])
  ];
}
const Go = {
  ...K,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.5267, 0.65, 0.3867, 0.2647],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.58, 0.74, 0.25, 0.1794]
}, tn = `${B}/img/frames/prepare/regular`, en = (t) => t.layout === "prepare";
function qe(t) {
  if (t.faces?.length !== 2) throw Error("Prepared needs a creature and an inset spell.");
  return t.faces[1];
}
function Po(t) {
  const e = _(t), r = I(t);
  if (e.land) return "l";
  if (/\bVehicle\b/.test(t.typeLine ?? "")) return "v";
  if (e.artifact) return "a";
  if (r.length > 1) return "m";
  if (r.length) return r[0].toLowerCase();
  throw Error("The pinned Prepared source has no colorless plate.");
}
const $e = (t) => `${tn}/${Po(t)}.png`, Er = (t) => `${tn}/${t}.png`;
function Oe(t) {
  const e = I(t);
  return e.length === 2 && "WUBRG".indexOf(e[1]) - "WUBRG".indexOf(e[0]) > 2 && e.reverse(), e;
}
const Nn = (t) => `${B}/img/frames/m15/crowns/m15Crown${t.toUpperCase()}.png`, iu = (t) => Io(t);
function Ai(t) {
  const e = qe(t), r = (n) => Oe(n).length === 2 ? Oe(n).map((s) => `${tn}/${s.toLowerCase()}.png`) : [], o = Oe(t);
  return [
    .../* @__PURE__ */ new Set([
      $e(t),
      $e(e),
      Er("prepare"),
      ...r(t),
      ...r(e),
      ...o.length === 2 ? ["pinline", "rules", "rulesRight"].map(Er) : [],
      ...Oe(e).length === 2 ? ["prepareRight", "prepareTypeTitle"].map(Er) : [],
      ..._(t).legendary ? (o.length === 2 ? o : [Po(t)]).map(Nn) : [],
      ...t.power != null && t.toughness != null ? [iu(t)] : [],
      ...Nt(t) ? [fr] : []
    ])
  ];
}
const Fo = {
  ...K,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.086, 0.6303, 808 / 2010, 0.2875],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.17, 0.72, 0.25, 0.1794]
}, lu = {
  title: [1042 / 2010, 0.6391, 0.4, 0.0296],
  type: [1042 / 2010, 1932 / 2814, 0.4, 0.0296],
  rules: [1035 / 2010 + 2 / 488, 2059 / 2814, 0.3947, 438 / 2814]
}, du = [
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
], oe = 0.91339 * k / 768, Dn = 0.04724 * k, zn = 0.02655 * E;
function uu(t) {
  return [
    (Dn + 20 * oe) / k,
    (zn + 84 * oe) / E,
    728 * oe / k,
    ((t ? 541 : 622) - 84) * oe / E
  ];
}
function mu(t, e) {
  const r = du[e ? 1 : 0];
  t.beginPath(), r.forEach(([o, n], s) => {
    const a = Dn + (n - 1) * oe, i = zn + o * oe;
    s === 0 ? t.moveTo(a, i) : t.lineTo(a, i);
  });
  for (let o = r.length - 1; o >= 0; o--) {
    const [n, s] = r[o];
    t.lineTo(Dn + (769 - s) * oe, zn + n * oe);
  }
  t.closePath(), t.clip();
}
function br(t) {
  const e = t.layout === "saga" || /\bSaga\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "");
  return (e ? (t.rulesText ?? "").replace(/\|(?=\s*[IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*\s*[—–-]\s)/g, `
`) : t.rulesText ?? "").split(`
`).filter((o) => o.trim()).map((o) => {
    const n = e ? o.match(/^\s*([IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*)\s*[—–-]\s*(.+)$/) : null;
    if (n)
      return { text: n[2], badges: n[1].split(/\s*,\s*/), reminder: !1 };
    const s = e ? null : o.match(/^\s*\[?([+−-]?(?:\d+|X))\]?\s*:\s*(.*)$/i);
    return s ? {
      text: s[2],
      badges: [s[1].replace("-", "−").toUpperCase()],
      reminder: !1
    } : { text: o, badges: [], reminder: e && /^\s*\(/.test(o) };
  });
}
function tt(t) {
  return t.layout === "ability" ? "normal" : t.layout === "prepare" ? "prepare" : t.layout === "adventure" && t.faces?.length === 2 ? "adventure" : t.layout === "class" || /\bClass\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "class" : t.layout === "leveler" || /^Level up\b/m.test(t.rulesText ?? "") ? "leveler" : t.layout === "saga" || /\bSaga\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? "saga" : t.layout === "planeswalker" || /\bPlaneswalker\b/i.test(t.canonicalTypeLine ?? t.typeLine ?? "") ? br(t).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function Pt(t) {
  const e = K0(t);
  if (e) return e;
  if (t.layout === "aftermath-top" || t.layout === "aftermath-bottom")
    return eu(t.layout === "aftermath-bottom");
  if (/^split-(old|eighth|m15)(-fuse)?$/.test(t.layout ?? "")) return nu(t);
  const r = kt(t);
  if (r) return r.rects;
  if (ot(t)) return mo(t);
  const o = tt(t);
  if (o === "adventure") return Go;
  if (o === "prepare") return Fo;
  if (o === "class")
    return {
      ...K,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (o === "saga") return ki;
  if (o.startsWith("planeswalker")) {
    const n = o === "planeswalker-large", s = [
      0.04409,
      n ? 0.55118 : 0.62655,
      0.88827,
      n ? 0.37534 : 0.29997
    ], a = K.stamp[2], i = K.stamp[3];
    return {
      ...K,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, 0.92126 * k * 3793 / 2778 / E],
      frame: [0.04724, 0.02655, 0.91339, 0.91339 * k * 3810 / 2736 / E],
      art: uu(n),
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / k,
        (n ? 0.49044 : 0.55793) + 5 / E,
        0.88662,
        0.05737
      ],
      rules: s,
      stats: [0.792 + 1 / k, 0.881 - 3 / E, 0.16, 0.069],
      stamp: [
        s[0] + (s[2] - a) / 2,
        s[1] + (s[3] - i) / 2,
        a,
        i
      ]
    };
  }
  return t.layout === "split-half" ? {
    ...K,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : { ...K, art: r0(t) };
}
function hu(t) {
  const e = tt(t) === "saga", r = Pt(t).rules, o = br(t), n = r[2] * 488 - (e ? 32 : 70), s = r[3] * 680;
  let a = e ? 21 : 19;
  const i = (b, y) => Math.max(1, Math.ceil(b.length * y * 0.49 / n)), l = (b, y) => Math.max(e ? b.badges.length * 36 : 34, i(b.text, y) * y + 16), d = (b) => o.reduce((y, p) => y + l(p, b), 0);
  for (; a > 8 && d(a) > s; ) a -= 0.5;
  const u = o.map((b) => l(b, a)), m = Math.max(0, s - d(a)) / Math.max(1, o.length);
  let h = s / Math.max(1, o.length), c = s, g = o.length;
  if (!e)
    for (const b of [...u].sort((y, p) => p - y)) {
      if (b <= h) break;
      c -= b, h = c / Math.max(1, --g);
    }
  let f = 0;
  return o.map((b, y) => {
    const p = e ? u[y] + m : Math.max(h, u[y]), w = { ...b, top: f, height: p, font: a, left: e ? 27 : 62, width: n };
    return f += p, w;
  });
}
const _o = {
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
function cu(t, e) {
  if (e.watermark) return e.watermark;
  if (t.watermark) return t.watermark;
  const r = [...new Set(t.faces?.map((s) => s.watermark).filter(Boolean))];
  if (r.length !== 1) return e.watermark;
  const o = _o[r[0]], n = new Set(t.faces?.flatMap(I));
  return o && n.size === 2 && o.every((s) => n.has(s)) ? r[0] : e.watermark;
}
function Yn(t) {
  return t.watermark && Object.hasOwn(_o, t.watermark) ? `${B}/img/watermarks/guild-${t.watermark}.svg` : null;
}
function Li(t, e) {
  return `${pi}/magic-new-split${t ? "-fuse" : ""}.mse-style/multicolor_blend_card${t ? e + 1 : ""}.png`;
}
function gu(t, e, r, o) {
  if (e === "m15") return [...mi(t), Yn(t)];
  const n = I(t);
  return [
    Wr(t, e, r, o),
    Yn(t),
    ...e === "eighth" && n.length === 2 ? [
      Li(r, o),
      ...n.map(
        (s) => Wr({ ...t, colors: [s], frameColors: void 0 }, e, r, o)
      )
    ] : [],
    ...e === "eighth" && t.artist ? [`${B}/img/manaSymbols/brush.svg`] : []
  ];
}
const Ss = /* @__PURE__ */ new WeakMap();
function Oi(t) {
  const e = Ss.get(t);
  if (e) return e;
  const r = document.createElement("canvas");
  r.width = t.width, r.height = t.height;
  const o = r.getContext("2d", { willReadFrequently: !0 });
  o.drawImage(t, 0, 0);
  const n = o.getImageData(0, 0, r.width, r.height);
  for (let s = 0; s < n.data.length; s += 4) n.data[s + 3] = n.data[s];
  return o.putImageData(n, 0, 0), Ss.set(t, r), r;
}
const vs = /* @__PURE__ */ new WeakMap();
function fu(t, e, r, o, n) {
  const s = (w) => {
    const S = n.get(w);
    if (!S) throw Error(`Split asset unavailable: ${w}`);
    return S;
  }, a = s(Wr(t, e, r, o)), i = I(t);
  if (e !== "eighth" || i.length !== 2) return a;
  "WUBRG".indexOf(i[1]) - "WUBRG".indexOf(i[0]) > 2 && i.reverse();
  const [l, d] = i.map(
    (w) => s(
      Wr({ ...t, colors: [w], frameColors: void 0 }, e, r, o)
    )
  ), u = s(Li(r, o)), m = i.join(""), h = vs.get(a) ?? /* @__PURE__ */ new Map();
  vs.set(a, h);
  const c = h.get(m);
  if (c?.left === l && c.right === d && c.mask === u) return c.canvas;
  const g = document.createElement("canvas");
  g.width = a.width, g.height = a.height;
  const f = document.createElement("canvas");
  f.width = a.width, f.height = a.height;
  const b = g.getContext("2d"), y = f.getContext("2d");
  y.drawImage(d, 0, 0), y.globalCompositeOperation = "destination-in";
  const p = y.createLinearGradient(0, 0, a.width, 0);
  return p.addColorStop(0, "#0000"), p.addColorStop(0.4, "#0000"), p.addColorStop(0.6, "#000"), p.addColorStop(1, "#000"), y.fillStyle = p, y.fillRect(0, 0, a.width, a.height), b.drawImage(l, 0, 0), b.drawImage(f, 0, 0), b.globalCompositeOperation = "destination-in", b.drawImage(Oi(u), 0, 0), b.globalCompositeOperation = "destination-over", b.drawImage(a, 0, 0), b.globalCompositeOperation = "source-over", f.width = f.height = 0, h.set(m, { left: l, right: d, mask: u, canvas: g }), g;
}
const Cs = /* @__PURE__ */ new WeakMap();
function pu(t, e, r, o) {
  const n = Yn(e);
  if (!n) return;
  const s = r.get(n);
  if (!s) throw Error(`Split watermark unavailable: ${n}`);
  const a = I(e), i = a.length === 1 ? [a[0], a[0]] : _o[e.watermark], l = i.join(""), d = Cs.get(s) ?? /* @__PURE__ */ new Map();
  Cs.set(s, d);
  let u = d.get(l);
  if (!u) {
    u = document.createElement("canvas"), u.width = s.width, u.height = s.height;
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
  const m = e.layout?.startsWith("split-m15") ?? !1, h = Math.min(
    (m ? 135 : 110) / s.width,
    (m ? 125 : e.setCode?.toLowerCase() === "dgm" ? 75 : 100) / s.height
  ), c = s.width * h, g = s.height * h;
  t.save(), t.globalAlpha = 0.3, t.drawImage(u, (m ? 199.5 : 177) - c / 2, o - g / 2, c, g), t.restore();
}
function $t(t) {
  if (t.frameTemplate) return [];
  if (!["split", "aftermath"].includes(t.layout ?? "") || t.faces?.length !== 2) return [];
  const e = Se(t), r = jt(t), o = r === "m15" ? Fr : bi;
  return t.faces.map((n, s) => {
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
      ...n,
      watermark: r ? cu(t, n) : n.watermark,
      layout: e ? s === 0 ? "aftermath-top" : "aftermath-bottom" : r ? `split-${r}${_e(t) && r !== "old" ? "-fuse" : ""}` : "split-half",
      frameAssetFamily: void 0,
      faces: void 0,
      rulesText: n.rulesText?.split(`
`).filter((l) => !/^Fuse\b/.test(l)).join(`
`),
      rulesParagraphs: n.rulesParagraphs?.filter(
        (l) => !/^Fuse\b/.test(l.runs.map((d) => d.text).join(""))
      ),
      illustration: n.illustration ?? t.illustration,
      etchedIllustration: n.etchedIllustration ?? (n.illustration ? void 0 : t.etchedIllustration),
      illustrationCrop: n.illustrationCrop ?? (!n.illustration && t.illustration ? [s ? a : 0, 0, s ? 1 - a : a, 1] : void 0)
    };
    return e ? s === 0 ? { face: i, x: 0, y: 0, width: 488, height: ge, rotation: 0 } : {
      face: i,
      x: 488,
      y: ge,
      width: hi,
      height: 488,
      rotation: 90
    } : r ? {
      face: i,
      x: 0,
      y: 680 - s * o,
      width: o,
      height: 488,
      rotation: -90
    } : {
      face: i,
      x: 5,
      y: (s ? 333 : 648) - (Wo(t) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function hf(t) {
  return {
    left: `${t.x / k * 100}%`,
    top: `${t.y / E * 100}%`,
    width: `${t.width / k * 100}%`,
    height: `${t.height / E * 100}%`,
    transform: `rotate(${t.rotation}deg)`
  };
}
function $i(t, e) {
  t.translate(e.x, e.y), t.rotate(e.rotation * Math.PI / 180), t.scale(e.width / k, e.width / k);
}
function ks(t, e) {
  const r = e[0] * t.width, o = e[1] * t.height, n = e[2] * t.width, s = e[3] * t.height;
  return t.rotation === -90 ? [
    (t.x + o) / k,
    (t.y - r - n) / E,
    s / k,
    n / E
  ] : t.rotation === 90 ? [
    (t.x - o - s) / k,
    (t.y + r) / E,
    s / k,
    n / E
  ] : [(t.x + r) / k, (t.y + o) / E, n / k, s / E];
}
function bu(t) {
  return t.layout === "split-half" || t.layout === "aftermath-bottom" ? 1.5 : 1;
}
const Wo = _e;
function We(t) {
  if (ot(t) || t.frameAssetFamily === "eighth" || t.frameTemplate === "future" || t.frameTemplate === "flip")
    return !1;
  const e = jt(t);
  return !e || e === "m15" || Se(t);
}
function yu(t) {
  if (!We(t)) return { shared: [], stock: [] };
  const e = (o) => ({ shared: [], stock: o });
  if (t.frameAssetFamily === "m15-accurate") {
    const o = kt(t);
    return e(
      o ? [o.frame, ...o.rightFrame ? [o.rightFrame] : [], o.border] : []
    );
  }
  if (t.frameTemplate === "battle") {
    const o = xo(t);
    return e(o?.kind === "battle" ? [o.border] : []);
  }
  if (pr(t))
    return e(
      Vt(t) ? I(t).map((o) => `${ye}/${o.toLowerCase()}.png`) : [Ur(t)]
    );
  if (en(t)) return e([$e(t)]);
  if (Se(t))
    return e(fi(t).filter((o) => o.includes("/aftermath/")));
  if (jt(t) === "m15")
    return e(
      $t(t).flatMap(
        (o) => mi(o.face).filter((n) => /\/[wubrgma]\.png$/.test(n))
      )
    );
  if (tt(t) === "saga") return e([$o(t)]);
  const r = we(_(t), tt(t));
  return {
    shared: [
      r.frame,
      r.background,
      r.boxes,
      r.pt,
      ..._(t).legendary ? [r.crown] : []
    ],
    stock: []
  };
}
const wu = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Su = "#16130e", vu = [22 / 255, 19 / 255, 14 / 255];
function Uo(t) {
  const e = se(t), r = e.calibration, o = { ...e }, n = typeof r == "object";
  if (n && !We(e))
    throw Error("M21 calibration requires a modern frame.");
  const s = e.frameAssetFamily ? kt(o) : null, a = r === "source" ? void 0 : (s ? De(o, s.frame) : void 0) ?? W0(o), i = r === "source" ? {} : cs(o), l = n ? {} : { ...i }, d = [];
  let u = n ? void 0 : a, m = !1;
  if ((r === "auto" || n) && We(e)) {
    const h = yu(e), c = _(e), g = {
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
    }, f = new Set(h.shared);
    for (const [b, y] of Object.entries(cs(g)))
      !f.has(b) || l[b] || (l[b] = y, d.push(b));
    if (!u && Bt(e.setCode, e.borderColor).border === "#090806") {
      u = Su, m = !0;
      for (const b of h.stock)
        l[b] = { ...l[b] ?? wu, outerStock: vu };
    }
  }
  return {
    face: e,
    materials: l,
    measured: i,
    border: u,
    fallbackStock: m,
    fallbackAssets: d,
    assets: we(_(e)),
    explicitProfile: n
  };
}
const Bi = (t) => Uo(t).materials, Tt = (t) => Uo(t).border, Ii = (t, e) => {
  const r = se(t);
  return r.calibration === "source" ? void 0 : si(r, e);
};
function jo(t, e, r = 1, o = 1) {
  const n = t.illustrationPlacement;
  if (!n) return e;
  if (!n.every(Number.isFinite) || n[2] <= 0 || n[3] <= 0)
    throw Error("Artwork placement requires finite coordinates and positive dimensions");
  return [n[0] * r, n[1] * o, n[2] * r, n[3] * o];
}
function jr(t, e, r, o) {
  return to(t, e, r, o);
}
function Cu(t, e, r, o, n) {
  const s = [o[0] * t, o[1] * e, o[2] * t, o[3] * e];
  return [...s, ...jr(s[2], s[3], r, n)];
}
function Gi(t) {
  return t.faces?.length || t.layout && !["normal", "token", "transform", "modal_dfc", "reversible_card", "meld"].includes(
    t.layout
  ) || t.frameTemplate && t.frameTemplate !== "future" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? "") ? {
    modes: [],
    reason: "Art placement currently requires an ordinary physical face or Futureshifted template."
  } : {
    modes: t.frameTemplate === "future" && t.futureTreatment !== "full-art" ? ["window", "behind-text"] : ["window"]
  };
}
function No(t) {
  const e = t.artPlacement;
  if (e !== void 0) {
    if (!e || typeof e != "object" || Array.isArray(e))
      throw Error("Invalid artwork placement");
    if (Object.keys(e).some((r) => !["mode", "focalPoint", "zoom", "paperOpacity"].includes(r)))
      throw Error("Unknown artwork placement option");
    if (!Gi(t).modes.includes(e.mode))
      throw Error("This frame does not support the selected art placement.");
    if (e.paperOpacity !== void 0 && (e.mode !== "behind-text" || !Number.isFinite(e.paperOpacity) || e.paperOpacity < 0 || e.paperOpacity > 1))
      throw Error("Paper opacity requires behind-text mode and a value within 0..1");
    to(1, 1, [0, 0, 1, 1], e);
  }
}
function ku(t, e) {
  const { illustrationPlacement: r, ...o } = t, n = { ...o, artPlacement: structuredClone(e) };
  return No(n), n;
}
function cf(t, e, r) {
  if (No(t), !Number.isFinite(e) || !Number.isFinite(r) || e <= 0 || r <= 0)
    throw Error("Artwork dimensions must be positive");
  const o = t.illustrationCrop ?? [0, 0, 1, 1], n = Pt(t).art, s = jo(t, n), a = to(
    e * o[2],
    r * o[3],
    [s[0] * 488, s[1] * 680, s[2] * 488, s[3] * 680],
    t.artPlacement
  );
  return {
    source: o,
    destination: [a[0] / 488, a[1] / 680, a[2] / 488, a[3] / 680],
    aperture: n
  };
}
const Ar = {
  fontSize: 19.5,
  fontFamily: '"CardRenderer MTG Beleren", Georgia',
  fontWeight: 700,
  ink: "#fff",
  numeralOffsetX: -0.5,
  numeralOffsetY: { plus: -0.25, zero: -3.25, minus: -4.5 },
  horizontalInset: 10,
  widthScale: 0.97
};
function Tu(t, e, [r, o, n, s]) {
  Pi(t, e, 24, r + n / 2, o + s / 2 + 2.5, n * 0.72);
}
function Mu(t, e, [r, o, n, s]) {
  const a = Ar, i = a.numeralOffsetY[e.startsWith("+") ? "plus" : e === "0" ? "zero" : "minus"];
  Pi(
    t,
    e,
    a.fontSize,
    r + n / 2 + a.numeralOffsetX,
    o + s / 2 + i,
    n - a.horizontalInset,
    a.widthScale
  );
}
function Pi(t, e, r, o, n, s, a = 1) {
  t.save(), t.fillStyle = Ar.ink, t.font = `${Ar.fontWeight} ${r}px ${Ar.fontFamily}`, t.textAlign = "center", t.textBaseline = "alphabetic", t.letterSpacing = "0px", t.shadowColor = "transparent";
  const i = t.measureText(e), l = Math.min(s, i.width * a), d = Math.min(1, l / Math.max(1, i.width)), u = o + (i.actualBoundingBoxLeft - i.actualBoundingBoxRight) * d / 2, m = n + (i.actualBoundingBoxAscent - i.actualBoundingBoxDescent) / 2;
  t.fillText(e, u, m, l), t.restore();
}
function qn(t, e) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.letterSpacing = "0px", t.fillStyle = Bt(e.setCode, e.borderColor).ink, t.textBaseline = "alphabetic", t.textAlign = "left", t.font = '11px "CardRenderer MTG Relay", sans-serif', H(
    t,
    e,
    "collector",
    () => t.fillText(oo(e), 30, 645)
  );
  const r = (e.collectorSetCode ?? e.setCode)?.trim().toUpperCase() ?? "", o = r ? `${r} • ${e.collectorLanguage?.toUpperCase() ?? "EN"}` : "";
  H(t, e, "collector", () => t.fillText(o, 30, 658));
  const n = no(e), s = e.power != null && e.toughness != null || e.loyalty != null;
  let a = 30 + t.measureText(o).width + (o ? 7 : 0);
  H(t, e, "artist", () => {
    e.artist && (t.font = '11px "CardRenderer MTG Artist Credit", sans-serif', t.fillText("a", a, 658), a += t.measureText("a").width + 2, t.font = '700 11px "CardRenderer MTG Beleren Small Caps", Georgia', t.fillText(e.artist, a, 658, Math.max(1, (n && s ? 272 : 456) - a)));
  }), n && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', H(t, e, "legal", () => t.fillText(n, 456, s ? 658 : 645, 178))), t.restore();
}
const Ts = /* @__PURE__ */ new WeakMap();
function Ru(t) {
  const e = Ts.get(t);
  if (e) return e;
  const r = document.createElement("canvas");
  r.width = r.height = 16;
  try {
    const o = r.getContext("2d", { willReadFrequently: !0 });
    o.drawImage(t, 0, 0, 16, 16);
    const n = o.getImageData(0, 0, 16, 16).data, s = [[], [], []];
    for (let i = 0; i < 16; i++)
      for (let l = 0; l < 16; l++) {
        if (l > 0 && l < 15 && i > 0 && i < 15) continue;
        const d = (i * 16 + l) * 4;
        n[d + 3] < 128 || s.forEach((u, m) => u.push(n[d + m]));
      }
    const a = `rgb(${s.map((i) => i.sort((l, d) => l - d)[Math.floor(i.length / 2)] ?? 128).join(" ")})`;
    return Ts.set(t, a), a;
  } finally {
    r.width = r.height = 0;
  }
}
function Ft(t, e, r, o, n) {
  const [s, a, i, l] = o, d = tt(e);
  if (t.save(), d.startsWith("planeswalker") && mu(t, d === "planeswalker-large"), n === "printing") {
    t.clearRect(s, a, i, l), t.restore();
    return;
  }
  const u = r.get(e.illustration ?? "");
  if ((n === "artwork" || d.startsWith("planeswalker") || e.illustrationPlacement) && (t.fillStyle = u && e.illustrationPlacement ? Ru(u) : "#80745c", t.fillRect(s, a, i, l)), !u) {
    t.restore();
    return;
  }
  t.beginPath(), t.rect(s, a, i, l), t.clip();
  const m = jo(e, o, 488, 680);
  e.illustrationCrop ? t.drawImage(
    u,
    ...Cu(
      u.width,
      u.height,
      m,
      e.illustrationCrop,
      e.artPlacement
    )
  ) : t.drawImage(
    u,
    ...jr(u.width, u.height, m, e.artPlacement)
  ), t.restore();
}
const Ms = /* @__PURE__ */ new WeakMap();
function Lr(t) {
  const e = Ms.get(t);
  if (e) return e;
  const r = document.createElement("canvas");
  r.width = t.width, r.height = t.height;
  const o = r.getContext("2d", { willReadFrequently: !0 });
  o.drawImage(t, 0, 0);
  const n = o.getImageData(0, 0, r.width, r.height);
  for (let s = 0; s < n.data.length; s += 4)
    n.data[s + 3] = Math.round(n.data[s] * n.data[s + 3] / 255), n.data[s] = n.data[s + 1] = n.data[s + 2] = 255;
  return o.putImageData(n, 0, 0), Ms.set(t, r), r;
}
function xu(t) {
  const e = ht(t) === "full-art", r = _(t), o = !e && (r.land || ht(t) === "regular" && !r.artifact && I(t).length === 0), [n, s, a, i] = e ? [0.9967, 0.9995, -2.125, -0.85] : o ? [0.9976, 0.997, -1.925, -0.3] : [0.9867, 0.9929, 0, -0.175], l = e || o ? [0, 680] : [0, 85, 370, 385, 416, 430, 610, 680], d = e || o ? [0, 0] : [0, 0, 1, 1, 1.45, 1.45, 0, 0];
  return {
    sx: n,
    tx: a,
    source: l,
    target: l.map((u, m) => 340 + (u - 340) * s + i + d[m])
  };
}
function Eu(t, e) {
  const r = document.createElement("canvas");
  r.width = t.width, r.height = t.height;
  const o = r.getContext("2d"), n = xu(e), s = t.height / 680;
  try {
    for (let a = 0; a < n.source.length - 1; a++) {
      const i = n.source[a], l = n.source[a + 1], d = n.target[a], u = n.target[a + 1], m = (u - d) / (l - i), h = Math.round(d * s), c = Math.round(u * s);
      o.save(), o.beginPath(), o.rect(0, h, r.width, c - h), o.clip(), o.transform(
        n.sx,
        0,
        0,
        m,
        (244 * (1 - n.sx) + n.tx) * s,
        (d - m * i) * s
      ), o.drawImage(t, 0, 0), o.restore();
    }
    return r;
  } catch (a) {
    throw r.width = r.height = 0, a;
  }
}
function ur(t, e) {
  const r = document.createElement("canvas");
  return r.width = t, r.height = e, r;
}
function Au(t, e) {
  const r = ur(t.width, t.height), o = r.getContext("2d"), n = ur(t.width, t.height), s = n.getContext("2d");
  for (const [a, i] of [t, e].entries()) {
    s.clearRect(0, 0, n.width, n.height), s.globalCompositeOperation = "source-over", s.drawImage(i, 0, 0, n.width, n.height);
    const l = s.createLinearGradient(n.width * 0.4, 0, n.width * 0.6, 0);
    l.addColorStop(0, a ? "#0000" : "#000"), l.addColorStop(1, a ? "#000" : "#0000"), s.globalCompositeOperation = "destination-in", s.fillStyle = l, s.fillRect(0, 0, n.width, n.height), o.globalCompositeOperation = "lighter", o.drawImage(n, 0, 0);
  }
  return n.width = n.height = 0, r;
}
function Lu(t, e) {
  const r = Zt(t), o = ur(976, 1360), n = o.getContext("2d"), s = (l) => {
    const d = e.get(l);
    if (!d) throw Error(`Futureshifted frame asset unavailable: ${l}`);
    return d;
  }, a = (l, d, u, m) => {
    if (!d) return s(l);
    const h = Au(s(l), s(d));
    if (u && m) {
      const c = h.getContext("2d");
      c.globalCompositeOperation = "destination-in", c.drawImage(Lr(s(m)), 0, 0, h.width, h.height), c.globalCompositeOperation = "destination-over", c.drawImage(s(u), 0, 0, h.width, h.height);
    }
    return h;
  }, i = (l, d, u, m, h) => {
    n.drawImage(l, d, u, m, h), l instanceof HTMLCanvasElement && (l.width = l.height = 0);
  };
  try {
    if (n.scale(976 / 375, 1360 / 523), i(
      a(r.base, r.reverseBase, r.neutralBase, r.baseBlend),
      0,
      0,
      375,
      523
    ), r.mask) {
      n.save(), n.globalCompositeOperation = "destination-out";
      const l = ht(t) === "full-art";
      if (!l && ht(t) !== "clear") {
        const [, c, , g] = yo({ ...t, artPlacement: void 0 }).art;
        n.beginPath(), n.rect(0, c * 523 / 680, 375, g * 523 / 680), n.clip();
      }
      const [d, u, m, h] = l ? [37, 46, 322, 418] : [32, 44, 327, 310];
      n.drawImage(Lr(s(r.mask)), d, u, m, h), n.restore();
    }
    if (r.paper && i(a(r.paper, r.reversePaper), 23, 320, 335, 152), r.type && i(
      a(r.type, r.reverseType, r.neutralType, r.typeBlend),
      18,
      17,
      339,
      464
    ), t.artPlacement?.mode === "behind-text") {
      n.save(), n.globalCompositeOperation = "destination-out", n.globalAlpha = 1 - (t.artPlacement.paperOpacity ?? 0.8);
      const l = new Path2D("M33 326 C25 350 22 413 37 465 L337 465 C351 450 354 379 344 326 Z");
      n.fill(l), n.restore();
    }
    if (r.stats)
      if (r.statsMask) {
        const l = ur(156, 102), d = l.getContext("2d");
        d.drawImage(s(r.stats), 0, 0, 156, 102), d.globalCompositeOperation = "destination-in", d.drawImage(Lr(s(r.statsMask)), 0, 0, 156, 102), i(l, 279, 454, 78, 51);
      } else r.paper ? n.drawImage(s(r.stats), 285, 452, 70, 52) : n.drawImage(s(r.stats), 375 * 0.7621, 523 * 0.8834, 375 * 0.1734, 523 * 0.0781);
    return Eu(o, t);
  } finally {
    o.width = o.height = 0;
  }
}
function Ou(t, e) {
  const r = ur(t.width, t.height), o = r.getContext("2d");
  return o.fillStyle = "white", ht(e) === "clear" || e.artPlacement?.mode === "behind-text" ? o.fillRect(46, 44, 442 * 2, 637 * 2) : (o.fillRect(48, 160, 444 * 2, (ht(e) === "full-art" ? 482 : 303) * 2), o.globalCompositeOperation = "destination-out", o.drawImage(t, 0, 0)), r;
}
const Hn = (t, e = !1) => `${e ? "italic " : ""}${t}px "CardRenderer MTG MPlantin", Georgia`;
function $u(t) {
  const e = [];
  let r = [], o = !1;
  const n = () => {
    r.length && (e.push({ pieces: r, space: o }), r = [], o = !1);
  };
  for (const s of t)
    for (const a of Kr(s.text))
      if (a.symbol) r.push({ text: a.symbol, symbol: !0, italic: !1 });
      else
        for (const i of a.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(i) ? (n(), i === `
` ? (e.push({ pieces: [], space: !1, newline: !0 }), o = !1) : o = !0) : r.push({ text: i, symbol: !1, italic: !!s.italic });
  return n(), e;
}
function ce(t, e, r, o = 1) {
  const n = [];
  for (const s of e) {
    const a = s.symbol ? s : { ...s, text: s.text.replaceAll("­", "") };
    if (!a.text) continue;
    const i = n.at(-1);
    i && !i.symbol && !a.symbol && i.italic === a.italic ? i.text += a.text : n.push({ ...a });
  }
  return n.map((s) => {
    t.font = Hn(r, s.italic);
    const a = t.measureText(s.text);
    return {
      ...s,
      ...s.symbol || o === 1 ? {} : { textWidth: o },
      size: r,
      width: s.symbol ? r * 0.88 : a.width * o,
      ascent: s.symbol ? r * 0.72 : a.actualBoundingBoxAscent,
      descent: s.symbol ? r * 0.08 : a.actualBoundingBoxDescent,
      inkLeft: s.symbol ? r * 0.025 : -a.actualBoundingBoxLeft * o,
      inkRight: s.symbol ? r * 0.825 : a.actualBoundingBoxRight * o
    };
  });
}
function Bu(t, e, r, o, n, s = 1) {
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
        const m = [
          ...r.slice(0, i),
          { ...l, text: l.text.slice(0, d) + (u ? "—" : "-") }
        ], h = [{ ...l, text: l.text.slice(d + 1) }, ...r.slice(i + 1)];
        h.some((c) => c.text.replaceAll("­", "").length) && ce(t, [...e, ...m], n, s).reduce((c, g) => c + g.width, 0) <= o && (a = { head: m, tail: h });
      }
  }
  return a;
}
function Fi(t, e, r, o, n = 1) {
  const s = [];
  let a = [];
  for (const i of e) {
    if (i.newline) {
      s.push(ce(t, a, o, n)), a = [];
      continue;
    }
    let l = i.pieces, d = a.length && i.space ? [{ text: " ", italic: i.pieces[0]?.italic ?? !1, symbol: !1 }] : [];
    for (; ; ) {
      if (ce(t, [...a, ...d, ...l], o, n).reduce((h, c) => h + c.width, 0) <= r) {
        a.push(...d, ...l);
        break;
      }
      const m = Bu(
        t,
        [...a, ...d],
        l,
        r,
        o,
        n
      );
      if (m)
        s.push(ce(t, [...a, ...d, ...m.head], o, n)), a = [], d = [], l = m.tail;
      else if (a.length)
        s.push(ce(t, a, o, n)), a = [], d = [];
      else {
        a.push(...l);
        break;
      }
    }
  }
  return a.length && s.push(ce(t, a, o, n)), s;
}
function Rs(t, e, r, o, n = 1) {
  const s = Fi(t, e, r, o, n);
  if (s.length < 2) return s;
  const a = /* @__PURE__ */ new Map(), i = (h, c) => {
    const g = `${h}:${c}`;
    let f = a.get(g);
    if (!f) {
      const b = [];
      for (let y = h; y < c; y++) {
        const p = e[y];
        y > h && p.space && b.push({ text: " ", italic: p.pieces[0]?.italic ?? !1, symbol: !1 }), b.push(...p.pieces);
      }
      f = ce(t, b, o, n), a.set(g, f);
    }
    return f;
  }, l = /* @__PURE__ */ new Map(), d = (h, c) => {
    if (!c) return h === e.length ? { cost: 0, cuts: [] } : null;
    const g = `${h}:${c}`;
    if (l.has(g)) return l.get(g);
    let f = null;
    for (let b = h + 1; b <= e.length - c + 1; b++) {
      const y = i(h, b).reduce((S, v) => S + v.width, 0);
      if (y > r) break;
      const p = d(b, c - 1);
      if (!p) continue;
      const w = p.cost + (r - y) ** 2;
      (!f || w < f.cost) && (f = { cost: w, cuts: [b, ...p.cuts] });
    }
    return l.set(g, f), f;
  }, u = d(0, s.length);
  if (!u) return s;
  let m = 0;
  return u.cuts.map((h) => {
    const c = i(m, h);
    return m = h, c;
  });
}
function xs(t, e, r, o, n = !1, s = 1) {
  const a = $u(e);
  if (!n || a.length > 64 || e.some((d) => d.text.includes("­")))
    return Fi(t, a, r, o, s);
  const i = [];
  let l = [];
  for (const d of a)
    d.newline ? (i.push(
      ...l.length ? Rs(t, l, r, o, s) : [[]]
    ), l = []) : l.push(d);
  return l.length && i.push(...Rs(t, l, r, o, s)), i;
}
const Iu = new Set(
  "mir vis 5ed wth tmp sth exo usg ulg 6ed uds mmq nem pcy inv pls 7ed apc ody tor jud ons lgn scg por p02 ptk".split(
    " "
  )
);
function Gu(t) {
  return Iu.has(t?.toLowerCase() ?? "");
}
function Pu(t) {
  if (t.role !== "flavor" || t.align !== void 0) return [t];
  const e = t.runs.map((a) => a.text).join(""), r = [...e.matchAll(/(?:^|\n)[^\S\n]*(?:—|–|--)[^\S\n]*(?=\S)/g)].at(-1);
  if (!r) return [t];
  const o = r.index, n = o + (e[o] === `
` ? 1 : 0), s = (a, i) => {
    let l = 0;
    return t.runs.flatMap((d) => {
      const u = d.text.slice(Math.max(0, a - l), Math.max(0, i - l));
      return l += d.text.length, u ? [{ ...d, text: u }] : [];
    });
  };
  return [
    ...o ? [{ ...t, runs: s(0, o) }] : [],
    { ...t, align: "right", runs: s(n, e.length) }
  ];
}
const _i = /* @__PURE__ */ new WeakMap(), Wi = (t) => _i.get(t), Nr = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function G(t, e, r, o = 24, n = 15, s = Nr) {
  const a = s.textWidth ?? 1;
  if (!Number.isFinite(a) || a <= 0)
    throw Error("Magic rules text width must be finite and positive.");
  t.save(), t.letterSpacing = "0px", t.textBaseline = "alphabetic", t.textAlign = "left";
  try {
    const i = s.flavorAttribution === "right" ? e.flatMap(Pu) : e;
    let l, d = o;
    do {
      const u = [], m = [];
      let h = 0, c;
      for (const C of i) {
        let T = d, R = xs(
          t,
          C.runs,
          r.width,
          T,
          s.balanceLines && (!s.balanceCenteredOnly || C.align === "center"),
          a
        );
        if (C.role === "flavor" && s.flavorOrphans !== !1 && R.length > 2 && R.at(-1).reduce((M, x) => M + x.width, 0) < r.width * 0.3)
          for (let M = T - 0.25; M >= T * 0.94; M -= 0.25) {
            const x = xs(
              t,
              C.runs,
              r.width,
              M,
              s.balanceLines && (!s.balanceCenteredOnly || C.align === "center"),
              a
            );
            if (x.length < R.length) {
              T = M, R = x;
              break;
            }
          }
        if (R.length) {
          c && (c === "rules" && C.role === "flavor" ? h += d * s.flavorGap : (c !== "flavor" || C.role !== "flavor") && (h += d * s.paragraphGap));
          for (const M of R) {
            const x = Math.max(0, ...M.map((D) => D.ascent)), A = Math.max(0, ...M.map((D) => D.descent)), F = M.reduce((D, Z) => D + Z.width, 0), L = r.x + (C.align === "right" ? r.width - F : C.align === "center" ? (r.width - F) / 2 : 0);
            let U = 0, O = 1 / 0, V = -1 / 0;
            for (const D of M)
              O = Math.min(O, U + D.inkLeft), V = Math.max(V, U + D.inkRight), U += D.width;
            u.push({
              x: L,
              runs: M,
              role: C.role,
              baseline: h,
              width: F,
              inkBounds: [
                L + (M.length ? O : 0),
                h - x,
                M.length ? V - O : 0,
                x + A
              ]
            }), h += T * s.leading;
          }
          c = C.role;
        }
      }
      if (s.flavorSeparator !== !1)
        for (let C = 1; C < u.length; C++) {
          const T = u[C - 1], R = u[C];
          if (T.role !== "rules" || R.role !== "flavor") continue;
          const M = T.inkBounds[1] + T.inkBounds[3];
          m.push((M + R.inkBounds[1]) / 2 - 0.3);
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
        separators: m.map((C) => C + v)
      }, l.overflow ||= l.lines.some(
        (C) => r.exclusions?.some(([T, R, M, x]) => {
          const [A, F, L, U] = C.inkBounds;
          return A < T + M && A + L > T && F < R + x && F + U > R;
        })
      ), !l.overflow || d <= n) break;
      d = Math.max(n, d - 0.25);
    } while (!0);
    return _i.set(l, { paragraphs: e, bounds: r, maximumSize: o, minimumSize: n, typography: s }), l;
  } finally {
    t.restore();
  }
}
function Fu(t, e, r) {
  const [o, n, s, a] = r, i = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((l) => ({ role: "rules", runs: [{ text: l }] }));
  return G(
    t,
    i,
    { x: o - 0.375, y: n, width: s, height: a },
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
function He(t, e, r, o, n, s, a, i, l = 1 / 0) {
  const d = (c) => (c.align === void 0 || c.align === "center") && c.runs.length > 0 && c.runs.every((g) => !g.text.includes(`
`));
  if (!r.length || !r.every(d) || !e.every(d)) return null;
  const u = r.map((c) => c.runs.map((g) => g.text).join("")).join(`
`);
  if (Array.from(u.replace(/\{[^}]+\}/g, "●")).length > l) return null;
  const m = (c) => c.map((g) => ({ ...g, align: "center" })), h = G(t, m(r), o, n, n, i);
  return h.overflow || h.lines.length > a ? null : G(t, m(e), o, n, s, i);
}
const Ue = {
  ordinary: [0.436 * 488, 0.9034 * 680, 0.128 * 488, 0.0458 * 680],
  planeswalker: [0.4394 * 488, 0.9015 * 680, 0.1214 * 488, 0.051 * 680],
  saga: [213.7, 620.2, 60.5, 25.3],
  aftermath: [222, 623, 43, 20],
  split: [223.5, 620, 43, 21.5]
}, gf = {
  ordinary: { size: [192, 96], interior: [29, 29, 134, 67] },
  planeswalker: { size: [182, 107], interior: [24, 26, 134, 67] },
  saga: { size: [186, 78], interior: [26, 11, 134, 67] },
  plain: { size: [134, 67], interior: [0, 0, 134, 67] }
};
function fe(t) {
  if (!Nt(t) || ot(t) || t.frameAssetFamily === "eighth" || t.frameTemplate || t.faces?.length || t.layout && !["normal", "planeswalker", "transform", "modal_dfc", "meld"].includes(t.layout))
    return null;
  const e = tt(t), r = e.startsWith("planeswalker");
  if (e !== "normal" && !r) return null;
  const o = _(t), n = o.boxes === "Gold" ? "M" : o.boxes === "Artifact" ? "A" : o.boxes === "Land" ? "L" : o.boxes === "Colourless" ? r ? "A" : "C" : o.boxes, s = I(t);
  s.length === 2 && "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 && s.reverse();
  const a = s.length > 2 ? ["M"] : s.length ? s : [n], i = (l) => r ? `${B}/img/frames/planeswalker/holo/${l.toLowerCase()}.png` : `${B}/img/frames/m15/holoStamps/m15HoloStamp${l}.png`;
  return {
    image: i(a[0]),
    ...a.length === 2 ? { rightImage: i(a[1]) } : {},
    rect: r ? Ue.planeswalker : Ue.ordinary
  };
}
function Ui(t, e, r) {
  const o = fe(e);
  if (!o) return;
  const n = r.get(o.image);
  if (!n) throw Error("Authenticity stamp asset is unavailable.");
  t.save(), t.shadowColor = "transparent", t.drawImage(n, ...o.rect), t.restore();
}
const _u = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function Wu(t) {
  return !_u.has(t?.trim().toLowerCase() ?? "");
}
function Uu(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = kt(t);
  if (!(!e || !It(t, e.frame)))
    return t.frameTreatment === "colorshifted" ? [0.7234, 0.881, 0.204, 0.0772] : [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814];
}
function ju(t, e, r) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return e;
  const o = kt(t);
  if (!o || !It(t, o.frame) || !e.lines.length)
    return e;
  let n = 0;
  const s = e.lines.map((h, c) => {
    if (c) {
      const g = e.lines[c - 1], f = g.runs[0]?.size ?? e.size, b = h.baseline - g.baseline - f, y = g.role === "rules" && h.role === "flavor" ? 0.625 / 0.9 : 0.4375 / 0.45;
      n += f * (0.965 - 1) + b * (y - 1);
    }
    return {
      ...h,
      x: (h.x ?? e.x) + 2.25,
      baseline: h.baseline + n,
      inkBounds: [
        h.inkBounds[0] + 2.25,
        h.inkBounds[1] + n,
        h.inkBounds[2],
        h.inkBounds[3]
      ]
    };
  }), a = s[0], i = s.at(-1), l = i.inkBounds[1] + i.inkBounds[3] - a.inkBounds[1], d = r.y + Math.max(0, (r.height - l) / 2), u = d - a.inkBounds[1], m = s.map((h) => ({
    ...h,
    baseline: h.baseline + u,
    inkBounds: [
      h.inkBounds[0],
      h.inkBounds[1] + u,
      h.inkBounds[2],
      h.inkBounds[3]
    ]
  }));
  return l > r.height + 0.01 || m.some(
    (h) => r.exclusions?.some(([c, g, f, b]) => {
      const [y, p, w, S] = h.inkBounds;
      return y < c + f && y + w > c && p < g + b && p + S > g;
    })
  ) ? e : { ...e, x: e.x + 2.25, top: d, height: l, lines: m };
}
function Nu(t, e, r, o, n) {
  if (e.setCode?.toLowerCase() !== "plc" || e.frameAssetFamily !== "eighth" || e.frameTemplate || e.layout && e.layout !== "normal" || o.size !== 24.5 || o.lines.length > 5)
    return o;
  const s = kt(e);
  if (!s || !It(e, s.frame)) return o;
  const a = {
    leading: 0.965,
    paragraphGap: 0.4375,
    flavorGap: 0.625,
    flavorSeparator: !1
  }, i = { ...n, x: o.x }, l = (d) => r.some((u) => {
    if (u.runs.some((c) => c.text.includes(`
`))) return !1;
    const m = G(
      t,
      [u],
      { ...i, height: 1e3, exclusions: [] },
      d,
      d,
      a
    ), h = m.lines.at(-1);
    return m.lines.length < 2 || !h || h.width >= n.width * 0.35 ? !1 : u.role === "rules" || (h.runs.map((c) => c.text).join("").trim().match(/\S+/g)?.length ?? 0) === 1;
  });
  if (!l(o.size)) return o;
  for (let d = o.size - 0.25; d >= o.size - 2; d -= 0.25) {
    const u = G(t, r, i, d, d, a);
    if (!u.overflow && u.lines.length < o.lines.length && !l(d))
      return u;
  }
  return o;
}
function ji(t, e, r = E, o = 1) {
  const n = Pt(e), s = Uu(e), a = s ?? n.stats, i = {
    ...Nr,
    flavorSeparator: e.frameAssetFamily === "eighth" ? !1 : Wu(e.setCode)
  }, [l, d, u, m] = n.rules, h = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((p) => ({ role: "rules", runs: [{ text: p }] })), c = fe(e), g = {
    x: l * k + (e.frameAssetFamily ? 0 : 3.5),
    y: d * r + (e.frameAssetFamily ? 0 : 7),
    width: u * k - (e.frameAssetFamily ? 0 : 9.5),
    height: m * r - (e.frameAssetFamily ? 0 : 8),
    // Fit actual line ink around the existing power/toughness plate. Short
    // final lines can use the lower left area without being painted over.
    exclusions: [
      ...e.power != null && e.toughness != null ? [
        [
          a[0] * k - 2,
          a[1] * r - 2,
          a[2] * k + 4,
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
  }, f = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? h : h;
  if (e.rulesAlignment?.mode !== "left" && ["10e", "m10", "m11", "m12", "m13", "m14"].includes(e.setCode?.toLowerCase() ?? "") && f.every((p) => p.role === "rules")) {
    const p = He(
      t,
      h,
      f,
      g,
      24.5 * o,
      15 * o,
      3,
      { ...i, balanceLines: !0 }
    );
    if (p) return p;
  }
  const b = e.rulesAlignment?.mode === "left" ? h.map((p) => p.role === "rules" ? { ...p, align: "left" } : p) : h;
  let y = G(t, b, g, 24.5 * o, 15 * o, i);
  return y.overflow && s && (y = G(t, b, g, y.size, 12 * o, i)), Nu(
    t,
    e,
    b,
    ju(e, y, g),
    g
  );
}
function Ct(t, e, r, o = et, n = 0, s = "#17140f") {
  if (!Qt(t)) return;
  if (e.overflow) throw Error("Magic rules text does not fit the available area.");
  t.save(), e.horizontalScale && t.scale(e.horizontalScale, 1), t.textAlign = "left", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
  for (const l of e.separators) {
    const d = t.createLinearGradient(e.x, l, e.x + e.width, l);
    d.addColorStop(0, "#17140f00"), d.addColorStop(0.15, "#17140f55"), d.addColorStop(0.85, "#17140f55"), d.addColorStop(1, "#17140f00"), t.fillStyle = d, t.fillRect(e.x, l, e.width, 0.6);
  }
  t.fillStyle = s;
  const a = n > 0 ? document.createElement("canvas") : null;
  a && (a.width = t.canvas.width, a.height = t.canvas.height);
  const i = a ? a.getContext("2d") : t;
  if (!i) throw Error("Missing rules text context");
  a && (i.setTransform(t.getTransform()), i.textAlign = "left", i.textBaseline = "alphabetic", i.letterSpacing = "0px", i.fillStyle = s);
  for (const l of e.lines) {
    let d = l.x ?? e.x;
    for (const u of l.runs)
      u.symbol ? o(
        t,
        u.text,
        d + u.size * 0.025,
        l.baseline - u.size * 0.72,
        u.size * 0.8,
        r
      ) : (i.font = Hn(u.size, u.italic), Es(i, u, d, l.baseline, !1)), d += u.width;
  }
  if (a) {
    i.globalCompositeOperation = "destination-out", i.lineJoin = "round";
    for (const l of e.lines) {
      let d = l.x ?? e.x;
      for (const u of l.runs)
        u.symbol || (i.font = Hn(u.size, u.italic), i.lineWidth = u.size * n * 2, Es(i, u, d, l.baseline, !0)), d += u.width;
    }
    t.resetTransform(), t.drawImage(a, 0, 0), a.width = a.height = 0;
  }
  t.restore();
}
function Es(t, e, r, o, n) {
  const s = e.textWidth ?? 1;
  if (s === 1) {
    n ? t.strokeText(e.text, r, o) : t.fillText(e.text, r, o);
    return;
  }
  t.save(), t.translate(r, o), t.scale(s, 1), n ? t.strokeText(e.text, 0, 0) : t.fillText(e.text, 0, 0), t.restore();
}
function Du(t) {
  const e = ht(t);
  if (t.setCode?.toLowerCase() !== "fut" || e === "clear") return;
  const r = Q(t), o = J.CONJURER_ROOT + "/img/setSymbols/official/fut-";
  if (!["c", "u", "r"].some((l) => r === o + l + ".svg")) return;
  const [n, s, a, i] = e === "full-art" ? [443.5625, 581.8125, 28.1875, 20.976866533333336] : Zt(t).base.includes("/future/regular/futureFrame") ? [443.5, 405.125, 29, 21.851866533333336] : [443.5, 405.5, 27.875, 22.226866533333336];
  return [n - a / 2, s - i / 2, a, i];
}
function zu(t, e, r, o, n) {
  ei(e);
  const s = Lu(e, r), a = Ou(s, e), i = yo(e), l = Zt(e), d = _(e), u = ri(e);
  t.save();
  try {
    if (!o) {
      const C = Tt(e);
      t.fillStyle = C ?? "#080808", t.fillRect(0, 0, 488, 680), C && (t.fillStyle = "#080808", t.fillRect(17, 17, 454, 646));
    }
    if (n && t.drawImage(n, 0, 0, 488, 680), o !== "printing") {
      const C = document.createElement("canvas");
      C.width = 976, C.height = 1360;
      try {
        const T = C.getContext("2d");
        T.scale(2, 2);
        const R = ht(e) === "clear" ? [23, 22, 442, 637] : i.art;
        Ft(T, e, r, R, "artwork"), T.globalCompositeOperation = "destination-in", T.drawImage(a, 0, 0, 488, 680), t.drawImage(C, 0, 0, 488, 680);
      } finally {
        C.width = C.height = 0;
      }
    }
    if (o === "artwork") return;
    t.drawImage(s, 0, 0, 488, 680), l.typeSymbol && t.drawImage(r.get(l.typeSymbol), 31.2, 31.2, 27.3, 26), t.shadowColor = "transparent", H(t, e, "manaCost", () => X0(t, e, r));
    const m = u.length === 1 && u[0] !== "W", h = (C, T, R, M, x = !1) => {
      t.textAlign = "left", t.textBaseline = "middle", rt(
        t,
        C,
        T[0] + 1.25,
        T[1] + T[3] / 2 + M,
        T[2],
        R,
        !0,
        1,
        "CardRenderer MTG Matrix",
        0,
        x ? e.textInk : void 0
      );
    };
    t.fillStyle = m ? "#fff" : "#111", h(e.name, i.title, 30.248, 1.25), h(e.typeLine ?? "", i.type, 24.969, -1.5, !0);
    const c = d.land && u.length === 2 && !u.includes("W") ? "#fff" : "#111";
    ht(e) !== "full-art" && Ct(t, Fu(t, e, i.rules), r, void 0, 0, c), e.power != null && e.toughness != null && (t.fillStyle = m ? "#fff" : "#111", t.textAlign = "center", t.textBaseline = "middle", t.font = '700 29.97px "CardRenderer MTG Matrix Small Caps"', t.save(), t.translate(i.stats[0] + i.stats[2] / 2 - 1.5, i.stats[1] + i.stats[3] / 2 - 0.25), t.scale(0.99, 1), dt(t, `${e.power}/${e.toughness}`, 0, 0, i.stats[2] / 0.99, e.textInk), t.restore());
    const g = r.get(Q(e) ?? "");
    H(t, e, "setSymbol", () => {
      if (g) {
        const [C, T, R, M] = i.symbol, x = Math.min(R / g.width, M / g.height), A = Du(e) ?? [
          C + (R - g.width * x) / 2,
          T + (M - g.height * x) / 2,
          g.width * x,
          g.height * x
        ];
        t.drawImage(g, A[0], A[1], A[2], A[3]);
      }
    }), t.fillStyle = d.land || m ? "#fff" : "#111", t.textAlign = "right", t.textBaseline = "alphabetic";
    const f = e.power != null && e.toughness != null ? 361 : 442, b = ht(e) === "full-art", y = b ? 16.6 : 17.845, p = b ? 627 : 626.5;
    t.font = `400 ${y}px "CardRenderer MTG Matrix"`;
    const w = e.artist ?? "";
    H(t, e, "artist", () => {
      t.fillText(w, f, p, f - 70);
      const C = l.brush ? r.get(l.brush) : void 0;
      C && t.drawImage(C, f - t.measureText(w).width - 40, p - 10, 36, 8);
    });
    const S = no(e), v = oo(e, !1);
    if (S || v) {
      t.font = '11.804px "CardRenderer MTG MPlantin"';
      const C = [S, v].filter(Boolean).join(" ");
      if (!e.printingElements?.legal?.offset && !e.printingElements?.collector?.offset)
        t.fillText(C, f - 0.25, 641.25, f - 40);
      else {
        const T = t.measureText(C).width, R = Math.min(1, (f - 40) / Math.max(1, T));
        t.save(), t.translate(f - 0.25, 641.25), t.textAlign = "left";
        const M = (x, A) => {
          t.save(), t.scale(R, 1), t.fillText(x, A, 0), t.restore();
        };
        S && H(t, e, "legal", () => M(S, -T)), v && H(
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
const je = 96 / 72;
function or(t, e, r, o, n, s) {
  const [a, i, l, d] = r;
  t.textAlign = "left", t.textBaseline = "middle", rt(
    t,
    e,
    a,
    i + d / 2,
    l,
    o * je,
    n !== "CardRenderer MTG Matrix",
    1,
    n,
    0,
    s
  );
}
function Ni(t, e, r, o, n, s) {
  const a = e.manaSymbols ?? [], i = s + 1;
  return a.forEach(
    (l, d) => et(t, l, o - a.length * i + d * i, n, s, r, !0)
  ), a.length * i;
}
function Di(t, e, r, o, n, s, a = "#17140f") {
  if (!Qt(t)) return;
  const [i, l, d, u] = o, m = e.rulesParagraphs ?? (e.rulesText ?? "").split(`
`).filter(Boolean).map((c) => ({ role: "rules", runs: [{ text: c }] })), h = G(t, m, { x: i, y: l, width: d, height: u }, n * je, s * je, {
    leading: 0.95,
    paragraphGap: 0.4,
    flavorGap: 0.5,
    flavorOrphans: !1
  });
  if (h.overflow) throw Error("Standard template text exceeds its minimum readable size.");
  Ct(t, h, r, void 0, 0, a);
}
function zi(t, e, r, o, n) {
  if (e.power == null || e.toughness == null) return;
  const [s, a, i, l] = r;
  t.font = `bold ${o * je}px "${n}", Georgia`, t.textAlign = "center", t.textBaseline = "middle", dt(t, `${e.power}/${e.toughness}`, s + i / 2, a + l / 2, i, e.textInk);
}
function Yi(t, e, r, o) {
  const [n, s, a] = r;
  t.fillStyle = o, t.textAlign = "left", t.textBaseline = "top", t.font = `${10 * je}px "CardRenderer MTG Matrix", Georgia`, t.fillText(e.artist ?? "", n, s, a), e.legalText && (t.font = `${6.5 * je}px "CardRenderer MTG MPlantin", Georgia`, t.fillText(e.legalText, n, s + 14, a));
}
const As = [
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
function Yu(t, e, r, o, n) {
  if (e.faces?.length !== 2) throw Error("A flip template needs exactly two printed panels.");
  const s = e.faces[0], a = e.faces[1];
  if (n !== "artwork")
    for (const [h, c] of [o.base, o.reverse].entries()) {
      const g = r.get(c);
      if (!g) throw Error(`Flip frame unavailable: ${c}`);
      t.save(), h && (t.beginPath(), t.rect(0, 344, 375, 179), t.clip()), t.drawImage(g, 0, 0, 375, 523), t.restore();
    }
  if (Ft(t, e, r, [32, 162, 311, 182], n), n === "artwork") return;
  for (const [h, c, g] of [
    [o.stats, o.statsMask, [285, 123, 70, 38]],
    [o.reverseStats, o.reverseStatsMask, [18, 342, 70, 38]]
  ]) {
    if (!h || !c) continue;
    const f = r.get(h), b = r.get(c);
    if (!f || !b) throw Error("Missing flip statistics plate");
    const y = document.createElement("canvas");
    y.width = 140, y.height = 76;
    const p = y.getContext("2d");
    p.drawImage(f, 0, 0, 140, 76), p.globalCompositeOperation = "destination-in", p.drawImage(Lr(b), 0, 0, 140, 76), t.drawImage(y, g[0], g[1], g[2], g[3]), y.width = y.height = 0;
  }
  t.shadowColor = "transparent", t.fillStyle = "#17140f";
  const i = "CardRenderer MTG Matrix", l = (h, c, g, f, b) => {
    const y = Ni(t, h, r, c[0] + c[2], c[1] + 1, 15);
    or(
      t,
      h.name,
      [c[0], c[1], Math.max(1, c[2] - y - 4), c[3]],
      17,
      i
    ), or(
      t,
      h.typeLine ?? "",
      [f[0], f[1], f[2] - (h.power != null ? 60 : 0), f[3]],
      14,
      i,
      h.textInk
    ), Di(t, h, r, g, 14, 8), zi(t, h, b, 17, i);
  }, d = As[0], u = As[1];
  l(s, d.title, d.rules, d.type, d.stats), t.save(), t.translate(375, 523), t.rotate(Math.PI), l(a, u.title, u.rules, u.type, u.stats), t.restore();
  const m = r.get(Q(e) ?? "");
  if (m) {
    const h = Math.min(44 / m.width, 22 / m.height);
    t.drawImage(m, 353 - m.width * h, 482, m.width * h, m.height * h);
  }
  Yi(t, e, [58, 479, 217, 26], "#17140f");
}
function qu(t, e, r, o, n) {
  const s = e.frameTemplate;
  if (!s) throw Error("Missing standard template");
  if (s === "future") return zu(t, e, r, o, n);
  const a = Ro[s], i = (u) => {
    const m = r.get(u);
    if (!m) throw Error(`Standard template asset unavailable: ${u}`);
    return m;
  }, l = xo(e);
  if (!l) throw Error("Missing template assets");
  const d = i(l.base);
  t.save();
  try {
    if (o !== "artwork" && (t.fillStyle = Tt(e) ?? "#090806", t.fillRect(0, 0, 488, 680)), n && t.drawImage(n, 0, 0, 488, 680), s === "battle" ? (t.translate(0, 680), t.rotate(-Math.PI / 2), t.scale(680 / 523, 488 / 375)) : t.scale(488 / 375, 680 / 523), l.kind === "flip") {
      Yu(t, e, r, l, o);
      return;
    }
    if (l.kind !== "battle") throw Error("Unexpected standard template branch");
    if (o !== "artwork" && t.drawImage(i(l.texture), 0, 0, 523, 375), Ft(t, e, r, a.art, o), o === "artwork") return;
    t.drawImage(d, 0, 0, a.size[0], a.size[1]), t.drawImage(i(l.border), 0, 0, 523, 375), e.defense != null && t.drawImage(i(l.defense), 459, 322, 64, 52), t.shadowColor = "transparent", t.fillStyle = "#17140f";
    const u = "CardRenderer MTG Beleren";
    let m = a.title;
    const h = Ni(t, e, r, 484, 20, 15);
    m = [m[0], m[1], Math.max(1, m[2] - h - 5), m[3]], or(t, e.name, m, a.titleSize, u), or(t, e.typeLine ?? "", a.type, a.typeSize, u, e.textInk), t.fillStyle = "#17140f", Di(t, e, r, a.rules, a.rulesSize, a.minimumSize), s === "battle" && e.defense != null ? (t.fillStyle = "white", or(t, String(e.defense), a.stats, 17, u)) : zi(t, e, a.stats, 18, u);
    const c = r.get(Q(e) ?? "");
    if (c) {
      const [g, f, b, y] = a.symbol, p = Math.min(b / c.width, y / c.height);
      t.drawImage(
        c,
        g + b - c.width * p,
        f + (y - c.height * p) / 2,
        c.width * p,
        c.height * p
      );
    }
    Yi(t, e, a.footer, "white");
  } finally {
    t.restore();
  }
}
let Ls;
function Hu(t) {
  return !t.frameTemplate || t.frameTemplate === "battle" ? Promise.resolve() : Ls ??= Promise.all([
    document.fonts.load('400 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 24px "CardRenderer MTG Matrix Small Caps"')
  ]).then(() => {
  }).catch((e) => {
    throw Ls = void 0, e;
  });
}
function Xu(t) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = kt(t);
  if (!(!e || !It(t, e.frame)))
    return { dx: 1.25, dy: -2.9375, scaleX: 1.005, scaleY: 0.99375 };
}
function Ju(t, e, r) {
  if (!(t.setSymbol || !It(t, e) || !["c", "u", "r"].some(
    (o) => r === `${B}/img/setSymbols/official/plc-${o}.svg`
  )))
    return [411, 388.75, 34, 25.5];
}
const Ku = {
  scaleX: 1.01,
  scaleY: 1.01,
  numberScale: 0.98,
  numberDx: -0.25
};
function Vu(t) {
  const e = Bd(t);
  if (e) return e;
  const r = Xu(t);
  if (r) return r;
  const o = t.setCode?.toLowerCase() ?? "";
  if (Ya(t)) return { ...Ku, ...xd[o] };
  const n = Rd[o], s = ["lea", "leb", "3ed", "arn", "atq", "drk"].includes(o);
  if (!(!n || t.frameTemplate !== void 0 || /^Level up\b/m.test(t.rulesText ?? "") || (t.layout ?? "normal") !== "normal" || (t.legendary ?? /\bLegendary\b/.test(t.typeLine ?? "")) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "") || Gt(t) !== (["3ed", "8ed"].includes(o) ? "white" : "black") || s && (!ot(t) || t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle") || o === "8ed" && (ot(t) || t.frameAssetFamily !== "eighth")))
    return io(t) === "dark" ? { ...n, numberScale: 0.87, numberDx: -0.25, numberDy: -0.25 } : n;
}
function rn(t) {
  const e = t.symbolAdjustment?.mana, r = Vu(t);
  if (!r) return e;
  const o = { ...e };
  for (const n of ["dx", "dy", "spacing", "numberDx", "numberDy"])
    r[n] !== void 0 && (o[n] = r[n] + (e?.[n] ?? 0));
  for (const n of ["scaleX", "scaleY", "numberScale"])
    r[n] !== void 0 && (o[n] = r[n] * (e?.[n] ?? 1));
  if (r.glyphs) {
    o.glyphs = { ...e?.glyphs };
    for (const n of ["W", "U", "B", "R", "G"]) {
      const s = r.glyphs[n], a = e?.glyphs?.[n];
      s && (o.glyphs[n] = {
        scale: (s.scale ?? 1) * (a?.scale ?? 1),
        dx: (s.dx ?? 0) + (a?.dx ?? 0),
        dy: (s.dy ?? 0) + (a?.dy ?? 0)
      });
    }
  }
  return o;
}
class nn {
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
    const r = new Set(e.map((n) => n.key)), o = e.reduce((n, s) => {
      const a = this.entries.get(s.key);
      if (a && a.bytes !== s.bytes)
        throw Error("Material cache key has inconsistent dimensions");
      return n + (a ? 0 : s.bytes);
    }, 0);
    for (const [n, s] of this.entries) {
      if (this.bytes + o <= this.limit) break;
      s.users || r.has(n) || (this.entries.delete(n), s.retired = !0, this.destroy(s), this.evictions++);
    }
    if (!(this.bytes + o > this.limit))
      return this.bytes += o, this.peakBytes = Math.max(this.peakBytes, this.bytes), e.map((n) => {
        let s = this.entries.get(n.key);
        if (s)
          this.hits++, this.entries.delete(n.key), this.entries.set(n.key, s);
        else {
          const a = {
            users: 0,
            bytes: n.bytes,
            accounted: !0,
            retired: !1,
            promise: Promise.resolve().then(async () => {
              this.builds++;
              const i = await n.build();
              if (i.width * i.height * 4 !== n.bytes)
                throw i.close(), Error("Derived bitmap dimensions differ from its cache reservation");
              return a.bitmap = i, i;
            })
          };
          a.promise = a.promise.catch((i) => {
            throw this.entries.get(n.key) === a && this.entries.delete(n.key), a.retired = !0, this.destroy(a), this.notify(), i;
          }), this.entries.set(n.key, a), s = a;
        }
        return s.users++, s;
      });
  }
  notify() {
    for (const e of [...this.waiting]) e();
  }
  wait(e) {
    return e.throwIfAborted(), new Promise((r, o) => {
      const n = () => {
        this.waiting.delete(s), e.removeEventListener("abort", a);
      }, s = () => {
        n(), r();
      }, a = () => {
        n(), o(e.reason);
      };
      this.waiting.add(s), e.addEventListener("abort", a, { once: !0 });
    });
  }
  async acquire(e, r, o, n) {
    return (await this.acquireMany([{ key: e, bytes: r, build: o }], n))[0];
  }
  /** Admit a complete face atomically. Per-component waiting could deadlock two
   * faces that each hold half their required components while awaiting the rest. */
  async acquireMany(e, r) {
    if (r.throwIfAborted(), new Set(e.map((s) => s.key)).size !== e.length)
      throw Error("Duplicate key in material batch");
    if (e.some((s) => !Number.isSafeInteger(s.bytes) || s.bytes < 1) || e.reduce((s, a) => s + a.bytes, 0) > this.limit)
      throw RangeError("Material batch exceeds derived-image budget");
    let o;
    for (; !(o = this.admit(e)); )
      await this.wait(r), r.throwIfAborted();
    const n = o.map((s) => {
      let a = !1;
      return () => {
        a || (a = !0, s.users--, s.retired && !s.users && this.destroy(s), this.notify());
      };
    });
    try {
      const a = (await Promise.allSettled(o.map((i) => i.promise))).find((i) => i.status === "rejected");
      if (a?.status === "rejected") throw a.reason;
      return r.throwIfAborted(), o.map((i, l) => ({ value: i.bitmap, release: n[l] }));
    } catch (s) {
      for (const a of n) a();
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
const qi = new nn(16 * 1024 * 1024), Do = new nn(8 * 1024 * 1024), ff = () => {
  qi.clear(), Do.clear();
};
function Zu(t) {
  if (!t.length || t.length % 4) throw Error("Invalid mana source pixels.");
  const e = new Uint32Array(766);
  let r = 0;
  for (let s = 0; s < t.length; s += 4) {
    if (t[s + 3] !== 255) continue;
    const a = t[s] + t[s + 1] + t[s + 2];
    e[a] = e[a] + 1, r++;
  }
  if (!r) throw Error("Mana source has no opaque paper sample.");
  let o = 0, n = 0;
  for (; n < e.length && (o += e[n], !(o >= r * 0.9)); n++)
    ;
  for (let s = 0; s < t.length; s += 4)
    if (t[s + 3] === 255 && t[s] + t[s + 1] + t[s + 2] === n)
      return [t[s], t[s + 1], t[s + 2]];
  throw Error("Mana source paper sample is inconsistent.");
}
const Qu = new nn(16 * 1024 * 1024), Os = /* @__PURE__ */ new WeakMap();
let tm = 0;
async function em(t, e, r) {
  const o = rn(t), n = qa(t), s = Od(t), a = !s && (!!n || !!o && (!!(o.numberDx || o.numberDy) || (o.numberScale ?? 1) !== 1));
  if (!s && !n && !a && !o?.glyphs && !Object.keys(e.manaGlyphScales ?? {}).length)
    return { images: e, dispose() {
    } };
  const i = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), d = [
    .../* @__PURE__ */ new Set([...t.manaSymbols ?? [], ...Object.keys(e.manaGlyphScales ?? {})])
  ].flatMap((m) => {
    const h = lr(o, m), c = !!h && (!!(h.dx || h.dy) || (h.scale ?? 1) !== 1);
    if (!(/^\d+$/.test(m) && a) && !c && (e.manaGlyphScales?.[m] ?? 1) === 1)
      return [];
    const g = Ha(t, m), f = e.get(g ?? Ge(m) ?? "");
    if (g && !f) throw Error("Modern cost numeral asset is missing.");
    if (!f) return [];
    let b = Os.get(f);
    return b || Os.set(f, b = ++tm), [
      {
        symbol: m,
        source: f,
        identity: b,
        cost: g ? n : void 0,
        paperSample: Pd(t, m)
      }
    ];
  });
  let u = [];
  try {
    return u = await Qu.acquireMany(
      d.map(({ source: m, identity: h, cost: c, paperSample: g }) => ({
        key: `numeral-v2:${h}:${c ? JSON.stringify(c) : "source"}${g ? ":" + g : ""}`,
        bytes: m.width * m.height * 8,
        build: () => rm(m, c, g)
      })),
      r
    ), d.forEach(({ symbol: m, source: h }, c) => {
      (/^\d+$/.test(m) ? i : l).set(m, {
        image: u[c].value,
        width: h.width,
        height: h.height
      });
    }), {
      images: Object.assign(new Map(e), {
        manaCostShadow: n?.shadow,
        manaCostNumeral: s,
        manaColors: e.manaColors,
        manaInkColor: e.manaInkColor,
        originalManaGlyphs: e.originalManaGlyphs,
        originalWhiteGlyph: e.originalWhiteGlyph,
        manaNumerals: i,
        manaGlyphs: l,
        manaGlyphScales: e.manaGlyphScales
      }),
      dispose: () => u.forEach((m) => m.release())
    };
  } catch (m) {
    throw u.forEach((h) => h.release()), m;
  }
}
async function rm(t, e, r) {
  const o = document.createElement("canvas");
  o.width = t.width, o.height = t.height;
  try {
    const n = o.getContext("2d", { willReadFrequently: !0 });
    if (!n) throw Error("Mana glyph preparation needs Canvas2D.");
    n.drawImage(t, 0, 0);
    const s = n.getImageData(0, 0, o.width, o.height), a = s.data, i = (Math.floor(t.height * 0.04) * t.width + Math.floor(t.width / 2)) * 4, l = r ? Zu(a) : [a[i], a[i + 1], a[i + 2]];
    let d = i;
    for (let g = 0; g < a.length; g += 4)
      a[g + 3] === 255 && a[g] + a[g + 1] + a[g + 2] < a[d] + a[d + 1] + a[d + 2] && (d = g);
    const u = [a[d], a[d + 1], a[d + 2]], m = l.map((g, f) => g - u[f]), h = m.reduce((g, f) => g + f * f, 0);
    if (h < 100) throw Error("Mana asset has no separable glyph.");
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
        Math.min(1, m.reduce((b, y, p) => b + y * (l[p] - a[g + p]), 0) / h)
      );
      a[g + 3] = Math.round(a[g + 3] * f);
      for (let b = 0; b < 3; b++) a[g + b] = e?.ink[b] ?? u[b];
    }
    return o.width = t.width * 2, n.putImageData(c, 0, 0), n.putImageData(s, t.width, 0), await createImageBitmap(o);
  } finally {
    o.width = o.height = 0;
  }
}
function Dr([t, e, r]) {
  const o = Math.max(t, e, r), n = o - Math.min(t, e, r);
  return [((n === 0 ? 0 : o === t ? (e - r) / n : o === e ? (r - t) / n + 2 : (t - e) / n + 4) * 60 % 360 + 360) % 360, o === 0 ? 0 : n / o, o];
}
function nm(t, e, r) {
  const o = (t % 360 + 360) % 360 / 60, n = r * e, s = n * (1 - Math.abs(o % 2 - 1)), a = r - n, i = o < 1 ? [n, s, 0] : o < 2 ? [s, n, 0] : o < 3 ? [0, n, s] : o < 4 ? [0, s, n] : o < 5 ? [s, 0, n] : [n, 0, s];
  return [i[0] + a, i[1] + a, i[2] + a];
}
function Yt(t, e) {
  const [r, o, n] = Dr(t), s = e.valueGamma === void 0 ? n : n ** e.valueGamma, a = nm(
    r + e.hueDegrees,
    Math.min(1, o * e.saturationScale),
    Math.min(1, s * e.brightnessScale)
  );
  return e.rgbScale ? [
    Math.max(0, Math.min(1, a[0] * e.rgbScale[0])),
    Math.max(0, Math.min(1, a[1] * e.rgbScale[1])),
    Math.max(0, Math.min(1, a[2] * e.rgbScale[2]))
  ] : a;
}
function $s(t) {
  const e = t.valueGamma;
  if (e !== void 0 && (!Number.isFinite(e) || e < 0.5 || e > 2))
    throw RangeError("Frame value exponent must be finite and between 0.5 and 2.");
}
const om = {
  W: { hueDegrees: 0, saturationScale: 0.439924, brightnessScale: 1.21405 },
  U: { hueDegrees: 17.808301, saturationScale: 0.546189, brightnessScale: 1.239832 },
  B: { hueDegrees: 0, saturationScale: 0.261951, brightnessScale: 1.149978 },
  R: { hueDegrees: -7.214766, saturationScale: 0.471958, brightnessScale: 1.212936 },
  G: { hueDegrees: 0, saturationScale: 0.227323, brightnessScale: 1.290867 }
};
function bn(t, e, r) {
  if (e.colorCalibration !== "set-hsb-v1" || !["eld", "woe"].includes(e.setCode?.toLowerCase() ?? ""))
    return;
  const o = om[r.toUpperCase()];
  if (!o) return;
  const n = t.getContext("2d"), s = t.width, a = t.height, i = [
    Math.floor(31 * s / 488),
    Math.floor(487 * a / 680),
    Math.ceil(214 * s / 488),
    Math.ceil(142 * a / 680)
  ], l = n.getImageData(...i);
  for (let u = 0; u < l.data.length; u += 4) {
    if (!l.data[u + 3]) continue;
    const m = Yt(
      [l.data[u] / 255, l.data[u + 1] / 255, l.data[u + 2] / 255],
      o
    );
    for (let h = 0; h < 3; h++)
      l.data[u + h] = Math.round(m[h] * 255);
  }
  const d = document.createElement("canvas");
  d.width = i[2], d.height = i[3], d.getContext("2d").putImageData(l, 0, 0), n.save(), n.scale(s / 488, a / 680), n.beginPath(), n.moveTo(31.8, 488.3), n.lineTo(218, 488.3), n.bezierCurveTo(235, 488.3, 241, 490.5, 244, 496), n.lineTo(244, 627.4), n.lineTo(31.8, 627.4), n.closePath(), n.clip(), n.drawImage(
    d,
    i[0] * 488 / s,
    i[1] * 680 / a,
    i[2] * 488 / s,
    i[3] * 680 / a
  ), n.restore(), d.width = d.height = 0;
}
const Re = /* @__PURE__ */ new Map(), yn = /* @__PURE__ */ new WeakMap();
let sm = 0, wn = 0;
const am = (t) => (yn.has(t) || yn.set(t, ++sm), yn.get(t));
function im(t, e) {
  const r = t.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const o = (y) => {
    const p = e.get(y);
    if (!p) throw Error(`Adventure asset unavailable: ${y}`);
    return p;
  }, n = Ei(t).map(o), s = JSON.stringify([
    t.setCode,
    t.colorCalibration,
    t.colors,
    t.frameColors,
    t.manaSymbols,
    r.colors,
    r.frameColors,
    r.manaSymbols,
    n.map(am)
  ]), a = Re.get(s);
  if (a)
    return Re.delete(s), Re.set(s, a), a;
  const i = o(Ur(t)), l = document.createElement("canvas");
  l.width = i.width, l.height = i.height;
  const d = l.getContext("2d"), u = l.width, m = l.height, h = () => {
    const y = document.createElement("canvas");
    return y.width = u, y.height = m, y;
  }, c = (y, p) => {
    const w = h(), S = w.getContext("2d"), v = I(y);
    if (S.drawImage(o(Ur(y)), 0, 0, u, m), p && v.length === 1 && bn(w, t, v[0]), v.length === 2) {
      "WUBRG".indexOf(v[1]) - "WUBRG".indexOf(v[0]) > 2 && v.reverse(), S.drawImage(o(`${ye}/${v[0].toLowerCase()}.png`), 0, 0, u, m), p && bn(w, t, v[0]);
      const C = h(), T = C.getContext("2d");
      T.drawImage(o(`${ye}/${v[1].toLowerCase()}.png`), 0, 0, u, m), p && bn(C, t, v[1]), T.globalCompositeOperation = "destination-in";
      const R = T.createLinearGradient(
        u * (p ? 0.22 : 0.43),
        0,
        u * (p ? 0.36 : 0.57),
        0
      );
      R.addColorStop(0, "#0000"), R.addColorStop(1, "#000"), T.fillStyle = R, T.fillRect(0, 0, u, m), S.drawImage(C, 0, 0), C.width = C.height = 0;
    }
    return w;
  };
  if (d.drawImage(i, 0, 0), I(t).length === 2) {
    const y = c(t, !1), p = y.getContext("2d");
    Vt(t) || (p.globalCompositeOperation = "destination-in", p.drawImage(o(Mi), 0, 0, u, m)), d.drawImage(y, 0, 0), y.width = y.height = 0;
  }
  const g = c(r, !0), f = g.getContext("2d");
  if (f.globalCompositeOperation = "destination-in", f.drawImage(o(Ti), 0, 0, u, m), d.save(), Vt(r) && (d.filter = "grayscale(1)"), d.drawImage(g, 0, 0), d.restore(), g.width = g.height = 0, Vt(t)) {
    d.save(), d.scale(u / 488, m / 680), d.beginPath();
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
      d.drawImage(o(Ri), 22, 7, 196, 19, 29, y, 432, p);
    d.restore();
  }
  const b = u * m * 4;
  for (const [y, p] of Re) {
    if (wn + b <= 16 * 1024 * 1024) break;
    wn -= p.width * p.height * 4, Re.delete(y), p.width = p.height = 0;
  }
  return b <= 16 * 1024 * 1024 && (Re.set(s, l), wn += b), l;
}
const lm = ["ice", "chr", "all"], dm = { leg: { "Adun Oakenshield": "{G}{R}{B}", "Angus Mackenzie": "{W}{U}{G}", "Arcades Sabboth": "{2}{W}{W}{G}{G}{U}{U}", "Axelrod Gunnarson": "{4}{B}{B}{R}{R}", "Ayesha Tanaka": "{U}{U}{W}{W}", "Barktooth Warbeard": "{4}{B}{R}{R}", "Bartel Runeaxe": "{3}{G}{R}{B}", "Boris Devilboon": "{3}{B}{R}", Chromium: "{2}{B}{B}{U}{U}{W}{W}", "Dakkon Blackblade": "{2}{B}{U}{U}{W}", "Gabriel Angelfire": "{3}{W}{W}{G}{G}", "Gosta Dirk": "{3}{W}{W}{U}{U}", "Gwendlyn Di Corci": "{R}{B}{B}{U}", Halfdane: "{1}{B}{U}{W}", "Hazezon Tamar": "{4}{W}{G}{R}", "Hunding Gjornersen": "{3}{U}{U}{W}", "Jacques le Vert": "{1}{W}{G}{R}", "Jasmine Boreal": "{3}{W}{G}", "Jedit Ojanen": "{4}{U}{W}{W}", "Jerrard of the Closed Fist": "{3}{G}{G}{R}", Johan: "{3}{W}{G}{R}", "Kasimir the Lone Wolf": "{4}{U}{W}", "Kei Takahashi": "{2}{W}{G}", "Lady Caleria": "{3}{W}{W}{G}{G}", "Lady Evangela": "{B}{U}{W}", "Lady Orca": "{5}{B}{R}", "Livonya Silone": "{2}{G}{G}{R}{R}", "Lord Magnus": "{3}{W}{W}{G}", "Marhault Elsdragon": "{3}{G}{R}{R}", Nebuchadnezzar: "{3}{B}{U}", "Nicol Bolas": "{2}{U}{U}{B}{B}{R}{R}", "Palladia-Mors": "{2}{W}{W}{G}{G}{R}{R}", "Pavel Maliki": "{4}{B}{R}", "Princess Lucrezia": "{3}{B}{U}{U}", Ragnar: "{U}{W}{G}", "Ramirez DePietro": "{3}{B}{B}{U}", "Ramses Overdark": "{2}{B}{B}{U}{U}", "Rasputin Dreamweaver": "{4}{W}{U}", "Riven Turnbull": "{5}{B}{U}", "Rohgahh of Kher Keep": "{2}{B}{B}{R}{R}", "Rubinia Soulsinger": "{2}{U}{W}{G}", "Sir Shandlar of Eberyn": "{4}{W}{G}", "Sivitri Scarzam": "{5}{B}{U}", "Sol'kanar the Swamp King": "{2}{R}{B}{U}", Stangg: "{4}{G}{R}", "Sunastian Falconer": "{3}{G}{R}", "Tetsuo Umezawa": "{R}{B}{U}", "The Lady of the Mountain": "{4}{G}{R}", "Tobias Andrion": "{3}{U}{W}", "Tor Wauki": "{2}{B}{B}{R}", "Torsten Von Ursus": "{3}{W}{G}{G}", "Tuknir Deathlock": "{G}{G}{R}{R}", "Ur-Drago": "{3}{B}{B}{U}{U}", "Vaevictis Asmadi": "{2}{B}{B}{R}{R}{G}{G}", "Xira Arien": "{G}{R}{B}" }, drk: { "Dark Heart of the Wood": "{B}{G}", "Marsh Goblins": "{B}{R}", "Scarwood Goblins": "{G}{R}" } }, Bs = {
  wubrgSets: lm,
  overrides: dm
};
function Hi(t, e) {
  const r = t.setCode?.toLowerCase() ?? "", n = Bs.overrides[r]?.[t.name ?? ""];
  if (n) {
    const s = [...n.matchAll(/\{([^}]+)\}/g)].map((a) => a[1]);
    return [...s].sort().join("|") === [...e].sort().join("|") ? s : [...e];
  }
  return !Bs.wubrgSets.includes(r) || e.some((s) => !/^(?:\d+|X|[WUBRG])$/.test(s)) ? [...e] : [
    ...e.filter((s) => !"WUBRG".includes(s)),
    ...e.filter((s) => "WUBRG".includes(s)).sort((s, a) => "WUBRG".indexOf(s) - "WUBRG".indexOf(a))
  ];
}
function Xi(t) {
  if (!/\bLand\b/.test(t)) return;
  const e = ["Plains", "Island", "Swamp", "Mountain", "Forest"].flatMap(
    (r, o) => new RegExp(`\\b${r}\\b`).test(t) ? ["WUBRG"[o]] : []
  );
  return e.length >= 1 && e.length <= 2 ? e : void 0;
}
function um(t, e, r, o, n) {
  if (!/\bLand\b/.test(t) || e.length) return;
  const s = Xi(t);
  if (s || /\b(Plains|Island|Swamp|Mountain|Forest)\b/.test(t) || ["lea", "leb", "2ed", "3ed"].includes(r?.toLowerCase() ?? ""))
    return s;
  if (!["2003", "2015", "future"].includes(o) || /\bArtifact\b/.test(t) || n == null) return;
  if (!Array.isArray(n) || !n.every((i) => typeof i == "string" && /^[WUBRGC]$/.test(i)))
    throw Error("Invalid produced mana.");
  const a = [..."WUBRG"].filter((i) => n.includes(i));
  return a.length >= 1 && a.length <= 2 ? a : void 0;
}
function mm(t) {
  const e = t.split(`
`).flatMap((r) => {
    const o = /^\(?\{T\}: Add (\{[WUBRGC]\}(?:,? (?:or )?\{[WUBRGC]\})*)\.\)?$/.exec(r);
    return o ? [...o[1].matchAll(/\{([WUBRGC])\}/g)].map((n) => n[1]) : [];
  });
  return e.length ? [...new Set(e)] : void 0;
}
function hm(t, e, r) {
  return /\b(Saga|Class|Planeswalker|Battle)\b/.test(e) || /^Level up\b/m.test(r) ? { ...t, frameAssetFamily: void 0 } : t;
}
function Xe(t) {
  return t.rulesParagraphs ?? t.rulesText.split(`
`).filter(Boolean).map((e) => ({ role: "rules", runs: [{ text: e }] }));
}
function cm(t, e, r = "oracle", o = {}) {
  const n = e[r];
  if (!n) throw Error(`Missing ${r} printing wording`);
  if (typeof n.typeLine != "string" || typeof n.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const s = o.rulesAlignment ?? r, a = s === "left" ? void 0 : e[s];
  if (s !== "left" && !a) throw Error(`Missing ${s} alignment wording`);
  const i = _({ ...t, typeLine: e.oracle.typeLine });
  return {
    ...t,
    ...n,
    canonicalTypeLine: t.canonicalTypeLine ?? e.oracle.typeLine,
    frameColors: t.frameColors ?? (i.land && !t.colors?.length ? Xi(t.canonicalTypeLine ?? e.oracle.typeLine) : void 0),
    manaSymbols: n.manaSymbols ?? (r === "original" ? Hi(t, t.manaSymbols ?? []) : e.oracle.manaSymbols ?? t.manaSymbols),
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: n.rulesParagraphs,
    rulesAlignment: a ? { mode: "auto", reference: Xe(a) } : { mode: "left" },
    artifact: t.artifact ?? i.artifact,
    land: t.land ?? i.land,
    creature: t.creature ?? i.creature,
    legendary: t.legendary ?? i.legendary,
    wordingMode: r,
    symbolStyle: o.symbolStyle ?? (r === "oracle" ? "modern" : "original")
  };
}
const Is = {
  permanent: { x: 261, y: 438, width: 189, height: 178 },
  spell: { x: 41.7, y: 499, width: 191, height: 122 }
};
function gm(t, e) {
  const r = e.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const o = (h) => {
    const c = Xe({
      rulesText: h.rulesText ?? "",
      rulesParagraphs: h.rulesParagraphs
    });
    return h.rulesAlignment?.mode === "left" ? c.map((g) => g.role === "rules" ? { ...g, align: "left" } : g) : c;
  }, n = { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: !0 }, s = o(e), a = {
    ...Is.permanent,
    exclusions: e.power != null && e.toughness != null ? [[368, 601, 94, 51]] : []
  }, i = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? s : s, l = e.rulesAlignment?.mode !== "left" && i.length === 1 && i[0].role === "rules" ? He(t, s, i, a, 22.5, 9, 1, n) : null, d = o(r), u = Is.spell, m = G(t, d, u, 20.25, 20.25, n);
  return {
    permanent: l || G(t, s, a, 22.5, 9, n),
    spell: !m.overflow && m.lines.length <= 4 ? m : G(t, d, u, 22.5, 9, n)
  };
}
function fm(t) {
  const e = (t.rarity ?? "common")[0].toUpperCase(), r = t.collectorNumber ?? "";
  if ((t.collectorFormat ?? (t.setCode?.toLowerCase() === "woe" ? "rarity-first" : "number-first")) === "number-first") return `${r} ${e}`.trim();
  const n = r.split("/")[0].replace(/^(\d+)/, (s) => s.padStart(4, "0"));
  return `${e} ${n}`.trim();
}
function Ji(t, e, r) {
  if (e.power != null && e.toughness != null) {
    const n = r.get(Io(e));
    if (!n) throw Error("Adventure power/toughness plate is unavailable.");
    const [s, a, i, l] = Go.stats;
    t.drawImage(n, s * 488, a * 680, i * 488, l * 680), t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.font = '700 25px "CardRenderer MTG Beleren Small Caps", Georgia', dt(t, `${e.power}/${e.toughness}`, 420, 627, 77, e.textInk);
  }
  if (Nt(e)) {
    const n = r.get(fr);
    if (!n) throw Error("Adventure authenticity stamp is unavailable.");
    t.drawImage(n, ...Ue.saga);
  }
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(fm(e), 32, 645), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.artist && (t.font = '11px "CardRenderer MTG Artist Credit", serif', t.fillText("a", 93, 658), t.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', t.fillText(e.artist, 108, 658, 210)), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 658, 182));
}
let Gs = null;
function Ki() {
  return Gs ??= document.fonts.load('700 25px "CardRenderer MTG Beleren Small Caps"').then((t) => {
    if (!t.length || t.some((e) => e.status !== "loaded"))
      throw Error("Inset card footer lettering needs card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw Gs = null, t;
  });
}
function pm(t, e, r) {
  if (t.drawImage(im(e, r), 0, 0, 488, 680), _(e).legendary) {
    const o = r.get(xi(e));
    if (!o) throw Error("Adventure crown is unavailable.");
    t.fillStyle = Tt(e) ?? "#000", t.fillRect(19.2, 18.8, 449.6, 12.1), t.drawImage(o, 13.4, 13, 461.4, 113.4);
  }
}
function bm(t, e, r) {
  const o = e.manaSymbols ?? [], n = 23.4, s = 1.8, a = 452, i = o.length * n + Math.max(0, o.length - 1) * s;
  t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle", rt(
    t,
    e.name,
    41.7,
    51,
    (o.length ? a - i - 8 : 449) - 41.7,
    26,
    !0
  ), o.forEach(
    (f, b) => et(t, f, a - i + b * (n + s), 38.7, n, r, !0)
  );
  const l = Q(e), d = r.get(l ?? ""), u = ae(e), m = d ? Math.min(58.56 / (d.width * u[2]), 27.9 / (d.height * u[3])) : 0, h = d ? d.width * u[2] * m : 0, c = d ? d.height * u[3] * m : 0, g = [450.3 - h, 402 - c / 2, h, c];
  rt(
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
  ), d && (_t(l) || e.setSymbol ? t.drawImage(d, ...g) : te(t, d, e.setCode, e.rarity, ...g, u));
}
function ym(t, e, r) {
  const o = e.manaSymbols ?? [], n = 19.8, s = 1.2, a = 233, i = o.length * n + Math.max(0, o.length - 1) * s;
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "middle", rt(
    t,
    e.name,
    40,
    443,
    (o.length ? a - i - 4 : a) - 40,
    20.1,
    !0
  ), o.forEach(
    (l, d) => et(t, l, a - i + d * (n + s), 432, n, r, !0)
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
function wm(t, e, r, o, n) {
  const s = e.faces?.[1];
  if (!s) throw Error("Adventure spell is missing.");
  t.save(), t.fillStyle = Tt(e) ?? "#000", t.fillRect(0, 0, 488, 680), o && t.drawImage(o, 0, 0, 488, 680), n !== "artwork" && pm(t, e, r);
  const [a, i, l, d] = Go.art;
  if (Ft(t, e, r, [a * 488, i * 680, l * 488, d * 680], n), n !== "artwork") {
    bm(t, e, r), ym(t, s, r);
    const u = gm(t, e);
    Ct(t, u.permanent, r), Ct(t, u.spell, r), Ji(t, e, r);
  }
  t.restore();
}
const xe = /* @__PURE__ */ new Map(), Sn = /* @__PURE__ */ new WeakMap();
let Sm = 0, vn = 0;
const vm = (t) => (Sn.has(t) || Sn.set(t, ++Sm), Sn.get(t));
function Cm(t, e) {
  const r = qe(t), o = (w) => {
    const S = e.get(w);
    if (!S) throw Error(`Prepared asset unavailable: ${w}`);
    return S;
  }, n = Ai(t).map(o), s = Oe(t), a = Oe(r), i = _(t).legendary, l = JSON.stringify([
    s,
    a,
    i,
    Vt(r),
    n.map(vm)
  ]), d = xe.get(l);
  if (d)
    return xe.delete(l), xe.set(l, d), d;
  const u = o($e(t)), m = u.width, h = u.height, c = () => {
    const w = document.createElement("canvas");
    return w.width = m, w.height = h, w;
  }, g = c(), f = g.getContext("2d");
  f.drawImage(u, 0, 0);
  const b = (w, S, v = !1) => {
    const C = c(), T = C.getContext("2d");
    v && (T.filter = "grayscale(1)"), T.drawImage(w, 0, 0, m, h), T.filter = "none", T.globalCompositeOperation = "destination-in", T.drawImage(o(Er(S)), 0, 0, m, h), f.drawImage(C, 0, 0), C.width = C.height = 0;
  }, y = (w) => o(`${tn}/${w.toLowerCase()}.png`);
  if (s.length === 2) {
    const w = c(), S = w.getContext("2d");
    S.drawImage(y(s[0]), 0, 0, m, h);
    const v = c(), C = v.getContext("2d");
    C.drawImage(y(s[1]), 0, 0, m, h), C.globalCompositeOperation = "destination-in";
    const T = C.createLinearGradient(m * 0.43, 0, m * 0.57, 0);
    T.addColorStop(0, "#0000"), T.addColorStop(1, "#000"), C.fillStyle = T, C.fillRect(0, 0, m, h), S.drawImage(v, 0, 0), b(w, "pinline"), b(y(s[0]), "rules"), b(y(s[1]), "rulesRight"), w.width = w.height = v.width = v.height = 0;
  }
  if (a.length === 2 ? (b(y(a[0]), "prepare"), b(y(a[1]), "prepareRight"), b(o($e(r)), "prepareTypeTitle", Vt(r))) : b(o($e(r)), "prepare"), i) {
    f.save(), f.scale(m / 488, h / 680), f.fillStyle = Tt(t) ?? "#000", f.fillRect(19.2, 18.8, 449.6, 12.1);
    const w = s.length === 2 ? s : [Po(t)];
    if (f.drawImage(o(Nn(w[0])), 13.4, 13, 461.4, 113.4), w.length === 2) {
      const S = c(), v = S.getContext("2d");
      v.scale(m / 488, h / 680), v.drawImage(o(Nn(w[1])), 13.4, 13, 461.4, 113.4), v.globalCompositeOperation = "destination-in";
      const C = v.createLinearGradient(210, 0, 278, 0);
      C.addColorStop(0, "#0000"), C.addColorStop(1, "#000"), v.fillStyle = C, v.fillRect(0, 0, 488, 680), f.drawImage(S, 0, 0, 488, 680), S.width = S.height = 0;
    }
    f.restore();
  }
  const p = m * h * 4;
  for (const [w, S] of xe) {
    if (vn + p <= 16 * 1024 * 1024) break;
    vn -= S.width * S.height * 4, xe.delete(w), S.width = S.height = 0;
  }
  return p <= 16 * 1024 * 1024 && (xe.set(l, g), vn += p), g;
}
function km(t, e) {
  const r = qe(e), o = (n, s, a, i) => {
    const l = Xe({
      rulesText: n.rulesText ?? "",
      rulesParagraphs: n.rulesParagraphs
    });
    return G(
      t,
      n.rulesAlignment?.mode === "left" ? l.map((d) => d.role === "rules" ? { ...d, align: "left" } : d) : l,
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
    permanent: o(
      e,
      Fo.rules,
      21.75,
      Nt(e) ? [[213, 620, 63, 26]] : []
    ),
    spell: o(
      r,
      lu.rules,
      21.75,
      e.power != null && e.toughness != null ? [[370, 603, 93, 49]] : []
    )
  };
}
function Tm(t, e, r) {
  t.drawImage(Cm(e, r), 0, 0, 488, 680);
}
function Mm(t, e, r) {
  const o = (h, c) => {
    const g = h.manaSymbols ?? [], f = c ? 19.8 : 23.4, b = c ? 1.2 : 1.8, y = c ? 1042 / 2010 * 488 : 41.7, p = 452, w = g.length * f + Math.max(0, g.length - 1) * b;
    t.fillStyle = c ? "#fff" : "#17140f", t.textAlign = "left", t.textBaseline = "middle", rt(
      t,
      h.name,
      y,
      c ? 444 : 52,
      (g.length ? p - w - (c ? 4 : 8) : p) - y,
      c ? 20 : 26,
      !0
    ), g.forEach(
      (S, v) => et(
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
  o(e, !1);
  const n = Q(e), s = r.get(n ?? ""), a = ae(e), i = s ? Math.min(58.56 / (s.width * a[2]), 27.9 / (s.height * a[3])) : 0, l = s ? s.width * a[2] * i : 0, d = s ? s.height * a[3] * i : 0, u = [450.3 - l, 402 - d / 2, l, d];
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
  ), s && (_t(n) || e.setSymbol ? t.drawImage(s, ...u) : te(t, s, e.setCode, e.rarity, ...u, a));
  const m = qe(e);
  o(m, !0), rt(
    t,
    m.typeLine ?? "",
    1042 / 2010 * 488,
    477,
    195.2,
    20,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    m.textInk
  );
}
function Rm(t, e, r, o, n) {
  qe(e), t.save(), t.fillStyle = Tt(e) ?? "#000", t.fillRect(0, 0, 488, 680), o && t.drawImage(o, 0, 0, 488, 680), n !== "artwork" && Tm(t, e, r);
  const [s, a, i, l] = Fo.art;
  if (Ft(t, e, r, [s * 488, a * 680, i * 488, l * 680], n), n !== "artwork") {
    Mm(t, e, r);
    const d = km(t, e);
    Ct(t, d.permanent, r), Ct(t, d.spell, r), Ji(
      t,
      { ...e, collectorFormat: e.collectorFormat ?? "rarity-first" },
      r
    );
  }
  t.restore();
}
function xm(t, e, r) {
  t.fillStyle = Tt(e) ?? "#000", t.fillRect(0, 0, 488, 680);
  const o = $t(e), n = o.map((s) => tu(s.face, r));
  if (o.forEach((s, a) => {
    t.save(), t.beginPath(), t.rect(0, a ? 0 : 324, 488, a ? 324 : 356), t.clip(), t.drawImage(n[a], 0, 0, 488, 680), t.restore();
  }), o[0]?.face.layout?.endsWith("-fuse")) {
    const s = document.createElement("canvas");
    s.width = 488, s.height = 680;
    const a = s.getContext("2d");
    a.drawImage(n[1], 0, 0, 488, 680), a.globalCompositeOperation = "destination-in";
    const i = a.createLinearGradient(0, 344, 0, 304);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), a.fillStyle = i, a.fillRect(0, 0, 488, 680), t.save(), t.beginPath(), t.rect(434, 0, 54, 680), t.clip(), t.drawImage(n[0], 0, 0, 488, 680), t.drawImage(s, 0, 0), t.restore(), s.width = s.height = 0;
  }
}
function Em(t, e, r) {
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
  const l = Q(e), d = r.get(l ?? ""), u = ae(e), m = d ? Math.min(26 / (d.width * u[2]), 15.5 / (d.height * u[3])) : 0, h = d ? d.width * u[2] * m : 0, c = d ? d.height * u[3] * m : 0;
  if (rt(
    t,
    e.typeLine ?? "",
    70,
    277,
    (d ? 331 - h - 6 : 331) - 70,
    18.5,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  ), d) {
    const g = [331 - h, 277 - c / 2, h, c];
    _t(l) || e.setSymbol ? t.drawImage(d, ...g) : te(t, d, e.setCode, e.rarity, ...g, u);
  }
}
function Am(t, e, r) {
  t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic";
  const o = [
    ...new Set((e.faces ?? []).map((n) => n.artist ?? e.artist ?? "").filter(Boolean))
  ].join(" & ");
  if (t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""} ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    646
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 660), o && (t.font = '11px "CardRenderer MTG Artist Credit", serif', t.fillText("a", 95, 660), t.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', t.fillText(o, 110, 660, 193)), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 455, 646, 170)), Nt(e)) {
    const n = r.get(li);
    if (!n) throw Error("Modern split authenticity stamp unavailable.");
    t.drawImage(n, ...Ue.split);
  }
}
const Cn = J.MSE_SPLIT_BRIDGE_ROOT;
function Vi(t, e) {
  const r = I(t);
  r.length === 2 && "WUBRG".indexOf(r[1]) - "WUBRG".indexOf(r[0]) > 2 && r.reverse();
  const o = (e ? r[0] : r.at(-1))?.toLowerCase() ?? "c";
  return {
    color: `${Cn}/${o}bridge.png`,
    gold: r.length > 1 ? `${Cn}/mbridge.png` : null,
    mask: r.length > 1 ? `${Cn}/bridgemask.png` : null
  };
}
function Lm(t) {
  return (t.faces ?? []).flatMap((e, r) => Object.values(Vi(e, r)));
}
function Om(t, e, r) {
  const o = (u) => {
    const m = r.get(u);
    if (!m) throw Error(`Fuse bridge asset unavailable: ${u}`);
    return m;
  }, n = e.faces.map((u, m) => {
    const h = Vi(u, m), c = o(h.color), g = document.createElement("canvas");
    g.width = c.width, g.height = c.height;
    const f = g.getContext("2d");
    return f.drawImage(c, 0, 0), h.gold && h.mask && (f.globalCompositeOperation = "destination-in", f.drawImage(Oi(o(h.mask)), 0, 0, g.width, g.height), f.globalCompositeOperation = "destination-over", f.drawImage(o(h.gold), 0, 0, g.width, g.height)), g;
  }), [s, a] = n, i = a.getContext("2d");
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
  for (const u of n) u.width = u.height = 0;
}
function $m(t, e, r, o) {
  const [n, s, a, i] = Ye(r, o).rules, l = Xe({
    rulesText: e.rulesText ?? "",
    rulesParagraphs: e.rulesParagraphs
  }), d = { x: n, y: s, width: a, height: i }, u = {
    leading: 1.02,
    paragraphGap: 0.4,
    flavorGap: 0.65,
    centerOffset: r === "old" ? 0 : 2
  }, m = r === "old" ? 24.5 : r === "m15" ? o ? 20.25 : 24.25 : 21.5;
  if ((r !== "m15" || o) && e.rulesAlignment?.mode !== "left" && l.length === 1) {
    const h = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? l : l, c = He(t, l, h, d, m, 13, 2, u);
    if (c) return c;
  }
  return G(t, l, d, m, 13, u);
}
function Bm(t, e, r) {
  const o = jt(e);
  if (!o) throw Error("No native split plate for this printing.");
  if (o === "m15") return xm(t, e, r);
  const n = o !== "old" && _e(e), s = Ye(o, n);
  t.fillStyle = Bt(e.setCode, e.borderColor).border, t.fillRect(0, 0, 488, 680), $t(e).forEach((a, i) => {
    const l = fu(a.face, o, n, i, r);
    t.save(), t.translate(a.x, a.y), t.rotate(-Math.PI / 2);
    const [d, u, m, h] = s.frame;
    t.drawImage(l, d - (n && i ? 8 * 680 / 523 : 0), u, m, h), t.restore();
  }), n && Om(t, e, r);
}
function Im(t, e, r, o, n) {
  if (r === "m15") return Em(t, e, n);
  const s = Ye(r, o), a = r === "old", [i, l, d, u] = s.title, m = e.manaSymbols ?? [], h = 23.4, c = 1.7, g = 316, f = m.length * h + Math.max(0, m.length - 1) * c;
  if (t.fillStyle = a ? "#f2eee3" : "#17140f", t.textBaseline = "middle", t.textAlign = "left", a) {
    const T = t.getTransform();
    t.shadowColor = "#000b", t.shadowOffsetX = T.a + T.c, t.shadowOffsetY = T.b + T.d;
  }
  rt(
    t,
    e.name,
    i,
    l + u / 2 - (a ? 2 : 0),
    Math.max(1, m.length ? g - f - i - 7 : d),
    a ? 29 : 26.5,
    !a,
    1,
    a ? "CardRenderer MTG Goudy" : "CardRenderer MTG Matrix"
  ), m.forEach(
    (T, R) => et(t, T, g - f + R * (h + c), a ? 30.5 : 40, h, n, !a)
  );
  const b = Q(e), y = n.get(b ?? ""), p = ae(e), [w, S, v, C] = s.type;
  if (rt(
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
    const T = Math.min(
      32 / (y.width * p[2]),
      (a ? 26 : 22) / (y.height * p[3])
    ), R = y.width * p[2] * T, M = y.height * p[3] * T, x = [(a ? 306 : 316) - R, S + C / 2 - (a ? 1.5 : 0) - M / 2, R, M];
    _t(b) || e.setSymbol ? t.drawImage(y, ...x) : te(t, y, e.setCode, e.rarity, ...x, p);
  }
}
function Gm(t, e, r, o, n, s) {
  const a = Ye(o, n), i = o === "old";
  t.fillStyle = i ? "#eeeae1" : "#17140f", t.textAlign = i ? "center" : "left", t.textBaseline = "middle", t.font = i ? '19px "CardRenderer MTG MPlantin", Georgia' : '700 14px "CardRenderer MTG Matrix", Georgia';
  const l = s.get(`${B}/img/manaSymbols/brush.svg`);
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
function Pm(t, e, r, o, n) {
  const s = jt(e);
  if (!s) throw Error("No native split plate for this printing.");
  const a = s !== "old" && _e(e), i = Ye(s, a);
  t.save(), n !== "artwork" && Bm(t, e, r), o && t.drawImage(o, 0, 0, 488, 680);
  for (const l of $t(e))
    t.save(), t.translate(l.x, l.y), t.rotate(-Math.PI / 2), Ft(t, l.face, r, i.art, n), n !== "artwork" && (Im(t, l.face, s, a, r), pu(t, l.face, r, i.rules[1] + i.rules[3] / 2), Ct(t, $m(t, l.face, s, a), r), s !== "m15" && Gm(t, l.face, e, s, a, r)), t.restore();
  if (s === "m15" && n !== "artwork" && Am(t, e, r), a && n !== "artwork") {
    t.translate(0, 680), t.rotate(-Math.PI / 2);
    const l = yi(e).map(
      (d) => s === "m15" ? { ...d, align: "center" } : d
    );
    Ct(
      t,
      G(
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
let Ps;
function Fm(t) {
  return jt(t) === "m15" ? Ki() : jt(t) !== "eighth" ? Promise.resolve() : Ps ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('24px "CardRenderer MTG Matrix"')
  ]).then((e) => {
    if (e.some((r) => !r.length || r.some((o) => o.status !== "loaded")))
      throw Error("Split Matrix fonts are unavailable. Load card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw Ps = void 0, e;
  });
}
const re = {
  reminder: { x: 42.3, y: 78, width: 197 },
  chapters: { x: 65.1, width: 171 },
  top: 80,
  reminderBottom: 201,
  bottom: 569,
  reverseStatsBottom: 535
}, _m = {
  maximumSize: 20.7,
  padding: 24,
  equalCells: 0,
  lastLift: 0,
  bottomSpace: 0.15
};
function Wm(t, e, r = _m) {
  const o = br(e), n = o.filter((f) => !f.badges.length), s = o.filter((f) => f.badges.length), a = (f, b = !1) => [
    {
      role: "rules",
      runs: b ? [{ text: f, italic: !0 }] : f.split(/(\([^)]*\))/g).filter(Boolean).map((y) => ({ text: y, italic: y.startsWith("(") }))
    }
  ], i = { leading: 0.98, paragraphGap: 0.3, flavorGap: 0 }, l = n.length ? re.reminderBottom : re.top, d = e.reverseStats && e.layout === "transform" ? re.reverseStatsBottom : re.bottom, u = G(
    t,
    n.flatMap((f) => a(f.text, f.reminder)),
    { ...re.reminder, height: l - re.top },
    20.4,
    12,
    { ...i, centerOffset: -3 }
  );
  let m = r.maximumSize, h = [], c = [];
  for (; ; ) {
    const f = s.map(
      (S) => Math.max(
        G(
          t,
          a(S.text),
          { ...re.chapters, y: 0, height: 2e3 },
          m,
          m,
          i
        ).height + r.padding,
        Ut.minimumRowHeight + Math.max(0, S.badges.length - 1) * Ut.gap
      )
    ), b = d - l;
    if (f.reduce((S, v) => S + v, 0) > b && m > 12) {
      m = Math.max(12, m - 0.25);
      continue;
    }
    if (f.reduce((S, v) => S + v, 0) > b)
      throw Error("Saga chapter text or badges do not fit the available column.");
    const y = Math.max(0, b - f.reduce((S, v) => S + v, 0)) * (1 - (s.length === 2 && s[0].badges.length > 1 ? r.bottomSpace : 0)) / Math.max(1, s.length);
    c = f.map((S) => S + y);
    const p = b / Math.max(1, s.length);
    c = c.map((S) => S * (1 - r.equalCells) + p * r.equalCells);
    let w = l;
    h = s.map((S, v) => {
      const C = c[v], T = G(
        t,
        a(S.text),
        { ...re.chapters, y: w + 7, height: C - 14 },
        m,
        m,
        { ...i, centerOffset: v === s.length - 1 ? -r.lastLift : 0 }
      );
      return w += C, T;
    });
    break;
  }
  let g = l;
  return {
    reminder: u,
    size: m,
    rows: s.map((f, b) => {
      const y = { ...f, top: g, height: c[b], layout: h[b] };
      return g += y.height, y;
    })
  };
}
function Um(t, e, r, o, n) {
  const s = (v) => {
    const C = r.get(v);
    if (!C) throw Error(`Saga asset unavailable: ${v}`);
    return C;
  };
  t.save(), t.fillStyle = Tt(e) ?? "#090806", t.fillRect(0, 0, k, E), o && t.drawImage(o, 0, 0, k, E), n !== "artwork" && (t.drawImage(s($o(e)), 0, 0, k, E), su(t, e, r));
  const a = ki.art;
  if (Ft(t, e, r, [a[0] * k, a[1] * E, a[2] * k, a[3] * E], n), n === "artwork") {
    t.restore();
    return;
  }
  const i = jn(e);
  i && t.drawImage(s(i), 33.5, 35.6, 29, 32), t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
  const l = e.manaSymbols ?? [], d = 23.4, u = 1.8, m = 452, h = l.length * d + Math.max(0, l.length - 1) * u, c = e.layout === "transform" ? 78 : 41.7;
  rt(
    t,
    e.name,
    c,
    51,
    (l.length ? m - h - 8 : 449) - c,
    26,
    !0
  ), l.forEach(
    (v, C) => et(t, v, m - h + C * (d + u), 38.7, d, r, !0)
  );
  const g = Q(e), f = r.get(g ?? ""), b = ae(e), y = f ? Math.min(58.56 / (f.width * b[2]), 25.9 / (f.height * b[3])) : 0, p = f ? f.width * b[2] * y : 0, w = f ? f.height * b[3] * y : 0, S = [450.3 - p, 594.25 - w / 2, p, w];
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
  ), f && (_t(g) || e.setSymbol ? t.drawImage(f, ...S) : te(t, f, e.setCode, e.rarity, ...S, b)), e.reverseStats && e.layout === "transform" && (t.fillStyle = "#65605a", t.font = 'italic 20px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.fillText(`${e.reverseStats.power}/${e.reverseStats.toughness}`, 41, 553)), Qt(t)) {
    const v = Wm(t, e);
    Ct(t, v.reminder, r);
    for (const C of v.rows)
      t.drawImage(s(Ci), 48.8, C.top - 1, 192.6, 2), Ct(t, C.layout, r), C.badges.forEach((T, R) => {
        const M = C.top + C.height / 2 + (R - (C.badges.length - 1) / 2) * Ut.gap;
        t.drawImage(
          s(vi),
          Ut.x,
          M - Ut.height / 2,
          Ut.width,
          Ut.height
        ), t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.font = `550 ${Ut.fontSize}px "${Ut.fontFamily}", Georgia`, t.fillText(
          T,
          Ut.centerX,
          M + Ut.numeralOffsetY
        );
      });
  }
  Nt(e) && t.drawImage(s(fr), ...Ue.saga), t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""}  ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.font = '11px "CardRenderer MTG Artist Credit", serif', e.artist && t.fillText("a", 93, 658), t.font = '11px "CardRenderer MTG Beleren", serif', t.fillText(e.artist ?? "", 108, 658, 210), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 646, 182)), t.restore();
}
let Fs = null;
function jm() {
  return Fs ??= document.fonts.load('550 22px "CardRenderer MTG Chapter"').then((t) => {
    if (!t.length || t.some((e) => e.status !== "loaded"))
      throw Error("Saga chapter numerals need card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw Fs = null, t;
  });
}
function Nm(t, e, r) {
  const [o, n, s, a] = (r ? Oo : Lo).rules, i = Xe({
    rulesText: e.rulesText ?? "",
    rulesParagraphs: e.rulesParagraphs
  }), l = { x: o, y: n, width: s, height: a }, d = {
    leading: 0.98,
    paragraphGap: 0.32,
    flavorGap: 0.65,
    centerOffset: r ? 0 : 2.5
  };
  let u = r ? 22 : e.setCode?.toLowerCase() === "hou" ? 24.5 : 22.5, m = G(t, i, l, u, 14, d);
  if (!r && i.length === 1 && m.lines.length > 1 && m.lines.at(-1).width < s * 0.18)
    for (let h = u - 0.25; h >= u * 0.9; h -= 0.25) {
      const c = G(t, i, l, h, h, d);
      if (!c.overflow && c.lines.length < m.lines.length) {
        u = h, m = c;
        break;
      }
    }
  if (!r && e.rulesAlignment?.mode !== "left") {
    const h = e.rulesAlignment?.mode === "auto" ? e.rulesAlignment.reference ?? i : i, c = He(
      t,
      i,
      h,
      l,
      u,
      14,
      1,
      d
    );
    if (c) return c;
  }
  return m;
}
function Dm(t, e, r, o, n) {
  const s = $t(e), a = (i) => {
    const l = r.get(i);
    if (!l) throw Error(`Aftermath asset unavailable: ${i}`);
    return l;
  };
  t.save(), t.fillStyle = Tt(e) ?? "#090806", t.fillRect(0, 0, 488, 680), o && t.drawImage(o, 0, 0, 488, 680), n !== "artwork" && s.forEach((i, l) => {
    t.save(), t.beginPath(), t.rect(0, l ? ge : 0, 488, l ? 680 - ge : ge), t.clip(), t.drawImage(a(gi(i.face)), 0, 0, 488, 680), t.restore();
  }), s.forEach((i, l) => {
    t.save(), l && (t.translate(488, ge), t.rotate(Math.PI / 2));
    const d = i.face, u = l ? Oo : Lo;
    if (Ft(t, d, r, u.art, n), n !== "artwork") {
      t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
      const m = d.manaSymbols ?? [], h = 23.4, c = 1.6, g = l ? 246 : 451, f = m.length * h + Math.max(0, m.length - 1) * c, [b, y] = u.title;
      rt(t, d.name, b, y + 15.5, g - f - b - 7, 26, !0), m.forEach(
        (w, S) => et(t, w, g - f + S * (h + c), y + 3, h, r, !0)
      );
      const p = l ? void 0 : r.get(Q(d) ?? "");
      if (rt(
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
        const w = ae(d), S = Math.min(50 / (p.width * w[2]), 27 / (p.height * w[3])), v = p.width * w[2] * S, C = p.height * w[3] * S, T = [451 - v, 252.3 - C / 2, v, C];
        _t(Q(d)) || d.setSymbol ? t.drawImage(p, ...T) : te(t, p, d.setCode, d.rarity, ...T, w);
      }
      Ct(t, Nm(t, d, !!l), r);
    }
    t.restore();
  }), n !== "artwork" && (Nt(e) && t.drawImage(a(ci), ...Ue.aftermath), t.fillStyle = "#fff", t.textAlign = "left", t.textBaseline = "alphabetic", t.font = '11px "CardRenderer MTG Relay", sans-serif', t.fillText(
    `${e.collectorNumber ?? ""}  ${(e.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), t.fillText(`${e.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.font = '11px "CardRenderer MTG Artist Credit", serif', e.artist && t.fillText("a", 93, 658), t.font = '11px "CardRenderer MTG Beleren", serif', t.fillText(e.artist ?? "", 108, 658, 220), e.legalText && (t.textAlign = "right", t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.fillText(e.legalText, 454, 646, 177))), t.restore();
}
function Zi(t, e) {
  const r = e.paper.map((i) => i * 255), o = e.sourceInk.map((i) => i * 255), n = e.inkTarget.map((i) => i * 255), s = r.map((i, l) => i - o[l]), a = s.reduce((i, l) => i + l * l, 0);
  if (!Number.isFinite(a) || a < 100)
    throw Error("Mana ink needs a contrasting paper palette.");
  for (let i = 0; i < t.length; i += 4) {
    if (t[i + 3] !== 255) continue;
    const l = Math.max(
      0,
      Math.min(1, s.reduce((d, u, m) => d + u * (r[m] - t[i + m]), 0) / a)
    );
    for (let d = 0; d < 3; d++)
      t[i + d] = Math.round(t[i + d] + (n[d] - o[d]) * l);
  }
}
function zm(t, e, r, o) {
  const n = o.inkExpansion ?? 0;
  if (!Number.isFinite(n) || n < 0 || n > 1)
    throw Error("Historical mana ink expansion is outside its supported range.");
  if (!n) return;
  if (!Number.isInteger(e) || !Number.isInteger(r) || e <= 0 || r <= 0 || t.length !== e * r * 4)
    throw Error("Historical mana ink pixels do not match their dimensions.");
  const s = be(o.discColor), a = be(o.inkColor), i = s.map((c, g) => c - a[g]), l = i.reduce((c, g) => c + g * g, 0);
  if (l < 0.01) throw Error("Historical mana palette has no ink contrast");
  const d = new Float32Array(e * r);
  for (let c = 0; c < d.length; c++)
    t[c * 4 + 3] < 255 || (d[c] = Math.max(
      0,
      Math.min(1, i.reduce((g, f, b) => g + f * (s[b] - t[c * 4 + b] / 255), 0) / l)
    ));
  const u = Math.min(e, r) * n / 24, m = Math.ceil(u), h = [];
  for (let c = -m; c <= m; c++)
    for (let g = -m; g <= m; g++) {
      const f = Math.max(0, Math.min(1, u + 1 - Math.hypot(g, c)));
      f && h.push({ x: g, y: c, weight: f });
    }
  for (let c = 0; c < r; c++)
    for (let g = 0; g < e; g++) {
      const f = c * e + g;
      if (t[f * 4 + 3] < 255) continue;
      let b = d[f];
      for (const y of h) {
        const p = g + y.x, w = c + y.y;
        p >= 0 && p < e && w >= 0 && w < r && (b = Math.max(b, d[w * e + p] * y.weight));
      }
      if (!(b <= d[f]))
        for (let y = 0; y < 3; y++)
          t[f * 4 + y] = Math.round(255 * (s[y] * (1 - b) + a[y] * b));
    }
}
function Ym(t, e, r) {
  const o = be(e.discColor), n = be(e.inkColor), s = o.map((i, l) => i - n[l]), a = s.reduce((i, l) => i + l * l, 0);
  if (a < 0.01) throw Error("Historical mana palette has no ink contrast");
  for (let i = 0; i < t.length; i += 4) {
    if (!t[i + 3]) continue;
    const l = Math.max(
      0,
      Math.min(1, s.reduce((d, u, m) => d + (t[i + m] / 255 - n[m]) * u, 0) / a)
    );
    for (let d = 0; d < 3; d++)
      t[i + d] = Math.round(255 * (n[d] * (1 - l) + r[d] * l));
  }
}
async function qm(t, e, r, o) {
  const n = document.createElement("canvas");
  n.width = t.width, n.height = t.height;
  try {
    const s = n.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("Historical mana preparation needs Canvas2D.");
    s.drawImage(t, 0, 0);
    const a = s.getImageData(0, 0, n.width, n.height);
    return e.inkExpansion && zm(a.data, n.width, n.height, e), Ym(a.data, e, r), o && Zi(a.data, o), s.putImageData(a, 0, 0), await createImageBitmap(n);
  } finally {
    n.width = n.height = 0;
  }
}
function Hm(t, e, r) {
  const { width: o, height: n, data: s } = t;
  if (e.width !== o || e.height !== n || e.data.length !== s.length || !Number.isInteger(r) || r < 0 || r > Math.max(o, n))
    throw RangeError("Invalid frame material selection");
  const a = new Uint8Array(o * n), i = new Uint8Array(o * n), l = new Int32Array(Math.max(o, n));
  for (const d of [!1, !0]) {
    const u = d ? n : o, m = d ? o : n;
    for (let h = 0; h < m; h++) {
      let c = 0, g = 0, f = -1;
      const b = (p) => d ? p * o + h : h * o + p, y = (p) => d ? a[b(p)] : s[b(p) * 4 + 3];
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
  if (e.width !== t.width || e.height !== t.height || e.data.length !== t.data.length || !Number.isFinite(r.amount) || r.amount < 0 || r.amount > 1 || r.backdrop.length !== 3 || r.backdrop.some((o) => !Number.isFinite(o) || o < 0 || o > 1))
    throw RangeError("Invalid frame material blend");
  for (let o = 0; o < t.data.length; o += 4) {
    if (!t.data[o + 3] || !e.data[o + 3]) continue;
    const n = r.amount * e.data[o + 3] / 255;
    for (let s = 0; s < 3; s++)
      t.data[o + s] = Math.round(
        t.data[o + s] * (1 - n) + Math.min(t.data[o + s], 255 * r.backdrop[s]) * n
      );
  }
}
function Jm(t, e) {
  const { width: r, height: o, data: n } = t, s = new Uint8Array(r * o), a = new Uint32Array(r * o);
  let i = 0;
  if (e) {
    for (let d = 0; d < r * o; d++) {
      const u = d * 4;
      n[u + 3] && e.data[u + 3] && Math.max(n[u], n[u + 1], n[u + 2]) < 96 && (a[i++] = d);
    }
    return a.slice(0, i);
  }
  const l = (d, u) => {
    if (d < 0 || u < 0 || d >= r || u >= o || d > r * 0.075 && d < r * 0.925 && u > o * 0.06 && u < o * 0.94) return;
    const m = u * r + d;
    if (s[m]) return;
    s[m] = 1;
    const h = m * 4, c = n[h], g = n[h + 1], f = n[h + 2];
    !n[h + 3] || Math.max(c, g, f) >= 96 || Math.max(c, g, f) - Math.min(c, g, f) > 6 || (a[i++] = m);
  };
  for (let d = 0; d < r; d++)
    l(d, 0), l(d, o - 1);
  for (let d = 0; d < o; d++)
    l(0, d), l(r - 1, d);
  for (let d = 0; d < i; d++) {
    const u = a[d], m = u % r, h = Math.floor(u / r);
    l(m - 1, h), l(m + 1, h), l(m, h - 1), l(m, h + 1);
  }
  return a.slice(0, i);
}
function Km(t, e, r, o, n) {
  Qi(o);
  for (const s of r) {
    const a = s * 4, i = Math.max(0, 1 - Math.max(e[a], e[a + 1], e[a + 2]) / 96) ** 2, l = n ? n.data[a + 3] / 255 : 1;
    for (let d = 0; d < 3; d++)
      t.data[a + d] = Math.round(
        t.data[a + d] * (1 - l) + (e[a + d] + o[d] * 255 * i) * l
      );
  }
}
function Qi(t) {
  if (t.length !== 3 || t.some((e) => !Number.isFinite(e) || e < 0 || e > 48 / 255))
    throw RangeError("Invalid baked stock black level");
}
const kn = (t) => {
  const e = Math.max(0, Math.min(1, t));
  return e * e * (3 - 2 * e);
}, Tn = (t) => {
  const e = Math.max(1e-3, t[0] + t[1] + t[2]);
  return t.map((r) => r / e);
};
function _s(t, e) {
  const { width: r, height: o, data: n } = t, s = new Float32Array(r * o);
  if (e.kind === "polygon") {
    if (e.points.length < 3 || !Number.isFinite(e.feather) || e.feather <= 0 || e.points.some((M) => M.some((x) => !Number.isFinite(x) || x < 0 || x > 1)))
      throw Error(
        "Paper outline requires at least three normalized points and positive feathering."
      );
    const w = e.points.map(([M, x]) => [M * r, x * o]), S = e.feather * r, v = Math.max(0, Math.floor(Math.min(...w.map((M) => M[0])) - S)), C = Math.min(r, Math.ceil(Math.max(...w.map((M) => M[0])) + S)), T = Math.max(0, Math.floor(Math.min(...w.map((M) => M[1])) - S)), R = Math.min(o, Math.ceil(Math.max(...w.map((M) => M[1])) + S));
    for (let M = T; M < R; M++)
      for (let x = v; x < C; x++) {
        let A = !1, F = 1 / 0;
        const L = x + 0.5, U = M + 0.5;
        for (let O = 0; O < w.length; O++) {
          const [V, D] = w[O], [Z, ut] = w[(O + 1) % w.length], it = Z - V, z = ut - D, N = it * it + z * z, P = N ? Math.max(0, Math.min(1, ((L - V) * it + (U - D) * z) / N)) : 0;
          F = Math.min(F, Math.hypot(L - V - P * it, U - D - P * z)), D > U != ut > U && L < V + (U - D) * it / z && (A = !A);
        }
        s[M * r + x] = kn((A ? F : -F) / S + 0.5);
      }
    return s;
  }
  if (e.kind === "rect") {
    const [w, S, v, C] = e.rect;
    for (let T = 0; T < o; T++)
      for (let R = 0; R < r; R++) {
        const M = Math.min(
          R / r - w,
          w + v - R / r,
          T / o - S,
          S + C - T / o
        );
        s[T * r + R] = kn(M / e.feather + 0.5);
      }
    return s;
  }
  const a = Tn(e.frameRgb), i = Tn(e.paperRgb), l = i.map((w, S) => w - a[S]), d = l.reduce((w, S) => w + S * S, 0);
  if (d < 1e-3) throw Error("Paper and frame chroma are too similar for this mask.");
  const [u, m, h, c] = e.bounds;
  for (let w = 0; w < o; w++)
    for (let S = 0; S < r; S++) {
      if (S / r < u || S / r > u + h || w / o < m || w / o > m + c)
        continue;
      const v = w * r + S, C = v * 4;
      if (n[C + 3] < 250) continue;
      const R = Tn([n[C] / 255, n[C + 1] / 255, n[C + 2] / 255]).reduce((M, x, A) => M + (x - a[A]) * l[A], 0) / d;
      s[v] = kn((R - 0.22) / 0.56);
    }
  const g = new Uint8Array(s.length), f = new Int32Array(s.length), b = Math.round(e.seed[1] * o) * r + Math.round(e.seed[0] * r);
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
const Mn = (t) => {
  const e = Math.max(0, Math.min(1, t));
  return e * e * (3 - 2 * e);
}, Ws = ([t, e, r, o], n, s) => n >= t && s >= e && n < t + r && s < e + o;
function Vm(t, e) {
  if (!(e.hueCenter >= 0 && e.hueCenter < 360) || !(e.hueRadius > 0 && e.hueRadius <= 180) || !(e.hueFeather > 0 && e.hueFeather <= e.hueRadius) || !(e.saturation[0] >= 0 && e.saturation[1] > e.saturation[0] && e.saturation[1] <= 1) || e.brightness !== void 0 && !(e.brightness[0] >= 0 && e.brightness[1] > e.brightness[0] && e.brightness[1] <= 1))
    throw Error("Invalid source pigment mask.");
  for (const { outer: o, inner: n } of e.rings)
    if (![...o, ...n].every(Number.isFinite) || o[2] <= 0 || o[3] <= 0 || n[2] <= 0 || n[3] <= 0 || n[0] < o[0] || n[1] < o[1] || // Normalized shared edges can differ by one floating-point rounding bit.
    n[0] + n[2] > o[0] + o[2] + 1e-12 || n[1] + n[3] > o[1] + o[3] + 1e-12)
      throw Error("Source pigment rings need nested positive rectangles.");
  const r = new Float32Array(t.width * t.height);
  for (let o = 0; o < t.height; o++)
    for (let n = 0; n < t.width; n++) {
      const s = o * t.width + n, a = s * 4, i = (n + 0.5) / t.width, l = (o + 0.5) / t.height;
      if (!t.data[a + 3] || !e.rings.some((c) => Ws(c.outer, i, l) && !Ws(c.inner, i, l)))
        continue;
      const [d, u, m] = Dr([
        t.data[a] / 255,
        t.data[a + 1] / 255,
        t.data[a + 2] / 255
      ]), h = Math.abs((d - e.hueCenter + 540) % 360 - 180);
      r[s] = Mn((e.hueRadius - h) / e.hueFeather) * Mn((u - e.saturation[0]) / (e.saturation[1] - e.saturation[0])) * (e.brightness ? Mn((m - e.brightness[0]) / (e.brightness[1] - e.brightness[0])) : 1);
    }
  return r;
}
function Zm(t, e, r, o) {
  if ("mask" in e)
    for (const m of [
      e.frame,
      e.paper,
      ...e.regions?.map((h) => h.adjustment) ?? [],
      ...e.accents?.map((h) => h.adjustment) ?? []
    ])
      $s(m);
  else $s(e);
  if (e.blackPoint && Bl(e.blackPoint), e.outerStock && Qi(e.outerStock), e.outerStockMaskSource && (!o || o.width !== t.width || o.height !== t.height || o.data.length !== t.data.length))
    throw RangeError("Frame stock correction needs its source selection");
  if (e.blackPoint?.textureMaskSource && (!r || r.width !== t.width || r.height !== t.height || r.data.length !== t.data.length))
    throw RangeError("Frame texture correction needs its source selection");
  const n = "mask" in e ? e : void 0, s = n ? _s(t, n.mask) : void 0, a = "mask" in e ? e.frame : e, i = n?.regions?.map((m) => ({
    values: _s(t, m.mask),
    adjustment: m.adjustment
  })) ?? [], l = [
    ...i,
    ...n?.accents?.map((m) => ({
      values: Vm(t, m.mask),
      adjustment: m.adjustment
    })) ?? []
  ];
  for (let m = 0; m < t.data.length; m += 4) {
    if (t.data[m + 3] === 0) continue;
    const h = [t.data[m] / 255, t.data[m + 1] / 255, t.data[m + 2] / 255], c = Math.max(...h), g = c === 0 ? 0 : (c - Math.min(...h)) / c;
    if (c < 0.075 || !n && g < 0.025 && c > 0.97) continue;
    const f = s?.[m / 4] ?? 0, b = Yt(h, f === 1 && n ? n.paper : a), y = f > 0 && f < 1 && n ? Yt(h, n.paper) : b;
    for (let p = 0; p < 3; p++)
      t.data[m + p] = Math.round(
        Math.round(255 * b[p]) * (1 - f) + Math.round(255 * y[p]) * f
      );
    for (const p of l) {
      const w = p.values[m / 4];
      if (!w) continue;
      const S = Yt(h, p.adjustment);
      for (let v = 0; v < 3; v++)
        t.data[m + v] = Math.round(
          t.data[m + v] * (1 - w) + 255 * S[v] * w
        );
    }
  }
  const d = e.outerStock ? t.data.slice() : void 0, u = e.outerStock ? Jm(t, o) : void 0;
  e.blackPoint && Il(t, e.blackPoint, r), e.outerStock && d && u && Km(t, d, u, e.outerStock, o);
}
const Qm = { hueDegrees: -1.0625, saturationScale: 0.9087500000000004, brightnessScale: 0.9406250000000002, gamma: 0.738125 }, th = { W: { header: { hueDegrees: -14.024193548387075, saturationScale: 0.5265905874026912, brightnessScale: 0.9495967741935485 }, paper: { hueDegrees: -1.1750690607734668, saturationScale: 0.7998024425287352, brightnessScale: 0.9392712550607287 }, pinline: { hueDegrees: -8.203598940779898, saturationScale: 0.4898632906133164, brightnessScale: 0.9302788844621516 }, glyph: { source: [0.9882352941176471, 0.996078431372549, 1], target: [0.9431372549019608, 0.9352941176470588, 0.9372549019607843] } }, U: { header: { hueDegrees: 42.78801843317967, saturationScale: 0.45884697719052203, brightnessScale: 0.9842342342342343 }, paper: { hueDegrees: 32.97916666666663, saturationScale: 0.5842800834685827, brightnessScale: 1.0133928571428572 }, pinline: { hueDegrees: 17.557840616966587, saturationScale: 0.5557142857142856, brightnessScale: 1.1666666666666667 }, glyph: { source: [0, 0.4588235294117647, 0.7450980392156863], target: [0.396078431372549, 0.4392156862745098, 0.7176470588235293] } }, B: { header: { hueDegrees: -14.404807692307713, saturationScale: 1.421528644784533, brightnessScale: 1.0159574468085106 }, paper: { hueDegrees: -12.3125, saturationScale: 1.2126352339181279, brightnessScale: 1.0239520958083832 }, pinline: { hueDegrees: -88.07559082483772, saturationScale: 1.277991260837483, brightnessScale: 1.308125 }, glyph: { source: [0.15294117647058825, 0.14901960784313725, 0.1411764705882353], target: [0.11568627450980393, 0.09607843137254901, 0.12941176470588234] } }, R: { header: { hueDegrees: 2.5092658770676053, saturationScale: 0.7511073790822655, brightnessScale: 0.9318181818181819 }, paper: { hueDegrees: 8.412850307587178, saturationScale: 1.0477689369398555, brightnessScale: 0.9504310344827587 }, pinline: { hueDegrees: 3.0543379373086736, saturationScale: 1.0001076704423102, brightnessScale: 1.0559610705596107 }, glyph: { source: [0.9372549019607843, 0.2196078431372549, 0.15294117647058825], target: [0.8196078431372549, 0.24901960784313726, 0.20588235294117646] } }, G: { header: { hueDegrees: -59.16304347826099, saturationScale: 1.0029481528127626, brightnessScale: 0.9543269230769231 }, paper: { hueDegrees: -26.824145962732928, saturationScale: 0.9416448402304863, brightnessScale: 0.969626168224299 }, pinline: { hueDegrees: -21.627829393491652, saturationScale: 0.47678542547538166, brightnessScale: 1.16243654822335 }, glyph: { source: [0, 0.4823529411764706, 0.2627450980392157], target: [0.22745098039215686, 0.4568627450980392, 0.29411764705882354] } } }, tl = {
  outer: Qm,
  colors: th
}, Us = (t) => {
  if (t.length !== 3 || t.some((e) => !Number.isFinite(e) || e < 0 || e > 1))
    throw Error("Invalid Eighth basic-land palette.");
  return [t[0], t[1], t[2]];
}, eh = new Map(
  Object.entries(tl.colors).map(([t, e]) => [
    t,
    { ...e, glyph: { source: Us(e.glyph.source), target: Us(e.glyph.target) } }
  ])
), Xn = tl.outer;
function zo(t) {
  if (t.colorCalibration !== "set-hsb-v1" || t.frameAssetFamily !== "eighth" || t.setCode?.toLowerCase() !== "8ed" || t.frameTemplate || t.layout && t.layout !== "normal")
    return;
  const e = mr(t), r = e ? eh.get(e) : void 0;
  if (!r) return;
  const o = kt(t);
  if (!(!o || !go(t, o.frame)))
    return { color: e, palette: r, frame: o.frame, glyph: Vr(t) };
}
const rh = { left: [[34.1933, 40.6667], [34.6766, 39.4527], [35.4016, 38.4816], [35.6432, 38.4816], [36.6098, 37.2677], [36.8515, 37.2677], [38.3014, 35.8109], [39.7512, 34.8398], [42.1677, 33.8687], [46.7591, 32.6547], [51.1087, 32.1692], [51.3504, 31.9264], [53.5252, 31.9264], [53.7669, 31.6836], [60.2914, 31.6836], [60.533, 31.9264], [62.4662, 31.9264], [63.9161, 32.4119], [65.6077, 32.4119], [67.5409, 32.8975], [71.4072, 34.1114], [74.7903, 35.8109], [77.4485, 37.7532], [380.4762, 37.7532], [384.8259, 35.3254], [388.6923, 34.1114], [394.7335, 33.3831], [394.9751, 33.1403], [402.2246, 32.8975], [402.4662, 33.1403], [405.366, 33.1403], [405.6077, 33.3831], [411.4072, 34.1114], [415.032, 35.3254], [417.9318, 36.7821], [418.6567, 37.5104], [420.8316, 37.5104], [421.0732, 37.7532], [610.7676, 37.7532], [611.0092, 37.996], [613.6674, 37.996]], right: [[34.435, 448.79], [35.8849, 450.7323], [36.1265, 450.7323], [36.3682, 451.2179], [38.0597, 452.6746], [39.0263, 452.9174], [40.9595, 454.1313], [44.8259, 455.5881], [46.5174, 455.8308], [48.4506, 456.5592], [53.5252, 456.802], [53.7669, 457.0448], [54.9751, 457.0448], [55.2168, 456.802], [59.3248, 457.0448], [59.5665, 456.802], [66.091, 456.5592], [66.8159, 456.0736], [70.6823, 455.3453], [73.0988, 453.8886], [73.5821, 453.8886], [76.2402, 451.9463], [77.6901, 451.2179], [103.3049, 451.2179], [103.5466, 451.4607], [104.9964, 451.4607], [105.2381, 451.2179], [124.0867, 451.4607], [124.3284, 451.2179], [125.5366, 451.2179], [125.7783, 451.4607], [129.8863, 451.4607], [130.1279, 451.7035], [139.3106, 451.7035], [139.5522, 451.4607], [143.4186, 451.4607], [143.6603, 451.2179], [144.6269, 451.4607], [148.7349, 451.4607], [148.9765, 451.2179], [161.059, 451.2179], [161.3006, 451.4607], [163.9588, 451.4607], [164.2004, 451.2179], [169.0334, 451.2179], [169.2751, 451.4607], [171.2082, 451.4607], [171.4499, 451.2179], [172.6581, 451.4607], [174.833, 451.4607], [175.0746, 451.2179], [175.7996, 451.4607], [179.4243, 451.4607], [179.666, 451.2179], [181.8408, 451.2179], [182.0824, 451.4607], [187.6404, 451.4607], [187.882, 451.2179], [192.4733, 451.2179], [192.715, 451.4607], [193.4399, 451.2179], [199.7228, 451.2179], [199.9645, 451.4607], [200.9311, 451.2179], [208.1805, 451.2179], [208.4222, 451.4607], [209.6304, 451.4607], [209.8721, 451.2179], [227.9957, 451.2179], [228.2374, 451.4607], [229.9289, 451.4607], [230.1706, 451.2179], [246.8443, 451.2179], [247.086, 451.4607], [259.6517, 451.4607], [259.8934, 451.2179], [261.1016, 451.4607], [261.8266, 451.2179], [263.0348, 451.2179], [263.2765, 451.4607], [263.7598, 451.2179], [265.9346, 451.2179], [266.1763, 451.4607], [268.8344, 451.4607], [269.076, 451.2179], [367.1855, 451.4607], [367.4271, 451.2179], [374.9183, 451.2179], [375.1599, 451.4607], [377.8181, 451.4607], [378.0597, 451.2179], [379.9929, 451.2179], [381.9261, 452.1891], [382.651, 452.9174], [385.3092, 454.1313], [389.9005, 455.3453], [394.7335, 455.8308], [394.9751, 456.0736], [405.366, 456.0736], [405.6077, 455.8308], [408.7491, 455.5881], [413.0988, 454.6169], [415.5153, 453.6458], [416.4819, 453.6458], [419.14, 451.4607], [419.865, 451.2179], [426.3895, 451.2179], [426.6311, 451.4607], [432.1891, 451.4607], [432.4307, 451.2179], [434.8472, 451.2179], [435.0888, 451.4607], [613.6674, 451.2179]] }, nh = { left: [[39.0263, 39.4527], [39.7512, 38.7244], [43.6176, 36.5393], [49.4172, 35.0826], [53.7669, 34.8398], [54.0085, 34.597], [59.8081, 34.597], [60.0498, 34.8398], [65.8493, 35.0826], [68.7491, 35.8109], [73.0988, 37.5104], [75.032, 38.7244], [76.7235, 40.4239], [76.9652, 60.8179]], right: [[39.0263, 449.0328], [39.7512, 449.7612], [42.651, 451.4607], [48.209, 453.1602], [49.4172, 453.1602], [51.1087, 453.6458], [57.3916, 453.6458], [58.5999, 453.8886], [58.8415, 453.6458], [63.4328, 453.6458], [70.199, 452.1891], [75.032, 449.7612], [76.7235, 448.0617], [76.9652, 447.5761]] }, oh = { left: [[384.1009, 41.395], [385.5508, 40.1811], [387.484, 39.21], [392.317, 37.7532], [395.7001, 37.5104], [395.9417, 37.2677], [408.2658, 37.5104], [412.6155, 38.7244], [415.2736, 39.9383], [417.9318, 41.6378], [418.4151, 42.3662], [418.6567, 60.8179], [418.8984, 60.8179]], right: [[384.1009, 447.8189], [385.3092, 448.79], [388.9339, 450.4896], [392.5586, 451.4607], [396.9083, 451.7035], [397.15, 451.9463], [404.3994, 451.9463], [404.6411, 451.7035], [408.7491, 451.4607], [413.5821, 450.004], [415.9986, 448.79], [418.4151, 446.8478], [418.6567, 428.8816], [418.8984, 428.8816]] }, sh = { left: [[424.2146, 41.6378], [608.3511, 41.6378], [609.3177, 41.395], [609.5593, 60.8179], [609.801, 60.8179]], right: [[424.2146, 446.3622], [424.6979, 446.1194], [602.3099, 446.1194], [602.5515, 446.3622], [608.5928, 446.1194], [609.076, 446.3622], [609.3177, 446.1194], [609.5593, 428.8816], [609.801, 428.8816]] }, er = {
  outer: rh,
  title: nh,
  type: oh,
  paper: sh
}, ah = er, zr = (t) => Math.max(0, Math.min(1, t)), el = (t) => {
  const e = zr(t);
  return e * e * (3 - 2 * e);
}, js = (t, e) => {
  let r = 0;
  for (; r + 1 < t.length - 1 && t[r + 1][0] < e; ) r++;
  const o = t[r], n = t[r + 1];
  return o[1] + zr((e - o[0]) / (n[0] - o[0])) * (n[1] - o[1]);
};
function kr(t, e) {
  const { left: r, right: o } = e, n = Math.max(r[0][0], o[0][0]), s = Math.min(r.at(-1)[0], o.at(-1)[0]);
  return Array.from({ length: t }, (a, i) => {
    const l = (i + 0.5) * 680 / t;
    return [js(r, l), js(o, l), Math.min(l - n, s - l)];
  });
}
const Tr = (t, e) => el(0.5 + Math.min(e - t[0], t[1] - e, t[2]) / 0.4), Rn = (t, e, r) => [
  t[0] + r * (e[0] - t[0]),
  t[1] + r * (e[1] - t[1]),
  t[2] + r * (e[2] - t[2])
];
function ih(t, e) {
  const r = kr(t.height, er.outer), o = kr(t.height, er.title), n = kr(t.height, er.type), s = kr(t.height, er.paper);
  for (let a = 0; a < t.height; a++)
    for (let i = 0; i < t.width; i++) {
      const l = (a * t.width + i) * 4;
      if (!t.data[l + 3]) continue;
      const d = [t.data[l] / 255, t.data[l + 1] / 255, t.data[l + 2] / 255], u = Math.max(...d);
      if (u < 0.075) continue;
      const m = (i + 0.5) * 488 / t.width, h = Tr(r[a], m), c = Math.max(Tr(o[a], m), Tr(n[a], m)), g = Tr(s[a], m);
      let f;
      if (h < 1) {
        const b = Math.pow(u, Xn.gamma) / u, y = Yt([d[0] * b, d[1] * b, d[2] * b], Xn);
        f = Rn(d, y, el((u - 0.075) / 0.125));
      } else f = d;
      if (h > 0) {
        const b = g > 0 ? e.paper : e.header, y = Math.max(c, g), p = y === 1 ? d : Yt(d, e.pinline), w = y > 0 ? Rn(p, Yt(d, b), y) : p;
        f = Rn(f, w, h);
      }
      for (let b = 0; b < 3; b++) t.data[l + b] = Math.round(255 * f[b]);
    }
}
function lh(t, e) {
  const r = (a) => (a[0] + a[1] + a[2]) / 3, o = r(e.source), n = e.source.map((a) => a - o), s = n.reduce((a, i) => a + i * i, 0);
  if (s <= 1e-6) throw Error("Basic glyph fill cannot be separated from neutral details.");
  for (let a = 0; a < t.data.length; a += 4) {
    if (!t.data[a + 3]) continue;
    const i = [t.data[a] / 255, t.data[a + 1] / 255, t.data[a + 2] / 255], l = r(i), d = zr(i.reduce((u, m, h) => u + (m - l) * n[h], 0) / s);
    for (let u = 0; u < 3; u++)
      t.data[a + u] = Math.round(
        255 * zr(i[u] + d * (e.target[u] - e.source[u]))
      );
  }
}
function dh(t, e) {
  const r = zo(t);
  return r ? [
    {
      url: r.frame,
      kind: "frame",
      color: (n) => ih(n, r.palette)
    },
    ...r.glyph ? [
      {
        url: r.glyph,
        kind: "glyph",
        color: (n) => lh(n, r.palette.glyph)
      }
    ] : []
  ].map(({ url: n, kind: s, color: a }) => {
    const i = e.get(n);
    if (!i) throw Error(`Eighth basic-land material unavailable: ${n}`);
    return {
      url: n,
      key: JSON.stringify([
        "eighth-basic-material-v1",
        n,
        i.width,
        i.height,
        s === "frame" ? [r.palette, Xn, ah] : r.palette.glyph
      ]),
      bytes: i.width * i.height * 4,
      build: async () => {
        const l = document.createElement("canvas");
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
function uh(t, e) {
  if (t.width !== e.width || t.height !== e.height)
    throw Error("Stamp palette dimensions differ.");
  for (let r = 0; r < t.height; r++)
    for (let o = 0; o < t.width; o++) {
      const n = (r * t.width + o) * 4, s = Math.max(0, Math.min(1, ((o + 0.5) / t.width - 0.35) / 0.3)), a = t.data[n + 3] * (1 - s), i = e.data[n + 3] * s, l = a + i;
      for (let d = 0; d < 3; d++)
        t.data[n + d] = l ? (t.data[n + d] * a + e.data[n + d] * i) / l : 0;
      t.data[n + 3] = l;
    }
}
function mh(t, e) {
  const r = fe(t);
  if (!r) return [];
  const o = Bt(t.setCode, t.borderColor).border === "#090806";
  if (!o && !r.rightImage) return [];
  const n = t.calibration === void 0 ? "#090806" : Tt(t) ?? "#090806", s = [1, 3, 5].map((l) => parseInt(n.slice(l, l + 2), 16)), a = e.get(r.image);
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
        o,
        n,
        a.width,
        a.height
      ]),
      bytes: a.width * a.height * 4,
      build: async () => {
        const l = document.createElement("canvas");
        l.width = a.width, l.height = a.height;
        try {
          const d = l.getContext("2d", { willReadFrequently: !0 });
          if (!d) throw Error("Stamp preparation needs Canvas2D.");
          let u;
          i && (d.drawImage(i, 0, 0), u = d.getImageData(0, 0, l.width, l.height), d.clearRect(0, 0, l.width, l.height)), d.drawImage(a, 0, 0);
          const m = d.getImageData(0, 0, l.width, l.height);
          u && uh(m, u);
          for (let h = 0; o && h < m.data.length; h += 4) {
            if (!m.data[h + 3]) continue;
            const c = Math.max(m.data[h], m.data[h + 1], m.data[h + 2]);
            if (c >= 24) continue;
            const g = (1 - c / 24) ** 2;
            m.data[h] = m.data[h] + s[0] * g, m.data[h + 1] = m.data[h + 1] + s[1] * g, m.data[h + 2] = m.data[h + 2] + s[2] * g;
          }
          return d.putImageData(m, 0, 0), await createImageBitmap(l);
        } finally {
          l.width = l.height = 0;
        }
      }
    }
  ];
}
const hh = {
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
function ch(t, e) {
  if (t.frameTemplate !== "future") return [];
  const r = t.setCode?.toLowerCase() === "fut" && t.colorCalibration === "set-hsb-v1", o = /* @__PURE__ */ new Set();
  return [...new Set(t.manaSymbols ?? [])].flatMap((n) => {
    const s = /^(?:\d+|X)$/.test(n), a = r ? hh[s ? "N" : n] : void 0, i = Qr(n), l = i ? e.get(i) : void 0;
    if (!a && !s || !i || !l || o.has(i)) return [];
    o.add(i);
    const d = s ? Un().map((u) => {
      const m = e.get(u);
      if (!m || m.width !== l.width || m.height !== l.height)
        throw Error("Future generic medallion requires all matching pinned numeral sources");
      return m;
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
          s ? Un() : null
        ]),
        bytes: l.width * l.height * 4,
        build: () => gh(l, a, d)
      }
    ];
  });
}
async function gh(t, e, r) {
  const o = document.createElement("canvas");
  o.width = t.width, o.height = t.height;
  try {
    const n = o.getContext("2d", { willReadFrequently: !0 });
    n.drawImage(t, 0, 0);
    const s = n.getImageData(0, 0, o.width, o.height);
    for (const l of r) {
      n.clearRect(0, 0, o.width, o.height), n.drawImage(l, 0, 0);
      const d = n.getImageData(0, 0, o.width, o.height).data;
      for (let u = 0; u < s.data.length; u++)
        u % 4 !== 3 && (s.data[u] = Math.max(s.data[u], d[u]));
    }
    const [a, i] = e ?? [
      [1, 1, 1],
      [1, 1, 1]
    ];
    for (let l = 0; l < o.height; l++)
      for (let d = 0; d < o.width; d++) {
        const u = (l * o.width + d) * 4;
        if (!s.data[u + 3]) continue;
        const m = Math.hypot((d + 0.5) / o.width - 0.5, (l + 0.5) / o.height - 0.5), h = Math.max(0, Math.min(1, (m - 0.31) / 0.03)), c = h * h * (3 - 2 * h);
        for (let g = 0; g < 3; g++)
          s.data[u + g] = Math.round(
            s.data[u + g] * (a[g] * (1 - c) + i[g] * c)
          );
      }
    return n.putImageData(s, 0, 0), await createImageBitmap(o);
  } finally {
    o.width = o.height = 0;
  }
}
async function fh(t, e, r) {
  t = se(t);
  const o = { images: e, dispose() {
  } }, n = Gd(t), s = /* @__PURE__ */ new Map(), a = new Map(Object.entries(Bi(t))), i = {}, l = {}, d = /* @__PURE__ */ new Set(), u = [], m = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...[...(t.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((S) => S[1])
  ]);
  for (const S of t.rulesParagraphs ?? [])
    for (const v of S.runs) for (const C of v.text.matchAll(/\{([^}]+)\}/g)) m.add(C[1]);
  for (const S of m) {
    const v = /^\d+$/.test(S) || S === "X" && hr(t) ? "N" : S, C = Pn(t, S), T = C?.discColor ?? gn[v], R = Ii(t, v) ?? (C && gn[v] ? be(v === "W" ? "#efe7cb" : gn[v]) : void 0);
    if (C && d.add(S), C?.glyphScale !== void 0 && (l[S] = C.glyphScale), !R || !T) continue;
    const M = C?.url ?? Ge(S);
    if (n && M && /^[WUBRGN]$/.test(v) && s.set(M, {
      inkTarget: n,
      paper: R,
      sourceInk: C ? be(C.inkColor) : [13 / 255, 15 / 255, 15 / 255]
    }), C) {
      const x = e.get(C.url);
      if (!x) throw Error(`Historical mana asset unavailable: ${S}`);
      u.push({ url: C.url, source: x, palette: C, target: R });
    } else M && a.set(M, bh(T, R));
    i[S] = `rgb(${R.map((x) => Math.round(x * 255)).join(" ")})`;
  }
  const h = m.has("W") && cr(t, "W") === "historic-font", c = dh(t, e), g = mh(t, e), f = ch(t, e);
  if (!a.size && !u.length && !c.length && !g.length && !f.length && !Object.keys(i).length && !h)
    return o;
  const b = Object.assign(new Map(e), {
    manaInkColor: n ? `rgb(${n.map((S) => Math.round(S * 255)).join(" ")})` : void 0,
    manaColors: i,
    originalManaGlyphs: d,
    originalWhiteGlyph: h,
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
        Ns(S, v.width, v.height, C),
        "mana-ink-v1",
        s.get(S)
      ]) : Ns(S, v.width, v.height, C),
      bytes: v.width * v.height * 4,
      build: () => ph(v, C, e, s.get(S))
    })),
    ...u.map(({ url: S, source: v, palette: C, target: T }) => ({
      url: S,
      key: JSON.stringify([
        "historical-mana-palette-v1",
        S,
        v.width,
        v.height,
        C,
        T,
        ...s.has(S) ? ["mana-ink-v1", s.get(S)] : []
      ]),
      bytes: v.width * v.height * 4,
      build: () => qm(v, C, T, s.get(S))
    }))
  ];
  let w = [];
  try {
    w = await qi.acquireMany(p, r), p.forEach(({ url: S }, v) => b.set(S, w[v].value));
    for (const S of d) {
      const v = Pn(t, S), C = b.get(v.url), T = Ge(S);
      if (!C || !T) throw Error(`Historical mana asset unavailable: ${S}`);
      b.set(T, C);
    }
    return { images: b, dispose: () => w.forEach((S) => S.release()) };
  } catch (S) {
    throw w.forEach((v) => v.release()), S;
  }
}
function Ns(t, e, r, o) {
  return JSON.stringify(["frame-hsb-paper-mask-v3", t, e, r, o]);
}
async function ph(t, e, r, o) {
  const n = document.createElement("canvas");
  n.width = t.width, n.height = t.height;
  try {
    const s = n.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("HSB preparation needs Canvas2D.");
    s.drawImage(t, 0, 0);
    const a = s.getImageData(0, 0, n.width, n.height), i = (h) => {
      const c = r.get(h);
      if (!c) throw Error(`Frame material mask unavailable: ${h}`);
      return s.clearRect(0, 0, n.width, n.height), s.drawImage(c, 0, 0, n.width, n.height), s.getImageData(0, 0, n.width, n.height);
    }, l = e.blackPoint?.textureMaskSource, d = l ? i(l) : void 0, u = e.blend ? i(e.blend.maskSource) : void 0;
    if (e.blend && u) {
      const h = e.blend.outerMaskSource === l && d ? d : i(e.blend.outerMaskSource);
      if (Hm(u, h, Math.round(e.blend.outset * n.width)), d)
        for (let c = 3; c < d.data.length; c += 4)
          d.data[c] = Math.round(d.data[c] * (1 - u.data[c] / 255));
    }
    const m = e.outerStockMaskSource ? i(e.outerStockMaskSource) : void 0;
    return Zm(a, e, d, m), e.blend && u && Xm(a, u, e.blend), o && Zi(a.data, o), s.putImageData(a, 0, 0), await createImageBitmap(n);
  } finally {
    n.width = n.height = 0;
  }
}
function bh(t, e) {
  const r = be(t), [o, n, s] = Dr(r), [a, i, l] = Dr(e);
  if (n <= 0 || s <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (a - o + 540) % 360 - 180,
    saturationScale: i / n,
    brightnessScale: l / s
  };
}
function Yo(t, e) {
  if (t.layout && t.layout !== "normal") return [0, 0];
  const r = t.setCode?.toLowerCase();
  if (t.borderColor && t.borderColor !== (r === "8ed" ? "white" : "black")) return [0, 0];
  if (e === "retro" && vt(t)) return [-18.5, -6];
  if (t.legendary ?? /\bLegendary\b/.test(t.typeLine ?? "")) return [0, 0];
  if (e === "retro") {
    if (r === "lea") return [-1.5, 1.5];
    if (r === "leb") return [-1, 2];
  }
  return e === "eighth" && r === "8ed" ? [0.5, -2] : e === "modern" && r === "m21" ? [-1, 1] : [0, 0];
}
const Ds = [0.08, 0.36, 0.64, 0.92, 1], yh = [0.18, 0.18, 0.17];
function Jn(t, e, r, o, n, s) {
  if (n.length !== 2) return;
  const { box: a, width: i } = s, l = t - r / 2, d = t + r / 2, u = e - o / 2, m = e + o / 2;
  if (d <= a.left || l >= a.right || m <= a.top || u >= a.bottom || l >= a.left + i.left && d <= a.right - i.right && u >= a.top + i.top && m <= a.bottom - i.bottom)
    return;
  const h = (b) => Math.max(
    0,
    Math.min(d, a.right - i.right * b) - Math.max(l, a.left + i.left * b)
  ) * Math.max(
    0,
    Math.min(m, a.bottom - i.bottom * b) - Math.max(u, a.top + i.top * b)
  ) / (r * o);
  let c = h(0), g = 0;
  const f = [0, 0, 0];
  for (let b = 0; b < Ds.length; b++) {
    const y = h(Ds[b]), p = Math.max(0, c - y), w = b === 0 || b === 4 ? yh : n[b === 2 ? 1 : 0];
    for (let S = 0; S < 3; S++) f[S] += w[S] * p;
    g += p, c = y;
  }
  if (g)
    return { color: [f[0] / g, f[1] / g, f[2] / g], alpha: g };
}
const Jt = {
  left: 61.063333333333325 / (488 / 1500),
  right: 427.9656666666666 / (488 / 1500),
  top: 404.6309523809524 / (680 / 2100),
  bottom: 606.325 / (680 / 2100)
}, xt = { left: 188, right: 1324, top: 1253, bottom: 1871 }, Ke = { left: 26, right: 29, top: 29, bottom: 28 }, zs = 6.375 / (488 / 1500), Ys = 6.375 / (680 / 2100), wh = { left: zs, right: zs, top: Ys, bottom: Ys }, Sh = {
  W: [186 / 255, 177 / 255, 176 / 255],
  U: [72 / 255, 110 / 255, 137 / 255],
  B: [88 / 255, 77 / 255, 85 / 255],
  R: [182 / 255, 62 / 255, 81 / 255],
  G: [129 / 255, 149 / 255, 92 / 255]
};
function vh(t, e) {
  if (e.length !== 2) return;
  const o = [...e].sort((m, h) => "RGUBW".indexOf(m) - "RGUBW".indexOf(h)).map((m) => Sh[m]);
  if (!o[0] || !o[1]) return;
  const n = 1500 / t.width, s = 2100 / t.height, a = t.data.slice(), i = Math.min(Jt.left, xt.left), l = Math.max(Jt.right, xt.right), d = Math.min(Jt.top, xt.top), u = Math.max(Jt.bottom, xt.bottom);
  for (let m = Math.floor(d / s); m < Math.ceil(u / s); m++)
    for (let h = Math.floor(i / n); h < Math.ceil(l / n); h++) {
      const c = Jn((h + 0.5) * n, (m + 0.5) * s, n, s, [o[0], o[1]], {
        box: Jt,
        width: wh
      }), g = (h + 0.5) * n, f = (m + 0.5) * s, b = Jn(g, f, n, s, [o[0], o[1]], {
        box: xt,
        width: Ke
      });
      if (!c && !b) continue;
      const y = (m * t.width + h) * 4;
      if (t.data[y + 3]) {
        if (b) {
          const p = [
            g - xt.left,
            xt.right - g,
            f - xt.top,
            xt.bottom - f
          ], w = p.indexOf(Math.min(...p)), S = g >= Jt.left && g < Jt.right && f >= Jt.top && f < Jt.bottom, v = w === 0 ? xt.left + (S ? Ke.left + 2 : -2) : w === 1 ? xt.right - (S ? Ke.right + 2 : -2) : g, C = w === 2 ? xt.top + (S ? Ke.top + 2 : -2) : w === 3 ? xt.bottom - (S ? Ke.bottom + 2 : -2) : f, T = (Math.floor(C / s) * t.width + Math.floor(v / n)) * 4;
          for (let R = 0; R < 3; R++)
            t.data[y + R] = a[y + R] * (1 - b.alpha) + a[T + R] * b.alpha;
        }
        if (c)
          for (let p = 0; p < 3; p++)
            t.data[y + p] = t.data[y + p] * (1 - c.alpha) + c.color[p] * 255 * c.alpha;
      }
    }
}
const rr = { left: 166.8794, right: 1338.8298, top: 1255.6105, bottom: 1882.7268 }, qs = 6.375 / (488 * 0.984 / 1500 * 1.001), Hs = 6.375 / (680 * 0.99 / 2100 * 1.001), Ch = { left: qs, right: qs, top: Hs, bottom: Hs };
function kh(t, e, r, o, n) {
  return Jn(t, e, r, o, n, {
    box: rr,
    width: Ch
  });
}
const xn = {
  W: { hueDegrees: 8.4847, saturationScale: 0.42831, brightnessScale: 0.97071 },
  U: { hueDegrees: 164.886, saturationScale: 0.25883, brightnessScale: 0.841 },
  B: { hueDegrees: 157.329, saturationScale: 0.20015, brightnessScale: 0.62552 },
  R: { hueDegrees: -23.3867, saturationScale: 0.88939, brightnessScale: 0.9205 },
  G: { hueDegrees: 30.7835, saturationScale: 0.6094, brightnessScale: 0.79916 }
}, Th = {
  W: { hueDegrees: 7.44281, saturationScale: 0.570206, brightnessScale: 0.845188 },
  U: { hueDegrees: -177.38556, saturationScale: 0.121282, brightnessScale: 0.656904 },
  B: { hueDegrees: 0, saturationScale: 0, brightnessScale: 0.452356 },
  R: { hueDegrees: -34.23136, saturationScale: 1.238404, brightnessScale: 0.866109 },
  G: { hueDegrees: 42.19413, saturationScale: 0.716825, brightnessScale: 0.656904 }
}, Xs = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Js = {
  W: [0.9, 0.91, 0.9],
  U: [0.32, 0.58, 0.75],
  B: [0.38, 0.4, 0.38],
  R: [0.8, 0.32, 0.34],
  G: [0.6, 0.66, 0.29]
}, Ks = { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.992232 };
function Mh(t, e, r) {
  const o = r ? xn : Th, n = e[0], s = e[1] ?? n;
  if (!n || !s || !xn[n] || !xn[s]) return;
  const a = e.length === 2 ? [...e].sort((l, d) => "RGUBW".indexOf(l) - "RGUBW".indexOf(d)).map((l) => Js[l]) : [], i = a.length ? t.data.slice() : void 0;
  for (let l = 0; l < t.height; l++)
    for (let d = 0; d < t.width; d++) {
      const u = (l * t.width + d) * 4;
      if (!t.data[u + 3]) continue;
      const m = (d + 0.5) * 1500 / t.width, h = (l + 0.5) * 2100 / t.height, c = [t.data[u] / 255, t.data[u + 1] / 255, t.data[u + 2] / 255], g = Math.max(...c), f = kh(m, h, 1500 / t.width, 2100 / t.height, a), b = i ? m >= rr.left && m < rr.right && h >= rr.top && h < rr.bottom : m >= 187 && m < 1320 && h >= 1280 && h < 1864, y = i && m >= 165 && m <= 1345 && h >= 1248 && h <= 1885;
      if (!f && g < 0.075 && !(i && b) && !y) continue;
      const p = Math.min(m - 126, 1379 - m, h - 153, 1171 - h), w = Math.min(m - 170, 1340 - m, h - 1253, 1880 - h), S = p >= -1 && p < 13 || w >= -1 && w < 29;
      let v;
      if (b) {
        const C = Math.min(
          (m - 187) * 488 * 0.984 / 1500,
          (1320 - m) * 488 * 0.984 / 1500,
          (h - 1280) * 680 * 0.99 / 2100,
          (1864 - h) * 680 * 0.99 / 2100
        ), T = Math.floor(Math.max(0, C) / 11.5);
        let R = c;
        if (i && (m < 190 || h < 1284)) {
          const M = Math.min(t.width - 1, Math.max(d, Math.ceil(190 * t.width / 1500))), A = (Math.min(
            t.height - 1,
            Math.max(l, Math.ceil(1284 * t.height / 2100))
          ) * t.width + M) * 4;
          R = [i[A] / 255, i[A + 1] / 255, i[A + 2] / 255];
        }
        v = Yt(R, o[T % 2 ? s : n]);
      } else if (y) {
        const C = [m - 165, 1345 - m, h - 1248, 1885 - h], T = C.indexOf(Math.min(...C)), R = T === 0 ? 160 : T === 1 ? 1350 : m, M = T === 2 ? 1240 : T === 3 ? 1890 : h, x = Math.min(t.width - 1, Math.floor(R * t.width / 1500)), F = (Math.min(t.height - 1, Math.floor(M * t.height / 2100)) * t.width + x) * 4;
        v = Yt(
          [i[F] / 255, i[F + 1] / 255, i[F + 2] / 255],
          r ? Ks : Xs
        );
      } else if (S && c[0] > 0.45 && c[1] > 0.35 && c[2] < Math.min(c[0], c[1]) * 0.72) {
        const C = Js[(p >= -1 && p < 13 ? p < 6 : w < 14) ? s : n], T = g / 0.97;
        v = [
          Math.min(1, C[0] * T),
          Math.min(1, C[1] * T),
          Math.min(1, C[2] * T)
        ];
      } else v = Yt(c, r ? Ks : Xs);
      for (let C = 0; C < 3; C++)
        t.data[u + C] = Math.round(
          255 * (f ? f.color[C] * f.alpha + v[C] * (1 - f.alpha) : v[C])
        );
    }
}
async function Rh(t, e, r) {
  if (!bt(t)) return { images: e, dispose() {
  } };
  const o = e.get(nr);
  if (!o) throw Error("Revised land frame asset unavailable");
  const n = Ja(t), s = ze(t), a = await Do.acquire(
    JSON.stringify([
      "revised-fourth-land-v5",
      nr,
      o.width,
      o.height,
      n,
      s
    ]),
    o.width * o.height * 4,
    async () => {
      const l = document.createElement("canvas");
      l.width = o.width, l.height = o.height;
      try {
        const d = l.getContext("2d", { willReadFrequently: !0 });
        if (!d) throw Error("Revised land preparation needs Canvas2D");
        d.drawImage(o, 0, 0);
        const u = d.getImageData(0, 0, l.width, l.height);
        Mh(u, n, s), d.putImageData(u, 0, 0);
        const m = l.width * 160 / 1500, h = l.height * 1240 / 2100, c = l.width * 1190 / 1500, g = l.height * 654 / 2100, f = l.width * (244 - 2.404) / (488 * 0.984), b = l.height * (515 - 9.9) / (680 * 0.99);
        return d.drawImage(
          l,
          m,
          h,
          c,
          g,
          f + (m - f) * 1.001,
          b + (h - b) * 1.001 + l.height * 0.25 / (680 * 0.99),
          c * 1.001,
          g * 1.001
        ), await createImageBitmap(l);
      } finally {
        l.width = l.height = 0;
      }
    },
    r
  ), i = Object.assign(new Map(e), e);
  return i.set(nr, a.value), { images: i, dispose: () => a.release() };
}
async function xh(t, e, r) {
  if (bt(t)) return Rh(t, e, r);
  const o = gr(t);
  if (!o) return { images: e, dispose() {
  } };
  const n = (u) => {
    const m = e.get(u);
    if (!m) throw Error(`Historical dual-land asset unavailable: ${u}`);
    return m;
  }, s = n(o.base), a = n(o.overlay), i = n(o.mask), [l] = await Do.acquireMany(
    [
      {
        key: JSON.stringify([
          "abu-dual-frame-v2",
          o,
          s.width,
          s.height,
          Bi(t)
        ]),
        bytes: s.width * s.height * 4,
        build: async () => {
          const u = document.createElement("canvas"), m = document.createElement("canvas");
          u.width = m.width = s.width, u.height = m.height = s.height;
          try {
            const h = u.getContext("2d"), c = m.getContext("2d");
            if (!h || !c) throw Error("Historical dual-land preparation needs Canvas2D.");
            c.drawImage(a, 0, 0, s.width, s.height), c.globalCompositeOperation = "destination-in", c.drawImage(i, 0, 0, s.width, s.height), h.drawImage(s, 0, 0), h.drawImage(m, 0, 0);
            const g = h.getImageData(0, 0, s.width, s.height);
            return vh(g, Xa(t)), h.putImageData(g, 0, 0), await createImageBitmap(u);
          } finally {
            u.width = u.height = m.width = m.height = 0;
          }
        }
      }
    ],
    r
  ), d = Object.assign(new Map(e), e);
  return d.set(o.base, l.value), { images: d, dispose: () => l.release() };
}
const Eh = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Vs = {
  // Black outer contour after the checksum-guarded LEG SVG repair.
  "leg/retro/black": [3.25, 1.5, 1.05, 1.125],
  "6ed/retro/white": [2, -2, 1.08, 1.08],
  // Filled crescent after rim repair; independent width/height on fixed poses.
  "drk/retro/black": [2.5, -1.25, 1.146, 1.203]
}, Zs = {
  m15: { family: "m15-accurate", delta: [1, 0, 1, 1] },
  m21: { family: "m15-accurate", delta: [2, 0, 1.1, 1.06] },
  woe: { family: "m15-accurate", delta: [2, 0, 1.08, 1.08] },
  tdm: { family: "m15-accurate", delta: [0, 0, 1.08, 1.08] },
  "8ed": { family: "eighth", delta: [-4, 0, 1, 0.92] },
  "9ed": { family: "eighth", delta: [0, 1, 0.9, 0.92] }
};
function Ah(t, e, r) {
  if (t.frameTreatment === "colorshifted") return r;
  const o = t.setCode?.toLowerCase() ?? "", n = Object.hasOwn(Zs, o) ? Zs[o] : void 0;
  let s = r;
  return n && !t.setSymbol && _t(e) && n.family === t.frameAssetFamily && (s = rl(r, n.delta)), t.frameAssetFamily ? qo(t, e, s, t.frameAssetFamily) : s;
}
function qo(t, e, r, o) {
  if (t.setSymbol || !_t(e) || B !== Eh || (t.layout ?? "normal") !== "normal" || ["component", "m15-accurate"].includes(o) && _(t).legendary)
    return r;
  const n = t.borderColor ?? (o === "retro" ? Gt(t) : Bt(t.setCode).border === "#eeedeb" ? "white" : "black"), s = `${t.setCode?.trim().toLowerCase() ?? ""}/${o}/${n}`;
  if (s === "leg/retro/black" && !vt(t)) return r;
  const a = Object.hasOwn(Vs, s) ? Vs[s] : Object.hasOwn(ss, s) ? ss[s] : void 0;
  return a ? rl(r, a) : r;
}
function rl(t, e) {
  const [r, o, n, s] = t, [a, i, l, d] = e;
  return [r + n + a - n * l, o + s / 2 + i - s * d / 2, n * l, s * d];
}
const Lh = 0.045;
function nl(t) {
  const e = yt(t)?.cornerRadius;
  return e !== void 0 ? e : ot(t) && t.setCode?.toLowerCase() === "lea" ? _l : Lh;
}
const Ve = "#fbf0c5", Ee = "#ccdaf2", Mr = "#9c9995", Ze = "#edaa8d", Ae = "#dde6e2", Oh = {
  W: [Ve, Ve],
  U: [Ee, Ee],
  B: [Mr, Mr],
  R: [Ze, Ze],
  G: [Ae, Ae],
  WU: [Ve, Ee],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [Ze, Ve],
  WG: [Ae, Ve],
  UB: [Ee, Mr],
  UR: [Ee, Ze],
  UG: [Ae, Ee],
  BR: ["#b4afb5", "#f2b096"],
  BG: [Mr, Ae],
  RG: [Ze, Ae]
};
function $h(t, e, r) {
  if (!e.land) return;
  const o = Oh[e.frame];
  if (!o) return;
  const n = 34 + r, s = 420 - 2 * r, a = t.createLinearGradient(n, 0, n + s, 0);
  a.addColorStop(0, o[0]), a.addColorStop(0.35, o[0]), a.addColorStop(0.65, o[1]), a.addColorStop(1, o[1]), t.save(), t.globalCompositeOperation = "multiply", t.fillStyle = a, t.fillRect(n, 425, s, 203.5), t.restore();
}
function Bh(t, e, r, o) {
  if (!e.land || e.frame !== "Artifact") {
    o();
    return;
  }
  const n = 34 + r, s = 420 - 2 * r;
  for (const a of [!1, !0])
    t.save(), t.beginPath(), a || t.rect(0, 0, 488, 680), t.rect(n, 425, s, 203.5), t.clip("evenodd"), t.filter = `grayscale(1) brightness(${a ? 0.9 : 0.63})`, o(), t.restore();
}
function Ih(t, e, r) {
  if (!e.land) return;
  t.save(), t.shadowColor = "transparent";
  const o = t.createLinearGradient(0, 625.75, 0, 628.25);
  o.addColorStop(0, "#ffffff00"), o.addColorStop(0.3, "#ffffffb0"), o.addColorStop(0.7, "#ffffffb0"), o.addColorStop(1, "#ffffff00"), t.fillStyle = o, t.fillRect(34 + r, 625.75, 420 - 2 * r, 2.5), t.restore();
}
function ol(t) {
  if (t.setSymbol) return null;
  const e = t.setCode?.toLowerCase();
  return e === "m15" || e === "war" ? e : null;
}
function sl(t, e, r, o, n, s, a, i, l, d) {
  const [u, m, h, c] = d ? r === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, r === "m15" ? 0.7 : 1.2];
  n += m - a * (u - 1) / 2, s += h - i * (u - 1) / 2, a *= u, i *= u;
  const g = !o || o === "common", f = document.createElement("canvas"), b = 3, y = 4;
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
  const w = o === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : o === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], S = p.createLinearGradient(0, i * 0.65, a, i * 0.35);
  S.addColorStop(0, w[0]), S.addColorStop(0.35, w[1]), S.addColorStop(0.6, w[2]), S.addColorStop(1, w[3]), p.fillStyle = g ? "#111111" : S, p.fillRect(0, 0, a, i);
  const v = r === "m15" ? 32 : 27, C = new Path2D(
    r === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), T = new DOMMatrix().translate(-l[0] * a / l[2], -l[1] * i / l[3]).scale(a / (v * l[2]), i / (32 * l[3])), R = new Path2D();
  R.addPath(C, T), p.globalCompositeOperation = "destination-over", p.fillStyle = g ? "#f8f8f5" : "#111111", p.fill(R), p.strokeStyle = p.fillStyle, p.lineWidth = r === "war" && g ? 2 : c, p.lineJoin = "round", p.stroke(R), t.drawImage(
    f,
    n - b,
    s - b,
    f.width / y,
    f.height / y
  ), f.width = f.height = 0;
}
function Gh(t, e, r) {
  t.save(), t.fillStyle = r, t.beginPath(), t.rect(0, 0, k, E), t.rect(...e), t.fill("evenodd"), t.restore();
}
function Ph(t, e, [r, o, n, s], a) {
  const u = document.createElement("canvas");
  u.width = 756, u.height = 1044;
  try {
    const m = u.getContext("2d");
    if (!m) throw new Error("Retro stock preparation requires Canvas2D.");
    m.drawImage(e, 12, 12, 732, 1020), m.fillRect(0, 0, u.width, 12), m.fillRect(0, 1032, u.width, 12), m.fillRect(0, 12, 12, 1020), m.fillRect(744, 12, 12, 1020), m.globalCompositeOperation = "source-in", m.fillStyle = a, m.fillRect(0, 0, u.width, u.height), t.drawImage(
      u,
      r - 12 * n / 732,
      o - 12 * s / 1020,
      u.width * n / 732,
      u.height * s / 1020
    );
  } finally {
    u.width = u.height = 0;
  }
}
function Fh(t) {
  if ((t.layout ?? "normal") !== "normal") return;
  const e = `${t.setCode?.toLowerCase() ?? ""}/${Gt(t)}`;
  if (!(e === "leg/black" && !vt(t)))
    return Object.hasOwn(os, e) ? os[e] : void 0;
}
function on(t, e, r, o, n, s, a) {
  t.save();
  const i = t.getTransform();
  t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0;
  const l = document.createElement("canvas");
  l.width = t.canvas.width, l.height = t.canvas.height;
  const d = l.getContext("2d");
  if (!d) throw Error("Solid title needs a Canvas2D context");
  d.setTransform(i), d.font = t.font, d.textAlign = t.textAlign, d.textBaseline = t.textBaseline, d.letterSpacing = t.letterSpacing, d.fillStyle = a?.fill ?? `rgb(${s.gray},${s.gray},${s.gray})`, d.fillText(e, r, o, n), s.trim > 0 && (d.globalCompositeOperation = "destination-out", d.lineWidth = s.trim * 2, d.strokeText(e, r, o, n)), t.resetTransform(), t.shadowColor = a?.shadow ?? "#17140f", t.shadowOffsetX = i.a / s.width * s.shadow, t.shadowOffsetY = i.d * s.shadow, t.drawImage(l, 0, 0), t.restore(), l.width = l.height = 0;
}
const _h = {
  arn: { size: 26.75, x: 37.75, y: 42.5, width: 0.995, shadow: 1.25, trim: 0.4, gray: 196 },
  atq: { size: 26.5, x: 38, y: 42.5, width: 1, shadow: 1.25, trim: 0.4, gray: 196 },
  drk: { size: 27.25, x: 37.25, y: 43, width: 1, shadow: 1.5, trim: 0.2, gray: 208 }
};
function al(t) {
  const e = t.setCode?.toLowerCase();
  if (e !== "arn" && e !== "atq" && e !== "drk" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || t.borderColor && t.borderColor !== "black" || t.legendary || /\b(Legendary|Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", o = t.land ?? /\bLand\b/.test(r), n = t.artifact ?? /\bArtifact\b/.test(r), s = I(t).length;
  if (!(!o && !n && s !== 1 && !(e === "drk" && s === 2)))
    return _h[e];
}
function Wh(t, e, r) {
  const o = al(e);
  if (!o) return !1;
  t.save(), t.translate(o.x, o.y), t.scale(o.width, 1), t.font = `${o.size}px "CardRenderer MTG Goudy", Georgia`;
  const n = Math.max(1, (r - o.x) / o.width);
  return on(t, e.name, 0, 0, n, o), t.restore(), !0;
}
function Uh(t) {
  return Mt(t) ? yt(t).title : void 0;
}
function jh(t, e, r) {
  const o = Uh(e);
  return o ? (t.save(), t.translate(o.x, o.y), t.scale(o.width, 1), t.font = `${o.size}px "CardRenderer MTG Goudy", Georgia`, on(t, e.name, 0, 0, Math.max(1, (r - o.x) / o.width), o), t.restore(), !0) : !1;
}
const Nh = { size: 22, dx: -3, dy: 0.5, width: 1.02, gray: 224, shadow: 1.5, trim: 0.2 };
function Dh(t) {
  return t.setCode?.toLowerCase() === "drk" && !t.frameAssetFamily && al(t) ? Nh : void 0;
}
function zh(t, e, r, o, n, s) {
  const a = Dh(e);
  if (!a) return !1;
  t.save(), t.translate(o + a.dx, n + a.dy), t.scale(a.width, 1), t.font = `${a.size}px "CardRenderer MTG MPlantin", Georgia`, t.fillStyle = `rgb(${a.gray},${a.gray},${a.gray})`, t.shadowColor = "#17140f", t.shadowBlur = 0;
  const i = s / a.width;
  return dt(
    t,
    r,
    0,
    0,
    i,
    e.textInk,
    "type",
    () => on(t, r, 0, 0, i, a, {
      fill: t.fillStyle,
      shadow: t.shadowColor
    })
  ), t.restore(), !0;
}
function Yh(t) {
  const e = (!t.borderColor || t.borderColor === "black") && !!vt(t);
  return {
    fontSize: e ? 21.7 * 1.03 : 21.7,
    dx: e ? -2.5 : 0,
    dy: 0
  };
}
function qh(t) {
  return Mt(t) ? yt(t).type : void 0;
}
function Hh(t, e, r, o) {
  const n = qh(e);
  if (!n) return !1;
  t.save(), t.translate(n.x, n.y), t.scale(n.width, 1), t.font = `${n.size}px "CardRenderer MTG MPlantin", Georgia`, t.fillStyle = `rgb(${n.gray},${n.gray},${n.gray})`, t.shadowColor = "#17140f", t.shadowBlur = 0;
  const s = Math.max(1, (o - n.x) / n.width);
  return dt(
    t,
    r,
    0,
    0,
    s,
    e.textInk,
    "type",
    () => on(t, r, 0, 0, s, n, {
      fill: t.fillStyle,
      shadow: t.shadowColor
    })
  ), t.restore(), !0;
}
function Xh(t, e, r, o = !1, n) {
  il(
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
    o,
    n
  );
}
function Jh(t, e, r, o = !1, n) {
  il(
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
    o,
    n
  );
}
function il(t, e, r, o, n, s) {
  e.forEach((a, i) => {
    const { size: l } = o, d = o.right - (e.length - 1 - i) * (o.pitch + (s?.spacing ?? 0)) - l / 2, u = o.centerY - l / 2;
    if (a !== "W" || n || r.originalManaGlyphs?.has("W")) {
      et(t, a, d, u, l, r, !1, s);
      return;
    }
    ko(
      t,
      d,
      u,
      l,
      o.whiteSize,
      r.manaColors?.W,
      lr(s, a),
      r.manaInkColor
    );
  });
}
const ll = (t, e, r, o, n, s, a = !1, i) => {
  if (e !== "W" || s.originalManaGlyphs?.has("W"))
    return et(t, e, r, o, n, s, a, i);
  ko(
    t,
    r,
    o,
    n,
    n * 0.87,
    s.manaColors?.W,
    lr(i, e),
    s.manaInkColor
  );
};
function Kh(t) {
  return ["4ed", "5ed"].includes(t.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(t.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function Kn(t) {
  const e = String(t.toughness ?? ""), r = t.wordingMode !== "oracle" && t.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(e) ? `(${e})` : e;
  return `${t.power ?? ""}/${r}`;
}
function Vh(t) {
  const e = t.setCode?.toLowerCase(), r = e === "4ed" && !/\bLand\b/.test(t.typeLine ?? "");
  if (e !== "mir" && e !== "tmp" && !r) return null;
  const o = I(t);
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
    legalLight: r ? /\bArtifact\b/.test(t.typeLine ?? "") || o.length === 1 && ["B", "G"].includes(o[0]) : !/\bLand\b/.test(t.typeLine ?? "") && !(o.length === 1 && ["W", "R"].includes(o[0])),
    legalText: t.legalText === void 0 ? r ? "©1995 Wizards of the Coast, Inc. All rights reserved." : e === "mir" ? "©1996 Wizards of the Coast, Inc. All rights reserved." : "©1997 Wizards of the Coast, Inc." : t.legalText
  };
}
const Ho = (t, e, r, o, n, s) => {
  if (e !== "T") return et(t, e, r, o, n, s);
  dl(t, r, o, n, "", 0.88);
}, Vn = (t, e, r, o, n, s) => {
  if (e !== "T") return ll(t, e, r, o, n, s);
  dl(t, r, o, n, "", 0.8);
}, Zh = (t, e, r, o, n, s) => {
  if (e !== "T") return et(t, e, r, o, n, s);
  Ho(t, e, r, o, n, s);
}, Qh = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function tc(t) {
  const e = t?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(e) || ["lea", "leb", "2ed", "arn", "atq"].includes(e) ? Vn : e === "4ed" ? Zh : Qh.has(e) ? Ho : et;
}
function dl(t, e, r, o, n, s) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = "#c9c4be", t.beginPath(), t.arc(e + o / 2, r + o / 2, o / 2, 0, Math.PI * 2), t.fill(), t.fillStyle = "#0d0f0f", t.font = `${o * s}px "CardRenderer MTG Historic Symbols"`, t.textAlign = "left", t.textBaseline = "alphabetic";
  const a = t.measureText(n);
  t.fillText(
    n,
    e + (o - a.actualBoundingBoxLeft - a.actualBoundingBoxRight) / 2 + a.actualBoundingBoxLeft,
    r + (o + a.actualBoundingBoxAscent - a.actualBoundingBoxDescent) / 2
  ), t.restore();
}
function ec(t, e, r, o, n, s, a, i = [0, 0, 1, 1], l = null, d = "low") {
  const u = document.createElement("canvas"), m = Math.ceil(a * 2) + 1;
  u.width = Math.ceil(n * 2) + m * 2, u.height = Math.ceil(s * 2) + m * 2;
  const h = u.getContext("2d");
  h.imageSmoothingQuality = d, h.drawImage(
    e,
    i[0] * e.width,
    i[1] * e.height,
    i[2] * e.width,
    i[3] * e.height,
    m,
    m,
    n * 2,
    s * 2
  ), h.globalCompositeOperation = "source-in", h.fillStyle = "#fff", h.fillRect(0, 0, u.width, u.height), t.save(), t.shadowColor = "transparent";
  for (let c = 0; a > 0 && c < 16; c++) {
    const g = c * Math.PI / 8;
    t.drawImage(
      u,
      r - m / 2 + Math.cos(g) * a,
      o - m / 2 + Math.sin(g) * a,
      u.width / 2,
      u.height / 2
    );
  }
  if (h.fillStyle = "#17140f", l) {
    const c = h.createLinearGradient(m, m, m + n * 2, m);
    l.forEach((g, f) => c.addColorStop(f / 2, g)), h.fillStyle = c;
  }
  h.fillRect(0, 0, u.width, u.height), t.drawImage(u, r - m / 2, o - m / 2, u.width / 2, u.height / 2), t.restore(), u.width = u.height = 0;
}
function rc(t, e, r) {
  t.save(), t.textAlign = "left", t.textBaseline = "alphabetic", H(t, e, "artist", () => {
    e.artist && (t.fillStyle = "#f2eee3", t.shadowColor = "#000", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, t.font = `${r.artistSize}px "CardRenderer MTG MPlantin", Georgia`, t.fillText(`Illus. ${e.artist}`, r.artistX, r.artistBaseline, 338));
  }), t.shadowColor = "transparent", t.fillStyle = r.legalLight ? "#f2eee3" : "#17140f", t.font = `${r.legalSize}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && H(
    t,
    e,
    "legal",
    () => t.fillText(r.legalText, r.artistX, r.legalBaseline, 380)
  ), t.restore();
}
function Qs(t, e, r, o) {
  const n = r.replaceAll("ō", "o");
  if (t[e](n, 0, 0, o), n === r) return;
  const s = t.measureText(n).width, a = Math.min(1, o / s), i = t.measureText("o").width, l = t.measureText("ˉ").width, d = -(t.textAlign === "right" ? s * a : t.textAlign === "center" ? s * a / 2 : 0), u = t.textAlign;
  t.textAlign = "left";
  try {
    for (let m = 0; m < r.length; m++)
      if (r[m] === "ō") {
        const h = t.measureText(n.slice(0, m + 1)).width;
        t[e]("ˉ", d + (h - i + (i - l) / 2) * a, 0, l * a);
      }
  } finally {
    t.textAlign = u;
  }
}
function nc(t, e, r, o) {
  const n = document.createElement("canvas");
  n.width = t.canvas.width, n.height = t.canvas.height, t.save();
  try {
    const s = t.getTransform(), a = n.getContext("2d");
    if (!a) throw Error("Footer ink needs a Canvas2D context");
    a.setTransform(s), a.font = t.font, a.textAlign = t.textAlign, a.textBaseline = t.textBaseline, a.letterSpacing = t.letterSpacing, a.fillStyle = t.fillStyle, Qs(a, "fillText", e, r), o.trim > 0 && (a.globalCompositeOperation = "destination-out", a.lineWidth = o.trim * 2, Qs(a, "strokeText", e, r)), t.resetTransform(), t.shadowBlur = 0, t.shadowOffsetX = s.a / o.width * o.shadow, t.shadowOffsetY = s.d * o.shadow, t.drawImage(n, 0, 0);
  } finally {
    t.restore(), n.width = n.height = 0;
  }
}
function oc(t) {
  const e = Mt(t);
  if (!e) return;
  const r = t.setCode.toLowerCase(), o = yt(t).footer, n = ["B", "G", "A"].includes(e.material ?? "") || r === "fem" && t.name === "Ebon Stronghold";
  return {
    ...o,
    legalGray: n ? o.legal.lightGray : o.legal.darkGray,
    // Reviewed printing defaults, never a year inferred from an arbitrary set.
    legalText: t.legalText === void 0 ? `© ${r === "fem" ? "1994" : "1995"} Wizards of the Coast, Inc. All rights reserved.` : t.legalText
  };
}
function sc(t, e) {
  const r = oc(e);
  if (!r) return !1;
  const o = (n, s) => {
    const a = r[n];
    t.save();
    try {
      t.translate(a.x, a.y), t.scale(a.width, 1), t.font = `${a.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = n === "stats" ? "right" : "left", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
      const i = "gray" in a ? a.gray : r.legalGray;
      t.fillStyle = `rgb(${i},${i},${i})`, t.shadowColor = n === "legal" ? "transparent" : "#17140f", t.shadowBlur = 0;
      const l = n === "stats" ? 132 / a.width : Math.max(1, ((n === "artist" ? 386 : 445) - a.x) / a.width), d = () => nc(t, s, l, a);
      n === "stats" ? dt(t, s, 0, 0, l, e.textInk, "stats", d) : d();
    } finally {
      t.restore();
    }
  };
  return e.power != null && e.toughness != null && o("stats", Kn(e)), e.artist && H(t, e, "artist", () => o("artist", `Illus. ${e.artist}`)), r.legalText && H(t, e, "legal", () => o("legal", r.legalText)), !0;
}
const ac = {
  size: 18,
  x: 49.25,
  width: 1.04,
  shadow: 2,
  inset: 0.1,
  align: "left",
  maximum: 338
}, ic = {
  size: 27.8,
  x: 452.25,
  width: 0.99,
  shadow: 1.75,
  inset: 0.3,
  align: "right",
  maximum: 68
};
function ta(t, e, r, o) {
  const n = document.createElement("canvas");
  n.width = t.canvas.width, n.height = t.canvas.height;
  const s = n.getContext("2d");
  if (!s) throw Error("Legends footer needs a Canvas2D context");
  const a = t.getTransform();
  s.setTransform(a), s.translate(r.x, 640), s.scale(r.width, 1), s.font = `${r.size}px "CardRenderer MTG MPlantin", Georgia`, s.textAlign = r.align, s.textBaseline = "alphabetic", s.letterSpacing = "0px", s.fillStyle = "#f2eee3", dt(s, e, 0, 0, r.maximum / r.width, o), s.globalCompositeOperation = "destination-out", s.lineWidth = 2 * r.inset, s.strokeText(e, 0, 0, r.maximum / r.width), t.save(), t.resetTransform(), t.shadowColor = "#17140f", t.shadowBlur = 0, t.shadowOffsetX = t.shadowOffsetY = r.shadow * a.a, t.drawImage(n, 0, 0), t.restore(), n.width = n.height = 0;
}
function En(t, e) {
  return !vt(e) || e.borderColor && e.borderColor !== "black" ? !1 : (e.artist && ta(t, `Illus. © 1994 ${e.artist}`, ac), e.power != null && e.toughness != null && ta(t, `${e.power}/${e.toughness}`, ic, e.textInk), !0);
}
function lc(t, e) {
  return e.printingElements?.artist ? En(t, { ...e, artist: null }) ? (H(t, e, "artist", () => {
    En(t, { ...e, power: null, toughness: null });
  }), !0) : !1 : En(t, e);
}
function dc(t, e) {
  const r = e.setCode?.toLowerCase();
  if (!["usg", "ulg", "uds"].includes(r ?? "") || (e.layout ?? "normal") !== "normal")
    return !1;
  t.save(), t.textAlign = "center", t.textBaseline = "alphabetic", t.shadowColor = "#17140f", t.shadowOffsetX = t.shadowOffsetY = 1.5 * t.getTransform().a, t.fillStyle = "#f2eee3", t.font = '19px "CardRenderer MTG MPlantin", Georgia';
  const o = e.power != null && e.toughness != null ? 292 : 365;
  H(t, e, "artist", () => {
    e.artist && t.fillText(`Illus. ${e.artist}`, 244, 626, o);
  }), e.power != null && e.toughness != null && (t.shadowColor = "#000b", t.font = '27.8px "CardRenderer MTG MPlantin", Georgia', t.textBaseline = "middle", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, dt(
    t,
    `${e.power}/${e.toughness}`,
    (0.8074 + 0.1367 / 2) * 488,
    (0.895 + 0.043 / 2) * 680,
    0.1367 * 488,
    e.textInk
  )), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.textBaseline = "alphabetic", t.font = '9.5px "CardRenderer MTG MPlantin", Georgia';
  const n = I(e), s = !/\bLand\b/.test(e.typeLine ?? "") && !(n.length === 1 && ["W", "R"].includes(n[0]));
  t.fillStyle = s ? "#f2eee3" : "#17140f";
  const a = r === "usg" ? 1998 : 1999, i = e.collectorTotal === void 0 ? r === "usg" ? 350 : 143 : e.collectorTotal, l = e.collectorNumber?.trim(), d = l && !e.printingElements?.collector?.hidden && (e.legalText === void 0 || e.collectorTotal !== void 0) ? `${l}${i ? "/" + i : ""}` : "", u = e.printingElements?.legal?.hidden ? null : e.legalText === void 0 ? `©1993–${a} Wizards of the Coast, Inc.` : e.legalText, m = [u, d].filter(Boolean).join(" ");
  if (!e.printingElements?.legal?.offset && !e.printingElements?.collector?.offset)
    m && t.fillText(m, 244, 640, 365);
  else if (m) {
    const h = t.measureText(m).width, c = Math.min(1, 365 / Math.max(1, h));
    t.translate(244, 640), t.textAlign = "left";
    const g = (f, b) => {
      t.save(), t.scale(c, 1), t.fillText(f, b, 0), t.restore();
    };
    u && H(t, e, "legal", () => g(u, -h / 2)), d && H(
      t,
      e,
      "collector",
      () => g(d, h / 2 - t.measureText(d).width)
    );
  }
  return t.restore(), !0;
}
function uc(t, e, r) {
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
function mc(t, e) {
  const r = 52.053333333333335, o = 1255 / 2100 * 680, n = 1346 / 1500 * 488, s = 1861 / 2100 * 680, a = 17 / 1500 * 488, i = 17 / 2100 * 680, l = (u) => {
    t.moveTo(...u[0]);
    for (const m of u.slice(1)) t.lineTo(...m);
    t.closePath();
  };
  t.save();
  const d = t.filter;
  t.filter = "none", t.fillStyle = "#00000047", t.beginPath(), l([
    [r, o],
    [n, o],
    [n - a, o + i],
    [r + a, o + i]
  ]), l([
    [n, o],
    [n, s],
    [n - a, s - i],
    [n - a, o + i]
  ]), t.fill(), t.beginPath(), l([
    [r, o],
    [r + a, o + i],
    [r + a, s - i],
    [r, s]
  ]), l([
    [r, s],
    [r + a, s - i],
    [n - a, s - i],
    [n, s]
  ]), t.clip(), t.filter = `${d === "none" ? "" : d + " "}brightness(1.35)`, t.drawImage(e, 0, 0, 488, 680), t.restore();
}
const st = {
  get fem() {
    return Ma("fem").setSymbols.default;
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
}, hc = {
  W: { ...st.por, right: 436.75, centerY: 389.75 },
  U: { ...st.por, right: 436.5, centerY: 392.75 },
  R: { ...st.por, right: 433.75, centerY: 392 },
  G: { ...st.por, right: 434, centerY: 390.75 }
}, cc = {
  all: {
    U: { ...st.all, right: 427.5, centerY: 393.25 },
    W: { ...st.all, right: 427.25, centerY: 392.75 }
  },
  mir: {
    G: { ...st.mir, right: 437, centerY: 390.25 },
    W: { ...st.mir, right: 437.75, centerY: 389.25 }
  },
  sth: {
    G: { ...st.sth, right: 434, centerY: 391 },
    R: { ...st.sth, right: 433.5, centerY: 391.75 },
    W: { ...st.sth, right: 435.25, centerY: 389.25 }
  },
  tmp: {
    U: { ...st.tmp, right: 433, centerY: 392.75 },
    W: { ...st.tmp, right: 433.25, centerY: 389.5 }
  },
  vis: {
    W: { ...st.vis, right: 437.5, centerY: 389.25 }
  },
  wth: {
    W: { ...st.wth, right: 435.75, centerY: 389.75 }
  },
  hml: {
    R: { ...st.hml, right: 437.75, centerY: 393.5 }
  },
  por: hc
};
function gc(t) {
  const e = t.setCode?.toLowerCase() ?? "";
  if (t.setSymbol) return null;
  if (Mt(t)) {
    const o = yt(t)?.setSymbols, n = e === "chr" ? Ia(t.name) : "default", s = n && o?.[n] || o?.default;
    if (s) return s;
  }
  if (!Object.hasOwn(st, e)) return null;
  const r = I(t);
  return r.length === 1 && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") ? cc[e]?.[r[0]] ?? st[e] : st[e];
}
function fc(t) {
  return t.setSymbol || t.setCode?.toLowerCase() !== "exo" ? null : t.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : t.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const Zn = {
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
}, ul = (t) => `${t}#opaque-print-details-v1`, pc = (t) => Object.keys(Zn).some((e) => t === `${J.KEYRUNE_ROOT}/${e}.svg`);
async function bc(t, e) {
  const r = Object.keys(Zn).find((u) => t === `${J.KEYRUNE_ROOT}/${u}.svg`);
  if (!r) return null;
  const o = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), n = o.documentElement, s = o.querySelectorAll("path"), a = s[0]?.getAttribute("d") ?? "", i = a.match(/M[^M]*/g) ?? [], l = Zn[r];
  if (n.localName !== "svg" || o.querySelector("parsererror") || s.length !== 1 || i.length !== l.count || i.some((u) => /m/.test(u) || !/[zZ]\s*$/.test(u)))
    throw new Error(`Unexpected pinned ${r} symbol paths.`);
  const d = o.createElementNS("http://www.w3.org/2000/svg", "path");
  return d.setAttribute("d", l.white.map((u) => i[u]).join("")), d.setAttribute("fill", "#fff"), n.replaceChildren(d), new Blob([new XMLSerializer().serializeToString(o)], { type: "image/svg+xml" });
}
const yc = "symbol-svg-v6", wc = { "leg-c": { sha256: "289e33fd164ee77b5b5d5982b299f485ca668c576368ec796be3b8260de592fd", recipe: "remove-outer-white", pathCount: 7 }, "drk-c": { sha256: "d83257eede46a709ad6f6bf8800928e5954121a75fa8511a255bef4caa382ffa", recipe: "remove-outer-white", pathCount: 2, fill: "#221c13", outline: { stroke: "#505050", width: 24 } }, "6ed-u": { sha256: "631daa24b47c80669e3b27044d9213faa69e9207940a5a7283d67ab7db54e65b", recipe: "white-outer-rim" }, "6ed-r": { sha256: "a6175526471668969615caecff1070f8d9d119ff69b03fc6c03af1ad5fc0f198", recipe: "white-outer-rim" }, "m15-u": { sha256: "bfd962ff9640a846e5690d76c0fe88324e9d49cb6771744b5ab8f34f7afe7362", recipe: "m15" }, "m15-r": { sha256: "933756b97cebe7389ff7cee219a34b1ac13bc504743a2be037a286ee5ffc4b0d", recipe: "m15" }, "m15-m": { sha256: "6e9f87473f1ed8ecb05647fbde6f13e22faeab18fe56b8f76cfa1759bb4210e7", recipe: "m15" }, "8ed-u": { sha256: "6c20e8da28fdd5cdb030814e5c1339978f276c77f4ad9d99ca816adb8d970880", recipe: "8ed" }, "8ed-r": { sha256: "eccde74c56b4810434ecdf4e99206046d6970ea601e4fed2f73eb2ee855053a2", recipe: "8ed" }, "9ed-u": { sha256: "acb7ea7f3422f50dca2aef4e07aa3977aa1641ff2cb54f6eb64ae1bc17abbf53", recipe: "9ed" }, "9ed-r": { sha256: "c1cbcc1aea4f032c5f2ccf7f1d63073813bf9c6f050ba2f5385170ff3deca8a5", recipe: "9ed" }, "7ed-u": { sha256: "94c67d433ba3012f3aa1c494a7ef0ae1e7de58ce4614dfd50ee8f52de527d7e4", recipe: "white-outer-rim" }, "7ed-r": { sha256: "8b30917e85b2c9c3549bfa6c2f62261801df33ff7debcc138bf89c4a9ba9689f", recipe: "white-outer-rim" } }, Xo = {
  revision: yc,
  sources: wc
}, ea = `${B}/img/setSymbols/official/`, ra = Xo.sources;
function Jo(t) {
  if (!t.startsWith(ea) || !t.endsWith(".svg")) return;
  const e = t.slice(ea.length, -4);
  return Object.hasOwn(ra, e) ? ra[e] : void 0;
}
function Sc(t) {
  return !!Jo(t);
}
async function vc(t, e) {
  const r = Jo(t);
  if (!r) return e;
  const o = await e.arrayBuffer();
  if ([...new Uint8Array(await crypto.subtle.digest("SHA-256", o))].map((m) => m.toString(16).padStart(2, "0")).join("") !== r.sha256) throw Error(`Unexpected pinned symbol checksum: ${t}`);
  const a = new DOMParser().parseFromString(new TextDecoder().decode(o), "image/svg+xml"), i = a.documentElement, l = [...i.querySelectorAll("path")], d = i.querySelector("linearGradient, radialGradient");
  if (i.localName !== "svg" || a.querySelector("parsererror") || !d && r.recipe !== "remove-outer-white")
    throw Error(`Unexpected pinned symbol SVG: ${t}`);
  const u = (m, h) => {
    for (const [c, g] of Object.entries(h)) m.setAttribute(c, g);
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
    u(l[0], { fill: `url(#${d.id})`, stroke: "#000", "stroke-width": "8" });
    for (const m of l.slice(1)) m.setAttribute("fill", "#000");
  } else if (r.recipe === "8ed" || r.recipe === "9ed") {
    if (l.length !== 4) throw Error("Unexpected numeric shield path topology.");
    const m = l[2], h = m.parentElement?.getAttribute("transform");
    if (!h) throw Error("Missing numeric shield coordinate transform.");
    if (l[0].setAttribute("fill", "#000"), l[3].setAttribute("fill", "#000"), r.recipe === "9ed") {
      const c = d.cloneNode(!0);
      u(c, {
        id: "glint-root-metal",
        gradientTransform: `${h} ${d.getAttribute("gradientTransform") ?? ""}`
      }), d.after(c), u(l[3], {
        stroke: "url(#glint-root-metal)",
        "stroke-width": "12",
        "paint-order": "stroke fill"
      });
    }
  } else throw Error(`Unknown symbol SVG patch recipe: ${r.recipe}`);
  return i.setAttribute("data-card-glint-patch", Xo.revision), new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" });
}
const ml = (t) => `${t}#printed-outline-v1`;
async function Cc(t, e) {
  const r = Jo(t)?.outline;
  if (!r) return null;
  const o = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), n = o.documentElement, s = [...n.querySelectorAll("path")];
  if (n.localName !== "svg" || o.querySelector("parsererror") || n.getAttribute("data-card-glint-patch") !== Xo.revision || s.length !== 1)
    throw Error(`Unexpected prepared symbol outline: ${t}`);
  const a = s[0];
  return a.setAttribute("stroke", r.stroke), a.setAttribute("stroke-width", String(r.width)), a.setAttribute("stroke-linejoin", "round"), a.setAttribute("paint-order", "stroke fill"), new Blob([new XMLSerializer().serializeToString(o)], { type: "image/svg+xml" });
}
function kc(t, e, r, o, n, s) {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0;
  const a = document.createElement("canvas");
  a.width = t.canvas.width, a.height = t.canvas.height;
  const i = a.getContext("2d");
  if (!i) throw Error("Retro lettering needs a Canvas2D context");
  const l = t.getTransform();
  i.font = t.font, i.textAlign = t.textAlign, i.textBaseline = t.textBaseline, i.letterSpacing = t.letterSpacing, t.resetTransform();
  for (const [d, u, m] of [
    [0, s, "#f2eee3"],
    [s, 0, "#17140f"]
  ])
    i.resetTransform(), i.clearRect(0, 0, a.width, a.height), i.setTransform(l), i.globalCompositeOperation = "source-over", i.fillStyle = m, i.fillText(e, r + d, o + d, n), i.globalCompositeOperation = "destination-out", i.fillText(e, r + u, o + u, n), t.drawImage(a, 0, 0);
  a.width = a.height = 0, t.restore();
}
function yr(t, e, r, o, n, s, a = "#ababab", i, l = "stats") {
  t.save(), t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, dt(t, e, r + s, o + s, n, i, l, () => {
    t.fillStyle = "#17140f", t.fillText(e, r + s, o + s, n);
  }), t.fillStyle = a, dt(t, e, r, o, n, i, l), t.restore();
}
const Tc = {
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
function hl() {
  return Tc;
}
function An(t, e, r, o, n) {
  const s = hl()[r];
  t.save(), t.translate(s.x, s.y), t.scale(s.width, 1), t.font = `${s.size}px "CardRenderer MTG ${r === "title" ? "Goudy" : "MPlantin"}", Georgia`, t.textAlign = "left", t.textBaseline = r === "artist" ? "alphabetic" : "middle", yr(
    t,
    e,
    0,
    0,
    o / s.width,
    r === "artist" ? 1.25 : 1,
    "#ababab",
    r === "type" ? n : void 0,
    "type"
  ), t.restore();
}
function Mc(t, e, r, o) {
  const n = hl(), s = e.wordingMode === "oracle" ? 10 : 15, a = r.reduce((d, u) => d + u.runs.reduce((m, h) => m + h.text.length, 0), 0) > 150, i = (d) => ({
    leading: d.leading,
    paragraphGap: d.paragraph,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    centerOffset: d.offset
  });
  if (e.rulesAlignment?.mode !== "left") {
    const d = He(
      t,
      r,
      o,
      n.basic,
      n.basic.size,
      s,
      5,
      { ...i(n.basic), balanceLines: !0 },
      150
    );
    if (d)
      return a ? G(
        t,
        r.map((u) => ({ ...u, align: "center" })),
        n.dual,
        n.dual.size,
        Math.min(s, n.dual.size),
        { ...i(n.dual), balanceLines: !0 }
      ) : d;
  }
  const l = a ? n.dual.size : n.basic.size;
  return G(t, r, n.dual, l, Math.min(s, l), i(n.dual));
}
function Rc(t) {
  return ["lea", "leb", "2ed"].includes(t.setCode?.toLowerCase() ?? "");
}
function xc(t, e) {
  t.save(), t.font = '22.5px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.textBaseline = "alphabetic", yr(t, `Illus. © ${e}`, 49, 631, 338, 1.25), t.restore();
}
function Ec(t, e, r, o, n, s) {
  t.save();
  const a = document.createElement("canvas");
  try {
    const i = t.getTransform();
    t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.fillStyle = "#17140f", t.fillText(e, r + s.shadow / s.width, o + s.shadow, n), a.width = t.canvas.width, a.height = t.canvas.height;
    const l = a.getContext("2d");
    if (!l) throw Error("Artist ink needs a Canvas2D context");
    l.setTransform(i), l.font = t.font, l.textAlign = t.textAlign, l.textBaseline = t.textBaseline, l.letterSpacing = t.letterSpacing, l.fillStyle = "#f2eee3", l.fillText(e, r, o, n), s.trim > 0 && (l.globalCompositeOperation = "destination-out", l.globalAlpha = 0.65, l.lineWidth = s.trim * 2, l.strokeText(e, r, o, n)), t.resetTransform(), t.drawImage(a, 0, 0);
  } finally {
    a.width = a.height = 0, t.restore();
  }
}
const na = {
  arn: { size: 22, x: 49.75, y: 638.5, width: 1.02, edge: 1.25 },
  atq: { size: 21, x: 48.75, y: 638.5, width: 1.075, edge: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.5, width: 1.045, edge: 1.25 }
}, Ac = {
  arn: { size: 22, x: 49.25, y: 638.5, width: 1.025, trim: 0.8, shadow: 1.5 },
  atq: { size: 21, x: 48.5, y: 638.5, width: 1.075, trim: 0.75, shadow: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.25, width: 1.045, trim: 0.55, shadow: 1.5 }
};
function cl(t) {
  const e = t.setCode?.toLowerCase();
  if (e !== "arn" && e !== "atq" && e !== "drk" || t.frameTemplate || t.frameStyle === "modern" || t.layout && t.layout !== "normal" || t.borderColor && t.borderColor !== "black" || t.legendary || /\b(Legendary|Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return;
  const r = t.typeLine ?? "", o = t.land ?? /\bLand\b/.test(r), n = t.artifact ?? /\bArtifact\b/.test(r), s = I(t).length;
  if (!(!o && !n && s !== 1 && !(e === "drk" && s === 2)))
    return Ac[e];
}
function Lc(t, e) {
  const r = e.setCode?.toLowerCase();
  if (!e.artist || r !== "arn" && r !== "atq" && r !== "drk") return !1;
  const o = cl(e), n = o ?? na[r];
  t.save(), t.translate(n.x, n.y), t.scale(n.width, 1), t.font = `${n.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = "left", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
  const s = `Illus. © ${r === "drk" ? "1994 " : ""}${e.artist}`;
  return o ? Ec(t, s, 0, 0, 338 / n.width, o) : kc(t, s, 0, 0, 338 / n.width, na[r].edge), t.restore(), !0;
}
const Oc = {
  arn: { x: 452, y: 638, size: 26, width: 1.03, trim: 0.9, shadow: 2, shadowTrim: 0.4 },
  atq: { x: 452.5, y: 639, size: 27.5, width: 0.97, trim: 0.9, shadow: 1.5, shadowTrim: 0.2 },
  drk: { x: 452, y: 640, size: 27, width: 1.01, trim: 0.8, shadow: 1.25, shadowTrim: 0.3 }
};
function $c(t) {
  const e = t.setCode?.toLowerCase();
  if (!(e !== "arn" && e !== "atq" && e !== "drk" || t.power == null || t.toughness == null || !cl(t)))
    return Oc[e];
}
function Bc(t, e) {
  const r = $c(e);
  if (!r) return !1;
  t.save();
  try {
    t.translate(r.x, r.y), t.scale(r.width, 1), t.font = `${r.size}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = "right", t.textBaseline = "alphabetic", t.letterSpacing = "0px";
    const o = `${e.power}/${e.toughness}`.replaceAll("-", "–");
    Ic(t, o, 132 / r.width, r, e.textInk);
  } finally {
    t.restore();
  }
  return !0;
}
function Ic(t, e, r, o, n) {
  const s = document.createElement("canvas");
  t.save();
  try {
    s.width = t.canvas.width, s.height = t.canvas.height;
    const a = s.getContext("2d");
    if (!a) throw Error("Stats ink needs a Canvas2D context");
    const i = t.getTransform();
    a.font = t.font, a.textAlign = t.textAlign, a.textBaseline = t.textBaseline, a.letterSpacing = t.letterSpacing, t.shadowColor = "transparent", t.shadowOffsetX = t.shadowOffsetY = 0, t.resetTransform();
    for (const [l, d, u] of [
      [o.shadow, o.shadowTrim, "#17140f"],
      [0, o.trim, "#f2eee3"]
    ]) {
      a.resetTransform(), a.clearRect(0, 0, s.width, s.height), a.setTransform(i), a.globalAlpha = 1, a.globalCompositeOperation = "source-over", a.fillStyle = u;
      const m = l / o.width;
      dt(a, e, m, l, r, n, "stats", () => {
        l && (a.fillStyle = u), a.fillText(e, m, l, r);
      }), d > 0 && (a.globalCompositeOperation = "destination-out", a.globalAlpha = 0.65, a.lineWidth = d * 2, a.strokeText(e, m, l, r)), t.drawImage(s, 0, 0);
    }
  } finally {
    s.width = s.height = 0, t.restore();
  }
}
const Ln = {
  centered: { left: 10.5, right: -2.5, y: -5, size: 0.5, width: 0.975, leading: -0.5 },
  regular: { left: 10.5, right: -1, y: -2, size: 0, width: 1.005, leading: -0.5 },
  long: { left: 10.5, right: -2, y: 9.5, size: 0, width: 0.99, leading: -0.25 }
};
function Gc(t, e, r) {
  if (e.setCode?.toLowerCase() !== "lea" || !r) return r;
  const o = Wi(r);
  if (!o || !o.paragraphs.length) return r;
  const n = o.paragraphs, a = n.every((f) => f.align === "center") ? r.lines.length >= 5 && r.size >= 30 ? Ln.long : Ln.centered : n.some((f) => f.align === "center") || r.size < 19 ? null : Ln.regular;
  if (!a) return r;
  const i = r.size + a.size, l = G(
    t,
    n,
    { x: 0, y: 0, width: (r.width - a.left - a.right) / a.width, height: 200 },
    i,
    i,
    {
      ...o.typography,
      leading: o.typography.leading + a.leading / i,
      flavorSeparator: r.separators.length > 0
    }
  ), d = (r.x + a.left) / a.width, u = r.top + a.y - l.top, m = {
    ...l,
    x: d,
    top: l.top + u,
    horizontalScale: a.width,
    lines: l.lines.map((f) => ({
      ...f,
      x: (f.x ?? l.x) + d,
      baseline: f.baseline + u,
      inkBounds: [f.inkBounds[0] + d, f.inkBounds[1] + u, f.inkBounds[2], f.inkBounds[3]]
    })),
    separators: l.separators.map((f) => f + u)
  }, h = e.wordingMode === "oracle" ? 428 : Math.min(412, r.top - 1), c = e.wordingMode === "oracle" ? 590 : 600;
  return l.overflow || m.lines.some(
    ({ inkBounds: [f, b, y, p] }) => b < h || b + p > c || f * a.width < 48 || (f + y) * a.width > 448
  ) ? r : m;
}
function Pc(t, e, r) {
  const o = yt(e), n = Mt(e)?.material, s = n && o?.rulesAdjustments && {
    ...o.rulesAdjustments.default,
    ...o.rulesAdjustments[n]
  };
  if (!r || !s || !Object.values(s).some(Boolean)) return r;
  const a = Wi(r);
  if (!a) throw Error("Selected rules policy does not expose calibration inputs");
  const { bounds: i, typography: l } = a, d = s.leftMargin ?? 0, u = s.rightMargin ?? 0, m = s.vertical ?? 0, h = s.alignment && s.alignment !== "printing" ? a.paragraphs.map((c) => ({ ...c, align: s.alignment })) : a.paragraphs;
  return G(
    t,
    h,
    {
      ...i,
      x: i.x + d,
      y: i.y + m,
      width: i.width - d - u,
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
}
function Fc(t, e, r, o, n) {
  const s = r.centered, a = n.reduce((u, m) => u + m.runs.reduce((h, c) => h + c.text.length, 0), 0), i = e.wordingMode === "oracle" ? Math.min(10, r.minimumSize) : r.minimumSize;
  let l = !1;
  if (s && e.rulesAlignment?.mode !== "left" && a <= s.maxCharacters) {
    const u = G(
      t,
      n,
      r.bounds,
      s.maximumSize,
      s.maximumSize,
      r.typography
    );
    l = !u.overflow && u.lines.length <= s.maxLines;
  }
  const d = o.map((u) => ({
    ...u,
    align: u.align ?? (e.rulesAlignment?.mode === "left" ? "left" : l ? "center" : "left")
  }));
  return G(
    t,
    d,
    r.bounds,
    l ? s.maximumSize : r.maximumSize,
    i,
    r.typography
  );
}
const Yr = (t) => t?.runs.map((e) => e.text).join("") ?? "", oa = (t) => t.length === 2 && /^[A-Za-z ,]+$/.test(Yr(t[0])) && Yr(t[0]).length <= 20;
function _c(t, e, r, o, n, s, a, i) {
  const l = (c) => c.role === "rules" && c.runs.length > 0 && !Yr(c).includes(`
`) && c.align === void 0;
  if (!r.length || !r.every(l) || e.some((c) => c.align) || r.length !== 1 && !oa(r)) return null;
  const d = (c) => c.map(
    (g, f) => ({
      ...g,
      align: g.align ?? (g.role === "flavor" || oa(c) && f === 0 && !/^Enchant\b/.test(Yr(g)) ? "left" : "center")
    })
  ), u = { x: 70, y: o - 6, width: 348, height: n - 8 }, m = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, h = G(t, d(r), u, s, s, m);
  return h.overflow || h.lines.length > 5 ? null : G(
    t,
    d(e),
    { ...u, verticalLimits: i },
    s,
    a,
    m
  );
}
function sa(t, e) {
  return !vt(t) || t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode !== "original" ? e : e.map(
    (r) => r.role !== "rules" ? r : {
      ...r,
      runs: r.runs.map((o) => ({
        ...o,
        text: o.text.replace(/\{(\d+|[XYZ])\}/g, "$1")
      }))
    }
  );
}
const qr = (t) => t.runs.map((e) => e.text).join(""), Wc = (t) => t.role === "rules" && /^[A-Za-z ,]+$/.test(qr(t)) && qr(t).length <= 28, Rr = { x: 72, y: 413, width: 344, height: 182 }, On = {
  leading: 1,
  paragraphGap: 0,
  flavorGap: 0,
  flavorOrphans: !1,
  flavorSeparator: !1,
  centerOffset: -14
}, aa = (t) => t.map((e, r) => ({
  ...e,
  align: e.role === "rules" && (t.some((o) => o.role === "flavor") || r === 0 && t.length > 1 && Wc(e)) ? "left" : "center"
}));
function Uc(t, e, r, o) {
  if (!vt(e) || e.borderColor && e.borderColor !== "black") return null;
  const n = e.wordingMode === "oracle" ? 10 : 15, s = o.reduce(
    (l, d) => l + qr(d).replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
    0
  );
  if (e.rulesAlignment?.mode !== "left" && s <= (o.every((l) => l.role === "flavor") ? 135 : 130) && o.length > 0 && o.every((l) => l.align === void 0 && !qr(l).includes(`
`)) && r.every((l) => l.align === void 0)) {
    const l = {
      ...On,
      leading: 1.1,
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, d = G(t, aa(o), Rr, 27.5, 27.5, l);
    if (!d.overflow && d.lines.length <= 5)
      return G(t, aa(r), Rr, 27.5, n, l);
  }
  const i = G(t, r, Rr, 22.25, 21.75, On);
  return i.overflow ? G(t, r, Rr, 15.5, n, {
    ...On,
    leading: 1.2
  }) : i;
}
const jc = {
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
}, he = { x: 70, y: 414, width: 348, height: 184 }, Hr = (t) => t.runs.map((e) => e.text).join(""), Nc = (t) => t.reduce(
  (e, r) => e + Hr(r).replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
  0
), Dc = (t) => t.role === "rules" && /^[A-Za-z ,]+$/.test(Hr(t)) && Hr(t).length <= 28, ia = (t, e = !1) => t.map((r, o) => ({
  ...r,
  align: !e && r.role === "rules" && (t.some((n) => n.role === "flavor") || o === 0 && t.length > 1 && Dc(r)) ? "left" : "center"
}));
function zc(t, e, r, o) {
  const n = e.setCode?.toLowerCase();
  if (n !== "arn" && n !== "atq" && n !== "drk" || e.frameTemplate || e.frameAssetFamily || e.frameStyle === "modern" || e.borderColor && e.borderColor !== "black" || e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return null;
  const s = jc[n], a = e.wordingMode === "oracle" ? 10 : 15, i = {
    textWidth: s.textWidth,
    leading: 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    centerOffset: s.offset
  };
  if (e.rulesAlignment?.mode !== "left" && o.length > 0 && Nc(o) <= s.threshold && o.every((u) => u.align === void 0 && !Hr(u).includes(`
`)) && r.every((u) => u.align === void 0)) {
    const u = n === "drk", m = u ? { ...he, x: 76, width: 336 } : he, h = {
      ...i,
      textWidth: 1,
      leading: 1.1,
      centerOffset: u ? 0 : -14,
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, c = G(
      t,
      ia(o, u),
      m,
      27.5,
      27.5,
      h
    );
    if (!c.overflow && c.lines.length <= 5) {
      const g = ia(r, u), f = G(t, g, m, 27.5, a, h);
      return !u || f.lines.length >= 5 ? f : G(t, g, m, 27.5, a, {
        ...h,
        centerOffset: -2 * (5 - f.lines.length)
      });
    }
  }
  if (!G(t, r, he, 22.5, 21.75, {
    ...i,
    textWidth: 1
  }).overflow) {
    const u = G(
      t,
      r,
      he,
      s.regular,
      Math.min(s.regular, 21.75 / Math.max(1, s.textWidth)),
      i
    );
    if (n !== "drk") return u;
    const m = u.lines.length <= 5;
    return G(
      t,
      r,
      { ...he, x: 71, y: m ? 415 : 418, width: m ? 348 : 351 },
      s.regular,
      Math.min(s.regular, 21.75 / Math.max(1, s.textWidth)),
      { ...i, leading: 0.96 }
    );
  }
  return G(
    t,
    r,
    n === "drk" ? { ...he, x: 73, y: 418, width: 342 } : he,
    s.compact,
    a,
    {
      ...i,
      textWidth: 1,
      leading: n === "drk" ? 1.22 : s.compactLeading
    }
  );
}
const la = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: !1,
  flavorSeparator: !1
};
function Yc(t, e) {
  return Pc(
    t,
    e,
    Gc(t, e, qc(t, e))
  );
}
function qc(t, e) {
  if (co(e)) return null;
  const [r, o, n, s] = Et(mo(e).rules), a = so(e), i = sa(
    e,
    a?.paragraphs ?? Xe({
      rulesText: e.rulesText ?? "",
      rulesParagraphs: e.rulesParagraphs
    })
  ), l = e.rulesAlignment?.mode === "left", d = l ? i.map((O) => O.role === "rules" ? { ...O, align: "left" } : O) : i, u = e.rulesAlignment?.mode === "auto" ? sa(e, e.rulesAlignment.reference ?? d) : d, m = e.wordingMode === "oracle" ? 10 : 15;
  if (bt(e)) return Mc(t, e, d, u);
  const h = Uc(t, e, d, u);
  if (h) return h;
  const c = zc(t, e, d, u);
  if (c) return c;
  const g = Mt(e), f = g && yt(e)?.body, b = f && (f[g.material] ?? f.default);
  if (b) return Fc(t, e, b, d, u);
  const y = e.setCode?.toLowerCase(), p = Gu(y) ? { ...la, flavorAttribution: "right" } : la, w = y === "lea" && e.wordingMode === "oracle" ? [428, 590] : void 0, S = ["lea", "leb", "2ed"].includes(y ?? ""), v = S || y === "3ed" && Ot(e) === "fourth";
  if (v && !l) {
    const O = _c(
      t,
      d,
      u,
      o,
      s,
      S ? 32.5 : 27.5,
      m,
      w
    );
    if (O) return O;
  }
  const C = u.length === 1 ? u[0] : void 0, T = C?.runs.length === 1 ? C.runs[0] : void 0;
  if (!l && y === "4ed" && Ot(e) === "fourth" && u.some((O) => O.role === "flavor")) {
    const O = He(
      t,
      d,
      u,
      { x: 72, y: o + 2, width: 344, height: s - 8 },
      25,
      m,
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
  const R = !l && y === "4ed" && Ot(e) === "fourth" && d.every((O) => O.align === void 0 || O.align === "center") && C?.role === "rules" && (C.align === void 0 || C.align === "center") && T && !T.italic && !T.text.includes(`
`) && T.text.length > 0 && T.text.length <= 100, M = (v || y === "4ed" && Ot(e) === "fourth") && (d.length > 1 || d.reduce((O, V) => O + V.runs.reduce((D, Z) => D + Z.text.length, 0), 0) > 100), x = M && v, A = M && y === "4ed", F = (y === "mir" || y === "tmp") && !a && !/\b(?:Land|Artifact)\b/.test(e.typeLine ?? "") && I(e).join("") === "W", L = G(
    t,
    R ? d.map((O) => ({ ...O, align: "center" })) : d,
    {
      x: v ? 70 : A || R ? 72 : r,
      y: o + (a ? 1.5 : R ? -6 : A ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: v ? 346 : A || R ? 344 : n + (F ? 10 : 0),
      height: s - 8,
      verticalLimits: w
    },
    a ? 24 : R ? 25 : 22.5,
    m,
    R ? { ...p, leading: 1, balanceLines: !0 } : M ? {
      ...p,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: x ? -10 : 0
    } : p
  ), U = d.reduce(
    (O, V) => O + V.runs.reduce((D, Z) => D + Z.text.length, 0),
    0
  );
  return !x || U <= 270 || L.size >= 22 ? L : G(
    t,
    d,
    { x: 70, y: o + 4, width: 346, height: s + 8, verticalLimits: w },
    15.5,
    m,
    {
      ...p,
      leading: 1.25,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: -18
    }
  );
}
function Hc(t) {
  return t.setCode?.toLowerCase() === "3ed" && Ot(t) === "fourth";
}
function Xc(t, e, r, o, n) {
  t.save(), t.font = '26px "CardRenderer MTG Goudy", Georgia', yr(t, e, 40, o, n + r - 40, 1), t.restore();
}
function Jc(t, e, r, o) {
  t.save(), t.font = '27.25px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "right", yr(t, e, 451, r + 11, 130, 1.25, "#d4d4d4", o), t.restore();
}
function Kc(t, e) {
  t.save(), t.font = '22px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.textBaseline = "alphabetic", yr(t, `Illus. © ${e}`, 50, 642, 338, 1.25), t.restore();
}
function Vc(t, e, r, o, n) {
  const s = mo(e), a = Vh(e), i = Hc(e);
  if (n === "artwork") {
    Ft(t, e, r, Et(s.art), n);
    return;
  }
  const d = Tt(e) ?? qd(e);
  t.fillStyle = d, t.fillRect(0, 0, 488, 680), t.fillStyle = "#686050", t.fillRect(24.4, 27.2, 439.2, 625.6), t.fillStyle = "#e5dec5", t.fillRect(...Et(s.rules)), t.fillStyle = "#746b58", t.fillRect(...Et(s.art)), o && t.drawImage(o, 0, 0, 488, 680), Ft(t, e, r, Et(s.art), n);
  const u = r.get(Kt(e));
  u && (t.save(), t.filter = Hd(e), t.drawImage(u, ...Et(s.frame)), uc(t, u, Kt(e)), Kt(e).endsWith("/seventh/regular/m.png") && mc(t, u), t.restore());
  const m = Mt(e)?.stockWindow ?? Ne(e)?.stockWindow ?? vt(e)?.stockWindow;
  if (m)
    Gh(t, Et(m), d);
  else if (bt(e) || Za(e))
    t.save(), t.fillStyle = d, t.beginPath(), t.rect(0, 0, 488, 680), t.rect(24, 29, 440, 623), t.fill("evenodd"), t.strokeStyle = "#30312e", t.lineWidth = 1.5, t.strokeRect(24.5, 29.5, 439, 622), t.restore();
  else if (Gt(e) !== "black" || Ot(e) === "fourth") {
    const j = r.get(ho(e));
    j && Ph(t, j, Et(s.frame), d);
  }
  t.fillStyle = e.setCode?.toLowerCase() === "lea" ? "#828282" : ms(e), t.textBaseline = "middle", t.textAlign = "left", t.letterSpacing = "0px";
  const [h, c, g, f] = Et(s.title), b = e.manaSymbols ?? [], y = Fh(e), p = y?.[3] ?? a?.manaSize ?? 23.4, w = y ? y[2] - p : a?.manaGap ?? 1.7, S = b.length * (p + w), v = y ? y[0] + p / 2 - S + w : a ? a.manaRight - S + w : h + g - S, C = ["lea", "2ed"].includes(e.setCode?.toLowerCase() ?? ""), T = i || C ? [
    (i ? 435 : 432) - Math.max(0, b.length - 1) * 27 - (i ? 23.4 : 23.9) / 2,
    (i ? 44.5 : 46) - (i ? 23.4 : 23.9) / 2,
    Math.max(0, b.length - 1) * 27 + (i ? 23.4 : 23.9),
    i ? 23.4 : 23.9
  ] : [
    v,
    y ? y[1] - p / 2 : a?.manaTop ?? c + f / 2 - p / 2,
    Math.max(0, S - w),
    p
  ], R = rn(e), M = z0(T, b.length, R), x = pe(M, R);
  t.shadowColor = "#000b", t.shadowOffsetX = t.shadowOffsetY = t.getTransform().a, t.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const A = a?.titleX ?? h, F = c + f / 2 + (a?.titleYOffset ?? 0), L = Math.max(
    1,
    b.length ? v + x[0] - T[0] - A - 5 : a?.titleX == null ? g - 5 : h + g - A - 5
  );
  t.save(), t.translate(...Yo(e, "retro")), bt(e) ? An(t, e.name, "title", L) : i ? Xc(t, e.name, A, F, L) : !jh(t, e, A + L) && !Wh(t, e, A + L) && t.fillText(e.name, A, F, L), t.restore();
  const U = e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode === "oracle", O = e.symbolStyle === "original" || e.symbolStyle === void 0 && e.wordingMode === "original", V = O && ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "");
  H(
    t,
    e,
    "manaCost",
    () => Fe(t, M, R, () => {
      i ? Xh(t, b, r, U, R) : ["lea", "2ed"].includes(e.setCode?.toLowerCase() ?? "") ? Jh(t, b, r, U, R) : b.forEach(
        (j, nt) => (V ? ll : et)(
          t,
          j,
          v + nt * (p + w) - (b.length - 1 - nt) * (R?.spacing ?? 0),
          y ? y[1] - p / 2 : a?.manaTop ?? c + f / 2 - p / 2,
          p,
          r,
          !1,
          R
        )
      );
    })
  );
  const [D, Z, ut, it] = Et(s.type), z = Qa(e) ?? "", N = r.get(z), P = gc(e), q = fc(e), ie = N ? Math.min(44 / N.width, (a?.setHeight ?? 23.4) / N.height) : 0, wt = P?.width ?? (N?.width ?? 0) * ie, le = P?.height ?? (N?.height ?? 0) * ie, de = [
    (P?.right ?? a?.setRight ?? D + ut) - wt,
    (P?.centerY ?? a?.setCenterY ?? Z + it / 2) - le / 2,
    wt,
    le
  ], Dt = qo(e, z, de, "retro"), zt = pe(Dt, e.symbolAdjustment?.set), qt = Yh(e);
  t.font = `${qt.fontSize}px "CardRenderer MTG MPlantin", Georgia`;
  const ve = bt(e) ? (j, nt, gt, mt) => An(t, j, "type", mt, e.textInk) : (j, nt, gt, mt) => {
    !Hh(t, e, j, nt + mt) && !zh(t, e, j, nt, gt, mt) && dt(t, j, nt, gt, mt, e.textInk, "type");
  };
  t.save(), t.translate(qt.dx, qt.dy), ve(
    so(e)?.typeLine ?? e.typeLine ?? "",
    a?.typeX ?? D,
    Z + it / 2,
    N ? Math.max(
      1,
      Math.min(
        ut - 48,
        P ? P.right - P.width - D - 6 : ut,
        zt !== de ? zt[0] - (a?.typeX ?? D) - 6 : ut
      )
    ) : ut
  ), t.restore(), H(
    t,
    e,
    "setSymbol",
    () => Fe(t, Dt, e.symbolAdjustment?.set, () => {
      if (N) {
        const j = Math.min(44 / N.width, (a?.setHeight ?? 23.4) / N.height), nt = P?.width ?? N.width * j, gt = P?.height ?? N.height * j, mt = P?.right ?? a?.setRight ?? D + ut, $ = P?.centerY ?? a?.setCenterY ?? Z + it / 2, Y = P?.crop ?? [0, 0, 1, 1], lt = _t(z), Rt = !lt && !e.setSymbol && r.get(ul(z));
        if (Rt && (t.save(), t.shadowColor = "transparent", e.setCode?.toLowerCase() === "arn" && (t.filter = "brightness(0.7)"), t.drawImage(
          Rt,
          Y[0] * Rt.width,
          Y[1] * Rt.height,
          Y[2] * Rt.width,
          Y[3] * Rt.height,
          mt - nt,
          $ - gt / 2,
          nt,
          gt
        ), t.restore()), lt || e.setSymbol) {
          t.save(), t.shadowColor = "transparent";
          const Xt = !e.setSymbol && e.setCode?.toLowerCase() === "drk" && Gt(e) === "black" && _(e).boxes === "B" ? r.get(ml(z)) : void 0;
          t.drawImage(Xt ?? N, ...Dt), t.restore();
        } else q || a || La(e.setCode) ? ec(
          t,
          N,
          mt - nt,
          $ - gt / 2,
          nt,
          gt,
          P?.outline ?? (q ? 2 : a?.setOutline ?? rd(e.setCode)),
          Y,
          q,
          P?.sampling
        ) : te(
          t,
          N,
          e.setCode,
          e.rarity,
          D + ut - N.width * j,
          Z + it / 2 - N.height * j / 2,
          N.width * j,
          N.height * j
        );
      }
    })
  ), t.shadowColor = "transparent";
  const [Ce, ue, Ht, ee] = Et(s.rules);
  t.fillStyle = "#17140f";
  const ct = r.get(co(e) ?? "");
  if (ct && Qt(t)) {
    const j = Math.min(Ht * 0.4 / ct.width, ee * 0.75 / ct.height);
    t.drawImage(
      ct,
      Ce + (Ht - ct.width * j) / 2,
      ue + (ee - ct.height * j) / 2,
      ct.width * j,
      ct.height * j
    );
  } else {
    const j = Yc(t, e);
    j && Ct(
      t,
      j,
      r,
      U ? et : O ? tc(e.setCode) : e.setCode?.toLowerCase() === "3ed" ? Vn : a ? Ho : et
    );
  }
  if (lc(t, e)) {
    $n(t, e, !0);
    return;
  }
  if (!dc(t, e)) {
    if (sc(t, e)) {
      $n(t, e, !1);
      return;
    }
    if (t.shadowColor = a?.statsOpaqueShadow ? "#000" : "#000b", a && (t.shadowOffsetX = t.shadowOffsetY = a.statsShadow * t.getTransform().a), t.fillStyle = ms(e), t.font = '27.8px "CardRenderer MTG MPlantin", Georgia', t.textBaseline = "middle", e.power != null && e.toughness != null && !Bc(t, e)) {
      const [j, nt, gt, mt] = Et(s.stats), $ = Kh(e);
      t.textAlign = $ ? "right" : "center", i ? Jc(t, Kn(e), nt + mt / 2, e.textInk) : dt(
        t,
        Kn(e),
        $?.right ?? j + gt / 2,
        nt + mt / 2 + ($?.yOffset ?? 0),
        $?.maxWidth ?? gt,
        e.textInk
      );
    }
    a ? rc(t, e, a) : H(t, e, "artist", () => {
      if (!Lc(t, e)) {
        if (bt(e) && e.artist)
          An(t, `Illus. © ${e.artist}`, "artist", 390);
        else if (i && e.artist) Kc(t, e.artist);
        else if (e.artist && Rc(e)) xc(t, e.artist);
        else if (e.artist) {
          const [j, nt, gt, mt] = Et(s.footer);
          t.textAlign = "center", t.font = '15.6px "CardRenderer MTG MPlantin", Georgia', t.fillText(`Illus. ${e.artist}`, j + gt / 2, nt + mt / 2, gt);
        }
      }
    }), $n(t, e, !a), t.shadowColor = "transparent";
  }
}
function $n(t, e, r) {
  r && e.legalText && H(t, e, "legal", () => {
    t.save(), t.shadowColor = "transparent", t.fillStyle = Bt(e.setCode, e.borderColor).ink, t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "left", t.fillText(e.legalText, 49, 646, 390), t.restore();
  });
  const o = e.collectorNumber?.trim();
  o && e.collectorTotal !== void 0 && H(t, e, "collector", () => {
    t.save(), t.shadowColor = "transparent", t.fillStyle = Bt(e.setCode, e.borderColor).ink, t.font = '10px "CardRenderer MTG MPlantin", Georgia', t.textAlign = "right", t.fillText(
      o + (e.collectorTotal ? "/" + e.collectorTotal : ""),
      439,
      660,
      180
    ), t.restore();
  }), t.shadowColor = "transparent";
}
let da;
const Zc = [
  { family: "CardRenderer MTG Goudy", url: Dd, weight: "400", style: "normal" },
  {
    family: "CardRenderer MTG Historic Symbols",
    url: Nd,
    weight: "400",
    style: "normal"
  }
];
function Qc() {
  return typeof FontFace != "function" ? Promise.resolve() : da ??= Promise.all(
    Zc.map(async ({ family: t, url: e }) => {
      if ([...document.fonts].some(
        (o) => o.family.replace(/^"|"$/g, "") === t && o.status === "loaded"
      ))
        return;
      const r = await eo(e);
      if (!r.ok) throw Error(`Retro font unavailable: ${t}`);
      document.fonts.add(await new FontFace(t, await r.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((t) => {
    throw da = void 0, t;
  });
}
const gl = `${Ie}/img/class_level_bg.webp`, fl = (t) => ["adventure", "class", "leveler"].includes(tt(t)), Le = (t, e, r, o) => ({
  x: t / 63.5 * 488,
  y: e / 88.9 * 680,
  width: r / 63.5 * 488,
  height: o / 88.9 * 680
}), tg = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function eg(t, e, r, o = 21) {
  const n = t.replace(/\{[^}]+\}/g, "●").split(`
`);
  let s = o;
  for (; s > 8 && n.reduce(
    (a, i) => a + Math.max(1, Math.ceil(i.length * s * 0.53 / e)) * s + 4,
    0
  ) > r; )
    s -= 0.5;
  return s;
}
function sn(t) {
  const e = tt(t), r = [], o = (n, s, a, i = {}) => {
    r.push({ kind: n, text: s, ...a, font: eg(s, a.width, a.height), ...i });
  };
  if (e === "adventure") {
    const n = t.faces?.[1];
    if (!n) return [];
    const s = (n.manaSymbols ?? []).map((i) => `{${i}}`).join(""), a = (n.manaSymbols?.length ?? 0) * 2.5;
    o("heading", n.name, Le(5.6, 55.3, 25 - a, 4.2), {
      color: "white",
      font: Math.min(18, (25 - a) * 488 / 63.5 / Math.max(1, n.name.length * 0.55))
    }), o("rules", s, Le(30 - a, 55.3, a, 4.2), { color: "white", font: 17 }), o("heading", n.typeLine ?? "", Le(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (n.typeLine ?? "").length * 0.52))
    }), o("rules", n.rulesText ?? "", Le(5.6, 64.5, 24.7, 15.6)), o("rules", t.rulesText ?? t.faces?.[0]?.rulesText ?? "", Le(33, 54.9, 25.5, 25));
  } else if (e === "class") {
    const [n, s, a, i] = Pt(t).rules.map(
      (w, S) => w * (S % 2 ? E : k)
    ), l = _(t);
    o(
      "band",
      "",
      { x: n, y: s, width: a, height: i },
      {
        fill: "#e3d8bb",
        asset: Lt(
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
    const u = (w) => /^.*:\s*Level\s+\d+\s*$/i.test(w), m = 28, h = 20, c = (w, S) => w.split(`
`).reduce(
      (v, C) => v + Math.max(1, Math.ceil(C.length * S * 0.53 / (a - 10))),
      0
    ), g = d.map(
      (w) => u(w) ? m : c(w, w.startsWith("(") ? 16 : h) * (w.startsWith("(") ? 16 : h) + 8
    ), f = d.filter((w) => !u(w)).length, b = Math.max(0, i - g.reduce((w, S) => w + S, 0)) / Math.max(1, f), y = Math.min(
      1,
      (i - d.filter(u).length * m) / g.reduce((w, S, v) => w + (u(d[v]) ? 0 : S), 0)
    );
    let p = s;
    d.forEach((w, S) => {
      const v = u(w), C = v ? m : g[S] * y + b;
      if (v) {
        const [T, R] = w.split(/:\s*/);
        o("band", "", { x: n, y: p, width: a, height: C }, { asset: gl }), o("rules", T + ":", { x: n + 5, y: p, width: a / 2 - 5, height: C }, { font: 18 }), o(
          "heading",
          R,
          { x: n + a / 2, y: p, width: a / 2 - 5, height: C },
          { font: 18, align: "right" }
        );
      } else
        o(
          "rules",
          w,
          { x: n + 5, y: p + 4, width: a - 10, height: C - 8 },
          { font: (w.startsWith("(") ? 16 : h) * y, italic: w.startsWith("(") }
        );
      p += C;
    });
  } else if (e === "leveler") {
    const n = t.rulesText ?? "", s = n.split(/^LEVEL\s+([^\n]+)\n/gm), a = [
      {
        range: "",
        text: s[0] ?? "",
        stats: t.power != null && t.toughness != null ? `${t.power}/${t.toughness}` : ""
      }
    ];
    for (let u = 1; u < s.length; u += 2) {
      const m = s[u + 1] ?? "", h = m.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      a.push({
        range: s[u],
        stats: h?.[1] ?? "",
        text: h ? m.slice(h[0].length) : m
      });
    }
    const i = Le(4.9, 55.6, 53.7, 25.5), l = i.height / a.length, d = tg[_(t).frame] ?? "#dcc8af";
    a.forEach((u, m) => {
      const h = i.y + m * l;
      m && o(
        "band",
        "",
        { x: i.x, y: h, width: i.width, height: l },
        { fill: m % 2 ? "#00000018" : "#00000028" }
      );
      const c = u.range ? 55 : 7, g = u.stats ? 72 : 7;
      o("rules", u.text, {
        x: i.x + c,
        y: h + 4,
        width: i.width - c - g,
        height: l - 8
      }), u.range && o(
        "level",
        `LEVEL
${u.range}`,
        { x: i.x - 12, y: h + l / 2 - 23, width: 65, height: 46 },
        { fill: d, font: 13 }
      ), u.stats && o(
        "stats",
        u.stats,
        { x: i.x + i.width - 68, y: h + l / 2 - 22, width: 77, height: 44 },
        { asset: Lt("pt-boxes", _(t).pt), font: 26 }
      );
    });
  }
  return r;
}
function rg(t) {
  return sn(t).flatMap((e) => [
    e.asset ?? null,
    ...Kr(e.text).flatMap((r) => r.symbol ? [Ge(r.symbol)] : [])
  ]);
}
function ng(t) {
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
      _(e)
    ] : null;
  }
  return fl(t) ? sn(t) : null;
}
function og(t, e, r) {
  let o = !0;
  for (const n of sn(e)) {
    if (!Qt(t) && (n.asset === gl || n.kind !== "band" && n.kind !== "stats" && n.kind !== "level"))
      continue;
    const { x: s, y: a, width: i, height: l, font: d } = n;
    t.save(), t.textAlign = "left", t.fillStyle = n.fill ?? "transparent", n.kind === "level" ? (t.beginPath(), t.moveTo(s, a), t.lineTo(s + i * 0.72, a), t.lineTo(s + i, a + l / 2), t.lineTo(s + i * 0.72, a + l), t.lineTo(s, a + l), t.closePath(), t.fill(), t.strokeStyle = "#0008", t.lineWidth = 1, t.stroke()) : n.fill && t.fillRect(s, a, i, l);
    const u = n.asset ? r.get(n.asset) : null;
    if (u && t.drawImage(u, s, a, i, l), t.beginPath(), t.rect(s, a, i, l), t.clip(), t.fillStyle = n.color ?? "#17140f", ["stats", "level"].includes(n.kind)) {
      t.font = `${d}px "CardRenderer MTG Beleren", Georgia`, t.textAlign = "center", t.textBaseline = "middle";
      const m = n.text.split(`
`);
      m.forEach(
        (h, c) => dt(
          t,
          h,
          s + i * (n.kind === "level" ? 0.43 : 0.5),
          a + l / 2 + (c - (m.length - 1) / 2) * d,
          i * 0.85,
          n.kind === "stats" && o && e.power != null && e.toughness != null ? e.textInk : void 0
        )
      ), n.kind === "stats" && (o = !1);
    } else if (n.align === "right")
      t.font = `${d}px "CardRenderer MTG MPlantin", Georgia`, t.textAlign = "right", t.textBaseline = "middle", t.fillText(n.text, s + i, a + l / 2, i);
    else {
      t.font = `${n.italic ? "italic " : ""}${d}px "CardRenderer MTG MPlantin", Georgia`;
      const m = Mo(t, n.text, i, d).length * d + (n.text.split(`
`).length - 1) * X.paragraphGap;
      ii(
        t,
        n.text,
        s,
        a + Math.max(0, (l - m) / 2),
        i,
        { size: d, italic: !!n.italic },
        r
      );
    }
    t.restore();
  }
}
const sg = 5, ag = 0.02655 * E + 0.91339 * k * 3810 / 2736;
function Ko(t) {
  const e = t ? 382 : 429;
  return { top: e, scale: 1 - sg / (ag - e) };
}
function ig(t) {
  const { top: e, scale: r } = Ko(t);
  return [e + 6, e + (625 - e) * r - 4];
}
function ua(t, e, r, o, n, s) {
  const { top: a, scale: i } = Ko(s), l = e.height * n / e.width, d = Math.max(0, Math.min(l, a - o)), u = d * e.width / n;
  d > 0 && t.drawImage(e, 0, 0, e.width, u, r, o, n, d), d < l && t.drawImage(
    e,
    0,
    u,
    e.width,
    e.height - u,
    r,
    o + d,
    n,
    (l - d) * i
  );
}
const St = {
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
function lg(t, e, r) {
  const o = t.rulesParagraphs?.filter((a) => a.role === "rules")[r], n = (t.rulesText ?? "").split(`
`).filter((a) => a.trim())[r];
  if (!o || o.runs.map((a) => a.text).join("") !== n) return [{ text: e }];
  let s = n.length - e.length;
  return o.runs.flatMap((a) => {
    const i = Math.min(s, a.text.length);
    return s -= i, i === a.text.length ? [] : [{ ...a, text: a.text.slice(i) }];
  });
}
function dg(t, e) {
  const r = tt(e) === "planeswalker-large", o = br(e), n = !r && o.length < 3, s = Pt(e).rules, a = s[0] * k, i = s[1] * E, l = s[2] * k, d = s[3] * E - (r ? 24 : n ? 4 : 16), u = r ? 8 : n ? 3 : 0, m = r ? { ...Nr, leading: 0.9 } : Nr, h = o.map((M, x) => ({
    ...M,
    runs: lg(e, M.text, x),
    left: M.badges.length ? St.textLeft : St.staticTextLeft
  })), c = (M) => h.map(
    (x) => G(
      t,
      [{ role: "rules", runs: x.runs }],
      {
        x: a + x.left,
        y: 0,
        width: l - x.left - St.rightInset,
        height: 1e3
      },
      M,
      M,
      m
    )
  );
  let g = r ? 17.5 : n ? 24 : 19, f = c(g);
  const [b, y] = ig(r), p = () => {
    const M = d / Math.max(1, h.length), x = f.map((L, U) => i + u + M * (U + 0.5) - L.height / 2);
    let A = b - 8;
    for (let L = 0; L < x.length; L++)
      x[L] = Math.max(x[L], A + 8), A = x[L] + f[L].height;
    let F = y + 8;
    for (let L = x.length - 1; L >= 0; L--)
      x[L] = Math.min(x[L], F - 8 - f[L].height), F = x[L];
    return x;
  }, w = () => (p()[0] ?? b) >= b, S = () => f.map(
    (M) => Math.max(St.minimumRowHeight, M.height + 16)
  ), v = () => {
    const M = d / Math.max(1, h.length);
    return f.every((x, A) => {
      const F = M * (A + 0.5);
      return F - x.height / 2 >= 6 && F + x.height / 2 <= d + 6 && (!A || M - (x.height + f[A - 1].height) / 2 >= 8);
    });
  };
  for (; g > 8 && (S().reduce((M, x) => M + x, 0) > d || !v() || !w()); )
    g -= 0.25, f = c(g);
  const C = d / Math.max(1, h.length), T = p();
  let R = u;
  return h.map((M, x) => {
    const A = C, F = f[x].height, L = G(
      t,
      [{ role: "rules", runs: M.runs }],
      {
        x: a + M.left,
        y: T[x],
        width: l - M.left - St.rightInset,
        height: F
      },
      g,
      g,
      m
    );
    L.overflow ||= R + A > u + d + 0.01, L.overflow ||= !v(), L.overflow ||= !w(), L.overflow ||= L.lines.some(
      (O) => O.inkBounds[1] < b - 0.01 || O.inkBounds[1] + O.inkBounds[3] > y + 0.01
    );
    const U = { ...M, top: R, height: A, font: g, width: L.width, layout: L };
    return R += A, U;
  });
}
function pl(t, e) {
  return t === "saga" ? /^(I|II|III|IV)$/.test(e) ? Lt("saga", e) : null : Lt(
    "planeswalker",
    e.startsWith("+") ? "LoyaltyPlus" : e === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function bl(t, e) {
  return tt(t) === "saga" ? Lt("saga_textboxes", e === "Colourless" ? "Land" : e) : null;
}
function ug(t) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[_(t).boxes] ?? "#dededbf0";
}
function mg(t, e) {
  const { top: r, scale: o } = Ko(tt(e) === "planeswalker-large");
  t.save(), t.translate(0, r), t.scale(1, o), t.translate(0, -r), t.beginPath(), t.moveTo(66, r), t.lineTo(448, r), t.quadraticCurveTo(456, r, 456, r + 8), t.lineTo(456, 613), t.bezierCurveTo(456, 623, 420, 629, 257, 629), t.bezierCurveTo(94, 629, 58, 623, 58, 613), t.lineTo(58, r + 8), t.quadraticCurveTo(58, r, 66, r), t.closePath(), t.clip(), t.fillStyle = ug(e), t.fillRect(58, r, 398, 629 - r), t.restore();
}
function hg(t, e, r) {
  t.save(), t.fillStyle = St.colonInk, t.font = `${St.colonFontSize}px ${St.colonFontFamily}`, t.textAlign = "center", t.textBaseline = "alphabetic";
  const o = t.measureText(":");
  t.fillText(
    ":",
    e,
    r + St.colonOffsetY + (o.actualBoundingBoxAscent - o.actualBoundingBoxDescent) / 2
  ), t.restore();
}
function cg(t, e, r) {
  const o = tt(e), n = o === "saga", s = Pt(e).rules, a = s[0] * k, i = s[1] * E, l = s[2] * k, d = s[3] * E;
  n && (t.fillStyle = "#e3d8bb", t.fillRect(a, i, l, d));
  const u = bl(e, _(e).boxes), m = u ? r.get(u) : void 0;
  if (m && t.drawImage(m, a, i, l, d), !Qt(t)) return;
  const h = n ? hu(e) : dg(t, e);
  for (const [c, g] of h.entries()) {
    if (c > 0) {
      const y = h[c - 1]?.layout, p = g.layout && y ? Math.max(y.top + y.height + 3, Math.min(i + g.top, g.layout.top - 3)) : i + g.top;
      t.fillStyle = "#0002", t.fillRect(
        a + (n ? 0 : St.separatorLeft),
        p,
        l - (n ? 0 : St.separatorLeft),
        St.separatorHeight
      );
    }
    if (t.fillStyle = "#17140f", t.textAlign = "left", g.layout) Ct(t, g.layout, r);
    else {
      t.font = `${g.reminder ? "italic " : ""}${g.font}px "CardRenderer MTG MPlantin", Georgia`;
      const y = Mo(t, g.text, g.width, g.font).length * g.font;
      ii(
        t,
        g.text,
        a + g.left,
        i + g.top + (g.height - y) / 2,
        g.width,
        { size: g.font, italic: g.reminder },
        r
      );
    }
    const f = n ? 36 : St.badgeWidth, b = n ? 36 : St.badgeHeight;
    g.badges.forEach((y, p) => {
      const w = a + (n ? -18 : 0), S = i + g.top + g.height / 2 + (p - g.badges.length / 2) * b, v = pl(o, y), C = v ? r.get(v) : null;
      if (C) {
        if (t.save(), !n) {
          const T = t.getTransform().a;
          t.shadowColor = "#0009", t.shadowBlur = 3 * T, t.shadowOffsetY = 2 * T;
        }
        t.drawImage(C, w, S, f, b), t.restore();
      } else
        t.fillStyle = "#29231c", t.fillRect(w, S, f, b);
      n ? C || (t.fillStyle = "white", t.textAlign = "center", t.textBaseline = "middle", t.font = 'bold 19px "CardRenderer MTG Beleren", Georgia', t.fillText(y, w + f / 2, S + b / 2, f - 3)) : (Mu(t, y, [w, S, f, b]), hg(
        t,
        w + f + St.colonOffsetX,
        S + b / 2
      ));
    });
  }
}
const yl = 0.7;
function gg(t, e, r, o = !1) {
  const [n, s, a, i] = [
    r[0] * k,
    r[1] * E,
    r[2] * k,
    r[3] * E - 1
  ], l = new Path2D();
  l.moveTo(n + 14, s), l.lineTo(n + a - 14, s), l.quadraticCurveTo(n + a, s, n + a, s + 14), l.lineTo(n + a, s + i - 7), l.quadraticCurveTo(n + a, s + i, n + a - 7, s + i), l.lineTo(n + 9, s + i), l.quadraticCurveTo(n - 2, s + i, n - 2, s + i - 9), l.quadraticCurveTo(n - 2, s + 17, n + 2, s + 9), l.quadraticCurveTo(n + 5, s, n + 14, s), l.closePath(), t.save();
  const d = t.getTransform().a;
  t.shadowColor = "#0009", t.shadowBlur = 1.4 * d, t.shadowOffsetX = -1.2 * d, t.shadowOffsetY = 3.5 * d, t.fillStyle = "#191816", t.fill(l), t.shadowColor = "transparent", t.save(), t.clip(l);
  const u = e.width / a, m = [
    20 * u,
    e.height - (i - 4) * u,
    e.width - 40 * u,
    (i - 12) * u,
    n - 2,
    s,
    a + 2,
    i
  ];
  t.drawImage(e, ...m), o && (t.globalAlpha *= yl, t.drawImage(e, ...m)), t.restore(), t.strokeStyle = "#191816", t.lineWidth = 1.2, t.stroke(l), t.restore();
}
function fg(t, e, r) {
  if (!e.pinlines) return;
  const o = (i) => {
    const l = r.get(i);
    if (!l) throw Error(`Planar pinline asset unavailable: ${i}`);
    return l;
  }, n = () => {
    const i = document.createElement("canvas");
    i.width = 732, i.height = 1020;
    const l = i.getContext("2d");
    if (!l) throw Error("Missing Planar pinline composition context");
    return { canvas: i, context: l };
  }, s = n(), a = n();
  try {
    s.context.drawImage(o(e.pinlines.left), 0, 0, 732, 1020), a.context.drawImage(o(e.pinlines.right), 0, 0, 732, 1020), a.context.globalCompositeOperation = "destination-in";
    const i = a.context.createLinearGradient(732 * 0.47, 0, 732 * 0.53, 0);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), a.context.fillStyle = i, a.context.fillRect(0, 0, 732, 1020), s.context.drawImage(a.canvas, 0, 0), s.context.globalCompositeOperation = "destination-in", s.context.drawImage(o(e.pinlines.mask), 0, 0, 732, 1020), ro(t, s.canvas);
  } finally {
    s.canvas.width = s.canvas.height = 0, a.canvas.width = a.canvas.height = 0;
  }
}
function ma(t, e, r) {
  if (!It(t, e)) return { dx: 0, dy: 0, size: 1 };
  const o = t.frameTreatment === "colorshifted";
  return r === "title" ? o ? { dx: 0.25, dy: 0.75, size: 1.04 } : { dx: 1, dy: 0.75, size: 1.035 } : o ? { dx: -0.75, dy: -1.25, size: 1.03 } : { dx: 0.5, dy: 0, size: 1.025 };
}
const pg = 1.1;
function wl(t) {
  return !t.setSymbol && ["m19", "m20", "m21"].includes(t.setCode?.toLowerCase() ?? "");
}
function Sl(t, e, r, o, n, s, a, i, l = 1) {
  const d = !r || r === "common", u = document.createElement("canvas"), m = 2, h = 4;
  u.width = Math.ceil((s + m * 2) * h), u.height = Math.ceil((a + m * 2) * h);
  const c = u.getContext("2d");
  c.scale(h, h), c.translate(m, m), c.drawImage(
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
    o - m,
    n - m,
    u.width / h,
    u.height / h
  ), u.width = u.height = 0;
}
function bg(t, e, r, o) {
  const n = document.createElement("canvas");
  n.width = 732, n.height = 1020;
  try {
    const s = n.getContext("2d");
    if (!s) throw Error("Missing frame stock composition context");
    o ? (s.save(), s.scale(1.5, 1.5), ro(s, e, o === "colorshifted"), s.restore()) : s.drawImage(e, 0, 0, n.width, n.height), s.globalCompositeOperation = "source-in", s.fillStyle = r, s.fillRect(0, 0, n.width, n.height), t.drawImage(n, 0, 0, 488, 680);
  } finally {
    n.width = n.height = 0;
  }
}
const Qe = (t) => [
  t[0] * k,
  t[1] * E,
  t[2] * k,
  t[3] * E
];
function yg(t, e, r, o, n) {
  const s = kt(e);
  if (!s) throw Error("Missing replacement frame family.");
  const a = (z) => {
    const N = r.get(z);
    if (!N) throw Error(`Replacement frame asset unavailable: ${z}`);
    return N;
  }, { rects: i } = s, l = e.frameAssetFamily === "eighth", d = De(e, s.frame) ?? Tt(e) ?? Bt(e.setCode, e.borderColor).border;
  if (t.save(), t.fillStyle = d, t.fillRect(0, 0, k, E), o && t.drawImage(o, 0, 0, k, E), Ft(t, e, r, Qe(i.art), n), n === "artwork") {
    t.restore();
    return;
  }
  if (go(e, s.frame) ? Vd(t, a(s.frame)) : It(e, s.frame) ? ro(t, a(s.frame), e.frameTreatment === "colorshifted") : t.drawImage(a(s.frame), 0, 0, k, E), fg(t, s, r), s.rightFrame) {
    const z = document.createElement("canvas");
    z.width = 732, z.height = 1020;
    const N = z.getContext("2d");
    N.drawImage(a(s.rightFrame), 0, 0, z.width, z.height);
    const P = document.createElement("canvas");
    P.width = z.width, P.height = z.height;
    const q = P.getContext("2d"), ie = (Ht, ee) => {
      const ct = q.createLinearGradient(P.width * Ht, 0, P.width * ee, 0);
      return ct.addColorStop(0, "#0000"), ct.addColorStop(1, "#000"), ct;
    };
    q.fillStyle = ie(0.47, 0.53), q.fillRect(0, 0, P.width, P.height);
    const wt = l ? [0.08, 0.627, 0.84, 0.29] : [0.071, 0.629, 0.858, 0.294], [le, de, Dt, zt] = wt, qt = le * P.width, ve = de * P.height, Ce = Dt * P.width, ue = zt * P.height;
    q.clearRect(qt, ve, Ce, ue), q.fillStyle = ie(0.27, 0.73), q.fillRect(qt, ve, Ce, ue), N.globalCompositeOperation = "destination-in", N.drawImage(P, 0, 0), t.drawImage(z, 0, 0, k, E), z.width = z.height = 0, P.width = P.height = 0;
  }
  d !== "#090806" && bg(
    t,
    a(s.border),
    d,
    It(e, s.frame) ? e.frameTreatment === "colorshifted" ? "colorshifted" : "planar" : void 0
  ), Ui(t, e, r), t.fillStyle = "#17140f", t.textAlign = "left", t.textBaseline = "middle";
  const u = rn(e), m = l ? "CardRenderer MTG Matrix" : "CardRenderer MTG Beleren", [h, c, g, f] = Qe(i.title), b = e.manaSymbols ?? [], { size: y } = s.mana, p = s.mana.gap + (u?.spacing ?? 0), w = s.mana.right * k, S = b.length * y + Math.max(0, b.length - 1) * p, v = [
    w - S,
    s.mana.center * E - y / 2,
    S,
    y
  ], C = pe(v, u);
  t.font = `bold ${s.titleSize}px "${m}", Georgia`, t.save(), l && t.translate(...Yo(e, "eighth"));
  const T = ma(e, s.frame, "title");
  t.translate(T.dx, T.dy), ca(t, e, s.frame), rt(
    t,
    e.name,
    h,
    c + f / 2,
    b.length ? C[0] - h - 8 : g,
    s.titleSize * T.size,
    !0,
    1,
    m,
    e.frameTreatment === "colorshifted" ? 0.5 : 0
  ), t.restore(), H(
    t,
    e,
    "manaCost",
    () => Fe(t, v, u, () => {
      b.forEach(
        (z, N) => et(
          t,
          z,
          w - S + N * (y + p),
          s.mana.center * E - y / 2,
          y,
          r,
          !0,
          u
        )
      );
    })
  );
  const R = Q(e), M = r.get(R ?? ""), x = ae(e), A = M ? Math.min(
    s.symbol.width * k / (M.width * x[2]),
    s.symbol.height * E / (M.height * x[3])
  ) : 0, F = M ? M.width * x[2] * A : 0, L = M ? M.height * x[3] * A : 0, U = Ju(e, s.frame, R) ?? Ah(e, R, [
    s.symbol.right * k - F,
    s.symbol.center * E - L / 2,
    F,
    L
  ]), O = pe(U, e.symbolAdjustment?.set), [V, D, Z, ut] = Qe(i.type);
  t.save();
  const it = ma(e, s.frame, "type");
  if (t.translate(it.dx, it.dy), ca(t, e, s.frame), t.font = `bold ${s.typeSize}px "${m}", Georgia`, rt(
    t,
    e.typeLine ?? "",
    V,
    D + ut / 2,
    M ? O[0] - V - 7 : Z,
    s.typeSize * it.size,
    !0,
    1,
    m,
    e.frameTreatment === "colorshifted" ? 0.5 : 0,
    e.textInk,
    "type"
  ), t.restore(), H(
    t,
    e,
    "setSymbol",
    () => Fe(t, U, e.symbolAdjustment?.set, () => {
      if (M) {
        const z = ol(e);
        _t(R) || e.setSymbol ? t.drawImage(M, ...U) : wl(e) ? Sl(t, M, e.rarity, ...U, x, 1.5) : z ? sl(t, M, z, e.rarity, ...U, x, !1) : te(t, M, e.setCode, e.rarity, ...U, x);
      }
    })
  ), _a(t, e, r) || Ct(t, ji(t, e), r), e.power != null && e.toughness != null && t.drawImage(a(s.pt), ...Qe(i.stats)), l) {
    pd(t, e, r, s.frame), t.restore();
    return;
  }
  if (e.power != null && e.toughness != null) {
    const [z, N, P, q] = Qe(i.stats);
    t.font = `bold 25px "${m}", Georgia`, t.textAlign = "center", t.textBaseline = "middle", dt(
      t,
      `${e.power}/${e.toughness}`,
      z + P * 0.52,
      N + q * 0.52,
      P * 0.85,
      e.textInk
    );
  }
  qn(t, e), t.restore();
}
let ha = null;
function wg(t) {
  if (t.frameAssetFamily !== "eighth") return Promise.resolve();
  const e = ha ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 29px "CardRenderer MTG Matrix Small Caps"')
  ]).then((r) => {
    if (r.some((o) => !o.length || o.some((n) => n.status !== "loaded")))
      throw Error("Replacement Eighth Edition frames need card-glint/magic/fonts.css.");
  }).catch((r) => {
    throw ha = null, r;
  });
  return Promise.all([e, fd(t, kt(t)?.frame ?? "")]).then(
    () => {
    }
  );
}
function ca(t, e, r) {
  e.frameTreatment === "colorshifted" && (t.fillStyle = "#fff", t.shadowColor = De(e, r) ?? "#000", t.shadowOffsetX = -21e-4 * k, t.shadowOffsetY = 15e-4 * E, t.shadowBlur = 0);
}
function Sg(t, e, [r, o, n, s]) {
  const a = e.height * n / e.width;
  t.save(), t.beginPath(), t.rect(r, o, n, s / 2), t.clip(), t.drawImage(e, r, o + s - a + 1, n, a), t.restore();
}
function vg(t, [e, r, o, n], s) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(s)) return;
  t.save(), t.shadowColor = "transparent";
  const a = t.createLinearGradient(e, 0, e + o, 0);
  a.addColorStop(0, "rgba(255,255,255,0)"), a.addColorStop(0.025, "rgba(255,255,255,0.2)"), a.addColorStop(0.975, "rgba(255,255,255,0.2)"), a.addColorStop(1, "rgba(255,255,255,0)"), t.fillStyle = a, t.fillRect(e, r + n - 4, o, 2.3), t.restore();
}
const ne = /* @__PURE__ */ new Map();
function vl(t) {
  if (!(!t.retired || t.users)) {
    if (!t.sources) {
      t.controller.abort();
      return;
    }
    URL.revokeObjectURL(t.sources.original), t.sources.backing && URL.revokeObjectURL(t.sources.backing), t.sources.outlined && URL.revokeObjectURL(t.sources.outlined), t.sources = void 0;
  }
}
function pf() {
  for (const t of ne.values())
    t.retired = !0, vl(t);
  ne.clear();
}
async function Cg(t, e) {
  e.throwIfAborted();
  let r = ne.get(t);
  if (!r) {
    const l = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const d = await eo(t, {
          mode: "cors",
          signal: l.controller.signal
        });
        if (!d.ok) throw Error(`Symbol source ${d.status}: ${t}`);
        const u = await vc(t, await d.blob()), m = await bc(t, u), h = await Cc(t, u);
        l.controller.signal.throwIfAborted();
        const c = URL.createObjectURL(u);
        let g, f;
        try {
          g = m ? URL.createObjectURL(m) : void 0, f = h ? URL.createObjectURL(h) : void 0;
          const b = { original: c, backing: g, outlined: f };
          return l.sources = b, b;
        } catch (b) {
          throw URL.revokeObjectURL(c), g && URL.revokeObjectURL(g), f && URL.revokeObjectURL(f), b;
        }
      })
    };
    l.promise = l.promise.catch((d) => {
      throw ne.get(t) === l && ne.delete(t), d;
    }), ne.set(t, l), r = l;
  }
  r.users++;
  const o = r;
  let n = !1;
  const s = () => {
    n || (n = !0, o.users--, !o.users && !o.sources && (o.retired = !0, ne.get(t) === o && ne.delete(t)), vl(o));
  };
  let a = () => {
  };
  const i = new Promise((l, d) => {
    a = () => {
      s(), d(e.reason);
    }, e.addEventListener("abort", a, { once: !0 });
  });
  try {
    const l = await Promise.race([o.promise, i]);
    return e.throwIfAborted(), { sources: l, release: s };
  } catch (l) {
    throw s(), l;
  } finally {
    e.removeEventListener("abort", a);
  }
}
async function kg(t, e) {
  e.throwIfAborted();
  const r = [...new Set(t.filter((l) => !!l))], o = [], n = /* @__PURE__ */ new Map(), s = () => {
    for (const l of o) l.release();
    o.length = 0;
  }, i = (await Promise.allSettled(
    r.map(async (l) => {
      if (!pc(l) && !Sc(l)) {
        n.set(l, l);
        return;
      }
      const d = await Cg(l, e);
      o.push(d), n.set(l, d.sources.original), d.sources.backing && n.set(ul(l), d.sources.backing), d.sources.outlined && n.set(ml(l), d.sources.outlined);
    })
  )).find((l) => l.status === "rejected");
  if (i?.status === "rejected")
    throw s(), i.reason;
  return e.aborted && (s(), e.throwIfAborted()), { urls: [...new Set(n.values())], aliases: n, dispose: s };
}
function Tg(t, e) {
  const r = /* @__PURE__ */ new Map();
  for (const [o, n] of t) {
    const s = e.get(n);
    s && r.set(o, s);
  }
  return r;
}
async function Mg(t, e) {
  return e.throwIfAborted(), eo(t, { signal: e, mode: "cors" });
}
function Rg(t) {
  if (t.startsWith(`${B}/img/frames/m15/holoStamps/`) || t.startsWith(`${B}/img/frames/planeswalker/holo/`) || t.startsWith(B) && /\/saga\/(sagaChapter|sagaDivider|sagaMidStripe|stamp)\.png$/.test(t))
    return;
  if (t.startsWith(`${B}/data/images/cardImages/saga/`)) return 768;
  if (t.startsWith(`${B}/img/frames/future/regular/futurePT`)) return;
  if (t.startsWith(`${B}/img/frames/`) && t.endsWith(".png"))
    return /\/pt\/|\/m15PT/.test(t) ? 256 : 768;
  if (t.startsWith(`${Pe}/img/frames/`) && t.endsWith(".png")) return 768;
  const e = t.startsWith(`${Ie}/img/`) ? t.slice(`${Ie}/img/`.length) : "";
  return e === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    e
  ) ? 768 : void 0;
}
async function Cl(t, e) {
  const r = await kg(t, e), o = r.urls, n = /* @__PURE__ */ new Map();
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, o.length) }, async () => {
        for (; s < o.length && !e.aborted; ) {
          const i = o[s++];
          try {
            const l = await Mg(i, e);
            if (!l.ok) continue;
            const d = await l.blob(), u = await Gl(d, e, Rg(i));
            e.aborted ? u.close() : n.set(i, u);
          } catch {
          }
        }
      })
    );
  } finally {
    r.dispose();
  }
  const a = Tg(r.aliases, n);
  return {
    images: a,
    dispose: () => {
      for (const i of n.values()) i.close();
      n.clear(), a.clear();
    }
  };
}
function kl(t) {
  if (t = se(t), t.frameTemplate)
    return [
      ...J0(t),
      t.illustration,
      Q(t),
      ...Wt(
        t.frameTemplate === "future" ? { ...t, manaSymbols: t.manaSymbols?.filter((a) => !Qr(a)) } : t
      ),
      ...(t.faces ?? []).flatMap(Wt)
    ];
  if (en(t))
    return [
      ...Ai(t),
      t.illustration,
      Q(t),
      ...Wt(t),
      ...Wt(qe(t))
    ];
  if (pr(t))
    return [
      ...Ei(t),
      t.illustration,
      Q(t),
      ...Wt(t),
      ...Wt(t.faces[1])
    ];
  if (Se(t))
    return [
      ...fi(t),
      ...$t(t).flatMap((a) => [
        a.face.illustration,
        ...Wt(a.face)
      ]),
      Q($t(t)[0].face)
    ];
  const e = jt(t);
  if (e)
    return [
      ...$t(t).flatMap((a, i) => [
        ...gu(a.face, e, _e(t) && e === "eighth", i),
        a.face.illustration,
        Q(a.face),
        ...Wt(a.face)
      ]),
      ...e === "eighth" && _e(t) ? Lm(t) : []
    ];
  const r = t0(t);
  if (r)
    return [
      ...r,
      fe(t)?.image,
      fe(t)?.rightImage,
      t.illustration,
      Q(t),
      ...Wt(t)
    ];
  if (ot(t)) return Jd(t);
  if (tt(t) === "saga")
    return [...au(t), t.illustration, Q(t), ...Wt(t)];
  const o = $t(t);
  if (o.length) return o.flatMap((a) => kl(a.face));
  const n = _(t), s = we(n, tt(t));
  return [
    fe(t)?.image,
    fe(t)?.rightImage,
    tt(t) === "normal" ? Vr(t) : null,
    ...rg(t),
    s.background,
    s.frame,
    s.boxes,
    s.pt,
    bl(t, n.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(tt(t)) ? br(t).flatMap(
      (a) => a.badges.map((i) => pl(tt(t), i))
    ) : [],
    n.legendary ? s.crown : null,
    t.illustration,
    Q(t),
    ...Wt(t)
  ];
}
let ga = null;
function fa() {
  return ga ??= Promise.all([
    document.fonts.load('24px "CardRenderer MTG Beleren"'),
    document.fonts.load('700 24px "CardRenderer MTG Beleren"'),
    document.fonts.load('700 11px "CardRenderer MTG Beleren Small Caps"'),
    document.fonts.load('24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('italic 24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('14px "CardRenderer MTG Relay"'),
    document.fonts.load('14px "CardRenderer MTG Artist Credit"')
  ]).then((t) => {
    if (t.some((e) => !e.length || e.some((r) => r.status !== "loaded")))
      throw Error(
        "Magic fonts are unavailable. Load card-glint/magic/fonts.css before preparing cards."
      );
  }).catch((t) => {
    throw ga = null, t;
  });
}
function Or(t) {
  return Pt(t).art;
}
const pa = /* @__PURE__ */ new WeakMap(), $r = ([t, e, r, o]) => [t, 1 - e - o, t + r, 1 - e], xg = [$r(Pt({ name: "" }).art), [0, 0, 0, 0]];
function bf(t) {
  if (!t) return xg;
  const e = pa.get(t);
  if (e) return e;
  const r = $t(t), o = r.length ? [
    $r(ks(r[0], Or(r[0].face))),
    $r(ks(r[1], Or(r[1].face)))
  ] : [$r(Or(t)), [0, 0, 0, 0]];
  return pa.set(t, o), o;
}
const Eg = new nn(4 * 1024 * 1024), ba = /* @__PURE__ */ new WeakMap();
let Ag = 0;
async function Lg(t, e, r, o) {
  if (o.throwIfAborted(), r !== void 0 && !["auto", "alpha", "ink"].includes(r))
    throw Error("Invalid set symbol mask mode");
  if (!(r === "ink" || (r === void 0 || r === "auto") && _t(e))) return { value: t, release() {
  } };
  let s = ba.get(t);
  s === void 0 && ba.set(t, s = ++Ag);
  const a = Math.min(1, 512 / Math.max(t.width, t.height)), i = Math.max(1, Math.round(t.width * a)), l = Math.max(1, Math.round(t.height * a));
  return Eg.acquire(
    JSON.stringify(["set-symbol-ink-v1", s, i, l]),
    i * l * 4,
    async () => {
      const d = document.createElement("canvas");
      d.width = i, d.height = l;
      try {
        const u = d.getContext("2d", { willReadFrequently: !0 });
        if (!u) throw Error("Set symbol mask needs Canvas2D");
        u.drawImage(t, 0, 0, i, l);
        const m = u.getImageData(0, 0, i, l);
        for (let h = 0; h < m.data.length; h += 4) {
          const c = m.data[h] * 0.2126 + m.data[h + 1] * 0.7152 + m.data[h + 2] * 0.0722;
          m.data[h + 3] = Math.round(m.data[h + 3] * (1 - c / 255)), m.data[h] = m.data[h + 1] = m.data[h + 2] = 255;
        }
        return u.putImageData(m, 0, 0), await createImageBitmap(d);
      } finally {
        d.width = d.height = 0;
      }
    },
    o
  );
}
async function Og(t, e, r, o, n, s, a = Cl, i) {
  return Tl(t, e, r, o, {
    threshold: n,
    resolveEtching: i,
    beforePaint: s,
    loadImages: a,
    height: E
  });
}
async function Tl(t, e, r, o, n) {
  const { threshold: s, beforePaint: a, loadImages: i, height: l } = n, d = $t(e);
  if (d.length) {
    for (const S of d) {
      t.save();
      try {
        $i(t, S), await Tl(t, S.face, r, o, {
          ...n,
          height: S.height * k / S.width
        });
      } finally {
        t.restore();
      }
    }
    return;
  }
  if (e.illustration && n.resolveEtching) {
    let S;
    try {
      const v = await n.resolveEtching(e, r, o, s, a);
      S = await i([v, e.illustration], o);
      const C = S.images.get(v ?? "");
      if (C && !o.aborted) {
        await a?.(), o.throwIfAborted();
        const [T, R, M, x] = Pt(e).art, A = T * k, F = R * l, L = M * k, U = x * l, O = S.images.get(e.illustration) ?? C;
        t.save(), t.beginPath();
        const V = Or(e);
        t.rect(
          V[0] * k,
          V[1] * l,
          V[2] * k,
          V[3] * l
        ), t.clip(), t.imageSmoothingQuality = "low";
        const D = jo(e, [A, F, L, U], k, l);
        if (e.illustrationCrop) {
          const Z = e.illustrationCrop, ut = jr(
            O.width * Z[2],
            O.height * Z[3],
            D,
            e.artPlacement
          );
          t.drawImage(
            C,
            Z[0] * C.width,
            Z[1] * C.height,
            Z[2] * C.width,
            Z[3] * C.height,
            ...ut
          );
        } else
          t.drawImage(
            C,
            ...jr(O.width, O.height, D, e.artPlacement)
          );
        t.restore();
      }
    } catch {
    } finally {
      S?.dispose();
    }
  }
  if (o.throwIfAborted(), !e.setCode || e.printingElements?.setSymbol?.hidden) return;
  const [u, m, h, c] = Pt(e).stamp, g = u * k, f = m * l, b = h * k, y = c * l, p = md(e), w = await i([p], o);
  try {
    await a?.(), o.throwIfAborted();
    const S = p ? w.images.get(p) : null;
    t.save();
    try {
      if (e.printingElements?.setSymbol?.offset && t.translate(...e.printingElements.setSymbol.offset), t.globalAlpha = 0.68, S) {
        const v = await Lg(S, p, e.setSymbolMask, o);
        try {
          o.throwIfAborted();
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
        t.translate(g, f), t.scale(b / 100, y / 100), t.fillStyle = "white", t.fill(new Path2D(Wl)), t.font = "bold 43px Georgia", t.textAlign = "center", t.textBaseline = "alphabetic", t.fillText(Nl(e.setCode), 50, 65);
    } finally {
      t.restore();
    }
  } finally {
    w.dispose();
  }
}
function $g(t) {
  return t.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const Bg = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, ya = /* @__PURE__ */ new WeakMap();
function Ig(t, e) {
  let r = ya.get(e);
  if (r || (r = new Path2D(e.path), ya.set(e, r)), t.save(), e.viewBox) {
    const [o, n, s, a] = e.viewBox;
    t.scale(24 / s, 24 / a), t.translate(-o, -n);
  }
  e.transform && t.transform(...e.transform), e.filled ? (t.fillStyle = t.strokeStyle, t.fill(r)) : t.stroke(r), t.restore();
}
function wa(t, e, r, o, n = !1) {
  const s = k * 0.105, a = k * 0.015, i = Math.floor(k * 0.9 / (s + a));
  if (e.forEach((c, g) => {
    t.save(), t.translate(
      k * 0.05 + g % i * (s + a),
      E * 0.13 + Math.floor(g / i) * (s + a)
    ), t.fillStyle = "#17201fed", t.strokeStyle = "#c6af7977", t.lineWidth = 1, t.beginPath(), t.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2), t.fill(), t.stroke(), t.translate(s * 0.14, s * 0.14), t.scale(s * 0.72 / 24, s * 0.72 / 24), t.strokeStyle = "#f3e9cf", t.lineWidth = 1.8, t.lineCap = "round", t.lineJoin = "round", Ig(t, c), t.restore();
  }), r?.power == null || r.toughness == null) return;
  t.save();
  const l = Bg[n ? "inspect" : "table"], d = k * l.width, u = E * l.height, m = k * (1 - l.right - l.width), h = E * (1 - l.bottom - l.height);
  o ? t.drawImage(o, m, h, d, u) : (t.fillStyle = "#eee5cf", t.strokeStyle = "#746854", t.lineWidth = 2, t.beginPath(), t.roundRect(
    m + d * (n ? 0.14 : 0.1),
    h + u * (n ? 0.19 : 0.18),
    d * (n ? 0.72 : 0.8),
    u * (n ? 0.62 : 0.64),
    u * 0.12
  ), t.fill(), t.stroke()), t.font = `bold ${k * (n ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, t.fillStyle = "#17140f", t.textAlign = "center", t.textBaseline = "middle", t.fillText(
    `${r.power}/${r.toughness}`,
    m + d / 2,
    n ? h + u / 2 - k * 0.01 : h + u * 0.48,
    d * 0.72
  ), t.restore();
}
function yf(t) {
  return t.currentStats?.power != null && t.currentStats.toughness != null && t.statusLayout !== "inspect" ? { ...t, statusLayout: "inspect" } : t;
}
function wf(t, e) {
  if (t.custom)
    return JSON.stringify([
      "custom-face-v1",
      t.custom.key,
      e,
      t.layer ?? "face",
      t.layer === "etching" ? t.etchThreshold ?? 20 : null
    ]);
  const r = t.face, o = Qn(r, t.layer === "etching"), n = t.currentStats?.power != null && t.currentStats.toughness != null ? [t.currentStats.power, t.currentStats.toughness] : null;
  return JSON.stringify([
    Ie,
    B,
    "canvas-face-v148",
    ["silhouette-v2", nl(r)],
    [
      "set-profile-v1",
      yt(r)?.revision ?? null,
      r.setCalibrationCandidate ?? null
    ],
    t.paintLayer ?? null,
    t.rulesText !== !1,
    e,
    t.printingId,
    t.layer === "etching" ? null : t.printedImage,
    o,
    t.layer ?? "face",
    t.layer === "etching" ? t.etchThreshold ?? 14 : null,
    t.layer === "etching" ? null : [
      (t.emblems ?? []).map((s) => [
        s.path,
        s.viewBox ?? null,
        s.transform ?? null,
        !!s.filled
      ]),
      n,
      n ? t.statusLayout ?? e : null
    ]
  ]);
}
function Qn(t, e) {
  const r = [
    t.printingElements,
    t.collectorTotal,
    t.collectorLanguage,
    t.collectorSetCode,
    ...t.calibration !== void 0 ? [["printing-calibration-v1", t.calibration]] : []
  ], o = r.some((s) => s !== void 0) ? [["printing-elements-v1", ...r]] : [], n = $t(t);
  return n.length ? [
    t.layout,
    ...o,
    t.artist ?? null,
    t.collectorNumber ?? null,
    t.legalText ?? null,
    t.borderColor ?? null,
    n.map((s) => [s.x, s.y, s.width, s.height, s.rotation, Qn(s.face, e)]),
    !e && Wo(t),
    !e && yi(t),
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
    Pt(t)
  ] : [
    ...o,
    ot(t) ? [Kt(t), Gt(t)] : null,
    t.borderColor ?? null,
    t.frameAssetFamily ?? null,
    t.frameTreatment ?? null,
    t.frameTemplate ?? null,
    t.futureTreatment ?? null,
    t.defense ?? null,
    t.faces?.map((s) => Qn(s, e)) ?? null,
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
    ng(t),
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
    Pt(t),
    _(t),
    ...t.printingOmissions?.length ? [t.printingOmissions] : [],
    ...t.blackBorderLift ? [["border-ink", t.blackBorderLift]] : []
  ];
}
function Gg(t) {
  const e = document.createElement("canvas");
  return e.width = t === "table" ? 244 : 732, e.height = t === "table" ? 340 : 1020, e;
}
async function Sf(t, e, r, o) {
  if (t = { ...t, face: se(t.face) }, No(t.face), Pa(t.face), To(t.face), t.custom)
    return await o?.beforePaint?.(), r.throwIfAborted(), t.custom.compose(e, r, t.layer ?? "face", t.etchThreshold);
  const n = o?.loadImages ?? Cl, s = Gg(e);
  try {
    const a = s.getContext("2d", {
      willReadFrequently: !!o?.cpuPixels
    });
    if (!a) throw new Error("Card composition needs Canvas2D.");
    if (a.imageSmoothingEnabled = !0, a.imageSmoothingQuality = "high", a.scale(s.width / k, s.height / E), t.layer === "etching")
      return await Og(
        a,
        t.face,
        t.printingId,
        r,
        t.etchThreshold,
        o?.beforePaint,
        n,
        o?.resolveEtching
      ), s;
    a.fillStyle = "#090806", a.fillRect(0, 0, k, E);
    const i = t.currentStats?.power != null && t.currentStats.toughness != null ? we(_(t.face)).pt : null;
    if (t.printedImage) {
      const h = e === "inspect" ? $g(t.printedImage) : t.printedImage;
      i && await (o?.loadFonts ?? fa)();
      const c = await n(i ? [h, i] : [h], r);
      try {
        const g = c.images.get(h);
        if (g && !r.aborted) {
          if (await o?.beforePaint?.(), r.throwIfAborted(), a.drawImage(g, 0, 0, k, E), t.paintLayer !== "artwork" && t.face.blackBorderLift && (t.face.borderColor ?? "black") === "black") {
            if (!Number.isFinite(t.face.blackBorderLift) || t.face.blackBorderLift < 0 || t.face.blackBorderLift > 0.2)
              throw Error("Invalid black border lift");
            const f = Math.round(t.face.blackBorderLift * 255), b = k * 0.035;
            a.save(), a.globalCompositeOperation = "lighten", a.fillStyle = `rgb(${f},${f},${f})`, a.beginPath(), a.rect(0, 0, k, E), a.rect(b, b, k - 2 * b, E - 2 * b), a.fill("evenodd"), a.restore();
          }
          return wa(
            a,
            t.emblems ?? [],
            t.currentStats,
            i ? c.images.get(i) : void 0,
            t.statusLayout === "inspect" || e === "inspect"
          ), Sa(a, t.face), s;
        }
      } finally {
        c.dispose();
      }
    }
    t.paintLayer !== "artwork" && await Promise.all([
      (o?.loadFonts ?? fa)(),
      jt(t.face) ? Fm(t.face) : wg(t.face),
      Hu(t.face),
      tt(t.face) === "saga" ? jm() : Promise.resolve(),
      pr(t.face) || en(t.face) ? Ki() : Promise.resolve(),
      ot(t.face) || jt(t.face) === "old" || cr(t.face, "W") === "historic-font" ? (o?.loadRetroFont ?? Qc)() : Promise.resolve()
    ]), r.throwIfAborted();
    const l = await n(kl(t.face), r);
    let d, u, m;
    try {
      t.paintLayer !== "artwork" && (d = await fh(t.face, l.images, r)), t.paintLayer !== "artwork" && (u = await xh(t.face, d?.images ?? l.images, r)), m = t.paintLayer === "artwork" ? { images: l.images, dispose() {
      } } : await em(
        t.face,
        u?.images ?? d?.images ?? l.images,
        r
      ), await o?.beforePaint?.(), r.throwIfAborted();
      const h = m.images;
      if (Pl(
        a,
        t.rulesText !== !1,
        () => j0(
          a,
          t.face,
          () => Ml(
            a,
            t.face,
            h,
            E,
            !1,
            o?.underArt,
            t.paintLayer
          )
        )
      ), t.paintLayer !== "artwork" && t.face.blackBorderLift && (t.face.borderColor ?? "black") === "black") {
        if (!Number.isFinite(t.face.blackBorderLift) || t.face.blackBorderLift < 0 || t.face.blackBorderLift > 0.2)
          throw Error("Invalid black border lift");
        const c = Math.round(t.face.blackBorderLift * 255), g = k * 0.035;
        a.save(), a.globalCompositeOperation = "lighten", a.fillStyle = `rgb(${c},${c},${c})`, a.beginPath(), a.rect(0, 0, k, E), a.rect(g, g, k - 2 * g, E - 2 * g), a.fill("evenodd"), a.restore();
      }
      return wa(
        a,
        t.emblems ?? [],
        t.currentStats,
        i ? l.images.get(i) : void 0,
        t.statusLayout === "inspect" || e === "inspect"
      ), Sa(a, t.face), s;
    } finally {
      m?.dispose(), u?.dispose(), d?.dispose(), l.dispose();
    }
  } catch (a) {
    throw s.width = s.height = 0, a;
  }
}
function Sa(t, e) {
  t.save(), t.setTransform(
    t.canvas.width / k,
    0,
    0,
    t.canvas.height / E,
    0,
    0
  ), t.globalCompositeOperation = "destination-in", t.globalAlpha = 1, t.shadowColor = "transparent", t.filter = "none", t.fillStyle = "#000", t.beginPath(), t.roundRect(0, 0, k, E, nl(e) * k), t.fill(), t.restore();
}
function Ml(t, e, r, o = E, n = !1, s, a) {
  if (e = se(e), e.frameTemplate) {
    qu(t, e, r, a, s);
    return;
  }
  if (en(e)) {
    Rm(t, e, r, s, a);
    return;
  }
  if (pr(e)) {
    wm(t, e, r, s, a);
    return;
  }
  if (Se(e)) {
    Dm(t, e, r, s, a);
    return;
  }
  if (jt(e)) {
    Pm(t, e, r, s, a);
    return;
  }
  if (e.frameAssetFamily) {
    yg(t, e, r, s, a);
    return;
  }
  if (ot(e)) {
    Vc(t, e, r, s, a);
    return;
  }
  if (tt(e) === "saga") {
    Um(t, e, r, s, a);
    return;
  }
  const i = $t(e);
  if (i.length) {
    t.fillStyle = Tt(e) ?? Bt(e.setCode, e.borderColor).border, t.fillRect(0, 0, k, E);
    for (const $ of i)
      t.save(), $i(t, $), Ml(
        t,
        $.face,
        r,
        $.height * k / $.width,
        !0,
        s,
        a
      ), t.restore();
    if (a === "artwork") return;
    qn(t, e), Wo(e) && Qt(t) && (t.font = '14px "CardRenderer MTG MPlantin", Georgia', t.fillStyle = "white", t.textAlign = "center", t.textBaseline = "middle", t.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      k / 2,
      E - 12,
      k * 0.9
    ));
    return;
  }
  const l = ($) => [
    $[0] * k,
    $[1] * o,
    $[2] * k,
    $[3] * o
  ];
  t.fillStyle = Tt(e) ?? Bt(e.setCode, e.borderColor).border, t.fillRect(0, 0, k, o);
  const d = Pt(e), u = tt(e);
  if (a === "artwork") {
    Ft(t, e, r, l(d.art), a);
    return;
  }
  const m = _(e), h = we(m, u), g = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[m.boxes] ?? "#827d72", f = ($, Y, lt = "top") => {
    const Rt = r.get($);
    if (!Rt) return !1;
    const [Xt, ln, dn, un] = l(Y);
    t.save(), t.beginPath(), t.rect(Xt, ln, dn, un), t.clip();
    const Vo = lt === "stretch" ? un : Rt.height * dn / Rt.width;
    return t.drawImage(
      Rt,
      Xt,
      lt === "bottom" ? ln + un - Vo : ln,
      dn,
      Vo
    ), t.restore(), !0;
  }, [b, y, p, w] = l(m.legendary ? d.legendaryBackground : d.background);
  if (t.save(), t.beginPath(), t.roundRect(b, y, p, w, [
    { x: p * 0.01282, y: w * 962e-5 },
    { x: p * 0.01282, y: w * 962e-5 },
    { x: p * 0.06838, y: w * 0.05128 },
    { x: p * 0.06838, y: w * 0.05128 }
  ]), t.clip(), n) {
    const $ = g.slice(1).match(/../g).map(
      (Y, lt) => Math.round(parseInt(Y, 16) * 0.62 + [244, 236, 217][lt] * 0.38)
    );
    t.fillStyle = `rgb(${$.join(",")})`, t.fillRect(b, y, p, w);
  }
  const S = r.get(h.background), v = u.startsWith("planeswalker");
  if (S && v ? ua(t, S, b, y, p, u === "planeswalker-large") : S ? t.drawImage(
    S,
    b,
    y + (m.legendary ? X.legendaryBackgroundLift : 0),
    p,
    n ? w : S.height * p / S.width
  ) : (t.fillStyle = g, t.fillRect(b, y, p, w)), t.restore(), t.fillStyle = "#e3d8bb", !r.has(h.frame))
    if (u === "adventure")
      for (const $ of sn(e).filter((Y) => Y.kind === "rules" && !Y.color))
        t.fillRect($.x, $.y, $.width, $.height);
    else t.fillRect(...l(d.rules));
  r.has(h.boxes) || (t.fillRect(...l(d.title)), t.fillRect(...l(d.type))), t.fillStyle = "#80745c", v || t.fillRect(...l(d.art));
  const C = r.get(h.frame);
  if (C && u === "normal" && !n) {
    const $ = fo(e);
    Bh(
      t,
      m,
      $,
      () => va(t, C, m.legendary, d.frame, !0, $)
    ), $h(t, m, $), Ih(t, m, $);
  }
  if (s && (t.save(), t.beginPath(), t.rect(0, 0, k, o), t.clip(), t.resetTransform(), t.drawImage(s, 0, 0, t.canvas.width, t.canvas.height), t.restore()), u === "normal" && !n) {
    const [$, Y, lt, Rt] = l(d.art), Xt = ir.artRim;
    t.fillStyle = "#090806", t.fillRect($ - Xt, Y - Xt, lt + 2 * Xt, Rt + 2 * Xt);
  }
  if (Ft(t, e, r, l(d.art), a), v && mg(t, e), C && v) {
    const [$, Y, lt] = l(d.frame);
    ua(t, C, $, Y, lt, u === "planeswalker-large");
  } else C && u !== "normal" && va(t, C, m.legendary, d.frame);
  if (m.legendary && f(h.crown, d.crown), n) {
    const $ = r.get(h.boxes);
    if ($) {
      const lt = $.height * 0.104;
      t.drawImage($, 0, 0, $.width, lt, ...l(d.title)), t.drawImage($, 0, $.height - lt, $.width, lt, ...l(d.type));
    }
    const Y = r.get(h.frame);
    t.fillStyle = "#e3d8bb", t.fillRect(...l(d.rules)), Y && t.drawImage(
      Y,
      Y.width * 0.035,
      Y.height * 0.675,
      Y.width * 0.93,
      Y.height * 0.325,
      ...l(d.rules)
    );
  } else {
    const $ = v && ["Colourless", "Artifact", "Land"].includes(m.boxes);
    f(h.boxes, d.title), $ && (t.save(), t.globalAlpha *= yl, f(h.boxes, d.title), t.restore());
    const Y = r.get(h.boxes);
    v && Y ? gg(t, Y, d.type, $) : (f(h.boxes, d.type, "bottom"), u === "normal" && Y && (Sg(t, Y, l(d.type)), vg(t, l(d.type), m.boxes)));
  }
  n || Ui(t, e, r), t.fillStyle = "#17140f", t.textBaseline = "middle", t.textAlign = "left";
  const [T, R, M, x] = l(d.title), A = T + X.plateLeft + (u === "normal" ? 1 : 0), F = rn(e), L = bu(e), U = e.manaSymbols ?? [], O = X.manaSize * L, V = X.manaGap + (F?.spacing ?? 0), D = U.length * O + Math.max(0, U.length - 1) * V, Z = T + M - X.plateRight, ut = Z - D, it = [
    ut,
    R + x / 2 - O / 2 + X.manaLift / 2,
    D,
    O
  ], z = U.length ? pe(it, F) : it, N = (u === "normal" && !n ? X.normalTitleFont : X.titleFont) * L;
  t.font = `bold ${N}px "CardRenderer MTG Beleren", Georgia`, t.letterSpacing = `${X.titleTracking}px`, t.save(), u === "normal" && !n && t.translate(...Yo(e, "modern")), rt(
    t,
    e.name,
    A,
    R + x / 2 + (u === "normal" ? 1 : 0),
    z[0] - A - (U.length ? X.titleGap : 0),
    N,
    !0
  ), t.restore(), t.letterSpacing = "0px", H(
    t,
    e,
    "manaCost",
    () => Fe(t, it, F, () => {
      U.forEach(
        ($, Y) => et(
          t,
          $,
          ut + Y * (O + V),
          R + x / 2 - O / 2 + X.manaLift / 2,
          O,
          r,
          !0,
          F
        )
      );
    })
  );
  const P = Q(e), q = r.get(P ?? ""), ie = _t(P), wt = ae(e), le = wl(e), de = ol(e), Dt = le && u === "normal", zt = Dt ? pg : 1, qt = X.setMargin + (Dt ? 2 : 0), [, ve, , Ce] = l(d.type), ue = ve + Ce / 2 + X.typeLift / 2 + (u === "normal" || v ? 2 : 0), Ht = q ? Math.min(
    X.setMaxWidth,
    X.setHeight * q.width * wt[2] / (q.height * wt[3])
  ) : 0, ee = q ? Math.min(
    Ht / (q.width * wt[2]),
    X.setHeight / (q.height * wt[3])
  ) : 0, ct = [
    Z - qt - Ht - Ht * (zt - 1) / 2 + (v ? 1.5 : 0),
    ue - (q?.height ?? 0) * wt[3] * ee * zt / 2 - (Dt ? 1 : 0),
    (q?.width ?? 0) * wt[2] * ee * zt,
    (q?.height ?? 0) * wt[3] * ee * zt
  ], j = u === "normal" && !n ? qo(e, P, ct, "component") : ct, nt = pe(j, e.symbolAdjustment?.set), gt = Math.max(
    1,
    Math.min(
      Z - A - (q ? Ht * (1 + (zt - 1) / 2) + qt + X.typeGap : 0),
      q && nt !== ct ? nt[0] - A - X.typeGap : 1 / 0
    )
  );
  t.font = `${X.typeFont * L}px "CardRenderer MTG Beleren", Georgia`, rt(
    t,
    e.typeLine ?? "",
    A + (v ? 1.5 : 0),
    ue,
    gt,
    X.typeFont * L,
    !1,
    u === "normal" && !n ? ir.typeWidthScale : 1,
    "CardRenderer MTG Beleren",
    0,
    e.textInk
  ), H(
    t,
    e,
    "setSymbol",
    () => Fe(t, j, e.symbolAdjustment?.set, () => {
      q && (ie || e.setSymbol ? (t.save(), t.shadowColor = "transparent", t.drawImage(q, ...j), t.restore()) : le ? Sl(
        t,
        q,
        e.rarity,
        ...j,
        wt,
        Dt ? 1.5 : 1
      ) : de ? sl(
        t,
        q,
        de,
        e.rarity,
        ...j,
        wt,
        u === "normal"
      ) : te(
        t,
        q,
        e.setCode,
        e.rarity,
        ...j,
        wt
      ));
    })
  ), fl(e) ? og(t, e, r) : u !== "normal" ? cg(t, e, r) : _a(t, e, r) || Ct(t, ji(t, e, o, L), r);
  const mt = Fl(e);
  if (mt && u !== "leveler")
    if (f(h.pt, d.stats, "stretch"), u.startsWith("planeswalker"))
      Tu(t, mt.text, l(d.stats));
    else {
      const [$, Y, lt] = l(d.stats);
      t.fillStyle = "#17140f", t.font = `bold ${X.statsFont}px "CardRenderer MTG Beleren", Georgia`, t.textAlign = "center", t.textBaseline = "middle", dt(
        t,
        mt.text,
        $ + lt / 2,
        Y + X.statsLine / 2 + (u === "normal" ? 2 : 0),
        lt,
        e.textInk
      );
    }
  n || qn(t, e);
}
function va(t, e, r, o = K.frame, n = !1, s = 0) {
  const [a, i, l, d] = Pg(o), u = s, m = a + u, h = l - 2 * u, c = Math.min(e.height, d * e.width / l), g = c * l / e.width, f = t.getTransform().a, b = () => {
    if (!n) {
      t.drawImage(e, 0, 0, e.width, c, m, i, h, g);
      return;
    }
    const y = 424, p = 436;
    t.save(), t.beginPath(), t.rect(0, 0, k, y), t.rect(0, p, k, E - p), t.clip(), t.drawImage(e, 0, 0, e.width, c, m, i, h, g), t.restore(), t.save(), t.beginPath(), t.rect(0, y, k, p - y), t.clip(), t.drawImage(e, 0, 0, e.width, c, m, i - 1, h, g), t.restore();
  };
  t.save(), t.shadowColor = "black", t.shadowOffsetX = -394e-5 * k * f, t.shadowOffsetY = 394e-5 * k * f, t.shadowBlur = 236e-5 * k * f, b(), r || (t.shadowColor = "#ffffffa0", t.shadowOffsetX = 157e-5 * k * f, t.shadowOffsetY = -315e-5 * k * f, t.shadowBlur = 157e-5 * k * f, b()), t.restore();
}
function Pg(t) {
  return [t[0] * k, t[1] * E, t[2] * k, t[3] * E];
}
const Fg = [
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
], an = Object.freeze(
  Fg.map((t) => Object.freeze(t))
), vf = 1;
function Rl(t, e) {
  if (e.family === "match") return { ...t };
  const {
    frameStyle: r,
    frameTemplate: o,
    frameAssetFamily: n,
    frameTreatment: s,
    futureTreatment: a,
    borderColor: i,
    setSymbol: l,
    symbolAdjustment: d,
    setSymbolSource: u,
    setSymbolMask: m,
    legalText: h,
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
function xl(t, e) {
  const r = an.find((n) => n.id === e);
  if (!r) return { supported: !1, reason: "Unknown printing preset." };
  if (r.family === "match") return { supported: !0 };
  if (t.layout === "split" && t.faces?.length === 2)
    return r.family === "future" || r.treatment ? { supported: !1, reason: "This preset has no split-card painter." } : t.faces.some(
      (n) => !/^(Instant|Sorcery)\b/.test(n.canonicalTypeLine ?? n.typeLine ?? "")
    ) ? { supported: !1, reason: "Native split frames require two spell faces." } : { supported: !0 };
  if (t.faces?.length || t.layout && !["normal", "token", "transform", "modal_dfc", "reversible_card", "meld"].includes(
    t.layout
  ) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") || /^Level up\b/m.test(t.rulesText ?? ""))
    return {
      supported: !1,
      reason: "This prototype supports ordinary single faces and spell splits; retain the layout-specific painter."
    };
  try {
    r.family === "eighth" && kt(Rl({ ...t, layout: "normal" }, r));
  } catch (n) {
    return { supported: !1, reason: n.message };
  }
  return { supported: !0 };
}
function Be(t, e) {
  if (!e || typeof e != "object" || Array.isArray(e) || Object.keys(e).some((a) => !["preset", "overrides", "art"].includes(a)))
    throw Error("Invalid printing selection");
  const r = xl(
    e.overrides?.frameColors === void 0 ? t : { ...t, frameColors: e.overrides.frameColors },
    e.preset
  );
  if (!r.supported) throw Error(r.reason);
  const o = an.find((a) => a.id === e.preset);
  let n = Rl(t, o);
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
        xa(i), n.calibration = structuredClone(i);
        continue;
      }
      if (a !== "setSymbolCode") {
        if (a === "styleSetCode") {
          if (typeof i != "string" || !/^[-A-Za-z0-9_]{1,16}$/.test(i))
            throw Error("Invalid styling set code");
          n.setCode = i;
          continue;
        }
        if (a === "symbolAdjustment") {
          n.symbolAdjustment = structuredClone(i);
          continue;
        }
        if (a === "frameColors") {
          if (!Array.isArray(i) || i.length > 5 || !i.every((l) => typeof l == "string" && /^[WUBRG]$/.test(l)) || new Set(i).size !== i.length)
            throw Error("Invalid frame colors");
          n.frameColors = [...i];
          continue;
        }
        if (a === "elements") n.printingElements = structuredClone(i);
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
          Object.assign(n, { [a]: i });
        else throw Error("Unknown printing override: " + a);
      }
    }
  if (s.setSymbolMask !== void 0 && !["auto", "alpha", "ink"].includes(s.setSymbolMask))
    throw Error("Invalid set symbol mask mode");
  if (s.futureTreatment !== void 0 && (!["regular", "full-art", "clear"].includes(s.futureTreatment) || n.frameTemplate !== "future"))
    throw Error("Future treatment requires a Futureshifted frame.");
  if (s.styleSetCode !== void 0 && s.setCode !== void 0)
    throw Error("Choose one styling set code");
  if (s.symbolAdjustment !== void 0) {
    if (n.frameTemplate) throw Error("Fine symbol adjustments require an ordinary frame.");
    To(n);
  }
  for (const [a, i] of Object.entries(s)) {
    if (["artist", "legalText", "collectorNumber", "setSymbol"].includes(a) && i !== null && i !== void 0 && (typeof i != "string" || i.length > (a === "setSymbol" ? 65536 : 2048)))
      throw Error("Invalid printing text override");
    if (a === "setSymbol" && i === "") throw Error("Invalid symbol asset");
  }
  if (n.symbolStyle !== void 0 && !["original", "modern"].includes(n.symbolStyle))
    throw Error("Invalid mana symbol style");
  if (n.borderColor !== void 0 && !["black", "white", "silver"].includes(n.borderColor))
    throw Error("Invalid border color");
  if (s.setSymbolCode !== void 0) {
    if (typeof s.setSymbolCode != "string" || !/^[A-Za-z0-9_-]{1,16}$/.test(s.setSymbolCode))
      throw Error("Invalid symbol set code");
    if (s.setSymbol !== void 0) throw Error("Choose a symbol code or URL, not both.");
    n.setSymbol = Q({
      name: n.name,
      setCode: s.setSymbolCode,
      rarity: n.rarity
    });
  }
  if (s.setSymbol === null && (n.printingElements = {
    ...n.printingElements,
    setSymbol: { ...n.printingElements?.setSymbol, hidden: !0 }
  }), s.collectorNumber === null && (n.printingElements = {
    ...n.printingElements,
    collector: { ...n.printingElements?.collector, hidden: !0 }
  }), s.collectorNumber !== void 0 && n.collectorTotal === void 0 && (n.collectorTotal = null), n.collectorFormat !== void 0 && !["number-first", "rarity-first"].includes(n.collectorFormat))
    throw Error("Invalid collector format");
  for (const a of ["setCode", "collectorSetCode"])
    if (n[a] !== void 0 && n[a] !== null && (typeof n[a] != "string" || !/^[A-Za-z0-9_-]{1,16}$/.test(n[a])))
      throw Error("Invalid printing set code");
  if (n.securityStamp !== void 0 && !["none", "oval", "triangle", "acorn", "circle", "arena", "heart"].includes(n.securityStamp))
    throw Error("Invalid security stamp");
  if (n.printingElements && Object.keys(n.printingElements).length && !Xr(n).supported)
    throw Error(Xr(n).reason);
  if (Pa(n), n.collectorTotal !== void 0 && n.collectorTotal !== null && (!Number.isInteger(n.collectorTotal) || n.collectorTotal < 1 || n.collectorTotal > 99999))
    throw Error("Invalid collector total");
  if (n.collectorLanguage !== void 0 && !/^[A-Za-z]{2,5}$/.test(n.collectorLanguage))
    throw Error("Invalid collector language");
  if (n.frameTemplate === "future" && ei(n), e.art !== void 0 && (n = ku(n, e.art)), t.layout === "split" && t.faces && (n = {
    ...n,
    faces: t.faces.map(
      (a) => Be({ ...a, layout: "normal" }, e)
    )
  }), typeof n.calibration == "object" && !We(n))
    throw Error("M21 calibration requires a modern frame.");
  return se(n);
}
function Xr(t) {
  return !t.faces?.length && (!t.layout || ["normal", "token"].includes(t.layout)) && (!t.frameTemplate || t.frameTemplate === "future") && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") && !/^Level up\b/m.test(t.rulesText ?? "") ? { supported: !0, elements: ["artist", "legal", "collector", "manaCost", "setSymbol"] } : {
    supported: !1,
    elements: [],
    reason: "Element controls currently require an ordinary single face or Futureshifted template."
  };
}
function _g(t) {
  const e = {
    setCode: t.set?.toUpperCase(),
    symbolStyle: "original"
  };
  return t.frame === "future" ? (e.frameTemplate = "future", t.textless && (e.futureTreatment = "full-art")) : t.frame === "1993" || t.frame === "1997" ? e.frameStyle = "retro" : t.frame === "2003" ? (e.frameStyle = "modern", e.frameAssetFamily = "eighth") : t.frame === "2015" && (e.frameStyle = "modern"), t.frame_effects?.includes("colorshifted") && (e.frameStyle = "modern", e.frameAssetFamily = "eighth", e.frameTreatment = "colorshifted", delete e.frameTemplate, delete e.futureTreatment), ["black", "white", "silver"].includes(t.border_color ?? "") && (e.borderColor = t.border_color), t.security_stamp && ["none", "oval", "triangle", "acorn", "circle", "arena", "heart"].includes(t.security_stamp) ? e.securityStamp = t.security_stamp : e.securityStamp = "none", e;
}
function Wg(t) {
  const e = t.rulesParagraphs ? t.rulesParagraphs.flatMap((n) => n.runs.map((s) => s.text)).join(`
`) : t.rulesText ?? "", r = /* @__PURE__ */ new Set([
    ...t.manaSymbols ?? [],
    ...[...e.matchAll(/\{([^}]+)\}/g)].map((n) => n[1])
  ]), o = zo(t);
  return {
    frame: _0(t) || !!o || bt(t) && ze(t) && Ja(t).length > 0,
    manaSymbols: [
      .../* @__PURE__ */ new Set([
        ...[...r].filter((n) => !!si(t, /^\d+$/.test(n) ? "N" : n)),
        ...o?.glyph ? [o.color] : []
      ])
    ]
  };
}
const Ca = (t) => "mask" in t || t.hueDegrees !== 0 || t.saturationScale !== 1 || t.brightnessScale !== 1 || t.rgbScale !== void 0 || t.valueGamma !== void 0;
function Ug(t) {
  const e = Uo(t), { face: r, materials: o, assets: n } = e, s = Object.entries(o), a = (p) => {
    if (!p.length) return { status: "source", assets: [] };
    const w = p.filter((S) => e.fallbackAssets.includes(S));
    return {
      status: w.length === p.length ? "fallback" : w.length ? "mixed" : "measured",
      ...w.length === p.length ? { profile: "m21-modern", revision: 1 } : w.length ? {} : { profile: `printing:${r.setCode?.toLowerCase() ?? ""}`, revision: 1 },
      assets: p
    };
  }, i = a(
    s.filter(
      ([p, w]) => Ca(w) && ("mask" in w || p === n.boxes || p.includes("/pt_boxes/"))
    ).map(([p]) => p)
  ), l = a(
    s.filter(
      ([p, w]) => Ca(w) && (p !== n.boxes && !p.includes("/pt_boxes/") || "mask" in w)
    ).map(([p]) => p)
  ), d = Wg(r), u = zo(r), m = u?.frame ?? (bt(r) ? nr : void 0);
  if (m && d.frame)
    for (const p of [l, i])
      Object.assign(p, {
        status: "measured",
        profile: `printing:${r.setCode?.toLowerCase()}`,
        revision: 1,
        assets: [m]
      });
  const h = a(s.filter(([, p]) => p.blackPoint).map(([p]) => p)), g = [.../* @__PURE__ */ new Set([
    ...r.manaSymbols ?? [],
    ...[...(r.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((p) => p[1]),
    ...(r.rulesParagraphs ?? []).flatMap(
      (p) => p.runs.flatMap((w) => [...w.text.matchAll(/\{([^}]+)\}/g)].map((S) => S[1]))
    )
  ])].filter(
    (p) => Ii(r, /^\d+$/.test(p) ? "N" : p)
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
  ), (r.calibration === "auto" || typeof r.calibration == "object") && [l, i, h].some((p) => p.status === "source") && y.push("Some frame materials retain source colors or ink levels."), {
    mode: r.calibration ?? "legacy",
    components: { frame: l, textBox: i, border: b, interiorInk: h, manaSymbols: f },
    notices: y
  };
}
function Cf(t) {
  return Ra.map((e) => ({
    ...e,
    supported: We(t),
    ...We(t) ? {} : { reason: "Requires a modern frame." }
  }));
}
const jg = /^[a-z0-9][a-z0-9-]{0,47}$/;
function ft(t, e) {
  if (!t || typeof t != "object" || Array.isArray(t) || ![Object.prototype, null].includes(Object.getPrototypeOf(t)))
    throw Error("Invalid " + e);
}
function pt(t, e, r) {
  if (Object.keys(t).some((o) => !e.includes(o)))
    throw Error("Unknown " + r + " field");
}
function Br(t) {
  if (typeof t != "string" || !jg.test(t)) throw Error("Invalid printing style ID");
}
const Ng = [
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
function sr(t) {
  if (ft(t, "printing layer"), pt(t, ["overrides", "art"], "printing layer"), t.overrides !== void 0) {
    if (ft(t.overrides, "printing overrides"), pt(t.overrides, Ng, "printing override"), t.overrides.elements !== void 0) {
      ft(t.overrides.elements, "printing elements"), pt(
        t.overrides.elements,
        ["artist", "legal", "collector", "manaCost", "setSymbol"],
        "printing element"
      );
      for (const e of Object.values(t.overrides.elements))
        ft(e, "printing element"), pt(e, ["hidden", "offset"], "printing element");
    }
    if (t.overrides.symbolAdjustment !== void 0) {
      ft(t.overrides.symbolAdjustment, "symbol adjustment"), pt(t.overrides.symbolAdjustment, ["mana", "set"], "symbol adjustment");
      for (const [e, r] of Object.entries(t.overrides.symbolAdjustment))
        if (ft(r, "symbol transform"), pt(
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
          ft(r.glyphs, "mana glyphs"), pt(r.glyphs, ["W", "U", "B", "R", "G"], "mana glyph");
          for (const o of Object.values(r.glyphs))
            ft(o, "mana glyph"), pt(o, ["scale", "dx", "dy"], "mana glyph");
        }
    }
  }
  if (t.art !== void 0 && (ft(t.art, "art placement"), pt(t.art, ["mode", "zoom", "focalPoint", "paperOpacity"], "art placement")), t.overrides?.futureTreatment !== void 0 && !["regular", "full-art", "clear"].includes(t.overrides.futureTreatment))
    throw Error("Invalid future treatment");
  Be(
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
  ), t.art && Be(
    { name: "Art validation", typeLine: "Creature", colors: ["U"], frameTemplate: "future" },
    { preset: "match", art: { mode: "behind-text", ...t.art } }
  );
}
function El(t) {
  if (ft(t, "printing style"), pt(
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
  if (Br(t.id), typeof t.label != "string" || !t.label.trim() || t.label.length > 160)
    throw Error("Invalid printing style label");
  if (t.collectorSetCode !== void 0 && (typeof t.collectorSetCode != "string" || !/^[-A-Za-z0-9_]{1,16}$/.test(t.collectorSetCode)))
    throw Error("Invalid collector set code");
  if (t.defaults !== void 0 && sr(t.defaults), !Array.isArray(t.frames) || !t.frames.length || t.frames.length > 64)
    throw Error("A printing style needs 1..64 frame options");
  const e = /* @__PURE__ */ new Set();
  for (const r of t.frames) {
    if (ft(r, "frame option"), pt(r, ["id", "label", "selection"], "frame option"), Br(r.id), e.has(r.id)) throw Error("Duplicate frame option");
    if (e.add(r.id), typeof r.label != "string" || !r.label.trim() || r.label.length > 160)
      throw Error("Invalid frame label");
    if (ft(r.selection, "frame selection"), pt(r.selection, ["preset", "overrides", "art"], "frame selection"), !an.some((s) => s.id === r.selection.preset))
      throw Error("Unknown frame preset");
    const { preset: o, ...n } = r.selection;
    sr(n);
  }
  if (!e.has(t.defaultFrame)) throw Error("Unknown default frame");
  if (t.symbols !== void 0) {
    ft(t.symbols, "symbol pack"), pt(
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
    for (const o of t.rules) {
      if (ft(o, "frame rule"), pt(o, ["id", "when", "frame", "defaults"], "frame rule"), Br(o.id), r.has(o.id)) throw Error("Duplicate frame rule");
      if (r.add(o.id), !e.has(o.frame)) throw Error("Unknown rule frame");
      if (ft(o.when, "frame condition"), pt(
        o.when,
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
      ), o.when.colors !== void 0 && (!Array.isArray(o.when.colors) || o.when.colors.length > 5 || !o.when.colors.every((n) => typeof n == "string" && /^[WUBRG]$/.test(n)) || new Set(o.when.colors).size !== o.when.colors.length))
        throw Error("Invalid rule colors");
      if (o.when.colorSource !== void 0 && !["printing", "card"].includes(o.when.colorSource))
        throw Error("Invalid rule color source");
      if (o.when.colorCount !== void 0 && (!Array.isArray(o.when.colorCount) || o.when.colorCount.length !== 2 || !o.when.colorCount.every((n) => Number.isInteger(n) && n >= 0 && n <= 5) || o.when.colorCount[0] > o.when.colorCount[1]))
        throw Error("Invalid color count");
      for (const n of ["types", "layouts", "templates", "treatments", "rarities"])
        if (o.when[n] !== void 0 && (!Array.isArray(o.when[n]) || !o.when[n].length || o.when[n].length > 32 || !o.when[n].every(
          (s) => typeof s == "string" && /^[-a-zA-Z0-9_]{1,48}$/.test(s)
        )))
          throw Error("Invalid rule " + n);
      for (const n of ["artifact", "land", "legendary"])
        if (o.when[n] !== void 0 && typeof o.when[n] != "boolean")
          throw Error("Invalid rule trait");
      o.defaults !== void 0 && sr(o.defaults);
    }
  }
  return structuredClone(t);
}
function Dg(t) {
  ft(t, "printing style choice"), pt(t, ["frame", "overrides", "art"], "printing style choice");
  const { frame: e, ...r } = t;
  e !== void 0 && Br(e), sr(r);
}
const kf = 1;
function Jr(t) {
  return Array.isArray(t) ? t.map(Jr) : t && typeof t == "object" ? Object.fromEntries(
    Object.entries(t).filter(([, e]) => e !== void 0).map(([e, r]) => [e, Jr(r)])
  ) : t;
}
function zg(t, ...e) {
  const r = structuredClone(t);
  for (const o of e) {
    if (sr(o), o.art && (r.art = { mode: "window", ...r.art, ...Jr(structuredClone(o.art)) }), !o.overrides) continue;
    const n = r.overrides || {}, s = Jr(structuredClone(o.overrides)), a = { ...n, ...s };
    if (s.elements) {
      a.elements = structuredClone(n.elements || {});
      for (const i of Object.keys(s.elements))
        a.elements[i] = { ...a.elements[i], ...s.elements[i] };
    }
    if (s.symbolAdjustment) {
      a.symbolAdjustment = { ...n.symbolAdjustment, ...s.symbolAdjustment };
      for (const i of ["mana", "set"])
        s.symbolAdjustment[i] && (a.symbolAdjustment[i] = {
          ...n.symbolAdjustment?.[i],
          ...s.symbolAdjustment[i]
        });
      if (s.symbolAdjustment.mana?.glyphs) {
        a.symbolAdjustment.mana.glyphs = { ...n.symbolAdjustment?.mana?.glyphs };
        for (const i of Object.keys(s.symbolAdjustment.mana.glyphs))
          a.symbolAdjustment.mana.glyphs[i] = {
            ...n.symbolAdjustment?.mana?.glyphs?.[i],
            ...s.symbolAdjustment.mana.glyphs[i]
          };
      }
    }
    Object.hasOwn(s, "setSymbol") && delete a.setSymbolCode, Object.hasOwn(s, "setSymbolCode") && delete a.setSymbol, Object.hasOwn(s, "styleSetCode") && delete a.setCode, Object.hasOwn(s, "setCode") && delete a.styleSetCode, r.overrides = a;
  }
  return r;
}
function Yg(t, e) {
  const r = t.faces?.length ? t.faces : [t], o = Pr(
    r.flatMap(
      (a) => e.colorSource === "card" ? [...a.colors || []] : I({ ...a, frameColors: void 0 })
    )
  );
  if (e.colors && Pr(e.colors).join("") !== o.join("") || e.colorCount && (o.length < e.colorCount[0] || o.length > e.colorCount[1]))
    return !1;
  const n = _(t);
  for (const a of ["artifact", "land", "legendary"])
    if (e[a] !== void 0 && e[a] !== n[a]) return !1;
  const s = (t.canonicalTypeLine ?? t.typeLine ?? "").split(/[—–]/)[0].split(/\s+/).map((a) => a.toLowerCase());
  for (const [a, i] of [
    ["creature", "creature"],
    ["artifact", "artifact"],
    ["land", "land"],
    ["legendary", "legendary"]
  ])
    n[a] && !s.includes(i) && s.push(i);
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
function qg(t, e) {
  const r = {};
  if (t.collectorSetCode !== void 0 && (r.collectorSetCode = t.collectorSetCode), t.symbols) {
    const o = e.rarity || "common", n = Object.hasOwn(t.symbols, o) ? t.symbols[o] : t.symbols.default, s = Object.hasOwn(t.symbols, o) && t.symbols[o] === null;
    (s || n !== void 0) && (r.setSymbol = s ? null : n);
  }
  return { overrides: r };
}
function Tf(t, e, r = {}, o = {}) {
  const n = Ll.includes(e) ? e : El(e);
  return n.frames.map((s) => {
    try {
      const a = Xg(t, n, r, { ...o, frame: s.id });
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
function Hg(t, e) {
  return e === void 0 ? t : {
    ...t,
    frameColors: e,
    ...t.faces ? { faces: t.faces.map((r) => ({ ...r, frameColors: e })) } : {}
  };
}
function Xg(t, e, r = {}, o = {}) {
  const n = Ll.includes(e) ? e : El(e);
  for (const v of [r, o])
    if (Dg(v), v.frame !== void 0 && !n.frames.some((C) => C.id === v.frame))
      throw Error("Unknown chosen frame");
  const { frame: s, ...a } = r, { frame: i, ...l } = o, d = i ?? s, u = n.rules?.find((v) => Yg(t, v.when));
  let m = i !== void 0 ? "face" : s !== void 0 ? "card" : u ? "rule" : "default", h = n.frames.find((v) => v.id === (d ?? u?.frame ?? n.defaultFrame));
  const c = [], g = (v, C = v.selection.preset) => zg(
    { ...v.selection, preset: C },
    n.defaults || {},
    qg(n, t),
    u?.defaults || {},
    a,
    l
  );
  let f = g(h);
  const b = (v) => {
    const C = g(v), T = xl(
      Hg(t, C.overrides?.frameColors),
      C.preset
    );
    if (!T.supported) return T;
    try {
      return Be(t, {
        preset: C.preset,
        overrides: Object.fromEntries(
          Object.entries(C.overrides || {}).filter(
            ([R]) => !["elements", "symbolAdjustment"].includes(R)
          )
        )
      }), T;
    } catch (R) {
      return { supported: !1, reason: R.message };
    }
  }, y = b(h);
  if (!y.supported) {
    if (d !== void 0) throw Error(y.reason);
    m = "fallback";
    const v = n.frames.find((C) => C.id === n.defaultFrame);
    v.id !== h.id && b(v).supported ? (h = v, f = g(h), c.push("Automatic frame is unsupported; using the default frame. " + y.reason)) : (f = g(h, "match"), c.push("Keeping the native layout. " + y.reason));
  }
  const p = Be(t, {
    preset: f.preset,
    overrides: Object.fromEntries(
      Object.entries(f.overrides || {}).filter(
        ([v]) => !["elements", "symbolAdjustment", "futureTreatment"].includes(v)
      )
    )
  });
  if (f.overrides?.futureTreatment !== void 0)
    if (p.frameTemplate !== "future") {
      if (r.overrides?.futureTreatment || o.overrides?.futureTreatment)
        throw Error("Future treatment requires a Futureshifted frame.");
      delete f.overrides.futureTreatment, c.push("Inherited Future treatment is unavailable for this layout.");
    } else p.futureTreatment = f.overrides.futureTreatment;
  if (f.overrides?.elements && !Xr(p).supported) {
    if (r.overrides?.elements || o.overrides?.elements)
      throw Error(Xr(p).reason);
    delete f.overrides.elements, c.push("Inherited element positioning is unavailable for this layout.");
  }
  if (f.overrides?.symbolAdjustment)
    try {
      if (p.frameTemplate) throw Error("Fine symbol adjustments require an ordinary frame.");
      To({
        ...p,
        symbolAdjustment: f.overrides.symbolAdjustment
      });
    } catch (v) {
      if (r.overrides?.symbolAdjustment || o.overrides?.symbolAdjustment) throw v;
      delete f.overrides.symbolAdjustment, c.push("Inherited symbol adjustments are unavailable for this layout.");
    }
  if (f.art && !Gi(p).modes.includes(f.art.mode)) {
    if (r.art || o.art)
      throw Error("This frame does not support the selected art placement.");
    delete f.art, c.push("Inherited artwork placement is unavailable for this frame.");
  }
  f = structuredClone(f);
  const w = Be(t, f), S = Ug(w);
  return {
    face: w,
    calibration: S,
    selection: f,
    frame: h.id,
    frameSource: m,
    ...u ? { rule: u.id } : {},
    notices: [...c, ...S.notices]
  };
}
function Al(t) {
  if (t && typeof t == "object") {
    for (const e of Object.values(t)) Al(e);
    Object.freeze(t);
  }
  return t;
}
const Ll = Object.freeze(
  an.filter((t) => !["plc-colorshifted", "fut"].includes(t.id)).map((t) => {
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
      for (const [o, n] of [
        ["full-art", "Futureshifted · Full art"],
        ["clear", "Futureshifted · Clear"]
      ])
        e.push({
          id: o,
          label: n,
          selection: { preset: "fut", overrides: { futureTreatment: o } }
        }), r.push({
          id: "existing-" + o,
          when: { templates: ["future"], treatments: [o] },
          frame: o
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
    }), Al({
      version: 1,
      id: t.id === "fut-regular" ? "fut" : t.id,
      label: t.id === "fut-regular" ? "Future Sight" : t.label,
      defaultFrame: "regular",
      frames: e,
      ...r.length ? { rules: r } : {}
    });
  })
);
function Ir(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    throw Error("Expected a card object.");
  return t;
}
function W(t, e = "", r = 32768) {
  if (t == null) return e;
  if (typeof t != "string" || t.length > r) throw Error("Invalid card text.");
  return t;
}
function ka(t) {
  if (t == null) return [];
  if (!Array.isArray(t) || t.length > 5 || !t.every((e) => typeof e == "string" && /^[WUBRG]$/.test(e)))
    throw Error("Invalid card colors.");
  return [...new Set(t)];
}
function Jg(t) {
  const e = W(t, "", 200);
  if (!/^(?:\{[0-9A-Z/∞]+\}\s*)*$/.test(e)) throw Error("Invalid mana cost.");
  return [...e.matchAll(/\{([^}]+)\}/g)].map((r) => r[1]);
}
function Kg(t) {
  if (t == null) return null;
  const e = W(t, "", 4096), r = new URL(e);
  if (r.protocol !== "https:" || r.username || r.password)
    throw Error("Provider artwork requires an HTTPS URL.");
  return r.href;
}
function Ta(t, e = "") {
  return [
    ...t.split(`
`).filter(Boolean).map((r) => ({
      role: "rules",
      runs: r.split(/(\([^)]*\))/g).filter(Boolean).map((o) => ({ text: o, ...o.startsWith("(") ? { italic: !0 } : {} }))
    })),
    ...e.split(`
`).filter(Boolean).map((r) => ({
      role: "flavor",
      runs: r.split("*").map((o, n) => ({ text: o, italic: n % 2 === 0 })).filter((o) => o.text)
    }))
  ];
}
function Vg(t, e, r, o) {
  const n = o.wording ?? "oracle";
  if (!["oracle", "original"].includes(n)) throw Error("Invalid wording choice.");
  if (o.symbolStyle !== void 0 && !["original", "modern"].includes(o.symbolStyle))
    throw Error("Invalid symbol style.");
  const s = {
    ...r ?? e,
    manaSymbols: Hi(t, e.manaSymbols ?? [])
  };
  return cm(t, { oracle: e, original: s }, n, {
    symbolStyle: o.symbolStyle ?? "original"
  });
}
function Ol(t, e, r, o = null) {
  if (!t.length || t.length > 2) throw Error("Supply one card with at most two faces.");
  if (r.illustrations !== void 0 && (!Array.isArray(r.illustrations) || r.illustrations.length !== t.length || !r.illustrations.every(
    (s) => s === null || typeof s == "string" && s.length <= 4096
  )))
    throw Error("Invalid illustration overrides.");
  r.illustrations && (o = null), t = t.map((s, a) => ({
    ...s,
    ...r.illustrations?.[a] !== void 0 ? { illustration: r.illustrations[a] } : {}
  }));
  const n = r.faceIndex ?? 0;
  if (!Number.isInteger(n) || n < 0 || n >= t.length)
    throw Error("This card does not have that face.");
  if (r.faceIndex !== void 0 || t.length === 1 || ["transform", "modal_dfc", "reversible_card", "meld", "double_faced_token"].includes(e)) {
    const s = t[n];
    return {
      ...s,
      ...n > 0 && ["transform", "modal_dfc", "battle", "double_faced_token"].includes(e) ? { securityStamp: "none" } : {},
      illustration: s.illustration ?? o,
      ...e === "battle" && n === 0 ? { frameTemplate: "battle", frameAssetFamily: void 0 } : {}
    };
  }
  if (!["split", "aftermath", "flip", "adventure", "prepare", "room", "battle"].includes(e))
    throw Error("Unsupported multiple-face layout: " + e);
  return e === "battle" ? {
    ...t[n],
    frameTemplate: n === 0 ? "battle" : void 0,
    frameAssetFamily: void 0
  } : {
    ...t[0],
    layout: e === "room" ? "split" : e,
    faces: t,
    illustration: o,
    ...["adventure", "prepare", "room"].includes(e) ? { frameAssetFamily: void 0 } : {},
    ...e === "flip" ? { frameTemplate: "flip", frameAssetFamily: void 0 } : {}
  };
}
function Zg(t, e = {}) {
  const r = Ir(t), o = W(r.name, "", 256);
  if (!o.trim()) throw Error("The Scryfall card needs a name.");
  const n = r.card_faces === void 0 ? [r] : r.card_faces;
  if (!Array.isArray(n) || !n.length || n.length > 2)
    throw Error("Supply one Scryfall card with at most two faces.");
  const s = _g({
    set: W(r.set),
    frame: W(r.frame),
    frame_effects: r.frame_effects === void 0 ? void 0 : Qg(r.frame_effects),
    border_color: W(r.border_color),
    security_stamp: W(r.security_stamp),
    textless: r.textless === !0
  }), a = (m) => m.image_uris ? Kg(Ir(m.image_uris).art_crop) : null, l = ["common", "uncommon", "rare", "mythic", "special", "bonus"].find((m) => m === (r.rarity ?? "common"));
  if (!l) throw Error("Invalid card rarity.");
  const d = n.map((m, h) => {
    const c = Ir(m), g = W(c.type_line, W(r.type_line), 512);
    if (!g.trim()) throw Error("The Scryfall face needs a type line.");
    const f = W(c.oracle_text), b = Jg(c.mana_cost), y = ka(
      c.colors ?? c.color_indicator ?? (n.length === 1 ? r.colors : [..."WUBRG"].filter(
        (C) => b.some((T) => T.split("/").includes(C)) && (r.colors == null || ka(r.colors).includes(C))
      ))
    ), p = um(
      g,
      y,
      s.setCode,
      W(r.frame),
      c.produced_mana ?? r.produced_mana
    ), w = {
      name: W(c.name, o, 256),
      typeLine: g,
      rulesText: f,
      manaSymbols: b,
      rulesParagraphs: Ta(f, W(c.flavor_text))
    }, v = typeof c.printed_text == "string" || typeof c.printed_type_line == "string" || typeof c.printed_name == "string" ? {
      ...w,
      name: W(c.printed_name, w.name, 256),
      typeLine: W(c.printed_type_line, g, 512),
      rulesText: W(c.printed_text, f),
      rulesParagraphs: Ta(
        W(c.printed_text, f),
        W(c.flavor_text)
      )
    } : void 0;
    return Vg(
      {
        ...hm(s, g, f),
        ...h > 0 && ["transform", "modal_dfc", "battle", "double_faced_token"].includes(String(r.layout)) ? { securityStamp: "none" } : {},
        name: w.name,
        colors: y,
        ...p ? { frameColors: p } : {},
        rarity: l,
        artist: W(c.artist, W(r.artist), 256),
        collectorNumber: W(r.collector_number, "", 64),
        ...typeof r.lang == "string" && /^[a-z]{2,5}$/i.test(r.lang) ? { collectorLanguage: r.lang } : {},
        ...c.watermark == null && r.watermark == null ? {} : { watermark: W(c.watermark ?? r.watermark, "", 64) },
        power: c.power == null ? void 0 : W(c.power),
        toughness: c.toughness == null ? void 0 : W(c.toughness),
        loyalty: c.loyalty == null ? void 0 : W(c.loyalty),
        defense: c.defense == null ? void 0 : W(c.defense),
        illustration: a(c),
        colorCalibration: "set-hsb-v1"
      },
      w,
      v,
      e
    );
  });
  let u = W(r.layout, "normal", 64);
  if (n.length === 1 && ["split", "aftermath", "flip", "adventure", "prepare", "room"].includes(u))
    throw Error("Supply both Scryfall faces for this layout.");
  return u === "split" && /\bAftermath\b/.test(d[1]?.rulesText ?? "") && (u = "aftermath"), Ol(d, u, e, n.length > 1 ? a(r) : null);
}
function Qg(t) {
  if (!Array.isArray(t) || t.length > 32) throw Error("Invalid frame effects.");
  return t.map((e) => W(e, "", 64));
}
function tf(t, e) {
  const r = t.map((a) => ({ type: a.originalType, text: a.originalText }));
  if (t.length !== 2 || !["split", "aftermath", "adventure", "prepare", "flip"].includes(e))
    return r;
  const o = (a) => W(a).replace(/\r\n?/g, `
`), n = t.map((a) => o(a.originalText));
  if (e === "flip") {
    if (!n.some((u) => /\n-{3,}\n/.test(u))) return r;
    const a = n[0].split(/\n-{3,}\n/), i = a[1]?.split(`
`);
    if (n[0] !== n[1] || a.length !== 2 || !i || i[0] !== t[1].faceName || !i[1] || !/^\S+\/\S+$/.test(i[2] ?? "") || i.length < 4)
      throw Error("Ambiguous joined MTGJSON original flip text.");
    const l = (u) => o(u).replace(/[—–-]/g, " ").replace(/\s+/g, " ").trim(), d = [t[1].originalType, t[1].type].find(
      (u) => typeof u == "string" && l(u) === l(i[1])
    ) ?? i[1];
    return [
      { type: r[0].type, text: a[0] },
      { type: d, text: i.slice(3).join(`
`) }
    ];
  }
  if (!n.some((a) => /\s+\/\/\s+/.test(a))) return r;
  const s = n[0].split(/\s+\/\/\s+/);
  if (n[0] !== n[1] || s.length !== 2)
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
    const m = W(a.originalType);
    l === 1 && m && d.startsWith(m + `
`) && (d = d.slice(m.length + 1));
    const h = W(a.type), c = t[0].originalType === t[1].originalType, g = /^(Instant|Sorcery)$/.test(m) && /^(Instant|Sorcery)$/.test(h), f = e === "adventure" && /^(Instant|Sorcery)\s*[—–-]\s*Adventure$/.test(h);
    return { text: d, type: c && (g || f) ? h : a.originalType };
  });
}
function Mf(t, e = {}) {
  const r = (Array.isArray(t) ? t : [t]).map(Ir), o = [...r];
  if (!r.length || r.length > 2)
    throw Error("Supply the associated records of one MTGJSON card.");
  if (e.illustrations !== void 0 && (!Array.isArray(e.illustrations) || e.illustrations.length !== r.length))
    throw Error("Supply one illustration override per input record.");
  if (r.length > 1) {
    const [d, u] = r;
    if (d.uuid !== void 0 && d.uuid === u.uuid || d.side !== void 0 && d.side === u.side || d.layout !== u.layout)
      throw Error("Supply two distinct associated MTGJSON faces with the same layout.");
    const m = (f, b) => typeof b.uuid == "string" && Array.isArray(f.otherFaceIds) && f.otherFaceIds.includes(b.uuid), h = m(d, u) || m(u, d), c = [d.uuid, u.uuid, d.otherFaceIds, u.otherFaceIds].some(
      (f) => f !== void 0
    ), g = d.name === u.name && typeof d.faceName == "string" && typeof u.faceName == "string" && d.faceName !== u.faceName;
    if ((c ? !h : !g) || d.setCode !== void 0 && u.setCode !== void 0 && d.setCode !== u.setCode || d.number !== void 0 && u.number !== void 0 && W(d.number).replace(/[ab]$/, "") !== W(u.number).replace(/[ab]$/, "") || [
      [d, u],
      [u, d]
    ].some(([f, b]) => Array.isArray(f.otherFaceIds) && !f.otherFaceIds.includes(b.uuid)))
      throw Error("The MTGJSON records are not associated faces of one card.");
    r.every((f) => typeof f.side == "string") && r.sort((f, b) => W(f.side).localeCompare(W(b.side)));
  }
  const n = r[0], s = W(n.layout, "normal", 64);
  if (r.length === 1 && ["split", "aftermath", "flip", "adventure", "prepare", "room"].includes(s))
    throw Error("Supply both MTGJSON face records for this layout.");
  const a = e.wording === "original" ? tf(r, s) : void 0, i = r.map((d, u) => ({
    name: d.faceName ?? d.name,
    type_line: d.type,
    oracle_text: d.text ?? "",
    mana_cost: d.manaCost ?? "",
    colors: d.colors,
    produced_mana: mm(W(d.text)),
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
    (d, u) => Zg(
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
  return Ol(l, s, {
    ...e,
    ...e.illustrations ? { illustrations: r.map((d) => e.illustrations[o.indexOf(d)]) } : {}
  });
}
function Rf(t, e) {
  const r = { ...t, setCalibrationCandidate: e };
  if (yt(r), !Mt(r)) throw Error("This printing has no set calibration adapter");
  return r;
}
export {
  tt as $,
  Is as A,
  wf as B,
  gl as C,
  xg as D,
  Wl as E,
  _l as F,
  ff as G,
  pf as H,
  Wg as I,
  lr as J,
  Lt as K,
  id as L,
  gs as M,
  Sf as N,
  zg as O,
  li as P,
  Cu as Q,
  Ie as R,
  vi as S,
  Nl as T,
  rg as U,
  sn as V,
  ng as W,
  bf as X,
  Gg as Y,
  nl as Z,
  md as _,
  E as a,
  _g as a$,
  Ul as a0,
  Wt as a1,
  Pt as a2,
  Q as a3,
  Fl as a4,
  Mg as a5,
  kt as a6,
  t0 as a7,
  Mf as a8,
  Zg as a9,
  Ct as aA,
  te as aB,
  cg as aC,
  ks as aD,
  hf as aE,
  $i as aF,
  Pg as aG,
  ig as aH,
  dg as aI,
  uf as aJ,
  sf as aK,
  Cf as aL,
  Ra as aM,
  Xr as aN,
  vf as aO,
  xl as aP,
  an as aQ,
  kf as aR,
  Tf as aS,
  Ll as aT,
  we as aU,
  ku as aV,
  _ as aW,
  I as aX,
  Ug as aY,
  Be as aZ,
  Xg as a_,
  fl as aa,
  Nt as ab,
  jr as ac,
  jo as ad,
  yf as ae,
  ot as af,
  G as ag,
  fa as ah,
  Cl as ai,
  Qc as aj,
  Ge as ak,
  fe as al,
  Pr as am,
  ji as an,
  Ig as ao,
  Fe as ap,
  Ml as aq,
  wa as ar,
  Og as as,
  og as at,
  rt as au,
  Ft as av,
  et as aw,
  mg as ax,
  Vc as ay,
  ii as az,
  af as b,
  Jd as b0,
  co as b1,
  Gt as b2,
  ho as b3,
  uo as b4,
  Ot as b5,
  Zc as b6,
  Kt as b7,
  Hd as b8,
  Zr as b9,
  xo as bA,
  K0 as bB,
  Kr as bC,
  fs as bD,
  No as bE,
  xa as bF,
  El as bG,
  To as bH,
  Or as bI,
  cm as bJ,
  Rf as bK,
  Xe as bL,
  en as bM,
  pr as bN,
  Se as bO,
  jt as bP,
  gf as bQ,
  Ue as bR,
  Eg as bS,
  kg as bT,
  Tg as bU,
  $a as bV,
  ms as ba,
  Et as bb,
  mo as bc,
  df as bd,
  Qa as be,
  qd as bf,
  Yc as bg,
  pl as bh,
  jl as bi,
  Hn as bj,
  lf as bk,
  Wi as bl,
  Mo as bm,
  Wm as bn,
  bl as bo,
  Ga as bp,
  ae as bq,
  ud as br,
  z0 as bs,
  ug as bt,
  hu as bu,
  br as bv,
  Wo as bw,
  $t as bx,
  bu as by,
  J0 as bz,
  K as c,
  X as d,
  k as e,
  As as f,
  Ar as g,
  St as h,
  Bg as i,
  lu as j,
  Dd as k,
  Pe as l,
  Nd as m,
  Xd as n,
  Nr as o,
  Ut as p,
  ki as q,
  re as r,
  Ro as s,
  mf as t,
  pe as u,
  Gi as v,
  cf as w,
  kl as x,
  Rg as y,
  Bt as z
};
