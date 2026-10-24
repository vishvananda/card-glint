import { eighthPrintingProfile } from './eighth-printing-profile.js';
import type { RenderedCardInput } from './face-layout.js';
import { legendsFrame } from './legends-frame.js';

/** Canonical 488 × 680 offsets, fitted against frozen scan-frame poses.
 * Shared per printing set; no per-card scan offset is part of rendering.
 * Legends includes both gold legends and ordinary colored/land/artifact titles;
 * the other set fits cover only nonlegendary title styles.
 * Revised's zero-shift result is deliberately not extrapolated to other sets. */
export function titleTranslation(
  face: RenderedCardInput,
  family: 'retro' | 'eighth' | 'modern',
): readonly [number, number] {
  if (face.layout && face.layout !== 'normal') return [0, 0];
  const set = face.setCode?.toLowerCase();
  const eighth = family === 'eighth' ? eighthPrintingProfile(face)?.headings.title : undefined;
  if (eighth) return [eighth.dx, eighth.dy];
  if (face.borderColor && face.borderColor !== (set === '8ed' ? 'white' : 'black')) return [0, 0];
  if (family === 'retro' && legendsFrame(face)) return [-18.5, -6];
  if (face.legendary ?? /\bLegendary\b/.test(face.typeLine ?? '')) return [0, 0];
  if (family === 'retro') {
    if (set === 'lea') return [-1.5, 1.5];
    if (set === 'leb') return [-1, 2];
  }
  if (family === 'eighth' && set === '8ed') return [0.5, -2];
  if (family === 'modern' && set === 'm21') return [-1, 1];
  return [0, 0];
}
