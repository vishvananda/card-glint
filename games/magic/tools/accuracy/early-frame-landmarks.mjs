import { blur } from './edges.mjs';
import { luminance, WIDTH, HEIGHT } from './pixels.mjs';

export const EARLY_BOUNDARY_VERSION = 'abu-art-keyline-v1';

/** Outer art keylines observed on the frozen Alpha/Unlimited development scans. */
export function earlyArtLandmarks() {
  return [
    ...[90, 240, 400].flatMap((x) => [
      { side: 'top', x, y: 66, axis: 'y', inward: 1 },
      { side: 'bottom', x, y: 376, axis: 'y', inward: -1 },
    ]),
    ...[130, 230, 310].flatMap((y) => [
      { side: 'left', x: 52, y, axis: 'x', inward: 1 },
      { side: 'right', x: 436, y, axis: 'x', inward: -1 },
    ]),
  ];
}

/**
 * Search outside-in for the first dark keyline, not the strongest art edge.
 * Positions are diagnostics only; callers may fit one shared cohort transform.
 * Endpoint peaks and weak/ambiguous strips remain explicitly uncertain.
 */
export function measureEarlyArt(image) {
  if (image.width !== WIDTH || image.height !== HEIGHT)
    throw Error('Early frame landmarks require the canonical comparison grid');
  const gray = blur(luminance(image), WIDTH, HEIGHT);
  return earlyArtLandmarks().map((point) => {
    const axisX = point.axis === 'x';
    const stride = axisX ? 1 : WIDTH;
    const scores = [];
    for (let d = -7; d <= 7; d++) {
      const x = point.x + (axisX ? d * point.inward : 0);
      const y = point.y + (axisX ? 0 : d * point.inward);
      let ridge = 0;
      for (let along = -15; along <= 15; along++) {
        const i = (y + (axisX ? along : 0)) * WIDTH + x + (axisX ? 0 : along);
        ridge += (gray[i - 3 * stride] + gray[i + 3 * stride]) / 2 - gray[i];
      }
      scores.push(ridge / 31);
    }
    const threshold = Math.max(6, Math.max(...scores) * 0.3);
    const peaks = scores.flatMap((v, i) =>
      i > 0 && i + 1 < scores.length && v >= threshold && v > scores[i - 1] && v >= scores[i + 1]
        ? [i]
        : [],
    );
    if (!peaks.length)
      return { ...point, detected: null, strength: 0, status: 'no-keyline', competing: false };
    const peak = peaks[0];
    const a = scores[peak - 1],
      b = scores[peak],
      c = scores[peak + 1];
    const fraction = (a - c) / (2 * (a - 2 * b + c));
    return {
      ...point,
      detected: point[point.axis] + (peak - 7 + fraction) * point.inward,
      strength: b,
      status: 'measured',
      competing: peaks.length > 1,
    };
  });
}
