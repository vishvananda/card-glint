import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import type { FramePixels } from './frame-paper-mask.js';
import { eighthBasicProfile, EIGHTH_BASIC_OUTER } from './eighth-basic-profile.js';
import {
  colorEighthBasicFrame,
  colorEighthBasicGlyph,
  EIGHTH_BASIC_MASK,
} from './eighth-basic-pixels.js';

/** Join the existing atomic, bounded material-cache batch. No separate cache or
 * nested lease acquisition, and no readback when a prepared material is warm. */
export function eighthBasicMaterialJobs(face: RenderedCardInput, images: CanvasImages) {
  const p = eighthBasicProfile(face);
  if (!p) return [];
  const specs = [
    {
      url: p.frame,
      kind: 'frame',
      color: (pixels: FramePixels) => colorEighthBasicFrame(pixels, p.palette),
    },
    ...(p.glyph
      ? [
          {
            url: p.glyph,
            kind: 'glyph',
            color: (pixels: FramePixels) => colorEighthBasicGlyph(pixels, p.palette.glyph),
          },
        ]
      : []),
  ];
  return specs.map(({ url, kind, color }) => {
    const source = images.get(url);
    if (!source) throw Error(`Eighth basic-land material unavailable: ${url}`);
    return {
      url,
      key: JSON.stringify([
        'eighth-basic-material-v1',
        url,
        source.width,
        source.height,
        kind === 'frame' ? [p.palette, EIGHTH_BASIC_OUTER, EIGHTH_BASIC_MASK] : p.palette.glyph,
      ]),
      bytes: source.width * source.height * 4,
      build: async () => {
        const canvas = rasterCanvas();
        canvas.width = source.width;
        canvas.height = source.height;
        try {
          const c = canvas.getContext('2d', { willReadFrequently: true });
          if (!c) throw Error('Basic-land color preparation needs Canvas2D.');
          c.drawImage(source, 0, 0);
          const pixels = c.getImageData(0, 0, canvas.width, canvas.height);
          color(pixels);
          c.putImageData(pixels, 0, 0);
          return await createImageBitmap(canvas);
        } finally {
          canvas.width = canvas.height = 0;
        }
      },
    };
  });
}
