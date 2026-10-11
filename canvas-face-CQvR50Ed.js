const nt = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", it = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", ot = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", be = {
  RENDERER_COMPONENT_ROOT: nt,
  KEYRUNE_ROOT: it,
  RETRO_ROOT: ot
};
function dt(e) {
  return e.power != null && e.toughness != null ? {
    text: `${e.power}/${e.toughness}`,
    label: `Power ${e.power}, toughness ${e.toughness}`
  } : e.loyalty != null && e.loyalty !== "" ? { text: String(e.loyalty), label: `Starting loyalty ${e.loyalty}` } : null;
}
const h = 488, v = 680;
function se(e, t) {
  if (t === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (t ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    e?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const ht = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", B = {
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
  stamp: [0.34, 0.76 - 0.16 * h / v, 0.32, 0.32 * h / v]
}, w = {
  titleFont: 0.04724 * h,
  titleTracking: 54e-5 * h,
  titleGap: 0.02362 * h,
  plateLeft: 0.02362 * h,
  plateRight: 0.01575 * h,
  manaSize: 0.03556 * 1.35 * h,
  manaGap: 378e-5 * h,
  manaLift: -63e-4 * h,
  typeFont: 0.044 * h,
  typeGap: 945e-5 * h,
  typeLift: -315e-5 * h,
  setHeight: 0.06142 * h,
  setMaxWidth: 0.11024 * h,
  setMargin: 472e-5 * h,
  rulesPaddingX: 0.01575 * h,
  rulesPaddingY: 0.02362 * h,
  normalRulesFont: 0.04444 * h,
  longRulesFont: 0.0381 * h,
  denseRulesFont: 0.0328 * h,
  paragraphGap: 787e-5 * h,
  statsFont: 0.05333 * h,
  statsLine: 0.08661 * h,
  footerFont: 0.02167 * h,
  footerLine: 0.02126 * h,
  footerTracking: 362e-5 * h,
  artistMarginLeft: 7e-3 * h,
  artistMarginRight: 35e-4 * h,
  legendaryBackgroundLift: -0.02047 * h
}, Ie = (e) => e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
function ut(e = B) {
  return {
    ...Object.fromEntries(
      Object.entries(e).flatMap(
        ([t, r]) => r.map((s, a) => [
          `--face-${Ie(t)}-${["x", "y", "w", "h"][a]}`,
          `${s * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(w).map(([t, r]) => [
        `--face-${Ie(t)}`,
        `${r / h * 100}cqw`
      ])
    )
  };
}
const tr = ut();
function gt(e) {
  return e.length > 340 ? "dense" : e.length > 210 ? "long" : "normal";
}
function mt(e) {
  return {
    dense: w.denseRulesFont,
    long: w.longRulesFont,
    normal: w.normalRulesFont
  }[gt(e)];
}
function ve(e) {
  return e.split(/(\{[^}\n]+\})/g).filter(Boolean).map((t) => ({
    value: t,
    symbol: /^\{[^}\n]+\}$/.test(t) ? t.slice(1, -1) : null
  }));
}
function ft(e) {
  const t = e.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[t] ?? t.slice(0, 3);
}
const ye = "WUBRG";
function D(e) {
  const t = e.typeLine ?? "", r = e.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(t), s = e.land ?? /(^|\s)Land(?:\s|$)/i.test(t), a = !/\bPlaneswalker\b/i.test(t) && (e.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(t)), l = e.creature ?? /(^|\s)Creature(?:\s|$)/i.test(t), n = ie(e.colors ?? []), o = n.length === 0 ? "Colourless" : n.length > 2 ? "Gold" : n.join(""), d = (r || s) && n.length === 0 ? "Artifact" : o, i = s ? "Land" : r ? "Artifact" : n.length > 1 ? "Gold" : o;
  return {
    frame: d,
    boxes: i,
    background: i,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: s && n.length > 0 ? o : r && n.length > 0 ? n.length > 1 ? "Gold" : o : i,
    pt: i,
    artifact: r,
    land: s,
    legendary: a,
    creature: l,
    className: `rendered-card-profile-${i.toLocaleLowerCase()}`
  };
}
function ie(e) {
  return [
    ...new Set(
      e.map((t) => t.toLocaleUpperCase()).filter((t) => ye.includes(t))
    )
  ].sort((t, r) => ye.indexOf(t) - ye.indexOf(r));
}
const ct = be.KEYRUNE_ROOT, je = new Set(
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
je.add("con_");
const pt = "GLINT", ae = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function wt(e) {
  const t = ae[e] ?? ae.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${t}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function yt(e) {
  const t = ae[e] ?? ae.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${t}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function bt(e, t = "common") {
  const r = e.trim().toLowerCase();
  if (r === "forge") return yt(t);
  if (r === pt.toLowerCase()) return wt(t);
  const s = r === "con" ? "con_" : r;
  return je.has(s) ? `${ct}/${s}.svg` : null;
}
const K = be.RENDERER_COMPONENT_ROOT;
function Re(e, t = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(t), s = t === "saga" ? "saga" : t === "planeswalker-large" ? "planeswalker_large" : t, a = ["saga", "class"].includes(t) && e.boxes === "Colourless" ? "Land" : t.startsWith("planeswalker") && e.boxes === "Artifact" ? "Colourless" : e.boxes;
  return {
    background: P(
      r ? "bg" : t === "class" ? "saga_bg" : `${s}_bg`,
      t.startsWith("planeswalker") && a === "Land" ? "Colourless" : a
    ),
    frame: P(
      ["normal", "leveler"].includes(t) ? "frames" : `${s}_frames`,
      t === "adventure" ? "WUBRG".includes(e.frame) ? e.frame : "W" : t === "class" ? e.frame === "WU" ? "UW" : e.frame.length === 2 ? "Gold" : e.frame : t === "saga" && e.frame === "Colourless" ? "Land" : t.startsWith("planeswalker") && ["Artifact", "Land"].includes(e.frame) ? "Colourless" : e.frame
    ),
    boxes: P(t.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", a),
    nameplate: P("nameplates", e.boxes),
    crown: P("legendary-crowns", e.crown),
    pt: t.startsWith("planeswalker") ? P("planeswalker", "Loyalty") : P("pt-boxes", e.pt)
  };
}
function Z(e) {
  const t = e.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = t === "∞" ? "INFINITY" : t === "½" ? "HALF" : t.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? P("symbols", r) : null;
}
function vt(e, t) {
  return bt(e, t);
}
function P(e, t) {
  const r = e === "legendary-crowns" ? "legendary_crowns" : e === "pt-boxes" ? "pt_boxes" : e === "nameplates" ? "boxes" : e, s = e === "symbols" ? "svg" : "webp";
  return `${K}/img/${r}/${encodeURIComponent(t)}.${s}`;
}
function oe(e, t = e.rarity) {
  return e.setSymbol ?? vt(e.setCode ?? "", t);
}
const q = be.RETRO_ROOT, Rt = `${q}/fonts/goudy-medieval.ttf`, Ct = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), Tt = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function Q(e) {
  return e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") ? !1 : e.frameStyle === "retro" || e.frameStyle !== "modern" && Ct.has(e.setCode?.toLowerCase() ?? "");
}
function de(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function z(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return de(e) ? "abu" : t === "leg" && ie(e.colors ?? []).length > 1 ? "legends" : ["3ed", "4ed", "5ed", "atq"].includes(t) && !/\bLand\b/.test(e.typeLine ?? "") ? "fourth" : "seventh";
}
function St(e) {
  return z(e) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1];
}
function He(e) {
  const t = de(e);
  return {
    ...B,
    frame: St(e),
    title: [t ? 0.07 : 0.1134, 0.0481, t ? 0.8467 : 0.8, 0.043],
    art: z(e) === "legends" ? [0.112, 0.094, 0.78, 0.45] : z(e) === "fourth" ? [0.114, 0.098, 0.772, 0.445] : t ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429],
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: [0.8074, 0.895, 0.1367, 0.043],
    footer: [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function Ce(e) {
  const t = ie(e.colors ?? []), r = e.typeLine ?? "", s = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([o]) => r.includes(o)), a = /\bLand\b/.test(r) ? s.length === 1 ? s[0][1] + "l" : "l" : /\bArtifact\b/.test(r) ? "a" : t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "c", l = z(e), n = l === "seventh" || a === "c" || l === "abu" && a === "m" ? "seventh/regular" : `old/${l}`;
  return `${q}/img/frames/${n}/${l === "legends" ? "legendsFrameM" : a}.png`;
}
function J(e) {
  return e.borderColor ?? (Tt.has(e.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function Ae(e) {
  return J(e) === "silver" ? se(null, "silver").border : J(e) === "white" ? Lt : "#080808";
}
function De(e) {
  return z(e) === "fourth" ? `${q}/img/frames/old/fourth/borderBlack.png` : `${q}/img/frames/${de(e) ? "old/abu" : "seventh/regular"}/border.svg`;
}
function Ge(e) {
  return de(e) ? "#ababab" : "#f2eee3";
}
function Mt(e) {
  return e.setCode?.toLowerCase() === "7ed" && ie(e.colors ?? []).some((t) => t === "W" || t === "G") && !/Land/.test(e.typeLine ?? "") ? "saturate(.7) brightness(.88)" : "none";
}
function Ye(e) {
  if (!/\bBasic Land\b/.test(e.typeLine ?? "") || !/^\(?\{T\}: Add \{[WUBRG]\}\.\)?$/.test(e.rulesText ?? ""))
    return null;
  const t = (e.rulesText ?? "").match(/Add \{([WUBRG])\}/)?.[1];
  return t ? `${q}/img/frames/m15/basics/${t.toLowerCase()}.png` : null;
}
const Lt = "#eeedeb";
function ze(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return ["lea", "leb", "2ed", "3ed", "4ed", "5ed"].includes(t) ? null : oe(e);
}
function kt(e) {
  const t = (e.rulesText ?? "").length;
  return t > 340 ? 16 : t > 210 ? 19 : 23;
}
function $t(e) {
  return [
    Ye(e),
    Ce(e),
    J(e) !== "black" || z(e) === "fourth" ? De(e) : null,
    e.illustration,
    ze(e),
    ...(e.manaSymbols ?? []).map(Z),
    ...[...(e.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((t) => Z(t[1]))
  ];
}
const W = ([e, t, r, s]) => [
  e * h,
  t * v,
  r * h,
  s * v
];
function rr(e, t) {
  return ["7ed", "8ed", "9ed"].includes(e?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(t ?? "") ? "black" : void 0;
}
function le(e, t, [r, s, a, l]) {
  if (!(e > 0 && t > 0)) return [r, s, a, l];
  const n = Math.max(a / e, l / t), o = e * n, d = t * n;
  return [r + (a - o) / 2, s + (l - d) / 2, o, d];
}
function Et(e, t, r, s) {
  const a = [s[0] * e, s[1] * t, s[2] * e, s[3] * t];
  return [...a, ...le(a[2], a[3], r)];
}
function ne(e, t, r, s, a) {
  const [l, n, o, d] = s;
  if (a === "printing") {
    e.clearRect(l, n, o, d);
    return;
  }
  a === "artwork" && (e.fillStyle = "#80745c", e.fillRect(l, n, o, d));
  const i = r.get(t.illustration ?? "");
  i && (e.save(), e.beginPath(), e.rect(l, n, o, d), e.clip(), t.illustrationCrop ? e.drawImage(
    i,
    ...Et(i.width, i.height, s, t.illustrationCrop)
  ) : e.drawImage(i, ...le(i.width, i.height, s)), e.restore());
}
function he(e, t, r, s) {
  const a = [];
  for (const l of t.split(`
`)) {
    let n = [], o = 0;
    const d = ve(l).flatMap(
      (i) => i.symbol ? [{ text: i.symbol, symbol: !0 }] : (i.value.match(/\s+|\S+/g) ?? []).map((u) => ({ text: u, symbol: !1 }))
    );
    for (const i of d) {
      const u = !i.symbol && e.measureText(i.text).width > r ? [...i.text].map((f) => ({ text: f, symbol: !1 })) : [i];
      for (const f of u) {
        const g = f.symbol ? s * 0.94 : e.measureText(f.text).width;
        o + g > r && n.length && (a.push(n), n = [], o = 0), !(!n.length && /^\s+$/.test(f.text)) && (n.push({ ...f, width: g }), o += g);
      }
    }
    a.push(n);
  }
  return a;
}
function Te(e, t, r, s, a, l, n = !1) {
  const o = l.get(Z(t) ?? "");
  e.save();
  const d = {
    W: "#efe7cb",
    U: "#3d7ac3",
    B: "#33313c",
    R: "#c2432e",
    G: "#3b8a4e"
  };
  if (n) {
    const i = 1.5372 * e.getTransform().a;
    e.shadowColor = "#000d", e.shadowOffsetX = -i, e.shadowOffsetY = i;
  }
  if (e.fillStyle = d[t] ?? "#9aa4ae", e.beginPath(), e.arc(r + a / 2, s + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.shadowColor = "transparent", o) {
    e.drawImage(o, r, s, a, a), e.restore();
    return;
  }
  e.fillStyle = t === "B" ? "white" : "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = `bold ${a * 0.62}px Georgia`, e.fillText(t, r + a / 2, s + a / 2, a * 0.9), e.restore();
}
function ue(e, t, r, s, a, l, n) {
  const o = typeof l == "number" ? l : l.size;
  e.font = `${typeof l != "number" && l.italic ? "italic " : ""}${o}px "CardRenderer MTG MPlantin", Georgia`;
  const d = t.split(`
`).map((i) => he(e, i, a, o));
  e.textBaseline = "top";
  for (const i of d) {
    for (const u of i) {
      let f = r;
      for (const g of u)
        g.symbol ? Te(e, g.text, f + o * 0.07, s + o * 0.03, o * 0.8, n) : e.fillText(g.text, f, s), f += g.width;
      s += o;
    }
    s += w.paragraphGap;
  }
}
function Oe(e, t, r) {
  if (e.measureText(t).width <= r) return t;
  const s = [...t];
  for (; s.length && e.measureText(`${s.join("")}…`).width > r; ) s.pop();
  return s.length || e.measureText("…").width <= r ? `${s.join("")}…` : "";
}
function Xe(e, t, r, s, a, l, n, o) {
  const d = {
    uncommon: "#aaaeb2",
    rare: "#bc923f",
    mythic: "#c65c2d",
    special: "#8664af",
    bonus: "#bc923f"
  }[s ?? "common"];
  if (!d || ["forge", "glint"].includes(r?.toLowerCase() ?? "")) {
    e.drawImage(t, a, l, n, o);
    return;
  }
  const i = document.createElement("canvas");
  i.width = Math.max(1, Math.ceil(n * 2)), i.height = Math.max(1, Math.ceil(o * 2));
  const u = i.getContext("2d");
  u.drawImage(t, 0, 0, i.width, i.height), u.globalCompositeOperation = "source-in", u.fillStyle = d, u.fillRect(0, 0, i.width, i.height), e.drawImage(i, a, l, n, o), i.width = i.height = 0;
}
function It(e, t, r, s, a) {
  const l = He(t);
  if (a === "artwork") {
    ne(e, t, r, W(l.art), a);
    return;
  }
  e.fillStyle = Ae(t), e.fillRect(0, 0, 488, 680), e.fillStyle = "#686050", e.fillRect(24.4, 27.2, 439.2, 625.6), e.fillStyle = "#e5dec5", e.fillRect(...W(l.rules)), e.fillStyle = "#746b58", e.fillRect(...W(l.art)), s && e.drawImage(s, 0, 0, 488, 680), ne(e, t, r, W(l.art), a);
  const n = r.get(Ce(t));
  if (n && (e.save(), e.filter = Mt(t), e.drawImage(n, ...W(l.frame)), e.restore()), J(t) !== "black" || z(t) === "fourth") {
    const S = r.get(De(t));
    if (S) {
      const A = document.createElement("canvas");
      A.width = 732, A.height = 1020;
      const $ = A.getContext("2d");
      $.drawImage(S, 0, 0, 732, 1020), $.globalCompositeOperation = "source-in", $.fillStyle = Ae(t), $.fillRect(0, 0, 732, 1020), e.drawImage(A, ...W(l.frame)), A.width = A.height = 0;
    }
  }
  e.fillStyle = Ge(t), e.textBaseline = "middle", e.textAlign = "left", e.letterSpacing = "0px";
  const [o, d, i, u] = W(l.title), f = t.manaSymbols ?? [], g = 23.4, I = 1.7, M = f.length * (g + I);
  e.shadowColor = "#000b", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = '27.8px "CardRenderer MTG Goudy", Georgia', e.fillText(t.name, o, d + u / 2, Math.max(1, i - M - 5)), f.forEach(
    (S, A) => Te(e, S, o + i - M + A * (g + I), d + u / 2 - g / 2, g, r, !0)
  );
  const [L, b, R, y] = W(l.type), m = r.get(ze(t) ?? "");
  if (e.font = '21.7px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.typeLine ?? "", L, b + y / 2, R - (m ? 48 : 0)), m) {
    const S = Math.min(44 / m.width, 23.4 / m.height);
    Xe(
      e,
      m,
      t.setCode,
      t.rarity,
      L + R - m.width * S,
      b + y / 2 - m.height * S / 2,
      m.width * S,
      m.height * S
    );
  }
  e.shadowColor = "transparent";
  const [c, T, C, _] = W(l.rules), U = t.rulesText ?? "", N = kt(t);
  e.font = `${N}px "CardRenderer MTG MPlantin", Georgia`, e.fillStyle = "#17140f";
  const G = r.get(Ye(t) ?? ""), j = he(e, U, C, N), H = j.length * N + (U.split(`
`).length - 1) * 3.84;
  if (e.save(), e.beginPath(), e.rect(c, T, C, _), e.clip(), G) {
    const S = Math.min(C * 0.4 / G.width, _ * 0.75 / G.height);
    e.drawImage(
      G,
      c + (C - G.width * S) / 2,
      T + (_ - G.height * S) / 2,
      G.width * S,
      G.height * S
    );
  } else ue(e, U, c, T + Math.max(0, (_ - H) / 2), C, N, r);
  if (e.restore(), e.shadowColor = "#000b", e.fillStyle = Ge(t), e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", t.power != null && t.toughness != null) {
    const [S, A, $, F] = W(l.stats);
    e.textAlign = "center", e.fillText(`${t.power}/${t.toughness}`, S + $ / 2, A + F / 2, $);
  }
  if (t.artist) {
    const [S, A, $, F] = W(l.footer);
    e.textAlign = "center", e.font = '15.6px "CardRenderer MTG MPlantin", Georgia', e.fillText(`Illus. ${t.artist}`, S + $ / 2, A + F / 2, $);
  }
  e.shadowColor = "transparent";
}
const At = (e, t = {}) => fetch(e, { ...t, mode: "cors" });
let Be;
function Gt() {
  return typeof FontFace != "function" ? Promise.resolve() : Be ??= At(Rt).then(async (e) => {
    if (!e.ok) throw Error("Retro font unavailable");
    const t = await new FontFace(
      "CardRenderer MTG Goudy",
      await e.arrayBuffer()
    ).load();
    document.fonts.add(t);
  }).catch(() => {
    Be = void 0;
  });
}
function Se(e) {
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
function x(e) {
  return e.layout === "ability" ? "normal" : e.layout === "adventure" && e.faces?.length === 2 ? "adventure" : e.layout === "class" || /\bClass\b/i.test(e.typeLine ?? "") ? "class" : e.layout === "leveler" || /^Level up\b/m.test(e.rulesText ?? "") ? "leveler" : e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "") ? "saga" : e.layout === "planeswalker" || /\bPlaneswalker\b/i.test(e.typeLine ?? "") ? Se(e).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function Y(e) {
  if (Q(e)) return He(e);
  const t = x(e);
  if (t === "adventure")
    return {
      ...B,
      frame: [2.9 / 63.5, 3.5 / 88.9, 57.4 / 63.5, 79 / 88.9],
      type: [0.05669, 49.7 / 88.9, 0.88662, 0.05737],
      stamp: [0.58, 0.74, 0.25, 0.1794]
    };
  if (t === "class")
    return {
      ...B,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (t === "saga")
    return {
      ...B,
      background: [0.03937, 0.02812, 0.92126, 0.93926],
      frame: [0.032, 0.04117, 0.92126, 0.88864],
      art: [0.5008, 0.11249, 0.42992, 0.72328],
      type: [0.05669, 0.84589, 0.88662, 0.05737],
      rules: [0.07717, 0.11192, 0.4189, 0.72328],
      stamp: [0.17, 0.48, 0.23, 0.16506]
    };
  if (t.startsWith("planeswalker")) {
    const r = t === "planeswalker-large", s = [
      0.04409,
      r ? 0.55118 : 0.62655,
      0.88827,
      r ? 0.37534 : 0.29997
    ], a = B.stamp[2], l = B.stamp[3];
    return {
      ...B,
      frame: [0.04724, 0.02655, 0.91339, 0.89989],
      art: [0.06299, 0.09224, 0.86614, (r ? 0.49044 : 0.55793) - 0.09224],
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [0.05669, r ? 0.49044 : 0.55793, 0.88662, 0.05737],
      rules: s,
      stats: [0.808, 0.881, 0.14, 0.069],
      stamp: [
        s[0] + (s[2] - a) / 2,
        s[1] + (s[3] - l) / 2,
        a,
        l
      ]
    };
  }
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? {
    ...B,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : e.layout === "aftermath-top" ? {
    ...B,
    title: [0.035, 0.025, 0.93, 0.105],
    art: [0.052, 0.145, 0.896, 0.39],
    type: [0.035, 0.55, 0.93, 0.105],
    rules: [0.052, 0.67, 0.896, 0.29],
    footer: [0, 1, 0, 0]
  } : B;
}
function Ot(e) {
  const t = x(e) === "saga", r = Y(e).rules, s = Se(e), a = r[2] * 488 - (t ? 32 : 70), l = r[3] * 680;
  let n = t ? 21 : 19;
  const o = (b, R) => Math.max(1, Math.ceil(b.length * R * 0.49 / a)), d = (b, R) => Math.max(t ? b.badges.length * 36 : 34, o(b.text, R) * R + 16), i = (b) => s.reduce((R, y) => R + d(y, b), 0);
  for (; n > 8 && i(n) > l; ) n -= 0.5;
  const u = s.map((b) => d(b, n)), f = Math.max(0, l - i(n)) / Math.max(1, s.length);
  let g = l / Math.max(1, s.length), I = l, M = s.length;
  if (!t)
    for (const b of [...u].sort((R, y) => y - R)) {
      if (b <= g) break;
      I -= b, g = I / Math.max(1, --M);
    }
  let L = 0;
  return s.map((b, R) => {
    const y = t ? u[R] + f : Math.max(g, u[R]), m = { ...b, top: L, height: y, font: n, left: t ? 27 : 62, width: a };
    return L += y, m;
  });
}
const Bt = `${K}/img/class_level_bg.webp`, Ve = (e) => ["adventure", "class", "leveler"].includes(x(e)), V = (e, t, r, s) => ({
  x: e / 63.5 * 488,
  y: t / 88.9 * 680,
  width: r / 63.5 * 488,
  height: s / 88.9 * 680
}), Pt = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function _t(e, t, r, s = 21) {
  const a = e.replace(/\{[^}]+\}/g, "●").split(`
`);
  let l = s;
  for (; l > 8 && a.reduce(
    (n, o) => n + Math.max(1, Math.ceil(o.length * l * 0.53 / t)) * l + 4,
    0
  ) > r; )
    l -= 0.5;
  return l;
}
function ge(e) {
  const t = x(e), r = [], s = (a, l, n, o = {}) => {
    r.push({ kind: a, text: l, ...n, font: _t(l, n.width, n.height), ...o });
  };
  if (t === "adventure") {
    const a = e.faces?.[1];
    if (!a) return [];
    const l = (a.manaSymbols ?? []).map((o) => `{${o}}`).join(""), n = (a.manaSymbols?.length ?? 0) * 2.5;
    s("heading", a.name, V(5.6, 55.3, 25 - n, 4.2), {
      color: "white",
      font: Math.min(18, (25 - n) * 488 / 63.5 / Math.max(1, a.name.length * 0.55))
    }), s("rules", l, V(30 - n, 55.3, n, 4.2), { color: "white", font: 17 }), s("heading", a.typeLine ?? "", V(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (a.typeLine ?? "").length * 0.52))
    }), s("rules", a.rulesText ?? "", V(5.6, 64.5, 24.7, 15.6)), s("rules", e.rulesText ?? e.faces?.[0]?.rulesText ?? "", V(33, 54.9, 25.5, 25));
  } else if (t === "class") {
    const [a, l, n, o] = Y(e).rules.map(
      (m, c) => m * (c % 2 ? v : h)
    ), d = D(e);
    s(
      "band",
      "",
      { x: a, y: l, width: n, height: o },
      {
        fill: "#e3d8bb",
        asset: P(
          "saga_textboxes",
          d.boxes === "Colourless" ? "Land" : d.boxes
        )
      }
    );
    const i = [];
    for (const m of (e.rulesText ?? "").split(`
`).filter(Boolean))
      i.length && !/^.*:\s*Level\s+\d+\s*$/i.test(m) && !/^.*:\s*Level\s+\d+\s*$/i.test(i.at(-1)) && !i.at(-1).startsWith("(") ? i[i.length - 1] += `
` + m : i.push(m);
    const u = (m) => /^.*:\s*Level\s+\d+\s*$/i.test(m), f = 28, g = 20, I = (m, c) => m.split(`
`).reduce(
      (T, C) => T + Math.max(1, Math.ceil(C.length * c * 0.53 / (n - 10))),
      0
    ), M = i.map(
      (m) => u(m) ? f : I(m, m.startsWith("(") ? 16 : g) * (m.startsWith("(") ? 16 : g) + 8
    ), L = i.filter((m) => !u(m)).length, b = Math.max(0, o - M.reduce((m, c) => m + c, 0)) / Math.max(1, L), R = Math.min(
      1,
      (o - i.filter(u).length * f) / M.reduce((m, c, T) => m + (u(i[T]) ? 0 : c), 0)
    );
    let y = l;
    i.forEach((m, c) => {
      const T = u(m), C = T ? f : M[c] * R + b;
      if (T) {
        const [_, U] = m.split(/:\s*/);
        s("band", "", { x: a, y, width: n, height: C }, { asset: Bt }), s("rules", _ + ":", { x: a + 5, y, width: n / 2 - 5, height: C }, { font: 18 }), s(
          "heading",
          U,
          { x: a + n / 2, y, width: n / 2 - 5, height: C },
          { font: 18, align: "right" }
        );
      } else
        s(
          "rules",
          m,
          { x: a + 5, y: y + 4, width: n - 10, height: C - 8 },
          { font: (m.startsWith("(") ? 16 : g) * R, italic: m.startsWith("(") }
        );
      y += C;
    });
  } else if (t === "leveler") {
    const a = e.rulesText ?? "", l = a.split(/^LEVEL\s+([^\n]+)\n/gm), n = [
      {
        range: "",
        text: l[0] ?? "",
        stats: e.power != null && e.toughness != null ? `${e.power}/${e.toughness}` : ""
      }
    ];
    for (let u = 1; u < l.length; u += 2) {
      const f = l[u + 1] ?? "", g = f.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      n.push({
        range: l[u],
        stats: g?.[1] ?? "",
        text: g ? f.slice(g[0].length) : f
      });
    }
    const o = V(4.9, 55.6, 53.7, 25.5), d = o.height / n.length, i = Pt[D(e).frame] ?? "#dcc8af";
    n.forEach((u, f) => {
      const g = o.y + f * d;
      f && s(
        "band",
        "",
        { x: o.x, y: g, width: o.width, height: d },
        { fill: f % 2 ? "#00000018" : "#00000028" }
      );
      const I = u.range ? 55 : 7, M = u.stats ? 72 : 7;
      s("rules", u.text, {
        x: o.x + I,
        y: g + 4,
        width: o.width - I - M,
        height: d - 8
      }), u.range && s(
        "level",
        `LEVEL
${u.range}`,
        { x: o.x - 12, y: g + d / 2 - 23, width: 65, height: 46 },
        { fill: i, font: 13 }
      ), u.stats && s(
        "stats",
        u.stats,
        { x: o.x + o.width - 68, y: g + d / 2 - 22, width: 77, height: 44 },
        { asset: P("pt-boxes", D(e).pt), font: 26 }
      );
    });
  }
  return r;
}
function Ft(e) {
  return ge(e).flatMap((t) => [
    t.asset ?? null,
    ...ve(t.text).flatMap((r) => r.symbol ? [Z(r.symbol)] : [])
  ]);
}
function Wt(e) {
  return Ve(e) ? ge(e) : null;
}
function xt(e, t, r) {
  for (const s of ge(t)) {
    const { x: a, y: l, width: n, height: o, font: d } = s;
    e.save(), e.textAlign = "left", e.fillStyle = s.fill ?? "transparent", s.kind === "level" ? (e.beginPath(), e.moveTo(a, l), e.lineTo(a + n * 0.72, l), e.lineTo(a + n, l + o / 2), e.lineTo(a + n * 0.72, l + o), e.lineTo(a, l + o), e.closePath(), e.fill(), e.strokeStyle = "#0008", e.lineWidth = 1, e.stroke()) : s.fill && e.fillRect(a, l, n, o);
    const i = s.asset ? r.get(s.asset) : null;
    if (i && e.drawImage(i, a, l, n, o), e.beginPath(), e.rect(a, l, n, o), e.clip(), e.fillStyle = s.color ?? "#17140f", ["stats", "level"].includes(s.kind)) {
      e.font = `${d}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
      const u = s.text.split(`
`);
      u.forEach(
        (f, g) => e.fillText(
          f,
          a + n * (s.kind === "level" ? 0.43 : 0.5),
          l + o / 2 + (g - (u.length - 1) / 2) * d,
          n * 0.85
        )
      );
    } else if (s.align === "right")
      e.font = `${d}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "right", e.textBaseline = "middle", e.fillText(s.text, a + n, l + o / 2, n);
    else {
      e.font = `${s.italic ? "italic " : ""}${d}px "CardRenderer MTG MPlantin", Georgia`;
      const u = he(e, s.text, n, d).length * d + (s.text.split(`
`).length - 1) * w.paragraphGap;
      ue(
        e,
        s.text,
        a,
        l + Math.max(0, (o - u) / 2),
        n,
        { size: d, italic: !!s.italic },
        r
      );
    }
    e.restore();
  }
}
function ee(e) {
  if (!["split", "aftermath"].includes(e.layout ?? "") || e.faces?.length !== 2) return [];
  const t = e.layout === "aftermath" || /\bAftermath\b/.test(e.faces[1].rulesText ?? "");
  return e.faces.map((r, s) => {
    const a = t ? 0.615 : 0.5, l = {
      setCode: e.setCode,
      rarity: e.rarity,
      artist: e.artist,
      ...r,
      layout: t ? s === 0 ? "aftermath-top" : "aftermath-bottom" : "split-half",
      faces: void 0,
      rulesText: r.rulesText?.split(`
`).filter((n) => !/^Fuse\b/.test(n)).join(`
`),
      illustration: r.illustration ?? e.illustration,
      etchedIllustration: r.etchedIllustration ?? (r.illustration ? void 0 : e.etchedIllustration),
      illustrationCrop: r.illustrationCrop ?? (!r.illustration && e.illustration ? [s ? a : 0, 0, s ? 1 - a : a, 1] : void 0)
    };
    return t ? s === 0 ? { face: l, x: 0, y: 0, width: 488, height: 375, rotation: 0 } : { face: l, x: 488, y: 367, width: 276, height: 488, rotation: 90 } : {
      face: l,
      x: 5,
      y: (s ? 333 : 648) - (Me(e) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function sr(e) {
  return {
    left: `${e.x / h * 100}%`,
    top: `${e.y / v * 100}%`,
    width: `${e.width / h * 100}%`,
    height: `${e.height / v * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function Ze(e, t) {
  e.translate(t.x, t.y), e.rotate(t.rotation * Math.PI / 180), e.scale(t.width / h, t.width / h);
}
function Pe(e, t) {
  const r = t[0] * e.width, s = t[1] * e.height, a = t[2] * e.width, l = t[3] * e.height;
  return e.rotation === -90 ? [
    (e.x + s) / h,
    (e.y - r - a) / v,
    l / h,
    a / v
  ] : e.rotation === 90 ? [
    (e.x - s - l) / h,
    (e.y + r) / v,
    l / h,
    a / v
  ] : [(e.x + r) / h, (e.y + s) / v, a / h, l / v];
}
function Ut(e) {
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? 1.5 : 1;
}
function Me(e) {
  return /\bFuse\b/.test(e.rulesText ?? "") || !!e.faces?.some((t) => /^Fuse\b/m.test(t.rulesText ?? ""));
}
function Nt(e) {
  return { font: 18, offsetY: e.startsWith("+") ? 2 : e === "0" ? 0 : -2 };
}
function qe(e, t) {
  return e === "saga" ? /^(I|II|III|IV)$/.test(t) ? P("saga", t) : null : P(
    "planeswalker",
    t.startsWith("+") ? "LoyaltyPlus" : t === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function Ke(e, t) {
  return x(e) === "saga" ? P("saga_textboxes", t === "Colourless" ? "Land" : t) : null;
}
function jt(e) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0"
  }[D(e).boxes] ?? "#dededbf0";
}
function Ht(e, t, r) {
  const s = x(t), a = s === "saga", l = Y(t).rules, n = l[0] * h, o = l[1] * v, d = l[2] * h, i = l[3] * v;
  e.fillStyle = a ? "#e3d8bb" : jt(t), a ? e.fillRect(n, o, d, i) : (e.beginPath(), e.roundRect(n + 40, o + 3, d - 40, i - 6, [
    4,
    4,
    { x: (d - 40) / 2, y: 10 },
    { x: (d - 40) / 2, y: 10 }
  ]), e.fill());
  const u = Ke(t, D(t).boxes), f = u ? r.get(u) : void 0;
  f && e.drawImage(f, n, o, d, i);
  for (const g of Ot(t)) {
    g.top > 0 && (e.fillStyle = "#0002", e.fillRect(n + (a ? 0 : 40), o + g.top, d - (a ? 0 : 40), 1.5)), e.fillStyle = "#17140f", e.textAlign = "left", e.font = `${g.reminder ? "italic " : ""}${g.font}px "CardRenderer MTG MPlantin", Georgia`;
    const I = he(e, g.text, g.width, g.font).length * g.font;
    ue(
      e,
      g.text,
      n + g.left,
      o + g.top + (g.height - I) / 2,
      g.width,
      { size: g.font, italic: g.reminder },
      r
    );
    const M = a ? 36 : 54, L = a ? 36 : 34;
    g.badges.forEach((b, R) => {
      const y = n + (a ? -18 : 0), m = o + g.top + g.height / 2 + (R - g.badges.length / 2) * L, c = qe(s, b), T = c ? r.get(c) : null;
      if (T ? e.drawImage(T, y, m, M, L) : (e.fillStyle = "#29231c", e.fillRect(y, m, M, L)), !T || !a) {
        e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle";
        const C = Nt(b);
        e.font = `bold ${a ? 19 : C.font}px "CardRenderer MTG Beleren", Georgia`, e.fillText(
          b,
          y + M / 2 - (a ? 0 : 1.5),
          m + L / 2 + (a ? 0 : C.offsetY),
          M - 3
        ), a || (e.fillStyle = "#17140f", e.fillText(":", y + M + 4, m + L / 2));
      }
    });
  }
}
async function Dt(e, t) {
  return t.throwIfAborted(), fetch(e, { signal: t, mode: "cors" });
}
function Yt(e) {
  if (e.startsWith(`${q}/img/frames/`) && e.endsWith(".png")) return 768;
  const t = e.startsWith(`${K}/img/`) ? e.slice(`${K}/img/`.length) : "";
  return t === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    t
  ) ? 768 : void 0;
}
async function zt(e) {
  if (!e.type.includes("svg")) return e;
  const t = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), r = t.documentElement;
  if (r.localName !== "svg" || t.querySelector("parsererror"))
    throw new Error("Invalid SVG asset.");
  const s = (r.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), a = s[2] ?? parseFloat(r.getAttribute("width") ?? ""), l = s[3] ?? parseFloat(r.getAttribute("height") ?? "");
  if (!(a > 0 && l > 0 && Number.isFinite(a + l)))
    throw new Error("SVG asset needs a finite viewport.");
  const n = 512 / Math.max(a, l);
  return r.hasAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${a} ${l}`), r.setAttribute("width", String(Math.max(1, Math.round(a * n)))), r.setAttribute("height", String(Math.max(1, Math.round(l * n)))), new Blob([new XMLSerializer().serializeToString(r)], { type: "image/svg+xml" });
}
async function Xt(e, t, r) {
  if (t.throwIfAborted(), !e.type.includes("svg"))
    return r ? createImageBitmap(e, { resizeWidth: r, resizeQuality: "high" }) : createImageBitmap(e);
  const s = URL.createObjectURL(await zt(e)), a = new Image(), l = document.createElement("canvas"), n = () => {
    a.src = "";
  };
  t.addEventListener("abort", n, { once: !0 });
  try {
    t.throwIfAborted(), a.src = s, await a.decode(), t.throwIfAborted(), l.width = a.naturalWidth, l.height = a.naturalHeight;
    const o = l.getContext("2d", { willReadFrequently: !0 });
    if (!o || !l.width || !l.height)
      throw new Error("SVG asset could not be rasterized.");
    return o.drawImage(a, 0, 0), await createImageBitmap(l);
  } finally {
    t.removeEventListener("abort", n), a.src = "", URL.revokeObjectURL(s), l.width = 0, l.height = 0;
  }
}
async function Je(e, t) {
  const r = [...new Set(e.filter((l) => !!l))], s = /* @__PURE__ */ new Map();
  let a = 0;
  return await Promise.all(
    Array.from({ length: Math.min(4, r.length) }, async () => {
      for (; a < r.length && !t.aborted; ) {
        const l = r[a++];
        try {
          const n = await Dt(l, t);
          if (!n.ok) continue;
          const o = await Xt(
            await n.blob(),
            t,
            Yt(l)
          );
          t.aborted ? o.close() : s.set(l, o);
        } catch {
        }
      }
    })
  ), {
    images: s,
    dispose: () => {
      for (const l of s.values()) l.close();
      s.clear();
    }
  };
}
function Qe(e) {
  if (Q(e)) return $t(e);
  const t = ee(e);
  if (t.length) return t.flatMap((a) => Qe(a.face));
  const r = D(e), s = Re(r, x(e));
  return [
    ...Ft(e),
    s.background,
    s.frame,
    s.boxes,
    s.pt,
    Ke(e, r.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(x(e)) ? Se(e).flatMap(
      (a) => a.badges.map((l) => qe(x(e), l))
    ) : [],
    r.legendary ? s.crown : null,
    e.illustration,
    oe(e),
    ...(e.manaSymbols ?? []).map(Z),
    ...ve(e.rulesText ?? "").flatMap(
      (a) => a.symbol ? [Z(a.symbol)] : []
    )
  ];
}
let Vt = null;
function _e() {
  return Vt ??= Promise.allSettled([
    document.fonts.load('24px "CardRenderer MTG Beleren"'),
    document.fonts.load('700 24px "CardRenderer MTG Beleren"'),
    document.fonts.load('24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('italic 24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('14px "CardRenderer MTG Relay"'),
    document.fonts.load('14px "CardRenderer MTG Artist Credit"')
  ]).then(() => {
  });
}
function te(e) {
  const t = Y(e), r = t.art;
  return x(e).startsWith("planeswalker") ? [r[0], r[1], r[2], t.type[1] - r[1]] : r;
}
const Fe = /* @__PURE__ */ new WeakMap(), re = ([e, t, r, s]) => [e, 1 - t - s, e + r, 1 - t], Zt = [re(B.art), [0, 0, 0, 0]];
function ar(e) {
  if (!e) return Zt;
  const t = Fe.get(e);
  if (t) return t;
  const r = ee(e), s = r.length ? [
    re(Pe(r[0], te(r[0].face))),
    re(Pe(r[1], te(r[1].face)))
  ] : [re(te(e)), [0, 0, 0, 0]];
  return Fe.set(e, s), s;
}
async function qt(e, t, r, s, a, l, n = Je, o) {
  return et(e, t, r, s, {
    threshold: a,
    resolveEtching: o,
    beforePaint: l,
    loadImages: n,
    height: v
  });
}
async function et(e, t, r, s, a) {
  const { threshold: l, beforePaint: n, loadImages: o, height: d } = a, i = ee(t);
  if (i.length) {
    for (const c of i)
      e.save(), Ze(e, c), await et(e, c.face, r, s, {
        ...a,
        height: c.height * h / c.width
      }), e.restore();
    return;
  }
  if (t.illustration && a.resolveEtching) {
    let c;
    try {
      const T = await a.resolveEtching(t, r, s, l, n);
      c = await o([T, t.illustration], s);
      const C = c.images.get(T ?? "");
      if (C && !s.aborted) {
        await n?.(), s.throwIfAborted();
        const [_, U, N, G] = Y(t).art, j = _ * h, H = U * d, S = N * h, A = G * d, $ = c.images.get(t.illustration) ?? C;
        e.save(), e.beginPath();
        const F = te(t);
        if (e.rect(
          F[0] * h,
          F[1] * d,
          F[2] * h,
          F[3] * d
        ), e.clip(), e.imageSmoothingQuality = "low", t.illustrationCrop) {
          const E = t.illustrationCrop, me = le($.width * E[2], $.height * E[3], [
            j,
            H,
            S,
            A
          ]);
          e.drawImage(
            C,
            E[0] * C.width,
            E[1] * C.height,
            E[2] * C.width,
            E[3] * C.height,
            ...me
          );
        } else
          e.drawImage(
            C,
            ...le($.width, $.height, [j, H, S, A])
          );
        e.restore();
      }
    } catch {
    } finally {
      c?.dispose();
    }
  }
  if (s.throwIfAborted(), !t.setCode) return;
  const [u, f, g, I] = Y(t).stamp, M = u * h, L = f * d, b = g * h, R = I * d, y = oe(t, "common"), m = await o([y], s);
  try {
    await n?.(), s.throwIfAborted();
    const c = y ? m.images.get(y) : null;
    if (e.save(), e.globalAlpha = 0.68, c) {
      const T = Math.min(b / c.width, R / c.height);
      e.drawImage(
        c,
        M + (b - c.width * T) / 2,
        L + (R - c.height * T) / 2,
        c.width * T,
        c.height * T
      );
    } else
      e.translate(M, L), e.scale(b / 100, R / 100), e.fillStyle = "white", e.fill(new Path2D(ht)), e.font = "bold 43px Georgia", e.textAlign = "center", e.textBaseline = "alphabetic", e.fillText(ft(t.setCode), 50, 65);
    e.restore();
  } finally {
    m.dispose();
  }
}
function Kt(e) {
  return e.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const Jt = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, We = /* @__PURE__ */ new WeakMap();
function Qt(e, t) {
  let r = We.get(t);
  if (r || (r = new Path2D(t.path), We.set(t, r)), e.save(), t.viewBox) {
    const [s, a, l, n] = t.viewBox;
    e.scale(24 / l, 24 / n), e.translate(-s, -a);
  }
  t.transform && e.transform(...t.transform), t.filled ? (e.fillStyle = e.strokeStyle, e.fill(r)) : e.stroke(r), e.restore();
}
function xe(e, t, r, s, a = !1) {
  const l = h * 0.105, n = h * 0.015, o = Math.floor(h * 0.9 / (l + n));
  if (t.forEach((I, M) => {
    e.save(), e.translate(
      h * 0.05 + M % o * (l + n),
      v * 0.13 + Math.floor(M / o) * (l + n)
    ), e.fillStyle = "#17201fed", e.strokeStyle = "#c6af7977", e.lineWidth = 1, e.beginPath(), e.arc(l / 2, l / 2, l / 2, 0, Math.PI * 2), e.fill(), e.stroke(), e.translate(l * 0.14, l * 0.14), e.scale(l * 0.72 / 24, l * 0.72 / 24), e.strokeStyle = "#f3e9cf", e.lineWidth = 1.8, e.lineCap = "round", e.lineJoin = "round", Qt(e, I), e.restore();
  }), r?.power == null || r.toughness == null) return;
  e.save();
  const d = Jt[a ? "inspect" : "table"], i = h * d.width, u = v * d.height, f = h * (1 - d.right - d.width), g = v * (1 - d.bottom - d.height);
  s ? e.drawImage(s, f, g, i, u) : (e.fillStyle = "#eee5cf", e.strokeStyle = "#746854", e.lineWidth = 2, e.beginPath(), e.roundRect(
    f + i * (a ? 0.14 : 0.1),
    g + u * (a ? 0.19 : 0.18),
    i * (a ? 0.72 : 0.8),
    u * (a ? 0.62 : 0.64),
    u * 0.12
  ), e.fill(), e.stroke()), e.font = `bold ${h * (a ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
    `${r.power}/${r.toughness}`,
    f + i / 2,
    a ? g + u / 2 - h * 0.01 : g + u * 0.48,
    i * 0.72
  ), e.restore();
}
function lr(e) {
  return e.currentStats?.power != null && e.currentStats.toughness != null && e.statusLayout !== "inspect" ? { ...e, statusLayout: "inspect" } : e;
}
function nr(e, t) {
  if (e.custom)
    return JSON.stringify([
      "custom-face-v1",
      e.custom.key,
      t,
      e.layer ?? "face",
      e.layer === "etching" ? e.etchThreshold ?? 20 : null
    ]);
  const r = e.face, s = tt(r, e.layer === "etching"), a = e.currentStats?.power != null && e.currentStats.toughness != null ? [e.currentStats.power, e.currentStats.toughness] : null;
  return JSON.stringify([
    K,
    "canvas-face-v5",
    e.paintLayer ?? null,
    t,
    e.printingId,
    e.layer === "etching" ? null : e.printedImage,
    s,
    e.layer ?? "face",
    e.layer === "etching" ? e.etchThreshold ?? 14 : null,
    e.layer === "etching" ? null : [
      (e.emblems ?? []).map((l) => [
        l.path,
        l.viewBox ?? null,
        l.transform ?? null,
        !!l.filled
      ]),
      a,
      a ? e.statusLayout ?? t : null
    ]
  ]);
}
function tt(e, t) {
  const r = ee(e);
  return r.length ? [
    e.layout,
    r.map((s) => [s.x, s.y, s.width, s.height, s.rotation, tt(s.face, t)]),
    !t && Me(e)
  ] : t ? [
    e.illustration ?? null,
    e.etchedIllustration ?? null,
    e.illustrationCrop ?? null,
    e.setCode ?? null,
    e.setSymbol ?? null,
    Y(e)
  ] : [
    Q(e) ? [Ce(e), J(e)] : null,
    e.borderColor ?? null,
    e.name,
    e.manaSymbols ?? [],
    e.typeLine ?? "",
    e.rulesText ?? "",
    e.illustration ?? null,
    e.illustrationCrop ?? null,
    Wt(e),
    e.artist ?? null,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.rarity ?? "common",
    e.power ?? null,
    e.toughness ?? null,
    e.loyalty ?? null,
    Y(e),
    D(e)
  ];
}
function er(e) {
  const t = document.createElement("canvas");
  return t.width = e === "table" ? 244 : 732, t.height = e === "table" ? 340 : 1020, t;
}
async function ir(e, t, r, s) {
  if (e.custom)
    return await s?.beforePaint?.(), r.throwIfAborted(), e.custom.compose(t, r, e.layer ?? "face", e.etchThreshold);
  const a = s?.loadImages ?? Je, l = er(t);
  try {
    const n = l.getContext("2d", {
      willReadFrequently: !!s?.cpuPixels
    });
    if (!n) throw new Error("Card composition needs Canvas2D.");
    if (n.imageSmoothingEnabled = !0, n.imageSmoothingQuality = "high", n.scale(l.width / h, l.height / v), e.layer === "etching")
      return await qt(
        n,
        e.face,
        e.printingId,
        r,
        e.etchThreshold,
        s?.beforePaint,
        a,
        s?.resolveEtching
      ), l;
    n.fillStyle = "#090806", n.fillRect(0, 0, h, v);
    const o = e.currentStats?.power != null && e.currentStats.toughness != null ? Re(D(e.face)).pt : null;
    if (e.printedImage) {
      const i = t === "inspect" ? Kt(e.printedImage) : e.printedImage, [u] = await Promise.all([
        a(o ? [i, o] : [i], r),
        o ? (s?.loadFonts ?? _e)() : Promise.resolve()
      ]);
      try {
        const f = u.images.get(i);
        if (f && !r.aborted)
          return await s?.beforePaint?.(), r.throwIfAborted(), n.drawImage(f, 0, 0, h, v), xe(
            n,
            e.emblems ?? [],
            e.currentStats,
            o ? u.images.get(o) : void 0,
            e.statusLayout === "inspect" || t === "inspect"
          ), l;
      } finally {
        u.dispose();
      }
    }
    const [d] = await Promise.all([
      a(Qe(e.face), r),
      (s?.loadFonts ?? _e)(),
      Q(e.face) ? (s?.loadRetroFont ?? Gt)() : Promise.resolve()
    ]);
    try {
      return await s?.beforePaint?.(), r.throwIfAborted(), rt(
        n,
        e.face,
        d.images,
        v,
        !1,
        s?.underArt,
        e.paintLayer
      ), xe(
        n,
        e.emblems ?? [],
        e.currentStats,
        o ? d.images.get(o) : void 0,
        e.statusLayout === "inspect" || t === "inspect"
      ), l;
    } finally {
      d.dispose();
    }
  } catch (n) {
    throw l.width = l.height = 0, n;
  }
}
function rt(e, t, r, s = v, a = !1, l, n) {
  if (Q(t)) {
    It(e, t, r, l, n);
    return;
  }
  const o = ee(t);
  if (o.length) {
    e.fillStyle = se(t.setCode, t.borderColor).border, e.fillRect(0, 0, h, v);
    for (const p of o)
      e.save(), Ze(e, p), rt(
        e,
        p.face,
        r,
        p.height * h / p.width,
        !0,
        l,
        n
      ), e.restore();
    if (n === "artwork") return;
    Ue(e, t), Me(t) && (e.font = '14px "CardRenderer MTG MPlantin", Georgia', e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      h / 2,
      v - 12,
      h * 0.9
    ));
    return;
  }
  const d = (p) => [
    p[0] * h,
    p[1] * s,
    p[2] * h,
    p[3] * s
  ];
  e.fillStyle = se(t.setCode, t.borderColor).border, e.fillRect(0, 0, h, s);
  const i = Y(t), u = x(t);
  if (n === "artwork") {
    ne(e, t, r, d(i.art), n);
    return;
  }
  const f = D(t), g = Re(f, u), M = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[f.boxes] ?? "#827d72", L = (p, k, O = "top") => {
    const X = r.get(p);
    if (!X) return !1;
    const [$e, ce, pe, we] = d(k);
    e.save(), e.beginPath(), e.rect($e, ce, pe, we), e.clip();
    const Ee = O === "stretch" ? we : X.height * pe / X.width;
    return e.drawImage(
      X,
      $e,
      O === "bottom" ? ce + we - Ee : ce,
      pe,
      Ee
    ), e.restore(), !0;
  }, [b, R, y, m] = d(f.legendary ? i.legendaryBackground : i.background);
  if (e.save(), e.beginPath(), e.roundRect(b, R, y, m, [
    { x: y * 0.01282, y: m * 962e-5 },
    { x: y * 0.01282, y: m * 962e-5 },
    { x: y * 0.06838, y: m * 0.05128 },
    { x: y * 0.06838, y: m * 0.05128 }
  ]), e.clip(), a) {
    const p = M.slice(1).match(/../g).map(
      (k, O) => Math.round(parseInt(k, 16) * 0.62 + [244, 236, 217][O] * 0.38)
    );
    e.fillStyle = `rgb(${p.join(",")})`, e.fillRect(b, R, y, m);
  }
  const c = r.get(g.background);
  if (c ? e.drawImage(
    c,
    b,
    R + (f.legendary ? w.legendaryBackgroundLift : 0),
    y,
    a ? m : c.height * y / c.width
  ) : (e.fillStyle = M, e.fillRect(b, R, y, m)), e.restore(), e.fillStyle = "#e3d8bb", !r.has(g.frame))
    if (u === "adventure")
      for (const p of ge(t).filter((k) => k.kind === "rules" && !k.color))
        e.fillRect(p.x, p.y, p.width, p.height);
    else e.fillRect(...d(i.rules));
  r.has(g.boxes) || (e.fillRect(...d(i.title)), e.fillRect(...d(i.type))), e.fillStyle = "#80745c", e.fillRect(...d(i.art));
  const T = r.get(g.frame);
  if (T && u === "normal" && !a && Ne(e, T, f.legendary, i.frame), l && (e.save(), e.beginPath(), e.rect(0, 0, h, s), e.clip(), e.resetTransform(), e.drawImage(l, 0, 0, e.canvas.width, e.canvas.height), e.restore()), ne(e, t, r, d(i.art), n), T && u !== "normal" && Ne(e, T, f.legendary, i.frame), f.legendary && L(g.crown, i.crown), a) {
    const p = r.get(g.boxes);
    if (p) {
      const O = p.height * 0.104;
      e.drawImage(p, 0, 0, p.width, O, ...d(i.title)), e.drawImage(p, 0, p.height - O, p.width, O, ...d(i.type));
    }
    const k = r.get(g.frame);
    e.fillStyle = "#e3d8bb", e.fillRect(...d(i.rules)), k && e.drawImage(
      k,
      k.width * 0.035,
      k.height * 0.675,
      k.width * 0.93,
      k.height * 0.325,
      ...d(i.rules)
    );
  } else
    L(g.boxes, i.title), L(g.boxes, i.type, "bottom");
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left";
  const [C, _, U, N] = d(i.title), G = C + w.plateLeft, j = Ut(t), H = t.manaSymbols ?? [], S = w.manaSize * j, A = H.length * S + Math.max(0, H.length - 1) * w.manaGap, $ = C + U - w.plateRight, F = $ - A;
  e.font = `bold ${w.titleFont * j}px "CardRenderer MTG Beleren", Georgia`, e.letterSpacing = `${w.titleTracking}px`, e.fillText(
    Oe(e, t.name, F - G - (H.length ? w.titleGap : 0)),
    G,
    _ + N / 2
  ), e.letterSpacing = "0px", H.forEach(
    (p, k) => Te(
      e,
      p,
      F + k * (S + w.manaGap),
      _ + N / 2 - S / 2 + w.manaLift / 2,
      S,
      r,
      !0
    )
  );
  const E = r.get(oe(t) ?? ""), [, me, , at] = d(i.type), Le = me + at / 2 + w.typeLift / 2, fe = E ? Math.min(w.setMaxWidth, w.setHeight * E.width / E.height) : 0, lt = $ - G - (E ? fe + w.setMargin + w.typeGap : 0);
  if (e.font = `${w.typeFont * j}px "CardRenderer MTG Beleren", Georgia`, e.fillText(Oe(e, t.typeLine ?? "", lt), G, Le), E) {
    const p = Math.min(fe / E.width, w.setHeight / E.height);
    Xe(
      e,
      E,
      t.setCode,
      t.rarity,
      $ - w.setMargin - fe,
      Le - E.height * p / 2,
      E.width * p,
      E.height * p
    );
  }
  if (Ve(t)) xt(e, t, r);
  else if (u !== "normal") Ht(e, t, r);
  else {
    const [p, k, O, X] = d(i.rules);
    e.save(), e.beginPath(), e.rect(p, k, O, X), e.clip(), ue(
      e,
      t.rulesText ?? "",
      p + w.rulesPaddingX,
      k + w.rulesPaddingY,
      O - 2 * w.rulesPaddingX,
      mt(t.rulesText ?? "") * j,
      r
    ), e.restore();
  }
  const ke = dt(t);
  if (ke && u !== "leveler") {
    L(g.pt, i.stats, "stretch");
    const [p, k, O] = d(i.stats);
    e.fillStyle = u.startsWith("planeswalker") ? "white" : "#17140f", e.font = `bold ${w.statsFont}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      ke.text,
      p + O / 2,
      k + (u.startsWith("planeswalker") ? i.stats[3] * v / 2 : w.statsLine / 2),
      O
    );
  }
  a || Ue(e, t);
}
function Ue(e, t) {
  const [r, s, a, l] = st(B.footer), n = s + w.footerLine;
  e.save(), e.beginPath(), e.rect(r, s, a, l), e.clip(), e.textAlign = "left", e.textBaseline = "top", e.fillStyle = se(t.setCode, t.borderColor).ink, e.font = `${w.footerFont}px "CardRenderer MTG Relay", sans-serif`, e.letterSpacing = `${w.footerTracking}px`;
  const o = t.setCode?.trim().toUpperCase() ?? "";
  e.fillText(o, r, n);
  let d = r + e.measureText(o).width;
  e.letterSpacing = "0px", t.artist && (d += w.artistMarginLeft, e.font = `${w.footerFont}px "CardRenderer MTG Artist Credit", sans-serif`, e.fillText("a", d, n), d += e.measureText("a").width + w.artistMarginRight, e.font = `${w.footerFont * 1.154}px "CardRenderer MTG Beleren", Georgia`, e.fillText(t.artist, d, n)), e.restore();
}
function Ne(e, t, r, s = B.frame) {
  const [a, l, n, o] = st(s), d = Math.min(t.height, o * t.width / n), i = d * n / t.width, u = e.getTransform().a;
  e.save(), e.shadowColor = "black", e.shadowOffsetX = -394e-5 * h * u, e.shadowOffsetY = 394e-5 * h * u, e.shadowBlur = 236e-5 * h * u, e.drawImage(t, 0, 0, t.width, d, a, l, n, i), r || (e.shadowColor = "#ffffffa0", e.shadowOffsetX = 157e-5 * h * u, e.shadowOffsetY = -315e-5 * h * u, e.shadowBlur = 157e-5 * h * u, e.drawImage(t, 0, 0, t.width, d, a, l, n, i)), e.restore();
}
function st(e) {
  return [e[0] * h, e[1] * v, e[2] * h, e[3] * v];
}
export {
  Qt as $,
  Xt as A,
  Oe as B,
  Bt as C,
  Zt as D,
  ht as E,
  B as F,
  ft as G,
  Ft as H,
  ge as I,
  Wt as J,
  ar as K,
  pt as L,
  er as M,
  ut as N,
  oe as O,
  Jt as P,
  dt as Q,
  K as R,
  Dt as S,
  Ve as T,
  le as U,
  lr as V,
  _e as W,
  Je as X,
  Gt as Y,
  Nt as Z,
  ie as _,
  nr as a,
  rt as a0,
  xe as a1,
  qt as a2,
  xt as a3,
  ne as a4,
  Te as a5,
  It as a6,
  ue as a7,
  Xe as a8,
  Ht as a9,
  Se as aA,
  Me as aB,
  Ut as aC,
  ve as aD,
  sr as aa,
  Ze as ab,
  st as ac,
  rr as ad,
  $t as ae,
  Ye as af,
  J as ag,
  De as ah,
  de as ai,
  Ce as aj,
  Mt as ak,
  St as al,
  Ge as am,
  W as an,
  kt as ao,
  ze as ap,
  Ae as aq,
  qe as ar,
  gt as as,
  mt as at,
  he as au,
  Ke as av,
  bt as aw,
  zt as ax,
  jt as ay,
  Ot as az,
  Yt as b,
  ir as c,
  w as d,
  x as e,
  Y as f,
  Re as g,
  z as h,
  Q as i,
  He as j,
  vt as k,
  v as l,
  Z as m,
  tr as n,
  h as o,
  Pe as p,
  Rt as q,
  D as r,
  ee as s,
  q as t,
  Lt as u,
  te as v,
  Qe as w,
  se as x,
  P as y,
  Et as z
};
