import { D as b, I as y, R as L, c as M } from "./renderer-BbFR5aiE.js";
import { c as S, a as T } from "./canvas-raster-B9HRvi4G.js";
import "./foil-preview-shader-rARa43Zn.js";
import { c as O } from "./asset-fetch-my9kgRsJ.js";
function x(e, u = [e.width, e.height]) {
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
const E = 1, R = 1, v = 1;
export {
  b as DEFAULT_PRINT_DOTS,
  y as IDENTITY,
  L as Renderer,
  S as canvas,
  T as closeRaster,
  O as coverImage,
  x as createDisplayRaster,
  M as createRenderer,
  v as holofoilVersion,
  R as printSamplingVersion,
  E as rainFogVersion
};
