export const setCalibrationApiVersion = 1 as const;
export type CalibrationGroup = 'frame' | 'symbols' | 'lettering' | 'body' | 'footer' | 'colors';
export type CalibrationValue = number | boolean | string;
export interface CalibrationControl {
  readonly id: string;
  readonly label: string;
  readonly group: CalibrationGroup;
  /** 'all' applies across the profile; other keys identify a material/source symbol. */
  readonly scope: string;
  readonly value: CalibrationValue;
  readonly kind: 'number' | 'boolean' | 'choice' | 'color';
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly options?: readonly string[];
  readonly unit?: string;
}
/** Immutable, revision-bound proposal. IDs must come from describeSetCalibration. */
export interface SetCalibrationCandidate {
  readonly schema: 1;
  readonly set: string;
  readonly baseRevision: number;
  readonly values: Readonly<Record<string, CalibrationValue>>;
}
export interface SetCalibrationDescription {
  readonly schema: 1;
  readonly set: string;
  readonly supported: boolean;
  readonly revision: number | null;
  readonly controls: readonly CalibrationControl[];
  readonly notice: string;
}
