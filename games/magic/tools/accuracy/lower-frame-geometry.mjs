import { luminance } from './pixels.mjs';

export const LOWER_FRAME_VERSION = 'signed-lower-rim-v1';
export const LOWER_FRAME_WINDOWS = {
  top: 612,
  bottom: 644,
  spans: [
    [100, 15],
    [140, 15],
    [310, 15],
    [350, 15],
  ],
};

/** Locate the paper-to-rim and rim-to-black transitions separately. Fixed
 * windows exclude the central stamp and right loyalty plate. No image moves. */
export function measureLowerFrame(image, windows = LOWER_FRAME_WINDOWS) {
  const { top, bottom, spans } = windows;
  if (
    image.data.length !== image.width * image.height * 4 ||
    !Number.isInteger(top) ||
    !Number.isInteger(bottom) ||
    top < 2 ||
    bottom >= image.height - 2 ||
    bottom - top < 12 ||
    !spans.length ||
    spans.some(
      ([x, count]) =>
        !Number.isInteger(x) ||
        !Number.isInteger(count) ||
        x < 0 ||
        count < 3 ||
        x + count > image.width,
    )
  )
    throw Error('Invalid lower-frame windows');
  const gray = luminance(image);
  return spans.map(([x, count]) => {
    const values = [];
    for (let y = top; y <= bottom; y++) {
      let sum = 0;
      for (let dx = 0; dx < count; dx++)
        for (let dy = -1; dy <= 1; dy++) sum += gray[(y + dy) * image.width + x + dx];
      values.push(sum / (count * 3));
    }
    const gradient = values.slice(1, -1).map((_, i) => values[i] - values[i + 2]);
    const threshold = Math.max(10, Math.max(...gradient) * 0.15);
    const peaks = gradient.flatMap((strength, i) => {
      if (
        i < 1 ||
        i >= gradient.length - 1 ||
        strength < threshold ||
        strength <= gradient[i - 1] ||
        strength < gradient[i + 1]
      )
        return [];
      const a = gradient[i - 1],
        b = strength,
        c = gradient[i + 1];
      return [{ position: top + 1 + i + (a - c) / (2 * (a - 2 * b + c)), strength }];
    });
    // A single peak cannot tell a dark outer frame from its inside border.
    // Extra peaks can be lettering or bevels; do not silently choose one.
    const [inner, outer] = peaks;
    const status =
      peaks.length < 2
        ? 'missing-transition'
        : peaks.length > 2
          ? 'ambiguous'
          : inner.position < top + 4 || outer.position > bottom - 3
            ? 'search-boundary'
            : outer.position - inner.position < 3.5
              ? 'merged-transitions'
              : 'measured';
    return {
      x,
      count,
      status,
      peaks,
      inner: status === 'measured' ? inner.position : null,
      outer: status === 'measured' ? outer.position : null,
    };
  });
}

export function lowerFrameDifference(reference, rendered) {
  if (reference.length !== rendered.length) throw Error('Lower-frame spans disagree');
  return reference.map((ref, i) => {
    const sample = rendered[i];
    if (ref.x !== sample.x || ref.count !== sample.count) throw Error('Lower-frame spans disagree');
    return {
      x: ref.x,
      status: ref.status === 'measured' && sample.status === 'measured' ? 'measured' : 'uncertain',
      inner: ref.inner === null || sample.inner === null ? null : sample.inner - ref.inner,
      outer: ref.outer === null || sample.outer === null ? null : sample.outer - ref.outer,
    };
  });
}
