import { measureFontText } from './font-geometry.js';
import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { paintRetroGrayText } from './retro-lettering.js';
import type { RenderedCardInput, CardTextInk } from './face-layout.js';
import { retroFamily, isRetro } from './retro-frame.js';
import { isRevisedLand } from './revised-land-frame.js';
import { canvasFonts } from './canvas-font-registry.js';
import { fetchCardAsset } from '../fetch.js';
import type { CanvasFontAsset } from './canvas-fonts.js';

/** Revised printing uses solid gray ink over a lower-right shadow. */
export function usesRevisedLettering(face: RenderedCardInput): boolean {
  return face.setCode?.toLowerCase() === '3ed' && retroFamily(face) === 'fourth';
}

export function paintRevisedTitle(
  c: CanvasContext,
  text: string,
  originalX: number,
  y: number,
  maxWidth: number,
) {
  c.save();
  c.translate(38, y);
  c.scale(1.03, 1);
  c.font = '26px "CardRenderer MTG Goudy", Georgia';
  paintRetroGrayText(c, text, 0, 0, (maxWidth + originalX - 38) / 1.03, 1);
  c.restore();
}

export function paintRevisedStats(
  c: CanvasContext,
  text: string,
  y: number,
  liveChanges?: CardTextInk,
) {
  c.save();
  c.font = '27.25px "CardRenderer MTG MPlantin", Georgia';
  c.textAlign = 'right';
  // Stats use lighter ink than the title/artist on the reviewed W/G/B scans.
  paintRetroGrayText(c, text, 450.5, y + 11.5, 130, 1.25, '#d4d4d4', liveChanges);
  c.restore();
}

export function paintRevisedCredits(c: CanvasContext, artist: string) {
  c.save();
  c.font = '22px "CardRenderer MTG MPlantin", Georgia';
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  c.translate(48, 642.5);
  c.scale(1.02, 1);
  paintRetroGrayText(c, `Illus. © ${artist}`, 0, 0, 338 / 1.02, 1.25);
  c.restore();
}

/** Pinned regular Plantin used only by the reviewed Revised nonland type line. */
export const revisedTypeFontAsset: CanvasFontAsset = {
  family: 'CardRenderer MTG Revised Plantin',
  url: 'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/PlantinMTProRg.woff2',
  weight: '400',
  style: 'normal',
};
let typeFontReady: Promise<void> | undefined;
export function usesRevisedTypeTypography(face: RenderedCardInput): boolean {
  return usesRevisedLettering(face) && isRetro(face) && !isRevisedLand(face);
}
/** Preparation only; the same FontFaceSet is used in a document and a worker. */
export function loadRevisedTypeFont(face: RenderedCardInput): Promise<void> {
  if (!usesRevisedTypeTypography(face)) return Promise.resolve();
  return (typeFontReady ??= (async () => {
    const { family, url, weight, style } = revisedTypeFontAsset;
    if (
      [...canvasFonts()].some(
        (f) => f.family.replace(/^"|"$/g, '') === family && f.status === 'loaded',
      )
    )
      return;
    if (typeof FontFace !== 'function') throw Error('Revised type font needs FontFace support');
    const response = await fetchCardAsset(url);
    if (!response.ok) throw Error('Revised type font is unavailable');
    const font = await new FontFace(family, await response.arrayBuffer(), { weight, style }).load();
    canvasFonts().add(font);
  })().catch((error: unknown) => {
    typeFontReady = undefined;
    throw error;
  }));
}

export function paintRevisedType(
  c: CanvasContext,
  face: RenderedCardInput,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
): boolean {
  if (!usesRevisedTypeTypography(face)) return false;
  c.save();
  const native = measureFontText(c, 'Hg');
  c.font = '21.7px "CardRenderer MTG Revised Plantin", Georgia';
  const line = measureFontText(c, 'Hg');
  // One font-metric alignment, shared by the set; never a scan-specific offset.
  const opticalY =
    (-native.actualBoundingBoxAscent +
      native.actualBoundingBoxDescent +
      line.actualBoundingBoxAscent -
      line.actualBoundingBoxDescent) /
    2;
  paintRetroGrayText(
    c,
    text,
    x - 2,
    y + 4 + opticalY,
    maxWidth,
    1,
    '#ababab',
    face.textInk,
    'type',
  );
  c.restore();
  return true;
}
