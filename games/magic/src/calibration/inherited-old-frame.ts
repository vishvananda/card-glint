import type { RenderedCardInput } from '../presentation/face-layout.js';
import type { SetCalibrationProfile } from './types.js';
import { setCalibrationProfile } from './profiles.js';
import { inheritedOldFrameDefault, oldFrameDefaultColorDonor } from './old-frame-defaults.js';

const inherited = new WeakMap<
  SetCalibrationProfile,
  Map<
    string,
    {
      palette: SetCalibrationProfile | undefined;
      profile: SetCalibrationProfile;
    }
  >
>();
/** Immutable shared values: clone once per set/surround, never per card draw. */
export function inheritedOldFrameProfile(
  face: RenderedCardInput,
): SetCalibrationProfile | undefined {
  const choice = inheritedOldFrameDefault(face);
  if (!choice) return undefined;
  const donor = setCalibrationProfile(choice.donor);
  if (!donor) return undefined;
  const paletteCode = oldFrameDefaultColorDonor(face.setCode);
  const palette = paletteCode ? setCalibrationProfile(paletteCode) : undefined;
  if (paletteCode && !palette) return undefined;
  const set = face.setCode!.toLowerCase(),
    border =
      face.borderColor === 'white'
        ? 'white'
        : face.borderColor === 'black'
          ? 'black'
          : choice.border;
  const stock =
    border === choice.border ? choice.stock : border === 'white' ? '#eeedeb' : '#181510';
  const key = set + '/' + border + '/' + stock;
  let copies = inherited.get(donor);
  if (!copies) {
    copies = new Map();
    inherited.set(donor, copies);
  }
  const cached = copies.get(key);
  if (cached && cached.palette === palette) return cached.profile;
  const n = parseInt(stock.slice(1), 16);
  const rgb = [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as const;
  const profile = {
    ...donor,
    set,
    border,
    colors: Object.fromEntries(
      Object.entries(donor.colors).map(([k, color]) => {
        if (!color) return [k, color];
        let adjustment = color.adjustment;
        const pigment = choice.pigment?.[k];
        const mode = choice.materialPalettes?.[k] ?? choice.palette;
        if (pigment && pigment.source === color.source && 'mask' in adjustment) {
          adjustment = { ...adjustment, frame: pigment.frame, paper: pigment.paper };
        } else if (mode === 'source') {
          adjustment = {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            ...(adjustment.outerStock ? { outerStock: adjustment.outerStock } : {}),
          };
        } else if (mode === 'ons') {
          const alternate = palette?.colors[k];
          // Geometry may crop the same source differently; source pixels must match.
          if (alternate && JSON.parse(alternate.source)[0] === JSON.parse(color.source)[0]) {
            adjustment = {
              ...alternate.adjustment,
              ...(adjustment.outerStock ? { outerStock: adjustment.outerStock } : {}),
            };
          }
        }
        return [
          k,
          {
            ...color,
            stock,
            adjustment:
              border === 'black' && adjustment.outerStock
                ? { ...adjustment, outerStock: rgb }
                : adjustment,
          },
        ];
      }),
    ),
    footer: {
      ...donor.footer,
      legal: { ...donor.footer.legal, defaultText: undefined, collectorTotal: undefined },
    },
    ...(choice.retain.includes('rules')
      ? {
          body: undefined,
          bodyClasses: undefined,
          expansionBody: undefined,
          textTiers: undefined,
          rulesPlacement: undefined,
          rulesAdjustments: undefined,
        }
      : {}),
  };
  delete profile.setSymbols;
  delete profile.setSymbolSource;
  delete profile.landMaterials;
  delete profile.dualLand;
  copies.set(key, { palette, profile });
  return profile;
}
