import type { RenderedCardInput } from './face-layout.js';

// Printed denominators are not Scryfall's total set size (which includes extras).
// Verified against ordinary English paper scans; unknown sets require supplied
// legalText and keep their collector number verbatim. Never infer a legal year.
const PRINTINGS: Readonly<
  Record<string, { legal: string; total?: number; format?: 'rarity-first' }>
> = {
  '8ed': { legal: '™ & © 1993–2003 Wizards of the Coast, Inc.', total: 350 },
  m15: { legal: '™ & © 2014 Wizards of the Coast', total: 269 },
  war: { legal: '™ & © 2019 Wizards of the Coast', total: 264 },
  m21: { legal: '™ & © 2020 Wizards of the Coast', total: 274 },
  fdn: { legal: '™ & © 2024 Wizards of the Coast', format: 'rarity-first' },
};

export function printingLegalText(face: RenderedCardInput): string | null {
  return face.legalText === undefined
    ? (PRINTINGS[face.setCode?.toLowerCase() ?? '']?.legal ?? null)
    : face.legalText;
}

export function printingCollectorText(face: RenderedCardInput, modern = true): string {
  const raw = face.collectorNumber?.trim();
  if (!raw) return '';
  const style = PRINTINGS[face.setCode?.toLowerCase() ?? ''];
  const format = face.collectorFormat ?? style?.format ?? 'number-first';
  const rarity = /^Basic (?:Snow )?Land\b/.test(face.typeLine ?? '')
    ? 'L'
    : (face.rarity ?? 'common')[0]!.toUpperCase();
  if (modern && format === 'rarity-first')
    return `${rarity} ${raw.split('/')[0]!.replace(/^(\d+)/, (n) => n.padStart(4, '0'))}`;
  // Bonus cards beyond the regular numbered set do not print a denominator.
  const numbered = /^\d+$/.test(raw);
  const number = modern && numbered ? raw.padStart(3, '0') : raw;
  const total = style?.total;
  const serial = total && numbered && Number(raw) <= total ? `${number}/${total}` : number;
  return modern ? `${serial} ${rarity}` : serial;
}
