import type { FaceRect, RenderedCardInput } from './face-layout.js';

interface RetroSymbolGeometry {
  right: number;
  centerY: number;
  width: number;
  height: number;
  crop: FaceRect;
  outline?: number;
}

/** Visible ink bounds, not the padded source viewport. Shared set profiles
 * from the frozen old-symbol-material study; explicit custom symbols retain
 * their original viewport. Chronicles has its own printing geometry. */
const profiles: Readonly<Record<string, RetroSymbolGeometry>> = {
  arn: { right: 439, centerY: 394, width: 65, height: 22, crop: [0, 0.283203125, 1, 0.435546875] },
  // Native anvil bounds across Antiquities colors/materials; no added outer rim.
  atq: { right: 415, centerY: 391.5, width: 33, height: 16, crop: [0, 0.240234375, 1, 0.51953125] },
  drk: {
    right: 445,
    centerY: 397.25,
    width: 21,
    height: 18.5,
    crop: [0, 0.09375, 0.9884259259259259, 0.814453125],
  },
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
  // Independent ink-axis measurements across common Exodus scans; retain the 2 px rim.
  exo: { right: 430.5, centerY: 390, width: 55.5, height: 21, crop: [0, 0.30859375, 1, 0.3828125] },
  ice: {
    right: 443.5,
    centerY: 394.5,
    width: 20,
    height: 21,
    crop: [0, 0.04296875, 1, 0.9140625],
    outline: 0,
  },
};

export function retroSymbolGeometry(face: RenderedCardInput): RetroSymbolGeometry | null {
  const code = face.setCode?.toLowerCase() ?? '';
  return !face.setSymbol && Object.hasOwn(profiles, code) ? profiles[code]! : null;
}
