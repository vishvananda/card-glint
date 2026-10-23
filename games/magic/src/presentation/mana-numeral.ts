import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import { earlyManaNumeral } from './early-expansion-mana.js';
import { modernCostMana, modernCostNumeralAsset } from './modern-cost-mana.js';
import { manaSymbolAsset } from './assets.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { MaterialBitmapCache, type MaterialBitmapLease } from './material-bitmap-cache.js';
import { colorGlyphTransform } from './symbol-adjustment.js';
import { printingManaAdjustment } from './printing-mana-adjustment.js';
import { historicalManaPaperSample } from './historical-mana.js';
import { opaqueManaPaper } from './mana-glyph-paper.js';

const glyphs = new MaterialBitmapCache(16 * 1024 * 1024);
const identities = new WeakMap<ImageBitmap, number>();
let nextIdentity = 0;
export interface ManaNumeral {
  /** Left half: original disc alpha; right half: numeral alpha. */
  image: ImageBitmap;
  width: number;
  height: number;
}

/** Split pinned two-color mana rasters once during face preparation.
 * Its calibrated source identifies the cache entry; never read pixels in the painter. */
export async function prepareManaNumerals(
  face: RenderedCardInput,
  images: CanvasImages,
  signal: AbortSignal,
): Promise<{ images: CanvasImages; dispose(): void }> {
  const a = printingManaAdjustment(face);
  const cost = modernCostMana(face);
  const historical = earlyManaNumeral(face);
  const numbers =
    !historical &&
    (!!cost || (!!a && (!!(a.numberDx || a.numberDy) || (a.numberScale ?? 1) !== 1)));
  if (
    !historical &&
    !cost &&
    !numbers &&
    !a?.glyphs &&
    !Object.keys(images.manaGlyphScales ?? {}).length
  )
    return { images, dispose() {} };
  const numerals = new Map<string, ManaNumeral>();
  const colored = new Map<string, ManaNumeral>();
  const sources = [
    ...new Set([...(face.manaSymbols ?? []), ...Object.keys(images.manaGlyphScales ?? {})]),
  ].flatMap((symbol) => {
    const delta = colorGlyphTransform(a, symbol);
    const changed = !!delta && (!!(delta.dx || delta.dy) || (delta.scale ?? 1) !== 1);
    if (
      !(/^\d+$/.test(symbol) && numbers) &&
      !changed &&
      (images.manaGlyphScales?.[symbol] ?? 1) === 1
    )
      return [];
    const costUrl = modernCostNumeralAsset(face, symbol);
    const source = images.get(costUrl ?? manaSymbolAsset(symbol) ?? '');
    if (costUrl && !source) throw Error('Modern cost numeral asset is missing.');
    if (!source) return [];
    let identity = identities.get(source);
    if (!identity) identities.set(source, (identity = ++nextIdentity));
    return [
      {
        symbol,
        source,
        identity,
        cost: costUrl ? cost : undefined,
        paperSample: historicalManaPaperSample(face, symbol),
      },
    ];
  });
  let leases: MaterialBitmapLease[] = [];
  try {
    const jobs = sources.map(({ source, identity, cost, paperSample }) => ({
      key: `numeral-v2:${identity}:${cost ? JSON.stringify(cost) : 'source'}${paperSample ? ':' + paperSample : ''}`,
      bytes: source.width * source.height * 8,
      build: () => splitNumeral(source, cost, paperSample),
    }));
    // Hosts may alias several symbol URLs to one bitmap. The batch leases one
    // split per distinct source/tone, then all aliases share that held value.
    const unique = new Map(jobs.map((job) => [job.key, job]));
    const indices = new Map([...unique.keys()].map((key, i) => [key, i]));
    leases = await glyphs.acquireMany([...unique.values()], signal);
    sources.forEach(({ symbol, source }, i) => {
      (/^\d+$/.test(symbol) ? numerals : colored).set(symbol, {
        image: leases[indices.get(jobs[i]!.key)!]!.value,
        width: source.width,
        height: source.height,
      });
    });
    return {
      images: Object.assign(new Map(images), {
        manaCostShadow: cost?.shadow,
        manaCostNumeral: historical,
        manaColors: images.manaColors,
        manaInkColor: images.manaInkColor,
        originalManaGlyphs: images.originalManaGlyphs,
        originalWhiteGlyph: images.originalWhiteGlyph,
        manaNumerals: numerals,
        manaGlyphs: colored,
        manaGlyphScales: images.manaGlyphScales,
      }),
      dispose: () => leases.forEach((l) => l.release()),
    };
  } catch (error) {
    leases.forEach((l) => l.release());
    throw error;
  }
}
async function splitNumeral(
  source: ImageBitmap,
  cost?: ReturnType<typeof modernCostMana>,
  paperSample?: 'opaque-percentile',
): Promise<ImageBitmap> {
  const canvas = rasterCanvas();
  canvas.width = source.width;
  canvas.height = source.height;
  try {
    const c = canvas.getContext('2d', { willReadFrequently: true });
    if (!c) throw Error('Mana glyph preparation needs Canvas2D.');
    c.drawImage(source, 0, 0);
    const pixels = c.getImageData(0, 0, canvas.width, canvas.height),
      p = pixels.data,
      sample = (Math.floor(source.height * 0.04) * source.width + Math.floor(source.width / 2)) * 4,
      paper = paperSample ? opaqueManaPaper(p) : [p[sample]!, p[sample + 1]!, p[sample + 2]!];
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
    if (length < 100) throw Error('Mana asset has no separable glyph.');
    const background = new ImageData(new Uint8ClampedArray(p), source.width, source.height);
    for (let i = 0; i < p.length; i += 4) {
      // Keep the previously calibrated disc/ink colors while changing only the
      // numeral outline. Source colors are still used to recover glyph alpha.
      if (cost) for (let k = 0; k < 3; k++) background.data[i + k] = cost.paper[k]!;
      // Outer-disc antialiasing belongs to the stationary background. Browser
      // unpremultiplication can perturb its RGB by a byte; do not interpret
      // that rounding as movable dark ink or repaint the original edge.
      if (p[i + 3]! < 255) {
        p[i + 3] = 0;
        continue;
      }
      for (let k = 0; k < 3; k++) background.data[i + k] = cost?.paper[k] ?? paper[k]!;
      const opacity = Math.max(
        0,
        Math.min(1, difference.reduce((n, v, k) => n + v * (paper[k]! - p[i + k]!), 0) / length),
      );
      p[i + 3] = Math.round(p[i + 3]! * opacity);
      for (let k = 0; k < 3; k++) p[i + k] = cost?.ink[k] ?? ink[k]!;
    }
    canvas.width = source.width * 2;
    c.putImageData(background, 0, 0);
    c.putImageData(pixels, source.width, 0);
    return await createImageBitmap(canvas);
  } finally {
    canvas.width = canvas.height = 0;
  }
}
