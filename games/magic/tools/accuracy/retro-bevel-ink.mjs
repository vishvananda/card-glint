import { median } from './metrics.mjs';

/** Check a fixed left-bevel strip on saved renders. Normalizing by its mean
 * tolerates brightness gain but exposes a white overlay washing out texture.
 * This compares asset preservation, not scan registration or scan similarity. */
export function compareRetroBevelShadow(before, after) {
  const profile = (image) => {
    if (image.width !== 488 || image.height !== 680) throw Error('Expected canonical card image');
    const values = Array.from({ length: 160 }, (_, row) => {
      const i = ((row + 425) * image.width + 55) * 4;
      return image.data[i] * 0.2126 + image.data[i + 1] * 0.7152 + image.data[i + 2] * 0.0722;
    });
    const mean = values.reduce((n, v) => n + v, 0) / values.length;
    return values.map((v) => v / Math.max(mean, 1) - 1);
  };
  const a = profile(before),
    b = profile(after);
  const rms = (values) => Math.sqrt(values.reduce((n, v) => n + v * v, 0) / values.length);
  const beforeContrast = rms(a),
    afterContrast = rms(b),
    normalizedProfileRms = rms(a.map((v, i) => v - b[i]));
  return {
    beforeContrast,
    afterContrast,
    contrastRetention: beforeContrast > 0.01 ? afterContrast / beforeContrast : null,
    normalizedProfileRms,
    status:
      beforeContrast <= 0.01
        ? 'weak-texture'
        : normalizedProfileRms < 0.02 && Math.abs(afterContrast / beforeContrast - 1) < 0.15
          ? 'preserved'
          : 'texture-changed',
  };
}
// Fixed ordinary retro-gold paper neighborhood. These locate a keyline for
// polarity measurement only; they never transform scans or fit renderer inputs.
const sides = {
  left: { axis: 0, range: [45, 56], span: [440, 575], direction: 1, expected: 1 },
  right: { axis: 0, range: [431, 443], span: [440, 575], direction: -1, expected: -1 },
  top: { axis: 1, range: [402, 415], span: [85, 403], direction: 1, expected: -1 },
  bottom: { axis: 1, range: [597, 610], span: [85, 403], direction: -1, expected: 1 },
};
export function measureRetroBevel(image) {
  if (image.width !== 488 || image.height !== 680) throw Error('Expected canonical card image');
  return Object.fromEntries(
    Object.entries(sides).map(([name, side]) => {
      const profile = (n) => {
        const values = [];
        for (let t = side.span[0]; t <= side.span[1]; t++) {
          const x = side.axis === 0 ? n : t,
            y = side.axis === 1 ? n : t;
          const i = (y * image.width + x) * 4;
          values.push(
            image.data[i] * 0.2126 + image.data[i + 1] * 0.7152 + image.data[i + 2] * 0.0722,
          );
        }
        return median(values);
      };
      const candidates = Array.from(
        { length: side.range[1] - side.range[0] + 1 },
        (_, i) => side.range[0] + i,
      );
      const keyline = (n) => profile(n - 2) + profile(n + 2) - 2 * profile(n);
      const edge = candidates.reduce((a, b) => (keyline(a) > keyline(b) ? a : b));
      const contrast =
        median([2, 3, 4].map((d) => profile(edge + d * side.direction))) -
        median([8, 9, 10].map((d) => profile(edge + d * side.direction)));
      const status = side.range.includes(edge)
        ? 'boundary-uncertain'
        : keyline(edge) < 8
          ? 'weak-keyline'
          : Math.abs(contrast) < 8
            ? 'weak-contrast'
            : contrast * side.expected > 0
              ? 'matches'
              : 'reversed';
      return [name, { edge, contrast, status }];
    }),
  );
}
