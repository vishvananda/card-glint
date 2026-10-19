import {
  type CanvasContext,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
import { templateImageMask } from './template-image-mask.js';
import type { standardTemplateParts } from './standard-frame-templates.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput, FaceRect } from './face-layout.js';
import { faceSetSymbol } from './assets.js';
import { paintIllustration, type PaintLayer } from './illustration-paint.js';
import {
  templateLabel,
  templateCost,
  templateRules,
  templateStats,
  templateFooter,
} from './template-typography.js';

export const FLIP_PANEL_RECTS = [
  {
    title: [32, 30, 311, 23],
    rules: [37, 59, 302, 67],
    type: [33, 134, 310, 18],
    stats: [290, 130, 60, 28],
  },
  {
    title: [32, 49, 311, 23],
    rules: [37, 80, 302, 67],
    type: [33, 155, 310, 18],
    stats: [290, 150, 60, 28],
  },
] as const;

export function paintFlipTemplate(
  c: CanvasContext,
  face: RenderedCardInput,
  images: CanvasImages,
  assets: Extract<NonNullable<ReturnType<typeof standardTemplateParts>>, { kind: 'flip' }>,
  layer?: PaintLayer,
) {
  if (face.faces?.length !== 2) throw Error('A flip template needs exactly two printed panels.');
  const front = face.faces[0]!,
    back = face.faces[1]!;
  if (layer !== 'artwork') {
    for (const [index, url] of [assets.base, assets.reverse].entries()) {
      const image = images.get(url);
      if (!image) throw Error(`Flip frame unavailable: ${url}`);
      c.save();
      if (index) {
        c.beginPath();
        c.rect(0, 344, 375, 179);
        c.clip();
      }
      c.drawImage(image, 0, 0, 375, 523);
      c.restore();
    }
  }
  paintIllustration(c, face, images, [32, 162, 311, 182], layer);
  if (layer === 'artwork') return;
  for (const [url, maskUrl, rect] of [
    [assets.stats, assets.statsMask, [285, 123, 70, 38]],
    [assets.reverseStats, assets.reverseStatsMask, [18, 342, 70, 38]],
  ] as const) {
    if (!url || !maskUrl) continue;
    const image = images.get(url),
      mask = images.get(maskUrl);
    if (!image || !mask) throw Error('Missing flip statistics plate');
    const plate = rasterCanvas();
    plate.width = 140;
    plate.height = 76;
    const p = plate.getContext('2d')!;
    p.drawImage(image, 0, 0, 140, 76);
    p.globalCompositeOperation = 'destination-in';
    p.drawImage(templateImageMask(mask), 0, 0, 140, 76);
    c.drawImage(plate, rect[0], rect[1], rect[2], rect[3]);
    plate.width = plate.height = 0;
  }
  c.shadowColor = 'transparent';
  c.fillStyle = '#17140f';
  const family = 'CardRenderer MTG Matrix';
  const panel = (
    f: RenderedCardInput,
    title: FaceRect,
    rules: FaceRect,
    type: FaceRect,
    stats: FaceRect,
  ) => {
    const cost = templateCost(c, f, images, title[0] + title[2], title[1] + 1, 15);
    templateLabel(
      c,
      f.name,
      [title[0], title[1], Math.max(1, title[2] - cost - 4), title[3]],
      17,
      family,
    );
    templateLabel(
      c,
      f.typeLine ?? '',
      [type[0], type[1], type[2] - (f.power != null ? 60 : 0), type[3]],
      14,
      family,
      f.textInk,
    );
    templateRules(c, f, images, rules, 14, 8);
    templateStats(c, f, stats, 17, family);
  };
  const a = FLIP_PANEL_RECTS[0],
    b = FLIP_PANEL_RECTS[1];
  panel(front, a.title, a.rules, a.type, a.stats);
  c.save();
  c.translate(375, 523);
  c.rotate(Math.PI);
  panel(back, b.title, b.rules, b.type, b.stats);
  c.restore();
  const icon = images.get(faceSetSymbol(face) ?? '');
  if (icon) {
    const scale = Math.min(44 / icon.width, 22 / icon.height);
    c.drawImage(icon, 353 - icon.width * scale, 482, icon.width * scale, icon.height * scale);
  }
  templateFooter(c, face, [58, 479, 217, 26], '#17140f');
}
