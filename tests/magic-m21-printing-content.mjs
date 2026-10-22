import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
const read = async (file) =>
  JSON.parse(await readFile('games/magic/fixtures/accuracy/m21/' + file));
const types = await read('annotations-type-line.json'),
  credits = await read('annotations-artist-credit.json');
assert.equal(Object.keys(types.cards).length, 297);
assert.equal(Object.keys(credits.cards).length, 13);
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
});
try {
  const { resolvePrintingWording, resolvePrintingArtist } = await server.ssrLoadModule(
    '/games/magic/src/index.ts',
  );
  const { resolveWithCorrections } = await server.ssrLoadModule(
    '/games/magic/src/printing/resolve.ts',
  );
  const { printingCorrections } = await server.ssrLoadModule(
    '/games/magic/src/printing/corrections.ts',
  );
  const { reviewSources } = await server.ssrLoadModule('/games/magic/src/data/review-metadata.ts');
  const typeEvidence = reviewSources.indexOf(
    'games/magic/fixtures/accuracy/m21/annotations-type-line.json',
  );
  assert(typeEvidence >= 0);
  const priorBodies = Object.fromEntries(
    Object.entries(printingCorrections).map(([id, rows]) => [
      id,
      rows.filter((r) => r.evidence !== typeEvidence),
    ]),
  );
  const input = {
    original: {
      name: 'Printed name',
      typeLine: 'Provider type',
      rulesText: 'Printed rules.',
      flavorText: 'Printed flavor.',
    },
    oracle: {
      name: 'Oracle name',
      typeLine: 'Creature — Elemental',
      rulesText: 'Oracle rules.',
      flavorText: 'Oracle flavor.',
    },
  };
  const snapshot = structuredClone(input);
  for (const [id, row] of Object.entries(types.cards)) {
    assert.deepEqual(row.reviewedFields, ['typeLine']);
    assert.notEqual(row.reviewed, true);
    const resolved = resolvePrintingWording(id, input, { referenceSha256: row.referenceHash });
    assert.equal(resolved.provenance.status, 'applied', row.name);
    assert.equal(resolved.wordings.original.typeLine, row.typeLine, row.name);
    const bodyBaseline = resolveWithCorrections(priorBodies, id, input, {
      referenceSha256: row.referenceHash,
    });
    assert.deepEqual(
      { ...resolved.wordings.original, typeLine: undefined },
      { ...bodyBaseline.wordings.original, typeLine: undefined },
      'Existing reviewed body must be retained: ' + row.name,
    );
    assert.equal(resolved.wordings.oracle.typeLine, input.oracle.typeLine);
    assert.equal(resolved.wordings.oracle.rulesText, 'Oracle rules.\nOracle flavor.');
    const stale = resolvePrintingWording(id, input, { referenceSha256: '0'.repeat(64) });
    assert.equal(stale.provenance.status, 'reference-mismatch');
    assert.equal(stale.wordings.original.typeLine, 'Provider type');
    assert.equal(
      resolvePrintingWording(id, { oracle: input.oracle }).provenance.status,
      'missing-original',
    );
  }
  for (const [id, row] of Object.entries(credits.cards)) {
    assert.deepEqual(row.reviewedFields, ['artist']);
    assert.notEqual(row.reviewed, true);
    const result = resolvePrintingArtist(id, row.providerArtist, {
      referenceSha256: row.referenceHash,
    });
    assert.equal(result.provenance.status, 'applied');
    assert.equal(result.artist, row.artist);
    const stale = resolvePrintingArtist(id, row.providerArtist, {
      referenceSha256: '0'.repeat(64),
    });
    assert.equal(stale.provenance.status, 'reference-mismatch');
    assert.equal(stale.artist, row.providerArtist);
  }
  assert.deepEqual(input, snapshot);
  assert.equal(
    Object.values(types.cards).find((r) => r.name === 'Massacre Wurm').typeLine,
    'Creature — Wurm',
  );
  assert.equal(
    Object.values(types.cards).find((r) => r.name === 'Mazemind Tome').typeLine,
    'Artifact',
  );
} finally {
  await server.close();
}
console.log(
  'M21:297 original-only physical types and13 exact artist credits; stale scans, missing originals and Oracle preserved.',
);
