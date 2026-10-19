import type { SetTitleCalibration } from '../title-profiles.js';

/** Native title deltas; preserve the established painter when untouched.
 * Frame, body, type and footer keep their independent existing calibration. */
export const profile = {
  schema: 1,
  revision: 1,
  set: 'lea',
  title: { dx: 0, dy: 0, size: 27.8, width: 1, gray: 130, shadow: 1 },
} as const satisfies SetTitleCalibration;
