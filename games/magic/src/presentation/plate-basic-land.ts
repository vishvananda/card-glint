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
export function basicLandColor(face: RenderedCardInput): string | undefined {
  const type = /^Basic Land [—–-] (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    face.typeLine ?? '',
  )?.[1];
  return type ? COLORS[type] : undefined;
}

/** MTGJSON encodes some large printed symbols as a lone W/U/B/R/G. Recognize
 * only the matching basic subtype and untouched single paragraph. Custom rules,
 * flavor and explicit paragraph styling must remain visible. */
export function plateBasicSymbol(face: RenderedCardInput): string | null {
  if (face.frameAssetFamily !== 'eighth') return null;
  const color = basicLandColor(face);
  if (!color) return null;
  const raw = face.rulesText ?? '';
  if (![color, `{${color}}`, `{T}: Add {${color}}.`, `({T}: Add {${color}}.)`].includes(raw))
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
