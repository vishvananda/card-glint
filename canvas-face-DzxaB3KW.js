const wt = "WUBRG";
function ne(e) {
  const t = e.typeLine ?? "", r = e.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(t), s = e.land ?? /(^|\s)Land(?:\s|$)/i.test(t), n = !/\bPlaneswalker\b/i.test(t) && (e.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(t)), a = e.creature ?? /(^|\s)Creature(?:\s|$)/i.test(t), o = z(e), l = o.length === 0 ? "Colourless" : o.length > 2 ? "Gold" : o.join(""), i = (r || s) && o.length === 0 ? "Artifact" : l, c = s ? "Land" : r ? "Artifact" : o.length > 1 ? "Gold" : l;
  return {
    frame: i,
    boxes: c,
    background: c,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: s && o.length > 0 ? l : r && o.length > 0 ? o.length > 1 ? "Gold" : l : c,
    pt: c,
    artifact: r,
    land: s,
    legendary: n,
    creature: a,
    className: `rendered-card-profile-${c.toLocaleLowerCase()}`
  };
}
function z(e) {
  return ja(e.frameColors ?? e.colors ?? []);
}
function ja(e) {
  return [
    ...new Set(
      e.map((t) => t.toLocaleUpperCase()).filter((t) => wt.includes(t))
    )
  ].sort((t, r) => wt.indexOf(t) - wt.indexOf(r));
}
const Pa = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", Wa = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", Da = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Fa = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", _a = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", Te = {
  RENDERER_COMPONENT_ROOT: Pa,
  KEYRUNE_ROOT: Wa,
  CONJURER_ROOT: Da,
  RETRO_ROOT: Fa,
  RETRO_SYMBOL_FONT: _a
}, Ua = { "10e": "cmrsu", "2ed": "cmrsu", "2x2": "cmrsu", "2xm": "cmrsu", "30a": "cmrsu", "3ed": "cmrsu", "40k": "cmrsu", "4ed": "cmrsu", "5dn": "cmrsu", "5ed": "cmrsu", "6ed": "cmrsu", "7ed": "cmrsu", "8ed": "cmrsu", "9ed": "cmrsu", a25: "cmrsu", acr: "cmrsu", aer: "cmrsu", afc: "cmrsu", afr: "cmrsu", akh: "cmrsu", akr: "cmrsu", ala: "cmrsu", all: "cmrsu", ana: "cmrsu", apc: "cmrsu", arb: "cmrsu", arc: "cmrsu", archie: "cmrsu", arena: "cmrsu", arn: "cmrsu", ath: "cmrsu", atq: "cmrsu", avr: "cmrsu", azorius: "cmru", bbd: "cmrsu", bfz: "cmrsu", big: "cmrsu", blb: "cmrsu", blc: "cmrsu", bng: "cmrsu", bok: "cmrsu", boros: "cmru", bot: "cmrsu", brb: "cmrsu", brc: "cmrsu", bro: "cmrsu", brr: "cmrsu", btd: "cmrsu", c13: "cmrsu", c14: "cmrsu", c15: "cmrsu", c16: "cmrsu", c17: "cmrsu", c18: "cmrsu", c19: "cmrsu", c20: "cmrsu", c21: "cmrsu", cc1: "cmrsu", cc2: "cmrsu", ced: "cmrsu", cei: "cmrsu", chk: "cmrsu", chr: "cmrsu", clb: "cmrsu", clu: "cmrsu", cm1: "cmrsu", cm2: "cmrsu", cma: "cmrsu", cmd: "cmrsu", cmm: "cmrsu", cmr: "cmrsu", cn2: "cmrsu", cns: "cmrsu", con: "cmrsu", conf: "cmrsu", csp: "cmrsu", dci: "cmrsu", dd1: "cmrsu", dd2: "cmrsu", ddc: "cmrsu", ddd: "cmrsu", dde: "cmrsu", ddf: "cmrsu", ddg: "cmrsu", ddh: "cmrsu", ddi: "cmrsu", ddj: "cmrsu", ddk: "cmrsu", ddl: "cmrsu", ddm: "cmrsu", ddn: "cmrsu", ddo: "cmrsu", ddp: "cmrsu", ddq: "cmrsu", ddr: "cmrsu", dds: "cmrsu", ddt: "cmrsu", ddu: "cmrsu", default: "cmrsu", dft: "cmrsu", dgm: "cmrsu", dimir: "cmru", dis: "cmrsu", dka: "cmrsu", dkm: "cmrsu", dmc: "cmrsu", dmr: "cmrsu", dmu: "cmrsu", dom: "cmrsu", dpa: "cmrsu", drb: "cmrsu", drc: "cmrsu", drk: "cmrsu", dsc: "cmrsu", dsk: "cmrsu", dst: "cmrsu", dtk: "cmrsu", e01: "cmrsu", e02: "cmrsu", ecc: "cmrsu", ecl: "cmrsu", eld: "cmrsu", ema: "cmrsu", emn: "cmrsu", eoc: "cmrsu", eoe: "cmrsu", eos: "cmru", eve: "cmrsu", exo: "cmrsu", exp: "cmrsu", fca: "cmrsu", fdc: "cmrsu", fdn: "cmrsu", fem: "cmrsu", fic: "cmrsu", fin: "cmrsu", fnm: "r", fra: "cmrsu", frc: "cmrsu", frf: "cmrsu", fut: "cmrsu", gn2: "cmrsu", gn3: "cmrsu", gnt: "cmrsu", golgari: "cmru", gpt: "cmrsu", grn: "cmrsu", gruul: "cmru", gs1: "cmrsu", gtc: "cmrsu", h09: "cmrsu", h17: "cmrsu", ha1: "cmrsu", hbg: "cmrsu", hml: "cmrsu", hob: "cmrsu", hoc: "cmrsu", hop: "cmrsu", hou: "cmrsu", ice: "cmrsu", idw: "cmrsu", iko: "cmrsu", ima: "cmrsu", inr: "cmrsu", inv: "cmrsu", isd: "cmrsu", izzet: "cmru", j20: "cmrsu", j21: "cmrsu", j22: "cmrsu", j25: "cmru", jmp: "cmrsu", jou: "cmrsu", jud: "cmrsu", khc: "cmrsu", khm: "cmrsu", kld: "cmrsu", klr: "cmrsu", ktk: "cmrsu", lcc: "cmrsu", lci: "cmrsu", lea: "cmrsu", leb: "cmrsu", leg: "cmrsu", lgn: "cmrsu", lrw: "cmrsu", ltc: "cmrsu", ltr: "cmrsu", m10: "cmrsu", m11: "cmrsu", m12: "cmrsu", m13: "cmrsu", m14: "cmrsu", m15: "cmrsu", m19: "cmrsu", m20: "cmrsu", m21: "cmrsu", m3c: "cmrsu", mat: "cmrsu", mb2: "cmrsu", mbc: "cmrsu", mbs: "cmrsu", mc3: "cmrsu", md1: "cmrsu", me1: "cmrsu", me2: "cmrsu", me3: "cmrsu", me4: "cmrsu", med: "cmrsu", mh1: "cmrsu", mh2: "cmrsu", mh3: "cmrsu", mic: "cmrsu", mid: "cmrsu", mir: "cmrsu", mkc: "cmrsu", mkm: "cmrsu", mm2: "cmrsu", mm3: "cmrsu", mma: "cmrsu", mmq: "cmrsu", moc: "cmrsu", mom: "cmrsu", mor: "cmrsu", mp2: "cmrsu", mps: "cmrsu", mrd: "cmrsu", msc: "cmrsu", msh: "cmrsu", mtga: "cmrsu", mtgo: "cmrsu", mul: "cmrsu", ncc: "cmrsu", nec: "cmrsu", nem: "cmrsu", neo: "cmrsu", nph: "cmrsu", ody: "cmrsu", ogw: "cmrsu", om1: "cmrsu", omb: "cmrsu", onc: "cmrsu", one: "cmrsu", ons: "cmrsu", ori: "cmrsu", orzhov: "cmru", otc: "cmrsu", otj: "cmrsu", otp: "cmrsu", p02: "cmrsu", papac: "cmrsu", parl2: "cmrsu", past: "cmrsu", pbook: "cmrsu", pc2: "cmrsu", pca: "cmrsu", pcy: "cmrsu", pd2: "cmrsu", pd3: "cmrsu", pdrc: "c", peuro: "cmrsu", pgru: "c", phpr: "cmrsu", phuk: "cmrsu", pidw: "cmrsu", pio: "cmrsu", pip: "cmrsu", planeswalker: "cmrsu", plc: "cmrsu", pls: "cmrsu", pmps: "cmrsu", por: "cmrsu", prm: "cmrsu", ps11: "cmrsu", psal: "cmrsu", psdg: "cmrsu", psum: "cmrsu", ptg: "cmrsu", ptk: "cmrsu", pvan: "c", pxbox: "cmrsu", pz1: "cmrsu", pz2: "cmrsu", pza: "cmrsu", rav: "cmrsu", ren: "cmrsu", rex: "cmrsu", rin: "cmrsu", rix: "cmrsu", rna: "cmrsu", roe: "cmrsu", rtr: "cmrsu", rvr: "cmrsu", s00: "cmrsu", s99: "cmrsu", scd: "cmrsu", scg: "cmrsu", sds: "cmrsu", selesnya: "cmru", shm: "cmrsu", simic: "cmru", sir: "cmrsu", sis: "cmrsu", sld: "cmrsu", snc: "cmrsu", soa: "cmrsu", soc: "cmrsu", soi: "cmrsu", sok: "cmrsu", som: "cmrsu", sos: "cmrsu", spe: "cmrsu", spg: "cmrsu", spm: "cmrsu", ss1: "cmrsu", ss2: "cmrsu", ss3: "cmrsu", sta: "cmrsu", star: "cmrsu", sth: "cmrsu", stx: "cmrsu", td0: "cmrsu", td2: "cmrsu", tdc: "cmrsu", tdm: "cmrsu", thb: "cmrsu", ths: "cmrsu", tla: "cmrsu", tle: "cmrsu", tlr: "c", tmc: "cmrsu", tmp: "cmrsu", tmt: "cmrsu", tor: "cmrsu", tpr: "cmrsu", trc: "cmrsu", trk: "cmrsu", tsp: "cmrsu", tsr: "cmrsu", uds: "cmrsu", ugl: "cmrsu", ulg: "cmrsu", uma: "cmrsu", und: "cmrsu", unf: "cmrsu", unh: "cmrsu", usg: "cmrsu", ust: "cmrsu", v09: "cmrsu", v10: "cmrsu", v11: "cmrsu", v12: "cmrsu", v13: "cmrsu", v14: "cmrsu", v15: "cmrsu", v16: "cmrsu", v17: "cmrsu", van: "cmrsu", vis: "cmrsu", vma: "cmrsu", voc: "cmrsu", vow: "cmrsu", w16: "cmrsu", w17: "cmrsu", war: "cmrsu", who: "cmrsu", woc: "cmrsu", woe: "cmrsu", wor: "u", wot: "cmrsu", wth: "cmrsu", wwk: "cmrsu", x2ps: "cmrsu", xln: "cmrsu", y22: "cmrsu", y23: "cmrsu", y24: "cmrsu", y25: "cmrsu", y26: "cmrsu", zen: "cmrsu", znc: "cmrsu", zne: "cmrsu", znr: "cmrsu" }, Na = {
  codes: Ua
}, Ya = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), Ha = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function Er(e) {
  return Ya.has(e?.trim().toLowerCase() ?? "");
}
function za(e) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(e?.toLowerCase() ?? "") ? 0 : 1;
}
function qa(e, t) {
  const r = e?.trim().toLowerCase() ?? "";
  return Ha.has(r) || r === "atq" && t === "Reconstruction";
}
const U = Te.CONJURER_ROOT, jr = `${U}/img/setSymbols/official/`, Kt = Na.codes, Xa = {
  common: "c",
  uncommon: "u",
  rare: "r",
  mythic: "m",
  special: "s",
  bonus: "s"
};
function Pr(e, t = "common", r = "auto") {
  const s = e.trim().toLowerCase();
  if (r === "keyrune") return null;
  const n = Er(s) ? "c" : Xa[t];
  return n && Object.hasOwn(Kt, s) && Kt[s].includes(n) ? `${jr}${s}-${n}.svg` : null;
}
function we(e) {
  return !!e?.startsWith(jr);
}
const Ve = `${U}/img/frames/saga`, Wr = [
  `${Ve}/sagaMaskPinline.png`,
  `${Ve}/sagaMaskBanner.png`,
  `${Ve}/sagaMaskBannerRight.png`,
  `${Ve}/sagaMidStripe.png`
];
function Dr(e) {
  const t = z(e);
  return t.length !== 2 || e.layout === "transform" || e.land || /\bLand\b/.test(e.typeLine ?? "") ? [] : ("WUBRG".indexOf(t[1]) - "WUBRG".indexOf(t[0]) > 2 && t.reverse(), t.map(
    (r) => `${U}/data/images/cardImages/saga/sagaFrame${r}.png`
  ));
}
function Va(e) {
  const t = Dr(e);
  return t.length ? [...t, ...Wr] : [];
}
const Jt = /* @__PURE__ */ new WeakMap();
function Ka(e, t, r) {
  const s = Dr(t);
  if (!s.length) return;
  const n = [...s, ...Wr].map((p) => {
    const v = r.get(p);
    if (!v) throw Error(`Saga color asset unavailable: ${p}`);
    return v;
  }), a = Jt.get(n[0]);
  if (a && a.sources.every((p, v) => p === n[v])) {
    e.drawImage(a.canvas, 0, 0, 488, 680);
    return;
  }
  const [o, l, i, c, d, h] = n, u = document.createElement("canvas");
  u.width = o.width, u.height = o.height;
  const m = document.createElement("canvas");
  m.width = u.width, m.height = u.height;
  const g = document.createElement("canvas");
  g.width = u.width, g.height = u.height;
  const f = u.getContext("2d"), y = m.getContext("2d"), k = g.getContext("2d"), w = u.width, b = u.height;
  k.drawImage(i, 0, 0, w, b), k.drawImage(c, 0, 0, w, b), f.drawImage(o, 0, 0, w, b), f.globalCompositeOperation = "destination-in", f.drawImage(g, 0, 0), f.globalCompositeOperation = "source-over", k.clearRect(0, 0, w, b), k.save(), k.beginPath(), k.rect(w / 2, 0, w / 2, b), k.clip(), k.drawImage(i, 0, 0, w, b), k.restore(), k.drawImage(d, 0, 0, w, b), y.drawImage(l, 0, 0, w, b), y.globalCompositeOperation = "destination-in", y.drawImage(g, 0, 0), f.drawImage(m, 0, 0), f.drawImage(h, 0.0727 * w, 0.3058 * b, 87e-4 * w, 0.4762 * b), Jt.set(o, { sources: n, canvas: u }), m.width = m.height = g.width = g.height = 0, e.drawImage(u, 0, 0, 488, 680);
}
function Ja(e) {
  return e.power != null && e.toughness != null ? {
    text: `${e.power}/${e.toughness}`,
    label: `Power ${e.power}, toughness ${e.toughness}`
  } : e.loyalty != null && e.loyalty !== "" ? { text: String(e.loyalty), label: `Starting loyalty ${e.loyalty}` } : null;
}
const S = 488, M = 680, Za = 0.058;
function ge(e, t) {
  if (t === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (t ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    e?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const Qa = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", Y = {
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
  stamp: [0.34, 0.76 - 0.16 * S / M, 0.32, 0.32 * S / M]
}, j = {
  titleFont: 24,
  normalTitleFont: 26,
  titleTracking: 54e-5 * S,
  titleGap: 0.02362 * S,
  plateLeft: 0.02362 * S,
  plateRight: 0.01575 * S,
  manaSize: 0.03556 * 1.35 * S,
  manaGap: 378e-5 * S,
  manaLift: -63e-4 * S,
  typeFont: 0.044 * S,
  typeGap: 945e-5 * S,
  typeLift: -315e-5 * S,
  setHeight: 0.06142 * S,
  setMaxWidth: 0.11024 * S,
  setMargin: 472e-5 * S,
  rulesPaddingX: 0.01575 * S,
  rulesPaddingY: 0.02362 * S,
  normalRulesFont: 0.04444 * S,
  longRulesFont: 0.0381 * S,
  denseRulesFont: 0.0328 * S,
  paragraphGap: 787e-5 * S,
  statsFont: 0.05333 * S,
  statsLine: 0.08661 * S,
  footerFont: 0.02167 * S,
  footerLine: 0.02126 * S,
  footerTracking: 362e-5 * S,
  artistMarginLeft: 7e-3 * S,
  artistMarginRight: 35e-4 * S,
  legendaryBackgroundLift: -0.02047 * S
}, Zt = (e) => e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
function es(e = Y) {
  return {
    ...Object.fromEntries(
      Object.entries(e).flatMap(
        ([t, r]) => r.map((s, n) => [
          `--face-${Zt(t)}-${["x", "y", "w", "h"][n]}`,
          `${s * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(j).map(([t, r]) => [
        `--face-${Zt(t)}`,
        `${r / S * 100}cqw`
      ])
    )
  };
}
const Xn = es();
function ts(e) {
  return e.length > 340 ? "dense" : e.length > 210 ? "long" : "normal";
}
function Vn(e) {
  return {
    dense: j.denseRulesFont,
    long: j.longRulesFont,
    normal: j.normalRulesFont
  }[ts(e)];
}
function it(e) {
  return e.split(/(\{[^}\n]+\})/g).filter(Boolean).map((t) => ({
    value: t,
    symbol: /^\{[^}\n]+\}$/.test(t) ? t.slice(1, -1) : null
  }));
}
function rs(e) {
  const t = e.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[t] ?? t.slice(0, 3);
}
const Ye = `${U}/img/frames/saga`;
function Fr(e) {
  const t = z(e), r = t.length > 1 ? "M" : t[0];
  if (/\bLand\b/.test(e.typeLine ?? "") || e.land) return `${Ye}/regular/l.png`;
  if (e.layout === "transform" && r) return `${Ye}/dfc/${r.toLowerCase()}.png`;
  if (r) return `${U}/data/images/cardImages/saga/sagaFrame${r}.png`;
  throw Error("No ordinary colorless or artifact Saga plate is available.");
}
function Rt(e) {
  return e.layout === "transform" && e.setCode?.toLowerCase() === "neo" ? `${U}/img/frames/m15/transform/icons/fanClosed.svg` : null;
}
const _r = `${Ye}/sagaChapter.png`, Ur = `${Ye}/sagaDivider.png`, ct = `${Ye}/stamp.png`;
function as(e) {
  return [
    Fr(e),
    ...Va(e),
    _r,
    Ur,
    ...Rt(e) ? [Rt(e)] : [],
    ...["rare", "mythic"].includes(e.rarity ?? "") ? [ct] : []
  ];
}
const Nr = {
  ...Y,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.5007, 0.1134, 0.4233, 0.724],
  type: [0.0854, 0.8481, 0.8292, 0.0543],
  rules: [0.0867, 0.1129, 0.404, 0.7248],
  stamp: [0.17, 0.48, 0.23, 0.16506]
}, tt = 310.216, Qt = {
  frame: [52, 20, 298, 449],
  title: [70, 40, 261, 26],
  art: [65, 76.5, 270, 183.8],
  type: [70, 265, 261, 23],
  rules: [74, 301, 255, 160],
  artistY: 0,
  legalY: 0
}, ss = `${U}/img/frames/m15/split`, er = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style", Yr = [
  `${er}/namebox/texture/normal/c.png`,
  `${er}/typebox/texture/normal/c.png`
], Ot = (e) => `${ss}${e.layout?.endsWith("-fuse") ? "/fuse" : ""}`;
function $t(e) {
  const t = z(e);
  return `${Ot(e)}/${t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "a"}.png`;
}
function Hr(e) {
  const t = e.manaSymbols ?? [];
  return t.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !t.some((r) => /^[WUBRG]$/.test(r));
}
function ns(e) {
  const t = z(e);
  return [
    $t(e),
    ...t.length === 2 ? t.map((r) => `${Ot(e)}/${r.toLowerCase()}.png`) : [],
    ...t.length === 2 && Hr(e) ? Yr : [],
    ...["rare", "mythic"].includes(e.rarity ?? "") ? [ct] : []
  ];
}
const $e = /* @__PURE__ */ new Map(), kt = /* @__PURE__ */ new WeakMap();
let os = 0, yt = 0;
const ls = (e) => (kt.has(e) || kt.set(e, ++os), kt.get(e));
function Ke(e, t, r, s, n, a) {
  e.moveTo(t + a, r), e.lineTo(t + s - a, r), e.quadraticCurveTo(t + s + a * 0.25, r + n / 2, t + s - a, r + n), e.lineTo(t + a, r + n), e.quadraticCurveTo(t - a * 0.25, r + n / 2, t + a, r), e.closePath();
}
function is(e, t) {
  const r = (g) => {
    const f = t.get(g);
    if (!f) throw Error(`Modern split asset unavailable: ${g}`);
    return f;
  }, s = r($t(e)), n = z(e);
  if (n.length !== 2) return s;
  "WUBRG".indexOf(n[1]) - "WUBRG".indexOf(n[0]) > 2 && n.reverse();
  const a = Hr(e), o = [
    ...n.map((g) => r(`${Ot(e)}/${g.toLowerCase()}.png`)),
    ...a ? Yr.map(r) : [s]
  ], l = n.join("") + (a ? "-hybrid-" : "-gold-") + [s, ...o].map(ls).join("/"), i = $e.get(l);
  if (i)
    return $e.delete(l), $e.set(l, i), i;
  const c = document.createElement("canvas");
  c.width = s.width, c.height = s.height;
  const d = c.getContext("2d");
  d.scale(c.width / 488, c.height / 680), d.translate(0, 680), d.rotate(-Math.PI / 2);
  const h = (g) => {
    d.save(), d.translate(680, 0), d.rotate(Math.PI / 2), d.drawImage(g, 0, 0, 488, 680), d.restore();
  }, u = e.layout?.endsWith("-fuse") ?? !1;
  h(s);
  for (const g of [0, tt]) {
    if (d.save(), d.beginPath(), a ? d.rect(g + 50, 0, tt, 488) : (Ke(d, g + 57.5, 29, 286, 47, 9), d.rect(g + 64, 74, 273, u ? 362 : 394), Ke(d, g + 57.5, 260, 286, 34, 7)), u)
      for (const [w, b] of [
        [29, 47],
        [260, 34]
      ])
        d.moveTo(334, w), d.lineTo(356, w + b / 2), d.lineTo(378, w), d.lineTo(378, w + b), d.lineTo(356, w + b / 2), d.lineTo(334, w + b), d.closePath();
    d.clip(), h(o[0]);
    const f = document.createElement("canvas");
    f.width = c.width, f.height = c.height;
    const y = f.getContext("2d");
    y.drawImage(o[1], 0, 0, f.width, f.height), y.globalCompositeOperation = "destination-in";
    const k = y.createLinearGradient(
      0,
      (680 - g - 175) / 680 * f.height,
      0,
      (680 - g - 230) / 680 * f.height
    );
    if (k.addColorStop(0, "#0000"), k.addColorStop(1, "#000"), y.fillStyle = k, y.fillRect(0, 0, f.width, f.height), d.save(), d.translate(680, 0), d.rotate(Math.PI / 2), d.drawImage(f, 0, 0, 488, 680), d.restore(), d.restore(), f.width = f.height = 0, d.save(), d.beginPath(), Ke(d, g + 62.5, 34.5, 276, 37.5, 7), Ke(d, g + 62.5, 265, 276, 24, 5), u)
      for (const [w, b] of [
        [35, 37],
        [265, 24]
      ])
        d.moveTo(332, w), d.lineTo(349, w + b / 2), d.lineTo(332, w + b), d.closePath(), d.moveTo(380, w), d.lineTo(363, w + b / 2), d.lineTo(380, w + b), d.closePath();
    d.clip(), a ? (d.drawImage(o[2], 22, 7, 196, 19, g + 62.5, 34.5, 276, 37.5), d.drawImage(o[3], 22, 192, 196, 11, g + 62.5, 265, 276, 24)) : h(o[2]), d.restore();
  }
  const m = c.width * c.height * 4;
  for (const [g, f] of $e) {
    if (yt + m <= 16 * 1024 * 1024) break;
    yt -= f.width * f.height * 4, $e.delete(g), f.width = f.height = 0;
  }
  return m <= 16 * 1024 * 1024 && ($e.set(l, c), yt += m), c;
}
function ze(e) {
  return ["split", "aftermath"].includes(e.layout ?? "") && e.faces?.length === 2 && (e.layout === "aftermath" || /^Aftermath\b/m.test(e.faces[1].rulesText ?? ""));
}
const Le = 373, zr = 257, qr = `${U}/img/frames/saga/stamp.png`;
function Xr(e) {
  const t = z(e), r = t.length > 1 ? "m" : t[0]?.toLowerCase();
  if (!r) throw Error("No validated colorless Aftermath plate is available.");
  return `${U}/img/frames/m15/aftermath/${r}.png`;
}
function cs(e) {
  return ze(e) ? [
    ...e.faces.map(Xr),
    ...["rare", "mythic"].includes(e.rarity ?? "") ? [qr] : []
  ] : [];
}
const Gt = {
  title: [41.7, 35.5, 405, 37],
  art: [37.4, 76.5, 413.2, 151.8],
  type: [41.7, 235.8, 405, 37],
  rules: [41.7, 281.5, 405, 76]
}, Et = {
  title: [12, 37.5, 227, 37],
  art: [11, 80.7, 240.9, 137.9],
  type: [12, 235.2, 227, 37],
  rules: [14, 276.5, 232, 169]
};
function ds(e) {
  const t = e ? Et : Gt, r = e ? zr : 488, s = e ? 488 : Le, n = (a) => {
    const [o, l, i, c] = t[a];
    return [o / r, l / s, i / r, c / s];
  };
  return {
    ...Y,
    title: n("title"),
    art: n("art"),
    type: n("type"),
    rules: n("rules"),
    footer: [0, 1, 0, 0]
  };
}
const hs = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function Vr(e) {
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
function jt(e) {
  if (e.wordingMode === "oracle" || !["mir", "tmp"].includes(e.setCode?.toLowerCase() ?? "")) return null;
  const t = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    e.typeLine ?? ""
  )?.[1];
  if (!t) return null;
  const r = hs[t];
  return Vr(e) !== r ? null : {
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
const us = Te.KEYRUNE_ROOT, ms = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function De(e) {
  return !e.setSymbol && !Pr(e.setCode ?? "", e.rarity, e.setSymbolSource) ? ms[e.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1] : [0, 0, 1, 1];
}
const Kr = new Set(
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
Kr.add("con_");
const gs = "GLINT", rt = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function fs(e) {
  const t = rt[e] ?? rt.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${t}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function ps(e) {
  const t = rt[e] ?? rt.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${t}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function bs(e, t = "common", r) {
  const s = e.trim().toLowerCase();
  if (s === "forge") return ps(t);
  if (s === gs.toLowerCase()) return fs(t);
  const n = Pr(s, t, r);
  if (n) return n;
  const a = s === "con" ? "con_" : s === "p02" ? "po2" : s;
  return Kr.has(a) ? `${us}/${a}.svg` : null;
}
const tr = {
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
function ws(e) {
  return Object.hasOwn(tr, e) ? tr[e] : null;
}
const Pe = Te.RENDERER_COMPONENT_ROOT;
function Pt(e, t = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(t), s = t === "saga" ? "saga" : t === "planeswalker-large" ? "planeswalker_large" : t, n = ["saga", "class"].includes(t) && e.boxes === "Colourless" ? "Land" : t.startsWith("planeswalker") && e.boxes === "Artifact" ? "Colourless" : e.boxes;
  return {
    background: le(
      r ? "bg" : t === "class" ? "saga_bg" : `${s}_bg`,
      t.startsWith("planeswalker") && n === "Land" ? "Colourless" : n
    ),
    frame: le(
      ["normal", "leveler"].includes(t) ? "frames" : `${s}_frames`,
      t === "adventure" ? "WUBRG".includes(e.frame) ? e.frame : "W" : t === "class" ? e.frame === "WU" ? "UW" : e.frame.length === 2 ? "Gold" : e.frame : t === "saga" && e.frame === "Colourless" ? "Land" : t.startsWith("planeswalker") && ["Artifact", "Land"].includes(e.frame) ? "Colourless" : e.frame
    ),
    boxes: le(t.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", n),
    nameplate: le("nameplates", e.boxes),
    crown: le("legendary-crowns", e.crown),
    pt: t.startsWith("planeswalker") ? le("planeswalker", "Loyalty") : le("pt-boxes", e.pt)
  };
}
function dt(e) {
  const t = e.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = t === "∞" ? "INFINITY" : t === "½" ? "HALF" : t.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? le("symbols", r) : null;
}
function ks(e, t, r) {
  return bs(e, t, r);
}
function le(e, t) {
  const r = e === "legendary-crowns" ? "legendary_crowns" : e === "pt-boxes" ? "pt_boxes" : e === "nameplates" ? "boxes" : e, s = e === "symbols" ? "svg" : "webp";
  return `${Pe}/img/${r}/${encodeURIComponent(t)}.${s}`;
}
function se(e, t = e.rarity) {
  const r = e.setCode?.trim().toLowerCase() ?? "";
  return e.setSymbol ?? ks(
    r === "chr" ? ws(e.name) ?? "" : r,
    t,
    e.setSymbolSource
  );
}
function je(e) {
  const t = [
    e.rulesText ?? "",
    ...(e.rulesParagraphs ?? []).flatMap((s) => s.runs.map((n) => n.text))
  ];
  return [.../* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...t.flatMap(
      (s) => it(s).flatMap((n) => n.symbol ? [n.symbol] : [])
    )
  ])].map(dt);
}
const ys = Te.RETRO_SYMBOL_FONT, We = Te.RETRO_ROOT, Ss = `${We}/fonts/goudy-medieval.ttf`, vs = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), Cs = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function ke(e) {
  return e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") ? !1 : e.frameStyle === "retro" || e.frameStyle !== "modern" && vs.has(e.setCode?.toLowerCase() ?? "");
}
function ht(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function ce(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return ht(e) ? "abu" : t === "leg" && z(e).length > 1 ? "legends" : ["3ed", "4ed", "5ed", "atq"].includes(t) && !/\bLand\b/.test(e.typeLine ?? "") ? "fourth" : "seventh";
}
function Jr(e) {
  return ce(e) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1];
}
function Wt(e) {
  const t = ht(e);
  return {
    ...Y,
    frame: Jr(e),
    title: [t ? 0.07 : 0.1134, 0.0481, t ? 0.8467 : 0.8, 0.043],
    art: ce(e) === "legends" ? [0.112, 0.094, 0.78, 0.45] : ce(e) === "fourth" ? [0.109, 0.093, 0.779, 0.453] : t ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429],
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: [0.8074, 0.895, 0.1367, 0.043],
    footer: [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function Ae(e) {
  const t = z(e), r = e.typeLine ?? "", s = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([l]) => r.includes(l)), n = /\bLand\b/.test(r) ? s.length === 1 ? s[0][1] + "l" : "l" : /\bArtifact\b/.test(r) ? "a" : t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "c", a = ce(e), o = a === "seventh" || n === "c" || a === "abu" && n === "m" ? "seventh/regular" : `old/${a}`;
  return `${We}/img/frames/${o}/${a === "legends" ? "legendsFrameM" : n}.png`;
}
function pe(e) {
  return e.borderColor ?? (Cs.has(e.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function rr(e) {
  return pe(e) === "silver" ? ge(null, "silver").border : pe(e) === "white" ? Ts : "#080808";
}
function Zr(e) {
  return ce(e) === "fourth" ? `${We}/img/frames/old/fourth/borderBlack.png` : `${We}/img/frames/${ht(e) ? "old/abu" : "seventh/regular"}/border.svg`;
}
function ar(e) {
  return ht(e) ? "#ababab" : "#f2eee3";
}
function Rs(e) {
  return e.setCode?.toLowerCase() === "7ed" && z(e).some((t) => t === "W" || t === "G") && !/Land/.test(e.typeLine ?? "") ? "saturate(.7) brightness(.88)" : "none";
}
function Dt(e) {
  if (jt(e)) return null;
  const t = Vr(e);
  return t ? `${We}/img/frames/m15/basics/${t.toLowerCase()}.png` : null;
}
const Ts = "#eeedeb";
function Qr(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return !e.setSymbol && t === "ice" && e.setSymbolSource === "keyrune" ? `${Te.KEYRUNE_ROOT}/ice2.svg` : !e.setSymbol && qa(t, e.name) ? null : se(e);
}
function Kn(e) {
  const t = (e.rulesText ?? "").length;
  return t > 340 ? 16 : t > 210 ? 19 : 23;
}
function Ms(e) {
  return [
    Dt(e),
    Ae(e),
    pe(e) !== "black" || ce(e) === "fourth" ? Zr(e) : null,
    e.illustration,
    Qr(e),
    ...je(e)
  ];
}
const ie = ([e, t, r, s]) => [
  e * S,
  t * M,
  r * S,
  s * M
];
function Jn(e, t) {
  return ["7ed", "8ed", "9ed"].includes(e?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(t ?? "") ? "black" : void 0;
}
const ea = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", Is = new Set("dis plc cmd pc2 dgm mma c13".split(" "));
function Ce(e) {
  return e.layout !== "split" || e.faces?.length !== 2 || ze(e) || e.faces.some((t) => !/^(Instant|Sorcery)\b/.test(t.typeLine ?? "")) ? null : ke({ ...e, layout: "normal", frameStyle: e.frameStyle ?? e.faces[0]?.frameStyle }) ? "old" : e.frameAssetFamily === "eighth" || Is.has(e.setCode?.toLowerCase() ?? "") ? "eighth" : "m15";
}
function qe(e) {
  const t = (r) => [
    r.rulesText ?? "",
    ...(r.rulesParagraphs ?? []).map((s) => s.runs.map((n) => n.text).join(""))
  ];
  return [e, ...e.faces ?? []].some((r) => t(r).some((s) => /^Fuse\b/m.test(s)));
}
const ta = 251 * 680 / 523, sr = 680 / 523, at = 488 / 375, Ie = (e, t, r, s) => [
  e * sr,
  t * at,
  r * sr,
  s * at
];
function Fe(e, t) {
  if (e === "m15")
    return t ? { ...Qt, rules: [74, 301, 255, 128] } : Qt;
  const r = e === "old";
  return {
    frame: Ie(18, 18, t ? 244 : 236, 338),
    title: Ie(r ? 35 : 30, r ? 23 : 28, r ? 207 : 214, 21),
    art: r ? Ie(37, 47, 197, 130) : Ie(27, 56, 217, 152),
    type: Ie(r ? 35 : 30, r ? 182 : 211, 210, r ? 21 : 17),
    rules: r ? Ie(43, 207, 187, 109) : Ie(30, 233, 213, t ? 74 : 95),
    artistY: (r ? 332 : t ? 344 : 339) * at,
    legalY: (r ? 347 : 354) * at
  };
}
function Ls(e) {
  const t = e.layout?.startsWith("split-old") ? "old" : e.layout?.startsWith("split-m15") ? "m15" : "eighth", r = t === "m15" ? tt : ta, s = Fe(t, e.layout?.endsWith("-fuse") ?? !1), n = (a) => [
    a[0] / r,
    a[1] / 488,
    a[2] / r,
    a[3] / 488
  ];
  return {
    ...Y,
    frame: n(s.frame),
    title: n(s.title),
    art: n(s.art),
    type: n(s.type),
    rules: n(s.rules),
    footer: [0, 1, 0, 0]
  };
}
function st(e, t, r, s) {
  if (t === "m15") return $t(e);
  const n = z(e), a = n.length > 1 ? "m" : n[0]?.toLowerCase() ?? "c";
  return `${ea}/${t === "old" ? "magic-old-split" : r ? "magic-new-split-fuse" : "magic-new-split"}.mse-style/${a}card${r ? s + 1 : ""}.${r ? "png" : "jpg"}`;
}
function ra(e) {
  for (const t of [e, ...e.faces ?? []]) {
    const r = t.rulesParagraphs?.find(
      (n) => /^Fuse\b/.test(n.runs.map((a) => a.text).join(""))
    );
    if (r) return [r];
    const s = t.rulesText?.split(`
`).find((n) => /^Fuse\b/.test(n));
    if (s) return [{ role: "rules", runs: [{ text: s }] }];
  }
  return [];
}
function de(e) {
  if (!["split", "aftermath"].includes(e.layout ?? "") || e.faces?.length !== 2) return [];
  const t = ze(e), r = Ce(e), s = r === "m15" ? tt : ta;
  return e.faces.map((n, a) => {
    const o = t ? 0.615 : 0.5, l = {
      setCode: e.setCode,
      frameStyle: e.frameStyle,
      rarity: e.rarity,
      artist: e.artist,
      setSymbol: e.setSymbol,
      setSymbolSource: e.setSymbolSource,
      ...n,
      layout: t ? a === 0 ? "aftermath-top" : "aftermath-bottom" : r ? `split-${r}${qe(e) && r !== "old" ? "-fuse" : ""}` : "split-half",
      frameAssetFamily: void 0,
      faces: void 0,
      rulesText: n.rulesText?.split(`
`).filter((i) => !/^Fuse\b/.test(i)).join(`
`),
      rulesParagraphs: n.rulesParagraphs?.filter(
        (i) => !/^Fuse\b/.test(i.runs.map((c) => c.text).join(""))
      ),
      illustration: n.illustration ?? e.illustration,
      etchedIllustration: n.etchedIllustration ?? (n.illustration ? void 0 : e.etchedIllustration),
      illustrationCrop: n.illustrationCrop ?? (!n.illustration && e.illustration ? [a ? o : 0, 0, a ? 1 - o : o, 1] : void 0)
    };
    return t ? a === 0 ? { face: l, x: 0, y: 0, width: 488, height: Le, rotation: 0 } : {
      face: l,
      x: 488,
      y: Le,
      width: zr,
      height: 488,
      rotation: 90
    } : r ? {
      face: l,
      x: 0,
      y: 680 - a * s,
      width: s,
      height: 488,
      rotation: -90
    } : {
      face: l,
      x: 5,
      y: (a ? 333 : 648) - (Ft(e) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function Zn(e) {
  return {
    left: `${e.x / S * 100}%`,
    top: `${e.y / M * 100}%`,
    width: `${e.width / S * 100}%`,
    height: `${e.height / M * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function aa(e, t) {
  e.translate(t.x, t.y), e.rotate(t.rotation * Math.PI / 180), e.scale(t.width / S, t.width / S);
}
function nr(e, t) {
  const r = t[0] * e.width, s = t[1] * e.height, n = t[2] * e.width, a = t[3] * e.height;
  return e.rotation === -90 ? [
    (e.x + s) / S,
    (e.y - r - n) / M,
    a / S,
    n / M
  ] : e.rotation === 90 ? [
    (e.x - s - a) / S,
    (e.y + r) / M,
    a / S,
    n / M
  ] : [(e.x + r) / S, (e.y + s) / M, n / S, a / M];
}
function As(e) {
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? 1.5 : 1;
}
const Ft = qe, xs = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, Bs = "#9aa4ae", Os = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
function _t(e, t, r, s) {
  const n = [];
  for (const a of t.split(`
`)) {
    let o = [], l = 0;
    const i = it(a).flatMap(
      (c) => c.symbol ? [{ text: c.symbol, symbol: !0 }] : (c.value.match(/\s+|\S+/g) ?? []).map((d) => ({ text: d, symbol: !1 }))
    );
    for (const c of i) {
      const d = !c.symbol && e.measureText(c.text).width > r ? [...c.text].map((h) => ({ text: h, symbol: !1 })) : [c];
      for (const h of d) {
        const u = h.symbol ? s * 0.94 : e.measureText(h.text).width;
        l + u > r && o.length && (n.push(o), o = [], l = 0), !(!o.length && /^\s+$/.test(h.text)) && (o.push({ ...h, width: u }), l += u);
      }
    }
    n.push(o);
  }
  return n;
}
function J(e, t, r, s, n, a, o = !1) {
  const l = a.get(dt(t) ?? "");
  if (e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, o) {
    const i = e.getTransform();
    e.shadowColor = "#000d", e.shadowOffsetX = 1.5372 * (-i.a + i.c), e.shadowOffsetY = 1.5372 * (-i.b + i.d);
  }
  if (e.fillStyle = a.manaColors?.[t] ?? xs[t] ?? Bs, e.beginPath(), e.arc(r + n / 2, s + n / 2, n / 2, 0, Math.PI * 2), e.fill(), e.shadowColor = "transparent", l) {
    e.drawImage(l, r, s, n, n), e.restore();
    return;
  }
  e.fillStyle = t === "B" ? "white" : "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = `bold ${n * 0.62}px Georgia`, e.fillText(t, r + n / 2, s + n / 2, n * 0.9), e.restore();
}
function sa(e, t, r, s, n, a, o) {
  const l = typeof a == "number" ? a : a.size;
  e.font = `${typeof a != "number" && a.italic ? "italic " : ""}${l}px "CardRenderer MTG MPlantin", Georgia`;
  const i = t.split(`
`).map((c) => _t(e, c, n, l));
  e.textBaseline = "top";
  for (const c of i) {
    for (const d of c) {
      let h = r;
      for (const u of d)
        u.symbol ? J(e, u.text, h + l * 0.07, s + l * 0.03, l * 0.8, o) : e.fillText(u.text, h, s), h += u.width;
      s += l;
    }
    s += j.paragraphGap;
  }
}
function Qn(e, t, r) {
  if (e.measureText(t).width <= r) return t;
  const s = [...t];
  for (; s.length && e.measureText(`${s.join("")}…`).width > r; ) s.pop();
  return s.length || e.measureText("…").width <= r ? `${s.join("")}…` : "";
}
function he(e, t, r, s, n, a, o = !1, l = 1, i = "CardRenderer MTG Beleren") {
  if (!(n > 0)) throw Error("Magic title/type plate has no text space.");
  e.save(), e.font = `${o ? "bold " : ""}${a}px "${i}", Georgia`;
  const c = e.measureText(t).width;
  l > 1 && c * l > n && (l = 1), l !== 1 && (e.translate(r, 0), e.scale(l, 1), r = 0, n /= l), c > n && (a = Math.max(a * 0.78, a * n / c), e.font = `${o ? "bold " : ""}${a}px "${i}", Georgia`), e.fillText(t, r, s, n), e.restore();
}
function xe(e, t, r, s, n, a, o, l, i = [0, 0, 1, 1]) {
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
    e.drawImage(t, ...c, n, a, o, l);
    return;
  }
  const h = document.createElement("canvas");
  h.width = Math.max(1, Math.ceil(o * 2)), h.height = Math.max(1, Math.ceil(l * 2));
  const u = h.getContext("2d");
  u.drawImage(t, ...c, 0, 0, h.width, h.height), u.globalCompositeOperation = "source-in", u.fillStyle = d, u.fillRect(0, 0, h.width, h.height), e.drawImage(h, n, a, o, l), h.width = h.height = 0;
}
function $s(e, t, r) {
  e.fillStyle = "#000", e.fillRect(0, 0, 488, 680), de(t).forEach((s, n) => {
    e.save(), e.beginPath(), e.rect(0, n ? 0 : 324, 488, n ? 324 : 356), e.clip(), e.drawImage(is(s.face, r), 0, 0, 488, 680), e.restore();
  });
}
function Gs(e, t, r) {
  const o = t.manaSymbols ?? [], l = o.length * 23.4 + Math.max(0, o.length - 1) * 1.7;
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left", he(
    e,
    t.name,
    70,
    53,
    Math.max(1, (o.length ? 331 - l - 7 : 331) - 70),
    26,
    !0
  ), o.forEach((g, f) => J(e, g, 331 - l + f * (23.4 + 1.7), 39.5, 23.4, r, !0));
  const i = se(t), c = r.get(i ?? ""), d = De(t), h = c ? Math.min(26 / (c.width * d[2]), 15.5 / (c.height * d[3])) : 0, u = c ? c.width * d[2] * h : 0, m = c ? c.height * d[3] * h : 0;
  if (he(e, t.typeLine ?? "", 70, 277, (c ? 331 - u - 6 : 331) - 70, 18.5, !0), c) {
    const g = [331 - u, 277 - m / 2, u, m];
    we(i) || t.setSymbol ? e.drawImage(c, ...g) : xe(e, c, t.setCode, t.rarity, ...g, d);
  }
}
function Es(e, t, r) {
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic";
  const s = [
    ...new Set((t.faces ?? []).map((n) => n.artist ?? t.artist ?? "").filter(Boolean))
  ].join(" & ");
  if (e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""} ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    646
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 660), s && (e.font = '11px "CardRenderer MTG Artist Credit", serif', e.fillText("a", 95, 660), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(s, 110, 660, 193)), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 455, 660, 170)), ["rare", "mythic"].includes(t.rarity ?? "")) {
    const n = r.get(ct);
    if (!n) throw Error("Modern split authenticity stamp unavailable.");
    e.drawImage(n, 223, 624, 43, 18);
  }
}
const na = {
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
function Tt(e) {
  return e.watermark && Object.hasOwn(na, e.watermark) ? `${U}/img/watermarks/guild-${e.watermark}.svg` : null;
}
function oa(e, t) {
  return `${ea}/magic-new-split${e ? "-fuse" : ""}.mse-style/multicolor_blend_card${e ? t + 1 : ""}.png`;
}
function js(e, t, r, s) {
  if (t === "m15") return [...ns(e), Tt(e)];
  const n = z(e);
  return [
    st(e, t, r, s),
    Tt(e),
    ...t === "eighth" && n.length === 2 ? [
      oa(r, s),
      ...n.map(
        (a) => st({ ...e, colors: [a], frameColors: void 0 }, t, r, s)
      )
    ] : [],
    ...t === "eighth" && e.artist ? [`${U}/img/manaSymbols/brush.svg`] : []
  ];
}
const or = /* @__PURE__ */ new WeakMap();
function Ps(e) {
  const t = or.get(e);
  if (t) return t;
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  const s = r.getContext("2d", { willReadFrequently: !0 });
  s.drawImage(e, 0, 0);
  const n = s.getImageData(0, 0, r.width, r.height);
  for (let a = 0; a < n.data.length; a += 4) n.data[a + 3] = n.data[a];
  return s.putImageData(n, 0, 0), or.set(e, r), r;
}
const lr = /* @__PURE__ */ new WeakMap();
function Ws(e, t, r, s, n) {
  const a = (b) => {
    const p = n.get(b);
    if (!p) throw Error(`Split asset unavailable: ${b}`);
    return p;
  }, o = a(st(e, t, r, s)), l = z(e);
  if (t !== "eighth" || l.length !== 2) return o;
  "WUBRG".indexOf(l[1]) - "WUBRG".indexOf(l[0]) > 2 && l.reverse();
  const [i, c] = l.map(
    (b) => a(
      st({ ...e, colors: [b], frameColors: void 0 }, t, r, s)
    )
  ), d = a(oa(r, s)), h = l.join(""), u = lr.get(o) ?? /* @__PURE__ */ new Map();
  lr.set(o, u);
  const m = u.get(h);
  if (m?.left === i && m.right === c && m.mask === d) return m.canvas;
  const g = document.createElement("canvas");
  g.width = o.width, g.height = o.height;
  const f = document.createElement("canvas");
  f.width = o.width, f.height = o.height;
  const y = g.getContext("2d"), k = f.getContext("2d");
  k.drawImage(c, 0, 0), k.globalCompositeOperation = "destination-in";
  const w = k.createLinearGradient(0, 0, o.width, 0);
  return w.addColorStop(0, "#0000"), w.addColorStop(0.4, "#0000"), w.addColorStop(0.6, "#000"), w.addColorStop(1, "#000"), k.fillStyle = w, k.fillRect(0, 0, o.width, o.height), y.drawImage(i, 0, 0), y.drawImage(f, 0, 0), y.globalCompositeOperation = "destination-in", y.drawImage(Ps(d), 0, 0), y.globalCompositeOperation = "destination-over", y.drawImage(o, 0, 0), y.globalCompositeOperation = "source-over", f.width = f.height = 0, u.set(h, { left: i, right: c, mask: d, canvas: g }), g;
}
const ir = /* @__PURE__ */ new WeakMap();
function Ds(e, t, r, s) {
  const n = Tt(t);
  if (!n) return;
  const a = r.get(n);
  if (!a) throw Error(`Split watermark unavailable: ${n}`);
  const o = t.watermark, l = ir.get(a) ?? /* @__PURE__ */ new Map();
  ir.set(a, l);
  let i = l.get(o);
  if (!i) {
    i = document.createElement("canvas"), i.width = a.width, i.height = a.height;
    const m = i.getContext("2d");
    m.drawImage(a, 0, 0), m.globalCompositeOperation = "source-in";
    const g = {
      W: "#b39f4d",
      U: "#718dac",
      B: "#998795",
      R: "#b6723f",
      G: "#69936e"
    }, [f, y] = na[o], k = m.createLinearGradient(0, 0, i.width, 0);
    k.addColorStop(0, g[f]), k.addColorStop(0.499, g[f]), k.addColorStop(0.5, g[y]), k.addColorStop(1, g[y]), m.fillStyle = k, m.fillRect(0, 0, i.width, i.height), l.set(o, i);
  }
  const c = t.layout?.startsWith("split-m15") ?? !1, d = Math.min(
    (c ? 135 : 110) / a.width,
    (c ? 125 : t.setCode?.toLowerCase() === "dgm" ? 75 : 100) / a.height
  ), h = a.width * d, u = a.height * d;
  e.save(), e.globalAlpha = 0.3, e.drawImage(i, (c ? 199.5 : 177) - h / 2, s - u / 2, h, u), e.restore();
}
const Fs = [
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
], ve = 0.91339 * S / 768, Mt = 0.04724 * S, It = 0.02655 * M;
function _s(e) {
  return [
    (Mt + 20 * ve) / S,
    (It + 84 * ve) / M,
    728 * ve / S,
    ((e ? 541 : 622) - 84) * ve / M
  ];
}
function Us(e, t) {
  const r = Fs[t ? 1 : 0];
  e.beginPath(), r.forEach(([s, n], a) => {
    const o = Mt + (n - 1) * ve, l = It + s * ve;
    a === 0 ? e.moveTo(o, l) : e.lineTo(o, l);
  });
  for (let s = r.length - 1; s >= 0; s--) {
    const [n, a] = r[s];
    e.lineTo(Mt + (769 - a) * ve, It + n * ve);
  }
  e.closePath(), e.clip();
}
const Ns = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", cr = {
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
}, He = {
  artInset: 4.5,
  artRim: 1.5,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function Ys(e) {
  if (!e.frameAssetFamily && !ne(e).legendary && (e.layout ?? "normal") === "normal" && Pe === Ns) {
    const t = e.borderColor ?? (ge(e.setCode).border === "#eeedeb" ? "white" : "black"), r = `${e.setCode?.toLowerCase() ?? ""}/${t}`;
    if (Object.hasOwn(cr, r)) return cr[r];
  }
  return ["m15", "m19", "m20", "war"].includes(e.setCode?.toLowerCase() ?? "") ? He.frameInset : 0;
}
function la(e) {
  return ["B", "Colourless", "Land"].includes(ne(e).boxes);
}
function ia(e) {
  return e.frameAssetFamily !== "eighth" || !e.artist ? null : `${U}/img/manaSymbols/${la(e) ? "whitebrush" : "brush"}.svg`;
}
function Hs(e, t) {
  if (!t.includes("*")) {
    e.fillText(t, 407, 627, 78);
    return;
  }
  const r = t.split(/(\*)/).filter(Boolean), s = r.map((o) => o === "*" ? 15 : e.measureText(o).width), n = s.reduce((o, l) => o + l, 0);
  e.save(), e.translate(407, 0), e.scale(Math.min(1, 78 / n), 1), e.textAlign = "left";
  let a = -n / 2;
  for (const [o, l] of r.entries()) {
    if (l === "*") {
      e.beginPath();
      for (let i = 0; i < 10; i++) {
        const c = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? 3.1 : 7.5, h = a + 7.5 + d * Math.cos(c), u = 622 + d * Math.sin(c);
        i === 0 ? e.moveTo(h, u) : e.lineTo(h, u);
      }
      e.closePath(), e.fill();
    } else e.fillText(l, a, 627);
    a += s[o];
  }
  e.restore();
}
function zs(e, t, r) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.letterSpacing = "0px", t.power != null && t.toughness != null && (e.fillStyle = "#17140f", e.font = '700 29px "CardRenderer MTG Matrix Small Caps", Georgia', e.textAlign = "center", e.textBaseline = "middle", Hs(e, `${t.power}/${t.toughness}`));
  const s = t.setCode?.toLowerCase(), n = s === "8ed" ? 75 : s === "9ed" ? 79 : 77, a = s === "8ed" || s === "9ed", o = a ? 633 : 634;
  e.fillStyle = la(t) ? "#fff" : "#17140f", e.textBaseline = "alphabetic", e.textAlign = "left";
  const l = ia(t);
  if (l) {
    const i = r.get(l);
    if (!i) throw Error(`Eighth Edition artist brush unavailable: ${l}`);
    e.drawImage(i, 36.5, o - 10, n - 39, 13.5), e.font = `700 ${a ? 17.5 : 18}px "CardRenderer MTG Matrix", Georgia`;
    const c = t.power != null && t.toughness != null ? 350 : 448;
    e.fillText(t.artist, n, o, c - n);
  }
  t.legalText && (e.font = '9px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 36.5, o + 13, 395)), e.restore();
}
function Ut(e) {
  if (!e.frameAssetFamily) return null;
  if (ke(e) || e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
    throw Error("Replacement frame plates currently support ordinary modern faces only.");
  const t = e.frameAssetFamily === "eighth", r = ne(e), s = z(e), n = s.length === 2 && "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 ? [...s].reverse() : s, o = `${U}/img/frames/${t ? "8th" : "m15/new"}`, l = r.land ? "l" : r.artifact ? "a" : /\bVehicle\b/.test(e.typeLine ?? "") ? "v" : s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c", i = (g) => t ? `${g.toLowerCase()}l` : `l${g.toLowerCase()}`, c = r.land && n.length ? i(n.length > 2 ? "m" : n[0]) : l, d = r.land && n.length === 2 ? i(n[1]) : void 0, h = l === "l" ? t ? "l" : "c" : l, u = t ? [0.09, 0.0629, 0.824, 0.0429] : [168 / 2010, 145 / 2814, 0.8292, 0.0543], m = t ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358] : [168 / 2010, 1588 / 2814, 0.8292, 0.0543];
  return {
    frame: `${o}/${c}.png`,
    rightFrame: d ? `${o}/${d}.png` : void 0,
    border: `${o}/border.png`,
    pt: t ? `${U}/img/frames/8th/pt/${h === "c" ? "l" : h}.png` : `${U}/img/frames/m15/regular/m15PT${h.toUpperCase()}.png`,
    rects: {
      ...Y,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title: u,
      type: m,
      art: t ? [180 / 2010, 341 / 2814, 1656 / 2010, 1216 / 2814] : [0.0767, 0.1129, 0.8476, 0.4429],
      rules: t ? [205 / 2010, 1779 / 2814, 1596 / 2010, 729 / 2814] : [0.086, 1780 / 2814, 0.828, 0.2875],
      stats: t ? [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814] : [0.7573, 0.8848, 0.188, 0.0733],
      footer: t ? [150 / 2010, 1938 / 2100, 0.81, 0.04] : Y.footer
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
function qs(e) {
  const t = Ut(e);
  if (!t) return null;
  const r = ia(e);
  return [
    ...r ? [r] : [],
    t.frame,
    ...t.rightFrame ? [t.rightFrame] : [],
    ...e.power != null && e.toughness != null ? [t.pt] : [],
    ...ge(e.setCode, e.borderColor).border !== "#090806" ? [t.border] : []
  ];
}
function Xe(e) {
  const t = e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "");
  return (t ? (e.rulesText ?? "").replace(/\|(?=\s*[IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*\s*[—–-]\s)/g, `
`) : e.rulesText ?? "").split(`
`).filter((s) => s.trim()).map((s) => {
    const n = t ? s.match(/^\s*([IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*)\s*[—–-]\s*(.+)$/) : null;
    if (n)
      return { text: n[2], badges: n[1].split(/\s*,\s*/), reminder: !1 };
    const a = t ? null : s.match(/^\s*\[?([+−-]?(?:\d+|X))\]?\s*:\s*(.*)$/i);
    return a ? {
      text: a[2],
      badges: [a[1].replace("-", "−").toUpperCase()],
      reminder: !1
    } : { text: s, badges: [], reminder: t && /^\s*\(/.test(s) };
  });
}
function K(e) {
  return e.layout === "ability" ? "normal" : e.layout === "adventure" && e.faces?.length === 2 ? "adventure" : e.layout === "class" || /\bClass\b/i.test(e.typeLine ?? "") ? "class" : e.layout === "leveler" || /^Level up\b/m.test(e.rulesText ?? "") ? "leveler" : e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "") ? "saga" : e.layout === "planeswalker" || /\bPlaneswalker\b/i.test(e.typeLine ?? "") ? Xe(e).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function ue(e) {
  if (e.layout === "aftermath-top" || e.layout === "aftermath-bottom")
    return ds(e.layout === "aftermath-bottom");
  if (/^split-(old|eighth|m15)(-fuse)?$/.test(e.layout ?? "")) return Ls(e);
  const t = Ut(e);
  if (t) return t.rects;
  if (ke(e)) return Wt(e);
  const r = K(e);
  if (r === "adventure")
    return {
      ...Y,
      frame: [2.9 / 63.5, 3.5 / 88.9, 57.4 / 63.5, 79 / 88.9],
      type: [0.05669, 49.7 / 88.9, 0.88662, 0.05737],
      stamp: [0.58, 0.74, 0.25, 0.1794]
    };
  if (r === "class")
    return {
      ...Y,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (r === "saga") return Nr;
  if (r.startsWith("planeswalker")) {
    const s = r === "planeswalker-large", n = [
      0.04409,
      s ? 0.55118 : 0.62655,
      0.88827,
      s ? 0.37534 : 0.29997
    ], a = Y.stamp[2], o = Y.stamp[3];
    return {
      ...Y,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, 0.92126 * S * 3793 / 2778 / M],
      frame: [0.04724, 0.02655, 0.91339, 0.91339 * S * 3810 / 2736 / M],
      art: _s(s),
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / S,
        (s ? 0.49044 : 0.55793) + 5 / M,
        0.88662,
        0.05737
      ],
      rules: n,
      stats: [0.792 + 1 / S, 0.881 - 3 / M, 0.16, 0.069],
      stamp: [
        n[0] + (n[2] - a) / 2,
        n[1] + (n[3] - o) / 2,
        a,
        o
      ]
    };
  }
  return e.layout === "split-half" ? {
    ...Y,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : {
    ...Y,
    art: [
      Y.art[0] + He.artInset / S,
      Y.art[1],
      Y.art[2] - 2 * He.artInset / S,
      Y.art[3]
    ]
  };
}
function Xs(e) {
  const t = K(e) === "saga", r = ue(e).rules, s = Xe(e), n = r[2] * 488 - (t ? 32 : 70), a = r[3] * 680;
  let o = t ? 21 : 19;
  const l = (y, k) => Math.max(1, Math.ceil(y.length * k * 0.49 / n)), i = (y, k) => Math.max(t ? y.badges.length * 36 : 34, l(y.text, k) * k + 16), c = (y) => s.reduce((k, w) => k + i(w, y), 0);
  for (; o > 8 && c(o) > a; ) o -= 0.5;
  const d = s.map((y) => i(y, o)), h = Math.max(0, a - c(o)) / Math.max(1, s.length);
  let u = a / Math.max(1, s.length), m = a, g = s.length;
  if (!t)
    for (const y of [...d].sort((k, w) => w - k)) {
      if (y <= u) break;
      m -= y, u = m / Math.max(1, --g);
    }
  let f = 0;
  return s.map((y, k) => {
    const w = t ? d[k] + h : Math.max(u, d[k]), b = { ...y, top: f, height: w, font: o, left: t ? 27 : 62, width: n };
    return f += w, b;
  });
}
function nt(e, t, [r, s, n, a]) {
  if (!(e > 0 && t > 0)) return [r, s, n, a];
  const o = Math.max(n / e, a / t), l = e * o, i = t * o;
  return [r + (n - l) / 2, s + (a - i) / 2, l, i];
}
function Vs(e, t, r, s) {
  const n = [s[0] * e, s[1] * t, s[2] * e, s[3] * t];
  return [...n, ...nt(n[2], n[3], r)];
}
function Re(e, t, r, s, n) {
  const [a, o, l, i] = s, c = K(t);
  if (e.save(), c.startsWith("planeswalker") && Us(e, c === "planeswalker-large"), n === "printing") {
    e.clearRect(a, o, l, i), e.restore();
    return;
  }
  (n === "artwork" || c.startsWith("planeswalker")) && (e.fillStyle = "#80745c", e.fillRect(a, o, l, i));
  const d = r.get(t.illustration ?? "");
  if (!d) {
    e.restore();
    return;
  }
  e.beginPath(), e.rect(a, o, l, i), e.clip(), t.illustrationCrop ? e.drawImage(
    d,
    ...Vs(d.width, d.height, s, t.illustrationCrop)
  ) : e.drawImage(d, ...nt(d.width, d.height, s)), e.restore();
}
function ut(e) {
  return e.rulesParagraphs ?? e.rulesText.split(`
`).filter(Boolean).map((t) => ({ role: "rules", runs: [{ text: t }] }));
}
function eo(e, t, r = "oracle", s = {}) {
  const n = t[r];
  if (!n) throw Error(`Missing ${r} printing wording`);
  if (typeof n.typeLine != "string" || typeof n.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const a = s.rulesAlignment ?? r, o = a === "left" ? void 0 : t[a];
  if (a !== "left" && !o) throw Error(`Missing ${a} alignment wording`);
  const l = ne({ ...e, typeLine: t.oracle.typeLine });
  return {
    ...e,
    ...n,
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: n.rulesParagraphs,
    rulesAlignment: o ? { mode: "auto", reference: ut(o) } : { mode: "left" },
    artifact: e.artifact ?? l.artifact,
    land: e.land ?? l.land,
    creature: e.creature ?? l.creature,
    legendary: e.legendary ?? l.legendary,
    wordingMode: r,
    symbolStyle: s.symbolStyle ?? (r === "oracle" ? "modern" : "original")
  };
}
const Lt = (e, t = !1) => `${t ? "italic " : ""}${e}px "CardRenderer MTG MPlantin", Georgia`;
function Ks(e) {
  const t = [];
  let r = [], s = !1;
  const n = () => {
    r.length && (t.push({ pieces: r, space: s }), r = [], s = !1);
  };
  for (const a of e)
    for (const o of it(a.text))
      if (o.symbol) r.push({ text: o.symbol, symbol: !0, italic: !1 });
      else
        for (const l of o.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(l) ? (n(), l === `
` ? (t.push({ pieces: [], space: !1, newline: !0 }), s = !1) : s = !0) : r.push({ text: l, symbol: !1, italic: !!a.italic });
  return n(), t;
}
function Ne(e, t, r) {
  const s = [];
  for (const n of t) {
    const a = s.at(-1);
    a && !a.symbol && !n.symbol && a.italic === n.italic ? a.text += n.text : s.push({ ...n });
  }
  return s.map((n) => {
    e.font = Lt(r, n.italic);
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
function ca(e, t, r, s) {
  const n = [];
  let a = [];
  for (const o of t) {
    if (o.newline) {
      n.push(Ne(e, a, s)), a = [];
      continue;
    }
    const l = a.length && o.space ? [{ text: " ", italic: o.pieces[0]?.italic ?? !1, symbol: !1 }] : [], i = Ne(e, [...a, ...l, ...o.pieces], s);
    a.length && i.reduce((c, d) => c + d.width, 0) > r ? (n.push(Ne(e, a, s)), a = [...o.pieces]) : a.push(...l, ...o.pieces);
  }
  return a.length && n.push(Ne(e, a, s)), n;
}
function dr(e, t, r, s) {
  const n = ca(e, t, r, s);
  if (n.length < 2) return n;
  const a = /* @__PURE__ */ new Map(), o = (h, u) => {
    const m = `${h}:${u}`;
    let g = a.get(m);
    if (!g) {
      const f = [];
      for (let y = h; y < u; y++) {
        const k = t[y];
        y > h && k.space && f.push({ text: " ", italic: k.pieces[0]?.italic ?? !1, symbol: !1 }), f.push(...k.pieces);
      }
      g = Ne(e, f, s), a.set(m, g);
    }
    return g;
  }, l = /* @__PURE__ */ new Map(), i = (h, u) => {
    if (!u) return h === t.length ? { cost: 0, cuts: [] } : null;
    const m = `${h}:${u}`;
    if (l.has(m)) return l.get(m);
    let g = null;
    for (let f = h + 1; f <= t.length - u + 1; f++) {
      const y = o(h, f).reduce((b, p) => b + p.width, 0);
      if (y > r) break;
      const k = i(f, u - 1);
      if (!k) continue;
      const w = k.cost + (r - y) ** 2;
      (!g || w < g.cost) && (g = { cost: w, cuts: [f, ...k.cuts] });
    }
    return l.set(m, g), g;
  }, c = i(0, n.length);
  if (!c) return n;
  let d = 0;
  return c.cuts.map((h) => {
    const u = o(d, h);
    return d = h, u;
  });
}
function hr(e, t, r, s, n = !1) {
  const a = Ks(t);
  if (!n || a.length > 64) return ca(e, a, r, s);
  const o = [];
  let l = [];
  for (const i of a)
    i.newline ? (o.push(...l.length ? dr(e, l, r, s) : [[]]), l = []) : l.push(i);
  return l.length && o.push(...dr(e, l, r, s)), o;
}
const ot = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function Z(e, t, r, s = 24, n = 15, a = ot) {
  e.save(), e.letterSpacing = "0px", e.textBaseline = "alphabetic", e.textAlign = "left";
  try {
    let o, l = s;
    do {
      const i = [], c = [];
      let d = 0, h;
      for (const p of t) {
        let v = l, C = hr(
          e,
          p.runs,
          r.width,
          v,
          a.balanceLines
        );
        if (p.role === "flavor" && a.flavorOrphans !== !1 && C.length > 2 && C.at(-1).reduce((R, L) => R + L.width, 0) < r.width * 0.3)
          for (let R = v - 0.25; R >= v * 0.94; R -= 0.25) {
            const L = hr(
              e,
              p.runs,
              r.width,
              R,
              a.balanceLines
            );
            if (L.length < C.length) {
              v = R, C = L;
              break;
            }
          }
        if (C.length) {
          h && (h === "rules" && p.role === "flavor" ? d += l * a.flavorGap : (h !== "flavor" || p.role !== "flavor") && (d += l * a.paragraphGap));
          for (const R of C) {
            const L = Math.max(0, ...R.map(($) => $.ascent)), T = Math.max(0, ...R.map(($) => $.descent)), I = R.reduce(($, q) => $ + q.width, 0), x = r.x + (p.align === "right" ? r.width - I : p.align === "center" ? (r.width - I) / 2 : 0);
            let P = 0, A = 1 / 0, E = -1 / 0;
            for (const $ of R)
              A = Math.min(A, P + $.inkLeft), E = Math.max(E, P + $.inkRight), P += $.width;
            i.push({
              x,
              runs: R,
              role: p.role,
              baseline: d,
              width: I,
              inkBounds: [
                x + (R.length ? A : 0),
                d - L,
                R.length ? E - A : 0,
                L + T
              ]
            }), d += v * a.leading;
          }
          h = p.role;
        }
      }
      if (a.flavorSeparator !== !1)
        for (let p = 1; p < i.length; p++) {
          const v = i[p - 1], C = i[p];
          if (v.role !== "rules" || C.role !== "flavor") continue;
          const R = v.inkBounds[1] + v.inkBounds[3];
          c.push((R + C.inkBounds[1]) / 2 - 0.3);
        }
      const u = i[0]?.inkBounds[1] ?? 0, m = i.at(-1)?.inkBounds, g = m ? m[1] + m[3] - u : 0, f = Math.max(0, r.height - g), y = r.y + Math.max(0, Math.min(f, f / 2 + (a.centerOffset ?? 0))), k = Math.max(r.y, r.verticalLimits?.[0] ?? r.y), w = Math.min(
        r.y + r.height,
        r.verticalLimits?.[1] ?? r.y + r.height
      ), b = Math.max(k, Math.min(w - g, y)) - u;
      if (o = {
        size: l,
        x: r.x,
        top: u + b,
        width: r.width,
        height: g,
        overflow: g > w - k + 0.01 || i.some((p) => p.width > r.width + 0.01),
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
      }, o.overflow ||= o.lines.some(
        (p) => r.exclusions?.some(([v, C, R, L]) => {
          const [T, I, x, P] = p.inkBounds;
          return T < v + R && T + x > v && I < C + L && I + P > C;
        })
      ), !o.overflow || l <= n) break;
      l = Math.max(n, l - 0.25);
    } while (!0);
    return o;
  } finally {
    e.restore();
  }
}
function mt(e, t, r, s, n, a, o, l, i = 1 / 0) {
  const c = (m) => (m.align === void 0 || m.align === "center") && m.runs.length > 0 && m.runs.every((g) => !g.text.includes(`
`));
  if (!r.length || !r.every(c) || !t.every(c)) return null;
  const d = r.map((m) => m.runs.map((g) => g.text).join("")).join(`
`);
  if (Array.from(d.replace(/\{[^}]+\}/g, "●")).length > i) return null;
  const h = (m) => m.map((g) => ({ ...g, align: "center" })), u = Z(e, h(r), s, n, n, l);
  return u.overflow || u.lines.length > o ? null : Z(e, h(t), s, n, a, l);
}
const Js = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function Zs(e) {
  return !Js.has(e?.trim().toLowerCase() ?? "");
}
function da(e, t, r = M, s = 1) {
  const n = ue(t), a = {
    ...ot,
    flavorSeparator: t.frameAssetFamily === "eighth" ? !1 : Zs(t.setCode)
  }, [o, l, i, c] = n.rules, d = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((m) => ({ role: "rules", runs: [{ text: m }] })), h = {
    x: o * S + (t.frameAssetFamily ? 0 : 3.5),
    y: l * r + (t.frameAssetFamily ? 0 : 7),
    width: i * S - (t.frameAssetFamily ? 0 : 9.5),
    height: c * r - (t.frameAssetFamily ? 0 : 8),
    // Fit actual line ink around the existing power/toughness plate. Short
    // final lines can use the lower left area without being painted over.
    exclusions: t.power != null && t.toughness != null ? [
      [
        n.stats[0] * S - 2,
        n.stats[1] * r - 2,
        n.stats[2] * S + 4,
        n.stats[3] * r + 4
      ]
    ] : []
  }, u = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? d : d;
  if (t.rulesAlignment?.mode !== "left" && ["10e", "m10", "m11", "m12", "m13", "m14"].includes(t.setCode?.toLowerCase() ?? "") && u.every((m) => m.role === "rules")) {
    const m = mt(
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
  return Z(
    e,
    t.rulesAlignment?.mode === "left" ? d.map((m) => ({ ...m, align: "left" })) : d,
    h,
    24.5 * s,
    15 * s,
    a
  );
}
function be(e, t, r, s = J, n = 0) {
  if (t.overflow) throw Error("Magic rules text does not fit the available area.");
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", e.letterSpacing = "0px";
  for (const l of t.separators) {
    const i = e.createLinearGradient(t.x, l, t.x + t.width, l);
    i.addColorStop(0, "#17140f00"), i.addColorStop(0.15, "#17140f55"), i.addColorStop(0.85, "#17140f55"), i.addColorStop(1, "#17140f00"), e.fillStyle = i, e.fillRect(t.x, l, t.width, 0.6);
  }
  e.fillStyle = "#17140f";
  const a = n > 0 ? document.createElement("canvas") : null;
  a && (a.width = e.canvas.width, a.height = e.canvas.height);
  const o = a ? a.getContext("2d") : e;
  if (!o) throw Error("Missing rules text context");
  a && (o.setTransform(e.getTransform()), o.textAlign = "left", o.textBaseline = "alphabetic", o.letterSpacing = "0px", o.fillStyle = "#17140f");
  for (const l of t.lines) {
    let i = l.x ?? t.x;
    for (const c of l.runs)
      c.symbol ? s(
        e,
        c.text,
        i + c.size * 0.025,
        l.baseline - c.size * 0.72,
        c.size * 0.8,
        r
      ) : (o.font = Lt(c.size, c.italic), o.fillText(c.text, i, l.baseline)), i += c.width;
  }
  if (a) {
    o.globalCompositeOperation = "destination-out", o.lineJoin = "round";
    for (const l of t.lines) {
      let i = l.x ?? t.x;
      for (const c of l.runs)
        c.symbol || (o.font = Lt(c.size, c.italic), o.lineWidth = c.size * n * 2, o.strokeText(c.text, i, l.baseline)), i += c.width;
    }
    e.resetTransform(), e.drawImage(a, 0, 0), a.width = a.height = 0;
  }
  e.restore();
}
function Qs(e, t, r, s) {
  const [n, a, o, l] = Fe(r, s).rules, i = ut({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), c = { x: n, y: a, width: o, height: l }, d = {
    leading: 1.02,
    paragraphGap: 0.4,
    flavorGap: 0.65,
    centerOffset: r === "old" ? 0 : 2
  }, h = r === "old" ? 24.5 : r === "m15" ? s ? 20.25 : 24.25 : 21.5;
  if ((r !== "m15" || s) && t.rulesAlignment?.mode !== "left" && i.length === 1) {
    const u = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? i : i, m = mt(e, i, u, c, h, 13, 2, d);
    if (m) return m;
  }
  return Z(e, i, c, h, 13, d);
}
function e0(e, t, r) {
  const s = Ce(t);
  if (!s) throw Error("No native split plate for this printing.");
  if (s === "m15") return $s(e, t, r);
  const n = s !== "old" && qe(t), a = Fe(s, n);
  e.fillStyle = ge(t.setCode, t.borderColor).border, e.fillRect(0, 0, 488, 680), de(t).forEach((o, l) => {
    const i = Ws(o.face, s, n, l, r);
    e.save(), e.translate(o.x, o.y), e.rotate(-Math.PI / 2);
    const [c, d, h, u] = a.frame;
    e.drawImage(i, c - (n && l ? 8 * 680 / 523 : 0), d, h, u), e.restore();
  });
}
function t0(e, t, r, s, n) {
  if (r === "m15") return Gs(e, t, n);
  const a = Fe(r, s), o = r === "old", [l, i, c, d] = a.title, h = t.manaSymbols ?? [], u = 23.4, m = 1.7, g = 316, f = h.length * u + Math.max(0, h.length - 1) * m;
  if (e.fillStyle = o ? "#f2eee3" : "#17140f", e.textBaseline = "middle", e.textAlign = "left", o) {
    const R = e.getTransform();
    e.shadowColor = "#000b", e.shadowOffsetX = R.a + R.c, e.shadowOffsetY = R.b + R.d;
  }
  he(
    e,
    t.name,
    l,
    i + d / 2 - (o ? 2 : 0),
    Math.max(1, h.length ? g - f - l - 7 : c),
    o ? 29 : 26.5,
    !o,
    1,
    o ? "CardRenderer MTG Goudy" : "CardRenderer MTG Matrix"
  ), h.forEach(
    (R, L) => J(e, R, g - f + L * (u + m), o ? 30.5 : 40, u, n, !o)
  );
  const y = se(t), k = n.get(y ?? ""), w = De(t), [b, p, v, C] = a.type;
  if (he(
    e,
    t.typeLine ?? "",
    b,
    p + C / 2,
    v - (k ? 33 : 0),
    o ? 22 : 21.5,
    !1,
    1,
    o ? "CardRenderer MTG MPlantin" : "CardRenderer MTG Matrix"
  ), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, k) {
    const R = Math.min(
      32 / (k.width * w[2]),
      (o ? 26 : 22) / (k.height * w[3])
    ), L = k.width * w[2] * R, T = k.height * w[3] * R, I = [(o ? 306 : 316) - L, p + C / 2 - (o ? 1.5 : 0) - T / 2, L, T];
    we(y) || t.setSymbol ? e.drawImage(k, ...I) : xe(e, k, t.setCode, t.rarity, ...I, w);
  }
}
function r0(e, t, r, s, n, a) {
  const o = Fe(s, n), l = s === "old";
  e.fillStyle = l ? "#eeeae1" : "#17140f", e.textAlign = l ? "center" : "left", e.textBaseline = "middle", e.font = l ? '19px "CardRenderer MTG MPlantin", Georgia' : '700 14px "CardRenderer MTG Matrix", Georgia';
  const i = a.get(`${U}/img/manaSymbols/brush.svg`);
  if (!l && i && e.drawImage(i, 36, o.artistY - 4, 20, 8), l) {
    const c = e.getTransform();
    e.shadowColor = "#000b", e.shadowOffsetX = c.a + c.c, e.shadowOffsetY = c.b + c.d;
  }
  e.fillText(
    `${l ? "Illus. " : ""}${t.artist ?? r.artist ?? ""}`,
    l ? 177 : 60,
    o.artistY,
    272
  ), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.font = `${l ? 10.2 : 10}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && e.fillText(
    `${r.legalText}${r.collectorNumber ? " " + r.collectorNumber : ""}`,
    l ? 177 : 36,
    o.legalY,
    280
  );
}
function a0(e, t, r, s, n) {
  const a = Ce(t);
  if (!a) throw Error("No native split plate for this printing.");
  const o = a !== "old" && qe(t), l = Fe(a, o);
  e.save(), n !== "artwork" && e0(e, t, r), s && e.drawImage(s, 0, 0, 488, 680);
  for (const i of de(t))
    e.save(), e.translate(i.x, i.y), e.rotate(-Math.PI / 2), Re(e, i.face, r, l.art, n), n !== "artwork" && (t0(e, i.face, a, o, r), Ds(e, i.face, r, l.rules[1] + l.rules[3] / 2), be(e, Qs(e, i.face, a, o), r), a !== "m15" && r0(e, i.face, t, a, o, r)), e.restore();
  if (a === "m15" && n !== "artwork" && Es(e, t, r), o && n !== "artwork") {
    e.translate(0, 680), e.rotate(-Math.PI / 2);
    const i = ra(t).map(
      (c) => a === "m15" ? { ...c, align: "center" } : c
    );
    be(
      e,
      Z(
        e,
        i,
        a === "m15" ? { x: 70, y: 441, width: 577, height: 20 } : { x: 38, y: 407, width: 608, height: 26 },
        a === "m15" ? 18 : 21,
        12
      ),
      r
    );
  }
  e.restore();
}
let ur;
function s0(e) {
  return Ce(e) !== "eighth" ? Promise.resolve() : ur ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('24px "CardRenderer MTG Matrix"')
  ]).then((t) => {
    if (t.some((r) => !r.length || r.some((s) => s.status !== "loaded")))
      throw Error("Split Matrix fonts are unavailable. Load card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw ur = void 0, t;
  });
}
const n0 = {
  maximumSize: 20.7,
  padding: 24,
  equalCells: 0,
  lastLift: 0,
  bottomSpace: 0.15
};
function o0(e, t, r = n0) {
  const s = Xe(t), n = s.filter((f) => !f.badges.length), a = s.filter((f) => f.badges.length), o = (f, y = !1) => [
    {
      role: "rules",
      runs: y ? [{ text: f, italic: !0 }] : f.split(/(\([^)]*\))/g).filter(Boolean).map((k) => ({ text: k, italic: k.startsWith("(") }))
    }
  ], l = { leading: 0.98, paragraphGap: 0.3, flavorGap: 0 }, i = n.length ? 201 : 80, c = t.reverseStats && t.layout === "transform" ? 535 : 569, d = Z(
    e,
    n.flatMap((f) => o(f.text, f.reminder)),
    { x: 42.3, y: 78, width: 197, height: i - 80 },
    20.4,
    12,
    { ...l, centerOffset: -3 }
  );
  let h = r.maximumSize, u = [], m = [];
  for (; ; ) {
    const f = a.map(
      (p) => Math.max(
        Z(
          e,
          o(p.text),
          { x: 65.1, y: 0, width: 171, height: 2e3 },
          h,
          h,
          l
        ).height + r.padding,
        43 + Math.max(0, p.badges.length - 1) * 49 + 12
      )
    ), y = c - i;
    if (f.reduce((p, v) => p + v, 0) > y && h > 12) {
      h = Math.max(12, h - 0.25);
      continue;
    }
    if (f.reduce((p, v) => p + v, 0) > y)
      throw Error("Saga chapter text or badges do not fit the available column.");
    const k = Math.max(0, y - f.reduce((p, v) => p + v, 0)) * (1 - (a.length === 2 && a[0].badges.length > 1 ? r.bottomSpace : 0)) / Math.max(1, a.length);
    m = f.map((p) => p + k);
    const w = y / Math.max(1, a.length);
    m = m.map((p) => p * (1 - r.equalCells) + w * r.equalCells);
    let b = i;
    u = a.map((p, v) => {
      const C = m[v], R = Z(
        e,
        o(p.text),
        { x: 65.1, y: b + 7, width: 171, height: C - 14 },
        h,
        h,
        { ...l, centerOffset: v === a.length - 1 ? -r.lastLift : 0 }
      );
      return b += C, R;
    });
    break;
  }
  let g = i;
  return {
    reminder: d,
    size: h,
    rows: a.map((f, y) => {
      const k = { ...f, top: g, height: m[y], layout: u[y] };
      return g += k.height, k;
    })
  };
}
function l0(e, t, r, s, n) {
  const a = (C) => {
    const R = r.get(C);
    if (!R) throw Error(`Saga asset unavailable: ${C}`);
    return R;
  };
  e.save(), e.fillStyle = "#090806", e.fillRect(0, 0, S, M), s && e.drawImage(s, 0, 0, S, M), n !== "artwork" && (e.drawImage(a(Fr(t)), 0, 0, S, M), Ka(e, t, r));
  const o = Nr.art;
  if (Re(e, t, r, [o[0] * S, o[1] * M, o[2] * S, o[3] * M], n), n === "artwork") {
    e.restore();
    return;
  }
  const l = Rt(t);
  l && e.drawImage(a(l), 33.5, 35.6, 29, 32), e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const i = t.manaSymbols ?? [], c = 23.4, d = 1.8, h = 452, u = i.length * c + Math.max(0, i.length - 1) * d, m = t.layout === "transform" ? 78 : 41.7;
  he(
    e,
    t.name,
    m,
    51,
    (i.length ? h - u - 8 : 449) - m,
    26,
    !0
  ), i.forEach(
    (C, R) => J(e, C, h - u + R * (c + d), 38.7, c, r, !0)
  );
  const g = se(t), f = r.get(g ?? ""), y = De(t), k = f ? Math.min(58.56 / (f.width * y[2]), 25.9 / (f.height * y[3])) : 0, w = f ? f.width * y[2] * k : 0, b = f ? f.height * y[3] * k : 0, p = [450.3 - w, 594.25 - b / 2, w, b];
  he(
    e,
    t.typeLine ?? "",
    41.7,
    594.5,
    (f ? p[0] - 7 : 449) - 41.7,
    22,
    !0
  ), f && (we(g) || t.setSymbol ? e.drawImage(f, ...p) : xe(e, f, t.setCode, t.rarity, ...p, y)), t.reverseStats && t.layout === "transform" && (e.fillStyle = "#65605a", e.font = 'italic 20px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.fillText(`${t.reverseStats.power}/${t.reverseStats.toughness}`, 41, 553));
  const v = o0(e, t);
  be(e, v.reminder, r);
  for (const C of v.rows)
    e.drawImage(a(Ur), 48.8, C.top - 1, 192.6, 2), be(e, C.layout, r), C.badges.forEach((R, L) => {
      const T = C.top + C.height / 2 + (L - (C.badges.length - 1) / 2) * 49;
      e.drawImage(a(_r), 18.8, T - 21.4, 38.4, 42.8), e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = '550 22px "CardRenderer MTG Chapter", Georgia', e.fillText(R, 38.1, T + 0.7);
    });
  ["rare", "mythic"].includes(t.rarity ?? "") && e.drawImage(a(ct), 213.7, 620.2, 60.5, 25.3), e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""}  ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.font = '11px "CardRenderer MTG Artist Credit", serif', t.artist && e.fillText("a", 93, 658), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(t.artist ?? "", 108, 658, 210), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 646, 182)), e.restore();
}
let mr = null;
function i0() {
  return mr ??= document.fonts.load('550 22px "CardRenderer MTG Chapter"').then((e) => {
    if (!e.length || e.some((t) => t.status !== "loaded"))
      throw Error("Saga chapter numerals need card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw mr = null, e;
  });
}
function c0(e, t, r) {
  const [s, n, a, o] = (r ? Et : Gt).rules, l = ut({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), i = { x: s, y: n, width: a, height: o }, c = {
    leading: 0.98,
    paragraphGap: 0.32,
    flavorGap: 0.65,
    centerOffset: r ? 0 : 2.5
  };
  let d = r ? 22 : t.setCode?.toLowerCase() === "hou" ? 24.5 : 22.5, h = Z(e, l, i, d, 14, c);
  if (!r && l.length === 1 && h.lines.length > 1 && h.lines.at(-1).width < a * 0.18)
    for (let u = d - 0.25; u >= d * 0.9; u -= 0.25) {
      const m = Z(e, l, i, u, u, c);
      if (!m.overflow && m.lines.length < h.lines.length) {
        d = u, h = m;
        break;
      }
    }
  if (!r && t.rulesAlignment?.mode !== "left") {
    const u = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? l : l, m = mt(
      e,
      l,
      u,
      i,
      d,
      14,
      1,
      c
    );
    if (m) return m;
  }
  return h;
}
function d0(e, t, r, s, n) {
  const a = de(t), o = (l) => {
    const i = r.get(l);
    if (!i) throw Error(`Aftermath asset unavailable: ${l}`);
    return i;
  };
  e.save(), e.fillStyle = "#090806", e.fillRect(0, 0, 488, 680), s && e.drawImage(s, 0, 0, 488, 680), n !== "artwork" && a.forEach((l, i) => {
    e.save(), e.beginPath(), e.rect(0, i ? Le : 0, 488, i ? 680 - Le : Le), e.clip(), e.drawImage(o(Xr(l.face)), 0, 0, 488, 680), e.restore();
  }), a.forEach((l, i) => {
    e.save(), i && (e.translate(488, Le), e.rotate(Math.PI / 2));
    const c = l.face, d = i ? Et : Gt;
    if (Re(e, c, r, d.art, n), n !== "artwork") {
      e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
      const h = c.manaSymbols ?? [], u = 23.4, m = 1.6, g = i ? 246 : 451, f = h.length * u + Math.max(0, h.length - 1) * m, [y, k] = d.title;
      he(e, c.name, y, k + 15.5, g - f - y - 7, 26, !0), h.forEach(
        (b, p) => J(e, b, g - f + p * (u + m), k + 3, u, r, !0)
      );
      const w = i ? void 0 : r.get(se(c) ?? "");
      if (he(
        e,
        c.typeLine ?? "",
        d.type[0],
        d.type[1] + 16.5,
        d.type[2] - (w ? 45 : 0),
        23,
        !0
      ), w) {
        const b = De(c), p = Math.min(50 / (w.width * b[2]), 27 / (w.height * b[3])), v = w.width * b[2] * p, C = w.height * b[3] * p, R = [451 - v, 252.3 - C / 2, v, C];
        we(se(c)) || c.setSymbol ? e.drawImage(w, ...R) : xe(e, w, c.setCode, c.rarity, ...R, b);
      }
      be(e, c0(e, c, !!i), r);
    }
    e.restore();
  }), n !== "artwork" && (["rare", "mythic"].includes(t.rarity ?? "") && e.drawImage(o(qr), 222, 623, 43, 20), e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""}  ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.font = '11px "CardRenderer MTG Artist Credit", serif', t.artist && e.fillText("a", 93, 658), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(t.artist ?? "", 108, 658, 220), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 646, 177))), e.restore();
}
function At([e, t, r]) {
  const s = Math.max(e, t, r), n = s - Math.min(e, t, r);
  return [((n === 0 ? 0 : s === e ? (t - r) / n : s === t ? (r - e) / n + 2 : (e - t) / n + 4) * 60 % 360 + 360) % 360, s === 0 ? 0 : n / s, s];
}
function h0(e, t, r) {
  const s = (e % 360 + 360) % 360 / 60, n = r * t, a = n * (1 - Math.abs(s % 2 - 1)), o = r - n, l = s < 1 ? [n, a, 0] : s < 2 ? [a, n, 0] : s < 3 ? [0, n, a] : s < 4 ? [0, a, n] : s < 5 ? [a, 0, n] : [n, 0, a];
  return [l[0] + o, l[1] + o, l[2] + o];
}
function gr(e, t) {
  const [r, s, n] = At(e);
  return h0(
    r + t.hueDegrees,
    Math.min(1, s * t.saturationScale),
    Math.min(1, n * t.brightnessScale)
  );
}
const fr = (e) => {
  const t = Math.max(0, Math.min(1, e));
  return t * t * (3 - 2 * t);
}, St = (e) => {
  const t = Math.max(1e-3, e[0] + e[1] + e[2]);
  return e.map((r) => r / t);
};
function u0(e, t) {
  const { width: r, height: s, data: n } = e, a = new Float32Array(r * s);
  if (t.kind === "rect") {
    const [b, p, v, C] = t.rect;
    for (let R = 0; R < s; R++)
      for (let L = 0; L < r; L++) {
        const T = Math.min(
          L / r - b,
          b + v - L / r,
          R / s - p,
          p + C - R / s
        );
        a[R * r + L] = fr(T / t.feather + 0.5);
      }
    return a;
  }
  const o = St(t.frameRgb), l = St(t.paperRgb), i = l.map((b, p) => b - o[p]), c = i.reduce((b, p) => b + p * p, 0);
  if (c < 1e-3) throw Error("Paper and frame chroma are too similar for this mask.");
  const [d, h, u, m] = t.bounds;
  for (let b = 0; b < s; b++)
    for (let p = 0; p < r; p++) {
      if (p / r < d || p / r > d + u || b / s < h || b / s > h + m)
        continue;
      const v = b * r + p, C = v * 4;
      if (n[C + 3] < 250) continue;
      const L = St([n[C] / 255, n[C + 1] / 255, n[C + 2] / 255]).reduce((T, I, x) => T + (I - o[x]) * i[x], 0) / c;
      a[v] = fr((L - 0.22) / 0.56);
    }
  const g = new Uint8Array(a.length), f = new Int32Array(a.length), y = Math.round(t.seed[1] * s) * r + Math.round(t.seed[0] * r);
  if (!(a[y] > 0.08)) throw Error("Paper mask seed is outside the paper.");
  let k = 0, w = 1;
  for (f[0] = y, g[y] = 1; k < w; ) {
    const b = f[k++], p = b % r;
    for (const v of [b - r, b + r, p ? b - 1 : -1, p < r - 1 ? b + 1 : -1])
      v >= 0 && v < g.length && !g[v] && a[v] > 0.08 && (g[v] = 1, f[w++] = v);
  }
  for (let b = 0; b < a.length; b++) g[b] || (a[b] = 0);
  return a;
}
function m0(e, t) {
  const r = "mask" in t ? t : void 0, s = r ? u0(e, r.mask) : void 0, n = "mask" in t ? t.frame : t;
  for (let a = 0; a < e.data.length; a += 4) {
    if (e.data[a + 3] === 0) continue;
    const o = [e.data[a] / 255, e.data[a + 1] / 255, e.data[a + 2] / 255], l = Math.max(...o), i = l === 0 ? 0 : (l - Math.min(...o)) / l;
    if (l < 0.075 || !r && i < 0.025 && l > 0.97) continue;
    const c = s?.[a / 4] ?? 0, d = gr(o, c === 1 && r ? r.paper : n), h = c > 0 && c < 1 && r ? gr(o, r.paper) : d;
    for (let u = 0; u < 3; u++)
      e.data[a + u] = Math.round(
        Math.round(255 * d[u]) * (1 - c) + Math.round(255 * h[u]) * c
      );
  }
}
class g0 {
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
      const o = this.entries.get(a.key);
      if (o && o.bytes !== a.bytes)
        throw Error("Material cache key has inconsistent dimensions");
      return n + (o ? 0 : a.bytes);
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
          const o = {
            users: 0,
            bytes: n.bytes,
            accounted: !0,
            retired: !1,
            promise: Promise.resolve().then(async () => {
              this.builds++;
              const l = await n.build();
              if (l.width * l.height * 4 !== n.bytes)
                throw l.close(), Error("Derived bitmap dimensions differ from its cache reservation");
              return o.bitmap = l, l;
            })
          };
          o.promise = o.promise.catch((l) => {
            throw this.entries.get(n.key) === o && this.entries.delete(n.key), o.retired = !0, this.destroy(o), this.notify(), l;
          }), this.entries.set(n.key, o), a = o;
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
        this.waiting.delete(a), t.removeEventListener("abort", o);
      }, a = () => {
        n(), r();
      }, o = () => {
        n(), s(t.reason);
      };
      this.waiting.add(a), t.addEventListener("abort", o, { once: !0 });
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
    if (t.some((a) => !Number.isSafeInteger(a.bytes) || a.bytes < 1) || t.reduce((a, o) => a + o.bytes, 0) > this.limit)
      throw RangeError("Material batch exceeds derived-image budget");
    let s;
    for (; !(s = this.admit(t)); )
      await this.wait(r), r.throwIfAborted();
    const n = s.map((a) => {
      let o = !1;
      return () => {
        o || (o = !0, a.users--, a.retired && !a.users && this.destroy(a), this.notify());
      };
    });
    try {
      const o = (await Promise.allSettled(s.map((l) => l.promise))).find((l) => l.status === "rejected");
      if (o?.status === "rejected") throw o.reason;
      return r.throwIfAborted(), s.map((l, i) => ({ value: l.bitmap, release: n[i] }));
    } catch (a) {
      for (const o of n) o();
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
const ha = new g0(16 * 1024 * 1024), to = () => ha.clear(), f0 = {
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
}, p0 = {
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
function Nt(e) {
  const t = ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "");
  return ke(e) && (!e.layout || e.layout === "normal") && (e.colorCalibration === "set-hsb-v1" || t && e.colorCalibration === "early-hsb-v1");
}
function b0(e) {
  if (!Nt(e)) return;
  const t = Ae(e), r = t.split("/").at(-1).replace(".png", "").toUpperCase(), s = f0[`${e.setCode?.toLowerCase()}-${pe(e)}-${r}`];
  if (!(s?.asset !== t || !s.rect.every((n, a) => n === Jr(e)[a])))
    return t.endsWith("/old/fourth/w.png") ? {
      ...s.adjustment,
      mask: {
        kind: "rect",
        rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
        feather: 2 / 1500
      }
    } : s.adjustment;
}
function w0(e, t) {
  if (Nt(e))
    return p0[`${e.setCode?.toLowerCase()}-${pe(e)}-${t}`];
}
async function k0(e, t, r) {
  const s = { images: t, dispose() {
  } };
  if (!Nt(e)) return s;
  const n = b0(e), a = /* @__PURE__ */ new Map(), o = {};
  n && a.set(Ae(e), n);
  const l = /* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...[...(e.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((h) => h[1])
  ]);
  for (const h of e.rulesParagraphs ?? [])
    for (const u of h.runs) for (const m of u.text.matchAll(/\{([^}]+)\}/g)) l.add(m[1]);
  l.add("W");
  for (const h of l) {
    const u = /^\d+$/.test(h) ? "N" : h, m = w0(e, u), g = Os[u];
    if (!m || !g) continue;
    const f = dt(h);
    f && a.set(f, v0(g, m)), o[h] = `rgb(${m.map((y) => Math.round(y * 255)).join(" ")})`;
  }
  if (!a.size && !Object.keys(o).length) return s;
  const i = Object.assign(new Map(t), { manaColors: o }), c = [...a].flatMap(([h, u]) => {
    const m = t.get(h);
    return m ? [{ url: h, source: m, adjustment: u }] : [];
  });
  let d = [];
  try {
    return d = await ha.acquireMany(
      c.map(({ url: h, source: u, adjustment: m }) => ({
        key: y0(h, u.width, u.height, m),
        bytes: u.width * u.height * 4,
        build: () => S0(u, m)
      })),
      r
    ), c.forEach(({ url: h }, u) => i.set(h, d[u].value)), { images: i, dispose: () => d.forEach((h) => h.release()) };
  } catch (h) {
    throw d.forEach((u) => u.release()), h;
  }
}
function y0(e, t, r, s) {
  return JSON.stringify(["frame-hsb-paper-mask-v3", e, t, r, s]);
}
async function S0(e, t) {
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  try {
    const s = r.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("HSB preparation needs Canvas2D.");
    s.drawImage(e, 0, 0);
    const n = s.getImageData(0, 0, r.width, r.height);
    return m0(n, t), s.putImageData(n, 0, 0), await createImageBitmap(r);
  } finally {
    r.width = r.height = 0;
  }
}
function v0(e, t) {
  const r = [
    parseInt(e.slice(1, 3), 16) / 255,
    parseInt(e.slice(3, 5), 16) / 255,
    parseInt(e.slice(5, 7), 16) / 255
  ], [s, n, a] = At(r), [o, l, i] = At(t);
  if (n <= 0 || a <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (o - s + 540) % 360 - 180,
    saturationScale: l / n,
    brightnessScale: i / a
  };
}
const C0 = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", pr = {
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
}, br = {
  m15: { family: "m15-accurate", delta: [1, 0, 1, 1] },
  m21: { family: "m15-accurate", delta: [2, 0, 1.1, 1.06] },
  woe: { family: "m15-accurate", delta: [2, 0, 1.08, 1.08] },
  tdm: { family: "m15-accurate", delta: [0, 0, 1.08, 1.08] },
  "8ed": { family: "eighth", delta: [-4, 0, 1, 0.92] },
  "9ed": { family: "eighth", delta: [0, 1, 0.9, 0.92] }
};
function R0(e, t, r) {
  const s = e.setCode?.toLowerCase() ?? "", n = Object.hasOwn(br, s) ? br[s] : void 0;
  let a = r;
  return n && !e.setSymbol && we(t) && n.family === e.frameAssetFamily && (a = ua(r, n.delta)), e.frameAssetFamily ? Yt(e, t, a, e.frameAssetFamily) : a;
}
function Yt(e, t, r, s) {
  if (e.setSymbol || !we(t) || U !== C0 || (e.layout ?? "normal") !== "normal" || ["component", "m15-accurate"].includes(s) && ne(e).legendary)
    return r;
  const n = e.borderColor ?? (s === "retro" ? pe(e) : ge(e.setCode).border === "#eeedeb" ? "white" : "black"), a = `${e.setCode?.trim().toLowerCase() ?? ""}/${s}/${n}`, o = Object.hasOwn(pr, a) ? pr[a] : void 0;
  return o ? ua(r, o) : r;
}
function ua(e, t) {
  const [r, s, n, a] = e, [o, l, i, c] = t;
  return [r + n + o - n * i, s + a / 2 + l - a * c / 2, n * i, a * c];
}
const T0 = 0.045;
function M0(e) {
  return ke(e) ? Za : T0;
}
const vt = "#fbf0c5", Je = "#ccdaf2", wr = "#9c9995", Ct = "#edaa8d", Ze = "#dde6e2", I0 = {
  WU: [vt, Je],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [Ct, vt],
  WG: [Ze, vt],
  UB: [Je, wr],
  UR: [Je, Ct],
  UG: [Ze, Je],
  BR: ["#b4afb5", "#f2b096"],
  BG: [wr, Ze],
  RG: [Ct, Ze]
};
function L0(e, t, r) {
  if (!t.land) return;
  const s = I0[t.frame];
  if (!s) return;
  const n = 34 + r, a = 420 - 2 * r, o = e.createLinearGradient(n, 0, n + a, 0);
  o.addColorStop(0, s[0]), o.addColorStop(0.35, s[0]), o.addColorStop(0.65, s[1]), o.addColorStop(1, s[1]), e.save(), e.globalCompositeOperation = "multiply", e.fillStyle = o, e.fillRect(n, 425, a, 203.5), e.restore();
}
function A0(e, t, r, s) {
  if (!t.land || t.frame !== "Artifact") {
    s();
    return;
  }
  const n = 34 + r, a = 420 - 2 * r;
  for (const o of [!1, !0])
    e.save(), e.beginPath(), o || e.rect(0, 0, 488, 680), e.rect(n, 425, a, 203.5), e.clip("evenodd"), e.filter = `grayscale(1) brightness(${o ? 0.9 : 0.63})`, s(), e.restore();
}
function ma(e) {
  if (e.setSymbol) return null;
  const t = e.setCode?.toLowerCase();
  return t === "m15" || t === "war" ? t : null;
}
function ga(e, t, r, s, n, a, o, l, i, c) {
  const [d, h, u, m] = c ? r === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, r === "m15" ? 0.7 : 1.2];
  n += h - o * (d - 1) / 2, a += u - l * (d - 1) / 2, o *= d, l *= d;
  const g = !s || s === "common", f = document.createElement("canvas"), y = 3, k = 4;
  f.width = Math.ceil((o + y * 2) * k), f.height = Math.ceil((l + y * 2) * k);
  const w = f.getContext("2d");
  w.scale(k, k), w.translate(y, y), w.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    0,
    0,
    o,
    l
  ), w.globalCompositeOperation = "source-in";
  const b = s === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : s === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], p = w.createLinearGradient(0, l * 0.65, o, l * 0.35);
  p.addColorStop(0, b[0]), p.addColorStop(0.35, b[1]), p.addColorStop(0.6, b[2]), p.addColorStop(1, b[3]), w.fillStyle = g ? "#111111" : p, w.fillRect(0, 0, o, l);
  const v = r === "m15" ? 32 : 27, C = new Path2D(
    r === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), R = new DOMMatrix().translate(-i[0] * o / i[2], -i[1] * l / i[3]).scale(o / (v * i[2]), l / (32 * i[3])), L = new Path2D();
  L.addPath(C, R), w.globalCompositeOperation = "destination-over", w.fillStyle = g ? "#f8f8f5" : "#111111", w.fill(L), w.strokeStyle = w.fillStyle, w.lineWidth = r === "war" && g ? 2 : m, w.lineJoin = "round", w.stroke(L), e.drawImage(
    f,
    n - y,
    a - y,
    f.width / k,
    f.height / k
  ), f.width = f.height = 0;
}
const kr = {
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
function x0(e) {
  if ((e.layout ?? "normal") !== "normal") return;
  const t = `${e.setCode?.toLowerCase() ?? ""}/${pe(e)}`;
  return Object.hasOwn(kr, t) ? kr[t] : void 0;
}
function B0(e, t) {
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
  const n = z(t), a = !/\bLand\b/.test(t.typeLine ?? "") && !(n.length === 1 && ["W", "R"].includes(n[0]));
  e.fillStyle = a ? "#f2eee3" : "#17140f";
  const o = r === "usg" ? 1998 : 1999, l = t.collectorNumber ? ` ${t.collectorNumber}/${r === "usg" ? 350 : 143}` : "", i = t.legalText === void 0 ? `©1993–${o} Wizards of the Coast, Inc.${l}` : t.legalText;
  return i && e.fillText(i, 244, 640, 365), e.restore(), !0;
}
function O0(e, t, r) {
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
function $0(e, t) {
  const r = 52.053333333333335, s = 1255 / 2100 * 680, n = 1346 / 1500 * 488, a = 1861 / 2100 * 680, o = 17 / 1500 * 488, l = 17 / 2100 * 680, i = (d) => {
    e.moveTo(...d[0]);
    for (const h of d.slice(1)) e.lineTo(...h);
    e.closePath();
  };
  e.save();
  const c = e.filter;
  e.filter = "none", e.fillStyle = "#00000047", e.beginPath(), i([
    [r, s],
    [n, s],
    [n - o, s + l],
    [r + o, s + l]
  ]), i([
    [n, s],
    [n, a],
    [n - o, a - l],
    [n - o, s + l]
  ]), e.fill(), e.beginPath(), i([
    [r, s],
    [r + o, s + l],
    [r + o, a - l],
    [r, a]
  ]), i([
    [r, a],
    [r + o, a - l],
    [n - o, a - l],
    [n, a]
  ]), e.clip(), e.filter = `${c === "none" ? "" : c + " "}brightness(1.35)`, e.drawImage(t, 0, 0, 488, 680), e.restore();
}
const H = {
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
}, G0 = {
  W: { ...H.por, right: 436.75, centerY: 389.75 },
  U: { ...H.por, right: 436.5, centerY: 392.75 },
  R: { ...H.por, right: 433.75, centerY: 392 },
  G: { ...H.por, right: 434, centerY: 390.75 }
}, E0 = {
  all: {
    U: { ...H.all, right: 427.5, centerY: 393.25 },
    W: { ...H.all, right: 427.25, centerY: 392.75 }
  },
  mir: {
    G: { ...H.mir, right: 437, centerY: 390.25 },
    W: { ...H.mir, right: 437.75, centerY: 389.25 }
  },
  sth: {
    G: { ...H.sth, right: 434, centerY: 391 },
    R: { ...H.sth, right: 433.5, centerY: 391.75 },
    W: { ...H.sth, right: 435.25, centerY: 389.25 }
  },
  tmp: {
    U: { ...H.tmp, right: 433, centerY: 392.75 },
    W: { ...H.tmp, right: 433.25, centerY: 389.5 }
  },
  vis: {
    W: { ...H.vis, right: 437.5, centerY: 389.25 }
  },
  wth: {
    W: { ...H.wth, right: 435.75, centerY: 389.75 }
  },
  hml: {
    R: { ...H.hml, right: 437.75, centerY: 393.5 }
  },
  por: G0
};
function j0(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  if (e.setSymbol || !Object.hasOwn(H, t)) return null;
  const r = z(e);
  return r.length === 1 && !/\b(?:Land|Artifact)\b/.test(e.typeLine ?? "") ? E0[t]?.[r[0]] ?? H[t] : H[t];
}
function P0(e) {
  return e.setSymbol || e.setCode?.toLowerCase() !== "exo" ? null : e.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : e.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const xt = {
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
}, fa = (e) => `${e}#opaque-print-details-v1`, W0 = (e) => Object.keys(xt).some((t) => e === `${Te.KEYRUNE_ROOT}/${t}.svg`);
async function D0(e, t) {
  const r = Object.keys(xt).find((d) => e === `${Te.KEYRUNE_ROOT}/${d}.svg`);
  if (!r) return null;
  const s = new DOMParser().parseFromString(await t.text(), "image/svg+xml"), n = s.documentElement, a = s.querySelectorAll("path"), o = a[0]?.getAttribute("d") ?? "", l = o.match(/M[^M]*/g) ?? [], i = xt[r];
  if (n.localName !== "svg" || s.querySelector("parsererror") || a.length !== 1 || l.length !== i.count || l.some((d) => /m/.test(d) || !/[zZ]\s*$/.test(d)))
    throw new Error(`Unexpected pinned ${r} symbol paths.`);
  const c = s.createElementNS("http://www.w3.org/2000/svg", "path");
  return c.setAttribute("d", i.white.map((d) => l[d]).join("")), c.setAttribute("fill", "#fff"), n.replaceChildren(c), new Blob([new XMLSerializer().serializeToString(s)], { type: "image/svg+xml" });
}
function F0(e, t, r, s = !1) {
  pa(
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
function _0(e, t, r, s = !1) {
  pa(
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
function pa(e, t, r, s, n) {
  t.forEach((a, o) => {
    const { size: l } = s, i = s.right - (t.length - 1 - o) * s.pitch - l / 2, c = s.centerY - l / 2;
    if (a !== "W" || n) {
      J(e, a, i, c, l, r, !1);
      return;
    }
    wa(e, i, c, l, s.whiteSize, r.manaColors?.W);
  });
}
const ba = (e, t, r, s, n, a) => {
  if (t !== "W") return J(e, t, r, s, n, a);
  wa(e, r, s, n, n * 0.87, a.manaColors?.W);
};
function wa(e, t, r, s, n, a = "#efe7cb") {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = a, e.beginPath(), e.arc(t + s / 2, r + s / 2, s / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = '100px "CardRenderer MTG Historic Symbols"', e.textAlign = "left", e.textBaseline = "alphabetic";
  const o = "", l = e.measureText(o), i = l.actualBoundingBoxLeft + l.actualBoundingBoxRight, c = l.actualBoundingBoxAscent + l.actualBoundingBoxDescent, d = n / Math.max(i, c);
  e.translate(t + s / 2, r + s / 2), e.scale(d, d), e.fillText(
    o,
    (l.actualBoundingBoxLeft - l.actualBoundingBoxRight) / 2,
    (l.actualBoundingBoxAscent - l.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function U0(e, t, r, s, n, a) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0;
  const o = document.createElement("canvas");
  o.width = e.canvas.width, o.height = e.canvas.height;
  const l = o.getContext("2d");
  if (!l) throw Error("Retro lettering needs a Canvas2D context");
  const i = e.getTransform();
  l.font = e.font, l.textAlign = e.textAlign, l.textBaseline = e.textBaseline, l.letterSpacing = e.letterSpacing, e.resetTransform();
  for (const [c, d, h] of [
    [0, a, "#f2eee3"],
    [a, 0, "#17140f"]
  ])
    l.resetTransform(), l.clearRect(0, 0, o.width, o.height), l.setTransform(i), l.globalCompositeOperation = "source-over", l.fillStyle = h, l.fillText(t, r + c, s + c, n), l.globalCompositeOperation = "destination-out", l.fillText(t, r + d, s + d, n), e.drawImage(o, 0, 0);
  o.width = o.height = 0, e.restore();
}
function Ht(e, t, r, s, n, a) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#17140f", e.fillText(t, r + a, s + a, n), e.fillStyle = "#ababab", e.fillText(t, r, s, n), e.restore();
}
function N0(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function Y0(e, t) {
  e.save(), e.font = '22.5px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", Ht(e, `Illus. © ${t}`, 49, 631, 338, 1.25), e.restore();
}
const lt = (e) => e?.runs.map((t) => t.text).join("") ?? "", yr = (e) => e.length === 2 && /^[A-Za-z ,]+$/.test(lt(e[0])) && lt(e[0]).length <= 20;
function H0(e, t, r, s, n, a, o, l) {
  const i = (m) => m.role === "rules" && m.runs.length > 0 && !lt(m).includes(`
`) && m.align === void 0;
  if (!r.length || !r.every(i) || t.some((m) => m.align) || r.length !== 1 && !yr(r)) return null;
  const c = (m) => m.map(
    (g, f) => ({
      ...g,
      align: g.align ?? (g.role === "flavor" || yr(m) && f === 0 && !/^Enchant\b/.test(lt(g)) ? "left" : "center")
    })
  ), d = { x: 70, y: s - 6, width: 348, height: n - 8 }, h = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, u = Z(e, c(r), d, a, a, h);
  return u.overflow || u.lines.length > 5 ? null : Z(
    e,
    c(t),
    { ...d, verticalLimits: l },
    a,
    o,
    h
  );
}
const Ue = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: !1,
  flavorSeparator: !1
};
function z0(e, t) {
  if (Dt(t)) return null;
  const [r, s, n, a] = ie(Wt(t).rules), o = jt(t), l = o?.paragraphs ?? ut({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), i = t.rulesAlignment?.mode === "left", c = i ? l.map((T) => ({ ...T, align: "left" })) : l, d = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? c : c, h = t.wordingMode === "oracle" ? 10 : 15, u = t.setCode?.toLowerCase(), m = u === "lea" && t.wordingMode === "oracle" ? [428, 590] : void 0, g = ["lea", "leb", "2ed"].includes(u ?? ""), f = g || u === "3ed" && ce(t) === "fourth";
  if (f && !i) {
    const T = H0(
      e,
      c,
      d,
      s,
      a,
      g ? 32.5 : 27.5,
      h,
      m
    );
    if (T) return T;
  }
  const y = d.length === 1 ? d[0] : void 0, k = y?.runs.length === 1 ? y.runs[0] : void 0;
  if (!i && u === "4ed" && ce(t) === "fourth" && d.some((T) => T.role === "flavor")) {
    const T = mt(
      e,
      c,
      d,
      { x: 72, y: s + 2, width: 344, height: a - 8 },
      25,
      h,
      5,
      {
        ...Ue,
        leading: 1.1,
        paragraphGap: 0,
        flavorGap: 0,
        balanceLines: !0
      },
      150
    );
    if (T) return T;
  }
  const w = !i && u === "4ed" && ce(t) === "fourth" && c.every((T) => T.align === void 0 || T.align === "center") && y?.role === "rules" && (y.align === void 0 || y.align === "center") && k && !k.italic && !k.text.includes(`
`) && k.text.length > 0 && k.text.length <= 100, b = (f || u === "4ed" && ce(t) === "fourth") && (c.length > 1 || c.reduce((T, I) => T + I.runs.reduce((x, P) => x + P.text.length, 0), 0) > 100), p = b && f, v = b && u === "4ed", C = (u === "mir" || u === "tmp") && !o && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") && z(t).join("") === "W", R = Z(
    e,
    w ? c.map((T) => ({ ...T, align: "center" })) : c,
    {
      x: f ? 70 : v || w ? 72 : r,
      y: s + (o ? 1.5 : w ? -6 : v ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: f ? 346 : v || w ? 344 : n + (C ? 10 : 0),
      height: a - 8,
      verticalLimits: m
    },
    o ? 24 : w ? 25 : 22.5,
    h,
    w ? { ...Ue, leading: 1, balanceLines: !0 } : b ? {
      ...Ue,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: p ? -10 : 0
    } : Ue
  ), L = c.reduce(
    (T, I) => T + I.runs.reduce((x, P) => x + P.text.length, 0),
    0
  );
  return !p || L <= 270 || R.size >= 22 ? R : Z(
    e,
    c,
    { x: 70, y: s + 4, width: 346, height: a + 8, verticalLimits: m },
    15.5,
    h,
    {
      ...Ue,
      leading: 1.25,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: -18
    }
  );
}
function q0(e) {
  return e.setCode?.toLowerCase() === "3ed" && ce(e) === "fourth";
}
function X0(e, t, r, s, n) {
  e.save(), e.font = '26px "CardRenderer MTG Goudy", Georgia', Ht(e, t, 40, s, n + r - 40, 1), e.restore();
}
function V0(e, t, r) {
  e.save(), e.font = '26px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "right", U0(e, t, 451, r + 12, 130, 1.25), e.restore();
}
function K0(e, t) {
  e.save(), e.font = '22px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", Ht(e, `Illus. © ${t}`, 50, 642, 338, 1.25), e.restore();
}
function J0(e) {
  return ["4ed", "5ed"].includes(e.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(e.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function Sr(e) {
  const t = String(e.toughness ?? ""), r = e.wordingMode !== "oracle" && e.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(t) ? `(${t})` : t;
  return `${e.power ?? ""}/${r}`;
}
function Z0(e) {
  const t = e.setCode?.toLowerCase(), r = t === "4ed" && !/\bLand\b/.test(e.typeLine ?? "");
  if (t !== "mir" && t !== "tmp" && !r) return null;
  const s = z(e);
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
const zt = (e, t, r, s, n, a) => {
  if (t !== "T") return J(e, t, r, s, n, a);
  ka(e, r, s, n, "", 0.88);
}, Bt = (e, t, r, s, n, a) => {
  if (t !== "T") return ba(e, t, r, s, n, a);
  ka(e, r, s, n, "", 0.8);
}, Q0 = (e, t, r, s, n, a) => {
  if (t !== "T") return J(e, t, r, s, n, a);
  zt(e, t, r, s, n, a);
}, en = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function tn(e) {
  const t = e?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(t) || ["lea", "leb", "2ed", "arn", "atq"].includes(t) ? Bt : t === "4ed" ? Q0 : en.has(t) ? zt : J;
}
function ka(e, t, r, s, n, a) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#c9c4be", e.beginPath(), e.arc(t + s / 2, r + s / 2, s / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = `${s * a}px "CardRenderer MTG Historic Symbols"`, e.textAlign = "left", e.textBaseline = "alphabetic";
  const o = e.measureText(n);
  e.fillText(
    n,
    t + (s - o.actualBoundingBoxLeft - o.actualBoundingBoxRight) / 2 + o.actualBoundingBoxLeft,
    r + (s + o.actualBoundingBoxAscent - o.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function rn(e, t, r, s, n, a, o, l = [0, 0, 1, 1], i = null, c = "low") {
  const d = document.createElement("canvas"), h = Math.ceil(o * 2) + 1;
  d.width = Math.ceil(n * 2) + h * 2, d.height = Math.ceil(a * 2) + h * 2;
  const u = d.getContext("2d");
  u.imageSmoothingQuality = c, u.drawImage(
    t,
    l[0] * t.width,
    l[1] * t.height,
    l[2] * t.width,
    l[3] * t.height,
    h,
    h,
    n * 2,
    a * 2
  ), u.globalCompositeOperation = "source-in", u.fillStyle = "#fff", u.fillRect(0, 0, d.width, d.height), e.save(), e.shadowColor = "transparent";
  for (let m = 0; o > 0 && m < 16; m++) {
    const g = m * Math.PI / 8;
    e.drawImage(
      d,
      r - h / 2 + Math.cos(g) * o,
      s - h / 2 + Math.sin(g) * o,
      d.width / 2,
      d.height / 2
    );
  }
  if (u.fillStyle = "#17140f", i) {
    const m = u.createLinearGradient(h, h, h + n * 2, h);
    i.forEach((g, f) => m.addColorStop(f / 2, g)), u.fillStyle = m;
  }
  u.fillRect(0, 0, d.width, d.height), e.drawImage(d, r - h / 2, s - h / 2, d.width / 2, d.height / 2), e.restore(), d.width = d.height = 0;
}
function an(e, t, r) {
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", t.artist && (e.fillStyle = "#f2eee3", e.shadowColor = "#000", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = `${r.artistSize}px "CardRenderer MTG MPlantin", Georgia`, e.fillText(`Illus. ${t.artist}`, r.artistX, r.artistBaseline, 338)), e.shadowColor = "transparent", e.fillStyle = r.legalLight ? "#f2eee3" : "#17140f", e.font = `${r.legalSize}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && e.fillText(r.legalText, r.artistX, r.legalBaseline, 380), e.restore();
}
function sn(e, t, r, s, n) {
  const a = Wt(t), o = Z0(t), l = q0(t);
  if (n === "artwork") {
    Re(e, t, r, ie(a.art), n);
    return;
  }
  e.fillStyle = rr(t), e.fillRect(0, 0, 488, 680), e.fillStyle = "#686050", e.fillRect(24.4, 27.2, 439.2, 625.6), e.fillStyle = "#e5dec5", e.fillRect(...ie(a.rules)), e.fillStyle = "#746b58", e.fillRect(...ie(a.art)), s && e.drawImage(s, 0, 0, 488, 680), Re(e, t, r, ie(a.art), n);
  const i = r.get(Ae(t));
  if (i && (e.save(), e.filter = Rs(t), e.drawImage(i, ...ie(a.frame)), O0(e, i, Ae(t)), Ae(t).endsWith("/seventh/regular/m.png") && $0(e, i), e.restore()), pe(t) !== "black" || ce(t) === "fourth") {
    const W = r.get(Zr(t));
    if (W) {
      const F = document.createElement("canvas");
      F.width = 732, F.height = 1020;
      const N = F.getContext("2d");
      N.drawImage(W, 0, 0, 732, 1020), N.globalCompositeOperation = "source-in", N.fillStyle = rr(t), N.fillRect(0, 0, 732, 1020), e.drawImage(F, ...ie(a.frame)), F.width = F.height = 0;
    }
  }
  e.fillStyle = ar(t), e.textBaseline = "middle", e.textAlign = "left", e.letterSpacing = "0px";
  const [c, d, h, u] = ie(a.title), m = t.manaSymbols ?? [], g = x0(t), f = g?.[3] ?? o?.manaSize ?? 23.4, y = g ? g[2] - f : o?.manaGap ?? 1.7, k = m.length * (f + y), w = g ? g[0] + f / 2 - k + y : o ? o.manaRight - k + y : c + h - k;
  e.shadowColor = "#000b", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const b = o?.titleX ?? c, p = d + u / 2 + (o?.titleYOffset ?? 0), v = Math.max(
    1,
    m.length ? w - b - 5 : o?.titleX == null ? h - 5 : c + h - b - 5
  );
  l ? X0(e, t.name, b, p, v) : e.fillText(t.name, b, p, v);
  const C = t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle", R = t.symbolStyle === "original" || t.symbolStyle === void 0 && t.wordingMode === "original", L = R && ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  l ? F0(e, m, r, C) : ["lea", "2ed"].includes(t.setCode?.toLowerCase() ?? "") ? _0(e, m, r, C) : m.forEach(
    (W, F) => (L ? ba : J)(
      e,
      W,
      w + F * (f + y),
      g ? g[1] - f / 2 : o?.manaTop ?? d + u / 2 - f / 2,
      f,
      r,
      !1
    )
  );
  const [T, I, x, P] = ie(a.type), A = Qr(t) ?? "", E = r.get(A), $ = j0(t), q = P0(t), Q = E ? Math.min(44 / E.width, (o?.setHeight ?? 23.4) / E.height) : 0, O = $?.width ?? (E?.width ?? 0) * Q, _ = $?.height ?? (E?.height ?? 0) * Q, G = [
    ($?.right ?? o?.setRight ?? T + x) - O,
    ($?.centerY ?? o?.setCenterY ?? I + P / 2) - _ / 2,
    O,
    _
  ], ae = Yt(t, A, G, "retro");
  if (e.font = '21.7px "CardRenderer MTG MPlantin", Georgia', e.fillText(
    jt(t)?.typeLine ?? t.typeLine ?? "",
    o?.typeX ?? T,
    I + P / 2,
    E ? Math.max(
      1,
      Math.min(
        x - 48,
        $ ? $.right - $.width - T - 6 : x,
        ae !== G ? ae[0] - (o?.typeX ?? T) - 6 : x
      )
    ) : x
  ), E) {
    const W = Math.min(44 / E.width, (o?.setHeight ?? 23.4) / E.height), F = $?.width ?? E.width * W, N = $?.height ?? E.height * W, oe = $?.right ?? o?.setRight ?? T + x, te = $?.centerY ?? o?.setCenterY ?? I + P / 2, me = $?.crop ?? [0, 0, 1, 1], ye = we(A), X = !ye && !t.setSymbol && r.get(fa(A));
    X && (e.save(), e.shadowColor = "transparent", t.setCode?.toLowerCase() === "arn" && (e.filter = "brightness(0.7)"), e.drawImage(
      X,
      me[0] * X.width,
      me[1] * X.height,
      me[2] * X.width,
      me[3] * X.height,
      oe - F,
      te - N / 2,
      F,
      N
    ), e.restore()), ye || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(E, ...ae), e.restore()) : q || o || Er(t.setCode) ? rn(
      e,
      E,
      oe - F,
      te - N / 2,
      F,
      N,
      $?.outline ?? (q ? 2 : o?.setOutline ?? za(t.setCode)),
      me,
      q,
      $?.sampling
    ) : xe(
      e,
      E,
      t.setCode,
      t.rarity,
      T + x - E.width * W,
      I + P / 2 - E.height * W / 2,
      E.width * W,
      E.height * W
    );
  }
  e.shadowColor = "transparent";
  const [ee, Be, Me, fe] = ie(a.rules);
  e.fillStyle = "#17140f";
  const V = r.get(Dt(t) ?? "");
  if (V) {
    const W = Math.min(Me * 0.4 / V.width, fe * 0.75 / V.height);
    e.drawImage(
      V,
      ee + (Me - V.width * W) / 2,
      Be + (fe - V.height * W) / 2,
      V.width * W,
      V.height * W
    );
  } else {
    const W = z0(e, t);
    W && be(
      e,
      W,
      r,
      C ? J : R ? tn(t.setCode) : t.setCode?.toLowerCase() === "3ed" ? Bt : o ? zt : J,
      t.setCode?.toLowerCase() === "lea" ? 0.012 : 0
    );
  }
  if (!B0(e, t)) {
    if (e.shadowColor = o?.statsOpaqueShadow ? "#000" : "#000b", o && (e.shadowOffsetX = e.shadowOffsetY = o.statsShadow * e.getTransform().a), e.fillStyle = ar(t), e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", t.power != null && t.toughness != null) {
      const [W, F, N, oe] = ie(a.stats), te = J0(t);
      e.textAlign = te ? "right" : "center", l ? V0(e, Sr(t), F + oe / 2) : e.fillText(
        Sr(t),
        te?.right ?? W + N / 2,
        F + oe / 2 + (te?.yOffset ?? 0),
        te?.maxWidth ?? N
      );
    }
    if (l && t.artist) K0(e, t.artist);
    else if (t.artist && N0(t)) Y0(e, t.artist);
    else if (o) an(e, t, o);
    else if (t.artist) {
      const [W, F, N, oe] = ie(a.footer);
      e.textAlign = "center", e.font = '15.6px "CardRenderer MTG MPlantin", Georgia', e.fillText(`Illus. ${t.artist}`, W + N / 2, F + oe / 2, N);
    }
    e.shadowColor = "transparent";
  }
}
const nn = (e, t = {}) => fetch(e, { ...t, mode: "cors" });
let vr;
const on = [
  ["CardRenderer MTG Goudy", Ss],
  ["CardRenderer MTG Historic Symbols", ys]
];
function ln() {
  return typeof FontFace != "function" ? Promise.resolve() : vr ??= Promise.all(
    on.map(async ([e, t]) => {
      if ([...document.fonts].some(
        (s) => s.family.replace(/^"|"$/g, "") === e && s.status === "loaded"
      ))
        return;
      const r = await nn(t);
      if (!r.ok) throw Error(`Retro font unavailable: ${e}`);
      document.fonts.add(await new FontFace(e, await r.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((e) => {
    throw vr = void 0, e;
  });
}
const cn = `${Pe}/img/class_level_bg.webp`, ya = (e) => ["adventure", "class", "leveler"].includes(K(e)), Ge = (e, t, r, s) => ({
  x: e / 63.5 * 488,
  y: t / 88.9 * 680,
  width: r / 63.5 * 488,
  height: s / 88.9 * 680
}), dn = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function hn(e, t, r, s = 21) {
  const n = e.replace(/\{[^}]+\}/g, "●").split(`
`);
  let a = s;
  for (; a > 8 && n.reduce(
    (o, l) => o + Math.max(1, Math.ceil(l.length * a * 0.53 / t)) * a + 4,
    0
  ) > r; )
    a -= 0.5;
  return a;
}
function gt(e) {
  const t = K(e), r = [], s = (n, a, o, l = {}) => {
    r.push({ kind: n, text: a, ...o, font: hn(a, o.width, o.height), ...l });
  };
  if (t === "adventure") {
    const n = e.faces?.[1];
    if (!n) return [];
    const a = (n.manaSymbols ?? []).map((l) => `{${l}}`).join(""), o = (n.manaSymbols?.length ?? 0) * 2.5;
    s("heading", n.name, Ge(5.6, 55.3, 25 - o, 4.2), {
      color: "white",
      font: Math.min(18, (25 - o) * 488 / 63.5 / Math.max(1, n.name.length * 0.55))
    }), s("rules", a, Ge(30 - o, 55.3, o, 4.2), { color: "white", font: 17 }), s("heading", n.typeLine ?? "", Ge(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (n.typeLine ?? "").length * 0.52))
    }), s("rules", n.rulesText ?? "", Ge(5.6, 64.5, 24.7, 15.6)), s("rules", e.rulesText ?? e.faces?.[0]?.rulesText ?? "", Ge(33, 54.9, 25.5, 25));
  } else if (t === "class") {
    const [n, a, o, l] = ue(e).rules.map(
      (b, p) => b * (p % 2 ? M : S)
    ), i = ne(e);
    s(
      "band",
      "",
      { x: n, y: a, width: o, height: l },
      {
        fill: "#e3d8bb",
        asset: le(
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
      (v, C) => v + Math.max(1, Math.ceil(C.length * p * 0.53 / (o - 10))),
      0
    ), g = c.map(
      (b) => d(b) ? h : m(b, b.startsWith("(") ? 16 : u) * (b.startsWith("(") ? 16 : u) + 8
    ), f = c.filter((b) => !d(b)).length, y = Math.max(0, l - g.reduce((b, p) => b + p, 0)) / Math.max(1, f), k = Math.min(
      1,
      (l - c.filter(d).length * h) / g.reduce((b, p, v) => b + (d(c[v]) ? 0 : p), 0)
    );
    let w = a;
    c.forEach((b, p) => {
      const v = d(b), C = v ? h : g[p] * k + y;
      if (v) {
        const [R, L] = b.split(/:\s*/);
        s("band", "", { x: n, y: w, width: o, height: C }, { asset: cn }), s("rules", R + ":", { x: n + 5, y: w, width: o / 2 - 5, height: C }, { font: 18 }), s(
          "heading",
          L,
          { x: n + o / 2, y: w, width: o / 2 - 5, height: C },
          { font: 18, align: "right" }
        );
      } else
        s(
          "rules",
          b,
          { x: n + 5, y: w + 4, width: o - 10, height: C - 8 },
          { font: (b.startsWith("(") ? 16 : u) * k, italic: b.startsWith("(") }
        );
      w += C;
    });
  } else if (t === "leveler") {
    const n = e.rulesText ?? "", a = n.split(/^LEVEL\s+([^\n]+)\n/gm), o = [
      {
        range: "",
        text: a[0] ?? "",
        stats: e.power != null && e.toughness != null ? `${e.power}/${e.toughness}` : ""
      }
    ];
    for (let d = 1; d < a.length; d += 2) {
      const h = a[d + 1] ?? "", u = h.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      o.push({
        range: a[d],
        stats: u?.[1] ?? "",
        text: u ? h.slice(u[0].length) : h
      });
    }
    const l = Ge(4.9, 55.6, 53.7, 25.5), i = l.height / o.length, c = dn[ne(e).frame] ?? "#dcc8af";
    o.forEach((d, h) => {
      const u = l.y + h * i;
      h && s(
        "band",
        "",
        { x: l.x, y: u, width: l.width, height: i },
        { fill: h % 2 ? "#00000018" : "#00000028" }
      );
      const m = d.range ? 55 : 7, g = d.stats ? 72 : 7;
      s("rules", d.text, {
        x: l.x + m,
        y: u + 4,
        width: l.width - m - g,
        height: i - 8
      }), d.range && s(
        "level",
        `LEVEL
${d.range}`,
        { x: l.x - 12, y: u + i / 2 - 23, width: 65, height: 46 },
        { fill: c, font: 13 }
      ), d.stats && s(
        "stats",
        d.stats,
        { x: l.x + l.width - 68, y: u + i / 2 - 22, width: 77, height: 44 },
        { asset: le("pt-boxes", ne(e).pt), font: 26 }
      );
    });
  }
  return r;
}
function un(e) {
  return gt(e).flatMap((t) => [
    t.asset ?? null,
    ...it(t.text).flatMap((r) => r.symbol ? [dt(r.symbol)] : [])
  ]);
}
function mn(e) {
  return ya(e) ? gt(e) : null;
}
function gn(e, t, r) {
  for (const s of gt(t)) {
    const { x: n, y: a, width: o, height: l, font: i } = s;
    e.save(), e.textAlign = "left", e.fillStyle = s.fill ?? "transparent", s.kind === "level" ? (e.beginPath(), e.moveTo(n, a), e.lineTo(n + o * 0.72, a), e.lineTo(n + o, a + l / 2), e.lineTo(n + o * 0.72, a + l), e.lineTo(n, a + l), e.closePath(), e.fill(), e.strokeStyle = "#0008", e.lineWidth = 1, e.stroke()) : s.fill && e.fillRect(n, a, o, l);
    const c = s.asset ? r.get(s.asset) : null;
    if (c && e.drawImage(c, n, a, o, l), e.beginPath(), e.rect(n, a, o, l), e.clip(), e.fillStyle = s.color ?? "#17140f", ["stats", "level"].includes(s.kind)) {
      e.font = `${i}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
      const d = s.text.split(`
`);
      d.forEach(
        (h, u) => e.fillText(
          h,
          n + o * (s.kind === "level" ? 0.43 : 0.5),
          a + l / 2 + (u - (d.length - 1) / 2) * i,
          o * 0.85
        )
      );
    } else if (s.align === "right")
      e.font = `${i}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "right", e.textBaseline = "middle", e.fillText(s.text, n + o, a + l / 2, o);
    else {
      e.font = `${s.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
      const d = _t(e, s.text, o, i).length * i + (s.text.split(`
`).length - 1) * j.paragraphGap;
      sa(
        e,
        s.text,
        n,
        a + Math.max(0, (l - d) / 2),
        o,
        { size: i, italic: !!s.italic },
        r
      );
    }
    e.restore();
  }
}
const fn = 5, pn = 0.02655 * M + 0.91339 * S * 3810 / 2736;
function qt(e) {
  const t = e ? 382 : 429;
  return { top: t, scale: 1 - fn / (pn - t) };
}
function bn(e) {
  const { top: t, scale: r } = qt(e);
  return [t + 6, t + (625 - t) * r - 4];
}
function Cr(e, t, r, s, n, a) {
  const { top: o, scale: l } = qt(a), i = t.height * n / t.width, c = Math.max(0, Math.min(i, o - s)), d = c * t.width / n;
  c > 0 && e.drawImage(t, 0, 0, t.width, d, r, s, n, c), c < i && e.drawImage(
    t,
    0,
    d,
    t.width,
    t.height - d,
    r,
    s + c,
    n,
    (i - c) * l
  );
}
function wn(e, t, r) {
  const s = e.rulesParagraphs?.filter((o) => o.role === "rules")[r], n = (e.rulesText ?? "").split(`
`).filter((o) => o.trim())[r];
  if (!s || s.runs.map((o) => o.text).join("") !== n) return [{ text: t }];
  let a = n.length - t.length;
  return s.runs.flatMap((o) => {
    const l = Math.min(a, o.text.length);
    return a -= l, l === o.text.length ? [] : [{ ...o, text: o.text.slice(l) }];
  });
}
function kn(e, t) {
  const r = K(t) === "planeswalker-large", s = Xe(t), n = !r && s.length < 3, a = ue(t).rules, o = a[0] * S, l = a[1] * M, i = a[2] * S, c = a[3] * M - (r ? 24 : n ? 4 : 16), d = r ? 8 : n ? 3 : 0, h = r ? { ...ot, leading: 0.9 } : ot, u = s.map((T, I) => ({
    ...T,
    runs: wn(t, T.text, I),
    left: T.badges.length ? 67 : 45
  })), m = (T) => u.map(
    (I) => Z(
      e,
      [{ role: "rules", runs: I.runs }],
      { x: o + I.left, y: 0, width: i - I.left - 8, height: 1e3 },
      T,
      T,
      h
    )
  );
  let g = r ? 17.5 : n ? 24 : 19, f = m(g);
  const [y, k] = bn(r), w = () => {
    const T = c / Math.max(1, u.length), I = f.map((A, E) => l + d + T * (E + 0.5) - A.height / 2);
    let x = y - 8;
    for (let A = 0; A < I.length; A++)
      I[A] = Math.max(I[A], x + 8), x = I[A] + f[A].height;
    let P = k + 8;
    for (let A = I.length - 1; A >= 0; A--)
      I[A] = Math.min(I[A], P - 8 - f[A].height), P = I[A];
    return I;
  }, b = () => (w()[0] ?? y) >= y, p = () => f.map((T) => Math.max(34, T.height + 16)), v = () => {
    const T = c / Math.max(1, u.length);
    return f.every((I, x) => {
      const P = T * (x + 0.5);
      return P - I.height / 2 >= 6 && P + I.height / 2 <= c + 6 && (!x || T - (I.height + f[x - 1].height) / 2 >= 8);
    });
  };
  for (; g > 8 && (p().reduce((T, I) => T + I, 0) > c || !v() || !b()); )
    g -= 0.25, f = m(g);
  const C = c / Math.max(1, u.length), R = w();
  let L = d;
  return u.map((T, I) => {
    const x = C, P = f[I].height, A = Z(
      e,
      [{ role: "rules", runs: T.runs }],
      {
        x: o + T.left,
        y: R[I],
        width: i - T.left - 8,
        height: P
      },
      g,
      g,
      h
    );
    A.overflow ||= L + x > d + c + 0.01, A.overflow ||= !v(), A.overflow ||= !b(), A.overflow ||= A.lines.some(
      ($) => $.inkBounds[1] < y - 0.01 || $.inkBounds[1] + $.inkBounds[3] > k + 0.01
    );
    const E = { ...T, top: L, height: x, font: g, width: A.width, layout: A };
    return L += x, E;
  });
}
function yn(e) {
  return { font: 18, offsetY: e.startsWith("+") ? 2 : e === "0" ? 0 : -2 };
}
function Sa(e, t) {
  return e === "saga" ? /^(I|II|III|IV)$/.test(t) ? le("saga", t) : null : le(
    "planeswalker",
    t.startsWith("+") ? "LoyaltyPlus" : t === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function va(e, t) {
  return K(e) === "saga" ? le("saga_textboxes", t === "Colourless" ? "Land" : t) : null;
}
function Sn(e) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[ne(e).boxes] ?? "#dededbf0";
}
function vn(e, t) {
  const { top: r, scale: s } = qt(K(t) === "planeswalker-large");
  e.save(), e.translate(0, r), e.scale(1, s), e.translate(0, -r), e.beginPath(), e.moveTo(66, r), e.lineTo(448, r), e.quadraticCurveTo(456, r, 456, r + 8), e.lineTo(456, 613), e.bezierCurveTo(456, 623, 420, 629, 257, 629), e.bezierCurveTo(94, 629, 58, 623, 58, 613), e.lineTo(58, r + 8), e.quadraticCurveTo(58, r, 66, r), e.closePath(), e.clip(), e.fillStyle = Sn(t), e.fillRect(58, r, 398, 629 - r), e.restore();
}
function Cn(e, t, r) {
  e.fillStyle = "#17140f", e.font = '24px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "alphabetic";
  const s = e.measureText(":");
  e.fillText(
    ":",
    t,
    r + 1.5 + (s.actualBoundingBoxAscent - s.actualBoundingBoxDescent) / 2
  );
}
function Rn(e, t, r) {
  const s = K(t), n = s === "saga", a = ue(t).rules, o = a[0] * S, l = a[1] * M, i = a[2] * S, c = a[3] * M;
  n && (e.fillStyle = "#e3d8bb", e.fillRect(o, l, i, c));
  const d = va(t, ne(t).boxes), h = d ? r.get(d) : void 0;
  h && e.drawImage(h, o, l, i, c);
  const u = n ? Xs(t) : kn(e, t);
  for (const [m, g] of u.entries()) {
    if (m > 0) {
      const k = u[m - 1]?.layout, w = g.layout && k ? Math.max(k.top + k.height + 3, Math.min(l + g.top, g.layout.top - 3)) : l + g.top;
      e.fillStyle = "#0002", e.fillRect(o + (n ? 0 : 40), w, i - (n ? 0 : 40), 1.5);
    }
    if (e.fillStyle = "#17140f", e.textAlign = "left", g.layout) be(e, g.layout, r);
    else {
      e.font = `${g.reminder ? "italic " : ""}${g.font}px "CardRenderer MTG MPlantin", Georgia`;
      const k = _t(e, g.text, g.width, g.font).length * g.font;
      sa(
        e,
        g.text,
        o + g.left,
        l + g.top + (g.height - k) / 2,
        g.width,
        { size: g.font, italic: g.reminder },
        r
      );
    }
    const f = n ? 36 : 54, y = n ? 36 : 40;
    g.badges.forEach((k, w) => {
      const b = o + (n ? -18 : 0), p = l + g.top + g.height / 2 + (w - g.badges.length / 2) * y, v = Sa(s, k), C = v ? r.get(v) : null;
      if (C) {
        if (e.save(), !n) {
          const R = e.getTransform().a;
          e.shadowColor = "#0009", e.shadowBlur = 3 * R, e.shadowOffsetY = 2 * R;
        }
        e.drawImage(C, b, p, f, y), e.restore();
      } else
        e.fillStyle = "#29231c", e.fillRect(b, p, f, y);
      if (!C || !n) {
        e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle";
        const R = yn(k);
        e.font = `bold ${n ? 19 : R.font}px "CardRenderer MTG Beleren", Georgia`, e.fillText(
          k,
          b + f / 2 - (n ? 0 : 1.5),
          p + y / 2 + (n ? 0 : R.offsetY),
          f - 3
        ), n || Cn(e, b + f + 4, p + y / 2);
      }
    });
  }
}
const Ca = 0.7;
function Tn(e, t, r, s = !1) {
  const [n, a, o, l] = [
    r[0] * S,
    r[1] * M,
    r[2] * S,
    r[3] * M - 1
  ], i = new Path2D();
  i.moveTo(n + 14, a), i.lineTo(n + o - 14, a), i.quadraticCurveTo(n + o, a, n + o, a + 14), i.lineTo(n + o, a + l - 7), i.quadraticCurveTo(n + o, a + l, n + o - 7, a + l), i.lineTo(n + 9, a + l), i.quadraticCurveTo(n - 2, a + l, n - 2, a + l - 9), i.quadraticCurveTo(n - 2, a + 17, n + 2, a + 9), i.quadraticCurveTo(n + 5, a, n + 14, a), i.closePath(), e.save();
  const c = e.getTransform().a;
  e.shadowColor = "#0009", e.shadowBlur = 1.4 * c, e.shadowOffsetX = -1.2 * c, e.shadowOffsetY = 3.5 * c, e.fillStyle = "#191816", e.fill(i), e.shadowColor = "transparent", e.save(), e.clip(i);
  const d = t.width / o, h = [
    20 * d,
    t.height - (l - 4) * d,
    t.width - 40 * d,
    (l - 12) * d,
    n - 2,
    a,
    o + 2,
    l
  ];
  e.drawImage(t, ...h), s && (e.globalAlpha *= Ca, e.drawImage(t, ...h)), e.restore(), e.strokeStyle = "#191816", e.lineWidth = 1.2, e.stroke(i), e.restore();
}
const Mn = 1.1;
function Ra(e) {
  return !e.setSymbol && ["m19", "m20", "m21"].includes(e.setCode?.toLowerCase() ?? "");
}
function Ta(e, t, r, s, n, a, o, l, i = 1) {
  const c = !r || r === "common", d = document.createElement("canvas"), h = 2, u = 4;
  d.width = Math.ceil((a + h * 2) * u), d.height = Math.ceil((o + h * 2) * u);
  const m = d.getContext("2d");
  m.scale(u, u), m.translate(h, h), m.drawImage(
    t,
    l[0] * t.width,
    l[1] * t.height,
    l[2] * t.width,
    l[3] * t.height,
    0,
    0,
    a,
    o
  ), m.globalCompositeOperation = "source-in";
  const g = r === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : r === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], f = m.createLinearGradient(0, o * 0.65, a, o * 0.35);
  f.addColorStop(0, g[0]), f.addColorStop(0.35, g[1]), f.addColorStop(0.6, g[2]), f.addColorStop(1, g[3]), m.fillStyle = c ? "#111111" : f, m.fillRect(0, 0, a, o), m.beginPath(), m.moveTo(a * 0.046, 0), m.lineTo(a * 0.953, 0), m.bezierCurveTo(
    a * 1.016,
    o * 0.38,
    a * 1.016,
    o * 0.62,
    a * 0.953,
    o
  ), m.lineTo(a * 0.046, o), m.bezierCurveTo(-a * 0.017, o * 0.62, -a * 0.017, o * 0.38, a * 0.046, 0), m.closePath(), m.globalCompositeOperation = "destination-over", m.fillStyle = c ? "#f8f8f5" : "#111111", m.fill(), m.globalCompositeOperation = "source-over", m.strokeStyle = c ? "#f8f8f5" : "#111111", m.lineWidth = i, m.stroke(), e.drawImage(
    d,
    s - h,
    n - h,
    d.width / u,
    d.height / u
  ), d.width = d.height = 0;
}
const Ee = (e) => [
  e[0] * S,
  e[1] * M,
  e[2] * S,
  e[3] * M
];
function In(e, t, r, s, n) {
  const a = Ut(t);
  if (!a) throw Error("Missing replacement frame family.");
  const o = (O) => {
    const _ = r.get(O);
    if (!_) throw Error(`Replacement frame asset unavailable: ${O}`);
    return _;
  }, { rects: l } = a, i = t.frameAssetFamily === "eighth";
  if (e.save(), e.fillStyle = ge(t.setCode, t.borderColor).border, e.fillRect(0, 0, S, M), s && e.drawImage(s, 0, 0, S, M), Re(e, t, r, Ee(l.art), n), n === "artwork") {
    e.restore();
    return;
  }
  if (e.drawImage(o(a.frame), 0, 0, S, M), a.rightFrame) {
    const O = document.createElement("canvas");
    O.width = 732, O.height = 1020;
    const _ = O.getContext("2d");
    _.drawImage(o(a.rightFrame), 0, 0, O.width, O.height);
    const G = document.createElement("canvas");
    G.width = O.width, G.height = O.height;
    const ae = G.getContext("2d"), ee = (me, ye) => {
      const X = ae.createLinearGradient(G.width * me, 0, G.width * ye, 0);
      return X.addColorStop(0, "#0000"), X.addColorStop(1, "#000"), X;
    };
    ae.fillStyle = ee(0.47, 0.53), ae.fillRect(0, 0, G.width, G.height);
    const Be = i ? [0.08, 0.627, 0.84, 0.29] : [0.071, 0.629, 0.858, 0.294], [Me, fe, V, W] = Be, F = Me * G.width, N = fe * G.height, oe = V * G.width, te = W * G.height;
    ae.clearRect(F, N, oe, te), ae.fillStyle = ee(0.27, 0.73), ae.fillRect(F, N, oe, te), _.globalCompositeOperation = "destination-in", _.drawImage(G, 0, 0), e.drawImage(O, 0, 0, S, M), O.width = O.height = 0, G.width = G.height = 0;
  }
  const c = ge(t.setCode, t.borderColor);
  if (c.border !== "#090806") {
    const O = document.createElement("canvas");
    O.width = 732, O.height = 1020;
    const _ = O.getContext("2d");
    _.drawImage(o(a.border), 0, 0, O.width, O.height), _.globalCompositeOperation = "source-in", _.fillStyle = c.border, _.fillRect(0, 0, O.width, O.height), e.drawImage(O, 0, 0, S, M), O.width = O.height = 0;
  }
  e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const d = i ? "CardRenderer MTG Matrix" : "CardRenderer MTG Beleren", [h, u, m, g] = Ee(l.title), f = t.manaSymbols ?? [], { size: y, gap: k } = a.mana, w = a.mana.right * S, b = f.length * y + Math.max(0, f.length - 1) * k;
  e.font = `bold ${a.titleSize}px "${d}", Georgia`, he(
    e,
    t.name,
    h,
    u + g / 2,
    f.length ? w - b - h - 8 : m,
    a.titleSize,
    !0,
    1,
    d
  ), f.forEach(
    (O, _) => J(
      e,
      O,
      w - b + _ * (y + k),
      a.mana.center * M - y / 2,
      y,
      r,
      !0
    )
  );
  const p = se(t), v = r.get(p ?? ""), C = De(t), R = v ? Math.min(
    a.symbol.width * S / (v.width * C[2]),
    a.symbol.height * M / (v.height * C[3])
  ) : 0, L = v ? v.width * C[2] * R : 0, T = v ? v.height * C[3] * R : 0, I = R0(t, p, [
    a.symbol.right * S - L,
    a.symbol.center * M - T / 2,
    L,
    T
  ]), [x, P, A, E] = Ee(l.type);
  if (e.font = `bold ${a.typeSize}px "${d}", Georgia`, he(
    e,
    t.typeLine ?? "",
    x,
    P + E / 2,
    v ? I[0] - x - 7 : A,
    a.typeSize,
    !0,
    1,
    d
  ), v) {
    const O = ma(t);
    we(p) || t.setSymbol ? e.drawImage(v, ...I) : Ra(t) ? Ta(e, v, t.rarity, ...I, C, 1.5) : O ? ga(e, v, O, t.rarity, ...I, C, !1) : xe(e, v, t.setCode, t.rarity, ...I, C);
  }
  if (be(e, da(e, t), r), t.power != null && t.toughness != null && e.drawImage(o(a.pt), ...Ee(l.stats)), i) {
    zs(e, t, r), e.restore();
    return;
  }
  if (t.power != null && t.toughness != null) {
    const [O, _, G, ae] = Ee(l.stats);
    e.font = `bold 25px "${d}", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(`${t.power}/${t.toughness}`, O + G * 0.52, _ + ae * 0.52, G * 0.85);
  }
  const [$, q, Q] = Ee(l.footer);
  e.textAlign = "left", e.textBaseline = "top", e.fillStyle = "#fff", e.font = `12px "${d}", Georgia`, e.fillText(t.artist ?? "", $, q, Q), t.legalText && (e.font = '9px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, $, q + 15, Q)), e.restore();
}
let Rr = null;
function Ln(e) {
  return e.frameAssetFamily !== "eighth" ? Promise.resolve() : Rr ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 29px "CardRenderer MTG Matrix Small Caps"')
  ]).then((t) => {
    if (t.some((r) => !r.length || r.some((s) => s.status !== "loaded")))
      throw Error("Replacement Eighth Edition frames need card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw Rr = null, t;
  });
}
function An(e, t, [r, s, n, a]) {
  const o = t.height * n / t.width;
  e.save(), e.beginPath(), e.rect(r, s, n, a / 2), e.clip(), e.drawImage(t, r, s + a - o + 1, n, o), e.restore();
}
function xn(e, [t, r, s, n], a) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(a)) return;
  e.save(), e.shadowColor = "transparent";
  const o = e.createLinearGradient(t, 0, t + s, 0);
  o.addColorStop(0, "rgba(255,255,255,0)"), o.addColorStop(0.025, "rgba(255,255,255,0.2)"), o.addColorStop(0.975, "rgba(255,255,255,0.2)"), o.addColorStop(1, "rgba(255,255,255,0)"), e.fillStyle = o, e.fillRect(t, r + n - 4, s, 2.3), e.restore();
}
const Bn = "symbol-svg-v3", On = { "m15-u": { sha256: "bfd962ff9640a846e5690d76c0fe88324e9d49cb6771744b5ab8f34f7afe7362", recipe: "m15" }, "m15-r": { sha256: "933756b97cebe7389ff7cee219a34b1ac13bc504743a2be037a286ee5ffc4b0d", recipe: "m15" }, "m15-m": { sha256: "6e9f87473f1ed8ecb05647fbde6f13e22faeab18fe56b8f76cfa1759bb4210e7", recipe: "m15" }, "8ed-u": { sha256: "6c20e8da28fdd5cdb030814e5c1339978f276c77f4ad9d99ca816adb8d970880", recipe: "8ed" }, "8ed-r": { sha256: "eccde74c56b4810434ecdf4e99206046d6970ea601e4fed2f73eb2ee855053a2", recipe: "8ed" }, "9ed-u": { sha256: "acb7ea7f3422f50dca2aef4e07aa3977aa1641ff2cb54f6eb64ae1bc17abbf53", recipe: "9ed" }, "9ed-r": { sha256: "c1cbcc1aea4f032c5f2ccf7f1d63073813bf9c6f050ba2f5385170ff3deca8a5", recipe: "9ed" }, "7ed-u": { sha256: "94c67d433ba3012f3aa1c494a7ef0ae1e7de58ce4614dfd50ee8f52de527d7e4", recipe: "white-outer-rim" }, "7ed-r": { sha256: "8b30917e85b2c9c3549bfa6c2f62261801df33ff7debcc138bf89c4a9ba9689f", recipe: "white-outer-rim" } }, Ma = {
  revision: Bn,
  sources: On
}, Tr = `${U}/img/setSymbols/official/`, Mr = Ma.sources;
function Ia(e) {
  if (!e.startsWith(Tr) || !e.endsWith(".svg")) return;
  const t = e.slice(Tr.length, -4);
  return Object.hasOwn(Mr, t) ? Mr[t] : void 0;
}
function $n(e) {
  return !!Ia(e);
}
async function Gn(e, t) {
  const r = Ia(e);
  if (!r) return t;
  const s = await t.arrayBuffer();
  if ([...new Uint8Array(await crypto.subtle.digest("SHA-256", s))].map((h) => h.toString(16).padStart(2, "0")).join("") !== r.sha256) throw Error(`Unexpected pinned symbol checksum: ${e}`);
  const o = new DOMParser().parseFromString(new TextDecoder().decode(s), "image/svg+xml"), l = o.documentElement, i = [...l.querySelectorAll("path")], c = l.querySelector("linearGradient, radialGradient");
  if (l.localName !== "svg" || o.querySelector("parsererror") || !c)
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
  return l.setAttribute("data-card-glint-patch", Ma.revision), new Blob([new XMLSerializer().serializeToString(o)], { type: "image/svg+xml" });
}
const Se = /* @__PURE__ */ new Map();
function La(e) {
  if (!(!e.retired || e.users)) {
    if (!e.sources) {
      e.controller.abort();
      return;
    }
    URL.revokeObjectURL(e.sources.original), e.sources.backing && URL.revokeObjectURL(e.sources.backing), e.sources = void 0;
  }
}
function ro() {
  for (const e of Se.values())
    e.retired = !0, La(e);
  Se.clear();
}
async function En(e, t) {
  t.throwIfAborted();
  let r = Se.get(e);
  if (!r) {
    const i = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const c = await fetch(e, { mode: "cors", signal: i.controller.signal });
        if (!c.ok) throw Error(`Symbol source ${c.status}: ${e}`);
        const d = await Gn(e, await c.blob()), h = await D0(e, d);
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
      throw Se.get(e) === i && Se.delete(e), c;
    }), Se.set(e, i), r = i;
  }
  r.users++;
  const s = r;
  let n = !1;
  const a = () => {
    n || (n = !0, s.users--, !s.users && !s.sources && (s.retired = !0, Se.get(e) === s && Se.delete(e)), La(s));
  };
  let o = () => {
  };
  const l = new Promise((i, c) => {
    o = () => {
      a(), c(t.reason);
    }, t.addEventListener("abort", o, { once: !0 });
  });
  try {
    const i = await Promise.race([s.promise, l]);
    return t.throwIfAborted(), { sources: i, release: a };
  } catch (i) {
    throw a(), i;
  } finally {
    t.removeEventListener("abort", o);
  }
}
async function jn(e, t) {
  t.throwIfAborted();
  const r = [...new Set(e.filter((i) => !!i))], s = [], n = /* @__PURE__ */ new Map(), a = () => {
    for (const i of s) i.release();
    s.length = 0;
  }, l = (await Promise.allSettled(
    r.map(async (i) => {
      if (!W0(i) && !$n(i)) {
        n.set(i, i);
        return;
      }
      const c = await En(i, t);
      s.push(c), n.set(i, c.sources.original), c.sources.backing && n.set(fa(i), c.sources.backing);
    })
  )).find((i) => i.status === "rejected");
  if (l?.status === "rejected")
    throw a(), l.reason;
  return t.aborted && (a(), t.throwIfAborted()), { urls: [...new Set(n.values())], aliases: n, dispose: a };
}
function Pn(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const [s, n] of e) {
    const a = t.get(n);
    a && r.set(s, a);
  }
  return r;
}
async function Wn(e, t) {
  return t.throwIfAborted(), fetch(e, { signal: t, mode: "cors" });
}
function Dn(e) {
  if (e.startsWith(U) && /\/saga\/(sagaChapter|sagaDivider|sagaMidStripe|stamp)\.png$/.test(e))
    return;
  if (e.startsWith(`${U}/data/images/cardImages/saga/`)) return 768;
  if (e.startsWith(`${U}/img/frames/`) && e.endsWith(".png"))
    return /\/pt\/|\/m15PT/.test(e) ? 256 : 768;
  if (e.startsWith(`${We}/img/frames/`) && e.endsWith(".png")) return 768;
  const t = e.startsWith(`${Pe}/img/`) ? e.slice(`${Pe}/img/`.length) : "";
  return t === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    t
  ) ? 768 : void 0;
}
async function Fn(e) {
  if (!e.type.includes("svg")) return e;
  const t = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), r = t.documentElement;
  if (r.localName !== "svg" || t.querySelector("parsererror"))
    throw new Error("Invalid SVG asset.");
  const s = (r.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), n = s[2] ?? parseFloat(r.getAttribute("width") ?? ""), a = s[3] ?? parseFloat(r.getAttribute("height") ?? "");
  if (!(n > 0 && a > 0 && Number.isFinite(n + a)))
    throw new Error("SVG asset needs a finite viewport.");
  const o = 512 / Math.max(n, a);
  return r.hasAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${n} ${a}`), r.setAttribute("width", String(Math.max(1, Math.round(n * o)))), r.setAttribute("height", String(Math.max(1, Math.round(a * o)))), new Blob([new XMLSerializer().serializeToString(r)], { type: "image/svg+xml" });
}
async function _n(e, t, r) {
  if (t.throwIfAborted(), !e.type.includes("svg"))
    return r ? createImageBitmap(e, { resizeWidth: r, resizeQuality: "high" }) : createImageBitmap(e);
  const s = URL.createObjectURL(await Fn(e)), n = new Image(), a = document.createElement("canvas"), o = () => {
    n.src = "";
  };
  t.addEventListener("abort", o, { once: !0 });
  try {
    t.throwIfAborted(), n.src = s, await n.decode(), t.throwIfAborted(), a.width = n.naturalWidth, a.height = n.naturalHeight;
    const l = a.getContext("2d", { willReadFrequently: !0 });
    if (!l || !a.width || !a.height)
      throw new Error("SVG asset could not be rasterized.");
    return l.drawImage(n, 0, 0), await createImageBitmap(a);
  } finally {
    t.removeEventListener("abort", o), n.src = "", URL.revokeObjectURL(s), a.width = 0, a.height = 0;
  }
}
async function Aa(e, t) {
  const r = await jn(e, t), s = r.urls, n = /* @__PURE__ */ new Map();
  let a = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, s.length) }, async () => {
        for (; a < s.length && !t.aborted; ) {
          const l = s[a++];
          try {
            const i = await Wn(l, t);
            if (!i.ok) continue;
            const c = await i.blob(), d = await _n(c, t, Dn(l));
            t.aborted ? d.close() : n.set(l, d);
          } catch {
          }
        }
      })
    );
  } finally {
    r.dispose();
  }
  const o = Pn(r.aliases, n);
  return {
    images: o,
    dispose: () => {
      for (const l of n.values()) l.close();
      n.clear(), o.clear();
    }
  };
}
function xa(e) {
  if (ze(e))
    return [
      ...cs(e),
      ...de(e).flatMap((o) => [
        o.face.illustration,
        ...je(o.face)
      ]),
      se(de(e)[0].face)
    ];
  const t = Ce(e);
  if (t)
    return de(e).flatMap((o, l) => [
      ...js(o.face, t, qe(e) && t === "eighth", l),
      o.face.illustration,
      se(o.face),
      ...je(o.face)
    ]);
  const r = qs(e);
  if (r) return [...r, e.illustration, se(e), ...je(e)];
  if (ke(e)) return Ms(e);
  if (K(e) === "saga")
    return [...as(e), e.illustration, se(e), ...je(e)];
  const s = de(e);
  if (s.length) return s.flatMap((o) => xa(o.face));
  const n = ne(e), a = Pt(n, K(e));
  return [
    ...un(e),
    a.background,
    a.frame,
    a.boxes,
    a.pt,
    va(e, n.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(K(e)) ? Xe(e).flatMap(
      (o) => o.badges.map((l) => Sa(K(e), l))
    ) : [],
    n.legendary ? a.crown : null,
    e.illustration,
    se(e),
    ...je(e)
  ];
}
let Ir = null;
function Lr() {
  return Ir ??= Promise.all([
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
    throw Ir = null, e;
  });
}
function Qe(e) {
  return ue(e).art;
}
const Ar = /* @__PURE__ */ new WeakMap(), et = ([e, t, r, s]) => [e, 1 - t - s, e + r, 1 - t], Un = [et(ue({}).art), [0, 0, 0, 0]];
function ao(e) {
  if (!e) return Un;
  const t = Ar.get(e);
  if (t) return t;
  const r = de(e), s = r.length ? [
    et(nr(r[0], Qe(r[0].face))),
    et(nr(r[1], Qe(r[1].face)))
  ] : [et(Qe(e)), [0, 0, 0, 0]];
  return Ar.set(e, s), s;
}
async function Nn(e, t, r, s, n, a, o = Aa, l) {
  return Ba(e, t, r, s, {
    threshold: n,
    resolveEtching: l,
    beforePaint: a,
    loadImages: o,
    height: M
  });
}
async function Ba(e, t, r, s, n) {
  const { threshold: a, beforePaint: o, loadImages: l, height: i } = n, c = de(t);
  if (c.length) {
    for (const p of c)
      e.save(), aa(e, p), await Ba(e, p.face, r, s, {
        ...n,
        height: p.height * S / p.width
      }), e.restore();
    return;
  }
  if (t.illustration && n.resolveEtching) {
    let p;
    try {
      const v = await n.resolveEtching(t, r, s, a, o);
      p = await l([v, t.illustration], s);
      const C = p.images.get(v ?? "");
      if (C && !s.aborted) {
        await o?.(), s.throwIfAborted();
        const [R, L, T, I] = ue(t).art, x = R * S, P = L * i, A = T * S, E = I * i, $ = p.images.get(t.illustration) ?? C;
        e.save(), e.beginPath();
        const q = Qe(t);
        if (e.rect(
          q[0] * S,
          q[1] * i,
          q[2] * S,
          q[3] * i
        ), e.clip(), e.imageSmoothingQuality = "low", t.illustrationCrop) {
          const Q = t.illustrationCrop, O = nt($.width * Q[2], $.height * Q[3], [
            x,
            P,
            A,
            E
          ]);
          e.drawImage(
            C,
            Q[0] * C.width,
            Q[1] * C.height,
            Q[2] * C.width,
            Q[3] * C.height,
            ...O
          );
        } else
          e.drawImage(
            C,
            ...nt($.width, $.height, [x, P, A, E])
          );
        e.restore();
      }
    } catch {
    } finally {
      p?.dispose();
    }
  }
  if (s.throwIfAborted(), !t.setCode) return;
  const [d, h, u, m] = ue(t).stamp, g = d * S, f = h * i, y = u * S, k = m * i, w = se(t, "common"), b = await l([w], s);
  try {
    await o?.(), s.throwIfAborted();
    const p = w ? b.images.get(w) : null;
    if (e.save(), e.globalAlpha = 0.68, p) {
      const v = Math.min(y / p.width, k / p.height);
      e.drawImage(
        p,
        g + (y - p.width * v) / 2,
        f + (k - p.height * v) / 2,
        p.width * v,
        p.height * v
      );
    } else
      e.translate(g, f), e.scale(y / 100, k / 100), e.fillStyle = "white", e.fill(new Path2D(Qa)), e.font = "bold 43px Georgia", e.textAlign = "center", e.textBaseline = "alphabetic", e.fillText(rs(t.setCode), 50, 65);
    e.restore();
  } finally {
    b.dispose();
  }
}
function Yn(e) {
  return e.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const Hn = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, xr = /* @__PURE__ */ new WeakMap();
function zn(e, t) {
  let r = xr.get(t);
  if (r || (r = new Path2D(t.path), xr.set(t, r)), e.save(), t.viewBox) {
    const [s, n, a, o] = t.viewBox;
    e.scale(24 / a, 24 / o), e.translate(-s, -n);
  }
  t.transform && e.transform(...t.transform), t.filled ? (e.fillStyle = e.strokeStyle, e.fill(r)) : e.stroke(r), e.restore();
}
function Br(e, t, r, s, n = !1) {
  const a = S * 0.105, o = S * 0.015, l = Math.floor(S * 0.9 / (a + o));
  if (t.forEach((m, g) => {
    e.save(), e.translate(
      S * 0.05 + g % l * (a + o),
      M * 0.13 + Math.floor(g / l) * (a + o)
    ), e.fillStyle = "#17201fed", e.strokeStyle = "#c6af7977", e.lineWidth = 1, e.beginPath(), e.arc(a / 2, a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.stroke(), e.translate(a * 0.14, a * 0.14), e.scale(a * 0.72 / 24, a * 0.72 / 24), e.strokeStyle = "#f3e9cf", e.lineWidth = 1.8, e.lineCap = "round", e.lineJoin = "round", zn(e, m), e.restore();
  }), r?.power == null || r.toughness == null) return;
  e.save();
  const i = Hn[n ? "inspect" : "table"], c = S * i.width, d = M * i.height, h = S * (1 - i.right - i.width), u = M * (1 - i.bottom - i.height);
  s ? e.drawImage(s, h, u, c, d) : (e.fillStyle = "#eee5cf", e.strokeStyle = "#746854", e.lineWidth = 2, e.beginPath(), e.roundRect(
    h + c * (n ? 0.14 : 0.1),
    u + d * (n ? 0.19 : 0.18),
    c * (n ? 0.72 : 0.8),
    d * (n ? 0.62 : 0.64),
    d * 0.12
  ), e.fill(), e.stroke()), e.font = `bold ${S * (n ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
    `${r.power}/${r.toughness}`,
    h + c / 2,
    n ? u + d / 2 - S * 0.01 : u + d * 0.48,
    c * 0.72
  ), e.restore();
}
function so(e) {
  return e.currentStats?.power != null && e.currentStats.toughness != null && e.statusLayout !== "inspect" ? { ...e, statusLayout: "inspect" } : e;
}
function no(e, t) {
  if (e.custom)
    return JSON.stringify([
      "custom-face-v1",
      e.custom.key,
      t,
      e.layer ?? "face",
      e.layer === "etching" ? e.etchThreshold ?? 20 : null
    ]);
  const r = e.face, s = Oa(r, e.layer === "etching"), n = e.currentStats?.power != null && e.currentStats.toughness != null ? [e.currentStats.power, e.currentStats.toughness] : null;
  return JSON.stringify([
    Pe,
    U,
    "canvas-face-v97",
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
function Oa(e, t) {
  const r = de(e);
  return r.length ? [
    e.layout,
    e.artist ?? null,
    e.collectorNumber ?? null,
    e.legalText ?? null,
    e.borderColor ?? null,
    r.map((s) => [s.x, s.y, s.width, s.height, s.rotation, Oa(s.face, t)]),
    !t && Ft(e),
    !t && ra(e)
  ] : t ? [
    e.illustration ?? null,
    e.etchedIllustration ?? null,
    e.illustrationCrop ?? null,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    ue(e)
  ] : [
    ke(e) ? [Ae(e), pe(e)] : null,
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
    mn(e),
    e.artist ?? null,
    e.watermark ?? null,
    e.collectorNumber ?? null,
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
    ue(e),
    ne(e)
  ];
}
function qn(e) {
  const t = document.createElement("canvas");
  return t.width = e === "table" ? 244 : 732, t.height = e === "table" ? 340 : 1020, t;
}
async function oo(e, t, r, s) {
  if (e.custom)
    return await s?.beforePaint?.(), r.throwIfAborted(), e.custom.compose(t, r, e.layer ?? "face", e.etchThreshold);
  const n = s?.loadImages ?? Aa, a = qn(t);
  try {
    const o = a.getContext("2d", {
      willReadFrequently: !!s?.cpuPixels
    });
    if (!o) throw new Error("Card composition needs Canvas2D.");
    if (o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "high", o.scale(a.width / S, a.height / M), e.layer === "etching")
      return await Nn(
        o,
        e.face,
        e.printingId,
        r,
        e.etchThreshold,
        s?.beforePaint,
        n,
        s?.resolveEtching
      ), a;
    o.fillStyle = "#090806", o.fillRect(0, 0, S, M);
    const l = e.currentStats?.power != null && e.currentStats.toughness != null ? Pt(ne(e.face)).pt : null;
    if (e.printedImage) {
      const d = t === "inspect" ? Yn(e.printedImage) : e.printedImage;
      l && await (s?.loadFonts ?? Lr)();
      const h = await n(l ? [d, l] : [d], r);
      try {
        const u = h.images.get(d);
        if (u && !r.aborted)
          return await s?.beforePaint?.(), r.throwIfAborted(), o.drawImage(u, 0, 0, S, M), Br(
            o,
            e.emblems ?? [],
            e.currentStats,
            l ? h.images.get(l) : void 0,
            e.statusLayout === "inspect" || t === "inspect"
          ), Or(o, e.face), a;
      } finally {
        h.dispose();
      }
    }
    await Promise.all([
      (s?.loadFonts ?? Lr)(),
      Ce(e.face) ? s0(e.face) : Ln(e.face),
      K(e.face) === "saga" ? i0() : Promise.resolve(),
      ke(e.face) || Ce(e.face) === "old" ? (s?.loadRetroFont ?? ln)() : Promise.resolve()
    ]), r.throwIfAborted();
    const i = await n(xa(e.face), r);
    let c;
    try {
      return e.paintLayer !== "artwork" && (c = await k0(e.face, i.images, r)), await s?.beforePaint?.(), r.throwIfAborted(), $a(
        o,
        e.face,
        c?.images ?? i.images,
        M,
        !1,
        s?.underArt,
        e.paintLayer
      ), Br(
        o,
        e.emblems ?? [],
        e.currentStats,
        l ? i.images.get(l) : void 0,
        e.statusLayout === "inspect" || t === "inspect"
      ), Or(o, e.face), a;
    } finally {
      c?.dispose(), i.dispose();
    }
  } catch (o) {
    throw a.width = a.height = 0, o;
  }
}
function Or(e, t) {
  e.save(), e.setTransform(
    e.canvas.width / S,
    0,
    0,
    e.canvas.height / M,
    0,
    0
  ), e.globalCompositeOperation = "destination-in", e.globalAlpha = 1, e.shadowColor = "transparent", e.filter = "none", e.fillStyle = "#000", e.beginPath(), e.roundRect(0, 0, S, M, M0(t) * S), e.fill(), e.restore();
}
function $a(e, t, r, s = M, n = !1, a, o) {
  if (ze(t)) {
    d0(e, t, r, a, o);
    return;
  }
  if (Ce(t)) {
    a0(e, t, r, a, o);
    return;
  }
  if (t.frameAssetFamily) {
    In(e, t, r, a, o);
    return;
  }
  if (ke(t)) {
    sn(e, t, r, a, o);
    return;
  }
  if (K(t) === "saga") {
    l0(e, t, r, a, o);
    return;
  }
  const l = de(t);
  if (l.length) {
    e.fillStyle = ge(t.setCode, t.borderColor).border, e.fillRect(0, 0, S, M);
    for (const B of l)
      e.save(), aa(e, B), $a(
        e,
        B.face,
        r,
        B.height * S / B.width,
        !0,
        a,
        o
      ), e.restore();
    if (o === "artwork") return;
    $r(e, t), Ft(t) && (e.font = '14px "CardRenderer MTG MPlantin", Georgia', e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      S / 2,
      M - 12,
      S * 0.9
    ));
    return;
  }
  const i = (B) => [
    B[0] * S,
    B[1] * s,
    B[2] * S,
    B[3] * s
  ];
  e.fillStyle = ge(t.setCode, t.borderColor).border, e.fillRect(0, 0, S, s);
  const c = ue(t), d = K(t);
  if (o === "artwork") {
    Re(e, t, r, i(c.art), o);
    return;
  }
  const h = ne(t), u = Pt(h, d), g = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[h.boxes] ?? "#827d72", f = (B, D, re = "top") => {
    const Oe = r.get(B);
    if (!Oe) return !1;
    const [_e, ft, pt, bt] = i(D);
    e.save(), e.beginPath(), e.rect(_e, ft, pt, bt), e.clip();
    const Vt = re === "stretch" ? bt : Oe.height * pt / Oe.width;
    return e.drawImage(
      Oe,
      _e,
      re === "bottom" ? ft + bt - Vt : ft,
      pt,
      Vt
    ), e.restore(), !0;
  }, [y, k, w, b] = i(h.legendary ? c.legendaryBackground : c.background);
  if (e.save(), e.beginPath(), e.roundRect(y, k, w, b, [
    { x: w * 0.01282, y: b * 962e-5 },
    { x: w * 0.01282, y: b * 962e-5 },
    { x: w * 0.06838, y: b * 0.05128 },
    { x: w * 0.06838, y: b * 0.05128 }
  ]), e.clip(), n) {
    const B = g.slice(1).match(/../g).map(
      (D, re) => Math.round(parseInt(D, 16) * 0.62 + [244, 236, 217][re] * 0.38)
    );
    e.fillStyle = `rgb(${B.join(",")})`, e.fillRect(y, k, w, b);
  }
  const p = r.get(u.background), v = d.startsWith("planeswalker");
  if (p && v ? Cr(e, p, y, k, w, d === "planeswalker-large") : p ? e.drawImage(
    p,
    y,
    k + (h.legendary ? j.legendaryBackgroundLift : 0),
    w,
    n ? b : p.height * w / p.width
  ) : (e.fillStyle = g, e.fillRect(y, k, w, b)), e.restore(), e.fillStyle = "#e3d8bb", !r.has(u.frame))
    if (d === "adventure")
      for (const B of gt(t).filter((D) => D.kind === "rules" && !D.color))
        e.fillRect(B.x, B.y, B.width, B.height);
    else e.fillRect(...i(c.rules));
  r.has(u.boxes) || (e.fillRect(...i(c.title)), e.fillRect(...i(c.type))), e.fillStyle = "#80745c", v || e.fillRect(...i(c.art));
  const C = r.get(u.frame);
  if (C && d === "normal" && !n) {
    const B = Ys(t);
    A0(
      e,
      h,
      B,
      () => Gr(e, C, h.legendary, c.frame, !0, B)
    ), L0(e, h, B);
  }
  if (a && (e.save(), e.beginPath(), e.rect(0, 0, S, s), e.clip(), e.resetTransform(), e.drawImage(a, 0, 0, e.canvas.width, e.canvas.height), e.restore()), d === "normal" && !n) {
    const [B, D, re, Oe] = i(c.art), _e = He.artRim;
    e.fillStyle = "#090806", e.fillRect(B - _e, D, re + 2 * _e, Oe);
  }
  if (Re(e, t, r, i(c.art), o), v && vn(e, t), C && v) {
    const [B, D, re] = i(c.frame);
    Cr(e, C, B, D, re, d === "planeswalker-large");
  } else C && d !== "normal" && Gr(e, C, h.legendary, c.frame);
  if (h.legendary && f(u.crown, c.crown), n) {
    const B = r.get(u.boxes);
    if (B) {
      const re = B.height * 0.104;
      e.drawImage(B, 0, 0, B.width, re, ...i(c.title)), e.drawImage(B, 0, B.height - re, B.width, re, ...i(c.type));
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
    const B = v && ["Colourless", "Artifact", "Land"].includes(h.boxes);
    f(u.boxes, c.title), B && (e.save(), e.globalAlpha *= Ca, f(u.boxes, c.title), e.restore());
    const D = r.get(u.boxes);
    v && D ? Tn(e, D, c.type, B) : (f(u.boxes, c.type, "bottom"), d === "normal" && D && (An(e, D, i(c.type)), xn(e, i(c.type), h.boxes)));
  }
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left";
  const [R, L, T, I] = i(c.title), x = R + j.plateLeft + (d === "normal" ? 1 : 0), P = As(t), A = t.manaSymbols ?? [], E = j.manaSize * P, $ = A.length * E + Math.max(0, A.length - 1) * j.manaGap, q = R + T - j.plateRight, Q = q - $, O = (d === "normal" && !n ? j.normalTitleFont : j.titleFont) * P;
  e.font = `bold ${O}px "CardRenderer MTG Beleren", Georgia`, e.letterSpacing = `${j.titleTracking}px`, he(
    e,
    t.name,
    x,
    L + I / 2 + (d === "normal" ? 1 : 0),
    Q - x - (A.length ? j.titleGap : 0),
    O,
    !0
  ), e.letterSpacing = "0px", A.forEach(
    (B, D) => J(
      e,
      B,
      Q + D * (E + j.manaGap),
      L + I / 2 - E / 2 + j.manaLift / 2,
      E,
      r,
      !0
    )
  );
  const _ = se(t), G = r.get(_ ?? ""), ae = we(_), ee = De(t), Be = Ra(t), Me = ma(t), fe = Be && d === "normal", V = fe ? Mn : 1, W = j.setMargin + (fe ? 2 : 0), [, F, , N] = i(c.type), oe = F + N / 2 + j.typeLift / 2 + (d === "normal" || v ? 2 : 0), te = G ? Math.min(
    j.setMaxWidth,
    j.setHeight * G.width * ee[2] / (G.height * ee[3])
  ) : 0, me = G ? Math.min(
    te / (G.width * ee[2]),
    j.setHeight / (G.height * ee[3])
  ) : 0, ye = [
    q - W - te - te * (V - 1) / 2 + (v ? 1.5 : 0),
    oe - (G?.height ?? 0) * ee[3] * me * V / 2 - (fe ? 1 : 0),
    (G?.width ?? 0) * ee[2] * me * V,
    (G?.height ?? 0) * ee[3] * me * V
  ], X = d === "normal" && !n ? Yt(t, _, ye, "component") : ye, Ea = Math.max(
    1,
    Math.min(
      q - x - (G ? te * (1 + (V - 1) / 2) + W + j.typeGap : 0),
      G && X !== ye ? X[0] - x - j.typeGap : 1 / 0
    )
  );
  e.font = `${j.typeFont * P}px "CardRenderer MTG Beleren", Georgia`, he(
    e,
    t.typeLine ?? "",
    x + (v ? 1.5 : 0),
    oe,
    Ea,
    j.typeFont * P,
    !1,
    d === "normal" && !n ? He.typeWidthScale : 1
  ), G && (ae || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(G, ...X), e.restore()) : Be ? Ta(
    e,
    G,
    t.rarity,
    ...X,
    ee,
    fe ? 1.5 : 1
  ) : Me ? ga(
    e,
    G,
    Me,
    t.rarity,
    ...X,
    ee,
    d === "normal"
  ) : xe(e, G, t.setCode, t.rarity, ...X, ee)), ya(t) ? gn(e, t, r) : d !== "normal" ? Rn(e, t, r) : be(e, da(e, t, s, P), r);
  const Xt = Ja(t);
  if (Xt && d !== "leveler") {
    f(u.pt, c.stats, "stretch");
    const [B, D, re] = i(c.stats);
    e.fillStyle = d.startsWith("planeswalker") ? "white" : "#17140f", e.font = `bold ${j.statsFont}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      Xt.text,
      B + re / 2,
      D + (d.startsWith("planeswalker") ? c.stats[3] * M / 2 : j.statsLine / 2 + (d === "normal" ? 2 : 0)),
      re
    );
  }
  n || $r(e, t);
}
function $r(e, t) {
  const [r, s, n, a] = Ga(Y.footer), o = s + j.footerLine;
  e.save(), e.beginPath(), e.rect(r, s, n, a), e.clip(), e.textAlign = "left", e.textBaseline = "top", e.fillStyle = ge(t.setCode, t.borderColor).ink, e.font = `${j.footerFont}px "CardRenderer MTG Relay", sans-serif`, e.letterSpacing = `${j.footerTracking}px`;
  const l = t.setCode?.trim().toUpperCase() ?? "";
  e.fillText(l, r, o);
  let i = r + e.measureText(l).width;
  e.letterSpacing = "0px", t.artist && (i += j.artistMarginLeft, e.font = `${j.footerFont}px "CardRenderer MTG Artist Credit", sans-serif`, e.fillText("a", i, o), i += e.measureText("a").width + j.artistMarginRight, e.font = `${j.footerFont * 1.154}px "CardRenderer MTG Beleren", Georgia`, e.fillText(t.artist, i, o)), e.restore();
}
function Gr(e, t, r, s = Y.frame, n = !1, a = 0) {
  const [o, l, i, c] = Ga(s), d = a, h = o + d, u = i - 2 * d, m = Math.min(t.height, c * t.width / i), g = m * i / t.width, f = e.getTransform().a, y = () => {
    if (!n) {
      e.drawImage(t, 0, 0, t.width, m, h, l, u, g);
      return;
    }
    const k = 424, w = 436;
    e.save(), e.beginPath(), e.rect(0, 0, S, k), e.rect(0, w, S, M - w), e.clip(), e.drawImage(t, 0, 0, t.width, m, h, l, u, g), e.restore(), e.save(), e.beginPath(), e.rect(0, k, S, w - k), e.clip(), e.drawImage(t, 0, 0, t.width, m, h, l - 1, u, g), e.restore();
  };
  e.save(), e.shadowColor = "black", e.shadowOffsetX = -394e-5 * S * f, e.shadowOffsetY = 394e-5 * S * f, e.shadowBlur = 236e-5 * S * f, y(), r || (e.shadowColor = "#ffffffa0", e.shadowOffsetX = 157e-5 * S * f, e.shadowOffsetY = -315e-5 * S * f, e.shadowBlur = 157e-5 * S * f, y()), e.restore();
}
function Ga(e) {
  return [e[0] * S, e[1] * M, e[2] * S, e[3] * M];
}
export {
  qn as $,
  Za as A,
  M as B,
  cn as C,
  Un as D,
  Qa as E,
  Y as F,
  Xn as G,
  S as H,
  Ss as I,
  We as J,
  ys as K,
  gs as L,
  Ts as M,
  ot as N,
  xa as O,
  Hn as P,
  ge as Q,
  Pe as R,
  le as S,
  Vs as T,
  _n as U,
  Qn as V,
  rs as W,
  un as X,
  gt as Y,
  mn as Z,
  ao as _,
  M0 as a,
  As as a$,
  es as a0,
  Ja as a1,
  Wn as a2,
  Ut as a3,
  qs as a4,
  ya as a5,
  nt as a6,
  so as a7,
  Z as a8,
  Lr as a9,
  Dt as aA,
  pe as aB,
  Zr as aC,
  ht as aD,
  Ae as aE,
  Rs as aF,
  Jr as aG,
  ar as aH,
  ie as aI,
  Kn as aJ,
  Qr as aK,
  rr as aL,
  z0 as aM,
  Sa as aN,
  ts as aO,
  Lt as aP,
  Vn as aQ,
  _t as aR,
  o0 as aS,
  va as aT,
  De as aU,
  bs as aV,
  Fn as aW,
  Sn as aX,
  Xs as aY,
  Xe as aZ,
  Ft as a_,
  Aa as aa,
  ln as ab,
  yn as ac,
  ja as ad,
  da as ae,
  zn as af,
  $a as ag,
  Br as ah,
  Nn as ai,
  gn as aj,
  he as ak,
  Re as al,
  J as am,
  vn as an,
  sn as ao,
  sa as ap,
  be as aq,
  xe as ar,
  Rn as as,
  Zn as at,
  aa as au,
  Ga as av,
  kn as aw,
  Jn as ax,
  z as ay,
  Ms as az,
  se as b,
  it as b0,
  ut as b1,
  oo as c,
  no as d,
  ro as e,
  ue as f,
  to as g,
  Dn as h,
  Pn as i,
  j,
  K as k,
  ke as l,
  dt as m,
  Pt as n,
  ne as o,
  nr as p,
  ce as q,
  jn as r,
  de as s,
  Wt as t,
  ks as u,
  Qe as v,
  eo as w,
  Pr as x,
  w0 as y,
  b0 as z
};
