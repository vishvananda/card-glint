import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, writeJson, hash } from './common.mjs';
import { normalize } from './pixels.mjs';
import { median } from './metrics.mjs';
import { measurePlate, plateDifference, PLATE_GEOMETRY_VERSION } from './plate-geometry.mjs';

const planName = process.argv[2] ?? 'planeswalker-type-symbol-plan.json';
const run = process.argv[3] ?? 'walker-type-symbol';
const baseline = process.argv[4] ?? 'walker-type-shadow';
for (const value of [run, baseline]) assert.match(value, /^[a-z0-9-]+$/);
assert.match(planName, /^[a-z0-9-]+\.json$/);
const bytes = await readFile(`${fixtureRoot}/${planName}`),
  plan = JSON.parse(bytes);
const windows = {
  planeswalker: {
    top: [372, 392],
    bottom: [409, 434],
    spans: [
      [95, 70],
      [220, 70],
      [325, 60],
    ],
    inkX: [60, 360],
  },
  'planeswalker-large': {
    top: [326, 346],
    bottom: [363, 388],
    spans: [
      [95, 70],
      [220, 70],
      [325, 60],
    ],
    inkX: [60, 360],
  },
};
const captures = {},
  rows = [];
const started = performance.now();
async function capture(set, run) {
  const key = `${set}/${run}`;
  if (!captures[key]) {
    const bytes = await readFile(`${outputRoot}/${key}/capture.json`);
    captures[key] = { hash: hash(bytes), data: JSON.parse(bytes) };
  }
  return captures[key].data;
}
async function raster(set, run, asset, transform) {
  const bytes = await readFile(`${outputRoot}/${set}/${run}/${asset.file}`);
  assert.equal(hash(bytes), asset.sha256);
  return normalize(PNG.sync.read(bytes, { checkCRC: true }), transform);
}
for (const card of plan.cards) {
  const a = (await capture(card.set, baseline)).results.find((r) => r.id === card.id);
  const b = (await capture(card.set, run)).results.find((r) => r.id === card.id);
  assert.ok(a && b && !a.issue && !b.issue);
  assert.equal(a.inputHash, card.inputHash);
  assert.equal(b.inputHash, card.inputHash);
  assert.equal(b.images.reference.sha256, card.referenceHash);
  const profileBytes = await readFile(`${fixtureRoot}/${card.set}/alignment.json`);
  assert.equal(hash(profileBytes), plan.alignment.profileHashes[card.set]);
  const transform = JSON.parse(profileBytes).frameFamilies.planeswalker.transform;
  const policy = windows[card.frame];
  assert.ok(policy);
  const reference = {},
    renders = {},
    differences = {},
    change = {},
    shadowTail = {};
  for (const [registration, alignment] of Object.entries({ raw: {}, registered: transform }))
    reference[registration] = measurePlate(
      await raster(card.set, run, b.images.reference, alignment),
      policy,
    );
  for (const tier of ['inspect', 'table']) {
    const beforeImage = await raster(card.set, baseline, a.images[tier]);
    const afterImage = await raster(card.set, run, b.images[tier]);
    renders[tier] = {
      before: measurePlate(beforeImage, policy),
      after: measurePlate(afterImage, policy),
    };
    const rect = [100, card.frame === 'planeswalker-large' ? 381 : 427, 270, 2];
    let changedPixels = 0,
      maxChannelDifference = 0;
    for (let y = rect[1]; y < rect[1] + rect[3]; y++)
      for (let x = rect[0]; x < rect[0] + rect[2]; x++) {
        let changed = false;
        for (let c = 0; c < 3; c++) {
          const i = (y * 488 + x) * 4 + c;
          const difference = Math.abs(beforeImage.data[i] - afterImage.data[i]);
          changed ||= difference > 0;
          maxChannelDifference = Math.max(maxChannelDifference, difference);
        }
        changedPixels += Number(changed);
      }
    shadowTail[tier] = { rect, changedPixels, maxChannelDifference };
    change[tier] = plateDifference(renders[tier].before, renders[tier].after);
    differences[tier] = Object.fromEntries(
      Object.entries(reference).map(([registration, ref]) => [
        registration,
        {
          before: plateDifference(ref, renders[tier].before),
          after: plateDifference(ref, renders[tier].after),
        },
      ]),
    );
  }
  rows.push({
    set: card.set,
    number: card.number,
    name: card.name,
    id: card.id,
    frame: card.frame,
    inputHash: card.inputHash,
    referenceHash: card.referenceHash,
    reference,
    renders,
    differences,
    change,
    shadowTail,
  });
}
function summarize(values) {
  const accepted = values.filter((v) => v.status === 'measured');
  const ink = accepted.flatMap((v) => (v.ink ? [v.ink] : []));
  return {
    total: values.length,
    measured: accepted.length,
    uncertain: values.length - accepted.length,
    inkMeasured: ink.length,
    median: Object.fromEntries(
      ['top', 'bottom', 'center', 'height'].map((k) => [k, median(accepted.map((v) => v[k]))]),
    ),
    inkMedian: Object.fromEntries(
      ['top', 'bottom', 'center', 'height', 'plateCenterOffset'].map((k) => [
        k,
        median(ink.map((v) => v[k])),
      ]),
    ),
  };
}
const summary = {};
for (const set of [...new Set(rows.map((r) => r.set))]) {
  const group = rows.filter((r) => r.set === set);
  summary[set] = Object.fromEntries(
    ['inspect', 'table'].map((tier) => [
      tier,
      {
        change: summarize(group.map((r) => r.change[tier])),
        ...Object.fromEntries(
          ['raw', 'registered'].map((registration) => [
            registration,
            Object.fromEntries(
              ['before', 'after'].map((version) => [
                version,
                summarize(group.map((r) => r.differences[tier][registration][version])),
              ]),
            ),
          ]),
        ),
      },
    ]),
  );
}
const report = {
  schemaVersion: 1,
  method: PLATE_GEOMETRY_VERSION,
  methodHash: hash(await readFile(new URL('./plate-geometry.mjs', import.meta.url))),
  studyHash: hash(await readFile(new URL(import.meta.url))),
  planName,
  planHash: hash(bytes),
  run,
  baseline,
  windows,
  scope:
    'Independent top/bottom paper transitions and interior lettering bounds on the 70 examined planeswalkers. Same input and frozen shared registration; no per-scan fitting.',
  limitations: [
    'Straight central edges only; this does not certify curved ends, outer bevel or soft shadow shape.',
    'Search-window, competing-edge and strip disagreement failures stay uncertain, not zero-error.',
    'Interior ink bounds use a fixed text sample excluding curved ends and set symbols; they are not whole-line bounds, word recognition or glyph-shape accuracy.',
    'The M15/WAR registration remains transferred-unvalidated. Retain raw and registered results separately.',
    'All cards were already inspected. This is confirmation, not fresh held-out validation.',
  ],
  captures: Object.fromEntries(
    Object.entries(captures).map(([k, v]) => [
      k,
      { hash: v.hash, rendererHash: v.data.rendererHash },
    ]),
  ),
  summary,
  rows,
  timing: {
    milliseconds: performance.now() - started,
    scope:
      'CPU PNG decoding, normalization and geometry measurement from cached rasters; no Chromium or GPU execution.',
  },
};
await writeJson(`${fixtureRoot}/${run}-geometry-measurement.json`, report);
console.log(JSON.stringify(summary, null, 2));
