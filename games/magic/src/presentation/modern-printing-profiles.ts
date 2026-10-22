export interface ModernPrintingProfile {
  readonly revision: number;
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
    revision: 1,
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
    printedLandRarities: ['243', '244', '245', '247', '249', '250', '251', '257', '258', '259'],
    foilStarNumbers: ['320', '324', '328', '332', '336'],
  },
};
