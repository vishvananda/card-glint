import { M21_WALKER_MATERIALS } from './m21-walker-materials.js';
import type { ModernPrintingProfile } from './modern-printing-profiles.js';

/** Native-reviewed exact-source M21 component fits. Foil-only walkers transfer
 * the nonfoil palette/geometry; they were not color or typography fit samples.
 * Receipts: fixtures/accuracy/m21/*native-review.json and walker-text-shared-proposal-review.json. */
export const M21_COMPONENT_CALIBRATION: Pick<
  ModernPrintingProfile,
  'mana' | 'planeswalkers' | 'componentMaterials'
> = {
  mana: {
    normal: {
      scaleX: 0.9806534292503055,
      scaleY: 0.9806534292503055,
      spacing: 0.6925319771602734,
      dx: -0.15624999999999944,
      dy: -0.25,
      numberScale: 0.99225,
      numberDx: -0.253125,
      numberDy: 0.3186650764469375,
      glyphs: {
        W: {
          scale: 0.9625,
          dx: -0.06373301528938749,
          dy: 0.3186650764469375,
        },
        U: {
          scale: 0.9625,
          dx: -0.1911990458681625,
          dy: 0.1911990458681625,
        },
        B: {
          scale: 1.0125,
          dx: -0.25493206115754996,
          dy: 0.44613110702571246,
        },
        G: {
          scale: 1.00625,
          dx: -0.1911990458681625,
          dy: -0.25493206115754996,
        },
      },
    },
    walker: {
      scaleX: 0.9786570394547676,
      scaleY: 0.9786570394547676,
      spacing: 0.5511328861851883,
      dx: -0.5000000000000006,
      dy: -0.6875,
      numberScale: 0.99225,
      numberDx: -0.253125,
      numberDy: 0.3186650764469375,
      glyphs: {
        W: {
          scale: 0.9625,
          dx: -0.06373301528938749,
          dy: 0.3186650764469375,
        },
        U: {
          scale: 0.9625,
          dx: -0.1911990458681625,
          dy: 0.1911990458681625,
        },
        B: {
          scale: 1.0125,
          dx: -0.25493206115754996,
          dy: 0.44613110702571246,
        },
        G: {
          scale: 1.00625,
          dx: -0.1911990458681625,
          dy: -0.25493206115754996,
        },
      },
    },
    shadow: [-0.8460009541318374, 2.3558650764469373],
    paperTargets: {
      W: [251, 249, 218],
      N: [206, 195, 195],
      U: [190, 220, 249],
      B: [202, 193, 192],
      R: [242, 170, 134],
      G: [168, 205, 175],
    },
  },
  planeswalkers: {
    deckCollectorNumbers: ['320', '324', '328', '332', '336'],
    frameRepaint: { Colourless: 0.7 },
    loyalty: {
      starting: { dx: 0, dy: 0, size: 1.04, width: 1.015, fractionalMetrics: true },
      cost: {
        dx: 1.75,
        dy: 1.75,
        size: 1.03,
        width: 1.045,
        font: 'beleren-2016',
        fractionalMetrics: true,
      },
      wideCost: {
        dx: 1,
        dy: -0.25,
        size: 1.03,
        width: 1.075,
        font: 'beleren-2016',
        fractionalMetrics: true,
      },
    },
    colon: { dx: 1.5, dy: -1, size: 0.9625, width: 1.1, fractionalMetrics: true },
    badges: { dx: -0.75, dy: 0.5, width: 1.105, height: 1.03 },
    staticText: {
      dx: -1,
      dy: 1,
      width: -2,
      size: 0,
      leading: 0.97,
      textWidth: 1.02,
      fractionalMetrics: true,
    },
    paperColors: {
      Colourless: '#eaebf1f0',
      W: '#f2e5d4f0',
      U: '#dfdfe2f0',
      B: '#d8d2e3f0',
      R: '#e0d0ccf0',
      G: '#d8dbdef0',
    },
    rules: {
      regular: {
        size: -0.5,
        dx: 1,
        dy: -1,
        width: -1,
        height: 0.5,
        leading: 1,
      },
      tall: {
        size: 0,
        dx: -0.5,
        dy: 3,
        width: 0,
        height: 0,
        leading: 0.94,
      },
    },
  },
  componentMaterials: {
    ...M21_WALKER_MATERIALS,
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/W.webp':
      {
        frame: {
          hueDegrees: 0.6378968253967514,
          saturationScale: 0.6209134298880844,
          brightnessScale: 1.0069605568445477,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.35,
          brightnessScale: 0.9656377551020409,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/W.webp':
      {
        hueDegrees: 0.6378968253967514,
        saturationScale: 0.6209134298880844,
        brightnessScale: 1.0069605568445477,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/W.webp':
      {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.9564583333333333,
        rgbScale: [1.0087050281703482, 0.9954258331518188, 1.010210687484271],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/W.webp':
      {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.9564583333333333,
        rgbScale: [1.0087050281703482, 0.9954258331518188, 1.010210687484271],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/W.webp':
      {
        hueDegrees: 0.6378968253967514,
        saturationScale: 0.6209134298880844,
        brightnessScale: 1.0069605568445477,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/U.webp':
      {
        frame: {
          hueDegrees: 17.337752059074205,
          saturationScale: 0.7776986444212719,
          brightnessScale: 0.9675141242937855,
        },
        paper: {
          hueDegrees: 15.555555555555657,
          saturationScale: 0.6946778711484594,
          brightnessScale: 0.9596774193548387,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/U.webp':
      {
        hueDegrees: 17.337752059074205,
        saturationScale: 0.7776986444212719,
        brightnessScale: 0.9675141242937855,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp':
      {
        hueDegrees: 18.69736945994316,
        saturationScale: 0.6932272608223894,
        brightnessScale: 0.9912472647702406,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/U.webp':
      {
        hueDegrees: 18.69736945994316,
        saturationScale: 0.6932272608223894,
        brightnessScale: 0.9912472647702406,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/U.webp':
      {
        hueDegrees: 17.337752059074205,
        saturationScale: 0.7776986444212719,
        brightnessScale: 0.9675141242937855,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/B.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.4176785714285711,
          brightnessScale: 0.9532483905579399,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/B.webp':
      {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/B.webp':
      {
        hueDegrees: 0,
        saturationScale: 0.48300308641975337,
        brightnessScale: 0.9778622715404701,
        rgbScale: [0.9986708030585714, 0.9992425123313436, 1.0101574866289742],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/B.webp':
      {
        hueDegrees: 0,
        saturationScale: 0.48300308641975337,
        brightnessScale: 0.9778622715404701,
        rgbScale: [0.9986708030585714, 0.9992425123313436, 1.0101574866289742],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/B.webp':
      {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp':
      {
        frame: {
          hueDegrees: 7.211691199830511,
          saturationScale: 0.9374657003333075,
          brightnessScale: 0.9440389294403893,
        },
        paper: {
          hueDegrees: -6.944852941176578,
          saturationScale: 0.5536446341140663,
          brightnessScale: 0.9346938775510204,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp':
      {
        hueDegrees: 7.211691199830511,
        saturationScale: 0.9374657003333075,
        brightnessScale: 0.9440389294403893,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp':
      {
        hueDegrees: 7.270348837209326,
        saturationScale: 0.6173654558551144,
        brightnessScale: 0.8998583499005963,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp':
      {
        hueDegrees: 7.270348837209326,
        saturationScale: 0.6173654558551144,
        brightnessScale: 0.8998583499005963,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp':
      {
        hueDegrees: 7.211691199830511,
        saturationScale: 0.9374657003333075,
        brightnessScale: 0.9440389294403893,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/G.webp':
      {
        frame: {
          hueDegrees: -6.936866623079368,
          saturationScale: 0.6975477653254121,
          brightnessScale: 0.8288288288288288,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.35,
          brightnessScale: 0.9580706521739131,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/G.webp':
      {
        hueDegrees: -6.936866623079368,
        saturationScale: 0.6975477653254121,
        brightnessScale: 0.8288288288288288,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp':
      {
        hueDegrees: 0,
        saturationScale: 0.36788117828773154,
        brightnessScale: 0.9710731132075472,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/G.webp':
      {
        hueDegrees: 0,
        saturationScale: 0.36788117828773154,
        brightnessScale: 0.9710731132075472,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/G.webp':
      {
        hueDegrees: -6.936866623079368,
        saturationScale: 0.6975477653254121,
        brightnessScale: 0.8288288288288288,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/WR.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6274999999999998,
          brightnessScale: 0.9687339743589743,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Gold.webp':
      {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Gold.webp':
      {
        hueDegrees: 6.568557268722543,
        saturationScale: 0.813947241214344,
        brightnessScale: 1.0375586854460095,
        rgbScale: [0.9999999999999999, 1.0001450411571138, 1.0000772804852658],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/Gold.webp':
      {
        hueDegrees: 6.568557268722543,
        saturationScale: 0.813947241214344,
        brightnessScale: 1.0375586854460095,
        rgbScale: [0.9999999999999999, 1.0001450411571138, 1.0000772804852658],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/WG.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6274999999999998,
          brightnessScale: 0.9687339743589743,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/BR.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6274999999999998,
          brightnessScale: 0.9687339743589743,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/UR.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6274999999999998,
          brightnessScale: 0.9687339743589743,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/WB.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6274999999999998,
          brightnessScale: 0.9687339743589743,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/RG.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6274999999999998,
          brightnessScale: 0.9687339743589743,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/UG.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6274999999999998,
          brightnessScale: 0.9687339743589743,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/WU.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6274999999999998,
          brightnessScale: 0.9687339743589743,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Gold.webp':
      {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/UB.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6274999999999998,
          brightnessScale: 0.9687339743589743,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Gold.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6274999999999998,
          brightnessScale: 0.9687339743589743,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/BG.webp':
      {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6274999999999998,
          brightnessScale: 0.9687339743589743,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Artifact.webp':
      {
        frame: {
          hueDegrees: 24.79404784967062,
          saturationScale: 0.6309266353903175,
          brightnessScale: 1.0380434782608696,
        },
        paper: {
          hueDegrees: 40.29166666666674,
          saturationScale: 0.840833333333332,
          brightnessScale: 1,
        },
        mask: {
          kind: 'rect',
          rect: [0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378],
          feather: 0.0026041666666666665,
        },
        outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Artifact.webp':
      {
        hueDegrees: 24.79404784967062,
        saturationScale: 0.6309266353903175,
        brightnessScale: 1.0380434782608696,
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp':
      {
        hueDegrees: 0,
        saturationScale: 0.5000000000000001,
        brightnessScale: 1.01397465437788,
        rgbScale: [1.0148731880325077, 0.9908264401467457, 1.0271209934895984],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/Artifact.webp':
      {
        hueDegrees: 0,
        saturationScale: 0.5000000000000001,
        brightnessScale: 1.01397465437788,
        rgbScale: [1.0148731880325077, 0.9908264401467457, 1.0271209934895984],
      },
    'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Artifact.webp':
      {
        hueDegrees: 24.79404784967062,
        saturationScale: 0.6309266353903175,
        brightnessScale: 1.0380434782608696,
      },
  },
};
