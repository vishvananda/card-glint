import { t as g, p as j } from "./modern-style-scope-CRCOLok6.js";
const k = g("setTitleCalibrations");
function h(r) {
  return r?.toLowerCase() === "lea" ? k.lea : void 0;
}
function w(r) {
  return ["title", "type"].flatMap(
    (n) => Object.entries(r[n]).map(([s, a]) => ({
      id: `${n}.${s}`,
      label: `${n === "title" ? "name" : "type"} · ${s === "dx" ? "horizontal offset" : s === "dy" ? "vertical offset" : s}`,
      group: "lettering",
      scope: "all",
      kind: "number",
      value: a,
      min: s === "wordSpacing" ? -6 : s === "dx" || s === "dy" ? -30 : s === "width" ? 0.6 : s === "size" ? 8 : 0,
      max: s === "wordSpacing" ? 6 : s === "dx" || s === "dy" ? 30 : s === "gray" ? 255 : s === "size" ? 60 : s === "width" ? 1.5 : 4,
      step: s === "width" ? 1e-3 : s === "gray" ? 1 : 0.05,
      unit: s === "width" ? "ratio" : s === "gray" ? "sRGB 0–255" : "px"
    }))
  );
}
const O = g("setCalibrationProfiles");
function v(r) {
  const n = r?.toLowerCase() ?? "";
  return j.includes(n) ? O[n] : void 0;
}
function S(r) {
  const n = r.dualLand;
  if (!n) return [];
  const s = [
    {
      id: "dualLand.stock",
      label: "Dual land · outer stock",
      value: n.stock,
      kind: "color",
      group: "colors",
      scope: "L-dual"
    }
  ], a = (i, e, o, t, l, f, u = "L-dual") => s.push({
    id: i,
    label: i.split(".").slice(1).join(" · "),
    value: e,
    kind: "number",
    group: i.startsWith("dualLand.pinline.box") || i.startsWith("dualLand.pinline.width") ? "frame" : "colors",
    scope: u,
    min: o,
    max: t,
    step: l,
    unit: f
  });
  for (const i of ["box", "width"])
    for (const [e, o] of Object.entries(n.pinline[i]))
      a(
        `dualLand.pinline.${i}.${e}`,
        o,
        0,
        i === "width" ? 80 : e === "top" || e === "bottom" ? 2100 : 1500,
        0.25,
        "source px"
      );
  const c = (i, e, o) => e.forEach((t, l) => a(`${i}.${l}`, t, 0, 1, 5e-3, "sRGB ratio", o));
  for (const [i, e] of Object.entries(n.pinline.palette))
    e && c(`dualLand.pinline.palette.${i}`, e, i);
  n.pinline.edge && c("dualLand.pinline.edge", n.pinline.edge, "L-dual");
  for (const [i, e] of Object.entries(n.sources)) {
    if (!e) continue;
    const o = e.adjustment, t = "mask" in o ? [
      ["frame", o.frame],
      ["paper", o.paper]
    ] : [["", o]];
    for (const [l, f] of t)
      for (const u of [
        "hueDegrees",
        "saturationScale",
        "brightnessScale",
        "valueGamma"
      ]) {
        const m = u === "hueDegrees";
        a(
          `dualLand.sources.${i}.adjustment${l ? "." + l : ""}.${u}`,
          f[u] ?? (m ? 0 : 1),
          m ? -180 : u === "valueGamma" ? 0.5 : 0,
          m ? 180 : u === "valueGamma" ? 2 : 3,
          m ? 0.5 : 5e-3,
          m ? "degrees" : "ratio",
          i
        );
      }
  }
  return s;
}
function C(r) {
  const n = [], s = (e, o, t, l, f, u, m, d = "px") => {
    n.push({
      id: e,
      label: e.split(".").slice(l === "all" ? 0 : 2).join(" · "),
      value: o,
      group: t,
      scope: l,
      kind: "number",
      min: f,
      max: u,
      step: m,
      unit: d
    });
  }, a = (e, o, t, l, f) => n.push({
    id: e,
    label: e.split(".").slice(2).join(" · "),
    value: o,
    group: t,
    scope: l,
    kind: typeof o == "boolean" ? "boolean" : f ? "choice" : "color",
    options: f
  });
  for (const [e, o] of Object.entries(r.frames))
    if (o)
      for (const t of [
        "frame",
        "art",
        o.stockMaskFrame ? "stockMaskFrame" : "stockWindow"
      ])
        o[t].forEach(
          (l, f) => s(
            `frames.${e}.${t}.${f}`,
            l,
            "frame",
            e,
            f < 2 ? -0.15 : 0.05,
            1.3,
            5e-4,
            "card fraction"
          )
        );
  s(
    "cornerRadius",
    r.cornerRadius ?? 0.045,
    "frame",
    "all",
    0.01,
    0.09,
    1e-3,
    "card width"
  );
  for (const e of ["title", "type", "footer.artist", "footer.legal", "footer.stats"]) {
    const o = e.startsWith("footer.") ? r.footer[e.slice(7)] : r[e];
    for (const [t, l] of Object.entries(o)) {
      if (typeof l != "number") continue;
      const f = /gray/i.test(t), u = t === "width";
      s(
        `${e}.${t}`,
        l,
        e.startsWith("footer") ? "footer" : "lettering",
        "all",
        t === "x" || t === "y" ? 0 : u ? 0.6 : 0,
        t === "x" || t === "maxWidth" ? 488 : t === "y" ? 680 : f ? 255 : t === "size" ? 60 : u ? 1.5 : 4,
        f ? 1 : 0.05,
        u ? "ratio" : f ? "sRGB 0–255" : "px"
      );
    }
  }
  if (r.footer.artist.align !== void 0 && a("footer.artist.align", r.footer.artist.align, "footer", "all", [
    "left",
    "center",
    "right"
  ]), r.footer.artist.baseline !== void 0 && a("footer.artist.baseline", r.footer.artist.baseline, "footer", "all", [
    "alphabetic",
    "middle",
    "top",
    "bottom"
  ]), r.textTiers) {
    for (const [e, o] of Object.entries(r.textTiers))
      if (typeof o == "boolean") a(`textTiers.${e}`, o, "body", "all");
      else if (typeof o == "number") {
        const t = e === "denseWidth", l = ["largeMaximum", "mediumMaximum", "retainRegularAboveLines"].includes(e);
        s(
          `textTiers.${e}`,
          o,
          "body",
          "all",
          t ? 0.7 : l ? 1 : -24,
          t ? 1.3 : l ? 1e3 : 488,
          t ? 5e-3 : l ? 1 : 0.25,
          t ? "ratio" : l ? "count" : "px"
        );
      }
  }
  r.footer.stats.baseline !== void 0 && a("footer.stats.baseline", r.footer.stats.baseline, "footer", "all", [
    "alphabetic",
    "middle"
  ]), n.push(...S(r));
  const c = r.mana.geometry;
  for (const e of [
    "dx",
    "dy",
    "scaleX",
    "scaleY",
    "spacing",
    "numberScale",
    "numberDx",
    "numberDy"
  ]) {
    const o = /scale/i.test(e);
    s(
      `mana.geometry.${e}`,
      c[e] ?? (o ? 1 : 0),
      "symbols",
      "all",
      o ? 0.7 : -12,
      o ? 1.4 : 12,
      o ? 5e-3 : 0.25,
      o ? "ratio" : "px"
    );
  }
  for (const e of ["W", "U", "B", "R", "G"])
    for (const o of ["dx", "dy", "scale"])
      s(
        `mana.geometry.glyphs.${e}.${o}`,
        c.glyphs?.[e]?.[o] ?? (o === "scale" ? 1 : 0),
        "symbols",
        e,
        o === "scale" ? 0.5 : -6,
        o === "scale" ? 1.5 : 6,
        o === "scale" ? 5e-3 : 0.25,
        o === "scale" ? "ratio" : "px"
      );
  for (const [e, o] of Object.entries(r.mana.sourceInk ?? {}))
    o && s(
      `mana.sourceInk.${e}.pixels`,
      o.pixels,
      "symbols",
      e,
      0,
      1,
      0.05,
      "px per 24px disc"
    );
  for (const [e, o] of Object.entries(r.setSymbols ?? {}))
    if (o)
      for (const t of ["right", "centerY", "width", "height", "outline"])
        s(
          `setSymbols.${e}.${t}`,
          o[t] ?? 0,
          "symbols",
          e,
          t === "width" || t === "height" ? 1 : 0,
          t === "right" ? 488 : t === "centerY" ? 680 : t === "outline" ? 6 : 100,
          0.25
        );
  for (const e of ["default", ...Object.keys(r.frames)]) {
    const o = { ...r.rulesAdjustments?.default, ...r.rulesAdjustments?.[e] };
    a(`rulesAdjustments.${e}.alignment`, o?.alignment ?? "printing", "body", e, [
      "printing",
      "left",
      "center"
    ]);
    for (const t of [
      "leftMargin",
      "rightMargin",
      "vertical",
      "fontSize",
      "textWidth",
      "leading",
      "paragraphGap",
      "flavorGap"
    ]) {
      const l = ["textWidth", "leading", "paragraphGap", "flavorGap"].includes(t), f = t === "fontSize" ? 4 : l ? 0.3 : 24;
      s(
        `rulesAdjustments.${e}.${t}`,
        o?.[t] ?? 0,
        "body",
        e,
        -f,
        f,
        l ? 5e-3 : 0.25,
        l ? "ratio delta" : "px delta"
      );
    }
  }
  for (const [e, o] of Object.entries(r.body ?? {}))
    if (o) {
      for (const [t, l] of Object.entries(o.bounds))
        s(
          `body.${e}.bounds.${t}`,
          l,
          "body",
          e,
          0,
          t === "y" || t === "height" ? 680 : 488,
          0.25
        );
      for (const t of ["minimumSize", "maximumSize"])
        s(`body.${e}.${t}`, o[t], "body", e, 6, 48, 0.25);
      for (const [t, l] of Object.entries(o.typography))
        typeof l == "number" ? s(
          `body.${e}.typography.${t}`,
          l,
          "body",
          e,
          t === "centerOffset" ? -20 : 0,
          t === "centerOffset" ? 20 : 3,
          0.01,
          "ratio"
        ) : typeof l == "boolean" && a(`body.${e}.typography.${t}`, l, "body", e);
      if (o.centered)
        for (const [t, l] of Object.entries(o.centered))
          s(
            `body.${e}.centered.${t}`,
            l,
            "body",
            e,
            0,
            t === "maxCharacters" ? 1e3 : t === "maxLines" ? 30 : 48,
            t === "maximumSize" ? 0.25 : 1
          );
    }
  const i = (e, o, t, l = 1) => o.forEach((f, u) => s(`${e}.${u}`, f, "colors", t, 0, l, 5e-3, "sRGB ratio"));
  i("mana.ink", r.mana.ink, "all");
  for (const [e, o] of Object.entries(r.mana.paper))
    o && i(`mana.paper.${e}`, o, e);
  for (const [e, o] of Object.entries(r.colors)) {
    if (!o) continue;
    a(`colors.${e}.stock`, o.stock, "colors", e);
    const t = o.adjustment, l = "mask" in t ? [
      ["frame", t.frame],
      ["paper", t.paper]
    ] : [["", t]];
    for (const [f, u] of l) {
      const m = `colors.${e}.adjustment${f ? "." + f : ""}`;
      for (const d of ["hueDegrees", "saturationScale", "brightnessScale", "valueGamma"])
        s(
          `${m}.${d}`,
          u[d] ?? (d === "hueDegrees" ? 0 : 1),
          "colors",
          e,
          d === "hueDegrees" ? -180 : d === "valueGamma" ? 0.5 : 0,
          d === "hueDegrees" ? 180 : d === "valueGamma" ? 2 : 3,
          d === "hueDegrees" ? 0.5 : 5e-3,
          d === "hueDegrees" ? "degrees" : "ratio"
        );
      i(`${m}.rgbScale`, u.rgbScale ?? [1, 1, 1], e, 3);
    }
    t.blackPoint && (i(`colors.${e}.adjustment.blackPoint.lift`, t.blackPoint.lift, e, 0.5), s(
      `colors.${e}.adjustment.blackPoint.transition`,
      t.blackPoint.transition,
      "colors",
      e,
      0.01,
      1,
      5e-3,
      "sRGB ratio"
    )), t.outerStock && i(`colors.${e}.adjustment.outerStock`, t.outerStock, e);
  }
  return n.map((e) => {
    const o = /^rulesAdjustments\.([^.]+)\.([^.]+)$/.exec(e.id);
    return !o || o[1] === "default" ? e : r.rulesAdjustments?.[o[1]]?.[o[2]] === void 0 ? { ...e, inheritedFrom: `rulesAdjustments.default.${o[2]}` } : e;
  });
}
function L({ lift: r, transition: n, texture: s }) {
  if (!Number.isFinite(n) || n <= 0 || n > 1 || r.length !== 3 || r.some((a) => !Number.isFinite(a) || a < 0 || a > n / 2))
    throw RangeError("Invalid frame black-point curve");
  if (s) {
    if (s.length < 2 || s.length > 16 || s[0]?.[0] !== 0 || s[0]?.[1].some((a) => a !== 0) || s.at(-1)?.[0] !== 1 || s.at(-1)?.[1].some((a) => a !== 0) || s.some(
      ([a, c]) => !Number.isFinite(a) || c.length !== 3 || c.some((i) => !Number.isFinite(i))
    ))
      throw RangeError("Invalid frame texture curve");
    for (let a = 1; a < s.length; a++) {
      const [c, i] = s[a - 1], [e, o] = s[a];
      if (e <= c || r.some(
        (t, l) => 1 - 2 * t / n * Math.max(0, 1 - c / n) + (o[l] - i[l]) / (e - c) < 0
      ))
        throw RangeError("Frame texture curve reverses contrast");
    }
  }
}
function T(r, n, s) {
  const a = n.transition * 255, c = new Float64Array(256 * 3);
  for (let i = 1; i < (n.texture?.length ?? 0); i++) {
    const [e, o] = n.texture[i - 1], [t, l] = n.texture[i];
    for (let f = Math.ceil(e * 255); f < t * 255; f++)
      for (let u = 0; u < 3; u++)
        c[f * 3 + u] = 255 * (o[u] + (l[u] - o[u]) * (f / 255 - e) / (t - e));
  }
  for (let i = 0; i < r.data.length; i += 4) {
    if (r.data[i + 3] === 0) continue;
    const e = Math.max(r.data[i], r.data[i + 1], r.data[i + 2]);
    if (e >= a && !n.texture) continue;
    const o = Math.max(0, 1 - e / a) ** 2;
    for (let t = 0; t < 3; t++)
      r.data[i + t] = Math.round(
        r.data[i + t] + 255 * n.lift[t] * o + c[e * 3 + t] * (s ? s.data[i + 3] / 255 : 1)
      );
  }
}
const W = 1;
function b(r) {
  return r && typeof r == "object" && (Object.values(r).forEach(b), Object.freeze(r)), r;
}
function A(r) {
  const n = r.toLowerCase(), s = v(n), a = h(n);
  return b({
    schema: 1,
    set: n,
    supported: !!(s || a),
    adapter: a ? "title" : "profile",
    revision: s?.revision ?? a?.revision ?? null,
    controls: s ? C(s) : a ? w(a) : [],
    notice: s ? "Ordinary ABU/Fourth plates only. Geometry, lettering, symbols and pigment use the native painter. Source assets and masks remain fixed." : a ? "Name and type controls use the native Alpha painter. Offsets are deltas from the existing shared placements. Frame, body, symbols and footer remain on their established calibration; full-profile editing is not available yet." : "This set does not yet have a consolidated profile adapter. Existing symbol and text diagnostic tools remain available."
  });
}
function $(r, n, s) {
  const a = A(r);
  if (!a.supported || a.revision !== n)
    throw Error("Set calibration profile is unavailable or its revision changed");
  if (!s || typeof s != "object" || Array.isArray(s))
    throw Error("Calibration values must be a record");
  const c = new Map(a.controls.map((o) => [o.id, o])), i = {};
  for (const o of Object.keys(s).sort()) {
    const t = c.get(o), l = s[o];
    if (!t) throw Error("Unsupported calibration control: " + o);
    if (t.kind === "number" ? typeof l != "number" || !Number.isFinite(l) || l < t.min || l > t.max : t.kind === "boolean" ? typeof l != "boolean" : t.kind === "color" ? typeof l != "string" || !/^#[0-9a-f]{6}$/i.test(l) : typeof l != "string" || !t.options?.includes(l))
      throw Error("Invalid calibration value: " + o);
    const f = t.inheritedFrom && s[t.inheritedFrom];
    (l !== t.value || f !== void 0 && l !== f) && (i[o] = l);
  }
  const e = b({
    schema: 1,
    set: a.set,
    baseRevision: n,
    values: i
  });
  return h(r) || E(x(e)), e;
}
function p(r, n, s) {
  const a = n.split(".");
  let c = r;
  for (let i = 0; i < a.length - 1; i++) {
    const e = a[i];
    c[e] ??= /^\d+$/.test(a[i + 1]) ? [] : {}, c = c[e];
  }
  c[a.at(-1)] = s;
}
function x(r) {
  const n = v(r.set);
  if (!n) throw Error("This adapter exports title calibration; use exportSetTitleCalibration");
  const s = structuredClone(n);
  for (const a of Object.keys(r.values)) {
    if (!/\.rgbScale\.[012]$/.test(a)) continue;
    const c = a.split(".").slice(0, -1);
    let i = s;
    for (const e of c) i = i?.[e];
    if (!i) for (let e = 0; e < 3; e++) p(s, `${c.join(".")}.${e}`, 1);
  }
  for (const [a, c] of Object.entries(r.values)) p(s, a, c);
  for (const [a, c] of Object.entries(s.colors)) {
    if (!c) continue;
    const i = a.startsWith("L-") && !s.frames[a] ? "L" : a, e = s.frames[i], o = n.frames[i];
    if (!e || !o || !Object.keys(r.values).some((l) => l.startsWith(`frames.${i}.`)))
      continue;
    const t = JSON.parse(c.source);
    Array.isArray(t) && t.length === 2 && typeof t[0] == "string" && p(s, `colors.${a}.source`, JSON.stringify([t[0], e.frame]));
  }
  if (s.dualLand && Object.keys(r.values).some((a) => a.startsWith("frames.L-dual."))) {
    const a = s.frames["L-dual"];
    if (!a) throw Error("Dual-land calibration has no geometry");
    for (const [c, i] of Object.entries(s.dualLand.sources)) {
      if (!i) continue;
      const e = JSON.parse(i.source);
      if (!Array.isArray(e) || e.length !== 2 || typeof e[0] != "string")
        throw Error("Invalid dual-land material binding");
      p(s, `dualLand.sources.${c}.source`, JSON.stringify([e[0], a.frame]));
    }
  }
  return s;
}
function E(r) {
  for (const n of Object.values(r.body ?? {}))
    if (n && (n.minimumSize <= 0 || n.maximumSize < n.minimumSize || n.bounds.width < 20 || n.bounds.height < 20 || n.typography.leading <= 0 || (n.typography.textWidth ?? 1) <= 0))
      throw Error("Invalid body bounds or typography range");
  for (const n of [
    ...Object.values(r.colors),
    ...Object.values(r.dualLand?.sources ?? {})
  ])
    n?.adjustment.blackPoint && L(n.adjustment.blackPoint);
  if (r.textTiers?.retainRegularAboveLines !== void 0 && (!Number.isInteger(r.textTiers.retainRegularAboveLines) || r.textTiers.retainRegularAboveLines < 1))
    throw Error("Invalid regular density limit");
}
const y = /* @__PURE__ */ new WeakMap();
function G(r) {
  if (!r || r.schema !== 1) throw Error("Unsupported calibration candidate schema");
  const n = JSON.stringify(r), s = y.get(r);
  if (s?.key === n) return s.profile;
  const a = $(
    r.set,
    r.baseRevision,
    r.values
  ), c = b(x(a));
  return y.set(r, { key: n, profile: c }), c;
}
function z(r) {
  const n = G(r);
  return b({ ...structuredClone(n), revision: n.revision + 1 });
}
function F(r) {
  const n = h(r.set);
  if (!n) throw Error("This set has no title calibration adapter");
  const s = $(
    r.set,
    r.baseRevision,
    r.values
  ), a = { ...n, title: { ...n.title }, type: { ...n.type } };
  for (const [c, i] of Object.entries(s.values)) {
    const [e, o] = c.split(".");
    a[e][o] = i;
  }
  return b(a);
}
function P(r) {
  const n = F(r);
  return b({ ...n, revision: n.revision + 1 });
}
export {
  P as a,
  F as b,
  $ as c,
  A as d,
  z as e,
  T as f,
  v as g,
  h,
  G as r,
  W as s,
  L as v
};
