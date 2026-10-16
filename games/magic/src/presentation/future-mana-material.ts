import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import { futureManaAsset } from './future-mana.js';
import type { Rgb } from './hsb.js';

/** FUT nonfoil scans, ordinary-frame calibration cohort. Separate disc and rim
 * white balance preserves source shading; no scan-specific colors are stored. */
const PROFILES: Readonly<Record<string, readonly [Rgb, Rgb]>> = {
  N: [
    [0.64, 0.67, 0.72],
    [0.7, 0.72, 0.75],
  ],
  W: [
    [0.86, 0.86, 0.86],
    [0.92, 0.93, 1.02],
  ],
  U: [
    [0.64, 0.64, 0.7],
    [0.61, 0.66, 0.73],
  ],
  B: [
    [0.63, 0.58, 0.54],
    [0.51, 0.5, 0.5],
  ],
  R: [
    [0.79, 0.77, 0.7],
    [0.91, 0.98, 0.76],
  ],
  G: [
    [0.81, 0.71, 0.78],
    [0.91, 0.77, 0.91],
  ],
};

export function futureManaMaterialJobs(face: RenderedCardInput, images: CanvasImages) {
  if (
    face.frameTemplate !== 'future' ||
    face.setCode?.toLowerCase() !== 'fut' ||
    face.colorCalibration !== 'set-hsb-v1'
  )
    return [];
  return [...new Set(face.manaSymbols ?? [])].flatMap((symbol) => {
    const profile = PROFILES[/^(?:\d+|X)$/.test(symbol) ? 'N' : symbol],
      url = futureManaAsset(symbol),
      source = url ? images.get(url) : undefined;
    if (!profile || !url || !source) return [];
    return [
      {
        url,
        key: JSON.stringify(['future-mana-color-v1', url, source.width, source.height, profile]),
        bytes: source.width * source.height * 4,
        build: () => build(source, profile),
      },
    ];
  });
}

async function build(source: ImageBitmap, [center, rim]: readonly [Rgb, Rgb]) {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  try {
    const c = canvas.getContext('2d', { willReadFrequently: true })!;
    c.drawImage(source, 0, 0);
    const image = c.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++)
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        if (!image.data[i + 3]) continue;
        const r = Math.hypot((x + 0.5) / canvas.width - 0.5, (y + 0.5) / canvas.height - 0.5),
          t = Math.max(0, Math.min(1, (r - 0.31) / 0.03)),
          weight = t * t * (3 - 2 * t);
        for (let k = 0; k < 3; k++)
          image.data[i + k] = Math.round(
            image.data[i + k]! * (center[k]! * (1 - weight) + rim[k]! * weight),
          );
      }
    c.putImageData(image, 0, 0);
    return await createImageBitmap(canvas);
  } finally {
    canvas.width = canvas.height = 0;
  }
}
