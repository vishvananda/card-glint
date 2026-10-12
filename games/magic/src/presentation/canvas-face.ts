import { isRetro, retroFrameAsset, retroBorder } from './retro-frame.js';
import { paintRetroFace } from './retro-paint.js';
import { loadRetroFont } from './retro-font.js';
import { hasExtraRules, extraRuleKey, extraRuleBlocks } from './extra-rules.js';
import { paintExtraRules } from './extra-rule-paint.js';
import { splitPanels, panelTransform, splitTextScale, splitHasFuse } from './split-layout.js';
import { faceFrame, faceRects } from './special-frames.js';
import { paintSpecialRules } from './special-rule-paint.js';
import {
  cardStock,
  faceStats,
  FACE_HEIGHT,
  FACE_CORNER_RADIUS,
  FACE_RECTS,
  FACE_TEXT,
  FACE_WIDTH,
  type FaceRect,
  type RenderedCardInput,
} from './face-layout.js';
import { profileAssets, RENDERER_COMPONENT_ROOT, faceSetSymbol } from './assets.js';
import { resolveCardProfile } from './profile.js';
import {
  canvasAssetUrls,
  loadCanvasFonts,
  loadCanvasImages,
  type CanvasImages,
} from './canvas-assets.js';
import { paintFittedText, paintMana, paintSetSymbol } from './canvas-text.js';
import { ordinaryTextLayout, paintRulesLayout } from './rules-paint.js';
export { ordinaryTextLayout } from './rules-paint.js';
export { retroTextLayout } from './retro-rules.js';
import { paintEtchingMask, type EtchingResolver } from './canvas-etching.js';
import { fullResolutionScan } from '../scan-url.js';
import type { AbilityEmblem } from '../emblems.js';
import { paintCardStatus } from './canvas-status.js';
import { paintIllustration, type PaintLayer } from './illustration-paint.js';

export type TextureTier = 'table' | 'inspect';
export interface CardTextureInput {
  /** Game-specific painter. Art bounds are bottom-up UV endpoints; corner radius is in card widths. */
  custom?: {
    key: string;
    artBounds: FaceRect;
    cornerRadius?: number;
    compose: (
      tier: TextureTier,
      signal: AbortSignal,
      layer: 'face' | 'etching',
      threshold?: number,
    ) => Promise<HTMLCanvasElement>;
  };
  layer?: 'face' | 'etching';
  paintLayer?: PaintLayer;
  etchThreshold?: number;
  /** Null denotes generated presentation with no official printing. */
  printingId: string | null;
  face: RenderedCardInput;
  /** Null forces the assembled face (etched, effective changes, or preference). */
  printedImage: string | null;
  emblems?: AbilityEmblem[];
  /** Current projected stats must also be visible over a printed scan. */
  currentStats?: Pick<RenderedCardInput, 'power' | 'toughness'>;
  /** A compact badge even when inspection temporarily uses table-resolution pixels. */
  statusLayout?: 'inspect';
}

export function inspectionCardFace(input: CardTextureInput): CardTextureInput {
  return input.currentStats?.power != null &&
    input.currentStats.toughness != null &&
    input.statusLayout !== 'inspect'
    ? { ...input, statusLayout: 'inspect' }
    : input;
}

export function cardTextureKey(input: CardTextureInput, tier: TextureTier): string {
  if (input.custom)
    return JSON.stringify([
      'custom-face-v1',
      input.custom.key,
      tier,
      input.layer ?? 'face',
      input.layer === 'etching' ? (input.etchThreshold ?? 20) : null,
    ]);
  // Only visible face content; no identity handles, finish or interaction state.
  const face = input.face;
  const content = faceContentKey(face, input.layer === 'etching');
  const stats =
    input.currentStats?.power != null && input.currentStats.toughness != null
      ? [input.currentStats.power, input.currentStats.toughness]
      : null;
  return JSON.stringify([
    RENDERER_COMPONENT_ROOT,
    'canvas-face-v32',
    input.paintLayer ?? null,
    tier,
    input.printingId,
    input.layer === 'etching' ? null : input.printedImage,
    content,
    input.layer ?? 'face',
    input.layer === 'etching' ? (input.etchThreshold ?? 14) : null,
    input.layer === 'etching'
      ? null
      : [
          (input.emblems ?? []).map((emblem) => [
            emblem.path,
            emblem.viewBox ?? null,
            emblem.transform ?? null,
            Boolean(emblem.filled),
          ]),
          stats,
          stats ? (input.statusLayout ?? tier) : null,
        ],
  ]);
}

