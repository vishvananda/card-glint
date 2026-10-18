import type { RenderedCardInput } from './face-layout.js';
import { isStyledSetSymbol } from './styled-set-symbols.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import { MAJOR_SYMBOL_PROFILES, MAJOR_SYMBOL_SOURCE } from './major-symbol-profiles.js';
import { cardStock } from './face-layout.js';
import { retroBorder } from './retro-frame.js';
import { resolveCardProfile } from './profile.js';
import { legendsFrame } from './legends-frame.js';

type Bounds = readonly [number, number, number, number];
// Follow-ups retain the original bulk calibration's immutable evidence. Sixth
// uses repaired white rims; see fixtures/accuracy/sixth-symbol-white-rim.json.
const correctedSourceProfiles: Readonly<Record<string, Bounds>> = {
  // Black outer contour after the checksum-guarded LEG SVG repair.
  'leg/retro/black': [3.25, 1.5, 1.05, 1.125],
  '6ed/retro/white': [2, -2, 1.08, 1.08],
  // Filled crescent after rim repair; independent width/height on fixed poses.
  'drk/retro/black': [2.5, -1.25, 1.146, 1.203],
};
// Canonical 488 × 680 pixels. Shared set profiles after frame-only scan
// registration; axis scales apply to visible SVG bounds, not a square viewport.
// Source/family-specific: do not transfer these to component or retro frames.
const profiles: Readonly<Record<string, { family: string; delta: Bounds }>> = {
  m15: { family: 'm15-accurate', delta: [1, 0, 1, 1] },
  m21: { family: 'm15-accurate', delta: [2, 0, 1.1, 1.06] },
  woe: { family: 'm15-accurate', delta: [2, 0, 1.08, 1.08] },
  tdm: { family: 'm15-accurate', delta: [0, 0, 1.08, 1.08] },
  '8ed': { family: 'eighth', delta: [-4, 0, 1, 0.92] },
  '9ed': { family: 'eighth', delta: [0, 1, 0.9, 0.92] },
};

export function styledSymbolBounds(
  face: RenderedCardInput,
  url: string | null,
  bounds: Bounds,
): Bounds {
  // Ordinary-plate scan fits do not certify the colorshifted source geometry.
  if (face.frameTreatment === 'colorshifted') return bounds;
  const key = face.setCode?.toLowerCase() ?? '';
  const profile = Object.hasOwn(profiles, key) ? profiles[key] : undefined;
  let result = bounds;
  if (
    profile &&
    !face.setSymbol &&
    isStyledSetSymbol(url) &&
    profile.family === face.frameAssetFamily
  )
    result = adjust(bounds, profile.delta);
  return face.frameAssetFamily
    ? calibratedStyledSymbolBounds(face, url, result, face.frameAssetFamily)
    : result;
}

/** Shared printing geometry only; stored scan transforms never enter painting. */
export function calibratedStyledSymbolBounds(
  face: RenderedCardInput,
  url: string | null,
  bounds: Bounds,
  family: 'retro' | 'component' | 'eighth' | 'm15-accurate',
): Bounds {
  if (
    face.setSymbol ||
    !isStyledSetSymbol(url) ||
    CONJURER_ROOT !== MAJOR_SYMBOL_SOURCE ||
    (face.layout ?? 'normal') !== 'normal' ||
    (['component', 'm15-accurate'].includes(family) && resolveCardProfile(face).legendary)
  )
    return bounds;
  const border =
    face.borderColor ??
    (family === 'retro'
      ? retroBorder(face)
      : cardStock(face.setCode).border === '#eeedeb'
        ? 'white'
        : 'black');
  const key = `${face.setCode?.trim().toLowerCase() ?? ''}/${family}/${border}`;
  if (key === 'leg/retro/black' && !legendsFrame(face)) return bounds;
  const delta = Object.hasOwn(correctedSourceProfiles, key)
    ? correctedSourceProfiles[key]
    : Object.hasOwn(MAJOR_SYMBOL_PROFILES, key)
      ? MAJOR_SYMBOL_PROFILES[key]
      : undefined;
  return delta ? adjust(bounds, delta) : bounds;
}

function adjust(bounds: Bounds, delta: Bounds): Bounds {
  const [x, y, w, h] = bounds,
    [dx, dy, sx, sy] = delta;
  return [x + w + dx - w * sx, y + h / 2 + dy - (h * sy) / 2, w * sx, h * sy];
}
