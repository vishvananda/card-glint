import { c as i, a as m, r as c } from "./canvas-raster-DIqHyOj6.js";
import { d as p, s as d } from "./canvas-images-DWl3zt32.js";
import { c as v, s as f } from "./image-cover-Bq6wMyQU.js";
function t(s, a, r) {
  if (s.measureText(a).width <= r) return a;
  const e = [...a];
  for (; e.length && s.measureText(`${e.join("")}…`).width > r; ) e.pop();
  return e.length || s.measureText("…").width <= r ? `${e.join("")}…` : "";
}
export {
  i as canvas,
  m as closeRaster,
  v as coverImage,
  p as decodeCanvasImage,
  t as ellipsizedText,
  c as rasterCanvas,
  f as setAssetFetcher,
  d as sizedCanvasSvg
};
