import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import type { ModernBasicLandSymbol } from './modern-printing-profiles.js';
import { modernBasicLandProfile } from './plate-basic-land.js';
import { materialBitmapIdentity } from './material-bitmap-cache.js';

/** Recolor only the source's flat glyph ink. Preserve its shading and alpha. */
export function colorModernBasicGlyph(
  pixels: Uint8ClampedArray,
  profile: Pick<ModernBasicLandSymbol, 'sourceInk' | 'body'>,
) {
  const [r, g, b] = profile.sourceInk;
  for (let i = 0; i < pixels.length; i += 4) {
    if (!pixels[i + 3]) continue;
    const distance = Math.hypot(pixels[i]! - r, pixels[i + 1]! - g, pixels[i + 2]! - b);
    const weight = Math.max(0, 1 - distance / 24) ** 2;
    for (let k = 0; k < 3; k++)
      pixels[i + k] = Math.round(
        pixels[i + k]! + weight * (profile.body[k]! - profile.sourceInk[k]!),
      );
  }
}

/** One source-bound job in the existing atomic, bounded material cache.
 * No original image mutation, separate cache, or readback on warm preparation. */
export function modernBasicMaterialJobs(face: RenderedCardInput, images: CanvasImages) {
  if (face.colorCalibration !== 'set-hsb-v1') return [];
  const profile = modernBasicLandProfile(face);
  if (!profile) return [];
  const source = images.get(profile.source);
  if (!source) throw Error('Modern basic-land glyph unavailable: ' + profile.source);
  return [
    {
      url: profile.source,
      key: JSON.stringify([
        'modern-basic-ink-v1',
        profile.source,
        profile.sha256,
        materialBitmapIdentity(source),
        source.width,
        source.height,
        profile.sourceInk,
        profile.body,
      ]),
      bytes: source.width * source.height * 4,
      build: async () => {
        const canvas = rasterCanvas();
        canvas.width = source.width;
        canvas.height = source.height;
        try {
          const c = canvas.getContext('2d', { willReadFrequently: true });
          if (!c) throw Error('Modern basic-land preparation needs Canvas2D.');
          c.drawImage(source, 0, 0);
          const image = c.getImageData(0, 0, canvas.width, canvas.height);
          colorModernBasicGlyph(image.data, profile);
          c.putImageData(image, 0, 0);
          return await createImageBitmap(canvas);
        } finally {
          canvas.width = canvas.height = 0;
        }
      },
    },
  ];
}
