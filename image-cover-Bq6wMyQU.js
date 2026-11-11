let u = (o, r) => fetch(o, { ...r, mode: "cors" });
function A(o) {
  u = o;
}
function b(o, r) {
  return u(o, r);
}
function z(o) {
  if (!o || typeof o != "object" || Array.isArray(o)) throw Error("Invalid image fit");
  if (o.focalPoint !== void 0 && (!Array.isArray(o.focalPoint) || o.focalPoint.length !== 2 || !o.focalPoint.every((r) => Number.isFinite(r) && r >= 0 && r <= 1)))
    throw Error("Image focal point must be within 0..1");
  if (o.zoom !== void 0 && (!Number.isFinite(o.zoom) || o.zoom < 1 || o.zoom > 8))
    throw Error("Image zoom must be within 1..8");
}
function I(o, r, [e, a, t, n], s) {
  if (s && z(s), !(o > 0 && r > 0)) return [e, a, t, n];
  const i = Math.max(t / o, n / r) * (s?.zoom ?? 1), c = o * i, m = r * i, [l, f] = s?.focalPoint ?? [0.5, 0.5], v = l === 0.5 ? e + (t - c) / 2 : Math.max(e + t - c, Math.min(e, e + t / 2 - c * l)), h = f === 0.5 ? a + (n - m) / 2 : Math.max(a + n - m, Math.min(a, a + n / 2 - m * f));
  return [v, h, c, m];
}
export {
  I as c,
  b as f,
  A as s,
  z as v
};
