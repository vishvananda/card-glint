import { modernPrintingProfile } from './modern-printing-profile.js';
import type { RenderedCardInput } from './face-layout.js';

// Printed denominators are not Scryfall's total set size (which includes extras).
// Verified against ordinary English paper scans; unknown sets require supplied
// legalText and keep their collector number verbatim. Never infer a legal year.
const PRINTINGS: Readonly<
  Record<string, { legal: string; total?: number; format?: 'rarity-first' }>
> = {
  plc: { legal: '™ & © 1993–2007 Wizards of the Coast, Inc.', total: 165 },
  fut: { legal: '™ & © 1993–2007 Wizards of the Coast, Inc.', total: 180 },
  '8ed': { legal: '™ & © 1993–2003 Wizards of the Coast, Inc.', total: 350 },
  m15: { legal: '™ & © 2014 Wizards of the Coast', total: 269 },
  war: { legal: '™ & © 2019 Wizards of the Coast', total: 264 },
  m21: { legal: '™ & © 2020 Wizards of the Coast', total: 274 },
  fdn: { legal: '™ & © 2024 Wizards of the Coast', format: 'rarity-first' },
};

export function printingLegalText(face: RenderedCardInput): string | null {
  if (face.printingElements?.legal?.hidden) return null;
  return face.legalText === undefined
    ? (PRINTINGS[face.setCode?.toLowerCase() ?? '']?.legal ?? null)
    : face.legalText;
}

export function printingCollectorText(face: RenderedCardInput, modern = true): string {
  if (face.printingElements?.collector?.hidden) return '';
  const supplied = face.collectorNumber?.trim();
  // Scryfall splits Eighth's foil scans using a metadata star absent from the printed serial.
  const raw =
    face.setCode?.toLowerCase() === '8ed' ? supplied?.replace(/^(\d+)★$/, '$1') : supplied;
  if (!raw) return '';
  const style = PRINTINGS[face.setCode?.toLowerCase() ?? ''];
  const format = face.collectorFormat ?? style?.format ?? 'number-first';
  const rarity =
    (modern &&
      face.rarity === 'common' &&
      /\bLand\b/.test(face.canonicalTypeLine ?? face.typeLine ?? '') &&
      modernPrintingProfile(face)?.printedLandRarities.includes(raw)) ||
    /^Basic (?:Snow )?Land\b/.test(face.typeLine ?? '')
      ? 'L'
      : (face.rarity ?? 'common')[0]!.toUpperCase();
  if (modern && format === 'rarity-first')
    return `${rarity} ${raw.split('/')[0]!.replace(/^(\d+)/, (n) => n.padStart(4, '0'))}`;
  // Bonus cards beyond the regular numbered set do not print a denominator.
  const numbered = /^\d+$/.test(raw);
  const number = modern && numbered ? raw.padStart(3, '0') : raw;
  const starter = face.setCode?.toLowerCase() === '8ed' && /^S[1-7]$/.test(raw);
  const total =
    face.collectorTotal === undefined ? (starter ? 7 : style?.total) : face.collectorTotal;
  const serial =
    total && (starter || (numbered && Number(raw) <= total)) ? `${number}/${total}` : number;
  return modern ? `${serial} ${rarity}` : serial;
}
