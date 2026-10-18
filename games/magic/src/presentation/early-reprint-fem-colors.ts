import { profile } from '../calibration/sets/fem.js';
import type { SetCalibrationProfile } from '../calibration/types.js';
const colors: SetCalibrationProfile['colors'] = profile.colors;
export const COLORS = Object.fromEntries(
  Object.entries(colors).map(([key, value]) => ['fem/' + key, value]),
);
