import type { FrameHsb } from './frame-hsb.js';
import type { HsbAdjustment } from './hsb.js';
import { rulesMask, nameMask, typeMask } from './m21-ordinary-plates.js';

export interface ModernLandPlateProfile {
  readonly root: string;
  readonly materials: Readonly<Record<string, FrameHsb>>;
  readonly neutralHeaders: FrameHsb;
  readonly commonTexture: HsbAdjustment;
}
const root =
  'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new';
const identity = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 };
const tones: Readonly<
  Record<
    string,
    {
      paper: HsbAdjustment;
      name: HsbAdjustment;
      type: HsbAdjustment;
    }
  >
> = {
  l: {
    paper: {
      hueDegrees: 0,
      saturationScale: 0.36186252771618715,
      brightnessScale: 0.9992769607843138,
    },
    name: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
    },
    type: {
      hueDegrees: 0,
      saturationScale: 0.7974142156862755,
      brightnessScale: 0.983132530120482,
    },
  },
  lb: {
    paper: {
      hueDegrees: 0,
      saturationScale: 0.6273323471400407,
      brightnessScale: 1.0168222891566263,
    },
    name: {
      hueDegrees: 0,
      saturationScale: 0.8377643384940193,
      brightnessScale: 1.0846225761772852,
    },
    type: {
      hueDegrees: 0,
      saturationScale: 0.8339454094292815,
      brightnessScale: 1.03473971722365,
    },
  },
  lr: {
    paper: {
      hueDegrees: 2.850960706248884,
      saturationScale: 1.0698769619302055,
      brightnessScale: 0.9617021276595745,
    },
    name: {
      hueDegrees: 1.2578055307760678,
      saturationScale: 0.8451647222833665,
      brightnessScale: 0.9525773195876289,
    },
    type: {
      hueDegrees: 1.176470588235361,
      saturationScale: 0.8799659175631062,
      brightnessScale: 0.9423868312757202,
    },
  },
  lg: {
    paper: {
      hueDegrees: 6.9791666666667425,
      saturationScale: 0.6891025641025641,
      brightnessScale: 0.9674418604651163,
    },
    name: {
      hueDegrees: 0,
      saturationScale: 0.5613749999999992,
      brightnessScale: 1.0071153846153846,
    },
    type: {
      hueDegrees: 0,
      saturationScale: 0.4701157407407397,
      brightnessScale: 0.9975,
    },
  },
  lw: {
    paper: {
      hueDegrees: 3.9016830870280046,
      saturationScale: 0.9471563032926669,
      brightnessScale: 0.9797570850202428,
    },
    name: {
      hueDegrees: 0,
      saturationScale: 1.0982627118644075,
      brightnessScale: 0.9850389812889813,
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1.4374646892655398,
      brightnessScale: 0.985206611570248,
    },
  },
  lu: {
    paper: {
      hueDegrees: 7.5,
      saturationScale: 1.0238543628374135,
      brightnessScale: 1.0128755364806867,
    },
    name: {
      hueDegrees: 6.981076286221196,
      saturationScale: 1.1583237986270025,
      brightnessScale: 1.0109890109890112,
    },
    type: {
      hueDegrees: 8.989010989010922,
      saturationScale: 1.1191836734693865,
      brightnessScale: 0.9956236323851202,
    },
  },
};
function material(tone: {
  paper: HsbAdjustment;
  name: HsbAdjustment;
  type: HsbAdjustment;
}): FrameHsb {
  return {
    frame: identity,
    paper: tone.paper,
    mask: rulesMask,
    regions: [
      { mask: nameMask, adjustment: tone.name },
      { mask: typeMask, adjustment: tone.type },
    ],
    outerStock: [22 / 255, 19 / 255, 14 / 255],
    outerStockMaskSource: root + '/border.png',
  };
}
/** Shared source roles, not per-card color exceptions or scan transforms. */
export const M21_LAND_PLATES: ModernLandPlateProfile = {
  root,
  materials: Object.fromEntries(
    Object.entries(tones).map(([key, tone]) => [root + '/' + key + '.png', material(tone)]),
  ),
  neutralHeaders: material({
    paper: {
      hueDegrees: 0,
      saturationScale: 0.36186252771618715,
      brightnessScale: 0.9992769607843138,
    },
    name: {
      hueDegrees: 0,
      saturationScale: 0.4306103286384983,
      brightnessScale: 1.0202884615384615,
    },
    type: {
      hueDegrees: 0,
      saturationScale: 0.4608649289099515,
      brightnessScale: 1.0131174698795178,
    },
  }),
  commonTexture: {
    hueDegrees: -1.8329248366012507,
    saturationScale: 0.957022292993631,
    brightnessScale: 0.9610108024691361,
  },
};
