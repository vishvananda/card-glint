const it = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", dt = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", ht = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", be = {
  RENDERER_COMPONENT_ROOT: it,
  KEYRUNE_ROOT: dt,
  RETRO_ROOT: ht
};
function ut(e) {
  return e.power != null && e.toughness != null ? {
    text: `${e.power}/${e.toughness}`,
    label: `Power ${e.power}, toughness ${e.toughness}`
  } : e.loyalty != null && e.loyalty !== "" ? { text: String(e.loyalty), label: `Starting loyalty ${e.loyalty}` } : null;
}
const u = 488, C = 680;
function te(e, t) {
  if (t === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (t ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    e?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const ft = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", A = {
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
  stamp: [0.34, 0.76 - 0.16 * u / C, 0.32, 0.32 * u / C]
}, p = {
  titleFont: 0.04724 * u,
  titleTracking: 54e-5 * u,
  titleGap: 0.02362 * u,
  plateLeft: 0.02362 * u,
  plateRight: 0.01575 * u,
  manaSize: 0.03556 * 1.35 * u,
  manaGap: 378e-5 * u,
  manaLift: -63e-4 * u,
  typeFont: 0.044 * u,
  typeGap: 945e-5 * u,
  typeLift: -315e-5 * u,
  setHeight: 0.06142 * u,
  setMaxWidth: 0.11024 * u,
  setMargin: 472e-5 * u,
  rulesPaddingX: 0.01575 * u,
  rulesPaddingY: 0.02362 * u,
  normalRulesFont: 0.04444 * u,
  longRulesFont: 0.0381 * u,
  denseRulesFont: 0.0328 * u,
  paragraphGap: 787e-5 * u,
  statsFont: 0.05333 * u,
  statsLine: 0.08661 * u,
  footerFont: 0.02167 * u,
  footerLine: 0.02126 * u,
  footerTracking: 362e-5 * u,
  artistMarginLeft: 7e-3 * u,
  artistMarginRight: 35e-4 * u,
  legendaryBackgroundLift: -0.02047 * u
}, Ee = (e) => e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
function gt(e = A) {
  return {
    ...Object.fromEntries(
      Object.entries(e).flatMap(
        ([t, r]) => r.map((s, a) => [
          `--face-${Ee(t)}-${["x", "y", "w", "h"][a]}`,
          `${s * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(p).map(([t, r]) => [
        `--face-${Ee(t)}`,
        `${r / u * 100}cqw`
      ])
    )
  };
}
gt();
function mt(e) {
  return e.length > 340 ? "dense" : e.length > 210 ? "long" : "normal";
}
function ct(e) {
  return {
    dense: p.denseRulesFont,
    long: p.longRulesFont,
    normal: p.normalRulesFont
  }[mt(e)];
}
function ve(e) {
  return e.split(/(\{[^}\n]+\})/g).filter(Boolean).map((t) => ({
    value: t,
    symbol: /^\{[^}\n]+\}$/.test(t) ? t.slice(1, -1) : null
  }));
}
function pt(e) {
  const t = e.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[t] ?? t.slice(0, 3);
}
const me = "WUBRG";
function N(e) {
  const t = e.typeLine ?? "", r = e.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(t), s = e.land ?? /(^|\s)Land(?:\s|$)/i.test(t), a = !/\bPlaneswalker\b/i.test(t) && (e.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(t)), l = e.creature ?? /(^|\s)Creature(?:\s|$)/i.test(t), o = ae(e.colors ?? []), i = o.length === 0 ? "Colourless" : o.length > 2 ? "Gold" : o.join(""), d = (r || s) && o.length === 0 ? "Artifact" : i, n = s ? "Land" : r ? "Artifact" : o.length > 1 ? "Gold" : i;
  return {
    frame: d,
    boxes: n,
    background: n,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: s && o.length > 0 ? i : r && o.length > 0 ? o.length > 1 ? "Gold" : i : n,
    pt: n,
    artifact: r,
    land: s,
    legendary: a,
    creature: l,
    className: `rendered-card-profile-${n.toLocaleLowerCase()}`
  };
}
function ae(e) {
  return [
    ...new Set(
      e.map((t) => t.toLocaleUpperCase()).filter((t) => me.includes(t))
    )
  ].sort((t, r) => me.indexOf(t) - me.indexOf(r));
}
const wt = be.KEYRUNE_ROOT, Ne = new Set(
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
Ne.add("con_");
const yt = "GLINT", re = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function bt(e) {
  const t = re[e] ?? re.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${t}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function vt(e) {
  const t = re[e] ?? re.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${t}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function Ct(e, t = "common") {
  const r = e.trim().toLowerCase();
  if (r === "forge") return vt(t);
  if (r === yt.toLowerCase()) return bt(t);
  const s = r === "con" ? "con_" : r;
  return Ne.has(s) ? `${wt}/${s}.svg` : null;
}
const q = be.RENDERER_COMPONENT_ROOT;
function Ce(e, t = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(t), s = t === "saga" ? "saga" : t === "planeswalker-large" ? "planeswalker_large" : t, a = ["saga", "class"].includes(t) && e.boxes === "Colourless" ? "Land" : t.startsWith("planeswalker") && e.boxes === "Artifact" ? "Colourless" : e.boxes;
  return {
    background: B(
      r ? "bg" : t === "class" ? "saga_bg" : `${s}_bg`,
      t.startsWith("planeswalker") && a === "Land" ? "Colourless" : a
    ),
    frame: B(
      ["normal", "leveler"].includes(t) ? "frames" : `${s}_frames`,
      t === "adventure" ? "WUBRG".includes(e.frame) ? e.frame : "W" : t === "class" ? e.frame === "WU" ? "UW" : e.frame.length === 2 ? "Gold" : e.frame : t === "saga" && e.frame === "Colourless" ? "Land" : t.startsWith("planeswalker") && ["Artifact", "Land"].includes(e.frame) ? "Colourless" : e.frame
    ),
    boxes: B(t.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", a),
    nameplate: B("nameplates", e.boxes),
    crown: B("legendary-crowns", e.crown),
    pt: t.startsWith("planeswalker") ? B("planeswalker", "Loyalty") : B("pt-boxes", e.pt)
  };
}
function Z(e) {
  const t = e.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = t === "∞" ? "INFINITY" : t === "½" ? "HALF" : t.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? B("symbols", r) : null;
}
function le(e, t) {
  return Ct(e, t);
}
function B(e, t) {
  const r = e === "legendary-crowns" ? "legendary_crowns" : e === "pt-boxes" ? "pt_boxes" : e === "nameplates" ? "boxes" : e, s = e === "symbols" ? "svg" : "webp";
  return `${q}/img/${r}/${encodeURIComponent(t)}.${s}`;
}
const K = be.RETRO_ROOT, Rt = `${K}/fonts/goudy-medieval.ttf`, Tt = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), St = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function Q(e) {
  return e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") ? !1 : e.frameStyle === "retro" || e.frameStyle !== "modern" && Tt.has(e.setCode?.toLowerCase() ?? "");
}
function ne(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function j(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return ne(e) ? "abu" : t === "leg" && ae(e.colors ?? []).length > 1 ? "legends" : ["3ed", "4ed", "5ed", "atq"].includes(t) && !/\bLand\b/.test(e.typeLine ?? "") ? "fourth" : "seventh";
}
function Mt(e) {
  return j(e) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1];
}
function Ue(e) {
  const t = ne(e);
  return {
    ...A,
    frame: Mt(e),
    title: [t ? 0.07 : 0.1134, 0.0481, t ? 0.8467 : 0.8, 0.043],
    art: j(e) === "legends" ? [0.112, 0.094, 0.78, 0.45] : j(e) === "fourth" ? [0.114, 0.098, 0.772, 0.445] : t ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429],
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: [0.8074, 0.895, 0.1367, 0.043],
    footer: [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function Re(e) {
  const t = ae(e.colors ?? []), r = e.typeLine ?? "", s = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([i]) => r.includes(i)), a = /\bLand\b/.test(r) ? s.length === 1 ? s[0][1] + "l" : "l" : /\bArtifact\b/.test(r) ? "a" : t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "c", l = j(e), o = l === "seventh" || a === "c" || l === "abu" && a === "m" ? "seventh/regular" : `old/${l}`;
  return `${K}/img/frames/${o}/${l === "legends" ? "legendsFrameM" : a}.png`;
}
function J(e) {
  return e.borderColor ?? (St.has(e.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function Ge(e) {
  return J(e) === "silver" ? te(null, "silver").border : J(e) === "white" ? Lt : "#080808";
}
function He(e) {
  return j(e) === "fourth" ? `${K}/img/frames/old/fourth/borderBlack.png` : `${K}/img/frames/${ne(e) ? "old/abu" : "seventh/regular"}/border.svg`;
}
function Ae(e) {
  return ne(e) ? "#ababab" : "#f2eee3";
}
function kt(e) {
  return e.setCode?.toLowerCase() === "7ed" && ae(e.colors ?? []).some((t) => t === "W" || t === "G") && !/Land/.test(e.typeLine ?? "") ? "saturate(.7) brightness(.88)" : "none";
}
function je(e) {
  if (!/\bBasic Land\b/.test(e.typeLine ?? "") || !/^\(?\{T\}: Add \{[WUBRG]\}\.\)?$/.test(e.rulesText ?? ""))
    return null;
  const t = (e.rulesText ?? "").match(/Add \{([WUBRG])\}/)?.[1];
  return t ? `${K}/img/frames/m15/basics/${t.toLowerCase()}.png` : null;
}
const Lt = "#eeedeb";
function ze(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  return ["lea", "leb", "2ed", "3ed", "4ed", "5ed"].includes(t) ? null : le(t, e.rarity);
}
function It(e) {
  const t = (e.rulesText ?? "").length;
  return t > 340 ? 16 : t > 210 ? 19 : 23;
}
function $t(e) {
  return [
    je(e),
    Re(e),
    J(e) !== "black" || j(e) === "fourth" ? He(e) : null,
    e.illustration,
    ze(e),
    ...(e.manaSymbols ?? []).map(Z),
    ...[...(e.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((t) => Z(t[1]))
  ];
}
const _ = ([e, t, r, s]) => [
  e * u,
  t * C,
  r * u,
  s * C
];
function De(e, t, [r, s, a, l]) {
  if (!(e > 0 && t > 0)) return [r, s, a, l];
  const o = Math.max(a / e, l / t), i = e * o, d = t * o;
  return [r + (a - i) / 2, s + (l - d) / 2, i, d];
}
function Et(e, t, r, s) {
  const a = [s[0] * e, s[1] * t, s[2] * e, s[3] * t];
  return [...a, ...De(a[2], a[3], r)];
}
function se(e, t, r, s, a) {
  const [l, o, i, d] = s;
  if (a === "printing") {
    e.clearRect(l, o, i, d);
    return;
  }
  a === "artwork" && (e.fillStyle = "#80745c", e.fillRect(l, o, i, d));
  const n = r.get(t.illustration ?? "");
  n && (e.save(), e.beginPath(), e.rect(l, o, i, d), e.clip(), t.illustrationCrop ? e.drawImage(
    n,
    ...Et(n.width, n.height, s, t.illustrationCrop)
  ) : e.drawImage(n, ...De(n.width, n.height, s)), e.restore());
}
function oe(e, t, r, s) {
  const a = [];
  for (const l of t.split(`
`)) {
    let o = [], i = 0;
    const d = ve(l).flatMap(
      (n) => n.symbol ? [{ text: n.symbol, symbol: !0 }] : (n.value.match(/\s+|\S+/g) ?? []).map((h) => ({ text: h, symbol: !1 }))
    );
    for (const n of d) {
      const h = !n.symbol && e.measureText(n.text).width > r ? [...n.text].map((g) => ({ text: g, symbol: !1 })) : [n];
      for (const g of h) {
        const f = g.symbol ? s * 0.94 : e.measureText(g.text).width;
        i + f > r && o.length && (a.push(o), o = [], i = 0), !(!o.length && /^\s+$/.test(g.text)) && (o.push({ ...g, width: f }), i += f);
      }
    }
    a.push(o);
  }
  return a;
}
function Te(e, t, r, s, a, l, o = !1) {
  const i = l.get(Z(t) ?? "");
  e.save();
  const d = {
    W: "#efe7cb",
    U: "#3d7ac3",
    B: "#33313c",
    R: "#c2432e",
    G: "#3b8a4e"
  };
  if (o) {
    const n = 1.5372 * e.getTransform().a;
    e.shadowColor = "#000d", e.shadowOffsetX = -n, e.shadowOffsetY = n;
  }
  if (e.fillStyle = d[t] ?? "#9aa4ae", e.beginPath(), e.arc(r + a / 2, s + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.shadowColor = "transparent", i) {
    e.drawImage(i, r, s, a, a), e.restore();
    return;
  }
  e.fillStyle = t === "B" ? "white" : "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = `bold ${a * 0.62}px Georgia`, e.fillText(t, r + a / 2, s + a / 2, a * 0.9), e.restore();
}
function ie(e, t, r, s, a, l, o) {
  const i = typeof l == "number" ? l : l.size;
  e.font = `${typeof l != "number" && l.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
  const d = t.split(`
`).map((n) => oe(e, n, a, i));
  e.textBaseline = "top";
  for (const n of d) {
    for (const h of n) {
      let g = r;
      for (const f of h)
        f.symbol ? Te(e, f.text, g + i * 0.07, s + i * 0.03, i * 0.8, o) : e.fillText(f.text, g, s), g += f.width;
      s += i;
    }
    s += p.paragraphGap;
  }
}
function Oe(e, t, r) {
  if (e.measureText(t).width <= r) return t;
  const s = [...t];
  for (; s.length && e.measureText(`${s.join("")}…`).width > r; ) s.pop();
  return s.length || e.measureText("…").width <= r ? `${s.join("")}…` : "";
}
function Ye(e, t, r, s, a, l, o, i) {
  const d = {
    uncommon: "#aaaeb2",
    rare: "#bc923f",
    mythic: "#c65c2d",
    special: "#8664af",
    bonus: "#bc923f"
  }[s ?? "common"];
  if (!d || ["forge", "glint"].includes(r?.toLowerCase() ?? "")) {
    e.drawImage(t, a, l, o, i);
    return;
  }
  const n = document.createElement("canvas");
  n.width = Math.max(1, Math.ceil(o * 2)), n.height = Math.max(1, Math.ceil(i * 2));
  const h = n.getContext("2d");
  h.drawImage(t, 0, 0, n.width, n.height), h.globalCompositeOperation = "source-in", h.fillStyle = d, h.fillRect(0, 0, n.width, n.height), e.drawImage(n, a, l, o, i), n.width = n.height = 0;
}
function Gt(e, t, r, s, a) {
  const l = Ue(t);
  if (a === "artwork") {
    se(e, t, r, _(l.art), a);
    return;
  }
  e.fillStyle = Ge(t), e.fillRect(0, 0, 488, 680), e.fillStyle = "#686050", e.fillRect(24.4, 27.2, 439.2, 625.6), e.fillStyle = "#e5dec5", e.fillRect(..._(l.rules)), e.fillStyle = "#746b58", e.fillRect(..._(l.art)), s && e.drawImage(s, 0, 0, 488, 680), se(e, t, r, _(l.art), a);
  const o = r.get(Re(t));
  if (o && (e.save(), e.filter = kt(t), e.drawImage(o, ..._(l.frame)), e.restore()), J(t) !== "black" || j(t) === "fourth") {
    const S = r.get(He(t));
    if (S) {
      const $ = document.createElement("canvas");
      $.width = 732, $.height = 1020;
      const E = $.getContext("2d");
      E.drawImage(S, 0, 0, 732, 1020), E.globalCompositeOperation = "source-in", E.fillStyle = Ge(t), E.fillRect(0, 0, 732, 1020), e.drawImage($, ..._(l.frame)), $.width = $.height = 0;
    }
  }
  e.fillStyle = Ae(t), e.textBaseline = "middle", e.textAlign = "left", e.letterSpacing = "0px";
  const [i, d, n, h] = _(l.title), g = t.manaSymbols ?? [], f = 23.4, L = 1.7, R = g.length * (f + L);
  e.shadowColor = "#000b", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = '27.8px "CardRenderer MTG Goudy", Georgia', e.fillText(t.name, i, d + h / 2, Math.max(1, n - R - 5)), g.forEach(
    (S, $) => Te(e, S, i + n - R + $ * (f + L), d + h / 2 - f / 2, f, r, !0)
  );
  const [M, b, v, y] = _(l.type), m = r.get(ze(t) ?? "");
  if (e.font = '21.7px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.typeLine ?? "", M, b + y / 2, v - (m ? 48 : 0)), m) {
    const S = Math.min(44 / m.width, 23.4 / m.height);
    Ye(
      e,
      m,
      t.setCode,
      t.rarity,
      M + v - m.width * S,
      b + y / 2 - m.height * S / 2,
      m.width * S,
      m.height * S
    );
  }
  e.shadowColor = "transparent";
  const [w, T, I, x] = _(l.rules), U = t.rulesText ?? "", H = It(t);
  e.font = `${H}px "CardRenderer MTG MPlantin", Georgia`, e.fillStyle = "#17140f";
  const O = r.get(je(t) ?? ""), z = oe(e, U, I, H), D = z.length * H + (U.split(`
`).length - 1) * 3.84;
  if (e.save(), e.beginPath(), e.rect(w, T, I, x), e.clip(), O) {
    const S = Math.min(I * 0.4 / O.width, x * 0.75 / O.height);
    e.drawImage(
      O,
      w + (I - O.width * S) / 2,
      T + (x - O.height * S) / 2,
      O.width * S,
      O.height * S
    );
  } else ie(e, U, w, T + Math.max(0, (x - D) / 2), I, H, r);
  if (e.restore(), e.shadowColor = "#000b", e.fillStyle = Ae(t), e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", t.power != null && t.toughness != null) {
    const [S, $, E, Y] = _(l.stats);
    e.textAlign = "center", e.fillText(`${t.power}/${t.toughness}`, S + E / 2, $ + Y / 2, E);
  }
  if (t.artist) {
    const [S, $, E, Y] = _(l.footer);
    e.textAlign = "center", e.font = '15.6px "CardRenderer MTG MPlantin", Georgia', e.fillText(`Illus. ${t.artist}`, S + E / 2, $ + Y / 2, E);
  }
  e.shadowColor = "transparent";
}
const At = (e, t = {}) => fetch(e, { ...t, mode: "cors" });
let Be;
function Ot() {
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
function F(e) {
  return e.layout === "ability" ? "normal" : e.layout === "adventure" && e.faces?.length === 2 ? "adventure" : e.layout === "class" || /\bClass\b/i.test(e.typeLine ?? "") ? "class" : e.layout === "leveler" || /^Level up\b/m.test(e.rulesText ?? "") ? "leveler" : e.layout === "saga" || /\bSaga\b/i.test(e.typeLine ?? "") ? "saga" : e.layout === "planeswalker" || /\bPlaneswalker\b/i.test(e.typeLine ?? "") ? Se(e).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function W(e) {
  if (Q(e)) return Ue(e);
  const t = F(e);
  if (t === "adventure")
    return {
      ...A,
      frame: [2.9 / 63.5, 3.5 / 88.9, 57.4 / 63.5, 79 / 88.9],
      type: [0.05669, 49.7 / 88.9, 0.88662, 0.05737],
      stamp: [0.58, 0.74, 0.25, 0.1794]
    };
  if (t === "class")
    return {
      ...A,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (t === "saga")
    return {
      ...A,
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
    ], a = A.stamp[2], l = A.stamp[3];
    return {
      ...A,
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
    ...A,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : e.layout === "aftermath-top" ? {
    ...A,
    title: [0.035, 0.025, 0.93, 0.105],
    art: [0.052, 0.145, 0.896, 0.39],
    type: [0.035, 0.55, 0.93, 0.105],
    rules: [0.052, 0.67, 0.896, 0.29],
    footer: [0, 1, 0, 0]
  } : A;
}
function Bt(e) {
  const t = F(e) === "saga", r = W(e).rules, s = Se(e), a = r[2] * 488 - (t ? 32 : 70), l = r[3] * 680;
  let o = t ? 21 : 19;
  const i = (b, v) => Math.max(1, Math.ceil(b.length * v * 0.49 / a)), d = (b, v) => Math.max(t ? b.badges.length * 36 : 34, i(b.text, v) * v + 16), n = (b) => s.reduce((v, y) => v + d(y, b), 0);
  for (; o > 8 && n(o) > l; ) o -= 0.5;
  const h = s.map((b) => d(b, o)), g = Math.max(0, l - n(o)) / Math.max(1, s.length);
  let f = l / Math.max(1, s.length), L = l, R = s.length;
  if (!t)
    for (const b of [...h].sort((v, y) => y - v)) {
      if (b <= f) break;
      L -= b, f = L / Math.max(1, --R);
    }
  let M = 0;
  return s.map((b, v) => {
    const y = t ? h[v] + g : Math.max(f, h[v]), m = { ...b, top: M, height: y, font: o, left: t ? 27 : 62, width: a };
    return M += y, m;
  });
}
const Pt = `${q}/img/class_level_bg.webp`, Xe = (e) => ["adventure", "class", "leveler"].includes(F(e)), V = (e, t, r, s) => ({
  x: e / 63.5 * 488,
  y: t / 88.9 * 680,
  width: r / 63.5 * 488,
  height: s / 88.9 * 680
}), _t = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function Ft(e, t, r, s = 21) {
  const a = e.replace(/\{[^}]+\}/g, "●").split(`
`);
  let l = s;
  for (; l > 8 && a.reduce(
    (o, i) => o + Math.max(1, Math.ceil(i.length * l * 0.53 / t)) * l + 4,
    0
  ) > r; )
    l -= 0.5;
  return l;
}
function de(e) {
  const t = F(e), r = [], s = (a, l, o, i = {}) => {
    r.push({ kind: a, text: l, ...o, font: Ft(l, o.width, o.height), ...i });
  };
  if (t === "adventure") {
    const a = e.faces?.[1];
    if (!a) return [];
    const l = (a.manaSymbols ?? []).map((i) => `{${i}}`).join(""), o = (a.manaSymbols?.length ?? 0) * 2.5;
    s("heading", a.name, V(5.6, 55.3, 25 - o, 4.2), {
      color: "white",
      font: Math.min(18, (25 - o) * 488 / 63.5 / Math.max(1, a.name.length * 0.55))
    }), s("rules", l, V(30 - o, 55.3, o, 4.2), { color: "white", font: 17 }), s("heading", a.typeLine ?? "", V(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (a.typeLine ?? "").length * 0.52))
    }), s("rules", a.rulesText ?? "", V(5.6, 64.5, 24.7, 15.6)), s("rules", e.rulesText ?? e.faces?.[0]?.rulesText ?? "", V(33, 54.9, 25.5, 25));
  } else if (t === "class") {
    const [a, l, o, i] = W(e).rules.map(
      (m, w) => m * (w % 2 ? C : u)
    ), d = N(e);
    s(
      "band",
      "",
      { x: a, y: l, width: o, height: i },
      {
        fill: "#e3d8bb",
        asset: B(
          "saga_textboxes",
          d.boxes === "Colourless" ? "Land" : d.boxes
        )
      }
    );
    const n = [];
    for (const m of (e.rulesText ?? "").split(`
`).filter(Boolean))
      n.length && !/^.*:\s*Level\s+\d+\s*$/i.test(m) && !/^.*:\s*Level\s+\d+\s*$/i.test(n.at(-1)) && !n.at(-1).startsWith("(") ? n[n.length - 1] += `
` + m : n.push(m);
    const h = (m) => /^.*:\s*Level\s+\d+\s*$/i.test(m), g = 28, f = 20, L = (m, w) => m.split(`
`).reduce(
      (T, I) => T + Math.max(1, Math.ceil(I.length * w * 0.53 / (o - 10))),
      0
    ), R = n.map(
      (m) => h(m) ? g : L(m, m.startsWith("(") ? 16 : f) * (m.startsWith("(") ? 16 : f) + 8
    ), M = n.filter((m) => !h(m)).length, b = Math.max(0, i - R.reduce((m, w) => m + w, 0)) / Math.max(1, M), v = Math.min(
      1,
      (i - n.filter(h).length * g) / R.reduce((m, w, T) => m + (h(n[T]) ? 0 : w), 0)
    );
    let y = l;
    n.forEach((m, w) => {
      const T = h(m), I = T ? g : R[w] * v + b;
      if (T) {
        const [x, U] = m.split(/:\s*/);
        s("band", "", { x: a, y, width: o, height: I }, { asset: Pt }), s("rules", x + ":", { x: a + 5, y, width: o / 2 - 5, height: I }, { font: 18 }), s(
          "heading",
          U,
          { x: a + o / 2, y, width: o / 2 - 5, height: I },
          { font: 18, align: "right" }
        );
      } else
        s(
          "rules",
          m,
          { x: a + 5, y: y + 4, width: o - 10, height: I - 8 },
          { font: (m.startsWith("(") ? 16 : f) * v, italic: m.startsWith("(") }
        );
      y += I;
    });
  } else if (t === "leveler") {
    const a = e.rulesText ?? "", l = a.split(/^LEVEL\s+([^\n]+)\n/gm), o = [
      {
        range: "",
        text: l[0] ?? "",
        stats: e.power != null && e.toughness != null ? `${e.power}/${e.toughness}` : ""
      }
    ];
    for (let h = 1; h < l.length; h += 2) {
      const g = l[h + 1] ?? "", f = g.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      o.push({
        range: l[h],
        stats: f?.[1] ?? "",
        text: f ? g.slice(f[0].length) : g
      });
    }
    const i = V(4.9, 55.6, 53.7, 25.5), d = i.height / o.length, n = _t[N(e).frame] ?? "#dcc8af";
    o.forEach((h, g) => {
      const f = i.y + g * d;
      g && s(
        "band",
        "",
        { x: i.x, y: f, width: i.width, height: d },
        { fill: g % 2 ? "#00000018" : "#00000028" }
      );
      const L = h.range ? 55 : 7, R = h.stats ? 72 : 7;
      s("rules", h.text, {
        x: i.x + L,
        y: f + 4,
        width: i.width - L - R,
        height: d - 8
      }), h.range && s(
        "level",
        `LEVEL
${h.range}`,
        { x: i.x - 12, y: f + d / 2 - 23, width: 65, height: 46 },
        { fill: n, font: 13 }
      ), h.stats && s(
        "stats",
        h.stats,
        { x: i.x + i.width - 68, y: f + d / 2 - 22, width: 77, height: 44 },
        { asset: B("pt-boxes", N(e).pt), font: 26 }
      );
    });
  }
  return r;
}
function Wt(e) {
  return de(e).flatMap((t) => [
    t.asset ?? null,
    ...ve(t.text).flatMap((r) => r.symbol ? [Z(r.symbol)] : [])
  ]);
}
function xt(e) {
  return Xe(e) ? de(e) : null;
}
function Nt(e, t, r) {
  for (const s of de(t)) {
    const { x: a, y: l, width: o, height: i, font: d } = s;
    e.save(), e.textAlign = "left", e.fillStyle = s.fill ?? "transparent", s.kind === "level" ? (e.beginPath(), e.moveTo(a, l), e.lineTo(a + o * 0.72, l), e.lineTo(a + o, l + i / 2), e.lineTo(a + o * 0.72, l + i), e.lineTo(a, l + i), e.closePath(), e.fill(), e.strokeStyle = "#0008", e.lineWidth = 1, e.stroke()) : s.fill && e.fillRect(a, l, o, i);
    const n = s.asset ? r.get(s.asset) : null;
    if (n && e.drawImage(n, a, l, o, i), e.beginPath(), e.rect(a, l, o, i), e.clip(), e.fillStyle = s.color ?? "#17140f", ["stats", "level"].includes(s.kind)) {
      e.font = `${d}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
      const h = s.text.split(`
`);
      h.forEach(
        (g, f) => e.fillText(
          g,
          a + o * (s.kind === "level" ? 0.43 : 0.5),
          l + i / 2 + (f - (h.length - 1) / 2) * d,
          o * 0.85
        )
      );
    } else if (s.align === "right")
      e.font = `${d}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "right", e.textBaseline = "middle", e.fillText(s.text, a + o, l + i / 2, o);
    else {
      e.font = `${s.italic ? "italic " : ""}${d}px "CardRenderer MTG MPlantin", Georgia`;
      const h = oe(e, s.text, o, d).length * d + (s.text.split(`
`).length - 1) * p.paragraphGap;
      ie(
        e,
        s.text,
        a,
        l + Math.max(0, (i - h) / 2),
        o,
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
`).filter((o) => !/^Fuse\b/.test(o)).join(`
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
function Ve(e, t) {
  e.translate(t.x, t.y), e.rotate(t.rotation * Math.PI / 180), e.scale(t.width / u, t.width / u);
}
function ce(e, t) {
  const r = t[0] * e.width, s = t[1] * e.height, a = t[2] * e.width, l = t[3] * e.height;
  return e.rotation === -90 ? [
    (e.x + s) / u,
    (e.y - r - a) / C,
    l / u,
    a / C
  ] : e.rotation === 90 ? [
    (e.x - s - l) / u,
    (e.y + r) / C,
    l / u,
    a / C
  ] : [(e.x + r) / u, (e.y + s) / C, a / u, l / C];
}
function Ut(e) {
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? 1.5 : 1;
}
function Me(e) {
  return /\bFuse\b/.test(e.rulesText ?? "") || !!e.faces?.some((t) => /^Fuse\b/m.test(t.rulesText ?? ""));
}
function Ht(e) {
  return { font: 18, offsetY: e.startsWith("+") ? 2 : e === "0" ? 0 : -2 };
}
function Ze(e, t) {
  return e === "saga" ? /^(I|II|III|IV)$/.test(t) ? B("saga", t) : null : B(
    "planeswalker",
    t.startsWith("+") ? "LoyaltyPlus" : t === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function Ke(e, t) {
  return F(e) === "saga" ? B("saga_textboxes", t === "Colourless" ? "Land" : t) : null;
}
function jt(e) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0"
  }[N(e).boxes] ?? "#dededbf0";
}
function zt(e, t, r) {
  const s = F(t), a = s === "saga", l = W(t).rules, o = l[0] * u, i = l[1] * C, d = l[2] * u, n = l[3] * C;
  e.fillStyle = a ? "#e3d8bb" : jt(t), a ? e.fillRect(o, i, d, n) : (e.beginPath(), e.roundRect(o + 40, i + 3, d - 40, n - 6, [
    4,
    4,
    { x: (d - 40) / 2, y: 10 },
    { x: (d - 40) / 2, y: 10 }
  ]), e.fill());
  const h = Ke(t, N(t).boxes), g = h ? r.get(h) : void 0;
  g && e.drawImage(g, o, i, d, n);
  for (const f of Bt(t)) {
    f.top > 0 && (e.fillStyle = "#0002", e.fillRect(o + (a ? 0 : 40), i + f.top, d - (a ? 0 : 40), 1.5)), e.fillStyle = "#17140f", e.textAlign = "left", e.font = `${f.reminder ? "italic " : ""}${f.font}px "CardRenderer MTG MPlantin", Georgia`;
    const L = oe(e, f.text, f.width, f.font).length * f.font;
    ie(
      e,
      f.text,
      o + f.left,
      i + f.top + (f.height - L) / 2,
      f.width,
      { size: f.font, italic: f.reminder },
      r
    );
    const R = a ? 36 : 54, M = a ? 36 : 34;
    f.badges.forEach((b, v) => {
      const y = o + (a ? -18 : 0), m = i + f.top + f.height / 2 + (v - f.badges.length / 2) * M, w = Ze(s, b), T = w ? r.get(w) : null;
      if (T ? e.drawImage(T, y, m, R, M) : (e.fillStyle = "#29231c", e.fillRect(y, m, R, M)), !T || !a) {
        e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle";
        const I = Ht(b);
        e.font = `bold ${a ? 19 : I.font}px "CardRenderer MTG Beleren", Georgia`, e.fillText(
          b,
          y + R / 2 - (a ? 0 : 1.5),
          m + M / 2 + (a ? 0 : I.offsetY),
          R - 3
        ), a || (e.fillStyle = "#17140f", e.fillText(":", y + R + 4, m + M / 2));
      }
    });
  }
}
async function Dt(e, t) {
  return t.throwIfAborted(), fetch(e, { signal: t, mode: "cors" });
}
function qe(e) {
  if (e.startsWith(`${K}/img/frames/`) && e.endsWith(".png")) return 768;
  const t = e.startsWith(`${q}/img/`) ? e.slice(`${q}/img/`.length) : "";
  return t === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    t
  ) ? 768 : void 0;
}
async function Yt(e) {
  if (!e.type.includes("svg")) return e;
  const t = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), r = t.documentElement;
  if (r.localName !== "svg" || t.querySelector("parsererror"))
    throw new Error("Invalid SVG asset.");
  const s = (r.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), a = s[2] ?? parseFloat(r.getAttribute("width") ?? ""), l = s[3] ?? parseFloat(r.getAttribute("height") ?? "");
  if (!(a > 0 && l > 0 && Number.isFinite(a + l)))
    throw new Error("SVG asset needs a finite viewport.");
  const o = 512 / Math.max(a, l);
  return r.hasAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${a} ${l}`), r.setAttribute("width", String(Math.max(1, Math.round(a * o)))), r.setAttribute("height", String(Math.max(1, Math.round(l * o)))), new Blob([new XMLSerializer().serializeToString(r)], { type: "image/svg+xml" });
}
async function Xt(e, t, r) {
  if (t.throwIfAborted(), !e.type.includes("svg"))
    return r ? createImageBitmap(e, { resizeWidth: r, resizeQuality: "high" }) : createImageBitmap(e);
  const s = URL.createObjectURL(await Yt(e)), a = new Image(), l = document.createElement("canvas"), o = () => {
    a.src = "";
  };
  t.addEventListener("abort", o, { once: !0 });
  try {
    t.throwIfAborted(), a.src = s, await a.decode(), t.throwIfAborted(), l.width = a.naturalWidth, l.height = a.naturalHeight;
    const i = l.getContext("2d", { willReadFrequently: !0 });
    if (!i || !l.width || !l.height)
      throw new Error("SVG asset could not be rasterized.");
    return i.drawImage(a, 0, 0), await createImageBitmap(l);
  } finally {
    t.removeEventListener("abort", o), a.src = "", URL.revokeObjectURL(s), l.width = 0, l.height = 0;
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
          const o = await Dt(l, t);
          if (!o.ok) continue;
          const i = await Xt(
            await o.blob(),
            t,
            qe(l)
          );
          t.aborted ? i.close() : s.set(l, i);
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
  const r = N(e), s = Ce(r, F(e));
  return [
    ...Wt(e),
    s.background,
    s.frame,
    s.boxes,
    s.pt,
    Ke(e, r.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(F(e)) ? Se(e).flatMap(
      (a) => a.badges.map((l) => Ze(F(e), l))
    ) : [],
    r.legendary ? s.crown : null,
    e.illustration,
    le(e.setCode ?? "", e.rarity),
    ...(e.manaSymbols ?? []).map(Z),
    ...ve(e.rulesText ?? "").flatMap(
      (a) => a.symbol ? [Z(a.symbol)] : []
    )
  ];
}
let Vt = null;
function Pe() {
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
async function Zt(e, t, r, s, a, l, o = Je) {
  return et(e, t, r, s, {
    threshold: a,
    beforePaint: l,
    loadImages: o,
    height: C
  });
}
async function et(e, t, r, s, a) {
  const { threshold: l, beforePaint: o, loadImages: i, height: d } = a, n = ee(t);
  if (n.length) {
    for (const w of n)
      e.save(), Ve(e, w), await et(e, w.face, r, s, {
        ...a,
        height: w.height * u / w.width
      }), e.restore();
    return;
  }
  if (s.throwIfAborted(), !t.setCode) return;
  const [h, g, f, L] = W(t).stamp, R = h * u, M = g * d, b = f * u, v = L * d, y = le(t.setCode), m = await i([y], s);
  try {
    await o?.(), s.throwIfAborted();
    const w = y ? m.images.get(y) : null;
    if (e.save(), e.globalAlpha = 0.68, w) {
      const T = Math.min(b / w.width, v / w.height);
      e.drawImage(
        w,
        R + (b - w.width * T) / 2,
        M + (v - w.height * T) / 2,
        w.width * T,
        w.height * T
      );
    } else
      e.translate(R, M), e.scale(b / 100, v / 100), e.fillStyle = "white", e.fill(new Path2D(ft)), e.font = "bold 43px Georgia", e.textAlign = "center", e.textBaseline = "alphabetic", e.fillText(pt(t.setCode), 50, 65);
    e.restore();
  } finally {
    m.dispose();
  }
}
const Kt = (e) => e.replace("/normal/", "/large/"), qt = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, _e = /* @__PURE__ */ new WeakMap();
function Jt(e, t) {
  let r = _e.get(t);
  if (r || (r = new Path2D(t.path), _e.set(t, r)), e.save(), t.viewBox) {
    const [s, a, l, o] = t.viewBox;
    e.scale(24 / l, 24 / o), e.translate(-s, -a);
  }
  t.transform && e.transform(...t.transform), t.filled ? (e.fillStyle = e.strokeStyle, e.fill(r)) : e.stroke(r), e.restore();
}
function Fe(e, t, r, s, a = !1) {
  const l = u * 0.105, o = u * 0.015, i = Math.floor(u * 0.9 / (l + o));
  if (t.forEach((L, R) => {
    e.save(), e.translate(
      u * 0.05 + R % i * (l + o),
      C * 0.13 + Math.floor(R / i) * (l + o)
    ), e.fillStyle = "#17201fed", e.strokeStyle = "#c6af7977", e.lineWidth = 1, e.beginPath(), e.arc(l / 2, l / 2, l / 2, 0, Math.PI * 2), e.fill(), e.stroke(), e.translate(l * 0.14, l * 0.14), e.scale(l * 0.72 / 24, l * 0.72 / 24), e.strokeStyle = "#f3e9cf", e.lineWidth = 1.8, e.lineCap = "round", e.lineJoin = "round", Jt(e, L), e.restore();
  }), r?.power == null || r.toughness == null) return;
  e.save();
  const d = qt[a ? "inspect" : "table"], n = u * d.width, h = C * d.height, g = u * (1 - d.right - d.width), f = C * (1 - d.bottom - d.height);
  s ? e.drawImage(s, g, f, n, h) : (e.fillStyle = "#eee5cf", e.strokeStyle = "#746854", e.lineWidth = 2, e.beginPath(), e.roundRect(
    g + n * (a ? 0.14 : 0.1),
    f + h * (a ? 0.19 : 0.18),
    n * (a ? 0.72 : 0.8),
    h * (a ? 0.62 : 0.64),
    h * 0.12
  ), e.fill(), e.stroke()), e.font = `bold ${u * (a ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
    `${r.power}/${r.toughness}`,
    g + n / 2,
    a ? f + h / 2 - u * 0.01 : f + h * 0.48,
    n * 0.72
  ), e.restore();
}
function tt(e, t) {
  if (e.custom)
    return JSON.stringify([
      "custom-face-v1",
      e.custom.key,
      t,
      e.layer ?? "face",
      e.layer === "etching" ? e.etchThreshold ?? 20 : null
    ]);
  const r = e.face, s = rt(r, e.layer === "etching"), a = e.currentStats?.power != null && e.currentStats.toughness != null ? [e.currentStats.power, e.currentStats.toughness] : null;
  return JSON.stringify([
    q,
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
function rt(e, t) {
  const r = ee(e);
  return r.length ? [
    e.layout,
    r.map((s) => [s.x, s.y, s.width, s.height, s.rotation, rt(s.face, t)]),
    !t && Me(e)
  ] : t ? [
    e.illustration ?? null,
    e.etchedIllustration ?? null,
    e.illustrationCrop ?? null,
    e.setCode ?? null,
    W(e)
  ] : [
    Q(e) ? [Re(e), J(e)] : null,
    e.borderColor ?? null,
    e.name,
    e.manaSymbols ?? [],
    e.typeLine ?? "",
    e.rulesText ?? "",
    e.illustration ?? null,
    e.illustrationCrop ?? null,
    xt(e),
    e.artist ?? null,
    e.setCode ?? null,
    e.rarity ?? "common",
    e.power ?? null,
    e.toughness ?? null,
    e.loyalty ?? null,
    W(e),
    N(e)
  ];
}
function Qt(e) {
  const t = document.createElement("canvas");
  return t.width = e === "table" ? 244 : 732, t.height = e === "table" ? 340 : 1020, t;
}
async function we(e, t, r, s) {
  if (e.custom)
    return await s?.beforePaint?.(), r.throwIfAborted(), e.custom.compose(t, r, e.layer ?? "face", e.etchThreshold);
  const a = s?.loadImages ?? Je, l = Qt(t);
  try {
    const o = l.getContext("2d", {
      willReadFrequently: !!s?.cpuPixels
    });
    if (!o) throw new Error("Card composition needs Canvas2D.");
    if (o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "high", o.scale(l.width / u, l.height / C), e.layer === "etching")
      return await Zt(
        o,
        e.face,
        e.printingId,
        r,
        e.etchThreshold,
        s?.beforePaint,
        a
      ), l;
    o.fillStyle = "#090806", o.fillRect(0, 0, u, C);
    const i = e.currentStats?.power != null && e.currentStats.toughness != null ? Ce(N(e.face)).pt : null;
    if (e.printedImage) {
      const n = t === "inspect" ? Kt(e.printedImage) : e.printedImage, [h] = await Promise.all([
        a(i ? [n, i] : [n], r),
        i ? Pe() : Promise.resolve()
      ]);
      try {
        const g = h.images.get(n);
        if (g && !r.aborted)
          return await s?.beforePaint?.(), r.throwIfAborted(), o.drawImage(g, 0, 0, u, C), Fe(
            o,
            e.emblems ?? [],
            e.currentStats,
            i ? h.images.get(i) : void 0,
            e.statusLayout === "inspect" || t === "inspect"
          ), l;
      } finally {
        h.dispose();
      }
    }
    const [d] = await Promise.all([
      a(Qe(e.face), r),
      Pe(),
      Q(e.face) ? Ot() : Promise.resolve()
    ]);
    try {
      return await s?.beforePaint?.(), r.throwIfAborted(), st(
        o,
        e.face,
        d.images,
        C,
        !1,
        s?.underArt,
        e.paintLayer
      ), Fe(
        o,
        e.emblems ?? [],
        e.currentStats,
        i ? d.images.get(i) : void 0,
        e.statusLayout === "inspect" || t === "inspect"
      ), l;
    } finally {
      d.dispose();
    }
  } catch (o) {
    throw l.width = l.height = 0, o;
  }
}
function st(e, t, r, s = C, a = !1, l, o) {
  if (Q(t)) {
    Gt(e, t, r, l, o);
    return;
  }
  const i = ee(t);
  if (i.length) {
    e.fillStyle = te(t.setCode, t.borderColor).border, e.fillRect(0, 0, u, C);
    for (const c of i)
      e.save(), Ve(e, c), st(
        e,
        c.face,
        r,
        c.height * u / c.width,
        !0,
        l,
        o
      ), e.restore();
    if (o === "artwork") return;
    We(e, t), Me(t) && (e.font = '14px "CardRenderer MTG MPlantin", Georgia', e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      u / 2,
      C - 12,
      u * 0.9
    ));
    return;
  }
  const d = (c) => [
    c[0] * u,
    c[1] * s,
    c[2] * u,
    c[3] * s
  ];
  e.fillStyle = te(t.setCode, t.borderColor).border, e.fillRect(0, 0, u, s);
  const n = W(t), h = F(t);
  if (o === "artwork") {
    se(e, t, r, d(n.art), o);
    return;
  }
  const g = N(t), f = Ce(g, h), R = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[g.boxes] ?? "#827d72", M = (c, k, G = "top") => {
    const X = r.get(c);
    if (!X) return !1;
    const [Ie, ue, fe, ge] = d(k);
    e.save(), e.beginPath(), e.rect(Ie, ue, fe, ge), e.clip();
    const $e = G === "stretch" ? ge : X.height * fe / X.width;
    return e.drawImage(
      X,
      Ie,
      G === "bottom" ? ue + ge - $e : ue,
      fe,
      $e
    ), e.restore(), !0;
  }, [b, v, y, m] = d(g.legendary ? n.legendaryBackground : n.background);
  if (e.save(), e.beginPath(), e.roundRect(b, v, y, m, [
    { x: y * 0.01282, y: m * 962e-5 },
    { x: y * 0.01282, y: m * 962e-5 },
    { x: y * 0.06838, y: m * 0.05128 },
    { x: y * 0.06838, y: m * 0.05128 }
  ]), e.clip(), a) {
    const c = R.slice(1).match(/../g).map(
      (k, G) => Math.round(parseInt(k, 16) * 0.62 + [244, 236, 217][G] * 0.38)
    );
    e.fillStyle = `rgb(${c.join(",")})`, e.fillRect(b, v, y, m);
  }
  const w = r.get(f.background);
  if (w ? e.drawImage(
    w,
    b,
    v + (g.legendary ? p.legendaryBackgroundLift : 0),
    y,
    a ? m : w.height * y / w.width
  ) : (e.fillStyle = R, e.fillRect(b, v, y, m)), e.restore(), e.fillStyle = "#e3d8bb", !r.has(f.frame))
    if (h === "adventure")
      for (const c of de(t).filter((k) => k.kind === "rules" && !k.color))
        e.fillRect(c.x, c.y, c.width, c.height);
    else e.fillRect(...d(n.rules));
  r.has(f.boxes) || (e.fillRect(...d(n.title)), e.fillRect(...d(n.type))), e.fillStyle = "#80745c", e.fillRect(...d(n.art));
  const T = r.get(f.frame);
  if (T && h === "normal" && !a && xe(e, T, g.legendary, n.frame), l && (e.save(), e.beginPath(), e.rect(0, 0, u, s), e.clip(), e.resetTransform(), e.drawImage(l, 0, 0, e.canvas.width, e.canvas.height), e.restore()), se(e, t, r, d(n.art), o), T && h !== "normal" && xe(e, T, g.legendary, n.frame), g.legendary && M(f.crown, n.crown), a) {
    const c = r.get(f.boxes);
    if (c) {
      const G = c.height * 0.104;
      e.drawImage(c, 0, 0, c.width, G, ...d(n.title)), e.drawImage(c, 0, c.height - G, c.width, G, ...d(n.type));
    }
    const k = r.get(f.frame);
    e.fillStyle = "#e3d8bb", e.fillRect(...d(n.rules)), k && e.drawImage(
      k,
      k.width * 0.035,
      k.height * 0.675,
      k.width * 0.93,
      k.height * 0.325,
      ...d(n.rules)
    );
  } else
    M(f.boxes, n.title), M(f.boxes, n.type, "bottom");
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left";
  const [I, x, U, H] = d(n.title), O = I + p.plateLeft, z = Ut(t), D = t.manaSymbols ?? [], S = p.manaSize * z, $ = D.length * S + Math.max(0, D.length - 1) * p.manaGap, E = I + U - p.plateRight, Y = E - $;
  e.font = `bold ${p.titleFont * z}px "CardRenderer MTG Beleren", Georgia`, e.letterSpacing = `${p.titleTracking}px`, e.fillText(
    Oe(e, t.name, Y - O - (D.length ? p.titleGap : 0)),
    O,
    x + H / 2
  ), e.letterSpacing = "0px", D.forEach(
    (c, k) => Te(
      e,
      c,
      Y + k * (S + p.manaGap),
      x + H / 2 - S / 2 + p.manaLift / 2,
      S,
      r,
      !0
    )
  );
  const P = r.get(le(t.setCode ?? "", t.rarity) ?? ""), [, lt, , nt] = d(n.type), ke = lt + nt / 2 + p.typeLift / 2, he = P ? Math.min(p.setMaxWidth, p.setHeight * P.width / P.height) : 0, ot = E - O - (P ? he + p.setMargin + p.typeGap : 0);
  if (e.font = `${p.typeFont * z}px "CardRenderer MTG Beleren", Georgia`, e.fillText(Oe(e, t.typeLine ?? "", ot), O, ke), P) {
    const c = Math.min(he / P.width, p.setHeight / P.height);
    Ye(
      e,
      P,
      t.setCode,
      t.rarity,
      E - p.setMargin - he,
      ke - P.height * c / 2,
      P.width * c,
      P.height * c
    );
  }
  if (Xe(t)) Nt(e, t, r);
  else if (h !== "normal") zt(e, t, r);
  else {
    const [c, k, G, X] = d(n.rules);
    e.save(), e.beginPath(), e.rect(c, k, G, X), e.clip(), ie(
      e,
      t.rulesText ?? "",
      c + p.rulesPaddingX,
      k + p.rulesPaddingY,
      G - 2 * p.rulesPaddingX,
      ct(t.rulesText ?? "") * z,
      r
    ), e.restore();
  }
  const Le = ut(t);
  if (Le && h !== "leveler") {
    M(f.pt, n.stats, "stretch");
    const [c, k, G] = d(n.stats);
    e.fillStyle = h.startsWith("planeswalker") ? "white" : "#17140f", e.font = `bold ${p.statsFont}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      Le.text,
      c + G / 2,
      k + (h.startsWith("planeswalker") ? n.stats[3] * C / 2 : p.statsLine / 2),
      G
    );
  }
  a || We(e, t);
}
function We(e, t) {
  const [r, s, a, l] = at(A.footer), o = s + p.footerLine;
  e.save(), e.beginPath(), e.rect(r, s, a, l), e.clip(), e.textAlign = "left", e.textBaseline = "top", e.fillStyle = te(t.setCode, t.borderColor).ink, e.font = `${p.footerFont}px "CardRenderer MTG Relay", sans-serif`, e.letterSpacing = `${p.footerTracking}px`;
  const i = t.setCode?.trim().toUpperCase() ?? "";
  e.fillText(i, r, o);
  let d = r + e.measureText(i).width;
  e.letterSpacing = "0px", t.artist && (d += p.artistMarginLeft, e.font = `${p.footerFont}px "CardRenderer MTG Artist Credit", sans-serif`, e.fillText("a", d, o), d += e.measureText("a").width + p.artistMarginRight, e.font = `${p.footerFont * 1.154}px "CardRenderer MTG Beleren", Georgia`, e.fillText(t.artist, d, o)), e.restore();
}
function xe(e, t, r, s = A.frame) {
  const [a, l, o, i] = at(s), d = Math.min(t.height, i * t.width / o), n = d * o / t.width, h = e.getTransform().a;
  e.save(), e.shadowColor = "black", e.shadowOffsetX = -394e-5 * u * h, e.shadowOffsetY = 394e-5 * u * h, e.shadowBlur = 236e-5 * u * h, e.drawImage(t, 0, 0, t.width, d, a, l, o, n), r || (e.shadowColor = "#ffffffa0", e.shadowOffsetX = 157e-5 * u * h, e.shadowOffsetY = -315e-5 * u * h, e.shadowBlur = 157e-5 * u * h, e.drawImage(t, 0, 0, t.width, d, a, l, o, n)), e.restore();
}
function at(e) {
  return [e[0] * u, e[1] * C, e[2] * u, e[3] * C];
}
function pe(e) {
  const t = W(e), r = t.art;
  return F(e).startsWith("planeswalker") ? [r[0], r[1], r[2], t.type[1] - r[1]] : r;
}
const er = ([e, t, r, s]) => [e, 1 - t - s, e + r, 1 - t];
er(A.art);
function ye(e) {
  return async (t, r) => {
    const s = [...new Set(t.filter((l) => !!l))], a = await e.images(
      s.map((l) => ({ url: l, width: qe(l) })),
      r
    );
    return { images: new Map(a.value), dispose: () => a.release() };
  };
}
const tr = {
  id: "mtg",
  describe(e, t) {
    const r = structuredClone({
      ...e,
      setCode: e.setCode ?? "GLINT"
    }), s = t === "table" ? [244, 340] : [732, 1020], a = { printingId: null, printedImage: null, face: r }, l = ee(r), o = l.length ? l.map((n) => ({ face: n.face, panel: n })) : [{ face: r, panel: void 0 }], i = o.flatMap((n) => {
      if (!n.face.illustration) return [];
      const h = W(n.face).art, g = pe(n.face);
      return [
        {
          key: JSON.stringify([
            "mtg-art-v1",
            n.face.illustration,
            n.face.etchedIllustration,
            512,
            20
          ]),
          asset: { url: n.face.illustration, width: 512 },
          threshold: 20,
          crop: n.face.illustrationCrop ?? [0, 0, 1, 1],
          destination: n.panel ? ce(n.panel, h) : h,
          clip: n.panel ? ce(n.panel, g) : g,
          rotation: n.panel?.rotation ?? 0,
          importedMask: n.face.etchedIllustration ? { url: n.face.etchedIllustration, width: 512 } : void 0
        }
      ];
    }), d = { ...a, layer: "etching" };
    return {
      pack: "mtg",
      color: {
        key: tt(a, t),
        size: s,
        paint: (n, h, g) => we(a, t, h, {
          loadImages: ye(n),
          underArt: g
        })
      },
      stamp: {
        key: JSON.stringify([
          "mtg-stamp-v1",
          t,
          r.setCode,
          o.map((n) => [
            W(n.face).stamp,
            n.face.setCode,
            n.panel ? [
              n.panel.x,
              n.panel.y,
              n.panel.width,
              n.panel.height,
              n.panel.rotation
            ] : null
          ])
        ]),
        size: s,
        paint: (n, h) => we(d, t, h, {
          loadImages: ye(n)
        })
      },
      edges: i,
      artWindows: o.map(
        (n) => n.panel ? ce(n.panel, pe(n.face)) : pe(n.face)
      ),
      cornerRadius: 0.058,
      regions: Object.entries(W(r)).map(([n, h]) => ({
        id: n,
        rect: h
      }))
    };
  }
}, rr = "This Magic game pack is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.";
function sr(e, t, r, s, a = "inspect") {
  const l = structuredClone({ ...r, setCode: r.setCode ?? "GLINT" }), o = tr.describe(l, a), i = (d) => {
    const n = { face: l, printingId: null, printedImage: null, paintLayer: d };
    return {
      key: tt(n, a),
      size: o.color.size,
      paint: (h, g) => we(n, a, g, { loadImages: ye(h) })
    };
  };
  return {
    id: e,
    revision: t,
    recipe: {
      ...o,
      color: i("artwork"),
      edges: [],
      stamp: void 0,
      finishCoverageBase: 0,
      overlayFoil: { tone: s, strength: { gold: 0.7, silver: 0.6, prismatic: 0.75 }[s] }
    },
    layers: [
      {
        id: "magic-printing",
        order: 0,
        stage: "over-finish",
        raster: i("printing"),
        finishCoverage: {
          add: {
            key: JSON.stringify(["magic-art-scope-v1", o.color.size, o.artWindows]),
            size: o.color.size,
            async paint() {
              const d = document.createElement("canvas");
              [d.width, d.height] = o.color.size;
              const n = d.getContext("2d");
              n.fillStyle = "#fff";
              for (const [h, g, f, L] of o.artWindows)
                n.fillRect(
                  h * d.width,
                  g * d.height,
                  f * d.width,
                  L * d.height
                );
              return d;
            }
          }
        }
      }
    ]
  };
}
export {
  A as FACE_RECTS,
  p as FACE_TEXT,
  rr as disclaimer,
  F as faceFrame,
  W as faceRects,
  Q as isRetro,
  tr as magic,
  Z as manaSymbolAsset,
  tr as mtg,
  sr as opticalDocument,
  Ce as profileAssets,
  N as resolveCardProfile,
  j as retroFamily,
  Ue as retroRects,
  le as setSymbolAsset
};
