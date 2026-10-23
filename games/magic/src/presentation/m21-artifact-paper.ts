import type { ModernArtifactPaper } from './modern-printing-profiles.js';

/** Complete ordinary M21 colored-artifact cohort: white (one printing), black
 * (two). Source-local panel tones preserve the artifact texture and pinlines.
 * Other palettes remain unmeasured; no per-card color overrides or scan poses. */
export const M21_ARTIFACT_PAPERS: Readonly<Record<string, ModernArtifactPaper>> = {
  W: {
    paper: {
      hueDegrees: 0,
      saturationScale: 1.4812278761061959,
      brightnessScale: 0.9925694444444445,
      rgbScale: [1.1305128680255774, 1.0646706102070989, 1.0451914251740428],
    },
    name: {
      hueDegrees: 0,
      saturationScale: 1.5287962962962949,
      brightnessScale: 1.003968609865471,
      rgbScale: [1.138633176857892, 1.0707862209845116, 1.0363354855712215],
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1.1067306170354465, 1.055220615311302, 1.026105908692965],
    },
  },
  B: {
    paper: {
      hueDegrees: 0,
      saturationScale: 1.4812278761061959,
      brightnessScale: 0.9925694444444445,
      rgbScale: [1.0873378143806982, 1.0207975854633058, 1.0275917516011772],
    },
    name: {
      hueDegrees: 0,
      saturationScale: 1.5287962962962949,
      brightnessScale: 1.003968609865471,
      rgbScale: [0.9138411159544915, 0.8404220713912476, 0.8360781270217386],
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9416658868928647, 0.8875437044911334, 0.8895199001363299],
    },
  },
};
