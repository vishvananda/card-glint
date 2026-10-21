async function c(a) {
  if (!a.type.includes("svg")) return a;
  const i = new DOMParser().parseFromString(await a.text(), "image/svg+xml"), r = i.documentElement;
  if (r.localName !== "svg" || i.querySelector("parsererror"))
    throw new Error("Invalid SVG asset.");
  const n = (r.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), e = n[2] ?? parseFloat(r.getAttribute("width") ?? ""), t = n[3] ?? parseFloat(r.getAttribute("height") ?? "");
  if (!(e > 0 && t > 0 && Number.isFinite(e + t)))
    throw new Error("SVG asset needs a finite viewport.");
  const s = 512 / Math.max(e, t);
  return r.hasAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${e} ${t}`), r.setAttribute("width", String(Math.max(1, Math.round(e * s)))), r.setAttribute("height", String(Math.max(1, Math.round(t * s)))), new Blob([new XMLSerializer().serializeToString(r)], { type: "image/svg+xml" });
}
async function h(a, i, r) {
  if (i.throwIfAborted(), !a.type.includes("svg"))
    return r ? createImageBitmap(a, { resizeWidth: r, resizeQuality: "high" }) : createImageBitmap(a);
  const n = URL.createObjectURL(await c(a)), e = new Image(), t = document.createElement("canvas"), s = () => {
    e.src = "";
  };
  i.addEventListener("abort", s, { once: !0 });
  try {
    i.throwIfAborted(), e.src = n, await e.decode(), i.throwIfAborted(), t.width = e.naturalWidth, t.height = e.naturalHeight;
    const o = t.getContext("2d", { willReadFrequently: !0 });
    if (!o || !t.width || !t.height)
      throw new Error("SVG asset could not be rasterized.");
    return o.drawImage(e, 0, 0), await createImageBitmap(t);
  } finally {
    i.removeEventListener("abort", s), e.src = "", URL.revokeObjectURL(n), t.width = 0, t.height = 0;
  }
}
export {
  h as d,
  c as s
};
