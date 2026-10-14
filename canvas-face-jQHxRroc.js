const Nr = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", Yr = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", Hr = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", zr = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", qr = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", be = {
  RENDERER_COMPONENT_ROOT: Nr,
  KEYRUNE_ROOT: Yr,
  CONJURER_ROOT: Hr,
  RETRO_ROOT: zr,
  RETRO_SYMBOL_FONT: qr
}, Xr = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), Vr = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function tr(e) {
  return Xr.has(e?.trim().toLowerCase() ?? "");
}
function Kr(e) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(e?.toLowerCase() ?? "") ? 0 : 1;
}
function Jr(e, t) {
  const r = e?.trim().toLowerCase() ?? "";
  return Vr.has(r) || r === "atq" && t === "Reconstruction";
}
const Zr = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function rr(e) {
  if (!/\bBasic Land\b/.test(e.typeLine ?? "")) return null;
  const t = e.rulesText ?? "", r = /^\(?\{T\}: Add \{([WUBRG])\}\.\)?$/.exec(t);
  if (!r || t.startsWith("(") !== t.endsWith(")")) return null;
  if (e.rulesParagraphs) {
    const s = e.rulesParagraphs;
    if (s.length !== 1 || s[0].role !== "rules" || s[0].align || s[0].runs.length !== 1 || s[0].runs[0].text !== t || !!s[0].runs[0].italic !== t.startsWith("("))
      return null;
  }
  return r[1];
}
function dt(e) {
  if (e.wordingMode === "oracle" || !["mir", "tmp"].includes(e.setCode?.toLowerCase() ?? "")) return null;
  const t = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    e.typeLine ?? ""
  )?.[1];
  if (!t) return null;
  const r = Zr[t];
  return rr(e) !== r ? null : {
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
function Qr(e) {
  return e.power != null && e.toughness != null ? {
    text: `${e.power}/${e.toughness}`,
    label: `Power ${e.power}, toughness ${e.toughness}`
  } : e.loyalty != null && e.loyalty !== "" ? { text: String(e.loyalty), label: `Starting loyalty ${e.loyalty}` } : null;
}
const f = 488, T = 680, es = 0.058;
function de(e, t) {
  if (t === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (t ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    e?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const ts = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", N = {
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
  stamp: [0.34, 0.76 - 0.16 * f / T, 0.32, 0.32 * f / T]
}, W = {
  titleFont: 24,
  normalTitleFont: 26,
  titleTracking: 54e-5 * f,
  titleGap: 0.02362 * f,
  plateLeft: 0.02362 * f,
  plateRight: 0.01575 * f,
  manaSize: 0.03556 * 1.35 * f,
  manaGap: 378e-5 * f,
  manaLift: -63e-4 * f,
  typeFont: 0.044 * f,
  typeGap: 945e-5 * f,
  typeLift: -315e-5 * f,
  setHeight: 0.06142 * f,
  setMaxWidth: 0.11024 * f,
  setMargin: 472e-5 * f,
  rulesPaddingX: 0.01575 * f,
  rulesPaddingY: 0.02362 * f,
  normalRulesFont: 0.04444 * f,
  longRulesFont: 0.0381 * f,
  denseRulesFont: 0.0328 * f,
  paragraphGap: 787e-5 * f,
  statsFont: 0.05333 * f,
  statsLine: 0.08661 * f,
  footerFont: 0.02167 * f,
  footerLine: 0.02126 * f,
  footerTracking: 362e-5 * f,
  artistMarginLeft: 7e-3 * f,
  artistMarginRight: 35e-4 * f,
  legendaryBackgroundLift: -0.02047 * f
}, Tt = (e) => e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
function rs(e = N) {
  return {
    ...Object.fromEntries(
      Object.entries(e).flatMap(
        ([t, r]) => r.map((s, n) => [
          `--face-${Tt(t)}-${["x", "y", "w", "h"][n]}`,
          `${s * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(W).map(([t, r]) => [
        `--face-${Tt(t)}`,
        `${r / f * 100}cqw`
      ])
    )
  };
}
const C0 = rs();
function ss(e) {
  return e.length > 340 ? "dense" : e.length > 210 ? "long" : "normal";
}
function R0(e) {
  return {
    dense: W.denseRulesFont,
    long: W.longRulesFont,
    normal: W.normalRulesFont
  }[ss(e)];
}
function Ye(e) {
  return e.split(/(\{[^}\n]+\})/g).filter(Boolean).map((t) => ({
    value: t,
    symbol: /^\{[^}\n]+\}$/.test(t) ? t.slice(1, -1) : null
  }));
}
function as(e) {
  const t = e.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[t] ?? t.slice(0, 3);
}
const Qe = "WUBRG";
function Q(e) {
  const t = e.typeLine ?? "", r = e.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(t), s = e.land ?? /(^|\s)Land(?:\s|$)/i.test(t), n = !/\bPlaneswalker\b/i.test(t) && (e.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(t)), a = e.creature ?? /(^|\s)Creature(?:\s|$)/i.test(t), l = me(e), o = l.length === 0 ? "Colourless" : l.length > 2 ? "Gold" : l.join(""), i = (r || s) && l.length === 0 ? "Artifact" : o, c = s ? "Land" : r ? "Artifact" : l.length > 1 ? "Gold" : o;
  return {
    frame: i,
    boxes: c,
    background: c,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: s && l.length > 0 ? o : r && l.length > 0 ? l.length > 1 ? "Gold" : o : c,
    pt: c,
    artifact: r,
    land: s,
    legendary: n,
    creature: a,
    className: `rendered-card-profile-${c.toLocaleLowerCase()}`
  };
}
function me(e) {
  return ns(e.frameColors ?? e.colors ?? []);
}
function ns(e) {
  return [
    ...new Set(
      e.map((t) => t.toLocaleUpperCase()).filter((t) => Qe.includes(t))
    )
  ].sort((t, r) => Qe.indexOf(t) - Qe.indexOf(r));
}
const ls = { "10e": "cmrsu", "2ed": "cmrsu", "2x2": "cmrsu", "2xm": "cmrsu", "30a": "cmrsu", "3ed": "cmrsu", "40k": "cmrsu", "4ed": "cmrsu", "5dn": "cmrsu", "5ed": "cmrsu", "6ed": "cmrsu", "7ed": "cmrsu", "8ed": "cmrsu", "9ed": "cmrsu", a25: "cmrsu", acr: "cmrsu", aer: "cmrsu", afc: "cmrsu", afr: "cmrsu", akh: "cmrsu", akr: "cmrsu", ala: "cmrsu", all: "cmrsu", ana: "cmrsu", apc: "cmrsu", arb: "cmrsu", arc: "cmrsu", archie: "cmrsu", arena: "cmrsu", arn: "cmrsu", ath: "cmrsu", atq: "cmrsu", avr: "cmrsu", azorius: "cmru", bbd: "cmrsu", bfz: "cmrsu", big: "cmrsu", blb: "cmrsu", blc: "cmrsu", bng: "cmrsu", bok: "cmrsu", boros: "cmru", bot: "cmrsu", brb: "cmrsu", brc: "cmrsu", bro: "cmrsu", brr: "cmrsu", btd: "cmrsu", c13: "cmrsu", c14: "cmrsu", c15: "cmrsu", c16: "cmrsu", c17: "cmrsu", c18: "cmrsu", c19: "cmrsu", c20: "cmrsu", c21: "cmrsu", cc1: "cmrsu", cc2: "cmrsu", ced: "cmrsu", cei: "cmrsu", chk: "cmrsu", chr: "cmrsu", clb: "cmrsu", clu: "cmrsu", cm1: "cmrsu", cm2: "cmrsu", cma: "cmrsu", cmd: "cmrsu", cmm: "cmrsu", cmr: "cmrsu", cn2: "cmrsu", cns: "cmrsu", con: "cmrsu", conf: "cmrsu", csp: "cmrsu", dci: "cmrsu", dd1: "cmrsu", dd2: "cmrsu", ddc: "cmrsu", ddd: "cmrsu", dde: "cmrsu", ddf: "cmrsu", ddg: "cmrsu", ddh: "cmrsu", ddi: "cmrsu", ddj: "cmrsu", ddk: "cmrsu", ddl: "cmrsu", ddm: "cmrsu", ddn: "cmrsu", ddo: "cmrsu", ddp: "cmrsu", ddq: "cmrsu", ddr: "cmrsu", dds: "cmrsu", ddt: "cmrsu", ddu: "cmrsu", default: "cmrsu", dft: "cmrsu", dgm: "cmrsu", dimir: "cmru", dis: "cmrsu", dka: "cmrsu", dkm: "cmrsu", dmc: "cmrsu", dmr: "cmrsu", dmu: "cmrsu", dom: "cmrsu", dpa: "cmrsu", drb: "cmrsu", drc: "cmrsu", drk: "cmrsu", dsc: "cmrsu", dsk: "cmrsu", dst: "cmrsu", dtk: "cmrsu", e01: "cmrsu", e02: "cmrsu", ecc: "cmrsu", ecl: "cmrsu", eld: "cmrsu", ema: "cmrsu", emn: "cmrsu", eoc: "cmrsu", eoe: "cmrsu", eos: "cmru", eve: "cmrsu", exo: "cmrsu", exp: "cmrsu", fca: "cmrsu", fdc: "cmrsu", fdn: "cmrsu", fem: "cmrsu", fic: "cmrsu", fin: "cmrsu", fnm: "r", fra: "cmrsu", frc: "cmrsu", frf: "cmrsu", fut: "cmrsu", gn2: "cmrsu", gn3: "cmrsu", gnt: "cmrsu", golgari: "cmru", gpt: "cmrsu", grn: "cmrsu", gruul: "cmru", gs1: "cmrsu", gtc: "cmrsu", h09: "cmrsu", h17: "cmrsu", ha1: "cmrsu", hbg: "cmrsu", hml: "cmrsu", hob: "cmrsu", hoc: "cmrsu", hop: "cmrsu", hou: "cmrsu", ice: "cmrsu", idw: "cmrsu", iko: "cmrsu", ima: "cmrsu", inr: "cmrsu", inv: "cmrsu", isd: "cmrsu", izzet: "cmru", j20: "cmrsu", j21: "cmrsu", j22: "cmrsu", j25: "cmru", jmp: "cmrsu", jou: "cmrsu", jud: "cmrsu", khc: "cmrsu", khm: "cmrsu", kld: "cmrsu", klr: "cmrsu", ktk: "cmrsu", lcc: "cmrsu", lci: "cmrsu", lea: "cmrsu", leb: "cmrsu", leg: "cmrsu", lgn: "cmrsu", lrw: "cmrsu", ltc: "cmrsu", ltr: "cmrsu", m10: "cmrsu", m11: "cmrsu", m12: "cmrsu", m13: "cmrsu", m14: "cmrsu", m15: "cmrsu", m19: "cmrsu", m20: "cmrsu", m21: "cmrsu", m3c: "cmrsu", mat: "cmrsu", mb2: "cmrsu", mbc: "cmrsu", mbs: "cmrsu", mc3: "cmrsu", md1: "cmrsu", me1: "cmrsu", me2: "cmrsu", me3: "cmrsu", me4: "cmrsu", med: "cmrsu", mh1: "cmrsu", mh2: "cmrsu", mh3: "cmrsu", mic: "cmrsu", mid: "cmrsu", mir: "cmrsu", mkc: "cmrsu", mkm: "cmrsu", mm2: "cmrsu", mm3: "cmrsu", mma: "cmrsu", mmq: "cmrsu", moc: "cmrsu", mom: "cmrsu", mor: "cmrsu", mp2: "cmrsu", mps: "cmrsu", mrd: "cmrsu", msc: "cmrsu", msh: "cmrsu", mtga: "cmrsu", mtgo: "cmrsu", mul: "cmrsu", ncc: "cmrsu", nec: "cmrsu", nem: "cmrsu", neo: "cmrsu", nph: "cmrsu", ody: "cmrsu", ogw: "cmrsu", om1: "cmrsu", omb: "cmrsu", onc: "cmrsu", one: "cmrsu", ons: "cmrsu", ori: "cmrsu", orzhov: "cmru", otc: "cmrsu", otj: "cmrsu", otp: "cmrsu", p02: "cmrsu", papac: "cmrsu", parl2: "cmrsu", past: "cmrsu", pbook: "cmrsu", pc2: "cmrsu", pca: "cmrsu", pcy: "cmrsu", pd2: "cmrsu", pd3: "cmrsu", pdrc: "c", peuro: "cmrsu", pgru: "c", phpr: "cmrsu", phuk: "cmrsu", pidw: "cmrsu", pio: "cmrsu", pip: "cmrsu", planeswalker: "cmrsu", plc: "cmrsu", pls: "cmrsu", pmps: "cmrsu", por: "cmrsu", prm: "cmrsu", ps11: "cmrsu", psal: "cmrsu", psdg: "cmrsu", psum: "cmrsu", ptg: "cmrsu", ptk: "cmrsu", pvan: "c", pxbox: "cmrsu", pz1: "cmrsu", pz2: "cmrsu", pza: "cmrsu", rav: "cmrsu", ren: "cmrsu", rex: "cmrsu", rin: "cmrsu", rix: "cmrsu", rna: "cmrsu", roe: "cmrsu", rtr: "cmrsu", rvr: "cmrsu", s00: "cmrsu", s99: "cmrsu", scd: "cmrsu", scg: "cmrsu", sds: "cmrsu", selesnya: "cmru", shm: "cmrsu", simic: "cmru", sir: "cmrsu", sis: "cmrsu", sld: "cmrsu", snc: "cmrsu", soa: "cmrsu", soc: "cmrsu", soi: "cmrsu", sok: "cmrsu", som: "cmrsu", sos: "cmrsu", spe: "cmrsu", spg: "cmrsu", spm: "cmrsu", ss1: "cmrsu", ss2: "cmrsu", ss3: "cmrsu", sta: "cmrsu", star: "cmrsu", sth: "cmrsu", stx: "cmrsu", td0: "cmrsu", td2: "cmrsu", tdc: "cmrsu", tdm: "cmrsu", thb: "cmrsu", ths: "cmrsu", tla: "cmrsu", tle: "cmrsu", tlr: "c", tmc: "cmrsu", tmp: "cmrsu", tmt: "cmrsu", tor: "cmrsu", tpr: "cmrsu", trc: "cmrsu", trk: "cmrsu", tsp: "cmrsu", tsr: "cmrsu", uds: "cmrsu", ugl: "cmrsu", ulg: "cmrsu", uma: "cmrsu", und: "cmrsu", unf: "cmrsu", unh: "cmrsu", usg: "cmrsu", ust: "cmrsu", v09: "cmrsu", v10: "cmrsu", v11: "cmrsu", v12: "cmrsu", v13: "cmrsu", v14: "cmrsu", v15: "cmrsu", v16: "cmrsu", v17: "cmrsu", van: "cmrsu", vis: "cmrsu", vma: "cmrsu", voc: "cmrsu", vow: "cmrsu", w16: "cmrsu", w17: "cmrsu", war: "cmrsu", who: "cmrsu", woc: "cmrsu", woe: "cmrsu", wor: "u", wot: "cmrsu", wth: "cmrsu", wwk: "cmrsu", x2ps: "cmrsu", xln: "cmrsu", y22: "cmrsu", y23: "cmrsu", y24: "cmrsu", y25: "cmrsu", y26: "cmrsu", zen: "cmrsu", znc: "cmrsu", zne: "cmrsu", znr: "cmrsu" }, os = {
  codes: ls
}, ce = be.CONJURER_ROOT, sr = `${ce}/img/setSymbols/official/`, Mt = os.codes, is = {
  common: "c",
  uncommon: "u",
  rare: "r",
  mythic: "m",
  special: "s",
  bonus: "s"
};
function ar(e, t = "common", r = "auto") {
  const s = e.trim().toLowerCase();
  if (r === "keyrune") return null;
  const n = tr(s) ? "c" : is[t];
  return n && Object.hasOwn(Mt, s) && Mt[s].includes(n) ? `${sr}${s}-${n}.svg` : null;
}
function Ee(e) {
  return !!e?.startsWith(sr);
}
const cs = be.KEYRUNE_ROOT, ds = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function nr(e) {
  return !e.setSymbol && !ar(e.setCode ?? "", e.rarity, e.setSymbolSource) ? ds[e.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1] : [0, 0, 1, 1];
}
const lr = new Set(
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
lr.add("con_");
const hs = "GLINT", De = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function us(e) {
  const t = De[e] ?? De.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${t}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function ms(e) {
  const t = De[e] ?? De.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${t}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function gs(e, t = "common", r) {
  const s = e.trim().toLowerCase();
  if (s === "forge") return ms(t);
  if (s === hs.toLowerCase()) return us(t);
  const n = ar(s, t, r);
  if (n) return n;
  const a = s === "con" ? "con_" : s === "p02" ? "po2" : s;
  return lr.has(a) ? `${cs}/${a}.svg` : null;
}
const Lt = {
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
function fs(e) {
  return Object.hasOwn(Lt, e) ? Lt[e] : null;
}
const Te = be.RENDERER_COMPONENT_ROOT;
function ht(e, t = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(t), s = t === "saga" ? "saga" : t === "planeswalker-large" ? "planeswalker_large" : t, n = ["saga", "class"].includes(t) && e.boxes === "Colourless" ? "Land" : t.startsWith("planeswalker") && e.boxes === "Artifact" ? "Colourless" : e.boxes;
  return {
    background: te(
      r ? "bg" : t === "class" ? "saga_bg" : `${s}_bg`,
      t.startsWith("planeswalker") && n === "Land" ? "Colourless" : n
    ),
    frame: te(
      ["normal", "leveler"].includes(t) ? "frames" : `${s}_frames`,
      t === "adventure" ? "WUBRG".includes(e.frame) ? e.frame : "W" : t === "class" ? e.frame === "WU" ? "UW" : e.frame.length === 2 ? "Gold" : e.frame : t === "saga" && e.frame === "Colourless" ? "Land" : t.startsWith("planeswalker") && ["Artifact", "Land"].includes(e.frame) ? "Colourless" : e.frame
    ),
    boxes: te(t.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", n),
    nameplate: te("nameplates", e.boxes),
    crown: te("legendary-crowns", e.crown),
    pt: t.startsWith("planeswalker") ? te("planeswalker", "Loyalty") : te("pt-boxes", e.pt)
  };
}
function He(e) {
  const t = e.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = t === "∞" ? "INFINITY" : t === "½" ? "HALF" : t.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? te("symbols", r) : null;
}
function ps(e, t, r) {
  return gs(e, t, r);
}
function te(e, t) {
  const r = e === "legendary-crowns" ? "legendary_crowns" : e === "pt-boxes" ? "pt_boxes" : e === "nameplates" ? "boxes" : e, s = e === "symbols" ? "svg" : "webp";
  return `${Te}/img/${r}/${encodeURIComponent(t)}.${s}`;
}
function Me(e, t = e.rarity) {
  const r = e.setCode?.trim().toLowerCase() ?? "";
  return e.setSymbol ?? ps(
    r === "chr" ? fs(e.name) ?? "" : r,
    t,
    e.setSymbolSource
  );
}
function st(e) {
  const t = [
    e.rulesText ?? "",
    ...(e.rulesParagraphs ?? []).flatMap((s) => s.runs.map((n) => n.text))
  ];
  return [.../* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...t.flatMap(
      (s) => Ye(s).flatMap((n) => n.symbol ? [n.symbol] : [])
    )
  ])].map(He);
}
const bs = be.RETRO_SYMBOL_FONT, Le = be.RETRO_ROOT, ws = `${Le}/fonts/goudy-medieval.ttf`, ks = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), ys = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function we(e) {
  return e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") ? !1 : e.frameStyle === "retro" || e.frameStyle !== "modern" && ks.has(e.setCode?.toLowerCase() ?? "");
}
function ze(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function ae(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return ze(e) ? "abu" : t === "leg" && me(e).length > 1 ? "legends" : ["3ed", "4ed", "5ed", "atq"].includes(t) && !/\bLand\b/.test(e.typeLine ?? "") ? "fourth" : "seventh";
}
function or(e) {
  return ae(e) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1];
}
function ut(e) {
  const t = ze(e);
  return {
    ...N,
    frame: or(e),
    title: [t ? 0.07 : 0.1134, 0.0481, t ? 0.8467 : 0.8, 0.043],
    art: ae(e) === "legends" ? [0.112, 0.094, 0.78, 0.45] : ae(e) === "fourth" ? [0.109, 0.093, 0.779, 0.453] : t ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429],
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: [0.8074, 0.895, 0.1367, 0.043],
    footer: [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function ye(e) {
  const t = me(e), r = e.typeLine ?? "", s = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([o]) => r.includes(o)), n = /\bLand\b/.test(r) ? s.length === 1 ? s[0][1] + "l" : "l" : /\bArtifact\b/.test(r) ? "a" : t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "c", a = ae(e), l = a === "seventh" || n === "c" || a === "abu" && n === "m" ? "seventh/regular" : `old/${a}`;
  return `${Le}/img/frames/${l}/${a === "legends" ? "legendsFrameM" : n}.png`;
}
function he(e) {
  return e.borderColor ?? (ys.has(e.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function jt(e) {
  return he(e) === "silver" ? de(null, "silver").border : he(e) === "white" ? vs : "#080808";
}
function ir(e) {
  return ae(e) === "fourth" ? `${Le}/img/frames/old/fourth/borderBlack.png` : `${Le}/img/frames/${ze(e) ? "old/abu" : "seventh/regular"}/border.svg`;
}
function Bt(e) {
  return ze(e) ? "#ababab" : "#f2eee3";
}
function Ss(e) {
  return e.setCode?.toLowerCase() === "7ed" && me(e).some((t) => t === "W" || t === "G") && !/Land/.test(e.typeLine ?? "") ? "saturate(.7) brightness(.88)" : "none";
}
function mt(e) {
  if (dt(e)) return null;
  const t = rr(e);
  return t ? `${Le}/img/frames/m15/basics/${t.toLowerCase()}.png` : null;
}
const vs = "#eeedeb";
function cr(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return !e.setSymbol && t === "ice" && e.setSymbolSource === "keyrune" ? `${be.KEYRUNE_ROOT}/ice2.svg` : !e.setSymbol && Jr(t, e.name) ? null : Me(e);
}
function T0(e) {
  const t = (e.rulesText ?? "").length;
  return t > 340 ? 16 : t > 210 ? 19 : 23;
}
function Cs(e) {
  return [
    mt(e),
    ye(e),
    he(e) !== "black" || ae(e) === "fourth" ? ir(e) : null,
    e.illustration,
    cr(e),
    ...st(e)
  ];
}
const se = ([e, t, r, s]) => [
  e * f,
  t * T,
  r * f,
  s * T
];
function M0(e, t) {
  return ["7ed", "8ed", "9ed"].includes(e?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(t ?? "") ? "black" : void 0;
}
function at([e, t, r]) {
  const s = Math.max(e, t, r), n = s - Math.min(e, t, r);
  return [((n === 0 ? 0 : s === e ? (t - r) / n : s === t ? (r - e) / n + 2 : (e - t) / n + 4) * 60 % 360 + 360) % 360, s === 0 ? 0 : n / s, s];
}
function Rs(e, t, r) {
  const s = (e % 360 + 360) % 360 / 60, n = r * t, a = n * (1 - Math.abs(s % 2 - 1)), l = r - n, o = s < 1 ? [n, a, 0] : s < 2 ? [a, n, 0] : s < 3 ? [0, n, a] : s < 4 ? [0, a, n] : s < 5 ? [a, 0, n] : [n, 0, a];
  return [o[0] + l, o[1] + l, o[2] + l];
}
function At(e, t) {
  const [r, s, n] = at(e);
  return Rs(
    r + t.hueDegrees,
    Math.min(1, s * t.saturationScale),
    Math.min(1, n * t.brightnessScale)
  );
}
const Ot = (e) => {
  const t = Math.max(0, Math.min(1, e));
  return t * t * (3 - 2 * t);
}, et = (e) => {
  const t = Math.max(1e-3, e[0] + e[1] + e[2]);
  return e.map((r) => r / t);
};
function Ts(e, t) {
  const { width: r, height: s, data: n } = e, a = new Float32Array(r * s);
  if (t.kind === "rect") {
    const [b, p, y, C] = t.rect;
    for (let L = 0; L < s; L++)
      for (let O = 0; O < r; O++) {
        const R = Math.min(
          O / r - b,
          b + y - O / r,
          L / s - p,
          p + C - L / s
        );
        a[L * r + O] = Ot(R / t.feather + 0.5);
      }
    return a;
  }
  const l = et(t.frameRgb), o = et(t.paperRgb), i = o.map((b, p) => b - l[p]), c = i.reduce((b, p) => b + p * p, 0);
  if (c < 1e-3) throw Error("Paper and frame chroma are too similar for this mask.");
  const [d, h, u, m] = t.bounds;
  for (let b = 0; b < s; b++)
    for (let p = 0; p < r; p++) {
      if (p / r < d || p / r > d + u || b / s < h || b / s > h + m)
        continue;
      const y = b * r + p, C = y * 4;
      if (n[C + 3] < 250) continue;
      const O = et([n[C] / 255, n[C + 1] / 255, n[C + 2] / 255]).reduce((R, M, B) => R + (M - l[B]) * i[B], 0) / c;
      a[y] = Ot((O - 0.22) / 0.56);
    }
  const g = new Uint8Array(a.length), w = new Int32Array(a.length), k = Math.round(t.seed[1] * s) * r + Math.round(t.seed[0] * r);
  if (!(a[k] > 0.08)) throw Error("Paper mask seed is outside the paper.");
  let v = 0, S = 1;
  for (w[0] = k, g[k] = 1; v < S; ) {
    const b = w[v++], p = b % r;
    for (const y of [b - r, b + r, p ? b - 1 : -1, p < r - 1 ? b + 1 : -1])
      y >= 0 && y < g.length && !g[y] && a[y] > 0.08 && (g[y] = 1, w[S++] = y);
  }
  for (let b = 0; b < a.length; b++) g[b] || (a[b] = 0);
  return a;
}
function Ms(e, t) {
  const r = "mask" in t ? t : void 0, s = r ? Ts(e, r.mask) : void 0, n = "mask" in t ? t.frame : t;
  for (let a = 0; a < e.data.length; a += 4) {
    if (e.data[a + 3] === 0) continue;
    const l = [e.data[a] / 255, e.data[a + 1] / 255, e.data[a + 2] / 255], o = Math.max(...l), i = o === 0 ? 0 : (o - Math.min(...l)) / o;
    if (o < 0.075 || !r && i < 0.025 && o > 0.97) continue;
    const c = s?.[a / 4] ?? 0, d = At(l, c === 1 && r ? r.paper : n), h = c > 0 && c < 1 && r ? At(l, r.paper) : d;
    for (let u = 0; u < 3; u++)
      e.data[a + u] = Math.round(
        Math.round(255 * d[u]) * (1 - c) + Math.round(255 * h[u]) * c
      );
  }
}
const Ls = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, js = "#9aa4ae", Bs = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
class As {
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
    const r = new Set(t.map((n) => n.key)), s = t.reduce((n, a) => {
      const l = this.entries.get(a.key);
      if (l && l.bytes !== a.bytes)
        throw Error("Material cache key has inconsistent dimensions");
      return n + (l ? 0 : a.bytes);
    }, 0);
    for (const [n, a] of this.entries) {
      if (this.bytes + s <= this.limit) break;
      a.users || r.has(n) || (this.entries.delete(n), a.retired = !0, this.destroy(a), this.evictions++);
    }
    if (!(this.bytes + s > this.limit))
      return this.bytes += s, this.peakBytes = Math.max(this.peakBytes, this.bytes), t.map((n) => {
        let a = this.entries.get(n.key);
        if (a)
          this.hits++, this.entries.delete(n.key), this.entries.set(n.key, a);
        else {
          const l = {
            users: 0,
            bytes: n.bytes,
            accounted: !0,
            retired: !1,
            promise: Promise.resolve().then(async () => {
              this.builds++;
              const o = await n.build();
              if (o.width * o.height * 4 !== n.bytes)
                throw o.close(), Error("Derived bitmap dimensions differ from its cache reservation");
              return l.bitmap = o, o;
            })
          };
          l.promise = l.promise.catch((o) => {
            throw this.entries.get(n.key) === l && this.entries.delete(n.key), l.retired = !0, this.destroy(l), this.notify(), o;
          }), this.entries.set(n.key, l), a = l;
        }
        return a.users++, a;
      });
  }
  notify() {
    for (const t of [...this.waiting]) t();
  }
  wait(t) {
    return t.throwIfAborted(), new Promise((r, s) => {
      const n = () => {
        this.waiting.delete(a), t.removeEventListener("abort", l);
      }, a = () => {
        n(), r();
      }, l = () => {
        n(), s(t.reason);
      };
      this.waiting.add(a), t.addEventListener("abort", l, { once: !0 });
    });
  }
  async acquire(t, r, s, n) {
    return (await this.acquireMany([{ key: t, bytes: r, build: s }], n))[0];
  }
  /** Admit a complete face atomically. Per-component waiting could deadlock two
   * faces that each hold half their required components while awaiting the rest. */
  async acquireMany(t, r) {
    if (r.throwIfAborted(), new Set(t.map((a) => a.key)).size !== t.length)
      throw Error("Duplicate key in material batch");
    if (t.some((a) => !Number.isSafeInteger(a.bytes) || a.bytes < 1) || t.reduce((a, l) => a + l.bytes, 0) > this.limit)
      throw RangeError("Material batch exceeds derived-image budget");
    let s;
    for (; !(s = this.admit(t)); )
      await this.wait(r), r.throwIfAborted();
    const n = s.map((a) => {
      let l = !1;
      return () => {
        l || (l = !0, a.users--, a.retired && !a.users && this.destroy(a), this.notify());
      };
    });
    try {
      const l = (await Promise.allSettled(s.map((o) => o.promise))).find((o) => o.status === "rejected");
      if (l?.status === "rejected") throw l.reason;
      return r.throwIfAborted(), s.map((o, i) => ({ value: o.bitmap, release: n[i] }));
    } catch (a) {
      for (const l of n) l();
      throw a;
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
const dr = new As(16 * 1024 * 1024), L0 = () => dr.clear(), Os = {
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
}, Is = {
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
};
function gt(e) {
  const t = ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "");
  return we(e) && (!e.layout || e.layout === "normal") && (e.colorCalibration === "set-hsb-v1" || t && e.colorCalibration === "early-hsb-v1");
}
function Es(e) {
  if (!gt(e)) return;
  const t = ye(e), r = t.split("/").at(-1).replace(".png", "").toUpperCase(), s = Os[`${e.setCode?.toLowerCase()}-${he(e)}-${r}`];
  if (!(s?.asset !== t || !s.rect.every((n, a) => n === or(e)[a])))
    return t.endsWith("/old/fourth/w.png") ? {
      ...s.adjustment,
      mask: {
        kind: "rect",
        rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
        feather: 2 / 1500
      }
    } : s.adjustment;
}
function Gs(e, t) {
  if (gt(e))
    return Is[`${e.setCode?.toLowerCase()}-${he(e)}-${t}`];
}
async function $s(e, t, r) {
  const s = { images: t, dispose() {
  } };
  if (!gt(e)) return s;
  const n = Es(e), a = /* @__PURE__ */ new Map(), l = {};
  n && a.set(ye(e), n);
  const o = /* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...[...(e.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((h) => h[1])
  ]);
  for (const h of e.rulesParagraphs ?? [])
    for (const u of h.runs) for (const m of u.text.matchAll(/\{([^}]+)\}/g)) o.add(m[1]);
  o.add("W");
  for (const h of o) {
    const u = /^\d+$/.test(h) ? "N" : h, m = Gs(e, u), g = Bs[u];
    if (!m || !g) continue;
    const w = He(h);
    w && a.set(w, xs(g, m)), l[h] = `rgb(${m.map((k) => Math.round(k * 255)).join(" ")})`;
  }
  if (!a.size && !Object.keys(l).length) return s;
  const i = Object.assign(new Map(t), { manaColors: l }), c = [...a].flatMap(([h, u]) => {
    const m = t.get(h);
    return m ? [{ url: h, source: m, adjustment: u }] : [];
  });
  let d = [];
  try {
    return d = await dr.acquireMany(
      c.map(({ url: h, source: u, adjustment: m }) => ({
        key: Ws(h, u.width, u.height, m),
        bytes: u.width * u.height * 4,
        build: () => Ps(u, m)
      })),
      r
    ), c.forEach(({ url: h }, u) => i.set(h, d[u].value)), { images: i, dispose: () => d.forEach((h) => h.release()) };
  } catch (h) {
    throw d.forEach((u) => u.release()), h;
  }
}
function Ws(e, t, r, s) {
  return JSON.stringify(["frame-hsb-paper-mask-v3", e, t, r, s]);
}
async function Ps(e, t) {
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  try {
    const s = r.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("HSB preparation needs Canvas2D.");
    s.drawImage(e, 0, 0);
    const n = s.getImageData(0, 0, r.width, r.height);
    return Ms(n, t), s.putImageData(n, 0, 0), await createImageBitmap(r);
  } finally {
    r.width = r.height = 0;
  }
}
function xs(e, t) {
  const r = [
    parseInt(e.slice(1, 3), 16) / 255,
    parseInt(e.slice(3, 5), 16) / 255,
    parseInt(e.slice(5, 7), 16) / 255
  ], [s, n, a] = at(r), [l, o, i] = at(t);
  if (n <= 0 || a <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (l - s + 540) % 360 - 180,
    saturationScale: o / n,
    brightnessScale: i / a
  };
}
const Ds = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", It = {
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
}, Et = {
  m15: { family: "m15-accurate", delta: [1, 0, 1, 1] },
  m21: { family: "m15-accurate", delta: [2, 0, 1.1, 1.06] },
  woe: { family: "m15-accurate", delta: [2, 0, 1.08, 1.08] },
  tdm: { family: "m15-accurate", delta: [0, 0, 1.08, 1.08] },
  "8ed": { family: "eighth", delta: [-4, 0, 1, 0.92] },
  "9ed": { family: "eighth", delta: [0, 1, 0.9, 0.92] }
};
function Fs(e, t, r) {
  const s = e.setCode?.toLowerCase() ?? "", n = Object.hasOwn(Et, s) ? Et[s] : void 0;
  let a = r;
  return n && !e.setSymbol && Ee(t) && n.family === e.frameAssetFamily && (a = hr(r, n.delta)), e.frameAssetFamily ? ft(e, t, a, e.frameAssetFamily) : a;
}
function ft(e, t, r, s) {
  if (e.setSymbol || !Ee(t) || ce !== Ds || (e.layout ?? "normal") !== "normal" || ["component", "m15-accurate"].includes(s) && Q(e).legendary)
    return r;
  const n = e.borderColor ?? (s === "retro" ? he(e) : de(e.setCode).border === "#eeedeb" ? "white" : "black"), a = `${e.setCode?.trim().toLowerCase() ?? ""}/${s}/${n}`, l = Object.hasOwn(It, a) ? It[a] : void 0;
  return l ? hr(r, l) : r;
}
function hr(e, t) {
  const [r, s, n, a] = e, [l, o, i, c] = t;
  return [r + n + l - n * i, s + a / 2 + o - a * c / 2, n * i, a * c];
}
const _s = 0.045;
function Us(e) {
  return we(e) ? es : _s;
}
const Ns = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", Gt = {
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
}, Oe = {
  artInset: 4.5,
  artRim: 1.5,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function Ys(e) {
  if (!e.frameAssetFamily && !Q(e).legendary && (e.layout ?? "normal") === "normal" && Te === Ns) {
    const t = e.borderColor ?? (de(e.setCode).border === "#eeedeb" ? "white" : "black"), r = `${e.setCode?.toLowerCase() ?? ""}/${t}`;
    if (Object.hasOwn(Gt, r)) return Gt[r];
  }
  return ["m15", "m19", "m20", "war"].includes(e.setCode?.toLowerCase() ?? "") ? Oe.frameInset : 0;
}
const tt = "#fbf0c5", $e = "#ccdaf2", $t = "#9c9995", rt = "#edaa8d", We = "#dde6e2", Hs = {
  WU: [tt, $e],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [rt, tt],
  WG: [We, tt],
  UB: [$e, $t],
  UR: [$e, rt],
  UG: [We, $e],
  BR: ["#b4afb5", "#f2b096"],
  BG: [$t, We],
  RG: [rt, We]
};
function zs(e, t, r) {
  if (!t.land) return;
  const s = Hs[t.frame];
  if (!s) return;
  const n = 34 + r, a = 420 - 2 * r, l = e.createLinearGradient(n, 0, n + a, 0);
  l.addColorStop(0, s[0]), l.addColorStop(0.35, s[0]), l.addColorStop(0.65, s[1]), l.addColorStop(1, s[1]), e.save(), e.globalCompositeOperation = "multiply", e.fillStyle = l, e.fillRect(n, 425, a, 203.5), e.restore();
}
function qs(e, t, r, s) {
  if (!t.land || t.frame !== "Artifact") {
    s();
    return;
  }
  const n = 34 + r, a = 420 - 2 * r;
  for (const l of [!1, !0])
    e.save(), e.beginPath(), l || e.rect(0, 0, 488, 680), e.rect(n, 425, a, 203.5), e.clip("evenodd"), e.filter = `grayscale(1) brightness(${l ? 0.9 : 0.63})`, s(), e.restore();
}
function ur(e) {
  if (e.setSymbol) return null;
  const t = e.setCode?.toLowerCase();
  return t === "m15" || t === "war" ? t : null;
}
function mr(e, t, r, s, n, a, l, o, i, c) {
  const [d, h, u, m] = c ? r === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, r === "m15" ? 0.7 : 1.2];
  n += h - l * (d - 1) / 2, a += u - o * (d - 1) / 2, l *= d, o *= d;
  const g = !s || s === "common", w = document.createElement("canvas"), k = 3, v = 4;
  w.width = Math.ceil((l + k * 2) * v), w.height = Math.ceil((o + k * 2) * v);
  const S = w.getContext("2d");
  S.scale(v, v), S.translate(k, k), S.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    0,
    0,
    l,
    o
  ), S.globalCompositeOperation = "source-in";
  const b = s === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : s === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], p = S.createLinearGradient(0, o * 0.65, l, o * 0.35);
  p.addColorStop(0, b[0]), p.addColorStop(0.35, b[1]), p.addColorStop(0.6, b[2]), p.addColorStop(1, b[3]), S.fillStyle = g ? "#111111" : p, S.fillRect(0, 0, l, o);
  const y = r === "m15" ? 32 : 27, C = new Path2D(
    r === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), L = new DOMMatrix().translate(-i[0] * l / i[2], -i[1] * o / i[3]).scale(l / (y * i[2]), o / (32 * i[3])), O = new Path2D();
  O.addPath(C, L), S.globalCompositeOperation = "destination-over", S.fillStyle = g ? "#f8f8f5" : "#111111", S.fill(O), S.strokeStyle = S.fillStyle, S.lineWidth = r === "war" && g ? 2 : m, S.lineJoin = "round", S.stroke(O), e.drawImage(
    w,
    n - k,
    a - k,
    w.width / v,
    w.height / v
  ), w.width = w.height = 0;
}
const Wt = {
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
function Xs(e) {
  if ((e.layout ?? "normal") !== "normal") return;
  const t = `${e.setCode?.toLowerCase() ?? ""}/${he(e)}`;
  return Object.hasOwn(Wt, t) ? Wt[t] : void 0;
}
function Vs(e, t) {
  const r = t.setCode?.toLowerCase();
  if (!["usg", "ulg", "uds"].includes(r ?? "") || (t.layout ?? "normal") !== "normal")
    return !1;
  e.save(), e.textAlign = "center", e.textBaseline = "alphabetic", e.shadowColor = "#17140f", e.shadowOffsetX = e.shadowOffsetY = 1.5 * e.getTransform().a, e.fillStyle = "#f2eee3", e.font = '19px "CardRenderer MTG MPlantin", Georgia';
  const s = t.power != null && t.toughness != null ? 292 : 365;
  t.artist && e.fillText(`Illus. ${t.artist}`, 244, 626, s), t.power != null && t.toughness != null && (e.shadowColor = "#000b", e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.fillText(
    `${t.power}/${t.toughness}`,
    (0.8074 + 0.1367 / 2) * 488,
    (0.895 + 0.043 / 2) * 680,
    0.1367 * 488
  )), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.textBaseline = "alphabetic", e.font = '9.5px "CardRenderer MTG MPlantin", Georgia';
  const n = me(t), a = !/\bLand\b/.test(t.typeLine ?? "") && !(n.length === 1 && ["W", "R"].includes(n[0]));
  e.fillStyle = a ? "#f2eee3" : "#17140f";
  const l = r === "usg" ? 1998 : 1999, o = t.collectorNumber ? ` ${t.collectorNumber}/${r === "usg" ? 350 : 143}` : "", i = t.legalText === void 0 ? `©1993–${l} Wizards of the Coast, Inc.${o}` : t.legalText;
  return i && e.fillText(i, 244, 640, 365), e.restore(), !0;
}
function Ks(e, t, r) {
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
function Js(e, t) {
  const r = 52.053333333333335, s = 1255 / 2100 * 680, n = 1346 / 1500 * 488, a = 1861 / 2100 * 680, l = 17 / 1500 * 488, o = 17 / 2100 * 680, i = (d) => {
    e.moveTo(...d[0]);
    for (const h of d.slice(1)) e.lineTo(...h);
    e.closePath();
  };
  e.save();
  const c = e.filter;
  e.filter = "none", e.fillStyle = "#00000047", e.beginPath(), i([
    [r, s],
    [n, s],
    [n - l, s + o],
    [r + l, s + o]
  ]), i([
    [n, s],
    [n, a],
    [n - l, a - o],
    [n - l, s + o]
  ]), e.fill(), e.beginPath(), i([
    [r, s],
    [r + l, s + o],
    [r + l, a - o],
    [r, a]
  ]), i([
    [r, a],
    [r + l, a - o],
    [n - l, a - o],
    [n, a]
  ]), e.clip(), e.filter = `${c === "none" ? "" : c + " "}brightness(1.35)`, e.drawImage(t, 0, 0, 488, 680), e.restore();
}
const Y = {
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
}, Zs = {
  W: { ...Y.por, right: 436.75, centerY: 389.75 },
  U: { ...Y.por, right: 436.5, centerY: 392.75 },
  R: { ...Y.por, right: 433.75, centerY: 392 },
  G: { ...Y.por, right: 434, centerY: 390.75 }
}, Qs = {
  all: {
    U: { ...Y.all, right: 427.5, centerY: 393.25 },
    W: { ...Y.all, right: 427.25, centerY: 392.75 }
  },
  mir: {
    G: { ...Y.mir, right: 437, centerY: 390.25 },
    W: { ...Y.mir, right: 437.75, centerY: 389.25 }
  },
  sth: {
    G: { ...Y.sth, right: 434, centerY: 391 },
    R: { ...Y.sth, right: 433.5, centerY: 391.75 },
    W: { ...Y.sth, right: 435.25, centerY: 389.25 }
  },
  tmp: {
    U: { ...Y.tmp, right: 433, centerY: 392.75 },
    W: { ...Y.tmp, right: 433.25, centerY: 389.5 }
  },
  vis: {
    W: { ...Y.vis, right: 437.5, centerY: 389.25 }
  },
  wth: {
    W: { ...Y.wth, right: 435.75, centerY: 389.75 }
  },
  hml: {
    R: { ...Y.hml, right: 437.75, centerY: 393.5 }
  },
  por: Zs
};
function ea(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  if (e.setSymbol || !Object.hasOwn(Y, t)) return null;
  const r = me(e);
  return r.length === 1 && !/\b(?:Land|Artifact)\b/.test(e.typeLine ?? "") ? Qs[t]?.[r[0]] ?? Y[t] : Y[t];
}
function ta(e) {
  return e.setSymbol || e.setCode?.toLowerCase() !== "exo" ? null : e.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : e.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const nt = {
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
}, gr = (e) => `${e}#opaque-print-details-v1`, ra = (e) => Object.keys(nt).some((t) => e === `${be.KEYRUNE_ROOT}/${t}.svg`);
async function sa(e, t) {
  const r = Object.keys(nt).find((d) => e === `${be.KEYRUNE_ROOT}/${d}.svg`);
  if (!r) return null;
  const s = new DOMParser().parseFromString(await t.text(), "image/svg+xml"), n = s.documentElement, a = s.querySelectorAll("path"), l = a[0]?.getAttribute("d") ?? "", o = l.match(/M[^M]*/g) ?? [], i = nt[r];
  if (n.localName !== "svg" || s.querySelector("parsererror") || a.length !== 1 || o.length !== i.count || o.some((d) => /m/.test(d) || !/[zZ]\s*$/.test(d)))
    throw new Error(`Unexpected pinned ${r} symbol paths.`);
  const c = s.createElementNS("http://www.w3.org/2000/svg", "path");
  return c.setAttribute("d", i.white.map((d) => o[d]).join("")), c.setAttribute("fill", "#fff"), n.replaceChildren(c), new Blob([new XMLSerializer().serializeToString(s)], { type: "image/svg+xml" });
}
const aa = [
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
], pe = 0.91339 * f / 768, lt = 0.04724 * f, ot = 0.02655 * T;
function na(e) {
  return [
    (lt + 20 * pe) / f,
    (ot + 84 * pe) / T,
    728 * pe / f,
    ((e ? 541 : 622) - 84) * pe / T
  ];
}
function la(e, t) {
  const r = aa[t ? 1 : 0];
  e.beginPath(), r.forEach(([s, n], a) => {
    const l = lt + (n - 1) * pe, o = ot + s * pe;
    a === 0 ? e.moveTo(l, o) : e.lineTo(l, o);
  });
  for (let s = r.length - 1; s >= 0; s--) {
    const [n, a] = r[s];
    e.lineTo(lt + (769 - a) * pe, ot + n * pe);
  }
  e.closePath(), e.clip();
}
function fr(e) {
  return ["B", "Colourless", "Land"].includes(Q(e).boxes);
}
function pr(e) {
  return e.frameAssetFamily !== "eighth" || !e.artist ? null : `${ce}/img/manaSymbols/${fr(e) ? "whitebrush" : "brush"}.svg`;
}
function oa(e, t) {
  if (!t.includes("*")) {
    e.fillText(t, 407, 627, 78);
    return;
  }
  const r = t.split(/(\*)/).filter(Boolean), s = r.map((l) => l === "*" ? 15 : e.measureText(l).width), n = s.reduce((l, o) => l + o, 0);
  e.save(), e.translate(407, 0), e.scale(Math.min(1, 78 / n), 1), e.textAlign = "left";
  let a = -n / 2;
  for (const [l, o] of r.entries()) {
    if (o === "*") {
      e.beginPath();
      for (let i = 0; i < 10; i++) {
        const c = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? 3.1 : 7.5, h = a + 7.5 + d * Math.cos(c), u = 622 + d * Math.sin(c);
        i === 0 ? e.moveTo(h, u) : e.lineTo(h, u);
      }
      e.closePath(), e.fill();
    } else e.fillText(o, a, 627);
    a += s[l];
  }
  e.restore();
}
function ia(e, t, r) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.letterSpacing = "0px", t.power != null && t.toughness != null && (e.fillStyle = "#17140f", e.font = '700 29px "CardRenderer MTG Matrix Small Caps", Georgia', e.textAlign = "center", e.textBaseline = "middle", oa(e, `${t.power}/${t.toughness}`));
  const s = t.setCode?.toLowerCase(), n = s === "8ed" ? 75 : s === "9ed" ? 79 : 77, a = s === "8ed" || s === "9ed", l = a ? 633 : 634;
  e.fillStyle = fr(t) ? "#fff" : "#17140f", e.textBaseline = "alphabetic", e.textAlign = "left";
  const o = pr(t);
  if (o) {
    const i = r.get(o);
    if (!i) throw Error(`Eighth Edition artist brush unavailable: ${o}`);
    e.drawImage(i, 36.5, l - 10, n - 39, 13.5), e.font = `700 ${a ? 17.5 : 18}px "CardRenderer MTG Matrix", Georgia`;
    const c = t.power != null && t.toughness != null ? 350 : 448;
    e.fillText(t.artist, n, l, c - n);
  }
  t.legalText && (e.font = '9px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 36.5, l + 13, 395)), e.restore();
}
function pt(e) {
  if (!e.frameAssetFamily) return null;
  if (we(e) || e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
    throw Error("Replacement frame plates currently support ordinary modern faces only.");
  const t = e.frameAssetFamily === "eighth", r = Q(e), s = me(e), n = s.length === 2 && "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 ? [...s].reverse() : s, l = `${ce}/img/frames/${t ? "8th" : "m15/new"}`, o = r.land ? "l" : r.artifact ? "a" : /\bVehicle\b/.test(e.typeLine ?? "") ? "v" : s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c", i = (g) => t ? `${g.toLowerCase()}l` : `l${g.toLowerCase()}`, c = r.land && n.length ? i(n.length > 2 ? "m" : n[0]) : o, d = r.land && n.length === 2 ? i(n[1]) : void 0, h = o === "l" ? t ? "l" : "c" : o, u = t ? [0.09, 0.0629, 0.824, 0.0429] : [168 / 2010, 145 / 2814, 0.8292, 0.0543], m = t ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358] : [168 / 2010, 1588 / 2814, 0.8292, 0.0543];
  return {
    frame: `${l}/${c}.png`,
    rightFrame: d ? `${l}/${d}.png` : void 0,
    border: `${l}/border.png`,
    pt: t ? `${ce}/img/frames/8th/pt/${h === "c" ? "l" : h}.png` : `${ce}/img/frames/m15/regular/m15PT${h.toUpperCase()}.png`,
    rects: {
      ...N,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title: u,
      type: m,
      art: t ? [180 / 2010, 341 / 2814, 1656 / 2010, 1216 / 2814] : [0.0767, 0.1129, 0.8476, 0.4429],
      rules: t ? [205 / 2010, 1779 / 2814, 1596 / 2010, 729 / 2814] : [0.086, 1780 / 2814, 0.828, 0.2875],
      stats: t ? [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814] : [0.7573, 0.8848, 0.188, 0.0733],
      footer: t ? [150 / 2010, 1938 / 2100, 0.81, 0.04] : N.footer
    },
    titleSize: t ? 29.2 : 26,
    typeSize: t ? 24.3 : 22,
    // Shared family adjustments measured after frame-only scan normalization.
    // Cost discs have their own baseline; they do not follow font centering.
    mana: {
      right: (t ? 0.9147 : 1864 / 2010) - (t ? 2 : 1) / 488,
      center: u[1] + u[3] / 2 + (t ? 1 : -4) / 680,
      size: t ? 22 : 23.4,
      gap: 1.5
    },
    symbol: t ? { right: 0.9079 - 2 / 488, center: 0.5886, width: 0.114, height: 0.0391 * 0.95 } : { right: 1862 / 2010 - 2 / 488, center: 0.591, width: 0.114, height: 0.041 * 0.95 }
  };
}
function ca(e) {
  const t = pt(e);
  if (!t) return null;
  const r = pr(e);
  return [
    ...r ? [r] : [],
    t.frame,
    ...t.rightFrame ? [t.rightFrame] : [],
    ...e.power != null && e.toughness != null ? [t.pt] : [],
    ...de(e.setCode, e.borderColor).border !== "#090806" ? [t.border] : []
  ];
}
function qe(e) {
  const t = e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "");
  return (e.rulesText ?? "").split(`
`).filter((r) => r.trim()).map((r) => {
    const s = t ? r.match(/^\s*([IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*)\s*[—–-]\s*(.+)$/) : null;
    if (s)
      return { text: s[2], badges: s[1].split(/\s*,\s*/), reminder: !1 };
    const n = t ? null : r.match(/^\s*\[?([+−-]?(?:\d+|X))\]?\s*:\s*(.*)$/i);
    return n ? {
      text: n[2],
      badges: [n[1].replace("-", "−").toUpperCase()],
      reminder: !1
    } : { text: r, badges: [], reminder: t && /^\s*\(/.test(r) };
  });
}
function re(e) {
  return e.layout === "ability" ? "normal" : e.layout === "adventure" && e.faces?.length === 2 ? "adventure" : e.layout === "class" || /\bClass\b/i.test(e.typeLine ?? "") ? "class" : e.layout === "leveler" || /^Level up\b/m.test(e.rulesText ?? "") ? "leveler" : e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "") ? "saga" : e.layout === "planeswalker" || /\bPlaneswalker\b/i.test(e.typeLine ?? "") ? qe(e).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function le(e) {
  const t = pt(e);
  if (t) return t.rects;
  if (we(e)) return ut(e);
  const r = re(e);
  if (r === "adventure")
    return {
      ...N,
      frame: [2.9 / 63.5, 3.5 / 88.9, 57.4 / 63.5, 79 / 88.9],
      type: [0.05669, 49.7 / 88.9, 0.88662, 0.05737],
      stamp: [0.58, 0.74, 0.25, 0.1794]
    };
  if (r === "class")
    return {
      ...N,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (r === "saga")
    return {
      ...N,
      background: [0.03937, 0.02812, 0.92126, 0.93926],
      frame: [0.032, 0.04117, 0.92126, 0.88864],
      art: [0.5008, 0.11249, 0.42992, 0.72328],
      type: [0.05669, 0.84589, 0.88662, 0.05737],
      rules: [0.07717, 0.11192, 0.4189, 0.72328],
      stamp: [0.17, 0.48, 0.23, 0.16506]
    };
  if (r.startsWith("planeswalker")) {
    const s = r === "planeswalker-large", n = [
      0.04409,
      s ? 0.55118 : 0.62655,
      0.88827,
      s ? 0.37534 : 0.29997
    ], a = N.stamp[2], l = N.stamp[3];
    return {
      ...N,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, 0.92126 * f * 3793 / 2778 / T],
      frame: [0.04724, 0.02655, 0.91339, 0.91339 * f * 3810 / 2736 / T],
      art: na(s),
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / f,
        (s ? 0.49044 : 0.55793) + 5 / T,
        0.88662,
        0.05737
      ],
      rules: n,
      stats: [0.792 + 1 / f, 0.881 - 3 / T, 0.16, 0.069],
      stamp: [
        n[0] + (n[2] - a) / 2,
        n[1] + (n[3] - l) / 2,
        a,
        l
      ]
    };
  }
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? {
    ...N,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : e.layout === "aftermath-top" ? {
    ...N,
    title: [0.035, 0.025, 0.93, 0.105],
    art: [0.052, 0.145, 0.896, 0.39],
    type: [0.035, 0.55, 0.93, 0.105],
    rules: [0.052, 0.67, 0.896, 0.29],
    footer: [0, 1, 0, 0]
  } : {
    ...N,
    art: [
      N.art[0] + Oe.artInset / f,
      N.art[1],
      N.art[2] - 2 * Oe.artInset / f,
      N.art[3]
    ]
  };
}
function da(e) {
  const t = re(e) === "saga", r = le(e).rules, s = qe(e), n = r[2] * 488 - (t ? 32 : 70), a = r[3] * 680;
  let l = t ? 21 : 19;
  const o = (k, v) => Math.max(1, Math.ceil(k.length * v * 0.49 / n)), i = (k, v) => Math.max(t ? k.badges.length * 36 : 34, o(k.text, v) * v + 16), c = (k) => s.reduce((v, S) => v + i(S, k), 0);
  for (; l > 8 && c(l) > a; ) l -= 0.5;
  const d = s.map((k) => i(k, l)), h = Math.max(0, a - c(l)) / Math.max(1, s.length);
  let u = a / Math.max(1, s.length), m = a, g = s.length;
  if (!t)
    for (const k of [...d].sort((v, S) => S - v)) {
      if (k <= u) break;
      m -= k, u = m / Math.max(1, --g);
    }
  let w = 0;
  return s.map((k, v) => {
    const S = t ? d[v] + h : Math.max(u, d[v]), b = { ...k, top: w, height: S, font: l, left: t ? 27 : 62, width: n };
    return w += S, b;
  });
}
function Fe(e, t, [r, s, n, a]) {
  if (!(e > 0 && t > 0)) return [r, s, n, a];
  const l = Math.max(n / e, a / t), o = e * l, i = t * l;
  return [r + (n - o) / 2, s + (a - i) / 2, o, i];
}
function ha(e, t, r, s) {
  const n = [s[0] * e, s[1] * t, s[2] * e, s[3] * t];
  return [...n, ...Fe(n[2], n[3], r)];
}
function Ie(e, t, r, s, n) {
  const [a, l, o, i] = s, c = re(t);
  if (e.save(), c.startsWith("planeswalker") && la(e, c === "planeswalker-large"), n === "printing") {
    e.clearRect(a, l, o, i), e.restore();
    return;
  }
  (n === "artwork" || c.startsWith("planeswalker")) && (e.fillStyle = "#80745c", e.fillRect(a, l, o, i));
  const d = r.get(t.illustration ?? "");
  if (!d) {
    e.restore();
    return;
  }
  e.beginPath(), e.rect(a, l, o, i), e.clip(), t.illustrationCrop ? e.drawImage(
    d,
    ...ha(d.width, d.height, s, t.illustrationCrop)
  ) : e.drawImage(d, ...Fe(d.width, d.height, s)), e.restore();
}
function bt(e, t, r, s) {
  const n = [];
  for (const a of t.split(`
`)) {
    let l = [], o = 0;
    const i = Ye(a).flatMap(
      (c) => c.symbol ? [{ text: c.symbol, symbol: !0 }] : (c.value.match(/\s+|\S+/g) ?? []).map((d) => ({ text: d, symbol: !1 }))
    );
    for (const c of i) {
      const d = !c.symbol && e.measureText(c.text).width > r ? [...c.text].map((h) => ({ text: h, symbol: !1 })) : [c];
      for (const h of d) {
        const u = h.symbol ? s * 0.94 : e.measureText(h.text).width;
        o + u > r && l.length && (n.push(l), l = [], o = 0), !(!l.length && /^\s+$/.test(h.text)) && (l.push({ ...h, width: u }), o += u);
      }
    }
    n.push(l);
  }
  return n;
}
function ne(e, t, r, s, n, a, l = !1) {
  const o = a.get(He(t) ?? "");
  if (e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, l) {
    const i = 1.5372 * e.getTransform().a;
    e.shadowColor = "#000d", e.shadowOffsetX = -i, e.shadowOffsetY = i;
  }
  if (e.fillStyle = a.manaColors?.[t] ?? Ls[t] ?? js, e.beginPath(), e.arc(r + n / 2, s + n / 2, n / 2, 0, Math.PI * 2), e.fill(), e.shadowColor = "transparent", o) {
    e.drawImage(o, r, s, n, n), e.restore();
    return;
  }
  e.fillStyle = t === "B" ? "white" : "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = `bold ${n * 0.62}px Georgia`, e.fillText(t, r + n / 2, s + n / 2, n * 0.9), e.restore();
}
function br(e, t, r, s, n, a, l) {
  const o = typeof a == "number" ? a : a.size;
  e.font = `${typeof a != "number" && a.italic ? "italic " : ""}${o}px "CardRenderer MTG MPlantin", Georgia`;
  const i = t.split(`
`).map((c) => bt(e, c, n, o));
  e.textBaseline = "top";
  for (const c of i) {
    for (const d of c) {
      let h = r;
      for (const u of d)
        u.symbol ? ne(e, u.text, h + o * 0.07, s + o * 0.03, o * 0.8, l) : e.fillText(u.text, h, s), h += u.width;
      s += o;
    }
    s += W.paragraphGap;
  }
}
function j0(e, t, r) {
  if (e.measureText(t).width <= r) return t;
  const s = [...t];
  for (; s.length && e.measureText(`${s.join("")}…`).width > r; ) s.pop();
  return s.length || e.measureText("…").width <= r ? `${s.join("")}…` : "";
}
function _e(e, t, r, s, n, a, l = !1, o = 1, i = "CardRenderer MTG Beleren") {
  if (!(n > 0)) throw Error("Magic title/type plate has no text space.");
  e.save(), e.font = `${l ? "bold " : ""}${a}px "${i}", Georgia`;
  const c = e.measureText(t).width;
  o > 1 && c * o > n && (o = 1), o !== 1 && (e.translate(r, 0), e.scale(o, 1), r = 0, n /= o), c > n && (a = Math.max(a * 0.78, a * n / c), e.font = `${l ? "bold " : ""}${a}px "${i}", Georgia`), e.fillText(t, r, s, n), e.restore();
}
function wt(e, t, r, s, n, a, l, o, i = [0, 0, 1, 1]) {
  const c = [
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height
  ], d = {
    uncommon: "#aaaeb2",
    rare: "#bc923f",
    mythic: "#c65c2d",
    special: "#8664af",
    bonus: "#bc923f"
  }[s ?? "common"];
  if (!d || ["forge", "glint"].includes(r?.toLowerCase() ?? "")) {
    e.drawImage(t, ...c, n, a, l, o);
    return;
  }
  const h = document.createElement("canvas");
  h.width = Math.max(1, Math.ceil(l * 2)), h.height = Math.max(1, Math.ceil(o * 2));
  const u = h.getContext("2d");
  u.drawImage(t, ...c, 0, 0, h.width, h.height), u.globalCompositeOperation = "source-in", u.fillStyle = d, u.fillRect(0, 0, h.width, h.height), e.drawImage(h, n, a, l, o), h.width = h.height = 0;
}
function ua(e, t, r, s = !1) {
  wr(
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
    s
  );
}
function ma(e, t, r, s = !1) {
  wr(
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
    s
  );
}
function wr(e, t, r, s, n) {
  t.forEach((a, l) => {
    const { size: o } = s, i = s.right - (t.length - 1 - l) * s.pitch - o / 2, c = s.centerY - o / 2;
    if (a !== "W" || n) {
      ne(e, a, i, c, o, r, !1);
      return;
    }
    yr(e, i, c, o, s.whiteSize, r.manaColors?.W);
  });
}
const kr = (e, t, r, s, n, a) => {
  if (t !== "W") return ne(e, t, r, s, n, a);
  yr(e, r, s, n, n * 0.87, a.manaColors?.W);
};
function yr(e, t, r, s, n, a = "#efe7cb") {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = a, e.beginPath(), e.arc(t + s / 2, r + s / 2, s / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = '100px "CardRenderer MTG Historic Symbols"', e.textAlign = "left", e.textBaseline = "alphabetic";
  const l = "", o = e.measureText(l), i = o.actualBoundingBoxLeft + o.actualBoundingBoxRight, c = o.actualBoundingBoxAscent + o.actualBoundingBoxDescent, d = n / Math.max(i, c);
  e.translate(t + s / 2, r + s / 2), e.scale(d, d), e.fillText(
    l,
    (o.actualBoundingBoxLeft - o.actualBoundingBoxRight) / 2,
    (o.actualBoundingBoxAscent - o.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function ga(e, t, r, s, n, a) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0;
  const l = document.createElement("canvas");
  l.width = e.canvas.width, l.height = e.canvas.height;
  const o = l.getContext("2d");
  if (!o) throw Error("Retro lettering needs a Canvas2D context");
  const i = e.getTransform();
  o.font = e.font, o.textAlign = e.textAlign, o.textBaseline = e.textBaseline, o.letterSpacing = e.letterSpacing, e.resetTransform();
  for (const [c, d, h] of [
    [0, a, "#f2eee3"],
    [a, 0, "#17140f"]
  ])
    o.resetTransform(), o.clearRect(0, 0, l.width, l.height), o.setTransform(i), o.globalCompositeOperation = "source-over", o.fillStyle = h, o.fillText(t, r + c, s + c, n), o.globalCompositeOperation = "destination-out", o.fillText(t, r + d, s + d, n), e.drawImage(l, 0, 0);
  l.width = l.height = 0, e.restore();
}
function kt(e, t, r, s, n, a) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#17140f", e.fillText(t, r + a, s + a, n), e.fillStyle = "#ababab", e.fillText(t, r, s, n), e.restore();
}
function fa(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function pa(e, t) {
  e.save(), e.font = '22.5px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", kt(e, `Illus. © ${t}`, 49, 631, 338, 1.25), e.restore();
}
const it = (e, t = !1) => `${t ? "italic " : ""}${e}px "CardRenderer MTG MPlantin", Georgia`;
function ba(e) {
  const t = [];
  let r = [], s = !1;
  const n = () => {
    r.length && (t.push({ pieces: r, space: s }), r = [], s = !1);
  };
  for (const a of e)
    for (const l of Ye(a.text))
      if (l.symbol) r.push({ text: l.symbol, symbol: !0, italic: !1 });
      else
        for (const o of l.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(o) ? (n(), o === `
` ? (t.push({ pieces: [], space: !1, newline: !0 }), s = !1) : s = !0) : r.push({ text: o, symbol: !1, italic: !!a.italic });
  return n(), t;
}
function Ae(e, t, r) {
  const s = [];
  for (const n of t) {
    const a = s.at(-1);
    a && !a.symbol && !n.symbol && a.italic === n.italic ? a.text += n.text : s.push({ ...n });
  }
  return s.map((n) => {
    e.font = it(r, n.italic);
    const a = e.measureText(n.text);
    return {
      ...n,
      size: r,
      width: n.symbol ? r * 0.88 : a.width,
      ascent: n.symbol ? r * 0.72 : a.actualBoundingBoxAscent,
      descent: n.symbol ? r * 0.08 : a.actualBoundingBoxDescent,
      inkLeft: n.symbol ? r * 0.025 : -a.actualBoundingBoxLeft,
      inkRight: n.symbol ? r * 0.825 : a.actualBoundingBoxRight
    };
  });
}
function Sr(e, t, r, s) {
  const n = [];
  let a = [];
  for (const l of t) {
    if (l.newline) {
      n.push(Ae(e, a, s)), a = [];
      continue;
    }
    const o = a.length && l.space ? [{ text: " ", italic: l.pieces[0]?.italic ?? !1, symbol: !1 }] : [], i = Ae(e, [...a, ...o, ...l.pieces], s);
    a.length && i.reduce((c, d) => c + d.width, 0) > r ? (n.push(Ae(e, a, s)), a = [...l.pieces]) : a.push(...o, ...l.pieces);
  }
  return a.length && n.push(Ae(e, a, s)), n;
}
function Pt(e, t, r, s) {
  const n = Sr(e, t, r, s);
  if (n.length < 2) return n;
  const a = /* @__PURE__ */ new Map(), l = (h, u) => {
    const m = `${h}:${u}`;
    let g = a.get(m);
    if (!g) {
      const w = [];
      for (let k = h; k < u; k++) {
        const v = t[k];
        k > h && v.space && w.push({ text: " ", italic: v.pieces[0]?.italic ?? !1, symbol: !1 }), w.push(...v.pieces);
      }
      g = Ae(e, w, s), a.set(m, g);
    }
    return g;
  }, o = /* @__PURE__ */ new Map(), i = (h, u) => {
    if (!u) return h === t.length ? { cost: 0, cuts: [] } : null;
    const m = `${h}:${u}`;
    if (o.has(m)) return o.get(m);
    let g = null;
    for (let w = h + 1; w <= t.length - u + 1; w++) {
      const k = l(h, w).reduce((b, p) => b + p.width, 0);
      if (k > r) break;
      const v = i(w, u - 1);
      if (!v) continue;
      const S = v.cost + (r - k) ** 2;
      (!g || S < g.cost) && (g = { cost: S, cuts: [w, ...v.cuts] });
    }
    return o.set(m, g), g;
  }, c = i(0, n.length);
  if (!c) return n;
  let d = 0;
  return c.cuts.map((h) => {
    const u = l(d, h);
    return d = h, u;
  });
}
function xt(e, t, r, s, n = !1) {
  const a = ba(t);
  if (!n || a.length > 64) return Sr(e, a, r, s);
  const l = [];
  let o = [];
  for (const i of a)
    i.newline ? (l.push(...o.length ? Pt(e, o, r, s) : [[]]), o = []) : o.push(i);
  return o.length && l.push(...Pt(e, o, r, s)), l;
}
const Ue = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function ue(e, t, r, s = 24, n = 15, a = Ue) {
  e.save(), e.letterSpacing = "0px", e.textBaseline = "alphabetic", e.textAlign = "left";
  try {
    let l, o = s;
    do {
      const i = [], c = [];
      let d = 0, h;
      for (const p of t) {
        let y = o, C = xt(
          e,
          p.runs,
          r.width,
          y,
          a.balanceLines
        );
        if (p.role === "flavor" && a.flavorOrphans !== !1 && C.length > 2 && C.at(-1).reduce((L, O) => L + O.width, 0) < r.width * 0.3)
          for (let L = y - 0.25; L >= y * 0.94; L -= 0.25) {
            const O = xt(
              e,
              p.runs,
              r.width,
              L,
              a.balanceLines
            );
            if (O.length < C.length) {
              y = L, C = O;
              break;
            }
          }
        if (C.length) {
          h && (h === "rules" && p.role === "flavor" ? d += o * a.flavorGap : (h !== "flavor" || p.role !== "flavor") && (d += o * a.paragraphGap));
          for (const L of C) {
            const O = Math.max(0, ...L.map((E) => E.ascent)), R = Math.max(0, ...L.map((E) => E.descent)), M = L.reduce((E, H) => E + H.width, 0), B = r.x + (p.align === "right" ? r.width - M : p.align === "center" ? (r.width - M) / 2 : 0);
            let P = 0, j = 1 / 0, $ = -1 / 0;
            for (const E of L)
              j = Math.min(j, P + E.inkLeft), $ = Math.max($, P + E.inkRight), P += E.width;
            i.push({
              x: B,
              runs: L,
              role: p.role,
              baseline: d,
              width: M,
              inkBounds: [
                B + (L.length ? j : 0),
                d - O,
                L.length ? $ - j : 0,
                O + R
              ]
            }), d += y * a.leading;
          }
          h = p.role;
        }
      }
      if (a.flavorSeparator !== !1)
        for (let p = 1; p < i.length; p++) {
          const y = i[p - 1], C = i[p];
          if (y.role !== "rules" || C.role !== "flavor") continue;
          const L = y.inkBounds[1] + y.inkBounds[3];
          c.push((L + C.inkBounds[1]) / 2 - 0.3);
        }
      const u = i[0]?.inkBounds[1] ?? 0, m = i.at(-1)?.inkBounds, g = m ? m[1] + m[3] - u : 0, w = Math.max(0, r.height - g), k = r.y + Math.max(0, Math.min(w, w / 2 + (a.centerOffset ?? 0))), v = Math.max(r.y, r.verticalLimits?.[0] ?? r.y), S = Math.min(
        r.y + r.height,
        r.verticalLimits?.[1] ?? r.y + r.height
      ), b = Math.max(v, Math.min(S - g, k)) - u;
      if (l = {
        size: o,
        x: r.x,
        top: u + b,
        width: r.width,
        height: g,
        overflow: g > S - v + 0.01 || i.some((p) => p.width > r.width + 0.01),
        lines: i.map((p) => ({
          ...p,
          baseline: p.baseline + b,
          inkBounds: [
            p.inkBounds[0],
            p.inkBounds[1] + b,
            p.inkBounds[2],
            p.inkBounds[3]
          ]
        })),
        separators: c.map((p) => p + b)
      }, l.overflow ||= l.lines.some(
        (p) => r.exclusions?.some(([y, C, L, O]) => {
          const [R, M, B, P] = p.inkBounds;
          return R < y + L && R + B > y && M < C + O && M + P > C;
        })
      ), !l.overflow || o <= n) break;
      o = Math.max(n, o - 0.25);
    } while (!0);
    return l;
  } finally {
    e.restore();
  }
}
function vr(e, t, r, s, n, a, l, o, i = 1 / 0) {
  const c = (m) => (m.align === void 0 || m.align === "center") && m.runs.length > 0 && m.runs.every((g) => !g.text.includes(`
`));
  if (!r.length || !r.every(c) || !t.every(c)) return null;
  const d = r.map((m) => m.runs.map((g) => g.text).join("")).join(`
`);
  if (Array.from(d.replace(/\{[^}]+\}/g, "●")).length > i) return null;
  const h = (m) => m.map((g) => ({ ...g, align: "center" })), u = ue(e, h(r), s, n, n, o);
  return u.overflow || u.lines.length > l ? null : ue(e, h(t), s, n, a, o);
}
const wa = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function ka(e) {
  return !wa.has(e?.trim().toLowerCase() ?? "");
}
function Cr(e, t, r = T, s = 1) {
  const n = le(t), a = {
    ...Ue,
    flavorSeparator: t.frameAssetFamily === "eighth" ? !1 : ka(t.setCode)
  }, [l, o, i, c] = n.rules, d = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((m) => ({ role: "rules", runs: [{ text: m }] })), h = {
    x: l * f + (t.frameAssetFamily ? 0 : 3.5),
    y: o * r + (t.frameAssetFamily ? 0 : 7),
    width: i * f - (t.frameAssetFamily ? 0 : 9.5),
    height: c * r - (t.frameAssetFamily ? 0 : 8),
    // Fit actual line ink around the existing power/toughness plate. Short
    // final lines can use the lower left area without being painted over.
    exclusions: t.power != null && t.toughness != null ? [
      [
        n.stats[0] * f - 2,
        n.stats[1] * r - 2,
        n.stats[2] * f + 4,
        n.stats[3] * r + 4
      ]
    ] : []
  }, u = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? d : d;
  if (t.rulesAlignment?.mode !== "left" && ["10e", "m10", "m11", "m12", "m13", "m14"].includes(t.setCode?.toLowerCase() ?? "") && u.every((m) => m.role === "rules")) {
    const m = vr(
      e,
      d,
      u,
      h,
      24.5 * s,
      15 * s,
      3,
      { ...a, balanceLines: !0 }
    );
    if (m) return m;
  }
  return ue(
    e,
    t.rulesAlignment?.mode === "left" ? d.map((m) => ({ ...m, align: "left" })) : d,
    h,
    24.5 * s,
    15 * s,
    a
  );
}
function Xe(e, t, r, s = ne, n = 0) {
  if (t.overflow) throw Error("Magic rules text does not fit the available area.");
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", e.letterSpacing = "0px";
  for (const o of t.separators) {
    const i = e.createLinearGradient(t.x, o, t.x + t.width, o);
    i.addColorStop(0, "#17140f00"), i.addColorStop(0.15, "#17140f55"), i.addColorStop(0.85, "#17140f55"), i.addColorStop(1, "#17140f00"), e.fillStyle = i, e.fillRect(t.x, o, t.width, 0.6);
  }
  e.fillStyle = "#17140f";
  const a = n > 0 ? document.createElement("canvas") : null;
  a && (a.width = e.canvas.width, a.height = e.canvas.height);
  const l = a ? a.getContext("2d") : e;
  if (!l) throw Error("Missing rules text context");
  a && (l.setTransform(e.getTransform()), l.textAlign = "left", l.textBaseline = "alphabetic", l.letterSpacing = "0px", l.fillStyle = "#17140f");
  for (const o of t.lines) {
    let i = o.x ?? t.x;
    for (const c of o.runs)
      c.symbol ? s(
        e,
        c.text,
        i + c.size * 0.025,
        o.baseline - c.size * 0.72,
        c.size * 0.8,
        r
      ) : (l.font = it(c.size, c.italic), l.fillText(c.text, i, o.baseline)), i += c.width;
  }
  if (a) {
    l.globalCompositeOperation = "destination-out", l.lineJoin = "round";
    for (const o of t.lines) {
      let i = o.x ?? t.x;
      for (const c of o.runs)
        c.symbol || (l.font = it(c.size, c.italic), l.lineWidth = c.size * n * 2, l.strokeText(c.text, i, o.baseline)), i += c.width;
    }
    e.resetTransform(), e.drawImage(a, 0, 0), a.width = a.height = 0;
  }
  e.restore();
}
const Ne = (e) => e?.runs.map((t) => t.text).join("") ?? "", Dt = (e) => e.length === 2 && /^[A-Za-z ,]+$/.test(Ne(e[0])) && Ne(e[0]).length <= 20;
function ya(e, t, r, s, n, a, l, o) {
  const i = (m) => m.role === "rules" && m.runs.length > 0 && !Ne(m).includes(`
`) && m.align === void 0;
  if (!r.length || !r.every(i) || t.some((m) => m.align) || r.length !== 1 && !Dt(r)) return null;
  const c = (m) => m.map(
    (g, w) => ({
      ...g,
      align: g.align ?? (g.role === "flavor" || Dt(m) && w === 0 && !/^Enchant\b/.test(Ne(g)) ? "left" : "center")
    })
  ), d = { x: 70, y: s - 6, width: 348, height: n - 8 }, h = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, u = ue(e, c(r), d, a, a, h);
  return u.overflow || u.lines.length > 5 ? null : ue(
    e,
    c(t),
    { ...d, verticalLimits: o },
    a,
    l,
    h
  );
}
function Rr(e) {
  return e.rulesParagraphs ?? e.rulesText.split(`
`).filter(Boolean).map((t) => ({ role: "rules", runs: [{ text: t }] }));
}
function B0(e, t, r = "oracle", s = {}) {
  const n = t[r];
  if (!n) throw Error(`Missing ${r} printing wording`);
  if (typeof n.typeLine != "string" || typeof n.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const a = s.rulesAlignment ?? r, l = a === "left" ? void 0 : t[a];
  if (a !== "left" && !l) throw Error(`Missing ${a} alignment wording`);
  const o = Q({ ...e, typeLine: t.oracle.typeLine });
  return {
    ...e,
    ...n,
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: n.rulesParagraphs,
    rulesAlignment: l ? { mode: "auto", reference: Rr(l) } : { mode: "left" },
    artifact: e.artifact ?? o.artifact,
    land: e.land ?? o.land,
    creature: e.creature ?? o.creature,
    legendary: e.legendary ?? o.legendary,
    wordingMode: r,
    symbolStyle: s.symbolStyle ?? (r === "oracle" ? "modern" : "original")
  };
}
const Be = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: !1,
  flavorSeparator: !1
};
function Sa(e, t) {
  if (mt(t)) return null;
  const [r, s, n, a] = se(ut(t).rules), l = dt(t), o = l?.paragraphs ?? Rr({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), i = t.rulesAlignment?.mode === "left", c = i ? o.map((R) => ({ ...R, align: "left" })) : o, d = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? c : c, h = t.wordingMode === "oracle" ? 10 : 15, u = t.setCode?.toLowerCase(), m = u === "lea" && t.wordingMode === "oracle" ? [428, 590] : void 0, g = ["lea", "leb", "2ed"].includes(u ?? ""), w = g || u === "3ed" && ae(t) === "fourth";
  if (w && !i) {
    const R = ya(
      e,
      c,
      d,
      s,
      a,
      g ? 32.5 : 27.5,
      h,
      m
    );
    if (R) return R;
  }
  const k = d.length === 1 ? d[0] : void 0, v = k?.runs.length === 1 ? k.runs[0] : void 0;
  if (!i && u === "4ed" && ae(t) === "fourth" && d.some((R) => R.role === "flavor")) {
    const R = vr(
      e,
      c,
      d,
      { x: 72, y: s + 2, width: 344, height: a - 8 },
      25,
      h,
      5,
      {
        ...Be,
        leading: 1.1,
        paragraphGap: 0,
        flavorGap: 0,
        balanceLines: !0
      },
      150
    );
    if (R) return R;
  }
  const S = !i && u === "4ed" && ae(t) === "fourth" && c.every((R) => R.align === void 0 || R.align === "center") && k?.role === "rules" && (k.align === void 0 || k.align === "center") && v && !v.italic && !v.text.includes(`
`) && v.text.length > 0 && v.text.length <= 100, b = (w || u === "4ed" && ae(t) === "fourth") && (c.length > 1 || c.reduce((R, M) => R + M.runs.reduce((B, P) => B + P.text.length, 0), 0) > 100), p = b && w, y = b && u === "4ed", C = (u === "mir" || u === "tmp") && !l && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") && me(t).join("") === "W", L = ue(
    e,
    S ? c.map((R) => ({ ...R, align: "center" })) : c,
    {
      x: w ? 70 : y || S ? 72 : r,
      y: s + (l ? 1.5 : S ? -6 : y ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: w ? 346 : y || S ? 344 : n + (C ? 10 : 0),
      height: a - 8,
      verticalLimits: m
    },
    l ? 24 : S ? 25 : 22.5,
    h,
    S ? { ...Be, leading: 1, balanceLines: !0 } : b ? {
      ...Be,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: p ? -10 : 0
    } : Be
  ), O = c.reduce(
    (R, M) => R + M.runs.reduce((B, P) => B + P.text.length, 0),
    0
  );
  return !p || O <= 270 || L.size >= 22 ? L : ue(
    e,
    c,
    { x: 70, y: s + 4, width: 346, height: a + 8, verticalLimits: m },
    15.5,
    h,
    {
      ...Be,
      leading: 1.25,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: -18
    }
  );
}
function va(e) {
  return e.setCode?.toLowerCase() === "3ed" && ae(e) === "fourth";
}
function Ca(e, t, r, s, n) {
  e.save(), e.font = '26px "CardRenderer MTG Goudy", Georgia', kt(e, t, 40, s, n + r - 40, 1), e.restore();
}
function Ra(e, t, r) {
  e.save(), e.font = '26px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "right", ga(e, t, 451, r + 12, 130, 1.25), e.restore();
}
function Ta(e, t) {
  e.save(), e.font = '22px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", kt(e, `Illus. © ${t}`, 50, 642, 338, 1.25), e.restore();
}
function Ma(e) {
  return ["4ed", "5ed"].includes(e.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(e.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function Ft(e) {
  const t = String(e.toughness ?? ""), r = e.wordingMode !== "oracle" && e.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(t) ? `(${t})` : t;
  return `${e.power ?? ""}/${r}`;
}
function La(e) {
  const t = e.setCode?.toLowerCase(), r = t === "4ed" && !/\bLand\b/.test(e.typeLine ?? "");
  if (t !== "mir" && t !== "tmp" && !r) return null;
  const s = me(e);
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
    legalLight: r ? /\bArtifact\b/.test(e.typeLine ?? "") || s.length === 1 && ["B", "G"].includes(s[0]) : !/\bLand\b/.test(e.typeLine ?? "") && !(s.length === 1 && ["W", "R"].includes(s[0])),
    legalText: e.legalText === void 0 ? r ? "©1995 Wizards of the Coast, Inc. All rights reserved." : t === "mir" ? "©1996 Wizards of the Coast, Inc. All rights reserved." : "©1997 Wizards of the Coast, Inc." : e.legalText
  };
}
const yt = (e, t, r, s, n, a) => {
  if (t !== "T") return ne(e, t, r, s, n, a);
  Tr(e, r, s, n, "", 0.88);
}, ct = (e, t, r, s, n, a) => {
  if (t !== "T") return kr(e, t, r, s, n, a);
  Tr(e, r, s, n, "", 0.8);
}, ja = (e, t, r, s, n, a) => {
  if (t !== "T") return ne(e, t, r, s, n, a);
  yt(e, t, r, s, n, a);
}, Ba = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function Aa(e) {
  const t = e?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(t) || ["lea", "leb", "2ed", "arn", "atq"].includes(t) ? ct : t === "4ed" ? ja : Ba.has(t) ? yt : ne;
}
function Tr(e, t, r, s, n, a) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#c9c4be", e.beginPath(), e.arc(t + s / 2, r + s / 2, s / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = `${s * a}px "CardRenderer MTG Historic Symbols"`, e.textAlign = "left", e.textBaseline = "alphabetic";
  const l = e.measureText(n);
  e.fillText(
    n,
    t + (s - l.actualBoundingBoxLeft - l.actualBoundingBoxRight) / 2 + l.actualBoundingBoxLeft,
    r + (s + l.actualBoundingBoxAscent - l.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function Oa(e, t, r, s, n, a, l, o = [0, 0, 1, 1], i = null, c = "low") {
  const d = document.createElement("canvas"), h = Math.ceil(l * 2) + 1;
  d.width = Math.ceil(n * 2) + h * 2, d.height = Math.ceil(a * 2) + h * 2;
  const u = d.getContext("2d");
  u.imageSmoothingQuality = c, u.drawImage(
    t,
    o[0] * t.width,
    o[1] * t.height,
    o[2] * t.width,
    o[3] * t.height,
    h,
    h,
    n * 2,
    a * 2
  ), u.globalCompositeOperation = "source-in", u.fillStyle = "#fff", u.fillRect(0, 0, d.width, d.height), e.save(), e.shadowColor = "transparent";
  for (let m = 0; l > 0 && m < 16; m++) {
    const g = m * Math.PI / 8;
    e.drawImage(
      d,
      r - h / 2 + Math.cos(g) * l,
      s - h / 2 + Math.sin(g) * l,
      d.width / 2,
      d.height / 2
    );
  }
  if (u.fillStyle = "#17140f", i) {
    const m = u.createLinearGradient(h, h, h + n * 2, h);
    i.forEach((g, w) => m.addColorStop(w / 2, g)), u.fillStyle = m;
  }
  u.fillRect(0, 0, d.width, d.height), e.drawImage(d, r - h / 2, s - h / 2, d.width / 2, d.height / 2), e.restore(), d.width = d.height = 0;
}
function Ia(e, t, r) {
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", t.artist && (e.fillStyle = "#f2eee3", e.shadowColor = "#000", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = `${r.artistSize}px "CardRenderer MTG MPlantin", Georgia`, e.fillText(`Illus. ${t.artist}`, r.artistX, r.artistBaseline, 338)), e.shadowColor = "transparent", e.fillStyle = r.legalLight ? "#f2eee3" : "#17140f", e.font = `${r.legalSize}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && e.fillText(r.legalText, r.artistX, r.legalBaseline, 380), e.restore();
}
function Ea(e, t, r, s, n) {
  const a = ut(t), l = La(t), o = va(t);
  if (n === "artwork") {
    Ie(e, t, r, se(a.art), n);
    return;
  }
  e.fillStyle = jt(t), e.fillRect(0, 0, 488, 680), e.fillStyle = "#686050", e.fillRect(24.4, 27.2, 439.2, 625.6), e.fillStyle = "#e5dec5", e.fillRect(...se(a.rules)), e.fillStyle = "#746b58", e.fillRect(...se(a.art)), s && e.drawImage(s, 0, 0, 488, 680), Ie(e, t, r, se(a.art), n);
  const i = r.get(ye(t));
  if (i && (e.save(), e.filter = Ss(t), e.drawImage(i, ...se(a.frame)), Ks(e, i, ye(t)), ye(t).endsWith("/seventh/regular/m.png") && Js(e, i), e.restore()), he(t) !== "black" || ae(t) === "fourth") {
    const x = r.get(ir(t));
    if (x) {
      const F = document.createElement("canvas");
      F.width = 732, F.height = 1020;
      const U = F.getContext("2d");
      U.drawImage(x, 0, 0, 732, 1020), U.globalCompositeOperation = "source-in", U.fillStyle = jt(t), U.fillRect(0, 0, 732, 1020), e.drawImage(F, ...se(a.frame)), F.width = F.height = 0;
    }
  }
  e.fillStyle = Bt(t), e.textBaseline = "middle", e.textAlign = "left", e.letterSpacing = "0px";
  const [c, d, h, u] = se(a.title), m = t.manaSymbols ?? [], g = Xs(t), w = g?.[3] ?? l?.manaSize ?? 23.4, k = g ? g[2] - w : l?.manaGap ?? 1.7, v = m.length * (w + k), S = g ? g[0] + w / 2 - v + k : l ? l.manaRight - v + k : c + h - v;
  e.shadowColor = "#000b", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const b = l?.titleX ?? c, p = d + u / 2 + (l?.titleYOffset ?? 0), y = Math.max(
    1,
    m.length ? S - b - 5 : l?.titleX == null ? h - 5 : c + h - b - 5
  );
  o ? Ca(e, t.name, b, p, y) : e.fillText(t.name, b, p, y);
  const C = t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle", L = t.symbolStyle === "original" || t.symbolStyle === void 0 && t.wordingMode === "original", O = L && ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  o ? ua(e, m, r, C) : ["lea", "2ed"].includes(t.setCode?.toLowerCase() ?? "") ? ma(e, m, r, C) : m.forEach(
    (x, F) => (O ? kr : ne)(
      e,
      x,
      S + F * (w + k),
      g ? g[1] - w / 2 : l?.manaTop ?? d + u / 2 - w / 2,
      w,
      r,
      !1
    )
  );
  const [R, M, B, P] = se(a.type), j = cr(t) ?? "", $ = r.get(j), E = ea(t), H = ta(t), X = $ ? Math.min(44 / $.width, (l?.setHeight ?? 23.4) / $.height) : 0, I = E?.width ?? ($?.width ?? 0) * X, _ = E?.height ?? ($?.height ?? 0) * X, G = [
    (E?.right ?? l?.setRight ?? R + B) - I,
    (E?.centerY ?? l?.setCenterY ?? M + P / 2) - _ / 2,
    I,
    _
  ], Z = ft(t, j, G, "retro");
  if (e.font = '21.7px "CardRenderer MTG MPlantin", Georgia', e.fillText(
    dt(t)?.typeLine ?? t.typeLine ?? "",
    l?.typeX ?? R,
    M + P / 2,
    $ ? Math.max(
      1,
      Math.min(
        B - 48,
        E ? E.right - E.width - R - 6 : B,
        Z !== G ? Z[0] - (l?.typeX ?? R) - 6 : B
      )
    ) : B
  ), $) {
    const x = Math.min(44 / $.width, (l?.setHeight ?? 23.4) / $.height), F = E?.width ?? $.width * x, U = E?.height ?? $.height * x, ee = E?.right ?? l?.setRight ?? R + B, K = E?.centerY ?? l?.setCenterY ?? M + P / 2, oe = E?.crop ?? [0, 0, 1, 1], ge = Ee(j), z = !ge && !t.setSymbol && r.get(gr(j));
    z && (e.save(), e.shadowColor = "transparent", t.setCode?.toLowerCase() === "arn" && (e.filter = "brightness(0.7)"), e.drawImage(
      z,
      oe[0] * z.width,
      oe[1] * z.height,
      oe[2] * z.width,
      oe[3] * z.height,
      ee - F,
      K - U / 2,
      F,
      U
    ), e.restore()), ge || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage($, ...Z), e.restore()) : H || l || tr(t.setCode) ? Oa(
      e,
      $,
      ee - F,
      K - U / 2,
      F,
      U,
      E?.outline ?? (H ? 2 : l?.setOutline ?? Kr(t.setCode)),
      oe,
      H,
      E?.sampling
    ) : wt(
      e,
      $,
      t.setCode,
      t.rarity,
      R + B - $.width * x,
      M + P / 2 - $.height * x / 2,
      $.width * x,
      $.height * x
    );
  }
  e.shadowColor = "transparent";
  const [V, Se, ke, ie] = se(a.rules);
  e.fillStyle = "#17140f";
  const q = r.get(mt(t) ?? "");
  if (q) {
    const x = Math.min(ke * 0.4 / q.width, ie * 0.75 / q.height);
    e.drawImage(
      q,
      V + (ke - q.width * x) / 2,
      Se + (ie - q.height * x) / 2,
      q.width * x,
      q.height * x
    );
  } else {
    const x = Sa(e, t);
    x && Xe(
      e,
      x,
      r,
      C ? ne : L ? Aa(t.setCode) : t.setCode?.toLowerCase() === "3ed" ? ct : l ? yt : ne,
      t.setCode?.toLowerCase() === "lea" ? 0.012 : 0
    );
  }
  if (!Vs(e, t)) {
    if (e.shadowColor = l?.statsOpaqueShadow ? "#000" : "#000b", l && (e.shadowOffsetX = e.shadowOffsetY = l.statsShadow * e.getTransform().a), e.fillStyle = Bt(t), e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", t.power != null && t.toughness != null) {
      const [x, F, U, ee] = se(a.stats), K = Ma(t);
      e.textAlign = K ? "right" : "center", o ? Ra(e, Ft(t), F + ee / 2) : e.fillText(
        Ft(t),
        K?.right ?? x + U / 2,
        F + ee / 2 + (K?.yOffset ?? 0),
        K?.maxWidth ?? U
      );
    }
    if (o && t.artist) Ta(e, t.artist);
    else if (t.artist && fa(t)) pa(e, t.artist);
    else if (l) Ia(e, t, l);
    else if (t.artist) {
      const [x, F, U, ee] = se(a.footer);
      e.textAlign = "center", e.font = '15.6px "CardRenderer MTG MPlantin", Georgia', e.fillText(`Illus. ${t.artist}`, x + U / 2, F + ee / 2, U);
    }
    e.shadowColor = "transparent";
  }
}
const Ga = (e, t = {}) => fetch(e, { ...t, mode: "cors" });
let _t;
const $a = [
  ["CardRenderer MTG Goudy", ws],
  ["CardRenderer MTG Historic Symbols", bs]
];
function Wa() {
  return typeof FontFace != "function" ? Promise.resolve() : _t ??= Promise.all(
    $a.map(async ([e, t]) => {
      if ([...document.fonts].some(
        (s) => s.family.replace(/^"|"$/g, "") === e && s.status === "loaded"
      ))
        return;
      const r = await Ga(t);
      if (!r.ok) throw Error(`Retro font unavailable: ${e}`);
      document.fonts.add(await new FontFace(e, await r.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((e) => {
    throw _t = void 0, e;
  });
}
const Pa = `${Te}/img/class_level_bg.webp`, Mr = (e) => ["adventure", "class", "leveler"].includes(re(e)), Ce = (e, t, r, s) => ({
  x: e / 63.5 * 488,
  y: t / 88.9 * 680,
  width: r / 63.5 * 488,
  height: s / 88.9 * 680
}), xa = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function Da(e, t, r, s = 21) {
  const n = e.replace(/\{[^}]+\}/g, "●").split(`
`);
  let a = s;
  for (; a > 8 && n.reduce(
    (l, o) => l + Math.max(1, Math.ceil(o.length * a * 0.53 / t)) * a + 4,
    0
  ) > r; )
    a -= 0.5;
  return a;
}
function Ve(e) {
  const t = re(e), r = [], s = (n, a, l, o = {}) => {
    r.push({ kind: n, text: a, ...l, font: Da(a, l.width, l.height), ...o });
  };
  if (t === "adventure") {
    const n = e.faces?.[1];
    if (!n) return [];
    const a = (n.manaSymbols ?? []).map((o) => `{${o}}`).join(""), l = (n.manaSymbols?.length ?? 0) * 2.5;
    s("heading", n.name, Ce(5.6, 55.3, 25 - l, 4.2), {
      color: "white",
      font: Math.min(18, (25 - l) * 488 / 63.5 / Math.max(1, n.name.length * 0.55))
    }), s("rules", a, Ce(30 - l, 55.3, l, 4.2), { color: "white", font: 17 }), s("heading", n.typeLine ?? "", Ce(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (n.typeLine ?? "").length * 0.52))
    }), s("rules", n.rulesText ?? "", Ce(5.6, 64.5, 24.7, 15.6)), s("rules", e.rulesText ?? e.faces?.[0]?.rulesText ?? "", Ce(33, 54.9, 25.5, 25));
  } else if (t === "class") {
    const [n, a, l, o] = le(e).rules.map(
      (b, p) => b * (p % 2 ? T : f)
    ), i = Q(e);
    s(
      "band",
      "",
      { x: n, y: a, width: l, height: o },
      {
        fill: "#e3d8bb",
        asset: te(
          "saga_textboxes",
          i.boxes === "Colourless" ? "Land" : i.boxes
        )
      }
    );
    const c = [];
    for (const b of (e.rulesText ?? "").split(`
`).filter(Boolean))
      c.length && !/^.*:\s*Level\s+\d+\s*$/i.test(b) && !/^.*:\s*Level\s+\d+\s*$/i.test(c.at(-1)) && !c.at(-1).startsWith("(") ? c[c.length - 1] += `
` + b : c.push(b);
    const d = (b) => /^.*:\s*Level\s+\d+\s*$/i.test(b), h = 28, u = 20, m = (b, p) => b.split(`
`).reduce(
      (y, C) => y + Math.max(1, Math.ceil(C.length * p * 0.53 / (l - 10))),
      0
    ), g = c.map(
      (b) => d(b) ? h : m(b, b.startsWith("(") ? 16 : u) * (b.startsWith("(") ? 16 : u) + 8
    ), w = c.filter((b) => !d(b)).length, k = Math.max(0, o - g.reduce((b, p) => b + p, 0)) / Math.max(1, w), v = Math.min(
      1,
      (o - c.filter(d).length * h) / g.reduce((b, p, y) => b + (d(c[y]) ? 0 : p), 0)
    );
    let S = a;
    c.forEach((b, p) => {
      const y = d(b), C = y ? h : g[p] * v + k;
      if (y) {
        const [L, O] = b.split(/:\s*/);
        s("band", "", { x: n, y: S, width: l, height: C }, { asset: Pa }), s("rules", L + ":", { x: n + 5, y: S, width: l / 2 - 5, height: C }, { font: 18 }), s(
          "heading",
          O,
          { x: n + l / 2, y: S, width: l / 2 - 5, height: C },
          { font: 18, align: "right" }
        );
      } else
        s(
          "rules",
          b,
          { x: n + 5, y: S + 4, width: l - 10, height: C - 8 },
          { font: (b.startsWith("(") ? 16 : u) * v, italic: b.startsWith("(") }
        );
      S += C;
    });
  } else if (t === "leveler") {
    const n = e.rulesText ?? "", a = n.split(/^LEVEL\s+([^\n]+)\n/gm), l = [
      {
        range: "",
        text: a[0] ?? "",
        stats: e.power != null && e.toughness != null ? `${e.power}/${e.toughness}` : ""
      }
    ];
    for (let d = 1; d < a.length; d += 2) {
      const h = a[d + 1] ?? "", u = h.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      l.push({
        range: a[d],
        stats: u?.[1] ?? "",
        text: u ? h.slice(u[0].length) : h
      });
    }
    const o = Ce(4.9, 55.6, 53.7, 25.5), i = o.height / l.length, c = xa[Q(e).frame] ?? "#dcc8af";
    l.forEach((d, h) => {
      const u = o.y + h * i;
      h && s(
        "band",
        "",
        { x: o.x, y: u, width: o.width, height: i },
        { fill: h % 2 ? "#00000018" : "#00000028" }
      );
      const m = d.range ? 55 : 7, g = d.stats ? 72 : 7;
      s("rules", d.text, {
        x: o.x + m,
        y: u + 4,
        width: o.width - m - g,
        height: i - 8
      }), d.range && s(
        "level",
        `LEVEL
${d.range}`,
        { x: o.x - 12, y: u + i / 2 - 23, width: 65, height: 46 },
        { fill: c, font: 13 }
      ), d.stats && s(
        "stats",
        d.stats,
        { x: o.x + o.width - 68, y: u + i / 2 - 22, width: 77, height: 44 },
        { asset: te("pt-boxes", Q(e).pt), font: 26 }
      );
    });
  }
  return r;
}
function Fa(e) {
  return Ve(e).flatMap((t) => [
    t.asset ?? null,
    ...Ye(t.text).flatMap((r) => r.symbol ? [He(r.symbol)] : [])
  ]);
}
function _a(e) {
  return Mr(e) ? Ve(e) : null;
}
function Ua(e, t, r) {
  for (const s of Ve(t)) {
    const { x: n, y: a, width: l, height: o, font: i } = s;
    e.save(), e.textAlign = "left", e.fillStyle = s.fill ?? "transparent", s.kind === "level" ? (e.beginPath(), e.moveTo(n, a), e.lineTo(n + l * 0.72, a), e.lineTo(n + l, a + o / 2), e.lineTo(n + l * 0.72, a + o), e.lineTo(n, a + o), e.closePath(), e.fill(), e.strokeStyle = "#0008", e.lineWidth = 1, e.stroke()) : s.fill && e.fillRect(n, a, l, o);
    const c = s.asset ? r.get(s.asset) : null;
    if (c && e.drawImage(c, n, a, l, o), e.beginPath(), e.rect(n, a, l, o), e.clip(), e.fillStyle = s.color ?? "#17140f", ["stats", "level"].includes(s.kind)) {
      e.font = `${i}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
      const d = s.text.split(`
`);
      d.forEach(
        (h, u) => e.fillText(
          h,
          n + l * (s.kind === "level" ? 0.43 : 0.5),
          a + o / 2 + (u - (d.length - 1) / 2) * i,
          l * 0.85
        )
      );
    } else if (s.align === "right")
      e.font = `${i}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "right", e.textBaseline = "middle", e.fillText(s.text, n + l, a + o / 2, l);
    else {
      e.font = `${s.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
      const d = bt(e, s.text, l, i).length * i + (s.text.split(`
`).length - 1) * W.paragraphGap;
      br(
        e,
        s.text,
        n,
        a + Math.max(0, (o - d) / 2),
        l,
        { size: i, italic: !!s.italic },
        r
      );
    }
    e.restore();
  }
}
function Ge(e) {
  if (!["split", "aftermath"].includes(e.layout ?? "") || e.faces?.length !== 2) return [];
  const t = e.layout === "aftermath" || /\bAftermath\b/.test(e.faces[1].rulesText ?? "");
  return e.faces.map((r, s) => {
    const n = t ? 0.615 : 0.5, a = {
      setCode: e.setCode,
      rarity: e.rarity,
      artist: e.artist,
      ...r,
      layout: t ? s === 0 ? "aftermath-top" : "aftermath-bottom" : "split-half",
      faces: void 0,
      rulesText: r.rulesText?.split(`
`).filter((l) => !/^Fuse\b/.test(l)).join(`
`),
      illustration: r.illustration ?? e.illustration,
      etchedIllustration: r.etchedIllustration ?? (r.illustration ? void 0 : e.etchedIllustration),
      illustrationCrop: r.illustrationCrop ?? (!r.illustration && e.illustration ? [s ? n : 0, 0, s ? 1 - n : n, 1] : void 0)
    };
    return t ? s === 0 ? { face: a, x: 0, y: 0, width: 488, height: 375, rotation: 0 } : { face: a, x: 488, y: 367, width: 276, height: 488, rotation: 90 } : {
      face: a,
      x: 5,
      y: (s ? 333 : 648) - (St(e) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function A0(e) {
  return {
    left: `${e.x / f * 100}%`,
    top: `${e.y / T * 100}%`,
    width: `${e.width / f * 100}%`,
    height: `${e.height / T * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function Lr(e, t) {
  e.translate(t.x, t.y), e.rotate(t.rotation * Math.PI / 180), e.scale(t.width / f, t.width / f);
}
function Ut(e, t) {
  const r = t[0] * e.width, s = t[1] * e.height, n = t[2] * e.width, a = t[3] * e.height;
  return e.rotation === -90 ? [
    (e.x + s) / f,
    (e.y - r - n) / T,
    a / f,
    n / T
  ] : e.rotation === 90 ? [
    (e.x - s - a) / f,
    (e.y + r) / T,
    a / f,
    n / T
  ] : [(e.x + r) / f, (e.y + s) / T, n / f, a / T];
}
function Na(e) {
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? 1.5 : 1;
}
function St(e) {
  return /\bFuse\b/.test(e.rulesText ?? "") || !!e.faces?.some((t) => /^Fuse\b/m.test(t.rulesText ?? ""));
}
const Ya = 5, Ha = 0.02655 * T + 0.91339 * f * 3810 / 2736;
function vt(e) {
  const t = e ? 382 : 429;
  return { top: t, scale: 1 - Ya / (Ha - t) };
}
function za(e) {
  const { top: t, scale: r } = vt(e);
  return [t + 6, t + (625 - t) * r - 4];
}
function Nt(e, t, r, s, n, a) {
  const { top: l, scale: o } = vt(a), i = t.height * n / t.width, c = Math.max(0, Math.min(i, l - s)), d = c * t.width / n;
  c > 0 && e.drawImage(t, 0, 0, t.width, d, r, s, n, c), c < i && e.drawImage(
    t,
    0,
    d,
    t.width,
    t.height - d,
    r,
    s + c,
    n,
    (i - c) * o
  );
}
function qa(e, t, r) {
  const s = e.rulesParagraphs?.filter((l) => l.role === "rules")[r], n = (e.rulesText ?? "").split(`
`).filter((l) => l.trim())[r];
  if (!s || s.runs.map((l) => l.text).join("") !== n) return [{ text: t }];
  let a = n.length - t.length;
  return s.runs.flatMap((l) => {
    const o = Math.min(a, l.text.length);
    return a -= o, o === l.text.length ? [] : [{ ...l, text: l.text.slice(o) }];
  });
}
function Xa(e, t) {
  const r = re(t) === "planeswalker-large", s = qe(t), n = !r && s.length < 3, a = le(t).rules, l = a[0] * f, o = a[1] * T, i = a[2] * f, c = a[3] * T - (r ? 24 : n ? 4 : 16), d = r ? 8 : n ? 3 : 0, h = r ? { ...Ue, leading: 0.9 } : Ue, u = s.map((R, M) => ({
    ...R,
    runs: qa(t, R.text, M),
    left: R.badges.length ? 67 : 45
  })), m = (R) => u.map(
    (M) => ue(
      e,
      [{ role: "rules", runs: M.runs }],
      { x: l + M.left, y: 0, width: i - M.left - 8, height: 1e3 },
      R,
      R,
      h
    )
  );
  let g = r ? 17.5 : n ? 24 : 19, w = m(g);
  const [k, v] = za(r), S = () => {
    const R = c / Math.max(1, u.length), M = w.map((j, $) => o + d + R * ($ + 0.5) - j.height / 2);
    let B = k - 8;
    for (let j = 0; j < M.length; j++)
      M[j] = Math.max(M[j], B + 8), B = M[j] + w[j].height;
    let P = v + 8;
    for (let j = M.length - 1; j >= 0; j--)
      M[j] = Math.min(M[j], P - 8 - w[j].height), P = M[j];
    return M;
  }, b = () => (S()[0] ?? k) >= k, p = () => w.map((R) => Math.max(34, R.height + 16)), y = () => {
    const R = c / Math.max(1, u.length);
    return w.every((M, B) => {
      const P = R * (B + 0.5);
      return P - M.height / 2 >= 6 && P + M.height / 2 <= c + 6 && (!B || R - (M.height + w[B - 1].height) / 2 >= 8);
    });
  };
  for (; g > 8 && (p().reduce((R, M) => R + M, 0) > c || !y() || !b()); )
    g -= 0.25, w = m(g);
  const C = c / Math.max(1, u.length), L = S();
  let O = d;
  return u.map((R, M) => {
    const B = C, P = w[M].height, j = ue(
      e,
      [{ role: "rules", runs: R.runs }],
      {
        x: l + R.left,
        y: L[M],
        width: i - R.left - 8,
        height: P
      },
      g,
      g,
      h
    );
    j.overflow ||= O + B > d + c + 0.01, j.overflow ||= !y(), j.overflow ||= !b(), j.overflow ||= j.lines.some(
      (E) => E.inkBounds[1] < k - 0.01 || E.inkBounds[1] + E.inkBounds[3] > v + 0.01
    );
    const $ = { ...R, top: O, height: B, font: g, width: j.width, layout: j };
    return O += B, $;
  });
}
function Va(e) {
  return { font: 18, offsetY: e.startsWith("+") ? 2 : e === "0" ? 0 : -2 };
}
function jr(e, t) {
  return e === "saga" ? /^(I|II|III|IV)$/.test(t) ? te("saga", t) : null : te(
    "planeswalker",
    t.startsWith("+") ? "LoyaltyPlus" : t === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function Br(e, t) {
  return re(e) === "saga" ? te("saga_textboxes", t === "Colourless" ? "Land" : t) : null;
}
function Ka(e) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[Q(e).boxes] ?? "#dededbf0";
}
function Ja(e, t) {
  const { top: r, scale: s } = vt(re(t) === "planeswalker-large");
  e.save(), e.translate(0, r), e.scale(1, s), e.translate(0, -r), e.beginPath(), e.moveTo(66, r), e.lineTo(448, r), e.quadraticCurveTo(456, r, 456, r + 8), e.lineTo(456, 613), e.bezierCurveTo(456, 623, 420, 629, 257, 629), e.bezierCurveTo(94, 629, 58, 623, 58, 613), e.lineTo(58, r + 8), e.quadraticCurveTo(58, r, 66, r), e.closePath(), e.clip(), e.fillStyle = Ka(t), e.fillRect(58, r, 398, 629 - r), e.restore();
}
function Za(e, t, r) {
  e.fillStyle = "#17140f", e.font = '24px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "alphabetic";
  const s = e.measureText(":");
  e.fillText(
    ":",
    t,
    r + 1.5 + (s.actualBoundingBoxAscent - s.actualBoundingBoxDescent) / 2
  );
}
function Qa(e, t, r) {
  const s = re(t), n = s === "saga", a = le(t).rules, l = a[0] * f, o = a[1] * T, i = a[2] * f, c = a[3] * T;
  n && (e.fillStyle = "#e3d8bb", e.fillRect(l, o, i, c));
  const d = Br(t, Q(t).boxes), h = d ? r.get(d) : void 0;
  h && e.drawImage(h, l, o, i, c);
  const u = n ? da(t) : Xa(e, t);
  for (const [m, g] of u.entries()) {
    if (m > 0) {
      const v = u[m - 1]?.layout, S = g.layout && v ? Math.max(v.top + v.height + 3, Math.min(o + g.top, g.layout.top - 3)) : o + g.top;
      e.fillStyle = "#0002", e.fillRect(l + (n ? 0 : 40), S, i - (n ? 0 : 40), 1.5);
    }
    if (e.fillStyle = "#17140f", e.textAlign = "left", g.layout) Xe(e, g.layout, r);
    else {
      e.font = `${g.reminder ? "italic " : ""}${g.font}px "CardRenderer MTG MPlantin", Georgia`;
      const v = bt(e, g.text, g.width, g.font).length * g.font;
      br(
        e,
        g.text,
        l + g.left,
        o + g.top + (g.height - v) / 2,
        g.width,
        { size: g.font, italic: g.reminder },
        r
      );
    }
    const w = n ? 36 : 54, k = n ? 36 : 40;
    g.badges.forEach((v, S) => {
      const b = l + (n ? -18 : 0), p = o + g.top + g.height / 2 + (S - g.badges.length / 2) * k, y = jr(s, v), C = y ? r.get(y) : null;
      if (C) {
        if (e.save(), !n) {
          const L = e.getTransform().a;
          e.shadowColor = "#0009", e.shadowBlur = 3 * L, e.shadowOffsetY = 2 * L;
        }
        e.drawImage(C, b, p, w, k), e.restore();
      } else
        e.fillStyle = "#29231c", e.fillRect(b, p, w, k);
      if (!C || !n) {
        e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle";
        const L = Va(v);
        e.font = `bold ${n ? 19 : L.font}px "CardRenderer MTG Beleren", Georgia`, e.fillText(
          v,
          b + w / 2 - (n ? 0 : 1.5),
          p + k / 2 + (n ? 0 : L.offsetY),
          w - 3
        ), n || Za(e, b + w + 4, p + k / 2);
      }
    });
  }
}
const Ar = 0.7;
function e0(e, t, r, s = !1) {
  const [n, a, l, o] = [
    r[0] * f,
    r[1] * T,
    r[2] * f,
    r[3] * T - 1
  ], i = new Path2D();
  i.moveTo(n + 14, a), i.lineTo(n + l - 14, a), i.quadraticCurveTo(n + l, a, n + l, a + 14), i.lineTo(n + l, a + o - 7), i.quadraticCurveTo(n + l, a + o, n + l - 7, a + o), i.lineTo(n + 9, a + o), i.quadraticCurveTo(n - 2, a + o, n - 2, a + o - 9), i.quadraticCurveTo(n - 2, a + 17, n + 2, a + 9), i.quadraticCurveTo(n + 5, a, n + 14, a), i.closePath(), e.save();
  const c = e.getTransform().a;
  e.shadowColor = "#0009", e.shadowBlur = 1.4 * c, e.shadowOffsetX = -1.2 * c, e.shadowOffsetY = 3.5 * c, e.fillStyle = "#191816", e.fill(i), e.shadowColor = "transparent", e.save(), e.clip(i);
  const d = t.width / l, h = [
    20 * d,
    t.height - (o - 4) * d,
    t.width - 40 * d,
    (o - 12) * d,
    n - 2,
    a,
    l + 2,
    o
  ];
  e.drawImage(t, ...h), s && (e.globalAlpha *= Ar, e.drawImage(t, ...h)), e.restore(), e.strokeStyle = "#191816", e.lineWidth = 1.2, e.stroke(i), e.restore();
}
const t0 = 1.1;
function Or(e) {
  return !e.setSymbol && ["m19", "m20", "m21"].includes(e.setCode?.toLowerCase() ?? "");
}
function Ir(e, t, r, s, n, a, l, o, i = 1) {
  const c = !r || r === "common", d = document.createElement("canvas"), h = 2, u = 4;
  d.width = Math.ceil((a + h * 2) * u), d.height = Math.ceil((l + h * 2) * u);
  const m = d.getContext("2d");
  m.scale(u, u), m.translate(h, h), m.drawImage(
    t,
    o[0] * t.width,
    o[1] * t.height,
    o[2] * t.width,
    o[3] * t.height,
    0,
    0,
    a,
    l
  ), m.globalCompositeOperation = "source-in";
  const g = r === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : r === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], w = m.createLinearGradient(0, l * 0.65, a, l * 0.35);
  w.addColorStop(0, g[0]), w.addColorStop(0.35, g[1]), w.addColorStop(0.6, g[2]), w.addColorStop(1, g[3]), m.fillStyle = c ? "#111111" : w, m.fillRect(0, 0, a, l), m.beginPath(), m.moveTo(a * 0.046, 0), m.lineTo(a * 0.953, 0), m.bezierCurveTo(
    a * 1.016,
    l * 0.38,
    a * 1.016,
    l * 0.62,
    a * 0.953,
    l
  ), m.lineTo(a * 0.046, l), m.bezierCurveTo(-a * 0.017, l * 0.62, -a * 0.017, l * 0.38, a * 0.046, 0), m.closePath(), m.globalCompositeOperation = "destination-over", m.fillStyle = c ? "#f8f8f5" : "#111111", m.fill(), m.globalCompositeOperation = "source-over", m.strokeStyle = c ? "#f8f8f5" : "#111111", m.lineWidth = i, m.stroke(), e.drawImage(
    d,
    s - h,
    n - h,
    d.width / u,
    d.height / u
  ), d.width = d.height = 0;
}
const Re = (e) => [
  e[0] * f,
  e[1] * T,
  e[2] * f,
  e[3] * T
];
function r0(e, t, r, s, n) {
  const a = pt(t);
  if (!a) throw Error("Missing replacement frame family.");
  const l = (I) => {
    const _ = r.get(I);
    if (!_) throw Error(`Replacement frame asset unavailable: ${I}`);
    return _;
  }, { rects: o } = a, i = t.frameAssetFamily === "eighth";
  if (e.save(), e.fillStyle = de(t.setCode, t.borderColor).border, e.fillRect(0, 0, f, T), s && e.drawImage(s, 0, 0, f, T), Ie(e, t, r, Re(o.art), n), n === "artwork") {
    e.restore();
    return;
  }
  if (e.drawImage(l(a.frame), 0, 0, f, T), a.rightFrame) {
    const I = document.createElement("canvas");
    I.width = 732, I.height = 1020;
    const _ = I.getContext("2d");
    _.drawImage(l(a.rightFrame), 0, 0, I.width, I.height);
    const G = document.createElement("canvas");
    G.width = I.width, G.height = I.height;
    const Z = G.getContext("2d"), V = (oe, ge) => {
      const z = Z.createLinearGradient(G.width * oe, 0, G.width * ge, 0);
      return z.addColorStop(0, "#0000"), z.addColorStop(1, "#000"), z;
    };
    Z.fillStyle = V(0.47, 0.53), Z.fillRect(0, 0, G.width, G.height);
    const Se = i ? [0.08, 0.627, 0.84, 0.29] : [0.071, 0.629, 0.858, 0.294], [ke, ie, q, x] = Se, F = ke * G.width, U = ie * G.height, ee = q * G.width, K = x * G.height;
    Z.clearRect(F, U, ee, K), Z.fillStyle = V(0.27, 0.73), Z.fillRect(F, U, ee, K), _.globalCompositeOperation = "destination-in", _.drawImage(G, 0, 0), e.drawImage(I, 0, 0, f, T), I.width = I.height = 0, G.width = G.height = 0;
  }
  const c = de(t.setCode, t.borderColor);
  if (c.border !== "#090806") {
    const I = document.createElement("canvas");
    I.width = 732, I.height = 1020;
    const _ = I.getContext("2d");
    _.drawImage(l(a.border), 0, 0, I.width, I.height), _.globalCompositeOperation = "source-in", _.fillStyle = c.border, _.fillRect(0, 0, I.width, I.height), e.drawImage(I, 0, 0, f, T), I.width = I.height = 0;
  }
  e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const d = i ? "CardRenderer MTG Matrix" : "CardRenderer MTG Beleren", [h, u, m, g] = Re(o.title), w = t.manaSymbols ?? [], { size: k, gap: v } = a.mana, S = a.mana.right * f, b = w.length * k + Math.max(0, w.length - 1) * v;
  e.font = `bold ${a.titleSize}px "${d}", Georgia`, _e(
    e,
    t.name,
    h,
    u + g / 2,
    w.length ? S - b - h - 8 : m,
    a.titleSize,
    !0,
    1,
    d
  ), w.forEach(
    (I, _) => ne(
      e,
      I,
      S - b + _ * (k + v),
      a.mana.center * T - k / 2,
      k,
      r,
      !0
    )
  );
  const p = Me(t), y = r.get(p ?? ""), C = nr(t), L = y ? Math.min(
    a.symbol.width * f / (y.width * C[2]),
    a.symbol.height * T / (y.height * C[3])
  ) : 0, O = y ? y.width * C[2] * L : 0, R = y ? y.height * C[3] * L : 0, M = Fs(t, p, [
    a.symbol.right * f - O,
    a.symbol.center * T - R / 2,
    O,
    R
  ]), [B, P, j, $] = Re(o.type);
  if (e.font = `bold ${a.typeSize}px "${d}", Georgia`, _e(
    e,
    t.typeLine ?? "",
    B,
    P + $ / 2,
    y ? M[0] - B - 7 : j,
    a.typeSize,
    !0,
    1,
    d
  ), y) {
    const I = ur(t);
    Ee(p) || t.setSymbol ? e.drawImage(y, ...M) : Or(t) ? Ir(e, y, t.rarity, ...M, C, 1.5) : I ? mr(e, y, I, t.rarity, ...M, C, !1) : wt(e, y, t.setCode, t.rarity, ...M, C);
  }
  if (Xe(e, Cr(e, t), r), t.power != null && t.toughness != null && e.drawImage(l(a.pt), ...Re(o.stats)), i) {
    ia(e, t, r), e.restore();
    return;
  }
  if (t.power != null && t.toughness != null) {
    const [I, _, G, Z] = Re(o.stats);
    e.font = `bold 25px "${d}", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(`${t.power}/${t.toughness}`, I + G * 0.52, _ + Z * 0.52, G * 0.85);
  }
  const [E, H, X] = Re(o.footer);
  e.textAlign = "left", e.textBaseline = "top", e.fillStyle = "#fff", e.font = `12px "${d}", Georgia`, e.fillText(t.artist ?? "", E, H, X), t.legalText && (e.font = '9px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, E, H + 15, X)), e.restore();
}
let Yt = null;
function s0(e) {
  return e.frameAssetFamily !== "eighth" ? Promise.resolve() : Yt ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 29px "CardRenderer MTG Matrix Small Caps"')
  ]).then((t) => {
    if (t.some((r) => !r.length || r.some((s) => s.status !== "loaded")))
      throw Error("Replacement Eighth Edition frames need card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw Yt = null, t;
  });
}
function a0(e, t, [r, s, n, a]) {
  const l = t.height * n / t.width;
  e.save(), e.beginPath(), e.rect(r, s, n, a / 2), e.clip(), e.drawImage(t, r, s + a - l + 1, n, l), e.restore();
}
function n0(e, [t, r, s, n], a) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(a)) return;
  e.save(), e.shadowColor = "transparent";
  const l = e.createLinearGradient(t, 0, t + s, 0);
  l.addColorStop(0, "rgba(255,255,255,0)"), l.addColorStop(0.025, "rgba(255,255,255,0.2)"), l.addColorStop(0.975, "rgba(255,255,255,0.2)"), l.addColorStop(1, "rgba(255,255,255,0)"), e.fillStyle = l, e.fillRect(t, r + n - 4, s, 2.3), e.restore();
}
const l0 = "symbol-svg-v3", o0 = { "m15-u": { sha256: "bfd962ff9640a846e5690d76c0fe88324e9d49cb6771744b5ab8f34f7afe7362", recipe: "m15" }, "m15-r": { sha256: "933756b97cebe7389ff7cee219a34b1ac13bc504743a2be037a286ee5ffc4b0d", recipe: "m15" }, "m15-m": { sha256: "6e9f87473f1ed8ecb05647fbde6f13e22faeab18fe56b8f76cfa1759bb4210e7", recipe: "m15" }, "8ed-u": { sha256: "6c20e8da28fdd5cdb030814e5c1339978f276c77f4ad9d99ca816adb8d970880", recipe: "8ed" }, "8ed-r": { sha256: "eccde74c56b4810434ecdf4e99206046d6970ea601e4fed2f73eb2ee855053a2", recipe: "8ed" }, "9ed-u": { sha256: "acb7ea7f3422f50dca2aef4e07aa3977aa1641ff2cb54f6eb64ae1bc17abbf53", recipe: "9ed" }, "9ed-r": { sha256: "c1cbcc1aea4f032c5f2ccf7f1d63073813bf9c6f050ba2f5385170ff3deca8a5", recipe: "9ed" }, "7ed-u": { sha256: "94c67d433ba3012f3aa1c494a7ef0ae1e7de58ce4614dfd50ee8f52de527d7e4", recipe: "white-outer-rim" }, "7ed-r": { sha256: "8b30917e85b2c9c3549bfa6c2f62261801df33ff7debcc138bf89c4a9ba9689f", recipe: "white-outer-rim" } }, Er = {
  revision: l0,
  sources: o0
}, Ht = `${ce}/img/setSymbols/official/`, zt = Er.sources;
function Gr(e) {
  if (!e.startsWith(Ht) || !e.endsWith(".svg")) return;
  const t = e.slice(Ht.length, -4);
  return Object.hasOwn(zt, t) ? zt[t] : void 0;
}
function i0(e) {
  return !!Gr(e);
}
async function c0(e, t) {
  const r = Gr(e);
  if (!r) return t;
  const s = await t.arrayBuffer();
  if ([...new Uint8Array(await crypto.subtle.digest("SHA-256", s))].map((h) => h.toString(16).padStart(2, "0")).join("") !== r.sha256) throw Error(`Unexpected pinned symbol checksum: ${e}`);
  const l = new DOMParser().parseFromString(new TextDecoder().decode(s), "image/svg+xml"), o = l.documentElement, i = [...o.querySelectorAll("path")], c = o.querySelector("linearGradient, radialGradient");
  if (o.localName !== "svg" || l.querySelector("parsererror") || !c)
    throw Error(`Unexpected pinned symbol SVG: ${e}`);
  const d = (h, u) => {
    for (const [m, g] of Object.entries(u)) h.setAttribute(m, g);
  };
  if (r.recipe === "white-outer-rim") {
    if (i.length !== 3) throw Error("Unexpected rimmed symbol topology.");
    i[0].setAttribute("fill", "#fff");
  } else if (r.recipe === "m15") {
    if (i.length !== 6) throw Error("Unexpected M15 path topology.");
    d(i[0], { fill: `url(#${c.id})`, stroke: "#000", "stroke-width": "8" });
    for (const h of i.slice(1)) h.setAttribute("fill", "#000");
  } else if (r.recipe === "8ed" || r.recipe === "9ed") {
    if (i.length !== 4) throw Error("Unexpected numeric shield path topology.");
    const h = i[2], u = h.parentElement?.getAttribute("transform");
    if (!u) throw Error("Missing numeric shield coordinate transform.");
    if (i[0].setAttribute("fill", "#000"), i[3].setAttribute("fill", "#000"), r.recipe === "9ed") {
      const m = c.cloneNode(!0);
      d(m, {
        id: "glint-root-metal",
        gradientTransform: `${u} ${c.getAttribute("gradientTransform") ?? ""}`
      }), c.after(m), d(i[3], {
        stroke: "url(#glint-root-metal)",
        "stroke-width": "12",
        "paint-order": "stroke fill"
      });
    }
  } else throw Error(`Unknown symbol SVG patch recipe: ${r.recipe}`);
  return o.setAttribute("data-card-glint-patch", Er.revision), new Blob([new XMLSerializer().serializeToString(l)], { type: "image/svg+xml" });
}
const fe = /* @__PURE__ */ new Map();
function $r(e) {
  if (!(!e.retired || e.users)) {
    if (!e.sources) {
      e.controller.abort();
      return;
    }
    URL.revokeObjectURL(e.sources.original), e.sources.backing && URL.revokeObjectURL(e.sources.backing), e.sources = void 0;
  }
}
function O0() {
  for (const e of fe.values())
    e.retired = !0, $r(e);
  fe.clear();
}
async function d0(e, t) {
  t.throwIfAborted();
  let r = fe.get(e);
  if (!r) {
    const i = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const c = await fetch(e, { mode: "cors", signal: i.controller.signal });
        if (!c.ok) throw Error(`Symbol source ${c.status}: ${e}`);
        const d = await c0(e, await c.blob()), h = await sa(e, d);
        i.controller.signal.throwIfAborted();
        const u = URL.createObjectURL(d);
        try {
          const m = { original: u, backing: h ? URL.createObjectURL(h) : void 0 };
          return i.sources = m, m;
        } catch (m) {
          throw URL.revokeObjectURL(u), m;
        }
      })
    };
    i.promise = i.promise.catch((c) => {
      throw fe.get(e) === i && fe.delete(e), c;
    }), fe.set(e, i), r = i;
  }
  r.users++;
  const s = r;
  let n = !1;
  const a = () => {
    n || (n = !0, s.users--, !s.users && !s.sources && (s.retired = !0, fe.get(e) === s && fe.delete(e)), $r(s));
  };
  let l = () => {
  };
  const o = new Promise((i, c) => {
    l = () => {
      a(), c(t.reason);
    }, t.addEventListener("abort", l, { once: !0 });
  });
  try {
    const i = await Promise.race([s.promise, o]);
    return t.throwIfAborted(), { sources: i, release: a };
  } catch (i) {
    throw a(), i;
  } finally {
    t.removeEventListener("abort", l);
  }
}
async function h0(e, t) {
  t.throwIfAborted();
  const r = [...new Set(e.filter((i) => !!i))], s = [], n = /* @__PURE__ */ new Map(), a = () => {
    for (const i of s) i.release();
    s.length = 0;
  }, o = (await Promise.allSettled(
    r.map(async (i) => {
      if (!ra(i) && !i0(i)) {
        n.set(i, i);
        return;
      }
      const c = await d0(i, t);
      s.push(c), n.set(i, c.sources.original), c.sources.backing && n.set(gr(i), c.sources.backing);
    })
  )).find((i) => i.status === "rejected");
  if (o?.status === "rejected")
    throw a(), o.reason;
  return t.aborted && (a(), t.throwIfAborted()), { urls: [...new Set(n.values())], aliases: n, dispose: a };
}
function u0(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const [s, n] of e) {
    const a = t.get(n);
    a && r.set(s, a);
  }
  return r;
}
async function m0(e, t) {
  return t.throwIfAborted(), fetch(e, { signal: t, mode: "cors" });
}
function g0(e) {
  if (e.startsWith(`${ce}/img/frames/`) && e.endsWith(".png"))
    return /\/pt\/|\/m15PT/.test(e) ? 256 : 768;
  if (e.startsWith(`${Le}/img/frames/`) && e.endsWith(".png")) return 768;
  const t = e.startsWith(`${Te}/img/`) ? e.slice(`${Te}/img/`.length) : "";
  return t === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    t
  ) ? 768 : void 0;
}
async function f0(e) {
  if (!e.type.includes("svg")) return e;
  const t = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), r = t.documentElement;
  if (r.localName !== "svg" || t.querySelector("parsererror"))
    throw new Error("Invalid SVG asset.");
  const s = (r.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), n = s[2] ?? parseFloat(r.getAttribute("width") ?? ""), a = s[3] ?? parseFloat(r.getAttribute("height") ?? "");
  if (!(n > 0 && a > 0 && Number.isFinite(n + a)))
    throw new Error("SVG asset needs a finite viewport.");
  const l = 512 / Math.max(n, a);
  return r.hasAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${n} ${a}`), r.setAttribute("width", String(Math.max(1, Math.round(n * l)))), r.setAttribute("height", String(Math.max(1, Math.round(a * l)))), new Blob([new XMLSerializer().serializeToString(r)], { type: "image/svg+xml" });
}
async function p0(e, t, r) {
  if (t.throwIfAborted(), !e.type.includes("svg"))
    return r ? createImageBitmap(e, { resizeWidth: r, resizeQuality: "high" }) : createImageBitmap(e);
  const s = URL.createObjectURL(await f0(e)), n = new Image(), a = document.createElement("canvas"), l = () => {
    n.src = "";
  };
  t.addEventListener("abort", l, { once: !0 });
  try {
    t.throwIfAborted(), n.src = s, await n.decode(), t.throwIfAborted(), a.width = n.naturalWidth, a.height = n.naturalHeight;
    const o = a.getContext("2d", { willReadFrequently: !0 });
    if (!o || !a.width || !a.height)
      throw new Error("SVG asset could not be rasterized.");
    return o.drawImage(n, 0, 0), await createImageBitmap(a);
  } finally {
    t.removeEventListener("abort", l), n.src = "", URL.revokeObjectURL(s), a.width = 0, a.height = 0;
  }
}
async function Wr(e, t) {
  const r = await h0(e, t), s = r.urls, n = /* @__PURE__ */ new Map();
  let a = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, s.length) }, async () => {
        for (; a < s.length && !t.aborted; ) {
          const o = s[a++];
          try {
            const i = await m0(o, t);
            if (!i.ok) continue;
            const c = await i.blob(), d = await p0(c, t, g0(o));
            t.aborted ? d.close() : n.set(o, d);
          } catch {
          }
        }
      })
    );
  } finally {
    r.dispose();
  }
  const l = u0(r.aliases, n);
  return {
    images: l,
    dispose: () => {
      for (const o of n.values()) o.close();
      n.clear(), l.clear();
    }
  };
}
function Pr(e) {
  const t = ca(e);
  if (t) return [...t, e.illustration, Me(e), ...st(e)];
  if (we(e)) return Cs(e);
  const r = Ge(e);
  if (r.length) return r.flatMap((a) => Pr(a.face));
  const s = Q(e), n = ht(s, re(e));
  return [
    ...Fa(e),
    n.background,
    n.frame,
    n.boxes,
    n.pt,
    Br(e, s.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(re(e)) ? qe(e).flatMap(
      (a) => a.badges.map((l) => jr(re(e), l))
    ) : [],
    s.legendary ? n.crown : null,
    e.illustration,
    Me(e),
    ...st(e)
  ];
}
let qt = null;
function Xt() {
  return qt ??= Promise.all([
    document.fonts.load('24px "CardRenderer MTG Beleren"'),
    document.fonts.load('700 24px "CardRenderer MTG Beleren"'),
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
    throw qt = null, e;
  });
}
function Pe(e) {
  return le(e).art;
}
const Vt = /* @__PURE__ */ new WeakMap(), xe = ([e, t, r, s]) => [e, 1 - t - s, e + r, 1 - t], b0 = [xe(le({}).art), [0, 0, 0, 0]];
function I0(e) {
  if (!e) return b0;
  const t = Vt.get(e);
  if (t) return t;
  const r = Ge(e), s = r.length ? [
    xe(Ut(r[0], Pe(r[0].face))),
    xe(Ut(r[1], Pe(r[1].face)))
  ] : [xe(Pe(e)), [0, 0, 0, 0]];
  return Vt.set(e, s), s;
}
async function w0(e, t, r, s, n, a, l = Wr, o) {
  return xr(e, t, r, s, {
    threshold: n,
    resolveEtching: o,
    beforePaint: a,
    loadImages: l,
    height: T
  });
}
async function xr(e, t, r, s, n) {
  const { threshold: a, beforePaint: l, loadImages: o, height: i } = n, c = Ge(t);
  if (c.length) {
    for (const p of c)
      e.save(), Lr(e, p), await xr(e, p.face, r, s, {
        ...n,
        height: p.height * f / p.width
      }), e.restore();
    return;
  }
  if (t.illustration && n.resolveEtching) {
    let p;
    try {
      const y = await n.resolveEtching(t, r, s, a, l);
      p = await o([y, t.illustration], s);
      const C = p.images.get(y ?? "");
      if (C && !s.aborted) {
        await l?.(), s.throwIfAborted();
        const [L, O, R, M] = le(t).art, B = L * f, P = O * i, j = R * f, $ = M * i, E = p.images.get(t.illustration) ?? C;
        e.save(), e.beginPath();
        const H = Pe(t);
        if (e.rect(
          H[0] * f,
          H[1] * i,
          H[2] * f,
          H[3] * i
        ), e.clip(), e.imageSmoothingQuality = "low", t.illustrationCrop) {
          const X = t.illustrationCrop, I = Fe(E.width * X[2], E.height * X[3], [
            B,
            P,
            j,
            $
          ]);
          e.drawImage(
            C,
            X[0] * C.width,
            X[1] * C.height,
            X[2] * C.width,
            X[3] * C.height,
            ...I
          );
        } else
          e.drawImage(
            C,
            ...Fe(E.width, E.height, [B, P, j, $])
          );
        e.restore();
      }
    } catch {
    } finally {
      p?.dispose();
    }
  }
  if (s.throwIfAborted(), !t.setCode) return;
  const [d, h, u, m] = le(t).stamp, g = d * f, w = h * i, k = u * f, v = m * i, S = Me(t, "common"), b = await o([S], s);
  try {
    await l?.(), s.throwIfAborted();
    const p = S ? b.images.get(S) : null;
    if (e.save(), e.globalAlpha = 0.68, p) {
      const y = Math.min(k / p.width, v / p.height);
      e.drawImage(
        p,
        g + (k - p.width * y) / 2,
        w + (v - p.height * y) / 2,
        p.width * y,
        p.height * y
      );
    } else
      e.translate(g, w), e.scale(k / 100, v / 100), e.fillStyle = "white", e.fill(new Path2D(ts)), e.font = "bold 43px Georgia", e.textAlign = "center", e.textBaseline = "alphabetic", e.fillText(as(t.setCode), 50, 65);
    e.restore();
  } finally {
    b.dispose();
  }
}
function k0(e) {
  return e.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const y0 = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, Kt = /* @__PURE__ */ new WeakMap();
function S0(e, t) {
  let r = Kt.get(t);
  if (r || (r = new Path2D(t.path), Kt.set(t, r)), e.save(), t.viewBox) {
    const [s, n, a, l] = t.viewBox;
    e.scale(24 / a, 24 / l), e.translate(-s, -n);
  }
  t.transform && e.transform(...t.transform), t.filled ? (e.fillStyle = e.strokeStyle, e.fill(r)) : e.stroke(r), e.restore();
}
function Jt(e, t, r, s, n = !1) {
  const a = f * 0.105, l = f * 0.015, o = Math.floor(f * 0.9 / (a + l));
  if (t.forEach((m, g) => {
    e.save(), e.translate(
      f * 0.05 + g % o * (a + l),
      T * 0.13 + Math.floor(g / o) * (a + l)
    ), e.fillStyle = "#17201fed", e.strokeStyle = "#c6af7977", e.lineWidth = 1, e.beginPath(), e.arc(a / 2, a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.stroke(), e.translate(a * 0.14, a * 0.14), e.scale(a * 0.72 / 24, a * 0.72 / 24), e.strokeStyle = "#f3e9cf", e.lineWidth = 1.8, e.lineCap = "round", e.lineJoin = "round", S0(e, m), e.restore();
  }), r?.power == null || r.toughness == null) return;
  e.save();
  const i = y0[n ? "inspect" : "table"], c = f * i.width, d = T * i.height, h = f * (1 - i.right - i.width), u = T * (1 - i.bottom - i.height);
  s ? e.drawImage(s, h, u, c, d) : (e.fillStyle = "#eee5cf", e.strokeStyle = "#746854", e.lineWidth = 2, e.beginPath(), e.roundRect(
    h + c * (n ? 0.14 : 0.1),
    u + d * (n ? 0.19 : 0.18),
    c * (n ? 0.72 : 0.8),
    d * (n ? 0.62 : 0.64),
    d * 0.12
  ), e.fill(), e.stroke()), e.font = `bold ${f * (n ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
    `${r.power}/${r.toughness}`,
    h + c / 2,
    n ? u + d / 2 - f * 0.01 : u + d * 0.48,
    c * 0.72
  ), e.restore();
}
function E0(e) {
  return e.currentStats?.power != null && e.currentStats.toughness != null && e.statusLayout !== "inspect" ? { ...e, statusLayout: "inspect" } : e;
}
function G0(e, t) {
  if (e.custom)
    return JSON.stringify([
      "custom-face-v1",
      e.custom.key,
      t,
      e.layer ?? "face",
      e.layer === "etching" ? e.etchThreshold ?? 20 : null
    ]);
  const r = e.face, s = Dr(r, e.layer === "etching"), n = e.currentStats?.power != null && e.currentStats.toughness != null ? [e.currentStats.power, e.currentStats.toughness] : null;
  return JSON.stringify([
    Te,
    ce,
    "canvas-face-v92",
    e.paintLayer ?? null,
    t,
    e.printingId,
    e.layer === "etching" ? null : e.printedImage,
    s,
    e.layer ?? "face",
    e.layer === "etching" ? e.etchThreshold ?? 14 : null,
    e.layer === "etching" ? null : [
      (e.emblems ?? []).map((a) => [
        a.path,
        a.viewBox ?? null,
        a.transform ?? null,
        !!a.filled
      ]),
      n,
      n ? e.statusLayout ?? t : null
    ]
  ]);
}
function Dr(e, t) {
  const r = Ge(e);
  return r.length ? [
    e.layout,
    r.map((s) => [s.x, s.y, s.width, s.height, s.rotation, Dr(s.face, t)]),
    !t && St(e)
  ] : t ? [
    e.illustration ?? null,
    e.etchedIllustration ?? null,
    e.illustrationCrop ?? null,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    le(e)
  ] : [
    we(e) ? [ye(e), he(e)] : null,
    e.borderColor ?? null,
    e.frameAssetFamily ?? null,
    e.name,
    e.manaSymbols ?? [],
    e.typeLine ?? "",
    e.rulesText ?? "",
    e.rulesParagraphs ?? null,
    e.wordingMode ?? null,
    e.symbolStyle ?? null,
    e.colorCalibration ?? null,
    e.rulesAlignment ?? null,
    e.illustration ?? null,
    e.illustrationCrop ?? null,
    _a(e),
    e.artist ?? null,
    e.collectorNumber ?? null,
    e.legalText === void 0 ? ["default"] : e.legalText,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    e.rarity ?? "common",
    e.power ?? null,
    e.toughness ?? null,
    e.loyalty ?? null,
    le(e),
    Q(e)
  ];
}
function v0(e) {
  const t = document.createElement("canvas");
  return t.width = e === "table" ? 244 : 732, t.height = e === "table" ? 340 : 1020, t;
}
async function $0(e, t, r, s) {
  if (e.custom)
    return await s?.beforePaint?.(), r.throwIfAborted(), e.custom.compose(t, r, e.layer ?? "face", e.etchThreshold);
  const n = s?.loadImages ?? Wr, a = v0(t);
  try {
    const l = a.getContext("2d", {
      willReadFrequently: !!s?.cpuPixels
    });
    if (!l) throw new Error("Card composition needs Canvas2D.");
    if (l.imageSmoothingEnabled = !0, l.imageSmoothingQuality = "high", l.scale(a.width / f, a.height / T), e.layer === "etching")
      return await w0(
        l,
        e.face,
        e.printingId,
        r,
        e.etchThreshold,
        s?.beforePaint,
        n,
        s?.resolveEtching
      ), a;
    l.fillStyle = "#090806", l.fillRect(0, 0, f, T);
    const o = e.currentStats?.power != null && e.currentStats.toughness != null ? ht(Q(e.face)).pt : null;
    if (e.printedImage) {
      const d = t === "inspect" ? k0(e.printedImage) : e.printedImage;
      o && await (s?.loadFonts ?? Xt)();
      const h = await n(o ? [d, o] : [d], r);
      try {
        const u = h.images.get(d);
        if (u && !r.aborted)
          return await s?.beforePaint?.(), r.throwIfAborted(), l.drawImage(u, 0, 0, f, T), Jt(
            l,
            e.emblems ?? [],
            e.currentStats,
            o ? h.images.get(o) : void 0,
            e.statusLayout === "inspect" || t === "inspect"
          ), Zt(l, e.face), a;
      } finally {
        h.dispose();
      }
    }
    await Promise.all([
      (s?.loadFonts ?? Xt)(),
      s0(e.face),
      we(e.face) ? (s?.loadRetroFont ?? Wa)() : Promise.resolve()
    ]), r.throwIfAborted();
    const i = await n(Pr(e.face), r);
    let c;
    try {
      return e.paintLayer !== "artwork" && (c = await $s(e.face, i.images, r)), await s?.beforePaint?.(), r.throwIfAborted(), Fr(
        l,
        e.face,
        c?.images ?? i.images,
        T,
        !1,
        s?.underArt,
        e.paintLayer
      ), Jt(
        l,
        e.emblems ?? [],
        e.currentStats,
        o ? i.images.get(o) : void 0,
        e.statusLayout === "inspect" || t === "inspect"
      ), Zt(l, e.face), a;
    } finally {
      c?.dispose(), i.dispose();
    }
  } catch (l) {
    throw a.width = a.height = 0, l;
  }
}
function Zt(e, t) {
  e.save(), e.setTransform(
    e.canvas.width / f,
    0,
    0,
    e.canvas.height / T,
    0,
    0
  ), e.globalCompositeOperation = "destination-in", e.globalAlpha = 1, e.shadowColor = "transparent", e.filter = "none", e.fillStyle = "#000", e.beginPath(), e.roundRect(0, 0, f, T, Us(t) * f), e.fill(), e.restore();
}
function Fr(e, t, r, s = T, n = !1, a, l) {
  if (t.frameAssetFamily) {
    r0(e, t, r, a, l);
    return;
  }
  if (we(t)) {
    Ea(e, t, r, a, l);
    return;
  }
  const o = Ge(t);
  if (o.length) {
    e.fillStyle = de(t.setCode, t.borderColor).border, e.fillRect(0, 0, f, T);
    for (const A of o)
      e.save(), Lr(e, A), Fr(
        e,
        A.face,
        r,
        A.height * f / A.width,
        !0,
        a,
        l
      ), e.restore();
    if (l === "artwork") return;
    Qt(e, t), St(t) && (e.font = '14px "CardRenderer MTG MPlantin", Georgia', e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      f / 2,
      T - 12,
      f * 0.9
    ));
    return;
  }
  const i = (A) => [
    A[0] * f,
    A[1] * s,
    A[2] * f,
    A[3] * s
  ];
  e.fillStyle = de(t.setCode, t.borderColor).border, e.fillRect(0, 0, f, s);
  const c = le(t), d = re(t);
  if (l === "artwork") {
    Ie(e, t, r, i(c.art), l);
    return;
  }
  const h = Q(t), u = ht(h, d), g = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[h.boxes] ?? "#827d72", w = (A, D, J = "top") => {
    const ve = r.get(A);
    if (!ve) return !1;
    const [je, Ke, Je, Ze] = i(D);
    e.save(), e.beginPath(), e.rect(je, Ke, Je, Ze), e.clip();
    const Rt = J === "stretch" ? Ze : ve.height * Je / ve.width;
    return e.drawImage(
      ve,
      je,
      J === "bottom" ? Ke + Ze - Rt : Ke,
      Je,
      Rt
    ), e.restore(), !0;
  }, [k, v, S, b] = i(h.legendary ? c.legendaryBackground : c.background);
  if (e.save(), e.beginPath(), e.roundRect(k, v, S, b, [
    { x: S * 0.01282, y: b * 962e-5 },
    { x: S * 0.01282, y: b * 962e-5 },
    { x: S * 0.06838, y: b * 0.05128 },
    { x: S * 0.06838, y: b * 0.05128 }
  ]), e.clip(), n) {
    const A = g.slice(1).match(/../g).map(
      (D, J) => Math.round(parseInt(D, 16) * 0.62 + [244, 236, 217][J] * 0.38)
    );
    e.fillStyle = `rgb(${A.join(",")})`, e.fillRect(k, v, S, b);
  }
  const p = r.get(u.background), y = d.startsWith("planeswalker");
  if (p && y ? Nt(e, p, k, v, S, d === "planeswalker-large") : p ? e.drawImage(
    p,
    k,
    v + (h.legendary ? W.legendaryBackgroundLift : 0),
    S,
    n ? b : p.height * S / p.width
  ) : (e.fillStyle = g, e.fillRect(k, v, S, b)), e.restore(), e.fillStyle = "#e3d8bb", !r.has(u.frame))
    if (d === "adventure")
      for (const A of Ve(t).filter((D) => D.kind === "rules" && !D.color))
        e.fillRect(A.x, A.y, A.width, A.height);
    else e.fillRect(...i(c.rules));
  r.has(u.boxes) || (e.fillRect(...i(c.title)), e.fillRect(...i(c.type))), e.fillStyle = "#80745c", y || e.fillRect(...i(c.art));
  const C = r.get(u.frame);
  if (C && d === "normal" && !n) {
    const A = Ys(t);
    qs(
      e,
      h,
      A,
      () => er(e, C, h.legendary, c.frame, !0, A)
    ), zs(e, h, A);
  }
  if (a && (e.save(), e.beginPath(), e.rect(0, 0, f, s), e.clip(), e.resetTransform(), e.drawImage(a, 0, 0, e.canvas.width, e.canvas.height), e.restore()), d === "normal" && !n) {
    const [A, D, J, ve] = i(c.art), je = Oe.artRim;
    e.fillStyle = "#090806", e.fillRect(A - je, D, J + 2 * je, ve);
  }
  if (Ie(e, t, r, i(c.art), l), y && Ja(e, t), C && y) {
    const [A, D, J] = i(c.frame);
    Nt(e, C, A, D, J, d === "planeswalker-large");
  } else C && d !== "normal" && er(e, C, h.legendary, c.frame);
  if (h.legendary && w(u.crown, c.crown), n) {
    const A = r.get(u.boxes);
    if (A) {
      const J = A.height * 0.104;
      e.drawImage(A, 0, 0, A.width, J, ...i(c.title)), e.drawImage(A, 0, A.height - J, A.width, J, ...i(c.type));
    }
    const D = r.get(u.frame);
    e.fillStyle = "#e3d8bb", e.fillRect(...i(c.rules)), D && e.drawImage(
      D,
      D.width * 0.035,
      D.height * 0.675,
      D.width * 0.93,
      D.height * 0.325,
      ...i(c.rules)
    );
  } else {
    const A = y && ["Colourless", "Artifact", "Land"].includes(h.boxes);
    w(u.boxes, c.title), A && (e.save(), e.globalAlpha *= Ar, w(u.boxes, c.title), e.restore());
    const D = r.get(u.boxes);
    y && D ? e0(e, D, c.type, A) : (w(u.boxes, c.type, "bottom"), d === "normal" && D && (a0(e, D, i(c.type)), n0(e, i(c.type), h.boxes)));
  }
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left";
  const [L, O, R, M] = i(c.title), B = L + W.plateLeft + (d === "normal" ? 1 : 0), P = Na(t), j = t.manaSymbols ?? [], $ = W.manaSize * P, E = j.length * $ + Math.max(0, j.length - 1) * W.manaGap, H = L + R - W.plateRight, X = H - E, I = (d === "normal" && !n ? W.normalTitleFont : W.titleFont) * P;
  e.font = `bold ${I}px "CardRenderer MTG Beleren", Georgia`, e.letterSpacing = `${W.titleTracking}px`, _e(
    e,
    t.name,
    B,
    O + M / 2 + (d === "normal" ? 1 : 0),
    X - B - (j.length ? W.titleGap : 0),
    I,
    !0
  ), e.letterSpacing = "0px", j.forEach(
    (A, D) => ne(
      e,
      A,
      X + D * ($ + W.manaGap),
      O + M / 2 - $ / 2 + W.manaLift / 2,
      $,
      r,
      !0
    )
  );
  const _ = Me(t), G = r.get(_ ?? ""), Z = Ee(_), V = nr(t), Se = Or(t), ke = ur(t), ie = Se && d === "normal", q = ie ? t0 : 1, x = W.setMargin + (ie ? 2 : 0), [, F, , U] = i(c.type), ee = F + U / 2 + W.typeLift / 2 + (d === "normal" || y ? 2 : 0), K = G ? Math.min(
    W.setMaxWidth,
    W.setHeight * G.width * V[2] / (G.height * V[3])
  ) : 0, oe = G ? Math.min(
    K / (G.width * V[2]),
    W.setHeight / (G.height * V[3])
  ) : 0, ge = [
    H - x - K - K * (q - 1) / 2 + (y ? 1.5 : 0),
    ee - (G?.height ?? 0) * V[3] * oe * q / 2 - (ie ? 1 : 0),
    (G?.width ?? 0) * V[2] * oe * q,
    (G?.height ?? 0) * V[3] * oe * q
  ], z = d === "normal" && !n ? ft(t, _, ge, "component") : ge, Ur = Math.max(
    1,
    Math.min(
      H - B - (G ? K * (1 + (q - 1) / 2) + x + W.typeGap : 0),
      G && z !== ge ? z[0] - B - W.typeGap : 1 / 0
    )
  );
  e.font = `${W.typeFont * P}px "CardRenderer MTG Beleren", Georgia`, _e(
    e,
    t.typeLine ?? "",
    B + (y ? 1.5 : 0),
    ee,
    Ur,
    W.typeFont * P,
    !1,
    d === "normal" && !n ? Oe.typeWidthScale : 1
  ), G && (Z || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(G, ...z), e.restore()) : Se ? Ir(
    e,
    G,
    t.rarity,
    ...z,
    V,
    ie ? 1.5 : 1
  ) : ke ? mr(
    e,
    G,
    ke,
    t.rarity,
    ...z,
    V,
    d === "normal"
  ) : wt(e, G, t.setCode, t.rarity, ...z, V)), Mr(t) ? Ua(e, t, r) : d !== "normal" ? Qa(e, t, r) : Xe(e, Cr(e, t, s, P), r);
  const Ct = Qr(t);
  if (Ct && d !== "leveler") {
    w(u.pt, c.stats, "stretch");
    const [A, D, J] = i(c.stats);
    e.fillStyle = d.startsWith("planeswalker") ? "white" : "#17140f", e.font = `bold ${W.statsFont}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      Ct.text,
      A + J / 2,
      D + (d.startsWith("planeswalker") ? c.stats[3] * T / 2 : W.statsLine / 2 + (d === "normal" ? 2 : 0)),
      J
    );
  }
  n || Qt(e, t);
}
function Qt(e, t) {
  const [r, s, n, a] = _r(N.footer), l = s + W.footerLine;
  e.save(), e.beginPath(), e.rect(r, s, n, a), e.clip(), e.textAlign = "left", e.textBaseline = "top", e.fillStyle = de(t.setCode, t.borderColor).ink, e.font = `${W.footerFont}px "CardRenderer MTG Relay", sans-serif`, e.letterSpacing = `${W.footerTracking}px`;
  const o = t.setCode?.trim().toUpperCase() ?? "";
  e.fillText(o, r, l);
  let i = r + e.measureText(o).width;
  e.letterSpacing = "0px", t.artist && (i += W.artistMarginLeft, e.font = `${W.footerFont}px "CardRenderer MTG Artist Credit", sans-serif`, e.fillText("a", i, l), i += e.measureText("a").width + W.artistMarginRight, e.font = `${W.footerFont * 1.154}px "CardRenderer MTG Beleren", Georgia`, e.fillText(t.artist, i, l)), e.restore();
}
function er(e, t, r, s = N.frame, n = !1, a = 0) {
  const [l, o, i, c] = _r(s), d = a, h = l + d, u = i - 2 * d, m = Math.min(t.height, c * t.width / i), g = m * i / t.width, w = e.getTransform().a, k = () => {
    if (!n) {
      e.drawImage(t, 0, 0, t.width, m, h, o, u, g);
      return;
    }
    const v = 424, S = 436;
    e.save(), e.beginPath(), e.rect(0, 0, f, v), e.rect(0, S, f, T - S), e.clip(), e.drawImage(t, 0, 0, t.width, m, h, o, u, g), e.restore(), e.save(), e.beginPath(), e.rect(0, v, f, S - v), e.clip(), e.drawImage(t, 0, 0, t.width, m, h, o - 1, u, g), e.restore();
  };
  e.save(), e.shadowColor = "black", e.shadowOffsetX = -394e-5 * f * w, e.shadowOffsetY = 394e-5 * f * w, e.shadowBlur = 236e-5 * f * w, k(), r || (e.shadowColor = "#ffffffa0", e.shadowOffsetX = 157e-5 * f * w, e.shadowOffsetY = -315e-5 * f * w, e.shadowBlur = 157e-5 * f * w, k()), e.restore();
}
function _r(e) {
  return [e[0] * f, e[1] * T, e[2] * f, e[3] * T];
}
export {
  v0 as $,
  es as A,
  T as B,
  Pa as C,
  b0 as D,
  ts as E,
  N as F,
  C0 as G,
  f as H,
  ws as I,
  Le as J,
  bs as K,
  hs as L,
  vs as M,
  Ue as N,
  Pr as O,
  y0 as P,
  de as Q,
  Te as R,
  te as S,
  ha as T,
  p0 as U,
  j0 as V,
  as as W,
  Fa as X,
  Ve as Y,
  _a as Z,
  I0 as _,
  Us as a,
  Ye as a$,
  rs as a0,
  Qr as a1,
  m0 as a2,
  pt as a3,
  ca as a4,
  Mr as a5,
  Fe as a6,
  E0 as a7,
  ue as a8,
  Xt as a9,
  mt as aA,
  he as aB,
  ir as aC,
  ze as aD,
  ye as aE,
  Ss as aF,
  or as aG,
  Bt as aH,
  se as aI,
  T0 as aJ,
  cr as aK,
  jt as aL,
  Sa as aM,
  jr as aN,
  ss as aO,
  it as aP,
  R0 as aQ,
  bt as aR,
  Br as aS,
  nr as aT,
  gs as aU,
  f0 as aV,
  Ka as aW,
  da as aX,
  qe as aY,
  St as aZ,
  Na as a_,
  Wr as aa,
  Wa as ab,
  Va as ac,
  ns as ad,
  Cr as ae,
  S0 as af,
  Fr as ag,
  Jt as ah,
  w0 as ai,
  Ua as aj,
  _e as ak,
  Ie as al,
  ne as am,
  Ja as an,
  Ea as ao,
  br as ap,
  Xe as aq,
  wt as ar,
  Qa as as,
  A0 as at,
  Lr as au,
  _r as av,
  Xa as aw,
  M0 as ax,
  me as ay,
  Cs as az,
  Me as b,
  Rr as b0,
  $0 as c,
  G0 as d,
  O0 as e,
  le as f,
  L0 as g,
  g0 as h,
  u0 as i,
  W as j,
  re as k,
  we as l,
  He as m,
  ht as n,
  Q as o,
  Ut as p,
  ae as q,
  h0 as r,
  Ge as s,
  ut as t,
  ps as u,
  Pe as v,
  B0 as w,
  ar as x,
  Gs as y,
  Es as z
};
