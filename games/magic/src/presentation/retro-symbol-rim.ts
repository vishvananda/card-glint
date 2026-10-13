import type { FaceRect } from './face-layout.js';

/** Enlarge a printed white rim inward without scaling the glyph. Intersect
 * shifted copies of the filled silhouette during face preparation. Opaque
 * window backing keeps interior window strokes intact; the arch stays open.
 * Canvas compositing only: no mask readback or new decoded asset. */
export function insetRetroSymbolInk(
  layer: HTMLCanvasElement,
  backing: ImageBitmap | null,
  crop: FaceRect,
  pad: number,
  width: number,
  height: number,
  inset: number,
) {
  if (inset <= 0) return;
  const mask = document.createElement('canvas');
  mask.width = layer.width;
  mask.height = layer.height;
  const silhouette = mask.getContext('2d')!;
  silhouette.drawImage(layer, 0, 0);
  if (backing)
    silhouette.drawImage(
      backing,
      crop[0] * backing.width,
      crop[1] * backing.height,
      crop[2] * backing.width,
      crop[3] * backing.height,
      pad,
      pad,
      width,
      height,
    );
  const ink = layer.getContext('2d')!;
  ink.save();
  ink.globalCompositeOperation = 'destination-in';
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8;
    ink.drawImage(mask, Math.cos(angle) * inset, Math.sin(angle) * inset);
  }
  ink.restore();
  mask.width = mask.height = 0;
}
