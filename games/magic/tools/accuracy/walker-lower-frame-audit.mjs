import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, hash, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import {
  measureLowerFrame,
  lowerFrameDifference,
  LOWER_FRAME_VERSION,
  LOWER_FRAME_WINDOWS,
} from './lower-frame-geometry.mjs';

const planName = 'planeswalker-lower-panel-plan.json',
  run = 'walker-lower-panel';
const planBytes = await readFile(`${fixtureRoot}/${planName}`),
  plan = JSON.parse(planBytes);
const captures = {},
  rows = [];
const started = performance.now();
async function capture(set, name) {
  const key = `${set}/${name}`;
  if (!captures[key]) {
    const bytes = await readFile(`${outputRoot}/${key}/capture.json`);
    captures[key] = { hash: hash(bytes), data: JSON.parse(bytes) };
  }
  return captures[key].data;
}
async function raster(set, name, asset, transform) {
  const bytes = await readFile(`${outputRoot}/${set}/${name}/${asset.file}`);
  assert.equal(hash(bytes), asset.sha256);
  return normalize(PNG.sync.read(bytes, { checkCRC: true }), transform);
}
const rect = [25, 612, 360, 32];
function score(reference, rendered) {
  const a = cropGray(reference, rect),
    b = cropGray(rendered, rect);
  const result = compareRegion(a.gray, b.gray, a.width, a.height);
  return {
    status: result.status,
    edgeF1: result.edgeF1?.[1] ?? null,
    p95: result.p95Distance ?? null,
  };
}
for (const card of plan.cards) {
  const beforeCapture = await capture(card.set, card.baseline),
    afterCapture = await capture(card.set, run);
  assert.equal(afterCapture.rendererHash, plan.frozenRendererHash);
  const before = beforeCapture.results.find((r) => r.id === card.id),
    after = afterCapture.results.find((r) => r.id === card.id);
  assert.ok(before && after && !before.issue && !after.issue);
  assert.equal(before.inputHash, card.inputHash);
  assert.equal(after.inputHash, card.inputHash);
  assert.equal(before.images.reference.sha256, card.referenceHash);
  assert.equal(after.images.reference.sha256, card.referenceHash);
  assert.deepEqual(before.specialLayout, after.specialLayout);
  assert.ok(!after.specialLayout.some((r) => r.layout.overflow));
  const transforms = { raw: {} };
  if (plan.alignment.profileHashes[card.set]) {
    const bytes = await readFile(`${fixtureRoot}/${card.set}/alignment.json`);
    assert.equal(hash(bytes), plan.alignment.profileHashes[card.set]);
    transforms.registered = JSON.parse(bytes).frameFamilies.planeswalker.transform;
  }
  const references = {},
    landmarks = {},
    deltas = {},
    overlap = {},
    upperUnchanged = {};
  for (const [key, transform] of Object.entries(transforms)) {
    references[key] = await raster(card.set, run, after.images.reference, transform);
    landmarks[key] = measureLowerFrame(references[key]);
  }
  const inkBottom = Math.max(
    ...after.specialLayout.flatMap((r) =>
      r.layout.lines.flatMap((l) => (l.inkBounds ? [l.inkBounds[1] + l.inkBounds[3]] : [])),
    ),
  );
  const clearance = {};
  for (const tier of ['inspect', 'table']) {
    const a = await raster(card.set, card.baseline, before.images[tier]),
      b = await raster(card.set, run, after.images[tier]);
    const upperEnd = (card.frame === 'planeswalker-large' ? 382 : 429) - 2;
    let changedBytes = 0,
      maxChannelDifference = 0;
    for (let i = 0; i < upperEnd * 488 * 4; i++) {
      changedBytes += Number(a.data[i] !== b.data[i]);
      maxChannelDifference = Math.max(maxChannelDifference, Math.abs(a.data[i] - b.data[i]));
    }
    upperUnchanged[tier] = { endY: upperEnd, changedBytes, maxChannelDifference };
    // Splitting a scaled image into source rectangles can round a channel by
    // one 8-bit unit. Any larger difference requires inspection, not tolerance.
    assert.ok(maxChannelDifference <= 1, 'Upper frame changed beyond rounding');
    landmarks[tier] = { before: measureLowerFrame(a), after: measureLowerFrame(b) };
    deltas[tier] = {};
    overlap[tier] = {};
    for (const [key, ref] of Object.entries(references)) {
      deltas[tier][key] = {
        before: lowerFrameDifference(landmarks[key], landmarks[tier].before),
        after: lowerFrameDifference(landmarks[key], landmarks[tier].after),
      };
      overlap[tier][key] = { before: score(ref, a), after: score(ref, b) };
    }
    const inner = landmarks[tier].after.filter((r) => r.status === 'measured').map((r) => r.inner);
    clearance[tier] = inner.length ? Math.min(...inner) - inkBottom : null;
  }
  rows.push({ ...card, landmarks, deltas, overlap, upperUnchanged, inkBottom, clearance });
}
const summary = {};
for (const cohort of ['development', 'set-transfer']) {
  const cards = rows.filter((r) => r.cohort === cohort);
  summary[cohort] = { cards: cards.length };
  for (const tier of ['inspect', 'table']) {
    const tierSummary = {};
    summary[cohort][tier] = tierSummary;
    for (const registration of ['raw', 'registered']) {
      const available = cards.filter((r) => r.deltas[tier][registration]);
      if (!available.length) continue;
      const samples = available.flatMap((r) =>
        r.deltas[tier][registration].before.map((before, i) => ({
          before,
          after: r.deltas[tier][registration].after[i],
        })),
      );
      const pairs = samples.filter(
        (p) => p.before.status === 'measured' && p.after.status === 'measured',
      );
      tierSummary[registration] = {
        total: samples.length,
        paired: pairs.length,
        uncertain: samples.length - pairs.length,
        ...Object.fromEntries(
          ['inner', 'outer'].map((edge) => [
            edge,
            {
              beforeSigned: median(pairs.map((p) => p.before[edge])),
              afterSigned: median(pairs.map((p) => p.after[edge])),
              beforeAbsolute: median(pairs.map((p) => Math.abs(p.before[edge]))),
              afterAbsolute: median(pairs.map((p) => Math.abs(p.after[edge]))),
              improved: pairs.filter(
                (p) => Math.abs(p.before[edge]) - Math.abs(p.after[edge]) > 0.5,
              ).length,
              regressed: pairs.filter(
                (p) => Math.abs(p.after[edge]) - Math.abs(p.before[edge]) > 0.5,
              ).length,
            },
          ]),
        ),
      };
    }
  }
}
const report = {
  schemaVersion: 1,
  method: LOWER_FRAME_VERSION,
  windows: LOWER_FRAME_WINDOWS,
  methodHash: hash(await readFile(new URL('./lower-frame-geometry.mjs', import.meta.url))),
  studyHash: hash(await readFile(new URL(import.meta.url))),
  planName,
  planHash: hash(planBytes),
  run,
  captures: Object.fromEntries(
    Object.entries(captures).map(([k, v]) => [
      k,
      { hash: v.hash, rendererHash: v.data.rendererHash },
    ]),
  ),
  limitations: [
    'Independent signed transitions, not outline recognition. Dark/missing, merged and competing transitions stay uncertain.',
    'Aggregate before/after errors use only samples reliable on both sides; counts retain every uncertain sample.',
    'Four fixed strips avoid the central stamp and starting loyalty. Curved ends and missing stamp remain outside this measurement.',
    'M19 was reserved before viewing its scans/results; its ten cards test only this lower-panel correction, not typography or wording.',
    'Raw scores are primary. Earlier M15/WAR registration remains transferred-unvalidated; M19 has no fitted alignment.',
    'Text clearance uses the lowest measured straight rim and lowest glyph bound: conservative diagnostic, not a pixel-accurate occlusion test.',
  ],
  summary,
  rows,
  timing: {
    milliseconds: performance.now() - started,
    scope: 'CPU cached PNG decoding and analysis; no Chromium or GPU work.',
  },
};
await writeJson(`${fixtureRoot}/walker-lower-panel-geometry-measurement.json`, report);
console.log(JSON.stringify(summary, null, 2));
console.log(
  'Clearance under 3px:',
  rows
    .filter((r) => r.clearance.inspect !== null && r.clearance.inspect < 3)
    .map((r) => [r.set, r.number, r.clearance.inspect]),
);