function faceContentKey(face: RenderedCardInput, mask: boolean): unknown {
  const panels = splitPanels(face);
  if (panels.length)
    return [
      face.layout,
      panels.map((p) => [p.x, p.y, p.width, p.height, p.rotation, faceContentKey(p.face, mask)]),
      !mask && splitHasFuse(face),
    ];
  return mask
    ? [
        face.illustration ?? null,
        face.etchedIllustration ?? null,
        face.illustrationCrop ?? null,
        face.setCode ?? null,
        face.setSymbol ?? null,
        faceRects(face),
      ]
    : [
        isRetro(face) ? [retroFrameAsset(face), retroBorder(face)] : null,
        face.borderColor ?? null,
        face.name,
        face.manaSymbols ?? [],
        face.typeLine ?? '',
        face.rulesText ?? '',
        face.rulesParagraphs ?? null,
        face.wordingMode ?? null,
        face.symbolStyle ?? null,
        face.rulesAlignment ?? null,
        face.illustration ?? null,
        face.illustrationCrop ?? null,
        extraRuleKey(face),
        face.artist ?? null,
        face.legalText === undefined ? ['default'] : face.legalText,
        face.setCode ?? null,
        face.setSymbol ?? null,
        face.rarity ?? 'common',
        face.power ?? null,
        face.toughness ?? null,
        face.loyalty ?? null,
        faceRects(face),
        resolveCardProfile(face),
      ];
}

export function faceCanvas(tier: TextureTier): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = tier === 'table' ? 244 : 732;
  canvas.height = tier === 'table' ? 340 : 1020;
  return canvas;
}

