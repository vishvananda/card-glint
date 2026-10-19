import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput } from './face-layout.js';
import type { ManaSymbolTransform } from './symbol-adjustment.js';
import { isRetro, retroBorder } from './retro-frame.js';
import { resolveCardProfile, resolveFrameColors } from './profile.js';

/** Original symbols and ordinary black-border plates only. Explicit Oracle
 * wording can retain original symbols; an unknown collector keeps the common palette. */
export function earlyExpansionMana(face: RenderedCardInput): boolean {
  return (
    ['arn', 'atq', 'drk'].includes(face.setCode?.toLowerCase() ?? '') &&
    isRetro(face) &&
    !face.frameTemplate &&
    (face.layout ?? 'normal') === 'normal' &&
    retroBorder(face) === 'black' &&
    !resolveCardProfile(face).legendary &&
    !/^Level up\b/m.test(face.rulesText ?? '') &&
    face.symbolStyle !== 'modern' &&
    !(face.symbolStyle === undefined && face.wordingMode === 'oracle')
  );
}
export function arabianManaVariant(face: RenderedCardInput): 'light' | 'dark' | undefined {
  if (face.setCode?.toLowerCase() !== 'arn' || !earlyExpansionMana(face)) return undefined;
  const number = face.collectorNumber ?? '';
  return /^\d+†$/.test(number) ? 'light' : /^\d+$/.test(number) ? 'dark' : undefined;
}
export interface EarlyManaNumeral {
  fill: string;
}
const darkPaper: Readonly<Record<string, readonly number[]>> = {
  W: [105, 117, 115],
  U: [53, 97, 116],
  B: [66, 78, 76],
  R: [96, 52, 46],
  G: [57, 92, 84],
  A: [92, 90, 83],
};
/** These small, low-visibility bubbles are cost-only, never inline rules symbols.
 * The partial alpha is an empirical rendering approximation, not a print-process claim. */
export function earlyManaNumeral(face: RenderedCardInput): EarlyManaNumeral | undefined {
  if (arabianManaVariant(face) !== 'dark') return undefined;
  const colors = resolveFrameColors(face),
    profile = resolveCardProfile(face);
  const material = profile.artifact ? 'A' : colors.length === 1 ? colors[0]! : '';
  const paper = darkPaper[material];
  if (!paper) return undefined;
  const calibrated =
    face.calibration !== 'source' &&
    (face.calibration === 'auto' || face.colorCalibration === 'set-hsb-v1');
  return { fill: calibrated ? `rgba(${paper.join(',')},0.8)` : 'rgba(0,0,0,0.4)' };
}
/** Uses the already-loaded pack font; no readback, decoding or font loading. */
export function paintEarlyManaNumeral(
  context: CanvasContext,
  symbol: string,
  x: number,
  y: number,
  size: number,
  style: EarlyManaNumeral,
  adjustment: ManaSymbolTransform,
) {
  context.save();
  context.shadowColor = 'transparent';
  context.shadowOffsetX = context.shadowOffsetY = 0;
  context.fillStyle = style.fill;
  context.beginPath();
  context.arc(x + size / 2 - 0.25, y + size / 2 - 0.5, (size / 2) * 0.81, 0, Math.PI * 2);
  context.fill();
  context.font = '100px "CardRenderer MTG MPlantin"';
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';
  context.fillStyle = '#111';
  const m = context.measureText(symbol),
    scale =
      (size * 0.7 * (adjustment.numberScale ?? 1)) /
      (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent);
  context.translate(
    x + size / 2 + (adjustment.numberDx ?? 0),
    y + size / 2 + (adjustment.numberDy ?? 0),
  );
  context.scale(scale, scale);
  context.fillText(
    symbol,
    (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
    (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
  );
  context.restore();
}
