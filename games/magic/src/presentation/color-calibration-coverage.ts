import type { RenderedCardInput } from './face-layout.js';
import {
  calibratedFrameMaterials,
  calibratedManaTarget,
  hasColorCalibration,
} from './calibration-profiles.js';

import { isRevisedLand, revisedLandColors } from './revised-land-frame.js';

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
  return {
    frame:
      Object.keys(calibratedFrameMaterials(face)).length > 0 ||
      (isRevisedLand(face) && hasColorCalibration(face) && revisedLandColors(face).length > 0),
    manaSymbols: [...symbols].filter(
      (s) => !!calibratedManaTarget(face, /^\d+$/.test(s) ? 'N' : s),
    ),
  };
}
