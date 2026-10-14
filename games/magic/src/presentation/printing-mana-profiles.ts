import type { ManaSymbolTransform } from './symbol-adjustment.js';

/** Shared printing defaults, measured after independent scan-frame normalization. */
export const PRINTING_MANA_PROFILES: Readonly<Record<string, ManaSymbolTransform>> = {
  leb: {
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
  },
};
