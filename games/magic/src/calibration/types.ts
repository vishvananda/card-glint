import type { FaceRect } from '../presentation/face-layout.js';
import type { FrameHsb } from '../presentation/frame-hsb.js';
import type { Rgb } from '../presentation/hsb.js';
import type { ManaSymbolTransform, ManaColor } from '../presentation/symbol-adjustment.js';
import type { ManaGlyphFamily } from '../presentation/historical-mana-profiles.js';
import type { RulesTypography } from '../presentation/rules-layout.js';
import type { CalibrationRulesAdjustment } from './rules-adjustment.js';
import type { EarlyTextTierOptions } from '../presentation/early-text-tiers.js';
import type { DualBorderGeometry } from '../presentation/dual-land-pinline.js';

/** Canonical rectangles are normalized; lettering uses 488 × 680 pixels. */
export interface CalibratedFrame {
  readonly family: 'abu' | 'fourth';
  readonly assetKey: string;
  readonly frame: FaceRect;
  readonly art: FaceRect;
  readonly stockWindow: FaceRect;
  /** Use the pinned family stock mask at an independent placement. When present,
   * this preserves its curved aperture instead of drawing stockWindow. */
  readonly stockMaskFrame?: FaceRect;
}
export interface CalibratedLettering {
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly width: number;
  readonly shadow: number;
  readonly trim: number;
  readonly gray: number;
}
export interface CalibratedSetSymbol {
  readonly right: number;
  readonly centerY: number;
  readonly width: number;
  readonly height: number;
  readonly crop: FaceRect;
  readonly outline?: number;
  readonly sampling?: ImageSmoothingQuality;
}
export interface CalibratedBody {
  /** Absolute canonical bounds; font sizes/spacing use the same units as layoutRules. */
  readonly bounds: { x: number; y: number; width: number; height: number };
  readonly maximumSize: number;
  readonly minimumSize: number;
  readonly typography: Readonly<RulesTypography>;
  /** Optional short-passage policy, measured using the host's wording reference. */
  readonly centered?: {
    readonly maxCharacters: number;
    readonly maxLines: number;
    readonly maximumSize: number;
  };
}
/** Source-bound ABU dual plates. Geometry is shared; the full-frame outline
 * and narrow paper bands have independent semantic palettes. */
export interface CalibratedDualLand {
  readonly stock: string;
  readonly sources: Readonly<
    Partial<Record<ManaColor, { readonly source: string; readonly adjustment: FrameHsb }>>
  >;
  readonly outlines: Readonly<Partial<Record<string, ManaColor>>>;
  readonly pinline: DualBorderGeometry & {
    readonly palette: Readonly<Partial<Record<ManaColor, Rgb>>>;
  };
}
/** A data-only profile. Shared selection/painting stays outside contribution files.
 * This first adapter covers ordinary old-border ABU/Fourth plates. */
export interface SetCalibrationProfile {
  readonly schema: 1;
  readonly revision: number;
  readonly set: string;
  readonly border: 'black' | 'white';
  readonly cornerRadius?: number;
  readonly frames: Readonly<Partial<Record<string, CalibratedFrame>>>;
  readonly dualLand?: CalibratedDualLand;
  readonly colors: Readonly<
    Partial<
      Record<
        string,
        {
          readonly source: string;
          readonly stock: string;
          readonly adjustment: FrameHsb;
        }
      >
    >
  >;
  readonly mana: {
    readonly geometry: ManaSymbolTransform;
    readonly paper: Readonly<Partial<Record<string, Rgb>>>;
    readonly ink: Rgb;
    /** Source-bound stroke weight and paper sampler are one preparation policy.
     * Values are pixels per nominal 24px disc, not output-resolution pixels. */
    readonly sourceInk?: Readonly<
      Partial<
        Record<
          ManaColor,
          {
            readonly family: Exclude<ManaGlyphFamily, 'modern' | 'historic-font'>;
            readonly pixels: number;
            readonly paperSample?: 'opaque-percentile';
          }
        >
      >
    >;
  };
  readonly title: CalibratedLettering;
  readonly type: CalibratedLettering;
  readonly footer: {
    readonly artist: CalibratedLettering & {
      readonly prefix?: string;
      readonly align?: CanvasTextAlign;
      readonly baseline?: CanvasTextBaseline;
      readonly maxWidth?: number;
    };
    readonly legal: Omit<CalibratedLettering, 'gray'> & {
      readonly defaultText?: string;
      readonly lightGray: number;
      readonly darkGray: number;
    };
    readonly stats: CalibratedLettering & { readonly baseline?: 'alphabetic' | 'middle' };
  };
  /** default or printed source-set key (Chronicles); custom host symbols bypass these. */
  readonly setSymbols?: Readonly<Partial<Record<string, CalibratedSetSymbol>>>;
  /** Omitted retains the established layout. Material override wins over default. */
  readonly body?: Readonly<Partial<Record<string, CalibratedBody>>>;
  /** Shared count/wrap model for early printings; Oracle always keeps a safe inset. */
  readonly textTiers?: Readonly<
    Omit<EarlyTextTierOptions, 'forceSmall'> & { readonly retainRegularAboveLines?: number }
  >;
  /** Shared deltas retain the printing's existing length/centering policy. */
  readonly rulesAdjustments?: Readonly<Partial<Record<string, CalibrationRulesAdjustment>>>;
}
