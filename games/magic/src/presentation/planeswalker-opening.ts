import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import type { FaceRect } from './face-layout.js';

/** Fill the old sprite's closed type aperture before applying the new contour.
 * Work is cached during face preparation. The zero-alpha component cannot reach
 * the art, rules panel or exterior; feathering includes two source pixels only. */
export async function buildWalkerOpening(source: ImageBitmap, large: boolean) {
  const x = 0.04724 * 488,
    y = 0.02655 * 680,
    width = 0.91339 * 488;
  const scale = width / source.width;
  const oldTop = (large ? 0.49044 : 0.55793) * 680 + 5;
  const top = Math.floor((oldTop - 2.25 - y) / scale);
  const bottom = Math.ceil((oldTop + 43 - y) / scale);
  const canvas = rasterCanvas();
  canvas.width = source.width;
  canvas.height = bottom - top;
  const c = canvas.getContext('2d');
  if (!c) throw Error('Planeswalker aperture needs Canvas2D');
  try {
    c.drawImage(source, 0, top, source.width, bottom - top, 0, 0, canvas.width, canvas.height);
    const pixels = c.getImageData(0, 0, canvas.width, canvas.height),
      d = pixels.data,
      w = canvas.width,
      h = canvas.height;
    const seedX = Math.round((244 - x) / scale),
      seedY = Math.round((oldTop + 16 - y) / scale) - top;
    const seed = seedY * w + seedX;
    if (d[seed * 4 + 3]! > 1) throw Error('Pinned planeswalker type aperture is not transparent');
    const visited = new Uint8Array(w * h),
      queue = new Int32Array(w * h);
    let end = 1;
    queue[0] = seed;
    visited[seed] = 1;
    for (let at = 0; at < end; at++) {
      const p = queue[at]!,
        px = p % w,
        py = Math.floor(p / w);
      if (!px || !py || px === w - 1 || py === h - 1)
        throw Error('Planeswalker type aperture is not closed');
      for (const n of [p - 1, p + 1, p - w, p + w])
        if (!visited[n] && d[n * 4 + 3]! <= 1) {
          visited[n] = 1;
          queue[end++] = n;
        }
    }
    const selected = visited.slice();
    for (let at = 0; at < end; at++) {
      const p = queue[at]!,
        px = p % w,
        py = Math.floor(p / w);
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++) {
          const xx = px + dx,
            yy = py + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          const n = yy * w + xx;
          if (d[n * 4 + 3]! < 254) selected[n] = 1;
        }
    }
    const output = c.createImageData(w, h);
    for (let p = 0; p < w * h; p++)
      if (selected[p]) {
        const alpha = d[p * 4 + 3]! / 255,
          strip = (p % w) * 4;
        for (let k = 0; k < 3; k++)
          output.data[p * 4 + k] = Math.round(d[p * 4 + k]! * alpha + d[strip + k]! * (1 - alpha));
        output.data[p * 4 + 3] = 255;
      }
    c.putImageData(output, 0, 0);
    const rect: FaceRect = [x / 488, (y + top * scale) / 680, width / 488, (h * scale) / 680];
    return { image: await createImageBitmap(canvas), rect };
  } finally {
    canvas.width = canvas.height = 0;
  }
}

export function walkerOpeningRect(source: ImageBitmap, large: boolean): FaceRect {
  const scale = (0.91339 * 488) / source.width,
    oldTop = (large ? 0.49044 : 0.55793) * 680 + 5;
  const top = Math.floor((oldTop - 2.25 - 0.02655 * 680) / scale),
    bottom = Math.ceil((oldTop + 43 - 0.02655 * 680) / scale);
  return [0.04724, (0.02655 * 680 + top * scale) / 680, 0.91339, ((bottom - top) * scale) / 680];
}
