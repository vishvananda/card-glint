import {
  paintModernSplitFrames,
  paintModernSplitHeader,
  paintModernSplitFooter,
} from './split-modern-paint.js';
import { splitPlateImage, paintSplitWatermark } from './split-materials.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import type { CanvasImages } from './canvas-assets.js';
import { cardStock, type RenderedCardInput } from './face-layout.js';
import { paintIllustration, type PaintLayer } from './illustration-paint.js';
import { splitPanels } from './split-layout.js';
import {
  nativeSplitEra,
  hasFuse,
  splitGeometry,
  splitFuseParagraphs,
  type SplitEra,
} from './split-frame.js';
import { paintMana, paintSetSymbol, paintFittedText } from './canvas-text.js';
import { faceSetSymbol } from './assets.js';
import { setSymbolCrop } from './set-symbols.js';
import { isStyledSetSymbol } from './styled-set-symbols.js';
import { wordingParagraphs } from './wording.js';
import { layoutRules } from './rules-layout.js';
import { paintRulesLayout } from './rules-paint.js';
import { shortCenteredRules } from './short-centered-rules.js';

export function splitRules(
  c: CanvasRenderingContext2D,
  half: RenderedCardInput,
  era: SplitEra,
  fuse: boolean,
) {
  const [x, y, width, height] = splitGeometry(era, fuse).rules;
  const paragraphs = wordingParagraphs({
    rulesText: half.rulesText ?? '',
    rulesParagraphs: half.rulesParagraphs,
  });
  const bounds = { x, y, width, height },
    typography = {
      leading: 1.02,
      paragraphGap: 0.4,
      flavorGap: 0.65,
      centerOffset: era === 'old' ? 0 : 2,
    };
  const size = era === 'old' ? 24.5 : era === 'm15' ? (fuse ? 20.25 : 24.25) : 21.5;
  if ((era !== 'm15' || fuse) && half.rulesAlignment?.mode !== 'left' && paragraphs.length === 1) {
    const reference =
      half.rulesAlignment?.mode === 'auto'
        ? (half.rulesAlignment.reference ?? paragraphs)
        : paragraphs;
    const centered = shortCenteredRules(c, paragraphs, reference, bounds, size, 13, 2, typography);
    if (centered) return centered;
  }
  return layoutRules(c, paragraphs, bounds, size, 13, typography);
}

/** Frame-only painting is also used by the offline audit to keep ink out of scan registration. */
export function paintSplitFrames(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
) {
  const era = nativeSplitEra(face);
  if (!era) throw Error('No native split plate for this printing.');
  if (era === 'm15') return paintModernSplitFrames(c, face, images);
  const fuse = era !== 'old' && hasFuse(face),
    geometry = splitGeometry(era, fuse);
  c.fillStyle = cardStock(face.setCode, face.borderColor).border;
  c.fillRect(0, 0, 488, 680);
  splitPanels(face).forEach((panel, index) => {
    const image = splitPlateImage(panel.face, era, fuse, index, images);
    c.save();
    c.translate(panel.x, panel.y);
    c.rotate(-Math.PI / 2);
    const [x, y, w, h] = geometry.frame;
    c.drawImage(image, x - (fuse && index ? (8 * 680) / 523 : 0), y, w, h);
    c.restore();
  });
}

