import { access } from 'node:fs/promises';
import { cacheRoot, outputRoot, readJson, writeJson, mapLimit } from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';

const output = `${outputRoot}/${process.argv[2] ?? 'prepare-source-v1'}/source.json`;
try {
  await access(output);
  throw Error('Prepared source snapshot exists; choose a new label.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const snapshot = await readJson(`${cacheRoot}/rollout/sets/sos.json`);
const cards = (
  await Promise.all(snapshot.pages.map(async (p) => JSON.parse(await readObject(p)).data))
).flat();
const selected = cards.filter(
  (c) =>
    c.layout === 'prepare' &&
    c.lang === 'en' &&
    c.games.includes('paper') &&
    c.finishes.includes('nonfoil') &&
    !c.promo &&
    !c.full_art &&
    c.border_color === 'black' &&
    !(c.frame_effects ?? []).some((e) =>
      ['showcase', 'extendedart', 'inverted', 'borderless'].includes(e),
    ),
);
if (!selected.length) throw Error('Empty Prepared cohort.');
const wording = await cachedFetch('https://mtgjson.com/api/v5/SOS.json');
const records = JSON.parse(await readObject(wording)).data.cards;
const entries = await mapLimit(selected, 2, async (card) => {
  if (card.card_faces?.length !== 2 || !card.image_uris?.png || !card.image_uris?.art_crop)
    throw Error(`Incomplete Prepared physical face: ${card.name}`);
  const reference = await cachedFetch(card.image_uris.png);
  const art = await cachedFetch(card.image_uris.art_crop);
  const originals = card.card_faces.map((face) => {
    const found = records.filter(
      (r) => r.identifiers?.scryfallId === card.id && r.faceName === face.name,
    );
    if (found.length !== 1) throw Error(`Ambiguous Prepared source: ${face.name}`);
    return found[0];
  });
  console.log(card.collector_number, card.name);
  return { card, reference, art, originals };
});
await writeJson(output, {
  schemaVersion: 1,
  createdAt: new Date().toISOString(),
  set: 'sos',
  pages: snapshot.pages,
  wording,
  entries,
});
