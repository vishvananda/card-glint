import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from 'vite';
import { hash, root } from '../games/magic/tools/accuracy/common.mjs';
const base = root + '/games/magic/fixtures/accuracy/4ed/';
const review = JSON.parse(gunzipSync(await fs.readFile(base + 'original-input-review.json.gz')));
const inputBytes = gunzipSync(await fs.readFile(base + 'flavor-fractional-inputs.json.gz'));
const input = JSON.parse(inputBytes);
const entries = input.entries.filter((e) => e.card.set === '4ed');
const capture = JSON.parse(
  gunzipSync(await fs.readFile(base + 'flavor-fractional-native-capture.json.gz')),
);
assert.equal(review.inputHash, hash(inputBytes));
assert.equal(review.rendererHash, capture.rendererHash);
assert.equal(review.rows.length, 378);
assert.equal(new Set(review.rows.map((r) => r.id)).size, 378);
assert.deepEqual(review.summary, {
  cards: 378,
  eagerExact: 378,
  lazyExact: 378,
  changedInputs: 0,
  missingRuleSources: 0,
  calibrationChunksLoadedByLazy: 0,
});
for (const [file, expected] of Object.entries(review.methodGuards))
  assert.equal(
    hash(await fs.readFile(root + '/' + file)),
    expected,
    file + ' changed; repeat Original input review',
  );
for (const mode of ['lazy', 'eager']) {
  const server = await createServer({
    root,
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  try {
    const api = await server.ssrLoadModule(
      '/games/magic/src/' + (mode === 'lazy' ? 'lazy' : 'index') + '.ts',
    );
    for (const row of review.rows) {
      const e = entries.find((e) => e.id === row.id);
      assert(e);
      assert.equal(row.referenceHash, e.reference.sha256);
      const provided = { oracle: row.providerOracle, original: row.providerOriginal };
      const result =
        mode === 'lazy'
          ? await api.resolveSetPrintingWording('4ed', row.id, provided, {
              referenceSha256: row.referenceHash,
            })
          : api.resolvePrintingWording(row.id, provided, { referenceSha256: row.referenceHash });
      assert.equal(result.provenance.status, 'applied');
      const fresh = JSON.parse(
        JSON.stringify(
          api.withCardWording(e.face, result.wordings, 'original', {
            rulesAlignment: 'original',
            symbolStyle: 'original',
          }),
        ),
      );
      assert.deepEqual(fresh, e.face, mode + ': ' + row.name);
      assert.equal(hash(JSON.stringify(fresh)), row.inputHash);
      assert.equal(hash(fresh.typeLine), row.typeLineHash);
      assert.equal(hash(fresh.rulesText), row.rulesTextHash);
      assert.equal(hash(JSON.stringify(fresh.rulesParagraphs)), row.paragraphsHash);
      assert.equal(hash(JSON.stringify(fresh.rulesAlignment)), row.alignmentHash);
      assert.equal(capture.rows.find((r) => r.id === row.id).modes.original.sha256, row.nativeHash);
    }
    if (mode === 'lazy') assert.deepEqual(api.loadedMagicSets(), []);
  } finally {
    await server.close();
  }
}
console.log(
  'Fourth: all 378 public Original inputs reproduce through eager and lazy APIs; no calibration chunks, changed wording or Oracle sizing fallback.',
);
