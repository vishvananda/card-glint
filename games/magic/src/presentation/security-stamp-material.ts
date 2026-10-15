import type { CanvasImages } from './canvas-assets.js';
import { cardStock, type RenderedCardInput } from './face-layout.js';
import { mountedSecurityStamp } from './security-stamp-paint.js';

/** The source mounts include an opaque black footer rectangle. Bind its black
 * anchor to this pack's black stock so it cannot appear as a separate square.
 * Preserve alpha and brighter ring/hologram pixels; prepare once, never per frame. */
export function securityStampMaterialJobs(face: RenderedCardInput, images: CanvasImages) {
  const stamp = mountedSecurityStamp(face);
  if (!stamp || cardStock(face.setCode, face.borderColor).border !== '#090806') return [];
  const source = images.get(stamp.image);
  if (!source) throw Error('Authenticity stamp asset is unavailable.');
  return [
    {
      url: stamp.image,
      key: JSON.stringify([
        'security-stamp-black-stock-v1',
        stamp.image,
        source.width,
        source.height,
      ]),
      bytes: source.width * source.height * 4,
      build: async () => {
        const canvas = document.createElement('canvas');
        canvas.width = source.width;
        canvas.height = source.height;
        try {
          const c = canvas.getContext('2d', { willReadFrequently: true });
          if (!c) throw Error('Stamp preparation needs Canvas2D.');
          c.drawImage(source, 0, 0);
          const pixels = c.getImageData(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < pixels.data.length; i += 4) {
            if (!pixels.data[i + 3]) continue;
            const maximum = Math.max(pixels.data[i]!, pixels.data[i + 1]!, pixels.data[i + 2]!);
            if (maximum >= 24) continue;
            const weight = (1 - maximum / 24) ** 2;
            pixels.data[i] = pixels.data[i]! + 9 * weight;
            pixels.data[i + 1] = pixels.data[i + 1]! + 8 * weight;
            pixels.data[i + 2] = pixels.data[i + 2]! + 6 * weight;
          }
          c.putImageData(pixels, 0, 0);
          return await createImageBitmap(canvas);
        } finally {
          canvas.width = canvas.height = 0;
        }
      },
    },
  ];
}
