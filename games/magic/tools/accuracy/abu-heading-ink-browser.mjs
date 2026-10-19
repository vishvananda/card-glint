import { prepare, measure as paint, finish } from './abu-type-browser.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { cropGray } from './pixels-pure.mjs';
const pixels = (c) =>
  c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height);
const median = (v) => v.toSorted((a, b) => a - b)[Math.floor(v.length / 2)];
export async function measure(e, url, roles = ['title', 'type']) {
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
        role === 'type'
          ? { dx: -2, dy: -1, size: 0.5 }
          : role === 'artist'
            ? { dy: -0.75 }
            : role === 'stats'
              ? { dx: 1 }
              : {};
      paint(role, { ...placement, gray: 0 });
      const black = nativeGrayCrop(pixels(p.out), p.rect, p.origin);
      paint(role, { ...placement, gray: 255 });
      const white = nativeGrayCrop(pixels(p.out), p.rect, p.origin);
      const reference = cropGray(scan, p.rect).gray,
        targets = [];
      for (let i = 0; i < reference.length; i++) {
        const alpha = (white[i] - black[i]) / 255;
        if (alpha > 0.85) {
          const g = (reference[i] - black[i]) / alpha;
          if (g >= 0 && g <= 255) targets.push(g);
        }
      }
      result[role] = {
        gray: targets.length ? median(targets) : null,
        samples: targets.length,
        placement,
      };
    }
    return result;
  } finally {
    finish();
    c.width = c.height = 0;
  }
}
