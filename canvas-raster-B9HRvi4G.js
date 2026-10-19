function s(e) {
  const [t, r] = e;
  if (!Number.isInteger(t) || !Number.isInteger(r) || t < 1 || r < 1 || t * r > 4194304)
    throw RangeError("Invalid raster size");
  const n = document.createElement("canvas");
  return n.width = t, n.height = r, n;
}
function i(e) {
  e.width = e.height = 0;
}
export {
  i as a,
  s as c
};
