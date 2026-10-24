import { eighthPrintingProfile } from './eighth-printing-profile.js';
import { eighthFrameMaterials } from './eighth-materials.js';
import { supportsEighthStyleDefaults } from './eighth-style-scope.js';
import {
  modernOrdinaryPlates,
  modernPrintingProfile,
  independentModernComponentMaterials,
} from './modern-printing-profile.js';
import type { RenderedCardInput } from './face-layout.js';
import { cardStock } from './face-layout.js';
import type { FrameHsb } from './frame-hsb.js';
import { calibrationFace } from './calibration-input.js';
import * as exact from './calibration-profiles.js';
import {
  modernCalibrationSources,
  supportsModernCalibration,
} from './calibration-modern-sources.js';
import { profileAssets } from './assets.js';
import { resolveCardProfile } from './profile.js';
import { planarCalibratedStock } from './planar-blackpoint.js';
import { framePlate } from './frame-plates.js';

export { supportsModernCalibration } from './calibration-modern-sources.js';
const neutral = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 };
const stock = '#16130e';
const stockRgb = [22 / 255, 19 / 255, 14 / 255] as const;

/** Pure resolution. The existing bitmap cache owns every derived pixel buffer. */
export function printingCalibrationMaterials(input: RenderedCardInput) {
  const face = calibrationFace(input),
    choice = face.calibration;
  // Exact-printing policy also excludes inherited layouts/material masks.
  // Clearing it would resolve donor pigment against a different asset inventory.
  const original = { ...face, calibration: choice === 'printing' ? choice : undefined };
  const explicitProfile = typeof choice === 'object';
  const namedEighth = explicitProfile && choice.profile === '8ed-eighth';
  if (
    explicitProfile &&
    (namedEighth ? !supportsEighthStyleDefaults(face) : !supportsModernCalibration(face))
  )
    throw Error(
      namedEighth
        ? '8ED calibration requires an ordinary Eighth frame.'
        : 'M21 calibration requires a modern frame.',
    );
  const style = modernPrintingProfile(original);
  const eighth = eighthPrintingProfile(original);
  const independent = style?.inheritedFrom
    ? independentModernComponentMaterials(original)
    : undefined;
  const plate = framePlate(original);
  const ordinary =
    original.colorCalibration === 'set-hsb-v1' ? modernOrdinaryPlates(original) : undefined;
  // The backing is part of the shared style too. Opaque ordinary plates
  // previously concealed the raw darker fill; translucent component/PW frames
  // expose it. Independent source-bound stock still takes precedence below.
  const styleStock =
    original.colorCalibration === 'set-hsb-v1' &&
    style &&
    (original.borderColor ?? 'black') === 'black'
      ? stock
      : undefined;
  const knownStock =
    choice === 'source' || ordinary ? undefined : exact.calibratedPrintingStock(original);
  const measuredStock =
    choice === 'source'
      ? undefined
      : ((plate ? planarCalibratedStock(original, plate.frame) : undefined) ??
        (ordinary ? stock : (knownStock ?? styleStock)));
  const measured = choice === 'source' ? {} : exact.calibratedFrameMaterials(original);
  // A named M21 selection retains the matching source-bound style, including
  // PW materials. Independently measured component sources keep their separate
  // explicit-donor policy rather than being mislabeled as shared M21 fits.
  const useExact =
    !explicitProfile || namedEighth || Boolean(ordinary) || Boolean(style && !independent);
  const materials: Record<string, FrameHsb> = useExact ? { ...measured } : {};
  const fallbackAssets: string[] = [];
  if (style?.inheritedFrom && choice !== 'source')
    for (const url of Object.keys(materials))
      if (!independent?.[url] && (ordinary?.[url] || style.componentMaterials?.[url]))
        fallbackAssets.push(url);
  let border = useExact ? measuredStock : undefined;
  let fallbackStock = Boolean(
    style?.inheritedFrom &&
      (ordinary || (styleStock && !knownStock)) &&
      border &&
      choice !== 'source',
  );
  if (eighth?.inheritedFrom && choice !== 'source') {
    const independent = exact.calibratedFrameMaterials({ ...original, calibration: 'printing' });
    for (const url of Object.keys(eighthFrameMaterials(original) ?? {}))
      if (!independent[url]) fallbackAssets.push(url);
    fallbackStock = Boolean(
      border && !exact.calibratedPrintingStock({ ...original, calibration: 'printing' }),
    );
  }
  if (
    (choice === 'auto' || explicitProfile || Boolean(styleStock && style?.inheritedFrom)) &&
    supportsModernCalibration(face)
  ) {
    const sources = modernCalibrationSources(face),
      profile = resolveCardProfile(face);
    const donor: RenderedCardInput = {
      name: '',
      setCode: 'M21',
      frameStyle: 'modern',
      layout: 'normal',
      typeLine: profile.land ? 'Land' : profile.artifact ? 'Artifact' : 'Creature',
      colors: face.colors,
      frameColors: face.frameColors,
      land: profile.land,
      artifact: profile.artifact,
      legendary: profile.legendary,
      colorCalibration: 'set-hsb-v1',
    };
    const available = new Set(sources.shared);
    for (const [url, correction] of Object.entries(
      exact.calibratedComponentDonorMaterials(donor),
    )) {
      // Source-local masks are safe only for the identical pinned bitmap.
      if (!available.has(url) || materials[url]) continue;
      materials[url] = correction;
      fallbackAssets.push(url);
    }
    if (!border && cardStock(face.setCode, face.borderColor).border === '#090806') {
      border = stock;
      fallbackStock = true;
    }
    // Baked borders need their own edge correction even when the shared style
    // already resolved the backing. Measured ordinary plates own their pigment.
    if (fallbackStock && !ordinary && border === stock)
      for (const url of sources.stock)
        materials[url] = { ...(materials[url] ?? neutral), outerStock: stockRgb };
  }
  return {
    face,
    materials,
    measured,
    border,
    fallbackStock,
    fallbackAssets,
    fallbackProfile: eighth?.inheritedFrom ? ('8ed-eighth' as const) : ('m21-modern' as const),
    assets: profileAssets(resolveCardProfile(face)),
    explicitProfile,
  };
}
export const calibratedFrameMaterials = (face: RenderedCardInput) =>
  printingCalibrationMaterials(face).materials;
export const calibratedPrintingStock = (face: RenderedCardInput) =>
  printingCalibrationMaterials(face).border;
export const calibratedManaTarget = (face: RenderedCardInput, symbol: string) => {
  const normalized = calibrationFace(face);
  // Donor color correction must not change historical glyph palettes or era.
  return normalized.calibration === 'source'
    ? undefined
    : exact.calibratedManaTarget(normalized, symbol);
};
