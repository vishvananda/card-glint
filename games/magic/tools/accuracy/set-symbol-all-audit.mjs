import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { cacheRoot, fixtureRoot, outputRoot, readJson, writeJson, hash } from './common.mjs';
import { readObject } from './cache.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';
import { componentOffset } from './component-offset.mjs';
import { median } from './metrics.mjs';

const [set, planName = 'set-symbol-all-plan'] = process.argv.slice(2);
assert.match(set ?? '', /^[a-z0-9]+$/);
assert.match(planName, /^[a-z0-9-]+$/);
const planBytes = await readFile(`${fixtureRoot}/${planName}.json`),
  plan = JSON.parse(planBytes),
  snapshot = await readJson(`${cacheRoot}/sets/${set}.json`),
  captures = {};
assert.equal(snapshot.identity, plan.sets[set].snapshotIdentity);
const entries = plan.cards?.[set]
  ? snapshot.entries.filter((e) => plan.cards[set].includes(e.id))
  : snapshot.entries;
if (plan.cards?.[set]) assert.equal(entries.length, plan.cards[set].length);
for (const [stage, runChoice] of [
  ['before', plan.baseline],
  ['after', plan.run],
]) {
  const run = typeof runChoice === 'string' ? runChoice : runChoice[set];
  const bytes = await readFile(`${outputRoot}/${set}/${run}/capture.json`),
    data = JSON.parse(bytes);
  assert.equal(data.rendererHash, plan.rendererHashes[stage]);
  assert.equal(data.snapshotIdentity, snapshot.identity);
  assert.equal(data.results.length, entries.length);
  assert.equal(new Set(data.results.map((r) => r.id)).size, entries.length);
  captures[stage] = { hash: hash(bytes), run, data };
}
assert.equal(captures.before.data.fontStylesheetHash, captures.after.data.fontStylesheetHash);
assert.equal(captures.before.data.browser, captures.after.data.browser);
const byId = Object.fromEntries(
  Object.entries(captures).map(([k, v]) => [k, new Map(v.data.results.map((r) => [r.id, r]))]),
);
const rows = [],
  started = performance.now();
let cacheHits = 0,
  cacheMisses = 0;
