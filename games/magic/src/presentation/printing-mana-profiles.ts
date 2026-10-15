import type { ManaSymbolTransform } from './symbol-adjustment.js';

/** Shared printing defaults, measured after independent scan-frame normalization. */
export const PRINTING_MANA_PROFILES: Readonly<Record<string, ManaSymbolTransform>> = {
  m21: { scaleX: 1.01, scaleY: 1.01, numberScale: 0.98, numberDx: -0.25 },
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
  '8ed': {
    dy: -2,
    scaleX: 1.02,
    scaleY: 1.02,
    numberScale: 0.97,
    numberDx: -0.5,
    numberDy: -1.25,
    glyphs: {
      W: { scale: 0.98, dx: -0.5, dy: -2 },
      U: { scale: 0.94, dx: -0.5, dy: -1.5 },
      B: { scale: 0.97, dx: -0.25, dy: -2 },
      R: { scale: 0.95, dx: 0, dy: -1.5 },
      G: { scale: 1.04, dx: -0.25, dy: -3 },
    },
  },
};
