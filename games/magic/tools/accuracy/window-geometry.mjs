import { luminance, WIDTH, HEIGHT } from './pixels.mjs';
import { median } from './metrics.mjs';

export const WINDOW_GEOMETRY_VERSION = 'paired-window-edges-v1';
/** Fixed edge strips, independent of text, art detail and candidate parameters.
 * Width and center are reported separately; no measurement moves an image. */
export function measureWindows(image, frame = 'normal') {
  if (image.width !== WIDTH || image.height !== HEIGHT)
    throw Error('Window geometry requires the canonical comparison grid');
  const gray = luminance(image),
    retro = frame.startsWith('retro-');
  const specs = retro
    ? {
        art: {
          ranges: [
            [48, 70],
            [420, 444],
          ],
          spans: [105, 205, 305],
          kind: 'ridge',
        },
        rules: {
          ranges: [
            [48, 76],
            [410, 444],
          ],
          spans: [430, 485, 540],
          kind: 'paper',
        },
      }
    : {
        art: {
          ranges: [
            [32, 44],
            [443, 456],
          ],
          spans: [105, 210, 315],
          kind: 'ridge',
        },
        rules: {
          ranges: [
            [29, 41],
            [445, 456],
          ],
          spans: [450, 500, 550],
          kind: 'paper',
        },
      };
  return Object.fromEntries(
    Object.entries(specs).map(([name, spec]) => {
      const sides = spec.ranges.map(([lo, hi], side) => {
        const strips = spec.spans.map((y) => {
          const values = [];
          for (let x = lo - 1; x <= hi + 1; x++) {
            let sum = 0;
            for (let yy = y; yy < y + 30; yy++) {
              const i = yy * WIDTH + x;
              sum +=
                spec.kind === 'ridge'
                  ? (gray[i - 2] + gray[i + 2]) / 2 - gray[i]
                  : (side ? -1 : 1) * (gray[i + 1] - gray[i - 1]);
            }
            values.push(sum / 30);
          }
          const peaks = values
            .flatMap((v, i) =>
              i > 0 && i + 1 < values.length && v > values[i - 1] && v >= values[i + 1]
                ? [{ i, v }]
                : [],
            )
            .sort((a, b) => b.v - a.v);
          const best = peaks[0];
          if (!best || best.v < 8) return { y, status: 'missing', position: null };
          const { i, v } = best,
            a = values[i - 1],
            c = values[i + 1],
            position = lo - 1 + i + (a - c) / (2 * (a - 2 * v + c));
          const status =
            position < lo + 0.5 || position > hi - 0.5
              ? 'boundary'
              : peaks.some((p) => Math.abs(p.i - i) > 3 && p.v > v * 0.8)
                ? 'ambiguous'
                : 'measured';
          return { y, status, position, strength: v };
        });
        const good = strips.filter((s) => s.status === 'measured'),
          position = good.length >= 2 ? median(good.map((s) => s.position)) : null;
        const spread =
          position === null ? null : Math.max(...good.map((s) => Math.abs(s.position - position)));
        return { strips, position, spread, reliable: position !== null && spread <= 1.5 };
      });
      const [left, right] = sides,
        reliable = sides.every((s) => s.reliable);
      return [
        name,
        {
          left,
          right,
          reliable,
          width: reliable ? right.position - left.position : null,
          center: reliable ? (right.position + left.position) / 2 : null,
        },
      ];
    }),
  );
}

export function windowDifference(reference, rendered) {
  return Object.fromEntries(
    ['art', 'rules'].map((name) => {
      const a = reference[name],
        b = rendered[name];
      return [
        name,
        a.reliable && b.reliable
          ? {
              status: 'measured',
              left: b.left.position - a.left.position,
              right: b.right.position - a.right.position,
              width: b.width - a.width,
              center: b.center - a.center,
            }
          : { status: 'uncertain' },
      ];
    }),
  );
}
