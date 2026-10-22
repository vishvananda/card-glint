// Fixed disc-interior ink masks isolate glyphs from paper color, circles and shadows.
const clamp = (n) => Math.max(0, Math.min(1, n));
const median = (values) => {
  const v = [...values].sort((a, b) => a - b);
  return (v[Math.floor((v.length - 1) / 2)] + v[Math.ceil((v.length - 1) / 2)]) / 2;
};
const rgbMedian = (samples) => [0, 1, 2].map((c) => median(samples.map((p) => p[c])));
function rgb(image, x, y) {
  const ix = Math.floor(x),
    iy = Math.floor(y),
    fx = x - ix,
    fy = y - iy;
  if (ix < 0 || iy < 0 || ix + 1 >= image.width || iy + 1 >= image.height)
    throw Error('Glyph sample leaves image');
  return [0, 1, 2].map((c) => {
    const at = (iy * image.width + ix) * 4 + c;
    return (
      (image.data[at] * (1 - fx) + image.data[at + 4] * fx) * (1 - fy) +
      (image.data[at + image.width * 4] * (1 - fx) + image.data[at + image.width * 4 + 4] * fx) * fy
    );
  });
}
function opacity(color, paper, ink) {
  const vector = paper.map((p, c) => p - ink[c]),
    length = vector.reduce((n, v) => n + v * v, 0);
  if (length < 2500) throw Error('Glyph has insufficient ink/paper contrast');
  return clamp(vector.reduce((n, v, c) => n + v * (paper[c] - color[c]), 0) / length);
}
function darkest(image, disc) {
  const samples = [],
    r = disc.radius * 0.7;
  for (let dy = -Math.floor(r); dy <= r; dy++)
    for (let dx = -Math.floor(r); dx <= r; dx++)
      if (Math.hypot(dx, dy) <= r) samples.push(rgb(image, disc.x + dx, disc.y + dy));
  samples.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
  return rgbMedian(samples.slice(0, Math.max(3, Math.ceil(samples.length * 0.08))));
}
function blur(values, side) {
  const result = new Float32Array(values.length),
    weights = [1, 2, 1];
  for (let y = 1; y < side - 1; y++)
    for (let x = 1; x < side - 1; x++) {
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++)
          sum += values[(y + dy) * side + x + dx] * weights[dy + 1] * weights[dx + 1];
      result[y * side + x] = sum / 16;
    }
  return result;
}
export function extractManaGlyphPair(render, reference, disc) {
  if (disc.radius < 8 || disc.paper.length !== 3) throw Error('Unsupported mana glyph geometry');
  const side = 41,
    center = 20,
    sourceInk = darkest(render, disc),
    referenceInk = darkest(reference, disc);
  const paperPoints = [];
  const r = disc.radius * 0.8;
  for (let dy = -Math.floor(r); dy <= r; dy++)
    for (let dx = -Math.floor(r); dx <= r; dx++) {
      if (Math.hypot(dx, dy) > r) continue;
      let clear = true;
      for (const [sx, sy] of [
        [0, 0],
        [1.25, 0],
        [-1.25, 0],
        [0, 1.25],
        [0, -1.25],
      ]) {
        if (opacity(rgb(render, disc.x + dx + sx, disc.y + dy + sy), disc.paper, sourceInk) > 0.1) {
          clear = false;
          break;
        }
      }
      if (clear) paperPoints.push([dx, dy]);
    }
  const paperFor = (image) => {
    const colors = paperPoints
      .map(([dx, dy]) => rgb(image, disc.x + dx, disc.y + dy))
      .filter((p) => Math.max(...p) >= Math.max(...disc.paper) * 0.55);
    return {
      paper: colors.length >= 3 ? rgbMedian(colors) : disc.paper,
      points: colors.length,
      method: colors.length >= 3 ? 'source-guided-eroded-paper' : 'source-prior-fallback',
    };
  };
  const sourcePaper = paperFor(render),
    referencePaper = paperFor(reference);
  const field = (image, paper, ink) => {
    const values = new Float32Array(side * side),
      trusted = disc.radius - 0.75;
    for (let y = 0; y < side; y++)
      for (let x = 0; x < side; x++) {
        const dx = x - center,
          dy = y - center;
        if (Math.hypot(dx, dy) > trusted) continue;
        const alpha = opacity(rgb(image, disc.x + dx, disc.y + dy), paper, ink);
        values[y * side + x] = clamp((alpha - 0.15) / 0.7);
      }
    return blur(values, side);
  };
  return {
    side,
    maskRadius: disc.radius * 0.7,
    source: field(render, disc.paper, sourceInk),
    nativeControl: field(render, sourcePaper.paper, sourceInk),
    reference: field(reference, referencePaper.paper, referenceInk),
    pigment: {
      sourcePaper: disc.paper,
      sourceInk,
      nativePaper: sourcePaper,
      referencePaper,
      referenceInk,
    },
  };
}
export class ManaGlyphObjective {
  constructor(source, reference, side, maskRadius) {
    if (side < 3 || source.length !== side * side || reference.length !== source.length)
      throw Error('Invalid glyph objective dimensions');
    this.source = source;
    this.side = side;
    this.center = (side - 1) / 2;
    this.points = [];
    let energy = 0;
    for (let y = 0; y < side; y++)
      for (let x = 0; x < side; x++)
        if (Math.hypot(x - this.center, y - this.center) <= maskRadius) {
          const value = reference[y * side + x];
          energy += value * value;
          this.points.push([x - this.center, y - this.center, value]);
        }
    if (energy < 2) throw Error('Glyph reference has too little ink');
    this.energy = energy;
  }
  score({ scale = 1, dx = 0, dy = 0 } = {}) {
    if (
      !Number.isFinite(scale) ||
      scale < 0.9 ||
      scale > 1.1 ||
      !Number.isFinite(dx) ||
      Math.abs(dx) > 1 ||
      !Number.isFinite(dy) ||
      Math.abs(dy) > 1
    )
      throw Error('Glyph candidate exceeds measured bounds');
    const { source, side, center } = this;
    let product = 0,
      energy = 0;
    for (const [x, y, reference] of this.points) {
      const sx = (x - dx) / scale + center,
        sy = (y - dy) / scale + center,
        ix = Math.floor(sx),
        iy = Math.floor(sy),
        fx = sx - ix,
        fy = sy - iy,
        at = iy * side + ix;
      const value =
        (source[at] * (1 - fx) + source[at + 1] * fx) * (1 - fy) +
        (source[at + side] * (1 - fx) + source[at + side + 1] * fx) * fy;
      product += reference * value;
      energy += value * value;
    }
    return (2 * product) / (this.energy + energy);
  }
}
