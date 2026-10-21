// Filter only reviewed frame pixels at source resolution before downsampling.
// Filtering a complete card first could leak adjacent title/footer/art pixels.
import { luminance } from './pixels-pure.mjs';
export const NATIVE_FRAME_FILTER = 'native-grid-gaussian-0.8-frame-only-v2';
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
export function nativeFramePatches(image, windows, bounds, gray = luminance(image)) {
  return nativeFrameRegions(image, windows, bounds).map((region) => {
    const { rect, factor, padX, padY, ...shape } = region,
      { axis } = shape,
      normalStart = axis === 'x' ? rect[0] : rect[1],
      alongStart = axis === 'x' ? rect[1] : rect[0],
      width = (axis === 'x' ? rect[2] : rect[3]) - normalStart + 1,
      height = (axis === 'x' ? rect[3] : rect[2]) - alongStart + 1,
      sigma = 0.8 / factor,
      radius = Math.ceil(3 * sigma);
    const kernel = Array.from({ length: radius * 2 + 1 }, (_, i) =>
        Math.exp(-0.5 * ((i - radius) / sigma) ** 2),
      ),
      total = kernel.reduce((a, b) => a + b, 0);
    for (let i = 0; i < kernel.length; i++) kernel[i] /= total;
    const horizontal = new Float32Array(width * height),
      values = new Uint8Array(width * height);
    for (let j = 0; j < height; j++)
      for (let i = 0; i < width; i++) {
        let sum = 0;
        for (let k = -radius; k <= radius; k++) {
          const n = normalStart + Math.max(0, Math.min(width - 1, i + k)),
            a = alongStart + j;
          sum +=
            kernel[k + radius] *
            gray[(axis === 'x' ? a : n) * image.width + (axis === 'x' ? n : a)];
        }
        horizontal[j * width + i] = sum;
      }
    for (let j = 0; j < height; j++)
      for (let i = 0; i < width; i++) {
        let sum = 0;
        for (let k = -radius; k <= radius; k++)
          sum +=
            kernel[k + radius] * horizontal[Math.max(0, Math.min(height - 1, j + k)) * width + i];
        values[j * width + i] = Math.round(sum);
      }
    return {
      ...shape,
      width,
      height,
      nativeSampling: {
        factor,
        normalPad: axis === 'x' ? padX : padY,
        alongPad: axis === 'x' ? padY : padX,
        normalStart,
        alongStart,
      },
      values,
    };
  });
}
