import { luminance } from './pixels-pure.mjs';

// Explicit frame-only windows shared by fitting, independent model selection
// and untouched certification. Callers must prove these exclude card content.
export function scanBoundaryProfiles(image, windows, bounds) {
  if (image.width !== 488 || image.height !== 680) throw Error('Expected canonical scan');
  const gray = luminance(image);
  return Object.entries(windows).flatMap(([side, [axis, lo, hi, positions, halfSpan = 22]]) =>
    positions.map((along) => {
      const [sampleLo, sampleHi] = bounds[side],
        start = lo - 14,
        values = [];
      for (let p = start - 1; p <= hi + 15; p++) {
        const normal = Math.max(sampleLo, Math.min(sampleHi, p));
        let sum = 0;
        for (let a = along - halfSpan; a <= along + halfSpan; a++)
          sum += gray[(axis === 'x' ? a : normal) * 488 + (axis === 'x' ? normal : a)];
        values.push(sum / (2 * halfSpan + 1));
      }
      return {
        side,
        axis,
        lo,
        hi,
        along,
        start,
        gradient: values.slice(1, -1).map((_, i) => (values[i + 2] - values[i]) / 2),
      };
    }),
  );
}
