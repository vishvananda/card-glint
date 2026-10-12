import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, hash, fixtureRoot, outputRoot, atomicWrite } from './common.mjs';
import { normalize } from './pixels.mjs';
import { lineText, wrapping } from './typography-metrics.mjs';

const fixture = path.join(fixtureRoot, '3ed');
const plan = await readJson(path.join(fixture, 'text-corrections-plan.json'));
const base = path.join(outputRoot, '3ed');
const before = await readJson(path.join(base, plan.baselineRun, 'capture.json'));
const after = await readJson(path.join(base, 'revised-text/capture.json'));
const oldMetrics = await readJson(path.join(base, plan.baselineRun, 'metrics.json'));
const metrics = await readJson(path.join(base, 'revised-text/metrics.json'));
assert.equal(before.rendererHash, plan.baselineRendererHash);
assert.equal(after.rendererHash, before.rendererHash);
assert.equal(metrics.rendererHash, after.rendererHash);
assert.equal(metrics.metricSource, oldMetrics.metricSource);
assert.equal(metrics.alignmentHash, oldMetrics.alignmentHash);
assert.equal(after.complete, true);
assert.equal(after.results.length, 306);
const results = [],
  articles = [];
let unchanged = 0;
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c],
  );
for (const card of after.results) {
  const old = before.results.find((r) => r.id === card.id);
  const correction = plan.reviewed.find((r) => r.id === card.id);
  assert.equal(card.issue, null);
  assert.equal(card.layout?.overflow ?? false, false);
  assert.equal(card.images.reference.sha256, old.images.reference.sha256);
  assert.equal(card.inputHash !== old.inputHash, Boolean(correction), card.name);
  for (const [run, record] of [
    [plan.baselineRun, old],
    ['revised-text', card],
  ])
    for (const tier of ['reference', 'inspect', 'table'])
      assert.equal(
        hash(await readFile(path.join(base, run, record.images[tier].file))),
        record.images[tier].sha256,
      );
  if (!correction) {
    assert.deepEqual(card.layout, old.layout);
    for (const tier of ['inspect', 'table'])
      assert.equal(card.images[tier].sha256, old.images[tier].sha256);
    unchanged++;
    continue;
  }
  assert.equal(old.inputHash, correction.previousInputHash);
  assert.equal(card.images.reference.sha256, correction.referenceHash);
  assert.equal(card.contentStatus, 'scan-reviewed');
  const scores = Object.fromEntries(
    ['inspect', 'table'].map((tier) => {
      const body = (report) =>
        report.results
          .find((r) => r.id === card.id)
          .comparisons[tier].regions.find((r) => r.id === 'body');
      return [tier, { before: body(oldMetrics).edgeF1[1], after: body(metrics).edgeF1[1] }];
    }),
  );
  const wraps = (record) =>
    wrapping(
      correction.scanLines,
      record.layout.lines.map(lineText),
      record.face.rulesParagraphs.map((p) => p.runs.map((r) => r.text).join('')),
    );
  results.push({
    ...correction,
    inputHash: card.inputHash,
    scores,
    beforeWrapping: wraps(old),
    afterWrapping: wraps(card),
  });
  const images = [];
  for (const [run, entry] of [
    [plan.baselineRun, old.images.reference],
    [plan.baselineRun, old.images.inspect],
    ['revised-text', card.images.inspect],
  ]) {
    const im = normalize(PNG.sync.read(await readFile(path.join(base, run, entry.file))));
    const crop = new PNG({ width: 390, height: 205 });
    for (let y = 0; y < 205; y++)
      crop.data.set(
        im.data.subarray(((400 + y) * 488 + 50) * 4, ((400 + y) * 488 + 440) * 4),
        y * 390 * 4,
      );
    images.push('data:image/png;base64,' + PNG.sync.write(crop).toString('base64'));
  }
  articles.push(
    `<article><h2>${escape(card.name)}</h2><p>${escape(correction.note)}</p><p>Body F1 ${scores.inspect.before.toFixed(3)} → ${scores.inspect.after.toFixed(3)}; printed wrapping ${wraps(card).exactWrapping ? 'matches' : 'still differs'}.</p><div>${images.map((src, i) => `<figure><figcaption>${['Scan', 'Previous input', 'Corrected input'][i]}</figcaption><img src="${src}" alt="${escape(card.name)}"></figure>`).join('')}</div></article>`,
  );
}
assert.equal(results.length, 4);
assert.equal(unchanged, 302);
await writeJson(path.join(fixture, 'text-corrections-measurement.json'), {
  schemaVersion: 1,
  rendererHash: after.rendererHash,
  alignmentHash: metrics.alignmentHash,
  comparisonSourceHash: metrics.metricSource,
  auditSourceHash: hash(await readFile(new URL(import.meta.url))),
  corrected: results.length,
  unchanged,
  checkedImages: 1836,
  coverage: metrics.summary,
  results,
  note: 'Same renderer and frozen alignment. Changes are printing input/style corrections, not renderer accuracy gains. All other302 faces retain identical inputs, layout and both full PNGs. Full source and image hashes checked. Wrapping normalizes whitespace/quotes and does not certify stroke shape.',
});
await atomicWrite(
  path.join(base, 'revised-text/index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revised printed text corrections</title><style>body{background:#1c2024;color:#e4e8ea;font:16px/1.5 system-ui;margin:30px auto;max-width:1250px}article{border-top:1px solid #52606a;padding:20px 0}article div{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}figure{margin:0}img{width:100%}figcaption{margin-bottom:10px}</style><h1>Revised: original printing inputs</h1><p>Four scan-reviewed text/style corrections. The renderer is identical on both sides; these gains are excluded from renderer-only comparisons. All other302 cards are unchanged.</p>${articles.join('')}<p>Local fan study. Magic imagery © Wizards of the Coast; cached scans through Scryfall.</p></html>`,
);
console.log(JSON.stringify({ corrected: results.length, unchanged, results }, null, 2));
