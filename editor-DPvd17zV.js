import { t as g, p as x } from "./registry-Cg8tIhk4.js";
const S = g("setTitleCalibrations");
function p(r) {
  return r?.toLowerCase() === "lea" ? S.lea : void 0;
}
function w(r) {
  return ["title", "type"].flatMap(
    (n) => Object.entries(r[n]).map(([o, i]) => ({
      id: `${n}.${o}`,
      label: `${n === "title" ? "name" : "type"} · ${o === "dx" ? "horizontal offset" : o === "dy" ? "vertical offset" : o}`,
      group: "lettering",
      scope: "all",
      kind: "number",
      value: i,
      min: o === "wordSpacing" ? -6 : o === "dx" || o === "dy" ? -30 : o === "width" ? 0.6 : o === "size" ? 8 : 0,
      max: o === "wordSpacing" ? 6 : o === "dx" || o === "dy" ? 30 : o === "gray" ? 255 : o === "size" ? 60 : o === "width" ? 1.5 : 4,
      step: o === "width" ? 1e-3 : o === "gray" ? 1 : 0.05,
      unit: o === "width" ? "ratio" : o === "gray" ? "sRGB 0–255" : "px"
    }))
  );
}
const k = g("setCalibrationProfiles");
function v(r) {
  const n = r?.toLowerCase() ?? "";
  return x.includes(n) ? k[n] : void 0;
}
function O(r) {
  const n = [], o = (t, s, e, a, f, u, b, d = "px") => {
    n.push({
      id: t,
      label: t.split(".").slice(a === "all" ? 0 : 2).join(" · "),
      value: s,
      group: e,
      scope: a,
      kind: "number",
      min: f,
      max: u,
      step: b,
      unit: d
    });
  }, i = (t, s, e, a, f) => n.push({
    id: t,
    label: t.split(".").slice(2).join(" · "),
    value: s,
    group: e,
    scope: a,
    kind: typeof s == "boolean" ? "boolean" : f ? "choice" : "color",
    options: f
  });
  for (const [t, s] of Object.entries(r.frames))
    if (s)
      for (const e of ["frame", "art", "stockWindow"])
        s[e].forEach(
          (a, f) => o(
            `frames.${t}.${e}.${f}`,
            a,
            "frame",
            t,
            f < 2 ? -0.15 : 0.05,
            1.3,
            5e-4,
            "card fraction"
          )
        );
  o(
    "cornerRadius",
    r.cornerRadius ?? 0.045,
    "frame",
    "all",
    0.01,
    0.09,
    1e-3,
    "card width"
  );
  for (const t of ["title", "type", "footer.artist", "footer.legal", "footer.stats"]) {
    const s = t.startsWith("footer.") ? r.footer[t.slice(7)] : r[t];
    for (const [e, a] of Object.entries(s)) {
      const f = /gray/i.test(e), u = e === "width";
      o(
        `${t}.${e}`,
        a,
        t.startsWith("footer") ? "footer" : "lettering",
        "all",
        e === "x" || e === "y" ? 0 : u ? 0.6 : 0,
        e === "x" ? 488 : e === "y" ? 680 : f ? 255 : e === "size" ? 60 : u ? 1.5 : 4,
        f ? 1 : 0.05,
        u ? "ratio" : f ? "sRGB 0–255" : "px"
      );
    }
  }
  const l = r.mana.geometry;
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
    const s = /scale/i.test(t);
    o(
      `mana.geometry.${t}`,
      l[t] ?? (s ? 1 : 0),
      "symbols",
      "all",
      s ? 0.7 : -12,
      s ? 1.4 : 12,
      s ? 5e-3 : 0.25,
      s ? "ratio" : "px"
    );
  }
  for (const t of ["W", "U", "B", "R", "G"])
    for (const s of ["dx", "dy", "scale"])
      o(
        `mana.geometry.glyphs.${t}.${s}`,
        l.glyphs?.[t]?.[s] ?? (s === "scale" ? 1 : 0),
        "symbols",
        t,
        s === "scale" ? 0.5 : -6,
        s === "scale" ? 1.5 : 6,
        s === "scale" ? 5e-3 : 0.25,
        s === "scale" ? "ratio" : "px"
      );
  for (const [t, s] of Object.entries(r.setSymbols ?? {}))
    if (s)
      for (const e of ["right", "centerY", "width", "height", "outline"])
        o(
          `setSymbols.${t}.${e}`,
          s[e] ?? 0,
          "symbols",
          t,
          e === "width" || e === "height" ? 1 : 0,
          e === "right" ? 488 : e === "centerY" ? 680 : e === "outline" ? 6 : 100,
          0.25
        );
  for (const t of ["default", ...Object.keys(r.frames)]) {
    const s = { ...r.rulesAdjustments?.default, ...r.rulesAdjustments?.[t] };
    i(`rulesAdjustments.${t}.alignment`, s?.alignment ?? "printing", "body", t, [
      "printing",
      "left",
      "center"
    ]);
    for (const e of [
      "leftMargin",
      "rightMargin",
      "vertical",
      "fontSize",
      "textWidth",
      "leading",
      "paragraphGap",
      "flavorGap"
    ]) {
      const a = ["textWidth", "leading", "paragraphGap", "flavorGap"].includes(e), f = e === "fontSize" ? 4 : a ? 0.3 : 24;
      o(
        `rulesAdjustments.${t}.${e}`,
        s?.[e] ?? 0,
        "body",
        t,
        -f,
        f,
        a ? 5e-3 : 0.25,
        a ? "ratio delta" : "px delta"
      );
    }
  }
  for (const [t, s] of Object.entries(r.body ?? {}))
    if (s) {
      for (const [e, a] of Object.entries(s.bounds))
        o(
          `body.${t}.bounds.${e}`,
          a,
          "body",
          t,
          0,
          e === "y" || e === "height" ? 680 : 488,
          0.25
        );
      for (const e of ["minimumSize", "maximumSize"])
        o(`body.${t}.${e}`, s[e], "body", t, 6, 48, 0.25);
      for (const [e, a] of Object.entries(s.typography))
        typeof a == "number" ? o(
          `body.${t}.typography.${e}`,
          a,
          "body",
          t,
          e === "centerOffset" ? -20 : 0,
          e === "centerOffset" ? 20 : 3,
          0.01,
          "ratio"
        ) : typeof a == "boolean" && i(`body.${t}.typography.${e}`, a, "body", t);
      if (s.centered)
        for (const [e, a] of Object.entries(s.centered))
          o(
            `body.${t}.centered.${e}`,
            a,
            "body",
            t,
            0,
            e === "maxCharacters" ? 1e3 : e === "maxLines" ? 30 : 48,
            e === "maximumSize" ? 0.25 : 1
          );
    }
  const c = (t, s, e, a = 1) => s.forEach((f, u) => o(`${t}.${u}`, f, "colors", e, 0, a, 5e-3, "sRGB ratio"));
  c("mana.ink", r.mana.ink, "all");
  for (const [t, s] of Object.entries(r.mana.paper))
    s && c(`mana.paper.${t}`, s, t);
  for (const [t, s] of Object.entries(r.colors)) {
    if (!s) continue;
    i(`colors.${t}.stock`, s.stock, "colors", t);
    const e = s.adjustment, a = "mask" in e ? [
      ["frame", e.frame],
      ["paper", e.paper]
    ] : [["", e]];
    for (const [f, u] of a) {
      const b = `colors.${t}.adjustment${f ? "." + f : ""}`;
      for (const d of ["hueDegrees", "saturationScale", "brightnessScale", "valueGamma"])
        o(
          `${b}.${d}`,
          u[d] ?? (d === "hueDegrees" ? 0 : 1),
          "colors",
          t,
          d === "hueDegrees" ? -180 : d === "valueGamma" ? 0.5 : 0,
          d === "hueDegrees" ? 180 : d === "valueGamma" ? 2 : 3,
          d === "hueDegrees" ? 0.5 : 5e-3,
          d === "hueDegrees" ? "degrees" : "ratio"
        );
      c(`${b}.rgbScale`, u.rgbScale ?? [1, 1, 1], t, 3);
    }
    e.blackPoint && (c(`colors.${t}.adjustment.blackPoint.lift`, e.blackPoint.lift, t, 0.5), o(
      `colors.${t}.adjustment.blackPoint.transition`,
      e.blackPoint.transition,
      "colors",
      t,
      0.01,
      1,
      5e-3,
      "sRGB ratio"
    )), e.outerStock && c(`colors.${t}.adjustment.outerStock`, e.outerStock, t);
  }
  return n.map((t) => {
    const s = /^rulesAdjustments\.([^.]+)\.([^.]+)$/.exec(t.id);
    return !s || s[1] === "default" ? t : r.rulesAdjustments?.[s[1]]?.[s[2]] === void 0 ? { ...t, inheritedFrom: `rulesAdjustments.default.${s[2]}` } : t;
  });
}
function C({ lift: r, transition: n, texture: o }) {
  if (!Number.isFinite(n) || n <= 0 || n > 1 || r.length !== 3 || r.some((i) => !Number.isFinite(i) || i < 0 || i > n / 2))
    throw RangeError("Invalid frame black-point curve");
  if (o) {
    if (o.length < 2 || o.length > 16 || o[0]?.[0] !== 0 || o[0]?.[1].some((i) => i !== 0) || o.at(-1)?.[0] !== 1 || o.at(-1)?.[1].some((i) => i !== 0) || o.some(
      ([i, l]) => !Number.isFinite(i) || l.length !== 3 || l.some((c) => !Number.isFinite(c))
    ))
      throw RangeError("Invalid frame texture curve");
    for (let i = 1; i < o.length; i++) {
      const [l, c] = o[i - 1], [t, s] = o[i];
      if (t <= l || r.some(
        (e, a) => 1 - 2 * e / n * Math.max(0, 1 - l / n) + (s[a] - c[a]) / (t - l) < 0
      ))
        throw RangeError("Frame texture curve reverses contrast");
    }
  }
}
function G(r, n, o) {
  const i = n.transition * 255, l = new Float64Array(256 * 3);
  for (let c = 1; c < (n.texture?.length ?? 0); c++) {
    const [t, s] = n.texture[c - 1], [e, a] = n.texture[c];
    for (let f = Math.ceil(t * 255); f < e * 255; f++)
      for (let u = 0; u < 3; u++)
        l[f * 3 + u] = 255 * (s[u] + (a[u] - s[u]) * (f / 255 - t) / (e - t));
  }
  for (let c = 0; c < r.data.length; c += 4) {
    if (r.data[c + 3] === 0) continue;
    const t = Math.max(r.data[c], r.data[c + 1], r.data[c + 2]);
    if (t >= i && !n.texture) continue;
    const s = Math.max(0, 1 - t / i) ** 2;
    for (let e = 0; e < 3; e++)
      r.data[c + e] = Math.round(
        r.data[c + e] + 255 * n.lift[e] * s + l[t * 3 + e] * (o ? o.data[c + 3] / 255 : 1)
      );
  }
}
const R = 1;
function m(r) {
  return r && typeof r == "object" && (Object.values(r).forEach(m), Object.freeze(r)), r;
}
function A(r) {
  const n = r.toLowerCase(), o = v(n), i = p(n);
  return m({
    schema: 1,
    set: n,
    supported: !!(o || i),
    adapter: i ? "title" : "profile",
    revision: o?.revision ?? i?.revision ?? null,
    controls: o ? O(o) : i ? w(i) : [],
    notice: o ? "Ordinary ABU/Fourth plates only. Geometry, lettering, symbols and pigment use the native painter. Source assets and masks remain fixed." : i ? "Name and type controls use the native Alpha painter. Offsets are deltas from the existing shared placements. Frame, body, symbols and footer remain on their established calibration; full-profile editing is not available yet." : "This set does not yet have a consolidated profile adapter. Existing symbol and text diagnostic tools remain available."
  });
}
function $(r, n, o) {
  const i = A(r);
  if (!i.supported || i.revision !== n)
    throw Error("Set calibration profile is unavailable or its revision changed");
  if (!o || typeof o != "object" || Array.isArray(o))
    throw Error("Calibration values must be a record");
  const l = new Map(i.controls.map((s) => [s.id, s])), c = {};
  for (const s of Object.keys(o).sort()) {
    const e = l.get(s), a = o[s];
    if (!e) throw Error("Unsupported calibration control: " + s);
    if (e.kind === "number" ? typeof a != "number" || !Number.isFinite(a) || a < e.min || a > e.max : e.kind === "boolean" ? typeof a != "boolean" : e.kind === "color" ? typeof a != "string" || !/^#[0-9a-f]{6}$/i.test(a) : typeof a != "string" || !e.options?.includes(a))
      throw Error("Invalid calibration value: " + s);
    const f = e.inheritedFrom && o[e.inheritedFrom];
    (a !== e.value || f !== void 0 && a !== f) && (c[s] = a);
  }
  const t = m({
    schema: 1,
    set: i.set,
    baseRevision: n,
    values: c
  });
  return p(r) || E(j(t)), t;
}
function h(r, n, o) {
  const i = n.split(".");
  let l = r;
  for (let c = 0; c < i.length - 1; c++) {
    const t = i[c];
    l[t] ??= /^\d+$/.test(i[c + 1]) ? [] : {}, l = l[t];
  }
  l[i.at(-1)] = o;
}
function j(r) {
  const n = v(r.set);
  if (!n) throw Error("This adapter exports title calibration; use exportSetTitleCalibration");
  const o = structuredClone(n);
  for (const i of Object.keys(r.values)) {
    if (!/\.rgbScale\.[012]$/.test(i)) continue;
    const l = i.split(".").slice(0, -1);
    let c = o;
    for (const t of l) c = c?.[t];
    if (!c) for (let t = 0; t < 3; t++) h(o, `${l.join(".")}.${t}`, 1);
  }
  for (const [i, l] of Object.entries(r.values)) h(o, i, l);
  for (const [i, l] of Object.entries(o.colors)) {
    if (!l) continue;
    const c = i.startsWith("L-") && !o.frames[i] ? "L" : i, t = o.frames[c], s = n.frames[c];
    if (!t || !s || !Object.keys(r.values).some((a) => a.startsWith(`frames.${c}.`)))
      continue;
    const e = JSON.parse(l.source);
    Array.isArray(e) && e.length === 2 && typeof e[0] == "string" && h(o, `colors.${i}.source`, JSON.stringify([e[0], t.frame]));
  }
  return o;
}
function E(r) {
  for (const n of Object.values(r.body ?? {}))
    if (n && (n.minimumSize <= 0 || n.maximumSize < n.minimumSize || n.bounds.width < 20 || n.bounds.height < 20 || n.typography.leading <= 0 || (n.typography.textWidth ?? 1) <= 0))
      throw Error("Invalid body bounds or typography range");
  for (const n of Object.values(r.colors))
    n?.adjustment.blackPoint && C(n.adjustment.blackPoint);
}
const y = /* @__PURE__ */ new WeakMap();
function z(r) {
  if (!r || r.schema !== 1) throw Error("Unsupported calibration candidate schema");
  const n = JSON.stringify(r), o = y.get(r);
  if (o?.key === n) return o.profile;
  const i = $(
    r.set,
    r.baseRevision,
    r.values
  ), l = m(j(i));
  return y.set(r, { key: n, profile: l }), l;
}
function W(r) {
  const n = z(r);
  return m({ ...structuredClone(n), revision: n.revision + 1 });
}
function F(r) {
  const n = p(r.set);
  if (!n) throw Error("This set has no title calibration adapter");
  const o = $(
    r.set,
    r.baseRevision,
    r.values
  ), i = { ...n, title: { ...n.title }, type: { ...n.type } };
  for (const [l, c] of Object.entries(o.values)) {
    const [t, s] = l.split(".");
    i[t][s] = c;
  }
  return m(i);
}
function M(r) {
  const n = F(r);
  return m({ ...n, revision: n.revision + 1 });
}
export {
  M as a,
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
