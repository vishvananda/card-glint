import { resolveCardProfile } from './profile.js';
import { framePlate } from './frame-plates.js';
import { faceSetSymbol } from './assets.js';
import { setSymbolCrop } from './set-symbols.js';
import { isStyledSetSymbol } from './styled-set-symbols.js';
import type { CanvasImages } from './canvas-assets.js';
import {
  FACE_WIDTH as W,
  FACE_HEIGHT as H,
  cardStock,
  type FaceRect,
  type RenderedCardInput,
} from './face-layout.js';
import { paintIllustration, type PaintLayer } from './illustration-paint.js';
import { paintMana, paintFittedText, paintSetSymbol } from './canvas-text.js';
import { ordinaryTextLayout, paintRulesLayout } from './rules-paint.js';

const px = (r: FaceRect): [number, number, number, number] => [
  r[0] * W,
  r[1] * H,
  r[2] * W,
  r[3] * H,
];

/** Paint a complete base plate once per face preparation. Its art aperture,
 * bevels, paper and type plate remain one source; no component overlays. */
export function paintFramePlateFace(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
  underArt?: HTMLCanvasElement,
  layer?: PaintLayer,
) {
  const plate = framePlate(face);
  if (!plate) throw Error('Missing replacement frame family.');
  const required = (url: string) => {
    const image = images.get(url);
    if (!image) throw Error(`Replacement frame asset unavailable: ${url}`);
    return image;
  };
  const { rects } = plate,
    eighth = face.frameAssetFamily === 'eighth';
  c.save();
  c.fillStyle = cardStock(face.setCode, face.borderColor).border;
  c.fillRect(0, 0, W, H);
  if (underArt) c.drawImage(underArt, 0, 0, W, H);
  paintIllustration(c, face, images, px(rects.art), layer);
  if (layer === 'artwork') {
    c.restore();
    return;
  }
  c.drawImage(required(plate.frame), 0, 0, W, H);
  if (plate.rightFrame) {
    // A narrow blend joins the two *land* textures, preserving colored outer
    // frames and paper rather than replacing them with a generic gold land.
    const mix = document.createElement('canvas');
    mix.width = 732;
    mix.height = 1020;
    const m = mix.getContext('2d')!;
    m.drawImage(required(plate.rightFrame), 0, 0, mix.width, mix.height);
    m.globalCompositeOperation = 'destination-in';
    const gradient = m.createLinearGradient(mix.width * 0.47, 0, mix.width * 0.53, 0);
    gradient.addColorStop(0, '#0000');
    gradient.addColorStop(1, '#000');
    m.fillStyle = gradient;
    m.fillRect(0, 0, mix.width, mix.height);
    c.drawImage(mix, 0, 0, W, H);
    mix.width = mix.height = 0;
  }
  const stock = cardStock(face.setCode, face.borderColor);
  if (stock.border !== '#090806') {
    const mask = document.createElement('canvas');
    mask.width = 732;
    mask.height = 1020;
    const m = mask.getContext('2d')!;
    m.drawImage(required(plate.border), 0, 0, mask.width, mask.height);
    m.globalCompositeOperation = 'source-in';
    m.fillStyle = stock.border;
    m.fillRect(0, 0, mask.width, mask.height);
    c.drawImage(mask, 0, 0, W, H);
    mask.width = mask.height = 0;
  }
  c.fillStyle = '#17140f';
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  const family = eighth ? 'CardRenderer MTG Matrix' : 'CardRenderer MTG Beleren';
  const [tx, ty, tw, th] = px(rects.title),
    cost = face.manaSymbols ?? [],
    size = eighth ? 23 : 23.4;
  const costRight = (eighth ? 0.9147 : 1864 / 2010) * W;
  const costWidth = cost.length * size + Math.max(0, cost.length - 1) * 1.5;
  c.font = `bold ${plate.titleSize}px "${family}", Georgia`;
  paintFittedText(
    c,
    face.name,
    tx,
    ty + th / 2,
    cost.length ? costRight - costWidth - tx - 8 : tw,
    plate.titleSize,
    true,
    1,
    family,
  );
  cost.forEach((symbol, i) =>
    paintMana(
      c,
      symbol,
      costRight - costWidth + i * (size + 1.5),
      ty + th / 2 - size / 2,
      size,
      images,
      true,
    ),
  );
  const url = faceSetSymbol(face),
    icon = images.get(url ?? ''),
    crop = setSymbolCrop(face);
  const iconScale = icon
    ? Math.min(
        (plate.symbol.width * W) / (icon.width * crop[2]),
        (plate.symbol.height * H) / (icon.height * crop[3]),
      )
    : 0;
  const iw = icon ? icon.width * crop[2] * iconScale : 0,
    ih = icon ? icon.height * crop[3] * iconScale : 0;
  const [x, y, w, h] = px(rects.type);
  c.font = `bold ${plate.typeSize}px "${family}", Georgia`;
  paintFittedText(
    c,
    face.typeLine ?? '',
    x,
    y + h / 2,
    icon ? plate.symbol.right * W - iw - x - 7 : w,
    plate.typeSize,
    true,
    1,
    family,
  );
  if (icon) {
    const bounds = [plate.symbol.right * W - iw, plate.symbol.center * H - ih / 2, iw, ih] as const;
    if (isStyledSetSymbol(url) || face.setSymbol) c.drawImage(icon, ...bounds);
    else paintSetSymbol(c, icon, face.setCode, face.rarity, ...bounds, crop);
  }
  paintRulesLayout(c, ordinaryTextLayout(c, face), images);
  if (face.power != null && face.toughness != null) {
    c.drawImage(required(plate.pt), ...px(rects.stats));
    const [sx, sy, sw, sh] = px(rects.stats);
    c.font = `bold ${eighth ? 29 : 25}px "${family}", Georgia`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(`${face.power}/${face.toughness}`, sx + sw * 0.52, sy + sh * 0.52, sw * 0.85);
  }
  const [fx, fy, fw] = px(rects.footer);
  c.textAlign = 'left';
  c.textBaseline = 'top';
  c.fillStyle = eighth
    ? ['B', 'Colourless', 'Land'].includes(resolveCardProfile(face).boxes)
      ? '#fff'
      : '#17140f'
    : '#fff';
  c.font = `${eighth ? 14 : 12}px "${family}", Georgia`;
  c.fillText(face.artist ?? '', fx, fy, fw);
  if (face.legalText) {
    c.font = '9px "CardRenderer MTG MPlantin", Georgia';
    c.fillText(face.legalText, fx, fy + 15, fw);
  }
  c.restore();
}

let matrixFont: Promise<void> | null = null;
export function loadFramePlateFonts(face: RenderedCardInput): Promise<void> {
  if (face.frameAssetFamily !== 'eighth') return Promise.resolve();
  return (matrixFont ??= document.fonts
    .load('bold 24px "CardRenderer MTG Matrix"')
    .then((fonts) => {
      if (!fonts.length || fonts.some((font) => font.status !== 'loaded'))
        throw Error('Replacement Eighth Edition frames need card-glint/magic/fonts.css.');
    })
    .catch((error: unknown) => {
      matrixFont = null;
      throw error;
    }));
}
