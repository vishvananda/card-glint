import { center, oklab, quantile } from './hsb-color.mjs';

/** Ink-free frame patches only. Preserve the luminance-ordered RGB distribution:
 * a median color alone cannot reveal brown shadows or excess texture contrast.
 * Quantile bins avoid dependence on the phase of the source/scanned texture. */
export function sampleTexture(image, patches) {
  const pixels = [];
  for (const [x, y, w, h] of patches)
    for (let yy = y; yy < y + h; yy++)
      for (let xx = x; xx < x + w; xx++) {
        const at = (yy * image.width + xx) * 4;
        if (image.data[at + 3] < 250) throw Error('Texture patch touches transparency');
        const rgb = Array.from(image.data.slice(at, at + 3), (v) => v / 255);
        pixels.push({ rgb, l: oklab(rgb)[0] });
      }
  pixels.sort((a, b) => a.l - b.l);
  return Array.from({ length: 10 }, (_, i) =>
    center(
      pixels
        .slice(Math.floor((pixels.length * i) / 10), Math.floor((pixels.length * (i + 1)) / 10))
        .map((p) => p.rgb),
    ),
  );
}

export function textureMetrics(source, reference) {
  const a = source.map(oklab),
    b = reference.map(oklab);
  const chroma = (x, y) => Math.hypot(x[1] - y[1], x[2] - y[2]) * 100;
  const contrast = (x) =>
    (quantile(
      x.map((p) => p[0]),
      0.9,
    ) -
      quantile(
        x.map((p) => p[0]),
        0.1,
      )) *
    100;
  return {
    chroma: chroma(center(a), center(b)),
    shadowChroma: chroma(center(a.slice(0, 3)), center(b.slice(0, 3))),
    shadowLightness: Math.abs(center(a.slice(0, 3))[0] - center(b.slice(0, 3))[0]) * 100,
    contrast: contrast(a),
    referenceContrast: contrast(b),
    contrastError: Math.abs(contrast(a) - contrast(b)),
  };
}
