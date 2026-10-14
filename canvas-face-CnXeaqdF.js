const Us = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", Fs = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", _s = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Ns = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", Ys = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-new-split-fuse.mse-style", Hs = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", we = {
  RENDERER_COMPONENT_ROOT: Us,
  KEYRUNE_ROOT: Fs,
  CONJURER_ROOT: _s,
  RETRO_ROOT: Ns,
  MSE_SPLIT_BRIDGE_ROOT: Ys,
  RETRO_SYMBOL_FONT: Hs
}, zs = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), qs = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function Ga(e) {
  return zs.has(e?.trim().toLowerCase() ?? "");
}
function Xs(e) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(e?.toLowerCase() ?? "") ? 0 : 1;
}
function Js(e, t) {
  const r = e?.trim().toLowerCase() ?? "";
  return qs.has(r) || r === "atq" && t === "Reconstruction";
}
const Vs = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function Ia(e) {
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
function gr(e) {
  if (e.wordingMode === "oracle" || !["mir", "tmp"].includes(e.setCode?.toLowerCase() ?? "")) return null;
  const t = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    e.typeLine ?? ""
  )?.[1];
  if (!t) return null;
  const r = Vs[t];
  return Ia(e) !== r ? null : {
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
function Ks(e) {
  return e.power != null && e.toughness != null ? {
    text: `${e.power}/${e.toughness}`,
    label: `Power ${e.power}, toughness ${e.toughness}`
  } : e.loyalty != null && e.loyalty !== "" ? { text: String(e.loyalty), label: `Starting loyalty ${e.loyalty}` } : null;
}
const v = 488, j = 680, Zs = 0.058;
function Re(e, t) {
  if (t === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (t ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    e?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const Qs = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", H = {
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
  stamp: [0.34, 0.76 - 0.16 * v / j, 0.32, 0.32 * v / j]
}, E = {
  titleFont: 24,
  normalTitleFont: 26,
  titleTracking: 54e-5 * v,
  titleGap: 0.02362 * v,
  plateLeft: 0.02362 * v,
  plateRight: 0.01575 * v,
  manaSize: 0.03556 * 1.35 * v,
  manaGap: 378e-5 * v,
  manaLift: -63e-4 * v,
  typeFont: 0.044 * v,
  typeGap: 945e-5 * v,
  typeLift: -315e-5 * v,
  setHeight: 0.06142 * v,
  setMaxWidth: 0.11024 * v,
  setMargin: 472e-5 * v,
  rulesPaddingX: 0.01575 * v,
  rulesPaddingY: 0.02362 * v,
  normalRulesFont: 0.04444 * v,
  longRulesFont: 0.0381 * v,
  denseRulesFont: 0.0328 * v,
  paragraphGap: 787e-5 * v,
  statsFont: 0.05333 * v,
  statsLine: 0.08661 * v,
  footerFont: 0.02167 * v,
  footerLine: 0.02126 * v,
  footerTracking: 362e-5 * v,
  artistMarginLeft: 7e-3 * v,
  artistMarginRight: 35e-4 * v,
  legendaryBackgroundLift: -0.02047 * v
}, Fr = (e) => e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
function en(e = H) {
  return {
    ...Object.fromEntries(
      Object.entries(e).flatMap(
        ([t, r]) => r.map((a, s) => [
          `--face-${Fr(t)}-${["x", "y", "w", "h"][s]}`,
          `${a * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(E).map(([t, r]) => [
        `--face-${Fr(t)}`,
        `${r / v * 100}cqw`
      ])
    )
  };
}
const Pi = en();
function tn(e) {
  return e.length > 340 ? "dense" : e.length > 210 ? "long" : "normal";
}
function Di(e) {
  return {
    dense: E.denseRulesFont,
    long: E.longRulesFont,
    normal: E.normalRulesFont
  }[tn(e)];
}
function xt(e) {
  return e.split(/(\{[^}\n]+\})/g).filter(Boolean).map((t) => ({
    value: t,
    symbol: /^\{[^}\n]+\}$/.test(t) ? t.slice(1, -1) : null
  }));
}
function rn(e) {
  const t = e.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[t] ?? t.slice(0, 3);
}
const Nt = "WUBRG";
function q(e) {
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
  return an(e.frameColors ?? e.colors ?? []);
}
function an(e) {
  return [
    ...new Set(
      e.map((t) => t.toLocaleUpperCase()).filter((t) => Nt.includes(t))
    )
  ].sort((t, r) => Nt.indexOf(t) - Nt.indexOf(r));
}
const sn = { "10e": "cmrsu", "2ed": "cmrsu", "2x2": "cmrsu", "2xm": "cmrsu", "30a": "cmrsu", "3ed": "cmrsu", "40k": "cmrsu", "4ed": "cmrsu", "5dn": "cmrsu", "5ed": "cmrsu", "6ed": "cmrsu", "7ed": "cmrsu", "8ed": "cmrsu", "9ed": "cmrsu", a25: "cmrsu", acr: "cmrsu", aer: "cmrsu", afc: "cmrsu", afr: "cmrsu", akh: "cmrsu", akr: "cmrsu", ala: "cmrsu", all: "cmrsu", ana: "cmrsu", apc: "cmrsu", arb: "cmrsu", arc: "cmrsu", archie: "cmrsu", arena: "cmrsu", arn: "cmrsu", ath: "cmrsu", atq: "cmrsu", avr: "cmrsu", azorius: "cmru", bbd: "cmrsu", bfz: "cmrsu", big: "cmrsu", blb: "cmrsu", blc: "cmrsu", bng: "cmrsu", bok: "cmrsu", boros: "cmru", bot: "cmrsu", brb: "cmrsu", brc: "cmrsu", bro: "cmrsu", brr: "cmrsu", btd: "cmrsu", c13: "cmrsu", c14: "cmrsu", c15: "cmrsu", c16: "cmrsu", c17: "cmrsu", c18: "cmrsu", c19: "cmrsu", c20: "cmrsu", c21: "cmrsu", cc1: "cmrsu", cc2: "cmrsu", ced: "cmrsu", cei: "cmrsu", chk: "cmrsu", chr: "cmrsu", clb: "cmrsu", clu: "cmrsu", cm1: "cmrsu", cm2: "cmrsu", cma: "cmrsu", cmd: "cmrsu", cmm: "cmrsu", cmr: "cmrsu", cn2: "cmrsu", cns: "cmrsu", con: "cmrsu", conf: "cmrsu", csp: "cmrsu", dci: "cmrsu", dd1: "cmrsu", dd2: "cmrsu", ddc: "cmrsu", ddd: "cmrsu", dde: "cmrsu", ddf: "cmrsu", ddg: "cmrsu", ddh: "cmrsu", ddi: "cmrsu", ddj: "cmrsu", ddk: "cmrsu", ddl: "cmrsu", ddm: "cmrsu", ddn: "cmrsu", ddo: "cmrsu", ddp: "cmrsu", ddq: "cmrsu", ddr: "cmrsu", dds: "cmrsu", ddt: "cmrsu", ddu: "cmrsu", default: "cmrsu", dft: "cmrsu", dgm: "cmrsu", dimir: "cmru", dis: "cmrsu", dka: "cmrsu", dkm: "cmrsu", dmc: "cmrsu", dmr: "cmrsu", dmu: "cmrsu", dom: "cmrsu", dpa: "cmrsu", drb: "cmrsu", drc: "cmrsu", drk: "cmrsu", dsc: "cmrsu", dsk: "cmrsu", dst: "cmrsu", dtk: "cmrsu", e01: "cmrsu", e02: "cmrsu", ecc: "cmrsu", ecl: "cmrsu", eld: "cmrsu", ema: "cmrsu", emn: "cmrsu", eoc: "cmrsu", eoe: "cmrsu", eos: "cmru", eve: "cmrsu", exo: "cmrsu", exp: "cmrsu", fca: "cmrsu", fdc: "cmrsu", fdn: "cmrsu", fem: "cmrsu", fic: "cmrsu", fin: "cmrsu", fnm: "r", fra: "cmrsu", frc: "cmrsu", frf: "cmrsu", fut: "cmrsu", gn2: "cmrsu", gn3: "cmrsu", gnt: "cmrsu", golgari: "cmru", gpt: "cmrsu", grn: "cmrsu", gruul: "cmru", gs1: "cmrsu", gtc: "cmrsu", h09: "cmrsu", h17: "cmrsu", ha1: "cmrsu", hbg: "cmrsu", hml: "cmrsu", hob: "cmrsu", hoc: "cmrsu", hop: "cmrsu", hou: "cmrsu", ice: "cmrsu", idw: "cmrsu", iko: "cmrsu", ima: "cmrsu", inr: "cmrsu", inv: "cmrsu", isd: "cmrsu", izzet: "cmru", j20: "cmrsu", j21: "cmrsu", j22: "cmrsu", j25: "cmru", jmp: "cmrsu", jou: "cmrsu", jud: "cmrsu", khc: "cmrsu", khm: "cmrsu", kld: "cmrsu", klr: "cmrsu", ktk: "cmrsu", lcc: "cmrsu", lci: "cmrsu", lea: "cmrsu", leb: "cmrsu", leg: "cmrsu", lgn: "cmrsu", lrw: "cmrsu", ltc: "cmrsu", ltr: "cmrsu", m10: "cmrsu", m11: "cmrsu", m12: "cmrsu", m13: "cmrsu", m14: "cmrsu", m15: "cmrsu", m19: "cmrsu", m20: "cmrsu", m21: "cmrsu", m3c: "cmrsu", mat: "cmrsu", mb2: "cmrsu", mbc: "cmrsu", mbs: "cmrsu", mc3: "cmrsu", md1: "cmrsu", me1: "cmrsu", me2: "cmrsu", me3: "cmrsu", me4: "cmrsu", med: "cmrsu", mh1: "cmrsu", mh2: "cmrsu", mh3: "cmrsu", mic: "cmrsu", mid: "cmrsu", mir: "cmrsu", mkc: "cmrsu", mkm: "cmrsu", mm2: "cmrsu", mm3: "cmrsu", mma: "cmrsu", mmq: "cmrsu", moc: "cmrsu", mom: "cmrsu", mor: "cmrsu", mp2: "cmrsu", mps: "cmrsu", mrd: "cmrsu", msc: "cmrsu", msh: "cmrsu", mtga: "cmrsu", mtgo: "cmrsu", mul: "cmrsu", ncc: "cmrsu", nec: "cmrsu", nem: "cmrsu", neo: "cmrsu", nph: "cmrsu", ody: "cmrsu", ogw: "cmrsu", om1: "cmrsu", omb: "cmrsu", onc: "cmrsu", one: "cmrsu", ons: "cmrsu", ori: "cmrsu", orzhov: "cmru", otc: "cmrsu", otj: "cmrsu", otp: "cmrsu", p02: "cmrsu", papac: "cmrsu", parl2: "cmrsu", past: "cmrsu", pbook: "cmrsu", pc2: "cmrsu", pca: "cmrsu", pcy: "cmrsu", pd2: "cmrsu", pd3: "cmrsu", pdrc: "c", peuro: "cmrsu", pgru: "c", phpr: "cmrsu", phuk: "cmrsu", pidw: "cmrsu", pio: "cmrsu", pip: "cmrsu", planeswalker: "cmrsu", plc: "cmrsu", pls: "cmrsu", pmps: "cmrsu", por: "cmrsu", prm: "cmrsu", ps11: "cmrsu", psal: "cmrsu", psdg: "cmrsu", psum: "cmrsu", ptg: "cmrsu", ptk: "cmrsu", pvan: "c", pxbox: "cmrsu", pz1: "cmrsu", pz2: "cmrsu", pza: "cmrsu", rav: "cmrsu", ren: "cmrsu", rex: "cmrsu", rin: "cmrsu", rix: "cmrsu", rna: "cmrsu", roe: "cmrsu", rtr: "cmrsu", rvr: "cmrsu", s00: "cmrsu", s99: "cmrsu", scd: "cmrsu", scg: "cmrsu", sds: "cmrsu", selesnya: "cmru", shm: "cmrsu", simic: "cmru", sir: "cmrsu", sis: "cmrsu", sld: "cmrsu", snc: "cmrsu", soa: "cmrsu", soc: "cmrsu", soi: "cmrsu", sok: "cmrsu", som: "cmrsu", sos: "cmrsu", spe: "cmrsu", spg: "cmrsu", spm: "cmrsu", ss1: "cmrsu", ss2: "cmrsu", ss3: "cmrsu", sta: "cmrsu", star: "cmrsu", sth: "cmrsu", stx: "cmrsu", td0: "cmrsu", td2: "cmrsu", tdc: "cmrsu", tdm: "cmrsu", thb: "cmrsu", ths: "cmrsu", tla: "cmrsu", tle: "cmrsu", tlr: "c", tmc: "cmrsu", tmp: "cmrsu", tmt: "cmrsu", tor: "cmrsu", tpr: "cmrsu", trc: "cmrsu", trk: "cmrsu", tsp: "cmrsu", tsr: "cmrsu", uds: "cmrsu", ugl: "cmrsu", ulg: "cmrsu", uma: "cmrsu", und: "cmrsu", unf: "cmrsu", unh: "cmrsu", usg: "cmrsu", ust: "cmrsu", v09: "cmrsu", v10: "cmrsu", v11: "cmrsu", v12: "cmrsu", v13: "cmrsu", v14: "cmrsu", v15: "cmrsu", v16: "cmrsu", v17: "cmrsu", van: "cmrsu", vis: "cmrsu", vma: "cmrsu", voc: "cmrsu", vow: "cmrsu", w16: "cmrsu", w17: "cmrsu", war: "cmrsu", who: "cmrsu", woc: "cmrsu", woe: "cmrsu", wor: "u", wot: "cmrsu", wth: "cmrsu", wwk: "cmrsu", x2ps: "cmrsu", xln: "cmrsu", y22: "cmrsu", y23: "cmrsu", y24: "cmrsu", y25: "cmrsu", y26: "cmrsu", zen: "cmrsu", znc: "cmrsu", zne: "cmrsu", znr: "cmrsu" }, nn = {
  codes: sn
}, P = we.CONJURER_ROOT, Ba = `${P}/img/setSymbols/official/`, _r = nn.codes, on = {
  common: "c",
  uncommon: "u",
  rare: "r",
  mythic: "m",
  special: "s",
  bonus: "s"
};
function xa(e, t = "common", r = "auto") {
  const a = e.trim().toLowerCase();
  if (r === "keyrune") return null;
  const s = Ga(a) ? "c" : on[t];
  return s && Object.hasOwn(_r, a) && _r[a].includes(s) ? `${Ba}${a}-${s}.svg` : null;
}
function ke(e) {
  return !!e?.startsWith(Ba);
}
const ln = we.KEYRUNE_ROOT, dn = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function Ee(e) {
  return !e.setSymbol && !xa(e.setCode ?? "", e.rarity, e.setSymbolSource) ? dn[e.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1] : [0, 0, 1, 1];
}
const Aa = new Set(
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
Aa.add("con_");
const cn = "GLINT", Ct = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function hn(e) {
  const t = Ct[e] ?? Ct.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${t}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function mn(e) {
  const t = Ct[e] ?? Ct.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${t}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function un(e, t = "common", r) {
  const a = e.trim().toLowerCase();
  if (a === "forge") return mn(t);
  if (a === cn.toLowerCase()) return hn(t);
  const s = xa(a, t, r);
  if (s) return s;
  const n = a === "con" ? "con_" : a === "p02" ? "po2" : a;
  return Aa.has(n) ? `${ln}/${n}.svg` : null;
}
const Nr = {
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
function gn(e) {
  return Object.hasOwn(Nr, e) ? Nr[e] : null;
}
const Xe = we.RENDERER_COMPONENT_ROOT;
function At(e, t = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(t), a = t === "saga" ? "saga" : t === "planeswalker-large" ? "planeswalker_large" : t, s = ["saga", "class"].includes(t) && e.boxes === "Colourless" ? "Land" : t.startsWith("planeswalker") && e.boxes === "Artifact" ? "Colourless" : e.boxes;
  return {
    background: he(
      r ? "bg" : t === "class" ? "saga_bg" : `${a}_bg`,
      t.startsWith("planeswalker") && s === "Land" ? "Colourless" : s
    ),
    frame: he(
      ["normal", "leveler"].includes(t) ? "frames" : `${a}_frames`,
      t === "adventure" ? "WUBRG".includes(e.frame) ? e.frame : "W" : t === "class" ? e.frame === "WU" ? "UW" : e.frame.length === 2 ? "Gold" : e.frame : t === "saga" && e.frame === "Colourless" ? "Land" : t.startsWith("planeswalker") && ["Artifact", "Land"].includes(e.frame) ? "Colourless" : e.frame
    ),
    boxes: he(t.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", s),
    nameplate: he("nameplates", e.boxes),
    crown: he("legendary-crowns", e.crown),
    pt: t.startsWith("planeswalker") ? he("planeswalker", "Loyalty") : he("pt-boxes", e.pt)
  };
}
function Je(e) {
  const t = e.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = t === "∞" ? "INFINITY" : t === "½" ? "HALF" : t.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? he("symbols", r) : null;
}
function pn(e, t, r) {
  return un(e, t, r);
}
function he(e, t) {
  const r = e === "legendary-crowns" ? "legendary_crowns" : e === "pt-boxes" ? "pt_boxes" : e === "nameplates" ? "boxes" : e, a = e === "symbols" ? "svg" : "webp";
  return `${Xe}/img/${r}/${encodeURIComponent(t)}.${a}`;
}
function ee(e, t = e.rarity) {
  const r = e.setCode?.trim().toLowerCase() ?? "";
  return e.setSymbol ?? pn(
    r === "chr" ? gn(e.name) ?? "" : r,
    t,
    e.setSymbolSource
  );
}
const fn = {
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
}, bn = {
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
}, wn = {
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
}, yn = {
  "leb/R": { family: "mse-old", pixels: 0.4 }
};
function Lt(e, t) {
  if (!(e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode === "oracle"))
    return fn[e.setCode?.toLowerCase() ?? ""]?.[t];
}
function rr(e, t) {
  const r = Lt(e, t), a = r && r !== "modern" && r !== "historic-font" ? bn[`${t}/${r}`] : void 0, s = yn[`${e.setCode?.toLowerCase()}/${t}`];
  return a && s && s.family === r ? { ...a, inkExpansion: s.pixels } : a;
}
function ve(e) {
  const t = [
    e.rulesText ?? "",
    ...(e.rulesParagraphs ?? []).flatMap((a) => a.runs.map((s) => s.text))
  ];
  return [.../* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...t.flatMap(
      (a) => xt(a).flatMap((s) => s.symbol ? [s.symbol] : [])
    )
  ])].map(
    (a) => Lt(e, a) === "historic-font" ? null : rr(e, a)?.url ?? Je(a)
  );
}
function mt(e) {
  if (!["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "") || e.frameStyle === "modern" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || !(e.land ?? /\bLand\b/.test(e.typeLine ?? "")) || e.layout && e.layout !== "normal")
    return;
  const t = e.frameColors ? O(e) : [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(([a]) => new RegExp(`\\b${a}\\b`).test(e.typeLine ?? "")).map(([, a]) => a);
  if (t.length !== 2) return;
  const r = `${we.RETRO_ROOT}/img/frames/old/abu/`;
  return {
    base: `${r}${t[0].toLowerCase()}l.png`,
    overlay: `${r}${t[1].toLowerCase()}l.png`,
    mask: `${we.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`
  };
}
const kn = we.RETRO_SYMBOL_FONT, Ve = we.RETRO_ROOT, Sn = `${Ve}/fonts/goudy-medieval.ttf`, vn = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), Rn = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function oe(e) {
  return e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") ? !1 : e.frameStyle === "retro" || e.frameStyle !== "modern" && vn.has(e.setCode?.toLowerCase() ?? "");
}
function Et(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function pe(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return Et(e) ? "abu" : t === "leg" && O(e).length > 1 ? "legends" : ["3ed", "4ed", "5ed", "atq"].includes(t) && !/\bLand\b/.test(e.typeLine ?? "") ? "fourth" : "seventh";
}
function pr(e) {
  return pe(e) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1];
}
function fr(e) {
  const t = Et(e);
  return {
    ...H,
    frame: pr(e),
    title: [t ? 0.07 : 0.1134, 0.0481, t ? 0.8467 : 0.8, 0.043],
    art: pe(e) === "legends" ? [0.112, 0.094, 0.78, 0.45] : pe(e) === "fourth" ? [0.109, 0.093, 0.779, 0.453] : t ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429],
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: [0.8074, 0.895, 0.1367, 0.043],
    footer: [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function Ae(e) {
  const t = mt(e);
  if (t) return t.base;
  const r = O(e), a = e.typeLine ?? "", s = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([l]) => a.includes(l)), n = /\bLand\b/.test(a) ? s.length === 1 ? s[0][1] + "l" : ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "") && e.frameColors?.length === 1 ? e.frameColors[0].toLowerCase() + "l" : "l" : /\bArtifact\b/.test(a) ? "a" : r.length > 1 ? "m" : r[0]?.toLowerCase() ?? "c", o = pe(e), i = o === "seventh" || n === "c" || o === "abu" && n === "m" ? "seventh/regular" : `old/${o}`;
  return `${Ve}/img/frames/${i}/${o === "legends" ? "legendsFrameM" : n}.png`;
}
function ye(e) {
  return e.borderColor ?? (Rn.has(e.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function Yr(e) {
  return ye(e) === "silver" ? Re(null, "silver").border : ye(e) === "white" ? Mn : "#080808";
}
function La(e) {
  return pe(e) === "fourth" ? `${Ve}/img/frames/old/fourth/borderBlack.png` : `${Ve}/img/frames/${Et(e) ? "old/abu" : "seventh/regular"}/border.svg`;
}
function Hr(e) {
  return Et(e) ? "#ababab" : "#f2eee3";
}
function Cn(e) {
  return e.setCode?.toLowerCase() === "7ed" && O(e).some((t) => t === "W" || t === "G") && !/Land/.test(e.typeLine ?? "") ? "saturate(.7) brightness(.88)" : "none";
}
function br(e) {
  if (gr(e)) return null;
  const t = Ia(e);
  return t ? `${Ve}/img/frames/m15/basics/${t.toLowerCase()}.png` : null;
}
const Mn = "#eeedeb";
function Ea(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return !e.setSymbol && t === "ice" && e.setSymbolSource === "keyrune" ? `${we.KEYRUNE_ROOT}/ice2.svg` : !e.setSymbol && Js(t, e.name) ? null : ee(e);
}
function Ui(e) {
  const t = (e.rulesText ?? "").length;
  return t > 340 ? 16 : t > 210 ? 19 : 23;
}
function Tn(e) {
  const t = mt(e);
  return [
    br(e),
    Ae(e),
    t?.overlay,
    t?.mask,
    ye(e) !== "black" || pe(e) === "fourth" ? La(e) : null,
    e.illustration,
    Ea(e),
    ...ve(e)
  ];
}
const ge = ([e, t, r, a]) => [
  e * v,
  t * j,
  r * v,
  a * j
];
function Fi(e, t) {
  return ["7ed", "8ed", "9ed"].includes(e?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(t ?? "") ? "black" : void 0;
}
const jn = {
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
function $t(e) {
  const t = e.symbolAdjustment?.mana, r = e.setCode?.toLowerCase() ?? "", a = jn[r], s = ["lea", "leb", "3ed"].includes(r);
  if (!a || (e.layout ?? "normal") !== "normal" || (e.legendary ?? /\bLegendary\b/.test(e.typeLine ?? "")) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || ye(e) !== (["3ed", "8ed"].includes(r) ? "white" : "black") || s && (!oe(e) || e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode === "oracle") || r === "8ed" && (oe(e) || e.frameAssetFamily !== "eighth") || r === "m21" && (oe(e) || e.frameAssetFamily !== void 0))
    return t;
  const n = { ...t };
  for (const o of ["dx", "dy", "spacing", "numberDx", "numberDy"])
    a[o] !== void 0 && (n[o] = a[o] + (t?.[o] ?? 0));
  for (const o of ["scaleX", "scaleY", "numberScale"])
    a[o] !== void 0 && (n[o] = a[o] * (t?.[o] ?? 1));
  if (a.glyphs) {
    n.glyphs = { ...t?.glyphs };
    for (const o of ["W", "U", "B", "R", "G"]) {
      const i = a.glyphs[o], l = t?.glyphs?.[o];
      i && (n.glyphs[o] = {
        scale: (i.scale ?? 1) * (l?.scale ?? 1),
        dx: (i.dx ?? 0) + (l?.dx ?? 0),
        dy: (i.dy ?? 0) + (l?.dy ?? 0)
      });
    }
  }
  return n;
}
class wr {
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
const $a = new wr(16 * 1024 * 1024), Wa = new wr(8 * 1024 * 1024), _i = () => {
  $a.clear(), Wa.clear();
}, Ni = "symbols-v3";
function Gn(e) {
  if (e.symbolAdjustment) {
    if (e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
      throw Error("Symbol adjustment currently supports ordinary faces only.");
    for (const [t, r] of Object.entries(e.symbolAdjustment)) {
      if (t !== "mana" && t !== "set") throw Error("Unknown symbol adjustment group.");
      if (!r || typeof r != "object") throw Error("Invalid symbol adjustment.");
      for (const [a, s] of Object.entries(r)) {
        if (t === "mana" && a === "glyphs") {
          In(s);
          continue;
        }
        const n = a === "dx" || a === "dy", o = t === "mana" && (a === "numberDx" || a === "numberDy"), i = t === "mana" && a === "spacing", l = a === "scaleX" || a === "scaleY" || t === "mana" && a === "numberScale", d = i || o ? 4 : 8;
        if (!n && !o && !i && !l || typeof s != "number" || !Number.isFinite(s) || s < (l ? 0.75 : -d) || s > (l ? 1.25 : d))
          throw Error("Symbol adjustment exceeds supported bounds.");
      }
    }
  }
}
function In(e) {
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
function dt(e, t) {
  return /^[WUBRG]$/.test(t) ? e?.glyphs?.[t] : void 0;
}
function De(e, t) {
  const { dx: r = 0, dy: a = 0, scaleX: s = 1, scaleY: n = 1 } = t ?? {};
  if (!r && !a && s === 1 && n === 1) return e;
  const [o, i, l, d] = e;
  return [o + l + r - l * s, i + d / 2 + a - d * n / 2, l * s, d * n];
}
function Ke(e, t, r, a) {
  const s = De(t, r);
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
function Bn(e, t, r) {
  const a = Math.max(0, t - 1) * (r?.spacing ?? 0);
  return a ? [e[0] - a, e[1], e[2] + a, e[3]] : e;
}
const xn = new wr(16 * 1024 * 1024), zr = /* @__PURE__ */ new WeakMap();
let An = 0;
async function Ln(e, t, r) {
  const a = $t(e), s = !!a && (!!(a.numberDx || a.numberDy) || (a.numberScale ?? 1) !== 1);
  if (!s && !a?.glyphs && !Object.keys(t.manaGlyphScales ?? {}).length)
    return { images: t, dispose() {
    } };
  const n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), i = [
    .../* @__PURE__ */ new Set([...e.manaSymbols ?? [], ...Object.keys(t.manaGlyphScales ?? {})])
  ].flatMap((d) => {
    const c = dt(a, d), h = !!c && (!!(c.dx || c.dy) || (c.scale ?? 1) !== 1);
    if (!(/^\d+$/.test(d) && s) && !h && (t.manaGlyphScales?.[d] ?? 1) === 1)
      return [];
    const m = t.get(Je(d) ?? "");
    if (!m) return [];
    let u = zr.get(m);
    return u || zr.set(m, u = ++An), [{ symbol: d, source: m, identity: u }];
  });
  let l = [];
  try {
    return l = await xn.acquireMany(
      i.map(({ source: d, identity: c }) => ({
        key: `numeral-v1:${c}`,
        bytes: d.width * d.height * 8,
        build: () => En(d)
      })),
      r
    ), i.forEach(({ symbol: d, source: c }, h) => {
      (/^\d+$/.test(d) ? n : o).set(d, {
        image: l[h].value,
        width: c.width,
        height: c.height
      });
    }), {
      images: Object.assign(new Map(t), {
        manaColors: t.manaColors,
        originalManaGlyphs: t.originalManaGlyphs,
        originalWhiteGlyph: t.originalWhiteGlyph,
        manaNumerals: n,
        manaGlyphs: o,
        manaGlyphScales: t.manaGlyphScales
      }),
      dispose: () => l.forEach((d) => d.release())
    };
  } catch (d) {
    throw l.forEach((c) => c.release()), d;
  }
}
async function En(e) {
  const t = document.createElement("canvas");
  t.width = e.width, t.height = e.height;
  try {
    const r = t.getContext("2d", { willReadFrequently: !0 });
    if (!r) throw Error("Mana glyph preparation needs Canvas2D.");
    r.drawImage(e, 0, 0);
    const a = r.getImageData(0, 0, t.width, t.height), s = a.data, n = (Math.floor(e.height * 0.04) * e.width + Math.floor(e.width / 2)) * 4, o = [s[n], s[n + 1], s[n + 2]];
    let i = n;
    for (let m = 0; m < s.length; m += 4)
      s[m + 3] === 255 && s[m] + s[m + 1] + s[m + 2] < s[i] + s[i + 1] + s[i + 2] && (i = m);
    const l = [s[i], s[i + 1], s[i + 2]], d = o.map((m, u) => m - l[u]), c = d.reduce((m, u) => m + u * u, 0);
    if (c < 100) throw Error("Mana asset has no separable glyph.");
    const h = new ImageData(new Uint8ClampedArray(s), e.width, e.height);
    for (let m = 0; m < s.length; m += 4) {
      if (s[m + 3] < 255) {
        s[m + 3] = 0;
        continue;
      }
      for (let g = 0; g < 3; g++) h.data[m + g] = o[g];
      const u = Math.max(
        0,
        Math.min(1, d.reduce((g, p, w) => g + p * (o[w] - s[m + w]), 0) / c)
      );
      s[m + 3] = Math.round(s[m + 3] * u);
      for (let g = 0; g < 3; g++) s[m + g] = l[g];
    }
    return t.width = e.width * 2, r.putImageData(h, 0, 0), r.putImageData(a, e.width, 0), await createImageBitmap(t);
  } finally {
    t.width = t.height = 0;
  }
}
const Oa = `${P}/img/frames/m15/holoStamps/stamp.png`, Mt = 310.216, qr = {
  frame: [52, 20, 298, 449],
  title: [70, 40, 261, 26],
  art: [65, 76.5, 270, 183.8],
  type: [70, 265, 261, 23],
  rules: [74, 301, 255, 160],
  artistY: 0,
  legalY: 0
}, $n = `${P}/img/frames/m15/split`, Xr = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style", Pa = [
  `${Xr}/namebox/texture/normal/c.png`,
  `${Xr}/typebox/texture/normal/c.png`
], yr = (e) => `${$n}${e.layout?.endsWith("-fuse") ? "/fuse" : ""}`;
function kr(e) {
  const t = O(e);
  return `${yr(e)}/${t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "a"}.png`;
}
function Da(e) {
  const t = e.manaSymbols ?? [];
  return t.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !t.some((r) => /^[WUBRG]$/.test(r));
}
function Wn(e) {
  const t = O(e);
  return [
    kr(e),
    ...t.length === 2 ? t.map((r) => `${yr(e)}/${r.toLowerCase()}.png`) : [],
    ...t.length === 2 && Da(e) ? Pa : [],
    ...["rare", "mythic"].includes(e.rarity ?? "") ? [Oa] : []
  ];
}
const _e = /* @__PURE__ */ new Map(), Yt = /* @__PURE__ */ new WeakMap();
let On = 0, Ht = 0;
const Pn = (e) => (Yt.has(e) || Yt.set(e, ++On), Yt.get(e));
function bt(e, t, r, a, s, n) {
  e.moveTo(t + n, r), e.lineTo(t + a - n, r), e.quadraticCurveTo(t + a + n * 0.25, r + s / 2, t + a - n, r + s), e.lineTo(t + n, r + s), e.quadraticCurveTo(t - n * 0.25, r + s / 2, t + n, r), e.closePath();
}
function Dn(e, t) {
  const r = (g) => {
    const p = t.get(g);
    if (!p) throw Error(`Modern split asset unavailable: ${g}`);
    return p;
  }, a = r(kr(e)), s = O(e);
  if (s.length !== 2) return a;
  "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 && s.reverse();
  const n = Da(e), o = [
    ...s.map((g) => r(`${yr(e)}/${g.toLowerCase()}.png`)),
    ...n ? Pa.map(r) : [a]
  ], i = s.join("") + (n ? "-hybrid-" : "-gold-") + [a, ...o].map(Pn).join("/"), l = _e.get(i);
  if (l)
    return _e.delete(i), _e.set(i, l), l;
  const d = document.createElement("canvas");
  d.width = a.width, d.height = a.height;
  const c = d.getContext("2d");
  c.scale(d.width / 488, d.height / 680), c.translate(0, 680), c.rotate(-Math.PI / 2);
  const h = (g) => {
    c.save(), c.translate(680, 0), c.rotate(Math.PI / 2), c.drawImage(g, 0, 0, 488, 680), c.restore();
  }, m = e.layout?.endsWith("-fuse") ?? !1;
  h(a);
  for (const g of [0, Mt]) {
    if (c.save(), c.beginPath(), n ? c.rect(g + 50, 0, Mt, 488) : (bt(c, g + 57.5, 29, 286, 47, 9), c.rect(g + 64, 74, 273, m ? 362 : 394), bt(c, g + 57.5, 260, 286, 34, 7)), m)
      for (const [y, b] of [
        [29, 47],
        [260, 34]
      ])
        c.moveTo(334, y), c.lineTo(356, y + b / 2), c.lineTo(378, y), c.lineTo(378, y + b), c.lineTo(356, y + b / 2), c.lineTo(334, y + b), c.closePath();
    c.clip(), h(o[0]);
    const p = document.createElement("canvas");
    p.width = d.width, p.height = d.height;
    const w = p.getContext("2d");
    w.drawImage(o[1], 0, 0, p.width, p.height), w.globalCompositeOperation = "destination-in";
    const f = w.createLinearGradient(
      0,
      (680 - g - 175) / 680 * p.height,
      0,
      (680 - g - 230) / 680 * p.height
    );
    if (f.addColorStop(0, "#0000"), f.addColorStop(1, "#000"), w.fillStyle = f, w.fillRect(0, 0, p.width, p.height), c.save(), c.translate(680, 0), c.rotate(Math.PI / 2), c.drawImage(p, 0, 0, 488, 680), c.restore(), c.restore(), p.width = p.height = 0, c.save(), c.beginPath(), bt(c, g + 62.5, 34.5, 276, 37.5, 7), bt(c, g + 62.5, 265, 276, 24, 5), m)
      for (const [y, b] of [
        [35, 37],
        [265, 24]
      ])
        c.moveTo(332, y), c.lineTo(349, y + b / 2), c.lineTo(332, y + b), c.closePath(), c.moveTo(380, y), c.lineTo(363, y + b / 2), c.lineTo(380, y + b), c.closePath();
    c.clip(), n ? (c.drawImage(o[2], 22, 7, 196, 19, g + 62.5, 34.5, 276, 37.5), c.drawImage(o[3], 22, 192, 196, 11, g + 62.5, 265, 276, 24)) : h(o[2]), c.restore();
  }
  const u = d.width * d.height * 4;
  for (const [g, p] of _e) {
    if (Ht + u <= 16 * 1024 * 1024) break;
    Ht -= p.width * p.height * 4, _e.delete(g), p.width = p.height = 0;
  }
  return u <= 16 * 1024 * 1024 && (_e.set(i, d), Ht += u), d;
}
function ut(e) {
  return ["split", "aftermath"].includes(e.layout ?? "") && e.faces?.length === 2 && (e.layout === "aftermath" || /^Aftermath\b/m.test(e.faces[1].rulesText ?? ""));
}
const Pe = 373, Ua = 257, Fa = `${P}/img/frames/saga/stamp.png`;
function _a(e) {
  const t = O(e), r = t.length > 1 ? "m" : t[0]?.toLowerCase();
  if (!r) throw Error("No validated colorless Aftermath plate is available.");
  return `${P}/img/frames/m15/aftermath/${r}.png`;
}
function Un(e) {
  return ut(e) ? [
    ...e.faces.map(_a),
    ...["rare", "mythic"].includes(e.rarity ?? "") ? [Fa] : []
  ] : [];
}
const Sr = {
  title: [41.7, 35.5, 405, 37],
  art: [37.4, 76.5, 413.2, 151.8],
  type: [41.7, 235.8, 405, 37],
  rules: [41.7, 281.5, 405, 76]
}, vr = {
  title: [12, 37.5, 227, 37],
  art: [11, 80.7, 240.9, 137.9],
  // Align the rotated type plate in its reading orientation (all type labels).
  type: [9, 226.2, 230, 37],
  rules: [14, 276.5, 232, 169]
};
function Fn(e) {
  const t = e ? vr : Sr, r = e ? Ua : 488, a = e ? 488 : Pe, s = (n) => {
    const [o, i, l, d] = t[n];
    return [o / r, i / a, l / r, d / a];
  };
  return {
    ...H,
    title: s("title"),
    art: s("art"),
    type: s("type"),
    rules: s("rules"),
    footer: [0, 1, 0, 0]
  };
}
const Na = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", _n = new Set("dis plc cmd pc2 dgm mma c13".split(" "));
function Me(e) {
  return e.layout !== "split" || e.faces?.length !== 2 || ut(e) || e.faces.some((t) => !/^(Instant|Sorcery)\b/.test(t.typeLine ?? "")) ? null : oe({ ...e, layout: "normal", frameStyle: e.frameStyle ?? e.faces[0]?.frameStyle }) ? "old" : e.frameAssetFamily === "eighth" || _n.has(e.setCode?.toLowerCase() ?? "") ? "eighth" : "m15";
}
function Ze(e) {
  const t = (r) => [
    r.rulesText ?? "",
    ...(r.rulesParagraphs ?? []).map((a) => a.runs.map((s) => s.text).join(""))
  ];
  return [e, ...e.faces ?? []].some((r) => t(r).some((a) => /^Fuse\b/m.test(a)));
}
const Ya = 251 * 680 / 523, Jr = 680 / 523, Tt = 488 / 375, Oe = (e, t, r, a) => [
  e * Jr,
  t * Tt,
  r * Jr,
  a * Tt
];
function tt(e, t) {
  if (e === "m15")
    return t ? { ...qr, rules: [74, 301, 255, 128] } : qr;
  const r = e === "old";
  return {
    frame: Oe(18, 18, t ? 244 : 236, 338),
    title: Oe(r ? 35 : 30, r ? 23 : 28, r ? 207 : 214, 21),
    art: r ? Oe(37, 47, 197, 130) : Oe(27, 56, 217, 152),
    type: Oe(r ? 35 : 30, r ? 182 : 211, 210, r ? 21 : 17),
    rules: r ? Oe(43, 207, 187, 109) : Oe(30, 233, 213, t ? 74 : 95),
    artistY: (r ? 332 : t ? 344 : 339) * Tt,
    legalY: (r ? 347 : 354) * Tt
  };
}
function Nn(e) {
  const t = e.layout?.startsWith("split-old") ? "old" : e.layout?.startsWith("split-m15") ? "m15" : "eighth", r = t === "m15" ? Mt : Ya, a = tt(t, e.layout?.endsWith("-fuse") ?? !1), s = (n) => [
    n[0] / r,
    n[1] / 488,
    n[2] / r,
    n[3] / 488
  ];
  return {
    ...H,
    frame: s(a.frame),
    title: s(a.title),
    art: s(a.art),
    type: s(a.type),
    rules: s(a.rules),
    footer: [0, 1, 0, 0]
  };
}
function jt(e, t, r, a) {
  if (t === "m15") return kr(e);
  const s = O(e), n = s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c";
  return `${Na}/${t === "old" ? "magic-old-split" : r ? "magic-new-split-fuse" : "magic-new-split"}.mse-style/${n}card${r ? a + 1 : ""}.${r ? "png" : "jpg"}`;
}
function Ha(e) {
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
const wt = `${P}/img/frames/saga`, za = [
  `${wt}/sagaMaskPinline.png`,
  `${wt}/sagaMaskBanner.png`,
  `${wt}/sagaMaskBannerRight.png`,
  `${wt}/sagaMidStripe.png`
];
function qa(e) {
  const t = O(e);
  return t.length !== 2 || e.layout === "transform" || e.land || /\bLand\b/.test(e.typeLine ?? "") ? [] : ("WUBRG".indexOf(t[1]) - "WUBRG".indexOf(t[0]) > 2 && t.reverse(), t.map(
    (r) => `${P}/data/images/cardImages/saga/sagaFrame${r}.png`
  ));
}
function Yn(e) {
  const t = qa(e);
  return t.length ? [...t, ...za] : [];
}
const Vr = /* @__PURE__ */ new WeakMap();
function Hn(e, t, r) {
  const a = qa(t);
  if (!a.length) return;
  const s = [...a, ...za].map((k) => {
    const S = r.get(k);
    if (!S) throw Error(`Saga color asset unavailable: ${k}`);
    return S;
  }), n = Vr.get(s[0]);
  if (n && n.sources.every((k, S) => k === s[S])) {
    e.drawImage(n.canvas, 0, 0, 488, 680);
    return;
  }
  const [o, i, l, d, c, h] = s, m = document.createElement("canvas");
  m.width = o.width, m.height = o.height;
  const u = document.createElement("canvas");
  u.width = m.width, u.height = m.height;
  const g = document.createElement("canvas");
  g.width = m.width, g.height = m.height;
  const p = m.getContext("2d"), w = u.getContext("2d"), f = g.getContext("2d"), y = m.width, b = m.height;
  f.drawImage(l, 0, 0, y, b), f.drawImage(d, 0, 0, y, b), p.drawImage(o, 0, 0, y, b), p.globalCompositeOperation = "destination-in", p.drawImage(g, 0, 0), p.globalCompositeOperation = "source-over", f.clearRect(0, 0, y, b), f.save(), f.beginPath(), f.rect(y / 2, 0, y / 2, b), f.clip(), f.drawImage(l, 0, 0, y, b), f.restore(), f.drawImage(c, 0, 0, y, b), w.drawImage(i, 0, 0, y, b), w.globalCompositeOperation = "destination-in", w.drawImage(g, 0, 0), p.drawImage(u, 0, 0), p.drawImage(h, 0.0727 * y, 0.3058 * b, 87e-4 * y, 0.4762 * b), Vr.set(o, { sources: s, canvas: m }), u.width = u.height = g.width = g.height = 0, e.drawImage(m, 0, 0, 488, 680);
}
const ct = `${P}/img/frames/saga`;
function Xa(e) {
  const t = O(e), r = t.length > 1 ? "M" : t[0];
  if (/\bLand\b/.test(e.typeLine ?? "") || e.land) return `${ct}/regular/l.png`;
  if (e.layout === "transform" && r) return `${ct}/dfc/${r.toLowerCase()}.png`;
  if (r) return `${P}/data/images/cardImages/saga/sagaFrame${r}.png`;
  throw Error("No ordinary colorless or artifact Saga plate is available.");
}
function ar(e) {
  return e.layout === "transform" && e.setCode?.toLowerCase() === "neo" ? `${P}/img/frames/m15/transform/icons/fanClosed.svg` : null;
}
const Ja = `${ct}/sagaChapter.png`, Va = `${ct}/sagaDivider.png`, gt = `${ct}/stamp.png`;
function zn(e) {
  return [
    Xa(e),
    ...Yn(e),
    Ja,
    Va,
    ...ar(e) ? [ar(e)] : [],
    ...["rare", "mythic"].includes(e.rarity ?? "") ? [gt] : []
  ];
}
const Ka = {
  ...H,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.5007, 0.1134, 0.4233, 0.724],
  type: [0.0854, 0.8481, 0.8292, 0.0543],
  rules: [0.0867, 0.1129, 0.404, 0.7248],
  stamp: [0.17, 0.48, 0.23, 0.16506]
}, Qe = `${P}/img/frames/adventure/regular`, Za = `${Qe}/bookLeft.png`, Qa = `${Qe}/pinline.svg`, es = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style/namebox/texture/normal/c.png", Wt = (e) => e.layout === "adventure" && e.faces?.length === 2;
function Le(e) {
  const t = e.manaSymbols ?? [];
  return O(e).length === 2 && t.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !t.some((r) => /^[WUBRG]$/.test(r));
}
function Rr(e) {
  const t = q(e), r = O(e);
  return t.land ? "l" : t.artifact ? "a" : r.length > 1 ? "m" : r[0]?.toLowerCase() ?? "a";
}
const sr = (e) => `${Qe}/${Rr(e)}.png`;
function Cr(e) {
  const t = Le(e) ? "W" : Rr(e).toUpperCase();
  return `${P}/img/frames/m15/regular/m15PT${t === "L" ? "C" : t}.png`;
}
const ts = (e) => `${P}/img/frames/m15/crowns/m15Crown${Rr(e).toUpperCase()}.png`;
function rs(e) {
  const t = e.faces?.[1];
  if (!Wt(e) || !t) throw Error("Adventure needs a permanent and an inset spell.");
  const r = (a) => {
    const s = O(a);
    return [
      sr(a),
      ...s.length === 2 ? s.map((n) => `${Qe}/${n.toLowerCase()}.png`) : []
    ];
  };
  return [
    .../* @__PURE__ */ new Set([
      ...r(e),
      ...r(t),
      Za,
      ...O(e).length === 2 && !Le(e) ? [Qa] : [],
      ...Le(e) ? [es] : [],
      ...q(e).legendary ? [ts(e)] : [],
      ...e.power != null && e.toughness != null ? [Cr(e)] : [],
      ...["rare", "mythic"].includes(e.rarity ?? "") ? [gt] : []
    ])
  ];
}
const Mr = {
  ...H,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.5267, 0.65, 0.3867, 0.2647],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.58, 0.74, 0.25, 0.1794]
};
function nr([e, t, r]) {
  const a = Math.max(e, t, r), s = a - Math.min(e, t, r);
  return [((s === 0 ? 0 : a === e ? (t - r) / s : a === t ? (r - e) / s + 2 : (e - t) / s + 4) * 60 % 360 + 360) % 360, a === 0 ? 0 : s / a, a];
}
function qn(e, t, r) {
  const a = (e % 360 + 360) % 360 / 60, s = r * t, n = s * (1 - Math.abs(a % 2 - 1)), o = r - s, i = a < 1 ? [s, n, 0] : a < 2 ? [n, s, 0] : a < 3 ? [0, s, n] : a < 4 ? [0, n, s] : a < 5 ? [n, 0, s] : [s, 0, n];
  return [i[0] + o, i[1] + o, i[2] + o];
}
function or(e, t) {
  const [r, a, s] = nr(e);
  return qn(
    r + t.hueDegrees,
    Math.min(1, a * t.saturationScale),
    Math.min(1, s * t.brightnessScale)
  );
}
const Xn = {
  W: { hueDegrees: 0, saturationScale: 0.439924, brightnessScale: 1.21405 },
  U: { hueDegrees: 17.808301, saturationScale: 0.546189, brightnessScale: 1.239832 },
  B: { hueDegrees: 0, saturationScale: 0.261951, brightnessScale: 1.149978 },
  R: { hueDegrees: -7.214766, saturationScale: 0.471958, brightnessScale: 1.212936 },
  G: { hueDegrees: 0, saturationScale: 0.227323, brightnessScale: 1.290867 }
};
function zt(e, t, r) {
  if (t.colorCalibration !== "set-hsb-v1" || !["eld", "woe"].includes(t.setCode?.toLowerCase() ?? ""))
    return;
  const a = Xn[r.toUpperCase()];
  if (!a) return;
  const s = e.getContext("2d"), n = e.width, o = e.height, i = [
    Math.floor(31 * n / 488),
    Math.floor(487 * o / 680),
    Math.ceil(214 * n / 488),
    Math.ceil(142 * o / 680)
  ], l = s.getImageData(...i);
  for (let c = 0; c < l.data.length; c += 4) {
    if (!l.data[c + 3]) continue;
    const h = or(
      [l.data[c] / 255, l.data[c + 1] / 255, l.data[c + 2] / 255],
      a
    );
    for (let m = 0; m < 3; m++)
      l.data[c + m] = Math.round(h[m] * 255);
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
const Ne = /* @__PURE__ */ new Map(), qt = /* @__PURE__ */ new WeakMap();
let Jn = 0, Xt = 0;
const Vn = (e) => (qt.has(e) || qt.set(e, ++Jn), qt.get(e));
function Kn(e, t) {
  const r = e.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const a = (f) => {
    const y = t.get(f);
    if (!y) throw Error(`Adventure asset unavailable: ${f}`);
    return y;
  }, s = rs(e).map(a), n = JSON.stringify([
    e.setCode,
    e.colorCalibration,
    e.colors,
    e.frameColors,
    e.manaSymbols,
    r.colors,
    r.frameColors,
    r.manaSymbols,
    s.map(Vn)
  ]), o = Ne.get(n);
  if (o)
    return Ne.delete(n), Ne.set(n, o), o;
  const i = a(sr(e)), l = document.createElement("canvas");
  l.width = i.width, l.height = i.height;
  const d = l.getContext("2d"), c = l.width, h = l.height, m = () => {
    const f = document.createElement("canvas");
    return f.width = c, f.height = h, f;
  }, u = (f, y) => {
    const b = m(), k = b.getContext("2d"), S = O(f);
    if (k.drawImage(a(sr(f)), 0, 0, c, h), y && S.length === 1 && zt(b, e, S[0]), S.length === 2) {
      "WUBRG".indexOf(S[1]) - "WUBRG".indexOf(S[0]) > 2 && S.reverse(), k.drawImage(a(`${Qe}/${S[0].toLowerCase()}.png`), 0, 0, c, h), y && zt(b, e, S[0]);
      const R = m(), C = R.getContext("2d");
      C.drawImage(a(`${Qe}/${S[1].toLowerCase()}.png`), 0, 0, c, h), y && zt(R, e, S[1]), C.globalCompositeOperation = "destination-in";
      const T = C.createLinearGradient(
        c * (y ? 0.22 : 0.43),
        0,
        c * (y ? 0.36 : 0.57),
        0
      );
      T.addColorStop(0, "#0000"), T.addColorStop(1, "#000"), C.fillStyle = T, C.fillRect(0, 0, c, h), k.drawImage(R, 0, 0), R.width = R.height = 0;
    }
    return b;
  };
  if (d.drawImage(i, 0, 0), O(e).length === 2) {
    const f = u(e, !1), y = f.getContext("2d");
    Le(e) || (y.globalCompositeOperation = "destination-in", y.drawImage(a(Qa), 0, 0, c, h)), d.drawImage(f, 0, 0), f.width = f.height = 0;
  }
  const g = u(r, !0), p = g.getContext("2d");
  if (p.globalCompositeOperation = "destination-in", p.drawImage(a(Za), 0, 0, c, h), d.save(), Le(r) && (d.filter = "grayscale(1)"), d.drawImage(g, 0, 0), d.restore(), g.width = g.height = 0, Le(e)) {
    d.save(), d.scale(c / 488, h / 680), d.beginPath();
    for (const [f, y] of [
      [34, 34],
      [388, 28]
    ])
      d.moveTo(38, f), d.lineTo(450, f), d.quadraticCurveTo(461, f + y / 2, 450, f + y), d.lineTo(38, f + y), d.quadraticCurveTo(29, f + y / 2, 38, f), d.closePath();
    d.clip();
    for (const [f, y] of [
      [34, 34],
      [388, 28]
    ])
      d.drawImage(a(es), 22, 7, 196, 19, 29, f, 432, y);
    d.restore();
  }
  const w = c * h * 4;
  for (const [f, y] of Ne) {
    if (Xt + w <= 16 * 1024 * 1024) break;
    Xt -= y.width * y.height * 4, Ne.delete(f), y.width = y.height = 0;
  }
  return w <= 16 * 1024 * 1024 && (Ne.set(n, l), Xt += w), l;
}
const ir = (e, t = !1) => `${t ? "italic " : ""}${e}px "CardRenderer MTG MPlantin", Georgia`;
function Zn(e) {
  const t = [];
  let r = [], a = !1;
  const s = () => {
    r.length && (t.push({ pieces: r, space: a }), r = [], a = !1);
  };
  for (const n of e)
    for (const o of xt(n.text))
      if (o.symbol) r.push({ text: o.symbol, symbol: !0, italic: !1 });
      else
        for (const i of o.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(i) ? (s(), i === `
` ? (t.push({ pieces: [], space: !1, newline: !0 }), a = !1) : a = !0) : r.push({ text: i, symbol: !1, italic: !!n.italic });
  return s(), t;
}
function it(e, t, r) {
  const a = [];
  for (const s of t) {
    const n = a.at(-1);
    n && !n.symbol && !s.symbol && n.italic === s.italic ? n.text += s.text : a.push({ ...s });
  }
  return a.map((s) => {
    e.font = ir(r, s.italic);
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
function as(e, t, r, a) {
  const s = [];
  let n = [];
  for (const o of t) {
    if (o.newline) {
      s.push(it(e, n, a)), n = [];
      continue;
    }
    const i = n.length && o.space ? [{ text: " ", italic: o.pieces[0]?.italic ?? !1, symbol: !1 }] : [], l = it(e, [...n, ...i, ...o.pieces], a);
    n.length && l.reduce((d, c) => d + c.width, 0) > r ? (s.push(it(e, n, a)), n = [...o.pieces]) : n.push(...i, ...o.pieces);
  }
  return n.length && s.push(it(e, n, a)), s;
}
function Kr(e, t, r, a) {
  const s = as(e, t, r, a);
  if (s.length < 2) return s;
  const n = /* @__PURE__ */ new Map(), o = (h, m) => {
    const u = `${h}:${m}`;
    let g = n.get(u);
    if (!g) {
      const p = [];
      for (let w = h; w < m; w++) {
        const f = t[w];
        w > h && f.space && p.push({ text: " ", italic: f.pieces[0]?.italic ?? !1, symbol: !1 }), p.push(...f.pieces);
      }
      g = it(e, p, a), n.set(u, g);
    }
    return g;
  }, i = /* @__PURE__ */ new Map(), l = (h, m) => {
    if (!m) return h === t.length ? { cost: 0, cuts: [] } : null;
    const u = `${h}:${m}`;
    if (i.has(u)) return i.get(u);
    let g = null;
    for (let p = h + 1; p <= t.length - m + 1; p++) {
      const w = o(h, p).reduce((b, k) => b + k.width, 0);
      if (w > r) break;
      const f = l(p, m - 1);
      if (!f) continue;
      const y = f.cost + (r - w) ** 2;
      (!g || y < g.cost) && (g = { cost: y, cuts: [p, ...f.cuts] });
    }
    return i.set(u, g), g;
  }, d = l(0, s.length);
  if (!d) return s;
  let c = 0;
  return d.cuts.map((h) => {
    const m = o(c, h);
    return c = h, m;
  });
}
function Zr(e, t, r, a, s = !1) {
  const n = Zn(t);
  if (!s || n.length > 64) return as(e, n, r, a);
  const o = [];
  let i = [];
  for (const l of n)
    l.newline ? (o.push(...i.length ? Kr(e, i, r, a) : [[]]), i = []) : i.push(l);
  return i.length && o.push(...Kr(e, i, r, a)), o;
}
const Gt = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function J(e, t, r, a = 24, s = 15, n = Gt) {
  e.save(), e.letterSpacing = "0px", e.textBaseline = "alphabetic", e.textAlign = "left";
  try {
    let o, i = a;
    do {
      const l = [], d = [];
      let c = 0, h;
      for (const k of t) {
        let S = i, R = Zr(
          e,
          k.runs,
          r.width,
          S,
          n.balanceLines
        );
        if (k.role === "flavor" && n.flavorOrphans !== !1 && R.length > 2 && R.at(-1).reduce((C, T) => C + T.width, 0) < r.width * 0.3)
          for (let C = S - 0.25; C >= S * 0.94; C -= 0.25) {
            const T = Zr(
              e,
              k.runs,
              r.width,
              C,
              n.balanceLines
            );
            if (T.length < R.length) {
              S = C, R = T;
              break;
            }
          }
        if (R.length) {
          h && (h === "rules" && k.role === "flavor" ? c += i * n.flavorGap : (h !== "flavor" || k.role !== "flavor") && (c += i * n.paragraphGap));
          for (const C of R) {
            const T = Math.max(0, ...C.map(($) => $.ascent)), M = Math.max(0, ...C.map(($) => $.descent)), G = C.reduce(($, V) => $ + V.width, 0), x = r.x + (k.align === "right" ? r.width - G : k.align === "center" ? (r.width - G) / 2 : 0);
            let W = 0, I = 1 / 0, F = -1 / 0;
            for (const $ of C)
              I = Math.min(I, W + $.inkLeft), F = Math.max(F, W + $.inkRight), W += $.width;
            l.push({
              x,
              runs: C,
              role: k.role,
              baseline: c,
              width: G,
              inkBounds: [
                x + (C.length ? I : 0),
                c - T,
                C.length ? F - I : 0,
                T + M
              ]
            }), c += S * n.leading;
          }
          h = k.role;
        }
      }
      if (n.flavorSeparator !== !1)
        for (let k = 1; k < l.length; k++) {
          const S = l[k - 1], R = l[k];
          if (S.role !== "rules" || R.role !== "flavor") continue;
          const C = S.inkBounds[1] + S.inkBounds[3];
          d.push((C + R.inkBounds[1]) / 2 - 0.3);
        }
      const m = l[0]?.inkBounds[1] ?? 0, u = l.at(-1)?.inkBounds, g = u ? u[1] + u[3] - m : 0, p = Math.max(0, r.height - g), w = r.y + Math.max(0, Math.min(p, p / 2 + (n.centerOffset ?? 0))), f = Math.max(r.y, r.verticalLimits?.[0] ?? r.y), y = Math.min(
        r.y + r.height,
        r.verticalLimits?.[1] ?? r.y + r.height
      ), b = Math.max(f, Math.min(y - g, w)) - m;
      if (o = {
        size: i,
        x: r.x,
        top: m + b,
        width: r.width,
        height: g,
        overflow: g > y - f + 0.01 || l.some((k) => k.width > r.width + 0.01),
        lines: l.map((k) => ({
          ...k,
          baseline: k.baseline + b,
          inkBounds: [
            k.inkBounds[0],
            k.inkBounds[1] + b,
            k.inkBounds[2],
            k.inkBounds[3]
          ]
        })),
        separators: d.map((k) => k + b)
      }, o.overflow ||= o.lines.some(
        (k) => r.exclusions?.some(([S, R, C, T]) => {
          const [M, G, x, W] = k.inkBounds;
          return M < S + C && M + x > S && G < R + T && G + W > R;
        })
      ), !o.overflow || i <= s) break;
      i = Math.max(s, i - 0.25);
    } while (!0);
    return o;
  } finally {
    e.restore();
  }
}
const Qn = ["ice", "chr", "all"], e0 = { leg: { "Adun Oakenshield": "{G}{R}{B}", "Angus Mackenzie": "{W}{U}{G}", "Arcades Sabboth": "{2}{W}{W}{G}{G}{U}{U}", "Axelrod Gunnarson": "{4}{B}{B}{R}{R}", "Ayesha Tanaka": "{U}{U}{W}{W}", "Barktooth Warbeard": "{4}{B}{R}{R}", "Bartel Runeaxe": "{3}{G}{R}{B}", "Boris Devilboon": "{3}{B}{R}", Chromium: "{2}{B}{B}{U}{U}{W}{W}", "Dakkon Blackblade": "{2}{B}{U}{U}{W}", "Gabriel Angelfire": "{3}{W}{W}{G}{G}", "Gosta Dirk": "{3}{W}{W}{U}{U}", "Gwendlyn Di Corci": "{R}{B}{B}{U}", Halfdane: "{1}{B}{U}{W}", "Hazezon Tamar": "{4}{W}{G}{R}", "Hunding Gjornersen": "{3}{U}{U}{W}", "Jacques le Vert": "{1}{W}{G}{R}", "Jasmine Boreal": "{3}{W}{G}", "Jedit Ojanen": "{4}{U}{W}{W}", "Jerrard of the Closed Fist": "{3}{G}{G}{R}", Johan: "{3}{W}{G}{R}", "Kasimir the Lone Wolf": "{4}{U}{W}", "Kei Takahashi": "{2}{W}{G}", "Lady Caleria": "{3}{W}{W}{G}{G}", "Lady Evangela": "{B}{U}{W}", "Lady Orca": "{5}{B}{R}", "Livonya Silone": "{2}{G}{G}{R}{R}", "Lord Magnus": "{3}{W}{W}{G}", "Marhault Elsdragon": "{3}{G}{R}{R}", Nebuchadnezzar: "{3}{B}{U}", "Nicol Bolas": "{2}{U}{U}{B}{B}{R}{R}", "Palladia-Mors": "{2}{W}{W}{G}{G}{R}{R}", "Pavel Maliki": "{4}{B}{R}", "Princess Lucrezia": "{3}{B}{U}{U}", Ragnar: "{U}{W}{G}", "Ramirez DePietro": "{3}{B}{B}{U}", "Ramses Overdark": "{2}{B}{B}{U}{U}", "Rasputin Dreamweaver": "{4}{W}{U}", "Riven Turnbull": "{5}{B}{U}", "Rohgahh of Kher Keep": "{2}{B}{B}{R}{R}", "Rubinia Soulsinger": "{2}{U}{W}{G}", "Sir Shandlar of Eberyn": "{4}{W}{G}", "Sivitri Scarzam": "{5}{B}{U}", "Sol'kanar the Swamp King": "{2}{R}{B}{U}", Stangg: "{4}{G}{R}", "Sunastian Falconer": "{3}{G}{R}", "Tetsuo Umezawa": "{R}{B}{U}", "The Lady of the Mountain": "{4}{G}{R}", "Tobias Andrion": "{3}{U}{W}", "Tor Wauki": "{2}{B}{B}{R}", "Torsten Von Ursus": "{3}{W}{G}{G}", "Tuknir Deathlock": "{G}{G}{R}{R}", "Ur-Drago": "{3}{B}{B}{U}{U}", "Vaevictis Asmadi": "{2}{B}{B}{R}{R}{G}{G}", "Xira Arien": "{G}{R}{B}" }, drk: { "Dark Heart of the Wood": "{B}{G}", "Marsh Goblins": "{B}{R}", "Scarwood Goblins": "{G}{R}" } }, Qr = {
  wubrgSets: Qn,
  overrides: e0
};
function t0(e, t) {
  const r = e.setCode?.toLowerCase() ?? "", s = Qr.overrides[r]?.[e.name ?? ""];
  if (s) {
    const n = [...s.matchAll(/\{([^}]+)\}/g)].map((o) => o[1]);
    return [...n].sort().join("|") === [...t].sort().join("|") ? n : [...t];
  }
  return !Qr.wubrgSets.includes(r) || t.some((n) => !/^(?:\d+|X|[WUBRG])$/.test(n)) ? [...t] : [
    ...t.filter((n) => !"WUBRG".includes(n)),
    ...t.filter((n) => "WUBRG".includes(n)).sort((n, o) => "WUBRG".indexOf(n) - "WUBRG".indexOf(o))
  ];
}
function rt(e) {
  return e.rulesParagraphs ?? e.rulesText.split(`
`).filter(Boolean).map((t) => ({ role: "rules", runs: [{ text: t }] }));
}
function Yi(e, t, r = "oracle", a = {}) {
  const s = t[r];
  if (!s) throw Error(`Missing ${r} printing wording`);
  if (typeof s.typeLine != "string" || typeof s.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const n = a.rulesAlignment ?? r, o = n === "left" ? void 0 : t[n];
  if (n !== "left" && !o) throw Error(`Missing ${n} alignment wording`);
  const i = q({ ...e, typeLine: t.oracle.typeLine });
  return {
    ...e,
    ...s,
    manaSymbols: s.manaSymbols ?? (r === "original" ? t0(e, e.manaSymbols ?? []) : t.oracle.manaSymbols ?? e.manaSymbols),
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: s.rulesParagraphs,
    rulesAlignment: o ? { mode: "auto", reference: rt(o) } : { mode: "left" },
    artifact: e.artifact ?? i.artifact,
    land: e.land ?? i.land,
    creature: e.creature ?? i.creature,
    legendary: e.legendary ?? i.legendary,
    wordingMode: r,
    symbolStyle: a.symbolStyle ?? (r === "oracle" ? "modern" : "original")
  };
}
function pt(e, t, r, a, s, n, o, i, l = 1 / 0) {
  const d = (u) => (u.align === void 0 || u.align === "center") && u.runs.length > 0 && u.runs.every((g) => !g.text.includes(`
`));
  if (!r.length || !r.every(d) || !t.every(d)) return null;
  const c = r.map((u) => u.runs.map((g) => g.text).join("")).join(`
`);
  if (Array.from(c.replace(/\{[^}]+\}/g, "●")).length > l) return null;
  const h = (u) => u.map((g) => ({ ...g, align: "center" })), m = J(e, h(r), a, s, s, i);
  return m.overflow || m.lines.length > o ? null : J(e, h(t), a, s, n, i);
}
function r0(e, t) {
  const r = t.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const a = (m) => {
    const u = rt({
      rulesText: m.rulesText ?? "",
      rulesParagraphs: m.rulesParagraphs
    });
    return m.rulesAlignment?.mode === "left" ? u.map((g) => ({ ...g, align: "left" })) : u;
  }, s = { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: !0 }, n = a(t), o = {
    x: 261,
    y: 438,
    width: 189,
    height: 178,
    exclusions: t.power != null && t.toughness != null ? [[368, 601, 94, 51]] : []
  }, i = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? n : n, l = t.rulesAlignment?.mode !== "left" && i.length === 1 && i[0].role === "rules" ? pt(e, n, i, o, 22.5, 9, 1, s) : null, d = a(r), c = { x: 41.7, y: 499, width: 191, height: 122 }, h = J(e, d, c, 20.25, 20.25, s);
  return {
    permanent: l || J(e, n, o, 22.5, 9, s),
    spell: !h.overflow && h.lines.length <= 4 ? h : J(e, d, c, 22.5, 9, s)
  };
}
const a0 = [
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
], xe = 0.91339 * v / 768, lr = 0.04724 * v, dr = 0.02655 * j;
function s0(e) {
  return [
    (lr + 20 * xe) / v,
    (dr + 84 * xe) / j,
    728 * xe / v,
    ((e ? 541 : 622) - 84) * xe / j
  ];
}
function n0(e, t) {
  const r = a0[t ? 1 : 0];
  e.beginPath(), r.forEach(([a, s], n) => {
    const o = lr + (s - 1) * xe, i = dr + a * xe;
    n === 0 ? e.moveTo(o, i) : e.lineTo(o, i);
  });
  for (let a = r.length - 1; a >= 0; a--) {
    const [s, n] = r[a];
    e.lineTo(lr + (769 - n) * xe, dr + s * xe);
  }
  e.closePath(), e.clip();
}
const Ot = `${P}/img/frames/prepare/regular`, Tr = (e) => e.layout === "prepare";
function at(e) {
  if (e.faces?.length !== 2) throw Error("Prepared needs a creature and an inset spell.");
  return e.faces[1];
}
function jr(e) {
  const t = q(e), r = O(e);
  if (t.land) return "l";
  if (/\bVehicle\b/.test(e.typeLine ?? "")) return "v";
  if (t.artifact) return "a";
  if (r.length > 1) return "m";
  if (r.length) return r[0].toLowerCase();
  throw Error("The pinned Prepared source has no colorless plate.");
}
const lt = (e) => `${Ot}/${jr(e)}.png`, St = (e) => `${Ot}/${e}.png`;
function qe(e) {
  const t = O(e);
  return t.length === 2 && "WUBRG".indexOf(t[1]) - "WUBRG".indexOf(t[0]) > 2 && t.reverse(), t;
}
const cr = (e) => `${P}/img/frames/m15/crowns/m15Crown${e.toUpperCase()}.png`, o0 = (e) => Cr(e);
function ss(e) {
  const t = at(e), r = (s) => qe(s).length === 2 ? qe(s).map((n) => `${Ot}/${n.toLowerCase()}.png`) : [], a = qe(e);
  return [
    .../* @__PURE__ */ new Set([
      lt(e),
      lt(t),
      St("prepare"),
      ...r(e),
      ...r(t),
      ...a.length === 2 ? ["pinline", "rules", "rulesRight"].map(St) : [],
      ...qe(t).length === 2 ? ["prepareRight", "prepareTypeTitle"].map(St) : [],
      ...q(e).legendary ? (a.length === 2 ? a : [jr(e)]).map(cr) : [],
      ...e.power != null && e.toughness != null ? [o0(e)] : [],
      ...["rare", "mythic"].includes(e.rarity ?? "") ? [gt] : []
    ])
  ];
}
const Gr = {
  ...H,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.086, 0.6303, 808 / 2010, 0.2875],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.17, 0.72, 0.25, 0.1794]
}, i0 = {
  title: [1042 / 2010, 0.6391, 0.4, 0.0296],
  type: [1042 / 2010, 1932 / 2814, 0.4, 0.0296],
  rules: [1035 / 2010 + 2 / 488, 2059 / 2814, 0.3947, 438 / 2814]
}, l0 = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", ea = {
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
}, ht = {
  artInset: 4.5,
  artRim: 1.5,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function ns(e) {
  if (!e.frameAssetFamily && !q(e).legendary && (e.layout ?? "normal") === "normal" && Xe === l0) {
    const t = e.borderColor ?? (Re(e.setCode).border === "#eeedeb" ? "white" : "black"), r = `${e.setCode?.toLowerCase() ?? ""}/${t}`;
    if (Object.hasOwn(ea, r)) return ea[r];
  }
  return ["m15", "m19", "m20", "war"].includes(e.setCode?.toLowerCase() ?? "") ? ht.frameInset : 0;
}
function os(e) {
  return ["B", "Colourless", "Land"].includes(q(e).boxes);
}
function is(e) {
  return e.frameAssetFamily !== "eighth" || !e.artist ? null : `${P}/img/manaSymbols/${os(e) ? "whitebrush" : "brush"}.svg`;
}
function d0(e, t) {
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
        const d = -Math.PI / 2 + l * Math.PI / 5, c = l % 2 ? 3.1 : 7.5, h = n + 7.5 + c * Math.cos(d), m = 622 + c * Math.sin(d);
        l === 0 ? e.moveTo(h, m) : e.lineTo(h, m);
      }
      e.closePath(), e.fill();
    } else e.fillText(i, n, 627);
    n += a[o];
  }
  e.restore();
}
function c0(e, t, r) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.letterSpacing = "0px", t.power != null && t.toughness != null && (e.fillStyle = "#17140f", e.font = '700 29px "CardRenderer MTG Matrix Small Caps", Georgia', e.textAlign = "center", e.textBaseline = "middle", d0(e, `${t.power}/${t.toughness}`));
  const a = t.setCode?.toLowerCase(), s = a === "8ed" ? 75 : a === "9ed" ? 79 : 77, n = a === "8ed" || a === "9ed", o = n ? 633 : 634;
  e.fillStyle = os(t) ? "#fff" : "#17140f", e.textBaseline = "alphabetic", e.textAlign = "left";
  const i = is(t);
  if (i) {
    const l = r.get(i);
    if (!l) throw Error(`Eighth Edition artist brush unavailable: ${i}`);
    e.drawImage(l, 36.5, o - 10, s - 39, 13.5), e.font = `700 ${n ? 17.5 : 18}px "CardRenderer MTG Matrix", Georgia`;
    const d = t.power != null && t.toughness != null ? 350 : 448;
    e.fillText(t.artist, s, o, d - s);
  }
  t.legalText && (e.font = '9px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 36.5, o + 13, 395)), e.restore();
}
function Pt(e) {
  if (!e.frameAssetFamily) return null;
  if (oe(e) || e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
    throw Error("Replacement frame plates currently support ordinary modern faces only.");
  const t = e.frameAssetFamily === "eighth", r = q(e), a = O(e), s = a.length === 2 && "WUBRG".indexOf(a[1]) - "WUBRG".indexOf(a[0]) > 2 ? [...a].reverse() : a, o = `${P}/img/frames/${t ? "8th" : "m15/new"}`, i = r.land ? "l" : r.artifact ? "a" : /\bVehicle\b/.test(e.typeLine ?? "") ? "v" : a.length > 1 ? "m" : a[0]?.toLowerCase() ?? "c", l = (g) => t ? `${g.toLowerCase()}l` : `l${g.toLowerCase()}`, d = r.land && s.length ? l(s.length > 2 ? "m" : s[0]) : i, c = r.land && s.length === 2 ? l(s[1]) : void 0, h = i === "l" ? t ? "l" : "c" : i, m = t ? [0.09, 0.0629, 0.824, 0.0429] : [168 / 2010, 145 / 2814, 0.8292, 0.0543], u = t ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358] : [168 / 2010, 1588 / 2814, 0.8292, 0.0543];
  return {
    frame: `${o}/${d}.png`,
    rightFrame: c ? `${o}/${c}.png` : void 0,
    border: `${o}/border.png`,
    pt: t ? `${P}/img/frames/8th/pt/${h === "c" ? "l" : h}.png` : `${P}/img/frames/m15/regular/m15PT${h.toUpperCase()}.png`,
    rects: {
      ...H,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title: m,
      type: u,
      art: t ? [180 / 2010, 341 / 2814, 1656 / 2010, 1216 / 2814] : [0.0767, 0.1129, 0.8476, 0.4429],
      rules: t ? [205 / 2010, 1779 / 2814, 1596 / 2010, 729 / 2814] : [0.086, 1780 / 2814, 0.828, 0.2875],
      stats: t ? [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814] : [0.7573, 0.8848, 0.188, 0.0733],
      footer: t ? [150 / 2010, 1938 / 2100, 0.81, 0.04] : H.footer
    },
    titleSize: t ? 29.2 : 26,
    typeSize: t ? 24.3 : 22,
    // Shared family adjustments measured after frame-only scan normalization.
    // Cost discs have their own baseline; they do not follow font centering.
    mana: {
      right: (t ? 0.9147 : 1864 / 2010) - (t ? 2 : 1) / 488,
      center: m[1] + m[3] / 2 + (t ? 1 : -4) / 680,
      size: t ? 22 : 23.4,
      gap: 1.5
    },
    symbol: t ? { right: 0.9079 - 2 / 488, center: 0.5886, width: 0.114, height: 0.0391 * 0.95 } : { right: 1862 / 2010 - 2 / 488, center: 0.591, width: 0.114, height: 0.041 * 0.95 }
  };
}
function h0(e) {
  const t = Pt(e);
  if (!t) return null;
  const r = is(e);
  return [
    ...r ? [r] : [],
    t.frame,
    ...t.rightFrame ? [t.rightFrame] : [],
    ...e.power != null && e.toughness != null ? [t.pt] : [],
    ...Re(e.setCode, e.borderColor).border !== "#090806" ? [t.border] : []
  ];
}
function ft(e) {
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
function re(e) {
  return e.layout === "ability" ? "normal" : e.layout === "prepare" ? "prepare" : e.layout === "adventure" && e.faces?.length === 2 ? "adventure" : e.layout === "class" || /\bClass\b/i.test(e.typeLine ?? "") ? "class" : e.layout === "leveler" || /^Level up\b/m.test(e.rulesText ?? "") ? "leveler" : e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "") ? "saga" : e.layout === "planeswalker" || /\bPlaneswalker\b/i.test(e.typeLine ?? "") ? ft(e).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function be(e) {
  if (e.layout === "aftermath-top" || e.layout === "aftermath-bottom")
    return Fn(e.layout === "aftermath-bottom");
  if (/^split-(old|eighth|m15)(-fuse)?$/.test(e.layout ?? "")) return Nn(e);
  const t = Pt(e);
  if (t) return t.rects;
  if (oe(e)) return fr(e);
  const r = re(e);
  if (r === "adventure") return Mr;
  if (r === "prepare") return Gr;
  if (r === "class")
    return {
      ...H,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (r === "saga") return Ka;
  if (r.startsWith("planeswalker")) {
    const a = r === "planeswalker-large", s = [
      0.04409,
      a ? 0.55118 : 0.62655,
      0.88827,
      a ? 0.37534 : 0.29997
    ], n = H.stamp[2], o = H.stamp[3];
    return {
      ...H,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, 0.92126 * v * 3793 / 2778 / j],
      frame: [0.04724, 0.02655, 0.91339, 0.91339 * v * 3810 / 2736 / j],
      art: s0(a),
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / v,
        (a ? 0.49044 : 0.55793) + 5 / j,
        0.88662,
        0.05737
      ],
      rules: s,
      stats: [0.792 + 1 / v, 0.881 - 3 / j, 0.16, 0.069],
      stamp: [
        s[0] + (s[2] - n) / 2,
        s[1] + (s[3] - o) / 2,
        n,
        o
      ]
    };
  }
  return e.layout === "split-half" ? {
    ...H,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : {
    ...H,
    art: [
      H.art[0] + ht.artInset / v,
      H.art[1],
      H.art[2] - 2 * ht.artInset / v,
      H.art[3]
    ]
  };
}
function m0(e) {
  const t = re(e) === "saga", r = be(e).rules, a = ft(e), s = r[2] * 488 - (t ? 32 : 70), n = r[3] * 680;
  let o = t ? 21 : 19;
  const i = (w, f) => Math.max(1, Math.ceil(w.length * f * 0.49 / s)), l = (w, f) => Math.max(t ? w.badges.length * 36 : 34, i(w.text, f) * f + 16), d = (w) => a.reduce((f, y) => f + l(y, w), 0);
  for (; o > 8 && d(o) > n; ) o -= 0.5;
  const c = a.map((w) => l(w, o)), h = Math.max(0, n - d(o)) / Math.max(1, a.length);
  let m = n / Math.max(1, a.length), u = n, g = a.length;
  if (!t)
    for (const w of [...c].sort((f, y) => y - f)) {
      if (w <= m) break;
      u -= w, m = u / Math.max(1, --g);
    }
  let p = 0;
  return a.map((w, f) => {
    const y = t ? c[f] + h : Math.max(m, c[f]), b = { ...w, top: p, height: y, font: o, left: t ? 27 : 62, width: s };
    return p += y, b;
  });
}
function It(e, t, [r, a, s, n]) {
  if (!(e > 0 && t > 0)) return [r, a, s, n];
  const o = Math.max(s / e, n / t), i = e * o, l = t * o;
  return [r + (s - i) / 2, a + (n - l) / 2, i, l];
}
function u0(e, t, r, a) {
  const s = [a[0] * e, a[1] * t, a[2] * e, a[3] * t];
  return [...s, ...It(s[2], s[3], r)];
}
function Ce(e, t, r, a, s) {
  const [n, o, i, l] = a, d = re(t);
  if (e.save(), d.startsWith("planeswalker") && n0(e, d === "planeswalker-large"), s === "printing") {
    e.clearRect(n, o, i, l), e.restore();
    return;
  }
  (s === "artwork" || d.startsWith("planeswalker")) && (e.fillStyle = "#80745c", e.fillRect(n, o, i, l));
  const c = r.get(t.illustration ?? "");
  if (!c) {
    e.restore();
    return;
  }
  e.beginPath(), e.rect(n, o, i, l), e.clip(), t.illustrationCrop ? e.drawImage(
    c,
    ...u0(c.width, c.height, a, t.illustrationCrop)
  ) : e.drawImage(c, ...It(c.width, c.height, a)), e.restore();
}
function Ir(e, t, r, a, s, n = "#efe7cb", o) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = n, e.beginPath(), e.arc(t + a / 2, r + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.clip(), e.fillStyle = "#0d0f0f", e.font = '100px "CardRenderer MTG Historic Symbols"', e.textAlign = "left", e.textBaseline = "alphabetic";
  const i = "", l = e.measureText(i), d = l.actualBoundingBoxLeft + l.actualBoundingBoxRight, c = l.actualBoundingBoxAscent + l.actualBoundingBoxDescent, h = s * (o?.scale ?? 1) / Math.max(d, c);
  e.translate(t + a / 2 + (o?.dx ?? 0), r + a / 2 + (o?.dy ?? 0)), e.scale(h, h), e.fillText(
    i,
    (l.actualBoundingBoxLeft - l.actualBoundingBoxRight) / 2,
    (l.actualBoundingBoxAscent - l.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function et(e) {
  if (!/^#[a-f0-9]{6}$/i.test(e)) throw Error("Invalid mana palette color");
  return [
    parseInt(e.slice(1, 3), 16) / 255,
    parseInt(e.slice(3, 5), 16) / 255,
    parseInt(e.slice(5, 7), 16) / 255
  ];
}
const g0 = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, p0 = "#9aa4ae", Jt = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
function Br(e, t, r, a) {
  const s = [];
  for (const n of t.split(`
`)) {
    let o = [], i = 0;
    const l = xt(n).flatMap(
      (d) => d.symbol ? [{ text: d.symbol, symbol: !0 }] : (d.value.match(/\s+|\S+/g) ?? []).map((c) => ({ text: c, symbol: !1 }))
    );
    for (const d of l) {
      const c = !d.symbol && e.measureText(d.text).width > r ? [...d.text].map((h) => ({ text: h, symbol: !1 })) : [d];
      for (const h of c) {
        const m = h.symbol ? a * 0.94 : e.measureText(h.text).width;
        i + m > r && o.length && (s.push(o), o = [], i = 0), !(!o.length && /^\s+$/.test(h.text)) && (o.push({ ...h, width: m }), i += m);
      }
    }
    s.push(o);
  }
  return s;
}
function Z(e, t, r, a, s, n, o = !1, i) {
  if (t === "W" && n.originalWhiteGlyph) {
    Ir(
      e,
      r,
      a,
      s,
      s * 0.87,
      n.manaColors?.W,
      dt(i, t)
    );
    return;
  }
  const l = /^\d+$/.test(t), d = dt(i, t), c = n.manaGlyphScales?.[t] ?? 1, h = l ? i ? n.manaNumerals?.get(t) : void 0 : c !== 1 || d ? n.manaGlyphs?.get(t) : void 0, m = n.get(Je(t) ?? "");
  if (e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, o) {
    const u = e.getTransform();
    e.shadowColor = "#000d", e.shadowOffsetX = 1.5372 * (-u.a + u.c), e.shadowOffsetY = 1.5372 * (-u.b + u.d);
  }
  if (e.fillStyle = n.manaColors?.[t] ?? g0[t] ?? p0, e.beginPath(), e.arc(r + s / 2, a + s / 2, s / 2, 0, Math.PI * 2), e.fill(), e.shadowColor = "transparent", h && e.drawImage(h.image, 0, 0, h.width, h.height, r, a, s, s), h) {
    const u = l ? i?.numberDx ?? 0 : d?.dx ?? 0, g = l ? i?.numberDy ?? 0 : d?.dy ?? 0, p = l ? i?.numberScale ?? 1 : c * (d?.scale ?? 1);
    l || (e.beginPath(), e.arc(r + s / 2, a + s / 2, s / 2, 0, Math.PI * 2), e.clip()), (u || g || p !== 1) && (e.translate(r + s / 2 + u, a + s / 2 + g), e.scale(p, p), e.translate(-r - s / 2, -a - s / 2));
  }
  if (h || m) {
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
    ) : e.drawImage(m, r, a, s, s), e.restore();
    return;
  }
  e.fillStyle = t === "B" ? "white" : "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = `bold ${s * 0.62}px Georgia`, e.fillText(t, r + s / 2, a + s / 2, s * 0.9), e.restore();
}
function ls(e, t, r, a, s, n, o) {
  const i = typeof n == "number" ? n : n.size;
  e.font = `${typeof n != "number" && n.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
  const l = t.split(`
`).map((d) => Br(e, d, s, i));
  e.textBaseline = "top";
  for (const d of l) {
    for (const c of d) {
      let h = r;
      for (const m of c)
        m.symbol ? Z(e, m.text, h + i * 0.07, a + i * 0.03, i * 0.8, o) : e.fillText(m.text, h, a), h += m.width;
      a += i;
    }
    a += E.paragraphGap;
  }
}
function Hi(e, t, r) {
  if (e.measureText(t).width <= r) return t;
  const a = [...t];
  for (; a.length && e.measureText(`${a.join("")}…`).width > r; ) a.pop();
  return a.length || e.measureText("…").width <= r ? `${a.join("")}…` : "";
}
function Q(e, t, r, a, s, n, o = !1, i = 1, l = "CardRenderer MTG Beleren") {
  if (!(s > 0)) throw Error("Magic title/type plate has no text space.");
  e.save(), e.font = `${o ? "bold " : ""}${n}px "${l}", Georgia`;
  const d = e.measureText(t).width;
  i > 1 && d * i > s && (i = 1), i !== 1 && (e.translate(r, 0), e.scale(i, 1), r = 0, s /= i), d > s && (n = Math.max(n * 0.78, n * s / d), e.font = `${o ? "bold " : ""}${n}px "${l}", Georgia`), e.fillText(t, r, a, s), e.restore();
}
function Te(e, t, r, a, s, n, o, i, l = [0, 0, 1, 1]) {
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
  const m = h.getContext("2d");
  m.drawImage(t, ...d, 0, 0, h.width, h.height), m.globalCompositeOperation = "source-in", m.fillStyle = c, m.fillRect(0, 0, h.width, h.height), e.drawImage(h, s, n, o, i), h.width = h.height = 0;
}
const f0 = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function b0(e) {
  return !f0.has(e?.trim().toLowerCase() ?? "");
}
function ds(e, t, r = j, a = 1) {
  const s = be(t), n = {
    ...Gt,
    flavorSeparator: t.frameAssetFamily === "eighth" ? !1 : b0(t.setCode)
  }, [o, i, l, d] = s.rules, c = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((u) => ({ role: "rules", runs: [{ text: u }] })), h = {
    x: o * v + (t.frameAssetFamily ? 0 : 3.5),
    y: i * r + (t.frameAssetFamily ? 0 : 7),
    width: l * v - (t.frameAssetFamily ? 0 : 9.5),
    height: d * r - (t.frameAssetFamily ? 0 : 8),
    // Fit actual line ink around the existing power/toughness plate. Short
    // final lines can use the lower left area without being painted over.
    exclusions: t.power != null && t.toughness != null ? [
      [
        s.stats[0] * v - 2,
        s.stats[1] * r - 2,
        s.stats[2] * v + 4,
        s.stats[3] * r + 4
      ]
    ] : []
  }, m = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? c : c;
  if (t.rulesAlignment?.mode !== "left" && ["10e", "m10", "m11", "m12", "m13", "m14"].includes(t.setCode?.toLowerCase() ?? "") && m.every((u) => u.role === "rules")) {
    const u = pt(
      e,
      c,
      m,
      h,
      24.5 * a,
      15 * a,
      3,
      { ...n, balanceLines: !0 }
    );
    if (u) return u;
  }
  return J(
    e,
    t.rulesAlignment?.mode === "left" ? c.map((u) => ({ ...u, align: "left" })) : c,
    h,
    24.5 * a,
    15 * a,
    n
  );
}
function me(e, t, r, a = Z, s = 0) {
  if (t.overflow) throw Error("Magic rules text does not fit the available area.");
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", e.letterSpacing = "0px";
  for (const i of t.separators) {
    const l = e.createLinearGradient(t.x, i, t.x + t.width, i);
    l.addColorStop(0, "#17140f00"), l.addColorStop(0.15, "#17140f55"), l.addColorStop(0.85, "#17140f55"), l.addColorStop(1, "#17140f00"), e.fillStyle = l, e.fillRect(t.x, i, t.width, 0.6);
  }
  e.fillStyle = "#17140f";
  const n = s > 0 ? document.createElement("canvas") : null;
  n && (n.width = e.canvas.width, n.height = e.canvas.height);
  const o = n ? n.getContext("2d") : e;
  if (!o) throw Error("Missing rules text context");
  n && (o.setTransform(e.getTransform()), o.textAlign = "left", o.textBaseline = "alphabetic", o.letterSpacing = "0px", o.fillStyle = "#17140f");
  for (const i of t.lines) {
    let l = i.x ?? t.x;
    for (const d of i.runs)
      d.symbol ? a(
        e,
        d.text,
        l + d.size * 0.025,
        i.baseline - d.size * 0.72,
        d.size * 0.8,
        r
      ) : (o.font = ir(d.size, d.italic), o.fillText(d.text, l, i.baseline)), l += d.width;
  }
  if (n) {
    o.globalCompositeOperation = "destination-out", o.lineJoin = "round";
    for (const i of t.lines) {
      let l = i.x ?? t.x;
      for (const d of i.runs)
        d.symbol || (o.font = ir(d.size, d.italic), o.lineWidth = d.size * s * 2, o.strokeText(d.text, l, i.baseline)), l += d.width;
    }
    e.resetTransform(), e.drawImage(n, 0, 0), n.width = n.height = 0;
  }
  e.restore();
}
function w0(e) {
  const t = (e.rarity ?? "common")[0].toUpperCase(), r = e.collectorNumber ?? "";
  if ((e.collectorFormat ?? (e.setCode?.toLowerCase() === "woe" ? "rarity-first" : "number-first")) === "number-first") return `${r} ${t}`.trim();
  const s = r.split("/")[0].replace(/^(\d+)/, (n) => n.padStart(4, "0"));
  return `${t} ${s}`.trim();
}
function cs(e, t, r) {
  if (t.power != null && t.toughness != null) {
    const s = r.get(Cr(t));
    if (!s) throw Error("Adventure power/toughness plate is unavailable.");
    const [n, o, i, l] = Mr.stats;
    e.drawImage(s, n * 488, o * 680, i * 488, l * 680), e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = '700 25px "CardRenderer MTG Beleren Small Caps", Georgia', e.fillText(`${t.power}/${t.toughness}`, 420, 627, 77);
  }
  if (["rare", "mythic"].includes(t.rarity ?? "")) {
    const s = r.get(gt);
    if (!s) throw Error("Adventure authenticity stamp is unavailable.");
    e.drawImage(s, 213.7, 620.2, 60.5, 25.3);
  }
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(w0(t), 32, 645), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.artist && (e.font = '11px "CardRenderer MTG Artist Credit", serif', e.fillText("a", 93, 658), e.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', e.fillText(t.artist, 108, 658, 210)), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 658, 182));
}
let ta = null;
function hs() {
  return ta ??= document.fonts.load('700 25px "CardRenderer MTG Beleren Small Caps"').then((e) => {
    if (!e.length || e.some((t) => t.status !== "loaded"))
      throw Error("Inset card footer lettering needs card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw ta = null, e;
  });
}
function y0(e, t, r) {
  if (e.drawImage(Kn(t, r), 0, 0, 488, 680), q(t).legendary) {
    const a = r.get(ts(t));
    if (!a) throw Error("Adventure crown is unavailable.");
    e.fillStyle = "#000", e.fillRect(19.2, 18.8, 449.6, 12.1), e.drawImage(a, 13.4, 13, 461.4, 113.4);
  }
}
function k0(e, t, r) {
  const a = t.manaSymbols ?? [], s = 23.4, n = 1.8, o = 452, i = a.length * s + Math.max(0, a.length - 1) * n;
  e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle", Q(
    e,
    t.name,
    41.7,
    51,
    (a.length ? o - i - 8 : 449) - 41.7,
    26,
    !0
  ), a.forEach(
    (p, w) => Z(e, p, o - i + w * (s + n), 38.7, s, r, !0)
  );
  const l = ee(t), d = r.get(l ?? ""), c = Ee(t), h = d ? Math.min(58.56 / (d.width * c[2]), 27.9 / (d.height * c[3])) : 0, m = d ? d.width * c[2] * h : 0, u = d ? d.height * c[3] * h : 0, g = [450.3 - m, 402 - u / 2, m, u];
  Q(
    e,
    t.typeLine ?? "",
    41.7,
    401.5,
    (d ? g[0] - 7 : 449) - 41.7,
    22,
    !0
  ), d && (ke(l) || t.setSymbol ? e.drawImage(d, ...g) : Te(e, d, t.setCode, t.rarity, ...g, c));
}
function S0(e, t, r) {
  const a = t.manaSymbols ?? [], s = 19.8, n = 1.2, o = 233, i = a.length * s + Math.max(0, a.length - 1) * n;
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "middle", Q(
    e,
    t.name,
    40,
    443,
    (a.length ? o - i - 4 : o) - 40,
    20.1,
    !0
  ), a.forEach(
    (l, d) => Z(e, l, o - i + d * (s + n), 432, s, r, !0)
  ), Q(e, t.typeLine ?? "", 40, 473.5, 193, 20.1, !0);
}
function v0(e, t, r, a, s) {
  const n = t.faces?.[1];
  if (!n) throw Error("Adventure spell is missing.");
  e.save(), e.fillStyle = "#000", e.fillRect(0, 0, 488, 680), a && e.drawImage(a, 0, 0, 488, 680), s !== "artwork" && y0(e, t, r);
  const [o, i, l, d] = Mr.art;
  if (Ce(e, t, r, [o * 488, i * 680, l * 488, d * 680], s), s !== "artwork") {
    k0(e, t, r), S0(e, n, r);
    const c = r0(e, t);
    me(e, c.permanent, r), me(e, c.spell, r), cs(e, t, r);
  }
  e.restore();
}
const Ye = /* @__PURE__ */ new Map(), Vt = /* @__PURE__ */ new WeakMap();
let R0 = 0, Kt = 0;
const C0 = (e) => (Vt.has(e) || Vt.set(e, ++R0), Vt.get(e));
function M0(e, t) {
  const r = at(e), a = (b) => {
    const k = t.get(b);
    if (!k) throw Error(`Prepared asset unavailable: ${b}`);
    return k;
  }, s = ss(e).map(a), n = qe(e), o = qe(r), i = q(e).legendary, l = JSON.stringify([
    n,
    o,
    i,
    Le(r),
    s.map(C0)
  ]), d = Ye.get(l);
  if (d)
    return Ye.delete(l), Ye.set(l, d), d;
  const c = a(lt(e)), h = c.width, m = c.height, u = () => {
    const b = document.createElement("canvas");
    return b.width = h, b.height = m, b;
  }, g = u(), p = g.getContext("2d");
  p.drawImage(c, 0, 0);
  const w = (b, k, S = !1) => {
    const R = u(), C = R.getContext("2d");
    S && (C.filter = "grayscale(1)"), C.drawImage(b, 0, 0, h, m), C.filter = "none", C.globalCompositeOperation = "destination-in", C.drawImage(a(St(k)), 0, 0, h, m), p.drawImage(R, 0, 0), R.width = R.height = 0;
  }, f = (b) => a(`${Ot}/${b.toLowerCase()}.png`);
  if (n.length === 2) {
    const b = u(), k = b.getContext("2d");
    k.drawImage(f(n[0]), 0, 0, h, m);
    const S = u(), R = S.getContext("2d");
    R.drawImage(f(n[1]), 0, 0, h, m), R.globalCompositeOperation = "destination-in";
    const C = R.createLinearGradient(h * 0.43, 0, h * 0.57, 0);
    C.addColorStop(0, "#0000"), C.addColorStop(1, "#000"), R.fillStyle = C, R.fillRect(0, 0, h, m), k.drawImage(S, 0, 0), w(b, "pinline"), w(f(n[0]), "rules"), w(f(n[1]), "rulesRight"), b.width = b.height = S.width = S.height = 0;
  }
  if (o.length === 2 ? (w(f(o[0]), "prepare"), w(f(o[1]), "prepareRight"), w(a(lt(r)), "prepareTypeTitle", Le(r))) : w(a(lt(r)), "prepare"), i) {
    p.save(), p.scale(h / 488, m / 680), p.fillStyle = "#000", p.fillRect(19.2, 18.8, 449.6, 12.1);
    const b = n.length === 2 ? n : [jr(e)];
    if (p.drawImage(a(cr(b[0])), 13.4, 13, 461.4, 113.4), b.length === 2) {
      const k = u(), S = k.getContext("2d");
      S.scale(h / 488, m / 680), S.drawImage(a(cr(b[1])), 13.4, 13, 461.4, 113.4), S.globalCompositeOperation = "destination-in";
      const R = S.createLinearGradient(210, 0, 278, 0);
      R.addColorStop(0, "#0000"), R.addColorStop(1, "#000"), S.fillStyle = R, S.fillRect(0, 0, 488, 680), p.drawImage(k, 0, 0, 488, 680), k.width = k.height = 0;
    }
    p.restore();
  }
  const y = h * m * 4;
  for (const [b, k] of Ye) {
    if (Kt + y <= 16 * 1024 * 1024) break;
    Kt -= k.width * k.height * 4, Ye.delete(b), k.width = k.height = 0;
  }
  return y <= 16 * 1024 * 1024 && (Ye.set(l, g), Kt += y), g;
}
function T0(e, t) {
  const r = at(t), a = (s, n, o, i) => {
    const l = rt({
      rulesText: s.rulesText ?? "",
      rulesParagraphs: s.rulesParagraphs
    });
    return J(
      e,
      s.rulesAlignment?.mode === "left" ? l.map((d) => ({ ...d, align: "left" })) : l,
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
      Gr.rules,
      21.75,
      ["rare", "mythic"].includes(t.rarity ?? "") ? [[213, 620, 63, 26]] : []
    ),
    spell: a(
      r,
      i0.rules,
      21.75,
      t.power != null && t.toughness != null ? [[370, 603, 93, 49]] : []
    )
  };
}
function j0(e, t, r) {
  e.drawImage(M0(t, r), 0, 0, 488, 680);
}
function G0(e, t, r) {
  const a = (m, u) => {
    const g = m.manaSymbols ?? [], p = u ? 19.8 : 23.4, w = u ? 1.2 : 1.8, f = u ? 1042 / 2010 * 488 : 41.7, y = 452, b = g.length * p + Math.max(0, g.length - 1) * w;
    e.fillStyle = u ? "#fff" : "#17140f", e.textAlign = "left", e.textBaseline = "middle", Q(
      e,
      m.name,
      f,
      u ? 444 : 52,
      (g.length ? y - b - (u ? 4 : 8) : y) - f,
      u ? 20 : 26,
      !0
    ), g.forEach(
      (k, S) => Z(
        e,
        k,
        y - b + S * (p + w),
        u ? 434.5 : 38.7,
        p,
        r,
        !0
      )
    );
  };
  a(t, !1);
  const s = ee(t), n = r.get(s ?? ""), o = Ee(t), i = n ? Math.min(58.56 / (n.width * o[2]), 27.9 / (n.height * o[3])) : 0, l = n ? n.width * o[2] * i : 0, d = n ? n.height * o[3] * i : 0, c = [450.3 - l, 402 - d / 2, l, d];
  Q(
    e,
    t.typeLine ?? "",
    41.7,
    401.5,
    (n ? c[0] - 7 : 449) - 41.7,
    22,
    !0
  ), n && (ke(s) || t.setSymbol ? e.drawImage(n, ...c) : Te(e, n, t.setCode, t.rarity, ...c, o));
  const h = at(t);
  a(h, !0), Q(e, h.typeLine ?? "", 1042 / 2010 * 488, 477, 195.2, 20, !0);
}
function I0(e, t, r, a, s) {
  at(t), e.save(), e.fillStyle = "#000", e.fillRect(0, 0, 488, 680), a && e.drawImage(a, 0, 0, 488, 680), s !== "artwork" && j0(e, t, r);
  const [n, o, i, l] = Gr.art;
  if (Ce(e, t, r, [n * 488, o * 680, i * 488, l * 680], s), s !== "artwork") {
    G0(e, t, r);
    const d = T0(e, t);
    me(e, d.permanent, r), me(e, d.spell, r), cs(
      e,
      { ...t, collectorFormat: t.collectorFormat ?? "rarity-first" },
      r
    );
  }
  e.restore();
}
const xr = {
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
function B0(e, t) {
  if (t.watermark) return t.watermark;
  if (e.watermark) return e.watermark;
  const r = [...new Set(e.faces?.map((n) => n.watermark).filter(Boolean))];
  if (r.length !== 1) return t.watermark;
  const a = xr[r[0]], s = new Set(e.faces?.flatMap(O));
  return a && s.size === 2 && a.every((n) => s.has(n)) ? r[0] : t.watermark;
}
function hr(e) {
  return e.watermark && Object.hasOwn(xr, e.watermark) ? `${P}/img/watermarks/guild-${e.watermark}.svg` : null;
}
function ms(e, t) {
  return `${Na}/magic-new-split${e ? "-fuse" : ""}.mse-style/multicolor_blend_card${e ? t + 1 : ""}.png`;
}
function x0(e, t, r, a) {
  if (t === "m15") return [...Wn(e), hr(e)];
  const s = O(e);
  return [
    jt(e, t, r, a),
    hr(e),
    ...t === "eighth" && s.length === 2 ? [
      ms(r, a),
      ...s.map(
        (n) => jt({ ...e, colors: [n], frameColors: void 0 }, t, r, a)
      )
    ] : [],
    ...t === "eighth" && e.artist ? [`${P}/img/manaSymbols/brush.svg`] : []
  ];
}
const ra = /* @__PURE__ */ new WeakMap();
function us(e) {
  const t = ra.get(e);
  if (t) return t;
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  const a = r.getContext("2d", { willReadFrequently: !0 });
  a.drawImage(e, 0, 0);
  const s = a.getImageData(0, 0, r.width, r.height);
  for (let n = 0; n < s.data.length; n += 4) s.data[n + 3] = s.data[n];
  return a.putImageData(s, 0, 0), ra.set(e, r), r;
}
const aa = /* @__PURE__ */ new WeakMap();
function A0(e, t, r, a, s) {
  const n = (b) => {
    const k = s.get(b);
    if (!k) throw Error(`Split asset unavailable: ${b}`);
    return k;
  }, o = n(jt(e, t, r, a)), i = O(e);
  if (t !== "eighth" || i.length !== 2) return o;
  "WUBRG".indexOf(i[1]) - "WUBRG".indexOf(i[0]) > 2 && i.reverse();
  const [l, d] = i.map(
    (b) => n(
      jt({ ...e, colors: [b], frameColors: void 0 }, t, r, a)
    )
  ), c = n(ms(r, a)), h = i.join(""), m = aa.get(o) ?? /* @__PURE__ */ new Map();
  aa.set(o, m);
  const u = m.get(h);
  if (u?.left === l && u.right === d && u.mask === c) return u.canvas;
  const g = document.createElement("canvas");
  g.width = o.width, g.height = o.height;
  const p = document.createElement("canvas");
  p.width = o.width, p.height = o.height;
  const w = g.getContext("2d"), f = p.getContext("2d");
  f.drawImage(d, 0, 0), f.globalCompositeOperation = "destination-in";
  const y = f.createLinearGradient(0, 0, o.width, 0);
  return y.addColorStop(0, "#0000"), y.addColorStop(0.4, "#0000"), y.addColorStop(0.6, "#000"), y.addColorStop(1, "#000"), f.fillStyle = y, f.fillRect(0, 0, o.width, o.height), w.drawImage(l, 0, 0), w.drawImage(p, 0, 0), w.globalCompositeOperation = "destination-in", w.drawImage(us(c), 0, 0), w.globalCompositeOperation = "destination-over", w.drawImage(o, 0, 0), w.globalCompositeOperation = "source-over", p.width = p.height = 0, m.set(h, { left: l, right: d, mask: c, canvas: g }), g;
}
const sa = /* @__PURE__ */ new WeakMap();
function L0(e, t, r, a) {
  const s = hr(t);
  if (!s) return;
  const n = r.get(s);
  if (!n) throw Error(`Split watermark unavailable: ${s}`);
  const o = O(t), i = o.length === 1 ? [o[0], o[0]] : xr[t.watermark], l = i.join(""), d = sa.get(n) ?? /* @__PURE__ */ new Map();
  sa.set(n, d);
  let c = d.get(l);
  if (!c) {
    c = document.createElement("canvas"), c.width = n.width, c.height = n.height;
    const p = c.getContext("2d");
    p.drawImage(n, 0, 0), p.globalCompositeOperation = "source-in";
    const w = {
      W: "#b39f4d",
      U: "#718dac",
      B: "#998795",
      R: "#b6723f",
      G: "#69936e"
    }, [f, y] = i, b = p.createLinearGradient(0, 0, c.width, 0);
    b.addColorStop(0, w[f]), b.addColorStop(0.499, w[f]), b.addColorStop(0.5, w[y]), b.addColorStop(1, w[y]), p.fillStyle = b, p.fillRect(0, 0, c.width, c.height), d.set(l, c);
  }
  const h = t.layout?.startsWith("split-m15") ?? !1, m = Math.min(
    (h ? 135 : 110) / n.width,
    (h ? 125 : t.setCode?.toLowerCase() === "dgm" ? 75 : 100) / n.height
  ), u = n.width * m, g = n.height * m;
  e.save(), e.globalAlpha = 0.3, e.drawImage(c, (h ? 199.5 : 177) - u / 2, a - g / 2, u, g), e.restore();
}
function fe(e) {
  if (!["split", "aftermath"].includes(e.layout ?? "") || e.faces?.length !== 2) return [];
  const t = ut(e), r = Me(e), a = r === "m15" ? Mt : Ya;
  return e.faces.map((s, n) => {
    const o = t ? 0.615 : 0.5, i = {
      setCode: e.setCode,
      frameStyle: e.frameStyle,
      rarity: e.rarity,
      artist: e.artist,
      setSymbol: e.setSymbol,
      setSymbolSource: e.setSymbolSource,
      ...s,
      watermark: r ? B0(e, s) : s.watermark,
      layout: t ? n === 0 ? "aftermath-top" : "aftermath-bottom" : r ? `split-${r}${Ze(e) && r !== "old" ? "-fuse" : ""}` : "split-half",
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
    return t ? n === 0 ? { face: i, x: 0, y: 0, width: 488, height: Pe, rotation: 0 } : {
      face: i,
      x: 488,
      y: Pe,
      width: Ua,
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
      y: (n ? 333 : 648) - (Ar(e) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function zi(e) {
  return {
    left: `${e.x / v * 100}%`,
    top: `${e.y / j * 100}%`,
    width: `${e.width / v * 100}%`,
    height: `${e.height / j * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function gs(e, t) {
  e.translate(t.x, t.y), e.rotate(t.rotation * Math.PI / 180), e.scale(t.width / v, t.width / v);
}
function na(e, t) {
  const r = t[0] * e.width, a = t[1] * e.height, s = t[2] * e.width, n = t[3] * e.height;
  return e.rotation === -90 ? [
    (e.x + a) / v,
    (e.y - r - s) / j,
    n / v,
    s / j
  ] : e.rotation === 90 ? [
    (e.x - a - n) / v,
    (e.y + r) / j,
    n / v,
    s / j
  ] : [(e.x + r) / v, (e.y + a) / j, s / v, n / j];
}
function E0(e) {
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? 1.5 : 1;
}
const Ar = Ze;
function $0(e, t, r) {
  e.fillStyle = "#000", e.fillRect(0, 0, 488, 680);
  const a = fe(t), s = a.map((n) => Dn(n.face, r));
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
function W0(e, t, r) {
  const o = t.manaSymbols ?? [], i = o.length * 23.4 + Math.max(0, o.length - 1) * 1.7;
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left", Q(
    e,
    t.name,
    70,
    53,
    Math.max(1, (o.length ? 331 - i - 7 : 331) - 70),
    26,
    !0
  ), o.forEach((g, p) => Z(e, g, 331 - i + p * (23.4 + 1.7), 39.5, 23.4, r, !0));
  const l = ee(t), d = r.get(l ?? ""), c = Ee(t), h = d ? Math.min(26 / (d.width * c[2]), 15.5 / (d.height * c[3])) : 0, m = d ? d.width * c[2] * h : 0, u = d ? d.height * c[3] * h : 0;
  if (Q(e, t.typeLine ?? "", 70, 277, (d ? 331 - m - 6 : 331) - 70, 18.5, !0), d) {
    const g = [331 - m, 277 - u / 2, m, u];
    ke(l) || t.setSymbol ? e.drawImage(d, ...g) : Te(e, d, t.setCode, t.rarity, ...g, c);
  }
}
function O0(e, t, r) {
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic";
  const a = [
    ...new Set((t.faces ?? []).map((s) => s.artist ?? t.artist ?? "").filter(Boolean))
  ].join(" & ");
  if (e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""} ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    646
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 660), a && (e.font = '11px "CardRenderer MTG Artist Credit", serif', e.fillText("a", 95, 660), e.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', e.fillText(a, 110, 660, 193)), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 455, 646, 170)), ["rare", "mythic"].includes(t.rarity ?? "")) {
    const s = r.get(Oa);
    if (!s) throw Error("Modern split authenticity stamp unavailable.");
    e.drawImage(s, 223.5, 620, 43, 21.5);
  }
}
const Zt = we.MSE_SPLIT_BRIDGE_ROOT;
function ps(e, t) {
  const r = O(e);
  r.length === 2 && "WUBRG".indexOf(r[1]) - "WUBRG".indexOf(r[0]) > 2 && r.reverse();
  const a = (t ? r[0] : r.at(-1))?.toLowerCase() ?? "c";
  return {
    color: `${Zt}/${a}bridge.png`,
    gold: r.length > 1 ? `${Zt}/mbridge.png` : null,
    mask: r.length > 1 ? `${Zt}/bridgemask.png` : null
  };
}
function P0(e) {
  return (e.faces ?? []).flatMap((t, r) => Object.values(ps(t, r)));
}
function D0(e, t, r) {
  const a = (c) => {
    const h = r.get(c);
    if (!h) throw Error(`Fuse bridge asset unavailable: ${c}`);
    return h;
  }, s = t.faces.map((c, h) => {
    const m = ps(c, h), u = a(m.color), g = document.createElement("canvas");
    g.width = u.width, g.height = u.height;
    const p = g.getContext("2d");
    return p.drawImage(u, 0, 0), m.gold && m.mask && (p.globalCompositeOperation = "destination-in", p.drawImage(us(a(m.mask)), 0, 0, g.width, g.height), p.globalCompositeOperation = "destination-over", p.drawImage(a(m.gold), 0, 0, g.width, g.height)), g;
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
function U0(e, t, r, a) {
  const [s, n, o, i] = tt(r, a).rules, l = rt({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), d = { x: s, y: n, width: o, height: i }, c = {
    leading: 1.02,
    paragraphGap: 0.4,
    flavorGap: 0.65,
    centerOffset: r === "old" ? 0 : 2
  }, h = r === "old" ? 24.5 : r === "m15" ? a ? 20.25 : 24.25 : 21.5;
  if ((r !== "m15" || a) && t.rulesAlignment?.mode !== "left" && l.length === 1) {
    const m = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? l : l, u = pt(e, l, m, d, h, 13, 2, c);
    if (u) return u;
  }
  return J(e, l, d, h, 13, c);
}
function F0(e, t, r) {
  const a = Me(t);
  if (!a) throw Error("No native split plate for this printing.");
  if (a === "m15") return $0(e, t, r);
  const s = a !== "old" && Ze(t), n = tt(a, s);
  e.fillStyle = Re(t.setCode, t.borderColor).border, e.fillRect(0, 0, 488, 680), fe(t).forEach((o, i) => {
    const l = A0(o.face, a, s, i, r);
    e.save(), e.translate(o.x, o.y), e.rotate(-Math.PI / 2);
    const [d, c, h, m] = n.frame;
    e.drawImage(l, d - (s && i ? 8 * 680 / 523 : 0), c, h, m), e.restore();
  }), s && D0(e, t, r);
}
function _0(e, t, r, a, s) {
  if (r === "m15") return W0(e, t, s);
  const n = tt(r, a), o = r === "old", [i, l, d, c] = n.title, h = t.manaSymbols ?? [], m = 23.4, u = 1.7, g = 316, p = h.length * m + Math.max(0, h.length - 1) * u;
  if (e.fillStyle = o ? "#f2eee3" : "#17140f", e.textBaseline = "middle", e.textAlign = "left", o) {
    const C = e.getTransform();
    e.shadowColor = "#000b", e.shadowOffsetX = C.a + C.c, e.shadowOffsetY = C.b + C.d;
  }
  Q(
    e,
    t.name,
    i,
    l + c / 2 - (o ? 2 : 0),
    Math.max(1, h.length ? g - p - i - 7 : d),
    o ? 29 : 26.5,
    !o,
    1,
    o ? "CardRenderer MTG Goudy" : "CardRenderer MTG Matrix"
  ), h.forEach(
    (C, T) => Z(e, C, g - p + T * (m + u), o ? 30.5 : 40, m, s, !o)
  );
  const w = ee(t), f = s.get(w ?? ""), y = Ee(t), [b, k, S, R] = n.type;
  if (Q(
    e,
    t.typeLine ?? "",
    b,
    k + R / 2,
    S - (f ? 33 : 0),
    o ? 22 : 21.5,
    !1,
    1,
    o ? "CardRenderer MTG MPlantin" : "CardRenderer MTG Matrix"
  ), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, f) {
    const C = Math.min(
      32 / (f.width * y[2]),
      (o ? 26 : 22) / (f.height * y[3])
    ), T = f.width * y[2] * C, M = f.height * y[3] * C, G = [(o ? 306 : 316) - T, k + R / 2 - (o ? 1.5 : 0) - M / 2, T, M];
    ke(w) || t.setSymbol ? e.drawImage(f, ...G) : Te(e, f, t.setCode, t.rarity, ...G, y);
  }
}
function N0(e, t, r, a, s, n) {
  const o = tt(a, s), i = a === "old";
  e.fillStyle = i ? "#eeeae1" : "#17140f", e.textAlign = i ? "center" : "left", e.textBaseline = "middle", e.font = i ? '19px "CardRenderer MTG MPlantin", Georgia' : '700 14px "CardRenderer MTG Matrix", Georgia';
  const l = n.get(`${P}/img/manaSymbols/brush.svg`);
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
function Y0(e, t, r, a, s) {
  const n = Me(t);
  if (!n) throw Error("No native split plate for this printing.");
  const o = n !== "old" && Ze(t), i = tt(n, o);
  e.save(), s !== "artwork" && F0(e, t, r), a && e.drawImage(a, 0, 0, 488, 680);
  for (const l of fe(t))
    e.save(), e.translate(l.x, l.y), e.rotate(-Math.PI / 2), Ce(e, l.face, r, i.art, s), s !== "artwork" && (_0(e, l.face, n, o, r), L0(e, l.face, r, i.rules[1] + i.rules[3] / 2), me(e, U0(e, l.face, n, o), r), n !== "m15" && N0(e, l.face, t, n, o, r)), e.restore();
  if (n === "m15" && s !== "artwork" && O0(e, t, r), o && s !== "artwork") {
    e.translate(0, 680), e.rotate(-Math.PI / 2);
    const l = Ha(t).map(
      (d) => n === "m15" ? { ...d, align: "center" } : d
    );
    me(
      e,
      J(
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
let oa;
function H0(e) {
  return Me(e) === "m15" ? hs() : Me(e) !== "eighth" ? Promise.resolve() : oa ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('24px "CardRenderer MTG Matrix"')
  ]).then((t) => {
    if (t.some((r) => !r.length || r.some((a) => a.status !== "loaded")))
      throw Error("Split Matrix fonts are unavailable. Load card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw oa = void 0, t;
  });
}
const z0 = {
  maximumSize: 20.7,
  padding: 24,
  equalCells: 0,
  lastLift: 0,
  bottomSpace: 0.15
};
function q0(e, t, r = z0) {
  const a = ft(t), s = a.filter((p) => !p.badges.length), n = a.filter((p) => p.badges.length), o = (p, w = !1) => [
    {
      role: "rules",
      runs: w ? [{ text: p, italic: !0 }] : p.split(/(\([^)]*\))/g).filter(Boolean).map((f) => ({ text: f, italic: f.startsWith("(") }))
    }
  ], i = { leading: 0.98, paragraphGap: 0.3, flavorGap: 0 }, l = s.length ? 201 : 80, d = t.reverseStats && t.layout === "transform" ? 535 : 569, c = J(
    e,
    s.flatMap((p) => o(p.text, p.reminder)),
    { x: 42.3, y: 78, width: 197, height: l - 80 },
    20.4,
    12,
    { ...i, centerOffset: -3 }
  );
  let h = r.maximumSize, m = [], u = [];
  for (; ; ) {
    const p = n.map(
      (k) => Math.max(
        J(
          e,
          o(k.text),
          { x: 65.1, y: 0, width: 171, height: 2e3 },
          h,
          h,
          i
        ).height + r.padding,
        43 + Math.max(0, k.badges.length - 1) * 49 + 12
      )
    ), w = d - l;
    if (p.reduce((k, S) => k + S, 0) > w && h > 12) {
      h = Math.max(12, h - 0.25);
      continue;
    }
    if (p.reduce((k, S) => k + S, 0) > w)
      throw Error("Saga chapter text or badges do not fit the available column.");
    const f = Math.max(0, w - p.reduce((k, S) => k + S, 0)) * (1 - (n.length === 2 && n[0].badges.length > 1 ? r.bottomSpace : 0)) / Math.max(1, n.length);
    u = p.map((k) => k + f);
    const y = w / Math.max(1, n.length);
    u = u.map((k) => k * (1 - r.equalCells) + y * r.equalCells);
    let b = l;
    m = n.map((k, S) => {
      const R = u[S], C = J(
        e,
        o(k.text),
        { x: 65.1, y: b + 7, width: 171, height: R - 14 },
        h,
        h,
        { ...i, centerOffset: S === n.length - 1 ? -r.lastLift : 0 }
      );
      return b += R, C;
    });
    break;
  }
  let g = l;
  return {
    reminder: c,
    size: h,
    rows: n.map((p, w) => {
      const f = { ...p, top: g, height: u[w], layout: m[w] };
      return g += f.height, f;
    })
  };
}
function X0(e, t, r, a, s) {
  const n = (R) => {
    const C = r.get(R);
    if (!C) throw Error(`Saga asset unavailable: ${R}`);
    return C;
  };
  e.save(), e.fillStyle = "#090806", e.fillRect(0, 0, v, j), a && e.drawImage(a, 0, 0, v, j), s !== "artwork" && (e.drawImage(n(Xa(t)), 0, 0, v, j), Hn(e, t, r));
  const o = Ka.art;
  if (Ce(e, t, r, [o[0] * v, o[1] * j, o[2] * v, o[3] * j], s), s === "artwork") {
    e.restore();
    return;
  }
  const i = ar(t);
  i && e.drawImage(n(i), 33.5, 35.6, 29, 32), e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const l = t.manaSymbols ?? [], d = 23.4, c = 1.8, h = 452, m = l.length * d + Math.max(0, l.length - 1) * c, u = t.layout === "transform" ? 78 : 41.7;
  Q(
    e,
    t.name,
    u,
    51,
    (l.length ? h - m - 8 : 449) - u,
    26,
    !0
  ), l.forEach(
    (R, C) => Z(e, R, h - m + C * (d + c), 38.7, d, r, !0)
  );
  const g = ee(t), p = r.get(g ?? ""), w = Ee(t), f = p ? Math.min(58.56 / (p.width * w[2]), 25.9 / (p.height * w[3])) : 0, y = p ? p.width * w[2] * f : 0, b = p ? p.height * w[3] * f : 0, k = [450.3 - y, 594.25 - b / 2, y, b];
  Q(
    e,
    t.typeLine ?? "",
    41.7,
    594.5,
    (p ? k[0] - 7 : 449) - 41.7,
    22,
    !0
  ), p && (ke(g) || t.setSymbol ? e.drawImage(p, ...k) : Te(e, p, t.setCode, t.rarity, ...k, w)), t.reverseStats && t.layout === "transform" && (e.fillStyle = "#65605a", e.font = 'italic 20px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.fillText(`${t.reverseStats.power}/${t.reverseStats.toughness}`, 41, 553));
  const S = q0(e, t);
  me(e, S.reminder, r);
  for (const R of S.rows)
    e.drawImage(n(Va), 48.8, R.top - 1, 192.6, 2), me(e, R.layout, r), R.badges.forEach((C, T) => {
      const M = R.top + R.height / 2 + (T - (R.badges.length - 1) / 2) * 49;
      e.drawImage(n(Ja), 18.8, M - 21.4, 38.4, 42.8), e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = '550 22px "CardRenderer MTG Chapter", Georgia', e.fillText(C, 38.1, M + 0.7);
    });
  ["rare", "mythic"].includes(t.rarity ?? "") && e.drawImage(n(gt), 213.7, 620.2, 60.5, 25.3), e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""}  ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.font = '11px "CardRenderer MTG Artist Credit", serif', t.artist && e.fillText("a", 93, 658), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(t.artist ?? "", 108, 658, 210), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 646, 182)), e.restore();
}
let ia = null;
function J0() {
  return ia ??= document.fonts.load('550 22px "CardRenderer MTG Chapter"').then((e) => {
    if (!e.length || e.some((t) => t.status !== "loaded"))
      throw Error("Saga chapter numerals need card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw ia = null, e;
  });
}
function V0(e, t, r) {
  const [a, s, n, o] = (r ? vr : Sr).rules, i = rt({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), l = { x: a, y: s, width: n, height: o }, d = {
    leading: 0.98,
    paragraphGap: 0.32,
    flavorGap: 0.65,
    centerOffset: r ? 0 : 2.5
  };
  let c = r ? 22 : t.setCode?.toLowerCase() === "hou" ? 24.5 : 22.5, h = J(e, i, l, c, 14, d);
  if (!r && i.length === 1 && h.lines.length > 1 && h.lines.at(-1).width < n * 0.18)
    for (let m = c - 0.25; m >= c * 0.9; m -= 0.25) {
      const u = J(e, i, l, m, m, d);
      if (!u.overflow && u.lines.length < h.lines.length) {
        c = m, h = u;
        break;
      }
    }
  if (!r && t.rulesAlignment?.mode !== "left") {
    const m = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? i : i, u = pt(
      e,
      i,
      m,
      l,
      c,
      14,
      1,
      d
    );
    if (u) return u;
  }
  return h;
}
function K0(e, t, r, a, s) {
  const n = fe(t), o = (i) => {
    const l = r.get(i);
    if (!l) throw Error(`Aftermath asset unavailable: ${i}`);
    return l;
  };
  e.save(), e.fillStyle = "#090806", e.fillRect(0, 0, 488, 680), a && e.drawImage(a, 0, 0, 488, 680), s !== "artwork" && n.forEach((i, l) => {
    e.save(), e.beginPath(), e.rect(0, l ? Pe : 0, 488, l ? 680 - Pe : Pe), e.clip(), e.drawImage(o(_a(i.face)), 0, 0, 488, 680), e.restore();
  }), n.forEach((i, l) => {
    e.save(), l && (e.translate(488, Pe), e.rotate(Math.PI / 2));
    const d = i.face, c = l ? vr : Sr;
    if (Ce(e, d, r, c.art, s), s !== "artwork") {
      e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
      const h = d.manaSymbols ?? [], m = 23.4, u = 1.6, g = l ? 246 : 451, p = h.length * m + Math.max(0, h.length - 1) * u, [w, f] = c.title;
      Q(e, d.name, w, f + 15.5, g - p - w - 7, 26, !0), h.forEach(
        (b, k) => Z(e, b, g - p + k * (m + u), f + 3, m, r, !0)
      );
      const y = l ? void 0 : r.get(ee(d) ?? "");
      if (Q(
        e,
        d.typeLine ?? "",
        c.type[0],
        c.type[1] + 16.5,
        c.type[2] - (y ? 45 : 0),
        23,
        !0
      ), y) {
        const b = Ee(d), k = Math.min(50 / (y.width * b[2]), 27 / (y.height * b[3])), S = y.width * b[2] * k, R = y.height * b[3] * k, C = [451 - S, 252.3 - R / 2, S, R];
        ke(ee(d)) || d.setSymbol ? e.drawImage(y, ...C) : Te(e, y, d.setCode, d.rarity, ...C, b);
      }
      me(e, V0(e, d, !!l), r);
    }
    e.restore();
  }), s !== "artwork" && (["rare", "mythic"].includes(t.rarity ?? "") && e.drawImage(o(Fa), 222, 623, 43, 20), e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""}  ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.font = '11px "CardRenderer MTG Artist Credit", serif', t.artist && e.fillText("a", 93, 658), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(t.artist ?? "", 108, 658, 220), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 646, 177))), e.restore();
}
function Z0(e, t, r, a) {
  const s = a.inkExpansion ?? 0;
  if (!Number.isFinite(s) || s < 0 || s > 1)
    throw Error("Historical mana ink expansion is outside its supported range.");
  if (!s) return;
  if (!Number.isInteger(t) || !Number.isInteger(r) || t <= 0 || r <= 0 || e.length !== t * r * 4)
    throw Error("Historical mana ink pixels do not match their dimensions.");
  const n = et(a.discColor), o = et(a.inkColor), i = n.map((u, g) => u - o[g]), l = i.reduce((u, g) => u + g * g, 0);
  if (l < 0.01) throw Error("Historical mana palette has no ink contrast");
  const d = new Float32Array(t * r);
  for (let u = 0; u < d.length; u++)
    e[u * 4 + 3] < 255 || (d[u] = Math.max(
      0,
      Math.min(1, i.reduce((g, p, w) => g + p * (n[w] - e[u * 4 + w] / 255), 0) / l)
    ));
  const c = Math.min(t, r) * s / 24, h = Math.ceil(c), m = [];
  for (let u = -h; u <= h; u++)
    for (let g = -h; g <= h; g++) {
      const p = Math.max(0, Math.min(1, c + 1 - Math.hypot(g, u)));
      p && m.push({ x: g, y: u, weight: p });
    }
  for (let u = 0; u < r; u++)
    for (let g = 0; g < t; g++) {
      const p = u * t + g;
      if (e[p * 4 + 3] < 255) continue;
      let w = d[p];
      for (const f of m) {
        const y = g + f.x, b = u + f.y;
        y >= 0 && y < t && b >= 0 && b < r && (w = Math.max(w, d[b * t + y] * f.weight));
      }
      if (!(w <= d[p]))
        for (let f = 0; f < 3; f++)
          e[p * 4 + f] = Math.round(255 * (n[f] * (1 - w) + o[f] * w));
    }
}
function Q0(e, t, r) {
  const a = et(t.discColor), s = et(t.inkColor), n = a.map((i, l) => i - s[l]), o = n.reduce((i, l) => i + l * l, 0);
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
async function eo(e, t, r) {
  const a = document.createElement("canvas");
  a.width = e.width, a.height = e.height;
  try {
    const s = a.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("Historical mana preparation needs Canvas2D.");
    s.drawImage(e, 0, 0);
    const n = s.getImageData(0, 0, a.width, a.height);
    return t.inkExpansion && Z0(n.data, a.width, a.height, t), Q0(n.data, t, r), s.putImageData(n, 0, 0), await createImageBitmap(a);
  } finally {
    a.width = a.height = 0;
  }
}
const la = (e) => {
  const t = Math.max(0, Math.min(1, e));
  return t * t * (3 - 2 * t);
}, Qt = (e) => {
  const t = Math.max(1e-3, e[0] + e[1] + e[2]);
  return e.map((r) => r / t);
};
function to(e, t) {
  const { width: r, height: a, data: s } = e, n = new Float32Array(r * a);
  if (t.kind === "rect") {
    const [b, k, S, R] = t.rect;
    for (let C = 0; C < a; C++)
      for (let T = 0; T < r; T++) {
        const M = Math.min(
          T / r - b,
          b + S - T / r,
          C / a - k,
          k + R - C / a
        );
        n[C * r + T] = la(M / t.feather + 0.5);
      }
    return n;
  }
  const o = Qt(t.frameRgb), i = Qt(t.paperRgb), l = i.map((b, k) => b - o[k]), d = l.reduce((b, k) => b + k * k, 0);
  if (d < 1e-3) throw Error("Paper and frame chroma are too similar for this mask.");
  const [c, h, m, u] = t.bounds;
  for (let b = 0; b < a; b++)
    for (let k = 0; k < r; k++) {
      if (k / r < c || k / r > c + m || b / a < h || b / a > h + u)
        continue;
      const S = b * r + k, R = S * 4;
      if (s[R + 3] < 250) continue;
      const T = Qt([s[R] / 255, s[R + 1] / 255, s[R + 2] / 255]).reduce((M, G, x) => M + (G - o[x]) * l[x], 0) / d;
      n[S] = la((T - 0.22) / 0.56);
    }
  const g = new Uint8Array(n.length), p = new Int32Array(n.length), w = Math.round(t.seed[1] * a) * r + Math.round(t.seed[0] * r);
  if (!(n[w] > 0.08)) throw Error("Paper mask seed is outside the paper.");
  let f = 0, y = 1;
  for (p[0] = w, g[w] = 1; f < y; ) {
    const b = p[f++], k = b % r;
    for (const S of [b - r, b + r, k ? b - 1 : -1, k < r - 1 ? b + 1 : -1])
      S >= 0 && S < g.length && !g[S] && n[S] > 0.08 && (g[S] = 1, p[y++] = S);
  }
  for (let b = 0; b < n.length; b++) g[b] || (n[b] = 0);
  return n;
}
function ro(e, t) {
  const r = "mask" in t ? t : void 0, a = r ? to(e, r.mask) : void 0, s = "mask" in t ? t.frame : t;
  for (let n = 0; n < e.data.length; n += 4) {
    if (e.data[n + 3] === 0) continue;
    const o = [e.data[n] / 255, e.data[n + 1] / 255, e.data[n + 2] / 255], i = Math.max(...o), l = i === 0 ? 0 : (i - Math.min(...o)) / i;
    if (i < 0.075 || !r && l < 0.025 && i > 0.97) continue;
    const d = a?.[n / 4] ?? 0, c = or(o, d === 1 && r ? r.paper : s), h = d > 0 && d < 1 && r ? or(o, r.paper) : c;
    for (let m = 0; m < 3; m++)
      e.data[n + m] = Math.round(
        Math.round(255 * c[m]) * (1 - d) + Math.round(255 * h[m]) * d
      );
  }
}
function fs(e) {
  const t = e.setCode?.toLowerCase();
  if (!t || !["lea", "leb", "3ed", "8ed", "m21"].includes(t) || e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return;
  const r = ye(e);
  if (oe(e)) {
    if (mt(e)) return;
    const o = Ae(e), i = pr(e);
    return {
      key: `${t}/${r}/retro/${o.split("/").at(-1)}`,
      family: "retro",
      frame: o,
      rect: i,
      assets: { frame: o },
      source: JSON.stringify([o, i])
    };
  }
  const a = Pt(e);
  if (a)
    return a.rightFrame ? void 0 : {
      key: `${t}/${r}/${e.frameAssetFamily}/${a.frame.split("/").at(-1)}`,
      family: "plate",
      frame: a.frame,
      rect: a.rects.frame,
      assets: { frame: a.frame, pt: a.pt },
      source: JSON.stringify([a.frame, a.rects])
    };
  const s = q(e);
  if (s.land) return;
  const n = At(s);
  return {
    key: `${t}/${r}/components/${s.boxes}/${s.frame}`,
    family: "components",
    frame: n.frame,
    rect: H.frame,
    assets: n,
    source: JSON.stringify([n, H.frame, ns(e)])
  };
}
const ao = {
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
}, so = {
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
}, no = {
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
function Lr(e) {
  const t = ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "");
  return (oe(e) || !!fs(e)) && (!e.layout || e.layout === "normal") && (e.colorCalibration === "set-hsb-v1" || t && e.colorCalibration === "early-hsb-v1");
}
function oo(e) {
  if (!Lr(e) || !oe(e) || mt(e)) return;
  const t = Ae(e), r = t.split("/").at(-1).replace(".png", "").toUpperCase(), a = so[`${e.setCode?.toLowerCase()}-${ye(e)}-${r}`];
  if (!(a?.asset !== t || !a.rect.every((s, n) => s === pr(e)[n])))
    return t.endsWith("/old/fourth/w.png") ? {
      ...a.adjustment,
      mask: {
        kind: "rect",
        rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
        feather: 2 / 1500
      }
    } : a.adjustment;
}
function io(e, t) {
  if (!Lr(e)) return;
  const r = `${e.setCode?.toLowerCase()}-${ye(e)}-${t}`;
  return wn[r] ?? no[r];
}
function bs(e) {
  if (!Lr(e)) return {};
  const t = fs(e), r = t && ao[t.key];
  if (r && r.source === t?.source) return r.materials;
  const a = oo(e);
  return a ? { [Ae(e)]: a } : {};
}
async function lo(e, t, r) {
  const a = { images: t, dispose() {
  } }, s = new Map(Object.entries(bs(e))), n = {}, o = {}, i = /* @__PURE__ */ new Set(), l = [], d = /* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...[...(e.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((p) => p[1])
  ]);
  for (const p of e.rulesParagraphs ?? [])
    for (const w of p.runs) for (const f of w.text.matchAll(/\{([^}]+)\}/g)) d.add(f[1]);
  for (const p of d) {
    const w = /^\d+$/.test(p) ? "N" : p, f = rr(e, p), y = f?.discColor ?? Jt[w], b = io(e, w) ?? (f && Jt[w] ? et(w === "W" ? "#efe7cb" : Jt[w]) : void 0);
    if (f && i.add(p), f?.glyphScale !== void 0 && (o[p] = f.glyphScale), !b || !y) continue;
    const k = f?.url ?? Je(p);
    if (f) {
      const S = t.get(f.url);
      if (!S) throw Error(`Historical mana asset unavailable: ${p}`);
      l.push({ url: f.url, source: S, palette: f, target: b });
    } else k && s.set(k, mo(y, b));
    n[p] = `rgb(${b.map((S) => Math.round(S * 255)).join(" ")})`;
  }
  const c = d.has("W") && Lt(e, "W") === "historic-font";
  if (!s.size && !l.length && !Object.keys(n).length && !c)
    return a;
  const h = Object.assign(new Map(t), {
    manaColors: n,
    originalManaGlyphs: i,
    originalWhiteGlyph: c,
    manaGlyphScales: o
  }), u = [
    ...[...s].flatMap(([p, w]) => {
      const f = t.get(p);
      return f ? [{ url: p, source: f, adjustment: w }] : [];
    }).map(({ url: p, source: w, adjustment: f }) => ({
      url: p,
      key: co(p, w.width, w.height, f),
      bytes: w.width * w.height * 4,
      build: () => ho(w, f)
    })),
    ...l.map(({ url: p, source: w, palette: f, target: y }) => ({
      url: p,
      key: JSON.stringify([
        "historical-mana-palette-v1",
        p,
        w.width,
        w.height,
        f,
        y
      ]),
      bytes: w.width * w.height * 4,
      build: () => eo(w, f, y)
    }))
  ];
  let g = [];
  try {
    g = await $a.acquireMany(u, r), u.forEach(({ url: p }, w) => h.set(p, g[w].value));
    for (const p of i) {
      const w = rr(e, p), f = h.get(w.url), y = Je(p);
      if (!f || !y) throw Error(`Historical mana asset unavailable: ${p}`);
      h.set(y, f);
    }
    return { images: h, dispose: () => g.forEach((p) => p.release()) };
  } catch (p) {
    throw g.forEach((w) => w.release()), p;
  }
}
function co(e, t, r, a) {
  return JSON.stringify(["frame-hsb-paper-mask-v3", e, t, r, a]);
}
async function ho(e, t) {
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  try {
    const a = r.getContext("2d", { willReadFrequently: !0 });
    if (!a) throw Error("HSB preparation needs Canvas2D.");
    a.drawImage(e, 0, 0);
    const s = a.getImageData(0, 0, r.width, r.height);
    return ro(s, t), a.putImageData(s, 0, 0), await createImageBitmap(r);
  } finally {
    r.width = r.height = 0;
  }
}
function mo(e, t) {
  const r = et(e), [a, s, n] = nr(r), [o, i, l] = nr(t);
  if (s <= 0 || n <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (o - a + 540) % 360 - 180,
    saturationScale: i / s,
    brightnessScale: l / n
  };
}
function Er(e, t) {
  if (e.layout && e.layout !== "normal" || (e.legendary ?? /\bLegendary\b/.test(e.typeLine ?? "")))
    return [0, 0];
  const r = e.setCode?.toLowerCase();
  if (e.borderColor && e.borderColor !== (r === "8ed" ? "white" : "black")) return [0, 0];
  if (t === "retro") {
    if (r === "lea") return [-1.5, 1.5];
    if (r === "leb") return [-1, 2];
  }
  return t === "eighth" && r === "8ed" ? [0.5, -2] : t === "modern" && r === "m21" ? [-1, 1] : [0, 0];
}
async function uo(e, t, r) {
  const a = mt(e);
  if (!a) return { images: t, dispose() {
  } };
  const s = (c) => {
    const h = t.get(c);
    if (!h) throw Error(`Historical dual-land asset unavailable: ${c}`);
    return h;
  }, n = s(a.base), o = s(a.overlay), i = s(a.mask), [l] = await Wa.acquireMany(
    [
      {
        key: JSON.stringify([
          "abu-dual-frame-v1",
          a,
          n.width,
          n.height,
          bs(e)
        ]),
        bytes: n.width * n.height * 4,
        build: async () => {
          const c = document.createElement("canvas"), h = document.createElement("canvas");
          c.width = h.width = n.width, c.height = h.height = n.height;
          try {
            const m = c.getContext("2d"), u = h.getContext("2d");
            if (!m || !u) throw Error("Historical dual-land preparation needs Canvas2D.");
            return u.drawImage(o, 0, 0, n.width, n.height), u.globalCompositeOperation = "destination-in", u.drawImage(i, 0, 0, n.width, n.height), m.drawImage(n, 0, 0), m.drawImage(h, 0, 0), await createImageBitmap(c);
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
const go = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", da = {
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
}, ca = {
  m15: { family: "m15-accurate", delta: [1, 0, 1, 1] },
  m21: { family: "m15-accurate", delta: [2, 0, 1.1, 1.06] },
  woe: { family: "m15-accurate", delta: [2, 0, 1.08, 1.08] },
  tdm: { family: "m15-accurate", delta: [0, 0, 1.08, 1.08] },
  "8ed": { family: "eighth", delta: [-4, 0, 1, 0.92] },
  "9ed": { family: "eighth", delta: [0, 1, 0.9, 0.92] }
};
function po(e, t, r) {
  const a = e.setCode?.toLowerCase() ?? "", s = Object.hasOwn(ca, a) ? ca[a] : void 0;
  let n = r;
  return s && !e.setSymbol && ke(t) && s.family === e.frameAssetFamily && (n = ws(r, s.delta)), e.frameAssetFamily ? $r(e, t, n, e.frameAssetFamily) : n;
}
function $r(e, t, r, a) {
  if (e.setSymbol || !ke(t) || P !== go || (e.layout ?? "normal") !== "normal" || ["component", "m15-accurate"].includes(a) && q(e).legendary)
    return r;
  const s = e.borderColor ?? (a === "retro" ? ye(e) : Re(e.setCode).border === "#eeedeb" ? "white" : "black"), n = `${e.setCode?.trim().toLowerCase() ?? ""}/${a}/${s}`, o = Object.hasOwn(da, n) ? da[n] : void 0;
  return o ? ws(r, o) : r;
}
function ws(e, t) {
  const [r, a, s, n] = e, [o, i, l, d] = t;
  return [r + s + o - s * l, a + n / 2 + i - n * d / 2, s * l, n * d];
}
const fo = 0.045;
function bo(e) {
  return oe(e) ? Zs : fo;
}
const er = "#fbf0c5", yt = "#ccdaf2", ha = "#9c9995", tr = "#edaa8d", kt = "#dde6e2", wo = {
  WU: [er, yt],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [tr, er],
  WG: [kt, er],
  UB: [yt, ha],
  UR: [yt, tr],
  UG: [kt, yt],
  BR: ["#b4afb5", "#f2b096"],
  BG: [ha, kt],
  RG: [tr, kt]
};
function yo(e, t, r) {
  if (!t.land) return;
  const a = wo[t.frame];
  if (!a) return;
  const s = 34 + r, n = 420 - 2 * r, o = e.createLinearGradient(s, 0, s + n, 0);
  o.addColorStop(0, a[0]), o.addColorStop(0.35, a[0]), o.addColorStop(0.65, a[1]), o.addColorStop(1, a[1]), e.save(), e.globalCompositeOperation = "multiply", e.fillStyle = o, e.fillRect(s, 425, n, 203.5), e.restore();
}
function ko(e, t, r, a) {
  if (!t.land || t.frame !== "Artifact") {
    a();
    return;
  }
  const s = 34 + r, n = 420 - 2 * r;
  for (const o of [!1, !0])
    e.save(), e.beginPath(), o || e.rect(0, 0, 488, 680), e.rect(s, 425, n, 203.5), e.clip("evenodd"), e.filter = `grayscale(1) brightness(${o ? 0.9 : 0.63})`, a(), e.restore();
}
function ys(e) {
  if (e.setSymbol) return null;
  const t = e.setCode?.toLowerCase();
  return t === "m15" || t === "war" ? t : null;
}
function ks(e, t, r, a, s, n, o, i, l, d) {
  const [c, h, m, u] = d ? r === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, r === "m15" ? 0.7 : 1.2];
  s += h - o * (c - 1) / 2, n += m - i * (c - 1) / 2, o *= c, i *= c;
  const g = !a || a === "common", p = document.createElement("canvas"), w = 3, f = 4;
  p.width = Math.ceil((o + w * 2) * f), p.height = Math.ceil((i + w * 2) * f);
  const y = p.getContext("2d");
  y.scale(f, f), y.translate(w, w), y.drawImage(
    t,
    l[0] * t.width,
    l[1] * t.height,
    l[2] * t.width,
    l[3] * t.height,
    0,
    0,
    o,
    i
  ), y.globalCompositeOperation = "source-in";
  const b = a === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : a === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], k = y.createLinearGradient(0, i * 0.65, o, i * 0.35);
  k.addColorStop(0, b[0]), k.addColorStop(0.35, b[1]), k.addColorStop(0.6, b[2]), k.addColorStop(1, b[3]), y.fillStyle = g ? "#111111" : k, y.fillRect(0, 0, o, i);
  const S = r === "m15" ? 32 : 27, R = new Path2D(
    r === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), C = new DOMMatrix().translate(-l[0] * o / l[2], -l[1] * i / l[3]).scale(o / (S * l[2]), i / (32 * l[3])), T = new Path2D();
  T.addPath(R, C), y.globalCompositeOperation = "destination-over", y.fillStyle = g ? "#f8f8f5" : "#111111", y.fill(T), y.strokeStyle = y.fillStyle, y.lineWidth = r === "war" && g ? 2 : u, y.lineJoin = "round", y.stroke(T), e.drawImage(
    p,
    s - w,
    n - w,
    p.width / f,
    p.height / f
  ), p.width = p.height = 0;
}
const ma = {
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
function So(e) {
  if ((e.layout ?? "normal") !== "normal") return;
  const t = `${e.setCode?.toLowerCase() ?? ""}/${ye(e)}`;
  return Object.hasOwn(ma, t) ? ma[t] : void 0;
}
function vo(e, t) {
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
function Ro(e, t, r) {
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
function Co(e, t) {
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
const K = {
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
}, Mo = {
  W: { ...K.por, right: 436.75, centerY: 389.75 },
  U: { ...K.por, right: 436.5, centerY: 392.75 },
  R: { ...K.por, right: 433.75, centerY: 392 },
  G: { ...K.por, right: 434, centerY: 390.75 }
}, To = {
  all: {
    U: { ...K.all, right: 427.5, centerY: 393.25 },
    W: { ...K.all, right: 427.25, centerY: 392.75 }
  },
  mir: {
    G: { ...K.mir, right: 437, centerY: 390.25 },
    W: { ...K.mir, right: 437.75, centerY: 389.25 }
  },
  sth: {
    G: { ...K.sth, right: 434, centerY: 391 },
    R: { ...K.sth, right: 433.5, centerY: 391.75 },
    W: { ...K.sth, right: 435.25, centerY: 389.25 }
  },
  tmp: {
    U: { ...K.tmp, right: 433, centerY: 392.75 },
    W: { ...K.tmp, right: 433.25, centerY: 389.5 }
  },
  vis: {
    W: { ...K.vis, right: 437.5, centerY: 389.25 }
  },
  wth: {
    W: { ...K.wth, right: 435.75, centerY: 389.75 }
  },
  hml: {
    R: { ...K.hml, right: 437.75, centerY: 393.5 }
  },
  por: Mo
};
function jo(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  if (e.setSymbol || !Object.hasOwn(K, t)) return null;
  const r = O(e);
  return r.length === 1 && !/\b(?:Land|Artifact)\b/.test(e.typeLine ?? "") ? To[t]?.[r[0]] ?? K[t] : K[t];
}
function Go(e) {
  return e.setSymbol || e.setCode?.toLowerCase() !== "exo" ? null : e.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : e.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const mr = {
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
}, Ss = (e) => `${e}#opaque-print-details-v1`, Io = (e) => Object.keys(mr).some((t) => e === `${we.KEYRUNE_ROOT}/${t}.svg`);
async function Bo(e, t) {
  const r = Object.keys(mr).find((c) => e === `${we.KEYRUNE_ROOT}/${c}.svg`);
  if (!r) return null;
  const a = new DOMParser().parseFromString(await t.text(), "image/svg+xml"), s = a.documentElement, n = a.querySelectorAll("path"), o = n[0]?.getAttribute("d") ?? "", i = o.match(/M[^M]*/g) ?? [], l = mr[r];
  if (s.localName !== "svg" || a.querySelector("parsererror") || n.length !== 1 || i.length !== l.count || i.some((c) => /m/.test(c) || !/[zZ]\s*$/.test(c)))
    throw new Error(`Unexpected pinned ${r} symbol paths.`);
  const d = a.createElementNS("http://www.w3.org/2000/svg", "path");
  return d.setAttribute("d", l.white.map((c) => i[c]).join("")), d.setAttribute("fill", "#fff"), s.replaceChildren(d), new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" });
}
function xo(e, t, r, a = !1, s) {
  vs(
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
function Ao(e, t, r, a = !1, s) {
  vs(
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
function vs(e, t, r, a, s, n) {
  t.forEach((o, i) => {
    const { size: l } = a, d = a.right - (t.length - 1 - i) * (a.pitch + (n?.spacing ?? 0)) - l / 2, c = a.centerY - l / 2;
    if (o !== "W" || s || r.originalManaGlyphs?.has("W")) {
      Z(e, o, d, c, l, r, !1, n);
      return;
    }
    Ir(
      e,
      d,
      c,
      l,
      a.whiteSize,
      r.manaColors?.W,
      dt(n, o)
    );
  });
}
const Rs = (e, t, r, a, s, n, o = !1, i) => {
  if (t !== "W" || n.originalManaGlyphs?.has("W"))
    return Z(e, t, r, a, s, n, o, i);
  Ir(
    e,
    r,
    a,
    s,
    s * 0.87,
    n.manaColors?.W,
    dt(i, t)
  );
};
function Lo(e, t, r, a, s, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0;
  const o = document.createElement("canvas");
  o.width = e.canvas.width, o.height = e.canvas.height;
  const i = o.getContext("2d");
  if (!i) throw Error("Retro lettering needs a Canvas2D context");
  const l = e.getTransform();
  i.font = e.font, i.textAlign = e.textAlign, i.textBaseline = e.textBaseline, i.letterSpacing = e.letterSpacing, e.resetTransform();
  for (const [d, c, h] of [
    [0, n, "#f2eee3"],
    [n, 0, "#17140f"]
  ])
    i.resetTransform(), i.clearRect(0, 0, o.width, o.height), i.setTransform(l), i.globalCompositeOperation = "source-over", i.fillStyle = h, i.fillText(t, r + d, a + d, s), i.globalCompositeOperation = "destination-out", i.fillText(t, r + c, a + c, s), e.drawImage(o, 0, 0);
  o.width = o.height = 0, e.restore();
}
function Wr(e, t, r, a, s, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#17140f", e.fillText(t, r + n, a + n, s), e.fillStyle = "#ababab", e.fillText(t, r, a, s), e.restore();
}
function Eo(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function $o(e, t) {
  e.save(), e.font = '22.5px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", Wr(e, `Illus. © ${t}`, 49, 631, 338, 1.25), e.restore();
}
const Bt = (e) => e?.runs.map((t) => t.text).join("") ?? "", ua = (e) => e.length === 2 && /^[A-Za-z ,]+$/.test(Bt(e[0])) && Bt(e[0]).length <= 20;
function Wo(e, t, r, a, s, n, o, i) {
  const l = (u) => u.role === "rules" && u.runs.length > 0 && !Bt(u).includes(`
`) && u.align === void 0;
  if (!r.length || !r.every(l) || t.some((u) => u.align) || r.length !== 1 && !ua(r)) return null;
  const d = (u) => u.map(
    (g, p) => ({
      ...g,
      align: g.align ?? (g.role === "flavor" || ua(u) && p === 0 && !/^Enchant\b/.test(Bt(g)) ? "left" : "center")
    })
  ), c = { x: 70, y: a - 6, width: 348, height: s - 8 }, h = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, m = J(e, d(r), c, n, n, h);
  return m.overflow || m.lines.length > 5 ? null : J(
    e,
    d(t),
    { ...c, verticalLimits: i },
    n,
    o,
    h
  );
}
const ot = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: !1,
  flavorSeparator: !1
};
function Oo(e, t) {
  if (br(t)) return null;
  const [r, a, s, n] = ge(fr(t).rules), o = gr(t), i = o?.paragraphs ?? rt({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), l = t.rulesAlignment?.mode === "left", d = l ? i.map((M) => ({ ...M, align: "left" })) : i, c = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? d : d, h = t.wordingMode === "oracle" ? 10 : 15, m = t.setCode?.toLowerCase(), u = m === "lea" && t.wordingMode === "oracle" ? [428, 590] : void 0, g = ["lea", "leb", "2ed"].includes(m ?? ""), p = g || m === "3ed" && pe(t) === "fourth";
  if (p && !l) {
    const M = Wo(
      e,
      d,
      c,
      a,
      n,
      g ? 32.5 : 27.5,
      h,
      u
    );
    if (M) return M;
  }
  const w = c.length === 1 ? c[0] : void 0, f = w?.runs.length === 1 ? w.runs[0] : void 0;
  if (!l && m === "4ed" && pe(t) === "fourth" && c.some((M) => M.role === "flavor")) {
    const M = pt(
      e,
      d,
      c,
      { x: 72, y: a + 2, width: 344, height: n - 8 },
      25,
      h,
      5,
      {
        ...ot,
        leading: 1.1,
        paragraphGap: 0,
        flavorGap: 0,
        balanceLines: !0
      },
      150
    );
    if (M) return M;
  }
  const y = !l && m === "4ed" && pe(t) === "fourth" && d.every((M) => M.align === void 0 || M.align === "center") && w?.role === "rules" && (w.align === void 0 || w.align === "center") && f && !f.italic && !f.text.includes(`
`) && f.text.length > 0 && f.text.length <= 100, b = (p || m === "4ed" && pe(t) === "fourth") && (d.length > 1 || d.reduce((M, G) => M + G.runs.reduce((x, W) => x + W.text.length, 0), 0) > 100), k = b && p, S = b && m === "4ed", R = (m === "mir" || m === "tmp") && !o && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") && O(t).join("") === "W", C = J(
    e,
    y ? d.map((M) => ({ ...M, align: "center" })) : d,
    {
      x: p ? 70 : S || y ? 72 : r,
      y: a + (o ? 1.5 : y ? -6 : S ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: p ? 346 : S || y ? 344 : s + (R ? 10 : 0),
      height: n - 8,
      verticalLimits: u
    },
    o ? 24 : y ? 25 : 22.5,
    h,
    y ? { ...ot, leading: 1, balanceLines: !0 } : b ? {
      ...ot,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: k ? -10 : 0
    } : ot
  ), T = d.reduce(
    (M, G) => M + G.runs.reduce((x, W) => x + W.text.length, 0),
    0
  );
  return !k || T <= 270 || C.size >= 22 ? C : J(
    e,
    d,
    { x: 70, y: a + 4, width: 346, height: n + 8, verticalLimits: u },
    15.5,
    h,
    {
      ...ot,
      leading: 1.25,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: -18
    }
  );
}
function Po(e) {
  return e.setCode?.toLowerCase() === "3ed" && pe(e) === "fourth";
}
function Do(e, t, r, a, s) {
  e.save(), e.font = '26px "CardRenderer MTG Goudy", Georgia', Wr(e, t, 40, a, s + r - 40, 1), e.restore();
}
function Uo(e, t, r) {
  e.save(), e.font = '26px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "right", Lo(e, t, 451, r + 12, 130, 1.25), e.restore();
}
function Fo(e, t) {
  e.save(), e.font = '22px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", Wr(e, `Illus. © ${t}`, 50, 642, 338, 1.25), e.restore();
}
function _o(e) {
  return ["4ed", "5ed"].includes(e.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(e.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function ga(e) {
  const t = String(e.toughness ?? ""), r = e.wordingMode !== "oracle" && e.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(t) ? `(${t})` : t;
  return `${e.power ?? ""}/${r}`;
}
function No(e) {
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
const Or = (e, t, r, a, s, n) => {
  if (t !== "T") return Z(e, t, r, a, s, n);
  Cs(e, r, a, s, "", 0.88);
}, ur = (e, t, r, a, s, n) => {
  if (t !== "T") return Rs(e, t, r, a, s, n);
  Cs(e, r, a, s, "", 0.8);
}, Yo = (e, t, r, a, s, n) => {
  if (t !== "T") return Z(e, t, r, a, s, n);
  Or(e, t, r, a, s, n);
}, Ho = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function zo(e) {
  const t = e?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(t) || ["lea", "leb", "2ed", "arn", "atq"].includes(t) ? ur : t === "4ed" ? Yo : Ho.has(t) ? Or : Z;
}
function Cs(e, t, r, a, s, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#c9c4be", e.beginPath(), e.arc(t + a / 2, r + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = `${a * n}px "CardRenderer MTG Historic Symbols"`, e.textAlign = "left", e.textBaseline = "alphabetic";
  const o = e.measureText(s);
  e.fillText(
    s,
    t + (a - o.actualBoundingBoxLeft - o.actualBoundingBoxRight) / 2 + o.actualBoundingBoxLeft,
    r + (a + o.actualBoundingBoxAscent - o.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function qo(e, t, r, a, s, n, o, i = [0, 0, 1, 1], l = null, d = "low") {
  const c = document.createElement("canvas"), h = Math.ceil(o * 2) + 1;
  c.width = Math.ceil(s * 2) + h * 2, c.height = Math.ceil(n * 2) + h * 2;
  const m = c.getContext("2d");
  m.imageSmoothingQuality = d, m.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    h,
    h,
    s * 2,
    n * 2
  ), m.globalCompositeOperation = "source-in", m.fillStyle = "#fff", m.fillRect(0, 0, c.width, c.height), e.save(), e.shadowColor = "transparent";
  for (let u = 0; o > 0 && u < 16; u++) {
    const g = u * Math.PI / 8;
    e.drawImage(
      c,
      r - h / 2 + Math.cos(g) * o,
      a - h / 2 + Math.sin(g) * o,
      c.width / 2,
      c.height / 2
    );
  }
  if (m.fillStyle = "#17140f", l) {
    const u = m.createLinearGradient(h, h, h + s * 2, h);
    l.forEach((g, p) => u.addColorStop(p / 2, g)), m.fillStyle = u;
  }
  m.fillRect(0, 0, c.width, c.height), e.drawImage(c, r - h / 2, a - h / 2, c.width / 2, c.height / 2), e.restore(), c.width = c.height = 0;
}
function Xo(e, t, r) {
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", t.artist && (e.fillStyle = "#f2eee3", e.shadowColor = "#000", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = `${r.artistSize}px "CardRenderer MTG MPlantin", Georgia`, e.fillText(`Illus. ${t.artist}`, r.artistX, r.artistBaseline, 338)), e.shadowColor = "transparent", e.fillStyle = r.legalLight ? "#f2eee3" : "#17140f", e.font = `${r.legalSize}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && e.fillText(r.legalText, r.artistX, r.legalBaseline, 380), e.restore();
}
function Jo(e, t, r, a, s) {
  const n = fr(t), o = No(t), i = Po(t);
  if (s === "artwork") {
    Ce(e, t, r, ge(n.art), s);
    return;
  }
  e.fillStyle = Yr(t), e.fillRect(0, 0, 488, 680), e.fillStyle = "#686050", e.fillRect(24.4, 27.2, 439.2, 625.6), e.fillStyle = "#e5dec5", e.fillRect(...ge(n.rules)), e.fillStyle = "#746b58", e.fillRect(...ge(n.art)), a && e.drawImage(a, 0, 0, 488, 680), Ce(e, t, r, ge(n.art), s);
  const l = r.get(Ae(t));
  if (l && (e.save(), e.filter = Cn(t), e.drawImage(l, ...ge(n.frame)), Ro(e, l, Ae(t)), Ae(t).endsWith("/seventh/regular/m.png") && Co(e, l), e.restore()), ye(t) !== "black" || pe(t) === "fourth") {
    const D = r.get(La(t));
    if (D) {
      const _ = document.createElement("canvas");
      _.width = 732, _.height = 1020;
      const Y = _.getContext("2d");
      Y.drawImage(D, 0, 0, 732, 1020), Y.globalCompositeOperation = "source-in", Y.fillStyle = Yr(t), Y.fillRect(0, 0, 732, 1020), e.drawImage(_, ...ge(n.frame)), _.width = _.height = 0;
    }
  }
  e.fillStyle = Hr(t), e.textBaseline = "middle", e.textAlign = "left", e.letterSpacing = "0px";
  const [d, c, h, m] = ge(n.title), u = t.manaSymbols ?? [], g = So(t), p = g?.[3] ?? o?.manaSize ?? 23.4, w = g ? g[2] - p : o?.manaGap ?? 1.7, f = u.length * (p + w), y = g ? g[0] + p / 2 - f + w : o ? o.manaRight - f + w : d + h - f, b = ["lea", "2ed"].includes(t.setCode?.toLowerCase() ?? ""), k = i || b ? [
    (i ? 435 : 432) - Math.max(0, u.length - 1) * 27 - (i ? 23.4 : 23.9) / 2,
    (i ? 44.5 : 46) - (i ? 23.4 : 23.9) / 2,
    Math.max(0, u.length - 1) * 27 + (i ? 23.4 : 23.9),
    i ? 23.4 : 23.9
  ] : [
    y,
    g ? g[1] - p / 2 : o?.manaTop ?? c + m / 2 - p / 2,
    Math.max(0, f - w),
    p
  ], S = $t(t), R = Bn(k, u.length, S), C = De(R, S);
  e.shadowColor = "#000b", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const T = o?.titleX ?? d, M = c + m / 2 + (o?.titleYOffset ?? 0), G = Math.max(
    1,
    u.length ? y + C[0] - k[0] - T - 5 : o?.titleX == null ? h - 5 : d + h - T - 5
  );
  e.save(), e.translate(...Er(t, "retro")), i ? Do(e, t.name, T, M, G) : e.fillText(t.name, T, M, G), e.restore();
  const x = t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle", W = t.symbolStyle === "original" || t.symbolStyle === void 0 && t.wordingMode === "original", I = W && ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  Ke(e, R, S, () => {
    i ? xo(e, u, r, x, S) : ["lea", "2ed"].includes(t.setCode?.toLowerCase() ?? "") ? Ao(e, u, r, x, S) : u.forEach(
      (D, _) => (I ? Rs : Z)(
        e,
        D,
        y + _ * (p + w) - (u.length - 1 - _) * (S?.spacing ?? 0),
        g ? g[1] - p / 2 : o?.manaTop ?? c + m / 2 - p / 2,
        p,
        r,
        !1,
        S
      )
    );
  });
  const [F, $, V, ae] = ge(n.type), ue = Ea(t) ?? "", N = r.get(ue), X = jo(t), je = Go(t), A = N ? Math.min(44 / N.width, (o?.setHeight ?? 23.4) / N.height) : 0, z = X?.width ?? (N?.width ?? 0) * A, L = X?.height ?? (N?.height ?? 0) * A, ie = [
    (X?.right ?? o?.setRight ?? F + V) - z,
    (X?.centerY ?? o?.setCenterY ?? $ + ae / 2) - L / 2,
    z,
    L
  ], te = $r(t, ue, ie, "retro"), $e = De(te, t.symbolAdjustment?.set);
  e.font = '21.7px "CardRenderer MTG MPlantin", Georgia', e.fillText(
    gr(t)?.typeLine ?? t.typeLine ?? "",
    o?.typeX ?? F,
    $ + ae / 2,
    N ? Math.max(
      1,
      Math.min(
        V - 48,
        X ? X.right - X.width - F - 6 : V,
        $e !== ie ? $e[0] - (o?.typeX ?? F) - 6 : V
      )
    ) : V
  ), Ke(e, te, t.symbolAdjustment?.set, () => {
    if (N) {
      const D = Math.min(44 / N.width, (o?.setHeight ?? 23.4) / N.height), _ = X?.width ?? N.width * D, Y = X?.height ?? N.height * D, de = X?.right ?? o?.setRight ?? F + V, ce = X?.centerY ?? o?.setCenterY ?? $ + ae / 2, se = X?.crop ?? [0, 0, 1, 1], st = ke(ue), Ie = !st && !t.setSymbol && r.get(Ss(ue));
      Ie && (e.save(), e.shadowColor = "transparent", t.setCode?.toLowerCase() === "arn" && (e.filter = "brightness(0.7)"), e.drawImage(
        Ie,
        se[0] * Ie.width,
        se[1] * Ie.height,
        se[2] * Ie.width,
        se[3] * Ie.height,
        de - _,
        ce - Y / 2,
        _,
        Y
      ), e.restore()), st || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(N, ...te), e.restore()) : je || o || Ga(t.setCode) ? qo(
        e,
        N,
        de - _,
        ce - Y / 2,
        _,
        Y,
        X?.outline ?? (je ? 2 : o?.setOutline ?? Xs(t.setCode)),
        se,
        je,
        X?.sampling
      ) : Te(
        e,
        N,
        t.setCode,
        t.rarity,
        F + V - N.width * D,
        $ + ae / 2 - N.height * D / 2,
        N.width * D,
        N.height * D
      );
    }
  }), e.shadowColor = "transparent";
  const [Ue, Ge, Se, We] = ge(n.rules);
  e.fillStyle = "#17140f";
  const le = r.get(br(t) ?? "");
  if (le) {
    const D = Math.min(Se * 0.4 / le.width, We * 0.75 / le.height);
    e.drawImage(
      le,
      Ue + (Se - le.width * D) / 2,
      Ge + (We - le.height * D) / 2,
      le.width * D,
      le.height * D
    );
  } else {
    const D = Oo(e, t);
    D && me(
      e,
      D,
      r,
      x ? Z : W ? zo(t.setCode) : t.setCode?.toLowerCase() === "3ed" ? ur : o ? Or : Z,
      t.setCode?.toLowerCase() === "lea" ? 0.012 : 0
    );
  }
  if (!vo(e, t)) {
    if (e.shadowColor = o?.statsOpaqueShadow ? "#000" : "#000b", o && (e.shadowOffsetX = e.shadowOffsetY = o.statsShadow * e.getTransform().a), e.fillStyle = Hr(t), e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", t.power != null && t.toughness != null) {
      const [D, _, Y, de] = ge(n.stats), ce = _o(t);
      e.textAlign = ce ? "right" : "center", i ? Uo(e, ga(t), _ + de / 2) : e.fillText(
        ga(t),
        ce?.right ?? D + Y / 2,
        _ + de / 2 + (ce?.yOffset ?? 0),
        ce?.maxWidth ?? Y
      );
    }
    if (i && t.artist) Fo(e, t.artist);
    else if (t.artist && Eo(t)) $o(e, t.artist);
    else if (o) Xo(e, t, o);
    else if (t.artist) {
      const [D, _, Y, de] = ge(n.footer);
      e.textAlign = "center", e.font = '15.6px "CardRenderer MTG MPlantin", Georgia', e.fillText(`Illus. ${t.artist}`, D + Y / 2, _ + de / 2, Y);
    }
    e.shadowColor = "transparent";
  }
}
const Vo = (e, t = {}) => fetch(e, { ...t, mode: "cors" });
let pa;
const Ko = [
  ["CardRenderer MTG Goudy", Sn],
  ["CardRenderer MTG Historic Symbols", kn]
];
function Zo() {
  return typeof FontFace != "function" ? Promise.resolve() : pa ??= Promise.all(
    Ko.map(async ([e, t]) => {
      if ([...document.fonts].some(
        (a) => a.family.replace(/^"|"$/g, "") === e && a.status === "loaded"
      ))
        return;
      const r = await Vo(t);
      if (!r.ok) throw Error(`Retro font unavailable: ${e}`);
      document.fonts.add(await new FontFace(e, await r.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((e) => {
    throw pa = void 0, e;
  });
}
const Qo = `${Xe}/img/class_level_bg.webp`, Ms = (e) => ["adventure", "class", "leveler"].includes(re(e)), He = (e, t, r, a) => ({
  x: e / 63.5 * 488,
  y: t / 88.9 * 680,
  width: r / 63.5 * 488,
  height: a / 88.9 * 680
}), ei = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function ti(e, t, r, a = 21) {
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
function Dt(e) {
  const t = re(e), r = [], a = (s, n, o, i = {}) => {
    r.push({ kind: s, text: n, ...o, font: ti(n, o.width, o.height), ...i });
  };
  if (t === "adventure") {
    const s = e.faces?.[1];
    if (!s) return [];
    const n = (s.manaSymbols ?? []).map((i) => `{${i}}`).join(""), o = (s.manaSymbols?.length ?? 0) * 2.5;
    a("heading", s.name, He(5.6, 55.3, 25 - o, 4.2), {
      color: "white",
      font: Math.min(18, (25 - o) * 488 / 63.5 / Math.max(1, s.name.length * 0.55))
    }), a("rules", n, He(30 - o, 55.3, o, 4.2), { color: "white", font: 17 }), a("heading", s.typeLine ?? "", He(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (s.typeLine ?? "").length * 0.52))
    }), a("rules", s.rulesText ?? "", He(5.6, 64.5, 24.7, 15.6)), a("rules", e.rulesText ?? e.faces?.[0]?.rulesText ?? "", He(33, 54.9, 25.5, 25));
  } else if (t === "class") {
    const [s, n, o, i] = be(e).rules.map(
      (b, k) => b * (k % 2 ? j : v)
    ), l = q(e);
    a(
      "band",
      "",
      { x: s, y: n, width: o, height: i },
      {
        fill: "#e3d8bb",
        asset: he(
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
    const c = (b) => /^.*:\s*Level\s+\d+\s*$/i.test(b), h = 28, m = 20, u = (b, k) => b.split(`
`).reduce(
      (S, R) => S + Math.max(1, Math.ceil(R.length * k * 0.53 / (o - 10))),
      0
    ), g = d.map(
      (b) => c(b) ? h : u(b, b.startsWith("(") ? 16 : m) * (b.startsWith("(") ? 16 : m) + 8
    ), p = d.filter((b) => !c(b)).length, w = Math.max(0, i - g.reduce((b, k) => b + k, 0)) / Math.max(1, p), f = Math.min(
      1,
      (i - d.filter(c).length * h) / g.reduce((b, k, S) => b + (c(d[S]) ? 0 : k), 0)
    );
    let y = n;
    d.forEach((b, k) => {
      const S = c(b), R = S ? h : g[k] * f + w;
      if (S) {
        const [C, T] = b.split(/:\s*/);
        a("band", "", { x: s, y, width: o, height: R }, { asset: Qo }), a("rules", C + ":", { x: s + 5, y, width: o / 2 - 5, height: R }, { font: 18 }), a(
          "heading",
          T,
          { x: s + o / 2, y, width: o / 2 - 5, height: R },
          { font: 18, align: "right" }
        );
      } else
        a(
          "rules",
          b,
          { x: s + 5, y: y + 4, width: o - 10, height: R - 8 },
          { font: (b.startsWith("(") ? 16 : m) * f, italic: b.startsWith("(") }
        );
      y += R;
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
      const h = n[c + 1] ?? "", m = h.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      o.push({
        range: n[c],
        stats: m?.[1] ?? "",
        text: m ? h.slice(m[0].length) : h
      });
    }
    const i = He(4.9, 55.6, 53.7, 25.5), l = i.height / o.length, d = ei[q(e).frame] ?? "#dcc8af";
    o.forEach((c, h) => {
      const m = i.y + h * l;
      h && a(
        "band",
        "",
        { x: i.x, y: m, width: i.width, height: l },
        { fill: h % 2 ? "#00000018" : "#00000028" }
      );
      const u = c.range ? 55 : 7, g = c.stats ? 72 : 7;
      a("rules", c.text, {
        x: i.x + u,
        y: m + 4,
        width: i.width - u - g,
        height: l - 8
      }), c.range && a(
        "level",
        `LEVEL
${c.range}`,
        { x: i.x - 12, y: m + l / 2 - 23, width: 65, height: 46 },
        { fill: d, font: 13 }
      ), c.stats && a(
        "stats",
        c.stats,
        { x: i.x + i.width - 68, y: m + l / 2 - 22, width: 77, height: 44 },
        { asset: he("pt-boxes", q(e).pt), font: 26 }
      );
    });
  }
  return r;
}
function ri(e) {
  return Dt(e).flatMap((t) => [
    t.asset ?? null,
    ...xt(t.text).flatMap((r) => r.symbol ? [Je(r.symbol)] : [])
  ]);
}
function ai(e) {
  if (["adventure", "prepare"].includes(re(e))) {
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
      q(t)
    ] : null;
  }
  return Ms(e) ? Dt(e) : null;
}
function si(e, t, r) {
  for (const a of Dt(t)) {
    const { x: s, y: n, width: o, height: i, font: l } = a;
    e.save(), e.textAlign = "left", e.fillStyle = a.fill ?? "transparent", a.kind === "level" ? (e.beginPath(), e.moveTo(s, n), e.lineTo(s + o * 0.72, n), e.lineTo(s + o, n + i / 2), e.lineTo(s + o * 0.72, n + i), e.lineTo(s, n + i), e.closePath(), e.fill(), e.strokeStyle = "#0008", e.lineWidth = 1, e.stroke()) : a.fill && e.fillRect(s, n, o, i);
    const d = a.asset ? r.get(a.asset) : null;
    if (d && e.drawImage(d, s, n, o, i), e.beginPath(), e.rect(s, n, o, i), e.clip(), e.fillStyle = a.color ?? "#17140f", ["stats", "level"].includes(a.kind)) {
      e.font = `${l}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
      const c = a.text.split(`
`);
      c.forEach(
        (h, m) => e.fillText(
          h,
          s + o * (a.kind === "level" ? 0.43 : 0.5),
          n + i / 2 + (m - (c.length - 1) / 2) * l,
          o * 0.85
        )
      );
    } else if (a.align === "right")
      e.font = `${l}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "right", e.textBaseline = "middle", e.fillText(a.text, s + o, n + i / 2, o);
    else {
      e.font = `${a.italic ? "italic " : ""}${l}px "CardRenderer MTG MPlantin", Georgia`;
      const c = Br(e, a.text, o, l).length * l + (a.text.split(`
`).length - 1) * E.paragraphGap;
      ls(
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
const ni = 5, oi = 0.02655 * j + 0.91339 * v * 3810 / 2736;
function Pr(e) {
  const t = e ? 382 : 429;
  return { top: t, scale: 1 - ni / (oi - t) };
}
function ii(e) {
  const { top: t, scale: r } = Pr(e);
  return [t + 6, t + (625 - t) * r - 4];
}
function fa(e, t, r, a, s, n) {
  const { top: o, scale: i } = Pr(n), l = t.height * s / t.width, d = Math.max(0, Math.min(l, o - a)), c = d * t.width / s;
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
function li(e, t, r) {
  const a = e.rulesParagraphs?.filter((o) => o.role === "rules")[r], s = (e.rulesText ?? "").split(`
`).filter((o) => o.trim())[r];
  if (!a || a.runs.map((o) => o.text).join("") !== s) return [{ text: t }];
  let n = s.length - t.length;
  return a.runs.flatMap((o) => {
    const i = Math.min(n, o.text.length);
    return n -= i, i === o.text.length ? [] : [{ ...o, text: o.text.slice(i) }];
  });
}
function di(e, t) {
  const r = re(t) === "planeswalker-large", a = ft(t), s = !r && a.length < 3, n = be(t).rules, o = n[0] * v, i = n[1] * j, l = n[2] * v, d = n[3] * j - (r ? 24 : s ? 4 : 16), c = r ? 8 : s ? 3 : 0, h = r ? { ...Gt, leading: 0.9 } : Gt, m = a.map((M, G) => ({
    ...M,
    runs: li(t, M.text, G),
    left: M.badges.length ? 67 : 45
  })), u = (M) => m.map(
    (G) => J(
      e,
      [{ role: "rules", runs: G.runs }],
      { x: o + G.left, y: 0, width: l - G.left - 8, height: 1e3 },
      M,
      M,
      h
    )
  );
  let g = r ? 17.5 : s ? 24 : 19, p = u(g);
  const [w, f] = ii(r), y = () => {
    const M = d / Math.max(1, m.length), G = p.map((I, F) => i + c + M * (F + 0.5) - I.height / 2);
    let x = w - 8;
    for (let I = 0; I < G.length; I++)
      G[I] = Math.max(G[I], x + 8), x = G[I] + p[I].height;
    let W = f + 8;
    for (let I = G.length - 1; I >= 0; I--)
      G[I] = Math.min(G[I], W - 8 - p[I].height), W = G[I];
    return G;
  }, b = () => (y()[0] ?? w) >= w, k = () => p.map((M) => Math.max(34, M.height + 16)), S = () => {
    const M = d / Math.max(1, m.length);
    return p.every((G, x) => {
      const W = M * (x + 0.5);
      return W - G.height / 2 >= 6 && W + G.height / 2 <= d + 6 && (!x || M - (G.height + p[x - 1].height) / 2 >= 8);
    });
  };
  for (; g > 8 && (k().reduce((M, G) => M + G, 0) > d || !S() || !b()); )
    g -= 0.25, p = u(g);
  const R = d / Math.max(1, m.length), C = y();
  let T = c;
  return m.map((M, G) => {
    const x = R, W = p[G].height, I = J(
      e,
      [{ role: "rules", runs: M.runs }],
      {
        x: o + M.left,
        y: C[G],
        width: l - M.left - 8,
        height: W
      },
      g,
      g,
      h
    );
    I.overflow ||= T + x > c + d + 0.01, I.overflow ||= !S(), I.overflow ||= !b(), I.overflow ||= I.lines.some(
      ($) => $.inkBounds[1] < w - 0.01 || $.inkBounds[1] + $.inkBounds[3] > f + 0.01
    );
    const F = { ...M, top: T, height: x, font: g, width: I.width, layout: I };
    return T += x, F;
  });
}
function ci(e) {
  return { font: 18, offsetY: e.startsWith("+") ? 2 : e === "0" ? 0 : -2 };
}
function Ts(e, t) {
  return e === "saga" ? /^(I|II|III|IV)$/.test(t) ? he("saga", t) : null : he(
    "planeswalker",
    t.startsWith("+") ? "LoyaltyPlus" : t === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function js(e, t) {
  return re(e) === "saga" ? he("saga_textboxes", t === "Colourless" ? "Land" : t) : null;
}
function hi(e) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[q(e).boxes] ?? "#dededbf0";
}
function mi(e, t) {
  const { top: r, scale: a } = Pr(re(t) === "planeswalker-large");
  e.save(), e.translate(0, r), e.scale(1, a), e.translate(0, -r), e.beginPath(), e.moveTo(66, r), e.lineTo(448, r), e.quadraticCurveTo(456, r, 456, r + 8), e.lineTo(456, 613), e.bezierCurveTo(456, 623, 420, 629, 257, 629), e.bezierCurveTo(94, 629, 58, 623, 58, 613), e.lineTo(58, r + 8), e.quadraticCurveTo(58, r, 66, r), e.closePath(), e.clip(), e.fillStyle = hi(t), e.fillRect(58, r, 398, 629 - r), e.restore();
}
function ui(e, t, r) {
  e.fillStyle = "#17140f", e.font = '24px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "alphabetic";
  const a = e.measureText(":");
  e.fillText(
    ":",
    t,
    r + 1.5 + (a.actualBoundingBoxAscent - a.actualBoundingBoxDescent) / 2
  );
}
function gi(e, t, r) {
  const a = re(t), s = a === "saga", n = be(t).rules, o = n[0] * v, i = n[1] * j, l = n[2] * v, d = n[3] * j;
  s && (e.fillStyle = "#e3d8bb", e.fillRect(o, i, l, d));
  const c = js(t, q(t).boxes), h = c ? r.get(c) : void 0;
  h && e.drawImage(h, o, i, l, d);
  const m = s ? m0(t) : di(e, t);
  for (const [u, g] of m.entries()) {
    if (u > 0) {
      const f = m[u - 1]?.layout, y = g.layout && f ? Math.max(f.top + f.height + 3, Math.min(i + g.top, g.layout.top - 3)) : i + g.top;
      e.fillStyle = "#0002", e.fillRect(o + (s ? 0 : 40), y, l - (s ? 0 : 40), 1.5);
    }
    if (e.fillStyle = "#17140f", e.textAlign = "left", g.layout) me(e, g.layout, r);
    else {
      e.font = `${g.reminder ? "italic " : ""}${g.font}px "CardRenderer MTG MPlantin", Georgia`;
      const f = Br(e, g.text, g.width, g.font).length * g.font;
      ls(
        e,
        g.text,
        o + g.left,
        i + g.top + (g.height - f) / 2,
        g.width,
        { size: g.font, italic: g.reminder },
        r
      );
    }
    const p = s ? 36 : 54, w = s ? 36 : 40;
    g.badges.forEach((f, y) => {
      const b = o + (s ? -18 : 0), k = i + g.top + g.height / 2 + (y - g.badges.length / 2) * w, S = Ts(a, f), R = S ? r.get(S) : null;
      if (R) {
        if (e.save(), !s) {
          const C = e.getTransform().a;
          e.shadowColor = "#0009", e.shadowBlur = 3 * C, e.shadowOffsetY = 2 * C;
        }
        e.drawImage(R, b, k, p, w), e.restore();
      } else
        e.fillStyle = "#29231c", e.fillRect(b, k, p, w);
      if (!R || !s) {
        e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle";
        const C = ci(f);
        e.font = `bold ${s ? 19 : C.font}px "CardRenderer MTG Beleren", Georgia`, e.fillText(
          f,
          b + p / 2 - (s ? 0 : 1.5),
          k + w / 2 + (s ? 0 : C.offsetY),
          p - 3
        ), s || ui(e, b + p + 4, k + w / 2);
      }
    });
  }
}
const Gs = 0.7;
function pi(e, t, r, a = !1) {
  const [s, n, o, i] = [
    r[0] * v,
    r[1] * j,
    r[2] * v,
    r[3] * j - 1
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
  e.drawImage(t, ...h), a && (e.globalAlpha *= Gs, e.drawImage(t, ...h)), e.restore(), e.strokeStyle = "#191816", e.lineWidth = 1.2, e.stroke(l), e.restore();
}
const fi = 1.1;
function Is(e) {
  return !e.setSymbol && ["m19", "m20", "m21"].includes(e.setCode?.toLowerCase() ?? "");
}
function Bs(e, t, r, a, s, n, o, i, l = 1) {
  const d = !r || r === "common", c = document.createElement("canvas"), h = 2, m = 4;
  c.width = Math.ceil((n + h * 2) * m), c.height = Math.ceil((o + h * 2) * m);
  const u = c.getContext("2d");
  u.scale(m, m), u.translate(h, h), u.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    0,
    0,
    n,
    o
  ), u.globalCompositeOperation = "source-in";
  const g = r === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : r === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], p = u.createLinearGradient(0, o * 0.65, n, o * 0.35);
  p.addColorStop(0, g[0]), p.addColorStop(0.35, g[1]), p.addColorStop(0.6, g[2]), p.addColorStop(1, g[3]), u.fillStyle = d ? "#111111" : p, u.fillRect(0, 0, n, o), u.beginPath(), u.moveTo(n * 0.046, 0), u.lineTo(n * 0.953, 0), u.bezierCurveTo(
    n * 1.016,
    o * 0.38,
    n * 1.016,
    o * 0.62,
    n * 0.953,
    o
  ), u.lineTo(n * 0.046, o), u.bezierCurveTo(-n * 0.017, o * 0.62, -n * 0.017, o * 0.38, n * 0.046, 0), u.closePath(), u.globalCompositeOperation = "destination-over", u.fillStyle = d ? "#f8f8f5" : "#111111", u.fill(), u.globalCompositeOperation = "source-over", u.strokeStyle = d ? "#f8f8f5" : "#111111", u.lineWidth = l, u.stroke(), e.drawImage(
    c,
    a - h,
    s - h,
    c.width / m,
    c.height / m
  ), c.width = c.height = 0;
}
const ze = (e) => [
  e[0] * v,
  e[1] * j,
  e[2] * v,
  e[3] * j
];
function bi(e, t, r, a, s) {
  const n = Pt(t);
  if (!n) throw Error("Missing replacement frame family.");
  const o = (A) => {
    const z = r.get(A);
    if (!z) throw Error(`Replacement frame asset unavailable: ${A}`);
    return z;
  }, { rects: i } = n, l = t.frameAssetFamily === "eighth";
  if (e.save(), e.fillStyle = Re(t.setCode, t.borderColor).border, e.fillRect(0, 0, v, j), a && e.drawImage(a, 0, 0, v, j), Ce(e, t, r, ze(i.art), s), s === "artwork") {
    e.restore();
    return;
  }
  if (e.drawImage(o(n.frame), 0, 0, v, j), n.rightFrame) {
    const A = document.createElement("canvas");
    A.width = 732, A.height = 1020;
    const z = A.getContext("2d");
    z.drawImage(o(n.rightFrame), 0, 0, A.width, A.height);
    const L = document.createElement("canvas");
    L.width = A.width, L.height = A.height;
    const ie = L.getContext("2d"), te = (de, ce) => {
      const se = ie.createLinearGradient(L.width * de, 0, L.width * ce, 0);
      return se.addColorStop(0, "#0000"), se.addColorStop(1, "#000"), se;
    };
    ie.fillStyle = te(0.47, 0.53), ie.fillRect(0, 0, L.width, L.height);
    const $e = l ? [0.08, 0.627, 0.84, 0.29] : [0.071, 0.629, 0.858, 0.294], [Ue, Ge, Se, We] = $e, le = Ue * L.width, D = Ge * L.height, _ = Se * L.width, Y = We * L.height;
    ie.clearRect(le, D, _, Y), ie.fillStyle = te(0.27, 0.73), ie.fillRect(le, D, _, Y), z.globalCompositeOperation = "destination-in", z.drawImage(L, 0, 0), e.drawImage(A, 0, 0, v, j), A.width = A.height = 0, L.width = L.height = 0;
  }
  const d = Re(t.setCode, t.borderColor);
  if (d.border !== "#090806") {
    const A = document.createElement("canvas");
    A.width = 732, A.height = 1020;
    const z = A.getContext("2d");
    z.drawImage(o(n.border), 0, 0, A.width, A.height), z.globalCompositeOperation = "source-in", z.fillStyle = d.border, z.fillRect(0, 0, A.width, A.height), e.drawImage(A, 0, 0, v, j), A.width = A.height = 0;
  }
  e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const c = $t(t), h = l ? "CardRenderer MTG Matrix" : "CardRenderer MTG Beleren", [m, u, g, p] = ze(i.title), w = t.manaSymbols ?? [], { size: f } = n.mana, y = n.mana.gap + (c?.spacing ?? 0), b = n.mana.right * v, k = w.length * f + Math.max(0, w.length - 1) * y, S = [
    b - k,
    n.mana.center * j - f / 2,
    k,
    f
  ], R = De(S, c);
  e.font = `bold ${n.titleSize}px "${h}", Georgia`, e.save(), l && e.translate(...Er(t, "eighth")), Q(
    e,
    t.name,
    m,
    u + p / 2,
    w.length ? R[0] - m - 8 : g,
    n.titleSize,
    !0,
    1,
    h
  ), e.restore(), Ke(e, S, c, () => {
    w.forEach(
      (A, z) => Z(
        e,
        A,
        b - k + z * (f + y),
        n.mana.center * j - f / 2,
        f,
        r,
        !0,
        c
      )
    );
  });
  const C = ee(t), T = r.get(C ?? ""), M = Ee(t), G = T ? Math.min(
    n.symbol.width * v / (T.width * M[2]),
    n.symbol.height * j / (T.height * M[3])
  ) : 0, x = T ? T.width * M[2] * G : 0, W = T ? T.height * M[3] * G : 0, I = po(t, C, [
    n.symbol.right * v - x,
    n.symbol.center * j - W / 2,
    x,
    W
  ]), F = De(I, t.symbolAdjustment?.set), [$, V, ae, ue] = ze(i.type);
  if (e.font = `bold ${n.typeSize}px "${h}", Georgia`, Q(
    e,
    t.typeLine ?? "",
    $,
    V + ue / 2,
    T ? F[0] - $ - 7 : ae,
    n.typeSize,
    !0,
    1,
    h
  ), Ke(e, I, t.symbolAdjustment?.set, () => {
    if (T) {
      const A = ys(t);
      ke(C) || t.setSymbol ? e.drawImage(T, ...I) : Is(t) ? Bs(e, T, t.rarity, ...I, M, 1.5) : A ? ks(e, T, A, t.rarity, ...I, M, !1) : Te(e, T, t.setCode, t.rarity, ...I, M);
    }
  }), me(e, ds(e, t), r), t.power != null && t.toughness != null && e.drawImage(o(n.pt), ...ze(i.stats)), l) {
    c0(e, t, r), e.restore();
    return;
  }
  if (t.power != null && t.toughness != null) {
    const [A, z, L, ie] = ze(i.stats);
    e.font = `bold 25px "${h}", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(`${t.power}/${t.toughness}`, A + L * 0.52, z + ie * 0.52, L * 0.85);
  }
  const [N, X, je] = ze(i.footer);
  e.textAlign = "left", e.textBaseline = "top", e.fillStyle = "#fff", e.font = `12px "${h}", Georgia`, e.fillText(t.artist ?? "", N, X, je), t.legalText && (e.font = '9px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, N, X + 15, je)), e.restore();
}
let ba = null;
function wi(e) {
  return e.frameAssetFamily !== "eighth" ? Promise.resolve() : ba ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 29px "CardRenderer MTG Matrix Small Caps"')
  ]).then((t) => {
    if (t.some((r) => !r.length || r.some((a) => a.status !== "loaded")))
      throw Error("Replacement Eighth Edition frames need card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw ba = null, t;
  });
}
function yi(e, t, [r, a, s, n]) {
  const o = t.height * s / t.width;
  e.save(), e.beginPath(), e.rect(r, a, s, n / 2), e.clip(), e.drawImage(t, r, a + n - o + 1, s, o), e.restore();
}
function ki(e, [t, r, a, s], n) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(n)) return;
  e.save(), e.shadowColor = "transparent";
  const o = e.createLinearGradient(t, 0, t + a, 0);
  o.addColorStop(0, "rgba(255,255,255,0)"), o.addColorStop(0.025, "rgba(255,255,255,0.2)"), o.addColorStop(0.975, "rgba(255,255,255,0.2)"), o.addColorStop(1, "rgba(255,255,255,0)"), e.fillStyle = o, e.fillRect(t, r + s - 4, a, 2.3), e.restore();
}
const Si = "symbol-svg-v3", vi = { "m15-u": { sha256: "bfd962ff9640a846e5690d76c0fe88324e9d49cb6771744b5ab8f34f7afe7362", recipe: "m15" }, "m15-r": { sha256: "933756b97cebe7389ff7cee219a34b1ac13bc504743a2be037a286ee5ffc4b0d", recipe: "m15" }, "m15-m": { sha256: "6e9f87473f1ed8ecb05647fbde6f13e22faeab18fe56b8f76cfa1759bb4210e7", recipe: "m15" }, "8ed-u": { sha256: "6c20e8da28fdd5cdb030814e5c1339978f276c77f4ad9d99ca816adb8d970880", recipe: "8ed" }, "8ed-r": { sha256: "eccde74c56b4810434ecdf4e99206046d6970ea601e4fed2f73eb2ee855053a2", recipe: "8ed" }, "9ed-u": { sha256: "acb7ea7f3422f50dca2aef4e07aa3977aa1641ff2cb54f6eb64ae1bc17abbf53", recipe: "9ed" }, "9ed-r": { sha256: "c1cbcc1aea4f032c5f2ccf7f1d63073813bf9c6f050ba2f5385170ff3deca8a5", recipe: "9ed" }, "7ed-u": { sha256: "94c67d433ba3012f3aa1c494a7ef0ae1e7de58ce4614dfd50ee8f52de527d7e4", recipe: "white-outer-rim" }, "7ed-r": { sha256: "8b30917e85b2c9c3549bfa6c2f62261801df33ff7debcc138bf89c4a9ba9689f", recipe: "white-outer-rim" } }, xs = {
  revision: Si,
  sources: vi
}, wa = `${P}/img/setSymbols/official/`, ya = xs.sources;
function As(e) {
  if (!e.startsWith(wa) || !e.endsWith(".svg")) return;
  const t = e.slice(wa.length, -4);
  return Object.hasOwn(ya, t) ? ya[t] : void 0;
}
function Ri(e) {
  return !!As(e);
}
async function Ci(e, t) {
  const r = As(e);
  if (!r) return t;
  const a = await t.arrayBuffer();
  if ([...new Uint8Array(await crypto.subtle.digest("SHA-256", a))].map((h) => h.toString(16).padStart(2, "0")).join("") !== r.sha256) throw Error(`Unexpected pinned symbol checksum: ${e}`);
  const o = new DOMParser().parseFromString(new TextDecoder().decode(a), "image/svg+xml"), i = o.documentElement, l = [...i.querySelectorAll("path")], d = i.querySelector("linearGradient, radialGradient");
  if (i.localName !== "svg" || o.querySelector("parsererror") || !d)
    throw Error(`Unexpected pinned symbol SVG: ${e}`);
  const c = (h, m) => {
    for (const [u, g] of Object.entries(m)) h.setAttribute(u, g);
  };
  if (r.recipe === "white-outer-rim") {
    if (l.length !== 3) throw Error("Unexpected rimmed symbol topology.");
    l[0].setAttribute("fill", "#fff");
  } else if (r.recipe === "m15") {
    if (l.length !== 6) throw Error("Unexpected M15 path topology.");
    c(l[0], { fill: `url(#${d.id})`, stroke: "#000", "stroke-width": "8" });
    for (const h of l.slice(1)) h.setAttribute("fill", "#000");
  } else if (r.recipe === "8ed" || r.recipe === "9ed") {
    if (l.length !== 4) throw Error("Unexpected numeric shield path topology.");
    const h = l[2], m = h.parentElement?.getAttribute("transform");
    if (!m) throw Error("Missing numeric shield coordinate transform.");
    if (l[0].setAttribute("fill", "#000"), l[3].setAttribute("fill", "#000"), r.recipe === "9ed") {
      const u = d.cloneNode(!0);
      c(u, {
        id: "glint-root-metal",
        gradientTransform: `${m} ${d.getAttribute("gradientTransform") ?? ""}`
      }), d.after(u), c(l[3], {
        stroke: "url(#glint-root-metal)",
        "stroke-width": "12",
        "paint-order": "stroke fill"
      });
    }
  } else throw Error(`Unknown symbol SVG patch recipe: ${r.recipe}`);
  return i.setAttribute("data-card-glint-patch", xs.revision), new Blob([new XMLSerializer().serializeToString(o)], { type: "image/svg+xml" });
}
const Be = /* @__PURE__ */ new Map();
function Ls(e) {
  if (!(!e.retired || e.users)) {
    if (!e.sources) {
      e.controller.abort();
      return;
    }
    URL.revokeObjectURL(e.sources.original), e.sources.backing && URL.revokeObjectURL(e.sources.backing), e.sources = void 0;
  }
}
function qi() {
  for (const e of Be.values())
    e.retired = !0, Ls(e);
  Be.clear();
}
async function Mi(e, t) {
  t.throwIfAborted();
  let r = Be.get(e);
  if (!r) {
    const l = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const d = await fetch(e, { mode: "cors", signal: l.controller.signal });
        if (!d.ok) throw Error(`Symbol source ${d.status}: ${e}`);
        const c = await Ci(e, await d.blob()), h = await Bo(e, c);
        l.controller.signal.throwIfAborted();
        const m = URL.createObjectURL(c);
        try {
          const u = { original: m, backing: h ? URL.createObjectURL(h) : void 0 };
          return l.sources = u, u;
        } catch (u) {
          throw URL.revokeObjectURL(m), u;
        }
      })
    };
    l.promise = l.promise.catch((d) => {
      throw Be.get(e) === l && Be.delete(e), d;
    }), Be.set(e, l), r = l;
  }
  r.users++;
  const a = r;
  let s = !1;
  const n = () => {
    s || (s = !0, a.users--, !a.users && !a.sources && (a.retired = !0, Be.get(e) === a && Be.delete(e)), Ls(a));
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
async function Ti(e, t) {
  t.throwIfAborted();
  const r = [...new Set(e.filter((l) => !!l))], a = [], s = /* @__PURE__ */ new Map(), n = () => {
    for (const l of a) l.release();
    a.length = 0;
  }, i = (await Promise.allSettled(
    r.map(async (l) => {
      if (!Io(l) && !Ri(l)) {
        s.set(l, l);
        return;
      }
      const d = await Mi(l, t);
      a.push(d), s.set(l, d.sources.original), d.sources.backing && s.set(Ss(l), d.sources.backing);
    })
  )).find((l) => l.status === "rejected");
  if (i?.status === "rejected")
    throw n(), i.reason;
  return t.aborted && (n(), t.throwIfAborted()), { urls: [...new Set(s.values())], aliases: s, dispose: n };
}
function ji(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const [a, s] of e) {
    const n = t.get(s);
    n && r.set(a, n);
  }
  return r;
}
async function Gi(e, t) {
  return t.throwIfAborted(), fetch(e, { signal: t, mode: "cors" });
}
function Ii(e) {
  if (e.startsWith(`${P}/img/frames/m15/holoStamps/`) || e.startsWith(P) && /\/saga\/(sagaChapter|sagaDivider|sagaMidStripe|stamp)\.png$/.test(e))
    return;
  if (e.startsWith(`${P}/data/images/cardImages/saga/`)) return 768;
  if (e.startsWith(`${P}/img/frames/`) && e.endsWith(".png"))
    return /\/pt\/|\/m15PT/.test(e) ? 256 : 768;
  if (e.startsWith(`${Ve}/img/frames/`) && e.endsWith(".png")) return 768;
  const t = e.startsWith(`${Xe}/img/`) ? e.slice(`${Xe}/img/`.length) : "";
  return t === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    t
  ) ? 768 : void 0;
}
async function Bi(e) {
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
async function xi(e, t, r) {
  if (t.throwIfAborted(), !e.type.includes("svg"))
    return r ? createImageBitmap(e, { resizeWidth: r, resizeQuality: "high" }) : createImageBitmap(e);
  const a = URL.createObjectURL(await Bi(e)), s = new Image(), n = document.createElement("canvas"), o = () => {
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
async function Es(e, t) {
  const r = await Ti(e, t), a = r.urls, s = /* @__PURE__ */ new Map();
  let n = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, a.length) }, async () => {
        for (; n < a.length && !t.aborted; ) {
          const i = a[n++];
          try {
            const l = await Gi(i, t);
            if (!l.ok) continue;
            const d = await l.blob(), c = await xi(d, t, Ii(i));
            t.aborted ? c.close() : s.set(i, c);
          } catch {
          }
        }
      })
    );
  } finally {
    r.dispose();
  }
  const o = ji(r.aliases, s);
  return {
    images: o,
    dispose: () => {
      for (const i of s.values()) i.close();
      s.clear(), o.clear();
    }
  };
}
function $s(e) {
  if (Tr(e))
    return [
      ...ss(e),
      e.illustration,
      ee(e),
      ...ve(e),
      ...ve(at(e))
    ];
  if (Wt(e))
    return [
      ...rs(e),
      e.illustration,
      ee(e),
      ...ve(e),
      ...ve(e.faces[1])
    ];
  if (ut(e))
    return [
      ...Un(e),
      ...fe(e).flatMap((o) => [
        o.face.illustration,
        ...ve(o.face)
      ]),
      ee(fe(e)[0].face)
    ];
  const t = Me(e);
  if (t)
    return [
      ...fe(e).flatMap((o, i) => [
        ...x0(o.face, t, Ze(e) && t === "eighth", i),
        o.face.illustration,
        ee(o.face),
        ...ve(o.face)
      ]),
      ...t === "eighth" && Ze(e) ? P0(e) : []
    ];
  const r = h0(e);
  if (r) return [...r, e.illustration, ee(e), ...ve(e)];
  if (oe(e)) return Tn(e);
  if (re(e) === "saga")
    return [...zn(e), e.illustration, ee(e), ...ve(e)];
  const a = fe(e);
  if (a.length) return a.flatMap((o) => $s(o.face));
  const s = q(e), n = At(s, re(e));
  return [
    ...ri(e),
    n.background,
    n.frame,
    n.boxes,
    n.pt,
    js(e, s.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(re(e)) ? ft(e).flatMap(
      (o) => o.badges.map((i) => Ts(re(e), i))
    ) : [],
    s.legendary ? n.crown : null,
    e.illustration,
    ee(e),
    ...ve(e)
  ];
}
let ka = null;
function Sa() {
  return ka ??= Promise.all([
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
    throw ka = null, e;
  });
}
function vt(e) {
  return be(e).art;
}
const va = /* @__PURE__ */ new WeakMap(), Rt = ([e, t, r, a]) => [e, 1 - t - a, e + r, 1 - t], Ai = [Rt(be({}).art), [0, 0, 0, 0]];
function Xi(e) {
  if (!e) return Ai;
  const t = va.get(e);
  if (t) return t;
  const r = fe(e), a = r.length ? [
    Rt(na(r[0], vt(r[0].face))),
    Rt(na(r[1], vt(r[1].face)))
  ] : [Rt(vt(e)), [0, 0, 0, 0]];
  return va.set(e, a), a;
}
async function Li(e, t, r, a, s, n, o = Es, i) {
  return Ws(e, t, r, a, {
    threshold: s,
    resolveEtching: i,
    beforePaint: n,
    loadImages: o,
    height: j
  });
}
async function Ws(e, t, r, a, s) {
  const { threshold: n, beforePaint: o, loadImages: i, height: l } = s, d = fe(t);
  if (d.length) {
    for (const k of d)
      e.save(), gs(e, k), await Ws(e, k.face, r, a, {
        ...s,
        height: k.height * v / k.width
      }), e.restore();
    return;
  }
  if (t.illustration && s.resolveEtching) {
    let k;
    try {
      const S = await s.resolveEtching(t, r, a, n, o);
      k = await i([S, t.illustration], a);
      const R = k.images.get(S ?? "");
      if (R && !a.aborted) {
        await o?.(), a.throwIfAborted();
        const [C, T, M, G] = be(t).art, x = C * v, W = T * l, I = M * v, F = G * l, $ = k.images.get(t.illustration) ?? R;
        e.save(), e.beginPath();
        const V = vt(t);
        if (e.rect(
          V[0] * v,
          V[1] * l,
          V[2] * v,
          V[3] * l
        ), e.clip(), e.imageSmoothingQuality = "low", t.illustrationCrop) {
          const ae = t.illustrationCrop, ue = It($.width * ae[2], $.height * ae[3], [
            x,
            W,
            I,
            F
          ]);
          e.drawImage(
            R,
            ae[0] * R.width,
            ae[1] * R.height,
            ae[2] * R.width,
            ae[3] * R.height,
            ...ue
          );
        } else
          e.drawImage(
            R,
            ...It($.width, $.height, [x, W, I, F])
          );
        e.restore();
      }
    } catch {
    } finally {
      k?.dispose();
    }
  }
  if (a.throwIfAborted(), !t.setCode) return;
  const [c, h, m, u] = be(t).stamp, g = c * v, p = h * l, w = m * v, f = u * l, y = ee(t, "common"), b = await i([y], a);
  try {
    await o?.(), a.throwIfAborted();
    const k = y ? b.images.get(y) : null;
    if (e.save(), e.globalAlpha = 0.68, k) {
      const S = Math.min(w / k.width, f / k.height);
      e.drawImage(
        k,
        g + (w - k.width * S) / 2,
        p + (f - k.height * S) / 2,
        k.width * S,
        k.height * S
      );
    } else
      e.translate(g, p), e.scale(w / 100, f / 100), e.fillStyle = "white", e.fill(new Path2D(Qs)), e.font = "bold 43px Georgia", e.textAlign = "center", e.textBaseline = "alphabetic", e.fillText(rn(t.setCode), 50, 65);
    e.restore();
  } finally {
    b.dispose();
  }
}
function Ei(e) {
  return e.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const $i = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, Ra = /* @__PURE__ */ new WeakMap();
function Wi(e, t) {
  let r = Ra.get(t);
  if (r || (r = new Path2D(t.path), Ra.set(t, r)), e.save(), t.viewBox) {
    const [a, s, n, o] = t.viewBox;
    e.scale(24 / n, 24 / o), e.translate(-a, -s);
  }
  t.transform && e.transform(...t.transform), t.filled ? (e.fillStyle = e.strokeStyle, e.fill(r)) : e.stroke(r), e.restore();
}
function Ca(e, t, r, a, s = !1) {
  const n = v * 0.105, o = v * 0.015, i = Math.floor(v * 0.9 / (n + o));
  if (t.forEach((u, g) => {
    e.save(), e.translate(
      v * 0.05 + g % i * (n + o),
      j * 0.13 + Math.floor(g / i) * (n + o)
    ), e.fillStyle = "#17201fed", e.strokeStyle = "#c6af7977", e.lineWidth = 1, e.beginPath(), e.arc(n / 2, n / 2, n / 2, 0, Math.PI * 2), e.fill(), e.stroke(), e.translate(n * 0.14, n * 0.14), e.scale(n * 0.72 / 24, n * 0.72 / 24), e.strokeStyle = "#f3e9cf", e.lineWidth = 1.8, e.lineCap = "round", e.lineJoin = "round", Wi(e, u), e.restore();
  }), r?.power == null || r.toughness == null) return;
  e.save();
  const l = $i[s ? "inspect" : "table"], d = v * l.width, c = j * l.height, h = v * (1 - l.right - l.width), m = j * (1 - l.bottom - l.height);
  a ? e.drawImage(a, h, m, d, c) : (e.fillStyle = "#eee5cf", e.strokeStyle = "#746854", e.lineWidth = 2, e.beginPath(), e.roundRect(
    h + d * (s ? 0.14 : 0.1),
    m + c * (s ? 0.19 : 0.18),
    d * (s ? 0.72 : 0.8),
    c * (s ? 0.62 : 0.64),
    c * 0.12
  ), e.fill(), e.stroke()), e.font = `bold ${v * (s ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
    `${r.power}/${r.toughness}`,
    h + d / 2,
    s ? m + c / 2 - v * 0.01 : m + c * 0.48,
    d * 0.72
  ), e.restore();
}
function Ji(e) {
  return e.currentStats?.power != null && e.currentStats.toughness != null && e.statusLayout !== "inspect" ? { ...e, statusLayout: "inspect" } : e;
}
function Vi(e, t) {
  if (e.custom)
    return JSON.stringify([
      "custom-face-v1",
      e.custom.key,
      t,
      e.layer ?? "face",
      e.layer === "etching" ? e.etchThreshold ?? 20 : null
    ]);
  const r = e.face, a = Os(r, e.layer === "etching"), s = e.currentStats?.power != null && e.currentStats.toughness != null ? [e.currentStats.power, e.currentStats.toughness] : null;
  return JSON.stringify([
    Xe,
    P,
    "canvas-face-v102",
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
function Os(e, t) {
  const r = fe(e);
  return r.length ? [
    e.layout,
    e.artist ?? null,
    e.collectorNumber ?? null,
    e.legalText ?? null,
    e.borderColor ?? null,
    r.map((a) => [a.x, a.y, a.width, a.height, a.rotation, Os(a.face, t)]),
    !t && Ar(e),
    !t && Ha(e)
  ] : t ? [
    e.illustration ?? null,
    e.etchedIllustration ?? null,
    e.illustrationCrop ?? null,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    be(e)
  ] : [
    oe(e) ? [Ae(e), ye(e)] : null,
    e.borderColor ?? null,
    e.frameAssetFamily ?? null,
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
    ai(e),
    e.artist ?? null,
    e.watermark ?? null,
    e.collectorNumber ?? null,
    e.collectorFormat ?? null,
    e.legalText === void 0 ? ["default"] : e.legalText,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    e.rarity ?? "common",
    e.power ?? null,
    e.toughness ?? null,
    e.loyalty ?? null,
    e.reverseStats ?? null,
    e.layout ?? null,
    be(e),
    q(e)
  ];
}
function Oi(e) {
  const t = document.createElement("canvas");
  return t.width = e === "table" ? 244 : 732, t.height = e === "table" ? 340 : 1020, t;
}
async function Ki(e, t, r, a) {
  if (Gn(e.face), e.custom)
    return await a?.beforePaint?.(), r.throwIfAborted(), e.custom.compose(t, r, e.layer ?? "face", e.etchThreshold);
  const s = a?.loadImages ?? Es, n = Oi(t);
  try {
    const o = n.getContext("2d", {
      willReadFrequently: !!a?.cpuPixels
    });
    if (!o) throw new Error("Card composition needs Canvas2D.");
    if (o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "high", o.scale(n.width / v, n.height / j), e.layer === "etching")
      return await Li(
        o,
        e.face,
        e.printingId,
        r,
        e.etchThreshold,
        a?.beforePaint,
        s,
        a?.resolveEtching
      ), n;
    o.fillStyle = "#090806", o.fillRect(0, 0, v, j);
    const i = e.currentStats?.power != null && e.currentStats.toughness != null ? At(q(e.face)).pt : null;
    if (e.printedImage) {
      const m = t === "inspect" ? Ei(e.printedImage) : e.printedImage;
      i && await (a?.loadFonts ?? Sa)();
      const u = await s(i ? [m, i] : [m], r);
      try {
        const g = u.images.get(m);
        if (g && !r.aborted)
          return await a?.beforePaint?.(), r.throwIfAborted(), o.drawImage(g, 0, 0, v, j), Ca(
            o,
            e.emblems ?? [],
            e.currentStats,
            i ? u.images.get(i) : void 0,
            e.statusLayout === "inspect" || t === "inspect"
          ), Ma(o, e.face), n;
      } finally {
        u.dispose();
      }
    }
    await Promise.all([
      (a?.loadFonts ?? Sa)(),
      Me(e.face) ? H0(e.face) : wi(e.face),
      re(e.face) === "saga" ? J0() : Promise.resolve(),
      Wt(e.face) || Tr(e.face) ? hs() : Promise.resolve(),
      oe(e.face) || Me(e.face) === "old" || Lt(e.face, "W") === "historic-font" ? (a?.loadRetroFont ?? Zo)() : Promise.resolve()
    ]), r.throwIfAborted();
    const l = await s($s(e.face), r);
    let d, c, h;
    try {
      return e.paintLayer !== "artwork" && (d = await lo(e.face, l.images, r)), e.paintLayer !== "artwork" && (c = await uo(e.face, d?.images ?? l.images, r)), h = await Ln(
        e.face,
        c?.images ?? d?.images ?? l.images,
        r
      ), await a?.beforePaint?.(), r.throwIfAborted(), Ps(
        o,
        e.face,
        h.images,
        j,
        !1,
        a?.underArt,
        e.paintLayer
      ), Ca(
        o,
        e.emblems ?? [],
        e.currentStats,
        i ? l.images.get(i) : void 0,
        e.statusLayout === "inspect" || t === "inspect"
      ), Ma(o, e.face), n;
    } finally {
      h?.dispose(), c?.dispose(), d?.dispose(), l.dispose();
    }
  } catch (o) {
    throw n.width = n.height = 0, o;
  }
}
function Ma(e, t) {
  e.save(), e.setTransform(
    e.canvas.width / v,
    0,
    0,
    e.canvas.height / j,
    0,
    0
  ), e.globalCompositeOperation = "destination-in", e.globalAlpha = 1, e.shadowColor = "transparent", e.filter = "none", e.fillStyle = "#000", e.beginPath(), e.roundRect(0, 0, v, j, bo(t) * v), e.fill(), e.restore();
}
function Ps(e, t, r, a = j, s = !1, n, o) {
  if (Tr(t)) {
    I0(e, t, r, n, o);
    return;
  }
  if (Wt(t)) {
    v0(e, t, r, n, o);
    return;
  }
  if (ut(t)) {
    K0(e, t, r, n, o);
    return;
  }
  if (Me(t)) {
    Y0(e, t, r, n, o);
    return;
  }
  if (t.frameAssetFamily) {
    bi(e, t, r, n, o);
    return;
  }
  if (oe(t)) {
    Jo(e, t, r, n, o);
    return;
  }
  if (re(t) === "saga") {
    X0(e, t, r, n, o);
    return;
  }
  const i = fe(t);
  if (i.length) {
    e.fillStyle = Re(t.setCode, t.borderColor).border, e.fillRect(0, 0, v, j);
    for (const B of i)
      e.save(), gs(e, B), Ps(
        e,
        B.face,
        r,
        B.height * v / B.width,
        !0,
        n,
        o
      ), e.restore();
    if (o === "artwork") return;
    Ta(e, t), Ar(t) && (e.font = '14px "CardRenderer MTG MPlantin", Georgia', e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      v / 2,
      j - 12,
      v * 0.9
    ));
    return;
  }
  const l = (B) => [
    B[0] * v,
    B[1] * a,
    B[2] * v,
    B[3] * a
  ];
  e.fillStyle = Re(t.setCode, t.borderColor).border, e.fillRect(0, 0, v, a);
  const d = be(t), c = re(t);
  if (o === "artwork") {
    Ce(e, t, r, l(d.art), o);
    return;
  }
  const h = q(t), m = At(h, c), g = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[h.boxes] ?? "#827d72", p = (B, U, ne = "top") => {
    const Fe = r.get(B);
    if (!Fe) return !1;
    const [nt, Ut, Ft, _t] = l(U);
    e.save(), e.beginPath(), e.rect(nt, Ut, Ft, _t), e.clip();
    const Ur = ne === "stretch" ? _t : Fe.height * Ft / Fe.width;
    return e.drawImage(
      Fe,
      nt,
      ne === "bottom" ? Ut + _t - Ur : Ut,
      Ft,
      Ur
    ), e.restore(), !0;
  }, [w, f, y, b] = l(h.legendary ? d.legendaryBackground : d.background);
  if (e.save(), e.beginPath(), e.roundRect(w, f, y, b, [
    { x: y * 0.01282, y: b * 962e-5 },
    { x: y * 0.01282, y: b * 962e-5 },
    { x: y * 0.06838, y: b * 0.05128 },
    { x: y * 0.06838, y: b * 0.05128 }
  ]), e.clip(), s) {
    const B = g.slice(1).match(/../g).map(
      (U, ne) => Math.round(parseInt(U, 16) * 0.62 + [244, 236, 217][ne] * 0.38)
    );
    e.fillStyle = `rgb(${B.join(",")})`, e.fillRect(w, f, y, b);
  }
  const k = r.get(m.background), S = c.startsWith("planeswalker");
  if (k && S ? fa(e, k, w, f, y, c === "planeswalker-large") : k ? e.drawImage(
    k,
    w,
    f + (h.legendary ? E.legendaryBackgroundLift : 0),
    y,
    s ? b : k.height * y / k.width
  ) : (e.fillStyle = g, e.fillRect(w, f, y, b)), e.restore(), e.fillStyle = "#e3d8bb", !r.has(m.frame))
    if (c === "adventure")
      for (const B of Dt(t).filter((U) => U.kind === "rules" && !U.color))
        e.fillRect(B.x, B.y, B.width, B.height);
    else e.fillRect(...l(d.rules));
  r.has(m.boxes) || (e.fillRect(...l(d.title)), e.fillRect(...l(d.type))), e.fillStyle = "#80745c", S || e.fillRect(...l(d.art));
  const R = r.get(m.frame);
  if (R && c === "normal" && !s) {
    const B = ns(t);
    ko(
      e,
      h,
      B,
      () => ja(e, R, h.legendary, d.frame, !0, B)
    ), yo(e, h, B);
  }
  if (n && (e.save(), e.beginPath(), e.rect(0, 0, v, a), e.clip(), e.resetTransform(), e.drawImage(n, 0, 0, e.canvas.width, e.canvas.height), e.restore()), c === "normal" && !s) {
    const [B, U, ne, Fe] = l(d.art), nt = ht.artRim;
    e.fillStyle = "#090806", e.fillRect(B - nt, U, ne + 2 * nt, Fe);
  }
  if (Ce(e, t, r, l(d.art), o), S && mi(e, t), R && S) {
    const [B, U, ne] = l(d.frame);
    fa(e, R, B, U, ne, c === "planeswalker-large");
  } else R && c !== "normal" && ja(e, R, h.legendary, d.frame);
  if (h.legendary && p(m.crown, d.crown), s) {
    const B = r.get(m.boxes);
    if (B) {
      const ne = B.height * 0.104;
      e.drawImage(B, 0, 0, B.width, ne, ...l(d.title)), e.drawImage(B, 0, B.height - ne, B.width, ne, ...l(d.type));
    }
    const U = r.get(m.frame);
    e.fillStyle = "#e3d8bb", e.fillRect(...l(d.rules)), U && e.drawImage(
      U,
      U.width * 0.035,
      U.height * 0.675,
      U.width * 0.93,
      U.height * 0.325,
      ...l(d.rules)
    );
  } else {
    const B = S && ["Colourless", "Artifact", "Land"].includes(h.boxes);
    p(m.boxes, d.title), B && (e.save(), e.globalAlpha *= Gs, p(m.boxes, d.title), e.restore());
    const U = r.get(m.boxes);
    S && U ? pi(e, U, d.type, B) : (p(m.boxes, d.type, "bottom"), c === "normal" && U && (yi(e, U, l(d.type)), ki(e, l(d.type), h.boxes)));
  }
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left";
  const [C, T, M, G] = l(d.title), x = C + E.plateLeft + (c === "normal" ? 1 : 0), W = $t(t), I = E0(t), F = t.manaSymbols ?? [], $ = E.manaSize * I, V = E.manaGap + (W?.spacing ?? 0), ae = F.length * $ + Math.max(0, F.length - 1) * V, ue = C + M - E.plateRight, N = ue - ae, X = [
    N,
    T + G / 2 - $ / 2 + E.manaLift / 2,
    ae,
    $
  ], je = F.length ? De(X, W) : X, A = (c === "normal" && !s ? E.normalTitleFont : E.titleFont) * I;
  e.font = `bold ${A}px "CardRenderer MTG Beleren", Georgia`, e.letterSpacing = `${E.titleTracking}px`, e.save(), c === "normal" && !s && e.translate(...Er(t, "modern")), Q(
    e,
    t.name,
    x,
    T + G / 2 + (c === "normal" ? 1 : 0),
    je[0] - x - (F.length ? E.titleGap : 0),
    A,
    !0
  ), e.restore(), e.letterSpacing = "0px", Ke(e, X, W, () => {
    F.forEach(
      (B, U) => Z(
        e,
        B,
        N + U * ($ + V),
        T + G / 2 - $ / 2 + E.manaLift / 2,
        $,
        r,
        !0,
        W
      )
    );
  });
  const z = ee(t), L = r.get(z ?? ""), ie = ke(z), te = Ee(t), $e = Is(t), Ue = ys(t), Ge = $e && c === "normal", Se = Ge ? fi : 1, We = E.setMargin + (Ge ? 2 : 0), [, le, , D] = l(d.type), _ = le + D / 2 + E.typeLift / 2 + (c === "normal" || S ? 2 : 0), Y = L ? Math.min(
    E.setMaxWidth,
    E.setHeight * L.width * te[2] / (L.height * te[3])
  ) : 0, de = L ? Math.min(
    Y / (L.width * te[2]),
    E.setHeight / (L.height * te[3])
  ) : 0, ce = [
    ue - We - Y - Y * (Se - 1) / 2 + (S ? 1.5 : 0),
    _ - (L?.height ?? 0) * te[3] * de * Se / 2 - (Ge ? 1 : 0),
    (L?.width ?? 0) * te[2] * de * Se,
    (L?.height ?? 0) * te[3] * de * Se
  ], se = c === "normal" && !s ? $r(t, z, ce, "component") : ce, st = De(se, t.symbolAdjustment?.set), Ie = Math.max(
    1,
    Math.min(
      ue - x - (L ? Y * (1 + (Se - 1) / 2) + We + E.typeGap : 0),
      L && st !== ce ? st[0] - x - E.typeGap : 1 / 0
    )
  );
  e.font = `${E.typeFont * I}px "CardRenderer MTG Beleren", Georgia`, Q(
    e,
    t.typeLine ?? "",
    x + (S ? 1.5 : 0),
    _,
    Ie,
    E.typeFont * I,
    !1,
    c === "normal" && !s ? ht.typeWidthScale : 1
  ), Ke(e, se, t.symbolAdjustment?.set, () => {
    L && (ie || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(L, ...se), e.restore()) : $e ? Bs(
      e,
      L,
      t.rarity,
      ...se,
      te,
      Ge ? 1.5 : 1
    ) : Ue ? ks(
      e,
      L,
      Ue,
      t.rarity,
      ...se,
      te,
      c === "normal"
    ) : Te(
      e,
      L,
      t.setCode,
      t.rarity,
      ...se,
      te
    ));
  }), Ms(t) ? si(e, t, r) : c !== "normal" ? gi(e, t, r) : me(e, ds(e, t, a, I), r);
  const Dr = Ks(t);
  if (Dr && c !== "leveler") {
    p(m.pt, d.stats, "stretch");
    const [B, U, ne] = l(d.stats);
    e.fillStyle = c.startsWith("planeswalker") ? "white" : "#17140f", e.font = `bold ${E.statsFont}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      Dr.text,
      B + ne / 2,
      U + (c.startsWith("planeswalker") ? d.stats[3] * j / 2 : E.statsLine / 2 + (c === "normal" ? 2 : 0)),
      ne
    );
  }
  s || Ta(e, t);
}
function Ta(e, t) {
  const [r, a, s, n] = Ds(H.footer), o = a + E.footerLine;
  e.save(), e.beginPath(), e.rect(r, a, s, n), e.clip(), e.textAlign = "left", e.textBaseline = "top", e.fillStyle = Re(t.setCode, t.borderColor).ink, e.font = `${E.footerFont}px "CardRenderer MTG Relay", sans-serif`, e.letterSpacing = `${E.footerTracking}px`;
  const i = t.setCode?.trim().toUpperCase() ?? "";
  e.fillText(i, r, o);
  let l = r + e.measureText(i).width;
  e.letterSpacing = "0px", t.artist && (l += E.artistMarginLeft, e.font = `${E.footerFont}px "CardRenderer MTG Artist Credit", sans-serif`, e.fillText("a", l, o), l += e.measureText("a").width + E.artistMarginRight, e.font = `${E.footerFont * 1.154}px "CardRenderer MTG Beleren", Georgia`, e.fillText(t.artist, l, o)), e.restore();
}
function ja(e, t, r, a = H.frame, s = !1, n = 0) {
  const [o, i, l, d] = Ds(a), c = n, h = o + c, m = l - 2 * c, u = Math.min(t.height, d * t.width / l), g = u * l / t.width, p = e.getTransform().a, w = () => {
    if (!s) {
      e.drawImage(t, 0, 0, t.width, u, h, i, m, g);
      return;
    }
    const f = 424, y = 436;
    e.save(), e.beginPath(), e.rect(0, 0, v, f), e.rect(0, y, v, j - y), e.clip(), e.drawImage(t, 0, 0, t.width, u, h, i, m, g), e.restore(), e.save(), e.beginPath(), e.rect(0, f, v, y - f), e.clip(), e.drawImage(t, 0, 0, t.width, u, h, i - 1, m, g), e.restore();
  };
  e.save(), e.shadowColor = "black", e.shadowOffsetX = -394e-5 * v * p, e.shadowOffsetY = 394e-5 * v * p, e.shadowBlur = 236e-5 * v * p, w(), r || (e.shadowColor = "#ffffffa0", e.shadowOffsetX = 157e-5 * v * p, e.shadowOffsetY = -315e-5 * v * p, e.shadowBlur = 157e-5 * v * p, w()), e.restore();
}
function Ds(e) {
  return [e[0] * v, e[1] * j, e[2] * v, e[3] * j];
}
export {
  rn as $,
  bs as A,
  Zs as B,
  Qo as C,
  Ai as D,
  Qs as E,
  H as F,
  j as G,
  Pi as H,
  v as I,
  $i as J,
  Sn as K,
  cn as L,
  Ve as M,
  kn as N,
  Mn as O,
  i0 as P,
  Gt as Q,
  Xe as R,
  Ni as S,
  De as T,
  $s as U,
  Re as V,
  dt as W,
  he as X,
  u0 as Y,
  xi as Z,
  Hi as _,
  bo as a,
  un as a$,
  ri as a0,
  Dt as a1,
  ai as a2,
  Xi as a3,
  Oi as a4,
  en as a5,
  Ks as a6,
  Gi as a7,
  Pt as a8,
  h0 as a9,
  gs as aA,
  Ds as aB,
  di as aC,
  Fi as aD,
  O as aE,
  Tn as aF,
  br as aG,
  ye as aH,
  La as aI,
  Et as aJ,
  Ae as aK,
  Cn as aL,
  pr as aM,
  Hr as aN,
  ge as aO,
  Ui as aP,
  Ea as aQ,
  Yr as aR,
  Oo as aS,
  Ts as aT,
  tn as aU,
  ir as aV,
  Di as aW,
  Br as aX,
  q0 as aY,
  js as aZ,
  Ee as a_,
  Ms as aa,
  It as ab,
  Ji as ac,
  J as ad,
  Sa as ae,
  Es as af,
  Zo as ag,
  ci as ah,
  an as ai,
  ds as aj,
  Wi as ak,
  Ke as al,
  Ps as am,
  Ca as an,
  Li as ao,
  si as ap,
  Q as aq,
  Ce as ar,
  Z as as,
  mi as at,
  Jo as au,
  ls as av,
  me as aw,
  Te as ax,
  gi as ay,
  zi as az,
  ee as b,
  Bi as b0,
  Bn as b1,
  hi as b2,
  m0 as b3,
  ft as b4,
  Ar as b5,
  E0 as b6,
  xt as b7,
  Gn as b8,
  rt as b9,
  Ki as c,
  Vi as d,
  qi as e,
  be as f,
  _i as g,
  Ii as h,
  Tr as i,
  ji as j,
  E as k,
  re as l,
  oe as m,
  Je as n,
  At as o,
  na as p,
  q,
  Ti as r,
  fe as s,
  pe as t,
  fr as u,
  vt as v,
  pn as w,
  Yi as x,
  xa as y,
  io as z
};
