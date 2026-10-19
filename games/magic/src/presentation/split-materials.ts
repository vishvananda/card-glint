import {
  type CanvasContext,
  type CanvasRaster,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
import { modernSplitAssets } from './split-modern-frame.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import { MSE_SPLIT_ROOT, splitPlateAsset, type SplitEra } from './split-frame.js';

const guilds: Record<string, readonly [string, string]> = {
  azorius: ['W', 'U'],
  dimir: ['U', 'B'],
  rakdos: ['B', 'R'],
  gruul: ['R', 'G'],
  selesnya: ['G', 'W'],
  orzhov: ['W', 'B'],
  izzet: ['U', 'R'],
  golgari: ['B', 'G'],
  boros: ['R', 'W'],
  simic: ['G', 'U'],
};
/** Some printing records put a shared guild only on the first face. Inherit it
 * only when the whole split belongs to that guild; three-color splits may have
 * different guilds on each half. Explicit per-half identities always win. */
export function splitPanelWatermark(parent: RenderedCardInput, half: RenderedCardInput) {
  if (half.watermark) return half.watermark;
  if (parent.watermark) return parent.watermark;
  const identities = [...new Set(parent.faces?.map((f) => f.watermark).filter(Boolean))];
  if (identities.length !== 1) return half.watermark;
  const guild = guilds[identities[0]!];
  const colors = new Set(parent.faces?.flatMap(resolveFrameColors));
  return guild && colors.size === 2 && guild.every((color) => colors.has(color))
    ? identities[0]
    : half.watermark;
}
export function splitWatermark(face: RenderedCardInput): string | null {
  return face.watermark && Object.hasOwn(guilds, face.watermark)
    ? `${CONJURER_ROOT}/img/watermarks/guild-${face.watermark}.svg`
    : null;
}
export function splitBlendMask(fuse: boolean, index: number) {
  return `${MSE_SPLIT_ROOT}/magic-new-split${fuse ? '-fuse' : ''}.mse-style/multicolor_blend_card${fuse ? index + 1 : ''}.png`;
}
export function splitMaterialAssets(
  face: RenderedCardInput,
  era: SplitEra,
  fuse: boolean,
  index: number,
) {
  if (era === 'm15') return [...modernSplitAssets(face), splitWatermark(face)];
  const colors = resolveFrameColors(face);
  return [
    splitPlateAsset(face, era, fuse, index),
    splitWatermark(face),
    ...(era === 'eighth' && colors.length === 2
      ? [
          splitBlendMask(fuse, index),
          ...colors.map((color) =>
            splitPlateAsset({ ...face, colors: [color], frameColors: undefined }, era, fuse, index),
          ),
        ]
      : []),
    ...(era === 'eighth' && face.artist ? [`${CONJURER_ROOT}/img/manaSymbols/brush.svg`] : []),
  ];
}
const masks = new WeakMap<ImageBitmap, CanvasRaster>();
export function splitSourceMask(image: ImageBitmap): CanvasRaster {
  const cached = masks.get(image);
  if (cached) return cached;
  const canvas = rasterCanvas();
  canvas.width = image.width;
  canvas.height = image.height;
  const c = canvas.getContext('2d', { willReadFrequently: true })!;
  c.drawImage(image, 0, 0);
  // Source masks encode coverage in RGB, not alpha. Convert once per decoded
  // mask during preparation; no readback/decoding occurs in the display loop.
  const pixels = c.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < pixels.data.length; i += 4) pixels.data[i + 3] = pixels.data[i]!;
  c.putImageData(pixels, 0, 0);
  masks.set(image, canvas);
  return canvas;
}
const plates = new WeakMap<
  ImageBitmap,
  Map<string, { left: ImageBitmap; right: ImageBitmap; mask: ImageBitmap; canvas: CanvasRaster }>
