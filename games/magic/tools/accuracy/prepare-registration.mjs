import { frameProfileRegistration } from './frame-profile-registration.mjs';
import { ADVENTURE_WINDOWS } from './adventure-registration.mjs';

// The native Prepared stock uses the same outside rails and bottom rule as
// Adventure. These samples exclude art, wording, inset headers, stamp and PT.
// The actual Prepared plate supplies the independent edge target, not text.
export const PREPARE_WINDOWS = ADVENTURE_WINDOWS;
export const prepareRegistration = (reference, template) =>
  frameProfileRegistration(reference, template, PREPARE_WINDOWS, 'prepare-frame-profiles-v1');