function paintSplitHeader(
  c: CanvasRenderingContext2D,
  half: RenderedCardInput,
  era: SplitEra,
  fuse: boolean,
  images: CanvasImages,
) {
  if (era === 'm15') return paintModernSplitHeader(c, half, images);
  const g = splitGeometry(era, fuse),
    old = era === 'old';
  const [x, y, width, height] = g.title,
    cost = half.manaSymbols ?? [],
    size = 23.4,
    gap = 1.7,
    right = 316,
    cw = cost.length * size + Math.max(0, cost.length - 1) * gap;
  c.fillStyle = old ? '#f2eee3' : '#17140f';
  c.textBaseline = 'middle';
  c.textAlign = 'left';
  if (old) {
    const m = c.getTransform();
    c.shadowColor = '#000b';
    c.shadowOffsetX = m.a + m.c;
    c.shadowOffsetY = m.b + m.d;
  }
  paintFittedText(
    c,
    half.name,
    x,
    y + height / 2 - (old ? 2 : 0),
    Math.max(1, cost.length ? right - cw - x - 7 : width),
    old ? 29 : 26.5,
    !old,
    1,
    old ? 'CardRenderer MTG Goudy' : 'CardRenderer MTG Matrix',
  );
  cost.forEach((s, i) =>
    paintMana(c, s, right - cw + i * (size + gap), old ? 30.5 : 40, size, images, !old),
  );
  const url = faceSetSymbol(half),
    symbol = images.get(url ?? ''),
    crop = setSymbolCrop(half);
  const [tx, ty, tw, th] = g.type;
  paintFittedText(
    c,
    half.typeLine ?? '',
    tx,
    ty + th / 2,
    tw - (symbol ? 33 : 0),
    old ? 22 : 21.5,
    false,
    1,
    old ? 'CardRenderer MTG MPlantin' : 'CardRenderer MTG Matrix',
  );
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  if (symbol) {
    const scale = Math.min(
      32 / (symbol.width * crop[2]),
      (old ? 26 : 22) / (symbol.height * crop[3]),
    );
    const w = symbol.width * crop[2] * scale,
      h = symbol.height * crop[3] * scale;
    const bounds = [(old ? 306 : 316) - w, ty + th / 2 - (old ? 1.5 : 0) - h / 2, w, h] as const;
    if (isStyledSetSymbol(url) || half.setSymbol) c.drawImage(symbol, ...bounds);
    else paintSetSymbol(c, symbol, half.setCode, half.rarity, ...bounds, crop);
  }
}
function paintSplitFooter(
  c: CanvasRenderingContext2D,
  half: RenderedCardInput,
  parent: RenderedCardInput,
  era: SplitEra,
  fuse: boolean,
  images: CanvasImages,
) {
  const g = splitGeometry(era, fuse),
    old = era === 'old';
  c.fillStyle = old ? '#eeeae1' : '#17140f';
  c.textAlign = old ? 'center' : 'left';
  c.textBaseline = 'middle';
  c.font = old
    ? '19px "CardRenderer MTG MPlantin", Georgia'
    : '700 14px "CardRenderer MTG Matrix", Georgia';
  const brush = images.get(`${CONJURER_ROOT}/img/manaSymbols/brush.svg`);
  if (!old && brush) c.drawImage(brush, 36, g.artistY - 4, 20, 8);
  if (old) {
    const m = c.getTransform();
    c.shadowColor = '#000b';
    c.shadowOffsetX = m.a + m.c;
    c.shadowOffsetY = m.b + m.d;
  }
  c.fillText(
    `${old ? 'Illus. ' : ''}${half.artist ?? parent.artist ?? ''}`,
    old ? 177 : 60,
    g.artistY,
    272,
  );
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  c.font = `${old ? 10.2 : 10}px "CardRenderer MTG MPlantin", Georgia`;
  if (parent.legalText)
    c.fillText(
      `${parent.legalText}${parent.collectorNumber ? ' ' + parent.collectorNumber : ''}`,
      old ? 177 : 36,
      g.legalY,
      280,
    );
}
export function paintNativeSplitFace(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
  underArt?: HTMLCanvasElement,
  layer?: PaintLayer,
) {
  const era = nativeSplitEra(face);
  if (!era) throw Error('No native split plate for this printing.');
  const fuse = era !== 'old' && hasFuse(face),
    g = splitGeometry(era, fuse);
  c.save();
  if (layer !== 'artwork') paintSplitFrames(c, face, images);
  if (underArt) c.drawImage(underArt, 0, 0, 488, 680);
  for (const panel of splitPanels(face)) {
    c.save();
    c.translate(panel.x, panel.y);
    c.rotate(-Math.PI / 2);
    paintIllustration(c, panel.face, images, g.art, layer);
    if (layer !== 'artwork') {
      paintSplitHeader(c, panel.face, era, fuse, images);
      paintSplitWatermark(c, panel.face, images, g.rules[1] + g.rules[3] / 2);
      paintRulesLayout(c, splitRules(c, panel.face, era, fuse), images);
      if (era !== 'm15') paintSplitFooter(c, panel.face, face, era, fuse, images);
    }
    c.restore();
  }
  if (era === 'm15' && layer !== 'artwork') paintModernSplitFooter(c, face, images);
  if (fuse && layer !== 'artwork') {
    c.translate(0, 680);
    c.rotate(-Math.PI / 2);
    const paragraphs = splitFuseParagraphs(face).map((p) =>
      era === 'm15' ? { ...p, align: 'center' as const } : p,
    );
    paintRulesLayout(
      c,
      layoutRules(
        c,
        paragraphs,
        era === 'm15'
          ? { x: 70, y: 441, width: 577, height: 20 }
          : { x: 38, y: 407, width: 608, height: 26 },
        era === 'm15' ? 18 : 21,
        12,
      ),
      images,
    );
  }
  c.restore();
}

let splitFonts: Promise<void> | undefined;
export function loadSplitFonts(face: RenderedCardInput): Promise<void> {
  if (nativeSplitEra(face) !== 'eighth') return Promise.resolve();
  return (splitFonts ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('24px "CardRenderer MTG Matrix"'),
  ])
    .then((matches) => {
      if (matches.some((fonts) => !fonts.length || fonts.some((f) => f.status !== 'loaded')))
        throw Error('Split Matrix fonts are unavailable. Load card-glint/magic/fonts.css.');
    })
    .catch((error: unknown) => {
      splitFonts = undefined;
      throw error;
    }));
}
