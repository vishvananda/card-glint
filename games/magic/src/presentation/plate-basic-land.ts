import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { modernPrintingProfile } from './modern-printing-profile.js';
import { rulesInkVisible } from './rules-visibility.js';
import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';

const COLORS: Readonly<Record<string, string>> = {
  Plains: 'W',
  Island: 'U',
  Swamp: 'B',
  Mountain: 'R',
  Forest: 'G',
};

/** The printed subtype supplies a basic land's palette; its rules colors are empty. */
export function basicLandColor(
  face: Pick<RenderedCardInput, 'typeLine' | 'canonicalTypeLine'>,
): string | undefined {
  const type = /^Basic (?:Snow )?Land [—–-] (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    face.canonicalTypeLine ?? face.typeLine ?? '',
  )?.[1];
  return type ? COLORS[type] : undefined;
}

/** MTGJSON encodes some large printed symbols as a lone W/U/B/R/G. Recognize
 * only the matching basic subtype and untouched single paragraph. Custom rules,
 * flavor and explicit paragraph styling must remain visible. */
export function plateBasicSymbol(face: RenderedCardInput): string | null {
  if (
    face.frameStyle === 'retro' ||
    face.frameTemplate ||
    (face.layout && face.layout !== 'normal')
  )
    return null;
  const color = basicLandColor(face);
  if (!color) return null;
  const raw = face.rulesText ?? '';
  if (!['', color, `{${color}}`, `{T}: Add {${color}}.`, `({T}: Add {${color}}.)`].includes(raw))
    return null;
  if (face.rulesParagraphs) {
    const p = face.rulesParagraphs;
    if (
      p.length !== 1 ||
      p[0]!.role !== 'rules' ||
      p[0]!.align ||
      p[0]!.runs.length !== 1 ||
      p[0]!.runs[0]!.text !== raw ||
      Boolean(p[0]!.runs[0]!.italic) !== raw.startsWith('(')
    )
      return null;
  }
  return `${manifest.RETRO_ROOT}/img/frames/m15/basics/${color.toLowerCase()}.png`;
}

/** Exact-set fit is bound to the same padded source used during measurement.
 * Custom rules, templates and older frame families retain their own behavior. */
export function modernBasicLandProfile(face: RenderedCardInput) {
  const color = basicLandColor(face);
  const profile = color ? modernPrintingProfile(face)?.largeLandSymbols?.[color] : undefined;
  return profile && profile.source === plateBasicSymbol(face) ? profile : undefined;
}

/** Source padding is retained; measured scale is around the original center. */
export function paintBasicLandSymbol(
  c: CanvasContext,
  face: RenderedCardInput,
  images: ReadonlyMap<string, ImageBitmap>,
): boolean {
  if (!rulesInkVisible(c)) return true;
  const url = plateBasicSymbol(face);
  if (!url) return false;
  const glyph = images.get(url);
  if (!glyph) throw Error(`Basic land symbol unavailable: ${url}`);
  const profile = modernBasicLandProfile(face);
  const shadow = profile && modernPrintingProfile(face)?.largeLandShadow;
  c.save();
  if (shadow) {
    // Canvas shadow offsets/blur are device pixels, unlike drawImage geometry.
    // Transform the canonical cast vector once while preparing the static face.
    const m = c.getTransform();
    c.shadowColor = `rgba(0,0,0,${shadow.alpha})`;
    c.shadowOffsetX = m.a * shadow.dx + m.c * shadow.dy;
    c.shadowOffsetY = m.b * shadow.dx + m.d * shadow.dy;
    c.shadowBlur = shadow.blur * Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
  } else {
    c.shadowColor = '#0009';
    c.shadowOffsetX = -1.5;
    c.shadowOffsetY = 1.5;
    c.shadowBlur = 1.5;
  }
  const geometry = profile?.geometry;
  c.drawImage(
    glyph,
    geometry ? 244 + (166 - 244) * geometry.scaleX + geometry.dx : 166,
    geometry ? 518 + (440 - 518) * geometry.scaleY + geometry.dy : 440,
    geometry ? 156 * geometry.scaleX : 156,
    geometry ? 156 * geometry.scaleY : 156,
  );
  c.restore();
  return true;
}
