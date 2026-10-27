// Fixed, image-only frame-texture checks. No card text or renderer pixels enter them.
const WIDTH = 20;
const HEIGHT = 36;
const CORE_WIDTH = 16;
const CORE_HEIGHT = 32;
export class FrameTexturePatch {
  #values;
  constructor(values) {
    if (values.length !== WIDTH * HEIGHT || !Array.from(values).every(Number.isFinite))
      throw RangeError('Expected a finite 20×36 grayscale patch in byte units');
    this.#values = Float64Array.from(values);
  }
  value(index) {
    return this.#values[index];
  }
  sample(x, y) {
    const left = Math.floor(x),
      top = Math.floor(y),
      fx = x - left,
      fy = y - top;
    const right = Math.min(WIDTH - 1, left + 1),
      bottom = Math.min(HEIGHT - 1, top + 1),
      d = this.#values;
    return (
      (d[top * WIDTH + left] * (1 - fx) + d[top * WIDTH + right] * fx) * (1 - fy) +
      (d[bottom * WIDTH + left] * (1 - fx) + d[bottom * WIDTH + right] * fx) * fy
    );
  }
}
export class FrameTextureObjective {
  #centered;
  #energy;
  #standardDeviation;
  constructor(patch) {
    if (!(patch instanceof FrameTexturePatch)) throw TypeError('Unprepared frame patch');
    const values = Array.from({ length: CORE_WIDTH * CORE_HEIGHT }, (_, i) =>
      patch.value((Math.floor(i / CORE_WIDTH) + 2) * WIDTH + (i % CORE_WIDTH) + 2),
    );
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    this.#centered = Float64Array.from(values, (v) => v - mean);
    this.#energy = this.#centered.reduce((s, v) => s + v * v, 0);
    this.#standardDeviation = Math.sqrt(this.#energy / values.length);
  }
  score(source, dx = 0, dy = 0) {
    if (!(source instanceof FrameTexturePatch)) throw TypeError('Unprepared frame patch');
    if (![dx, dy].every(Number.isFinite) || Math.abs(dx) > 2 || Math.abs(dy) > 2)
      throw RangeError('Frame patch displacement exceeds its safe margin');
    let sum = 0,
      square = 0,
      dot = 0;
    for (let i = 0; i < this.#centered.length; i++) {
      const value = source.sample((i % CORE_WIDTH) + 2 + dx, Math.floor(i / CORE_WIDTH) + 2 + dy);
      sum += value;
      square += value * value;
      dot += this.#centered[i] * value;
    }
    const energy = square - (sum * sum) / this.#centered.length;
    return {
      score: this.#energy > 1e-9 && energy > 1e-9 ? dot / Math.sqrt(this.#energy * energy) : 0,
      templateStd: this.#standardDeviation,
      sourceStd: Math.sqrt(Math.max(0, energy) / this.#centered.length),
    };
  }
}
export function grayFrameTexturePatch(image) {
  if (image.width !== WIDTH || image.height !== HEIGHT || image.data.length !== WIDTH * HEIGHT * 4)
    throw RangeError('Expected a 20×36 RGBA frame window');
  const data = Float32Array.from(
    { length: WIDTH * HEIGHT },
    (_, i) =>
      0.2126 * image.data[i * 4] + 0.7152 * image.data[i * 4 + 1] + 0.0722 * image.data[i * 4 + 2],
  );
  const blurred = data.slice();
  for (let y = 1; y < HEIGHT - 1; y++)
    for (let x = 1; x < WIDTH - 1; x++) {
      let value = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++)
          value += data[(y + dy) * WIDTH + x + dx] * (dx === 0 ? 2 : 1) * (dy === 0 ? 2 : 1);
      blurred[y * WIDTH + x] = value / 16;
    }
  return Array.from(blurred);
}
