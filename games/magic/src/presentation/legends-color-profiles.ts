import type { PrintingColorProfile } from './printing-color-profiles.js';
/** Legends color fit follows source/geometry selection. Bind only the pinned
 * plate and exact placement; rejected components retain their original color.
 * See fixtures/accuracy/legends-colors.json for holdouts and texture limits. */
export const LEGENDS_COLOR_PROFILES: Readonly<Record<string, PrintingColorProfile>> = {
  'leg/black/retro/w.png': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",[-0.015000000000000013,-0.016735294117647074,1.03,1.032]]',
    materials: {
      'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png':
        {
          frame: {
            hueDegrees: 31.5,
            saturationScale: 0.7737499999999997,
            brightnessScale: 1.0418750000000003,
          },
          paper: {
            hueDegrees: 46.92434210526312,
            saturationScale: 1.3968055555555547,
            brightnessScale: 1.1227453271028038,
          },
          mask: {
            kind: 'rect',
            rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2867647058823529],
            feather: 0.0013333333333333333,
          },
        },
    },
  },
  'leg/black/retro/u.png': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.006241180327868882,0.003875294117647035,0.989584,0.995748]]',
    materials: {
      'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png':
        {
          frame: {
            hueDegrees: -6,
            saturationScale: 0.6031249999999994,
            brightnessScale: 1.0975000000000001,
          },
          paper: {
            hueDegrees: -10.598914565826249,
            saturationScale: 0.9226579520697171,
            brightnessScale: 1.0041322314049586,
          },
          mask: {
            kind: 'rect',
            rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
            feather: 0.0013333333333333333,
          },
        },
    },
  },
  'leg/black/retro/b.png': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.015000000000000013,-0.016470588235294133,1.03,1.03]]',
    materials: {
      'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png':
        {
          frame: {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
          },
          paper: {
            hueDegrees: 5.6763925729442235,
            saturationScale: 0.8794297625777275,
            brightnessScale: 1.0209205020920502,
          },
          mask: {
            kind: 'chroma',
            bounds: [
              0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294,
            ],
            seed: [0.5, 0.7352941176470589],
            frameRgb: [0.17647058823529413, 0.22450980392156863, 0.23627450980392156],
            paperRgb: [0.9372549019607843, 0.8, 0.596078431372549],
          },
        },
    },
  },
  'leg/black/retro/r.png': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.006241180327868882,0.004610588235294094,0.989584,0.995748]]',
    materials: {
      'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png':
        {
          frame: {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
          },
          paper: {
            hueDegrees: 21.86087449126046,
            saturationScale: 0.9073305928571983,
            brightnessScale: 0.850835322195704,
          },
          accents: [
            {
              mask: {
                rings: [
                  {
                    outer: [
                      0.08894759288155257, 0.07955119284846228, 0.8241582023272438,
                      0.47702832443549975,
                    ],
                    inner: [
                      0.10344283764610208, 0.07955119284846228, 0.8096629575626944,
                      0.4652133814154255,
                    ],
                  },
                ],
                hueCenter: 0,
                hueRadius: 70,
                hueFeather: 10,
                saturation: [0.01, 0.08],
                brightness: [0.65, 0.85],
              },
              adjustment: {
                hueDegrees: 9.95535714285711,
                saturationScale: 0.8848407077066573,
                brightnessScale: 1.003157894736842,
              },
            },
            {
              mask: {
                rings: [
                  {
                    outer: [
                      0.10344283764610208, 0.5964549499767128, 0.7889554650419093,
                      0.30128104701189456,
                    ],
                    inner: [
                      0.11793808241065161, 0.5964549499767128, 0.7744602202773598,
                      0.2924198397468389,
                    ],
                  },
                ],
                hueCenter: 0,
                hueRadius: 70,
                hueFeather: 10,
                saturation: [0.01, 0.08],
                brightness: [0.65, 0.85],
              },
              adjustment: {
                hueDegrees: 33.20021777976331,
                saturationScale: 0.8716772230501736,
                brightnessScale: 0.9551148225469728,
              },
            },
          ],
          mask: {
            kind: 'rect',
            rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
            feather: 0.0013333333333333333,
          },
        },
    },
  },
  'leg/black/retro/g.png': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.007265770491803308,0.004855294117647071,0.989584,0.993784]]',
    materials: {
      'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png':
        {
          frame: {
            hueDegrees: -9.546487090367464,
            saturationScale: 0.9883385744234803,
            brightnessScale: 1.2090680100755669,
          },
          paper: {
            hueDegrees: 23.60706205559154,
            saturationScale: 0.9735775550740341,
            brightnessScale: 0.7845303867403315,
          },
          mask: {
            kind: 'chroma',
            bounds: [
              0.08235432726293468, 0.5828441356175872, 0.8394486148045915, 0.32346951000359414,
            ],
            seed: [0.5010266940451745, 0.7385887145082066],
            frameRgb: [0.23333333333333334, 0.38921568627450975, 0.28137254901960784],
            paperRgb: [0.7098039215686275, 0.5450980392156862, 0.403921568627451],
          },
        },
    },
  },
  'leg/black/retro/a.png': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.006192590163934432,0.004855294117647071,0.987636,0.993784]]',
    materials: {
      'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png':
        {
          frame: {
            hueDegrees: 24.352415966386616,
            saturationScale: 1.09714025198939,
            brightnessScale: 1.158811475409836,
          },
          paper: {
            hueDegrees: 18.140759005145696,
            saturationScale: 0.8517161410018563,
            brightnessScale: 1.0706188596859518,
          },
          mask: {
            kind: 'rect',
            rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
            feather: 0.0013333333333333333,
          },
        },
    },
  },
  'leg/black/retro/l.png': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png",[0.0052165901639344555,0.00559058823529413,0.989584,0.993784]]',
    materials: {
      'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png':
        {
          frame: {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            rgbScale: [1.21125, 1.2400000000000002, 0.98875],
          },
          paper: {
            hueDegrees: 14.93891019140574,
            saturationScale: 0.9333152173913042,
            brightnessScale: 1,
          },
          mask: {
            kind: 'rect',
            rect: [0.1265358333052816, 0.6083023840900922, 0.7510856027198977, 0.2770456451419673],
            feather: 0.0013333333333333333,
          },
          accents: [
            {
              mask: {
                rings: [
                  {
                    outer: [0.08266666666666667, 0.0719047619047619, 0.838, 0.4866666666666667],
                    inner: [
                      0.09333333333333334, 0.07952380952380952, 0.8166666666666667,
                      0.4714285714285714,
                    ],
                  },
                ],
                hueCenter: 55,
                hueRadius: 35,
                hueFeather: 10,
                saturation: [0.35, 0.7],
              },
              adjustment: {
                hueDegrees: 5.553601139457442,
                saturationScale: 0.5666761230892462,
                brightnessScale: 0.9833239619377162,
              },
            },
            {
              mask: {
                rings: [
                  {
                    outer: [0.112, 0.5957142857142858, 0.7826666666666666, 0.30047619047619045],
                    inner: [0.12533333333333332, 0.61, 0.7533333333333333, 0.27714285714285714],
                  },
                ],
                hueCenter: 55,
                hueRadius: 35,
                hueFeather: 10,
                saturation: [0.35, 0.7],
              },
              adjustment: {
                hueDegrees: 6.712541190153161,
                saturationScale: 0.682745288248337,
                brightnessScale: 0.7639751552795031,
              },
            },
          ],
        },
    },
  },
  'leg/black/retro/m.png': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png",[0.0037205395409838113,0.004187595294117773,0.9910362339999996,0.9947522519999996]]',
    materials: {
      'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png':
        {
          frame: {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
          },
          paper: {
            hueDegrees: 1.9433497536946334,
            saturationScale: 0.9884598707032473,
            brightnessScale: 1.0119047619047619,
          },
          mask: {
            kind: 'rect',
            rect: [0.1160164271047228, 0.6008146639511202, 0.7742282963611269, 0.29501617347550013],
            feather: 0.0013333333333333333,
          },
        },
    },
  },
};
