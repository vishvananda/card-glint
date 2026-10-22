import type { FrameHsb } from './frame-hsb.js';

/** Exact pinned foreground sources, measured on Original M21 nonfoil scans.
 * Paired name/type atlas sections have different source tints; the split is
 * inside the transparent middle, retaining texture, alpha and edge shadows.
 * Receipt: fixtures/accuracy/m21/walker-foreground-native-review.json. */
export const M21_WALKER_MATERIALS: Readonly<Record<string, FrameHsb>> = {
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/Colourless.webp':
    {
      mask: {
        kind: 'rect',
        rect: [0, 0.5, 1, 0.5],
        feather: 0.001,
      },
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [1.045, 1.045, 1.0],
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [1.005, 1.0350000000000001, 1.025],
      },
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/Colourless.webp':
    {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      valueGamma: 1.0,
      rgbScale: [0.985, 1.025, 0.995],
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/W.webp':
    {
      mask: {
        kind: 'rect',
        rect: [0, 0.5, 1, 0.5],
        feather: 0.001,
      },
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [0.98, 0.98, 1.02],
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [0.9650000000000001, 0.9450000000000001, 0.985],
      },
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/W.webp':
    {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      valueGamma: 1.0,
      rgbScale: [0.935, 0.9500000000000001, 0.9600000000000001],
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/U.webp':
    {
      mask: {
        kind: 'rect',
        rect: [0, 0.5, 1, 0.5],
        feather: 0.001,
      },
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [0.975, 0.935, 0.965],
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [1.1350000000000002, 0.975, 1.025],
      },
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_large_frames/U.webp':
    {
      hueDegrees: 10.0,
      saturationScale: 1.0,
      brightnessScale: 1.04,
      valueGamma: 1.0,
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/U.webp':
    {
      hueDegrees: 10.0,
      saturationScale: 1.0,
      brightnessScale: 1.04,
      valueGamma: 1.0,
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/B.webp':
    {
      mask: {
        kind: 'rect',
        rect: [0, 0.5, 1, 0.5],
        feather: 0.001,
      },
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [1.04, 1.0350000000000001, 1.065],
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [1.08, 1.085, 1.125],
      },
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/B.webp':
    {
      hueDegrees: 6.0,
      saturationScale: 1.2800000000000002,
      brightnessScale: 0.8400000000000001,
      valueGamma: 1.0,
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/R.webp':
    {
      mask: {
        kind: 'rect',
        rect: [0, 0.5, 1, 0.5],
        feather: 0.001,
      },
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [0.9400000000000001, 1.105, 1.1150000000000002],
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [0.935, 1.12, 1.1600000000000001],
      },
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/R.webp':
    {
      hueDegrees: 9.0,
      saturationScale: 0.9450000000000001,
      brightnessScale: 0.91,
      valueGamma: 1.0,
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/G.webp':
    {
      mask: {
        kind: 'rect',
        rect: [0, 0.5, 1, 0.5],
        feather: 0.001,
      },
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [1.0899999999999999, 1.0, 1.0150000000000001],
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.0,
        rgbScale: [1.105, 1.0150000000000001, 1.0300000000000002],
      },
    },
  'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/G.webp':
    {
      hueDegrees: 12.0,
      saturationScale: 0.7699999999999999,
      brightnessScale: 0.8200000000000001,
      valueGamma: 1.0,
    },
};
