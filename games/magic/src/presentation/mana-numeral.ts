import { manaSymbolAsset } from './assets.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { MaterialBitmapCache, type MaterialBitmapLease } from './material-bitmap-cache.js';

const glyphs = new MaterialBitmapCache(16 * 1024 * 1024);
const identities = new WeakMap<ImageBitmap, number>();
let nextIdentity = 0;
export interface ManaNumeral {
  /** Left half: original disc alpha; right half: numeral alpha. */
  image: ImageBitmap;
  width: number;
  height: number;
}

/** Split the pinned two-color numeric SVG raster once during face preparation.
 * Its calibrated source identifies the cache entry; never read pixels in the painter. */
export async function prepareManaNumerals(
  face: RenderedCardInput,
  images: CanvasImages,
  signal: AbortSignal,
): Promise<{ images: CanvasImages; dispose(): void }> {
  const a = face.symbolAdjustment?.mana;
  if (!a || (!(a.numberDx || a.numberDy) && (a.numberScale ?? 1) === 1))
    return { images, dispose() {} };
  const numerals = new Map<string, ManaNumeral>();
  const sources = [...new Set(face.manaSymbols ?? [])].flatMap((symbol) => {
    if (!/^\d+$/.test(symbol)) return [];
    const source = images.get(manaSymbolAsset(symbol) ?? '');
    if (!source) return [];
    let identity = identities.get(source);
    if (!identity) identities.set(source, (identity = ++nextIdentity));
    return [{ symbol, source, identity }];
  });
  let leases: MaterialBitmapLease[] = [];
  try {
    leases = await glyphs.acquireMany(
      sources.map(({ source, identity }) => ({
        key: `numeral-v1:${identity}`,
        bytes: source.width * source.height * 8,
        build: () => splitNumeral(source),
      })),
      signal,
    );
    sources.forEach(({ symbol, source }, i) => {
      numerals.set(symbol, { image: leases[i]!.value, width: source.width, height: source.height });
    });
    return {
      images: Object.assign(new Map(images), {
        manaColors: images.manaColors,
        originalManaGlyphs: images.originalManaGlyphs,
        originalWhiteGlyph: images.originalWhiteGlyph,
        manaNumerals: numerals,
      }),
      dispose: () => leases.forEach((l) => l.release()),
    };
  } catch (error) {
    leases.forEach((l) => l.release());
    throw error;
  }
}
async function splitNumeral(source: ImageBitmap): Promise<ImageBitmap> {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  try {
    const c = canvas.getContext('2d', { willReadFrequently: true });
    if (!c) throw Error('Numeral preparation needs Canvas2D.');
    c.drawImage(source, 0, 0);
    const pixels = c.getImageData(0, 0, canvas.width, canvas.height),
      p = pixels.data,
      sample = (Math.floor(source.height * 0.04) * source.width + Math.floor(source.width / 2)) * 4,
      paper = [p[sample]!, p[sample + 1]!, p[sample + 2]!];
    let darkest = sample;
    for (let i = 0; i < p.length; i += 4)
      if (
        p[i + 3] === 255 &&
        p[i]! + p[i + 1]! + p[i + 2]! < p[darkest]! + p[darkest + 1]! + p[darkest + 2]!
      )
        darkest = i;
    const ink = [p[darkest]!, p[darkest + 1]!, p[darkest + 2]!],
      difference = paper.map((v, k) => v - ink[k]!),
      length = difference.reduce((n, v) => n + v * v, 0);
    if (length < 100) throw Error('Numeric mana asset has no separable glyph.');
    const background = new ImageData(new Uint8ClampedArray(p), source.width, source.height);
    for (let i = 0; i < p.length; i += 4) {
      for (let k = 0; k < 3; k++) background.data[i + k] = paper[k]!;
      const opacity = Math.max(
        0,
        Math.min(1, difference.reduce((n, v, k) => n + v * (paper[k]! - p[i + k]!), 0) / length),
      );
      p[i + 3] = Math.round(p[i + 3]! * opacity);
      for (let k = 0; k < 3; k++) p[i + k] = ink[k]!;
    }
    canvas.width = source.width * 2;
    c.putImageData(background, 0, 0);
    c.putImageData(pixels, source.width, 0);
    return await createImageBitmap(canvas);
  } finally {
    canvas.width = canvas.height = 0;
  }
}
