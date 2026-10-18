import type { FaceRect } from '../presentation/face-layout.js';
import type { FrameHsb } from '../presentation/frame-hsb.js';
import type { Rgb } from '../presentation/hsb.js';
import type { ManaSymbolTransform } from '../presentation/symbol-adjustment.js';
import type { RulesTypography } from '../presentation/rules-layout.js';

/** Canonical rectangles are normalized; lettering uses 488 × 680 pixels. */
export interface CalibratedFrame {
  readonly family: 'abu' | 'fourth';
  readonly assetKey: string;
  readonly frame: FaceRect;
  readonly art: FaceRect;
  readonly stockWindow: FaceRect;
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
/** A data-only profile. Shared selection/painting stays outside contribution files.
 * This first adapter covers ordinary old-border ABU/Fourth plates. */
export interface SetCalibrationProfile {
  readonly schema: 1;
  readonly revision: number;
  readonly set: string;
  readonly border: 'black' | 'white';
  readonly frames: Readonly<Partial<Record<string, CalibratedFrame>>>;
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
  };
  readonly title: CalibratedLettering;
  readonly type: CalibratedLettering;
  readonly footer: {
    readonly artist: CalibratedLettering;
    readonly legal: Omit<CalibratedLettering, 'gray'> & {
      readonly lightGray: number;
      readonly darkGray: number;
    };
    readonly stats: CalibratedLettering;
  };
  /** default or printed source-set key (Chronicles); custom host symbols bypass these. */
  readonly setSymbols?: Readonly<Partial<Record<string, CalibratedSetSymbol>>>;
  /** Omitted retains the established layout. Material override wins over default. */
  readonly body?: Readonly<Partial<Record<string, CalibratedBody>>>;
}
