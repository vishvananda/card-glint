import {
  rasterCanvas,
  type CanvasContext,
} from '../../../../packages/browser/src/canvas-raster.js';
import { modernArtifactPinline } from './modern-printing-profile.js';
import { calibrationFace } from './calibration-input.js';
import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import { colorFrame } from './frame-hsb.js';

const layerKey = 'card-glint:magic/artifact-pinline';
export function modernArtifactLayerAssets(face: RenderedCardInput): string[] {
  const layer = modernArtifactPinline(calibrationFace(face));
  return layer ? [layer.source, layer.mask] : [];
}

/** One immutable, source-bound layer per color/policy enters the existing
 * bounded material cache. Masks and pigment are prepared only on a cache miss. */
export function modernArtifactMaterialJobs(input: RenderedCardInput, images: CanvasImages) {
  const face = calibrationFace(input),
    layer = modernArtifactPinline(face);
  if (!layer) return [];
  const required = (url: string) => {
    const bitmap = images.get(url);
    if (!bitmap) throw Error('Modern artifact layer asset unavailable: ' + url);
    return bitmap;
  };
  const source = required(layer.source),
    mask = required(layer.mask);
  const correction = face.colorCalibration === 'set-hsb-v1' ? layer.correction : undefined;
  // The pinline mask excludes outer stock, so that independently owned
  // correction must not be applied to this interior-only overlay.
  const tone = correction
    ? (() => {
        const { outerStock: _stock, outerStockMaskSource: _mask, ...rest } = correction;
        return rest;
      })()
    : undefined;
  return [
    {
      url: layerKey,
      key: JSON.stringify([
        'modern-artifact-pinline-v1',
        layer.source,
        layer.mask,
        tone,
        source.width,
        source.height,
        mask.width,
        mask.height,
      ]),
      bytes: 732 * 1020 * 4,
      build: async () => {
        const pigment = rasterCanvas(),
          overlay = rasterCanvas();
        pigment.width = source.width;
        pigment.height = source.height;
        overlay.width = 732;
        overlay.height = 1020;
        try {
          const c = pigment.getContext('2d', { willReadFrequently: true });
          const m = overlay.getContext('2d');
          if (!c || !m) throw Error('Modern artifact layer needs Canvas2D');
          c.drawImage(source, 0, 0);
          if (tone) {
            const pixels = c.getImageData(0, 0, pigment.width, pigment.height);
            colorFrame(pixels, tone);
            c.putImageData(pixels, 0, 0);
          }
          m.drawImage(pigment, 0, 0, 732, 1020);
          m.globalCompositeOperation = 'destination-in';
          m.drawImage(mask, 0, 0, 732, 1020);
          return await createImageBitmap(overlay);
        } finally {
          pigment.width = pigment.height = overlay.width = overlay.height = 0;
        }
      },
    },
  ];
}

export function paintModernArtifactLayer(
  c: CanvasContext,
  face: RenderedCardInput,
  images: CanvasImages,
) {
  if (!modernArtifactPinline(face)) return;
  const image = images.get(layerKey);
  if (!image) throw Error('Modern artifact pinline layer was not prepared');
  c.drawImage(image, 0, 0, 488, 680);
}
