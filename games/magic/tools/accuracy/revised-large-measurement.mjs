import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { outputRoot, fixtureRoot, readJson, writeJson, hash } from './common.mjs';
import { median } from './metrics.mjs';
const base = path.join(outputRoot, '3ed');
const before = await readJson(path.join(base, 'revised-frame/metrics.json'));
const after = await readJson(path.join(base, 'revised-large/metrics.json'));
const parity = await readJson(path.join(fixtureRoot, '3ed/large-body-capture-check.json'));
const targets = await readJson(path.join(fixtureRoot, '3ed/large-body-targets.json'));
const corpusTargets = await readJson(path.join(fixtureRoot, '3ed/large-body-corpus-targets.json'));
targets.cards.push(...corpusTargets.cards);
assert.equal(after.rendererHash, parity.rendererHash);
assert.equal(after.complete, true);
assert.equal(after.metricSource, before.metricSource);
assert.equal(after.alignmentHash, before.alignmentHash);
assert.equal(after.results.length, 306);
const pairs = after.results.map((card) => {
  const old = before.results.find((c) => c.id === card.id);
  assert.equal(card.inputHash, old.inputHash);
  const changed = card.images.inspect.sha256 !== old.images.inspect.sha256;
  const scores = Object.fromEntries(
    ['inspect', 'table'].map((tier) => {
      const body = (c) => c.comparisons[tier].regions.find((r) => r.id === 'body');
      const a = body(old),
        b = body(card);
      return [
        tier,
        {
          before: a.edgeF1[1],
          after: b.edgeF1[1],
          delta: b.edgeF1[1] - a.edgeF1[1],
          censusBefore: a.censusSimilarity,
          censusAfter: b.censusSimilarity,
          distanceBefore: a.meanDistance,
          distanceAfter: b.meanDistance,
        },
      ];
    }),
  );
  return {
    id: card.id,
    name: card.name,
    number: card.collectorNumber,
    changed,
    contentStatus: card.contentStatus,
    knownContentIssue: targets.cards.find((target) => target.id === card.id)?.warning ?? null,
    alignmentUncertain: card.alignment.uncertain || old.alignment.uncertain,
    scores,
  };
});
const summary = Object.fromEntries(
  ['inspect', 'table'].map((tier) => {
    const rows = pairs.filter((p) => p.changed),
      verified = rows.filter(
        (p) => p.contentStatus !== 'oracle-unverified' && !p.alignmentUncertain,
      );
    const describe = (rows) => ({
      count: rows.length,
      medianBefore: median(rows.map((p) => p.scores[tier].before)),
      medianAfter: median(rows.map((p) => p.scores[tier].after)),
      gains: rows.filter((p) => p.scores[tier].delta > 0.02).length,
      regressions: rows.filter((p) => p.scores[tier].delta < -0.02).length,
    });
    return [
      tier,
      {
        allChanged: describe(rows),
        printingSourceWithConfidentAlignment: describe(verified),
        printingSourceWithoutKnownContentIssue: describe(
          verified.filter((row) => !row.knownContentIssue),
        ),
      },
    ];
  }),
);
const regressions = pairs
  .filter((p) => Object.values(p.scores).some((s) => s.delta < -0.02))
  .sort((a, b) => a.scores.inspect.delta - b.scores.inspect.delta);
await writeJson(path.join(fixtureRoot, '3ed/large-body-measurement.json'), {
  schemaVersion: 1,
  rendererHash: after.rendererHash,
  baselineRendererHash: before.rendererHash,
  comparisonSourceHash: after.metricSource,
  auditSourceHash: hash(await readFile(new URL(import.meta.url))),
  captureCheck: parity,
  coverage: after.summary,
  elapsedSeconds: after.elapsedSeconds,
  summary,
  regressions,
  pairs,
  note: 'Revised large rules policy extends beyond the 100-character cutoff using a five-line fit and a left-aligned short keyword heading. Frozen frame registration; same source-corrected inputs. The candidate was frozen before ten reserved examples were opened for this study; full-corpus diagnostics are reported separately. Metrics do not certify glyph shape or source punctuation. Source-only corrections are separately measured in printing-fields-measurement.json and frame-selection-measurement.json. Offline Node time is not renderer submission or GPU completion time',
});
console.log(JSON.stringify({ summary, regressions: regressions.map((x) => x.name) }, null, 2));
