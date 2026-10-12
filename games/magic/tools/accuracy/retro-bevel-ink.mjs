import { median } from './metrics.mjs';
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
