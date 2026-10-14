import type { RenderedCardInput } from './face-layout.js';

/** Canonical 488 × 680 offsets, fitted against frozen scan-frame poses.
 * Shared per printing set; no per-card scan offset is part of rendering.
 * Only ordinary nonlegendary title styles have a reserved validation cohort.
 * Revised's zero-shift result is deliberately not extrapolated to other sets. */
export function titleTranslation(
  face: RenderedCardInput,
  family: 'retro' | 'eighth' | 'modern',
): readonly [number, number] {
  if (
    (face.layout && face.layout !== 'normal') ||
    (face.legendary ?? /\bLegendary\b/.test(face.typeLine ?? ''))
  )
    return [0, 0];
  const set = face.setCode?.toLowerCase();
  if (face.borderColor && face.borderColor !== (set === '8ed' ? 'white' : 'black')) return [0, 0];
  if (family === 'retro') {
    if (set === 'lea') return [-1.5, 1.5];
    if (set === 'leb') return [-1, 2];
  }
  if (family === 'eighth' && set === '8ed') return [0.5, -2];
  if (family === 'modern' && set === 'm21') return [-1, 1];
  return [0, 0];
}
