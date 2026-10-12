import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareRegion, median, METRIC_VERSION } from './metrics.mjs';
import { readJson, writeJson, outputRoot, fixtureRoot, hash } from './common.mjs';

// This audit consumes frozen captures; it neither renders nor registers a scan.
const set = process.argv[2];
const planFile = path.join(fixtureRoot, 'early-centered-corpus-plan.json');
const plan = await readJson(planFile);
assert.ok(plan.sets.includes(set), 'Expected an early-set code from the frozen plan');
const base = path.join(outputRoot, set);
const loadCapture = async (run) => {
  const bytes = await readFile(path.join(base, run, 'capture.json'));
  const capture = JSON.parse(bytes);
  assert.equal(capture.set, set);
  assert.equal(capture.run, run);
  assert.ok(capture.complete);
  assert.equal(capture.results.length, capture.eligibleCount);
  assert.equal(new Set(capture.results.map((c) => c.id)).size, capture.results.length);
  return { capture, hash: hash(bytes) };
};
const current = await loadCapture(plan.run);
assert.equal(current.capture.rendererHash, plan.rendererHash);
const baseline = plan.baselines[set] ? await loadCapture(plan.baselines[set]) : null;
if (baseline) {
  assert.equal(current.capture.snapshotIdentity, baseline.capture.snapshotIdentity);
  assert.equal(current.capture.referenceIdentity, baseline.capture.referenceIdentity);
  assert.equal(current.capture.fontStylesheetHash, baseline.capture.fontStylesheetHash);
}
const oldCards = new Map(baseline?.capture.results.map((c) => [c.id, c]) ?? []);
const rect = [54, 409, 380, 194];
const image = async (run, asset) => {
  const bytes = await readFile(path.join(base, run, asset.file));
  assert.equal(hash(bytes), asset.sha256, `${asset.file}: raster hash mismatch`);
  return cropGray(normalize(PNG.sync.read(bytes, { checkCRC: true })), rect);
};
const score = (reference, rendered) => {
  const m = compareRegion(reference.gray, rendered.gray, reference.width, reference.height);
  return {
    status: m.status,
    edgeF1: m.edgeF1?.[1] ?? null,
    census: m.censusSimilarity ?? null,
    p95Distance: m.p95Distance ?? null,
  };
};
const summarizeLayout = (layout) =>
  layout
    ? {
        size: layout.size,
        lines: layout.lines.length,
        centeredLines: layout.lines.filter((l) => Math.abs(l.x + l.width / 2 - 244) < 0.01).length,
        overflow: layout.overflow,
      }
    : null;
const rows = [];
const started = performance.now();
for (const card of current.capture.results) {
  const old = oldCards.get(card.id);
  if (old) assert.equal(card.images.reference.sha256, old.images.reference.sha256);
  const paired = !!old && !old.issue && card.inputHash === old.inputHash;
  const reference = await image(plan.run, card.images.reference);
  const scores = {};
  if (!card.issue)
    for (const tier of ['inspect', 'table']) {
      const rendered = await image(plan.run, card.images[tier]);
      const after = score(reference, rendered);
      const beforeCrop = paired ? await image(plan.baselines[set], old.images[tier]) : null;
      const before = beforeCrop ? score(reference, beforeCrop) : null;
      scores[tier] = {
        after,
        before,
        delta: before?.edgeF1 != null && after.edgeF1 != null ? after.edgeF1 - before.edgeF1 : null,
        changed: beforeCrop ? rendered.gray.some((v, i) => v !== beforeCrop.gray[i]) : null,
      };
    }
  rows.push({
    id: card.id,
    name: card.name,
    number: card.collectorNumber,
    colors: card.face.frameColors ?? card.face.colors,
    contentStatus: card.contentStatus,
    inputHash: card.inputHash,
    referenceHash: card.images.reference.sha256,
    issue: card.issue,
    paired,
    unpairedReason: paired ? null : !old ? 'no-baseline' : 'changed-input-or-failed-baseline',
    layout: summarizeLayout(card.layout),
    beforeLayout: paired ? summarizeLayout(old.layout) : null,
    scores,
  });
  if (rows.length % 50 === 0)
    console.log(`${set}: ${rows.length}/${current.capture.results.length}`);
}
const mean = (values) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : null);
const tiers = Object.fromEntries(
  ['inspect', 'table'].map((tier) => {
    const measured = rows.filter((r) => r.scores[tier]?.after.edgeF1 != null);
    const paired = measured.filter((r) => r.scores[tier].delta != null);
    const changed = paired.filter((r) => r.scores[tier].changed);
    const summary = (group) => ({
      count: group.length,
      meanBefore: mean(group.map((r) => r.scores[tier].before.edgeF1)),
      meanAfter: mean(group.map((r) => r.scores[tier].after.edgeF1)),
      medianDelta: median(group.map((r) => r.scores[tier].delta)),
      gainsOver02: group.filter((r) => r.scores[tier].delta > 0.02).length,
      declinesOver02: group.filter((r) => r.scores[tier].delta < -0.02).length,
    });
    return [
      tier,
      {
        measured: measured.length,
        mean: mean(measured.map((r) => r.scores[tier].after.edgeF1)),
        median: median(measured.map((r) => r.scores[tier].after.edgeF1)),
        paired: summary(paired),
        changed: summary(changed),
        worstDeclines: [...changed]
          .sort((a, b) => a.scores[tier].delta - b.scores[tier].delta)
          .slice(0, 12)
          .map((r) => ({ id: r.id, name: r.name, delta: r.scores[tier].delta })),
      },
    ];
  }),
);
const report = {
  schemaVersion: 1,
  set,
  planHash: hash(await readFile(planFile)),
  captureHash: current.hash,
  baselineHash: baseline?.hash ?? null,
  rendererHash: current.capture.rendererHash,
  metricVersion: METRIC_VERSION,
  alignment: plan.alignment,
  rect,
  scope:
    'Body-region corpus diagnostics at shared identity registration, not whole-card accuracy or independent held-out validation.',
  limitations: [
    'Texture, scan placement and source wording differences can lower or inflate structural scores.',
    'Printing-reference text is not scan-certified; oracle-unverified rows are unsuitable for exact wording alignment.',
    'Changed input hashes are excluded from paired comparisons. Beta has no full-corpus baseline.',
    'OCR line geometry remains a separate pending diagnostic; no OCR result is implied by this report.',
  ],
  rendered: rows.filter((r) => !r.issue).length,
  failed: rows.filter((r) => r.issue).map((r) => ({ id: r.id, issue: r.issue })),
  overflow: rows.filter((r) => r.layout?.overflow).map((r) => r.id),
  contentCounts: Object.fromEntries(
    ['scan-reviewed', 'printing-reference', 'oracle-unverified'].map((s) => [
      s,
      rows.filter((r) => r.contentStatus === s).length,
    ]),
  ),
  tiers,
  timing: {
    elapsedMs: performance.now() - started,
    scope:
      'Serial Node hash checks, PNG decoding, normalization and CPU scoring; no browser, GPU, network or rendering.',
  },
  rows,
};
await writeJson(path.join(fixtureRoot, set, 'early-centered-corpus-measurement.json'), report);
console.log(
  JSON.stringify(
    {
      set,
      rendered: report.rendered,
      failed: report.failed,
      overflow: report.overflow,
      content: report.contentCounts,
      tiers,
      timing: report.timing,
    },
    null,
    2,
  ),
);