export async function composeCardTexture(
  input: CardTextureInput,
  tier: TextureTier,
  signal: AbortSignal,
  hooks?: {
    beforePaint?: () => Promise<void>;
    cpuPixels?: boolean;
    loadImages?: typeof loadCanvasImages;
    resolveEtching?: EtchingResolver;
    loadFonts?: () => Promise<void>;
    loadRetroFont?: () => Promise<void>;
    underArt?: HTMLCanvasElement;
  },
): Promise<HTMLCanvasElement> {
  if (input.custom) {
    await hooks?.beforePaint?.();
    signal.throwIfAborted();
    return input.custom.compose(tier, signal, input.layer ?? 'face', input.etchThreshold);
  }
  const loadImages = hooks?.loadImages ?? loadCanvasImages;
  const canvas = faceCanvas(tier);
  try {
    const context = canvas.getContext('2d', {
      willReadFrequently: Boolean(hooks?.cpuPixels),
    });
    if (!context) throw new Error('Card composition needs Canvas2D.');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.scale(canvas.width / FACE_WIDTH, canvas.height / FACE_HEIGHT);
    if (input.layer === 'etching') {
      await paintEtchingMask(
        context,
        input.face,
        input.printingId,
        signal,
        input.etchThreshold,
        hooks?.beforePaint,
        loadImages,
        hooks?.resolveEtching,
      );
      return canvas;
    }
    context.fillStyle = '#090806';
    context.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT);
    const plateUrl =
      input.currentStats?.power != null && input.currentStats.toughness != null
        ? profileAssets(resolveCardProfile(input.face)).pt
        : null;
    if (input.printedImage) {
      const imageUrl =
        tier === 'inspect' ? fullResolutionScan(input.printedImage) : input.printedImage;
      if (plateUrl) await (hooks?.loadFonts ?? loadCanvasFonts)();
      const loaded = await loadImages(plateUrl ? [imageUrl, plateUrl] : [imageUrl], signal);
      try {
        const image = loaded.images.get(imageUrl);
        if (image && !signal.aborted) {
          await hooks?.beforePaint?.();
          signal.throwIfAborted();
          context.drawImage(image, 0, 0, FACE_WIDTH, FACE_HEIGHT);
          paintCardStatus(
            context,
            input.emblems ?? [],
            input.currentStats,
            plateUrl ? loaded.images.get(plateUrl) : undefined,
            input.statusLayout === 'inspect' || tier === 'inspect',
          );
          roundCanvasSilhouette(context);
          return canvas;
        }
      } finally {
        loaded.dispose();
      }
    }
    await Promise.all([
      (hooks?.loadFonts ?? loadCanvasFonts)(),
      isRetro(input.face) ? (hooks?.loadRetroFont ?? loadRetroFont)() : Promise.resolve(),
    ]);
    signal.throwIfAborted();
    const loaded = await loadImages(canvasAssetUrls(input.face), signal);
    try {
      await hooks?.beforePaint?.();
      signal.throwIfAborted();
      paintAssembledFace(
        context,
        input.face,
        loaded.images,
        FACE_HEIGHT,
        false,
        hooks?.underArt,
        input.paintLayer,
      );
      paintCardStatus(
        context,
        input.emblems ?? [],
        input.currentStats,
        plateUrl ? loaded.images.get(plateUrl) : undefined,
        input.statusLayout === 'inspect' || tier === 'inspect',
      );
      roundCanvasSilhouette(context);
      return canvas;
    } finally {
      loaded.dispose();
    }
  } catch (error) {
    canvas.width = canvas.height = 0;
    throw error;
  }
}

/** Apply the silhouette after painting so a complex clip cannot alter interior antialiasing. */
function roundCanvasSilhouette(context: CanvasRenderingContext2D) {
  context.save();
  context.setTransform(
    context.canvas.width / FACE_WIDTH,
    0,
    0,
    context.canvas.height / FACE_HEIGHT,
    0,
    0,
  );
  context.globalCompositeOperation = 'destination-in';
  context.globalAlpha = 1;
  context.shadowColor = 'transparent';
  context.filter = 'none';
  context.fillStyle = '#000';
  context.beginPath();
  context.roundRect(0, 0, FACE_WIDTH, FACE_HEIGHT, FACE_CORNER_RADIUS * FACE_WIDTH);
  context.fill();
  context.restore();
}

