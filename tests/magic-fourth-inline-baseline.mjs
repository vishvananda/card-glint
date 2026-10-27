import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const sha = (b) => createHash('sha256').update(b).digest('hex');
const base = new URL('../games/magic/fixtures/accuracy/4ed/', import.meta.url);
const receipt = JSON.parse(await fs.readFile(new URL('inline-baseline-review.json', base)));
assert.equal(receipt.status, 'basic-land-baseline-correction-proposed-nonbasic-transfer-rejected');
assert.equal(receipt.rendererChanges, 0);
const blobs = {};
for (const [name, identity] of Object.entries(receipt.artifacts)) {
  const raw = await fs.readFile(new URL(name, base));
  assert.equal(sha(raw), identity.sha256, name);
  const content = gunzipSync(raw);
  assert.equal(sha(content), identity.contentSha256, name);
  blobs[name] = name.endsWith('.json.gz') ? JSON.parse(content) : content;
}
const study = blobs['inline-baseline-fit.json.gz'];
const report = blobs['inline-baseline-report.json.gz'];
const preview = blobs['inline-baseline-preview.json.gz'];
assert.equal(report.studyHash, receipt.artifacts['inline-baseline-fit.json.gz'].contentSha256);
for (const [name, value] of Object.entries({ fit: study, report, preview })) {
  assert.equal(value.toolHash, sha(blobs['inline-baseline-' + name + '-tool.mjs.gz']));
  assert.equal(value.rendererHash, receipt.rendererHash);
  assert.equal(value.inputHash, receipt.inputHash);
}
assert.equal(study.captureHash, receipt.captureHash);
assert.equal(preview.captureHash, receipt.captureHash);
assert.equal(study.posesHash, receipt.posesHash);
assert.equal(study.refinementHash, receipt.refinementHash);
assert.equal(study.rows.length, 112);
assert.equal(new Set(study.rows.map((r) => r.id)).size, 112);
assert.equal(study.rows.filter((r) => r.basic).length, 15);
const occurrences = study.rows.flatMap((r) => r.symbols);
assert.equal(occurrences.length, 183);
assert.deepEqual(study.search.dy, [-0.15, -0.125, -0.1, -0.075, -0.05, -0.025, 0, 0.025, 0.05]);
for (const s of occurrences) {
  assert.deepEqual(
    s.candidates.map((c) => c.parameters.dy),
    study.search.dy,
  );
  assert(s.candidates.every((c) => Number.isFinite(c.score) && c.score >= 0 && c.score <= 1));
}
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
for (const [basic, key] of [
  [true, 'basicsMinusTwoPixelsAtSize20'],
  [false, 'nonbasicsSameRelativeOffset'],
]) {
  const rows = study.rows.filter((r) => r.basic === basic);
  const scores = rows.map((r) => ({
    before: mean(r.symbols.map((s) => s.candidates.find((c) => c.parameters.dy === 0).score)) * 100,
    after:
      mean(r.symbols.map((s) => s.candidates.find((c) => c.parameters.dy === -0.1).score)) * 100,
  }));
  const all = rows.flatMap((r) =>
    r.symbols.map((s) => ({
      before: s.candidates.find((c) => c.parameters.dy === 0).score,
      after: s.candidates.find((c) => c.parameters.dy === -0.1).score,
    })),
  );
  const result = receipt.results[key];
  assert(Math.abs(mean(scores.map((r) => r.before)) - result.cardMeanBefore100) < 1e-10);
  assert(Math.abs(mean(scores.map((r) => r.after)) - result.cardMeanAfter100) < 1e-10);
  assert.equal(all.filter((s) => s.after > s.before + 1e-12).length, result.gains);
  assert.equal(all.filter((s) => s.after < s.before - 1e-12).length, result.losses);
  assert.equal(rows.length, basic ? 15 : 97);
}
assert.equal(receipt.results.basicsMinusTwoPixelsAtSize20.losses, 0);
assert.equal(receipt.results.basicsMinusTwoPixelsAtSize20.gains, 30);
assert(
  receipt.results.nonbasicsSameRelativeOffset.cardMeanAfter100 <
    receipt.results.nonbasicsSameRelativeOffset.cardMeanBefore100,
);
assert.equal(preview.rows.length, 7);
assert.deepEqual(
  preview.rows.map((r) => r.name),
  ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Sunken City', 'Stasis'],
);
for (const row of preview.rows) {
  const r = study.rows.find((r) => r.id === row.id);
  assert(r);
  assert.equal(row.referenceHash, r.referenceHash);
  assert.equal(row.modes.current.sha256, r.nativeHash);
  assert.equal(row.modes.current.changedPixels, 0);
  assert(row.modes.up.changedPixels > 0);
  assert.deepEqual(row.modes.current.symbols, row.modes.up.symbols);
  assert(row.modes.current.symbols.every((s) => JSON.stringify(s.matrix) === '[1.5,0,0,1.5,0,0]'));
}
console.log(
  'Fourth inline baseline:112 exact native controls,183 occurrences,30 basic-symbol gains,97 nonbasic controls rejecting transfer,and7 isolated visual prototypes;no renderer adoption.',
);
