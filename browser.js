import { I as b, R as y, c as M } from "./renderer-CJKS71lE.js";
import { canvas as D, closeRaster as L } from "./raster-8MSDN7In.js";
import { c as V } from "./image-cover-QdXNryDE.js";
function f(e, u = [e.width, e.height]) {
  const [r, n] = u;
  if (![r, n].every((t) => Number.isSafeInteger(t) && t > 0))
    throw Error("Invalid native display raster size");
  const o = e.getContext("2d");
  if (!o) throw Error("Display raster requires a 2D output canvas");
  const i = document.createElement("canvas");
  i.width = r, i.height = n;
  let d = e.clientWidth, a = e.clientHeight, h;
  function g() {
    o.globalCompositeOperation = "copy", o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "high", o.drawImage(i, 0, 0, e.width, e.height);
  }
  function s() {
    const t = devicePixelRatio || 1, l = d > 0 && a > 0 ? Math.min(1, d * t / r, a * t / n) : 1, w = Math.max(1, Math.round(r * l)), p = Math.max(1, Math.round(n * l));
    (e.width !== w || e.height !== p) && (e.width = w, e.height = p, g());
  }
  const m = new ResizeObserver(([t]) => {
    t && (d = t.contentRect.width, a = t.contentRect.height, s());
  });
  function c() {
    h?.removeEventListener("change", c), h = matchMedia(`(resolution: ${devicePixelRatio || 1}dppx)`), h.addEventListener("change", c), s();
  }
  return m.observe(e), window.addEventListener("resize", s), c(), {
    source: i,
    present: g,
    dispose() {
      m.disconnect(), window.removeEventListener("resize", s), h.removeEventListener("change", c), i.width = i.height = 0;
    }
  };
}
const x = 1, E = 1, R = 1;
export {
  b as IDENTITY,
  y as Renderer,
  D as canvas,
  L as closeRaster,
  V as coverImage,
  f as createDisplayRaster,
  M as createRenderer,
  R as holofoilVersion,
  E as printSamplingVersion,
  x as rainFogVersion
};
