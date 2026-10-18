import type { FrameHsb } from './frame-hsb.js';
// Exact source and geometry bindings; rejected components retain source pigment.
export const COLORS: Readonly<
  Record<string, { source: string; stock: string; adjustment: FrameHsb }>
> = {
  '4ed/U': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.007924885245901644,0.006508529411764717,0.985201,0.987892]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: -0.26413068749876323,
        saturationScale: 0.7556069004159305,
        brightnessScale: 0.9637940356946514,
        valueGamma: 1.1520627609902379,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 0.6500000022497416,
        rgbScale: [1.0196924599216335, 0.9804914979909146, 0.9654265986710783],
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
  '4ed/W': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.008925180327868902,0.006202058823529418,0.984227,0.9874010000000001]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: -1.549919023241797,
        saturationScale: 0.8638761098971318,
        brightnessScale: 1.004749005247231,
        valueGamma: 1.0143691647512694,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.5496897832600423,
        brightnessScale: 0.9837897863456533,
        valueGamma: 0.8235208085777984,
      },
      mask: {
        kind: 'rect',
        rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
        feather: 0.0013333333333333333,
      },
    },
  },
  '4ed/B': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png",[0.007680885245901622,0.007734117647058839,0.985688,0.9883829999999999]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: -5.229308001385132,
        saturationScale: 0.7641656028655605,
        brightnessScale: 0.9509843739097822,
        valueGamma: 0.9813040358304043,
      },
      paper: {
        hueDegrees: -1.6614819506494392,
        saturationScale: 0.7568971443875485,
        brightnessScale: 0.9576337868904264,
        valueGamma: 0.9978138320445653,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.08235432726293468, 0.5828441356175872, 0.8394486148045915, 0.32346951000359414],
        seed: [0.5010266940451745, 0.7385887145082066],
        frameRgb: [0.2068627450980392, 0.24411764705882355, 0.20980392156862746],
        paperRgb: [0.984313725490196, 0.7686274509803922, 0.6196078431372549],
      },
    },
  },
  '4ed/R': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.008913032786885261,0.005099705882352976,0.98374,0.990347]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: -1.0801645730403173,
        saturationScale: 0.798755339604909,
        brightnessScale: 0.8762029872626991,
        valueGamma: 1.1092496414429285,
      },
      paper: {
        hueDegrees: -2.81611855729118,
        saturationScale: 0.7389631978314873,
        brightnessScale: 0.9230037970559838,
        valueGamma: 0.9470970400550884,
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
  '4ed/A': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.008376442622950769,0.005957058823529423,0.9827660000000001,0.987892]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1,
      },
      paper: {
        hueDegrees: -5.317285781971651,
        saturationScale: 0.8604202774412151,
        brightnessScale: 0.9877349071968816,
        valueGamma: 0.9338922139939904,
      },
      mask: {
        kind: 'rect',
        rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
        feather: 0.0013333333333333333,
      },
    },
  },
  '4ed/G': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.009925475409836047,0.008101176470588223,0.983253,0.985437]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: 1.714285716297824,
        saturationScale: 0.9460520787621132,
        brightnessScale: 0.9691116786611378,
        valueGamma: 0.9724214955136443,
      },
      paper: {
        hueDegrees: 0.3857547484429573,
        saturationScale: 0.6692229511580209,
        brightnessScale: 0.9506547788122306,
        valueGamma: 1.0407422621825377,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.08235432726293468, 0.5828441356175872, 0.8394486148045915, 0.32346951000359414],
        seed: [0.5010266940451745, 0.7385887145082066],
        frameRgb: [0.24019607843137253, 0.3931372549019608, 0.2833333333333333],
        paperRgb: [0.7725490196078432, 0.596078431372549, 0.4627450980392157],
      },
    },
  },
  '4ed/L-R': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/rl.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1,
        rgbScale: [1.1362618233254567, 1.2248261423373552, 1.1620043392226413],
      },
      paper: {
        hueDegrees: 10.227652363449055,
        saturationScale: 0.6908090806570016,
        brightnessScale: 1.0160203146670328,
        valueGamma: 0.65,
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
            hueCenter: 350.5,
            hueRadius: 25,
            hueFeather: 8,
            saturation: [0.23076923076923075, 0.4945054945054945],
          },
          adjustment: {
            hueDegrees: 23.667328865692543,
            saturationScale: 0.9555433390763539,
            brightnessScale: 1.190160028359769,
            valueGamma: 1,
          },
        },
      ],
    },
  },
  '4ed/L-G': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/gl.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1,
        rgbScale: [1.1362618233254567, 1.2248261423373552, 1.1620043392226413],
      },
      paper: {
        hueDegrees: -8.326935535074275,
        saturationScale: 0.9797137927238514,
        brightnessScale: 1.1760692938239763,
        valueGamma: 0.8771034104369807,
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
            hueCenter: 82.5,
            hueRadius: 25,
            hueFeather: 8,
            saturation: [0.1361111111111111, 0.2916666666666667],
          },
          adjustment: {
            hueDegrees: 2.9544126441461773,
            saturationScale: 1.066200495201083,
            brightnessScale: 1.1722010662771623,
            valueGamma: 1,
          },
        },
      ],
    },
  },
  '4ed/L-gold': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: 10.264819834697091,
        saturationScale: 0.7005017768311229,
        brightnessScale: 1.1725516114303038,
        valueGamma: 1.2693064708629052,
      },
      paper: {
        hueDegrees: 0.48383129271734815,
        saturationScale: 1.3399248948316544,
        brightnessScale: 1.130107268987477,
        valueGamma: 1.14087160788815,
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
            hueDegrees: 10.852203217581433,
            saturationScale: 0.9878722501899578,
            brightnessScale: 1.3215860683139535,
            valueGamma: 1,
          },
        },
      ],
    },
  },
  '4ed/L-U': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/ul.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1,
        rgbScale: [1.1362618233254567, 1.2248261423373552, 1.1620043392226413],
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.2132129128429447,
        rgbScale: [1.2838927763988746, 1.3897318898652564, 1.393943162430608],
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
            hueCenter: 205.16129032258067,
            hueRadius: 25,
            hueFeather: 8,
            saturation: [0.16074074074074074, 0.3444444444444445],
          },
          adjustment: {
            hueDegrees: -5.092413632630971,
            saturationScale: 1.0499758692498893,
            brightnessScale: 1.1763323121551317,
            valueGamma: 1,
          },
        },
      ],
    },
  },
  '4ed/L-W': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/wl.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1,
        rgbScale: [1.1362618233254567, 1.2248261423373552, 1.1620043392226413],
      },
      paper: {
        hueDegrees: -5.594932317552875,
        saturationScale: 0.9778477115679628,
        brightnessScale: 1.1187683922263938,
        valueGamma: 0.9113473045244606,
      },
      mask: {
        kind: 'rect',
        rect: [0.13934426229508196, 0.6088235294117647, 0.723360655737705, 0.2705882352941177],
        feather: 0.0013333333333333333,
      },
      regions: [
        {
          mask: {
            kind: 'rect',
            rect: [0.12704918032786885, 0.5985294117647059, 0.75, 0.010294117647058823],
            feather: 0.0013333333333333333,
          },
          adjustment: {
            hueDegrees: 6.970439382415177,
            saturationScale: 0.34192665633263003,
            brightnessScale: 1.1123900753621663,
            valueGamma: 1,
          },
        },
        {
          mask: {
            kind: 'rect',
            rect: [0.12704918032786885, 0.8794117647058823, 0.75, 0.010294117647058823],
            feather: 0.0013333333333333333,
          },
          adjustment: {
            hueDegrees: 6.970439382415177,
            saturationScale: 0.34192665633263003,
            brightnessScale: 1.1123900753621663,
            valueGamma: 1,
          },
        },
        {
          mask: {
            kind: 'rect',
            rect: [
              0.12704918032786885, 0.6088235294117647, 0.012295081967213115, 0.27058823529411763,
            ],
            feather: 0.0013333333333333333,
          },
          adjustment: {
            hueDegrees: 6.970439382415177,
            saturationScale: 0.34192665633263003,
            brightnessScale: 1.1123900753621663,
            valueGamma: 1,
          },
        },
        {
          mask: {
            kind: 'rect',
            rect: [
              0.8627049180327869, 0.6088235294117647, 0.014344262295081968, 0.27058823529411763,
            ],
            feather: 0.0013333333333333333,
          },
          adjustment: {
            hueDegrees: 6.970439382415177,
            saturationScale: 0.34192665633263003,
            brightnessScale: 1.1123900753621663,
            valueGamma: 1,
          },
        },
      ],
    },
  },
  '4ed/L-B': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/bl.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1,
        rgbScale: [1.1362618233254567, 1.2248261423373552, 1.1620043392226413],
      },
      paper: {
        hueDegrees: -28.28882275337428,
        saturationScale: 0.8533097559116432,
        brightnessScale: 1.3607361901124793,
        valueGamma: 0.8936219860908867,
      },
      mask: {
        kind: 'rect',
        rect: [0.13934426229508196, 0.6088235294117647, 0.723360655737705, 0.2705882352941177],
        feather: 0.0013333333333333333,
      },
      regions: [
        {
          mask: {
            kind: 'rect',
            rect: [0.12704918032786885, 0.5985294117647059, 0.75, 0.010294117647058823],
            feather: 0.0013333333333333333,
          },
          adjustment: {
            hueDegrees: -137.65813996023417,
            saturationScale: 0.7772989763239141,
            brightnessScale: 1.1749491963195922,
            valueGamma: 1,
          },
        },
        {
          mask: {
            kind: 'rect',
            rect: [0.12704918032786885, 0.8794117647058823, 0.75, 0.010294117647058823],
            feather: 0.0013333333333333333,
          },
          adjustment: {
            hueDegrees: -137.65813996023417,
            saturationScale: 0.7772989763239141,
            brightnessScale: 1.1749491963195922,
            valueGamma: 1,
          },
        },
        {
          mask: {
            kind: 'rect',
            rect: [
              0.12704918032786885, 0.6088235294117647, 0.012295081967213115, 0.27058823529411763,
            ],
            feather: 0.0013333333333333333,
          },
          adjustment: {
            hueDegrees: -137.65813996023417,
            saturationScale: 0.7772989763239141,
            brightnessScale: 1.1749491963195922,
            valueGamma: 1,
          },
        },
        {
          mask: {
            kind: 'rect',
            rect: [
              0.8627049180327869, 0.6088235294117647, 0.014344262295081968, 0.27058823529411763,
            ],
            feather: 0.0013333333333333333,
          },
          adjustment: {
            hueDegrees: -137.65813996023417,
            saturationScale: 0.7772989763239141,
            brightnessScale: 1.1749491963195922,
            valueGamma: 1,
          },
        },
      ],
    },
  },
  '4ed/L-red': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
    stock: '#ededef',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1,
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
            hueDegrees: -6.96329045002916,
            saturationScale: 1.1032592570609554,
            brightnessScale: 0.845035010901164,
            valueGamma: 1,
          },
        },
      ],
    },
  },
};
