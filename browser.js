import { I, R as b, c as y } from "./renderer-4CrHojOL.js";
import { canvas as z, closeRaster as D } from "./raster-8MSDN7In.js";
import { c as S } from "./image-cover-QdXNryDE.js";
function f(e, u = [e.width, e.height]) {
  const [o, n] = u;
  if (![o, n].every((t) => Number.isSafeInteger(t) && t > 0))
    throw Error("Invalid native display raster size");
  const r = e.getContext("2d");
  if (!r) throw Error("Display raster requires a 2D output canvas");
  const i = document.createElement("canvas");
  i.width = o, i.height = n;
  let d = e.clientWidth, a = e.clientHeight, h;
  function g() {
    r.globalCompositeOperation = "copy", r.imageSmoothingEnabled = !0, r.imageSmoothingQuality = "high", r.drawImage(i, 0, 0, e.width, e.height);
  }
  function s() {
    const t = devicePixelRatio || 1, l = d > 0 && a > 0 ? Math.min(1, d * t / o, a * t / n) : 1, w = Math.max(1, Math.round(o * l)), p = Math.max(1, Math.round(n * l));
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
const x = 1, E = 1;
export {
  I as IDENTITY,
  b as Renderer,
  z as canvas,
  D as closeRaster,
  S as coverImage,
  f as createDisplayRaster,
  y as createRenderer,
  E as printSamplingVersion,
  x as rainFogVersion
};
