import type { RenderedCardInput } from './face-layout.js';
import { retroBorder } from './retro-frame.js';
import { RETRO_MANA_PROFILES } from './retro-mana-profiles.js';
/** Shared printing coordinates; scan poses are confined to measurement tools. */
export function retroManaPlacement(face: RenderedCardInput) {
  if ((face.layout ?? 'normal') !== 'normal') return undefined;
  const key = `${face.setCode?.toLowerCase() ?? ''}/${retroBorder(face)}`;
  return Object.hasOwn(RETRO_MANA_PROFILES, key) ? RETRO_MANA_PROFILES[key] : undefined;
}
