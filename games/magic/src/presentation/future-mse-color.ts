import type { RenderedCardInput } from './face-layout.js';
import type { FrameHsb } from './frame-hsb.js';
import type { PaperMask } from './frame-paper-mask.js';
import { futureParts, FUTURE_REGULAR_ROOT } from './future-frame.js';
import profiles from './future-mse-colors.json' with { type: 'json' };

const identity = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 };
const panel = (points: readonly (readonly [number, number])[]): PaperMask => ({
  kind: 'polygon',
  feather: 1 / 339,
  points: points.map(([x, y]) => [x / 339, y / 464] as const),
});
const title = panel([
  [26, 43],
  [34, 25],
  [48, 12],
  [57, 9],
  [326, 9],
  [329, 12],
  [329, 43],
]);
const type = panel([
  [12, 277],
  [319, 277],
  [330, 285],
  [337, 294],
  [330, 310],
  [319, 314],
  [20, 314],
]);
// The gold footer is a shared material. Colored curved ribbons and translucent
// paper backing are separate source components and retain their own values.
const footer: PaperMask = {
  kind: 'rect',
  rect: [20 / 375, 470 / 527, 338 / 375, 40 / 527],
  feather: 1 / 375,
};
const plate: PaperMask = {
  kind: 'rect',
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375,
};
// Follow the translucent paper's alpha boundary, rather than leaving a
// rectangular color step across the surrounding continuous gray material.
const paper: PaperMask = {
  kind: 'polygon',
  feather: 1 / 375,
  points: [
    [35, 323],
    [344, 323],
    [348, 340],
    [351, 360],
    [350, 390],
    [350, 420],
    [349, 430],
    [345, 450],
    [342, 466],
    [38, 466],
    [32, 450],
    [29, 430],
    [26, 410],
    [26, 380],
    [28, 360],
    [31, 340],
  ].map(([x, y]) => [x! / 375, y! / 527] as const),
};
const rgb = (a: typeof profiles.paper.W) => ({
  ...a,
  rgbScale: a.rgbScale as [number, number, number],
});

/** Exact MSE regular assets, prepared once through the material cache. Land
 * component fits have reserved opposite halves; colorless has one printing. */
export function futureMseMaterials(face: RenderedCardInput): Readonly<Record<string, FrameHsb>> {
  const parts = futureParts(face),
    root = FUTURE_REGULAR_ROOT + '/';
  if (!parts.base.startsWith(root)) return {};
  const colorless = parts.base === root + 'ccard.jpg',
    materials: Record<string, FrameHsb> = {},
    profile = colorless ? profiles.colorless : profiles.land;
  for (const asset of [parts.base, parts.reverseBase, parts.neutralBase])
    if (asset)
      materials[asset] = colorless
        ? {
            frame: identity,
            paper: rgb(profiles.colorless.frame),
            mask: plate,
            regions: [{ mask: paper, adjustment: identity }],
          }
        : { frame: identity, paper: profiles.land.frame, mask: footer };
  for (const asset of [parts.type, parts.reverseType, parts.neutralType])
    if (asset === root + (colorless ? 'c' : 'cl') + 'typeline.png')
      materials[asset] = {
        frame: identity,
        paper: rgb(profile.title),
        mask: title,
        regions: [{ mask: type, adjustment: rgb(profile.type) }],
      };
  for (const asset of [parts.paper, parts.reversePaper]) {
    if (!asset) continue;
    if (colorless) materials[asset] = rgb(profiles.colorless.paper);
    else
      for (const [color, adjustment] of Object.entries(profiles.paper))
        if (asset === root + color.toLowerCase() + 'ltextbox.png')
          materials[asset] = rgb(adjustment);
  }
  return materials;
}
