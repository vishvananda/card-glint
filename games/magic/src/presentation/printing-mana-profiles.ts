import type { ManaSymbolTransform } from './symbol-adjustment.js';

export const MODERN_COMPONENT_MANA: ManaSymbolTransform = {
  scaleX: 1.01,
  scaleY: 1.01,
  numberScale: 0.98,
  numberDx: -0.25,
};
/** Sparse printing exceptions to the component-frame default, when warranted. */
export const MODERN_MANA_OVERRIDES: Readonly<Record<string, ManaSymbolTransform>> = {};

/** Shared printing defaults, measured after independent scan-frame normalization. */
export const PRINTING_MANA_PROFILES: Readonly<Record<string, ManaSymbolTransform>> = {
  '3ed': {
    numberScale: 1.02,
    numberDx: 0,
    numberDy: -0.25,
    glyphs: {
      B: {
        scale: 1.04,
        dx: 0,
        dy: 0,
      },
      R: {
        scale: 1.06,
        dx: 0,
        dy: 0,
      },
      G: {
        scale: 1.14,
        dx: -0.5,
        dy: 0,
      },
    },
  },
  arn: {
    dx: 5.25,
    dy: -7.75,
    scaleX: 1.045,
    scaleY: 1.0098,
    spacing: 0.875,
    glyphs: {
      W: {
        scale: 1,
        dx: 0,
        dy: 0,
      },
      U: {
        scale: 1,
        dx: 0,
        dy: 0,
      },
      G: {
        scale: 1.09,
        dx: 0,
        dy: -0.25,
      },
      B: {
        scale: 1,
        dx: 0,
        dy: 0,
      },
      R: {
        scale: 1.05,
        dx: 0,
        dy: 0.25,
      },
    },
    numberScale: 1.01,
    numberDx: 0,
    numberDy: -0.25,
  },
  atq: {
    dx: 5.25,
    dy: -8,
    scaleX: 1.0293249999999998,
    scaleY: 1.02,
    spacing: 0.9784688995215312,
    glyphs: {
      B: {
        scale: 1,
        dx: 0,
        dy: 0,
      },
      R: {
        scale: 1.05,
        dx: 0.25,
        dy: 0.75,
      },
      W: {
        scale: 1,
        dx: 0,
        dy: 0,
      },
      U: {
        scale: 1,
        dx: 0,
        dy: 0,
      },
      G: {
        scale: 1.09,
        dx: 0.25,
        dy: 0.25,
      },
    },
    numberScale: 0.98,
    numberDx: -0.5,
    numberDy: -0.5,
  },
  drk: {
    dx: 4.5,
    dy: -7.25,
    scaleX: 1.039775,
    scaleY: 1.0048499999999998,
    spacing: 0.8696172248803828,
    glyphs: {
      B: {
        scale: 1,
        dx: 0,
        dy: 0,
      },
      G: {
        scale: 1,
        dx: -0.5,
        dy: 0,
      },
      U: {
        scale: 1,
        dx: 0,
        dy: 0,
      },
      W: {
        scale: 1.02,
        dx: -0.5,
        dy: 0.25,
      },
      R: {
        scale: 1.06,
        dx: 0.25,
        dy: 0.5,
      },
    },
    numberScale: 1,
    numberDx: -0.75,
    numberDy: -0.75,
  },
  leb: {
    dx: -1.5,
    spacing: 1.75,
    numberDy: -1,
    glyphs: {
      W: {
        scale: 1.09,
        dx: 0,
        dy: -0.5,
      },
      U: {
        scale: 1,
        dx: 0.5,
        dy: -1,
      },
      B: {
        scale: 1.03,
        dx: 0.25,
        dy: -1.25,
      },
      R: {
        scale: 1,
        dx: 0.5,
        dy: 0,
      },
      G: {
        scale: 1.12,
        dx: 0,
        dy: -1,
      },
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
      W: {
        scale: 0.98,
        dx: -0.5,
        dy: -2,
      },
      U: {
        scale: 0.94,
        dx: -0.5,
        dy: -1.5,
      },
      B: {
        scale: 0.97,
        dx: -0.25,
        dy: -2,
      },
      R: {
        scale: 0.95,
        dx: 0,
        dy: -1.5,
      },
      G: {
        scale: 1.04,
        dx: -0.25,
        dy: -3,
      },
    },
  },
  lea: {
    dy: 0.5,
    glyphs: {
      W: { scale: 1.04, dx: 0, dy: -0.5 },
      B: { scale: 1.04, dx: 0, dy: -0.5 },
      R: { scale: 1, dx: 0.5, dy: 0.5 },
    },
  },
};
