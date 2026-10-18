import { profile as fem } from './sets/fem.js';
import { profile as fourth } from './sets/4ed.js';
import { profile as chronicles } from './sets/chr.js';
import type { SetCalibrationProfile } from './types.js';

/** Registration changes only when adding a new set, not when improving its values. */
export const setCalibrationProfiles: Readonly<Partial<Record<string, SetCalibrationProfile>>> = {
  fem,
  '4ed': fourth,
  chr: chronicles,
};
export const setCalibrationProfile = (code: string | null | undefined) =>
  setCalibrationProfiles[code?.toLowerCase() ?? ''];

/** Compatibility views for existing painters. No IO, image preparation or fitting. */
export function calibrationEntries<T>(
  select: (p: SetCalibrationProfile) => Readonly<Partial<Record<string, T>>>,
) {
  return Object.fromEntries(
    Object.entries(setCalibrationProfiles).flatMap(([set, profile]) =>
      Object.entries(select(profile!))
        .filter((entry): entry is [string, T] => entry[1] !== undefined)
        .map(([key, value]) => [`${set}/${key}`, value]),
    ),
  ) as Readonly<Partial<Record<string, T>>>;
}
