const i0 = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", o0 = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", h0 = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", u0 = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", ie = {
  RENDERER_COMPONENT_ROOT: i0,
  KEYRUNE_ROOT: o0,
  RETRO_ROOT: h0,
  RETRO_SYMBOL_FONT: u0
}, c0 = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), g0 = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function d0(e) {
  return c0.has(e?.trim().toLowerCase() ?? "");
}
function m0(e) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(e?.toLowerCase() ?? "") ? 0 : 1;
}
function b0(e, t) {
  const s = e?.trim().toLowerCase() ?? "";
  return g0.has(s) || s === "atq" && t === "Reconstruction";
}
const f0 = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function Lt(e) {
  if (!/\bBasic Land\b/.test(e.typeLine ?? "")) return null;
  const t = e.rulesText ?? "", s = /^\(?\{T\}: Add \{([WUBRG])\}\.\)?$/.exec(t);
  if (!s || t.startsWith("(") !== t.endsWith(")")) return null;
  if (e.rulesParagraphs) {
    const a = e.rulesParagraphs;
    if (a.length !== 1 || a[0].role !== "rules" || a[0].align || a[0].runs.length !== 1 || a[0].runs[0].text !== t || !!a[0].runs[0].italic !== t.startsWith("("))
      return null;
  }
  return s[1];
}
function Xe(e) {
  if (e.wordingMode === "oracle" || !["mir", "tmp"].includes(e.setCode?.toLowerCase() ?? "")) return null;
  const t = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    e.typeLine ?? ""
  )?.[1];
  if (!t) return null;
  const s = f0[t];
  return Lt(e) !== s ? null : {
    typeLine: "Land",
    paragraphs: [
      {
        role: "rules",
        align: "center",
        runs: [{ text: `{T}: Add {${s}} to your mana pool.` }]
      }
    ]
  };
}
function p0(e) {
  return e.power != null && e.toughness != null ? {
    text: `${e.power}/${e.toughness}`,
    label: `Power ${e.power}, toughness ${e.toughness}`
  } : e.loyalty != null && e.loyalty !== "" ? { text: String(e.loyalty), label: `Starting loyalty ${e.loyalty}` } : null;
}
const b = 488, j = 680, w0 = 0.058;
function Te(e, t) {
  if (t === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const s = (t ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    e?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: s ? "#eeedeb" : "#090806", ink: s ? "#17140f" : "#fff" };
}
const S0 = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", F = {
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
}, L = {
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
}, it = (e) => e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
function v0(e = F) {
  return {
    ...Object.fromEntries(
      Object.entries(e).flatMap(
        ([t, s]) => s.map((a, r) => [
          `--face-${it(t)}-${["x", "y", "w", "h"][r]}`,
          `${a * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(L).map(([t, s]) => [
        `--face-${it(t)}`,
        `${s / b * 100}cqw`
      ])
    )
  };
}
const Da = v0();
function k0(e) {
  return e.length > 340 ? "dense" : e.length > 210 ? "long" : "normal";
}
function La(e) {
  return {
    dense: L.denseRulesFont,
    long: L.longRulesFont,
    normal: L.normalRulesFont
  }[k0(e)];
}
function Ae(e) {
  return e.split(/(\{[^}\n]+\})/g).filter(Boolean).map((t) => ({
    value: t,
    symbol: /^\{[^}\n]+\}$/.test(t) ? t.slice(1, -1) : null
  }));
}
function y0(e) {
  const t = e.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[t] ?? t.slice(0, 3);
}
const _e = "WUBRG";
function ee(e) {
  const t = e.typeLine ?? "", s = e.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(t), a = e.land ?? /(^|\s)Land(?:\s|$)/i.test(t), r = !/\bPlaneswalker\b/i.test(t) && (e.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(t)), n = e.creature ?? /(^|\s)Creature(?:\s|$)/i.test(t), l = de(e), i = l.length === 0 ? "Colourless" : l.length > 2 ? "Gold" : l.join(""), o = (s || a) && l.length === 0 ? "Artifact" : i, h = a ? "Land" : s ? "Artifact" : l.length > 1 ? "Gold" : i;
  return {
    frame: o,
    boxes: h,
    background: h,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: a && l.length > 0 ? i : s && l.length > 0 ? l.length > 1 ? "Gold" : i : h,
    pt: h,
    artifact: s,
    land: a,
    legendary: r,
    creature: n,
    className: `rendered-card-profile-${h.toLocaleLowerCase()}`
  };
}
function de(e) {
  return R0(e.frameColors ?? e.colors ?? []);
}
function R0(e) {
  return [
    ...new Set(
      e.map((t) => t.toLocaleUpperCase()).filter((t) => _e.includes(t))
    )
  ].sort((t, s) => _e.indexOf(t) - _e.indexOf(s));
}
const C0 = ie.KEYRUNE_ROOT, T0 = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function M0(e) {
  return e.setSymbol ? [0, 0, 1, 1] : T0[e.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1];
}
const At = new Set(
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
At.add("con_");
const B0 = "GLINT", Me = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function j0(e) {
  const t = Me[e] ?? Me.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${t}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function D0(e) {
  const t = Me[e] ?? Me.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${t}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function L0(e, t = "common") {
  const s = e.trim().toLowerCase();
  if (s === "forge") return D0(t);
  if (s === B0.toLowerCase()) return j0(t);
  const a = s === "con" ? "con_" : s === "p02" ? "po2" : s;
  return At.has(a) ? `${C0}/${a}.svg` : null;
}
const ot = {
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
function A0(e) {
  return Object.hasOwn(ot, e) ? ot[e] : null;
}
const pe = ie.RENDERER_COMPONENT_ROOT;
function ze(e, t = "normal") {
  const s = ["normal", "adventure", "leveler"].includes(t), a = t === "saga" ? "saga" : t === "planeswalker-large" ? "planeswalker_large" : t, r = ["saga", "class"].includes(t) && e.boxes === "Colourless" ? "Land" : t.startsWith("planeswalker") && e.boxes === "Artifact" ? "Colourless" : e.boxes;
  return {
    background: H(
      s ? "bg" : t === "class" ? "saga_bg" : `${a}_bg`,
      t.startsWith("planeswalker") && r === "Land" ? "Colourless" : r
    ),
    frame: H(
      ["normal", "leveler"].includes(t) ? "frames" : `${a}_frames`,
      t === "adventure" ? "WUBRG".includes(e.frame) ? e.frame : "W" : t === "class" ? e.frame === "WU" ? "UW" : e.frame.length === 2 ? "Gold" : e.frame : t === "saga" && e.frame === "Colourless" ? "Land" : t.startsWith("planeswalker") && ["Artifact", "Land"].includes(e.frame) ? "Colourless" : e.frame
    ),
    boxes: H(t.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", r),
    nameplate: H("nameplates", e.boxes),
    crown: H("legendary-crowns", e.crown),
    pt: t.startsWith("planeswalker") ? H("planeswalker", "Loyalty") : H("pt-boxes", e.pt)
  };
}
function Ge(e) {
  const t = e.replace(/^\{|\}$/g, "").toLocaleUpperCase(), s = t === "∞" ? "INFINITY" : t === "½" ? "HALF" : t.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(s) ? H("symbols", s) : null;
}
function G0(e, t) {
  return L0(e, t);
}
function H(e, t) {
  const s = e === "legendary-crowns" ? "legendary_crowns" : e === "pt-boxes" ? "pt_boxes" : e === "nameplates" ? "boxes" : e, a = e === "symbols" ? "svg" : "webp";
  return `${pe}/img/${s}/${encodeURIComponent(t)}.${a}`;
}
function We(e, t = e.rarity) {
  const s = e.setCode?.trim().toLowerCase() ?? "";
  return e.setSymbol ?? G0(s === "chr" ? A0(e.name) ?? "" : s, t);
}
function Gt(e) {
  const t = [
    e.rulesText ?? "",
    ...(e.rulesParagraphs ?? []).flatMap((a) => a.runs.map((r) => r.text))
  ];
  return [.../* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...t.flatMap(
      (a) => Ae(a).flatMap((r) => r.symbol ? [r.symbol] : [])
    )
  ])].map(Ge);
}
const W0 = ie.RETRO_SYMBOL_FONT, ce = ie.RETRO_ROOT, O0 = `${ce}/fonts/goudy-medieval.ttf`, E0 = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), I0 = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function oe(e) {
  return e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") ? !1 : e.frameStyle === "retro" || e.frameStyle !== "modern" && E0.has(e.setCode?.toLowerCase() ?? "");
}
function Oe(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function K(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return Oe(e) ? "abu" : t === "leg" && de(e).length > 1 ? "legends" : ["3ed", "4ed", "5ed", "atq"].includes(t) && !/\bLand\b/.test(e.typeLine ?? "") ? "fourth" : "seventh";
}
function Wt(e) {
  return K(e) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1];
}
function Ke(e) {
  const t = Oe(e);
  return {
    ...F,
    frame: Wt(e),
    title: [t ? 0.07 : 0.1134, 0.0481, t ? 0.8467 : 0.8, 0.043],
    art: K(e) === "legends" ? [0.112, 0.094, 0.78, 0.45] : K(e) === "fourth" ? [0.114, 0.098, 0.772, 0.445] : t ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429],
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: [0.8074, 0.895, 0.1367, 0.043],
    footer: [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function ge(e) {
  const t = de(e), s = e.typeLine ?? "", a = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([i]) => s.includes(i)), r = /\bLand\b/.test(s) ? a.length === 1 ? a[0][1] + "l" : "l" : /\bArtifact\b/.test(s) ? "a" : t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "c", n = K(e), l = n === "seventh" || r === "c" || n === "abu" && r === "m" ? "seventh/regular" : `old/${n}`;
  return `${ce}/img/frames/${l}/${n === "legends" ? "legendsFrameM" : r}.png`;
}
function te(e) {
  return e.borderColor ?? (I0.has(e.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function ht(e) {
  return te(e) === "silver" ? Te(null, "silver").border : te(e) === "white" ? $0 : "#080808";
}
function Ot(e) {
  return K(e) === "fourth" ? `${ce}/img/frames/old/fourth/borderBlack.png` : `${ce}/img/frames/${Oe(e) ? "old/abu" : "seventh/regular"}/border.svg`;
}
function ut(e) {
  return Oe(e) ? "#ababab" : "#f2eee3";
}
function U0(e) {
  return e.setCode?.toLowerCase() === "7ed" && de(e).some((t) => t === "W" || t === "G") && !/Land/.test(e.typeLine ?? "") ? "saturate(.7) brightness(.88)" : "none";
}
function Ve(e) {
  if (Xe(e)) return null;
  const t = Lt(e);
  return t ? `${ce}/img/frames/m15/basics/${t.toLowerCase()}.png` : null;
}
const $0 = "#eeedeb";
function Et(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return !e.setSymbol && t === "ice" ? `${ie.KEYRUNE_ROOT}/ice2.svg` : !e.setSymbol && b0(t, e.name) ? null : We(e);
}
function Aa(e) {
  const t = (e.rulesText ?? "").length;
  return t > 340 ? 16 : t > 210 ? 19 : 23;
}
function P0(e) {
  return [
    Ve(e),
    ge(e),
    te(e) !== "black" || K(e) === "fourth" ? Ot(e) : null,
    e.illustration,
    Et(e),
    ...Gt(e)
  ];
}
const z = ([e, t, s, a]) => [
  e * b,
  t * j,
  s * b,
  a * j
];
function Ga(e, t) {
  return ["7ed", "8ed", "9ed"].includes(e?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(t ?? "") ? "black" : void 0;
}
function xe([e, t, s]) {
  const a = Math.max(e, t, s), r = a - Math.min(e, t, s);
  return [((r === 0 ? 0 : a === e ? (t - s) / r : a === t ? (s - e) / r + 2 : (e - t) / r + 4) * 60 % 360 + 360) % 360, a === 0 ? 0 : r / a, a];
}
function _0(e, t, s) {
  const a = (e % 360 + 360) % 360 / 60, r = s * t, n = r * (1 - Math.abs(a % 2 - 1)), l = s - r, i = a < 1 ? [r, n, 0] : a < 2 ? [n, r, 0] : a < 3 ? [0, r, n] : a < 4 ? [0, n, r] : a < 5 ? [n, 0, r] : [r, 0, n];
  return [i[0] + l, i[1] + l, i[2] + l];
}
function F0(e, t) {
  const [s, a, r] = xe(e);
  return _0(
    s + t.hueDegrees,
    Math.min(1, a * t.saturationScale),
    Math.min(1, r * t.brightnessScale)
  );
}
const N0 = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, x0 = "#9aa4ae", Y0 = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
class H0 {
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
    const s = new Set(t.map((r) => r.key)), a = t.reduce((r, n) => {
      const l = this.entries.get(n.key);
      if (l && l.bytes !== n.bytes)
        throw Error("Material cache key has inconsistent dimensions");
      return r + (l ? 0 : n.bytes);
    }, 0);
    for (const [r, n] of this.entries) {
      if (this.bytes + a <= this.limit) break;
      n.users || s.has(r) || (this.entries.delete(r), n.retired = !0, this.destroy(n), this.evictions++);
    }
    if (!(this.bytes + a > this.limit))
      return this.bytes += a, this.peakBytes = Math.max(this.peakBytes, this.bytes), t.map((r) => {
        let n = this.entries.get(r.key);
        if (n)
          this.hits++, this.entries.delete(r.key), this.entries.set(r.key, n);
        else {
          const l = {
            users: 0,
            bytes: r.bytes,
            accounted: !0,
            retired: !1,
            promise: Promise.resolve().then(async () => {
              this.builds++;
              const i = await r.build();
              if (i.width * i.height * 4 !== r.bytes)
                throw i.close(), Error("Derived bitmap dimensions differ from its cache reservation");
              return l.bitmap = i, i;
            })
          };
          l.promise = l.promise.catch((i) => {
            throw this.entries.get(r.key) === l && this.entries.delete(r.key), l.retired = !0, this.destroy(l), this.notify(), i;
          }), this.entries.set(r.key, l), n = l;
        }
        return n.users++, n;
      });
  }
  notify() {
    for (const t of [...this.waiting]) t();
  }
  wait(t) {
    return t.throwIfAborted(), new Promise((s, a) => {
      const r = () => {
        this.waiting.delete(n), t.removeEventListener("abort", l);
      }, n = () => {
        r(), s();
      }, l = () => {
        r(), a(t.reason);
      };
      this.waiting.add(n), t.addEventListener("abort", l, { once: !0 });
    });
  }
  async acquire(t, s, a, r) {
    return (await this.acquireMany([{ key: t, bytes: s, build: a }], r))[0];
  }
  /** Admit a complete face atomically. Per-component waiting could deadlock two
   * faces that each hold half their required components while awaiting the rest. */
  async acquireMany(t, s) {
    if (s.throwIfAborted(), new Set(t.map((n) => n.key)).size !== t.length)
      throw Error("Duplicate key in material batch");
    if (t.some((n) => !Number.isSafeInteger(n.bytes) || n.bytes < 1) || t.reduce((n, l) => n + l.bytes, 0) > this.limit)
      throw RangeError("Material batch exceeds derived-image budget");
    let a;
    for (; !(a = this.admit(t)); )
      await this.wait(s), s.throwIfAborted();
    const r = a.map((n) => {
      let l = !1;
      return () => {
        l || (l = !0, n.users--, n.retired && !n.users && this.destroy(n), this.notify());
      };
    });
    try {
      const l = (await Promise.allSettled(a.map((i) => i.promise))).find((i) => i.status === "rejected");
      if (l?.status === "rejected") throw l.reason;
      return s.throwIfAborted(), a.map((i, o) => ({ value: i.bitmap, release: r[o] }));
    } catch (n) {
      for (const l of r) l();
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
const It = new H0(16 * 1024 * 1024), Wa = () => It.clear(), q0 = {
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
}, X0 = {
  "lea-U": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png",
  "lea-R": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",
  "lea-A": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png",
  "2ed-R": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",
  "3ed-W": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",
  "3ed-R": "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png"
}, z0 = {
  "lea-U": [0, 0, 1, 1],
  "lea-R": [0, 0, 1, 1],
  "lea-A": [0, 0, 1, 1],
  "2ed-R": [0, 0, 1, 1],
  "3ed-W": [0.012, 0.01, 0.974, 0.982],
  "3ed-R": [0.012, 0.01, 0.974, 0.982]
}, K0 = {
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
}, V0 = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/", Z0 = {
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
}, J0 = {
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
function Ze(e) {
  return oe(e) && (!e.layout || e.layout === "normal") && (e.colorCalibration === "early-hsb-v1" || e.colorCalibration === "set-hsb-v1");
}
const Ut = (e) => {
  const t = e.setCode?.toLowerCase() ?? "";
  return ["lea", "leb"].includes(t) ? te(e) === "black" : ["2ed", "3ed"].includes(t) && te(e) === "white";
}, ct = (e, t) => e?.every((s, a) => s === t[a]) ?? !1;
function Q0(e) {
  if (!Ze(e)) return;
  const t = ge(e), s = Wt(e), a = t.split("/").at(-1).replace(".png", "").toUpperCase(), r = e.setCode?.toLowerCase() ?? "", n = `${r}-${a}`;
  if (Ut(e) && X0[n] === t && ct(z0[n], s))
    return q0[n];
  if (e.colorCalibration !== "set-hsb-v1") return;
  const l = Z0[`${r}-${te(e)}-${a}`];
  return l && V0 + l.asset === t && ct(l.rect, s) ? l.adjustment : void 0;
}
function es(e, t) {
  if (!Ze(e)) return;
  const s = e.setCode?.toLowerCase() ?? "";
  return (Ut(e) ? K0[`${s}-${t}`] : void 0) ?? (e.colorCalibration === "set-hsb-v1" ? J0[`${s}-${te(e)}-${t}`] : void 0);
}
async function ts(e, t, s) {
  const a = { images: t, dispose() {
  } };
  if (!Ze(e)) return a;
  const r = Q0(e), n = /* @__PURE__ */ new Map(), l = {};
  r && n.set(ge(e), r);
  const i = /* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...[...(e.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((c) => c[1])
  ]);
  for (const c of e.rulesParagraphs ?? [])
    for (const g of c.runs) for (const d of g.text.matchAll(/\{([^}]+)\}/g)) i.add(d[1]);
  i.add("W");
  for (const c of i) {
    const g = /^\d+$/.test(c) ? "N" : c, d = es(e, g), m = Y0[g];
    if (!d || !m) continue;
    const p = Ge(c);
    p && n.set(p, ns(m, d)), l[c] = `rgb(${d.map((v) => Math.round(v * 255)).join(" ")})`;
  }
  if (!n.size && !Object.keys(l).length) return a;
  const o = Object.assign(new Map(t), { manaColors: l }), h = [...n].flatMap(([c, g]) => {
    const d = t.get(c);
    return d ? [{ url: c, source: d, adjustment: g }] : [];
  });
  let u = [];
  try {
    return u = await It.acquireMany(
      h.map(({ url: c, source: g, adjustment: d }) => ({
        key: ss(c, g.width, g.height, d),
        bytes: g.width * g.height * 4,
        build: () => as(g, d)
      })),
      s
    ), h.forEach(({ url: c }, g) => o.set(c, u[g].value)), { images: o, dispose: () => u.forEach((c) => c.release()) };
  } catch (c) {
    throw u.forEach((g) => g.release()), c;
  }
}
function ss(e, t, s, a) {
  return JSON.stringify([
    "early-hsb-rgb-preserve-ink-v1",
    e,
    t,
    s,
    a.hueDegrees,
    a.saturationScale,
    a.brightnessScale
  ]);
}
async function as(e, t) {
  const s = document.createElement("canvas");
  s.width = e.width, s.height = e.height;
  try {
    const a = s.getContext("2d", { willReadFrequently: !0 });
    if (!a) throw Error("HSB preparation needs Canvas2D.");
    a.drawImage(e, 0, 0);
    const r = a.getImageData(0, 0, s.width, s.height);
    return rs(r, t), a.putImageData(r, 0, 0), await createImageBitmap(s);
  } finally {
    s.width = s.height = 0;
  }
}
function rs(e, t) {
  for (let s = 0; s < e.data.length; s += 4) {
    if (e.data[s + 3] === 0) continue;
    const a = [e.data[s] / 255, e.data[s + 1] / 255, e.data[s + 2] / 255], r = Math.max(...a), n = r === 0 ? 0 : (r - Math.min(...a)) / r;
    if (r < 0.075 || n < 0.025 && r > 0.97) continue;
    const l = F0(a, t);
    for (let i = 0; i < 3; i++) e.data[s + i] = Math.round(255 * l[i]);
  }
}
function ns(e, t) {
  const s = [
    parseInt(e.slice(1, 3), 16) / 255,
    parseInt(e.slice(3, 5), 16) / 255,
    parseInt(e.slice(5, 7), 16) / 255
  ], [a, r, n] = xe(s), [l, i, o] = xe(t);
  if (r <= 0 || n <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (l - a + 540) % 360 - 180,
    saturationScale: i / r,
    brightnessScale: o / n
  };
}
const ls = 0.045;
function is(e) {
  return oe(e) ? w0 : ls;
}
const we = {
  artInset: 4.5,
  artRim: 1.5,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function os(e) {
  return ["m15", "m19", "m20", "war"].includes(e.setCode?.toLowerCase() ?? "") ? we.frameInset : 0;
}
const Fe = "#fbf0c5", ke = "#ccdaf2", gt = "#9c9995", Ne = "#edaa8d", ye = "#dde6e2", hs = {
  WU: [Fe, ke],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [Ne, Fe],
  WG: [ye, Fe],
  UB: [ke, gt],
  UR: [ke, Ne],
  UG: [ye, ke],
  BR: ["#b4afb5", "#f2b096"],
  BG: [gt, ye],
  RG: [Ne, ye]
};
function us(e, t, s) {
  if (!t.land) return;
  const a = hs[t.frame];
  if (!a) return;
  const r = 34 + s, n = 420 - 2 * s, l = e.createLinearGradient(r, 0, r + n, 0);
  l.addColorStop(0, a[0]), l.addColorStop(0.35, a[0]), l.addColorStop(0.65, a[1]), l.addColorStop(1, a[1]), e.save(), e.globalCompositeOperation = "multiply", e.fillStyle = l, e.fillRect(r, 425, n, 203.5), e.restore();
}
function cs(e, t, s, a) {
  if (!t.land || t.frame !== "Artifact") {
    a();
    return;
  }
  const r = 34 + s, n = 420 - 2 * s;
  for (const l of [!1, !0])
    e.save(), e.beginPath(), l || e.rect(0, 0, 488, 680), e.rect(r, 425, n, 203.5), e.clip("evenodd"), e.filter = `grayscale(1) brightness(${l ? 0.9 : 0.63})`, a(), e.restore();
}
function gs(e) {
  if (e.setSymbol) return null;
  const t = e.setCode?.toLowerCase();
  return t === "m15" || t === "war" ? t : null;
}
function ds(e, t, s, a, r, n, l, i, o, h) {
  const [u, c, g, d] = h ? s === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, s === "m15" ? 0.7 : 1.2];
  r += c - l * (u - 1) / 2, n += g - i * (u - 1) / 2, l *= u, i *= u;
  const m = !a || a === "common", p = document.createElement("canvas"), v = 3, S = 4;
  p.width = Math.ceil((l + v * 2) * S), p.height = Math.ceil((i + v * 2) * S);
  const w = p.getContext("2d");
  w.scale(S, S), w.translate(v, v), w.drawImage(
    t,
    o[0] * t.width,
    o[1] * t.height,
    o[2] * t.width,
    o[3] * t.height,
    0,
    0,
    l,
    i
  ), w.globalCompositeOperation = "source-in";
  const k = a === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : a === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], f = w.createLinearGradient(0, i * 0.65, l, i * 0.35);
  f.addColorStop(0, k[0]), f.addColorStop(0.35, k[1]), f.addColorStop(0.6, k[2]), f.addColorStop(1, k[3]), w.fillStyle = m ? "#111111" : f, w.fillRect(0, 0, l, i);
  const y = s === "m15" ? 32 : 27, C = new Path2D(
    s === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), D = new DOMMatrix().translate(-o[0] * l / o[2], -o[1] * i / o[3]).scale(l / (y * o[2]), i / (32 * o[3])), A = new Path2D();
  A.addPath(C, D), w.globalCompositeOperation = "destination-over", w.fillStyle = m ? "#f8f8f5" : "#111111", w.fill(A), w.strokeStyle = w.fillStyle, w.lineWidth = s === "war" && m ? 2 : d, w.lineJoin = "round", w.stroke(A), e.drawImage(
    p,
    r - v,
    n - v,
    p.width / S,
    p.height / S
  ), p.width = p.height = 0;
}
function ms(e, t) {
  const s = 52.053333333333335, a = 1255 / 2100 * 680, r = 1346 / 1500 * 488, n = 1861 / 2100 * 680, l = 17 / 1500 * 488, i = 17 / 2100 * 680, o = (u) => {
    e.moveTo(...u[0]);
    for (const c of u.slice(1)) e.lineTo(...c);
    e.closePath();
  };
  e.save();
  const h = e.filter;
  e.filter = "none", e.fillStyle = "#00000047", e.beginPath(), o([
    [s, a],
    [r, a],
    [r - l, a + i],
    [s + l, a + i]
  ]), o([
    [r, a],
    [r, n],
    [r - l, n - i],
    [r - l, a + i]
  ]), e.fill(), e.beginPath(), o([
    [s, a],
    [s + l, a + i],
    [s + l, n - i],
    [s, n]
  ]), o([
    [s, n],
    [s + l, n - i],
    [r - l, n - i],
    [r, n]
  ]), e.clip(), e.filter = `${h === "none" ? "" : h + " "}brightness(1.35)`, e.drawImage(t, 0, 0, 488, 680), e.restore();
}
const dt = {
  arn: { right: 439, centerY: 394, width: 65, height: 22, crop: [0, 0.283203125, 1, 0.435546875] },
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
  leg: {
    right: 441,
    centerY: 394,
    width: 24,
    height: 21,
    crop: [0, 0.1264957264957265, 1, 0.764102564102564]
  },
  all: {
    right: 424,
    centerY: 392,
    width: 54,
    height: 23,
    crop: [390625e-8, 0.2890625, 0.994140625, 0.421875]
  },
  wth: {
    right: 434,
    centerY: 390,
    width: 34,
    height: 22,
    crop: [0, 0.154296875, 0.998046875, 0.646484375]
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
};
function bs(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return !e.setSymbol && Object.hasOwn(dt, t) ? dt[t] : null;
}
function fs(e) {
  return e.setSymbol || e.setCode?.toLowerCase() !== "exo" ? null : e.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : e.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const Ye = {
  arn: { count: 6, white: [2] },
  leg: { count: 6, white: [0, 1, 2, 3, 4] },
  all: { count: 5, white: [0, 1, 2] },
  wth: { count: 8, white: [0, 1, 2, 3, 4, 5, 6] },
  exo: { count: 6, white: [0, 1, 2, 3, 4] },
  ice2: { count: 16, white: [0] }
}, $t = (e) => `${e}#opaque-print-details-v1`, ps = (e) => Object.keys(Ye).some((t) => e === `${ie.KEYRUNE_ROOT}/${t}.svg`);
async function ws(e, t) {
  const s = Object.keys(Ye).find((u) => e === `${ie.KEYRUNE_ROOT}/${u}.svg`);
  if (!s) return null;
  const a = new DOMParser().parseFromString(await t.text(), "image/svg+xml"), r = a.documentElement, n = a.querySelectorAll("path"), l = n[0]?.getAttribute("d") ?? "", i = l.match(/M[^M]*/g) ?? [], o = Ye[s];
  if (r.localName !== "svg" || a.querySelector("parsererror") || n.length !== 1 || i.length !== o.count || i.some((u) => /m/.test(u) || !/[zZ]\s*$/.test(u)))
    throw new Error(`Unexpected pinned ${s} symbol paths.`);
  const h = a.createElementNS("http://www.w3.org/2000/svg", "path");
  return h.setAttribute("d", o.white.map((u) => i[u]).join("")), h.setAttribute("fill", "#fff"), r.replaceChildren(h), new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" });
}
function Be(e, t, [s, a, r, n]) {
  if (!(e > 0 && t > 0)) return [s, a, r, n];
  const l = Math.max(r / e, n / t), i = e * l, o = t * l;
  return [s + (r - i) / 2, a + (n - o) / 2, i, o];
}
function Ss(e, t, s, a) {
  const r = [a[0] * e, a[1] * t, a[2] * e, a[3] * t];
  return [...r, ...Be(r[2], r[3], s)];
}
function je(e, t, s, a, r) {
  const [n, l, i, o] = a;
  if (r === "printing") {
    e.clearRect(n, l, i, o);
    return;
  }
  r === "artwork" && (e.fillStyle = "#80745c", e.fillRect(n, l, i, o));
  const h = s.get(t.illustration ?? "");
  h && (e.save(), e.beginPath(), e.rect(n, l, i, o), e.clip(), t.illustrationCrop ? e.drawImage(
    h,
    ...Ss(h.width, h.height, a, t.illustrationCrop)
  ) : e.drawImage(h, ...Be(h.width, h.height, a)), e.restore());
}
function Je(e, t, s, a) {
  const r = [];
  for (const n of t.split(`
`)) {
    let l = [], i = 0;
    const o = Ae(n).flatMap(
      (h) => h.symbol ? [{ text: h.symbol, symbol: !0 }] : (h.value.match(/\s+|\S+/g) ?? []).map((u) => ({ text: u, symbol: !1 }))
    );
    for (const h of o) {
      const u = !h.symbol && e.measureText(h.text).width > s ? [...h.text].map((c) => ({ text: c, symbol: !1 })) : [h];
      for (const c of u) {
        const g = c.symbol ? a * 0.94 : e.measureText(c.text).width;
        i + g > s && l.length && (r.push(l), l = [], i = 0), !(!l.length && /^\s+$/.test(c.text)) && (l.push({ ...c, width: g }), i += g);
      }
    }
    r.push(l);
  }
  return r;
}
function J(e, t, s, a, r, n, l = !1) {
  const i = n.get(Ge(t) ?? "");
  if (e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, l) {
    const o = 1.5372 * e.getTransform().a;
    e.shadowColor = "#000d", e.shadowOffsetX = -o, e.shadowOffsetY = o;
  }
  if (e.fillStyle = n.manaColors?.[t] ?? N0[t] ?? x0, e.beginPath(), e.arc(s + r / 2, a + r / 2, r / 2, 0, Math.PI * 2), e.fill(), e.shadowColor = "transparent", i) {
    e.drawImage(i, s, a, r, r), e.restore();
    return;
  }
  e.fillStyle = t === "B" ? "white" : "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = `bold ${r * 0.62}px Georgia`, e.fillText(t, s + r / 2, a + r / 2, r * 0.9), e.restore();
}
function Pt(e, t, s, a, r, n, l) {
  const i = typeof n == "number" ? n : n.size;
  e.font = `${typeof n != "number" && n.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
  const o = t.split(`
`).map((h) => Je(e, h, r, i));
  e.textBaseline = "top";
  for (const h of o) {
    for (const u of h) {
      let c = s;
      for (const g of u)
        g.symbol ? J(e, g.text, c + i * 0.07, a + i * 0.03, i * 0.8, l) : e.fillText(g.text, c, a), c += g.width;
      a += i;
    }
    a += L.paragraphGap;
  }
}
function Oa(e, t, s) {
  if (e.measureText(t).width <= s) return t;
  const a = [...t];
  for (; a.length && e.measureText(`${a.join("")}…`).width > s; ) a.pop();
  return a.length || e.measureText("…").width <= s ? `${a.join("")}…` : "";
}
function mt(e, t, s, a, r, n, l = !1, i = 1) {
  if (!(r > 0)) throw Error("Magic title/type plate has no text space.");
  e.save(), e.font = `${l ? "bold " : ""}${n}px "CardRenderer MTG Beleren", Georgia`;
  const o = e.measureText(t).width;
  i > 1 && o * i > r && (i = 1), i !== 1 && (e.translate(s, 0), e.scale(i, 1), s = 0, r /= i), o > r && (n = Math.max(n * 0.78, n * r / o), e.font = `${l ? "bold " : ""}${n}px "CardRenderer MTG Beleren", Georgia`), e.fillText(t, s, a, r), e.restore();
}
function _t(e, t, s, a, r, n, l, i, o = [0, 0, 1, 1]) {
  const h = [
    o[0] * t.width,
    o[1] * t.height,
    o[2] * t.width,
    o[3] * t.height
  ], u = {
    uncommon: "#aaaeb2",
    rare: "#bc923f",
    mythic: "#c65c2d",
    special: "#8664af",
    bonus: "#bc923f"
  }[a ?? "common"];
  if (!u || ["forge", "glint"].includes(s?.toLowerCase() ?? "")) {
    e.drawImage(t, ...h, r, n, l, i);
    return;
  }
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.ceil(l * 2)), c.height = Math.max(1, Math.ceil(i * 2));
  const g = c.getContext("2d");
  g.drawImage(t, ...h, 0, 0, c.width, c.height), g.globalCompositeOperation = "source-in", g.fillStyle = u, g.fillRect(0, 0, c.width, c.height), e.drawImage(c, r, n, l, i), c.width = c.height = 0;
}
function vs(e, t, s, a = !1) {
  Ft(
    e,
    t,
    s,
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
function ks(e, t, s, a = !1) {
  Ft(
    e,
    t,
    s,
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
function Ft(e, t, s, a, r) {
  t.forEach((n, l) => {
    const { size: i } = a, o = a.right - (t.length - 1 - l) * a.pitch - i / 2, h = a.centerY - i / 2;
    if (n !== "W" || r) {
      J(e, n, o, h, i, s, !1);
      return;
    }
    xt(e, o, h, i, a.whiteSize, s.manaColors?.W);
  });
}
const Nt = (e, t, s, a, r, n) => {
  if (t !== "W") return J(e, t, s, a, r, n);
  xt(e, s, a, r, r * 0.87, n.manaColors?.W);
};
function xt(e, t, s, a, r, n = "#efe7cb") {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = n, e.beginPath(), e.arc(t + a / 2, s + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = '100px "CardRenderer MTG Historic Symbols"', e.textAlign = "left", e.textBaseline = "alphabetic";
  const l = "", i = e.measureText(l), o = i.actualBoundingBoxLeft + i.actualBoundingBoxRight, h = i.actualBoundingBoxAscent + i.actualBoundingBoxDescent, u = r / Math.max(o, h);
  e.translate(t + a / 2, s + a / 2), e.scale(u, u), e.fillText(
    l,
    (i.actualBoundingBoxLeft - i.actualBoundingBoxRight) / 2,
    (i.actualBoundingBoxAscent - i.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function ys(e, t, s, a, r, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0;
  const l = document.createElement("canvas");
  l.width = e.canvas.width, l.height = e.canvas.height;
  const i = l.getContext("2d");
  if (!i) throw Error("Retro lettering needs a Canvas2D context");
  const o = e.getTransform();
  i.font = e.font, i.textAlign = e.textAlign, i.textBaseline = e.textBaseline, i.letterSpacing = e.letterSpacing, e.resetTransform();
  for (const [h, u, c] of [
    [0, n, "#f2eee3"],
    [n, 0, "#17140f"]
  ])
    i.resetTransform(), i.clearRect(0, 0, l.width, l.height), i.setTransform(o), i.globalCompositeOperation = "source-over", i.fillStyle = c, i.fillText(t, s + h, a + h, r), i.globalCompositeOperation = "destination-out", i.fillText(t, s + u, a + u, r), e.drawImage(l, 0, 0);
  l.width = l.height = 0, e.restore();
}
function Qe(e, t, s, a, r, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#17140f", e.fillText(t, s + n, a + n, r), e.fillStyle = "#ababab", e.fillText(t, s, a, r), e.restore();
}
function Rs(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function Cs(e, t) {
  e.save(), e.font = '22.5px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", Qe(e, `Illus. © ${t}`, 49, 631, 338, 1.25), e.restore();
}
function Ee(e) {
  const t = e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "");
  return (e.rulesText ?? "").split(`
`).filter((s) => s.trim()).map((s) => {
    const a = t ? s.match(/^\s*([IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*)\s*[—–-]\s*(.+)$/) : null;
    if (a)
      return { text: a[2], badges: a[1].split(/\s*,\s*/), reminder: !1 };
    const r = t ? null : s.match(/^\s*\[?([+−-]?(?:\d+|X))\]?\s*:\s*(.*)$/i);
    return r ? {
      text: r[2],
      badges: [r[1].replace("-", "−").toUpperCase()],
      reminder: !1
    } : { text: s, badges: [], reminder: t && /^\s*\(/.test(s) };
  });
}
function q(e) {
  return e.layout === "ability" ? "normal" : e.layout === "adventure" && e.faces?.length === 2 ? "adventure" : e.layout === "class" || /\bClass\b/i.test(e.typeLine ?? "") ? "class" : e.layout === "leveler" || /^Level up\b/m.test(e.rulesText ?? "") ? "leveler" : e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "") ? "saga" : e.layout === "planeswalker" || /\bPlaneswalker\b/i.test(e.typeLine ?? "") ? Ee(e).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function V(e) {
  if (oe(e)) return Ke(e);
  const t = q(e);
  if (t === "adventure")
    return {
      ...F,
      frame: [2.9 / 63.5, 3.5 / 88.9, 57.4 / 63.5, 79 / 88.9],
      type: [0.05669, 49.7 / 88.9, 0.88662, 0.05737],
      stamp: [0.58, 0.74, 0.25, 0.1794]
    };
  if (t === "class")
    return {
      ...F,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (t === "saga")
    return {
      ...F,
      background: [0.03937, 0.02812, 0.92126, 0.93926],
      frame: [0.032, 0.04117, 0.92126, 0.88864],
      art: [0.5008, 0.11249, 0.42992, 0.72328],
      type: [0.05669, 0.84589, 0.88662, 0.05737],
      rules: [0.07717, 0.11192, 0.4189, 0.72328],
      stamp: [0.17, 0.48, 0.23, 0.16506]
    };
  if (t.startsWith("planeswalker")) {
    const s = t === "planeswalker-large", a = [
      0.04409,
      s ? 0.55118 : 0.62655,
      0.88827,
      s ? 0.37534 : 0.29997
    ], r = F.stamp[2], n = F.stamp[3];
    return {
      ...F,
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
        a[0] + (a[2] - r) / 2,
        a[1] + (a[3] - n) / 2,
        r,
        n
      ]
    };
  }
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? {
    ...F,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : e.layout === "aftermath-top" ? {
    ...F,
    title: [0.035, 0.025, 0.93, 0.105],
    art: [0.052, 0.145, 0.896, 0.39],
    type: [0.035, 0.55, 0.93, 0.105],
    rules: [0.052, 0.67, 0.896, 0.29],
    footer: [0, 1, 0, 0]
  } : {
    ...F,
    art: [
      F.art[0] + we.artInset / b,
      F.art[1],
      F.art[2] - 2 * we.artInset / b,
      F.art[3]
    ]
  };
}
function Ts(e) {
  const t = q(e) === "saga", s = V(e).rules, a = Ee(e), r = s[2] * 488 - (t ? 32 : 70), n = s[3] * 680;
  let l = t ? 21 : 19;
  const i = (v, S) => Math.max(1, Math.ceil(v.length * S * 0.49 / r)), o = (v, S) => Math.max(t ? v.badges.length * 36 : 34, i(v.text, S) * S + 16), h = (v) => a.reduce((S, w) => S + o(w, v), 0);
  for (; l > 8 && h(l) > n; ) l -= 0.5;
  const u = a.map((v) => o(v, l)), c = Math.max(0, n - h(l)) / Math.max(1, a.length);
  let g = n / Math.max(1, a.length), d = n, m = a.length;
  if (!t)
    for (const v of [...u].sort((S, w) => w - S)) {
      if (v <= g) break;
      d -= v, g = d / Math.max(1, --m);
    }
  let p = 0;
  return a.map((v, S) => {
    const w = t ? u[S] + c : Math.max(g, u[S]), k = { ...v, top: p, height: w, font: l, left: t ? 27 : 62, width: r };
    return p += w, k;
  });
}
const He = (e, t = !1) => `${t ? "italic " : ""}${e}px "CardRenderer MTG MPlantin", Georgia`;
function Ms(e) {
  const t = [];
  let s = [], a = !1;
  const r = () => {
    s.length && (t.push({ pieces: s, space: a }), s = [], a = !1);
  };
  for (const n of e)
    for (const l of Ae(n.text))
      if (l.symbol) s.push({ text: l.symbol, symbol: !0, italic: !1 });
      else
        for (const i of l.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(i) ? (r(), i === `
` ? (t.push({ pieces: [], space: !1, newline: !0 }), a = !1) : a = !0) : s.push({ text: i, symbol: !1, italic: !!n.italic });
  return r(), t;
}
function fe(e, t, s) {
  const a = [];
  for (const r of t) {
    const n = a.at(-1);
    n && !n.symbol && !r.symbol && n.italic === r.italic ? n.text += r.text : a.push({ ...r });
  }
  return a.map((r) => {
    e.font = He(s, r.italic);
    const n = e.measureText(r.text);
    return {
      ...r,
      size: s,
      width: r.symbol ? s * 0.88 : n.width,
      ascent: r.symbol ? s * 0.72 : n.actualBoundingBoxAscent,
      descent: r.symbol ? s * 0.08 : n.actualBoundingBoxDescent,
      inkLeft: r.symbol ? s * 0.025 : -n.actualBoundingBoxLeft,
      inkRight: r.symbol ? s * 0.825 : n.actualBoundingBoxRight
    };
  });
}
function Yt(e, t, s, a) {
  const r = [];
  let n = [];
  for (const l of t) {
    if (l.newline) {
      r.push(fe(e, n, a)), n = [];
      continue;
    }
    const i = n.length && l.space ? [{ text: " ", italic: l.pieces[0]?.italic ?? !1, symbol: !1 }] : [], o = fe(e, [...n, ...i, ...l.pieces], a);
    n.length && o.reduce((h, u) => h + u.width, 0) > s ? (r.push(fe(e, n, a)), n = [...l.pieces]) : n.push(...i, ...l.pieces);
  }
  return n.length && r.push(fe(e, n, a)), r;
}
function bt(e, t, s, a) {
  const r = Yt(e, t, s, a);
  if (r.length < 2) return r;
  const n = /* @__PURE__ */ new Map(), l = (c, g) => {
    const d = `${c}:${g}`;
    let m = n.get(d);
    if (!m) {
      const p = [];
      for (let v = c; v < g; v++) {
        const S = t[v];
        v > c && S.space && p.push({ text: " ", italic: S.pieces[0]?.italic ?? !1, symbol: !1 }), p.push(...S.pieces);
      }
      m = fe(e, p, a), n.set(d, m);
    }
    return m;
  }, i = /* @__PURE__ */ new Map(), o = (c, g) => {
    if (!g) return c === t.length ? { cost: 0, cuts: [] } : null;
    const d = `${c}:${g}`;
    if (i.has(d)) return i.get(d);
    let m = null;
    for (let p = c + 1; p <= t.length - g + 1; p++) {
      const v = l(c, p).reduce((k, f) => k + f.width, 0);
      if (v > s) break;
      const S = o(p, g - 1);
      if (!S) continue;
      const w = S.cost + (s - v) ** 2;
      (!m || w < m.cost) && (m = { cost: w, cuts: [p, ...S.cuts] });
    }
    return i.set(d, m), m;
  }, h = o(0, r.length);
  if (!h) return r;
  let u = 0;
  return h.cuts.map((c) => {
    const g = l(u, c);
    return u = c, g;
  });
}
function ft(e, t, s, a, r = !1) {
  const n = Ms(t);
  if (!r || n.length > 64) return Yt(e, n, s, a);
  const l = [];
  let i = [];
  for (const o of n)
    o.newline ? (l.push(...i.length ? bt(e, i, s, a) : [[]]), i = []) : i.push(o);
  return i.length && l.push(...bt(e, i, s, a)), l;
}
const De = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function se(e, t, s, a = 24, r = 15, n = De) {
  e.save(), e.letterSpacing = "0px", e.textBaseline = "alphabetic", e.textAlign = "left";
  try {
    let l, i = a;
    do {
      const o = [], h = [];
      let u = 0, c;
      for (const f of t) {
        let y = i, C = ft(
          e,
          f.runs,
          s.width,
          y,
          n.balanceLines
        );
        if (f.role === "flavor" && n.flavorOrphans !== !1 && C.length > 2 && C.at(-1).reduce((D, A) => D + A.width, 0) < s.width * 0.3)
          for (let D = y - 0.25; D >= y * 0.94; D -= 0.25) {
            const A = ft(
              e,
              f.runs,
              s.width,
              D,
              n.balanceLines
            );
            if (A.length < C.length) {
              y = D, C = A;
              break;
            }
          }
        if (C.length) {
          c && (c === "rules" && f.role === "flavor" ? u += i * n.flavorGap : (c !== "flavor" || f.role !== "flavor") && (u += i * n.paragraphGap));
          for (const D of C) {
            const A = Math.max(0, ...D.map((U) => U.ascent)), R = Math.max(0, ...D.map((U) => U.descent)), M = D.reduce((U, X) => U + X.width, 0), G = s.x + (f.align === "right" ? s.width - M : f.align === "center" ? (s.width - M) / 2 : 0);
            let O = 0, T = 1 / 0, I = -1 / 0;
            for (const U of D)
              T = Math.min(T, O + U.inkLeft), I = Math.max(I, O + U.inkRight), O += U.width;
            o.push({
              x: G,
              runs: D,
              role: f.role,
              baseline: u,
              width: M,
              inkBounds: [
                G + (D.length ? T : 0),
                u - A,
                D.length ? I - T : 0,
                A + R
              ]
            }), u += y * n.leading;
          }
          c = f.role;
        }
      }
      if (n.flavorSeparator !== !1)
        for (let f = 1; f < o.length; f++) {
          const y = o[f - 1], C = o[f];
          if (y.role !== "rules" || C.role !== "flavor") continue;
          const D = y.inkBounds[1] + y.inkBounds[3];
          h.push((D + C.inkBounds[1]) / 2 - 0.3);
        }
      const g = o[0]?.inkBounds[1] ?? 0, d = o.at(-1)?.inkBounds, m = d ? d[1] + d[3] - g : 0, p = Math.max(0, s.height - m), v = s.y + Math.max(0, Math.min(p, p / 2 + (n.centerOffset ?? 0))), S = Math.max(s.y, s.verticalLimits?.[0] ?? s.y), w = Math.min(
        s.y + s.height,
        s.verticalLimits?.[1] ?? s.y + s.height
      ), k = Math.max(S, Math.min(w - m, v)) - g;
      if (l = {
        size: i,
        x: s.x,
        top: g + k,
        width: s.width,
        height: m,
        overflow: m > w - S + 0.01 || o.some((f) => f.width > s.width + 0.01),
        lines: o.map((f) => ({
          ...f,
          baseline: f.baseline + k,
          inkBounds: [
            f.inkBounds[0],
            f.inkBounds[1] + k,
            f.inkBounds[2],
            f.inkBounds[3]
          ]
        })),
        separators: h.map((f) => f + k)
      }, l.overflow ||= l.lines.some(
        (f) => s.exclusions?.some(([y, C, D, A]) => {
          const [R, M, G, O] = f.inkBounds;
          return R < y + D && R + G > y && M < C + A && M + O > C;
        })
      ), !l.overflow || i <= r) break;
      i = Math.max(r, i - 0.25);
    } while (!0);
    return l;
  } finally {
    e.restore();
  }
}
function Ht(e, t, s, a, r, n, l, i, o = 1 / 0) {
  const h = (d) => (d.align === void 0 || d.align === "center") && d.runs.length > 0 && d.runs.every((m) => !m.text.includes(`
`));
  if (!s.length || !s.every(h) || !t.every(h)) return null;
  const u = s.map((d) => d.runs.map((m) => m.text).join("")).join(`
`);
  if (Array.from(u.replace(/\{[^}]+\}/g, "●")).length > o) return null;
  const c = (d) => d.map((m) => ({ ...m, align: "center" })), g = se(e, c(s), a, r, r, i);
  return g.overflow || g.lines.length > l ? null : se(e, c(t), a, r, n, i);
}
const Bs = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function js(e) {
  return !Bs.has(e?.trim().toLowerCase() ?? "");
}
function Ds(e, t, s = j, a = 1) {
  const r = V(t), n = {
    ...De,
    flavorSeparator: js(t.setCode)
  }, [l, i, o, h] = r.rules, u = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((d) => ({ role: "rules", runs: [{ text: d }] })), c = {
    x: l * b + 3.5,
    y: i * s + 7,
    width: o * b - 9.5,
    height: h * s - 8,
    // Fit actual line ink around the existing power/toughness plate. Short
    // final lines can use the lower left area without being painted over.
    exclusions: t.power != null && t.toughness != null ? [
      [
        r.stats[0] * b - 2,
        r.stats[1] * s - 2,
        r.stats[2] * b + 4,
        r.stats[3] * s + 4
      ]
    ] : []
  }, g = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? u : u;
  if (t.rulesAlignment?.mode !== "left" && ["10e", "m10", "m11", "m12", "m13", "m14"].includes(t.setCode?.toLowerCase() ?? "") && g.every((d) => d.role === "rules")) {
    const d = Ht(
      e,
      u,
      g,
      c,
      24.5 * a,
      15 * a,
      3,
      { ...n, balanceLines: !0 }
    );
    if (d) return d;
  }
  return se(
    e,
    t.rulesAlignment?.mode === "left" ? u.map((d) => ({ ...d, align: "left" })) : u,
    c,
    24.5 * a,
    15 * a,
    n
  );
}
function et(e, t, s, a = J, r = 0) {
  if (t.overflow) throw Error("Magic rules text does not fit the available area.");
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", e.letterSpacing = "0px";
  for (const i of t.separators) {
    const o = e.createLinearGradient(t.x, i, t.x + t.width, i);
    o.addColorStop(0, "#17140f00"), o.addColorStop(0.15, "#17140f55"), o.addColorStop(0.85, "#17140f55"), o.addColorStop(1, "#17140f00"), e.fillStyle = o, e.fillRect(t.x, i, t.width, 0.6);
  }
  e.fillStyle = "#17140f";
  const n = r > 0 ? document.createElement("canvas") : null;
  n && (n.width = e.canvas.width, n.height = e.canvas.height);
  const l = n ? n.getContext("2d") : e;
  if (!l) throw Error("Missing rules text context");
  n && (l.setTransform(e.getTransform()), l.textAlign = "left", l.textBaseline = "alphabetic", l.letterSpacing = "0px", l.fillStyle = "#17140f");
  for (const i of t.lines) {
    let o = i.x ?? t.x;
    for (const h of i.runs)
      h.symbol ? a(
        e,
        h.text,
        o + h.size * 0.025,
        i.baseline - h.size * 0.72,
        h.size * 0.8,
        s
      ) : (l.font = He(h.size, h.italic), l.fillText(h.text, o, i.baseline)), o += h.width;
  }
  if (n) {
    l.globalCompositeOperation = "destination-out", l.lineJoin = "round";
    for (const i of t.lines) {
      let o = i.x ?? t.x;
      for (const h of i.runs)
        h.symbol || (l.font = He(h.size, h.italic), l.lineWidth = h.size * r * 2, l.strokeText(h.text, o, i.baseline)), o += h.width;
    }
    e.resetTransform(), e.drawImage(n, 0, 0), n.width = n.height = 0;
  }
  e.restore();
}
const Le = (e) => e?.runs.map((t) => t.text).join("") ?? "", pt = (e) => e.length === 2 && /^[A-Za-z ,]+$/.test(Le(e[0])) && Le(e[0]).length <= 20;
function Ls(e, t, s, a, r, n, l, i) {
  const o = (d) => d.role === "rules" && d.runs.length > 0 && !Le(d).includes(`
`) && d.align === void 0;
  if (!s.length || !s.every(o) || t.some((d) => d.align) || s.length !== 1 && !pt(s)) return null;
  const h = (d) => d.map(
    (m, p) => ({
      ...m,
      align: m.align ?? (m.role === "flavor" || pt(d) && p === 0 && !/^Enchant\b/.test(Le(m)) ? "left" : "center")
    })
  ), u = { x: 70, y: a - 6, width: 348, height: r - 8 }, c = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, g = se(e, h(s), u, n, n, c);
  return g.overflow || g.lines.length > 5 ? null : se(
    e,
    h(t),
    { ...u, verticalLimits: i },
    n,
    l,
    c
  );
}
function qt(e) {
  return e.rulesParagraphs ?? e.rulesText.split(`
`).filter(Boolean).map((t) => ({ role: "rules", runs: [{ text: t }] }));
}
function Ea(e, t, s = "oracle", a = {}) {
  const r = t[s];
  if (!r) throw Error(`Missing ${s} printing wording`);
  if (typeof r.typeLine != "string" || typeof r.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const n = a.rulesAlignment ?? s, l = n === "left" ? void 0 : t[n];
  if (n !== "left" && !l) throw Error(`Missing ${n} alignment wording`);
  const i = ee({ ...e, typeLine: t.oracle.typeLine });
  return {
    ...e,
    ...r,
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: r.rulesParagraphs,
    rulesAlignment: l ? { mode: "auto", reference: qt(l) } : { mode: "left" },
    artifact: e.artifact ?? i.artifact,
    land: e.land ?? i.land,
    creature: e.creature ?? i.creature,
    legendary: e.legendary ?? i.legendary,
    wordingMode: s,
    symbolStyle: a.symbolStyle ?? (s === "oracle" ? "modern" : "original")
  };
}
const be = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: !1,
  flavorSeparator: !1
};
function As(e, t) {
  if (Ve(t)) return null;
  const [s, a, r, n] = z(Ke(t).rules), l = Xe(t), i = l?.paragraphs ?? qt({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), o = t.rulesAlignment?.mode === "left", h = o ? i.map((R) => ({ ...R, align: "left" })) : i, u = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? h : h, c = t.wordingMode === "oracle" ? 10 : 15, g = t.setCode?.toLowerCase(), d = g === "lea" && t.wordingMode === "oracle" ? [428, 590] : void 0, m = ["lea", "leb", "2ed"].includes(g ?? ""), p = m || g === "3ed" && K(t) === "fourth";
  if (p && !o) {
    const R = Ls(
      e,
      h,
      u,
      a,
      n,
      m ? 32.5 : 27.5,
      c,
      d
    );
    if (R) return R;
  }
  const v = u.length === 1 ? u[0] : void 0, S = v?.runs.length === 1 ? v.runs[0] : void 0;
  if (!o && g === "4ed" && K(t) === "fourth" && u.some((R) => R.role === "flavor")) {
    const R = Ht(
      e,
      h,
      u,
      { x: 72, y: a + 2, width: 344, height: n - 8 },
      25,
      c,
      5,
      {
        ...be,
        leading: 1.1,
        paragraphGap: 0,
        flavorGap: 0,
        balanceLines: !0
      },
      150
    );
    if (R) return R;
  }
  const w = !o && g === "4ed" && K(t) === "fourth" && h.every((R) => R.align === void 0 || R.align === "center") && v?.role === "rules" && (v.align === void 0 || v.align === "center") && S && !S.italic && !S.text.includes(`
`) && S.text.length > 0 && S.text.length <= 100, k = (p || g === "4ed" && K(t) === "fourth") && (h.length > 1 || h.reduce((R, M) => R + M.runs.reduce((G, O) => G + O.text.length, 0), 0) > 100), f = k && p, y = k && g === "4ed", C = (g === "mir" || g === "tmp") && !l && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") && de(t).join("") === "W", D = se(
    e,
    w ? h.map((R) => ({ ...R, align: "center" })) : h,
    {
      x: p ? 70 : y || w ? 72 : s,
      y: a + (l ? 1.5 : w ? -6 : y ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: p ? 346 : y || w ? 344 : r + (C ? 10 : 0),
      height: n - 8,
      verticalLimits: d
    },
    l ? 24 : w ? 25 : 22.5,
    c,
    w ? { ...be, leading: 1, balanceLines: !0 } : k ? {
      ...be,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: f ? -10 : 0
    } : be
  ), A = h.reduce(
    (R, M) => R + M.runs.reduce((G, O) => G + O.text.length, 0),
    0
  );
  return !f || A <= 270 || D.size >= 22 ? D : se(
    e,
    h,
    { x: 70, y: a + 4, width: 346, height: n + 8, verticalLimits: d },
    15.5,
    c,
    {
      ...be,
      leading: 1.25,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: -18
    }
  );
}
function Gs(e) {
  return e.setCode?.toLowerCase() === "3ed" && K(e) === "fourth";
}
function Ws(e, t, s, a, r) {
  e.save(), e.font = '26px "CardRenderer MTG Goudy", Georgia', Qe(e, t, 40, a, r + s - 40, 1), e.restore();
}
function Os(e, t, s) {
  e.save(), e.font = '26px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "right", ys(e, t, 451, s + 12, 130, 1.25), e.restore();
}
function Es(e, t) {
  e.save(), e.font = '22px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", Qe(e, `Illus. © ${t}`, 50, 642, 338, 1.25), e.restore();
}
function Is(e) {
  return ["4ed", "5ed"].includes(e.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(e.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function wt(e) {
  const t = String(e.toughness ?? ""), s = e.wordingMode !== "oracle" && e.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(t) ? `(${t})` : t;
  return `${e.power ?? ""}/${s}`;
}
function Us(e) {
  const t = e.setCode?.toLowerCase(), s = t === "4ed" && !/\bLand\b/.test(e.typeLine ?? "");
  if (t !== "mir" && t !== "tmp" && !s) return null;
  const a = de(e);
  return {
    titleX: s ? 42.5 : void 0,
    titleYOffset: s ? -5 : 0,
    typeX: s ? 42.5 : void 0,
    manaRight: s ? 446.5 : 448,
    manaTop: s ? 27.5 : 33.5,
    manaSize: 23.4,
    manaGap: s ? 3.6 : 1.7,
    statsShadow: s ? 1 : 1.5,
    statsOpaqueShadow: !s,
    setRight: t === "mir" ? 434 : 432.5,
    setCenterY: t === "mir" ? 388 : 387.5,
    setHeight: t === "mir" ? 26 : 23.4,
    setOutline: 1.25,
    artistX: s ? 42.5 : 52,
    artistBaseline: s ? 628.5 : 624,
    artistSize: 19.5,
    legalBaseline: s ? 640.5 : 637.5,
    legalSize: 10.5,
    legalLight: s ? /\bArtifact\b/.test(e.typeLine ?? "") || a.length === 1 && ["B", "G"].includes(a[0]) : !/\bLand\b/.test(e.typeLine ?? "") && !(a.length === 1 && ["W", "R"].includes(a[0])),
    legalText: e.legalText === void 0 ? s ? "©1995 Wizards of the Coast, Inc. All rights reserved." : t === "mir" ? "©1996 Wizards of the Coast, Inc. All rights reserved." : "©1997 Wizards of the Coast, Inc." : e.legalText
  };
}
const tt = (e, t, s, a, r, n) => {
  if (t !== "T") return J(e, t, s, a, r, n);
  Xt(e, s, a, r, "", 0.88);
}, qe = (e, t, s, a, r, n) => {
  if (t !== "T") return Nt(e, t, s, a, r, n);
  Xt(e, s, a, r, "", 0.8);
}, $s = (e, t, s, a, r, n) => {
  if (t !== "T") return J(e, t, s, a, r, n);
  tt(e, t, s, a, r, n);
}, Ps = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function _s(e) {
  const t = e?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(t) || ["lea", "leb", "2ed", "arn", "atq"].includes(t) ? qe : t === "4ed" ? $s : Ps.has(t) ? tt : J;
}
function Xt(e, t, s, a, r, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#c9c4be", e.beginPath(), e.arc(t + a / 2, s + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = `${a * n}px "CardRenderer MTG Historic Symbols"`, e.textAlign = "left", e.textBaseline = "alphabetic";
  const l = e.measureText(r);
  e.fillText(
    r,
    t + (a - l.actualBoundingBoxLeft - l.actualBoundingBoxRight) / 2 + l.actualBoundingBoxLeft,
    s + (a + l.actualBoundingBoxAscent - l.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function Fs(e, t, s, a, r, n, l, i = [0, 0, 1, 1], o = null) {
  const h = document.createElement("canvas"), u = Math.ceil(l * 2) + 1;
  h.width = Math.ceil(r * 2) + u * 2, h.height = Math.ceil(n * 2) + u * 2;
  const c = h.getContext("2d");
  c.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    u,
    u,
    r * 2,
    n * 2
  ), c.globalCompositeOperation = "source-in", c.fillStyle = "#fff", c.fillRect(0, 0, h.width, h.height), e.save(), e.shadowColor = "transparent";
  for (let g = 0; l > 0 && g < 16; g++) {
    const d = g * Math.PI / 8;
    e.drawImage(
      h,
      s - u / 2 + Math.cos(d) * l,
      a - u / 2 + Math.sin(d) * l,
      h.width / 2,
      h.height / 2
    );
  }
  if (c.fillStyle = "#17140f", o) {
    const g = c.createLinearGradient(u, u, u + r * 2, u);
    o.forEach((d, m) => g.addColorStop(m / 2, d)), c.fillStyle = g;
  }
  c.fillRect(0, 0, h.width, h.height), e.drawImage(h, s - u / 2, a - u / 2, h.width / 2, h.height / 2), e.restore(), h.width = h.height = 0;
}
function Ns(e, t, s) {
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", t.artist && (e.fillStyle = "#f2eee3", e.shadowColor = "#000", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = `${s.artistSize}px "CardRenderer MTG MPlantin", Georgia`, e.fillText(`Illus. ${t.artist}`, s.artistX, s.artistBaseline, 338)), e.shadowColor = "transparent", e.fillStyle = s.legalLight ? "#f2eee3" : "#17140f", e.font = `${s.legalSize}px "CardRenderer MTG MPlantin", Georgia`, s.legalText && e.fillText(s.legalText, s.artistX, s.legalBaseline, 380), e.restore();
}
function xs(e, t, s, a, r) {
  const n = Ke(t), l = Us(t), i = Gs(t);
  if (r === "artwork") {
    je(e, t, s, z(n.art), r);
    return;
  }
  e.fillStyle = ht(t), e.fillRect(0, 0, 488, 680), e.fillStyle = "#686050", e.fillRect(24.4, 27.2, 439.2, 625.6), e.fillStyle = "#e5dec5", e.fillRect(...z(n.rules)), e.fillStyle = "#746b58", e.fillRect(...z(n.art)), a && e.drawImage(a, 0, 0, 488, 680), je(e, t, s, z(n.art), r);
  const o = s.get(ge(t));
  if (o && (e.save(), e.filter = U0(t), e.drawImage(o, ...z(n.frame)), ge(t).endsWith("/seventh/regular/m.png") && ms(e, o), e.restore()), te(t) !== "black" || K(t) === "fourth") {
    const E = s.get(Ot(t));
    if (E) {
      const $ = document.createElement("canvas");
      $.width = 732, $.height = 1020;
      const P = $.getContext("2d");
      P.drawImage(E, 0, 0, 732, 1020), P.globalCompositeOperation = "source-in", P.fillStyle = ht(t), P.fillRect(0, 0, 732, 1020), e.drawImage($, ...z(n.frame)), $.width = $.height = 0;
    }
  }
  e.fillStyle = ut(t), e.textBaseline = "middle", e.textAlign = "left", e.letterSpacing = "0px";
  const [h, u, c, g] = z(n.title), d = t.manaSymbols ?? [], m = l?.manaSize ?? 23.4, p = l?.manaGap ?? 1.7, v = d.length * (m + p), S = l ? l.manaRight - v + p : h + c - v;
  e.shadowColor = "#000b", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const w = l?.titleX ?? h, k = u + g / 2 + (l?.titleYOffset ?? 0), f = Math.max(
    1,
    d.length ? S - w - 5 : l?.titleX == null ? c - 5 : h + c - w - 5
  );
  i ? Ws(e, t.name, w, k, f) : e.fillText(t.name, w, k, f);
  const y = t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle", C = t.symbolStyle === "original" || t.symbolStyle === void 0 && t.wordingMode === "original", D = C && ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  i ? vs(e, d, s, y) : ["lea", "2ed"].includes(t.setCode?.toLowerCase() ?? "") ? ks(e, d, s, y) : d.forEach(
    (E, $) => (D ? Nt : J)(
      e,
      E,
      S + $ * (m + p),
      l?.manaTop ?? u + g / 2 - m / 2,
      m,
      s,
      !l
    )
  );
  const [A, R, M, G] = z(n.type), O = Et(t) ?? "", T = s.get(O), I = bs(t), U = fs(t);
  if (e.font = '21.7px "CardRenderer MTG MPlantin", Georgia', e.fillText(
    Xe(t)?.typeLine ?? t.typeLine ?? "",
    l?.typeX ?? A,
    R + G / 2,
    T ? Math.min(M - 48, I ? I.right - I.width - A - 6 : M) : M
  ), T) {
    const E = Math.min(44 / T.width, (l?.setHeight ?? 23.4) / T.height), $ = I?.width ?? T.width * E, P = I?.height ?? T.height * E, Y = I?.right ?? l?.setRight ?? A + M, Q = I?.centerY ?? l?.setCenterY ?? R + G / 2, le = I?.crop ?? [0, 0, 1, 1], ae = !t.setSymbol && s.get($t(O));
    ae && (e.save(), e.shadowColor = "transparent", t.setCode?.toLowerCase() === "arn" && (e.filter = "brightness(0.7)"), e.drawImage(
      ae,
      le[0] * ae.width,
      le[1] * ae.height,
      le[2] * ae.width,
      le[3] * ae.height,
      Y - $,
      Q - P / 2,
      $,
      P
    ), e.restore()), U || l || d0(t.setCode) ? Fs(
      e,
      T,
      Y - $,
      Q - P / 2,
      $,
      P,
      I?.outline ?? (U ? 2 : l?.setOutline ?? m0(t.setCode)),
      le,
      U
    ) : _t(
      e,
      T,
      t.setCode,
      t.rarity,
      A + M - T.width * E,
      R + G / 2 - T.height * E / 2,
      T.width * E,
      T.height * E
    );
  }
  e.shadowColor = "transparent";
  const [X, Z, ne, N] = z(n.rules);
  e.fillStyle = "#17140f";
  const _ = s.get(Ve(t) ?? "");
  if (_) {
    const E = Math.min(ne * 0.4 / _.width, N * 0.75 / _.height);
    e.drawImage(
      _,
      X + (ne - _.width * E) / 2,
      Z + (N - _.height * E) / 2,
      _.width * E,
      _.height * E
    );
  } else {
    const E = As(e, t);
    E && et(
      e,
      E,
      s,
      y ? J : C ? _s(t.setCode) : t.setCode?.toLowerCase() === "3ed" ? qe : l ? tt : J,
      t.setCode?.toLowerCase() === "lea" ? 0.012 : 0
    );
  }
  if (e.shadowColor = l?.statsOpaqueShadow ? "#000" : "#000b", l && (e.shadowOffsetX = e.shadowOffsetY = l.statsShadow * e.getTransform().a), e.fillStyle = ut(t), e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", t.power != null && t.toughness != null) {
    const [E, $, P, Y] = z(n.stats), Q = Is(t);
    e.textAlign = Q ? "right" : "center", i ? Os(e, wt(t), $ + Y / 2) : e.fillText(
      wt(t),
      Q?.right ?? E + P / 2,
      $ + Y / 2 + (Q?.yOffset ?? 0),
      Q?.maxWidth ?? P
    );
  }
  if (i && t.artist) Es(e, t.artist);
  else if (t.artist && Rs(t)) Cs(e, t.artist);
  else if (l) Ns(e, t, l);
  else if (t.artist) {
    const [E, $, P, Y] = z(n.footer);
    e.textAlign = "center", e.font = '15.6px "CardRenderer MTG MPlantin", Georgia', e.fillText(`Illus. ${t.artist}`, E + P / 2, $ + Y / 2, P);
  }
  e.shadowColor = "transparent";
}
const Ys = (e, t = {}) => fetch(e, { ...t, mode: "cors" });
let St;
const Hs = [
  ["CardRenderer MTG Goudy", O0],
  ["CardRenderer MTG Historic Symbols", W0]
];
function qs() {
  return typeof FontFace != "function" ? Promise.resolve() : St ??= Promise.all(
    Hs.map(async ([e, t]) => {
      if ([...document.fonts].some(
        (a) => a.family.replace(/^"|"$/g, "") === e && a.status === "loaded"
      ))
        return;
      const s = await Ys(t);
      if (!s.ok) throw Error(`Retro font unavailable: ${e}`);
      document.fonts.add(await new FontFace(e, await s.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((e) => {
    throw St = void 0, e;
  });
}
const Xs = `${pe}/img/class_level_bg.webp`, zt = (e) => ["adventure", "class", "leveler"].includes(q(e)), ue = (e, t, s, a) => ({
  x: e / 63.5 * 488,
  y: t / 88.9 * 680,
  width: s / 63.5 * 488,
  height: a / 88.9 * 680
}), zs = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function Ks(e, t, s, a = 21) {
  const r = e.replace(/\{[^}]+\}/g, "●").split(`
`);
  let n = a;
  for (; n > 8 && r.reduce(
    (l, i) => l + Math.max(1, Math.ceil(i.length * n * 0.53 / t)) * n + 4,
    0
  ) > s; )
    n -= 0.5;
  return n;
}
function Ie(e) {
  const t = q(e), s = [], a = (r, n, l, i = {}) => {
    s.push({ kind: r, text: n, ...l, font: Ks(n, l.width, l.height), ...i });
  };
  if (t === "adventure") {
    const r = e.faces?.[1];
    if (!r) return [];
    const n = (r.manaSymbols ?? []).map((i) => `{${i}}`).join(""), l = (r.manaSymbols?.length ?? 0) * 2.5;
    a("heading", r.name, ue(5.6, 55.3, 25 - l, 4.2), {
      color: "white",
      font: Math.min(18, (25 - l) * 488 / 63.5 / Math.max(1, r.name.length * 0.55))
    }), a("rules", n, ue(30 - l, 55.3, l, 4.2), { color: "white", font: 17 }), a("heading", r.typeLine ?? "", ue(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (r.typeLine ?? "").length * 0.52))
    }), a("rules", r.rulesText ?? "", ue(5.6, 64.5, 24.7, 15.6)), a("rules", e.rulesText ?? e.faces?.[0]?.rulesText ?? "", ue(33, 54.9, 25.5, 25));
  } else if (t === "class") {
    const [r, n, l, i] = V(e).rules.map(
      (k, f) => k * (f % 2 ? j : b)
    ), o = ee(e);
    a(
      "band",
      "",
      { x: r, y: n, width: l, height: i },
      {
        fill: "#e3d8bb",
        asset: H(
          "saga_textboxes",
          o.boxes === "Colourless" ? "Land" : o.boxes
        )
      }
    );
    const h = [];
    for (const k of (e.rulesText ?? "").split(`
`).filter(Boolean))
      h.length && !/^.*:\s*Level\s+\d+\s*$/i.test(k) && !/^.*:\s*Level\s+\d+\s*$/i.test(h.at(-1)) && !h.at(-1).startsWith("(") ? h[h.length - 1] += `
` + k : h.push(k);
    const u = (k) => /^.*:\s*Level\s+\d+\s*$/i.test(k), c = 28, g = 20, d = (k, f) => k.split(`
`).reduce(
      (y, C) => y + Math.max(1, Math.ceil(C.length * f * 0.53 / (l - 10))),
      0
    ), m = h.map(
      (k) => u(k) ? c : d(k, k.startsWith("(") ? 16 : g) * (k.startsWith("(") ? 16 : g) + 8
    ), p = h.filter((k) => !u(k)).length, v = Math.max(0, i - m.reduce((k, f) => k + f, 0)) / Math.max(1, p), S = Math.min(
      1,
      (i - h.filter(u).length * c) / m.reduce((k, f, y) => k + (u(h[y]) ? 0 : f), 0)
    );
    let w = n;
    h.forEach((k, f) => {
      const y = u(k), C = y ? c : m[f] * S + v;
      if (y) {
        const [D, A] = k.split(/:\s*/);
        a("band", "", { x: r, y: w, width: l, height: C }, { asset: Xs }), a("rules", D + ":", { x: r + 5, y: w, width: l / 2 - 5, height: C }, { font: 18 }), a(
          "heading",
          A,
          { x: r + l / 2, y: w, width: l / 2 - 5, height: C },
          { font: 18, align: "right" }
        );
      } else
        a(
          "rules",
          k,
          { x: r + 5, y: w + 4, width: l - 10, height: C - 8 },
          { font: (k.startsWith("(") ? 16 : g) * S, italic: k.startsWith("(") }
        );
      w += C;
    });
  } else if (t === "leveler") {
    const r = e.rulesText ?? "", n = r.split(/^LEVEL\s+([^\n]+)\n/gm), l = [
      {
        range: "",
        text: n[0] ?? "",
        stats: e.power != null && e.toughness != null ? `${e.power}/${e.toughness}` : ""
      }
    ];
    for (let u = 1; u < n.length; u += 2) {
      const c = n[u + 1] ?? "", g = c.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      l.push({
        range: n[u],
        stats: g?.[1] ?? "",
        text: g ? c.slice(g[0].length) : c
      });
    }
    const i = ue(4.9, 55.6, 53.7, 25.5), o = i.height / l.length, h = zs[ee(e).frame] ?? "#dcc8af";
    l.forEach((u, c) => {
      const g = i.y + c * o;
      c && a(
        "band",
        "",
        { x: i.x, y: g, width: i.width, height: o },
        { fill: c % 2 ? "#00000018" : "#00000028" }
      );
      const d = u.range ? 55 : 7, m = u.stats ? 72 : 7;
      a("rules", u.text, {
        x: i.x + d,
        y: g + 4,
        width: i.width - d - m,
        height: o - 8
      }), u.range && a(
        "level",
        `LEVEL
${u.range}`,
        { x: i.x - 12, y: g + o / 2 - 23, width: 65, height: 46 },
        { fill: h, font: 13 }
      ), u.stats && a(
        "stats",
        u.stats,
        { x: i.x + i.width - 68, y: g + o / 2 - 22, width: 77, height: 44 },
        { asset: H("pt-boxes", ee(e).pt), font: 26 }
      );
    });
  }
  return s;
}
function Vs(e) {
  return Ie(e).flatMap((t) => [
    t.asset ?? null,
    ...Ae(t.text).flatMap((s) => s.symbol ? [Ge(s.symbol)] : [])
  ]);
}
function Zs(e) {
  return zt(e) ? Ie(e) : null;
}
function Js(e, t, s) {
  for (const a of Ie(t)) {
    const { x: r, y: n, width: l, height: i, font: o } = a;
    e.save(), e.textAlign = "left", e.fillStyle = a.fill ?? "transparent", a.kind === "level" ? (e.beginPath(), e.moveTo(r, n), e.lineTo(r + l * 0.72, n), e.lineTo(r + l, n + i / 2), e.lineTo(r + l * 0.72, n + i), e.lineTo(r, n + i), e.closePath(), e.fill(), e.strokeStyle = "#0008", e.lineWidth = 1, e.stroke()) : a.fill && e.fillRect(r, n, l, i);
    const h = a.asset ? s.get(a.asset) : null;
    if (h && e.drawImage(h, r, n, l, i), e.beginPath(), e.rect(r, n, l, i), e.clip(), e.fillStyle = a.color ?? "#17140f", ["stats", "level"].includes(a.kind)) {
      e.font = `${o}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
      const u = a.text.split(`
`);
      u.forEach(
        (c, g) => e.fillText(
          c,
          r + l * (a.kind === "level" ? 0.43 : 0.5),
          n + i / 2 + (g - (u.length - 1) / 2) * o,
          l * 0.85
        )
      );
    } else if (a.align === "right")
      e.font = `${o}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "right", e.textBaseline = "middle", e.fillText(a.text, r + l, n + i / 2, l);
    else {
      e.font = `${a.italic ? "italic " : ""}${o}px "CardRenderer MTG MPlantin", Georgia`;
      const u = Je(e, a.text, l, o).length * o + (a.text.split(`
`).length - 1) * L.paragraphGap;
      Pt(
        e,
        a.text,
        r,
        n + Math.max(0, (i - u) / 2),
        l,
        { size: o, italic: !!a.italic },
        s
      );
    }
    e.restore();
  }
}
function Se(e) {
  if (!["split", "aftermath"].includes(e.layout ?? "") || e.faces?.length !== 2) return [];
  const t = e.layout === "aftermath" || /\bAftermath\b/.test(e.faces[1].rulesText ?? "");
  return e.faces.map((s, a) => {
    const r = t ? 0.615 : 0.5, n = {
      setCode: e.setCode,
      rarity: e.rarity,
      artist: e.artist,
      ...s,
      layout: t ? a === 0 ? "aftermath-top" : "aftermath-bottom" : "split-half",
      faces: void 0,
      rulesText: s.rulesText?.split(`
`).filter((l) => !/^Fuse\b/.test(l)).join(`
`),
      illustration: s.illustration ?? e.illustration,
      etchedIllustration: s.etchedIllustration ?? (s.illustration ? void 0 : e.etchedIllustration),
      illustrationCrop: s.illustrationCrop ?? (!s.illustration && e.illustration ? [a ? r : 0, 0, a ? 1 - r : r, 1] : void 0)
    };
    return t ? a === 0 ? { face: n, x: 0, y: 0, width: 488, height: 375, rotation: 0 } : { face: n, x: 488, y: 367, width: 276, height: 488, rotation: 90 } : {
      face: n,
      x: 5,
      y: (a ? 333 : 648) - (st(e) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function Ia(e) {
  return {
    left: `${e.x / b * 100}%`,
    top: `${e.y / j * 100}%`,
    width: `${e.width / b * 100}%`,
    height: `${e.height / j * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function Kt(e, t) {
  e.translate(t.x, t.y), e.rotate(t.rotation * Math.PI / 180), e.scale(t.width / b, t.width / b);
}
function vt(e, t) {
  const s = t[0] * e.width, a = t[1] * e.height, r = t[2] * e.width, n = t[3] * e.height;
  return e.rotation === -90 ? [
    (e.x + a) / b,
    (e.y - s - r) / j,
    n / b,
    r / j
  ] : e.rotation === 90 ? [
    (e.x - a - n) / b,
    (e.y + s) / j,
    n / b,
    r / j
  ] : [(e.x + s) / b, (e.y + a) / j, r / b, n / j];
}
function Qs(e) {
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? 1.5 : 1;
}
function st(e) {
  return /\bFuse\b/.test(e.rulesText ?? "") || !!e.faces?.some((t) => /^Fuse\b/m.test(t.rulesText ?? ""));
}
const ea = 5, ta = 0.02655 * j + 0.91339 * b * 3810 / 2736;
function at(e) {
  const t = e ? 382 : 429;
  return { top: t, scale: 1 - ea / (ta - t) };
}
function sa(e) {
  const { top: t, scale: s } = at(e);
  return [t + 6, t + (625 - t) * s - 4];
}
function kt(e, t, s, a, r, n) {
  const { top: l, scale: i } = at(n), o = t.height * r / t.width, h = Math.max(0, Math.min(o, l - a)), u = h * t.width / r;
  h > 0 && e.drawImage(t, 0, 0, t.width, u, s, a, r, h), h < o && e.drawImage(
    t,
    0,
    u,
    t.width,
    t.height - u,
    s,
    a + h,
    r,
    (o - h) * i
  );
}
function aa(e, t, s) {
  const a = e.rulesParagraphs?.filter((l) => l.role === "rules")[s], r = (e.rulesText ?? "").split(`
`).filter((l) => l.trim())[s];
  if (!a || a.runs.map((l) => l.text).join("") !== r) return [{ text: t }];
  let n = r.length - t.length;
  return a.runs.flatMap((l) => {
    const i = Math.min(n, l.text.length);
    return n -= i, i === l.text.length ? [] : [{ ...l, text: l.text.slice(i) }];
  });
}
function ra(e, t) {
  const s = q(t) === "planeswalker-large", a = Ee(t), r = !s && a.length < 3, n = V(t).rules, l = n[0] * b, i = n[1] * j, o = n[2] * b, h = n[3] * j - (s ? 24 : r ? 4 : 16), u = s ? 8 : r ? 3 : 0, c = s ? { ...De, leading: 0.9 } : De, g = a.map((R, M) => ({
    ...R,
    runs: aa(t, R.text, M),
    left: R.badges.length ? 67 : 45
  })), d = (R) => g.map(
    (M) => se(
      e,
      [{ role: "rules", runs: M.runs }],
      { x: l + M.left, y: 0, width: o - M.left - 8, height: 1e3 },
      R,
      R,
      c
    )
  );
  let m = s ? 17.5 : r ? 24 : 19, p = d(m);
  const [v, S] = sa(s), w = () => {
    const R = h / Math.max(1, g.length), M = p.map((T, I) => i + u + R * (I + 0.5) - T.height / 2);
    let G = v - 8;
    for (let T = 0; T < M.length; T++)
      M[T] = Math.max(M[T], G + 8), G = M[T] + p[T].height;
    let O = S + 8;
    for (let T = M.length - 1; T >= 0; T--)
      M[T] = Math.min(M[T], O - 8 - p[T].height), O = M[T];
    return M;
  }, k = () => (w()[0] ?? v) >= v, f = () => p.map((R) => Math.max(34, R.height + 16)), y = () => {
    const R = h / Math.max(1, g.length);
    return p.every((M, G) => {
      const O = R * (G + 0.5);
      return O - M.height / 2 >= 6 && O + M.height / 2 <= h + 6 && (!G || R - (M.height + p[G - 1].height) / 2 >= 8);
    });
  };
  for (; m > 8 && (f().reduce((R, M) => R + M, 0) > h || !y() || !k()); )
    m -= 0.25, p = d(m);
  const C = h / Math.max(1, g.length), D = w();
  let A = u;
  return g.map((R, M) => {
    const G = C, O = p[M].height, T = se(
      e,
      [{ role: "rules", runs: R.runs }],
      {
        x: l + R.left,
        y: D[M],
        width: o - R.left - 8,
        height: O
      },
      m,
      m,
      c
    );
    T.overflow ||= A + G > u + h + 0.01, T.overflow ||= !y(), T.overflow ||= !k(), T.overflow ||= T.lines.some(
      (U) => U.inkBounds[1] < v - 0.01 || U.inkBounds[1] + U.inkBounds[3] > S + 0.01
    );
    const I = { ...R, top: A, height: G, font: m, width: T.width, layout: T };
    return A += G, I;
  });
}
function na(e) {
  return { font: 18, offsetY: e.startsWith("+") ? 2 : e === "0" ? 0 : -2 };
}
function Vt(e, t) {
  return e === "saga" ? /^(I|II|III|IV)$/.test(t) ? H("saga", t) : null : H(
    "planeswalker",
    t.startsWith("+") ? "LoyaltyPlus" : t === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function Zt(e, t) {
  return q(e) === "saga" ? H("saga_textboxes", t === "Colourless" ? "Land" : t) : null;
}
function la(e) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[ee(e).boxes] ?? "#dededbf0";
}
function ia(e, t) {
  const { top: s, scale: a } = at(q(t) === "planeswalker-large");
  e.save(), e.translate(0, s), e.scale(1, a), e.translate(0, -s), e.beginPath(), e.moveTo(66, s), e.lineTo(448, s), e.quadraticCurveTo(456, s, 456, s + 8), e.lineTo(456, 613), e.bezierCurveTo(456, 623, 420, 629, 257, 629), e.bezierCurveTo(94, 629, 58, 623, 58, 613), e.lineTo(58, s + 8), e.quadraticCurveTo(58, s, 66, s), e.closePath(), e.clip(), e.fillStyle = la(t), e.fillRect(58, s, 398, 629 - s), e.restore();
}
function oa(e, t, s) {
  e.fillStyle = "#17140f", e.font = '24px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "alphabetic";
  const a = e.measureText(":");
  e.fillText(
    ":",
    t,
    s + 1.5 + (a.actualBoundingBoxAscent - a.actualBoundingBoxDescent) / 2
  );
}
function ha(e, t, s) {
  const a = q(t), r = a === "saga", n = V(t).rules, l = n[0] * b, i = n[1] * j, o = n[2] * b, h = n[3] * j;
  r && (e.fillStyle = "#e3d8bb", e.fillRect(l, i, o, h));
  const u = Zt(t, ee(t).boxes), c = u ? s.get(u) : void 0;
  c && e.drawImage(c, l, i, o, h);
  const g = r ? Ts(t) : ra(e, t);
  for (const [d, m] of g.entries()) {
    if (d > 0) {
      const S = g[d - 1]?.layout, w = m.layout && S ? Math.max(S.top + S.height + 3, Math.min(i + m.top, m.layout.top - 3)) : i + m.top;
      e.fillStyle = "#0002", e.fillRect(l + (r ? 0 : 40), w, o - (r ? 0 : 40), 1.5);
    }
    if (e.fillStyle = "#17140f", e.textAlign = "left", m.layout) et(e, m.layout, s);
    else {
      e.font = `${m.reminder ? "italic " : ""}${m.font}px "CardRenderer MTG MPlantin", Georgia`;
      const S = Je(e, m.text, m.width, m.font).length * m.font;
      Pt(
        e,
        m.text,
        l + m.left,
        i + m.top + (m.height - S) / 2,
        m.width,
        { size: m.font, italic: m.reminder },
        s
      );
    }
    const p = r ? 36 : 54, v = r ? 36 : 40;
    m.badges.forEach((S, w) => {
      const k = l + (r ? -18 : 0), f = i + m.top + m.height / 2 + (w - m.badges.length / 2) * v, y = Vt(a, S), C = y ? s.get(y) : null;
      if (C) {
        if (e.save(), !r) {
          const D = e.getTransform().a;
          e.shadowColor = "#0009", e.shadowBlur = 3 * D, e.shadowOffsetY = 2 * D;
        }
        e.drawImage(C, k, f, p, v), e.restore();
      } else
        e.fillStyle = "#29231c", e.fillRect(k, f, p, v);
      if (!C || !r) {
        e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle";
        const D = na(S);
        e.font = `bold ${r ? 19 : D.font}px "CardRenderer MTG Beleren", Georgia`, e.fillText(
          S,
          k + p / 2 - (r ? 0 : 1.5),
          f + v / 2 + (r ? 0 : D.offsetY),
          p - 3
        ), r || oa(e, k + p + 4, f + v / 2);
      }
    });
  }
}
const Jt = 0.7;
function ua(e, t, s, a = !1) {
  const [r, n, l, i] = [
    s[0] * b,
    s[1] * j,
    s[2] * b,
    s[3] * j - 1
  ], o = new Path2D();
  o.moveTo(r + 14, n), o.lineTo(r + l - 14, n), o.quadraticCurveTo(r + l, n, r + l, n + 14), o.lineTo(r + l, n + i - 7), o.quadraticCurveTo(r + l, n + i, r + l - 7, n + i), o.lineTo(r + 9, n + i), o.quadraticCurveTo(r - 2, n + i, r - 2, n + i - 9), o.quadraticCurveTo(r - 2, n + 17, r + 2, n + 9), o.quadraticCurveTo(r + 5, n, r + 14, n), o.closePath(), e.save();
  const h = e.getTransform().a;
  e.shadowColor = "#0009", e.shadowBlur = 1.4 * h, e.shadowOffsetX = -1.2 * h, e.shadowOffsetY = 3.5 * h, e.fillStyle = "#191816", e.fill(o), e.shadowColor = "transparent", e.save(), e.clip(o);
  const u = t.width / l, c = [
    20 * u,
    t.height - (i - 4) * u,
    t.width - 40 * u,
    (i - 12) * u,
    r - 2,
    n,
    l + 2,
    i
  ];
  e.drawImage(t, ...c), a && (e.globalAlpha *= Jt, e.drawImage(t, ...c)), e.restore(), e.strokeStyle = "#191816", e.lineWidth = 1.2, e.stroke(o), e.restore();
}
const ca = 1.1;
function ga(e) {
  return !e.setSymbol && ["m19", "m20", "m21"].includes(e.setCode?.toLowerCase() ?? "");
}
function da(e, t, s, a, r, n, l, i, o = 1) {
  const h = !s || s === "common", u = document.createElement("canvas"), c = 2, g = 4;
  u.width = Math.ceil((n + c * 2) * g), u.height = Math.ceil((l + c * 2) * g);
  const d = u.getContext("2d");
  d.scale(g, g), d.translate(c, c), d.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    0,
    0,
    n,
    l
  ), d.globalCompositeOperation = "source-in";
  const m = s === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : s === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], p = d.createLinearGradient(0, l * 0.65, n, l * 0.35);
  p.addColorStop(0, m[0]), p.addColorStop(0.35, m[1]), p.addColorStop(0.6, m[2]), p.addColorStop(1, m[3]), d.fillStyle = h ? "#111111" : p, d.fillRect(0, 0, n, l), d.beginPath(), d.moveTo(n * 0.046, 0), d.lineTo(n * 0.953, 0), d.bezierCurveTo(
    n * 1.016,
    l * 0.38,
    n * 1.016,
    l * 0.62,
    n * 0.953,
    l
  ), d.lineTo(n * 0.046, l), d.bezierCurveTo(-n * 0.017, l * 0.62, -n * 0.017, l * 0.38, n * 0.046, 0), d.closePath(), d.globalCompositeOperation = "destination-over", d.fillStyle = h ? "#f8f8f5" : "#111111", d.fill(), d.globalCompositeOperation = "source-over", d.strokeStyle = h ? "#f8f8f5" : "#111111", d.lineWidth = o, d.stroke(), e.drawImage(
    u,
    a - c,
    r - c,
    u.width / g,
    u.height / g
  ), u.width = u.height = 0;
}
function ma(e, t, [s, a, r, n]) {
  const l = t.height * r / t.width;
  e.save(), e.beginPath(), e.rect(s, a, r, n / 2), e.clip(), e.drawImage(t, s, a + n - l + 1, r, l), e.restore();
}
function ba(e, [t, s, a, r], n) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(n)) return;
  e.save(), e.shadowColor = "transparent";
  const l = e.createLinearGradient(t, 0, t + a, 0);
  l.addColorStop(0, "rgba(255,255,255,0)"), l.addColorStop(0.025, "rgba(255,255,255,0.2)"), l.addColorStop(0.975, "rgba(255,255,255,0.2)"), l.addColorStop(1, "rgba(255,255,255,0)"), e.fillStyle = l, e.fillRect(t, s + r - 4, a, 2.3), e.restore();
}
const re = /* @__PURE__ */ new Map();
function Qt(e) {
  if (!(!e.retired || e.users)) {
    if (!e.sources) {
      e.controller.abort();
      return;
    }
    URL.revokeObjectURL(e.sources.original), URL.revokeObjectURL(e.sources.backing), e.sources = void 0;
  }
}
function Ua() {
  for (const e of re.values())
    e.retired = !0, Qt(e);
  re.clear();
}
async function fa(e, t) {
  t.throwIfAborted();
  let s = re.get(e);
  if (!s) {
    const o = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const h = await fetch(e, { mode: "cors", signal: o.controller.signal });
        if (!h.ok) throw Error(`Historical symbol ${h.status}: ${e}`);
        const u = await h.blob(), c = await ws(e, u);
        if (!c) throw Error("Missing historical symbol backing policy.");
        o.controller.signal.throwIfAborted();
        const g = URL.createObjectURL(u);
        try {
          const d = { original: g, backing: URL.createObjectURL(c) };
          return o.sources = d, d;
        } catch (d) {
          throw URL.revokeObjectURL(g), d;
        }
      })
    };
    o.promise = o.promise.catch((h) => {
      throw re.get(e) === o && re.delete(e), h;
    }), re.set(e, o), s = o;
  }
  s.users++;
  const a = s;
  let r = !1;
  const n = () => {
    r || (r = !0, a.users--, !a.users && !a.sources && (a.retired = !0, re.get(e) === a && re.delete(e)), Qt(a));
  };
  let l = () => {
  };
  const i = new Promise((o, h) => {
    l = () => {
      n(), h(t.reason);
    }, t.addEventListener("abort", l, { once: !0 });
  });
  try {
    const o = await Promise.race([a.promise, i]);
    return t.throwIfAborted(), { sources: o, release: n };
  } catch (o) {
    throw n(), o;
  } finally {
    t.removeEventListener("abort", l);
  }
}
async function pa(e, t) {
  t.throwIfAborted();
  const s = [...new Set(e.filter((o) => !!o))], a = [], r = /* @__PURE__ */ new Map(), n = () => {
    for (const o of a) o.release();
    a.length = 0;
  }, i = (await Promise.allSettled(
    s.map(async (o) => {
      if (!ps(o)) {
        r.set(o, o);
        return;
      }
      const h = await fa(o, t);
      a.push(h), r.set(o, h.sources.original), r.set($t(o), h.sources.backing);
    })
  )).find((o) => o.status === "rejected");
  if (i?.status === "rejected")
    throw n(), i.reason;
  return t.aborted && (n(), t.throwIfAborted()), { urls: [...new Set(r.values())], aliases: r, dispose: n };
}
function wa(e, t) {
  const s = /* @__PURE__ */ new Map();
  for (const [a, r] of e) {
    const n = t.get(r);
    n && s.set(a, n);
  }
  return s;
}
async function Sa(e, t) {
  return t.throwIfAborted(), fetch(e, { signal: t, mode: "cors" });
}
function va(e) {
  if (e.startsWith(`${ce}/img/frames/`) && e.endsWith(".png")) return 768;
  const t = e.startsWith(`${pe}/img/`) ? e.slice(`${pe}/img/`.length) : "";
  return t === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    t
  ) ? 768 : void 0;
}
async function ka(e) {
  if (!e.type.includes("svg")) return e;
  const t = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), s = t.documentElement;
  if (s.localName !== "svg" || t.querySelector("parsererror"))
    throw new Error("Invalid SVG asset.");
  const a = (s.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), r = a[2] ?? parseFloat(s.getAttribute("width") ?? ""), n = a[3] ?? parseFloat(s.getAttribute("height") ?? "");
  if (!(r > 0 && n > 0 && Number.isFinite(r + n)))
    throw new Error("SVG asset needs a finite viewport.");
  const l = 512 / Math.max(r, n);
  return s.hasAttribute("viewBox") || s.setAttribute("viewBox", `0 0 ${r} ${n}`), s.setAttribute("width", String(Math.max(1, Math.round(r * l)))), s.setAttribute("height", String(Math.max(1, Math.round(n * l)))), new Blob([new XMLSerializer().serializeToString(s)], { type: "image/svg+xml" });
}
async function ya(e, t, s) {
  if (t.throwIfAborted(), !e.type.includes("svg"))
    return s ? createImageBitmap(e, { resizeWidth: s, resizeQuality: "high" }) : createImageBitmap(e);
  const a = URL.createObjectURL(await ka(e)), r = new Image(), n = document.createElement("canvas"), l = () => {
    r.src = "";
  };
  t.addEventListener("abort", l, { once: !0 });
  try {
    t.throwIfAborted(), r.src = a, await r.decode(), t.throwIfAborted(), n.width = r.naturalWidth, n.height = r.naturalHeight;
    const i = n.getContext("2d", { willReadFrequently: !0 });
    if (!i || !n.width || !n.height)
      throw new Error("SVG asset could not be rasterized.");
    return i.drawImage(r, 0, 0), await createImageBitmap(n);
  } finally {
    t.removeEventListener("abort", l), r.src = "", URL.revokeObjectURL(a), n.width = 0, n.height = 0;
  }
}
async function e0(e, t) {
  const s = await pa(e, t), a = s.urls, r = /* @__PURE__ */ new Map();
  let n = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, a.length) }, async () => {
        for (; n < a.length && !t.aborted; ) {
          const i = a[n++];
          try {
            const o = await Sa(i, t);
            if (!o.ok) continue;
            const h = await o.blob(), u = await ya(h, t, va(i));
            t.aborted ? u.close() : r.set(i, u);
          } catch {
          }
        }
      })
    );
  } finally {
    s.dispose();
  }
  const l = wa(s.aliases, r);
  return {
    images: l,
    dispose: () => {
      for (const i of r.values()) i.close();
      r.clear(), l.clear();
    }
  };
}
function t0(e) {
  if (oe(e)) return P0(e);
  const t = Se(e);
  if (t.length) return t.flatMap((r) => t0(r.face));
  const s = ee(e), a = ze(s, q(e));
  return [
    ...Vs(e),
    a.background,
    a.frame,
    a.boxes,
    a.pt,
    Zt(e, s.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(q(e)) ? Ee(e).flatMap(
      (r) => r.badges.map((n) => Vt(q(e), n))
    ) : [],
    s.legendary ? a.crown : null,
    e.illustration,
    We(e),
    ...Gt(e)
  ];
}
let yt = null;
function Rt() {
  return yt ??= Promise.all([
    document.fonts.load('24px "CardRenderer MTG Beleren"'),
    document.fonts.load('700 24px "CardRenderer MTG Beleren"'),
    document.fonts.load('24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('italic 24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('14px "CardRenderer MTG Relay"'),
    document.fonts.load('14px "CardRenderer MTG Artist Credit"')
  ]).then((e) => {
    if (e.some((t) => !t.length || t.some((s) => s.status !== "loaded")))
      throw Error(
        "Magic fonts are unavailable. Load card-glint/magic/fonts.css before preparing cards."
      );
  }).catch((e) => {
    throw yt = null, e;
  });
}
function Re(e) {
  const t = V(e), s = t.art;
  return q(e).startsWith("planeswalker") ? [s[0], s[1], s[2], t.type[1] - s[1]] : s;
}
const Ct = /* @__PURE__ */ new WeakMap(), Ce = ([e, t, s, a]) => [e, 1 - t - a, e + s, 1 - t], Ra = [Ce(V({}).art), [0, 0, 0, 0]];
function $a(e) {
  if (!e) return Ra;
  const t = Ct.get(e);
  if (t) return t;
  const s = Se(e), a = s.length ? [
    Ce(vt(s[0], Re(s[0].face))),
    Ce(vt(s[1], Re(s[1].face)))
  ] : [Ce(Re(e)), [0, 0, 0, 0]];
  return Ct.set(e, a), a;
}
async function Ca(e, t, s, a, r, n, l = e0, i) {
  return s0(e, t, s, a, {
    threshold: r,
    resolveEtching: i,
    beforePaint: n,
    loadImages: l,
    height: j
  });
}
async function s0(e, t, s, a, r) {
  const { threshold: n, beforePaint: l, loadImages: i, height: o } = r, h = Se(t);
  if (h.length) {
    for (const f of h)
      e.save(), Kt(e, f), await s0(e, f.face, s, a, {
        ...r,
        height: f.height * b / f.width
      }), e.restore();
    return;
  }
  if (t.illustration && r.resolveEtching) {
    let f;
    try {
      const y = await r.resolveEtching(t, s, a, n, l);
      f = await i([y, t.illustration], a);
      const C = f.images.get(y ?? "");
      if (C && !a.aborted) {
        await l?.(), a.throwIfAborted();
        const [D, A, R, M] = V(t).art, G = D * b, O = A * o, T = R * b, I = M * o, U = f.images.get(t.illustration) ?? C;
        e.save(), e.beginPath();
        const X = Re(t);
        if (e.rect(
          X[0] * b,
          X[1] * o,
          X[2] * b,
          X[3] * o
        ), e.clip(), e.imageSmoothingQuality = "low", t.illustrationCrop) {
          const Z = t.illustrationCrop, ne = Be(U.width * Z[2], U.height * Z[3], [
            G,
            O,
            T,
            I
          ]);
          e.drawImage(
            C,
            Z[0] * C.width,
            Z[1] * C.height,
            Z[2] * C.width,
            Z[3] * C.height,
            ...ne
          );
        } else
          e.drawImage(
            C,
            ...Be(U.width, U.height, [G, O, T, I])
          );
        e.restore();
      }
    } catch {
    } finally {
      f?.dispose();
    }
  }
  if (a.throwIfAborted(), !t.setCode) return;
  const [u, c, g, d] = V(t).stamp, m = u * b, p = c * o, v = g * b, S = d * o, w = We(t, "common"), k = await i([w], a);
  try {
    await l?.(), a.throwIfAborted();
    const f = w ? k.images.get(w) : null;
    if (e.save(), e.globalAlpha = 0.68, f) {
      const y = Math.min(v / f.width, S / f.height);
      e.drawImage(
        f,
        m + (v - f.width * y) / 2,
        p + (S - f.height * y) / 2,
        f.width * y,
        f.height * y
      );
    } else
      e.translate(m, p), e.scale(v / 100, S / 100), e.fillStyle = "white", e.fill(new Path2D(S0)), e.font = "bold 43px Georgia", e.textAlign = "center", e.textBaseline = "alphabetic", e.fillText(y0(t.setCode), 50, 65);
    e.restore();
  } finally {
    k.dispose();
  }
}
function Ta(e) {
  return e.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const Ma = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, Tt = /* @__PURE__ */ new WeakMap();
function Ba(e, t) {
  let s = Tt.get(t);
  if (s || (s = new Path2D(t.path), Tt.set(t, s)), e.save(), t.viewBox) {
    const [a, r, n, l] = t.viewBox;
    e.scale(24 / n, 24 / l), e.translate(-a, -r);
  }
  t.transform && e.transform(...t.transform), t.filled ? (e.fillStyle = e.strokeStyle, e.fill(s)) : e.stroke(s), e.restore();
}
function Mt(e, t, s, a, r = !1) {
  const n = b * 0.105, l = b * 0.015, i = Math.floor(b * 0.9 / (n + l));
  if (t.forEach((d, m) => {
    e.save(), e.translate(
      b * 0.05 + m % i * (n + l),
      j * 0.13 + Math.floor(m / i) * (n + l)
    ), e.fillStyle = "#17201fed", e.strokeStyle = "#c6af7977", e.lineWidth = 1, e.beginPath(), e.arc(n / 2, n / 2, n / 2, 0, Math.PI * 2), e.fill(), e.stroke(), e.translate(n * 0.14, n * 0.14), e.scale(n * 0.72 / 24, n * 0.72 / 24), e.strokeStyle = "#f3e9cf", e.lineWidth = 1.8, e.lineCap = "round", e.lineJoin = "round", Ba(e, d), e.restore();
  }), s?.power == null || s.toughness == null) return;
  e.save();
  const o = Ma[r ? "inspect" : "table"], h = b * o.width, u = j * o.height, c = b * (1 - o.right - o.width), g = j * (1 - o.bottom - o.height);
  a ? e.drawImage(a, c, g, h, u) : (e.fillStyle = "#eee5cf", e.strokeStyle = "#746854", e.lineWidth = 2, e.beginPath(), e.roundRect(
    c + h * (r ? 0.14 : 0.1),
    g + u * (r ? 0.19 : 0.18),
    h * (r ? 0.72 : 0.8),
    u * (r ? 0.62 : 0.64),
    u * 0.12
  ), e.fill(), e.stroke()), e.font = `bold ${b * (r ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
    `${s.power}/${s.toughness}`,
    c + h / 2,
    r ? g + u / 2 - b * 0.01 : g + u * 0.48,
    h * 0.72
  ), e.restore();
}
function Pa(e) {
  return e.currentStats?.power != null && e.currentStats.toughness != null && e.statusLayout !== "inspect" ? { ...e, statusLayout: "inspect" } : e;
}
function _a(e, t) {
  if (e.custom)
    return JSON.stringify([
      "custom-face-v1",
      e.custom.key,
      t,
      e.layer ?? "face",
      e.layer === "etching" ? e.etchThreshold ?? 20 : null
    ]);
  const s = e.face, a = a0(s, e.layer === "etching"), r = e.currentStats?.power != null && e.currentStats.toughness != null ? [e.currentStats.power, e.currentStats.toughness] : null;
  return JSON.stringify([
    pe,
    "canvas-face-v81",
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
      r,
      r ? e.statusLayout ?? t : null
    ]
  ]);
}
function a0(e, t) {
  const s = Se(e);
  return s.length ? [
    e.layout,
    s.map((a) => [a.x, a.y, a.width, a.height, a.rotation, a0(a.face, t)]),
    !t && st(e)
  ] : t ? [
    e.illustration ?? null,
    e.etchedIllustration ?? null,
    e.illustrationCrop ?? null,
    e.setCode ?? null,
    e.setSymbol ?? null,
    V(e)
  ] : [
    oe(e) ? [ge(e), te(e)] : null,
    e.borderColor ?? null,
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
    Zs(e),
    e.artist ?? null,
    e.legalText === void 0 ? ["default"] : e.legalText,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.rarity ?? "common",
    e.power ?? null,
    e.toughness ?? null,
    e.loyalty ?? null,
    V(e),
    ee(e)
  ];
}
function ja(e) {
  const t = document.createElement("canvas");
  return t.width = e === "table" ? 244 : 732, t.height = e === "table" ? 340 : 1020, t;
}
async function Fa(e, t, s, a) {
  if (e.custom)
    return await a?.beforePaint?.(), s.throwIfAborted(), e.custom.compose(t, s, e.layer ?? "face", e.etchThreshold);
  const r = a?.loadImages ?? e0, n = ja(t);
  try {
    const l = n.getContext("2d", {
      willReadFrequently: !!a?.cpuPixels
    });
    if (!l) throw new Error("Card composition needs Canvas2D.");
    if (l.imageSmoothingEnabled = !0, l.imageSmoothingQuality = "high", l.scale(n.width / b, n.height / j), e.layer === "etching")
      return await Ca(
        l,
        e.face,
        e.printingId,
        s,
        e.etchThreshold,
        a?.beforePaint,
        r,
        a?.resolveEtching
      ), n;
    l.fillStyle = "#090806", l.fillRect(0, 0, b, j);
    const i = e.currentStats?.power != null && e.currentStats.toughness != null ? ze(ee(e.face)).pt : null;
    if (e.printedImage) {
      const u = t === "inspect" ? Ta(e.printedImage) : e.printedImage;
      i && await (a?.loadFonts ?? Rt)();
      const c = await r(i ? [u, i] : [u], s);
      try {
        const g = c.images.get(u);
        if (g && !s.aborted)
          return await a?.beforePaint?.(), s.throwIfAborted(), l.drawImage(g, 0, 0, b, j), Mt(
            l,
            e.emblems ?? [],
            e.currentStats,
            i ? c.images.get(i) : void 0,
            e.statusLayout === "inspect" || t === "inspect"
          ), Bt(l, e.face), n;
      } finally {
        c.dispose();
      }
    }
    await Promise.all([
      (a?.loadFonts ?? Rt)(),
      oe(e.face) ? (a?.loadRetroFont ?? qs)() : Promise.resolve()
    ]), s.throwIfAborted();
    const o = await r(t0(e.face), s);
    let h;
    try {
      return e.paintLayer !== "artwork" && (h = await ts(e.face, o.images, s)), await a?.beforePaint?.(), s.throwIfAborted(), r0(
        l,
        e.face,
        h?.images ?? o.images,
        j,
        !1,
        a?.underArt,
        e.paintLayer
      ), Mt(
        l,
        e.emblems ?? [],
        e.currentStats,
        i ? o.images.get(i) : void 0,
        e.statusLayout === "inspect" || t === "inspect"
      ), Bt(l, e.face), n;
    } finally {
      h?.dispose(), o.dispose();
    }
  } catch (l) {
    throw n.width = n.height = 0, l;
  }
}
function Bt(e, t) {
  e.save(), e.setTransform(
    e.canvas.width / b,
    0,
    0,
    e.canvas.height / j,
    0,
    0
  ), e.globalCompositeOperation = "destination-in", e.globalAlpha = 1, e.shadowColor = "transparent", e.filter = "none", e.fillStyle = "#000", e.beginPath(), e.roundRect(0, 0, b, j, is(t) * b), e.fill(), e.restore();
}
function r0(e, t, s, a = j, r = !1, n, l) {
  if (oe(t)) {
    xs(e, t, s, n, l);
    return;
  }
  const i = Se(t);
  if (i.length) {
    e.fillStyle = Te(t.setCode, t.borderColor).border, e.fillRect(0, 0, b, j);
    for (const B of i)
      e.save(), Kt(e, B), r0(
        e,
        B.face,
        s,
        B.height * b / B.width,
        !0,
        n,
        l
      ), e.restore();
    if (l === "artwork") return;
    jt(e, t), st(t) && (e.font = '14px "CardRenderer MTG MPlantin", Georgia', e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      b / 2,
      j - 12,
      b * 0.9
    ));
    return;
  }
  const o = (B) => [
    B[0] * b,
    B[1] * a,
    B[2] * b,
    B[3] * a
  ];
  e.fillStyle = Te(t.setCode, t.borderColor).border, e.fillRect(0, 0, b, a);
  const h = V(t), u = q(t);
  if (l === "artwork") {
    je(e, t, s, o(h.art), l);
    return;
  }
  const c = ee(t), g = ze(c, u), m = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[c.boxes] ?? "#827d72", p = (B, W, x = "top") => {
    const he = s.get(B);
    if (!he) return !1;
    const [me, Ue, $e, Pe] = o(W);
    e.save(), e.beginPath(), e.rect(me, Ue, $e, Pe), e.clip();
    const lt = x === "stretch" ? Pe : he.height * $e / he.width;
    return e.drawImage(
      he,
      me,
      x === "bottom" ? Ue + Pe - lt : Ue,
      $e,
      lt
    ), e.restore(), !0;
  }, [v, S, w, k] = o(c.legendary ? h.legendaryBackground : h.background);
  if (e.save(), e.beginPath(), e.roundRect(v, S, w, k, [
    { x: w * 0.01282, y: k * 962e-5 },
    { x: w * 0.01282, y: k * 962e-5 },
    { x: w * 0.06838, y: k * 0.05128 },
    { x: w * 0.06838, y: k * 0.05128 }
  ]), e.clip(), r) {
    const B = m.slice(1).match(/../g).map(
      (W, x) => Math.round(parseInt(W, 16) * 0.62 + [244, 236, 217][x] * 0.38)
    );
    e.fillStyle = `rgb(${B.join(",")})`, e.fillRect(v, S, w, k);
  }
  const f = s.get(g.background), y = u.startsWith("planeswalker");
  if (f && y ? kt(e, f, v, S, w, u === "planeswalker-large") : f ? e.drawImage(
    f,
    v,
    S + (c.legendary ? L.legendaryBackgroundLift : 0),
    w,
    r ? k : f.height * w / f.width
  ) : (e.fillStyle = m, e.fillRect(v, S, w, k)), e.restore(), e.fillStyle = "#e3d8bb", !s.has(g.frame))
    if (u === "adventure")
      for (const B of Ie(t).filter((W) => W.kind === "rules" && !W.color))
        e.fillRect(B.x, B.y, B.width, B.height);
    else e.fillRect(...o(h.rules));
  s.has(g.boxes) || (e.fillRect(...o(h.title)), e.fillRect(...o(h.type))), e.fillStyle = "#80745c", e.fillRect(...o(h.art));
  const C = s.get(g.frame);
  if (C && u === "normal" && !r) {
    const B = os(t);
    cs(
      e,
      c,
      B,
      () => Dt(e, C, c.legendary, h.frame, !0, B)
    ), us(e, c, B);
  }
  if (n && (e.save(), e.beginPath(), e.rect(0, 0, b, a), e.clip(), e.resetTransform(), e.drawImage(n, 0, 0, e.canvas.width, e.canvas.height), e.restore()), u === "normal" && !r) {
    const [B, W, x, he] = o(h.art), me = we.artRim;
    e.fillStyle = "#090806", e.fillRect(B - me, W, x + 2 * me, he);
  }
  if (je(e, t, s, o(h.art), l), y && ia(e, t), C && y) {
    const [B, W, x] = o(h.frame);
    kt(e, C, B, W, x, u === "planeswalker-large");
  } else C && u !== "normal" && Dt(e, C, c.legendary, h.frame);
  if (c.legendary && p(g.crown, h.crown), r) {
    const B = s.get(g.boxes);
    if (B) {
      const x = B.height * 0.104;
      e.drawImage(B, 0, 0, B.width, x, ...o(h.title)), e.drawImage(B, 0, B.height - x, B.width, x, ...o(h.type));
    }
    const W = s.get(g.frame);
    e.fillStyle = "#e3d8bb", e.fillRect(...o(h.rules)), W && e.drawImage(
      W,
      W.width * 0.035,
      W.height * 0.675,
      W.width * 0.93,
      W.height * 0.325,
      ...o(h.rules)
    );
  } else {
    const B = y && ["Colourless", "Artifact", "Land"].includes(c.boxes);
    p(g.boxes, h.title), B && (e.save(), e.globalAlpha *= Jt, p(g.boxes, h.title), e.restore());
    const W = s.get(g.boxes);
    y && W ? ua(e, W, h.type, B) : (p(g.boxes, h.type, "bottom"), u === "normal" && W && (ma(e, W, o(h.type)), ba(e, o(h.type), c.boxes)));
  }
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left";
  const [D, A, R, M] = o(h.title), G = D + L.plateLeft + (u === "normal" ? 1 : 0), O = Qs(t), T = t.manaSymbols ?? [], I = L.manaSize * O, U = T.length * I + Math.max(0, T.length - 1) * L.manaGap, X = D + R - L.plateRight, Z = X - U, ne = (u === "normal" && !r ? L.normalTitleFont : L.titleFont) * O;
  e.font = `bold ${ne}px "CardRenderer MTG Beleren", Georgia`, e.letterSpacing = `${L.titleTracking}px`, mt(
    e,
    t.name,
    G,
    A + M / 2 + (u === "normal" ? 1 : 0),
    Z - G - (T.length ? L.titleGap : 0),
    ne,
    !0
  ), e.letterSpacing = "0px", T.forEach(
    (B, W) => J(
      e,
      B,
      Z + W * (I + L.manaGap),
      A + M / 2 - I / 2 + L.manaLift / 2,
      I,
      s,
      !0
    )
  );
  const N = s.get(We(t) ?? ""), _ = M0(t), E = ga(t), $ = gs(t), P = E && u === "normal", Y = P ? ca : 1, Q = L.setMargin + (P ? 2 : 0), [, le, , ae] = o(h.type), rt = le + ae / 2 + L.typeLift / 2 + (u === "normal" || y ? 2 : 0), ve = N ? Math.min(
    L.setMaxWidth,
    L.setHeight * N.width * _[2] / (N.height * _[3])
  ) : 0, l0 = X - G - (N ? ve * (1 + (Y - 1) / 2) + Q + L.typeGap : 0);
  if (e.font = `${L.typeFont * O}px "CardRenderer MTG Beleren", Georgia`, mt(
    e,
    t.typeLine ?? "",
    G + (y ? 1.5 : 0),
    rt,
    l0,
    L.typeFont * O,
    !1,
    u === "normal" && !r ? we.typeWidthScale : 1
  ), N) {
    const B = Math.min(
      ve / (N.width * _[2]),
      L.setHeight / (N.height * _[3])
    ), W = [
      X - Q - ve - ve * (Y - 1) / 2 + (y ? 1.5 : 0),
      rt - N.height * _[3] * B * Y / 2 - (P ? 1 : 0),
      N.width * _[2] * B * Y,
      N.height * _[3] * B * Y
    ];
    E ? da(
      e,
      N,
      t.rarity,
      ...W,
      _,
      P ? 1.5 : 1
    ) : $ ? ds(
      e,
      N,
      $,
      t.rarity,
      ...W,
      _,
      u === "normal"
    ) : _t(e, N, t.setCode, t.rarity, ...W, _);
  }
  zt(t) ? Js(e, t, s) : u !== "normal" ? ha(e, t, s) : et(e, Ds(e, t, a, O), s);
  const nt = p0(t);
  if (nt && u !== "leveler") {
    p(g.pt, h.stats, "stretch");
    const [B, W, x] = o(h.stats);
    e.fillStyle = u.startsWith("planeswalker") ? "white" : "#17140f", e.font = `bold ${L.statsFont}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      nt.text,
      B + x / 2,
      W + (u.startsWith("planeswalker") ? h.stats[3] * j / 2 : L.statsLine / 2 + (u === "normal" ? 2 : 0)),
      x
    );
  }
  r || jt(e, t);
}
function jt(e, t) {
  const [s, a, r, n] = n0(F.footer), l = a + L.footerLine;
  e.save(), e.beginPath(), e.rect(s, a, r, n), e.clip(), e.textAlign = "left", e.textBaseline = "top", e.fillStyle = Te(t.setCode, t.borderColor).ink, e.font = `${L.footerFont}px "CardRenderer MTG Relay", sans-serif`, e.letterSpacing = `${L.footerTracking}px`;
  const i = t.setCode?.trim().toUpperCase() ?? "";
  e.fillText(i, s, l);
  let o = s + e.measureText(i).width;
  e.letterSpacing = "0px", t.artist && (o += L.artistMarginLeft, e.font = `${L.footerFont}px "CardRenderer MTG Artist Credit", sans-serif`, e.fillText("a", o, l), o += e.measureText("a").width + L.artistMarginRight, e.font = `${L.footerFont * 1.154}px "CardRenderer MTG Beleren", Georgia`, e.fillText(t.artist, o, l)), e.restore();
}
function Dt(e, t, s, a = F.frame, r = !1, n = 0) {
  const [l, i, o, h] = n0(a), u = n, c = l + u, g = o - 2 * u, d = Math.min(t.height, h * t.width / o), m = d * o / t.width, p = e.getTransform().a, v = () => {
    if (!r) {
      e.drawImage(t, 0, 0, t.width, d, c, i, g, m);
      return;
    }
    const S = 424, w = 436;
    e.save(), e.beginPath(), e.rect(0, 0, b, S), e.rect(0, w, b, j - w), e.clip(), e.drawImage(t, 0, 0, t.width, d, c, i, g, m), e.restore(), e.save(), e.beginPath(), e.rect(0, S, b, w - S), e.clip(), e.drawImage(t, 0, 0, t.width, d, c, i - 1, g, m), e.restore();
  };
  e.save(), e.shadowColor = "black", e.shadowOffsetX = -394e-5 * b * p, e.shadowOffsetY = 394e-5 * b * p, e.shadowBlur = 236e-5 * b * p, v(), s || (e.shadowColor = "#ffffffa0", e.shadowOffsetX = 157e-5 * b * p, e.shadowOffsetY = -315e-5 * b * p, e.shadowBlur = 157e-5 * b * p, v()), e.restore();
}
function n0(e) {
  return [e[0] * b, e[1] * j, e[2] * b, e[3] * j];
}
export {
  Sa as $,
  O0 as A,
  ce as B,
  Xs as C,
  Ra as D,
  S0 as E,
  F,
  W0 as G,
  $0 as H,
  De as I,
  t0 as J,
  Te as K,
  B0 as L,
  H as M,
  Ss as N,
  ya as O,
  Ma as P,
  Oa as Q,
  pe as R,
  y0 as S,
  Vs as T,
  Ie as U,
  Zs as V,
  $a as W,
  ja as X,
  v0 as Y,
  We as Z,
  p0 as _,
  is as a,
  zt as a0,
  Be as a1,
  Pa as a2,
  se as a3,
  Rt as a4,
  e0 as a5,
  qs as a6,
  na as a7,
  R0 as a8,
  Ds as a9,
  U0 as aA,
  Wt as aB,
  ut as aC,
  z as aD,
  Aa as aE,
  Et as aF,
  ht as aG,
  As as aH,
  Vt as aI,
  k0 as aJ,
  He as aK,
  La as aL,
  Je as aM,
  Zt as aN,
  M0 as aO,
  L0 as aP,
  ka as aQ,
  la as aR,
  Ts as aS,
  Ee as aT,
  st as aU,
  Qs as aV,
  Ae as aW,
  qt as aX,
  Ba as aa,
  r0 as ab,
  Mt as ac,
  Ca as ad,
  Js as ae,
  mt as af,
  je as ag,
  J as ah,
  ia as ai,
  xs as aj,
  Pt as ak,
  et as al,
  _t as am,
  ha as an,
  Ia as ao,
  Kt as ap,
  n0 as aq,
  ra as ar,
  Ga as as,
  de as at,
  P0 as au,
  Ve as av,
  te as aw,
  Ot as ax,
  Oe as ay,
  ge as az,
  _a as b,
  Fa as c,
  Ua as d,
  Wa as e,
  V as f,
  va as g,
  wa as h,
  L as i,
  q as j,
  oe as k,
  ze as l,
  Ge as m,
  ee as n,
  K as o,
  vt as p,
  Ke as q,
  pa as r,
  Se as s,
  G0 as t,
  w0 as u,
  Re as v,
  Ea as w,
  j as x,
  Da as y,
  b as z
};
