const $r = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", Ir = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", Ur = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Pr = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", xr = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", be = {
  RENDERER_COMPONENT_ROOT: $r,
  KEYRUNE_ROOT: Ir,
  CONJURER_ROOT: Ur,
  RETRO_ROOT: Pr,
  RETRO_SYMBOL_FONT: xr
}, Fr = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), _r = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function Kt(e) {
  return Fr.has(e?.trim().toLowerCase() ?? "");
}
function Nr(e) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(e?.toLowerCase() ?? "") ? 0 : 1;
}
function Yr(e, t) {
  const r = e?.trim().toLowerCase() ?? "";
  return _r.has(r) || r === "atq" && t === "Reconstruction";
}
const qr = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function Vt(e) {
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
function lt(e) {
  if (e.wordingMode === "oracle" || !["mir", "tmp"].includes(e.setCode?.toLowerCase() ?? "")) return null;
  const t = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    e.typeLine ?? ""
  )?.[1];
  if (!t) return null;
  const r = qr[t];
  return Vt(e) !== r ? null : {
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
function Hr(e) {
  return e.power != null && e.toughness != null ? {
    text: `${e.power}/${e.toughness}`,
    label: `Power ${e.power}, toughness ${e.toughness}`
  } : e.loyalty != null && e.loyalty !== "" ? { text: String(e.loyalty), label: `Starting loyalty ${e.loyalty}` } : null;
}
const b = 488, j = 680, zr = 0.058;
function ue(e, t) {
  if (t === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (t ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    e?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const Xr = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", N = {
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
  stamp: [0.34, 0.76 - 0.16 * b / j, 0.32, 0.32 * b / j]
}, E = {
  titleFont: 24,
  normalTitleFont: 26,
  titleTracking: 54e-5 * b,
  titleGap: 0.02362 * b,
  plateLeft: 0.02362 * b,
  plateRight: 0.01575 * b,
  manaSize: 0.03556 * 1.35 * b,
  manaGap: 378e-5 * b,
  manaLift: -63e-4 * b,
  typeFont: 0.044 * b,
  typeGap: 945e-5 * b,
  typeLift: -315e-5 * b,
  setHeight: 0.06142 * b,
  setMaxWidth: 0.11024 * b,
  setMargin: 472e-5 * b,
  rulesPaddingX: 0.01575 * b,
  rulesPaddingY: 0.02362 * b,
  normalRulesFont: 0.04444 * b,
  longRulesFont: 0.0381 * b,
  denseRulesFont: 0.0328 * b,
  paragraphGap: 787e-5 * b,
  statsFont: 0.05333 * b,
  statsLine: 0.08661 * b,
  footerFont: 0.02167 * b,
  footerLine: 0.02126 * b,
  footerTracking: 362e-5 * b,
  artistMarginLeft: 7e-3 * b,
  artistMarginRight: 35e-4 * b,
  legendaryBackgroundLift: -0.02047 * b
}, yt = (e) => e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
function Kr(e = N) {
  return {
    ...Object.fromEntries(
      Object.entries(e).flatMap(
        ([t, r]) => r.map((s, a) => [
          `--face-${yt(t)}-${["x", "y", "w", "h"][a]}`,
          `${s * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(E).map(([t, r]) => [
        `--face-${yt(t)}`,
        `${r / b * 100}cqw`
      ])
    )
  };
}
const ma = Kr();
function Vr(e) {
  return e.length > 340 ? "dense" : e.length > 210 ? "long" : "normal";
}
function ga(e) {
  return {
    dense: E.denseRulesFont,
    long: E.longRulesFont,
    normal: E.normalRulesFont
  }[Vr(e)];
}
function Ne(e) {
  return e.split(/(\{[^}\n]+\})/g).filter(Boolean).map((t) => ({
    value: t,
    symbol: /^\{[^}\n]+\}$/.test(t) ? t.slice(1, -1) : null
  }));
}
function Jr(e) {
  const t = e.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[t] ?? t.slice(0, 3);
}
const Ze = "WUBRG";
function V(e) {
  const t = e.typeLine ?? "", r = e.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(t), s = e.land ?? /(^|\s)Land(?:\s|$)/i.test(t), a = !/\bPlaneswalker\b/i.test(t) && (e.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(t)), n = e.creature ?? /(^|\s)Creature(?:\s|$)/i.test(t), l = pe(e), o = l.length === 0 ? "Colourless" : l.length > 2 ? "Gold" : l.join(""), i = (r || s) && l.length === 0 ? "Artifact" : o, c = s ? "Land" : r ? "Artifact" : l.length > 1 ? "Gold" : o;
  return {
    frame: i,
    boxes: c,
    background: c,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: s && l.length > 0 ? o : r && l.length > 0 ? l.length > 1 ? "Gold" : o : c,
    pt: c,
    artifact: r,
    land: s,
    legendary: a,
    creature: n,
    className: `rendered-card-profile-${c.toLocaleLowerCase()}`
  };
}
function pe(e) {
  return Zr(e.frameColors ?? e.colors ?? []);
}
function Zr(e) {
  return [
    ...new Set(
      e.map((t) => t.toLocaleUpperCase()).filter((t) => Ze.includes(t))
    )
  ].sort((t, r) => Ze.indexOf(t) - Ze.indexOf(r));
}
const Qr = { "10e": "cmrsu", "2ed": "cmrsu", "2x2": "cmrsu", "2xm": "cmrsu", "30a": "cmrsu", "3ed": "cmrsu", "40k": "cmrsu", "4ed": "cmrsu", "5dn": "cmrsu", "5ed": "cmrsu", "6ed": "cmrsu", "7ed": "cmrsu", "8ed": "cmrsu", "9ed": "cmrsu", a25: "cmrsu", acr: "cmrsu", aer: "cmrsu", afc: "cmrsu", afr: "cmrsu", akh: "cmrsu", akr: "cmrsu", ala: "cmrsu", all: "cmrsu", ana: "cmrsu", apc: "cmrsu", arb: "cmrsu", arc: "cmrsu", archie: "cmrsu", arena: "cmrsu", arn: "cmrsu", ath: "cmrsu", atq: "cmrsu", avr: "cmrsu", azorius: "cmru", bbd: "cmrsu", bfz: "cmrsu", big: "cmrsu", blb: "cmrsu", blc: "cmrsu", bng: "cmrsu", bok: "cmrsu", boros: "cmru", bot: "cmrsu", brb: "cmrsu", brc: "cmrsu", bro: "cmrsu", brr: "cmrsu", btd: "cmrsu", c13: "cmrsu", c14: "cmrsu", c15: "cmrsu", c16: "cmrsu", c17: "cmrsu", c18: "cmrsu", c19: "cmrsu", c20: "cmrsu", c21: "cmrsu", cc1: "cmrsu", cc2: "cmrsu", ced: "cmrsu", cei: "cmrsu", chk: "cmrsu", chr: "cmrsu", clb: "cmrsu", clu: "cmrsu", cm1: "cmrsu", cm2: "cmrsu", cma: "cmrsu", cmd: "cmrsu", cmm: "cmrsu", cmr: "cmrsu", cn2: "cmrsu", cns: "cmrsu", con: "cmrsu", conf: "cmrsu", csp: "cmrsu", dci: "cmrsu", dd1: "cmrsu", dd2: "cmrsu", ddc: "cmrsu", ddd: "cmrsu", dde: "cmrsu", ddf: "cmrsu", ddg: "cmrsu", ddh: "cmrsu", ddi: "cmrsu", ddj: "cmrsu", ddk: "cmrsu", ddl: "cmrsu", ddm: "cmrsu", ddn: "cmrsu", ddo: "cmrsu", ddp: "cmrsu", ddq: "cmrsu", ddr: "cmrsu", dds: "cmrsu", ddt: "cmrsu", ddu: "cmrsu", default: "cmrsu", dft: "cmrsu", dgm: "cmrsu", dimir: "cmru", dis: "cmrsu", dka: "cmrsu", dkm: "cmrsu", dmc: "cmrsu", dmr: "cmrsu", dmu: "cmrsu", dom: "cmrsu", dpa: "cmrsu", drb: "cmrsu", drc: "cmrsu", drk: "cmrsu", dsc: "cmrsu", dsk: "cmrsu", dst: "cmrsu", dtk: "cmrsu", e01: "cmrsu", e02: "cmrsu", ecc: "cmrsu", ecl: "cmrsu", eld: "cmrsu", ema: "cmrsu", emn: "cmrsu", eoc: "cmrsu", eoe: "cmrsu", eos: "cmru", eve: "cmrsu", exo: "cmrsu", exp: "cmrsu", fca: "cmrsu", fdc: "cmrsu", fdn: "cmrsu", fem: "cmrsu", fic: "cmrsu", fin: "cmrsu", fnm: "r", fra: "cmrsu", frc: "cmrsu", frf: "cmrsu", fut: "cmrsu", gn2: "cmrsu", gn3: "cmrsu", gnt: "cmrsu", golgari: "cmru", gpt: "cmrsu", grn: "cmrsu", gruul: "cmru", gs1: "cmrsu", gtc: "cmrsu", h09: "cmrsu", h17: "cmrsu", ha1: "cmrsu", hbg: "cmrsu", hml: "cmrsu", hob: "cmrsu", hoc: "cmrsu", hop: "cmrsu", hou: "cmrsu", ice: "cmrsu", idw: "cmrsu", iko: "cmrsu", ima: "cmrsu", inr: "cmrsu", inv: "cmrsu", isd: "cmrsu", izzet: "cmru", j20: "cmrsu", j21: "cmrsu", j22: "cmrsu", j25: "cmru", jmp: "cmrsu", jou: "cmrsu", jud: "cmrsu", khc: "cmrsu", khm: "cmrsu", kld: "cmrsu", klr: "cmrsu", ktk: "cmrsu", lcc: "cmrsu", lci: "cmrsu", lea: "cmrsu", leb: "cmrsu", leg: "cmrsu", lgn: "cmrsu", lrw: "cmrsu", ltc: "cmrsu", ltr: "cmrsu", m10: "cmrsu", m11: "cmrsu", m12: "cmrsu", m13: "cmrsu", m14: "cmrsu", m15: "cmrsu", m19: "cmrsu", m20: "cmrsu", m21: "cmrsu", m3c: "cmrsu", mat: "cmrsu", mb2: "cmrsu", mbc: "cmrsu", mbs: "cmrsu", mc3: "cmrsu", md1: "cmrsu", me1: "cmrsu", me2: "cmrsu", me3: "cmrsu", me4: "cmrsu", med: "cmrsu", mh1: "cmrsu", mh2: "cmrsu", mh3: "cmrsu", mic: "cmrsu", mid: "cmrsu", mir: "cmrsu", mkc: "cmrsu", mkm: "cmrsu", mm2: "cmrsu", mm3: "cmrsu", mma: "cmrsu", mmq: "cmrsu", moc: "cmrsu", mom: "cmrsu", mor: "cmrsu", mp2: "cmrsu", mps: "cmrsu", mrd: "cmrsu", msc: "cmrsu", msh: "cmrsu", mtga: "cmrsu", mtgo: "cmrsu", mul: "cmrsu", ncc: "cmrsu", nec: "cmrsu", nem: "cmrsu", neo: "cmrsu", nph: "cmrsu", ody: "cmrsu", ogw: "cmrsu", om1: "cmrsu", omb: "cmrsu", onc: "cmrsu", one: "cmrsu", ons: "cmrsu", ori: "cmrsu", orzhov: "cmru", otc: "cmrsu", otj: "cmrsu", otp: "cmrsu", p02: "cmrsu", papac: "cmrsu", parl2: "cmrsu", past: "cmrsu", pbook: "cmrsu", pc2: "cmrsu", pca: "cmrsu", pcy: "cmrsu", pd2: "cmrsu", pd3: "cmrsu", pdrc: "c", peuro: "cmrsu", pgru: "c", phpr: "cmrsu", phuk: "cmrsu", pidw: "cmrsu", pio: "cmrsu", pip: "cmrsu", planeswalker: "cmrsu", plc: "cmrsu", pls: "cmrsu", pmps: "cmrsu", por: "cmrsu", prm: "cmrsu", ps11: "cmrsu", psal: "cmrsu", psdg: "cmrsu", psum: "cmrsu", ptg: "cmrsu", ptk: "cmrsu", pvan: "c", pxbox: "cmrsu", pz1: "cmrsu", pz2: "cmrsu", pza: "cmrsu", rav: "cmrsu", ren: "cmrsu", rex: "cmrsu", rin: "cmrsu", rix: "cmrsu", rna: "cmrsu", roe: "cmrsu", rtr: "cmrsu", rvr: "cmrsu", s00: "cmrsu", s99: "cmrsu", scd: "cmrsu", scg: "cmrsu", sds: "cmrsu", selesnya: "cmru", shm: "cmrsu", simic: "cmru", sir: "cmrsu", sis: "cmrsu", sld: "cmrsu", snc: "cmrsu", soa: "cmrsu", soc: "cmrsu", soi: "cmrsu", sok: "cmrsu", som: "cmrsu", sos: "cmrsu", spe: "cmrsu", spg: "cmrsu", spm: "cmrsu", ss1: "cmrsu", ss2: "cmrsu", ss3: "cmrsu", sta: "cmrsu", star: "cmrsu", sth: "cmrsu", stx: "cmrsu", td0: "cmrsu", td2: "cmrsu", tdc: "cmrsu", tdm: "cmrsu", thb: "cmrsu", ths: "cmrsu", tla: "cmrsu", tle: "cmrsu", tlr: "c", tmc: "cmrsu", tmp: "cmrsu", tmt: "cmrsu", tor: "cmrsu", tpr: "cmrsu", trc: "cmrsu", trk: "cmrsu", tsp: "cmrsu", tsr: "cmrsu", uds: "cmrsu", ugl: "cmrsu", ulg: "cmrsu", uma: "cmrsu", und: "cmrsu", unf: "cmrsu", unh: "cmrsu", usg: "cmrsu", ust: "cmrsu", v09: "cmrsu", v10: "cmrsu", v11: "cmrsu", v12: "cmrsu", v13: "cmrsu", v14: "cmrsu", v15: "cmrsu", v16: "cmrsu", v17: "cmrsu", van: "cmrsu", vis: "cmrsu", vma: "cmrsu", voc: "cmrsu", vow: "cmrsu", w16: "cmrsu", w17: "cmrsu", war: "cmrsu", who: "cmrsu", woc: "cmrsu", woe: "cmrsu", wor: "u", wot: "cmrsu", wth: "cmrsu", wwk: "cmrsu", x2ps: "cmrsu", xln: "cmrsu", y22: "cmrsu", y23: "cmrsu", y24: "cmrsu", y25: "cmrsu", y26: "cmrsu", zen: "cmrsu", znc: "cmrsu", zne: "cmrsu", znr: "cmrsu" }, es = {
  codes: Qr
}, ge = be.CONJURER_ROOT, Jt = `${ge}/img/setSymbols/official/`, vt = es.codes, ts = {
  common: "c",
  uncommon: "u",
  rare: "r",
  mythic: "m",
  special: "s",
  bonus: "s"
};
function Zt(e, t = "common", r = "auto") {
  const s = e.trim().toLowerCase();
  if (r === "keyrune") return null;
  const a = Kt(s) ? "c" : ts[t];
  return a && Object.hasOwn(vt, s) && vt[s].includes(a) ? `${Jt}${s}-${a}.svg` : null;
}
function Oe(e) {
  return !!e?.startsWith(Jt);
}
const rs = be.KEYRUNE_ROOT, ss = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function Qt(e) {
  return !e.setSymbol && !Zt(e.setCode ?? "", e.rarity, e.setSymbolSource) ? ss[e.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1] : [0, 0, 1, 1];
}
const er = new Set(
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
er.add("con_");
const as = "GLINT", Ue = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function ns(e) {
  const t = Ue[e] ?? Ue.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${t}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function ls(e) {
  const t = Ue[e] ?? Ue.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${t}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function os(e, t = "common", r) {
  const s = e.trim().toLowerCase();
  if (s === "forge") return ls(t);
  if (s === as.toLowerCase()) return ns(t);
  const a = Zt(s, t, r);
  if (a) return a;
  const n = s === "con" ? "con_" : s === "p02" ? "po2" : s;
  return er.has(n) ? `${rs}/${n}.svg` : null;
}
const Rt = {
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
function is(e) {
  return Object.hasOwn(Rt, e) ? Rt[e] : null;
}
const Re = be.RENDERER_COMPONENT_ROOT;
function ot(e, t = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(t), s = t === "saga" ? "saga" : t === "planeswalker-large" ? "planeswalker_large" : t, a = ["saga", "class"].includes(t) && e.boxes === "Colourless" ? "Land" : t.startsWith("planeswalker") && e.boxes === "Artifact" ? "Colourless" : e.boxes;
  return {
    background: Q(
      r ? "bg" : t === "class" ? "saga_bg" : `${s}_bg`,
      t.startsWith("planeswalker") && a === "Land" ? "Colourless" : a
    ),
    frame: Q(
      ["normal", "leveler"].includes(t) ? "frames" : `${s}_frames`,
      t === "adventure" ? "WUBRG".includes(e.frame) ? e.frame : "W" : t === "class" ? e.frame === "WU" ? "UW" : e.frame.length === 2 ? "Gold" : e.frame : t === "saga" && e.frame === "Colourless" ? "Land" : t.startsWith("planeswalker") && ["Artifact", "Land"].includes(e.frame) ? "Colourless" : e.frame
    ),
    boxes: Q(t.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", a),
    nameplate: Q("nameplates", e.boxes),
    crown: Q("legendary-crowns", e.crown),
    pt: t.startsWith("planeswalker") ? Q("planeswalker", "Loyalty") : Q("pt-boxes", e.pt)
  };
}
function Ye(e) {
  const t = e.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = t === "∞" ? "INFINITY" : t === "½" ? "HALF" : t.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? Q("symbols", r) : null;
}
function cs(e, t, r) {
  return os(e, t, r);
}
function Q(e, t) {
  const r = e === "legendary-crowns" ? "legendary_crowns" : e === "pt-boxes" ? "pt_boxes" : e === "nameplates" ? "boxes" : e, s = e === "symbols" ? "svg" : "webp";
  return `${Re}/img/${r}/${encodeURIComponent(t)}.${s}`;
}
function Ce(e, t = e.rarity) {
  const r = e.setCode?.trim().toLowerCase() ?? "";
  return e.setSymbol ?? cs(
    r === "chr" ? is(e.name) ?? "" : r,
    t,
    e.setSymbolSource
  );
}
function tt(e) {
  const t = [
    e.rulesText ?? "",
    ...(e.rulesParagraphs ?? []).flatMap((s) => s.runs.map((a) => a.text))
  ];
  return [.../* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...t.flatMap(
      (s) => Ne(s).flatMap((a) => a.symbol ? [a.symbol] : [])
    )
  ])].map(Ye);
}
const us = be.RETRO_SYMBOL_FONT, Me = be.RETRO_ROOT, hs = `${Me}/fonts/goudy-medieval.ttf`, ds = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), ms = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function fe(e) {
  return e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") ? !1 : e.frameStyle === "retro" || e.frameStyle !== "modern" && ds.has(e.setCode?.toLowerCase() ?? "");
}
function qe(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function ne(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return qe(e) ? "abu" : t === "leg" && pe(e).length > 1 ? "legends" : ["3ed", "4ed", "5ed", "atq"].includes(t) && !/\bLand\b/.test(e.typeLine ?? "") ? "fourth" : "seventh";
}
function tr(e) {
  return ne(e) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1];
}
function it(e) {
  const t = qe(e);
  return {
    ...N,
    frame: tr(e),
    title: [t ? 0.07 : 0.1134, 0.0481, t ? 0.8467 : 0.8, 0.043],
    art: ne(e) === "legends" ? [0.112, 0.094, 0.78, 0.45] : ne(e) === "fourth" ? [0.114, 0.098, 0.772, 0.445] : t ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429],
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: [0.8074, 0.895, 0.1367, 0.043],
    footer: [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function Te(e) {
  const t = pe(e), r = e.typeLine ?? "", s = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([o]) => r.includes(o)), a = /\bLand\b/.test(r) ? s.length === 1 ? s[0][1] + "l" : "l" : /\bArtifact\b/.test(r) ? "a" : t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "c", n = ne(e), l = n === "seventh" || a === "c" || n === "abu" && a === "m" ? "seventh/regular" : `old/${n}`;
  return `${Me}/img/frames/${l}/${n === "legends" ? "legendsFrameM" : a}.png`;
}
function ce(e) {
  return e.borderColor ?? (ms.has(e.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function Ct(e) {
  return ce(e) === "silver" ? ue(null, "silver").border : ce(e) === "white" ? bs : "#080808";
}
function rr(e) {
  return ne(e) === "fourth" ? `${Me}/img/frames/old/fourth/borderBlack.png` : `${Me}/img/frames/${qe(e) ? "old/abu" : "seventh/regular"}/border.svg`;
}
function Mt(e) {
  return qe(e) ? "#ababab" : "#f2eee3";
}
function gs(e) {
  return e.setCode?.toLowerCase() === "7ed" && pe(e).some((t) => t === "W" || t === "G") && !/Land/.test(e.typeLine ?? "") ? "saturate(.7) brightness(.88)" : "none";
}
function ct(e) {
  if (lt(e)) return null;
  const t = Vt(e);
  return t ? `${Me}/img/frames/m15/basics/${t.toLowerCase()}.png` : null;
}
const bs = "#eeedeb";
function sr(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return !e.setSymbol && t === "ice" && e.setSymbolSource === "keyrune" ? `${be.KEYRUNE_ROOT}/ice2.svg` : !e.setSymbol && Yr(t, e.name) ? null : Ce(e);
}
function ba(e) {
  const t = (e.rulesText ?? "").length;
  return t > 340 ? 16 : t > 210 ? 19 : 23;
}
function ps(e) {
  return [
    ct(e),
    Te(e),
    ce(e) !== "black" || ne(e) === "fourth" ? rr(e) : null,
    e.illustration,
    sr(e),
    ...tt(e)
  ];
}
const ae = ([e, t, r, s]) => [
  e * b,
  t * j,
  r * b,
  s * j
];
function pa(e, t) {
  return ["7ed", "8ed", "9ed"].includes(e?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(t ?? "") ? "black" : void 0;
}
function rt([e, t, r]) {
  const s = Math.max(e, t, r), a = s - Math.min(e, t, r);
  return [((a === 0 ? 0 : s === e ? (t - r) / a : s === t ? (r - e) / a + 2 : (e - t) / a + 4) * 60 % 360 + 360) % 360, s === 0 ? 0 : a / s, s];
}
function fs(e, t, r) {
  const s = (e % 360 + 360) % 360 / 60, a = r * t, n = a * (1 - Math.abs(s % 2 - 1)), l = r - a, o = s < 1 ? [a, n, 0] : s < 2 ? [n, a, 0] : s < 3 ? [0, a, n] : s < 4 ? [0, n, a] : s < 5 ? [n, 0, a] : [a, 0, n];
  return [o[0] + l, o[1] + l, o[2] + l];
}
function ws(e, t) {
  const [r, s, a] = rt(e);
  return fs(
    r + t.hueDegrees,
    Math.min(1, s * t.saturationScale),
    Math.min(1, a * t.brightnessScale)
  );
}
const ks = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, Ss = "#9aa4ae", ys = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
class vs {
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
    const r = new Set(t.map((a) => a.key)), s = t.reduce((a, n) => {
      const l = this.entries.get(n.key);
      if (l && l.bytes !== n.bytes)
        throw Error("Material cache key has inconsistent dimensions");
      return a + (l ? 0 : n.bytes);
    }, 0);
    for (const [a, n] of this.entries) {
      if (this.bytes + s <= this.limit) break;
      n.users || r.has(a) || (this.entries.delete(a), n.retired = !0, this.destroy(n), this.evictions++);
    }
    if (!(this.bytes + s > this.limit))
      return this.bytes += s, this.peakBytes = Math.max(this.peakBytes, this.bytes), t.map((a) => {
        let n = this.entries.get(a.key);
        if (n)
          this.hits++, this.entries.delete(a.key), this.entries.set(a.key, n);
        else {
          const l = {
            users: 0,
            bytes: a.bytes,
            accounted: !0,
            retired: !1,
            promise: Promise.resolve().then(async () => {
              this.builds++;
              const o = await a.build();
              if (o.width * o.height * 4 !== a.bytes)
                throw o.close(), Error("Derived bitmap dimensions differ from its cache reservation");
              return l.bitmap = o, o;
            })
          };
          l.promise = l.promise.catch((o) => {
            throw this.entries.get(a.key) === l && this.entries.delete(a.key), l.retired = !0, this.destroy(l), this.notify(), o;
          }), this.entries.set(a.key, l), n = l;
        }
        return n.users++, n;
      });
  }
  notify() {
    for (const t of [...this.waiting]) t();
  }
  wait(t) {
    return t.throwIfAborted(), new Promise((r, s) => {
      const a = () => {
        this.waiting.delete(n), t.removeEventListener("abort", l);
      }, n = () => {
        a(), r();
      }, l = () => {
        a(), s(t.reason);
      };
      this.waiting.add(n), t.addEventListener("abort", l, { once: !0 });
    });
  }
  async acquire(t, r, s, a) {
    return (await this.acquireMany([{ key: t, bytes: r, build: s }], a))[0];
  }
  /** Admit a complete face atomically. Per-component waiting could deadlock two
   * faces that each hold half their required components while awaiting the rest. */
  async acquireMany(t, r) {
    if (r.throwIfAborted(), new Set(t.map((n) => n.key)).size !== t.length)
      throw Error("Duplicate key in material batch");
    if (t.some((n) => !Number.isSafeInteger(n.bytes) || n.bytes < 1) || t.reduce((n, l) => n + l.bytes, 0) > this.limit)
      throw RangeError("Material batch exceeds derived-image budget");
    let s;
    for (; !(s = this.admit(t)); )
      await this.wait(r), r.throwIfAborted();
    const a = s.map((n) => {
      let l = !1;
      return () => {
        l || (l = !0, n.users--, n.retired && !n.users && this.destroy(n), this.notify());
      };
    });
    try {
      const l = (await Promise.allSettled(s.map((o) => o.promise))).find((o) => o.status === "rejected");
      if (l?.status === "rejected") throw l.reason;
      return r.throwIfAborted(), s.map((o, i) => ({ value: o.bitmap, release: a[i] }));
    } catch (n) {
      for (const l of a) l();
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
const ar = new vs(16 * 1024 * 1024), fa = () => ar.clear(), Rs = {
  "lea-U": {
    hueDegrees: -9,
    saturationScale: 0.771875,
    brightnessScale: 0.875625
  },
  "lea-R": {
    hueDegrees: 0,
    saturationScale: 0.8162499999999997,
    brightnessScale: 1.0362500000000001
  },
  "lea-A": {
    hueDegrees: 8.11021505376334,
    saturationScale: 0.6613943730231613,
    brightnessScale: 0.9892060810810812
  },
  "2ed-R": {
    hueDegrees: 6.235396864803533,
    saturationScale: 0.8637582236842104,
    brightnessScale: 1.1312325783972126
  },
  "3ed-W": {
    hueDegrees: 14.9375,
    saturationScale: 0.7987844036697247,
    brightnessScale: 0.997227422907489
  },
  "3ed-R": {
    hueDegrees: -7.999044433827066,
    saturationScale: 0.6950243966156542,
    brightnessScale: 0.8124043062200956
  }
}, Cs = {
  "lea-U": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png",
  "lea-R": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",
  "lea-A": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png",
  "2ed-R": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",
  "3ed-W": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",
  "3ed-R": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png"
}, Ms = {
  "lea-U": [0, 0, 1, 1],
  "lea-R": [0, 0, 1, 1],
  "lea-A": [0, 0, 1, 1],
  "2ed-R": [0, 0, 1, 1],
  "3ed-W": [0.012, 0.01, 0.974, 0.982],
  "3ed-R": [0.012, 0.01, 0.974, 0.982]
}, Ts = {
  "lea-N": [0.644563725490196, 0.6389796338089692, 0.6333955421277422],
  "lea-W": [0.8652034313725488, 0.8539087254901959, 0.8143772549019607],
  "lea-U": [0.6401960784313725, 0.7372549019607844, 0.7764705882352941],
  "lea-B": [0.5149019607843137, 0.4925980392156864, 0.47029411764705886],
  "lea-R": [0.8, 0.6235294117647058, 0.5607843137254902],
  "lea-G": [0.596078431372549, 0.6862745098039216, 0.5235294117647059],
  "leb-W": [0.9009803921568627, 0.8980392156862744, 0.8205882352941176],
  "leb-U": [0.6745098039215687, 0.8117647058823529, 0.8637254901960785],
  "leb-R": [0.8490196078431372, 0.6745098039215688, 0.5862745098039216],
  "leb-G": [0.7009803921568628, 0.792156862745098, 0.6627450980392157],
  "2ed-N": [0.7730441176470588, 0.7663469532615027, 0.7596497888759465],
  "2ed-W": [0.9166666666666666, 0.911764705882353, 0.8362745098039215],
  "2ed-U": [0.6725490196078432, 0.8176470588235292, 0.8764705882352941],
  "2ed-R": [0.8784313725490196, 0.7039215686274506, 0.6196078431372549],
  "2ed-G": [0.703921568627451, 0.792156862745098, 0.6529411764705882],
  "3ed-W": [0.8705882352941177, 0.8725490196078431, 0.7901960784313726],
  "3ed-U": [0.7411764705882353, 0.8725490196078431, 0.9019607843137255],
  "3ed-B": [0.6456127450980391, 0.6297009283251004, 0.6137891115521614],
  "3ed-R": [0.8862745098039215, 0.7607843137254899, 0.6882352941176471],
  "3ed-G": [0.7333333333333333, 0.8196078431372549, 0.7137254901960784]
}, js = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/", Bs = {
  "ced-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 7.375,
      saturationScale: 1.1762500000000016,
      brightnessScale: 0.8181249999999999
    }
  },
  "ced-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -30.8125,
      saturationScale: 0.9837500000000003,
      brightnessScale: 0.7424999999999999
    }
  },
  "cei-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 7.375,
      saturationScale: 1.1762500000000016,
      brightnessScale: 0.8181249999999999
    }
  },
  "cei-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -30.8125,
      saturationScale: 0.9837500000000003,
      brightnessScale: 0.7424999999999999
    }
  },
  "arn-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.505453810934455,
      saturationScale: 0.35,
      brightnessScale: 0.8898773094688222
    }
  },
  "arn-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -26.0625,
      saturationScale: 0.4231249999999996,
      brightnessScale: 0.8137499999999998
    }
  },
  "arn-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -15.77370663044826,
      saturationScale: 0.513809877520305,
      brightnessScale: 0.9320886752136751
    }
  },
  "arn-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -15.625,
      saturationScale: 0.6056249999999997,
      brightnessScale: 0.7999999999999998
    }
  },
  "arn-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 0,
      saturationScale: 0.35,
      brightnessScale: 0.9033693415637861
    }
  },
  "atq-black-W": {
    asset: "old/fourth/w.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      hueDegrees: 12,
      saturationScale: 0.5710197869101978,
      brightnessScale: 1.0003827092511015
    }
  },
  "atq-black-U": {
    asset: "old/fourth/u.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      hueDegrees: -6.697735343332852,
      saturationScale: 0.541375370467828,
      brightnessScale: 0.902224025974026
    }
  },
  "atq-black-R": {
    asset: "old/fourth/r.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      hueDegrees: -1.9032939422386335,
      saturationScale: 0.7857044740973312,
      brightnessScale: 0.7774671052631579
    }
  },
  "atq-black-A": {
    asset: "old/fourth/a.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      hueDegrees: -2.0625,
      saturationScale: 0.6153345070422546,
      brightnessScale: 0.9751027397260275
    }
  },
  "leg-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 23,
      saturationScale: 0.9487500000000002,
      brightnessScale: 0.9868750000000001
    }
  },
  "leg-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 5.583848314606712,
      saturationScale: 0.7472144765689235,
      brightnessScale: 1.0475320512820512
    }
  },
  "sum-white-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -9.4375,
      saturationScale: 1.1968750000000001,
      brightnessScale: 0.791875
    }
  },
  "sum-white-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -26.82189849624058,
      saturationScale: 1.75,
      brightnessScale: 0.65
    }
  },
  "sum-white-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -16.875,
      saturationScale: 1.1618749999999995,
      brightnessScale: 0.8049999999999997
    }
  },
  "drk-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 15.3125,
      saturationScale: 0.4837499999999999,
      brightnessScale: 0.91625
    }
  },
  "drk-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -26.06681034482756,
      saturationScale: 0.35,
      brightnessScale: 0.8841369047619048
    }
  },
  "drk-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -9.575113949544175,
      saturationScale: 0.5847104628616878,
      brightnessScale: 0.9739369658119656
    }
  },
  "drk-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -19.096840659340614,
      saturationScale: 0.7963392857142855,
      brightnessScale: 0.8348240291262135
    }
  },
  "drk-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 26.5,
      saturationScale: 0.35,
      brightnessScale: 0.9190509259259259
    }
  },
  "fem-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 15.295234549515953,
      saturationScale: 0.861816701929742,
      brightnessScale: 0.8026356812933025
    }
  },
  "4ed-white-U": {
    asset: "old/fourth/u.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      hueDegrees: -0.24580583539000145,
      saturationScale: 0.721808640677708,
      brightnessScale: 0.9531989538239538
    }
  },
  "4ed-white-R": {
    asset: "old/fourth/r.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      hueDegrees: -0.25,
      saturationScale: 0.7718750000000002,
      brightnessScale: 0.8525
    }
  },
  "4ed-white-G": {
    asset: "old/fourth/g.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      hueDegrees: -2.5,
      saturationScale: 0.73125,
      brightnessScale: 0.9199999999999999
    }
  },
  "ice-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -11.496677215189948,
      saturationScale: 0.8745459472690391,
      brightnessScale: 0.8604027136258661
    }
  },
  "ice-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -15.75,
      saturationScale: 0.6924999999999997,
      brightnessScale: 0.8418749999999998
    }
  },
  "ice-black-M": {
    asset: "seventh/regular/m.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 9.3125,
      saturationScale: 0.5949454624781856,
      brightnessScale: 1.0172074468085106
    }
  },
  "chr-white-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -19.3125,
      saturationScale: 0.6733642344497578,
      brightnessScale: 0.8528073770491801
    }
  },
  "chr-white-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -18.5625,
      saturationScale: 0.6718749999999994,
      brightnessScale: 0.8499999999999999
    }
  },
  "chr-white-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -15.578651685393197,
      saturationScale: 0.770145677622135,
      brightnessScale: 0.9769604700854699
    }
  },
  "chr-white-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -9.140346333993875,
      saturationScale: 0.6851497870107426,
      brightnessScale: 0.8553276699029128
    }
  },
  "chr-white-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 26.5,
      saturationScale: 0.35,
      brightnessScale: 0.8636779835390948
    }
  },
  "hml-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.6875,
      saturationScale: 1.4934513546798007,
      brightnessScale: 0.8094672131147538
    }
  },
  "hml-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.25,
      saturationScale: 0.7687499999999998,
      brightnessScale: 0.8124999999999998
    }
  },
  "hml-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.75,
      saturationScale: 0.8950000000000005,
      brightnessScale: 0.9512500000000002
    }
  },
  "hml-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -6.4375,
      saturationScale: 0.8318750000000003,
      brightnessScale: 0.7849999999999999
    }
  },
  "hml-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.696827498848506,
      saturationScale: 0.7885897227284562,
      brightnessScale: 0.8270082487309647
    }
  },
  "all-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.5625,
      saturationScale: 0.71125,
      brightnessScale: 0.8688524590163934
    }
  },
  "all-black-M": {
    asset: "seventh/regular/m.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 11.51785714285711,
      saturationScale: 0.5736360398860393,
      brightnessScale: 1.0528590425531916
    }
  },
  "all-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 26.5,
      saturationScale: 0.35,
      brightnessScale: 0.8606249999999999
    }
  },
  "rqs-white-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.9375,
      saturationScale: 0.746250000000001,
      brightnessScale: 0.9112500000000001
    }
  },
  "rqs-white-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -21.125,
      saturationScale: 1.0987500000000003,
      brightnessScale: 0.9093749999999999
    }
  },
  "mir-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -21.0625,
      saturationScale: 1.75,
      brightnessScale: 0.9631249999999999
    }
  },
  "mir-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 13.75,
      saturationScale: 0.8155113636363647,
      brightnessScale: 0.8991071428571429
    }
  },
  "mir-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -9.5625,
      saturationScale: 0.9893750000000002,
      brightnessScale: 0.85625
    }
  },
  "mir-black-M": {
    asset: "seventh/regular/m.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.748106060606005,
      saturationScale: 0.8785129559930513,
      brightnessScale: 0.9532623626373627
    }
  },
  "itp-white-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -12.278820072332678,
      saturationScale: 1.3101274613220824,
      brightnessScale: 0.8782837759815241
    }
  },
  "itp-white-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -13.25,
      saturationScale: 1.0087499999999996,
      brightnessScale: 0.855
    }
  },
  "itp-white-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -6.187110464162743,
      saturationScale: 0.9324292422693581,
      brightnessScale: 0.8393264563106796
    }
  },
  "vis-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -19,
      saturationScale: 1.75,
      brightnessScale: 0.9450000000000001
    }
  },
  "vis-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 8.375,
      saturationScale: 0.7846324416733718,
      brightnessScale: 0.8980753968253967
    }
  },
  "vis-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -11.603567342268661,
      saturationScale: 1.0151493405122975,
      brightnessScale: 0.8161020194986074
    }
  },
  "vis-black-M": {
    asset: "seventh/regular/m.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -2.3467308553515522,
      saturationScale: 0.9023792966983261,
      brightnessScale: 0.9240796703296702
    }
  },
  "5ed-white-B": {
    asset: "old/fourth/b.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      hueDegrees: 5.8125,
      saturationScale: 0.8837500000000009,
      brightnessScale: 0.8525000000000003
    }
  },
  "5ed-white-R": {
    asset: "old/fourth/r.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      hueDegrees: 0.8563980034050473,
      saturationScale: 0.9996694491406032,
      brightnessScale: 0.7176614832535886
    }
  },
  "por-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -24.234177215189902,
      saturationScale: 1.75,
      brightnessScale: 0.913519053117783
    }
  },
  "por-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -4.673678752638807,
      saturationScale: 0.960800558312655,
      brightnessScale: 0.8649481658692186
    }
  },
  "por-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.058379120879181,
      saturationScale: 0.9038314612602587,
      brightnessScale: 0.764490291262136
    }
  },
  "wth-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -21.262267102830265,
      saturationScale: 1.75,
      brightnessScale: 0.9434815242494229
    }
  },
  "wth-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 8.375,
      saturationScale: 0.7793750000000003,
      brightnessScale: 0.9099999999999999
    }
  },
  "wth-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -10.75,
      saturationScale: 0.9725000000000004,
      brightnessScale: 0.8274999999999999
    }
  },
  "wth-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -6.322264561785573,
      saturationScale: 1.0094544975982105,
      brightnessScale: 0.8851078680203046
    }
  },
  "tmp-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.234515484515441,
      saturationScale: 0.9033886823960354,
      brightnessScale: 0.7314684466019418
    }
  },
  "tmp-black-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.7554723502303204,
      saturationScale: 0.822111880466472,
      brightnessScale: 0.7771195652173911
    }
  },
  "tmp-black-M": {
    asset: "seventh/regular/m.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -9.354166666666686,
      saturationScale: 0.6615369496855338,
      brightnessScale: 0.8251196808510638
    }
  },
  "tmp-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -16.625,
      saturationScale: 0.8412499999999996,
      brightnessScale: 0.8506249999999999
    }
  },
  "sth-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 4.280231951351993,
      saturationScale: 0.7989405552985374,
      brightnessScale: 0.9231399521531101
    }
  },
  "sth-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.8726273726274485,
      saturationScale: 0.9210283251231528,
      brightnessScale: 0.7598968446601942
    }
  },
  "sth-black-M": {
    asset: "seventh/regular/m.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 2.5625,
      saturationScale: 0.6743950803212857,
      brightnessScale: 0.8773537234042554
    }
  },
  "sth-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -10.892340319361324,
      saturationScale: 0.8265804106073573,
      brightnessScale: 0.8651173857868023
    }
  },
  "exo-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.833565688043336,
      saturationScale: 0.9048391192141193,
      brightnessScale: 0.7922208737864077
    }
  },
  "p02-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -23.875,
      saturationScale: 1.75,
      brightnessScale: 0.9130327868852459
    }
  },
  "p02-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.769230769230717,
      saturationScale: 1.0130940082644622,
      brightnessScale: 0.8692658730158731
    }
  },
  "p02-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.804280760223378,
      saturationScale: 0.9309731058415271,
      brightnessScale: 0.7422390776699028
    }
  },
  "p02-black-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.25,
      saturationScale: 0.8612499999999996,
      brightnessScale: 0.8031249999999998
    }
  },
  "usg-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -23.187880918893597,
      saturationScale: 1.75,
      brightnessScale: 0.8905239607390302
    }
  },
  "usg-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.281066588906469,
      saturationScale: 0.9144860685813841,
      brightnessScale: 0.8713965311004784
    }
  },
  "usg-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -9.249892656768793,
      saturationScale: 0.946788023538227,
      brightnessScale: 0.7805849582172701
    }
  },
  "ath-white-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -23.1875,
      saturationScale: 1.75,
      brightnessScale: 0.9183811475409837
    }
  },
  "ath-white-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -13.406395587832321,
      saturationScale: 0.9211709893182847,
      brightnessScale: 0.9586164529914529
    }
  },
  "ath-white-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.372724574594372,
      saturationScale: 0.9349431191395474,
      brightnessScale: 0.7308234679665738
    }
  },
  "ath-white-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.875,
      saturationScale: 0.7874999999999999,
      brightnessScale: 0.8037499999999997
    }
  },
  "ulg-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -13,
      saturationScale: 1.75,
      brightnessScale: 0.8635758196721312
    }
  },
  "ulg-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.847186215325337,
      saturationScale: 0.9837196212231792,
      brightnessScale: 0.8532486044657097
    }
  },
  "ulg-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.4375,
      saturationScale: 0.8768750000000002,
      brightnessScale: 0.8281249999999999
    }
  },
  "6ed-white-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 0.75,
      saturationScale: 0.7893750000000003,
      brightnessScale: 0.8775
    }
  },
  "6ed-white-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -11.6875,
      saturationScale: 0.9225000000000005,
      brightnessScale: 0.9518750000000001
    }
  },
  "6ed-white-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -4.337572570667135,
      saturationScale: 0.9954001917918639,
      brightnessScale: 0.7584818941504178
    }
  },
  "6ed-white-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -12.1875,
      saturationScale: 0.86375,
      brightnessScale: 0.8399999999999999
    }
  },
  "6ed-white-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5,
      saturationScale: 0.7449999999999994,
      brightnessScale: 0.8702160493827161
    }
  },
  "ptk-white-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -25.460138753651336,
      saturationScale: 1.75,
      brightnessScale: 0.9101732101616632
    }
  },
  "ptk-white-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.625,
      saturationScale: 1.058749999999999,
      brightnessScale: 0.864375
    }
  },
  "ptk-white-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -1.1584586466165092,
      saturationScale: 1.076845201666958,
      brightnessScale: 0.7336629526462395
    }
  },
  "ptk-white-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -2.6875,
      saturationScale: 0.9012499999999999,
      brightnessScale: 0.7587499999999998
    }
  },
  "uds-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.8125,
      saturationScale: 1.75,
      brightnessScale: 0.8674999999999999
    }
  },
  "uds-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 1.4390041918620682,
      saturationScale: 0.6165630797223502,
      brightnessScale: 0.8103807814992025
    }
  },
  "uds-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.0625,
      saturationScale: 0.8881249999999999,
      brightnessScale: 0.8199999999999998
    }
  },
  "s99-white-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -22.1875,
      saturationScale: 1.6806250000000011,
      brightnessScale: 0.9193749999999999
    }
  },
  "s99-white-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -1.8302948256600757,
      saturationScale: 0.7621638030140915,
      brightnessScale: 0.872343500797448
    }
  },
  "s99-white-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -17.777021250610687,
      saturationScale: 0.787132330306295,
      brightnessScale: 0.9421474358974358
    }
  },
  "s99-white-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -10.347919937205688,
      saturationScale: 0.8387374308697833,
      brightnessScale: 0.7477184466019416
    }
  },
  "mmq-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -25.5,
      saturationScale: 1.75,
      brightnessScale: 0.916577868852459
    }
  },
  "mmq-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 5.794117647058783,
      saturationScale: 0.5836754992718941,
      brightnessScale: 0.8514384920634921
    }
  },
  "mmq-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.166353383458613,
      saturationScale: 0.8382252000970171,
      brightnessScale: 0.8159592618384401
    }
  },
  "mmq-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.273492444640965,
      saturationScale: 1.1028641614946406,
      brightnessScale: 0.8431503807106601
    }
  },
  "brb-white-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -25.630916345624655,
      saturationScale: 1.75,
      brightnessScale: 0.9068230369515015
    }
  },
  "brb-white-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.375,
      saturationScale: 0.8918750000000005,
      brightnessScale: 0.855625
    }
  },
  "brb-white-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -0.8125,
      saturationScale: 0.9650000000000003,
      brightnessScale: 0.7499999999999998
    }
  },
  "brb-white-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -6.883467741935419,
      saturationScale: 0.8590522157054414,
      brightnessScale: 0.8187668918918918
    }
  },
  "nem-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -17.9375,
      saturationScale: 1.3700000000000003,
      brightnessScale: 0.914375
    }
  },
  "nem-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -12.902281822379564,
      saturationScale: 0.8073929923773695,
      brightnessScale: 0.9769604700854699
    }
  },
  "nem-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.397194910352823,
      saturationScale: 0.8296424531350997,
      brightnessScale: 0.8327427184466017
    }
  },
  "nem-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 6.6875,
      saturationScale: 0.3543749999999999,
      brightnessScale: 0.8867541152263374
    }
  },
  "pcy-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -23.8125,
      saturationScale: 1.75,
      brightnessScale: 0.9275
    }
  },
  "pcy-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.5625,
      saturationScale: 0.6799999999999997,
      brightnessScale: 0.8531249999999998
    }
  },
  "pcy-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -11.875,
      saturationScale: 0.8800000000000001,
      brightnessScale: 0.9475
    }
  },
  "pcy-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.907517051913601,
      saturationScale: 0.8537733875601523,
      brightnessScale: 0.7433434466019417
    }
  },
  "pcy-black-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -15.370967741935488,
      saturationScale: 0.6881249999999997,
      brightnessScale: 0.8177027027027025
    }
  },
  "pcy-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.9375,
      saturationScale: 0.8462499999999993,
      brightnessScale: 0.8333616255144034
    }
  },
  "btd-white-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -0.625,
      saturationScale: 0.8850000000000007,
      brightnessScale: 0.866875
    }
  },
  "btd-white-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -4.740601503759308,
      saturationScale: 0.8762235329703574,
      brightnessScale: 0.7238944986072424
    }
  },
  "btd-white-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.583930704898421,
      saturationScale: 0.7199999999999996,
      brightnessScale: 0.7791216216216215
    }
  },
  "inv-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -21.8125,
      saturationScale: 1.75,
      brightnessScale: 0.9137295081967213
    }
  },
  "inv-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -4.7527173913043725,
      saturationScale: 0.8084090909090913,
      brightnessScale: 0.8878571428571429
    }
  },
  "inv-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -2.3555809487747865,
      saturationScale: 1.0272757775273005,
      brightnessScale: 0.7745160167130921
    }
  },
  "inv-black-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.831525994362664,
      saturationScale: 0.8471439022730367,
      brightnessScale: 0.8140540540540541
    }
  },
  "inv-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.074938358577015,
      saturationScale: 1.3607136894435428,
      brightnessScale: 0.8478458121827411
    }
  },
  "pls-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -21.511841149615975,
      saturationScale: 1.75,
      brightnessScale: 0.9299220554272519
    }
  },
  "pls-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -0.125,
      saturationScale: 0.636875,
      brightnessScale: 0.9006249999999999
    }
  },
  "pls-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -12.411985018726568,
      saturationScale: 0.901078726260316,
      brightnessScale: 0.9726869658119657
    }
  },
  "pls-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -3.6720190579276277,
      saturationScale: 0.8794032820745332,
      brightnessScale: 0.8239763231197774
    }
  },
  "pls-black-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -15.1875,
      saturationScale: 0.781875,
      brightnessScale: 0.876875
    }
  },
  "pls-black-M": {
    asset: "seventh/regular/m.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 3.0391207153502364,
      saturationScale: 0.606282689912827,
      brightnessScale: 0.8821222527472526
    }
  },
  "7ed-white-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -10.204323931787485,
      saturationScale: 0.8843269100444157,
      brightnessScale: 0.89771331738437
    }
  },
  "7ed-white-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -11.4375,
      saturationScale: 0.8056249999999999,
      brightnessScale: 0.946875
    }
  },
  "7ed-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.5625,
      saturationScale: 0.9581249999999998,
      brightnessScale: 0.9004464285714289
    }
  },
  "7ed-white-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -4.3125,
      saturationScale: 0.8068750000000001,
      brightnessScale: 0.7637499999999997
    }
  },
  "7ed-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -9.9375,
      saturationScale: 1.055,
      brightnessScale: 0.761875
    }
  },
  "7ed-white-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.491496437504793,
      saturationScale: 0.9212939321705025,
      brightnessScale: 0.8434263959390866
    }
  },
  "7ed-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -37.50876188798884,
      saturationScale: 1.75,
      brightnessScale: 0.8137500000000001
    }
  },
  "apc-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -20.1875,
      saturationScale: 1.75,
      brightnessScale: 0.9228995901639345
    }
  },
  "apc-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -3.076302729528493,
      saturationScale: 0.7040589926088144,
      brightnessScale: 0.8950817384370017
    }
  },
  "apc-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -3.22087912087909,
      saturationScale: 0.948096546310832,
      brightnessScale: 0.8224089805825243
    }
  },
  "apc-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -3,
      saturationScale: 0.8499999999999996,
      brightnessScale: 0.8633127572016462
    }
  },
  "ody-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -20.25,
      saturationScale: 1.75,
      brightnessScale: 0.9299999999999999
    }
  },
  "ody-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 3.8125,
      saturationScale: 0.8962500000000002,
      brightnessScale: 0.8987499999999999
    }
  },
  "ody-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.375,
      saturationScale: 0.9831249999999992,
      brightnessScale: 0.9849999999999997
    }
  },
  "ody-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.214836945736806,
      saturationScale: 0.9039681948393052,
      brightnessScale: 0.7275017409470752
    }
  },
  "ody-black-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.507429614181433,
      saturationScale: 0.7311649659863949,
      brightnessScale: 0.797717391304348
    }
  },
  "ody-black-M": {
    asset: "seventh/regular/m.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 2.946428571428555,
      saturationScale: 0.6945901573538851,
      brightnessScale: 0.9195877659574468
    }
  },
  "ody-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -18,
      saturationScale: 1.22125,
      brightnessScale: 0.8624999999999998
    }
  },
  "tor-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -21.315059568131005,
      saturationScale: 1.75,
      brightnessScale: 0.9089997113163975
    }
  },
  "tor-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 2.9902435782156545,
      saturationScale: 0.9330210918114138,
      brightnessScale: 0.8991955741626793
    }
  },
  "tor-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -13.426865971107532,
      saturationScale: 0.934698033707865,
      brightnessScale: 0.9677884615384614
    }
  },
  "tor-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -4.758458646616532,
      saturationScale: 0.9276758071649716,
      brightnessScale: 0.7595351671309193
    }
  },
  "tor-black-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.503320683111951,
      saturationScale: 0.7924349566089274,
      brightnessScale: 0.8111655405405406
    }
  },
  "jud-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 1.6682438066957275,
      saturationScale: 0.9646024820291109,
      brightnessScale: 0.910399720893142
    }
  },
  "jud-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -12.5625,
      saturationScale: 1.0118750000000007,
      brightnessScale: 1.0075000000000003
    }
  },
  "jud-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -2.445958646616532,
      saturationScale: 0.9620508071649717,
      brightnessScale: 0.7601601671309193
    }
  },
  "ons-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.877570010634486,
      saturationScale: 0.7590714971616981,
      brightnessScale: 0.9439194577352471
    }
  },
  "ons-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -16.893173652694713,
      saturationScale: 1.1838892432177446,
      brightnessScale: 0.9199651015228429
    }
  },
  "lgn-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -17.75,
      saturationScale: 1.75,
      brightnessScale: 0.94875
    }
  },
  "lgn-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.330179900744383,
      saturationScale: 0.9556328892005603,
      brightnessScale: 0.9535077751196172
    }
  },
  "scg-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -6.5625,
      saturationScale: 0.7993750000000003,
      brightnessScale: 0.905
    }
  },
  "tsb-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -15.875,
      saturationScale: 1.75,
      brightnessScale: 0.9191495901639344
    }
  },
  "tsb-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 2.3569970184080375,
      saturationScale: 1.1247076023391813,
      brightnessScale: 0.7288944986072423
    }
  },
  "tsb-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -3.5,
      saturationScale: 1.2956250000000005,
      brightnessScale: 0.8875
    }
  },
  "plst-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -5.683379120879181,
      saturationScale: 0.9721108058608056,
      brightnessScale: 0.7369053398058251
    }
  },
  "tsr-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -4.5625,
      saturationScale: 0.4331249999999999,
      brightnessScale: 1.0400102459016394
    }
  },
  "tsr-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -0.8605769230769056,
      saturationScale: 0.78479736237107,
      brightnessScale: 0.9872408293460926
    }
  },
  "tsr-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 1.9398668331252793,
      saturationScale: 0.8466913535076951,
      brightnessScale: 1.015219017094017
    }
  },
  "tsr-black-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 15.730466684294015,
      saturationScale: 0.7118557656655544,
      brightnessScale: 0.941908783783784
    }
  },
  "mh2-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -18.40276965216458,
      saturationScale: 1.0711522721443565,
      brightnessScale: 1.033197170900693
    }
  },
  "mh2-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 6.638784303368311,
      saturationScale: 0.8832980572295082,
      brightnessScale: 0.9593062200956937
    }
  },
  "mh2-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -2.9010201064459125,
      saturationScale: 1.0488467506501165,
      brightnessScale: 0.9817574786324786
    }
  },
  "brc-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -18,
      saturationScale: 1.6456250000000017,
      brightnessScale: 1.0306352459016395
    }
  },
  "brc-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -9.625,
      saturationScale: 0.8893750000000004,
      brightnessScale: 0.905
    }
  },
  "dmr-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 3.3813585607940695,
      saturationScale: 0.7259828667933644,
      brightnessScale: 0.9381230063795852
    }
  },
  "dmr-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -8.1875,
      saturationScale: 0.8806250000000001,
      brightnessScale: 0.89625
    }
  },
  "mh3-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -10.048662806727293,
      saturationScale: 0.9778585203366057,
      brightnessScale: 0.9351903907496013
    }
  },
  "mh3-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -3.279146734898177,
      saturationScale: 1.1028269819646046,
      brightnessScale: 1.002601495726496
    }
  },
  "mh3-black-R": {
    asset: "seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -1.3853021978022753,
      saturationScale: 0.9892322383498848,
      brightnessScale: 0.932766990291262
    }
  },
  "inr-black-W": {
    asset: "seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -7.5625,
      saturationScale: 1.1735249999999977,
      brightnessScale: 1.020840163934426
    }
  },
  "inr-black-U": {
    asset: "seventh/regular/u.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -13.317703101404277,
      saturationScale: 1.0153158055200335,
      brightnessScale: 0.9271092503987239
    }
  },
  "inr-black-B": {
    asset: "seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: -4.264257745999316,
      saturationScale: 1.0944488570321584,
      brightnessScale: 0.9983279914529913
    }
  },
  "inr-black-G": {
    asset: "seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 1.1080963938973127,
      saturationScale: 0.9585204081632657,
      brightnessScale: 0.9543750000000001
    }
  },
  "inr-black-M": {
    asset: "seventh/regular/m.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 10.125,
      saturationScale: 0.6831250000000008,
      brightnessScale: 1.0074999999999998
    }
  },
  "inr-black-A": {
    asset: "seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      hueDegrees: 7.0625,
      saturationScale: 0.7956249999999995,
      brightnessScale: 0.9540020576131688
    }
  }
}, Ls = {
  "ced-black-W": [0.9313725490196079, 0.9470588235294117, 0.792156862745098],
  "ced-black-U": [0.6218498695615586, 0.780096529965166, 0.8889019607843138],
  "cei-black-W": [0.9313725490196079, 0.9470588235294117, 0.792156862745098],
  "cei-black-U": [0.6218498695615586, 0.780096529965166, 0.8889019607843138],
  "arn-black-U": [0.6666666666666666, 0.7990196078431374, 0.8823529411764706],
  "arn-black-B": [0.5337156862745095, 0.5290919117647056, 0.5244681372549017],
  "arn-black-G": [0.6549019607843137, 0.7450980392156863, 0.6803921568627451],
  "atq-black-W": [0.8549019607843137, 0.8470588235294118, 0.796078431372549],
  "atq-black-U": [0.7019607843137254, 0.8431372549019609, 0.8862745098039215],
  "atq-black-B": [0.607485294117647, 0.5811709558823529, 0.5548566176470587],
  "atq-black-G": [0.7098039215686276, 0.8, 0.6980392156862745],
  "leg-black-G": [0.7745098039215687, 0.8936274509803921, 0.6833333333333333],
  "sum-white-N": [0.9144460784313726, 0.9020252297794119, 0.889604381127451],
  "sum-white-W": [0.9333333333333333, 0.9450980392156862, 0.8647058823529412],
  "sum-white-U": [0.8921029411764704, 0.9234691176470586, 0.9491323529411763],
  "sum-white-G": [0.8647058823529411, 0.9352941176470588, 0.8117647058823529],
  "drk-black-W": [0.8705882352941177, 0.8235294117647058, 0.7686274509803922],
  "drk-black-B": [0.5846715686274508, 0.5593454486992817, 0.5340193287711124],
  "fem-black-W": [0.7960784313725489, 0.8117647058823529, 0.7215686274509804],
  "fem-black-U": [0.6901960784313725, 0.788235294117647, 0.7843137254901961],
  "fem-black-B": [0.6248137254901959, 0.5977487745098038, 0.5706838235294116],
  "fem-black-G": [0.7392156862745098, 0.7862745098039216, 0.6470588235294118],
  "4ed-white-N": [0.7961176470588234, 0.7794908088235294, 0.7628639705882353],
  "4ed-white-W": [0.9411764705882353, 0.9235294117647059, 0.8156862745098039],
  "4ed-white-U": [0.7529411764705882, 0.8588235294117648, 0.8941176470588236],
  "4ed-white-B": [0.6900392156862746, 0.660533207144244, 0.6310271986022132],
  "4ed-white-R": [0.888235294117647, 0.7490196078431373, 0.7019607843137254],
  "4ed-white-G": [0.7686274509803922, 0.8313725490196079, 0.7235294117647059],
  "ice-black-W": [0.8960784313725491, 0.8705882352941177, 0.7450980392156863],
  "ice-black-U": [0.7156862745098039, 0.8019607843137255, 0.8313725490196078],
  "ice-black-B": [0.6693725490196076, 0.6403774509803921, 0.6113823529411764],
  "ice-black-G": [0.7666666666666665, 0.8294117647058823, 0.7196078431372549],
  "chr-white-W": [0.9019607843137255, 0.8823529411764706, 0.7774509803921568],
  "hml-black-W": [0.8666666666666667, 0.8803921568627451, 0.8019607843137255],
  "hml-black-N": [0.8367794117647057, 0.8293747424650552, 0.8219700731654046],
  "hml-black-U": [0.796078431372549, 0.8549019607843138, 0.8686274509803922],
  "hml-black-B": [0.726936274509804, 0.7206385592603379, 0.7143408440108718],
  "hml-black-G": [0.7886852328431371, 0.832705882352941, 0.7674338848039214],
  "all-black-W": [0.8803921568627451, 0.8686274509803922, 0.7549019607843137],
  "all-black-U": [0.7313725490196078, 0.8156862745098039, 0.8431372549019608],
  "all-black-B": [0.6837990196078433, 0.654179012570375, 0.6245590055329064],
  "all-black-G": [0.7647058823529411, 0.8225490196078432, 0.7303921568627453],
  "rqs-white-W": [0.9215686274509803, 0.9019607843137254, 0.7901960784313725],
  "rqs-white-U": [0.7490196078431373, 0.8705882352941178, 0.8901960784313725],
  "rqs-white-B": [0.6542107843137255, 0.627592987860367, 0.6009751914070083],
  "rqs-white-G": [0.7294117647058823, 0.8352941176470589, 0.7019607843137254],
  "mir-black-N": [0.7471421568627451, 0.7147783258105224, 0.6824144947582994],
  "mir-black-W": [0.9387450980392158, 0.9205758380771666, 0.7267703984819736],
  "mir-black-R": [0.8867647058823529, 0.5803921568627456, 0.4715686274509804],
  "mir-black-G": [0.6754901960784312, 0.8, 0.5519607843137255],
  "itp-white-W": [0.8941176470588236, 0.8686274509803924, 0.7529411764705882],
  "itp-white-U": [0.6725490196078432, 0.8058823529411765, 0.8509803921568627],
  "itp-white-G": [0.7137254901960786, 0.7686274509803923, 0.6588235294117648],
  "vis-black-N": [0.7309803921568627, 0.6993166375461077, 0.6676528829353524],
  "vis-black-W": [0.9215686274509804, 0.899203154279499, 0.713472485768501],
  "vis-black-U": [0.7215686274509804, 0.8122549019607842, 0.8558823529411764],
  "vis-black-B": [0.7105196078431373, 0.6797421495826055, 0.6489646913220735],
  "vis-black-G": [0.6392156862745096, 0.7764705882352941, 0.5450980392156862],
  "5ed-white-U": [0.6588235294117647, 0.8313725490196078, 0.8862745098039215],
  "5ed-white-B": [0.7048921568627452, 0.686670083933945, 0.6684480110051447],
  "5ed-white-R": [0.8352941176470589, 0.5627450980392155, 0.4666666666666667],
  "5ed-white-G": [0.7490196078431373, 0.8215686274509804, 0.7647058823529411],
  "por-black-N": [0.7049313725490195, 0.6805329106971554, 0.6561344488452912],
  "por-black-W": [0.9019607843137255, 0.8823529411764705, 0.7490196078431373],
  "por-black-U": [0.6235294117647059, 0.8039215686274512, 0.8627450980392157],
  "por-black-B": [0.6814803921568626, 0.6605418420020214, 0.63960329184718],
  "por-black-R": [0.8568627450980392, 0.5960784313725489, 0.49411764705882355],
  "por-black-G": [0.5607843137254902, 0.7254901960784313, 0.5882352941176471],
  "wth-black-N": [0.7265441176470588, 0.6950725283925453, 0.6636009391380315],
  "wth-black-W": [0.9176470588235294, 0.900980392156863, 0.7215686274509804],
  "wth-black-U": [0.7215686274509804, 0.823529411764706, 0.8705882352941177],
  "wth-black-B": [0.7173725490196078, 0.6862982430596001, 0.6552239370995923],
  "wth-black-R": [0.8784313725490196, 0.5647058823529408, 0.4607843137254902],
  "wth-black-G": [0.6235294117647059, 0.780392156862745, 0.5137254901960783],
  "tmp-black-W": [0.9029411764705882, 0.8970588235294118, 0.7470588235294118],
  "tmp-black-U": [0.6901960784313725, 0.8411764705882354, 0.9019607843137255],
  "tmp-black-B": [0.6792647058823529, 0.6498411109493303, 0.6204175160163075],
  "sth-black-W": [0.9117647058823528, 0.919607843137255, 0.7450980392156863],
  "sth-black-B": [0.7135882352941176, 0.6826778538147934, 0.651767472335469],
  "sth-black-R": [0.8372549019607843, 0.5588235294117646, 0.4480392156862745],
  "exo-black-W": [0.8980392156862745, 0.8901960784313725, 0.7450980392156863],
  "exo-black-N": [0.7253921568627453, 0.6939704668996314, 0.6625487769365174],
  "exo-black-B": [0.7028725490196078, 0.673970395008251, 0.6450682409968937],
  "exo-black-G": [0.6235294117647059, 0.7490196078431373, 0.6176470588235294],
  "p02-black-N": [0.7060098039215685, 0.6754276960784313, 0.644845588235294],
  "p02-black-W": [0.8764705882352941, 0.8549019607843138, 0.7245098039215686],
  "p02-black-U": [0.6235294117647059, 0.7999999999999999, 0.8470588235294118],
  "p02-black-B": [0.6799950980392157, 0.6505398648320716, 0.6210846316249272],
  "p02-black-R": [0.8274509803921568, 0.5843137254901962, 0.4745098039215686],
  "p02-black-G": [0.5647058823529414, 0.7019607843137254, 0.5627450980392157],
  "usg-black-W": [0.8807450980392159, 0.8747773675757464, 0.681867172675522],
  "usg-black-U": [0.6862745098039216, 0.803921568627451, 0.8627450980392157],
  "usg-black-B": [0.703862745098039, 0.6733736410405746, 0.64288453698311],
  "ath-white-N": [0.7186372549019607, 0.6937122346412257, 0.6687872143804904],
  "ath-white-W": [0.9, 0.8901960784313725, 0.7607843137254902],
  "ath-white-B": [0.7005637254901959, 0.6855857077205881, 0.6706076899509803],
  "ath-white-R": [0.85, 0.5803921568627449, 0.48872549019607847],
  "ulg-black-W": [0.8666666666666667, 0.8627450980392157, 0.7019607843137254],
  "ulg-black-N": [0.7272156862745098, 0.6957150067947974, 0.6642143273150846],
  "ulg-black-U": [0.6519607843137255, 0.8009803921568628, 0.8529411764705882],
  "ulg-black-B": [0.7243284313725489, 0.692952818627451, 0.6615772058823528],
  "ulg-black-G": [0.5745098039215688, 0.7058823529411765, 0.5294117647058824],
  "6ed-white-N": [0.7145, 0.6835501237623764, 0.6526002475247525],
  "6ed-white-W": [0.8960784313725491, 0.8705882352941177, 0.7176470588235294],
  "6ed-white-U": [0.6862745098039216, 0.8333333333333334, 0.8784313725490196],
  "6ed-white-B": [0.7322499999999998, 0.7011882812499999, 0.6701265624999998],
  "6ed-white-G": [0.6254901960784314, 0.7490196078431373, 0.5882352941176471],
  "ptk-white-N": [0.7040294117647058, 0.6735330882352942, 0.6430367647058823],
  "ptk-white-W": [0.9156862745098039, 0.884313725490196, 0.7137254901960784],
  "ptk-white-U": [0.6549019607843137, 0.8274509803921568, 0.892156862745098],
  "ptk-white-B": [0.6916519607843136, 0.6616917892156863, 0.6317316176470588],
  "ptk-white-R": [0.8549019607843137, 0.5725490196078427, 0.4294117647058823],
  "ptk-white-G": [0.5705882352941176, 0.7039215686274509, 0.5607843137254902],
  "uds-black-N": [0.7167990196078431, 0.6857495571248302, 0.6547000946418171],
  "uds-black-W": [0.8705882352941177, 0.8666666666666667, 0.7],
  "uds-black-U": [0.6264705882352941, 0.7705882352941176, 0.8549019607843137],
  "uds-black-B": [0.7228431372549018, 0.691531862745098, 0.6602205882352941],
  "uds-black-G": [0.6274509803921571, 0.7411764705882353, 0.5666666666666667],
  "s99-white-N": [0.7146764705882354, 0.7076668034726268, 0.7006571363570181],
  "s99-white-W": [0.8960784313725491, 0.8901960784313726, 0.7843137254901961],
  "s99-white-U": [0.6637254901960784, 0.8392156862745099, 0.9],
  "s99-white-B": [0.702436274509804, 0.6963508117355853, 0.6902653489613667],
  "s99-white-R": [0.8411764705882353, 0.5960784313725488, 0.5411764705882353],
  "s99-white-G": [0.6, 0.7568627450980392, 0.6607843137254902],
  "mmq-black-N": [0.7012303921568628, 0.670855313288682, 0.640480234420501],
  "mmq-black-W": [0.8960784313725491, 0.8666666666666669, 0.7450980392156863],
  "mmq-black-U": [0.6725490196078432, 0.8196078431372549, 0.8745098039215686],
  "mmq-black-B": [0.6812843137254901, 0.6517732357794604, 0.6222621578334304],
  "mmq-black-R": [0.8509803921568627, 0.5882352941176475, 0.5196078431372549],
  "mmq-black-G": [0.6088235294117648, 0.7098039215686275, 0.5813725490196079],
  "brb-white-N": [0.7112303921568627, 0.6804221449718503, 0.6496138977868375],
  "brb-white-B": [0.6990784313725489, 0.668796568627451, 0.6385147058823528],
  "brb-white-W": [0.9098039215686274, 0.8862745098039215, 0.7431372549019608],
  "brb-white-U": [0.6470588235294118, 0.8235294117647058, 0.8823529411764706],
  "brb-white-R": [0.8549019607843137, 0.5784313725490191, 0.4549019607843137],
  "brb-white-G": [0.5843137254901962, 0.7137254901960784, 0.5705882352941176],
  "nem-black-W": [0.8980392156862745, 0.888235294117647, 0.796078431372549],
  "nem-black-U": [0.7137254901960784, 0.8470588235294119, 0.8901960784313725],
  "nem-black-R": [0.8588235294117647, 0.6156862745098042, 0.5372549019607843],
  "nem-black-G": [0.6705882352941178, 0.7745098039215688, 0.6647058823529413],
  "pcy-black-N": [0.6683823529411763, 0.6603791360294117, 0.6523759191176469],
  "pcy-black-W": [0.9098039215686274, 0.8941176470588236, 0.7754901960784314],
  "pcy-black-U": [0.5997825254565347, 0.7950458458543516, 0.857357843137255],
  "pcy-black-B": [0.6664019607843136, 0.6559688112745097, 0.6455356617647058],
  "pcy-black-R": [0.8333333333333334, 0.5235294117647056, 0.4372549019607843],
  "pcy-black-G": [0.5176470588235295, 0.6862745098039216, 0.5901960784313725],
  "btd-white-N": [0.6424852941176471, 0.6163048135374201, 0.5901243329571929],
  "btd-white-U": [0.5980661764705881, 0.7824011182598039, 0.8549044117647058],
  "btd-white-B": [0.6312058823529412, 0.609039462907688, 0.5868730434624346],
  "btd-white-R": [0.846078431372549, 0.5460784313725493, 0.43333333333333335],
  "inv-black-N": [0.6777892156862745, 0.6484295343137255, 0.6190698529411764],
  "inv-black-W": [0.9049019607843137, 0.8794117647058822, 0.7176470588235294],
  "inv-black-U": [0.6071537385340402, 0.7896893850069664, 0.8678946078431373],
  "inv-black-B": [0.6886127450980393, 0.6587842227237432, 0.6289557003494468],
  "inv-black-G": [0.5450980392156862, 0.6980392156862745, 0.5509803921568629],
  "pls-black-N": [0.6941274509803921, 0.6731876531862746, 0.6522478553921569],
  "pls-black-W": [0.9058823529411765, 0.888235294117647, 0.7705882352941177],
  "pls-black-U": [0.6235294117647059, 0.8039215686274512, 0.8764705882352941],
  "pls-black-B": [0.6683823529411763, 0.6578975183823529, 0.6474126838235293],
  "pls-black-R": [0.8475490196078431, 0.5705882352941172, 0.4901960784313726],
  "pls-black-G": [0.5686274509803921, 0.7058823529411765, 0.6058823529411765],
  "7ed-white-N": [0.6781960784313725, 0.6723206173558531, 0.6664451562803339],
  "7ed-white-W": [0.884313725490196, 0.8941176470588236, 0.803921568627451],
  "7ed-black-W": [0.996078431372549, 0.996078431372549, 0.9098039215686274],
  "7ed-white-U": [0.622503145249516, 0.7788234975401589, 0.8898357843137255],
  "7ed-black-U": [0.6871568627450979, 0.9512081290849672, 0.9822549019607842],
  "7ed-white-B": [0.6822450980392155, 0.6763345588235292, 0.6704240196078429],
  "7ed-white-R": [0.8176470588235294, 0.5627450980392156, 0.4764705882352941],
  "7ed-black-R": [0.996078431372549, 0.611764705882353, 0.4862745098039216],
  "7ed-white-G": [0.5137254901960784, 0.7019607843137254, 0.6156862745098038],
  "7ed-black-G": [0.7372549019607844, 0.9705882352941176, 0.8156862745098037],
  "apc-black-W": [0.907843137254902, 0.8784313725490194, 0.7372549019607844],
  "apc-black-N": [0.6977647058823528, 0.6675397495631917, 0.6373147932440303],
  "apc-black-U": [0.6333333333333333, 0.7882352941176469, 0.8666666666666667],
  "apc-black-B": [0.6713235294117647, 0.6422439210832849, 0.6131643127548049],
  "ody-black-W": [0.8901960784313725, 0.8784313725490198, 0.7372549019607844],
  "ody-black-N": [0.6942990196078431, 0.6703895267605805, 0.6464800339133178],
  "ody-black-B": [0.6970980392156861, 0.6880607843137254, 0.6790235294117646],
  "tor-black-N": [0.6683823529411763, 0.6511557904411764, 0.6339292279411763],
  "tor-black-W": [0.884313725490196, 0.862745098039216, 0.7254901960784313],
  "tor-black-U": [0.6072549019607842, 0.74796977124183, 0.8680392156862744],
  "tor-black-B": [0.6604607843137255, 0.6454001531862745, 0.6303395220588235],
  "tor-black-R": [0.8156862745098039, 0.5098039215686279, 0.4156862745098039],
  "tor-black-G": [0.5598039215686275, 0.7, 0.5686274509803921],
  "jud-black-U": [0.6179610788521416, 0.7747023570962719, 0.8833431372549018],
  "jud-black-B": [0.7101421568627451, 0.6793810485827996, 0.6486199403028539],
  "jud-black-R": [0.8333333333333334, 0.533333333333333, 0.43333333333333335],
  "ons-black-U": [0.7156862745098039, 0.8705882352941178, 0.8980392156862745],
  "ons-black-B": [0.7391176470588235, 0.7238902995853751, 0.7086629521119265],
  "ons-black-R": [0.9294117647058824, 0.6745098039215687, 0.4911764705882353],
  "ons-black-G": [0.6058823529411764, 0.8235294117647058, 0.6509803921568625],
  "lgn-black-W": [0.9464117647058821, 0.9321647058823527, 0.732705882352941],
  "lgn-black-U": [0.6549019607843137, 0.8666666666666666, 0.8705882352941177],
  "lgn-black-B": [0.7425833333333333, 0.7104169760726073, 0.6782506188118812],
  "lgn-black-R": [0.9627450980392157, 0.6274509803921575, 0.5196078431372549],
  "lgn-black-G": [0.5892156862745098, 0.8352941176470589, 0.6627450980392157],
  "scg-black-G": [0.6509803921568628, 0.8245098039215686, 0.6627450980392156],
  "tsb-black-W": [0.9254901960784314, 0.9161764705882354, 0.7617647058823529],
  "sld-black-U": [0.6802606033829841, 0.8765397843821006, 0.9723970588235294],
  "sld-black-R": [0.9715686274509805, 0.6990196078431378, 0.5911764705882354],
  "plst-black-R": [0.8362745098039216, 0.544117647058824, 0.42598039215686284],
  "tsr-black-W": [0.9914117647058822, 0.9886134250474381, 0.9466383301707778],
  "tsr-black-N": [0.8555294117647059, 0.8481176470588235, 0.8407058823529412],
  "tsr-black-U": [0.8392156862745098, 0.9294117647058823, 0.9882352941176471],
  "tsr-black-B": [0.842656862745098, 0.8304289522058823, 0.8182010416666665],
  "tsr-black-R": [0.9549019607843137, 0.7490196078431376, 0.6127450980392157],
  "tsr-black-G": [0.7333333333333334, 0.8637254901960785, 0.7852941176470588],
  "mh2-black-W": [0.9862745098039216, 0.9710784313725489, 0.896078431372549],
  "mh2-black-U": [0.803921568627451, 0.8901960784313725, 0.984313725490196],
  "mh2-black-R": [0.9333333333333333, 0.6813725490196079, 0.596078431372549],
  "mh2-black-G": [0.7137254901960786, 0.8039215686274511, 0.7137254901960786],
  "brc-black-U": [0.7372549019607844, 0.8823529411764706, 0.9882352941176471],
  "brc-black-R": [0.9294117647058824, 0.6588235294117648, 0.6333333333333333],
  "dmr-black-U": [0.7730392156862745, 0.8784313725490194, 0.9882352941176471],
  "dmr-black-B": [0.7506666666666666, 0.7441633663366336, 0.7376600660066006],
  "dmr-black-R": [0.9117647058823529, 0.6431372549019607, 0.5950980392156863],
  "rvr-black-N": [0.8156470588235295, 0.7831557153451416, 0.7506643718667534],
  "rvr-black-W": [1, 0.976470588235294, 0.8470588235294118],
  "rvr-black-U": [0.7098039215686275, 0.8784313725490195, 0.9725490196078431],
  "rvr-black-B": [0.809686274509804, 0.7790474652980006, 0.748408656086197],
  "rvr-black-R": [0.972549019607843, 0.674509803921569, 0.5568627450980392],
  "rvr-black-G": [0.6392156862745099, 0.8039215686274511, 0.6666666666666667],
  "mh3-black-N": [0.8156470588235295, 0.7831557153451416, 0.7506643718667534],
  "mh3-black-W": [0.996078431372549, 0.9725490196078431, 0.8549019607843137],
  "mh3-black-U": [0.7098039215686275, 0.8745098039215684, 0.9647058823529412],
  "mh3-black-R": [0.9627450980392157, 0.6725490196078432, 0.5549019607843138],
  "mh3-black-B": [0.8131911764705883, 0.7811971879314401, 0.7492031993922917],
  "inr-black-W": [0.996078431372549, 0.9803921568627452, 0.8509803921568627],
  "inr-black-U": [0.6802606033829841, 0.8765397843821006, 0.9723970588235294],
  "inr-black-R": [0.9647058823529412, 0.6705882352941176, 0.5568627450980392],
  "inr-black-G": [0.6117647058823529, 0.8156862745098038, 0.6705882352941175]
};
function ut(e) {
  return fe(e) && (!e.layout || e.layout === "normal") && (e.colorCalibration === "early-hsb-v1" || e.colorCalibration === "set-hsb-v1");
}
const nr = (e) => {
  const t = e.setCode?.toLowerCase() ?? "";
  return ["lea", "leb"].includes(t) ? ce(e) === "black" : ["2ed", "3ed"].includes(t) && ce(e) === "white";
}, Tt = (e, t) => e?.every((r, s) => r === t[s]) ?? !1;
function Ds(e) {
  if (!ut(e)) return;
  const t = Te(e), r = tr(e), s = t.split("/").at(-1).replace(".png", "").toUpperCase(), a = e.setCode?.toLowerCase() ?? "", n = `${a}-${s}`;
  if (nr(e) && Cs[n] === t && Tt(Ms[n], r))
    return Rs[n];
  if (e.colorCalibration !== "set-hsb-v1") return;
  const l = Bs[`${a}-${ce(e)}-${s}`];
  return l && js + l.asset === t && Tt(l.rect, r) ? l.adjustment : void 0;
}
function As(e, t) {
  if (!ut(e)) return;
  const r = e.setCode?.toLowerCase() ?? "";
  return (nr(e) ? Ts[`${r}-${t}`] : void 0) ?? (e.colorCalibration === "set-hsb-v1" ? Ls[`${r}-${ce(e)}-${t}`] : void 0);
}
async function Os(e, t, r) {
  const s = { images: t, dispose() {
  } };
  if (!ut(e)) return s;
  const a = Ds(e), n = /* @__PURE__ */ new Map(), l = {};
  a && n.set(Te(e), a);
  const o = /* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...[...(e.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((h) => h[1])
  ]);
  for (const h of e.rulesParagraphs ?? [])
    for (const d of h.runs) for (const m of d.text.matchAll(/\{([^}]+)\}/g)) o.add(m[1]);
  o.add("W");
  for (const h of o) {
    const d = /^\d+$/.test(h) ? "N" : h, m = As(e, d), g = ys[d];
    if (!m || !g) continue;
    const p = Ye(h);
    p && n.set(p, $s(g, m)), l[h] = `rgb(${m.map((k) => Math.round(k * 255)).join(" ")})`;
  }
  if (!n.size && !Object.keys(l).length) return s;
  const i = Object.assign(new Map(t), { manaColors: l }), c = [...n].flatMap(([h, d]) => {
    const m = t.get(h);
    return m ? [{ url: h, source: m, adjustment: d }] : [];
  });
  let u = [];
  try {
    return u = await ar.acquireMany(
      c.map(({ url: h, source: d, adjustment: m }) => ({
        key: Gs(h, d.width, d.height, m),
        bytes: d.width * d.height * 4,
        build: () => Es(d, m)
      })),
      r
    ), c.forEach(({ url: h }, d) => i.set(h, u[d].value)), { images: i, dispose: () => u.forEach((h) => h.release()) };
  } catch (h) {
    throw u.forEach((d) => d.release()), h;
  }
}
function Gs(e, t, r, s) {
  return JSON.stringify([
    "early-hsb-rgb-preserve-ink-v1",
    e,
    t,
    r,
    s.hueDegrees,
    s.saturationScale,
    s.brightnessScale
  ]);
}
async function Es(e, t) {
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  try {
    const s = r.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("HSB preparation needs Canvas2D.");
    s.drawImage(e, 0, 0);
    const a = s.getImageData(0, 0, r.width, r.height);
    return Ws(a, t), s.putImageData(a, 0, 0), await createImageBitmap(r);
  } finally {
    r.width = r.height = 0;
  }
}
function Ws(e, t) {
  for (let r = 0; r < e.data.length; r += 4) {
    if (e.data[r + 3] === 0) continue;
    const s = [e.data[r] / 255, e.data[r + 1] / 255, e.data[r + 2] / 255], a = Math.max(...s), n = a === 0 ? 0 : (a - Math.min(...s)) / a;
    if (a < 0.075 || n < 0.025 && a > 0.97) continue;
    const l = ws(s, t);
    for (let o = 0; o < 3; o++) e.data[r + o] = Math.round(255 * l[o]);
  }
}
function $s(e, t) {
  const r = [
    parseInt(e.slice(1, 3), 16) / 255,
    parseInt(e.slice(3, 5), 16) / 255,
    parseInt(e.slice(5, 7), 16) / 255
  ], [s, a, n] = rt(r), [l, o, i] = rt(t);
  if (a <= 0 || n <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (l - s + 540) % 360 - 180,
    saturationScale: o / a,
    brightnessScale: i / n
  };
}
const Is = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", jt = {
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
}, Bt = {
  m15: { family: "m15-accurate", delta: [1, 0, 1, 1] },
  m21: { family: "m15-accurate", delta: [2, 0, 1.1, 1.06] },
  woe: { family: "m15-accurate", delta: [2, 0, 1.08, 1.08] },
  tdm: { family: "m15-accurate", delta: [0, 0, 1.08, 1.08] },
  "8ed": { family: "eighth", delta: [-4, 0, 1, 0.92] },
  "9ed": { family: "eighth", delta: [0, 1, 0.9, 0.92] }
};
function Us(e, t, r) {
  const s = e.setCode?.toLowerCase() ?? "", a = Object.hasOwn(Bt, s) ? Bt[s] : void 0;
  let n = r;
  return a && !e.setSymbol && Oe(t) && a.family === e.frameAssetFamily && (n = lr(r, a.delta)), e.frameAssetFamily ? ht(e, t, n, e.frameAssetFamily) : n;
}
function ht(e, t, r, s) {
  if (e.setSymbol || !Oe(t) || ge !== Is || (e.layout ?? "normal") !== "normal" || ["component", "m15-accurate"].includes(s) && V(e).legendary)
    return r;
  const a = e.borderColor ?? (s === "retro" ? ce(e) : ue(e.setCode).border === "#eeedeb" ? "white" : "black"), n = `${e.setCode?.trim().toLowerCase() ?? ""}/${s}/${a}`, l = Object.hasOwn(jt, n) ? jt[n] : void 0;
  return l ? lr(r, l) : r;
}
function lr(e, t) {
  const [r, s, a, n] = e, [l, o, i, c] = t;
  return [r + a + l - a * i, s + n / 2 + o - n * c / 2, a * i, n * c];
}
const Ps = 0.045;
function xs(e) {
  return fe(e) ? zr : Ps;
}
const Fs = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", Lt = {
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
}, De = {
  artInset: 4.5,
  artRim: 1.5,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function _s(e) {
  if (!e.frameAssetFamily && !V(e).legendary && (e.layout ?? "normal") === "normal" && Re === Fs) {
    const t = e.borderColor ?? (ue(e.setCode).border === "#eeedeb" ? "white" : "black"), r = `${e.setCode?.toLowerCase() ?? ""}/${t}`;
    if (Object.hasOwn(Lt, r)) return Lt[r];
  }
  return ["m15", "m19", "m20", "war"].includes(e.setCode?.toLowerCase() ?? "") ? De.frameInset : 0;
}
const Qe = "#fbf0c5", Ee = "#ccdaf2", Dt = "#9c9995", et = "#edaa8d", We = "#dde6e2", Ns = {
  WU: [Qe, Ee],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [et, Qe],
  WG: [We, Qe],
  UB: [Ee, Dt],
  UR: [Ee, et],
  UG: [We, Ee],
  BR: ["#b4afb5", "#f2b096"],
  BG: [Dt, We],
  RG: [et, We]
};
function Ys(e, t, r) {
  if (!t.land) return;
  const s = Ns[t.frame];
  if (!s) return;
  const a = 34 + r, n = 420 - 2 * r, l = e.createLinearGradient(a, 0, a + n, 0);
  l.addColorStop(0, s[0]), l.addColorStop(0.35, s[0]), l.addColorStop(0.65, s[1]), l.addColorStop(1, s[1]), e.save(), e.globalCompositeOperation = "multiply", e.fillStyle = l, e.fillRect(a, 425, n, 203.5), e.restore();
}
function qs(e, t, r, s) {
  if (!t.land || t.frame !== "Artifact") {
    s();
    return;
  }
  const a = 34 + r, n = 420 - 2 * r;
  for (const l of [!1, !0])
    e.save(), e.beginPath(), l || e.rect(0, 0, 488, 680), e.rect(a, 425, n, 203.5), e.clip("evenodd"), e.filter = `grayscale(1) brightness(${l ? 0.9 : 0.63})`, s(), e.restore();
}
function or(e) {
  if (e.setSymbol) return null;
  const t = e.setCode?.toLowerCase();
  return t === "m15" || t === "war" ? t : null;
}
function ir(e, t, r, s, a, n, l, o, i, c) {
  const [u, h, d, m] = c ? r === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, r === "m15" ? 0.7 : 1.2];
  a += h - l * (u - 1) / 2, n += d - o * (u - 1) / 2, l *= u, o *= u;
  const g = !s || s === "common", p = document.createElement("canvas"), k = 3, S = 4;
  p.width = Math.ceil((l + k * 2) * S), p.height = Math.ceil((o + k * 2) * S);
  const w = p.getContext("2d");
  w.scale(S, S), w.translate(k, k), w.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    0,
    0,
    l,
    o
  ), w.globalCompositeOperation = "source-in";
  const y = s === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : s === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], f = w.createLinearGradient(0, o * 0.65, l, o * 0.35);
  f.addColorStop(0, y[0]), f.addColorStop(0.35, y[1]), f.addColorStop(0.6, y[2]), f.addColorStop(1, y[3]), w.fillStyle = g ? "#111111" : f, w.fillRect(0, 0, l, o);
  const v = r === "m15" ? 32 : 27, R = new Path2D(
    r === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), B = new DOMMatrix().translate(-i[0] * l / i[2], -i[1] * o / i[3]).scale(l / (v * i[2]), o / (32 * i[3])), O = new Path2D();
  O.addPath(R, B), w.globalCompositeOperation = "destination-over", w.fillStyle = g ? "#f8f8f5" : "#111111", w.fill(O), w.strokeStyle = w.fillStyle, w.lineWidth = r === "war" && g ? 2 : m, w.lineJoin = "round", w.stroke(O), e.drawImage(
    p,
    a - k,
    n - k,
    p.width / S,
    p.height / S
  ), p.width = p.height = 0;
}
function Hs(e, t) {
  const r = 52.053333333333335, s = 1255 / 2100 * 680, a = 1346 / 1500 * 488, n = 1861 / 2100 * 680, l = 17 / 1500 * 488, o = 17 / 2100 * 680, i = (u) => {
    e.moveTo(...u[0]);
    for (const h of u.slice(1)) e.lineTo(...h);
    e.closePath();
  };
  e.save();
  const c = e.filter;
  e.filter = "none", e.fillStyle = "#00000047", e.beginPath(), i([
    [r, s],
    [a, s],
    [a - l, s + o],
    [r + l, s + o]
  ]), i([
    [a, s],
    [a, n],
    [a - l, n - o],
    [a - l, s + o]
  ]), e.fill(), e.beginPath(), i([
    [r, s],
    [r + l, s + o],
    [r + l, n - o],
    [r, n]
  ]), i([
    [r, n],
    [r + l, n - o],
    [a - l, n - o],
    [a, n]
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
}, zs = {
  W: { ...Y.por, right: 436.75, centerY: 389.75 },
  U: { ...Y.por, right: 436.5, centerY: 392.75 },
  R: { ...Y.por, right: 433.75, centerY: 392 },
  G: { ...Y.por, right: 434, centerY: 390.75 }
}, Xs = {
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
  por: zs
};
function Ks(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  if (e.setSymbol || !Object.hasOwn(Y, t)) return null;
  const r = pe(e);
  return r.length === 1 && !/\b(?:Land|Artifact)\b/.test(e.typeLine ?? "") ? Xs[t]?.[r[0]] ?? Y[t] : Y[t];
}
function Vs(e) {
  return e.setSymbol || e.setCode?.toLowerCase() !== "exo" ? null : e.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : e.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const st = {
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
}, cr = (e) => `${e}#opaque-print-details-v1`, Js = (e) => Object.keys(st).some((t) => e === `${be.KEYRUNE_ROOT}/${t}.svg`);
async function Zs(e, t) {
  const r = Object.keys(st).find((u) => e === `${be.KEYRUNE_ROOT}/${u}.svg`);
  if (!r) return null;
  const s = new DOMParser().parseFromString(await t.text(), "image/svg+xml"), a = s.documentElement, n = s.querySelectorAll("path"), l = n[0]?.getAttribute("d") ?? "", o = l.match(/M[^M]*/g) ?? [], i = st[r];
  if (a.localName !== "svg" || s.querySelector("parsererror") || n.length !== 1 || o.length !== i.count || o.some((u) => /m/.test(u) || !/[zZ]\s*$/.test(u)))
    throw new Error(`Unexpected pinned ${r} symbol paths.`);
  const c = s.createElementNS("http://www.w3.org/2000/svg", "path");
  return c.setAttribute("d", i.white.map((u) => o[u]).join("")), c.setAttribute("fill", "#fff"), a.replaceChildren(c), new Blob([new XMLSerializer().serializeToString(s)], { type: "image/svg+xml" });
}
function Pe(e, t, [r, s, a, n]) {
  if (!(e > 0 && t > 0)) return [r, s, a, n];
  const l = Math.max(a / e, n / t), o = e * l, i = t * l;
  return [r + (a - o) / 2, s + (n - i) / 2, o, i];
}
function Qs(e, t, r, s) {
  const a = [s[0] * e, s[1] * t, s[2] * e, s[3] * t];
  return [...a, ...Pe(a[2], a[3], r)];
}
function Ae(e, t, r, s, a) {
  const [n, l, o, i] = s;
  if (a === "printing") {
    e.clearRect(n, l, o, i);
    return;
  }
  a === "artwork" && (e.fillStyle = "#80745c", e.fillRect(n, l, o, i));
  const c = r.get(t.illustration ?? "");
  c && (e.save(), e.beginPath(), e.rect(n, l, o, i), e.clip(), t.illustrationCrop ? e.drawImage(
    c,
    ...Qs(c.width, c.height, s, t.illustrationCrop)
  ) : e.drawImage(c, ...Pe(c.width, c.height, s)), e.restore());
}
function dt(e, t, r, s) {
  const a = [];
  for (const n of t.split(`
`)) {
    let l = [], o = 0;
    const i = Ne(n).flatMap(
      (c) => c.symbol ? [{ text: c.symbol, symbol: !0 }] : (c.value.match(/\s+|\S+/g) ?? []).map((u) => ({ text: u, symbol: !1 }))
    );
    for (const c of i) {
      const u = !c.symbol && e.measureText(c.text).width > r ? [...c.text].map((h) => ({ text: h, symbol: !1 })) : [c];
      for (const h of u) {
        const d = h.symbol ? s * 0.94 : e.measureText(h.text).width;
        o + d > r && l.length && (a.push(l), l = [], o = 0), !(!l.length && /^\s+$/.test(h.text)) && (l.push({ ...h, width: d }), o += d);
      }
    }
    a.push(l);
  }
  return a;
}
function le(e, t, r, s, a, n, l = !1) {
  const o = n.get(Ye(t) ?? "");
  if (e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, l) {
    const i = 1.5372 * e.getTransform().a;
    e.shadowColor = "#000d", e.shadowOffsetX = -i, e.shadowOffsetY = i;
  }
  if (e.fillStyle = n.manaColors?.[t] ?? ks[t] ?? Ss, e.beginPath(), e.arc(r + a / 2, s + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.shadowColor = "transparent", o) {
    e.drawImage(o, r, s, a, a), e.restore();
    return;
  }
  e.fillStyle = t === "B" ? "white" : "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = `bold ${a * 0.62}px Georgia`, e.fillText(t, r + a / 2, s + a / 2, a * 0.9), e.restore();
}
function ur(e, t, r, s, a, n, l) {
  const o = typeof n == "number" ? n : n.size;
  e.font = `${typeof n != "number" && n.italic ? "italic " : ""}${o}px "CardRenderer MTG MPlantin", Georgia`;
  const i = t.split(`
`).map((c) => dt(e, c, a, o));
  e.textBaseline = "top";
  for (const c of i) {
    for (const u of c) {
      let h = r;
      for (const d of u)
        d.symbol ? le(e, d.text, h + o * 0.07, s + o * 0.03, o * 0.8, l) : e.fillText(d.text, h, s), h += d.width;
      s += o;
    }
    s += E.paragraphGap;
  }
}
function wa(e, t, r) {
  if (e.measureText(t).width <= r) return t;
  const s = [...t];
  for (; s.length && e.measureText(`${s.join("")}…`).width > r; ) s.pop();
  return s.length || e.measureText("…").width <= r ? `${s.join("")}…` : "";
}
function xe(e, t, r, s, a, n, l = !1, o = 1, i = "CardRenderer MTG Beleren") {
  if (!(a > 0)) throw Error("Magic title/type plate has no text space.");
  e.save(), e.font = `${l ? "bold " : ""}${n}px "${i}", Georgia`;
  const c = e.measureText(t).width;
  o > 1 && c * o > a && (o = 1), o !== 1 && (e.translate(r, 0), e.scale(o, 1), r = 0, a /= o), c > a && (n = Math.max(n * 0.78, n * a / c), e.font = `${l ? "bold " : ""}${n}px "${i}", Georgia`), e.fillText(t, r, s, a), e.restore();
}
function mt(e, t, r, s, a, n, l, o, i = [0, 0, 1, 1]) {
  const c = [
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height
  ], u = {
    uncommon: "#aaaeb2",
    rare: "#bc923f",
    mythic: "#c65c2d",
    special: "#8664af",
    bonus: "#bc923f"
  }[s ?? "common"];
  if (!u || ["forge", "glint"].includes(r?.toLowerCase() ?? "")) {
    e.drawImage(t, ...c, a, n, l, o);
    return;
  }
  const h = document.createElement("canvas");
  h.width = Math.max(1, Math.ceil(l * 2)), h.height = Math.max(1, Math.ceil(o * 2));
  const d = h.getContext("2d");
  d.drawImage(t, ...c, 0, 0, h.width, h.height), d.globalCompositeOperation = "source-in", d.fillStyle = u, d.fillRect(0, 0, h.width, h.height), e.drawImage(h, a, n, l, o), h.width = h.height = 0;
}
function e0(e, t, r, s = !1) {
  hr(
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
function t0(e, t, r, s = !1) {
  hr(
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
function hr(e, t, r, s, a) {
  t.forEach((n, l) => {
    const { size: o } = s, i = s.right - (t.length - 1 - l) * s.pitch - o / 2, c = s.centerY - o / 2;
    if (n !== "W" || a) {
      le(e, n, i, c, o, r, !1);
      return;
    }
    mr(e, i, c, o, s.whiteSize, r.manaColors?.W);
  });
}
const dr = (e, t, r, s, a, n) => {
  if (t !== "W") return le(e, t, r, s, a, n);
  mr(e, r, s, a, a * 0.87, n.manaColors?.W);
};
function mr(e, t, r, s, a, n = "#efe7cb") {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = n, e.beginPath(), e.arc(t + s / 2, r + s / 2, s / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = '100px "CardRenderer MTG Historic Symbols"', e.textAlign = "left", e.textBaseline = "alphabetic";
  const l = "", o = e.measureText(l), i = o.actualBoundingBoxLeft + o.actualBoundingBoxRight, c = o.actualBoundingBoxAscent + o.actualBoundingBoxDescent, u = a / Math.max(i, c);
  e.translate(t + s / 2, r + s / 2), e.scale(u, u), e.fillText(
    l,
    (o.actualBoundingBoxLeft - o.actualBoundingBoxRight) / 2,
    (o.actualBoundingBoxAscent - o.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function r0(e, t, r, s, a, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0;
  const l = document.createElement("canvas");
  l.width = e.canvas.width, l.height = e.canvas.height;
  const o = l.getContext("2d");
  if (!o) throw Error("Retro lettering needs a Canvas2D context");
  const i = e.getTransform();
  o.font = e.font, o.textAlign = e.textAlign, o.textBaseline = e.textBaseline, o.letterSpacing = e.letterSpacing, e.resetTransform();
  for (const [c, u, h] of [
    [0, n, "#f2eee3"],
    [n, 0, "#17140f"]
  ])
    o.resetTransform(), o.clearRect(0, 0, l.width, l.height), o.setTransform(i), o.globalCompositeOperation = "source-over", o.fillStyle = h, o.fillText(t, r + c, s + c, a), o.globalCompositeOperation = "destination-out", o.fillText(t, r + u, s + u, a), e.drawImage(l, 0, 0);
  l.width = l.height = 0, e.restore();
}
function gt(e, t, r, s, a, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#17140f", e.fillText(t, r + n, s + n, a), e.fillStyle = "#ababab", e.fillText(t, r, s, a), e.restore();
}
function s0(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function a0(e, t) {
  e.save(), e.font = '22.5px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", gt(e, `Illus. © ${t}`, 49, 631, 338, 1.25), e.restore();
}
function bt(e) {
  if (!e.frameAssetFamily) return null;
  if (fe(e) || e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
    throw Error("Replacement frame plates currently support ordinary modern faces only.");
  const t = e.frameAssetFamily === "eighth", r = V(e), s = pe(e), a = s.length === 2 && "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 ? [...s].reverse() : s, l = `${ge}/img/frames/${t ? "8th" : "m15/new"}`, o = r.land ? "l" : r.artifact ? "a" : /\bVehicle\b/.test(e.typeLine ?? "") ? "v" : s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c", i = (g) => t ? `${g.toLowerCase()}l` : `l${g.toLowerCase()}`, c = r.land && a.length ? i(a.length > 2 ? "m" : a[0]) : o, u = r.land && a.length === 2 ? i(a[1]) : void 0, h = o === "l" ? t ? "l" : "c" : o, d = t ? [0.09, 0.0629, 0.824, 0.0429] : [168 / 2010, 145 / 2814, 0.8292, 0.0543], m = t ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358] : [168 / 2010, 1588 / 2814, 0.8292, 0.0543];
  return {
    frame: `${l}/${c}.png`,
    rightFrame: u ? `${l}/${u}.png` : void 0,
    border: `${l}/border.png`,
    pt: t ? `${ge}/img/frames/8th/pt/${h === "c" ? "l" : h}.png` : `${ge}/img/frames/m15/regular/m15PT${h.toUpperCase()}.png`,
    rects: {
      ...N,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title: d,
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
      center: d[1] + d[3] / 2 + (t ? 1 : -4) / 680,
      size: t ? 22 : 23.4,
      gap: 1.5
    },
    symbol: t ? { right: 0.9079 - 2 / 488, center: 0.5886, width: 0.114, height: 0.0391 * 0.95 } : { right: 1862 / 2010 - 2 / 488, center: 0.591, width: 0.114, height: 0.041 * 0.95 }
  };
}
function n0(e) {
  const t = bt(e);
  return t ? [
    t.frame,
    ...t.rightFrame ? [t.rightFrame] : [],
    ...e.power != null && e.toughness != null ? [t.pt] : [],
    ...ue(e.setCode, e.borderColor).border !== "#090806" ? [t.border] : []
  ] : null;
}
function He(e) {
  const t = e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "");
  return (e.rulesText ?? "").split(`
`).filter((r) => r.trim()).map((r) => {
    const s = t ? r.match(/^\s*([IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*)\s*[—–-]\s*(.+)$/) : null;
    if (s)
      return { text: s[2], badges: s[1].split(/\s*,\s*/), reminder: !1 };
    const a = t ? null : r.match(/^\s*\[?([+−-]?(?:\d+|X))\]?\s*:\s*(.*)$/i);
    return a ? {
      text: a[2],
      badges: [a[1].replace("-", "−").toUpperCase()],
      reminder: !1
    } : { text: r, badges: [], reminder: t && /^\s*\(/.test(r) };
  });
}
function ee(e) {
  return e.layout === "ability" ? "normal" : e.layout === "adventure" && e.faces?.length === 2 ? "adventure" : e.layout === "class" || /\bClass\b/i.test(e.typeLine ?? "") ? "class" : e.layout === "leveler" || /^Level up\b/m.test(e.rulesText ?? "") ? "leveler" : e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "") ? "saga" : e.layout === "planeswalker" || /\bPlaneswalker\b/i.test(e.typeLine ?? "") ? He(e).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function oe(e) {
  const t = bt(e);
  if (t) return t.rects;
  if (fe(e)) return it(e);
  const r = ee(e);
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
    const s = r === "planeswalker-large", a = [
      0.04409,
      s ? 0.55118 : 0.62655,
      0.88827,
      s ? 0.37534 : 0.29997
    ], n = N.stamp[2], l = N.stamp[3];
    return {
      ...N,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, 0.92126 * b * 3793 / 2778 / j],
      frame: [0.04724, 0.02655, 0.91339, 0.91339 * b * 3810 / 2736 / j],
      art: [0.06299, 0.09224, 0.86614, (s ? 0.49044 : 0.55793) - 0.09224],
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / b,
        (s ? 0.49044 : 0.55793) + 5 / j,
        0.88662,
        0.05737
      ],
      rules: a,
      stats: [0.792 + 1 / b, 0.881 - 3 / j, 0.16, 0.069],
      stamp: [
        a[0] + (a[2] - n) / 2,
        a[1] + (a[3] - l) / 2,
        n,
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
      N.art[0] + De.artInset / b,
      N.art[1],
      N.art[2] - 2 * De.artInset / b,
      N.art[3]
    ]
  };
}
function l0(e) {
  const t = ee(e) === "saga", r = oe(e).rules, s = He(e), a = r[2] * 488 - (t ? 32 : 70), n = r[3] * 680;
  let l = t ? 21 : 19;
  const o = (k, S) => Math.max(1, Math.ceil(k.length * S * 0.49 / a)), i = (k, S) => Math.max(t ? k.badges.length * 36 : 34, o(k.text, S) * S + 16), c = (k) => s.reduce((S, w) => S + i(w, k), 0);
  for (; l > 8 && c(l) > n; ) l -= 0.5;
  const u = s.map((k) => i(k, l)), h = Math.max(0, n - c(l)) / Math.max(1, s.length);
  let d = n / Math.max(1, s.length), m = n, g = s.length;
  if (!t)
    for (const k of [...u].sort((S, w) => w - S)) {
      if (k <= d) break;
      m -= k, d = m / Math.max(1, --g);
    }
  let p = 0;
  return s.map((k, S) => {
    const w = t ? u[S] + h : Math.max(d, u[S]), y = { ...k, top: p, height: w, font: l, left: t ? 27 : 62, width: a };
    return p += w, y;
  });
}
const at = (e, t = !1) => `${t ? "italic " : ""}${e}px "CardRenderer MTG MPlantin", Georgia`;
function o0(e) {
  const t = [];
  let r = [], s = !1;
  const a = () => {
    r.length && (t.push({ pieces: r, space: s }), r = [], s = !1);
  };
  for (const n of e)
    for (const l of Ne(n.text))
      if (l.symbol) r.push({ text: l.symbol, symbol: !0, italic: !1 });
      else
        for (const o of l.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(o) ? (a(), o === `
` ? (t.push({ pieces: [], space: !1, newline: !0 }), s = !1) : s = !0) : r.push({ text: o, symbol: !1, italic: !!n.italic });
  return a(), t;
}
function Le(e, t, r) {
  const s = [];
  for (const a of t) {
    const n = s.at(-1);
    n && !n.symbol && !a.symbol && n.italic === a.italic ? n.text += a.text : s.push({ ...a });
  }
  return s.map((a) => {
    e.font = at(r, a.italic);
    const n = e.measureText(a.text);
    return {
      ...a,
      size: r,
      width: a.symbol ? r * 0.88 : n.width,
      ascent: a.symbol ? r * 0.72 : n.actualBoundingBoxAscent,
      descent: a.symbol ? r * 0.08 : n.actualBoundingBoxDescent,
      inkLeft: a.symbol ? r * 0.025 : -n.actualBoundingBoxLeft,
      inkRight: a.symbol ? r * 0.825 : n.actualBoundingBoxRight
    };
  });
}
function gr(e, t, r, s) {
  const a = [];
  let n = [];
  for (const l of t) {
    if (l.newline) {
      a.push(Le(e, n, s)), n = [];
      continue;
    }
    const o = n.length && l.space ? [{ text: " ", italic: l.pieces[0]?.italic ?? !1, symbol: !1 }] : [], i = Le(e, [...n, ...o, ...l.pieces], s);
    n.length && i.reduce((c, u) => c + u.width, 0) > r ? (a.push(Le(e, n, s)), n = [...l.pieces]) : n.push(...o, ...l.pieces);
  }
  return n.length && a.push(Le(e, n, s)), a;
}
function At(e, t, r, s) {
  const a = gr(e, t, r, s);
  if (a.length < 2) return a;
  const n = /* @__PURE__ */ new Map(), l = (h, d) => {
    const m = `${h}:${d}`;
    let g = n.get(m);
    if (!g) {
      const p = [];
      for (let k = h; k < d; k++) {
        const S = t[k];
        k > h && S.space && p.push({ text: " ", italic: S.pieces[0]?.italic ?? !1, symbol: !1 }), p.push(...S.pieces);
      }
      g = Le(e, p, s), n.set(m, g);
    }
    return g;
  }, o = /* @__PURE__ */ new Map(), i = (h, d) => {
    if (!d) return h === t.length ? { cost: 0, cuts: [] } : null;
    const m = `${h}:${d}`;
    if (o.has(m)) return o.get(m);
    let g = null;
    for (let p = h + 1; p <= t.length - d + 1; p++) {
      const k = l(h, p).reduce((y, f) => y + f.width, 0);
      if (k > r) break;
      const S = i(p, d - 1);
      if (!S) continue;
      const w = S.cost + (r - k) ** 2;
      (!g || w < g.cost) && (g = { cost: w, cuts: [p, ...S.cuts] });
    }
    return o.set(m, g), g;
  }, c = i(0, a.length);
  if (!c) return a;
  let u = 0;
  return c.cuts.map((h) => {
    const d = l(u, h);
    return u = h, d;
  });
}
function Ot(e, t, r, s, a = !1) {
  const n = o0(t);
  if (!a || n.length > 64) return gr(e, n, r, s);
  const l = [];
  let o = [];
  for (const i of n)
    i.newline ? (l.push(...o.length ? At(e, o, r, s) : [[]]), o = []) : o.push(i);
  return o.length && l.push(...At(e, o, r, s)), l;
}
const Fe = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function he(e, t, r, s = 24, a = 15, n = Fe) {
  e.save(), e.letterSpacing = "0px", e.textBaseline = "alphabetic", e.textAlign = "left";
  try {
    let l, o = s;
    do {
      const i = [], c = [];
      let u = 0, h;
      for (const f of t) {
        let v = o, R = Ot(
          e,
          f.runs,
          r.width,
          v,
          n.balanceLines
        );
        if (f.role === "flavor" && n.flavorOrphans !== !1 && R.length > 2 && R.at(-1).reduce((B, O) => B + O.width, 0) < r.width * 0.3)
          for (let B = v - 0.25; B >= v * 0.94; B -= 0.25) {
            const O = Ot(
              e,
              f.runs,
              r.width,
              B,
              n.balanceLines
            );
            if (O.length < R.length) {
              v = B, R = O;
              break;
            }
          }
        if (R.length) {
          h && (h === "rules" && f.role === "flavor" ? u += o * n.flavorGap : (h !== "flavor" || f.role !== "flavor") && (u += o * n.paragraphGap));
          for (const B of R) {
            const O = Math.max(0, ...B.map((U) => U.ascent)), M = Math.max(0, ...B.map((U) => U.descent)), T = B.reduce((U, q) => U + q.width, 0), G = r.x + (f.align === "right" ? r.width - T : f.align === "center" ? (r.width - T) / 2 : 0);
            let W = 0, C = 1 / 0, $ = -1 / 0;
            for (const U of B)
              C = Math.min(C, W + U.inkLeft), $ = Math.max($, W + U.inkRight), W += U.width;
            i.push({
              x: G,
              runs: B,
              role: f.role,
              baseline: u,
              width: T,
              inkBounds: [
                G + (B.length ? C : 0),
                u - O,
                B.length ? $ - C : 0,
                O + M
              ]
            }), u += v * n.leading;
          }
          h = f.role;
        }
      }
      if (n.flavorSeparator !== !1)
        for (let f = 1; f < i.length; f++) {
          const v = i[f - 1], R = i[f];
          if (v.role !== "rules" || R.role !== "flavor") continue;
          const B = v.inkBounds[1] + v.inkBounds[3];
          c.push((B + R.inkBounds[1]) / 2 - 0.3);
        }
      const d = i[0]?.inkBounds[1] ?? 0, m = i.at(-1)?.inkBounds, g = m ? m[1] + m[3] - d : 0, p = Math.max(0, r.height - g), k = r.y + Math.max(0, Math.min(p, p / 2 + (n.centerOffset ?? 0))), S = Math.max(r.y, r.verticalLimits?.[0] ?? r.y), w = Math.min(
        r.y + r.height,
        r.verticalLimits?.[1] ?? r.y + r.height
      ), y = Math.max(S, Math.min(w - g, k)) - d;
      if (l = {
        size: o,
        x: r.x,
        top: d + y,
        width: r.width,
        height: g,
        overflow: g > w - S + 0.01 || i.some((f) => f.width > r.width + 0.01),
        lines: i.map((f) => ({
          ...f,
          baseline: f.baseline + y,
          inkBounds: [
            f.inkBounds[0],
            f.inkBounds[1] + y,
            f.inkBounds[2],
            f.inkBounds[3]
          ]
        })),
        separators: c.map((f) => f + y)
      }, l.overflow ||= l.lines.some(
        (f) => r.exclusions?.some(([v, R, B, O]) => {
          const [M, T, G, W] = f.inkBounds;
          return M < v + B && M + G > v && T < R + O && T + W > R;
        })
      ), !l.overflow || o <= a) break;
      o = Math.max(a, o - 0.25);
    } while (!0);
    return l;
  } finally {
    e.restore();
  }
}
function br(e, t, r, s, a, n, l, o, i = 1 / 0) {
  const c = (m) => (m.align === void 0 || m.align === "center") && m.runs.length > 0 && m.runs.every((g) => !g.text.includes(`
`));
  if (!r.length || !r.every(c) || !t.every(c)) return null;
  const u = r.map((m) => m.runs.map((g) => g.text).join("")).join(`
`);
  if (Array.from(u.replace(/\{[^}]+\}/g, "●")).length > i) return null;
  const h = (m) => m.map((g) => ({ ...g, align: "center" })), d = he(e, h(r), s, a, a, o);
  return d.overflow || d.lines.length > l ? null : he(e, h(t), s, a, n, o);
}
const i0 = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function c0(e) {
  return !i0.has(e?.trim().toLowerCase() ?? "");
}
function pr(e, t, r = j, s = 1) {
  const a = oe(t), n = {
    ...Fe,
    flavorSeparator: t.frameAssetFamily === "eighth" ? !1 : c0(t.setCode)
  }, [l, o, i, c] = a.rules, u = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((m) => ({ role: "rules", runs: [{ text: m }] })), h = {
    x: l * b + (t.frameAssetFamily ? 0 : 3.5),
    y: o * r + (t.frameAssetFamily ? 0 : 7),
    width: i * b - (t.frameAssetFamily ? 0 : 9.5),
    height: c * r - (t.frameAssetFamily ? 0 : 8),
    // Fit actual line ink around the existing power/toughness plate. Short
    // final lines can use the lower left area without being painted over.
    exclusions: t.power != null && t.toughness != null ? [
      [
        a.stats[0] * b - 2,
        a.stats[1] * r - 2,
        a.stats[2] * b + 4,
        a.stats[3] * r + 4
      ]
    ] : []
  }, d = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? u : u;
  if (t.rulesAlignment?.mode !== "left" && ["10e", "m10", "m11", "m12", "m13", "m14"].includes(t.setCode?.toLowerCase() ?? "") && d.every((m) => m.role === "rules")) {
    const m = br(
      e,
      u,
      d,
      h,
      24.5 * s,
      15 * s,
      3,
      { ...n, balanceLines: !0 }
    );
    if (m) return m;
  }
  return he(
    e,
    t.rulesAlignment?.mode === "left" ? u.map((m) => ({ ...m, align: "left" })) : u,
    h,
    24.5 * s,
    15 * s,
    n
  );
}
function ze(e, t, r, s = le, a = 0) {
  if (t.overflow) throw Error("Magic rules text does not fit the available area.");
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", e.letterSpacing = "0px";
  for (const o of t.separators) {
    const i = e.createLinearGradient(t.x, o, t.x + t.width, o);
    i.addColorStop(0, "#17140f00"), i.addColorStop(0.15, "#17140f55"), i.addColorStop(0.85, "#17140f55"), i.addColorStop(1, "#17140f00"), e.fillStyle = i, e.fillRect(t.x, o, t.width, 0.6);
  }
  e.fillStyle = "#17140f";
  const n = a > 0 ? document.createElement("canvas") : null;
  n && (n.width = e.canvas.width, n.height = e.canvas.height);
  const l = n ? n.getContext("2d") : e;
  if (!l) throw Error("Missing rules text context");
  n && (l.setTransform(e.getTransform()), l.textAlign = "left", l.textBaseline = "alphabetic", l.letterSpacing = "0px", l.fillStyle = "#17140f");
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
      ) : (l.font = at(c.size, c.italic), l.fillText(c.text, i, o.baseline)), i += c.width;
  }
  if (n) {
    l.globalCompositeOperation = "destination-out", l.lineJoin = "round";
    for (const o of t.lines) {
      let i = o.x ?? t.x;
      for (const c of o.runs)
        c.symbol || (l.font = at(c.size, c.italic), l.lineWidth = c.size * a * 2, l.strokeText(c.text, i, o.baseline)), i += c.width;
    }
    e.resetTransform(), e.drawImage(n, 0, 0), n.width = n.height = 0;
  }
  e.restore();
}
const _e = (e) => e?.runs.map((t) => t.text).join("") ?? "", Gt = (e) => e.length === 2 && /^[A-Za-z ,]+$/.test(_e(e[0])) && _e(e[0]).length <= 20;
function u0(e, t, r, s, a, n, l, o) {
  const i = (m) => m.role === "rules" && m.runs.length > 0 && !_e(m).includes(`
`) && m.align === void 0;
  if (!r.length || !r.every(i) || t.some((m) => m.align) || r.length !== 1 && !Gt(r)) return null;
  const c = (m) => m.map(
    (g, p) => ({
      ...g,
      align: g.align ?? (g.role === "flavor" || Gt(m) && p === 0 && !/^Enchant\b/.test(_e(g)) ? "left" : "center")
    })
  ), u = { x: 70, y: s - 6, width: 348, height: a - 8 }, h = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, d = he(e, c(r), u, n, n, h);
  return d.overflow || d.lines.length > 5 ? null : he(
    e,
    c(t),
    { ...u, verticalLimits: o },
    n,
    l,
    h
  );
}
function fr(e) {
  return e.rulesParagraphs ?? e.rulesText.split(`
`).filter(Boolean).map((t) => ({ role: "rules", runs: [{ text: t }] }));
}
function ka(e, t, r = "oracle", s = {}) {
  const a = t[r];
  if (!a) throw Error(`Missing ${r} printing wording`);
  if (typeof a.typeLine != "string" || typeof a.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const n = s.rulesAlignment ?? r, l = n === "left" ? void 0 : t[n];
  if (n !== "left" && !l) throw Error(`Missing ${n} alignment wording`);
  const o = V({ ...e, typeLine: t.oracle.typeLine });
  return {
    ...e,
    ...a,
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: a.rulesParagraphs,
    rulesAlignment: l ? { mode: "auto", reference: fr(l) } : { mode: "left" },
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
function h0(e, t) {
  if (ct(t)) return null;
  const [r, s, a, n] = ae(it(t).rules), l = lt(t), o = l?.paragraphs ?? fr({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), i = t.rulesAlignment?.mode === "left", c = i ? o.map((M) => ({ ...M, align: "left" })) : o, u = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? c : c, h = t.wordingMode === "oracle" ? 10 : 15, d = t.setCode?.toLowerCase(), m = d === "lea" && t.wordingMode === "oracle" ? [428, 590] : void 0, g = ["lea", "leb", "2ed"].includes(d ?? ""), p = g || d === "3ed" && ne(t) === "fourth";
  if (p && !i) {
    const M = u0(
      e,
      c,
      u,
      s,
      n,
      g ? 32.5 : 27.5,
      h,
      m
    );
    if (M) return M;
  }
  const k = u.length === 1 ? u[0] : void 0, S = k?.runs.length === 1 ? k.runs[0] : void 0;
  if (!i && d === "4ed" && ne(t) === "fourth" && u.some((M) => M.role === "flavor")) {
    const M = br(
      e,
      c,
      u,
      { x: 72, y: s + 2, width: 344, height: n - 8 },
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
    if (M) return M;
  }
  const w = !i && d === "4ed" && ne(t) === "fourth" && c.every((M) => M.align === void 0 || M.align === "center") && k?.role === "rules" && (k.align === void 0 || k.align === "center") && S && !S.italic && !S.text.includes(`
`) && S.text.length > 0 && S.text.length <= 100, y = (p || d === "4ed" && ne(t) === "fourth") && (c.length > 1 || c.reduce((M, T) => M + T.runs.reduce((G, W) => G + W.text.length, 0), 0) > 100), f = y && p, v = y && d === "4ed", R = (d === "mir" || d === "tmp") && !l && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") && pe(t).join("") === "W", B = he(
    e,
    w ? c.map((M) => ({ ...M, align: "center" })) : c,
    {
      x: p ? 70 : v || w ? 72 : r,
      y: s + (l ? 1.5 : w ? -6 : v ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: p ? 346 : v || w ? 344 : a + (R ? 10 : 0),
      height: n - 8,
      verticalLimits: m
    },
    l ? 24 : w ? 25 : 22.5,
    h,
    w ? { ...Be, leading: 1, balanceLines: !0 } : y ? {
      ...Be,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: f ? -10 : 0
    } : Be
  ), O = c.reduce(
    (M, T) => M + T.runs.reduce((G, W) => G + W.text.length, 0),
    0
  );
  return !f || O <= 270 || B.size >= 22 ? B : he(
    e,
    c,
    { x: 70, y: s + 4, width: 346, height: n + 8, verticalLimits: m },
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
function d0(e) {
  return e.setCode?.toLowerCase() === "3ed" && ne(e) === "fourth";
}
function m0(e, t, r, s, a) {
  e.save(), e.font = '26px "CardRenderer MTG Goudy", Georgia', gt(e, t, 40, s, a + r - 40, 1), e.restore();
}
function g0(e, t, r) {
  e.save(), e.font = '26px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "right", r0(e, t, 451, r + 12, 130, 1.25), e.restore();
}
function b0(e, t) {
  e.save(), e.font = '22px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", gt(e, `Illus. © ${t}`, 50, 642, 338, 1.25), e.restore();
}
function p0(e) {
  return ["4ed", "5ed"].includes(e.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(e.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function Et(e) {
  const t = String(e.toughness ?? ""), r = e.wordingMode !== "oracle" && e.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(t) ? `(${t})` : t;
  return `${e.power ?? ""}/${r}`;
}
function f0(e) {
  const t = e.setCode?.toLowerCase(), r = t === "4ed" && !/\bLand\b/.test(e.typeLine ?? "");
  if (t !== "mir" && t !== "tmp" && !r) return null;
  const s = pe(e);
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
const pt = (e, t, r, s, a, n) => {
  if (t !== "T") return le(e, t, r, s, a, n);
  wr(e, r, s, a, "", 0.88);
}, nt = (e, t, r, s, a, n) => {
  if (t !== "T") return dr(e, t, r, s, a, n);
  wr(e, r, s, a, "", 0.8);
}, w0 = (e, t, r, s, a, n) => {
  if (t !== "T") return le(e, t, r, s, a, n);
  pt(e, t, r, s, a, n);
}, k0 = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function S0(e) {
  const t = e?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(t) || ["lea", "leb", "2ed", "arn", "atq"].includes(t) ? nt : t === "4ed" ? w0 : k0.has(t) ? pt : le;
}
function wr(e, t, r, s, a, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#c9c4be", e.beginPath(), e.arc(t + s / 2, r + s / 2, s / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = `${s * n}px "CardRenderer MTG Historic Symbols"`, e.textAlign = "left", e.textBaseline = "alphabetic";
  const l = e.measureText(a);
  e.fillText(
    a,
    t + (s - l.actualBoundingBoxLeft - l.actualBoundingBoxRight) / 2 + l.actualBoundingBoxLeft,
    r + (s + l.actualBoundingBoxAscent - l.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function y0(e, t, r, s, a, n, l, o = [0, 0, 1, 1], i = null, c = "low") {
  const u = document.createElement("canvas"), h = Math.ceil(l * 2) + 1;
  u.width = Math.ceil(a * 2) + h * 2, u.height = Math.ceil(n * 2) + h * 2;
  const d = u.getContext("2d");
  d.imageSmoothingQuality = c, d.drawImage(
    t,
    o[0] * t.width,
    o[1] * t.height,
    o[2] * t.width,
    o[3] * t.height,
    h,
    h,
    a * 2,
    n * 2
  ), d.globalCompositeOperation = "source-in", d.fillStyle = "#fff", d.fillRect(0, 0, u.width, u.height), e.save(), e.shadowColor = "transparent";
  for (let m = 0; l > 0 && m < 16; m++) {
    const g = m * Math.PI / 8;
    e.drawImage(
      u,
      r - h / 2 + Math.cos(g) * l,
      s - h / 2 + Math.sin(g) * l,
      u.width / 2,
      u.height / 2
    );
  }
  if (d.fillStyle = "#17140f", i) {
    const m = d.createLinearGradient(h, h, h + a * 2, h);
    i.forEach((g, p) => m.addColorStop(p / 2, g)), d.fillStyle = m;
  }
  d.fillRect(0, 0, u.width, u.height), e.drawImage(u, r - h / 2, s - h / 2, u.width / 2, u.height / 2), e.restore(), u.width = u.height = 0;
}
function v0(e, t, r) {
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", t.artist && (e.fillStyle = "#f2eee3", e.shadowColor = "#000", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = `${r.artistSize}px "CardRenderer MTG MPlantin", Georgia`, e.fillText(`Illus. ${t.artist}`, r.artistX, r.artistBaseline, 338)), e.shadowColor = "transparent", e.fillStyle = r.legalLight ? "#f2eee3" : "#17140f", e.font = `${r.legalSize}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && e.fillText(r.legalText, r.artistX, r.legalBaseline, 380), e.restore();
}
function R0(e, t, r, s, a) {
  const n = it(t), l = f0(t), o = d0(t);
  if (a === "artwork") {
    Ae(e, t, r, ae(n.art), a);
    return;
  }
  e.fillStyle = Ct(t), e.fillRect(0, 0, 488, 680), e.fillStyle = "#686050", e.fillRect(24.4, 27.2, 439.2, 625.6), e.fillStyle = "#e5dec5", e.fillRect(...ae(n.rules)), e.fillStyle = "#746b58", e.fillRect(...ae(n.art)), s && e.drawImage(s, 0, 0, 488, 680), Ae(e, t, r, ae(n.art), a);
  const i = r.get(Te(t));
  if (i && (e.save(), e.filter = gs(t), e.drawImage(i, ...ae(n.frame)), Te(t).endsWith("/seventh/regular/m.png") && Hs(e, i), e.restore()), ce(t) !== "black" || ne(t) === "fourth") {
    const I = r.get(rr(t));
    if (I) {
      const x = document.createElement("canvas");
      x.width = 732, x.height = 1020;
      const _ = x.getContext("2d");
      _.drawImage(I, 0, 0, 732, 1020), _.globalCompositeOperation = "source-in", _.fillStyle = Ct(t), _.fillRect(0, 0, 732, 1020), e.drawImage(x, ...ae(n.frame)), x.width = x.height = 0;
    }
  }
  e.fillStyle = Mt(t), e.textBaseline = "middle", e.textAlign = "left", e.letterSpacing = "0px";
  const [c, u, h, d] = ae(n.title), m = t.manaSymbols ?? [], g = l?.manaSize ?? 23.4, p = l?.manaGap ?? 1.7, k = m.length * (g + p), S = l ? l.manaRight - k + p : c + h - k;
  e.shadowColor = "#000b", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const w = l?.titleX ?? c, y = u + d / 2 + (l?.titleYOffset ?? 0), f = Math.max(
    1,
    m.length ? S - w - 5 : l?.titleX == null ? h - 5 : c + h - w - 5
  );
  o ? m0(e, t.name, w, y, f) : e.fillText(t.name, w, y, f);
  const v = t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle", R = t.symbolStyle === "original" || t.symbolStyle === void 0 && t.wordingMode === "original", B = R && ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  o ? e0(e, m, r, v) : ["lea", "2ed"].includes(t.setCode?.toLowerCase() ?? "") ? t0(e, m, r, v) : m.forEach(
    (I, x) => (B ? dr : le)(
      e,
      I,
      S + x * (g + p),
      l?.manaTop ?? u + d / 2 - g / 2,
      g,
      r,
      !l
    )
  );
  const [O, M, T, G] = ae(n.type), W = sr(t) ?? "", C = r.get(W), $ = Ks(t), U = Vs(t), q = C ? Math.min(44 / C.width, (l?.setHeight ?? 23.4) / C.height) : 0, H = $?.width ?? (C?.width ?? 0) * q, D = $?.height ?? (C?.height ?? 0) * q, F = [
    ($?.right ?? l?.setRight ?? O + T) - H,
    ($?.centerY ?? l?.setCenterY ?? M + G / 2) - D / 2,
    H,
    D
  ], A = ht(t, W, F, "retro");
  if (e.font = '21.7px "CardRenderer MTG MPlantin", Georgia', e.fillText(
    lt(t)?.typeLine ?? t.typeLine ?? "",
    l?.typeX ?? O,
    M + G / 2,
    C ? Math.max(
      1,
      Math.min(
        T - 48,
        $ ? $.right - $.width - O - 6 : T,
        A !== F ? A[0] - (l?.typeX ?? O) - 6 : T
      )
    ) : T
  ), C) {
    const I = Math.min(44 / C.width, (l?.setHeight ?? 23.4) / C.height), x = $?.width ?? C.width * I, _ = $?.height ?? C.height * I, re = $?.right ?? l?.setRight ?? O + T, J = $?.centerY ?? l?.setCenterY ?? M + G / 2, Z = $?.crop ?? [0, 0, 1, 1], de = Oe(W), se = !de && !t.setSymbol && r.get(cr(W));
    se && (e.save(), e.shadowColor = "transparent", t.setCode?.toLowerCase() === "arn" && (e.filter = "brightness(0.7)"), e.drawImage(
      se,
      Z[0] * se.width,
      Z[1] * se.height,
      Z[2] * se.width,
      Z[3] * se.height,
      re - x,
      J - _ / 2,
      x,
      _
    ), e.restore()), de || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(C, ...A), e.restore()) : U || l || Kt(t.setCode) ? y0(
      e,
      C,
      re - x,
      J - _ / 2,
      x,
      _,
      $?.outline ?? (U ? 2 : l?.setOutline ?? Nr(t.setCode)),
      Z,
      U,
      $?.sampling
    ) : mt(
      e,
      C,
      t.setCode,
      t.rarity,
      O + T - C.width * I,
      M + G / 2 - C.height * I / 2,
      C.width * I,
      C.height * I
    );
  }
  e.shadowColor = "transparent";
  const [te, z, we, ke] = ae(n.rules);
  e.fillStyle = "#17140f";
  const X = r.get(ct(t) ?? "");
  if (X) {
    const I = Math.min(we * 0.4 / X.width, ke * 0.75 / X.height);
    e.drawImage(
      X,
      te + (we - X.width * I) / 2,
      z + (ke - X.height * I) / 2,
      X.width * I,
      X.height * I
    );
  } else {
    const I = h0(e, t);
    I && ze(
      e,
      I,
      r,
      v ? le : R ? S0(t.setCode) : t.setCode?.toLowerCase() === "3ed" ? nt : l ? pt : le,
      t.setCode?.toLowerCase() === "lea" ? 0.012 : 0
    );
  }
  if (e.shadowColor = l?.statsOpaqueShadow ? "#000" : "#000b", l && (e.shadowOffsetX = e.shadowOffsetY = l.statsShadow * e.getTransform().a), e.fillStyle = Mt(t), e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", t.power != null && t.toughness != null) {
    const [I, x, _, re] = ae(n.stats), J = p0(t);
    e.textAlign = J ? "right" : "center", o ? g0(e, Et(t), x + re / 2) : e.fillText(
      Et(t),
      J?.right ?? I + _ / 2,
      x + re / 2 + (J?.yOffset ?? 0),
      J?.maxWidth ?? _
    );
  }
  if (o && t.artist) b0(e, t.artist);
  else if (t.artist && s0(t)) a0(e, t.artist);
  else if (l) v0(e, t, l);
  else if (t.artist) {
    const [I, x, _, re] = ae(n.footer);
    e.textAlign = "center", e.font = '15.6px "CardRenderer MTG MPlantin", Georgia', e.fillText(`Illus. ${t.artist}`, I + _ / 2, x + re / 2, _);
  }
  e.shadowColor = "transparent";
}
const C0 = (e, t = {}) => fetch(e, { ...t, mode: "cors" });
let Wt;
const M0 = [
  ["CardRenderer MTG Goudy", hs],
  ["CardRenderer MTG Historic Symbols", us]
];
function T0() {
  return typeof FontFace != "function" ? Promise.resolve() : Wt ??= Promise.all(
    M0.map(async ([e, t]) => {
      if ([...document.fonts].some(
        (s) => s.family.replace(/^"|"$/g, "") === e && s.status === "loaded"
      ))
        return;
      const r = await C0(t);
      if (!r.ok) throw Error(`Retro font unavailable: ${e}`);
      document.fonts.add(await new FontFace(e, await r.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((e) => {
    throw Wt = void 0, e;
  });
}
const j0 = `${Re}/img/class_level_bg.webp`, kr = (e) => ["adventure", "class", "leveler"].includes(ee(e)), ye = (e, t, r, s) => ({
  x: e / 63.5 * 488,
  y: t / 88.9 * 680,
  width: r / 63.5 * 488,
  height: s / 88.9 * 680
}), B0 = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function L0(e, t, r, s = 21) {
  const a = e.replace(/\{[^}]+\}/g, "●").split(`
`);
  let n = s;
  for (; n > 8 && a.reduce(
    (l, o) => l + Math.max(1, Math.ceil(o.length * n * 0.53 / t)) * n + 4,
    0
  ) > r; )
    n -= 0.5;
  return n;
}
function Xe(e) {
  const t = ee(e), r = [], s = (a, n, l, o = {}) => {
    r.push({ kind: a, text: n, ...l, font: L0(n, l.width, l.height), ...o });
  };
  if (t === "adventure") {
    const a = e.faces?.[1];
    if (!a) return [];
    const n = (a.manaSymbols ?? []).map((o) => `{${o}}`).join(""), l = (a.manaSymbols?.length ?? 0) * 2.5;
    s("heading", a.name, ye(5.6, 55.3, 25 - l, 4.2), {
      color: "white",
      font: Math.min(18, (25 - l) * 488 / 63.5 / Math.max(1, a.name.length * 0.55))
    }), s("rules", n, ye(30 - l, 55.3, l, 4.2), { color: "white", font: 17 }), s("heading", a.typeLine ?? "", ye(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (a.typeLine ?? "").length * 0.52))
    }), s("rules", a.rulesText ?? "", ye(5.6, 64.5, 24.7, 15.6)), s("rules", e.rulesText ?? e.faces?.[0]?.rulesText ?? "", ye(33, 54.9, 25.5, 25));
  } else if (t === "class") {
    const [a, n, l, o] = oe(e).rules.map(
      (y, f) => y * (f % 2 ? j : b)
    ), i = V(e);
    s(
      "band",
      "",
      { x: a, y: n, width: l, height: o },
      {
        fill: "#e3d8bb",
        asset: Q(
          "saga_textboxes",
          i.boxes === "Colourless" ? "Land" : i.boxes
        )
      }
    );
    const c = [];
    for (const y of (e.rulesText ?? "").split(`
`).filter(Boolean))
      c.length && !/^.*:\s*Level\s+\d+\s*$/i.test(y) && !/^.*:\s*Level\s+\d+\s*$/i.test(c.at(-1)) && !c.at(-1).startsWith("(") ? c[c.length - 1] += `
` + y : c.push(y);
    const u = (y) => /^.*:\s*Level\s+\d+\s*$/i.test(y), h = 28, d = 20, m = (y, f) => y.split(`
`).reduce(
      (v, R) => v + Math.max(1, Math.ceil(R.length * f * 0.53 / (l - 10))),
      0
    ), g = c.map(
      (y) => u(y) ? h : m(y, y.startsWith("(") ? 16 : d) * (y.startsWith("(") ? 16 : d) + 8
    ), p = c.filter((y) => !u(y)).length, k = Math.max(0, o - g.reduce((y, f) => y + f, 0)) / Math.max(1, p), S = Math.min(
      1,
      (o - c.filter(u).length * h) / g.reduce((y, f, v) => y + (u(c[v]) ? 0 : f), 0)
    );
    let w = n;
    c.forEach((y, f) => {
      const v = u(y), R = v ? h : g[f] * S + k;
      if (v) {
        const [B, O] = y.split(/:\s*/);
        s("band", "", { x: a, y: w, width: l, height: R }, { asset: j0 }), s("rules", B + ":", { x: a + 5, y: w, width: l / 2 - 5, height: R }, { font: 18 }), s(
          "heading",
          O,
          { x: a + l / 2, y: w, width: l / 2 - 5, height: R },
          { font: 18, align: "right" }
        );
      } else
        s(
          "rules",
          y,
          { x: a + 5, y: w + 4, width: l - 10, height: R - 8 },
          { font: (y.startsWith("(") ? 16 : d) * S, italic: y.startsWith("(") }
        );
      w += R;
    });
  } else if (t === "leveler") {
    const a = e.rulesText ?? "", n = a.split(/^LEVEL\s+([^\n]+)\n/gm), l = [
      {
        range: "",
        text: n[0] ?? "",
        stats: e.power != null && e.toughness != null ? `${e.power}/${e.toughness}` : ""
      }
    ];
    for (let u = 1; u < n.length; u += 2) {
      const h = n[u + 1] ?? "", d = h.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      l.push({
        range: n[u],
        stats: d?.[1] ?? "",
        text: d ? h.slice(d[0].length) : h
      });
    }
    const o = ye(4.9, 55.6, 53.7, 25.5), i = o.height / l.length, c = B0[V(e).frame] ?? "#dcc8af";
    l.forEach((u, h) => {
      const d = o.y + h * i;
      h && s(
        "band",
        "",
        { x: o.x, y: d, width: o.width, height: i },
        { fill: h % 2 ? "#00000018" : "#00000028" }
      );
      const m = u.range ? 55 : 7, g = u.stats ? 72 : 7;
      s("rules", u.text, {
        x: o.x + m,
        y: d + 4,
        width: o.width - m - g,
        height: i - 8
      }), u.range && s(
        "level",
        `LEVEL
${u.range}`,
        { x: o.x - 12, y: d + i / 2 - 23, width: 65, height: 46 },
        { fill: c, font: 13 }
      ), u.stats && s(
        "stats",
        u.stats,
        { x: o.x + o.width - 68, y: d + i / 2 - 22, width: 77, height: 44 },
        { asset: Q("pt-boxes", V(e).pt), font: 26 }
      );
    });
  }
  return r;
}
function D0(e) {
  return Xe(e).flatMap((t) => [
    t.asset ?? null,
    ...Ne(t.text).flatMap((r) => r.symbol ? [Ye(r.symbol)] : [])
  ]);
}
function A0(e) {
  return kr(e) ? Xe(e) : null;
}
function O0(e, t, r) {
  for (const s of Xe(t)) {
    const { x: a, y: n, width: l, height: o, font: i } = s;
    e.save(), e.textAlign = "left", e.fillStyle = s.fill ?? "transparent", s.kind === "level" ? (e.beginPath(), e.moveTo(a, n), e.lineTo(a + l * 0.72, n), e.lineTo(a + l, n + o / 2), e.lineTo(a + l * 0.72, n + o), e.lineTo(a, n + o), e.closePath(), e.fill(), e.strokeStyle = "#0008", e.lineWidth = 1, e.stroke()) : s.fill && e.fillRect(a, n, l, o);
    const c = s.asset ? r.get(s.asset) : null;
    if (c && e.drawImage(c, a, n, l, o), e.beginPath(), e.rect(a, n, l, o), e.clip(), e.fillStyle = s.color ?? "#17140f", ["stats", "level"].includes(s.kind)) {
      e.font = `${i}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
      const u = s.text.split(`
`);
      u.forEach(
        (h, d) => e.fillText(
          h,
          a + l * (s.kind === "level" ? 0.43 : 0.5),
          n + o / 2 + (d - (u.length - 1) / 2) * i,
          l * 0.85
        )
      );
    } else if (s.align === "right")
      e.font = `${i}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "right", e.textBaseline = "middle", e.fillText(s.text, a + l, n + o / 2, l);
    else {
      e.font = `${s.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
      const u = dt(e, s.text, l, i).length * i + (s.text.split(`
`).length - 1) * E.paragraphGap;
      ur(
        e,
        s.text,
        a,
        n + Math.max(0, (o - u) / 2),
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
    const a = t ? 0.615 : 0.5, n = {
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
      illustrationCrop: r.illustrationCrop ?? (!r.illustration && e.illustration ? [s ? a : 0, 0, s ? 1 - a : a, 1] : void 0)
    };
    return t ? s === 0 ? { face: n, x: 0, y: 0, width: 488, height: 375, rotation: 0 } : { face: n, x: 488, y: 367, width: 276, height: 488, rotation: 90 } : {
      face: n,
      x: 5,
      y: (s ? 333 : 648) - (ft(e) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function Sa(e) {
  return {
    left: `${e.x / b * 100}%`,
    top: `${e.y / j * 100}%`,
    width: `${e.width / b * 100}%`,
    height: `${e.height / j * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function Sr(e, t) {
  e.translate(t.x, t.y), e.rotate(t.rotation * Math.PI / 180), e.scale(t.width / b, t.width / b);
}
function $t(e, t) {
  const r = t[0] * e.width, s = t[1] * e.height, a = t[2] * e.width, n = t[3] * e.height;
  return e.rotation === -90 ? [
    (e.x + s) / b,
    (e.y - r - a) / j,
    n / b,
    a / j
  ] : e.rotation === 90 ? [
    (e.x - s - n) / b,
    (e.y + r) / j,
    n / b,
    a / j
  ] : [(e.x + r) / b, (e.y + s) / j, a / b, n / j];
}
function G0(e) {
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? 1.5 : 1;
}
function ft(e) {
  return /\bFuse\b/.test(e.rulesText ?? "") || !!e.faces?.some((t) => /^Fuse\b/m.test(t.rulesText ?? ""));
}
const E0 = 5, W0 = 0.02655 * j + 0.91339 * b * 3810 / 2736;
function wt(e) {
  const t = e ? 382 : 429;
  return { top: t, scale: 1 - E0 / (W0 - t) };
}
function $0(e) {
  const { top: t, scale: r } = wt(e);
  return [t + 6, t + (625 - t) * r - 4];
}
function It(e, t, r, s, a, n) {
  const { top: l, scale: o } = wt(n), i = t.height * a / t.width, c = Math.max(0, Math.min(i, l - s)), u = c * t.width / a;
  c > 0 && e.drawImage(t, 0, 0, t.width, u, r, s, a, c), c < i && e.drawImage(
    t,
    0,
    u,
    t.width,
    t.height - u,
    r,
    s + c,
    a,
    (i - c) * o
  );
}
function I0(e, t, r) {
  const s = e.rulesParagraphs?.filter((l) => l.role === "rules")[r], a = (e.rulesText ?? "").split(`
`).filter((l) => l.trim())[r];
  if (!s || s.runs.map((l) => l.text).join("") !== a) return [{ text: t }];
  let n = a.length - t.length;
  return s.runs.flatMap((l) => {
    const o = Math.min(n, l.text.length);
    return n -= o, o === l.text.length ? [] : [{ ...l, text: l.text.slice(o) }];
  });
}
function U0(e, t) {
  const r = ee(t) === "planeswalker-large", s = He(t), a = !r && s.length < 3, n = oe(t).rules, l = n[0] * b, o = n[1] * j, i = n[2] * b, c = n[3] * j - (r ? 24 : a ? 4 : 16), u = r ? 8 : a ? 3 : 0, h = r ? { ...Fe, leading: 0.9 } : Fe, d = s.map((M, T) => ({
    ...M,
    runs: I0(t, M.text, T),
    left: M.badges.length ? 67 : 45
  })), m = (M) => d.map(
    (T) => he(
      e,
      [{ role: "rules", runs: T.runs }],
      { x: l + T.left, y: 0, width: i - T.left - 8, height: 1e3 },
      M,
      M,
      h
    )
  );
  let g = r ? 17.5 : a ? 24 : 19, p = m(g);
  const [k, S] = $0(r), w = () => {
    const M = c / Math.max(1, d.length), T = p.map((C, $) => o + u + M * ($ + 0.5) - C.height / 2);
    let G = k - 8;
    for (let C = 0; C < T.length; C++)
      T[C] = Math.max(T[C], G + 8), G = T[C] + p[C].height;
    let W = S + 8;
    for (let C = T.length - 1; C >= 0; C--)
      T[C] = Math.min(T[C], W - 8 - p[C].height), W = T[C];
    return T;
  }, y = () => (w()[0] ?? k) >= k, f = () => p.map((M) => Math.max(34, M.height + 16)), v = () => {
    const M = c / Math.max(1, d.length);
    return p.every((T, G) => {
      const W = M * (G + 0.5);
      return W - T.height / 2 >= 6 && W + T.height / 2 <= c + 6 && (!G || M - (T.height + p[G - 1].height) / 2 >= 8);
    });
  };
  for (; g > 8 && (f().reduce((M, T) => M + T, 0) > c || !v() || !y()); )
    g -= 0.25, p = m(g);
  const R = c / Math.max(1, d.length), B = w();
  let O = u;
  return d.map((M, T) => {
    const G = R, W = p[T].height, C = he(
      e,
      [{ role: "rules", runs: M.runs }],
      {
        x: l + M.left,
        y: B[T],
        width: i - M.left - 8,
        height: W
      },
      g,
      g,
      h
    );
    C.overflow ||= O + G > u + c + 0.01, C.overflow ||= !v(), C.overflow ||= !y(), C.overflow ||= C.lines.some(
      (U) => U.inkBounds[1] < k - 0.01 || U.inkBounds[1] + U.inkBounds[3] > S + 0.01
    );
    const $ = { ...M, top: O, height: G, font: g, width: C.width, layout: C };
    return O += G, $;
  });
}
function P0(e) {
  return { font: 18, offsetY: e.startsWith("+") ? 2 : e === "0" ? 0 : -2 };
}
function yr(e, t) {
  return e === "saga" ? /^(I|II|III|IV)$/.test(t) ? Q("saga", t) : null : Q(
    "planeswalker",
    t.startsWith("+") ? "LoyaltyPlus" : t === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function vr(e, t) {
  return ee(e) === "saga" ? Q("saga_textboxes", t === "Colourless" ? "Land" : t) : null;
}
function x0(e) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[V(e).boxes] ?? "#dededbf0";
}
function F0(e, t) {
  const { top: r, scale: s } = wt(ee(t) === "planeswalker-large");
  e.save(), e.translate(0, r), e.scale(1, s), e.translate(0, -r), e.beginPath(), e.moveTo(66, r), e.lineTo(448, r), e.quadraticCurveTo(456, r, 456, r + 8), e.lineTo(456, 613), e.bezierCurveTo(456, 623, 420, 629, 257, 629), e.bezierCurveTo(94, 629, 58, 623, 58, 613), e.lineTo(58, r + 8), e.quadraticCurveTo(58, r, 66, r), e.closePath(), e.clip(), e.fillStyle = x0(t), e.fillRect(58, r, 398, 629 - r), e.restore();
}
function _0(e, t, r) {
  e.fillStyle = "#17140f", e.font = '24px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "alphabetic";
  const s = e.measureText(":");
  e.fillText(
    ":",
    t,
    r + 1.5 + (s.actualBoundingBoxAscent - s.actualBoundingBoxDescent) / 2
  );
}
function N0(e, t, r) {
  const s = ee(t), a = s === "saga", n = oe(t).rules, l = n[0] * b, o = n[1] * j, i = n[2] * b, c = n[3] * j;
  a && (e.fillStyle = "#e3d8bb", e.fillRect(l, o, i, c));
  const u = vr(t, V(t).boxes), h = u ? r.get(u) : void 0;
  h && e.drawImage(h, l, o, i, c);
  const d = a ? l0(t) : U0(e, t);
  for (const [m, g] of d.entries()) {
    if (m > 0) {
      const S = d[m - 1]?.layout, w = g.layout && S ? Math.max(S.top + S.height + 3, Math.min(o + g.top, g.layout.top - 3)) : o + g.top;
      e.fillStyle = "#0002", e.fillRect(l + (a ? 0 : 40), w, i - (a ? 0 : 40), 1.5);
    }
    if (e.fillStyle = "#17140f", e.textAlign = "left", g.layout) ze(e, g.layout, r);
    else {
      e.font = `${g.reminder ? "italic " : ""}${g.font}px "CardRenderer MTG MPlantin", Georgia`;
      const S = dt(e, g.text, g.width, g.font).length * g.font;
      ur(
        e,
        g.text,
        l + g.left,
        o + g.top + (g.height - S) / 2,
        g.width,
        { size: g.font, italic: g.reminder },
        r
      );
    }
    const p = a ? 36 : 54, k = a ? 36 : 40;
    g.badges.forEach((S, w) => {
      const y = l + (a ? -18 : 0), f = o + g.top + g.height / 2 + (w - g.badges.length / 2) * k, v = yr(s, S), R = v ? r.get(v) : null;
      if (R) {
        if (e.save(), !a) {
          const B = e.getTransform().a;
          e.shadowColor = "#0009", e.shadowBlur = 3 * B, e.shadowOffsetY = 2 * B;
        }
        e.drawImage(R, y, f, p, k), e.restore();
      } else
        e.fillStyle = "#29231c", e.fillRect(y, f, p, k);
      if (!R || !a) {
        e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle";
        const B = P0(S);
        e.font = `bold ${a ? 19 : B.font}px "CardRenderer MTG Beleren", Georgia`, e.fillText(
          S,
          y + p / 2 - (a ? 0 : 1.5),
          f + k / 2 + (a ? 0 : B.offsetY),
          p - 3
        ), a || _0(e, y + p + 4, f + k / 2);
      }
    });
  }
}
const Rr = 0.7;
function Y0(e, t, r, s = !1) {
  const [a, n, l, o] = [
    r[0] * b,
    r[1] * j,
    r[2] * b,
    r[3] * j - 1
  ], i = new Path2D();
  i.moveTo(a + 14, n), i.lineTo(a + l - 14, n), i.quadraticCurveTo(a + l, n, a + l, n + 14), i.lineTo(a + l, n + o - 7), i.quadraticCurveTo(a + l, n + o, a + l - 7, n + o), i.lineTo(a + 9, n + o), i.quadraticCurveTo(a - 2, n + o, a - 2, n + o - 9), i.quadraticCurveTo(a - 2, n + 17, a + 2, n + 9), i.quadraticCurveTo(a + 5, n, a + 14, n), i.closePath(), e.save();
  const c = e.getTransform().a;
  e.shadowColor = "#0009", e.shadowBlur = 1.4 * c, e.shadowOffsetX = -1.2 * c, e.shadowOffsetY = 3.5 * c, e.fillStyle = "#191816", e.fill(i), e.shadowColor = "transparent", e.save(), e.clip(i);
  const u = t.width / l, h = [
    20 * u,
    t.height - (o - 4) * u,
    t.width - 40 * u,
    (o - 12) * u,
    a - 2,
    n,
    l + 2,
    o
  ];
  e.drawImage(t, ...h), s && (e.globalAlpha *= Rr, e.drawImage(t, ...h)), e.restore(), e.strokeStyle = "#191816", e.lineWidth = 1.2, e.stroke(i), e.restore();
}
const q0 = 1.1;
function Cr(e) {
  return !e.setSymbol && ["m19", "m20", "m21"].includes(e.setCode?.toLowerCase() ?? "");
}
function Mr(e, t, r, s, a, n, l, o, i = 1) {
  const c = !r || r === "common", u = document.createElement("canvas"), h = 2, d = 4;
  u.width = Math.ceil((n + h * 2) * d), u.height = Math.ceil((l + h * 2) * d);
  const m = u.getContext("2d");
  m.scale(d, d), m.translate(h, h), m.drawImage(
    t,
    o[0] * t.width,
    o[1] * t.height,
    o[2] * t.width,
    o[3] * t.height,
    0,
    0,
    n,
    l
  ), m.globalCompositeOperation = "source-in";
  const g = r === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : r === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], p = m.createLinearGradient(0, l * 0.65, n, l * 0.35);
  p.addColorStop(0, g[0]), p.addColorStop(0.35, g[1]), p.addColorStop(0.6, g[2]), p.addColorStop(1, g[3]), m.fillStyle = c ? "#111111" : p, m.fillRect(0, 0, n, l), m.beginPath(), m.moveTo(n * 0.046, 0), m.lineTo(n * 0.953, 0), m.bezierCurveTo(
    n * 1.016,
    l * 0.38,
    n * 1.016,
    l * 0.62,
    n * 0.953,
    l
  ), m.lineTo(n * 0.046, l), m.bezierCurveTo(-n * 0.017, l * 0.62, -n * 0.017, l * 0.38, n * 0.046, 0), m.closePath(), m.globalCompositeOperation = "destination-over", m.fillStyle = c ? "#f8f8f5" : "#111111", m.fill(), m.globalCompositeOperation = "source-over", m.strokeStyle = c ? "#f8f8f5" : "#111111", m.lineWidth = i, m.stroke(), e.drawImage(
    u,
    s - h,
    a - h,
    u.width / d,
    u.height / d
  ), u.width = u.height = 0;
}
const ve = (e) => [
  e[0] * b,
  e[1] * j,
  e[2] * b,
  e[3] * j
];
function H0(e, t, r, s, a) {
  const n = bt(t);
  if (!n) throw Error("Missing replacement frame family.");
  const l = (D) => {
    const F = r.get(D);
    if (!F) throw Error(`Replacement frame asset unavailable: ${D}`);
    return F;
  }, { rects: o } = n, i = t.frameAssetFamily === "eighth";
  if (e.save(), e.fillStyle = ue(t.setCode, t.borderColor).border, e.fillRect(0, 0, b, j), s && e.drawImage(s, 0, 0, b, j), Ae(e, t, r, ve(o.art), a), a === "artwork") {
    e.restore();
    return;
  }
  if (e.drawImage(l(n.frame), 0, 0, b, j), n.rightFrame) {
    const D = document.createElement("canvas");
    D.width = 732, D.height = 1020;
    const F = D.getContext("2d");
    F.drawImage(l(n.rightFrame), 0, 0, D.width, D.height);
    const A = document.createElement("canvas");
    A.width = D.width, A.height = D.height;
    const te = A.getContext("2d"), z = (de, se) => {
      const ie = te.createLinearGradient(A.width * de, 0, A.width * se, 0);
      return ie.addColorStop(0, "#0000"), ie.addColorStop(1, "#000"), ie;
    };
    te.fillStyle = z(0.47, 0.53), te.fillRect(0, 0, A.width, A.height);
    const we = i ? [0.08, 0.627, 0.84, 0.29] : [0.071, 0.629, 0.858, 0.294], [ke, X, I, x] = we, _ = ke * A.width, re = X * A.height, J = I * A.width, Z = x * A.height;
    te.clearRect(_, re, J, Z), te.fillStyle = z(0.27, 0.73), te.fillRect(_, re, J, Z), F.globalCompositeOperation = "destination-in", F.drawImage(A, 0, 0), e.drawImage(D, 0, 0, b, j), D.width = D.height = 0, A.width = A.height = 0;
  }
  const c = ue(t.setCode, t.borderColor);
  if (c.border !== "#090806") {
    const D = document.createElement("canvas");
    D.width = 732, D.height = 1020;
    const F = D.getContext("2d");
    F.drawImage(l(n.border), 0, 0, D.width, D.height), F.globalCompositeOperation = "source-in", F.fillStyle = c.border, F.fillRect(0, 0, D.width, D.height), e.drawImage(D, 0, 0, b, j), D.width = D.height = 0;
  }
  e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const u = i ? "CardRenderer MTG Matrix" : "CardRenderer MTG Beleren", [h, d, m, g] = ve(o.title), p = t.manaSymbols ?? [], { size: k, gap: S } = n.mana, w = n.mana.right * b, y = p.length * k + Math.max(0, p.length - 1) * S;
  e.font = `bold ${n.titleSize}px "${u}", Georgia`, xe(
    e,
    t.name,
    h,
    d + g / 2,
    p.length ? w - y - h - 8 : m,
    n.titleSize,
    !0,
    1,
    u
  ), p.forEach(
    (D, F) => le(
      e,
      D,
      w - y + F * (k + S),
      n.mana.center * j - k / 2,
      k,
      r,
      !0
    )
  );
  const f = Ce(t), v = r.get(f ?? ""), R = Qt(t), B = v ? Math.min(
    n.symbol.width * b / (v.width * R[2]),
    n.symbol.height * j / (v.height * R[3])
  ) : 0, O = v ? v.width * R[2] * B : 0, M = v ? v.height * R[3] * B : 0, T = Us(t, f, [
    n.symbol.right * b - O,
    n.symbol.center * j - M / 2,
    O,
    M
  ]), [G, W, C, $] = ve(o.type);
  if (e.font = `bold ${n.typeSize}px "${u}", Georgia`, xe(
    e,
    t.typeLine ?? "",
    G,
    W + $ / 2,
    v ? T[0] - G - 7 : C,
    n.typeSize,
    !0,
    1,
    u
  ), v) {
    const D = or(t);
    Oe(f) || t.setSymbol ? e.drawImage(v, ...T) : Cr(t) ? Mr(e, v, t.rarity, ...T, R, 1.5) : D ? ir(e, v, D, t.rarity, ...T, R, !1) : mt(e, v, t.setCode, t.rarity, ...T, R);
  }
  if (ze(e, pr(e, t), r), t.power != null && t.toughness != null) {
    e.drawImage(l(n.pt), ...ve(o.stats));
    const [D, F, A, te] = ve(o.stats);
    e.font = `bold ${i ? 29 : 25}px "${u}", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(`${t.power}/${t.toughness}`, D + A * 0.52, F + te * 0.52, A * 0.85);
  }
  const [U, q, H] = ve(o.footer);
  e.textAlign = "left", e.textBaseline = "top", e.fillStyle = i ? ["B", "Colourless", "Land"].includes(V(t).boxes) ? "#fff" : "#17140f" : "#fff", e.font = `${i ? 14 : 12}px "${u}", Georgia`, e.fillText(t.artist ?? "", U, q, H), t.legalText && (e.font = '9px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, U, q + 15, H)), e.restore();
}
let Ut = null;
function z0(e) {
  return e.frameAssetFamily !== "eighth" ? Promise.resolve() : Ut ??= document.fonts.load('bold 24px "CardRenderer MTG Matrix"').then((t) => {
    if (!t.length || t.some((r) => r.status !== "loaded"))
      throw Error("Replacement Eighth Edition frames need card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw Ut = null, t;
  });
}
function X0(e, t, [r, s, a, n]) {
  const l = t.height * a / t.width;
  e.save(), e.beginPath(), e.rect(r, s, a, n / 2), e.clip(), e.drawImage(t, r, s + n - l + 1, a, l), e.restore();
}
function K0(e, [t, r, s, a], n) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(n)) return;
  e.save(), e.shadowColor = "transparent";
  const l = e.createLinearGradient(t, 0, t + s, 0);
  l.addColorStop(0, "rgba(255,255,255,0)"), l.addColorStop(0.025, "rgba(255,255,255,0.2)"), l.addColorStop(0.975, "rgba(255,255,255,0.2)"), l.addColorStop(1, "rgba(255,255,255,0)"), e.fillStyle = l, e.fillRect(t, r + a - 4, s, 2.3), e.restore();
}
const V0 = "symbol-svg-v1", J0 = { "m15-u": { sha256: "bfd962ff9640a846e5690d76c0fe88324e9d49cb6771744b5ab8f34f7afe7362", recipe: "m15" }, "m15-r": { sha256: "933756b97cebe7389ff7cee219a34b1ac13bc504743a2be037a286ee5ffc4b0d", recipe: "m15" }, "m15-m": { sha256: "6e9f87473f1ed8ecb05647fbde6f13e22faeab18fe56b8f76cfa1759bb4210e7", recipe: "m15" }, "8ed-u": { sha256: "6c20e8da28fdd5cdb030814e5c1339978f276c77f4ad9d99ca816adb8d970880", recipe: "8ed" }, "8ed-r": { sha256: "eccde74c56b4810434ecdf4e99206046d6970ea601e4fed2f73eb2ee855053a2", recipe: "8ed" }, "9ed-u": { sha256: "acb7ea7f3422f50dca2aef4e07aa3977aa1641ff2cb54f6eb64ae1bc17abbf53", recipe: "9ed" }, "9ed-r": { sha256: "c1cbcc1aea4f032c5f2ccf7f1d63073813bf9c6f050ba2f5385170ff3deca8a5", recipe: "9ed" } }, Tr = {
  revision: V0,
  sources: J0
}, Pt = `${ge}/img/setSymbols/official/`, xt = Tr.sources;
function jr(e) {
  if (!e.startsWith(Pt) || !e.endsWith(".svg")) return;
  const t = e.slice(Pt.length, -4);
  return Object.hasOwn(xt, t) ? xt[t] : void 0;
}
function Z0(e) {
  return !!jr(e);
}
async function Q0(e, t) {
  const r = jr(e);
  if (!r) return t;
  const s = await t.arrayBuffer();
  if ([...new Uint8Array(await crypto.subtle.digest("SHA-256", s))].map((h) => h.toString(16).padStart(2, "0")).join("") !== r.sha256) throw Error(`Unexpected pinned symbol checksum: ${e}`);
  const l = new DOMParser().parseFromString(new TextDecoder().decode(s), "image/svg+xml"), o = l.documentElement, i = [...o.querySelectorAll("path")], c = o.querySelector("linearGradient");
  if (o.localName !== "svg" || l.querySelector("parsererror") || !c)
    throw Error(`Unexpected pinned symbol SVG: ${e}`);
  const u = (h, d) => {
    for (const [m, g] of Object.entries(d)) h.setAttribute(m, g);
  };
  if (r.recipe === "m15") {
    if (i.length !== 6) throw Error("Unexpected M15 path topology.");
    u(i[0], { fill: `url(#${c.id})`, stroke: "#000", "stroke-width": "8" });
    for (const h of i.slice(1)) h.setAttribute("fill", "#000");
  } else if (r.recipe === "8ed" || r.recipe === "9ed") {
    if (i.length !== 4) throw Error("Unexpected numeric shield path topology.");
    const h = i[2], d = h.parentElement?.getAttribute("transform");
    if (!d) throw Error("Missing numeric shield coordinate transform.");
    const m = c.cloneNode(!0);
    if (u(m, {
      id: "glint-root-metal",
      gradientTransform: `${d} ${c.getAttribute("gradientTransform") ?? ""}`
    }), c.after(m), i[0].setAttribute("fill", "#000"), u(i[3], {
      fill: "url(#glint-root-metal)",
      stroke: "#000",
      "stroke-width": r.recipe === "8ed" ? "9" : "12",
      "paint-order": "stroke fill"
    }), r.recipe === "8ed") {
      const g = h.getAttribute("d")?.match(/[Mm][^Mm]+/g);
      if (g?.length !== 3) throw Error("Unexpected Eighth Edition card panels.");
      const p = h.cloneNode();
      u(p, {
        d: g[0],
        style: `fill:#000;stroke:url(#${c.id});stroke-width:1.4`
      }), h.after(p);
    }
  } else throw Error(`Unknown symbol SVG patch recipe: ${r.recipe}`);
  return o.setAttribute("data-card-glint-patch", Tr.revision), new Blob([new XMLSerializer().serializeToString(l)], { type: "image/svg+xml" });
}
const me = /* @__PURE__ */ new Map();
function Br(e) {
  if (!(!e.retired || e.users)) {
    if (!e.sources) {
      e.controller.abort();
      return;
    }
    URL.revokeObjectURL(e.sources.original), e.sources.backing && URL.revokeObjectURL(e.sources.backing), e.sources = void 0;
  }
}
function ya() {
  for (const e of me.values())
    e.retired = !0, Br(e);
  me.clear();
}
async function ea(e, t) {
  t.throwIfAborted();
  let r = me.get(e);
  if (!r) {
    const i = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const c = await fetch(e, { mode: "cors", signal: i.controller.signal });
        if (!c.ok) throw Error(`Symbol source ${c.status}: ${e}`);
        const u = await Q0(e, await c.blob()), h = await Zs(e, u);
        i.controller.signal.throwIfAborted();
        const d = URL.createObjectURL(u);
        try {
          const m = { original: d, backing: h ? URL.createObjectURL(h) : void 0 };
          return i.sources = m, m;
        } catch (m) {
          throw URL.revokeObjectURL(d), m;
        }
      })
    };
    i.promise = i.promise.catch((c) => {
      throw me.get(e) === i && me.delete(e), c;
    }), me.set(e, i), r = i;
  }
  r.users++;
  const s = r;
  let a = !1;
  const n = () => {
    a || (a = !0, s.users--, !s.users && !s.sources && (s.retired = !0, me.get(e) === s && me.delete(e)), Br(s));
  };
  let l = () => {
  };
  const o = new Promise((i, c) => {
    l = () => {
      n(), c(t.reason);
    }, t.addEventListener("abort", l, { once: !0 });
  });
  try {
    const i = await Promise.race([s.promise, o]);
    return t.throwIfAborted(), { sources: i, release: n };
  } catch (i) {
    throw n(), i;
  } finally {
    t.removeEventListener("abort", l);
  }
}
async function ta(e, t) {
  t.throwIfAborted();
  const r = [...new Set(e.filter((i) => !!i))], s = [], a = /* @__PURE__ */ new Map(), n = () => {
    for (const i of s) i.release();
    s.length = 0;
  }, o = (await Promise.allSettled(
    r.map(async (i) => {
      if (!Js(i) && !Z0(i)) {
        a.set(i, i);
        return;
      }
      const c = await ea(i, t);
      s.push(c), a.set(i, c.sources.original), c.sources.backing && a.set(cr(i), c.sources.backing);
    })
  )).find((i) => i.status === "rejected");
  if (o?.status === "rejected")
    throw n(), o.reason;
  return t.aborted && (n(), t.throwIfAborted()), { urls: [...new Set(a.values())], aliases: a, dispose: n };
}
function ra(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const [s, a] of e) {
    const n = t.get(a);
    n && r.set(s, n);
  }
  return r;
}
async function sa(e, t) {
  return t.throwIfAborted(), fetch(e, { signal: t, mode: "cors" });
}
function aa(e) {
  if (e.startsWith(`${ge}/img/frames/`) && e.endsWith(".png"))
    return /\/pt\/|\/m15PT/.test(e) ? 256 : 768;
  if (e.startsWith(`${Me}/img/frames/`) && e.endsWith(".png")) return 768;
  const t = e.startsWith(`${Re}/img/`) ? e.slice(`${Re}/img/`.length) : "";
  return t === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    t
  ) ? 768 : void 0;
}
async function na(e) {
  if (!e.type.includes("svg")) return e;
  const t = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), r = t.documentElement;
  if (r.localName !== "svg" || t.querySelector("parsererror"))
    throw new Error("Invalid SVG asset.");
  const s = (r.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), a = s[2] ?? parseFloat(r.getAttribute("width") ?? ""), n = s[3] ?? parseFloat(r.getAttribute("height") ?? "");
  if (!(a > 0 && n > 0 && Number.isFinite(a + n)))
    throw new Error("SVG asset needs a finite viewport.");
  const l = 512 / Math.max(a, n);
  return r.hasAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${a} ${n}`), r.setAttribute("width", String(Math.max(1, Math.round(a * l)))), r.setAttribute("height", String(Math.max(1, Math.round(n * l)))), new Blob([new XMLSerializer().serializeToString(r)], { type: "image/svg+xml" });
}
async function la(e, t, r) {
  if (t.throwIfAborted(), !e.type.includes("svg"))
    return r ? createImageBitmap(e, { resizeWidth: r, resizeQuality: "high" }) : createImageBitmap(e);
  const s = URL.createObjectURL(await na(e)), a = new Image(), n = document.createElement("canvas"), l = () => {
    a.src = "";
  };
  t.addEventListener("abort", l, { once: !0 });
  try {
    t.throwIfAborted(), a.src = s, await a.decode(), t.throwIfAborted(), n.width = a.naturalWidth, n.height = a.naturalHeight;
    const o = n.getContext("2d", { willReadFrequently: !0 });
    if (!o || !n.width || !n.height)
      throw new Error("SVG asset could not be rasterized.");
    return o.drawImage(a, 0, 0), await createImageBitmap(n);
  } finally {
    t.removeEventListener("abort", l), a.src = "", URL.revokeObjectURL(s), n.width = 0, n.height = 0;
  }
}
async function Lr(e, t) {
  const r = await ta(e, t), s = r.urls, a = /* @__PURE__ */ new Map();
  let n = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, s.length) }, async () => {
        for (; n < s.length && !t.aborted; ) {
          const o = s[n++];
          try {
            const i = await sa(o, t);
            if (!i.ok) continue;
            const c = await i.blob(), u = await la(c, t, aa(o));
            t.aborted ? u.close() : a.set(o, u);
          } catch {
          }
        }
      })
    );
  } finally {
    r.dispose();
  }
  const l = ra(r.aliases, a);
  return {
    images: l,
    dispose: () => {
      for (const o of a.values()) o.close();
      a.clear(), l.clear();
    }
  };
}
function Dr(e) {
  const t = n0(e);
  if (t) return [...t, e.illustration, Ce(e), ...tt(e)];
  if (fe(e)) return ps(e);
  const r = Ge(e);
  if (r.length) return r.flatMap((n) => Dr(n.face));
  const s = V(e), a = ot(s, ee(e));
  return [
    ...D0(e),
    a.background,
    a.frame,
    a.boxes,
    a.pt,
    vr(e, s.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(ee(e)) ? He(e).flatMap(
      (n) => n.badges.map((l) => yr(ee(e), l))
    ) : [],
    s.legendary ? a.crown : null,
    e.illustration,
    Ce(e),
    ...tt(e)
  ];
}
let Ft = null;
function _t() {
  return Ft ??= Promise.all([
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
    throw Ft = null, e;
  });
}
function $e(e) {
  const t = oe(e), r = t.art;
  return ee(e).startsWith("planeswalker") ? [r[0], r[1], r[2], t.type[1] - r[1]] : r;
}
const Nt = /* @__PURE__ */ new WeakMap(), Ie = ([e, t, r, s]) => [e, 1 - t - s, e + r, 1 - t], oa = [Ie(oe({}).art), [0, 0, 0, 0]];
function va(e) {
  if (!e) return oa;
  const t = Nt.get(e);
  if (t) return t;
  const r = Ge(e), s = r.length ? [
    Ie($t(r[0], $e(r[0].face))),
    Ie($t(r[1], $e(r[1].face)))
  ] : [Ie($e(e)), [0, 0, 0, 0]];
  return Nt.set(e, s), s;
}
async function ia(e, t, r, s, a, n, l = Lr, o) {
  return Ar(e, t, r, s, {
    threshold: a,
    resolveEtching: o,
    beforePaint: n,
    loadImages: l,
    height: j
  });
}
async function Ar(e, t, r, s, a) {
  const { threshold: n, beforePaint: l, loadImages: o, height: i } = a, c = Ge(t);
  if (c.length) {
    for (const f of c)
      e.save(), Sr(e, f), await Ar(e, f.face, r, s, {
        ...a,
        height: f.height * b / f.width
      }), e.restore();
    return;
  }
  if (t.illustration && a.resolveEtching) {
    let f;
    try {
      const v = await a.resolveEtching(t, r, s, n, l);
      f = await o([v, t.illustration], s);
      const R = f.images.get(v ?? "");
      if (R && !s.aborted) {
        await l?.(), s.throwIfAborted();
        const [B, O, M, T] = oe(t).art, G = B * b, W = O * i, C = M * b, $ = T * i, U = f.images.get(t.illustration) ?? R;
        e.save(), e.beginPath();
        const q = $e(t);
        if (e.rect(
          q[0] * b,
          q[1] * i,
          q[2] * b,
          q[3] * i
        ), e.clip(), e.imageSmoothingQuality = "low", t.illustrationCrop) {
          const H = t.illustrationCrop, D = Pe(U.width * H[2], U.height * H[3], [
            G,
            W,
            C,
            $
          ]);
          e.drawImage(
            R,
            H[0] * R.width,
            H[1] * R.height,
            H[2] * R.width,
            H[3] * R.height,
            ...D
          );
        } else
          e.drawImage(
            R,
            ...Pe(U.width, U.height, [G, W, C, $])
          );
        e.restore();
      }
    } catch {
    } finally {
      f?.dispose();
    }
  }
  if (s.throwIfAborted(), !t.setCode) return;
  const [u, h, d, m] = oe(t).stamp, g = u * b, p = h * i, k = d * b, S = m * i, w = Ce(t, "common"), y = await o([w], s);
  try {
    await l?.(), s.throwIfAborted();
    const f = w ? y.images.get(w) : null;
    if (e.save(), e.globalAlpha = 0.68, f) {
      const v = Math.min(k / f.width, S / f.height);
      e.drawImage(
        f,
        g + (k - f.width * v) / 2,
        p + (S - f.height * v) / 2,
        f.width * v,
        f.height * v
      );
    } else
      e.translate(g, p), e.scale(k / 100, S / 100), e.fillStyle = "white", e.fill(new Path2D(Xr)), e.font = "bold 43px Georgia", e.textAlign = "center", e.textBaseline = "alphabetic", e.fillText(Jr(t.setCode), 50, 65);
    e.restore();
  } finally {
    y.dispose();
  }
}
function ca(e) {
  return e.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const ua = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, Yt = /* @__PURE__ */ new WeakMap();
function ha(e, t) {
  let r = Yt.get(t);
  if (r || (r = new Path2D(t.path), Yt.set(t, r)), e.save(), t.viewBox) {
    const [s, a, n, l] = t.viewBox;
    e.scale(24 / n, 24 / l), e.translate(-s, -a);
  }
  t.transform && e.transform(...t.transform), t.filled ? (e.fillStyle = e.strokeStyle, e.fill(r)) : e.stroke(r), e.restore();
}
function qt(e, t, r, s, a = !1) {
  const n = b * 0.105, l = b * 0.015, o = Math.floor(b * 0.9 / (n + l));
  if (t.forEach((m, g) => {
    e.save(), e.translate(
      b * 0.05 + g % o * (n + l),
      j * 0.13 + Math.floor(g / o) * (n + l)
    ), e.fillStyle = "#17201fed", e.strokeStyle = "#c6af7977", e.lineWidth = 1, e.beginPath(), e.arc(n / 2, n / 2, n / 2, 0, Math.PI * 2), e.fill(), e.stroke(), e.translate(n * 0.14, n * 0.14), e.scale(n * 0.72 / 24, n * 0.72 / 24), e.strokeStyle = "#f3e9cf", e.lineWidth = 1.8, e.lineCap = "round", e.lineJoin = "round", ha(e, m), e.restore();
  }), r?.power == null || r.toughness == null) return;
  e.save();
  const i = ua[a ? "inspect" : "table"], c = b * i.width, u = j * i.height, h = b * (1 - i.right - i.width), d = j * (1 - i.bottom - i.height);
  s ? e.drawImage(s, h, d, c, u) : (e.fillStyle = "#eee5cf", e.strokeStyle = "#746854", e.lineWidth = 2, e.beginPath(), e.roundRect(
    h + c * (a ? 0.14 : 0.1),
    d + u * (a ? 0.19 : 0.18),
    c * (a ? 0.72 : 0.8),
    u * (a ? 0.62 : 0.64),
    u * 0.12
  ), e.fill(), e.stroke()), e.font = `bold ${b * (a ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
    `${r.power}/${r.toughness}`,
    h + c / 2,
    a ? d + u / 2 - b * 0.01 : d + u * 0.48,
    c * 0.72
  ), e.restore();
}
function Ra(e) {
  return e.currentStats?.power != null && e.currentStats.toughness != null && e.statusLayout !== "inspect" ? { ...e, statusLayout: "inspect" } : e;
}
function Ca(e, t) {
  if (e.custom)
    return JSON.stringify([
      "custom-face-v1",
      e.custom.key,
      t,
      e.layer ?? "face",
      e.layer === "etching" ? e.etchThreshold ?? 20 : null
    ]);
  const r = e.face, s = Or(r, e.layer === "etching"), a = e.currentStats?.power != null && e.currentStats.toughness != null ? [e.currentStats.power, e.currentStats.toughness] : null;
  return JSON.stringify([
    Re,
    ge,
    "canvas-face-v87",
    e.paintLayer ?? null,
    t,
    e.printingId,
    e.layer === "etching" ? null : e.printedImage,
    s,
    e.layer ?? "face",
    e.layer === "etching" ? e.etchThreshold ?? 14 : null,
    e.layer === "etching" ? null : [
      (e.emblems ?? []).map((n) => [
        n.path,
        n.viewBox ?? null,
        n.transform ?? null,
        !!n.filled
      ]),
      a,
      a ? e.statusLayout ?? t : null
    ]
  ]);
}
function Or(e, t) {
  const r = Ge(e);
  return r.length ? [
    e.layout,
    r.map((s) => [s.x, s.y, s.width, s.height, s.rotation, Or(s.face, t)]),
    !t && ft(e)
  ] : t ? [
    e.illustration ?? null,
    e.etchedIllustration ?? null,
    e.illustrationCrop ?? null,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    oe(e)
  ] : [
    fe(e) ? [Te(e), ce(e)] : null,
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
    A0(e),
    e.artist ?? null,
    e.legalText === void 0 ? ["default"] : e.legalText,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    e.rarity ?? "common",
    e.power ?? null,
    e.toughness ?? null,
    e.loyalty ?? null,
    oe(e),
    V(e)
  ];
}
function da(e) {
  const t = document.createElement("canvas");
  return t.width = e === "table" ? 244 : 732, t.height = e === "table" ? 340 : 1020, t;
}
async function Ma(e, t, r, s) {
  if (e.custom)
    return await s?.beforePaint?.(), r.throwIfAborted(), e.custom.compose(t, r, e.layer ?? "face", e.etchThreshold);
  const a = s?.loadImages ?? Lr, n = da(t);
  try {
    const l = n.getContext("2d", {
      willReadFrequently: !!s?.cpuPixels
    });
    if (!l) throw new Error("Card composition needs Canvas2D.");
    if (l.imageSmoothingEnabled = !0, l.imageSmoothingQuality = "high", l.scale(n.width / b, n.height / j), e.layer === "etching")
      return await ia(
        l,
        e.face,
        e.printingId,
        r,
        e.etchThreshold,
        s?.beforePaint,
        a,
        s?.resolveEtching
      ), n;
    l.fillStyle = "#090806", l.fillRect(0, 0, b, j);
    const o = e.currentStats?.power != null && e.currentStats.toughness != null ? ot(V(e.face)).pt : null;
    if (e.printedImage) {
      const u = t === "inspect" ? ca(e.printedImage) : e.printedImage;
      o && await (s?.loadFonts ?? _t)();
      const h = await a(o ? [u, o] : [u], r);
      try {
        const d = h.images.get(u);
        if (d && !r.aborted)
          return await s?.beforePaint?.(), r.throwIfAborted(), l.drawImage(d, 0, 0, b, j), qt(
            l,
            e.emblems ?? [],
            e.currentStats,
            o ? h.images.get(o) : void 0,
            e.statusLayout === "inspect" || t === "inspect"
          ), Ht(l, e.face), n;
      } finally {
        h.dispose();
      }
    }
    await Promise.all([
      (s?.loadFonts ?? _t)(),
      z0(e.face),
      fe(e.face) ? (s?.loadRetroFont ?? T0)() : Promise.resolve()
    ]), r.throwIfAborted();
    const i = await a(Dr(e.face), r);
    let c;
    try {
      return e.paintLayer !== "artwork" && (c = await Os(e.face, i.images, r)), await s?.beforePaint?.(), r.throwIfAborted(), Gr(
        l,
        e.face,
        c?.images ?? i.images,
        j,
        !1,
        s?.underArt,
        e.paintLayer
      ), qt(
        l,
        e.emblems ?? [],
        e.currentStats,
        o ? i.images.get(o) : void 0,
        e.statusLayout === "inspect" || t === "inspect"
      ), Ht(l, e.face), n;
    } finally {
      c?.dispose(), i.dispose();
    }
  } catch (l) {
    throw n.width = n.height = 0, l;
  }
}
function Ht(e, t) {
  e.save(), e.setTransform(
    e.canvas.width / b,
    0,
    0,
    e.canvas.height / j,
    0,
    0
  ), e.globalCompositeOperation = "destination-in", e.globalAlpha = 1, e.shadowColor = "transparent", e.filter = "none", e.fillStyle = "#000", e.beginPath(), e.roundRect(0, 0, b, j, xs(t) * b), e.fill(), e.restore();
}
function Gr(e, t, r, s = j, a = !1, n, l) {
  if (t.frameAssetFamily) {
    H0(e, t, r, n, l);
    return;
  }
  if (fe(t)) {
    R0(e, t, r, n, l);
    return;
  }
  const o = Ge(t);
  if (o.length) {
    e.fillStyle = ue(t.setCode, t.borderColor).border, e.fillRect(0, 0, b, j);
    for (const L of o)
      e.save(), Sr(e, L), Gr(
        e,
        L.face,
        r,
        L.height * b / L.width,
        !0,
        n,
        l
      ), e.restore();
    if (l === "artwork") return;
    zt(e, t), ft(t) && (e.font = '14px "CardRenderer MTG MPlantin", Georgia', e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      b / 2,
      j - 12,
      b * 0.9
    ));
    return;
  }
  const i = (L) => [
    L[0] * b,
    L[1] * s,
    L[2] * b,
    L[3] * s
  ];
  e.fillStyle = ue(t.setCode, t.borderColor).border, e.fillRect(0, 0, b, s);
  const c = oe(t), u = ee(t);
  if (l === "artwork") {
    Ae(e, t, r, i(c.art), l);
    return;
  }
  const h = V(t), d = ot(h, u), g = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[h.boxes] ?? "#827d72", p = (L, P, K = "top") => {
    const Se = r.get(L);
    if (!Se) return !1;
    const [je, Ke, Ve, Je] = i(P);
    e.save(), e.beginPath(), e.rect(je, Ke, Ve, Je), e.clip();
    const St = K === "stretch" ? Je : Se.height * Ve / Se.width;
    return e.drawImage(
      Se,
      je,
      K === "bottom" ? Ke + Je - St : Ke,
      Ve,
      St
    ), e.restore(), !0;
  }, [k, S, w, y] = i(h.legendary ? c.legendaryBackground : c.background);
  if (e.save(), e.beginPath(), e.roundRect(k, S, w, y, [
    { x: w * 0.01282, y: y * 962e-5 },
    { x: w * 0.01282, y: y * 962e-5 },
    { x: w * 0.06838, y: y * 0.05128 },
    { x: w * 0.06838, y: y * 0.05128 }
  ]), e.clip(), a) {
    const L = g.slice(1).match(/../g).map(
      (P, K) => Math.round(parseInt(P, 16) * 0.62 + [244, 236, 217][K] * 0.38)
    );
    e.fillStyle = `rgb(${L.join(",")})`, e.fillRect(k, S, w, y);
  }
  const f = r.get(d.background), v = u.startsWith("planeswalker");
  if (f && v ? It(e, f, k, S, w, u === "planeswalker-large") : f ? e.drawImage(
    f,
    k,
    S + (h.legendary ? E.legendaryBackgroundLift : 0),
    w,
    a ? y : f.height * w / f.width
  ) : (e.fillStyle = g, e.fillRect(k, S, w, y)), e.restore(), e.fillStyle = "#e3d8bb", !r.has(d.frame))
    if (u === "adventure")
      for (const L of Xe(t).filter((P) => P.kind === "rules" && !P.color))
        e.fillRect(L.x, L.y, L.width, L.height);
    else e.fillRect(...i(c.rules));
  r.has(d.boxes) || (e.fillRect(...i(c.title)), e.fillRect(...i(c.type))), e.fillStyle = "#80745c", e.fillRect(...i(c.art));
  const R = r.get(d.frame);
  if (R && u === "normal" && !a) {
    const L = _s(t);
    qs(
      e,
      h,
      L,
      () => Xt(e, R, h.legendary, c.frame, !0, L)
    ), Ys(e, h, L);
  }
  if (n && (e.save(), e.beginPath(), e.rect(0, 0, b, s), e.clip(), e.resetTransform(), e.drawImage(n, 0, 0, e.canvas.width, e.canvas.height), e.restore()), u === "normal" && !a) {
    const [L, P, K, Se] = i(c.art), je = De.artRim;
    e.fillStyle = "#090806", e.fillRect(L - je, P, K + 2 * je, Se);
  }
  if (Ae(e, t, r, i(c.art), l), v && F0(e, t), R && v) {
    const [L, P, K] = i(c.frame);
    It(e, R, L, P, K, u === "planeswalker-large");
  } else R && u !== "normal" && Xt(e, R, h.legendary, c.frame);
  if (h.legendary && p(d.crown, c.crown), a) {
    const L = r.get(d.boxes);
    if (L) {
      const K = L.height * 0.104;
      e.drawImage(L, 0, 0, L.width, K, ...i(c.title)), e.drawImage(L, 0, L.height - K, L.width, K, ...i(c.type));
    }
    const P = r.get(d.frame);
    e.fillStyle = "#e3d8bb", e.fillRect(...i(c.rules)), P && e.drawImage(
      P,
      P.width * 0.035,
      P.height * 0.675,
      P.width * 0.93,
      P.height * 0.325,
      ...i(c.rules)
    );
  } else {
    const L = v && ["Colourless", "Artifact", "Land"].includes(h.boxes);
    p(d.boxes, c.title), L && (e.save(), e.globalAlpha *= Rr, p(d.boxes, c.title), e.restore());
    const P = r.get(d.boxes);
    v && P ? Y0(e, P, c.type, L) : (p(d.boxes, c.type, "bottom"), u === "normal" && P && (X0(e, P, i(c.type)), K0(e, i(c.type), h.boxes)));
  }
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left";
  const [B, O, M, T] = i(c.title), G = B + E.plateLeft + (u === "normal" ? 1 : 0), W = G0(t), C = t.manaSymbols ?? [], $ = E.manaSize * W, U = C.length * $ + Math.max(0, C.length - 1) * E.manaGap, q = B + M - E.plateRight, H = q - U, D = (u === "normal" && !a ? E.normalTitleFont : E.titleFont) * W;
  e.font = `bold ${D}px "CardRenderer MTG Beleren", Georgia`, e.letterSpacing = `${E.titleTracking}px`, xe(
    e,
    t.name,
    G,
    O + T / 2 + (u === "normal" ? 1 : 0),
    H - G - (C.length ? E.titleGap : 0),
    D,
    !0
  ), e.letterSpacing = "0px", C.forEach(
    (L, P) => le(
      e,
      L,
      H + P * ($ + E.manaGap),
      O + T / 2 - $ / 2 + E.manaLift / 2,
      $,
      r,
      !0
    )
  );
  const F = Ce(t), A = r.get(F ?? ""), te = Oe(F), z = Qt(t), we = Cr(t), ke = or(t), X = we && u === "normal", I = X ? q0 : 1, x = E.setMargin + (X ? 2 : 0), [, _, , re] = i(c.type), J = _ + re / 2 + E.typeLift / 2 + (u === "normal" || v ? 2 : 0), Z = A ? Math.min(
    E.setMaxWidth,
    E.setHeight * A.width * z[2] / (A.height * z[3])
  ) : 0, de = A ? Math.min(
    Z / (A.width * z[2]),
    E.setHeight / (A.height * z[3])
  ) : 0, se = [
    q - x - Z - Z * (I - 1) / 2 + (v ? 1.5 : 0),
    J - (A?.height ?? 0) * z[3] * de * I / 2 - (X ? 1 : 0),
    (A?.width ?? 0) * z[2] * de * I,
    (A?.height ?? 0) * z[3] * de * I
  ], ie = u === "normal" && !a ? ht(t, F, se, "component") : se, Wr = Math.max(
    1,
    Math.min(
      q - G - (A ? Z * (1 + (I - 1) / 2) + x + E.typeGap : 0),
      A && ie !== se ? ie[0] - G - E.typeGap : 1 / 0
    )
  );
  e.font = `${E.typeFont * W}px "CardRenderer MTG Beleren", Georgia`, xe(
    e,
    t.typeLine ?? "",
    G + (v ? 1.5 : 0),
    J,
    Wr,
    E.typeFont * W,
    !1,
    u === "normal" && !a ? De.typeWidthScale : 1
  ), A && (te || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(A, ...ie), e.restore()) : we ? Mr(
    e,
    A,
    t.rarity,
    ...ie,
    z,
    X ? 1.5 : 1
  ) : ke ? ir(
    e,
    A,
    ke,
    t.rarity,
    ...ie,
    z,
    u === "normal"
  ) : mt(e, A, t.setCode, t.rarity, ...ie, z)), kr(t) ? O0(e, t, r) : u !== "normal" ? N0(e, t, r) : ze(e, pr(e, t, s, W), r);
  const kt = Hr(t);
  if (kt && u !== "leveler") {
    p(d.pt, c.stats, "stretch");
    const [L, P, K] = i(c.stats);
    e.fillStyle = u.startsWith("planeswalker") ? "white" : "#17140f", e.font = `bold ${E.statsFont}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      kt.text,
      L + K / 2,
      P + (u.startsWith("planeswalker") ? c.stats[3] * j / 2 : E.statsLine / 2 + (u === "normal" ? 2 : 0)),
      K
    );
  }
  a || zt(e, t);
}
function zt(e, t) {
  const [r, s, a, n] = Er(N.footer), l = s + E.footerLine;
  e.save(), e.beginPath(), e.rect(r, s, a, n), e.clip(), e.textAlign = "left", e.textBaseline = "top", e.fillStyle = ue(t.setCode, t.borderColor).ink, e.font = `${E.footerFont}px "CardRenderer MTG Relay", sans-serif`, e.letterSpacing = `${E.footerTracking}px`;
  const o = t.setCode?.trim().toUpperCase() ?? "";
  e.fillText(o, r, l);
  let i = r + e.measureText(o).width;
  e.letterSpacing = "0px", t.artist && (i += E.artistMarginLeft, e.font = `${E.footerFont}px "CardRenderer MTG Artist Credit", sans-serif`, e.fillText("a", i, l), i += e.measureText("a").width + E.artistMarginRight, e.font = `${E.footerFont * 1.154}px "CardRenderer MTG Beleren", Georgia`, e.fillText(t.artist, i, l)), e.restore();
}
function Xt(e, t, r, s = N.frame, a = !1, n = 0) {
  const [l, o, i, c] = Er(s), u = n, h = l + u, d = i - 2 * u, m = Math.min(t.height, c * t.width / i), g = m * i / t.width, p = e.getTransform().a, k = () => {
    if (!a) {
      e.drawImage(t, 0, 0, t.width, m, h, o, d, g);
      return;
    }
    const S = 424, w = 436;
    e.save(), e.beginPath(), e.rect(0, 0, b, S), e.rect(0, w, b, j - w), e.clip(), e.drawImage(t, 0, 0, t.width, m, h, o, d, g), e.restore(), e.save(), e.beginPath(), e.rect(0, S, b, w - S), e.clip(), e.drawImage(t, 0, 0, t.width, m, h, o - 1, d, g), e.restore();
  };
  e.save(), e.shadowColor = "black", e.shadowOffsetX = -394e-5 * b * p, e.shadowOffsetY = 394e-5 * b * p, e.shadowBlur = 236e-5 * b * p, k(), r || (e.shadowColor = "#ffffffa0", e.shadowOffsetX = 157e-5 * b * p, e.shadowOffsetY = -315e-5 * b * p, e.shadowBlur = 157e-5 * b * p, k()), e.restore();
}
function Er(e) {
  return [e[0] * b, e[1] * j, e[2] * b, e[3] * j];
}
export {
  da as $,
  zr as A,
  j as B,
  j0 as C,
  oa as D,
  Xr as E,
  N as F,
  ma as G,
  b as H,
  hs as I,
  Me as J,
  us as K,
  as as L,
  bs as M,
  Fe as N,
  Dr as O,
  ua as P,
  ue as Q,
  Re as R,
  Q as S,
  Qs as T,
  la as U,
  wa as V,
  Jr as W,
  D0 as X,
  Xe as Y,
  A0 as Z,
  va as _,
  xs as a,
  Ne as a$,
  Kr as a0,
  Hr as a1,
  sa as a2,
  bt as a3,
  n0 as a4,
  kr as a5,
  Pe as a6,
  Ra as a7,
  he as a8,
  _t as a9,
  ct as aA,
  ce as aB,
  rr as aC,
  qe as aD,
  Te as aE,
  gs as aF,
  tr as aG,
  Mt as aH,
  ae as aI,
  ba as aJ,
  sr as aK,
  Ct as aL,
  h0 as aM,
  yr as aN,
  Vr as aO,
  at as aP,
  ga as aQ,
  dt as aR,
  vr as aS,
  Qt as aT,
  os as aU,
  na as aV,
  x0 as aW,
  l0 as aX,
  He as aY,
  ft as aZ,
  G0 as a_,
  Lr as aa,
  T0 as ab,
  P0 as ac,
  Zr as ad,
  pr as ae,
  ha as af,
  Gr as ag,
  qt as ah,
  ia as ai,
  O0 as aj,
  xe as ak,
  Ae as al,
  le as am,
  F0 as an,
  R0 as ao,
  ur as ap,
  ze as aq,
  mt as ar,
  N0 as as,
  Sa as at,
  Sr as au,
  Er as av,
  U0 as aw,
  pa as ax,
  pe as ay,
  ps as az,
  Ce as b,
  fr as b0,
  Ma as c,
  Ca as d,
  ya as e,
  oe as f,
  fa as g,
  aa as h,
  ra as i,
  E as j,
  ee as k,
  fe as l,
  Ye as m,
  ot as n,
  V as o,
  $t as p,
  ne as q,
  ta as r,
  Ge as s,
  it as t,
  cs as u,
  $e as v,
  ka as w,
  Zt as x,
  As as y,
  Ds as z
};
