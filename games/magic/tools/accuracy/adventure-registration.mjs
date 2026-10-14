import { frameProfileRegistration } from './frame-profile-registration.mjs';
// Outside rails and the straight book edge only. Bottom excludes stamp and PT.
export const ADVENTURE_WINDOWS = Object.freeze({
  left: { axis: 'x', lo: 14, hi: 30, position: 20.5, start: 90, step: 18, count: 27 },
  right: { axis: 'x', lo: 458, hi: 474, position: 467.5, start: 90, step: 18, count: 27 },
  top: { axis: 'y', lo: 14, hi: 30, position: 20.5, start: 80, step: 14, count: 24 },
  bottom: {
    axis: 'y',
    lo: 621,
    hi: 637,
    position: 629,
    start: 55,
    step: 13,
    count: 31,
    exclude: [
      [207, 282],
      [360, 475],
    ],
  },
});
export const adventureRegistration = (reference, template) =>
  frameProfileRegistration(reference, template, ADVENTURE_WINDOWS, 'adventure-frame-profiles-v1');
