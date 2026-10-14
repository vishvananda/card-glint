const vt = "WUBRG";
function Z(e) {
  const t = e.typeLine ?? "", r = e.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(t), a = e.land ?? /(^|\s)Land(?:\s|$)/i.test(t), n = !/\bPlaneswalker\b/i.test(t) && (e.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(t)), s = e.creature ?? /(^|\s)Creature(?:\s|$)/i.test(t), o = _(e), l = o.length === 0 ? "Colourless" : o.length > 2 ? "Gold" : o.join(""), i = (r || a) && o.length === 0 ? "Artifact" : l, d = a ? "Land" : r ? "Artifact" : o.length > 1 ? "Gold" : l;
  return {
    frame: i,
    boxes: d,
    background: d,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: a && o.length > 0 ? l : r && o.length > 0 ? o.length > 1 ? "Gold" : l : d,
    pt: d,
    artifact: r,
    land: a,
    legendary: n,
    creature: s,
    className: `rendered-card-profile-${d.toLocaleLowerCase()}`
  };
}
function _(e) {
  return Qa(e.frameColors ?? e.colors ?? []);
}
function Qa(e) {
  return [
    ...new Set(
      e.map((t) => t.toLocaleUpperCase()).filter((t) => vt.includes(t))
    )
  ].sort((t, r) => vt.indexOf(t) - vt.indexOf(r));
}
const es = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", ts = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", rs = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", as = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", ss = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", Me = {
  RENDERER_COMPONENT_ROOT: es,
  KEYRUNE_ROOT: ts,
  CONJURER_ROOT: rs,
  RETRO_ROOT: as,
  RETRO_SYMBOL_FONT: ss
}, ns = { "10e": "cmrsu", "2ed": "cmrsu", "2x2": "cmrsu", "2xm": "cmrsu", "30a": "cmrsu", "3ed": "cmrsu", "40k": "cmrsu", "4ed": "cmrsu", "5dn": "cmrsu", "5ed": "cmrsu", "6ed": "cmrsu", "7ed": "cmrsu", "8ed": "cmrsu", "9ed": "cmrsu", a25: "cmrsu", acr: "cmrsu", aer: "cmrsu", afc: "cmrsu", afr: "cmrsu", akh: "cmrsu", akr: "cmrsu", ala: "cmrsu", all: "cmrsu", ana: "cmrsu", apc: "cmrsu", arb: "cmrsu", arc: "cmrsu", archie: "cmrsu", arena: "cmrsu", arn: "cmrsu", ath: "cmrsu", atq: "cmrsu", avr: "cmrsu", azorius: "cmru", bbd: "cmrsu", bfz: "cmrsu", big: "cmrsu", blb: "cmrsu", blc: "cmrsu", bng: "cmrsu", bok: "cmrsu", boros: "cmru", bot: "cmrsu", brb: "cmrsu", brc: "cmrsu", bro: "cmrsu", brr: "cmrsu", btd: "cmrsu", c13: "cmrsu", c14: "cmrsu", c15: "cmrsu", c16: "cmrsu", c17: "cmrsu", c18: "cmrsu", c19: "cmrsu", c20: "cmrsu", c21: "cmrsu", cc1: "cmrsu", cc2: "cmrsu", ced: "cmrsu", cei: "cmrsu", chk: "cmrsu", chr: "cmrsu", clb: "cmrsu", clu: "cmrsu", cm1: "cmrsu", cm2: "cmrsu", cma: "cmrsu", cmd: "cmrsu", cmm: "cmrsu", cmr: "cmrsu", cn2: "cmrsu", cns: "cmrsu", con: "cmrsu", conf: "cmrsu", csp: "cmrsu", dci: "cmrsu", dd1: "cmrsu", dd2: "cmrsu", ddc: "cmrsu", ddd: "cmrsu", dde: "cmrsu", ddf: "cmrsu", ddg: "cmrsu", ddh: "cmrsu", ddi: "cmrsu", ddj: "cmrsu", ddk: "cmrsu", ddl: "cmrsu", ddm: "cmrsu", ddn: "cmrsu", ddo: "cmrsu", ddp: "cmrsu", ddq: "cmrsu", ddr: "cmrsu", dds: "cmrsu", ddt: "cmrsu", ddu: "cmrsu", default: "cmrsu", dft: "cmrsu", dgm: "cmrsu", dimir: "cmru", dis: "cmrsu", dka: "cmrsu", dkm: "cmrsu", dmc: "cmrsu", dmr: "cmrsu", dmu: "cmrsu", dom: "cmrsu", dpa: "cmrsu", drb: "cmrsu", drc: "cmrsu", drk: "cmrsu", dsc: "cmrsu", dsk: "cmrsu", dst: "cmrsu", dtk: "cmrsu", e01: "cmrsu", e02: "cmrsu", ecc: "cmrsu", ecl: "cmrsu", eld: "cmrsu", ema: "cmrsu", emn: "cmrsu", eoc: "cmrsu", eoe: "cmrsu", eos: "cmru", eve: "cmrsu", exo: "cmrsu", exp: "cmrsu", fca: "cmrsu", fdc: "cmrsu", fdn: "cmrsu", fem: "cmrsu", fic: "cmrsu", fin: "cmrsu", fnm: "r", fra: "cmrsu", frc: "cmrsu", frf: "cmrsu", fut: "cmrsu", gn2: "cmrsu", gn3: "cmrsu", gnt: "cmrsu", golgari: "cmru", gpt: "cmrsu", grn: "cmrsu", gruul: "cmru", gs1: "cmrsu", gtc: "cmrsu", h09: "cmrsu", h17: "cmrsu", ha1: "cmrsu", hbg: "cmrsu", hml: "cmrsu", hob: "cmrsu", hoc: "cmrsu", hop: "cmrsu", hou: "cmrsu", ice: "cmrsu", idw: "cmrsu", iko: "cmrsu", ima: "cmrsu", inr: "cmrsu", inv: "cmrsu", isd: "cmrsu", izzet: "cmru", j20: "cmrsu", j21: "cmrsu", j22: "cmrsu", j25: "cmru", jmp: "cmrsu", jou: "cmrsu", jud: "cmrsu", khc: "cmrsu", khm: "cmrsu", kld: "cmrsu", klr: "cmrsu", ktk: "cmrsu", lcc: "cmrsu", lci: "cmrsu", lea: "cmrsu", leb: "cmrsu", leg: "cmrsu", lgn: "cmrsu", lrw: "cmrsu", ltc: "cmrsu", ltr: "cmrsu", m10: "cmrsu", m11: "cmrsu", m12: "cmrsu", m13: "cmrsu", m14: "cmrsu", m15: "cmrsu", m19: "cmrsu", m20: "cmrsu", m21: "cmrsu", m3c: "cmrsu", mat: "cmrsu", mb2: "cmrsu", mbc: "cmrsu", mbs: "cmrsu", mc3: "cmrsu", md1: "cmrsu", me1: "cmrsu", me2: "cmrsu", me3: "cmrsu", me4: "cmrsu", med: "cmrsu", mh1: "cmrsu", mh2: "cmrsu", mh3: "cmrsu", mic: "cmrsu", mid: "cmrsu", mir: "cmrsu", mkc: "cmrsu", mkm: "cmrsu", mm2: "cmrsu", mm3: "cmrsu", mma: "cmrsu", mmq: "cmrsu", moc: "cmrsu", mom: "cmrsu", mor: "cmrsu", mp2: "cmrsu", mps: "cmrsu", mrd: "cmrsu", msc: "cmrsu", msh: "cmrsu", mtga: "cmrsu", mtgo: "cmrsu", mul: "cmrsu", ncc: "cmrsu", nec: "cmrsu", nem: "cmrsu", neo: "cmrsu", nph: "cmrsu", ody: "cmrsu", ogw: "cmrsu", om1: "cmrsu", omb: "cmrsu", onc: "cmrsu", one: "cmrsu", ons: "cmrsu", ori: "cmrsu", orzhov: "cmru", otc: "cmrsu", otj: "cmrsu", otp: "cmrsu", p02: "cmrsu", papac: "cmrsu", parl2: "cmrsu", past: "cmrsu", pbook: "cmrsu", pc2: "cmrsu", pca: "cmrsu", pcy: "cmrsu", pd2: "cmrsu", pd3: "cmrsu", pdrc: "c", peuro: "cmrsu", pgru: "c", phpr: "cmrsu", phuk: "cmrsu", pidw: "cmrsu", pio: "cmrsu", pip: "cmrsu", planeswalker: "cmrsu", plc: "cmrsu", pls: "cmrsu", pmps: "cmrsu", por: "cmrsu", prm: "cmrsu", ps11: "cmrsu", psal: "cmrsu", psdg: "cmrsu", psum: "cmrsu", ptg: "cmrsu", ptk: "cmrsu", pvan: "c", pxbox: "cmrsu", pz1: "cmrsu", pz2: "cmrsu", pza: "cmrsu", rav: "cmrsu", ren: "cmrsu", rex: "cmrsu", rin: "cmrsu", rix: "cmrsu", rna: "cmrsu", roe: "cmrsu", rtr: "cmrsu", rvr: "cmrsu", s00: "cmrsu", s99: "cmrsu", scd: "cmrsu", scg: "cmrsu", sds: "cmrsu", selesnya: "cmru", shm: "cmrsu", simic: "cmru", sir: "cmrsu", sis: "cmrsu", sld: "cmrsu", snc: "cmrsu", soa: "cmrsu", soc: "cmrsu", soi: "cmrsu", sok: "cmrsu", som: "cmrsu", sos: "cmrsu", spe: "cmrsu", spg: "cmrsu", spm: "cmrsu", ss1: "cmrsu", ss2: "cmrsu", ss3: "cmrsu", sta: "cmrsu", star: "cmrsu", sth: "cmrsu", stx: "cmrsu", td0: "cmrsu", td2: "cmrsu", tdc: "cmrsu", tdm: "cmrsu", thb: "cmrsu", ths: "cmrsu", tla: "cmrsu", tle: "cmrsu", tlr: "c", tmc: "cmrsu", tmp: "cmrsu", tmt: "cmrsu", tor: "cmrsu", tpr: "cmrsu", trc: "cmrsu", trk: "cmrsu", tsp: "cmrsu", tsr: "cmrsu", uds: "cmrsu", ugl: "cmrsu", ulg: "cmrsu", uma: "cmrsu", und: "cmrsu", unf: "cmrsu", unh: "cmrsu", usg: "cmrsu", ust: "cmrsu", v09: "cmrsu", v10: "cmrsu", v11: "cmrsu", v12: "cmrsu", v13: "cmrsu", v14: "cmrsu", v15: "cmrsu", v16: "cmrsu", v17: "cmrsu", van: "cmrsu", vis: "cmrsu", vma: "cmrsu", voc: "cmrsu", vow: "cmrsu", w16: "cmrsu", w17: "cmrsu", war: "cmrsu", who: "cmrsu", woc: "cmrsu", woe: "cmrsu", wor: "u", wot: "cmrsu", wth: "cmrsu", wwk: "cmrsu", x2ps: "cmrsu", xln: "cmrsu", y22: "cmrsu", y23: "cmrsu", y24: "cmrsu", y25: "cmrsu", y26: "cmrsu", zen: "cmrsu", znc: "cmrsu", zne: "cmrsu", znr: "cmrsu" }, os = {
  codes: ns
}, ls = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), is = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function Hr(e) {
  return ls.has(e?.trim().toLowerCase() ?? "");
}
function ds(e) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(e?.toLowerCase() ?? "") ? 0 : 1;
}
function cs(e, t) {
  const r = e?.trim().toLowerCase() ?? "";
  return is.has(r) || r === "atq" && t === "Reconstruction";
}
const F = Me.CONJURER_ROOT, qr = `${F}/img/setSymbols/official/`, lr = os.codes, hs = {
  common: "c",
  uncommon: "u",
  rare: "r",
  mythic: "m",
  special: "s",
  bonus: "s"
};
function Xr(e, t = "common", r = "auto") {
  const a = e.trim().toLowerCase();
  if (r === "keyrune") return null;
  const n = Hr(a) ? "c" : hs[t];
  return n && Object.hasOwn(lr, a) && lr[a].includes(n) ? `${qr}${a}-${n}.svg` : null;
}
function pe(e) {
  return !!e?.startsWith(qr);
}
const tt = `${F}/img/frames/saga`, Vr = [
  `${tt}/sagaMaskPinline.png`,
  `${tt}/sagaMaskBanner.png`,
  `${tt}/sagaMaskBannerRight.png`,
  `${tt}/sagaMidStripe.png`
];
function Kr(e) {
  const t = _(e);
  return t.length !== 2 || e.layout === "transform" || e.land || /\bLand\b/.test(e.typeLine ?? "") ? [] : ("WUBRG".indexOf(t[1]) - "WUBRG".indexOf(t[0]) > 2 && t.reverse(), t.map(
    (r) => `${F}/data/images/cardImages/saga/sagaFrame${r}.png`
  ));
}
function us(e) {
  const t = Kr(e);
  return t.length ? [...t, ...Vr] : [];
}
const ir = /* @__PURE__ */ new WeakMap();
function ms(e, t, r) {
  const a = Kr(t);
  if (!a.length) return;
  const n = [...a, ...Vr].map((w) => {
    const v = r.get(w);
    if (!v) throw Error(`Saga color asset unavailable: ${w}`);
    return v;
  }), s = ir.get(n[0]);
  if (s && s.sources.every((w, v) => w === n[v])) {
    e.drawImage(s.canvas, 0, 0, 488, 680);
    return;
  }
  const [o, l, i, d, c, h] = n, u = document.createElement("canvas");
  u.width = o.width, u.height = o.height;
  const m = document.createElement("canvas");
  m.width = u.width, m.height = u.height;
  const g = document.createElement("canvas");
  g.width = u.width, g.height = u.height;
  const f = u.getContext("2d"), k = m.getContext("2d"), p = g.getContext("2d"), b = u.width, y = u.height;
  p.drawImage(i, 0, 0, b, y), p.drawImage(d, 0, 0, b, y), f.drawImage(o, 0, 0, b, y), f.globalCompositeOperation = "destination-in", f.drawImage(g, 0, 0), f.globalCompositeOperation = "source-over", p.clearRect(0, 0, b, y), p.save(), p.beginPath(), p.rect(b / 2, 0, b / 2, y), p.clip(), p.drawImage(i, 0, 0, b, y), p.restore(), p.drawImage(c, 0, 0, b, y), k.drawImage(l, 0, 0, b, y), k.globalCompositeOperation = "destination-in", k.drawImage(g, 0, 0), f.drawImage(m, 0, 0), f.drawImage(h, 0.0727 * b, 0.3058 * y, 87e-4 * b, 0.4762 * y), ir.set(o, { sources: n, canvas: u }), m.width = m.height = g.width = g.height = 0, e.drawImage(u, 0, 0, 488, 680);
}
function gs(e) {
  return e.power != null && e.toughness != null ? {
    text: `${e.power}/${e.toughness}`,
    label: `Power ${e.power}, toughness ${e.toughness}`
  } : e.loyalty != null && e.loyalty !== "" ? { text: String(e.loyalty), label: `Starting loyalty ${e.loyalty}` } : null;
}
const S = 488, M = 680, fs = 0.058;
function fe(e, t) {
  if (t === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (t ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    e?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const ps = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", z = {
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
}, dr = (e) => e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
function bs(e = z) {
  return {
    ...Object.fromEntries(
      Object.entries(e).flatMap(
        ([t, r]) => r.map((a, n) => [
          `--face-${dr(t)}-${["x", "y", "w", "h"][n]}`,
          `${a * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(j).map(([t, r]) => [
        `--face-${dr(t)}`,
        `${r / S * 100}cqw`
      ])
    )
  };
}
const Ro = bs();
function ws(e) {
  return e.length > 340 ? "dense" : e.length > 210 ? "long" : "normal";
}
function To(e) {
  return {
    dense: j.denseRulesFont,
    long: j.longRulesFont,
    normal: j.normalRulesFont
  }[ws(e)];
}
function gt(e) {
  return e.split(/(\{[^}\n]+\})/g).filter(Boolean).map((t) => ({
    value: t,
    symbol: /^\{[^}\n]+\}$/.test(t) ? t.slice(1, -1) : null
  }));
}
function ys(e) {
  const t = e.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[t] ?? t.slice(0, 3);
}
const Xe = `${F}/img/frames/saga`;
function Jr(e) {
  const t = _(e), r = t.length > 1 ? "M" : t[0];
  if (/\bLand\b/.test(e.typeLine ?? "") || e.land) return `${Xe}/regular/l.png`;
  if (e.layout === "transform" && r) return `${Xe}/dfc/${r.toLowerCase()}.png`;
  if (r) return `${F}/data/images/cardImages/saga/sagaFrame${r}.png`;
  throw Error("No ordinary colorless or artifact Saga plate is available.");
}
function $t(e) {
  return e.layout === "transform" && e.setCode?.toLowerCase() === "neo" ? `${F}/img/frames/m15/transform/icons/fanClosed.svg` : null;
}
const Zr = `${Xe}/sagaChapter.png`, Qr = `${Xe}/sagaDivider.png`, Ne = `${Xe}/stamp.png`;
function ks(e) {
  return [
    Jr(e),
    ...us(e),
    Zr,
    Qr,
    ...$t(e) ? [$t(e)] : [],
    ...["rare", "mythic"].includes(e.rarity ?? "") ? [Ne] : []
  ];
}
const ea = {
  ...z,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.5007, 0.1134, 0.4233, 0.724],
  type: [0.0854, 0.8481, 0.8292, 0.0543],
  rules: [0.0867, 0.1129, 0.404, 0.7248],
  stamp: [0.17, 0.48, 0.23, 0.16506]
}, lt = 310.216, cr = {
  frame: [52, 20, 298, 449],
  title: [70, 40, 261, 26],
  art: [65, 76.5, 270, 183.8],
  type: [70, 265, 261, 23],
  rules: [74, 301, 255, 160],
  artistY: 0,
  legalY: 0
}, Ss = `${F}/img/frames/m15/split`, hr = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style", ta = [
  `${hr}/namebox/texture/normal/c.png`,
  `${hr}/typebox/texture/normal/c.png`
], _t = (e) => `${Ss}${e.layout?.endsWith("-fuse") ? "/fuse" : ""}`;
function Ut(e) {
  const t = _(e);
  return `${_t(e)}/${t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "a"}.png`;
}
function ra(e) {
  const t = e.manaSymbols ?? [];
  return t.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !t.some((r) => /^[WUBRG]$/.test(r));
}
function vs(e) {
  const t = _(e);
  return [
    Ut(e),
    ...t.length === 2 ? t.map((r) => `${_t(e)}/${r.toLowerCase()}.png`) : [],
    ...t.length === 2 && ra(e) ? ta : [],
    ...["rare", "mythic"].includes(e.rarity ?? "") ? [Ne] : []
  ];
}
const Oe = /* @__PURE__ */ new Map(), Ct = /* @__PURE__ */ new WeakMap();
let Cs = 0, Rt = 0;
const Rs = (e) => (Ct.has(e) || Ct.set(e, ++Cs), Ct.get(e));
function rt(e, t, r, a, n, s) {
  e.moveTo(t + s, r), e.lineTo(t + a - s, r), e.quadraticCurveTo(t + a + s * 0.25, r + n / 2, t + a - s, r + n), e.lineTo(t + s, r + n), e.quadraticCurveTo(t - s * 0.25, r + n / 2, t + s, r), e.closePath();
}
function Ts(e, t) {
  const r = (g) => {
    const f = t.get(g);
    if (!f) throw Error(`Modern split asset unavailable: ${g}`);
    return f;
  }, a = r(Ut(e)), n = _(e);
  if (n.length !== 2) return a;
  "WUBRG".indexOf(n[1]) - "WUBRG".indexOf(n[0]) > 2 && n.reverse();
  const s = ra(e), o = [
    ...n.map((g) => r(`${_t(e)}/${g.toLowerCase()}.png`)),
    ...s ? ta.map(r) : [a]
  ], l = n.join("") + (s ? "-hybrid-" : "-gold-") + [a, ...o].map(Rs).join("/"), i = Oe.get(l);
  if (i)
    return Oe.delete(l), Oe.set(l, i), i;
  const d = document.createElement("canvas");
  d.width = a.width, d.height = a.height;
  const c = d.getContext("2d");
  c.scale(d.width / 488, d.height / 680), c.translate(0, 680), c.rotate(-Math.PI / 2);
  const h = (g) => {
    c.save(), c.translate(680, 0), c.rotate(Math.PI / 2), c.drawImage(g, 0, 0, 488, 680), c.restore();
  }, u = e.layout?.endsWith("-fuse") ?? !1;
  h(a);
  for (const g of [0, lt]) {
    if (c.save(), c.beginPath(), s ? c.rect(g + 50, 0, lt, 488) : (rt(c, g + 57.5, 29, 286, 47, 9), c.rect(g + 64, 74, 273, u ? 362 : 394), rt(c, g + 57.5, 260, 286, 34, 7)), u)
      for (const [b, y] of [
        [29, 47],
        [260, 34]
      ])
        c.moveTo(334, b), c.lineTo(356, b + y / 2), c.lineTo(378, b), c.lineTo(378, b + y), c.lineTo(356, b + y / 2), c.lineTo(334, b + y), c.closePath();
    c.clip(), h(o[0]);
    const f = document.createElement("canvas");
    f.width = d.width, f.height = d.height;
    const k = f.getContext("2d");
    k.drawImage(o[1], 0, 0, f.width, f.height), k.globalCompositeOperation = "destination-in";
    const p = k.createLinearGradient(
      0,
      (680 - g - 175) / 680 * f.height,
      0,
      (680 - g - 230) / 680 * f.height
    );
    if (p.addColorStop(0, "#0000"), p.addColorStop(1, "#000"), k.fillStyle = p, k.fillRect(0, 0, f.width, f.height), c.save(), c.translate(680, 0), c.rotate(Math.PI / 2), c.drawImage(f, 0, 0, 488, 680), c.restore(), c.restore(), f.width = f.height = 0, c.save(), c.beginPath(), rt(c, g + 62.5, 34.5, 276, 37.5, 7), rt(c, g + 62.5, 265, 276, 24, 5), u)
      for (const [b, y] of [
        [35, 37],
        [265, 24]
      ])
        c.moveTo(332, b), c.lineTo(349, b + y / 2), c.lineTo(332, b + y), c.closePath(), c.moveTo(380, b), c.lineTo(363, b + y / 2), c.lineTo(380, b + y), c.closePath();
    c.clip(), s ? (c.drawImage(o[2], 22, 7, 196, 19, g + 62.5, 34.5, 276, 37.5), c.drawImage(o[3], 22, 192, 196, 11, g + 62.5, 265, 276, 24)) : h(o[2]), c.restore();
  }
  const m = d.width * d.height * 4;
  for (const [g, f] of Oe) {
    if (Rt + m <= 16 * 1024 * 1024) break;
    Rt -= f.width * f.height * 4, Oe.delete(g), f.width = f.height = 0;
  }
  return m <= 16 * 1024 * 1024 && (Oe.set(l, d), Rt += m), d;
}
function Ke(e) {
  return ["split", "aftermath"].includes(e.layout ?? "") && e.faces?.length === 2 && (e.layout === "aftermath" || /^Aftermath\b/m.test(e.faces[1].rulesText ?? ""));
}
const Le = 373, aa = 257, sa = `${F}/img/frames/saga/stamp.png`;
function na(e) {
  const t = _(e), r = t.length > 1 ? "m" : t[0]?.toLowerCase();
  if (!r) throw Error("No validated colorless Aftermath plate is available.");
  return `${F}/img/frames/m15/aftermath/${r}.png`;
}
function Ms(e) {
  return Ke(e) ? [
    ...e.faces.map(na),
    ...["rare", "mythic"].includes(e.rarity ?? "") ? [sa] : []
  ] : [];
}
const Nt = {
  title: [41.7, 35.5, 405, 37],
  art: [37.4, 76.5, 413.2, 151.8],
  type: [41.7, 235.8, 405, 37],
  rules: [41.7, 281.5, 405, 76]
}, Yt = {
  title: [12, 37.5, 227, 37],
  art: [11, 80.7, 240.9, 137.9],
  type: [12, 235.2, 227, 37],
  rules: [14, 276.5, 232, 169]
};
function Is(e) {
  const t = e ? Yt : Nt, r = e ? aa : 488, a = e ? 488 : Le, n = (s) => {
    const [o, l, i, d] = t[s];
    return [o / r, l / a, i / r, d / a];
  };
  return {
    ...z,
    title: n("title"),
    art: n("art"),
    type: n("type"),
    rules: n("rules"),
    footer: [0, 1, 0, 0]
  };
}
const xs = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function oa(e) {
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
function zt(e) {
  if (e.wordingMode === "oracle" || !["mir", "tmp"].includes(e.setCode?.toLowerCase() ?? "")) return null;
  const t = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    e.typeLine ?? ""
  )?.[1];
  if (!t) return null;
  const r = xs[t];
  return oa(e) !== r ? null : {
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
const As = Me.KEYRUNE_ROOT, Ls = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function Ee(e) {
  return !e.setSymbol && !Xr(e.setCode ?? "", e.rarity, e.setSymbolSource) ? Ls[e.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1] : [0, 0, 1, 1];
}
const la = new Set(
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
la.add("con_");
const $s = "GLINT", it = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function Es(e) {
  const t = it[e] ?? it.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${t}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function Bs(e) {
  const t = it[e] ?? it.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${t}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function Gs(e, t = "common", r) {
  const a = e.trim().toLowerCase();
  if (a === "forge") return Bs(t);
  if (a === $s.toLowerCase()) return Es(t);
  const n = Xr(a, t, r);
  if (n) return n;
  const s = a === "con" ? "con_" : a === "p02" ? "po2" : a;
  return la.has(s) ? `${As}/${s}.svg` : null;
}
const ur = {
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
function Os(e) {
  return Object.hasOwn(ur, e) ? ur[e] : null;
}
const Fe = Me.RENDERER_COMPONENT_ROOT;
function Ht(e, t = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(t), a = t === "saga" ? "saga" : t === "planeswalker-large" ? "planeswalker_large" : t, n = ["saga", "class"].includes(t) && e.boxes === "Colourless" ? "Land" : t.startsWith("planeswalker") && e.boxes === "Artifact" ? "Colourless" : e.boxes;
  return {
    background: ie(
      r ? "bg" : t === "class" ? "saga_bg" : `${a}_bg`,
      t.startsWith("planeswalker") && n === "Land" ? "Colourless" : n
    ),
    frame: ie(
      ["normal", "leveler"].includes(t) ? "frames" : `${a}_frames`,
      t === "adventure" ? "WUBRG".includes(e.frame) ? e.frame : "W" : t === "class" ? e.frame === "WU" ? "UW" : e.frame.length === 2 ? "Gold" : e.frame : t === "saga" && e.frame === "Colourless" ? "Land" : t.startsWith("planeswalker") && ["Artifact", "Land"].includes(e.frame) ? "Colourless" : e.frame
    ),
    boxes: ie(t.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", n),
    nameplate: ie("nameplates", e.boxes),
    crown: ie("legendary-crowns", e.crown),
    pt: t.startsWith("planeswalker") ? ie("planeswalker", "Loyalty") : ie("pt-boxes", e.pt)
  };
}
function ft(e) {
  const t = e.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = t === "∞" ? "INFINITY" : t === "½" ? "HALF" : t.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? ie("symbols", r) : null;
}
function js(e, t, r) {
  return Gs(e, t, r);
}
function ie(e, t) {
  const r = e === "legendary-crowns" ? "legendary_crowns" : e === "pt-boxes" ? "pt_boxes" : e === "nameplates" ? "boxes" : e, a = e === "symbols" ? "svg" : "webp";
  return `${Fe}/img/${r}/${encodeURIComponent(t)}.${a}`;
}
function ee(e, t = e.rarity) {
  const r = e.setCode?.trim().toLowerCase() ?? "";
  return e.setSymbol ?? js(
    r === "chr" ? Os(e.name) ?? "" : r,
    t,
    e.setSymbolSource
  );
}
function ve(e) {
  const t = [
    e.rulesText ?? "",
    ...(e.rulesParagraphs ?? []).flatMap((a) => a.runs.map((n) => n.text))
  ];
  return [.../* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...t.flatMap(
      (a) => gt(a).flatMap((n) => n.symbol ? [n.symbol] : [])
    )
  ])].map(ft);
}
const Ps = Me.RETRO_SYMBOL_FONT, _e = Me.RETRO_ROOT, Ws = `${_e}/fonts/goudy-medieval.ttf`, Ds = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), Fs = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function ke(e) {
  return e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") ? !1 : e.frameStyle === "retro" || e.frameStyle !== "modern" && Ds.has(e.setCode?.toLowerCase() ?? "");
}
function pt(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function ce(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return pt(e) ? "abu" : t === "leg" && _(e).length > 1 ? "legends" : ["3ed", "4ed", "5ed", "atq"].includes(t) && !/\bLand\b/.test(e.typeLine ?? "") ? "fourth" : "seventh";
}
function ia(e) {
  return ce(e) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1];
}
function qt(e) {
  const t = pt(e);
  return {
    ...z,
    frame: ia(e),
    title: [t ? 0.07 : 0.1134, 0.0481, t ? 0.8467 : 0.8, 0.043],
    art: ce(e) === "legends" ? [0.112, 0.094, 0.78, 0.45] : ce(e) === "fourth" ? [0.109, 0.093, 0.779, 0.453] : t ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429],
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: [0.8074, 0.895, 0.1367, 0.043],
    footer: [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function $e(e) {
  const t = _(e), r = e.typeLine ?? "", a = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([l]) => r.includes(l)), n = /\bLand\b/.test(r) ? a.length === 1 ? a[0][1] + "l" : "l" : /\bArtifact\b/.test(r) ? "a" : t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "c", s = ce(e), o = s === "seventh" || n === "c" || s === "abu" && n === "m" ? "seventh/regular" : `old/${s}`;
  return `${_e}/img/frames/${o}/${s === "legends" ? "legendsFrameM" : n}.png`;
}
function we(e) {
  return e.borderColor ?? (Fs.has(e.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function mr(e) {
  return we(e) === "silver" ? fe(null, "silver").border : we(e) === "white" ? Us : "#080808";
}
function da(e) {
  return ce(e) === "fourth" ? `${_e}/img/frames/old/fourth/borderBlack.png` : `${_e}/img/frames/${pt(e) ? "old/abu" : "seventh/regular"}/border.svg`;
}
function gr(e) {
  return pt(e) ? "#ababab" : "#f2eee3";
}
function _s(e) {
  return e.setCode?.toLowerCase() === "7ed" && _(e).some((t) => t === "W" || t === "G") && !/Land/.test(e.typeLine ?? "") ? "saturate(.7) brightness(.88)" : "none";
}
function Xt(e) {
  if (zt(e)) return null;
  const t = oa(e);
  return t ? `${_e}/img/frames/m15/basics/${t.toLowerCase()}.png` : null;
}
const Us = "#eeedeb";
function ca(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return !e.setSymbol && t === "ice" && e.setSymbolSource === "keyrune" ? `${Me.KEYRUNE_ROOT}/ice2.svg` : !e.setSymbol && cs(t, e.name) ? null : ee(e);
}
function Mo(e) {
  const t = (e.rulesText ?? "").length;
  return t > 340 ? 16 : t > 210 ? 19 : 23;
}
function Ns(e) {
  return [
    Xt(e),
    $e(e),
    we(e) !== "black" || ce(e) === "fourth" ? da(e) : null,
    e.illustration,
    ca(e),
    ...ve(e)
  ];
}
const de = ([e, t, r, a]) => [
  e * S,
  t * M,
  r * S,
  a * M
];
function Io(e, t) {
  return ["7ed", "8ed", "9ed"].includes(e?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(t ?? "") ? "black" : void 0;
}
const ha = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", Ys = new Set("dis plc cmd pc2 dgm mma c13".split(" "));
function Te(e) {
  return e.layout !== "split" || e.faces?.length !== 2 || Ke(e) || e.faces.some((t) => !/^(Instant|Sorcery)\b/.test(t.typeLine ?? "")) ? null : ke({ ...e, layout: "normal", frameStyle: e.frameStyle ?? e.faces[0]?.frameStyle }) ? "old" : e.frameAssetFamily === "eighth" || Ys.has(e.setCode?.toLowerCase() ?? "") ? "eighth" : "m15";
}
function Je(e) {
  const t = (r) => [
    r.rulesText ?? "",
    ...(r.rulesParagraphs ?? []).map((a) => a.runs.map((n) => n.text).join(""))
  ];
  return [e, ...e.faces ?? []].some((r) => t(r).some((a) => /^Fuse\b/m.test(a)));
}
const ua = 251 * 680 / 523, fr = 680 / 523, dt = 488 / 375, Ae = (e, t, r, a) => [
  e * fr,
  t * dt,
  r * fr,
  a * dt
];
function Ye(e, t) {
  if (e === "m15")
    return t ? { ...cr, rules: [74, 301, 255, 128] } : cr;
  const r = e === "old";
  return {
    frame: Ae(18, 18, t ? 244 : 236, 338),
    title: Ae(r ? 35 : 30, r ? 23 : 28, r ? 207 : 214, 21),
    art: r ? Ae(37, 47, 197, 130) : Ae(27, 56, 217, 152),
    type: Ae(r ? 35 : 30, r ? 182 : 211, 210, r ? 21 : 17),
    rules: r ? Ae(43, 207, 187, 109) : Ae(30, 233, 213, t ? 74 : 95),
    artistY: (r ? 332 : t ? 344 : 339) * dt,
    legalY: (r ? 347 : 354) * dt
  };
}
function zs(e) {
  const t = e.layout?.startsWith("split-old") ? "old" : e.layout?.startsWith("split-m15") ? "m15" : "eighth", r = t === "m15" ? lt : ua, a = Ye(t, e.layout?.endsWith("-fuse") ?? !1), n = (s) => [
    s[0] / r,
    s[1] / 488,
    s[2] / r,
    s[3] / 488
  ];
  return {
    ...z,
    frame: n(a.frame),
    title: n(a.title),
    art: n(a.art),
    type: n(a.type),
    rules: n(a.rules),
    footer: [0, 1, 0, 0]
  };
}
function ct(e, t, r, a) {
  if (t === "m15") return Ut(e);
  const n = _(e), s = n.length > 1 ? "m" : n[0]?.toLowerCase() ?? "c";
  return `${ha}/${t === "old" ? "magic-old-split" : r ? "magic-new-split-fuse" : "magic-new-split"}.mse-style/${s}card${r ? a + 1 : ""}.${r ? "png" : "jpg"}`;
}
function ma(e) {
  for (const t of [e, ...e.faces ?? []]) {
    const r = t.rulesParagraphs?.find(
      (n) => /^Fuse\b/.test(n.runs.map((s) => s.text).join(""))
    );
    if (r) return [r];
    const a = t.rulesText?.split(`
`).find((n) => /^Fuse\b/.test(n));
    if (a) return [{ role: "rules", runs: [{ text: a }] }];
  }
  return [];
}
const Ue = `${F}/img/frames/adventure/regular`, ga = `${Ue}/bookLeft.png`, fa = `${Ue}/pinline.svg`, pa = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style/namebox/texture/normal/c.png", bt = (e) => e.layout === "adventure" && e.faces?.length === 2;
function De(e) {
  const t = e.manaSymbols ?? [];
  return _(e).length === 2 && t.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !t.some((r) => /^[WUBRG]$/.test(r));
}
function Vt(e) {
  const t = Z(e), r = _(e);
  return t.land ? "l" : t.artifact ? "a" : r.length > 1 ? "m" : r[0]?.toLowerCase() ?? "a";
}
const Et = (e) => `${Ue}/${Vt(e)}.png`;
function ba(e) {
  const t = De(e) ? "W" : Vt(e).toUpperCase();
  return `${F}/img/frames/m15/regular/m15PT${t === "L" ? "C" : t}.png`;
}
const wa = (e) => `${F}/img/frames/m15/crowns/m15Crown${Vt(e).toUpperCase()}.png`;
function ya(e) {
  const t = e.faces?.[1];
  if (!bt(e) || !t) throw Error("Adventure needs a permanent and an inset spell.");
  const r = (a) => {
    const n = _(a);
    return [
      Et(a),
      ...n.length === 2 ? n.map((s) => `${Ue}/${s.toLowerCase()}.png`) : []
    ];
  };
  return [
    .../* @__PURE__ */ new Set([
      ...r(e),
      ...r(t),
      ga,
      ..._(e).length === 2 && !De(e) ? [fa] : [],
      ...De(e) ? [pa] : [],
      ...Z(e).legendary ? [wa(e)] : [],
      ...e.power != null && e.toughness != null ? [ba(e)] : [],
      ...["rare", "mythic"].includes(e.rarity ?? "") ? [Ne] : []
    ])
  ];
}
const Kt = {
  ...z,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.5267, 0.65, 0.3867, 0.2647],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.58, 0.74, 0.25, 0.1794]
};
function Bt([e, t, r]) {
  const a = Math.max(e, t, r), n = a - Math.min(e, t, r);
  return [((n === 0 ? 0 : a === e ? (t - r) / n : a === t ? (r - e) / n + 2 : (e - t) / n + 4) * 60 % 360 + 360) % 360, a === 0 ? 0 : n / a, a];
}
function Hs(e, t, r) {
  const a = (e % 360 + 360) % 360 / 60, n = r * t, s = n * (1 - Math.abs(a % 2 - 1)), o = r - n, l = a < 1 ? [n, s, 0] : a < 2 ? [s, n, 0] : a < 3 ? [0, n, s] : a < 4 ? [0, s, n] : a < 5 ? [s, 0, n] : [n, 0, s];
  return [l[0] + o, l[1] + o, l[2] + o];
}
function Gt(e, t) {
  const [r, a, n] = Bt(e);
  return Hs(
    r + t.hueDegrees,
    Math.min(1, a * t.saturationScale),
    Math.min(1, n * t.brightnessScale)
  );
}
const qs = {
  W: { hueDegrees: 0, saturationScale: 0.439924, brightnessScale: 1.21405 },
  U: { hueDegrees: 17.808301, saturationScale: 0.546189, brightnessScale: 1.239832 },
  B: { hueDegrees: 0, saturationScale: 0.261951, brightnessScale: 1.149978 },
  R: { hueDegrees: -7.214766, saturationScale: 0.471958, brightnessScale: 1.212936 },
  G: { hueDegrees: 0, saturationScale: 0.227323, brightnessScale: 1.290867 }
};
function Tt(e, t, r) {
  if (t.colorCalibration !== "set-hsb-v1" || !["eld", "woe"].includes(t.setCode?.toLowerCase() ?? ""))
    return;
  const a = qs[r.toUpperCase()];
  if (!a) return;
  const n = e.getContext("2d"), s = e.width, o = e.height, l = [
    Math.floor(31 * s / 488),
    Math.floor(487 * o / 680),
    Math.ceil(214 * s / 488),
    Math.ceil(142 * o / 680)
  ], i = n.getImageData(...l);
  for (let c = 0; c < i.data.length; c += 4) {
    if (!i.data[c + 3]) continue;
    const h = Gt(
      [i.data[c] / 255, i.data[c + 1] / 255, i.data[c + 2] / 255],
      a
    );
    for (let u = 0; u < 3; u++)
      i.data[c + u] = Math.round(h[u] * 255);
  }
  const d = document.createElement("canvas");
  d.width = l[2], d.height = l[3], d.getContext("2d").putImageData(i, 0, 0), n.save(), n.scale(s / 488, o / 680), n.beginPath(), n.moveTo(31.8, 488.3), n.lineTo(218, 488.3), n.bezierCurveTo(235, 488.3, 241, 490.5, 244, 496), n.lineTo(244, 627.4), n.lineTo(31.8, 627.4), n.closePath(), n.clip(), n.drawImage(
    d,
    l[0] * 488 / s,
    l[1] * 680 / o,
    l[2] * 488 / s,
    l[3] * 680 / o
  ), n.restore(), d.width = d.height = 0;
}
const je = /* @__PURE__ */ new Map(), Mt = /* @__PURE__ */ new WeakMap();
let Xs = 0, It = 0;
const Vs = (e) => (Mt.has(e) || Mt.set(e, ++Xs), Mt.get(e));
function Ks(e, t) {
  const r = e.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const a = (p) => {
    const b = t.get(p);
    if (!b) throw Error(`Adventure asset unavailable: ${p}`);
    return b;
  }, n = ya(e).map(a), s = JSON.stringify([
    e.setCode,
    e.colorCalibration,
    e.colors,
    e.frameColors,
    e.manaSymbols,
    r.colors,
    r.frameColors,
    r.manaSymbols,
    n.map(Vs)
  ]), o = je.get(s);
  if (o)
    return je.delete(s), je.set(s, o), o;
  const l = a(Et(e)), i = document.createElement("canvas");
  i.width = l.width, i.height = l.height;
  const d = i.getContext("2d"), c = i.width, h = i.height, u = () => {
    const p = document.createElement("canvas");
    return p.width = c, p.height = h, p;
  }, m = (p, b) => {
    const y = u(), w = y.getContext("2d"), v = _(p);
    if (w.drawImage(a(Et(p)), 0, 0, c, h), b && v.length === 1 && Tt(y, e, v[0]), v.length === 2) {
      "WUBRG".indexOf(v[1]) - "WUBRG".indexOf(v[0]) > 2 && v.reverse(), w.drawImage(a(`${Ue}/${v[0].toLowerCase()}.png`), 0, 0, c, h), b && Tt(y, e, v[0]);
      const C = u(), R = C.getContext("2d");
      R.drawImage(a(`${Ue}/${v[1].toLowerCase()}.png`), 0, 0, c, h), b && Tt(C, e, v[1]), R.globalCompositeOperation = "destination-in";
      const x = R.createLinearGradient(
        c * (b ? 0.22 : 0.43),
        0,
        c * (b ? 0.36 : 0.57),
        0
      );
      x.addColorStop(0, "#0000"), x.addColorStop(1, "#000"), R.fillStyle = x, R.fillRect(0, 0, c, h), w.drawImage(C, 0, 0), C.width = C.height = 0;
    }
    return y;
  };
  if (d.drawImage(l, 0, 0), _(e).length === 2) {
    const p = m(e, !1), b = p.getContext("2d");
    De(e) || (b.globalCompositeOperation = "destination-in", b.drawImage(a(fa), 0, 0, c, h)), d.drawImage(p, 0, 0), p.width = p.height = 0;
  }
  const g = m(r, !0), f = g.getContext("2d");
  if (f.globalCompositeOperation = "destination-in", f.drawImage(a(ga), 0, 0, c, h), d.save(), De(r) && (d.filter = "grayscale(1)"), d.drawImage(g, 0, 0), d.restore(), g.width = g.height = 0, De(e)) {
    d.save(), d.scale(c / 488, h / 680), d.beginPath();
    for (const [p, b] of [
      [34, 34],
      [388, 28]
    ])
      d.moveTo(38, p), d.lineTo(450, p), d.quadraticCurveTo(461, p + b / 2, 450, p + b), d.lineTo(38, p + b), d.quadraticCurveTo(29, p + b / 2, 38, p), d.closePath();
    d.clip();
    for (const [p, b] of [
      [34, 34],
      [388, 28]
    ])
      d.drawImage(a(pa), 22, 7, 196, 19, 29, p, 432, b);
    d.restore();
  }
  const k = c * h * 4;
  for (const [p, b] of je) {
    if (It + k <= 16 * 1024 * 1024) break;
    It -= b.width * b.height * 4, je.delete(p), b.width = b.height = 0;
  }
  return k <= 16 * 1024 * 1024 && (je.set(s, i), It += k), i;
}
const Ot = (e, t = !1) => `${t ? "italic " : ""}${e}px "CardRenderer MTG MPlantin", Georgia`;
function Js(e) {
  const t = [];
  let r = [], a = !1;
  const n = () => {
    r.length && (t.push({ pieces: r, space: a }), r = [], a = !1);
  };
  for (const s of e)
    for (const o of gt(s.text))
      if (o.symbol) r.push({ text: o.symbol, symbol: !0, italic: !1 });
      else
        for (const l of o.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(l) ? (n(), l === `
` ? (t.push({ pieces: [], space: !1, newline: !0 }), a = !1) : a = !0) : r.push({ text: l, symbol: !1, italic: !!s.italic });
  return n(), t;
}
function qe(e, t, r) {
  const a = [];
  for (const n of t) {
    const s = a.at(-1);
    s && !s.symbol && !n.symbol && s.italic === n.italic ? s.text += n.text : a.push({ ...n });
  }
  return a.map((n) => {
    e.font = Ot(r, n.italic);
    const s = e.measureText(n.text);
    return {
      ...n,
      size: r,
      width: n.symbol ? r * 0.88 : s.width,
      ascent: n.symbol ? r * 0.72 : s.actualBoundingBoxAscent,
      descent: n.symbol ? r * 0.08 : s.actualBoundingBoxDescent,
      inkLeft: n.symbol ? r * 0.025 : -s.actualBoundingBoxLeft,
      inkRight: n.symbol ? r * 0.825 : s.actualBoundingBoxRight
    };
  });
}
function ka(e, t, r, a) {
  const n = [];
  let s = [];
  for (const o of t) {
    if (o.newline) {
      n.push(qe(e, s, a)), s = [];
      continue;
    }
    const l = s.length && o.space ? [{ text: " ", italic: o.pieces[0]?.italic ?? !1, symbol: !1 }] : [], i = qe(e, [...s, ...l, ...o.pieces], a);
    s.length && i.reduce((d, c) => d + c.width, 0) > r ? (n.push(qe(e, s, a)), s = [...o.pieces]) : s.push(...l, ...o.pieces);
  }
  return s.length && n.push(qe(e, s, a)), n;
}
function pr(e, t, r, a) {
  const n = ka(e, t, r, a);
  if (n.length < 2) return n;
  const s = /* @__PURE__ */ new Map(), o = (h, u) => {
    const m = `${h}:${u}`;
    let g = s.get(m);
    if (!g) {
      const f = [];
      for (let k = h; k < u; k++) {
        const p = t[k];
        k > h && p.space && f.push({ text: " ", italic: p.pieces[0]?.italic ?? !1, symbol: !1 }), f.push(...p.pieces);
      }
      g = qe(e, f, a), s.set(m, g);
    }
    return g;
  }, l = /* @__PURE__ */ new Map(), i = (h, u) => {
    if (!u) return h === t.length ? { cost: 0, cuts: [] } : null;
    const m = `${h}:${u}`;
    if (l.has(m)) return l.get(m);
    let g = null;
    for (let f = h + 1; f <= t.length - u + 1; f++) {
      const k = o(h, f).reduce((y, w) => y + w.width, 0);
      if (k > r) break;
      const p = i(f, u - 1);
      if (!p) continue;
      const b = p.cost + (r - k) ** 2;
      (!g || b < g.cost) && (g = { cost: b, cuts: [f, ...p.cuts] });
    }
    return l.set(m, g), g;
  }, d = i(0, n.length);
  if (!d) return n;
  let c = 0;
  return d.cuts.map((h) => {
    const u = o(c, h);
    return c = h, u;
  });
}
function br(e, t, r, a, n = !1) {
  const s = Js(t);
  if (!n || s.length > 64) return ka(e, s, r, a);
  const o = [];
  let l = [];
  for (const i of s)
    i.newline ? (o.push(...l.length ? pr(e, l, r, a) : [[]]), l = []) : l.push(i);
  return l.length && o.push(...pr(e, l, r, a)), o;
}
const ht = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function q(e, t, r, a = 24, n = 15, s = ht) {
  e.save(), e.letterSpacing = "0px", e.textBaseline = "alphabetic", e.textAlign = "left";
  try {
    let o, l = a;
    do {
      const i = [], d = [];
      let c = 0, h;
      for (const w of t) {
        let v = l, C = br(
          e,
          w.runs,
          r.width,
          v,
          s.balanceLines
        );
        if (w.role === "flavor" && s.flavorOrphans !== !1 && C.length > 2 && C.at(-1).reduce((R, x) => R + x.width, 0) < r.width * 0.3)
          for (let R = v - 0.25; R >= v * 0.94; R -= 0.25) {
            const x = br(
              e,
              w.runs,
              r.width,
              R,
              s.balanceLines
            );
            if (x.length < C.length) {
              v = R, C = x;
              break;
            }
          }
        if (C.length) {
          h && (h === "rules" && w.role === "flavor" ? c += l * s.flavorGap : (h !== "flavor" || w.role !== "flavor") && (c += l * s.paragraphGap));
          for (const R of C) {
            const x = Math.max(0, ...R.map((B) => B.ascent)), T = Math.max(0, ...R.map((B) => B.descent)), I = R.reduce((B, V) => B + V.width, 0), L = r.x + (w.align === "right" ? r.width - I : w.align === "center" ? (r.width - I) / 2 : 0);
            let P = 0, A = 1 / 0, O = -1 / 0;
            for (const B of R)
              A = Math.min(A, P + B.inkLeft), O = Math.max(O, P + B.inkRight), P += B.width;
            i.push({
              x: L,
              runs: R,
              role: w.role,
              baseline: c,
              width: I,
              inkBounds: [
                L + (R.length ? A : 0),
                c - x,
                R.length ? O - A : 0,
                x + T
              ]
            }), c += v * s.leading;
          }
          h = w.role;
        }
      }
      if (s.flavorSeparator !== !1)
        for (let w = 1; w < i.length; w++) {
          const v = i[w - 1], C = i[w];
          if (v.role !== "rules" || C.role !== "flavor") continue;
          const R = v.inkBounds[1] + v.inkBounds[3];
          d.push((R + C.inkBounds[1]) / 2 - 0.3);
        }
      const u = i[0]?.inkBounds[1] ?? 0, m = i.at(-1)?.inkBounds, g = m ? m[1] + m[3] - u : 0, f = Math.max(0, r.height - g), k = r.y + Math.max(0, Math.min(f, f / 2 + (s.centerOffset ?? 0))), p = Math.max(r.y, r.verticalLimits?.[0] ?? r.y), b = Math.min(
        r.y + r.height,
        r.verticalLimits?.[1] ?? r.y + r.height
      ), y = Math.max(p, Math.min(b - g, k)) - u;
      if (o = {
        size: l,
        x: r.x,
        top: u + y,
        width: r.width,
        height: g,
        overflow: g > b - p + 0.01 || i.some((w) => w.width > r.width + 0.01),
        lines: i.map((w) => ({
          ...w,
          baseline: w.baseline + y,
          inkBounds: [
            w.inkBounds[0],
            w.inkBounds[1] + y,
            w.inkBounds[2],
            w.inkBounds[3]
          ]
        })),
        separators: d.map((w) => w + y)
      }, o.overflow ||= o.lines.some(
        (w) => r.exclusions?.some(([v, C, R, x]) => {
          const [T, I, L, P] = w.inkBounds;
          return T < v + R && T + L > v && I < C + x && I + P > C;
        })
      ), !o.overflow || l <= n) break;
      l = Math.max(n, l - 0.25);
    } while (!0);
    return o;
  } finally {
    e.restore();
  }
}
function Ze(e) {
  return e.rulesParagraphs ?? e.rulesText.split(`
`).filter(Boolean).map((t) => ({ role: "rules", runs: [{ text: t }] }));
}
function xo(e, t, r = "oracle", a = {}) {
  const n = t[r];
  if (!n) throw Error(`Missing ${r} printing wording`);
  if (typeof n.typeLine != "string" || typeof n.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const s = a.rulesAlignment ?? r, o = s === "left" ? void 0 : t[s];
  if (s !== "left" && !o) throw Error(`Missing ${s} alignment wording`);
  const l = Z({ ...e, typeLine: t.oracle.typeLine });
  return {
    ...e,
    ...n,
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: n.rulesParagraphs,
    rulesAlignment: o ? { mode: "auto", reference: Ze(o) } : { mode: "left" },
    artifact: e.artifact ?? l.artifact,
    land: e.land ?? l.land,
    creature: e.creature ?? l.creature,
    legendary: e.legendary ?? l.legendary,
    wordingMode: r,
    symbolStyle: a.symbolStyle ?? (r === "oracle" ? "modern" : "original")
  };
}
function Qe(e, t, r, a, n, s, o, l, i = 1 / 0) {
  const d = (m) => (m.align === void 0 || m.align === "center") && m.runs.length > 0 && m.runs.every((g) => !g.text.includes(`
`));
  if (!r.length || !r.every(d) || !t.every(d)) return null;
  const c = r.map((m) => m.runs.map((g) => g.text).join("")).join(`
`);
  if (Array.from(c.replace(/\{[^}]+\}/g, "●")).length > i) return null;
  const h = (m) => m.map((g) => ({ ...g, align: "center" })), u = q(e, h(r), a, n, n, l);
  return u.overflow || u.lines.length > o ? null : q(e, h(t), a, n, s, l);
}
function Zs(e, t) {
  const r = t.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const a = (u) => {
    const m = Ze({
      rulesText: u.rulesText ?? "",
      rulesParagraphs: u.rulesParagraphs
    });
    return u.rulesAlignment?.mode === "left" ? m.map((g) => ({ ...g, align: "left" })) : m;
  }, n = { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: !0 }, s = a(t), o = {
    x: 261,
    y: 438,
    width: 189,
    height: 178,
    exclusions: t.power != null && t.toughness != null ? [[368, 601, 94, 51]] : []
  }, l = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? s : s, i = t.rulesAlignment?.mode !== "left" && l.length === 1 && l[0].role === "rules" ? Qe(e, s, l, o, 22.5, 9, 1, n) : null, d = a(r), c = { x: 41.7, y: 499, width: 191, height: 122 }, h = q(e, d, c, 20.25, 20.25, n);
  return {
    permanent: i || q(e, s, o, 22.5, 9, n),
    spell: !h.overflow && h.lines.length <= 4 ? h : q(e, d, c, 22.5, 9, n)
  };
}
const Qs = [
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
], Re = 0.91339 * S / 768, jt = 0.04724 * S, Pt = 0.02655 * M;
function en(e) {
  return [
    (jt + 20 * Re) / S,
    (Pt + 84 * Re) / M,
    728 * Re / S,
    ((e ? 541 : 622) - 84) * Re / M
  ];
}
function tn(e, t) {
  const r = Qs[t ? 1 : 0];
  e.beginPath(), r.forEach(([a, n], s) => {
    const o = jt + (n - 1) * Re, l = Pt + a * Re;
    s === 0 ? e.moveTo(o, l) : e.lineTo(o, l);
  });
  for (let a = r.length - 1; a >= 0; a--) {
    const [n, s] = r[a];
    e.lineTo(jt + (769 - s) * Re, Pt + n * Re);
  }
  e.closePath(), e.clip();
}
const rn = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", wr = {
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
}, Ve = {
  artInset: 4.5,
  artRim: 1.5,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function an(e) {
  if (!e.frameAssetFamily && !Z(e).legendary && (e.layout ?? "normal") === "normal" && Fe === rn) {
    const t = e.borderColor ?? (fe(e.setCode).border === "#eeedeb" ? "white" : "black"), r = `${e.setCode?.toLowerCase() ?? ""}/${t}`;
    if (Object.hasOwn(wr, r)) return wr[r];
  }
  return ["m15", "m19", "m20", "war"].includes(e.setCode?.toLowerCase() ?? "") ? Ve.frameInset : 0;
}
function Sa(e) {
  return ["B", "Colourless", "Land"].includes(Z(e).boxes);
}
function va(e) {
  return e.frameAssetFamily !== "eighth" || !e.artist ? null : `${F}/img/manaSymbols/${Sa(e) ? "whitebrush" : "brush"}.svg`;
}
function sn(e, t) {
  if (!t.includes("*")) {
    e.fillText(t, 407, 627, 78);
    return;
  }
  const r = t.split(/(\*)/).filter(Boolean), a = r.map((o) => o === "*" ? 15 : e.measureText(o).width), n = a.reduce((o, l) => o + l, 0);
  e.save(), e.translate(407, 0), e.scale(Math.min(1, 78 / n), 1), e.textAlign = "left";
  let s = -n / 2;
  for (const [o, l] of r.entries()) {
    if (l === "*") {
      e.beginPath();
      for (let i = 0; i < 10; i++) {
        const d = -Math.PI / 2 + i * Math.PI / 5, c = i % 2 ? 3.1 : 7.5, h = s + 7.5 + c * Math.cos(d), u = 622 + c * Math.sin(d);
        i === 0 ? e.moveTo(h, u) : e.lineTo(h, u);
      }
      e.closePath(), e.fill();
    } else e.fillText(l, s, 627);
    s += a[o];
  }
  e.restore();
}
function nn(e, t, r) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.letterSpacing = "0px", t.power != null && t.toughness != null && (e.fillStyle = "#17140f", e.font = '700 29px "CardRenderer MTG Matrix Small Caps", Georgia', e.textAlign = "center", e.textBaseline = "middle", sn(e, `${t.power}/${t.toughness}`));
  const a = t.setCode?.toLowerCase(), n = a === "8ed" ? 75 : a === "9ed" ? 79 : 77, s = a === "8ed" || a === "9ed", o = s ? 633 : 634;
  e.fillStyle = Sa(t) ? "#fff" : "#17140f", e.textBaseline = "alphabetic", e.textAlign = "left";
  const l = va(t);
  if (l) {
    const i = r.get(l);
    if (!i) throw Error(`Eighth Edition artist brush unavailable: ${l}`);
    e.drawImage(i, 36.5, o - 10, n - 39, 13.5), e.font = `700 ${s ? 17.5 : 18}px "CardRenderer MTG Matrix", Georgia`;
    const d = t.power != null && t.toughness != null ? 350 : 448;
    e.fillText(t.artist, n, o, d - n);
  }
  t.legalText && (e.font = '9px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 36.5, o + 13, 395)), e.restore();
}
function Jt(e) {
  if (!e.frameAssetFamily) return null;
  if (ke(e) || e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
    throw Error("Replacement frame plates currently support ordinary modern faces only.");
  const t = e.frameAssetFamily === "eighth", r = Z(e), a = _(e), n = a.length === 2 && "WUBRG".indexOf(a[1]) - "WUBRG".indexOf(a[0]) > 2 ? [...a].reverse() : a, o = `${F}/img/frames/${t ? "8th" : "m15/new"}`, l = r.land ? "l" : r.artifact ? "a" : /\bVehicle\b/.test(e.typeLine ?? "") ? "v" : a.length > 1 ? "m" : a[0]?.toLowerCase() ?? "c", i = (g) => t ? `${g.toLowerCase()}l` : `l${g.toLowerCase()}`, d = r.land && n.length ? i(n.length > 2 ? "m" : n[0]) : l, c = r.land && n.length === 2 ? i(n[1]) : void 0, h = l === "l" ? t ? "l" : "c" : l, u = t ? [0.09, 0.0629, 0.824, 0.0429] : [168 / 2010, 145 / 2814, 0.8292, 0.0543], m = t ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358] : [168 / 2010, 1588 / 2814, 0.8292, 0.0543];
  return {
    frame: `${o}/${d}.png`,
    rightFrame: c ? `${o}/${c}.png` : void 0,
    border: `${o}/border.png`,
    pt: t ? `${F}/img/frames/8th/pt/${h === "c" ? "l" : h}.png` : `${F}/img/frames/m15/regular/m15PT${h.toUpperCase()}.png`,
    rects: {
      ...z,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title: u,
      type: m,
      art: t ? [180 / 2010, 341 / 2814, 1656 / 2010, 1216 / 2814] : [0.0767, 0.1129, 0.8476, 0.4429],
      rules: t ? [205 / 2010, 1779 / 2814, 1596 / 2010, 729 / 2814] : [0.086, 1780 / 2814, 0.828, 0.2875],
      stats: t ? [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814] : [0.7573, 0.8848, 0.188, 0.0733],
      footer: t ? [150 / 2010, 1938 / 2100, 0.81, 0.04] : z.footer
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
function on(e) {
  const t = Jt(e);
  if (!t) return null;
  const r = va(e);
  return [
    ...r ? [r] : [],
    t.frame,
    ...t.rightFrame ? [t.rightFrame] : [],
    ...e.power != null && e.toughness != null ? [t.pt] : [],
    ...fe(e.setCode, e.borderColor).border !== "#090806" ? [t.border] : []
  ];
}
function et(e) {
  const t = e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "");
  return (t ? (e.rulesText ?? "").replace(/\|(?=\s*[IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*\s*[—–-]\s)/g, `
`) : e.rulesText ?? "").split(`
`).filter((a) => a.trim()).map((a) => {
    const n = t ? a.match(/^\s*([IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*)\s*[—–-]\s*(.+)$/) : null;
    if (n)
      return { text: n[2], badges: n[1].split(/\s*,\s*/), reminder: !1 };
    const s = t ? null : a.match(/^\s*\[?([+−-]?(?:\d+|X))\]?\s*:\s*(.*)$/i);
    return s ? {
      text: s[2],
      badges: [s[1].replace("-", "−").toUpperCase()],
      reminder: !1
    } : { text: a, badges: [], reminder: t && /^\s*\(/.test(a) };
  });
}
function J(e) {
  return e.layout === "ability" ? "normal" : e.layout === "adventure" && e.faces?.length === 2 ? "adventure" : e.layout === "class" || /\bClass\b/i.test(e.typeLine ?? "") ? "class" : e.layout === "leveler" || /^Level up\b/m.test(e.rulesText ?? "") ? "leveler" : e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "") ? "saga" : e.layout === "planeswalker" || /\bPlaneswalker\b/i.test(e.typeLine ?? "") ? et(e).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function ue(e) {
  if (e.layout === "aftermath-top" || e.layout === "aftermath-bottom")
    return Is(e.layout === "aftermath-bottom");
  if (/^split-(old|eighth|m15)(-fuse)?$/.test(e.layout ?? "")) return zs(e);
  const t = Jt(e);
  if (t) return t.rects;
  if (ke(e)) return qt(e);
  const r = J(e);
  if (r === "adventure") return Kt;
  if (r === "class")
    return {
      ...z,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (r === "saga") return ea;
  if (r.startsWith("planeswalker")) {
    const a = r === "planeswalker-large", n = [
      0.04409,
      a ? 0.55118 : 0.62655,
      0.88827,
      a ? 0.37534 : 0.29997
    ], s = z.stamp[2], o = z.stamp[3];
    return {
      ...z,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, 0.92126 * S * 3793 / 2778 / M],
      frame: [0.04724, 0.02655, 0.91339, 0.91339 * S * 3810 / 2736 / M],
      art: en(a),
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / S,
        (a ? 0.49044 : 0.55793) + 5 / M,
        0.88662,
        0.05737
      ],
      rules: n,
      stats: [0.792 + 1 / S, 0.881 - 3 / M, 0.16, 0.069],
      stamp: [
        n[0] + (n[2] - s) / 2,
        n[1] + (n[3] - o) / 2,
        s,
        o
      ]
    };
  }
  return e.layout === "split-half" ? {
    ...z,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : {
    ...z,
    art: [
      z.art[0] + Ve.artInset / S,
      z.art[1],
      z.art[2] - 2 * Ve.artInset / S,
      z.art[3]
    ]
  };
}
function ln(e) {
  const t = J(e) === "saga", r = ue(e).rules, a = et(e), n = r[2] * 488 - (t ? 32 : 70), s = r[3] * 680;
  let o = t ? 21 : 19;
  const l = (k, p) => Math.max(1, Math.ceil(k.length * p * 0.49 / n)), i = (k, p) => Math.max(t ? k.badges.length * 36 : 34, l(k.text, p) * p + 16), d = (k) => a.reduce((p, b) => p + i(b, k), 0);
  for (; o > 8 && d(o) > s; ) o -= 0.5;
  const c = a.map((k) => i(k, o)), h = Math.max(0, s - d(o)) / Math.max(1, a.length);
  let u = s / Math.max(1, a.length), m = s, g = a.length;
  if (!t)
    for (const k of [...c].sort((p, b) => b - p)) {
      if (k <= u) break;
      m -= k, u = m / Math.max(1, --g);
    }
  let f = 0;
  return a.map((k, p) => {
    const b = t ? c[p] + h : Math.max(u, c[p]), y = { ...k, top: f, height: b, font: o, left: t ? 27 : 62, width: n };
    return f += b, y;
  });
}
function ut(e, t, [r, a, n, s]) {
  if (!(e > 0 && t > 0)) return [r, a, n, s];
  const o = Math.max(n / e, s / t), l = e * o, i = t * o;
  return [r + (n - l) / 2, a + (s - i) / 2, l, i];
}
function dn(e, t, r, a) {
  const n = [a[0] * e, a[1] * t, a[2] * e, a[3] * t];
  return [...n, ...ut(n[2], n[3], r)];
}
function ye(e, t, r, a, n) {
  const [s, o, l, i] = a, d = J(t);
  if (e.save(), d.startsWith("planeswalker") && tn(e, d === "planeswalker-large"), n === "printing") {
    e.clearRect(s, o, l, i), e.restore();
    return;
  }
  (n === "artwork" || d.startsWith("planeswalker")) && (e.fillStyle = "#80745c", e.fillRect(s, o, l, i));
  const c = r.get(t.illustration ?? "");
  if (!c) {
    e.restore();
    return;
  }
  e.beginPath(), e.rect(s, o, l, i), e.clip(), t.illustrationCrop ? e.drawImage(
    c,
    ...dn(c.width, c.height, a, t.illustrationCrop)
  ) : e.drawImage(c, ...ut(c.width, c.height, a)), e.restore();
}
const cn = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, hn = "#9aa4ae", un = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
function Zt(e, t, r, a) {
  const n = [];
  for (const s of t.split(`
`)) {
    let o = [], l = 0;
    const i = gt(s).flatMap(
      (d) => d.symbol ? [{ text: d.symbol, symbol: !0 }] : (d.value.match(/\s+|\S+/g) ?? []).map((c) => ({ text: c, symbol: !1 }))
    );
    for (const d of i) {
      const c = !d.symbol && e.measureText(d.text).width > r ? [...d.text].map((h) => ({ text: h, symbol: !1 })) : [d];
      for (const h of c) {
        const u = h.symbol ? a * 0.94 : e.measureText(h.text).width;
        l + u > r && o.length && (n.push(o), o = [], l = 0), !(!o.length && /^\s+$/.test(h.text)) && (o.push({ ...h, width: u }), l += u);
      }
    }
    n.push(o);
  }
  return n;
}
function X(e, t, r, a, n, s, o = !1) {
  const l = s.get(ft(t) ?? "");
  if (e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, o) {
    const i = e.getTransform();
    e.shadowColor = "#000d", e.shadowOffsetX = 1.5372 * (-i.a + i.c), e.shadowOffsetY = 1.5372 * (-i.b + i.d);
  }
  if (e.fillStyle = s.manaColors?.[t] ?? cn[t] ?? hn, e.beginPath(), e.arc(r + n / 2, a + n / 2, n / 2, 0, Math.PI * 2), e.fill(), e.shadowColor = "transparent", l) {
    e.drawImage(l, r, a, n, n), e.restore();
    return;
  }
  e.fillStyle = t === "B" ? "white" : "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = `bold ${n * 0.62}px Georgia`, e.fillText(t, r + n / 2, a + n / 2, n * 0.9), e.restore();
}
function Ca(e, t, r, a, n, s, o) {
  const l = typeof s == "number" ? s : s.size;
  e.font = `${typeof s != "number" && s.italic ? "italic " : ""}${l}px "CardRenderer MTG MPlantin", Georgia`;
  const i = t.split(`
`).map((d) => Zt(e, d, n, l));
  e.textBaseline = "top";
  for (const d of i) {
    for (const c of d) {
      let h = r;
      for (const u of c)
        u.symbol ? X(e, u.text, h + l * 0.07, a + l * 0.03, l * 0.8, o) : e.fillText(u.text, h, a), h += u.width;
      a += l;
    }
    a += j.paragraphGap;
  }
}
function Ao(e, t, r) {
  if (e.measureText(t).width <= r) return t;
  const a = [...t];
  for (; a.length && e.measureText(`${a.join("")}…`).width > r; ) a.pop();
  return a.length || e.measureText("…").width <= r ? `${a.join("")}…` : "";
}
function te(e, t, r, a, n, s, o = !1, l = 1, i = "CardRenderer MTG Beleren") {
  if (!(n > 0)) throw Error("Magic title/type plate has no text space.");
  e.save(), e.font = `${o ? "bold " : ""}${s}px "${i}", Georgia`;
  const d = e.measureText(t).width;
  l > 1 && d * l > n && (l = 1), l !== 1 && (e.translate(r, 0), e.scale(l, 1), r = 0, n /= l), d > n && (s = Math.max(s * 0.78, s * n / d), e.font = `${o ? "bold " : ""}${s}px "${i}", Georgia`), e.fillText(t, r, a, n), e.restore();
}
function Ie(e, t, r, a, n, s, o, l, i = [0, 0, 1, 1]) {
  const d = [
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height
  ], c = {
    uncommon: "#aaaeb2",
    rare: "#bc923f",
    mythic: "#c65c2d",
    special: "#8664af",
    bonus: "#bc923f"
  }[a ?? "common"];
  if (!c || ["forge", "glint"].includes(r?.toLowerCase() ?? "")) {
    e.drawImage(t, ...d, n, s, o, l);
    return;
  }
  const h = document.createElement("canvas");
  h.width = Math.max(1, Math.ceil(o * 2)), h.height = Math.max(1, Math.ceil(l * 2));
  const u = h.getContext("2d");
  u.drawImage(t, ...d, 0, 0, h.width, h.height), u.globalCompositeOperation = "source-in", u.fillStyle = c, u.fillRect(0, 0, h.width, h.height), e.drawImage(h, n, s, o, l), h.width = h.height = 0;
}
const mn = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function gn(e) {
  return !mn.has(e?.trim().toLowerCase() ?? "");
}
function Ra(e, t, r = M, a = 1) {
  const n = ue(t), s = {
    ...ht,
    flavorSeparator: t.frameAssetFamily === "eighth" ? !1 : gn(t.setCode)
  }, [o, l, i, d] = n.rules, c = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((m) => ({ role: "rules", runs: [{ text: m }] })), h = {
    x: o * S + (t.frameAssetFamily ? 0 : 3.5),
    y: l * r + (t.frameAssetFamily ? 0 : 7),
    width: i * S - (t.frameAssetFamily ? 0 : 9.5),
    height: d * r - (t.frameAssetFamily ? 0 : 8),
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
  }, u = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? c : c;
  if (t.rulesAlignment?.mode !== "left" && ["10e", "m10", "m11", "m12", "m13", "m14"].includes(t.setCode?.toLowerCase() ?? "") && u.every((m) => m.role === "rules")) {
    const m = Qe(
      e,
      c,
      u,
      h,
      24.5 * a,
      15 * a,
      3,
      { ...s, balanceLines: !0 }
    );
    if (m) return m;
  }
  return q(
    e,
    t.rulesAlignment?.mode === "left" ? c.map((m) => ({ ...m, align: "left" })) : c,
    h,
    24.5 * a,
    15 * a,
    s
  );
}
function ge(e, t, r, a = X, n = 0) {
  if (t.overflow) throw Error("Magic rules text does not fit the available area.");
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", e.letterSpacing = "0px";
  for (const l of t.separators) {
    const i = e.createLinearGradient(t.x, l, t.x + t.width, l);
    i.addColorStop(0, "#17140f00"), i.addColorStop(0.15, "#17140f55"), i.addColorStop(0.85, "#17140f55"), i.addColorStop(1, "#17140f00"), e.fillStyle = i, e.fillRect(t.x, l, t.width, 0.6);
  }
  e.fillStyle = "#17140f";
  const s = n > 0 ? document.createElement("canvas") : null;
  s && (s.width = e.canvas.width, s.height = e.canvas.height);
  const o = s ? s.getContext("2d") : e;
  if (!o) throw Error("Missing rules text context");
  s && (o.setTransform(e.getTransform()), o.textAlign = "left", o.textBaseline = "alphabetic", o.letterSpacing = "0px", o.fillStyle = "#17140f");
  for (const l of t.lines) {
    let i = l.x ?? t.x;
    for (const d of l.runs)
      d.symbol ? a(
        e,
        d.text,
        i + d.size * 0.025,
        l.baseline - d.size * 0.72,
        d.size * 0.8,
        r
      ) : (o.font = Ot(d.size, d.italic), o.fillText(d.text, i, l.baseline)), i += d.width;
  }
  if (s) {
    o.globalCompositeOperation = "destination-out", o.lineJoin = "round";
    for (const l of t.lines) {
      let i = l.x ?? t.x;
      for (const d of l.runs)
        d.symbol || (o.font = Ot(d.size, d.italic), o.lineWidth = d.size * n * 2, o.strokeText(d.text, i, l.baseline)), i += d.width;
    }
    e.resetTransform(), e.drawImage(s, 0, 0), s.width = s.height = 0;
  }
  e.restore();
}
function fn(e) {
  const t = (e.rarity ?? "common")[0].toUpperCase(), r = e.collectorNumber ?? "";
  if ((e.collectorFormat ?? (e.setCode?.toLowerCase() === "woe" ? "rarity-first" : "number-first")) === "number-first") return `${r} ${t}`.trim();
  const n = r.split("/")[0].replace(/^(\d+)/, (s) => s.padStart(4, "0"));
  return `${t} ${n}`.trim();
}
function pn(e, t, r) {
  if (t.power != null && t.toughness != null) {
    const n = r.get(ba(t));
    if (!n) throw Error("Adventure power/toughness plate is unavailable.");
    const [s, o, l, i] = Kt.stats;
    e.drawImage(n, s * 488, o * 680, l * 488, i * 680), e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = '700 25px "CardRenderer MTG Beleren Small Caps", Georgia', e.fillText(`${t.power}/${t.toughness}`, 420, 627, 77);
  }
  if (["rare", "mythic"].includes(t.rarity ?? "")) {
    const n = r.get(Ne);
    if (!n) throw Error("Adventure authenticity stamp is unavailable.");
    e.drawImage(n, 213.7, 620.2, 60.5, 25.3);
  }
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(fn(t), 32, 645), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.artist && (e.font = '11px "CardRenderer MTG Artist Credit", serif', e.fillText("a", 93, 658), e.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', e.fillText(t.artist, 108, 658, 210)), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 658, 182));
}
let yr = null;
function bn() {
  return yr ??= document.fonts.load('700 25px "CardRenderer MTG Beleren Small Caps"').then((e) => {
    if (!e.length || e.some((t) => t.status !== "loaded"))
      throw Error("Adventure footer lettering needs card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw yr = null, e;
  });
}
function wn(e, t, r) {
  if (e.drawImage(Ks(t, r), 0, 0, 488, 680), Z(t).legendary) {
    const a = r.get(wa(t));
    if (!a) throw Error("Adventure crown is unavailable.");
    e.fillStyle = "#000", e.fillRect(19.2, 18.8, 449.6, 12.1), e.drawImage(a, 13.4, 13, 461.4, 113.4);
  }
}
function yn(e, t, r) {
  const a = t.manaSymbols ?? [], n = 23.4, s = 1.8, o = 452, l = a.length * n + Math.max(0, a.length - 1) * s;
  e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle", te(
    e,
    t.name,
    41.7,
    51,
    (a.length ? o - l - 8 : 449) - 41.7,
    26,
    !0
  ), a.forEach(
    (f, k) => X(e, f, o - l + k * (n + s), 38.7, n, r, !0)
  );
  const i = ee(t), d = r.get(i ?? ""), c = Ee(t), h = d ? Math.min(58.56 / (d.width * c[2]), 27.9 / (d.height * c[3])) : 0, u = d ? d.width * c[2] * h : 0, m = d ? d.height * c[3] * h : 0, g = [450.3 - u, 402 - m / 2, u, m];
  te(
    e,
    t.typeLine ?? "",
    41.7,
    401.5,
    (d ? g[0] - 7 : 449) - 41.7,
    22,
    !0
  ), d && (pe(i) || t.setSymbol ? e.drawImage(d, ...g) : Ie(e, d, t.setCode, t.rarity, ...g, c));
}
function kn(e, t, r) {
  const a = t.manaSymbols ?? [], n = 19.8, s = 1.2, o = 233, l = a.length * n + Math.max(0, a.length - 1) * s;
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "middle", te(
    e,
    t.name,
    40,
    443,
    (a.length ? o - l - 4 : o) - 40,
    20.1,
    !0
  ), a.forEach(
    (i, d) => X(e, i, o - l + d * (n + s), 432, n, r, !0)
  ), te(e, t.typeLine ?? "", 40, 473.5, 193, 20.1, !0);
}
function Sn(e, t, r, a, n) {
  const s = t.faces?.[1];
  if (!s) throw Error("Adventure spell is missing.");
  e.save(), e.fillStyle = "#000", e.fillRect(0, 0, 488, 680), a && e.drawImage(a, 0, 0, 488, 680), n !== "artwork" && wn(e, t, r);
  const [o, l, i, d] = Kt.art;
  if (ye(e, t, r, [o * 488, l * 680, i * 488, d * 680], n), n !== "artwork") {
    yn(e, t, r), kn(e, s, r);
    const c = Zs(e, t);
    ge(e, c.permanent, r), ge(e, c.spell, r), pn(e, t, r);
  }
  e.restore();
}
function he(e) {
  if (!["split", "aftermath"].includes(e.layout ?? "") || e.faces?.length !== 2) return [];
  const t = Ke(e), r = Te(e), a = r === "m15" ? lt : ua;
  return e.faces.map((n, s) => {
    const o = t ? 0.615 : 0.5, l = {
      setCode: e.setCode,
      frameStyle: e.frameStyle,
      rarity: e.rarity,
      artist: e.artist,
      setSymbol: e.setSymbol,
      setSymbolSource: e.setSymbolSource,
      ...n,
      layout: t ? s === 0 ? "aftermath-top" : "aftermath-bottom" : r ? `split-${r}${Je(e) && r !== "old" ? "-fuse" : ""}` : "split-half",
      frameAssetFamily: void 0,
      faces: void 0,
      rulesText: n.rulesText?.split(`
`).filter((i) => !/^Fuse\b/.test(i)).join(`
`),
      rulesParagraphs: n.rulesParagraphs?.filter(
        (i) => !/^Fuse\b/.test(i.runs.map((d) => d.text).join(""))
      ),
      illustration: n.illustration ?? e.illustration,
      etchedIllustration: n.etchedIllustration ?? (n.illustration ? void 0 : e.etchedIllustration),
      illustrationCrop: n.illustrationCrop ?? (!n.illustration && e.illustration ? [s ? o : 0, 0, s ? 1 - o : o, 1] : void 0)
    };
    return t ? s === 0 ? { face: l, x: 0, y: 0, width: 488, height: Le, rotation: 0 } : {
      face: l,
      x: 488,
      y: Le,
      width: aa,
      height: 488,
      rotation: 90
    } : r ? {
      face: l,
      x: 0,
      y: 680 - s * a,
      width: a,
      height: 488,
      rotation: -90
    } : {
      face: l,
      x: 5,
      y: (s ? 333 : 648) - (Qt(e) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function Lo(e) {
  return {
    left: `${e.x / S * 100}%`,
    top: `${e.y / M * 100}%`,
    width: `${e.width / S * 100}%`,
    height: `${e.height / M * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function Ta(e, t) {
  e.translate(t.x, t.y), e.rotate(t.rotation * Math.PI / 180), e.scale(t.width / S, t.width / S);
}
function kr(e, t) {
  const r = t[0] * e.width, a = t[1] * e.height, n = t[2] * e.width, s = t[3] * e.height;
  return e.rotation === -90 ? [
    (e.x + a) / S,
    (e.y - r - n) / M,
    s / S,
    n / M
  ] : e.rotation === 90 ? [
    (e.x - a - s) / S,
    (e.y + r) / M,
    s / S,
    n / M
  ] : [(e.x + r) / S, (e.y + a) / M, n / S, s / M];
}
function vn(e) {
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? 1.5 : 1;
}
const Qt = Je;
function Cn(e, t, r) {
  e.fillStyle = "#000", e.fillRect(0, 0, 488, 680), he(t).forEach((a, n) => {
    e.save(), e.beginPath(), e.rect(0, n ? 0 : 324, 488, n ? 324 : 356), e.clip(), e.drawImage(Ts(a.face, r), 0, 0, 488, 680), e.restore();
  });
}
function Rn(e, t, r) {
  const o = t.manaSymbols ?? [], l = o.length * 23.4 + Math.max(0, o.length - 1) * 1.7;
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left", te(
    e,
    t.name,
    70,
    53,
    Math.max(1, (o.length ? 331 - l - 7 : 331) - 70),
    26,
    !0
  ), o.forEach((g, f) => X(e, g, 331 - l + f * (23.4 + 1.7), 39.5, 23.4, r, !0));
  const i = ee(t), d = r.get(i ?? ""), c = Ee(t), h = d ? Math.min(26 / (d.width * c[2]), 15.5 / (d.height * c[3])) : 0, u = d ? d.width * c[2] * h : 0, m = d ? d.height * c[3] * h : 0;
  if (te(e, t.typeLine ?? "", 70, 277, (d ? 331 - u - 6 : 331) - 70, 18.5, !0), d) {
    const g = [331 - u, 277 - m / 2, u, m];
    pe(i) || t.setSymbol ? e.drawImage(d, ...g) : Ie(e, d, t.setCode, t.rarity, ...g, c);
  }
}
function Tn(e, t, r) {
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic";
  const a = [
    ...new Set((t.faces ?? []).map((n) => n.artist ?? t.artist ?? "").filter(Boolean))
  ].join(" & ");
  if (e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""} ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    646
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 660), a && (e.font = '11px "CardRenderer MTG Artist Credit", serif', e.fillText("a", 95, 660), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(a, 110, 660, 193)), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 455, 660, 170)), ["rare", "mythic"].includes(t.rarity ?? "")) {
    const n = r.get(Ne);
    if (!n) throw Error("Modern split authenticity stamp unavailable.");
    e.drawImage(n, 223, 624, 43, 18);
  }
}
const Ma = {
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
function Wt(e) {
  return e.watermark && Object.hasOwn(Ma, e.watermark) ? `${F}/img/watermarks/guild-${e.watermark}.svg` : null;
}
function Ia(e, t) {
  return `${ha}/magic-new-split${e ? "-fuse" : ""}.mse-style/multicolor_blend_card${e ? t + 1 : ""}.png`;
}
function Mn(e, t, r, a) {
  if (t === "m15") return [...vs(e), Wt(e)];
  const n = _(e);
  return [
    ct(e, t, r, a),
    Wt(e),
    ...t === "eighth" && n.length === 2 ? [
      Ia(r, a),
      ...n.map(
        (s) => ct({ ...e, colors: [s], frameColors: void 0 }, t, r, a)
      )
    ] : [],
    ...t === "eighth" && e.artist ? [`${F}/img/manaSymbols/brush.svg`] : []
  ];
}
const Sr = /* @__PURE__ */ new WeakMap();
function In(e) {
  const t = Sr.get(e);
  if (t) return t;
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  const a = r.getContext("2d", { willReadFrequently: !0 });
  a.drawImage(e, 0, 0);
  const n = a.getImageData(0, 0, r.width, r.height);
  for (let s = 0; s < n.data.length; s += 4) n.data[s + 3] = n.data[s];
  return a.putImageData(n, 0, 0), Sr.set(e, r), r;
}
const vr = /* @__PURE__ */ new WeakMap();
function xn(e, t, r, a, n) {
  const s = (y) => {
    const w = n.get(y);
    if (!w) throw Error(`Split asset unavailable: ${y}`);
    return w;
  }, o = s(ct(e, t, r, a)), l = _(e);
  if (t !== "eighth" || l.length !== 2) return o;
  "WUBRG".indexOf(l[1]) - "WUBRG".indexOf(l[0]) > 2 && l.reverse();
  const [i, d] = l.map(
    (y) => s(
      ct({ ...e, colors: [y], frameColors: void 0 }, t, r, a)
    )
  ), c = s(Ia(r, a)), h = l.join(""), u = vr.get(o) ?? /* @__PURE__ */ new Map();
  vr.set(o, u);
  const m = u.get(h);
  if (m?.left === i && m.right === d && m.mask === c) return m.canvas;
  const g = document.createElement("canvas");
  g.width = o.width, g.height = o.height;
  const f = document.createElement("canvas");
  f.width = o.width, f.height = o.height;
  const k = g.getContext("2d"), p = f.getContext("2d");
  p.drawImage(d, 0, 0), p.globalCompositeOperation = "destination-in";
  const b = p.createLinearGradient(0, 0, o.width, 0);
  return b.addColorStop(0, "#0000"), b.addColorStop(0.4, "#0000"), b.addColorStop(0.6, "#000"), b.addColorStop(1, "#000"), p.fillStyle = b, p.fillRect(0, 0, o.width, o.height), k.drawImage(i, 0, 0), k.drawImage(f, 0, 0), k.globalCompositeOperation = "destination-in", k.drawImage(In(c), 0, 0), k.globalCompositeOperation = "destination-over", k.drawImage(o, 0, 0), k.globalCompositeOperation = "source-over", f.width = f.height = 0, u.set(h, { left: i, right: d, mask: c, canvas: g }), g;
}
const Cr = /* @__PURE__ */ new WeakMap();
function An(e, t, r, a) {
  const n = Wt(t);
  if (!n) return;
  const s = r.get(n);
  if (!s) throw Error(`Split watermark unavailable: ${n}`);
  const o = t.watermark, l = Cr.get(s) ?? /* @__PURE__ */ new Map();
  Cr.set(s, l);
  let i = l.get(o);
  if (!i) {
    i = document.createElement("canvas"), i.width = s.width, i.height = s.height;
    const m = i.getContext("2d");
    m.drawImage(s, 0, 0), m.globalCompositeOperation = "source-in";
    const g = {
      W: "#b39f4d",
      U: "#718dac",
      B: "#998795",
      R: "#b6723f",
      G: "#69936e"
    }, [f, k] = Ma[o], p = m.createLinearGradient(0, 0, i.width, 0);
    p.addColorStop(0, g[f]), p.addColorStop(0.499, g[f]), p.addColorStop(0.5, g[k]), p.addColorStop(1, g[k]), m.fillStyle = p, m.fillRect(0, 0, i.width, i.height), l.set(o, i);
  }
  const d = t.layout?.startsWith("split-m15") ?? !1, c = Math.min(
    (d ? 135 : 110) / s.width,
    (d ? 125 : t.setCode?.toLowerCase() === "dgm" ? 75 : 100) / s.height
  ), h = s.width * c, u = s.height * c;
  e.save(), e.globalAlpha = 0.3, e.drawImage(i, (d ? 199.5 : 177) - h / 2, a - u / 2, h, u), e.restore();
}
function Ln(e, t, r, a) {
  const [n, s, o, l] = Ye(r, a).rules, i = Ze({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), d = { x: n, y: s, width: o, height: l }, c = {
    leading: 1.02,
    paragraphGap: 0.4,
    flavorGap: 0.65,
    centerOffset: r === "old" ? 0 : 2
  }, h = r === "old" ? 24.5 : r === "m15" ? a ? 20.25 : 24.25 : 21.5;
  if ((r !== "m15" || a) && t.rulesAlignment?.mode !== "left" && i.length === 1) {
    const u = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? i : i, m = Qe(e, i, u, d, h, 13, 2, c);
    if (m) return m;
  }
  return q(e, i, d, h, 13, c);
}
function $n(e, t, r) {
  const a = Te(t);
  if (!a) throw Error("No native split plate for this printing.");
  if (a === "m15") return Cn(e, t, r);
  const n = a !== "old" && Je(t), s = Ye(a, n);
  e.fillStyle = fe(t.setCode, t.borderColor).border, e.fillRect(0, 0, 488, 680), he(t).forEach((o, l) => {
    const i = xn(o.face, a, n, l, r);
    e.save(), e.translate(o.x, o.y), e.rotate(-Math.PI / 2);
    const [d, c, h, u] = s.frame;
    e.drawImage(i, d - (n && l ? 8 * 680 / 523 : 0), c, h, u), e.restore();
  });
}
function En(e, t, r, a, n) {
  if (r === "m15") return Rn(e, t, n);
  const s = Ye(r, a), o = r === "old", [l, i, d, c] = s.title, h = t.manaSymbols ?? [], u = 23.4, m = 1.7, g = 316, f = h.length * u + Math.max(0, h.length - 1) * m;
  if (e.fillStyle = o ? "#f2eee3" : "#17140f", e.textBaseline = "middle", e.textAlign = "left", o) {
    const R = e.getTransform();
    e.shadowColor = "#000b", e.shadowOffsetX = R.a + R.c, e.shadowOffsetY = R.b + R.d;
  }
  te(
    e,
    t.name,
    l,
    i + c / 2 - (o ? 2 : 0),
    Math.max(1, h.length ? g - f - l - 7 : d),
    o ? 29 : 26.5,
    !o,
    1,
    o ? "CardRenderer MTG Goudy" : "CardRenderer MTG Matrix"
  ), h.forEach(
    (R, x) => X(e, R, g - f + x * (u + m), o ? 30.5 : 40, u, n, !o)
  );
  const k = ee(t), p = n.get(k ?? ""), b = Ee(t), [y, w, v, C] = s.type;
  if (te(
    e,
    t.typeLine ?? "",
    y,
    w + C / 2,
    v - (p ? 33 : 0),
    o ? 22 : 21.5,
    !1,
    1,
    o ? "CardRenderer MTG MPlantin" : "CardRenderer MTG Matrix"
  ), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, p) {
    const R = Math.min(
      32 / (p.width * b[2]),
      (o ? 26 : 22) / (p.height * b[3])
    ), x = p.width * b[2] * R, T = p.height * b[3] * R, I = [(o ? 306 : 316) - x, w + C / 2 - (o ? 1.5 : 0) - T / 2, x, T];
    pe(k) || t.setSymbol ? e.drawImage(p, ...I) : Ie(e, p, t.setCode, t.rarity, ...I, b);
  }
}
function Bn(e, t, r, a, n, s) {
  const o = Ye(a, n), l = a === "old";
  e.fillStyle = l ? "#eeeae1" : "#17140f", e.textAlign = l ? "center" : "left", e.textBaseline = "middle", e.font = l ? '19px "CardRenderer MTG MPlantin", Georgia' : '700 14px "CardRenderer MTG Matrix", Georgia';
  const i = s.get(`${F}/img/manaSymbols/brush.svg`);
  if (!l && i && e.drawImage(i, 36, o.artistY - 4, 20, 8), l) {
    const d = e.getTransform();
    e.shadowColor = "#000b", e.shadowOffsetX = d.a + d.c, e.shadowOffsetY = d.b + d.d;
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
function Gn(e, t, r, a, n) {
  const s = Te(t);
  if (!s) throw Error("No native split plate for this printing.");
  const o = s !== "old" && Je(t), l = Ye(s, o);
  e.save(), n !== "artwork" && $n(e, t, r), a && e.drawImage(a, 0, 0, 488, 680);
  for (const i of he(t))
    e.save(), e.translate(i.x, i.y), e.rotate(-Math.PI / 2), ye(e, i.face, r, l.art, n), n !== "artwork" && (En(e, i.face, s, o, r), An(e, i.face, r, l.rules[1] + l.rules[3] / 2), ge(e, Ln(e, i.face, s, o), r), s !== "m15" && Bn(e, i.face, t, s, o, r)), e.restore();
  if (s === "m15" && n !== "artwork" && Tn(e, t, r), o && n !== "artwork") {
    e.translate(0, 680), e.rotate(-Math.PI / 2);
    const i = ma(t).map(
      (d) => s === "m15" ? { ...d, align: "center" } : d
    );
    ge(
      e,
      q(
        e,
        i,
        s === "m15" ? { x: 70, y: 441, width: 577, height: 20 } : { x: 38, y: 407, width: 608, height: 26 },
        s === "m15" ? 18 : 21,
        12
      ),
      r
    );
  }
  e.restore();
}
let Rr;
function On(e) {
  return Te(e) !== "eighth" ? Promise.resolve() : Rr ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('24px "CardRenderer MTG Matrix"')
  ]).then((t) => {
    if (t.some((r) => !r.length || r.some((a) => a.status !== "loaded")))
      throw Error("Split Matrix fonts are unavailable. Load card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw Rr = void 0, t;
  });
}
const jn = {
  maximumSize: 20.7,
  padding: 24,
  equalCells: 0,
  lastLift: 0,
  bottomSpace: 0.15
};
function Pn(e, t, r = jn) {
  const a = et(t), n = a.filter((f) => !f.badges.length), s = a.filter((f) => f.badges.length), o = (f, k = !1) => [
    {
      role: "rules",
      runs: k ? [{ text: f, italic: !0 }] : f.split(/(\([^)]*\))/g).filter(Boolean).map((p) => ({ text: p, italic: p.startsWith("(") }))
    }
  ], l = { leading: 0.98, paragraphGap: 0.3, flavorGap: 0 }, i = n.length ? 201 : 80, d = t.reverseStats && t.layout === "transform" ? 535 : 569, c = q(
    e,
    n.flatMap((f) => o(f.text, f.reminder)),
    { x: 42.3, y: 78, width: 197, height: i - 80 },
    20.4,
    12,
    { ...l, centerOffset: -3 }
  );
  let h = r.maximumSize, u = [], m = [];
  for (; ; ) {
    const f = s.map(
      (w) => Math.max(
        q(
          e,
          o(w.text),
          { x: 65.1, y: 0, width: 171, height: 2e3 },
          h,
          h,
          l
        ).height + r.padding,
        43 + Math.max(0, w.badges.length - 1) * 49 + 12
      )
    ), k = d - i;
    if (f.reduce((w, v) => w + v, 0) > k && h > 12) {
      h = Math.max(12, h - 0.25);
      continue;
    }
    if (f.reduce((w, v) => w + v, 0) > k)
      throw Error("Saga chapter text or badges do not fit the available column.");
    const p = Math.max(0, k - f.reduce((w, v) => w + v, 0)) * (1 - (s.length === 2 && s[0].badges.length > 1 ? r.bottomSpace : 0)) / Math.max(1, s.length);
    m = f.map((w) => w + p);
    const b = k / Math.max(1, s.length);
    m = m.map((w) => w * (1 - r.equalCells) + b * r.equalCells);
    let y = i;
    u = s.map((w, v) => {
      const C = m[v], R = q(
        e,
        o(w.text),
        { x: 65.1, y: y + 7, width: 171, height: C - 14 },
        h,
        h,
        { ...l, centerOffset: v === s.length - 1 ? -r.lastLift : 0 }
      );
      return y += C, R;
    });
    break;
  }
  let g = i;
  return {
    reminder: c,
    size: h,
    rows: s.map((f, k) => {
      const p = { ...f, top: g, height: m[k], layout: u[k] };
      return g += p.height, p;
    })
  };
}
function Wn(e, t, r, a, n) {
  const s = (C) => {
    const R = r.get(C);
    if (!R) throw Error(`Saga asset unavailable: ${C}`);
    return R;
  };
  e.save(), e.fillStyle = "#090806", e.fillRect(0, 0, S, M), a && e.drawImage(a, 0, 0, S, M), n !== "artwork" && (e.drawImage(s(Jr(t)), 0, 0, S, M), ms(e, t, r));
  const o = ea.art;
  if (ye(e, t, r, [o[0] * S, o[1] * M, o[2] * S, o[3] * M], n), n === "artwork") {
    e.restore();
    return;
  }
  const l = $t(t);
  l && e.drawImage(s(l), 33.5, 35.6, 29, 32), e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const i = t.manaSymbols ?? [], d = 23.4, c = 1.8, h = 452, u = i.length * d + Math.max(0, i.length - 1) * c, m = t.layout === "transform" ? 78 : 41.7;
  te(
    e,
    t.name,
    m,
    51,
    (i.length ? h - u - 8 : 449) - m,
    26,
    !0
  ), i.forEach(
    (C, R) => X(e, C, h - u + R * (d + c), 38.7, d, r, !0)
  );
  const g = ee(t), f = r.get(g ?? ""), k = Ee(t), p = f ? Math.min(58.56 / (f.width * k[2]), 25.9 / (f.height * k[3])) : 0, b = f ? f.width * k[2] * p : 0, y = f ? f.height * k[3] * p : 0, w = [450.3 - b, 594.25 - y / 2, b, y];
  te(
    e,
    t.typeLine ?? "",
    41.7,
    594.5,
    (f ? w[0] - 7 : 449) - 41.7,
    22,
    !0
  ), f && (pe(g) || t.setSymbol ? e.drawImage(f, ...w) : Ie(e, f, t.setCode, t.rarity, ...w, k)), t.reverseStats && t.layout === "transform" && (e.fillStyle = "#65605a", e.font = 'italic 20px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.fillText(`${t.reverseStats.power}/${t.reverseStats.toughness}`, 41, 553));
  const v = Pn(e, t);
  ge(e, v.reminder, r);
  for (const C of v.rows)
    e.drawImage(s(Qr), 48.8, C.top - 1, 192.6, 2), ge(e, C.layout, r), C.badges.forEach((R, x) => {
      const T = C.top + C.height / 2 + (x - (C.badges.length - 1) / 2) * 49;
      e.drawImage(s(Zr), 18.8, T - 21.4, 38.4, 42.8), e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = '550 22px "CardRenderer MTG Chapter", Georgia', e.fillText(R, 38.1, T + 0.7);
    });
  ["rare", "mythic"].includes(t.rarity ?? "") && e.drawImage(s(Ne), 213.7, 620.2, 60.5, 25.3), e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""}  ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.font = '11px "CardRenderer MTG Artist Credit", serif', t.artist && e.fillText("a", 93, 658), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(t.artist ?? "", 108, 658, 210), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 646, 182)), e.restore();
}
let Tr = null;
function Dn() {
  return Tr ??= document.fonts.load('550 22px "CardRenderer MTG Chapter"').then((e) => {
    if (!e.length || e.some((t) => t.status !== "loaded"))
      throw Error("Saga chapter numerals need card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw Tr = null, e;
  });
}
function Fn(e, t, r) {
  const [a, n, s, o] = (r ? Yt : Nt).rules, l = Ze({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), i = { x: a, y: n, width: s, height: o }, d = {
    leading: 0.98,
    paragraphGap: 0.32,
    flavorGap: 0.65,
    centerOffset: r ? 0 : 2.5
  };
  let c = r ? 22 : t.setCode?.toLowerCase() === "hou" ? 24.5 : 22.5, h = q(e, l, i, c, 14, d);
  if (!r && l.length === 1 && h.lines.length > 1 && h.lines.at(-1).width < s * 0.18)
    for (let u = c - 0.25; u >= c * 0.9; u -= 0.25) {
      const m = q(e, l, i, u, u, d);
      if (!m.overflow && m.lines.length < h.lines.length) {
        c = u, h = m;
        break;
      }
    }
  if (!r && t.rulesAlignment?.mode !== "left") {
    const u = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? l : l, m = Qe(
      e,
      l,
      u,
      i,
      c,
      14,
      1,
      d
    );
    if (m) return m;
  }
  return h;
}
function _n(e, t, r, a, n) {
  const s = he(t), o = (l) => {
    const i = r.get(l);
    if (!i) throw Error(`Aftermath asset unavailable: ${l}`);
    return i;
  };
  e.save(), e.fillStyle = "#090806", e.fillRect(0, 0, 488, 680), a && e.drawImage(a, 0, 0, 488, 680), n !== "artwork" && s.forEach((l, i) => {
    e.save(), e.beginPath(), e.rect(0, i ? Le : 0, 488, i ? 680 - Le : Le), e.clip(), e.drawImage(o(na(l.face)), 0, 0, 488, 680), e.restore();
  }), s.forEach((l, i) => {
    e.save(), i && (e.translate(488, Le), e.rotate(Math.PI / 2));
    const d = l.face, c = i ? Yt : Nt;
    if (ye(e, d, r, c.art, n), n !== "artwork") {
      e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
      const h = d.manaSymbols ?? [], u = 23.4, m = 1.6, g = i ? 246 : 451, f = h.length * u + Math.max(0, h.length - 1) * m, [k, p] = c.title;
      te(e, d.name, k, p + 15.5, g - f - k - 7, 26, !0), h.forEach(
        (y, w) => X(e, y, g - f + w * (u + m), p + 3, u, r, !0)
      );
      const b = i ? void 0 : r.get(ee(d) ?? "");
      if (te(
        e,
        d.typeLine ?? "",
        c.type[0],
        c.type[1] + 16.5,
        c.type[2] - (b ? 45 : 0),
        23,
        !0
      ), b) {
        const y = Ee(d), w = Math.min(50 / (b.width * y[2]), 27 / (b.height * y[3])), v = b.width * y[2] * w, C = b.height * y[3] * w, R = [451 - v, 252.3 - C / 2, v, C];
        pe(ee(d)) || d.setSymbol ? e.drawImage(b, ...R) : Ie(e, b, d.setCode, d.rarity, ...R, y);
      }
      ge(e, Fn(e, d, !!i), r);
    }
    e.restore();
  }), n !== "artwork" && (["rare", "mythic"].includes(t.rarity ?? "") && e.drawImage(o(sa), 222, 623, 43, 20), e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""}  ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.font = '11px "CardRenderer MTG Artist Credit", serif', t.artist && e.fillText("a", 93, 658), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(t.artist ?? "", 108, 658, 220), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 646, 177))), e.restore();
}
const Mr = (e) => {
  const t = Math.max(0, Math.min(1, e));
  return t * t * (3 - 2 * t);
}, xt = (e) => {
  const t = Math.max(1e-3, e[0] + e[1] + e[2]);
  return e.map((r) => r / t);
};
function Un(e, t) {
  const { width: r, height: a, data: n } = e, s = new Float32Array(r * a);
  if (t.kind === "rect") {
    const [y, w, v, C] = t.rect;
    for (let R = 0; R < a; R++)
      for (let x = 0; x < r; x++) {
        const T = Math.min(
          x / r - y,
          y + v - x / r,
          R / a - w,
          w + C - R / a
        );
        s[R * r + x] = Mr(T / t.feather + 0.5);
      }
    return s;
  }
  const o = xt(t.frameRgb), l = xt(t.paperRgb), i = l.map((y, w) => y - o[w]), d = i.reduce((y, w) => y + w * w, 0);
  if (d < 1e-3) throw Error("Paper and frame chroma are too similar for this mask.");
  const [c, h, u, m] = t.bounds;
  for (let y = 0; y < a; y++)
    for (let w = 0; w < r; w++) {
      if (w / r < c || w / r > c + u || y / a < h || y / a > h + m)
        continue;
      const v = y * r + w, C = v * 4;
      if (n[C + 3] < 250) continue;
      const x = xt([n[C] / 255, n[C + 1] / 255, n[C + 2] / 255]).reduce((T, I, L) => T + (I - o[L]) * i[L], 0) / d;
      s[v] = Mr((x - 0.22) / 0.56);
    }
  const g = new Uint8Array(s.length), f = new Int32Array(s.length), k = Math.round(t.seed[1] * a) * r + Math.round(t.seed[0] * r);
  if (!(s[k] > 0.08)) throw Error("Paper mask seed is outside the paper.");
  let p = 0, b = 1;
  for (f[0] = k, g[k] = 1; p < b; ) {
    const y = f[p++], w = y % r;
    for (const v of [y - r, y + r, w ? y - 1 : -1, w < r - 1 ? y + 1 : -1])
      v >= 0 && v < g.length && !g[v] && s[v] > 0.08 && (g[v] = 1, f[b++] = v);
  }
  for (let y = 0; y < s.length; y++) g[y] || (s[y] = 0);
  return s;
}
function Nn(e, t) {
  const r = "mask" in t ? t : void 0, a = r ? Un(e, r.mask) : void 0, n = "mask" in t ? t.frame : t;
  for (let s = 0; s < e.data.length; s += 4) {
    if (e.data[s + 3] === 0) continue;
    const o = [e.data[s] / 255, e.data[s + 1] / 255, e.data[s + 2] / 255], l = Math.max(...o), i = l === 0 ? 0 : (l - Math.min(...o)) / l;
    if (l < 0.075 || !r && i < 0.025 && l > 0.97) continue;
    const d = a?.[s / 4] ?? 0, c = Gt(o, d === 1 && r ? r.paper : n), h = d > 0 && d < 1 && r ? Gt(o, r.paper) : c;
    for (let u = 0; u < 3; u++)
      e.data[s + u] = Math.round(
        Math.round(255 * c[u]) * (1 - d) + Math.round(255 * h[u]) * d
      );
  }
}
class Yn {
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
    const r = new Set(t.map((n) => n.key)), a = t.reduce((n, s) => {
      const o = this.entries.get(s.key);
      if (o && o.bytes !== s.bytes)
        throw Error("Material cache key has inconsistent dimensions");
      return n + (o ? 0 : s.bytes);
    }, 0);
    for (const [n, s] of this.entries) {
      if (this.bytes + a <= this.limit) break;
      s.users || r.has(n) || (this.entries.delete(n), s.retired = !0, this.destroy(s), this.evictions++);
    }
    if (!(this.bytes + a > this.limit))
      return this.bytes += a, this.peakBytes = Math.max(this.peakBytes, this.bytes), t.map((n) => {
        let s = this.entries.get(n.key);
        if (s)
          this.hits++, this.entries.delete(n.key), this.entries.set(n.key, s);
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
          }), this.entries.set(n.key, o), s = o;
        }
        return s.users++, s;
      });
  }
  notify() {
    for (const t of [...this.waiting]) t();
  }
  wait(t) {
    return t.throwIfAborted(), new Promise((r, a) => {
      const n = () => {
        this.waiting.delete(s), t.removeEventListener("abort", o);
      }, s = () => {
        n(), r();
      }, o = () => {
        n(), a(t.reason);
      };
      this.waiting.add(s), t.addEventListener("abort", o, { once: !0 });
    });
  }
  async acquire(t, r, a, n) {
    return (await this.acquireMany([{ key: t, bytes: r, build: a }], n))[0];
  }
  /** Admit a complete face atomically. Per-component waiting could deadlock two
   * faces that each hold half their required components while awaiting the rest. */
  async acquireMany(t, r) {
    if (r.throwIfAborted(), new Set(t.map((s) => s.key)).size !== t.length)
      throw Error("Duplicate key in material batch");
    if (t.some((s) => !Number.isSafeInteger(s.bytes) || s.bytes < 1) || t.reduce((s, o) => s + o.bytes, 0) > this.limit)
      throw RangeError("Material batch exceeds derived-image budget");
    let a;
    for (; !(a = this.admit(t)); )
      await this.wait(r), r.throwIfAborted();
    const n = a.map((s) => {
      let o = !1;
      return () => {
        o || (o = !0, s.users--, s.retired && !s.users && this.destroy(s), this.notify());
      };
    });
    try {
      const o = (await Promise.allSettled(a.map((l) => l.promise))).find((l) => l.status === "rejected");
      if (o?.status === "rejected") throw o.reason;
      return r.throwIfAborted(), a.map((l, i) => ({ value: l.bitmap, release: n[i] }));
    } catch (s) {
      for (const o of n) o();
      throw s;
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
const xa = new Yn(16 * 1024 * 1024), $o = () => xa.clear(), zn = {
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
}, Hn = {
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
function er(e) {
  const t = ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "");
  return ke(e) && (!e.layout || e.layout === "normal") && (e.colorCalibration === "set-hsb-v1" || t && e.colorCalibration === "early-hsb-v1");
}
function qn(e) {
  if (!er(e)) return;
  const t = $e(e), r = t.split("/").at(-1).replace(".png", "").toUpperCase(), a = zn[`${e.setCode?.toLowerCase()}-${we(e)}-${r}`];
  if (!(a?.asset !== t || !a.rect.every((n, s) => n === ia(e)[s])))
    return t.endsWith("/old/fourth/w.png") ? {
      ...a.adjustment,
      mask: {
        kind: "rect",
        rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
        feather: 2 / 1500
      }
    } : a.adjustment;
}
function Xn(e, t) {
  if (er(e))
    return Hn[`${e.setCode?.toLowerCase()}-${we(e)}-${t}`];
}
async function Vn(e, t, r) {
  const a = { images: t, dispose() {
  } };
  if (!er(e)) return a;
  const n = qn(e), s = /* @__PURE__ */ new Map(), o = {};
  n && s.set($e(e), n);
  const l = /* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...[...(e.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((h) => h[1])
  ]);
  for (const h of e.rulesParagraphs ?? [])
    for (const u of h.runs) for (const m of u.text.matchAll(/\{([^}]+)\}/g)) l.add(m[1]);
  l.add("W");
  for (const h of l) {
    const u = /^\d+$/.test(h) ? "N" : h, m = Xn(e, u), g = un[u];
    if (!m || !g) continue;
    const f = ft(h);
    f && s.set(f, Zn(g, m)), o[h] = `rgb(${m.map((k) => Math.round(k * 255)).join(" ")})`;
  }
  if (!s.size && !Object.keys(o).length) return a;
  const i = Object.assign(new Map(t), { manaColors: o }), d = [...s].flatMap(([h, u]) => {
    const m = t.get(h);
    return m ? [{ url: h, source: m, adjustment: u }] : [];
  });
  let c = [];
  try {
    return c = await xa.acquireMany(
      d.map(({ url: h, source: u, adjustment: m }) => ({
        key: Kn(h, u.width, u.height, m),
        bytes: u.width * u.height * 4,
        build: () => Jn(u, m)
      })),
      r
    ), d.forEach(({ url: h }, u) => i.set(h, c[u].value)), { images: i, dispose: () => c.forEach((h) => h.release()) };
  } catch (h) {
    throw c.forEach((u) => u.release()), h;
  }
}
function Kn(e, t, r, a) {
  return JSON.stringify(["frame-hsb-paper-mask-v3", e, t, r, a]);
}
async function Jn(e, t) {
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  try {
    const a = r.getContext("2d", { willReadFrequently: !0 });
    if (!a) throw Error("HSB preparation needs Canvas2D.");
    a.drawImage(e, 0, 0);
    const n = a.getImageData(0, 0, r.width, r.height);
    return Nn(n, t), a.putImageData(n, 0, 0), await createImageBitmap(r);
  } finally {
    r.width = r.height = 0;
  }
}
function Zn(e, t) {
  const r = [
    parseInt(e.slice(1, 3), 16) / 255,
    parseInt(e.slice(3, 5), 16) / 255,
    parseInt(e.slice(5, 7), 16) / 255
  ], [a, n, s] = Bt(r), [o, l, i] = Bt(t);
  if (n <= 0 || s <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (o - a + 540) % 360 - 180,
    saturationScale: l / n,
    brightnessScale: i / s
  };
}
const Qn = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Ir = {
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
}, xr = {
  m15: { family: "m15-accurate", delta: [1, 0, 1, 1] },
  m21: { family: "m15-accurate", delta: [2, 0, 1.1, 1.06] },
  woe: { family: "m15-accurate", delta: [2, 0, 1.08, 1.08] },
  tdm: { family: "m15-accurate", delta: [0, 0, 1.08, 1.08] },
  "8ed": { family: "eighth", delta: [-4, 0, 1, 0.92] },
  "9ed": { family: "eighth", delta: [0, 1, 0.9, 0.92] }
};
function e0(e, t, r) {
  const a = e.setCode?.toLowerCase() ?? "", n = Object.hasOwn(xr, a) ? xr[a] : void 0;
  let s = r;
  return n && !e.setSymbol && pe(t) && n.family === e.frameAssetFamily && (s = Aa(r, n.delta)), e.frameAssetFamily ? tr(e, t, s, e.frameAssetFamily) : s;
}
function tr(e, t, r, a) {
  if (e.setSymbol || !pe(t) || F !== Qn || (e.layout ?? "normal") !== "normal" || ["component", "m15-accurate"].includes(a) && Z(e).legendary)
    return r;
  const n = e.borderColor ?? (a === "retro" ? we(e) : fe(e.setCode).border === "#eeedeb" ? "white" : "black"), s = `${e.setCode?.trim().toLowerCase() ?? ""}/${a}/${n}`, o = Object.hasOwn(Ir, s) ? Ir[s] : void 0;
  return o ? Aa(r, o) : r;
}
function Aa(e, t) {
  const [r, a, n, s] = e, [o, l, i, d] = t;
  return [r + n + o - n * i, a + s / 2 + l - s * d / 2, n * i, s * d];
}
const t0 = 0.045;
function r0(e) {
  return ke(e) ? fs : t0;
}
const At = "#fbf0c5", at = "#ccdaf2", Ar = "#9c9995", Lt = "#edaa8d", st = "#dde6e2", a0 = {
  WU: [At, at],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [Lt, At],
  WG: [st, At],
  UB: [at, Ar],
  UR: [at, Lt],
  UG: [st, at],
  BR: ["#b4afb5", "#f2b096"],
  BG: [Ar, st],
  RG: [Lt, st]
};
function s0(e, t, r) {
  if (!t.land) return;
  const a = a0[t.frame];
  if (!a) return;
  const n = 34 + r, s = 420 - 2 * r, o = e.createLinearGradient(n, 0, n + s, 0);
  o.addColorStop(0, a[0]), o.addColorStop(0.35, a[0]), o.addColorStop(0.65, a[1]), o.addColorStop(1, a[1]), e.save(), e.globalCompositeOperation = "multiply", e.fillStyle = o, e.fillRect(n, 425, s, 203.5), e.restore();
}
function n0(e, t, r, a) {
  if (!t.land || t.frame !== "Artifact") {
    a();
    return;
  }
  const n = 34 + r, s = 420 - 2 * r;
  for (const o of [!1, !0])
    e.save(), e.beginPath(), o || e.rect(0, 0, 488, 680), e.rect(n, 425, s, 203.5), e.clip("evenodd"), e.filter = `grayscale(1) brightness(${o ? 0.9 : 0.63})`, a(), e.restore();
}
function La(e) {
  if (e.setSymbol) return null;
  const t = e.setCode?.toLowerCase();
  return t === "m15" || t === "war" ? t : null;
}
function $a(e, t, r, a, n, s, o, l, i, d) {
  const [c, h, u, m] = d ? r === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, r === "m15" ? 0.7 : 1.2];
  n += h - o * (c - 1) / 2, s += u - l * (c - 1) / 2, o *= c, l *= c;
  const g = !a || a === "common", f = document.createElement("canvas"), k = 3, p = 4;
  f.width = Math.ceil((o + k * 2) * p), f.height = Math.ceil((l + k * 2) * p);
  const b = f.getContext("2d");
  b.scale(p, p), b.translate(k, k), b.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    0,
    0,
    o,
    l
  ), b.globalCompositeOperation = "source-in";
  const y = a === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : a === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], w = b.createLinearGradient(0, l * 0.65, o, l * 0.35);
  w.addColorStop(0, y[0]), w.addColorStop(0.35, y[1]), w.addColorStop(0.6, y[2]), w.addColorStop(1, y[3]), b.fillStyle = g ? "#111111" : w, b.fillRect(0, 0, o, l);
  const v = r === "m15" ? 32 : 27, C = new Path2D(
    r === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), R = new DOMMatrix().translate(-i[0] * o / i[2], -i[1] * l / i[3]).scale(o / (v * i[2]), l / (32 * i[3])), x = new Path2D();
  x.addPath(C, R), b.globalCompositeOperation = "destination-over", b.fillStyle = g ? "#f8f8f5" : "#111111", b.fill(x), b.strokeStyle = b.fillStyle, b.lineWidth = r === "war" && g ? 2 : m, b.lineJoin = "round", b.stroke(x), e.drawImage(
    f,
    n - k,
    s - k,
    f.width / p,
    f.height / p
  ), f.width = f.height = 0;
}
const Lr = {
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
function o0(e) {
  if ((e.layout ?? "normal") !== "normal") return;
  const t = `${e.setCode?.toLowerCase() ?? ""}/${we(e)}`;
  return Object.hasOwn(Lr, t) ? Lr[t] : void 0;
}
function l0(e, t) {
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
  const n = _(t), s = !/\bLand\b/.test(t.typeLine ?? "") && !(n.length === 1 && ["W", "R"].includes(n[0]));
  e.fillStyle = s ? "#f2eee3" : "#17140f";
  const o = r === "usg" ? 1998 : 1999, l = t.collectorNumber ? ` ${t.collectorNumber}/${r === "usg" ? 350 : 143}` : "", i = t.legalText === void 0 ? `©1993–${o} Wizards of the Coast, Inc.${l}` : t.legalText;
  return i && e.fillText(i, 244, 640, 365), e.restore(), !0;
}
function i0(e, t, r) {
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
function d0(e, t) {
  const r = 52.053333333333335, a = 1255 / 2100 * 680, n = 1346 / 1500 * 488, s = 1861 / 2100 * 680, o = 17 / 1500 * 488, l = 17 / 2100 * 680, i = (c) => {
    e.moveTo(...c[0]);
    for (const h of c.slice(1)) e.lineTo(...h);
    e.closePath();
  };
  e.save();
  const d = e.filter;
  e.filter = "none", e.fillStyle = "#00000047", e.beginPath(), i([
    [r, a],
    [n, a],
    [n - o, a + l],
    [r + o, a + l]
  ]), i([
    [n, a],
    [n, s],
    [n - o, s - l],
    [n - o, a + l]
  ]), e.fill(), e.beginPath(), i([
    [r, a],
    [r + o, a + l],
    [r + o, s - l],
    [r, s]
  ]), i([
    [r, s],
    [r + o, s - l],
    [n - o, s - l],
    [n, s]
  ]), e.clip(), e.filter = `${d === "none" ? "" : d + " "}brightness(1.35)`, e.drawImage(t, 0, 0, 488, 680), e.restore();
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
}, c0 = {
  W: { ...H.por, right: 436.75, centerY: 389.75 },
  U: { ...H.por, right: 436.5, centerY: 392.75 },
  R: { ...H.por, right: 433.75, centerY: 392 },
  G: { ...H.por, right: 434, centerY: 390.75 }
}, h0 = {
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
  por: c0
};
function u0(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  if (e.setSymbol || !Object.hasOwn(H, t)) return null;
  const r = _(e);
  return r.length === 1 && !/\b(?:Land|Artifact)\b/.test(e.typeLine ?? "") ? h0[t]?.[r[0]] ?? H[t] : H[t];
}
function m0(e) {
  return e.setSymbol || e.setCode?.toLowerCase() !== "exo" ? null : e.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : e.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const Dt = {
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
}, Ea = (e) => `${e}#opaque-print-details-v1`, g0 = (e) => Object.keys(Dt).some((t) => e === `${Me.KEYRUNE_ROOT}/${t}.svg`);
async function f0(e, t) {
  const r = Object.keys(Dt).find((c) => e === `${Me.KEYRUNE_ROOT}/${c}.svg`);
  if (!r) return null;
  const a = new DOMParser().parseFromString(await t.text(), "image/svg+xml"), n = a.documentElement, s = a.querySelectorAll("path"), o = s[0]?.getAttribute("d") ?? "", l = o.match(/M[^M]*/g) ?? [], i = Dt[r];
  if (n.localName !== "svg" || a.querySelector("parsererror") || s.length !== 1 || l.length !== i.count || l.some((c) => /m/.test(c) || !/[zZ]\s*$/.test(c)))
    throw new Error(`Unexpected pinned ${r} symbol paths.`);
  const d = a.createElementNS("http://www.w3.org/2000/svg", "path");
  return d.setAttribute("d", i.white.map((c) => l[c]).join("")), d.setAttribute("fill", "#fff"), n.replaceChildren(d), new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" });
}
function p0(e, t, r, a = !1) {
  Ba(
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
    a
  );
}
function b0(e, t, r, a = !1) {
  Ba(
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
    a
  );
}
function Ba(e, t, r, a, n) {
  t.forEach((s, o) => {
    const { size: l } = a, i = a.right - (t.length - 1 - o) * a.pitch - l / 2, d = a.centerY - l / 2;
    if (s !== "W" || n) {
      X(e, s, i, d, l, r, !1);
      return;
    }
    Oa(e, i, d, l, a.whiteSize, r.manaColors?.W);
  });
}
const Ga = (e, t, r, a, n, s) => {
  if (t !== "W") return X(e, t, r, a, n, s);
  Oa(e, r, a, n, n * 0.87, s.manaColors?.W);
};
function Oa(e, t, r, a, n, s = "#efe7cb") {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = s, e.beginPath(), e.arc(t + a / 2, r + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = '100px "CardRenderer MTG Historic Symbols"', e.textAlign = "left", e.textBaseline = "alphabetic";
  const o = "", l = e.measureText(o), i = l.actualBoundingBoxLeft + l.actualBoundingBoxRight, d = l.actualBoundingBoxAscent + l.actualBoundingBoxDescent, c = n / Math.max(i, d);
  e.translate(t + a / 2, r + a / 2), e.scale(c, c), e.fillText(
    o,
    (l.actualBoundingBoxLeft - l.actualBoundingBoxRight) / 2,
    (l.actualBoundingBoxAscent - l.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function w0(e, t, r, a, n, s) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0;
  const o = document.createElement("canvas");
  o.width = e.canvas.width, o.height = e.canvas.height;
  const l = o.getContext("2d");
  if (!l) throw Error("Retro lettering needs a Canvas2D context");
  const i = e.getTransform();
  l.font = e.font, l.textAlign = e.textAlign, l.textBaseline = e.textBaseline, l.letterSpacing = e.letterSpacing, e.resetTransform();
  for (const [d, c, h] of [
    [0, s, "#f2eee3"],
    [s, 0, "#17140f"]
  ])
    l.resetTransform(), l.clearRect(0, 0, o.width, o.height), l.setTransform(i), l.globalCompositeOperation = "source-over", l.fillStyle = h, l.fillText(t, r + d, a + d, n), l.globalCompositeOperation = "destination-out", l.fillText(t, r + c, a + c, n), e.drawImage(o, 0, 0);
  o.width = o.height = 0, e.restore();
}
function rr(e, t, r, a, n, s) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#17140f", e.fillText(t, r + s, a + s, n), e.fillStyle = "#ababab", e.fillText(t, r, a, n), e.restore();
}
function y0(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function k0(e, t) {
  e.save(), e.font = '22.5px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", rr(e, `Illus. © ${t}`, 49, 631, 338, 1.25), e.restore();
}
const mt = (e) => e?.runs.map((t) => t.text).join("") ?? "", $r = (e) => e.length === 2 && /^[A-Za-z ,]+$/.test(mt(e[0])) && mt(e[0]).length <= 20;
function S0(e, t, r, a, n, s, o, l) {
  const i = (m) => m.role === "rules" && m.runs.length > 0 && !mt(m).includes(`
`) && m.align === void 0;
  if (!r.length || !r.every(i) || t.some((m) => m.align) || r.length !== 1 && !$r(r)) return null;
  const d = (m) => m.map(
    (g, f) => ({
      ...g,
      align: g.align ?? (g.role === "flavor" || $r(m) && f === 0 && !/^Enchant\b/.test(mt(g)) ? "left" : "center")
    })
  ), c = { x: 70, y: a - 6, width: 348, height: n - 8 }, h = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, u = q(e, d(r), c, s, s, h);
  return u.overflow || u.lines.length > 5 ? null : q(
    e,
    d(t),
    { ...c, verticalLimits: l },
    s,
    o,
    h
  );
}
const He = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: !1,
  flavorSeparator: !1
};
function v0(e, t) {
  if (Xt(t)) return null;
  const [r, a, n, s] = de(qt(t).rules), o = zt(t), l = o?.paragraphs ?? Ze({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), i = t.rulesAlignment?.mode === "left", d = i ? l.map((T) => ({ ...T, align: "left" })) : l, c = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? d : d, h = t.wordingMode === "oracle" ? 10 : 15, u = t.setCode?.toLowerCase(), m = u === "lea" && t.wordingMode === "oracle" ? [428, 590] : void 0, g = ["lea", "leb", "2ed"].includes(u ?? ""), f = g || u === "3ed" && ce(t) === "fourth";
  if (f && !i) {
    const T = S0(
      e,
      d,
      c,
      a,
      s,
      g ? 32.5 : 27.5,
      h,
      m
    );
    if (T) return T;
  }
  const k = c.length === 1 ? c[0] : void 0, p = k?.runs.length === 1 ? k.runs[0] : void 0;
  if (!i && u === "4ed" && ce(t) === "fourth" && c.some((T) => T.role === "flavor")) {
    const T = Qe(
      e,
      d,
      c,
      { x: 72, y: a + 2, width: 344, height: s - 8 },
      25,
      h,
      5,
      {
        ...He,
        leading: 1.1,
        paragraphGap: 0,
        flavorGap: 0,
        balanceLines: !0
      },
      150
    );
    if (T) return T;
  }
  const b = !i && u === "4ed" && ce(t) === "fourth" && d.every((T) => T.align === void 0 || T.align === "center") && k?.role === "rules" && (k.align === void 0 || k.align === "center") && p && !p.italic && !p.text.includes(`
`) && p.text.length > 0 && p.text.length <= 100, y = (f || u === "4ed" && ce(t) === "fourth") && (d.length > 1 || d.reduce((T, I) => T + I.runs.reduce((L, P) => L + P.text.length, 0), 0) > 100), w = y && f, v = y && u === "4ed", C = (u === "mir" || u === "tmp") && !o && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") && _(t).join("") === "W", R = q(
    e,
    b ? d.map((T) => ({ ...T, align: "center" })) : d,
    {
      x: f ? 70 : v || b ? 72 : r,
      y: a + (o ? 1.5 : b ? -6 : v ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: f ? 346 : v || b ? 344 : n + (C ? 10 : 0),
      height: s - 8,
      verticalLimits: m
    },
    o ? 24 : b ? 25 : 22.5,
    h,
    b ? { ...He, leading: 1, balanceLines: !0 } : y ? {
      ...He,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: w ? -10 : 0
    } : He
  ), x = d.reduce(
    (T, I) => T + I.runs.reduce((L, P) => L + P.text.length, 0),
    0
  );
  return !w || x <= 270 || R.size >= 22 ? R : q(
    e,
    d,
    { x: 70, y: a + 4, width: 346, height: s + 8, verticalLimits: m },
    15.5,
    h,
    {
      ...He,
      leading: 1.25,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: -18
    }
  );
}
function C0(e) {
  return e.setCode?.toLowerCase() === "3ed" && ce(e) === "fourth";
}
function R0(e, t, r, a, n) {
  e.save(), e.font = '26px "CardRenderer MTG Goudy", Georgia', rr(e, t, 40, a, n + r - 40, 1), e.restore();
}
function T0(e, t, r) {
  e.save(), e.font = '26px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "right", w0(e, t, 451, r + 12, 130, 1.25), e.restore();
}
function M0(e, t) {
  e.save(), e.font = '22px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", rr(e, `Illus. © ${t}`, 50, 642, 338, 1.25), e.restore();
}
function I0(e) {
  return ["4ed", "5ed"].includes(e.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(e.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function Er(e) {
  const t = String(e.toughness ?? ""), r = e.wordingMode !== "oracle" && e.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(t) ? `(${t})` : t;
  return `${e.power ?? ""}/${r}`;
}
function x0(e) {
  const t = e.setCode?.toLowerCase(), r = t === "4ed" && !/\bLand\b/.test(e.typeLine ?? "");
  if (t !== "mir" && t !== "tmp" && !r) return null;
  const a = _(e);
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
const ar = (e, t, r, a, n, s) => {
  if (t !== "T") return X(e, t, r, a, n, s);
  ja(e, r, a, n, "", 0.88);
}, Ft = (e, t, r, a, n, s) => {
  if (t !== "T") return Ga(e, t, r, a, n, s);
  ja(e, r, a, n, "", 0.8);
}, A0 = (e, t, r, a, n, s) => {
  if (t !== "T") return X(e, t, r, a, n, s);
  ar(e, t, r, a, n, s);
}, L0 = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function $0(e) {
  const t = e?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(t) || ["lea", "leb", "2ed", "arn", "atq"].includes(t) ? Ft : t === "4ed" ? A0 : L0.has(t) ? ar : X;
}
function ja(e, t, r, a, n, s) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#c9c4be", e.beginPath(), e.arc(t + a / 2, r + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = `${a * s}px "CardRenderer MTG Historic Symbols"`, e.textAlign = "left", e.textBaseline = "alphabetic";
  const o = e.measureText(n);
  e.fillText(
    n,
    t + (a - o.actualBoundingBoxLeft - o.actualBoundingBoxRight) / 2 + o.actualBoundingBoxLeft,
    r + (a + o.actualBoundingBoxAscent - o.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function E0(e, t, r, a, n, s, o, l = [0, 0, 1, 1], i = null, d = "low") {
  const c = document.createElement("canvas"), h = Math.ceil(o * 2) + 1;
  c.width = Math.ceil(n * 2) + h * 2, c.height = Math.ceil(s * 2) + h * 2;
  const u = c.getContext("2d");
  u.imageSmoothingQuality = d, u.drawImage(
    t,
    l[0] * t.width,
    l[1] * t.height,
    l[2] * t.width,
    l[3] * t.height,
    h,
    h,
    n * 2,
    s * 2
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
  if (u.fillStyle = "#17140f", i) {
    const m = u.createLinearGradient(h, h, h + n * 2, h);
    i.forEach((g, f) => m.addColorStop(f / 2, g)), u.fillStyle = m;
  }
  u.fillRect(0, 0, c.width, c.height), e.drawImage(c, r - h / 2, a - h / 2, c.width / 2, c.height / 2), e.restore(), c.width = c.height = 0;
}
function B0(e, t, r) {
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", t.artist && (e.fillStyle = "#f2eee3", e.shadowColor = "#000", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = `${r.artistSize}px "CardRenderer MTG MPlantin", Georgia`, e.fillText(`Illus. ${t.artist}`, r.artistX, r.artistBaseline, 338)), e.shadowColor = "transparent", e.fillStyle = r.legalLight ? "#f2eee3" : "#17140f", e.font = `${r.legalSize}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && e.fillText(r.legalText, r.artistX, r.legalBaseline, 380), e.restore();
}
function G0(e, t, r, a, n) {
  const s = qt(t), o = x0(t), l = C0(t);
  if (n === "artwork") {
    ye(e, t, r, de(s.art), n);
    return;
  }
  e.fillStyle = mr(t), e.fillRect(0, 0, 488, 680), e.fillStyle = "#686050", e.fillRect(24.4, 27.2, 439.2, 625.6), e.fillStyle = "#e5dec5", e.fillRect(...de(s.rules)), e.fillStyle = "#746b58", e.fillRect(...de(s.art)), a && e.drawImage(a, 0, 0, 488, 680), ye(e, t, r, de(s.art), n);
  const i = r.get($e(t));
  if (i && (e.save(), e.filter = _s(t), e.drawImage(i, ...de(s.frame)), i0(e, i, $e(t)), $e(t).endsWith("/seventh/regular/m.png") && d0(e, i), e.restore()), we(t) !== "black" || ce(t) === "fourth") {
    const W = r.get(da(t));
    if (W) {
      const U = document.createElement("canvas");
      U.width = 732, U.height = 1020;
      const Y = U.getContext("2d");
      Y.drawImage(W, 0, 0, 732, 1020), Y.globalCompositeOperation = "source-in", Y.fillStyle = mr(t), Y.fillRect(0, 0, 732, 1020), e.drawImage(U, ...de(s.frame)), U.width = U.height = 0;
    }
  }
  e.fillStyle = gr(t), e.textBaseline = "middle", e.textAlign = "left", e.letterSpacing = "0px";
  const [d, c, h, u] = de(s.title), m = t.manaSymbols ?? [], g = o0(t), f = g?.[3] ?? o?.manaSize ?? 23.4, k = g ? g[2] - f : o?.manaGap ?? 1.7, p = m.length * (f + k), b = g ? g[0] + f / 2 - p + k : o ? o.manaRight - p + k : d + h - p;
  e.shadowColor = "#000b", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const y = o?.titleX ?? d, w = c + u / 2 + (o?.titleYOffset ?? 0), v = Math.max(
    1,
    m.length ? b - y - 5 : o?.titleX == null ? h - 5 : d + h - y - 5
  );
  l ? R0(e, t.name, y, w, v) : e.fillText(t.name, y, w, v);
  const C = t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle", R = t.symbolStyle === "original" || t.symbolStyle === void 0 && t.wordingMode === "original", x = R && ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  l ? p0(e, m, r, C) : ["lea", "2ed"].includes(t.setCode?.toLowerCase() ?? "") ? b0(e, m, r, C) : m.forEach(
    (W, U) => (x ? Ga : X)(
      e,
      W,
      b + U * (f + k),
      g ? g[1] - f / 2 : o?.manaTop ?? c + u / 2 - f / 2,
      f,
      r,
      !1
    )
  );
  const [T, I, L, P] = de(s.type), A = ca(t) ?? "", O = r.get(A), B = u0(t), V = m0(t), re = O ? Math.min(44 / O.width, (o?.setHeight ?? 23.4) / O.height) : 0, E = B?.width ?? (O?.width ?? 0) * re, N = B?.height ?? (O?.height ?? 0) * re, G = [
    (B?.right ?? o?.setRight ?? T + L) - E,
    (B?.centerY ?? o?.setCenterY ?? I + P / 2) - N / 2,
    E,
    N
  ], oe = tr(t, A, G, "retro");
  if (e.font = '21.7px "CardRenderer MTG MPlantin", Georgia', e.fillText(
    zt(t)?.typeLine ?? t.typeLine ?? "",
    o?.typeX ?? T,
    I + P / 2,
    O ? Math.max(
      1,
      Math.min(
        L - 48,
        B ? B.right - B.width - T - 6 : L,
        oe !== G ? oe[0] - (o?.typeX ?? T) - 6 : L
      )
    ) : L
  ), O) {
    const W = Math.min(44 / O.width, (o?.setHeight ?? 23.4) / O.height), U = B?.width ?? O.width * W, Y = B?.height ?? O.height * W, le = B?.right ?? o?.setRight ?? T + L, se = B?.centerY ?? o?.setCenterY ?? I + P / 2, me = B?.crop ?? [0, 0, 1, 1], Se = pe(A), K = !Se && !t.setSymbol && r.get(Ea(A));
    K && (e.save(), e.shadowColor = "transparent", t.setCode?.toLowerCase() === "arn" && (e.filter = "brightness(0.7)"), e.drawImage(
      K,
      me[0] * K.width,
      me[1] * K.height,
      me[2] * K.width,
      me[3] * K.height,
      le - U,
      se - Y / 2,
      U,
      Y
    ), e.restore()), Se || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(O, ...oe), e.restore()) : V || o || Hr(t.setCode) ? E0(
      e,
      O,
      le - U,
      se - Y / 2,
      U,
      Y,
      B?.outline ?? (V ? 2 : o?.setOutline ?? ds(t.setCode)),
      me,
      V,
      B?.sampling
    ) : Ie(
      e,
      O,
      t.setCode,
      t.rarity,
      T + L - O.width * W,
      I + P / 2 - O.height * W / 2,
      O.width * W,
      O.height * W
    );
  }
  e.shadowColor = "transparent";
  const [ae, Be, xe, be] = de(s.rules);
  e.fillStyle = "#17140f";
  const Q = r.get(Xt(t) ?? "");
  if (Q) {
    const W = Math.min(xe * 0.4 / Q.width, be * 0.75 / Q.height);
    e.drawImage(
      Q,
      ae + (xe - Q.width * W) / 2,
      Be + (be - Q.height * W) / 2,
      Q.width * W,
      Q.height * W
    );
  } else {
    const W = v0(e, t);
    W && ge(
      e,
      W,
      r,
      C ? X : R ? $0(t.setCode) : t.setCode?.toLowerCase() === "3ed" ? Ft : o ? ar : X,
      t.setCode?.toLowerCase() === "lea" ? 0.012 : 0
    );
  }
  if (!l0(e, t)) {
    if (e.shadowColor = o?.statsOpaqueShadow ? "#000" : "#000b", o && (e.shadowOffsetX = e.shadowOffsetY = o.statsShadow * e.getTransform().a), e.fillStyle = gr(t), e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", t.power != null && t.toughness != null) {
      const [W, U, Y, le] = de(s.stats), se = I0(t);
      e.textAlign = se ? "right" : "center", l ? T0(e, Er(t), U + le / 2) : e.fillText(
        Er(t),
        se?.right ?? W + Y / 2,
        U + le / 2 + (se?.yOffset ?? 0),
        se?.maxWidth ?? Y
      );
    }
    if (l && t.artist) M0(e, t.artist);
    else if (t.artist && y0(t)) k0(e, t.artist);
    else if (o) B0(e, t, o);
    else if (t.artist) {
      const [W, U, Y, le] = de(s.footer);
      e.textAlign = "center", e.font = '15.6px "CardRenderer MTG MPlantin", Georgia', e.fillText(`Illus. ${t.artist}`, W + Y / 2, U + le / 2, Y);
    }
    e.shadowColor = "transparent";
  }
}
const O0 = (e, t = {}) => fetch(e, { ...t, mode: "cors" });
let Br;
const j0 = [
  ["CardRenderer MTG Goudy", Ws],
  ["CardRenderer MTG Historic Symbols", Ps]
];
function P0() {
  return typeof FontFace != "function" ? Promise.resolve() : Br ??= Promise.all(
    j0.map(async ([e, t]) => {
      if ([...document.fonts].some(
        (a) => a.family.replace(/^"|"$/g, "") === e && a.status === "loaded"
      ))
        return;
      const r = await O0(t);
      if (!r.ok) throw Error(`Retro font unavailable: ${e}`);
      document.fonts.add(await new FontFace(e, await r.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((e) => {
    throw Br = void 0, e;
  });
}
const W0 = `${Fe}/img/class_level_bg.webp`, Pa = (e) => ["adventure", "class", "leveler"].includes(J(e)), Pe = (e, t, r, a) => ({
  x: e / 63.5 * 488,
  y: t / 88.9 * 680,
  width: r / 63.5 * 488,
  height: a / 88.9 * 680
}), D0 = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function F0(e, t, r, a = 21) {
  const n = e.replace(/\{[^}]+\}/g, "●").split(`
`);
  let s = a;
  for (; s > 8 && n.reduce(
    (o, l) => o + Math.max(1, Math.ceil(l.length * s * 0.53 / t)) * s + 4,
    0
  ) > r; )
    s -= 0.5;
  return s;
}
function wt(e) {
  const t = J(e), r = [], a = (n, s, o, l = {}) => {
    r.push({ kind: n, text: s, ...o, font: F0(s, o.width, o.height), ...l });
  };
  if (t === "adventure") {
    const n = e.faces?.[1];
    if (!n) return [];
    const s = (n.manaSymbols ?? []).map((l) => `{${l}}`).join(""), o = (n.manaSymbols?.length ?? 0) * 2.5;
    a("heading", n.name, Pe(5.6, 55.3, 25 - o, 4.2), {
      color: "white",
      font: Math.min(18, (25 - o) * 488 / 63.5 / Math.max(1, n.name.length * 0.55))
    }), a("rules", s, Pe(30 - o, 55.3, o, 4.2), { color: "white", font: 17 }), a("heading", n.typeLine ?? "", Pe(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (n.typeLine ?? "").length * 0.52))
    }), a("rules", n.rulesText ?? "", Pe(5.6, 64.5, 24.7, 15.6)), a("rules", e.rulesText ?? e.faces?.[0]?.rulesText ?? "", Pe(33, 54.9, 25.5, 25));
  } else if (t === "class") {
    const [n, s, o, l] = ue(e).rules.map(
      (y, w) => y * (w % 2 ? M : S)
    ), i = Z(e);
    a(
      "band",
      "",
      { x: n, y: s, width: o, height: l },
      {
        fill: "#e3d8bb",
        asset: ie(
          "saga_textboxes",
          i.boxes === "Colourless" ? "Land" : i.boxes
        )
      }
    );
    const d = [];
    for (const y of (e.rulesText ?? "").split(`
`).filter(Boolean))
      d.length && !/^.*:\s*Level\s+\d+\s*$/i.test(y) && !/^.*:\s*Level\s+\d+\s*$/i.test(d.at(-1)) && !d.at(-1).startsWith("(") ? d[d.length - 1] += `
` + y : d.push(y);
    const c = (y) => /^.*:\s*Level\s+\d+\s*$/i.test(y), h = 28, u = 20, m = (y, w) => y.split(`
`).reduce(
      (v, C) => v + Math.max(1, Math.ceil(C.length * w * 0.53 / (o - 10))),
      0
    ), g = d.map(
      (y) => c(y) ? h : m(y, y.startsWith("(") ? 16 : u) * (y.startsWith("(") ? 16 : u) + 8
    ), f = d.filter((y) => !c(y)).length, k = Math.max(0, l - g.reduce((y, w) => y + w, 0)) / Math.max(1, f), p = Math.min(
      1,
      (l - d.filter(c).length * h) / g.reduce((y, w, v) => y + (c(d[v]) ? 0 : w), 0)
    );
    let b = s;
    d.forEach((y, w) => {
      const v = c(y), C = v ? h : g[w] * p + k;
      if (v) {
        const [R, x] = y.split(/:\s*/);
        a("band", "", { x: n, y: b, width: o, height: C }, { asset: W0 }), a("rules", R + ":", { x: n + 5, y: b, width: o / 2 - 5, height: C }, { font: 18 }), a(
          "heading",
          x,
          { x: n + o / 2, y: b, width: o / 2 - 5, height: C },
          { font: 18, align: "right" }
        );
      } else
        a(
          "rules",
          y,
          { x: n + 5, y: b + 4, width: o - 10, height: C - 8 },
          { font: (y.startsWith("(") ? 16 : u) * p, italic: y.startsWith("(") }
        );
      b += C;
    });
  } else if (t === "leveler") {
    const n = e.rulesText ?? "", s = n.split(/^LEVEL\s+([^\n]+)\n/gm), o = [
      {
        range: "",
        text: s[0] ?? "",
        stats: e.power != null && e.toughness != null ? `${e.power}/${e.toughness}` : ""
      }
    ];
    for (let c = 1; c < s.length; c += 2) {
      const h = s[c + 1] ?? "", u = h.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      o.push({
        range: s[c],
        stats: u?.[1] ?? "",
        text: u ? h.slice(u[0].length) : h
      });
    }
    const l = Pe(4.9, 55.6, 53.7, 25.5), i = l.height / o.length, d = D0[Z(e).frame] ?? "#dcc8af";
    o.forEach((c, h) => {
      const u = l.y + h * i;
      h && a(
        "band",
        "",
        { x: l.x, y: u, width: l.width, height: i },
        { fill: h % 2 ? "#00000018" : "#00000028" }
      );
      const m = c.range ? 55 : 7, g = c.stats ? 72 : 7;
      a("rules", c.text, {
        x: l.x + m,
        y: u + 4,
        width: l.width - m - g,
        height: i - 8
      }), c.range && a(
        "level",
        `LEVEL
${c.range}`,
        { x: l.x - 12, y: u + i / 2 - 23, width: 65, height: 46 },
        { fill: d, font: 13 }
      ), c.stats && a(
        "stats",
        c.stats,
        { x: l.x + l.width - 68, y: u + i / 2 - 22, width: 77, height: 44 },
        { asset: ie("pt-boxes", Z(e).pt), font: 26 }
      );
    });
  }
  return r;
}
function _0(e) {
  return wt(e).flatMap((t) => [
    t.asset ?? null,
    ...gt(t.text).flatMap((r) => r.symbol ? [ft(r.symbol)] : [])
  ]);
}
function U0(e) {
  if (J(e) === "adventure") {
    const t = e.faces?.[1];
    return t ? [
      t.name,
      t.typeLine,
      t.colors,
      t.frameColors,
      t.manaSymbols,
      t.rulesText,
      t.rulesParagraphs,
      t.rulesAlignment
    ] : null;
  }
  return Pa(e) ? wt(e) : null;
}
function N0(e, t, r) {
  for (const a of wt(t)) {
    const { x: n, y: s, width: o, height: l, font: i } = a;
    e.save(), e.textAlign = "left", e.fillStyle = a.fill ?? "transparent", a.kind === "level" ? (e.beginPath(), e.moveTo(n, s), e.lineTo(n + o * 0.72, s), e.lineTo(n + o, s + l / 2), e.lineTo(n + o * 0.72, s + l), e.lineTo(n, s + l), e.closePath(), e.fill(), e.strokeStyle = "#0008", e.lineWidth = 1, e.stroke()) : a.fill && e.fillRect(n, s, o, l);
    const d = a.asset ? r.get(a.asset) : null;
    if (d && e.drawImage(d, n, s, o, l), e.beginPath(), e.rect(n, s, o, l), e.clip(), e.fillStyle = a.color ?? "#17140f", ["stats", "level"].includes(a.kind)) {
      e.font = `${i}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
      const c = a.text.split(`
`);
      c.forEach(
        (h, u) => e.fillText(
          h,
          n + o * (a.kind === "level" ? 0.43 : 0.5),
          s + l / 2 + (u - (c.length - 1) / 2) * i,
          o * 0.85
        )
      );
    } else if (a.align === "right")
      e.font = `${i}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "right", e.textBaseline = "middle", e.fillText(a.text, n + o, s + l / 2, o);
    else {
      e.font = `${a.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
      const c = Zt(e, a.text, o, i).length * i + (a.text.split(`
`).length - 1) * j.paragraphGap;
      Ca(
        e,
        a.text,
        n,
        s + Math.max(0, (l - c) / 2),
        o,
        { size: i, italic: !!a.italic },
        r
      );
    }
    e.restore();
  }
}
const Y0 = 5, z0 = 0.02655 * M + 0.91339 * S * 3810 / 2736;
function sr(e) {
  const t = e ? 382 : 429;
  return { top: t, scale: 1 - Y0 / (z0 - t) };
}
function H0(e) {
  const { top: t, scale: r } = sr(e);
  return [t + 6, t + (625 - t) * r - 4];
}
function Gr(e, t, r, a, n, s) {
  const { top: o, scale: l } = sr(s), i = t.height * n / t.width, d = Math.max(0, Math.min(i, o - a)), c = d * t.width / n;
  d > 0 && e.drawImage(t, 0, 0, t.width, c, r, a, n, d), d < i && e.drawImage(
    t,
    0,
    c,
    t.width,
    t.height - c,
    r,
    a + d,
    n,
    (i - d) * l
  );
}
function q0(e, t, r) {
  const a = e.rulesParagraphs?.filter((o) => o.role === "rules")[r], n = (e.rulesText ?? "").split(`
`).filter((o) => o.trim())[r];
  if (!a || a.runs.map((o) => o.text).join("") !== n) return [{ text: t }];
  let s = n.length - t.length;
  return a.runs.flatMap((o) => {
    const l = Math.min(s, o.text.length);
    return s -= l, l === o.text.length ? [] : [{ ...o, text: o.text.slice(l) }];
  });
}
function X0(e, t) {
  const r = J(t) === "planeswalker-large", a = et(t), n = !r && a.length < 3, s = ue(t).rules, o = s[0] * S, l = s[1] * M, i = s[2] * S, d = s[3] * M - (r ? 24 : n ? 4 : 16), c = r ? 8 : n ? 3 : 0, h = r ? { ...ht, leading: 0.9 } : ht, u = a.map((T, I) => ({
    ...T,
    runs: q0(t, T.text, I),
    left: T.badges.length ? 67 : 45
  })), m = (T) => u.map(
    (I) => q(
      e,
      [{ role: "rules", runs: I.runs }],
      { x: o + I.left, y: 0, width: i - I.left - 8, height: 1e3 },
      T,
      T,
      h
    )
  );
  let g = r ? 17.5 : n ? 24 : 19, f = m(g);
  const [k, p] = H0(r), b = () => {
    const T = d / Math.max(1, u.length), I = f.map((A, O) => l + c + T * (O + 0.5) - A.height / 2);
    let L = k - 8;
    for (let A = 0; A < I.length; A++)
      I[A] = Math.max(I[A], L + 8), L = I[A] + f[A].height;
    let P = p + 8;
    for (let A = I.length - 1; A >= 0; A--)
      I[A] = Math.min(I[A], P - 8 - f[A].height), P = I[A];
    return I;
  }, y = () => (b()[0] ?? k) >= k, w = () => f.map((T) => Math.max(34, T.height + 16)), v = () => {
    const T = d / Math.max(1, u.length);
    return f.every((I, L) => {
      const P = T * (L + 0.5);
      return P - I.height / 2 >= 6 && P + I.height / 2 <= d + 6 && (!L || T - (I.height + f[L - 1].height) / 2 >= 8);
    });
  };
  for (; g > 8 && (w().reduce((T, I) => T + I, 0) > d || !v() || !y()); )
    g -= 0.25, f = m(g);
  const C = d / Math.max(1, u.length), R = b();
  let x = c;
  return u.map((T, I) => {
    const L = C, P = f[I].height, A = q(
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
    A.overflow ||= x + L > c + d + 0.01, A.overflow ||= !v(), A.overflow ||= !y(), A.overflow ||= A.lines.some(
      (B) => B.inkBounds[1] < k - 0.01 || B.inkBounds[1] + B.inkBounds[3] > p + 0.01
    );
    const O = { ...T, top: x, height: L, font: g, width: A.width, layout: A };
    return x += L, O;
  });
}
function V0(e) {
  return { font: 18, offsetY: e.startsWith("+") ? 2 : e === "0" ? 0 : -2 };
}
function Wa(e, t) {
  return e === "saga" ? /^(I|II|III|IV)$/.test(t) ? ie("saga", t) : null : ie(
    "planeswalker",
    t.startsWith("+") ? "LoyaltyPlus" : t === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function Da(e, t) {
  return J(e) === "saga" ? ie("saga_textboxes", t === "Colourless" ? "Land" : t) : null;
}
function K0(e) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[Z(e).boxes] ?? "#dededbf0";
}
function J0(e, t) {
  const { top: r, scale: a } = sr(J(t) === "planeswalker-large");
  e.save(), e.translate(0, r), e.scale(1, a), e.translate(0, -r), e.beginPath(), e.moveTo(66, r), e.lineTo(448, r), e.quadraticCurveTo(456, r, 456, r + 8), e.lineTo(456, 613), e.bezierCurveTo(456, 623, 420, 629, 257, 629), e.bezierCurveTo(94, 629, 58, 623, 58, 613), e.lineTo(58, r + 8), e.quadraticCurveTo(58, r, 66, r), e.closePath(), e.clip(), e.fillStyle = K0(t), e.fillRect(58, r, 398, 629 - r), e.restore();
}
function Z0(e, t, r) {
  e.fillStyle = "#17140f", e.font = '24px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "alphabetic";
  const a = e.measureText(":");
  e.fillText(
    ":",
    t,
    r + 1.5 + (a.actualBoundingBoxAscent - a.actualBoundingBoxDescent) / 2
  );
}
function Q0(e, t, r) {
  const a = J(t), n = a === "saga", s = ue(t).rules, o = s[0] * S, l = s[1] * M, i = s[2] * S, d = s[3] * M;
  n && (e.fillStyle = "#e3d8bb", e.fillRect(o, l, i, d));
  const c = Da(t, Z(t).boxes), h = c ? r.get(c) : void 0;
  h && e.drawImage(h, o, l, i, d);
  const u = n ? ln(t) : X0(e, t);
  for (const [m, g] of u.entries()) {
    if (m > 0) {
      const p = u[m - 1]?.layout, b = g.layout && p ? Math.max(p.top + p.height + 3, Math.min(l + g.top, g.layout.top - 3)) : l + g.top;
      e.fillStyle = "#0002", e.fillRect(o + (n ? 0 : 40), b, i - (n ? 0 : 40), 1.5);
    }
    if (e.fillStyle = "#17140f", e.textAlign = "left", g.layout) ge(e, g.layout, r);
    else {
      e.font = `${g.reminder ? "italic " : ""}${g.font}px "CardRenderer MTG MPlantin", Georgia`;
      const p = Zt(e, g.text, g.width, g.font).length * g.font;
      Ca(
        e,
        g.text,
        o + g.left,
        l + g.top + (g.height - p) / 2,
        g.width,
        { size: g.font, italic: g.reminder },
        r
      );
    }
    const f = n ? 36 : 54, k = n ? 36 : 40;
    g.badges.forEach((p, b) => {
      const y = o + (n ? -18 : 0), w = l + g.top + g.height / 2 + (b - g.badges.length / 2) * k, v = Wa(a, p), C = v ? r.get(v) : null;
      if (C) {
        if (e.save(), !n) {
          const R = e.getTransform().a;
          e.shadowColor = "#0009", e.shadowBlur = 3 * R, e.shadowOffsetY = 2 * R;
        }
        e.drawImage(C, y, w, f, k), e.restore();
      } else
        e.fillStyle = "#29231c", e.fillRect(y, w, f, k);
      if (!C || !n) {
        e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle";
        const R = V0(p);
        e.font = `bold ${n ? 19 : R.font}px "CardRenderer MTG Beleren", Georgia`, e.fillText(
          p,
          y + f / 2 - (n ? 0 : 1.5),
          w + k / 2 + (n ? 0 : R.offsetY),
          f - 3
        ), n || Z0(e, y + f + 4, w + k / 2);
      }
    });
  }
}
const Fa = 0.7;
function eo(e, t, r, a = !1) {
  const [n, s, o, l] = [
    r[0] * S,
    r[1] * M,
    r[2] * S,
    r[3] * M - 1
  ], i = new Path2D();
  i.moveTo(n + 14, s), i.lineTo(n + o - 14, s), i.quadraticCurveTo(n + o, s, n + o, s + 14), i.lineTo(n + o, s + l - 7), i.quadraticCurveTo(n + o, s + l, n + o - 7, s + l), i.lineTo(n + 9, s + l), i.quadraticCurveTo(n - 2, s + l, n - 2, s + l - 9), i.quadraticCurveTo(n - 2, s + 17, n + 2, s + 9), i.quadraticCurveTo(n + 5, s, n + 14, s), i.closePath(), e.save();
  const d = e.getTransform().a;
  e.shadowColor = "#0009", e.shadowBlur = 1.4 * d, e.shadowOffsetX = -1.2 * d, e.shadowOffsetY = 3.5 * d, e.fillStyle = "#191816", e.fill(i), e.shadowColor = "transparent", e.save(), e.clip(i);
  const c = t.width / o, h = [
    20 * c,
    t.height - (l - 4) * c,
    t.width - 40 * c,
    (l - 12) * c,
    n - 2,
    s,
    o + 2,
    l
  ];
  e.drawImage(t, ...h), a && (e.globalAlpha *= Fa, e.drawImage(t, ...h)), e.restore(), e.strokeStyle = "#191816", e.lineWidth = 1.2, e.stroke(i), e.restore();
}
const to = 1.1;
function _a(e) {
  return !e.setSymbol && ["m19", "m20", "m21"].includes(e.setCode?.toLowerCase() ?? "");
}
function Ua(e, t, r, a, n, s, o, l, i = 1) {
  const d = !r || r === "common", c = document.createElement("canvas"), h = 2, u = 4;
  c.width = Math.ceil((s + h * 2) * u), c.height = Math.ceil((o + h * 2) * u);
  const m = c.getContext("2d");
  m.scale(u, u), m.translate(h, h), m.drawImage(
    t,
    l[0] * t.width,
    l[1] * t.height,
    l[2] * t.width,
    l[3] * t.height,
    0,
    0,
    s,
    o
  ), m.globalCompositeOperation = "source-in";
  const g = r === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : r === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], f = m.createLinearGradient(0, o * 0.65, s, o * 0.35);
  f.addColorStop(0, g[0]), f.addColorStop(0.35, g[1]), f.addColorStop(0.6, g[2]), f.addColorStop(1, g[3]), m.fillStyle = d ? "#111111" : f, m.fillRect(0, 0, s, o), m.beginPath(), m.moveTo(s * 0.046, 0), m.lineTo(s * 0.953, 0), m.bezierCurveTo(
    s * 1.016,
    o * 0.38,
    s * 1.016,
    o * 0.62,
    s * 0.953,
    o
  ), m.lineTo(s * 0.046, o), m.bezierCurveTo(-s * 0.017, o * 0.62, -s * 0.017, o * 0.38, s * 0.046, 0), m.closePath(), m.globalCompositeOperation = "destination-over", m.fillStyle = d ? "#f8f8f5" : "#111111", m.fill(), m.globalCompositeOperation = "source-over", m.strokeStyle = d ? "#f8f8f5" : "#111111", m.lineWidth = i, m.stroke(), e.drawImage(
    c,
    a - h,
    n - h,
    c.width / u,
    c.height / u
  ), c.width = c.height = 0;
}
const We = (e) => [
  e[0] * S,
  e[1] * M,
  e[2] * S,
  e[3] * M
];
function ro(e, t, r, a, n) {
  const s = Jt(t);
  if (!s) throw Error("Missing replacement frame family.");
  const o = (E) => {
    const N = r.get(E);
    if (!N) throw Error(`Replacement frame asset unavailable: ${E}`);
    return N;
  }, { rects: l } = s, i = t.frameAssetFamily === "eighth";
  if (e.save(), e.fillStyle = fe(t.setCode, t.borderColor).border, e.fillRect(0, 0, S, M), a && e.drawImage(a, 0, 0, S, M), ye(e, t, r, We(l.art), n), n === "artwork") {
    e.restore();
    return;
  }
  if (e.drawImage(o(s.frame), 0, 0, S, M), s.rightFrame) {
    const E = document.createElement("canvas");
    E.width = 732, E.height = 1020;
    const N = E.getContext("2d");
    N.drawImage(o(s.rightFrame), 0, 0, E.width, E.height);
    const G = document.createElement("canvas");
    G.width = E.width, G.height = E.height;
    const oe = G.getContext("2d"), ae = (me, Se) => {
      const K = oe.createLinearGradient(G.width * me, 0, G.width * Se, 0);
      return K.addColorStop(0, "#0000"), K.addColorStop(1, "#000"), K;
    };
    oe.fillStyle = ae(0.47, 0.53), oe.fillRect(0, 0, G.width, G.height);
    const Be = i ? [0.08, 0.627, 0.84, 0.29] : [0.071, 0.629, 0.858, 0.294], [xe, be, Q, W] = Be, U = xe * G.width, Y = be * G.height, le = Q * G.width, se = W * G.height;
    oe.clearRect(U, Y, le, se), oe.fillStyle = ae(0.27, 0.73), oe.fillRect(U, Y, le, se), N.globalCompositeOperation = "destination-in", N.drawImage(G, 0, 0), e.drawImage(E, 0, 0, S, M), E.width = E.height = 0, G.width = G.height = 0;
  }
  const d = fe(t.setCode, t.borderColor);
  if (d.border !== "#090806") {
    const E = document.createElement("canvas");
    E.width = 732, E.height = 1020;
    const N = E.getContext("2d");
    N.drawImage(o(s.border), 0, 0, E.width, E.height), N.globalCompositeOperation = "source-in", N.fillStyle = d.border, N.fillRect(0, 0, E.width, E.height), e.drawImage(E, 0, 0, S, M), E.width = E.height = 0;
  }
  e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const c = i ? "CardRenderer MTG Matrix" : "CardRenderer MTG Beleren", [h, u, m, g] = We(l.title), f = t.manaSymbols ?? [], { size: k, gap: p } = s.mana, b = s.mana.right * S, y = f.length * k + Math.max(0, f.length - 1) * p;
  e.font = `bold ${s.titleSize}px "${c}", Georgia`, te(
    e,
    t.name,
    h,
    u + g / 2,
    f.length ? b - y - h - 8 : m,
    s.titleSize,
    !0,
    1,
    c
  ), f.forEach(
    (E, N) => X(
      e,
      E,
      b - y + N * (k + p),
      s.mana.center * M - k / 2,
      k,
      r,
      !0
    )
  );
  const w = ee(t), v = r.get(w ?? ""), C = Ee(t), R = v ? Math.min(
    s.symbol.width * S / (v.width * C[2]),
    s.symbol.height * M / (v.height * C[3])
  ) : 0, x = v ? v.width * C[2] * R : 0, T = v ? v.height * C[3] * R : 0, I = e0(t, w, [
    s.symbol.right * S - x,
    s.symbol.center * M - T / 2,
    x,
    T
  ]), [L, P, A, O] = We(l.type);
  if (e.font = `bold ${s.typeSize}px "${c}", Georgia`, te(
    e,
    t.typeLine ?? "",
    L,
    P + O / 2,
    v ? I[0] - L - 7 : A,
    s.typeSize,
    !0,
    1,
    c
  ), v) {
    const E = La(t);
    pe(w) || t.setSymbol ? e.drawImage(v, ...I) : _a(t) ? Ua(e, v, t.rarity, ...I, C, 1.5) : E ? $a(e, v, E, t.rarity, ...I, C, !1) : Ie(e, v, t.setCode, t.rarity, ...I, C);
  }
  if (ge(e, Ra(e, t), r), t.power != null && t.toughness != null && e.drawImage(o(s.pt), ...We(l.stats)), i) {
    nn(e, t, r), e.restore();
    return;
  }
  if (t.power != null && t.toughness != null) {
    const [E, N, G, oe] = We(l.stats);
    e.font = `bold 25px "${c}", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(`${t.power}/${t.toughness}`, E + G * 0.52, N + oe * 0.52, G * 0.85);
  }
  const [B, V, re] = We(l.footer);
  e.textAlign = "left", e.textBaseline = "top", e.fillStyle = "#fff", e.font = `12px "${c}", Georgia`, e.fillText(t.artist ?? "", B, V, re), t.legalText && (e.font = '9px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, B, V + 15, re)), e.restore();
}
let Or = null;
function ao(e) {
  return e.frameAssetFamily !== "eighth" ? Promise.resolve() : Or ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 29px "CardRenderer MTG Matrix Small Caps"')
  ]).then((t) => {
    if (t.some((r) => !r.length || r.some((a) => a.status !== "loaded")))
      throw Error("Replacement Eighth Edition frames need card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw Or = null, t;
  });
}
function so(e, t, [r, a, n, s]) {
  const o = t.height * n / t.width;
  e.save(), e.beginPath(), e.rect(r, a, n, s / 2), e.clip(), e.drawImage(t, r, a + s - o + 1, n, o), e.restore();
}
function no(e, [t, r, a, n], s) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(s)) return;
  e.save(), e.shadowColor = "transparent";
  const o = e.createLinearGradient(t, 0, t + a, 0);
  o.addColorStop(0, "rgba(255,255,255,0)"), o.addColorStop(0.025, "rgba(255,255,255,0.2)"), o.addColorStop(0.975, "rgba(255,255,255,0.2)"), o.addColorStop(1, "rgba(255,255,255,0)"), e.fillStyle = o, e.fillRect(t, r + n - 4, a, 2.3), e.restore();
}
const oo = "symbol-svg-v3", lo = { "m15-u": { sha256: "bfd962ff9640a846e5690d76c0fe88324e9d49cb6771744b5ab8f34f7afe7362", recipe: "m15" }, "m15-r": { sha256: "933756b97cebe7389ff7cee219a34b1ac13bc504743a2be037a286ee5ffc4b0d", recipe: "m15" }, "m15-m": { sha256: "6e9f87473f1ed8ecb05647fbde6f13e22faeab18fe56b8f76cfa1759bb4210e7", recipe: "m15" }, "8ed-u": { sha256: "6c20e8da28fdd5cdb030814e5c1339978f276c77f4ad9d99ca816adb8d970880", recipe: "8ed" }, "8ed-r": { sha256: "eccde74c56b4810434ecdf4e99206046d6970ea601e4fed2f73eb2ee855053a2", recipe: "8ed" }, "9ed-u": { sha256: "acb7ea7f3422f50dca2aef4e07aa3977aa1641ff2cb54f6eb64ae1bc17abbf53", recipe: "9ed" }, "9ed-r": { sha256: "c1cbcc1aea4f032c5f2ccf7f1d63073813bf9c6f050ba2f5385170ff3deca8a5", recipe: "9ed" }, "7ed-u": { sha256: "94c67d433ba3012f3aa1c494a7ef0ae1e7de58ce4614dfd50ee8f52de527d7e4", recipe: "white-outer-rim" }, "7ed-r": { sha256: "8b30917e85b2c9c3549bfa6c2f62261801df33ff7debcc138bf89c4a9ba9689f", recipe: "white-outer-rim" } }, Na = {
  revision: oo,
  sources: lo
}, jr = `${F}/img/setSymbols/official/`, Pr = Na.sources;
function Ya(e) {
  if (!e.startsWith(jr) || !e.endsWith(".svg")) return;
  const t = e.slice(jr.length, -4);
  return Object.hasOwn(Pr, t) ? Pr[t] : void 0;
}
function io(e) {
  return !!Ya(e);
}
async function co(e, t) {
  const r = Ya(e);
  if (!r) return t;
  const a = await t.arrayBuffer();
  if ([...new Uint8Array(await crypto.subtle.digest("SHA-256", a))].map((h) => h.toString(16).padStart(2, "0")).join("") !== r.sha256) throw Error(`Unexpected pinned symbol checksum: ${e}`);
  const o = new DOMParser().parseFromString(new TextDecoder().decode(a), "image/svg+xml"), l = o.documentElement, i = [...l.querySelectorAll("path")], d = l.querySelector("linearGradient, radialGradient");
  if (l.localName !== "svg" || o.querySelector("parsererror") || !d)
    throw Error(`Unexpected pinned symbol SVG: ${e}`);
  const c = (h, u) => {
    for (const [m, g] of Object.entries(u)) h.setAttribute(m, g);
  };
  if (r.recipe === "white-outer-rim") {
    if (i.length !== 3) throw Error("Unexpected rimmed symbol topology.");
    i[0].setAttribute("fill", "#fff");
  } else if (r.recipe === "m15") {
    if (i.length !== 6) throw Error("Unexpected M15 path topology.");
    c(i[0], { fill: `url(#${d.id})`, stroke: "#000", "stroke-width": "8" });
    for (const h of i.slice(1)) h.setAttribute("fill", "#000");
  } else if (r.recipe === "8ed" || r.recipe === "9ed") {
    if (i.length !== 4) throw Error("Unexpected numeric shield path topology.");
    const h = i[2], u = h.parentElement?.getAttribute("transform");
    if (!u) throw Error("Missing numeric shield coordinate transform.");
    if (i[0].setAttribute("fill", "#000"), i[3].setAttribute("fill", "#000"), r.recipe === "9ed") {
      const m = d.cloneNode(!0);
      c(m, {
        id: "glint-root-metal",
        gradientTransform: `${u} ${d.getAttribute("gradientTransform") ?? ""}`
      }), d.after(m), c(i[3], {
        stroke: "url(#glint-root-metal)",
        "stroke-width": "12",
        "paint-order": "stroke fill"
      });
    }
  } else throw Error(`Unknown symbol SVG patch recipe: ${r.recipe}`);
  return l.setAttribute("data-card-glint-patch", Na.revision), new Blob([new XMLSerializer().serializeToString(o)], { type: "image/svg+xml" });
}
const Ce = /* @__PURE__ */ new Map();
function za(e) {
  if (!(!e.retired || e.users)) {
    if (!e.sources) {
      e.controller.abort();
      return;
    }
    URL.revokeObjectURL(e.sources.original), e.sources.backing && URL.revokeObjectURL(e.sources.backing), e.sources = void 0;
  }
}
function Eo() {
  for (const e of Ce.values())
    e.retired = !0, za(e);
  Ce.clear();
}
async function ho(e, t) {
  t.throwIfAborted();
  let r = Ce.get(e);
  if (!r) {
    const i = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const d = await fetch(e, { mode: "cors", signal: i.controller.signal });
        if (!d.ok) throw Error(`Symbol source ${d.status}: ${e}`);
        const c = await co(e, await d.blob()), h = await f0(e, c);
        i.controller.signal.throwIfAborted();
        const u = URL.createObjectURL(c);
        try {
          const m = { original: u, backing: h ? URL.createObjectURL(h) : void 0 };
          return i.sources = m, m;
        } catch (m) {
          throw URL.revokeObjectURL(u), m;
        }
      })
    };
    i.promise = i.promise.catch((d) => {
      throw Ce.get(e) === i && Ce.delete(e), d;
    }), Ce.set(e, i), r = i;
  }
  r.users++;
  const a = r;
  let n = !1;
  const s = () => {
    n || (n = !0, a.users--, !a.users && !a.sources && (a.retired = !0, Ce.get(e) === a && Ce.delete(e)), za(a));
  };
  let o = () => {
  };
  const l = new Promise((i, d) => {
    o = () => {
      s(), d(t.reason);
    }, t.addEventListener("abort", o, { once: !0 });
  });
  try {
    const i = await Promise.race([a.promise, l]);
    return t.throwIfAborted(), { sources: i, release: s };
  } catch (i) {
    throw s(), i;
  } finally {
    t.removeEventListener("abort", o);
  }
}
async function uo(e, t) {
  t.throwIfAborted();
  const r = [...new Set(e.filter((i) => !!i))], a = [], n = /* @__PURE__ */ new Map(), s = () => {
    for (const i of a) i.release();
    a.length = 0;
  }, l = (await Promise.allSettled(
    r.map(async (i) => {
      if (!g0(i) && !io(i)) {
        n.set(i, i);
        return;
      }
      const d = await ho(i, t);
      a.push(d), n.set(i, d.sources.original), d.sources.backing && n.set(Ea(i), d.sources.backing);
    })
  )).find((i) => i.status === "rejected");
  if (l?.status === "rejected")
    throw s(), l.reason;
  return t.aborted && (s(), t.throwIfAborted()), { urls: [...new Set(n.values())], aliases: n, dispose: s };
}
function mo(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const [a, n] of e) {
    const s = t.get(n);
    s && r.set(a, s);
  }
  return r;
}
async function go(e, t) {
  return t.throwIfAborted(), fetch(e, { signal: t, mode: "cors" });
}
function fo(e) {
  if (e.startsWith(F) && /\/saga\/(sagaChapter|sagaDivider|sagaMidStripe|stamp)\.png$/.test(e))
    return;
  if (e.startsWith(`${F}/data/images/cardImages/saga/`)) return 768;
  if (e.startsWith(`${F}/img/frames/`) && e.endsWith(".png"))
    return /\/pt\/|\/m15PT/.test(e) ? 256 : 768;
  if (e.startsWith(`${_e}/img/frames/`) && e.endsWith(".png")) return 768;
  const t = e.startsWith(`${Fe}/img/`) ? e.slice(`${Fe}/img/`.length) : "";
  return t === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    t
  ) ? 768 : void 0;
}
async function po(e) {
  if (!e.type.includes("svg")) return e;
  const t = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), r = t.documentElement;
  if (r.localName !== "svg" || t.querySelector("parsererror"))
    throw new Error("Invalid SVG asset.");
  const a = (r.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), n = a[2] ?? parseFloat(r.getAttribute("width") ?? ""), s = a[3] ?? parseFloat(r.getAttribute("height") ?? "");
  if (!(n > 0 && s > 0 && Number.isFinite(n + s)))
    throw new Error("SVG asset needs a finite viewport.");
  const o = 512 / Math.max(n, s);
  return r.hasAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${n} ${s}`), r.setAttribute("width", String(Math.max(1, Math.round(n * o)))), r.setAttribute("height", String(Math.max(1, Math.round(s * o)))), new Blob([new XMLSerializer().serializeToString(r)], { type: "image/svg+xml" });
}
async function bo(e, t, r) {
  if (t.throwIfAborted(), !e.type.includes("svg"))
    return r ? createImageBitmap(e, { resizeWidth: r, resizeQuality: "high" }) : createImageBitmap(e);
  const a = URL.createObjectURL(await po(e)), n = new Image(), s = document.createElement("canvas"), o = () => {
    n.src = "";
  };
  t.addEventListener("abort", o, { once: !0 });
  try {
    t.throwIfAborted(), n.src = a, await n.decode(), t.throwIfAborted(), s.width = n.naturalWidth, s.height = n.naturalHeight;
    const l = s.getContext("2d", { willReadFrequently: !0 });
    if (!l || !s.width || !s.height)
      throw new Error("SVG asset could not be rasterized.");
    return l.drawImage(n, 0, 0), await createImageBitmap(s);
  } finally {
    t.removeEventListener("abort", o), n.src = "", URL.revokeObjectURL(a), s.width = 0, s.height = 0;
  }
}
async function Ha(e, t) {
  const r = await uo(e, t), a = r.urls, n = /* @__PURE__ */ new Map();
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, a.length) }, async () => {
        for (; s < a.length && !t.aborted; ) {
          const l = a[s++];
          try {
            const i = await go(l, t);
            if (!i.ok) continue;
            const d = await i.blob(), c = await bo(d, t, fo(l));
            t.aborted ? c.close() : n.set(l, c);
          } catch {
          }
        }
      })
    );
  } finally {
    r.dispose();
  }
  const o = mo(r.aliases, n);
  return {
    images: o,
    dispose: () => {
      for (const l of n.values()) l.close();
      n.clear(), o.clear();
    }
  };
}
function qa(e) {
  if (bt(e))
    return [
      ...ya(e),
      e.illustration,
      ee(e),
      ...ve(e),
      ...ve(e.faces[1])
    ];
  if (Ke(e))
    return [
      ...Ms(e),
      ...he(e).flatMap((o) => [
        o.face.illustration,
        ...ve(o.face)
      ]),
      ee(he(e)[0].face)
    ];
  const t = Te(e);
  if (t)
    return he(e).flatMap((o, l) => [
      ...Mn(o.face, t, Je(e) && t === "eighth", l),
      o.face.illustration,
      ee(o.face),
      ...ve(o.face)
    ]);
  const r = on(e);
  if (r) return [...r, e.illustration, ee(e), ...ve(e)];
  if (ke(e)) return Ns(e);
  if (J(e) === "saga")
    return [...ks(e), e.illustration, ee(e), ...ve(e)];
  const a = he(e);
  if (a.length) return a.flatMap((o) => qa(o.face));
  const n = Z(e), s = Ht(n, J(e));
  return [
    ..._0(e),
    s.background,
    s.frame,
    s.boxes,
    s.pt,
    Da(e, n.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(J(e)) ? et(e).flatMap(
      (o) => o.badges.map((l) => Wa(J(e), l))
    ) : [],
    n.legendary ? s.crown : null,
    e.illustration,
    ee(e),
    ...ve(e)
  ];
}
let Wr = null;
function Dr() {
  return Wr ??= Promise.all([
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
    throw Wr = null, e;
  });
}
function nt(e) {
  return ue(e).art;
}
const Fr = /* @__PURE__ */ new WeakMap(), ot = ([e, t, r, a]) => [e, 1 - t - a, e + r, 1 - t], wo = [ot(ue({}).art), [0, 0, 0, 0]];
function Bo(e) {
  if (!e) return wo;
  const t = Fr.get(e);
  if (t) return t;
  const r = he(e), a = r.length ? [
    ot(kr(r[0], nt(r[0].face))),
    ot(kr(r[1], nt(r[1].face)))
  ] : [ot(nt(e)), [0, 0, 0, 0]];
  return Fr.set(e, a), a;
}
async function yo(e, t, r, a, n, s, o = Ha, l) {
  return Xa(e, t, r, a, {
    threshold: n,
    resolveEtching: l,
    beforePaint: s,
    loadImages: o,
    height: M
  });
}
async function Xa(e, t, r, a, n) {
  const { threshold: s, beforePaint: o, loadImages: l, height: i } = n, d = he(t);
  if (d.length) {
    for (const w of d)
      e.save(), Ta(e, w), await Xa(e, w.face, r, a, {
        ...n,
        height: w.height * S / w.width
      }), e.restore();
    return;
  }
  if (t.illustration && n.resolveEtching) {
    let w;
    try {
      const v = await n.resolveEtching(t, r, a, s, o);
      w = await l([v, t.illustration], a);
      const C = w.images.get(v ?? "");
      if (C && !a.aborted) {
        await o?.(), a.throwIfAborted();
        const [R, x, T, I] = ue(t).art, L = R * S, P = x * i, A = T * S, O = I * i, B = w.images.get(t.illustration) ?? C;
        e.save(), e.beginPath();
        const V = nt(t);
        if (e.rect(
          V[0] * S,
          V[1] * i,
          V[2] * S,
          V[3] * i
        ), e.clip(), e.imageSmoothingQuality = "low", t.illustrationCrop) {
          const re = t.illustrationCrop, E = ut(B.width * re[2], B.height * re[3], [
            L,
            P,
            A,
            O
          ]);
          e.drawImage(
            C,
            re[0] * C.width,
            re[1] * C.height,
            re[2] * C.width,
            re[3] * C.height,
            ...E
          );
        } else
          e.drawImage(
            C,
            ...ut(B.width, B.height, [L, P, A, O])
          );
        e.restore();
      }
    } catch {
    } finally {
      w?.dispose();
    }
  }
  if (a.throwIfAborted(), !t.setCode) return;
  const [c, h, u, m] = ue(t).stamp, g = c * S, f = h * i, k = u * S, p = m * i, b = ee(t, "common"), y = await l([b], a);
  try {
    await o?.(), a.throwIfAborted();
    const w = b ? y.images.get(b) : null;
    if (e.save(), e.globalAlpha = 0.68, w) {
      const v = Math.min(k / w.width, p / w.height);
      e.drawImage(
        w,
        g + (k - w.width * v) / 2,
        f + (p - w.height * v) / 2,
        w.width * v,
        w.height * v
      );
    } else
      e.translate(g, f), e.scale(k / 100, p / 100), e.fillStyle = "white", e.fill(new Path2D(ps)), e.font = "bold 43px Georgia", e.textAlign = "center", e.textBaseline = "alphabetic", e.fillText(ys(t.setCode), 50, 65);
    e.restore();
  } finally {
    y.dispose();
  }
}
function ko(e) {
  return e.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const So = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, _r = /* @__PURE__ */ new WeakMap();
function vo(e, t) {
  let r = _r.get(t);
  if (r || (r = new Path2D(t.path), _r.set(t, r)), e.save(), t.viewBox) {
    const [a, n, s, o] = t.viewBox;
    e.scale(24 / s, 24 / o), e.translate(-a, -n);
  }
  t.transform && e.transform(...t.transform), t.filled ? (e.fillStyle = e.strokeStyle, e.fill(r)) : e.stroke(r), e.restore();
}
function Ur(e, t, r, a, n = !1) {
  const s = S * 0.105, o = S * 0.015, l = Math.floor(S * 0.9 / (s + o));
  if (t.forEach((m, g) => {
    e.save(), e.translate(
      S * 0.05 + g % l * (s + o),
      M * 0.13 + Math.floor(g / l) * (s + o)
    ), e.fillStyle = "#17201fed", e.strokeStyle = "#c6af7977", e.lineWidth = 1, e.beginPath(), e.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2), e.fill(), e.stroke(), e.translate(s * 0.14, s * 0.14), e.scale(s * 0.72 / 24, s * 0.72 / 24), e.strokeStyle = "#f3e9cf", e.lineWidth = 1.8, e.lineCap = "round", e.lineJoin = "round", vo(e, m), e.restore();
  }), r?.power == null || r.toughness == null) return;
  e.save();
  const i = So[n ? "inspect" : "table"], d = S * i.width, c = M * i.height, h = S * (1 - i.right - i.width), u = M * (1 - i.bottom - i.height);
  a ? e.drawImage(a, h, u, d, c) : (e.fillStyle = "#eee5cf", e.strokeStyle = "#746854", e.lineWidth = 2, e.beginPath(), e.roundRect(
    h + d * (n ? 0.14 : 0.1),
    u + c * (n ? 0.19 : 0.18),
    d * (n ? 0.72 : 0.8),
    c * (n ? 0.62 : 0.64),
    c * 0.12
  ), e.fill(), e.stroke()), e.font = `bold ${S * (n ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
    `${r.power}/${r.toughness}`,
    h + d / 2,
    n ? u + c / 2 - S * 0.01 : u + c * 0.48,
    d * 0.72
  ), e.restore();
}
function Go(e) {
  return e.currentStats?.power != null && e.currentStats.toughness != null && e.statusLayout !== "inspect" ? { ...e, statusLayout: "inspect" } : e;
}
function Oo(e, t) {
  if (e.custom)
    return JSON.stringify([
      "custom-face-v1",
      e.custom.key,
      t,
      e.layer ?? "face",
      e.layer === "etching" ? e.etchThreshold ?? 20 : null
    ]);
  const r = e.face, a = Va(r, e.layer === "etching"), n = e.currentStats?.power != null && e.currentStats.toughness != null ? [e.currentStats.power, e.currentStats.toughness] : null;
  return JSON.stringify([
    Fe,
    F,
    "canvas-face-v100",
    e.paintLayer ?? null,
    t,
    e.printingId,
    e.layer === "etching" ? null : e.printedImage,
    a,
    e.layer ?? "face",
    e.layer === "etching" ? e.etchThreshold ?? 14 : null,
    e.layer === "etching" ? null : [
      (e.emblems ?? []).map((s) => [
        s.path,
        s.viewBox ?? null,
        s.transform ?? null,
        !!s.filled
      ]),
      n,
      n ? e.statusLayout ?? t : null
    ]
  ]);
}
function Va(e, t) {
  const r = he(e);
  return r.length ? [
    e.layout,
    e.artist ?? null,
    e.collectorNumber ?? null,
    e.legalText ?? null,
    e.borderColor ?? null,
    r.map((a) => [a.x, a.y, a.width, a.height, a.rotation, Va(a.face, t)]),
    !t && Qt(e),
    !t && ma(e)
  ] : t ? [
    e.illustration ?? null,
    e.etchedIllustration ?? null,
    e.illustrationCrop ?? null,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    ue(e)
  ] : [
    ke(e) ? [$e(e), we(e)] : null,
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
    U0(e),
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
    ue(e),
    Z(e)
  ];
}
function Co(e) {
  const t = document.createElement("canvas");
  return t.width = e === "table" ? 244 : 732, t.height = e === "table" ? 340 : 1020, t;
}
async function jo(e, t, r, a) {
  if (e.custom)
    return await a?.beforePaint?.(), r.throwIfAborted(), e.custom.compose(t, r, e.layer ?? "face", e.etchThreshold);
  const n = a?.loadImages ?? Ha, s = Co(t);
  try {
    const o = s.getContext("2d", {
      willReadFrequently: !!a?.cpuPixels
    });
    if (!o) throw new Error("Card composition needs Canvas2D.");
    if (o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "high", o.scale(s.width / S, s.height / M), e.layer === "etching")
      return await yo(
        o,
        e.face,
        e.printingId,
        r,
        e.etchThreshold,
        a?.beforePaint,
        n,
        a?.resolveEtching
      ), s;
    o.fillStyle = "#090806", o.fillRect(0, 0, S, M);
    const l = e.currentStats?.power != null && e.currentStats.toughness != null ? Ht(Z(e.face)).pt : null;
    if (e.printedImage) {
      const c = t === "inspect" ? ko(e.printedImage) : e.printedImage;
      l && await (a?.loadFonts ?? Dr)();
      const h = await n(l ? [c, l] : [c], r);
      try {
        const u = h.images.get(c);
        if (u && !r.aborted)
          return await a?.beforePaint?.(), r.throwIfAborted(), o.drawImage(u, 0, 0, S, M), Ur(
            o,
            e.emblems ?? [],
            e.currentStats,
            l ? h.images.get(l) : void 0,
            e.statusLayout === "inspect" || t === "inspect"
          ), Nr(o, e.face), s;
      } finally {
        h.dispose();
      }
    }
    await Promise.all([
      (a?.loadFonts ?? Dr)(),
      Te(e.face) ? On(e.face) : ao(e.face),
      J(e.face) === "saga" ? Dn() : Promise.resolve(),
      bt(e.face) ? bn() : Promise.resolve(),
      ke(e.face) || Te(e.face) === "old" ? (a?.loadRetroFont ?? P0)() : Promise.resolve()
    ]), r.throwIfAborted();
    const i = await n(qa(e.face), r);
    let d;
    try {
      return e.paintLayer !== "artwork" && (d = await Vn(e.face, i.images, r)), await a?.beforePaint?.(), r.throwIfAborted(), Ka(
        o,
        e.face,
        d?.images ?? i.images,
        M,
        !1,
        a?.underArt,
        e.paintLayer
      ), Ur(
        o,
        e.emblems ?? [],
        e.currentStats,
        l ? i.images.get(l) : void 0,
        e.statusLayout === "inspect" || t === "inspect"
      ), Nr(o, e.face), s;
    } finally {
      d?.dispose(), i.dispose();
    }
  } catch (o) {
    throw s.width = s.height = 0, o;
  }
}
function Nr(e, t) {
  e.save(), e.setTransform(
    e.canvas.width / S,
    0,
    0,
    e.canvas.height / M,
    0,
    0
  ), e.globalCompositeOperation = "destination-in", e.globalAlpha = 1, e.shadowColor = "transparent", e.filter = "none", e.fillStyle = "#000", e.beginPath(), e.roundRect(0, 0, S, M, r0(t) * S), e.fill(), e.restore();
}
function Ka(e, t, r, a = M, n = !1, s, o) {
  if (bt(t)) {
    Sn(e, t, r, s, o);
    return;
  }
  if (Ke(t)) {
    _n(e, t, r, s, o);
    return;
  }
  if (Te(t)) {
    Gn(e, t, r, s, o);
    return;
  }
  if (t.frameAssetFamily) {
    ro(e, t, r, s, o);
    return;
  }
  if (ke(t)) {
    G0(e, t, r, s, o);
    return;
  }
  if (J(t) === "saga") {
    Wn(e, t, r, s, o);
    return;
  }
  const l = he(t);
  if (l.length) {
    e.fillStyle = fe(t.setCode, t.borderColor).border, e.fillRect(0, 0, S, M);
    for (const $ of l)
      e.save(), Ta(e, $), Ka(
        e,
        $.face,
        r,
        $.height * S / $.width,
        !0,
        s,
        o
      ), e.restore();
    if (o === "artwork") return;
    Yr(e, t), Qt(t) && (e.font = '14px "CardRenderer MTG MPlantin", Georgia', e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      S / 2,
      M - 12,
      S * 0.9
    ));
    return;
  }
  const i = ($) => [
    $[0] * S,
    $[1] * a,
    $[2] * S,
    $[3] * a
  ];
  e.fillStyle = fe(t.setCode, t.borderColor).border, e.fillRect(0, 0, S, a);
  const d = ue(t), c = J(t);
  if (o === "artwork") {
    ye(e, t, r, i(d.art), o);
    return;
  }
  const h = Z(t), u = Ht(h, c), g = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[h.boxes] ?? "#827d72", f = ($, D, ne = "top") => {
    const Ge = r.get($);
    if (!Ge) return !1;
    const [ze, yt, kt, St] = i(D);
    e.save(), e.beginPath(), e.rect(ze, yt, kt, St), e.clip();
    const or = ne === "stretch" ? St : Ge.height * kt / Ge.width;
    return e.drawImage(
      Ge,
      ze,
      ne === "bottom" ? yt + St - or : yt,
      kt,
      or
    ), e.restore(), !0;
  }, [k, p, b, y] = i(h.legendary ? d.legendaryBackground : d.background);
  if (e.save(), e.beginPath(), e.roundRect(k, p, b, y, [
    { x: b * 0.01282, y: y * 962e-5 },
    { x: b * 0.01282, y: y * 962e-5 },
    { x: b * 0.06838, y: y * 0.05128 },
    { x: b * 0.06838, y: y * 0.05128 }
  ]), e.clip(), n) {
    const $ = g.slice(1).match(/../g).map(
      (D, ne) => Math.round(parseInt(D, 16) * 0.62 + [244, 236, 217][ne] * 0.38)
    );
    e.fillStyle = `rgb(${$.join(",")})`, e.fillRect(k, p, b, y);
  }
  const w = r.get(u.background), v = c.startsWith("planeswalker");
  if (w && v ? Gr(e, w, k, p, b, c === "planeswalker-large") : w ? e.drawImage(
    w,
    k,
    p + (h.legendary ? j.legendaryBackgroundLift : 0),
    b,
    n ? y : w.height * b / w.width
  ) : (e.fillStyle = g, e.fillRect(k, p, b, y)), e.restore(), e.fillStyle = "#e3d8bb", !r.has(u.frame))
    if (c === "adventure")
      for (const $ of wt(t).filter((D) => D.kind === "rules" && !D.color))
        e.fillRect($.x, $.y, $.width, $.height);
    else e.fillRect(...i(d.rules));
  r.has(u.boxes) || (e.fillRect(...i(d.title)), e.fillRect(...i(d.type))), e.fillStyle = "#80745c", v || e.fillRect(...i(d.art));
  const C = r.get(u.frame);
  if (C && c === "normal" && !n) {
    const $ = an(t);
    n0(
      e,
      h,
      $,
      () => zr(e, C, h.legendary, d.frame, !0, $)
    ), s0(e, h, $);
  }
  if (s && (e.save(), e.beginPath(), e.rect(0, 0, S, a), e.clip(), e.resetTransform(), e.drawImage(s, 0, 0, e.canvas.width, e.canvas.height), e.restore()), c === "normal" && !n) {
    const [$, D, ne, Ge] = i(d.art), ze = Ve.artRim;
    e.fillStyle = "#090806", e.fillRect($ - ze, D, ne + 2 * ze, Ge);
  }
  if (ye(e, t, r, i(d.art), o), v && J0(e, t), C && v) {
    const [$, D, ne] = i(d.frame);
    Gr(e, C, $, D, ne, c === "planeswalker-large");
  } else C && c !== "normal" && zr(e, C, h.legendary, d.frame);
  if (h.legendary && f(u.crown, d.crown), n) {
    const $ = r.get(u.boxes);
    if ($) {
      const ne = $.height * 0.104;
      e.drawImage($, 0, 0, $.width, ne, ...i(d.title)), e.drawImage($, 0, $.height - ne, $.width, ne, ...i(d.type));
    }
    const D = r.get(u.frame);
    e.fillStyle = "#e3d8bb", e.fillRect(...i(d.rules)), D && e.drawImage(
      D,
      D.width * 0.035,
      D.height * 0.675,
      D.width * 0.93,
      D.height * 0.325,
      ...i(d.rules)
    );
  } else {
    const $ = v && ["Colourless", "Artifact", "Land"].includes(h.boxes);
    f(u.boxes, d.title), $ && (e.save(), e.globalAlpha *= Fa, f(u.boxes, d.title), e.restore());
    const D = r.get(u.boxes);
    v && D ? eo(e, D, d.type, $) : (f(u.boxes, d.type, "bottom"), c === "normal" && D && (so(e, D, i(d.type)), no(e, i(d.type), h.boxes)));
  }
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left";
  const [R, x, T, I] = i(d.title), L = R + j.plateLeft + (c === "normal" ? 1 : 0), P = vn(t), A = t.manaSymbols ?? [], O = j.manaSize * P, B = A.length * O + Math.max(0, A.length - 1) * j.manaGap, V = R + T - j.plateRight, re = V - B, E = (c === "normal" && !n ? j.normalTitleFont : j.titleFont) * P;
  e.font = `bold ${E}px "CardRenderer MTG Beleren", Georgia`, e.letterSpacing = `${j.titleTracking}px`, te(
    e,
    t.name,
    L,
    x + I / 2 + (c === "normal" ? 1 : 0),
    re - L - (A.length ? j.titleGap : 0),
    E,
    !0
  ), e.letterSpacing = "0px", A.forEach(
    ($, D) => X(
      e,
      $,
      re + D * (O + j.manaGap),
      x + I / 2 - O / 2 + j.manaLift / 2,
      O,
      r,
      !0
    )
  );
  const N = ee(t), G = r.get(N ?? ""), oe = pe(N), ae = Ee(t), Be = _a(t), xe = La(t), be = Be && c === "normal", Q = be ? to : 1, W = j.setMargin + (be ? 2 : 0), [, U, , Y] = i(d.type), le = U + Y / 2 + j.typeLift / 2 + (c === "normal" || v ? 2 : 0), se = G ? Math.min(
    j.setMaxWidth,
    j.setHeight * G.width * ae[2] / (G.height * ae[3])
  ) : 0, me = G ? Math.min(
    se / (G.width * ae[2]),
    j.setHeight / (G.height * ae[3])
  ) : 0, Se = [
    V - W - se - se * (Q - 1) / 2 + (v ? 1.5 : 0),
    le - (G?.height ?? 0) * ae[3] * me * Q / 2 - (be ? 1 : 0),
    (G?.width ?? 0) * ae[2] * me * Q,
    (G?.height ?? 0) * ae[3] * me * Q
  ], K = c === "normal" && !n ? tr(t, N, Se, "component") : Se, Za = Math.max(
    1,
    Math.min(
      V - L - (G ? se * (1 + (Q - 1) / 2) + W + j.typeGap : 0),
      G && K !== Se ? K[0] - L - j.typeGap : 1 / 0
    )
  );
  e.font = `${j.typeFont * P}px "CardRenderer MTG Beleren", Georgia`, te(
    e,
    t.typeLine ?? "",
    L + (v ? 1.5 : 0),
    le,
    Za,
    j.typeFont * P,
    !1,
    c === "normal" && !n ? Ve.typeWidthScale : 1
  ), G && (oe || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(G, ...K), e.restore()) : Be ? Ua(
    e,
    G,
    t.rarity,
    ...K,
    ae,
    be ? 1.5 : 1
  ) : xe ? $a(
    e,
    G,
    xe,
    t.rarity,
    ...K,
    ae,
    c === "normal"
  ) : Ie(e, G, t.setCode, t.rarity, ...K, ae)), Pa(t) ? N0(e, t, r) : c !== "normal" ? Q0(e, t, r) : ge(e, Ra(e, t, a, P), r);
  const nr = gs(t);
  if (nr && c !== "leveler") {
    f(u.pt, d.stats, "stretch");
    const [$, D, ne] = i(d.stats);
    e.fillStyle = c.startsWith("planeswalker") ? "white" : "#17140f", e.font = `bold ${j.statsFont}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      nr.text,
      $ + ne / 2,
      D + (c.startsWith("planeswalker") ? d.stats[3] * M / 2 : j.statsLine / 2 + (c === "normal" ? 2 : 0)),
      ne
    );
  }
  n || Yr(e, t);
}
function Yr(e, t) {
  const [r, a, n, s] = Ja(z.footer), o = a + j.footerLine;
  e.save(), e.beginPath(), e.rect(r, a, n, s), e.clip(), e.textAlign = "left", e.textBaseline = "top", e.fillStyle = fe(t.setCode, t.borderColor).ink, e.font = `${j.footerFont}px "CardRenderer MTG Relay", sans-serif`, e.letterSpacing = `${j.footerTracking}px`;
  const l = t.setCode?.trim().toUpperCase() ?? "";
  e.fillText(l, r, o);
  let i = r + e.measureText(l).width;
  e.letterSpacing = "0px", t.artist && (i += j.artistMarginLeft, e.font = `${j.footerFont}px "CardRenderer MTG Artist Credit", sans-serif`, e.fillText("a", i, o), i += e.measureText("a").width + j.artistMarginRight, e.font = `${j.footerFont * 1.154}px "CardRenderer MTG Beleren", Georgia`, e.fillText(t.artist, i, o)), e.restore();
}
function zr(e, t, r, a = z.frame, n = !1, s = 0) {
  const [o, l, i, d] = Ja(a), c = s, h = o + c, u = i - 2 * c, m = Math.min(t.height, d * t.width / i), g = m * i / t.width, f = e.getTransform().a, k = () => {
    if (!n) {
      e.drawImage(t, 0, 0, t.width, m, h, l, u, g);
      return;
    }
    const p = 424, b = 436;
    e.save(), e.beginPath(), e.rect(0, 0, S, p), e.rect(0, b, S, M - b), e.clip(), e.drawImage(t, 0, 0, t.width, m, h, l, u, g), e.restore(), e.save(), e.beginPath(), e.rect(0, p, S, b - p), e.clip(), e.drawImage(t, 0, 0, t.width, m, h, l - 1, u, g), e.restore();
  };
  e.save(), e.shadowColor = "black", e.shadowOffsetX = -394e-5 * S * f, e.shadowOffsetY = 394e-5 * S * f, e.shadowBlur = 236e-5 * S * f, k(), r || (e.shadowColor = "#ffffffa0", e.shadowOffsetX = 157e-5 * S * f, e.shadowOffsetY = -315e-5 * S * f, e.shadowBlur = 157e-5 * S * f, k()), e.restore();
}
function Ja(e) {
  return [e[0] * S, e[1] * M, e[2] * S, e[3] * M];
}
export {
  Co as $,
  fs as A,
  M as B,
  W0 as C,
  wo as D,
  ps as E,
  z as F,
  Ro as G,
  S as H,
  Ws as I,
  _e as J,
  Ps as K,
  $s as L,
  Us as M,
  ht as N,
  qa as O,
  So as P,
  fe as Q,
  Fe as R,
  ie as S,
  dn as T,
  bo as U,
  Ao as V,
  ys as W,
  _0 as X,
  wt as Y,
  U0 as Z,
  Bo as _,
  r0 as a,
  vn as a$,
  bs as a0,
  gs as a1,
  go as a2,
  Jt as a3,
  on as a4,
  Pa as a5,
  ut as a6,
  Go as a7,
  q as a8,
  Dr as a9,
  Xt as aA,
  we as aB,
  da as aC,
  pt as aD,
  $e as aE,
  _s as aF,
  ia as aG,
  gr as aH,
  de as aI,
  Mo as aJ,
  ca as aK,
  mr as aL,
  v0 as aM,
  Wa as aN,
  ws as aO,
  Ot as aP,
  To as aQ,
  Zt as aR,
  Pn as aS,
  Da as aT,
  Ee as aU,
  Gs as aV,
  po as aW,
  K0 as aX,
  ln as aY,
  et as aZ,
  Qt as a_,
  Ha as aa,
  P0 as ab,
  V0 as ac,
  Qa as ad,
  Ra as ae,
  vo as af,
  Ka as ag,
  Ur as ah,
  yo as ai,
  N0 as aj,
  te as ak,
  ye as al,
  X as am,
  J0 as an,
  G0 as ao,
  Ca as ap,
  ge as aq,
  Ie as ar,
  Q0 as as,
  Lo as at,
  Ta as au,
  Ja as av,
  X0 as aw,
  Io as ax,
  _ as ay,
  Ns as az,
  ee as b,
  gt as b0,
  Ze as b1,
  jo as c,
  Oo as d,
  Eo as e,
  ue as f,
  $o as g,
  fo as h,
  mo as i,
  j,
  J as k,
  ke as l,
  ft as m,
  Ht as n,
  Z as o,
  kr as p,
  ce as q,
  uo as r,
  he as s,
  qt as t,
  js as u,
  nt as v,
  xo as w,
  Xr as x,
  Xn as y,
  qn as z
};
