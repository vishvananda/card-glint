import type { SetTitleCalibration } from '../title-profiles.js';

/** Native title deltas; preserve the established painter when untouched.
 * Frame, body and footer keep their independent existing calibration. */
export const profile = {
  schema: 1,
  revision: 2,
  set: 'lea',
  title: { dx: 0, dy: 0, size: 27.8, width: 1, wordSpacing: 0, gray: 130, shadow: 1 },
  type: { dx: 0, dy: 0, size: 22.2, width: 1, wordSpacing: 0, gray: 130, shadow: 1 },
} as const satisfies SetTitleCalibration;
