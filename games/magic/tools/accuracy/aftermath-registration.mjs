import { frameProfileRegistration } from './frame-profile-registration.mjs';

// No art, rules ink, mana or set symbols enter the fit. The horizontal join rail closes the upper panel; lower side samples also
// constrain rotation and skew without sampling either illustration.
export const AFTERMATH_WINDOWS = Object.freeze({
  left: { axis: 'x', lo: 12, hi: 29, position: 19.5, start: 100, step: 18, count: 29 },
  right: { axis: 'x', lo: 455, hi: 477, position: 468.5, start: 100, step: 18, count: 29 },
  top: { axis: 'y', lo: 12, hi: 29, position: 19, start: 76, step: 14, count: 26 },
  bottom: { axis: 'y', lo: 358, hi: 375, position: 369, start: 76, step: 14, count: 26 },
});
export function aftermathRegistration(reference, template) {
  return frameProfileRegistration(
    reference,
    template,
    AFTERMATH_WINDOWS,
    'aftermath-frame-profiles-v1',
  );
}
