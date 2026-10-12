import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, hash, fixtureRoot, outputRoot, atomicWrite } from './common.mjs';
import { normalize } from './pixels.mjs';
import { lineText, wrapping } from './typography-metrics.mjs';

const fixture = path.join(fixtureRoot, '3ed'),
  base = path.join(outputRoot, '3ed');
const targets = await readJson(path.join(fixture, 'large-body-targets.json'));
targets.cards.push(...(await readJson(path.join(fixture, 'large-body-corpus-targets.json'))).cards);
const measurement = await readJson(path.join(fixture, 'large-body-measurement.json'));
const before = await readJson(path.join(base, 'revised-frame/capture.json'));
const after = await readJson(path.join(base, 'revised-large/capture.json'));
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
    lineCountError: record.layout.lines.length - target.lines.length,
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
    ['revised-frame', old.images.reference],
    ['revised-frame', old.images.inspect],
    ['revised-large', card.images.inspect],
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
    `<article id="card-${card.collectorNumber}"><h2>${escape(card.name)}</h2><p>Body F1 ${pair.scores.inspect.before.toFixed(3)} → ${pair.scores.inspect.after.toFixed(3)}. Lines: ${review.before.lineCount} → ${review.after.lineCount}; scan ${target.lines.length}.</p><p>${escape(target.warning ?? (!pair.changed ? 'Unchanged control; font weight or wrapping can still differ.' : review.after.wrapping?.exactWrapping ? 'All printed line endings match. Font strokes still differ.' : review.after.lineCountError ? 'Printed line count still differs; inspect the wrapping before further placement tuning.' : 'Line count matches; some word wrapping or font strokes remain different.'))}</p><div class="triptych">${images.map((src, i) => `<figure><figcaption>${['Scan', 'Previous branch', 'New branch'][i]}</figcaption><img src="${src}" alt="${escape(card.name)} text"></figure>`).join('')}</div></article>`,
  );
}
const changed = results.filter((r) => r.changed);

assert.equal(changed.length, measurement.captureCheck.changed);

await writeJson(path.join(fixture, 'large-body-line-review.json'), {
  schemaVersion: 1,
  rendererHash: after.rendererHash,
  targetHash: hash(await readFile(path.join(fixture, 'large-body-targets.json'))),
  auditSourceHash: hash(await readFile(new URL(import.meta.url))),
  results,
  note: `${changed.filter((r) => r.after.lineCountError === 0).length}/${changed.length} changed faces match printed line counts; ${changed.filter((r) => r.after.wrapping?.exactWrapping).length} match all word-line targets. Disrupting Scepter remains one line short and regresses in F1. Deathgrip has a missing source colon. All additional changed scans were audited after the candidate was frozen; no refitting.`,
});
await atomicWrite(
  path.join(base, 'large-body-review/index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revised large rules passages</title><style>body{background:#1c2024;color:#e4e8ea;font:16px/1.5 system-ui;margin:30px auto;max-width:1400px;padding:0 20px}a{color:#b4d6dd}article{border-top:1px solid #52606a;padding:20px 0}.triptych{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}figure{margin:0}img{width:100%}figcaption{margin-bottom:10px}.warning{color:#ffce93}</style><h1>Revised: large centered rules</h1><p>25 cards use the shared large-type policy; the other 281 retain identical full images at both sizes. Same source inputs, existing frame assets and frozen alignment.</p><p>Body edge F1 rises from median .258 to .569 at inspect size. 24 cards gain and one regresses. These are structural scores, not percent accuracy.</p><p class="warning">Review: Disrupting Scepter still has four lines instead of five and its overlap score falls. Web, Reverse Damage and Karma retain different word wrapping. Deathgrip’s cached wording omits a colon. Font strokes remain heavier than the scans.</p><p>The candidate was frozen before ten reserved cards were opened for this study: eight applicable cards improve, two remain unchanged. The full-set audit follows below, including four unchanged controls.</p><p><a href="../../main-review/index.html">Full cards versus main</a> · <a href="../revised-large/report.html">All 306 card scores</a> · <a href="#card-245">Disrupting Scepter review</a></p>${articles.join('')}<p>Local fan study. Magic imagery © Wizards of the Coast; cached scans through Scryfall.</p></html>`,
);
console.log(
  JSON.stringify(
    {
      changed: changed.length,
      exactWrapping: changed.filter((r) => r.after.wrapping?.exactWrapping).length,
      matchedLineCounts: changed.filter((r) => r.after.lineCountError === 0).length,
      previouslyMatched: changed.filter((r) => r.before.lineCountError === 0).length,
    },
    null,
    2,
  ),
);
