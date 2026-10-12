import { inkEdges } from './edges.mjs';
import { luminance } from './pixels.mjs';
import { median, quantile } from './metrics.mjs';

export const PLATE_GEOMETRY_VERSION = 'plate-interior-v1';

/** Signed paper transitions, independently located in three fixed horizontal
 * strips. These measurements never register, resize or move either image. */
export function measurePlate(image, { top, bottom, spans, inkX }) {
  const { width, height } = image;
  if (
    image.data.length !== width * height * 4 ||
    spans.length < 3 ||
    [top, bottom].some(
      ([a, b]) =>
        !Number.isInteger(a) || !Number.isInteger(b) || a < 2 || b >= height - 2 || a >= b,
    ) ||
    spans.some(
      ([x, count]) =>
        !Number.isInteger(x) || !Number.isInteger(count) || x < 0 || count < 3 || x + count > width,
    ) ||
    inkX[0] < 0 ||
    inkX[1] > width ||
    inkX[0] >= inkX[1] ||
    top[1] >= bottom[0]
  )
    throw Error('Invalid plate measurement windows');
  const gray = luminance(image);
  const edges = Object.fromEntries(
    [
      ['top', top, 1],
      ['bottom', bottom, -1],
    ].map(([side, range, sign]) => {
      const strips = spans.map(([x, count]) => {
        const values = [];
        // Average along the straight edge, then measure the inward brightness
        // transition. Ink, outer art ridges and shadow recovery have other signs
        // or lie outside these independently specified search windows.
        for (let y = range[0] - 1; y <= range[1] + 1; y++) {
          let sum = 0;
          for (let xx = x; xx < x + count; xx++)
            sum += sign * (gray[(y + 1) * width + xx] - gray[(y - 1) * width + xx]);
          values.push(sum / count);
        }
        const peaks = values.flatMap((v, i) =>
          i > 0 && i + 1 < values.length && v > values[i - 1] && v >= values[i + 1]
            ? [{ index: i, strength: v }]
            : [],
        );
        peaks.sort((a, b) => b.strength - a.strength);
        const best = peaks[0];
        if (!best || best.strength < 12)
          return { x, count, status: 'missing-edge', position: null };
        const competing = peaks.find(
          (p) => Math.abs(p.index - best.index) > 3 && p.strength >= best.strength * 0.8,
        );
        const i = best.index,
          a = values[i - 1],
          b = values[i],
          c = values[i + 1];
        const fraction = (a - c) / (2 * (a - 2 * b + c));
        const position = range[0] - 1 + i + fraction;
        const status =
          position <= range[0] + 0.5 || position >= range[1] - 0.5
            ? 'search-boundary'
            : competing
              ? 'ambiguous'
              : 'measured';
        return { x, count, status, position, strength: best.strength };
      });
      const usable = strips.filter((s) => s.status === 'measured');
      const position = usable.length >= 3 ? median(usable.map((s) => s.position)) : null;
      const spread =
        position === null ? null : Math.max(...usable.map((s) => Math.abs(s.position - position)));
      return [side, { strips, position, spread, reliable: position !== null && spread <= 1.5 }];
    }),
  );
  const reliable = edges.top.reliable && edges.bottom.reliable;
  return {
    edges,
    reliable,
    interiorHeight: reliable ? edges.bottom.position - edges.top.position : null,
    ink: reliable
      ? interiorInk(gray, width, inkX, edges.top.position, edges.bottom.position)
      : null,
  };
}

function interiorInk(gray, stride, [left, right], top, bottom) {
  // Borders and symbols are excluded before local contrast estimation, so they
  // cannot dominate the text bounds. Coordinates remain on the original grid.
  const y0 = Math.ceil(top + 6),
    y1 = Math.floor(bottom - 3);
  const width = right - left,
    height = y1 - y0 + 1;
  if (height < 5) return null;
  const crop = new Float32Array(width * height);
  for (let y = 0; y < height; y++)
    crop.set(gray.subarray((y + y0) * stride + left, (y + y0) * stride + right), y * width);
  const { ink, smooth } = inkEdges(crop, width, height);
  // Scan grain can have local contrast without being dark printed lettering.
  // Gate it against the paper/ink distribution, preserving brightness changes.
  const paper = quantile(smooth, 0.75),
    dark = quantile(smooth, 0.1);
  const maximumInk = paper - Math.max(20, (paper - dark) * 0.45);
  for (let i = 0; i < ink.length; i++) if (smooth[i] > maximumInk) ink[i] = 0;
  const counts = Array.from({ length: height }, (_, y) =>
    ink.subarray(y * width, (y + 1) * width).reduce((a, b) => a + b, 0),
  );
  const threshold = Math.max(3, Math.max(...counts) * 0.03);
  const rows = counts.flatMap((count, y) => (count >= threshold ? [y] : []));
  if (!rows.length) return { status: 'missing-ink', top: null, bottom: null };
  const first = rows[0],
    last = rows.at(-1);
  return {
    status: first <= 1 || last >= height - 2 ? 'touches-search-boundary' : 'measured',
    top: y0 + first,
    bottom: y0 + last,
    height: last - first + 1,
    center: y0 + (first + last) / 2,
    plateCenterOffset: y0 + (first + last) / 2 - (top + bottom) / 2,
  };
}

/** Positive deltas mean the rendering is lower/taller. No offsets are applied. */
export function plateDifference(reference, rendered) {
  if (!reference.reliable || !rendered.reliable) return { status: 'uncertain' };
  const top = rendered.edges.top.position - reference.edges.top.position;
  const bottom = rendered.edges.bottom.position - reference.edges.bottom.position;
  const ink =
    reference.ink?.status === 'measured' && rendered.ink?.status === 'measured'
      ? {
          top: rendered.ink.top - reference.ink.top,
          bottom: rendered.ink.bottom - reference.ink.bottom,
          center: rendered.ink.center - reference.ink.center,
          height: rendered.ink.height - reference.ink.height,
          plateCenterOffset: rendered.ink.plateCenterOffset - reference.ink.plateCenterOffset,
        }
      : null;
  return { status: 'measured', top, bottom, center: (top + bottom) / 2, height: bottom - top, ink };
}
