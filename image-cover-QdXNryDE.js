function b(o) {
  if (!o || typeof o != "object" || Array.isArray(o)) throw Error("Invalid image fit");
  if (o.focalPoint !== void 0 && (!Array.isArray(o.focalPoint) || o.focalPoint.length !== 2 || !o.focalPoint.every((a) => Number.isFinite(a) && a >= 0 && a <= 1)))
    throw Error("Image focal point must be within 0..1");
  if (o.zoom !== void 0 && (!Number.isFinite(o.zoom) || o.zoom < 1 || o.zoom > 8))
    throw Error("Image zoom must be within 1..8");
}
function f(o, a, [r, n, e, m], t) {
  if (t && b(t), !(o > 0 && a > 0)) return [r, n, e, m];
  const s = Math.max(e / o, m / a) * (t?.zoom ?? 1), i = o * s, c = a * s, [l, u] = t?.focalPoint ?? [0.5, 0.5], v = l === 0.5 ? r + (e - i) / 2 : Math.max(r + e - i, Math.min(r, r + e / 2 - i * l)), z = u === 0.5 ? n + (m - c) / 2 : Math.max(n + m - c, Math.min(n, n + m / 2 - c * u));
  return [v, z, i, c];
}
export {
  f as c,
  b as v
};
