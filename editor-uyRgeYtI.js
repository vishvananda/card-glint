import { t as k, p as $ } from "./registry-Cg8tIhk4.js";
const j = k("setCalibrationProfiles");
function p(r) {
  const n = r?.toLowerCase() ?? "";
  return $.includes(n) ? j[n] : void 0;
}
function v(r) {
  const n = [], s = (e, o, t, a, f, u, b, m = "px") => {
    n.push({
      id: e,
      label: e.split(".").slice(a === "all" ? 0 : 2).join(" · "),
      value: o,
      group: t,
      scope: a,
      kind: "number",
      min: f,
      max: u,
      step: b,
      unit: m
    });
  }, i = (e, o, t, a, f) => n.push({
    id: e,
    label: e.split(".").slice(2).join(" · "),
    value: o,
    group: t,
    scope: a,
    kind: typeof o == "boolean" ? "boolean" : f ? "choice" : "color",
    options: f
  });
  for (const [e, o] of Object.entries(r.frames))
    if (o)
      for (const t of ["frame", "art", "stockWindow"])
        o[t].forEach(
          (a, f) => s(
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
    for (const [t, a] of Object.entries(o)) {
      const f = /gray/i.test(t), u = t === "width";
      s(
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
    const o = /scale/i.test(e);
    s(
      `mana.geometry.${e}`,
      l[e] ?? (o ? 1 : 0),
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
        l.glyphs?.[e]?.[o] ?? (o === "scale" ? 1 : 0),
        "symbols",
        e,
        o === "scale" ? 0.5 : -6,
        o === "scale" ? 1.5 : 6,
        o === "scale" ? 5e-3 : 0.25,
        o === "scale" ? "ratio" : "px"
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
    i(`rulesAdjustments.${e}.alignment`, o?.alignment ?? "printing", "body", e, [
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
      s(
        `rulesAdjustments.${e}.${t}`,
        o?.[t] ?? 0,
        "body",
        e,
        -f,
        f,
        a ? 5e-3 : 0.25,
        a ? "ratio delta" : "px delta"
      );
    }
  }
  for (const [e, o] of Object.entries(r.body ?? {}))
    if (o) {
      for (const [t, a] of Object.entries(o.bounds))
        s(
          `body.${e}.bounds.${t}`,
          a,
          "body",
          e,
          0,
          t === "y" || t === "height" ? 680 : 488,
          0.25
        );
      for (const t of ["minimumSize", "maximumSize"])
        s(`body.${e}.${t}`, o[t], "body", e, 6, 48, 0.25);
      for (const [t, a] of Object.entries(o.typography))
        typeof a == "number" ? s(
          `body.${e}.typography.${t}`,
          a,
          "body",
          e,
          t === "centerOffset" ? -20 : 0,
          t === "centerOffset" ? 20 : 3,
          0.01,
          "ratio"
        ) : typeof a == "boolean" && i(`body.${e}.typography.${t}`, a, "body", e);
      if (o.centered)
        for (const [t, a] of Object.entries(o.centered))
          s(
            `body.${e}.centered.${t}`,
            a,
            "body",
            e,
            0,
            t === "maxCharacters" ? 1e3 : t === "maxLines" ? 30 : 48,
            t === "maximumSize" ? 0.25 : 1
          );
    }
  const c = (e, o, t, a = 1) => o.forEach((f, u) => s(`${e}.${u}`, f, "colors", t, 0, a, 5e-3, "sRGB ratio"));
  c("mana.ink", r.mana.ink, "all");
  for (const [e, o] of Object.entries(r.mana.paper))
    o && c(`mana.paper.${e}`, o, e);
  for (const [e, o] of Object.entries(r.colors)) {
    if (!o) continue;
    i(`colors.${e}.stock`, o.stock, "colors", e);
    const t = o.adjustment, a = "mask" in t ? [
      ["frame", t.frame],
      ["paper", t.paper]
    ] : [["", t]];
    for (const [f, u] of a) {
      const b = `colors.${e}.adjustment${f ? "." + f : ""}`;
      for (const m of ["hueDegrees", "saturationScale", "brightnessScale", "valueGamma"])
        s(
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
    t.blackPoint && (c(`colors.${e}.adjustment.blackPoint.lift`, t.blackPoint.lift, e, 0.5), s(
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
  return n.map((e) => {
    const o = /^rulesAdjustments\.([^.]+)\.([^.]+)$/.exec(e.id);
    return !o || o[1] === "default" ? e : r.rulesAdjustments?.[o[1]]?.[o[2]] === void 0 ? { ...e, inheritedFrom: `rulesAdjustments.default.${o[2]}` } : e;
  });
}
function x({ lift: r, transition: n, texture: s }) {
  if (!Number.isFinite(n) || n <= 0 || n > 1 || r.length !== 3 || r.some((i) => !Number.isFinite(i) || i < 0 || i > n / 2))
    throw RangeError("Invalid frame black-point curve");
  if (s) {
    if (s.length < 2 || s.length > 16 || s[0]?.[0] !== 0 || s[0]?.[1].some((i) => i !== 0) || s.at(-1)?.[0] !== 1 || s.at(-1)?.[1].some((i) => i !== 0) || s.some(
      ([i, l]) => !Number.isFinite(i) || l.length !== 3 || l.some((c) => !Number.isFinite(c))
    ))
      throw RangeError("Invalid frame texture curve");
    for (let i = 1; i < s.length; i++) {
      const [l, c] = s[i - 1], [e, o] = s[i];
      if (e <= l || r.some(
        (t, a) => 1 - 2 * t / n * Math.max(0, 1 - l / n) + (o[a] - c[a]) / (e - l) < 0
      ))
        throw RangeError("Frame texture curve reverses contrast");
    }
  }
}
function P(r, n, s) {
  const i = n.transition * 255, l = new Float64Array(256 * 3);
  for (let c = 1; c < (n.texture?.length ?? 0); c++) {
    const [e, o] = n.texture[c - 1], [t, a] = n.texture[c];
    for (let f = Math.ceil(e * 255); f < t * 255; f++)
      for (let u = 0; u < 3; u++)
        l[f * 3 + u] = 255 * (o[u] + (a[u] - o[u]) * (f / 255 - e) / (t - e));
  }
  for (let c = 0; c < r.data.length; c += 4) {
    if (r.data[c + 3] === 0) continue;
    const e = Math.max(r.data[c], r.data[c + 1], r.data[c + 2]);
    if (e >= i && !n.texture) continue;
    const o = Math.max(0, 1 - e / i) ** 2;
    for (let t = 0; t < 3; t++)
      r.data[c + t] = Math.round(
        r.data[c + t] + 255 * n.lift[t] * o + l[e * 3 + t] * (s ? s.data[c + 3] / 255 : 1)
      );
  }
}
const E = 1;
function d(r) {
  return r && typeof r == "object" && (Object.values(r).forEach(d), Object.freeze(r)), r;
}
function S(r) {
  const n = r.toLowerCase(), s = p(n);
  return d({
    schema: 1,
    set: n,
    supported: !!s,
    revision: s?.revision ?? null,
    controls: s ? v(s) : [],
    notice: s ? "Ordinary ABU/Fourth plates only. Geometry, lettering, symbols and pigment use the native painter. Source assets and masks remain fixed." : "This set does not yet have a consolidated profile adapter. Existing symbol and text diagnostic tools remain available."
  });
}
function O(r, n, s) {
  const i = S(r);
  if (!i.supported || i.revision !== n)
    throw Error("Set calibration profile is unavailable or its revision changed");
  if (!s || typeof s != "object" || Array.isArray(s))
    throw Error("Calibration values must be a record");
  const l = new Map(i.controls.map((o) => [o.id, o])), c = {};
  for (const o of Object.keys(s).sort()) {
    const t = l.get(o), a = s[o];
    if (!t) throw Error("Unsupported calibration control: " + o);
    if (t.kind === "number" ? typeof a != "number" || !Number.isFinite(a) || a < t.min || a > t.max : t.kind === "boolean" ? typeof a != "boolean" : t.kind === "color" ? typeof a != "string" || !/^#[0-9a-f]{6}$/i.test(a) : typeof a != "string" || !t.options?.includes(a))
      throw Error("Invalid calibration value: " + o);
    const f = t.inheritedFrom && s[t.inheritedFrom];
    (a !== t.value || f !== void 0 && a !== f) && (c[o] = a);
  }
  const e = d({
    schema: 1,
    set: i.set,
    baseRevision: n,
    values: c
  });
  return w(g(e)), e;
}
function y(r, n, s) {
  const i = n.split(".");
  let l = r;
  for (let c = 0; c < i.length - 1; c++) {
    const e = i[c];
    l[e] ??= /^\d+$/.test(i[c + 1]) ? [] : {}, l = l[e];
  }
  l[i.at(-1)] = s;
}
function g(r) {
  const n = p(r.set), s = structuredClone(n);
  for (const i of Object.keys(r.values)) {
    if (!/\.rgbScale\.[012]$/.test(i)) continue;
    const l = i.split(".").slice(0, -1);
    let c = s;
    for (const e of l) c = c?.[e];
    if (!c) for (let e = 0; e < 3; e++) y(s, `${l.join(".")}.${e}`, 1);
  }
  for (const [i, l] of Object.entries(r.values)) y(s, i, l);
  for (const [i, l] of Object.entries(s.colors)) {
    if (!l) continue;
    const c = i.startsWith("L-") && !s.frames[i] ? "L" : i, e = s.frames[c], o = n.frames[c];
    if (!e || !o || !Object.keys(r.values).some((a) => a.startsWith(`frames.${c}.`)))
      continue;
    const t = JSON.parse(l.source);
    Array.isArray(t) && t.length === 2 && typeof t[0] == "string" && y(s, `colors.${i}.source`, JSON.stringify([t[0], e.frame]));
  }
  return s;
}
function w(r) {
  for (const n of Object.values(r.body ?? {}))
    if (n && (n.minimumSize <= 0 || n.maximumSize < n.minimumSize || n.bounds.width < 20 || n.bounds.height < 20 || n.typography.leading <= 0 || (n.typography.textWidth ?? 1) <= 0))
      throw Error("Invalid body bounds or typography range");
  for (const n of Object.values(r.colors))
    n?.adjustment.blackPoint && x(n.adjustment.blackPoint);
}
const h = /* @__PURE__ */ new WeakMap();
function C(r) {
  if (!r || r.schema !== 1) throw Error("Unsupported calibration candidate schema");
  const n = JSON.stringify(r), s = h.get(r);
  if (s?.key === n) return s.profile;
  const i = O(
    r.set,
    r.baseRevision,
    r.values
  ), l = d(g(i));
  return h.set(r, { key: n, profile: l }), l;
}
function F(r) {
  const n = C(r);
  return d({ ...structuredClone(n), revision: n.revision + 1 });
}
export {
  p as a,
  P as b,
  O as c,
  S as d,
  F as e,
  C as r,
  E as s,
  x as v
};
