import type { RenderedCardInput } from './face-layout.js';
import type { ManaColor, ManaSymbolTransform } from './symbol-adjustment.js';
import { isRetro, retroBorder } from './retro-frame.js';

// Beta original costs: held-out ink fit plus the reviewed centered white sun.
// Keep the disc size and vertical position; inline symbols are unaffected.
const beta: ManaSymbolTransform = {
  dx: -1.5,
  spacing: 1.75,
  numberDy: -1,
  glyphs: {
    W: { scale: 1.09, dx: 0, dy: 0 },
    U: { scale: 1, dx: 0.5, dy: -1 },
    B: { scale: 1.03, dx: 0.25, dy: -1.25 },
    R: { scale: 1, dx: 0.5, dy: 0.5 },
    G: { scale: 1.12, dx: 0, dy: -1 },
  },
};

/** Editor deltas remain relative to the printing defaults. Resolve separately
 * in preparation and painting; never modify the caller's face or adjustment. */
export function printingManaAdjustment(face: RenderedCardInput): ManaSymbolTransform | undefined {
  const user = face.symbolAdjustment?.mana;
  if (
    face.setCode?.toLowerCase() !== 'leb' ||
    (face.layout ?? 'normal') !== 'normal' ||
    !isRetro(face) ||
    retroBorder(face) !== 'black' ||
    face.symbolStyle === 'modern' ||
    (face.symbolStyle === undefined && face.wordingMode === 'oracle')
  )
    return user;
  const glyphs = Object.fromEntries(
    (['W', 'U', 'B', 'R', 'G'] as const).map((color: ManaColor) => {
      const a = beta.glyphs![color]!,
        b = user?.glyphs?.[color];
      return [
        color,
        {
          scale: (a.scale ?? 1) * (b?.scale ?? 1),
          dx: (a.dx ?? 0) + (b?.dx ?? 0),
          dy: (a.dy ?? 0) + (b?.dy ?? 0),
        },
      ];
    }),
  );
  return {
    ...user,
    dx: beta.dx! + (user?.dx ?? 0),
    spacing: beta.spacing! + (user?.spacing ?? 0),
    numberDy: beta.numberDy! + (user?.numberDy ?? 0),
    glyphs,
  };
}
