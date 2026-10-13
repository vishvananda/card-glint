import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { retroFrameAsset } from './retro-frame.js';
import { manaSymbolAsset } from './assets.js';
import { adjustHsb, rgbToHsb, type HsbAdjustment, type Rgb } from './hsb.js';
import { BITMAP_MANA_COLORS } from './mana-colors.js';
import { earlyHsbBitmapCache, type MaterialBitmapLease } from './material-bitmap-cache.js';
import {
  calibratedFrameProfile,
  calibratedManaTarget,
  hasColorCalibration,
} from './calibration-profiles.js';
export { calibratedFrameProfile as earlyHsbProfile } from './calibration-profiles.js';

/** Static composition leases shared derived bitmaps. Original assets and their
 * owner remain untouched; no work happens during animated frames. */
export async function prepareEarlyHsb(
  face: RenderedCardInput,
  images: CanvasImages,
  signal: AbortSignal,
): Promise<{ images: CanvasImages; dispose: () => void }> {
  const unchanged = { images, dispose() {} };
  if (!hasColorCalibration(face)) return unchanged;
  const profile = calibratedFrameProfile(face);
  const adjustments = new Map<string, HsbAdjustment>(),
    colors: Record<string, string> = {};
  if (profile) adjustments.set(retroFrameAsset(face), profile);
  const symbols = new Set([
    ...(face.manaSymbols ?? []),
    ...[...(face.rulesText ?? '').matchAll(/\{([^}]+)\}/g)].map((m) => m[1]!),
  ]);
  // rulesParagraphs can carry symbols independently of rulesText.
  for (const p of face.rulesParagraphs ?? [])
    for (const run of p.runs) for (const m of run.text.matchAll(/\{([^}]+)\}/g)) symbols.add(m[1]!);
  // The original white symbol has a procedural disc, not a bitmap background.
  symbols.add('W');
  for (const symbol of symbols) {
    const key = /^\d+$/.test(symbol) ? 'N' : symbol,
      target = calibratedManaTarget(face, key),
      source = BITMAP_MANA_COLORS[key];
    if (!target || !source) continue;
    const url = manaSymbolAsset(symbol);
    if (url) adjustments.set(url, manaSourceAdjustment(source, target));
    colors[symbol] = `rgb(${target.map((v) => Math.round(v * 255)).join(' ')})`;
  }
  if (!adjustments.size && !Object.keys(colors).length) return unchanged;
  const derived = Object.assign(new Map(images), { manaColors: colors });
  const materials = [...adjustments].flatMap(([url, adjustment]) => {
    const source = images.get(url);
    return source ? [{ url, source, adjustment }] : [];
  });
  let leases: MaterialBitmapLease[] = [];
  try {
    leases = await earlyHsbBitmapCache.acquireMany(
      materials.map(({ url, source, adjustment }) => ({
        key: earlyHsbMaterialKey(url, source.width, source.height, adjustment),
        bytes: source.width * source.height * 4,
        build: () => buildMaterial(source, adjustment),
      })),
      signal,
    );
    materials.forEach(({ url }, i) => derived.set(url, leases[i]!.value));
    return { images: derived, dispose: () => leases.forEach((lease) => lease.release()) };
  } catch (error) {
    leases.forEach((lease) => lease.release());
    throw error;
  }
}

/** Pinned URL includes source revision; policy version includes ink protection. */
export function earlyHsbMaterialKey(
  url: string,
  width: number,
  height: number,
  adjustment: HsbAdjustment,
) {
  return JSON.stringify([
    'early-hsb-rgb-preserve-ink-v1',
    url,
    width,
    height,
    adjustment.hueDegrees,
    adjustment.saturationScale,
    adjustment.brightnessScale,
  ]);
}

async function buildMaterial(source: ImageBitmap, adjustment: HsbAdjustment) {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  try {
    const c = canvas.getContext('2d', { willReadFrequently: true });
    if (!c) throw Error('HSB preparation needs Canvas2D.');
    c.drawImage(source, 0, 0);
    const pixels = c.getImageData(0, 0, canvas.width, canvas.height);
    colorEarlyFrame(pixels, adjustment);
    c.putImageData(pixels, 0, 0);
    return await createImageBitmap(canvas);
  } finally {
    canvas.width = canvas.height = 0;
  }
}
/** One transform across the complete source. No rectangular paper mask can
 * split an irregular parchment edge, inset shadow or wooden frame detail. */
export function colorEarlyFrame(
  image: { width: number; height: number; data: Uint8ClampedArray },
  adjustment: HsbAdjustment,
) {
  for (let i = 0; i < image.data.length; i += 4) {
    if (image.data[i + 3] === 0) continue;
    const rgb: Rgb = [image.data[i]! / 255, image.data[i + 1]! / 255, image.data[i + 2]! / 255],
      v = Math.max(...rgb),
      s = v === 0 ? 0 : (v - Math.min(...rgb)) / v;
    if (v < 0.075 || (s < 0.025 && v > 0.97)) continue;
    const changed = adjustHsb(rgb, adjustment);
    for (let c = 0; c < 3; c++) image.data[i + c] = Math.round(255 * changed[c]!);
  }
}

/** Bind the measured target to the bitmap's actual disc color. Applying the
 * historical sun's coefficients to a modern white SVG changes the target. */
export function manaSourceAdjustment(hex: string, target: Rgb): HsbAdjustment {
  const rgb: Rgb = [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
  const [h, s, b] = rgbToHsb(rgb),
    [th, ts, tb] = rgbToHsb(target);
  if (s <= 0 || b <= 0) throw Error('Mana source requires a chromatic disc.');
  return {
    hueDegrees: ((th - h + 540) % 360) - 180,
    saturationScale: ts / s,
    brightnessScale: tb / b,
  };
}
