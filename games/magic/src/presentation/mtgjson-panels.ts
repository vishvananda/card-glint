import { providerText, type ProviderRecord } from './provider-card.js';

/** Gatherer-derived records sometimes repeat both panels' printed wording.
 * Split only an agreeing pair with one explicit delimiter; ambiguity is an error. */
export function mtgjsonOriginalPanels(records: readonly ProviderRecord[], layout: string) {
  const original = records.map((row) => ({ type: row.originalType, text: row.originalText }));
  if (
    records.length !== 2 ||
    !['split', 'aftermath', 'adventure', 'prepare', 'flip'].includes(layout)
  )
    return original;
  const normalize = (value: unknown) => providerText(value).replace(/\r\n?/g, '\n');
  const texts = records.map((row) => normalize(row.originalText));
  if (layout === 'flip') {
    if (!texts.some((text) => /\n-{3,}\n/.test(text))) return original;
    const parts = texts[0]!.split(/\n-{3,}\n/),
      header = parts[1]?.split('\n');
    if (
      texts[0] !== texts[1] ||
      parts.length !== 2 ||
      !header ||
      header[0] !== records[1]!.faceName ||
      !header[1] ||
      !/^\S+\/\S+$/.test(header[2] ?? '') ||
      header.length < 4
    )
      throw Error('Ambiguous joined MTGJSON original flip text.');
    const words = (value: unknown) =>
      normalize(value).replace(/[—–-]/g, ' ').replace(/\s+/g, ' ').trim();
    const type =
      [records[1]!.originalType, records[1]!.type].find(
        (v) => typeof v === 'string' && words(v) === words(header[1]),
      ) ?? header[1];
    return [
      { type: original[0]!.type, text: parts[0] },
      { type, text: header.slice(3).join('\n') },
    ];
  }
  if (!texts.some((text) => /\s+\/\/\s+/.test(text))) return original;
  const parts = texts[0]!.split(/\s+\/\/\s+/);
  if (texts[0] !== texts[1] || parts.length !== 2)
    throw Error('Ambiguous joined MTGJSON original panel text.');
  return records.map((row, i) => {
    const index = layout === 'adventure' ? 1 - i : i;
    let text = parts[index]!.trim();
    const heading = [row.faceName ?? row.name, row.manaCost, row.originalType];
    if (index === 1 && heading.every((part) => typeof part === 'string')) {
      const prefix = heading.join('\n') + '\n';
      if (text.startsWith(prefix)) text = text.slice(prefix.length);
    }
    const type = providerText(row.originalType);
    if (index === 1 && type && text.startsWith(type + '\n')) text = text.slice(type.length + 1);
    // Repair only duplicated bare spell/Adventure labels with agreeing per-face
    // semantic types. Historical creature subtypes must never be guessed.
    const ownType = providerText(row.type);
    const duplicated = records[0]!.originalType === records[1]!.originalType;
    const spell = /^(Instant|Sorcery)$/.test(type) && /^(Instant|Sorcery)$/.test(ownType);
    const adventure =
      layout === 'adventure' && /^(Instant|Sorcery)\s*[—–-]\s*Adventure$/.test(ownType);
    return { text, type: duplicated && (spell || adventure) ? ownType : row.originalType };
  });
}
