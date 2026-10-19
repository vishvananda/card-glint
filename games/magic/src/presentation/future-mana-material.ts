import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import { futureManaAsset, futureGenericSources } from './future-mana.js';
import type { Rgb } from './hsb.js';

/** FUT nonfoil scans, ordinary-frame calibration cohort. Separate disc and rim
 * white balance preserves source shading; no scan-specific colors are stored. */
const PROFILES: Readonly<Record<string, readonly [Rgb, Rgb]>> = {
  N: [
    [0.64, 0.67, 0.73],
    [0.7, 0.72, 0.76],
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
  if (face.frameTemplate !== 'future') return [];
  const calibrated =
    face.setCode?.toLowerCase() === 'fut' && face.colorCalibration === 'set-hsb-v1';
  const seen = new Set<string>();
  return [...new Set(face.manaSymbols ?? [])].flatMap((symbol) => {
    const generic = /^(?:\d+|X)$/.test(symbol),
      profile = calibrated ? PROFILES[generic ? 'N' : symbol] : undefined,
      url = futureManaAsset(symbol),
      source = url ? images.get(url) : undefined;
    if ((!profile && !generic) || !url || !source || seen.has(url)) return [];
    seen.add(url);
    const backgrounds = generic
      ? futureGenericSources().map((url) => {
          const image = images.get(url);
          if (!image || image.width !== source.width || image.height !== source.height)
            throw Error('Future generic medallion requires all matching pinned numeral sources');
          return image;
        })
      : [];
    return [
      {
        url,
        key: JSON.stringify([
          'future-mana-color-blank-v2',
          url,
          source.width,
          source.height,
          profile,
          generic ? futureGenericSources() : null,
        ]),
        bytes: source.width * source.height * 4,
        build: () => build(source, profile, backgrounds),
      },
    ];
  });
}

async function build(
  source: ImageBitmap,
  profile: readonly [Rgb, Rgb] | undefined,
  backgrounds: ImageBitmap[],
) {
  const canvas = rasterCanvas();
  canvas.width = source.width;
  canvas.height = source.height;
  try {
    const c = canvas.getContext('2d', { willReadFrequently: true })!;
    c.drawImage(source, 0, 0);
    const image = c.getImageData(0, 0, canvas.width, canvas.height);
    for (const background of backgrounds) {
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.drawImage(background, 0, 0);
      const pixels = c.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 0; i < image.data.length; i++)
        if (i % 4 !== 3) image.data[i] = Math.max(image.data[i]!, pixels[i]!);
    }
    const [center, rim] = profile ?? [
      [1, 1, 1],
      [1, 1, 1],
    ];
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
