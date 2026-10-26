// Fixed Revised printed-interior landmarks. Art and stock-edge bands are
// diagnostics, not parameter selectors or independent certification checks.
import { medianDarkeningGradient } from './directed-frame-gradient.mjs';
export const revisedVerticalStrips = Object.freeze({
  fitTop: [95, 55, 110, 21, 'y'],
  fitBottom: [275, 600, 110, 26, 'y'],
  checkTop: [275, 55, 110, 21, 'y'],
  checkBottom: [95, 600, 110, 26, 'y'],
  certificatePaperTopLeft: [95, 400, 110, 22, 'y'],
  certificatePaperTopRight: [275, 400, 110, 22, 'y'],
  diagnosticArtBottom: [180, 365, 120, 24, 'y'],
  diagnosticOuterTop: [180, 18, 120, 22, 'y'],
  diagnosticOuterBottom: [180, 640, 120, 26, 'y'],
});
export const revisedVerticalChecks = Object.freeze([
  'checkTop',
  'checkBottom',
  'certificatePaperTopLeft',
  'certificatePaperTopRight',
]);
export const revisedVerticalOptions = Object.freeze({
  strips: revisedVerticalStrips,
  fitAnchors: [65, 612],
  verificationKeys: revisedVerticalChecks,
  gradient: medianDarkeningGradient,
});
