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
export function basicLandColor(face: Pick<RenderedCardInput, 'typeLine'>): string | undefined {
  const type = /^Basic (?:Snow )?Land [—–-] (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    face.typeLine ?? '',
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

/** Source padding is part of the glyph; retain one common size and center. */
export function paintBasicLandSymbol(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: ReadonlyMap<string, ImageBitmap>,
): boolean {
  const url = plateBasicSymbol(face);
  if (!url) return false;
  const glyph = images.get(url);
  if (!glyph) throw Error(`Basic land symbol unavailable: ${url}`);
  c.save();
  c.shadowColor = '#0009';
  c.shadowOffsetX = -1.5;
  c.shadowOffsetY = 1.5;
  c.shadowBlur = 1.5;
  c.drawImage(glyph, 166, 440, 156, 156);
  c.restore();
  return true;
}
