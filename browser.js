import { D as L, I as b, P as M, R as P, c as S, p as z } from "./renderer-DVzhsa7e.js";
import { c as V, a as _ } from "./canvas-raster-DIqHyOj6.js";
import "./foil-preview-shader-DZ1KA2NA.js";
import { c as O } from "./image-cover-Bq6wMyQU.js";
function f(e, w = [e.width, e.height]) {
  const [r, n] = w;
  if (![r, n].every((t) => Number.isSafeInteger(t) && t > 0))
    throw Error("Invalid native display raster size");
  const o = e.getContext("2d");
  if (!o) throw Error("Display raster requires a 2D output canvas");
  const i = document.createElement("canvas");
  i.width = r, i.height = n;
  let c = e.clientWidth, d = e.clientHeight, s;
  function g() {
    o.globalCompositeOperation = "copy", o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "high", o.drawImage(i, 0, 0, e.width, e.height);
  }
  function h() {
    const t = devicePixelRatio || 1, l = c > 0 && d > 0 ? Math.min(1, c * t / r, d * t / n) : 1, p = Math.max(1, Math.round(r * l)), u = Math.max(1, Math.round(n * l));
    (e.width !== p || e.height !== u) && (e.width = p, e.height = u, g());
  }
  const m = new ResizeObserver(([t]) => {
    t && (c = t.contentRect.width, d = t.contentRect.height, h());
  });
  function a() {
    s?.removeEventListener("change", a), s = matchMedia(`(resolution: ${devicePixelRatio || 1}dppx)`), s.addEventListener("change", a), h();
  }
  return m.observe(e), window.addEventListener("resize", h), a(), {
    source: i,
    present: g,
    dispose() {
      m.disconnect(), window.removeEventListener("resize", h), s.removeEventListener("change", a), i.width = i.height = 0;
    }
  };
}
const R = 1, x = 1, D = 1, I = 1, v = 1;
export {
  L as DEFAULT_PRINT_DOTS,
  b as IDENTITY,
  M as PRINT_DOTS_REFERENCE_WIDTH,
  P as Renderer,
  V as canvas,
  _ as closeRaster,
  O as coverImage,
  f as createDisplayRaster,
  S as createRenderer,
  v as finishQualityVersion,
  D as holofoilVersion,
  I as normalLightingVersion,
  z as printDotPeriodForWidth,
  x as printSamplingVersion,
  R as rainFogVersion
};
