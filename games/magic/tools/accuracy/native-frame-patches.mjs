// Filter only reviewed frame pixels at source resolution before downsampling.
// Filtering a complete card first could leak adjacent title/footer/art pixels.
import { luminance } from './pixels-pure.mjs';
export const NATIVE_FRAME_FILTER = 'native-gaussian-0.8-frame-only-v1';
export function nativeFrameRegions(image, windows, bounds) {
  const factor = Math.min(488 / image.width, 680 / image.height),
    padX = (488 - image.width * factor) / 2,
    padY = (680 - image.height * factor) / 2;
  const source = (x, pad) => (x - pad + 0.5) / factor - 0.5;
  return Object.entries(windows).flatMap(([side, [axis, lo, hi, positions, span = 8]]) =>
    positions.map((along) => {
      const [normalLo, normalHi] = bounds[side];
      if (lo <= normalLo || hi >= normalHi || lo >= hi)
        throw Error('Matching interval leaves reviewed frame field');
      const canonical =
        axis === 'x'
          ? [normalLo, along - span, normalHi, along + span]
          : [along - span, normalLo, along + span, normalHi];
      const rect = [
        Math.max(0, Math.ceil(source(canonical[0], padX))),
        Math.max(0, Math.ceil(source(canonical[1], padY))),
        Math.min(image.width - 1, Math.floor(source(canonical[2], padX))),
        Math.min(image.height - 1, Math.floor(source(canonical[3], padY))),
      ];
      if (rect[0] > rect[2] || rect[1] > rect[3]) throw Error('Empty native frame field');
      return {
        side,
        axis,
        lo,
        hi,
        along,
        span,
        normalLo,
        normalHi,
        width: normalHi - normalLo + 1,
        height: span * 2 + 1,
        filter: NATIVE_FRAME_FILTER,
        rect,
        factor,
        padX,
        padY,
      };
    }),
  );
}
function weights(center, sigma, lo, hi) {
  const radius = Math.ceil(3 * sigma),
    start = Math.floor(center),
    result = new Map();
  let total = 0;
  for (let i = start - radius; i <= start + radius + 1; i++) {
    const weight = Math.exp(-0.5 * ((i - center) / sigma) ** 2),
      index = Math.max(lo, Math.min(hi, i));
    result.set(index, (result.get(index) ?? 0) + weight);
    total += weight;
  }
  return [...result].map(([i, w]) => [i, w / total]);
}
export function nativeFramePatches(image, windows, bounds, gray = luminance(image)) {
  return nativeFrameRegions(image, windows, bounds).map((region) => {
    const { rect, factor, padX, padY, ...shape } = region,
      { axis, normalLo, along, span, width, height } = shape,
      sigma = 0.8 / factor;
    const source = (x, pad) => (x - pad + 0.5) / factor - 0.5;
    const normalWeights = Array.from({ length: width }, (_, i) =>
      weights(
        source(normalLo + i, axis === 'x' ? padX : padY),
        sigma,
        axis === 'x' ? rect[0] : rect[1],
        axis === 'x' ? rect[2] : rect[3],
      ),
    );
    const alongWeights = Array.from({ length: height }, (_, j) =>
      weights(
        source(along - span + j, axis === 'x' ? padY : padX),
        sigma,
        axis === 'x' ? rect[1] : rect[0],
        axis === 'x' ? rect[3] : rect[2],
      ),
    );
    const values = new Uint8Array(width * height);
    for (let j = 0; j < height; j++)
      for (let i = 0; i < width; i++) {
        let value = 0;
        for (const [a, wa] of alongWeights[j])
          for (const [n, wn] of normalWeights[i])
            value += wa * wn * gray[(axis === 'x' ? a : n) * image.width + (axis === 'x' ? n : a)];
        values[j * width + i] = Math.round(value);
      }
    return { ...shape, values };
  });
}
