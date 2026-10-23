// Prepare a complete ordinary nonfoil census from cached printing sources.
// Foil-only printings stay listed in the inventory; their pigment is not fitted.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { root, cacheRoot, readJson, writeJson, hash, sourceHash } from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';
import { printingTextIndex } from './printing-text.mjs';
import { presentation } from './adapter.mjs';
import { fetchComponents } from './components.mjs';
const [set, output, assetOption] = process.argv.slice(2);
assert([undefined, '--fetch-assets'].includes(assetOption), 'Unknown input option');
assert(output && /^[a-z0-9]{2,8}$/.test(set), 'Usage: printing-calibration-inputs.mjs SET OUTPUT');
const snapshot = await readJson(path.join(cacheRoot, 'sets', set + '.json'));
assert(snapshot.complete && snapshot.set === set);
const source = await cachedFetch('https://mtgjson.com/api/v5/' + set.toUpperCase() + '.json', {
  offline: true,
});
const text = printingTextIndex(snapshot, JSON.parse(await readObject(source)).data);
const files = (await readdir(path.join(root, 'games/magic/fixtures/accuracy', set)))
  .filter((f) => /^annotations(?:-[a-z0-9-]+)?\.json$/.test(f))
  .sort();
const reviews = await Promise.all(
  files.map(async (file) => {
    const bytes = await readFile(path.join(root, 'games/magic/fixtures/accuracy', set, file));
    return { file, sha256: hash(bytes), data: JSON.parse(bytes) };
  }),
);
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const entries = [],
  excluded = [],
  unresolved = [];
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { resolvePrintingWording, resolvePrintingArtist, withCardWording, fromScryfallCard } =
    await server.ssrLoadModule('/games/magic/src/index.ts');
  for (const e of snapshot.entries) {
    if (!e.card.finishes.includes('nonfoil')) {
      excluded.push({ id: e.id, name: e.card.name, reason: 'foil-only-pigment-excluded' });
      continue;
    }
    assert(!e.issue && e.reference && e.art, e.card.name + ': unavailable reference');
    await readObject(e.reference);
    await readObject(e.art);
    const annotation = {};
    for (const r of reviews) {
      const a = r.data.cards?.[e.id];
      if (!a) continue;
      assert.equal(a.referenceHash, e.reference.sha256, 'Stale printing review: ' + e.id);
      const fields = [
        ...new Set([...(annotation.reviewedFields ?? []), ...(a.reviewedFields ?? [])]),
      ];
      Object.assign(annotation, a, { reviewedFields: fields });
    }
    const adapted = presentation(e, { [e.id]: annotation }, text.cards);
    // Use the public physical-palette conversion as well as the public wording
    // resolver. Historical study adapters remain frozen for their old receipts.
    const palette = fromScryfallCard(e.card).frameColors;
    const original = {
      ...adapted.face,
      ...(adapted.face.frameColors === undefined && palette ? { frameColors: palette } : {}),
    };
    const resolved = resolvePrintingWording(
      e.id,
      { original, oracle: { typeLine: e.card.type_line, rulesText: e.card.oracle_text ?? '' } },
      { referenceSha256: e.reference.sha256 },
    );
    const artist = resolvePrintingArtist(e.id, original.artist, {
      referenceSha256: e.reference.sha256,
    });
    assert.notEqual(resolved.provenance.status, 'reference-mismatch');
    assert.notEqual(artist.provenance.status, 'reference-mismatch');
    if (
      !text.cards[e.id] &&
      e.card.oracle_text &&
      !annotation.reviewed &&
      !resolved.provenance.corrections.some((c) => c.fields.includes('rulesText'))
    ) {
      unresolved.push({ id: e.id, name: e.card.name, reason: 'nonempty-oracle-fallback' });
      continue;
    }
    const face = withCardWording(
      { ...original, ...resolved.wordings.original, artist: artist.artist },
      {
        original: { ...original, ...resolved.wordings.original },
        oracle: { typeLine: e.card.type_line, rulesText: e.card.oracle_text ?? '' },
      },
      'original',
      { rulesAlignment: 'original', symbolStyle: 'original' },
    );
    Object.assign(face, {
      colorCalibration: 'set-hsb-v1',
      creature: /\bCreature\b/.test(e.card.type_line),
      artifact: /\bArtifact\b/.test(e.card.type_line),
      land: /\bLand\b/.test(e.card.type_line),
      legendary: /\bLegendary\b/.test(e.card.type_line),
    });
    entries.push({
      ...e,
      face,
      wordingEvidence: {
        rules: text.cards[e.id]
          ? 'mtgjson-original-text'
          : annotation.reviewed
            ? 'scan-reviewed'
            : 'printing-empty',
        type:
          resolved.provenance.corrections.some((c) => c.fields.includes('typeLine')) ||
          adapted.reviewedFields.includes('typeLine')
            ? 'scan-reviewed'
            : e.card.printed_type_line
              ? 'printing-reference'
              : 'oracle-type-pending-scan-review',
        mtgjsonOriginalType: text.cards[e.id]?.originalType ?? null,
        wording: resolved.provenance,
        artist: artist.provenance,
      },
    });
  }
} finally {
  await server.close();
}
assert.equal(unresolved.length, 0, JSON.stringify(unresolved));
const components = await fetchComponents(
  entries,
  { offline: assetOption !== '--fetch-assets' },
  (e) => e.face,
);
await writeJson(output, {
  schema: 1,
  set,
  inventory: snapshot.entries.length,
  snapshotIdentity: snapshot.identity,
  referenceIdentity: snapshot.referenceIdentity,
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  sourceData: {
    wording: source,
    annotations: reviews.map(({ file, sha256 }) => ({ file, sha256 })),
  },
  toolHash: hash(await readFile(new URL(import.meta.url))),
  excluded,
  unresolved,
  entries,
  components,
});
console.log(
  JSON.stringify({
    set,
    inventory: snapshot.entries.length,
    nonfoil: entries.length,
    excluded: excluded.length,
    unresolved: unresolved.length,
  }),
);
