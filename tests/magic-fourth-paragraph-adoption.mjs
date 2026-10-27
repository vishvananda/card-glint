// Public paragraph correction and exact native/data/score ancestry.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from './magic-vite.mjs';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  fourthParagraphDelta,
  fourthParagraphHistoricalHash,
  preFourthParagraphSource,
  fourthParagraphAffected,
} from '../games/magic/tools/accuracy/fourth-paragraph-ancestry.mjs';
import {
  fourthParagraphPaths as P,
  validateFourthParagraphData,
} from '../games/magic/tools/accuracy/fourth-paragraph-data-check.mjs';
import { printedTextOutlierAnnotation } from '../games/magic/tools/accuracy/printed-text-outliers.mjs';
const p = await fourthParagraphDelta(),
  id = p.ids[0];
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
assert.equal(await fourthParagraphHistoricalHash(), p.beforeRenderer);
for (const [file, r] of Object.entries(p.files)) {
  const b = await fs.readFile(file);
  assert.equal(hash(b), r.after);
  assert.equal(hash(await preFourthParagraphSource(file, b)), r.before);
  const unknown = Buffer.concat([b, Buffer.from('\n// unknown edit\n')]);
  assert.deepEqual(await preFourthParagraphSource(file, unknown), unknown);
}
const corrupt = structuredClone(p);
corrupt.files[P.annotation].afterSource = corrupt.files[P.annotation].afterSource.replace(
  'White spells cost',
  'Blue spells cost',
);
corrupt.files[P.annotation].after = hash(corrupt.files[P.annotation].afterSource);
assert.throws(() => validateFourthParagraphData(corrupt));
const review = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/4ed/paragraph-adoption.json'),
);
const native = JSON.parse(gunzipSync(await fs.readFile(p.native.file)));
const a = JSON.parse(p.files[P.annotation].afterSource).cards[id],
  beforeText = a.rulesText.replace('\n', ' ');
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  const { resolveSetPrintingWording } = await server.ssrLoadModule(
    '/games/magic/src/printing/lazy.ts',
  );
  const { resolvePrintingWording } = await server.ssrLoadModule(
    '/games/magic/src/printing/resolve.ts',
  );
  const input = {
    original: { typeLine: 'Enchantment', rulesText: beforeText },
    oracle: {
      typeLine: 'Enchantment',
      rulesText:
        'White spells cost {3} more to cast.\nActivated abilities of white enchantments cost {3} more to activate.',
    },
  };
  const frozen = JSON.stringify(input),
    options = { referenceSha256: a.referenceHash };
  const lazy = await resolveSetPrintingWording('4ED', id, input, options),
    eager = resolvePrintingWording(id, input, options);
  assert.deepEqual(lazy, eager);
  assert.equal(JSON.stringify(input), frozen);
  assert.equal(eager.provenance.status, 'applied');
  assert.equal(eager.wordings.original.rulesText, a.rulesText);
  assert.deepEqual(eager.wordings.original.rulesParagraphs, a.paragraphs);
  assert.equal(eager.wordings.oracle.rulesText, input.oracle.rulesText);
  const stale = resolvePrintingWording(id, input, { referenceSha256: '0'.repeat(64) });
  assert.equal(stale.provenance.status, 'reference-mismatch');
  assert.equal(stale.wordings.original.rulesText, beforeText);
  const missing = resolvePrintingWording(id, { oracle: input.oracle }, options);
  assert.equal(missing.wordings.original, undefined);
  const entry = { card: { id, set: '4ed', name: 'Gloom' }, reference: { sha256: a.referenceHash } };
  assert.deepEqual(printedTextOutlierAnnotation(entry), a);
  assert.throws(
    () => printedTextOutlierAnnotation({ ...entry, reference: { sha256: '0'.repeat(64) } }),
    /stale/,
  );
} finally {
  await server.close();
}
const artifacts = {};
for (const [key, ref] of Object.entries(review.artifacts)) {
  const z = await fs.readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const raw = gunzipSync(z);
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
  artifacts[key] = key === 'scores' ? JSON.parse(raw) : raw.toString();
}
const s = artifacts.scores;
assert.equal(s.toolHash, hash(artifacts.scoreTool));
assert.equal(native.toolHash, hash(artifacts.nativeTool));
assert.equal(s.paragraphNativeProofHash, p.native.contentSha256);
assert.equal(s.rendererHash, p.afterRenderer);
assert.deepEqual(s.reuse, { reused: 377, fresh: 1 });
assert.deepEqual(review.wholeCard, s.summary.all);
assert.deepEqual(review.nativeCounts, native.counts);
assert.equal(s.summary.all.improved, 1);
assert.equal(s.summary.all.regressed, 0);
const priorReview = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/4ed/nonland-body-adoption.json'),
);
const prior = JSON.parse(gunzipSync(await fs.readFile(priorReview.artifacts.scores.file)));
assert.deepEqual(s.metricGraph, prior.metricGraph);
assert.deepEqual(s.policyGraph, prior.policyGraph);
for (const r of s.rows) {
  const old = prior.rows.find((o) => o.id === r.id),
    n = native.rows.find((n) => n.id === r.id);
  assert.equal(r.beforeNativeHash, old.nativeHash);
  assert.equal(r.nativeHash, n.modes.original.after);
  assert.equal(r.referenceHash, old.referenceHash);
  assert.equal(r.poseHash, old.poseHash);
  assert.equal(r.regionPlanHash, old.regionPlanHash);
  assert.equal(r.scoreReused, r.id !== id);
  if (r.id !== id) {
    assert.deepEqual(r.score, old.score);
    assert.equal(r.inputHash, old.inputHash);
  } else {
    assert(r.delta100 > 15);
    assert.notEqual(r.inputHash, old.inputHash);
  }
}
for (const task of ['rules', 'fullCard', 'release']) {
  assert(await fourthParagraphAffected('4ed', task, false, { printingIds: [id] }));
  assert.equal(
    await fourthParagraphAffected('4ed', task, true, { printingIds: [id] }),
    task === 'rules',
  );
  assert(!(await fourthParagraphAffected('4ed', task, false, { printingIds: ['other'] })));
  assert(!(await fourthParagraphAffected('3ed', task, false, { printingIds: [id] })));
}
for (const task of [
  'headings',
  'frameGeometry',
  'frameColor',
  'normalization',
  'manaGeometry',
  'manaColor',
  'artist',
  'stats',
  'footer',
  'setSymbol',
])
  assert(!(await fourthParagraphAffected('4ed', task, false, { printingIds: [id] })));
assert.equal(review.status, 'original-paragraph-integrated-full-set-audit-open');
console.log(
  'Fourth paragraph: exact public/lazy correction,unchanged Oracle,1512 native variants,377 score reuses,strict data ancestry and15-point Gloom gain pass.',
);
