import type { FrameHsb } from './frame-hsb.js';
import { M21_ORDINARY_PLATES } from './m21-ordinary-plates.js';

export interface ModernBasicLandSymbol {
  readonly source: string;
  /** Evidence identity; the immutable source URL is also checked at use. */
  readonly sha256: string;
  readonly geometry: {
    readonly dx: number;
    readonly dy: number;
    readonly scaleX: number;
    readonly scaleY: number;
  };
  readonly sourceInk: readonly [number, number, number];
  readonly body: readonly [number, number, number];
}

export interface ModernPrintingProfile {
  readonly revision: number;
  /** Exact-source ordinary monocolored spells and colorless artifacts only. */
  readonly ordinaryPlates?: Readonly<Record<string, FrameHsb>>;
  readonly rules?: {
    /** Shared ordinary typography; cap prevents spacing from growing a font. */
    readonly leading: number;
    readonly paragraphGap: number;
    readonly capAtBaseSize: boolean;
  };
  readonly largeLandSymbols?: Readonly<Record<string, ModernBasicLandSymbol>>;
  readonly footer: {
    readonly collectorFamily: string;
    readonly collectorSize: number;
    readonly collectorTracking: number;
    readonly artistSize: number;
    readonly artistTracking: number;
    readonly legalSize: number;
    readonly legalTracking: number;
    readonly collectorRarityX: number;
    readonly collectorOffset: readonly [number, number];
    readonly artistOffset: readonly [number, number];
    readonly legalOffset: readonly [number, number];
    readonly collectorMarker: {
      readonly center: readonly [number, number];
      readonly size: readonly [number, number];
    };
  };
  /** Printing content stays exact-set only when styles become transferable. */
  readonly printedLandRarities: readonly string[];
  readonly foilStarNumbers: readonly string[];
}

/** Canonical 488×680 painter units. Source/content review is separate from style. */
export const MODERN_PRINTING_PROFILES: Readonly<Record<string, ModernPrintingProfile>> = {
  m21: {
    revision: 4,
    ordinaryPlates: M21_ORDINARY_PLATES,
    rules: { leading: 0.975, paragraphGap: 0.4, capAtBaseSize: true },
    footer: {
      collectorFamily: 'CardRenderer MTG Gotham',
      collectorSize: 12.5,
      collectorTracking: 0,
      artistSize: 11.75,
      artistTracking: 0,
      legalSize: 11,
      legalTracking: 0.1,
      collectorRarityX: 92,
      collectorOffset: [-0.5, 1.5],
      artistOffset: [0.5, 1],
      legalOffset: [-0.5, 0.5],
      collectorMarker: { center: [62, 652.5], size: [11, 10] },
    },
    largeLandSymbols: {
      W: {
        source:
          'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/m15/basics/w.png',
        sha256: 'f15389170b0ef8a8a1d35e382929bc5e6806f391bb08678e8b2761d9412d960e',
        geometry: {
          dx: 0.5,
          dy: 11.0,
          scaleX: 1.075,
          scaleY: 1.08,
        },
        sourceInk: [252, 254, 255],
        body: [251, 252, 241],
      },
      U: {
        source:
          'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/m15/basics/u.png',
        sha256: '606865af8ae26d91185a540dc63ea8df44a1d153b0d205682e053141d8fe6e01',
        geometry: {
          dx: 0.25,
          dy: 9.0,
          scaleX: 1.0825,
          scaleY: 1.085,
        },
        sourceInk: [0, 117, 190],
        body: [22, 81, 184],
      },
      B: {
        source:
          'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/m15/basics/b.png',
        sha256: '6165a1a40d167605df5a3a39f975cd3a1bd9e0824d606055d7945f733aa680dd',
        geometry: {
          dx: 1.5,
          dy: 12.5,
          scaleX: 1.0975,
          scaleY: 1.11,
        },
        sourceInk: [39, 38, 36],
        body: [18, 16, 12],
      },
      R: {
        source:
          'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/m15/basics/r.png',
        sha256: '9219723601f8fcaee288d74a8ed100df0d58c2e9e70031602334e72f7190afd4',
        geometry: {
          dx: 3.25,
          dy: 9.0,
          scaleX: 1.0875,
          scaleY: 1.085,
        },
        sourceInk: [239, 56, 39],
        body: [211, 13, 5],
      },
      G: {
        source:
          'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/m15/basics/g.png',
        sha256: '7a8dfe92c8f3da536058e9d4499cce92d4dc926b87e4b58abac4b493afca2140',
        geometry: {
          dx: 0.25,
          dy: 11.5,
          scaleX: 1.105,
          scaleY: 1.1075,
        },
        sourceInk: [0, 123, 67],
        body: [23, 104, 61],
      },
    },
    printedLandRarities: ['243', '244', '245', '247', '249', '250', '251', '257', '258', '259'],
    foilStarNumbers: ['320', '324', '328', '332', '336'],
  },
};
