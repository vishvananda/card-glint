// MIR/ONS cost discs have light paper over the frame. This physical prior is
// set-wide; a stronger dark edge inside a glyph must not replace its paper rim.
import { outerManaCircle } from './abu-mana-ring.mjs';
export function oldFrameManaDisc(image, { x, y, radius, range = 6, radiusTolerance = 1 }) {
  if (
    !image ||
    !Number.isInteger(image.width) ||
    !Number.isInteger(image.height) ||
    image.width <= 0 ||
    image.height <= 0 ||
    !ArrayBuffer.isView(image.data) ||
    image.data.length !== image.width * image.height * 4 ||
    ![x, y, radius, range, radiusTolerance].every(Number.isFinite) ||
    range <= 0 ||
    radiusTolerance <= 0 ||
    radius <= radiusTolerance ||
    x - range - radius - radiusTolerance - 2 < 0 ||
    y - range - radius - radiusTolerance - 2 < 0 ||
    x + range + radius + radiusTolerance + 2 >= image.width ||
    y + range + radius + radiusTolerance + 2 >= image.height
  )
    throw Error('Invalid old-frame mana disc prior or raster');
  const data = new Uint8Array(image.data);
  // Fixed separable sigma~0.5 suppresses scan dots, never a per-card fit.
  const temporary = new Float32Array(data.length);
  const loX = Math.floor(x - range - radius - radiusTolerance - 2),
    hiX = Math.ceil(x + range + radius + radiusTolerance + 2),
    loY = Math.floor(y - range - radius - radiusTolerance - 2),
    hiY = Math.ceil(y + range + radius + radiusTolerance + 2);
  for (let yy = loY; yy <= hiY; yy++)
    for (let xx = loX; xx <= hiX; xx++)
      for (let k = 0; k < 3; k++) {
        const i = (yy * image.width + xx) * 4 + k;
        temporary[i] = (image.data[i - 4] + 6 * image.data[i] + image.data[i + 4]) / 8;
      }
  for (let yy = loY + 1; yy < hiY; yy++)
    for (let xx = loX; xx <= hiX; xx++)
      for (let k = 0; k < 3; k++) {
        const i = (yy * image.width + xx) * 4 + k;
        data[i] = Math.round(
          (temporary[i - image.width * 4] + 6 * temporary[i] + temporary[i + image.width * 4]) / 8,
        );
      }
  const c = outerManaCircle(
    { ...image, data },
    {
      x,
      y,
      range,
      radiusRange: [radius - radiusTolerance, radius + radiusTolerance],
      polarity: 'light-on-dark',
    },
  );
  if (
    c.status !== 'measured' ||
    c.score < 8 ||
    Math.abs(c.x - x) >= range - 0.25 ||
    Math.abs(c.y - y) >= range - 0.25
  )
    return { ...c, status: 'unresolved', reason: 'weak-or-boundary-light-paper-rim' };
  return { ...c, status: 'measured', polarity: 'light-on-dark' };
}
