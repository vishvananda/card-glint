import {
  type CanvasContext,
  type CanvasRaster,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';

const root = `${CONJURER_ROOT}/img/frames/saga`;
export const SAGA_COLOR_MASKS = [
  `${root}/sagaMaskPinline.png`,
  `${root}/sagaMaskBanner.png`,
  `${root}/sagaMaskBannerRight.png`,
  `${root}/sagaMidStripe.png`,
] as const;
export function sagaColorFrames(face: RenderedCardInput): string[] {
  const colors = resolveFrameColors(face);
  if (
    colors.length !== 2 ||
    face.layout === 'transform' ||
    face.land ||
    /\bLand\b/.test(face.typeLine ?? '')
  )
    return [];
  if ('WUBRG'.indexOf(colors[1]!) - 'WUBRG'.indexOf(colors[0]!) > 2) colors.reverse();
  return colors.map(
    (color) => `${CONJURER_ROOT}/data/images/cardImages/saga/sagaFrame${color}.png`,
  );
}
export function sagaColorAssets(face: RenderedCardInput): string[] {
  const frames = sagaColorFrames(face);
  return frames.length ? [...frames, ...SAGA_COLOR_MASKS] : [];
}
const prepared = new WeakMap<ImageBitmap, { sources: ImageBitmap[]; canvas: CanvasRaster }>();
/** Retain gold paper/frame; only the source's pinline and folded bookmark masks
 * receive the ordered pair. Preparation is cached by decoded source identity. */
export function paintSagaColors(c: CanvasContext, face: RenderedCardInput, images: CanvasImages) {
  const frames = sagaColorFrames(face);
  if (!frames.length) return;
  const sources = [...frames, ...SAGA_COLOR_MASKS].map((url) => {
    const image = images.get(url);
    if (!image) throw Error(`Saga color asset unavailable: ${url}`);
    return image;
  });
  const cached = prepared.get(sources[0]!);
  if (cached && cached.sources.every((image, i) => image === sources[i])) {
    c.drawImage(cached.canvas, 0, 0, 488, 680);
    return;
  }
  const [left, right, pinline, banner, bannerRight, stripe] = sources;
  const canvas = rasterCanvas();
  canvas.width = left!.width;
  canvas.height = left!.height;
  const layer = rasterCanvas();
  layer.width = canvas.width;
  layer.height = canvas.height;
  const mask = rasterCanvas();
  mask.width = canvas.width;
  mask.height = canvas.height;
  const o = canvas.getContext('2d')!,
    l = layer.getContext('2d')!,
    m = mask.getContext('2d')!;
  const w = canvas.width,
    h = canvas.height;
  // First color covers all pinlines and the banner; second covers the right
  // half of the card pinline and the source's shaped right bookmark portion.
  m.drawImage(pinline!, 0, 0, w, h);
  m.drawImage(banner!, 0, 0, w, h);
  o.drawImage(left!, 0, 0, w, h);
  o.globalCompositeOperation = 'destination-in';
  o.drawImage(mask, 0, 0);
  o.globalCompositeOperation = 'source-over';
  m.clearRect(0, 0, w, h);
  m.save();
  m.beginPath();
  m.rect(w / 2, 0, w / 2, h);
  m.clip();
  m.drawImage(pinline!, 0, 0, w, h);
  m.restore();
  m.drawImage(bannerRight!, 0, 0, w, h);
  l.drawImage(right!, 0, 0, w, h);
  l.globalCompositeOperation = 'destination-in';
  l.drawImage(mask, 0, 0);
  o.drawImage(layer, 0, 0);
  o.drawImage(stripe!, 0.0727 * w, 0.3058 * h, 0.0087 * w, 0.4762 * h);
  prepared.set(left!, { sources, canvas });
  layer.width = layer.height = mask.width = mask.height = 0;
  c.drawImage(canvas, 0, 0, 488, 680);
}
