import {
  fourthNonlandHistoricalHash,
  preFourthNonlandSource,
} from '../games/magic/tools/accuracy/fourth-nonland-ancestry.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { createServer } from './magic-vite.mjs';
import {
  fourthNonbasicDelta,
  fourthNonbasicHistoricalHash,
  preFourthNonbasicSource,
  fourthNonbasicAffected,
} from '../games/magic/tools/accuracy/fourth-nonbasic-ancestry.mjs';
import { validateFourthNonbasicData } from '../games/magic/tools/accuracy/fourth-nonbasic-data-check.mjs';
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';
const p = await fourthNonbasicDelta();
assert.equal(await fourthNonlandHistoricalHash(), p.afterRenderer);
assert.equal(await fourthNonbasicHistoricalHash(), p.beforeRenderer);
for (const [file, r] of Object.entries(p.files)) {
  const bytes = await preFourthNonlandSource(file, await fs.readFile(file));
  assert.equal(hash(bytes), r.after);
  assert.equal(hash(await preFourthNonbasicSource(file, bytes)), r.before);
  const unknown = Buffer.concat([bytes, Buffer.from('\n// unknown change\n')]);
  assert.deepEqual(await preFourthNonbasicSource(file, unknown), unknown);
}
const unrelated = Buffer.from('unrelated');
assert.deepEqual(await preFourthNonbasicSource('unrelated.ts', unrelated), unrelated);
const tampered = structuredClone(p),
  profile = 'games/magic/src/calibration/sets/4ed.ts';
tampered.files[profile].afterSource = tampered.files[profile].afterSource.replace(
  'regular: 22.5',
  'regular: 23',
);
tampered.files[profile].after = hash(tampered.files[profile].afterSource);
assert.throws(() => validateFourthNonbasicData(tampered));
const native = JSON.parse(gunzipSync(await fs.readFile(p.native.file))),
  review = JSON.parse(
    await fs.readFile('games/magic/fixtures/accuracy/4ed/nonbasic-body-adoption.json'),
  ),
  artifacts = {};
for (const [key, ref] of Object.entries(review.artifacts)) {
  const z = await fs.readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const raw = gunzipSync(z);
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
  artifacts[key] = key === 'scores' ? JSON.parse(raw) : raw.toString();
}
const scores = artifacts.scores,
  priorReview = JSON.parse(
    await fs.readFile('games/magic/fixtures/accuracy/4ed/basic-body-adoption.json'),
  );
const prior = JSON.parse(gunzipSync(await fs.readFile(priorReview.artifacts.scores.file)));
assert.equal(native.toolHash, hash(artifacts.nativeTool));
assert.equal(scores.toolHash, hash(artifacts.scoreTool));
assert.equal(scores.nonbasicNativeProofHash, p.native.contentSha256);
assert.equal(scores.rendererHash, p.afterRenderer);
assert.deepEqual(scores.metricGraph, prior.metricGraph);
assert.deepEqual(scores.policyGraph, prior.policyGraph);
assert.deepEqual(scores.reuse, { reused: 375, fresh: 3 });
assert.equal(scores.summary.all.improved, 3);
assert.equal(scores.summary.all.regressed, 0);
assert.deepEqual(review.wholeCard, scores.summary.all);
assert.deepEqual(review.landGroup, scores.summary.L);
for (const r of scores.rows) {
  const n = native.rows.find((v) => v.id === r.id),
    old = prior.rows.find((v) => v.id === r.id);
  assert.equal(r.scoreReused, !n.scoped);
  assert.equal(r.beforeNativeHash, old.nativeHash);
  assert.equal(r.beforeNativeHash, n.modes.original.before);
  assert.equal(r.nativeHash, n.modes.original.after);
  assert.equal(r.referenceHash, old.referenceHash);
  assert.equal(r.poseHash, old.poseHash);
  assert.equal(r.regionPlanHash, old.regionPlanHash);
  if (!n.scoped) assert.deepEqual(r.score, old.score);
  else assert(r.delta100 > 10);
}
const other = { printingIds: [native.rows.find((r) => !r.scoped).id] },
  factory = { printingIds: p.wordingIds },
  oasis = { printingIds: [p.ids.find((id) => !p.wordingIds.includes(id))] };
