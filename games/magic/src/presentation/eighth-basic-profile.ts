import values from './eighth-basic-colors.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import type { HsbAdjustment, Rgb } from './hsb.js';
import { framePlate } from './frame-plates.js';
import { usesEighthBasicGeometry } from './eighth-basic-geometry.js';
import { basicLandColor, plateBasicSymbol } from './plate-basic-land.js';

export interface EighthBasicPalette {
  header: HsbAdjustment;
  paper: HsbAdjustment;
  pinline: HsbAdjustment;
  glyph: { source: Rgb; target: Rgb };
}
const rgb = (v: readonly number[]): Rgb => {
  if (v.length !== 3 || v.some((x) => !Number.isFinite(x) || x < 0 || x > 1))
    throw Error('Invalid Eighth basic-land palette.');
  return [v[0]!, v[1]!, v[2]!];
};
const palettes = new Map<string, EighthBasicPalette>(
  Object.entries(values.colors).map(([color, p]) => [
    color,
    { ...p, glyph: { source: rgb(p.glyph.source), target: rgb(p.glyph.target) } },
  ]),
);
export const EIGHTH_BASIC_OUTER = values.outer;

/** Exact printing/source guard, shared by preparation and coverage reporting.
 * Finite four-printing-per-color inventory; no extrapolation to other sets. */
export function eighthBasicProfile(face: RenderedCardInput) {
  if (
    face.colorCalibration !== 'set-hsb-v1' ||
    face.frameAssetFamily !== 'eighth' ||
    face.setCode?.toLowerCase() !== '8ed' ||
    face.frameTemplate ||
    (face.layout && face.layout !== 'normal')
  )
    return undefined;
  const color = basicLandColor(face),
    palette = color ? palettes.get(color) : undefined;
  if (!palette) return undefined;
  const plate = framePlate(face);
  if (!plate || !usesEighthBasicGeometry(face, plate.frame)) return undefined;
  return { color: color!, palette, frame: plate.frame, glyph: plateBasicSymbol(face) };
}
