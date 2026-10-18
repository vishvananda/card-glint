import { calibrationEntries } from '../calibration/profiles.js';
export type { CalibratedFrame as EarlyReprintFrameGeometry } from '../calibration/types.js';
export const EARLY_REPRINT_FRAMES = calibrationEntries((p) => p.frames);
