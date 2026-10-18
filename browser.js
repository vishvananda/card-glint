import { I as y, R as M, c as z } from "./renderer-DKLtQOl9.js";
import { c as L, a as S } from "./canvas-raster-B9HRvi4G.js";
import "./foil-preview-shader-rARa43Zn.js";
import { c as C } from "./asset-fetch-my9kgRsJ.js";
function x(e, u = [e.width, e.height]) {
  const [r, n] = u;
  if (![r, n].every((t) => Number.isSafeInteger(t) && t > 0))
    throw Error("Invalid native display raster size");
  const o = e.getContext("2d");
  if (!o) throw Error("Display raster requires a 2D output canvas");
  const i = document.createElement("canvas");
  i.width = r, i.height = n;
  let a = e.clientWidth, d = e.clientHeight, s;
  function g() {
    o.globalCompositeOperation = "copy", o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "high", o.drawImage(i, 0, 0, e.width, e.height);
  }
  function h() {
    const t = devicePixelRatio || 1, l = a > 0 && d > 0 ? Math.min(1, a * t / r, d * t / n) : 1, p = Math.max(1, Math.round(r * l)), w = Math.max(1, Math.round(n * l));
    (e.width !== p || e.height !== w) && (e.width = p, e.height = w, g());
  }
  const m = new ResizeObserver(([t]) => {
    t && (a = t.contentRect.width, d = t.contentRect.height, h());
  });
  function c() {
    s?.removeEventListener("change", c), s = matchMedia(`(resolution: ${devicePixelRatio || 1}dppx)`), s.addEventListener("change", c), h();
  }
  return m.observe(e), window.addEventListener("resize", h), c(), {
    source: i,
    present: g,
    dispose() {
      m.disconnect(), window.removeEventListener("resize", h), s.removeEventListener("change", c), i.width = i.height = 0;
    }
  };
}
const E = 1, R = 1, v = 1;
export {
  y as IDENTITY,
  M as Renderer,
  L as canvas,
  S as closeRaster,
  C as coverImage,
  x as createDisplayRaster,
  z as createRenderer,
  v as holofoilVersion,
  R as printSamplingVersion,
  E as rainFogVersion
};
