import { paintFontText } from './font-geometry.js';
import { canvasFonts } from './canvas-font-registry.js';
import {
  type CanvasContext,
  type CanvasRaster,
} from '../../../../packages/browser/src/canvas-raster.js';
import { calibratedPrintingStock } from './printing-calibration-materials.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput, FaceRect } from './face-layout.js';
import { faceSetSymbol } from './assets.js';
import { paintIllustration, type PaintLayer } from './illustration-paint.js';
import { STANDARD_TEMPLATE_DEFAULTS, standardTemplateParts } from './standard-frame-templates.js';
import { paintFutureTemplate } from './future-template-paint.js';
import {
  templateLabel,
  templateCost,
  templateRules,
  templateStats,
  templateFooter,
} from './template-typography.js';
import { paintFlipTemplate } from './flip-template-paint.js';
import { BATTLE_REVERSE_STATS, battleReverseStatsLayout } from './battle-layout.js';

/** First rendering coverage from source defaults. No scan-fitted placements,
 * text exceptions or color profiles are borrowed from other frame families. */
export function paintStandardTemplate(
  c: CanvasContext,
  face: RenderedCardInput,
  images: CanvasImages,
  layer?: PaintLayer,
  underArt?: CanvasRaster,
) {
  const kind = face.frameTemplate;
  if (!kind) throw Error('Missing standard template');
  if (kind === 'future') return paintFutureTemplate(c, face, images, layer, underArt);
  const spec = STANDARD_TEMPLATE_DEFAULTS[kind];
  const required = (url: string) => {
    const image = images.get(url);
    if (!image) throw Error(`Standard template asset unavailable: ${url}`);
    return image;
  };
  const parts = standardTemplateParts(face);
  if (!parts) throw Error('Missing template assets');
  const base = required(parts.base);
  c.save();
  try {
    if (layer !== 'artwork') {
      c.fillStyle = calibratedPrintingStock(face) ?? '#090806';
      c.fillRect(0, 0, 488, 680);
    }
    if (underArt) c.drawImage(underArt, 0, 0, 488, 680);
    if (kind === 'battle') {
      c.translate(0, 680);
      c.rotate(-Math.PI / 2);
      c.scale(680 / 523, 488 / 375);
    } else c.scale(488 / 375, 680 / 523);
    if (parts.kind === 'flip') {
      paintFlipTemplate(c, face, images, parts, layer);
      return;
    }
    if (parts.kind !== 'battle') throw Error('Unexpected standard template branch');
    if (layer !== 'artwork') c.drawImage(required(parts.texture), 0, 0, 523, 375);
    paintIllustration(c, face, images, spec.art, layer, spec.size, -90);
    if (layer === 'artwork') return;
    c.drawImage(base, 0, 0, spec.size[0], spec.size[1]);
    c.drawImage(required(parts.border), 0, 0, 523, 375);
    if (face.defense != null) c.drawImage(required(parts.defense), 459, 322, 64, 52);
    c.shadowColor = 'transparent';
    c.fillStyle = '#17140f';
    const family = 'CardRenderer MTG Beleren';
    let title: FaceRect = spec.title;
    const cost = templateCost(c, face, images, 484, 20, 15);
    title = [title[0], title[1], Math.max(1, title[2] - cost - 5), title[3]];
    templateLabel(c, face.name, title, spec.titleSize, family);
    templateLabel(c, face.typeLine ?? '', spec.type, spec.typeSize, family, face.textInk);
    c.fillStyle = '#17140f';
    templateRules(c, face, images, spec.rules, spec.rulesSize, spec.minimumSize);
    if (kind === 'battle' && face.defense != null) {
      c.fillStyle = 'white';
      templateLabel(c, String(face.defense), spec.stats, 17, family);
    } else templateStats(c, face, spec.stats, 18, family);
    const reverse = battleReverseStatsLayout(c, face);
    if (reverse) {
      c.fillStyle = BATTLE_REVERSE_STATS.color;
      c.font = reverse.font;
      c.textAlign = 'right';
      c.textBaseline = 'alphabetic';
      c.letterSpacing = '0px';
      paintFontText(c, reverse.text, reverse.x, reverse.baseline);
    }
    const icon = images.get(faceSetSymbol(face) ?? '');
    if (icon) {
      const [x, y, w, h] = spec.symbol,
        scale = Math.min(w / icon.width, h / icon.height);
      c.drawImage(
        icon,
        x + w - icon.width * scale,
        y + (h - icon.height * scale) / 2,
        icon.width * scale,
        icon.height * scale,
      );
    }
    templateFooter(c, face, spec.footer, 'white');
  } finally {
    c.restore();
  }
}

let templateFonts: Promise<void> | undefined;
let battleStatsFont: Promise<void> | undefined;
export function loadStandardTemplateFonts(face: RenderedCardInput): Promise<void> {
  if (!face.frameTemplate) return Promise.resolve();
  if (face.frameTemplate === 'battle') {
    if (!face.reverseStats) return Promise.resolve();
    return (battleStatsFont ??= canvasFonts()
      .load(BATTLE_REVERSE_STATS.font)
      .then(() => undefined)
      .catch((error) => {
        battleStatsFont = undefined;
        throw error;
      }));
  }
  return (templateFonts ??= Promise.all([
    canvasFonts().load('400 24px "CardRenderer MTG Matrix"'),
    canvasFonts().load('700 24px "CardRenderer MTG Matrix"'),
    canvasFonts().load('700 24px "CardRenderer MTG Matrix Small Caps"'),
  ])
    .then(() => undefined)
    .catch((error) => {
      templateFonts = undefined;
      throw error;
    }));
}
