import type { SetCalibrationProfile } from '../types.js';

/** Shared printing defaults. Scan transforms and reference images belong in evidence. */
export const profile = {
  schema: 1,
  revision: 3,
  set: '4ed',
  border: 'white',
  frames: {
    U: {
      family: 'fourth',
      assetKey: 'u',
      frame: [0.007924885245901644, 0.006508529411764717, 0.985201, 0.987892],
      art: [0.11038578924590163, 0.09306668560224092, 0.7809359926666666, 0.44972607238095236],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
    W: {
      family: 'fourth',
      assetKey: 'w',
      frame: [0.008925180327868902, 0.006202058823529418, 0.984227, 0.9874010000000001],
      art: [0.10866018299453556, 0.09224700310924372, 0.7821323893333333, 0.45044293238095245],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
    B: {
      family: 'fourth',
      assetKey: 'b',
      frame: [0.007680885245901622, 0.007734117647058839, 0.985688, 0.9883829999999999],
      art: [0.11150668791256829, 0.09198200193277312, 0.7800077706666667, 0.44947893571428565],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
    R: {
      family: 'fourth',
      assetKey: 'r',
      frame: [0.008913032786885261, 0.005099705882352976, 0.98374, 0.990347],
      art: [0.11056616612021859, 0.09281615445378154, 0.78108956, 0.44990049428571427],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
    A: {
      family: 'fourth',
      assetKey: 'a',
      frame: [0.008376442622950769, 0.005957058823529423, 0.9827660000000001, 0.987892],
      art: [0.11189446128961746, 0.09439691406162466, 0.7783506720000002, 0.44737394857142854],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
    G: {
      family: 'fourth',
      assetKey: 'g',
      frame: [0.009925475409836047, 0.008101176470588223, 0.983253, 0.985437],
      art: [0.11218378740983605, 0.09397497218487394, 0.778080874, 0.44860846285714284],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
    'L-R': {
      family: 'abu',
      assetKey: 'rl',
      frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
      art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
    'L-G': {
      family: 'abu',
      assetKey: 'gl',
      frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
      art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
    L: {
      family: 'abu',
      assetKey: 'l',
      frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
      art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
    'L-U': {
      family: 'abu',
      assetKey: 'ul',
      frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
      art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
    'L-W': {
      family: 'abu',
      assetKey: 'wl',
      frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
      art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
    'L-B': {
      family: 'abu',
      assetKey: 'bl',
      frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
      art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
      stockWindow: [
        0.04043615426050531, 0.0316555566058144, 0.9153375248444735, 0.9362152576670981,
      ],
    },
  },
  colors: {
    U: {
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
    W: {
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
    B: {
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
          bounds: [
            0.08235432726293468, 0.5828441356175872, 0.8394486148045915, 0.32346951000359414,
          ],
          seed: [0.5010266940451745, 0.7385887145082066],
          frameRgb: [0.2068627450980392, 0.24411764705882355, 0.20980392156862746],
          paperRgb: [0.984313725490196, 0.7686274509803922, 0.6196078431372549],
        },
      },
    },
    R: {
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
    A: {
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
    G: {
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
          bounds: [
            0.08235432726293468, 0.5828441356175872, 0.8394486148045915, 0.32346951000359414,
          ],
          seed: [0.5010266940451745, 0.7385887145082066],
          frameRgb: [0.24019607843137253, 0.3931372549019608, 0.2833333333333333],
          paperRgb: [0.7725490196078432, 0.596078431372549, 0.4627450980392157],
        },
      },
    },
    'L-R': {
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
                    0.0942622950819672, 0.08970588235294118, 0.8176229508196722,
                    0.47205882352941175,
                  ],
                  inner: [
                    0.1168032786885246, 0.10441176470588236, 0.764344262295082, 0.43970588235294117,
                  ],
                },
                {
                  outer: [
                    0.12295081967213115, 0.5955882352941176, 0.7581967213114754,
                    0.29558823529411765,
                  ],
                  inner: [
                    0.13934426229508196, 0.6088235294117647, 0.7233606557377049,
                    0.27058823529411763,
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
    'L-G': {
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
                    0.0942622950819672, 0.08970588235294118, 0.8176229508196722,
                    0.47205882352941175,
                  ],
                  inner: [
                    0.1168032786885246, 0.10441176470588236, 0.764344262295082, 0.43970588235294117,
                  ],
                },
                {
                  outer: [
                    0.12295081967213115, 0.5955882352941176, 0.7581967213114754,
                    0.29558823529411765,
                  ],
                  inner: [
                    0.13934426229508196, 0.6088235294117647, 0.7233606557377049,
                    0.27058823529411763,
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
    'L-gold': {
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
                    0.0942622950819672, 0.08970588235294118, 0.8176229508196722,
                    0.47205882352941175,
                  ],
                  inner: [
                    0.1168032786885246, 0.10441176470588236, 0.764344262295082, 0.43970588235294117,
                  ],
                },
                {
                  outer: [
                    0.12295081967213115, 0.5955882352941176, 0.7581967213114754,
                    0.29558823529411765,
                  ],
                  inner: [
                    0.13934426229508196, 0.6088235294117647, 0.7233606557377049,
                    0.27058823529411763,
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
    'L-U': {
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
                    0.0942622950819672, 0.08970588235294118, 0.8176229508196722,
                    0.47205882352941175,
                  ],
                  inner: [
                    0.1168032786885246, 0.10441176470588236, 0.764344262295082, 0.43970588235294117,
                  ],
                },
                {
                  outer: [
                    0.12295081967213115, 0.5955882352941176, 0.7581967213114754,
                    0.29558823529411765,
                  ],
                  inner: [
                    0.13934426229508196, 0.6088235294117647, 0.7233606557377049,
                    0.27058823529411763,
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
    'L-W': {
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
    'L-B': {
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
    'L-red': {
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
                    0.0942622950819672, 0.08970588235294118, 0.8176229508196722,
                    0.47205882352941175,
                  ],
                  inner: [
                    0.1168032786885246, 0.10441176470588236, 0.764344262295082, 0.43970588235294117,
                  ],
                },
                {
                  outer: [
                    0.12295081967213115, 0.5955882352941176, 0.7581967213114754,
                    0.29558823529411765,
                  ],
                  inner: [
                    0.13934426229508196, 0.6088235294117647, 0.7233606557377049,
                    0.27058823529411763,
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
  },
  mana: {
    geometry: {
      dx: 0.5,
      dy: -1,
      scaleX: 0.99,
      scaleY: 0.995,
      spacing: 0.25,
      glyphs: {
        U: {
          scale: 1.04,
          dx: 0,
          dy: -0.5,
        },
        W: {
          scale: 1,
          dx: 0.5,
          dy: 0,
        },
        B: {
          scale: 1.05,
          dx: 0,
          dy: 0,
        },
        R: {
          scale: 1.1,
          dx: -0.25,
          dy: 0.5,
        },
        G: {
          scale: 1.13,
          dx: 0,
          dy: -0.25,
        },
      },
      numberScale: 1,
      numberDx: 0,
      numberDy: -0.5,
    },
    paper: {
      W: [0.9176470588235294, 0.8941176470588236, 0.796078431372549],
      U: [0.7450980392156863, 0.8431372549019608, 0.8705882352941177],
      B: [0.6627450980392157, 0.6313725490196078, 0.611764705882353],
      R: [0.8745098039215686, 0.7607843137254902, 0.6980392156862745],
      G: [0.7647058823529411, 0.8313725490196079, 0.7254901960784313],
      N: [0.7803921568627451, 0.7568627450980392, 0.7372549019607844],
    },
    ink: [0.2235294117647059, 0.25098039215686274, 0.21176470588235294],
  },
  expansionBody: {
    bounds: {
      x: 72,
      y: 414,
      width: 344,
      height: 184,
    },
    regular: 22.5,
    textWidth: 1,
    threshold: 100,
    offset: 0,
    compact: 15.5,
    compactLeading: 1.2,
    regularLeading: 1,
    largeSize: 25,
    largeLeading: 1,
    largeOffset: -12,
    fractionalMetrics: true,
    unconstrained: {
      offset: -6,
      compact: 15.5,
      compactLeading: 1.2,
      minimumFreeSpace: 40,
    },
  },
  body: {
    'L-W': {
      bounds: {
        x: 64,
        y: 414,
        width: 360,
        height: 184,
      },
      maximumSize: 25,
      minimumSize: 15,
      typography: {
        fractionalMetrics: true,
        textWidth: 1.01,
        leading: 1,
        paragraphGap: 0,
        flavorGap: 0,
        flavorOrphans: false,
        flavorSeparator: false,
        centerOffset: -12.5,
      },
      centered: {
        maxCharacters: 100,
        maxLines: 1,
        maximumSize: 25,
      },
    },
    'L-U': {
      bounds: {
        x: 64,
        y: 414,
        width: 360,
        height: 184,
      },
      maximumSize: 25,
      minimumSize: 15,
      typography: {
        fractionalMetrics: true,
        textWidth: 1.01,
        leading: 1,
        paragraphGap: 0,
        flavorGap: 0,
        flavorOrphans: false,
        flavorSeparator: false,
        centerOffset: -12.5,
      },
      centered: {
        maxCharacters: 100,
        maxLines: 1,
        maximumSize: 25,
      },
    },
    'L-B': {
      bounds: {
        x: 64,
        y: 414,
        width: 360,
        height: 184,
      },
      maximumSize: 25,
      minimumSize: 15,
      typography: {
        fractionalMetrics: true,
        textWidth: 1.01,
        leading: 1,
        paragraphGap: 0,
        flavorGap: 0,
        flavorOrphans: false,
        flavorSeparator: false,
        centerOffset: -12.5,
      },
      centered: {
        maxCharacters: 100,
        maxLines: 1,
        maximumSize: 25,
      },
    },
    'L-R': {
      bounds: {
        x: 64,
        y: 414,
        width: 360,
        height: 184,
      },
      maximumSize: 25,
      minimumSize: 15,
      typography: {
        fractionalMetrics: true,
        textWidth: 1.01,
        leading: 1,
        paragraphGap: 0,
        flavorGap: 0,
        flavorOrphans: false,
        flavorSeparator: false,
        centerOffset: -12.5,
      },
      centered: {
        maxCharacters: 100,
        maxLines: 1,
        maximumSize: 25,
      },
    },
    'L-G': {
      bounds: {
        x: 64,
        y: 414,
        width: 360,
        height: 184,
      },
      maximumSize: 25,
      minimumSize: 15,
      typography: {
        fractionalMetrics: true,
        textWidth: 1.01,
        leading: 1,
        paragraphGap: 0,
        flavorGap: 0,
        flavorOrphans: false,
        flavorSeparator: false,
        centerOffset: -12.5,
      },
      centered: {
        maxCharacters: 100,
        maxLines: 1,
        maximumSize: 25,
      },
    },
  },
  title: {
    size: 27.25,
    x: 41.5,
    y: 41,
    width: 1.015,
    shadow: 1,
    trim: 0.3,
    gray: 232,
  },
  type: {
    x: 42.75,
    y: 390.5,
    size: 23,
    width: 0.98,
    shadow: 0.75,
    trim: 0.2,
    gray: 239,
  },
  footer: {
    artist: {
      x: 43,
      y: 626.5,
      size: 19,
      width: 1,
      shadow: 1.25,
      trim: 0.2,
      gray: 238,
    },
    legal: {
      x: 41.25,
      y: 640.5,
      size: 11,
      width: 1,
      shadow: 0,
      trim: 0,
      lightGray: 205,
      darkGray: 42,
    },
    stats: {
      x: 451.75,
      y: 634.5,
      size: 27,
      width: 1.03,
      shadow: 1,
      trim: 0.3,
      gray: 238,
    },
  },
} as const satisfies SetCalibrationProfile;

export const review = {
  revision: 3,
  scope: 'Ordinary nonfoil printing; see per-component evidence and outstanding tasks.',
  evidence: [
    'games/magic/fixtures/accuracy/early-reprint-frame-color.json',
    'games/magic/fixtures/accuracy/early-reprint-mana.json',
    'games/magic/fixtures/accuracy/early-reprint-title.json',
    'games/magic/fixtures/accuracy/early-reprint-type.json',
    'games/magic/fixtures/accuracy/early-reprint-footer.json',
    'games/magic/fixtures/accuracy/4ed/basic-body-proposal.json',
    'games/magic/fixtures/accuracy/4ed/nonbasic-body-adoption.json',
  ],
  pending: ['rules', 'flavor', 'setSymbol', 'fullCard', 'release'],
} as const;