async function region(stage, asset, rect) {
  const r = await cachedGrayRegion(
    `${outputRoot}/${set}/${captures[stage].run}/${asset.file}`,
    asset.sha256,
    rect,
  );
  if (r.cacheHit) cacheHits++;
  else cacheMisses++;
  return r;
}
function compare(a, b, diagnostic) {
  const args = [a.gray, b.gray, a.width, a.height],
    pair = compareLettering(...args);
  const output = {
    edgeF1: pair.edgeF1,
    contrast: letteringContrast(...args),
    census: pair.censusSimilarity,
    meanDistance: pair.meanDistance,
  };
  if (diagnostic) {
    const o = componentOffset(...args, false, 6);
    output.offset = {
      status: o.status,
      dx: o.dx,
      dy: o.dy,
      edgeF1: o.diagnosticEdgeF1,
      overlapPeak: o.overlapPeak,
      objectiveDisagreementPx: o.objectiveDisagreementPx,
    };
  }
  return output;
}
for (const entry of entries) {
  const before = byId.before.get(entry.id),
    after = byId.after.get(entry.id);
  assert.ok(before && after);
  assert.equal(before.inputHash, after.inputHash, 'Before/after printing inputs differ');
  const row = {
    id: entry.id,
    number: entry.card.collector_number,
    name: entry.card.name,
    category: entry.category,
    rarity: entry.card.rarity,
    frame: after.frame,
    inputHash: after.inputHash,
    referenceHash: entry.reference?.sha256 ?? null,
    issue: after.issue ?? before.issue ?? null,
  };
  if (!row.issue) {
    assert.equal(before.images.reference.sha256, after.images.reference.sha256);
    assert.equal(after.images.reference.sha256, entry.reference.sha256);
    const rect = plan.regions[after.frame];
    if (!rect) row.issue = 'no-symbol-window-for-frame';
    else {
      const reference = await region('after', after.images.reference, rect);
      row.scores = {};
      for (const tier of ['inspect', 'table'])
        row.scores[tier] = {
          before: compare(reference, await region('before', before.images[tier], rect), false),
          after: compare(reference, await region('after', after.images[tier], rect), true),
        };
      row.review = [];
      if (after.frame !== 'normal') row.review.push('symbol-window-includes-planeswalker-frame');
      for (const tier of ['inspect', 'table']) {
        const p = row.scores[tier];
        if (p.after.edgeF1 - p.before.edgeF1 < -0.02) row.review.push(`${tier}:edge-regression`);
        if (p.after.contrast - p.before.contrast < -0.02)
          row.review.push(`${tier}:contrast-regression`);
        if (p.after.edgeF1 < 0.65) row.review.push(`${tier}:residual-shape-or-placement`);
      }
    }
  }
  rows.push(row);
  if (rows.length % 50 === 0) console.log(`${set}: measured ${rows.length}/${entries.length}`);
}
// Retain a known structural-layout exclusion in the ordinary-card denominator.
// The cached snapshot is immutable for paired captures; repair its policy separately.
const structuralExclusions = [];
for (const page of plan.cards ? [] : snapshot.pages) {
  const data = JSON.parse((await readObject(page)).toString('utf8')).data;
  for (const c of data) {
    const excluded = snapshot.excluded.find((e) => e.id === c.id);
    if (excluded?.reason === 'treatment:originpwdfc' && c.layout === 'transform')
      structuralExclusions.push({
        id: c.id,
        number: c.collector_number,
        name: c.name,
        issue: 'unsupported-layout:transform',
        previousExclusion: excluded.reason,
      });
  }
}
const summary = {};
for (const category of ['all', 'ordinary', 'basic-land', 'planeswalker']) {
  const group = rows.filter((r) => category === 'all' || r.category === category),
    measured = group.filter((r) => r.scores);
  summary[category] = { entries: group.length, measured: measured.length, tiers: {} };
  for (const tier of ['inspect', 'table']) {
    summary[category].tiers[tier] = {};
    for (const metric of ['edgeF1', 'contrast', 'census']) {
      const pairs = measured.filter((r) =>
        ['before', 'after'].every((s) => r.scores[tier][s][metric] != null),
      );
      summary[category].tiers[tier][metric] = {
        before: median(pairs.map((r) => r.scores[tier].before[metric])),
        after: median(pairs.map((r) => r.scores[tier].after[metric])),
        gains: pairs.filter(
          (r) => r.scores[tier].after[metric] - r.scores[tier].before[metric] > 0.02,
        ).length,
        regressions: pairs
          .filter((r) => r.scores[tier].after[metric] - r.scores[tier].before[metric] < -0.02)
          .map((r) => r.number),
      };
    }
  }
}
const methods = Object.fromEntries(
    await Promise.all(
      [
        'normalized-gray-region',
        'region-cache',
        'edges',
        'lettering-metrics',
        'lettering-contrast',
        'component-offset',
        'metrics',
      ].map(async (name) => [
        name,
        hash(await readFile(new URL(`./${name}.mjs`, import.meta.url))),
      ]),
    ),
  ),
  measurementHash = hash(JSON.stringify(rows)),
  reportFile = `${fixtureRoot}/${planName.replace(/-plan$/, '')}-${set}-measurement.json`,
  timing = {
    milliseconds: performance.now() - started,
    cacheHits,
    cacheMisses,
    scope:
      'CPU source hashing, optional PNG decoding, canonical region sampling and structural metrics; no Chromium or GPU work.',
  };
let timingTrials = [];
try {
  const previous = await readJson(reportFile);
  if (
    previous.measurementHash === measurementHash &&
    JSON.stringify(previous.methods) === JSON.stringify(methods)
  )
    timingTrials = previous.timingTrials;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await writeJson(reportFile, {
  schemaVersion: 1,
  set,
  planHash: hash(planBytes),
  studyHash: hash(await readFile(new URL(import.meta.url))),
  methods,
  scope: `${plan.cards ? 'Selected' : 'Full'} cached cohort, fixed normalization, no per-scan fitting. Paired symbol diagnostics are not whole-card accuracy percentages. Planeswalker windows include nearby frame ink.`,
  captures: Object.fromEntries(
    Object.entries(captures).map(([stage, capture]) => [
      stage,
      { run: capture.run, hash: capture.hash, rendererHash: capture.data.rendererHash },
    ]),
  ),
  coverage: {
    totalPrintings: snapshot.totalPrintings,
    cohortEntries: entries.length,
    measured: rows.filter((r) => r.scores).length,
    ordinaryDenominator: plan.cards ? null : rows.length + structuralExclusions.length,
    specialTreatments: plan.cards ? null : snapshot.excluded.length - structuralExclusions.length,
    failures: rows.filter((r) => r.issue).map(({ id, name, issue }) => ({ id, name, issue })),
    structuralExclusions,
  },
  summary,
  measurementHash,
  rows,
  timingTrials: [...timingTrials, timing],
});
console.log(JSON.stringify({ set, summary: summary.all, timing }, null, 2));
