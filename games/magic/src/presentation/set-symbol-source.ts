import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { calibrationForFace } from '../calibration/selection.js';

/** Color and etching share the printing's reviewed source. Explicit host choices win. */
export function printingSetSymbolSource(face: RenderedCardInput) {
  if (face.setSymbolSource && face.setSymbolSource !== 'auto') return face.setSymbolSource;
  return (
    (earlyReprintFrame(face) ? calibrationForFace(face)?.setSymbolSource : undefined) ??
    face.setSymbolSource
  );
}
