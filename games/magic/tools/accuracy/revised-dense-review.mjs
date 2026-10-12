import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, hash, fixtureRoot, outputRoot, atomicWrite } from './common.mjs';
import { normalize } from './pixels.mjs';
import { lineText, wrapping } from './typography-metrics.mjs';

const fixture = path.join(fixtureRoot, '3ed'),
  base = path.join(outputRoot, '3ed');
const targets = await readJson(path.join(fixture, 'dense-targets.json'));
const measurement = await readJson(path.join(fixture, 'dense-measurement.json'));
const before = await readJson(path.join(base, 'revised-text/capture.json'));
const after = await readJson(path.join(base, 'revised-dense/capture.json'));
assert.equal(after.rendererHash, measurement.rendererHash);
const results = [],
  articles = [];
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
for (const target of targets.cards) {
  const old = before.results.find((c) => c.id === target.id),
    card = after.results.find((c) => c.id === target.id);
  assert.equal(card.images.reference.sha256, target.referenceHash);
  assert.equal(card.inputHash, target.inputHash);
  const pair = measurement.pairs.find((c) => c.id === card.id);
  const audit = (record) => ({
    lineCount: record.layout.lines.length,
    lineCountError: record.layout.lines.length - target.scanLineCount,
    wrapping: target.lines
      ? wrapping(
          target.lines,
          record.layout.lines.map(lineText),
          record.face.rulesParagraphs.map((p) => p.runs.map((r) => r.text).join('')),
        )
      : null,
  });
  const review = {
    ...target,
    changed: pair.changed,
    scores: pair.scores,
    before: audit(old),
    after: audit(card),
  };
  results.push(review);
  const images = [];
  for (const [run, entry] of [
    ['revised-text', old.images.reference],
    ['revised-text', old.images.inspect],
    ['revised-dense', card.images.inspect],
  ]) {
    const bytes = await readFile(path.join(base, run, entry.file));
    assert.equal(hash(bytes), entry.sha256);
    const im = normalize(PNG.sync.read(bytes)),
      crop = new PNG({ width: 390, height: 215 });
    for (let y = 0; y < 215; y++)
      crop.data.set(
        im.data.subarray(((400 + y) * 488 + 50) * 4, ((400 + y) * 488 + 440) * 4),
        y * 390 * 4,
      );
    images.push('data:image/png;base64,' + PNG.sync.write(crop).toString('base64'));
  }
  articles.push(
    `<article id="card-${card.collectorNumber}"><h2>${escape(card.name)}</h2><p>Body F1 ${pair.scores.inspect.before.toFixed(3)} → ${pair.scores.inspect.after.toFixed(3)}. Lines: ${review.before.lineCount} → ${review.after.lineCount}; scan ${target.scanLineCount}.</p><p>${escape(target.warning ?? (target.number === '232' ? 'Negative control: the rejected small-type candidate scored higher but lost three printed lines. Final rendering preserves regular type. Its flavor attribution placement remains wrong.' : review.after.wrapping?.exactWrapping ? 'All printed line endings match. Font strokes still differ.' : 'Line count matches; some word wrapping or font strokes remain different.'))}</p><div class="triptych">${images.map((src, i) => `<figure><figcaption>${['Scan', 'Previous branch', 'New branch'][i]}</figcaption><img src="${src}" alt="${escape(card.name)} text"></figure>`).join('')}</div></article>`,
  );
}
const changed = results.filter((r) => r.changed);
assert.equal(measurement.regressions.length, 0);
assert.equal(changed.length, measurement.captureCheck.changed);
assert.ok(changed.every((r) => r.after.lineCountError === 0));
await writeJson(path.join(fixture, 'dense-line-review.json'), {
  schemaVersion: 1,
  rendererHash: after.rendererHash,
  targetHash: hash(await readFile(path.join(fixture, 'dense-targets.json'))),
  auditSourceHash: hash(await readFile(new URL(import.meta.url))),
  results,
  note: `All ${changed.length} changed faces match printed line counts, versus ${changed.filter((r) => r.before.lineCountError === 0).length} before. Only four have transcribed full word-line targets; two match every ending. A matching line count alone does not establish typography accuracy. Sedge Troll retains a source colon mismatch. All changed images were viewed during classifier development.`,
});
await atomicWrite(
  path.join(base, 'dense-review/index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revised dense typography</title><style>body{background:#1c2024;color:#e4e8ea;font:16px/1.5 system-ui;margin:30px auto;max-width:1250px;padding:0 20px}a{color:#b4d6dd}article{border-top:1px solid #52606a;padding:20px 0}.triptych{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}figure{margin:0}img{width:100%}figcaption{margin-bottom:10px}.warning{color:#ffce93}</style><h1>Revised: dense type</h1><p>13 cards use the shared small-type policy; the other 293 cards retain identical full images at both sizes. Same source inputs, frame assets and frozen alignment on both rendered sides.</p><p class="warning">This is a full-set audit after classifier refinement, not fresh validation. Earlier candidates failed on Bottle of Suleiman, Copy Artifact, Mons’s Goblin Raiders and Aladdin’s Ring. All 13 affected scans have been inspected during development. Font strokes and some wrapping still differ.</p><p>Body edge F1 is structural overlap, not percent accuracy. Final change has no >.02 score regressions. All 13 printed line counts match; source punctuation is separately flagged.</p><p><a href="../../main-review/index.html">Full cards versus main</a> · <a href="../revised-text/index.html">Separate printing-input corrections</a> · <a href="../long-body-review/index.html#regressions">Earlier regular-type regressions</a></p>${articles.join('')}<p>Local fan study. Magic imagery © Wizards of the Coast; cached scans through Scryfall.</p></html>`,
);
console.log(
  JSON.stringify(
    {
      changed: changed.length,
      matchedLineCounts: changed.filter((r) => r.after.lineCountError === 0).length,
      previouslyMatched: changed.filter((r) => r.before.lineCountError === 0).length,
    },
    null,
    2,
  ),
);
