import { t as g, p as x } from "./registry-Cg8tIhk4.js";
const k = g("setTitleCalibrations");
function p(r) {
  return r?.toLowerCase() === "lea" ? k.lea : void 0;
}
function S(r) {
  return Object.entries(r.title).map(([o, n]) => ({
    id: `title.${o}`,
    label: `name · ${o === "dx" ? "horizontal offset" : o === "dy" ? "vertical offset" : o}`,
    group: "lettering",
    scope: "all",
    kind: "number",
    value: n,
    min: o === "dx" || o === "dy" ? -30 : o === "width" ? 0.6 : o === "size" ? 8 : 0,
    max: o === "dx" || o === "dy" ? 30 : o === "gray" ? 255 : o === "size" ? 60 : o === "width" ? 1.5 : 4,
    step: o === "gray" ? 1 : 0.05,
    unit: o === "width" ? "ratio" : o === "gray" ? "sRGB 0–255" : "px"
  }));
}
const w = g("setCalibrationProfiles");
function v(r) {
  const o = r?.toLowerCase() ?? "";
  return x.includes(o) ? w[o] : void 0;
}
function O(r) {
  const o = [], n = (e, s, t, a, f, u, b, m = "px") => {
    o.push({
      id: e,
      label: e.split(".").slice(a === "all" ? 0 : 2).join(" · "),
      value: s,
      group: t,
      scope: a,
      kind: "number",
      min: f,
      max: u,
      step: b,
      unit: m
    });
  }, i = (e, s, t, a, f) => o.push({
    id: e,
    label: e.split(".").slice(2).join(" · "),
    value: s,
    group: t,
    scope: a,
    kind: typeof s == "boolean" ? "boolean" : f ? "choice" : "color",
    options: f
  });
  for (const [e, s] of Object.entries(r.frames))
    if (s)
      for (const t of ["frame", "art", "stockWindow"])
        s[t].forEach(
          (a, f) => n(
            `frames.${e}.${t}.${f}`,
            a,
            "frame",
            e,
            f < 2 ? -0.15 : 0.05,
            1.3,
            5e-4,
            "card fraction"
          )
        );
  n(
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
    const s = e.startsWith("footer.") ? r.footer[e.slice(7)] : r[e];
    for (const [t, a] of Object.entries(s)) {
      const f = /gray/i.test(t), u = t === "width";
      n(
        `${e}.${t}`,
        a,
        e.startsWith("footer") ? "footer" : "lettering",
        "all",
        t === "x" || t === "y" ? 0 : u ? 0.6 : 0,
        t === "x" ? 488 : t === "y" ? 680 : f ? 255 : t === "size" ? 60 : u ? 1.5 : 4,
        f ? 1 : 0.05,
        u ? "ratio" : f ? "sRGB 0–255" : "px"
      );
    }
  }
  const l = r.mana.geometry;
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
    const s = /scale/i.test(e);
    n(
      `mana.geometry.${e}`,
      l[e] ?? (s ? 1 : 0),
      "symbols",
      "all",
      s ? 0.7 : -12,
      s ? 1.4 : 12,
      s ? 5e-3 : 0.25,
      s ? "ratio" : "px"
    );
  }
  for (const e of ["W", "U", "B", "R", "G"])
    for (const s of ["dx", "dy", "scale"])
      n(
        `mana.geometry.glyphs.${e}.${s}`,
        l.glyphs?.[e]?.[s] ?? (s === "scale" ? 1 : 0),
        "symbols",
        e,
        s === "scale" ? 0.5 : -6,
        s === "scale" ? 1.5 : 6,
        s === "scale" ? 5e-3 : 0.25,
        s === "scale" ? "ratio" : "px"
      );
  for (const [e, s] of Object.entries(r.setSymbols ?? {}))
    if (s)
      for (const t of ["right", "centerY", "width", "height", "outline"])
        n(
          `setSymbols.${e}.${t}`,
          s[t] ?? 0,
          "symbols",
          e,
          t === "width" || t === "height" ? 1 : 0,
          t === "right" ? 488 : t === "centerY" ? 680 : t === "outline" ? 6 : 100,
          0.25
        );
  for (const e of ["default", ...Object.keys(r.frames)]) {
    const s = { ...r.rulesAdjustments?.default, ...r.rulesAdjustments?.[e] };
    i(`rulesAdjustments.${e}.alignment`, s?.alignment ?? "printing", "body", e, [
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
      const a = ["textWidth", "leading", "paragraphGap", "flavorGap"].includes(t), f = t === "fontSize" ? 4 : a ? 0.3 : 24;
      n(
        `rulesAdjustments.${e}.${t}`,
        s?.[t] ?? 0,
        "body",
        e,
        -f,
        f,
        a ? 5e-3 : 0.25,
        a ? "ratio delta" : "px delta"
      );
    }
  }
  for (const [e, s] of Object.entries(r.body ?? {}))
    if (s) {
      for (const [t, a] of Object.entries(s.bounds))
        n(
          `body.${e}.bounds.${t}`,
          a,
          "body",
          e,
          0,
          t === "y" || t === "height" ? 680 : 488,
          0.25
        );
      for (const t of ["minimumSize", "maximumSize"])
        n(`body.${e}.${t}`, s[t], "body", e, 6, 48, 0.25);
      for (const [t, a] of Object.entries(s.typography))
        typeof a == "number" ? n(
          `body.${e}.typography.${t}`,
          a,
          "body",
          e,
          t === "centerOffset" ? -20 : 0,
          t === "centerOffset" ? 20 : 3,
          0.01,
          "ratio"
        ) : typeof a == "boolean" && i(`body.${e}.typography.${t}`, a, "body", e);
      if (s.centered)
        for (const [t, a] of Object.entries(s.centered))
          n(
            `body.${e}.centered.${t}`,
            a,
            "body",
            e,
            0,
            t === "maxCharacters" ? 1e3 : t === "maxLines" ? 30 : 48,
            t === "maximumSize" ? 0.25 : 1
          );
    }
  const c = (e, s, t, a = 1) => s.forEach((f, u) => n(`${e}.${u}`, f, "colors", t, 0, a, 5e-3, "sRGB ratio"));
  c("mana.ink", r.mana.ink, "all");
  for (const [e, s] of Object.entries(r.mana.paper))
    s && c(`mana.paper.${e}`, s, e);
  for (const [e, s] of Object.entries(r.colors)) {
    if (!s) continue;
    i(`colors.${e}.stock`, s.stock, "colors", e);
    const t = s.adjustment, a = "mask" in t ? [
      ["frame", t.frame],
      ["paper", t.paper]
    ] : [["", t]];
    for (const [f, u] of a) {
      const b = `colors.${e}.adjustment${f ? "." + f : ""}`;
      for (const m of ["hueDegrees", "saturationScale", "brightnessScale", "valueGamma"])
        n(
          `${b}.${m}`,
          u[m] ?? (m === "hueDegrees" ? 0 : 1),
          "colors",
          e,
          m === "hueDegrees" ? -180 : m === "valueGamma" ? 0.5 : 0,
          m === "hueDegrees" ? 180 : m === "valueGamma" ? 2 : 3,
          m === "hueDegrees" ? 0.5 : 5e-3,
          m === "hueDegrees" ? "degrees" : "ratio"
        );
      c(`${b}.rgbScale`, u.rgbScale ?? [1, 1, 1], e, 3);
    }
    t.blackPoint && (c(`colors.${e}.adjustment.blackPoint.lift`, t.blackPoint.lift, e, 0.5), n(
      `colors.${e}.adjustment.blackPoint.transition`,
      t.blackPoint.transition,
      "colors",
      e,
      0.01,
      1,
      5e-3,
      "sRGB ratio"
    )), t.outerStock && c(`colors.${e}.adjustment.outerStock`, t.outerStock, e);
  }
  return o.map((e) => {
    const s = /^rulesAdjustments\.([^.]+)\.([^.]+)$/.exec(e.id);
    return !s || s[1] === "default" ? e : r.rulesAdjustments?.[s[1]]?.[s[2]] === void 0 ? { ...e, inheritedFrom: `rulesAdjustments.default.${s[2]}` } : e;
  });
}
function C({ lift: r, transition: o, texture: n }) {
  if (!Number.isFinite(o) || o <= 0 || o > 1 || r.length !== 3 || r.some((i) => !Number.isFinite(i) || i < 0 || i > o / 2))
    throw RangeError("Invalid frame black-point curve");
  if (n) {
    if (n.length < 2 || n.length > 16 || n[0]?.[0] !== 0 || n[0]?.[1].some((i) => i !== 0) || n.at(-1)?.[0] !== 1 || n.at(-1)?.[1].some((i) => i !== 0) || n.some(
      ([i, l]) => !Number.isFinite(i) || l.length !== 3 || l.some((c) => !Number.isFinite(c))
    ))
      throw RangeError("Invalid frame texture curve");
    for (let i = 1; i < n.length; i++) {
      const [l, c] = n[i - 1], [e, s] = n[i];
      if (e <= l || r.some(
        (t, a) => 1 - 2 * t / o * Math.max(0, 1 - l / o) + (s[a] - c[a]) / (e - l) < 0
      ))
        throw RangeError("Frame texture curve reverses contrast");
    }
  }
}
function G(r, o, n) {
  const i = o.transition * 255, l = new Float64Array(256 * 3);
  for (let c = 1; c < (o.texture?.length ?? 0); c++) {
    const [e, s] = o.texture[c - 1], [t, a] = o.texture[c];
    for (let f = Math.ceil(e * 255); f < t * 255; f++)
      for (let u = 0; u < 3; u++)
        l[f * 3 + u] = 255 * (s[u] + (a[u] - s[u]) * (f / 255 - e) / (t - e));
  }
  for (let c = 0; c < r.data.length; c += 4) {
    if (r.data[c + 3] === 0) continue;
    const e = Math.max(r.data[c], r.data[c + 1], r.data[c + 2]);
    if (e >= i && !o.texture) continue;
    const s = Math.max(0, 1 - e / i) ** 2;
    for (let t = 0; t < 3; t++)
      r.data[c + t] = Math.round(
        r.data[c + t] + 255 * o.lift[t] * s + l[e * 3 + t] * (n ? n.data[c + 3] / 255 : 1)
      );
  }
}
const R = 1;
function d(r) {
  return r && typeof r == "object" && (Object.values(r).forEach(d), Object.freeze(r)), r;
}
function A(r) {
  const o = r.toLowerCase(), n = v(o), i = p(o);
  return d({
    schema: 1,
    set: o,
    supported: !!(n || i),
    adapter: i ? "title" : "profile",
    revision: n?.revision ?? i?.revision ?? null,
    controls: n ? O(n) : i ? S(i) : [],
    notice: n ? "Ordinary ABU/Fourth plates only. Geometry, lettering, symbols and pigment use the native painter. Source assets and masks remain fixed." : i ? "Name controls use the native Alpha painter. Offsets are deltas from the existing shared title placement. Frame, type, body, symbols and footer remain on their established calibration; full-profile editing is not available yet." : "This set does not yet have a consolidated profile adapter. Existing symbol and text diagnostic tools remain available."
  });
}
function $(r, o, n) {
  const i = A(r);
  if (!i.supported || i.revision !== o)
    throw Error("Set calibration profile is unavailable or its revision changed");
  if (!n || typeof n != "object" || Array.isArray(n))
    throw Error("Calibration values must be a record");
  const l = new Map(i.controls.map((s) => [s.id, s])), c = {};
  for (const s of Object.keys(n).sort()) {
    const t = l.get(s), a = n[s];
    if (!t) throw Error("Unsupported calibration control: " + s);
    if (t.kind === "number" ? typeof a != "number" || !Number.isFinite(a) || a < t.min || a > t.max : t.kind === "boolean" ? typeof a != "boolean" : t.kind === "color" ? typeof a != "string" || !/^#[0-9a-f]{6}$/i.test(a) : typeof a != "string" || !t.options?.includes(a))
      throw Error("Invalid calibration value: " + s);
    const f = t.inheritedFrom && n[t.inheritedFrom];
    (a !== t.value || f !== void 0 && a !== f) && (c[s] = a);
  }
  const e = d({
    schema: 1,
    set: i.set,
    baseRevision: o,
    values: c
  });
  return p(r) || E(j(e)), e;
}
function h(r, o, n) {
  const i = o.split(".");
  let l = r;
  for (let c = 0; c < i.length - 1; c++) {
    const e = i[c];
    l[e] ??= /^\d+$/.test(i[c + 1]) ? [] : {}, l = l[e];
  }
  l[i.at(-1)] = n;
}
function j(r) {
  const o = v(r.set);
  if (!o) throw Error("This adapter exports title calibration; use exportSetTitleCalibration");
  const n = structuredClone(o);
  for (const i of Object.keys(r.values)) {
    if (!/\.rgbScale\.[012]$/.test(i)) continue;
    const l = i.split(".").slice(0, -1);
    let c = n;
    for (const e of l) c = c?.[e];
    if (!c) for (let e = 0; e < 3; e++) h(n, `${l.join(".")}.${e}`, 1);
  }
  for (const [i, l] of Object.entries(r.values)) h(n, i, l);
  for (const [i, l] of Object.entries(n.colors)) {
    if (!l) continue;
    const c = i.startsWith("L-") && !n.frames[i] ? "L" : i, e = n.frames[c], s = o.frames[c];
    if (!e || !s || !Object.keys(r.values).some((a) => a.startsWith(`frames.${c}.`)))
      continue;
    const t = JSON.parse(l.source);
    Array.isArray(t) && t.length === 2 && typeof t[0] == "string" && h(n, `colors.${i}.source`, JSON.stringify([t[0], e.frame]));
  }
  return n;
}
function E(r) {
  for (const o of Object.values(r.body ?? {}))
    if (o && (o.minimumSize <= 0 || o.maximumSize < o.minimumSize || o.bounds.width < 20 || o.bounds.height < 20 || o.typography.leading <= 0 || (o.typography.textWidth ?? 1) <= 0))
      throw Error("Invalid body bounds or typography range");
  for (const o of Object.values(r.colors))
    o?.adjustment.blackPoint && C(o.adjustment.blackPoint);
}
const y = /* @__PURE__ */ new WeakMap();
function z(r) {
  if (!r || r.schema !== 1) throw Error("Unsupported calibration candidate schema");
  const o = JSON.stringify(r), n = y.get(r);
  if (n?.key === o) return n.profile;
  const i = $(
    r.set,
    r.baseRevision,
    r.values
  ), l = d(j(i));
  return y.set(r, { key: o, profile: l }), l;
}
function W(r) {
  const o = z(r);
  return d({ ...structuredClone(o), revision: o.revision + 1 });
}
function F(r) {
  const o = p(r.set);
  if (!o) throw Error("This set has no title calibration adapter");
  const n = $(
    r.set,
    r.baseRevision,
    r.values
  ), i = { ...o.title };
  for (const [l, c] of Object.entries(n.values)) {
    const e = l.slice(6);
    i[e] = c;
  }
  return d({ ...o, title: i });
}
function N(r) {
  const o = F(r);
  return d({ ...o, revision: o.revision + 1 });
}
export {
  N as a,
  F as b,
  $ as c,
  A as d,
  W as e,
  v as f,
  p as g,
  G as h,
  z as r,
  R as s,
  C as v
};
