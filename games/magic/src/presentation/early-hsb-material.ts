import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { isRetro, retroFrameAsset } from './retro-frame.js';
import { manaSymbolAsset } from './assets.js';
import { adjustHsb, type HsbAdjustment, type Rgb } from './hsb.js';
import { MANA_COLORS, GENERIC_MANA_COLOR } from './mana-colors.js';
import {
  EARLY_HSB_PROFILES,
  EARLY_MANA_HSB_PROFILES,
  EARLY_HSB_FRAME_ASSETS,
} from './early-hsb-profiles.js';

const materialKey = (face: RenderedCardInput) =>
  retroFrameAsset(face).split('/').at(-1)!.replace('.png', '').toUpperCase();
export function earlyHsbProfile(face: RenderedCardInput): HsbAdjustment | undefined {
  if (face.colorCalibration !== 'early-hsb-v1' || !isRetro(face)) return undefined;
  const key = `${face.setCode?.toLowerCase()}-${materialKey(face)}`;
  // A different source frame invalidates its fitted color transform.
  return EARLY_HSB_FRAME_ASSETS[key] === retroFrameAsset(face)
    ? EARLY_HSB_PROFILES[key]
    : undefined;
}
/** Derived bitmaps live only during static face composition. Original assets
 * and their owner remain untouched; no work happens during animated frames. */
export async function prepareEarlyHsb(
  face: RenderedCardInput,
  images: CanvasImages,
  signal: AbortSignal,
): Promise<{ images: CanvasImages; dispose: () => void }> {
  const unchanged = { images, dispose() {} };
  if (face.colorCalibration !== 'early-hsb-v1' || !isRetro(face)) return unchanged;
  const profile = earlyHsbProfile(face),
    set = face.setCode?.toLowerCase() ?? '';
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
      adjustment = EARLY_MANA_HSB_PROFILES[`${set}-${key}`];
    if (!adjustment) continue;
    const url = manaSymbolAsset(symbol);
    if (url) adjustments.set(url, adjustment);
    const hex = MANA_COLORS[symbol] ?? GENERIC_MANA_COLOR;
    const rgb = adjustHsb(
      [
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255,
      ],
      adjustment,
    );
    colors[symbol] = `rgb(${rgb.map((v) => Math.round(v * 255)).join(' ')})`;
  }
  if (!adjustments.size && !Object.keys(colors).length) return unchanged;
  const derived = Object.assign(new Map(images), { manaColors: colors }),
    owned: ImageBitmap[] = [];
  try {
    for (const [url, adjustment] of adjustments) {
      const source = images.get(url);
      if (!source) continue;
      signal.throwIfAborted();
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
        const bitmap = await createImageBitmap(canvas);
        owned.push(bitmap);
        signal.throwIfAborted();
        derived.set(url, bitmap);
      } finally {
        canvas.width = canvas.height = 0;
      }
    }
    return { images: derived, dispose: () => owned.forEach((b) => b.close()) };
  } catch (error) {
    owned.forEach((b) => b.close());
    throw error;
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