>();
export function splitPlateImage(
  face: RenderedCardInput,
  era: SplitEra,
  fuse: boolean,
  index: number,
  images: CanvasImages,
): CanvasImageSource {
  const required = (url: string) => {
    const image = images.get(url);
    if (!image) throw Error(`Split asset unavailable: ${url}`);
    return image;
  };
  const base = required(splitPlateAsset(face, era, fuse, index));
  const colors = resolveFrameColors(face);
  if (era !== 'eighth' || colors.length !== 2) return base;
  if ('WUBRG'.indexOf(colors[1]!) - 'WUBRG'.indexOf(colors[0]!) > 2) colors.reverse();
  const [left, right] = colors.map((color) =>
    required(
      splitPlateAsset({ ...face, colors: [color], frameColors: undefined }, era, fuse, index),
    ),
  );
  const mask = required(splitBlendMask(fuse, index)),
    key = colors.join('');
  const map = plates.get(base) ?? new Map();
  plates.set(base, map);
  const cached = map.get(key);
  if (cached?.left === left && cached.right === right && cached.mask === mask) return cached.canvas;
  const canvas = rasterCanvas();
  canvas.width = base.width;
  canvas.height = base.height;
  const overlay = rasterCanvas();
  overlay.width = base.width;
  overlay.height = base.height;
  const c = canvas.getContext('2d')!,
    o = overlay.getContext('2d')!;
  o.drawImage(right!, 0, 0);
  o.globalCompositeOperation = 'destination-in';
  const gradient = o.createLinearGradient(0, 0, base.width, 0);
  gradient.addColorStop(0, '#0000');
  gradient.addColorStop(0.4, '#0000');
  gradient.addColorStop(0.6, '#000');
  gradient.addColorStop(1, '#000');
  o.fillStyle = gradient;
  o.fillRect(0, 0, base.width, base.height);
  c.drawImage(left!, 0, 0);
  c.drawImage(overlay, 0, 0);
  c.globalCompositeOperation = 'destination-in';
  c.drawImage(splitSourceMask(mask), 0, 0);
  c.globalCompositeOperation = 'destination-over';
  c.drawImage(base, 0, 0);
  c.globalCompositeOperation = 'source-over';
  overlay.width = overlay.height = 0;
  map.set(key, { left: left!, right: right!, mask, canvas });
  return canvas;
}
const watermarkImages = new WeakMap<ImageBitmap, Map<string, CanvasRaster>>();
export function paintSplitWatermark(
  c: CanvasContext,
  face: RenderedCardInput,
  images: CanvasImages,
  center: number,
) {
  const url = splitWatermark(face);
  if (!url) return;
  const image = images.get(url);
  if (!image) throw Error(`Split watermark unavailable: ${url}`);
  const colors = resolveFrameColors(face);
  const tintColors =
    colors.length === 1 ? ([colors[0]!, colors[0]!] as const) : guilds[face.watermark!]!;
  const key = tintColors.join(''),
    map = watermarkImages.get(image) ?? new Map();
  watermarkImages.set(image, map);
  let canvas = map.get(key);
  if (!canvas) {
    canvas = rasterCanvas();
    canvas.width = image.width;
    canvas.height = image.height;
    const ink = canvas.getContext('2d')!;
    ink.drawImage(image, 0, 0);
    ink.globalCompositeOperation = 'source-in';
    const palette: Record<string, string> = {
      W: '#b39f4d',
      U: '#718dac',
      B: '#998795',
      R: '#b6723f',
      G: '#69936e',
    };
    const [left, right] = tintColors;
    const tint = ink.createLinearGradient(0, 0, canvas.width, 0);
    tint.addColorStop(0, palette[left]!);
    tint.addColorStop(0.499, palette[left]!);
    tint.addColorStop(0.5, palette[right]!);
    tint.addColorStop(1, palette[right]!);
    ink.fillStyle = tint;
    ink.fillRect(0, 0, canvas.width, canvas.height);
    map.set(key, canvas);
  }
  const modern = face.layout?.startsWith('split-m15') ?? false;
  const scale = Math.min(
      (modern ? 135 : 110) / image.width,
      (modern ? 125 : face.setCode?.toLowerCase() === 'dgm' ? 75 : 100) / image.height,
    ),
    w = image.width * scale,
    h = image.height * scale;
  c.save();
  c.globalAlpha = 0.3;
  c.drawImage(canvas, (modern ? 199.5 : 177) - w / 2, center - h / 2, w, h);
  c.restore();
}
