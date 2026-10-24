import type { EighthBasicPalette } from './eighth-basic-profile.js';
import type { ManaSymbolTransform, SymbolTransform } from './symbol-adjustment.js';
import type { FrameHsb } from './frame-hsb.js';
export interface EighthFrameGeometry {
  readonly scaleX: number;
  readonly scaleY: number;
  readonly dx: number;
  readonly dy: number;
}
export interface EighthTextTransform {
  readonly dx: number;
  readonly dy: number;
  readonly width: number;
  readonly height: number;
}
export interface EighthPrintingProfile {
  readonly inheritedFrom?: '8ed';
  readonly revision: number;
  readonly root: string;
  readonly geometry: {
    readonly ordinary: EighthFrameGeometry;
    readonly basic: EighthFrameGeometry;
  };
  readonly headings: {
    readonly title: { readonly size: number; readonly dx: number; readonly dy: number };
    readonly type: { readonly width: number; readonly dx: number; readonly dy: number };
  };
  readonly rules: {
    readonly maximumSize: number;
    readonly landMaximumSize: number;
    readonly flavorGap: number;
    readonly shortCenterLines?: number;
    readonly compact?: {
      readonly minimumSize: number;
      readonly leading: number;
      readonly minimumParagraphs: number;
    };
  };
  readonly mana: {
    readonly transform: ManaSymbolTransform;
    readonly paperTargets: Readonly<Record<string, readonly [number, number, number]>>;
  };
  readonly setSymbol: SymbolTransform;
  readonly largeLandSymbols: Readonly<
    Record<string, { readonly source: string; readonly geometry: EighthFrameGeometry }>
  >;
  readonly largeLandShadow: {
    readonly dx: number;
    readonly dy: number;
    readonly blur: number;
    readonly alpha: number;
  };
  readonly landPalettes: Readonly<Record<string, EighthBasicPalette>>;
  readonly materials: Readonly<Record<string, FrameHsb>>;
  readonly stock: { readonly white: string; readonly black: string };
  readonly outerRule: {
    readonly source: string;
    readonly width: number;
    readonly rgb: readonly [number, number, number];
  };
  readonly originalRules: Readonly<
    Record<string, { readonly text: string; readonly maximumSize: number }>
  >;
  readonly footer: { readonly artist: EighthTextTransform; readonly stats: EighthTextTransform };
}
