import { table } from '../data/registry.js';
import type { CalibrationControl } from './editor-types.js';

/** Canonical 488 × 680 lettering; spacing adds to each space before width scaling. */
export interface CalibratedHeading {
  readonly dx: number;
  readonly dy: number;
  readonly size: number;
  readonly width: number;
  readonly wordSpacing: number;
  readonly gray: number;
  readonly shadow: number;
}
/** Incremental adapter for sets whose frame/body still use the legacy painter. */
export interface SetTitleCalibration {
  readonly schema: 1;
  readonly revision: number;
  readonly set: string;
  readonly title: Omit<CalibratedHeading, 'wordSpacing'> & { readonly wordSpacing?: number };
  readonly type?: CalibratedHeading;
}
/** Current data resolves both roles; older host-authored title-only shapes remain valid. */
export interface ResolvedSetTitleCalibration extends SetTitleCalibration {
  readonly title: CalibratedHeading;
  readonly type: CalibratedHeading;
}
const profiles =
  table<Readonly<Record<string, ResolvedSetTitleCalibration>>>('setTitleCalibrations');
export function setTitleCalibration(set: string | null | undefined) {
  return set?.toLowerCase() === 'lea' ? profiles.lea : undefined;
}
export function titleCalibrationControls(
  profile: ResolvedSetTitleCalibration,
): CalibrationControl[] {
  return (['title', 'type'] as const).flatMap((role) =>
    Object.entries(profile[role]).map(([key, value]) => ({
      id: `${role}.${key}`,
      label: `${role === 'title' ? 'name' : 'type'} · ${key === 'dx' ? 'horizontal offset' : key === 'dy' ? 'vertical offset' : key}`,
      group: 'lettering',
      scope: 'all',
      kind: 'number',
      value,
      min:
        key === 'wordSpacing'
          ? -6
          : key === 'dx' || key === 'dy'
            ? -30
            : key === 'width'
              ? 0.6
              : key === 'size'
                ? 8
                : 0,
      max:
        key === 'wordSpacing'
          ? 6
          : key === 'dx' || key === 'dy'
            ? 30
            : key === 'gray'
              ? 255
              : key === 'size'
                ? 60
                : key === 'width'
                  ? 1.5
                  : 4,
      step: key === 'width' ? 0.001 : key === 'gray' ? 1 : 0.05,
      unit: key === 'width' ? 'ratio' : key === 'gray' ? 'sRGB 0–255' : 'px',
    })),
  );
}
