import { prepare, measure as paint, finish } from './abu-type-browser.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { cropGray } from './pixels-pure.mjs';
import { titleShape, compareTitleShape } from './letter-fill-metrics.mjs';
const pixels = (c) =>
  c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height);
const median = (v) => v.toSorted((a, b) => a - b)[Math.floor(v.length / 2)];
export async function measure(e, url, roles = ['title', 'type'], placements = {}) {
  await prepare(e, url, roles);
  const img = new Image();
  img.src = url;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = 488;
  c.height = 680;
  c.getContext('2d').drawImage(img, 0, 0);
  const scan = pixels(c);
  try {
    const result = {};
    for (const role of roles) {
      const p = globalThis.__abuState.prepared[role];
      if (!p) continue;
      const placement =
        placements[role] ??
        (role === 'type'
          ? { dx: -2, dy: -1, size: 0.5 }
          : role === 'artist'
            ? { dy: -0.75 }
            : role === 'stats'
              ? { dx: 1 }
              : {});
      paint(role, placement);
      const model = nativeGrayCrop(pixels(p.out), p.rect, p.origin),
        modelShape = titleShape(model, p.rect[2], p.rect[3]);
      paint(role, { ...placement, gray: 0 });
      const black = nativeGrayCrop(pixels(p.out), p.rect, p.origin);
      paint(role, { ...placement, gray: 255 });
      const white = nativeGrayCrop(pixels(p.out), p.rect, p.origin);
      const reference = cropGray(scan, p.rect).gray,
        referenceShape = titleShape(reference, p.rect[2], p.rect[3]),
        targets = [],
        samples = [];
      for (let i = 0; i < reference.length; i++) {
        const alpha = (white[i] - black[i]) / 255;
        if (alpha > 0.85) {
          const g = (reference[i] - black[i]) / alpha;
          if (g >= 0 && g <= 255) {
            targets.push(g);
            samples.push({ i, g });
          }
        }
      }
      // A thicker or misplaced model can put its opaque core on bare frame.
      // Keep that legacy estimate visible, but independently gate measurements
      // by the reference's local ink contrast in the model's fixed polarity.
      const polarity =
        modelShape.status === 'measured' && samples.length
          ? Math.sign(median(samples.map(({ i }) => modelShape.normalized[i]))) || 1
          : null;
      const matched =
        referenceShape.status === 'measured' && polarity !== null
          ? samples
              .filter(({ i }) => polarity * referenceShape.normalized[i] > 0.5)
              .map(({ g }) => g)
              .sort((a, b) => a - b)
          : [];
      result[role] = {
        gray: targets.length ? median(targets) : null,
        samples: targets.length,
        placement,
        matchedGray: matched.length ? median(matched) : null,
        matchedGray70: matched.length ? matched[Math.floor((matched.length - 1) * 0.7)] : null,
        matchedSamples: matched.length,
        matchedFraction: targets.length ? matched.length / targets.length : null,
        polarity,
        shape: compareTitleShape(referenceShape, modelShape),
      };
    }
    return result;
  } finally {
    finish();
    c.width = c.height = 0;
  }
}
