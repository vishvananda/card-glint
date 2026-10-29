import type { SetCalibrationProfile } from '../types.js';

/** Shared printing defaults. Scan poses and reference pixels remain in evidence. */
export const profile = {
  schema: 1,
  revision: 3,
  set: 'arn',
  border: 'black',
  cornerRadius: 0.045,
  setSymbolSource: 'keyrune',
  frames: {
    W: {
      family: 'fourth',
      frame: [0.008741918032786858, 0.005528823529411754, 0.987149, 0.991329],
      art: [0.10877301669945352, 0.09191606495798318, 0.7844544053333333, 0.45223484857142854],
      stockWindow: [
        0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023,
      ],
      assetKey: 'w',
    },
    U: {
      family: 'fourth',
      frame: [0.006729180327868926, 0.005528823529411754, 0.9886099999999999, 0.991329],
      art: [0.10954462032786892, 0.09238812638655462, 0.7836381933333332, 0.4512907257142857],
      stockWindow: [
        0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023,
      ],
      assetKey: 'u',
    },
    B: {
      family: 'abu',
      frame: [-0.014993852459016379, -0.01515441176470595, 1.0305, 1.0270000000000001],
      art: [0.10866614754098362, 0.09194701680672264, 0.7838669999999999, 0.4528580952380953],
      stockWindow: [
        0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023,
      ],
      assetKey: 'b',
    },
    R: {
      family: 'fourth',
      frame: [0.00599718032786886, 0.003936470588235265, 0.9900709999999999, 0.9952570000000001],
      art: [0.10830451699453551, 0.09208780487394955, 0.7861163739999999, 0.45213103714285713],
      stockWindow: [
        0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023,
      ],
      assetKey: 'r',
    },
    G: {
      family: 'abu',
      frame: [-0.018567622950819714, -0.015338235294117604, 1.0315, 1.027],
      art: [0.1072753770491803, 0.09176319327731097, 0.7825646666666667, 0.45285809523809517],
      stockWindow: [
        0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023,
      ],
      assetKey: 'g',
    },
    A: {
      family: 'fourth',
      frame: [0.00794918032786887, 0.004855000000000054, 0.9861749999999999, 0.9923109999999999],
      art: [0.11182628032786886, 0.093690460952381, 0.7810505999999998, 0.44937512428571424],
      stockWindow: [
        0.041314767827868866, 0.03183110554486049, 0.9181289249999999, 0.9359733064602023,
      ],
      assetKey: 'a',
    },
    L: {
      family: 'fourth',
      frame: [0.007461180327868825, 0.006570588235294111, 0.987149, 0.99182],
      art: [0.11078277566120218, 0.09111143585434173, 0.7837963059999999, 0.45245883809523807],
      stockWindow: [
        0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023,
      ],
      assetKey: 'l',
    },
    'L-R': {
      family: 'abu',
      assetKey: 'rl',
      frame: [-0.015000000000000013, -0.01794117647058825, 1.03, 1.027],
      art: [0.10830000000000001, 0.08885882352941175, 0.786, 0.453],
      stockWindow: [
        0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023,
      ],
    },
  },
  colors: {
    W: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.008741918032786858,0.005528823529411754,0.987149,0.991329]]',
      stock: '#181510',
      adjustment: {
        frame: {
          hueDegrees: -13.640927100986662,
          saturationScale: 0.5400738710331036,
          brightnessScale: 1.0492517860747008,
          valueGamma: 0.8994679069282768,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.7,
          brightnessScale: 0.9939773471288103,
          valueGamma: 1.1749999999999996,
        },
        mask: {
          kind: 'rect',
          rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
          feather: 0.0013333333333333333,
        },
      },
    },
    U: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.006729180327868926,0.005528823529411754,0.9886099999999999,0.991329]]',
      stock: '#181510',
      adjustment: {
        frame: {
          hueDegrees: 8.695311924531383,
          saturationScale: 0.7336299706894727,
          brightnessScale: 0.9918856718215499,
          valueGamma: 0.8925193131882323,
        },
        paper: {
          hueDegrees: 7.681106138107452,
          saturationScale: 1.4347665118679058,
          brightnessScale: 0.9421487603305786,
        },
        mask: {
          kind: 'rect',
          rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
          feather: 0.0013333333333333333,
        },
      },
    },
    B: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.014993852459016379,-0.01515441176470595,1.0305,1.0270000000000001]]',
      stock: '#181510',
      adjustment: {
        frame: {
          hueDegrees: -13.974519149984646,
          saturationScale: 0.48077990027996853,
          brightnessScale: 1.3401551515814558,
          valueGamma: 1.2607231644949974,
        },
        paper: {
          hueDegrees: -11.213063909774519,
          saturationScale: 0.5857999353587588,
          brightnessScale: 0.9227557411273487,
        },
        mask: {
          kind: 'chroma',
          bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
          seed: [0.5, 0.7352941176470589],
          frameRgb: [0.17647058823529413, 0.2235294117647059, 0.23333333333333334],
          paperRgb: [0.9392156862745098, 0.8, 0.596078431372549],
        },
      },
    },
    R: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.00599718032786886,0.003936470588235265,0.9900709999999999,0.9952570000000001]]',
      stock: '#181510',
      adjustment: {
        frame: {
          hueDegrees: -7.992651881053812,
          saturationScale: 0.70622971619805,
          brightnessScale: 0.8936224010262801,
          valueGamma: 1.38110833476772,
        },
        paper: {
          hueDegrees: -5.943625631125656,
          saturationScale: 0.5376010534051938,
          brightnessScale: 0.7476190476190477,
        },
        mask: {
          kind: 'rect',
          rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
          feather: 0.0013333333333333333,
        },
      },
    },
    G: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[-0.018567622950819714,-0.015338235294117604,1.0315,1.027]]',
      stock: '#181510',
      adjustment: {
        frame: {
          hueDegrees: 8.02703840970355,
          saturationScale: 0.9560792606516291,
          brightnessScale: 0.9769149991704181,
          valueGamma: 0.9212500000000003,
        },
        paper: {
          hueDegrees: 25.416811846689825,
          saturationScale: 0.4621650250156346,
          brightnessScale: 1.1037735849056602,
        },
        mask: {
          kind: 'chroma',
          bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
          seed: [0.5, 0.7352941176470589],
          frameRgb: [0.2323529411764706, 0.31176470588235294, 0.2754901960784314],
          paperRgb: [0.41568627450980394, 0.2823529411764706, 0.2549019607843137],
        },
      },
    },
    A: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.00794918032786887,0.004855000000000054,0.9861749999999999,0.9923109999999999]]',
      stock: '#181510',
      adjustment: {
        frame: {
          hueDegrees: -0.21551113000639094,
          saturationScale: 0.549109164462508,
          brightnessScale: 0.8348270128228742,
          valueGamma: 0.746193424526035,
          rgbScale: [0.9578346253839087, 1.0018891080910126, 1.0420530094214437],
        },
        paper: {
          hueDegrees: 1.1290995352226694,
          saturationScale: 0.6729518016197511,
          brightnessScale: 1.002847031691434,
          valueGamma: 0.8892581220469289,
          rgbScale: [0.9784841893247943, 0.9908665760144548, 1.0314092178062277],
        },
        mask: {
          kind: 'rect',
          rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
          feather: 0.0013333333333333333,
        },
      },
    },
    'L-red': {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png",[0.007461180327868825,0.006570588235294111,0.987149,0.99182]]',
      stock: '#181510',
      adjustment: {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: -1.0520296612100992,
          saturationScale: 0.6957976149956239,
          brightnessScale: 0.9456066945606694,
        },
        mask: {
          kind: 'rect',
          rect: [0.1265358333052816, 0.6083023840900922, 0.7510856027198977, 0.2770456451419673],
          feather: 0.0013333333333333333,
        },
      },
    },
    'L-R': {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/rl.png",[-0.015000000000000013,-0.01794117647058825,1.03,1.027]]',
      stock: '#181510',
      adjustment: {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          valueGamma: 1.0250000000000004,
          rgbScale: [1.1665213178294582, 1.3641025641025648, 1.340521628498728],
        },
        paper: {
          hueDegrees: 13.5551269288203,
          saturationScale: 0.5927606019472006,
          brightnessScale: 1.0281400966183576,
          valueGamma: 0.89375,
        },
        mask: {
          kind: 'rect',
          rect: [0.13733333333333334, 0.6095238095238096, 0.7293333333333333, 0.2704761904761905],
          feather: 0.0013333333333333333,
        },
        outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569],
      },
    },
  },
  mana: {
    geometry: {
      dx: 5.25,
      dy: -7.75,
      scaleX: 1.045,
      scaleY: 1.0098,
      spacing: 0.875,
      glyphs: {
        W: {
          scale: 1,
          dx: 0,
          dy: 0,
        },
        U: {
          scale: 1,
          dx: 0,
          dy: 0,
        },
        G: {
          scale: 1.09,
          dx: 0,
          dy: -0.25,
        },
        B: {
          scale: 1,
          dx: 0,
          dy: 0,
        },
        R: {
          scale: 1.05,
          dx: 0,
          dy: 0.25,
        },
      },
      numberScale: 1.01,
      numberDx: 0,
      numberDy: -0.25,
    },
    paper: {
      W: [0.8980392156862745, 0.8980392156862745, 0.8745098039215686],
      U: [0.6666666666666666, 0.803921568627451, 0.8784313725490196],
      B: [0.6039215686274509, 0.5882352941176471, 0.592156862745098],
      R: [0.8352941176470589, 0.7137254901960784, 0.6941176470588235],
      G: [0.7058823529411765, 0.7843137254901961, 0.7254901960784313],
      N: [0.7254901960784313, 0.7294117647058823, 0.7254901960784313],
    },
    ink: [0.054901960784313725, 0.06274509803921569, 0.0392156862745098],
    inlineGeneric: {
      A: { paper: [160 / 255, 172 / 255, 174 / 255], alpha: 1 },
      R: { paper: [96 / 255, 52 / 255, 46 / 255], alpha: 0.8 },
    },
    paperSample: 'printing',
    variants: {
      light: {
        paper: {
          W: [0.9137254901960784, 0.9098039215686274, 0.8274509803921568],
          B: [0.6549019607843137, 0.7098039215686275, 0.7098039215686275],
        },
      },
      dark: {
        paper: {
          W: [0.8941176470588236, 0.8941176470588236, 0.8745098039215686],
          B: [0.592156862745098, 0.5803921568627451, 0.5803921568627451],
        },
        geometry: {
          numberScale: 0.87,
          numberDx: -0.25,
          numberDy: -0.25,
        },
      },
    },
  },
  title: {
    x: 37.75,
    y: 42.5,
    size: 26.75,
    width: 0.995,
    shadow: 1.25,
    trim: 0.15,
    gray: 196,
  },
  type: {
    x: 50.4112,
    y: 391.51,
    size: 22.2,
    width: 1,
    shadow: 1,
    trim: 0.1,
    gray: 205,
  },
  footer: {
    artist: {
      x: 49.25,
      y: 638.5,
      size: 22,
      width: 1.025,
      shadow: 1.5,
      trim: 0.8,
      gray: 242,
      tint: [1, 0.9834710743801653, 0.9380165289256198],
      inkStyle: 'separate-shadow',
      prefix: 'Illus. © ',
      align: 'left',
      baseline: 'alphabetic',
      maxWidth: 338,
    },
    legal: {
      x: 49.25,
      y: 653,
      size: 10,
      width: 1,
      shadow: 0,
      trim: 0,
      defaultText: '',
      lightGray: 200,
      darkGray: 30,
    },
    stats: {
      x: 452,
      y: 638,
      size: 26.5,
      width: 1.03,
      shadow: 2,
      trim: 0.1,
      gray: 205,
      baseline: 'alphabetic',
    },
  },
  setSymbols: {
    default: {
      placement: 'native',
      right: 439,
      centerY: 394.5,
      width: 65,
      height: 23.540000000000003,
      crop: [0, 0.283203125, 1, 0.435546875],
      sampling: 'high',
      outline: 0,
    },
  },
  expansionBody: {
    bounds: {
      x: 70,
      y: 414,
      width: 348,
      height: 184,
    },
    regular: 22.5,
    regularLeading: 0.98,
    textWidth: 1,
    threshold: 130,
    offset: -14,
    compact: 16.5,
    compactLeading: 1.15,
    largeSize: 27.25,
    largeLeading: 1.1,
    largeOffset: -15,
  },
} as const satisfies SetCalibrationProfile;

export const review = {
  revision: 2,
  scope:
    'Ordinary nonfoil Original printings, unchanged scan-only normalization. Shared rules and native source family selection; isolated regions tested, integrated verification pending.',
  evidence: [
    'games/magic/fixtures/accuracy/mirage-onslaught/artifact-source-repair-study.json',
    'games/magic/fixtures/accuracy/arn-recheck/baseline.json.gz',
    'games/magic/fixtures/accuracy/arn-recheck/body-style-verified.json.gz',
    'games/magic/fixtures/accuracy/arn-recheck/color-native-development.json.gz',
    'games/magic/fixtures/accuracy/arn-recheck/lettering-development.json.gz',
    'games/magic/fixtures/accuracy/arn-recheck/mana-development.json.gz',
    'games/magic/fixtures/accuracy/arn-recheck/symbol-development.json.gz',
  ],
  pending: [
    'integratedNative',
    'wordingResolver',
    'oracleSafety',
    'unaffectedControls',
    'frameReview',
    'fullCard',
    'release',
  ],
} as const;
