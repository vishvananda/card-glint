// Deterministic development pilot for comparing inherited old-frame defaults.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { cacheRoot, root, hash, writeJson, sourceHash } from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';
import { printingScope, referenceIssue } from './rollout-policy.mjs';
import { printingTextIndex } from './printing-text.mjs';
import { presentation } from './adapter.mjs';
import { fetchComponents } from './components.mjs';
const [set, out] = process.argv.slice(2);
assert(
  ['ice', 'mir', 'usg', 'ons'].includes(set) && out,
  'Usage: old-frame-default-inputs.mjs ice|mir|usg|ons NEW_OUTPUT',
);
await fs.access(out).then(
  () => {
    throw Error('Output already exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const manifestRaw = await fs.readFile(path.join(cacheRoot, 'rollout/sets', set + '.json')),
  manifest = JSON.parse(manifestRaw);
const cards = (
  await Promise.all(manifest.pages.map(async (p) => JSON.parse(await readObject(p)).data))
).flat();
const ordinary = cards.filter(
  (c) =>
    printingScope(c).status === 'ordinary' &&
    c.layout === 'normal' &&
    c.finishes.includes('nonfoil') &&
    !referenceIssue(c),
);
const source = await cachedFetch('https://mtgjson.com/api/v5/' + set.toUpperCase() + '.json'),
  sourceData = JSON.parse(await readObject(source)).data;
const rows = ordinary.map((card) => ({ id: card.id, card })),
  text = printingTextIndex({ set, entries: rows }, sourceData);
const pool = rows.filter((e) => text.cards[e.id] || !e.card.oracle_text);
const bucket = (c) =>
  /\bLand\b/.test(c.type_line)
    ? 'L'
    : /\bArtifact\b/.test(c.type_line)
      ? 'A'
      : c.colors.length === 1
        ? c.colors[0]
        : 'M';
const groups = Object.fromEntries(
  ['W', 'U', 'B', 'R', 'G', 'A', 'M', 'L'].map((k) => [
    k,
    pool.filter((e) => bucket(e.card) === k),
  ]),
);
const selected = [],
  seen = new Set(),
  add = (e) => {
    if (e && !seen.has(e.id)) {
      selected.push(e);
      seen.add(e.id);
    }
  };
const length = (e) =>
  (text.cards[e.id]?.originalText?.length ?? 0) + (e.card.flavor_text?.length ?? 0);
for (const key of ['W', 'U', 'B', 'R', 'G', 'A', 'M']) {
  const group = groups[key].sort((a, b) => length(a) - length(b) || a.id.localeCompare(b.id));
  for (const q of [0, 0.5, 1]) add(group[Math.round((group.length - 1) * q)]);
}
for (const name of ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'])
  add(groups.L.filter((e) => e.card.name === name).sort((a, b) => a.id.localeCompare(b.id))[0]);
const lands = groups.L.filter((e) => !e.card.type_line.includes('Basic')).sort(
  (a, b) => length(a) - length(b) || a.id.localeCompare(b.id),
);
for (const q of [0, 0.5, 1]) add(lands[Math.round((lands.length - 1) * q)]);
selected.sort(
  (a, b) =>
    Number(a.card.collector_number) - Number(b.card.collector_number) || a.id.localeCompare(b.id),
);
const entries = [],
  excluded = [];
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { resolvePrintingWording, resolvePrintingArtist, withCardWording, fromScryfallCard } =
    await server.ssrLoadModule('/games/magic/src/index.ts');
  for (const chosen of selected) {
    const card = chosen.card,
      matches = sourceData.cards.filter(
        (c) => c.language === 'English' && c.identifiers?.scryfallId === card.id,
      );
    assert.equal(matches.length, 1);
    const mtg = matches[0];
    if (!mtg.originalType && !card.printed_type_line) {
      excluded.push({ id: card.id, name: card.name, reason: 'missing-original-type' });
      continue;
    }
    const reference = await cachedFetch(card.image_uris.png),
      art = await cachedFetch(card.image_uris.art_crop);
    const entry = { id: card.id, card, reference, art, category: 'normal', cohort: 'development' };
    const candidateType = card.printed_type_line ?? mtg.originalType;
    const original = presentation(
      entry,
      { [card.id]: { typeLine: candidateType } },
      text.cards,
    ).face;
    const semantic = fromScryfallCard(card),
      base = {
        ...original,
        ...(semantic.frameColors ? { frameColors: semantic.frameColors } : {}),
        canonicalTypeLine: card.type_line,
        land: /\bLand\b/.test(card.type_line),
        artifact: /\bArtifact\b/.test(card.type_line),
        creature: /\bCreature\b/.test(card.type_line),
        legendary: /\bLegendary\b/.test(card.type_line),
      };
    const wordings = resolvePrintingWording(
      card.id,
      { original: base, oracle: { typeLine: card.type_line, rulesText: card.oracle_text ?? '' } },
      { referenceSha256: reference.sha256 },
    );
    assert.notEqual(wordings.provenance.status, 'reference-mismatch');
    const artist = resolvePrintingArtist(card.id, base.artist, {
      referenceSha256: reference.sha256,
    });
    assert.notEqual(artist.provenance.status, 'reference-mismatch');
    const face = withCardWording(
      { ...base, artist: artist.artist },
      wordings.wordings,
      'original',
      { rulesAlignment: 'original', symbolStyle: 'original' },
    );
    Object.assign(face, { colorCalibration: 'set-hsb-v1' });
    entries.push({
      ...entry,
      name: card.name,
      material: bucket(card),
      face,
      wordingEvidence: {
        rules: text.cards[card.id] ? 'mtgjson-original-text' : 'empty-oracle-and-original',
        type: card.printed_type_line ? 'scryfall-printed-type' : 'mtgjson-original-type-candidate',
        provenance: wordings.provenance,
        reviewed: false,
      },
    });
  }
} finally {
  await server.close();
}
assert(entries.length >= 20);
const components = await fetchComponents(entries, {}, (e) => e.face);
await writeJson(out, {
  schema: 1,
  set,
  status: 'development-pilot-not-full-set',
  scope:
    'Deterministic short/median/long printed-body examples per mono color,artifact and multicolor,plus each basic and three nonbasic lands. Nonfoil,ordinary,English paper. Imported Original text/type remains candidate data unless exact-printing review exists. No Oracle fallback for nonempty rules;not a source audit or holdout.',
  selection: {
    method: 'printed-body-length-quantiles-v1',
    sourceCards: cards.length,
    ordinaryNonfoil: ordinary.length,
    wordingEligible: pool.length,
    selected: selected.length,
    retained: entries.length,
    groups: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length])),
    excluded,
  },
  sourceData: { inventoryHash: hash(manifestRaw), pages: manifest.pages, wording: source },
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  entries,
  components,
});
console.log(set, entries.length, entries.map((e) => e.name).join(', '));
