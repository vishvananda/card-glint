import path from 'node:path';
import { cacheRoot, readJson } from './common.mjs';
import { readObject } from './cache.mjs';

/** Source artifacts, not printed characters. Retain rawOriginalText for audits. */
export function normalizePrintingText(text) {
  return text
    .replace(/\\r(?=\n|$)/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\bocT\b/g, '{T}');
}

/** Exact printing IDs only; names alone cannot distinguish historical wording. */
export function printingTextIndex(snapshot, data) {
  if (data.code.toLowerCase() !== snapshot.set.toLowerCase())
    throw Error('MTGJSON set does not match the Scryfall snapshot');
  const cards = {};
  const missing = [];
  for (const entry of snapshot.entries) {
    const matches = data.cards.filter(
      (c) => c.language === 'English' && c.identifiers?.scryfallId === entry.id,
    );
    if (matches.length > 1) throw Error(`Ambiguous printing text: ${entry.card.name}`);
    const card = matches[0];
    if (
      card &&
      (card.name !== entry.card.name ||
        card.number !== entry.card.collector_number ||
        card.setCode.toLowerCase() !== entry.card.set)
    )
      throw Error(`Printing identity mismatch: ${entry.card.name}`);
    if (!card || typeof card.originalText !== 'string') {
      missing.push({
        id: entry.id,
        name: entry.card.name,
        reason: card ? 'missing-original-text' : 'unmatched-printing',
      });
      continue;
    }
    cards[entry.id] = {
      name: card.name,
      number: card.number,
      uuid: card.uuid,
      rawOriginalText: card.originalText,
      // Gatherer's legacy tilted-card tap code, verified against cached scans
      // of Fellwar Stone, Shaper Guildmage and Grindstone. Keep the raw source.
      originalText: normalizePrintingText(card.originalText),
      // Retain for auditing only: this field has modern creature types in old sets.
      originalType: card.originalType ?? null,
    };
  }
  return { cards, missing };
}

/** Local-only optional source; corrupt/stale data fails rather than falling back. */
export async function readPrintingText(snapshot) {
  let manifest;
  try {
    manifest = await readJson(path.join(cacheRoot, 'printing-text', `${snapshot.set}.json`));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  if (manifest.snapshotIdentity !== snapshot.identity)
    throw Error('Printing text belongs to a different Scryfall snapshot; fetch it again');
  const data = JSON.parse((await readObject(manifest.source)).toString('utf8'));
  return { ...manifest, ...printingTextIndex(snapshot, data.data) };
}
