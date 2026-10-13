import type { RenderedCardInput } from './face-layout.js';
import { calibratedFrameProfile, calibratedManaTarget } from './calibration-profiles.js';

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
    frame: !!calibratedFrameProfile(face),
    manaSymbols: [...symbols].filter(
      (s) => !!calibratedManaTarget(face, /^\d+$/.test(s) ? 'N' : s),
    ),
  };
}
