import { D as L, I as b, P as y, R as M, c as P, p as S } from "./renderer-ER8PRpsi.js";
import { c as N, a as _ } from "./canvas-raster-DIqHyOj6.js";
import "./foil-preview-shader-C-MhLK3-.js";
import { c as O } from "./image-cover-Bq6wMyQU.js";
function R(e, u = [e.width, e.height]) {
  const [r, n] = u;
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
    const t = devicePixelRatio || 1, l = c > 0 && d > 0 ? Math.min(1, c * t / r, d * t / n) : 1, p = Math.max(1, Math.round(r * l)), w = Math.max(1, Math.round(n * l));
    (e.width !== p || e.height !== w) && (e.width = p, e.height = w, g());
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
const f = 1, x = 1, D = 1, I = 1;
export {
  L as DEFAULT_PRINT_DOTS,
  b as IDENTITY,
  y as PRINT_DOTS_REFERENCE_WIDTH,
  M as Renderer,
  N as canvas,
  _ as closeRaster,
  O as coverImage,
  R as createDisplayRaster,
  P as createRenderer,
  D as holofoilVersion,
  I as normalLightingVersion,
  S as printDotPeriodForWidth,
  x as printSamplingVersion,
  f as rainFogVersion
};
