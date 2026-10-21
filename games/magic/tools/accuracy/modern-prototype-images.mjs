/** Imported inside the study browser. Derived glyphs are retained once per source.
 * No original bitmap is mutated or closed by this lease. */
const glyphs = new Map();
export async function prototypeGlyphImages(images, parameters) {
  const result = new Map(images);
  for (const entry of Object.values(parameters.largeLandSymbols ?? {})) {
    const source = images.get(entry.source);
    if (!source) continue;
    const key = JSON.stringify([
      entry.source,
      entry.sha256,
      source.width,
      source.height,
      entry.sourceInk,
      entry.body,
    ]);
    let image = glyphs.get(key);
    if (!image) {
      const canvas = document.createElement('canvas');
      canvas.width = source.width;
      canvas.height = source.height;
      const c = canvas.getContext('2d');
      c.drawImage(source, 0, 0);
      const p = c.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < p.data.length; i += 4) {
        if (!p.data[i + 3]) continue;
        const distance = Math.hypot(...entry.sourceInk.map((v, k) => p.data[i + k] - v));
        const weight = Math.max(0, 1 - distance / 24) ** 2;
        for (let k = 0; k < 3; k++)
          p.data[i + k] = Math.round(p.data[i + k] + weight * (entry.body[k] - entry.sourceInk[k]));
      }
      c.putImageData(p, 0, 0);
      image = await createImageBitmap(canvas);
      canvas.width = canvas.height = 0;
      glyphs.set(key, image);
    }
    result.set(entry.source, image);
  }
  return result;
}
export function clearPrototypeGlyphs() {
  for (const image of glyphs.values()) image.close();
  glyphs.clear();
}
