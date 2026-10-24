import { eighthLandPalettes } from './eighth-land-material.js';
import type { RenderedCardInput } from './face-layout.js';
import {
  hasCalibratedFramePigment,
  calibratedManaTarget,
  hasColorCalibration,
} from './calibration-profiles.js';

import { isRevisedLand, revisedLandColors } from './revised-land-frame.js';
import { eighthBasicProfile } from './eighth-basic-profile.js';

/** Report source-guarded coverage without exposing mutable calibration tables.
 * A profile's presence is not a whole-card accuracy guarantee. */
export function colorCalibrationCoverage(face: RenderedCardInput): {
  frame: boolean;
  manaSymbols: readonly string[];
} {
  const text = face.rulesParagraphs
    ? face.rulesParagraphs.flatMap((p) => p.runs.map((r) => r.text)).join('\n')
    : (face.rulesText ?? '');
  const symbols = new Set([
    ...(face.manaSymbols ?? []),
    ...[...text.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]!),
  ]);
  const basic = eighthBasicProfile(face);
  return {
    frame:
      hasCalibratedFramePigment(face) ||
      !!basic ||
      eighthLandPalettes(face).length > 0 ||
      (isRevisedLand(face) && hasColorCalibration(face) && revisedLandColors(face).length > 0),
    manaSymbols: [
      ...new Set([
        ...[...symbols].filter((s) => !!calibratedManaTarget(face, /^\d+$/.test(s) ? 'N' : s)),
        ...(basic?.glyph ? [basic.color] : []),
      ]),
    ],
  };
}
