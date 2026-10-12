import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import {
  atomicWrite,
  fixtureRoot,
  hash,
  options,
  outputRoot,
  readJson,
  writeJson,
} from './common.mjs';
import { median } from './metrics.mjs';
import { basicPage } from './basics-page.mjs';

const opts = options();
assert.equal(opts.study, 'retro-basics');
const plan = await readJson(path.join(fixtureRoot, opts.set, 'transfer-plan-retro-basics.json'));
assert.equal(opts.baseline, plan.baselineRun);
const sets = [];
const score = (card, tier, id) =>
  card.comparisons[tier].regions.find((r) => r.id === id)?.edgeF1?.[1];
for (const set of new Set([plan.sourceSet, opts.set])) {
  const dir = path.join(outputRoot, set, opts.run);
  const previous = path.join(outputRoot, set, opts.baseline);
  const [before, after, annotations] = await Promise.all([
    readJson(path.join(previous, 'metrics.json')),
    readJson(path.join(dir, 'metrics.json')),
    readJson(path.join(fixtureRoot, set, 'annotations-retro-basics.json')),
  ]);
  for (const key of [
    'referenceIdentity',
    'alignmentHash',
    'browser',
    'metricSource',
    'fontStylesheetHash',
  ])
    assert.equal(after[key], before[key], `${set}: changed ${key}`);
  assert.equal(after.rendererHash, plan.frozenRendererHash);
  assert.equal(before.rendererHash, plan.baselineRendererHash);
  assert.ok(before.complete && after.complete, `${set}: incomplete corpus`);
  assert.equal(after.results.length, before.results.length);
  const results = [];
  let unchangedNonbasics = 0;
  for (const card of after.results) {
    const old = before.results.find((c) => c.id === card.id);
    assert.ok(
      old && !old.issue && !card.issue,
      `${set}/${card.collectorNumber}: missing/failed pair`,
    );
    assert.equal(card.inputHash, old.inputHash, `${set}/${card.collectorNumber}: changed input`);
    for (const [root, result] of [
      [dir, card],
      [previous, old],
    ])
      for (const tier of ['inspect', 'table'])
        assert.equal(
          hash(await readFile(path.join(root, result.images[tier].file))),
          result.images[tier].sha256,
          `${set}: stale image`,
        );
    if (card.category !== 'basic-land') {
      for (const tier of ['inspect', 'table'])
        assert.equal(
          card.images[tier].sha256,
          old.images[tier].sha256,
          `${set}/${card.collectorNumber}: changed nonbasic ${tier}`,
        );
      unchangedNonbasics++;
      continue;
    }
    const annotation = annotations.cards[card.id];
    assert.equal(annotation?.reviewKind, 'printing-policy');
    assert.ok(annotation.reviewed);
    assert.equal(annotation.referenceHash, card.images.reference.sha256);
    assert.ok(card.layout && !card.layout.overflow);
    assert.equal(card.layout.lines.length, 1);
    const line = card.layout.lines[0];
    const actual = line.runs.map((r) => (r.symbol ? `{${r.text}}` : r.text)).join('');
    assert.equal(actual, annotation.expectedPrinting.rulesText);
    assert.ok(Math.abs(line.x + line.width / 2 - 244) < 0.01, `${set}: off-center basic line`);
    assert.equal(card.assets.basicSymbol, null);
    results.push({
      id: card.id,
      name: card.name,
      collectorNumber: card.collectorNumber,
      cohort: card.cohort,
      alignmentUncertain: card.alignment.uncertain || old.alignment.uncertain,
      expectedPrinting: annotation.expectedPrinting,
      inkBounds: line.inkBounds,
      scores: Object.fromEntries(
        ['inspect', 'table'].map((tier) => [
          tier,
          Object.fromEntries(
            ['body', 'type'].map((id) => [id, [score(old, tier, id), score(card, tier, id)]]),
          ),
        ]),
      ),
    });
  }
  const summarize = (rows) =>
    Object.fromEntries(
      ['inspect', 'table'].map((tier) => [
        tier,
        Object.fromEntries(
          ['body', 'type'].map((id) => {
            const pairs = rows.map((c) => c.scores[tier][id]);
            return [
              id,
              {
                count: pairs.length,
                before: median(pairs.map((p) => p[0])),
                after: median(pairs.map((p) => p[1])),
                improved: pairs.filter((p) => p[1] - p[0] > 0.02).length,
                regressed: pairs.filter((p) => p[1] - p[0] < -0.02).length,
              },
            ];
          }),
        ),
      ]),
    );
  sets.push({
    set,
    dir,
    previous,
    before,
    after,
    results,
    evidence: {
      set,
      attempted: after.results.length,
      basics: results.length,
      unchangedNonbasics,
      alignmentExcluded: results.filter((c) => c.alignmentUncertain).length,
      referenceIdentity: after.referenceIdentity,
      alignmentHash: after.alignmentHash,
      metricSource: after.metricSource,
      browser: after.browser,
      seconds: after.elapsedSeconds,
      cacheHits: after.cacheHits,
      summary: Object.fromEntries(
        ['calibration', 'held-out', 'all'].map((cohort) => [
          cohort,
          summarize(
            results.filter(
              (c) => !c.alignmentUncertain && (cohort === 'all' || c.cohort === cohort),
            ),
          ),
        ]),
      ),
      results,
    },
  });
}
const modernDir = path.join(outputRoot, 'm21', opts.run + '-parity');
const modern = await readJson(path.join(modernDir, 'capture.json'));
const oldModern = await readJson(
  path.join(outputRoot, 'm21', 'retro-details-parity', 'capture.json'),
);
assert.equal(modern.rendererHash, plan.frozenRendererHash);
assert.equal(modern.results.length, 8);
assert.equal(modern.browser, oldModern.browser);
assert.equal(modern.fontStylesheetHash, oldModern.fontStylesheetHash);
for (const card of modern.results) {
  const old = oldModern.results.find((c) => c.id === card.id);
  assert.ok(old && !old.issue && !card.issue);
  assert.equal(card.inputHash, old.inputHash);
  for (const tier of ['inspect', 'table']) {
    assert.equal(card.images[tier].sha256, old.images[tier].sha256, 'Modern pixel regression');
    assert.equal(
      hash(await readFile(path.join(modernDir, card.images[tier].file))),
      card.images[tier].sha256,
    );
  }
}
const report = {
  schemaVersion: 1,
  study: opts.study,
  baseline: opts.baseline,
  run: opts.run,
  rendererHashes: [plan.baselineRendererHash, plan.frozenRendererHash],
  frozenRendererCommit: plan.frozenRendererCommit,
  modernParity: { cards: 8, tiers: 2, identical: true },
  scoreMeaning:
    'Boundary F1 at one canonical pixel, not percent accuracy. Historical content and layout correction with identical semantic inputs. Fixed frame-family alignment; no per-scan fit. Alignment exclusions remain in results.',
  sets: sets.map((s) => s.evidence),
};
const out = path.join(outputRoot, opts.set, opts.run);
await writeJson(path.join(out, 'basics.json'), report);
await atomicWrite(path.join(out, 'basics.html'), basicPage({ sets, report, out }));
console.log(
  JSON.stringify(
    { ...report, sets: report.sets.map(({ results, ...summary }) => summary) },
    null,
    2,
  ),
);
