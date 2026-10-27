import { outerManaCircle } from './abu-mana-ring.mjs';

function paperRaster(image) {
  const { width, height, data } = image,
    out = new Uint8Array(data.length),
    temporary = new Float32Array(data.length);
  // Fixed half-pixel sigma suppresses print grain before perimeter search.
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      for (let k = 0; k < 4; k++) {
        const i = (y * width + x) * 4 + k,
          left = (y * width + Math.max(0, x - 1)) * 4 + k,
          right = (y * width + Math.min(width - 1, x + 1)) * 4 + k;
        temporary[i] = (data[left] + 6 * data[i] + data[right]) / 8;
      }
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      for (let k = 0; k < 4; k++) {
        const i = (y * width + x) * 4 + k,
          top = (Math.max(0, y - 1) * width + x) * 4 + k,
          bottom = (Math.min(height - 1, y + 1) * width + x) * 4 + k;
        out[i] = Math.round((temporary[top] + 6 * temporary[i] + temporary[bottom]) / 8);
      }
  return { width, height, data: out };
}

/** Reference-only perimeter measurement with a known physical size prior.
 * Contrast polarity may differ from the renderer; a glyph/frame edge is not
 * accepted merely because it is stronger than an almost invisible paper rim.
 * Units are pixels of the supplied raster, including range and tolerances.
 */
export function referenceManaCircle(image, { x, y, radius, range = 3, radiusTolerance = 0.75 }) {
  if (
    ![x, y, radius, range, radiusTolerance].every(Number.isFinite) ||
    radius <= radiusTolerance ||
    range <= 0 ||
    radiusTolerance <= 0
  )
    throw Error('Invalid reference circle prior');
  if (
    !image ||
    !Number.isInteger(image.width) ||
    !Number.isInteger(image.height) ||
    image.width <= 0 ||
    image.height <= 0 ||
    !ArrayBuffer.isView(image.data) ||
    image.data.length !== image.width * image.height * 4
  )
    throw Error('Invalid reference circle raster');
  // Filter once per measurement; callers may reuse and mutate diagnostic buffers.
  const paper = paperRaster(image);
  const candidates = ['light-on-dark', 'dark-on-light'].map((polarity) => ({
    ...outerManaCircle(paper, {
      x,
      y,
      range,
      radiusRange: [radius - radiusTolerance, radius + radiusTolerance],
      polarity,
    }),
    polarity,
  }));
  const valid = candidates
      .filter(
        (c) =>
          c.status === 'measured' &&
          Math.abs(c.x - x) < range - 0.25 &&
          Math.abs(c.y - y) < range - 0.25,
      )
      .sort((a, b) => b.score - a.score),
    best = valid[0],
    other = valid[1];
  if (!best) return { status: 'unresolved', reason: 'weak-or-boundary-perimeter', candidates };
  if (candidates.some((c) => !valid.includes(c) && c.score > best.score * 1.2))
    return { status: 'unresolved', reason: 'stronger-unresolved-edge', candidates };
  if (other && best.score < other.score * 1.2)
    return { status: 'unresolved', reason: 'ambiguous-contrast-polarity', candidates };
  return {
    ...best,
    status: 'measured',
    scoreRatio: other ? best.score / other.score : null,
    candidates,
  };
}
