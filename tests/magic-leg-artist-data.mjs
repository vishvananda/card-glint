import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from './magic-vite.mjs';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  legArtistDelta,
  legArtistHistoricalHash,
  preLegArtistDataSource,
  legArtistAffected,
} from '../games/magic/tools/accuracy/leg-artist-data-ancestry.mjs';
const p = await legArtistDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
assert.equal(await legArtistHistoricalHash(), p.beforeRenderer);
assert.deepEqual(p.summary, {
  existingArtists: 228,
  addedArtists: 40,
  wordingPrintings: 3180,
  reviewedCredits: 310,
});
for (const [file, e] of Object.entries(p.files)) {
  const current = await fs.readFile(file);
  assert.equal(hash(current), e.after);
  assert.equal(hash(await preLegArtistDataSource(file, current)), e.before);
  const unknown = Buffer.concat([current, Buffer.from('\n// unknown change\n')]);
  assert.deepEqual(await preLegArtistDataSource(file, unknown), unknown);
}
assert.equal(hash(await fs.readFile(p.annotation.file)), p.annotation.sha256);
assert.equal(hash(await fs.readFile(p.review.file)), p.review.sha256);
const annotation = JSON.parse(p.annotation.source),
  review = JSON.parse(p.review.source),
  native = JSON.parse(gunzipSync(await fs.readFile(p.native.file)));
assert.equal(hash(p.toolSources['printing-artist-native-review.mjs']), native.toolHash);
for (const [n, h] of Object.entries(native.modules)) assert.equal(hash(p.toolSources[n]), h);
assert.equal(review.rows.length, 310);
assert.equal(review.rows.filter((r) => r.changed).length, 40);
assert.equal(native.artistMetric.measured, 40);
assert(native.artistMetric.after100 > native.artistMetric.before100);
assert.equal(native.artistMetric.gains, 34);
assert.equal(native.artistMetric.losses, 6);
for (const r of native.rows) {
  const changed = Boolean(annotation.cards[r.id]);
  assert.equal(r.changedArtist, changed);
  for (const [mode, v] of Object.entries(r.modes)) {
    assert.equal(v.changed, changed && mode !== 'etching');
    assert.equal(v.keyChanged, v.changed);
    assert.equal(v.alpha, 0);
    assert.equal(v.outside, 0);
  }
}
const changedId = p.ids[0],
  unchangedId = review.rows.find((r) => !r.changed).id;
assert(await legArtistAffected('leg', 'artist', true, { printingIds: [changedId] }));
assert(await legArtistAffected('LEG', 'fullCard', false, { printingIds: [changedId] }));
assert(!(await legArtistAffected('leg', 'artist', false, { printingIds: [unchangedId] })));
assert(!(await legArtistAffected('leg', 'rules', false)));
assert(!(await legArtistAffected('lea', 'artist', false)));
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { resolvePrintingArtist, withCardWording } = await server.ssrLoadModule(
    '/games/magic/src/index.ts',
  );
  for (const r of review.rows) {
    const result = resolvePrintingArtist(r.id, r.providerArtist, {
      referenceSha256: r.referenceHash,
    });
    assert.equal(result.artist, r.printedArtist);
    assert.equal(result.provenance.status, r.changed ? 'applied' : 'unreviewed');
    if (r.changed) {
      const rejected = resolvePrintingArtist(r.id, r.providerArtist, {
        referenceSha256: '0'.repeat(64),
      });
      assert.equal(rejected.provenance.status, 'reference-mismatch');
      assert.equal(rejected.artist, r.providerArtist);
      assert.equal(result.provenance.corrections[0].before, r.providerArtist);
      const face = {
        name: r.name,
        setCode: 'leg',
        artist: result.artist,
        typeLine: 'Summon Legend',
        rulesText: '',
      };
      for (const mode of ['original', 'oracle'])
        for (const symbolStyle of ['original', 'modern']) {
          const f = withCardWording(
            face,
            { original: face, oracle: { typeLine: 'Legendary Creature', rulesText: '' } },
            mode,
            { symbolStyle },
          );
          assert.equal(f.artist, r.printedArtist);
        }
    }
  }
  assert.equal(
    resolvePrintingArtist('00000000-0000-0000-0000-000000000000', 'Melissa A. Benson').artist,
    'Melissa A. Benson',
  );
} finally {
  await server.close();
}
const approval = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/leg/artist-data-review.json'),
);
const artifacts = {};
for (const [key, ref] of Object.entries(approval.artifacts)) {
  const z = await fs.readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const bytes = gunzipSync(z);
  assert.equal(hash(bytes), ref.contentSha256);
  artifacts[key] = key === 'scores' ? JSON.parse(bytes) : bytes.toString();
}
const scored = artifacts.scores;
assert.equal(scored.toolHash, hash(artifacts.scoreTool));
assert.equal(scored.artistNativeProofHash, p.native.contentSha256);
assert.deepEqual(scored.reuse, { reused: 270, fresh: 40 });
assert.equal(scored.rows.length, 310);
assert.equal(scored.summary.all.rankedCards, 308);
assert.equal(scored.summary.all.current100, scored.summary.all.before100);
for (const row of scored.rows) {
  const n = native.rows.find((n) => n.id === row.id);
  assert.equal(row.scoreReused, !n.changedArtist);
  assert.equal(row.nativeHash, n.modes.original.after);
  assert.equal(row.beforeNativeHash, n.modes.original.before);
}
console.log(
  'Legends310-credit census promotes exactly40 scan-bound strings through the public resolver;1240 native variants isolate120 face/key changes,all etchings and228 existing credits/3180 wording records remain exact,and unrelated calibration scopes retain history.',
);
