import type { FaceRect, RenderedCardInput } from './face-layout.js';

interface RetroSymbolGeometry {
  right: number;
  centerY: number;
  width: number;
  height: number;
  crop: FaceRect;
}

/** Visible ink bounds, not the padded source viewport. Shared set profiles
 * from the frozen old-symbol-material study; explicit custom symbols retain
 * their original viewport. Chronicles has its own printing geometry. */
const profiles: Readonly<Record<string, RetroSymbolGeometry>> = {
  arn: { right: 439, centerY: 394, width: 65, height: 22, crop: [0, 0.283203125, 1, 0.435546875] },
  leg: {
    right: 441,
    centerY: 394,
    width: 24,
    height: 21,
    crop: [0, 0.1264957264957265, 1, 0.764102564102564],
  },
  all: {
    right: 424,
    centerY: 392,
    width: 54,
    height: 23,
    crop: [0.00390625, 0.2890625, 0.994140625, 0.421875],
  },
  wth: {
    right: 434,
    centerY: 390,
    width: 34,
    height: 22,
    crop: [0, 0.154296875, 0.998046875, 0.646484375],
  },
};

export function retroSymbolGeometry(face: RenderedCardInput): RetroSymbolGeometry | null {
  const code = face.setCode?.toLowerCase() ?? '';
  return !face.setSymbol && Object.hasOwn(profiles, code) ? profiles[code]! : null;
}
