import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, atomicWrite, fixtureRoot, outputRoot, hash } from './common.mjs';
import { normalize } from './pixels.mjs';
import { wrapping, lineText } from './typography-metrics.mjs';
import { median } from './metrics.mjs';

const fixture = path.join(fixtureRoot, '3ed');
const plan = await readJson(path.join(fixture, 'long-body-plan.json'));
const targets = await readJson(path.join(fixture, 'long-body-targets.json'));
const frozen = await readJson(path.join(fixture, 'long-body-candidate.json'));
const base = path.join(outputRoot, '3ed', plan.sourceRun);
const bytes = await readFile(path.join(base, 'capture.json'));
assert.equal(hash(bytes), plan.captureHash);
const capture = JSON.parse(bytes);
const results = [],
  articles = [];
const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
function cropUrl(image) {
  const crop = new PNG({ width: 390, height: 205 });
  for (let y = 0; y < 205; y++)
    crop.data.set(
      image.data.subarray(((400 + y) * 488 + 50) * 4, ((400 + y) * 488 + 440) * 4),
      y * 390 * 4,
    );
  return 'data:image/png;base64,' + PNG.sync.write(crop).toString('base64');
}
for (const phase of ['development-clamped', 'validation']) {
  const directory = path.join(outputRoot, '3ed', `long-body-${phase}`);
  const trial = await readJson(path.join(directory, 'trial.json'));
  assert.equal(trial.experimentHash, frozen.experimentHash);
  for (const card of trial.results) {
    const target = targets.cards.find((c) => c.id === card.id),
      original = capture.results.find((c) => c.id === card.id);
    assert.equal(target.referenceHash, original.images.reference.sha256);
    const paragraphs = original.face.rulesParagraphs.map((p) => p.runs.map((r) => r.text).join(''));
    const selectedScores = card.scores.filter(
      (score) => score.candidate === 'control' || score.candidate === frozen.candidate.id,
    );
    assert.equal(selectedScores.length, 4);
    const scores = selectedScores.map((score) => ({
      ...score,
      layout: undefined,
      wrapping: wrapping(target.lines, score.layout.lines.map(lineText), paragraphs),
    }));
    const source = await readFile(path.join(base, original.images.reference.file));
    assert.equal(hash(source), target.referenceHash);
    const images = [normalize(PNG.sync.read(source))];
    for (const score of selectedScores.filter((s) => s.tier === 'inspect')) {
      const bytes = await readFile(path.join(directory, score.file));
      assert.equal(hash(bytes), score.sha256);
      images.push(normalize(PNG.sync.read(bytes)));
    }
    const [before, after] = scores.filter((s) => s.tier === 'inspect');
    const note =
      target.warning ??
      (after.wrapping.exactWrapping
        ? 'All printed line endings match; exact font strokes remain different.'
        : 'Some printed line endings still differ.');
    results.push({ ...target, scores });
    articles.push(
      `<article id="card-${card.number}"><h2>${escape(card.name)} <small>${target.cohort}</small></h2><p>Body F1 ${before.edgeF1.toFixed(3)} → ${after.edgeF1.toFixed(3)}. Line wrapping: ${escape(after.wrapping.status === 'content-mismatch' ? 'source mismatch' : after.wrapping.exactWrapping ? 'exact' : `${after.wrapping.actualLines}/${after.wrapping.expectedLines} lines; endings differ`)}.</p><p class="${target.warning ? 'warning' : ''}">${escape(note)}</p><div class="triptych">${images.map((img, i) => `<figure><figcaption>${['Scryfall scan', 'Before this change', 'New shared layout'][i]}</figcaption><img alt="${escape(card.name)} body" src="${cropUrl(img)}"></figure>`).join('')}</div></article>`,
    );
  }
}
const summary = ['development', 'reserved'].flatMap((cohort) =>
  ['inspect', 'table'].map((tier) => {
    const rows = results
      .filter((r) => r.cohort === cohort)
      .map((r) => ({
        name: r.name,
        before: r.scores.find((s) => s.tier === tier && s.candidate === 'control'),
        after: r.scores.find((s) => s.tier === tier && s.candidate === frozen.candidate.id),
      }));
    return {
      cohort,
      tier,
      count: rows.length,
      medianBefore: median(rows.map((r) => r.before.edgeF1)),
      medianAfter: median(rows.map((r) => r.after.edgeF1)),
      gains: rows.filter((r) => r.after.edgeF1 > r.before.edgeF1 + 0.02).map((r) => r.name),
      regressions: rows.filter((r) => r.after.edgeF1 < r.before.edgeF1 - 0.02).map((r) => r.name),
      exactBefore: rows.filter((r) => r.before.wrapping.exactWrapping).length,
      exactAfter: rows.filter((r) => r.after.wrapping.exactWrapping).length,
      contentMismatches: rows
        .filter((r) => r.after.wrapping.status === 'content-mismatch')
        .map((r) => r.name),
    };
  }),
);
const corpus = await readJson(path.join(fixture, 'long-body-measurement.json'));
const current = await readJson(path.join(outputRoot, '3ed/revised-long/capture.json'));
assert.equal(current.rendererHash, corpus.rendererHash);
articles.push(
  '<h2 id="regressions">Full-set regressions</h2><p>These remain open. Large centered passages and dense small type need separate policies. Source-text and frame-selection errors are also visible. All scores retain the shared frame registration.</p>',
);
for (const row of corpus.regressions) {
  const old = capture.results.find((c) => c.id === row.id);
  const card = current.results.find((c) => c.id === row.id);
  const images = [];
  for (const [directory, entry] of [
    [base, old.images.reference],
    [base, old.images.inspect],
    [path.join(outputRoot, '3ed/revised-long'), card.images.inspect],
  ]) {
    const bytes = await readFile(path.join(directory, entry.file));
    assert.equal(hash(bytes), entry.sha256);
    images.push(normalize(PNG.sync.read(bytes)));
  }
  articles.push(
    `<article id="regression-${row.number}"><h2>${escape(row.name)}</h2><p class="warning">Inspect F1 ${row.scores.inspect.before.toFixed(3)} → ${row.scores.inspect.after.toFixed(3)}; table ${row.scores.table.before.toFixed(3)} → ${row.scores.table.after.toFixed(3)}. Text source: ${escape(row.contentStatus)}.</p><div class="triptych">${images.map((img, i) => `<figure><figcaption>${['Scryfall scan', 'Before this change', 'New shared layout'][i]}</figcaption><img alt="${escape(row.name)} regression" src="${cropUrl(img)}"></figure>`).join('')}</div></article>`,
  );
}
await writeJson(path.join(fixture, 'long-body-transfer.json'), {
  schemaVersion: 1,
  candidate: frozen.candidate,
  experimentHash: frozen.experimentHash,
  auditSourceHash: hash(await readFile(new URL(import.meta.url))),
  targetHash: hash(await readFile(path.join(fixture, 'long-body-targets.json'))),
  summary,
  results,
  note: 'Frozen candidate improves fixed-alignment body overlap on all12 reserved cards. Missing colons remain content mismatches; Fireball style and Dragon Whelp shared rules/flavor line remain unresolved. No per-card fitting. Wrapping normalizes quotes/whitespace and does not certify stroke shape or exact punctuation.',
});
await atomicWrite(
  path.join(outputRoot, '3ed/long-body-review/index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revised text placement review</title><style>body{margin:0;background:#1c2024;color:#e4e8ea;font:16px/1.5 system-ui}main{max-width:1300px;margin:auto;padding:30px}a{color:#b4d6dd}article{padding:25px 0;border-top:1px solid #52606a}.triptych{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}figure{margin:0}img{width:100%;display:block}figcaption{margin-bottom:10px}.warning{color:#ffce93}small{font-size:15px;font-weight:400;color:#a7b7bd}@media(max-width:700px){.triptych{gap:6px}main{padding:15px}}</style><main><h1>Revised: body placement and spacing</h1><p>Shared 70px left edge, 346px width, no extra paragraph/flavor gaps, and a higher optical center constrained to the text panel. Same words, fonts, scans and frame assets on both rendered sides; no scan-specific fitting.</p><p class="warning">Intermediate branch change: the full set has 22 inspect-size and 18 table-size regressions, 23 distinct cards. <a href="#regressions">Review every regression</a>.</p><p>All 12 reserved cards improve at both sizes. Seven match every printed line; two have source-text errors and three retain wrapping differences. Fireball also needs an upright parenthesis. The development set retains Animate Wall's slight score regression and Clone's wrong type size.</p><p>Edge F1 measures structural overlap, not percent accuracy. The columns below compare the previous branch rendering with this change. <a href="../../main-review/index.html">Full cards versus main</a>.</p><nav>${results.map((r) => `<a href="#card-${r.number}">${escape(r.name)}</a>`).join(' · ')}</nav>${articles.join('')}<p>Local fan rendering study. Magic imagery © Wizards of the Coast; cached scans through Scryfall. External assets are excluded from the public showcase.</p></main></html>`,
);
console.log(JSON.stringify(summary, null, 2));
