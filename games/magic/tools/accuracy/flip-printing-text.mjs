import { normalizePrintingText } from './printing-text.mjs';

/** Gatherer/MTGJSON sometimes duplicate the complete flip card on both face
 * records. Split only an exact pair, divider and named reverse-face header.
 * No search through Oracle prose, guessed creature types or text truncation. */
export function flipPrintingRecords(card, records) {
  if (card.layout !== 'flip' || card.card_faces?.length !== 2) return records;
  const pair = card.card_faces.map((face) =>
    records.filter(
      (r) =>
        r.identifiers?.scryfallId === card.id &&
        (r.faceName ?? r.name) === face.name &&
        (r.language ?? 'English') === 'English',
    ),
  );
  if (pair.some((matches) => matches.length !== 1)) return records;
  const [front, back] = pair.map((matches) => matches[0]);
  if (front.originalText !== back.originalText || !front.originalText) return records;
  const parts = normalizePrintingText(front.originalText).split(/\n-{3,}\n/);
  const header = parts[1]?.split('\n');
  if (
    parts.length !== 2 ||
    header?.[0] !== card.card_faces[1].name ||
    !header[1] ||
    !/^\S+\/\S+$/.test(header[2] ?? '') ||
    header.length < 4
  )
    throw Error('Ambiguous joined original flip text; review the physical scan');
  const words = (value) => (value ?? '').replace(/[—–-]/g, ' ').replace(/\s+/g, ' ').trim();
  const type =
    [back.originalType, card.card_faces[1].type_line].find(
      (value) => typeof value === 'string' && words(value) === words(header[1]),
    ) ?? header[1];
  return records.map((r) =>
    r === front
      ? { ...r, originalText: parts[0] }
      : r === back
        ? {
            ...r,
            originalText: header.slice(3).join('\n'),
            originalType: type,
            joinedFlipHeader: { name: header[0], type: header[1], stats: header[2] },
          }
        : r,
  );
}