for (const task of ['rules', 'fullCard', 'release']) {
  assert(await fourthNonbasicAffected('4ED', task, false, factory));
  assert(!(await fourthNonbasicAffected('4ed', task, false, other)));
  assert(!(await fourthNonbasicAffected('3ed', task, false, factory)));
  assert.equal(await fourthNonbasicAffected('4ed', task, true, factory), task === 'rules');
  assert(!(await fourthNonbasicAffected('4ed', task, true, oasis)));
}
for (const task of [
  'references',
  'normalization',
  'frameGeometry',
  'frameColor',
  'manaGeometry',
  'headings',
  'artist',
  'footer',
  'stats',
])
  assert(!(await fourthNonbasicAffected('4ed', task, false, factory)));
assert.equal(
  hash(await fs.readFile('games/magic/fixtures/accuracy/4ed/annotations-text-outliers.json')),
  p.annotation.sha256,
);
const annotation = JSON.parse(p.annotation.source),
  id = p.wordingIds[0],
  row = annotation.cards[id],
  server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false } });
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { resolvePrintingWording } = await server.ssrLoadModule('/games/magic/src/index.ts');
  const input = {
    original: {
      typeLine: 'Land',
      rulesText: row.rulesText.replace('Add one colorless', 'Add 1 colorless'),
    },
    oracle: { typeLine: 'Land', rulesText: 'Oracle body is retained.' },
  };
  const result = resolvePrintingWording(id, input, { referenceSha256: row.referenceHash });
  assert.equal(result.provenance.status, 'applied');
  assert.equal(result.wordings.original.rulesText, row.rulesText);
  assert.deepEqual(result.wordings.original.rulesParagraphs, row.paragraphs);
  assert.equal(result.wordings.original.typeLine, 'Land');
  assert.deepEqual(result.wordings.oracle, {
    ...input.oracle,
    rulesParagraphs: [{ role: 'rules', runs: [{ text: input.oracle.rulesText, italic: false }] }],
  });
  const stale = resolvePrintingWording(id, input, { referenceSha256: '0'.repeat(64) });
  assert.equal(stale.provenance.status, 'reference-mismatch');
  const untouched = resolvePrintingWording('ffffffff-ffff-ffff-ffff-ffffffffffff', input);
  assert.deepEqual(stale.wordings, untouched.wordings);
  const entry = {
    card: {
      id,
      set: '4ed',
      name: row.name,
      type_line: 'Land',
      oracle_text: input.oracle.rulesText,
    },
    reference: { sha256: row.referenceHash },
  };
  const accuracy = presentation(entry, {}, { [id]: { originalText: input.original.rulesText } });
  assert.equal(accuracy.face.rulesText, row.rulesText);
  assert.deepEqual(accuracy.face.rulesParagraphs, row.paragraphs);
  assert.throws(
    () => presentation({ ...entry, reference: { sha256: '0'.repeat(64) } }, {}, {}),
    /stale/,
  );
  const { earlyExpansionTextLayout } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-text.ts',
  );
  const face = {
    name: "Mishra's Factory",
    typeLine: 'Land',
    setCode: '4ed',
    land: true,
    colors: [],
  };
  for (const override of [
    { setCode: 'lea' },
    { setCode: '3ed' },
    { setCode: 'fem' },
    { name: 'Plains' },
    { name: 'Island' },
    { typeLine: 'Artifact', land: false },
    { typeLine: 'Enchantment', land: false },
    { frameTemplate: 'future' },
    { frameAssetFamily: 'eighth' },
    { frameStyle: 'modern' },
    { borderColor: 'black' },
    { layout: 'split' },
  ])
    assert.equal(earlyExpansionTextLayout(null, { ...face, ...override }, [], []), null);
} finally {
  await server.close();
}
console.log(
  'Fourth nonbasics:3 shared layouts,1 exact public Original correction,1512 native variants,488 Dark controls,375 score reuses and3 whole-card gains pass.',
);