export function paintAssembledFace(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
  height = FACE_HEIGHT,
  panel = false,
  underArt?: HTMLCanvasElement,
  layer?: PaintLayer,
) {
  if (isRetro(face)) {
    paintRetroFace(context, face, images, underArt, layer);
    return;
  }
  const panels = splitPanels(face);
  if (panels.length) {
    context.fillStyle = cardStock(face.setCode, face.borderColor).border;
    context.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT);
    for (const child of panels) {
      context.save();
      panelTransform(context, child);
      paintAssembledFace(
        context,
        child.face,
        images,
        (child.height * FACE_WIDTH) / child.width,
        true,
        underArt,
        layer,
      );
      context.restore();
    }
    if (layer === 'artwork') return;
    paintFooter(context, face);
    if (splitHasFuse(face)) {
      context.font = '14px "CardRenderer MTG MPlantin", Georgia';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(
        'Fuse (You may cast one or both halves of this card from your hand.)',
        FACE_WIDTH / 2,
        FACE_HEIGHT - 12,
        FACE_WIDTH * 0.9,
      );
    }
    return;
  }
  const px = (rect: FaceRect): [number, number, number, number] => [
    rect[0] * FACE_WIDTH,
    rect[1] * height,
    rect[2] * FACE_WIDTH,
    rect[3] * height,
  ];
  context.fillStyle = cardStock(face.setCode, face.borderColor).border;
  context.fillRect(0, 0, FACE_WIDTH, height);
  const rects = faceRects(face),
    kind = faceFrame(face);
  if (layer === 'artwork') {
    paintIllustration(context, face, images, px(rects.art), layer);
    return;
  }
  const profile = resolveCardProfile(face),
    assets = profileAssets(profile, kind);
  const palette: Record<string, string> = {
    W: '#d7cda9',
    U: '#447e9a',
    B: '#5b5260',
    R: '#a84f3e',
    G: '#477553',
    Gold: '#a38335',
  };
  const color = palette[profile.boxes] ?? '#827d72';
  const draw = (url: string, rect: FaceRect, align: 'stretch' | 'top' | 'bottom' = 'top') => {
    const image = images.get(url);
    if (!image) return false;
    const [x, y, width, height] = px(rect);
    context.save();
    context.beginPath();
    context.rect(x, y, width, height);
    context.clip();
    const scaledHeight = align === 'stretch' ? height : (image.height * width) / image.width;
    context.drawImage(
      image,
      x,
      align === 'bottom' ? y + height - scaledHeight : y,
      width,
      scaledHeight,
    );
    context.restore();
    return true;
  };
  const [bx, by, bw, bh] = px(profile.legendary ? rects.legendaryBackground : rects.background);
  context.save();
  context.beginPath();
  context.roundRect(bx, by, bw, bh, [
    { x: bw * 0.01282, y: bh * 0.00962 },
    { x: bw * 0.01282, y: bh * 0.00962 },
    { x: bw * 0.06838, y: bh * 0.05128 },
    { x: bw * 0.06838, y: bh * 0.05128 },
  ]);
  context.clip();
  if (panel) {
    const channels = color
      .slice(1)
      .match(/../g)!
      .map((channel, index) =>
        Math.round(parseInt(channel, 16) * 0.62 + [244, 236, 217][index]! * 0.38),
      );
    context.fillStyle = `rgb(${channels.join(',')})`;
    context.fillRect(bx, by, bw, bh);
  }
  const background = images.get(assets.background);
  if (background)
    context.drawImage(
      background,
      bx,
      by + (profile.legendary ? FACE_TEXT.legendaryBackgroundLift : 0),
      bw,
      panel ? bh : (background.height * bw) / background.width,
    );
  else {
    context.fillStyle = color;
    context.fillRect(bx, by, bw, bh);
  }
  context.restore();
  // Text fallback is painted even when the network cannot provide frame assets.
  context.fillStyle = '#e3d8bb';
  if (!images.has(assets.frame)) {
    if (kind === 'adventure')
      for (const block of extraRuleBlocks(face).filter((b) => b.kind === 'rules' && !b.color))
        context.fillRect(block.x, block.y, block.width, block.height);
    else context.fillRect(...px(rects.rules));
  }
  if (!images.has(assets.boxes)) {
    context.fillRect(...px(rects.title));
    context.fillRect(...px(rects.type));
  }
  context.fillStyle = '#80745c';
  context.fillRect(...px(rects.art));
  const frame = images.get(assets.frame);
  if (frame && kind === 'normal' && !panel)
    paintFrame(context, frame, profile.legendary, rects.frame);
  if (underArt) {
    context.save();
    context.beginPath();
    context.rect(0, 0, FACE_WIDTH, height);
    context.clip();
    context.resetTransform();
    context.drawImage(underArt, 0, 0, context.canvas.width, context.canvas.height);
    context.restore();
  }
  paintIllustration(context, face, images, px(rects.art), layer);
  if (frame && kind !== 'normal') paintFrame(context, frame, profile.legendary, rects.frame);
  if (profile.legendary) draw(assets.crown, rects.crown);
  if (panel) {
    const boxes = images.get(assets.boxes);
    if (boxes) {
      const slice = boxes.height * 0.104;
      context.drawImage(boxes, 0, 0, boxes.width, slice, ...px(rects.title));
      context.drawImage(boxes, 0, boxes.height - slice, boxes.width, slice, ...px(rects.type));
    }
    const paper = images.get(assets.frame);
    context.fillStyle = '#e3d8bb';
    context.fillRect(...px(rects.rules));
    if (paper)
      context.drawImage(
        paper,
        paper.width * 0.035,
        paper.height * 0.675,
        paper.width * 0.93,
        paper.height * 0.325,
        ...px(rects.rules),
      );
  } else {
    draw(assets.boxes, rects.title);
    draw(assets.boxes, rects.type, 'bottom');
  }
  context.fillStyle = '#17140f';
  context.textBaseline = 'middle';
  context.textAlign = 'left';
  const [tx, ty, tw, th] = px(rects.title),
    textX = tx + FACE_TEXT.plateLeft + (kind === 'normal' ? 1 : 0);
  const textScale = splitTextScale(face);
  const mana = face.manaSymbols ?? [],
    manaSize = FACE_TEXT.manaSize * textScale;
  const manaWidth = mana.length * manaSize + Math.max(0, mana.length - 1) * FACE_TEXT.manaGap;
  const plateEnd = tx + tw - FACE_TEXT.plateRight,
    manaX = plateEnd - manaWidth;
  context.font = `bold ${FACE_TEXT.titleFont * textScale}px "CardRenderer MTG Beleren", Georgia`;
  context.letterSpacing = `${FACE_TEXT.titleTracking}px`;
  paintFittedText(
    context,
    face.name,
    textX,
    ty + th / 2 + (kind === 'normal' ? 1 : 0),
    manaX - textX - (mana.length ? FACE_TEXT.titleGap : 0),
    FACE_TEXT.titleFont * textScale,
    true,
  );
  context.letterSpacing = '0px';
  mana.forEach((symbol, index) =>
    paintMana(
      context,
      symbol,
      manaX + index * (manaSize + FACE_TEXT.manaGap),
      ty + th / 2 - manaSize / 2 + FACE_TEXT.manaLift / 2,
      manaSize,
      images,
      true,
    ),
  );
  const setIcon = images.get(faceSetSymbol(face) ?? '');
  // Keyrune M21's 32-square viewport contains a wide glyph at y=9.33..22.67.
  // This pack-owned crop uses the existing vector; custom symbols keep their viewport.
  const setCrop: FaceRect =
    !face.setSymbol && face.setCode?.toLowerCase() === 'm21'
      ? [0, 9.33 / 32, 1, 13.34 / 32]
      : [0, 0, 1, 1];
  const [, typeY, , typeH] = px(rects.type),
    typeCenter = typeY + typeH / 2 + FACE_TEXT.typeLift / 2 + (kind === 'normal' ? 2 : 0);
  const setWidth = setIcon
    ? Math.min(
        FACE_TEXT.setMaxWidth,
        (FACE_TEXT.setHeight * setIcon.width * setCrop[2]) / (setIcon.height * setCrop[3]),
      )
    : 0;
  const typeWidth =
    plateEnd - textX - (setIcon ? setWidth + FACE_TEXT.setMargin + FACE_TEXT.typeGap : 0);
  context.font = `${FACE_TEXT.typeFont * textScale}px "CardRenderer MTG Beleren", Georgia`;
  paintFittedText(
    context,
    face.typeLine ?? '',
    textX,
    typeCenter,
    typeWidth,
    FACE_TEXT.typeFont * textScale,
  );
  if (setIcon) {
    const scale = Math.min(
      setWidth / (setIcon.width * setCrop[2]),
      FACE_TEXT.setHeight / (setIcon.height * setCrop[3]),
    );
    paintSetSymbol(
      context,
      setIcon,
      face.setCode,
      face.rarity,
      plateEnd - FACE_TEXT.setMargin - setWidth,
      typeCenter - (setIcon.height * setCrop[3] * scale) / 2,
      setIcon.width * setCrop[2] * scale,
      setIcon.height * setCrop[3] * scale,
      setCrop,
    );
  }
  if (hasExtraRules(face)) paintExtraRules(context, face, images);
  else if (kind !== 'normal') paintSpecialRules(context, face, images);
  else {
    paintRulesLayout(context, ordinaryTextLayout(context, face, height, textScale), images);
  }
  const stats = faceStats(face);
  if (stats && kind !== 'leveler') {
    draw(assets.pt, rects.stats, 'stretch');
    const [sx, sy, sw] = px(rects.stats);
    context.fillStyle = kind.startsWith('planeswalker') ? 'white' : '#17140f';
    context.font = `bold ${FACE_TEXT.statsFont}px "CardRenderer MTG Beleren", Georgia`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(
      stats.text,
      sx + sw / 2,
      sy +
        (kind.startsWith('planeswalker')
          ? (rects.stats[3] * FACE_HEIGHT) / 2
          : FACE_TEXT.statsLine / 2 + (kind === 'normal' ? 2 : 0)),
      sw,
    );
  }
  if (!panel) paintFooter(context, face);
}

