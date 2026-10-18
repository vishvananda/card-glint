import { profileSets } from '../data/scopes.js';
import { table } from '../data/registry.js';
import type { SetCalibrationProfile } from './types.js';
export const setCalibrationProfiles =
  table<Readonly<Partial<Record<string, SetCalibrationProfile>>>>('setCalibrationProfiles');
export function setCalibrationProfile(code: string | null | undefined) {
  const set = code?.toLowerCase() ?? '';
  return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;
}

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
