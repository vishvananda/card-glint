import type { FaceRect, RenderedCardInput } from './face-layout.js';

interface RetroSymbolGeometry {
  right: number;
  centerY: number;
  width: number;
  height: number;
  crop: FaceRect;
  outline?: number;
  sampling?: ImageSmoothingQuality;
}

/** Visible ink bounds, not the padded source viewport. Shared set profiles
 * from the frozen old-symbol-material study; explicit custom symbols retain
 * their original viewport. Chronicles has its own printing geometry. */
const profiles: Readonly<Record<string, RetroSymbolGeometry>> = {
  arn: {
    right: 439,
    centerY: 394,
    width: 65,
    height: 22,
    crop: [0, 0.283203125, 1, 0.435546875],
    sampling: 'high',
  },
  // Native anvil bounds across Antiquities colors/materials; no added outer rim.
  atq: { right: 415, centerY: 391.5, width: 33, height: 16, crop: [0, 0.240234375, 1, 0.51953125] },
  drk: {
    right: 445,
    centerY: 397.25,
    width: 21,
    height: 18.5,
    crop: [0, 0.09375, 0.9884259259259259, 0.814453125],
  },
  // Crown and detached foot measured together; preserve the existing white rim.
  fem: {
    right: 441.75,
    centerY: 390.75,
    width: 20.75,
    height: 16.75,
    crop: [0, 0.12109375, 1, 0.724609375],
  },
  // Frozen globe ink bounds across Homelands materials; preserve its white rim.
  hml: {
    right: 440.75,
    centerY: 392.5,
    width: 23.5,
    height: 22.5,
    crop: [0, 0.083984375, 0.9861111111111112, 0.83203125],
  },
  // The printed Visions V is white inside its black triangle, with no white rim.
  vis: {
    right: 436.5,
    centerY: 390.5,
    width: 23,
    height: 27,
    crop: [0.004807692307692308, 0.037109375, 0.9903846153846154, 0.92578125],
    outline: 0,
  },
  leg: {
    right: 443.75,
    centerY: 394,
    width: 25.5,
    height: 22.5,
    crop: [0, 0.1264957264957265, 1, 0.764102564102564],
    sampling: 'high',
  },
  all: {
    right: 429,
    centerY: 393.5,
    width: 56.5,
    height: 24.5,
    crop: [0.00390625, 0.2890625, 0.994140625, 0.421875],
    sampling: 'high',
  },
  wth: {
    right: 434,
    centerY: 390,
    width: 34,
    height: 22,
    crop: [0, 0.154296875, 0.998046875, 0.646484375],
    sampling: 'high',
  },
  // Native silhouettes, after independent outer-frame registration. These
  // retain the source contours and use one placement per printed set.
  mir: {
    right: 437,
    centerY: 391,
    width: 26.75,
    height: 25,
    crop: [0.001953125, 0.037109375, 0.99609375, 0.91015625],
    sampling: 'high',
  },
  tmp: {
    right: 433.5,
    centerY: 390.5,
    width: 20.5,
    height: 19.5,
    crop: [0, 0.13982300884955753, 0.984375, 0.7964601769911505],
    outline: 2,
    sampling: 'high',
  },
  sth: {
    right: 434.75,
    centerY: 390.75,
    width: 18.75,
    height: 19.5,
    crop: [0, 0.10381679389312977, 0.998046875, 0.7923664122137405],
    sampling: 'high',
  },
  por: {
    right: 435.5,
    centerY: 391,
    width: 23,
    height: 23,
    crop: [0, 0.08401976935749589, 0.98828125, 0.8336079077429983],
    sampling: 'high',
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
