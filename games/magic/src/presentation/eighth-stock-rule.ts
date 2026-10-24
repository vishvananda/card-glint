import {
  rasterCanvas,
  type CanvasContext,
} from '../../../../packages/browser/src/canvas-raster.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { eighthPrintingProfile } from './eighth-printing-profile.js';
import { materialBitmapIdentity } from './material-bitmap-cache.js';
import { eighthStockRulePixels } from './eighth-stock-rule-pixels.js';

export const EIGHTH_STOCK_RULE = 'card-glint:eighth-stock-rule';
/** One derived mask in the existing bounded cache, acquired with the other materials.
 * Stock and its inner hairline use the original source contour; no animation readback. */
export function eighthStockRuleJobs(face: RenderedCardInput, images: CanvasImages) {
  const p = eighthPrintingProfile(face)?.outerRule;
  if (!p) return [];
  const source = images.get(p.source);
  if (!source) throw Error('Eighth stock contour unavailable: ' + p.source);
  return [
    {
      url: EIGHTH_STOCK_RULE,
      key: JSON.stringify(['eighth-stock-rule-v1', p, materialBitmapIdentity(source)]),
      bytes: 732 * 1020 * 4,
      build: async () => {
        const canvas = rasterCanvas();
        canvas.width = 732;
        canvas.height = 1020;
        try {
          const c = canvas.getContext('2d', { willReadFrequently: true });
          if (!c) throw Error('Eighth stock-rule preparation needs Canvas2D');
          c.drawImage(source, 0, 0, 732, 1020);
          const image = c.getImageData(0, 0, 732, 1020);
          eighthStockRulePixels(image, p.width * 1.5, p.rgb);
          c.putImageData(image, 0, 0);
          return await createImageBitmap(canvas);
        } finally {
          canvas.width = canvas.height = 0;
        }
      },
    },
  ];
}
export function paintEighthStockRule(
  c: CanvasContext,
  face: RenderedCardInput,
  images: CanvasImages,
) {
  if (!eighthPrintingProfile(face)?.outerRule) return;
  const image = images.get(EIGHTH_STOCK_RULE);
  if (!image) throw Error('Eighth stock rule was not prepared');
  c.drawImage(image, 0, 0, 488, 680);
}
