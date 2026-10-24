import { EIGHTH_PAPER_MASKS } from '../../presentation/eighth-paper-masks.js';
import type { EighthPrintingProfile } from '../../presentation/eighth-printing-types.js';
import manifest from '../../../assets.json' with { type: 'json' };
/** Whole nonfoil 8ED census. Positions are canonical 488 × 680 pixels.
 * Comparison-only scan poses and reviewed printing content are not style defaults. */
export const profile: EighthPrintingProfile = {
  revision: 1,
  root: manifest.CONJURER_ROOT + '/img/frames/8th',
  geometry: {
    ordinary: { scaleX: 1.0015, scaleY: 1.005, dx: -0.75, dy: -0.5 },
    basic: { scaleX: 1.004, scaleY: 1.005, dx: -1.25, dy: -0.5 },
  },
  headings: {
    title: { size: 30.368, dx: -0.5, dy: 6 },
    type: { width: 1.04, dx: -7, dy: 6 },
  },
  rules: {
    maximumSize: 24,
    landMaximumSize: 24.5,
    flavorGap: 0.7,
    shortCenterLines: 1,
    compact: { minimumSize: 21, leading: 0.9, minimumParagraphs: 3 },
  },
  footer: {
    artist: { dx: -1, dy: 2, width: 0.97, height: 1.06 },
    stats: { dx: -1, dy: 1, width: 1.03, height: 1 },
  },

  mana: {
    transform: {
      dx: -1.125,
      dy: -4,
      scaleX: 0.9631818181818183,
      scaleY: 0.9631818181818183,
      spacing: 1.2939565366985093,
      numberScale: 1.027220386974988,
      numberDx: 0,
      numberDy: 0.75,
      glyphs: {
        W: {
          scale: 1.0378102878716375,
          dx: 0,
          dy: 0,
        },
        U: {
          scale: 0.99545068428504,
          dx: 0,
          dy: 0.5,
        },
        B: {
          scale: 1.027220386974988,
          dx: 0.25,
          dy: 0,
        },
        R: {
          scale: 1.0060405851816894,
          dx: 0.5,
          dy: 0.5,
        },
        G: {
          scale: 1.1013496932515336,
          dx: 0.25,
          dy: -1.1,
        },
      },
    },
    paperTargets: {
      W: [236, 234, 196],
      U: [169, 205, 227],
      B: [188, 177, 165],
      R: [212, 157, 117],
      G: [161, 198, 151],
      N: [185, 177, 168],
      X: [185, 177, 168],
    },
  },
  setSymbol: {
    dx: 0.5,
    dy: 0.5,
    scaleX: 0.94,
    scaleY: 1,
  },
  largeLandSymbols: {
    W: {
      source: manifest.RETRO_ROOT + '/img/frames/m15/basics/w.png',
      geometry: {
        scaleX: 1.0125,
        scaleY: 1.0125,
        dx: 5.5,
        dy: 0,
      },
    },
    U: {
      source: manifest.RETRO_ROOT + '/img/frames/m15/basics/u.png',
      geometry: {
        scaleX: 1.0125,
        scaleY: 1,
        dx: 4.5,
        dy: 0,
      },
    },
    B: {
      source: manifest.RETRO_ROOT + '/img/frames/m15/basics/b.png',
      geometry: {
        scaleX: 1.025,
        scaleY: 1.0375,
        dx: 5.5,
        dy: 0.5,
      },
    },
    R: {
      source: manifest.RETRO_ROOT + '/img/frames/m15/basics/r.png',
      geometry: {
        scaleX: 1.0125,
        scaleY: 1.0125,
        dx: 7.5,
        dy: -1.5,
      },
    },
    G: {
      source: manifest.RETRO_ROOT + '/img/frames/m15/basics/g.png',
      geometry: {
        scaleX: 1.0375,
        scaleY: 1.0375,
        dx: 5,
        dy: 0,
      },
    },
  },
  largeLandShadow: {
    dx: -1,
    dy: 1,
    blur: 1,
    alpha: 0.4,
  },
  materials: {
    'w.png': {
      frame: {
        hueDegrees: 1.7044683257918223,
        saturationScale: 0.9806863601086527,
        brightnessScale: 0.9377729257641921,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.8462234042553245,
        brightnessScale: 0.9432056451612905,
        rgbScale: [0.9914529914529915, 0.9913419913419914, 1.008849557522124],
      },
      mask: EIGHTH_PAPER_MASKS.paper,
      regions: [
        {
          mask: EIGHTH_PAPER_MASKS.title,
          adjustment: {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            rgbScale: [0.9311740890688259, 0.9377593360995851, 0.9442060085836911],
          },
        },
        {
          mask: EIGHTH_PAPER_MASKS.type,
          adjustment: {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            rgbScale: [0.9170040485829959, 0.9253112033195021, 0.939655172413793],
          },
        },
      ],
      blackPoint: {
        lift: [0.0414613182551127, 0.05019001683513642, 0.03055044503008304],
        transition: 0.3764705882352941,
      },
    },
    'pt/w.png': {
      hueDegrees: 0,
      saturationScale: 0.8462234042553245,
      brightnessScale: 0.9432056451612905,
      rgbScale: [0.9914529914529915, 0.9913419913419914, 1.008849557522124],
      blackPoint: {
        lift: [0.0414613182551127, 0.05019001683513642, 0.03055044503008304],
        transition: 0.3764705882352941,
      },
    },
    'u.png': {
      frame: {
        hueDegrees: 10.035408807431509,
        saturationScale: 0.7785563272236313,
        brightnessScale: 1.0049751243781095,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.275610047846888,
        brightnessScale: 0.944808091286307,
        rgbScale: [0.9953271028037384, 0.9864253393665158, 0.9912280701754385],
      },
      mask: EIGHTH_PAPER_MASKS.paper,
      regions: [
        {
          mask: EIGHTH_PAPER_MASKS.title,
          adjustment: {
            hueDegrees: 9,
            saturationScale: 0.8099273607748184,
            brightnessScale: 0.9260089686098655,
          },
        },
        {
          mask: EIGHTH_PAPER_MASKS.type,
          adjustment: {
            hueDegrees: 7.917888563049814,
            saturationScale: 0.7682430316316945,
            brightnessScale: 0.9237668161434978,
          },
        },
      ],
      blackPoint: {
        lift: [0.061353287353873194, 0.07362394482464783, 0.07362394482464783],
        transition: 0.3764705882352941,
      },
    },
    'pt/u.png': {
      hueDegrees: 0,
      saturationScale: 1.275610047846888,
      brightnessScale: 0.944808091286307,
      rgbScale: [0.9953271028037384, 0.9864253393665158, 0.9912280701754385],
      blackPoint: {
        lift: [0.061353287353873194, 0.07362394482464783, 0.07362394482464783],
        transition: 0.3764705882352941,
      },
    },
    'g.png': {
      frame: {
        hueDegrees: -33.011206419479834,
        saturationScale: 0.9401916727487577,
        brightnessScale: 0.9894837476099426,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.6045238095238094,
        brightnessScale: 0.9720380434782608,
        rgbScale: [1.0034522439585731, 1.0044642857142858, 1.011574074074074],
      },
      mask: EIGHTH_PAPER_MASKS.paper,
      regions: [
        {
          mask: EIGHTH_PAPER_MASKS.title,
          adjustment: {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            rgbScale: [1.010204081632653, 0.9736211031175059, 0.9744897959183673],
          },
        },
        {
          mask: EIGHTH_PAPER_MASKS.type,
          adjustment: {
            hueDegrees: -32.28179280397006,
            saturationScale: 1.1563308457711432,
            brightnessScale: 0.9663461538461539,
          },
        },
      ],
      blackPoint: {
        lift: [0.08009124979631742, 0.07208212481668567, 0.07208212481668567],
        transition: 0.3764705882352941,
      },
    },
    'pt/g.png': {
      hueDegrees: 0,
      saturationScale: 0.6045238095238094,
      brightnessScale: 0.9720380434782608,
      rgbScale: [1.0034522439585731, 1.0044642857142858, 1.011574074074074],
      blackPoint: {
        lift: [0.08009124979631742, 0.07208212481668567, 0.07208212481668567],
        transition: 0.3764705882352941,
      },
    },
    'b.png': {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        rgbScale: [0.957983193277311, 0.9612068965517242, 0.9519650655021833],
      },
      mask: EIGHTH_PAPER_MASKS.paper,
      regions: [
        {
          mask: EIGHTH_PAPER_MASKS.title,
          adjustment: {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            rgbScale: [0.9669312169312169, 0.9354395604395603, 0.8904494382022472],
          },
        },
        {
          mask: EIGHTH_PAPER_MASKS.type,
          adjustment: {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            rgbScale: [0.9365482233502538, 0.9197368421052632, 0.8709677419354839],
          },
        },
      ],
      blackPoint: {
        lift: [0.052059312367606324, 0.052059312367606324, 0.052059312367606324],
        transition: 0.3764705882352941,
        texture: [
          [0, [0, 0, 0]],
          [0.07352941176470587, [0.039329667046874156, 0.01383947096844279, 0.013349274890011406]],
          [0.4, [0, 0, 0]],
          [1, [0, 0, 0]],
        ],
      },
    },
    'pt/b.png': {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.957983193277311, 0.9612068965517242, 0.9519650655021833],
      blackPoint: {
        lift: [0.052059312367606324, 0.052059312367606324, 0.052059312367606324],
        transition: 0.3764705882352941,
      },
    },
    'r.png': {
      frame: {
        hueDegrees: 7.566592177435723,
        saturationScale: 1.0849187767147854,
        brightnessScale: 0.950261780104712,
      },
      paper: {
        hueDegrees: 0.301095515234465,
        saturationScale: 0.7950332074200187,
        brightnessScale: 0.9033570701932858,
      },
      mask: EIGHTH_PAPER_MASKS.paper,
      regions: [
        {
          mask: EIGHTH_PAPER_MASKS.title,
          adjustment: {
            hueDegrees: 7.441037735849022,
            saturationScale: 0.9896604938271609,
            brightnessScale: 0.8925619834710744,
          },
        },
        {
          mask: EIGHTH_PAPER_MASKS.type,
          adjustment: {
            hueDegrees: 9.15398780294629,
            saturationScale: 1.0248718959400864,
            brightnessScale: 0.8847736625514404,
          },
        },
      ],
      blackPoint: {
        lift: [0.05977982875569887, 0.07258979206049149, 0.0811297675970199],
        transition: 0.3764705882352941,
      },
    },
    'pt/r.png': {
      hueDegrees: 0.301095515234465,
      saturationScale: 0.7950332074200187,
      brightnessScale: 0.9033570701932858,
      blackPoint: {
        lift: [0.05977982875569887, 0.07258979206049149, 0.0811297675970199],
        transition: 0.3764705882352941,
      },
    },
    'a.png': {
      frame: {
        hueDegrees: 0,
        saturationScale: 0.18,
        brightnessScale: 1.139689597201342,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        rgbScale: [0.9288990825688074, 0.9217002237136466, 0.9241071428571429],
      },
      mask: EIGHTH_PAPER_MASKS.paper,
      regions: [
        {
          mask: EIGHTH_PAPER_MASKS.title,
          adjustment: {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            rgbScale: [1.0919540229885056, 1.0372340425531914, 1.026315789473684],
          },
        },
        {
          mask: EIGHTH_PAPER_MASKS.type,
          adjustment: {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            rgbScale: [1.0105263157894737, 0.9653465346534653, 0.9655172413793105],
          },
        },
      ],
      blackPoint: {
        lift: [0.020893268858011467, 0.029250576401216054, 0.041786537716022934],
        transition: 0.3764705882352941,
      },
    },
    'pt/a.png': {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9288990825688074, 0.9217002237136466, 0.9241071428571429],
      blackPoint: {
        lift: [0.020893268858011467, 0.029250576401216054, 0.041786537716022934],
        transition: 0.3764705882352941,
      },
    },
  },
  stock: {
    white: '#ececea',
    black: '#181510',
  },
  outerRule: {
    source: manifest.CONJURER_ROOT + '/img/frames/8th/border.png',
    width: 0.5,
    rgb: [22, 22, 22],
  },
  originalRules: {
    '323': {
      text: 'Coastal Tower comes into play tapped.\n{T}: Add {W} or {U} to your mana pool.\nA beacon in the night, a dream in the fog.',
      maximumSize: 22.5,
    },
    '326': {
      text: 'Shivan Oasis comes into play tapped.\n{T}: Add {R} or {G} to your mana pool.\nOnly the hardiest explorers survive to eat the fruit.',
      maximumSize: 23.5,
    },
    '327': {
      text: 'Urborg Volcano comes into play tapped.\n{T}: Add {B} or {R} to your mana pool.\nDeep in the heart of Urborg lie massive volcanoes whose thick black smoke covers the land with perpetual darkness.',
      maximumSize: 21.5,
    },
  },
  landPalettes: {
    W: {
      header: {
        hueDegrees: -14.024193548387075,
        saturationScale: 0.5265905874026912,
        brightnessScale: 0.9495967741935485,
      },
      paper: {
        hueDegrees: -1.1750690607734668,
        saturationScale: 0.7998024425287352,
        brightnessScale: 0.9392712550607287,
      },
      pinline: {
        hueDegrees: -8.203598940779898,
        saturationScale: 0.4898632906133164,
        brightnessScale: 0.9302788844621516,
      },
      glyph: {
        source: [0.9882352941176471, 0.996078431372549, 1],
        target: [0.9431372549019608, 0.9352941176470588, 0.9372549019607843],
      },
    },
    U: {
      header: {
        hueDegrees: 42.78801843317967,
        saturationScale: 0.45884697719052203,
        brightnessScale: 0.9842342342342343,
      },
      paper: {
        hueDegrees: 32.97916666666663,
        saturationScale: 0.5842800834685827,
        brightnessScale: 1.0133928571428572,
      },
      pinline: {
        hueDegrees: 17.557840616966587,
        saturationScale: 0.5557142857142856,
        brightnessScale: 1.1666666666666667,
      },
      glyph: {
        source: [0, 0.4588235294117647, 0.7450980392156863],
        target: [0.396078431372549, 0.4392156862745098, 0.7176470588235293],
      },
    },
    B: {
      header: {
        hueDegrees: -14.404807692307713,
        saturationScale: 1.421528644784533,
        brightnessScale: 1.0159574468085106,
      },
      paper: {
        hueDegrees: -12.3125,
        saturationScale: 1.2126352339181279,
        brightnessScale: 1.0239520958083832,
      },
      pinline: {
        hueDegrees: -88.07559082483772,
        saturationScale: 1.277991260837483,
        brightnessScale: 1.308125,
      },
      glyph: {
        source: [0.15294117647058825, 0.14901960784313725, 0.1411764705882353],
        target: [0.11568627450980393, 0.09607843137254901, 0.12941176470588234],
      },
    },
    R: {
      header: {
        hueDegrees: 2.5092658770676053,
        saturationScale: 0.7511073790822655,
        brightnessScale: 0.9318181818181819,
      },
      paper: {
        hueDegrees: 8.412850307587178,
        saturationScale: 1.0477689369398555,
        brightnessScale: 0.9504310344827587,
      },
      pinline: {
        hueDegrees: 3.0543379373086736,
        saturationScale: 1.0001076704423102,
        brightnessScale: 1.0559610705596107,
      },
      glyph: {
        source: [0.9372549019607843, 0.2196078431372549, 0.15294117647058825],
        target: [0.8196078431372549, 0.24901960784313726, 0.20588235294117646],
      },
    },
    G: {
      header: {
        hueDegrees: -59.16304347826099,
        saturationScale: 1.0029481528127626,
        brightnessScale: 0.9543269230769231,
      },
      paper: {
        hueDegrees: -26.824145962732928,
        saturationScale: 0.9416448402304863,
        brightnessScale: 0.969626168224299,
      },
      pinline: {
        hueDegrees: -21.627829393491652,
        saturationScale: 0.47678542547538166,
        brightnessScale: 1.16243654822335,
      },
      glyph: {
        source: [0, 0.4823529411764706, 0.2627450980392157],
        target: [0.22745098039215686, 0.4568627450980392, 0.29411764705882354],
      },
    },
    'dual-W': {
      header: {
        hueDegrees: -28.24833147942161,
        saturationScale: 1.1482788322990563,
        brightnessScale: 0.7893015922249794,
      },
      paper: {
        hueDegrees: -2.7822119179163582,
        saturationScale: 1.0104483227056862,
        brightnessScale: 0.9150319968656131,
      },
      pinline: {
        hueDegrees: -8.203598940779898,
        saturationScale: 0.4898632906133164,
        brightnessScale: 0.9302788844621516,
      },
      glyph: {
        source: [0.9882352941176471, 0.996078431372549, 1],
        target: [0.9431372549019608, 0.9352941176470588, 0.9372549019607843],
      },
    },
    'dual-U': {
      header: {
        hueDegrees: 166.61943605770085,
        saturationScale: 0.5492672042478569,
        brightnessScale: 0.8831142786622238,
      },
      paper: {
        hueDegrees: 23.38942307692306,
        saturationScale: 1.03087746270445,
        brightnessScale: 0.9955749607535322,
      },
      pinline: {
        hueDegrees: 17.557840616966587,
        saturationScale: 0.5557142857142856,
        brightnessScale: 1.1666666666666667,
      },
      glyph: {
        source: [0, 0.4588235294117647, 0.7450980392156863],
        target: [0.396078431372549, 0.4392156862745098, 0.7176470588235293],
      },
    },
    'dual-B': {
      header: {
        hueDegrees: -11.731730769230719,
        saturationScale: 1.4207270308870985,
        brightnessScale: 0.9911174114342194,
      },
      paper: {
        hueDegrees: -16.89635093167709,
        saturationScale: 1.6615682779644116,
        brightnessScale: 0.9821581327141635,
      },
      pinline: {
        hueDegrees: -88.07559082483772,
        saturationScale: 1.277991260837483,
        brightnessScale: 1.308125,
      },
      glyph: {
        source: [0.15294117647058825, 0.14901960784313725, 0.1411764705882353],
        target: [0.11568627450980393, 0.09607843137254901, 0.12941176470588234],
      },
    },
    'dual-R': {
      header: {
        hueDegrees: -21.7901993635741,
        saturationScale: 0.3230541426295004,
        brightnessScale: 0.8411102172164121,
      },
      paper: {
        hueDegrees: -0.2210294738335783,
        saturationScale: 0.9455415897771657,
        brightnessScale: 0.9310783663598066,
      },
      pinline: {
        hueDegrees: 3.0543379373086736,
        saturationScale: 1.0001076704423102,
        brightnessScale: 1.0559610705596107,
      },
      glyph: {
        source: [0.9372549019607843, 0.2196078431372549, 0.15294117647058825],
        target: [0.8196078431372549, 0.24901960784313726, 0.20588235294117646],
      },
    },
    'dual-G': {
      header: {
        hueDegrees: -127.73447204968947,
        saturationScale: 0.911145118230359,
        brightnessScale: 0.9591346153846154,
      },
      paper: {
        hueDegrees: -11.18661589055965,
        saturationScale: 0.6588182655303928,
        brightnessScale: 0.9346636861969805,
      },
      pinline: {
        hueDegrees: -21.627829393491652,
        saturationScale: 0.47678542547538166,
        brightnessScale: 1.16243654822335,
      },
      glyph: {
        source: [0, 0.4823529411764706, 0.2627450980392157],
        target: [0.22745098039215686, 0.4568627450980392, 0.29411764705882354],
      },
    },
    L: {
      header: {
        hueDegrees: -13.994222689075514,
        saturationScale: 0.8841239922364872,
        brightnessScale: 0.9380952380952381,
      },
      paper: {
        hueDegrees: -19.769417475728233,
        saturationScale: 0.8532591785936534,
        brightnessScale: 0.9430751173708921,
      },
      pinline: {
        hueDegrees: -13.200944951801148,
        saturationScale: 1.1719174836070894,
        brightnessScale: 0.9590909090909091,
      },
      glyph: {
        source: [0, 0, 0],
        target: [0, 0, 0],
      },
    },
    M: {
      header: {
        hueDegrees: -5.897435897435912,
        saturationScale: 0.7325396825396826,
        brightnessScale: 0.9859154929577464,
      },
      paper: {
        hueDegrees: -7.8169014084508035,
        saturationScale: 1.2178472222222219,
        brightnessScale: 0.9109311740890688,
      },
      pinline: {
        hueDegrees: -1.4204400645654687,
        saturationScale: 1.0415977630115154,
        brightnessScale: 0.9053763440860215,
      },
      glyph: {
        source: [0, 0, 0],
        target: [0, 0, 0],
      },
    },
  },
};
