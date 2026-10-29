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
  const t = q[e] ?? a?.split(/[/-]/)[0]?.toLowerCase();
  if (t && Y.has(t) && !v.has(t + "/calibration"))
    throw Error(
      `Magic set ${t} is not prepared. Await loadMagicSet('${t}') or prepareMagicCards(cards) before synchronous layout queries.`
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
    for (const [t, n] of Object.entries(e.tables))
      for (const d of Object.keys(n))
        if (Object.hasOwn(g.get(t) ?? {}, d))
          throw Error(`Duplicate calibration value: ${t}/${d}`);
    A(e);
    for (const [t, n] of Object.entries(e.tables)) {
      const d = g.get(t) ?? /* @__PURE__ */ Object.create(null);
      Object.assign(d, n), g.set(t, d);
    }
    z.set(a, e), v.add(a);
  }
}
const ie = (e, a = "calibration") => v.has(e + "/" + a), ce = () => [...v].filter((e) => e.endsWith("/calibration")).map((e) => e.split("/")[0]).sort();
function D(e) {
  return C.has(e) || C.set(
    e,
    new Proxy(/* @__PURE__ */ Object.create(null), {
      get: (a, t) => {
        if (typeof t == "string")
          return E(e, t), g.get(e)?.[t];
      },
      has: (a, t) => typeof t == "string" && Object.hasOwn(g.get(e) ?? {}, t),
      ownKeys: () => (E(e), Object.keys(g.get(e) ?? {})),
      getOwnPropertyDescriptor: (a, t) => typeof t == "string" && Object.hasOwn(g.get(e) ?? {}, t) ? {
        value: g.get(e)[t],
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
  const t = ["printingCorrections", "artistCredits"].includes(a) ? "wording" : "calibration", n = z.get(e + "/" + t);
  if (!n) throw Error(`Magic set ${e} is not prepared`);
  return n.tables[a] ?? {};
}
const J = D("setTitleCalibrations");
function x(e) {
  return e?.toLowerCase() === "lea" ? J.lea : void 0;
}
function U(e) {
  return ["title", "type"].flatMap(
    (a) => Object.entries(e[a]).map(([t, n]) => ({
      id: `${a}.${t}`,
      label: `${a === "title" ? "name" : "type"} · ${t === "dx" ? "horizontal offset" : t === "dy" ? "vertical offset" : t}`,
      group: "lettering",
      scope: "all",
      kind: "number",
      value: n,
      min: t === "wordSpacing" ? -6 : t === "dx" || t === "dy" ? -30 : t === "width" ? 0.6 : t === "size" ? 8 : 0,
      max: t === "wordSpacing" ? 6 : t === "dx" || t === "dy" ? 30 : t === "gray" ? 255 : t === "size" ? 60 : t === "width" ? 1.5 : 4,
      step: t === "width" ? 1e-3 : t === "gray" ? 1 : 0.05,
      unit: t === "width" ? "ratio" : t === "gray" ? "sRGB 0–255" : "px"
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
  const t = [
    {
      id: "dualLand.stock",
      label: "Dual land · outer stock",
      value: a.stock,
      kind: "color",
      group: "colors",
      scope: "L-dual"
    }
  ], n = (i, o, s, r, c, l, p = "L-dual") => t.push({
    id: i,
    label: i.split(".").slice(1).join(" · "),
    value: o,
    kind: "number",
    group: i.startsWith("dualLand.pinline.box") || i.startsWith("dualLand.pinline.width") ? "frame" : "colors",
    scope: p,
    min: s,
    max: r,
    step: c,
    unit: l
  });
  for (const i of ["box", "width"])
    for (const [o, s] of Object.entries(a.pinline[i]))
      n(
        `dualLand.pinline.${i}.${o}`,
        s,
        0,
        i === "width" ? 80 : o === "top" || o === "bottom" ? 2100 : 1500,
        0.25,
        "source px"
      );
  const d = (i, o, s) => o.forEach((r, c) => n(`${i}.${c}`, r, 0, 1, 5e-3, "sRGB ratio", s));
  for (const [i, o] of Object.entries(a.pinline.palette))
    o && d(`dualLand.pinline.palette.${i}`, o, i);
  a.pinline.edge && d("dualLand.pinline.edge", a.pinline.edge, "L-dual");
  for (const [i, o] of Object.entries(a.sources)) {
    if (!o) continue;
    const s = o.adjustment, r = "mask" in s ? [
      ["frame", s.frame],
      ["paper", s.paper]
    ] : [["", s]];
    for (const [c, l] of r)
      for (const p of [
        "hueDegrees",
        "saturationScale",
        "brightnessScale",
        "valueGamma"
      ]) {
        const u = p === "hueDegrees";
        n(
          `dualLand.sources.${i}.adjustment${c ? "." + c : ""}.${p}`,
          l[p] ?? (u ? 0 : 1),
          u ? -180 : p === "valueGamma" ? 0.5 : 0,
          u ? 180 : p === "valueGamma" ? 2 : 3,
          u ? 0.5 : 5e-3,
          u ? "degrees" : "ratio",
          i
        );
      }
  }
  return t;
}
function X(e) {
  const a = [], t = (o, s, r, c, l, p, u, m = "px") => {
    a.push({
      id: o,
      label: o.split(".").slice(c === "all" ? 0 : 2).join(" · "),
      value: s,
      group: r,
      scope: c,
      kind: "number",
      min: l,
      max: p,
      step: u,
      unit: m
    });
  }, n = (o, s, r, c, l) => a.push({
    id: o,
    label: o.split(".").slice(2).join(" · "),
    value: s,
    group: r,
    scope: c,
    kind: typeof s == "boolean" ? "boolean" : l ? "choice" : "color",
    options: l
  });
  for (const [o, s] of Object.entries(e.frames))
    if (s)
      for (const r of [
        "frame",
        "art",
        s.stockMaskFrame ? "stockMaskFrame" : "stockWindow"
      ])
        s[r].forEach(
          (c, l) => t(
            `frames.${o}.${r}.${l}`,
            c,
            "frame",
            o,
            l < 2 ? -0.15 : 0.05,
            1.3,
            5e-4,
            "card fraction"
          )
        );
  t(
    "cornerRadius",
    e.cornerRadius ?? 0.045,
    "frame",
    "all",
    0.01,
    0.09,
    1e-3,
    "card width"
  );
  for (const o of ["title", "type", "footer.artist", "footer.legal", "footer.stats"]) {
    const s = o.startsWith("footer.") ? e.footer[o.slice(7)] : e[o];
    for (const [r, c] of Object.entries(s)) {
      if (typeof c != "number" || r === "collectorTotal") continue;
      const l = /gray/i.test(r), p = r === "width";
      t(
        `${o}.${r}`,
        c,
        o.startsWith("footer") ? "footer" : "lettering",
        "all",
        r === "x" || r === "y" ? 0 : p ? 0.6 : 0,
        r === "x" || r === "maxWidth" ? 488 : r === "y" ? 680 : l ? 255 : r === "size" ? 60 : p ? 1.5 : 4,
        l ? 1 : 0.05,
        p ? "ratio" : l ? "sRGB 0–255" : "px"
      );
    }
  }
  e.footer.legal.align !== void 0 && n("footer.legal.align", e.footer.legal.align, "footer", "all", [
    "left",
    "center",
    "right"
  ]), e.basicSymbol?.bounds && e.basicSymbol.bounds.forEach(
    (o, s) => t(
      "basicSymbol.bounds." + s,
      o,
      "symbols",
      "basic lands",
      s < 2 ? 0 : 0.01,
      1,
      5e-4,
      "card fraction"
    )
  );
  for (const [o, s] of Object.entries(e.basicSymbol?.symbols ?? {}))
    if (s?.placement)
      for (const r of ["dx", "dy", "scaleX", "scaleY"]) {
        const c = /scale/.test(r);
        t(
          "basicSymbol.symbols." + o + ".placement." + r,
          s.placement[r] ?? (c ? 1 : 0),
          "symbols",
          "basic " + o,
          c ? 0.7 : -12,
          c ? 1.4 : 12,
          c ? 5e-3 : 0.125,
          c ? "ratio" : "px"
        );
      }
  for (const [o, s] of Object.entries(e.rulesPlacement ?? {}))
    s && (t(
      "rulesPlacement." + o + ".baselineScale",
      s.baselineScale,
      "body",
      o,
      0.9,
      1.1,
      5e-3,
      "ratio"
    ), s.offset.forEach(
      (r, c) => t("rulesPlacement." + o + ".offset." + c, r, "body", o, -8, 8, 0.25)
    ), s.verticalLimits.forEach(
      (r, c) => t(
        "rulesPlacement." + o + ".verticalLimits." + c,
        r,
        "body",
        o,
        0,
        680,
        0.25
      )
    ), s.maximumHeight !== void 0 && t(
      "rulesPlacement." + o + ".maximumHeight",
      s.maximumHeight,
      "body",
      o,
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
    const o = [
      ["expansionBody", e.expansionBody, "all"],
      ["expansionBody.unconstrained", e.expansionBody.unconstrained, "unconstrained"]
    ];
    for (const [s, r, c] of o)
      for (const [l, p] of Object.entries(r ?? {})) {
        if (typeof p == "boolean") {
          n(s + "." + l, p, "body", c);
          continue;
        }
        if (typeof p != "number") continue;
        const u = l === "threshold" || l === "flavorOrphanMinCharacters", m = l === "minimumFreeSpace", f = /Width|Leading/i.test(l), h = /offset/i.test(l);
        t(
          s + "." + l,
          p,
          "body",
          c,
          h ? -30 : f ? 0.5 : m ? 0 : u ? l === "threshold" ? 1 : 0 : 6,
          h ? 30 : f ? 1.5 : m ? 680 : u ? 1e3 : 48,
          u ? 1 : f ? 5e-3 : 0.25,
          u ? "count" : f ? "ratio" : "px"
        );
      }
    for (const [s, r] of Object.entries(e.expansionBody.bounds ?? {}))
      t(
        "expansionBody.bounds." + s,
        r,
        "body",
        "all",
        0,
        s === "y" || s === "height" ? 680 : 488,
        0.25
      );
  }
  if (e.bodyClasses) {
    const o = "size classes";
    for (const [s, r] of Object.entries(e.bodyClasses.bounds))
      t(
        "bodyClasses.bounds." + s,
        r,
        "body",
        o,
        0,
        s === "y" || s === "height" ? 680 : 488,
        0.25
      );
    for (const s of ["centered", "compact"])
      for (const [r, c] of Object.entries(e.bodyClasses[s])) {
        const l = r === "maxCharacters" || r === "maxLines", p = r === "leading";
        t(
          "bodyClasses." + s + "." + r,
          c,
          "body",
          o,
          l ? 1 : p ? 0.5 : 6,
          r === "maxCharacters" ? 1e3 : r === "maxLines" ? 30 : p ? 2 : 48,
          l ? 1 : p ? 0.01 : 0.25,
          l ? "count" : p ? "ratio" : "px"
        );
      }
    for (const [s, r] of Object.entries(e.bodyClasses.typography))
      if (typeof r == "boolean") n("bodyClasses.typography." + s, r, "body", o);
      else if (typeof r == "number") {
        const c = s === "centerOffset", l = s === "symbolOffsetY", p = s === "textWidth" || s === "leading" || l;
        t(
          "bodyClasses.typography." + s,
          r,
          "body",
          o,
          l ? -0.5 : c ? -24 : p ? 0.5 : 0,
          l ? 0.5 : c ? 24 : p ? 2 : 30,
          p ? 0.01 : 0.25,
          p ? "ratio" : "px"
        );
      }
  }
  if (e.textTiers) {
    for (const [o, s] of Object.entries(e.textTiers))
      if (typeof s == "boolean") n(`textTiers.${o}`, s, "body", "all");
      else if (typeof s == "number") {
        const r = o === "denseWidth", c = ["largeMaximum", "mediumMaximum", "retainRegularAboveLines"].includes(o);
        t(
          `textTiers.${o}`,
          s,
          "body",
          "all",
          r ? 0.7 : c ? 1 : -24,
          r ? 1.3 : c ? 1e3 : 488,
          r ? 5e-3 : c ? 1 : 0.25,
          r ? "ratio" : c ? "count" : "px"
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
  const d = e.mana.geometry;
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
    const s = /scale/i.test(o);
    t(
      `mana.geometry.${o}`,
      d[o] ?? (s ? 1 : 0),
      "symbols",
      "all",
      s ? 0.7 : -12,
      s ? 1.4 : 12,
      s ? 5e-3 : 0.25,
      s ? "ratio" : "px"
    );
  }
  for (const o of ["W", "U", "B", "R", "G"])
    for (const s of ["dx", "dy", "scale"])
      t(
        `mana.geometry.glyphs.${o}.${s}`,
        d.glyphs?.[o]?.[s] ?? (s === "scale" ? 1 : 0),
        "symbols",
        o,
        s === "scale" ? 0.5 : -6,
        s === "scale" ? 1.5 : 6,
        s === "scale" ? 5e-3 : 0.25,
        s === "scale" ? "ratio" : "px"
      );
  for (const [o, s] of Object.entries(e.mana.sourceInk ?? {}))
    s && t(
      `mana.sourceInk.${o}.pixels`,
      s.pixels,
      "symbols",
      o,
      0,
      1,
      0.05,
      "px per 24px disc"
    );
  for (const [o, s] of Object.entries(e.setSymbols ?? {}))
    if (s)
      for (const r of ["right", "centerY", "width", "height", "outline"])
        t(
          `setSymbols.${o}.${r}`,
          s[r] ?? 0,
          "symbols",
          o,
          r === "width" || r === "height" ? 1 : 0,
          r === "right" ? 488 : r === "centerY" ? 680 : r === "outline" ? 6 : 100,
          0.25
        );
  for (const o of ["default", ...Object.keys(e.frames)]) {
    const s = { ...e.rulesAdjustments?.default, ...e.rulesAdjustments?.[o] };
    n(`rulesAdjustments.${o}.alignment`, s?.alignment ?? "printing", "body", o, [
      "printing",
      "left",
      "center"
    ]);
    for (const r of [
      "leftMargin",
      "rightMargin",
      "vertical",
      "fontSize",
      "textWidth",
      "leading",
      "paragraphGap",
      "flavorGap"
    ]) {
      const c = ["textWidth", "leading", "paragraphGap", "flavorGap"].includes(r), l = r === "fontSize" ? 4 : c ? 0.3 : 24;
      t(
        `rulesAdjustments.${o}.${r}`,
        s?.[r] ?? 0,
        "body",
        o,
        -l,
        l,
        c ? 5e-3 : 0.25,
        c ? "ratio delta" : "px delta"
      );
    }
  }
  for (const [o, s] of Object.entries(e.body ?? {}))
    if (s) {
      for (const [r, c] of Object.entries(s.bounds))
        t(
          `body.${o}.bounds.${r}`,
          c,
          "body",
          o,
          0,
          r === "y" || r === "height" ? 680 : 488,
          0.25
        );
      for (const r of ["minimumSize", "maximumSize"])
        t(`body.${o}.${r}`, s[r], "body", o, 6, 48, 0.25);
      for (const [r, c] of Object.entries(s.typography))
        typeof c == "number" ? t(
          `body.${o}.typography.${r}`,
          c,
          "body",
          o,
          r === "symbolOffsetY" ? -0.5 : r === "centerOffset" ? -20 : 0,
          r === "symbolOffsetY" ? 0.5 : r === "centerOffset" ? 20 : 3,
          0.01,
          "ratio"
        ) : typeof c == "boolean" && n(`body.${o}.typography.${r}`, c, "body", o);
      if (s.centered)
        for (const [r, c] of Object.entries(s.centered))
          t(
            `body.${o}.centered.${r}`,
            c,
            "body",
            o,
            0,
            r === "maxCharacters" ? 1e3 : r === "maxLines" ? 30 : 48,
            r === "maximumSize" ? 0.25 : 1
          );
    }
  const i = (o, s, r, c = 1) => s.forEach((l, p) => t(`${o}.${p}`, l, "colors", r, 0, c, 5e-3, "sRGB ratio"));
  for (const [o, s] of Object.entries(e.basicSymbol?.symbols ?? {}))
    s && i("basicSymbol.symbols." + o + ".ink", s.ink, "basic " + o);
  e.footer.artist.tint && i("footer.artist.tint", e.footer.artist.tint, "all", 1.5), e.footer.stats.tint && i("footer.stats.tint", e.footer.stats.tint, "all", 1.5);
  for (const [o, s] of Object.entries(e.mana.variants ?? {})) {
    for (const [r, c] of Object.entries(s?.geometry ?? {})) {
      if (typeof c != "number") continue;
      const l = /scale/i.test(r);
      t(
        "mana.variants." + o + ".geometry." + r,
        c,
        "symbols",
        o,
        l ? 0.7 : -12,
        l ? 1.4 : 12,
        l ? 5e-3 : 0.25,
        l ? "ratio" : "px"
      );
    }
    for (const [r, c] of Object.entries(s?.paper ?? {}))
      c && i("mana.variants." + o + ".paper." + r, c, o + "/" + r);
  }
  i("mana.ink", e.mana.ink, "all");
  for (const [o, s] of Object.entries(e.mana.paper))
    s && i(`mana.paper.${o}`, s, o);
  for (const [o, s] of Object.entries(e.colors)) {
    if (!s) continue;
    n(`colors.${o}.stock`, s.stock, "colors", o);
    const r = s.adjustment, c = "mask" in r ? [
      ["frame", r.frame],
      ["paper", r.paper],
      ...(r.regions ?? []).map(
        (l, p) => ["regions." + p + ".adjustment", l.adjustment]
      ),
      ...(r.accents ?? []).map(
        (l, p) => ["accents." + p + ".adjustment", l.adjustment]
      )
    ] : [["", r]];
    for (const [l, p] of c) {
      const u = `colors.${o}.adjustment${l ? "." + l : ""}`;
      for (const m of ["hueDegrees", "saturationScale", "brightnessScale", "valueGamma"])
        t(
          `${u}.${m}`,
          p[m] ?? (m === "hueDegrees" ? 0 : 1),
          "colors",
          o,
          m === "hueDegrees" ? -180 : m === "valueGamma" ? 0.5 : 0,
          m === "hueDegrees" ? 180 : m === "valueGamma" ? 2 : 3,
          m === "hueDegrees" ? 0.5 : 5e-3,
          m === "hueDegrees" ? "degrees" : "ratio"
        );
      i(`${u}.rgbScale`, p.rgbScale ?? [1, 1, 1], o, 3);
    }
    r.blackPoint && (i(`colors.${o}.adjustment.blackPoint.lift`, r.blackPoint.lift, o, 0.5), t(
      `colors.${o}.adjustment.blackPoint.transition`,
      r.blackPoint.transition,
      "colors",
      o,
      0.01,
      1,
      5e-3,
      "sRGB ratio"
    )), r.outerStock && i(`colors.${o}.adjustment.outerStock`, r.outerStock, o);
  }
  return a.map((o) => {
    const s = /^rulesAdjustments\.([^.]+)\.([^.]+)$/.exec(o.id);
    return !s || s[1] === "default" ? o : e.rulesAdjustments?.[s[1]]?.[s[2]] === void 0 ? { ...o, inheritedFrom: `rulesAdjustments.default.${s[2]}` } : o;
  });
}
function K({ lift: e, transition: a, texture: t }) {
  if (!Number.isFinite(a) || a <= 0 || a > 1 || e.length !== 3 || e.some((n) => !Number.isFinite(n) || n < 0 || n > a / 2))
    throw RangeError("Invalid frame black-point curve");
  if (t) {
    if (t.length < 2 || t.length > 16 || t[0]?.[0] !== 0 || t[0]?.[1].some((n) => n !== 0) || t.at(-1)?.[0] !== 1 || t.at(-1)?.[1].some((n) => n !== 0) || t.some(
      ([n, d]) => !Number.isFinite(n) || d.length !== 3 || d.some((i) => !Number.isFinite(i))
    ))
      throw RangeError("Invalid frame texture curve");
    for (let n = 1; n < t.length; n++) {
      const [d, i] = t[n - 1], [o, s] = t[n];
      if (o <= d || e.some(
        (r, c) => 1 - 2 * r / a * Math.max(0, 1 - d / a) + (s[c] - i[c]) / (o - d) < 0
      ))
        throw RangeError("Frame texture curve reverses contrast");
    }
  }
}
function de(e, a, t) {
  const n = a.transition * 255, d = new Float64Array(256 * 3);
  for (let i = 1; i < (a.texture?.length ?? 0); i++) {
    const [o, s] = a.texture[i - 1], [r, c] = a.texture[i];
    for (let l = Math.ceil(o * 255); l < r * 255; l++)
      for (let p = 0; p < 3; p++)
        d[l * 3 + p] = 255 * (s[p] + (c[p] - s[p]) * (l / 255 - o) / (r - o));
  }
  for (let i = 0; i < e.data.length; i += 4) {
    if (e.data[i + 3] === 0) continue;
    const o = Math.max(e.data[i], e.data[i + 1], e.data[i + 2]);
    if (o >= n && !a.texture) continue;
    const s = Math.max(0, 1 - o / n) ** 2;
    for (let r = 0; r < 3; r++)
      e.data[i + r] = Math.round(
        e.data[i + r] + 255 * a.lift[r] * s + d[o * 3 + r] * (t ? t.data[i + 3] / 255 : 1)
      );
  }
}
function y(e) {
  return e && typeof e == "object" && (Object.values(e).forEach(y), Object.freeze(e)), e;
}
function Q(e) {
  const a = e.toLowerCase(), t = k(a), n = x(a);
  return y({
    schema: 1,
    set: a,
    supported: !!(t || n),
    adapter: n ? "title" : "profile",
    revision: t?.revision ?? n?.revision ?? null,
    controls: t ? X(t) : n ? U(n) : [],
    notice: t ? "Ordinary old-frame plates only. Geometry, lettering, symbols and pigment use the native painter. Source assets and masks remain fixed." : n ? "Name and type controls use the native Alpha painter. Offsets are deltas from the existing shared placements. Frame, body, symbols and footer remain on their established calibration; full-profile editing is not available yet." : "This set does not yet have a consolidated profile adapter. Existing symbol and text diagnostic tools remain available."
  });
}
function W(e, a, t) {
  const n = Q(e);
  if (!n.supported || n.revision !== a)
    throw Error("Set calibration profile is unavailable or its revision changed");
  if (!t || typeof t != "object" || Array.isArray(t))
    throw Error("Calibration values must be a record");
  const d = new Map(n.controls.map((s) => [s.id, s])), i = {};
  for (const s of Object.keys(t).sort()) {
    const r = d.get(s), c = t[s];
    if (!r) throw Error("Unsupported calibration control: " + s);
    if (r.kind === "number" ? typeof c != "number" || !Number.isFinite(c) || c < r.min || c > r.max : r.kind === "boolean" ? typeof c != "boolean" : r.kind === "color" ? typeof c != "string" || !/^#[0-9a-f]{6}$/i.test(c) : typeof c != "string" || !r.options?.includes(c))
      throw Error("Invalid calibration value: " + s);
    const l = r.inheritedFrom && t[r.inheritedFrom];
    (c !== r.value || l !== void 0 && c !== l) && (i[s] = c);
  }
  const o = y({
    schema: 1,
    set: n.set,
    baseRevision: a,
    values: i
  });
  return x(e) || V(G(o)), o;
}
function S(e, a, t) {
  const n = a.split(".");
  let d = e;
  for (let i = 0; i < n.length - 1; i++) {
    const o = n[i];
    d[o] ??= /^\d+$/.test(n[i + 1]) ? [] : {}, d = d[o];
  }
  d[n.at(-1)] = t;
}
function G(e) {
  const a = k(e.set);
  if (!a) throw Error("This adapter exports title calibration; use exportSetTitleCalibration");
  const t = structuredClone(a);
  for (const n of Object.keys(e.values)) {
    if (!/\.rgbScale\.[012]$/.test(n)) continue;
    const d = n.split(".").slice(0, -1);
    let i = t;
    for (const o of d) i = i?.[o];
    if (!i) for (let o = 0; o < 3; o++) S(t, `${d.join(".")}.${o}`, 1);
  }
  for (const [n, d] of Object.entries(e.values)) S(t, n, d);
  for (const [n, d] of Object.entries(t.colors)) {
    if (!d) continue;
    const i = n.startsWith("L-") && !t.frames[n] ? "L" : n, o = t.frames[i], s = a.frames[i];
    if (!o || !s || !Object.keys(e.values).some((c) => c.startsWith(`frames.${i}.`)))
      continue;
    const r = JSON.parse(d.source);
    Array.isArray(r) && r.length === 2 && typeof r[0] == "string" && S(t, `colors.${n}.source`, JSON.stringify([r[0], o.frame]));
  }
  if (t.dualLand && Object.keys(e.values).some((n) => n.startsWith("frames.L-dual."))) {
    const n = t.frames["L-dual"];
    if (!n) throw Error("Dual-land calibration has no geometry");
    for (const [d, i] of Object.entries(t.dualLand.sources)) {
      if (!i) continue;
      const o = JSON.parse(i.source);
      if (!Array.isArray(o) || o.length !== 2 || typeof o[0] != "string")
        throw Error("Invalid dual-land material binding");
      S(t, `dualLand.sources.${d}.source`, JSON.stringify([o[0], n.frame]));
    }
  }
  return t;
}
function V(e) {
  for (const i of Object.values(e.frames))
    if (i?.artWindow) {
      const [o, s, r, c] = i.art, [l, p, u, m] = i.frame;
      if (o <= l || s <= p || o + r >= l + u || s + c >= p + m * i.artWindow.lowerAnchor)
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
  const t = e.bodyClasses;
  if (t && (t.bounds.width < 20 || t.bounds.height < 20 || !Number.isInteger(t.centered.maxCharacters) || !Number.isInteger(t.centered.maxLines) || t.centered.maxCharacters < 1 || t.centered.maxLines < 1 || t.centered.size <= 0 || t.compact.nominalMinimum <= 0 || t.compact.nominalMaximum <= t.compact.nominalMinimum || t.compact.size <= 0 || t.compact.leading <= 0 || t.typography.leading <= 0 || (t.typography.textWidth ?? 1) <= 0 || !Number.isFinite(t.typography.symbolOffsetY ?? 0) || Math.abs(t.typography.symbolOffsetY ?? 0) > 0.5))
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
function N(e) {
  if (!e || e.schema !== 1) throw Error("Unsupported calibration candidate schema");
  const a = JSON.stringify(e), t = P.get(e);
  if (t?.key === a) return t.profile;
  const n = W(
    e.set,
    e.baseRevision,
    e.values
  ), d = y(G(n));
  return P.set(e, { key: a, profile: d }), d;
}
function pe(e) {
  const a = N(e);
  return y({ ...structuredClone(a), revision: a.revision + 1 });
}
function R(e) {
  const a = x(e.set);
  if (!a) throw Error("This set has no title calibration adapter");
  const t = W(
    e.set,
    e.baseRevision,
    e.values
  ), n = { ...a, title: { ...a.title }, type: { ...a.type } };
  for (const [d, i] of Object.entries(t.values)) {
    const [o, s] = d.split(".");
    n[o][s] = i;
  }
  return y(n);
}
function me(e) {
  const a = R(e);
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
function B(e) {
  const a = e?.toLowerCase() ?? "";
  return !T.includes(a) && Object.hasOwn(w, a) ? w[a].donor : void 0;
}
function Z(e) {
  const a = e?.toLowerCase() ?? "", t = B(a) ? w[a] : void 0;
  return t && (t.palette === "ons" || Object.values(t.materialPalettes ?? {}).includes("ons")) ? "ons" : void 0;
}
function $(e) {
  const a = e.setCode?.toLowerCase() ?? "";
  if (!(a === "ice" || !B(a) || e.setCalibrationCandidate || e.calibration === "printing" || e.frameTemplate || e.frameAssetFamily || e.frameStyle === "modern" || e.faces?.length || e.layout && e.layout !== "normal" || e.borderColor && !["black", "white"].includes(e.borderColor) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "")))
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
  const t = k(a.donor);
  if (!t) return;
  const n = Z(e.setCode), d = n ? k(n) : void 0;
  if (n && !d) return;
  const i = e.setCode.toLowerCase(), o = e.borderColor === "white" ? "white" : e.borderColor === "black" ? "black" : a.border, s = o === a.border ? a.stock : o === "white" ? "#eeedeb" : "#181510", r = i + "/" + o + "/" + s;
  let c = F.get(t);
  c || (c = /* @__PURE__ */ new Map(), F.set(t, c));
  const l = c.get(r);
  if (l && l.palette === d) return l.profile;
  const p = parseInt(s.slice(1), 16), u = [(p >> 16) / 255, (p >> 8 & 255) / 255, (p & 255) / 255], m = {
    ...t,
    set: i,
    border: o,
    colors: Object.fromEntries(
      Object.entries(t.colors).map(([f, h]) => {
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
            stock: s,
            adjustment: o === "black" && b.outerStock ? { ...b, outerStock: u } : b
          }
        ];
      })
    ),
    footer: {
      ...t.footer,
      legal: { ...t.footer.legal, defaultText: void 0, collectorTotal: void 0 }
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
  return delete m.setSymbols, delete m.setSymbolSource, delete m.landMaterials, delete m.dualLand, c.set(r, { palette: d, profile: m }), m;
}
function he(e) {
  const a = e.setCalibrationCandidate;
  if (!a)
    return k(e.setCode) ?? oe(e) ?? ee(e);
  if (a.set !== e.setCode?.toLowerCase())
    throw Error("Calibration candidate belongs to another set");
  if (x(a.set)) {
    R(a);
    return;
  }
  return N(a);
}
function te(e) {
  return e.setCode?.toLowerCase() === "ice" && e.calibration !== "printing" && !e.frameTemplate && !e.frameAssetFamily && e.frameStyle !== "modern" && (!e.layout || e.layout === "normal") && (!e.borderColor || e.borderColor === "black") && (e.frameColors ?? e.colors ?? []).length <= 1 && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "");
}
const M = /* @__PURE__ */ new WeakMap();
function oe(e) {
  if (!te(e)) return;
  const a = k("4ed");
  if (!a) return;
  let t = M.get(a);
  return t || (t = {
    ...a,
    set: "ice",
    border: "black",
    colors: Object.fromEntries(
      Object.entries(a.colors).map(([n, d]) => [
        n,
        d && { ...d, stock: "#080808" }
      ])
    )
  }, M.set(a, t)), t;
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
  R as b,
  W as c,
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
  B as o,
  he as p,
  de as q,
  N as r,
  le as s,
  D as t,
  te as u,
  K as v,
  be as w,
  ue as x,
  x as y,
  k as z
};
