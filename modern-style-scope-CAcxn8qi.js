const I = [
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
], T = [
  "2ed",
  "4ed",
  "arn",
  "atq",
  "chr",
  "fem",
  "mir",
  "ons"
], q = {
  PLANAR_COLORS: "plc",
  PLANAR_TEXTURE: "plc"
}, v = /* @__PURE__ */ new Set(), z = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), Y = new Set(I);
function E(e, a) {
  const o = q[e] ?? a?.split(/[/-]/)[0]?.toLowerCase();
  if (o && Y.has(o) && !v.has(o + "/calibration"))
    throw Error(
      `Magic set ${o} is not prepared. Await loadMagicSet('${o}') or prepareMagicCards(cards) before synchronous layout queries.`
    );
}
function A(e) {
  if (!(!e || typeof e != "object" || Object.isFrozen(e))) {
    for (const a of Object.values(e)) A(a);
    Object.freeze(e);
  }
}
function ne(e) {
  const a = e.set + "/" + e.kind;
  if (!v.has(a)) {
    for (const [o, n] of Object.entries(e.tables))
      for (const d of Object.keys(n))
        if (Object.hasOwn(g.get(o) ?? {}, d))
          throw Error(`Duplicate calibration value: ${o}/${d}`);
    A(e);
    for (const [o, n] of Object.entries(e.tables)) {
      const d = g.get(o) ?? /* @__PURE__ */ Object.create(null);
      Object.assign(d, n), g.set(o, d);
    }
    z.set(a, e), v.add(a);
  }
}
const ie = (e, a = "calibration") => v.has(e + "/" + a), ce = () => [...v].filter((e) => e.endsWith("/calibration")).map((e) => e.split("/")[0]).sort();
function D(e) {
  return C.has(e) || C.set(
    e,
    new Proxy(/* @__PURE__ */ Object.create(null), {
      get: (a, o) => {
        if (typeof o == "string")
          return E(e, o), g.get(e)?.[o];
      },
      has: (a, o) => typeof o == "string" && Object.hasOwn(g.get(e) ?? {}, o),
      ownKeys: () => (E(e), Object.keys(g.get(e) ?? {})),
      getOwnPropertyDescriptor: (a, o) => typeof o == "string" && Object.hasOwn(g.get(e) ?? {}, o) ? {
        value: g.get(e)[o],
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
  ), C.get(e);
}
function le(e, a) {
  const o = ["printingCorrections", "artistCredits"].includes(a) ? "wording" : "calibration", n = z.get(e + "/" + o);
  if (!n) throw Error(`Magic set ${e} is not prepared`);
  return n.tables[a] ?? {};
}
const J = D("setTitleCalibrations");
function x(e) {
  return e?.toLowerCase() === "lea" ? J.lea : void 0;
}
function U(e) {
  return ["title", "type"].flatMap(
    (a) => Object.entries(e[a]).map(([o, n]) => ({
      id: `${a}.${o}`,
      label: `${a === "title" ? "name" : "type"} · ${o === "dx" ? "horizontal offset" : o === "dy" ? "vertical offset" : o}`,
      group: "lettering",
      scope: "all",
      kind: "number",
      value: n,
      min: o === "wordSpacing" ? -6 : o === "dx" || o === "dy" ? -30 : o === "width" ? 0.6 : o === "size" ? 8 : 0,
      max: o === "wordSpacing" ? 6 : o === "dx" || o === "dy" ? 30 : o === "gray" ? 255 : o === "size" ? 60 : o === "width" ? 1.5 : 4,
      step: o === "width" ? 1e-3 : o === "gray" ? 1 : 0.05,
      unit: o === "width" ? "ratio" : o === "gray" ? "sRGB 0–255" : "px"
    }))
  );
}
const _ = D("setCalibrationProfiles");
function k(e) {
  const a = e?.toLowerCase() ?? "";
  return T.includes(a) ? _[a] : void 0;
}
function H(e) {
  const a = e.dualLand;
  if (!a) return [];
  const o = [
    {
      id: "dualLand.stock",
      label: "Dual land · outer stock",
      value: a.stock,
      kind: "color",
      group: "colors",
      scope: "L-dual"
    }
  ], n = (i, t, r, s, c, l, p = "L-dual") => o.push({
    id: i,
    label: i.split(".").slice(1).join(" · "),
    value: t,
    kind: "number",
    group: i.startsWith("dualLand.pinline.box") || i.startsWith("dualLand.pinline.width") ? "frame" : "colors",
    scope: p,
    min: r,
    max: s,
    step: c,
    unit: l
  });
  for (const i of ["box", "width"])
    for (const [t, r] of Object.entries(a.pinline[i]))
      n(
        `dualLand.pinline.${i}.${t}`,
        r,
        0,
        i === "width" ? 80 : t === "top" || t === "bottom" ? 2100 : 1500,
        0.25,
        "source px"
      );
  const d = (i, t, r) => t.forEach((s, c) => n(`${i}.${c}`, s, 0, 1, 5e-3, "sRGB ratio", r));
  for (const [i, t] of Object.entries(a.pinline.palette))
    t && d(`dualLand.pinline.palette.${i}`, t, i);
  a.pinline.edge && d("dualLand.pinline.edge", a.pinline.edge, "L-dual");
  for (const [i, t] of Object.entries(a.sources)) {
    if (!t) continue;
    const r = t.adjustment, s = "mask" in r ? [
      ["frame", r.frame],
      ["paper", r.paper]
    ] : [["", r]];
    for (const [c, l] of s)
      for (const p of [
        "hueDegrees",
        "saturationScale",
        "brightnessScale",
        "valueGamma"
      ]) {
        const m = p === "hueDegrees";
        n(
          `dualLand.sources.${i}.adjustment${c ? "." + c : ""}.${p}`,
          l[p] ?? (m ? 0 : 1),
          m ? -180 : p === "valueGamma" ? 0.5 : 0,
          m ? 180 : p === "valueGamma" ? 2 : 3,
          m ? 0.5 : 5e-3,
          m ? "degrees" : "ratio",
          i
        );
      }
  }
  return o;
}
function X(e) {
  const a = [], o = (t, r, s, c, l, p, m, u = "px") => {
    a.push({
      id: t,
      label: t.split(".").slice(c === "all" ? 0 : 2).join(" · "),
      value: r,
      group: s,
      scope: c,
      kind: "number",
      min: l,
      max: p,
      step: m,
      unit: u
    });
  }, n = (t, r, s, c, l) => a.push({
    id: t,
    label: t.split(".").slice(2).join(" · "),
    value: r,
    group: s,
    scope: c,
    kind: typeof r == "boolean" ? "boolean" : l ? "choice" : "color",
    options: l
  });
  for (const [t, r] of Object.entries(e.frames))
    if (r)
      for (const s of [
        "frame",
        "art",
        r.stockMaskFrame ? "stockMaskFrame" : "stockWindow"
      ])
        r[s].forEach(
          (c, l) => o(
            `frames.${t}.${s}.${l}`,
            c,
            "frame",
            t,
            l < 2 ? -0.15 : 0.05,
            1.3,
            5e-4,
            "card fraction"
          )
        );
  o(
    "cornerRadius",
    e.cornerRadius ?? 0.045,
    "frame",
    "all",
    0.01,
    0.09,
    1e-3,
    "card width"
  );
  for (const t of ["title", "type", "footer.artist", "footer.legal", "footer.stats"]) {
    const r = t.startsWith("footer.") ? e.footer[t.slice(7)] : e[t];
    for (const [s, c] of Object.entries(r)) {
      if (typeof c != "number" || s === "collectorTotal") continue;
      const l = /gray/i.test(s), p = s === "width", m = s === "weight";
      o(
        `${t}.${s}`,
        c,
        t.startsWith("footer") ? "footer" : "lettering",
        "all",
        m ? 100 : s === "x" || s === "y" ? 0 : p ? 0.6 : 0,
        m ? 900 : s === "x" || s === "maxWidth" ? 488 : s === "y" ? 680 : l ? 255 : s === "size" ? 60 : p ? 1.5 : 4,
        m ? 100 : l ? 1 : 0.05,
        m ? "CSS weight" : p ? "ratio" : l ? "sRGB 0–255" : "px"
      );
    }
  }
  e.footer.legal.align !== void 0 && n("footer.legal.align", e.footer.legal.align, "footer", "all", [
    "left",
    "center",
    "right"
  ]), e.basicSymbol?.bounds && e.basicSymbol.bounds.forEach(
    (t, r) => o(
      "basicSymbol.bounds." + r,
      t,
      "symbols",
      "basic lands",
      r < 2 ? 0 : 0.01,
      1,
      5e-4,
      "card fraction"
    )
  );
  for (const [t, r] of Object.entries(e.basicSymbol?.symbols ?? {}))
    if (r?.placement)
      for (const s of ["dx", "dy", "scaleX", "scaleY"]) {
        const c = /scale/.test(s);
        o(
          "basicSymbol.symbols." + t + ".placement." + s,
          r.placement[s] ?? (c ? 1 : 0),
          "symbols",
          "basic " + t,
          c ? 0.7 : -12,
          c ? 1.4 : 12,
          c ? 5e-3 : 0.125,
          c ? "ratio" : "px"
        );
      }
  for (const [t, r] of Object.entries(e.rulesPlacement ?? {}))
    r && (o(
      "rulesPlacement." + t + ".baselineScale",
      r.baselineScale,
      "body",
      t,
      0.9,
      1.1,
      5e-3,
      "ratio"
    ), r.offset.forEach(
      (s, c) => o("rulesPlacement." + t + ".offset." + c, s, "body", t, -8, 8, 0.25)
    ), r.verticalLimits.forEach(
      (s, c) => o(
        "rulesPlacement." + t + ".verticalLimits." + c,
        s,
        "body",
        t,
        0,
        680,
        0.25
      )
    ), r.maximumHeight !== void 0 && o(
      "rulesPlacement." + t + ".maximumHeight",
      r.maximumHeight,
      "body",
      t,
      1,
      240,
      0.25
    ));
  if (e.footer.artist.align !== void 0 && n("footer.artist.align", e.footer.artist.align, "footer", "all", [
    "left",
    "center",
    "right"
  ]), e.footer.artist.baseline !== void 0 && n("footer.artist.baseline", e.footer.artist.baseline, "footer", "all", [
    "alphabetic",
    "middle",
    "top",
    "bottom"
  ]), e.footer.artist.inkStyle !== void 0 && n("footer.artist.inkStyle", e.footer.artist.inkStyle, "footer", "all", [
    "filled",
    "separate-shadow"
  ]), e.expansionBody) {
    const t = [
      ["expansionBody", e.expansionBody, "all"],
      ["expansionBody.unconstrained", e.expansionBody.unconstrained, "unconstrained"]
    ];
    for (const [r, s, c] of t)
      for (const [l, p] of Object.entries(s ?? {})) {
        if (typeof p == "boolean") {
          n(r + "." + l, p, "body", c);
          continue;
        }
        if (typeof p != "number") continue;
        const m = l === "threshold" || l === "flavorOrphanMinCharacters", u = l === "minimumFreeSpace", f = /Width|Leading/i.test(l), h = /offset/i.test(l);
        o(
          r + "." + l,
          p,
          "body",
          c,
          h ? -30 : f ? 0.5 : u ? 0 : m ? l === "threshold" ? 1 : 0 : 6,
          h ? 30 : f ? 1.5 : u ? 680 : m ? 1e3 : 48,
          m ? 1 : f ? 5e-3 : 0.25,
          m ? "count" : f ? "ratio" : "px"
        );
      }
    for (const [r, s] of Object.entries(e.expansionBody.bounds ?? {}))
      o(
        "expansionBody.bounds." + r,
        s,
        "body",
        "all",
        0,
        r === "y" || r === "height" ? 680 : 488,
        0.25
      );
  }
  if (e.bodyClasses) {
    const t = "size classes";
    for (const [r, s] of Object.entries(e.bodyClasses.bounds))
      o(
        "bodyClasses.bounds." + r,
        s,
        "body",
        t,
        0,
        r === "y" || r === "height" ? 680 : 488,
        0.25
      );
    for (const r of ["centered", "compact"])
      for (const [s, c] of Object.entries(e.bodyClasses[r])) {
        const l = s === "maxCharacters" || s === "maxLines", p = s === "leading";
        o(
          "bodyClasses." + r + "." + s,
          c,
          "body",
          t,
          l ? 1 : p ? 0.5 : 6,
          s === "maxCharacters" ? 1e3 : s === "maxLines" ? 30 : p ? 2 : 48,
          l ? 1 : p ? 0.01 : 0.25,
          l ? "count" : p ? "ratio" : "px"
        );
      }
    for (const [r, s] of Object.entries(e.bodyClasses.typography))
      if (typeof s == "boolean") n("bodyClasses.typography." + r, s, "body", t);
      else if (typeof s == "number") {
        const c = r === "centerOffset", l = r === "symbolOffsetY", p = r === "textWidth" || r === "leading" || l;
        o(
          "bodyClasses.typography." + r,
          s,
          "body",
          t,
          l ? -0.5 : c ? -24 : p ? 0.5 : 0,
          l ? 0.5 : c ? 24 : p ? 2 : 30,
          p ? 0.01 : 0.25,
          p ? "ratio" : "px"
        );
      }
  }
  if (e.textTiers) {
    for (const [t, r] of Object.entries(e.textTiers))
      if (typeof r == "boolean") n(`textTiers.${t}`, r, "body", "all");
      else if (typeof r == "number") {
        const s = t === "denseWidth", c = ["largeMaximum", "mediumMaximum", "retainRegularAboveLines"].includes(t);
        o(
          `textTiers.${t}`,
          r,
          "body",
          "all",
          s ? 0.7 : c ? 1 : -24,
          s ? 1.3 : c ? 1e3 : 488,
          s ? 5e-3 : c ? 1 : 0.25,
          s ? "ratio" : c ? "count" : "px"
        );
      }
  }
  e.footer.stats.inkStyle !== void 0 && n("footer.stats.inkStyle", e.footer.stats.inkStyle, "footer", "all", [
    "filled",
    "separate-shadow"
  ]), e.footer.stats.baseline !== void 0 && n("footer.stats.baseline", e.footer.stats.baseline, "footer", "all", [
    "alphabetic",
    "middle"
  ]), a.push(...H(e));
  for (const [t, r] of Object.entries(e.mana.costGenericPaper ?? {}))
    r.forEach(
      (s, c) => o(
        "mana.costGenericPaper." + t + "." + c,
        s,
        "symbols",
        "generic cost · " + t,
        0,
        1,
        1 / 255,
        "sRGB 0–1"
      )
    );
  const d = e.mana.geometry;
  for (const t of [
    "dx",
    "dy",
    "scaleX",
    "scaleY",
    "spacing",
    "numberScale",
    "numberDx",
    "numberDy"
  ]) {
    const r = /scale/i.test(t);
    o(
      `mana.geometry.${t}`,
      d[t] ?? (r ? 1 : 0),
      "symbols",
      "all",
      r ? 0.7 : -12,
      r ? 1.4 : 12,
      r ? 5e-3 : 0.25,
      r ? "ratio" : "px"
    );
  }
  for (const t of ["W", "U", "B", "R", "G"])
    for (const r of ["dx", "dy", "scale"])
      o(
        `mana.geometry.glyphs.${t}.${r}`,
        d.glyphs?.[t]?.[r] ?? (r === "scale" ? 1 : 0),
        "symbols",
        t,
        r === "scale" ? 0.5 : -6,
        r === "scale" ? 1.5 : 6,
        r === "scale" ? 5e-3 : 0.25,
        r === "scale" ? "ratio" : "px"
      );
  for (const [t, r] of Object.entries(e.mana.sourceInk ?? {}))
    r && o(
      `mana.sourceInk.${t}.pixels`,
      r.pixels,
      "symbols",
      t,
      0,
      1,
      0.05,
      "px per 24px disc"
    );
  for (const [t, r] of Object.entries(e.setSymbols ?? {}))
    if (r)
      for (const s of ["right", "centerY", "width", "height", "outline"])
        o(
          `setSymbols.${t}.${s}`,
          r[s] ?? 0,
          "symbols",
          t,
          s === "width" || s === "height" ? 1 : 0,
          s === "right" ? 488 : s === "centerY" ? 680 : s === "outline" ? 6 : 100,
          0.25
        );
  for (const t of ["default", ...Object.keys(e.frames)]) {
    const r = { ...e.rulesAdjustments?.default, ...e.rulesAdjustments?.[t] };
    n(`rulesAdjustments.${t}.alignment`, r?.alignment ?? "printing", "body", t, [
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
      const c = ["textWidth", "leading", "paragraphGap", "flavorGap"].includes(s), l = s === "fontSize" ? 4 : c ? 0.3 : 24;
      o(
        `rulesAdjustments.${t}.${s}`,
        r?.[s] ?? 0,
        "body",
        t,
        -l,
        l,
        c ? 5e-3 : 0.25,
        c ? "ratio delta" : "px delta"
      );
    }
  }
  for (const [t, r] of Object.entries(e.body ?? {}))
    if (r) {
      for (const [s, c] of Object.entries(r.bounds))
        o(
          `body.${t}.bounds.${s}`,
          c,
          "body",
          t,
          0,
          s === "y" || s === "height" ? 680 : 488,
          0.25
        );
      for (const s of ["minimumSize", "maximumSize"])
        o(`body.${t}.${s}`, r[s], "body", t, 6, 48, 0.25);
      for (const [s, c] of Object.entries(r.typography))
        typeof c == "number" ? o(
          `body.${t}.typography.${s}`,
          c,
          "body",
          t,
          s === "symbolOffsetY" ? -0.5 : s === "centerOffset" ? -20 : 0,
          s === "symbolOffsetY" ? 0.5 : s === "centerOffset" ? 20 : 3,
          0.01,
          "ratio"
        ) : typeof c == "boolean" && n(`body.${t}.typography.${s}`, c, "body", t);
      if (r.centered)
        for (const [s, c] of Object.entries(r.centered))
          o(
            `body.${t}.centered.${s}`,
            c,
            "body",
            t,
            0,
            s === "maxCharacters" ? 1e3 : s === "maxLines" ? 30 : 48,
            s === "maximumSize" ? 0.25 : 1
          );
    }
  const i = (t, r, s, c = 1) => r.forEach((l, p) => o(`${t}.${p}`, l, "colors", s, 0, c, 5e-3, "sRGB ratio"));
  for (const [t, r] of Object.entries(e.basicSymbol?.symbols ?? {}))
    r && i("basicSymbol.symbols." + t + ".ink", r.ink, "basic " + t);
  e.footer.artist.tint && i("footer.artist.tint", e.footer.artist.tint, "all", 1.5), e.footer.stats.tint && i("footer.stats.tint", e.footer.stats.tint, "all", 1.5);
  for (const [t, r] of Object.entries(e.mana.variants ?? {})) {
    for (const [s, c] of Object.entries(r?.geometry ?? {})) {
      if (typeof c != "number") continue;
      const l = /scale/i.test(s);
      o(
        "mana.variants." + t + ".geometry." + s,
        c,
        "symbols",
        t,
        l ? 0.7 : -12,
        l ? 1.4 : 12,
        l ? 5e-3 : 0.25,
        l ? "ratio" : "px"
      );
    }
    for (const [s, c] of Object.entries(r?.paper ?? {}))
      c && i("mana.variants." + t + ".paper." + s, c, t + "/" + s);
  }
  i("mana.ink", e.mana.ink, "all");
  for (const [t, r] of Object.entries(e.mana.inlineGeneric ?? {}))
    i("mana.inlineGeneric." + t + ".paper", r.paper, "Inline generic / " + t), o(
      "mana.inlineGeneric." + t + ".alpha",
      r.alpha,
      "colors",
      "Inline generic / " + t,
      0,
      1,
      0.01,
      "opacity"
    );
  for (const [t, r] of Object.entries(e.mana.paper))
    r && i(`mana.paper.${t}`, r, t);
  for (const [t, r] of Object.entries(e.colors)) {
    if (!r) continue;
    n(`colors.${t}.stock`, r.stock, "colors", t);
    const s = r.adjustment, c = "mask" in s ? [
      ["frame", s.frame],
      ["paper", s.paper],
      ...(s.regions ?? []).map(
        (l, p) => ["regions." + p + ".adjustment", l.adjustment]
      ),
      ...(s.accents ?? []).map(
        (l, p) => ["accents." + p + ".adjustment", l.adjustment]
      )
    ] : [["", s]];
    for (const [l, p] of c) {
      const m = `colors.${t}.adjustment${l ? "." + l : ""}`;
      for (const u of ["hueDegrees", "saturationScale", "brightnessScale", "valueGamma"])
        o(
          `${m}.${u}`,
          p[u] ?? (u === "hueDegrees" ? 0 : 1),
          "colors",
          t,
          u === "hueDegrees" ? -180 : u === "valueGamma" ? 0.5 : 0,
          u === "hueDegrees" ? 180 : u === "valueGamma" ? 2 : 3,
          u === "hueDegrees" ? 0.5 : 5e-3,
          u === "hueDegrees" ? "degrees" : "ratio"
        );
      i(`${m}.rgbScale`, p.rgbScale ?? [1, 1, 1], t, 3);
    }
    s.blackPoint && (i(`colors.${t}.adjustment.blackPoint.lift`, s.blackPoint.lift, t, 0.5), o(
      `colors.${t}.adjustment.blackPoint.transition`,
      s.blackPoint.transition,
      "colors",
      t,
      0.01,
      1,
      5e-3,
      "sRGB ratio"
    )), s.outerStock && i(`colors.${t}.adjustment.outerStock`, s.outerStock, t);
  }
  return a.map((t) => {
    const r = /^rulesAdjustments\.([^.]+)\.([^.]+)$/.exec(t.id);
    return !r || r[1] === "default" ? t : e.rulesAdjustments?.[r[1]]?.[r[2]] === void 0 ? { ...t, inheritedFrom: `rulesAdjustments.default.${r[2]}` } : t;
  });
}
function K({ lift: e, transition: a, texture: o }) {
  if (!Number.isFinite(a) || a <= 0 || a > 1 || e.length !== 3 || e.some((n) => !Number.isFinite(n) || n < 0 || n > a / 2))
    throw RangeError("Invalid frame black-point curve");
  if (o) {
    if (o.length < 2 || o.length > 16 || o[0]?.[0] !== 0 || o[0]?.[1].some((n) => n !== 0) || o.at(-1)?.[0] !== 1 || o.at(-1)?.[1].some((n) => n !== 0) || o.some(
      ([n, d]) => !Number.isFinite(n) || d.length !== 3 || d.some((i) => !Number.isFinite(i))
    ))
      throw RangeError("Invalid frame texture curve");
    for (let n = 1; n < o.length; n++) {
      const [d, i] = o[n - 1], [t, r] = o[n];
      if (t <= d || e.some(
        (s, c) => 1 - 2 * s / a * Math.max(0, 1 - d / a) + (r[c] - i[c]) / (t - d) < 0
      ))
        throw RangeError("Frame texture curve reverses contrast");
    }
  }
}
function de(e, a, o) {
  const n = a.transition * 255, d = new Float64Array(256 * 3);
  for (let i = 1; i < (a.texture?.length ?? 0); i++) {
    const [t, r] = a.texture[i - 1], [s, c] = a.texture[i];
    for (let l = Math.ceil(t * 255); l < s * 255; l++)
      for (let p = 0; p < 3; p++)
        d[l * 3 + p] = 255 * (r[p] + (c[p] - r[p]) * (l / 255 - t) / (s - t));
  }
  for (let i = 0; i < e.data.length; i += 4) {
    if (e.data[i + 3] === 0) continue;
    const t = Math.max(e.data[i], e.data[i + 1], e.data[i + 2]);
    if (t >= n && !a.texture) continue;
    const r = Math.max(0, 1 - t / n) ** 2;
    for (let s = 0; s < 3; s++)
      e.data[i + s] = Math.round(
        e.data[i + s] + 255 * a.lift[s] * r + d[t * 3 + s] * (o ? o.data[i + 3] / 255 : 1)
      );
  }
}
function y(e) {
  return e && typeof e == "object" && (Object.values(e).forEach(y), Object.freeze(e)), e;
}
function Q(e) {
  const a = e.toLowerCase(), o = k(a), n = x(a);
  return y({
    schema: 1,
    set: a,
    supported: !!(o || n),
    adapter: n ? "title" : "profile",
    revision: o?.revision ?? n?.revision ?? null,
    controls: o ? X(o) : n ? U(n) : [],
    notice: o ? "Ordinary old-frame plates only. Geometry, lettering, symbols and pigment use the native painter. Source assets and masks remain fixed." : n ? "Name and type controls use the native Alpha painter. Offsets are deltas from the existing shared placements. Frame, body, symbols and footer remain on their established calibration; full-profile editing is not available yet." : "This set does not yet have a consolidated profile adapter. Existing symbol and text diagnostic tools remain available."
  });
}
function G(e, a, o) {
  const n = Q(e);
  if (!n.supported || n.revision !== a)
    throw Error("Set calibration profile is unavailable or its revision changed");
  if (!o || typeof o != "object" || Array.isArray(o))
    throw Error("Calibration values must be a record");
  const d = new Map(n.controls.map((r) => [r.id, r])), i = {};
  for (const r of Object.keys(o).sort()) {
    const s = d.get(r), c = o[r];
    if (!s) throw Error("Unsupported calibration control: " + r);
    if (s.kind === "number" ? typeof c != "number" || !Number.isFinite(c) || c < s.min || c > s.max : s.kind === "boolean" ? typeof c != "boolean" : s.kind === "color" ? typeof c != "string" || !/^#[0-9a-f]{6}$/i.test(c) : typeof c != "string" || !s.options?.includes(c))
      throw Error("Invalid calibration value: " + r);
    const l = s.inheritedFrom && o[s.inheritedFrom];
    (c !== s.value || l !== void 0 && c !== l) && (i[r] = c);
  }
  const t = y({
    schema: 1,
    set: n.set,
    baseRevision: a,
    values: i
  });
  return x(e) || V(W(t)), t;
}
function S(e, a, o) {
  const n = a.split(".");
  let d = e;
  for (let i = 0; i < n.length - 1; i++) {
    const t = n[i];
    d[t] ??= /^\d+$/.test(n[i + 1]) ? [] : {}, d = d[t];
  }
  d[n.at(-1)] = o;
}
function W(e) {
  const a = k(e.set);
  if (!a) throw Error("This adapter exports title calibration; use exportSetTitleCalibration");
  const o = structuredClone(a);
  for (const n of Object.keys(e.values)) {
    if (!/\.rgbScale\.[012]$/.test(n)) continue;
    const d = n.split(".").slice(0, -1);
    let i = o;
    for (const t of d) i = i?.[t];
    if (!i) for (let t = 0; t < 3; t++) S(o, `${d.join(".")}.${t}`, 1);
  }
  for (const [n, d] of Object.entries(e.values)) S(o, n, d);
  for (const [n, d] of Object.entries(o.colors)) {
    if (!d) continue;
    const i = n.startsWith("L-") && !o.frames[n] ? "L" : n, t = o.frames[i], r = a.frames[i];
    if (!t || !r || !Object.keys(e.values).some((c) => c.startsWith(`frames.${i}.`)))
      continue;
    const s = JSON.parse(d.source);
    Array.isArray(s) && s.length === 2 && typeof s[0] == "string" && S(o, `colors.${n}.source`, JSON.stringify([s[0], t.frame]));
  }
  if (o.dualLand && Object.keys(e.values).some((n) => n.startsWith("frames.L-dual."))) {
    const n = o.frames["L-dual"];
    if (!n) throw Error("Dual-land calibration has no geometry");
    for (const [d, i] of Object.entries(o.dualLand.sources)) {
      if (!i) continue;
      const t = JSON.parse(i.source);
      if (!Array.isArray(t) || t.length !== 2 || typeof t[0] != "string")
        throw Error("Invalid dual-land material binding");
      S(o, `dualLand.sources.${d}.source`, JSON.stringify([t[0], n.frame]));
    }
  }
  return o;
}
function V(e) {
  for (const i of Object.values(e.frames))
    if (i?.artWindow) {
      const [t, r, s, c] = i.art, [l, p, m, u] = i.frame;
      if (t <= l || r <= p || t + s >= l + m || r + c >= p + u * i.artWindow.lowerAnchor)
        throw Error("Art aperture exceeds its source anchor");
    }
  const a = e.basicSymbol?.bounds;
  if (a && (a[0] < 0 || a[1] < 0 || a[2] <= 0 || a[3] <= 0 || a[0] + a[2] > 1 || a[1] + a[3] > 1))
    throw Error("Invalid basic-symbol bounds");
  for (const i of Object.values(e.rulesPlacement ?? {}))
    if (i && i.verticalLimits[0] >= i.verticalLimits[1])
      throw Error("Invalid retained rules limits");
  for (const i of Object.values(e.body ?? {}))
    if (i && (i.minimumSize <= 0 || i.maximumSize < i.minimumSize || i.bounds.width < 20 || i.bounds.height < 20 || i.typography.leading <= 0 || (i.typography.textWidth ?? 1) <= 0 || !Number.isFinite(i.typography.symbolOffsetY ?? 0) || Math.abs(i.typography.symbolOffsetY ?? 0) > 0.5))
      throw Error("Invalid body bounds or typography range");
  const o = e.bodyClasses;
  if (o && (o.bounds.width < 20 || o.bounds.height < 20 || !Number.isInteger(o.centered.maxCharacters) || !Number.isInteger(o.centered.maxLines) || o.centered.maxCharacters < 1 || o.centered.maxLines < 1 || o.centered.size <= 0 || o.compact.nominalMinimum <= 0 || o.compact.nominalMaximum <= o.compact.nominalMinimum || o.compact.size <= 0 || o.compact.leading <= 0 || o.typography.leading <= 0 || (o.typography.textWidth ?? 1) <= 0 || !Number.isFinite(o.typography.symbolOffsetY ?? 0) || Math.abs(o.typography.symbolOffsetY ?? 0) > 0.5))
    throw Error("Invalid body size classes, bounds or typography");
  const n = e.expansionBody;
  if (n && (n.regular <= 0 || n.compact <= 0 || n.textWidth <= 0 || n.compactLeading <= 0 || (n.regularLeading ?? 1) <= 0 || (n.largeLeading ?? 1.1) <= 0 || (n.largeSize ?? 27.5) <= 0 || !Number.isInteger(n.threshold) || n.threshold < 1 || n.bounds && (n.bounds.width < 20 || n.bounds.height < 20)))
    throw Error("Invalid expansion body bounds or typography");
  const d = n?.unconstrained?.minimumFreeSpace;
  if (d !== void 0 && (!Number.isFinite(d) || d < 0))
    throw Error("Invalid expansion free-space threshold");
  for (const i of [n, n?.unconstrained])
    if (i && ((i.regularLeading ?? 1) <= 0 || (i.compactLeading ?? 1) <= 0 || (i.compact ?? 1) <= 0 || i.flavorOrphanMinCharacters !== void 0 && (!Number.isInteger(i.flavorOrphanMinCharacters) || i.flavorOrphanMinCharacters < 0)))
      throw Error("Invalid expansion refinement or flavor threshold");
  for (const i of [
    ...Object.values(e.colors),
    ...Object.values(e.dualLand?.sources ?? {})
  ])
    i?.adjustment.blackPoint && K(i.adjustment.blackPoint);
  if (e.textTiers?.retainRegularAboveLines !== void 0 && (!Number.isInteger(e.textTiers.retainRegularAboveLines) || e.textTiers.retainRegularAboveLines < 1))
    throw Error("Invalid regular density limit");
}
const P = /* @__PURE__ */ new WeakMap();
function R(e) {
  if (!e || e.schema !== 1) throw Error("Unsupported calibration candidate schema");
  const a = JSON.stringify(e), o = P.get(e);
  if (o?.key === a) return o.profile;
  const n = G(
    e.set,
    e.baseRevision,
    e.values
  ), d = y(W(n));
  return P.set(e, { key: a, profile: d }), d;
}
function pe(e) {
  const a = R(e);
  return y({ ...structuredClone(a), revision: a.revision + 1 });
}
function B(e) {
  const a = x(e.set);
  if (!a) throw Error("This set has no title calibration adapter");
  const o = G(
    e.set,
    e.baseRevision,
    e.values
  ), n = { ...a, title: { ...a.title }, type: { ...a.type } };
  for (const [d, i] of Object.entries(o.values)) {
    const [t, r] = d.split(".");
    n[t][r] = i;
  }
  return y(n);
}
function me(e) {
  const a = B(e);
  return y({ ...a, revision: a.revision + 1 });
}
const w = {
  ice: {
    donor: "4ed",
    border: "black",
    stock: "#080808",
    retain: []
  },
  vis: {
    donor: "mir",
    border: "black",
    stock: "#17140f",
    retain: []
  },
  "5ed": {
    donor: "mir",
    border: "white",
    stock: "#eeedeb",
    retain: ["mana"]
  },
  tmp: {
    donor: "mir",
    border: "black",
    stock: "#080808",
    retain: ["rules"]
  },
  usg: {
    donor: "mir",
    materialPalettes: { W: "source" },
    border: "black",
    stock: "#181510",
    retain: ["title", "mana"]
  },
  "7ed": {
    donor: "mir",
    materialPalettes: { U: "source", G: "ons" },
    pigment: {
      W: {
        source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/wcard.jpg",[-0.001045081967213201,-0.007882352941176557,1.0025000000000002,1.0090000000000001]]',
        frame: {
          hueDegrees: 10.905760313211992,
          saturationScale: 0.9018475693078511,
          brightnessScale: 0.9944601970518206,
          valueGamma: 0.7184258866107253,
          rgbScale: [0.9841223604100684, 0.9969718789841865, 1.01922012824248]
        },
        paper: {
          hueDegrees: 11.51996845434791,
          saturationScale: 0.6770456105672296,
          brightnessScale: 1.1298624370561754,
          valueGamma: 0.8344807915302515,
          rgbScale: [0.9678349812465361, 0.9899512137568719, 1.0437221312816405]
        }
      },
      B: {
        source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/bcard.jpg",[-0.0005901639344259955,0.0014558823529411732,1.0019999999999996,0.9965]]',
        frame: {
          hueDegrees: -179.99999996626087,
          saturationScale: 0.3228575402674925,
          brightnessScale: 0.7331598551435111,
          valueGamma: 0.7729866947283267,
          rgbScale: [0.8971232610265468, 1.1243275803736956, 0.9914139336201415]
        },
        paper: {
          hueDegrees: -1.7591910252524003,
          saturationScale: 1.2373981755283008,
          brightnessScale: 1.0880248742553484,
          valueGamma: 1.1075436924500106,
          rgbScale: [0.9123209433984318, 0.9996741574853106, 1.0964627699945009]
        }
      }
    },
    border: "white",
    stock: "#eeedeb",
    retain: []
  },
  inv: {
    donor: "mir",
    border: "black",
    stock: "#080808",
    retain: []
  },
  ody: {
    donor: "mir",
    border: "black",
    stock: "#181510",
    retain: ["title", "mana", "rules"]
  },
  lgn: {
    donor: "mir",
    palette: "ons",
    border: "black",
    stock: "#080808",
    retain: ["title", "type"]
  },
  "6ed": {
    donor: "mir",
    border: "white",
    stock: "#eeedeb",
    retain: []
  },
  all: {
    donor: "4ed",
    border: "black",
    stock: "#080808",
    retain: ["type"]
  },
  apc: {
    donor: "mir",
    border: "black",
    stock: "#080808",
    retain: ["title", "mana"]
  },
  brb: {
    donor: "mir",
    palette: "source",
    border: "white",
    stock: "#eeedeb",
    retain: ["rules"]
  },
  btd: {
    donor: "mir",
    border: "white",
    stock: "#eeedeb",
    retain: ["mana", "rules"]
  },
  exo: {
    donor: "mir",
    border: "black",
    stock: "#080808",
    retain: ["title", "mana", "rules"]
  },
  hml: {
    donor: "4ed",
    border: "black",
    stock: "#080808",
    retain: []
  },
  jud: {
    donor: "mir",
    border: "black",
    stock: "#080808",
    retain: ["title", "type", "mana"]
  },
  mmq: {
    donor: "mir",
    border: "black",
    stock: "#080808",
    retain: ["title", "rules"]
  },
  nem: {
    donor: "mir",
    border: "black",
    stock: "#181510",
    retain: ["title"]
  },
  p02: {
    donor: "mir",
    border: "black",
    stock: "#080808",
    retain: ["rules"]
  },
  pcy: {
    donor: "mir",
    border: "black",
    stock: "#181510",
    retain: ["title"]
  },
  pls: {
    donor: "mir",
    border: "black",
    stock: "#181510",
    retain: ["title"]
  },
  por: {
    donor: "mir",
    palette: "source",
    border: "black",
    stock: "#080808",
    retain: ["mana", "rules"]
  },
  ptk: {
    donor: "mir",
    palette: "source",
    border: "white",
    stock: "#eeedeb",
    retain: []
  },
  s99: {
    donor: "mir",
    border: "white",
    stock: "#eeedeb",
    retain: ["mana", "rules"]
  },
  sth: {
    donor: "mir",
    border: "black",
    stock: "#080808",
    retain: []
  },
  tor: {
    donor: "mir",
    border: "black",
    stock: "#080808",
    retain: ["title", "type"]
  },
  uds: {
    donor: "mir",
    border: "black",
    stock: "#181510",
    retain: ["title", "mana"]
  },
  ulg: {
    donor: "mir",
    border: "black",
    stock: "#181510",
    retain: ["title", "mana"]
  },
  wth: {
    donor: "mir",
    border: "black",
    stock: "#17140f",
    retain: ["title", "rules"]
  },
  scg: {
    donor: "mir",
    palette: "ons",
    border: "black",
    stock: "#080808",
    retain: ["title"]
  },
  itp: {
    donor: "4ed",
    border: "white",
    stock: "#eeedeb",
    retain: ["title", "type", "mana", "rules"]
  },
  ath: {
    donor: "mir",
    border: "white",
    stock: "#eeedeb",
    retain: ["title", "type", "mana", "rules"]
  },
  rqs: {
    donor: "4ed",
    border: "white",
    stock: "#eeedeb",
    retain: ["title", "type", "mana", "rules"]
  }
};
function ue(e) {
  return Object.hasOwn(w, e?.toLowerCase() ?? "");
}
function N(e) {
  const a = e?.toLowerCase() ?? "";
  return !T.includes(a) && Object.hasOwn(w, a) ? w[a].donor : void 0;
}
function Z(e) {
  const a = e?.toLowerCase() ?? "", o = N(a) ? w[a] : void 0;
  return o && (o.palette === "ons" || Object.values(o.materialPalettes ?? {}).includes("ons")) ? "ons" : void 0;
}
function $(e) {
  const a = e.setCode?.toLowerCase() ?? "";
  if (!(a === "ice" || !N(a) || e.setCalibrationCandidate || e.calibration === "printing" || e.frameTemplate || e.frameAssetFamily || e.frameStyle === "modern" || e.faces?.length || e.layout && e.layout !== "normal" || e.borderColor && !["black", "white"].includes(e.borderColor) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "")))
    return w[a];
}
function be(e, a) {
  return $(e)?.retain.includes(a) ?? !1;
}
function fe(e) {
  const a = $(e);
  if (!(!a || a.retain.includes("mana")))
    return a.donor === "4ed" ? { manaRight: 446.5, manaTop: 27.5, manaSize: 23.4, manaGap: 3.6 } : a.donor === "mir" ? { manaRight: 448, manaTop: 33.5, manaSize: 23.4, manaGap: 1.7 } : void 0;
}
const F = /* @__PURE__ */ new WeakMap();
function ee(e) {
  const a = $(e);
  if (!a) return;
  const o = k(a.donor);
  if (!o) return;
  const n = Z(e.setCode), d = n ? k(n) : void 0;
  if (n && !d) return;
  const i = e.setCode.toLowerCase(), t = e.borderColor === "white" ? "white" : e.borderColor === "black" ? "black" : a.border, r = t === a.border ? a.stock : t === "white" ? "#eeedeb" : "#181510", s = i + "/" + t + "/" + r;
  let c = F.get(o);
  c || (c = /* @__PURE__ */ new Map(), F.set(o, c));
  const l = c.get(s);
  if (l && l.palette === d) return l.profile;
  const p = parseInt(r.slice(1), 16), m = [(p >> 16) / 255, (p >> 8 & 255) / 255, (p & 255) / 255], u = {
    ...o,
    set: i,
    border: t,
    colors: Object.fromEntries(
      Object.entries(o.colors).map(([f, h]) => {
        if (!h) return [f, h];
        let b = h.adjustment;
        const j = a.pigment?.[f], L = a.materialPalettes?.[f] ?? a.palette;
        if (j && j.source === h.source && "mask" in b)
          b = { ...b, frame: j.frame, paper: j.paper };
        else if (L === "source")
          b = {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            ...b.outerStock ? { outerStock: b.outerStock } : {}
          };
        else if (L === "ons") {
          const O = d?.colors[f];
          O && JSON.parse(O.source)[0] === JSON.parse(h.source)[0] && (b = {
            ...O.adjustment,
            ...b.outerStock ? { outerStock: b.outerStock } : {}
          });
        }
        return [
          f,
          {
            ...h,
            stock: r,
            adjustment: t === "black" && b.outerStock ? { ...b, outerStock: m } : b
          }
        ];
      })
    ),
    footer: {
      ...o.footer,
      legal: { ...o.footer.legal, defaultText: void 0, collectorTotal: void 0 }
    },
    ...a.retain.includes("rules") ? {
      body: void 0,
      bodyClasses: void 0,
      expansionBody: void 0,
      textTiers: void 0,
      rulesPlacement: void 0,
      rulesAdjustments: void 0
    } : {}
  };
  return delete u.setSymbols, delete u.setSymbolSource, delete u.landMaterials, delete u.dualLand, c.set(s, { palette: d, profile: u }), u;
}
function he(e) {
  const a = e.setCalibrationCandidate;
  if (!a)
    return k(e.setCode) ?? oe(e) ?? ee(e);
  if (a.set !== e.setCode?.toLowerCase())
    throw Error("Calibration candidate belongs to another set");
  if (x(a.set)) {
    B(a);
    return;
  }
  return R(a);
}
function te(e) {
  return e.setCode?.toLowerCase() === "ice" && e.calibration !== "printing" && !e.frameTemplate && !e.frameAssetFamily && e.frameStyle !== "modern" && (!e.layout || e.layout === "normal") && (!e.borderColor || e.borderColor === "black") && (e.frameColors ?? e.colors ?? []).length <= 1 && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "");
}
const M = /* @__PURE__ */ new WeakMap();
function oe(e) {
  if (!te(e)) return;
  const a = k("4ed");
  if (!a) return;
  let o = M.get(a);
  return o || (o = {
    ...a,
    set: "ice",
    border: "black",
    colors: Object.fromEntries(
      Object.entries(a.colors).map(([n, d]) => [
        n,
        d && { ...d, stock: "#080808" }
      ])
    )
  }, M.set(a, o)), o;
}
function ge(e) {
  return e.frameAssetFamily === "eighth" && e.setCode?.toLowerCase() !== "plc" && (e.borderColor === void 0 || e.borderColor === "white" || e.borderColor === "black") && e.frameStyle !== "retro" && !e.frameTreatment && !e.frameTemplate && !e.faces?.length && (!e.layout || e.layout === "normal") && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "") && !/^Level up\b/m.test(e.rulesText ?? "");
}
const re = new Set(
  "10e 5dn 8ed 9ed ala arb arc avr bng bok c13 chk cm1 cmd cns con csp cst dci dd1 dd2 ddc ddd dde ddf ddg ddh ddi ddj ddk ddl ddm dgm dis dka dpa drb dst eve f04 f05 f06 f07 f08 f09 f10 f11 f12 f13 f14 fut g04 g05 g06 g07 g08 g09 g10 g11 gpt gtc h09 hho hop isd j12 j13 j14 jou l12 l13 l14 lrw m10 m11 m12 m13 m14 mbs md1 me1 me2 me3 me4 mma mor mrd nph oarc oc13 ocm1 ocmd ohop olgc opc2 p04 p05 p06 p07 p08 p09 p10 p10e p11 p15a p2hg p5dn p8ed p9ed pal04 pal05 pal06 pala parb pavr pbng pbok pc2 pchk pcmd pcmp pcns pcon pcsp pd2 pd3 pdgm pdis pdka pdp10 pdp12 pdp13 pdp14 pdp15 pdst pdtp peve pfut pgpt pgpx pgtc phel phop phuk pidw pisd pjas pjou pjse plc plrw pm10 pm11 pm12 pm13 pm14 pm15 pmbs pmor pmps pmps06 pmps07 pmps08 pmps09 pmps10 pmps11 pmrd pnph ppc1 pplc ppro prav proe prtr ps11 ps14 psal psdc pshm psok psom pths ptsp punh purl pw11 pw12 pwwk pzen rav roe rtr shm sok som t10e tala tarb tavr tbng tbth tcns tcon td0 td2 tdag tdd1 tdd2 tddc tddd tdde tddf tddg tddh tddi tddj tddk tddl tddm tdgm tdka teve tfth tgtc thp1 thp2 thp3 ths tisd tjou tlrw tm10 tm11 tm12 tm13 tm14 tmbs tmd1 tmma tmor tnph troe trtr tsb tshm tsom tsp tths twwk tzen unh v09 v10 v11 v12 v13 vma wc03 wc04 wmc wwk zen".split(
    " "
  )
);
function ye(e) {
  return re.has(e.toLowerCase());
}
const se = new Set(
  "10e 2ed 3ed 4bb 4ed 5dn 5ed 6ed 7ed 8ed 9ed ala all apc arb arc arn ath atq avr bchr bng bok brb btd c13 ced cei chk chr cm1 cmd cns con csp cst dci dd1 dd2 ddc ddd dde ddf ddg ddh ddi ddj ddk ddl ddm dgm dis dka dkm dpa drb drk dst eve exo f01 f02 f03 f04 f05 f06 f07 f08 f09 f10 f11 f12 f13 f14 fbb fem fnm fut g00 g01 g02 g03 g04 g05 g06 g07 g08 g09 g10 g11 g99 gpt gtc h09 hho hml hop ice inv isd itp j12 j13 j14 jgp jou jp1 jud l12 l13 l14 lea leb leg lgn lrw m10 m11 m12 m13 m14 mbs md1 me1 me2 me3 me4 mgb mir mma mmq mor mpr mrd nem nph o90p oarc oc13 ocm1 ocmd ody ohop olep olgc ons opc2 ovnt p02 p03 p04 p05 p06 p07 p08 p09 p10 p10e p11 p15a p2hg p5dn p8ed p9ed pal00 pal01 pal02 pal03 pal04 pal05 pal06 pal99 pala palp papc parb parl past pavr pbng pbok pc2 pcel pchk pcmd pcmp pcns pcon pcsp pcy pd2 pd3 pdgm pdis pdka pdp10 pdp12 pdp13 pdp14 pdp15 pdrc pdst pdtp pelp peve pexo pfut pgpt pgpx pgru pgtc phel phop phpr phuk pidw pinv pisd pjas pjjt pjou pjse pjud plc plgm plgn plrw pls pm10 pm11 pm12 pm13 pm14 pm15 pmbs pmei pmic pmmq pmoa pmor pmps pmps06 pmps07 pmps08 pmps09 pmps10 pmps11 pmrd pnem pnph pody pons por ppc1 ppcy pplc ppls ppro pptk pr2 prav pred prm proe prtr ps11 ps14 psal pscg psdc psdg pshm psok psom psth psus ptc pths ptk ptmp ptor ptsp puds pulg punh purl pusg pvan pw11 pw12 pwor pwos pwwk pzen rav ren rin roe rqs rtr s00 s99 scg shm sok som sth sum t10e tala tarb tavr tbng tbth tcns tcon td0 td2 tdag tdd1 tdd2 tddc tddd tdde tddf tddg tddh tddi tddj tddk tddl tddm tdgm tdka teve tfth tgtc thp1 thp2 thp3 ths tisd tjou tlrw tm10 tm11 tm12 tm13 tm14 tmbs tmd1 tmma tmor tmp tnph tor troe trtr tsb tshm tsom tsp tths tugl twwk tzen uds ugl ulg unh usg v09 v10 v11 v12 v13 vis vma wc00 wc01 wc02 wc03 wc04 wc97 wc98 wc99 wmc wth wwk zen ".trim().split(/\s+/)
);
function ke(e) {
  return e.frameStyle === "retro" || e.frameAssetFamily === "eighth" || e.frameTreatment === "colorshifted" || e.frameTemplate === "future" || e.frameTemplate === "flip" || /^(?:split-old|split-eighth|flip|leveler)/.test(e.layout ?? "") ? !1 : e.frameAssetFamily === "m15-accurate" || ae(e.setCode ?? "");
}
function ae(e) {
  return !se.has(e.toLowerCase());
}
export {
  fe as A,
  me as a,
  B as b,
  G as c,
  Q as d,
  pe as e,
  ne as f,
  Z as g,
  ye as h,
  ie as i,
  $ as j,
  ge as k,
  ce as l,
  ae as m,
  ke as n,
  N as o,
  he as p,
  de as q,
  R as r,
  le as s,
  D as t,
  te as u,
  K as v,
  be as w,
  ue as x,
  x as y,
  k as z
};
