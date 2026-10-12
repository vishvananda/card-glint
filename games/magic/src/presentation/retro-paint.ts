import { retroBasicPrinting } from './retro-basic.js';
import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import {
  retroRects,
  retroFrameAsset,
  retroBorder,
  retroBorderMask,
  retroInk,
  retroSetSymbol,
  retroPx,
  retroFrameFilter,
  retroFamily,
  retroBasicSymbol,
  retroStock,
} from './retro-frame.js';
import { paintIllustration, type PaintLayer } from './illustration-paint.js';
import { paintMana, paintSetSymbol } from './canvas-text.js';
import { paintRulesLayout } from './rules-paint.js';
import { retroTextLayout } from './retro-rules.js';
import {
  retroPrintDetails,
  paintHistoricMana,
  paintOutlinedRetroSet,
  paintRetroCredits,
} from './retro-details.js';
export function paintRetroFace(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
  underArt?: HTMLCanvasElement,
  layer?: PaintLayer,
) {
  const rect = retroRects(face),
    details = retroPrintDetails(face);
  if (layer === 'artwork') {
    paintIllustration(c, face, images, retroPx(rect.art), layer);
    return;
  }
  c.fillStyle = retroStock(face);
  c.fillRect(0, 0, 488, 680);
  c.fillStyle = '#686050';
  c.fillRect(24.4, 27.2, 439.2, 625.6);
  c.fillStyle = '#e5dec5';
  c.fillRect(...retroPx(rect.rules));
  c.fillStyle = '#746b58';
  c.fillRect(...retroPx(rect.art));
  if (underArt) c.drawImage(underArt, 0, 0, 488, 680);
  paintIllustration(c, face, images, retroPx(rect.art), layer);
  const frame = images.get(retroFrameAsset(face));
  if (frame) {
    c.save();
    c.filter = retroFrameFilter(face);
    c.drawImage(frame, ...retroPx(rect.frame));
    c.restore();
  }
  if (retroBorder(face) !== 'black' || retroFamily(face) === 'fourth') {
    const mask = images.get(retroBorderMask(face));
    if (mask) {
      const layer = document.createElement('canvas');
      layer.width = 732;
      layer.height = 1020;
      const ctx = layer.getContext('2d')!;
      ctx.drawImage(mask, 0, 0, 732, 1020);
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = retroStock(face);
      ctx.fillRect(0, 0, 732, 1020);
      c.drawImage(layer, ...retroPx(rect.frame));
      layer.width = layer.height = 0;
    }
  }
  c.fillStyle = retroInk(face);
  c.textBaseline = 'middle';
  c.textAlign = 'left';
  c.letterSpacing = '0px';
  const [x, y, w, h] = retroPx(rect.title),
    cost = face.manaSymbols ?? [],
    size = details?.manaSize ?? 23.4,
    gap = details?.manaGap ?? 1.7,
    costW = cost.length * (size + gap),
    costX = details ? details.manaRight - costW + gap : x + w - costW;
  c.shadowColor = '#000b';
  c.shadowOffsetX = c.shadowOffsetY = c.getTransform().a;
  c.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  c.fillText(face.name, x, y + h / 2, Math.max(1, cost.length ? costX - x - 5 : w - 5));
  cost.forEach((s, i) =>
    paintMana(
      c,
      s,
      costX + i * (size + gap),
      details?.manaTop ?? y + h / 2 - size / 2,
      size,
      images,
      !details,
    ),
  );
  const [tx, ty, tw, th] = retroPx(rect.type),
    icon = images.get(retroSetSymbol(face) ?? '');
  c.font = '21.7px "CardRenderer MTG MPlantin", Georgia';
  c.fillText(
    retroBasicPrinting(face)?.typeLine ?? face.typeLine ?? '',
    tx,
    ty + th / 2,
    tw - (icon ? 48 : 0),
  );
  if (icon) {
    const scale = Math.min(44 / icon.width, (details?.setHeight ?? 23.4) / icon.height);
    if (details)
      paintOutlinedRetroSet(
        c,
        icon,
        details.setRight - icon.width * scale,
        details.setCenterY - (icon.height * scale) / 2,
        icon.width * scale,
        icon.height * scale,
        details.setOutline,
      );
    else
      paintSetSymbol(
        c,
        icon,
        face.setCode,
        face.rarity,
        tx + tw - icon.width * scale,
        ty + th / 2 - (icon.height * scale) / 2,
        icon.width * scale,
        icon.height * scale,
      );
  }
  c.shadowColor = 'transparent';
  const [rx, ry, rw, rh] = retroPx(rect.rules);
  c.fillStyle = '#17140f';
  const basic = images.get(retroBasicSymbol(face) ?? '');
  if (basic) {
    const scale = Math.min((rw * 0.4) / basic.width, (rh * 0.75) / basic.height);
    c.drawImage(
      basic,
      rx + (rw - basic.width * scale) / 2,
      ry + (rh - basic.height * scale) / 2,
      basic.width * scale,
      basic.height * scale,
    );
  } else {
    const layout = retroTextLayout(c, face);
    if (layout) paintRulesLayout(c, layout, images, details ? paintHistoricMana : paintMana);
  }
  c.shadowColor = details ? '#000' : '#000b';
  if (details) c.shadowOffsetX = c.shadowOffsetY = 1.5 * c.getTransform().a;
  c.fillStyle = retroInk(face);
  c.font = '27.8px "CardRenderer MTG MPlantin", Georgia';
  c.textBaseline = 'middle';
  if (face.power != null && face.toughness != null) {
    const [sx, sy, sw, sh] = retroPx(rect.stats);
    c.textAlign = 'center';
    c.fillText(`${face.power}/${face.toughness}`, sx + sw / 2, sy + sh / 2, sw);
  }
  if (details) paintRetroCredits(c, face, details);
  else if (face.artist) {
    const [fx, fy, fw, fh] = retroPx(rect.footer);
    c.textAlign = 'center';
    c.font = '15.6px "CardRenderer MTG MPlantin", Georgia';
    c.fillText(`Illus. ${face.artist}`, fx + fw / 2, fy + fh / 2, fw);
  }
  c.shadowColor = 'transparent';
}
