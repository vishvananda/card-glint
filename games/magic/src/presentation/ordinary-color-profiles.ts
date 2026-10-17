import type { PrintingColorProfile } from './printing-color-profiles.js';

/** Measured ordinary-frame overrides preserve independently calibrated crowns.
 * Exact pinned source and geometry are checked by the shared selector. */
export const ORDINARY_COLOR_PROFILES: Readonly<Record<string, PrintingColorProfile>> = {
  'm21/black/components/R/R': {
    source:
      '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
    legendary: false,
    materials: {
      'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp':
        {
          frame: {
            hueDegrees: 6.340194313841702,
            saturationScale: 0.9999999999999968,
            brightnessScale: 0.8957653067671145,
            valueGamma: 0.9500990476406066,
            rgbScale: [1.0154051686851842, 0.9992551312126245, 0.9855626639694447],
          },
          paper: {
            hueDegrees: -4.114932885906114,
            saturationScale: 0.6159725971922244,
            brightnessScale: 0.9448979591836735,
          },
          mask: {
            kind: 'rect',
            rect: [
              0.032440800650188735, 0.6662377838116825, 0.9396578084020479, 0.3172337426923378,
            ],
            feather: 0.0026041666666666665,
          },
        },
      'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp':
        {
          hueDegrees: -4.114932885906114,
          saturationScale: 0.6159725971922244,
          brightnessScale: 0.9448979591836735,
        },
      'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp':
        {
          hueDegrees: 6.340194313841702,
          saturationScale: 0.9999999999999968,
          brightnessScale: 0.8957653067671145,
          valueGamma: 0.9500990476406066,
          rgbScale: [1.0154051686851842, 0.9992551312126245, 0.9855626639694447],
        },
      'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp':
        {
          hueDegrees: -4.114932885906114,
          saturationScale: 0.6159725971922244,
          brightnessScale: 0.9448979591836735,
        },
    },
  },
};
