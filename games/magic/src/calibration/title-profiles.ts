import { table } from '../data/registry.js';
import type { CalibrationControl } from './editor-types.js';

/** Incremental adapter for sets whose frame/body still use the legacy painter. */
export interface SetTitleCalibration {
  readonly schema: 1;
  readonly revision: number;
  readonly set: string;
  readonly title: {
    readonly dx: number;
    readonly dy: number;
    readonly size: number;
    readonly width: number;
    readonly gray: number;
    readonly shadow: number;
  };
}
const profiles = table<Readonly<Record<string, SetTitleCalibration>>>('setTitleCalibrations');
export function setTitleCalibration(set: string | null | undefined) {
  return set?.toLowerCase() === 'lea' ? profiles.lea : undefined;
}
export function titleCalibrationControls(profile: SetTitleCalibration): CalibrationControl[] {
  return Object.entries(profile.title).map(([key, value]) => ({
    id: `title.${key}`,
    label: `name · ${key === 'dx' ? 'horizontal offset' : key === 'dy' ? 'vertical offset' : key}`,
    group: 'lettering',
    scope: 'all',
    kind: 'number',
    value,
    min: key === 'dx' || key === 'dy' ? -30 : key === 'width' ? 0.6 : key === 'size' ? 8 : 0,
    max:
      key === 'dx' || key === 'dy'
        ? 30
        : key === 'gray'
          ? 255
          : key === 'size'
            ? 60
            : key === 'width'
              ? 1.5
              : 4,
    step: key === 'gray' ? 1 : 0.05,
    unit: key === 'width' ? 'ratio' : key === 'gray' ? 'sRGB 0–255' : 'px',
  }));
}