function paintFooter(context: CanvasRenderingContext2D, face: RenderedCardInput) {
  const [x, y, width, height] = pixels(FACE_RECTS.footer),
    top = y + FACE_TEXT.footerLine;
  context.save();
  context.beginPath();
  context.rect(x, y, width, height);
  context.clip();
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.fillStyle = cardStock(face.setCode, face.borderColor).ink;
  context.font = `${FACE_TEXT.footerFont}px "CardRenderer MTG Relay", sans-serif`;
  context.letterSpacing = `${FACE_TEXT.footerTracking}px`;
  const set = face.setCode?.trim().toUpperCase() ?? '';
  context.fillText(set, x, top);
  let left = x + context.measureText(set).width;
  context.letterSpacing = '0px';
  if (face.artist) {
    left += FACE_TEXT.artistMarginLeft;
    context.font = `${FACE_TEXT.footerFont}px "CardRenderer MTG Artist Credit", sans-serif`;
    context.fillText('a', left, top);
    left += context.measureText('a').width + FACE_TEXT.artistMarginRight;
    context.font = `${FACE_TEXT.footerFont * 1.154}px "CardRenderer MTG Beleren", Georgia`;
    context.fillText(face.artist, left, top);
  }
  context.restore();
}

function paintFrame(
  context: CanvasRenderingContext2D,
  image: ImageBitmap,
  legendary: boolean,
  rect: FaceRect = FACE_RECTS.frame,
) {
  const [x, y, width, height] = pixels(rect);
  const sourceHeight = Math.min(image.height, (height * image.width) / width);
  const renderedHeight = (sourceHeight * width) / image.width,
    scale = context.getTransform().a;
  context.save();
  context.shadowColor = 'black';
  context.shadowOffsetX = -0.00394 * FACE_WIDTH * scale;
  context.shadowOffsetY = 0.00394 * FACE_WIDTH * scale;
  context.shadowBlur = 0.00236 * FACE_WIDTH * scale;
  context.drawImage(image, 0, 0, image.width, sourceHeight, x, y, width, renderedHeight);
  if (!legendary) {
    context.shadowColor = '#ffffffa0';
    context.shadowOffsetX = 0.00157 * FACE_WIDTH * scale;
    context.shadowOffsetY = -0.00315 * FACE_WIDTH * scale;
    context.shadowBlur = 0.00157 * FACE_WIDTH * scale;
    context.drawImage(image, 0, 0, image.width, sourceHeight, x, y, width, renderedHeight);
  }
  context.restore();
}

export function pixels(rect: FaceRect): [number, number, number, number] {
  return [rect[0] * FACE_WIDTH, rect[1] * FACE_HEIGHT, rect[2] * FACE_WIDTH, rect[3] * FACE_HEIGHT];
}
