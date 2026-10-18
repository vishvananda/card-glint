import { profile } from '../calibration/sets/chr.js';
import type { SetCalibrationProfile } from '../calibration/types.js';
const colors: SetCalibrationProfile['colors'] = profile.colors;
export const COLORS = Object.fromEntries(
  Object.entries(colors).map(([key, value]) => ['chr/' + key, value]),
);
