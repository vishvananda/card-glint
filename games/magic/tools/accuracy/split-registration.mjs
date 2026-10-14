import { frameProfileRegistration } from './frame-profile-registration.mjs';
// Outer straight frame rails only, excluding the two art and rules interiors.
export const SPLIT_WINDOWS = Object.freeze({
  left: { axis: 'x', lo: 16, hi: 32, position: 23.4, start: 75, step: 18, count: 31 },
  right: { axis: 'x', lo: 455, hi: 470, position: 463.3, start: 75, step: 18, count: 31 },
  top: { axis: 'y', lo: 16, hi: 32, position: 23.4, start: 68, step: 12, count: 29 },
  bottom: { axis: 'y', lo: 648, hi: 665, position: 656.6, start: 68, step: 12, count: 29 },
});
export function splitRegistration(reference, template) {
  return frameProfileRegistration(reference, template, SPLIT_WINDOWS, 'split-frame-profiles-v1');
}
