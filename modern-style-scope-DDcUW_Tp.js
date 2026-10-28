const F = [
  "2ed",
  "2x2",
  "2xm",
  "3ed",
  "4ed",
  "5ed",
  "6ed",
  "7ed",
  "8ed",
  "a25",
  "aer",
  "afc",
  "afr",
  "ala",
  "all",
  "apc",
  "arb",
  "arn",
  "ath",
  "atq",
  "avr",
  "bbd",
  "blb",
  "blc",
  "bng",
  "bok",
  "brb",
  "brc",
  "bro",
  "btd",
  "c13",
  "c14",
  "c15",
  "c19",
  "c21",
  "chr",
  "clb",
  "cm2",
  "cmd",
  "cmm",
  "cn2",
  "cns",
  "con",
  "csp",
  "dd2",
  "ddc",
  "dde",
  "ddf",
  "ddg",
  "ddh",
  "ddi",
  "ddj",
  "ddl",
  "ddn",
  "ddo",
  "ddq",
  "dds",
  "ddt",
  "ddu",
  "dft",
  "dgm",
  "dka",
  "dmc",
  "dmr",
  "dmu",
  "dpa",
  "drc",
  "drk",
  "dsc",
  "dsk",
  "dst",
  "e01",
  "ecc",
  "ecl",
  "eld",
  "ema",
  "emn",
  "eoc",
  "eoe",
  "eve",
  "exo",
  "fdc",
  "fdn",
  "fem",
  "frc",
  "frf",
  "fut",
  "gn3",
  "gnt",
  "hml",
  "hob",
  "hoc",
  "hop",
  "hou",
  "ice",
  "iko",
  "ima",
  "inr",
  "inv",
  "itp",
  "j22",
  "j25",
  "jmp",
  "jou",
  "jud",
  "kld",
  "ktk",
  "lcc",
  "lci",
  "lea",
  "leb",
  "leg",
  "m10",
  "m11",
  "m12",
  "m13",
  "m15",
  "m19",
  "m20",
  "m21",
  "mbs",
  "mh1",
  "mh2",
  "mh3",
  "mid",
  "mir",
  "mkc",
  "mkm",
  "mm3",
  "mma",
  "mmq",
  "moc",
  "mom",
  "msc",
  "msh",
  "ncc",
  "nec",
  "nem",
  "neo",
  "nph",
  "ody",
  "ogw",
  "one",
  "ons",
  "ori",
  "otc",
  "otj",
  "p02",
  "pc2",
  "pcy",
  "plc",
  "pls",
  "por",
  "ptk",
  "rqs",
  "rtr",
  "rvr",
  "s99",
  "scd",
  "scg",
  "shm",
  "sld",
  "snc",
  "soc",
  "soi",
  "sok",
  "som",
  "sos",
  "spm",
  "sth",
  "stx",
  "sum",
  "ths",
  "tla",
  "tle",
  "tmc",
  "tmp",
  "tmt",
  "tor",
  "tsb",
  "tsr",
  "uds",
  "ulg",
  "uma",
  "unf",
  "usg",
  "vis",
  "voc",
  "vow",
  "war",
  "woc",
  "woe",
  "wth",
  "wwk",
  "xln",
  "zen",
  "znr"
], A = ["2ed", "4ed", "arn", "atq", "chr", "fem"], P = {
  PLANAR_COLORS: "plc",
  PLANAR_TEXTURE: "plc"
}, h = /* @__PURE__ */ new Set(), C = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), D = new Set(F);
function x(t, a) {
  const e = P[t] ?? a?.split(/[/-]/)[0]?.toLowerCase();
  if (e && D.has(e) && !h.has(e + "/calibration"))
    throw Error(
      `Magic set ${e} is not prepared. Await loadMagicSet('${e}') or prepareMagicCards(cards) before synchronous layout queries.`
    );
}
function $(t) {
  if (!(!t || typeof t != "object" || Object.isFrozen(t))) {
    for (const a of Object.values(t)) $(a);
    Object.freeze(t);
  }
}
function H(t) {
  const a = t.set + "/" + t.kind;
  if (!h.has(a)) {
    for (const [e, n] of Object.entries(t.tables))
      for (const c of Object.keys(n))
        if (Object.hasOwn(u.get(e) ?? {}, c))
          throw Error(`Duplicate calibration value: ${e}/${c}`);
    $(t);
    for (const [e, n] of Object.entries(t.tables)) {
      const c = u.get(e) ?? /* @__PURE__ */ Object.create(null);
      Object.assign(c, n), u.set(e, c);
    }
    C.set(a, t), h.add(a);
  }
}
const Q = (t, a = "calibration") => h.has(t + "/" + a), V = () => [...h].filter((t) => t.endsWith("/calibration")).map((t) => t.split("/")[0]).sort();
function L(t) {
  return k.has(t) || k.set(
    t,
    new Proxy(/* @__PURE__ */ Object.create(null), {
      get: (a, e) => {
        if (typeof e == "string")
          return x(t, e), u.get(t)?.[e];
      },
      has: (a, e) => typeof e == "string" && Object.hasOwn(u.get(t) ?? {}, e),
      ownKeys: () => (x(t), Object.keys(u.get(t) ?? {})),
      getOwnPropertyDescriptor: (a, e) => typeof e == "string" && Object.hasOwn(u.get(t) ?? {}, e) ? {
        value: u.get(t)[e],
        enumerable: !0,
        configurable: !0,
        writable: !1
      } : void 0,
      set: () => {
        throw TypeError("Set data is immutable");
      },
      defineProperty: () => {
        throw TypeError("Set data is immutable");
      },
      deleteProperty: () => {
        throw TypeError("Set data is immutable");
      },
      preventExtensions: () => !1
    })
  ), k.get(t);
}
function Z(t, a) {
  const e = ["printingCorrections", "artistCredits"].includes(a) ? "wording" : "calibration", n = C.get(t + "/" + e);
  if (!n) throw Error(`Magic set ${t} is not prepared`);
  return n.tables[a] ?? {};
}
const N = L("setTitleCalibrations");
function v(t) {
  return t?.toLowerCase() === "lea" ? N.lea : void 0;
}
function R(t) {
  return ["title", "type"].flatMap(
    (a) => Object.entries(t[a]).map(([e, n]) => ({
      id: `${a}.${e}`,
      label: `${a === "title" ? "name" : "type"} · ${e === "dx" ? "horizontal offset" : e === "dy" ? "vertical offset" : e}`,
      group: "lettering",
      scope: "all",
      kind: "number",
      value: n,
      min: e === "wordSpacing" ? -6 : e === "dx" || e === "dy" ? -30 : e === "width" ? 0.6 : e === "size" ? 8 : 0,
      max: e === "wordSpacing" ? 6 : e === "dx" || e === "dy" ? 30 : e === "gray" ? 255 : e === "size" ? 60 : e === "width" ? 1.5 : 4,
      step: e === "width" ? 1e-3 : e === "gray" ? 1 : 0.05,
      unit: e === "width" ? "ratio" : e === "gray" ? "sRGB 0–255" : "px"
    }))
  );
}
const W = L("setCalibrationProfiles");
function w(t) {
  const a = t?.toLowerCase() ?? "";
  return A.includes(a) ? W[a] : void 0;
}
function B(t) {
  const a = t.dualLand;
  if (!a) return [];
  const e = [
    {
      id: "dualLand.stock",
      label: "Dual land · outer stock",
      value: a.stock,
      kind: "color",
      group: "colors",
      scope: "L-dual"
    }
  ], n = (d, o, r, s, i, l, p = "L-dual") => e.push({
    id: d,
    label: d.split(".").slice(1).join(" · "),
    value: o,
    kind: "number",
    group: d.startsWith("dualLand.pinline.box") || d.startsWith("dualLand.pinline.width") ? "frame" : "colors",
    scope: p,
    min: r,
    max: s,
    step: i,
    unit: l
  });
  for (const d of ["box", "width"])
    for (const [o, r] of Object.entries(a.pinline[d]))
      n(
        `dualLand.pinline.${d}.${o}`,
        r,
        0,
        d === "width" ? 80 : o === "top" || o === "bottom" ? 2100 : 1500,
        0.25,
        "source px"
      );
  const c = (d, o, r) => o.forEach((s, i) => n(`${d}.${i}`, s, 0, 1, 5e-3, "sRGB ratio", r));
  for (const [d, o] of Object.entries(a.pinline.palette))
    o && c(`dualLand.pinline.palette.${d}`, o, d);
  a.pinline.edge && c("dualLand.pinline.edge", a.pinline.edge, "L-dual");
  for (const [d, o] of Object.entries(a.sources)) {
    if (!o) continue;
    const r = o.adjustment, s = "mask" in r ? [
      ["frame", r.frame],
      ["paper", r.paper]
    ] : [["", r]];
    for (const [i, l] of s)
      for (const p of [
        "hueDegrees",
        "saturationScale",
        "brightnessScale",
        "valueGamma"
      ]) {
        const m = p === "hueDegrees";
        n(
          `dualLand.sources.${d}.adjustment${i ? "." + i : ""}.${p}`,
          l[p] ?? (m ? 0 : 1),
          m ? -180 : p === "valueGamma" ? 0.5 : 0,
          m ? 180 : p === "valueGamma" ? 2 : 3,
          m ? 0.5 : 5e-3,
          m ? "degrees" : "ratio",
          d
        );
      }
  }
  return e;
}
function G(t) {
  const a = [], e = (o, r, s, i, l, p, m, f = "px") => {
    a.push({
      id: o,
      label: o.split(".").slice(i === "all" ? 0 : 2).join(" · "),
      value: r,
      group: s,
      scope: i,
      kind: "number",
      min: l,
      max: p,
      step: m,
      unit: f
    });
  }, n = (o, r, s, i, l) => a.push({
    id: o,
    label: o.split(".").slice(2).join(" · "),
    value: r,
    group: s,
    scope: i,
    kind: typeof r == "boolean" ? "boolean" : l ? "choice" : "color",
    options: l
  });
  for (const [o, r] of Object.entries(t.frames))
    if (r)
      for (const s of [
        "frame",
        "art",
        r.stockMaskFrame ? "stockMaskFrame" : "stockWindow"
      ])
        r[s].forEach(
          (i, l) => e(
            `frames.${o}.${s}.${l}`,
            i,
            "frame",
            o,
            l < 2 ? -0.15 : 0.05,
            1.3,
            5e-4,
            "card fraction"
          )
        );
  e(
    "cornerRadius",
    t.cornerRadius ?? 0.045,
    "frame",
    "all",
    0.01,
    0.09,
    1e-3,
    "card width"
  );
  for (const o of ["title", "type", "footer.artist", "footer.legal", "footer.stats"]) {
    const r = o.startsWith("footer.") ? t.footer[o.slice(7)] : t[o];
    for (const [s, i] of Object.entries(r)) {
      if (typeof i != "number") continue;
      const l = /gray/i.test(s), p = s === "width";
      e(
        `${o}.${s}`,
        i,
        o.startsWith("footer") ? "footer" : "lettering",
        "all",
        s === "x" || s === "y" ? 0 : p ? 0.6 : 0,
        s === "x" || s === "maxWidth" ? 488 : s === "y" ? 680 : l ? 255 : s === "size" ? 60 : p ? 1.5 : 4,
        l ? 1 : 0.05,
        p ? "ratio" : l ? "sRGB 0–255" : "px"
      );
    }
  }
  if (t.footer.artist.align !== void 0 && n("footer.artist.align", t.footer.artist.align, "footer", "all", [
    "left",
    "center",
    "right"
  ]), t.footer.artist.baseline !== void 0 && n("footer.artist.baseline", t.footer.artist.baseline, "footer", "all", [
    "alphabetic",
    "middle",
    "top",
    "bottom"
  ]), t.footer.artist.inkStyle !== void 0 && n("footer.artist.inkStyle", t.footer.artist.inkStyle, "footer", "all", [
    "filled",
    "separate-shadow"
  ]), t.expansionBody) {
    const o = [
      ["expansionBody", t.expansionBody, "all"],
      ["expansionBody.unconstrained", t.expansionBody.unconstrained, "unconstrained"]
    ];
    for (const [r, s, i] of o)
      for (const [l, p] of Object.entries(s ?? {})) {
        if (typeof p == "boolean") {
          n(r + "." + l, p, "body", i);
          continue;
        }
        if (typeof p != "number") continue;
        const m = l === "threshold" || l === "flavorOrphanMinCharacters", f = l === "minimumFreeSpace", g = /Width|Leading/i.test(l), j = /offset/i.test(l);
        e(
          r + "." + l,
          p,
          "body",
          i,
          j ? -30 : g ? 0.5 : f ? 0 : m ? l === "threshold" ? 1 : 0 : 6,
          j ? 30 : g ? 1.5 : f ? 680 : m ? 1e3 : 48,
          m ? 1 : g ? 5e-3 : 0.25,
          m ? "count" : g ? "ratio" : "px"
        );
      }
    for (const [r, s] of Object.entries(t.expansionBody.bounds ?? {}))
      e(
        "expansionBody.bounds." + r,
        s,
        "body",
        "all",
        0,
        r === "y" || r === "height" ? 680 : 488,
        0.25
      );
  }
  if (t.bodyClasses) {
    const o = "size classes";
    for (const [r, s] of Object.entries(t.bodyClasses.bounds))
      e(
        "bodyClasses.bounds." + r,
        s,
        "body",
        o,
        0,
        r === "y" || r === "height" ? 680 : 488,
        0.25
      );
    for (const r of ["centered", "compact"])
      for (const [s, i] of Object.entries(t.bodyClasses[r])) {
        const l = s === "maxCharacters" || s === "maxLines", p = s === "leading";
        e(
          "bodyClasses." + r + "." + s,
          i,
          "body",
          o,
          l ? 1 : p ? 0.5 : 6,
          s === "maxCharacters" ? 1e3 : s === "maxLines" ? 30 : p ? 2 : 48,
          l ? 1 : p ? 0.01 : 0.25,
          l ? "count" : p ? "ratio" : "px"
        );
      }
    for (const [r, s] of Object.entries(t.bodyClasses.typography))
      if (typeof s == "boolean") n("bodyClasses.typography." + r, s, "body", o);
      else if (typeof s == "number") {
        const i = r === "centerOffset", l = r === "symbolOffsetY", p = r === "textWidth" || r === "leading" || l;
        e(
          "bodyClasses.typography." + r,
          s,
          "body",
          o,
          l ? -0.5 : i ? -24 : p ? 0.5 : 0,
          l ? 0.5 : i ? 24 : p ? 2 : 30,
          p ? 0.01 : 0.25,
          p ? "ratio" : "px"
        );
      }
  }
  if (t.textTiers) {
    for (const [o, r] of Object.entries(t.textTiers))
      if (typeof r == "boolean") n(`textTiers.${o}`, r, "body", "all");
      else if (typeof r == "number") {
        const s = o === "denseWidth", i = ["largeMaximum", "mediumMaximum", "retainRegularAboveLines"].includes(o);
        e(
          `textTiers.${o}`,
          r,
          "body",
          "all",
          s ? 0.7 : i ? 1 : -24,
          s ? 1.3 : i ? 1e3 : 488,
          s ? 5e-3 : i ? 1 : 0.25,
          s ? "ratio" : i ? "count" : "px"
        );
      }
  }
  t.footer.stats.inkStyle !== void 0 && n("footer.stats.inkStyle", t.footer.stats.inkStyle, "footer", "all", [
    "filled",
    "separate-shadow"
  ]), t.footer.stats.baseline !== void 0 && n("footer.stats.baseline", t.footer.stats.baseline, "footer", "all", [
    "alphabetic",
    "middle"
  ]), a.push(...B(t));
  const c = t.mana.geometry;
  for (const o of [
    "dx",
    "dy",
    "scaleX",
    "scaleY",
    "spacing",
    "numberScale",
    "numberDx",
    "numberDy"
  ]) {
    const r = /scale/i.test(o);
    e(
      `mana.geometry.${o}`,
      c[o] ?? (r ? 1 : 0),
      "symbols",
      "all",
      r ? 0.7 : -12,
      r ? 1.4 : 12,
      r ? 5e-3 : 0.25,
      r ? "ratio" : "px"
    );
  }
  for (const o of ["W", "U", "B", "R", "G"])
    for (const r of ["dx", "dy", "scale"])
      e(
        `mana.geometry.glyphs.${o}.${r}`,
        c.glyphs?.[o]?.[r] ?? (r === "scale" ? 1 : 0),
        "symbols",
        o,
        r === "scale" ? 0.5 : -6,
        r === "scale" ? 1.5 : 6,
        r === "scale" ? 5e-3 : 0.25,
        r === "scale" ? "ratio" : "px"
      );
  for (const [o, r] of Object.entries(t.mana.sourceInk ?? {}))
    r && e(
      `mana.sourceInk.${o}.pixels`,
      r.pixels,
      "symbols",
      o,
      0,
      1,
      0.05,
      "px per 24px disc"
    );
  for (const [o, r] of Object.entries(t.setSymbols ?? {}))
    if (r)
      for (const s of ["right", "centerY", "width", "height", "outline"])
        e(
          `setSymbols.${o}.${s}`,
          r[s] ?? 0,
          "symbols",
          o,
          s === "width" || s === "height" ? 1 : 0,
          s === "right" ? 488 : s === "centerY" ? 680 : s === "outline" ? 6 : 100,
          0.25
        );
  for (const o of ["default", ...Object.keys(t.frames)]) {
    const r = { ...t.rulesAdjustments?.default, ...t.rulesAdjustments?.[o] };
    n(`rulesAdjustments.${o}.alignment`, r?.alignment ?? "printing", "body", o, [
      "printing",
      "left",
      "center"
    ]);
    for (const s of [
      "leftMargin",
      "rightMargin",
      "vertical",
      "fontSize",
      "textWidth",
      "leading",
      "paragraphGap",
      "flavorGap"
    ]) {
      const i = ["textWidth", "leading", "paragraphGap", "flavorGap"].includes(s), l = s === "fontSize" ? 4 : i ? 0.3 : 24;
      e(
        `rulesAdjustments.${o}.${s}`,
        r?.[s] ?? 0,
        "body",
        o,
        -l,
        l,
        i ? 5e-3 : 0.25,
        i ? "ratio delta" : "px delta"
      );
    }
  }
  for (const [o, r] of Object.entries(t.body ?? {}))
    if (r) {
      for (const [s, i] of Object.entries(r.bounds))
        e(
          `body.${o}.bounds.${s}`,
          i,
          "body",
          o,
          0,
          s === "y" || s === "height" ? 680 : 488,
          0.25
        );
      for (const s of ["minimumSize", "maximumSize"])
        e(`body.${o}.${s}`, r[s], "body", o, 6, 48, 0.25);
      for (const [s, i] of Object.entries(r.typography))
        typeof i == "number" ? e(
          `body.${o}.typography.${s}`,
          i,
          "body",
          o,
          s === "symbolOffsetY" ? -0.5 : s === "centerOffset" ? -20 : 0,
          s === "symbolOffsetY" ? 0.5 : s === "centerOffset" ? 20 : 3,
          0.01,
          "ratio"
        ) : typeof i == "boolean" && n(`body.${o}.typography.${s}`, i, "body", o);
      if (r.centered)
        for (const [s, i] of Object.entries(r.centered))
          e(
            `body.${o}.centered.${s}`,
            i,
            "body",
            o,
            0,
            s === "maxCharacters" ? 1e3 : s === "maxLines" ? 30 : 48,
            s === "maximumSize" ? 0.25 : 1
          );
    }
  const d = (o, r, s, i = 1) => r.forEach((l, p) => e(`${o}.${p}`, l, "colors", s, 0, i, 5e-3, "sRGB ratio"));
  t.footer.artist.tint && d("footer.artist.tint", t.footer.artist.tint, "all", 1.5), t.footer.stats.tint && d("footer.stats.tint", t.footer.stats.tint, "all", 1.5);
  for (const [o, r] of Object.entries(t.mana.variants ?? {})) {
    for (const [s, i] of Object.entries(r?.geometry ?? {})) {
      if (typeof i != "number") continue;
      const l = /scale/i.test(s);
      e(
        "mana.variants." + o + ".geometry." + s,
        i,
        "symbols",
        o,
        l ? 0.7 : -12,
        l ? 1.4 : 12,
        l ? 5e-3 : 0.25,
        l ? "ratio" : "px"
      );
    }
    for (const [s, i] of Object.entries(r?.paper ?? {}))
      i && d("mana.variants." + o + ".paper." + s, i, o + "/" + s);
  }
  d("mana.ink", t.mana.ink, "all");
  for (const [o, r] of Object.entries(t.mana.paper))
    r && d(`mana.paper.${o}`, r, o);
  for (const [o, r] of Object.entries(t.colors)) {
    if (!r) continue;
    n(`colors.${o}.stock`, r.stock, "colors", o);
    const s = r.adjustment, i = "mask" in s ? [
      ["frame", s.frame],
      ["paper", s.paper]
    ] : [["", s]];
    for (const [l, p] of i) {
      const m = `colors.${o}.adjustment${l ? "." + l : ""}`;
      for (const f of ["hueDegrees", "saturationScale", "brightnessScale", "valueGamma"])
        e(
          `${m}.${f}`,
          p[f] ?? (f === "hueDegrees" ? 0 : 1),
          "colors",
          o,
          f === "hueDegrees" ? -180 : f === "valueGamma" ? 0.5 : 0,
          f === "hueDegrees" ? 180 : f === "valueGamma" ? 2 : 3,
          f === "hueDegrees" ? 0.5 : 5e-3,
          f === "hueDegrees" ? "degrees" : "ratio"
        );
      d(`${m}.rgbScale`, p.rgbScale ?? [1, 1, 1], o, 3);
    }
    s.blackPoint && (d(`colors.${o}.adjustment.blackPoint.lift`, s.blackPoint.lift, o, 0.5), e(
      `colors.${o}.adjustment.blackPoint.transition`,
      s.blackPoint.transition,
      "colors",
      o,
      0.01,
      1,
      5e-3,
      "sRGB ratio"
    )), s.outerStock && d(`colors.${o}.adjustment.outerStock`, s.outerStock, o);
  }
  return a.map((o) => {
    const r = /^rulesAdjustments\.([^.]+)\.([^.]+)$/.exec(o.id);
    return !r || r[1] === "default" ? o : t.rulesAdjustments?.[r[1]]?.[r[2]] === void 0 ? { ...o, inheritedFrom: `rulesAdjustments.default.${r[2]}` } : o;
  });
}
function I({ lift: t, transition: a, texture: e }) {
  if (!Number.isFinite(a) || a <= 0 || a > 1 || t.length !== 3 || t.some((n) => !Number.isFinite(n) || n < 0 || n > a / 2))
    throw RangeError("Invalid frame black-point curve");
  if (e) {
    if (e.length < 2 || e.length > 16 || e[0]?.[0] !== 0 || e[0]?.[1].some((n) => n !== 0) || e.at(-1)?.[0] !== 1 || e.at(-1)?.[1].some((n) => n !== 0) || e.some(
      ([n, c]) => !Number.isFinite(n) || c.length !== 3 || c.some((d) => !Number.isFinite(d))
    ))
      throw RangeError("Invalid frame texture curve");
    for (let n = 1; n < e.length; n++) {
      const [c, d] = e[n - 1], [o, r] = e[n];
      if (o <= c || t.some(
        (s, i) => 1 - 2 * s / a * Math.max(0, 1 - c / a) + (r[i] - d[i]) / (o - c) < 0
      ))
        throw RangeError("Frame texture curve reverses contrast");
    }
  }
}
function tt(t, a, e) {
  const n = a.transition * 255, c = new Float64Array(256 * 3);
  for (let d = 1; d < (a.texture?.length ?? 0); d++) {
    const [o, r] = a.texture[d - 1], [s, i] = a.texture[d];
    for (let l = Math.ceil(o * 255); l < s * 255; l++)
      for (let p = 0; p < 3; p++)
        c[l * 3 + p] = 255 * (r[p] + (i[p] - r[p]) * (l / 255 - o) / (s - o));
  }
  for (let d = 0; d < t.data.length; d += 4) {
    if (t.data[d + 3] === 0) continue;
    const o = Math.max(t.data[d], t.data[d + 1], t.data[d + 2]);
    if (o >= n && !a.texture) continue;
    const r = Math.max(0, 1 - o / n) ** 2;
    for (let s = 0; s < 3; s++)
      t.data[d + s] = Math.round(
        t.data[d + s] + 255 * a.lift[s] * r + c[o * 3 + s] * (e ? e.data[d + 3] / 255 : 1)
      );
  }
}
function b(t) {
  return t && typeof t == "object" && (Object.values(t).forEach(b), Object.freeze(t)), t;
}
function q(t) {
  const a = t.toLowerCase(), e = w(a), n = v(a);
  return b({
    schema: 1,
    set: a,
    supported: !!(e || n),
    adapter: n ? "title" : "profile",
    revision: e?.revision ?? n?.revision ?? null,
    controls: e ? G(e) : n ? R(n) : [],
    notice: e ? "Ordinary ABU/Fourth plates only. Geometry, lettering, symbols and pigment use the native painter. Source assets and masks remain fixed." : n ? "Name and type controls use the native Alpha painter. Offsets are deltas from the existing shared placements. Frame, body, symbols and footer remain on their established calibration; full-profile editing is not available yet." : "This set does not yet have a consolidated profile adapter. Existing symbol and text diagnostic tools remain available."
  });
}
function E(t, a, e) {
  const n = q(t);
  if (!n.supported || n.revision !== a)
    throw Error("Set calibration profile is unavailable or its revision changed");
  if (!e || typeof e != "object" || Array.isArray(e))
    throw Error("Calibration values must be a record");
  const c = new Map(n.controls.map((r) => [r.id, r])), d = {};
  for (const r of Object.keys(e).sort()) {
    const s = c.get(r), i = e[r];
    if (!s) throw Error("Unsupported calibration control: " + r);
    if (s.kind === "number" ? typeof i != "number" || !Number.isFinite(i) || i < s.min || i > s.max : s.kind === "boolean" ? typeof i != "boolean" : s.kind === "color" ? typeof i != "string" || !/^#[0-9a-f]{6}$/i.test(i) : typeof i != "string" || !s.options?.includes(i))
      throw Error("Invalid calibration value: " + r);
    const l = s.inheritedFrom && e[s.inheritedFrom];
    (i !== s.value || l !== void 0 && i !== l) && (d[r] = i);
  }
  const o = b({
    schema: 1,
    set: n.set,
    baseRevision: a,
    values: d
  });
  return v(t) || Y(M(o)), o;
}
function y(t, a, e) {
  const n = a.split(".");
  let c = t;
  for (let d = 0; d < n.length - 1; d++) {
    const o = n[d];
    c[o] ??= /^\d+$/.test(n[d + 1]) ? [] : {}, c = c[o];
  }
  c[n.at(-1)] = e;
}
function M(t) {
  const a = w(t.set);
  if (!a) throw Error("This adapter exports title calibration; use exportSetTitleCalibration");
  const e = structuredClone(a);
  for (const n of Object.keys(t.values)) {
    if (!/\.rgbScale\.[012]$/.test(n)) continue;
    const c = n.split(".").slice(0, -1);
    let d = e;
    for (const o of c) d = d?.[o];
    if (!d) for (let o = 0; o < 3; o++) y(e, `${c.join(".")}.${o}`, 1);
  }
  for (const [n, c] of Object.entries(t.values)) y(e, n, c);
  for (const [n, c] of Object.entries(e.colors)) {
    if (!c) continue;
    const d = n.startsWith("L-") && !e.frames[n] ? "L" : n, o = e.frames[d], r = a.frames[d];
    if (!o || !r || !Object.keys(t.values).some((i) => i.startsWith(`frames.${d}.`)))
      continue;
    const s = JSON.parse(c.source);
    Array.isArray(s) && s.length === 2 && typeof s[0] == "string" && y(e, `colors.${n}.source`, JSON.stringify([s[0], o.frame]));
  }
  if (e.dualLand && Object.keys(t.values).some((n) => n.startsWith("frames.L-dual."))) {
    const n = e.frames["L-dual"];
    if (!n) throw Error("Dual-land calibration has no geometry");
    for (const [c, d] of Object.entries(e.dualLand.sources)) {
      if (!d) continue;
      const o = JSON.parse(d.source);
      if (!Array.isArray(o) || o.length !== 2 || typeof o[0] != "string")
        throw Error("Invalid dual-land material binding");
      y(e, `dualLand.sources.${c}.source`, JSON.stringify([o[0], n.frame]));
    }
  }
  return e;
}
function Y(t) {
  for (const c of Object.values(t.body ?? {}))
    if (c && (c.minimumSize <= 0 || c.maximumSize < c.minimumSize || c.bounds.width < 20 || c.bounds.height < 20 || c.typography.leading <= 0 || (c.typography.textWidth ?? 1) <= 0 || !Number.isFinite(c.typography.symbolOffsetY ?? 0) || Math.abs(c.typography.symbolOffsetY ?? 0) > 0.5))
      throw Error("Invalid body bounds or typography range");
  const a = t.bodyClasses;
  if (a && (a.bounds.width < 20 || a.bounds.height < 20 || !Number.isInteger(a.centered.maxCharacters) || !Number.isInteger(a.centered.maxLines) || a.centered.maxCharacters < 1 || a.centered.maxLines < 1 || a.centered.size <= 0 || a.compact.nominalMinimum <= 0 || a.compact.nominalMaximum <= a.compact.nominalMinimum || a.compact.size <= 0 || a.compact.leading <= 0 || a.typography.leading <= 0 || (a.typography.textWidth ?? 1) <= 0 || !Number.isFinite(a.typography.symbolOffsetY ?? 0) || Math.abs(a.typography.symbolOffsetY ?? 0) > 0.5))
    throw Error("Invalid body size classes, bounds or typography");
  const e = t.expansionBody;
  if (e && (e.regular <= 0 || e.compact <= 0 || e.textWidth <= 0 || e.compactLeading <= 0 || (e.regularLeading ?? 1) <= 0 || (e.largeLeading ?? 1.1) <= 0 || (e.largeSize ?? 27.5) <= 0 || !Number.isInteger(e.threshold) || e.threshold < 1 || e.bounds && (e.bounds.width < 20 || e.bounds.height < 20)))
    throw Error("Invalid expansion body bounds or typography");
  const n = e?.unconstrained?.minimumFreeSpace;
  if (n !== void 0 && (!Number.isFinite(n) || n < 0))
    throw Error("Invalid expansion free-space threshold");
  for (const c of [e, e?.unconstrained])
    if (c && ((c.regularLeading ?? 1) <= 0 || (c.compactLeading ?? 1) <= 0 || (c.compact ?? 1) <= 0 || c.flavorOrphanMinCharacters !== void 0 && (!Number.isInteger(c.flavorOrphanMinCharacters) || c.flavorOrphanMinCharacters < 0)))
      throw Error("Invalid expansion refinement or flavor threshold");
  for (const c of [
    ...Object.values(t.colors),
    ...Object.values(t.dualLand?.sources ?? {})
  ])
    c?.adjustment.blackPoint && I(c.adjustment.blackPoint);
  if (t.textTiers?.retainRegularAboveLines !== void 0 && (!Number.isInteger(t.textTiers.retainRegularAboveLines) || t.textTiers.retainRegularAboveLines < 1))
    throw Error("Invalid regular density limit");
}
const O = /* @__PURE__ */ new WeakMap();
function T(t) {
  if (!t || t.schema !== 1) throw Error("Unsupported calibration candidate schema");
  const a = JSON.stringify(t), e = O.get(t);
  if (e?.key === a) return e.profile;
  const n = E(
    t.set,
    t.baseRevision,
    t.values
  ), c = b(M(n));
  return O.set(t, { key: a, profile: c }), c;
}
function et(t) {
  const a = T(t);
  return b({ ...structuredClone(a), revision: a.revision + 1 });
}
function z(t) {
  const a = v(t.set);
  if (!a) throw Error("This set has no title calibration adapter");
  const e = E(
    t.set,
    t.baseRevision,
    t.values
  ), n = { ...a, title: { ...a.title }, type: { ...a.type } };
  for (const [c, d] of Object.entries(e.values)) {
    const [o, r] = c.split(".");
    n[o][r] = d;
  }
  return b(n);
}
function ot(t) {
  const a = z(t);
  return b({ ...a, revision: a.revision + 1 });
}
function st(t) {
  const a = t.setCalibrationCandidate;
  if (!a) return w(t.setCode) ?? _(t);
  if (a.set !== t.setCode?.toLowerCase())
    throw Error("Calibration candidate belongs to another set");
  if (v(a.set)) {
    z(a);
    return;
  }
  return T(a);
}
function U(t) {
  return t.setCode?.toLowerCase() === "ice" && t.calibration !== "printing" && !t.frameTemplate && !t.frameAssetFamily && t.frameStyle !== "modern" && (!t.layout || t.layout === "normal") && (!t.borderColor || t.borderColor === "black") && (t.frameColors ?? t.colors ?? []).length <= 1 && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? "");
}
const S = /* @__PURE__ */ new WeakMap();
function _(t) {
  if (!U(t)) return;
  const a = w("4ed");
  if (!a) return;
  let e = S.get(a);
  return e || (e = {
    ...a,
    set: "ice",
    border: "black",
    colors: Object.fromEntries(
      Object.entries(a.colors).map(([n, c]) => [
        n,
        c && { ...c, stock: "#080808" }
      ])
    )
  }, S.set(a, e)), e;
}
function rt(t) {
  return t.frameAssetFamily === "eighth" && t.setCode?.toLowerCase() !== "plc" && (t.borderColor === void 0 || t.borderColor === "white" || t.borderColor === "black") && t.frameStyle !== "retro" && !t.frameTreatment && !t.frameTemplate && !t.faces?.length && (!t.layout || t.layout === "normal") && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") && !/^Level up\b/m.test(t.rulesText ?? "");
}
const J = new Set(
  "10e 5dn 8ed 9ed ala arb arc avr bng bok c13 chk cm1 cmd cns con csp cst dci dd1 dd2 ddc ddd dde ddf ddg ddh ddi ddj ddk ddl ddm dgm dis dka dpa drb dst eve f04 f05 f06 f07 f08 f09 f10 f11 f12 f13 f14 fut g04 g05 g06 g07 g08 g09 g10 g11 gpt gtc h09 hho hop isd j12 j13 j14 jou l12 l13 l14 lrw m10 m11 m12 m13 m14 mbs md1 me1 me2 me3 me4 mma mor mrd nph oarc oc13 ocm1 ocmd ohop olgc opc2 p04 p05 p06 p07 p08 p09 p10 p10e p11 p15a p2hg p5dn p8ed p9ed pal04 pal05 pal06 pala parb pavr pbng pbok pc2 pchk pcmd pcmp pcns pcon pcsp pd2 pd3 pdgm pdis pdka pdp10 pdp12 pdp13 pdp14 pdp15 pdst pdtp peve pfut pgpt pgpx pgtc phel phop phuk pidw pisd pjas pjou pjse plc plrw pm10 pm11 pm12 pm13 pm14 pm15 pmbs pmor pmps pmps06 pmps07 pmps08 pmps09 pmps10 pmps11 pmrd pnph ppc1 pplc ppro prav proe prtr ps11 ps14 psal psdc pshm psok psom pths ptsp punh purl pw11 pw12 pwwk pzen rav roe rtr shm sok som t10e tala tarb tavr tbng tbth tcns tcon td0 td2 tdag tdd1 tdd2 tddc tddd tdde tddf tddg tddh tddi tddj tddk tddl tddm tdgm tdka teve tfth tgtc thp1 thp2 thp3 ths tisd tjou tlrw tm10 tm11 tm12 tm13 tm14 tmbs tmd1 tmma tmor tnph troe trtr tsb tshm tsom tsp tths twwk tzen unh v09 v10 v11 v12 v13 vma wc03 wc04 wmc wwk zen".split(
    " "
  )
);
function at(t) {
  return J.has(t.toLowerCase());
}
const X = new Set(
  "10e 2ed 3ed 4bb 4ed 5dn 5ed 6ed 7ed 8ed 9ed ala all apc arb arc arn ath atq avr bchr bng bok brb btd c13 ced cei chk chr cm1 cmd cns con csp cst dci dd1 dd2 ddc ddd dde ddf ddg ddh ddi ddj ddk ddl ddm dgm dis dka dkm dpa drb drk dst eve exo f01 f02 f03 f04 f05 f06 f07 f08 f09 f10 f11 f12 f13 f14 fbb fem fnm fut g00 g01 g02 g03 g04 g05 g06 g07 g08 g09 g10 g11 g99 gpt gtc h09 hho hml hop ice inv isd itp j12 j13 j14 jgp jou jp1 jud l12 l13 l14 lea leb leg lgn lrw m10 m11 m12 m13 m14 mbs md1 me1 me2 me3 me4 mgb mir mma mmq mor mpr mrd nem nph o90p oarc oc13 ocm1 ocmd ody ohop olep olgc ons opc2 ovnt p02 p03 p04 p05 p06 p07 p08 p09 p10 p10e p11 p15a p2hg p5dn p8ed p9ed pal00 pal01 pal02 pal03 pal04 pal05 pal06 pal99 pala palp papc parb parl past pavr pbng pbok pc2 pcel pchk pcmd pcmp pcns pcon pcsp pcy pd2 pd3 pdgm pdis pdka pdp10 pdp12 pdp13 pdp14 pdp15 pdrc pdst pdtp pelp peve pexo pfut pgpt pgpx pgru pgtc phel phop phpr phuk pidw pinv pisd pjas pjjt pjou pjse pjud plc plgm plgn plrw pls pm10 pm11 pm12 pm13 pm14 pm15 pmbs pmei pmic pmmq pmoa pmor pmps pmps06 pmps07 pmps08 pmps09 pmps10 pmps11 pmrd pnem pnph pody pons por ppc1 ppcy pplc ppls ppro pptk pr2 prav pred prm proe prtr ps11 ps14 psal pscg psdc psdg pshm psok psom psth psus ptc pths ptk ptmp ptor ptsp puds pulg punh purl pusg pvan pw11 pw12 pwor pwos pwwk pzen rav ren rin roe rqs rtr s00 s99 scg shm sok som sth sum t10e tala tarb tavr tbng tbth tcns tcon td0 td2 tdag tdd1 tdd2 tddc tddd tdde tddf tddg tddh tddi tddj tddk tddl tddm tdgm tdka teve tfth tgtc thp1 thp2 thp3 ths tisd tjou tlrw tm10 tm11 tm12 tm13 tm14 tmbs tmd1 tmma tmor tmp tnph tor troe trtr tsb tshm tsom tsp tths tugl twwk tzen uds ugl ulg unh usg v09 v10 v11 v12 v13 vis vma wc00 wc01 wc02 wc03 wc04 wc97 wc98 wc99 wmc wth wwk zen ".trim().split(/\s+/)
);
function nt(t) {
  return t.frameStyle === "retro" || t.frameAssetFamily === "eighth" || t.frameTreatment === "colorshifted" || t.frameTemplate === "future" || t.frameTemplate === "flip" || /^(?:split-old|split-eighth|flip|leveler)/.test(t.layout ?? "") ? !1 : t.frameAssetFamily === "m15-accurate" || K(t.setCode ?? "");
}
function K(t) {
  return !X.has(t.toLowerCase());
}
export {
  ot as a,
  z as b,
  E as c,
  q as d,
  et as e,
  H as f,
  at as g,
  Q as h,
  rt as i,
  nt as j,
  st as k,
  V as l,
  K as m,
  tt as n,
  v as o,
  w as p,
  T as r,
  Z as s,
  L as t,
  U as u,
  I as v
};
