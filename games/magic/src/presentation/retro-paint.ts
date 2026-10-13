import { paintRetroGoldBevel } from './retro-gold-bevel.js';
import { retroSymbolGeometry } from './retro-symbol-geometry.js';
import { retroSymbolPalette } from './retro-symbol-material.js';
import { historicalBackingKey } from './historical-symbol-backing.js';
import { usesMonochromeSetSymbol, historicalSetOutline } from './historical-set-symbol.js';
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
import { paintEarlyCost, paintRevisedCost, paintEarlyMana } from './historic-cost.js';
import { usesEarlyCredits, paintEarlyCredits } from './early-credits.js';
import { paintRulesLayout } from './rules-paint.js';
import { retroTextLayout } from './retro-rules.js';
import {
  usesRevisedLettering,
  paintRevisedTitle,
  paintRevisedStats,
  paintRevisedCredits,
} from './revised-lettering.js';
import {
  retroPrintDetails,
  retroStatsPlacement,
  retroStatsText,
  paintHistoricMana,
  paintRevisedMana,
  originalRulesSymbols,
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
    details = retroPrintDetails(face),
    revised = usesRevisedLettering(face);
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
    if (retroFrameAsset(face).endsWith('/seventh/regular/m.png')) paintRetroGoldBevel(c, frame);
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
  const titleX = details?.titleX ?? x;
  const titleY = y + h / 2 + (details?.titleYOffset ?? 0),
    titleWidth = Math.max(
      1,
      cost.length ? costX - titleX - 5 : details?.titleX == null ? w - 5 : x + w - titleX - 5,
    );
  if (revised) paintRevisedTitle(c, face.name, titleX, titleY, titleWidth);
  else c.fillText(face.name, titleX, titleY, titleWidth);
  const modernSymbols =
    face.symbolStyle === 'modern' ||
    (face.symbolStyle === undefined && face.wordingMode === 'oracle');
  const originalSymbols =
    face.symbolStyle === 'original' ||
    (face.symbolStyle === undefined && face.wordingMode === 'original');
  const originalSun =
    originalSymbols && ['lea', 'leb', '2ed', '3ed'].includes(face.setCode?.toLowerCase() ?? '');
  if (revised) paintRevisedCost(c, cost, images, modernSymbols);
  else if (['lea', '2ed'].includes(face.setCode?.toLowerCase() ?? ''))
    paintEarlyCost(c, cost, images, modernSymbols);
  else
    cost.forEach((s, i) =>
      (originalSun ? paintEarlyMana : paintMana)(
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
    symbolUrl = retroSetSymbol(face) ?? '',
    icon = images.get(symbolUrl),
    geometry = retroSymbolGeometry(face),
    palette = retroSymbolPalette(face);
  c.font = '21.7px "CardRenderer MTG MPlantin", Georgia';
  c.fillText(
    retroBasicPrinting(face)?.typeLine ?? face.typeLine ?? '',
    details?.typeX ?? tx,
    ty + th / 2,
    icon ? Math.min(tw - 48, geometry ? geometry.right - geometry.width - tx - 6 : tw) : tw,
  );
  if (icon) {
    const scale = Math.min(44 / icon.width, (details?.setHeight ?? 23.4) / icon.height);
    const width = geometry?.width ?? icon.width * scale,
      height = geometry?.height ?? icon.height * scale,
      right = geometry?.right ?? details?.setRight ?? tx + tw,
      centerY = geometry?.centerY ?? details?.setCenterY ?? ty + th / 2,
      crop = geometry?.crop ?? ([0, 0, 1, 1] as const);
    const backing = !face.setSymbol && images.get(historicalBackingKey(symbolUrl));
    if (backing) {
      c.save();
      c.shadowColor = 'transparent';
      // ARN's printed blade is gray. Keep this tone local to that printing;
      // the shared white stencil also supplies Chronicles.
      if (face.setCode?.toLowerCase() === 'arn') c.filter = 'brightness(0.7)';
      c.drawImage(
        backing,
        crop[0] * backing.width,
        crop[1] * backing.height,
        crop[2] * backing.width,
        crop[3] * backing.height,
        right - width,
        centerY - height / 2,
        width,
        height,
      );
      c.restore();
    }
    if (palette || details || usesMonochromeSetSymbol(face.setCode))
      paintOutlinedRetroSet(
        c,
        icon,
        right - width,
        centerY - height / 2,
        width,
        height,
        geometry?.outline ??
          (palette ? 2 : (details?.setOutline ?? historicalSetOutline(face.setCode))),
        crop,
        palette,
        geometry?.sampling,
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
    if (layout)
      paintRulesLayout(
        c,
        layout,
        images,
        modernSymbols
          ? paintMana
          : originalSymbols
            ? originalRulesSymbols(face.setCode)
            : face.setCode?.toLowerCase() === '3ed'
              ? paintRevisedMana
              : details
                ? paintHistoricMana
                : paintMana,
        face.setCode?.toLowerCase() === 'lea' ? 0.012 : 0,
      );
  }
  c.shadowColor = details?.statsOpaqueShadow ? '#000' : '#000b';
  if (details) c.shadowOffsetX = c.shadowOffsetY = details.statsShadow * c.getTransform().a;
  c.fillStyle = retroInk(face);
  c.font = '27.8px "CardRenderer MTG MPlantin", Georgia';
  c.textBaseline = 'middle';
  if (face.power != null && face.toughness != null) {
    const [sx, sy, sw, sh] = retroPx(rect.stats);
    const placement = retroStatsPlacement(face);
    c.textAlign = placement ? 'right' : 'center';
    if (revised) paintRevisedStats(c, retroStatsText(face), sy + sh / 2);
    else
      c.fillText(
        retroStatsText(face),
        placement?.right ?? sx + sw / 2,
        sy + sh / 2 + (placement?.yOffset ?? 0),
        placement?.maxWidth ?? sw,
      );
  }
  if (revised && face.artist) paintRevisedCredits(c, face.artist);
  else if (face.artist && usesEarlyCredits(face)) paintEarlyCredits(c, face.artist);
  else if (details) paintRetroCredits(c, face, details);
  else if (face.artist) {
    const [fx, fy, fw, fh] = retroPx(rect.footer);
    c.textAlign = 'center';
    c.font = '15.6px "CardRenderer MTG MPlantin", Georgia';
    c.fillText(`Illus. ${face.artist}`, fx + fw / 2, fy + fh / 2, fw);
  }
  c.shadowColor = 'transparent';
}
