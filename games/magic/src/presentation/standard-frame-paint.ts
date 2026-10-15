import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput, FaceRect } from './face-layout.js';
import { faceSetSymbol } from './assets.js';
import { paintIllustration, type PaintLayer } from './illustration-paint.js';
import { paintMana } from './canvas-text.js';
import {
  STANDARD_TEMPLATE_DEFAULTS,
  standardTemplateParts,
  templateMaterial,
} from './standard-frame-templates.js';
import { templateImageMask } from './template-image-mask.js';
import {
  templateLabel,
  templateCost,
  templateRules,
  templateStats,
  templateFooter,
} from './template-typography.js';
import { paintFlipTemplate } from './flip-template-paint.js';

/** First rendering coverage from source defaults. No scan-fitted placements,
 * text exceptions or color profiles are borrowed from other frame families. */
export function paintStandardTemplate(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
  layer?: PaintLayer,
  underArt?: HTMLCanvasElement,
) {
  const kind = face.frameTemplate;
  if (!kind) throw Error('Missing standard template');
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
      c.fillStyle = '#090806';
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
    if (parts.kind === 'future') {
      if (layer !== 'artwork') c.drawImage(base, 0, 0, spec.size[0], spec.size[1]);
      const mask = templateImageMask(required(parts.mask)),
        [x, y, w, h] = spec.art;
      if (layer === 'printing') {
        c.save();
        c.globalCompositeOperation = 'destination-out';
        c.drawImage(mask, x, y, w, h);
        c.restore();
      } else {
        const art = document.createElement('canvas');
        art.width = 654;
        art.height = 620;
        const a = art.getContext('2d')!;
        a.scale(2, 2);
        paintIllustration(a, face, images, [0, 0, w, h], 'artwork');
        a.globalCompositeOperation = 'destination-in';
        a.drawImage(mask, 0, 0, w, h);
        c.drawImage(art, x, y, w, h);
        art.width = art.height = 0;
      }
      if (layer === 'artwork') return;
      c.drawImage(required(parts.paper), 23, 320, 335, 152);
      c.drawImage(required(parts.type), 18, 17, 339, 464);
      if (parts.stats) c.drawImage(required(parts.stats), 285, 452, 70, 52);
      if (parts.typeSymbol) c.drawImage(required(parts.typeSymbol), 24, 24, 21, 20);
    } else {
      if (layer !== 'artwork') c.drawImage(required(parts.texture), 0, 0, 523, 375);
      paintIllustration(c, face, images, spec.art, layer);
      if (layer === 'artwork') return;
      c.drawImage(base, 0, 0, spec.size[0], spec.size[1]);
      c.drawImage(required(parts.border), 0, 0, 523, 375);
      if (face.defense != null) c.drawImage(required(parts.defense), 459, 322, 64, 52);
    }
    c.shadowColor = 'transparent';
    c.fillStyle = '#17140f';
    const family = kind === 'future' ? 'CardRenderer MTG Matrix' : 'CardRenderer MTG Beleren';
    let title: FaceRect = spec.title;
    if (kind === 'future') {
      // Source defaults give a vertical cost field; keep the glyph sequence
      // visible while curved future-cost spacing remains in the review queue.
      (face.manaSymbols ?? []).forEach((symbol, i) => {
        const y = 75 + i * 31;
        const x = i === 0 ? 46 : i === 1 ? 30 : i < 5 ? 26 : 30 + (i - 5) * 8;
        paintMana(c, symbol, x, y, 26, images, true);
      });
    } else {
      const cost = templateCost(c, face, images, 484, 20, 15);
      title = [title[0], title[1], Math.max(1, title[2] - cost - 5), title[3]];
    }
    if (kind === 'future' && ['u', 'b', 'r', 'g'].includes(templateMaterial(face)[0]!))
      c.fillStyle = 'white';
    templateLabel(c, face.name, title, spec.titleSize, family);
    templateLabel(c, face.typeLine ?? '', spec.type, spec.typeSize, family);
    c.fillStyle = '#17140f';
    templateRules(c, face, images, spec.rules, spec.rulesSize, spec.minimumSize);
    if (kind === 'battle' && face.defense != null) {
      c.fillStyle = 'white';
      templateLabel(c, String(face.defense), spec.stats, 17, family);
    } else templateStats(c, face, spec.stats, 18, family);
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
    templateFooter(c, face, spec.footer, kind === 'future' ? '#17140f' : 'white');
  } finally {
    c.restore();
  }
}

let templateFonts: Promise<void> | undefined;
export function loadStandardTemplateFonts(face: RenderedCardInput): Promise<void> {
  if (!face.frameTemplate || face.frameTemplate === 'battle') return Promise.resolve();
  return (templateFonts ??= Promise.all([
    document.fonts.load('400 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
  ])
    .then(() => undefined)
    .catch((error) => {
      templateFonts = undefined;
      throw error;
    }));
}
