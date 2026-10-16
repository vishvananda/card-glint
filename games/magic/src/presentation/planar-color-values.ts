import type { HsbAdjustment } from './hsb.js';

/** Training-only pigment proposals retained after independent cohort checks.
 * Rejected components retain their source colors; source URLs are exact. */
export const PLANAR_COLORS: Readonly<
  Record<
    string,
    {
      source: string;
      frame: HsbAdjustment;
      paper: HsbAdjustment;
      title: HsbAdjustment;
      type: HsbAdjustment;
    }
  >
> = {
  'ordinary/W': {
    source:
      'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png',
    frame: {
      hueDegrees: -6.491752199413554,
      saturationScale: 0.8110599078341005,
      brightnessScale: 0.875,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8951612903225806, 0.8852459016393442, 0.9201680672268907],
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8694331983805668, 0.8615702479338844, 0.8975188781014024],
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.875, 0.8630705394190872, 0.8886486486486487],
    },
  },
  'colorshifted/W': {
    source:
      'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/w.png',
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9392523364485981, 0.9720812182741116, 0.9715909090909091],
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
    },
  },
  'ordinary/U': {
    source:
      'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png',
    frame: {
      hueDegrees: 18.3125,
      saturationScale: 0.8049999999999997,
      brightnessScale: 0.9475,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.891304347826087, 0.8851063829787235, 0.9170124481327802],
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.903896103896104, 0.8686987104337631, 0.9136771300448431],
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8897435897435898, 0.8779342723004694, 0.9079685746352413],
    },
  },
  'colorshifted/U': {
    source:
      'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/u.png',
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9784946236559141, 0.9901477832512315, 1.036697247706422],
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1.1098901098901097, 1.0403225806451613, 1.128980891719745],
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1.10989010989011, 1.0423387096774193, 1.1353503184713374],
    },
  },
  'ordinary/B': {
    source:
      'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/b.png',
    frame: {
      hueDegrees: -2.75,
      saturationScale: 0.9825000000000002,
      brightnessScale: 1,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.865546218487395, 0.8620689655172413, 0.8951965065502183],
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8559782608695653, 0.8110014104372356, 0.8306801736613603],
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8600508905852416, 0.8215223097112861, 0.8409703504043128],
    },
  },
  'colorshifted/B': {
    source:
      'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/b.png',
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1.0509554140127388, 1.0723684210526314, 1.1143790849673203],
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.7767857142857142, 0.724609375, 0.741869918699187],
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.7732142857142856, 0.736328125, 0.7439024390243902],
    },
  },
  'ordinary/R': {
    source:
      'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png',
    frame: {
      hueDegrees: 4.1875,
      saturationScale: 1.0318749999999994,
      brightnessScale: 0.9150000000000003,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8938775510204081, 0.8893805309734514, 0.9065420560747663],
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8801652892561984, 0.8810679611650486, 0.8488210818307905],
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8780991735537191, 0.8691931540342297, 0.8393351800554018],
    },
  },
  'colorshifted/R': {
    source:
      'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/r.png',
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1, 1.0657894736842104, 1.0162601626016259],
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
    },
  },
  'ordinary/G': {
    source:
      'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png',
    frame: {
      hueDegrees: -39.28098739495795,
      saturationScale: 1.0733997252747252,
      brightnessScale: 0.86328125,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8818181818181817, 0.8641304347826086, 0.9011494252873564],
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8756281407035176, 0.85, 0.8712121212121212],
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8844221105527638, 0.8489892984542211, 0.8731155778894473],
    },
  },
  'ordinary/M': {
    source:
      'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png',
    frame: {
      hueDegrees: 2,
      saturationScale: 1.159999999999999,
      brightnessScale: 0.8725,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8582995951417004, 0.8613445378151261, 0.9415887850467289],
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8467741935483871, 0.8443579766536965, 0.734375],
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8541176470588236, 0.8469656992084432, 0.7004048582995952],
    },
  },
};
