import { preRevisedBodyArtistSource } from '../games/magic/tools/accuracy/revised-body-artist-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import { extendReviewSourceIndex } from '../games/magic/tools/review-source-index.mjs';
import {
  revisedWordingDelta,
  preRevisedWordingSource,
  preRevisedMatrixSource,
  revisedWordingMatrixHistoricalHash,
  revisedWordingHistoricalHash,
  revisedWordingRuntimeCompatible,
  revisedWordingAffected,
} from '../games/magic/tools/accuracy/revised-wording-ancestry.mjs';

const prefix = 'games/magic/fixtures/accuracy/';
const original = { schema: 1, sources: [prefix + 'z.json', prefix + 'retired.json'] };
const next = extendReviewSourceIndex(original, [prefix + 'a.json', prefix + 'z.json']);
assert.deepEqual(next.sources, [...original.sources, prefix + 'a.json']);
assert.deepEqual(original.sources, [prefix + 'z.json', prefix + 'retired.json']);
assert.deepEqual(extendReviewSourceIndex(next, [prefix + 'z.json'], { check: true }), next);
assert.throws(() => extendReviewSourceIndex(original, [prefix + 'a.json'], { check: true }));
assert.throws(() =>
  extendReviewSourceIndex({ schema: 1, sources: [prefix + 'z.json', prefix + 'z.json'] }, []),
);
assert.throws(() => extendReviewSourceIndex(original, [prefix + '../outside.json']));
assert.throws(() => extendReviewSourceIndex(original, ['other-pack/source.json']));

const p = await revisedWordingDelta();
assert.equal(await revisedWordingMatrixHistoricalHash(), p.afterRenderer);
assert.equal(await revisedWordingHistoricalHash(), p.beforeRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const bytes = await readFile(file);
  assert.equal(hash(await preRevisedMatrixSource(file, bytes)), e.after, file);
  const prior = await preRevisedWordingSource(file, bytes);
  assert.equal(hash(prior), e.beforeSource === null ? e.after : e.before, file);
  const foreign = Buffer.concat([bytes, Buffer.from('\n// unknown edit\n')]);
  assert.deepEqual(await preRevisedWordingSource(file, foreign), foreign);
}
for (const set of ['lea', 'leb', '2ed', 'arn', 'atq'])
  assert(await revisedWordingRuntimeCompatible('games/magic/src', p.beforeRenderer, set));
for (const set of ['3ed', '3ED', undefined])
  assert.equal(
    await revisedWordingRuntimeCompatible('games/magic/src', p.beforeRenderer, set),
    false,
  );
assert.equal(
  await revisedWordingRuntimeCompatible('games/magic/src', '0'.repeat(64), 'lea'),
  false,
);
assert.equal(
  await revisedWordingRuntimeCompatible('games/showcase/src', p.beforeRenderer, 'lea'),
  false,
);
assert(revisedWordingAffected('3ed', 'rules'));
assert(revisedWordingAffected('3ed', 'headings', true));
assert.equal(revisedWordingAffected('3ed', 'normalization'), false);
assert.equal(revisedWordingAffected('3ed', 'artist', true), false);
assert.equal(revisedWordingAffected('lea', 'rules'), false);
assert.equal(p.nonRevisedWordingsUnchanged, 2874);
assert.equal(p.artistCreditsUnchanged, 222);
assert.equal(p.unchangedWordingModules.length, 28);
for (const e of p.unchangedWordingModules)
  assert.equal(hash(await preRevisedBodyArtistSource(e.file, await readFile(e.file))), e.sha256);
const native = JSON.parse(
  gunzipSync(await readFile(p.artifacts['runtime-wording-native.json.gz'].file)),
);
assert.equal(native.rows.length, 306);
assert.equal(native.status, 'complete');
assert.deepEqual(native.faults, []);
for (const r of native.rows) assert.equal(r.before, r.after);
console.log(
  'Revised runtime wording:306 native controls,1836 Oracle input controls,2874 unaffected records; stable evidence IDs and exact source history.',
);

const { checkSourceCensus } = await import('../games/magic/tools/accuracy/calibration-census.mjs');
const { revisedOriginalSourceCurrent } = await import(
  '../games/magic/tools/accuracy/revised-wording-ancestry.mjs'
);
const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const set = ledger.sets.find((s) => s.set === '3ed');
assert.equal(
  set.groups.reduce((n, g) => n + g.printings, 0),
  306,
);
for (const group of set.groups) {
  for (const task of ['rules', 'headings']) {
    const item = group.tasks[task].originalInput;
    assert.equal(item.status, 'ready');
    checkSourceCensus(group, item.proof, task);
    assert(await revisedOriginalSourceCurrent(item, group, task));
    const wrong = structuredClone(item);
    wrong.proof.sourceCensus.members[0].nativeFaceHash = '0'.repeat(64);
    assert.equal(await revisedOriginalSourceCurrent(wrong, group, task), false);
    const unguarded = structuredClone(item);
    delete unguarded.guards['games/magic/src/printing/resolve.ts'];
    assert.equal(await revisedOriginalSourceCurrent(unguarded, group, task), false);
    assert.notEqual(group.tasks[task].status, 'validated');
  }
}
