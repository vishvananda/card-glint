import type { FrameHsb } from './frame-hsb.js';
// Exact source and geometry bindings; rejected components retain source pigment.
export const COLORS: Readonly<
  Record<string, { source: string; stock: string; adjustment: FrameHsb }>
> = {
  'fem/G': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.006216885245901601,0.007918235294117677,0.9886100000000001,0.989856]]',
    stock: '#262626',
    adjustment: {
      frame: {
        hueDegrees: 1.251207876464645,
        saturationScale: 0.7697110830363157,
        brightnessScale: 0.9590171329316695,
        valueGamma: 1.2325331633252918,
      },
      paper: {
        hueDegrees: -3.589570914586081,
        saturationScale: 0.8522584357558871,
        brightnessScale: 0.8654806395040973,
        valueGamma: 1.4865299443201976,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.08235432726293468, 0.5828441356175872, 0.8394486148045915, 0.32346951000359414],
        seed: [0.5010266940451745, 0.7385887145082066],
        frameRgb: [0.24705882352941178, 0.403921568627451, 0.28431372549019607],
        paperRgb: [0.7705882352941177, 0.592156862745098, 0.4627450980392157],
      },
    },
  },
  'fem/B': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.016518442622950862,-0.014551470588235306,1.0315,1.028]]',
    stock: '#262626',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.080570984590071,
        rgbScale: [0.9761631483694743, 0.8084439610400957, 0.7672364941348535],
      },
      paper: {
        hueDegrees: -4.353154962081819,
        saturationScale: 0.8741836011856183,
        brightnessScale: 0.8950970243524266,
        valueGamma: 1.0488877750288375,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.17647058823529413, 0.22156862745098038, 0.23333333333333334],
        paperRgb: [0.9529411764705882, 0.8196078431372549, 0.6235294117647059],
      },
    },
  },
  'fem/W': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.006704885245901645,0.006692941176470516,0.987636,0.9908380000000001]]',
    stock: '#262626',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 0.9047218006061872,
        rgbScale: [0.9603592550207505, 0.969666349449092, 0.9237657636977362],
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.4999999999999984,
        rgbScale: [0.9337343269356239, 0.9507757122470416, 0.9239917884670539],
      },
      mask: {
        kind: 'rect',
        rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
        feather: 0.0013333333333333333,
      },
    },
  },
  'fem/L-red': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.016950819672131166,-0.015191176470588218,1.038,1.0245]]',
    stock: '#262626',
    adjustment: {
      frame: {
        hueDegrees: 34.739264477887076,
        saturationScale: 0.9852773323887644,
        brightnessScale: 1.378086884956502,
        valueGamma: 1.4999999999999998,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.5,
        rgbScale: [1.0750463889594257, 1.147262906859306, 1.3058087039078397],
      },
      mask: {
        kind: 'rect',
        rect: [0.13934426229508196, 0.6088235294117647, 0.723360655737705, 0.2705882352941177],
        feather: 0.0013333333333333333,
      },
      accents: [
        {
          mask: {
            rings: [
              {
                outer: [
                  0.0942622950819672, 0.08970588235294118, 0.8176229508196722, 0.47205882352941175,
                ],
                inner: [
                  0.1168032786885246, 0.10441176470588236, 0.764344262295082, 0.43970588235294117,
                ],
              },
              {
                outer: [
                  0.12295081967213115, 0.5955882352941176, 0.7581967213114754, 0.29558823529411765,
                ],
                inner: [
                  0.13934426229508196, 0.6088235294117647, 0.7233606557377049, 0.27058823529411763,
                ],
              },
            ],
            hueCenter: 28,
            hueRadius: 18,
            hueFeather: 6,
            saturation: [0.25, 0.5],
          },
          adjustment: {
            hueDegrees: -23.362286673872802,
            saturationScale: 0.7914832755461864,
            brightnessScale: 0.8410498345318217,
            valueGamma: 1,
          },
        },
      ],
    },
  },
  'fem/A': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.005924295081967185,0.006325294117646987,0.987149,0.9908380000000001]]',
    stock: '#262626',
    adjustment: {
      frame: {
        hueDegrees: 3.878120086034839,
        saturationScale: 0.9980847697555724,
        brightnessScale: 1.1474793580068792,
        valueGamma: 1.5,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.1673938054552606,
        rgbScale: [0.939072731067789, 0.9647331322311847, 0.9268316848919987],
      },
      mask: {
        kind: 'rect',
        rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
        feather: 0.0013333333333333333,
      },
    },
  },
  'fem/U': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.004960442622950849,0.006754411764705876,0.989584,0.99182]]',
    stock: '#262626',
    adjustment: {
      frame: {
        hueDegrees: -8.289375676561631,
        saturationScale: 0.7957912123160688,
        brightnessScale: 0.855480512174471,
        valueGamma: 1.3399926831767899,
      },
      paper: {
        hueDegrees: -4.519626107271086,
        saturationScale: 1.251409522387414,
        brightnessScale: 0.8689747189740745,
        valueGamma: 1,
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
  'fem/R': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.0059607377049179944,0.004549117647058901,0.9886100000000001,0.9947659999999999]]',
    stock: '#262626',
    adjustment: {
      frame: {
        hueDegrees: 0.8028009700657401,
        saturationScale: 0.8045978763853561,
        brightnessScale: 0.9060701809480648,
        valueGamma: 1.5,
      },
      paper: {
        hueDegrees: 8.558937304421088,
        saturationScale: 0.8982475283636524,
        brightnessScale: 0.7671866990515135,
        valueGamma: 1.1084835047730028,
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
};
