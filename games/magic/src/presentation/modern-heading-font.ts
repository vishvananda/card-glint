import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput } from './face-layout.js';
import { modernPrintingProfile } from './modern-printing-profile.js';
import { canvasFonts } from './canvas-font-registry.js';

export const MODERN_HEADING_FAMILY = 'CardRenderer MTG Beleren 2016';
let pending: Promise<void> | undefined;

export function modernHeadingFamily(face: RenderedCardInput) {
  return modernPrintingProfile(face)?.headingFont === 'beleren-2016'
    ? MODERN_HEADING_FAMILY
    : undefined;
}

/** Use the font's own n.alt (same advance), never a different card wording.
 * Beleren2016's calt table intends this form before spaces and descenders,
 * but its unsorted descender coverage misses g in browser shaping. End of
 * line also needs the final form explicitly; punctuation is not a boundary.
 * Scope this reviewed rule to headings using this exact font, not body text. */
export function shapeModernHeading(text: string, family: string): string {
  return family === MODERN_HEADING_FAMILY
    ? text.replace(/n(?=[gjpy\u00fd\u00fe\u00ff\u1ef3J\s]|$)/gu, '\ue009')
    : text;
}

const UNADJUSTED_TYPE = { dx: 0, dy: 0, size: 1, width: 1 } as const;

/** Match measurement and painting before the caller computes long-line fitting.
 * Whole-pixel hinted advances accumulate differently for each word; do not
 * compensate for that drift with per-card tracking. Context is caller-saved. */
export function prepareModernTypeText(
  context: CanvasContext,
  face: RenderedCardInput,
  source: 'plate' | 'components' | 'walker',
) {
  const adjustment = modernPrintingProfile(face)?.typeText?.[source];
  if (!adjustment) return UNADJUSTED_TYPE;
  context.textRendering = 'geometricPrecision';
  context.fontKerning = 'normal';
  return adjustment;
}

/** Resolve once during preparation, including worker FontFaceSet realms. */
export function loadModernHeadingFont(face: RenderedCardInput): Promise<void> {
  const family = modernHeadingFamily(face);
  if (!family) return Promise.resolve();
  pending ??= canvasFonts()
    .load(`bold 12px "${family}"`)
    .then((matches) => {
      if (!matches.length || matches.some((font) => font.status !== 'loaded'))
        throw Error('Modern heading font is unavailable. Load card-glint/magic/fonts.css.');
    })
    .catch((error: unknown) => {
      pending = undefined;
      throw error;
    });
  return pending;
}
