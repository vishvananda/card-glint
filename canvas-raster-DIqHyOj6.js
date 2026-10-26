function a(r = [300, 150]) {
  const [t, e] = r;
  if (!Number.isInteger(t) || !Number.isInteger(e) || t < 1 || e < 1 || t * e > 4194304)
    throw RangeError("Invalid raster size");
  if (typeof document < "u") return o(r);
  if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(t, e);
  throw Error("Canvas2D preparation requires a document or OffscreenCanvas");
}
function i(r) {
  if ("getContext" in r) return r;
  const t = a([r.width, r.height]);
  try {
    const e = t.getContext("2d");
    if (!e) throw Error("Canvas2D raster unavailable");
    return e.drawImage(r, 0, 0), t;
  } catch (e) {
    throw s(t), e;
  } finally {
    r.close();
  }
}
function o(r) {
  const [t, e] = r;
  if (!Number.isInteger(t) || !Number.isInteger(e) || t < 1 || e < 1 || t * e > 4194304)
    throw RangeError("Invalid raster size");
  const n = document.createElement("canvas");
  return n.width = t, n.height = e, n;
}
async function f(r, t = !1) {
  if ("close" in r) return r;
  if ("transferToImageBitmap" in r)
    try {
      return r.transferToImageBitmap();
    } finally {
      s(r);
    }
  if (t)
    try {
      return await createImageBitmap(r);
    } finally {
      s(r);
    }
  return r;
}
function s(r) {
  "close" in r ? r.close() : r.width = r.height = 0;
}
export {
  s as a,
  o as c,
  f,
  i as m,
  a as r
};
