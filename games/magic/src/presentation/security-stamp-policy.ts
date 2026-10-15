import type { RenderedCardInput } from './face-layout.js';
import { isRetro } from './retro-frame.js';

/** Explicit physical printing metadata wins, including an uncommon with a
 * stamp or a rare without one. No historical date/rarity inference in adapters. */
export function hasOvalSecurityStamp(face: RenderedCardInput): boolean {
  if (face.securityStamp !== undefined) return face.securityStamp === 'oval';
  return (
    !isRetro(face) &&
    face.frameAssetFamily !== 'eighth' &&
    ['rare', 'mythic'].includes(face.rarity ?? '')
  );
}
