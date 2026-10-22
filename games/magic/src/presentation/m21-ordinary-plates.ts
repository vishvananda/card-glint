import type { FrameHsb } from './frame-hsb.js';
import type { PaperMask } from './frame-paper-mask.js';
import type { HsbAdjustment } from './hsb.js';
import type { FrameBlackPoint } from './frame-blackpoint.js';

// Shared source-local masks and tones. No scan transforms or printing IDs.
const root =
  'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new';
const rulesMask: PaperMask = {
  kind: 'polygon',
  points: [
    [0.073134, 0.6258],
    [0.073134, 0.92253],
    [0.926866, 0.92253],
    [0.922388, 0.918266],
    [0.922388, 0.629353],
    [0.078109, 0.629353],
  ],
  feather: 0.0020491803278688526,
};
const nameMask: PaperMask = {
  kind: 'polygon',
  points: [
    [0.062189, 0.066453],
    [0.067662, 0.065743],
    [0.066667, 0.070718],
    [0.067662, 0.086354],
    [0.073134, 0.09666],
    [0.076119, 0.099502],
    [0.924378, 0.099502],
    [0.927363, 0.100569],
    [0.927363, 0.103056],
    [0.931343, 0.099502],
    [0.935821, 0.093106],
    [0.938308, 0.087065],
    [0.939801, 0.078891],
    [0.939303, 0.069652],
    [0.937313, 0.062544],
    [0.933333, 0.055792],
    [0.926866, 0.049751],
    [0.073134, 0.049751],
    [0.065672, 0.05828],
  ],
  feather: 0.0020491803278688526,
};
const typeMask: PaperMask = {
  kind: 'polygon',
  points: [
    [0.064677, 0.575338],
    [0.065174, 0.576404],
    [0.066667, 0.577114],
    [0.067662, 0.576759],
    [0.068657, 0.577825],
    [0.066667, 0.587065],
    [0.067662, 0.600213],
    [0.071642, 0.609097],
    [0.076617, 0.614428],
    [0.924378, 0.614428],
    [0.926866, 0.613717],
    [0.929851, 0.615849],
    [0.936816, 0.605899],
    [0.939801, 0.593461],
    [0.939303, 0.584577],
    [0.937811, 0.578891],
    [0.933333, 0.570718],
    [0.926866, 0.564677],
    [0.073134, 0.564677],
    [0.068657, 0.568941],
  ],
  feather: 0.0020491803278688526,
};
const tones: Readonly<
  Record<
    string,
    {
      frame: HsbAdjustment;
      paper: HsbAdjustment;
      name: HsbAdjustment;
      type: HsbAdjustment;
      blackPoint?: FrameBlackPoint;
    }
  >
> = {
  w: {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
    paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9609146341463415 },
    name: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9609146341463415 },
    type: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9609146341463415 },
  },
  u: {
    frame: {
      hueDegrees: 8.268635681240198,
      saturationScale: 1.0570810706851301,
      brightnessScale: 0.9560439560439561,
    },
    paper: {
      hueDegrees: 13.083333333333371,
      saturationScale: 0.7768749999999998,
      brightnessScale: 0.975609756097561,
    },
    name: {
      hueDegrees: 7.285714285714334,
      saturationScale: 1.1378881987577634,
      brightnessScale: 1.0043668122270741,
    },
    type: {
      hueDegrees: 10.035714285714334,
      saturationScale: 1.1066995614035082,
      brightnessScale: 0.9956331877729258,
    },
    blackPoint: {
      lift: [0.040196078431372545, 0.012254901960784314, 0.013725490196078431],
      transition: 0.2,
    },
  },
  b: {
    frame: {
      hueDegrees: -38.63749999999999,
      saturationScale: 1.75,
      brightnessScale: 0.7369556451612903,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 0.7074017467248992,
      brightnessScale: 0.9717574786324786,
    },
    name: {
      hueDegrees: 0,
      saturationScale: 0.819803664921467,
      brightnessScale: 1.0482005494505493,
    },
    type: {
      hueDegrees: 0,
      saturationScale: 0.8097225908534104,
      brightnessScale: 1.020742238033635,
    },
    blackPoint: {
      lift: [0.01715686274509804, 0.01911764705882353, 0.02303921568627451],
      transition: 0.2,
    },
  },
  r: {
    frame: {
      hueDegrees: -2.6488549618320576,
      saturationScale: 1.1999999998800002,
      brightnessScale: 1.0148863636363636,
    },
    paper: {
      hueDegrees: -4.900181488203316,
      saturationScale: 0.6862366230677764,
      brightnessScale: 0.9547325102880659,
    },
    name: {
      hueDegrees: 0.5634386733416932,
      saturationScale: 0.9203659505388228,
      brightnessScale: 0.9540962924819774,
    },
    type: {
      hueDegrees: 0.4878048780487916,
      saturationScale: 0.9053980370774268,
      brightnessScale: 0.9434156378600824,
    },
    blackPoint: {
      lift: [0.03725490196078431, 0.02892156862745098, 0.01764705882352941],
      transition: 0.2,
    },
  },
  g: {
    frame: {
      hueDegrees: -0.9715909090908781,
      saturationScale: 1.0265866209262438,
      brightnessScale: 0.9298245614035088,
    },
    paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9619405021834062 },
    name: {
      hueDegrees: 0,
      saturationScale: 0.4889114832535894,
      brightnessScale: 1.0023076923076923,
    },
    type: { hueDegrees: 0, saturationScale: 0.4641826923076912, brightnessScale: 0.9975 },
    blackPoint: {
      lift: [0.027941176470588233, 0.01666666666666667, 0.02009803921568628],
      transition: 0.2,
    },
  },
  a: {
    frame: {
      hueDegrees: 18.260869565217376,
      saturationScale: 1.1304347826086951,
      brightnessScale: 1,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1.4812278761061959,
      brightnessScale: 0.9925694444444445,
    },
    name: {
      hueDegrees: 0,
      saturationScale: 1.5287962962962949,
      brightnessScale: 1.003968609865471,
    },
    type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  },
};
export const M21_ORDINARY_PLATES: Readonly<Record<string, FrameHsb>> = Object.fromEntries(
  Object.entries(tones).map(([color, tone]) => [
    root + '/' + color + '.png',
    {
      frame: tone.frame,
      paper: tone.paper,
      mask: rulesMask,
      regions: [
        { mask: nameMask, adjustment: tone.name },
        { mask: typeMask, adjustment: tone.type },
      ],
      ...(tone.blackPoint ? { blackPoint: tone.blackPoint } : {}),
      outerStock: [22 / 255, 19 / 255, 14 / 255],
      outerStockMaskSource: root + '/border.png',
    } satisfies FrameHsb,
  ]),
);
