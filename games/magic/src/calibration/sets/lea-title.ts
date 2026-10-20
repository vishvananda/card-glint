import type { SetTitleCalibration } from '../title-profiles.js';

/** Native title deltas; preserve the established painter when untouched.
 * Frame, body and footer keep their independent existing calibration. */
export const profile = {
  schema: 1,
  revision: 2,
  set: 'lea',
  title: { dx: 1.5, dy: 0, size: 27.4, width: 0.984, wordSpacing: -0.05, gray: 130, shadow: 1 },
  type: { dx: -0.8, dy: -0.4, size: 23.1, width: 0.973, wordSpacing: 0.4, gray: 130, shadow: 1 },
} as const satisfies SetTitleCalibration;
