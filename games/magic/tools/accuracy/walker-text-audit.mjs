import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, fixtureRoot, outputRoot, hash } from './common.mjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareRegion, METRIC_VERSION } from './metrics.mjs';

const run = process.argv[2] ?? 'walker-text-measured';
const cohort = process.argv[3] ?? 'development';
assert.match(run, /^[a-z0-9-]+$/);
assert.ok(['development', 'same-set-reserved', 'set-transfer'].includes(cohort));
const planName = process.argv[4] ?? 'planeswalker-measured-text-plan.json';
assert.match(planName, /^[a-z0-9-]+\.json$/);
const planBytes = await readFile(path.join(fixtureRoot, planName));
const plan = JSON.parse(planBytes);
const rows = [],
  captures = new Map();
const started = performance.now();
async function capture(set, name) {
  const key = `${set}/${name}`;
  if (!captures.has(key)) {
    const bytes = await readFile(path.join(outputRoot, key, 'capture.json'));
    captures.set(key, { data: JSON.parse(bytes), hash: hash(bytes) });
  }
  return captures.get(key).data;
}
const readImage = async (set, run, asset, transform) => {
  const bytes = await readFile(path.join(outputRoot, set, run, asset.file));
  assert.equal(hash(bytes), asset.sha256);
  return normalize(PNG.sync.read(bytes, { checkCRC: true }), transform);
};
const score = (reference, render, rect) => {
  const a = cropGray(reference, rect),
    b = cropGray(render, rect);
  const m = compareRegion(a.gray, b.gray, a.width, a.height);
  return {
    status: m.status,
    edgeF1: m.edgeF1?.[1] ?? null,
    census: m.censusSimilarity ?? null,
    p95: m.p95Distance ?? null,
  };
};
for (const item of plan.cards.filter((c) => c.cohort === cohort)) {
  const beforeCapture = await capture(item.set, item.baseline);
  const afterCapture = await capture(item.set, run);
  for (const key of ['snapshotIdentity', 'referenceIdentity', 'fontStylesheetHash'])
    assert.equal(beforeCapture[key], afterCapture[key]);
  const before = beforeCapture.results.find((c) => c.id === item.id);
  const after = afterCapture.results.find((c) => c.id === item.id);
  assert.ok(before && after && !before.issue && !after.issue);
  assert.equal(before.inputHash, item.inputHash);
  assert.equal(after.inputHash, item.inputHash);
  assert.equal(after.images.reference.sha256, item.referenceHash);
  const profileBytes = await readFile(path.join(fixtureRoot, item.set, 'alignment.json'));
  assert.equal(hash(profileBytes), plan.alignment.profileHashes[item.set]);
  const transform = JSON.parse(profileBytes).frameFamilies.planeswalker.transform;
  const references = {
    raw: await readImage(item.set, run, after.images.reference),
    registered: await readImage(item.set, run, after.images.reference, transform),
  };
  const scores = {};
  for (const tier of ['inspect', 'table']) {
    const images = {
      before: await readImage(item.set, item.baseline, before.images[tier]),
      after: await readImage(item.set, run, after.images[tier]),
    };
    scores[tier] = {};
    for (const [region, definition] of Object.entries(plan.regions)) {
      const rect = Array.isArray(definition) ? definition : definition[item.frame];
      scores[tier][region] = {};
      for (const [registration, ref] of Object.entries(references)) {
        const a = score(ref, images.before, rect),
          b = score(ref, images.after, rect);
        scores[tier][region][registration] = {
          before: a,
          after: b,
          delta: a.edgeF1 == null || b.edgeF1 == null ? null : b.edgeF1 - a.edgeF1,
        };
      }
    }
  }
  rows.push({
    ...item,
    scores,
    overflow: after.specialLayout?.some((r) => r.layout.overflow) ?? null,
    layout: after.specialLayout?.map((r) => ({
      font: r.font,
      top: r.top,
      height: r.height,
      lines: r.layout.lines.map((l) =>
        l.runs.map((r) => (r.symbol ? `{${r.text}}` : r.text)).join(''),
      ),
    })),
  });
  console.log(`${cohort}: ${rows.length} ${item.name}`);
}
assert.ok(rows.length);
const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;
const summary = {};
for (const tier of ['inspect', 'table']) {
  summary[tier] = {};
  for (const region of Object.keys(plan.regions)) {
    const measured = rows
      .map((r) => r.scores[tier][region].registered)
      .filter((r) => r.delta != null);
    summary[tier][region] = {
      count: measured.length,
      before: mean(measured.map((r) => r.before.edgeF1)),
      after: mean(measured.map((r) => r.after.edgeF1)),
      gainsOver02: measured.filter((r) => r.delta > 0.02).length,
      declinesOver02: measured.filter((r) => r.delta < -0.02).length,
    };
  }
}
const report = {
  schemaVersion: 1,
  run,
  cohort,
  planHash: hash(planBytes),
  planName,
  metricVersion: METRIC_VERSION,
  captures: Object.fromEntries(
    [...captures].map(([k, v]) => [k, { hash: v.hash, rendererHash: v.data.rendererHash }]),
  ),
  scope: plan.scope,
  limitations: plan.limitations,
  alignment: plan.alignment,
  regions: plan.regions,
  summary,
  rows,
  timing: {
    elapsedMs: performance.now() - started,
    scope:
      'Serial Node hash verification, PNG decoding, normalization and CPU region scoring. No browser, rendering, network or GPU.',
  },
};
await writeJson(path.join(fixtureRoot, `${run}-${cohort}-measurement.json`), report);
console.log(JSON.stringify(summary, null, 2));
