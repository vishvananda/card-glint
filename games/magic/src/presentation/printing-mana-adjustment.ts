import type { RenderedCardInput } from './face-layout.js';
import type { ManaSymbolTransform } from './symbol-adjustment.js';
import { isRetro, retroBorder } from './retro-frame.js';
import { usesModernCostMana } from './modern-cost-mana.js';
import {
  MODERN_COMPONENT_MANA,
  MODERN_MANA_OVERRIDES,
  PRINTING_MANA_PROFILES,
} from './printing-mana-profiles.js';

/** Resolve frame defaults first, then printing overrides and caller deltas. */
export function printingManaDefaults(face: RenderedCardInput): ManaSymbolTransform | undefined {
  const set = face.setCode?.toLowerCase() ?? '';
  if (usesModernCostMana(face)) return { ...MODERN_COMPONENT_MANA, ...MODERN_MANA_OVERRIDES[set] };
  const base = PRINTING_MANA_PROFILES[set];
  const early = ['lea', 'leb', '3ed'].includes(set);
  if (
    !base ||
    face.frameTemplate !== undefined ||
    /^Level up\b/m.test(face.rulesText ?? '') ||
    (face.layout ?? 'normal') !== 'normal' ||
    (face.legendary ?? /\bLegendary\b/.test(face.typeLine ?? '')) ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '') ||
    retroBorder(face) !== (['3ed', '8ed'].includes(set) ? 'white' : 'black') ||
    (early &&
      (!isRetro(face) ||
        face.symbolStyle === 'modern' ||
        (face.symbolStyle === undefined && face.wordingMode === 'oracle'))) ||
    (set === '8ed' && (isRetro(face) || face.frameAssetFamily !== 'eighth'))
  )
    return undefined;
  return base;
}

/** Editor deltas remain relative to printing defaults. Resolve separately in
 * preparation and painting; never modify the caller's face or adjustment. */
export function printingManaAdjustment(face: RenderedCardInput): ManaSymbolTransform | undefined {
  const user = face.symbolAdjustment?.mana;
  const base = printingManaDefaults(face);
  if (!base) return user;
  const result: ManaSymbolTransform = { ...user };
  for (const key of ['dx', 'dy', 'spacing', 'numberDx', 'numberDy'] as const)
    if (base[key] !== undefined) result[key] = base[key]! + (user?.[key] ?? 0);
  for (const key of ['scaleX', 'scaleY', 'numberScale'] as const)
    if (base[key] !== undefined) result[key] = base[key]! * (user?.[key] ?? 1);
  if (base.glyphs) {
    result.glyphs = { ...user?.glyphs };
    for (const color of ['W', 'U', 'B', 'R', 'G'] as const) {
      const a = base.glyphs[color],
        b = user?.glyphs?.[color];
      if (a)
        result.glyphs[color] = {
          scale: (a.scale ?? 1) * (b?.scale ?? 1),
          dx: (a.dx ?? 0) + (b?.dx ?? 0),
          dy: (a.dy ?? 0) + (b?.dy ?? 0),
        };
    }
  }
  return result;
}
