function O0(e, t, r) {
  const a = t.printingOmissions;
  if (!a?.length) return r();
  const s = e.fillText, n = e.strokeText, o = (i, l, d) => {
    const c = e.getTransform().transformPoint({ x: l, y: d }), h = c.x * 488 / e.canvas.width, u = c.y * 680 / e.canvas.height;
    return a.some(({ rect: m, rotation: g = 0, texts: f }) => {
      if (!f.includes(String(i))) return !1;
      const w = g * Math.PI / 180, y = h - m[0] * 488, p = u - m[1] * 680, b = y * Math.cos(w) + p * Math.sin(w), S = -y * Math.sin(w) + p * Math.cos(w);
      return b >= -8 && b <= m[2] * 488 + 8 && S >= -8 && S <= m[3] * 680 + 25;
    });
  };
  e.fillText = function(i, l, d, c) {
    o(i, l, d) || s.call(this, i, l, d, ...c === void 0 ? [] : [c]);
  }, e.strokeText = function(i, l, d, c) {
    o(i, l, d) || n.call(this, i, l, d, ...c === void 0 ? [] : [c]);
  };
  try {
    r();
  } finally {
    e.fillText = s, e.strokeText = n;
  }
}
function D0(e, t, [r, a, s, n]) {
  sn(e, t, 24, r + s / 2, a + n / 2 + 2.5, s * 0.72);
}
function W0(e, t, [r, a, s, n]) {
  const o = t.startsWith("+") ? -0.25 : t === "0" ? -3.25 : -4.5;
  sn(
    e,
    t,
    19.5,
    r + s / 2 - 0.5,
    a + n / 2 + o,
    s - 10,
    0.97
  );
}
function sn(e, t, r, a, s, n, o = 1) {
  e.save(), e.fillStyle = "#fff", e.font = `700 ${r}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "alphabetic", e.letterSpacing = "0px", e.shadowColor = "transparent";
  const i = e.measureText(t), l = Math.min(n, i.width * o), d = Math.min(1, l / Math.max(1, i.width)), c = a + (i.actualBoundingBoxLeft - i.actualBoundingBoxRight) * d / 2, h = s + (i.actualBoundingBoxAscent - i.actualBoundingBoxDescent) / 2;
  e.fillText(t, c, h, l), e.restore();
}
function P0(e) {
  return e.power != null && e.toughness != null ? {
    text: `${e.power}/${e.toughness}`,
    label: `Power ${e.power}, toughness ${e.toughness}`
  } : e.loyalty != null && e.loyalty !== "" ? { text: String(e.loyalty), label: `Starting loyalty ${e.loyalty}` } : e.defense != null && e.defense !== "" ? { text: String(e.defense), label: `Defense ${e.defense}` } : null;
}
const C = 488, I = 680, U0 = 0.058;
function Re(e, t) {
  if (t === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (t ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    e?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const F0 = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", V = {
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
  stamp: [0.34, 0.76 - 0.16 * C / I, 0.32, 0.32 * C / I]
}, z = {
  titleFont: 24,
  normalTitleFont: 26,
  titleTracking: 54e-5 * C,
  titleGap: 0.02362 * C,
  plateLeft: 0.02362 * C,
  plateRight: 0.01575 * C,
  manaSize: 0.03556 * 1.35 * C,
  manaGap: 378e-5 * C,
  manaLift: -63e-4 * C,
  typeFont: 0.044 * C,
  typeGap: 945e-5 * C,
  typeLift: -315e-5 * C,
  setHeight: 0.06142 * C,
  setMaxWidth: 0.11024 * C,
  setMargin: 472e-5 * C,
  rulesPaddingX: 0.01575 * C,
  rulesPaddingY: 0.02362 * C,
  normalRulesFont: 0.04444 * C,
  longRulesFont: 0.0381 * C,
  denseRulesFont: 0.0328 * C,
  paragraphGap: 787e-5 * C,
  statsFont: 0.05333 * C,
  statsLine: 0.08661 * C,
  footerFont: 0.02167 * C,
  footerLine: 0.02126 * C,
  footerTracking: 362e-5 * C,
  artistMarginLeft: 7e-3 * C,
  artistMarginRight: 35e-4 * C,
  legendaryBackgroundLift: -0.02047 * C
}, Ha = (e) => e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
function _0(e = V) {
  return {
    ...Object.fromEntries(
      Object.entries(e).flatMap(
        ([t, r]) => r.map((a, s) => [
          `--face-${Ha(t)}-${["x", "y", "w", "h"][s]}`,
          `${a * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(z).map(([t, r]) => [
        `--face-${Ha(t)}`,
        `${r / C * 100}cqw`
      ])
    )
  };
}
const Ed = _0();
function N0(e) {
  return e.length > 340 ? "dense" : e.length > 210 ? "long" : "normal";
}
function Ld(e) {
  return {
    dense: z.denseRulesFont,
    long: z.longRulesFont,
    normal: z.normalRulesFont
  }[N0(e)];
}
function gr(e) {
  return e.split(/(\{[^}\n]+\})/g).filter(Boolean).map((t) => ({
    value: t,
    symbol: /^\{[^}\n]+\}$/.test(t) ? t.slice(1, -1) : null
  }));
}
function z0(e) {
  const t = e.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[t] ?? t.slice(0, 3);
}
const nn = {
  plc: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 165 },
  fut: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 180 },
  "8ed": { legal: "™ & © 1993–2003 Wizards of the Coast, Inc.", total: 350 },
  m15: { legal: "™ & © 2014 Wizards of the Coast", total: 269 },
  war: { legal: "™ & © 2019 Wizards of the Coast", total: 264 },
  m21: { legal: "™ & © 2020 Wizards of the Coast", total: 274 },
  fdn: { legal: "™ & © 2024 Wizards of the Coast", format: "rarity-first" }
};
function ua(e) {
  return e.legalText === void 0 ? nn[e.setCode?.toLowerCase() ?? ""]?.legal ?? null : e.legalText;
}
function ma(e, t = !0) {
  const r = e.collectorNumber?.trim();
  if (!r) return "";
  const a = nn[e.setCode?.toLowerCase() ?? ""], s = e.collectorFormat ?? a?.format ?? "number-first", n = /^Basic (?:Snow )?Land\b/.test(e.typeLine ?? "") ? "L" : (e.rarity ?? "common")[0].toUpperCase();
  if (t && s === "rarity-first")
    return `${n} ${r.split("/")[0].replace(/^(\d+)/, (c) => c.padStart(4, "0"))}`;
  const o = /^\d+$/.test(r), i = t && o ? r.padStart(3, "0") : r, l = a?.total, d = l && o && Number(r) <= l ? `${i}/${l}` : i;
  return t ? `${d} ${n}` : d;
}
function qr(e, t) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.letterSpacing = "0px", e.fillStyle = Re(t.setCode, t.borderColor).ink, e.textBaseline = "alphabetic", e.textAlign = "left", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(ma(t), 30, 645);
  const r = t.setCode?.trim().toUpperCase() ?? "", a = r ? `${r} • EN` : "";
  e.fillText(a, 30, 658);
  const s = ua(t), n = t.power != null && t.toughness != null || t.loyalty != null;
  let o = 30 + e.measureText(a).width + (a ? 7 : 0);
  t.artist && (e.font = '11px "CardRenderer MTG Artist Credit", sans-serif', e.fillText("a", o, 658), o += e.measureText("a").width + 2, e.font = '700 11px "CardRenderer MTG Beleren Small Caps", Georgia', e.fillText(t.artist, o, 658, Math.max(1, (s && n ? 272 : 456) - o))), s && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(s, 456, n ? 658 : 645, 178)), e.restore();
}
const Y0 = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", H0 = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", q0 = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", X0 = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", J0 = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-new-split-fuse.mse-style", V0 = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", K0 = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", K = {
  RENDERER_COMPONENT_ROOT: Y0,
  KEYRUNE_ROOT: H0,
  CONJURER_ROOT: q0,
  RETRO_ROOT: X0,
  MSE_SPLIT_BRIDGE_ROOT: J0,
  RETRO_SYMBOL_FONT: V0,
  MSE_TEMPLATE_ROOT: K0
}, Z0 = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function Pt(e) {
  const t = /^Basic (?:Snow )?Land [—–-] (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    e.typeLine ?? ""
  )?.[1];
  return t ? Z0[t] : void 0;
}
function fr(e) {
  if (e.frameStyle === "retro" || e.frameTemplate || e.layout && e.layout !== "normal")
    return null;
  const t = Pt(e);
  if (!t) return null;
  const r = e.rulesText ?? "";
  if (!["", t, `{${t}}`, `{T}: Add {${t}}.`, `({T}: Add {${t}}.)`].includes(r))
    return null;
  if (e.rulesParagraphs) {
    const a = e.rulesParagraphs;
    if (a.length !== 1 || a[0].role !== "rules" || a[0].align || a[0].runs.length !== 1 || a[0].runs[0].text !== r || !!a[0].runs[0].italic !== r.startsWith("("))
      return null;
  }
  return `${K.RETRO_ROOT}/img/frames/m15/basics/${t.toLowerCase()}.png`;
}
function on(e, t, r) {
  const a = fr(t);
  if (!a) return !1;
  const s = r.get(a);
  if (!s) throw Error(`Basic land symbol unavailable: ${a}`);
  return e.save(), e.shadowColor = "#0009", e.shadowOffsetX = -1.5, e.shadowOffsetY = 1.5, e.shadowBlur = 1.5, e.drawImage(s, 166, 440, 156, 156), e.restore(), !0;
}
const Q0 = { "10e": "cmrsu", "2ed": "cmrsu", "2x2": "cmrsu", "2xm": "cmrsu", "30a": "cmrsu", "3ed": "cmrsu", "40k": "cmrsu", "4ed": "cmrsu", "5dn": "cmrsu", "5ed": "cmrsu", "6ed": "cmrsu", "7ed": "cmrsu", "8ed": "cmrsu", "9ed": "cmrsu", a25: "cmrsu", acr: "cmrsu", aer: "cmrsu", afc: "cmrsu", afr: "cmrsu", akh: "cmrsu", akr: "cmrsu", ala: "cmrsu", all: "cmrsu", ana: "cmrsu", apc: "cmrsu", arb: "cmrsu", arc: "cmrsu", archie: "cmrsu", arena: "cmrsu", arn: "cmrsu", ath: "cmrsu", atq: "cmrsu", avr: "cmrsu", azorius: "cmru", bbd: "cmrsu", bfz: "cmrsu", big: "cmrsu", blb: "cmrsu", blc: "cmrsu", bng: "cmrsu", bok: "cmrsu", boros: "cmru", bot: "cmrsu", brb: "cmrsu", brc: "cmrsu", bro: "cmrsu", brr: "cmrsu", btd: "cmrsu", c13: "cmrsu", c14: "cmrsu", c15: "cmrsu", c16: "cmrsu", c17: "cmrsu", c18: "cmrsu", c19: "cmrsu", c20: "cmrsu", c21: "cmrsu", cc1: "cmrsu", cc2: "cmrsu", ced: "cmrsu", cei: "cmrsu", chk: "cmrsu", chr: "cmrsu", clb: "cmrsu", clu: "cmrsu", cm1: "cmrsu", cm2: "cmrsu", cma: "cmrsu", cmd: "cmrsu", cmm: "cmrsu", cmr: "cmrsu", cn2: "cmrsu", cns: "cmrsu", con: "cmrsu", conf: "cmrsu", csp: "cmrsu", dci: "cmrsu", dd1: "cmrsu", dd2: "cmrsu", ddc: "cmrsu", ddd: "cmrsu", dde: "cmrsu", ddf: "cmrsu", ddg: "cmrsu", ddh: "cmrsu", ddi: "cmrsu", ddj: "cmrsu", ddk: "cmrsu", ddl: "cmrsu", ddm: "cmrsu", ddn: "cmrsu", ddo: "cmrsu", ddp: "cmrsu", ddq: "cmrsu", ddr: "cmrsu", dds: "cmrsu", ddt: "cmrsu", ddu: "cmrsu", default: "cmrsu", dft: "cmrsu", dgm: "cmrsu", dimir: "cmru", dis: "cmrsu", dka: "cmrsu", dkm: "cmrsu", dmc: "cmrsu", dmr: "cmrsu", dmu: "cmrsu", dom: "cmrsu", dpa: "cmrsu", drb: "cmrsu", drc: "cmrsu", drk: "cmrsu", dsc: "cmrsu", dsk: "cmrsu", dst: "cmrsu", dtk: "cmrsu", e01: "cmrsu", e02: "cmrsu", ecc: "cmrsu", ecl: "cmrsu", eld: "cmrsu", ema: "cmrsu", emn: "cmrsu", eoc: "cmrsu", eoe: "cmrsu", eos: "cmru", eve: "cmrsu", exo: "cmrsu", exp: "cmrsu", fca: "cmrsu", fdc: "cmrsu", fdn: "cmrsu", fem: "cmrsu", fic: "cmrsu", fin: "cmrsu", fnm: "r", fra: "cmrsu", frc: "cmrsu", frf: "cmrsu", fut: "cmrsu", gn2: "cmrsu", gn3: "cmrsu", gnt: "cmrsu", golgari: "cmru", gpt: "cmrsu", grn: "cmrsu", gruul: "cmru", gs1: "cmrsu", gtc: "cmrsu", h09: "cmrsu", h17: "cmrsu", ha1: "cmrsu", hbg: "cmrsu", hml: "cmrsu", hob: "cmrsu", hoc: "cmrsu", hop: "cmrsu", hou: "cmrsu", ice: "cmrsu", idw: "cmrsu", iko: "cmrsu", ima: "cmrsu", inr: "cmrsu", inv: "cmrsu", isd: "cmrsu", izzet: "cmru", j20: "cmrsu", j21: "cmrsu", j22: "cmrsu", j25: "cmru", jmp: "cmrsu", jou: "cmrsu", jud: "cmrsu", khc: "cmrsu", khm: "cmrsu", kld: "cmrsu", klr: "cmrsu", ktk: "cmrsu", lcc: "cmrsu", lci: "cmrsu", lea: "cmrsu", leb: "cmrsu", leg: "cmrsu", lgn: "cmrsu", lrw: "cmrsu", ltc: "cmrsu", ltr: "cmrsu", m10: "cmrsu", m11: "cmrsu", m12: "cmrsu", m13: "cmrsu", m14: "cmrsu", m15: "cmrsu", m19: "cmrsu", m20: "cmrsu", m21: "cmrsu", m3c: "cmrsu", mat: "cmrsu", mb2: "cmrsu", mbc: "cmrsu", mbs: "cmrsu", mc3: "cmrsu", md1: "cmrsu", me1: "cmrsu", me2: "cmrsu", me3: "cmrsu", me4: "cmrsu", med: "cmrsu", mh1: "cmrsu", mh2: "cmrsu", mh3: "cmrsu", mic: "cmrsu", mid: "cmrsu", mir: "cmrsu", mkc: "cmrsu", mkm: "cmrsu", mm2: "cmrsu", mm3: "cmrsu", mma: "cmrsu", mmq: "cmrsu", moc: "cmrsu", mom: "cmrsu", mor: "cmrsu", mp2: "cmrsu", mps: "cmrsu", mrd: "cmrsu", msc: "cmrsu", msh: "cmrsu", mtga: "cmrsu", mtgo: "cmrsu", mul: "cmrsu", ncc: "cmrsu", nec: "cmrsu", nem: "cmrsu", neo: "cmrsu", nph: "cmrsu", ody: "cmrsu", ogw: "cmrsu", om1: "cmrsu", omb: "cmrsu", onc: "cmrsu", one: "cmrsu", ons: "cmrsu", ori: "cmrsu", orzhov: "cmru", otc: "cmrsu", otj: "cmrsu", otp: "cmrsu", p02: "cmrsu", papac: "cmrsu", parl2: "cmrsu", past: "cmrsu", pbook: "cmrsu", pc2: "cmrsu", pca: "cmrsu", pcy: "cmrsu", pd2: "cmrsu", pd3: "cmrsu", pdrc: "c", peuro: "cmrsu", pgru: "c", phpr: "cmrsu", phuk: "cmrsu", pidw: "cmrsu", pio: "cmrsu", pip: "cmrsu", planeswalker: "cmrsu", plc: "cmrsu", pls: "cmrsu", pmps: "cmrsu", por: "cmrsu", prm: "cmrsu", ps11: "cmrsu", psal: "cmrsu", psdg: "cmrsu", psum: "cmrsu", ptg: "cmrsu", ptk: "cmrsu", pvan: "c", pxbox: "cmrsu", pz1: "cmrsu", pz2: "cmrsu", pza: "cmrsu", rav: "cmrsu", ren: "cmrsu", rex: "cmrsu", rin: "cmrsu", rix: "cmrsu", rna: "cmrsu", roe: "cmrsu", rtr: "cmrsu", rvr: "cmrsu", s00: "cmrsu", s99: "cmrsu", scd: "cmrsu", scg: "cmrsu", sds: "cmrsu", selesnya: "cmru", shm: "cmrsu", simic: "cmru", sir: "cmrsu", sis: "cmrsu", sld: "cmrsu", snc: "cmrsu", soa: "cmrsu", soc: "cmrsu", soi: "cmrsu", sok: "cmrsu", som: "cmrsu", sos: "cmrsu", spe: "cmrsu", spg: "cmrsu", spm: "cmrsu", ss1: "cmrsu", ss2: "cmrsu", ss3: "cmrsu", sta: "cmrsu", star: "cmrsu", sth: "cmrsu", stx: "cmrsu", td0: "cmrsu", td2: "cmrsu", tdc: "cmrsu", tdm: "cmrsu", thb: "cmrsu", ths: "cmrsu", tla: "cmrsu", tle: "cmrsu", tlr: "c", tmc: "cmrsu", tmp: "cmrsu", tmt: "cmrsu", tor: "cmrsu", tpr: "cmrsu", trc: "cmrsu", trk: "cmrsu", tsp: "cmrsu", tsr: "cmrsu", uds: "cmrsu", ugl: "cmrsu", ulg: "cmrsu", uma: "cmrsu", und: "cmrsu", unf: "cmrsu", unh: "cmrsu", usg: "cmrsu", ust: "cmrsu", v09: "cmrsu", v10: "cmrsu", v11: "cmrsu", v12: "cmrsu", v13: "cmrsu", v14: "cmrsu", v15: "cmrsu", v16: "cmrsu", v17: "cmrsu", van: "cmrsu", vis: "cmrsu", vma: "cmrsu", voc: "cmrsu", vow: "cmrsu", w16: "cmrsu", w17: "cmrsu", war: "cmrsu", who: "cmrsu", woc: "cmrsu", woe: "cmrsu", wor: "u", wot: "cmrsu", wth: "cmrsu", wwk: "cmrsu", x2ps: "cmrsu", xln: "cmrsu", y22: "cmrsu", y23: "cmrsu", y24: "cmrsu", y25: "cmrsu", y26: "cmrsu", zen: "cmrsu", znc: "cmrsu", zne: "cmrsu", znr: "cmrsu" }, eo = {
  codes: Q0
}, to = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), ro = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function ln(e) {
  return to.has(e?.trim().toLowerCase() ?? "");
}
function ao(e) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(e?.toLowerCase() ?? "") ? 0 : 1;
}
function so(e, t) {
  const r = e?.trim().toLowerCase() ?? "";
  return ro.has(r) || r === "atq" && t === "Reconstruction";
}
const L = K.CONJURER_ROOT, dn = `${L}/img/setSymbols/official/`, qa = eo.codes, no = {
  common: "c",
  uncommon: "u",
  rare: "r",
  mythic: "m",
  special: "s",
  bonus: "s"
};
function cn(e, t = "common", r = "auto") {
  const a = e.trim().toLowerCase();
  if (r === "keyrune") return null;
  const s = ln(a) ? "c" : no[t];
  return s && Object.hasOwn(qa, a) && qa[a].includes(s) ? `${dn}${a}-${s}.svg` : null;
}
function Te(e) {
  return !!e?.startsWith(dn);
}
const oo = K.KEYRUNE_ROOT, io = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function Ne(e) {
  return !e.setSymbol && !cn(e.setCode ?? "", e.rarity, e.setSymbolSource) ? io[e.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1] : [0, 0, 1, 1];
}
const hn = new Set(
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
hn.add("con_");
const lo = "GLINT", sr = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function co(e) {
  const t = sr[e] ?? sr.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${t}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function ho(e) {
  const t = sr[e] ?? sr.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${t}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function uo(e, t = "common", r) {
  const a = e.trim().toLowerCase();
  if (a === "forge") return ho(t);
  if (a === lo.toLowerCase()) return co(t);
  const s = cn(a, t, r);
  if (s) return s;
  const n = a === "con" ? "con_" : a === "p02" ? "po2" : a;
  return hn.has(n) ? `${oo}/${n}.svg` : null;
}
const Xa = {
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
function mo(e) {
  return Object.hasOwn(Xa, e) ? Xa[e] : null;
}
const mt = K.RENDERER_COMPONENT_ROOT;
function pr(e, t = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(t), a = t === "saga" ? "saga" : t === "planeswalker-large" ? "planeswalker_large" : t, s = r && e.land && /^[WUBRG]$/.test(e.frame) ? e.frame : ["saga", "class"].includes(t) && e.boxes === "Colourless" ? "Land" : t.startsWith("planeswalker") && e.boxes === "Artifact" ? "Colourless" : e.boxes;
  return {
    background: fe(
      r ? "bg" : t === "class" ? "saga_bg" : `${a}_bg`,
      t.startsWith("planeswalker") && s === "Land" ? "Colourless" : r ? e.boxes : s
    ),
    frame: fe(
      ["normal", "leveler"].includes(t) ? "frames" : `${a}_frames`,
      t === "adventure" ? "WUBRG".includes(e.frame) ? e.frame : "W" : t === "class" ? e.frame === "WU" ? "UW" : e.frame.length === 2 ? "Gold" : e.frame : t === "saga" && e.frame === "Colourless" ? "Land" : t.startsWith("planeswalker") && ["Artifact", "Land"].includes(e.frame) ? "Colourless" : e.frame
    ),
    boxes: fe(t.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", s),
    nameplate: fe("nameplates", e.boxes),
    crown: fe("legendary-crowns", e.crown),
    pt: t.startsWith("planeswalker") ? fe("planeswalker", "Loyalty") : fe("pt-boxes", e.pt)
  };
}
function gt(e) {
  const t = e.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = t === "∞" ? "INFINITY" : t === "½" ? "HALF" : t.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? fe("symbols", r) : null;
}
function go(e, t, r) {
  return uo(e, t, r);
}
function fe(e, t) {
  const r = e === "legendary-crowns" ? "legendary_crowns" : e === "pt-boxes" ? "pt_boxes" : e === "nameplates" ? "boxes" : e, a = e === "symbols" ? "svg" : "webp";
  return `${mt}/img/${r}/${encodeURIComponent(t)}.${a}`;
}
function Q(e, t = e.rarity) {
  const r = e.setCode?.trim().toLowerCase() ?? "";
  return e.setSymbol ?? go(
    r === "chr" ? mo(e.name) ?? "" : r,
    t,
    e.setSymbolSource
  );
}
const fo = [
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
], Pe = 0.91339 * C / 768, Xr = 0.04724 * C, Jr = 0.02655 * I;
function po(e) {
  return [
    (Xr + 20 * Pe) / C,
    (Jr + 84 * Pe) / I,
    728 * Pe / C,
    ((e ? 541 : 622) - 84) * Pe / I
  ];
}
function bo(e, t) {
  const r = fo[t ? 1 : 0];
  e.beginPath(), r.forEach(([a, s], n) => {
    const o = Xr + (s - 1) * Pe, i = Jr + a * Pe;
    n === 0 ? e.moveTo(o, i) : e.lineTo(o, i);
  });
  for (let a = r.length - 1; a >= 0; a--) {
    const [s, n] = r[a];
    e.lineTo(Xr + (769 - n) * Pe, Jr + s * Pe);
  }
  e.closePath(), e.clip();
}
const xr = "WUBRG";
function J(e) {
  const t = e.typeLine ?? "", r = e.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(t), a = e.land ?? /(^|\s)Land(?:\s|$)/i.test(t), s = !/\bPlaneswalker\b/i.test(t) && (e.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(t)), n = e.creature ?? /(^|\s)Creature(?:\s|$)/i.test(t), o = O(e), i = o.length === 0 ? "Colourless" : o.length > 2 ? "Gold" : o.join(""), l = (r || a) && o.length === 0 ? "Artifact" : i, d = a ? "Land" : r ? "Artifact" : o.length > 1 ? "Gold" : i;
  return {
    frame: l,
    boxes: d,
    background: d,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: a && o.length > 0 ? i : r && o.length > 0 ? o.length > 1 ? "Gold" : i : d,
    pt: d,
    artifact: r,
    land: a,
    legendary: s,
    creature: n,
    className: `rendered-card-profile-${d.toLocaleLowerCase()}`
  };
}
function O(e) {
  if (e.frameColors !== void 0) return Ja(e.frameColors);
  const t = Ja(e.colors ?? []), r = Pt(e);
  return t.length === 0 && r && e.land !== !1 ? [r] : t;
}
function Ja(e) {
  return [
    ...new Set(
      e.map((t) => t.toLocaleUpperCase()).filter((t) => xr.includes(t))
    )
  ].sort((t, r) => xr.indexOf(t) - xr.indexOf(r));
}
const Va = `${K.CONJURER_ROOT}/img/frames/future/regular`, ga = K.MSE_TEMPLATE_ROOT, ge = `${ga}/magic-future.mse-style`, Yt = `${ga}/magic-future-textless.mse-style`;
function ie(e) {
  return e.futureTreatment ?? "regular";
}
function un(e) {
  const t = O(e);
  return t.join("") === "WG" ? ["G", "W"] : t.join("") === "WR" ? ["R", "W"] : t;
}
function _e(e) {
  const t = J(e), r = un(e), a = ie(e), s = a === "full-art", n = t.land && !s, o = a === "regular" && !n && !t.artifact && r.length === 0, i = n || o, l = r.length > 1 ? "M" : r[0] ?? (t.artifact ? "A" : "C"), d = (r[0]?.toLowerCase() ?? "c") + "l", c = n && r.length === 2, h = (r[1]?.toLowerCase() ?? "c") + "l", u = e.power != null && e.toughness != null;
  if (s && !/^[WUBRG]$/.test(l))
    throw Error("Futureshifted full-art plates require one printed frame color");
  const m = ["U", "B", "R", "G"].includes(l) && !(n && c), g = [
    "Artifact",
    "Creature",
    "Enchantment",
    "Instant",
    "Land",
    "Planeswalker",
    "Sorcery"
  ].filter((y) => new RegExp(`\\b${y}\\b`).test(e.typeLine ?? ""));
  /\b(?:Tribal|Kindred)\b/.test(e.typeLine ?? "") && g.push("Tribal");
  const f = g.length > 1 ? "multitype" : g[0]?.toLowerCase(), w = n ? ["U", "B", "R", "G"].includes(r[0] ?? "") : m;
  return {
    kind: "future",
    base: s ? `${Yt}/${l.toLowerCase()}card.jpg` : i ? `${ge}/${o ? "c" : d}card.jpg` : `${Va}/futureFrame${l}.png`,
    ...s ? { mask: `${Yt}/mask_image.png` } : {},
    ...i ? {
      mask: `${ge}/mask_image.png`,
      paper: `${ge}/${o ? "c" : t.creature ? l.toLowerCase() : d}textbox.png`,
      type: `${ge}/${o ? "c" : d}typeline.png`
    } : {},
    ...c ? {
      reverseBase: `${ge}/${h}card.jpg`,
      reversePaper: `${ge}/${h}textbox.png`,
      reverseType: `${ge}/${h}typeline.png`,
      neutralBase: `${ge}/clcard.jpg`,
      neutralType: `${ge}/cltypeline.png`,
      baseBlend: `${ge}/hybrid_blend_card.png`,
      typeBlend: `${ge}/hybrid_blend_typeline.png`
    } : {},
    ...u ? {
      stats: s ? `${Yt}/${l.toLowerCase()}pt.jpg` : i ? `${ge}/${o ? "c" : d}pt.png` : `${Va}/futurePT${l}.png`,
      ...s ? { statsMask: `${Yt}/mask_pt.png` } : {}
    } : {},
    ...f ? {
      typeSymbol: `${ga}/magic-future-common.mse-include/${f}_${w ? "white" : "black"}.png`
    } : {},
    ...e.artist ? {
      brush: `${K.CONJURER_ROOT}/img/manaSymbols/${n || m ? "whitebrush" : "brush"}.svg`
    } : {}
  };
}
function fa(e) {
  const t = ie(e), r = t === "full-art";
  return {
    art: r ? [32, 83, 433, 476] : t === "clear" ? [23, 22, 442, 637] : [32, 83, 433, 297],
    title: [86, 32, 360, 43],
    type: [59, r ? 560 : 382, 367, 40],
    rules: [50, 433, 393, 166],
    stats: [377, 609, 69, 40],
    symbol: [431, r ? 571 : 389, 29, 29],
    footer: [38, 611, 404, 35]
  };
}
function pa(e, t, r, a, s, n = "#efe7cb", o) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = n, e.beginPath(), e.arc(t + a / 2, r + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.clip(), e.fillStyle = "#0d0f0f", e.font = '100px "CardRenderer MTG Historic Symbols"', e.textAlign = "left", e.textBaseline = "alphabetic";
  const i = "", l = e.measureText(i), d = l.actualBoundingBoxLeft + l.actualBoundingBoxRight, c = l.actualBoundingBoxAscent + l.actualBoundingBoxDescent, h = s * (o?.scale ?? 1) / Math.max(d, c);
  e.translate(t + a / 2 + (o?.dx ?? 0), r + a / 2 + (o?.dy ?? 0)), e.scale(h, h), e.fillText(
    i,
    (l.actualBoundingBoxLeft - l.actualBoundingBoxRight) / 2,
    (l.actualBoundingBoxAscent - l.actualBoundingBoxDescent) / 2
  ), e.restore();
}
const Ad = "symbols-v3";
function wo(e) {
  if (e.symbolAdjustment) {
    if (e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
      throw Error("Symbol adjustment currently supports ordinary faces only.");
    for (const [t, r] of Object.entries(e.symbolAdjustment)) {
      if (t !== "mana" && t !== "set") throw Error("Unknown symbol adjustment group.");
      if (!r || typeof r != "object") throw Error("Invalid symbol adjustment.");
      for (const [a, s] of Object.entries(r)) {
        if (t === "mana" && a === "glyphs") {
          yo(s);
          continue;
        }
        const n = a === "dx" || a === "dy", o = t === "mana" && (a === "numberDx" || a === "numberDy"), i = t === "mana" && a === "spacing", l = a === "scaleX" || a === "scaleY" || t === "mana" && a === "numberScale", d = i || o ? 4 : 8;
        if (!n && !o && !i && !l || typeof s != "number" || !Number.isFinite(s) || s < (l ? 0.75 : -d) || s > (l ? 1.25 : d))
          throw Error("Symbol adjustment exceeds supported bounds.");
      }
    }
  }
}
function yo(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    throw Error("Invalid mana glyph controls.");
  for (const [t, r] of Object.entries(e)) {
    if (!/^[WUBRG]$/.test(t) || !r || typeof r != "object" || Array.isArray(r))
      throw Error("Invalid mana glyph color.");
    for (const [a, s] of Object.entries(r)) {
      const n = a === "scale";
      if (!n && a !== "dx" && a !== "dy" || typeof s != "number" || !Number.isFinite(s) || s < (n ? 0.75 : -4) || s > (n ? 1.25 : 4))
        throw Error("Mana glyph control exceeds supported bounds.");
    }
  }
}
function At(e, t) {
  return /^[WUBRG]$/.test(t) ? e?.glyphs?.[t] : void 0;
}
function tt(e, t) {
  const { dx: r = 0, dy: a = 0, scaleX: s = 1, scaleY: n = 1 } = t ?? {};
  if (!r && !a && s === 1 && n === 1) return e;
  const [o, i, l, d] = e;
  return [o + l + r - l * s, i + d / 2 + a - d * n / 2, l * s, d * n];
}
function ft(e, t, r, a) {
  const s = tt(t, r);
  if (s === t || !t[2] || !t[3]) {
    a();
    return;
  }
  e.save();
  const n = s[2] / t[2], o = s[3] / t[3];
  e.transform(n, 0, 0, o, s[0] - t[0] * n, s[1] - t[1] * o);
  try {
    a();
  } finally {
    e.restore();
  }
}
function So(e, t, r) {
  const a = Math.max(0, t - 1) * (r?.spacing ?? 0);
  return a ? [e[0] - a, e[1], e[2] + a, e[3]] : e;
}
function pt(e) {
  if (!/^#[a-f0-9]{6}$/i.test(e)) throw Error("Invalid mana palette color");
  return [
    parseInt(e.slice(1, 3), 16) / 255,
    parseInt(e.slice(3, 5), 16) / 255,
    parseInt(e.slice(5, 7), 16) / 255
  ];
}
const ko = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, vo = "#9aa4ae", Ir = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
function ba(e, t, r, a) {
  const s = [];
  for (const n of t.split(`
`)) {
    let o = [], i = 0;
    const l = gr(n).flatMap(
      (d) => d.symbol ? [{ text: d.symbol, symbol: !0 }] : (d.value.match(/\s+|\S+/g) ?? []).map((c) => ({ text: c, symbol: !1 }))
    );
    for (const d of l) {
      const c = !d.symbol && e.measureText(d.text).width > r ? [...d.text].map((h) => ({ text: h, symbol: !1 })) : [d];
      for (const h of c) {
        const u = h.symbol ? a * 0.94 : e.measureText(h.text).width;
        i + u > r && o.length && (s.push(o), o = [], i = 0), !(!o.length && /^\s+$/.test(h.text)) && (o.push({ ...h, width: u }), i += u);
      }
    }
    s.push(o);
  }
  return s;
}
function ee(e, t, r, a, s, n, o = !1, i) {
  if (t === "W" && n.originalWhiteGlyph) {
    pa(
      e,
      r,
      a,
      s,
      s * 0.87,
      n.manaColors?.W,
      At(i, t)
    );
    return;
  }
  const l = /^\d+$/.test(t), d = At(i, t), c = n.manaGlyphScales?.[t] ?? 1, h = l ? i ? n.manaNumerals?.get(t) : void 0 : c !== 1 || d ? n.manaGlyphs?.get(t) : void 0, u = n.get(gt(t) ?? "");
  if (e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, o) {
    const m = e.getTransform();
    e.shadowColor = "#000d";
    const [g, f] = n.manaCostShadow ?? [-1.5372, 1.5372];
    e.shadowOffsetX = g * m.a + f * m.c, e.shadowOffsetY = g * m.b + f * m.d;
  }
  if (e.fillStyle = n.manaColors?.[t] ?? ko[t] ?? vo, e.beginPath(), e.arc(r + s / 2, a + s / 2, s / 2, 0, Math.PI * 2), e.fill(), e.shadowColor = "transparent", h && e.drawImage(h.image, 0, 0, h.width, h.height, r, a, s, s), h) {
    const m = l ? i?.numberDx ?? 0 : d?.dx ?? 0, g = l ? i?.numberDy ?? 0 : d?.dy ?? 0, f = l ? i?.numberScale ?? 1 : c * (d?.scale ?? 1);
    l || (e.beginPath(), e.arc(r + s / 2, a + s / 2, s / 2, 0, Math.PI * 2), e.clip()), (m || g || f !== 1) && (e.translate(r + s / 2 + m, a + s / 2 + g), e.scale(f, f), e.translate(-r - s / 2, -a - s / 2));
  }
  if (h || u) {
    h ? e.drawImage(
      h.image,
      h.width,
      0,
      h.width,
      h.height,
      r,
      a,
      s,
      s
    ) : e.drawImage(u, r, a, s, s), e.restore();
    return;
  }
  e.fillStyle = t === "B" ? "white" : "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = `bold ${s * 0.62}px Georgia`, e.fillText(t, r + s / 2, a + s / 2, s * 0.9), e.restore();
}
function mn(e, t, r, a, s, n, o) {
  const i = typeof n == "number" ? n : n.size;
  e.font = `${typeof n != "number" && n.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
  const l = t.split(`
`).map((d) => ba(e, d, s, i));
  e.textBaseline = "top";
  for (const d of l) {
    for (const c of d) {
      let h = r;
      for (const u of c)
        u.symbol ? ee(e, u.text, h + i * 0.07, a + i * 0.03, i * 0.8, o) : e.fillText(u.text, h, a), h += u.width;
      a += i;
    }
    a += z.paragraphGap;
  }
}
function Od(e, t, r) {
  if (e.measureText(t).width <= r) return t;
  const a = [...t];
  for (; a.length && e.measureText(`${a.join("")}…`).width > r; ) a.pop();
  return a.length || e.measureText("…").width <= r ? `${a.join("")}…` : "";
}
function te(e, t, r, a, s, n, o = !1, i = 1, l = "CardRenderer MTG Beleren") {
  if (!(s > 0)) throw Error("Magic title/type plate has no text space.");
  e.save(), e.font = `${o ? "bold " : ""}${n}px "${l}", Georgia`;
  const d = e.measureText(t).width;
  i > 1 && d * i > s && (i = 1), i !== 1 && (e.translate(r, 0), e.scale(i, 1), r = 0, s /= i), d > s && (n = Math.max(n * 0.78, n * s / d), e.font = `${o ? "bold " : ""}${n}px "${l}", Georgia`), e.fillText(t, r, a, s), e.restore();
}
function Ee(e, t, r, a, s, n, o, i, l = [0, 0, 1, 1]) {
  const d = [
    l[0] * t.width,
    l[1] * t.height,
    l[2] * t.width,
    l[3] * t.height
  ], c = {
    uncommon: "#aaaeb2",
    rare: "#bc923f",
    mythic: "#c65c2d",
    special: "#8664af",
    bonus: "#bc923f"
  }[a ?? "common"];
  if (!c || ["forge", "glint"].includes(r?.toLowerCase() ?? "")) {
    e.drawImage(t, ...d, s, n, o, i);
    return;
  }
  const h = document.createElement("canvas");
  h.width = Math.max(1, Math.ceil(o * 2)), h.height = Math.max(1, Math.ceil(i * 2));
  const u = h.getContext("2d");
  u.drawImage(t, ...d, 0, 0, h.width, h.height), u.globalCompositeOperation = "source-in", u.fillStyle = c, u.fillRect(0, 0, h.width, h.height), e.drawImage(h, s, n, o, i), h.width = h.height = 0;
}
function br(e) {
  return /^[WUBRG]$/.test(e) ? `${K.MSE_TEMPLATE_ROOT}/magic-mana-future.mse-symbol-font/mana_${e.toLowerCase()}.png` : /^(?:[0-9]|1[0-9]|20|X)$/.test(e) ? `${K.CONJURER_ROOT}/img/manaSymbols/future/f0.png` : /^[WUBRG]\/[WUBRG]$/.test(e) ? `${K.CONJURER_ROOT}/img/manaSymbols/future/f${e.toLowerCase().replace("/", "")}.png` : null;
}
function Co(e) {
  const t = e.manaSymbols ?? [];
  return [
    .../* @__PURE__ */ new Set([
      ...t.map(br).filter((r) => r !== null),
      ...t.some((r) => /^(?:\d+|X)$/.test(r)) ? Vr() : []
    ])
  ];
}
function Vr() {
  return ["0", "1", "2", "3", "4", "5", "6", "x"].map(
    (e) => `${K.CONJURER_ROOT}/img/manaSymbols/future/f${e}.png`
  );
}
function Ro(e, t, r) {
  const a = [91, 61, 46, 46, 59, 106], s = [140, 207, 281, 356, 437, 512], n = t.manaSymbols ?? [];
  if (n.length > a.length) throw Error("Futureshifted cost exceeds the six source positions");
  n.forEach((o, i) => {
    const l = ie(t) === "full-art" && i > 0 && i < 3, d = l || ie(t) === "regular" && i < 4, c = d ? /^[WUBRG]$/.test(o) ? 37.125 : 38.125 : 59 * 488 / 744, h = l ? [79.0376, 58.6102, 56.1465] : [78.1626, 59.4852, 51.6465, 51.6465], u = l ? [113.101, 161.7009, 217.5071] : [111.851, 154.0759, 202.5071, 252.3427], m = d ? h[i] - c / 2 : a[i] * 488 / 744, g = d ? u[i] - c / 2 : s[i] * 680 / 1039, f = br(o), w = f ? r.get(f) : void 0;
    if (f && !w) throw Error(`Futureshifted mana asset unavailable: ${f}`);
    w ? (e.drawImage(w, m, g, c, c), /^(?:\d+|X)$/.test(o) && (e.save(), e.translate(m + c / 2 - 0.75 * c / 38.125, g + c / 2 + 1.75 * c / 38.125), e.scale(0.9375, 1), e.font = `700 ${c * 31.25 / 38.125}px "CardRenderer MTG MPlantin"`, e.fillStyle = "#111", e.textAlign = "center", e.textBaseline = "middle", e.fillText(o, 0, 0, c * 0.73), e.restore())) : ee(e, o, m, g, c, r, !1);
  });
}
const Ka = K.MSE_TEMPLATE_ROOT, wa = {
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
function Za(e) {
  const t = O(e);
  return /\bLand\b/.test(e.typeLine ?? "") || e.land ? (t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "c") + "l" : /\bArtifact\b/.test(e.typeLine ?? "") || e.artifact ? "a" : t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "c";
}
function gn(e) {
  if (!e.frameTemplate) return null;
  const t = e.frameTemplate, r = wa[t];
  if (!r) throw Error("Unknown standard frame template");
  if (e.frameAssetFamily) throw Error("Choose one frame template or plate family");
  if (t === "future") return _e(e);
  const a = `${Ka}/${r.style}`, s = Za(t === "flip" ? e.faces?.[0] ?? e : e);
  if (t === "battle")
    return {
      kind: t,
      base: `${a}/cards/${s.replace(/l$/, "")}card.png`,
      defense: `${Ka}/magic-modules.mse-include/loyalty/defense.png`,
      texture: `${a}/cards/texture/${s.replace(/l$/, "")}card.png`,
      border: `${a}/border.png`
    };
  const n = `${a}/${s}card.jpg`;
  if (t === "flip") {
    const o = e.faces?.[1] ?? e, i = e.faces?.[0] ?? e, l = Za(o);
    return {
      kind: t,
      base: n,
      reverse: `${a}/${l}card.jpg`,
      ...i.power != null && i.toughness != null ? { stats: `${a}/${s}pt.jpg`, statsMask: `${a}/mask_pt.png` } : {},
      ...o.power != null && o.toughness != null ? {
        reverseStats: `${a}/${l}pt2.jpg`,
        reverseStatsMask: `${a}/mask_pt2.png`
      } : {}
    };
  }
  throw Error("Unknown standard template asset branch");
}
function Mo(e) {
  const t = gn(e);
  if (!t) return [];
  const { kind: r, ...a } = t;
  return [
    ...Object.values(a).filter((s) => typeof s == "string"),
    ...e.frameTemplate === "future" ? Co(e) : []
  ];
}
function To(e) {
  if (!e.frameTemplate) return null;
  if (e.frameTemplate === "future") {
    const a = fa(e), s = (n) => [n[0] / 488, n[1] / 680, n[2] / 488, n[3] / 680];
    return {
      ...V,
      frame: [0, 0, 1, 1],
      title: s(a.title),
      art: s(a.art),
      type: s(a.type),
      rules: s(a.rules),
      stats: s(a.stats),
      footer: s(a.footer)
    };
  }
  const t = wa[e.frameTemplate];
  if (!t) throw Error("Unknown standard frame template");
  const r = (a) => {
    const [s, n, o, i] = a, [l, d] = t.size;
    return e.frameTemplate === "battle" ? [n / d, 1 - (s + o) / l, i / d, o / l] : [s / l, n / d, o / l, i / d];
  };
  return {
    ...V,
    frame: [0, 0, 1, 1],
    title: r(t.title),
    art: r(t.art),
    type: r(t.type),
    rules: r(t.rules),
    stats: r(t.stats),
    footer: r(t.footer)
  };
}
const xo = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function fn(e) {
  if (!/\bBasic Land\b/.test(e.typeLine ?? "")) return null;
  const t = e.rulesText ?? "", r = /^\(?\{T\}: Add \{([WUBRG])\}\.\)?$/.exec(t);
  if (!r || t.startsWith("(") !== t.endsWith(")")) return null;
  if (e.rulesParagraphs) {
    const a = e.rulesParagraphs;
    if (a.length !== 1 || a[0].role !== "rules" || a[0].align || a[0].runs.length !== 1 || a[0].runs[0].text !== t || !!a[0].runs[0].italic !== t.startsWith("("))
      return null;
  }
  return r[1];
}
function ya(e) {
  if (e.wordingMode === "oracle" || !["mir", "tmp"].includes(e.setCode?.toLowerCase() ?? "")) return null;
  const t = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    e.typeLine ?? ""
  )?.[1];
  if (!t) return null;
  const r = xo[t];
  return fn(e) !== r ? null : {
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
const Io = {
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
}, Bo = {
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
}, jo = {
  "leg-black-U": [177 / 255, 230 / 255, 225 / 255],
  "leg-black-R": [228 / 255, 193 / 255, 147 / 255],
  "leg-black-G": [181 / 255, 217 / 255, 148 / 255],
  "lea-black-U": [149 / 255, 185 / 255, 194 / 255],
  "lea-black-B": [92 / 255, 100 / 255, 101 / 255],
  "lea-black-R": [199 / 255, 152 / 255, 136 / 255],
  "lea-black-G": [148 / 255, 175 / 255, 134 / 255],
  "lea-black-N": [122 / 255, 136 / 255, 139 / 255],
  "3ed-white-G": [186 / 255, 206 / 255, 176 / 255],
  "3ed-white-N": [194 / 255, 190 / 255, 184 / 255],
  "8ed-white-U": [176 / 255, 210 / 255, 227 / 255],
  "8ed-white-N": [178 / 255, 177 / 255, 168 / 255],
  "m21-black-W": [251 / 255, 249 / 255, 218 / 255],
  "m21-black-U": [190 / 255, 221 / 255, 249 / 255],
  "m21-black-R": [237 / 255, 165 / 255, 126 / 255],
  "m21-black-G": [167 / 255, 204 / 255, 172 / 255],
  "leb-black-W": [228 / 255, 228 / 255, 209 / 255],
  "leb-black-U": [163 / 255, 201 / 255, 213 / 255],
  "leb-black-B": [113 / 255, 122 / 255, 121 / 255],
  "leb-black-R": [215 / 255, 170 / 255, 152 / 255],
  "leb-black-G": [175 / 255, 199 / 255, 167 / 255],
  "leb-black-N": [156 / 255, 162 / 255, 162 / 255]
}, $o = {
  "leb/R": { family: "mse-old", pixels: 0.4 }
};
function wr(e, t) {
  if (!(e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode === "oracle"))
    return Io[e.setCode?.toLowerCase() ?? ""]?.[t];
}
function Kr(e, t) {
  const r = wr(e, t), a = r && r !== "modern" && r !== "historic-font" ? Bo[`${t}/${r}`] : void 0, s = $o[`${e.setCode?.toLowerCase()}/${t}`];
  return a && s && s.family === r ? { ...a, inkExpansion: s.pixels } : a;
}
const Go = {
  shadow: [-1.0372, 2.0372],
  paper: [202, 197, 192],
  ink: [13, 15, 15]
};
function pn(e) {
  return !de(e) && e.frameAssetFamily === void 0 && e.frameTemplate === void 0 && (e.layout ?? "normal") === "normal" && !/\b(Saga|Class|Planeswalker|Battle)\b/i.test(e.typeLine ?? "") && !/^Level up\b/m.test(e.rulesText ?? "");
}
function bn(e) {
  return pn(e) ? Go : void 0;
}
function wn(e, t) {
  return bn(e) && /^\d$/.test(t) ? `${L}/img/manaSymbols/${t}.svg` : null;
}
function Se(e) {
  const t = [
    e.rulesText ?? "",
    ...(e.rulesParagraphs ?? []).flatMap((a) => a.runs.map((s) => s.text))
  ], r = /* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...t.flatMap(
      (a) => gr(a).flatMap((s) => s.symbol ? [s.symbol] : [])
    )
  ]);
  return [
    ...(e.manaSymbols ?? []).flatMap((a) => {
      const s = wn(e, a);
      return s ? [s] : [];
    }),
    ...[...r].map(
      (a) => wr(e, a) === "historic-font" ? null : Kr(e, a)?.url ?? gt(a)
    )
  ];
}
function Ut(e) {
  if (e.frameTemplate || !["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "") || e.frameStyle === "modern" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || !(e.land ?? /\bLand\b/.test(e.typeLine ?? "")) || e.layout && e.layout !== "normal")
    return;
  const t = yn(e);
  if (t.length !== 2) return;
  const r = ["WU", "WG", "UG", "BG", "RG"].includes(t.join("")) ? [...t].reverse() : t, a = `${K.RETRO_ROOT}/img/frames/old/abu/`;
  return {
    base: `${a}${r[0].toLowerCase()}l.png`,
    overlay: `${a}${r[1].toLowerCase()}l.png`,
    mask: `${K.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`
  };
}
function yn(e) {
  return e.frameColors ? O(e) : [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(([t]) => new RegExp(`\\b${t}\\b`).test(e.typeLine ?? "")).map(([, t]) => t);
}
const Qa = {
  W: {
    family: "abu",
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
function we(e) {
  if (e.setCode?.toLowerCase() !== "leg" || e.frameTemplate || e.frameStyle === "modern" || e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return;
  const t = e.typeLine ?? "", r = O(e), a = e.land ?? /\bLand\b/.test(t) ? "L" : e.artifact ?? /\bArtifact\b/.test(t) ? "A" : r.length > 1 ? "M" : r[0];
  if (!a || !(a in Qa)) return;
  const s = Qa[a];
  return {
    ...s,
    material: a,
    asset: `${K.RETRO_ROOT}/img/frames/old/${s.family}/${a.toLowerCase()}.png`
  };
}
function pe(e) {
  return e.setCode?.toLowerCase() === "3ed" && !e.frameTemplate && e.frameStyle !== "modern" && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") && (!e.layout || e.layout === "normal") && (e.land ?? /\bLand\b/.test(e.typeLine ?? ""));
}
const Qt = `${K.RETRO_ROOT}/img/frames/old/fourth/l.png`, Eo = [2.404 / 488, 9.9 / 680, 0.984, 0.99], Lo = [
  (2.404 + 0.10533333333333333 * 488 * 0.984) / 488,
  (9.9 + 0.08571428571428572 * 680 * 0.99) / 680,
  0.7926666666666666 * 0.984,
  0.4552380952380952 * 0.99
];
function Ao(e) {
  const t = e.frameColors ?? [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(([r]) => new RegExp(`\\b${r}\\b`).test(e.typeLine ?? "")).map(([, r]) => r);
  return [...new Set(t)].filter((r) => "WUBRG".includes(r)).sort((r, a) => "RBWUG".indexOf(r) - "RBWUG".indexOf(a));
}
const Oo = K.RETRO_SYMBOL_FONT, bt = K.RETRO_ROOT, Do = `${bt}/fonts/goudy-medieval.ttf`, Wo = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), Po = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function de(e) {
  return e.frameTemplate || e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") ? !1 : e.frameStyle === "retro" || e.frameStyle !== "modern" && Wo.has(e.setCode?.toLowerCase() ?? "");
}
function Sa(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function be(e) {
  const t = e.setCode?.toLowerCase() ?? "", r = we(e);
  return r ? r.family : Sa(e) ? "abu" : t === "leg" && O(e).length > 1 ? "legends" : pe(e) || ["3ed", "4ed", "5ed", "atq"].includes(t) && !/\bLand\b/.test(e.typeLine ?? "") ? "fourth" : "seventh";
}
function ka(e) {
  const t = we(e);
  return t ? t.frame : pe(e) ? Eo : be(e) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1];
}
function va(e) {
  const t = Sa(e), r = we(e) && (!e.borderColor || e.borderColor === "black");
  return {
    ...V,
    frame: ka(e),
    title: [t ? 0.07 : 0.1134, 0.0481, t ? 0.8467 : 0.8, 0.043],
    art: we(e)?.art ?? (pe(e) ? Lo : be(e) === "legends" ? [0.112, 0.094, 0.78, 0.45] : be(e) === "fourth" ? [0.109, 0.093, 0.779, 0.453] : t ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429]),
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: r ? [384 / C, 617 / I, 72 / C, 30 / I] : [0.8074, 0.895, 0.1367, 0.043],
    footer: r ? [48 / C, 624 / I, 340 / C, 24 / I] : [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function Ue(e) {
  const t = we(e);
  if (t) return t.asset;
  if (pe(e)) return Qt;
  const r = Ut(e);
  if (r) return r.base;
  const a = O(e), s = e.typeLine ?? "", n = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([d]) => s.includes(d)), o = /\bLand\b/.test(s) ? n.length === 1 ? n[0][1] + "l" : ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "") && e.frameColors?.length === 1 ? e.frameColors[0].toLowerCase() + "l" : "l" : /\bArtifact\b/.test(s) ? "a" : a.length > 1 ? "m" : a[0]?.toLowerCase() ?? "c", i = be(e), l = i === "seventh" || o === "c" || i === "abu" && o === "m" ? "seventh/regular" : `old/${i}`;
  return `${bt}/img/frames/${l}/${i === "legends" ? "legendsFrameM" : o}.png`;
}
function Me(e) {
  return e.borderColor ?? (Po.has(e.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function Br(e) {
  return Me(e) === "silver" ? Re(null, "silver").border : Me(e) === "white" ? Fo : "#080808";
}
function Sn(e) {
  return be(e) === "fourth" ? `${bt}/img/frames/old/fourth/borderBlack.png` : `${bt}/img/frames/${be(e) === "abu" ? "old/abu" : "seventh/regular"}/border.svg`;
}
function es(e) {
  return Sa(e) ? "#ababab" : "#f2eee3";
}
function Uo(e) {
  return e.setCode?.toLowerCase() === "7ed" && O(e).some((t) => t === "W" || t === "G") && !/Land/.test(e.typeLine ?? "") ? "saturate(.7) brightness(.88)" : "none";
}
function Ca(e) {
  if (ya(e)) return null;
  const t = fn(e);
  return t ? `${bt}/img/frames/m15/basics/${t.toLowerCase()}.png` : null;
}
const Fo = "#eeedeb";
function kn(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return !e.setSymbol && t === "ice" && e.setSymbolSource === "keyrune" ? `${K.KEYRUNE_ROOT}/ice2.svg` : !e.setSymbol && so(t, e.name) ? null : Q(e);
}
function Dd(e) {
  const t = (e.rulesText ?? "").length;
  return t > 340 ? 16 : t > 210 ? 19 : 23;
}
function _o(e) {
  const t = Ut(e);
  return [
    Ca(e),
    Ue(e),
    t?.overlay,
    t?.mask,
    !pe(e) && (Me(e) !== "black" || be(e) === "fourth") ? Sn(e) : null,
    e.illustration,
    kn(e),
    ...Se(e)
  ];
}
const ke = ([e, t, r, a]) => [
  e * C,
  t * I,
  r * C,
  a * I
];
function Wd(e, t) {
  return ["7ed", "8ed", "9ed"].includes(e?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(t ?? "") ? "black" : void 0;
}
function xe(e) {
  return e.securityStamp !== void 0 ? e.securityStamp === "oval" : !de(e) && e.frameAssetFamily !== "eighth" && ["rare", "mythic"].includes(e.rarity ?? "");
}
const vn = `${L}/img/frames/m15/holoStamps/stamp.png`, nr = 310.216, ts = {
  frame: [52, 20, 298, 449],
  title: [70, 40, 261, 26],
  art: [65, 76.5, 270, 183.8],
  type: [70, 265, 261, 23],
  rules: [74, 301, 255, 160],
  artistY: 0,
  legalY: 0
}, No = `${L}/img/frames/m15/split`, rs = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style", Cn = [
  `${rs}/namebox/texture/normal/c.png`,
  `${rs}/typebox/texture/normal/c.png`
], Ra = (e) => `${No}${e.layout?.endsWith("-fuse") ? "/fuse" : ""}`;
function Ma(e) {
  const t = O(e);
  return `${Ra(e)}/${t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "a"}.png`;
}
function Rn(e) {
  const t = e.manaSymbols ?? [];
  return t.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !t.some((r) => /^[WUBRG]$/.test(r));
}
function zo(e) {
  const t = O(e);
  return [
    Ma(e),
    ...t.length === 2 ? t.map((r) => `${Ra(e)}/${r.toLowerCase()}.png`) : [],
    ...t.length === 2 && Rn(e) ? Cn : [],
    ...xe(e) ? [vn] : []
  ];
}
const st = /* @__PURE__ */ new Map(), jr = /* @__PURE__ */ new WeakMap();
let Yo = 0, $r = 0;
const Ho = (e) => (jr.has(e) || jr.set(e, ++Yo), jr.get(e));
function Ht(e, t, r, a, s, n) {
  e.moveTo(t + n, r), e.lineTo(t + a - n, r), e.quadraticCurveTo(t + a + n * 0.25, r + s / 2, t + a - n, r + s), e.lineTo(t + n, r + s), e.quadraticCurveTo(t - n * 0.25, r + s / 2, t + n, r), e.closePath();
}
function qo(e, t) {
  const r = (g) => {
    const f = t.get(g);
    if (!f) throw Error(`Modern split asset unavailable: ${g}`);
    return f;
  }, a = r(Ma(e)), s = O(e);
  if (s.length !== 2) return a;
  "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 && s.reverse();
  const n = Rn(e), o = [
    ...s.map((g) => r(`${Ra(e)}/${g.toLowerCase()}.png`)),
    ...n ? Cn.map(r) : [a]
  ], i = s.join("") + (n ? "-hybrid-" : "-gold-") + [a, ...o].map(Ho).join("/"), l = st.get(i);
  if (l)
    return st.delete(i), st.set(i, l), l;
  const d = document.createElement("canvas");
  d.width = a.width, d.height = a.height;
  const c = d.getContext("2d");
  c.scale(d.width / 488, d.height / 680), c.translate(0, 680), c.rotate(-Math.PI / 2);
  const h = (g) => {
    c.save(), c.translate(680, 0), c.rotate(Math.PI / 2), c.drawImage(g, 0, 0, 488, 680), c.restore();
  }, u = e.layout?.endsWith("-fuse") ?? !1;
  h(a);
  for (const g of [0, nr]) {
    if (c.save(), c.beginPath(), n ? c.rect(g + 50, 0, nr, 488) : (Ht(c, g + 57.5, 29, 286, 47, 9), c.rect(g + 64, 74, 273, u ? 362 : 394), Ht(c, g + 57.5, 260, 286, 34, 7)), u)
      for (const [p, b] of [
        [29, 47],
        [260, 34]
      ])
        c.moveTo(334, p), c.lineTo(356, p + b / 2), c.lineTo(378, p), c.lineTo(378, p + b), c.lineTo(356, p + b / 2), c.lineTo(334, p + b), c.closePath();
    c.clip(), h(o[0]);
    const f = document.createElement("canvas");
    f.width = d.width, f.height = d.height;
    const w = f.getContext("2d");
    w.drawImage(o[1], 0, 0, f.width, f.height), w.globalCompositeOperation = "destination-in";
    const y = w.createLinearGradient(
      0,
      (680 - g - 175) / 680 * f.height,
      0,
      (680 - g - 230) / 680 * f.height
    );
    if (y.addColorStop(0, "#0000"), y.addColorStop(1, "#000"), w.fillStyle = y, w.fillRect(0, 0, f.width, f.height), c.save(), c.translate(680, 0), c.rotate(Math.PI / 2), c.drawImage(f, 0, 0, 488, 680), c.restore(), c.restore(), f.width = f.height = 0, c.save(), c.beginPath(), Ht(c, g + 62.5, 34.5, 276, 37.5, 7), Ht(c, g + 62.5, 265, 276, 24, 5), u)
      for (const [p, b] of [
        [35, 37],
        [265, 24]
      ])
        c.moveTo(332, p), c.lineTo(349, p + b / 2), c.lineTo(332, p + b), c.closePath(), c.moveTo(380, p), c.lineTo(363, p + b / 2), c.lineTo(380, p + b), c.closePath();
    c.clip(), n ? (c.drawImage(o[2], 22, 7, 196, 19, g + 62.5, 34.5, 276, 37.5), c.drawImage(o[3], 22, 192, 196, 11, g + 62.5, 265, 276, 24)) : h(o[2]), c.restore();
  }
  const m = d.width * d.height * 4;
  for (const [g, f] of st) {
    if ($r + m <= 16 * 1024 * 1024) break;
    $r -= f.width * f.height * 4, st.delete(g), f.width = f.height = 0;
  }
  return m <= 16 * 1024 * 1024 && (st.set(i, d), $r += m), d;
}
function Ft(e) {
  return ["split", "aftermath"].includes(e.layout ?? "") && e.faces?.length === 2 && (e.layout === "aftermath" || /^Aftermath\b/m.test(e.faces[1].rulesText ?? ""));
}
const Qe = 373, Mn = 257, Tn = `${L}/img/frames/saga/stamp.png`;
function xn(e) {
  const t = O(e), r = t.length > 1 ? "m" : t[0]?.toLowerCase();
  if (!r) throw Error("No validated colorless Aftermath plate is available.");
  return `${L}/img/frames/m15/aftermath/${r}.png`;
}
function Xo(e) {
  return Ft(e) ? [
    ...e.faces.map(xn),
    ...xe(e) ? [Tn] : []
  ] : [];
}
const Ta = {
  title: [41.7, 35.5, 405, 37],
  art: [37.4, 76.5, 413.2, 151.8],
  type: [41.7, 235.8, 405, 37],
  rules: [41.7, 281.5, 405, 76]
}, xa = {
  title: [12, 37.5, 227, 37],
  art: [11, 80.7, 240.9, 137.9],
  // Align the rotated type plate in its reading orientation (all type labels).
  type: [9, 226.2, 230, 37],
  rules: [14, 276.5, 232, 169]
};
function Jo(e) {
  const t = e ? xa : Ta, r = e ? Mn : 488, a = e ? 488 : Qe, s = (n) => {
    const [o, i, l, d] = t[n];
    return [o / r, i / a, l / r, d / a];
  };
  return {
    ...V,
    title: s("title"),
    art: s("art"),
    type: s("type"),
    rules: s("rules"),
    footer: [0, 1, 0, 0]
  };
}
const In = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", Vo = new Set("dis plc cmd pc2 dgm mma c13".split(" "));
function Ge(e) {
  return e.layout !== "split" || e.faces?.length !== 2 || Ft(e) || e.faces.some((t) => !/^(Instant|Sorcery)\b/.test(t.typeLine ?? "")) ? null : de({ ...e, layout: "normal", frameStyle: e.frameStyle ?? e.faces[0]?.frameStyle }) ? "old" : e.frameAssetFamily === "eighth" || Vo.has(e.setCode?.toLowerCase() ?? "") ? "eighth" : "m15";
}
function wt(e) {
  const t = (r) => [
    r.rulesText ?? "",
    ...(r.rulesParagraphs ?? []).map((a) => a.runs.map((s) => s.text).join(""))
  ];
  return [e, ...e.faces ?? []].some((r) => t(r).some((a) => /^Fuse\b/m.test(a)));
}
const Bn = 251 * 680 / 523, as = 680 / 523, or = 488 / 375, Ke = (e, t, r, a) => [
  e * as,
  t * or,
  r * as,
  a * or
];
function vt(e, t) {
  if (e === "m15")
    return t ? { ...ts, rules: [74, 301, 255, 128] } : ts;
  const r = e === "old";
  return {
    frame: Ke(18, 18, t ? 244 : 236, 338),
    title: Ke(r ? 35 : 30, r ? 23 : 28, r ? 207 : 214, 21),
    art: r ? Ke(37, 47, 197, 130) : Ke(27, 56, 217, 152),
    type: Ke(r ? 35 : 30, r ? 182 : 211, 210, r ? 21 : 17),
    rules: r ? Ke(43, 207, 187, 109) : Ke(30, 233, 213, t ? 74 : 95),
    artistY: (r ? 332 : t ? 344 : 339) * or,
    legalY: (r ? 347 : 354) * or
  };
}
function Ko(e) {
  const t = e.layout?.startsWith("split-old") ? "old" : e.layout?.startsWith("split-m15") ? "m15" : "eighth", r = t === "m15" ? nr : Bn, a = vt(t, e.layout?.endsWith("-fuse") ?? !1), s = (n) => [
    n[0] / r,
    n[1] / 488,
    n[2] / r,
    n[3] / 488
  ];
  return {
    ...V,
    frame: s(a.frame),
    title: s(a.title),
    art: s(a.art),
    type: s(a.type),
    rules: s(a.rules),
    footer: [0, 1, 0, 0]
  };
}
function ir(e, t, r, a) {
  if (t === "m15") return Ma(e);
  const s = O(e), n = s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c";
  return `${In}/${t === "old" ? "magic-old-split" : r ? "magic-new-split-fuse" : "magic-new-split"}.mse-style/${n}card${r ? a + 1 : ""}.${r ? "png" : "jpg"}`;
}
function jn(e) {
  for (const t of [e, ...e.faces ?? []]) {
    const r = t.rulesParagraphs?.find(
      (s) => /^Fuse\b/.test(s.runs.map((n) => n.text).join(""))
    );
    if (r) return [r];
    const a = t.rulesText?.split(`
`).find((s) => /^Fuse\b/.test(s));
    if (a) return [{ role: "rules", runs: [{ text: a }] }];
  }
  return [];
}
const qt = `${L}/img/frames/saga`, $n = [
  `${qt}/sagaMaskPinline.png`,
  `${qt}/sagaMaskBanner.png`,
  `${qt}/sagaMaskBannerRight.png`,
  `${qt}/sagaMidStripe.png`
];
function Gn(e) {
  const t = O(e);
  return t.length !== 2 || e.layout === "transform" || e.land || /\bLand\b/.test(e.typeLine ?? "") ? [] : ("WUBRG".indexOf(t[1]) - "WUBRG".indexOf(t[0]) > 2 && t.reverse(), t.map(
    (r) => `${L}/data/images/cardImages/saga/sagaFrame${r}.png`
  ));
}
function Zo(e) {
  const t = Gn(e);
  return t.length ? [...t, ...$n] : [];
}
const ss = /* @__PURE__ */ new WeakMap();
function Qo(e, t, r) {
  const a = Gn(t);
  if (!a.length) return;
  const s = [...a, ...$n].map((S) => {
    const k = r.get(S);
    if (!k) throw Error(`Saga color asset unavailable: ${S}`);
    return k;
  }), n = ss.get(s[0]);
  if (n && n.sources.every((S, k) => S === s[k])) {
    e.drawImage(n.canvas, 0, 0, 488, 680);
    return;
  }
  const [o, i, l, d, c, h] = s, u = document.createElement("canvas");
  u.width = o.width, u.height = o.height;
  const m = document.createElement("canvas");
  m.width = u.width, m.height = u.height;
  const g = document.createElement("canvas");
  g.width = u.width, g.height = u.height;
  const f = u.getContext("2d"), w = m.getContext("2d"), y = g.getContext("2d"), p = u.width, b = u.height;
  y.drawImage(l, 0, 0, p, b), y.drawImage(d, 0, 0, p, b), f.drawImage(o, 0, 0, p, b), f.globalCompositeOperation = "destination-in", f.drawImage(g, 0, 0), f.globalCompositeOperation = "source-over", y.clearRect(0, 0, p, b), y.save(), y.beginPath(), y.rect(p / 2, 0, p / 2, b), y.clip(), y.drawImage(l, 0, 0, p, b), y.restore(), y.drawImage(c, 0, 0, p, b), w.drawImage(i, 0, 0, p, b), w.globalCompositeOperation = "destination-in", w.drawImage(g, 0, 0), f.drawImage(m, 0, 0), f.drawImage(h, 0.0727 * p, 0.3058 * b, 87e-4 * p, 0.4762 * b), ss.set(o, { sources: s, canvas: u }), m.width = m.height = g.width = g.height = 0, e.drawImage(u, 0, 0, 488, 680);
}
const Ot = `${L}/img/frames/saga`;
function En(e) {
  const t = O(e), r = t.length > 1 ? "M" : t[0];
  if (/\bLand\b/.test(e.typeLine ?? "") || e.land) return `${Ot}/regular/l.png`;
  if (e.layout === "transform" && r) return `${Ot}/dfc/${r.toLowerCase()}.png`;
  if (r) return `${L}/data/images/cardImages/saga/sagaFrame${r}.png`;
  throw Error("No ordinary colorless or artifact Saga plate is available.");
}
function Zr(e) {
  return e.layout === "transform" && e.setCode?.toLowerCase() === "neo" ? `${L}/img/frames/m15/transform/icons/fanClosed.svg` : null;
}
const Ln = `${Ot}/sagaChapter.png`, An = `${Ot}/sagaDivider.png`, _t = `${Ot}/stamp.png`;
function ei(e) {
  return [
    En(e),
    ...Zo(e),
    Ln,
    An,
    ...Zr(e) ? [Zr(e)] : [],
    ...xe(e) ? [_t] : []
  ];
}
const On = {
  ...V,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.5007, 0.1134, 0.4233, 0.724],
  type: [0.0854, 0.8481, 0.8292, 0.0543],
  rules: [0.0867, 0.1129, 0.404, 0.7248],
  stamp: [0.17, 0.48, 0.23, 0.16506]
}, yt = `${L}/img/frames/adventure/regular`, Dn = `${yt}/bookLeft.png`, Wn = `${yt}/pinline.svg`, Pn = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style/namebox/texture/normal/c.png", yr = (e) => e.layout === "adventure" && e.faces?.length === 2;
function Fe(e) {
  const t = e.manaSymbols ?? [];
  return O(e).length === 2 && t.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !t.some((r) => /^[WUBRG]$/.test(r));
}
function Ia(e) {
  const t = J(e), r = O(e);
  return t.land ? "l" : t.artifact ? "a" : r.length > 1 ? "m" : r[0]?.toLowerCase() ?? "a";
}
const Qr = (e) => `${yt}/${Ia(e)}.png`;
function Ba(e) {
  const t = Fe(e) ? "W" : Ia(e).toUpperCase();
  return `${L}/img/frames/m15/regular/m15PT${t === "L" ? "C" : t}.png`;
}
const Un = (e) => `${L}/img/frames/m15/crowns/m15Crown${Ia(e).toUpperCase()}.png`;
function Fn(e) {
  const t = e.faces?.[1];
  if (!yr(e) || !t) throw Error("Adventure needs a permanent and an inset spell.");
  const r = (a) => {
    const s = O(a);
    return [
      Qr(a),
      ...s.length === 2 ? s.map((n) => `${yt}/${n.toLowerCase()}.png`) : []
    ];
  };
  return [
    .../* @__PURE__ */ new Set([
      ...r(e),
      ...r(t),
      Dn,
      ...O(e).length === 2 && !Fe(e) ? [Wn] : [],
      ...Fe(e) ? [Pn] : [],
      ...J(e).legendary ? [Un(e)] : [],
      ...e.power != null && e.toughness != null ? [Ba(e)] : [],
      ...xe(e) ? [_t] : []
    ])
  ];
}
const ja = {
  ...V,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.5267, 0.65, 0.3867, 0.2647],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.58, 0.74, 0.25, 0.1794]
}, Sr = `${L}/img/frames/prepare/regular`, $a = (e) => e.layout === "prepare";
function Ct(e) {
  if (e.faces?.length !== 2) throw Error("Prepared needs a creature and an inset spell.");
  return e.faces[1];
}
function Ga(e) {
  const t = J(e), r = O(e);
  if (t.land) return "l";
  if (/\bVehicle\b/.test(e.typeLine ?? "")) return "v";
  if (t.artifact) return "a";
  if (r.length > 1) return "m";
  if (r.length) return r[0].toLowerCase();
  throw Error("The pinned Prepared source has no colorless plate.");
}
const Et = (e) => `${Sr}/${Ga(e)}.png`, er = (e) => `${Sr}/${e}.png`;
function ut(e) {
  const t = O(e);
  return t.length === 2 && "WUBRG".indexOf(t[1]) - "WUBRG".indexOf(t[0]) > 2 && t.reverse(), t;
}
const ea = (e) => `${L}/img/frames/m15/crowns/m15Crown${e.toUpperCase()}.png`, ti = (e) => Ba(e);
function _n(e) {
  const t = Ct(e), r = (s) => ut(s).length === 2 ? ut(s).map((n) => `${Sr}/${n.toLowerCase()}.png`) : [], a = ut(e);
  return [
    .../* @__PURE__ */ new Set([
      Et(e),
      Et(t),
      er("prepare"),
      ...r(e),
      ...r(t),
      ...a.length === 2 ? ["pinline", "rules", "rulesRight"].map(er) : [],
      ...ut(t).length === 2 ? ["prepareRight", "prepareTypeTitle"].map(er) : [],
      ...J(e).legendary ? (a.length === 2 ? a : [Ga(e)]).map(ea) : [],
      ...e.power != null && e.toughness != null ? [ti(e)] : [],
      ...xe(e) ? [_t] : []
    ])
  ];
}
const Ea = {
  ...V,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.086, 0.6303, 808 / 2010, 0.2875],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.17, 0.72, 0.25, 0.1794]
}, ri = {
  title: [1042 / 2010, 0.6391, 0.4, 0.0296],
  type: [1042 / 2010, 1932 / 2814, 0.4, 0.0296],
  rules: [1035 / 2010 + 2 / 488, 2059 / 2814, 0.3947, 438 / 2814]
}, ai = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", ns = {
  "blb/black": 1,
  "blc/black": 1,
  "dft/black": 1,
  "drc/black": 1,
  "dsk/black": 1,
  "ecc/black": 1,
  "eoe/black": 1,
  "fdn/black": 1.5,
  "frc/black": 1.5,
  "hoc/black": 1,
  "iko/black": 0.5,
  "inr/black": 1,
  "j25/black": 1,
  "snc/black": 1,
  "soc/black": 1,
  "tla/black": 1,
  "tmt/black": 1
}, Dt = {
  artInset: 3,
  artRim: 0.75,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function La(e) {
  if (!e.frameAssetFamily && !J(e).legendary && (e.layout ?? "normal") === "normal" && mt === ai) {
    const t = e.borderColor ?? (Re(e.setCode).border === "#eeedeb" ? "white" : "black"), r = `${e.setCode?.toLowerCase() ?? ""}/${t}`;
    if (Object.hasOwn(ns, r)) return ns[r];
  }
  return ["m15", "m19", "m20", "war"].includes(e.setCode?.toLowerCase() ?? "") ? Dt.frameInset : 0;
}
function si(e) {
  const t = La(e), r = V.frame[0] * C, a = V.frame[2] * C, s = V.art[0] * C + Dt.artInset, n = r + t + (s - r) * (1 - 2 * t / a), o = Dt.artRim;
  return [
    n / C,
    V.art[1] + o / I,
    1 - 2 * n / C,
    V.art[3] - 2 * o / I
  ];
}
function Le(e, t) {
  return e.setCode?.toLowerCase() === "plc" && e.frameAssetFamily === "eighth" && !e.frameTemplate && (!e.layout || e.layout === "normal") && (!e.borderColor || e.borderColor === "black") && t.startsWith(`${L}/img/frames/8th/`) && /^(?:[wubrgm]|colorshifted\/[wubrg])\.png$/.test(
    t.slice(`${L}/img/frames/8th/`.length)
  );
}
const ta = (e) => 244 + (e - 244) * 1.006 - 0.5, ra = (e) => 340 + (e - 340) * 1.008 + 0.25;
function Gr([e, t, r, a]) {
  return [ta(e * 488) / 488, ra(t * 680) / 680, r * 1.006, a * 1.008];
}
function Nn(e, t) {
  e.save(), e.beginPath(), e.rect(0, 0, 488, 680), e.rect(22, 22, 444, 636), e.clip("evenodd"), e.drawImage(t, 0, 0, 488, 680), e.restore();
  const r = [22, 28, 460, 466], a = [22, 28, 638, 658], s = [22, ta(28), ta(460), 466], n = [22, ra(28), ra(638), 658];
  for (let o = 0; o < a.length - 1; o++)
    for (let i = 0; i < r.length - 1; i++) {
      const l = r[i], d = a[o], c = s[i], h = n[o];
      e.drawImage(
        t,
        l / 488 * t.width,
        d / 680 * t.height,
        (r[i + 1] - l) / 488 * t.width,
        (a[o + 1] - d) / 680 * t.height,
        c,
        h,
        s[i + 1] - c,
        n[o + 1] - h
      );
    }
}
function zn(e, t) {
  return Le(e, t) ? "CardRenderer MTG ModMatrix" : void 0;
}
function Er(e, t, r, a) {
  if (!Le(t, r)) return;
  const [s, n, o, i, l, d] = a === "artist" ? [77, 634, -1, 3.25, 0.995, 1] : a === "legal" ? [36.5, 647, 4.5, 4.75, 0.995, 1.1] : [407, 627, 2, -2.25, 1.03, 1.01];
  e.translate(s + o, n + i), e.scale(l * d, l), e.translate(-s, -n);
}
let os = null;
function ni(e, t) {
  const r = zn(e, t);
  return !r || e.power == null || e.toughness == null ? Promise.resolve() : os ??= document.fonts.load(`700 29px "${r}"`).then((a) => {
    if (!a.length || a.some((s) => s.status !== "loaded"))
      throw Error("Planar Chaos P/T needs card-glint/magic/fonts.css.");
  }).catch((a) => {
    throw os = null, a;
  });
}
function Yn(e) {
  return ["B", "Colourless", "Land"].includes(J(e).boxes);
}
function Hn(e) {
  return e.frameAssetFamily !== "eighth" || !e.artist ? null : `${L}/img/manaSymbols/${Yn(e) ? "whitebrush" : "brush"}.svg`;
}
function oi(e, t) {
  if (!t.includes("*")) {
    e.fillText(t, 407, 627, 78);
    return;
  }
  const r = t.split(/(\*)/).filter(Boolean), a = r.map((o) => o === "*" ? 15 : e.measureText(o).width), s = a.reduce((o, i) => o + i, 0);
  e.save(), e.translate(407, 0), e.scale(Math.min(1, 78 / s), 1), e.textAlign = "left";
  let n = -s / 2;
  for (const [o, i] of r.entries()) {
    if (i === "*") {
      e.beginPath();
      for (let l = 0; l < 10; l++) {
        const d = -Math.PI / 2 + l * Math.PI / 5, c = l % 2 ? 3.1 : 7.5, h = n + 7.5 + c * Math.cos(d), u = 622 + c * Math.sin(d);
        l === 0 ? e.moveTo(h, u) : e.lineTo(h, u);
      }
      e.closePath(), e.fill();
    } else e.fillText(i, n, 627);
    n += a[o];
  }
  e.restore();
}
function ii(e, t, r, a = "") {
  if (e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.letterSpacing = "0px", t.power != null && t.toughness != null) {
    e.save(), Er(e, t, a, "stats");
    const u = t.frameTreatment === "colorshifted";
    e.fillStyle = u ? "#fff" : "#17140f", u && (e.shadowColor = "#000", e.shadowOffsetX = -21e-4 * 488, e.shadowOffsetY = 15e-4 * 680);
    const m = zn(t, a);
    e.font = `700 29px "${m ?? "CardRenderer MTG Matrix Small Caps"}", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
    const g = `${t.power}/${t.toughness}`;
    m ? e.fillText(g, 407, 627, 78) : oi(e, g), e.restore();
  }
  const s = t.setCode?.toLowerCase(), n = s === "8ed" ? 75 : s === "9ed" ? 79 : 77, o = s === "8ed" || s === "9ed", i = o ? 633 : 634;
  e.fillStyle = Yn(t) ? "#fff" : "#17140f", e.textBaseline = "alphabetic", e.textAlign = "left";
  const l = Hn(t);
  if (l) {
    e.save(), Er(e, t, a, "artist");
    const u = r.get(l);
    if (!u) throw Error(`Eighth Edition artist brush unavailable: ${l}`);
    e.drawImage(u, 36.5, i - 10, n - 39, 13.5), e.font = `700 ${o ? 17.5 : 18}px "CardRenderer MTG Matrix", Georgia`;
    const m = t.power != null && t.toughness != null ? 350 : 448;
    e.fillText(t.artist, n, i, m - n), e.restore();
  }
  const d = ua(t), c = ma(t, !1), h = [d, c].filter(Boolean).join(" ");
  h && (e.save(), Er(e, t, a, "legal"), e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(h, 36.5, i + 13, 409), e.restore()), e.restore();
}
function Aa(e, t) {
  const r = Pt(e)?.toLowerCase();
  return e.setCode?.toLowerCase() === "8ed" && e.frameAssetFamily === "eighth" && !e.frameTemplate && (!e.layout || e.layout === "normal") && (!e.borderColor || e.borderColor === "white") && (e.frameColors === void 0 || e.frameColors.length === 1 && e.frameColors[0]?.toLowerCase() === r) && !!r && t === `${L}/img/frames/8th/${r}l.png`;
}
const aa = (e) => 244 + (e - 244) * 1.004 - 1.25, sa = (e) => 340 + (e - 340) * 1.005 - 0.5;
function li([e, t, r, a]) {
  return [aa(e * 488) / 488, sa(t * 680) / 680, r * 1.004, a * 1.005];
}
function di(e, t) {
  e.save(), e.beginPath(), e.rect(0, 0, 488, 680), e.rect(22, 22, 444, 636), e.clip("evenodd"), e.drawImage(t, 0, 0, 488, 680), e.restore();
  const r = [22, 28, 460, 466], a = [22, 28, 624, 658], s = [22, aa(28), aa(460), 466], n = [22, sa(28), sa(624), 658];
  for (let o = 0; o < a.length - 1; o++)
    for (let i = 0; i < r.length - 1; i++) {
      const l = r[i], d = a[o], c = s[i], h = n[o];
      e.drawImage(
        t,
        l / 488 * t.width,
        d / 680 * t.height,
        (r[i + 1] - l) / 488 * t.width,
        (a[o + 1] - d) / 680 * t.height,
        c,
        h,
        s[i + 1] - c,
        n[o + 1] - h
      );
    }
}
function Ae(e) {
  const t = e.frameTreatment === "colorshifted";
  if (t && e.frameAssetFamily !== "eighth")
    throw Error("Colorshifted treatment requires the eighth frame family.");
  if (!e.frameAssetFamily) return null;
  if (de(e) || e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
    throw Error("Replacement frame plates currently support ordinary modern faces only.");
  const r = e.frameAssetFamily === "eighth", a = J(e), s = Pt(e), n = e.frameColors === void 0 && s ? [s] : O(e), o = n.length === 2 && "WUBRG".indexOf(n[1]) - "WUBRG".indexOf(n[0]) > 2 ? [...n].reverse() : n, i = r ? "8th" : "m15/new", l = `${L}/img/frames/${i}${t ? "/colorshifted" : ""}`, d = a.land ? "l" : a.artifact ? "a" : /\bVehicle\b/.test(e.typeLine ?? "") ? "v" : n.length > 1 ? "m" : n[0]?.toLowerCase() ?? "c";
  if (t && !["w", "u", "b", "r", "g", "a"].includes(d))
    throw Error("Colorshifted plates support monocolored spells and artifacts only.");
  const c = (S) => r ? `${S.toLowerCase()}l` : `l${S.toLowerCase()}`, h = a.land && o.length ? c(o.length > 2 ? "m" : o[0]) : d, u = a.land && o.length === 2 ? c(o[1]) : void 0, m = d === "l" ? r ? "l" : "c" : d, g = r ? [0.09, 0.0629, 0.824, 0.0429] : [168 / 2010, 145 / 2814, 0.8292, 0.0543], f = r ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358] : [168 / 2010, 1588 / 2814, 0.8292, 0.0543], w = `${l}/${h}.png`, y = Aa(e, w), p = Le(e, w), b = (S) => y ? li(S) : p ? Gr(S) : S;
  return {
    frame: w,
    rightFrame: u ? `${l}/${u}.png` : void 0,
    pinlines: p && !t && d === "m" && n.length === 2 ? {
      left: `${l}/${o[0].toLowerCase()}.png`,
      right: `${l}/${o[1].toLowerCase()}.png`,
      mask: `${l}/pinline.png`
    } : void 0,
    border: `${L}/img/frames/${i}/border.png`,
    pt: t ? `${L}/img/frames/m15/colorshifted/${m}pt.png` : r ? `${L}/img/frames/8th/pt/${m === "c" ? "l" : m}.png` : `${L}/img/frames/m15/regular/m15PT${m.toUpperCase()}.png`,
    rects: {
      ...V,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title: p ? Gr(g) : g,
      type: p ? Gr(f) : f,
      art: r ? b([180 / 2010, 341 / 2814, 1656 / 2010, 1216 / 2814]) : [0.0767, 0.1129, 0.8476, 0.4429],
      rules: r ? b([205 / 2010, 1779 / 2814, 1596 / 2010, 729 / 2814]) : [0.086, 1780 / 2814, 0.828, 0.2875],
      stats: t ? [0.7234, 0.881, 0.204, 0.0772] : r ? [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814] : [0.7573, 0.8848, 0.188, 0.0733],
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
function ci(e) {
  const t = Ae(e);
  if (!t) return null;
  const r = Hn(e), a = fr(e);
  return [
    ...a ? [a] : [],
    ...r ? [r] : [],
    t.frame,
    ...t.rightFrame ? [t.rightFrame] : [],
    ...t.pinlines ? Object.values(t.pinlines) : [],
    ...e.power != null && e.toughness != null ? [t.pt] : [],
    ...Re(e.setCode, e.borderColor).border !== "#090806" ? [t.border] : []
  ];
}
function Nt(e) {
  const t = e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "");
  return (t ? (e.rulesText ?? "").replace(/\|(?=\s*[IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*\s*[—–-]\s)/g, `
`) : e.rulesText ?? "").split(`
`).filter((a) => a.trim()).map((a) => {
    const s = t ? a.match(/^\s*([IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*)\s*[—–-]\s*(.+)$/) : null;
    if (s)
      return { text: s[2], badges: s[1].split(/\s*,\s*/), reminder: !1 };
    const n = t ? null : a.match(/^\s*\[?([+−-]?(?:\d+|X))\]?\s*:\s*(.*)$/i);
    return n ? {
      text: n[2],
      badges: [n[1].replace("-", "−").toUpperCase()],
      reminder: !1
    } : { text: a, badges: [], reminder: t && /^\s*\(/.test(a) };
  });
}
function ne(e) {
  return e.layout === "ability" ? "normal" : e.layout === "prepare" ? "prepare" : e.layout === "adventure" && e.faces?.length === 2 ? "adventure" : e.layout === "class" || /\bClass\b/i.test(e.typeLine ?? "") ? "class" : e.layout === "leveler" || /^Level up\b/m.test(e.rulesText ?? "") ? "leveler" : e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "") ? "saga" : e.layout === "planeswalker" || /\bPlaneswalker\b/i.test(e.typeLine ?? "") ? Nt(e).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function Ce(e) {
  const t = To(e);
  if (t) return t;
  if (e.layout === "aftermath-top" || e.layout === "aftermath-bottom")
    return Jo(e.layout === "aftermath-bottom");
  if (/^split-(old|eighth|m15)(-fuse)?$/.test(e.layout ?? "")) return Ko(e);
  const r = Ae(e);
  if (r) return r.rects;
  if (de(e)) return va(e);
  const a = ne(e);
  if (a === "adventure") return ja;
  if (a === "prepare") return Ea;
  if (a === "class")
    return {
      ...V,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (a === "saga") return On;
  if (a.startsWith("planeswalker")) {
    const s = a === "planeswalker-large", n = [
      0.04409,
      s ? 0.55118 : 0.62655,
      0.88827,
      s ? 0.37534 : 0.29997
    ], o = V.stamp[2], i = V.stamp[3];
    return {
      ...V,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, 0.92126 * C * 3793 / 2778 / I],
      frame: [0.04724, 0.02655, 0.91339, 0.91339 * C * 3810 / 2736 / I],
      art: po(s),
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / C,
        (s ? 0.49044 : 0.55793) + 5 / I,
        0.88662,
        0.05737
      ],
      rules: n,
      stats: [0.792 + 1 / C, 0.881 - 3 / I, 0.16, 0.069],
      stamp: [
        n[0] + (n[2] - o) / 2,
        n[1] + (n[3] - i) / 2,
        o,
        i
      ]
    };
  }
  return e.layout === "split-half" ? {
    ...V,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : { ...V, art: si(e) };
}
function hi(e) {
  const t = ne(e) === "saga", r = Ce(e).rules, a = Nt(e), s = r[2] * 488 - (t ? 32 : 70), n = r[3] * 680;
  let o = t ? 21 : 19;
  const i = (w, y) => Math.max(1, Math.ceil(w.length * y * 0.49 / s)), l = (w, y) => Math.max(t ? w.badges.length * 36 : 34, i(w.text, y) * y + 16), d = (w) => a.reduce((y, p) => y + l(p, w), 0);
  for (; o > 8 && d(o) > n; ) o -= 0.5;
  const c = a.map((w) => l(w, o)), h = Math.max(0, n - d(o)) / Math.max(1, a.length);
  let u = n / Math.max(1, a.length), m = n, g = a.length;
  if (!t)
    for (const w of [...c].sort((y, p) => p - y)) {
      if (w <= u) break;
      m -= w, u = m / Math.max(1, --g);
    }
  let f = 0;
  return a.map((w, y) => {
    const p = t ? c[y] + h : Math.max(u, c[y]), b = { ...w, top: f, height: p, font: o, left: t ? 27 : 62, width: s };
    return f += p, b;
  });
}
function qn(e, t, r = 1, a = 1) {
  const s = e.illustrationPlacement;
  if (!s) return t;
  if (!s.every(Number.isFinite) || s[2] <= 0 || s[3] <= 0)
    throw Error("Artwork placement requires finite coordinates and positive dimensions");
  return [s[0] * r, s[1] * a, s[2] * r, s[3] * a];
}
function lr(e, t, [r, a, s, n]) {
  if (!(e > 0 && t > 0)) return [r, a, s, n];
  const o = Math.max(s / e, n / t), i = e * o, l = t * o;
  return [r + (s - i) / 2, a + (n - l) / 2, i, l];
}
function ui(e, t, r, a) {
  const s = [a[0] * e, a[1] * t, a[2] * e, a[3] * t];
  return [...s, ...lr(s[2], s[3], r)];
}
const is = /* @__PURE__ */ new WeakMap();
function mi(e) {
  const t = is.get(e);
  if (t) return t;
  const r = document.createElement("canvas");
  r.width = r.height = 16;
  try {
    const a = r.getContext("2d", { willReadFrequently: !0 });
    a.drawImage(e, 0, 0, 16, 16);
    const s = a.getImageData(0, 0, 16, 16).data, n = [[], [], []];
    for (let i = 0; i < 16; i++)
      for (let l = 0; l < 16; l++) {
        if (l > 0 && l < 15 && i > 0 && i < 15) continue;
        const d = (i * 16 + l) * 4;
        s[d + 3] < 128 || n.forEach((c, h) => c.push(s[d + h]));
      }
    const o = `rgb(${n.map((i) => i.sort((l, d) => l - d)[Math.floor(i.length / 2)] ?? 128).join(" ")})`;
    return is.set(e, o), o;
  } finally {
    r.width = r.height = 0;
  }
}
function ye(e, t, r, a, s) {
  const [n, o, i, l] = a, d = ne(t);
  if (e.save(), d.startsWith("planeswalker") && bo(e, d === "planeswalker-large"), s === "printing") {
    e.clearRect(n, o, i, l), e.restore();
    return;
  }
  const c = r.get(t.illustration ?? "");
  if ((s === "artwork" || d.startsWith("planeswalker") || t.illustrationPlacement) && (e.fillStyle = c && t.illustrationPlacement ? mi(c) : "#80745c", e.fillRect(n, o, i, l)), !c) {
    e.restore();
    return;
  }
  e.beginPath(), e.rect(n, o, i, l), e.clip();
  const h = qn(t, a, 488, 680);
  t.illustrationCrop ? e.drawImage(
    c,
    ...ui(c.width, c.height, h, t.illustrationCrop)
  ) : e.drawImage(c, ...lr(c.width, c.height, h)), e.restore();
}
const ls = /* @__PURE__ */ new WeakMap();
function tr(e) {
  const t = ls.get(e);
  if (t) return t;
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  const a = r.getContext("2d", { willReadFrequently: !0 });
  a.drawImage(e, 0, 0);
  const s = a.getImageData(0, 0, r.width, r.height);
  for (let n = 0; n < s.data.length; n += 4)
    s.data[n + 3] = Math.round(s.data[n] * s.data[n + 3] / 255), s.data[n] = s.data[n + 1] = s.data[n + 2] = 255;
  return a.putImageData(s, 0, 0), ls.set(e, r), r;
}
function gi(e) {
  const t = ie(e) === "full-art", r = J(e), a = !t && (r.land || ie(e) === "regular" && !r.artifact && O(e).length === 0), [s, n, o, i] = t ? [0.9967, 0.9995, -2.125, -0.85] : a ? [0.9976, 0.997, -1.925, -0.3] : [0.9867, 0.9929, 0, -0.175], l = t || a ? [0, 680] : [0, 85, 370, 385, 416, 430, 610, 680], d = t || a ? [0, 0] : [0, 0, 1, 1, 1.45, 1.45, 0, 0];
  return {
    sx: s,
    tx: o,
    source: l,
    target: l.map((c, h) => 340 + (c - 340) * n + i + d[h])
  };
}
function fi(e, t) {
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  const a = r.getContext("2d"), s = gi(t), n = e.height / 680;
  try {
    for (let o = 0; o < s.source.length - 1; o++) {
      const i = s.source[o], l = s.source[o + 1], d = s.target[o], c = s.target[o + 1], h = (c - d) / (l - i), u = Math.round(d * n), m = Math.round(c * n);
      a.save(), a.beginPath(), a.rect(0, u, r.width, m - u), a.clip(), a.transform(
        s.sx,
        0,
        0,
        h,
        (244 * (1 - s.sx) + s.tx) * n,
        (d - h * i) * n
      ), a.drawImage(e, 0, 0), a.restore();
    }
    return r;
  } catch (o) {
    throw r.width = r.height = 0, o;
  }
}
function Wt(e, t) {
  const r = document.createElement("canvas");
  return r.width = e, r.height = t, r;
}
function pi(e, t) {
  const r = Wt(e.width, e.height), a = r.getContext("2d"), s = Wt(e.width, e.height), n = s.getContext("2d");
  for (const [o, i] of [e, t].entries()) {
    n.clearRect(0, 0, s.width, s.height), n.globalCompositeOperation = "source-over", n.drawImage(i, 0, 0, s.width, s.height);
    const l = n.createLinearGradient(s.width * 0.4, 0, s.width * 0.6, 0);
    l.addColorStop(0, o ? "#0000" : "#000"), l.addColorStop(1, o ? "#000" : "#0000"), n.globalCompositeOperation = "destination-in", n.fillStyle = l, n.fillRect(0, 0, s.width, s.height), a.globalCompositeOperation = "lighter", a.drawImage(s, 0, 0);
  }
  return s.width = s.height = 0, r;
}
function bi(e, t) {
  const r = _e(e), a = Wt(976, 1360), s = a.getContext("2d"), n = (l) => {
    const d = t.get(l);
    if (!d) throw Error(`Futureshifted frame asset unavailable: ${l}`);
    return d;
  }, o = (l, d, c, h) => {
    if (!d) return n(l);
    const u = pi(n(l), n(d));
    if (c && h) {
      const m = u.getContext("2d");
      m.globalCompositeOperation = "destination-in", m.drawImage(tr(n(h)), 0, 0, u.width, u.height), m.globalCompositeOperation = "destination-over", m.drawImage(n(c), 0, 0, u.width, u.height);
    }
    return u;
  }, i = (l, d, c, h, u) => {
    s.drawImage(l, d, c, h, u), l instanceof HTMLCanvasElement && (l.width = l.height = 0);
  };
  try {
    if (s.scale(976 / 375, 1360 / 523), i(
      o(r.base, r.reverseBase, r.neutralBase, r.baseBlend),
      0,
      0,
      375,
      523
    ), r.mask) {
      s.save(), s.globalCompositeOperation = "destination-out";
      const l = ie(e) === "full-art";
      if (!l && ie(e) !== "clear") {
        const [, m, , g] = fa(e).art;
        s.beginPath(), s.rect(0, m * 523 / 680, 375, g * 523 / 680), s.clip();
      }
      const [d, c, h, u] = l ? [37, 46, 322, 418] : [32, 44, 327, 310];
      s.drawImage(tr(n(r.mask)), d, c, h, u), s.restore();
    }
    if (r.paper && i(o(r.paper, r.reversePaper), 23, 320, 335, 152), r.type && i(
      o(r.type, r.reverseType, r.neutralType, r.typeBlend),
      18,
      17,
      339,
      464
    ), r.stats)
      if (r.statsMask) {
        const l = Wt(156, 102), d = l.getContext("2d");
        d.drawImage(n(r.stats), 0, 0, 156, 102), d.globalCompositeOperation = "destination-in", d.drawImage(tr(n(r.statsMask)), 0, 0, 156, 102), i(l, 279, 454, 78, 51);
      } else r.paper ? s.drawImage(n(r.stats), 285, 452, 70, 52) : s.drawImage(n(r.stats), 375 * 0.7621, 523 * 0.8834, 375 * 0.1734, 523 * 0.0781);
    return fi(a, e);
  } finally {
    a.width = a.height = 0;
  }
}
function wi(e, t) {
  const r = Wt(e.width, e.height), a = r.getContext("2d");
  return a.fillStyle = "white", ie(t) === "clear" ? a.fillRect(46, 44, 442 * 2, 637 * 2) : (a.fillRect(48, 160, 444 * 2, (ie(t) === "full-art" ? 482 : 303) * 2), a.globalCompositeOperation = "destination-out", a.drawImage(e, 0, 0)), r;
}
const na = (e, t = !1) => `${t ? "italic " : ""}${e}px "CardRenderer MTG MPlantin", Georgia`;
function yi(e) {
  const t = [];
  let r = [], a = !1;
  const s = () => {
    r.length && (t.push({ pieces: r, space: a }), r = [], a = !1);
  };
  for (const n of e)
    for (const o of gr(n.text))
      if (o.symbol) r.push({ text: o.symbol, symbol: !0, italic: !1 });
      else
        for (const i of o.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(i) ? (s(), i === `
` ? (t.push({ pieces: [], space: !1, newline: !0 }), a = !1) : a = !0) : r.push({ text: i, symbol: !1, italic: !!n.italic });
  return s(), t;
}
function Ze(e, t, r) {
  const a = [];
  for (const s of t) {
    const n = s.symbol ? s : { ...s, text: s.text.replaceAll("­", "") };
    if (!n.text) continue;
    const o = a.at(-1);
    o && !o.symbol && !n.symbol && o.italic === n.italic ? o.text += n.text : a.push({ ...n });
  }
  return a.map((s) => {
    e.font = na(r, s.italic);
    const n = e.measureText(s.text);
    return {
      ...s,
      size: r,
      width: s.symbol ? r * 0.88 : n.width,
      ascent: s.symbol ? r * 0.72 : n.actualBoundingBoxAscent,
      descent: s.symbol ? r * 0.08 : n.actualBoundingBoxDescent,
      inkLeft: s.symbol ? r * 0.025 : -n.actualBoundingBoxLeft,
      inkRight: s.symbol ? r * 0.825 : n.actualBoundingBoxRight
    };
  });
}
function Si(e, t, r, a, s) {
  let n = null;
  for (let o = 0; o < r.length; o++) {
    const i = r[o];
    if (!i.symbol)
      for (let l = 0; l < i.text.length; l++) {
        if (i.text[l] !== "­" || ![...r.slice(0, o), { ...i, text: i.text.slice(0, l) }].some(
          (h) => h.text.replaceAll("­", "").length
        ))
          continue;
        const d = [...r.slice(0, o), { ...i, text: i.text.slice(0, l) + "-" }], c = [{ ...i, text: i.text.slice(l + 1) }, ...r.slice(o + 1)];
        c.some((h) => h.text.replaceAll("­", "").length) && Ze(e, [...t, ...d], s).reduce((h, u) => h + u.width, 0) <= a && (n = { head: d, tail: c });
      }
  }
  return n;
}
function Xn(e, t, r, a) {
  const s = [];
  let n = [];
  for (const o of t) {
    if (o.newline) {
      s.push(Ze(e, n, a)), n = [];
      continue;
    }
    let i = o.pieces, l = n.length && o.space ? [{ text: " ", italic: o.pieces[0]?.italic ?? !1, symbol: !1 }] : [];
    for (; ; ) {
      if (Ze(e, [...n, ...l, ...i], a).reduce((h, u) => h + u.width, 0) <= r) {
        n.push(...l, ...i);
        break;
      }
      const c = Si(e, [...n, ...l], i, r, a);
      if (c)
        s.push(Ze(e, [...n, ...l, ...c.head], a)), n = [], l = [], i = c.tail;
      else if (n.length)
        s.push(Ze(e, n, a)), n = [], l = [];
      else {
        n.push(...i);
        break;
      }
    }
  }
  return n.length && s.push(Ze(e, n, a)), s;
}
function ds(e, t, r, a) {
  const s = Xn(e, t, r, a);
  if (s.length < 2) return s;
  const n = /* @__PURE__ */ new Map(), o = (h, u) => {
    const m = `${h}:${u}`;
    let g = n.get(m);
    if (!g) {
      const f = [];
      for (let w = h; w < u; w++) {
        const y = t[w];
        w > h && y.space && f.push({ text: " ", italic: y.pieces[0]?.italic ?? !1, symbol: !1 }), f.push(...y.pieces);
      }
      g = Ze(e, f, a), n.set(m, g);
    }
    return g;
  }, i = /* @__PURE__ */ new Map(), l = (h, u) => {
    if (!u) return h === t.length ? { cost: 0, cuts: [] } : null;
    const m = `${h}:${u}`;
    if (i.has(m)) return i.get(m);
    let g = null;
    for (let f = h + 1; f <= t.length - u + 1; f++) {
      const w = o(h, f).reduce((b, S) => b + S.width, 0);
      if (w > r) break;
      const y = l(f, u - 1);
      if (!y) continue;
      const p = y.cost + (r - w) ** 2;
      (!g || p < g.cost) && (g = { cost: p, cuts: [f, ...y.cuts] });
    }
    return i.set(m, g), g;
  }, d = l(0, s.length);
  if (!d) return s;
  let c = 0;
  return d.cuts.map((h) => {
    const u = o(c, h);
    return c = h, u;
  });
}
function cs(e, t, r, a, s = !1) {
  const n = yi(t);
  if (!s || n.length > 64 || t.some((l) => l.text.includes("­")))
    return Xn(e, n, r, a);
  const o = [];
  let i = [];
  for (const l of n)
    l.newline ? (o.push(...i.length ? ds(e, i, r, a) : [[]]), i = []) : i.push(l);
  return i.length && o.push(...ds(e, i, r, a)), o;
}
const ki = new Set(
  "mir vis 5ed wth tmp sth exo usg ulg 6ed uds mmq nem pcy inv pls 7ed apc ody tor jud ons lgn scg por p02 ptk".split(
    " "
  )
);
function vi(e) {
  return ki.has(e?.toLowerCase() ?? "");
}
function Ci(e) {
  if (e.role !== "flavor" || e.align !== void 0) return [e];
  const t = e.runs.map((o) => o.text).join(""), r = [...t.matchAll(/(?:^|\n)[^\S\n]*(?:—|–|--)[^\S\n]*(?=\S)/g)].at(-1);
  if (!r) return [e];
  const a = r.index, s = a + (t[a] === `
` ? 1 : 0), n = (o, i) => {
    let l = 0;
    return e.runs.flatMap((d) => {
      const c = d.text.slice(Math.max(0, o - l), Math.max(0, i - l));
      return l += d.text.length, c ? [{ ...d, text: c }] : [];
    });
  };
  return [
    ...a ? [{ ...e, runs: n(0, a) }] : [],
    { ...e, align: "right", runs: n(s, t.length) }
  ];
}
const dr = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function Y(e, t, r, a = 24, s = 15, n = dr) {
  e.save(), e.letterSpacing = "0px", e.textBaseline = "alphabetic", e.textAlign = "left";
  try {
    const o = n.flavorAttribution === "right" ? t.flatMap(Ci) : t;
    let i, l = a;
    do {
      const d = [], c = [];
      let h = 0, u;
      for (const k of o) {
        let v = l, R = cs(
          e,
          k.runs,
          r.width,
          v,
          n.balanceLines && (!n.balanceCenteredOnly || k.align === "center")
        );
        if (k.role === "flavor" && n.flavorOrphans !== !1 && R.length > 2 && R.at(-1).reduce((M, T) => M + T.width, 0) < r.width * 0.3)
          for (let M = v - 0.25; M >= v * 0.94; M -= 0.25) {
            const T = cs(
              e,
              k.runs,
              r.width,
              M,
              n.balanceLines && (!n.balanceCenteredOnly || k.align === "center")
            );
            if (T.length < R.length) {
              v = M, R = T;
              break;
            }
          }
        if (R.length) {
          u && (u === "rules" && k.role === "flavor" ? h += l * n.flavorGap : (u !== "flavor" || k.role !== "flavor") && (h += l * n.paragraphGap));
          for (const M of R) {
            const T = Math.max(0, ...M.map((W) => W.ascent)), x = Math.max(0, ...M.map((W) => W.descent)), B = M.reduce((W, re) => W + re.width, 0), A = r.x + (k.align === "right" ? r.width - B : k.align === "center" ? (r.width - B) / 2 : 0);
            let j = 0, E = 1 / 0, P = -1 / 0;
            for (const W of M)
              E = Math.min(E, j + W.inkLeft), P = Math.max(P, j + W.inkRight), j += W.width;
            d.push({
              x: A,
              runs: M,
              role: k.role,
              baseline: h,
              width: B,
              inkBounds: [
                A + (M.length ? E : 0),
                h - T,
                M.length ? P - E : 0,
                T + x
              ]
            }), h += v * n.leading;
          }
          u = k.role;
        }
      }
      if (n.flavorSeparator !== !1)
        for (let k = 1; k < d.length; k++) {
          const v = d[k - 1], R = d[k];
          if (v.role !== "rules" || R.role !== "flavor") continue;
          const M = v.inkBounds[1] + v.inkBounds[3];
          c.push((M + R.inkBounds[1]) / 2 - 0.3);
        }
      const m = d[0]?.inkBounds[1] ?? 0, g = d.at(-1)?.inkBounds, f = g ? g[1] + g[3] - m : 0, w = Math.max(0, r.height - f), y = r.y + Math.max(0, Math.min(w, w / 2 + (n.centerOffset ?? 0))), p = Math.max(r.y, r.verticalLimits?.[0] ?? r.y), b = Math.min(
        r.y + r.height,
        r.verticalLimits?.[1] ?? r.y + r.height
      ), S = Math.max(p, Math.min(b - f, y)) - m;
      if (i = {
        size: l,
        x: r.x,
        top: m + S,
        width: r.width,
        height: f,
        overflow: f > b - p + 0.01 || d.some((k) => k.width > r.width + 0.01),
        lines: d.map((k) => ({
          ...k,
          baseline: k.baseline + S,
          inkBounds: [
            k.inkBounds[0],
            k.inkBounds[1] + S,
            k.inkBounds[2],
            k.inkBounds[3]
          ]
        })),
        separators: c.map((k) => k + S)
      }, i.overflow ||= i.lines.some(
        (k) => r.exclusions?.some(([v, R, M, T]) => {
          const [x, B, A, j] = k.inkBounds;
          return x < v + M && x + A > v && B < R + T && B + j > R;
        })
      ), !i.overflow || l <= s) break;
      l = Math.max(s, l - 0.25);
    } while (!0);
    return i;
  } finally {
    e.restore();
  }
}
function Ri(e, t, r) {
  const [a, s, n, o] = r, i = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((l) => ({ role: "rules", runs: [{ text: l }] }));
  return Y(
    e,
    i,
    { x: a - 0.375, y: s, width: n, height: o },
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
function Rt(e, t, r, a, s, n, o, i, l = 1 / 0) {
  const d = (m) => (m.align === void 0 || m.align === "center") && m.runs.length > 0 && m.runs.every((g) => !g.text.includes(`
`));
  if (!r.length || !r.every(d) || !t.every(d)) return null;
  const c = r.map((m) => m.runs.map((g) => g.text).join("")).join(`
`);
  if (Array.from(c.replace(/\{[^}]+\}/g, "●")).length > l) return null;
  const h = (m) => m.map((g) => ({ ...g, align: "center" })), u = Y(e, h(r), a, s, s, i);
  return u.overflow || u.lines.length > o ? null : Y(e, h(t), a, s, n, i);
}
const St = {
  ordinary: [0.436 * 488, 0.9034 * 680, 0.128 * 488, 0.0458 * 680],
  planeswalker: [0.4394 * 488, 0.9015 * 680, 0.1214 * 488, 0.051 * 680],
  saga: [213.7, 620.2, 60.5, 25.3],
  aftermath: [222, 623, 43, 20],
  split: [223.5, 620, 43, 21.5]
}, Pd = {
  ordinary: { size: [192, 96], interior: [29, 29, 134, 67] },
  planeswalker: { size: [182, 107], interior: [24, 26, 134, 67] },
  saga: { size: [186, 78], interior: [26, 11, 134, 67] },
  plain: { size: [134, 67], interior: [0, 0, 134, 67] }
};
function et(e) {
  if (!xe(e) || de(e) || e.frameAssetFamily === "eighth" || e.frameTemplate || e.faces?.length || e.layout && !["normal", "planeswalker", "transform", "modal_dfc", "meld"].includes(e.layout))
    return null;
  const t = ne(e), r = t.startsWith("planeswalker");
  if (t !== "normal" && !r) return null;
  const a = J(e), s = a.boxes === "Gold" ? "M" : a.boxes === "Artifact" ? "A" : a.boxes === "Land" ? "L" : a.boxes === "Colourless" ? r ? "A" : "C" : a.boxes, n = O(e);
  n.length === 2 && "WUBRG".indexOf(n[1]) - "WUBRG".indexOf(n[0]) > 2 && n.reverse();
  const o = n.length > 2 ? ["M"] : n.length ? n : [s], i = (l) => r ? `${L}/img/frames/planeswalker/holo/${l.toLowerCase()}.png` : `${L}/img/frames/m15/holoStamps/m15HoloStamp${l}.png`;
  return {
    image: i(o[0]),
    ...o.length === 2 ? { rightImage: i(o[1]) } : {},
    rect: r ? St.planeswalker : St.ordinary
  };
}
function Jn(e, t, r) {
  const a = et(t);
  if (!a) return;
  const s = r.get(a.image);
  if (!s) throw Error("Authenticity stamp asset is unavailable.");
  e.save(), e.shadowColor = "transparent", e.drawImage(s, ...a.rect), e.restore();
}
const Mi = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function Ti(e) {
  return !Mi.has(e?.trim().toLowerCase() ?? "");
}
function xi(e, t, r) {
  if (e.setCode?.toLowerCase() !== "plc" || e.frameAssetFamily !== "eighth" || e.frameTemplate || e.layout && e.layout !== "normal")
    return t;
  const a = Ae(e);
  if (!a || !Le(e, a.frame) || !t.lines.length)
    return t;
  let s = 0;
  const n = t.lines.map((u, m) => {
    if (m) {
      const g = t.lines[m - 1], f = g.runs[0]?.size ?? t.size, w = u.baseline - g.baseline - f, y = g.role === "rules" && u.role === "flavor" ? 0.625 / 0.9 : 0.4375 / 0.45;
      s += f * (0.965 - 1) + w * (y - 1);
    }
    return {
      ...u,
      x: (u.x ?? t.x) + 2.25,
      baseline: u.baseline + s,
      inkBounds: [
        u.inkBounds[0] + 2.25,
        u.inkBounds[1] + s,
        u.inkBounds[2],
        u.inkBounds[3]
      ]
    };
  }), o = n[0], i = n.at(-1), l = i.inkBounds[1] + i.inkBounds[3] - o.inkBounds[1], d = r.y + Math.max(0, (r.height - l) / 2), c = d - o.inkBounds[1], h = n.map((u) => ({
    ...u,
    baseline: u.baseline + c,
    inkBounds: [
      u.inkBounds[0],
      u.inkBounds[1] + c,
      u.inkBounds[2],
      u.inkBounds[3]
    ]
  }));
  return l > r.height + 0.01 || h.some(
    (u) => r.exclusions?.some(([m, g, f, w]) => {
      const [y, p, b, S] = u.inkBounds;
      return y < m + f && y + b > m && p < g + w && p + S > g;
    })
  ) ? t : { ...t, x: t.x + 2.25, top: d, height: l, lines: h };
}
function Vn(e, t, r = I, a = 1) {
  const s = Ce(t), n = {
    ...dr,
    flavorSeparator: t.frameAssetFamily === "eighth" ? !1 : Ti(t.setCode)
  }, [o, i, l, d] = s.rules, c = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((f) => ({ role: "rules", runs: [{ text: f }] })), h = et(t), u = {
    x: o * C + (t.frameAssetFamily ? 0 : 3.5),
    y: i * r + (t.frameAssetFamily ? 0 : 7),
    width: l * C - (t.frameAssetFamily ? 0 : 9.5),
    height: d * r - (t.frameAssetFamily ? 0 : 8),
    // Fit actual line ink around the existing power/toughness plate. Short
    // final lines can use the lower left area without being painted over.
    exclusions: [
      ...t.power != null && t.toughness != null ? [
        [
          s.stats[0] * C - 2,
          s.stats[1] * r - 2,
          s.stats[2] * C + 4,
          s.stats[3] * r + 4
        ]
      ] : [],
      ...h ? [
        [
          h.rect[0] - 1,
          (h.rect[1] - 1) * r / I,
          h.rect[2] + 2,
          (h.rect[3] + 2) * r / I
        ]
      ] : []
    ]
  }, m = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? c : c;
  if (t.rulesAlignment?.mode !== "left" && ["10e", "m10", "m11", "m12", "m13", "m14"].includes(t.setCode?.toLowerCase() ?? "") && m.every((f) => f.role === "rules")) {
    const f = Rt(
      e,
      c,
      m,
      u,
      24.5 * a,
      15 * a,
      3,
      { ...n, balanceLines: !0 }
    );
    if (f) return f;
  }
  const g = Y(
    e,
    t.rulesAlignment?.mode === "left" ? c.map((f) => f.role === "rules" ? { ...f, align: "left" } : f) : c,
    u,
    24.5 * a,
    15 * a,
    n
  );
  return xi(t, g, u);
}
function he(e, t, r, a = ee, s = 0, n = "#17140f") {
  if (t.overflow) throw Error("Magic rules text does not fit the available area.");
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", e.letterSpacing = "0px";
  for (const l of t.separators) {
    const d = e.createLinearGradient(t.x, l, t.x + t.width, l);
    d.addColorStop(0, "#17140f00"), d.addColorStop(0.15, "#17140f55"), d.addColorStop(0.85, "#17140f55"), d.addColorStop(1, "#17140f00"), e.fillStyle = d, e.fillRect(t.x, l, t.width, 0.6);
  }
  e.fillStyle = n;
  const o = s > 0 ? document.createElement("canvas") : null;
  o && (o.width = e.canvas.width, o.height = e.canvas.height);
  const i = o ? o.getContext("2d") : e;
  if (!i) throw Error("Missing rules text context");
  o && (i.setTransform(e.getTransform()), i.textAlign = "left", i.textBaseline = "alphabetic", i.letterSpacing = "0px", i.fillStyle = n);
  for (const l of t.lines) {
    let d = l.x ?? t.x;
    for (const c of l.runs)
      c.symbol ? a(
        e,
        c.text,
        d + c.size * 0.025,
        l.baseline - c.size * 0.72,
        c.size * 0.8,
        r
      ) : (i.font = na(c.size, c.italic), i.fillText(c.text, d, l.baseline)), d += c.width;
  }
  if (o) {
    i.globalCompositeOperation = "destination-out", i.lineJoin = "round";
    for (const l of t.lines) {
      let d = l.x ?? t.x;
      for (const c of l.runs)
        c.symbol || (i.font = na(c.size, c.italic), i.lineWidth = c.size * s * 2, i.strokeText(c.text, d, l.baseline)), d += c.width;
    }
    e.resetTransform(), e.drawImage(o, 0, 0), o.width = o.height = 0;
  }
  e.restore();
}
function Ii(e) {
  const t = ie(e);
  if (e.setCode?.toLowerCase() !== "fut" || t === "clear") return;
  const r = Q(e), a = K.CONJURER_ROOT + "/img/setSymbols/official/fut-";
  if (!["c", "u", "r"].some((l) => r === a + l + ".svg")) return;
  const [s, n, o, i] = t === "full-art" ? [443.5625, 581.8125, 28.1875, 20.976866533333336] : _e(e).base.includes("/future/regular/futureFrame") ? [443.5, 405.125, 29, 21.851866533333336] : [443.5, 405.5, 27.875, 22.226866533333336];
  return [s - o / 2, n - i / 2, o, i];
}
function Bi(e, t, r, a, s) {
  if (ie(t) === "full-art" && (t.rulesParagraphs?.some((h) => h.runs.some((u) => u.text.trim())) || !t.rulesParagraphs && t.rulesText?.trim()))
    throw Error("Futureshifted full-art treatment has no rules panel for the supplied wording");
  const n = bi(t, r), o = wi(n, t), i = fa(t), l = _e(t), d = J(t), c = un(t);
  e.save();
  try {
    if (a || (e.fillStyle = "#080808", e.fillRect(0, 0, 488, 680)), s && e.drawImage(s, 0, 0, 488, 680), a !== "printing") {
      const v = document.createElement("canvas");
      v.width = 976, v.height = 1360;
      try {
        const R = v.getContext("2d");
        R.scale(2, 2);
        const M = ie(t) === "clear" ? [23, 22, 442, 637] : i.art;
        ye(R, t, r, M, "artwork"), R.globalCompositeOperation = "destination-in", R.drawImage(o, 0, 0, 488, 680), e.drawImage(v, 0, 0, 488, 680);
      } finally {
        v.width = v.height = 0;
      }
    }
    if (a === "artwork") return;
    e.drawImage(n, 0, 0, 488, 680), l.typeSymbol && e.drawImage(r.get(l.typeSymbol), 31.2, 31.2, 27.3, 26), e.shadowColor = "transparent", Ro(e, t, r);
    const h = c.length === 1 && c[0] !== "W", u = (v, R, M, T) => {
      e.textAlign = "left", e.textBaseline = "middle", te(
        e,
        v,
        R[0] + 1.25,
        R[1] + R[3] / 2 + T,
        R[2],
        M,
        !0,
        1,
        "CardRenderer MTG Matrix"
      );
    };
    e.fillStyle = h ? "#fff" : "#111", u(t.name, i.title, 30.248, 1.25), u(t.typeLine ?? "", i.type, 24.969, -1.5);
    const m = d.land && c.length === 2 && !c.includes("W") ? "#fff" : "#111";
    ie(t) !== "full-art" && he(e, Ri(e, t, i.rules), r, void 0, 0, m), t.power != null && t.toughness != null && (e.fillStyle = h ? "#fff" : "#111", e.textAlign = "center", e.textBaseline = "middle", e.font = '700 29.97px "CardRenderer MTG Matrix Small Caps"', e.save(), e.translate(i.stats[0] + i.stats[2] / 2 - 1.5, i.stats[1] + i.stats[3] / 2 - 0.25), e.scale(0.99, 1), e.fillText(`${t.power}/${t.toughness}`, 0, 0, i.stats[2] / 0.99), e.restore());
    const g = r.get(Q(t) ?? "");
    if (g) {
      const [v, R, M, T] = i.symbol, x = Math.min(M / g.width, T / g.height), B = Ii(t) ?? [
        v + (M - g.width * x) / 2,
        R + (T - g.height * x) / 2,
        g.width * x,
        g.height * x
      ];
      e.drawImage(g, B[0], B[1], B[2], B[3]);
    }
    e.fillStyle = d.land || h ? "#fff" : "#111", e.textAlign = "right", e.textBaseline = "alphabetic";
    const f = t.power != null && t.toughness != null ? 361 : 442, w = ie(t) === "full-art", y = w ? 16.6 : 17.845, p = w ? 627 : 626.5;
    e.font = `400 ${y}px "CardRenderer MTG Matrix"`;
    const b = t.artist ?? "";
    e.fillText(b, f, p, f - 70);
    const S = l.brush ? r.get(l.brush) : void 0;
    S && e.drawImage(S, f - e.measureText(b).width - 40, p - 10, 36, 8);
    const k = ua(t);
    k && (e.font = '11.804px "CardRenderer MTG MPlantin"', e.fillText(
      [k, ma(t, !1)].filter(Boolean).join(" "),
      f - 0.25,
      641.25,
      f - 40
    ));
  } finally {
    n.width = n.height = o.width = o.height = 0, e.restore();
  }
}
const kt = 96 / 72;
function Lt(e, t, r, a, s) {
  const [n, o, i, l] = r;
  e.textAlign = "left", e.textBaseline = "middle", te(
    e,
    t,
    n,
    o + l / 2,
    i,
    a * kt,
    s !== "CardRenderer MTG Matrix",
    1,
    s
  );
}
function Kn(e, t, r, a, s, n) {
  const o = t.manaSymbols ?? [], i = n + 1;
  return o.forEach(
    (l, d) => ee(e, l, a - o.length * i + d * i, s, n, r, !0)
  ), o.length * i;
}
function Zn(e, t, r, a, s, n, o = "#17140f") {
  const [i, l, d, c] = a, h = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((m) => ({ role: "rules", runs: [{ text: m }] })), u = Y(e, h, { x: i, y: l, width: d, height: c }, s * kt, n * kt, {
    leading: 0.95,
    paragraphGap: 0.4,
    flavorGap: 0.5,
    flavorOrphans: !1
  });
  if (u.overflow) throw Error("Standard template text exceeds its minimum readable size.");
  he(e, u, r, void 0, 0, o);
}
function Qn(e, t, r, a, s) {
  if (t.power == null || t.toughness == null) return;
  const [n, o, i, l] = r;
  e.font = `bold ${a * kt}px "${s}", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(`${t.power}/${t.toughness}`, n + i / 2, o + l / 2, i);
}
function e0(e, t, r, a) {
  const [s, n, o] = r;
  e.fillStyle = a, e.textAlign = "left", e.textBaseline = "top", e.font = `${10 * kt}px "CardRenderer MTG Matrix", Georgia`, e.fillText(t.artist ?? "", s, n, o), t.legalText && (e.font = `${6.5 * kt}px "CardRenderer MTG MPlantin", Georgia`, e.fillText(t.legalText, s, n + 14, o));
}
function ji(e, t, r, a, s) {
  if (t.faces?.length !== 2) throw Error("A flip template needs exactly two printed panels.");
  const n = t.faces[0], o = t.faces[1];
  if (s !== "artwork")
    for (const [c, h] of [a.base, a.reverse].entries()) {
      const u = r.get(h);
      if (!u) throw Error(`Flip frame unavailable: ${h}`);
      e.save(), c && (e.beginPath(), e.rect(0, 344, 375, 179), e.clip()), e.drawImage(u, 0, 0, 375, 523), e.restore();
    }
  if (ye(e, t, r, [32, 162, 311, 182], s), s === "artwork") return;
  for (const [c, h, u] of [
    [a.stats, a.statsMask, [285, 123, 70, 38]],
    [a.reverseStats, a.reverseStatsMask, [18, 342, 70, 38]]
  ]) {
    if (!c || !h) continue;
    const m = r.get(c), g = r.get(h);
    if (!m || !g) throw Error("Missing flip statistics plate");
    const f = document.createElement("canvas");
    f.width = 140, f.height = 76;
    const w = f.getContext("2d");
    w.drawImage(m, 0, 0, 140, 76), w.globalCompositeOperation = "destination-in", w.drawImage(tr(g), 0, 0, 140, 76), e.drawImage(f, u[0], u[1], u[2], u[3]), f.width = f.height = 0;
  }
  e.shadowColor = "transparent", e.fillStyle = "#17140f";
  const i = "CardRenderer MTG Matrix", l = (c, h, u, m, g) => {
    const f = Kn(e, c, r, h[0] + h[2], h[1] + 1, 15);
    Lt(
      e,
      c.name,
      [h[0], h[1], Math.max(1, h[2] - f - 4), h[3]],
      17,
      i
    ), Lt(
      e,
      c.typeLine ?? "",
      [m[0], m[1], m[2] - (c.power != null ? 60 : 0), m[3]],
      14,
      i
    ), Zn(e, c, r, u, 14, 8), Qn(e, c, g, 17, i);
  };
  l(n, [32, 30, 311, 23], [37, 59, 302, 67], [33, 134, 310, 18], [290, 130, 60, 28]), e.save(), e.translate(375, 523), e.rotate(Math.PI), l(o, [32, 49, 311, 23], [37, 80, 302, 67], [33, 155, 310, 18], [290, 150, 60, 28]), e.restore();
  const d = r.get(Q(t) ?? "");
  if (d) {
    const c = Math.min(44 / d.width, 22 / d.height);
    e.drawImage(d, 353 - d.width * c, 482, d.width * c, d.height * c);
  }
  e0(e, t, [58, 479, 217, 26], "#17140f");
}
function $i(e, t, r, a, s) {
  const n = t.frameTemplate;
  if (!n) throw Error("Missing standard template");
  if (n === "future") return Bi(e, t, r, a, s);
  const o = wa[n], i = (c) => {
    const h = r.get(c);
    if (!h) throw Error(`Standard template asset unavailable: ${c}`);
    return h;
  }, l = gn(t);
  if (!l) throw Error("Missing template assets");
  const d = i(l.base);
  e.save();
  try {
    if (a !== "artwork" && (e.fillStyle = "#090806", e.fillRect(0, 0, 488, 680)), s && e.drawImage(s, 0, 0, 488, 680), n === "battle" ? (e.translate(0, 680), e.rotate(-Math.PI / 2), e.scale(680 / 523, 488 / 375)) : e.scale(488 / 375, 680 / 523), l.kind === "flip") {
      ji(e, t, r, l, a);
      return;
    }
    if (l.kind !== "battle") throw Error("Unexpected standard template branch");
    if (a !== "artwork" && e.drawImage(i(l.texture), 0, 0, 523, 375), ye(e, t, r, o.art, a), a === "artwork") return;
    e.drawImage(d, 0, 0, o.size[0], o.size[1]), e.drawImage(i(l.border), 0, 0, 523, 375), t.defense != null && e.drawImage(i(l.defense), 459, 322, 64, 52), e.shadowColor = "transparent", e.fillStyle = "#17140f";
    const c = "CardRenderer MTG Beleren";
    let h = o.title;
    const u = Kn(e, t, r, 484, 20, 15);
    h = [h[0], h[1], Math.max(1, h[2] - u - 5), h[3]], Lt(e, t.name, h, o.titleSize, c), Lt(e, t.typeLine ?? "", o.type, o.typeSize, c), e.fillStyle = "#17140f", Zn(e, t, r, o.rules, o.rulesSize, o.minimumSize), n === "battle" && t.defense != null ? (e.fillStyle = "white", Lt(e, String(t.defense), o.stats, 17, c)) : Qn(e, t, o.stats, 18, c);
    const m = r.get(Q(t) ?? "");
    if (m) {
      const [g, f, w, y] = o.symbol, p = Math.min(w / m.width, y / m.height);
      e.drawImage(
        m,
        g + w - m.width * p,
        f + (y - m.height * p) / 2,
        m.width * p,
        m.height * p
      );
    }
    e0(e, t, o.footer, "white");
  } finally {
    e.restore();
  }
}
let hs;
function Gi(e) {
  return !e.frameTemplate || e.frameTemplate === "battle" ? Promise.resolve() : hs ??= Promise.all([
    document.fonts.load('400 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 24px "CardRenderer MTG Matrix Small Caps"')
  ]).then(() => {
  }).catch((t) => {
    throw hs = void 0, t;
  });
}
function Ei(e) {
  if (e.setCode?.toLowerCase() !== "plc" || e.frameAssetFamily !== "eighth" || e.frameTemplate || e.layout && e.layout !== "normal")
    return;
  const t = Ae(e);
  if (!(!t || !Le(e, t.frame)))
    return { dx: 1.25, dy: -2.9375, scaleX: 1.005, scaleY: 0.99375 };
}
function Li(e, t, r) {
  if (!(e.setSymbol || !Le(e, t) || !["c", "u", "r"].some(
    (a) => r === `${L}/img/setSymbols/official/plc-${a}.svg`
  )))
    return [411, 388.75, 34, 25.5];
}
const Ai = {
  scaleX: 1.01,
  scaleY: 1.01,
  numberScale: 0.98,
  numberDx: -0.25
}, Oi = {}, Di = {
  leb: {
    dx: -1.5,
    spacing: 1.75,
    numberDy: -1,
    glyphs: {
      W: { scale: 1.09, dx: 0, dy: 0 },
      U: { scale: 1, dx: 0.5, dy: -1 },
      B: { scale: 1.03, dx: 0.25, dy: -1.25 },
      R: { scale: 1, dx: 0.5, dy: 0.5 },
      G: { scale: 1.12, dx: 0, dy: -1 }
    }
  },
  "8ed": {
    dy: -2,
    scaleX: 1.02,
    scaleY: 1.02,
    numberScale: 0.97,
    numberDx: -0.5,
    numberDy: -1.25,
    glyphs: {
      W: { scale: 0.98, dx: -0.5, dy: -2 },
      U: { scale: 0.94, dx: -0.5, dy: -1.5 },
      B: { scale: 0.97, dx: -0.25, dy: -2 },
      R: { scale: 0.95, dx: 0, dy: -1.5 },
      G: { scale: 1.04, dx: -0.25, dy: -3 }
    }
  }
};
function Wi(e) {
  const t = Ei(e);
  if (t) return t;
  const r = e.setCode?.toLowerCase() ?? "";
  if (pn(e)) return { ...Ai, ...Oi[r] };
  const a = Di[r], s = ["lea", "leb", "3ed"].includes(r);
  if (!(!a || e.frameTemplate !== void 0 || /^Level up\b/m.test(e.rulesText ?? "") || (e.layout ?? "normal") !== "normal" || (e.legendary ?? /\bLegendary\b/.test(e.typeLine ?? "")) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || Me(e) !== (["3ed", "8ed"].includes(r) ? "white" : "black") || s && (!de(e) || e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode === "oracle") || r === "8ed" && (de(e) || e.frameAssetFamily !== "eighth")))
    return a;
}
function kr(e) {
  const t = e.symbolAdjustment?.mana, r = Wi(e);
  if (!r) return t;
  const a = { ...t };
  for (const s of ["dx", "dy", "spacing", "numberDx", "numberDy"])
    r[s] !== void 0 && (a[s] = r[s] + (t?.[s] ?? 0));
  for (const s of ["scaleX", "scaleY", "numberScale"])
    r[s] !== void 0 && (a[s] = r[s] * (t?.[s] ?? 1));
  if (r.glyphs) {
    a.glyphs = { ...t?.glyphs };
    for (const s of ["W", "U", "B", "R", "G"]) {
      const n = r.glyphs[s], o = t?.glyphs?.[s];
      n && (a.glyphs[s] = {
        scale: (n.scale ?? 1) * (o?.scale ?? 1),
        dx: (n.dx ?? 0) + (o?.dx ?? 0),
        dy: (n.dy ?? 0) + (o?.dy ?? 0)
      });
    }
  }
  return a;
}
class Oa {
  constructor(t) {
    if (this.limit = t, !Number.isSafeInteger(t) || t < 1) throw RangeError("Invalid material budget");
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
  destroy(t) {
    t.bitmap?.close(), t.bitmap = void 0, t.accounted && (this.bytes -= t.bytes, t.accounted = !1);
  }
  admit(t) {
    const r = new Set(t.map((s) => s.key)), a = t.reduce((s, n) => {
      const o = this.entries.get(n.key);
      if (o && o.bytes !== n.bytes)
        throw Error("Material cache key has inconsistent dimensions");
      return s + (o ? 0 : n.bytes);
    }, 0);
    for (const [s, n] of this.entries) {
      if (this.bytes + a <= this.limit) break;
      n.users || r.has(s) || (this.entries.delete(s), n.retired = !0, this.destroy(n), this.evictions++);
    }
    if (!(this.bytes + a > this.limit))
      return this.bytes += a, this.peakBytes = Math.max(this.peakBytes, this.bytes), t.map((s) => {
        let n = this.entries.get(s.key);
        if (n)
          this.hits++, this.entries.delete(s.key), this.entries.set(s.key, n);
        else {
          const o = {
            users: 0,
            bytes: s.bytes,
            accounted: !0,
            retired: !1,
            promise: Promise.resolve().then(async () => {
              this.builds++;
              const i = await s.build();
              if (i.width * i.height * 4 !== s.bytes)
                throw i.close(), Error("Derived bitmap dimensions differ from its cache reservation");
              return o.bitmap = i, i;
            })
          };
          o.promise = o.promise.catch((i) => {
            throw this.entries.get(s.key) === o && this.entries.delete(s.key), o.retired = !0, this.destroy(o), this.notify(), i;
          }), this.entries.set(s.key, o), n = o;
        }
        return n.users++, n;
      });
  }
  notify() {
    for (const t of [...this.waiting]) t();
  }
  wait(t) {
    return t.throwIfAborted(), new Promise((r, a) => {
      const s = () => {
        this.waiting.delete(n), t.removeEventListener("abort", o);
      }, n = () => {
        s(), r();
      }, o = () => {
        s(), a(t.reason);
      };
      this.waiting.add(n), t.addEventListener("abort", o, { once: !0 });
    });
  }
  async acquire(t, r, a, s) {
    return (await this.acquireMany([{ key: t, bytes: r, build: a }], s))[0];
  }
  /** Admit a complete face atomically. Per-component waiting could deadlock two
   * faces that each hold half their required components while awaiting the rest. */
  async acquireMany(t, r) {
    if (r.throwIfAborted(), new Set(t.map((n) => n.key)).size !== t.length)
      throw Error("Duplicate key in material batch");
    if (t.some((n) => !Number.isSafeInteger(n.bytes) || n.bytes < 1) || t.reduce((n, o) => n + o.bytes, 0) > this.limit)
      throw RangeError("Material batch exceeds derived-image budget");
    let a;
    for (; !(a = this.admit(t)); )
      await this.wait(r), r.throwIfAborted();
    const s = a.map((n) => {
      let o = !1;
      return () => {
        o || (o = !0, n.users--, n.retired && !n.users && this.destroy(n), this.notify());
      };
    });
    try {
      const o = (await Promise.allSettled(a.map((i) => i.promise))).find((i) => i.status === "rejected");
      if (o?.status === "rejected") throw o.reason;
      return r.throwIfAborted(), a.map((i, l) => ({ value: i.bitmap, release: s[l] }));
    } catch (n) {
      for (const o of s) o();
      throw n;
    }
  }
  /** Retire active results; their final lease closes them. New work may start
   * after teardown, but retired pending/leased bytes still count toward budget. */
  clear() {
    for (const t of this.entries.values())
      t.retired = !0, t.users || this.destroy(t);
    this.entries.clear(), this.notify();
  }
}
const t0 = new Oa(16 * 1024 * 1024), Da = new Oa(8 * 1024 * 1024), Ud = () => {
  t0.clear(), Da.clear();
}, Pi = new Oa(16 * 1024 * 1024), us = /* @__PURE__ */ new WeakMap();
let Ui = 0;
async function Fi(e, t, r) {
  const a = kr(e), s = bn(e), n = !!s || !!a && (!!(a.numberDx || a.numberDy) || (a.numberScale ?? 1) !== 1);
  if (!s && !n && !a?.glyphs && !Object.keys(t.manaGlyphScales ?? {}).length)
    return { images: t, dispose() {
    } };
  const o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), l = [
    .../* @__PURE__ */ new Set([...e.manaSymbols ?? [], ...Object.keys(t.manaGlyphScales ?? {})])
  ].flatMap((c) => {
    const h = At(a, c), u = !!h && (!!(h.dx || h.dy) || (h.scale ?? 1) !== 1);
    if (!(/^\d+$/.test(c) && n) && !u && (t.manaGlyphScales?.[c] ?? 1) === 1)
      return [];
    const m = wn(e, c), g = t.get(m ?? gt(c) ?? "");
    if (m && !g) throw Error("Modern cost numeral asset is missing.");
    if (!g) return [];
    let f = us.get(g);
    return f || us.set(g, f = ++Ui), [{ symbol: c, source: g, identity: f, cost: m ? s : void 0 }];
  });
  let d = [];
  try {
    return d = await Pi.acquireMany(
      l.map(({ source: c, identity: h, cost: u }) => ({
        key: `numeral-v2:${h}:${u ? JSON.stringify(u) : "source"}`,
        bytes: c.width * c.height * 8,
        build: () => _i(c, u)
      })),
      r
    ), l.forEach(({ symbol: c, source: h }, u) => {
      (/^\d+$/.test(c) ? o : i).set(c, {
        image: d[u].value,
        width: h.width,
        height: h.height
      });
    }), {
      images: Object.assign(new Map(t), {
        manaCostShadow: s?.shadow,
        manaColors: t.manaColors,
        originalManaGlyphs: t.originalManaGlyphs,
        originalWhiteGlyph: t.originalWhiteGlyph,
        manaNumerals: o,
        manaGlyphs: i,
        manaGlyphScales: t.manaGlyphScales
      }),
      dispose: () => d.forEach((c) => c.release())
    };
  } catch (c) {
    throw d.forEach((h) => h.release()), c;
  }
}
async function _i(e, t) {
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  try {
    const a = r.getContext("2d", { willReadFrequently: !0 });
    if (!a) throw Error("Mana glyph preparation needs Canvas2D.");
    a.drawImage(e, 0, 0);
    const s = a.getImageData(0, 0, r.width, r.height), n = s.data, o = (Math.floor(e.height * 0.04) * e.width + Math.floor(e.width / 2)) * 4, i = [n[o], n[o + 1], n[o + 2]];
    let l = o;
    for (let m = 0; m < n.length; m += 4)
      n[m + 3] === 255 && n[m] + n[m + 1] + n[m + 2] < n[l] + n[l + 1] + n[l + 2] && (l = m);
    const d = [n[l], n[l + 1], n[l + 2]], c = i.map((m, g) => m - d[g]), h = c.reduce((m, g) => m + g * g, 0);
    if (h < 100) throw Error("Mana asset has no separable glyph.");
    const u = new ImageData(new Uint8ClampedArray(n), e.width, e.height);
    for (let m = 0; m < n.length; m += 4) {
      if (t) for (let f = 0; f < 3; f++) u.data[m + f] = t.paper[f];
      if (n[m + 3] < 255) {
        n[m + 3] = 0;
        continue;
      }
      for (let f = 0; f < 3; f++) u.data[m + f] = t?.paper[f] ?? i[f];
      const g = Math.max(
        0,
        Math.min(1, c.reduce((f, w, y) => f + w * (i[y] - n[m + y]), 0) / h)
      );
      n[m + 3] = Math.round(n[m + 3] * g);
      for (let f = 0; f < 3; f++) n[m + f] = t?.ink[f] ?? d[f];
    }
    return r.width = e.width * 2, a.putImageData(u, 0, 0), a.putImageData(s, e.width, 0), await createImageBitmap(r);
  } finally {
    r.width = r.height = 0;
  }
}
function cr([e, t, r]) {
  const a = Math.max(e, t, r), s = a - Math.min(e, t, r);
  return [((s === 0 ? 0 : a === e ? (t - r) / s : a === t ? (r - e) / s + 2 : (e - t) / s + 4) * 60 % 360 + 360) % 360, a === 0 ? 0 : s / a, a];
}
function Ni(e, t, r) {
  const a = (e % 360 + 360) % 360 / 60, s = r * t, n = s * (1 - Math.abs(a % 2 - 1)), o = r - s, i = a < 1 ? [s, n, 0] : a < 2 ? [n, s, 0] : a < 3 ? [0, s, n] : a < 4 ? [0, n, s] : a < 5 ? [n, 0, s] : [s, 0, n];
  return [i[0] + o, i[1] + o, i[2] + o];
}
function Be(e, t) {
  const [r, a, s] = cr(e), n = Ni(
    r + t.hueDegrees,
    Math.min(1, a * t.saturationScale),
    Math.min(1, s * t.brightnessScale)
  );
  return t.rgbScale ? [
    Math.max(0, Math.min(1, n[0] * t.rgbScale[0])),
    Math.max(0, Math.min(1, n[1] * t.rgbScale[1])),
    Math.max(0, Math.min(1, n[2] * t.rgbScale[2]))
  ] : n;
}
const zi = {
  W: { hueDegrees: 0, saturationScale: 0.439924, brightnessScale: 1.21405 },
  U: { hueDegrees: 17.808301, saturationScale: 0.546189, brightnessScale: 1.239832 },
  B: { hueDegrees: 0, saturationScale: 0.261951, brightnessScale: 1.149978 },
  R: { hueDegrees: -7.214766, saturationScale: 0.471958, brightnessScale: 1.212936 },
  G: { hueDegrees: 0, saturationScale: 0.227323, brightnessScale: 1.290867 }
};
function Lr(e, t, r) {
  if (t.colorCalibration !== "set-hsb-v1" || !["eld", "woe"].includes(t.setCode?.toLowerCase() ?? ""))
    return;
  const a = zi[r.toUpperCase()];
  if (!a) return;
  const s = e.getContext("2d"), n = e.width, o = e.height, i = [
    Math.floor(31 * n / 488),
    Math.floor(487 * o / 680),
    Math.ceil(214 * n / 488),
    Math.ceil(142 * o / 680)
  ], l = s.getImageData(...i);
  for (let c = 0; c < l.data.length; c += 4) {
    if (!l.data[c + 3]) continue;
    const h = Be(
      [l.data[c] / 255, l.data[c + 1] / 255, l.data[c + 2] / 255],
      a
    );
    for (let u = 0; u < 3; u++)
      l.data[c + u] = Math.round(h[u] * 255);
  }
  const d = document.createElement("canvas");
  d.width = i[2], d.height = i[3], d.getContext("2d").putImageData(l, 0, 0), s.save(), s.scale(n / 488, o / 680), s.beginPath(), s.moveTo(31.8, 488.3), s.lineTo(218, 488.3), s.bezierCurveTo(235, 488.3, 241, 490.5, 244, 496), s.lineTo(244, 627.4), s.lineTo(31.8, 627.4), s.closePath(), s.clip(), s.drawImage(
    d,
    i[0] * 488 / n,
    i[1] * 680 / o,
    i[2] * 488 / n,
    i[3] * 680 / o
  ), s.restore(), d.width = d.height = 0;
}
const nt = /* @__PURE__ */ new Map(), Ar = /* @__PURE__ */ new WeakMap();
let Yi = 0, Or = 0;
const Hi = (e) => (Ar.has(e) || Ar.set(e, ++Yi), Ar.get(e));
function qi(e, t) {
  const r = e.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const a = (y) => {
    const p = t.get(y);
    if (!p) throw Error(`Adventure asset unavailable: ${y}`);
    return p;
  }, s = Fn(e).map(a), n = JSON.stringify([
    e.setCode,
    e.colorCalibration,
    e.colors,
    e.frameColors,
    e.manaSymbols,
    r.colors,
    r.frameColors,
    r.manaSymbols,
    s.map(Hi)
  ]), o = nt.get(n);
  if (o)
    return nt.delete(n), nt.set(n, o), o;
  const i = a(Qr(e)), l = document.createElement("canvas");
  l.width = i.width, l.height = i.height;
  const d = l.getContext("2d"), c = l.width, h = l.height, u = () => {
    const y = document.createElement("canvas");
    return y.width = c, y.height = h, y;
  }, m = (y, p) => {
    const b = u(), S = b.getContext("2d"), k = O(y);
    if (S.drawImage(a(Qr(y)), 0, 0, c, h), p && k.length === 1 && Lr(b, e, k[0]), k.length === 2) {
      "WUBRG".indexOf(k[1]) - "WUBRG".indexOf(k[0]) > 2 && k.reverse(), S.drawImage(a(`${yt}/${k[0].toLowerCase()}.png`), 0, 0, c, h), p && Lr(b, e, k[0]);
      const v = u(), R = v.getContext("2d");
      R.drawImage(a(`${yt}/${k[1].toLowerCase()}.png`), 0, 0, c, h), p && Lr(v, e, k[1]), R.globalCompositeOperation = "destination-in";
      const M = R.createLinearGradient(
        c * (p ? 0.22 : 0.43),
        0,
        c * (p ? 0.36 : 0.57),
        0
      );
      M.addColorStop(0, "#0000"), M.addColorStop(1, "#000"), R.fillStyle = M, R.fillRect(0, 0, c, h), S.drawImage(v, 0, 0), v.width = v.height = 0;
    }
    return b;
  };
  if (d.drawImage(i, 0, 0), O(e).length === 2) {
    const y = m(e, !1), p = y.getContext("2d");
    Fe(e) || (p.globalCompositeOperation = "destination-in", p.drawImage(a(Wn), 0, 0, c, h)), d.drawImage(y, 0, 0), y.width = y.height = 0;
  }
  const g = m(r, !0), f = g.getContext("2d");
  if (f.globalCompositeOperation = "destination-in", f.drawImage(a(Dn), 0, 0, c, h), d.save(), Fe(r) && (d.filter = "grayscale(1)"), d.drawImage(g, 0, 0), d.restore(), g.width = g.height = 0, Fe(e)) {
    d.save(), d.scale(c / 488, h / 680), d.beginPath();
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
      d.drawImage(a(Pn), 22, 7, 196, 19, 29, y, 432, p);
    d.restore();
  }
  const w = c * h * 4;
  for (const [y, p] of nt) {
    if (Or + w <= 16 * 1024 * 1024) break;
    Or -= p.width * p.height * 4, nt.delete(y), p.width = p.height = 0;
  }
  return w <= 16 * 1024 * 1024 && (nt.set(n, l), Or += w), l;
}
const Xi = ["ice", "chr", "all"], Ji = { leg: { "Adun Oakenshield": "{G}{R}{B}", "Angus Mackenzie": "{W}{U}{G}", "Arcades Sabboth": "{2}{W}{W}{G}{G}{U}{U}", "Axelrod Gunnarson": "{4}{B}{B}{R}{R}", "Ayesha Tanaka": "{U}{U}{W}{W}", "Barktooth Warbeard": "{4}{B}{R}{R}", "Bartel Runeaxe": "{3}{G}{R}{B}", "Boris Devilboon": "{3}{B}{R}", Chromium: "{2}{B}{B}{U}{U}{W}{W}", "Dakkon Blackblade": "{2}{B}{U}{U}{W}", "Gabriel Angelfire": "{3}{W}{W}{G}{G}", "Gosta Dirk": "{3}{W}{W}{U}{U}", "Gwendlyn Di Corci": "{R}{B}{B}{U}", Halfdane: "{1}{B}{U}{W}", "Hazezon Tamar": "{4}{W}{G}{R}", "Hunding Gjornersen": "{3}{U}{U}{W}", "Jacques le Vert": "{1}{W}{G}{R}", "Jasmine Boreal": "{3}{W}{G}", "Jedit Ojanen": "{4}{U}{W}{W}", "Jerrard of the Closed Fist": "{3}{G}{G}{R}", Johan: "{3}{W}{G}{R}", "Kasimir the Lone Wolf": "{4}{U}{W}", "Kei Takahashi": "{2}{W}{G}", "Lady Caleria": "{3}{W}{W}{G}{G}", "Lady Evangela": "{B}{U}{W}", "Lady Orca": "{5}{B}{R}", "Livonya Silone": "{2}{G}{G}{R}{R}", "Lord Magnus": "{3}{W}{W}{G}", "Marhault Elsdragon": "{3}{G}{R}{R}", Nebuchadnezzar: "{3}{B}{U}", "Nicol Bolas": "{2}{U}{U}{B}{B}{R}{R}", "Palladia-Mors": "{2}{W}{W}{G}{G}{R}{R}", "Pavel Maliki": "{4}{B}{R}", "Princess Lucrezia": "{3}{B}{U}{U}", Ragnar: "{U}{W}{G}", "Ramirez DePietro": "{3}{B}{B}{U}", "Ramses Overdark": "{2}{B}{B}{U}{U}", "Rasputin Dreamweaver": "{4}{W}{U}", "Riven Turnbull": "{5}{B}{U}", "Rohgahh of Kher Keep": "{2}{B}{B}{R}{R}", "Rubinia Soulsinger": "{2}{U}{W}{G}", "Sir Shandlar of Eberyn": "{4}{W}{G}", "Sivitri Scarzam": "{5}{B}{U}", "Sol'kanar the Swamp King": "{2}{R}{B}{U}", Stangg: "{4}{G}{R}", "Sunastian Falconer": "{3}{G}{R}", "Tetsuo Umezawa": "{R}{B}{U}", "The Lady of the Mountain": "{4}{G}{R}", "Tobias Andrion": "{3}{U}{W}", "Tor Wauki": "{2}{B}{B}{R}", "Torsten Von Ursus": "{3}{W}{G}{G}", "Tuknir Deathlock": "{G}{G}{R}{R}", "Ur-Drago": "{3}{B}{B}{U}{U}", "Vaevictis Asmadi": "{2}{B}{B}{R}{R}{G}{G}", "Xira Arien": "{G}{R}{B}" }, drk: { "Dark Heart of the Wood": "{B}{G}", "Marsh Goblins": "{B}{R}", "Scarwood Goblins": "{G}{R}" } }, ms = {
  wubrgSets: Xi,
  overrides: Ji
};
function Vi(e, t) {
  const r = e.setCode?.toLowerCase() ?? "", s = ms.overrides[r]?.[e.name ?? ""];
  if (s) {
    const n = [...s.matchAll(/\{([^}]+)\}/g)].map((o) => o[1]);
    return [...n].sort().join("|") === [...t].sort().join("|") ? n : [...t];
  }
  return !ms.wubrgSets.includes(r) || t.some((n) => !/^(?:\d+|X|[WUBRG])$/.test(n)) ? [...t] : [
    ...t.filter((n) => !"WUBRG".includes(n)),
    ...t.filter((n) => "WUBRG".includes(n)).sort((n, o) => "WUBRG".indexOf(n) - "WUBRG".indexOf(o))
  ];
}
function Mt(e) {
  return e.rulesParagraphs ?? e.rulesText.split(`
`).filter(Boolean).map((t) => ({ role: "rules", runs: [{ text: t }] }));
}
function Fd(e, t, r = "oracle", a = {}) {
  const s = t[r];
  if (!s) throw Error(`Missing ${r} printing wording`);
  if (typeof s.typeLine != "string" || typeof s.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const n = a.rulesAlignment ?? r, o = n === "left" ? void 0 : t[n];
  if (n !== "left" && !o) throw Error(`Missing ${n} alignment wording`);
  const i = J({ ...e, typeLine: t.oracle.typeLine });
  return {
    ...e,
    ...s,
    manaSymbols: s.manaSymbols ?? (r === "original" ? Vi(e, e.manaSymbols ?? []) : t.oracle.manaSymbols ?? e.manaSymbols),
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: s.rulesParagraphs,
    rulesAlignment: o ? { mode: "auto", reference: Mt(o) } : { mode: "left" },
    artifact: e.artifact ?? i.artifact,
    land: e.land ?? i.land,
    creature: e.creature ?? i.creature,
    legendary: e.legendary ?? i.legendary,
    wordingMode: r,
    symbolStyle: a.symbolStyle ?? (r === "oracle" ? "modern" : "original")
  };
}
function Ki(e, t) {
  const r = t.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const a = (u) => {
    const m = Mt({
      rulesText: u.rulesText ?? "",
      rulesParagraphs: u.rulesParagraphs
    });
    return u.rulesAlignment?.mode === "left" ? m.map((g) => g.role === "rules" ? { ...g, align: "left" } : g) : m;
  }, s = { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: !0 }, n = a(t), o = {
    x: 261,
    y: 438,
    width: 189,
    height: 178,
    exclusions: t.power != null && t.toughness != null ? [[368, 601, 94, 51]] : []
  }, i = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? n : n, l = t.rulesAlignment?.mode !== "left" && i.length === 1 && i[0].role === "rules" ? Rt(e, n, i, o, 22.5, 9, 1, s) : null, d = a(r), c = { x: 41.7, y: 499, width: 191, height: 122 }, h = Y(e, d, c, 20.25, 20.25, s);
  return {
    permanent: l || Y(e, n, o, 22.5, 9, s),
    spell: !h.overflow && h.lines.length <= 4 ? h : Y(e, d, c, 22.5, 9, s)
  };
}
function Zi(e) {
  const t = (e.rarity ?? "common")[0].toUpperCase(), r = e.collectorNumber ?? "";
  if ((e.collectorFormat ?? (e.setCode?.toLowerCase() === "woe" ? "rarity-first" : "number-first")) === "number-first") return `${r} ${t}`.trim();
  const s = r.split("/")[0].replace(/^(\d+)/, (n) => n.padStart(4, "0"));
  return `${t} ${s}`.trim();
}
function r0(e, t, r) {
  if (t.power != null && t.toughness != null) {
    const s = r.get(Ba(t));
    if (!s) throw Error("Adventure power/toughness plate is unavailable.");
    const [n, o, i, l] = ja.stats;
    e.drawImage(s, n * 488, o * 680, i * 488, l * 680), e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = '700 25px "CardRenderer MTG Beleren Small Caps", Georgia', e.fillText(`${t.power}/${t.toughness}`, 420, 627, 77);
  }
  if (xe(t)) {
    const s = r.get(_t);
    if (!s) throw Error("Adventure authenticity stamp is unavailable.");
    e.drawImage(s, ...St.saga);
  }
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(Zi(t), 32, 645), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.artist && (e.font = '11px "CardRenderer MTG Artist Credit", serif', e.fillText("a", 93, 658), e.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', e.fillText(t.artist, 108, 658, 210)), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 658, 182));
}
let gs = null;
function a0() {
  return gs ??= document.fonts.load('700 25px "CardRenderer MTG Beleren Small Caps"').then((e) => {
    if (!e.length || e.some((t) => t.status !== "loaded"))
      throw Error("Inset card footer lettering needs card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw gs = null, e;
  });
}
function Qi(e, t, r) {
  if (e.drawImage(qi(t, r), 0, 0, 488, 680), J(t).legendary) {
    const a = r.get(Un(t));
    if (!a) throw Error("Adventure crown is unavailable.");
    e.fillStyle = "#000", e.fillRect(19.2, 18.8, 449.6, 12.1), e.drawImage(a, 13.4, 13, 461.4, 113.4);
  }
}
function el(e, t, r) {
  const a = t.manaSymbols ?? [], s = 23.4, n = 1.8, o = 452, i = a.length * s + Math.max(0, a.length - 1) * n;
  e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle", te(
    e,
    t.name,
    41.7,
    51,
    (a.length ? o - i - 8 : 449) - 41.7,
    26,
    !0
  ), a.forEach(
    (f, w) => ee(e, f, o - i + w * (s + n), 38.7, s, r, !0)
  );
  const l = Q(t), d = r.get(l ?? ""), c = Ne(t), h = d ? Math.min(58.56 / (d.width * c[2]), 27.9 / (d.height * c[3])) : 0, u = d ? d.width * c[2] * h : 0, m = d ? d.height * c[3] * h : 0, g = [450.3 - u, 402 - m / 2, u, m];
  te(
    e,
    t.typeLine ?? "",
    41.7,
    401.5,
    (d ? g[0] - 7 : 449) - 41.7,
    22,
    !0
  ), d && (Te(l) || t.setSymbol ? e.drawImage(d, ...g) : Ee(e, d, t.setCode, t.rarity, ...g, c));
}
function tl(e, t, r) {
  const a = t.manaSymbols ?? [], s = 19.8, n = 1.2, o = 233, i = a.length * s + Math.max(0, a.length - 1) * n;
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "middle", te(
    e,
    t.name,
    40,
    443,
    (a.length ? o - i - 4 : o) - 40,
    20.1,
    !0
  ), a.forEach(
    (l, d) => ee(e, l, o - i + d * (s + n), 432, s, r, !0)
  ), te(e, t.typeLine ?? "", 40, 473.5, 193, 20.1, !0);
}
function rl(e, t, r, a, s) {
  const n = t.faces?.[1];
  if (!n) throw Error("Adventure spell is missing.");
  e.save(), e.fillStyle = "#000", e.fillRect(0, 0, 488, 680), a && e.drawImage(a, 0, 0, 488, 680), s !== "artwork" && Qi(e, t, r);
  const [o, i, l, d] = ja.art;
  if (ye(e, t, r, [o * 488, i * 680, l * 488, d * 680], s), s !== "artwork") {
    el(e, t, r), tl(e, n, r);
    const c = Ki(e, t);
    he(e, c.permanent, r), he(e, c.spell, r), r0(e, t, r);
  }
  e.restore();
}
const ot = /* @__PURE__ */ new Map(), Dr = /* @__PURE__ */ new WeakMap();
let al = 0, Wr = 0;
const sl = (e) => (Dr.has(e) || Dr.set(e, ++al), Dr.get(e));
function nl(e, t) {
  const r = Ct(e), a = (b) => {
    const S = t.get(b);
    if (!S) throw Error(`Prepared asset unavailable: ${b}`);
    return S;
  }, s = _n(e).map(a), n = ut(e), o = ut(r), i = J(e).legendary, l = JSON.stringify([
    n,
    o,
    i,
    Fe(r),
    s.map(sl)
  ]), d = ot.get(l);
  if (d)
    return ot.delete(l), ot.set(l, d), d;
  const c = a(Et(e)), h = c.width, u = c.height, m = () => {
    const b = document.createElement("canvas");
    return b.width = h, b.height = u, b;
  }, g = m(), f = g.getContext("2d");
  f.drawImage(c, 0, 0);
  const w = (b, S, k = !1) => {
    const v = m(), R = v.getContext("2d");
    k && (R.filter = "grayscale(1)"), R.drawImage(b, 0, 0, h, u), R.filter = "none", R.globalCompositeOperation = "destination-in", R.drawImage(a(er(S)), 0, 0, h, u), f.drawImage(v, 0, 0), v.width = v.height = 0;
  }, y = (b) => a(`${Sr}/${b.toLowerCase()}.png`);
  if (n.length === 2) {
    const b = m(), S = b.getContext("2d");
    S.drawImage(y(n[0]), 0, 0, h, u);
    const k = m(), v = k.getContext("2d");
    v.drawImage(y(n[1]), 0, 0, h, u), v.globalCompositeOperation = "destination-in";
    const R = v.createLinearGradient(h * 0.43, 0, h * 0.57, 0);
    R.addColorStop(0, "#0000"), R.addColorStop(1, "#000"), v.fillStyle = R, v.fillRect(0, 0, h, u), S.drawImage(k, 0, 0), w(b, "pinline"), w(y(n[0]), "rules"), w(y(n[1]), "rulesRight"), b.width = b.height = k.width = k.height = 0;
  }
  if (o.length === 2 ? (w(y(o[0]), "prepare"), w(y(o[1]), "prepareRight"), w(a(Et(r)), "prepareTypeTitle", Fe(r))) : w(a(Et(r)), "prepare"), i) {
    f.save(), f.scale(h / 488, u / 680), f.fillStyle = "#000", f.fillRect(19.2, 18.8, 449.6, 12.1);
    const b = n.length === 2 ? n : [Ga(e)];
    if (f.drawImage(a(ea(b[0])), 13.4, 13, 461.4, 113.4), b.length === 2) {
      const S = m(), k = S.getContext("2d");
      k.scale(h / 488, u / 680), k.drawImage(a(ea(b[1])), 13.4, 13, 461.4, 113.4), k.globalCompositeOperation = "destination-in";
      const v = k.createLinearGradient(210, 0, 278, 0);
      v.addColorStop(0, "#0000"), v.addColorStop(1, "#000"), k.fillStyle = v, k.fillRect(0, 0, 488, 680), f.drawImage(S, 0, 0, 488, 680), S.width = S.height = 0;
    }
    f.restore();
  }
  const p = h * u * 4;
  for (const [b, S] of ot) {
    if (Wr + p <= 16 * 1024 * 1024) break;
    Wr -= S.width * S.height * 4, ot.delete(b), S.width = S.height = 0;
  }
  return p <= 16 * 1024 * 1024 && (ot.set(l, g), Wr += p), g;
}
function ol(e, t) {
  const r = Ct(t), a = (s, n, o, i) => {
    const l = Mt({
      rulesText: s.rulesText ?? "",
      rulesParagraphs: s.rulesParagraphs
    });
    return Y(
      e,
      s.rulesAlignment?.mode === "left" ? l.map((d) => d.role === "rules" ? { ...d, align: "left" } : d) : l,
      {
        x: n[0] * 488,
        y: n[1] * 680,
        width: n[2] * 488,
        height: n[3] * 680,
        exclusions: i
      },
      o,
      9,
      { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: !0 }
    );
  };
  return {
    permanent: a(
      t,
      Ea.rules,
      21.75,
      xe(t) ? [[213, 620, 63, 26]] : []
    ),
    spell: a(
      r,
      ri.rules,
      21.75,
      t.power != null && t.toughness != null ? [[370, 603, 93, 49]] : []
    )
  };
}
function il(e, t, r) {
  e.drawImage(nl(t, r), 0, 0, 488, 680);
}
function ll(e, t, r) {
  const a = (u, m) => {
    const g = u.manaSymbols ?? [], f = m ? 19.8 : 23.4, w = m ? 1.2 : 1.8, y = m ? 1042 / 2010 * 488 : 41.7, p = 452, b = g.length * f + Math.max(0, g.length - 1) * w;
    e.fillStyle = m ? "#fff" : "#17140f", e.textAlign = "left", e.textBaseline = "middle", te(
      e,
      u.name,
      y,
      m ? 444 : 52,
      (g.length ? p - b - (m ? 4 : 8) : p) - y,
      m ? 20 : 26,
      !0
    ), g.forEach(
      (S, k) => ee(
        e,
        S,
        p - b + k * (f + w),
        m ? 434.5 : 38.7,
        f,
        r,
        !0
      )
    );
  };
  a(t, !1);
  const s = Q(t), n = r.get(s ?? ""), o = Ne(t), i = n ? Math.min(58.56 / (n.width * o[2]), 27.9 / (n.height * o[3])) : 0, l = n ? n.width * o[2] * i : 0, d = n ? n.height * o[3] * i : 0, c = [450.3 - l, 402 - d / 2, l, d];
  te(
    e,
    t.typeLine ?? "",
    41.7,
    401.5,
    (n ? c[0] - 7 : 449) - 41.7,
    22,
    !0
  ), n && (Te(s) || t.setSymbol ? e.drawImage(n, ...c) : Ee(e, n, t.setCode, t.rarity, ...c, o));
  const h = Ct(t);
  a(h, !0), te(e, h.typeLine ?? "", 1042 / 2010 * 488, 477, 195.2, 20, !0);
}
function dl(e, t, r, a, s) {
  Ct(t), e.save(), e.fillStyle = "#000", e.fillRect(0, 0, 488, 680), a && e.drawImage(a, 0, 0, 488, 680), s !== "artwork" && il(e, t, r);
  const [n, o, i, l] = Ea.art;
  if (ye(e, t, r, [n * 488, o * 680, i * 488, l * 680], s), s !== "artwork") {
    ll(e, t, r);
    const d = ol(e, t);
    he(e, d.permanent, r), he(e, d.spell, r), r0(
      e,
      { ...t, collectorFormat: t.collectorFormat ?? "rarity-first" },
      r
    );
  }
  e.restore();
}
const Wa = {
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
function cl(e, t) {
  if (t.watermark) return t.watermark;
  if (e.watermark) return e.watermark;
  const r = [...new Set(e.faces?.map((n) => n.watermark).filter(Boolean))];
  if (r.length !== 1) return t.watermark;
  const a = Wa[r[0]], s = new Set(e.faces?.flatMap(O));
  return a && s.size === 2 && a.every((n) => s.has(n)) ? r[0] : t.watermark;
}
function oa(e) {
  return e.watermark && Object.hasOwn(Wa, e.watermark) ? `${L}/img/watermarks/guild-${e.watermark}.svg` : null;
}
function s0(e, t) {
  return `${In}/magic-new-split${e ? "-fuse" : ""}.mse-style/multicolor_blend_card${e ? t + 1 : ""}.png`;
}
function hl(e, t, r, a) {
  if (t === "m15") return [...zo(e), oa(e)];
  const s = O(e);
  return [
    ir(e, t, r, a),
    oa(e),
    ...t === "eighth" && s.length === 2 ? [
      s0(r, a),
      ...s.map(
        (n) => ir({ ...e, colors: [n], frameColors: void 0 }, t, r, a)
      )
    ] : [],
    ...t === "eighth" && e.artist ? [`${L}/img/manaSymbols/brush.svg`] : []
  ];
}
const fs = /* @__PURE__ */ new WeakMap();
function n0(e) {
  const t = fs.get(e);
  if (t) return t;
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  const a = r.getContext("2d", { willReadFrequently: !0 });
  a.drawImage(e, 0, 0);
  const s = a.getImageData(0, 0, r.width, r.height);
  for (let n = 0; n < s.data.length; n += 4) s.data[n + 3] = s.data[n];
  return a.putImageData(s, 0, 0), fs.set(e, r), r;
}
const ps = /* @__PURE__ */ new WeakMap();
function ul(e, t, r, a, s) {
  const n = (b) => {
    const S = s.get(b);
    if (!S) throw Error(`Split asset unavailable: ${b}`);
    return S;
  }, o = n(ir(e, t, r, a)), i = O(e);
  if (t !== "eighth" || i.length !== 2) return o;
  "WUBRG".indexOf(i[1]) - "WUBRG".indexOf(i[0]) > 2 && i.reverse();
  const [l, d] = i.map(
    (b) => n(
      ir({ ...e, colors: [b], frameColors: void 0 }, t, r, a)
    )
  ), c = n(s0(r, a)), h = i.join(""), u = ps.get(o) ?? /* @__PURE__ */ new Map();
  ps.set(o, u);
  const m = u.get(h);
  if (m?.left === l && m.right === d && m.mask === c) return m.canvas;
  const g = document.createElement("canvas");
  g.width = o.width, g.height = o.height;
  const f = document.createElement("canvas");
  f.width = o.width, f.height = o.height;
  const w = g.getContext("2d"), y = f.getContext("2d");
  y.drawImage(d, 0, 0), y.globalCompositeOperation = "destination-in";
  const p = y.createLinearGradient(0, 0, o.width, 0);
  return p.addColorStop(0, "#0000"), p.addColorStop(0.4, "#0000"), p.addColorStop(0.6, "#000"), p.addColorStop(1, "#000"), y.fillStyle = p, y.fillRect(0, 0, o.width, o.height), w.drawImage(l, 0, 0), w.drawImage(f, 0, 0), w.globalCompositeOperation = "destination-in", w.drawImage(n0(c), 0, 0), w.globalCompositeOperation = "destination-over", w.drawImage(o, 0, 0), w.globalCompositeOperation = "source-over", f.width = f.height = 0, u.set(h, { left: l, right: d, mask: c, canvas: g }), g;
}
const bs = /* @__PURE__ */ new WeakMap();
function ml(e, t, r, a) {
  const s = oa(t);
  if (!s) return;
  const n = r.get(s);
  if (!n) throw Error(`Split watermark unavailable: ${s}`);
  const o = O(t), i = o.length === 1 ? [o[0], o[0]] : Wa[t.watermark], l = i.join(""), d = bs.get(n) ?? /* @__PURE__ */ new Map();
  bs.set(n, d);
  let c = d.get(l);
  if (!c) {
    c = document.createElement("canvas"), c.width = n.width, c.height = n.height;
    const f = c.getContext("2d");
    f.drawImage(n, 0, 0), f.globalCompositeOperation = "source-in";
    const w = {
      W: "#b39f4d",
      U: "#718dac",
      B: "#998795",
      R: "#b6723f",
      G: "#69936e"
    }, [y, p] = i, b = f.createLinearGradient(0, 0, c.width, 0);
    b.addColorStop(0, w[y]), b.addColorStop(0.499, w[y]), b.addColorStop(0.5, w[p]), b.addColorStop(1, w[p]), f.fillStyle = b, f.fillRect(0, 0, c.width, c.height), d.set(l, c);
  }
  const h = t.layout?.startsWith("split-m15") ?? !1, u = Math.min(
    (h ? 135 : 110) / n.width,
    (h ? 125 : t.setCode?.toLowerCase() === "dgm" ? 75 : 100) / n.height
  ), m = n.width * u, g = n.height * u;
  e.save(), e.globalAlpha = 0.3, e.drawImage(c, (h ? 199.5 : 177) - m / 2, a - g / 2, m, g), e.restore();
}
function ve(e) {
  if (e.frameTemplate) return [];
  if (!["split", "aftermath"].includes(e.layout ?? "") || e.faces?.length !== 2) return [];
  const t = Ft(e), r = Ge(e), a = r === "m15" ? nr : Bn;
  return e.faces.map((s, n) => {
    const o = t ? 0.615 : 0.5, i = {
      setCode: e.setCode,
      frameStyle: e.frameStyle,
      rarity: e.rarity,
      securityStamp: e.securityStamp,
      artist: e.artist,
      setSymbol: e.setSymbol,
      setSymbolSource: e.setSymbolSource,
      ...s,
      watermark: r ? cl(e, s) : s.watermark,
      layout: t ? n === 0 ? "aftermath-top" : "aftermath-bottom" : r ? `split-${r}${wt(e) && r !== "old" ? "-fuse" : ""}` : "split-half",
      frameAssetFamily: void 0,
      faces: void 0,
      rulesText: s.rulesText?.split(`
`).filter((l) => !/^Fuse\b/.test(l)).join(`
`),
      rulesParagraphs: s.rulesParagraphs?.filter(
        (l) => !/^Fuse\b/.test(l.runs.map((d) => d.text).join(""))
      ),
      illustration: s.illustration ?? e.illustration,
      etchedIllustration: s.etchedIllustration ?? (s.illustration ? void 0 : e.etchedIllustration),
      illustrationCrop: s.illustrationCrop ?? (!s.illustration && e.illustration ? [n ? o : 0, 0, n ? 1 - o : o, 1] : void 0)
    };
    return t ? n === 0 ? { face: i, x: 0, y: 0, width: 488, height: Qe, rotation: 0 } : {
      face: i,
      x: 488,
      y: Qe,
      width: Mn,
      height: 488,
      rotation: 90
    } : r ? {
      face: i,
      x: 0,
      y: 680 - n * a,
      width: a,
      height: 488,
      rotation: -90
    } : {
      face: i,
      x: 5,
      y: (n ? 333 : 648) - (Pa(e) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function _d(e) {
  return {
    left: `${e.x / C * 100}%`,
    top: `${e.y / I * 100}%`,
    width: `${e.width / C * 100}%`,
    height: `${e.height / I * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function o0(e, t) {
  e.translate(t.x, t.y), e.rotate(t.rotation * Math.PI / 180), e.scale(t.width / C, t.width / C);
}
function ws(e, t) {
  const r = t[0] * e.width, a = t[1] * e.height, s = t[2] * e.width, n = t[3] * e.height;
  return e.rotation === -90 ? [
    (e.x + a) / C,
    (e.y - r - s) / I,
    n / C,
    s / I
  ] : e.rotation === 90 ? [
    (e.x - a - n) / C,
    (e.y + r) / I,
    n / C,
    s / I
  ] : [(e.x + r) / C, (e.y + a) / I, s / C, n / I];
}
function gl(e) {
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? 1.5 : 1;
}
const Pa = wt;
function fl(e, t, r) {
  e.fillStyle = "#000", e.fillRect(0, 0, 488, 680);
  const a = ve(t), s = a.map((n) => qo(n.face, r));
  if (a.forEach((n, o) => {
    e.save(), e.beginPath(), e.rect(0, o ? 0 : 324, 488, o ? 324 : 356), e.clip(), e.drawImage(s[o], 0, 0, 488, 680), e.restore();
  }), a[0]?.face.layout?.endsWith("-fuse")) {
    const n = document.createElement("canvas");
    n.width = 488, n.height = 680;
    const o = n.getContext("2d");
    o.drawImage(s[1], 0, 0, 488, 680), o.globalCompositeOperation = "destination-in";
    const i = o.createLinearGradient(0, 344, 0, 304);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), o.fillStyle = i, o.fillRect(0, 0, 488, 680), e.save(), e.beginPath(), e.rect(434, 0, 54, 680), e.clip(), e.drawImage(s[0], 0, 0, 488, 680), e.drawImage(n, 0, 0), e.restore(), n.width = n.height = 0;
  }
}
function pl(e, t, r) {
  const o = t.manaSymbols ?? [], i = o.length * 23.4 + Math.max(0, o.length - 1) * 1.7;
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left", te(
    e,
    t.name,
    70,
    53,
    Math.max(1, (o.length ? 331 - i - 7 : 331) - 70),
    26,
    !0
  ), o.forEach((g, f) => ee(e, g, 331 - i + f * (23.4 + 1.7), 39.5, 23.4, r, !0));
  const l = Q(t), d = r.get(l ?? ""), c = Ne(t), h = d ? Math.min(26 / (d.width * c[2]), 15.5 / (d.height * c[3])) : 0, u = d ? d.width * c[2] * h : 0, m = d ? d.height * c[3] * h : 0;
  if (te(e, t.typeLine ?? "", 70, 277, (d ? 331 - u - 6 : 331) - 70, 18.5, !0), d) {
    const g = [331 - u, 277 - m / 2, u, m];
    Te(l) || t.setSymbol ? e.drawImage(d, ...g) : Ee(e, d, t.setCode, t.rarity, ...g, c);
  }
}
function bl(e, t, r) {
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic";
  const a = [
    ...new Set((t.faces ?? []).map((s) => s.artist ?? t.artist ?? "").filter(Boolean))
  ].join(" & ");
  if (e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""} ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    646
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 660), a && (e.font = '11px "CardRenderer MTG Artist Credit", serif', e.fillText("a", 95, 660), e.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', e.fillText(a, 110, 660, 193)), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 455, 646, 170)), xe(t)) {
    const s = r.get(vn);
    if (!s) throw Error("Modern split authenticity stamp unavailable.");
    e.drawImage(s, ...St.split);
  }
}
const Pr = K.MSE_SPLIT_BRIDGE_ROOT;
function i0(e, t) {
  const r = O(e);
  r.length === 2 && "WUBRG".indexOf(r[1]) - "WUBRG".indexOf(r[0]) > 2 && r.reverse();
  const a = (t ? r[0] : r.at(-1))?.toLowerCase() ?? "c";
  return {
    color: `${Pr}/${a}bridge.png`,
    gold: r.length > 1 ? `${Pr}/mbridge.png` : null,
    mask: r.length > 1 ? `${Pr}/bridgemask.png` : null
  };
}
function wl(e) {
  return (e.faces ?? []).flatMap((t, r) => Object.values(i0(t, r)));
}
function yl(e, t, r) {
  const a = (c) => {
    const h = r.get(c);
    if (!h) throw Error(`Fuse bridge asset unavailable: ${c}`);
    return h;
  }, s = t.faces.map((c, h) => {
    const u = i0(c, h), m = a(u.color), g = document.createElement("canvas");
    g.width = m.width, g.height = m.height;
    const f = g.getContext("2d");
    return f.drawImage(m, 0, 0), u.gold && u.mask && (f.globalCompositeOperation = "destination-in", f.drawImage(n0(a(u.mask)), 0, 0, g.width, g.height), f.globalCompositeOperation = "destination-over", f.drawImage(a(u.gold), 0, 0, g.width, g.height)), g;
  }), [n, o] = s, i = o.getContext("2d");
  i.globalCompositeOperation = "destination-in";
  const l = i.createLinearGradient(0, 0, o.width, 0);
  l.addColorStop(0, "#0000"), l.addColorStop(1, "#000"), i.fillStyle = l, i.fillRect(0, 0, o.width, o.height), e.save(), e.translate(0, 680), e.rotate(-Math.PI / 2);
  const d = [
    253 * 680 / 523,
    306 * 488 / 375,
    16 * 680 / 523,
    30 * 488 / 375
  ];
  e.drawImage(n, ...d), e.drawImage(o, ...d), e.restore();
  for (const c of s) c.width = c.height = 0;
}
function Sl(e, t, r, a) {
  const [s, n, o, i] = vt(r, a).rules, l = Mt({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), d = { x: s, y: n, width: o, height: i }, c = {
    leading: 1.02,
    paragraphGap: 0.4,
    flavorGap: 0.65,
    centerOffset: r === "old" ? 0 : 2
  }, h = r === "old" ? 24.5 : r === "m15" ? a ? 20.25 : 24.25 : 21.5;
  if ((r !== "m15" || a) && t.rulesAlignment?.mode !== "left" && l.length === 1) {
    const u = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? l : l, m = Rt(e, l, u, d, h, 13, 2, c);
    if (m) return m;
  }
  return Y(e, l, d, h, 13, c);
}
function kl(e, t, r) {
  const a = Ge(t);
  if (!a) throw Error("No native split plate for this printing.");
  if (a === "m15") return fl(e, t, r);
  const s = a !== "old" && wt(t), n = vt(a, s);
  e.fillStyle = Re(t.setCode, t.borderColor).border, e.fillRect(0, 0, 488, 680), ve(t).forEach((o, i) => {
    const l = ul(o.face, a, s, i, r);
    e.save(), e.translate(o.x, o.y), e.rotate(-Math.PI / 2);
    const [d, c, h, u] = n.frame;
    e.drawImage(l, d - (s && i ? 8 * 680 / 523 : 0), c, h, u), e.restore();
  }), s && yl(e, t, r);
}
function vl(e, t, r, a, s) {
  if (r === "m15") return pl(e, t, s);
  const n = vt(r, a), o = r === "old", [i, l, d, c] = n.title, h = t.manaSymbols ?? [], u = 23.4, m = 1.7, g = 316, f = h.length * u + Math.max(0, h.length - 1) * m;
  if (e.fillStyle = o ? "#f2eee3" : "#17140f", e.textBaseline = "middle", e.textAlign = "left", o) {
    const R = e.getTransform();
    e.shadowColor = "#000b", e.shadowOffsetX = R.a + R.c, e.shadowOffsetY = R.b + R.d;
  }
  te(
    e,
    t.name,
    i,
    l + c / 2 - (o ? 2 : 0),
    Math.max(1, h.length ? g - f - i - 7 : d),
    o ? 29 : 26.5,
    !o,
    1,
    o ? "CardRenderer MTG Goudy" : "CardRenderer MTG Matrix"
  ), h.forEach(
    (R, M) => ee(e, R, g - f + M * (u + m), o ? 30.5 : 40, u, s, !o)
  );
  const w = Q(t), y = s.get(w ?? ""), p = Ne(t), [b, S, k, v] = n.type;
  if (te(
    e,
    t.typeLine ?? "",
    b,
    S + v / 2,
    k - (y ? 33 : 0),
    o ? 22 : 21.5,
    !1,
    1,
    o ? "CardRenderer MTG MPlantin" : "CardRenderer MTG Matrix"
  ), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, y) {
    const R = Math.min(
      32 / (y.width * p[2]),
      (o ? 26 : 22) / (y.height * p[3])
    ), M = y.width * p[2] * R, T = y.height * p[3] * R, x = [(o ? 306 : 316) - M, S + v / 2 - (o ? 1.5 : 0) - T / 2, M, T];
    Te(w) || t.setSymbol ? e.drawImage(y, ...x) : Ee(e, y, t.setCode, t.rarity, ...x, p);
  }
}
function Cl(e, t, r, a, s, n) {
  const o = vt(a, s), i = a === "old";
  e.fillStyle = i ? "#eeeae1" : "#17140f", e.textAlign = i ? "center" : "left", e.textBaseline = "middle", e.font = i ? '19px "CardRenderer MTG MPlantin", Georgia' : '700 14px "CardRenderer MTG Matrix", Georgia';
  const l = n.get(`${L}/img/manaSymbols/brush.svg`);
  if (!i && l && e.drawImage(l, 36, o.artistY - 4, 20, 8), i) {
    const d = e.getTransform();
    e.shadowColor = "#000b", e.shadowOffsetX = d.a + d.c, e.shadowOffsetY = d.b + d.d;
  }
  e.fillText(
    `${i ? "Illus. " : ""}${t.artist ?? r.artist ?? ""}`,
    i ? 177 : 60,
    o.artistY,
    272
  ), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.font = `${i ? 10.2 : 10}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && e.fillText(
    `${r.legalText}${r.collectorNumber ? " " + r.collectorNumber : ""}`,
    i ? 177 : 36,
    o.legalY,
    280
  );
}
function Rl(e, t, r, a, s) {
  const n = Ge(t);
  if (!n) throw Error("No native split plate for this printing.");
  const o = n !== "old" && wt(t), i = vt(n, o);
  e.save(), s !== "artwork" && kl(e, t, r), a && e.drawImage(a, 0, 0, 488, 680);
  for (const l of ve(t))
    e.save(), e.translate(l.x, l.y), e.rotate(-Math.PI / 2), ye(e, l.face, r, i.art, s), s !== "artwork" && (vl(e, l.face, n, o, r), ml(e, l.face, r, i.rules[1] + i.rules[3] / 2), he(e, Sl(e, l.face, n, o), r), n !== "m15" && Cl(e, l.face, t, n, o, r)), e.restore();
  if (n === "m15" && s !== "artwork" && bl(e, t, r), o && s !== "artwork") {
    e.translate(0, 680), e.rotate(-Math.PI / 2);
    const l = jn(t).map(
      (d) => n === "m15" ? { ...d, align: "center" } : d
    );
    he(
      e,
      Y(
        e,
        l,
        n === "m15" ? { x: 70, y: 441, width: 577, height: 20 } : { x: 38, y: 407, width: 608, height: 26 },
        n === "m15" ? 18 : 21,
        12
      ),
      r
    );
  }
  e.restore();
}
let ys;
function Ml(e) {
  return Ge(e) === "m15" ? a0() : Ge(e) !== "eighth" ? Promise.resolve() : ys ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('24px "CardRenderer MTG Matrix"')
  ]).then((t) => {
    if (t.some((r) => !r.length || r.some((a) => a.status !== "loaded")))
      throw Error("Split Matrix fonts are unavailable. Load card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw ys = void 0, t;
  });
}
const Tl = {
  maximumSize: 20.7,
  padding: 24,
  equalCells: 0,
  lastLift: 0,
  bottomSpace: 0.15
};
function xl(e, t, r = Tl) {
  const a = Nt(t), s = a.filter((f) => !f.badges.length), n = a.filter((f) => f.badges.length), o = (f, w = !1) => [
    {
      role: "rules",
      runs: w ? [{ text: f, italic: !0 }] : f.split(/(\([^)]*\))/g).filter(Boolean).map((y) => ({ text: y, italic: y.startsWith("(") }))
    }
  ], i = { leading: 0.98, paragraphGap: 0.3, flavorGap: 0 }, l = s.length ? 201 : 80, d = t.reverseStats && t.layout === "transform" ? 535 : 569, c = Y(
    e,
    s.flatMap((f) => o(f.text, f.reminder)),
    { x: 42.3, y: 78, width: 197, height: l - 80 },
    20.4,
    12,
    { ...i, centerOffset: -3 }
  );
  let h = r.maximumSize, u = [], m = [];
  for (; ; ) {
    const f = n.map(
      (S) => Math.max(
        Y(
          e,
          o(S.text),
          { x: 65.1, y: 0, width: 171, height: 2e3 },
          h,
          h,
          i
        ).height + r.padding,
        43 + Math.max(0, S.badges.length - 1) * 49 + 12
      )
    ), w = d - l;
    if (f.reduce((S, k) => S + k, 0) > w && h > 12) {
      h = Math.max(12, h - 0.25);
      continue;
    }
    if (f.reduce((S, k) => S + k, 0) > w)
      throw Error("Saga chapter text or badges do not fit the available column.");
    const y = Math.max(0, w - f.reduce((S, k) => S + k, 0)) * (1 - (n.length === 2 && n[0].badges.length > 1 ? r.bottomSpace : 0)) / Math.max(1, n.length);
    m = f.map((S) => S + y);
    const p = w / Math.max(1, n.length);
    m = m.map((S) => S * (1 - r.equalCells) + p * r.equalCells);
    let b = l;
    u = n.map((S, k) => {
      const v = m[k], R = Y(
        e,
        o(S.text),
        { x: 65.1, y: b + 7, width: 171, height: v - 14 },
        h,
        h,
        { ...i, centerOffset: k === n.length - 1 ? -r.lastLift : 0 }
      );
      return b += v, R;
    });
    break;
  }
  let g = l;
  return {
    reminder: c,
    size: h,
    rows: n.map((f, w) => {
      const y = { ...f, top: g, height: m[w], layout: u[w] };
      return g += y.height, y;
    })
  };
}
function Il(e, t, r, a, s) {
  const n = (v) => {
    const R = r.get(v);
    if (!R) throw Error(`Saga asset unavailable: ${v}`);
    return R;
  };
  e.save(), e.fillStyle = "#090806", e.fillRect(0, 0, C, I), a && e.drawImage(a, 0, 0, C, I), s !== "artwork" && (e.drawImage(n(En(t)), 0, 0, C, I), Qo(e, t, r));
  const o = On.art;
  if (ye(e, t, r, [o[0] * C, o[1] * I, o[2] * C, o[3] * I], s), s === "artwork") {
    e.restore();
    return;
  }
  const i = Zr(t);
  i && e.drawImage(n(i), 33.5, 35.6, 29, 32), e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const l = t.manaSymbols ?? [], d = 23.4, c = 1.8, h = 452, u = l.length * d + Math.max(0, l.length - 1) * c, m = t.layout === "transform" ? 78 : 41.7;
  te(
    e,
    t.name,
    m,
    51,
    (l.length ? h - u - 8 : 449) - m,
    26,
    !0
  ), l.forEach(
    (v, R) => ee(e, v, h - u + R * (d + c), 38.7, d, r, !0)
  );
  const g = Q(t), f = r.get(g ?? ""), w = Ne(t), y = f ? Math.min(58.56 / (f.width * w[2]), 25.9 / (f.height * w[3])) : 0, p = f ? f.width * w[2] * y : 0, b = f ? f.height * w[3] * y : 0, S = [450.3 - p, 594.25 - b / 2, p, b];
  te(
    e,
    t.typeLine ?? "",
    41.7,
    594.5,
    (f ? S[0] - 7 : 449) - 41.7,
    22,
    !0
  ), f && (Te(g) || t.setSymbol ? e.drawImage(f, ...S) : Ee(e, f, t.setCode, t.rarity, ...S, w)), t.reverseStats && t.layout === "transform" && (e.fillStyle = "#65605a", e.font = 'italic 20px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.fillText(`${t.reverseStats.power}/${t.reverseStats.toughness}`, 41, 553));
  const k = xl(e, t);
  he(e, k.reminder, r);
  for (const v of k.rows)
    e.drawImage(n(An), 48.8, v.top - 1, 192.6, 2), he(e, v.layout, r), v.badges.forEach((R, M) => {
      const T = v.top + v.height / 2 + (M - (v.badges.length - 1) / 2) * 49;
      e.drawImage(n(Ln), 18.8, T - 21.4, 38.4, 42.8), e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = '550 22px "CardRenderer MTG Chapter", Georgia', e.fillText(R, 38.1, T + 0.7);
    });
  xe(t) && e.drawImage(n(_t), ...St.saga), e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""}  ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.font = '11px "CardRenderer MTG Artist Credit", serif', t.artist && e.fillText("a", 93, 658), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(t.artist ?? "", 108, 658, 210), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 646, 182)), e.restore();
}
let Ss = null;
function Bl() {
  return Ss ??= document.fonts.load('550 22px "CardRenderer MTG Chapter"').then((e) => {
    if (!e.length || e.some((t) => t.status !== "loaded"))
      throw Error("Saga chapter numerals need card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw Ss = null, e;
  });
}
function jl(e, t, r) {
  const [a, s, n, o] = (r ? xa : Ta).rules, i = Mt({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), l = { x: a, y: s, width: n, height: o }, d = {
    leading: 0.98,
    paragraphGap: 0.32,
    flavorGap: 0.65,
    centerOffset: r ? 0 : 2.5
  };
  let c = r ? 22 : t.setCode?.toLowerCase() === "hou" ? 24.5 : 22.5, h = Y(e, i, l, c, 14, d);
  if (!r && i.length === 1 && h.lines.length > 1 && h.lines.at(-1).width < n * 0.18)
    for (let u = c - 0.25; u >= c * 0.9; u -= 0.25) {
      const m = Y(e, i, l, u, u, d);
      if (!m.overflow && m.lines.length < h.lines.length) {
        c = u, h = m;
        break;
      }
    }
  if (!r && t.rulesAlignment?.mode !== "left") {
    const u = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? i : i, m = Rt(
      e,
      i,
      u,
      l,
      c,
      14,
      1,
      d
    );
    if (m) return m;
  }
  return h;
}
function $l(e, t, r, a, s) {
  const n = ve(t), o = (i) => {
    const l = r.get(i);
    if (!l) throw Error(`Aftermath asset unavailable: ${i}`);
    return l;
  };
  e.save(), e.fillStyle = "#090806", e.fillRect(0, 0, 488, 680), a && e.drawImage(a, 0, 0, 488, 680), s !== "artwork" && n.forEach((i, l) => {
    e.save(), e.beginPath(), e.rect(0, l ? Qe : 0, 488, l ? 680 - Qe : Qe), e.clip(), e.drawImage(o(xn(i.face)), 0, 0, 488, 680), e.restore();
  }), n.forEach((i, l) => {
    e.save(), l && (e.translate(488, Qe), e.rotate(Math.PI / 2));
    const d = i.face, c = l ? xa : Ta;
    if (ye(e, d, r, c.art, s), s !== "artwork") {
      e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
      const h = d.manaSymbols ?? [], u = 23.4, m = 1.6, g = l ? 246 : 451, f = h.length * u + Math.max(0, h.length - 1) * m, [w, y] = c.title;
      te(e, d.name, w, y + 15.5, g - f - w - 7, 26, !0), h.forEach(
        (b, S) => ee(e, b, g - f + S * (u + m), y + 3, u, r, !0)
      );
      const p = l ? void 0 : r.get(Q(d) ?? "");
      if (te(
        e,
        d.typeLine ?? "",
        c.type[0],
        c.type[1] + 16.5,
        c.type[2] - (p ? 45 : 0),
        23,
        !0
      ), p) {
        const b = Ne(d), S = Math.min(50 / (p.width * b[2]), 27 / (p.height * b[3])), k = p.width * b[2] * S, v = p.height * b[3] * S, R = [451 - k, 252.3 - v / 2, k, v];
        Te(Q(d)) || d.setSymbol ? e.drawImage(p, ...R) : Ee(e, p, d.setCode, d.rarity, ...R, b);
      }
      he(e, jl(e, d, !!l), r);
    }
    e.restore();
  }), s !== "artwork" && (xe(t) && e.drawImage(o(Tn), ...St.aftermath), e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""}  ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.font = '11px "CardRenderer MTG Artist Credit", serif', t.artist && e.fillText("a", 93, 658), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(t.artist ?? "", 108, 658, 220), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 646, 177))), e.restore();
}
function Gl(e, t, r, a) {
  const s = a.inkExpansion ?? 0;
  if (!Number.isFinite(s) || s < 0 || s > 1)
    throw Error("Historical mana ink expansion is outside its supported range.");
  if (!s) return;
  if (!Number.isInteger(t) || !Number.isInteger(r) || t <= 0 || r <= 0 || e.length !== t * r * 4)
    throw Error("Historical mana ink pixels do not match their dimensions.");
  const n = pt(a.discColor), o = pt(a.inkColor), i = n.map((m, g) => m - o[g]), l = i.reduce((m, g) => m + g * g, 0);
  if (l < 0.01) throw Error("Historical mana palette has no ink contrast");
  const d = new Float32Array(t * r);
  for (let m = 0; m < d.length; m++)
    e[m * 4 + 3] < 255 || (d[m] = Math.max(
      0,
      Math.min(1, i.reduce((g, f, w) => g + f * (n[w] - e[m * 4 + w] / 255), 0) / l)
    ));
  const c = Math.min(t, r) * s / 24, h = Math.ceil(c), u = [];
  for (let m = -h; m <= h; m++)
    for (let g = -h; g <= h; g++) {
      const f = Math.max(0, Math.min(1, c + 1 - Math.hypot(g, m)));
      f && u.push({ x: g, y: m, weight: f });
    }
  for (let m = 0; m < r; m++)
    for (let g = 0; g < t; g++) {
      const f = m * t + g;
      if (e[f * 4 + 3] < 255) continue;
      let w = d[f];
      for (const y of u) {
        const p = g + y.x, b = m + y.y;
        p >= 0 && p < t && b >= 0 && b < r && (w = Math.max(w, d[b * t + p] * y.weight));
      }
      if (!(w <= d[f]))
        for (let y = 0; y < 3; y++)
          e[f * 4 + y] = Math.round(255 * (n[y] * (1 - w) + o[y] * w));
    }
}
function El(e, t, r) {
  const a = pt(t.discColor), s = pt(t.inkColor), n = a.map((i, l) => i - s[l]), o = n.reduce((i, l) => i + l * l, 0);
  if (o < 0.01) throw Error("Historical mana palette has no ink contrast");
  for (let i = 0; i < e.length; i += 4) {
    if (!e[i + 3]) continue;
    const l = Math.max(
      0,
      Math.min(1, n.reduce((d, c, h) => d + (e[i + h] / 255 - s[h]) * c, 0) / o)
    );
    for (let d = 0; d < 3; d++)
      e[i + d] = Math.round(255 * (s[d] * (1 - l) + r[d] * l));
  }
}
async function Ll(e, t, r) {
  const a = document.createElement("canvas");
  a.width = e.width, a.height = e.height;
  try {
    const s = a.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("Historical mana preparation needs Canvas2D.");
    s.drawImage(e, 0, 0);
    const n = s.getImageData(0, 0, a.width, a.height);
    return t.inkExpansion && Gl(n.data, a.width, a.height, t), El(n.data, t, r), s.putImageData(n, 0, 0), await createImageBitmap(a);
  } finally {
    a.width = a.height = 0;
  }
}
const Ur = (e) => {
  const t = Math.max(0, Math.min(1, e));
  return t * t * (3 - 2 * t);
}, Fr = (e) => {
  const t = Math.max(1e-3, e[0] + e[1] + e[2]);
  return e.map((r) => r / t);
};
function ks(e, t) {
  const { width: r, height: a, data: s } = e, n = new Float32Array(r * a);
  if (t.kind === "polygon") {
    if (t.points.length < 3 || !Number.isFinite(t.feather) || t.feather <= 0 || t.points.some((T) => T.some((x) => !Number.isFinite(x) || x < 0 || x > 1)))
      throw Error(
        "Paper outline requires at least three normalized points and positive feathering."
      );
    const b = t.points.map(([T, x]) => [T * r, x * a]), S = t.feather * r, k = Math.max(0, Math.floor(Math.min(...b.map((T) => T[0])) - S)), v = Math.min(r, Math.ceil(Math.max(...b.map((T) => T[0])) + S)), R = Math.max(0, Math.floor(Math.min(...b.map((T) => T[1])) - S)), M = Math.min(a, Math.ceil(Math.max(...b.map((T) => T[1])) + S));
    for (let T = R; T < M; T++)
      for (let x = k; x < v; x++) {
        let B = !1, A = 1 / 0;
        const j = x + 0.5, E = T + 0.5;
        for (let P = 0; P < b.length; P++) {
          const [W, re] = b[P], [ae, U] = b[(P + 1) % b.length], F = ae - W, G = U - re, Z = F * F + G * G, H = Z ? Math.max(0, Math.min(1, ((j - W) * F + (E - re) * G) / Z)) : 0;
          A = Math.min(A, Math.hypot(j - W - H * F, E - re - H * G)), re > E != U > E && j < W + (E - re) * F / G && (B = !B);
        }
        n[T * r + x] = Ur((B ? A : -A) / S + 0.5);
      }
    return n;
  }
  if (t.kind === "rect") {
    const [b, S, k, v] = t.rect;
    for (let R = 0; R < a; R++)
      for (let M = 0; M < r; M++) {
        const T = Math.min(
          M / r - b,
          b + k - M / r,
          R / a - S,
          S + v - R / a
        );
        n[R * r + M] = Ur(T / t.feather + 0.5);
      }
    return n;
  }
  const o = Fr(t.frameRgb), i = Fr(t.paperRgb), l = i.map((b, S) => b - o[S]), d = l.reduce((b, S) => b + S * S, 0);
  if (d < 1e-3) throw Error("Paper and frame chroma are too similar for this mask.");
  const [c, h, u, m] = t.bounds;
  for (let b = 0; b < a; b++)
    for (let S = 0; S < r; S++) {
      if (S / r < c || S / r > c + u || b / a < h || b / a > h + m)
        continue;
      const k = b * r + S, v = k * 4;
      if (s[v + 3] < 250) continue;
      const M = Fr([s[v] / 255, s[v + 1] / 255, s[v + 2] / 255]).reduce((T, x, B) => T + (x - o[B]) * l[B], 0) / d;
      n[k] = Ur((M - 0.22) / 0.56);
    }
  const g = new Uint8Array(n.length), f = new Int32Array(n.length), w = Math.round(t.seed[1] * a) * r + Math.round(t.seed[0] * r);
  if (!(n[w] > 0.08)) throw Error("Paper mask seed is outside the paper.");
  let y = 0, p = 1;
  for (f[0] = w, g[w] = 1; y < p; ) {
    const b = f[y++], S = b % r;
    for (const k of [b - r, b + r, S ? b - 1 : -1, S < r - 1 ? b + 1 : -1])
      k >= 0 && k < g.length && !g[k] && n[k] > 0.08 && (g[k] = 1, f[p++] = k);
  }
  for (let b = 0; b < n.length; b++) g[b] || (n[b] = 0);
  return n;
}
const _r = (e) => {
  const t = Math.max(0, Math.min(1, e));
  return t * t * (3 - 2 * t);
}, vs = ([e, t, r, a], s, n) => s >= e && n >= t && s < e + r && n < t + a;
function Al(e, t) {
  if (!(t.hueCenter >= 0 && t.hueCenter < 360) || !(t.hueRadius > 0 && t.hueRadius <= 180) || !(t.hueFeather > 0 && t.hueFeather <= t.hueRadius) || !(t.saturation[0] >= 0 && t.saturation[1] > t.saturation[0] && t.saturation[1] <= 1) || t.brightness !== void 0 && !(t.brightness[0] >= 0 && t.brightness[1] > t.brightness[0] && t.brightness[1] <= 1))
    throw Error("Invalid source pigment mask.");
  for (const { outer: a, inner: s } of t.rings)
    if (![...a, ...s].every(Number.isFinite) || a[2] <= 0 || a[3] <= 0 || s[2] <= 0 || s[3] <= 0 || s[0] < a[0] || s[1] < a[1] || // Normalized shared edges can differ by one floating-point rounding bit.
    s[0] + s[2] > a[0] + a[2] + 1e-12 || s[1] + s[3] > a[1] + a[3] + 1e-12)
      throw Error("Source pigment rings need nested positive rectangles.");
  const r = new Float32Array(e.width * e.height);
  for (let a = 0; a < e.height; a++)
    for (let s = 0; s < e.width; s++) {
      const n = a * e.width + s, o = n * 4, i = (s + 0.5) / e.width, l = (a + 0.5) / e.height;
      if (!e.data[o + 3] || !t.rings.some((m) => vs(m.outer, i, l) && !vs(m.inner, i, l)))
        continue;
      const [d, c, h] = cr([
        e.data[o] / 255,
        e.data[o + 1] / 255,
        e.data[o + 2] / 255
      ]), u = Math.abs((d - t.hueCenter + 540) % 360 - 180);
      r[n] = _r((t.hueRadius - u) / t.hueFeather) * _r((c - t.saturation[0]) / (t.saturation[1] - t.saturation[0])) * (t.brightness ? _r((h - t.brightness[0]) / (t.brightness[1] - t.brightness[0])) : 1);
    }
  return r;
}
function Ol(e, t) {
  const r = "mask" in t ? t : void 0, a = r ? ks(e, r.mask) : void 0, s = "mask" in t ? t.frame : t, n = r?.regions?.map((i) => ({
    values: ks(e, i.mask),
    adjustment: i.adjustment
  })) ?? [], o = [
    ...n,
    ...r?.accents?.map((i) => ({
      values: Al(e, i.mask),
      adjustment: i.adjustment
    })) ?? []
  ];
  for (let i = 0; i < e.data.length; i += 4) {
    if (e.data[i + 3] === 0) continue;
    const l = [e.data[i] / 255, e.data[i + 1] / 255, e.data[i + 2] / 255], d = Math.max(...l), c = d === 0 ? 0 : (d - Math.min(...l)) / d;
    if (d < 0.075 || !r && c < 0.025 && d > 0.97) continue;
    const h = a?.[i / 4] ?? 0, u = Be(l, h === 1 && r ? r.paper : s), m = h > 0 && h < 1 && r ? Be(l, r.paper) : u;
    for (let g = 0; g < 3; g++)
      e.data[i + g] = Math.round(
        Math.round(255 * u[g]) * (1 - h) + Math.round(255 * m[g]) * h
      );
    for (const g of o) {
      const f = g.values[i / 4];
      if (!f) continue;
      const w = Be(l, g.adjustment);
      for (let y = 0; y < 3; y++)
        e.data[i + y] = Math.round(
          e.data[i + y] * (1 - f) + 255 * w[y] * f
        );
    }
  }
}
function l0(e) {
  const t = e.setCode?.toLowerCase();
  if (!t || !["lea", "leb", "3ed", "leg", "8ed", "m21"].includes(t) || e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return;
  const r = Me(e);
  if (de(e)) {
    if (Ut(e) || pe(e)) return;
    const o = Ue(e), i = ka(e);
    return {
      key: `${t}/${r}/retro/${o.split("/").at(-1)}`,
      family: "retro",
      frame: o,
      rect: i,
      assets: { frame: o },
      source: JSON.stringify([o, i])
    };
  }
  const a = Ae(e);
  if (a)
    return a.rightFrame ? void 0 : {
      key: `${t}/${r}/${e.frameAssetFamily}/${a.frame.split("/").at(-1)}`,
      family: "plate",
      frame: a.frame,
      rect: a.rects.frame,
      assets: { frame: a.frame, pt: a.pt },
      source: JSON.stringify([a.frame, a.rects])
    };
  const s = J(e);
  if (s.land) return;
  const n = pr(s);
  return {
    key: `${t}/${r}/components/${s.boxes}/${s.frame}`,
    family: "components",
    frame: n.frame,
    rect: V.frame,
    assets: n,
    source: JSON.stringify([n, V.frame, La(e)])
  };
}
const Dl = {
  "lea/black/retro/r.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 6.19600667693885,
          saturationScale: 0.7922304208065458,
          brightnessScale: 1.0507246376811594
        },
        mask: {
          kind: "rect",
          rect: [0.125, 0.5985294117647059, 0.7540983606557377, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "lea/black/retro/b.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png": {
        frame: {
          hueDegrees: 13.713669950738904,
          saturationScale: 0.35,
          brightnessScale: 0.9468014705882352
        },
        paper: {
          hueDegrees: -5.9959677419354875,
          saturationScale: 0.8356642416225748,
          brightnessScale: 0.8472803347280334
        },
        mask: {
          kind: "chroma",
          bounds: [
            0.09221311475409837,
            0.5823529411764706,
            0.8176229508196722,
            0.3176470588235294
          ],
          seed: [0.5, 0.7352941176470589],
          frameRgb: [0.17647058823529413, 0.2196078431372549, 0.23333333333333334],
          paperRgb: [0.9372549019607843, 0.8, 0.5941176470588235]
        }
      }
    }
  },
  "lea/black/retro/w.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png": {
        frame: {
          hueDegrees: -1.9455801551389413,
          saturationScale: 0.7314003493819718,
          brightnessScale: 0.9157372986369269
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.5369823232323239,
          brightnessScale: 0.9283274647887324
        },
        mask: {
          kind: "rect",
          rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2867647058823529],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "lea/black/retro/u.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: -4.361205868715615,
          saturationScale: 0.8628778854690737,
          brightnessScale: 0.9083333333333334
        },
        mask: {
          kind: "rect",
          rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "lea/black/retro/a.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png": {
        frame: {
          hueDegrees: -7.274193548387075,
          saturationScale: 0.35562499999999997,
          brightnessScale: 0.9191176470588236
        },
        paper: {
          hueDegrees: 19.625509683995915,
          saturationScale: 0.5469330921588732,
          brightnessScale: 0.953902027027027
        },
        mask: {
          kind: "rect",
          rect: [0.1290983606557377, 0.6014705882352941, 0.7459016393442623, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "lea/black/retro/g.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png": {
        frame: {
          hueDegrees: 5.3103223868643,
          saturationScale: 1.0757874102425145,
          brightnessScale: 0.9585714285714285
        },
        paper: {
          hueDegrees: 13.446120689655118,
          saturationScale: 0.7340938995215308,
          brightnessScale: 0.9952380952380953
        },
        mask: {
          kind: "chroma",
          bounds: [
            0.09221311475409837,
            0.5823529411764706,
            0.8176229508196722,
            0.3176470588235294
          ],
          seed: [0.5, 0.7352941176470589],
          frameRgb: [0.23529411764705882, 0.3431372549019608, 0.28823529411764703],
          paperRgb: [0.4117647058823529, 0.2784313725490196, 0.2549019607843137]
        }
      }
    }
  },
  "leb/black/retro/b.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: -4.7686688311688386,
          saturationScale: 0.8968524740378744,
          brightnessScale: 0.8561715481171549
        },
        mask: {
          kind: "chroma",
          bounds: [
            0.09221311475409837,
            0.5823529411764706,
            0.8176229508196722,
            0.3176470588235294
          ],
          seed: [0.5, 0.7352941176470589],
          frameRgb: [0.17647058823529413, 0.2196078431372549, 0.23333333333333334],
          paperRgb: [0.9372549019607843, 0.8, 0.5941176470588235]
        }
      }
    }
  },
  "leb/black/retro/a.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png": {
        frame: {
          hueDegrees: 3.454973118279554,
          saturationScale: 0.7697448531690021,
          brightnessScale: 1.1482843137254901
        },
        paper: {
          hueDegrees: 10.923435302390999,
          saturationScale: 0.6795040998710152,
          brightnessScale: 1.0864864864864865
        },
        mask: {
          kind: "rect",
          rect: [0.1290983606557377, 0.6014705882352941, 0.7459016393442623, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leb/black/retro/u.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: -3.8366935483870748,
          saturationScale: 0.8704517231244031,
          brightnessScale: 0.9755555555555556
        },
        mask: {
          kind: "rect",
          rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leb/black/retro/w.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png": {
        frame: {
          hueDegrees: 5.7318354170936345,
          saturationScale: 0.9083203924844794,
          brightnessScale: 0.9535315985130112
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.37687499999999974,
          brightnessScale: 0.9554753521126761
        },
        mask: {
          kind: "rect",
          rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2867647058823529],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leb/black/retro/r.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png": {
        frame: {
          hueDegrees: 1.0502281478526356,
          saturationScale: 0.9263662460655555,
          brightnessScale: 1.033678756476684
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        mask: {
          kind: "rect",
          rect: [0.125, 0.5985294117647059, 0.7540983606557377, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "3ed/white/retro/g.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.012,0.01,0.974,0.982]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png": {
        frame: {
          hueDegrees: 5.471739130434798,
          saturationScale: 0.5185480300467616,
          brightnessScale: 1.0258215962441315
        },
        paper: {
          hueDegrees: 4.58143939393949,
          saturationScale: 0.6677094989990247,
          brightnessScale: 0.6988950276243093
        },
        mask: {
          kind: "chroma",
          bounds: [
            0.08235432726293468,
            0.5828441356175872,
            0.8394486148045915,
            0.32346951000359414
          ],
          seed: [0.5010266940451745, 0.7385887145082066],
          frameRgb: [0.2372549019607843, 0.4176470588235294, 0.307843137254902],
          paperRgb: [0.7098039215686275, 0.5450980392156862, 0.40784313725490196]
        }
      }
    }
  },
  "3ed/white/retro/b.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png",[0.012,0.01,0.974,0.982]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png": {
        frame: {
          hueDegrees: 11.54464285714289,
          saturationScale: 0.47346938775510233,
          brightnessScale: 1.0560344827586208
        },
        paper: {
          hueDegrees: 7.102125850340144,
          saturationScale: 0.6318309135734831,
          brightnessScale: 0.9048582995951417
        },
        mask: {
          kind: "chroma",
          bounds: [
            0.08235432726293468,
            0.5828441356175872,
            0.8394486148045915,
            0.32346951000359414
          ],
          seed: [0.5010266940451745, 0.7385887145082066],
          frameRgb: [0.18823529411764706, 0.23137254901960785, 0.19509803921568628],
          paperRgb: [0.9686274509803922, 0.7450980392156863, 0.5843137254901961]
        }
      }
    }
  },
  "3ed/white/retro/r.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.012,0.01,0.974,0.982]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png": {
        frame: {
          hueDegrees: -8.208153724492945,
          saturationScale: 0.7128092625825923,
          brightnessScale: 0.8324873096446699
        },
        paper: {
          hueDegrees: -0.25087535014006335,
          saturationScale: 0.6409551457194901,
          brightnessScale: 0.7698317307692307
        },
        mask: {
          kind: "rect",
          rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "3ed/white/retro/w.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.012,0.01,0.974,0.982]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png": {
        frame: {
          hueDegrees: 2.2140372724149984,
          saturationScale: 0.7157374226207257,
          brightnessScale: 1.1161684782608696
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.7983487654320984,
          brightnessScale: 0.9515418502202644
        },
        mask: {
          kind: "rect",
          rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "3ed/white/retro/a.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.012,0.01,0.974,0.982]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png": {
        frame: {
          hueDegrees: 1.5746966632962085,
          saturationScale: 0.5767416007905141,
          brightnessScale: 1.08641975308642
        },
        paper: {
          hueDegrees: 7.025452488687733,
          saturationScale: 0.6375122549019618,
          brightnessScale: 0.9896907216494846
        },
        mask: {
          kind: "rect",
          rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "8ed/white/eighth/w.png": {
    source: '["https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png",{"background":[0,0,1,1],"legendaryBackground":[0.03937,0.03993,0.92126,0.88976],"frame":[0,0,1,1],"crown":[0.01575,0.01687,0.9622,0.15748],"title":[0.09,0.0629,0.824,0.0429],"art":[0.08955223880597014,0.12117981520966596,0.8238805970149253,0.43212508884150674],"type":[0.10199004975124377,0.5724946695095949,0.7965174129353234,0.0358],"rules":[0.10199004975124377,0.6321961620469083,0.7940298507462686,0.25906183368869934],"stats":[0.7268656716417911,0.8816631130063965,0.20597014925373133,0.07746979388770434],"footer":[0.07462686567164178,0.9228571428571428,0.81,0.04],"stamp":[0.34,0.6451764705882354,0.32,0.2296470588235294]}]',
    materials: {
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.8462234042553245,
          brightnessScale: 0.9432056451612905
        },
        mask: {
          kind: "rect",
          rect: [0.082, 0.627, 0.838, 0.29],
          feather: 9950248756218905e-19
        }
      },
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pt/w.png": {
        hueDegrees: 0,
        saturationScale: 0.8462234042553245,
        brightnessScale: 0.9432056451612905
      }
    }
  },
  "8ed/white/eighth/g.png": {
    source: '["https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png",{"background":[0,0,1,1],"legendaryBackground":[0.03937,0.03993,0.92126,0.88976],"frame":[0,0,1,1],"crown":[0.01575,0.01687,0.9622,0.15748],"title":[0.09,0.0629,0.824,0.0429],"art":[0.08955223880597014,0.12117981520966596,0.8238805970149253,0.43212508884150674],"type":[0.10199004975124377,0.5724946695095949,0.7965174129353234,0.0358],"rules":[0.10199004975124377,0.6321961620469083,0.7940298507462686,0.25906183368869934],"stats":[0.7268656716417911,0.8816631130063965,0.20597014925373133,0.07746979388770434],"footer":[0.07462686567164178,0.9228571428571428,0.81,0.04],"stamp":[0.34,0.6451764705882354,0.32,0.2296470588235294]}]',
    materials: {
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6045238095238094,
          brightnessScale: 0.9720380434782608
        },
        mask: {
          kind: "rect",
          rect: [0.082, 0.627, 0.838, 0.29],
          feather: 9950248756218905e-19
        }
      },
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pt/g.png": {
        hueDegrees: 0,
        saturationScale: 0.6045238095238094,
        brightnessScale: 0.9720380434782608
      }
    }
  },
  "8ed/white/eighth/u.png": {
    source: '["https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png",{"background":[0,0,1,1],"legendaryBackground":[0.03937,0.03993,0.92126,0.88976],"frame":[0,0,1,1],"crown":[0.01575,0.01687,0.9622,0.15748],"title":[0.09,0.0629,0.824,0.0429],"art":[0.08955223880597014,0.12117981520966596,0.8238805970149253,0.43212508884150674],"type":[0.10199004975124377,0.5724946695095949,0.7965174129353234,0.0358],"rules":[0.10199004975124377,0.6321961620469083,0.7940298507462686,0.25906183368869934],"stats":[0.7268656716417911,0.8816631130063965,0.20597014925373133,0.07746979388770434],"footer":[0.07462686567164178,0.9228571428571428,0.81,0.04],"stamp":[0.34,0.6451764705882354,0.32,0.2296470588235294]}]',
    materials: {
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 1.275610047846888,
          brightnessScale: 0.944808091286307
        },
        mask: {
          kind: "rect",
          rect: [0.082, 0.627, 0.838, 0.29],
          feather: 9950248756218905e-19
        }
      },
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pt/u.png": {
        hueDegrees: 0,
        saturationScale: 1.275610047846888,
        brightnessScale: 0.944808091286307
      }
    }
  },
  "m21/black/components/U/U": {
    source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/U.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/U.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/U.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/U.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
    materials: {
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/U.webp": {
        frame: {
          hueDegrees: 17.337752059074205,
          saturationScale: 0.7776986444212719,
          brightnessScale: 0.9675141242937855
        },
        paper: {
          hueDegrees: 8.888888888888914,
          saturationScale: 0.6314814814814816,
          brightnessScale: 0.967741935483871
        },
        mask: {
          kind: "rect",
          rect: [
            0.032440800650188735,
            0.6662377838116825,
            0.9396578084020479,
            0.3172337426923378
          ],
          feather: 0.0026041666666666665
        }
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/U.webp": {
        hueDegrees: 8.888888888888914,
        saturationScale: 0.6314814814814816,
        brightnessScale: 0.967741935483871
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/U.webp": {
        hueDegrees: 17.337752059074205,
        saturationScale: 0.7776986444212719,
        brightnessScale: 0.9675141242937855
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp": {
        hueDegrees: 8.888888888888914,
        saturationScale: 0.6314814814814816,
        brightnessScale: 0.967741935483871
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/U.webp": {
        hueDegrees: 17.337752059074205,
        saturationScale: 0.7776986444212719,
        brightnessScale: 0.9675141242937855
      }
    }
  },
  "m21/black/components/G/G": {
    source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/G.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/G.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/G.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/G.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
    materials: {
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/G.webp": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.35,
          brightnessScale: 0.9580706521739131
        },
        mask: {
          kind: "rect",
          rect: [
            0.032440800650188735,
            0.6662377838116825,
            0.9396578084020479,
            0.3172337426923378
          ],
          feather: 0.0026041666666666665
        }
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/G.webp": {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.9580706521739131
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/G.webp": {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp": {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.9580706521739131
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/G.webp": {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      }
    }
  },
  "m21/black/components/R/R": {
    source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
    materials: {
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp": {
        frame: {
          hueDegrees: 10.298505477140054,
          saturationScale: 0.9250450145969191,
          brightnessScale: 0.8881656804733729
        },
        paper: {
          hueDegrees: -4.114932885906114,
          saturationScale: 0.6159725971922244,
          brightnessScale: 0.9448979591836735
        },
        mask: {
          kind: "rect",
          rect: [
            0.032440800650188735,
            0.6662377838116825,
            0.9396578084020479,
            0.3172337426923378
          ],
          feather: 0.0026041666666666665
        }
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp": {
        hueDegrees: -4.114932885906114,
        saturationScale: 0.6159725971922244,
        brightnessScale: 0.9448979591836735
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp": {
        hueDegrees: 10.298505477140054,
        saturationScale: 0.9250450145969191,
        brightnessScale: 0.8881656804733729
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp": {
        hueDegrees: -4.114932885906114,
        saturationScale: 0.6159725971922244,
        brightnessScale: 0.9448979591836735
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp": {
        hueDegrees: 10.298505477140054,
        saturationScale: 0.9250450145969191,
        brightnessScale: 0.8881656804733729
      }
    }
  },
  "m21/black/components/Artifact/Artifact": {
    source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Artifact.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Artifact.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Artifact.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/Artifact.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
    materials: {
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Artifact.webp": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 37.25414989939645,
          saturationScale: 0.7848398354730142,
          brightnessScale: 0.9923161361141603
        },
        mask: {
          kind: "rect",
          rect: [
            0.032440800650188735,
            0.6662377838116825,
            0.9396578084020479,
            0.3172337426923378
          ],
          feather: 0.0026041666666666665
        }
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/Artifact.webp": {
        hueDegrees: 37.25414989939645,
        saturationScale: 0.7848398354730142,
        brightnessScale: 0.9923161361141603
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Artifact.webp": {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp": {
        hueDegrees: 37.25414989939645,
        saturationScale: 0.7848398354730142,
        brightnessScale: 0.9923161361141603
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Artifact.webp": {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      }
    }
  }
}, Wl = {
  "leg/black/retro/w.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",[-0.015000000000000013,-0.016735294117647074,1.03,1.032]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png": {
        frame: {
          hueDegrees: 31.5,
          saturationScale: 0.7737499999999997,
          brightnessScale: 1.0418750000000003
        },
        paper: {
          hueDegrees: 46.92434210526312,
          saturationScale: 1.3968055555555547,
          brightnessScale: 1.1227453271028038
        },
        mask: {
          kind: "rect",
          rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2867647058823529],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leg/black/retro/u.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.006241180327868882,0.003875294117647035,0.989584,0.995748]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png": {
        frame: {
          hueDegrees: -6,
          saturationScale: 0.6031249999999994,
          brightnessScale: 1.0975000000000001
        },
        paper: {
          hueDegrees: -10.598914565826249,
          saturationScale: 0.9226579520697171,
          brightnessScale: 1.0041322314049586
        },
        mask: {
          kind: "rect",
          rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leg/black/retro/b.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.015000000000000013,-0.016470588235294133,1.03,1.03]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 5.6763925729442235,
          saturationScale: 0.8794297625777275,
          brightnessScale: 1.0209205020920502
        },
        mask: {
          kind: "chroma",
          bounds: [
            0.09221311475409837,
            0.5823529411764706,
            0.8176229508196722,
            0.3176470588235294
          ],
          seed: [0.5, 0.7352941176470589],
          frameRgb: [0.17647058823529413, 0.22450980392156863, 0.23627450980392156],
          paperRgb: [0.9372549019607843, 0.8, 0.596078431372549]
        }
      }
    }
  },
  "leg/black/retro/r.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.006241180327868882,0.004610588235294094,0.989584,0.995748]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 21.86087449126046,
          saturationScale: 0.9073305928571983,
          brightnessScale: 0.850835322195704
        },
        accents: [
          {
            mask: {
              rings: [
                {
                  outer: [
                    0.08894759288155257,
                    0.07955119284846228,
                    0.8241582023272438,
                    0.47702832443549975
                  ],
                  inner: [
                    0.10344283764610208,
                    0.07955119284846228,
                    0.8096629575626944,
                    0.4652133814154255
                  ]
                }
              ],
              hueCenter: 0,
              hueRadius: 70,
              hueFeather: 10,
              saturation: [0.01, 0.08],
              brightness: [0.65, 0.85]
            },
            adjustment: {
              hueDegrees: 9.95535714285711,
              saturationScale: 0.8848407077066573,
              brightnessScale: 1.003157894736842
            }
          },
          {
            mask: {
              rings: [
                {
                  outer: [
                    0.10344283764610208,
                    0.5964549499767128,
                    0.7889554650419093,
                    0.30128104701189456
                  ],
                  inner: [
                    0.11793808241065161,
                    0.5964549499767128,
                    0.7744602202773598,
                    0.2924198397468389
                  ]
                }
              ],
              hueCenter: 0,
              hueRadius: 70,
              hueFeather: 10,
              saturation: [0.01, 0.08],
              brightness: [0.65, 0.85]
            },
            adjustment: {
              hueDegrees: 33.20021777976331,
              saturationScale: 0.8716772230501736,
              brightnessScale: 0.9551148225469728
            }
          }
        ],
        mask: {
          kind: "rect",
          rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leg/black/retro/g.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.007265770491803308,0.004855294117647071,0.989584,0.993784]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png": {
        frame: {
          hueDegrees: -9.546487090367464,
          saturationScale: 0.9883385744234803,
          brightnessScale: 1.2090680100755669
        },
        paper: {
          hueDegrees: 23.60706205559154,
          saturationScale: 0.9735775550740341,
          brightnessScale: 0.7845303867403315
        },
        mask: {
          kind: "chroma",
          bounds: [
            0.08235432726293468,
            0.5828441356175872,
            0.8394486148045915,
            0.32346951000359414
          ],
          seed: [0.5010266940451745, 0.7385887145082066],
          frameRgb: [0.23333333333333334, 0.38921568627450975, 0.28137254901960784],
          paperRgb: [0.7098039215686275, 0.5450980392156862, 0.403921568627451]
        }
      }
    }
  },
  "leg/black/retro/a.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.006192590163934432,0.004855294117647071,0.987636,0.993784]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png": {
        frame: {
          hueDegrees: 24.352415966386616,
          saturationScale: 1.09714025198939,
          brightnessScale: 1.158811475409836
        },
        paper: {
          hueDegrees: 18.140759005145696,
          saturationScale: 0.8517161410018563,
          brightnessScale: 1.0706188596859518
        },
        mask: {
          kind: "rect",
          rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leg/black/retro/l.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png",[0.0052165901639344555,0.00559058823529413,0.989584,0.993784]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [1.21125, 1.2400000000000002, 0.98875]
        },
        paper: {
          hueDegrees: 14.93891019140574,
          saturationScale: 0.9333152173913042,
          brightnessScale: 1
        },
        mask: {
          kind: "rect",
          rect: [0.1265358333052816, 0.6083023840900922, 0.7510856027198977, 0.2770456451419673],
          feather: 0.0013333333333333333
        },
        accents: [
          {
            mask: {
              rings: [
                {
                  outer: [0.08266666666666667, 0.0719047619047619, 0.838, 0.4866666666666667],
                  inner: [
                    0.09333333333333334,
                    0.07952380952380952,
                    0.8166666666666667,
                    0.4714285714285714
                  ]
                }
              ],
              hueCenter: 55,
              hueRadius: 35,
              hueFeather: 10,
              saturation: [0.35, 0.7]
            },
            adjustment: {
              hueDegrees: 5.553601139457442,
              saturationScale: 0.5666761230892462,
              brightnessScale: 0.9833239619377162
            }
          },
          {
            mask: {
              rings: [
                {
                  outer: [0.112, 0.5957142857142858, 0.7826666666666666, 0.30047619047619045],
                  inner: [0.12533333333333332, 0.61, 0.7533333333333333, 0.27714285714285714]
                }
              ],
              hueCenter: 55,
              hueRadius: 35,
              hueFeather: 10,
              saturation: [0.35, 0.7]
            },
            adjustment: {
              hueDegrees: 6.712541190153161,
              saturationScale: 0.682745288248337,
              brightnessScale: 0.7639751552795031
            }
          }
        ]
      }
    }
  },
  "leg/black/retro/m.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png",[0.0037205395409838113,0.004187595294117773,0.9910362339999996,0.9947522519999996]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 1.9433497536946334,
          saturationScale: 0.9884598707032473,
          brightnessScale: 1.0119047619047619
        },
        mask: {
          kind: "rect",
          rect: [0.1160164271047228, 0.6008146639511202, 0.7742282963611269, 0.29501617347550013],
          feather: 0.0013333333333333333
        }
      }
    }
  }
}, Pl = {
  "arn-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -21.501473124461086,
        saturationScale: 0.35187499999999994,
        brightnessScale: 0.9157303370786517
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.8834426229508195
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "arn-black-L": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/l.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: 1.0282170119955936,
        saturationScale: 0.42361231045559733,
        brightnessScale: 1.0091324200913243
      },
      mask: {
        kind: "rect",
        rect: [0.11885245901639344, 0.6058823529411764, 0.7663934426229508, 0.2720588235294118],
        feather: 0.0013333333333333333
      }
    }
  },
  "leg-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 14.296790811986057,
        saturationScale: 1.0286132997102524,
        brightnessScale: 1.0213483146067415
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.75,
        brightnessScale: 0.9776331967213114
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "fem-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 10.238420910075774,
        saturationScale: 0.8891222334004024,
        brightnessScale: 0.8179775280898877
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.4099365482233503,
        brightnessScale: 0.8023770491803277
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "4ed-white-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: -6.651960784313815,
        saturationScale: 1.0475972265564049,
        brightnessScale: 1.0161725067385445
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.6786248131539612,
        brightnessScale: 0.9823788546255507
      },
      mask: {
        kind: "rect",
        rect: [0.1160164271047228, 0.6068048400622977, 0.7637088901605682, 0.2845333652809393],
        feather: 0.0013333333333333333
      }
    }
  },
  "4ed-white-R": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 0.9473365617433274,
        saturationScale: 0.7790679728967409,
        brightnessScale: 0.8409669211195929
      },
      paper: {
        hueDegrees: -1.5370879120878271,
        saturationScale: 0.7975936392842132,
        brightnessScale: 0.8755980861244019
      },
      mask: {
        kind: "rect",
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333
      }
    }
  },
  "4ed-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 4.748297537978033,
        saturationScale: 0.7365248790437341,
        brightnessScale: 0.9202898550724637
      },
      paper: {
        hueDegrees: -1.2028743315507882,
        saturationScale: 0.7347446151409566,
        brightnessScale: 0.9060773480662984
      },
      mask: {
        kind: "chroma",
        bounds: [0.08235432726293468, 0.5828441356175872, 0.8394486148045915, 0.32346951000359414],
        seed: [0.5010266940451745, 0.7385887145082066],
        frameRgb: [0.24313725490196078, 0.40588235294117647, 0.29411764705882354],
        paperRgb: [0.7098039215686275, 0.5450980392156862, 0.40784313725490196]
      }
    }
  },
  "4ed-white-A": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: -4.166705840874329,
        saturationScale: 0.8970156657190242,
        brightnessScale: 1.045643153526971
      },
      paper: {
        hueDegrees: 3.573863636363626,
        saturationScale: 0.7584100356294544,
        brightnessScale: 0.9611872146118722
      },
      mask: {
        kind: "rect",
        rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
        feather: 0.0013333333333333333
      }
    }
  },
  "chr-white-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -10.093309859154942,
        saturationScale: 0.6057336832224741,
        brightnessScale: 0.8303370786516854
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.8523565573770491
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "chr-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.5470263556198997,
        brightnessScale: 1.1472478070175438
      },
      paper: {
        hueDegrees: -10.756302521008365,
        saturationScale: 0.7279174397031539,
        brightnessScale: 0.7173913043478262
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "rqs-white-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -3.9569462227912027,
        saturationScale: 0.675647699087608,
        brightnessScale: 0.8932584269662921
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.9122336065573771
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "rqs-white-R": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -11.305000607238298,
        saturationScale: 0.7892046722427082,
        brightnessScale: 0.9791955617198335
      },
      paper: {
        hueDegrees: -15.011290079783294,
        saturationScale: 0.8518182848079755,
        brightnessScale: 0.9417475728155339
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "mir-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -1.5308098591549424,
        saturationScale: 1.75,
        brightnessScale: 0.8289606741573033
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.8293023858921132,
        brightnessScale: 0.9695799180327868
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "mir-black-L": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/l.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -0.21134202183861817,
        saturationScale: 0.7810010960906101,
        brightnessScale: 1.2578125
      },
      paper: {
        hueDegrees: 49.72569600359225,
        saturationScale: 0.35,
        brightnessScale: 0.6826484018264841
      },
      mask: {
        kind: "rect",
        rect: [0.11885245901639344, 0.6058823529411764, 0.7663934426229508, 0.2720588235294118],
        feather: 0.0013333333333333333
      }
    }
  },
  "itp-white-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.2012644046094465,
        saturationScale: 1.1224918378193693,
        brightnessScale: 0.8337078651685392
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35000000000000003,
        brightnessScale: 0.8798975409836065
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "itp-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 54.72844827586209,
        saturationScale: 0.667496921182266,
        brightnessScale: 0.9824561403508771
      },
      paper: {
        hueDegrees: -8.03571428571422,
        saturationScale: 0.8959469144800777,
        brightnessScale: 0.7304347826086957
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "vis-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 2.7191901408450576,
        saturationScale: 1.5913694945918608,
        brightnessScale: 0.8134831460674158
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.7390216244725715,
        brightnessScale: 0.953186475409836
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "por-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 33.79094827586209,
        saturationScale: 0.4635736808609119,
        brightnessScale: 0.8713450292397661
      },
      paper: {
        hueDegrees: -6.285714285714221,
        saturationScale: 0.7974474662746454,
        brightnessScale: 0.7695652173913043
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "wth-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 0.7816901408450576,
        saturationScale: 1.7463796482863188,
        brightnessScale: 0.7932584269662921
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.6375529661016933,
        brightnessScale: 0.9490881147540983
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "usg-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -0.41717349551845473,
        saturationScale: 1.663864073081557,
        brightnessScale: 0.7617977528089888
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.8950409836065574
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "ath-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.7312202380952383,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -11.893466500208092,
        saturationScale: 0.9593076222289706,
        brightnessScale: 0.9487179487179488
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "ulg-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 6.196897147214486,
        saturationScale: 1.44966853763682,
        brightnessScale: 0.7764044943820225
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.9164319248826271,
        brightnessScale: 0.8729508196721312
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "ulg-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 27.774922634836457,
        saturationScale: 0.6514603887857772,
        brightnessScale: 1.0321637426900583
      },
      paper: {
        hueDegrees: -4.285714285714221,
        saturationScale: 0.9254331447604949,
        brightnessScale: 0.8391304347826086
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "6ed-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.4424509803921568,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -9.796244277985807,
        saturationScale: 0.9636483807005948,
        brightnessScale: 0.9444444444444445
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "6ed-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 6.568010131532219,
        saturationScale: 0.6071820777509336,
        brightnessScale: 0.9181286549707602
      },
      paper: {
        hueDegrees: -8.571428571428555,
        saturationScale: 0.8757351823708206,
        brightnessScale: 0.8173913043478261
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "ptk-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.8566071428571431,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -9.407859606185411,
        saturationScale: 1.1858096941603267,
        brightnessScale: 0.952991452991453
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "uds-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 2.465900667160895,
        saturationScale: 1.6933264866979658,
        brightnessScale: 0.8089887640449439
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.0263953488372048,
        brightnessScale: 0.8798975409836065
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "s99-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.35,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -15.019828155981486,
        saturationScale: 0.8201216369446448,
        brightnessScale: 0.9316239316239316
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "s99-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 42.145378655608965,
        saturationScale: 0.4593960416241585,
        brightnessScale: 0.9883040935672514
      },
      paper: {
        hueDegrees: -10.47813001605141,
        saturationScale: 0.5791702507449261,
        brightnessScale: 0.7891304347826087
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "brb-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.7403869047619052,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -9.399216201522222,
        saturationScale: 1.1101902451481103,
        brightnessScale: 0.9401709401709403
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "brb-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 28.994895644283133,
        saturationScale: 0.5908991706678307,
        brightnessScale: 0.9239766081871345
      },
      paper: {
        hueDegrees: -4.285714285714221,
        saturationScale: 0.8685969387755101,
        brightnessScale: 0.7999999999999999
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "nem-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.289738430583384,
        saturationScale: 0.8915652681436504,
        brightnessScale: 0.8235955056179776
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.5422222222222192,
        brightnessScale: 0.9221311475409836
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "pcy-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.633564096443024,
        saturationScale: 1.0799672453324602,
        brightnessScale: 0.7730337078651686
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.859911894273126,
        brightnessScale: 0.9303278688524589
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "pcy-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 17.807077308120142,
        saturationScale: 0.3893356835959018,
        brightnessScale: 0.9152046783625731
      },
      paper: {
        hueDegrees: -7.681547619047592,
        saturationScale: 0.7065816326530612,
        brightnessScale: 0.782608695652174
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "btd-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 45.43273932063812,
        saturationScale: 0.47032019704433514,
        brightnessScale: 0.8187134502923976
      },
      paper: {
        hueDegrees: -6.666666666666629,
        saturationScale: 0.8142768838304553,
        brightnessScale: 0.7913043478260869
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "pls-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -7.13672588968916,
        saturationScale: 1.1802209231170504,
        brightnessScale: 0.7887640449438202
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.7511403508771918,
        brightnessScale: 0.9313012295081968
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "7ed-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.4756250000000001,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -9.253827741731357,
        saturationScale: 0.8491438968335036,
        brightnessScale: 0.9401709401709403
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "ody-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.730436724826404,
        saturationScale: 1.1895774647887327,
        brightnessScale: 0.7999999999999999
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.197101034858387,
        brightnessScale: 0.9361987704918033
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "tor-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.125844105730266,
        saturationScale: 1.3379202774282588,
        brightnessScale: 0.7797752808988764
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.2835277777777736,
        brightnessScale: 0.9177561475409837
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "mh2-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -5.12371526456036,
        saturationScale: 0.7905520188605681,
        brightnessScale: 0.9741573033707864
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 1.0356352459016396
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "rvr-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -5.432334166885994,
        saturationScale: 0.8071559831369582,
        brightnessScale: 0.9327485380116958
      },
      paper: {
        hueDegrees: -0.8894878706198597,
        saturationScale: 1.07695026062373,
        brightnessScale: 1.0043478260869565
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "rvr-black-A": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -1.3874016938898421,
        saturationScale: 0.9385034153567606,
        brightnessScale: 1.0527638190954773
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.75,
        brightnessScale: 0.9644727366255146
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "mh3-black-C": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/c.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1.3783333333333334,
        brightnessScale: 1
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.9614659685863863,
        brightnessScale: 0.9979166666666666
      },
      mask: {
        kind: "rect",
        rect: [0.10860655737704918, 0.5985294117647059, 0.7868852459016393, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "mh3-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -5.728282493368738,
        saturationScale: 0.8035133376707874,
        brightnessScale: 0.9298245614035087
      },
      paper: {
        hueDegrees: -0.8894878706198597,
        saturationScale: 1.07695026062373,
        brightnessScale: 1.0043478260869565
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "inr-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 0.6181627435848895,
        saturationScale: 1.054930083373806,
        brightnessScale: 0.9775280898876404
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.3903999999999978,
        brightnessScale: 1.0245901639344261
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "inr-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.142150315687218,
        saturationScale: 0.8832387603666523,
        brightnessScale: 0.9239766081871345
      },
      paper: {
        hueDegrees: -2.691511387163473,
        saturationScale: 1.056747448979592,
        brightnessScale: 1
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "lea-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 0.07692307692309441,
        saturationScale: 0.8721979027962715,
        brightnessScale: 0.920343137254902
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.5488573232323238,
        brightnessScale: 0.9289524647887324
      },
      mask: {
        kind: "rect",
        rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "3ed-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 14.90078457567256,
        saturationScale: 0.653073971761817,
        brightnessScale: 1.0440835266821344
      },
      paper: {
        hueDegrees: 1.278409090909122,
        saturationScale: 0.5333302459988145,
        brightnessScale: 0.6657458563535911
      },
      mask: {
        kind: "chroma",
        bounds: [0.08866597098326993, 0.5813465915897927, 0.8310330898441446, 0.32945968611477183],
        seed: [0.5010266940451745, 0.7385887145082066],
        frameRgb: [0.2450980392156863, 0.42254901960784313, 0.3088235294117647],
        paperRgb: [0.7098039215686275, 0.5450980392156862, 0.40784313725490196]
      }
    }
  },
  "3ed-white-A": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 1.5746966632962085,
        saturationScale: 0.5767416007905141,
        brightnessScale: 1.08641975308642
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.5332231404958686,
        brightnessScale: 1.0076912100456623
      },
      mask: {
        kind: "rect",
        rect: [0.12266666666666666, 0.6095238095238096, 0.7573333333333333, 0.2795238095238095],
        feather: 0.0013333333333333333
      }
    }
  },
  "3ed-white-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 0.5817307692307168,
        saturationScale: 1.0365597519207619,
        brightnessScale: 1.1704225352112676
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.0189145738203973,
        brightnessScale: 0.9653827092511013
      },
      mask: {
        kind: "rect",
        rect: [0.116, 0.6071428571428571, 0.764, 0.2842857142857143],
        feather: 0.0013333333333333333
      }
    }
  },
  "3ed-white-U": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 4.66481543145278,
        saturationScale: 0.4908900383397078,
        brightnessScale: 1.0187590187590188
      },
      paper: {
        hueDegrees: -2.4850427350427253,
        saturationScale: 1.1119809394145677,
        brightnessScale: 0.9338842975206612
      },
      mask: {
        kind: "rect",
        rect: [0.118, 0.6071428571428571, 0.762, 0.2819047619047619],
        feather: 0.0013333333333333333
      }
    }
  },
  "3ed-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 11.54464285714289,
        saturationScale: 0.47346938775510233,
        brightnessScale: 1.0560344827586208
      },
      paper: {
        hueDegrees: 6.655906593406598,
        saturationScale: 0.5819440807296368,
        brightnessScale: 0.9186991869918698
      },
      mask: {
        kind: "chroma",
        bounds: [0.08866597098326993, 0.5813465915897927, 0.8310330898441446, 0.32945968611477183],
        seed: [0.5010266940451745, 0.7385887145082066],
        frameRgb: [0.18627450980392157, 0.22745098039215686, 0.19117647058823528],
        paperRgb: [0.9647058823529412, 0.7450980392156863, 0.5803921568627451]
      }
    }
  },
  "3ed-white-R": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: -9.881086142322147,
        saturationScale: 0.7089456692675254,
        brightnessScale: 0.8498727735368956
      },
      paper: {
        hueDegrees: -3.849587912087827,
        saturationScale: 0.637973137973138,
        brightnessScale: 0.7751196172248803
      },
      mask: {
        kind: "rect",
        rect: [0.11733333333333333, 0.6061904761904762, 0.7626666666666667, 0.28285714285714286],
        feather: 0.0013333333333333333
      }
    }
  }
}, Ul = {
  "arn-black-U": [0.6803921568627451, 0.8078431372549021, 0.896078431372549],
  "atq-black-W": [0.8647058823529412, 0.8549019607843137, 0.7941176470588235],
  "atq-black-U": [0.7137254901960784, 0.8509803921568626, 0.8901960784313725],
  "sum-white-N": [0.9117450980392157, 0.9034513771597749, 0.895157656280334],
  "sum-white-W": [0.9411764705882353, 0.9529411764705882, 0.8803921568627451],
  "sum-white-G": [0.8607843137254901, 0.9313725490196079, 0.8254901960784313],
  "fem-black-N": [0.7775392156862744, 0.7489971713561662, 0.7204551270260577],
  "fem-black-W": [0.8156862745098039, 0.8294117647058823, 0.7313725490196078],
  "4ed-white-N": [0.801921568627451, 0.7741905244286774, 0.7464594802299036],
  "4ed-white-W": [0.9372549019607843, 0.9235294117647059, 0.8156862745098039],
  "4ed-white-U": [0.7607843137254902, 0.8627450980392157, 0.8941176470588236],
  "4ed-white-B": [0.681642156862745, 0.6581474364807804, 0.6346527160988157],
  "4ed-white-R": [0.8901960784313725, 0.7588235294117647, 0.7098039215686275],
  "4ed-white-G": [0.7725490196078432, 0.8313725490196077, 0.7235294117647058],
  "ice-black-W": [0.9176470588235294, 0.8941176470588236, 0.7568627450980392],
  "ice-black-U": [0.7294117647058823, 0.8117647058823529, 0.8509803921568627],
  "chr-white-N": [0.7788088235294118, 0.749940847954281, 0.7210728723791499],
  "chr-white-W": [0.9098039215686274, 0.8901960784313725, 0.792156862745098],
  "chr-white-B": [0.6470392156862745, 0.6242150965428648, 0.6013909773994549],
  "chr-white-R": [0.8784313725490196, 0.7372549019607845, 0.6784313725490196],
  "chr-white-G": [0.7862745098039214, 0.8431372549019608, 0.7372549019607844],
  "hml-black-W": [0.8803921568627451, 0.892156862745098, 0.8137254901960784],
  "hml-black-N": [0.8451372549019607, 0.8365603669190448, 0.8279834789361288],
  "hml-black-U": [0.8, 0.8627450980392157, 0.8813725490196078],
  "hml-black-R": [0.8924019607843137, 0.8034685790167723, 0.7430811941004472],
  "all-black-N": [0.7901176470588235, 0.7687034108259793, 0.7472891745931349],
  "all-black-W": [0.9058823529411765, 0.8980392156862746, 0.7784313725490196],
  "rqs-white-N": [0.7999215686274509, 0.7684890069889343, 0.7370564453504174],
  "rqs-white-W": [0.9235294117647059, 0.9019607843137254, 0.7901960784313725],
  "rqs-white-B": [0.6684117647058823, 0.6399132680547467, 0.6114147714036109],
  "rqs-white-R": [0.9215686274509804, 0.7490196078431373, 0.7019607843137255],
  "rqs-white-G": [0.7333333333333333, 0.8431372549019608, 0.6980392156862745],
  "mir-black-N": [0.7515, 0.718947400990099, 0.686394801980198],
  "mir-black-W": [0.9313725490196079, 0.9117647058823526, 0.7215686274509804],
  "mir-black-G": [0.6803921568627451, 0.8, 0.5588235294117647],
  "itp-white-N": [0.7553970588235294, 0.725230379996705, 0.6950637011698805],
  "itp-white-W": [0.8941176470588236, 0.8666666666666669, 0.7549019607843137],
  "itp-white-B": [0.7294411764705881, 0.7071826870096959, 0.6849241975488034],
  "itp-white-R": [0.8411764705882353, 0.6156862745098035, 0.5215686274509804],
  "itp-white-G": [0.7196078431372549, 0.7764705882352941, 0.6686274509803921],
  "vis-black-N": [0.7397941176470588, 0.7077485803727434, 0.6757030430984275],
  "vis-black-W": [0.9215686274509803, 0.8980392156862743, 0.7313725490196078],
  "5ed-white-N": [0.7058039215686275, 0.6768467433508057, 0.6478895651329839],
  "5ed-white-U": [0.6470588235294118, 0.8235294117647061, 0.8784313725490196],
  "5ed-white-B": [0.7122794117647059, 0.6923545533905743, 0.6724296950164426],
  "5ed-white-R": [0.8274509803921568, 0.5588235294117643, 0.45098039215686275],
  "5ed-white-G": [0.7450980392156863, 0.8235294117647058, 0.7686274509803923],
  "por-black-N": [0.7000196078431372, 0.6772464841423832, 0.6544733604416291],
  "por-black-W": [0.8980392156862745, 0.8862745098039213, 0.75],
  "por-black-R": [0.8549019607843137, 0.5921568627450975, 0.49019607843137253],
  "wth-black-N": [0.7210588235294119, 0.6898248398369251, 0.6585908561444381],
  "wth-black-W": [0.9147058823529411, 0.8980392156862745, 0.7196078431372549],
  "tmp-black-R": [0.8568627450980392, 0.5725490196078433, 0.4588235294117647],
  "sth-black-W": [0.9039215686274511, 0.9176470588235294, 0.7411764705882353],
  "sth-black-G": [0.5843137254901961, 0.7294117647058823, 0.5941176470588235],
  "exo-black-W": [0.8980392156862745, 0.8882352941176469, 0.7490196078431373],
  "exo-black-N": [0.7292549019607844, 0.7020432246165794, 0.6748315472723744],
  "p02-black-N": [0.7077843137254901, 0.6771253397398564, 0.6464663657542224],
  "p02-black-W": [0.8745098039215686, 0.8509803921568627, 0.7176470588235294],
  "p02-black-R": [0.8313725490196079, 0.5872549019607844, 0.4745098039215686],
  "p02-black-G": [0.5705882352941176, 0.7098039215686275, 0.5725490196078433],
  "usg-black-N": [0.692735294117647, 0.6627281959813629, 0.6327210978450786],
  "usg-black-W": [0.8765490196078433, 0.8599897089339418, 0.678618595825427],
  "ath-white-N": [0.7181617647058823, 0.6920793333286794, 0.6659969019514763],
  "ath-white-W": [0.8901960784313725, 0.8784313725490196, 0.7490196078431373],
  "ath-white-B": [0.6902352941176471, 0.6832304309842749, 0.6762255678509027],
  "ath-white-R": [0.8509803921568627, 0.5813725490196081, 0.4862745098039216],
  "ath-white-G": [0.5519607843137255, 0.7176470588235294, 0.592156862745098],
  "ulg-black-W": [0.8666666666666667, 0.8588235294117645, 0.6901960784313725],
  "ulg-black-N": [0.7232156862745098, 0.69188827412153, 0.6605608619685499],
  "6ed-white-N": [0.7096078431372548, 0.6791772592700446, 0.6487466754028343],
  "6ed-white-W": [0.8862745098039215, 0.8666666666666667, 0.7156862745098039],
  "6ed-white-B": [0.7284411764705883, 0.6968874126383229, 0.6653336488060572],
  "ptk-white-N": [0.7037843137254901, 0.6732986070665891, 0.6428129004076878],
  "ptk-white-W": [0.907843137254902, 0.8784313725490197, 0.7098039215686275],
  "ptk-white-B": [0.6922156862745099, 0.6622310959037083, 0.6322465055329064],
  "ptk-white-R": [0.8490196078431372, 0.5666666666666665, 0.42745098039215684],
  "uds-black-N": [0.7138774509803922, 0.6829545415938655, 0.6520316322073385],
  "uds-black-W": [0.8549019607843137, 0.8509803921568626, 0.696078431372549],
  "s99-white-N": [0.7151519607843138, 0.7015578851410496, 0.6879638094977854],
  "s99-white-W": [0.8901960784313725, 0.8862745098039215, 0.7803921568627451],
  "s99-white-B": [0.6936225490196078, 0.6876134427781013, 0.6816043365365948],
  "s99-white-R": [0.8333333333333334, 0.5960784313725492, 0.5411764705882353],
  "mmq-black-N": [0.7071323529411764, 0.6796084513322656, 0.6520845497233546],
  "mmq-black-G": [0.6098039215686275, 0.7058823529411764, 0.5784313725490196],
  "brb-white-N": [0.7013872549019609, 0.6710053812366532, 0.6406235075713455],
  "brb-white-B": [0.6907107843137253, 0.6607913815278587, 0.6308719787419917],
  "brb-white-W": [0.8980392156862745, 0.8823529411764705, 0.7333333333333334],
  "brb-white-R": [0.8509803921568627, 0.5764705882352936, 0.44901960784313727],
  "brb-white-G": [0.5882352941176471, 0.7215686274509804, 0.5745098039215686],
  "nem-black-N": [0.7646666666666668, 0.7369052030713278, 0.7091437394759885],
  "nem-black-W": [0.8980392156862745, 0.8823529411764705, 0.788235294117647],
  "pcy-black-W": [0.9098039215686274, 0.8901960784313723, 0.7725490196078432],
  "pcy-black-G": [0.5362745098039216, 0.6901960784313725, 0.5999999999999999],
  "btd-white-N": [0.6705098039215687, 0.641465443603184, 0.6124210832847992],
  "btd-white-B": [0.6277892156862745, 0.6043636651257039, 0.5809381145651331],
  "btd-white-R": [0.8411764705882353, 0.541176470588235, 0.4352941176470588],
  "inv-black-N": [0.6763333333333332, 0.6470367161716172, 0.6177400990099009],
  "inv-black-W": [0.9019607843137255, 0.8745098039215686, 0.7156862745098039],
  "inv-black-G": [0.5372549019607843, 0.6862745098039216, 0.5411764705882353],
  "pls-black-W": [0.9, 0.880392156862745, 0.7607843137254902],
  "7ed-white-N": [0.6787696078431372, 0.671299468668047, 0.6638293294929567],
  "7ed-white-W": [0.8784313725490196, 0.8823529411764706, 0.8],
  "7ed-white-B": [0.6719166666666667, 0.664174656559406, 0.6564326464521453],
  "7ed-white-R": [0.8156862745098039, 0.5568627450980393, 0.4823529411764706],
  "7ed-white-G": [0.4980392156862745, 0.6823529411764706, 0.603921568627451],
  "apc-black-R": [0.8705882352941177, 0.5764705882352935, 0.4588235294117647],
  "ody-black-W": [0.8862745098039215, 0.8705882352941177, 0.7294117647058824],
  "ody-black-N": [0.696735294117647, 0.6665549286546302, 0.6363745631916132],
  "tor-black-N": [0.6698186274509803, 0.6516680813893724, 0.6335175353277643],
  "tor-black-W": [0.884313725490196, 0.8598039215686275, 0.7254901960784313],
  "jud-black-N": [0.6904362745098039, 0.660528762618909, 0.630621250728014],
  "jud-black-R": [0.8313725490196079, 0.5392156862745099, 0.43333333333333335],
  "ons-black-W": [0.9627450980392157, 0.9549019607843137, 0.7843137254901961],
  "scg-black-W": [0.9222549019607845, 0.9106216656928856, 0.7140037950664139],
  "tsb-black-W": [0.925, 0.9161764705882351, 0.759313725490196],
  "tsb-black-U": [0.6666666666666665, 0.7960784313725485, 0.9411764705882351],
  "tsb-black-R": [0.8568627450980392, 0.6137254901960782, 0.4980392156862745],
  "tsr-black-W": [0.9927647058823531, 0.9899625474383303, 0.9479301707779888],
  "tsr-black-N": [0.855279411764706, 0.8478698129004079, 0.8404602140361096],
  "mh2-black-W": [0.9843137254901959, 0.9725490196078431, 0.8999999999999999],
  "brc-black-R": [0.9254901960784314, 0.66078431372549, 0.6313725490196078],
  "dmr-black-U": [0.7705882352941177, 0.8784313725490195, 0.9882352941176471],
  "dmr-black-R": [0.9107843137254901, 0.6421568627450981, 0.5931372549019607],
  "rvr-black-W": [1, 0.976470588235294, 0.8470588235294118],
  "rvr-black-U": [0.7098039215686275, 0.8784313725490198, 0.9764705882352941],
  "rvr-black-B": [0.8111911764705881, 0.7810601428272423, 0.7509291091838963],
  "rvr-black-R": [0.9686274509803922, 0.6745098039215688, 0.5568627450980392],
  "mh3-black-W": [0.996078431372549, 0.9725490196078431, 0.8549019607843137],
  "mh3-black-U": [0.7098039215686275, 0.8745098039215684, 0.9647058823529412],
  "mh3-black-R": [0.9607843137254901, 0.6745098039215689, 0.5529411764705883],
  "mh3-black-B": [0.8132107843137254, 0.7823282841363888, 0.7514457839590519],
  "inr-black-W": [0.996078431372549, 0.9764705882352941, 0.8509803921568627],
  "inr-black-U": [0.6802606033829841, 0.8765397843821006, 0.9723970588235294],
  "inr-black-R": [0.9647058823529412, 0.6745098039215687, 0.5529411764705883],
  "lea-black-W": [0.8588235294117647, 0.8666666666666667, 0.807843137254902],
  "lea-black-U": [0.6480392156862745, 0.7490196078431373, 0.7862745098039216],
  "leb-black-U": [0.6764705882352942, 0.8088235294117648, 0.8627450980392157],
  "2ed-white-W": [0.9215686274509804, 0.9235294117647059, 0.8431372549019608],
  "2ed-white-U": [0.6784313725490196, 0.8176470588235295, 0.8754901960784314],
  "2ed-white-R": [0.8745098039215686, 0.6960784313725488, 0.6196078431372549],
  "3ed-white-W": [0.8647058823529412, 0.8607843137254902, 0.788235294117647],
  "3ed-white-U": [0.7372549019607844, 0.8764705882352941, 0.903921568627451],
  "3ed-white-B": [0.6431764705882351, 0.6285728524927555, 0.6139692343972758],
  "3ed-white-R": [0.8784313725490196, 0.7607843137254902, 0.6980392156862745],
  "3ed-white-G": [0.7529411764705881, 0.8274509803921568, 0.7294117647058823]
}, Fl = {
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
  ].map(([e, t]) => [e / 744, t / 1039])
}, d0 = (e) => ({
  kind: "polygon",
  feather: 2 / 744,
  points: e.map(([t, r]) => [t / 744, r / 1039])
}), _l = d0([
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
]), Nl = d0([
  [74, 582],
  [677, 582],
  [688, 590],
  [696, 605],
  [705, 615],
  [705, 628],
  [696, 642],
  [682, 650],
  [82, 650]
]), zl = { title: [1, 1, 1], type: [1, 1, 1], stats: [1.0297029702970297, 1.0088832487309645, 1.0299401197604792] }, Yl = { title: [0.9047619047619047, 0.9276018099547512, 0.9518072289156626], type: [1.4015151515151516, 1.0086206896551724, 0.9087837837837838], stats: [1.5, 1.1030927835051547, 1.0265624999999998] }, Hl = { title: [0.736842105263158, 0.8620689655172413, 1.03125], type: [0.6666666666666666, 0.8181818181818182, 1.0740740740740742], stats: [0.8936170212765957, 1.0612244897959184, 1.146551724137931] }, ql = { title: [1.0038560411311055, 0.9704301075268819, 1.1162790697674418], type: [0.9128989361702128, 0.9044117647058825, 1.1458333333333335], stats: null }, Xl = { title: [1.2035714285714287, 1.03, 1.0040322580645162], type: [1.494318181818182, 1.0045731707317074, 1.1860465116279069], stats: [1.5, 1.1079545454545454, 1.276595744680851] }, Jl = { title: [0.8410958904109589, 0.8910614525139665, 0.9060773480662984], type: [1, 1, 1], stats: null }, Vl = {
  W: zl,
  U: Yl,
  B: Hl,
  R: ql,
  G: Xl,
  A: Jl
}, Kl = { frame: [0.9187500000000002, 0.9229729729729731, 1.1260000000000001], title: [0.8812095032397409, 0.8817567567567567, 0.9481792717086837], type: [1.0465277777777777, 1.0163352272727273, 1.1097770154373927], stats: [0.9004329004329005, 0.8952702702702703, 0.9717514124293787] }, Zl = { frame: [0.6021739130434783, 0.7878787878787878, 0.9531772575250836], title: [0.59375, 0.8760683760683762, 0.8777777777777778], type: [0.6702898550724639, 0.9859550561797753, 1.0846774193548387], stats: [0.7395209580838322, 0.8991596638655462, 0.8878378378378378] }, Ql = { frame: [0.8851981351981352, 0.9510309278350517, 0.9543269230769231], title: [0.9145199063231849, 1.0140449438202248, 1.1162790697674418], type: [1.0811023622047244, 0.9044117647058825, 0.7366071428571429], stats: [0.9608294930875576, 1.0552486187845302, 1.180722891566265] }, e1 = { frame: [1, 1, 1], title: [0.9573863636363638, 1.03, 1.3833333333333333], type: [1, 1, 1], stats: [0.9746835443037973, 1.0483870967741935, 1.5] }, t1 = {
  W: Kl,
  U: Zl,
  R: Ql,
  G: e1
}, Ua = (e, t = 375, r = 527) => ({
  kind: "polygon",
  feather: 1 / t,
  points: e.map(([a, s]) => [a / t, s / r])
}), r1 = Ua([
  [44, 60],
  [52, 42],
  [66, 29],
  [75, 26],
  [344, 26],
  [347, 29],
  [347, 60]
]), a1 = Ua([
  [43, 438],
  [337, 438],
  [341, 443],
  [336, 448],
  [335, 458],
  [339, 466],
  [43, 466]
]), s1 = Ua(
  [
    [12, 16],
    [64, 16],
    [64, 35],
    [60, 42],
    [12, 42]
  ],
  78,
  51
), n1 = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, it = (e) => ({
  hueDegrees: 0,
  saturationScale: 1,
  brightnessScale: 1,
  rgbScale: e
});
function o1(e) {
  const t = _e(e);
  for (const [r, a] of Object.entries(t1)) {
    const s = K.MSE_TEMPLATE_ROOT + "/magic-future-textless.mse-style/";
    if (t.base === s + r.toLowerCase() + "card.jpg")
      return {
        [t.base]: {
          frame: it([1, 1, 1]),
          paper: it(a.frame),
          mask: n1,
          regions: [
            { mask: r1, adjustment: it(a.title) },
            { mask: a1, adjustment: it(a.type) }
          ]
        },
        ...t.stats ? {
          [t.stats]: { frame: it(a.frame), paper: it(a.stats), mask: s1 }
        } : {}
      };
  }
  return {};
}
const i1 = { frame: { hueDegrees: 8, saturationScale: 0.6137499999999998, brightnessScale: 1.25 }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.1482558139534884, 1.111280487804878, 1.3] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.0692640692640691, 1.036873156342183, 1.1861510791366907] } }, l1 = { W: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8366228070175439, 0.786036036036036, 0.7373737373737373] }, G: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.4, 1.4, 1.4] } }, d1 = { frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6, 0.6, 0.6] }, paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8893905191873589, 0.8839285714285715, 0.9282511210762332] }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.947089947089947, 0.9388297872340424, 1.0242587601078168] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6957070707070706, 0.6905370843989771, 0.7095046854082999] } }, lt = {
  land: i1,
  paper: l1,
  colorless: d1
}, Xt = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, c0 = (e) => ({
  kind: "polygon",
  feather: 1 / 339,
  points: e.map(([t, r]) => [t / 339, r / 464])
}), c1 = c0([
  [26, 43],
  [34, 25],
  [48, 12],
  [57, 9],
  [326, 9],
  [329, 12],
  [329, 43]
]), h1 = c0([
  [12, 277],
  [319, 277],
  [330, 285],
  [337, 294],
  [330, 310],
  [319, 314],
  [20, 314]
]), u1 = {
  kind: "rect",
  rect: [20 / 375, 470 / 527, 338 / 375, 40 / 527],
  feather: 1 / 375
}, m1 = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, g1 = {
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
  ].map(([e, t]) => [e / 375, t / 527])
}, Tt = (e) => ({
  ...e,
  rgbScale: e.rgbScale
});
function f1(e) {
  const t = _e(e), r = ge + "/";
  if (!t.base.startsWith(r)) return {};
  const a = t.base === r + "ccard.jpg", s = {}, n = a ? lt.colorless : lt.land;
  for (const o of [t.base, t.reverseBase, t.neutralBase])
    o && (s[o] = a ? {
      frame: Xt,
      paper: Tt(lt.colorless.frame),
      mask: m1,
      regions: [{ mask: g1, adjustment: Xt }]
    } : { frame: Xt, paper: lt.land.frame, mask: u1 });
  for (const o of [t.type, t.reverseType, t.neutralType])
    o === r + (a ? "c" : "cl") + "typeline.png" && (s[o] = {
      frame: Xt,
      paper: Tt(n.title),
      mask: c1,
      regions: [{ mask: h1, adjustment: Tt(n.type) }]
    });
  for (const o of [t.paper, t.reversePaper])
    if (o)
      if (a) s[o] = Tt(lt.colorless.paper);
      else
        for (const [i, l] of Object.entries(lt.paper))
          o === r + i.toLowerCase() + "ltextbox.png" && (s[o] = Tt(l));
  return s;
}
const p1 = {
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
function b1(e) {
  if (e.frameTemplate !== "future" || e.setCode?.toLowerCase() !== "fut" || e.colorCalibration !== "set-hsb-v1")
    return {};
  if (ie(e) === "full-art") return o1(e);
  if (ie(e) !== "regular") return {};
  const t = _e(e).base;
  for (const [r, a] of Object.entries(p1))
    if (t === K.CONJURER_ROOT + "/img/frames/future/regular/futureFrame" + r + ".png") {
      const s = Vl[r], n = (i) => ({
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        rgbScale: i
      }), o = _e(e).stats;
      return {
        [t]: {
          ...a,
          mask: Fl,
          regions: [
            { mask: _l, adjustment: n(s.title) },
            { mask: Nl, adjustment: n(s.type) }
          ]
        },
        ...o && s.stats ? { [o]: n(s.stats) } : {}
      };
    }
  return f1(e);
}
const Cs = {
  "ordinary/W": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png",
    frame: {
      hueDegrees: -6.491752199413554,
      saturationScale: 0.8110599078341005,
      brightnessScale: 0.875
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8951612903225806, 0.8852459016393442, 0.9201680672268907]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8694331983805668, 0.8615702479338844, 0.8975188781014024]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.875, 0.8630705394190872, 0.8886486486486487]
    }
  },
  "colorshifted/W": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/w.png",
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9392523364485981, 0.9720812182741116, 0.9715909090909091]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    }
  },
  "ordinary/U": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png",
    frame: {
      hueDegrees: 18.3125,
      saturationScale: 0.8049999999999997,
      brightnessScale: 0.9475
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.891304347826087, 0.8851063829787235, 0.9170124481327802]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.903896103896104, 0.8686987104337631, 0.9136771300448431]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8897435897435898, 0.8779342723004694, 0.9079685746352413]
    }
  },
  "colorshifted/U": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/u.png",
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9784946236559141, 0.9901477832512315, 1.036697247706422]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1.1098901098901097, 1.0403225806451613, 1.128980891719745]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1.10989010989011, 1.0423387096774193, 1.1353503184713374]
    }
  },
  "ordinary/B": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/b.png",
    frame: {
      hueDegrees: -2.75,
      saturationScale: 0.9825000000000002,
      brightnessScale: 1
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.865546218487395, 0.8620689655172413, 0.8951965065502183]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8559782608695653, 0.8110014104372356, 0.8306801736613603]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8600508905852416, 0.8215223097112861, 0.8409703504043128]
    }
  },
  "colorshifted/B": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/b.png",
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1.0509554140127388, 1.0723684210526314, 1.1143790849673203]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.7767857142857142, 0.724609375, 0.741869918699187]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.7732142857142856, 0.736328125, 0.7439024390243902]
    }
  },
  "ordinary/R": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png",
    frame: {
      hueDegrees: 4.1875,
      saturationScale: 1.0318749999999994,
      brightnessScale: 0.9150000000000003
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8938775510204081, 0.8893805309734514, 0.9065420560747663]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8801652892561984, 0.8810679611650486, 0.8488210818307905]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8780991735537191, 0.8691931540342297, 0.8393351800554018]
    }
  },
  "colorshifted/R": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/r.png",
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1, 1.0657894736842104, 1.0162601626016259]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    }
  },
  "ordinary/G": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png",
    frame: {
      hueDegrees: -39.28098739495795,
      saturationScale: 1.0733997252747252,
      brightnessScale: 0.86328125
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8818181818181817, 0.8641304347826086, 0.9011494252873564]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8756281407035176, 0.85, 0.8712121212121212]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8844221105527638, 0.8489892984542211, 0.8731155778894473]
    }
  },
  "ordinary/M": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png",
    frame: {
      hueDegrees: 2,
      saturationScale: 1.159999999999999,
      brightnessScale: 0.8725
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8582995951417004, 0.8613445378151261, 0.9415887850467289]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8467741935483871, 0.8443579766536965, 0.734375]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8541176470588236, 0.8469656992084432, 0.7004048582995952]
    }
  }
}, h0 = (e) => ({
  kind: "polygon",
  points: e.map(([t, r]) => [t / 488, r / 680]),
  feather: 0.75 / 488
}), w1 = h0([
  [43, 41],
  [445, 41],
  [449, 48],
  [450, 58],
  [446, 72],
  [42, 72],
  [38, 64],
  [37, 54],
  [39, 46]
]), y1 = h0([
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
function S1(e) {
  if (e.setCode?.toLowerCase() !== "plc" || e.frameAssetFamily !== "eighth" || e.colorCalibration !== "set-hsb-v1" || e.frameTemplate || e.layout && e.layout !== "normal")
    return {};
  const t = Ae(e);
  if (!t || !Le(e, t.frame)) return {};
  const r = Object.entries(Cs).find(([, i]) => i.source === t.frame);
  if (!r) return {};
  const [a, s] = r, n = a.endsWith("/W") || a.endsWith("/M") ? 615 : 610, o = {
    [t.frame]: {
      frame: s.frame,
      paper: s.paper,
      mask: {
        kind: "rect",
        rect: [41 / 488, 425 / 680, 405 / 488, (n - 425) / 680],
        feather: 0.75 / 488
      },
      regions: [
        { mask: w1, adjustment: s.title },
        { mask: y1, adjustment: s.type }
      ]
    }
  };
  for (const i of t.pinlines ? [t.pinlines.left, t.pinlines.right] : []) {
    const l = Object.values(Cs).find((d) => d.source === i);
    l && (o[i] = l.frame);
  }
  return o;
}
function vr(e) {
  if (e.frameTemplate) return !1;
  const t = ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "");
  return (de(e) || !!l0(e)) && (!e.layout || e.layout === "normal") && (e.colorCalibration === "set-hsb-v1" || t && e.colorCalibration === "early-hsb-v1");
}
function k1(e) {
  if (!vr(e) || !de(e) || Ut(e)) return;
  const t = Ue(e), r = t.split("/").at(-1).replace(".png", "").toUpperCase(), a = Pl[`${e.setCode?.toLowerCase()}-${Me(e)}-${r}`];
  if (!(a?.asset !== t || !a.rect.every((s, n) => s === ka(e)[n])))
    return t.endsWith("/old/fourth/w.png") ? {
      ...a.adjustment,
      mask: {
        kind: "rect",
        rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
        feather: 2 / 1500
      }
    } : a.adjustment;
}
function v1(e, t) {
  if (!vr(e) || e.setCode?.toLowerCase() === "leg" && !we(e)) return;
  const r = `${e.setCode?.toLowerCase()}-${Me(e)}-${t}`;
  return jo[r] ?? Ul[r];
}
function u0(e) {
  if (e.frameTemplate === "future") return b1(e);
  if (e.setCode?.toLowerCase() === "plc") return S1(e);
  if (!vr(e)) return {};
  const t = l0(e), r = t && (Dl[t.key] ?? Wl[t.key]);
  if (r && r.source === t?.source) return r.materials;
  const a = k1(e);
  return a ? { [Ue(e)]: a } : {};
}
const C1 = { hueDegrees: -1.0625, saturationScale: 0.9087500000000004, brightnessScale: 0.9406250000000002, gamma: 0.738125 }, R1 = { W: { header: { hueDegrees: -14.024193548387075, saturationScale: 0.5265905874026912, brightnessScale: 0.9495967741935485 }, paper: { hueDegrees: -1.1750690607734668, saturationScale: 0.7998024425287352, brightnessScale: 0.9392712550607287 }, pinline: { hueDegrees: -8.203598940779898, saturationScale: 0.4898632906133164, brightnessScale: 0.9302788844621516 }, glyph: { source: [0.9882352941176471, 0.996078431372549, 1], target: [0.9431372549019608, 0.9352941176470588, 0.9372549019607843] } }, U: { header: { hueDegrees: 42.78801843317967, saturationScale: 0.45884697719052203, brightnessScale: 0.9842342342342343 }, paper: { hueDegrees: 32.97916666666663, saturationScale: 0.5842800834685827, brightnessScale: 1.0133928571428572 }, pinline: { hueDegrees: 17.557840616966587, saturationScale: 0.5557142857142856, brightnessScale: 1.1666666666666667 }, glyph: { source: [0, 0.4588235294117647, 0.7450980392156863], target: [0.396078431372549, 0.4392156862745098, 0.7176470588235293] } }, B: { header: { hueDegrees: -14.404807692307713, saturationScale: 1.421528644784533, brightnessScale: 1.0159574468085106 }, paper: { hueDegrees: -12.3125, saturationScale: 1.2126352339181279, brightnessScale: 1.0239520958083832 }, pinline: { hueDegrees: -88.07559082483772, saturationScale: 1.277991260837483, brightnessScale: 1.308125 }, glyph: { source: [0.15294117647058825, 0.14901960784313725, 0.1411764705882353], target: [0.11568627450980393, 0.09607843137254901, 0.12941176470588234] } }, R: { header: { hueDegrees: 2.5092658770676053, saturationScale: 0.7511073790822655, brightnessScale: 0.9318181818181819 }, paper: { hueDegrees: 8.412850307587178, saturationScale: 1.0477689369398555, brightnessScale: 0.9504310344827587 }, pinline: { hueDegrees: 3.0543379373086736, saturationScale: 1.0001076704423102, brightnessScale: 1.0559610705596107 }, glyph: { source: [0.9372549019607843, 0.2196078431372549, 0.15294117647058825], target: [0.8196078431372549, 0.24901960784313726, 0.20588235294117646] } }, G: { header: { hueDegrees: -59.16304347826099, saturationScale: 1.0029481528127626, brightnessScale: 0.9543269230769231 }, paper: { hueDegrees: -26.824145962732928, saturationScale: 0.9416448402304863, brightnessScale: 0.969626168224299 }, pinline: { hueDegrees: -21.627829393491652, saturationScale: 0.47678542547538166, brightnessScale: 1.16243654822335 }, glyph: { source: [0, 0.4823529411764706, 0.2627450980392157], target: [0.22745098039215686, 0.4568627450980392, 0.29411764705882354] } } }, m0 = {
  outer: C1,
  colors: R1
}, Rs = (e) => {
  if (e.length !== 3 || e.some((t) => !Number.isFinite(t) || t < 0 || t > 1))
    throw Error("Invalid Eighth basic-land palette.");
  return [e[0], e[1], e[2]];
}, M1 = new Map(
  Object.entries(m0.colors).map(([e, t]) => [
    e,
    { ...t, glyph: { source: Rs(t.glyph.source), target: Rs(t.glyph.target) } }
  ])
), ia = m0.outer;
function T1(e) {
  if (e.colorCalibration !== "set-hsb-v1" || e.frameAssetFamily !== "eighth" || e.setCode?.toLowerCase() !== "8ed" || e.frameTemplate || e.layout && e.layout !== "normal")
    return;
  const t = Pt(e), r = t ? M1.get(t) : void 0;
  if (!r) return;
  const a = Ae(e);
  if (!(!a || !Aa(e, a.frame)))
    return { color: t, palette: r, frame: a.frame, glyph: fr(e) };
}
const x1 = { left: [[34.1933, 40.6667], [34.6766, 39.4527], [35.4016, 38.4816], [35.6432, 38.4816], [36.6098, 37.2677], [36.8515, 37.2677], [38.3014, 35.8109], [39.7512, 34.8398], [42.1677, 33.8687], [46.7591, 32.6547], [51.1087, 32.1692], [51.3504, 31.9264], [53.5252, 31.9264], [53.7669, 31.6836], [60.2914, 31.6836], [60.533, 31.9264], [62.4662, 31.9264], [63.9161, 32.4119], [65.6077, 32.4119], [67.5409, 32.8975], [71.4072, 34.1114], [74.7903, 35.8109], [77.4485, 37.7532], [380.4762, 37.7532], [384.8259, 35.3254], [388.6923, 34.1114], [394.7335, 33.3831], [394.9751, 33.1403], [402.2246, 32.8975], [402.4662, 33.1403], [405.366, 33.1403], [405.6077, 33.3831], [411.4072, 34.1114], [415.032, 35.3254], [417.9318, 36.7821], [418.6567, 37.5104], [420.8316, 37.5104], [421.0732, 37.7532], [610.7676, 37.7532], [611.0092, 37.996], [613.6674, 37.996]], right: [[34.435, 448.79], [35.8849, 450.7323], [36.1265, 450.7323], [36.3682, 451.2179], [38.0597, 452.6746], [39.0263, 452.9174], [40.9595, 454.1313], [44.8259, 455.5881], [46.5174, 455.8308], [48.4506, 456.5592], [53.5252, 456.802], [53.7669, 457.0448], [54.9751, 457.0448], [55.2168, 456.802], [59.3248, 457.0448], [59.5665, 456.802], [66.091, 456.5592], [66.8159, 456.0736], [70.6823, 455.3453], [73.0988, 453.8886], [73.5821, 453.8886], [76.2402, 451.9463], [77.6901, 451.2179], [103.3049, 451.2179], [103.5466, 451.4607], [104.9964, 451.4607], [105.2381, 451.2179], [124.0867, 451.4607], [124.3284, 451.2179], [125.5366, 451.2179], [125.7783, 451.4607], [129.8863, 451.4607], [130.1279, 451.7035], [139.3106, 451.7035], [139.5522, 451.4607], [143.4186, 451.4607], [143.6603, 451.2179], [144.6269, 451.4607], [148.7349, 451.4607], [148.9765, 451.2179], [161.059, 451.2179], [161.3006, 451.4607], [163.9588, 451.4607], [164.2004, 451.2179], [169.0334, 451.2179], [169.2751, 451.4607], [171.2082, 451.4607], [171.4499, 451.2179], [172.6581, 451.4607], [174.833, 451.4607], [175.0746, 451.2179], [175.7996, 451.4607], [179.4243, 451.4607], [179.666, 451.2179], [181.8408, 451.2179], [182.0824, 451.4607], [187.6404, 451.4607], [187.882, 451.2179], [192.4733, 451.2179], [192.715, 451.4607], [193.4399, 451.2179], [199.7228, 451.2179], [199.9645, 451.4607], [200.9311, 451.2179], [208.1805, 451.2179], [208.4222, 451.4607], [209.6304, 451.4607], [209.8721, 451.2179], [227.9957, 451.2179], [228.2374, 451.4607], [229.9289, 451.4607], [230.1706, 451.2179], [246.8443, 451.2179], [247.086, 451.4607], [259.6517, 451.4607], [259.8934, 451.2179], [261.1016, 451.4607], [261.8266, 451.2179], [263.0348, 451.2179], [263.2765, 451.4607], [263.7598, 451.2179], [265.9346, 451.2179], [266.1763, 451.4607], [268.8344, 451.4607], [269.076, 451.2179], [367.1855, 451.4607], [367.4271, 451.2179], [374.9183, 451.2179], [375.1599, 451.4607], [377.8181, 451.4607], [378.0597, 451.2179], [379.9929, 451.2179], [381.9261, 452.1891], [382.651, 452.9174], [385.3092, 454.1313], [389.9005, 455.3453], [394.7335, 455.8308], [394.9751, 456.0736], [405.366, 456.0736], [405.6077, 455.8308], [408.7491, 455.5881], [413.0988, 454.6169], [415.5153, 453.6458], [416.4819, 453.6458], [419.14, 451.4607], [419.865, 451.2179], [426.3895, 451.2179], [426.6311, 451.4607], [432.1891, 451.4607], [432.4307, 451.2179], [434.8472, 451.2179], [435.0888, 451.4607], [613.6674, 451.2179]] }, I1 = { left: [[39.0263, 39.4527], [39.7512, 38.7244], [43.6176, 36.5393], [49.4172, 35.0826], [53.7669, 34.8398], [54.0085, 34.597], [59.8081, 34.597], [60.0498, 34.8398], [65.8493, 35.0826], [68.7491, 35.8109], [73.0988, 37.5104], [75.032, 38.7244], [76.7235, 40.4239], [76.9652, 60.8179]], right: [[39.0263, 449.0328], [39.7512, 449.7612], [42.651, 451.4607], [48.209, 453.1602], [49.4172, 453.1602], [51.1087, 453.6458], [57.3916, 453.6458], [58.5999, 453.8886], [58.8415, 453.6458], [63.4328, 453.6458], [70.199, 452.1891], [75.032, 449.7612], [76.7235, 448.0617], [76.9652, 447.5761]] }, B1 = { left: [[384.1009, 41.395], [385.5508, 40.1811], [387.484, 39.21], [392.317, 37.7532], [395.7001, 37.5104], [395.9417, 37.2677], [408.2658, 37.5104], [412.6155, 38.7244], [415.2736, 39.9383], [417.9318, 41.6378], [418.4151, 42.3662], [418.6567, 60.8179], [418.8984, 60.8179]], right: [[384.1009, 447.8189], [385.3092, 448.79], [388.9339, 450.4896], [392.5586, 451.4607], [396.9083, 451.7035], [397.15, 451.9463], [404.3994, 451.9463], [404.6411, 451.7035], [408.7491, 451.4607], [413.5821, 450.004], [415.9986, 448.79], [418.4151, 446.8478], [418.6567, 428.8816], [418.8984, 428.8816]] }, j1 = { left: [[424.2146, 41.6378], [608.3511, 41.6378], [609.3177, 41.395], [609.5593, 60.8179], [609.801, 60.8179]], right: [[424.2146, 446.3622], [424.6979, 446.1194], [602.3099, 446.1194], [602.5515, 446.3622], [608.5928, 446.1194], [609.076, 446.3622], [609.3177, 446.1194], [609.5593, 428.8816], [609.801, 428.8816]] }, $t = {
  outer: x1,
  title: I1,
  type: B1,
  paper: j1
}, $1 = $t, hr = (e) => Math.max(0, Math.min(1, e)), g0 = (e) => {
  const t = hr(e);
  return t * t * (3 - 2 * t);
}, Ms = (e, t) => {
  let r = 0;
  for (; r + 1 < e.length - 1 && e[r + 1][0] < t; ) r++;
  const a = e[r], s = e[r + 1];
  return a[1] + hr((t - a[0]) / (s[0] - a[0])) * (s[1] - a[1]);
};
function Jt(e, t) {
  const { left: r, right: a } = t, s = Math.max(r[0][0], a[0][0]), n = Math.min(r.at(-1)[0], a.at(-1)[0]);
  return Array.from({ length: e }, (o, i) => {
    const l = (i + 0.5) * 680 / e;
    return [Ms(r, l), Ms(a, l), Math.min(l - s, n - l)];
  });
}
const Vt = (e, t) => g0(0.5 + Math.min(t - e[0], e[1] - t, e[2]) / 0.4), Nr = (e, t, r) => [
  e[0] + r * (t[0] - e[0]),
  e[1] + r * (t[1] - e[1]),
  e[2] + r * (t[2] - e[2])
];
function G1(e, t) {
  const r = Jt(e.height, $t.outer), a = Jt(e.height, $t.title), s = Jt(e.height, $t.type), n = Jt(e.height, $t.paper);
  for (let o = 0; o < e.height; o++)
    for (let i = 0; i < e.width; i++) {
      const l = (o * e.width + i) * 4;
      if (!e.data[l + 3]) continue;
      const d = [e.data[l] / 255, e.data[l + 1] / 255, e.data[l + 2] / 255], c = Math.max(...d);
      if (c < 0.075) continue;
      const h = (i + 0.5) * 488 / e.width, u = Vt(r[o], h), m = Math.max(Vt(a[o], h), Vt(s[o], h)), g = Vt(n[o], h);
      let f;
      if (u < 1) {
        const w = Math.pow(c, ia.gamma) / c, y = Be([d[0] * w, d[1] * w, d[2] * w], ia);
        f = Nr(d, y, g0((c - 0.075) / 0.125));
      } else f = d;
      if (u > 0) {
        const w = g > 0 ? t.paper : t.header, y = Math.max(m, g), p = y === 1 ? d : Be(d, t.pinline), b = y > 0 ? Nr(p, Be(d, w), y) : p;
        f = Nr(f, b, u);
      }
      for (let w = 0; w < 3; w++) e.data[l + w] = Math.round(255 * f[w]);
    }
}
function E1(e, t) {
  const r = (o) => (o[0] + o[1] + o[2]) / 3, a = r(t.source), s = t.source.map((o) => o - a), n = s.reduce((o, i) => o + i * i, 0);
  if (n <= 1e-6) throw Error("Basic glyph fill cannot be separated from neutral details.");
  for (let o = 0; o < e.data.length; o += 4) {
    if (!e.data[o + 3]) continue;
    const i = [e.data[o] / 255, e.data[o + 1] / 255, e.data[o + 2] / 255], l = r(i), d = hr(i.reduce((c, h, u) => c + (h - l) * s[u], 0) / n);
    for (let c = 0; c < 3; c++)
      e.data[o + c] = Math.round(
        255 * hr(i[c] + d * (t.target[c] - t.source[c]))
      );
  }
}
function L1(e, t) {
  const r = T1(e);
  return r ? [
    {
      url: r.frame,
      kind: "frame",
      color: (s) => G1(s, r.palette)
    },
    ...r.glyph ? [
      {
        url: r.glyph,
        kind: "glyph",
        color: (s) => E1(s, r.palette.glyph)
      }
    ] : []
  ].map(({ url: s, kind: n, color: o }) => {
    const i = t.get(s);
    if (!i) throw Error(`Eighth basic-land material unavailable: ${s}`);
    return {
      url: s,
      key: JSON.stringify([
        "eighth-basic-material-v1",
        s,
        i.width,
        i.height,
        n === "frame" ? [r.palette, ia, $1] : r.palette.glyph
      ]),
      bytes: i.width * i.height * 4,
      build: async () => {
        const l = document.createElement("canvas");
        l.width = i.width, l.height = i.height;
        try {
          const d = l.getContext("2d", { willReadFrequently: !0 });
          if (!d) throw Error("Basic-land color preparation needs Canvas2D.");
          d.drawImage(i, 0, 0);
          const c = d.getImageData(0, 0, l.width, l.height);
          return o(c), d.putImageData(c, 0, 0), await createImageBitmap(l);
        } finally {
          l.width = l.height = 0;
        }
      }
    };
  }) : [];
}
function A1(e, t) {
  if (e.width !== t.width || e.height !== t.height)
    throw Error("Stamp palette dimensions differ.");
  for (let r = 0; r < e.height; r++)
    for (let a = 0; a < e.width; a++) {
      const s = (r * e.width + a) * 4, n = Math.max(0, Math.min(1, ((a + 0.5) / e.width - 0.35) / 0.3)), o = e.data[s + 3] * (1 - n), i = t.data[s + 3] * n, l = o + i;
      for (let d = 0; d < 3; d++)
        e.data[s + d] = l ? (e.data[s + d] * o + t.data[s + d] * i) / l : 0;
      e.data[s + 3] = l;
    }
}
function O1(e, t) {
  const r = et(e);
  if (!r) return [];
  const a = Re(e.setCode, e.borderColor).border === "#090806";
  if (!a && !r.rightImage) return [];
  const s = t.get(r.image);
  if (!s) throw Error("Authenticity stamp asset is unavailable.");
  const n = r.rightImage ? t.get(r.rightImage) : void 0;
  if (r.rightImage && !n) throw Error("Authenticity stamp asset is unavailable.");
  if (n && (n.width !== s.width || n.height !== s.height))
    throw Error("Authenticity stamp palette sources have different dimensions.");
  return [
    {
      url: r.image,
      key: JSON.stringify([
        "security-stamp-frame-palette-v4",
        r.image,
        r.rightImage ?? null,
        a,
        s.width,
        s.height
      ]),
      bytes: s.width * s.height * 4,
      build: async () => {
        const o = document.createElement("canvas");
        o.width = s.width, o.height = s.height;
        try {
          const i = o.getContext("2d", { willReadFrequently: !0 });
          if (!i) throw Error("Stamp preparation needs Canvas2D.");
          let l;
          n && (i.drawImage(n, 0, 0), l = i.getImageData(0, 0, o.width, o.height), i.clearRect(0, 0, o.width, o.height)), i.drawImage(s, 0, 0);
          const d = i.getImageData(0, 0, o.width, o.height);
          l && A1(d, l);
          for (let c = 0; a && c < d.data.length; c += 4) {
            if (!d.data[c + 3]) continue;
            const h = Math.max(d.data[c], d.data[c + 1], d.data[c + 2]);
            if (h >= 24) continue;
            const u = (1 - h / 24) ** 2;
            d.data[c] = d.data[c] + 9 * u, d.data[c + 1] = d.data[c + 1] + 8 * u, d.data[c + 2] = d.data[c + 2] + 6 * u;
          }
          return i.putImageData(d, 0, 0), await createImageBitmap(o);
        } finally {
          o.width = o.height = 0;
        }
      }
    }
  ];
}
const D1 = {
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
function W1(e, t) {
  if (e.frameTemplate !== "future") return [];
  const r = e.setCode?.toLowerCase() === "fut" && e.colorCalibration === "set-hsb-v1", a = /* @__PURE__ */ new Set();
  return [...new Set(e.manaSymbols ?? [])].flatMap((s) => {
    const n = /^(?:\d+|X)$/.test(s), o = r ? D1[n ? "N" : s] : void 0, i = br(s), l = i ? t.get(i) : void 0;
    if (!o && !n || !i || !l || a.has(i)) return [];
    a.add(i);
    const d = n ? Vr().map((c) => {
      const h = t.get(c);
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
          o,
          n ? Vr() : null
        ]),
        bytes: l.width * l.height * 4,
        build: () => P1(l, o, d)
      }
    ];
  });
}
async function P1(e, t, r) {
  const a = document.createElement("canvas");
  a.width = e.width, a.height = e.height;
  try {
    const s = a.getContext("2d", { willReadFrequently: !0 });
    s.drawImage(e, 0, 0);
    const n = s.getImageData(0, 0, a.width, a.height);
    for (const l of r) {
      s.clearRect(0, 0, a.width, a.height), s.drawImage(l, 0, 0);
      const d = s.getImageData(0, 0, a.width, a.height).data;
      for (let c = 0; c < n.data.length; c++)
        c % 4 !== 3 && (n.data[c] = Math.max(n.data[c], d[c]));
    }
    const [o, i] = t ?? [
      [1, 1, 1],
      [1, 1, 1]
    ];
    for (let l = 0; l < a.height; l++)
      for (let d = 0; d < a.width; d++) {
        const c = (l * a.width + d) * 4;
        if (!n.data[c + 3]) continue;
        const h = Math.hypot((d + 0.5) / a.width - 0.5, (l + 0.5) / a.height - 0.5), u = Math.max(0, Math.min(1, (h - 0.31) / 0.03)), m = u * u * (3 - 2 * u);
        for (let g = 0; g < 3; g++)
          n.data[c + g] = Math.round(
            n.data[c + g] * (o[g] * (1 - m) + i[g] * m)
          );
      }
    return s.putImageData(n, 0, 0), await createImageBitmap(a);
  } finally {
    a.width = a.height = 0;
  }
}
async function U1(e, t, r) {
  const a = { images: t, dispose() {
  } }, s = new Map(Object.entries(u0(e))), n = {}, o = {}, i = /* @__PURE__ */ new Set(), l = [], d = /* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...[...(e.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((p) => p[1])
  ]);
  for (const p of e.rulesParagraphs ?? [])
    for (const b of p.runs) for (const S of b.text.matchAll(/\{([^}]+)\}/g)) d.add(S[1]);
  for (const p of d) {
    const b = /^\d+$/.test(p) ? "N" : p, S = Kr(e, p), k = S?.discColor ?? Ir[b], v = v1(e, b) ?? (S && Ir[b] ? pt(b === "W" ? "#efe7cb" : Ir[b]) : void 0);
    if (S && i.add(p), S?.glyphScale !== void 0 && (o[p] = S.glyphScale), !v || !k) continue;
    const R = S?.url ?? gt(p);
    if (S) {
      const M = t.get(S.url);
      if (!M) throw Error(`Historical mana asset unavailable: ${p}`);
      l.push({ url: S.url, source: M, palette: S, target: v });
    } else R && s.set(R, N1(k, v));
    n[p] = `rgb(${v.map((M) => Math.round(M * 255)).join(" ")})`;
  }
  const c = d.has("W") && wr(e, "W") === "historic-font", h = L1(e, t), u = O1(e, t), m = W1(e, t);
  if (!s.size && !l.length && !h.length && !u.length && !m.length && !Object.keys(n).length && !c)
    return a;
  const g = Object.assign(new Map(t), {
    manaColors: n,
    originalManaGlyphs: i,
    originalWhiteGlyph: c,
    manaGlyphScales: o
  }), f = [...s].flatMap(([p, b]) => {
    const S = t.get(p);
    return S ? [{ url: p, source: S, adjustment: b }] : [];
  }), w = [
    ...h,
    ...u,
    ...m,
    ...f.map(({ url: p, source: b, adjustment: S }) => ({
      url: p,
      key: F1(p, b.width, b.height, S),
      bytes: b.width * b.height * 4,
      build: () => _1(b, S)
    })),
    ...l.map(({ url: p, source: b, palette: S, target: k }) => ({
      url: p,
      key: JSON.stringify([
        "historical-mana-palette-v1",
        p,
        b.width,
        b.height,
        S,
        k
      ]),
      bytes: b.width * b.height * 4,
      build: () => Ll(b, S, k)
    }))
  ];
  let y = [];
  try {
    y = await t0.acquireMany(w, r), w.forEach(({ url: p }, b) => g.set(p, y[b].value));
    for (const p of i) {
      const b = Kr(e, p), S = g.get(b.url), k = gt(p);
      if (!S || !k) throw Error(`Historical mana asset unavailable: ${p}`);
      g.set(k, S);
    }
    return { images: g, dispose: () => y.forEach((p) => p.release()) };
  } catch (p) {
    throw y.forEach((b) => b.release()), p;
  }
}
function F1(e, t, r, a) {
  return JSON.stringify(["frame-hsb-paper-mask-v3", e, t, r, a]);
}
async function _1(e, t) {
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  try {
    const a = r.getContext("2d", { willReadFrequently: !0 });
    if (!a) throw Error("HSB preparation needs Canvas2D.");
    a.drawImage(e, 0, 0);
    const s = a.getImageData(0, 0, r.width, r.height);
    return Ol(s, t), a.putImageData(s, 0, 0), await createImageBitmap(r);
  } finally {
    r.width = r.height = 0;
  }
}
function N1(e, t) {
  const r = pt(e), [a, s, n] = cr(r), [o, i, l] = cr(t);
  if (s <= 0 || n <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (o - a + 540) % 360 - 180,
    saturationScale: i / s,
    brightnessScale: l / n
  };
}
function Fa(e, t) {
  if (e.layout && e.layout !== "normal") return [0, 0];
  const r = e.setCode?.toLowerCase();
  if (e.borderColor && e.borderColor !== (r === "8ed" ? "white" : "black")) return [0, 0];
  if (t === "retro" && we(e)) return [-18.5, -6];
  if (e.legendary ?? /\bLegendary\b/.test(e.typeLine ?? "")) return [0, 0];
  if (t === "retro") {
    if (r === "lea") return [-1.5, 1.5];
    if (r === "leb") return [-1, 2];
  }
  return t === "eighth" && r === "8ed" ? [0.5, -2] : t === "modern" && r === "m21" ? [-1, 1] : [0, 0];
}
const Ts = [0.08, 0.36, 0.64, 0.92, 1], z1 = [0.18, 0.18, 0.17];
function la(e, t, r, a, s, n) {
  if (s.length !== 2) return;
  const { box: o, width: i } = n, l = e - r / 2, d = e + r / 2, c = t - a / 2, h = t + a / 2;
  if (d <= o.left || l >= o.right || h <= o.top || c >= o.bottom || l >= o.left + i.left && d <= o.right - i.right && c >= o.top + i.top && h <= o.bottom - i.bottom)
    return;
  const u = (w) => Math.max(
    0,
    Math.min(d, o.right - i.right * w) - Math.max(l, o.left + i.left * w)
  ) * Math.max(
    0,
    Math.min(h, o.bottom - i.bottom * w) - Math.max(c, o.top + i.top * w)
  ) / (r * a);
  let m = u(0), g = 0;
  const f = [0, 0, 0];
  for (let w = 0; w < Ts.length; w++) {
    const y = u(Ts[w]), p = Math.max(0, m - y), b = w === 0 || w === 4 ? z1 : s[w === 2 ? 1 : 0];
    for (let S = 0; S < 3; S++) f[S] += b[S] * p;
    g += p, m = y;
  }
  if (g)
    return { color: [f[0] / g, f[1] / g, f[2] / g], alpha: g };
}
const $e = {
  left: 61.063333333333325 / (488 / 1500),
  right: 427.9656666666666 / (488 / 1500),
  top: 404.6309523809524 / (680 / 2100),
  bottom: 606.325 / (680 / 2100)
}, me = { left: 188, right: 1324, top: 1253, bottom: 1871 }, xt = { left: 26, right: 29, top: 29, bottom: 28 }, xs = 6.375 / (488 / 1500), Is = 6.375 / (680 / 2100), Y1 = { left: xs, right: xs, top: Is, bottom: Is }, H1 = {
  W: [186 / 255, 177 / 255, 176 / 255],
  U: [72 / 255, 110 / 255, 137 / 255],
  B: [88 / 255, 77 / 255, 85 / 255],
  R: [182 / 255, 62 / 255, 81 / 255],
  G: [129 / 255, 149 / 255, 92 / 255]
};
function q1(e, t) {
  if (t.length !== 2) return;
  const a = [...t].sort((h, u) => "RGUBW".indexOf(h) - "RGUBW".indexOf(u)).map((h) => H1[h]);
  if (!a[0] || !a[1]) return;
  const s = 1500 / e.width, n = 2100 / e.height, o = e.data.slice(), i = Math.min($e.left, me.left), l = Math.max($e.right, me.right), d = Math.min($e.top, me.top), c = Math.max($e.bottom, me.bottom);
  for (let h = Math.floor(d / n); h < Math.ceil(c / n); h++)
    for (let u = Math.floor(i / s); u < Math.ceil(l / s); u++) {
      const m = la((u + 0.5) * s, (h + 0.5) * n, s, n, [a[0], a[1]], {
        box: $e,
        width: Y1
      }), g = (u + 0.5) * s, f = (h + 0.5) * n, w = la(g, f, s, n, [a[0], a[1]], {
        box: me,
        width: xt
      });
      if (!m && !w) continue;
      const y = (h * e.width + u) * 4;
      if (e.data[y + 3]) {
        if (w) {
          const p = [
            g - me.left,
            me.right - g,
            f - me.top,
            me.bottom - f
          ], b = p.indexOf(Math.min(...p)), S = g >= $e.left && g < $e.right && f >= $e.top && f < $e.bottom, k = b === 0 ? me.left + (S ? xt.left + 2 : -2) : b === 1 ? me.right - (S ? xt.right + 2 : -2) : g, v = b === 2 ? me.top + (S ? xt.top + 2 : -2) : b === 3 ? me.bottom - (S ? xt.bottom + 2 : -2) : f, R = (Math.floor(v / n) * e.width + Math.floor(k / s)) * 4;
          for (let M = 0; M < 3; M++)
            e.data[y + M] = o[y + M] * (1 - w.alpha) + o[R + M] * w.alpha;
        }
        if (m)
          for (let p = 0; p < 3; p++)
            e.data[y + p] = e.data[y + p] * (1 - m.alpha) + m.color[p] * 255 * m.alpha;
      }
    }
}
const Gt = { left: 166.8794, right: 1338.8298, top: 1255.6105, bottom: 1882.7268 }, Bs = 6.375 / (488 * 0.984 / 1500 * 1.001), js = 6.375 / (680 * 0.99 / 2100 * 1.001), X1 = { left: Bs, right: Bs, top: js, bottom: js };
function J1(e, t, r, a, s) {
  return la(e, t, r, a, s, {
    box: Gt,
    width: X1
  });
}
const zr = {
  W: { hueDegrees: 8.4847, saturationScale: 0.42831, brightnessScale: 0.97071 },
  U: { hueDegrees: 164.886, saturationScale: 0.25883, brightnessScale: 0.841 },
  B: { hueDegrees: 157.329, saturationScale: 0.20015, brightnessScale: 0.62552 },
  R: { hueDegrees: -23.3867, saturationScale: 0.88939, brightnessScale: 0.9205 },
  G: { hueDegrees: 30.7835, saturationScale: 0.6094, brightnessScale: 0.79916 }
}, V1 = {
  W: { hueDegrees: 7.44281, saturationScale: 0.570206, brightnessScale: 0.845188 },
  U: { hueDegrees: -177.38556, saturationScale: 0.121282, brightnessScale: 0.656904 },
  B: { hueDegrees: 0, saturationScale: 0, brightnessScale: 0.452356 },
  R: { hueDegrees: -34.23136, saturationScale: 1.238404, brightnessScale: 0.866109 },
  G: { hueDegrees: 42.19413, saturationScale: 0.716825, brightnessScale: 0.656904 }
}, $s = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Gs = {
  W: [0.9, 0.91, 0.9],
  U: [0.32, 0.58, 0.75],
  B: [0.38, 0.4, 0.38],
  R: [0.8, 0.32, 0.34],
  G: [0.6, 0.66, 0.29]
}, Es = { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.992232 };
function K1(e, t, r) {
  const a = r ? zr : V1, s = t[0], n = t[1] ?? s;
  if (!s || !n || !zr[s] || !zr[n]) return;
  const o = t.length === 2 ? [...t].sort((l, d) => "RGUBW".indexOf(l) - "RGUBW".indexOf(d)).map((l) => Gs[l]) : [], i = o.length ? e.data.slice() : void 0;
  for (let l = 0; l < e.height; l++)
    for (let d = 0; d < e.width; d++) {
      const c = (l * e.width + d) * 4;
      if (!e.data[c + 3]) continue;
      const h = (d + 0.5) * 1500 / e.width, u = (l + 0.5) * 2100 / e.height, m = [e.data[c] / 255, e.data[c + 1] / 255, e.data[c + 2] / 255], g = Math.max(...m), f = J1(h, u, 1500 / e.width, 2100 / e.height, o), w = i ? h >= Gt.left && h < Gt.right && u >= Gt.top && u < Gt.bottom : h >= 187 && h < 1320 && u >= 1280 && u < 1864, y = i && h >= 165 && h <= 1345 && u >= 1248 && u <= 1885;
      if (!f && g < 0.075 && !(i && w) && !y) continue;
      const p = Math.min(h - 126, 1379 - h, u - 153, 1171 - u), b = Math.min(h - 170, 1340 - h, u - 1253, 1880 - u), S = p >= -1 && p < 13 || b >= -1 && b < 29;
      let k;
      if (w) {
        const v = Math.min(
          (h - 187) * 488 * 0.984 / 1500,
          (1320 - h) * 488 * 0.984 / 1500,
          (u - 1280) * 680 * 0.99 / 2100,
          (1864 - u) * 680 * 0.99 / 2100
        ), R = Math.floor(Math.max(0, v) / 11.5);
        let M = m;
        if (i && (h < 190 || u < 1284)) {
          const T = Math.min(e.width - 1, Math.max(d, Math.ceil(190 * e.width / 1500))), B = (Math.min(
            e.height - 1,
            Math.max(l, Math.ceil(1284 * e.height / 2100))
          ) * e.width + T) * 4;
          M = [i[B] / 255, i[B + 1] / 255, i[B + 2] / 255];
        }
        k = Be(M, a[R % 2 ? n : s]);
      } else if (y) {
        const v = [h - 165, 1345 - h, u - 1248, 1885 - u], R = v.indexOf(Math.min(...v)), M = R === 0 ? 160 : R === 1 ? 1350 : h, T = R === 2 ? 1240 : R === 3 ? 1890 : u, x = Math.min(e.width - 1, Math.floor(M * e.width / 1500)), A = (Math.min(e.height - 1, Math.floor(T * e.height / 2100)) * e.width + x) * 4;
        k = Be(
          [i[A] / 255, i[A + 1] / 255, i[A + 2] / 255],
          r ? Es : $s
        );
      } else if (S && m[0] > 0.45 && m[1] > 0.35 && m[2] < Math.min(m[0], m[1]) * 0.72) {
        const v = Gs[(p >= -1 && p < 13 ? p < 6 : b < 14) ? n : s], R = g / 0.97;
        k = [
          Math.min(1, v[0] * R),
          Math.min(1, v[1] * R),
          Math.min(1, v[2] * R)
        ];
      } else k = Be(m, r ? Es : $s);
      for (let v = 0; v < 3; v++)
        e.data[c + v] = Math.round(
          255 * (f ? f.color[v] * f.alpha + k[v] * (1 - f.alpha) : k[v])
        );
    }
}
async function Z1(e, t, r) {
  if (!pe(e)) return { images: t, dispose() {
  } };
  const a = t.get(Qt);
  if (!a) throw Error("Revised land frame asset unavailable");
  const s = Ao(e), n = vr(e), o = await Da.acquire(
    JSON.stringify([
      "revised-fourth-land-v5",
      Qt,
      a.width,
      a.height,
      s,
      n
    ]),
    a.width * a.height * 4,
    async () => {
      const l = document.createElement("canvas");
      l.width = a.width, l.height = a.height;
      try {
        const d = l.getContext("2d", { willReadFrequently: !0 });
        if (!d) throw Error("Revised land preparation needs Canvas2D");
        d.drawImage(a, 0, 0);
        const c = d.getImageData(0, 0, l.width, l.height);
        K1(c, s, n), d.putImageData(c, 0, 0);
        const h = l.width * 160 / 1500, u = l.height * 1240 / 2100, m = l.width * 1190 / 1500, g = l.height * 654 / 2100, f = l.width * (244 - 2.404) / (488 * 0.984), w = l.height * (515 - 9.9) / (680 * 0.99);
        return d.drawImage(
          l,
          h,
          u,
          m,
          g,
          f + (h - f) * 1.001,
          w + (u - w) * 1.001 + l.height * 0.25 / (680 * 0.99),
          m * 1.001,
          g * 1.001
        ), await createImageBitmap(l);
      } finally {
        l.width = l.height = 0;
      }
    },
    r
  ), i = Object.assign(new Map(t), t);
  return i.set(Qt, o.value), { images: i, dispose: () => o.release() };
}
async function Q1(e, t, r) {
  if (pe(e)) return Z1(e, t, r);
  const a = Ut(e);
  if (!a) return { images: t, dispose() {
  } };
  const s = (c) => {
    const h = t.get(c);
    if (!h) throw Error(`Historical dual-land asset unavailable: ${c}`);
    return h;
  }, n = s(a.base), o = s(a.overlay), i = s(a.mask), [l] = await Da.acquireMany(
    [
      {
        key: JSON.stringify([
          "abu-dual-frame-v2",
          a,
          n.width,
          n.height,
          u0(e)
        ]),
        bytes: n.width * n.height * 4,
        build: async () => {
          const c = document.createElement("canvas"), h = document.createElement("canvas");
          c.width = h.width = n.width, c.height = h.height = n.height;
          try {
            const u = c.getContext("2d"), m = h.getContext("2d");
            if (!u || !m) throw Error("Historical dual-land preparation needs Canvas2D.");
            m.drawImage(o, 0, 0, n.width, n.height), m.globalCompositeOperation = "destination-in", m.drawImage(i, 0, 0, n.width, n.height), u.drawImage(n, 0, 0), u.drawImage(h, 0, 0);
            const g = u.getImageData(0, 0, n.width, n.height);
            return q1(g, yn(e)), u.putImageData(g, 0, 0), await createImageBitmap(c);
          } finally {
            c.width = c.height = h.width = h.height = 0;
          }
        }
      }
    ],
    r
  ), d = Object.assign(new Map(t), t);
  return d.set(a.base, l.value), { images: d, dispose: () => l.release() };
}
const e2 = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Ls = {
  "apc/retro/black": [0, -1, 1.18, 1.18],
  "arn/retro/black": [-3, 0, 0.88, 0.88],
  "chr/retro/white": [6.5, -1, 1.06, 0.92],
  "drk/retro/black": [1, -3, 1.26, 1.32],
  "mmq/retro/black": [0, -1, 1, 1.02],
  "nem/retro/black": [2, -2.5, 1.12, 1.26],
  "ody/retro/black": [1.5, -2, 1.14, 1.06],
  "ons/retro/black": [5, -2.5, 1.2, 1.14],
  "pcy/retro/black": [2.5, -2, 1.26, 1.2],
  "s99/retro/white": [2, -1, 1.24, 1.24],
  "tsr/retro/black": [3.5, 0, 1.06, 1.16],
  "uds/retro/black": [0, 0, 1.2, 1.14],
  "ulg/retro/black": [2.5, -1, 1.14, 1.12],
  "vis/retro/black": [3, 1, 1.28, 1.24],
  "2x2/component/black": [2.5, -2.5, 0.98, 0.92],
  "2xm/component/black": [2.5, -1, 0.86, 0.84],
  "2xm/m15-accurate/black": [2.5, 0, 0.94, 0.94],
  "a25/m15-accurate/black": [-2, 1, 1.04, 1.08],
  "aer/component/black": [-0.5, -1, 0.94, 0.92],
  "aer/m15-accurate/black": [-0.5, 0.5, 1.02, 1.04],
  "afc/component/black": [-1, -2, 1.16, 1.08],
  "afc/m15-accurate/black": [-1.5, 0, 1.22, 1.22],
  "afr/m15-accurate/black": [0, 0, 1.28, 1.22],
  "ala/eighth/black": [0, 0, 1.12, 1.04],
  "arb/eighth/black": [-2, 1, 1, 1.02],
  "avr/eighth/black": [-2, 0.5, 0.96, 1.06],
  "bbd/component/black": [2, 0, 0.92, 0.88],
  "bbd/m15-accurate/black": [2, 1, 1.02, 1.04],
  "blb/component/black": [-2, -1.5, 0.98, 1],
  "blb/m15-accurate/black": [-1.5, -1, 1.14, 1.2],
  "blc/component/black": [2, -1, 1, 1],
  "blc/m15-accurate/black": [1.5, 1, 1.1, 1.14],
  "bng/eighth/black": [4, 1.5, 1, 0.9],
  "bok/eighth/black": [0.5, 0.5, 1.02, 1.08],
  "bro/component/black": [-1, -2.5, 0.96, 0.96],
  "bro/m15-accurate/black": [-1, -1.5, 1.08, 1.1],
  "c13/eighth/black": [2, 0, 1.1, 1.02],
  "c14/m15-accurate/black": [-1.5, 0, 0.96, 0.94],
  "c15/component/black": [-4.5, -0.5, 0.82, 0.8],
  "c15/m15-accurate/black": [-4.5, 0, 0.94, 0.9],
  "c19/component/black": [-1, 0, 0.92, 0.88],
  "c21/component/black": [-1, -0.5, 0.96, 0.96],
  "c21/m15-accurate/black": [-0.5, 0, 1.08, 1.08],
  "clb/component/black": [0, -2, 0.92, 0.92],
  "clb/m15-accurate/black": [0.5, -1.5, 1.08, 1.06],
  "cm2/m15-accurate/black": [-0.5, 1, 1.08, 1.06],
  "cmd/eighth/black": [3, 1, 1.08, 0.98],
  "cmm/component/black": [-1, -1, 0.96, 0.94],
  "cmm/m15-accurate/black": [-1, 0, 1.08, 1.12],
  "cn2/component/black": [-2, -1, 0.92, 0.84],
  "cn2/m15-accurate/black": [-2, 1, 1, 1],
  "cns/eighth/black": [2, 0, 1.08, 0.96],
  "con/eighth/black": [1.5, 0, 1.22, 1],
  "csp/eighth/black": [0.5, 1, 1, 1.06],
  "dd2/eighth/black": [2.5, 1, 1.04, 1.04],
  "ddc/eighth/black": [5, 1, 1.04, 1],
  "dde/eighth/black": [3.5, 0.5, 1.1, 1.06],
  "ddf/eighth/black": [1, 1, 1.06, 1.08],
  "ddg/eighth/black": [3.5, 0.5, 1.06, 1.1],
  "ddh/eighth/black": [3, 0.5, 0.92, 0.9],
  "ddi/eighth/black": [3, 0.5, 1.04, 1.02],
  "ddj/eighth/black": [2.5, 0, 1.1, 1.08],
  "ddl/eighth/black": [1.5, 1, 0.96, 0.92],
  "ddn/m15-accurate/black": [-2, 0, 0.9, 0.92],
  "ddo/component/black": [0, -1, 0.88, 0.84],
  "ddq/component/black": [0, -1.5, 0.98, 0.9],
  "ddq/m15-accurate/black": [0, 0, 1.1, 1.02],
  "dds/component/black": [-3, -1, 0.92, 0.92],
  "dds/m15-accurate/black": [-2.5, 0.5, 1.06, 1.02],
  "ddt/component/black": [0, -1, 0.9, 0.88],
  "ddu/m15-accurate/black": [-1, 1, 1.1, 1.1],
  "dft/component/black": [1, -1, 0.88, 0.84],
  "dft/m15-accurate/black": [0, 0.5, 0.98, 0.98],
  "dgm/eighth/black": [0, 0, 1.04, 1.04],
  "dka/eighth/black": [2.5, 0, 0.96, 0.92],
  "dmc/component/black": [2, -1.5, 0.98, 0.98],
  "dmr/m15-accurate/black": [4.5, 0.5, 1.18, 1.06],
  "dmu/component/black": [2.5, -2, 1, 0.96],
  "dmu/m15-accurate/black": [1, -1, 1.06, 1.12],
  "dpa/eighth/black": [1, 1, 1.08, 1.12],
  "drc/component/black": [0, -1, 0.98, 0.92],
  "drc/m15-accurate/black": [0, 0, 1.1, 1.04],
  "dsc/component/black": [3, -1, 0.94, 0.94],
  "dsc/m15-accurate/black": [2.5, 0.5, 1.04, 1.06],
  "dsk/component/black": [3, 0, 0.92, 0.92],
  "dsk/m15-accurate/black": [2, 1.5, 0.88, 0.88],
  "dst/eighth/black": [-3, 1, 0.96, 0.94],
  "e01/component/black": [-2, -0.5, 0.84, 0.86],
  "e01/m15-accurate/black": [-2, 1, 0.96, 1.04],
  "ecc/component/black": [-3, -1.5, 0.92, 0.92],
  "ecc/m15-accurate/black": [-3, 0, 1.04, 1.12],
  "ecl/component/black": [-1, -1.5, 0.96, 0.94],
  "ecl/m15-accurate/black": [-1, 0, 1.08, 1.04],
  "eld/m15-accurate/black": [-1, 1, 1.1, 0.96],
  "ema/component/black": [-3, -1, 0.86, 0.88],
  "ema/m15-accurate/black": [-3, 0.5, 0.96, 0.98],
  "emn/m15-accurate/black": [2, 0, 1.04, 1.08],
  "eoc/component/black": [1, -1, 0.94, 0.96],
  "eoc/m15-accurate/black": [1, 0.5, 1.06, 1.06],
  "eoe/component/black": [1.5, -1, 0.96, 0.96],
  "eve/eighth/black": [4.5, 1, 1.08, 1.02],
  "fdc/component/black": [1.5, -1, 0.98, 0.96],
  "fdc/m15-accurate/black": [1, -0.5, 1.06, 1.1],
  "fdn/component/black": [1.5, -1.5, 1.02, 1],
  "fdn/m15-accurate/black": [1.5, -0.5, 1.14, 1.16],
  "frc/m15-accurate/black": [0.5, 0.5, 1.1, 1.04],
  "frf/component/black": [-0.5, -0.5, 0.96, 0.92],
  "frf/m15-accurate/black": [-1, 0.5, 1.06, 1.02],
  "gn3/component/black": [0.5, -2, 0.98, 0.92],
  "gnt/m15-accurate/black": [3, 1, 1.06, 1.08],
  "hob/component/black": [-1, -1, 0.96, 0.94],
  "hob/m15-accurate/black": [-1, 1, 1.08, 1.04],
  "hoc/component/black": [-0.5, -1, 0.96, 0.98],
  "hoc/m15-accurate/black": [-1, 0.5, 1.08, 1.06],
  "hop/eighth/black": [4, 0, 1.06, 1.04],
  "hou/component/black": [-3, -1, 0.96, 0.88],
  "hou/m15-accurate/black": [-3, 0, 1.12, 0.96],
  "iko/component/black": [-1.5, -0.5, 0.92, 0.92],
  "iko/m15-accurate/black": [-1.5, 0.5, 1.04, 1.02],
  "ima/component/black": [-0.5, -0.5, 0.92, 0.9],
  "ima/m15-accurate/black": [0, 1, 1.06, 1],
  "inr/component/black": [-1, -1.5, 0.96, 0.98],
  "inr/m15-accurate/black": [-1, 0, 1.08, 1.12],
  "j22/component/black": [3, -2, 0.96, 0.98],
  "j22/m15-accurate/black": [3, -1, 1.08, 1.12],
  "j25/component/black": [0, -1.5, 0.96, 0.98],
  "j25/m15-accurate/black": [0, 0, 1.1, 1.08],
  "jmp/m15-accurate/black": [0.5, 0, 0.92, 0.94],
  "jou/eighth/black": [0, 1, 0.98, 0.96],
  "kld/component/black": [0, -0.5, 0.88, 0.92],
  "ktk/m15-accurate/black": [-0.5, 0, 1.06, 1.1],
  "lcc/component/black": [-1, -1, 1, 0.94],
  "lcc/m15-accurate/black": [-2, 0, 1.08, 1.08],
  "lci/component/black": [0, -1.5, 0.98, 0.96],
  "lci/m15-accurate/black": [0, 0, 1.1, 1.1],
  "m10/eighth/black": [5, 0.5, 1.08, 1],
  "m11/eighth/black": [4, 0.5, 1.06, 1.02],
  "m12/eighth/black": [4, 0.5, 1.06, 1],
  "m13/eighth/black": [4.5, 0.5, 1.06, 1.06],
  "m15/component/black": [1, -0.5, 0.94, 0.9],
  "m19/component/black": [2.5, 1, 1.04, 0.98],
  "m19/m15-accurate/black": [3, 1.5, 1.08, 1.02],
  "m20/component/black": [1.5, 0.5, 1.02, 1.02],
  "mbs/eighth/black": [1, -0.5, 1.06, 1.04],
  "mh1/component/black": [0, 0, 0.92, 0.94],
  "mh2/component/black": [1, -1, 0.96, 0.94],
  "mh2/m15-accurate/black": [0.5, 0, 1.04, 1.06],
  "mid/m15-accurate/black": [-1.5, 1, 1.1, 1.08],
  "mkc/m15-accurate/black": [-3, 0, 1.04, 1.14],
  "mkm/m15-accurate/black": [-1.5, 0, 1.1, 1.1],
  "mm3/m15-accurate/black": [2, 1, 0.88, 1.08],
  "mma/eighth/black": [1.5, 0, 0.94, 0.96],
  "moc/component/black": [-1, -2, 0.96, 0.96],
  "moc/m15-accurate/black": [-1, -1.5, 1.08, 1.08],
  "mom/component/black": [0.5, -2, 0.92, 0.92],
  "msc/component/black": [-3.5, -1, 0.9, 0.88],
  "msh/component/black": [-5.5, -1.5, 0.92, 0.88],
  "msh/m15-accurate/black": [-6, -1, 0.92, 0.96],
  "ncc/component/black": [-4, -2, 0.96, 0.92],
  "ncc/m15-accurate/black": [-4, -1, 1.08, 1.08],
  "nec/m15-accurate/black": [-1, 0.5, 1.1, 1.12],
  "neo/m15-accurate/black": [2, -1, 0.88, 0.86],
  "nph/eighth/black": [-1, 0.5, 1.08, 1],
  "ogw/component/black": [-3.5, -0.5, 0.92, 0.86],
  "ogw/m15-accurate/black": [-4, 0, 1, 1.06],
  "one/component/black": [1, -1.5, 0.98, 0.96],
  "ori/component/black": [0, -1, 0.8, 0.78],
  "ori/m15-accurate/black": [0, 0.5, 0.9, 0.9],
  "otc/component/black": [2, -1.5, 0.96, 1.02],
  "otc/m15-accurate/black": [2, -0.5, 1.12, 1.18],
  "otj/component/black": [2.5, -2, 0.98, 0.96],
  "otj/m15-accurate/black": [3, -1, 1.1, 1.12],
  "pc2/eighth/black": [3.5, 0.5, 1, 0.98],
  "plc/eighth/black": [2.5, 0.5, 1.02, 1],
  "rtr/eighth/black": [2.5, 0, 1.1, 1.02],
  "rvr/component/black": [-2.5, -1, 0.96, 0.9],
  "rvr/m15-accurate/black": [-2.5, -1.5, 1.06, 1.08],
  "scd/component/black": [1.5, -2, 1.04, 0.88],
  "scd/m15-accurate/black": [1, 0.5, 1.1, 1.12],
  "shm/eighth/black": [5, 0, 0.9, 0.92],
  "sld/component/black": [-2, -0.5, 1.14, 1.18],
  "sld/m15-accurate/black": [-2.5, 0.5, 1.1, 1.12],
  "snc/component/black": [1, -1, 0.88, 0.84],
  "snc/m15-accurate/black": [1.5, -0.5, 1, 1.02],
  "soc/component/black": [1.5, -1, 0.96, 0.94],
  "soi/component/black": [-1.5, -1, 0.94, 0.96],
  "soi/m15-accurate/black": [-2, 0, 1.06, 1.04],
  "sok/eighth/black": [2, 0.5, 1, 0.94],
  "som/eighth/black": [1, 0.5, 1.08, 1],
  "sos/component/black": [1.5, -1, 0.96, 0.94],
  "sos/m15-accurate/black": [1, 0, 1.06, 1],
  "spm/component/black": [1.5, -1, 0.94, 0.96],
  "spm/m15-accurate/black": [0.5, 0, 1.02, 1.1],
  "stx/component/black": [0, -1, 1, 1],
  "stx/m15-accurate/black": [0, 1, 1.1, 1.1],
  "ths/eighth/black": [2.5, 0.5, 0.98, 0.96],
  "tla/component/black": [-1.5, -1.5, 0.9, 0.94],
  "tla/m15-accurate/black": [-1.5, -0.5, 1.02, 1.1],
  "tle/m15-accurate/black": [-3.5, 0, 1.08, 1.12],
  "tmc/component/black": [0, -1, 0.94, 0.94],
  "tmc/m15-accurate/black": [0, 0.5, 1.04, 1.1],
  "tmt/component/black": [0, -1, 0.94, 0.94],
  "tmt/m15-accurate/black": [0, 0.5, 1.06, 1.08],
  "uma/m15-accurate/black": [3, 1, 0.98, 1],
  "unf/component/black": [6, -2, 0.92, 0.88],
  "unf/m15-accurate/black": [5.5, -2, 0.92, 1],
  "voc/component/black": [-7, -1.5, 0.96, 0.88],
  "vow/component/black": [0.5, -1, 0.96, 0.96],
  "vow/m15-accurate/black": [1, 0, 1.1, 1.1],
  "war/component/black": [0.5, -1.5, 0.92, 0.9],
  "war/m15-accurate/black": [2, -1, 1.08, 1.08],
  "woc/component/black": [-0.5, -1, 1, 1.04],
  "woc/m15-accurate/black": [-1, -0.5, 1.12, 1.12],
  "woe/component/black": [2.5, -1, 0.96, 0.96],
  "wwk/eighth/black": [1, 0, 1.08, 1.12],
  "xln/component/black": [3, -0.5, 1, 1.08],
  "xln/m15-accurate/black": [4, 0, 1.22, 1.24],
  "zen/eighth/black": [1.5, 0, 1.02, 1],
  "znr/m15-accurate/black": [0, 1, 1.02, 1.06]
}, As = {
  // Black outer contour after the checksum-guarded LEG SVG repair.
  "leg/retro/black": [3.25, 1.5, 1.05, 1.125],
  "6ed/retro/white": [2, -2, 1.08, 1.08]
}, Os = {
  m15: { family: "m15-accurate", delta: [1, 0, 1, 1] },
  m21: { family: "m15-accurate", delta: [2, 0, 1.1, 1.06] },
  woe: { family: "m15-accurate", delta: [2, 0, 1.08, 1.08] },
  tdm: { family: "m15-accurate", delta: [0, 0, 1.08, 1.08] },
  "8ed": { family: "eighth", delta: [-4, 0, 1, 0.92] },
  "9ed": { family: "eighth", delta: [0, 1, 0.9, 0.92] }
};
function t2(e, t, r) {
  if (e.frameTreatment === "colorshifted") return r;
  const a = e.setCode?.toLowerCase() ?? "", s = Object.hasOwn(Os, a) ? Os[a] : void 0;
  let n = r;
  return s && !e.setSymbol && Te(t) && s.family === e.frameAssetFamily && (n = f0(r, s.delta)), e.frameAssetFamily ? _a(e, t, n, e.frameAssetFamily) : n;
}
function _a(e, t, r, a) {
  if (e.setSymbol || !Te(t) || L !== e2 || (e.layout ?? "normal") !== "normal" || ["component", "m15-accurate"].includes(a) && J(e).legendary)
    return r;
  const s = e.borderColor ?? (a === "retro" ? Me(e) : Re(e.setCode).border === "#eeedeb" ? "white" : "black"), n = `${e.setCode?.trim().toLowerCase() ?? ""}/${a}/${s}`;
  if (n === "leg/retro/black" && !we(e)) return r;
  const o = Object.hasOwn(As, n) ? As[n] : Object.hasOwn(Ls, n) ? Ls[n] : void 0;
  return o ? f0(r, o) : r;
}
function f0(e, t) {
  const [r, a, s, n] = e, [o, i, l, d] = t;
  return [r + s + o - s * l, a + n / 2 + i - n * d / 2, s * l, n * d];
}
const r2 = 0.045;
function a2(e) {
  return de(e) ? U0 : r2;
}
const It = "#fbf0c5", dt = "#ccdaf2", Kt = "#9c9995", Bt = "#edaa8d", ct = "#dde6e2", s2 = {
  W: [It, It],
  U: [dt, dt],
  B: [Kt, Kt],
  R: [Bt, Bt],
  G: [ct, ct],
  WU: [It, dt],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [Bt, It],
  WG: [ct, It],
  UB: [dt, Kt],
  UR: [dt, Bt],
  UG: [ct, dt],
  BR: ["#b4afb5", "#f2b096"],
  BG: [Kt, ct],
  RG: [Bt, ct]
};
function n2(e, t, r) {
  if (!t.land) return;
  const a = s2[t.frame];
  if (!a) return;
  const s = 34 + r, n = 420 - 2 * r, o = e.createLinearGradient(s, 0, s + n, 0);
  o.addColorStop(0, a[0]), o.addColorStop(0.35, a[0]), o.addColorStop(0.65, a[1]), o.addColorStop(1, a[1]), e.save(), e.globalCompositeOperation = "multiply", e.fillStyle = o, e.fillRect(s, 425, n, 203.5), e.restore();
}
function o2(e, t, r, a) {
  if (!t.land || t.frame !== "Artifact") {
    a();
    return;
  }
  const s = 34 + r, n = 420 - 2 * r;
  for (const o of [!1, !0])
    e.save(), e.beginPath(), o || e.rect(0, 0, 488, 680), e.rect(s, 425, n, 203.5), e.clip("evenodd"), e.filter = `grayscale(1) brightness(${o ? 0.9 : 0.63})`, a(), e.restore();
}
function i2(e, t, r) {
  if (!t.land) return;
  e.save(), e.shadowColor = "transparent";
  const a = e.createLinearGradient(0, 625.75, 0, 628.25);
  a.addColorStop(0, "#ffffff00"), a.addColorStop(0.3, "#ffffffb0"), a.addColorStop(0.7, "#ffffffb0"), a.addColorStop(1, "#ffffff00"), e.fillStyle = a, e.fillRect(34 + r, 625.75, 420 - 2 * r, 2.5), e.restore();
}
function p0(e) {
  if (e.setSymbol) return null;
  const t = e.setCode?.toLowerCase();
  return t === "m15" || t === "war" ? t : null;
}
function b0(e, t, r, a, s, n, o, i, l, d) {
  const [c, h, u, m] = d ? r === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, r === "m15" ? 0.7 : 1.2];
  s += h - o * (c - 1) / 2, n += u - i * (c - 1) / 2, o *= c, i *= c;
  const g = !a || a === "common", f = document.createElement("canvas"), w = 3, y = 4;
  f.width = Math.ceil((o + w * 2) * y), f.height = Math.ceil((i + w * 2) * y);
  const p = f.getContext("2d");
  p.scale(y, y), p.translate(w, w), p.drawImage(
    t,
    l[0] * t.width,
    l[1] * t.height,
    l[2] * t.width,
    l[3] * t.height,
    0,
    0,
    o,
    i
  ), p.globalCompositeOperation = "source-in";
  const b = a === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : a === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], S = p.createLinearGradient(0, i * 0.65, o, i * 0.35);
  S.addColorStop(0, b[0]), S.addColorStop(0.35, b[1]), S.addColorStop(0.6, b[2]), S.addColorStop(1, b[3]), p.fillStyle = g ? "#111111" : S, p.fillRect(0, 0, o, i);
  const k = r === "m15" ? 32 : 27, v = new Path2D(
    r === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), R = new DOMMatrix().translate(-l[0] * o / l[2], -l[1] * i / l[3]).scale(o / (k * l[2]), i / (32 * l[3])), M = new Path2D();
  M.addPath(v, R), p.globalCompositeOperation = "destination-over", p.fillStyle = g ? "#f8f8f5" : "#111111", p.fill(M), p.strokeStyle = p.fillStyle, p.lineWidth = r === "war" && g ? 2 : m, p.lineJoin = "round", p.stroke(M), e.drawImage(
    f,
    s - w,
    n - w,
    f.width / y,
    f.height / y
  ), f.width = f.height = 0;
}
const Ds = {
  // Frozen frame-normalized train/held-out study: legends-symbols.json.
  "leg/black": [436, 39.25, 26.975, 23.9],
  "sum/white": [434.5, 44.5, 26.5, 23.4],
  "chr/white": [434, 42, 27, 23.4],
  "hml/black": [433, 44.5, 27, 23.4],
  "rqs/white": [435.5, 42.5, 26.5, 23.4],
  "5ed/white": [437, 42, 26.5, 23.4],
  "por/black": [438.5, 44.5, 26.5, 23.4],
  "exo/black": [438.5, 44.5, 26.5, 23.4],
  "usg/black": [438.5, 44, 26.5, 23.4],
  "ath/white": [439, 43.5, 26, 23.4],
  "ulg/black": [438.5, 44, 26.5, 23.4],
  "6ed/white": [439, 43.5, 26.5, 23.4],
  "ptk/white": [439, 43, 26.5, 23.4],
  "uds/black": [439, 44, 26, 23.4],
  "s99/white": [439, 43, 26.5, 23.4],
  "brb/white": [438.5, 43.5, 26.5, 23.4],
  "btd/white": [438.5, 43.5, 26, 23.4],
  "apc/black": [439, 44, 27, 23.4],
  "ody/black": [438.5, 44, 27, 23.4],
  "jud/black": [439, 44, 26.5, 23.4],
  "tsb/black": [438.5, 46, 26.5, 23.4],
  "sld/black": [436.5, 46.5, 26, 23.4],
  "tsr/black": [437.5, 46.5, 26, 23.4],
  "brc/black": [437.5, 46, 26.5, 23.4],
  "dmr/black": [436.5, 46.5, 26, 23.4],
  "rvr/black": [436.5, 46, 25.5, 23.4],
  "mh3/black": [436.5, 46, 25.5, 23.4]
};
function l2(e) {
  if ((e.layout ?? "normal") !== "normal") return;
  const t = `${e.setCode?.toLowerCase() ?? ""}/${Me(e)}`;
  if (!(t === "leg/black" && !we(e)))
    return Object.hasOwn(Ds, t) ? Ds[t] : void 0;
}
function d2(e) {
  const t = (!e.borderColor || e.borderColor === "black") && !!we(e);
  return {
    fontSize: t ? 21.7 * 1.03 : 21.7,
    dx: t ? -2.5 : 0,
    dy: 0
  };
}
const c2 = {
  size: 18,
  x: 49.25,
  width: 1.04,
  shadow: 2,
  inset: 0.1,
  align: "left",
  maximum: 338
}, h2 = {
  size: 27.8,
  x: 452.25,
  width: 0.99,
  shadow: 1.75,
  inset: 0.3,
  align: "right",
  maximum: 68
};
function Ws(e, t, r) {
  const a = document.createElement("canvas");
  a.width = e.canvas.width, a.height = e.canvas.height;
  const s = a.getContext("2d");
  if (!s) throw Error("Legends footer needs a Canvas2D context");
  const n = e.getTransform();
  s.setTransform(n), s.translate(r.x, 640), s.scale(r.width, 1), s.font = `${r.size}px "CardRenderer MTG MPlantin", Georgia`, s.textAlign = r.align, s.textBaseline = "alphabetic", s.letterSpacing = "0px", s.fillStyle = "#f2eee3", s.fillText(t, 0, 0, r.maximum / r.width), s.globalCompositeOperation = "destination-out", s.lineWidth = 2 * r.inset, s.strokeText(t, 0, 0, r.maximum / r.width), e.save(), e.resetTransform(), e.shadowColor = "#17140f", e.shadowBlur = 0, e.shadowOffsetX = e.shadowOffsetY = r.shadow * n.a, e.drawImage(a, 0, 0), e.restore(), a.width = a.height = 0;
}
function u2(e, t) {
  return !we(t) || t.borderColor && t.borderColor !== "black" ? !1 : (t.artist && Ws(e, `Illus. © 1994 ${t.artist}`, c2), t.power != null && t.toughness != null && Ws(e, `${t.power}/${t.toughness}`, h2), !0);
}
function m2(e, t) {
  const r = t.setCode?.toLowerCase();
  if (!["usg", "ulg", "uds"].includes(r ?? "") || (t.layout ?? "normal") !== "normal")
    return !1;
  e.save(), e.textAlign = "center", e.textBaseline = "alphabetic", e.shadowColor = "#17140f", e.shadowOffsetX = e.shadowOffsetY = 1.5 * e.getTransform().a, e.fillStyle = "#f2eee3", e.font = '19px "CardRenderer MTG MPlantin", Georgia';
  const a = t.power != null && t.toughness != null ? 292 : 365;
  t.artist && e.fillText(`Illus. ${t.artist}`, 244, 626, a), t.power != null && t.toughness != null && (e.shadowColor = "#000b", e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.fillText(
    `${t.power}/${t.toughness}`,
    (0.8074 + 0.1367 / 2) * 488,
    (0.895 + 0.043 / 2) * 680,
    0.1367 * 488
  )), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.textBaseline = "alphabetic", e.font = '9.5px "CardRenderer MTG MPlantin", Georgia';
  const s = O(t), n = !/\bLand\b/.test(t.typeLine ?? "") && !(s.length === 1 && ["W", "R"].includes(s[0]));
  e.fillStyle = n ? "#f2eee3" : "#17140f";
  const o = r === "usg" ? 1998 : 1999, i = t.collectorNumber ? ` ${t.collectorNumber}/${r === "usg" ? 350 : 143}` : "", l = t.legalText === void 0 ? `©1993–${o} Wizards of the Coast, Inc.${i}` : t.legalText;
  return l && e.fillText(l, 244, 640, 365), e.restore(), !0;
}
function g2(e, t, r) {
  r.endsWith("/seventh/regular/w.png") && e.drawImage(
    t,
    182 / 1500 * t.width,
    1258 / 2100 * t.height,
    1160 / 1500 * t.width,
    585 / 2100 * t.height,
    160 / 1500 * 488,
    1256 / 2100 * 680,
    1184 / 1500 * 488,
    605 / 2100 * 680
  );
}
function f2(e, t) {
  const r = 52.053333333333335, a = 1255 / 2100 * 680, s = 1346 / 1500 * 488, n = 1861 / 2100 * 680, o = 17 / 1500 * 488, i = 17 / 2100 * 680, l = (c) => {
    e.moveTo(...c[0]);
    for (const h of c.slice(1)) e.lineTo(...h);
    e.closePath();
  };
  e.save();
  const d = e.filter;
  e.filter = "none", e.fillStyle = "#00000047", e.beginPath(), l([
    [r, a],
    [s, a],
    [s - o, a + i],
    [r + o, a + i]
  ]), l([
    [s, a],
    [s, n],
    [s - o, n - i],
    [s - o, a + i]
  ]), e.fill(), e.beginPath(), l([
    [r, a],
    [r + o, a + i],
    [r + o, n - i],
    [r, n]
  ]), l([
    [r, n],
    [r + o, n - i],
    [s - o, n - i],
    [s, n]
  ]), e.clip(), e.filter = `${d === "none" ? "" : d + " "}brightness(1.35)`, e.drawImage(t, 0, 0, 488, 680), e.restore();
}
const se = {
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
  // Crown and detached foot measured together; preserve the existing white rim.
  fem: {
    right: 441.75,
    centerY: 390.75,
    width: 20.75,
    height: 16.75,
    crop: [0, 0.12109375, 1, 0.724609375]
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
}, p2 = {
  W: { ...se.por, right: 436.75, centerY: 389.75 },
  U: { ...se.por, right: 436.5, centerY: 392.75 },
  R: { ...se.por, right: 433.75, centerY: 392 },
  G: { ...se.por, right: 434, centerY: 390.75 }
}, b2 = {
  all: {
    U: { ...se.all, right: 427.5, centerY: 393.25 },
    W: { ...se.all, right: 427.25, centerY: 392.75 }
  },
  mir: {
    G: { ...se.mir, right: 437, centerY: 390.25 },
    W: { ...se.mir, right: 437.75, centerY: 389.25 }
  },
  sth: {
    G: { ...se.sth, right: 434, centerY: 391 },
    R: { ...se.sth, right: 433.5, centerY: 391.75 },
    W: { ...se.sth, right: 435.25, centerY: 389.25 }
  },
  tmp: {
    U: { ...se.tmp, right: 433, centerY: 392.75 },
    W: { ...se.tmp, right: 433.25, centerY: 389.5 }
  },
  vis: {
    W: { ...se.vis, right: 437.5, centerY: 389.25 }
  },
  wth: {
    W: { ...se.wth, right: 435.75, centerY: 389.75 }
  },
  hml: {
    R: { ...se.hml, right: 437.75, centerY: 393.5 }
  },
  por: p2
};
function w2(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  if (e.setSymbol || !Object.hasOwn(se, t)) return null;
  const r = O(e);
  return r.length === 1 && !/\b(?:Land|Artifact)\b/.test(e.typeLine ?? "") ? b2[t]?.[r[0]] ?? se[t] : se[t];
}
function y2(e) {
  return e.setSymbol || e.setCode?.toLowerCase() !== "exo" ? null : e.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : e.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const da = {
  arn: { count: 6, white: [2] },
  leg: { count: 6, white: [0, 1, 2, 3, 4] },
  hml: { count: 5, white: [3] },
  vis: { count: 2, white: [1] },
  all: { count: 5, white: [0, 1, 2] },
  wth: { count: 8, white: [0, 1, 2, 3, 4, 5, 6] },
  exo: { count: 6, white: [0, 1, 2, 3, 4] },
  ice2: { count: 16, white: [0] },
  por: { count: 21, white: Array.from({ length: 20 }, (e, t) => t) },
  tmp: { count: 2, white: [1] }
}, w0 = (e) => `${e}#opaque-print-details-v1`, S2 = (e) => Object.keys(da).some((t) => e === `${K.KEYRUNE_ROOT}/${t}.svg`);
async function k2(e, t) {
  const r = Object.keys(da).find((c) => e === `${K.KEYRUNE_ROOT}/${c}.svg`);
  if (!r) return null;
  const a = new DOMParser().parseFromString(await t.text(), "image/svg+xml"), s = a.documentElement, n = a.querySelectorAll("path"), o = n[0]?.getAttribute("d") ?? "", i = o.match(/M[^M]*/g) ?? [], l = da[r];
  if (s.localName !== "svg" || a.querySelector("parsererror") || n.length !== 1 || i.length !== l.count || i.some((c) => /m/.test(c) || !/[zZ]\s*$/.test(c)))
    throw new Error(`Unexpected pinned ${r} symbol paths.`);
  const d = a.createElementNS("http://www.w3.org/2000/svg", "path");
  return d.setAttribute("d", l.white.map((c) => i[c]).join("")), d.setAttribute("fill", "#fff"), s.replaceChildren(d), new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" });
}
function zt(e, t, r, a, s, n, o = "#ababab") {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#17140f", e.fillText(t, r + n, a + n, s), e.fillStyle = o, e.fillText(t, r, a, s), e.restore();
}
const v2 = {
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
function y0() {
  return v2;
}
function Yr(e, t, r, a) {
  const s = y0()[r];
  e.save(), e.translate(s.x, s.y), e.scale(s.width, 1), e.font = `${s.size}px "CardRenderer MTG ${r === "title" ? "Goudy" : "MPlantin"}", Georgia`, e.textAlign = "left", e.textBaseline = r === "artist" ? "alphabetic" : "middle", zt(e, t, 0, 0, a / s.width, r === "artist" ? 1.25 : 1), e.restore();
}
function C2(e, t, r, a) {
  const s = y0(), n = t.wordingMode === "oracle" ? 10 : 15, o = r.reduce((d, c) => d + c.runs.reduce((h, u) => h + u.text.length, 0), 0) > 150, i = (d) => ({
    leading: d.leading,
    paragraphGap: d.paragraph,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    centerOffset: d.offset
  });
  if (t.rulesAlignment?.mode !== "left") {
    const d = Rt(
      e,
      r,
      a,
      s.basic,
      s.basic.size,
      n,
      5,
      { ...i(s.basic), balanceLines: !0 },
      150
    );
    if (d)
      return o ? Y(
        e,
        r.map((c) => ({ ...c, align: "center" })),
        s.dual,
        s.dual.size,
        Math.min(n, s.dual.size),
        { ...i(s.dual), balanceLines: !0 }
      ) : d;
  }
  const l = o ? s.dual.size : s.basic.size;
  return Y(e, r, s.dual, l, Math.min(n, l), i(s.dual));
}
function R2(e, t, r, a = !1, s) {
  S0(
    e,
    t,
    r,
    {
      right: 435,
      centerY: 44.5,
      pitch: 27,
      size: 23.4,
      whiteSize: 21
    },
    a,
    s
  );
}
function M2(e, t, r, a = !1, s) {
  S0(
    e,
    t,
    r,
    {
      right: 432,
      centerY: 46,
      pitch: 27,
      size: 23.9,
      whiteSize: 20.5
    },
    a,
    s
  );
}
function S0(e, t, r, a, s, n) {
  t.forEach((o, i) => {
    const { size: l } = a, d = a.right - (t.length - 1 - i) * (a.pitch + (n?.spacing ?? 0)) - l / 2, c = a.centerY - l / 2;
    if (o !== "W" || s || r.originalManaGlyphs?.has("W")) {
      ee(e, o, d, c, l, r, !1, n);
      return;
    }
    pa(
      e,
      d,
      c,
      l,
      a.whiteSize,
      r.manaColors?.W,
      At(n, o)
    );
  });
}
const k0 = (e, t, r, a, s, n, o = !1, i) => {
  if (t !== "W" || n.originalManaGlyphs?.has("W"))
    return ee(e, t, r, a, s, n, o, i);
  pa(
    e,
    r,
    a,
    s,
    s * 0.87,
    n.manaColors?.W,
    At(i, t)
  );
};
function T2(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function x2(e, t) {
  e.save(), e.font = '22.5px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", zt(e, `Illus. © ${t}`, 49, 631, 338, 1.25), e.restore();
}
const ur = (e) => e?.runs.map((t) => t.text).join("") ?? "", Ps = (e) => e.length === 2 && /^[A-Za-z ,]+$/.test(ur(e[0])) && ur(e[0]).length <= 20;
function I2(e, t, r, a, s, n, o, i) {
  const l = (m) => m.role === "rules" && m.runs.length > 0 && !ur(m).includes(`
`) && m.align === void 0;
  if (!r.length || !r.every(l) || t.some((m) => m.align) || r.length !== 1 && !Ps(r)) return null;
  const d = (m) => m.map(
    (g, f) => ({
      ...g,
      align: g.align ?? (g.role === "flavor" || Ps(m) && f === 0 && !/^Enchant\b/.test(ur(g)) ? "left" : "center")
    })
  ), c = { x: 70, y: a - 6, width: 348, height: s - 8 }, h = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, u = Y(e, d(r), c, n, n, h);
  return u.overflow || u.lines.length > 5 ? null : Y(
    e,
    d(t),
    { ...c, verticalLimits: i },
    n,
    o,
    h
  );
}
function Us(e, t) {
  return !we(e) || e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode !== "original" ? t : t.map(
    (r) => r.role !== "rules" ? r : {
      ...r,
      runs: r.runs.map((a) => ({
        ...a,
        text: a.text.replace(/\{(\d+|[XYZ])\}/g, "$1")
      }))
    }
  );
}
const mr = (e) => e.runs.map((t) => t.text).join(""), B2 = (e) => e.role === "rules" && /^[A-Za-z ,]+$/.test(mr(e)) && mr(e).length <= 28, Zt = { x: 72, y: 413, width: 344, height: 182 }, Hr = {
  leading: 1,
  paragraphGap: 0,
  flavorGap: 0,
  flavorOrphans: !1,
  flavorSeparator: !1,
  centerOffset: -14
}, Fs = (e) => e.map((t, r) => ({
  ...t,
  align: t.role === "rules" && (e.some((a) => a.role === "flavor") || r === 0 && e.length > 1 && B2(t)) ? "left" : "center"
}));
function j2(e, t, r, a) {
  if (!we(t) || t.borderColor && t.borderColor !== "black") return null;
  const s = t.wordingMode === "oracle" ? 10 : 15, n = a.reduce(
    (l, d) => l + mr(d).replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
    0
  );
  if (t.rulesAlignment?.mode !== "left" && n <= (a.every((l) => l.role === "flavor") ? 135 : 130) && a.length > 0 && a.every((l) => l.align === void 0 && !mr(l).includes(`
`)) && r.every((l) => l.align === void 0)) {
    const l = {
      ...Hr,
      leading: 1.1,
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, d = Y(e, Fs(a), Zt, 27.5, 27.5, l);
    if (!d.overflow && d.lines.length <= 5)
      return Y(e, Fs(r), Zt, 27.5, s, l);
  }
  const i = Y(e, r, Zt, 22.25, 21.75, Hr);
  return i.overflow ? Y(e, r, Zt, 15.5, s, {
    ...Hr,
    leading: 1.2
  }) : i;
}
const _s = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: !1,
  flavorSeparator: !1
};
function $2(e, t) {
  if (Ca(t)) return null;
  const [r, a, s, n] = ke(va(t).rules), o = ya(t), i = Us(
    t,
    o?.paragraphs ?? Mt({
      rulesText: t.rulesText ?? "",
      rulesParagraphs: t.rulesParagraphs
    })
  ), l = t.rulesAlignment?.mode === "left", d = l ? i.map((B) => B.role === "rules" ? { ...B, align: "left" } : B) : i, c = t.rulesAlignment?.mode === "auto" ? Us(t, t.rulesAlignment.reference ?? d) : d, h = t.wordingMode === "oracle" ? 10 : 15;
  if (pe(t)) return C2(e, t, d, c);
  const u = j2(e, t, d, c);
  if (u) return u;
  const m = t.setCode?.toLowerCase(), g = vi(m) ? { ..._s, flavorAttribution: "right" } : _s, f = m === "lea" && t.wordingMode === "oracle" ? [428, 590] : void 0, w = ["lea", "leb", "2ed"].includes(m ?? ""), y = w || m === "3ed" && be(t) === "fourth";
  if (y && !l) {
    const B = I2(
      e,
      d,
      c,
      a,
      n,
      w ? 32.5 : 27.5,
      h,
      f
    );
    if (B) return B;
  }
  const p = c.length === 1 ? c[0] : void 0, b = p?.runs.length === 1 ? p.runs[0] : void 0;
  if (!l && m === "4ed" && be(t) === "fourth" && c.some((B) => B.role === "flavor")) {
    const B = Rt(
      e,
      d,
      c,
      { x: 72, y: a + 2, width: 344, height: n - 8 },
      25,
      h,
      5,
      {
        ...g,
        leading: 1.1,
        paragraphGap: 0,
        flavorGap: 0,
        balanceLines: !0
      },
      150
    );
    if (B) return B;
  }
  const S = !l && m === "4ed" && be(t) === "fourth" && d.every((B) => B.align === void 0 || B.align === "center") && p?.role === "rules" && (p.align === void 0 || p.align === "center") && b && !b.italic && !b.text.includes(`
`) && b.text.length > 0 && b.text.length <= 100, k = (y || m === "4ed" && be(t) === "fourth") && (d.length > 1 || d.reduce((B, A) => B + A.runs.reduce((j, E) => j + E.text.length, 0), 0) > 100), v = k && y, R = k && m === "4ed", M = (m === "mir" || m === "tmp") && !o && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") && O(t).join("") === "W", T = Y(
    e,
    S ? d.map((B) => ({ ...B, align: "center" })) : d,
    {
      x: y ? 70 : R || S ? 72 : r,
      y: a + (o ? 1.5 : S ? -6 : R ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: y ? 346 : R || S ? 344 : s + (M ? 10 : 0),
      height: n - 8,
      verticalLimits: f
    },
    o ? 24 : S ? 25 : 22.5,
    h,
    S ? { ...g, leading: 1, balanceLines: !0 } : k ? {
      ...g,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: v ? -10 : 0
    } : g
  ), x = d.reduce(
    (B, A) => B + A.runs.reduce((j, E) => j + E.text.length, 0),
    0
  );
  return !v || x <= 270 || T.size >= 22 ? T : Y(
    e,
    d,
    { x: 70, y: a + 4, width: 346, height: n + 8, verticalLimits: f },
    15.5,
    h,
    {
      ...g,
      leading: 1.25,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: -18
    }
  );
}
function G2(e) {
  return e.setCode?.toLowerCase() === "3ed" && be(e) === "fourth";
}
function E2(e, t, r, a, s) {
  e.save(), e.font = '26px "CardRenderer MTG Goudy", Georgia', zt(e, t, 40, a, s + r - 40, 1), e.restore();
}
function L2(e, t, r) {
  e.save(), e.font = '27.25px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "right", zt(e, t, 451, r + 11, 130, 1.25, "#d4d4d4"), e.restore();
}
function A2(e, t) {
  e.save(), e.font = '22px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", zt(e, `Illus. © ${t}`, 50, 642, 338, 1.25), e.restore();
}
function O2(e) {
  return ["4ed", "5ed"].includes(e.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(e.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function Ns(e) {
  const t = String(e.toughness ?? ""), r = e.wordingMode !== "oracle" && e.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(t) ? `(${t})` : t;
  return `${e.power ?? ""}/${r}`;
}
function D2(e) {
  const t = e.setCode?.toLowerCase(), r = t === "4ed" && !/\bLand\b/.test(e.typeLine ?? "");
  if (t !== "mir" && t !== "tmp" && !r) return null;
  const a = O(e);
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
    setRight: t === "mir" ? 434 : 432.5,
    setCenterY: t === "mir" ? 388 : 387.5,
    setHeight: t === "mir" ? 26 : 23.4,
    setOutline: 1.25,
    artistX: r ? 42.5 : 52,
    artistBaseline: r ? 628.5 : 624,
    artistSize: 19.5,
    legalBaseline: r ? 640.5 : 637.5,
    legalSize: 10.5,
    legalLight: r ? /\bArtifact\b/.test(e.typeLine ?? "") || a.length === 1 && ["B", "G"].includes(a[0]) : !/\bLand\b/.test(e.typeLine ?? "") && !(a.length === 1 && ["W", "R"].includes(a[0])),
    legalText: e.legalText === void 0 ? r ? "©1995 Wizards of the Coast, Inc. All rights reserved." : t === "mir" ? "©1996 Wizards of the Coast, Inc. All rights reserved." : "©1997 Wizards of the Coast, Inc." : e.legalText
  };
}
const Na = (e, t, r, a, s, n) => {
  if (t !== "T") return ee(e, t, r, a, s, n);
  v0(e, r, a, s, "", 0.88);
}, ca = (e, t, r, a, s, n) => {
  if (t !== "T") return k0(e, t, r, a, s, n);
  v0(e, r, a, s, "", 0.8);
}, W2 = (e, t, r, a, s, n) => {
  if (t !== "T") return ee(e, t, r, a, s, n);
  Na(e, t, r, a, s, n);
}, P2 = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function U2(e) {
  const t = e?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(t) || ["lea", "leb", "2ed", "arn", "atq"].includes(t) ? ca : t === "4ed" ? W2 : P2.has(t) ? Na : ee;
}
function v0(e, t, r, a, s, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#c9c4be", e.beginPath(), e.arc(t + a / 2, r + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = `${a * n}px "CardRenderer MTG Historic Symbols"`, e.textAlign = "left", e.textBaseline = "alphabetic";
  const o = e.measureText(s);
  e.fillText(
    s,
    t + (a - o.actualBoundingBoxLeft - o.actualBoundingBoxRight) / 2 + o.actualBoundingBoxLeft,
    r + (a + o.actualBoundingBoxAscent - o.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function F2(e, t, r, a, s, n, o, i = [0, 0, 1, 1], l = null, d = "low") {
  const c = document.createElement("canvas"), h = Math.ceil(o * 2) + 1;
  c.width = Math.ceil(s * 2) + h * 2, c.height = Math.ceil(n * 2) + h * 2;
  const u = c.getContext("2d");
  u.imageSmoothingQuality = d, u.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    h,
    h,
    s * 2,
    n * 2
  ), u.globalCompositeOperation = "source-in", u.fillStyle = "#fff", u.fillRect(0, 0, c.width, c.height), e.save(), e.shadowColor = "transparent";
  for (let m = 0; o > 0 && m < 16; m++) {
    const g = m * Math.PI / 8;
    e.drawImage(
      c,
      r - h / 2 + Math.cos(g) * o,
      a - h / 2 + Math.sin(g) * o,
      c.width / 2,
      c.height / 2
    );
  }
  if (u.fillStyle = "#17140f", l) {
    const m = u.createLinearGradient(h, h, h + s * 2, h);
    l.forEach((g, f) => m.addColorStop(f / 2, g)), u.fillStyle = m;
  }
  u.fillRect(0, 0, c.width, c.height), e.drawImage(c, r - h / 2, a - h / 2, c.width / 2, c.height / 2), e.restore(), c.width = c.height = 0;
}
function _2(e, t, r) {
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", t.artist && (e.fillStyle = "#f2eee3", e.shadowColor = "#000", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = `${r.artistSize}px "CardRenderer MTG MPlantin", Georgia`, e.fillText(`Illus. ${t.artist}`, r.artistX, r.artistBaseline, 338)), e.shadowColor = "transparent", e.fillStyle = r.legalLight ? "#f2eee3" : "#17140f", e.font = `${r.legalSize}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && e.fillText(r.legalText, r.artistX, r.legalBaseline, 380), e.restore();
}
function N2(e, t, r, a, s) {
  const n = va(t), o = D2(t), i = G2(t);
  if (s === "artwork") {
    ye(e, t, r, ke(n.art), s);
    return;
  }
  e.fillStyle = Br(t), e.fillRect(0, 0, 488, 680), e.fillStyle = "#686050", e.fillRect(24.4, 27.2, 439.2, 625.6), e.fillStyle = "#e5dec5", e.fillRect(...ke(n.rules)), e.fillStyle = "#746b58", e.fillRect(...ke(n.art)), a && e.drawImage(a, 0, 0, 488, 680), ye(e, t, r, ke(n.art), s);
  const l = r.get(Ue(t));
  if (l && (e.save(), e.filter = Uo(t), e.drawImage(l, ...ke(n.frame)), g2(e, l, Ue(t)), Ue(t).endsWith("/seventh/regular/m.png") && f2(e, l), e.restore()), pe(t))
    e.save(), e.fillStyle = Br(t), e.beginPath(), e.rect(0, 0, 488, 680), e.rect(24, 29, 440, 623), e.fill("evenodd"), e.strokeStyle = "#30312e", e.lineWidth = 1.5, e.strokeRect(24.5, 29.5, 439, 622), e.restore();
  else if (Me(t) !== "black" || be(t) === "fourth") {
    const D = r.get(Sn(t));
    if (D) {
      const N = document.createElement("canvas");
      N.width = 732, N.height = 1020;
      const q = N.getContext("2d");
      q.drawImage(D, 0, 0, 732, 1020), q.globalCompositeOperation = "source-in", q.fillStyle = Br(t), q.fillRect(0, 0, 732, 1020), e.drawImage(N, ...ke(n.frame)), N.width = N.height = 0;
    }
  }
  e.fillStyle = es(t), e.textBaseline = "middle", e.textAlign = "left", e.letterSpacing = "0px";
  const [d, c, h, u] = ke(n.title), m = t.manaSymbols ?? [], g = l2(t), f = g?.[3] ?? o?.manaSize ?? 23.4, w = g ? g[2] - f : o?.manaGap ?? 1.7, y = m.length * (f + w), p = g ? g[0] + f / 2 - y + w : o ? o.manaRight - y + w : d + h - y, b = ["lea", "2ed"].includes(t.setCode?.toLowerCase() ?? ""), S = i || b ? [
    (i ? 435 : 432) - Math.max(0, m.length - 1) * 27 - (i ? 23.4 : 23.9) / 2,
    (i ? 44.5 : 46) - (i ? 23.4 : 23.9) / 2,
    Math.max(0, m.length - 1) * 27 + (i ? 23.4 : 23.9),
    i ? 23.4 : 23.9
  ] : [
    p,
    g ? g[1] - f / 2 : o?.manaTop ?? c + u / 2 - f / 2,
    Math.max(0, y - w),
    f
  ], k = kr(t), v = So(S, m.length, k), R = tt(v, k);
  e.shadowColor = "#000b", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const M = o?.titleX ?? d, T = c + u / 2 + (o?.titleYOffset ?? 0), x = Math.max(
    1,
    m.length ? p + R[0] - S[0] - M - 5 : o?.titleX == null ? h - 5 : d + h - M - 5
  );
  e.save(), e.translate(...Fa(t, "retro")), pe(t) ? Yr(e, t.name, "title", x) : i ? E2(e, t.name, M, T, x) : e.fillText(t.name, M, T, x), e.restore();
  const B = t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle", A = t.symbolStyle === "original" || t.symbolStyle === void 0 && t.wordingMode === "original", j = A && ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  ft(e, v, k, () => {
    i ? R2(e, m, r, B, k) : ["lea", "2ed"].includes(t.setCode?.toLowerCase() ?? "") ? M2(e, m, r, B, k) : m.forEach(
      (D, N) => (j ? k0 : ee)(
        e,
        D,
        p + N * (f + w) - (m.length - 1 - N) * (k?.spacing ?? 0),
        g ? g[1] - f / 2 : o?.manaTop ?? c + u / 2 - f / 2,
        f,
        r,
        !1,
        k
      )
    );
  });
  const [E, P, W, re] = ke(n.type), ae = kn(t) ?? "", U = r.get(ae), F = w2(t), G = y2(t), Z = U ? Math.min(44 / U.width, (o?.setHeight ?? 23.4) / U.height) : 0, H = F?.width ?? (U?.width ?? 0) * Z, _ = F?.height ?? (U?.height ?? 0) * Z, ze = [
    (F?.right ?? o?.setRight ?? E + W) - H,
    (F?.centerY ?? o?.setCenterY ?? P + re / 2) - _ / 2,
    H,
    _
  ], le = _a(t, ae, ze, "retro"), Ye = tt(le, t.symbolAdjustment?.set), Oe = d2(t);
  e.font = `${Oe.fontSize}px "CardRenderer MTG MPlantin", Georgia`;
  const De = pe(t) ? (D, N, q, oe) => Yr(e, D, "type", oe) : (D, N, q, oe) => e.fillText(D, N, q, oe);
  e.save(), e.translate(Oe.dx, Oe.dy), De(
    ya(t)?.typeLine ?? t.typeLine ?? "",
    o?.typeX ?? E,
    P + re / 2,
    U ? Math.max(
      1,
      Math.min(
        W - 48,
        F ? F.right - F.width - E - 6 : W,
        Ye !== ze ? Ye[0] - (o?.typeX ?? E) - 6 : W
      )
    ) : W
  ), e.restore(), ft(e, le, t.symbolAdjustment?.set, () => {
    if (U) {
      const D = Math.min(44 / U.width, (o?.setHeight ?? 23.4) / U.height), N = F?.width ?? U.width * D, q = F?.height ?? U.height * D, oe = F?.right ?? o?.setRight ?? E + W, Ie = F?.centerY ?? o?.setCenterY ?? P + re / 2, Je = F?.crop ?? [0, 0, 1, 1], rt = Te(ae), $ = !rt && !t.setSymbol && r.get(w0(ae));
      $ && (e.save(), e.shadowColor = "transparent", t.setCode?.toLowerCase() === "arn" && (e.filter = "brightness(0.7)"), e.drawImage(
        $,
        Je[0] * $.width,
        Je[1] * $.height,
        Je[2] * $.width,
        Je[3] * $.height,
        oe - N,
        Ie - q / 2,
        N,
        q
      ), e.restore()), rt || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(U, ...le), e.restore()) : G || o || ln(t.setCode) ? F2(
        e,
        U,
        oe - N,
        Ie - q / 2,
        N,
        q,
        F?.outline ?? (G ? 2 : o?.setOutline ?? ao(t.setCode)),
        Je,
        G,
        F?.sampling
      ) : Ee(
        e,
        U,
        t.setCode,
        t.rarity,
        E + W - U.width * D,
        P + re / 2 - U.height * D / 2,
        U.width * D,
        U.height * D
      );
    }
  }), e.shadowColor = "transparent";
  const [je, He, qe, Xe] = ke(n.rules);
  e.fillStyle = "#17140f";
  const ue = r.get(Ca(t) ?? "");
  if (ue) {
    const D = Math.min(qe * 0.4 / ue.width, Xe * 0.75 / ue.height);
    e.drawImage(
      ue,
      je + (qe - ue.width * D) / 2,
      He + (Xe - ue.height * D) / 2,
      ue.width * D,
      ue.height * D
    );
  } else {
    const D = $2(e, t);
    D && he(
      e,
      D,
      r,
      B ? ee : A ? U2(t.setCode) : t.setCode?.toLowerCase() === "3ed" ? ca : o ? Na : ee,
      t.setCode?.toLowerCase() === "lea" ? 0.012 : 0
    );
  }
  if (!(u2(e, t) || m2(e, t))) {
    if (e.shadowColor = o?.statsOpaqueShadow ? "#000" : "#000b", o && (e.shadowOffsetX = e.shadowOffsetY = o.statsShadow * e.getTransform().a), e.fillStyle = es(t), e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", t.power != null && t.toughness != null) {
      const [D, N, q, oe] = ke(n.stats), Ie = O2(t);
      e.textAlign = Ie ? "right" : "center", i ? L2(e, Ns(t), N + oe / 2) : e.fillText(
        Ns(t),
        Ie?.right ?? D + q / 2,
        N + oe / 2 + (Ie?.yOffset ?? 0),
        Ie?.maxWidth ?? q
      );
    }
    if (pe(t) && t.artist)
      Yr(e, `Illus. © ${t.artist}`, "artist", 390);
    else if (i && t.artist) A2(e, t.artist);
    else if (t.artist && T2(t)) x2(e, t.artist);
    else if (o) _2(e, t, o);
    else if (t.artist) {
      const [D, N, q, oe] = ke(n.footer);
      e.textAlign = "center", e.font = '15.6px "CardRenderer MTG MPlantin", Georgia', e.fillText(`Illus. ${t.artist}`, D + q / 2, N + oe / 2, q);
    }
    e.shadowColor = "transparent";
  }
}
const z2 = (e, t = {}) => fetch(e, { ...t, mode: "cors" });
let zs;
const Y2 = [
  ["CardRenderer MTG Goudy", Do],
  ["CardRenderer MTG Historic Symbols", Oo]
];
function H2() {
  return typeof FontFace != "function" ? Promise.resolve() : zs ??= Promise.all(
    Y2.map(async ([e, t]) => {
      if ([...document.fonts].some(
        (a) => a.family.replace(/^"|"$/g, "") === e && a.status === "loaded"
      ))
        return;
      const r = await z2(t);
      if (!r.ok) throw Error(`Retro font unavailable: ${e}`);
      document.fonts.add(await new FontFace(e, await r.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((e) => {
    throw zs = void 0, e;
  });
}
const q2 = `${mt}/img/class_level_bg.webp`, C0 = (e) => ["adventure", "class", "leveler"].includes(ne(e)), ht = (e, t, r, a) => ({
  x: e / 63.5 * 488,
  y: t / 88.9 * 680,
  width: r / 63.5 * 488,
  height: a / 88.9 * 680
}), X2 = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function J2(e, t, r, a = 21) {
  const s = e.replace(/\{[^}]+\}/g, "●").split(`
`);
  let n = a;
  for (; n > 8 && s.reduce(
    (o, i) => o + Math.max(1, Math.ceil(i.length * n * 0.53 / t)) * n + 4,
    0
  ) > r; )
    n -= 0.5;
  return n;
}
function Cr(e) {
  const t = ne(e), r = [], a = (s, n, o, i = {}) => {
    r.push({ kind: s, text: n, ...o, font: J2(n, o.width, o.height), ...i });
  };
  if (t === "adventure") {
    const s = e.faces?.[1];
    if (!s) return [];
    const n = (s.manaSymbols ?? []).map((i) => `{${i}}`).join(""), o = (s.manaSymbols?.length ?? 0) * 2.5;
    a("heading", s.name, ht(5.6, 55.3, 25 - o, 4.2), {
      color: "white",
      font: Math.min(18, (25 - o) * 488 / 63.5 / Math.max(1, s.name.length * 0.55))
    }), a("rules", n, ht(30 - o, 55.3, o, 4.2), { color: "white", font: 17 }), a("heading", s.typeLine ?? "", ht(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (s.typeLine ?? "").length * 0.52))
    }), a("rules", s.rulesText ?? "", ht(5.6, 64.5, 24.7, 15.6)), a("rules", e.rulesText ?? e.faces?.[0]?.rulesText ?? "", ht(33, 54.9, 25.5, 25));
  } else if (t === "class") {
    const [s, n, o, i] = Ce(e).rules.map(
      (b, S) => b * (S % 2 ? I : C)
    ), l = J(e);
    a(
      "band",
      "",
      { x: s, y: n, width: o, height: i },
      {
        fill: "#e3d8bb",
        asset: fe(
          "saga_textboxes",
          l.boxes === "Colourless" ? "Land" : l.boxes
        )
      }
    );
    const d = [];
    for (const b of (e.rulesText ?? "").split(`
`).filter(Boolean))
      d.length && !/^.*:\s*Level\s+\d+\s*$/i.test(b) && !/^.*:\s*Level\s+\d+\s*$/i.test(d.at(-1)) && !d.at(-1).startsWith("(") ? d[d.length - 1] += `
` + b : d.push(b);
    const c = (b) => /^.*:\s*Level\s+\d+\s*$/i.test(b), h = 28, u = 20, m = (b, S) => b.split(`
`).reduce(
      (k, v) => k + Math.max(1, Math.ceil(v.length * S * 0.53 / (o - 10))),
      0
    ), g = d.map(
      (b) => c(b) ? h : m(b, b.startsWith("(") ? 16 : u) * (b.startsWith("(") ? 16 : u) + 8
    ), f = d.filter((b) => !c(b)).length, w = Math.max(0, i - g.reduce((b, S) => b + S, 0)) / Math.max(1, f), y = Math.min(
      1,
      (i - d.filter(c).length * h) / g.reduce((b, S, k) => b + (c(d[k]) ? 0 : S), 0)
    );
    let p = n;
    d.forEach((b, S) => {
      const k = c(b), v = k ? h : g[S] * y + w;
      if (k) {
        const [R, M] = b.split(/:\s*/);
        a("band", "", { x: s, y: p, width: o, height: v }, { asset: q2 }), a("rules", R + ":", { x: s + 5, y: p, width: o / 2 - 5, height: v }, { font: 18 }), a(
          "heading",
          M,
          { x: s + o / 2, y: p, width: o / 2 - 5, height: v },
          { font: 18, align: "right" }
        );
      } else
        a(
          "rules",
          b,
          { x: s + 5, y: p + 4, width: o - 10, height: v - 8 },
          { font: (b.startsWith("(") ? 16 : u) * y, italic: b.startsWith("(") }
        );
      p += v;
    });
  } else if (t === "leveler") {
    const s = e.rulesText ?? "", n = s.split(/^LEVEL\s+([^\n]+)\n/gm), o = [
      {
        range: "",
        text: n[0] ?? "",
        stats: e.power != null && e.toughness != null ? `${e.power}/${e.toughness}` : ""
      }
    ];
    for (let c = 1; c < n.length; c += 2) {
      const h = n[c + 1] ?? "", u = h.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      o.push({
        range: n[c],
        stats: u?.[1] ?? "",
        text: u ? h.slice(u[0].length) : h
      });
    }
    const i = ht(4.9, 55.6, 53.7, 25.5), l = i.height / o.length, d = X2[J(e).frame] ?? "#dcc8af";
    o.forEach((c, h) => {
      const u = i.y + h * l;
      h && a(
        "band",
        "",
        { x: i.x, y: u, width: i.width, height: l },
        { fill: h % 2 ? "#00000018" : "#00000028" }
      );
      const m = c.range ? 55 : 7, g = c.stats ? 72 : 7;
      a("rules", c.text, {
        x: i.x + m,
        y: u + 4,
        width: i.width - m - g,
        height: l - 8
      }), c.range && a(
        "level",
        `LEVEL
${c.range}`,
        { x: i.x - 12, y: u + l / 2 - 23, width: 65, height: 46 },
        { fill: d, font: 13 }
      ), c.stats && a(
        "stats",
        c.stats,
        { x: i.x + i.width - 68, y: u + l / 2 - 22, width: 77, height: 44 },
        { asset: fe("pt-boxes", J(e).pt), font: 26 }
      );
    });
  }
  return r;
}
function V2(e) {
  return Cr(e).flatMap((t) => [
    t.asset ?? null,
    ...gr(t.text).flatMap((r) => r.symbol ? [gt(r.symbol)] : [])
  ]);
}
function K2(e) {
  if (["adventure", "prepare"].includes(ne(e))) {
    const t = e.faces?.[1];
    return t ? [
      t.name,
      t.typeLine,
      t.colors,
      t.frameColors,
      t.manaSymbols,
      t.rulesText,
      t.rulesParagraphs,
      t.rulesAlignment,
      t.wordingMode,
      t.symbolStyle,
      J(t)
    ] : null;
  }
  return C0(e) ? Cr(e) : null;
}
function Z2(e, t, r) {
  for (const a of Cr(t)) {
    const { x: s, y: n, width: o, height: i, font: l } = a;
    e.save(), e.textAlign = "left", e.fillStyle = a.fill ?? "transparent", a.kind === "level" ? (e.beginPath(), e.moveTo(s, n), e.lineTo(s + o * 0.72, n), e.lineTo(s + o, n + i / 2), e.lineTo(s + o * 0.72, n + i), e.lineTo(s, n + i), e.closePath(), e.fill(), e.strokeStyle = "#0008", e.lineWidth = 1, e.stroke()) : a.fill && e.fillRect(s, n, o, i);
    const d = a.asset ? r.get(a.asset) : null;
    if (d && e.drawImage(d, s, n, o, i), e.beginPath(), e.rect(s, n, o, i), e.clip(), e.fillStyle = a.color ?? "#17140f", ["stats", "level"].includes(a.kind)) {
      e.font = `${l}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
      const c = a.text.split(`
`);
      c.forEach(
        (h, u) => e.fillText(
          h,
          s + o * (a.kind === "level" ? 0.43 : 0.5),
          n + i / 2 + (u - (c.length - 1) / 2) * l,
          o * 0.85
        )
      );
    } else if (a.align === "right")
      e.font = `${l}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "right", e.textBaseline = "middle", e.fillText(a.text, s + o, n + i / 2, o);
    else {
      e.font = `${a.italic ? "italic " : ""}${l}px "CardRenderer MTG MPlantin", Georgia`;
      const c = ba(e, a.text, o, l).length * l + (a.text.split(`
`).length - 1) * z.paragraphGap;
      mn(
        e,
        a.text,
        s,
        n + Math.max(0, (i - c) / 2),
        o,
        { size: l, italic: !!a.italic },
        r
      );
    }
    e.restore();
  }
}
const Q2 = 5, ed = 0.02655 * I + 0.91339 * C * 3810 / 2736;
function za(e) {
  const t = e ? 382 : 429;
  return { top: t, scale: 1 - Q2 / (ed - t) };
}
function td(e) {
  const { top: t, scale: r } = za(e);
  return [t + 6, t + (625 - t) * r - 4];
}
function Ys(e, t, r, a, s, n) {
  const { top: o, scale: i } = za(n), l = t.height * s / t.width, d = Math.max(0, Math.min(l, o - a)), c = d * t.width / s;
  d > 0 && e.drawImage(t, 0, 0, t.width, c, r, a, s, d), d < l && e.drawImage(
    t,
    0,
    c,
    t.width,
    t.height - c,
    r,
    a + d,
    s,
    (l - d) * i
  );
}
function rd(e, t, r) {
  const a = e.rulesParagraphs?.filter((o) => o.role === "rules")[r], s = (e.rulesText ?? "").split(`
`).filter((o) => o.trim())[r];
  if (!a || a.runs.map((o) => o.text).join("") !== s) return [{ text: t }];
  let n = s.length - t.length;
  return a.runs.flatMap((o) => {
    const i = Math.min(n, o.text.length);
    return n -= i, i === o.text.length ? [] : [{ ...o, text: o.text.slice(i) }];
  });
}
function ad(e, t) {
  const r = ne(t) === "planeswalker-large", a = Nt(t), s = !r && a.length < 3, n = Ce(t).rules, o = n[0] * C, i = n[1] * I, l = n[2] * C, d = n[3] * I - (r ? 24 : s ? 4 : 16), c = r ? 8 : s ? 3 : 0, h = r ? { ...dr, leading: 0.9 } : dr, u = a.map((T, x) => ({
    ...T,
    runs: rd(t, T.text, x),
    left: T.badges.length ? 67 : 45
  })), m = (T) => u.map(
    (x) => Y(
      e,
      [{ role: "rules", runs: x.runs }],
      { x: o + x.left, y: 0, width: l - x.left - 8, height: 1e3 },
      T,
      T,
      h
    )
  );
  let g = r ? 17.5 : s ? 24 : 19, f = m(g);
  const [w, y] = td(r), p = () => {
    const T = d / Math.max(1, u.length), x = f.map((j, E) => i + c + T * (E + 0.5) - j.height / 2);
    let B = w - 8;
    for (let j = 0; j < x.length; j++)
      x[j] = Math.max(x[j], B + 8), B = x[j] + f[j].height;
    let A = y + 8;
    for (let j = x.length - 1; j >= 0; j--)
      x[j] = Math.min(x[j], A - 8 - f[j].height), A = x[j];
    return x;
  }, b = () => (p()[0] ?? w) >= w, S = () => f.map((T) => Math.max(34, T.height + 16)), k = () => {
    const T = d / Math.max(1, u.length);
    return f.every((x, B) => {
      const A = T * (B + 0.5);
      return A - x.height / 2 >= 6 && A + x.height / 2 <= d + 6 && (!B || T - (x.height + f[B - 1].height) / 2 >= 8);
    });
  };
  for (; g > 8 && (S().reduce((T, x) => T + x, 0) > d || !k() || !b()); )
    g -= 0.25, f = m(g);
  const v = d / Math.max(1, u.length), R = p();
  let M = c;
  return u.map((T, x) => {
    const B = v, A = f[x].height, j = Y(
      e,
      [{ role: "rules", runs: T.runs }],
      {
        x: o + T.left,
        y: R[x],
        width: l - T.left - 8,
        height: A
      },
      g,
      g,
      h
    );
    j.overflow ||= M + B > c + d + 0.01, j.overflow ||= !k(), j.overflow ||= !b(), j.overflow ||= j.lines.some(
      (P) => P.inkBounds[1] < w - 0.01 || P.inkBounds[1] + P.inkBounds[3] > y + 0.01
    );
    const E = { ...T, top: M, height: B, font: g, width: j.width, layout: j };
    return M += B, E;
  });
}
function R0(e, t) {
  return e === "saga" ? /^(I|II|III|IV)$/.test(t) ? fe("saga", t) : null : fe(
    "planeswalker",
    t.startsWith("+") ? "LoyaltyPlus" : t === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function M0(e, t) {
  return ne(e) === "saga" ? fe("saga_textboxes", t === "Colourless" ? "Land" : t) : null;
}
function sd(e) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[J(e).boxes] ?? "#dededbf0";
}
function nd(e, t) {
  const { top: r, scale: a } = za(ne(t) === "planeswalker-large");
  e.save(), e.translate(0, r), e.scale(1, a), e.translate(0, -r), e.beginPath(), e.moveTo(66, r), e.lineTo(448, r), e.quadraticCurveTo(456, r, 456, r + 8), e.lineTo(456, 613), e.bezierCurveTo(456, 623, 420, 629, 257, 629), e.bezierCurveTo(94, 629, 58, 623, 58, 613), e.lineTo(58, r + 8), e.quadraticCurveTo(58, r, 66, r), e.closePath(), e.clip(), e.fillStyle = sd(t), e.fillRect(58, r, 398, 629 - r), e.restore();
}
function od(e, t, r) {
  e.save(), e.fillStyle = "#17140f", e.font = '24px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "center", e.textBaseline = "alphabetic";
  const a = e.measureText(":");
  e.fillText(
    ":",
    t,
    r + 1.5 + (a.actualBoundingBoxAscent - a.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function id(e, t, r) {
  const a = ne(t), s = a === "saga", n = Ce(t).rules, o = n[0] * C, i = n[1] * I, l = n[2] * C, d = n[3] * I;
  s && (e.fillStyle = "#e3d8bb", e.fillRect(o, i, l, d));
  const c = M0(t, J(t).boxes), h = c ? r.get(c) : void 0;
  h && e.drawImage(h, o, i, l, d);
  const u = s ? hi(t) : ad(e, t);
  for (const [m, g] of u.entries()) {
    if (m > 0) {
      const y = u[m - 1]?.layout, p = g.layout && y ? Math.max(y.top + y.height + 3, Math.min(i + g.top, g.layout.top - 3)) : i + g.top;
      e.fillStyle = "#0002", e.fillRect(o + (s ? 0 : 40), p, l - (s ? 0 : 40), 1.5);
    }
    if (e.fillStyle = "#17140f", e.textAlign = "left", g.layout) he(e, g.layout, r);
    else {
      e.font = `${g.reminder ? "italic " : ""}${g.font}px "CardRenderer MTG MPlantin", Georgia`;
      const y = ba(e, g.text, g.width, g.font).length * g.font;
      mn(
        e,
        g.text,
        o + g.left,
        i + g.top + (g.height - y) / 2,
        g.width,
        { size: g.font, italic: g.reminder },
        r
      );
    }
    const f = s ? 36 : 54, w = s ? 36 : 40;
    g.badges.forEach((y, p) => {
      const b = o + (s ? -18 : 0), S = i + g.top + g.height / 2 + (p - g.badges.length / 2) * w, k = R0(a, y), v = k ? r.get(k) : null;
      if (v) {
        if (e.save(), !s) {
          const R = e.getTransform().a;
          e.shadowColor = "#0009", e.shadowBlur = 3 * R, e.shadowOffsetY = 2 * R;
        }
        e.drawImage(v, b, S, f, w), e.restore();
      } else
        e.fillStyle = "#29231c", e.fillRect(b, S, f, w);
      s ? v || (e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.font = 'bold 19px "CardRenderer MTG Beleren", Georgia', e.fillText(y, b + f / 2, S + w / 2, f - 3)) : (W0(e, y, [b, S, f, w]), od(e, b + f + 4, S + w / 2));
    });
  }
}
const T0 = 0.7;
function ld(e, t, r, a = !1) {
  const [s, n, o, i] = [
    r[0] * C,
    r[1] * I,
    r[2] * C,
    r[3] * I - 1
  ], l = new Path2D();
  l.moveTo(s + 14, n), l.lineTo(s + o - 14, n), l.quadraticCurveTo(s + o, n, s + o, n + 14), l.lineTo(s + o, n + i - 7), l.quadraticCurveTo(s + o, n + i, s + o - 7, n + i), l.lineTo(s + 9, n + i), l.quadraticCurveTo(s - 2, n + i, s - 2, n + i - 9), l.quadraticCurveTo(s - 2, n + 17, s + 2, n + 9), l.quadraticCurveTo(s + 5, n, s + 14, n), l.closePath(), e.save();
  const d = e.getTransform().a;
  e.shadowColor = "#0009", e.shadowBlur = 1.4 * d, e.shadowOffsetX = -1.2 * d, e.shadowOffsetY = 3.5 * d, e.fillStyle = "#191816", e.fill(l), e.shadowColor = "transparent", e.save(), e.clip(l);
  const c = t.width / o, h = [
    20 * c,
    t.height - (i - 4) * c,
    t.width - 40 * c,
    (i - 12) * c,
    s - 2,
    n,
    o + 2,
    i
  ];
  e.drawImage(t, ...h), a && (e.globalAlpha *= T0, e.drawImage(t, ...h)), e.restore(), e.strokeStyle = "#191816", e.lineWidth = 1.2, e.stroke(l), e.restore();
}
function dd(e, t, r) {
  if (!t.pinlines) return;
  const a = (i) => {
    const l = r.get(i);
    if (!l) throw Error(`Planar pinline asset unavailable: ${i}`);
    return l;
  }, s = () => {
    const i = document.createElement("canvas");
    i.width = 732, i.height = 1020;
    const l = i.getContext("2d");
    if (!l) throw Error("Missing Planar pinline composition context");
    return { canvas: i, context: l };
  }, n = s(), o = s();
  try {
    n.context.drawImage(a(t.pinlines.left), 0, 0, 732, 1020), o.context.drawImage(a(t.pinlines.right), 0, 0, 732, 1020), o.context.globalCompositeOperation = "destination-in";
    const i = o.context.createLinearGradient(732 * 0.47, 0, 732 * 0.53, 0);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), o.context.fillStyle = i, o.context.fillRect(0, 0, 732, 1020), n.context.drawImage(o.canvas, 0, 0), n.context.globalCompositeOperation = "destination-in", n.context.drawImage(a(t.pinlines.mask), 0, 0, 732, 1020), Nn(e, n.canvas);
  } finally {
    n.canvas.width = n.canvas.height = 0, o.canvas.width = o.canvas.height = 0;
  }
}
function Hs(e, t, r) {
  if (!Le(e, t)) return { dx: 0, dy: 0, size: 1 };
  const a = e.frameTreatment === "colorshifted";
  return r === "title" ? a ? { dx: 0.25, dy: 0.75, size: 1.04 } : { dx: 1, dy: 0.75, size: 1.035 } : a ? { dx: -0.75, dy: -1.25, size: 1.03 } : { dx: 0.5, dy: 0, size: 1.025 };
}
const cd = 1.1;
function x0(e) {
  return !e.setSymbol && ["m19", "m20", "m21"].includes(e.setCode?.toLowerCase() ?? "");
}
function I0(e, t, r, a, s, n, o, i, l = 1) {
  const d = !r || r === "common", c = document.createElement("canvas"), h = 2, u = 4;
  c.width = Math.ceil((n + h * 2) * u), c.height = Math.ceil((o + h * 2) * u);
  const m = c.getContext("2d");
  m.scale(u, u), m.translate(h, h), m.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    0,
    0,
    n,
    o
  ), m.globalCompositeOperation = "source-in";
  const g = r === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : r === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], f = m.createLinearGradient(0, o * 0.65, n, o * 0.35);
  f.addColorStop(0, g[0]), f.addColorStop(0.35, g[1]), f.addColorStop(0.6, g[2]), f.addColorStop(1, g[3]), m.fillStyle = d ? "#111111" : f, m.fillRect(0, 0, n, o), m.beginPath(), m.moveTo(n * 0.046, 0), m.lineTo(n * 0.953, 0), m.bezierCurveTo(
    n * 1.016,
    o * 0.38,
    n * 1.016,
    o * 0.62,
    n * 0.953,
    o
  ), m.lineTo(n * 0.046, o), m.bezierCurveTo(-n * 0.017, o * 0.62, -n * 0.017, o * 0.38, n * 0.046, 0), m.closePath(), m.globalCompositeOperation = "destination-over", m.fillStyle = d ? "#f8f8f5" : "#111111", m.fill(), m.globalCompositeOperation = "source-over", m.strokeStyle = d ? "#f8f8f5" : "#111111", m.lineWidth = l, m.stroke(), e.drawImage(
    c,
    a - h,
    s - h,
    c.width / u,
    c.height / u
  ), c.width = c.height = 0;
}
const jt = (e) => [
  e[0] * C,
  e[1] * I,
  e[2] * C,
  e[3] * I
];
function hd(e, t, r, a, s) {
  const n = Ae(t);
  if (!n) throw Error("Missing replacement frame family.");
  const o = (G) => {
    const Z = r.get(G);
    if (!Z) throw Error(`Replacement frame asset unavailable: ${G}`);
    return Z;
  }, { rects: i } = n, l = t.frameAssetFamily === "eighth";
  if (e.save(), e.fillStyle = Re(t.setCode, t.borderColor).border, e.fillRect(0, 0, C, I), a && e.drawImage(a, 0, 0, C, I), ye(e, t, r, jt(i.art), s), s === "artwork") {
    e.restore();
    return;
  }
  if (Aa(t, n.frame) ? di(e, o(n.frame)) : Le(t, n.frame) ? Nn(e, o(n.frame)) : e.drawImage(o(n.frame), 0, 0, C, I), dd(e, n, r), n.rightFrame) {
    const G = document.createElement("canvas");
    G.width = 732, G.height = 1020;
    const Z = G.getContext("2d");
    Z.drawImage(o(n.rightFrame), 0, 0, G.width, G.height);
    const H = document.createElement("canvas");
    H.width = G.width, H.height = G.height;
    const _ = H.getContext("2d"), ze = (D, N) => {
      const q = _.createLinearGradient(H.width * D, 0, H.width * N, 0);
      return q.addColorStop(0, "#0000"), q.addColorStop(1, "#000"), q;
    };
    _.fillStyle = ze(0.47, 0.53), _.fillRect(0, 0, H.width, H.height);
    const le = l ? [0.08, 0.627, 0.84, 0.29] : [0.071, 0.629, 0.858, 0.294], [Ye, Oe, De, je] = le, He = Ye * H.width, qe = Oe * H.height, Xe = De * H.width, ue = je * H.height;
    _.clearRect(He, qe, Xe, ue), _.fillStyle = ze(0.27, 0.73), _.fillRect(He, qe, Xe, ue), Z.globalCompositeOperation = "destination-in", Z.drawImage(H, 0, 0), e.drawImage(G, 0, 0, C, I), G.width = G.height = 0, H.width = H.height = 0;
  }
  const d = Re(t.setCode, t.borderColor);
  if (d.border !== "#090806") {
    const G = document.createElement("canvas");
    G.width = 732, G.height = 1020;
    const Z = G.getContext("2d");
    Z.drawImage(o(n.border), 0, 0, G.width, G.height), Z.globalCompositeOperation = "source-in", Z.fillStyle = d.border, Z.fillRect(0, 0, G.width, G.height), e.drawImage(G, 0, 0, C, I), G.width = G.height = 0;
  }
  Jn(e, t, r), e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const c = kr(t), h = l ? "CardRenderer MTG Matrix" : "CardRenderer MTG Beleren", [u, m, g, f] = jt(i.title), w = t.manaSymbols ?? [], { size: y } = n.mana, p = n.mana.gap + (c?.spacing ?? 0), b = n.mana.right * C, S = w.length * y + Math.max(0, w.length - 1) * p, k = [
    b - S,
    n.mana.center * I - y / 2,
    S,
    y
  ], v = tt(k, c);
  e.font = `bold ${n.titleSize}px "${h}", Georgia`, e.save(), l && e.translate(...Fa(t, "eighth"));
  const R = Hs(t, n.frame, "title");
  e.translate(R.dx, R.dy), Xs(e, t), te(
    e,
    t.name,
    u,
    m + f / 2,
    w.length ? v[0] - u - 8 : g,
    n.titleSize * R.size,
    !0,
    1,
    h
  ), e.restore(), ft(e, k, c, () => {
    w.forEach(
      (G, Z) => ee(
        e,
        G,
        b - S + Z * (y + p),
        n.mana.center * I - y / 2,
        y,
        r,
        !0,
        c
      )
    );
  });
  const M = Q(t), T = r.get(M ?? ""), x = Ne(t), B = T ? Math.min(
    n.symbol.width * C / (T.width * x[2]),
    n.symbol.height * I / (T.height * x[3])
  ) : 0, A = T ? T.width * x[2] * B : 0, j = T ? T.height * x[3] * B : 0, E = Li(t, n.frame, M) ?? t2(t, M, [
    n.symbol.right * C - A,
    n.symbol.center * I - j / 2,
    A,
    j
  ]), P = tt(E, t.symbolAdjustment?.set), [W, re, ae, U] = jt(i.type);
  e.save();
  const F = Hs(t, n.frame, "type");
  if (e.translate(F.dx, F.dy), Xs(e, t), e.font = `bold ${n.typeSize}px "${h}", Georgia`, te(
    e,
    t.typeLine ?? "",
    W,
    re + U / 2,
    T ? P[0] - W - 7 : ae,
    n.typeSize * F.size,
    !0,
    1,
    h
  ), e.restore(), ft(e, E, t.symbolAdjustment?.set, () => {
    if (T) {
      const G = p0(t);
      Te(M) || t.setSymbol ? e.drawImage(T, ...E) : x0(t) ? I0(e, T, t.rarity, ...E, x, 1.5) : G ? b0(e, T, G, t.rarity, ...E, x, !1) : Ee(e, T, t.setCode, t.rarity, ...E, x);
    }
  }), on(e, t, r) || he(e, Vn(e, t), r), t.power != null && t.toughness != null && e.drawImage(o(n.pt), ...jt(i.stats)), l) {
    ii(e, t, r, n.frame), e.restore();
    return;
  }
  if (t.power != null && t.toughness != null) {
    const [G, Z, H, _] = jt(i.stats);
    e.font = `bold 25px "${h}", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(`${t.power}/${t.toughness}`, G + H * 0.52, Z + _ * 0.52, H * 0.85);
  }
  qr(e, t), e.restore();
}
let qs = null;
function ud(e) {
  if (e.frameAssetFamily !== "eighth") return Promise.resolve();
  const t = qs ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 29px "CardRenderer MTG Matrix Small Caps"')
  ]).then((r) => {
    if (r.some((a) => !a.length || a.some((s) => s.status !== "loaded")))
      throw Error("Replacement Eighth Edition frames need card-glint/magic/fonts.css.");
  }).catch((r) => {
    throw qs = null, r;
  });
  return Promise.all([t, ni(e, Ae(e)?.frame ?? "")]).then(
    () => {
    }
  );
}
function Xs(e, t) {
  t.frameTreatment === "colorshifted" && (e.fillStyle = "#fff", e.shadowColor = "#000", e.shadowOffsetX = -21e-4 * C, e.shadowOffsetY = 15e-4 * I, e.shadowBlur = 0);
}
function md(e, t, [r, a, s, n]) {
  const o = t.height * s / t.width;
  e.save(), e.beginPath(), e.rect(r, a, s, n / 2), e.clip(), e.drawImage(t, r, a + n - o + 1, s, o), e.restore();
}
function gd(e, [t, r, a, s], n) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(n)) return;
  e.save(), e.shadowColor = "transparent";
  const o = e.createLinearGradient(t, 0, t + a, 0);
  o.addColorStop(0, "rgba(255,255,255,0)"), o.addColorStop(0.025, "rgba(255,255,255,0.2)"), o.addColorStop(0.975, "rgba(255,255,255,0.2)"), o.addColorStop(1, "rgba(255,255,255,0)"), e.fillStyle = o, e.fillRect(t, r + s - 4, a, 2.3), e.restore();
}
const fd = "symbol-svg-v5", pd = { "leg-c": { sha256: "289e33fd164ee77b5b5d5982b299f485ca668c576368ec796be3b8260de592fd", recipe: "remove-outer-white" }, "6ed-u": { sha256: "631daa24b47c80669e3b27044d9213faa69e9207940a5a7283d67ab7db54e65b", recipe: "white-outer-rim" }, "6ed-r": { sha256: "a6175526471668969615caecff1070f8d9d119ff69b03fc6c03af1ad5fc0f198", recipe: "white-outer-rim" }, "m15-u": { sha256: "bfd962ff9640a846e5690d76c0fe88324e9d49cb6771744b5ab8f34f7afe7362", recipe: "m15" }, "m15-r": { sha256: "933756b97cebe7389ff7cee219a34b1ac13bc504743a2be037a286ee5ffc4b0d", recipe: "m15" }, "m15-m": { sha256: "6e9f87473f1ed8ecb05647fbde6f13e22faeab18fe56b8f76cfa1759bb4210e7", recipe: "m15" }, "8ed-u": { sha256: "6c20e8da28fdd5cdb030814e5c1339978f276c77f4ad9d99ca816adb8d970880", recipe: "8ed" }, "8ed-r": { sha256: "eccde74c56b4810434ecdf4e99206046d6970ea601e4fed2f73eb2ee855053a2", recipe: "8ed" }, "9ed-u": { sha256: "acb7ea7f3422f50dca2aef4e07aa3977aa1641ff2cb54f6eb64ae1bc17abbf53", recipe: "9ed" }, "9ed-r": { sha256: "c1cbcc1aea4f032c5f2ccf7f1d63073813bf9c6f050ba2f5385170ff3deca8a5", recipe: "9ed" }, "7ed-u": { sha256: "94c67d433ba3012f3aa1c494a7ef0ae1e7de58ce4614dfd50ee8f52de527d7e4", recipe: "white-outer-rim" }, "7ed-r": { sha256: "8b30917e85b2c9c3549bfa6c2f62261801df33ff7debcc138bf89c4a9ba9689f", recipe: "white-outer-rim" } }, B0 = {
  revision: fd,
  sources: pd
}, Js = `${L}/img/setSymbols/official/`, Vs = B0.sources;
function j0(e) {
  if (!e.startsWith(Js) || !e.endsWith(".svg")) return;
  const t = e.slice(Js.length, -4);
  return Object.hasOwn(Vs, t) ? Vs[t] : void 0;
}
function bd(e) {
  return !!j0(e);
}
async function wd(e, t) {
  const r = j0(e);
  if (!r) return t;
  const a = await t.arrayBuffer();
  if ([...new Uint8Array(await crypto.subtle.digest("SHA-256", a))].map((h) => h.toString(16).padStart(2, "0")).join("") !== r.sha256) throw Error(`Unexpected pinned symbol checksum: ${e}`);
  const o = new DOMParser().parseFromString(new TextDecoder().decode(a), "image/svg+xml"), i = o.documentElement, l = [...i.querySelectorAll("path")], d = i.querySelector("linearGradient, radialGradient");
  if (i.localName !== "svg" || o.querySelector("parsererror") || !d && r.recipe !== "remove-outer-white")
    throw Error(`Unexpected pinned symbol SVG: ${e}`);
  const c = (h, u) => {
    for (const [m, g] of Object.entries(u)) h.setAttribute(m, g);
  };
  if (r.recipe === "remove-outer-white") {
    if (l.length !== 7 || !/fill:\s*#ffffff\b/i.test(l[0].getAttribute("style") ?? ""))
      throw Error("Unexpected monochrome symbol topology.");
    l[0].remove();
  } else if (r.recipe === "white-outer-rim") {
    if (l.length !== 3) throw Error("Unexpected rimmed symbol topology.");
    l[0].setAttribute("fill", "#fff");
  } else if (r.recipe === "m15") {
    if (l.length !== 6) throw Error("Unexpected M15 path topology.");
    c(l[0], { fill: `url(#${d.id})`, stroke: "#000", "stroke-width": "8" });
    for (const h of l.slice(1)) h.setAttribute("fill", "#000");
  } else if (r.recipe === "8ed" || r.recipe === "9ed") {
    if (l.length !== 4) throw Error("Unexpected numeric shield path topology.");
    const h = l[2], u = h.parentElement?.getAttribute("transform");
    if (!u) throw Error("Missing numeric shield coordinate transform.");
    if (l[0].setAttribute("fill", "#000"), l[3].setAttribute("fill", "#000"), r.recipe === "9ed") {
      const m = d.cloneNode(!0);
      c(m, {
        id: "glint-root-metal",
        gradientTransform: `${u} ${d.getAttribute("gradientTransform") ?? ""}`
      }), d.after(m), c(l[3], {
        stroke: "url(#glint-root-metal)",
        "stroke-width": "12",
        "paint-order": "stroke fill"
      });
    }
  } else throw Error(`Unknown symbol SVG patch recipe: ${r.recipe}`);
  return i.setAttribute("data-card-glint-patch", B0.revision), new Blob([new XMLSerializer().serializeToString(o)], { type: "image/svg+xml" });
}
const We = /* @__PURE__ */ new Map();
function $0(e) {
  if (!(!e.retired || e.users)) {
    if (!e.sources) {
      e.controller.abort();
      return;
    }
    URL.revokeObjectURL(e.sources.original), e.sources.backing && URL.revokeObjectURL(e.sources.backing), e.sources = void 0;
  }
}
function Nd() {
  for (const e of We.values())
    e.retired = !0, $0(e);
  We.clear();
}
async function yd(e, t) {
  t.throwIfAborted();
  let r = We.get(e);
  if (!r) {
    const l = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const d = await fetch(e, { mode: "cors", signal: l.controller.signal });
        if (!d.ok) throw Error(`Symbol source ${d.status}: ${e}`);
        const c = await wd(e, await d.blob()), h = await k2(e, c);
        l.controller.signal.throwIfAborted();
        const u = URL.createObjectURL(c);
        try {
          const m = { original: u, backing: h ? URL.createObjectURL(h) : void 0 };
          return l.sources = m, m;
        } catch (m) {
          throw URL.revokeObjectURL(u), m;
        }
      })
    };
    l.promise = l.promise.catch((d) => {
      throw We.get(e) === l && We.delete(e), d;
    }), We.set(e, l), r = l;
  }
  r.users++;
  const a = r;
  let s = !1;
  const n = () => {
    s || (s = !0, a.users--, !a.users && !a.sources && (a.retired = !0, We.get(e) === a && We.delete(e)), $0(a));
  };
  let o = () => {
  };
  const i = new Promise((l, d) => {
    o = () => {
      n(), d(t.reason);
    }, t.addEventListener("abort", o, { once: !0 });
  });
  try {
    const l = await Promise.race([a.promise, i]);
    return t.throwIfAborted(), { sources: l, release: n };
  } catch (l) {
    throw n(), l;
  } finally {
    t.removeEventListener("abort", o);
  }
}
async function Sd(e, t) {
  t.throwIfAborted();
  const r = [...new Set(e.filter((l) => !!l))], a = [], s = /* @__PURE__ */ new Map(), n = () => {
    for (const l of a) l.release();
    a.length = 0;
  }, i = (await Promise.allSettled(
    r.map(async (l) => {
      if (!S2(l) && !bd(l)) {
        s.set(l, l);
        return;
      }
      const d = await yd(l, t);
      a.push(d), s.set(l, d.sources.original), d.sources.backing && s.set(w0(l), d.sources.backing);
    })
  )).find((l) => l.status === "rejected");
  if (i?.status === "rejected")
    throw n(), i.reason;
  return t.aborted && (n(), t.throwIfAborted()), { urls: [...new Set(s.values())], aliases: s, dispose: n };
}
function kd(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const [a, s] of e) {
    const n = t.get(s);
    n && r.set(a, n);
  }
  return r;
}
async function vd(e, t) {
  return t.throwIfAborted(), fetch(e, { signal: t, mode: "cors" });
}
function Cd(e) {
  if (e.startsWith(`${L}/img/frames/m15/holoStamps/`) || e.startsWith(`${L}/img/frames/planeswalker/holo/`) || e.startsWith(L) && /\/saga\/(sagaChapter|sagaDivider|sagaMidStripe|stamp)\.png$/.test(e))
    return;
  if (e.startsWith(`${L}/data/images/cardImages/saga/`)) return 768;
  if (e.startsWith(`${L}/img/frames/future/regular/futurePT`)) return;
  if (e.startsWith(`${L}/img/frames/`) && e.endsWith(".png"))
    return /\/pt\/|\/m15PT/.test(e) ? 256 : 768;
  if (e.startsWith(`${bt}/img/frames/`) && e.endsWith(".png")) return 768;
  const t = e.startsWith(`${mt}/img/`) ? e.slice(`${mt}/img/`.length) : "";
  return t === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    t
  ) ? 768 : void 0;
}
async function Rd(e) {
  if (!e.type.includes("svg")) return e;
  const t = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), r = t.documentElement;
  if (r.localName !== "svg" || t.querySelector("parsererror"))
    throw new Error("Invalid SVG asset.");
  const a = (r.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), s = a[2] ?? parseFloat(r.getAttribute("width") ?? ""), n = a[3] ?? parseFloat(r.getAttribute("height") ?? "");
  if (!(s > 0 && n > 0 && Number.isFinite(s + n)))
    throw new Error("SVG asset needs a finite viewport.");
  const o = 512 / Math.max(s, n);
  return r.hasAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${s} ${n}`), r.setAttribute("width", String(Math.max(1, Math.round(s * o)))), r.setAttribute("height", String(Math.max(1, Math.round(n * o)))), new Blob([new XMLSerializer().serializeToString(r)], { type: "image/svg+xml" });
}
async function Md(e, t, r) {
  if (t.throwIfAborted(), !e.type.includes("svg"))
    return r ? createImageBitmap(e, { resizeWidth: r, resizeQuality: "high" }) : createImageBitmap(e);
  const a = URL.createObjectURL(await Rd(e)), s = new Image(), n = document.createElement("canvas"), o = () => {
    s.src = "";
  };
  t.addEventListener("abort", o, { once: !0 });
  try {
    t.throwIfAborted(), s.src = a, await s.decode(), t.throwIfAborted(), n.width = s.naturalWidth, n.height = s.naturalHeight;
    const i = n.getContext("2d", { willReadFrequently: !0 });
    if (!i || !n.width || !n.height)
      throw new Error("SVG asset could not be rasterized.");
    return i.drawImage(s, 0, 0), await createImageBitmap(n);
  } finally {
    t.removeEventListener("abort", o), s.src = "", URL.revokeObjectURL(a), n.width = 0, n.height = 0;
  }
}
async function G0(e, t) {
  const r = await Sd(e, t), a = r.urls, s = /* @__PURE__ */ new Map();
  let n = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, a.length) }, async () => {
        for (; n < a.length && !t.aborted; ) {
          const i = a[n++];
          try {
            const l = await vd(i, t);
            if (!l.ok) continue;
            const d = await l.blob(), c = await Md(d, t, Cd(i));
            t.aborted ? c.close() : s.set(i, c);
          } catch {
          }
        }
      })
    );
  } finally {
    r.dispose();
  }
  const o = kd(r.aliases, s);
  return {
    images: o,
    dispose: () => {
      for (const i of s.values()) i.close();
      s.clear(), o.clear();
    }
  };
}
function E0(e) {
  if (e.frameTemplate)
    return [
      ...Mo(e),
      e.illustration,
      Q(e),
      ...Se(
        e.frameTemplate === "future" ? { ...e, manaSymbols: e.manaSymbols?.filter((o) => !br(o)) } : e
      ),
      ...(e.faces ?? []).flatMap(Se)
    ];
  if ($a(e))
    return [
      ..._n(e),
      e.illustration,
      Q(e),
      ...Se(e),
      ...Se(Ct(e))
    ];
  if (yr(e))
    return [
      ...Fn(e),
      e.illustration,
      Q(e),
      ...Se(e),
      ...Se(e.faces[1])
    ];
  if (Ft(e))
    return [
      ...Xo(e),
      ...ve(e).flatMap((o) => [
        o.face.illustration,
        ...Se(o.face)
      ]),
      Q(ve(e)[0].face)
    ];
  const t = Ge(e);
  if (t)
    return [
      ...ve(e).flatMap((o, i) => [
        ...hl(o.face, t, wt(e) && t === "eighth", i),
        o.face.illustration,
        Q(o.face),
        ...Se(o.face)
      ]),
      ...t === "eighth" && wt(e) ? wl(e) : []
    ];
  const r = ci(e);
  if (r)
    return [
      ...r,
      et(e)?.image,
      et(e)?.rightImage,
      e.illustration,
      Q(e),
      ...Se(e)
    ];
  if (de(e)) return _o(e);
  if (ne(e) === "saga")
    return [...ei(e), e.illustration, Q(e), ...Se(e)];
  const a = ve(e);
  if (a.length) return a.flatMap((o) => E0(o.face));
  const s = J(e), n = pr(s, ne(e));
  return [
    et(e)?.image,
    et(e)?.rightImage,
    ne(e) === "normal" ? fr(e) : null,
    ...V2(e),
    n.background,
    n.frame,
    n.boxes,
    n.pt,
    M0(e, s.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(ne(e)) ? Nt(e).flatMap(
      (o) => o.badges.map((i) => R0(ne(e), i))
    ) : [],
    s.legendary ? n.crown : null,
    e.illustration,
    Q(e),
    ...Se(e)
  ];
}
let Ks = null;
function Zs() {
  return Ks ??= Promise.all([
    document.fonts.load('24px "CardRenderer MTG Beleren"'),
    document.fonts.load('700 24px "CardRenderer MTG Beleren"'),
    document.fonts.load('700 11px "CardRenderer MTG Beleren Small Caps"'),
    document.fonts.load('24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('italic 24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('14px "CardRenderer MTG Relay"'),
    document.fonts.load('14px "CardRenderer MTG Artist Credit"')
  ]).then((e) => {
    if (e.some((t) => !t.length || t.some((r) => r.status !== "loaded")))
      throw Error(
        "Magic fonts are unavailable. Load card-glint/magic/fonts.css before preparing cards."
      );
  }).catch((e) => {
    throw Ks = null, e;
  });
}
function rr(e) {
  return Ce(e).art;
}
const Qs = /* @__PURE__ */ new WeakMap(), ar = ([e, t, r, a]) => [e, 1 - t - a, e + r, 1 - t], Td = [ar(Ce({}).art), [0, 0, 0, 0]];
function zd(e) {
  if (!e) return Td;
  const t = Qs.get(e);
  if (t) return t;
  const r = ve(e), a = r.length ? [
    ar(ws(r[0], rr(r[0].face))),
    ar(ws(r[1], rr(r[1].face)))
  ] : [ar(rr(e)), [0, 0, 0, 0]];
  return Qs.set(e, a), a;
}
async function xd(e, t, r, a, s, n, o = G0, i) {
  return L0(e, t, r, a, {
    threshold: s,
    resolveEtching: i,
    beforePaint: n,
    loadImages: o,
    height: I
  });
}
async function L0(e, t, r, a, s) {
  const { threshold: n, beforePaint: o, loadImages: i, height: l } = s, d = ve(t);
  if (d.length) {
    for (const S of d)
      e.save(), o0(e, S), await L0(e, S.face, r, a, {
        ...s,
        height: S.height * C / S.width
      }), e.restore();
    return;
  }
  if (t.illustration && s.resolveEtching) {
    let S;
    try {
      const k = await s.resolveEtching(t, r, a, n, o);
      S = await i([k, t.illustration], a);
      const v = S.images.get(k ?? "");
      if (v && !a.aborted) {
        await o?.(), a.throwIfAborted();
        const [R, M, T, x] = Ce(t).art, B = R * C, A = M * l, j = T * C, E = x * l, P = S.images.get(t.illustration) ?? v;
        e.save(), e.beginPath();
        const W = rr(t);
        e.rect(
          W[0] * C,
          W[1] * l,
          W[2] * C,
          W[3] * l
        ), e.clip(), e.imageSmoothingQuality = "low";
        const re = qn(t, [B, A, j, E], C, l);
        if (t.illustrationCrop) {
          const ae = t.illustrationCrop, U = lr(P.width * ae[2], P.height * ae[3], re);
          e.drawImage(
            v,
            ae[0] * v.width,
            ae[1] * v.height,
            ae[2] * v.width,
            ae[3] * v.height,
            ...U
          );
        } else e.drawImage(v, ...lr(P.width, P.height, re));
        e.restore();
      }
    } catch {
    } finally {
      S?.dispose();
    }
  }
  if (a.throwIfAborted(), !t.setCode) return;
  const [c, h, u, m] = Ce(t).stamp, g = c * C, f = h * l, w = u * C, y = m * l, p = Q(t, "common"), b = await i([p], a);
  try {
    await o?.(), a.throwIfAborted();
    const S = p ? b.images.get(p) : null;
    if (e.save(), e.globalAlpha = 0.68, S) {
      const k = Math.min(w / S.width, y / S.height);
      e.drawImage(
        S,
        g + (w - S.width * k) / 2,
        f + (y - S.height * k) / 2,
        S.width * k,
        S.height * k
      );
    } else
      e.translate(g, f), e.scale(w / 100, y / 100), e.fillStyle = "white", e.fill(new Path2D(F0)), e.font = "bold 43px Georgia", e.textAlign = "center", e.textBaseline = "alphabetic", e.fillText(z0(t.setCode), 50, 65);
    e.restore();
  } finally {
    b.dispose();
  }
}
function Id(e) {
  return e.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const Bd = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, en = /* @__PURE__ */ new WeakMap();
function jd(e, t) {
  let r = en.get(t);
  if (r || (r = new Path2D(t.path), en.set(t, r)), e.save(), t.viewBox) {
    const [a, s, n, o] = t.viewBox;
    e.scale(24 / n, 24 / o), e.translate(-a, -s);
  }
  t.transform && e.transform(...t.transform), t.filled ? (e.fillStyle = e.strokeStyle, e.fill(r)) : e.stroke(r), e.restore();
}
function tn(e, t, r, a, s = !1) {
  const n = C * 0.105, o = C * 0.015, i = Math.floor(C * 0.9 / (n + o));
  if (t.forEach((m, g) => {
    e.save(), e.translate(
      C * 0.05 + g % i * (n + o),
      I * 0.13 + Math.floor(g / i) * (n + o)
    ), e.fillStyle = "#17201fed", e.strokeStyle = "#c6af7977", e.lineWidth = 1, e.beginPath(), e.arc(n / 2, n / 2, n / 2, 0, Math.PI * 2), e.fill(), e.stroke(), e.translate(n * 0.14, n * 0.14), e.scale(n * 0.72 / 24, n * 0.72 / 24), e.strokeStyle = "#f3e9cf", e.lineWidth = 1.8, e.lineCap = "round", e.lineJoin = "round", jd(e, m), e.restore();
  }), r?.power == null || r.toughness == null) return;
  e.save();
  const l = Bd[s ? "inspect" : "table"], d = C * l.width, c = I * l.height, h = C * (1 - l.right - l.width), u = I * (1 - l.bottom - l.height);
  a ? e.drawImage(a, h, u, d, c) : (e.fillStyle = "#eee5cf", e.strokeStyle = "#746854", e.lineWidth = 2, e.beginPath(), e.roundRect(
    h + d * (s ? 0.14 : 0.1),
    u + c * (s ? 0.19 : 0.18),
    d * (s ? 0.72 : 0.8),
    c * (s ? 0.62 : 0.64),
    c * 0.12
  ), e.fill(), e.stroke()), e.font = `bold ${C * (s ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
    `${r.power}/${r.toughness}`,
    h + d / 2,
    s ? u + c / 2 - C * 0.01 : u + c * 0.48,
    d * 0.72
  ), e.restore();
}
function Yd(e) {
  return e.currentStats?.power != null && e.currentStats.toughness != null && e.statusLayout !== "inspect" ? { ...e, statusLayout: "inspect" } : e;
}
function Hd(e, t) {
  if (e.custom)
    return JSON.stringify([
      "custom-face-v1",
      e.custom.key,
      t,
      e.layer ?? "face",
      e.layer === "etching" ? e.etchThreshold ?? 20 : null
    ]);
  const r = e.face, a = ha(r, e.layer === "etching"), s = e.currentStats?.power != null && e.currentStats.toughness != null ? [e.currentStats.power, e.currentStats.toughness] : null;
  return JSON.stringify([
    mt,
    L,
    "canvas-face-v123",
    e.paintLayer ?? null,
    t,
    e.printingId,
    e.layer === "etching" ? null : e.printedImage,
    a,
    e.layer ?? "face",
    e.layer === "etching" ? e.etchThreshold ?? 14 : null,
    e.layer === "etching" ? null : [
      (e.emblems ?? []).map((n) => [
        n.path,
        n.viewBox ?? null,
        n.transform ?? null,
        !!n.filled
      ]),
      s,
      s ? e.statusLayout ?? t : null
    ]
  ]);
}
function ha(e, t) {
  const r = ve(e);
  return r.length ? [
    e.layout,
    e.artist ?? null,
    e.collectorNumber ?? null,
    e.legalText ?? null,
    e.borderColor ?? null,
    r.map((a) => [a.x, a.y, a.width, a.height, a.rotation, ha(a.face, t)]),
    !t && Pa(e),
    !t && jn(e),
    ...!t && e.printingOmissions?.length ? [e.printingOmissions] : [],
    ...!t && e.blackBorderLift ? [["border-ink", e.blackBorderLift]] : []
  ] : t ? [
    e.illustration ?? null,
    e.etchedIllustration ?? null,
    e.illustrationCrop ?? null,
    e.illustrationPlacement ?? null,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    Ce(e)
  ] : [
    de(e) ? [Ue(e), Me(e)] : null,
    e.borderColor ?? null,
    e.frameAssetFamily ?? null,
    e.frameTreatment ?? null,
    e.frameTemplate ?? null,
    e.futureTreatment ?? null,
    e.defense ?? null,
    e.frameTemplate ? e.faces?.map((a) => ha(a, t)) : null,
    e.name,
    e.manaSymbols ?? [],
    e.symbolAdjustment ?? null,
    e.typeLine ?? "",
    e.rulesText ?? "",
    e.rulesParagraphs ?? null,
    e.wordingMode ?? null,
    e.symbolStyle ?? null,
    e.colorCalibration ?? null,
    e.rulesAlignment ?? null,
    e.illustration ?? null,
    e.illustrationCrop ?? null,
    e.illustrationPlacement ?? null,
    K2(e),
    e.artist ?? null,
    e.watermark ?? null,
    e.collectorNumber ?? null,
    e.collectorFormat ?? null,
    e.legalText === void 0 ? ["default"] : e.legalText,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    e.rarity ?? "common",
    e.securityStamp ?? "default",
    e.power ?? null,
    e.toughness ?? null,
    e.loyalty ?? null,
    e.reverseStats ?? null,
    e.layout ?? null,
    Ce(e),
    J(e),
    ...e.printingOmissions?.length ? [e.printingOmissions] : [],
    ...e.blackBorderLift ? [["border-ink", e.blackBorderLift]] : []
  ];
}
function $d(e) {
  const t = document.createElement("canvas");
  return t.width = e === "table" ? 244 : 732, t.height = e === "table" ? 340 : 1020, t;
}
async function qd(e, t, r, a) {
  if (wo(e.face), e.custom)
    return await a?.beforePaint?.(), r.throwIfAborted(), e.custom.compose(t, r, e.layer ?? "face", e.etchThreshold);
  const s = a?.loadImages ?? G0, n = $d(t);
  try {
    const o = n.getContext("2d", {
      willReadFrequently: !!a?.cpuPixels
    });
    if (!o) throw new Error("Card composition needs Canvas2D.");
    if (o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "high", o.scale(n.width / C, n.height / I), e.layer === "etching")
      return await xd(
        o,
        e.face,
        e.printingId,
        r,
        e.etchThreshold,
        a?.beforePaint,
        s,
        a?.resolveEtching
      ), n;
    o.fillStyle = "#090806", o.fillRect(0, 0, C, I);
    const i = e.currentStats?.power != null && e.currentStats.toughness != null ? pr(J(e.face)).pt : null;
    if (e.printedImage) {
      const u = t === "inspect" ? Id(e.printedImage) : e.printedImage;
      i && await (a?.loadFonts ?? Zs)();
      const m = await s(i ? [u, i] : [u], r);
      try {
        const g = m.images.get(u);
        if (g && !r.aborted) {
          if (await a?.beforePaint?.(), r.throwIfAborted(), o.drawImage(g, 0, 0, C, I), e.paintLayer !== "artwork" && e.face.blackBorderLift && (e.face.borderColor ?? "black") === "black") {
            if (!Number.isFinite(e.face.blackBorderLift) || e.face.blackBorderLift < 0 || e.face.blackBorderLift > 0.2)
              throw Error("Invalid black border lift");
            const f = Math.round(e.face.blackBorderLift * 255), w = C * 0.035;
            o.save(), o.globalCompositeOperation = "lighten", o.fillStyle = `rgb(${f},${f},${f})`, o.beginPath(), o.rect(0, 0, C, I), o.rect(w, w, C - 2 * w, I - 2 * w), o.fill("evenodd"), o.restore();
          }
          return tn(
            o,
            e.emblems ?? [],
            e.currentStats,
            i ? m.images.get(i) : void 0,
            e.statusLayout === "inspect" || t === "inspect"
          ), rn(o, e.face), n;
        }
      } finally {
        m.dispose();
      }
    }
    await Promise.all([
      (a?.loadFonts ?? Zs)(),
      Ge(e.face) ? Ml(e.face) : ud(e.face),
      Gi(e.face),
      ne(e.face) === "saga" ? Bl() : Promise.resolve(),
      yr(e.face) || $a(e.face) ? a0() : Promise.resolve(),
      de(e.face) || Ge(e.face) === "old" || wr(e.face, "W") === "historic-font" ? (a?.loadRetroFont ?? H2)() : Promise.resolve()
    ]), r.throwIfAborted();
    const l = await s(E0(e.face), r);
    let d, c, h;
    try {
      e.paintLayer !== "artwork" && (d = await U1(e.face, l.images, r)), e.paintLayer !== "artwork" && (c = await Q1(e.face, d?.images ?? l.images, r)), h = await Fi(
        e.face,
        c?.images ?? d?.images ?? l.images,
        r
      ), await a?.beforePaint?.(), r.throwIfAborted();
      const u = h.images;
      if (O0(
        o,
        e.face,
        () => A0(
          o,
          e.face,
          u,
          I,
          !1,
          a?.underArt,
          e.paintLayer
        )
      ), e.paintLayer !== "artwork" && e.face.blackBorderLift && (e.face.borderColor ?? "black") === "black") {
        if (!Number.isFinite(e.face.blackBorderLift) || e.face.blackBorderLift < 0 || e.face.blackBorderLift > 0.2)
          throw Error("Invalid black border lift");
        const m = Math.round(e.face.blackBorderLift * 255), g = C * 0.035;
        o.save(), o.globalCompositeOperation = "lighten", o.fillStyle = `rgb(${m},${m},${m})`, o.beginPath(), o.rect(0, 0, C, I), o.rect(g, g, C - 2 * g, I - 2 * g), o.fill("evenodd"), o.restore();
      }
      return tn(
        o,
        e.emblems ?? [],
        e.currentStats,
        i ? l.images.get(i) : void 0,
        e.statusLayout === "inspect" || t === "inspect"
      ), rn(o, e.face), n;
    } finally {
      h?.dispose(), c?.dispose(), d?.dispose(), l.dispose();
    }
  } catch (o) {
    throw n.width = n.height = 0, o;
  }
}
function rn(e, t) {
  e.save(), e.setTransform(
    e.canvas.width / C,
    0,
    0,
    e.canvas.height / I,
    0,
    0
  ), e.globalCompositeOperation = "destination-in", e.globalAlpha = 1, e.shadowColor = "transparent", e.filter = "none", e.fillStyle = "#000", e.beginPath(), e.roundRect(0, 0, C, I, a2(t) * C), e.fill(), e.restore();
}
function A0(e, t, r, a = I, s = !1, n, o) {
  if (t.frameTemplate) {
    $i(e, t, r, o, n);
    return;
  }
  if ($a(t)) {
    dl(e, t, r, n, o);
    return;
  }
  if (yr(t)) {
    rl(e, t, r, n, o);
    return;
  }
  if (Ft(t)) {
    $l(e, t, r, n, o);
    return;
  }
  if (Ge(t)) {
    Rl(e, t, r, n, o);
    return;
  }
  if (t.frameAssetFamily) {
    hd(e, t, r, n, o);
    return;
  }
  if (de(t)) {
    N2(e, t, r, n, o);
    return;
  }
  if (ne(t) === "saga") {
    Il(e, t, r, n, o);
    return;
  }
  const i = ve(t);
  if (i.length) {
    e.fillStyle = Re(t.setCode, t.borderColor).border, e.fillRect(0, 0, C, I);
    for (const $ of i)
      e.save(), o0(e, $), A0(
        e,
        $.face,
        r,
        $.height * C / $.width,
        !0,
        n,
        o
      ), e.restore();
    if (o === "artwork") return;
    qr(e, t), Pa(t) && (e.font = '14px "CardRenderer MTG MPlantin", Georgia', e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      C / 2,
      I - 12,
      C * 0.9
    ));
    return;
  }
  const l = ($) => [
    $[0] * C,
    $[1] * a,
    $[2] * C,
    $[3] * a
  ];
  e.fillStyle = Re(t.setCode, t.borderColor).border, e.fillRect(0, 0, C, a);
  const d = Ce(t), c = ne(t);
  if (o === "artwork") {
    ye(e, t, r, l(d.art), o);
    return;
  }
  const h = J(t), u = pr(h, c), g = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[h.boxes] ?? "#827d72", f = ($, X, ce = "top") => {
    const at = r.get($);
    if (!at) return !1;
    const [Ve, Rr, Mr, Tr] = l(X);
    e.save(), e.beginPath(), e.rect(Ve, Rr, Mr, Tr), e.clip();
    const Ya = ce === "stretch" ? Tr : at.height * Mr / at.width;
    return e.drawImage(
      at,
      Ve,
      ce === "bottom" ? Rr + Tr - Ya : Rr,
      Mr,
      Ya
    ), e.restore(), !0;
  }, [w, y, p, b] = l(h.legendary ? d.legendaryBackground : d.background);
  if (e.save(), e.beginPath(), e.roundRect(w, y, p, b, [
    { x: p * 0.01282, y: b * 962e-5 },
    { x: p * 0.01282, y: b * 962e-5 },
    { x: p * 0.06838, y: b * 0.05128 },
    { x: p * 0.06838, y: b * 0.05128 }
  ]), e.clip(), s) {
    const $ = g.slice(1).match(/../g).map(
      (X, ce) => Math.round(parseInt(X, 16) * 0.62 + [244, 236, 217][ce] * 0.38)
    );
    e.fillStyle = `rgb(${$.join(",")})`, e.fillRect(w, y, p, b);
  }
  const S = r.get(u.background), k = c.startsWith("planeswalker");
  if (S && k ? Ys(e, S, w, y, p, c === "planeswalker-large") : S ? e.drawImage(
    S,
    w,
    y + (h.legendary ? z.legendaryBackgroundLift : 0),
    p,
    s ? b : S.height * p / S.width
  ) : (e.fillStyle = g, e.fillRect(w, y, p, b)), e.restore(), e.fillStyle = "#e3d8bb", !r.has(u.frame))
    if (c === "adventure")
      for (const $ of Cr(t).filter((X) => X.kind === "rules" && !X.color))
        e.fillRect($.x, $.y, $.width, $.height);
    else e.fillRect(...l(d.rules));
  r.has(u.boxes) || (e.fillRect(...l(d.title)), e.fillRect(...l(d.type))), e.fillStyle = "#80745c", k || e.fillRect(...l(d.art));
  const v = r.get(u.frame);
  if (v && c === "normal" && !s) {
    const $ = La(t);
    o2(
      e,
      h,
      $,
      () => an(e, v, h.legendary, d.frame, !0, $)
    ), n2(e, h, $), i2(e, h, $);
  }
  if (n && (e.save(), e.beginPath(), e.rect(0, 0, C, a), e.clip(), e.resetTransform(), e.drawImage(n, 0, 0, e.canvas.width, e.canvas.height), e.restore()), c === "normal" && !s) {
    const [$, X, ce, at] = l(d.art), Ve = Dt.artRim;
    e.fillStyle = "#090806", e.fillRect($ - Ve, X - Ve, ce + 2 * Ve, at + 2 * Ve);
  }
  if (ye(e, t, r, l(d.art), o), k && nd(e, t), v && k) {
    const [$, X, ce] = l(d.frame);
    Ys(e, v, $, X, ce, c === "planeswalker-large");
  } else v && c !== "normal" && an(e, v, h.legendary, d.frame);
  if (h.legendary && f(u.crown, d.crown), s) {
    const $ = r.get(u.boxes);
    if ($) {
      const ce = $.height * 0.104;
      e.drawImage($, 0, 0, $.width, ce, ...l(d.title)), e.drawImage($, 0, $.height - ce, $.width, ce, ...l(d.type));
    }
    const X = r.get(u.frame);
    e.fillStyle = "#e3d8bb", e.fillRect(...l(d.rules)), X && e.drawImage(
      X,
      X.width * 0.035,
      X.height * 0.675,
      X.width * 0.93,
      X.height * 0.325,
      ...l(d.rules)
    );
  } else {
    const $ = k && ["Colourless", "Artifact", "Land"].includes(h.boxes);
    f(u.boxes, d.title), $ && (e.save(), e.globalAlpha *= T0, f(u.boxes, d.title), e.restore());
    const X = r.get(u.boxes);
    k && X ? ld(e, X, d.type, $) : (f(u.boxes, d.type, "bottom"), c === "normal" && X && (md(e, X, l(d.type)), gd(e, l(d.type), h.boxes)));
  }
  s || Jn(e, t, r), e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left";
  const [R, M, T, x] = l(d.title), B = R + z.plateLeft + (c === "normal" ? 1 : 0), A = kr(t), j = gl(t), E = t.manaSymbols ?? [], P = z.manaSize * j, W = z.manaGap + (A?.spacing ?? 0), re = E.length * P + Math.max(0, E.length - 1) * W, ae = R + T - z.plateRight, U = ae - re, F = [
    U,
    M + x / 2 - P / 2 + z.manaLift / 2,
    re,
    P
  ], G = E.length ? tt(F, A) : F, Z = (c === "normal" && !s ? z.normalTitleFont : z.titleFont) * j;
  e.font = `bold ${Z}px "CardRenderer MTG Beleren", Georgia`, e.letterSpacing = `${z.titleTracking}px`, e.save(), c === "normal" && !s && e.translate(...Fa(t, "modern")), te(
    e,
    t.name,
    B,
    M + x / 2 + (c === "normal" ? 1 : 0),
    G[0] - B - (E.length ? z.titleGap : 0),
    Z,
    !0
  ), e.restore(), e.letterSpacing = "0px", ft(e, F, A, () => {
    E.forEach(
      ($, X) => ee(
        e,
        $,
        U + X * (P + W),
        M + x / 2 - P / 2 + z.manaLift / 2,
        P,
        r,
        !0,
        A
      )
    );
  });
  const H = Q(t), _ = r.get(H ?? ""), ze = Te(H), le = Ne(t), Ye = x0(t), Oe = p0(t), De = Ye && c === "normal", je = De ? cd : 1, He = z.setMargin + (De ? 2 : 0), [, qe, , Xe] = l(d.type), ue = qe + Xe / 2 + z.typeLift / 2 + (c === "normal" || k ? 2 : 0), D = _ ? Math.min(
    z.setMaxWidth,
    z.setHeight * _.width * le[2] / (_.height * le[3])
  ) : 0, N = _ ? Math.min(
    D / (_.width * le[2]),
    z.setHeight / (_.height * le[3])
  ) : 0, q = [
    ae - He - D - D * (je - 1) / 2 + (k ? 1.5 : 0),
    ue - (_?.height ?? 0) * le[3] * N * je / 2 - (De ? 1 : 0),
    (_?.width ?? 0) * le[2] * N * je,
    (_?.height ?? 0) * le[3] * N * je
  ], oe = c === "normal" && !s ? _a(t, H, q, "component") : q, Ie = tt(oe, t.symbolAdjustment?.set), Je = Math.max(
    1,
    Math.min(
      ae - B - (_ ? D * (1 + (je - 1) / 2) + He + z.typeGap : 0),
      _ && Ie !== q ? Ie[0] - B - z.typeGap : 1 / 0
    )
  );
  e.font = `${z.typeFont * j}px "CardRenderer MTG Beleren", Georgia`, te(
    e,
    t.typeLine ?? "",
    B + (k ? 1.5 : 0),
    ue,
    Je,
    z.typeFont * j,
    !1,
    c === "normal" && !s ? Dt.typeWidthScale : 1
  ), ft(e, oe, t.symbolAdjustment?.set, () => {
    _ && (ze || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(_, ...oe), e.restore()) : Ye ? I0(
      e,
      _,
      t.rarity,
      ...oe,
      le,
      De ? 1.5 : 1
    ) : Oe ? b0(
      e,
      _,
      Oe,
      t.rarity,
      ...oe,
      le,
      c === "normal"
    ) : Ee(
      e,
      _,
      t.setCode,
      t.rarity,
      ...oe,
      le
    ));
  }), C0(t) ? Z2(e, t, r) : c !== "normal" ? id(e, t, r) : on(e, t, r) || he(e, Vn(e, t, a, j), r);
  const rt = P0(t);
  if (rt && c !== "leveler")
    if (f(u.pt, d.stats, "stretch"), c.startsWith("planeswalker"))
      D0(e, rt.text, l(d.stats));
    else {
      const [$, X, ce] = l(d.stats);
      e.fillStyle = "#17140f", e.font = `bold ${z.statsFont}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(
        rt.text,
        $ + ce / 2,
        X + z.statsLine / 2 + (c === "normal" ? 2 : 0),
        ce
      );
    }
  s || qr(e, t);
}
function an(e, t, r, a = V.frame, s = !1, n = 0) {
  const [o, i, l, d] = Gd(a), c = n, h = o + c, u = l - 2 * c, m = Math.min(t.height, d * t.width / l), g = m * l / t.width, f = e.getTransform().a, w = () => {
    if (!s) {
      e.drawImage(t, 0, 0, t.width, m, h, i, u, g);
      return;
    }
    const y = 424, p = 436;
    e.save(), e.beginPath(), e.rect(0, 0, C, y), e.rect(0, p, C, I - p), e.clip(), e.drawImage(t, 0, 0, t.width, m, h, i, u, g), e.restore(), e.save(), e.beginPath(), e.rect(0, y, C, p - y), e.clip(), e.drawImage(t, 0, 0, t.width, m, h, i - 1, u, g), e.restore();
  };
  e.save(), e.shadowColor = "black", e.shadowOffsetX = -394e-5 * C * f, e.shadowOffsetY = 394e-5 * C * f, e.shadowBlur = 236e-5 * C * f, w(), r || (e.shadowColor = "#ffffffa0", e.shadowOffsetX = 157e-5 * C * f, e.shadowOffsetY = -315e-5 * C * f, e.shadowBlur = 157e-5 * C * f, w()), e.restore();
}
function Gd(e) {
  return [e[0] * C, e[1] * I, e[2] * C, e[3] * I];
}
export {
  ci as $,
  fe as A,
  qd as B,
  q2 as C,
  Td as D,
  F0 as E,
  U0 as F,
  ui as G,
  Md as H,
  Od as I,
  z0 as J,
  V2 as K,
  lo as L,
  Ka as M,
  Cr as N,
  K2 as O,
  Bd as P,
  zd as Q,
  mt as R,
  wa as S,
  $d as T,
  ne as U,
  _0 as V,
  Ce as W,
  Q as X,
  P0 as Y,
  vd as Z,
  Ae as _,
  u0 as a,
  uo as a$,
  C0 as a0,
  xe as a1,
  lr as a2,
  qn as a3,
  Yd as a4,
  de as a5,
  Y as a6,
  Zs as a7,
  G0 as a8,
  H2 as a9,
  J as aA,
  O as aB,
  _o as aC,
  Ca as aD,
  Me as aE,
  Sn as aF,
  Sa as aG,
  be as aH,
  Ue as aI,
  Uo as aJ,
  ka as aK,
  es as aL,
  ke as aM,
  va as aN,
  Dd as aO,
  kn as aP,
  Br as aQ,
  $2 as aR,
  R0 as aS,
  N0 as aT,
  na as aU,
  Ld as aV,
  ba as aW,
  xl as aX,
  M0 as aY,
  go as aZ,
  Ne as a_,
  gt as aa,
  et as ab,
  Ja as ac,
  Vn as ad,
  jd as ae,
  ft as af,
  A0 as ag,
  tn as ah,
  xd as ai,
  Z2 as aj,
  te as ak,
  ye as al,
  ee as am,
  nd as an,
  N2 as ao,
  mn as ap,
  he as aq,
  Ee as ar,
  id as as,
  ws as at,
  _d as au,
  o0 as av,
  Gd as aw,
  ad as ax,
  Wd as ay,
  pr as az,
  I as b,
  Rd as b0,
  So as b1,
  sd as b2,
  hi as b3,
  Nt as b4,
  Pa as b5,
  ve as b6,
  gl as b7,
  Mo as b8,
  gn as b9,
  To as ba,
  gr as bb,
  Za as bc,
  wo as bd,
  rr as be,
  Fd as bf,
  Mt as bg,
  vn as bh,
  $a as bi,
  yr as bj,
  Ft as bk,
  Ge as bl,
  Pd as bm,
  St as bn,
  ri as bo,
  a2 as bp,
  Sd as bq,
  kd as br,
  v1 as c,
  Ed as d,
  T1 as e,
  V as f,
  z as g,
  vr as h,
  pe as i,
  C as j,
  Do as k,
  bt as l,
  Oo as m,
  Fo as n,
  dr as o,
  Ad as p,
  tt as q,
  Ao as r,
  cn as s,
  E0 as t,
  Cd as u,
  Re as v,
  Hd as w,
  Ud as x,
  Nd as y,
  At as z
};
