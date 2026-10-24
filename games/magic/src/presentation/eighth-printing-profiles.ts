import type { EighthPrintingProfile } from './eighth-printing-types.js';
import { profile } from '../calibration/eighth/8ed.js';
/** Authoritative per-set data; generated transport omits review evidence. */
export const EIGHTH_PRINTING_PROFILES: Readonly<Record<string, EighthPrintingProfile>> = {
  '8ed': profile,
};
