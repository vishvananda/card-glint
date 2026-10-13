import { isRetro, retroAssets, RETRO_ROOT } from './retro-frame.js';
import { historicalBackingBlob, historicalBackingKey } from './historical-symbol-backing.js';
import { extraRuleAssets } from './extra-rules.js';
import { splitPanels } from './split-layout.js';
import { faceFrame, specialRules } from './special-frames.js';
import { ruleBadgeAsset, sagaTextbox } from './special-rule-paint.js';
import {
  manaSymbolAsset,
  profileAssets,
  RENDERER_COMPONENT_ROOT,
  faceSetSymbol,
} from './assets.js';
import { resolveCardProfile } from './profile.js';
import { symbolTextParts, type RenderedCardInput } from './face-layout.js';

export type CanvasImages = ReadonlyMap<string, ImageBitmap>;

export async function fetchCanvasAsset(url: string, signal: AbortSignal): Promise<Response> {
  signal.throwIfAborted();
  return fetch(url, { signal, mode: 'cors' });
}

/** Pinned frame components exceed 2,600 px wide; inspection paints at most 732 px. */
export function canvasAssetWidth(url: string): number | undefined {
  if (url.startsWith(`${RETRO_ROOT}/img/frames/`) && url.endsWith('.png')) return 768;
  const path = url.startsWith(`${RENDERER_COMPONENT_ROOT}/img/`)
    ? url.slice(`${RENDERER_COMPONENT_ROOT}/img/`.length)
    : '';
  return path === 'class_level_bg.webp'
    ? 768
    : /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
          path,
        )
      ? 768
      : undefined;
}

/** Bound SVG intrinsic dimensions before rasterizing it for bitmap decoding. */
export async function sizedCanvasSvg(blob: Blob): Promise<Blob> {
  if (!blob.type.includes('svg')) return blob;
  const document = new DOMParser().parseFromString(await blob.text(), 'image/svg+xml');
  const svg = document.documentElement;
  if (svg.localName !== 'svg' || document.querySelector('parsererror'))
    throw new Error('Invalid SVG asset.');
  const box = (svg.getAttribute('viewBox') ?? '')
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const width = box[2] ?? parseFloat(svg.getAttribute('width') ?? '');
  const height = box[3] ?? parseFloat(svg.getAttribute('height') ?? '');
  if (!(width > 0 && height > 0 && Number.isFinite(width + height)))
    throw new Error('SVG asset needs a finite viewport.');
  const scale = 512 / Math.max(width, height);
  if (!svg.hasAttribute('viewBox')) svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', String(Math.max(1, Math.round(width * scale))));
  svg.setAttribute('height', String(Math.max(1, Math.round(height * scale))));
  return new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
}

export async function decodeCanvasImage(
  blob: Blob,
  signal: AbortSignal,
  resizeWidth?: number,
): Promise<ImageBitmap> {
  signal.throwIfAborted();
  if (!blob.type.includes('svg'))
    return resizeWidth
      ? createImageBitmap(blob, { resizeWidth, resizeQuality: 'high' })
      : createImageBitmap(blob);
  const url = URL.createObjectURL(await sizedCanvasSvg(blob)),
    image = new Image();
  const raster = document.createElement('canvas');
  const cancel = () => {
    image.src = '';
  };
  signal.addEventListener('abort', cancel, { once: true });
  try {
    signal.throwIfAborted();
    image.src = url;
    await image.decode();
    signal.throwIfAborted();
    raster.width = image.naturalWidth;
    raster.height = image.naturalHeight;
    const context = raster.getContext('2d', { willReadFrequently: true });
    if (!context || !raster.width || !raster.height)
      throw new Error('SVG asset could not be rasterized.');
    context.drawImage(image, 0, 0);
    return await createImageBitmap(raster);
  } finally {
    signal.removeEventListener('abort', cancel);
    image.src = '';
    URL.revokeObjectURL(url);
    raster.width = 0;
    raster.height = 0;
  }
}

/** Four CORS fetch/decode jobs at most; the compositor owns and closes all bitmaps. */
export async function loadCanvasImages(
  urls: readonly (string | null | undefined)[],
  signal: AbortSignal,
) {
  const pending = [...new Set(urls.filter((url): url is string => Boolean(url)))];
  const images = new Map<string, ImageBitmap>();
  let index = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, pending.length) }, async () => {
      while (index < pending.length && !signal.aborted) {
        const url = pending[index++]!;
        try {
          const response = await fetchCanvasAsset(url, signal);
          if (!response.ok) continue;
          const blob = await response.blob();
          const bitmap = await decodeCanvasImage(blob, signal, canvasAssetWidth(url));
          if (signal.aborted) bitmap.close();
          else images.set(url, bitmap);
          const backing = await historicalBackingBlob(url, blob);
          if (backing) {
            const white = await decodeCanvasImage(backing, signal);
            if (signal.aborted) white.close();
            else images.set(historicalBackingKey(url), white);
          }
        } catch {
          /* A missing illustration or frame leaves the drawn face readable. */
        }
      }
    }),
  );
  return {
    images,
    dispose: () => {
      for (const image of images.values()) image.close();
      images.clear();
    },
  };
}

export function canvasAssetUrls(face: RenderedCardInput): (string | null | undefined)[] {
  if (isRetro(face)) return retroAssets(face);
  const panels = splitPanels(face);
  if (panels.length) return panels.flatMap((panel) => canvasAssetUrls(panel.face));
  const profile = resolveCardProfile(face),
    assets = profileAssets(profile, faceFrame(face));
  return [
    ...extraRuleAssets(face),
    assets.background,
    assets.frame,
    assets.boxes,
    assets.pt,
    sagaTextbox(face, profile.boxes),
    ...(!['saga', 'planeswalker', 'planeswalker-large'].includes(faceFrame(face))
      ? []
      : specialRules(face).flatMap((row) =>
          row.badges.map((badge) => ruleBadgeAsset(faceFrame(face), badge)),
        )),
    profile.legendary ? assets.crown : null,
    face.illustration,
    faceSetSymbol(face),
    ...(face.manaSymbols ?? []).map(manaSymbolAsset),
    ...symbolTextParts(face.rulesText ?? '').flatMap((part) =>
      part.symbol ? [manaSymbolAsset(part.symbol)] : [],
    ),
    ...(face.rulesParagraphs ?? []).flatMap((paragraph) =>
      paragraph.runs.flatMap((run) =>
        symbolTextParts(run.text).flatMap((part) =>
          part.symbol ? [manaSymbolAsset(part.symbol)] : [],
        ),
      ),
    ),
  ];
}

let fonts: Promise<void> | null = null;
export function loadCanvasFonts(): Promise<void> {
  // The same @font-face declarations as RenderedCardFace; no second font registry.
  return (fonts ??= Promise.all([
    document.fonts.load('24px "CardRenderer MTG Beleren"'),
    document.fonts.load('700 24px "CardRenderer MTG Beleren"'),
    document.fonts.load('24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('italic 24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('14px "CardRenderer MTG Relay"'),
    document.fonts.load('14px "CardRenderer MTG Artist Credit"'),
  ])
    .then((matches) => {
      if (matches.some((faces) => !faces.length || faces.some((face) => face.status !== 'loaded')))
        throw Error(
          'Magic fonts are unavailable. Load card-glint/magic/fonts.css before preparing cards.',
        );
    })
    .catch((error: unknown) => {
      fonts = null;
      throw error;
    }));
}
