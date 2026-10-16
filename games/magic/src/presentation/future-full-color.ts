import type { RenderedCardInput } from './face-layout.js';
import type { FrameHsb } from './frame-hsb.js';
import type { PaperMask } from './frame-paper-mask.js';
import manifest from '../../assets.json' with { type: 'json' };
import profiles from './future-full-colors.json' with { type: 'json' };
import { futureParts } from './future-frame.js';

const panel = (
  points: readonly (readonly [number, number])[],
  width = 375,
  height = 527,
): PaperMask => ({
  kind: 'polygon',
  feather: 1 / width,
  points: points.map(([x, y]) => [x / width, y / height] as const),
});
const title = panel([
  [44, 60],
  [52, 42],
  [66, 29],
  [75, 26],
  [344, 26],
  [347, 29],
  [347, 60],
]);
const type = panel([
  [43, 438],
  [337, 438],
  [341, 443],
  [336, 448],
  [335, 458],
  [339, 466],
  [43, 466],
]);
const stats = panel(
  [
    [12, 16],
    [64, 16],
    [64, 35],
    [60, 42],
    [12, 42],
  ],
  78,
  51,
);
const frame: PaperMask = {
  kind: 'rect',
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375,
};
const gain = (rgbScale: readonly number[]) => ({
  hueDegrees: 0,
  saturationScale: 1,
  brightnessScale: 1,
  rgbScale: rgbScale as readonly [number, number, number],
});

/** Ordinary FUT training pigments rebound to these exact MSE plates. Four
 * textless printings check the transfer. Black has no accepted scan pose. */
export function futureFullMaterials(face: RenderedCardInput): Readonly<Record<string, FrameHsb>> {
  const parts = futureParts(face);
  for (const [color, profile] of Object.entries(profiles)) {
    const root = manifest.MSE_TEMPLATE_ROOT + '/magic-future-textless.mse-style/';
    if (parts.base !== root + color.toLowerCase() + 'card.jpg') continue;
    return {
      [parts.base]: {
        frame: gain([1, 1, 1]),
        paper: gain(profile.frame),
        mask: frame,
        regions: [
          { mask: title, adjustment: gain(profile.title) },
          { mask: type, adjustment: gain(profile.type) },
        ],
      },
      ...(parts.stats
        ? {
            [parts.stats]: { frame: gain(profile.frame), paper: gain(profile.stats), mask: stats },
          }
        : {}),
    };
  }
  return {};
}
