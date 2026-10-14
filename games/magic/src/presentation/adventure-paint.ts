import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { ADVENTURE_RECTS, adventureCrown, adventurePt } from './adventure-frame.js';
import { adventureFrameImage } from './adventure-material.js';
import { adventureRuleLayouts } from './adventure-rules.js';
import { resolveCardProfile } from './profile.js';
import { paintIllustration, type PaintLayer } from './illustration-paint.js';
import { paintFittedText, paintMana, paintSetSymbol } from './canvas-text.js';
import { paintRulesLayout } from './rules-paint.js';
import { faceSetSymbol } from './assets.js';
import { setSymbolCrop } from './set-symbols.js';
import { isStyledSetSymbol } from './styled-set-symbols.js';
import { SAGA_STAMP } from './saga-frame.js';

export function paintAdventureFrame(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
) {
  c.drawImage(adventureFrameImage(face, images), 0, 0, 488, 680);
  if (resolveCardProfile(face).legendary) {
    const crown = images.get(adventureCrown(face));
    if (!crown) throw Error('Adventure crown is unavailable.');
    c.fillStyle = '#000';
    c.fillRect(19.2, 18.8, 449.6, 12.1);
    c.drawImage(crown, 13.4, 13, 461.4, 113.4);
  }
}
function header(c: CanvasRenderingContext2D, face: RenderedCardInput, images: CanvasImages) {
  const cost = face.manaSymbols ?? [],
    size = 23.4,
    gap = 1.8,
    right = 452;
  const costWidth = cost.length * size + Math.max(0, cost.length - 1) * gap;
  c.fillStyle = '#17140f';
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  paintFittedText(
    c,
    face.name,
    41.7,
    51,
    (cost.length ? right - costWidth - 8 : 449) - 41.7,
    26,
    true,
  );
  cost.forEach((s, i) =>
    paintMana(c, s, right - costWidth + i * (size + gap), 38.7, size, images, true),
  );
  const url = faceSetSymbol(face),
    icon = images.get(url ?? ''),
    crop = setSymbolCrop(face);
  const scale = icon ? Math.min(58.56 / (icon.width * crop[2]), 27.9 / (icon.height * crop[3])) : 0;
  const w = icon ? icon.width * crop[2] * scale : 0,
    h = icon ? icon.height * crop[3] * scale : 0;
  const bounds = [450.3 - w, 402 - h / 2, w, h] as const;
  paintFittedText(
    c,
    face.typeLine ?? '',
    41.7,
    401.5,
    (icon ? bounds[0] - 7 : 449) - 41.7,
    22,
    true,
  );
  if (icon) {
    if (isStyledSetSymbol(url) || face.setSymbol) c.drawImage(icon, ...bounds);
    else paintSetSymbol(c, icon, face.setCode, face.rarity, ...bounds, crop);
  }
}
function insetHeader(c: CanvasRenderingContext2D, spell: RenderedCardInput, images: CanvasImages) {
  const cost = spell.manaSymbols ?? [],
    size = 19.8,
    gap = 1.2,
    right = 233;
  const costWidth = cost.length * size + Math.max(0, cost.length - 1) * gap;
  c.fillStyle = '#fff';
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  paintFittedText(
    c,
    spell.name,
    40,
    443,
    (cost.length ? right - costWidth - 4 : right) - 40,
    20.1,
    true,
  );
  cost.forEach((s, i) =>
    paintMana(c, s, right - costWidth + i * (size + gap), 432, size, images, true),
  );
  paintFittedText(c, spell.typeLine ?? '', 40, 473.5, 193, 20.1, true);
}
function footer(c: CanvasRenderingContext2D, face: RenderedCardInput, images: CanvasImages) {
  const hasStats = face.power != null && face.toughness != null;
  if (hasStats) {
    const pt = images.get(adventurePt(face));
    if (!pt) throw Error('Adventure power/toughness plate is unavailable.');
    const [x, y, w, h] = ADVENTURE_RECTS.stats;
    c.drawImage(pt, x * 488, y * 680, w * 488, h * 680);
    c.fillStyle = '#17140f';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '700 25px "CardRenderer MTG Beleren", Georgia';
    c.fillText(`${face.power}/${face.toughness}`, 420, 627, 77);
  }
  if (['rare', 'mythic'].includes(face.rarity ?? '')) {
    const stamp = images.get(SAGA_STAMP);
    if (!stamp) throw Error('Adventure authenticity stamp is unavailable.');
    c.drawImage(stamp, 213.7, 620.2, 60.5, 25.3);
  }
  c.fillStyle = '#fff';
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  c.font = '11px "CardRenderer MTG Relay", sans-serif';
  c.fillText(
    `${face.collectorNumber ?? ''} ${(face.rarity ?? 'common')[0]!.toUpperCase()}`,
    32,
    645,
  );
  c.fillText(`${face.setCode?.toUpperCase() ?? ''} • EN`, 32, 658);
  if (face.artist) {
    c.font = '11px "CardRenderer MTG Artist Credit", serif';
    c.fillText('a', 93, 658);
    c.font = 'small-caps 11px "CardRenderer MTG Beleren", serif';
    c.fillText(face.artist, 108, 658, 210);
  }
  if (face.legalText) {
    c.textAlign = 'right';
    c.font = '10px "CardRenderer MTG MPlantin", Georgia';
    c.fillText(face.legalText, 454, 658, 182);
  }
}
export function paintAdventureFace(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
  underArt?: HTMLCanvasElement,
  layer?: PaintLayer,
) {
  const spell = face.faces?.[1];
  if (!spell) throw Error('Adventure spell is missing.');
  c.save();
  c.fillStyle = '#000';
  c.fillRect(0, 0, 488, 680);
  if (underArt) c.drawImage(underArt, 0, 0, 488, 680);
  if (layer !== 'artwork') paintAdventureFrame(c, face, images);
  const [x, y, w, h] = ADVENTURE_RECTS.art;
  paintIllustration(c, face, images, [x * 488, y * 680, w * 488, h * 680], layer);
  if (layer !== 'artwork') {
    header(c, face, images);
    insetHeader(c, spell, images);
    const rules = adventureRuleLayouts(c, face);
    paintRulesLayout(c, rules.permanent, images);
    paintRulesLayout(c, rules.spell, images);
    footer(c, face, images);
  }
  c.restore();
}
