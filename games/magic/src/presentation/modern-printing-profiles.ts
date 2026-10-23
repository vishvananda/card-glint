import { M21_COMPONENT_CALIBRATION } from './m21-component-calibration.js';
import type { ManaSymbolTransform } from './symbol-adjustment.js';
import { M21_LAND_PLATES, type ModernLandPlateProfile } from './m21-land-plates.js';
import type { FrameHsb } from './frame-hsb.js';
import { M21_ORDINARY_PLATES } from './m21-ordinary-plates.js';
import { M21_ARTIFACT_PAPERS } from './m21-artifact-paper.js';
import type { HsbAdjustment } from './hsb.js';

export interface ModernArtifactPaper {
  readonly paper: HsbAdjustment;
  readonly name: HsbAdjustment;
  readonly type: HsbAdjustment;
}

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

export interface ModernWalkerTextAdjustment {
  readonly size: number;
  readonly dx: number;
  readonly dy: number;
  readonly width: number;
  readonly height: number;
  readonly leading: number;
}

export interface ModernHeadingAdjustment {
  readonly dx: number;
  readonly dy: number;
  readonly size: number;
  readonly width: number;
}

export interface ModernLoyaltyAdjustment extends ModernHeadingAdjustment {
  readonly font?: 'beleren-2016';
  readonly fractionalMetrics?: boolean;
}

export interface ModernWalkerStaticTextAdjustment {
  readonly dx: number;
  readonly dy: number;
  readonly width: number;
  readonly size: number;
  readonly leading: number;
  readonly textWidth: number;
  readonly fractionalMetrics?: boolean;
}

export interface ModernWalkerColonAdjustment extends ModernHeadingAdjustment {
  readonly fractionalMetrics?: boolean;
}

export interface ModernWalkerBadgeAdjustment {
  readonly dx: number;
  readonly dy: number;
  readonly width: number;
  readonly height: number;
}

export interface ModernPrintingProfile {
  readonly revision: number;
  /** Intrinsic heading glyphs, independent of color calibration policy. */
  readonly headingFont?: 'beleren-2016';
  /** Fractional design metrics and source-family fits in 488×680 painter units. */
  readonly typeText?: Readonly<Record<'plate' | 'components' | 'walker', ModernHeadingAdjustment>>;
  readonly mana?: {
    readonly normal: ManaSymbolTransform;
    readonly walker: ManaSymbolTransform;
    readonly shadow: readonly [number, number];
    readonly paperTargets: Readonly<Record<string, readonly [number, number, number]>>;
  };
  readonly componentMaterials?: Readonly<Record<string, FrameHsb>>;
  readonly planeswalkers?: {
    /** Deck printings need a separate body fit; retain their previous paper/text. */
    readonly deckCollectorNumbers: readonly string[];
    /** Second pass over the same translucent foreground, never the background. */
    readonly frameRepaint?: Readonly<Record<string, number>>;
    readonly loyalty?: {
      readonly starting: ModernLoyaltyAdjustment;
      readonly cost: ModernLoyaltyAdjustment;
      /** Keep multi-digit costs inside the same source badge. */
      readonly wideCost: ModernLoyaltyAdjustment;
    };
    /** Colon follows the visible cost ink, not the padded badge bitmap. */
    readonly colon?: ModernWalkerColonAdjustment;
    /** Scale the graphic about its center, then follow the reviewed cost translation. */
    readonly badges?: ModernWalkerBadgeAdjustment;
    /** Static paragraphs fit independently inside the existing ability gaps. */
    readonly staticText?: ModernWalkerStaticTextAdjustment;
    readonly paperColors: Readonly<Record<string, string>>;
    readonly rules: {
      readonly regular: ModernWalkerTextAdjustment;
      readonly tall: ModernWalkerTextAdjustment;
    };
  };
  /** Exact-source ordinary monocolored spells and colorless artifacts only. */
  readonly ordinaryPlates?: Readonly<Record<string, FrameHsb>>;
  /** Palette-specific panels on the exact ordinary artifact source. */
  readonly artifactPapers?: Readonly<Record<string, ModernArtifactPaper>>;
  readonly landPlates?: ModernLandPlateProfile;
  readonly statsText?: { readonly size: number; readonly fractionalMetrics: boolean };
  readonly rules?: {
    readonly fractionalMetrics?: boolean;
    readonly maximumSize?: number;
    readonly textWidth?: number;
    readonly dx?: number;
    /** Keep the legacy wrap budget while refitting with new font advances. */
    readonly preserveLineCount?: boolean;
    /** Shared ordinary typography; cap prevents spacing from growing a font. */
    readonly leading: number;
    readonly paragraphGap: number;
    readonly capAtBaseSize: boolean;
  };
  readonly largeLandSymbols?: Readonly<Record<string, ModernBasicLandSymbol>>;
  /** Additional cast shadow in canonical painter pixels, only on a matching fitted source. */
  readonly largeLandShadow?: {
    readonly alpha: number;
    readonly dx: number;
    readonly dy: number;
    readonly blur: number;
  };
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
    revision: 14,
    headingFont: 'beleren-2016',
    typeText: {
      plate: { dx: -1.25, dy: 0.5, size: 1.025, width: 0.985 },
      components: { dx: -0.75, dy: 0.25, size: 1, width: 1.01 },
      walker: { dx: -0.75, dy: 1.5, size: 1, width: 1 },
    },
    ...M21_COMPONENT_CALIBRATION,
    ordinaryPlates: M21_ORDINARY_PLATES,
    artifactPapers: M21_ARTIFACT_PAPERS,
    landPlates: M21_LAND_PLATES,
    statsText: { size: 0.97, fractionalMetrics: true },
    rules: {
      leading: 0.9875,
      paragraphGap: 0.4,
      capAtBaseSize: false,
      fractionalMetrics: true,
      maximumSize: 24.25,
      textWidth: 1.02,
      dx: 1.25,
      preserveLineCount: true,
    },
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
    largeLandShadow: { alpha: 0.6, dx: -2 / 3, dy: 2, blur: 2 / 3 },
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
